'use client';

import React from 'react';
import { FinOpsTelemetry, HealthStatus } from '@/lib/types';
import { AnimatedCounter } from './ui/AnimatedCounter';
import { Activity, ShieldCheck, Zap } from 'lucide-react';

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
    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono">
      {/* FinOps Cost Pill */}
      <div className="flex items-center px-3 py-1.5 rounded bg-slate-950/80 border border-slate-800 text-slate-300 whitespace-nowrap">
        <span className="text-slate-500 mr-2 text-[10px] tracking-wider uppercase">FINOPS COST:</span>
        <AnimatedCounter value={cost} decimals={5} prefix="$" className="text-emerald-400 font-bold" />
        <span className="text-slate-600 mx-1.5">/</span>
        <span className="text-emerald-400 font-semibold text-[11px]">-{reduction.toFixed(1)}% SAVINGS</span>
      </div>

      {/* Latency Pill */}
      <div className="flex items-center px-3 py-1.5 rounded bg-slate-950/80 border border-slate-800 text-slate-300 whitespace-nowrap">
        <span className="text-slate-500 mr-2 text-[10px] tracking-wider uppercase">AVG LATENCY:</span>
        <AnimatedCounter value={latency} decimals={2} suffix="s" className="text-cyan-400 font-bold" />
      </div>

      {/* Engine Status Pill */}
      <div className="flex items-center px-3 py-1.5 rounded bg-slate-950/80 border border-slate-800 text-slate-300 whitespace-nowrap">
        <span
          className={`w-2 h-2 rounded-full mr-2 ${
            isFallback ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
          }`}
        />
        <span className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">
          {isFallback ? 'OFFLINE SIMULATOR' : 'NEBIUS 3-TIER ACTIVE'}
        </span>
      </div>
    </div>
  );
};
