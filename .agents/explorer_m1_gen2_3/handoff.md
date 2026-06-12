# Handoff Report: M1 Auth & Admin God Mode

**Core Finding:** The current auth implementation directly checks `PUBLIC_ADMIN_EMAIL` on the client side and passes the `role` directly into a Supabase `profiles` table upsert, which is insecure and hardcodes "volunteer" for all non-admins. A new server-side API endpoint (`/api/auth/sync`) is needed to perform these checks securely.

## 1. Observation
- `src/components/AuthFlow.tsx` handles both signup and login. 
- Lines 51-52 hardcode the admin check client-side:
  ```typescript
  const role = email === import.meta.env.PUBLIC_ADMIN_EMAIL ? "admin" : "volunteer";
  await supabase.from("profiles").upsert({ id: user.id, email, role });
  ```
- Similarly, in the login flow (lines 61-75), it checks `email === import.meta.env.PUBLIC_ADMIN_EMAIL` again. 
- The client-side approach misses checking the `membership_applications` table completely (defaults to volunteer).
- `.env.example` does not currently list `ADMIN_EMAIL` or `SUPABASE_SERVICE_ROLE_KEY`.

## 2. Logic Chain
1. **Security Risk:** Because `PUBLIC_ADMIN_EMAIL` is exposed to the Vite client, anyone could theoretically spoof the check or bypass it by executing a raw Supabase insert with `role: "admin"`.
2. **Server-side Requirement:** To securely set the profile role, we must calculate the role on the server using an Astro API route (`src/pages/api/auth/sync.ts`) after `supabase.auth.signInWithPassword` / `signUp` succeeds.
3. **Role Determination:** 
   - Check if the user email (case-insensitive `toLowerCase()`) matches a server-only `ADMIN_EMAIL`.
   - If not admin, query `membership_applications` case-insensitively using `.ilike('email', user.email)` to determine if they are a "member".
   - Fall back to "volunteer".
4. **Profile Upsert:** Execute the `profiles` upsert within this server API endpoint, ideally using a `SUPABASE_SERVICE_ROLE_KEY` to bypass any restrictive RLS.
5. **Client Modification:** Remove the upsert from `AuthFlow.tsx`. Instead, `POST` the session's `access_token` to `/api/auth/sync`, receive the `role`, and redirect to `/dashboard/${role}`.

## 3. Caveats
- `SUPABASE_SERVICE_ROLE_KEY` needs to be added to `.env` (and `.env.example`) to allow the server API to bypass RLS policies on the `profiles` table. If the project isn't using strict RLS yet, the fallback to `PUBLIC_SUPABASE_PUBLISHABLE_KEY` in the API route will work temporarily but is less secure.
- We rely on `membership_applications` having the email to identify members. If they haven't filled out the `MembershipForm` first, they will default to volunteer.
- `AuthFlow.tsx` has two duplicate paths for login and signup. Both need to be updated to call the new `/api/auth/sync` route.

## 4. Conclusion
We must implement a secure, server-side route for profile synchronization. 

**Proposed Actions for Implementer:**
1. Create `src/pages/api/auth/sync.ts` using the proposed code located at `c:\Users\hudav\Documents\GitHub\webapp\.agents\explorer_m1_gen2_3\proposed_sync.ts`.
2. Modify `src/components/AuthFlow.tsx`:
   - Replace the `if (authData.user)` blocks in both `login` and `signup` logic with a call to the new API endpoint:
     ```typescript
     if (authData.user && authData.session) {
       const res = await fetch("/api/auth/sync", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ access_token: authData.session.access_token })
       });
       const { role } = await res.json();
       window.location.href = `/dashboard/${role}`;
     }
     ```
3. Update `.env.example` and the actual `.env` file to replace `PUBLIC_ADMIN_EMAIL` with `ADMIN_EMAIL` (server-only) and optionally document the need for `SUPABASE_SERVICE_ROLE_KEY`.
4. Ensure `AuthFlow.tsx` no longer relies on `import.meta.env.PUBLIC_ADMIN_EMAIL`.

## 5. Verification Method
1. `npm run check` and `npm run build` should pass.
2. Ensure no instances of `PUBLIC_ADMIN_EMAIL` exist in the `src/` directory: `Get-ChildItem -Recurse -File src/ | Select-String "PUBLIC_ADMIN_EMAIL"`.
3. Start the dev server (`npm run dev`) and test signing up with an email that is present in `membership_applications`. It should route to `/dashboard/member`.
4. Test signing up with the exact `ADMIN_EMAIL` (but with different casing, e.g. `AdMin@eXample.com`). It should route to `/dashboard/admin`.
