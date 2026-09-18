import type { APIRoute } from "astro";

// Obsolete legacy endpoint permanently disabled to prevent approval bypass.
// All membership verifications and approvals must strictly use the hardened /api/v1/admin/verifications workflow.
export const POST: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      error: "This legacy endpoint has been deprecated and disabled. Use /api/v1/admin/verifications for all verification and approval workflows.",
    }),
    { status: 410, headers: { "Content-Type": "application/json" } }
  );
};

