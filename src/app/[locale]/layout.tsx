import { type ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { locales } from '@/i18n/request';
import { inter, mukta, teko } from '@/lib/fonts';
import '@/app/globals.css';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${mukta.variable} ${teko.variable}`}>
      <body className="bg-off-white text-black font-english antialiased selection:bg-red selection:text-white min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <div className="film-grain fixed inset-0 z-50 pointer-events-none opacity-20 mix-blend-multiply"></div>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
