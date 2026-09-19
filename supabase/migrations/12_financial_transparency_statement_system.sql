-- ============================================================================
-- NAGRIK PARTY: FINANCIAL TRANSPARENCY & 6-MONTH STATEMENT SYSTEM
-- Migration: 12_financial_transparency_statement_system.sql
-- ============================================================================

-- 1. REPORTING PERIODS TABLE (6-Month H1 / H2 recurring cycles)
CREATE TABLE IF NOT EXISTS public.reporting_periods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,                                -- e.g. "2025 H1", "2025 H2", "2026 H1", "2026 H2"
    fiscal_year TEXT NOT NULL,                          -- e.g. "2024-2025", "2025-2026"
    period_type TEXT NOT NULL DEFAULT 'H1' CHECK (period_type IN ('H1', 'H2', 'CUSTOM')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN (
        'DRAFT', 'UPLOADED', 'EXTRACTED', 'NEEDS_REVIEW', 
        'RECONCILIATION_FAILED', 'VERIFIED', 'PUBLISHED', 'ARCHIVED'
    )),
    opening_balance NUMERIC(18,2) NOT NULL DEFAULT 0.00,
    closing_balance NUMERIC(18,2) NOT NULL DEFAULT 0.00,
    total_credits NUMERIC(18,2) NOT NULL DEFAULT 0.00,
    total_debits NUMERIC(18,2) NOT NULL DEFAULT 0.00,
    calculated_closing_balance NUMERIC(18,2) NOT NULL DEFAULT 0.00,
    reconciliation_difference NUMERIC(18,2) NOT NULL DEFAULT 0.00,
    reconciliation_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (reconciliation_status IN ('PENDING', 'MATCHED', 'FAILED')),
    continuity_status TEXT NOT NULL DEFAULT 'NOT_APPLICABLE' CHECK (continuity_status IN ('CONTINUOUS', 'MISMATCH', 'NOT_APPLICABLE')),
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    published_at TIMESTAMPTZ,
    published_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_period_dates UNIQUE (start_date, end_date),
    CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- 2. BANK STATEMENTS TABLE (Provenance & Upload tracking)
CREATE TABLE IF NOT EXISTS public.bank_statements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporting_period_id UUID REFERENCES public.reporting_periods(id) ON DELETE CASCADE,
    original_filename TEXT NOT NULL,
    storage_path TEXT,
    file_type TEXT NOT NULL CHECK (file_type IN ('csv', 'pdf')),
    file_size_bytes BIGINT NOT NULL,
    file_sha256 TEXT NOT NULL,                          -- Calculated strictly from uploaded bytes
    account_number_masked TEXT,                         -- e.g. "XXXXXXXXX37387"
    bank_name TEXT DEFAULT 'Axis Bank',
    parser_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (parser_status IN ('PENDING', 'PARSED', 'ERROR')),
    extracted_row_count INTEGER NOT NULL DEFAULT 0,
    parser_error TEXT,
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. EXTEND FINANCIAL TRANSACTIONS TABLE
-- Add columns if they don't already exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='financial_transactions' AND column_name='reporting_period_id') THEN
        ALTER TABLE public.financial_transactions ADD COLUMN reporting_period_id UUID REFERENCES public.reporting_periods(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='financial_transactions' AND column_name='bank_statement_id') THEN
        ALTER TABLE public.financial_transactions ADD COLUMN bank_statement_id UUID REFERENCES public.bank_statements(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='financial_transactions' AND column_name='value_date') THEN
        ALTER TABLE public.financial_transactions ADD COLUMN value_date DATE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='financial_transactions' AND column_name='reference_utr') THEN
        ALTER TABLE public.financial_transactions ADD COLUMN reference_utr TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='financial_transactions' AND column_name='debit') THEN
        ALTER TABLE public.financial_transactions ADD COLUMN debit NUMERIC(18,2) NOT NULL DEFAULT 0.00;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='financial_transactions' AND column_name='credit') THEN
        ALTER TABLE public.financial_transactions ADD COLUMN credit NUMERIC(18,2) NOT NULL DEFAULT 0.00;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='financial_transactions' AND column_name='balance_after_transaction') THEN
        ALTER TABLE public.financial_transactions ADD COLUMN balance_after_transaction NUMERIC(18,2);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='financial_transactions' AND column_name='source_row') THEN
        ALTER TABLE public.financial_transactions ADD COLUMN source_row JSONB;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='financial_transactions' AND column_name='fingerprint') THEN
        ALTER TABLE public.financial_transactions ADD COLUMN fingerprint TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='financial_transactions' AND column_name='duplicate_group') THEN
        ALTER TABLE public.financial_transactions ADD COLUMN duplicate_group TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='financial_transactions' AND column_name='is_duplicate_flag') THEN
        ALTER TABLE public.financial_transactions ADD COLUMN is_duplicate_flag BOOLEAN NOT NULL DEFAULT false;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='financial_transactions' AND column_name='duplicate_warning') THEN
        ALTER TABLE public.financial_transactions ADD COLUMN duplicate_warning TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='financial_transactions' AND column_name='classification') THEN
        ALTER TABLE public.financial_transactions ADD COLUMN classification TEXT NOT NULL DEFAULT 'UNKNOWN';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='financial_transactions' AND column_name='verification_status') THEN
        ALTER TABLE public.financial_transactions ADD COLUMN verification_status TEXT NOT NULL DEFAULT 'EXTRACTED';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='financial_transactions' AND column_name='verified_by') THEN
        ALTER TABLE public.financial_transactions ADD COLUMN verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='financial_transactions' AND column_name='verified_at') THEN
        ALTER TABLE public.financial_transactions ADD COLUMN verified_at TIMESTAMPTZ;
    END IF;
