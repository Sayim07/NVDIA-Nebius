import type { Metadata } from 'next';
import './globals.css';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';

export const metadata: Metadata = {
  title: 'HermesShield — Zero-Trust Personal AI Executive & Deep Web Scout',
  description:
    'Self-learning, zero-trust personal AI runtime powered by NVIDIA NemoClaw, OpenShell, Nebius Token Factory, and Privacy-Preserving Tavily Airlock.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen selection:bg-emerald-500/20 selection:text-emerald-300">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
