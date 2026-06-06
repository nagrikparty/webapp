import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
  try {
    const env = context.locals.runtime.env;
    if (!env.DB) return new Response(JSON.stringify([]), { status: 200 });

    const url = new URL(context.request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);

    const { results } = await env.DB.prepare(
      "SELECT * FROM nagrik_reports ORDER BY created_at DESC LIMIT ? OFFSET ?"
    ).bind(limit, offset).all<any>();

    return new Response(JSON.stringify(results), { status: 200 });
  } catch {
    return new Response(JSON.stringify([]), { status: 200 });
  }
}
