-- ============================================================================
-- Phase 1 Safe Seed / Demo Data
-- Nagrik Party Platform (Formation Phase)
--
-- STRICT PRIVACY & SAFETY NOTICE:
-- All data below is synthetic mock data for development and testing purposes.
-- Zero real Aadhaar numbers, zero real Voter IDs, zero real identity documents.
-- ============================================================================

-- 1. Organization Settings
INSERT INTO public.organization_settings (key, value, description)
VALUES 
  ('organization_phase', '"formation"'::jsonb, 'Current organizational phase of Nagrik Party (formation | registered_party)'),
  ('registration_open', '"true"'::jsonb, 'Whether new membership applications are currently accepted'),
  ('ocr_provider', '"gemini-flash"'::jsonb, 'OCR and document extraction provider'),
  ('max_upload_size_mb', '"5"'::jsonb, 'Maximum document upload size in megabytes'),
  ('card_auto_issue', '"false"'::jsonb, 'Automatically issue membership cards upon approval')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 2. Mock Admin & Verifier Profiles (Guaranteed synthetic UUIDs)
-- Demo Admin UUID: 00000000-0000-0000-0000-000000000001
-- Demo Verifier UUID: 00000000-0000-0000-0000-000000000002
-- Demo Member UUID: 00000000-0000-0000-0000-000000000003

INSERT INTO public.profiles (id, email, full_name, role, created_at)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'admin@nagrikparty.local', 'Central Administration Desk', 'ADMIN', NOW()),
  ('00000000-0000-0000-0000-000000000002', 'verifier@nagrikparty.local', 'Verification Scrutiny Officer', 'VERIFIER', NOW()),
  ('00000000-0000-0000-0000-000000000003', 'demomember@nagrikparty.local', 'DEMO MEMBER', 'MEMBER', NOW())
ON CONFLICT (id) DO UPDATE SET 
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role;

-- 3. Demo Application
INSERT INTO public.membership_applications (
  id,
  user_id,
  application_number,
  full_name,
  email,
  phone,
  status,
  membership_category,
  submitted_at,
  form_version,
  declaration_version,
  consent_version
) VALUES (
  '00000000-0000-0000-0000-000000000010',
  '00000000-0000-0000-0000-000000000003',
  'APP-2026-000001',
  'DEMO MEMBER',
  'demomember@nagrikparty.local',
  '+919876543210',
  'APPROVED',
  'Primary Member',
  NOW() - INTERVAL '10 days',
  '1.0',
  '1.0',
  '1.0'
) ON CONFLICT (id) DO NOTHING;

-- 4. Demo Member Record
INSERT INTO public.members (
  id,
  user_id,
  application_id,
  membership_id,
  full_name,
  category,
  status,
  approved_at,
  approved_by
) VALUES (
  '00000000-0000-0000-0000-000000000020',
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000010',
  'NAG-000001',
  'DEMO MEMBER',
  'Primary Member',
  'APPROVED',
  NOW() - INTERVAL '5 days',
  '00000000-0000-0000-0000-000000000001'
) ON CONFLICT (id) DO NOTHING;

-- 5. Demo Member Address (Synthetic Mock)
INSERT INTO public.member_addresses (
  id,
  user_id,
  application_id,
  full_legal_name,
  parent_or_guardian_name,
  date_of_birth,
  gender,
  occupation,
  phone,
  email,
  address_line1,
  address_line2,
  state,
  district,
  vidhan_sabha,
  pincode
) VALUES (
  '00000000-0000-0000-0000-000000000030',
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000010',
  'DEMO MEMBER',
  'Parent Mock Name',
  '1995-01-01',
  'Male',
  'Civic Researcher',
  '+919876543210',
  'demomember@nagrikparty.local',
  '123 Governance Enclave',
  'Sector 1',
  'Delhi',
  'New Delhi',
  'New Delhi (AC-40)',
  '110001'
) ON CONFLICT (id) DO NOTHING;

-- 6. Demo Electoral Record (Synthetic Mock)
INSERT INTO public.electoral_details (
  id,
  user_id,
  application_id,
  identity_proof_type,
  epic_number,
  vidhan_sabha,
  part_number,
  serial_number,
  is_verified
) VALUES (
  '00000000-0000-0000-0000-000000000040',
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000010',
  'Voter ID (EPIC)',
  'MOK0000001',
  'New Delhi (AC-40)',
  '42',
  '101',
  true
) ON CONFLICT (id) DO NOTHING;

-- 7. Demo Membership Card (CR80 Standard)
INSERT INTO public.membership_cards (
  id,
  member_id,
  card_number,
  card_version,
  issue_date,
  status,
  qr_token,
  verification_slug
) VALUES (
  '00000000-0000-0000-0000-000000000050',
  '00000000-0000-0000-0000-000000000020',
  'CR80-NAG-000001',
  1,
  CURRENT_DATE - 5,
  'ACTIVE',
  'demo-qr-token-000001',
  'NAG-000001'
) ON CONFLICT (id) DO NOTHING;

-- 8. Demo Financial Statements (Audited Formation Period)
INSERT INTO public.financial_statements (
  period_start,
  period_end,
  reporting_period,
  opening_balance,
  total_receipts,
  total_expenditure,
  closing_balance,
  published_by,
  published_at,
  notes
) VALUES (
  '2026-01-01',
  '2026-01-31',
  'January 2026',
  0.00,
  125000.00,
  45000.00,
  80000.00,
  '00000000-0000-0000-0000-000000000001',
  NOW() - INTERVAL '15 days',
  'Phase 1 initial formation expense statement: digital induction infrastructure and legal advisory.'
),
(
  '2026-02-01',
  '2026-02-28',
  'February 2026',
  80000.00,
  95000.00,
  62000.00,
  113000.00,
  '00000000-0000-0000-0000-000000000001',
  NOW() - INTERVAL '5 days',
  'Phase 1 formation expense statement: document verification architecture and public transparency portal.'
) ON CONFLICT DO NOTHING;

-- 9. Initial Audit Log
INSERT INTO public.audit_logs (
  actor_user_id,
  actor_role,
  action,
  entity_type,
  entity_id,
  metadata
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'ADMIN',
  'SYSTEM_SEED_INITIALIZED',
  'organization_settings',
  'organization_phase',
  '{"phase": "formation", "platform": "Nagrik Party Formation Architecture"}'::jsonb
);
