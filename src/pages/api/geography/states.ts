import type { APIRoute } from 'astro';
import { logger } from "@/lib/logger";

export const GET: APIRoute = async (context) => {
  try {
    const env = context.locals.runtime.env;
    if (!env.DB) return new Response(JSON.stringify([]), { status: 200 });
    
    const result = await env.DB.prepare("SELECT id, name, name_hi, serial_no FROM states ORDER BY serial_no ASC").all<any>();
    return new Response(JSON.stringify(result.results || []), { status: 200 });
  } catch (error) {
    logger.error({ err: error }, "Error fetching states");
    return new Response(JSON.stringify([]), { status: 200 });
  }
}
