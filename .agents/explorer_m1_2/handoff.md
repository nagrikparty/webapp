# Handoff Report: Explorer Milestone 1/2

## 1. Observation
The following key observations were recorded during codebase investigation:
1. **Failing Test Log (`test-results/tier4-Tier-4-.../error-context.md`)**:
   - Location: `tests\e2e\tier4.spec.ts:230:3`
   - Error: `Error: page.evaluate: Execution context was destroyed, most likely because of a navigation`
   - Verbatim stack trace snippet:
     ```ts
     254 |     await page.evaluate(() => {
     |                ^ Error: page.evaluate: Execution context was destroyed, most likely because of a navigation
     255 |       localStorage.removeItem('sb-xlxanliztdzonbdrrriw-auth-token');
     ```
2. **Auth Handling (`src/components/AuthFlow.tsx`)**:
   - The current `AuthFlow` component does not contain any hash parser on mount (`useEffect` at lines 19-21 only runs `setHydrated(true)`), nor does it have any OTP/Magic Link signup data options (it uses standard `supabase.auth.signUp({ email, password })`).
3. **Dashboard Components (`src/components/MemberDashboard.tsx`)**:
   - It is missing the ID card container (`data-testid="id-card"`), the download button (`data-testid="download-id-card-button"`), the preset buttons (`data-testid="preset-100"`), the payment amount input (`data-testid="payment-amount-input"`), the donate button (`data-testid="donate-button"`), the donation history list (`data-testid="donation-history"`), the referral link (`data-testid="referral-link"`), the copy button (`data-testid="copy-referral-button"`), and the referral count (`data-testid="referral-count"`).
4. **Missing Donations API**:
   - The file `/src/pages/api/donations.ts` is missing in the repository, resulting in 404 response codes during donation logs recording.
5. **Profiles Sync Endpoint (`src/pages/api/sync-profile.ts`)**:
   - The endpoint only updates `id`, `email`, and `role` in the `profiles` table (lines 73-77). It does not fetch or save `full_name`, `ward`, `epic` (from `voter_id`), or `referred_by` from `membership_applications`.

---

## 2. Logic Chain
1. *Assertion Timing & Redirects*: Since the dashboard has no `id-card` container element, the test assertion `await expect(idCard).toBeVisible({ timeout: 1000 }).catch(() => {})` in `T4.4` times out after 1000ms. The swallow wrapper `.catch` allows the test to continue to step 3. The page then receives a 401 response from the user mock and navigates to `/auth`. The navigation occurs exactly when `page.evaluate` runs, causing the context destruction error.
2. *Unauthenticated/Invalid Endpoint Rejections*: In `T2.F3.2` and `T2.F3.3`, the test makes POST requests to `/api/donations` and checks for `400` or `401` status codes. Without a donations endpoint, Astro returns a 404. Creating `src/pages/api/donations.ts` with proper token authentication and request body validations ensures correct response codes are returned.
3. *Token Expiration Message*: In `T2.F1.3`, the test checks that visiting `/auth#access_token=expired_token&type=magiclink` displays an error message container with `"Invalid or expired OTP/link"`. Without hash parsing on mount, no error is displayed. Implementing this parser in `AuthFlow.tsx` sets the required error state.
4. *Profile Sync Completion*: For `T3.2` and other dashboard tests to display correct member details and referral link attributes, `sync-profile.ts` must query `membership_applications` and upsert the matching `full_name`, `ward`, `epic`, and `referred_by` fields into `profiles`.

---

## 3. Caveats
- Assumes the Supabase table `transactions` follows standard naming conventions. A SQL schema definition is provided to create this table with RLS policy enablement.
- Assumes the Razorpay frontend modal can be simulated using the global `window.Razorpay` mock constructed by Playwright tests.

---

## 4. Conclusion
To achieve successful, genuine completion of Milestone 1/2:
1. **AuthFlow.tsx**: Add hash parsing on mount for expired tokens and Magic Link logins; parse and save `ref` parameters to local storage; perform validation query checks on mounts.
2. **MemberDashboard.tsx**: Add ID card layout (with wrapper name wrapping and fallback epic formatting), QR code rendering via `react-qr-code`, dynamic `html2canvas` download with try-catch fallback, donation form input/presets, Razorpay modal integration, history logs, copy-referral links, and referral stats counting.
3. **sync-profile.ts**: Update profile sync to copy the application fields (`full_name`, `ward`, `voter_id`) and user metadata (`referred_by`) into the `profiles` table.
4. **donations.ts**: Create this endpoint to handle payment log insertions with Bearer auth checks.
5. **transactions table**: Deploy the `transactions` schema using a Supabase database migration.

---

## 5. Verification Method
1. Run database setup:
   `npx supabase migration new donations_schema` and add table creation, then apply.
2. Run compilation:
   `npm run build`
3. Execute the E2E Playwright tests:
   `npx playwright test`
4. Confirm all 49 tests pass without any warnings, timeout swallows, or execution context destructions.
