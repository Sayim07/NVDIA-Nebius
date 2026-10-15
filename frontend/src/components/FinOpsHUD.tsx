'use client';

import React from 'react';
import { DollarSign, Clock, Zap } from 'lucide-react';
import { FinOpsTelemetry, HealthStatus } from '@/lib/types';
import { AnimatedCounter } from './ui/AnimatedCounter';

interface FinOpsHUDProps {
  telemetry: FinOpsTelemetry | null;
  health: HealthStatus | null;
}

export const FinOpsHUD: React.FC<FinOpsHUDProps> = ({ telemetry, health }) => {
  const isFallback = health?.is_fallback ?? true;
  const cost = telemetry?.total_cost_usd ?? 0.00142;
  const latency = (telemetry?.execution_latency_ms ?? 1940) / 1000;
  const reduction = telemetry?.cost_reduction_percent ?? 82.25;

  return (
    <div className="flex items-center space-x-2 md:space-x-3 text-[11px] font-mono tracking-tight">
      {/* FinOps Bracket Pill */}
      <div className="flex items-center px-3 py-1 rounded bg-slate-900/90 border border-slate-800/80 text-slate-300">
        <span className="text-slate-500 mr-1.5">[ FINOPS:</span>
        <AnimatedCounter value={cost} decimals={5} prefix="$" className="text-emerald-400 font-semibold" />
        <span className="text-slate-500 mx-1">|</span>
        <span className="text-emerald-400 font-medium">-{reduction.toFixed(1)}%</span>
        <span className="text-slate-500 ml-1">]</span>
      </div>

      {/* Latency Bracket Pill */}
      <div className="hidden sm:flex items-center px-3 py-1 rounded bg-slate-900/90 border border-slate-800/80 text-slate-300">
        <span className="text-slate-500 mr-1.5">[ LATENCY:</span>
        <AnimatedCounter value={latency} decimals={2} suffix="s" className="text-cyan-400 font-semibold" />
        <span className="text-slate-500 ml-1">]</span>
      </div>

      {/* Engine Status Bracket Pill */}
      <div className="flex items-center px-3 py-1 rounded bg-slate-900/90 border border-slate-800/80 text-slate-300">
        <span
          className={`w-1.5 h-1.5 rounded-full mr-2 ${
            isFallback ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.7)]'
          }`}
        />
        <span className="text-slate-400 text-[10px] uppercase tracking-wider">
          {isFallback ? '[ OFFLINE SIM ]' : '[ NEBIUS 3-TIER ]'}
        </span>
      </div>
    </div>
  );
};
