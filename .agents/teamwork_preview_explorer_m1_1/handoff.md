# Handoff: Milestone 1 - ECI-Compliant Registration

## 1. Observation
- `src/components/SignupForms.tsx` contains `MembershipForm`, which is currently a single-step, monolithic form. It handles Supabase uploads and DB inserts directly from the client.
- The form currently verifies IDs by making a client-side call to `src/pages/api/vision/parse-id.ts` and inserts records with `status: "submitted"`.
- `src/pages/api/vision/parse-id.ts` uses `@google/genai` with `gemini-2.5-flash` to extract JSON from identity documents.
- `src/pages/api/register-member.ts` does not exist yet.
- `PROJECT.md` and `SCOPE.md` specify that the backend (`/api/register-member`) should handle file uploads, run the Vision API, and insert into the `membership_applications` DB with `status: 'pending'`. Required new DB fields include `voter_id`, `identity_doc_url`, `declaration_agreed`, `status`, `vision_extracted_text`, and `vision_validation_status`.

## 2. Logic Chain
- **Security & Data Flow Fix**: To follow the required architecture, client-side DB inserts and Storage uploads in `MembershipForm` must be stripped out. The form should just collect data and `POST` everything (including the ID file) via `FormData` to `/api/register-member`.
- **Frontend Refactor**: `MembershipForm` must be broken into a multi-step component (e.g., Step 1: Personal details, Step 2: Address details, Step 3: ID Upload & Declarations) to satisfy the "Multi-step frontend form" requirement.
- **Backend Endpoint Creation**: `register-member.ts` needs to be created. It must:
  1. Receive the FormData.
  2. Execute the Vision API extraction on the server (by moving or importing the logic from `parse-id.ts`).
  3. Validate the Vision API results against the user's submitted Name, DOB, and EPIC number to compute `vision_validation_status`.
  4. Upload the document to Supabase storage on the server side.
  5. Insert the application record into the database with `status: 'pending'` and the newly required fields (mapping `epic` to `voter_id` or similar depending on the existing schema).

## 3. Caveats
- **Supabase Permissions**: The frontend currently uses a public `supabaseUrl` and `supabaseKey`. Depending on Row-Level Security (RLS), the new backend endpoint may require a `SUPABASE_SERVICE_ROLE_KEY` to insert into the `membership_applications` table and `documents` bucket securely.
- **`parse-id.ts` Retirement**: `parse-id.ts` will become redundant for the registration flow. It could either be deleted, or its core Gemini logic can be refactored into a reusable helper function in `src/lib/vision.ts` which both endpoints can call.
- **Database Schema**: The actual Supabase schema isn't fully defined locally (no SQL files). Ensure you pass the exact fields outlined in `SCOPE.md` (`voter_id`, `identity_doc_url`, `declaration_agreed`, `status`, `vision_extracted_text`, `vision_validation_status`).

## 4. Conclusion
The Worker should implement M1 by:
1. Converting `MembershipForm` in `SignupForms.tsx` to a multi-step form and changing its submit handler to send a single `POST` request to `/api/register-member`.
2. Creating `src/pages/api/register-member.ts` which securely handles the file upload, uses the Gemini Vision API to parse the ID, calculates the `vision_validation_status` by comparing against form input, saves the file to Supabase storage, and inserts a `pending` application record into the database.

## 5. Verification Method
1. Run the local dev server (`npm run dev`) and complete the multi-step `MembershipForm`.
2. Ensure no client-side calls are made directly to Supabase; observe a single `POST` to `/api/register-member`.
3. Check the response to ensure a successful registration.
4. Verify in the Supabase backend (or log outputs) that the `membership_applications` record was inserted with `status: 'pending'` and that `vision_validation_status` successfully evaluated the document against the form fields.
