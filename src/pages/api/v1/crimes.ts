import type { APIRoute } from 'astro';

import { supabase, hasSupabaseConfig } from '@/lib/supabase';


export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    if (!hasSupabaseConfig || !supabase) {
      return new Response(JSON.stringify({ error: "Database not configured" }), { status: 500 });
    }
    const url = new URL(request.url);
    const type = url.searchParams.get('type');

    if (type) {
      const { data, error } = await supabase
        .from('crimes')
        .select('*')
        .eq('crime_type', type)
        .order('incident_date', { ascending: false });
        
      if (error) throw error;
      return new Response(JSON.stringify(data || []), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    const { data, error } = await supabase.from('crimes').select('crime_type');
    if (error) throw error;
    
    const counts: Record<string, number> = {};
    (data || []).forEach((row: { crime_type: string }) => {
      counts[row.crime_type] = (counts[row.crime_type] || 0) + 1;
    });

    const orderedTypes = ['Rape', 'Murder', 'Kidnapping', 'Robbery', 'Extortion'];
    const result = orderedTypes.map(t => ({
      crime_type: t,
      count: counts[t] || 0
    }));

    Object.keys(counts).forEach(k => {
      if (!orderedTypes.includes(k)) {
        result.push({ crime_type: k, count: counts[k] });
      }
    });

    return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err: unknown) {
    console.error("GET crimes error:", err instanceof Error ? err.message : err);
    return new Response(JSON.stringify({ error: 'Failed to fetch crimes' }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    if (!hasSupabaseConfig || !supabase) {
      return new Response(JSON.stringify({ error: "Database not configured" }), { status: 500 });
    }
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      const body = await request.json();
      if (!body.crime_type || !body.title || !body.source_url || !body.incident_date) {
         return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
      }
      
      const id = btoa(body.source_url).replace(/[/+=]/g, '');
      const { error } = await supabase.from('crimes').upsert({
        id,
        crime_type: body.crime_type,
        title: body.title,
        source_url: body.source_url,
        incident_date: new Date(body.incident_date).toISOString()
      }, { onConflict: 'id' });
      
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    const { default: Parser } = await import('rss-parser');
    const parser = new Parser();
    const categories = ['rape', 'murder', 'kidnap', 'robbery', 'extortion'];
    let newRecords = 0;

    for (const cat of categories) {
      try {
        const query = encodeURIComponent(`Delhi ${cat}`);
        const feed = await parser.parseURL(`https://news.google.com/rss/search?q=${query}&hl=en-IN&gl=IN&ceid=IN:en`);
        
        let mappedType = '';
        if (cat === 'rape') mappedType = 'Rape';
        if (cat === 'murder') mappedType = 'Murder';
        if (cat === 'kidnap') mappedType = 'Kidnapping';
        if (cat === 'robbery') mappedType = 'Robbery';
        if (cat === 'extortion') mappedType = 'Extortion';

        const inserts: Record<string, unknown>[] = [];
        feed.items.forEach((item: { title?: string; link?: string; pubDate?: string }) => {
          const title = item.title?.toLowerCase() || '';
          if (title.includes('delhi') || title.includes('ncr') || title.includes('noida') || title.includes('gurugram')) {
            const id = btoa(item.link || title).replace(/[/+=]/g, '');
            inserts.push({
              id,
              crime_type: mappedType,
              title: item.title,
              source_url: item.link || '',
              incident_date: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString()
            });
          }
        });

        if (inserts.length > 0) {
          const { error, count } = await supabase.from('crimes').upsert(inserts, { onConflict: 'id', ignoreDuplicates: true });
          if (!error && count) newRecords += count;
        }
      } catch {
        // Skip on error
      }
    }

    return new Response(JSON.stringify({ success: true, newRecords }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    if (!hasSupabaseConfig || !supabase) {
      return new Response(JSON.stringify({ error: "Database not configured" }), { status: 500 });
    }
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) return new Response(JSON.stringify({ error: 'Missing ID' }), { status: 400 });

    const { error } = await supabase.from('crimes').delete().eq('id', id);
    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
};
