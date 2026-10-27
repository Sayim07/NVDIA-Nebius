'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Search, Github, Shield, ChevronRight, Key, Sparkles } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { APP_ROUTES } from './AppSidebar';
import { useAppState } from './AppStateProvider';
import { content } from '@/content/content';
import { getQuotaState, QuotaState } from '@/lib/quotaStore';
import { ByokModal } from '@/components/ui/ByokModal';
import { AdminModal } from '@/components/ui/AdminModal';

interface AppTopBarProps {
  onMenuToggle: () => void;
}

export function AppTopBar({ onMenuToggle }: AppTopBarProps) {
  const pathname = usePathname();
  const { isFallback, health } = useAppState();

  const [quota, setQuota] = useState<QuotaState>(() => getQuotaState());
  const [isByokModalOpen, setIsByokModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Sync quota updates across tabs/events
  useEffect(() => {
    const handleUpdate = () => {
      setQuota(getQuotaState());
    };
    window.addEventListener('hermesshield-quota-changed', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    // Global keyboard shortcut for Admin bypass: Ctrl+Shift+A / Cmd+Shift+A
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hermesshield-quota-changed', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Find current route label for breadcrumb
  const currentRoute = APP_ROUTES.find((r) => {
    if (r.href === '/app') return pathname === '/app';
    return pathname.startsWith(r.href);
  });

  const pageTitle = currentRoute?.label ?? 'Dashboard';

  return (
    <header className="sticky top-0 z-30 w-full h-14 flex items-center gap-3 px-4 bg-bg/90 backdrop-blur-md border-b border-border">
      {/* Hamburger menu button to toggle sidebar/drawer */}
      <button
        onClick={onMenuToggle}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-border bg-surface hover:bg-surface-2 text-muted hover:text-text transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary shrink-0 cursor-pointer"
        aria-label="Toggle navigation menu"
        aria-controls="app-sidebar"
        title="Toggle sidebar (or drawer on mobile)"
      >
        <Menu size={16} aria-hidden="true" />
      </button>

      {/* Logo + Breadcrumb */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Link
          href="/app"
          className="flex items-center gap-1.5 text-text hover:text-primary transition-colors shrink-0"
          aria-label="HermesShield dashboard"
        >
          <Shield size={16} className="text-primary" aria-hidden="true" />
          <span className="font-heading font-semibold text-sm hidden sm:block">HermesShield</span>
        </Link>

        {pathname !== '/app' && currentRoute && (
          <>
            <ChevronRight size={13} className="text-muted/50 shrink-0" aria-hidden="true" />
            <span className="text-sm font-medium text-text truncate">{pageTitle}</span>
          </>
        )}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Quota / Admin Badge */}
        <button
          onClick={() => {
            if (quota.isAdmin) {
              setIsAdminModalOpen(true);
            } else {
              setIsByokModalOpen(true);
            }
          }}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium border transition-all cursor-pointer ${
            quota.isAdmin
              ? 'bg-purple-950/40 border-purple-500/40 text-purple-300 hover:bg-purple-900/40'
              : quota.hasCustomKey
              ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/40'
              : quota.runsUsed >= quota.maxFreeRuns
              ? 'bg-rose-950/40 border-rose-500/40 text-rose-300 hover:bg-rose-900/40'
              : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/40'
          }`}
          title={
            quota.isAdmin
              ? 'Admin Evaluator Mode: Unlimited runs active (Click to manage)'
              : quota.hasCustomKey
              ? 'BYOK Active: Using personal keys (Click to manage)'
              : `Free Demo: ${Math.max(0, quota.maxFreeRuns - quota.runsUsed)}/${quota.maxFreeRuns} runs remaining (Click to add keys)`
          }
        >
          {quota.isAdmin ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              <span>ADMIN UNLIMITED</span>
            </>
          ) : quota.hasCustomKey ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>BYOK ACTIVE</span>
            </>
          ) : (
            <>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  quota.runsUsed >= quota.maxFreeRuns ? 'bg-rose-400' : 'bg-emerald-400'
                }`}
              />
              <span>
                {Math.max(0, quota.maxFreeRuns - quota.runsUsed)}/{quota.maxFreeRuns} FREE
              </span>
            </>
          )}
        </button>

        {/* Mode badge */}
        <span
          className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
            isFallback
              ? 'bg-warning/10 border-warning/20 text-warning'
              : 'bg-primary/10 border-primary/20 text-primary'
          }`}
          title={
            isFallback
              ? 'Running on local fallback data — start the FastAPI backend to connect live'
              : `Connected to backend v${health?.version ?? '?'}`
          }
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${isFallback ? 'bg-warning' : 'bg-primary'} animate-pulse`}
          />
          {isFallback ? 'Demo' : 'Live'}
        </span>

        {/* ⌘K search */}
        <button
          onClick={() => {
            const ev = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
            document.dispatchEvent(ev);
          }}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-2 text-muted hover:text-text text-xs transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
          aria-label="Open command palette (⌘K)"
        >
          <Search size={13} aria-hidden="true" />
          <span>Search</span>
          <kbd className="text-[10px] font-mono bg-surface-2 px-1 py-0.5 rounded border border-border">
            ⌘K
          </kbd>
        </button>

        {/* GitHub */}
        <a
          href={content.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-border bg-surface hover:bg-surface-2 text-muted hover:text-text transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="View source on GitHub"
        >
          <Github size={15} aria-hidden="true" />
        </a>

        {/* Theme toggle */}
        <ThemeToggle />
      </div>

      {/* Modals */}
      <ByokModal
        isOpen={isByokModalOpen}
        onClose={() => setIsByokModalOpen(false)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </header>
  );
}

