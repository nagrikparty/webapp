# Handoff Report: Auth & Admin God Mode Fixes

## 1. Observation
- **RLS Failure**: `src/pages/api/sync-profile.ts` (line 47) uses the global unauthenticated `supabase` client imported from `@/lib/supabase` for the `profiles` table `.upsert()`. This fails under Row Level Security (RLS) because the global client operates as an anonymous user without the session token.
- **Logic Bug**: `src/components/AuthFlow.tsx` (line 23) checks for existing emails using `.eq("email", email)`. Postgres is case-sensitive, meaning mixed-case emails (e.g., `User@Example.com`) fail to match existing lowercase records, breaking the login flow.
- **Missing Features & Tests**: `tests/e2e/tier4.spec.ts` attempts to navigate to `/login` and `/signup` routes directly. It expects interactive elements with specific `data-testid` attributes: `email-input`, `password-input`, `submit-button`, `error-message`, and `role-select` during signup, as well as a `role-switcher` during a dev debugging session on the dashboard. Currently, `AuthFlow.tsx` lacks these test IDs, does not have a `role-select`, and the `/login` and `/signup` routes do not exist.

## 2. Logic Chain
- To fix the RLS violation, `sync-profile.ts` must instantiate a scoped server client using `createClient` and inject the user's token (from the `Authorization` header) into the global headers. This ensures the `.upsert()` operation is performed with the user's actual permissions.
- To fix the case-sensitive email logic bug, the `email` variable must be lowercased (`email.toLowerCase()`) before querying the `profiles` table in `AuthFlow.tsx`, matching the existing lowercase formatting used during profile creation.
- To resolve test failures, `AuthFlow.tsx` must be updated to include the missing `data-testid` attributes. Furthermore, since tests navigate directly to `/login` and `/signup`, these routes must be created (e.g., `src/pages/login.astro` and `src/pages/signup.astro`) and configured to pass an initial state to `AuthFlow.tsx`. 
- The `role-switcher` used in Scenario 4 must be added to the dashboard layout or components for dev debugging purposes.

## 3. Caveats
- The E2E tests expect `role-select` during the signup flow to successfully route a user to the Member dashboard (`Scenario 2`). However, `sync-profile.ts` strictly determines the "member" role based on the presence of a record in `membership_applications`. The implementer must ensure the test data is either pre-seeded or that `AuthFlow.tsx`/`sync-profile.ts` safely accommodates this dev test scenario.
- It is assumed that `role-switcher` is a development-only tool to easily toggle roles on the dashboard without modifying the database directly, or it updates the profile role dynamically.

## 4. Conclusion
The implementer should execute the following fixes:
1. **Security**: Update `sync-profile.ts` to use a scoped Supabase client initialized with the user's JWT.
2. **Logic**: Apply `.toLowerCase()` to email inputs in `AuthFlow.tsx` before Supabase queries.
3. **Features/Testing**: 
   - Add all missing `data-testid` attributes to `AuthFlow.tsx`.
   - Add a `role-select` dropdown to the signup flow.
   - Implement the `role-switcher` UI element on the dashboards (or layout) for dev sessions.
   - Create `/login` and `/signup` Astro routes or redirects that render `AuthFlow.tsx`.

## 5. Verification Method
- **Static Inspection**: Verify `sync-profile.ts` uses `createClient` with the `Authorization` header.
- **Manual Test**: Attempt to log in using a mixed-case email to ensure it succeeds.
- **Automated Test**: Run `npx playwright test tests/e2e/tier4.spec.ts`. The tests should execute without "element not found" or URL routing errors.
