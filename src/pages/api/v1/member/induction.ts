import type { APIRoute } from "astro";
import { requireAuth, logAuditEvent } from "@/lib/auth";
import { createApiSupabase } from "@/lib/supabase";
import { CONSTITUTIONAL_DECLARATION_V1, DATA_CONSENT_V1 } from "@/lib/declarations";
import { reportError } from "@/lib/monitoring";

export const POST: APIRoute = async ({ request }) => {
  const authResult = await requireAuth(request);
  if ("response" in authResult) return authResult.response;
  const { ctx } = authResult;

  try {
    const body = await request.json();
    const {
      personalDetails,
      electoralDetails,
      membershipCategory = "Primary Member",
      participation,
      declaration,
      consent,
      signature,
      action = "submit",
    } = body;

    const scopedSupabase = createApiSupabase(ctx.token);
    if (!scopedSupabase) {
      return new Response(JSON.stringify({ error: "Database client unavailable" }), { status: 500 });
    }

    // Check if an application already exists for this user
    const { data: existingApp } = await scopedSupabase
      .from("membership_applications")
      .select("id, application_number, status")
      .eq("user_id", ctx.user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    let applicationId = existingApp?.id;
    let applicationNumber = existingApp?.application_number;

    if (action !== "draft" && action !== "submit") {
      return new Response(JSON.stringify({ error: "Invalid action. Allowed actions are 'draft' or 'submit'." }), { status: 400 });
    }

    if (existingApp && existingApp.status === "APPROVED") {
      return new Response(JSON.stringify({ error: "You are already an approved member." }), { status: 400 });
    }

    if (existingApp && ["REJECTED", "SUSPENDED", "RESIGNED", "ARCHIVED"].includes(existingApp.status)) {
      return new Response(JSON.stringify({ error: `Application in state ${existingApp.status} cannot be modified.` }), { status: 400 });
    }

    if (existingApp && existingApp.status === "SUBMITTED" && action === "submit") {
      return new Response(JSON.stringify({ error: "Your application is already submitted and under review." }), { status: 400 });
    }

    const newStatus = action === "draft" 
      ? (existingApp?.status === "NEEDS_CORRECTION" ? "NEEDS_CORRECTION" : "DRAFT")
      : "SUBMITTED";

    if (!applicationId) {
      // Create new application
      const { data: newApp, error: appError } = await scopedSupabase
        .from("membership_applications")
        .insert({
          user_id: ctx.user.id,
          status: newStatus,
          membership_category: membershipCategory,
          form_version: "1.0",
          declaration_version: declaration?.declaration_version || CONSTITUTIONAL_DECLARATION_V1.version,
          consent_version: consent?.consent_version || DATA_CONSENT_V1.version,
          submitted_at: action === "submit" ? new Date().toISOString() : null,
        })
        .select("id, application_number, status")
        .single();

      if (appError || !newApp) {
        console.error("Failed to create application:", appError);
        return new Response(JSON.stringify({ error: "Failed to initialize application record" }), { status: 500 });
      }

      applicationId = newApp.id;
      applicationNumber = newApp.application_number;

      await logAuditEvent(
        ctx.user.id,
        ctx.profile.role,
        "APPLICATION_CREATED",
        "membership_applications",
        applicationId,
        { application_number: applicationNumber, status: newStatus },
        request
      );
    } else {
      // Update existing application
      const updatePayload: Record<string, unknown> = {
        membership_category: membershipCategory,
        updated_at: new Date().toISOString(),
      };
      if (action === "submit") {
        updatePayload.status = "SUBMITTED";
        updatePayload.submitted_at = new Date().toISOString();
        updatePayload.correction_notes = null;
      }

      const { error: updateAppErr } = await scopedSupabase
        .from("membership_applications")
        .update(updatePayload)
        .eq("id", applicationId);

      if (updateAppErr) {
        console.error("Failed to update application:", updateAppErr);
        return new Response(JSON.stringify({ error: "Failed to update application record" }), { status: 500 });
      }
    }

    // 1. Personal Details / Member Address
    if (personalDetails) {
      const { error: addrErr } = await scopedSupabase.from("member_addresses").upsert(
        {
          user_id: ctx.user.id,
          application_id: applicationId,
          full_legal_name: personalDetails.full_legal_name || "",
          parent_or_guardian_name: personalDetails.parent_or_guardian_name || "",
          date_of_birth: personalDetails.date_of_birth || "2000-01-01",
          gender: personalDetails.gender || "Other",
          occupation: personalDetails.occupation || null,
          phone: personalDetails.phone || "",
          email: personalDetails.email || ctx.user.email || "",
          address_line1: personalDetails.address_line1 || "",
          address_line2: personalDetails.address_line2 || null,
          state: personalDetails.state || "Delhi",
          district: personalDetails.district || "Delhi",
          lok_sabha: personalDetails.lok_sabha || null,
          vidhan_sabha: personalDetails.vidhan_sabha || "",
          ward: personalDetails.ward || null,
          pincode: personalDetails.pincode || "",
        },
        { onConflict: "application_id" }
      );

      if (addrErr) {
        console.error("Failed to save member address:", addrErr);
        return new Response(JSON.stringify({ error: "Failed to save personal and address details" }), { status: 500 });
      }

      // Sync basic details into profiles
      const { error: profErr } = await scopedSupabase
        .from("profiles")
        .update({
          full_name: personalDetails.full_legal_name,
          phone: personalDetails.phone,
          vidhan_sabha: personalDetails.vidhan_sabha,
          ward: personalDetails.ward,
        })
        .eq("id", ctx.user.id);

      if (profErr) {
        console.warn("Notice: failed to update profile cache:", profErr);
      }
    }

    // 2. Electoral Details
    if (electoralDetails) {
      // If an identity document ID is provided, verify ownership first
      if (electoralDetails.identity_document_id) {
        const { data: docRecord, error: docFindErr } = await scopedSupabase
          .from("documents")
          .select("id, user_id")
          .eq("id", electoralDetails.identity_document_id)
          .eq("user_id", ctx.user.id)
          .maybeSingle();

        if (docFindErr || !docRecord) {
          return new Response(
            JSON.stringify({ error: "Invalid identity document or permission denied" }),
            { status: 403 }
          );
        }
      }

      const { error: elecErr } = await scopedSupabase.from("electoral_details").upsert(
        {
          user_id: ctx.user.id,
          application_id: applicationId,
          identity_proof_type: electoralDetails.identity_proof_type || "Voter ID (EPIC)",
          epic_number: electoralDetails.epic_number || null,
          vidhan_sabha: electoralDetails.vidhan_sabha || null,
          part_number: electoralDetails.part_number || null,
          serial_number: electoralDetails.serial_number || null,
          polling_station: electoralDetails.polling_station || null,
          is_verified: false,
        },
        { onConflict: "application_id" }
      );

      if (elecErr) {
        console.error("Failed to save electoral details:", elecErr);
        return new Response(JSON.stringify({ error: "Failed to save electoral details" }), { status: 500 });
      }

      // Link uploaded document to application and mark MEMBER_CONFIRMED
      if (electoralDetails.identity_document_id) {
        const { error: docUpdateErr } = await scopedSupabase
          .from("documents")
          .update({
            application_id: applicationId,
            verification_status: "MEMBER_CONFIRMED",
            ocr_status: "CONFIRMED_BY_MEMBER",
          })
          .eq("id", electoralDetails.identity_document_id)
          .eq("user_id", ctx.user.id);

        if (docUpdateErr) {
          console.error("Failed to link document:", docUpdateErr);
          return new Response(JSON.stringify({ error: "Failed to link identity document" }), { status: 500 });
        }
      }
    }

    // 3. Member Participation
    if (participation) {
      const { error: partErr } = await scopedSupabase.from("member_participation").upsert(
        {
          user_id: ctx.user.id,
          application_id: applicationId,
          interest_areas: Array.isArray(participation.interest_areas) ? participation.interest_areas : [],
          skills: participation.skills || null,
          availability: participation.availability || null,
          notes: participation.notes || null,
        },
        { onConflict: "application_id" }
      );

      if (partErr) {
        console.error("Failed to save participation details:", partErr);
        return new Response(JSON.stringify({ error: "Failed to save participation details" }), { status: 500 });
      }
    }

    // 4. Constitutional Declaration
    if (declaration) {
      const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for");
      const ua = request.headers.get("user-agent");

      const declarationText = declaration.declaration_text && declaration.declaration_text.length > 50
        ? declaration.declaration_text
        : CONSTITUTIONAL_DECLARATION_V1.text;

      const { error: declErr } = await scopedSupabase.from("membership_declarations").upsert(
        {
          user_id: ctx.user.id,
          application_id: applicationId,
          declaration_text: declarationText,
          declaration_version: declaration.declaration_version || CONSTITUTIONAL_DECLARATION_V1.version,
          bears_true_faith: declaration.bears_true_faith !== false,
          upholds_sovereignty: declaration.upholds_sovereignty !== false,
          accepts_constitution: declaration.accepts_constitution !== false,
          no_other_party_membership: declaration.no_other_party_membership !== false,
          no_prohibited_conduct: declaration.no_prohibited_conduct !== false,
          agreed_at: new Date().toISOString(),
          ip_address: ip,
          user_agent: ua,
        },
        { onConflict: "application_id" }
      );

      if (declErr) {
        console.error("Failed to save declaration:", declErr);
        return new Response(JSON.stringify({ error: "Failed to save membership declaration" }), { status: 500 });
      }
    }

    // 5. Data Consent
    if (consent) {
      const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for");
      const ua = request.headers.get("user-agent");

      const consentText = consent.consent_text && consent.consent_text.length > 50
        ? consent.consent_text
        : DATA_CONSENT_V1.text;

      const { error: consentErr } = await scopedSupabase.from("membership_consents").upsert(
        {
          user_id: ctx.user.id,
          application_id: applicationId,
          consent_text: consentText,
          consent_version: consent.consent_version || DATA_CONSENT_V1.version,
          agreed_at: new Date().toISOString(),
          ip_address: ip,
          user_agent: ua,
        },
        { onConflict: "application_id" }
      );

      if (consentErr) {
        console.error("Failed to save consent:", consentErr);
        return new Response(JSON.stringify({ error: "Failed to save data consent" }), { status: 500 });
      }
    }

    // 6. Signature
    if (signature) {
      const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for");
      const ua = request.headers.get("user-agent");

      const { error: sigErr } = await scopedSupabase.from("signatures").upsert(
        {
          user_id: ctx.user.id,
          application_id: applicationId,
          signature_type: signature.signature_type || "TYPED_CONFIRMATION",
          typed_name: signature.typed_name || null,
          document_id: signature.document_id || null,
          signed_at: new Date().toISOString(),
          ip_address: ip,
          user_agent: ua,
        },
        { onConflict: "application_id" }
      );

      if (sigErr) {
        console.error("Failed to save signature:", sigErr);
        return new Response(JSON.stringify({ error: "Failed to save signature" }), { status: 500 });
      }
    }

    // 7. Status History & Audit Log
    if (action === "submit") {
      // Transition all linked documents to MEMBER_CONFIRMED
      await scopedSupabase
        .from("documents")
        .update({
          verification_status: "MEMBER_CONFIRMED",
          ocr_status: "CONFIRMED_BY_MEMBER",
        })
        .eq("application_id", applicationId)
        .in("verification_status", ["UPLOADED", "OCR_COMPLETE"]);

      await scopedSupabase.from("membership_status_history").insert({
        application_id: applicationId,
        previous_status: existingApp?.status || "DRAFT",
        new_status: "SUBMITTED",
        changed_by: ctx.user.id,
        reason: "Applicant submitted full digital induction",
      });

      await logAuditEvent(
        ctx.user.id,
        ctx.profile.role,
        "APPLICATION_SUBMITTED",
        "membership_applications",
        applicationId,
        { application_number: applicationNumber },
        request
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        application_id: applicationId,
        application_number: applicationNumber,
        status: newStatus,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    reportError(err, { route: "member/induction" });
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal error" }),
      { status: 500 }
    );
  }
};
