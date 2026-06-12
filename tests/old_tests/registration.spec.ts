import { test, expect } from '@playwright/test';

test.describe('Feature 1 & 2: Membership Registration Form & Vision Validation', () => {

  // --- Tier 1: Happy Path ---

  test('T1.1: Complete valid registration form with EPIC (Voter ID)', async ({ page }) => {
    await page.goto('/');
    await page.fill('input[name="fullName"]', 'John Doe');
    await page.fill('input[name="phoneNumber"]', '9876543210');
    await page.selectOption('select[name="idType"]', 'EPIC');
    await page.fill('input[name="idNumber"]', 'ABC1234567');
    
    // Simulate file uploads
    await page.setInputFiles('input[name="idFrontImage"]', {
      name: 'front.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('mock front image')
    });
    await page.setInputFiles('input[name="idBackImage"]', {
      name: 'back.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('mock back image')
    });

    await page.click('button[type="submit"]');
    await expect(page.locator('text=Registration Successful')).toBeVisible();
  });

  test('T1.2: Complete valid registration form with Aadhaar', async ({ page }) => {
    await page.goto('/');
    await page.fill('input[name="fullName"]', 'Jane Smith');
    await page.fill('input[name="phoneNumber"]', '9123456780');
    await page.selectOption('select[name="idType"]', 'Aadhaar');
    await page.fill('input[name="idNumber"]', '123456789012');
    await page.setInputFiles('input[name="idFrontImage"]', { name: 'f.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('f') });
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Registration Successful')).toBeVisible();
  });

  test('T1.3: Complete valid registration form with Passport', async ({ page }) => {
    await page.goto('/');
    await page.fill('input[name="fullName"]', 'Alice Johnson');
    await page.fill('input[name="phoneNumber"]', '9988776655');
    await page.selectOption('select[name="idType"]', 'Passport');
    await page.fill('input[name="idNumber"]', 'Z9876543');
    await page.setInputFiles('input[name="idFrontImage"]', { name: 'f.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('f') });
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Registration Successful')).toBeVisible();
  });

  test('T1.4: Complete valid registration form with Driving License', async ({ page }) => {
    await page.goto('/');
    await page.fill('input[name="fullName"]', 'Bob Williams');
    await page.fill('input[name="phoneNumber"]', '9876501234');
    await page.selectOption('select[name="idType"]', 'Driving License');
    await page.fill('input[name="idNumber"]', 'DL1420110012345');
    await page.setInputFiles('input[name="idFrontImage"]', { name: 'f.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('f') });
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Registration Successful')).toBeVisible();
  });

  test('T1.5: Submit form using keyboard navigation only', async ({ page }) => {
    await page.goto('/');
    await page.focus('input[name="fullName"]');
    await page.keyboard.type('Keyboard User');
    await page.keyboard.press('Tab');
    await page.keyboard.type('9999999999');
    await page.keyboard.press('Tab');
    // Select idType via keyboard
    await page.keyboard.press('ArrowDown'); // selects first option
    await page.keyboard.press('Tab');
    await page.keyboard.type('ABC1234567');
    await page.keyboard.press('Tab'); // to file upload
    await page.setInputFiles('input[name="idFrontImage"]', { name: 'f.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('f') });
    await page.focus('button[type="submit"]');
    await page.keyboard.press('Enter');
    await expect(page.locator('text=Registration Successful')).toBeVisible();
  });

  test('T1.6: Valid form submission redirects to success/thank you page', async ({ page }) => {
    await page.goto('/');
    await page.fill('input[name="fullName"]', 'Redirect Test');
    await page.fill('input[name="phoneNumber"]', '9988776655');
    await page.selectOption('select[name="idType"]', 'EPIC');
    await page.fill('input[name="idNumber"]', 'ABC1234567');
    await page.setInputFiles('input[name="idFrontImage"]', { name: 'f.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('f') });
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*success.*/);
  });

  // --- Tier 2: Boundary/Error Tests ---

  test('T2.1: Submit with empty mandatory fields', async ({ page }) => {
    await page.goto('/');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Full Name is required')).toBeVisible();
    await expect(page.locator('text=Phone Number is required')).toBeVisible();
    await expect(page.locator('text=ID Type is required')).toBeVisible();
  });

  test('T2.2: Submit with invalid phone number format', async ({ page }) => {
    await page.goto('/');
    await page.fill('input[name="phoneNumber"]', '12345'); // too short
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Invalid phone number')).toBeVisible();
  });

  test('T2.3: Submit with invalid EPIC number format', async ({ page }) => {
    await page.goto('/');
    await page.selectOption('select[name="idType"]', 'EPIC');
    await page.fill('input[name="idNumber"]', '123'); // invalid format
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Invalid EPIC format')).toBeVisible();
  });

  test('T2.4: Submit with invalid Aadhaar format', async ({ page }) => {
    await page.goto('/');
    await page.selectOption('select[name="idType"]', 'Aadhaar');
    await page.fill('input[name="idNumber"]', '123456'); // not 12 digits
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Aadhaar must be 12 digits')).toBeVisible();
  });

  test('T2.5: Submit without uploading front image of ID', async ({ page }) => {
    await page.goto('/');
    await page.fill('input[name="fullName"]', 'No Image User');
    await page.fill('input[name="phoneNumber"]', '9988776655');
    await page.selectOption('select[name="idType"]', 'EPIC');
    await page.fill('input[name="idNumber"]', 'ABC1234567');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Front image of ID is required')).toBeVisible();
  });

  test('T2.6: Submit without uploading back image of ID (when required)', async ({ page }) => {
    await page.goto('/');
    await page.fill('input[name="fullName"]', 'No Back Image');
    await page.fill('input[name="phoneNumber"]', '9988776655');
    await page.selectOption('select[name="idType"]', 'Aadhaar');
    await page.fill('input[name="idNumber"]', '123456789012');
    await page.setInputFiles('input[name="idFrontImage"]', { name: 'f.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('f') });
    // Assuming Aadhaar requires back image
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Back image of ID is required')).toBeVisible();
  });

  test('T2.7: Uploading file exceeding max size limit', async ({ page }) => {
    await page.goto('/');
    const largeBuffer = Buffer.alloc(6 * 1024 * 1024); // 6MB
    await page.setInputFiles('input[name="idFrontImage"]', {
      name: 'large.jpg',
      mimeType: 'image/jpeg',
      buffer: largeBuffer
    });
    await expect(page.locator('text=File size exceeds limit')).toBeVisible();
  });

  test('T2.8: Uploading invalid file type', async ({ page }) => {
    await page.goto('/');
    await page.setInputFiles('input[name="idFrontImage"]', {
      name: 'document.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('pdf content')
    });
    await expect(page.locator('text=Invalid file type. Only images are allowed')).toBeVisible();
  });

  test('T2.9: Name field boundary test (very long name)', async ({ page }) => {
    await page.goto('/');
    const longName = 'A'.repeat(101);
    await page.fill('input[name="fullName"]', longName);
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Name exceeds maximum length')).toBeVisible();
  });

  test('T2.10: Form prevents multiple submissions (double click)', async ({ page }) => {
    await page.goto('/');
    await page.fill('input[name="fullName"]', 'Double Click');
    await page.fill('input[name="phoneNumber"]', '9988776655');
    await page.selectOption('select[name="idType"]', 'EPIC');
    await page.fill('input[name="idNumber"]', 'ABC1234567');
    await page.setInputFiles('input[name="idFrontImage"]', { name: 'f.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('f') });
    
    // Attempt double click
    await page.click('button[type="submit"]');
    await page.click('button[type="submit"]', { force: true }); // force click if disabled
    
    // Ensure button is disabled
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
  });

  test('T2.11: Vision validation failure - blurred document error', async ({ page }) => {
    await page.goto('/');
    // Mock the vision API endpoint to return blurred error
    await page.route('**/api/vision-validate', async route => {
      const json = { valid: false, error: 'Document is too blurry' };
      await route.fulfill({ json });
    });
    
    await page.fill('input[name="fullName"]', 'Blurry User');
    await page.fill('input[name="phoneNumber"]', '9988776655');
    await page.selectOption('select[name="idType"]', 'EPIC');
    await page.fill('input[name="idNumber"]', 'ABC1234567');
    await page.setInputFiles('input[name="idFrontImage"]', { name: 'f.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('f') });
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Document is too blurry')).toBeVisible();
  });

  test('T2.12: Vision validation failure - mismatched name error', async ({ page }) => {
    await page.goto('/');
    await page.route('**/api/vision-validate', async route => {
      const json = { valid: false, error: 'Name on document does not match entered name' };
      await route.fulfill({ json });
    });
    
    await page.fill('input[name="fullName"]', 'Mismatched User');
    await page.fill('input[name="phoneNumber"]', '9988776655');
    await page.selectOption('select[name="idType"]', 'EPIC');
    await page.fill('input[name="idNumber"]', 'ABC1234567');
    await page.setInputFiles('input[name="idFrontImage"]', { name: 'f.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('f') });
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Name on document does not match')).toBeVisible();
  });

  test('T2.13: Vision validation failure - expired ID', async ({ page }) => {
    await page.goto('/');
    await page.route('**/api/vision-validate', async route => {
      const json = { valid: false, error: 'Document is expired' };
      await route.fulfill({ json });
    });
    
    await page.fill('input[name="fullName"]', 'Expired User');
    await page.fill('input[name="phoneNumber"]', '9988776655');
    await page.selectOption('select[name="idType"]', 'Driving License');
    await page.fill('input[name="idNumber"]', 'DL1420110012345');
    await page.setInputFiles('input[name="idFrontImage"]', { name: 'f.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('f') });
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Document is expired')).toBeVisible();
  });

  test('T2.14: Vision validation failure - ID number mismatch', async ({ page }) => {
    await page.goto('/');
    await page.route('**/api/vision-validate', async route => {
      const json = { valid: false, error: 'ID number on document does not match' };
      await route.fulfill({ json });
    });
    
    await page.fill('input[name="fullName"]', 'Mismatch Number');
    await page.fill('input[name="phoneNumber"]', '9988776655');
    await page.selectOption('select[name="idType"]', 'EPIC');
    await page.fill('input[name="idNumber"]', 'ABC1234567');
    await page.setInputFiles('input[name="idFrontImage"]', { name: 'f.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('f') });
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=ID number on document does not match')).toBeVisible();
  });

});
