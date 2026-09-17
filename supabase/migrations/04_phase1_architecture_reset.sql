-- ============================================================================
-- Migration 04: Phase 1 Architecture Reset & Complete Rebuild Schema
-- Nagrik Party Platform
-- ============================================================================

-- Sequences for formatted human-readable IDs
CREATE SEQUENCE IF NOT EXISTS public.membership_id_seq START WITH 1;
CREATE SEQUENCE IF NOT EXISTS public.app_number_seq START WITH 1;

-- Functions for auto-generating formatted IDs
CREATE OR REPLACE FUNCTION public.generate_membership_id()
RETURNS TEXT
LANGUAGE sql
AS $$
  SELECT 'NAG-' || lpad(nextval('public.membership_id_seq')::text, 6, '0');
$$;

CREATE OR REPLACE FUNCTION public.generate_application_number()
RETURNS TEXT
LANGUAGE sql
AS $$
  SELECT 'APP-' || to_char(CURRENT_DATE, 'YYYY') || '-' || lpad(nextval('public.app_number_seq')::text, 6, '0');
$$;

-- 1. ORGANIZATION SETTINGS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.organization_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.organization_settings (key, value, description)
VALUES ('organization_phase', '"formation"'::jsonb, 'Current organizational phase of Nagrik Party (formation | registered_party)')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 2. ENHANCED PROFILES & ROLES
-- ============================================================================
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

UPDATE public.profiles SET role = 'PUBLIC' WHERE role IS NULL OR role NOT IN ('PUBLIC', 'MEMBER', 'VERIFIER', 'ADMIN', 'SUPER_ADMIN');

CREATE OR REPLACE FUNCTION public.get_user_role(uid UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  u_role TEXT;
BEGIN
  SELECT role INTO u_role FROM public.profiles WHERE id = uid;
  RETURN COALESCE(u_role, 'PUBLIC');
END;
$$;

-- 3. MEMBERSHIP APPLICATIONS (Alter existing table to Phase 1 spec)
-- ============================================================================
ALTER TABLE public.membership_applications 
  ALTER COLUMN id TYPE UUID USING (CASE WHEN id ~ '^[0-9a-fA-F-]{36}$' THEN id::uuid ELSE gen_random_uuid() END);
ALTER TABLE public.membership_applications 
  ALTER COLUMN id SET DEFAULT gen_random_uuid();

ALTER TABLE public.membership_applications ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.membership_applications ADD COLUMN IF NOT EXISTS application_number TEXT;
UPDATE public.membership_applications SET application_number = public.generate_application_number() WHERE application_number IS NULL;
ALTER TABLE public.membership_applications ALTER COLUMN application_number SET NOT NULL;
ALTER TABLE public.membership_applications ADD COLUMN IF NOT EXISTS membership_category TEXT DEFAULT 'Primary Member';
ALTER TABLE public.membership_applications ADD COLUMN IF NOT EXISTS form_version TEXT DEFAULT '1.0';
ALTER TABLE public.membership_applications ADD COLUMN IF NOT EXISTS declaration_version TEXT DEFAULT '1.0';
ALTER TABLE public.membership_applications ADD COLUMN IF NOT EXISTS consent_version TEXT DEFAULT '1.0';
ALTER TABLE public.membership_applications ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ;
ALTER TABLE public.membership_applications ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.membership_applications ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;
ALTER TABLE public.membership_applications ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE public.membership_applications ADD COLUMN IF NOT EXISTS correction_notes TEXT;
ALTER TABLE public.membership_applications ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 4. MEMBERS (Authoritative Approved Records)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    application_id UUID UNIQUE REFERENCES public.membership_applications(id) ON DELETE SET NULL,
    membership_id TEXT UNIQUE NOT NULL DEFAULT public.generate_membership_id(),
    full_name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Primary Member',
    status TEXT NOT NULL DEFAULT 'APPROVED' CHECK (status IN ('APPROVED', 'SUSPENDED', 'RESIGNED', 'ARCHIVED')),
    approved_at TIMESTAMPTZ DEFAULT NOW(),
    approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MEMBER ADDRESSES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.member_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    application_id UUID REFERENCES public.membership_applications(id) ON DELETE CASCADE,
    full_legal_name TEXT NOT NULL,
    parent_or_guardian_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    gender TEXT NOT NULL,
    occupation TEXT,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    state TEXT NOT NULL DEFAULT 'Delhi',
    district TEXT NOT NULL,
    lok_sabha TEXT,
    vidhan_sabha TEXT NOT NULL,
    ward TEXT,
    pincode TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ELECTORAL DETAILS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.electoral_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    application_id UUID REFERENCES public.membership_applications(id) ON DELETE CASCADE,
    identity_proof_type TEXT NOT NULL DEFAULT 'Voter ID (EPIC)',
    epic_number TEXT,
    vidhan_sabha TEXT,
    part_number TEXT,
    serial_number TEXT,
    polling_station TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. MEMBER PARTICIPATION
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.member_participation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    application_id UUID REFERENCES public.membership_applications(id) ON DELETE CASCADE,
    interest_areas TEXT[] NOT NULL DEFAULT '{}',
    skills TEXT,
    availability TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CONSTITUTIONAL DECLARATIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.membership_declarations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    application_id UUID REFERENCES public.membership_applications(id) ON DELETE CASCADE,
    declaration_text TEXT NOT NULL,
    declaration_version TEXT NOT NULL DEFAULT '1.0',
    bears_true_faith BOOLEAN NOT NULL DEFAULT true,
    upholds_sovereignty BOOLEAN NOT NULL DEFAULT true,
    accepts_constitution BOOLEAN NOT NULL DEFAULT true,
    no_other_party_membership BOOLEAN NOT NULL DEFAULT true,
    no_prohibited_conduct BOOLEAN NOT NULL DEFAULT true,
    agreed_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address TEXT,
    user_agent TEXT
);

