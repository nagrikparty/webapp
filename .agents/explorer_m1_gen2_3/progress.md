# Progress

- Last visited: 2026-06-09T07:20:00+05:30
- Initialized workspace and wrote original prompt.
- Investigated `src/pages/auth.astro`, `src/pages/api/signup.ts`, `src/components/AuthFlow.tsx`, `src/components/SignupForms.tsx`.
- Discovered that `AuthFlow.tsx` does insecure client-side `profiles` upserting and ignores the `membership_applications` table.
- Proposed a server-side route `src/pages/api/auth/sync.ts` to calculate role securely.
- Drafted `proposed_sync.ts`.
- Wrote `handoff.md`.
- Mission complete.
