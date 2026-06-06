import type { APIRoute } from 'astro';
import { logger } from "@/lib/logger";

export const GET: APIRoute = async (context) => {
  try {
    const env = context.locals.runtime.env;
    const url = new URL(context.request.url);
    const stateId = url.searchParams.get('stateId');
    if (!env.DB || !stateId) return new Response(JSON.stringify([]), { status: 200 });
    
    const result = await env.DB.prepare(
      "SELECT id, name, serial_no FROM vidhan_sabhas WHERE state_id = ? ORDER BY serial_no ASC"
    ).bind(stateId).all<any>();
    return new Response(JSON.stringify(result.results || []), { status: 200 });
  } catch (error) {
    logger.error({ err: error }, "Error fetching vidhan sabhas");
    return new Response(JSON.stringify([]), { status: 200 });
  }
}
