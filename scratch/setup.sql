-- =============================================
-- Migration: Digital Member Portal Features
-- =============================================

-- 1. Transactions table for Razorpay donations
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    amount NUMERIC NOT NULL CHECK (amount > 0),
    transaction_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own transactions
CREATE POLICY "Users can view own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own transactions
CREATE POLICY "Users can insert own transactions" ON public.transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can view all transactions
CREATE POLICY "Admins can view all transactions" ON public.transactions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 2. Add referred_by column to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES auth.users(id);

-- 3. Add epic column to profiles (for ID card display)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS epic TEXT;

-- 4. Add identity_doc_url, voter_id, declaration_agreed, vision columns to membership_applications
ALTER TABLE public.membership_applications
ADD COLUMN IF NOT EXISTS identity_doc_url TEXT,
ADD COLUMN IF NOT EXISTS voter_id TEXT,
ADD COLUMN IF NOT EXISTS declaration_agreed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS vision_extracted_text TEXT,
ADD COLUMN IF NOT EXISTS vision_validation_status TEXT;

-- 5. Proposers table
CREATE TABLE IF NOT EXISTS public.proposers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    epic_number TEXT NOT NULL,
    ward TEXT,
    vidhan_sabha TEXT,
    contact_number TEXT,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    added_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.proposers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view proposers" ON public.proposers
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can insert proposers" ON public.proposers
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 6. Documents storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Read Access documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'documents');

CREATE POLICY "Allow authenticated inserts documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents' AND auth.role() = 'authenticated'
  );
