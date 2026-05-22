import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
const intlMiddleware = createIntlMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'hi'],
  // Used when no locale matches
  defaultLocale: 'en',
  // Always use the locale prefix
  localePrefix: 'always'
});

export default async function middleware(req: NextRequest) {
  // Check if it's a dashboard route (ignoring locale prefix)
  const isDashboard = req.nextUrl.pathname.match(/^\/(en|hi)\/dashboard/);
  
  if (isDashboard) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    let isAuthenticated = false;

    if (supabaseUrl && supabaseKey) {
      // Need a minimal supabase fetch to verify the auth token in middleware
      // We can use the native fetch API to check the user using the access token
      const supabaseCookie = req.cookies.get('sb-gwzjfqgvunyvvwygzkxp-auth-token')?.value 
                           || req.cookies.get('sb-auth-token')?.value;
                           
      if (supabaseCookie) {
        try {
          // Parse the Supabase auth cookie which is JSON stringified array containing the access token
          let parsedCookie = JSON.parse(supabaseCookie);
          const accessToken = Array.isArray(parsedCookie) ? parsedCookie[0] : null;
          
          if (accessToken) {
            const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                apikey: supabaseKey
              }
            });
            if (res.ok) {
              isAuthenticated = true;
            }
          }
        } catch (e) {
          // ignore parsing error
        }
      }
    }

    if (!isAuthenticated) {
      const locale = req.nextUrl.pathname.split('/')[1] || 'en';
      return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
    }
  }

  return intlMiddleware(req);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(hi|en)/:path*']
};
