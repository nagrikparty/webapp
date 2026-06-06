import type { APIRoute } from 'astro';
import { updateProfileSchema } from "@/lib/validations";
import { logger } from "@/lib/logger";

export const POST: APIRoute = async (context) => {
  try {
    const supabase = (context.locals as any).supabase;
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || !user.id) {
      return new Response(JSON.stringify({ success: false, error: "Not authenticated" }), { status: 401 });
    }

    const formData = await context.request.formData();
    const validationData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
    };

    const parsed = updateProfileSchema.safeParse(validationData);
    if (!parsed.success) {
      return new Response(JSON.stringify({ success: false, error: parsed.error.issues[0].message }), { status: 400 });
    }
    const d = parsed.data;

    const env = context.locals.runtime.env;
    if (!env.DB) return new Response(JSON.stringify({ success: false, error: "Database not configured" }), { status: 500 });

    const updates = [];
    const values = [];
    
    if (d.name) {
      updates.push("name = ?");
      values.push(d.name);
    }
    if (d.email !== undefined) {
      updates.push("email = ?");
      values.push(d.email);
    }
    if (d.phone) {
      updates.push("phone = ?");
      values.push(d.phone);
    }

    if (updates.length === 0) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    values.push(user.id);
    const query = `UPDATE nagrik_members SET ${updates.join(", ")} WHERE id = ?`;

    const result = await env.DB.prepare(query).bind(...values).run();

    if (!result.success) {
      return new Response(JSON.stringify({ success: false, error: "Failed to update profile" }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    logger.error({ err: error }, "Error in updateProfile");
    return new Response(JSON.stringify({ success: false, error: "Internal Server Error" }), { status: 500 });
  }
}
