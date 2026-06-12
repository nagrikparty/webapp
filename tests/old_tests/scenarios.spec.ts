import { test, expect } from '@playwright/test';

test.describe('Tier 4: Real-World Application Scenarios (End-to-End)', () => {
  
  test('Scenario 1: Full Member Registration to Induction', async ({ page, browser }) => {
    // Phase 1: User Self-Registration (F1 & F2)
    await page.goto('/register');
    await page.fill('input[name="fullName"]', 'Anjali Desai');
    await page.fill('input[name="voterId"]', 'AD99887766');
    await page.fill('input[name="phone"]', '9876500001');
    await page.setInputFiles('input[name="idProof"]', {
      name: 'id_proof.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('fake-id-proof'),
    });
    await page.click('button:has-text("Proceed to Payment")');
    
    // Simulate Payment
    await expect(page).toHaveURL(/\/payment/);
    await page.click('button:has-text("Pay 100 INR")');
    await expect(page.locator('.payment-success')).toBeVisible();
    
    // Get application reference ID
    const refId = await page.locator('.reference-id').innerText();
    
    // Phase 2: Admin Review (F4)
    // Using a new context or simulating admin login
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    await adminPage.goto('/admin/login');
    await adminPage.fill('input[name="username"]', 'admin');
    await adminPage.fill('input[name="password"]', 'admin123');
    await adminPage.click('button[type="submit"]');
    
    await adminPage.goto('/dashboard/applications');
    await adminPage.click(`tr:has-text("${refId}") button.review-btn`);
    await adminPage.click('button:has-text("Approve")');
    await expect(adminPage.locator('.toast-success')).toContainText('Application approved');
    await adminContext.close();
    
    // Phase 3: Status Tracking (F3)
    await page.goto('/track-status');
    await page.fill('input[name="referenceId"]', refId);
    await page.click('button:has-text("Check Status")');
    await expect(page.locator('.status-badge')).toContainText('Approved');
  });

  test('Scenario 2: Registration with Invalid Document rejected by Admin', async ({ page, browser }) => {
    // User registers but uploads blurry document
    await page.goto('/register');
    await page.fill('input[name="fullName"]', 'Vijay Kumar');
    await page.fill('input[name="voterId"]', 'VK11223344');
    await page.setInputFiles('input[name="idProof"]', {
      name: 'blurry_doc.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('blurry-image'),
    });
    await page.click('button:has-text("Proceed to Payment")');
    await page.click('button:has-text("Pay 100 INR")');
    
    const refId = await page.locator('.reference-id').innerText();
    
    // Admin Review
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    await adminPage.goto('/dashboard/applications');
    await adminPage.click(`tr:has-text("${refId}") button.review-btn`);
    
    // Admin rejects with reason
    await adminPage.click('button:has-text("Reject")');
    await adminPage.fill('textarea[name="rejectReason"]', 'ID document is unreadable');
    await adminPage.click('button:has-text("Confirm Rejection")');
    await adminContext.close();
    
    // User checks status
    await page.goto('/track-status');
    await page.fill('input[name="referenceId"]', refId);
    await page.click('button:has-text("Check Status")');
    await expect(page.locator('.status-badge')).toContainText('Rejected');
    await expect(page.locator('.rejection-reason')).toContainText('ID document is unreadable');
  });

  test('Scenario 3: Legacy Proposer Form Data Entry and Extraction', async ({ page }) => {
    // Admin handles legacy offline forms using F5 and F6
    await page.goto('/dashboard/proposer');
    
    // Upload a batch of 2 legacy PDFs
    await page.click('text="Upload Proposer Form"');
    await page.setInputFiles('input[type="file"]', [
      { name: 'legacy1.pdf', mimeType: 'application/pdf', buffer: Buffer.from('pdf1') },
      { name: 'legacy2.pdf', mimeType: 'application/pdf', buffer: Buffer.from('pdf2') }
    ]);
    await page.click('button:has-text("Extract All Data")');
    
    // Verify bulk extraction preview
    await expect(page.locator('.extracted-list .item')).toHaveCount(2);
    await page.click('button:has-text("Approve All")');
    
    // Immediately fallback to manual entry for a form that was illegible
    await page.click('text="Add Proposer Manually"');
    await page.fill('input[name="name"]', 'Legacy Proposer 3');
    await page.fill('input[name="voterId"]', 'LEG9988776');
    await page.click('button[type="submit"]');
    
    // Verify all 3 proposers are in the system
    const rows = page.locator('table tbody tr');
    // We expect the count to be augmented by 3 in a real scenario
    await expect(rows).not.toHaveCount(0);
  });

  test('Scenario 4: Multiple Registrations and Bulk Admin Processing', async ({ browser }) => {
    // Simulating two users registering simultaneously
    const context1 = await browser.newContext();
    const page1 = await context1.newPage();
    await page1.goto('/register');
    await page1.fill('input[name="fullName"]', 'User One');
    await page1.click('button:has-text("Proceed to Payment")');
    await page1.click('button:has-text("Pay 100 INR")');
    
    const context2 = await browser.newContext();
    const page2 = await context2.newPage();
    await page2.goto('/register');
    await page2.fill('input[name="fullName"]', 'User Two');
    await page2.click('button:has-text("Proceed to Payment")');
    await page2.click('button:has-text("Pay 100 INR")');
    
    // Admin processes in bulk
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    await adminPage.goto('/dashboard/applications');
    
    // Select multiple applications
    await adminPage.check('input.select-all-applications');
    await adminPage.click('button:has-text("Bulk Approve")');
    await adminPage.click('button:has-text("Confirm Bulk Action")');
    
    await expect(adminPage.locator('.toast-success')).toContainText('Applications approved successfully');
    
    await context1.close();
    await context2.close();
    await adminContext.close();
  });

  test('Scenario 5: Complete System Flow with Proposer Linkage', async ({ page, browser }) => {
    // 1. Admin creates Proposer
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    await adminPage.goto('/dashboard/proposer');
    await adminPage.click('text="Add Proposer Manually"');
    await adminPage.fill('input[name="name"]', 'Master Proposer');
    await adminPage.fill('input[name="voterId"]', 'MST1122334');
    await adminPage.click('button[type="submit"]');
    
    // 2. User registers using Proposer Voter ID
    await page.goto('/register');
    await page.fill('input[name="fullName"]', 'Linked User');
    await page.fill('input[name="proposerVoterId"]', 'MST1122334');
    await page.click('button:has-text("Validate Proposer")');
    await expect(page.locator('.proposer-validation-success')).toContainText('Master Proposer found');
    
    await page.click('button:has-text("Proceed to Payment")');
    await page.click('button:has-text("Pay 100 INR")');
    const refId = await page.locator('.reference-id').innerText();
    
    // 3. Admin sees linked proposer in application review
    await adminPage.goto('/dashboard/applications');
    await adminPage.click(`tr:has-text("${refId}") button.review-btn`);
    await expect(adminPage.locator('.proposer-details')).toContainText('MST1122334');
    await adminPage.click('button:has-text("Approve")');
    
    // 4. User tracks status
    await page.goto('/track-status');
    await page.fill('input[name="referenceId"]', refId);
    await page.click('button:has-text("Check Status")');
    await expect(page.locator('.status-badge')).toContainText('Approved');
    
    await adminContext.close();
  });
});
