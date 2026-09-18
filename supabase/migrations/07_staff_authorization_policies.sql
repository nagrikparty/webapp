-- Migration 07: Staff authorization policies for core operational tables

-- 1. Members policies
DROP POLICY IF EXISTS "Staff insert members" ON public.members;
CREATE POLICY "Staff insert members" ON public.members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('VERIFIER', 'ADMIN', 'SUPER_ADMIN')
    )
  );

DROP POLICY IF EXISTS "Staff update members" ON public.members;
CREATE POLICY "Staff update members" ON public.members
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('VERIFIER', 'ADMIN', 'SUPER_ADMIN')
    )
  );

-- 2. Membership cards policies
DROP POLICY IF EXISTS "Staff insert membership_cards" ON public.membership_cards;
CREATE POLICY "Staff insert membership_cards" ON public.membership_cards
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('VERIFIER', 'ADMIN', 'SUPER_ADMIN')
    )
  );

DROP POLICY IF EXISTS "Staff update membership_cards" ON public.membership_cards;
CREATE POLICY "Staff update membership_cards" ON public.membership_cards
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('VERIFIER', 'ADMIN', 'SUPER_ADMIN')
    )
  );

-- 3. Membership status history policies
DROP POLICY IF EXISTS "Owner view own history or staff view all" ON public.membership_status_history;
CREATE POLICY "Owner view own history or staff view all" ON public.membership_status_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.membership_applications a
      WHERE a.id = membership_status_history.application_id
        AND a.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.members m
      WHERE m.id = membership_status_history.member_id
        AND m.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('VERIFIER', 'ADMIN', 'SUPER_ADMIN')
    )
  );

DROP POLICY IF EXISTS "Staff insert membership_status_history" ON public.membership_status_history;
CREATE POLICY "Staff insert membership_status_history" ON public.membership_status_history
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('VERIFIER', 'ADMIN', 'SUPER_ADMIN')
    )
  );

-- 4. Allow Verifier to update profiles (like ADMIN/SUPER_ADMIN)
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Staff can update any profile" ON public.profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('VERIFIER', 'ADMIN', 'SUPER_ADMIN')
    )
  );
