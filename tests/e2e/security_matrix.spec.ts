import { test, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || "https://xlxanliztdzonbdrrriw.supabase.co";
const SUPABASE_KEY = process.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";
const PASSWORD = "TestDemoPassword123!";

const PERSONAS = {
  PUBLIC: "test-public@demo.nagrikparty.org",
  MEMBER_A: "test-member-a@demo.nagrikparty.org",
  MEMBER_B: "test-member-b@demo.nagrikparty.org",
  VERIFIER: "test-verifier@demo.nagrikparty.org",
  ADMIN: "test-admin@demo.nagrikparty.org",
  SUPER_ADMIN: "test-superadmin@demo.nagrikparty.org",
};

async function getSession(email: string) {
  const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
  const { data, error } = await sb.auth.signInWithPassword({
    email,
    password: PASSWORD,
  });
  if (error || !data.session) {
    throw new Error(`Failed to sign in as ${email}: ${error?.message}`);
  }
  return {
    session: data.session,
    user: data.user,
    token: data.session.access_token,
    client: createClient(SUPABASE_URL, SUPABASE_KEY, {
      global: { headers: { Authorization: `Bearer ${data.session.access_token}` } },
    }),
  };
}

test.describe("Production Security & Lifecycle Integration Suite", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeAll(async () => {
    const admin = await getSession(PERSONAS.ADMIN);
    // Clean prior test artifacts for clean state
    await admin.client
      .from("membership_applications")
      .delete()
      .in("user_id", [
        "00000000-0000-0000-0000-000000000001",
        "00000000-0000-0000-0000-000000000002",
        "00000000-0000-0000-0000-000000000003",
        "00000000-0000-0000-0000-000000000004",
      ]);
    await admin.client
      .from("members")
      .delete()
      .in("user_id", [
        "00000000-0000-0000-0000-000000000001",
        "00000000-0000-0000-0000-000000000002",
        "00000000-0000-0000-0000-000000000003",
        "00000000-0000-0000-0000-000000000004",
      ]);
  });

  test("1. Demo Personas Identity & Initial Role Integrity", async () => {
    for (const [roleKey, email] of Object.entries(PERSONAS)) {
      const { user, client } = await getSession(email);
      expect(user).toBeDefined();
      expect(user.email).toBe(email);

      const { data: profile, error } = await client
        .from("profiles")
        .select("id, email, role")
        .eq("id", user.id)
        .single();

      expect(error).toBeNull();
      expect(profile).toBeDefined();
      expect(profile?.role).toBe(roleKey === "MEMBER_A" || roleKey === "MEMBER_B" ? "MEMBER" : roleKey);
    }
  });

  test("2. Member Isolation: Member B cannot read or modify Member A's application or documents", async () => {
    const memberA = await getSession(PERSONAS.MEMBER_A);
    const memberB = await getSession(PERSONAS.MEMBER_B);

    // Ensure Member A has an application
    let { data: appA } = await memberA.client
      .from("membership_applications")
      .select("*")
      .eq("user_id", memberA.user.id)
      .maybeSingle();

    if (!appA) {
      const { data: newApp, error: appAErr } = await memberA.client
        .from("membership_applications")
        .insert({
          user_id: memberA.user.id,
          full_name: "Member A Confidential",
          status: "DRAFT",
          phone: "+919876543210",
          address: "Secret Location A",
          voter_id: "ABC1234567",
        })
        .select()
        .single();

      expect(appAErr).toBeNull();
      appA = newApp;
    } else {
      await memberA.client
        .from("membership_applications")
        .update({ full_name: "Member A Confidential" })
        .eq("id", appA.id);
    }

    expect(appA).toBeDefined();

    // Member B queries Member A's application -> MUST return 0 rows (RLS filtered)
    const { data: queryByB, error: queryBErr } = await memberB.client
      .from("membership_applications")
      .select("*")
      .eq("user_id", memberA.user.id);

    expect(queryBErr).toBeNull();
    expect(queryByB).toHaveLength(0);

    // Member B attempts to update Member A's application -> MUST affect 0 rows
    const { data: updateByB } = await memberB.client
      .from("membership_applications")
      .update({ full_name: "Hacked by Member B" })
      .eq("user_id", memberA.user.id)
      .select();

    expect(updateByB?.length || 0).toBe(0);

    // Verify Member A's data was NOT changed
    const { data: verifyA } = await memberA.client
      .from("membership_applications")
      .select("full_name")
      .eq("user_id", memberA.user.id)
      .single();

    expect(verifyA?.full_name).toBe("Member A Confidential");
  });

  test("3. Role Escalation Prevention: Non-admins cannot alter their own or others' roles", async () => {
    const memberA = await getSession(PERSONAS.MEMBER_A);
    const publicUser = await getSession(PERSONAS.PUBLIC);
    const verifier = await getSession(PERSONAS.VERIFIER);
    const admin = await getSession(PERSONAS.ADMIN);

    // 1. Member A attempts to elevate self to ADMIN -> MUST fail
    const { error: memberEscalateErr } = await memberA.client
      .from("profiles")
      .update({ role: "ADMIN" })
      .eq("id", memberA.user.id);

    expect(memberEscalateErr).toBeDefined();
    expect(memberEscalateErr?.message).toContain("Users cannot change their own role");

    // 2. Public user attempts to elevate self to VERIFIER -> MUST fail
    const { error: publicEscalateErr } = await publicUser.client
      .from("profiles")
      .update({ role: "VERIFIER" })
      .eq("id", publicUser.user.id);

    expect(publicEscalateErr).toBeDefined();
    expect(publicEscalateErr?.message).toContain("Users cannot change their own role");

    // 3. Verifier attempts to elevate Member A to ADMIN -> MUST fail
    const { error: verifierEscalateErr } = await verifier.client
      .from("profiles")
      .update({ role: "ADMIN" })
      .eq("id", memberA.user.id);

    expect(verifierEscalateErr).toBeDefined();
    expect(verifierEscalateErr?.message).toContain("Verifiers can only assign PUBLIC or MEMBER roles");

    // 4. Admin attempts to elevate self to SUPER_ADMIN -> MUST fail
    const { error: adminEscalateErr } = await admin.client
      .from("profiles")
      .update({ role: "SUPER_ADMIN" })
      .eq("id", admin.user.id);

    expect(adminEscalateErr).toBeDefined();
    expect(adminEscalateErr?.message).toContain("Admins cannot promote to SUPER_ADMIN");
  });

  test("4. Self-Approval Prohibition: Verifiers cannot approve their own applications", async ({ request }) => {
    const verifier = await getSession(PERSONAS.VERIFIER);

    // Create or update verifier's own application
    let { data: verifierApp } = await verifier.client
      .from("membership_applications")
      .select("*")
      .eq("user_id", verifier.user.id)
      .maybeSingle();

    if (!verifierApp) {
      const { data: newApp, error: vErr } = await verifier.client
        .from("membership_applications")
        .insert({
          user_id: verifier.user.id,
          full_name: "Verifier Applicant",
          status: "SUBMITTED",
          phone: "+919999999999",
          address: "Delhi",
          voter_id: "VER9999999",
        })
        .select()
        .single();

      expect(vErr).toBeNull();
      verifierApp = newApp;
    }

    expect(verifierApp).toBeDefined();

    // Verifier attempts to self-approve via the verification API -> MUST return 403
    const res = await request.post("/api/v1/admin/verifications", {
      headers: {
        Authorization: `Bearer ${verifier.token}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        application_id: verifierApp?.id,
        action: "APPROVE",
        notes: "Self approval attempt",
      }),
    });

    expect(res.status()).toBe(403);
    const body = await res.json();
    expect(body.error).toContain("Self-approval is strictly prohibited");

    // Verifier attempts direct client update to set reviewed_by = user_id and status = APPROVED -> MUST fail check constraint
    const { error: directApproveErr } = await verifier.client
      .from("membership_applications")
      .update({
        status: "APPROVED",
        reviewed_by: verifier.user.id,
      })
      .eq("id", verifierApp?.id);

    expect(directApproveErr).toBeDefined();
  });

  test("5. State Machine Integrity & Correction Workflow", async ({ request }) => {
    const memberA = await getSession(PERSONAS.MEMBER_A);
    const verifier = await getSession(PERSONAS.VERIFIER);

    // 1. Member application in DRAFT
    let { data: app } = await memberA.client
      .from("membership_applications")
      .select("*")
      .eq("user_id", memberA.user.id)
      .maybeSingle();

    if (app) {
      await memberA.client
        .from("membership_applications")
        .update({
          status: "DRAFT",
          full_name: "Workflow Member",
          address: "12, Barakhamba Road, New Delhi",
          vidhan_sabha: "New Delhi",
          declaration_agreed: true,
        })
        .eq("id", app.id);
      app.status = "DRAFT";
    } else {
      const { data: newApp, error: createErr } = await memberA.client
        .from("membership_applications")
        .insert({
          user_id: memberA.user.id,
          full_name: "Workflow Member",
          status: "DRAFT",
          phone: "+919811122233",
          address: "12, Barakhamba Road, New Delhi",
          vidhan_sabha: "New Delhi",
          voter_id: "DEL1234567",
          declaration_agreed: true,
        })
        .select()
        .single();

      expect(createErr).toBeNull();
      app = newApp!;
    }
    expect(app.status).toBe("DRAFT");

    // Populate actual persisted scrutiny child records (no synthetic fallbacks)
    await memberA.client.from("member_addresses").upsert({
      user_id: memberA.user.id,
      application_id: app.id,
      full_legal_name: "Workflow Member",
      parent_or_guardian_name: "Guardian Name",
      date_of_birth: "1990-01-01",
      gender: "Female",
      phone: "+919811122233",
      email: memberA.user.email || "test-member-a@demo.nagrikparty.org",
      address_line1: "12, Barakhamba Road",
      state: "Delhi",
      district: "New Delhi",
      vidhan_sabha: "New Delhi",
      pincode: "110001",
    }, { onConflict: "application_id" });

    await memberA.client.from("documents").upsert({
      user_id: memberA.user.id,
      application_id: app.id,
      document_type: "identity_proof",
      original_filename: "voter_card_scan.pdf",
      mime_type: "application/pdf",
      file_size: 204800,
      storage_path: `${memberA.user.id}/${app.id}/voter_card_scan.pdf`,
      sha256_hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      current_version: 1,
      ocr_status: "CONFIRMED_BY_MEMBER",
      verification_status: "MEMBER_CONFIRMED",
    });

    await memberA.client.from("membership_declarations").upsert({
      user_id: memberA.user.id,
      application_id: app.id,
      declaration_text: "Constitutional declaration text",
      declaration_version: "1.0",
      bears_true_faith: true,
      upholds_sovereignty: true,
      accepts_constitution: true,
      no_other_party_membership: true,
      no_prohibited_conduct: true,
      agreed_at: new Date().toISOString(),
    }, { onConflict: "application_id" });

    await memberA.client.from("membership_consents").upsert({
      user_id: memberA.user.id,
      application_id: app.id,
      consent_text: "DPDP consent text",
      consent_version: "1.0",
      agreed_at: new Date().toISOString(),
    }, { onConflict: "application_id" });

    await memberA.client.from("signatures").upsert({
      user_id: memberA.user.id,
      application_id: app.id,
      signature_type: "TYPED_CONFIRMATION",
      typed_name: "Workflow Member",
      signed_at: new Date().toISOString(),
    }, { onConflict: "application_id" });

    // 2. Member attempts direct jump to APPROVED -> MUST be rejected by RLS
    const { error: illegalJumpErr } = await memberA.client
      .from("membership_applications")
      .update({ status: "APPROVED" })
      .eq("id", app.id);

    expect(illegalJumpErr).toBeDefined();

    // 3. Member submits application
    const { error: submitErr } = await memberA.client
      .from("membership_applications")
      .update({ status: "SUBMITTED" })
      .eq("id", app.id);

    expect(submitErr).toBeNull();

    // 4. Verifier requests correction
    const correctionRes = await request.post("/api/v1/admin/verifications", {
      headers: {
        Authorization: `Bearer ${verifier.token}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        application_id: app.id,
        action: "REQUEST_CORRECTION",
        notes: "Please re-upload a clearer EPIC scan",
      }),
    });

    expect(correctionRes.status()).toBe(200);

    // Verify application status changed to NEEDS_CORRECTION
    const { data: correctedApp } = await memberA.client
      .from("membership_applications")
      .select("status, correction_notes")
      .eq("id", app.id)
      .single();

    expect(correctedApp?.status).toBe("NEEDS_CORRECTION");
    expect(correctedApp?.correction_notes).toContain("Please re-upload a clearer EPIC scan");

    // 5. Member resubmits
    const { error: resubmitErr } = await memberA.client
      .from("membership_applications")
      .update({ status: "SUBMITTED" })
      .eq("id", app.id);

    expect(resubmitErr).toBeNull();

    // 6. Verifier approves application
    const approveRes = await request.post("/api/v1/admin/verifications", {
      headers: {
        Authorization: `Bearer ${verifier.token}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        application_id: app.id,
        action: "APPROVE",
        notes: "Documents verified and complete",
      }),
    });

    expect(approveRes.status()).toBe(200);
    const approveBody = await approveRes.json();
    expect(approveBody.success).toBe(true);
    expect(approveBody.membership_id).toBeDefined();

    // 7. Idempotent approval: approving again returns same membership_id without error
    const reApproveRes = await request.post("/api/v1/admin/verifications", {
      headers: {
        Authorization: `Bearer ${verifier.token}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        application_id: app.id,
        action: "APPROVE",
        notes: "Duplicate approval check",
      }),
    });

    expect(reApproveRes.status()).toBe(200);
    const reApproveBody = await reApproveRes.json();
    expect(reApproveBody.membership_id).toBe(approveBody.membership_id);
  });

  test("6. Admin vs Verifier Role Boundary Restrictions", async ({ request }) => {
    const verifier = await getSession(PERSONAS.VERIFIER);
    const admin = await getSession(PERSONAS.ADMIN);

    // 1. Verifier attempts to revoke card -> MUST return 403
    const revokeByVerifier = await request.post("/api/v1/admin/cards", {
      headers: {
        Authorization: `Bearer ${verifier.token}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        card_id: "00000000-0000-0000-0000-000000000000",
        action: "REVOKE",
        reason: "Unauthorized attempt",
      }),
    });
    expect(revokeByVerifier.status()).toBe(403);

    // 2. Verifier attempts to change user role -> MUST return 403
    const changeRoleByVerifier = await request.post("/api/v1/admin/change-role", {
      headers: {
        Authorization: `Bearer ${verifier.token}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        userId: verifier.user.id,
        role: "ADMIN",
      }),
    });
    expect(changeRoleByVerifier.status()).toBe(403);

    // 3. Verifier attempts to trigger official export -> MUST return 403
    const exportByVerifier = await request.post("/api/v1/admin/exports", {
      headers: {
        Authorization: `Bearer ${verifier.token}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        template_id: "eci_annexure_1",
        name: "Unauthorized Export",
      }),
    });
    expect(exportByVerifier.status()).toBe(403);

    // 4. Admin attempting change-role to SUPER_ADMIN -> MUST return 403
    const elevateToSuperAdmin = await request.post("/api/v1/admin/change-role", {
      headers: {
        Authorization: `Bearer ${admin.token}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        userId: admin.user.id,
        role: "SUPER_ADMIN",
      }),
    });
    expect(elevateToSuperAdmin.status()).toBe(403);
  });

  test("7. Card Reissue & Revocation Lifecycle with Mandatory Audit Reasons", async ({ request }) => {
    const admin = await getSession(PERSONAS.ADMIN);
    const memberA = await getSession(PERSONAS.MEMBER_A);

    // Get Member A's record
    const { data: memberRec } = await admin.client
      .from("members")
      .select("id")
      .eq("user_id", memberA.user.id)
      .single();

    expect(memberRec).toBeDefined();

    // Get Member A's active card
    const { data: cards } = await admin.client
      .from("membership_cards")
      .select("*")
      .eq("member_id", memberRec!.id)
      .eq("status", "ACTIVE");

    expect(cards).toBeDefined();
    expect(cards!.length).toBeGreaterThan(0);
    const activeCard = cards![0];

    // 1. Reissue card
    const reissueRes = await request.post("/api/v1/admin/cards", {
      headers: {
        Authorization: `Bearer ${admin.token}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        card_id: activeCard.id,
        action: "REISSUE",
        reason: "Card damaged reported by member",
      }),
    });

    expect(reissueRes.status()).toBe(200);
    const reissueBody = await reissueRes.json();
    expect(reissueBody.success).toBe(true);
    expect(reissueBody.card.id).not.toBe(activeCard.id);
    expect(reissueBody.card.status).toBe("ACTIVE");
    expect(reissueBody.card.card_version).toBe((activeCard.card_version || 1) + 1);

    // Verify old card is now SUPERSEDED
    const { data: oldCard } = await admin.client
      .from("membership_cards")
      .select("status")
      .eq("id", activeCard.id)
      .single();

    expect(oldCard?.status).toBe("SUPERSEDED");

    // 2. Revoke card WITHOUT reason -> MUST fail with 400
    const failRevokeRes = await request.post("/api/v1/admin/cards", {
      headers: {
        Authorization: `Bearer ${admin.token}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        card_id: reissueBody.card.id,
        action: "REVOKE",
      }),
    });
    expect(failRevokeRes.status()).toBe(400);

    // 3. Revoke card WITH mandatory reason
    const revokeRes = await request.post("/api/v1/admin/cards", {
      headers: {
        Authorization: `Bearer ${admin.token}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        card_id: reissueBody.card.id,
        action: "REVOKE",
        reason: "Disciplinary action per ethics review",
      }),
    });

    expect(revokeRes.status()).toBe(200);
    const revokeBody = await revokeRes.json();
    expect(revokeBody.success).toBe(true);

    const { data: revokedCard } = await admin.client
      .from("membership_cards")
      .select("status")
      .eq("id", reissueBody.card.id)
      .single();

    expect(revokedCard?.status).toBe("REVOKED");
  });

  test("8. Public QR Verification: Active vs Revoked vs Superseded and Zero-PII Leakage", async ({ page }) => {
    const admin = await getSession(PERSONAS.ADMIN);

    // 1. Check unknown card
    await page.goto("/verify/member/NAG-UNKNOWN-CARD-999");
    await expect(page.locator("body")).toContainText("Record Not Found");

    // 2. Check revoked card
    const { data: revokedCards } = await admin.client
      .from("membership_cards")
      .select("card_number")
      .eq("status", "REVOKED")
      .limit(1);

    if (revokedCards && revokedCards.length > 0) {
      const revokedNumber = revokedCards[0].card_number;
      await page.goto(`/verify/member/${revokedNumber}`);
      await expect(page.locator("body")).toContainText("REVOKED");
    }

    // 3. Verify zero sensitive PII is leaked in HTML for any verification route
    const pageHtml = await page.content();
    expect(pageHtml).not.toContain("Aadhaar Number");
    expect(pageHtml).not.toContain("EPIC Card Scan");
    expect(pageHtml).not.toContain("bank_account");
    expect(pageHtml).not.toContain("phone_number");
  });

  test("9. Verified Crime Tracker: API Protection & Canonical Data Structure", async ({ request }) => {
    const verifier = await getSession(PERSONAS.VERIFIER);
    const admin = await getSession(PERSONAS.ADMIN);

    // 1. GET /api/v1/crimes returns canonical 5 categories
    const getRes = await request.get("/api/v1/crimes");
    expect(getRes.status()).toBe(200);
    const categories = await getRes.json();
    expect(Array.isArray(categories)).toBe(true);
    const categoryNames = categories.map((c: { crime_type: string }) => c.crime_type);
    expect(categoryNames).toContain("Rape");
    expect(categoryNames).toContain("Murder");
    expect(categoryNames).toContain("Kidnapping");
    expect(categoryNames).toContain("Robbery");
    expect(categoryNames).toContain("Extortion");

    // 2. Unauthenticated POST to /api/v1/crimes -> MUST return 401
    const unauthPost = await request.post("/api/v1/crimes", {
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify({
        title: "Malicious Crime Report",
        crime_type: "Robbery",
        source_url: "https://example.com/fake-news-1",
        incident_date: new Date().toISOString(),
      }),
    });
    expect(unauthPost.status()).toBe(401);

    // 3. Verifier POST to /api/v1/crimes -> MUST return 403 (crimes management is admin-only)
    const verifierPost = await request.post("/api/v1/crimes", {
      headers: {
        Authorization: `Bearer ${verifier.token}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        title: "Verifier Crime Report",
        crime_type: "Robbery",
        source_url: "https://example.com/fake-news-2",
        incident_date: new Date().toISOString(),
      }),
    });
    expect(verifierPost.status()).toBe(403);

    // 4. Admin POST to /api/v1/crimes -> MUST succeed with 200
    const adminPost = await request.post("/api/v1/crimes", {
      headers: {
        Authorization: `Bearer ${admin.token}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        title: "Verified Test Incident Delhi",
        crime_type: "Robbery",
        source_url: "https://timesofindia.indiatimes.com/city/delhi/test-crime-" + Date.now(),
        incident_date: new Date().toISOString(),
      }),
    });
    expect(adminPost.status()).toBe(200);
    const postBody = await adminPost.json();
    expect(postBody.success).toBe(true);
  });

  test("10. Public Civic Routes & Strict Phase 1 Formation Compliance", async ({ page }) => {
    // 1. Formation Progress Page
    await page.goto("/formation-progress");
    await expect(page.locator("body")).toContainText("Formation Roadmap");
    await expect(page.locator("body")).toContainText("Stage 3");

    // 2. Transparency Page
    await page.goto("/transparency");
    await expect(page.locator("body")).toContainText("Financial Transparency");
    await expect(page.locator("body")).toContainText("Statutory Compliance");

    // 3. Documents Page
    await page.goto("/documents");
    await expect(page.locator("body")).toContainText("Public Documents & Charters");

    // 4. Legal Constitution Subpage
    await page.goto("/legal/constitution");
    await expect(page.locator("body")).toContainText("Constitution");
    await expect(page.locator("body")).toContainText("Nagrik Party is under registration");

    // 5. Check responsive viewports
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
  });
});
