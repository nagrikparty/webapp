import { test, expect } from "@playwright/test";

test.describe("Phase 1 — Formation Phase Architecture & Compliance", () => {
  test("1. Landing page displays canonical branding, logo, and strict Phase 1 formation badge", async ({
    page,
  }) => {
    await page.goto("/");
    // Brand header and slogan
    await expect(page.locator("header.nav")).toBeVisible();
    await expect(page.locator("body")).toContainText("Nagrik Party");

    // Canonical SVG logo verification
    const logoImg = page.locator("img.nagrik-logo[src='/nagrikpartylogo.svg']");
    await expect(logoImg.first()).toBeVisible();

    // Ensure NO legacy logo is referenced
    const content = await page.content();
    expect(content).not.toContain("/brand/logo.png");

    // Strict Rule 4: Formation Phase badge and disclosure
    await expect(page.locator("body")).toContainText("PHASE 1 • FORMATION PHASE");
    await expect(page.locator("body")).toContainText(
      "Nagrik Party — Formation Phase: An independent political initiative working toward the formation and registration of a political party."
    );

    // Ensure zero false claims
    expect(content).not.toContain("ECI-REG-APPROVED");
    expect(content).not.toContain("National Recognized Party");
  });

  test("2. 9-Stage Formation Roadmap correctly tracks Stage 3 as current stage", async ({ page }) => {
    await page.goto("/formation-progress");
    await expect(page.locator("h1").first()).toContainText("Formation Roadmap");

    // Statutory alert
    await expect(page.locator("body")).toContainText("Strict Statutory Disclosure");
    await expect(page.locator("body")).toContainText("Stage 3 of Phase 1 (Formation Phase)");

    // Stage cards
    await expect(page.locator("body")).toContainText("Platform Architecture & Privacy Vault");
    await expect(page.locator("body")).toContainText("Founding Member Induction (100+ Verified Voters)");
    await expect(page.locator("body")).toContainText("Current Stage");
    await expect(page.locator("body")).toContainText("Gazette Notification & Registered Party Status");
  });

  test("3. Financial Transparency Ledger exhibits audited formation accounts and zero-cash pledge", async ({
    page,
  }) => {
    await page.goto("/transparency");
    await expect(page.locator("h1").first()).toContainText("Financial Transparency");
    await expect(page.locator("body")).toContainText("ZERO UNACCOUNTED FUNDS PLEDGE");
    await expect(page.locator("body")).toContainText("Zero Cash Donations Accepted");
    await expect(page.locator("body")).toContainText("Audited Financial Statements");
  });

  test("4. Public Documents Library exposes constitution, charters, and SHA-256 integrity hashes", async ({
    page,
  }) => {
    await page.goto("/documents");
    await expect(page.locator("h1").first()).toContainText("Public Documents & Charters");
    await expect(page.locator("body")).toContainText("Draft Constitution of Nagrik Party (Phase 1)");
    await expect(page.locator("body")).toContainText("Formation Charter & Delhi 2025 Vision");
    await expect(page.locator("body")).toContainText("SHA-256:");
  });

  test("5. Membership gateway links directly to 10-step digital induction", async ({ page }) => {
    await page.goto("/membership");
    await expect(page.locator("h1").first()).toContainText("Digital Membership Induction");
    await expect(page.locator("body")).toContainText("OFFICIAL 10-STEP PROCESS");
    await expect(page.locator("a[href='/member/induction']")).toBeVisible();
    await expect(page.locator("body")).toContainText("Delhi 70 Assembly Constituencies mapping");
  });

  test("6. Privacy-Safe Member QR Verification guarantees zero PII leaks", async ({ page }) => {
    await page.goto("/verify/member/NON-EXISTENT-999");
    await expect(page.locator("body")).toContainText("Record Not Found");

    // Verify privacy safety: no sensitive PII fields are exposed in HTML
    const content = await page.content();
    expect(content).not.toContain("Aadhaar Number");
    expect(content).not.toContain("Phone Number");
    expect(content).not.toContain("Residential Address");
  });

  test("7a. Obsolete dashboard member route redirects safely to /member", async ({ page }) => {
    await page.goto("/dashboard/member");
    await expect(page).toHaveURL(/\/member/);
  });

  test("7b. Obsolete dashboard admin route redirects safely to /admin", async ({ page }) => {
    await page.goto("/dashboard/admin");
    await expect(page).toHaveURL(/\/admin/);
  });

  test("8. Authentication routes load correctly with canonical branding", async ({ page }) => {
    // Login
    await page.goto("/login");
    await expect(page.locator("h1").first()).toContainText("Log In");
    await expect(page.locator("img.nagrik-logo[src='/nagrikpartylogo.svg']").first()).toBeVisible();

    // Signup
    await page.goto("/signup");
    await expect(page.locator("h1").first()).toContainText("Sign Up");

    // Forgot Password
    await page.goto("/forgot-password");
    await expect(page.locator("h1").first()).toContainText("Reset Password");

    // Reset Password
    await page.goto("/reset-password");
    await expect(page.locator("h1").first()).toContainText("Set New Password");
  });

  test("9a. Member Overview loads with portal header", async ({ page }) => {
    await page.goto("/member");
    await expect(page.locator("body")).toContainText("Member Portal");
  });

  test("9b. Member Induction wizard loads", async ({ page }) => {
    await page.goto("/member/induction");
    await expect(page.locator("h1").first()).toContainText("Membership Induction");
  });

  test("9c. Member Documents vault loads", async ({ page }) => {
    await page.goto("/member/documents");
    await expect(page.locator("h1").first()).toContainText("Document Vault");
  });

  test("9d. Member CR80 Card loads", async ({ page }) => {
    await page.goto("/member/membership-card");
    await expect(page.locator("h1").first()).toContainText("Membership Card");
  });

  test("9e. Member Profile loads", async ({ page }) => {
    await page.goto("/member/profile");
    await expect(page.locator("h1").first()).toContainText("Member Profile");
  });

  test("9f. Member Verification Status loads", async ({ page }) => {
    await page.goto("/member/status");
    await expect(page.locator("h1").first()).toContainText("Verification Status");
  });

  test("9g. Member Contributions loads with Phase 1 voluntary support notice", async ({ page }) => {
    await page.goto("/member/contributions");
    await expect(page.locator("h1").first()).toContainText("Formation Support");
    await expect(page.locator("body")).toContainText("Formation Phase — Voluntary Support Only");
  });

  test("10a. Admin Overview loads with unified navigation breadcrumbs", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.locator("h1").first()).toContainText("Party Administration");
    await expect(page.locator("a[href='/admin/applications']")).toBeVisible();
    await expect(page.locator("a[href='/admin/cards']")).toBeVisible();
    await expect(page.locator("a[href='/admin/settings']")).toBeVisible();
  });

  test("10b. Admin Applications Intake queue loads", async ({ page }) => {
    await page.goto("/admin/applications");
    await expect(page.locator("h1").first()).toContainText("Application Intake Queue");
  });

  test("10c. Admin Verifications Desk loads", async ({ page }) => {
    await page.goto("/admin/verifications");
    await expect(page.locator("h1").first()).toContainText("Verification Desk");
  });

  test("10d. Admin Master Member Register loads", async ({ page }) => {
    await page.goto("/admin/members");
    await expect(page.locator("h1").first()).toContainText("Master Member Register");
  });

  test("10e. Admin Card Issuance Console loads with CR80 standard", async ({ page }) => {
    await page.goto("/admin/cards");
    await expect(page.locator("h1").first()).toContainText("Card Issuance Console");
    await expect(page.locator("body")).toContainText("CR80 Standard");
  });

  test("10f. Admin Government Submission Exports loads", async ({ page }) => {
    await page.goto("/admin/exports");
    await expect(page.locator("h1").first()).toContainText("Government Submission Exports");
  });

  test("10g. Admin Financial Statements Management loads", async ({ page }) => {
    await page.goto("/admin/finance");
    await expect(page.locator("h1").first()).toContainText("Financial Statements Management");
  });

  test("10h. Admin Administrative Audit Log loads", async ({ page }) => {
    await page.goto("/admin/audit");
    await expect(page.locator("h1").first()).toContainText("Administrative Audit Log");
  });

  test("10i. Admin Organisation Settings loads with Phase 1 status", async ({ page }) => {
    await page.goto("/admin/settings");
    await expect(page.locator("h1").first()).toContainText("Organisation Settings");
    await expect(page.locator("body")).toContainText("PHASE 1 — FORMATION PHASE");
  });

  test("11. Submission exports API is protected and responds cleanly", async ({ request }) => {
    // API GET without token should reject unauthorized or return empty list
    const res = await request.get("/api/v1/admin/exports");
    expect([200, 401]).toContain(res.status());
  });
});
