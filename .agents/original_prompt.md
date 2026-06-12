# Original User Request

## 2026-06-09T01:36:54Z

# Teamwork Project Prompt — Final

Robustly finalize the backend and authentication flows for the Nagrik Party web app, ensuring the Admin role operates as a "god mode", login/signup flows are flawless for volunteers and members, and a developer-friendly role switcher is implemented for easy debugging.

Working directory: `c:\Users\hudav\Documents\GitHub\webapp`
Integrity mode: development

## Requirements

### R1. Robust Authentication & Role Assignment
The login and signup flows for Volunteers and Members must be flawless. The system should correctly handle new signups, existing users, and profile creation in the Supabase `profiles` table.

### R2. Environment-Based Admin Authentication
Implement an automatic "god mode" admin login mechanism. If a user logs in and their email matches an `PUBLIC_ADMIN_EMAIL` environment variable (configured for Cloudflare), they should automatically bypass standard role checks and be granted full Admin access. They should be routed to `/dashboard/admin`.

### R3. Debug Role Switcher
Implement a functional UI toggle or dropdown that allows a logged-in user to easily switch their dashboard view between "Volunteer" and "Member" to facilitate testing and debugging. You may decide the best UI implementation for this.

### R4. Comprehensive Bug Testing & Robustness
The backend endpoints and Supabase integrations (tasks, announcements, issues, profiles) must be thoroughly tested, debugged, and hardened to ensure absolute robustness in a production Cloudflare Workers environment.

## Acceptance Criteria

### Authentication Flow
- [ ] New user signups successfully create an auth user and a corresponding `profiles` record.
- [ ] Users with the `volunteer` role are perfectly routed to `/dashboard/volunteer`.
- [ ] Users with the `member` role are perfectly routed to `/dashboard/member`.

### Admin "God Mode"
- [ ] The app reads `PUBLIC_ADMIN_EMAIL` from the environment.
- [ ] If the authenticated user's email matches `PUBLIC_ADMIN_EMAIL`, they are granted full admin access and routed to `/dashboard/admin`, regardless of their underlying Supabase role.

### Debugging Features
- [ ] A functional UI toggle or mechanism exists for developers to switch between Volunteer and Member views.

### Robustness Verification
- [ ] All API endpoints and Supabase interactions execute successfully without unhandled promise rejections or TypeScript errors.
- [ ] The application builds successfully for Cloudflare (`npm run build`).
