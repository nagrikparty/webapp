-- Migration 08: Security and State Machine Hardening

-- 1. Ensure newly created user accounts default to 'PUBLIC'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'PUBLIC')
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
  RETURN new;
END;
$$;

-- 2. Drop legacy permissive policies on storage.objects
DROP POLICY IF EXISTS "Authenticated users can read from documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload to documents" ON storage.objects;

-- 3. Enforce folder isolation on all member buckets including 'documents'
DROP POLICY IF EXISTS "Users can read own member documents" ON storage.objects;
CREATE POLICY "Users can read own member documents" ON storage.objects
  FOR SELECT USING (
    auth.role() = 'authenticated'
    AND bucket_id = ANY (ARRAY['documents', 'member-documents', 'member-photos', 'generated-documents', 'membership-cards'])
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
          AND profiles.role = ANY (ARRAY['VERIFIER', 'ADMIN', 'SUPER_ADMIN'])
      )
    )
  );

DROP POLICY IF EXISTS "Users can upload own member documents" ON storage.objects;
CREATE POLICY "Users can upload own member documents" ON storage.objects
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated'
    AND bucket_id = ANY (ARRAY['documents', 'member-documents', 'member-photos', 'generated-documents', 'membership-cards'])
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 4. Harden profile role escalation in public.profiles
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile fields" ON public.profiles;
DROP POLICY IF EXISTS "Staff can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Verifiers can update profile to MEMBER" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update profiles up to ADMIN" ON public.profiles;
DROP POLICY IF EXISTS "Super Admins can update any profile" ON public.profiles;

-- 4a. Users can update their own profile details, but CANNOT change their role
CREATE POLICY "Users can update own profile fields" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid())
  );

-- 4b. Verifiers can only update applicant profile role to MEMBER upon verification
CREATE POLICY "Verifiers can update profile to MEMBER" ON public.profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'VERIFIER'
    )
  )
  WITH CHECK (
    role IN ('PUBLIC', 'MEMBER')
  );

-- 4c. Admins can update profiles but cannot create SUPER_ADMIN
CREATE POLICY "Admins can update profiles up to ADMIN" ON public.profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'ADMIN'
    )
  )
  WITH CHECK (
    role IN ('PUBLIC', 'MEMBER', 'VERIFIER', 'ADMIN')
  );

-- 4d. Super Admins can update any profile to any role
CREATE POLICY "Super Admins can update any profile" ON public.profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'SUPER_ADMIN'
    )
  );

-- 5. Membership Application state machine enforcement
DROP POLICY IF EXISTS "Users update draft or staff update any" ON public.membership_applications;
DROP POLICY IF EXISTS "Users update draft or resubmit" ON public.membership_applications;
DROP POLICY IF EXISTS "Staff update any application" ON public.membership_applications;

CREATE POLICY "Users update draft or resubmit" ON public.membership_applications
  FOR UPDATE USING (
    auth.uid() = user_id AND status IN ('DRAFT', 'NEEDS_CORRECTION')
  )
  WITH CHECK (
    auth.uid() = user_id AND status IN ('DRAFT', 'NEEDS_CORRECTION', 'SUBMITTED')
  );

CREATE POLICY "Staff update any application" ON public.membership_applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('VERIFIER', 'ADMIN', 'SUPER_ADMIN')
    )
  );
