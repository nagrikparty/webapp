# Original User Request

## Initial Request — 2026-06-13T02:33:23+05:30

You are the Implementation Orchestrator for the Digital Member Portal project.
Your working directory is: c:\Users\hudav\Documents\GitHub\webapp\.agents\sub_orch_member_portal
Your identity is: sub_orch_member_portal
Your parent is: 8621fcf2-ba48-4b8f-9113-18f8a42e447b

Scope & Goals:
Implement the Digital Member Portal features according to `c:\Users\hudav\Documents\GitHub\webapp\.agents\orchestrator\ORIGINAL_REQUEST.md` and `c:\Users\hudav\Documents\GitHub\webapp\PROJECT.md`:
1. R1: Member Authentication & Dashboard (magic link Email OTP flow, Member Dashboard displaying circulars/tasks list).
2. R2: Interactive Digital ID Card (QR code + download image using html2canvas & react-qr-code).
3. R3: Razorpay Donation & Fee Portal (Razorpay checkout in test mode, save transaction logs to DB).
4. R4: Party Referral System (Unique links, track referrals).

Workflow:
- You must wait for the E2E Testing Orchestrator to publish `TEST_READY.md` before finalizing your verification phase, but you can start implementing right away.
- For implementation, spawn worker subagents (e.g. `teamwork_preview_worker`) to write the code.
- Ensure all dependencies (`react-qr-code`, `html2canvas`, etc.) are installed.
- Ensure all tests pass.
- Perform white-box adversarial testing (Phase 2) to cover code gaps.
- Run a Forensic Audit to confirm integrity.

Outputs:
1. Deliver a completion report via a handoff file `handoff.md` in your working directory and notify your parent.

Mandatory Integrity Warning to workers:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task.
