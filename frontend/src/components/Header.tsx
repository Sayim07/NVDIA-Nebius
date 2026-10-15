'use client';

import React from 'react';
import { HealthStatus } from '@/lib/types';
import { ArrowUpRight, Shield, Terminal } from 'lucide-react';

interface HeaderProps {
  health: HealthStatus | null;
  onOpenCommand: () => void;
  onScrollToConsole: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  health,
  onOpenCommand,
  onScrollToConsole,
}) => {
  const isFallback = health?.is_fallback ?? true;

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Brand Identity with Status Beacon */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse" />
            <a href="#" className="flex items-baseline space-x-1.5 group">
              <span className="text-base font-black tracking-tight text-white uppercase group-hover:text-emerald-400 transition-colors">
                HERMESSHIELD
              </span>
              <span className="text-emerald-400 font-mono text-xs font-bold">°</span>
            </a>
          </div>
          <span className="hidden lg:inline text-[10px] font-mono tracking-widest text-slate-500 uppercase border-l border-slate-800 pl-3">
            ZERO-TRUST PERSONAL AI
          </span>
        </div>

        {/* Center: Editorial Navigation Anchor Links */}
        <nav className="hidden md:flex items-center space-x-6 text-xs font-mono text-slate-400">
          <a
            href="#overview"
            className="hover:text-emerald-400 transition-colors tracking-wider"
          >
            [ OVERVIEW ]
          </a>
          <a
            href="#architecture"
            className="hover:text-emerald-400 transition-colors tracking-wider"
          >
            [ ARCHITECTURE ]
          </a>
          <a
            href="#airlock-tech"
            className="hover:text-cyan-400 transition-colors tracking-wider"
          >
            [ TAVILY AIRLOCK ]
          </a>
          <a
            href="#finops-metrics"
            className="hover:text-amber-400 transition-colors tracking-wider"
          >
            [ FINOPS ]
          </a>
          <button
            onClick={onScrollToConsole}
            className="hover:text-white transition-colors tracking-wider text-emerald-400 font-semibold"
          >
            [ LIVE CONSOLE ]
          </button>
        </nav>

        {/* Right: Quick Command & Launch Action */}
        <div className="flex items-center space-x-3">
          {/* Quick Cmd+K trigger */}
          <button
            onClick={onOpenCommand}
            className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 text-[11px] font-mono text-slate-400 hover:text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 rounded transition-all whitespace-nowrap"
          >
            <span className="text-slate-500">⌘K</span>
            <span>SEARCH</span>
          </button>

          {/* Runtime Engine Pill */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 text-[10px] font-mono rounded bg-slate-900/80 border border-slate-800 text-slate-300 whitespace-nowrap">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isFallback ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
            />
            <span className="text-slate-400">
              {isFallback ? 'SIMULATED' : 'NEMOTRON LIVE'}
            </span>
          </div>

          {/* Primary CTA */}
          <button
            onClick={onScrollToConsole}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] whitespace-nowrap"
          >
            <span>LAUNCH CONSOLE</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
