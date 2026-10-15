'use client';

import React from 'react';
import { ShieldCheck, Command } from 'lucide-react';
import { FinOpsTelemetry, HealthStatus } from '@/lib/types';
import { FinOpsHUD } from './FinOpsHUD';

interface HeaderProps {
  telemetry: FinOpsTelemetry | null;
  health: HealthStatus | null;
  onOpenCommand: () => void;
}

export const Header: React.FC<HeaderProps> = ({ telemetry, health, onOpenCommand }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Cluster */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-extrabold tracking-tight text-slate-100">
                HermesShield
              </h1>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-900 border border-slate-800 text-slate-400">
                v1.0.0-hackathon
              </span>
            </div>
            <p className="text-[11px] text-slate-400 tracking-tight hidden md:block">
              Zero-Trust Personal AI Executive & Deep Web Scout
            </p>
          </div>
        </div>

        {/* Action and Telemetry Cluster */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenCommand}
            className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 text-xs text-slate-400 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-md transition-colors"
          >
            <Command className="w-3.5 h-3.5" />
            <span className="text-[11px] font-mono">Cmd+K</span>
          </button>
          <FinOpsHUD telemetry={telemetry} health={health} />
        </div>
      </div>
    </header>
  );
};
