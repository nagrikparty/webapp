import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
  try {
    const env = context.locals.runtime.env;
    if (!env.DB) return new Response(JSON.stringify([]), { status: 200 });

    const { results } = await env.DB.prepare(
      "SELECT * FROM nagrik_press_releases ORDER BY published_at DESC LIMIT 10"
    ).all<any>();

    return new Response(JSON.stringify(results), { status: 200 });
  } catch {
    return new Response(JSON.stringify([]), { status: 200 });
  }
}
