// Nagrik Party - Phase 1 Complete Type Definitions

export type UserRole = "PUBLIC" | "MEMBER" | "VERIFIER" | "ADMIN" | "SUPER_ADMIN";

export type MembershipStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "DOCUMENTS_PENDING"
  | "UNDER_REVIEW"
  | "NEEDS_CORRECTION"
  | "APPROVED"
  | "REJECTED"
  | "SUSPENDED"
  | "RESIGNED"
  | "ARCHIVED";

export type MembershipCategory =
  | "Primary Member"
  | "Active Member"
  | "Volunteer"
  | "Organisational Worker"
  | "Digital Volunteer";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  ward: string | null;
  vidhan_sabha: string | null;
  lok_sabha: string | null;
  epic: string | null;
  avatar_url: string | null;
  referred_by: string | null;
  created_at: string;
  updated_at?: string;
}

export interface MembershipApplication {
  id: string;
  application_number: string;
  user_id: string;
  status: MembershipStatus;
  membership_category: MembershipCategory;
  form_version: string;
  declaration_version: string;
  consent_version: string;
  submitted_at: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  correction_notes: string | null;
  created_at: string;
  updated_at: string;
  // Joins & Details
  member_addresses?: MemberAddress | MemberAddress[];
  electoral_details?: ElectoralDetails | ElectoralDetails[];
  member_participation?: MemberParticipation | MemberParticipation[];
  membership_declarations?: MembershipDeclaration | MembershipDeclaration[];
  membership_consents?: MembershipConsent | MembershipConsent[];
  documents?: DocumentRecord[];
  signatures?: SignatureRecord | SignatureRecord[];
  membership_status_history?: MembershipStatusHistoryItem[];
}

