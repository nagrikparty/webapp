import type { APIRoute } from 'astro';
import { logger } from "@/lib/logger";

export const GET: APIRoute = async (context) => {
  try {
    const env = context.locals.runtime.env;
    const url = new URL(context.request.url);
    const vidhanSabhaId = url.searchParams.get('vidhanSabhaId');
    if (!env.DB || !vidhanSabhaId) return new Response(JSON.stringify([]), { status: 200 });
    
    const result = await env.DB.prepare(
      "SELECT id, name, serial_no FROM wards WHERE vidhan_sabha_id = ? ORDER BY serial_no ASC"
    ).bind(vidhanSabhaId).all<any>();
    return new Response(JSON.stringify(result.results || []), { status: 200 });
  } catch (error) {
    logger.error({ err: error }, "Error fetching wards");
    return new Response(JSON.stringify([]), { status: 200 });
  }
}
