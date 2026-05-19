import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'hi'],

  // Used when no locale matches
  defaultLocale: 'en',
  
  // Always use the locale prefix
  localePrefix: 'always'
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(hi|en)/:path*']
};
