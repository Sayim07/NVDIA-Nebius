'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Search,
  Lock,
  ArrowRight,
  Database,
  Terminal,
  Zap,
} from 'lucide-react';
import { TiltCard } from './ui/TiltCard';

interface AirlockSectionProps {
  onOpenAirlock: () => void;
}

export const AirlockSection: React.FC<AirlockSectionProps> = ({ onOpenAirlock }) => {
  const steps = [
    {
      num: '01',
      title: 'Internal Prompt Ingestion',
      desc: 'Sensitive enterprise code, engineer emails, and staging URLs enter the agent runtime.',
      badge: 'UNTRUSTED INPUT',
      badgeColor: 'text-rose-400 bg-rose-950/60 border-rose-800/60',
    },
    {
      num: '02',
      title: 'Deterministic Regex Firewall',
      desc: 'Sub-millisecond pattern gate strips AWS keys, JWTs, and internal domains (`*.company.io`).',
      badge: '< 2MS LATENCY',
      badgeColor: 'text-amber-400 bg-amber-950/60 border-amber-800/60',
    },
    {
      num: '03',
      title: 'Nemotron Nano Semantic Scrub',
      desc: 'Tier 1 Nano removes engineer identities and corporate project codenames without data loss.',
      badge: 'ZERO-PII APPROVED',
      badgeColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60',
    },
    {
      num: '04',
      title: 'Sanitized Tavily Deep Search',
      desc: 'Only clean technology queries hit Tavily search APIs to retrieve live CVEs & release notes.',
      badge: '1 CREDIT / SEARCH',
      badgeColor: 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60',
    },
  ];

  return (
    <section id="airlock-tech" className="py-16 border-t border-slate-900/80">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-mono tracking-widest text-cyan-400 uppercase mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>[ TARGET: $3,000 BEST USE OF TAVILY ]</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-tight">
            THE PRIVACY-PRESERVING TAVILY{' '}
            <span className="font-editorial italic font-normal text-cyan-400 lowercase text-3xl sm:text-5xl">
              airlock.
            </span>
          </h2>
        </div>
        <p className="text-xs text-slate-400 max-w-md leading-relaxed font-sans">
          How HermesShield enables deep web scouting for zero-trust enterprise workloads without ever leaking proprietary credentials or infrastructure details.
        </p>
      </div>

      {/* 4-Step Pipeline Flow */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {steps.map((st, i) => (
          <TiltCard
            key={i}
            className="p-5 bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
                <span className="text-xs font-mono font-black text-cyan-400">
                  [ STEP {st.num} ]
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[9px] font-mono border font-semibold ${st.badgeColor}`}
                >
                  {st.badge}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-tight mb-2">
                {st.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                {st.desc}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/80 text-[10px] font-mono text-slate-500">
              PIPELINE LAYER 0{i + 1}
            </div>
          </TiltCard>
        ))}
      </div>

      {/* Interactive CTA Banner */}
      <div className="p-6 rounded-lg bg-gradient-to-r from-cyan-950/40 via-slate-900/80 to-slate-950 border border-cyan-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-2.5 rounded bg-cyan-950/70 border border-cyan-500/40 text-cyan-400 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-tight">
              Inspect Live Side-by-Side PII Scrubbing
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Compare the raw enterprise input against the sanitized outbound Tavily web query in the live console.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAirlock}
          className="flex items-center space-x-2 px-4 py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] shrink-0 self-start sm:self-center"
        >
          <span>OPEN AIRLOCK VIEW</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
};
