-- Migration 09: Fix RLS recursion on public.profiles and seed demo test personas

-- 1. Create SECURITY DEFINER role helper
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- 2. Drop recursive policies on public.profiles
DROP POLICY IF EXISTS "Admins can update profiles up to ADMIN" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Super Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can read own profile or staff can read all" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile fields" ON public.profiles;
DROP POLICY IF EXISTS "Verifiers can update profile to MEMBER" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to update own profile or staff update" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to insert own profile" ON public.profiles;

-- 3. Clean, non-recursive RLS policies on public.profiles
CREATE POLICY "Allow users to read profiles"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Allow users to insert own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow users to update own profile or staff update"
ON public.profiles FOR UPDATE
USING (auth.uid() = id OR public.get_auth_role() IN ('VERIFIER', 'ADMIN', 'SUPER_ADMIN'));

-- 4. Create trigger to strictly enforce role escalation prevention on profiles
CREATE OR REPLACE FUNCTION public.check_profile_role_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor_role text;
BEGIN
  -- Service role bypasses trigger
  IF current_setting('request.jwt.claim.role', true) = 'service_role' THEN
    RETURN NEW;
  END IF;

  IF OLD.role IS DISTINCT FROM NEW.role THEN
    v_actor_role := public.get_auth_role();
    
    IF v_actor_role IS NULL OR v_actor_role IN ('PUBLIC', 'MEMBER') THEN
      RAISE EXCEPTION 'Unauthorized: Users cannot change their own role (current: %, attempted: %)', OLD.role, NEW.role;
    ELSIF v_actor_role = 'VERIFIER' AND NEW.role NOT IN ('PUBLIC', 'MEMBER') THEN
      RAISE EXCEPTION 'Unauthorized: Verifiers can only assign PUBLIC or MEMBER roles';
    ELSIF v_actor_role = 'ADMIN' AND NEW.role = 'SUPER_ADMIN' THEN
      RAISE EXCEPTION 'Unauthorized: Admins cannot promote to SUPER_ADMIN';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_check_profile_role_update ON public.profiles;
CREATE TRIGGER trg_check_profile_role_update
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.check_profile_role_update();

-- 5. Application number default & no self-approval constraint
ALTER TABLE public.membership_applications 
ALTER COLUMN application_number SET DEFAULT public.generate_application_number();

ALTER TABLE public.membership_applications 
DROP CONSTRAINT IF EXISTS chk_no_self_approval;

ALTER TABLE public.membership_applications 
ADD CONSTRAINT chk_no_self_approval 
CHECK (reviewed_by IS NULL OR reviewed_by <> user_id);

-- 6. Updated verify_membership_card prioritizing latest card version
CREATE OR REPLACE FUNCTION public.verify_membership_card(p_card_number text)
 RETURNS TABLE(card_number text, member_name text, category text, card_status text, issue_date date, revoked_at timestamp with time zone, revocation_reason text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
        c.card_version DESC,
        CASE 
            WHEN c.status = 'ACTIVE' THEN 1 
            WHEN c.status = 'REVOKED' THEN 2 
            ELSE 3 
        END
    LIMIT 1;
END;
$function$;

