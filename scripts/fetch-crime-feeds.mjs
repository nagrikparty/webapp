// Crime RSS fetcher — GitHub Actions par chalta hai (Google News datacenter IPs
// ko block karta hai, isliye Workers se direct fetch nahi hota).
// Feeds parse karke parsed items ko crime-sync endpoint par POST karta hai.

import Parser from "rss-parser";
import { createClient } from "@supabase/supabase-js";

const CRIME_FEEDS = [
  { crime_type: "Rape", feedUrl: "https://news.google.com/rss/search?q=Delhi%20rape%20case%20when%3A7d&hl=en-IN&gl=IN&ceid=IN%3Aen" },
  { crime_type: "Murder", feedUrl: "https://news.google.com/rss/search?q=Delhi%20murder%20case%20when%3A7d&hl=en-IN&gl=IN&ceid=IN%3Aen" },
  { crime_type: "Kidnapping", feedUrl: "https://news.google.com/rss/search?q=Delhi%20kidnapping%20case%20when%3A7d&hl=en-IN&gl=IN&ceid=IN%3Aen" },
  { crime_type: "Robbery", feedUrl: "https://news.google.com/rss/search?q=Delhi%20robbery%20case%20when%3A7d&hl=en-IN&gl=IN&ceid=IN%3Aen" },
  { crime_type: "Extortion", feedUrl: "https://news.google.com/rss/search?q=Delhi%20extortion%20case%20when%3A7d&hl=en-IN&gl=IN&ceid=IN%3Aen" },
];

const SITE_URL = (process.env.SITE_URL || "https://nagrik.party").replace(/\/$/, "");
const CRON_SECRET = process.env.CRON_SECRET;
const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function stableId(text) {
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

async function main() {
  if (!CRON_SECRET) throw new Error("CRON_SECRET env missing");
  const parser = new Parser({ timeout: 20000 });

  const items = [];
  for (const { crime_type, feedUrl } of CRIME_FEEDS) {
    try {
      const feed = await parser.parseURL(feedUrl);
      for (const it of feed.items || []) {
        const source_url = (it.link || "").trim();
        if (!source_url) continue;
        const title = (it.title || "").trim() || `Verified ${crime_type} incident — Delhi NCR`;
        const d = it.pubDate ? new Date(it.pubDate) : new Date();
        items.push({
          id: stableId(source_url),
          crime_type,
          title,
          source_url,
          incident_date: isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString(),
        });
      }
    } catch (e) {
      console.warn(`[${crime_type}] feed fetch failed:`, e.message);
    }
  }

  // Dedupe by id
  const seen = new Set();
  const unique = items.filter((it) => {
    if (seen.has(it.id)) return false;
    seen.add(it.id);
    return true;
  });

  console.log(`Fetched ${items.length} items, ${unique.length} unique.`);

  // Upsert via crime-sync endpoint (authoritative path; handles audit logging)
  const res = await fetch(`${SITE_URL}/api/v1/cron/crime-sync`, {
    method: "POST",
    headers: {
      "x-cron-secret": CRON_SECRET,
      "Content-Type": "application/json",
      "Origin": SITE_URL,
    },
    body: JSON.stringify({ items: unique }),
  });
  const text = await res.text();
  console.log(`crime-sync responded ${res.status}:`, text.slice(0, 500));
  if (!res.ok) process.exitCode = 1;
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});