-- 9. DATA CONSENT
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.membership_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    application_id UUID REFERENCES public.membership_applications(id) ON DELETE CASCADE,
    consent_text TEXT NOT NULL,
    consent_version TEXT NOT NULL DEFAULT '1.0',
    agreed_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address TEXT,
    user_agent TEXT
);

-- 10. DIGITAL DOCUMENTS & VAULT
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    application_id UUID REFERENCES public.membership_applications(id) ON DELETE CASCADE,
    member_id UUID REFERENCES public.members(id) ON DELETE SET NULL,
    document_type TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    storage_path TEXT NOT NULL,
    sha256_hash TEXT NOT NULL,
    current_version INTEGER NOT NULL DEFAULT 1,
    ocr_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (ocr_status IN (
      'PENDING', 'EXTRACTED', 'CONFIRMED_BY_MEMBER', 'FAILED', 'NOT_APPLICABLE'
    )),
    verification_status TEXT NOT NULL DEFAULT 'UPLOADED' CHECK (verification_status IN (
      'UPLOADED', 'OCR_COMPLETE', 'MEMBER_CONFIRMED', 'UNDER_REVIEW',
      'VERIFIED', 'REJECTED', 'NEEDS_CORRECTION'
    )),
    verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. DOCUMENT VERSIONS (Immutable historical trace)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.document_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    storage_path TEXT NOT NULL,
    sha256_hash TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reason_for_replacement TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. DOCUMENT EXTRACTIONS (OCR / Vision Data Pipeline)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.document_extractions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
    field_name TEXT NOT NULL,
    extracted_value TEXT,
    confidence NUMERIC(5,2),
    source TEXT DEFAULT 'gemini-vision',
    confirmed_value TEXT,
    confirmed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    confirmed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. DOCUMENT VERIFICATIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.document_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
    verifier_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL CHECK (action IN ('APPROVE', 'REJECT', 'REQUEST_CORRECTION')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. SIGNATURES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.signatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    application_id UUID REFERENCES public.membership_applications(id) ON DELETE CASCADE,
    signature_type TEXT NOT NULL DEFAULT 'TYPED_CONFIRMATION' CHECK (signature_type IN (
      'TYPED_CONFIRMATION', 'DIGITAL_DRAWING', 'UPLOADED_DOCUMENT'
    )),
    typed_name TEXT,
    document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
    signed_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address TEXT,
    user_agent TEXT
);

