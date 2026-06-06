import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
  try {
    const env = context.locals.runtime.env;
    if (!env.DB) return new Response(JSON.stringify([]), { status: 200 });

    const { results } = await env.DB.prepare(
      "SELECT * FROM nagrik_leaders WHERE status = 'ACTIVE' ORDER BY joined_at DESC"
    ).all<any>();

    return new Response(JSON.stringify(results), { status: 200 });
  } catch {
    return new Response(JSON.stringify([]), { status: 200 });
  }
}
