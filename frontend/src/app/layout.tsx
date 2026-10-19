import type { Metadata } from 'next';
import './globals.css';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';

export const metadata: Metadata = {
  title: 'HermesShield — Zero-Trust Personal AI Executive & Deep Web Scout',
  description:
    'A personal AI executive that reads your workspace and searches the web without ever leaking your secrets. Built with NVIDIA NemoClaw, Nebius Token Factory, and Privacy-Preserving Tavily Airlock.',
  keywords: [
    'HermesShield',
    'Personal AI',
    'NVIDIA NemoClaw',
    'Nebius Token Factory',
    'Nemotron',
    'Tavily Airlock',
    'Zero-Trust AI',
    'Cybersecurity',
  ],
  authors: [{ name: 'Sayim07' }],
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'HermesShield — Zero-Trust Personal AI Executive',
    description:
      'A personal AI executive that reads your workspace and searches the web without ever leaking your secrets.',
    url: 'https://hermesshield.vercel.app',
    siteName: 'HermesShield',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HermesShield — Zero-Trust Personal AI Executive',
    description:
      'Sovereign Personal AI Executive built on NVIDIA NemoClaw and Nebius Token Factory.',
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=Geist+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#07090D] text-slate-100 min-h-screen selection:bg-nvidia/20 selection:text-nvidia">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}

