CREATE TABLE IF NOT EXISTS nagrik_reports (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  ward TEXT NOT NULL,
  category TEXT NOT NULL,
  severity TEXT NOT NULL,
  description TEXT NOT NULL,
  photo_url TEXT,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Resolved')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS nagrik_members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  dob TEXT NOT NULL,
  gender TEXT NOT NULL,
  guardian_name TEXT NOT NULL,
  address TEXT NOT NULL,
  state TEXT NOT NULL,
  vidhan_sabha TEXT NOT NULL,
  ward TEXT,
  pincode TEXT NOT NULL,
  is_registered_voter TEXT DEFAULT 'no',
  is_indian_citizen INTEGER DEFAULT 1,
  has_criminal_record INTEGER DEFAULT 0,
  criminal_record_details TEXT,
  is_other_party_member TEXT DEFAULT 'no',
  other_party_name TEXT,
  epic_number TEXT NOT NULL,
  skills TEXT,
  social_media TEXT,
  referral_source TEXT,
  referral_code TEXT,
  profile_photo_key TEXT,
  epic_photo_key TEXT,
  password_hash TEXT, -- DEPRECATED: Auth handled by Supabase, this column is unused
  declaration_agreed INTEGER DEFAULT 0,
  didit_session_id TEXT,
  is_verified INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS nagrik_contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS nagrik_donations (
  id TEXT PRIMARY KEY,
  donor_name TEXT NOT NULL,
  amount INTEGER NOT NULL,
  purpose TEXT DEFAULT 'General Fund',
  transaction_ref TEXT,
  status TEXT DEFAULT 'VERIFIED' CHECK (status IN ('PENDING', 'VERIFIED', 'REJECTED')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS nagrik_press_releases (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  ref_code TEXT NOT NULL,
  published_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS nagrik_leaders (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Ward Captain',
  ward TEXT NOT NULL,
  area TEXT NOT NULL,
  status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS nagrik_verifications (
  id TEXT PRIMARY KEY,
  member_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_members_phone ON nagrik_members(phone);
CREATE INDEX IF NOT EXISTS idx_members_email ON nagrik_members(email);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON nagrik_reports(created_at);
CREATE INDEX IF NOT EXISTS idx_reports_ward ON nagrik_reports(ward);
CREATE INDEX IF NOT EXISTS idx_reports_status ON nagrik_reports(status);
CREATE INDEX IF NOT EXISTS idx_verifications_member_id ON nagrik_verifications(member_id);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON nagrik_donations(created_at);