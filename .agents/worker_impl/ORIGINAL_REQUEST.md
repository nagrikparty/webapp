## 2026-06-13T02:40:35Z
Please implement the E2E test suite for the Digital Member Portal in `tests/e2e/`.

### 1. Cleanup
Delete or rename any existing `.spec.ts` or `.test.ts` files in `tests/e2e/` (such as `admin-approval.spec.ts`, `proposer.spec.ts`, `registration-admin-integration.spec.ts`, `registration.spec.ts`, `scenarios.spec.ts`) to avoid conflicting test runs.

### 2. Implement the test files
Create the following four Playwright test files in `tests/e2e/` matching the test cases designed in `TEST_INFRA.md`:
- `tests/e2e/tier1.spec.ts` (20 tests covering F1-F4 happy paths)
- `tests/e2e/tier2.spec.ts` (20 tests covering F1-F4 boundary/corner/error cases)
- `tests/e2e/tier3.spec.ts` (4 tests covering cross-feature interactions)
- `tests/e2e/tier4.spec.ts` (5 tests covering real-world application scenarios)

Use Playwright's `page.route` to mock all backend and network requests (Supabase Auth endpoints, Supabase REST DB endpoints, Razorpay SDK scripts/iframe callbacks, and internal API routes `/api/sync-profile` and `/api/donations`). This makes the tests fast, deterministic, and self-contained.

Here are the required selectors and test configurations to use so that the implementation track can match them:
- Email Input: `data-testid="email-input"` or `input[type="email"]`
- Password Input: `data-testid="password-input"` or `input[type="password"]`
- Role Select: `data-testid="role-select"`
- Submit Button: `data-testid="submit-button"` or `button[type="submit"]`
- Error message container: `data-testid="error-message"`
- Success message container: `data-testid="success-message"`
- Dashboard Container: `data-testid="member-dashboard-content"`
- ID Card Container: `data-testid="id-card"`
- ID Card Name: `data-testid="id-card-name"`
- ID Card EPIC: `data-testid="id-card-epic"`
- ID Card QR Code: `data-testid="qr-code"`
- ID Card Download Button: `data-testid="download-id-card-button"`
- Donate Button: `data-testid="donate-button"`
- Custom Donation Amount Input: `data-testid="payment-amount-input"`
- Preset Donation Amount Buttons: `data-testid="preset-100"`, `data-testid="preset-500"`, `data-testid="preset-1000"`
- Donation History Container: `data-testid="donation-history"`
- Referral Link URL Display: `data-testid="referral-link"`
- Copy Referral Link Button: `data-testid="copy-referral-button"`
- Referral Stats Display: `data-testid="referral-count"`

Please write clean, modern TypeScript Playwright code. Make sure that all tests are fully stubbed/mocked (e.g. mocking `window.Razorpay` class to immediately fire the success handler, mocking clipboard copy, etc.) so that they run successfully.

When done, run the Playwright test suite using `npx playwright test` to verify that Playwright can successfully discover, compile, and run all 49 test cases (some might fail or pass depending on the current frontend implementation status, but the test runner should compile and execute them). Report the command output and handoff.

## 2026-06-12T21:22:05Z
Please create or overwrite the file `c:\Users\hudav\Documents\GitHub\webapp\TEST_READY.md` with the following content:

```markdown
# E2E Test Suite Ready

## Test Runner
- Command: `npx playwright test`
- Expected: all tests pass with exit code 0

## Coverage Summary
| Tier | Count | Description |
|------|------:|-------------|
| 1. Feature Coverage | 20 | 5 tests per feature (happy-path) |
| 2. Boundary & Corner | 20 | 5 tests per feature (edge cases / errors) |
| 3. Cross-Feature | 4 | Pairwise interactions of features |
| 4. Real-World Application | 5 | E2E user workflows and lifecycles |
| **Total** | **49** | |

## Feature Checklist
| Feature | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|---------|:------:|:------:|:------:|:------:|
| F1. Magic Link (Email OTP) Login | 5 | 5 | ✓ | ✓ |
| F2. Digital ID Card | 5 | 5 | ✓ | ✓ |
| F3. Razorpay Donation & Fee Portal | 5 | 5 | ✓ | ✓ |
| F4. Party Referral System | 5 | 5 | ✓ | ✓ |
```
