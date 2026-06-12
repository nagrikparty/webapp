import { test, expect } from '@playwright/test';

test.describe('Features 5 & 6: Admin Manual Proposer Data Entry & PDF Upload', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/proposer');
  });

  test.describe('Tier 1: Happy Path', () => {
    test('Should navigate to proposer dashboard successfully', async ({ page }) => {
      await expect(page).toHaveURL(/\/dashboard\/proposer/);
      await expect(page.locator('h1')).toContainText('Proposer Management');
    });

    test('Should successfully submit manual proposer data', async ({ page }) => {
      await page.click('text="Add Proposer Manually"');
      await page.fill('input[name="name"]', 'Ramesh Kumar');
      await page.fill('input[name="voterId"]', 'ABC1234567');
      await page.fill('input[name="phone"]', '9876543210');
      await page.fill('input[name="district"]', 'Central District');
      await page.click('button[type="submit"]');

      await expect(page.locator('.toast-success')).toContainText('Proposer added successfully');
      await expect(page.locator('table')).toContainText('Ramesh Kumar');
    });

    test('Should successfully submit another manual proposer', async ({ page }) => {
      await page.click('text="Add Proposer Manually"');
      await page.fill('input[name="name"]', 'Suresh Singh');
      await page.fill('input[name="voterId"]', 'XYZ9876543');
      await page.fill('input[name="phone"]', '9123456780');
      await page.selectOption('select[name="state"]', 'Maharashtra');
      await page.click('button[type="submit"]');

      await expect(page.locator('.toast-success')).toContainText('Proposer added successfully');
      await expect(page.locator('table')).toContainText('Suresh Singh');
    });

    test('Should open PDF upload modal', async ({ page }) => {
      await page.click('text="Upload Proposer Form"');
      await expect(page.locator('.modal-header')).toContainText('Upload PDF');
    });

    test('Should successfully upload valid PDF form and extract data', async ({ page }) => {
      await page.click('text="Upload Proposer Form"');
      await page.setInputFiles('input[type="file"]', {
        name: 'valid_proposer.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('fake-pdf-content'),
      });
      await page.click('button:has-text("Extract Data")');

      await expect(page.locator('input[name="extracted-name"]')).toHaveValue('Extracted Name');
      await expect(page.locator('input[name="extracted-voterId"]')).toHaveValue('EXT1234567');
    });

    test('Should allow admin to approve extracted PDF data', async ({ page }) => {
      await page.click('text="Upload Proposer Form"');
      await page.setInputFiles('input[type="file"]', {
        name: 'valid_proposer2.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('fake-pdf-content'),
      });
      await page.click('button:has-text("Extract Data")');
      
      await page.waitForSelector('input[name="extracted-name"]');
      await page.click('button:has-text("Approve & Save")');

      await expect(page.locator('.toast-success')).toContainText('Proposer saved successfully');
    });

    test('Should display newly added proposers in the dashboard list', async ({ page }) => {
      const rows = page.locator('table tbody tr');
      await expect(rows.first()).toBeVisible();
    });
  });

  test.describe('Tier 2: Boundary/Error Path', () => {
    test('Should show error when submitting without mandatory Name', async ({ page }) => {
      await page.click('text="Add Proposer Manually"');
      await page.fill('input[name="voterId"]', 'DEF1234567');
      await page.click('button[type="submit"]');

      await expect(page.locator('.error-name')).toContainText('Name is required');
    });

    test('Should show error when submitting without Voter ID', async ({ page }) => {
      await page.click('text="Add Proposer Manually"');
      await page.fill('input[name="name"]', 'Invalid Proposer');
      await page.click('button[type="submit"]');

      await expect(page.locator('.error-voterId')).toContainText('Voter ID is required');
    });

    test('Should show error for invalid Voter ID format', async ({ page }) => {
      await page.click('text="Add Proposer Manually"');
      await page.fill('input[name="name"]', 'Test Name');
      await page.fill('input[name="voterId"]', '123'); 
      await page.click('button[type="submit"]');

      await expect(page.locator('.error-voterId')).toContainText('Invalid Voter ID format');
    });

    test('Should show error for duplicate Voter ID', async ({ page }) => {
      await page.click('text="Add Proposer Manually"');
      await page.fill('input[name="name"]', 'Duplicate Name');
      await page.fill('input[name="voterId"]', 'ABC1234567');
      await page.click('button[type="submit"]');

      await expect(page.locator('.toast-error')).toContainText('Voter ID already exists');
    });

    test('Should show error for invalid phone number format', async ({ page }) => {
      await page.click('text="Add Proposer Manually"');
      await page.fill('input[name="name"]', 'Phone Tester');
      await page.fill('input[name="voterId"]', 'PHN1234567');
      await page.fill('input[name="phone"]', '12345');
      await page.click('button[type="submit"]');

      await expect(page.locator('.error-phone')).toContainText('Invalid phone number');
    });

    test('Should reject non-PDF file upload', async ({ page }) => {
      await page.click('text="Upload Proposer Form"');
      await page.setInputFiles('input[type="file"]', {
        name: 'image.png',
        mimeType: 'image/png',
        buffer: Buffer.from('fake-image'),
      });
      
      await expect(page.locator('.file-error')).toContainText('Only PDF files are allowed');
    });

    test('Should handle empty PDF file upload', async ({ page }) => {
      await page.click('text="Upload Proposer Form"');
      await page.setInputFiles('input[type="file"]', {
        name: 'empty.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from(''),
      });
      await page.click('button:has-text("Extract Data")');
      
      await expect(page.locator('.toast-error')).toContainText('File is empty or corrupted');
    });

    test('Should reject extremely large PDF file', async ({ page }) => {
      await page.click('text="Upload Proposer Form"');
      const largeBuffer = Buffer.alloc(11 * 1024 * 1024);
      await page.setInputFiles('input[type="file"]', {
        name: 'large.pdf',
        mimeType: 'application/pdf',
        buffer: largeBuffer,
      });
      
      await expect(page.locator('.file-error')).toContainText('File size exceeds the maximum limit');
    });

    test('Should handle PDF with unreadable content requiring manual intervention', async ({ page }) => {
      await page.click('text="Upload Proposer Form"');
      await page.setInputFiles('input[type="file"]', {
        name: 'blurry.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('fake-blurry-pdf'),
      });
      await page.click('button:has-text("Extract Data")');
      
      await expect(page.locator('.extraction-warning')).toContainText('Could not extract all fields. Please review manually.');
    });

    test('Should allow editing partially extracted data before saving', async ({ page }) => {
      await page.click('text="Upload Proposer Form"');
      await page.setInputFiles('input[type="file"]', {
        name: 'partial.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('fake-partial-pdf'),
      });
      await page.click('button:has-text("Extract Data")');
      
      await page.waitForSelector('input[name="extracted-name"]');
      await page.fill('input[name="extracted-name"]', 'Corrected Name');
      await page.click('button:has-text("Approve & Save")');
      
      await expect(page.locator('.toast-success')).toContainText('Proposer saved successfully');
    });

    test('Should discard changes when manual entry is cancelled', async ({ page }) => {
      await page.click('text="Add Proposer Manually"');
      await page.fill('input[name="name"]', 'Discard Me');
      await page.click('button:has-text("Cancel")');
      
      await expect(page.locator('input[name="name"]')).not.toBeVisible();
      await expect(page.locator('table')).not.toContainText('Discard Me');
    });

    test('Should discard uploaded file and data when extraction is cancelled', async ({ page }) => {
      await page.click('text="Upload Proposer Form"');
      await page.setInputFiles('input[type="file"]', {
        name: 'cancel.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('fake-pdf'),
      });
      await page.click('button:has-text("Cancel")');
      
      await expect(page.locator('.modal-header')).not.toBeVisible();
    });
  });
});
