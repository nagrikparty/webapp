import type { APIRoute } from "astro";
import { requireAuth, logAuditEvent } from "@/lib/auth";
import { createApiSupabase } from "@/lib/supabase";

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

    const newStatus = action === "draft" ? "DRAFT" : "SUBMITTED";

    if (!applicationId) {
      // Create new application
      const { data: newApp, error: appError } = await scopedSupabase
        .from("membership_applications")
        .insert({
          user_id: ctx.user.id,
          status: newStatus,
          membership_category: membershipCategory,
          form_version: "1.0",
          declaration_version: declaration?.declaration_version || "1.0",
          consent_version: consent?.consent_version || "1.0",
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
    } else {
      // Update existing application
      const updatePayload: Record<string, unknown> = {
        membership_category: membershipCategory,
        updated_at: new Date().toISOString(),
      };
      if (action === "submit") {
        updatePayload.status = "SUBMITTED";
        updatePayload.submitted_at = new Date().toISOString();
      }

      await scopedSupabase
        .from("membership_applications")
        .update(updatePayload)
        .eq("id", applicationId);
    }

    // 1. Personal Details / Member Address
    if (personalDetails) {
      await scopedSupabase.from("member_addresses").upsert(
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

      // Sync basic details into profiles
      await scopedSupabase
        .from("profiles")
        .update({
          full_name: personalDetails.full_legal_name,
          phone: personalDetails.phone,
          vidhan_sabha: personalDetails.vidhan_sabha,
          ward: personalDetails.ward,
        })
        .eq("id", ctx.user.id);
    }

    // 2. Electoral Details
    if (electoralDetails) {
      await scopedSupabase.from("electoral_details").upsert(
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

      // Link uploaded document to application
      if (electoralDetails.identity_document_id) {
        await scopedSupabase
          .from("documents")
          .update({ application_id: applicationId })
          .eq("id", electoralDetails.identity_document_id);
      }
    }

    // 3. Member Participation
    if (participation) {
      await scopedSupabase.from("member_participation").upsert(
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
    }

    // 4. Constitutional Declaration
    if (declaration) {
      const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for");
      const ua = request.headers.get("user-agent");

      await scopedSupabase.from("membership_declarations").upsert(
        {
          user_id: ctx.user.id,
          application_id: applicationId,
          declaration_text: declaration.declaration_text || "Official Nagrik Party Constitutional Declaration",
          declaration_version: declaration.declaration_version || "1.0",
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
    }

    // 5. Data Consent
    if (consent) {
      const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for");
      const ua = request.headers.get("user-agent");

      await scopedSupabase.from("membership_consents").upsert(
        {
          user_id: ctx.user.id,
          application_id: applicationId,
          consent_text: consent.consent_text || "Official Nagrik Party Data Consent",
          consent_version: consent.consent_version || "1.0",
          agreed_at: new Date().toISOString(),
          ip_address: ip,
          user_agent: ua,
        },
        { onConflict: "application_id" }
      );
    }

    // 6. Signature
    if (signature) {
      const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for");
      const ua = request.headers.get("user-agent");

      await scopedSupabase.from("signatures").upsert(
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
    }

    // 7. Status History & Audit Log
    if (action === "submit") {
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
    console.error("Induction processing error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal error" }),
      { status: 500 }
    );
  }
};
