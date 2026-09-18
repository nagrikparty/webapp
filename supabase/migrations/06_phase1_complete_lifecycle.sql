-- Migration 06: Phase 1 Complete Lifecycle, RLS Hardening & Card Versioning
-- Target: Supabase Project xlxanliztdzonbdrrriw

-- 1. CLEAN UP PERMISSIVE APPLICATION POLICIES
DROP POLICY IF EXISTS "Anyone can insert applications" ON public.membership_applications;
DROP POLICY IF EXISTS "Admins can read applications" ON public.membership_applications;
DROP POLICY IF EXISTS "Admins can update applications" ON public.membership_applications;

-- 2. ENSURE OWNER UPDATE POLICIES ON INDUCTION CHILD TABLES
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'electoral_details' AND policyname = 'Owner update electoral'
    ) THEN
        CREATE POLICY "Owner update electoral" ON public.electoral_details 
        FOR UPDATE TO authenticated 
        USING (auth.uid() = user_id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'member_participation' AND policyname = 'Owner update participation'
    ) THEN
        CREATE POLICY "Owner update participation" ON public.member_participation 
        FOR UPDATE TO authenticated 
        USING (auth.uid() = user_id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'membership_declarations' AND policyname = 'Owner update declarations'
    ) THEN
        CREATE POLICY "Owner update declarations" ON public.membership_declarations 
        FOR UPDATE TO authenticated 
        USING (auth.uid() = user_id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'membership_consents' AND policyname = 'Owner update consent'
    ) THEN
        CREATE POLICY "Owner update consent" ON public.membership_consents 
        FOR UPDATE TO authenticated 
        USING (auth.uid() = user_id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'signatures' AND policyname = 'Owner update signature'
    ) THEN
        CREATE POLICY "Owner update signature" ON public.signatures 
        FOR UPDATE TO authenticated 
        USING (auth.uid() = user_id);
    END IF;
END $$;

-- 3. CARD VERSIONING CONSTRAINT
ALTER TABLE public.membership_cards DROP CONSTRAINT IF EXISTS membership_cards_card_number_key;
ALTER TABLE public.membership_cards DROP CONSTRAINT IF EXISTS membership_cards_member_version_key;
ALTER TABLE public.membership_cards ADD CONSTRAINT membership_cards_member_version_key UNIQUE (member_id, card_version);

-- 4. ENHANCED VERIFICATION RPC WITH STATUS RESOLUTION & ANTI-PII
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
DECLARE
    v_clean_id TEXT;
BEGIN
    v_clean_id := UPPER(TRIM(p_card_number));

    RETURN QUERY
    SELECT 
        m.membership_id AS card_number,
        m.full_name AS member_name,
        m.category,
        c.status AS card_status,
        c.issue_date,
        c.revoked_at,
        c.revocation_reason
    FROM public.membership_cards c
    JOIN public.members m ON m.id = c.member_id
    WHERE (
        UPPER(TRIM(c.card_number)) = v_clean_id
        OR UPPER(TRIM(c.verification_slug)) = v_clean_id
        OR UPPER(TRIM(m.membership_id)) = v_clean_id
        OR c.qr_token::text = LOWER(TRIM(p_card_number))
    )
    AND m.status = 'APPROVED'
    ORDER BY 
        CASE 
            WHEN c.status = 'ACTIVE' THEN 1 
            WHEN c.status = 'SUPERSEDED' THEN 2 
            ELSE 3 
        END,
        c.card_version DESC
    LIMIT 1;
END;
$$;
