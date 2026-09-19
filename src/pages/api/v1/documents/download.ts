import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get("slug");

    if (!slug) {
      return new Response(JSON.stringify({ error: "Missing required query parameter: slug" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Sanitize slug to prevent path traversal
    const safeSlug = slug.replace(/[^a-z0-9_-]/gi, "");
    const targetUrl = new URL(`/public-documents/${safeSlug}-v1.pdf`, request.url);

    return Response.redirect(targetUrl.toString(), 302);
  } catch (err: unknown) {
    console.error("Document download error:", err);
    return new Response(JSON.stringify({ error: "Internal server error redirecting to document" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
