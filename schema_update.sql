ALTER TABLE membership_applications
ADD COLUMN voter_id TEXT,
ADD COLUMN identity_doc_url TEXT,
ADD COLUMN declaration_agreed BOOLEAN DEFAULT false,
ADD COLUMN vision_extracted_text JSONB,
ADD COLUMN vision_validation_status TEXT;

-- Note: The `status` column might already exist as it was being set to "submitted", but if we need to alter it:
-- ALTER TABLE membership_applications ADD COLUMN status TEXT DEFAULT 'pending';
