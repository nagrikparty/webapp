# Handoff Report: Auth & Admin God Mode Fixes

## 1. Observation
- In `src/components/AuthFlow.tsx` (lines 66-70), there is a blind redirect for the admin email: 
  ```typescript
  if (normalizedEmail === adminEmail && adminEmail !== "") { window.location.href = `/dashboard/admin`; return; }
  ```
- This redirect occurs *before* any Supabase authentication call, meaning no session token is generated.
- In `src/components/AuthFlow.tsx` (lines 81-83), there is hardcoded error mapping:
  ```typescript
  if (res.error.message.includes("already registered") || res.error.message.includes("already exists")) { throw new Error("User already exists"); }
  ```
- In `src/components/AuthFlow.tsx` (lines 94-101), the fallback logic for `mode === "login"` calls `supabase.auth.signUp` if `signInWithPassword` returns `"Invalid login credentials"`. However, if the user actually *does* exist but just entered the wrong password, `signUp` will return a success object with `user.identities: []` (when email enumeration protection is active). The current code blindly accepts this as a success, resulting in the user seeing "Please check your email" instead of the expected "Invalid login credentials".
- In `tests/e2e/tier1.spec.ts` (line 36), the duplicate user test expects the exact string `'already exists'`.

## 2. Logic Chain
1. **Admin God Mode Failure:** Because the admin is redirected before a session is created, the `/dashboard/admin` layout correctly identifies them as unauthenticated and bounces them back to `/login`. This directly causes the 3 admin-related E2E tests to fail (time out or assertion fail).
2. **Proper Admin Session:** The codebase already has a functional role assignment mechanism. If the admin goes through the standard login/signup flow, `/api/sync-profile.ts` correctly overrides their role to `"admin"` and the standard flow will redirect them to `/dashboard/admin` with a valid session. The blind redirect is completely unnecessary.
3. **Hardcoded Error Logic:** The code replaces Supabase's native `"User already registered"` message with `"User already exists"` just to pass the E2E test. Removing this hardcoding requires updating the E2E test to expect `"already registered"`. 
4. **Silent Failure on Duplicate Users:** With email enumeration protection, Supabase does not throw an error when signing up an existing email; instead it returns `user.identities = []`. We must detect this in both the normal signup flow and the login fallback flow to properly bubble up the `"User already registered"` or `"Invalid login credentials"` error.

## 3. Caveats
- Assuming `PUBLIC_ADMIN_EMAIL` is set in the environment matching `admin@nagrikparty.com` as tested by Playwright.
- Assuming Supabase email enumeration protection is currently active or will be active in production (this justifies checking `identities.length === 0`).

## 4. Conclusion
The implementation strategy for the Implementer is:
1. **Remove Admin Blind Redirect:** Delete lines 66-70 in `AuthFlow.tsx`.
2. **Fix Signup Duplicate Handling:** In `mode === "signup"`, remove the hardcoded string replacement and just `throw res.error`. Add a check: `if (res.data?.user?.identities && res.data.user.identities.length === 0) throw new Error("User already registered");`.
3. **Fix Login Fallback Bug:** In `mode === "login"`, when `fallbackRes = await supabase.auth.signUp(...)` is called, verify `if (fallbackRes.data?.user?.identities && fallbackRes.data.user.identities.length === 0)`. If true, `throw res.error` (the original "Invalid login credentials").
4. **Update E2E Test:** In `tests/e2e/tier1.spec.ts` (line 36), change `'already exists'` to `'already registered'`.

## 5. Verification Method
- **Run E2E Tests:** Execute `npx playwright test tests/e2e/tier1.spec.ts`. All Tier 1 tests (especially Admin Login and Duplicate Signup) should pass.
- **Manual Verification:** Attempt to login with an existing user's email but a *wrong password*. You should see "Invalid login credentials", not a success message.
