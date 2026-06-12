# Handoff Report

## 1. Observation
- In `src/pages/api/sync-profile.ts`, the user's token is securely verified via `supabase.auth.getUser(token)`.
- The user's role is correctly determined on the server using a case-insensitive email check against `PUBLIC_ADMIN_EMAIL` and the `membership_applications` table.
- However, the `upsert` on line 47 uses the `supabase` singleton client. This client is initialized with the anonymous publishable key and does not have the user's session attached to it (`getUser` does not mutate the client's session state).
- In `src/components/AuthFlow.tsx`, the `handleCheckEmail` function checks if the email exists in `profiles` using `supabase.from("profiles").select("id").eq("email", email).maybeSingle()`.
- The `npm run build` and `npm run check` commands were executed and passed successfully.

## 2. Logic Chain
1. **Case-Insensitivity Bug in `AuthFlow.tsx`**: The `sync-profile.ts` API stores emails in the `profiles` table as lowercase (`userEmail = user.email.toLowerCase()`). In `AuthFlow.tsx`, the email is passed directly from input without lowercasing in the `.eq("email", email)` query. Because PostgreSQL `eq` is case-sensitive, a user typing `Email@Example.com` will not be found in `profiles` and will be pushed to the "signup" flow. Supabase Auth will then reject the signup with "User already registered" (since it normalizes casing internally). This blocks login for users with mixed-case input.
2. **Anonymous Upsert Bug in `sync-profile.ts`**: Because the singleton `supabase` client is used for the database `upsert`, the operation executes anonymously (without an `Authorization` header containing the user's token). If Row Level Security (RLS) is enabled to protect the `profiles` table (e.g., `id = auth.uid()`), this upsert will be rejected by the database. To perform the upsert securely under the user's context, a scoped Supabase client must be instantiated with the user's token.

## 3. Caveats
- I cannot verify the database RLS policies since I do not have direct DB access. If RLS is completely disabled, the `sync-profile.ts` anonymous upsert might technically work, but this would be a severe security vulnerability as anyone could spoof an upsert. Assuming best practices, RLS is enabled and the anonymous upsert will fail.
- `maybeSingle()` on `membership_applications` will throw an error if a user has multiple application rows. Adding `.limit(1)` would make this more robust.

## 4. Conclusion
**Verdict: FAIL (REQUEST_CHANGES)**

The worker successfully moved the logic to the server, preventing clients from dictating their own role. However, two critical issues remain:
1. **Login Blocker**: `AuthFlow.tsx` fails to handle mixed-case emails, blocking existing users from logging in if they use uppercase letters.
2. **Server-Side Authentication Context**: The server-side upsert in `sync-profile.ts` uses an unauthenticated client. This will fail against a properly configured database with Row Level Security.

## 5. Verification Method
- **Case-Insensitivity**: In `AuthFlow.tsx`, modify line 23 to `eq("email", email.toLowerCase())`.
- **Authenticated Client**: In `sync-profile.ts`, create a scoped client for the upsert:
  ```typescript
  const scopedClient = createClient(import.meta.env.PUBLIC_SUPABASE_URL, import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } }
  });
  const { error: upsertError } = await scopedClient.from("profiles").upsert({ ... });
  ```
