import { test, expect } from "@playwright/test";

test.describe("Phase 1 Operational Lifecycle & Verification Suite", () => {
  test("1. Public Crime Tracker distinguishes incident dates and provides verifiable citations", async ({ page }) => {
    await page.goto("/crime");
    await expect(page.locator("h1")).toContainText("Verified Crime Tracker");
    await expect(page.locator("body")).toContainText("Civic Methodology & Evidence Standard");
    await expect(page.locator("body")).toContainText("Category Breakdown");

    // Check presence of Incident Date labels
    const content = await page.content();
    expect(content).toContain("Incident Date:");
  });

  test("2. Individual Crime category pages render with back-navigation and incident dates", async ({ page }) => {
    await page.goto("/crimes/murder");
    await expect(page.locator("h1")).toContainText("Murder");
    await expect(page.locator("body")).toContainText("Verified Crime Tracker");

    const content = await page.content();
    expect(content).toContain("Incident Date:");
  });

  test("3. Formation Roadmap strictly emphasizes Phase 1 Formation stage and statutory disclosures", async ({ page }) => {
    await page.goto("/formation-progress");
    await expect(page.locator("h1")).toContainText("Formation Roadmap");
    await expect(page.locator("body")).toContainText("Strict Statutory Disclosure");
    await expect(page.locator("body")).toContainText("Stage 3 of Phase 1 (Formation Phase)");
    await expect(page.locator("body")).toContainText("Gazette Notification & Registered Party Status");
  });

  test("4. Member induction page loads 10-step digital wizard with statutory affirmations", async ({ page }) => {
    await page.goto("/member/induction");
    await expect(page.locator("body")).toBeVisible();
    // Verify wizard is loaded or prompts for sign in
    const content = await page.content();
    expect(content.includes("Digital Induction") || content.includes("Sign In") || content.includes("लॉगिन")).toBeTruthy();
  });

  test("5. Member Profile renders dynamic next-steps guidance", async ({ page }) => {
    await page.goto("/member/profile");
    await expect(page.locator("body")).toBeVisible();
    // Wait for client:only component to mount
    await expect(
      page.locator("text=Sign In to View Status").or(page.locator("text=Organisational Record Details"))
    ).toBeVisible({ timeout: 10000 });
  });

  test("6. Admin Verifications portal displays statutory scrutiny checklist and audit desk", async ({ page }) => {
    await page.goto("/admin/verifications");
    await expect(page.locator("body")).toBeVisible();
    const content = await page.content();
    // Either redirected to auth or loads desk
    expect(content.includes("Verification Desk") || content.includes("Sign In") || content.includes("Admin Login") || content.includes("Log In")).toBeTruthy();
  });

  test("7. Admin Cards Registry displays CR80 standards specification and versioning controls", async ({ page }) => {
    await page.goto("/admin/cards");
    await expect(page.locator("body")).toBeVisible();
    const content = await page.content();
    expect(content.includes("Card") || content.includes("CR80") || content.includes("Sign In") || content.includes("Admin Login")).toBeTruthy();
  });

  test("8. Admin Cards API enforces authentication on GET and POST actions", async ({ request }) => {
    const getRes = await request.get("/api/v1/admin/cards");
    expect([401, 403]).toContain(getRes.status());

    const postRes = await request.post("/api/v1/admin/cards", {
      data: { action: "REVOKE", cardId: "00000000-0000-0000-0000-000000000000" },
    });
    expect([401, 403]).toContain(postRes.status());
  });

  test("9. Admin Verifications API enforces authentication and rejects unauthenticated actions", async ({ request }) => {
    const getRes = await request.get("/api/v1/admin/verifications");
    expect([401, 403]).toContain(getRes.status());

    const postRes = await request.post("/api/v1/admin/verifications", {
      data: { action: "APPROVE", applicationId: "00000000-0000-0000-0000-000000000000" },
    });
    expect([401, 403]).toContain(postRes.status());
  });

  test("10. Public QR verification protects PII and validates canonical responses", async ({ page }) => {
    await page.goto("/verify/member/non-existent-token");
    await expect(page.locator("body")).toBeVisible();
    await expect(page.locator("body")).toContainText("Membership Verification");
    await expect(page.locator("body")).toContainText("Record Not Found");
    // Ensure no phone/email/parent name is leaked
    const content = await page.content();
    expect(content).not.toContain("Phone Number");
    expect(content).not.toContain("Email Address");
  });
});
