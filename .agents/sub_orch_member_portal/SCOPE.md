# Scope: Member Portal Implementation Track

## Architecture
- **Frontend**: Astro pages and React components (`src/pages`, `src/components`).
- **Backend**: Astro API routes (`src/pages/api`).
- **Database**: Supabase (tables: `profiles`, `transactions` or `donations`, `announcements`, `volunteer_tasks`).
- **Payments**: Razorpay SDK (test mode).
- **ID Generation**: `react-qr-code` for QR code, `html2canvas` for downloading the card as PNG/JPEG.

## Milestones
| # | Name | Scope | Dependencies | Status | Conversation ID |
|---|------|-------|-------------|--------|-----------------|
| 1 | Member Auth & Dashboard | Magic Link (Email OTP) login, Member Dashboard displaying circulars & tasks | none | IN_PROGRESS | 97e08aab-8b25-42ff-aa2e-92eada299fad, ebb91b9e-55bf-45a4-a480-c732dbd872ac, fd99e6d7-ba5b-45bf-87f6-1a992e67a23a |
| 2 | Interactive Digital ID Card | HTML/CSS ID card, QR code generation, click-to-download as image | M1 | IN_PROGRESS | 97e08aab-8b25-42ff-aa2e-92eada299fad, ebb91b9e-55bf-45a4-a480-c732dbd872ac, fd99e6d7-ba5b-45bf-87f6-1a992e67a23a |
| 3 | Razorpay Donation & Fee Portal | Razorpay checkout integration (test mode), transaction logging linked to profiles | M1 | IN_PROGRESS | 97e08aab-8b25-42ff-aa2e-92eada299fad, ebb91b9e-55bf-45a4-a480-c732dbd872ac, fd99e6d7-ba5b-45bf-87f6-1a992e67a23a |
| 4 | Referral Tracking System | Unique referral links, attribution of signup to `referred_by` | M1 | IN_PROGRESS | 97e08aab-8b25-42ff-aa2e-92eada299fad, ebb91b9e-55bf-45a4-a480-c732dbd872ac, fd99e6d7-ba5b-45bf-87f6-1a992e67a23a |
| 5 | Phase 1 E2E Verification | Ensure all tests pass | M1, M2, M3, M4 | PLANNED | TBD |
| 6 | Phase 2 Adversarial Gaps | Gaps analysis and coverage hardening | M5 | PLANNED | TBD |
| 7 | Forensic Audit | Confirm integrity with auditor | M6 | PLANNED | TBD |

## Interface Contracts
### Auth & Dashboard
- Authentication: `supabase.auth.signInWithOtp` sends Email OTP / magic link.
- Dashboard routes: `/dashboard/member` displays circulars and tasks.
- If profiles doesn't exist, created upon sync.
- Circulars (from announcements table, target_audience in ['all', 'members']) and tasks (from volunteer_tasks table).

### ID Card
- Renders user details: full_name, voter_id/epic, ward/lok_sabha/vidhan_sabha.
- QR code using `react-qr-code` containing verify URL or user ID.
- Downloads using `html2canvas`.

### Razorpay Payments
- Razorpay frontend checkout modal using Razorpay SDK.
- API route `/api/donations` to save transactions to database.
- Saves payment logs in `transactions` table.

### Referral System
- `profiles` table contains `referred_by` column pointing to referrer's `id`.
- Signup page accepts `ref` query param, maps to `referred_by` in database.

## Code Layout
- `src/components/MemberDashboard.tsx`
- `src/components/AuthFlow.tsx` / `src/pages/auth.astro`
- `src/pages/api/sync-profile.ts`
- `src/pages/api/donations.ts`
- `src/pages/api/signup.ts`
