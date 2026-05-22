import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';


const intlMiddleware = createIntlMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'hi'],
  // Used when no locale matches
  defaultLocale: 'en',
  // Always use the locale prefix
  localePrefix: 'always'
});

function getKey() {
  // Use optional chaining or typeof to safely access process
  const secretKey = (typeof process !== 'undefined' && process.env.JWT_SECRET) || "nagrik_party_edge_secret_key_12345!@#";
  return new TextEncoder().encode(secretKey);
}

export default async function middleware(req: NextRequest) {
  // Check if it's a dashboard route (ignoring locale prefix)
  const isDashboard = req.nextUrl.pathname.match(/^\/(en|hi)\/dashboard/);
  
  if (isDashboard) {
    const sessionCookie = req.cookies.get('session')?.value;
    let isAuthenticated = false;
    
    if (sessionCookie) {
      try {
        await jwtVerify(sessionCookie, getKey(), { algorithms: ["HS256"] });
        isAuthenticated = true;
      } catch (e) {
        // invalid token
      }
    }

    if (!isAuthenticated) {
      // Strictly prevent bypassing: redirect to login
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
