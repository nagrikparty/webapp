# Handoff Report: M1 ECI-Compliant Registration

## Observation
- `SCOPE.md` and `PROJECT.md` require: A multi-step form for registration, a Vision API integration for ID validation, DB records with a `'pending'` status, and a new `src/pages/api/register-member.ts` API.
- The existing codebase uses a single-step `MembershipForm` located in `src/components/SignupForms.tsx` (lines 89-224). 
- `MembershipForm` directly inserts data into Supabase with `status: "submitted"`, bypassing backend validation, and does not capture the new required fields.
- The `membership_applications` table interface must be updated with new fields: `voter_id`, `identity_doc_url`, `declaration_agreed`, `status` ('pending'), `vision_extracted_text`, and `vision_validation_status`.
- Currently, `src/pages/membership.astro` imports `<MembershipForm />` from `src/components/SignupForms.tsx`.
- The Vision parsing logic already exists in `src/pages/api/vision/parse-id.ts` and successfully processes Aadhaar/EPIC via Gemini 2.5 Flash.

## Logic Chain
1. **Frontend Refactor**: `MembershipForm` must be extracted from `SignupForms.tsx` into a new file `src/components/RegistrationForm.tsx`. It needs to be converted into a multi-step form:
   - **Step 1**: Personal Info (Name, Email, Parent, DOB, Voter ID)
   - **Step 2**: Location (Lok Sabha, Assembly, Ward, Address)
   - **Step 3**: Document Upload (File input for Aadhaar/Voter ID)
   - **Step 4**: Declarations (3 checkboxes) & Submit
2. **Backend Consolidation**: To ensure security and comply with `SCOPE.md` ("Registration API handles file upload, calls Vision API, saves to DB"), the direct client-side DB insert (`supabase.from("membership_applications").insert(...)`) must be removed. Instead, the multi-step form will bundle the data and the `File` object into a `FormData` payload and POST it to the new `src/pages/api/register-member.ts`.
3. **API Implementation (`register-member.ts`)**:
   - Parse the `FormData`.
   - Upload the ID document file to the Supabase `documents` bucket securely.
   - Invoke the Vision API (`@google/genai` logic similar to `parse-id.ts`) to validate the document.
   - Map `epic_number` to `voter_id`, and `id_document_url` to `identity_doc_url` (or just use the new ones).
   - Insert the record into `membership_applications` with `status: "pending"`, `declaration_agreed: true`, `vision_extracted_text`, and `vision_validation_status`.
4. **Integration**: `src/pages/membership.astro` must be updated to import and mount `RegistrationForm` instead of `MembershipForm`.
5. **Schema Updates**: The developer will need to manually execute SQL or use the Supabase dashboard to add the new fields to the `membership_applications` table.

## Caveats
- **Supabase Edge Cases**: `register-member.ts` should gracefully handle environments where Supabase is not configured (e.g. by falling back or returning a clean error), as seen in the current `MembershipForm` logic.
- **UX Tradeoff**: Currently `MembershipForm` calls `parse-id.ts` on file selection for instant UI feedback. The implementer can choose to retain this for UX, but MUST ensure the new `/api/register-member` also validates via Vision on the backend to prevent spoofing. Or, for simplicity, they can move the Vision call entirely to the final submission.
- **DB Migrations**: There are no local Supabase migrations (`supabase/migrations`) tracked in version control. The schema changes will need to be communicated or applied directly to the Supabase project.

## Conclusion
To fulfill M1:
1. Document the required `membership_applications` table schema changes.
2. Create `src/pages/api/register-member.ts` to handle file upload to storage, call Gemini Vision API, and insert into Supabase with `status='pending'` and the new ECI fields.
3. Extract `MembershipForm` from `src/components/SignupForms.tsx` into `src/components/RegistrationForm.tsx`, turning it into a 4-step UI that posts `FormData` to `/api/register-member`.
4. Update `src/pages/membership.astro` to use `RegistrationForm`.

## Verification Method
1. **Code checks**: Verify `src/components/RegistrationForm.tsx` has state logic for steps (e.g., `step === 1`, etc.). Verify `src/pages/api/register-member.ts` exists and handles the `POST` request.
2. **Build and test**: Run `npm run build` to ensure Astro and TypeScript compile successfully with the new endpoints and components.
3. **End-to-End Test**: Run `npm run dev`, navigate to `/membership`, fill out the multi-step form with a sample ID image, and confirm the network request successfully hits `/api/register-member`. Verify the new record appears in the Supabase `membership_applications` table with `status='pending'` and populated `vision_extracted_text`.
