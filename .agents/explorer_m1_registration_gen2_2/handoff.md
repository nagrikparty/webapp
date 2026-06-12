# Handoff Report: M1 ECI-Compliant Registration

## 1. Observation
- **Frontend (`src/components/SignupForms.tsx`)**: The `MembershipForm` component currently renders a single-step React form. It directly handles identity document uploads to Supabase Storage and performs the database insertion to `membership_applications` directly from the client. It also provides real-time document validation by making a POST request to an existing Vision API endpoint (`/api/vision/parse-id`).
- **Backend (`src/pages/api/register-member.ts`)**: This requested file does not currently exist.
- **Database Schema (`membership_applications`)**: Based on the insert statement in `SignupForms.tsx`, the code currently assumes fields like `id_document_url`, `status` (currently set to `"submitted"`), and `epic_number`. However, `PROJECT.md` and `SCOPE.md` mandate new fields: `voter_id`, `identity_doc_url`, `declaration_agreed`, `status` (must be `"pending"`), `vision_extracted_text`, and `vision_validation_status`.
- **Schema Management**: There are no `.sql` migration files in the workspace (Supabase schema seems to be managed externally or through the UI).

## 2. Logic Chain
1. **Frontend UI Upgrade**: To fulfill the "Multi-step form" requirement for M1, `MembershipForm` in `src/components/SignupForms.tsx` must be converted into a multi-step wizard using React state (`step`, `setStep`). A suggested flow:
    - Step 1: Personal Info (Name, Email, Parent, DOB)
    - Step 2: Location (Lok Sabha, Vidhan Sabha, Ward, Address, EPIC/Voter ID)
    - Step 3: Identity Upload & Declarations
2. **Frontend-to-Backend Migration**: To fulfill the interface contract "Registration API (`/api/register-member`): Handles file upload, calls Vision API, saves to DB", the frontend must **stop** making direct Supabase storage and DB calls on submit. The final step of the multi-step form should pack all inputs into a `FormData` object (including the file) and `POST` to `/api/register-member`.
3. **Backend Route Creation**: A new Astro API endpoint (`src/pages/api/register-member.ts`) needs to be created.
    - It must receive the `FormData`.
    - It must upload the file to Supabase storage (`documents` bucket).
    - It must call the Gemini Vision API (similarly to how `parse-id.ts` does it) to validate the document server-side.
    - It must insert the record into `membership_applications` with `status: 'pending'`, `declaration_agreed: true`, `identity_doc_url`, `vision_extracted_text`, and `vision_validation_status`.
4. **Database Schema Adaptation**: The `membership_applications` table in Supabase must be modified to support the new fields defined by M1 (`voter_id`, `identity_doc_url`, `declaration_agreed`, `vision_extracted_text`, `vision_validation_status`).

## 3. Caveats
- **Real-Time Validation UX vs. Backend Authority**: The current UI gives instant feedback when a document is uploaded by calling the existing `/api/vision/parse-id`. Moving the *authoritative* vision check and file upload to the final form submit means the user won't see verification errors until they submit. The implementer can retain the real-time check for UX but *must* perform the authoritative upload and validation in the backend.
- **Supabase Role/RLS Constraints**: If RLS policies restrict anonymous users from inserting backend-only fields like `vision_validation_status`, the new endpoint (`register-member.ts`) might need to use a Supabase Service Role Key rather than the default `PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- **Schema Migrations**: Since no SQL migrations exist in the repo, schema changes will need to be applied manually to the Supabase instance by the user, or an explicit SQL snippet should be provided to them.

## 4. Conclusion
To complete the M1: ECI-Compliant Registration milestone, the implementer must:
1. Refactor `src/components/SignupForms.tsx` (`MembershipForm`) into a multi-step form.
2. Change the form submission to `POST` a `FormData` object (containing the file and all fields) to `/api/register-member`.
3. Create `src/pages/api/register-member.ts` to handle the file upload, run the server-side Vision API validation, and insert the `"pending"` record.
4. Define the necessary schema updates for the `membership_applications` table to accommodate the new fields.

## 5. Verification Method
- **Code Review**: Verify `src/components/SignupForms.tsx` implements state-driven steps and that the `submit` function issues a `fetch` POST to `/api/register-member`.
- **Backend Check**: Verify `src/pages/api/register-member.ts` successfully parses `FormData`, uploads to Supabase, invokes `@google/genai`, and inserts into DB.
- **End-to-End Test**:
  1. Build/run the project (`npm run dev`).
  2. Visit `/membership`, go through the multi-step form, upload a sample ID, and submit.
  3. Verify the browser's Network tab shows a successful POST request to `/api/register-member`.
  4. Inspect the Supabase dashboard to verify a new record exists with `status = 'pending'`, `declaration_agreed = true`, and the expected Vision API JSON data.
