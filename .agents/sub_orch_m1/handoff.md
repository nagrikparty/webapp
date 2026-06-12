# Soft Handoff: M1: Auth & Admin God Mode

## Milestone State
- M1: Auth & Admin God Mode is currently IN_PROGRESS. We are in Iteration 3 of the loop.

## Key Artifacts
- `c:\Users\hudav\Documents\GitHub\webapp\.agents\sub_orch_m1\SCOPE.md`
- `c:\Users\hudav\Documents\GitHub\webapp\.agents\explorer_m1_gen3_1\handoff.md`

## Observation & Logic Chain
- Iteration 2 failed gate evaluation. Reviewers and Auditor found:
  1. `sync-profile.ts` uses an anonymous `supabase` client for `.upsert()`, which causes an RLS violation.
  2. `AuthFlow.tsx` uses case-sensitive emails and lacks required test hooks (`data-testid`).
  3. `AuthFlow.tsx` does not support direct routing to `/signup` or `/login`.
  4. Missing routes: `/signup`, `/login`, `/dashboard/index.astro`.
  5. Missing dashboard test hooks (`role-switcher`, etc.).
- In Iteration 3, Explorer 1 provided a comprehensive fix strategy in `explorer_m1_gen3_1/handoff.md`. Explorer 2 and 3 failed due to quota.

## Remaining Work
1. Spawn an Implementation Worker (Gen 3) to execute the fix strategy detailed in `explorer_m1_gen3_1/handoff.md`.
   - Update `sync-profile.ts` to instantiate a scoped `supabase` client.
   - Refactor `AuthFlow.tsx` to handle `mode="login" | "signup"` so fields are immediately visible, add `data-testid`s, and lowercase emails.
   - Create `src/pages/signup.astro`, `src/pages/login.astro`, `src/pages/dashboard/index.astro`.
   - Inject missing `data-testid`s in dashboards and `SmartIsland.tsx`, and add a conditionally rendered `role-switcher`.
2. After the Worker finishes, spawn Reviewers and Auditor (Gen 3).
3. Evaluate Gate.
4. If gate passes, send completion handoff to parent (`6115dc11-a0ff-410b-a0e5-c2fe11df2a2e`).
