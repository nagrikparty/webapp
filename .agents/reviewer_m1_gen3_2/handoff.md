# Handoff Report

## Observation
1. In `src/components/AuthFlow.tsx` (lines 66-70), the admin bypass logic checks if the user's input email matches `PUBLIC_ADMIN_EMAIL` and immediately redirects to `/dashboard/admin`, skipping `supabase.auth.signInWithPassword` entirely:
   ```typescript
   const adminEmail = (import.meta.env.PUBLIC_ADMIN_EMAIL || "").toLowerCase();
   if (normalizedEmail === adminEmail && adminEmail !== "") {
     window.location.href = `/dashboard/admin`;
     return;
   }
   ```
2. In `src/pages/api/sync-profile.ts` (lines 56-61), the `role` is determined by querying the `membership_applications` table using the user's `email`.
3. In `src/pages/api/signup.ts` (lines 16-21), when a membership application is inserted, the `email` field is not included. It only saves `id`, `lok_sabha`, `vidhan_sabha`, and `ward`.
4. In `src/components/AuthFlow.tsx` (lines 94-101), there is a fallback that registers users if `signInWithPassword` fails with "Invalid login credentials" "to make E2E test pass".
5. Playwright test execution failed to start the webserver: `Error: Timed out waiting 60000ms from config.webServer.`

## Logic Chain
1. The admin email check in `AuthFlow.tsx` redirects the user without creating a valid session with Supabase. Thus, anyone typing the admin email and *any password* is redirected, constituting a critical authentication bypass and an **Integrity Violation** (a dummy/facade implementation that skips the actual backend login).
2. The `sync-profile.ts` script attempts to set a user's role to "member" if they exist in `membership_applications` under their email. However, `signup.ts` never saves the email field to this table. As a result, the lookup in `sync-profile.ts` will always fail, and all new members will be incorrectly defaulted to "volunteer". Furthermore, the `role` selected in the UI (`AuthFlow.tsx` line 77) is never actually used by the backend to set the profile.
3. The tests are timing out locally due to the Astro server failing to start or a misconfiguration in Playwright.

## Caveats
- I did not verify if the dashboard itself validates sessions because the fundamental authentication step is already bypassed on the frontend, making the auth flow structurally invalid.
- I couldn't run tests to completion due to `config.webServer` timeout in playwright.

## Conclusion
**Verdict: REQUEST_CHANGES (Critical Integrity Violation)**
The implementation contains a critical security flaw where typing the admin email logs the user into the admin dashboard without verifying their password. In addition, the role synchronization logic is broken because the email is never saved in the `membership_applications` table. The changes must be corrected to authenticate the admin properly and sync roles using the selected role in the auth form.

## Verification Method
1. Inspect `src/components/AuthFlow.tsx` to confirm that the `adminEmail` check immediately redirects without awaiting a Supabase auth method.
2. Sign up as a "member" and check `profiles` table to see if the role successfully became "member" (it will fail and fallback to volunteer).
