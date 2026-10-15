'use client';

import React from 'react';
import { DollarSign, Clock, Activity, Cpu } from 'lucide-react';
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
    <div className="flex items-center space-x-2 md:space-x-3 text-xs font-mono">
      {/* FinOps Cost Pill */}
      <div className="flex items-center px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
        <DollarSign className="w-3.5 h-3.5 text-emerald-400 mr-1" />
        <span className="text-slate-400 mr-1">FinOps:</span>
        <AnimatedCounter value={cost} decimals={5} prefix="$" className="text-emerald-400 font-semibold" />
        <span className="ml-1.5 px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-400 text-[10px] border border-emerald-800/50">
          -{reduction.toFixed(1)}%
        </span>
      </div>

      {/* Latency Pill */}
      <div className="hidden sm:flex items-center px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
        <Clock className="w-3.5 h-3.5 text-cyan-400 mr-1" />
        <span className="text-slate-400 mr-1">Latency:</span>
        <AnimatedCounter value={latency} decimals={2} suffix="s" className="text-cyan-300 font-semibold" />
      </div>

      {/* Status Mode Indicator */}
      <div className="flex items-center px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800">
        <span
          className={`w-2 h-2 rounded-full mr-2 ${
            isFallback ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]'
          }`}
        />
        <span className="text-slate-300 font-medium">
          {isFallback ? 'Offline Sim' : 'Nebius 3-Tier'}
        </span>
      </div>
    </div>
  );
};
