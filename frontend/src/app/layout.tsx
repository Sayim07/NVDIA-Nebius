import type { Metadata } from 'next';
import './globals.css';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';
import { ScrollProgressBar } from '@/components/ui/ScrollProgressBar';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

export const metadata: Metadata = {
  metadataBase: new URL('https://nvdia-nebius.vercel.app'),
  title: 'HermesShield — A personal AI assistant that keeps your secrets secret',
  description:
    'HermesShield reads your project files and researches the web for you. Before anything leaves your computer, it removes private details like emails, keys and internal names.',
  keywords: [
    'HermesShield',
    'Personal AI',
    'NVIDIA NemoClaw',
    'Nebius Token Factory',
    'Nemotron',
    'Tavily Airlock',
    'OpenShell',
    'Privacy AI',
  ],
  authors: [{ name: 'Sayim' }],
  alternates: {
    canonical: 'https://nvdia-nebius.vercel.app',
  },
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'HermesShield — A personal AI assistant that keeps your secrets secret',
    description:
      'HermesShield reads your project files and researches the web for you. Before anything leaves your computer, it removes private details like emails, keys and internal names.',
    url: 'https://nvdia-nebius.vercel.app',
    siteName: 'HermesShield',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'HermesShield — Sovereign Personal AI Assistant',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HermesShield — A personal AI assistant that keeps your secrets secret',
    description:
      'HermesShield reads your project files and researches the web for you. Before anything leaves your computer, it removes private details like emails, keys and internal names.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@500;600;700&family=Inter:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bg text-text min-h-screen selection:bg-primary/20 selection:text-primary transition-colors duration-200">
        <ThemeProvider>
          <ScrollProgressBar />
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
