## Handoff Report

### 1. Observation
- `npm run build` and `npm run check` succeed with 0 errors (only unused import warnings).
- `src/pages/api/sync-profile.ts` imports the global `supabase` client from `@/lib/supabase` (which is instantiated with the anon key). It uses `supabase.auth.getUser(token)` to validate the token, but then uses the same global client for `.from("membership_applications").select(...)` and `.from("profiles").upsert(...)`.
- `src/pages/api/sync-profile.ts` checks the membership application using `.eq("email", userEmail)`. While `userEmail` is lowercased, `src/components/SignupForms.tsx` inserts emails into `membership_applications` exactly as typed (without lowercasing).
- `src/components/AuthFlow.tsx` checks if a user exists with `.eq("email", email)`, using the raw user input without `.toLowerCase()` or `.ilike()`.

### 2. Logic Chain
1. **Server-Side Anon Client Flaw**: As per Supabase design, `auth.getUser(token)` validates the JWT but *does not* set the session on the client. Therefore, the `.upsert()` and `.select()` calls in `sync-profile.ts` execute as the anonymous user. This fails the "securely on the server" requirement: either Row-Level Security (RLS) will block the requests (breaking the app), or RLS allows anon access (creating a severe vulnerability where anyone could spoof profiles).
2. **Case-Sensitivity Bug (Membership)**: PostgreSQL `.eq()` is strictly case-sensitive. If a user enters a mixed-case email during membership application (e.g., `Test@example.com`), it is stored mixed-case. When they authenticate, the server lowercases their email but `.eq()` fails to match the DB record, erroneously assigning them the "volunteer" role.
3. **Case-Sensitivity Bug (Auth Flow)**: If a returning user types a mixed-case email into the auth form, `.eq("email", email)` in `AuthFlow.tsx` will fail to find their lowercase profile, pushing them to the Signup flow instead of Login.

### 3. Caveats
- The exact RLS policies on the `profiles` and `membership_applications` tables were not verified locally as the database was not accessible. However, using the global anon client for user-specific server-side updates is structurally incorrect and unsafe regardless of the specific RLS configuration.

### 4. Conclusion
**Verdict: REQUEST_CHANGES (Critical)**
The worker correctly moved the logic to an Astro endpoint and properly routed roles, but introduced a critical structural flaw by attempting authenticated queries with an anonymous client. Additionally, case-insensitivity requirements were missed on database queries.

The worker must:
1. Create an authenticated client instance in the API route using the user's token (or Service Role key) instead of importing the global anon client.
2. Fix case-sensitivity by using `.toLowerCase()` on email inputs in `AuthFlow.tsx` and using `.ilike()` or `.toLowerCase()` normalization for DB insertions/queries in `SignupForms.tsx` and `sync-profile.ts`.

### 5. Verification Method
- **Code Inspection**: Ensure `sync-profile.ts` creates a new Supabase client with the `Authorization` header rather than using the imported `@/lib/supabase` singleton.
- **Code Inspection**: Check `AuthFlow.tsx` and `sync-profile.ts` for `.ilike` or `.toLowerCase()` on email DB lookups.
- **Testing**: Submit a membership application with a mixed-case email, sign up with the same mixed-case email, and verify that the user is correctly identified as a "member" and routed to `/dashboard/member`.
