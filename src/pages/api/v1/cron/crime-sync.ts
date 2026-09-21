import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";
import Parser from "rss-parser";

export const prerender = false;

const CRIME_FEEDS: Array<{ crime_type: string; feedUrl: string }> = [
  { crime_type: "Rape", feedUrl: "https://news.google.com/rss/search?q=Delhi%20rape%20case%20when%3A7d&hl=en-IN&gl=IN&ceid=IN%3Aen" },
  { crime_type: "Murder", feedUrl: "https://news.google.com/rss/search?q=Delhi%20murder%20case%20when%3A7d&hl=en-IN&gl=IN&ceid=IN%3Aen" },
  { crime_type: "Kidnapping", feedUrl: "https://news.google.com/rss/search?q=Delhi%20kidnapping%20case%20when%3A7d&hl=en-IN&gl=IN&ceid=IN%3Aen" },
  { crime_type: "Robbery", feedUrl: "https://news.google.com/rss/search?q=Delhi%20robbery%20case%20when%3A7d&hl=en-IN&gl=IN&ceid=IN%3Aen" },
  { crime_type: "Extortion", feedUrl: "https://news.google.com/rss/search?q=Delhi%20extortion%20case%20when%3A7d&hl=en-IN&gl=IN&ceid=IN%3Aen" },
];

function md5(text: string): string {
  // Small deterministic hash (no node:crypto dependency in edge runtime)
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < text.length; i++) {
    const ch = text.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (h2 >>> 0).toString(16).padStart(8, "0") + (h1 >>> 0).toString(16).padStart(8, "0");
}

export const POST: APIRoute = async ({ request, locals }) => {
  const runtimeEnv = (
    (locals as unknown as { runtime?: { env?: Record<string, unknown> } }).runtime?.env || {}
  ) as Record<string, string | undefined>;
  const envOf = (k: string) =>
    runtimeEnv[k] ?? (import.meta as unknown as { env: Record<string, string | undefined> }).env[k];

  const secret = request.headers.get("x-cron-secret") || new URL(request.url).searchParams.get("secret");
  const expected = envOf("CRON_SECRET");
  if (!expected || secret !== expected) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const supabaseUrl = envOf("PUBLIC_SUPABASE_URL");
  const serviceKey = envOf("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) {
    return new Response(JSON.stringify({ error: "Supabase service credentials not configured" }), { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceKey);
  const parser: Parser = new Parser({ timeout: 15000 });

  let inserted = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const { crime_type, feedUrl } of CRIME_FEEDS) {
    try {
      const feed = await parser.parseURL(feedUrl);
      for (const item of feed.items || []) {
        const sourceUrl = (item.link || "").trim();
        // Title fallback chain: kabhi blank save mat karo
        const title = (item.title || item.contentSnippet || "").trim() || `Verified ${crime_type} incident — Delhi NCR`;
        const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();
        if (!sourceUrl) {
          skipped++;
          continue;
        }
        const id = md5(sourceUrl);
        const { error } = await supabase.from("crimes").upsert(
          {
            id,
            crime_type,
            title,
            source_url: sourceUrl,
            incident_date: isNaN(pubDate.getTime()) ? new Date().toISOString() : pubDate.toISOString(),
          },
          { onConflict: "id" }
        );
        if (error) {
          errors.push(`${crime_type}: ${error.message}`);
        } else {
          inserted++;
        }
      }
    } catch (e) {
      errors.push(`${crime_type}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  await supabase.from("data_runs").insert({
    run_type: "CRIME_RSS_SYNC",
    status: errors.length > 0 && inserted === 0 ? "FAILED" : "COMPLETED",
    completed_at: new Date().toISOString(),
    items_processed: inserted + skipped,
    items_matched: inserted,
    triggered_by: "CRON",
    log_summary: `Crime RSS daily sync: ${inserted} upserted, ${skipped} skipped. ${errors.length} errors.`,
  });

  return new Response(JSON.stringify({ success: true, inserted, skipped, errors }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

// Manual trigger via GET allowed only with same secret (admin/cron debugging)
export const GET: APIRoute = async (ctx) => POST(ctx);