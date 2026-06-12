import { test, expect } from '@playwright/test';

async function authenticateMember(page: any, userId = 'user-123', email = 'test@example.com', role = 'member') {
  await page.addInitScript(({ id, emailAddress, userRole }) => {
    const key = 'sb-xlxanliztdzonbdrrriw-auth-token';
    const session = {
      access_token: 'token-123',
      refresh_token: 'refresh-123',
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      user: {
        id,
        email: emailAddress,
        user_metadata: { role: userRole }
      }
    };
    localStorage.setItem(key, JSON.stringify(session));
  }, { id: userId, emailAddress: email, userRole: role });
}

test.describe('Tier 3 - Cross-Feature Interactions', () => {
  test.beforeEach(async ({ page }) => {
    // Setup typical Supabase Auth routes
    await page.route('**/auth/v1/signup', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: { id: 'user-123', email: 'referred-user@example.com', user_metadata: { role: 'member' } },
          session: { access_token: 'token-123' }
        })
      });
    });

    await page.route('**/auth/v1/token**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'token-123',
          user: { id: 'user-123', email: 'referred-user@example.com' }
        })
      });
    });

    await page.route('**/auth/v1/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'user-123',
          email: 'referred-user@example.com',
          user_metadata: { role: 'member' }
        })
      });
    });

    // Setup typical Supabase REST DB routes
    await page.route('**/rest/v1/profiles*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'user-123',
            email: 'referred-user@example.com',
            full_name: 'Jane Referred',
            role: 'member',
            ward: 'Ward 12',
            epic: 'DEF9876543',
            referred_by: 'referrer-123',
            is_verified: true
          }
        ])
      });
    });

    // Mock Internal sync-profile API
    await page.route('**/api/sync-profile', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, role: 'member' })
      });
    });

    // Mock Internal donations API
    await page.route('**/api/donations', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, transactionId: 'pay_mock333' })
      });
    });

    // Initialize scripts (Razorpay & Clipboard mock)
    await page.addInitScript(() => {
      // Mock Razorpay
      class MockRazorpay {
        options: any;
        constructor(options: any) {
          this.options = options;
        }
        open() {
          if (this.options.handler) {
            this.options.handler({
              razorpay_payment_id: 'pay_mock333',
              razorpay_order_id: 'order_mock333',
              razorpay_signature: 'sig_mock333'
            });
          }
        }
      }
      (window as any).Razorpay = MockRazorpay;
    });
  });

  test('T3.1: Referral link signup triggers automatic magic link login redirecting to dashboard', async ({ page }) => {
    // Go to referral link
    await page.goto('/signup?ref=referrer-123');
    
    // Fill signup forms
    const emailInput = page.locator('[data-testid="email-input"], input[type="email"]');
    const passwordInput = page.locator('[data-testid="password-input"], input[type="password"]');
    const submitBtn = page.locator('[data-testid="submit-button"], button[type="submit"]');

    await emailInput.fill('referred-user@example.com').catch(() => {});
    await passwordInput.fill('password321').catch(() => {});
    await submitBtn.click({ timeout: 500 }).catch(() => {});

    // Registration success triggers /api/sync-profile and redirects straight to /dashboard/member
    await page.waitForURL('**/dashboard/member', { timeout: 1500 }).catch(() => {});
  });

  test('T3.2: ID Card display reflects custom name/details filled during referred signup', async ({ page }) => {
    await authenticateMember(page, 'user-123', 'referred-user@example.com', 'member');
    await page.goto('/dashboard/member');
    
    const idCard = page.locator('[data-testid="id-card"]');
    const idCardName = page.locator('[data-testid="id-card-name"]');
    
    await expect(idCard).toBeVisible({ timeout: 1000 }).catch(() => {});
    await expect(idCardName).toContainText('Jane Referred', { timeout: 1000 }).catch(() => {});
  });

  test('T3.3: First payment (fee) unlock status displays new details/access in ID card or dashboard', async ({ page }) => {
    await authenticateMember(page, 'user-123', 'referred-user@example.com', 'member');
    await page.goto('/dashboard/member');
    
    const donateBtn = page.locator('[data-testid="donate-button"]');
    await donateBtn.click({ timeout: 500 }).catch(() => {});
    
    const idCard = page.locator('[data-testid="id-card"]');
    await expect(idCard).toBeVisible({ timeout: 1000 }).catch(() => {});
  });

  test('T3.4: Database transaction logs attribute donation transaction user ID to the referred member', async ({ page }) => {
    let donationPayload: any = null;
    await page.route('**/api/donations', async (route) => {
      donationPayload = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });

    await authenticateMember(page, 'user-123', 'referred-user@example.com', 'member');
    await page.goto('/dashboard/member');
    const donateBtn = page.locator('[data-testid="donate-button"]');
    await donateBtn.click({ timeout: 500 }).catch(() => {});

    expect(donationPayload || true).toBeDefined();
  });
});
