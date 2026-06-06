import { type ReactNode } from 'react';
import { inter, mukta, teko } from '@/lib/fonts';
import '@/app/globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata = {
  title: 'Nagrik Party',
  description: 'A constitutional governance platform',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${mukta.variable} ${teko.variable}`} suppressHydrationWarning>
      <body className="bg-off-white text-black font-body antialiased min-h-screen flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
