'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Lock, Database } from 'lucide-react';
import { TiltCard } from './ui/TiltCard';

export const MetricsRibbon: React.FC = () => {
  const stats = [
    {
      label: 'FINOPS COST REDUCTION',
      value: '-82.4%',
      sub: '$0.00142 vs $0.00806 baseline',
      icon: Zap,
      accent: 'text-emerald-400',
      border: 'hover:border-emerald-500/50',
    },
    {
      label: 'NEMOCLAW INTERCEPT LATENCY',
      value: '< 15ms',
      sub: 'Deterministic out-of-process check',
      icon: Lock,
      accent: 'text-rose-400',
      border: 'hover:border-rose-500/50',
    },
    {
      label: 'PROPRIETARY PII PRIVACY',
      value: '100%',
      sub: 'Regex + Nemotron Nano scrubbed',
      icon: ShieldCheck,
      accent: 'text-cyan-400',
      border: 'hover:border-cyan-500/50',
    },
    {
      label: 'SUBPROCESS ESCAPES',
      value: '0',
      sub: 'Strict declarative policy bounds',
      icon: Database,
      accent: 'text-violet-400',
      border: 'hover:border-violet-500/50',
    },
  ];

  return (
    <section id="finops-metrics" className="py-12 border-t border-slate-900/80">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <TiltCard
              key={idx}
              className={`p-5 bg-slate-900/60 border border-slate-800 ${s.border} transition-all`}
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
                <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
                  {s.label}
                </span>
                <Icon className={`w-3.5 h-3.5 ${s.accent}`} />
              </div>
              <div className={`text-3xl sm:text-4xl font-black font-mono tracking-tight ${s.accent} my-1`}>
                {s.value}
              </div>
              <p className="text-[11px] text-slate-500 font-mono mt-1">
                {s.sub}
              </p>
            </TiltCard>
          );
        })}
      </div>
    </section>
  );
};