-- 15. MEMBERSHIP STATUS HISTORY
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.membership_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES public.membership_applications(id) ON DELETE CASCADE,
    member_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
    previous_status TEXT,
    new_status TEXT NOT NULL,
    changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. MEMBERSHIP CARDS (CR80 Standard & QR Verification)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.membership_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    card_number TEXT UNIQUE NOT NULL,
    card_version INTEGER NOT NULL DEFAULT 1,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'REVOKED', 'SUPERSEDED')),
    qr_token TEXT UNIQUE NOT NULL,
    verification_slug TEXT UNIQUE NOT NULL,
    front_document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
    back_document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
    print_document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    revoked_at TIMESTAMPTZ,
    revocation_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. AUDIT LOGS (Immutable)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    actor_role TEXT NOT NULL DEFAULT 'PUBLIC',
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. ORGANISATIONAL UNITS (Dormant Phase 2 support)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.organisational_units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    unit_type TEXT NOT NULL,
    parent_unit_id UUID REFERENCES public.organisational_units(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. SUBMISSION TEMPLATES & REQUIREMENTS (Export Engine)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.submission_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    version TEXT NOT NULL DEFAULT '1.0',
    is_active BOOLEAN DEFAULT true,
    config JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.submission_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES public.submission_templates(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    title TEXT NOT NULL,
    field_mappings JSONB DEFAULT '{}'::jsonb,
    required_document_types TEXT[] DEFAULT '{}',
    annexure_label TEXT,
    sort_order INTEGER DEFAULT 0,
    is_mandatory BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.submission_exports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES public.submission_templates(id) ON DELETE RESTRICT,
    export_number TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'COMPLETED' CHECK (status IN ('GENERATING', 'COMPLETED', 'FAILED')),
    total_pages INTEGER DEFAULT 0,
    file_storage_path TEXT,
    file_sha256 TEXT,
    generated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS public.submission_export_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    export_id UUID NOT NULL REFERENCES public.submission_exports(id) ON DELETE CASCADE,
    member_id UUID REFERENCES public.members(id) ON DELETE SET NULL,
    annexure_label TEXT,
    start_page INTEGER NOT NULL,
    end_page INTEGER NOT NULL,
    document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
    traceability_code TEXT NOT NULL
);

-- 20. PUBLIC DOCUMENTS LIBRARY
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.public_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL CHECK (category IN ('FORMATION', 'GOVERNANCE', 'FINANCE', 'POLICY')),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    title_hi TEXT,
    description TEXT,
    description_hi TEXT,
    file_path TEXT,
    content_markdown TEXT,
    content_markdown_hi TEXT,
    version TEXT DEFAULT '1.0',
    is_published BOOLEAN DEFAULT true,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. FINANCIAL TRANSPARENCY (Formation Phase)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.financial_statements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporting_period TEXT NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    opening_balance NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    total_contributions NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    total_expenses NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    closing_balance NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    statement_document_url TEXT,
    notes TEXT,
    is_published BOOLEAN DEFAULT true,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.financial_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    statement_id UUID REFERENCES public.financial_statements(id) ON DELETE SET NULL,
    transaction_date DATE NOT NULL,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('CONTRIBUTION', 'EXPENSE')),
    category TEXT NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    description TEXT NOT NULL,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- STORAGE BUCKETS
-- ============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('member-documents', 'member-documents', false),
  ('member-photos', 'member-photos', false),
  ('generated-documents', 'generated-documents', false),
  ('membership-cards', 'membership-cards', false),
  ('public-assets', 'public-assets', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE public.organization_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.electoral_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_participation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_declarations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_extractions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_export_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_statements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read org settings" ON public.organization_settings;
CREATE POLICY "Anyone can read org settings" ON public.organization_settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can read own profile or staff can read all" ON public.profiles;
CREATE POLICY "Users can read own profile or staff can read all" ON public.profiles
  FOR SELECT USING (
    auth.uid() = id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('VERIFIER', 'ADMIN', 'SUPER_ADMIN'))
  );

DROP POLICY IF EXISTS "Users can update own profile fields" ON public.profiles;
CREATE POLICY "Users can update own profile fields" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can view own application, staff view all" ON public.membership_applications;
CREATE POLICY "Users can view own application, staff view all" ON public.membership_applications
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('VERIFIER', 'ADMIN', 'SUPER_ADMIN'))
  );

DROP POLICY IF EXISTS "Users can insert own application" ON public.membership_applications;
CREATE POLICY "Users can insert own application" ON public.membership_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update draft or staff update any" ON public.membership_applications;
CREATE POLICY "Users update draft or staff update any" ON public.membership_applications
  FOR UPDATE USING (
    (auth.uid() = user_id AND status IN ('DRAFT', 'NEEDS_CORRECTION')) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('VERIFIER', 'ADMIN', 'SUPER_ADMIN'))
  );

