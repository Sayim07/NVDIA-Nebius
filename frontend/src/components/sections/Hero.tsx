/**
 * Section 2: Hero
 * Calm, professional, premium hero with plain English copy, dual CTAs, product browser frame mockup, and trust row.
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { content } from '@/content/content';
import { Magnetic } from '@/components/ui/Magnetic';
import {
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Search,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface HeroProps {
  onScrollToConsole: () => void;
  onSimulateAttack: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onScrollToConsole,
  onSimulateAttack,
}) => {
  return (
    <section className="relative pt-24 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 overflow-hidden bg-bg">
      {/* Soft light dotted grid + gentle forest radial wash */}
      <div
        className="absolute inset-0 bg-grid-pattern-light pointer-events-none opacity-80"
        aria-hidden="true"
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(11,110,79,0.06),transparent_70%)] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Top Eyebrow Pill: Lime dot + sentence case + no brackets */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex items-center justify-start mb-6"
        >
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-surface border border-border shadow-soft text-xs font-medium text-ink">
            <span className="w-2 h-2 rounded-full bg-highlight shrink-0" />
            <span>{content.hero.eyebrow}</span>
          </div>
        </motion.div>

        {/* H1: Sentence case, max 2 lines, normal tracking, optional single italic serif word */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: 'easeOut' }}
          className="font-heading text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold text-ink leading-[1.12] tracking-[-0.02em] max-w-4xl"
        >
          {content.hero.titleLead}{' '}
          <span className="font-editorial italic font-normal text-primary">
            {content.hero.titleAccent}
          </span>
        </motion.h1>

        {/* Plain-English Subtext: 17-18px, line-height 1.6, max 65 chars per line */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16, ease: 'easeOut' }}
          className="mt-6 text-lg sm:text-[19px] text-ink-muted leading-[1.6] max-w-2xl font-sans"
        >
          {content.hero.subtext}
        </motion.p>

        {/* CTAs: "Try the demo" (primary, magnetic) · "Watch the attack get blocked" */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24, ease: 'easeOut' }}
          className="mt-8 flex flex-wrap items-center gap-3.5"
        >
          <Magnetic strength={0.2}>
            <button
              onClick={onScrollToConsole}
              aria-label="Try the demo"
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-medium text-sm transition-all duration-200 shadow-soft hover:shadow-card hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <span>{content.hero.primaryCta}</span>
              <ArrowRight className="w-4 h-4 stroke-[2]" />
            </button>
          </Magnetic>

          <button
            onClick={onSimulateAttack}
            aria-label="Watch the attack get blocked"
            className="inline-flex items-center space-x-2 px-4 py-3 rounded-xl bg-surface hover:bg-surface-2 text-ink border border-border font-medium text-sm transition-all duration-200 shadow-soft hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
          >
            <ShieldAlert className="w-4 h-4 text-danger shrink-0" />
            <span>{content.hero.secondaryCta}</span>
          </button>
        </motion.div>

        {/* Product Mockup in Clean Browser Frame (Real UI, showing Privacy Airlock Diff) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.32, ease: 'easeOut' }}
          className="mt-12 sm:mt-16 rounded-2xl bg-surface border border-border shadow-card overflow-hidden"
        >
          {/* Browser Window Chrome */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-2/60">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-[#E3E6E0]" />
              <span className="w-3 h-3 rounded-full bg-[#E3E6E0]" />
              <span className="w-3 h-3 rounded-full bg-[#E3E6E0]" />
            </div>
            <div className="flex items-center space-x-2 px-3 py-1 rounded-md bg-surface border border-border text-xs font-mono text-ink-muted">
              <Lock className="w-3 h-3 text-primary shrink-0" />
              <span>hermesshield.local/airlock</span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-mono text-primary font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-highlight animate-pulse" />
              <span>Airlock active</span>
            </div>
          </div>

          {/* Browser Content: Side-by-side Before/After Privacy Scrubbing */}
          <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-2 gap-5 bg-surface">
            {/* Left Column: What your AI wanted to search */}
            <div className="rounded-xl border border-border bg-surface-2/40 p-4 sm:p-5 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-ink uppercase tracking-wide">
                    What your AI wanted to search
                  </span>
                  <span className="text-[11px] font-mono text-danger font-medium px-2 py-0.5 rounded bg-danger-subtle border border-danger/20">
                    3 secrets detected
                  </span>
                </div>
                <div className="text-sm font-mono text-ink-muted leading-relaxed bg-surface p-3 rounded-lg border border-border/80">
                  Audit staging auth at{' '}
                  <span className="bg-danger-subtle text-danger font-semibold px-1 rounded border border-danger/30">
                    api.internal-titan.corp
                  </span>{' '}
                  for{' '}
                  <span className="bg-danger-subtle text-danger font-semibold px-1 rounded border border-danger/30">
                    sayim@internal.corp
                  </span>{' '}
                  with JWT{' '}
                  <span className="bg-danger-subtle text-danger font-semibold px-1 rounded border border-danger/30">
                    eyJhbGciOi...
                  </span>{' '}
                  and check for FastAPI CVEs.
                </div>
              </div>

              <div className="text-[12px] text-ink-muted flex items-center space-x-1.5 pt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-danger" />
                <span>Blocked from leaving your computer</span>
              </div>
            </div>

            {/* Right Column: Cleaned query sent to Tavily */}
            <div className="rounded-xl border border-primary/20 bg-primary-subtle/30 p-4 sm:p-5 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                    Cleaned query sent to Tavily
                  </span>
                  <span className="text-[11px] font-mono text-primary font-medium px-2 py-0.5 rounded bg-surface border border-primary/20 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-primary" />
                    <span>Zero secrets</span>
                  </span>
                </div>
                <div className="text-sm font-mono text-ink leading-relaxed bg-surface p-3 rounded-lg border border-primary/20">
                  FastAPI security advisory CVE-2024 OAuth2 authentication token bypass
                </div>
              </div>

              <div className="flex items-center justify-between text-[12px] text-ink-muted pt-1">
                <span className="flex items-center space-x-1.5 text-primary font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  <span>Clean search dispatched to Tavily</span>
                </span>
                <span className="font-mono text-[11px] text-ink-subtle">12.4 ms</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trust Row Under Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
          className="mt-12 sm:mt-16 pt-8 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <p className="text-xs font-medium uppercase tracking-wider text-ink-subtle shrink-0">
            {content.hero.trustLabel}
          </p>

          <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 sm:gap-8">
            {content.hero.trustLogos.map((item) => (
              <div
                key={item.name}
                className="flex items-center space-x-2 text-ink-muted hover:text-ink transition-colors"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-highlight shrink-0" />
                <span className="text-sm font-medium">{item.name}</span>
                <span className="hidden lg:inline text-xs font-mono text-ink-subtle">
                  · {item.category}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
