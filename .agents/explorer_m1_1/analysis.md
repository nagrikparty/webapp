# Implementation Strategy Analysis: Digital Member Portal (Milestones R1 - R4)

## Executive Summary
This report analyzes the requirements for **R1 (Magic Link Auth & Dashboard)**, **R2 (Digital ID Card)**, **R3 (Razorpay Donations)**, and **R4 (Party Referral System)**, detailing the implementation strategy across the codebase. It details changes required for `src/components/AuthFlow.tsx`, `src/components/MemberDashboard.tsx`, `src/pages/api/sync-profile.ts`, and the new API endpoint `src/pages/api/donations.ts`. Additionally, it defines the root causes and exact solutions for the three failing E2E test scenarios.

---

## 1. Requirement Analysis & Implementation Strategy

### R1: Magic Link Auth & Dashboard
* **Goal**: Enable passwordless magic link (Email OTP) authentication and display circulars and volunteer tasks on the member dashboard.
* **Component `src/components/AuthFlow.tsx` Changes**:
  - **Magic Link Request**: In `handleSubmit` when `mode === "email"`, call `supabase.auth.signInWithOtp` with the user's email:
    ```typescript
    const { error } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        emailRedirectTo: window.location.origin + "/auth"
      }
    });
    if (error) throw error;
    setSuccessMsg("Magic link sent! Check your email.");
    ```
  - **Token / Hash Parsing**: In `useEffect` on mount, parse the URL hash for `access_token` and `type=magiclink`. If present, exchange the token using `supabase.auth.setSession` and synchronize the profile:
    ```typescript
    const hash = window.location.hash;
    if (hash && hash.includes("access_token=")) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get("access_token");
      const type = params.get("type");
      if (type === "magiclink" && accessToken) {
        setLoading(true);
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: ""
        });
        if (error) throw error;
        // Proceed to sync profile using the sync-profile API
      }
    }
    ```
* **Dashboard `src/components/MemberDashboard.tsx` Changes**:
  - Verify the user is authenticated via `supabase.auth.getUser()`. If the session is missing or invalid, redirect to `/auth`.
  - Fetch circulars/announcements from the `announcements` table where `target_audience` is `all` or `members` and volunteering tasks from the `volunteer_tasks` table where the ward matches the member's ward.
  - Set up a clean layout containing tabs for Announcements, volunteering tasks, and circulars.

---

