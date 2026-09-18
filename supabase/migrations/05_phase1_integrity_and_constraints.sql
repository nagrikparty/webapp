-- ============================================================================
-- Migration 05: Phase 1 Integrity, Unique Constraints & Security Hardening
-- Nagrik Party Platform
-- ============================================================================

-- 1. Unique Constraints on 1-to-1 Child Tables for Membership Applications
ALTER TABLE public.member_addresses 
  DROP CONSTRAINT IF EXISTS member_addresses_application_id_key,
  ADD CONSTRAINT member_addresses_application_id_key UNIQUE (application_id);

ALTER TABLE public.electoral_details 
  DROP CONSTRAINT IF EXISTS electoral_details_application_id_key,
  ADD CONSTRAINT electoral_details_application_id_key UNIQUE (application_id);

ALTER TABLE public.member_participation 
  DROP CONSTRAINT IF EXISTS member_participation_application_id_key,
  ADD CONSTRAINT member_participation_application_id_key UNIQUE (application_id);

ALTER TABLE public.membership_declarations 
  DROP CONSTRAINT IF EXISTS membership_declarations_application_id_key,
  ADD CONSTRAINT membership_declarations_application_id_key UNIQUE (application_id);

ALTER TABLE public.membership_consents 
  DROP CONSTRAINT IF EXISTS membership_consents_application_id_key,
  ADD CONSTRAINT membership_consents_application_id_key UNIQUE (application_id);

ALTER TABLE public.signatures 
  DROP CONSTRAINT IF EXISTS signatures_application_id_key,
  ADD CONSTRAINT signatures_application_id_key UNIQUE (application_id);

-- 2. Prevent Multiple Concurrent Active Applications for the same User
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_active_app_per_user 
ON public.membership_applications (user_id) 
WHERE status NOT IN ('REJECTED', 'SUSPENDED', 'RESIGNED', 'ARCHIVED');

-- 3. Prevent Self-Approval on Members Table
ALTER TABLE public.members 
  DROP CONSTRAINT IF EXISTS members_no_self_approval;
ALTER TABLE public.members 
  ADD CONSTRAINT members_no_self_approval CHECK (user_id != approved_by);

-- 4. Secure Definer RPC for Logging Audit Events
CREATE OR REPLACE FUNCTION public.record_audit_log(
  p_actor_user_id UUID,
  p_actor_role TEXT,
  p_action TEXT,
  p_entity_type TEXT,
  p_entity_id TEXT,
  p_metadata JSONB DEFAULT '{}'::jsonb,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS 
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO public.audit_logs (
    actor_user_id,
    actor_role,
    action,
    entity_type,
    entity_id,
    metadata,
    ip_address,
    user_agent,
    created_at
  ) VALUES (
    p_actor_user_id,
    COALESCE(p_actor_role, 'PUBLIC'),
    p_action,
    p_entity_type,
    p_entity_id,
    COALESCE(p_metadata, '{}'::jsonb),
    p_ip_address,
    p_user_agent,
    NOW()
  )
  RETURNING id INTO v_log_id;
  RETURN v_log_id;
END;
;

-- 5. RLS Hardening: Enforce Role Immutability from Client Side
DROP POLICY IF EXISTS "Users can update own profile fields" ON public.profiles;
CREATE POLICY "Users can update own profile fields" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND 
    (
      role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid()) OR
      EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN'))
    )
  );

DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Admins can update any profile" ON public.profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('ADMIN', 'SUPER_ADMIN'))
  );
