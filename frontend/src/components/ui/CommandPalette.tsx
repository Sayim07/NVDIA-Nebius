'use client';

import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import {
  ShieldAlert,
  Search,
  Cpu,
  Brain,
  Terminal,
  Zap,
  Moon,
  CheckCircle2,
} from 'lucide-react';

interface CommandPaletteProps {
  onSelectTab: (tab: string) => void;
  onRunPreset: (presetKey: string) => void;
  onSimulateAttack: () => void;
  onTriggerScout: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  onSelectTab,
  onRunPreset,
  onSimulateAttack,
  onTriggerScout,
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-slate-950/80 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-xl bg-slate-900 border border-slate-700 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Command className="w-full bg-slate-900 text-slate-100">
          <div className="flex items-center px-4 border-b border-slate-800">
            <Search className="w-4 h-4 mr-2 text-slate-400" />
            <Command.Input
              placeholder="Type a command or search..."
              className="w-full py-3 text-sm bg-transparent border-0 outline-none placeholder:text-slate-500 text-slate-100"
              autoFocus
            />
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700 rounded">
              ESC
            </kbd>
          </div>

          <Command.List className="max-h-72 overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-xs text-slate-500">
              No results found.
            </Command.Empty>

            <Command.Group heading="Navigation" className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-2 py-1">
              <Command.Item
                onSelect={() => { onSelectTab('workspace'); setOpen(false); }}
                className="flex items-center px-3 py-2 text-xs rounded-md cursor-pointer hover:bg-slate-800/80 text-slate-300"
              >
                <Terminal className="w-3.5 h-3.5 mr-2 text-emerald-400" />
                Executive Workspace & Agent Run
              </Command.Item>
              <Command.Item
                onSelect={() => { onSelectTab('airlock'); setOpen(false); }}
                className="flex items-center px-3 py-2 text-xs rounded-md cursor-pointer hover:bg-slate-800/80 text-slate-300"
              >
                <ShieldAlert className="w-3.5 h-3.5 mr-2 text-cyan-400" />
                Tavily Privacy Airlock Inspector
              </Command.Item>
              <Command.Item
                onSelect={() => { onSelectTab('security'); setOpen(false); }}
                className="flex items-center px-3 py-2 text-xs rounded-md cursor-pointer hover:bg-slate-800/80 text-slate-300"
              >
                <Cpu className="w-3.5 h-3.5 mr-2 text-rose-400" />
                NemoClaw & OpenShell Security HUD
              </Command.Item>
              <Command.Item
                onSelect={() => { onSelectTab('skills'); setOpen(false); }}
                className="flex items-center px-3 py-2 text-xs rounded-md cursor-pointer hover:bg-slate-800/80 text-slate-300"
              >
                <Brain className="w-3.5 h-3.5 mr-2 text-violet-400" />
                Hermes Memory & Skill Studio
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Evaluation Presets" className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-2 py-1 mt-2">
              <Command.Item
                onSelect={() => { onRunPreset('architecture_sync'); setOpen(false); }}
                className="flex items-center px-3 py-2 text-xs rounded-md cursor-pointer hover:bg-slate-800/80 text-slate-300"
              >
                <Zap className="w-3.5 h-3.5 mr-2 text-amber-400" />
                Preset A: Architecture Sync + CVE Scan
              </Command.Item>
              <Command.Item
                onSelect={() => { onRunPreset('pr_review'); setOpen(false); }}
                className="flex items-center px-3 py-2 text-xs rounded-md cursor-pointer hover:bg-slate-800/80 text-slate-300"
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-emerald-400" />
                Preset B: PR Security Review & Dependency Audit
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Security & Jobs" className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-2 py-1 mt-2">
              <Command.Item
                onSelect={() => { onSimulateAttack(); setOpen(false); }}
                className="flex items-center px-3 py-2 text-xs rounded-md cursor-pointer hover:bg-rose-950/40 text-rose-300"
              >
                <ShieldAlert className="w-3.5 h-3.5 mr-2 text-rose-400" />
                [!] Simulate Prompt Injection Attack (Red-Team)
              </Command.Item>
              <Command.Item
                onSelect={() => { onTriggerScout(); setOpen(false); }}
                className="flex items-center px-3 py-2 text-xs rounded-md cursor-pointer hover:bg-slate-800/80 text-slate-300"
              >
                <Moon className="w-3.5 h-3.5 mr-2 text-cyan-400" />
                Trigger Nebius Serverless Overnight Scout
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
};
