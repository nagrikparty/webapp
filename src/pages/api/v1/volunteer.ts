import type { APIRoute } from "astro";
import { createApiSupabase } from "@/lib/supabase";

export const POST: APIRoute = async ({ request }) => {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    const token = authHeader.replace(/^Bearer\s+/i, "");

    const scopedSupabase = createApiSupabase(token);
    if (!scopedSupabase) return new Response(JSON.stringify({ error: "Server config error" }), { status: 500 });

    const { data: { user }, error: authError } = await scopedSupabase.auth.getUser(token);
    if (authError || !user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    const { data: profile } = await scopedSupabase.from("profiles").select("id, role").eq("id", user.id).single();
    if (!profile || profile.role !== "volunteer") {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

    const { action, taskId, issueId, fullName, ward } = await request.json();

    switch (action) {
      case "claim-task": {
        if (!taskId) return new Response(JSON.stringify({ error: "Missing taskId" }), { status: 400 });
        const { error } = await scopedSupabase
          .from("volunteer_tasks")
          .update({ status: "assigned", assigned_to: profile.id })
          .eq("id", taskId)
          .eq("status", "open");
        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      }

      case "complete-task": {
        if (!taskId) return new Response(JSON.stringify({ error: "Missing taskId" }), { status: 400 });
        const { error } = await scopedSupabase
          .from("volunteer_tasks")
          .update({ status: "completed" })
          .eq("id", taskId)
          .eq("assigned_to", profile.id);
        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      }

      case "verify-issue": {
        if (!issueId) return new Response(JSON.stringify({ error: "Missing issueId" }), { status: 400 });
        const { error } = await scopedSupabase
          .from("issues")
          .update({ status: "verified" })
          .eq("id", issueId)
          .eq("status", "submitted");
        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      }

      case "save-profile": {
        if (!fullName) return new Response(JSON.stringify({ error: "Missing fullName" }), { status: 400 });
        const { error } = await scopedSupabase
          .from("profiles")
          .update({ full_name: fullName, ward: ward || null })
          .eq("id", profile.id);
        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      }

      default:
        return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400 });
    }
  } catch (err: unknown) {
    console.error("volunteer action error:", err instanceof Error ? err.message : err);
    return new Response(JSON.stringify({ error: "Failed to perform action" }), { status: 500 });
  }
};
