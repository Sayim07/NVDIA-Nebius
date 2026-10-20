'use client';

import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center px-4">
      <div className="w-14 h-14 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center text-danger mb-5">
        <AlertTriangle size={24} aria-hidden="true" />
      </div>
      <h2 className="font-heading text-xl font-semibold text-text mb-2">Something went wrong</h2>
      <p className="text-muted text-sm mb-6 max-w-sm">{error.message || 'An unexpected error occurred.'}</p>
      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="px-4 py-2.5 rounded-xl bg-primary text-primary-fg text-sm font-medium hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
        >
          Try again
        </button>
        <Link
          href="/app"
          className="px-4 py-2.5 rounded-xl border border-border bg-surface text-text text-sm font-medium hover:bg-surface-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
