# E2E Test Suite Ready

## Test Runner
- Command: `npx playwright test`
- Expected: all tests pass with exit code 0

## Coverage Summary
| Tier | Count | Description |
|------|------:|-------------|
| 1. Feature Coverage | 20 | 5 tests per feature (happy-path) |
| 2. Boundary & Corner | 20 | 5 tests per feature (edge cases / errors) |
| 3. Cross-Feature | 4 | Pairwise interactions of features |
| 4. Real-World Application | 5 | E2E user workflows and lifecycles |
| **Total** | **49** | |

## Feature Checklist
| Feature | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|---------|:------:|:------:|:------:|:------:|
| F1. Magic Link (Email OTP) Login | 5 | 5 | ✓ | ✓ |
| F2. Digital ID Card | 5 | 5 | ✓ | ✓ |
| F3. Razorpay Donation & Fee Portal | 5 | 5 | ✓ | ✓ |
| F4. Party Referral System | 5 | 5 | ✓ | ✓ |
