# Original User Request

## Initial Request — 2026-06-11T09:05:44Z

# Teamwork Project Prompt — Draft

> Status: Launched
> Goal: Craft prompt → get user approval → delegate to teamwork_preview

A real-time, ECI-compliant party member registration system that digitizes the entire offline induction process. It validates required fields and identity documents via AI vision, provides an admin verification queue, and supports importing historical proposer forms manually or via AI-powered PDF extraction.

Working directory: c:\Users\hudav\Documents\GitHub\webapp
Integrity mode: development

## Requirements

### R1. ECI-Compliant Membership Registration Flow
Build a multi-step frontend form for membership registration that captures full identity details, Voter ID (EPIC), and non-membership declarations. Integrate a backend endpoint that uses an LLM Vision API (e.g. Gemini Vision) to analyze uploaded identity documents (Aadhaar/Voter ID), ensuring they are legible, identifiable, and extracting text to validate against the user's input.

### R2. Admin Verification & Induction Queue
Implement a "Pending Verification" queue in the Admin Dashboard. Admins must be able to review the applicant's submitted details and documents, and manually approve (induct) or reject the application to convert them into official members.

### R3. Proposer Form Data Entry & PDF Extraction
Build an Admin interface to manually input legacy proposer data (from past independent elections). Include a PDF upload feature that passes scanned proposer forms to the Vision API, extracting handwritten or printed form fields and mapping them directly to the database schema for the admin to review and save.

## Acceptance Criteria

### ECI-Compliant Registration
- [ ] Submitting the registration form with valid data successfully creates a "pending" record in the database.
- [ ] Uploading a sample identity document successfully calls the backend vision endpoint, which returns parsed text/validation status and correctly matches or extracts the data.

### Admin Verification
- [ ] The Admin dashboard successfully displays a list of pending applications fetched from the database.
- [ ] Clicking "Approve" on a pending record successfully updates its status in the database to "inducted" / "official member".

### Proposer Integration
- [ ] The Admin can successfully save a new Proposer record to the database via the manual UI form.
- [ ] Uploading a sample PDF of a proposer form successfully calls the vision endpoint and pre-fills the manual data entry form with extracted text.

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
