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
    const { applicationId, action, notes, rejectionReason } = await request.json();

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

      if (existingMem) {
        return new Response(
          JSON.stringify({ success: true, message: "Application already approved", membership_id: existingMem.membership_id }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    const now = new Date().toISOString();

    if (action === "APPROVE") {
      const addressData = Array.isArray(app.member_addresses)
        ? app.member_addresses[0]
        : app.member_addresses;
      const memberName = addressData?.full_legal_name || app.full_name;
      const docs = Array.isArray(app.documents) ? app.documents : [];
      const decl = Array.isArray(app.membership_declarations) ? app.membership_declarations[0] : app.membership_declarations;
      const cons = Array.isArray(app.membership_consents) ? app.membership_consents[0] : app.membership_consents;
      const sig = Array.isArray(app.signatures) ? app.signatures[0] : app.signatures;

      // Validate required scrutiny conditions before admitting member
      const missing: string[] = [];
      if (!memberName) missing.push("Legal Full Name");
      if (!addressData?.address_line1 || !addressData?.vidhan_sabha) missing.push("Residential Address / Constituency");
      if (!docs || docs.length === 0) missing.push("Identity Evidence Document");
      if (!decl || decl.accepts_constitution === false) missing.push("Constitutional Declaration");
      if (!cons) missing.push("Data Consent Framework");
      if (!sig || !sig.typed_name) missing.push("Confirmation Signature");

      if (missing.length > 0) {
        return new Response(
          JSON.stringify({
            error: `Cannot approve application. Missing required statutory items: ${missing.join(", ")}`,
            missing_requirements: missing,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // 1. Generate sequential Membership ID (server-generated NAG-000001 format)
      const { data: seqData } = await scopedSupabase.rpc("generate_membership_id");
      const membershipId = seqData || `NAG-${Date.now().toString().slice(-6)}`;

      // 2. Safe idempotent upsert into members table
      let memberRecord: { id: string; membership_id: string } | null = null;
      const { data: existingUserMem } = await scopedSupabase
        .from("members")
        .select("*")
        .eq("user_id", app.user_id)
        .maybeSingle();

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
        if (memUpError) throw memUpError;
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
          return new Response(JSON.stringify({ error: "Failed to create member record" }), { status: 500 });
        }
        memberRecord = newMem;
      }

      if (!memberRecord) {
        return new Response(JSON.stringify({ error: "Failed to resolve member record" }), { status: 500 });
      }

      const assignedId = memberRecord.membership_id || membershipId;

      // 3. Issue Active Membership Card if none active
      const { data: existingActiveCard } = await scopedSupabase
        .from("membership_cards")
        .select("id")
        .eq("member_id", memberRecord.id)
        .eq("status", "ACTIVE")
        .maybeSingle();

      if (!existingActiveCard) {
        const qrToken = crypto.randomUUID();
        await scopedSupabase.from("membership_cards").insert({
          member_id: memberRecord.id,
          card_number: assignedId,
          card_version: 1,
          status: "ACTIVE",
          qr_token: qrToken,
          verification_slug: assignedId,
          issue_date: now.split("T")[0],
        });
      }

      // 4. Update application status
      await scopedSupabase
        .from("membership_applications")
        .update({
          status: "APPROVED",
          reviewed_by: ctx.user.id,
          reviewed_at: now,
          correction_notes: notes || null,
        })
        .eq("id", applicationId);

      // 5. Update user profile role if PUBLIC
      const { data: userProfile } = await scopedSupabase
        .from("profiles")
        .select("role")
        .eq("id", app.user_id)
        .single();

      if (userProfile && userProfile.role === "PUBLIC") {
        await scopedSupabase
          .from("profiles")
          .update({ role: "MEMBER" })
          .eq("id", app.user_id);
      }

      // 6. Record Status History & Audit Log
      await scopedSupabase.from("membership_status_history").insert({
        application_id: app.id,
        member_id: memberRecord.id,
        previous_status: app.status,
        new_status: "APPROVED",
        changed_by: ctx.user.id,
        reason: notes || "Application verified and approved by staff.",
      });

      await logAuditEvent(
        ctx.user.id,
        ctx.profile.role,
        "MEMBERSHIP_APPROVED",
        "members",
        memberRecord.id,
        {
          membership_id: membershipId,
          application_id: applicationId,
          notes,
        },
        request
      );

      return new Response(
        JSON.stringify({ success: true, membership_id: membershipId }),
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
