# Handoff Report: M1 Worker (register-member.ts) Implementation & Validation Strategy

## 1. Observation
- `PROJECT.md` specifies that `src/pages/api/register-member.ts` is responsible for handling file upload, calling the Vision API, and saving the application to the Supabase `membership_applications` table with a `pending` status.
- `SCOPE.md` specifies new fields required in `membership_applications`: `voter_id`, `identity_doc_url`, `declaration_agreed`, `status`, `vision_extracted_text`, `vision_validation_status`.
- `src/pages/api/vision/parse-id.ts` currently uses `@google/genai` (model `gemini-2.5-flash`) to extract Name, DOB, and ID Number into a JSON object, but does no validation against user inputs.
- `src/pages/api/signup.ts` currently handles base `membership_applications` inserts, showing the general pattern for interacting with Supabase.

## 2. Logic Chain
- The core problem is how `register-member.ts` should validate the text extracted from the identity document against the user's provided input.
- Traditional text matching (e.g., `extractedName === userName`) is brittle due to transliteration, typos, and date format variations (e.g. `12-05-1990` vs `12/05/1990`).
- Because `@google/genai` is capable of semantic reasoning, we can perform both extraction and fuzzy validation in a single API call by passing the user's input alongside the document image in the prompt.
- The registration flow is designed to insert a `pending` record regardless of the validation outcome, capturing the `vision_validation_status` to empower the Admin Verification stage (M2) to make the final decision.
- Therefore, the endpoint must parse the multipart form data, ask Gemini to validate, upload the file to Supabase storage, and insert the final record into Supabase.

## 3. Caveats
- Passing base64 images to Gemini in every request could introduce latency. The frontend needs loading states.
- The Supabase storage bucket (`identity_documents`) must be created and accessible (with appropriate RLS policies) before this endpoint can successfully upload files.
- The implementation assumes the `membership_applications` table schema in Supabase has been updated with the new columns.

## 4. Conclusion

**Implementation Strategy for `register-member.ts`:**

1. **Parse FormData**: Extract user inputs (`full_name`, `dob`, `voter_id`, `lok_sabha`, etc.) and the uploaded document `file`.
2. **Prepare File**: Convert the `File` to an `ArrayBuffer` and then to a Base64 string for Gemini.
3. **Extraction & Validation (Single Step via @google/genai)**:
   - Instantiate `GoogleGenAI`.
   - Pass the Base64 image and a semantic prompt containing the user inputs.
   - **Prompt Example**: *"You are an identity validation assistant. Below is an identity document and the user's provided details: Name: [{full_name}], DOB: [{dob}], ID Number: [{voter_id}]. Tasks: 1) Extract the actual Name, DOB, and ID Number from the image. 2) Compare them against the user's provided details. Allow for minor variations (typos, date formats, translations). 3) Determine if it's a match. Return ONLY a valid JSON object: `{ "extracted": { "name": "...", "dob": "...", "idNumber": "..." }, "isValid": boolean, "reason": "..." }`."*
   - Execute using `gemini-2.5-flash` with `responseMimeType: "application/json"`.
4. **Storage Upload**: Upload the file buffer to Supabase storage (e.g., `identity_documents` bucket) to obtain the `identity_doc_url`.
5. **Database Insert**: Insert the record into `membership_applications` with:
   - Base fields: `full_name`, `lok_sabha`, `vidhan_sabha`, `ward`, `email`.
   - M1 fields: `voter_id`, `declaration_agreed`.
   - Vision fields: `vision_extracted_text` (store the JSON string of `extracted`), `vision_validation_status` (store `success` if `isValid` is true, else `failed`), `identity_doc_url`.
   - State: `status: 'pending'`.
6. **Return Response**: Return a 200 OK or appropriate error codes for failures.

## 5. Verification Method (Testing Strategy)

**How to verify this implementation:**
1. **Mocking/Unit Tests**:
   - Create a test script that mocks `@google/genai` to return static JSON. Assert that the `vision_validation_status` correctly maps `isValid: true` to `success` and `isValid: false` to `failed`.
2. **End-to-End / Live Tests**:
   - Provide a dummy ID image and exact matching form details. Ensure it writes to DB with `vision_validation_status: 'success'`.
   - Provide a dummy ID image and slightly varying form details (e.g., "Ram Kumar" vs "Ramkumar"). Ensure Gemini's semantic matching flags it as valid and `vision_validation_status: 'success'`.
   - Provide a dummy ID image and completely mismatched details. Ensure it writes to DB with `vision_validation_status: 'failed'`.
   - Verify the image is accessible via the generated `identity_doc_url` in Supabase Storage.
