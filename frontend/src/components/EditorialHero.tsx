'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const EditorialHero: React.FC = () => {
  return (
    <section className="pt-6 pb-8 border-b border-slate-900/80">
      {/* Top Micro-Metadata Rail */}
      <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-slate-500 uppercase pb-4">
        <span>[ ARCHITECTURE // NEMOCLAW FOR HERMES AGENT ]</span>
        <span className="hidden md:inline">[ HACKATHON // NEBIUS X NVIDIA 2026 ]</span>
        <span>[ ZERO-TRUST PROTOCOL // ACTIVE ]</span>
      </div>

      {/* Massive Editorial Headline */}
      <div className="my-4">
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-[1.05]">
          WE BELIEVE PERSONAL AI MUST BE{' '}
          <span className="font-editorial italic font-normal text-emerald-400 lowercase text-4xl sm:text-6xl lg:text-7xl tracking-normal">
            uncompromised
          </span>{' '}
          IN PRIVACY, DATA-DENSE, AND{' '}
          <span className="font-editorial italic font-normal text-cyan-400 lowercase text-4xl sm:text-6xl lg:text-7xl tracking-normal">
            sovereign.
          </span>
        </h2>

        <div className="mt-4 max-w-3xl">
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
            At <strong className="text-slate-200 font-semibold">HermesShield</strong>, every user prompt, web search inquiry, and shell execution is guarded out-of-process by <strong className="text-slate-200">NVIDIA NemoClaw</strong>, dynamic <strong className="text-slate-200">3-tier Nemotron routing</strong> on Nebius Token Factory, and a <strong className="text-slate-200">Privacy-Preserving Tavily Airlock</strong>.
          </p>
        </div>
      </div>

      {/* Horizontal Editorial Divider with Bracket Markers */}
      <div className="pt-4 flex items-center text-[10px] font-mono text-slate-600 gap-3">
        <span className="text-slate-400 whitespace-nowrap">[ 01 // REASONING RUNTIME ]</span>
        <div className="flex-1 h-[1px] bg-slate-900" />
        <span className="text-slate-400 whitespace-nowrap hidden sm:inline">[ 02 // PRIVACY AIRLOCK ]</span>
        <div className="flex-1 h-[1px] bg-slate-900 hidden sm:block" />
        <span className="text-slate-400 whitespace-nowrap">[ 03 // FINOPS ACCREDITED ]</span>
      </div>
    </section>
  );
};
