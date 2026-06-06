// @ts-nocheck
import { defineMiddleware } from 'astro:middleware';
import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr';

export const onRequest = defineMiddleware(async (context, next) => {
  const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    context.locals.supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return parseCookieHeader(context.request.headers.get('Cookie') ?? '');
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // Astro handles serialization internally with context.cookies.set
            context.cookies.set(name, value, options);
          });
        },
      },
    });

    // Check if it's a dashboard route (ignoring locale prefix)
    const isDashboard = context.url.pathname.match(/^\/(en|hi)\/dashboard/);
    
    if (isDashboard) {
      // getUser() will automatically refresh the session if needed and call setAll
      const { data: { user } } = await context.locals.supabase.auth.getUser();

      if (!user) {
        const locale = context.url.pathname.split('/')[1] || 'en';
        return context.redirect(`/${locale}/login`);
      }
    }
  }

  return next();
});
