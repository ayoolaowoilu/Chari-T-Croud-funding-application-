
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Providers from './components/provider';
import PageProgress from './components/pageProgress';
import Laura from './components/laura';
import { Suspense } from 'react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Chari-T',
    template: '%s | Chari-T',
  },
  description: 'Support causes that matter.',
 icons: {
    icon: [
      { url: '/ct_logo2.png', sizes: '16x16', type: 'image/png' },
    ],
}
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white">
       <Suspense>
            <Laura />
        <PageProgress />
        <Providers>{children}</Providers>
       </Suspense>
      </body>
    </html>
  );
}