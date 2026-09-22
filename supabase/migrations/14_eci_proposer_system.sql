-- ============================================================================
-- Migration 14: ECI Proposer Records & Section 29A Filing System
-- Nagrik Party Platform - Formation Phase to Registration
-- ============================================================================

-- 1. PROPOSER RECORDS (Linked to Approved Members)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.proposer_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    application_id UUID NOT NULL REFERENCES public.membership_applications(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    proposer_serial_number TEXT UNIQUE NOT NULL,
    epic_number TEXT NOT NULL,
    full_name TEXT NOT NULL,
    vidhan_sabha TEXT NOT NULL,
    part_number TEXT,
    serial_number TEXT,
    polling_station TEXT,
    ward TEXT,
    district TEXT,
    address TEXT,
    contact_number TEXT,
    affidavit_document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
    affidavit_sha256 TEXT,
    affidavit_uploaded_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN (
        'DRAFT', 'NOTARIZED', 'SUBMITTED', 'VERIFIED', 'REJECTED'
    )),
    verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    rejection_reason TEXT,
    eci_filing_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ECI FILING DOSSIERS (Section 29A RPA 1951)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.eci_filing_dossiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filing_number TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN (
        'DRAFT', 'COMPILED', 'SUBMITTED', 'UNDER_SCRUTINY', 'APPROVED', 'REJECTED'
    )),
    total_proposers INTEGER DEFAULT 0,
    verified_proposers INTEGER DEFAULT 0,
    total_pages INTEGER DEFAULT 0,
    dossier_sha256 TEXT,
    form_version TEXT DEFAULT '1.0',
    submitted_at TIMESTAMPTZ,
    approved_at TIMESTAMPTZ,
    gazette_notified_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. GAZETTE NOTIFICATIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.gazette_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    eci_filing_id UUID NOT NULL REFERENCES public.eci_filing_dossiers(id) ON DELETE CASCADE,
    notification_number TEXT,
    publication_date DATE,
    english_newspaper TEXT,
    hindi_newspaper TEXT,
    pdf_path TEXT,
    sha256 TEXT,
    status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'VERIFIED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PARTY SYMBOLS (Election Commission)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.party_symbols (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    eci_filing_id UUID NOT NULL REFERENCES public.eci_filing_dossiers(id) ON DELETE CASCADE,
    preference_order INTEGER NOT NULL,
    symbol_name TEXT NOT NULL,
    symbol_description TEXT,
    status TEXT NOT NULL DEFAULT 'REQUESTED' CHECK (status IN ('REQUESTED', 'ALLOTTED', 'REJECTED')),
    allotted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ECI COMPLIANCE CHECKLIST (Auto-tracked from member data)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.eci_compliance_checklist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    eci_filing_id UUID NOT NULL REFERENCES public.eci_filing_dossiers(id) ON DELETE CASCADE,
    item_code TEXT NOT NULL,
    item_title TEXT NOT NULL,
    item_description TEXT,
    is_mandatory BOOLEAN DEFAULT true,
    is_satisfied BOOLEAN DEFAULT false,
    satisfied_at TIMESTAMPTZ,
    evidence_document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
    evidence_notes TEXT,
    checked_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    checked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. UPDATE FORMATION PHASES FOR ECI TRACKING
-- ============================================================================
ALTER TABLE public.formation_phases ADD COLUMN IF NOT EXISTS eci_filing_id UUID REFERENCES public.eci_filing_dossiers(id) ON DELETE SET NULL;
ALTER TABLE public.formation_phases ADD COLUMN IF NOT EXISTS registration_number TEXT;
ALTER TABLE public.formation_phases ADD COLUMN IF NOT EXISTS registration_date DATE;

-- 7. AUTO-GENERATE PROPOSER SERIAL NUMBERS
-- ============================================================================
CREATE SEQUENCE IF NOT EXISTS public.proposer_seq START WITH 1;

CREATE OR REPLACE FUNCTION public.generate_proposer_number()
RETURNS TEXT
LANGUAGE sql
AS $$
  SELECT 'PROP-' || to_char(CURRENT_DATE, 'YYYY') || '-' || lpad(nextval('public.proposer_seq')::text, 6, '0');
$$;

CREATE OR REPLACE FUNCTION public.generate_filing_number()
RETURNS TEXT
LANGUAGE sql
AS $$
  SELECT 'FIL-' || to_char(CURRENT_DATE, 'YYYY') || '-' || lpad(nextval('public.proposer_seq')::text, 6, '0');
$$;


