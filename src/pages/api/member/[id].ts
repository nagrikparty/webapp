import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
  try {
    const env = context.locals.runtime.env;
    if (!env.DB) return new Response(JSON.stringify(null), { status: 200 });

    const id = context.params.id;

    const data = await env.DB.prepare(
      `SELECT id, name, phone, email, epic_number, is_indian_citizen, has_criminal_record, created_at, profile_photo_key, is_verified, didit_session_id 
       FROM nagrik_members WHERE id = ?`
    ).bind(id).first<any>();

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(null), { status: 200 });
  }
}
