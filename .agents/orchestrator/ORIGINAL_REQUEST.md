# Original User Request

## Follow-up — 2026-06-12T21:00:53Z

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
