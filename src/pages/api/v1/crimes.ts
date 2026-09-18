import type { APIRoute } from 'astro';
import { supabase, hasSupabaseConfig, createApiSupabase } from '@/lib/supabase';
import { requireRole, logAuditEvent } from '@/lib/auth';

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
        .select('id, crime_type, title, source_url, incident_date, created_at')
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
  const authResult = await requireRole(request, ["ADMIN", "SUPER_ADMIN"]);
  if ("response" in authResult) return authResult.response;
  const { ctx } = authResult;

  try {
    const scopedSupabase = createApiSupabase(ctx.token);
    if (!scopedSupabase) {
      return new Response(JSON.stringify({ error: "Database not configured" }), { status: 500 });
    }
    const contentType = request.headers.get('content-type') || '';
    
    if (!contentType.includes('application/json')) {
      return new Response(
        JSON.stringify({ error: 'Invalid Content-Type: Incident creation requires application/json with verified source data' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();
    if (!body.crime_type || !body.title || !body.source_url || !body.incident_date) {
      return new Response(
        JSON.stringify({ error: 'Missing required verified fields (crime_type, title, source_url, incident_date)' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify incident_date is a valid date
    const parsedDate = new Date(body.incident_date);
    if (isNaN(parsedDate.getTime())) {
      return new Response(
        JSON.stringify({ error: 'Invalid incident_date format' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const id = btoa(body.source_url).replace(/[/+=]/g, '');
    const { error } = await scopedSupabase.from('crimes').upsert({
      id,
      crime_type: body.crime_type,
      title: body.title,
      source_url: body.source_url,
      incident_date: parsedDate.toISOString(),
    }, { onConflict: 'id' });
    
    if (error) throw error;

    await logAuditEvent(
      ctx.user.id,
      ctx.profile.role,
      'CRIME_RECORD_CREATED',
      'crimes',
      id,
      { crime_type: body.crime_type, title: body.title, incident_date: parsedDate.toISOString() },
      request
    );

    return new Response(JSON.stringify({ success: true, id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  const authResult = await requireRole(request, ["ADMIN", "SUPER_ADMIN"]);
  if ("response" in authResult) return authResult.response;
  const { ctx } = authResult;

  try {
    const scopedSupabase = createApiSupabase(ctx.token);
    if (!scopedSupabase) {
      return new Response(JSON.stringify({ error: "Database not configured" }), { status: 500 });
    }
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) return new Response(JSON.stringify({ error: 'Missing ID' }), { status: 400 });

    const { error } = await scopedSupabase.from('crimes').delete().eq('id', id);
    if (error) throw error;

    await logAuditEvent(
      ctx.user.id,
      ctx.profile.role,
      'CRIME_RECORD_DELETED',
      'crimes',
      id,
      { id },
      request
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
};
