'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  Search,
  Github,
  Shield,
  ChevronRight,
  LayoutDashboard,
  FileText,
  ShieldAlert,
  Lock,
  Brain,
  BarChart2,
  HelpCircle,
  SidebarClose,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { CircularCommandMenu, CommandItem } from '@/components/ui/circular-command-menu';
import { APP_ROUTES } from './AppSidebar';
import { useAppState } from './AppStateProvider';
import { content } from '@/content/content';

interface AppTopBarProps {
  onMenuToggle: () => void;
}

export function AppTopBar({ onMenuToggle }: AppTopBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isFallback, health } = useAppState();

  // Find current route label for breadcrumb
  const currentRoute = APP_ROUTES.find((r) => {
    if (r.href === '/app') return pathname === '/app';
    return pathname.startsWith(r.href);
  });

  const pageTitle = currentRoute?.label ?? 'Dashboard';

  const circularItems: CommandItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      shortcut: 'D',
      icon: <LayoutDashboard size={16} className="text-primary" />,
      onClick: () => router.push('/app'),
    },
    {
      id: 'briefing',
      label: 'Briefing',
      shortcut: 'B',
      icon: <FileText size={16} className="text-emerald-400" />,
      onClick: () => router.push('/app/briefing'),
    },
    {
      id: 'airlock',
      label: 'Privacy Airlock',
      shortcut: 'A',
      icon: <ShieldAlert size={16} className="text-cyan-400" />,
      onClick: () => router.push('/app/airlock'),
    },
    {
      id: 'security',
      label: 'Security & Sandbox',
      shortcut: 'S',
      icon: <Lock size={16} className="text-rose-400" />,
      onClick: () => router.push('/app/security'),
    },
    {
      id: 'skills',
      label: 'Skills & Memory',
      shortcut: 'M',
      icon: <Brain size={16} className="text-violet-400" />,
      onClick: () => router.push('/app/skills'),
    },
    {
      id: 'costs',
      label: 'Cost & Speed',
      shortcut: 'C',
      icon: <BarChart2 size={16} className="text-amber-400" />,
      onClick: () => router.push('/app/costs'),
    },
    {
      id: 'sidebar',
      label: 'Toggle Sidebar',
      shortcut: 'T',
      icon: <SidebarClose size={16} className="text-text" />,
      onClick: onMenuToggle,
    },
  ];

  return (
    <header className="sticky top-0 z-30 w-full h-14 flex items-center gap-3 px-4 bg-bg/90 backdrop-blur-md border-b border-border">
      {/* Circular Command Menu replacing the old hamburger button */}
      <div id="app-topbar-menu" className="relative z-50 shrink-0">
        <CircularCommandMenu
          items={circularItems}
          radius={140}
          startAngle={-5}
          totalAngle={95}
          trigger={<Menu size={16} aria-hidden="true" />}
        />
      </div>

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
    </header>
  );
}
