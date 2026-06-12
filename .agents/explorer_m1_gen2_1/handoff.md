# Handoff Report: Secure Admin Bypass and Role Logic Fix

## Observation
- In `src/components/AuthFlow.tsx`, the client directly determines the user's role: `const role = email === import.meta.env.PUBLIC_ADMIN_EMAIL ? "admin" : "volunteer";`
- The client-side code then performs an upsert: `await supabase.from("profiles").upsert({ id: user.id, email, role });`
- The admin check (`email === import.meta.env.PUBLIC_ADMIN_EMAIL`) is strictly case-sensitive.
- All non-admin signups are hardcoded as `"volunteer"`, despite `SignupForms.tsx` correctly segregating data into `volunteer_applications` and `membership_applications` tables.
- `astro.config.mjs` configures the project for SSR (`output: "server"`), meaning `src/pages/api/*` routes execute fully server-side.

## Logic Chain
1. Trusting the client to supply `role: "admin"` means any user can inspect the network request, use the exposed `PUBLIC_ADMIN_EMAIL` as a reference, or directly call the Supabase API to set their own role to "admin", resulting in a severe privilege escalation vulnerability.
2. Because the application runs in SSR mode, we can securely handle role assignment on the server using an Astro API endpoint.
3. The server endpoint should accept the user's authentication token (`access_token`), verify it securely via `supabase.auth.getUser()`, and extract the email.
4. The server can then perform a case-insensitive check against a hidden `ADMIN_EMAIL` environment variable.
5. If not admin, the server can query `membership_applications` (and `volunteer_applications`) to correctly assign the "member" or "volunteer" role, fixing the hardcoded volunteer issue.
6. The server then upserts the profile and returns the assigned role to the client for correct routing (`/dashboard/<role>`).

## Caveats
- Moving the logic to an API endpoint stops the client application from misbehaving, but **does not fully secure the database if Row Level Security (RLS) policies still allow users to update their own `role` column**. RLS on `profiles` must be updated (e.g., via the Supabase dashboard) to prevent users from modifying their own role. 
- Using a server-side API route ideally requires a `SUPABASE_SERVICE_ROLE_KEY` to update the profile if RLS is correctly locked down. If this key is not present in `.env`, it will need to be added.
- If we cannot change RLS, a database trigger on `auth.users` insertion would be an even better architectural choice, but creating an API route is the most immediate codebase-level fix.

## Conclusion
- Remove `PUBLIC_ADMIN_EMAIL` and rename it to `ADMIN_EMAIL` in environment variables so it is kept secret on the server.
- Remove all `supabase.from("profiles").upsert(...)` logic from `src/components/AuthFlow.tsx`.
- Create a secure API route (e.g., `src/pages/api/auth/sync.ts`) that:
  1. Receives the user's session token.
  2. Resolves the user email securely via `supabase.auth.getUser(token)`.
  3. Uses case-insensitive comparison for `ADMIN_EMAIL`.
  4. Checks `membership_applications` to identify "member" signups before defaulting to "volunteer".
  5. Upserts the `profiles` table securely on the server.
- The client should call this API route after authentication and use the returned role to navigate to `/dashboard/<role>`.

## Verification Method
- Inspect `src/components/AuthFlow.tsx` to verify that no `profiles` upserts occur on the client.
- Inspect `src/pages/api/auth/sync.ts` (or equivalent) to ensure the `access_token` is validated, the email check is case-insensitive, and `membership_applications` is queried.
- Test the application locally by signing up as a user who is not the admin, and attempting to intercept and modify the role payload; ensure it fails or is ignored by the server.