export interface Member {
  id: string;
  user_id: string;
  application_id: string | null;
  membership_id: string; // NAG-000001
  full_name: string;
  category: MembershipCategory;
  status: "APPROVED" | "SUSPENDED" | "RESIGNED" | "ARCHIVED";
  approved_at: string;
  approved_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface MemberAddress {
  id: string;
  user_id: string;
  application_id: string;
  full_legal_name: string;
  parent_or_guardian_name: string;
  date_of_birth: string;
  gender: string;
  occupation: string | null;
  phone: string;
  email: string;
  address_line1: string;
  address_line2: string | null;
  state: string;
  district: string;
  lok_sabha: string | null;
  vidhan_sabha: string;
  ward: string | null;
  pincode: string;
  created_at: string;
}

export interface ElectoralDetails {
  id: string;
  user_id: string;
  application_id: string;
  identity_proof_type: string;
  epic_number: string | null;
  vidhan_sabha: string | null;
  part_number: string | null;
  serial_number: string | null;
  polling_station: string | null;
  is_verified: boolean;
  created_at: string;
}

export interface MemberParticipation {
  id: string;
  user_id: string;
  application_id: string;
  interest_areas: string[];
  skills: string | null;
  availability: string | null;
  notes: string | null;
  created_at: string;
}

export interface MembershipDeclaration {
  id: string;
  user_id: string;
  application_id: string;
  declaration_text: string;
  declaration_version: string;
  bears_true_faith: boolean;
  upholds_sovereignty: boolean;
  accepts_constitution: boolean;
  no_other_party_membership: boolean;
  no_prohibited_conduct: boolean;
  agreed_at: string;
  ip_address: string | null;
  user_agent: string | null;
}

export interface MembershipConsent {
  id: string;
  user_id: string;
  application_id: string;
  consent_text: string;
  consent_version: string;
  agreed_at: string;
  ip_address: string | null;
  user_agent: string | null;
}

export type DocumentType =
  | "identity_proof"
  | "electoral_evidence"
  | "address_evidence"
  | "membership_declaration"
  | "constitutional_declaration"
  | "affidavit"
  | "photograph"
  | "signature"
  | "other";

export type OcrStatus =
  | "PENDING"
  | "EXTRACTED"
  | "CONFIRMED_BY_MEMBER"
  | "FAILED"
  | "NOT_APPLICABLE";

export type VerificationStatus =
  | "UPLOADED"
  | "OCR_COMPLETE"
  | "MEMBER_CONFIRMED"
  | "UNDER_REVIEW"
  | "VERIFIED"
  | "REJECTED"
  | "NEEDS_CORRECTION";

export interface DocumentRecord {
  id: string;
  user_id: string;
  application_id: string | null;
  member_id: string | null;
  document_type: DocumentType;
  original_filename: string;
  mime_type: string;
  file_size: number;
  storage_path: string;
  sha256_hash: string;
  current_version: number;
  ocr_status: OcrStatus;
  verification_status: VerificationStatus;
  verified_by: string | null;
  verified_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  extractions?: DocumentExtraction[];
  signed_url?: string;
}

export interface DocumentVersion {
  id: string;
  document_id: string;
  version_number: number;
  storage_path: string;
  sha256_hash: string;
  file_size: number;
  uploaded_by: string;
  reason_for_replacement: string | null;
  created_at: string;
}

export interface DocumentExtraction {
  id: string;
  document_id: string;
  field_name: string;
  extracted_value: string | null;
  confidence: number | null;
  source: string;
  confirmed_value: string | null;
  confirmed_by: string | null;
  confirmed_at: string | null;
  created_at: string;
}

export interface DocumentVerification {
  id: string;
  document_id: string;
  verifier_id: string;
  action: "APPROVE" | "REJECT" | "REQUEST_CORRECTION";
  notes: string | null;
  created_at: string;
}

export interface SignatureRecord {
  id: string;
  user_id: string;
  application_id: string;
  signature_type: "TYPED_CONFIRMATION" | "DIGITAL_DRAWING" | "UPLOADED_DOCUMENT";
  typed_name: string | null;
  document_id: string | null;
  signed_at: string;
  ip_address: string | null;
  user_agent: string | null;
}

export interface MembershipCard {
  id: string;
  member_id: string;
  card_number: string;
  card_version: number;
  issue_date: string;
  status: "ACTIVE" | "REVOKED" | "SUPERSEDED";
  qr_token: string;
  verification_slug: string;
  front_document_id: string | null;
  back_document_id: string | null;
  print_document_id: string | null;
  generated_at: string;
  revoked_at: string | null;
  revocation_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  actor_user_id: string | null;
  actor_role: string;
  action: string;
  entity_type: string;
  entity_id: string;
  metadata: Record<string, unknown>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface MembershipStatusHistoryItem {
  id: string;
  application_id: string;
  member_id: string | null;
  previous_status: string;
  new_status: string;
  changed_by: string | null;
  reason: string | null;
  created_at: string;
}

export interface PublicDocument {
  id: string;
  category: "FORMATION" | "GOVERNANCE" | "FINANCE" | "POLICY";
  slug: string;
  title: string;
  title_hi: string | null;
  description: string | null;
  description_hi: string | null;
  file_path: string | null;
  content_markdown: string | null;
  content_markdown_hi: string | null;
  version: string;
  is_published: boolean;
  published_at: string;
  created_at: string;
}

export interface FinancialStatement {
  id: string;
  reporting_period: string;
  period_start: string;
  period_end: string;
  opening_balance: number;
  total_contributions: number;
  total_expenses: number;
  closing_balance: number;
  statement_document_url: string | null;
  notes: string | null;
  is_published: boolean;
  published_at: string;
  created_at: string;
}

export interface FinancialTransaction {
  id: string;
  statement_id: string | null;
  transaction_date: string;
  transaction_type: "CONTRIBUTION" | "EXPENSE";
  category: string;
  amount: number;
  description: string;
  is_public: boolean;
  created_at: string;
}

export interface SubmissionTemplate {
  id: string;
  title: string;
  description: string | null;
  version: string;
  is_active: boolean;
  config: Record<string, unknown>;
  created_at: string;
  requirements?: SubmissionRequirement[];
}

export interface SubmissionRequirement {
  id: string;
  template_id: string;
  code: string;
  title: string;
  field_mappings: Record<string, unknown>;
  required_document_types: string[];
  annexure_label: string | null;
  sort_order: number;
  is_mandatory: boolean;
  created_at: string;
}

export interface SubmissionExport {
  id: string;
  template_id: string;
  export_number: string;
  status: "GENERATING" | "COMPLETED" | "FAILED";
  total_pages: number;
  file_storage_path: string | null;
  file_sha256: string | null;
  generated_by: string | null;
  generated_at: string;
  metadata: Record<string, unknown>;
}

// Retained legacy interfaces for compatibility
export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  ward: string | null;
  assigned_to: string | null;
  created_at: string;
  profiles?: { full_name: string } | null;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  target_audience: string;
  author_id: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  transaction_id: string;
  payment_status?: string;
  currency?: string;
  created_at: string;
}

export interface Issue {
  id: string;
  title: string;
  description?: string;
  category: string;
  ward: string;
  lok_sabha?: string;
  vidhan_sabha?: string;
  status: string;
  created_at: string;
}

export interface Proposer {
  id: string;
  full_name: string;
  epic_number: string;
  ward: string | null;
  vidhan_sabha: string | null;
  contact_number: string | null;
  address: string | null;
  created_at: string;
}

export interface ProposerRecord {
  id: string;
  member_id: string;
  application_id: string;
  user_id: string;
  proposer_serial_number: string;
  epic_number: string;
  full_name: string;
  vidhan_sabha: string;
  part_number: string | null;
  serial_number: string | null;
  polling_station: string | null;
  ward: string | null;
  district: string | null;
  address: string | null;
  contact_number: string | null;
  affidavit_document_id: string | null;
  affidavit_sha256: string | null;
  affidavit_uploaded_at: string | null;
  status: "DRAFT" | "NOTARIZED" | "SUBMITTED" | "VERIFIED" | "REJECTED";
  verified_by: string | null;
  verified_at: string | null;
  rejection_reason: string | null;
  eci_filing_id: string | null;
  created_at: string;
  updated_at: string;
}

export type EciFilingStatus =
  | "DRAFT"
  | "COMPILED"
  | "SUBMITTED"
  | "UNDER_SCRUTINY"
  | "APPROVED"
  | "REJECTED";

export interface EciFilingDossier {
  id: string;
  filing_number: string;
  status: EciFilingStatus;
  total_proposers: number;
  verified_proposers: number;
  total_pages: number;
  dossier_sha256: string | null;
  form_version: string;
  submitted_at: string | null;
  approved_at: string | null;
  gazette_notified_at: string | null;
  rejection_reason: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface EciComplianceItem {
  id: string;
  eci_filing_id: string;
  item_code: string;
  item_title: string;
  item_description: string | null;
  is_mandatory: boolean;
  is_satisfied: boolean;
  satisfied_at: string | null;
  evidence_document_id: string | null;
  evidence_notes: string | null;
  checked_by: string | null;
  checked_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PartySymbol {
  id: string;
  eci_filing_id: string;
  preference_order: number;
  symbol_name: string;
  symbol_description: string | null;
  status: "REQUESTED" | "ALLOTTED" | "REJECTED";
  allotted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface GazetteNotification {
  id: string;
  eci_filing_id: string;
  notification_number: string | null;
  publication_date: string | null;
  english_newspaper: string | null;
  hindi_newspaper: string | null;
  pdf_path: string | null;
  sha256: string | null;
  status: "DRAFT" | "PUBLISHED" | "VERIFIED";
  created_at: string;
  updated_at: string;
}

export interface EciReadinessSnapshot {
  total_proposers: number;
  verified_proposers: number;
  declarations_complete: number;
  consents_complete: number;
  signatures_complete: number;
  documents_complete: number;
  epic_complete: number;
  eci_ready: boolean;
}

export interface CrimeStat {
  crime_type: string;
  count: number;
}