DROP POLICY IF EXISTS "Member view own record or staff view all" ON public.members;
CREATE POLICY "Member view own record or staff view all" ON public.members
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('VERIFIER', 'ADMIN', 'SUPER_ADMIN'))
  );

DROP POLICY IF EXISTS "Owner view address or staff view all" ON public.member_addresses;
CREATE POLICY "Owner view address or staff view all" ON public.member_addresses
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('VERIFIER', 'ADMIN', 'SUPER_ADMIN'))
  );

DROP POLICY IF EXISTS "Owner insert address" ON public.member_addresses;
CREATE POLICY "Owner insert address" ON public.member_addresses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Owner update address" ON public.member_addresses;
CREATE POLICY "Owner update address" ON public.member_addresses
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Owner view electoral or staff view all" ON public.electoral_details;
CREATE POLICY "Owner view electoral or staff view all" ON public.electoral_details
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('VERIFIER', 'ADMIN', 'SUPER_ADMIN'))
  );

DROP POLICY IF EXISTS "Owner insert electoral" ON public.electoral_details;
CREATE POLICY "Owner insert electoral" ON public.electoral_details
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Owner view participation or staff view all" ON public.member_participation;
CREATE POLICY "Owner view participation or staff view all" ON public.member_participation
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('VERIFIER', 'ADMIN', 'SUPER_ADMIN'))
  );

DROP POLICY IF EXISTS "Owner insert participation" ON public.member_participation;
CREATE POLICY "Owner insert participation" ON public.member_participation
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Owner view declarations or staff view all" ON public.membership_declarations;
CREATE POLICY "Owner view declarations or staff view all" ON public.membership_declarations
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('VERIFIER', 'ADMIN', 'SUPER_ADMIN'))
  );

DROP POLICY IF EXISTS "Owner insert declarations" ON public.membership_declarations;
CREATE POLICY "Owner insert declarations" ON public.membership_declarations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Owner view consent or staff view all" ON public.membership_consents;
CREATE POLICY "Owner view consent or staff view all" ON public.membership_consents
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('VERIFIER', 'ADMIN', 'SUPER_ADMIN'))
  );

DROP POLICY IF EXISTS "Owner insert consent" ON public.membership_consents;
CREATE POLICY "Owner insert consent" ON public.membership_consents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Owner view documents or staff view all" ON public.documents;
CREATE POLICY "Owner view documents or staff view all" ON public.documents
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('VERIFIER', 'ADMIN', 'SUPER_ADMIN'))
  );

DROP POLICY IF EXISTS "Owner insert documents" ON public.documents;
CREATE POLICY "Owner insert documents" ON public.documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Staff update documents" ON public.documents;
CREATE POLICY "Staff update documents" ON public.documents
  FOR UPDATE USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('VERIFIER', 'ADMIN', 'SUPER_ADMIN'))
  );

DROP POLICY IF EXISTS "Owner view doc versions or staff view all" ON public.document_versions;
CREATE POLICY "Owner view doc versions or staff view all" ON public.document_versions
  FOR SELECT USING (
    uploaded_by = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('VERIFIER', 'ADMIN', 'SUPER_ADMIN'))
  );

DROP POLICY IF EXISTS "Owner insert doc versions" ON public.document_versions;
CREATE POLICY "Owner insert doc versions" ON public.document_versions
  FOR INSERT WITH CHECK (uploaded_by = auth.uid());

DROP POLICY IF EXISTS "Users view own extraction or staff view all" ON public.document_extractions;
CREATE POLICY "Users view own extraction or staff view all" ON public.document_extractions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.documents d WHERE d.id = document_id AND d.user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('VERIFIER', 'ADMIN', 'SUPER_ADMIN'))
  );

DROP POLICY IF EXISTS "Users update own confirmed extractions" ON public.document_extractions;
CREATE POLICY "Users update own confirmed extractions" ON public.document_extractions
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.documents d WHERE d.id = document_id AND d.user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('VERIFIER', 'ADMIN', 'SUPER_ADMIN'))
  );

DROP POLICY IF EXISTS "Staff view document verifications" ON public.document_verifications;
CREATE POLICY "Staff view document verifications" ON public.document_verifications
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('VERIFIER', 'ADMIN', 'SUPER_ADMIN'))
  );

DROP POLICY IF EXISTS "Staff insert document verifications" ON public.document_verifications;
CREATE POLICY "Staff insert document verifications" ON public.document_verifications
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('VERIFIER', 'ADMIN', 'SUPER_ADMIN'))
  );

