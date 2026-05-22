import { type ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import type { Metadata, Viewport } from 'next';
import { locales } from '@/i18n/request';
import { inter, mukta, teko } from '@/lib/fonts';
import '@/app/globals.css';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0A0A0A',
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isHindi = locale === 'hi';

  return {
    title: {
      default: isHindi ? 'नागरिक पार्टी — काम दिखना चाहिए' : 'Nagrik Party — Kaam Dikhna Chahiye',
      template: isHindi ? '%s | नागरिक पार्टी' : '%s | Nagrik Party',
    },
    description: isHindi
      ? 'नागरिक पार्टी — एक नागरिक-प्रथम राजनीतिक आंदोलन। दिखने वाली शासन व्यवस्था, सार्वजनिक जवाबदेही, स्वास्थ्य सेवा, महिला सुरक्षा।'
      : 'Nagrik Party — a citizen-first political movement for visible governance, public accountability, healthcare accessibility, and women safety.',
    keywords: ['Nagrik Party', 'नागरिक पार्टी', 'visible governance', 'civic movement', 'India politics', 'Delhi', 'Arsalan Azad'],
    authors: [{ name: 'Nagrik Party' }],
    openGraph: {
      type: 'website',
      locale: locale === 'hi' ? 'hi_IN' : 'en_IN',
      siteName: isHindi ? 'नागरिक पार्टी' : 'Nagrik Party',
      title: isHindi ? 'नागरिक पार्टी — काम दिखना चाहिए' : 'Nagrik Party — Kaam Dikhna Chahiye',
      description: isHindi
        ? 'Tax liya hai toh kaam bhi dikhao। एक इंटरनेट-नेटिव नागरिक आंदोलन।'
        : 'Tax liya hai toh kaam bhi dikhao. An internet-native civic movement.',
    },
    twitter: {
      card: 'summary_large_image',
      title: isHindi ? 'नागरिक पार्टी' : 'Nagrik Party',
      description: isHindi ? 'काम दिखना चाहिए।' : 'Kaam dikhna chahiye.',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as typeof locales[number])) {
    notFound();
  }

  // Providing all messages to the client
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${mukta.variable} ${teko.variable}`}>
      <body className="bg-off-white text-black font-body antialiased selection:bg-red selection:text-white min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
