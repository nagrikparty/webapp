-- ============================================================================
-- Migration 03: Sync database schema with application code
-- Adds all missing columns, indexes, storage policies, and fixes the
-- storage bucket visibility.
--
-- Applied: 2026-06-13
-- Safe to run multiple times (all statements use IF [NOT] EXISTS).
-- ============================================================================

-- 1. MISSING COLUMNS ON membership_applications
-- ============================================================================

ALTER TABLE public.membership_applications ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.membership_applications ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.membership_applications ADD COLUMN IF NOT EXISTS parent_or_spouse_name TEXT;
ALTER TABLE public.membership_applications ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE public.membership_applications ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.membership_applications ADD COLUMN IF NOT EXISTS aadhaar_number TEXT;
ALTER TABLE public.membership_applications ADD COLUMN IF NOT EXISTS referred_by UUID;
ALTER TABLE public.membership_applications ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.membership_applications ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';


-- 2. MISSING COLUMNS ON volunteer_applications
-- ============================================================================

ALTER TABLE public.volunteer_applications ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.volunteer_applications ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.volunteer_applications ADD COLUMN IF NOT EXISTS skills TEXT;
ALTER TABLE public.volunteer_applications ADD COLUMN IF NOT EXISTS availability TEXT;
ALTER TABLE public.volunteer_applications ADD COLUMN IF NOT EXISTS referred_by UUID;
ALTER TABLE public.volunteer_applications ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';


-- 3. MISSING COLUMNS ON transactions
-- ============================================================================

ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'created';
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'INR';
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT;


-- 4. MISSING COLUMNS ON profiles
-- ============================================================================

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS vidhan_sabha TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS lok_sabha TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;


-- 5. MISSING COLUMN ON manifesto_votes
-- ============================================================================

ALTER TABLE public.manifesto_votes ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;


-- 6. PERFORMANCE INDEXES
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

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_referred_by ON public.profiles(referred_by);


-- 7. STORAGE BUCKET FIX
-- ============================================================================

-- Set documents bucket to private (was incorrectly public)
UPDATE storage.buckets SET public = false WHERE id = 'documents';

-- Storage RLS policies
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