### R2: Digital ID Card
* **Goal**: Render an interactive Digital ID card with the member's name and EPIC (voter ID), generate a dynamic QR code verification link, and support downloading the card as a PNG using `html2canvas`.
* **Component `src/components/MemberDashboard.tsx` Changes**:
  - **Card UI Rendering**: Render a wrapper div containing the card with `data-testid="id-card"` and `id="digital-id-card"`.
    - Display member name inside `data-testid="id-card-name"`.
    - Display voter ID reference inside `data-testid="id-card-epic"`. If `profile.epic` is missing or null, show a clear fallback like "Not Provided" or placeholder text (satisfies `T2.F2.2`).
    - Render the QR code using `<QRCode>` from `react-qr-code` inside a wrapper with `data-testid="qr-code"`. The QR code should encode a verification link, e.g., `${window.location.origin}/verify/${profile.id}`.
  - **Click-to-Download**: Implement a button with `data-testid="download-id-card-button"`. When clicked, it captures the `#digital-id-card` element using `html2canvas` and saves it:
    ```typescript
    async function handleDownload() {
      setErrorMsg("");
      const card = document.getElementById("digital-id-card");
      if (!card) return;
      try {
        const canvas = await html2canvas(card, { useCORS: true, scale: 2 });
        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = `${profile?.full_name || "member"}_id_card.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        setErrorMsg("Failed to download ID card"); // Displays in data-testid="error-message"
      }
    }
    ```

---

### R3: Razorpay Donations
* **Goal**: Provide a donation interface on the member dashboard supporting preset/custom amounts, launching the Razorpay payment modal, and logging successful transactions to the database via a secure backend API.
* **Backend API `src/pages/api/donations.ts`**:
  - Accept POST requests. Validate the `Authorization: Bearer <token>` header.
  - Instantiate a Supabase server client using the Bearer token and retrieve the user with `scopedSupabase.auth.getUser(token)`. Reject with `401` if invalid.
  - Extract and validate parameters: `amount` (must be a positive number > 0) and `transactionId` (must be a non-empty string). Reject with `400` if invalid.
  - Insert transaction record into the `transactions` table with:
    `{ user_id: user.id, amount, transaction_id: transactionId, status: 'success', created_at: new Date().toISOString() }`.
  - Return `200` with JSON `{ success: true, transactionId }`.
* **Dashboard `src/components/MemberDashboard.tsx` Changes**:
  - Render preset buttons for amounts with `data-testid="preset-100"`, `data-testid="preset-500"`, `data-testid="preset-1000"`.
  - Render an input field for custom amount with `data-testid="payment-amount-input"`.
  - Render a submit button with `data-testid="donate-button"`. Disable this button if the input amount is <= 0 (satisfies `T2.F3.4`).
  - Dynamically load the Razorpay SDK script. On click, open `new window.Razorpay(options)`:
    - **`options.handler`**: Call `/api/donations` with the authenticated session token, transaction ID, and amount. On success, show a success message in `data-testid="success-message"`.
    - **`options.modal.ondismiss`**: Set `errorMsg` to "Payment cancelled" to be displayed in `data-testid="error-message"` (satisfies `T2.F3.1` and `T2.F3.5`).
  - Render the transaction history list container with `data-testid="donation-history"`.

---

### R4: Party Referral System
* **Goal**: Track member referrals by capturing the referrer ID on signup, associating it with the new user's profile, and updating stats on the referrer's dashboard.
* **Referral Link Acquisition**:
  - Render an input field with `data-testid="referral-link"` showing `${window.location.origin}/signup?ref=${profile.id}`.
  - Render a button with `data-testid="copy-referral-button"` that copies the referral link using `navigator.clipboard.writeText`.
* **Referral ID Storage**:
  - In `AuthFlow.tsx` / signup page `useEffect`, check if the URL contains a `ref` parameter.
  - Validate the `ref` value:
    - Verify it's not the logged-in user's own ID (Self-referral protection, sets `errorMsg` to "You cannot refer yourself." in `data-testid="error-message"`).
    - Query the `profiles` table to verify the referrer exists. If the referrer is non-existent or malformed, set `errorMsg` to "Invalid or malformed referral link." (satisfies `T2.F4.1`, `T2.F4.3`).
    - If valid, write it to `localStorage.setItem("referrer_id", ref)` and a `referrer_id` cookie.
* **Backend Profile Sync (`src/pages/api/sync-profile.ts`)**:
  - Accept `referred_by` in the request body of the POST request.
  - Query the database to retrieve the user's existing profile.
  - If the profile already exists, retain the existing `referred_by` value and **do not overwrite it** (satisfies `T2.F4.4`).
  - If the profile is being created:
    - Validate `referred_by` is not the user's own ID.
    - Query database to confirm the referrer ID exists. If valid, set it.
  - Upsert the profile record with the resolved `referred_by`.
* **Referrer Statistics**:
  - In `MemberDashboard.tsx`, query the `profiles` table count where `referred_by` matches the logged-in user's ID.
  - Render this count in an element with `data-testid="referral-count"`.

---

## 2. E2E Test Analysis & Fixes

When executing the E2E test suite (`npx playwright test`), the tests are written with `.catch(() => {})` blocks on almost all assertions to shield them from premature failures. However, under strict execution or when components are missing, several tests fail. The three primary failing/edge-case tests are analyzed below:

### Test 1: `T4.4: Session restoration and security checks` (Strict Failure)
* **Verbatim Failure**: `Error: page.evaluate: Execution context was destroyed, most likely because of a navigation`
* **Root Cause**: The test visits `/dashboard/member` and asserts visibility of `idCard`. Because the dashboard is not fully implemented, it immediately redirects the user to `/auth` on mount. The test assertion `expect(idCard).toBeVisible()` fails but is suppressed by `.catch(() => {})`. The test immediately proceeds to execute `page.evaluate` to clear the local storage. Since the page is in the middle of navigating to `/auth`, the execution context is destroyed, throwing the error.
* **Fix Strategy**:
  - Implement R1 magic link login and session restoration.
  - Ensure `loadDashboard()` in `MemberDashboard.tsx` checks the session correctly via `supabase.auth.getUser()`, populates the profile, and stays on `/dashboard/member` without redirecting when a valid session token is found in `localStorage`.
  - This keeps the page context stable, allowing `page.evaluate()` to successfully clear localStorage.

### Test 2: `T2.F2.5: Graceful error fallback displayed if html2canvas library fails to load or render`
* **Root Cause**: The test mocks `html2canvas` to reject with an error and expects `[data-testid="error-message"]` to show the failure. Since no error boundaries or try-catch fallbacks are implemented for card downloads in the dashboard, the error is swallowed and the warning is never rendered.
* **Fix Strategy**:
  - In `MemberDashboard.tsx`, wrap the `html2canvas` call inside a `try-catch` block.
  - Catch the rejection, and set `errorMsg` state: `setErrorMsg("Failed to download ID card")`.
  - Render the error message in the JSX: `{errorMsg && <div data-testid="error-message" className="error-alert">{errorMsg}</div>}`.

### Test 3: `T2.F4.3: Registration form displays warning if referrer ID is invalid` (and `T2.F4.1`)
* **Root Cause**: The test goes to `/signup?ref=invalid-referrer` and expects `[data-testid="error-message"]` to display an error warning. Currently, the signup pages ignore the `ref` query parameter on load, failing to validate it against the database and leaving the error message container unrendered.
* **Fix Strategy**:
  - In `AuthFlow.tsx` / `SignupForms.tsx` mount effect, check if `ref` is present in the URL.
  - Execute a query to verify the referrer:
    ```typescript
    const { data } = await supabase.from("profiles").select("id").eq("id", ref).maybeSingle();
    if (!data) {
      setErrorMsg("Invalid or malformed referral link.");
    }
    ```
  - Bind the `errorMsg` to an element rendered with `data-testid="error-message"`.

---

## 3. Verification Method

Once changes are applied, run the following verification steps:
1. **Launch dev environment**: `npm run dev`
2. **Execute playwright tests**: `npx playwright test`
3. Verify that all 49 tests in the suite pass successfully with exit code 0.
