# Handoff Report

## 1. Observation
- `src/components/AuthFlow.tsx` lines 65-70 contain a facade that bypasses standard authentication: if the entered email matches `PUBLIC_ADMIN_EMAIL`, it immediately executes `window.location.href = '/dashboard/admin'` without interacting with Supabase auth.
- `src/components/AuthFlow.tsx` lines 94-100 contain hardcoded test bypass logic: if `supabase.auth.signInWithPassword` fails with "Invalid login credentials", it automatically calls `supabase.auth.signUp` using the same credentials to force a successful authentication in unseeded test environments.
- `src/components/AuthFlow.tsx` lines 81-83 contain a hardcoded rewrite of error messages, catching "already registered" and throwing a new generic `Error("User already exists")` which breaks natural error flows.
- `src/components/SignupForms.tsx` sends data to the `/api/signup` endpoint via `fetch`, but the JSON payload omits the user's `email` (lines 32-37 and 125-130).
- `src/pages/api/signup.ts` processes `/api/signup` requests and inserts records into `volunteer_applications` and `membership_applications` without the `email` field.
- `src/pages/api/sync-profile.ts` lines 56-61 attempt to query the `membership_applications` table filtering by `email` to determine if a new user should be assigned the `member` role, but since the email is never saved, it always defaults to `volunteer`.

## 2. Logic Chain
- The Admin God Mode facade completely skips credential validation, allowing anyone who simply enters the admin email to access the admin dashboard. This must be removed so the admin authenticates natively via Supabase.
- The `sync-profile.ts` file already contains correct logic to grant the `admin` role if the authenticated user's email matches `PUBLIC_ADMIN_EMAIL`. By removing the frontend facade, the admin login will securely pass through Supabase, and the backend role sync will grant the correct permissions.
- The fallback logic that signs up users upon a failed login is a severe integrity violation designed to bypass E2E tests. Removing it ensures logins strictly validate credentials.
- The role assignment sync in `sync-profile.ts` fails because the underlying data is incomplete. To fix the `volunteer`/`member` routing, the frontend form `SignupForms.tsx` must send the email to `/api/signup`, and `api/signup.ts` must save that email into the respective database tables. This completes the expected data pipeline and allows `sync-profile.ts` to successfully locate the user's application and correctly assign the `member` role.

## 3. Caveats
- No caveats. The issues were clearly traceable directly to the logic described by the auditor and reviewers.

## 4. Conclusion
The codebase contains critical integrity violations (facades, test bypasses) and missing data bindings that break role synchronization. 

**Fix Strategy:**
1. **`src/components/AuthFlow.tsx`**: Delete lines 65-70 (admin bypass facade) and lines 94-100 (login-to-signup fallback). Delete lines 81-83 and let the native `res.error` propagate directly without wrapping it.
2. **`src/components/SignupForms.tsx`**: Update the `fetch("/api/signup")` payloads in both `VolunteerForm` and `MembershipForm` to include `email: form.get("email")`.
3. **`src/pages/api/signup.ts`**: Extract `email` from `request.json()` and include it in the `.insert()` payloads for both `volunteer_applications` and `membership_applications`.
4. **`src/pages/api/sync-profile.ts`**: No changes are required. The existing secure role determination (assigning `admin` via `PUBLIC_ADMIN_EMAIL` and `member` via `membership_applications` lookup) will function correctly once `api/signup.ts` provides the missing data and `AuthFlow.tsx` securely signs the user in.

## 5. Verification Method
1. Verify `src/components/AuthFlow.tsx` no longer contains `window.location.href = '/dashboard/admin'` in the submit handler prior to `supabase.auth` calls.
2. Verify `src/components/AuthFlow.tsx` no longer contains a call to `supabase.auth.signUp` inside the `mode === "login"` block.
3. Verify `src/components/SignupForms.tsx` and `src/pages/api/signup.ts` correctly pass and store the `email` field.
4. Run `npm run build` and the standard E2E test suite to ensure the native flows now pass legitimately without cheats.
