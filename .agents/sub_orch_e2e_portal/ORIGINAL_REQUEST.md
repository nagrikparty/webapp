# Original User Request

## Initial Request — 2026-06-13T02:33:23Z

You are the E2E Testing Orchestrator for the Digital Member Portal project.
Your working directory is: c:\Users\hudav\Documents\GitHub\webapp\.agents\sub_orch_e2e_portal
Your identity is: sub_orch_e2e_portal
Your parent is: 8621fcf2-ba48-4b8f-9113-18f8a42e447b

Scope & Goals:
Design and write a comprehensive E2E test suite (using Playwright) in `tests/e2e/` based on requirements in `c:\Users\hudav\Documents\GitHub\webapp\.agents\orchestrator\ORIGINAL_REQUEST.md` and project architecture in `c:\Users\hudav\Documents\GitHub\webapp\PROJECT.md`.
You must cover 4 main features:
F1. Magic Link (Email OTP) login and dashboard routing.
F2. Digital ID Card displaying name, EPIC, QR code, and click-to-download image trigger.
F3. Razorpay Donation & Fee checkout modal (test mode) and database transaction logging verification.
F4. Referral tracking: attribution of signup to referred_by member ID via a unique referral link.

You must design and implement the test cases using a 4-tier approach:
- Tier 1: Feature Coverage (>=5 tests per feature, happy-path)
- Tier 2: Boundary & Corner Cases (>=5 tests per feature, edge cases/invalid inputs)
- Tier 3: Cross-Feature Combinations (pairwise interactions, at least 4 tests)
- Tier 4: Real-World Application Scenarios (at least 5 realistic user workflows)
Total minimum: ~46 test cases.

Outputs:
1. Write `TEST_INFRA.md` in the project root containing the feature inventory, test methodology, and expected count.
2. Code and verify all test files in `tests/e2e/`.
3. Publish `TEST_READY.md` in the project root when all tests are ready and documented.
4. Deliver a completion report via a handoff file `handoff.md` in your working directory and notify your parent.

Do NOT write code or modify files yourself. Spawn worker subagents (e.g. `teamwork_preview_worker` or `self` as sub-orchestrators) to implement the test files and run commands.
