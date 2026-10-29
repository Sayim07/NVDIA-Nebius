'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  ShieldAlert,
  Lock,
  Brain,
  BarChart2,
  HelpCircle,
  Info,
  Home,
  ChevronRight,
  X,
  Shield,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export interface NavRoute {
  href: string;
  label: string;
  description: string;
  icon: React.ElementType;
}

export const APP_ROUTES: NavRoute[] = [
  {
    href: '/app',
    label: 'Dashboard',
    description: 'Overview, stats and quick actions',
    icon: LayoutDashboard,
  },
  {
    href: '/app/briefing',
    label: 'Workspace briefing',
    description: 'Run presets and read results',
    icon: FileText,
  },
  {
    href: '/app/airlock',
    label: 'Privacy airlock',
    description: 'See what gets removed before each search',
    icon: ShieldAlert,
  },
  {
    href: '/app/security',
    label: 'Security & sandbox',
    description: 'Policy log and injection tests',
    icon: Lock,
  },
  {
    href: '/app/skills',
    label: 'Skills & memory',
    description: 'What the agent remembers and knows',
    icon: Brain,
  },
  {
    href: '/app/costs',
    label: 'Cost & speed',
    description: 'Token usage and model tier breakdown',
    icon: BarChart2,
  },
  {
    href: '/app/how-it-works',
    label: 'How it works',
    description: 'Architecture and pipeline overview',
    icon: HelpCircle,
  },
  {
    href: '/app/about',
    label: 'About & links',
    description: 'GitHub, demo video, tech stack',
    icon: Info,
  },
];

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

function SidebarContent({
  collapsed,
  onLinkClick,
}: {
  collapsed: boolean;
  onLinkClick?: () => void;
}) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/app') return pathname === '/app';
    return pathname.startsWith(href);
  };

  return (
    <nav className="flex-1 overflow-y-auto py-3 px-2">
      <ul className="space-y-1">
        {APP_ROUTES.map((route) => {
          const Icon = route.icon;
          const active = isActive(route.href);
          return (
            <li key={route.href}>
              <Link
                href={route.href}
                prefetch
                onClick={onLinkClick}
                className={`group relative flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary ${
                  active
                    ? 'bg-primary/10 text-primary border border-primary/20 font-medium'
                    : 'text-muted hover:text-text hover:bg-surface-2/70 border border-transparent'
                }`}
                aria-current={active ? 'page' : undefined}
                title={collapsed ? route.label : undefined}
              >
                {/* Active indicator dot */}
                {active && (
                  <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-4 bg-primary rounded-r-full" />
                )}

                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    active ? 'text-primary' : 'text-muted group-hover:text-text'
                  }`}
                  aria-hidden="true"
                />

                {!collapsed && (
                  <div className="flex-1 min-w-0 flex items-center justify-between">
                    <span className="text-xs truncate">
                      {route.label}
                    </span>
                  </div>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// ─── Desktop Sidebar (collapsed / expanded) ──────────────────────────────────
export function DesktopSidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <aside
      className={`hidden lg:flex flex-col shrink-0 h-screen sticky top-0 border-r border-border bg-surface transition-[width] duration-200 ease-in-out overflow-hidden z-20 ${
        collapsed ? 'w-[72px]' : 'w-[230px]'
      }`}
      aria-label="App navigation"
    >
      {/* Logo row */}
      <div className="flex items-center gap-2.5 px-3 py-3.5 border-b border-border">
        <button
          onClick={onToggle}
          className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg border border-border bg-surface-2 hover:bg-primary/10 hover:border-primary/30 text-text transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-primary cursor-pointer"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
        >
          <motion.span
            animate={{ rotate: collapsed ? 0 : 180 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center"
          >
            <ChevronRight size={15} className="text-muted" />
          </motion.span>
        </button>

        {!collapsed && (
          <div className="flex items-center justify-between flex-1 min-w-0 pr-1">
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-heading font-semibold text-xs tracking-tight text-text truncate">
                HermesShield
              </span>
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" title="System Online" />
          </div>
        )}
      </div>

      {/* Nav links */}
      <SidebarContent collapsed={collapsed} />

      {/* Footer */}
      <div className="border-t border-border p-2.5 flex items-center gap-2 bg-surface">
        <Link
          href="/"
          className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg border border-border bg-surface-2 hover:bg-primary/10 hover:border-primary/30 text-muted hover:text-primary transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          aria-label="Back to landing page"
          title="Back to landing page"
        >
          <Home size={15} />
        </Link>
        {!collapsed && (
          <div className="flex items-center gap-2 flex-1 justify-between">
            <span className="text-[10px] font-mono text-muted/80">MIT · SOVEREIGN</span>
            <ThemeToggle />
          </div>
        )}
      </div>
    </aside>
  );
}

// ─── Mobile Drawer ────────────────────────────────────────────────────────────
export function MobileDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Focus trap + scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);

    const focusables = drawerRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    );
    focusables?.[0]?.focus();

    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-bg/80 backdrop-blur-sm lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="App navigation"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 h-full w-72 z-50 flex flex-col bg-surface border-r border-border shadow-float lg:hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="font-heading font-semibold text-sm text-text">HermesShield</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-surface-2 hover:bg-primary/10 text-muted hover:text-primary transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-primary cursor-pointer"
                aria-label="Close navigation menu"
              >
                <X size={15} />
              </button>
            </div>

            {/* Nav */}
            <SidebarContent collapsed={false} onLinkClick={onClose} />

            {/* Footer */}
            <div className="border-t border-border p-3.5 space-y-2.5">
              <Link
                href="/"
                onClick={onClose}
                className="flex items-center gap-2 text-xs text-muted hover:text-primary transition-colors"
              >
                <Home size={14} />
                <span>Return to Landing Page</span>
              </Link>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] font-mono text-muted/70">MIT License · v1.0.0</span>
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
