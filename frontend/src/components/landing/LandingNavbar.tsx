'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Shield,
  Github,
  ArrowRight,
  ShieldAlert,
  TrendingDown,
  Lock,
  Brain,
  Layers,
  Play,
  LayoutDashboard,
} from 'lucide-react';
import { content } from '@/content/content';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { CircularCommandMenu, CommandItem } from '@/components/ui/circular-command-menu';

interface LandingNavbarProps {
  onGetStarted: () => void;
  onOpenMenu?: () => void;
  onOpenVideo?: () => void;
  isTransitioning?: boolean;
}

export function LandingNavbar({
  onGetStarted,
  onOpenVideo,
  isTransitioning = false,
}: LandingNavbarProps) {
  const router = useRouter();

  const commandItems: CommandItem[] = [
    {
      id: 'app',
      label: 'Open App',
      shortcut: '↵',
      icon: <LayoutDashboard className="w-4 h-4 text-primary" />,
      onClick: () => router.push('/app'),
    },
    {
      id: 'airlock',
      label: 'Privacy Airlock',
      shortcut: 'A',
      icon: <ShieldAlert className="w-4 h-4 text-cyan-400" />,
      onClick: () => router.push('/app/airlock'),
    },
    {
      id: 'costs',
      label: 'Cost & Speed',
      shortcut: 'C',
      icon: <TrendingDown className="w-4 h-4 text-amber-400" />,
      onClick: () => router.push('/app/costs'),
    },
    {
      id: 'security',
      label: 'Security & Sandbox',
      shortcut: 'S',
      icon: <Lock className="w-4 h-4 text-rose-400" />,
      onClick: () => router.push('/app/security'),
    },
    {
      id: 'skills',
      label: 'Skills Studio',
      shortcut: 'M',
      icon: <Brain className="w-4 h-4 text-violet-400" />,
      onClick: () => router.push('/app/skills'),
    },
    {
      id: 'video',
      label: 'Watch 3m Demo',
      shortcut: 'V',
      icon: <Play className="w-4 h-4 text-emerald-400" />,
      onClick: () => onOpenVideo?.(),
    },
  ];

  return (
    <header className="relative z-30 w-full max-w-7xl mx-auto px-6 sm:px-8 py-5 flex items-center justify-between">
      {/* Brand Logo: Shield mark + HermesShield */}
      <Link
        href="/"
        className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
      >
        <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shadow-sm">
          <Shield className="w-4 h-4 fill-primary/20 text-primary" />
        </div>
        <span className="font-heading font-semibold text-base sm:text-lg tracking-tight text-text">
          {content.meta.name}
        </span>
      </Link>

      {/* Right Controls: GitHub + ThemeToggle + Small Get Started + Circular Command Menu */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* GitHub link */}
        <a
          href={content.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg text-muted hover:text-text hover:bg-surface-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
          aria-label="GitHub Repository"
        >
          <Github className="w-4 h-4" />
        </a>

        {/* Theme Toggle (Sun/Moon animated) */}
        <ThemeToggle />

        {/* Small "Get started" button */}
        <button
          id="nav-get-started-btn"
          onClick={onGetStarted}
          disabled={isTransitioning}
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-primary-fg bg-primary hover:opacity-95 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
        >
          <span>Get started</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {/* Circular Command Menu replacing the old hamburger menu */}
        <div id="circular-nav-menu" className="relative z-50">
          <CircularCommandMenu
            items={commandItems}
            radius={150}
            startAngle={85}
            totalAngle={100}
            className="z-50"
          />
        </div>
      </div>
    </header>
  );
}
