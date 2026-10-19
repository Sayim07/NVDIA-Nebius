/**
 * Section 2: Hero
 * 10-second elevator pitch with headline, italic serif accent, dual CTAs, trust row, and lightweight background mesh.
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { content } from '@/content/content';
import { HeroMesh } from '@/components/ui/HeroMesh';
import { Magnetic } from '@/components/ui/Magnetic';
import { Terminal, ShieldAlert, ArrowDown, Sparkles, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onScrollToConsole: () => void;
  onSimulateAttack: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onScrollToConsole,
  onSimulateAttack,
}) => {
  return (
    <section
      id="overview"
      className="relative pt-28 sm:pt-36 lg:pt-44 pb-16 sm:pb-24 overflow-hidden"
    >
      {/* Background Interactive Mesh (Respects prefers-reduced-motion) */}
      <HeroMesh />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Eyebrow Pill Badge (No square brackets) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex items-center space-x-2.5 mb-6"
        >
          <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-surface-1 border border-white/10 text-xs text-white/80 font-mono tracking-tight shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-nvidia animate-pulse" />
            <span>{content.hero.eyebrow}</span>
          </span>
        </motion.div>

        {/* Shorter Headline, Max 2 Lines with Italic Serif Accent Word */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] max-w-4xl"
        >
          {content.hero.titleLead}{' '}
          <span className="font-editorial italic font-normal text-nvidia text-5xl sm:text-7xl lg:text-8xl tracking-normal">
            {content.hero.titleAccent}
          </span>
        </motion.h1>

        {/* Plain-English Subtext (2 Sentences Max, >= 16px, >= 70% contrast) */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 max-w-2xl text-base sm:text-lg text-white/75 leading-relaxed font-sans"
        >
          {content.hero.subtext}
        </motion.p>

        {/* Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Magnetic strength={0.25}>
            <button
              onClick={onScrollToConsole}
              aria-label="Launch interactive console"
              className="inline-flex items-center space-x-2.5 px-6 py-3.5 rounded-xl bg-nvidia hover:bg-nvidia-hover text-black font-semibold text-sm transition-all duration-200 shadow-[0_0_24px_rgba(118,185,0,0.3)] hover:shadow-[0_0_36px_rgba(118,185,0,0.5)] hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Terminal className="w-4 h-4 stroke-[2.5]" />
              <span>{content.hero.primaryCta}</span>
              <ArrowDown className="w-4 h-4 stroke-[2] animate-bounce" />
            </button>
          </Magnetic>

          <Magnetic strength={0.25}>
            <button
              onClick={onSimulateAttack}
              aria-label="Simulate prompt injection attack"
              className="inline-flex items-center space-x-2.5 px-6 py-3.5 rounded-xl bg-surface-1 hover:bg-threat-surface text-white/90 hover:text-threat border border-white/10 hover:border-threat-border font-medium text-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-threat"
            >
              <ShieldAlert className="w-4 h-4 text-threat" />
              <span>{content.hero.secondaryCta}</span>
            </button>
          </Magnetic>
        </motion.div>

        {/* Trust Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 pt-8 border-t border-white/[0.08]"
        >
          <p className="text-xs font-mono uppercase tracking-wider text-white/40 mb-4">
            {content.hero.trustRowLabel}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {content.hero.trustLogos.map((item) => (
              <div
                key={item.name}
                className="flex flex-col p-3.5 rounded-xl bg-surface-1/60 border border-white/[0.06] hover:border-white/[0.14] transition-colors"
              >
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-nvidia shrink-0" />
                  <span className="font-heading font-medium text-sm text-white/90 truncate">
                    {item.name}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-white/40 mt-1 pl-5 truncate">
                  {item.tag}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
