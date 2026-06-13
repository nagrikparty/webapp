-- ============================================================================
-- Migration 02: Complete webapp schema
-- Adds all missing tables, columns, RLS policies, RPC, and storage for the
-- Nagrik Party webapp.
--
-- Safe to run multiple times (all statements use IF [NOT] EXISTS).
-- ============================================================================

-- 1. MISSING COLUMNS ON EXISTING TABLES
-- ============================================================================

ALTER TABLE public.membership_applications ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.membership_applications ADD COLUMN IF NOT EXISTS phone TEXT;

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS vidhan_sabha TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS lok_sabha TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;

ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'created';
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'INR';
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT;

ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;


-- 2. NEW TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.issues (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    lok_sabha TEXT,
    vidhan_sabha TEXT,
    ward TEXT,
    status TEXT DEFAULT 'submitted',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.volunteer_applications (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    full_name TEXT,
    email TEXT,
    lok_sabha TEXT,
    vidhan_sabha TEXT,
    ward TEXT,
    skills TEXT,
    availability TEXT,
    referred_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.manifesto_items (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    title_hi TEXT,
    lok_sabha TEXT,
    vidhan_sabha TEXT,
    ward TEXT,
    category TEXT,
    vote_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.manifesto_votes (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    manifesto_item_id TEXT REFERENCES public.manifesto_items(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.proposers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    full_name TEXT NOT NULL,
    epic_number TEXT,
    ward TEXT,
    vidhan_sabha TEXT,
    contact_number TEXT,
    address TEXT,
    added_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.crimes (
    id TEXT PRIMARY KEY,
    crime_type TEXT NOT NULL,
    title TEXT,
    source_url TEXT,
    incident_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- 3. ENABLE RLS ON NEW TABLES
-- ============================================================================

ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manifesto_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manifesto_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crimes ENABLE ROW LEVEL SECURITY;


-- 4. RLS POLICIES — ISSUES
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can read issues" ON public.issues;
CREATE POLICY "Anyone can read issues" ON public.issues
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert issues" ON public.issues;
CREATE POLICY "Authenticated users can insert issues" ON public.issues
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update issues" ON public.issues;
CREATE POLICY "Authenticated users can update issues" ON public.issues
    FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete issues" ON public.issues;
CREATE POLICY "Authenticated users can delete issues" ON public.issues
    FOR DELETE USING (auth.role() = 'authenticated');


-- 5. RLS POLICIES — VOLUNTEER APPLICATIONS
-- ============================================================================

DROP POLICY IF EXISTS "Authenticated users can read volunteer_applications" ON public.volunteer_applications;
CREATE POLICY "Authenticated users can read volunteer_applications" ON public.volunteer_applications
    FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can insert volunteer_applications" ON public.volunteer_applications;
CREATE POLICY "Authenticated users can insert volunteer_applications" ON public.volunteer_applications
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update volunteer_applications" ON public.volunteer_applications;
CREATE POLICY "Authenticated users can update volunteer_applications" ON public.volunteer_applications
    FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete volunteer_applications" ON public.volunteer_applications;
CREATE POLICY "Authenticated users can delete volunteer_applications" ON public.volunteer_applications
    FOR DELETE USING (auth.role() = 'authenticated');


-- 6. RLS POLICIES — MANIFESTO ITEMS & VOTES
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can read manifesto_items" ON public.manifesto_items;
CREATE POLICY "Anyone can read manifesto_items" ON public.manifesto_items
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert manifesto_votes" ON public.manifesto_votes;
CREATE POLICY "Authenticated users can insert manifesto_votes" ON public.manifesto_votes
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');


-- 7. RLS POLICIES — PROPOSERS
-- ============================================================================

DROP POLICY IF EXISTS "Authenticated users can read proposers" ON public.proposers;
CREATE POLICY "Authenticated users can read proposers" ON public.proposers
    FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can insert proposers" ON public.proposers;
CREATE POLICY "Authenticated users can insert proposers" ON public.proposers
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete proposers" ON public.proposers;
CREATE POLICY "Authenticated users can delete proposers" ON public.proposers
    FOR DELETE USING (auth.role() = 'authenticated');


-- 8. RLS POLICIES — CRIMES
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can read crimes" ON public.crimes;
CREATE POLICY "Anyone can read crimes" ON public.crimes
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can upsert crimes" ON public.crimes;
CREATE POLICY "Authenticated users can upsert crimes" ON public.crimes
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update crimes" ON public.crimes;
CREATE POLICY "Authenticated users can update crimes" ON public.crimes
    FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete crimes" ON public.crimes;
CREATE POLICY "Authenticated users can delete crimes" ON public.crimes
    FOR DELETE USING (auth.role() = 'authenticated');


-- 9. ADDITIONAL POLICIES FOR EXISTING TABLES
-- Allow authenticated users to insert/update/delete announcements (admin-gated by API)
-- ============================================================================

DROP POLICY IF EXISTS "Authenticated users can insert announcements" ON public.announcements;
CREATE POLICY "Authenticated users can insert announcements" ON public.announcements
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete announcements" ON public.announcements;
CREATE POLICY "Authenticated users can delete announcements" ON public.announcements
    FOR DELETE USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert/delete volunteer_tasks (admin-gated by API)
DROP POLICY IF EXISTS "Authenticated users can insert volunteer_tasks" ON public.volunteer_tasks;
CREATE POLICY "Authenticated users can insert volunteer_tasks" ON public.volunteer_tasks
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete volunteer_tasks" ON public.volunteer_tasks;
CREATE POLICY "Authenticated users can delete volunteer_tasks" ON public.volunteer_tasks
    FOR DELETE USING (auth.role() = 'authenticated');

-- Allow admin to update any membership_application
DROP POLICY IF EXISTS "Authenticated users can update membership_applications" ON public.membership_applications;
CREATE POLICY "Authenticated users can update membership_applications" ON public.membership_applications
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow admin to update any transaction (for webhook updates)
DROP POLICY IF EXISTS "Authenticated users can update transactions" ON public.transactions;
CREATE POLICY "Authenticated users can update transactions" ON public.transactions
    FOR UPDATE USING (auth.role() = 'authenticated');


-- 10. RPC FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION public.increment_manifesto_vote(item_id TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.manifesto_items
    SET vote_count = vote_count + 1
    WHERE id = item_id;
END;
$$;


-- 11. STORAGE BUCKET
-- ============================================================================

-- Note: This creates the bucket only if it doesn't exist via the storage API.
-- The SQL-level bucket creation may need to be done via Supabase dashboard
-- or management API if this statement is not supported.
INSERT INTO storage.buckets (id, name, public)
SELECT 'documents', 'documents', false
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'documents');

-- Allow authenticated users to upload to documents bucket
DROP POLICY IF EXISTS "Authenticated users can upload to documents" ON storage.objects;
CREATE POLICY "Authenticated users can upload to documents" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'documents' AND auth.role() = 'authenticated'
    );

DROP POLICY IF EXISTS "Authenticated users can read from documents" ON storage.objects;
CREATE POLICY "Authenticated users can read from documents" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'documents' AND auth.role() = 'authenticated'
    );


-- 12. INDEXES FOR COMMON QUERIES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_issues_status ON public.issues(status);
CREATE INDEX IF NOT EXISTS idx_issues_ward ON public.issues(ward);
CREATE INDEX IF NOT EXISTS idx_issues_created_at ON public.issues(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_volunteer_applications_status ON public.volunteer_applications(status);

CREATE INDEX IF NOT EXISTS idx_volunteer_tasks_status ON public.volunteer_tasks(status);
CREATE INDEX IF NOT EXISTS idx_volunteer_tasks_assigned_to ON public.volunteer_tasks(assigned_to);

CREATE INDEX IF NOT EXISTS idx_announcements_target_audience ON public.announcements(target_audience);
CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON public.announcements(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);

CREATE INDEX IF NOT EXISTS idx_manifesto_items_vote_count ON public.manifesto_items(vote_count DESC);

CREATE INDEX IF NOT EXISTS idx_crimes_crime_type ON public.crimes(crime_type);
CREATE INDEX IF NOT EXISTS idx_crimes_incident_date ON public.crimes(incident_date);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_referred_by ON public.profiles(referred_by);
