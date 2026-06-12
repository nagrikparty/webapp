## 2026-06-09T01:47:57Z
Your working directory is c:\Users\hudav\Documents\GitHub\webapp\.agents\explorer_m1_gen2_3.
Task: M1: Auth & Admin God Mode.
Scope: Fix Vol/Mem login/signup, profiles table sync. Add PUBLIC_ADMIN_EMAIL check for Admin bypass, route to `/dashboard/admin`. Route Volunteer to `/dashboard/volunteer`, Member to `/dashboard/member`.
Read: c:\Users\hudav\Documents\GitHub\webapp\.agents\sub_orch_m1\SCOPE.md.

PREVIOUS ITERATION FAILED. Reviewer Feedback:
1. Security Risk: Using `PUBLIC_ADMIN_EMAIL` on the client and trusting client-side `role: "admin"` upserts allows privilege escalation. The admin bypass must be implemented securely (e.g. using a secure server-side route in `src/pages/api/...`, Edge Function, or DB trigger).
2. Case-Sensitivity: Checking `email === PUBLIC_ADMIN_EMAIL` must be case-insensitive.
3. Missing Member Logic: The previous worker hardcoded `"volunteer"` for all new non-admin signups, ignoring Member signups.

Investigate the codebase to design a secure and complete fix. Recommend a new fix strategy in `handoff.md` and send me a message with the path.
