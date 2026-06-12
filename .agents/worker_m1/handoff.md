# Observation
- Verified that `src/components/RegistrationForm.tsx` needed to be created. Created a multi-step React component that builds a `FormData` payload and submits to `/api/register-member`.
- Created `src/pages/api/register-member.ts` handling `multipart/form-data`, extracting the `file`, uploading to Supabase if configured or using base64. It initializes `@google/genai` and validates the ID image/PDF against the submitted `voter_id`, updating `vision_extracted_text` and `vision_validation_status`. It stores the record in the `membership_applications` Supabase table.
- Updated `src/pages/membership.astro` to remove `<MembershipForm />` and replace it with `<RegistrationForm client:load />`.
- Created `supabase/migrations/00_m1_schema.sql` defining the new columns for `membership_applications`.
- Verified Astro compilation succeeded via `npm run check`.

# Logic Chain
1. To meet ECI compliance, we need a 3-step registration capturing Personal, Address, and ID info.
2. The user's uploaded ID document must be saved (Supabase storage or base64 fallback) and verified on the server-side with Gemini Vision to ensure it aligns with the application (matching ID).
3. The server endpoint handles data insertion directly so the client doesn't need API keys or complex logic.
4. The migration SQL specifies exactly what columns need to exist (`voter_id`, `identity_doc_url`, `declaration_agreed`, `status`, `vision_extracted_text`, `vision_validation_status`) to align with the frontend and backend.

# Caveats
- Supabase storage defaults to uploading to the `"documents"` bucket. Ensure the `"documents"` bucket exists and has correct RLS policies for inserts.
- Gemini Vision checks if the ID roughly matches the provided `voter_id`. Further fine-tuning might be needed for perfect extraction accuracy.

# Conclusion
The ECI-compliant registration multi-step form is implemented, the backend endpoint handles file uploads and Vision validation, the DB schemas are documented, and the frontend page incorporates the new form component.

# Verification Method
1. Start the application locally using `npm run dev`.
2. Navigate to `/membership` and fill out the multi-step form.
3. In Step 3, upload a valid dummy ID image.
4. Click Submit, wait for the processing to finish, and observe the "Application Received" state.
5. In Supabase (or mock), verify that the `membership_applications` table contains a new record with `status='pending'` and populated vision validation fields.
6. Check `supabase/migrations/00_m1_schema.sql` for correct column definitions.
