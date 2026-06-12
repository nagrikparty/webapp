# Handoff Report: M1 ECI-Compliant Registration

## 1. Observation
- `src/components/SignupForms.tsx` currently contains a single-page `MembershipForm`. It uploads the ID directly to Supabase Storage from the client-side and then calls `/api/signup` or directly inserts to `membership_applications` with status `"submitted"`.
- `src/pages/api/vision/parse-id.ts` exists and extracts ID details using `@google/genai` but does not save anything to the database.
- `src/pages/api/register-member.ts` does not exist yet.
- `src/pages/membership.astro` imports `MembershipForm` from `SignupForms`.
- `SCOPE.md` explicitly requires:
  - A multi-step form.
  - DB `status` should be `"pending"`.
  - Registration API (`/api/register-member`): Handles file upload, calls Vision API, saves to DB.
  - `membership_applications` DB table requires fields: `voter_id`, `identity_doc_url`, `declaration_agreed`, `status`, `vision_extracted_text`, `vision_validation_status`.

## 2. Logic Chain
- **Frontend Component (`src/components/RegistrationForm.tsx`)**: Needs to be created as a multi-step React component (e.g., Step 1: Personal, Step 2: Address, Step 3: ID & Declarations). It will collect all inputs including the `File` object and submit them via `FormData` to the new `/api/register-member` endpoint. We should then update `src/pages/membership.astro` to use this new component instead of `SignupForms`.
- **Backend API (`src/pages/api/register-member.ts`)**: Must be created to accept `multipart/form-data`. It will:
  1. Extract form fields and the uploaded ID file.
  2. Upload the file to Supabase Storage (e.g., `documents` bucket) server-side to obtain `identity_doc_url` (preventing orphaned files from client drop-offs).
  3. Call the Vision API using `@google/genai` (similar to `parse-id.ts`) to validate the ID.
  4. Insert a new record into `membership_applications` with the provided data, `status: "pending"`, and Vision API extraction results.
- **Database Schema (Supabase)**: The `membership_applications` table needs schema adjustments to align with `SCOPE.md`. Since there are no `.sql` migration files in the repo, these will likely need to be applied via the Supabase Dashboard. We must ensure columns `voter_id`, `identity_doc_url`, `declaration_agreed`, `vision_extracted_text`, and `vision_validation_status` exist.

## 3. Caveats
- The current `MembershipForm` calls `/api/vision/parse-id` to provide real-time validation to the user right when they select the file. If `/api/register-member` handles the Vision API call *only upon final submission*, the user won't see ID validation errors until the end of the form. To maintain UX, the implementer might still call `parse-id.ts` for immediate frontend feedback, but `/api/register-member` MUST still perform the authoritative Vision extraction and storage to prevent bypassing validation.
- Ensure Supabase service role keys or appropriate RLS bypasses are configured if the API route inserts directly into `membership_applications` server-side.

## 4. Conclusion
To implement M1, create `src/components/RegistrationForm.tsx` (a multi-step form) and `src/pages/api/register-member.ts` (a backend endpoint handling file upload, Vision validation, and database insertion). Update `src/pages/membership.astro` to consume the new form. Lastly, update the Supabase `membership_applications` table to include the required ECI-compliant fields.

## 5. Verification Method
- **Static**: Verify `src/components/RegistrationForm.tsx` and `src/pages/api/register-member.ts` exist. Ensure `membership.astro` imports `RegistrationForm`.
- **Functional**: Start the dev server, navigate to `/membership`, fill out the multi-step form, and submit with a valid ID image.
- **Database**: Check the Supabase `membership_applications` table to ensure a new row is created with `status = 'pending'`, and that `voter_id`, `identity_doc_url`, and `vision_validation_status` are correctly populated.
