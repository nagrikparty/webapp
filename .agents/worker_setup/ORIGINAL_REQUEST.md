## 2026-06-12T21:04:46Z
Objective: Install the dependencies `react-qr-code` and `html2canvas` using npm. Run a test build (`npm run build`) to check for compilation issues. Run the existing tests using `npx playwright test` and report the command outputs.
Your working directory for coordination: c:\Users\hudav\Documents\GitHub\webapp\.agents\worker_setup

MANDATORY INTEGRITY WARNING: DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task.

## 2026-06-12T21:34:37Z
Please create or overwrite the file `c:\Users\hudav\Documents\GitHub\webapp\TEST_INFRA.md` with the following content.

```markdown
# E2E Test Infra: Digital Member Portal

## Test Philosophy
- Opaque-box, requirement-driven testing. No direct dependency on implementation details.
- Methodology: Category-Partition, Boundary Value Analysis, Pairwise Combinatorial, and Real-World Workload/Scenario Testing.
- Framework: Playwright (`@playwright/test`).

## Feature Inventory
| # | Feature | Source (requirement) | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|---|---------|---------------------|:------:|:------:|:------:|:------:|
| F1 | Magic Link (Email OTP) Login | ORIGINAL_REQUEST §12-13 | 5 | 5 | ✓ | ✓ |
| F2 | Interactive Digital ID Card | ORIGINAL_REQUEST §15-16 | 5 | 5 | ✓ | ✓ |
| F3 | Razorpay Donation & Fee Portal | ORIGINAL_REQUEST §18-19 | 5 | 5 | ✓ | ✓ |
| F4 | Party Referral System | ORIGINAL_REQUEST §21-22 | 5 | 5 | ✓ | ✓ |

## Test Architecture
- **Test Runner**: Playwright (`npx playwright test`)
- **Test Files**: Located in `tests/e2e/` (e.g., `tests/e2e/tier1.spec.ts`, `tests/e2e/tier2.spec.ts`, `tests/e2e/tier3.spec.ts`, `tests/e2e/tier4.spec.ts`)
- **Database Logs**: Verifying that transactions are recorded in the transaction logs under the Supabase DB schema.

## Coverage Summary
| Tier | Description | Expected Count |
|------|-------------|:--------------:|
| 1 | Feature Coverage (Happy path, 5 per feature) | 20 |
| 2 | Boundary & Corner Cases (5 per feature) | 20 |
| 3 | Cross-Feature Interactions (Pairwise combinations) | 4 |
| 4 | Real-World Application Scenarios (Integration/Workflows) | 5 |
| **Total** | | **49** |

## Test Case Checklist

### Tier 1: Feature Coverage (Happy Path)
#### F1. Magic Link (Email OTP) Login
- T1.F1.1: Request OTP successfully sends a verification payload.
- T1.F1.2: Valid OTP / link logs user in and redirects to `/dashboard/member`.
- T1.F1.3: Member dashboard loads circulars and volunteering tasks.
- T1.F1.4: Already authenticated member is auto-redirected away from login to dashboard.
- T1.F1.5: Member session persists across manual page refreshes.

#### F2. Digital ID Card
- T1.F2.1: ID Card card container is visible in dashboard.
- T1.F2.2: ID Card displays the member's full name.
- T1.F2.3: ID Card displays the member's EPIC (voter ID).
- T1.F2.4: ID Card renders the auto-generated QR code.
- T1.F2.5: ID Card click-to-download trigger initiates a PNG/JPEG download.

#### F3. Razorpay Payments
- T1.F3.1: Clicking "Donate" or payment trigger opens Razorpay modal (test mode).
- T1.F3.2: Successful checkout in Razorpay test mode triggers local success callback.
- T1.F3.3: Transaction records are logged to the database via API post-checkout.
- T1.F3.4: Payment history list in dashboard updates to show new transactions.
- T1.F3.5: Support selecting multiple donation/fee pre-set amounts (e.g. 100, 500, 1000).

#### F4. Referral System
- T1.F4.1: Dashboard renders a unique referral link containing member's ID.
- T1.F4.2: Clicking referral link copies it to clipboard.
- T1.F4.3: Opening referral URL stores referrer ID (e.g. cookies, localstorage, or query).
- T1.F4.4: Registering via referral link attributes the new profile's `referred_by` to the referrer.
- T1.F4.5: Referrer dashboard displays updated statistics (e.g., total referred count).

### Tier 2: Boundary & Corner Cases
#### F1. Magic Link (Email OTP) Login
- T2.F1.1: Submitting login form with empty email triggers HTML5 validation or error.
- T2.F1.2: Submitting login form with invalid email format displays format error.
- T2.F1.3: Attempting login verify with incorrect or expired OTP/link shows clear error.
- T2.F1.4: Unauthenticated access to `/dashboard/member` redirects back to auth.
- T2.F1.5: Accessing `/dashboard/member` with non-member role (e.g. volunteer) redirects appropriately.

#### F2. Digital ID Card
- T2.F2.1: Very long member names are displayed without overlapping text / layout breaking.
- T2.F2.2: Missing/null EPIC member details show appropriate fallback/placeholder.
- T2.F2.3: QR code value verification - check that URL matches expected format.
- T2.F2.4: Fast double-clicks on download button do not spawn double file downloads.
- T2.F2.5: Graceful error fallback displayed if `html2canvas` library fails to load or render.

#### F3. Razorpay Payments
- T2.F3.1: Close payment modal without completing payment shows cancelled/dismissed status.
- T2.F3.2: API route `/api/donations` rejects invalid payloads (missing transaction ID, negative amount, etc.).
- T2.F3.3: API route `/api/donations` rejects unauthenticated requests.
- T2.F3.4: Payment amount at boundary (0 or negative) is blocked on checkout.
- T2.F3.5: Razorpay failure response shows appropriate user-facing warning.

#### F4. Referral System
- T2.F4.1: Accessing referral link with non-existent or malformed referrer ID.
- T2.F4.2: Self-referral protection (cannot be referred by oneself).
- T2.F4.3: Registration form displays warning if referrer ID is invalid.
- T2.F4.4: Existing user trying to use a referral link after signup does not overwrite existing attribution.
- T2.F4.5: Multiple signups using same referral link attribute all to the same referrer correctly.

### Tier 3: Cross-Feature Combinations
- T3.1: Referral link signup triggers automatic magic link login redirecting to dashboard.
- T3.2: ID Card display reflects custom name/details filled during referred signup.
- T3.3: First payment (fee) unlock status displays new details/access in ID card or dashboard.
- T3.4: Database transaction logs attribute donation transaction user ID to the referred member.

### Tier 4: Real-World Application Scenarios
- T4.1: Complete Member Lifecycle: Signup via referral -> Magic link login -> view ID card -> make first donation -> verify logs.
- T4.2: Referred Member onboarding flow with failed verification: Referrer URL -> invalid email registration error -> successful correction -> login -> verify referral stats increment.
- T4.3: High-activity Member session: Log in -> make three consecutive donations -> verify dashboard history contains all three transactions.
- T4.4: Session restoration and security checks: Log in -> check ID card -> log out -> attempt direct navigation to `/dashboard/member` (should be blocked).
- T4.5: Referral viral growth loop: User A refers User B -> User B registers -> User B refers User C -> User C registers -> verify A has 1 referral, B has 1 referral, and database correctly tracks hierarchy.
```

