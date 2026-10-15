'use client';

import React from 'react';
import { FinOpsTelemetry, HealthStatus } from '@/lib/types';
import { FinOpsHUD } from './FinOpsHUD';

interface HeaderProps {
  telemetry: FinOpsTelemetry | null;
  health: HealthStatus | null;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenCommand: () => void;
}

const NAV_ITEMS = [
  { id: 'workspace', label: '01 // WORKSPACE' },
  { id: 'airlock', label: '02 // AIRLOCK' },
  { id: 'security', label: '03 // NEMOCLAW' },
  { id: 'skills', label: '04 // SKILLS' },
];

export const Header: React.FC<HeaderProps> = ({
  telemetry,
  health,
  activeTab,
  onSelectTab,
  onOpenCommand,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      {/* Top Main Perimeter Bar */}
      <div className="w-full px-4 sm:px-6 py-3 flex items-center justify-between border-b border-slate-900/60">
        {/* Left: Brand Identity in Reference Style */}
        <div className="flex items-center space-x-3">
          <div className="leading-none">
            <div className="flex items-center space-x-1.5">
              <span className="text-sm font-black tracking-tight text-white uppercase">
                HERMESSHIELD
              </span>
              <span className="text-emerald-400 font-mono text-sm leading-none font-bold">°</span>
            </div>
            <div className="text-[9px] font-mono tracking-widest text-slate-500 uppercase mt-0.5">
              PERSONAL AI EXECUTIVE & DEEP WEB SCOUT
            </div>
          </div>
        </div>

        {/* Center: Desktop Bracketed Navigation Rails */}
        <nav className="hidden md:flex items-center space-x-1 font-mono text-xs">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`px-3 py-1.5 rounded transition-all tracking-wider ${
                  isActive
                    ? 'text-emerald-400 bg-slate-900 border border-slate-700/80 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                [ {item.label} ]
              </button>
            );
          })}
        </nav>

        {/* Right: Cmd+K & Telemetry HUD */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onOpenCommand}
            className="hidden lg:flex items-center space-x-1 px-2.5 py-1 text-[11px] font-mono text-slate-400 hover:text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded transition-colors"
          >
            <span>[ CMD+K ]</span>
          </button>
          <FinOpsHUD telemetry={telemetry} health={health} />
        </div>
      </div>

      {/* Sub-Header Mobile Navigation Rail */}
      <div className="md:hidden flex items-center space-x-1 px-3 py-2 overflow-x-auto bg-slate-950 border-b border-slate-900 text-xs font-mono">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`px-2.5 py-1 rounded whitespace-nowrap text-[11px] ${
                isActive
                  ? 'text-emerald-400 bg-slate-900 border border-slate-800 font-bold'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              [ {item.label} ]
            </button>
          );
        })}
      </div>
    </header>
  );
};
