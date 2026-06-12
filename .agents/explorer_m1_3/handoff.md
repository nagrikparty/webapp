# Handoff: M1 Auth & Admin God Mode

## 1. Observation
- In `src/components/AuthFlow.tsx` (lines 45-49), the `signUp` block performs authentication but does not insert a record into the `profiles` table:
  ```typescript
  if (step === "signup") {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    
    window.location.href = "/dashboard/volunteer";
  }
  ```
- In `src/components/AuthFlow.tsx` (lines 23-28), the `handleCheckEmail` function determines whether to route a user to "login" or "signup" by checking if their email exists in the `profiles` table. 
- In `src/components/AuthFlow.tsx` (lines 61-67), the `login` block routes users based purely on `profile?.role`, with no bypass check for `PUBLIC_ADMIN_EMAIL`.

## 2. Logic Chain
1. **Profiles Table Sync Issue:** Because `signUp` does not create a corresponding `profiles` row, a newly signed-up user will not exist in `profiles`. When they later return to enter their email, `handleCheckEmail` will incorrectly identify them as a new user (routing to "signup"). Re-submitting the signup form will then cause an "User already registered" Supabase error. 
2. **Fixing the Sync:** To resolve this, we must destructure `{ data: authData, error }` from `signUp` and use `authData.user.id` to perform an `upsert` into the `profiles` table immediately after a successful signup.
3. **Admin God Mode Bypass:** The task requires adding a `PUBLIC_ADMIN_EMAIL` check. By evaluating `email === import.meta.env.PUBLIC_ADMIN_EMAIL` in both `signup` and `login` handlers, we can unconditionally route the admin to `/dashboard/admin` regardless of the `profiles` table contents. If a user signs up with the admin email, their initial `role` should also be set to `"admin"` in the `profiles` table (otherwise `"volunteer"`).
4. **Role Routing:** Normal users will fall back to their correct role (`member` or `volunteer`) using the existing logic, which perfectly matches the "Route Volunteer to `/dashboard/volunteer`, Member to `/dashboard/member`" requirement.

## 3. Caveats
- **RLS Policies:** This fix assumes the Supabase database is configured to allow authenticated users to insert or upsert their own record into the `profiles` table. If RLS blocks this, a Database Trigger would be needed. But given the codebase scope, the frontend `upsert` is the intended fix.
- **Environment Variables:** `import.meta.env.PUBLIC_ADMIN_EMAIL` must be set in the deployment environment (e.g. `.env` file) for the bypass to function.

## 4. Conclusion
The problem is fully localized to the client-side authentication flow in `src/components/AuthFlow.tsx`. 

**Proposed Changes (`src/components/AuthFlow.tsx`):**
Modify the `handleAuth` method to:
1. Capture `authData` on `signUp` and upsert the new user into the `profiles` table (mapping email, id, and role).
2. Insert an `if (email === import.meta.env.PUBLIC_ADMIN_EMAIL)` check to route to `/dashboard/admin` in both the `signup` and `login` blocks.
3. Keep the existing routing fallbacks for `member` and `volunteer` for regular users.

## 5. Verification Method
1. Start the dev server (`npm run dev`) with `PUBLIC_ADMIN_EMAIL="admin@nagrikparty.in"` defined in `.env`.
2. Sign up with `admin@nagrikparty.in` and verify automatic routing to `/dashboard/admin`.
3. Sign up with a new test email (e.g., `test@example.com`) and verify routing to `/dashboard/volunteer`.
4. Refresh the page, enter `test@example.com` again, and verify that the system correctly routes to the **Login** step (proving the `profiles` table sync was successful).
