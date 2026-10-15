'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ShieldCheck, Terminal, AlertTriangle, Sparkles } from 'lucide-react';
import { Magnetic } from './ui/Magnetic';

interface EditorialHeroProps {
  onScrollToConsole: () => void;
  onSimulateAttack: () => void;
}

export const EditorialHero: React.FC<EditorialHeroProps> = ({
  onScrollToConsole,
  onSimulateAttack,
}) => {
  const marqueeItems = [
    'NVIDIA NEMOCLAW',
    'NEBIUS TOKEN FACTORY',
    'PRIVACY TAVILY AIRLOCK',
    'OPENSHELL SANDBOX',
    'NEMOTRON-3-NANO',
    'NEMOTRON-3-SUPER',
    'NEMOTRON-3-ULTRA',
    'PYJWT SECURE DECODE',
    'FASTAPI RUNTIME',
    'SQLITE AUDIT LEDGER',
  ];

  return (
    <section id="overview" className="relative pt-6 pb-12 overflow-hidden">
      {/* Subtle Ambient Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[250px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Top Protocol Status Rail */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between text-[10px] font-mono tracking-widest text-slate-500 uppercase pb-6 border-b border-slate-900/80"
      >
        <span className="flex items-center space-x-1.5 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>[ NEMOCLAW FOR HERMES AGENT ]</span>
        </span>
        <span className="hidden sm:inline text-slate-400">
          [ NEBIUS X NVIDIA HACKATHON 2026 // PERSONAL AI TRACK ]
        </span>
        <span className="text-slate-400">[ ZERO-TRUST RUNTIME // ACTIVE ]</span>
      </motion.div>

      {/* Massive Editorial Headline with Stagger Animation */}
      <div className="my-8 sm:my-12">
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase leading-[1.04]"
        >
          WE BELIEVE PERSONAL AI MUST BE{' '}
          <span className="font-editorial italic font-normal text-emerald-400 lowercase text-5xl sm:text-7xl lg:text-8xl tracking-normal">
            uncompromised
          </span>{' '}
          IN PRIVACY, DATA-DENSE, AND{' '}
          <span className="font-editorial italic font-normal text-cyan-400 lowercase text-5xl sm:text-7xl lg:text-8xl tracking-normal">
            sovereign.
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 max-w-3xl space-y-3"
        >
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            <strong className="text-white font-semibold">HermesShield</strong> is an autonomous, self-learning executive and deep-web scout. Every prompt, web dispatch, and tool execution is guarded out-of-process by <strong className="text-emerald-400 font-semibold">NVIDIA NemoClaw</strong>, dynamic <strong className="text-white">3-tier Nemotron routing</strong> on Nebius Token Factory, and a <strong className="text-cyan-400 font-semibold">Privacy-Preserving Tavily Airlock</strong>.
          </p>
        </motion.div>

        {/* Hero Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4"
        >
          <Magnetic>
            <button
              onClick={onScrollToConsole}
              className="flex items-center space-x-2 px-5 py-3 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-mono font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
            >
              <Terminal className="w-4 h-4" />
              <span>[ LAUNCH EXECUTIVE CONSOLE ]</span>
              <ArrowDown className="w-3.5 h-3.5 ml-1 animate-bounce" />
            </button>
          </Magnetic>

          <Magnetic>
            <button
              onClick={onSimulateAttack}
              className="flex items-center space-x-2 px-4 py-3 rounded bg-slate-900/90 hover:bg-rose-950/60 text-slate-200 hover:text-rose-300 border border-slate-800 hover:border-rose-500/50 text-xs font-mono font-semibold uppercase tracking-wider transition-all"
            >
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>[ SIMULATE PROMPT INJECTION ]</span>
            </button>
          </Magnetic>
        </motion.div>
      </div>

      {/* Ticker / Infinite Marquee Bar */}
      <div className="pt-8 pb-4 border-t border-b border-slate-900/80">
        <div className="flex items-center text-[10px] font-mono tracking-widest text-slate-400 gap-6 overflow-x-auto no-scrollbar py-1">
          {marqueeItems.concat(marqueeItems).map((tech, i) => (
            <div key={i} className="flex items-center space-x-3 shrink-0">
              <span className="text-emerald-400">✦</span>
              <span className="text-slate-400 uppercase font-semibold">{tech}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
