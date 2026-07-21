import type { Metadata } from 'next';
import { Inter, Geist_Mono } from 'next/font/google';
import './globals.css';
import Providers from './components/provider';
import PageProgress from './components/pageProgress';
import Laura from './components/laura';
import { Suspense } from 'react';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Chari-T — Trust-first crowdfunding',
    template: '%s | Chari-T',
  },
  description:
    'Donate to safety-rated campaigns and verified charity centers. Optional tips only — your gift goes to the cause.',
  icons: {
    icon: [{ rel: 'icon', url: '/chari-t-icon.svg' }],
    apple: [{ rel: 'apple-touch-icon', url: '/chari-t-icon.svg' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--background)] font-sans text-slate-900">
        <Suspense>
          <Laura />
          <PageProgress />
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  );
}
