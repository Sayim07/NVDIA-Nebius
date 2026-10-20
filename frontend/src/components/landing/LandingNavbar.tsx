'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Github, ArrowRight, Menu } from 'lucide-react';
import { content } from '@/content/content';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface LandingNavbarProps {
  onGetStarted: () => void;
  onOpenMenu: () => void;
  isTransitioning?: boolean;
}

export function LandingNavbar({
  onGetStarted,
  onOpenMenu,
  isTransitioning = false,
}: LandingNavbarProps) {
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

      {/* Right Controls: GitHub + ThemeToggle + Small Get Started + Hamburger */}
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

        {/* Hamburger Menu Button */}
        <button
          id="hamburger-btn"
          onClick={onOpenMenu}
          className="p-2 rounded-lg border border-border bg-surface hover:bg-surface-2 text-text transition-all focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer flex items-center justify-center"
          aria-label="Open navigation menu"
          title="Open menu"
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
