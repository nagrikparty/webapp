-- Migration 10: Atomic Approval Stored Procedure & Hardened Statutory Scrutiny
-- Ensures that membership approval is 100% transactional: any failure reverts all child changes.

CREATE OR REPLACE FUNCTION public.approve_membership_application(
  p_application_id UUID,
  p_verifier_id UUID,
  p_notes TEXT DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_app RECORD;
  v_addr RECORD;
  v_decl RECORD;
  v_cons RECORD;
  v_sig RECORD;
  v_verifier_role TEXT;
  v_member_id UUID;
  v_membership_id TEXT;
  v_card_id UUID;
  v_now TIMESTAMPTZ := NOW();
  v_valid_doc_count INTEGER;
  v_unconfirmed_doc_count INTEGER;
  v_audit_log_id UUID;
BEGIN
  -- 1. Verifier Authorization & Anti-Self-Approval Check
  SELECT role INTO v_verifier_role FROM public.profiles WHERE id = p_verifier_id;
  IF v_verifier_role IS NULL OR v_verifier_role NOT IN ('VERIFIER', 'ADMIN', 'SUPER_ADMIN') THEN
    RAISE EXCEPTION 'Unauthorized: Verifier role required (found: %)', COALESCE(v_verifier_role, 'NONE');
  END IF;

  -- Lock application record for atomic update
  SELECT * INTO v_app FROM public.membership_applications
  WHERE id = p_application_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Application not found: %', p_application_id;
  END IF;

  IF v_app.user_id = p_verifier_id THEN
    RAISE EXCEPTION 'Integrity violation: Self-approval is strictly prohibited under organizational rules.';
  END IF;

  -- If already approved, return existing member data idempotently
  IF v_app.status = 'APPROVED' THEN
    SELECT id, membership_id INTO v_member_id, v_membership_id
    FROM public.members
    WHERE application_id = p_application_id OR user_id = v_app.user_id
    LIMIT 1;

    IF v_membership_id IS NOT NULL THEN
      RETURN jsonb_build_object(
        'success', true,
        'message', 'Application already approved',
        'membership_id', v_membership_id,
        'member_id', v_member_id,
        'application_id', p_application_id
      );
    END IF;
  END IF;

  -- 2. State Machine Boundary Check
  IF v_app.status NOT IN ('SUBMITTED', 'UNDER_REVIEW', 'NEEDS_CORRECTION') THEN
    RAISE EXCEPTION 'Cannot approve application from status "%". Only reviewable applications (SUBMITTED, UNDER_REVIEW, NEEDS_CORRECTION) may be approved.', v_app.status;
  END IF;

  -- 3. Scrutiny Evidence Validation

  -- A. Address validation
  SELECT * INTO v_addr FROM public.member_addresses WHERE application_id = p_application_id;
  IF NOT FOUND 
     OR v_addr.full_legal_name IS NULL OR length(trim(v_addr.full_legal_name)) = 0 
     OR v_addr.address_line1 IS NULL OR length(trim(v_addr.address_line1)) = 0
     OR v_addr.vidhan_sabha IS NULL OR length(trim(v_addr.vidhan_sabha)) = 0
     OR v_addr.pincode IS NULL OR length(trim(v_addr.pincode)) = 0 THEN
    RAISE EXCEPTION 'Statutory scrutiny failed: Valid member residential address and Delhi Vidhan Sabha required.';
  END IF;

  -- B. Document Provenance Validation
  -- Strictly require at least one document linked to application with storage_path, sha256_hash, and MEMBER_CONFIRMED (or VERIFIED)
  SELECT COUNT(*) INTO v_valid_doc_count
  FROM public.documents
  WHERE application_id = p_application_id
    AND storage_path IS NOT NULL AND length(trim(storage_path)) > 0
    AND sha256_hash IS NOT NULL AND length(trim(sha256_hash)) > 0
    AND verification_status IN ('MEMBER_CONFIRMED', 'VERIFIED');

  IF v_valid_doc_count = 0 THEN
    RAISE EXCEPTION 'Statutory scrutiny failed: Identity evidence document must be uploaded, hash-verified, and confirmed by member (MEMBER_CONFIRMED) prior to approval.';
  END IF;

  -- Reject if any linked document is in an unconfirmed or invalid state
  SELECT COUNT(*) INTO v_unconfirmed_doc_count
  FROM public.documents
  WHERE application_id = p_application_id
    AND verification_status NOT IN ('MEMBER_CONFIRMED', 'VERIFIED');

  IF v_unconfirmed_doc_count > 0 THEN
    RAISE EXCEPTION 'Statutory scrutiny failed: Application contains % unconfirmed document(s). All documents must be MEMBER_CONFIRMED before approval.', v_unconfirmed_doc_count;
  END IF;

  -- C. Constitutional Declaration Validation (§29A RPA 1951)
  SELECT * INTO v_decl FROM public.membership_declarations WHERE application_id = p_application_id;
  IF NOT FOUND 
     OR v_decl.accepts_constitution IS NOT TRUE
     OR v_decl.bears_true_faith IS NOT TRUE
     OR v_decl.upholds_sovereignty IS NOT TRUE
     OR v_decl.no_other_party_membership IS NOT TRUE
     OR v_decl.agreed_at IS NULL THEN
    RAISE EXCEPTION 'Statutory scrutiny failed: Constitutional Declaration (§29A RPA 1951 affirmative declaration required).';
  END IF;

  -- D. Statutory Data Consent Validation (DPDP compliance)
  SELECT * INTO v_cons FROM public.membership_consents WHERE application_id = p_application_id;
  IF NOT FOUND OR v_cons.agreed_at IS NULL THEN
    RAISE EXCEPTION 'Statutory scrutiny failed: Statutory Data Consent (DPDP compliance consent record required).';
  END IF;

  -- E. Signature Validation
  SELECT * INTO v_sig FROM public.signatures WHERE application_id = p_application_id;
  IF NOT FOUND OR v_sig.typed_name IS NULL OR length(trim(v_sig.typed_name)) = 0 OR v_sig.signed_at IS NULL THEN
    RAISE EXCEPTION 'Statutory scrutiny failed: Confirmation signature required.';
  END IF;

  -- 4. Authoritative Membership ID Resolution
  SELECT id, membership_id INTO v_member_id, v_membership_id
  FROM public.members
  WHERE user_id = v_app.user_id OR application_id = p_application_id
  LIMIT 1;

  IF v_membership_id IS NULL THEN
    v_membership_id := public.generate_membership_id();
    IF v_membership_id IS NULL OR NOT (v_membership_id LIKE 'NAG-%') THEN
      RAISE EXCEPTION 'System failure: Unable to allocate authoritative membership sequence ID.';
    END IF;
  END IF;

  -- 5. Upsert / Insert Member Record
  IF v_member_id IS NOT NULL THEN
    UPDATE public.members SET
      application_id = p_application_id,
      full_name = v_addr.full_legal_name,
      category = COALESCE(v_app.membership_category, 'Primary Member'),
      status = 'APPROVED',
      approved_at = v_now,
      approved_by = p_verifier_id,
      updated_at = v_now
    WHERE id = v_member_id;
  ELSE
    INSERT INTO public.members (
      user_id,
      application_id,
      membership_id,
      full_name,
      category,
      status,
      approved_at,
      approved_by,
      created_at,
      updated_at
    ) VALUES (
      v_app.user_id,
      p_application_id,
      v_membership_id,
      v_addr.full_legal_name,
      COALESCE(v_app.membership_category, 'Primary Member'),
      'APPROVED',
      v_now,
      p_verifier_id,
      v_now,
      v_now
    )
    RETURNING id INTO v_member_id;
  END IF;

  -- 6. Ensure Exactly One Active Membership Card
  SELECT id INTO v_card_id
  FROM public.membership_cards
  WHERE member_id = v_member_id AND status = 'ACTIVE'
  LIMIT 1;

  IF v_card_id IS NULL THEN
    INSERT INTO public.membership_cards (
      member_id,
      card_number,
      card_version,
      status,
      qr_token,
      verification_slug,
      issue_date,
      created_at,
      updated_at
    ) VALUES (
      v_member_id,
      v_membership_id,
      1,
      'ACTIVE',
      gen_random_uuid()::text,
      v_membership_id,
      CURRENT_DATE,
      v_now,
      v_now
    )
    RETURNING id INTO v_card_id;
  END IF;

  -- 7. Transition Documents to VERIFIED & Record Document Verifications
  UPDATE public.documents SET
    verification_status = 'VERIFIED',
    verified_by = p_verifier_id,
    verified_at = v_now,
    member_id = v_member_id,
    updated_at = v_now
  WHERE application_id = p_application_id
    AND verification_status IN ('MEMBER_CONFIRMED', 'VERIFIED');

  INSERT INTO public.document_verifications (
    document_id,
    verifier_id,
    action,
    notes,
    created_at
  )
  SELECT
    d.id,
    p_verifier_id,
    'APPROVE',
    COALESCE(p_notes, 'Verified during statutory scrutiny and approval'),
    v_now
  FROM public.documents d
  WHERE d.application_id = p_application_id;

  -- 8. Profile Role Elevation (PUBLIC -> MEMBER)
  UPDATE public.profiles SET
    role = 'MEMBER',
    updated_at = v_now
  WHERE id = v_app.user_id AND role = 'PUBLIC';

  -- 9. Status History Entry
  INSERT INTO public.membership_status_history (
    application_id,
    member_id,
    previous_status,
    new_status,
    changed_by,
    reason,
    created_at
  ) VALUES (
    p_application_id,
    v_member_id,
    v_app.status,
    'APPROVED',
    p_verifier_id,
    COALESCE(p_notes, 'Application verified and approved by staff.'),
    v_now
  );

  -- 10. Update Application Status to APPROVED
  UPDATE public.membership_applications SET
    status = 'APPROVED',
    reviewed_by = p_verifier_id,
    reviewed_at = v_now,
    correction_notes = p_notes,
    updated_at = v_now
  WHERE id = p_application_id;

  -- 11. Transactional Statutory Audit Log
  -- If audit log persistence fails, the exception aborts the entire transaction.
  v_audit_log_id := public.record_audit_log(
    p_verifier_id,
    v_verifier_role,
    'MEMBERSHIP_APPROVED',
    'members',
    v_member_id::text,
    jsonb_build_object(
      'membership_id', v_membership_id,
      'application_id', p_application_id,
      'user_id', v_app.user_id,
      'notes', p_notes
    ),
    p_ip_address,
    p_user_agent
  );

  IF v_audit_log_id IS NULL THEN
    RAISE EXCEPTION 'Audit logging failed: Unable to persist statutory audit entry.';
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'membership_id', v_membership_id,
    'member_id', v_member_id,
    'application_id', p_application_id,
    'card_id', v_card_id,
    'audit_log_id', v_audit_log_id
  );
END;
$$;
