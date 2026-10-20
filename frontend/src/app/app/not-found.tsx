import Link from 'next/link';
import { Home, LayoutDashboard } from 'lucide-react';

export default function AppNotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center text-muted mb-6">
        <span className="font-mono text-2xl font-bold">404</span>
      </div>
      <h1 className="font-heading text-2xl font-semibold text-text mb-2">Page not found</h1>
      <p className="text-muted text-sm mb-8 max-w-sm">
        This page doesn't exist in the app. Check the URL or head back to the dashboard.
      </p>
      <div className="flex items-center gap-3">
        <Link
          href="/app"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-fg text-sm font-medium hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <LayoutDashboard size={15} aria-hidden="true" />
          Go to dashboard
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-surface text-text text-sm font-medium hover:bg-surface-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Home size={15} aria-hidden="true" />
          Home
        </Link>
      </div>
    </div>
  );
}
