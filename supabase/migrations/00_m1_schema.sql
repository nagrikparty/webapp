CREATE TABLE IF NOT EXISTS membership_applications (
    id TEXT PRIMARY KEY,
    full_name TEXT,
    email TEXT,
    parent_or_spouse_name TEXT,
    date_of_birth DATE,
    address TEXT,
    lok_sabha TEXT,
    vidhan_sabha TEXT,
    ward TEXT,
    voter_id TEXT, -- Also known as EPIC number
    aadhaar_number TEXT,
    identity_doc_url TEXT,
    declaration_agreed BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'pending',
    vision_extracted_text TEXT,
    vision_validation_status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