-- 8. AUTO-POPULATE PROPOSER RECORD FROM APPROVED MEMBER
-- ============================================================================
CREATE OR REPLACE FUNCTION public.create_proposer_from_member(
    p_member_id UUID,
    p_verifier_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_member RECORD;
    v_app RECORD;
    v_addr RECORD;
    v_elec RECORD;
    v_proposer_id UUID;
    v_proposer_number TEXT;
BEGIN
    SELECT * INTO v_member FROM public.members WHERE id = p_member_id;
    IF NOT FOUND THEN RAISE EXCEPTION 'Member not found: %', p_member_id; END IF;
    SELECT * INTO v_app FROM public.membership_applications WHERE id = v_member.application_id;
    IF NOT FOUND THEN RAISE EXCEPTION 'Application not found for member: %', p_member_id; END IF;
    SELECT * INTO v_addr FROM public.member_addresses WHERE application_id = v_member.application_id;
    IF NOT FOUND THEN RAISE EXCEPTION 'Address not found for member: %', p_member_id; END IF;
    SELECT * INTO v_elec FROM public.electoral_details WHERE application_id = v_member.application_id;
    IF NOT FOUND THEN RAISE EXCEPTION 'Electoral details not found for member: %', p_member_id; END IF;
    SELECT id INTO v_proposer_id FROM public.proposer_records WHERE member_id = p_member_id;
    IF FOUND THEN RETURN v_proposer_id; END IF;
    v_proposer_number := public.generate_proposer_number();
    INSERT INTO public.proposer_records (
        member_id, application_id, user_id, proposer_serial_number, epic_number, full_name,
        vidhan_sabha, part_number, serial_number, polling_station, ward, district,
        address, contact_number, status, verified_by, verified_at
    ) VALUES (
        p_member_id, v_member.application_id, v_member.user_id, v_proposer_number,
        COALESCE(v_elec.epic_number, 'N/A'), COALESCE(v_addr.full_legal_name, v_member.full_name),
        COALESCE(v_addr.vidhan_sabha, 'Delhi'), v_elec.part_number, v_elec.serial_number,
        v_elec.polling_station, v_addr.ward, v_addr.district,
        v_addr.address_line1 || COALESCE(', ' || v_addr.address_line2, ''), v_addr.phone,
        'DRAFT', p_verifier_id, CASE WHEN p_verifier_id IS NOT NULL THEN NOW() ELSE NULL END
    ) RETURNING id INTO v_proposer_id;
    RETURN v_proposer_id;
END;
$$;


-- 9. AUTO-CHECK ECI READINESS
-- ============================================================================
CREATE OR REPLACE FUNCTION public.check_eci_readiness(p_filing_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_result JSONB := '{}'::jsonb;
    v_total_proposers INTEGER;
    v_verified_proposers INTEGER;
    v_declaration_count INTEGER;
    v_consent_count INTEGER;
    v_signature_count INTEGER;
    v_document_count INTEGER;
    v_epic_count INTEGER;
BEGIN
    SELECT total_proposers, verified_proposers INTO v_total_proposers, v_verified_proposers
    FROM public.eci_filing_dossiers WHERE id = p_filing_id;

    SELECT COUNT(*) INTO v_declaration_count
    FROM public.proposer_records pr
    JOIN public.membership_applications ma ON pr.application_id = ma.id
    JOIN public.membership_declarations md ON ma.id = md.application_id
    WHERE pr.eci_filing_id = p_filing_id AND md.accepts_constitution = true;

    SELECT COUNT(*) INTO v_consent_count
    FROM public.proposer_records pr
    JOIN public.membership_applications ma ON pr.application_id = ma.id
    JOIN public.membership_consents mc ON ma.id = mc.application_id
    WHERE pr.eci_filing_id = p_filing_id AND mc.agreed_at IS NOT NULL;

    SELECT COUNT(*) INTO v_signature_count
    FROM public.proposer_records pr
    JOIN public.membership_applications ma ON pr.application_id = ma.id
    JOIN public.signatures s ON ma.id = s.application_id
    WHERE pr.eci_filing_id = p_filing_id AND s.typed_name IS NOT NULL AND length(trim(s.typed_name)) > 0;

    SELECT COUNT(*) INTO v_document_count
    FROM public.proposer_records pr
    JOIN public.membership_applications ma ON pr.application_id = ma.id
    JOIN public.documents d ON ma.id = d.application_id
    WHERE pr.eci_filing_id = p_filing_id AND d.verification_status IN ('MEMBER_CONFIRMED', 'VERIFIED');

    SELECT COUNT(*) INTO v_epic_count
    FROM public.proposer_records pr
    WHERE pr.eci_filing_id = p_filing_id AND pr.epic_number IS NOT NULL AND pr.epic_number != 'N/A';

    v_result := jsonb_build_object(
        'total_proposers', COALESCE(v_total_proposers, 0),
        'verified_proposers', COALESCE(v_verified_proposers, 0),
        'declarations_complete', COALESCE(v_declaration_count, 0),
        'consents_complete', COALESCE(v_consent_count, 0),
        'signatures_complete', COALESCE(v_signature_count, 0),
        'documents_complete', COALESCE(v_document_count, 0),
        'epic_complete', COALESCE(v_epic_count, 0),
        'eci_ready', (
            COALESCE(v_verified_proposers, 0) >= 100 AND
            COALESCE(v_declaration_count, 0) = COALESCE(v_total_proposers, 0) AND
            COALESCE(v_consent_count, 0) = COALESCE(v_total_proposers, 0) AND
            COALESCE(v_signature_count, 0) = COALESCE(v_total_proposers, 0) AND
            COALESCE(v_document_count, 0) = COALESCE(v_total_proposers, 0) AND
            COALESCE(v_epic_count, 0) = COALESCE(v_total_proposers, 0)
        )
    );
    RETURN v_result;
END;
$$;


-- 10. RLS POLICIES
-- ============================================================================
ALTER TABLE public.proposer_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eci_filing_dossiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gazette_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.party_symbols ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eci_compliance_checklist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage proposer records" ON public.proposer_records FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) IN ('VERIFIER', 'ADMIN', 'SUPER_ADMIN')) WITH CHECK (public.get_user_role(auth.uid()) IN ('VERIFIER', 'ADMIN', 'SUPER_ADMIN'));
CREATE POLICY "Admin manage party symbols" ON public.party_symbols FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) IN ('ADMIN', 'SUPER_ADMIN')) WITH CHECK (public.get_user_role(auth.uid()) IN ('ADMIN', 'SUPER_ADMIN'));
CREATE POLICY "Admin manage eci filing dossiers" ON public.eci_filing_dossiers FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) IN ('ADMIN', 'SUPER_ADMIN')) WITH CHECK (public.get_user_role(auth.uid()) IN ('ADMIN', 'SUPER_ADMIN'));
CREATE POLICY "Admin manage eci compliance" ON public.eci_compliance_checklist FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) IN ('ADMIN', 'SUPER_ADMIN')) WITH CHECK (public.get_user_role(auth.uid()) IN ('ADMIN', 'SUPER_ADMIN'));
CREATE POLICY "Admin manage gazette notifications" ON public.gazette_notifications FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) IN ('ADMIN', 'SUPER_ADMIN')) WITH CHECK (public.get_user_role(auth.uid()) IN ('ADMIN', 'SUPER_ADMIN'));
`n-- 11. INDEXES`n-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_proposer_records_user_id ON public.proposer_records(user_id);
CREATE POLICY "Member view own proposer record" ON public.proposer_records FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_proposer_records_application_id ON public.proposer_records(application_id);
CREATE INDEX IF NOT EXISTS idx_proposer_records_status ON public.proposer_records(status);
CREATE INDEX IF NOT EXISTS idx_proposer_records_epic ON public.proposer_records(epic_number);
CREATE INDEX IF NOT EXISTS idx_proposer_records_eci_filing_id ON public.proposer_records(eci_filing_id);
CREATE INDEX IF NOT EXISTS idx_gazette_notifications_status ON public.gazette_notifications(status);
CREATE INDEX IF NOT EXISTS idx_gazette_notifications_eci_filing_id ON public.gazette_notifications(eci_filing_id);
CREATE INDEX IF NOT EXISTS idx_eci_compliance_checklist_eci_filing_id ON public.eci_compliance_checklist(eci_filing_id);
CREATE INDEX IF NOT EXISTS idx_eci_filing_dossiers_created_by ON public.eci_filing_dossiers(created_by);
CREATE INDEX IF NOT EXISTS idx_party_symbols_eci_filing_id ON public.party_symbols(eci_filing_id);
CREATE INDEX IF NOT EXISTS idx_eci_filing_dossiers_status ON public.eci_filing_dossiers(status);
CREATE INDEX IF NOT EXISTS idx_proposer_records_member_id ON public.proposer_records(member_id);
CREATE INDEX IF NOT EXISTS idx_party_symbols_status ON public.party_symbols(status);
CREATE INDEX IF NOT EXISTS idx_eci_compliance_checklist_item_code ON public.eci_compliance_checklist(item_code);
COMMENT ON FUNCTION public.check_eci_readiness(UUID) IS 'Checks if all ECI Section 29A requirements are satisfied for a given filing dossier.';
COMMENT ON FUNCTION public.generate_proposer_number() IS 'Auto-generates formatted proposer serial number: PROP-YYYY-NNNNNN';
COMMENT ON TABLE public.eci_filing_dossiers IS 'Section 29A RPA 1951 filing dossiers. Tracks compilation, submission, and ECI scrutiny of the party registration application.';
COMMENT ON TABLE public.gazette_notifications IS 'Gazette of India notifications for party registration under Section 29A RPA 1951.';
COMMENT ON TABLE public.party_symbols IS 'Election symbol preferences submitted to ECI and allotment status.';
COMMENT ON TABLE public.eci_compliance_checklist IS 'Auto-tracked checklist of all ECI Section 29A requirements with evidence links.';
COMMENT ON FUNCTION public.create_proposer_from_member(UUID, UUID) IS 'Auto-creates a proposer record from an approved member. Called after membership approval.';
COMMENT ON TABLE public.proposer_records IS 'ECI Section 29A proposer records linked to approved founding members. Each approved member automatically becomes a proposer for party registration.';
COMMENT ON FUNCTION public.generate_filing_number() IS 'Auto-generates formatted filing number: FIL-YYYY-NNNNNN';
`n-- 12. COMMENTS`n-- ============================================================================
