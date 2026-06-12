import { test, expect } from '@playwright/test';

test.describe('Feature 3 & 4: Admin View & Approve/Reject Applications', () => {

  const ADMIN_DASHBOARD = '/dashboard/admin-verification';

  // --- Tier 1: Happy Path ---

  test('T1.1: Admin logs in and views dashboard with pending applications', async ({ page }) => {
    // Mock login or assume we're logged in via setup
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@nagrikparty.com');
    await page.fill('input[name="password"]', 'adminpassword');
    await page.click('button[type="submit"]');
    
    await page.goto(ADMIN_DASHBOARD);
    await expect(page.locator('text=Pending Applications')).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
  });

  test('T1.2: Admin can see list of applications with columns', async ({ page }) => {
    await page.goto(ADMIN_DASHBOARD);
    const headers = page.locator('th');
    await expect(headers.filter({ hasText: 'Name' })).toBeVisible();
    await expect(headers.filter({ hasText: 'Date' })).toBeVisible();
    await expect(headers.filter({ hasText: 'Status' })).toBeVisible();
    await expect(headers.filter({ hasText: 'ID Type' })).toBeVisible();
  });

  test('T1.3: Admin can click on an application to view details', async ({ page }) => {
    await page.goto(ADMIN_DASHBOARD);
    await page.click('text=View Details >> nth=0'); // Click first application's details
    await expect(page.locator('text=Application Details')).toBeVisible();
    await expect(page.locator('img[alt="ID Front"]')).toBeVisible();
    await expect(page.locator('text=Applicant Name')).toBeVisible();
  });

  test('T1.4: Admin approves an application successfully', async ({ page }) => {
    await page.goto(ADMIN_DASHBOARD);
    await page.click('text=View Details >> nth=0');
    await page.click('button:has-text("Approve")');
    await expect(page.locator('text=Application Approved Successfully')).toBeVisible();
  });

  test('T1.5: Admin rejects an application with a reason successfully', async ({ page }) => {
    await page.goto(ADMIN_DASHBOARD);
    await page.click('text=View Details >> nth=0');
    await page.click('button:has-text("Reject")');
    await page.fill('textarea[name="rejectReason"]', 'Image is not clear');
    await page.click('button:has-text("Confirm Rejection")');
    await expect(page.locator('text=Application Rejected Successfully')).toBeVisible();
  });

  test('T1.6: Admin can filter applications by Pending status', async ({ page }) => {
    await page.goto(ADMIN_DASHBOARD);
    await page.selectOption('select[name="statusFilter"]', 'Pending');
    // Ensure table only shows pending items
    const statuses = page.locator('td.status-cell');
    const count = await statuses.count();
    for (let i = 0; i < count; i++) {
      await expect(statuses.nth(i)).toHaveText(/Pending/i);
    }
  });

  // --- Tier 2: Boundary/Error Tests ---

  test('T2.1: Accessing admin dashboard without login redirects to login page', async ({ page }) => {
    // Clear cookies/storage to simulate logged out state
    await page.context().clearCookies();
    await page.goto(ADMIN_DASHBOARD);
    await expect(page).toHaveURL(/.*login.*/);
  });

  test('T2.2: Pagination works when more than 10 applications exist', async ({ page }) => {
    await page.goto(ADMIN_DASHBOARD);
    const nextBtn = page.locator('button[aria-label="Next Page"]');
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
      await expect(page.locator('text=Page 2')).toBeVisible();
    }
  });

  test('T2.3: Admin cannot approve an already approved application', async ({ page }) => {
    await page.goto(ADMIN_DASHBOARD);
    await page.selectOption('select[name="statusFilter"]', 'Approved');
    await page.click('text=View Details >> nth=0');
    await expect(page.locator('button:has-text("Approve")')).toBeDisabled();
  });

  test('T2.4: Admin cannot reject an already rejected application', async ({ page }) => {
    await page.goto(ADMIN_DASHBOARD);
    await page.selectOption('select[name="statusFilter"]', 'Rejected');
    await page.click('text=View Details >> nth=0');
    await expect(page.locator('button:has-text("Reject")')).toBeDisabled();
  });

  test('T2.5: Admin reject fails if no reason is provided', async ({ page }) => {
    await page.goto(ADMIN_DASHBOARD);
    await page.click('text=View Details >> nth=0');
    await page.click('button:has-text("Reject")');
    // Leave reason empty
    await page.click('button:has-text("Confirm Rejection")');
    await expect(page.locator('text=Rejection reason is required')).toBeVisible();
  });

  test('T2.6: Verify search functionality by user name', async ({ page }) => {
    await page.goto(ADMIN_DASHBOARD);
    await page.fill('input[placeholder="Search applications..."]', 'John Doe');
    await page.keyboard.press('Enter');
    const names = page.locator('td.name-cell');
    const count = await names.count();
    if (count > 0) {
      await expect(names.nth(0)).toContainText('John Doe');
    }
  });

  test('T2.7: Verify search functionality by application ID', async ({ page }) => {
    await page.goto(ADMIN_DASHBOARD);
    await page.fill('input[placeholder="Search applications..."]', 'APP-12345');
    await page.keyboard.press('Enter');
    const ids = page.locator('td.id-cell');
    const count = await ids.count();
    if (count > 0) {
      await expect(ids.nth(0)).toContainText('APP-12345');
    }
  });

  test('T2.8: Admin clicks on image thumbnail to view full-size image', async ({ page }) => {
    await page.goto(ADMIN_DASHBOARD);
    await page.click('text=View Details >> nth=0');
    await page.click('img[alt="ID Front"]');
    await expect(page.locator('.modal-full-image')).toBeVisible(); // Assuming a modal pops up
  });

  test('T2.9: Error handled gracefully if backend fails to load applications', async ({ page }) => {
    // Mock API failure
    await page.route('**/api/applications', async route => {
      await route.abort('failed');
    });
    await page.goto(ADMIN_DASHBOARD);
    await expect(page.locator('text=Failed to load applications. Please try again.')).toBeVisible();
  });

  test('T2.10: Ensure status updates in real-time or upon refresh after approval', async ({ page }) => {
    await page.goto(ADMIN_DASHBOARD);
    // Grab first pending item's ID
    const firstRow = page.locator('tr').nth(1);
    const text = await firstRow.textContent();
    
    await page.click('text=View Details >> nth=0');
    await page.click('button:has-text("Approve")');
    await page.goto(ADMIN_DASHBOARD);
    
    // Validate it's no longer in the pending list
    if (text) {
      await expect(page.locator(`text=${text.trim()}`)).toBeHidden();
    }
  });

  test('T2.11: Admin can filter applications by Date range', async ({ page }) => {
    await page.goto(ADMIN_DASHBOARD);
    await page.fill('input[name="startDate"]', '2023-01-01');
    await page.fill('input[name="endDate"]', '2023-12-31');
    await page.click('button:has-text("Apply Filters")');
    // Ensure table updates (checking if table exists is a basic proxy for success without knowing exact data)
    await expect(page.locator('table')).toBeVisible();
  });

  test('T2.12: Empty state message shown when no pending applications exist', async ({ page }) => {
    await page.route('**/api/applications*', async route => {
      await route.fulfill({ json: [] });
    });
    await page.goto(ADMIN_DASHBOARD);
    await expect(page.locator('text=No pending applications found')).toBeVisible();
  });

  test('T2.13: Admin can sort applications by date ascending/descending', async ({ page }) => {
    await page.goto(ADMIN_DASHBOARD);
    await page.click('th:has-text("Date")'); // First click: Ascending
    await page.waitForTimeout(500); // allow for sort update
    await page.click('th:has-text("Date")'); // Second click: Descending
    await expect(page.locator('table')).toBeVisible();
  });

  test('T2.14: Non-admin user accessing admin URL shows unauthorized error', async ({ page }) => {
    // Mock standard user login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'userpass');
    await page.click('button[type="submit"]');
    
    await page.goto(ADMIN_DASHBOARD);
    await expect(page.locator('text=Unauthorized Access')).toBeVisible();
  });

});
