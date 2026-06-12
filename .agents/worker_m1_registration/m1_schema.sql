-- M1 Schema Migration for ECI-Compliant Registration

ALTER TABLE membership_applications
ADD COLUMN IF NOT EXISTS voter_id TEXT,
ADD COLUMN IF NOT EXISTS identity_doc_url TEXT,
ADD COLUMN IF NOT EXISTS declaration_agreed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS vision_extracted_text TEXT,
ADD COLUMN IF NOT EXISTS vision_validation_status TEXT;

-- Assuming status already exists, if not:
-- ALTER TABLE membership_applications ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
