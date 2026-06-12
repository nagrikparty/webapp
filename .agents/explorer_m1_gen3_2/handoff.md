# Handoff Report: Auth & Admin God Mode Fixes

## 1. Observation
- **`src/pages/api/sync-profile.ts` (Lines 47-53)**: Uses the globally imported `supabase` client (`import { supabase } from "@/lib/supabase"`) to call `.upsert()` on the `profiles` table. This global client is initialized with the Anon key and lacks the user's authorization token, meaning it will fail under Row Level Security (RLS). Furthermore, the script overwrites the user's role on every login instead of persisting their existing role.
- **`src/components/AuthFlow.tsx`**: 
  - (Lines 23, 47, 51): Uses the raw `email` state for querying the `profiles` table and calling Supabase auth methods without applying `.toLowerCase()`.
  - The component lacks `data-testid` attributes required by the E2E tests (`email-input`, `password-input`, `submit-button`, `error-message`).
  - There is no role selection field (`data-testid="role-select"`) in the signup flow, which `tests/e2e/tier4.spec.ts` strictly relies upon.
- **`tests/e2e/tier4.spec.ts`**: Simulates direct navigation to `/signup` and `/login`, expecting the respective forms and inputs (including the `role-select` for signup) to be immediately available. Currently, only `/auth` exists and uses a multi-step flow that hides password and role inputs initially.

## 2. Logic Chain
1. **Integrity Violation Fix**: Since RLS is enabled on the `profiles` table, the anon client cannot insert records. `sync-profile.ts` must instantiate a scoped server-client using the user's access token:
   ```typescript
   const scopedClient = createClient(supabaseUrl, supabaseKey, {
     global: { headers: { Authorization: `Bearer ${token}` } }
   });
   ```
   Additionally, `sync-profile.ts` should query for an existing profile first to avoid overwriting an established user role (except when applying the `PUBLIC_ADMIN_EMAIL` bypass).
2. **Logic Bug Fix**: Because Postgres is case-sensitive, emails like `User@Email.com` will fail the `.eq("email", email)` check if stored in lowercase. `AuthFlow.tsx` must apply `email.trim().toLowerCase()` before executing any Supabase queries or auth calls.
3. **Missing Features & Test Failures**: To satisfy `tier4.spec.ts`:
   - `AuthFlow.tsx` needs a `<select data-testid="role-select">` field in the signup state, passing the selected role to Supabase via `options.data.role` or directly via the `sync-profile` POST body.
   - All inputs must be tagged with their respective `data-testid`s.
   - `AuthFlow` should accept an `initialStep` prop (e.g., `initialStep="signup"`) so that new pages `src/pages/signup.astro` and `src/pages/login.astro` can render the appropriate fields immediately to pass the E2E navigation sequences.

## 3. Caveats
- The reviewer's feedback mentioned that `data-testid="role-switcher"` is "missing from AuthFlow.tsx". Based on `tier4.spec.ts` (Scenario 4), the `role-switcher` is actually interacted with *after* the user navigates to the dashboard (e.g., dev debugging tools). It logically belongs in the dashboard layout or shell, not `AuthFlow.tsx`. 
- The implementer will also need to ensure that the dashboard pages (`volunteer.astro`, `member.astro`, etc.) contain the corresponding `data-testid`s (`volunteer-dashboard-content`, `profile-link`, etc.) to fully satisfy the `tier4.spec.ts` suite.

## 4. Conclusion
To resolve the milestone failures, the implementer must:
1. Rewrite `sync-profile.ts` to use a token-scoped Supabase client, query the existing profile before upserting, and correctly apply the `PUBLIC_ADMIN_EMAIL` bypass.
2. Update `AuthFlow.tsx` to apply `.trim().toLowerCase()` to the email input, add a `role-select` dropdown for signups, and attach all requested `data-testid`s.
3. Expose `AuthFlow` to accept an `initialStep` prop and create/update Astro pages (`login.astro`, `signup.astro`) to support direct routing.

## 5. Verification Method
1. **Manual Testing**: Run `npm run dev`, navigate to `/signup`. Ensure the form renders email, password, and the role dropdown. Sign up with a mixed-case email (e.g. `TestUser@example.com`) and verify successful routing to the selected dashboard.
2. **Unit / Component Inspection**: Verify `sync-profile.ts` correctly initializes `createClient` using the Bearer token.
3. **Automated Testing**: Run the Playwright test: `npx playwright test tests/e2e/tier4.spec.ts`. The auth steps (signup/login) should pass, confirming the presence of the `data-testid`s and case-insensitivity fix.
