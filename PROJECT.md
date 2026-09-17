# Nagrik Party Platform Architecture

**Repository**: `nagrikparty/webapp`  
**Current Status**: `PHASE 1 — FORMATION PHASE`  
**Public Status Description**:  
> *"Nagrik Party — Formation Phase: An independent political initiative working toward the formation and registration of a political party under Section 29A of the Representation of the People Act, 1951."*

---

## 1. Executive Summary & Core Doctrine
Nagrik Party is being built in public as a modern, audit-grade civic institution and political party formation platform.

### Operating Motto
**"काम दिखना चाहिए" (Kaam dikhna chahiye — Governance before power)**

### Anti-Fraud & Regulatory Safeguards
1. **Zero Fake Claims**: Never claim to be an Election Commission of India (ECI) registered party until gazetted. Never invent an allotted election symbol or government affiliation.
2. **Card Standard**: Printable membership cards are strictly declared as **"Party Membership Card — Not a Government ID / Not an EPIC Card"**.
3. **No Cash Donations**: 100% cashless voluntary support with published audited financial statements.
4. **Collect Once, Verify Once, Store Properly, Reuse Everywhere**: The verified member record securely powers Member Profiles, CR80 Cards, QR Verification, Internal Rolls, and Continuous Regulatory Dossier Exports.

---

## 2. Technical Stack
- **Framework**: Astro 5 (Server-Side Rendering mode)
- **Deployment Adapter**: `@astrojs/cloudflare`
- **UI Components**: React 19, Lucide Icons, Bilingual Astro components
- **Database & Auth**: Supabase PostgreSQL with 100% Row Level Security (RLS)
- **Private Storage**: Supabase Storage (`documents`, `membership-cards`) mediated via short-lived signed URLs
- **Cryptographic Hashing**: Standard Web Crypto API (`crypto.subtle.digest("SHA-256")`)
- **PDF Generation**: `pdf-lib` for CR80 card generation and regulatory submission exports
- **Testing**: Playwright End-to-End test suite across Chromium

---

## 3. Brand & Visual Identity
- **Canonical Logo**: Exclusively `/nagrikpartylogo.svg`.
- **Central Reference**: `src/lib/brand.ts` and `src/components/Logo.astro`.
- **Palette**:
  - Deep Ink: `#1d1d1f` / `#111827`
  - Paper Background: `#f5f5f7` / `#ffffff`
  - Saffron: `#F58220`
  - Deep Civic Green: `#00873E`
  - Alert Red: `#dc2626`
  - Border Line: `rgba(0, 0, 0, 0.08)`

---

## 4. Phase Architecture
- `organization_phase = "formation"` (Phase 1 Active).
- `organization_phase = "registered_party"` (Phase 2 Locked/Dormant).

Phase 1 provides complete public transparency, digital membership induction, voter verification, document vaulting, crime tracking, and submission exports. Phase 2 (formal national executive elections, voting, candidate ticket allocation) remains dormant until official gazette notification.

---

## 5. Route Architecture

### Public & Civic Pages
- `/` — Homepage with first-viewport Phase 1 badges, civic lifecycle, manifesto voting, and crime tracker preview.
- `/crime` — Dedicated Verified Crime Tracker with category breakdown, live citation feed, and methodology.
- `/crimes/[type]` — Categorized verified incident citation archive (`/crimes/rape`, `/crimes/murder`, etc.).
- `/formation-progress` — 9-stage roadmap tracking legal party formation toward Section 29A RPA 1951 registration (Stage 3 Active).
- `/transparency` — Audited balance sheets, cashless donation ledger, and zero-cash pledge.
- `/documents` — Public archive of 24 foundational charters, draft constitution, and sectoral frameworks with SHA-256 hashes.
- `/membership` — Entryway to the 10-step digital induction flow.
- `/verify/member/[id]` — Privacy-safe QR verification resolving member standing with zero PII leaks.
- `/about` — Origin, philosophy, and people's opposition framework.
- `/manifesto` — Living policy priorities voted upon by supporters and verified members.
- `/issues` — Public civic issue reporting with identity protection.
- `/volunteer` — Volunteer mobilization network.
- `/president` — Founding leadership, vision, and Delhi 2025 mission.
- `/legal/[slug]` — Statutory rules, ethics compact, internal democracy, and privacy policy.

### Authentication & Account Flows
- `/login` — Email/password sign-in with automatic role-based redirect.
- `/signup` — Registration with constitutional affirmation.
- `/forgot-password` — Password recovery trigger.
- `/reset-password` — Secure password update callback.

### Member Portal (`/member`)
- `/member` — Overview, verification status banner, and quick actions.
- `/member/induction` — 10-step digital induction flow:
  1. Personal details & contacts
  2. Residential address & Delhi 70 AC selection
  3. Identity & EPIC voter ID proof
  4. Membership category
  5. Participation areas (13 civic sectors)
  6. Authentic constitutional declaration
  7. Statutory data consent
  8. Confirmation
  9. Attestation
  10. Submission (`APP-YYYY-xxxxxx`)
- `/member/documents` — Encrypted private document vault with SHA-256 hash validation.
- `/member/membership-card` — Front/back printable CR80 card preview and PDF download.
- `/member/profile` — Verified member standing and constituency record.
- `/member/status` — Multi-stage verification progress tracker.
- `/member/contributions` — Voluntary cashless contribution ledger.

### Administration & Scrutiny Console (`/admin`)
- `/admin` — Executive dashboard metrics and alerts.
- `/admin/applications` — Application intake queue with status filtering.
- `/admin/verifications` — Verification desk with 4-way document scrutiny (EPIC OCR, Delhi 70 AC cross-match, affidavits, declarations).
- `/admin/members` — Master Member Register with search and constituency filters.
- `/admin/cards` — CR80 card issuance, re-issue, and revocation console.
- `/admin/exports` — Government submission export compiler (continuous 1..N page numbering, CSV/PDF bundles).
- `/admin/finance` — Cashless contribution logging and audited statement publisher.
- `/admin/audit` — Immutable audit log recording all privileged actions with actor IDs, IPs, and timestamps.
- `/admin/settings` — Phase lock status and platform settings.

---

## 6. Security, RLS & Storage Model

### Roles Hierarchy
`PUBLIC` &rarr; `MEMBER` &rarr; `VERIFIER` &rarr; `ADMIN` &rarr; `SUPER_ADMIN`

### Database Entities
`profiles`, `members`, `membership_applications`, `membership_declarations`, `membership_consents`, `documents`, `document_extractions`, `document_verifications`, `membership_cards`, `audit_logs`, `crimes`, `issues`, `public_documents`, `financial_statements`, `organization_settings`.

### Storage Security
- Sensitive documents (Voter IDs, affidavits, photographs) are stored in private Supabase buckets (`documents`, `membership-cards`).
- Access is strictly governed via short-lived signed URLs.
- Zero service-role keys or privileged credentials in frontend client bundles.

---

## 7. Verified Crime Tracker Specification
- Data is sourced from reputable published news sources and police reports across Delhi NCR.
- Every record links directly to the external source URL with title, date, and category.
- Categories: `Rape`, `Murder`, `Kidnapping`, `Robbery`, `Extortion`.
- Public route `/crime` displays real counts and citation cards.
- API `/api/v1/crimes` handles verified citation querying and administrative ingestion.

---

## 8. Verification Commands
```bash
# Typecheck
npm run check

# Production Build
npm run build

# Playwright Test Suites
npx playwright test
```
