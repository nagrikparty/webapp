import type { APIRoute } from "astro";
import { requireRole, logAuditEvent } from "@/lib/auth";
import { createApiSupabase } from "@/lib/supabase";

export const GET: APIRoute = async ({ request }) => {
  const authResult = await requireRole(request, ["VERIFIER", "ADMIN", "SUPER_ADMIN"]);
  if ("response" in authResult) return authResult.response;
  const { ctx } = authResult;

  try {
    const scopedSupabase = createApiSupabase(ctx.token);
    if (!scopedSupabase) {
      return new Response(JSON.stringify({ error: "Database client unavailable" }), { status: 500 });
    }

    const { data: applications, error } = await scopedSupabase
      .from("membership_applications")
      .select("*, member_addresses(*), electoral_details(*), member_participation(*), membership_declarations(*), membership_consents(*), signatures(*), documents(*, document_extractions(*)), membership_status_history(*)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch verifications error:", error);
      return new Response(JSON.stringify({ error: "Failed to load applications" }), { status: 500 });
    }

    return new Response(JSON.stringify({ applications }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal error" }),
      { status: 500 }
    );
  }
};

export const POST: APIRoute = async ({ request }) => {
  const authResult = await requireRole(request, ["VERIFIER", "ADMIN", "SUPER_ADMIN"]);
  if ("response" in authResult) return authResult.response;
  const { ctx } = authResult;

  try {
    const body = await request.json();
    const applicationId = body.applicationId || body.application_id;
    const action = body.action;
    const notes = body.notes;
    const rejectionReason = body.rejectionReason || body.rejection_reason;

    if (!applicationId || !["APPROVE", "REJECT", "REQUEST_CORRECTION"].includes(action)) {
      return new Response(JSON.stringify({ error: "Invalid parameters" }), { status: 400 });
    }

    const scopedSupabase = createApiSupabase(ctx.token);
    if (!scopedSupabase) {
      return new Response(JSON.stringify({ error: "Database client unavailable" }), { status: 500 });
    }

    // Fetch the application with all required scrutiny components
    const { data: app, error: appError } = await scopedSupabase
      .from("membership_applications")
      .select("*, member_addresses(*), electoral_details(*), membership_declarations(*), membership_consents(*), signatures(*), documents(*)")
      .eq("id", applicationId)
      .single();

    if (appError || !app) {
      return new Response(JSON.stringify({ error: "Application not found" }), { status: 404 });
    }

    // Integrity enforcement: Verifiers cannot approve their own application
    if (action === "APPROVE" && app.user_id === ctx.user.id) {
      return new Response(
        JSON.stringify({ error: "Integrity violation: Self-approval is strictly prohibited under organizational rules." }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // Idempotency: If already approved, return existing member ID cleanly
    if (action === "APPROVE" && app.status === "APPROVED") {
      const { data: existingMem } = await scopedSupabase
        .from("members")
        .select("membership_id")
        .eq("application_id", app.id)
        .maybeSingle();

      if (existingMem?.membership_id) {
        return new Response(
          JSON.stringify({ success: true, message: "Application already approved", membership_id: existingMem.membership_id }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    const now = new Date().toISOString();

    if (action === "APPROVE") {
      // 1. State Machine Guard: Approval is strictly allowed only from reviewable states
      const REVIEWABLE_STATES = ["SUBMITTED", "UNDER_REVIEW", "NEEDS_CORRECTION"];
      if (!REVIEWABLE_STATES.includes(app.status)) {
        return new Response(
          JSON.stringify({
            error: `Cannot approve application from status "${app.status}". Only reviewable applications (${REVIEWABLE_STATES.join(", ")}) may be approved.`,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // 2. Scrutiny Evidence Validation - ONLY actual persisted data (Zero synthetic fallbacks)
      const missing: string[] = [];

      // A. Address: Require actual member_addresses record with all required fields
      const addressData = Array.isArray(app.member_addresses) && app.member_addresses.length > 0
        ? app.member_addresses[0]
        : null;

      if (!addressData || !addressData.full_legal_name || !addressData.address_line1 || !addressData.vidhan_sabha || !addressData.pincode) {
        missing.push("Residential Address & Delhi Vidhan Sabha (valid member_addresses record required)");
      }

      // B. Identity Evidence Document: Require actual persisted documents in vault
      const rawDocs = Array.isArray(app.documents) ? app.documents : [];
      const validDocs = rawDocs.filter((d: { storage_path?: string; sha256_hash?: string; verification_status?: string }) =>
        Boolean(d.storage_path && d.sha256_hash && d.verification_status !== "REJECTED")
      );

      if (validDocs.length === 0) {
        missing.push("Identity Evidence Document (persisted document record in vault required)");
      }

      // C. Constitutional Declaration: Require actual affirmative declaration state from database
      const decl = Array.isArray(app.membership_declarations) && app.membership_declarations.length > 0
        ? app.membership_declarations[0]
        : null;

      if (
        !decl ||
        decl.accepts_constitution !== true ||
        decl.bears_true_faith !== true ||
        decl.upholds_sovereignty !== true ||
        decl.no_other_party_membership !== true ||
        !decl.agreed_at
      ) {
        missing.push("Constitutional Declaration (§29A RPA 1951 affirmative declaration required)");
      }

      // D. Statutory Data Consent: Require actual affirmative consent record from database
      const cons = Array.isArray(app.membership_consents) && app.membership_consents.length > 0
        ? app.membership_consents[0]
        : null;

      if (!cons || !cons.agreed_at) {
        missing.push("Statutory Data Consent (DPDP compliance consent record required)");
      }

      // E. Signature: Require actual typed/signed confirmation record from database
      const sig = Array.isArray(app.signatures) && app.signatures.length > 0
        ? app.signatures[0]
        : null;

      if (!sig || !sig.typed_name || !sig.typed_name.trim() || !sig.signed_at) {
        missing.push("Confirmation Signature (verified signature record required)");
      }

      if (missing.length > 0) {
        return new Response(
          JSON.stringify({
            error: `Cannot approve application. Missing required statutory items: ${missing.join("; ")}`,
            missing_requirements: missing,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // 3. Authoritative Membership ID Resolution:
      // Re-use existing assigned ID on retry; otherwise allocate from database sequence (No Date.now() fallback)
      let membershipId: string;
      const { data: existingUserMem } = await scopedSupabase
        .from("members")
        .select("*")
        .or(`user_id.eq.${app.user_id},application_id.eq.${app.id}`)
        .maybeSingle();

      if (existingUserMem?.membership_id) {
        membershipId = existingUserMem.membership_id;
      } else {
        const { data: seqData, error: seqError } = await scopedSupabase.rpc("generate_membership_id");
        if (seqError || !seqData || typeof seqData !== "string" || !seqData.startsWith("NAG-")) {
          console.error("Failed to generate membership ID sequence:", seqError);
          return new Response(
            JSON.stringify({ error: "System failure: Unable to allocate authoritative membership sequence ID." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
        membershipId = seqData;
      }

      const memberName = addressData.full_legal_name;

      // 4. Transactionally Safe Execution Pipeline:
      // Perform dependent operations first; application status is updated to APPROVED ONLY if all operations succeed.

      // Step 4.1: Upsert / Insert Member Record
      let memberRecord: { id: string; membership_id: string } | null = null;
      if (existingUserMem) {
        const { data: updatedMem, error: memUpError } = await scopedSupabase
          .from("members")
          .update({
            application_id: app.id,
            full_name: memberName,
            category: app.membership_category || "Primary Member",
            status: "APPROVED",
            approved_at: now,
            approved_by: ctx.user.id,
          })
          .eq("id", existingUserMem.id)
          .select()
          .single();

        if (memUpError || !updatedMem) {
          console.error("Member update error:", memUpError);
          throw memUpError || new Error("Failed to update member record");
        }
        memberRecord = updatedMem;
      } else {
        const { data: newMem, error: memInsertError } = await scopedSupabase
          .from("members")
          .insert({
            user_id: app.user_id,
            application_id: app.id,
            membership_id: membershipId,
            full_name: memberName,
            category: app.membership_category || "Primary Member",
            status: "APPROVED",
            approved_at: now,
            approved_by: ctx.user.id,
          })
          .select()
          .single();

        if (memInsertError || !newMem) {
          console.error("Member insert error:", memInsertError);
          throw memInsertError || new Error("Failed to create member record");
        }
        memberRecord = newMem;
      }

      if (!memberRecord) {
        throw new Error("Failed to resolve member record");
      }

      const assignedId = memberRecord.membership_id || membershipId;

      // Step 4.2: Ensure exactly one Active Card exists (card_version = 1 on initial approval)
      const { data: existingActiveCard } = await scopedSupabase
        .from("membership_cards")
        .select("id")
        .eq("member_id", memberRecord.id)
        .eq("status", "ACTIVE")
        .maybeSingle();

      if (!existingActiveCard) {
        const qrToken = crypto.randomUUID();
        const { error: cardError } = await scopedSupabase.from("membership_cards").insert({
          member_id: memberRecord.id,
          card_number: assignedId,
          card_version: 1,
          status: "ACTIVE",
          qr_token: qrToken,
          verification_slug: assignedId,
          issue_date: now.split("T")[0],
        });
        if (cardError) {
          console.error("Card creation error:", cardError);
          throw cardError;
        }
      }

      // Step 4.3: Transition Document Provenance to ORGANISATION VERIFIED
      for (const doc of validDocs) {
        await scopedSupabase
          .from("documents")
          .update({
            verification_status: "VERIFIED",
            verified_by: ctx.user.id,
            verified_at: now,
            member_id: memberRecord.id,
          })
          .eq("id", doc.id);

        await scopedSupabase.from("document_verifications").insert({
          document_id: doc.id,
          verifier_id: ctx.user.id,
          action: "APPROVE",
          notes: notes || "Verified during statutory scrutiny and approval",
        });
      }

      // Step 4.4: Update user profile role to MEMBER if currently PUBLIC
      const { data: userProfile } = await scopedSupabase
        .from("profiles")
        .select("role")
        .eq("id", app.user_id)
        .single();

      if (userProfile && userProfile.role === "PUBLIC") {
        const { error: profileErr } = await scopedSupabase
          .from("profiles")
          .update({ role: "MEMBER" })
          .eq("id", app.user_id);
        if (profileErr) {
          console.error("Profile role update error:", profileErr);
          throw profileErr;
        }
      }

      // Step 4.5: Record Status History
      await scopedSupabase.from("membership_status_history").insert({
        application_id: app.id,
        member_id: memberRecord.id,
        previous_status: app.status,
        new_status: "APPROVED",
        changed_by: ctx.user.id,
        reason: notes || "Application verified and approved by staff.",
      });

      // Step 4.6: ONLY NOW update application status to APPROVED
      const { error: appUpdateErr } = await scopedSupabase
        .from("membership_applications")
        .update({
          status: "APPROVED",
          reviewed_by: ctx.user.id,
          reviewed_at: now,
          correction_notes: notes || null,
        })
        .eq("id", applicationId);

      if (appUpdateErr) {
        console.error("Application status update error:", appUpdateErr);
        throw appUpdateErr;
      }

      // Step 4.7: Audit Log
      await logAuditEvent(
        ctx.user.id,
        ctx.profile.role,
        "MEMBERSHIP_APPROVED",
        "members",
        memberRecord.id,
        {
          membership_id: assignedId,
          application_id: applicationId,
          notes,
        },
        request
      );

      return new Response(
        JSON.stringify({ success: true, membership_id: assignedId }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } else if (action === "REJECT") {
      await scopedSupabase
        .from("membership_applications")
        .update({
          status: "REJECTED",
          reviewed_by: ctx.user.id,
          reviewed_at: now,
          rejection_reason: rejectionReason || notes || "Did not meet criteria",
        })
        .eq("id", applicationId);

      await scopedSupabase.from("membership_status_history").insert({
        application_id: app.id,
        previous_status: app.status,
        new_status: "REJECTED",
        changed_by: ctx.user.id,
        reason: rejectionReason || notes || "Rejected",
      });

      await logAuditEvent(
        ctx.user.id,
        ctx.profile.role,
        "APPLICATION_REJECTED",
        "membership_applications",
        applicationId,
        { reason: rejectionReason || notes },
        request
      );

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else if (action === "REQUEST_CORRECTION") {
      await scopedSupabase
        .from("membership_applications")
        .update({
          status: "NEEDS_CORRECTION",
          reviewed_by: ctx.user.id,
          reviewed_at: now,
          correction_notes: notes || "Please correct the indicated details.",
        })
        .eq("id", applicationId);

      await scopedSupabase.from("membership_status_history").insert({
        application_id: app.id,
        previous_status: app.status,
        new_status: "NEEDS_CORRECTION",
        changed_by: ctx.user.id,
        reason: notes || "Correction requested",
      });

      await logAuditEvent(
        ctx.user.id,
        ctx.profile.role,
        "CORRECTION_REQUESTED",
        "membership_applications",
        applicationId,
        { notes },
        request
      );

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unhandled action" }), { status: 400 });
  } catch (err: unknown) {
    console.error("Verification processing error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal error" }),
      { status: 500 }
    );
  }
};
