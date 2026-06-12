# Original User Request

## Initial Request — 2026-06-09T01:36:54Z

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

## Follow-up — 2026-06-12T21:00:53Z

# Teamwork Project Prompt — Draft

> Status: Launched
> Goal: Craft prompt → get user approval → delegate to teamwork_preview

A comprehensive digital member portal for inducted party members featuring downloadable QR-coded ID cards, a secure Razorpay payment gateway for donations/fees, a dashboard for volunteering tasks/circulars, and a referral system to track party growth.

Working directory: c:\Users\hudav\Documents\GitHub\webapp
Integrity mode: demo

## Requirements

### R1. Member Authentication & Dashboard
Implement an authentication flow where inducted members can log in using Email OTP (magic links). Once authenticated, they are redirected to a dedicated Member Dashboard that displays party circulars and available volunteering tasks.

### R2. Interactive Digital ID Card
Within the dashboard, generate a highly aesthetic, dynamic HTML/CSS ID card displaying the member's details and an auto-generated QR code. Use libraries like `react-qr-code` and `html2canvas` so the user can download the ID card as an image.

### R3. Razorpay Donation & Fee Portal
Integrate a secure payment flow using the Razorpay SDK (in test mode) within the dashboard. Members should be able to pay their induction fee or make general party donations, with transactions securely recorded in the database.

### R4. Party Referral System
Develop a referral mechanism where each member has a unique referral link. When new users register via this link, the system must track and attribute the successful induction to the referring member to gamify party growth.

## Acceptance Criteria

### Authentication & Dashboard
- [ ] Submitting an email on the login page successfully sends an OTP/magic link.
- [ ] Clicking the magic link successfully authenticates the user and grants access to the protected Member Dashboard route.

### Digital ID Card
- [ ] The dashboard renders a visually rich ID card containing the user's name, EPIC number, and a verifiable QR code.
- [ ] Clicking "Download ID Card" successfully triggers a browser download of the ID card as a PNG/JPEG image without visual artifacting.

### Razorpay Integration
- [ ] Clicking "Donate" successfully opens the Razorpay checkout modal (in Test Mode).
- [ ] Completing a test payment successfully creates a transaction record in the database linked to the member's ID.

### Referral Tracking
- [ ] The dashboard clearly displays a unique referral URL for the logged-in member.
- [ ] A new user completing the registration form while using the referral URL successfully sets the `referred_by` field in the database to the original member's ID.
