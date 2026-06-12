import { test, expect } from '@playwright/test';

test.describe('Tier 3: Registration & Admin Integration', () => {

  test('T3.1: Submit registration -> Admin finds new application in pending list', async ({ page }) => {
    // 1. User submits registration
    const uniquePhone = `999${Math.floor(1000000 + Math.random() * 9000000)}`;
    await page.goto('/');
    await page.fill('input[name="fullName"]', 'Integration Test User');
    await page.fill('input[name="phoneNumber"]', uniquePhone);
    await page.selectOption('select[name="idType"]', 'EPIC');
    await page.fill('input[name="idNumber"]', 'INT1234567');
    await page.setInputFiles('input[name="idFrontImage"]', { name: 'f.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('f') });
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Registration Successful')).toBeVisible();

    // 2. Admin logs in
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@nagrikparty.com');
    await page.fill('input[name="password"]', 'adminpassword');
    await page.click('button[type="submit"]');
    
    // 3. Admin checks pending applications
    await page.goto('/dashboard/admin-verification');
    await page.fill('input[placeholder="Search applications..."]', uniquePhone);
    await page.keyboard.press('Enter');
    
    // Wait for search results
    await expect(page.locator(`text=${uniquePhone}`)).toBeVisible();
  });

  test('T3.2: Admin rejects application -> User can see rejected status', async ({ page }) => {
    // 1. Submit application (Mocked or assume one exists, we will submit one to be sure)
    const uniquePhone = `888${Math.floor(1000000 + Math.random() * 9000000)}`;
    await page.goto('/');
    await page.fill('input[name="fullName"]', 'Reject Test User');
    await page.fill('input[name="phoneNumber"]', uniquePhone);
    await page.selectOption('select[name="idType"]', 'Aadhaar');
    await page.fill('input[name="idNumber"]', '123412341234');
    await page.setInputFiles('input[name="idFrontImage"]', { name: 'f.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('f') });
    await page.click('button[type="submit"]');
    
    // Grab application ID from success page if available, else track by phone
    await expect(page.locator('text=Registration Successful')).toBeVisible();

    // 2. Admin Rejects
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@nagrikparty.com');
    await page.fill('input[name="password"]', 'adminpassword');
    await page.click('button[type="submit"]');
    
    await page.goto('/dashboard/admin-verification');
    await page.fill('input[placeholder="Search applications..."]', uniquePhone);
    await page.keyboard.press('Enter');
    
    await page.click(`text=View Details`);
    await page.click('button:has-text("Reject")');
    await page.fill('textarea[name="rejectReason"]', 'Integration test rejection');
    await page.click('button:has-text("Confirm Rejection")');
    await expect(page.locator('text=Application Rejected Successfully')).toBeVisible();

    // 3. User checks status
    // Need to clear session to act as user
    await page.context().clearCookies();
    await page.goto('/track-status');
    await page.fill('input[name="searchQuery"]', uniquePhone);
    await page.click('button:has-text("Track")');
    await expect(page.locator('text=Status: Rejected')).toBeVisible();
    await expect(page.locator('text=Integration test rejection')).toBeVisible();
  });

  test('T3.3: Admin approves application -> Application moves from Pending to Approved list', async ({ page }) => {
    const uniquePhone = `777${Math.floor(1000000 + Math.random() * 9000000)}`;
    
    // 1. Submit application
    await page.goto('/');
    await page.fill('input[name="fullName"]', 'Approve Test User');
    await page.fill('input[name="phoneNumber"]', uniquePhone);
    await page.selectOption('select[name="idType"]', 'EPIC');
    await page.fill('input[name="idNumber"]', 'APP1234567');
    await page.setInputFiles('input[name="idFrontImage"]', { name: 'f.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('f') });
    await page.click('button[type="submit"]');
    
    // 2. Admin Approves
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@nagrikparty.com');
    await page.fill('input[name="password"]', 'adminpassword');
    await page.click('button[type="submit"]');
    
    await page.goto('/dashboard/admin-verification');
    await page.fill('input[placeholder="Search applications..."]', uniquePhone);
    await page.keyboard.press('Enter');
    
    await page.click(`text=View Details`);
    await page.click('button:has-text("Approve")');
    await expect(page.locator('text=Application Approved Successfully')).toBeVisible();

    // 3. Verify it moved to Approved list
    await page.goto('/dashboard/admin-verification');
    await page.selectOption('select[name="statusFilter"]', 'Approved');
    await page.fill('input[placeholder="Search applications..."]', uniquePhone);
    await page.keyboard.press('Enter');
    
    await expect(page.locator(`text=${uniquePhone}`)).toBeVisible();
    
    // Verify it's no longer in Pending
    await page.selectOption('select[name="statusFilter"]', 'Pending');
    await expect(page.locator(`text=${uniquePhone}`)).toBeHidden();
  });

});
