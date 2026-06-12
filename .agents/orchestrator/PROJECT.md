# Project: Nagrik Party Web App Backend & Auth Refinement

## Architecture
- Astro + React + Cloudflare Workers + Supabase.
- Pages handle SSR where needed.
- `lib/supabase.ts` sets up the client.
- Auth forms are in `components/AuthFlow.tsx`, `components/SignupForms.tsx`.
- APIs in `pages/api/`.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Auth & Admin God Mode | Fix Vol/Mem login/signup, profiles table sync. Add PUBLIC_ADMIN_EMAIL admin bypass and route to `/dashboard/admin`. | none | PLANNED |
| 2 | Debug Role Switcher | UI toggle for developers to switch between Volunteer and Member views. | M1 | PLANNED |
| 3 | Bug Testing & Robustness | Endpoints/Supabase robustness. Fix unhandled rejections, TS errors, verify Cloudflare build. | M1, M2 | PLANNED |

## Interface Contracts
### Auth ↔ Dashboards
- Auth flows must set session cookies or use Supabase SSR auth.
- Login resolves role to `admin`, `volunteer`, or `member`.
- Correct redirection post-login (`/dashboard/<role>`).

## Code Layout
- `src/pages/api/` - Backend endpoints
- `src/components/` - React components
- `src/pages/dashboard/` - Role-specific views
