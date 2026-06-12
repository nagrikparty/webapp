# Project: Digital Member Portal

## Architecture
- **Frontend**: Astro pages and React components (`src/pages`, `src/components`).
- **Backend**: Astro API routes (`src/pages/api`).
- **Database**: Supabase (tables: `profiles`, `transactions`, `announcements`, `volunteer_tasks`).
- **Payments**: Razorpay SDK (test mode).
- **ID Generation**: `react-qr-code` for QR code, `html2canvas` for downloading the card as PNG/JPEG.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Member Auth & Dashboard | Magic Link (Email OTP) login, Member Dashboard displaying circulars & tasks | none | PLANNED |
| 2 | Interactive Digital ID Card | HTML/CSS ID card, QR code generation, click-to-download as image | M1 | PLANNED |
| 3 | Razorpay Donation & Fee Portal | Razorpay checkout integration (test mode), transaction logging linked to profiles | M1 | PLANNED |
| 4 | Referral Tracking System | Unique referral links, attribution of signup to `referred_by` | M1 | PLANNED |

## Interface Contracts
### Auth & Dashboard
- Authentication: `supabase.auth.signInWithOtp` sends Email OTP / magic link.
- Dashboard routes: `/dashboard/member` displays circulars and tasks.
### ID Card
- Uses `react-qr-code` and `html2canvas` to render and download.
### Razorpay Payments
- Razorpay frontend checkout modal using Razorpay SDK.
- API route `/api/donations` to save transactions to database.
### Referral System
- `profiles` table contains `referred_by` column pointing to referrer's `id`.
- Signup page accepts `ref` query param, maps to `referred_by` in database.

## Code Layout
- `src/components/MemberDashboard.tsx`: Updates to display ID card, donations, tasks/circulars, and referral link.
- `src/components/AuthFlow.tsx` / `src/pages/login.astro`: Support for magic link (Email OTP) login.
- `src/pages/api/sync-profile.ts`: Support mapping referrers during profile sync.
- `src/pages/api/donations.ts`: Save transaction logs in database.
- `src/pages/api/signup.ts`: Handle registration with referrer.
