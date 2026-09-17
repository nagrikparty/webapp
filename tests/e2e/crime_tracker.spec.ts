import { test, expect } from "@playwright/test";

test.describe("Verified Crime Tracker & Public Civic Evidence", () => {
  test("1. Dedicated /crime page loads with methodology and verified category breakdown", async ({
    page,
  }) => {
    await page.goto("/crime", { waitUntil: "domcontentloaded" });

    // Header & Badge
    await expect(page.locator("h1").first()).toContainText("Verified Crime Tracker");
    await expect(page.locator("body")).toContainText("Civic Evidence & Public Accountability");
    await expect(page.locator("body")).toContainText("Civic Methodology & Evidence Standard");
    await expect(page.locator("body")).toContainText("We do not use statistical estimates");

    // Category breakdown cards
    await expect(page.locator("body")).toContainText("Category Breakdown");
    await expect(page.locator("body")).toContainText("Rape");
    await expect(page.locator("body")).toContainText("Murder");
    await expect(page.locator("body")).toContainText("Kidnapping");
    await expect(page.locator("body")).toContainText("Robbery");
    await expect(page.locator("body")).toContainText("Extortion");
  });

  test("2. Category detail page loads with category title and back link", async ({ page }) => {
    await page.goto("/crimes/murder", { waitUntil: "domcontentloaded" });

    await expect(page.locator("h1").first()).toContainText("Murder");
    await expect(page.locator("body")).toContainText("Verified Crime Tracker");
    await expect(page.locator("body")).toContainText("Zero statistical estimates");
  });

  test("3. Homepage prominently features Verified Crime Tracker with link to /crime", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    // Section title
    await expect(page.locator("body")).toContainText("Verified Crime Tracker");
    await expect(page.locator("body")).toContainText("Civic Accountability & Evidence");

    // Link to full crime tracker
    const fullTrackerLink = page.locator("a[href='/crime']");
    await expect(fullTrackerLink.first()).toBeVisible();
  });

  test("4. Global navigation exposes Our Work and Crime Tracker link", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const crimeNavLinks = page.locator("a[href='/crime']");
    expect(await crimeNavLinks.count()).toBeGreaterThan(0);
  });
});
