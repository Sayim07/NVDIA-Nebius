/**
 * Section 1: Navbar
 * Fixed/sticky responsive navigation header with scroll glassmorphism, ⌘K trigger, mobile drawer, and direct console jump.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { content } from '@/content/content';
import { Search, Menu, X, ArrowUpRight, Terminal } from 'lucide-react';
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
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#07090D]/85 backdrop-blur-md border-b border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.5)]'
          : 'bg-transparent border-b border-white/[0.04]'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <a
          href="#"
          className="flex items-center space-x-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-nvidia rounded-lg py-1 px-1.5 transition-transform"
          aria-label="HermesShield Home"
        >
          <div className="w-8 h-8 rounded-lg bg-surface-2 border border-white/10 flex items-center justify-center group-hover:border-nvidia/50 transition-colors">
            <span className="w-2.5 h-2.5 rounded-full bg-nvidia group-hover:shadow-[0_0_12px_rgba(118,185,0,0.8)] transition-all" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="font-heading font-bold text-lg sm:text-xl tracking-tight text-white group-hover:text-nvidia transition-colors">
              {content.meta.name}
            </span>
            <span className="text-nvidia font-mono text-sm font-semibold">°</span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center space-x-8 text-sm font-medium text-white/70"
        >
          {content.nav.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-white transition-colors duration-150 focus:outline-none focus-visible:text-nvidia"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Actions: ⌘K Search + Launch Console Button */}
        <div className="flex items-center space-x-3 shrink-0">
          {/* ⌘K Trigger Button */}
          <button
            onClick={onOpenCommand}
            aria-label="Open command palette (Press ⌘K)"
            className="flex items-center space-x-2 px-3 py-1.5 text-xs font-mono text-white/60 hover:text-white bg-surface-1 hover:bg-surface-2 border border-white/[0.08] hover:border-white/[0.16] rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-nvidia"
          >
            <Search className="w-3.5 h-3.5 text-white/50" />
            <span className="hidden sm:inline">{content.nav.searchLabel}</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-surface-3 text-white/70 rounded border border-white/10 font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Primary Launch Console Button */}
          <button
            onClick={onScrollToConsole}
            aria-label="Launch live console runtime"
            className="hidden sm:inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-nvidia hover:bg-nvidia-hover text-black text-xs font-semibold tracking-wide transition-all duration-200 shadow-[0_0_20px_rgba(118,185,0,0.25)] hover:shadow-[0_0_28px_rgba(118,185,0,0.45)] hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <span>{content.nav.cta}</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation drawer' : 'Open navigation drawer'}
            aria-expanded={mobileMenuOpen}
            className="md:hidden p-2 rounded-lg bg-surface-1 border border-white/[0.08] text-white/80 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-nvidia"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden border-b border-white/[0.08] bg-[#07090D]/95 backdrop-blur-xl px-4 py-6 space-y-4"
          >
            <div className="flex flex-col space-y-3">
              {content.nav.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-base font-medium text-white/80 hover:text-white hover:bg-surface-2 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="pt-4 border-t border-white/[0.08] space-y-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onScrollToConsole();
                }}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-lg bg-nvidia hover:bg-nvidia-hover text-black text-sm font-semibold tracking-wide transition-all shadow-[0_0_15px_rgba(118,185,0,0.3)]"
              >
                <Terminal className="w-4 h-4" />
                <span>{content.nav.cta}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
