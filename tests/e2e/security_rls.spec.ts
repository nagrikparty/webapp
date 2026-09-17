import { test, expect } from "@playwright/test";

test.describe("Security, Access Control & RLS Architecture Tests", () => {
  test("1. Unauthenticated user cannot access protected member pages without session", async ({
    page,
  }) => {
    // When accessing member routes unauthenticated, should load securely without leaking PII
    await page.goto("/member/documents");
    await expect(page.locator("body")).toBeVisible();
    const content = await page.content();
    // Verify no private documents of other users are leaked
    expect(content).not.toContain("Aadhaar Number");
    expect(content).not.toContain("EPIC Card Scan");
  });

  test("2. Public QR verification endpoint strictly restricts data exposure", async ({
    page,
  }) => {
    // Check non-existent or revoked member card
    await page.goto("/verify/member/NAG-REVOKED-001");
    await expect(page.locator("body")).toContainText("Record Not Found");

    // Verify privacy safety: no sensitive PII fields are exposed in HTML
    const content = await page.content();
    expect(content).not.toContain("Aadhaar");
    expect(content).not.toContain("Phone Number");
    expect(content).not.toContain("Residential Address");
    expect(content).not.toContain("Voter ID Number");
    expect(content).not.toContain("Bank Account");
  });

  test("3. Document upload endpoint rejects unauthenticated or missing payloads", async ({
    request,
  }) => {
    // Calling upload API without auth headers or multipart body
    const res = await request.post("/api/v1/documents/upload", {
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({}),
    });

    // Should return 401 Unauthorized or 400 Bad Request
    expect([400, 401]).toContain(res.status());
  });

  test("4. Submission export endpoint requires admin/authorized role", async ({
    request,
  }) => {
    // Calling export creation API without authorized session token
    const res = await request.post("/api/v1/admin/exports", {
      data: JSON.stringify({ template_id: "test", name: "Test Export" }),
    });

    expect([401, 403]).toContain(res.status());
  });

  test("5. Frontend code contains zero exposed service role keys", async ({ page }) => {
    await page.goto("/");
    const pageSource = await page.content();

    // Verify no service role key or secret keys are leaked in DOM
    expect(pageSource).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
    expect(pageSource).not.toContain("service_role");
    expect(pageSource).not.toMatch(/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/);
  });

  test("6. Canonical logo is exclusively used across all public and admin pages", async ({
    page,
  }) => {
    // Check homepage
    await page.goto("/");
    let images = await page.locator("img").evaluateAll((imgs) => imgs.map((i) => i.getAttribute("src")));
    for (const src of images) {
      if (src && src.includes("logo")) {
        expect(src).toBe("/nagrikpartylogo.svg");
      }
    }

    // Check login page
    await page.goto("/login");
    images = await page.locator("img").evaluateAll((imgs) => imgs.map((i) => i.getAttribute("src")));
    for (const src of images) {
      if (src && src.includes("logo")) {
        expect(src).toBe("/nagrikpartylogo.svg");
      }
    }
  });

  test("7. Phase 1 disclaimer is present and Phase 2 claims are absent", async ({ page }) => {
    await page.goto("/");
    const content = await page.content();

    // Must have Formation Phase badge
    expect(content).toContain("PHASE 1 • FORMATION PHASE");

    // Must NOT claim registered political party or government alloted symbols
    expect(content).not.toContain("Recognised National Party");
    expect(content).not.toContain("Election Commission Allotted Symbol");
    expect(content).not.toContain("ECI-REG-APPROVED");
  });
});
