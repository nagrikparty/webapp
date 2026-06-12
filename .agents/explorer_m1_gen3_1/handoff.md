# Handoff: M1 Auth & Admin God Mode

## 1. Observation
- **`sync-profile.ts` RLS Failure:** In `src/pages/api/sync-profile.ts:47`, the code calls `await supabase.from("profiles").upsert(...)` using the globally instantiated, unauthenticated `supabase` client. This causes an RLS violation because the client lacks the session token.
- **`AuthFlow.tsx` Flow Mismatch & Missing Attributes:** `src/components/AuthFlow.tsx` uses a multi-step form (email first, password later). However, Playwright tests (`tests/e2e/tier1.spec.ts:5`, `tests/e2e/tier4.spec.ts:8`) navigate to `/signup` and expect to fill `email-input`, `password-input`, and `role-select` on the immediate first render. Furthermore, none of the expected `data-testid` attributes (`email-input`, `password-input`, `submit-button`, `error-message`, `success-message`) are present in `AuthFlow.tsx`.
- **Case-Sensitive Logic Bug:** In `src/components/AuthFlow.tsx:23`, the query `.eq("email", email)` does not lowercase the `email` variable, breaking mixed-case logins on Postgres.
- **Missing Pages:** The routes `/signup` and `/login` expected by the tests do not exist in `src/pages/`. Additionally, the tests navigate to `/dashboard`, but `src/pages/dashboard/index.astro` is missing, which will lead to a 404.
- **Missing Dashboard Test Hooks:** The components `VolunteerDashboard.tsx`, `MemberDashboard.tsx`, `AdminDashboard.tsx`, and `SmartIsland.tsx` lack multiple test hooks required by the suites: `data-testid="volunteer-dashboard-content"`, `data-testid="member-dashboard-content"`, `data-testid="admin-settings-link"`, `data-testid="logout-button"`, `data-testid="user-profile-menu"`, and a `<select data-testid="role-switcher">` intended for dev debugging.

## 2. Logic Chain
1. The global `supabase` client is created without auth tokens, so any mutating queries on an RLS-enabled table (`profiles`) will be rejected. Instantiating a new client scoped with the user's `Authorization: Bearer ${token}` header (or using the `SUPABASE_SERVICE_ROLE_KEY`) is required.
2. The `AuthFlow.tsx` implementation completely blocks the `tests/e2e/tier1.spec.ts` test execution because it hides the password and role fields until step 2, but the test requires them synchronously. `AuthFlow.tsx` must be refactored to support a single-form mode (or accept a `mode="login" | "signup"` prop).
3. Postgres is case-sensitive, so the email lookup in `AuthFlow.tsx` returns false negatives if casing varies, leading to the logic bug reported.
4. Without the `/signup`, `/login`, and `/dashboard` entry files, page navigations in Playwright immediately fail with 404s.
5. The various `toBeVisible()` and `selectOption()` test assertions in `tier4.spec.ts` and `tier1.spec.ts` mandate the inclusion of `data-testid` attributes across the Dashboard components and the Navigation (`SmartIsland.tsx`). 

## 3. Caveats
- I did not verify if `SUPABASE_SERVICE_ROLE_KEY` is guaranteed to be available in production for `sync-profile.ts`, but instantiating a scoped client using the provided user token is a secure and universal fallback.
- The `data-testid="role-switcher"` functionality (to dynamically switch roles) requires some dev-only or client-side context handling. I recommend placing it conditionally (e.g., in a Dev Tools panel or checking `import.meta.env.DEV`) in a common layout or `SmartIsland.tsx`.

## 4. Conclusion
To fix the integrity violations, test failures, and logic bugs:
1. **API:** Update `sync-profile.ts` to instantiate a scoped `supabase` client using the incoming user token (or service key).
2. **Auth UI:** Refactor `AuthFlow.tsx` to handle `mode="login"` and `mode="signup"` so that all form fields (`email-input`, `password-input`, `role-select`, etc.) are visible simultaneously. Add all required `data-testid`s and use `.toLowerCase()` on email queries.
3. **Pages:** Create `src/pages/signup.astro`, `src/pages/login.astro`, and `src/pages/dashboard/index.astro`. The dashboard index should fetch the profile role and redirect appropriately.
4. **Dashboards:** Inject the missing `data-testid`s into `VolunteerDashboard.tsx`, `MemberDashboard.tsx`, `AdminDashboard.tsx`, and `SmartIsland.tsx`. Introduce a `role-switcher` component for dev scenarios.

## 5. Verification Method
- **Run the E2E Tests:** Execute `npx playwright test tests/e2e/tier1.spec.ts` and `tests/e2e/tier4.spec.ts`. If the tests pass, the `data-testid` attributes, forms, routing, and role bypassing have been successfully addressed.
- **Manual API Test:** Simulate an unauthenticated POST to `/api/sync-profile` to ensure it rejects properly, and an authenticated POST to verify `profiles` row upserting circumvents the previous RLS failure.
