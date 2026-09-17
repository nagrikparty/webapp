import type { APIRoute } from "astro";
import { requireRole, logAuditEvent } from "@/lib/auth";
import { createApiSupabase } from "@/lib/supabase";
import { generateSubmissionBundle } from "@/lib/export-engine";

export const GET: APIRoute = async ({ request, url }) => {
  const authResult = await requireRole(request, ["ADMIN", "SUPER_ADMIN"]);
  if ("response" in authResult) return authResult.response;
  const { ctx } = authResult;

  const downloadId = url.searchParams.get("download");

  if (downloadId) {
    // Stream compiled PDF download
    const scopedSupabase = createApiSupabase(ctx.token);
    if (!scopedSupabase) {
      return new Response("Database unavailable", { status: 500 });
    }

    const { data: exportRec, error } = await scopedSupabase
      .from("submission_exports")
      .select("*")
      .eq("id", downloadId)
      .single();

    if (error || !exportRec) {
      return new Response("Export record not found", { status: 404 });
    }

    if (exportRec.file_storage_path) {
      const { data: fileData, error: dlError } = await scopedSupabase.storage
        .from("generated-documents")
        .download(exportRec.file_storage_path);

      if (!dlError && fileData) {
        return new Response(fileData, {
          status: 200,
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${exportRec.export_number}.pdf"`,
          },
        });
      }
    }

    // If file was not in storage, regenerate on the fly
    const res = await generateSubmissionBundle(exportRec.template_id, ctx.user.id);
    if (!res.success || !res.pdfBytes) {
      return new Response(res.error || "Failed to generate PDF", { status: 500 });
    }

    return new Response(Buffer.from(res.pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${exportRec.export_number}.pdf"`,
      },
    });
  }

  // Return templates and recent exports
  const scopedSupabase = createApiSupabase(ctx.token);
  if (!scopedSupabase) {
    return new Response(JSON.stringify({ error: "Database client unavailable" }), { status: 500 });
  }

  const { data: templates } = await scopedSupabase
    .from("submission_templates")
    .select("*, submission_requirements(*)")
    .order("created_at", { ascending: true });

  const { data: exports } = await scopedSupabase
    .from("submission_exports")
    .select("*, submission_templates(title, code)")
    .order("generated_at", { ascending: false });

  const { count: approvedCount } = await scopedSupabase
    .from("members")
    .select("*", { count: "exact", head: true })
    .eq("status", "APPROVED");

  return new Response(
    JSON.stringify({
      templates: templates || [],
      exports: exports || [],
      approvedMemberCount: approvedCount || 0,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};

export const POST: APIRoute = async ({ request }) => {
  const authResult = await requireRole(request, ["ADMIN", "SUPER_ADMIN"]);
  if ("response" in authResult) return authResult.response;
  const { ctx } = authResult;

  try {
    const { templateId } = await request.json();

    if (!templateId) {
      return new Response(JSON.stringify({ error: "templateId is required" }), { status: 400 });
    }

    const result = await generateSubmissionBundle(templateId, ctx.user.id);

    if (!result.success) {
      return new Response(JSON.stringify({ error: result.error || "Bundle generation failed" }), {
        status: 500,
      });
    }

    await logAuditEvent(
      ctx.user.id,
      ctx.profile.role,
      "SUBMISSION_EXPORT_GENERATED",
      "submission_exports",
      result.exportNumber,
      {
        templateId,
        totalPages: result.totalPages,
        exportNumber: result.exportNumber,
      },
      request
    );

    return new Response(
      JSON.stringify({
        success: true,
        exportNumber: result.exportNumber,
        totalPages: result.totalPages,
        missingItems: result.missingItems,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err: unknown) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal error" }),
      { status: 500 }
    );
  }
};