END $$;

-- 4. FINANCIAL CORRECTIONS TABLE (Immutable post-publication adjustments)
CREATE TABLE IF NOT EXISTS public.financial_corrections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporting_period_id UUID NOT NULL REFERENCES public.reporting_periods(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES public.financial_transactions(id) ON DELETE SET NULL,
    correction_type TEXT NOT NULL CHECK (correction_type IN ('ADJUSTMENT', 'REVERSAL', 'CLASSIFICATION_CHANGE', 'NOTE')),
    reason TEXT NOT NULL,
    amount NUMERIC(18,2),
    original_values JSONB,
    new_values JSONB,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. INDEXES FOR HIGH PERFORMANCE QUERYING
CREATE INDEX IF NOT EXISTS idx_reporting_periods_dates ON public.reporting_periods(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_reporting_periods_status ON public.reporting_periods(status);
CREATE INDEX IF NOT EXISTS idx_bank_statements_period ON public.bank_statements(reporting_period_id);
CREATE INDEX IF NOT EXISTS idx_bank_statements_sha256 ON public.bank_statements(file_sha256);
CREATE INDEX IF NOT EXISTS idx_fin_tx_period ON public.financial_transactions(reporting_period_id);
CREATE INDEX IF NOT EXISTS idx_fin_tx_statement ON public.financial_transactions(bank_statement_id);
CREATE INDEX IF NOT EXISTS idx_fin_tx_date ON public.financial_transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_fin_tx_utr ON public.financial_transactions(reference_utr);
CREATE INDEX IF NOT EXISTS idx_fin_tx_fingerprint ON public.financial_transactions(fingerprint);
CREATE INDEX IF NOT EXISTS idx_fin_tx_classification ON public.financial_transactions(classification);
CREATE INDEX IF NOT EXISTS idx_fin_tx_verification ON public.financial_transactions(verification_status);
CREATE INDEX IF NOT EXISTS idx_fin_tx_public ON public.financial_transactions(public_visibility);

-- 6. ENSURE PRIVATE STORAGE BUCKET FOR BANK STATEMENTS
INSERT INTO storage.buckets (id, name, public)
VALUES ('bank-statements', 'bank-statements', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- 7. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.reporting_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_statements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_corrections ENABLE ROW LEVEL SECURITY;

-- 8. RLS POLICIES FOR REPORTING PERIODS
DROP POLICY IF EXISTS "Public can view published reporting periods" ON public.reporting_periods;
CREATE POLICY "Public can view published reporting periods" ON public.reporting_periods
    FOR SELECT USING (status = 'PUBLISHED');

DROP POLICY IF EXISTS "Staff full access reporting periods" ON public.reporting_periods;
CREATE POLICY "Staff full access reporting periods" ON public.reporting_periods
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
              AND role IN ('ADMIN', 'SUPER_ADMIN')
        )
    );

-- 9. RLS POLICIES FOR BANK STATEMENTS (Private provenance)
DROP POLICY IF EXISTS "Staff full access bank statements" ON public.bank_statements;
CREATE POLICY "Staff full access bank statements" ON public.bank_statements
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
              AND role IN ('ADMIN', 'SUPER_ADMIN')
        )
    );

-- 10. RLS POLICIES FOR FINANCIAL TRANSACTIONS
DROP POLICY IF EXISTS "Public can view verified transactions of published periods" ON public.financial_transactions;
CREATE POLICY "Public can view verified transactions of published periods" ON public.financial_transactions
    FOR SELECT USING (
        public_visibility = true 
        AND verification_status = 'VERIFIED'
        AND (
            reporting_period_id IS NULL OR 
            EXISTS (
                SELECT 1 FROM public.reporting_periods 
                WHERE id = financial_transactions.reporting_period_id 
                  AND status = 'PUBLISHED'
            )
        )
    );

DROP POLICY IF EXISTS "Staff full access financial transactions" ON public.financial_transactions;
CREATE POLICY "Staff full access financial transactions" ON public.financial_transactions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
              AND role IN ('ADMIN', 'SUPER_ADMIN')
        )
    );

-- 11. RLS POLICIES FOR FINANCIAL CORRECTIONS
DROP POLICY IF EXISTS "Staff full access financial corrections" ON public.financial_corrections;
CREATE POLICY "Staff full access financial corrections" ON public.financial_corrections
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
              AND role IN ('ADMIN', 'SUPER_ADMIN')
        )
    );

DROP POLICY IF EXISTS "Public can view published corrections" ON public.financial_corrections;
CREATE POLICY "Public can view published corrections" ON public.financial_corrections
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.reporting_periods 
            WHERE id = financial_corrections.reporting_period_id 
              AND status = 'PUBLISHED'
        )
    );

-- 12. STORAGE RLS: BANK STATEMENTS BUCKET (Staff only)
DROP POLICY IF EXISTS "Staff access bank statement files" ON storage.objects;
CREATE POLICY "Staff access bank statement files" ON storage.objects
    FOR ALL USING (
        bucket_id = 'bank-statements' AND
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
              AND role IN ('ADMIN', 'SUPER_ADMIN')
        )
    );
