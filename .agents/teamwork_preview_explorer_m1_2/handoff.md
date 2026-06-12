# Handoff Report: Database and File Storage Integration for M1

## Observation
1. **SCOPE.md and PROJECT.md**: Require the creation of a new `/api/register-member.ts` endpoint that handles file upload, calls the Vision API, and saves to the database. The `membership_applications` table must be updated with new fields: `voter_id`, `identity_doc_url`, `declaration_agreed`, `status`, `vision_extracted_text`, `vision_validation_status`. The frontend `MembershipForm` must be converted to a multi-step form.
2. **Current Database Implementation (`src/components/SignupForms.tsx`)**: 
   - Currently, file upload to the `documents` bucket happens directly on the client side (line ~128).
   - Document validation happens via a separate `POST` to `/api/vision/parse-id` (line ~112) *before* form submission.
   - Database insertion also happens directly on the client side using the frontend `supabase` client (line ~150).
3. **Missing Schema Migration**: There are no `.sql` migration files in the repository. The application currently expects the database to be manually managed by the user via the Supabase dashboard.

## Logic Chain
1. **Security & Data Integrity**: Moving the file upload and database insertion from the client to the new `/api/register-member.ts` endpoint is required by the project scope. This secures the endpoint by preventing users from bypassing the Vision API validation and manually inserting unverified records into the DB.
2. **Database Schema**: The requested fields (`voter_id`, `identity_doc_url`, `declaration_agreed`, `status`, `vision_extracted_text`, `vision_validation_status`) do not perfectly match the existing columns (like `epic_number` and `id_document_url`). The database schema must be updated to include these specific columns to fulfill the Interface Contract.
3. **Frontend Multi-Step Flow**: The multi-step form will need to aggregate state across all steps (Personal Details, Location, Document Upload & Declarations) before dispatching a single `multipart/form-data` POST request to `/api/register-member.ts`.
4. **Vision Integration**: The new endpoint should mimic the logic currently inside `/api/vision/parse-id.ts`, feeding the file buffer to Google GenAI and storing the response in the new `vision_extracted_text` and `vision_validation_status` columns.

## Caveats
- No Supabase service role key (`SUPABASE_SERVICE_ROLE_KEY`) is present in `.env`. The backend endpoint will use the anon key (`PUBLIC_SUPABASE_PUBLISHABLE_KEY`) via `src/lib/supabase.ts` for database inserts and storage uploads. Since Astro runs API routes server-side, credentials are not leaked, but RLS policies must continue to allow anon inserts.
- It is assumed that `epic_number` corresponds to the new `voter_id` field.
- The Worker will need to provide raw SQL instructions for the user to execute, as there is no automated migration framework.

## Conclusion
**Step-by-step strategy for the Implementer:**
1. **Provide SQL Schema Updates**: Create a `.sql` file or provide snippet instructions to add the required fields to the `membership_applications` table.
2. **Build `/api/register-member.ts`**:
   - Parse `multipart/form-data` (form fields + `file`).
   - Read the file buffer and send it to Google GenAI for validation (adapting logic from `/api/vision/parse-id.ts`).
   - Upload the file to the `documents` Supabase bucket from the server using `await file.arrayBuffer()`.
   - Insert the aggregated record into `membership_applications` with `status: 'pending'`, mapped fields (`voter_id`, `identity_doc_url`, `declaration_agreed` = true), and the vision text/status.
3. **Refactor `SignupForms.tsx`**:
   - Convert `MembershipForm` to a React multi-step wizard (e.g., Step 1: Info, Step 2: Location, Step 3: Document & Declarations).
   - Remove direct client-side DB inserts and file uploads.
   - On final submit, append all state to `FormData` and POST to `/api/register-member`.

## Verification Method
1. Inspect `src/pages/api/register-member.ts` to ensure it parses `FormData`, calls GenAI, uploads to Supabase storage, and inserts the record securely on the backend.
2. Inspect `src/components/SignupForms.tsx` to verify the multi-step UI flow and ensure it submits a unified `FormData` payload.
3. Use a standard `npm run build` and `npm run preview` to confirm no type or build errors exist.
