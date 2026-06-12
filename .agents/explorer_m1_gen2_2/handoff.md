# Handoff Report: Milestone 1 (Auth & Admin God Mode)

## 1. Observation
- `src/components/AuthFlow.tsx` currently performs role determination and `profiles` table upsert strictly on the client-side.
- In `AuthFlow.tsx`: `const role = email === import.meta.env.PUBLIC_ADMIN_EMAIL ? "admin" : "volunteer";`
- `src/pages/auth.astro` is using `AuthFlow` client component.
- Astro is configured for SSR (`output: "server"` with Cloudflare adapter in `astro.config.mjs`).
- Signups for volunteer and member are recorded in `volunteer_applications` and `membership_applications` tables respectively, with an `email` field (see `src/components/SignupForms.tsx`).

## 2. Logic Chain
1. **Security Risk**: The client-side logic trusts the user's browser to assign `role: "admin"` and write it to the `profiles` table. A malicious user could modify the payload. Moving this to a server-side route prevents client manipulation.
2. **Case Sensitivity**: Comparing `email` to `PUBLIC_ADMIN_EMAIL` must use `.toLowerCase()` on both strings to avoid mismatch if the user types their email with capital letters.
3. **Missing Member Logic**: The previous code defaults everyone except the admin to `"volunteer"`. We must query the `membership_applications` table to check if the user's email exists there. If so, they are a `"member"`.

## 3. Caveats
- If the project doesn't have `SUPABASE_SERVICE_ROLE_KEY` defined in its environment, the server-side route will fall back to using the anon key. The implementer should configure the `.env` with `SUPABASE_SERVICE_ROLE_KEY` if available to ensure RLS bypass on the server, or use the database execute_sql tool to create a Postgres DB trigger instead if preferred. However, an API route is the most natural fit for this Astro setup.
- The user session token must be passed from the client to the API route to securely identify the user without spoofing.

## 4. Conclusion
The most maintainable and secure fix strategy is to:
1. **Create an API endpoint** at `src/pages/api/sync-profile.ts` which accepts an `Authorization` header containing the user's access token.
2. The endpoint verifies the token via `supabase.auth.getUser()`.
3. The endpoint performs case-insensitive comparison against `PUBLIC_ADMIN_EMAIL` to set the `admin` role.
4. If not admin, the endpoint queries `membership_applications` by email (case-insensitive if possible or normalized) to determine if the role should be `member` or `volunteer`.
5. The endpoint securely upserts the role to the `profiles` table and returns the determined role to the client.
6. **Update `src/components/AuthFlow.tsx`** to call this endpoint upon successful login/signup, using the returned role for routing (`/dashboard/${role}`).

## 5. Verification Method
1. Verify no client-side code contains `role: "admin"` assignments.
2. Log in with an email matching `PUBLIC_ADMIN_EMAIL` (using different casing) and verify routing to `/dashboard/admin`.
3. Submit a member signup form, then sign up with that email, and verify routing to `/dashboard/member`.
4. Sign up with a random email and verify routing to `/dashboard/volunteer`.
