ALTER TABLE membership_applications ADD COLUMN IF NOT EXISTS voter_id TEXT;
ALTER TABLE membership_applications ADD COLUMN IF NOT EXISTS identity_doc_url TEXT;
ALTER TABLE membership_applications ADD COLUMN IF NOT EXISTS declaration_agreed BOOLEAN;
ALTER TABLE membership_applications ADD COLUMN IF NOT EXISTS vision_extracted_text TEXT;
ALTER TABLE membership_applications ADD COLUMN IF NOT EXISTS vision_validation_status TEXT;