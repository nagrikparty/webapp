## 2026-06-13T02:53:18Z
Objective: Implement the Digital Member Portal features according to PROJECT.md, and the E2E tests in tests/e2e/.

Please perform the following implementations:
1. **Member Authentication & Dashboard (R1)**:
   - In `src/components/AuthFlow.tsx`, add a passwordless Magic Link (Email OTP) login.
   - When the email form is submitted, call `supabase.auth.signInWithOtp` to send the OTP/magic link. Show a success message upon sending.
   - Add a `useEffect` hook to check if the user is already authenticated or if the auth hash parameters are present on load. Listen to auth state changes using `supabase.auth.onAuthStateChange`. When session is found, call `/api/sync-profile` to sync the profile, then redirect the user to `/dashboard/${role}` (where role is returned by the API).
   - In `src/components/MemberDashboard.tsx`, query and display the `volunteer_tasks` (where status is 'open' or assigned_to is the user's ID) in addition to announcements.

2. **Interactive Digital ID Card (R2)**:
   - In `src/components/MemberDashboard.tsx`, render a beautiful card with `data-testid="id-card"`. It must display:
     - Member full name (`data-testid="id-card-name"`)
     - Member EPIC / voter ID (`data-testid="id-card-epic"`, showing placeholder/fallback if missing)
     - Verifiable QR Code (`data-testid="qr-code"`), rendering using `react-qr-code` with a verify URL.
     - A download button (`data-testid="download-id-card-button"`). Clicking this button should download the ID card as a PNG/JPEG using `html2canvas`. Add a loading state (`downloading` state) to prevent multiple file downloads if fast double-clicked. If `html2canvas` fails to load or render, display an error message in `[data-testid="error-message"]`.

3. **Razorpay Donation & Fee Portal (R3)**:
   - In `src/components/MemberDashboard.tsx`, render:
     - An input for payment amount (`data-testid="payment-amount-input"`).
     - Three preset amount buttons (`data-testid="preset-100"`, `data-testid="preset-500"`, `data-testid="preset-1000"`). Clicking a preset sets the amount input value.
     - A donation button (`data-testid="donate-button"`). It must be disabled when the amount is empty, 0, or negative, or when payment is in progress.
     - A list/container showing the user's transaction history (`data-testid="donation-history"`).
   - When clicking "Donate", open the Razorpay checkout modal (Test Mode) using the Razorpay SDK (`window.Razorpay`).
   - On successful payment, post the transaction details to `/api/donations` and display a success message (`data-testid="success-message"`). On modal dismiss/cancel or failure, show a user-facing error message in `[data-testid="error-message"]`.
   - Implement the `/api/donations.ts` API endpoint. It must validate that the request is authenticated via Bearer token, validate the request body (amount > 0, non-empty transactionId), save the transaction to the database, and return success. If missing token return 401, if invalid body return 400.

4. **Party Referral System (R4)**:
   - In `src/components/MemberDashboard.tsx`, render:
     - The unique referral link (`data-testid="referral-link"`) containing the member's ID as `ref` query param.
     - A copy button (`data-testid="copy-referral-button"`). Clicking it should copy the referral link to clipboard (`navigator.clipboard.writeText`) and set `(window as any).__clipboardText`.
     - The count of members referred by this user (`data-testid="referral-count"`), queried from the profiles table where `referred_by` matches user ID.
   - In `src/components/AuthFlow.tsx` (during signup):
     - If a `ref` query parameter is present:
       - Query Supabase `profiles` table to validate the referrer. If invalid or malformed, show a warning error message (`[data-testid="error-message"]`). If the logged-in user matches the referrer, block it as self-referral and display an error.
       - Store the referrer ID in `localStorage` under the key `'referrer_id'`.
   - In `src/pages/api/sync-profile.ts`:
     - Read the `referred_by` parameter from the request body. If the user does not have an existing profile, or does not have a referrer already set, save `referred_by` into their profile. Make sure to prevent overwriting existing attribution if they already had a referrer.

5. **Verification**:
   - Run `npm run build` to ensure the project compiles successfully.
   - Run the Playwright tests via `npx playwright test`. Check if all tests pass.
   - Write a migration file `supabase/migrations/01_member_portal.sql` with the required schema adjustments.