DROP POLICY IF EXISTS "Owner view signature or staff view all" ON public.signatures;
CREATE POLICY "Owner view signature or staff view all" ON public.signatures
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('VERIFIER', 'ADMIN', 'SUPER_ADMIN'))
  );

DROP POLICY IF EXISTS "Owner insert signature" ON public.signatures;
CREATE POLICY "Owner insert signature" ON public.signatures
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Owner view own card or staff view all" ON public.membership_cards;
CREATE POLICY "Owner view own card or staff view all" ON public.membership_cards
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.members m WHERE m.id = member_id AND m.user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('VERIFIER', 'ADMIN', 'SUPER_ADMIN'))
  );

CREATE OR REPLACE FUNCTION public.verify_membership_card(p_card_number TEXT)
RETURNS TABLE (
  card_number TEXT,
  member_name TEXT,
  category TEXT,
  card_status TEXT,
  issue_date DATE,
  revoked_at TIMESTAMPTZ,
  revocation_reason TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.card_number,
    m.full_name AS member_name,
    m.category,
    c.status AS card_status,
    c.issue_date,
    c.revoked_at,
    c.revocation_reason
  FROM public.membership_cards c
  JOIN public.members m ON m.id = c.member_id
  WHERE c.card_number = p_card_number OR c.verification_slug = p_card_number;
END;
$$;

DROP POLICY IF EXISTS "Staff view audit logs" ON public.audit_logs;
CREATE POLICY "Staff view audit logs" ON public.audit_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN'))
  );

DROP POLICY IF EXISTS "System insert audit logs" ON public.audit_logs;
CREATE POLICY "System insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Anyone can view published public documents" ON public.public_documents;
CREATE POLICY "Anyone can view published public documents" ON public.public_documents
  FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Anyone can view published financial statements" ON public.financial_statements;
CREATE POLICY "Anyone can view published financial statements" ON public.financial_statements
  FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Anyone can view public transactions" ON public.financial_transactions;
CREATE POLICY "Anyone can view public transactions" ON public.financial_transactions
  FOR SELECT USING (is_public = true);

DROP POLICY IF EXISTS "Staff view submission exports" ON public.submission_exports;
CREATE POLICY "Staff view submission exports" ON public.submission_exports
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN'))
  );

DROP POLICY IF EXISTS "Staff view submission templates" ON public.submission_templates;
CREATE POLICY "Staff view submission templates" ON public.submission_templates
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN'))
  );

DROP POLICY IF EXISTS "Users can upload own member documents" ON storage.objects;
CREATE POLICY "Users can upload own member documents" ON storage.objects
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND
    bucket_id IN ('member-documents', 'member-photos', 'generated-documents', 'membership-cards') AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users can read own member documents" ON storage.objects;
CREATE POLICY "Users can read own member documents" ON storage.objects
  FOR SELECT USING (
    auth.role() = 'authenticated' AND
    bucket_id IN ('member-documents', 'member-photos', 'generated-documents', 'membership-cards') AND
    (
      (storage.foldername(name))[1] = auth.uid()::text OR
      EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('VERIFIER', 'ADMIN', 'SUPER_ADMIN'))
    )
  );

CREATE INDEX IF NOT EXISTS idx_mem_apps_user_id ON public.membership_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_mem_apps_status ON public.membership_applications(status);
CREATE INDEX IF NOT EXISTS idx_mem_apps_app_num ON public.membership_applications(application_number);

CREATE INDEX IF NOT EXISTS idx_members_user_id ON public.members(user_id);
CREATE INDEX IF NOT EXISTS idx_members_membership_id ON public.members(membership_id);
CREATE INDEX IF NOT EXISTS idx_members_status ON public.members(status);

CREATE INDEX IF NOT EXISTS idx_docs_user_id ON public.documents(user_id);
CREATE INDEX IF NOT EXISTS idx_docs_app_id ON public.documents(application_id);
CREATE INDEX IF NOT EXISTS idx_docs_verification_status ON public.documents(verification_status);

CREATE INDEX IF NOT EXISTS idx_cards_member_id ON public.membership_cards(member_id);
CREATE INDEX IF NOT EXISTS idx_cards_card_number ON public.membership_cards(card_number);
CREATE INDEX IF NOT EXISTS idx_cards_status ON public.membership_cards(status);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at DESC);
