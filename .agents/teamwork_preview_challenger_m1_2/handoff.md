# Challenge Summary

**Overall risk assessment**: HIGH
**Verdict**: FAIL

## 1. Observation
1. **Partial Data Processing**: The backend API (`src/pages/api/register-member.ts`) only checks for the existence of `file` and `voterId`. All other fields (`name`, `email`, `dob`, `address`, `lok_sabha`, etc.) are blindly extracted from `FormData` and inserted into the `membership_applications` table.
2. **Missing Database Constraints**: The `schema_update.sql` and `00_m1_schema.sql` files show that the `membership_applications` table lacks `NOT NULL` constraints on critical fields like `full_name`, `email`, `date_of_birth`, and `address`.
3. **Large File Handling**: In `src/pages/api/register-member.ts`, the file is loaded entirely into memory and converted to Base64:
   ```typescript
   const buffer = await file.arrayBuffer();
   const base64 = Buffer.from(buffer).toString("base64");
   ```
4. **Empirical Evidence**: Submitting a 50MB file using a Node `fetch` script resulted in the connection being abruptly terminated (`Fetch.onAborted`) and an internal 500 error from the dev server, indicating that the server cannot handle large files due to memory buffer spikes or payload limits (Cloudflare/Astro/Gemini).

## 2. Logic Chain
1. Because the backend does not validate required personal details, any user (or bot) bypassing the frontend can submit an application with only an ID file and Voter ID, leaving `name` and `email` blank.
2. Because the database lacks `NOT NULL` constraints, these empty/null records are successfully saved, bypassing business logic and polluting the system with unidentifiable applications.
3. Because the API reads the entire uploaded file into an `ArrayBuffer` and converts it to a Base64 string in memory, a large file (e.g., 50MB) causes a massive memory spike. The resulting string is ~66MB. This violates payload size limits for the Gemini Vision API and Cloudflare Workers, causing the connection to drop or crash (HTTP 500) before a proper error message can be returned.

## 3. Caveats
- The frontend multi-step form enforces HTML5 validation (`required`), so a normal user using the UI as intended might be blocked from advancing steps with empty data. However, security boundaries should not rely solely on DOM-based frontend validation.
- The exact failure mode for large files (OOM vs payload limit) depends on the hosting environment (Cloudflare Workers vs local Node), but both result in unhandled 500 errors or dropped connections.

## 4. Conclusion
The gate should **FAIL**. The registration endpoint is vulnerable to partial/invalid data submissions and lacks file size limits or streaming, causing it to crash on extremely large file uploads.

## 5. Verification Method
- **To verify partial data**: Send a raw POST request to `/api/register-member` containing only `file` and `voter_id` using `curl` or Postman. Observe that the API returns `{ success: true, id: ... }` and the database contains a record with null values for name/email.
- **To verify large files**: Create a 50MB dummy file and upload it to the `/api/register-member` endpoint. Observe that the request fails with a connection termination or HTTP 500 rather than a graceful HTTP 413 Payload Too Large error.
