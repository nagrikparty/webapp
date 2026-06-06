import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const intlMiddleware = createIntlMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'hi'],
  // Used when no locale matches
  defaultLocale: 'en',
  // Always use the locale prefix
  localePrefix: 'always'
});

export default async function middleware(req: NextRequest) {
  let res = intlMiddleware(req);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll()
          },
          setAll(cookiesToSet) {
            // Update request cookies for the current execution context
            cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
            
            // Re-run the intl middleware so it picks up any new cookies
            res = intlMiddleware(req)
            
            // Apply the new cookies to the final response
            cookiesToSet.forEach(({ name, value, options }) =>
              res.cookies.set(name, value, options)
            )
          },
        },
      }
    );

    // Check if it's a dashboard route (ignoring locale prefix)
    const isDashboard = req.nextUrl.pathname.match(/^\/(en|hi)\/dashboard/);
    
    if (isDashboard) {
      // getUser() will automatically refresh the session if needed and call setAll
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        const locale = req.nextUrl.pathname.split('/')[1] || 'en';
        return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
      }
    }
  }

  return res;
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(hi|en)/:path*']
};
