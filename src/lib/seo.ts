import { Metadata } from 'next';

type SEOProps = {
  title?: string;
  description?: string;
  locale: string;
  path?: string;
  image?: string;
};

export function constructMetadata({
  title,
  description,
  locale,
  path = '',
  image = '/og-image.jpg',
}: SEOProps): Metadata {
  const isHindi = locale === 'hi';

  const defaultTitle = isHindi ? 'नागरिक पार्टी — काम दिखना चाहिए' : 'Nagrik Party — Kaam Dikhna Chahiye';
  const defaultDesc = isHindi
    ? 'नागरिक पार्टी — एक नागरिक-प्रथम राजनीतिक आंदोलन। दिखने वाली शासन व्यवस्था, सार्वजनिक जवाबदेही, स्वास्थ्य सेवा, महिला सुरक्षा।'
    : 'Nagrik Party — a citizen-first political movement for visible governance, public accountability, healthcare accessibility, and women safety.';

  const finalTitle = title ? `${title} | ${isHindi ? 'नागरिक पार्टी' : 'Nagrik Party'}` : defaultTitle;
  const finalDesc = description || defaultDesc;
  const url = `https://nagrikparty.in/${locale}${path}`;

  return {
    title: finalTitle,
    description: finalDesc,
    metadataBase: new URL('https://nagrikparty.in'),
    alternates: {
      canonical: url,
      languages: {
        'en-IN': `/en${path}`,
        'hi-IN': `/hi${path}`,
      },
    },
    openGraph: {
      title: finalTitle,
      description: finalDesc,
      url,
      siteName: isHindi ? 'नागरिक पार्टी' : 'Nagrik Party',
      locale: isHindi ? 'hi_IN' : 'en_IN',
      type: 'website',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: finalTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: finalDesc,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
    },
    manifest: '/manifest.json',
  };
}
