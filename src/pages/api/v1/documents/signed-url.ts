import type { APIRoute } from "astro";
import { requireAuth } from "@/lib/auth";
import { createApiSupabase } from "@/lib/supabase";

export const POST: APIRoute = async ({ request }) => {
  const authResult = await requireAuth(request);
  if ("response" in authResult) return authResult.response;
  const { ctx } = authResult;

  try {
    const { documentId } = await request.json();
    if (!documentId) {
      return new Response(JSON.stringify({ error: "Missing documentId" }), { status: 400 });
    }

    const scopedSupabase = createApiSupabase(ctx.token);
    if (!scopedSupabase) {
      return new Response(JSON.stringify({ error: "Database client unavailable" }), { status: 500 });
    }

    const { data: doc, error: docError } = await scopedSupabase
      .from("documents")
      .select("id, user_id, storage_path, mime_type, original_filename")
      .eq("id", documentId)
      .single();

    if (docError || !doc) {
      return new Response(JSON.stringify({ error: "Document not found" }), { status: 404 });
    }

    // Verify ownership or staff role
    const isOwner = doc.user_id === ctx.user.id;
    const isStaff = ["VERIFIER", "ADMIN", "SUPER_ADMIN"].includes(ctx.profile.role);

    if (!isOwner && !isStaff) {
      return new Response(JSON.stringify({ error: "Unauthorized access to document" }), { status: 403 });
    }

    // Generate signed URL (valid for 5 minutes)
    const { data: signedData, error: signError } = await scopedSupabase.storage
      .from("member-documents")
      .createSignedUrl(doc.storage_path, 300);

    if (signError || !signedData) {
      console.error("Sign URL error:", signError);
      return new Response(JSON.stringify({ error: "Failed to generate signed document URL" }), { status: 500 });
    }

    return new Response(
      JSON.stringify({
        signed_url: signedData.signedUrl,
        filename: doc.original_filename,
        mime_type: doc.mime_type,
        expires_in: 300,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal error" }),
      { status: 500 }
    );
  }
};
