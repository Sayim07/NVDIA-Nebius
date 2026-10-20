/**
 * Section 1: Navbar
 * Clean, single-line navigation header with Paper & Forest aesthetic, glassmorphic scroll, ⌘K trigger, and mobile drawer.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { content } from '@/content/content';
import { ShieldCheck, Search, Menu, X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onOpenCommand: () => void;
  onScrollToConsole: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCommand,
  onScrollToConsole,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-surface/85 backdrop-blur-md border-b border-border shadow-soft'
          : 'bg-bg/80 backdrop-blur-sm border-b border-border/50'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand / Logo: Shield mark + HermesShield (no degree symbol) */}
        <a
          href="#"
          className="flex items-center space-x-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg py-1 px-1.5 transition-transform"
          aria-label="HermesShield Home"
        >
          <div className="w-8 h-8 rounded-lg bg-primary-subtle border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-200">
            <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className="font-heading font-semibold text-lg tracking-tight text-ink group-hover:text-primary transition-colors duration-150">
            {content.nav.logoText}
          </span>
        </a>

        {/* Center: Desktop Navigation Links (single line, separated with subtle dots) */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center space-x-7 text-sm font-medium text-ink-muted"
        >
          {content.nav.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-ink transition-colors duration-150 focus:outline-none focus-visible:text-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Actions: ⌘K icon button · "Try the demo" */}
        <div className="flex items-center space-x-2.5 shrink-0">
          {/* ⌘K Trigger Button */}
          <button
            onClick={onOpenCommand}
            aria-label="Open command palette (Press ⌘K)"
            className="flex items-center space-x-2 px-2.5 py-1.5 text-xs font-medium text-ink-muted hover:text-ink bg-surface hover:bg-surface-2 border border-border rounded-lg shadow-soft transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Search className="w-3.5 h-3.5 text-ink-subtle" />
            <span className="hidden sm:inline font-mono text-[11px] text-ink-subtle bg-surface-2 px-1.5 py-0.5 rounded border border-border">
              ⌘K
            </span>
          </button>

          {/* Primary CTA: "Try the demo" */}
          <button
            onClick={onScrollToConsole}
            aria-label="Try the demo"
            className="hidden sm:inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-medium transition-all duration-200 shadow-soft hover:shadow-card hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <span>{content.nav.cta}</span>
            <ArrowUpRight className="w-4 h-4 stroke-[2]" />
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="md:hidden p-2 rounded-lg bg-surface border border-border text-ink-muted hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="md:hidden border-b border-border bg-surface/95 backdrop-blur-lg px-4 py-5 space-y-4"
          >
            <div className="flex flex-col space-y-2">
              {content.nav.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-ink-muted hover:text-ink hover:bg-surface-2 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="pt-3 border-t border-border">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onScrollToConsole();
                }}
                className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-medium transition-all shadow-soft"
              >
                <span>{content.nav.cta}</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
