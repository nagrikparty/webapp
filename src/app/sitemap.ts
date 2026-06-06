import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://nagrikparty.in';
  const locales = ['en', 'hi'];
  const routes = [
    '',
    '/manifesto',
    '/issues',
    '/about',
    '/mission',
    '/join',
    '/report',
    '/donate',
    '/transparency',
    '/constitution',
    '/contact',
    '/privacy',
    '/terms',
    '/media',
    '/leadership',
    '/candidates',
    '/infrastructure',
    '/cadre',
  ];

  return locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: route === '' ? 'daily' : 'weekly' as const,
      priority: route === '' ? 1 : 0.8,
    }))
  );
}
