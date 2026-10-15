'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  Search,
  Zap,
  Brain,
  ArrowRight,
} from 'lucide-react';
import { TiltCard } from './ui/TiltCard';

interface ArchitectureShowcaseProps {
  onSelectConsoleTab: (tabId: string) => void;
}

export const ArchitectureShowcase: React.FC<ArchitectureShowcaseProps> = ({
  onSelectConsoleTab,
}) => {
  return (
    <section id="architecture" className="py-16 border-t border-slate-900/80">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-mono tracking-widest text-emerald-400 uppercase mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>[ SYSTEM ARCHITECTURE & SOVEREIGN PROTOCOLS ]</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-tight">
            BUILT FOR ZERO-TRUST{' '}
            <span className="font-editorial italic font-normal text-emerald-400 lowercase text-3xl sm:text-5xl">
              autonomy.
            </span>
          </h2>
        </div>
        <p className="text-xs text-slate-400 max-w-md leading-relaxed font-sans">
          Four interconnected, deterministic layers decouple LLM execution from direct operating system access and public web dispatch.
        </p>
      </div>

      {/* 4-Pillar Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pillar 1: NemoClaw */}
        <TiltCard className="p-5 bg-slate-900/80 border border-slate-800 hover:border-rose-500/50 transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
              <div className="p-2 rounded bg-rose-950/60 border border-rose-500/40 text-rose-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-rose-400 font-bold uppercase">
                [ LAYER 01 ]
              </span>
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-tight mb-2">
              NVIDIA NemoClaw Sandbox
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Out-of-process declarative firewall that intercepts every subprocess spawn. Rejects secret paths (`.env`, `id_rsa`) and dangerous binaries in &lt;15ms.
            </p>
          </div>

          <div className="pt-4 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
            <span className="text-[10px] text-slate-500">OPENSHELL RUNTIME</span>
            <button
              onClick={() => onSelectConsoleTab('security')}
              className="text-rose-400 hover:text-rose-300 flex items-center space-x-1 text-[11px] font-semibold"
            >
              <span>Test Guard</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </TiltCard>

        {/* Pillar 2: Tavily Airlock */}
        <TiltCard className="p-5 bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
              <div className="p-2 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
                <Search className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                [ LAYER 02 ]
              </span>
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-tight mb-2">
              Privacy Tavily Airlock
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Two-stage PII scrubbing pipeline: deterministic regex firewall + Tier 1 Nemotron Nano strips internal emails, hostnames, and secrets before Tavily dispatch.
            </p>
          </div>

          <div className="pt-4 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
            <span className="text-[10px] text-slate-500">24H CACHE SQLITE</span>
            <button
              onClick={() => onSelectConsoleTab('airlock')}
              className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 text-[11px] font-semibold"
            >
              <span>View Diff</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </TiltCard>

        {/* Pillar 3: Nebius 3-Tier FinOps */}
        <TiltCard className="p-5 bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
              <div className="p-2 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                [ LAYER 03 ]
              </span>
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-tight mb-2">
              Nebius 3-Tier FinOps
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dynamic model triage on Nebius Token Factory: Nano for gating ($0.0001/1k), Super for code parsing, Ultra for reasoning. Cuts inference cost by 82.4%.
            </p>
          </div>

          <div className="pt-4 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
            <span className="text-[10px] text-emerald-400 font-bold">-82.4% COST</span>
            <button
              onClick={() => onSelectConsoleTab('workspace')}
              className="text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 text-[11px] font-semibold"
            >
              <span>Inspect Telemetry</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </TiltCard>

        {/* Pillar 4: Skill Studio */}
        <TiltCard className="p-5 bg-slate-900/80 border border-slate-800 hover:border-violet-500/50 transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
              <div className="p-2 rounded bg-violet-950/60 border border-violet-500/40 text-violet-400">
                <Brain className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-violet-400 font-bold uppercase">
                [ LAYER 04 ]
              </span>
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-tight mb-2">
              Hermes Skill Studio
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Self-writing capability framework. Converts operational feedback into executable YAML skills in `data/skills/` and syncs long-term memory to `data/MEMORY.md`.
            </p>
          </div>

          <div className="pt-4 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
            <span className="text-[10px] text-slate-500">YAML COMPILER</span>
            <button
              onClick={() => onSelectConsoleTab('skills')}
              className="text-violet-400 hover:text-violet-300 flex items-center space-x-1 text-[11px] font-semibold"
            >
              <span>Compile Skills</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </TiltCard>
      </div>
    </section>
  );
};
