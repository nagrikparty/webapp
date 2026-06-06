import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
  try {
    const env = context.locals.runtime.env;
    if (!env.DB) return new Response(JSON.stringify(null), { status: 200 });

    const [reports, volunteers, donations] = await Promise.all([
      env.DB.prepare("SELECT COUNT(*) as count FROM nagrik_reports").first<{ count: number }>(),
      env.DB.prepare("SELECT COUNT(*) as count FROM nagrik_members").first<{ count: number }>(),
      env.DB.prepare("SELECT COUNT(*) as count FROM nagrik_donations").first<{ count: number }>(),
    ]);

    return new Response(JSON.stringify({
      reportCount: reports?.count ?? 0,
      volunteerCount: volunteers?.count ?? 0,
      donationCount: donations?.count ?? 0,
    }), { status: 200 });
  } catch {
    return new Response(JSON.stringify(null), { status: 200 });
  }
}
