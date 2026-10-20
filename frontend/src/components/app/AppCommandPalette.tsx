'use client';

import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  LayoutDashboard,
  FileText,
  ShieldAlert,
  Lock,
  Brain,
  BarChart2,
  HelpCircle,
  Info,
  Sun,
  Moon,
  Zap,
  Bomb,
} from 'lucide-react';

interface AppCommandPaletteProps {
  onSimulateAttack?: () => Promise<unknown>;
  onRunPreset?: (presetKey: string) => void;
}

export const AppCommandPalette: React.FC<AppCommandPaletteProps> = ({
  onSimulateAttack,
  onRunPreset,
}) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

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

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-20 bg-bg/80 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl bg-surface border border-border shadow-float"
        onClick={(e) => e.stopPropagation()}
      >
        <Command className="flex flex-col" aria-label="Command palette">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
            <Command.Input
              placeholder="Search commands…"
              className="flex-1 bg-transparent text-text text-sm placeholder-muted outline-none"
              aria-label="Search commands"
              autoFocus
            />
            <kbd className="text-[10px] font-mono text-muted bg-surface-2 px-1.5 py-0.5 rounded border border-border">
              esc
            </kbd>
          </div>

          <Command.List className="max-h-[420px] overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-sm text-muted">
              No results found
            </Command.Empty>

            {/* Navigation */}
            <Command.Group heading="Navigate" className="text-[11px] font-medium text-muted px-2 py-1.5 uppercase tracking-wider">
              {[
                { href: '/app', label: 'Dashboard', icon: LayoutDashboard },
                { href: '/app/briefing', label: 'Workspace briefing', icon: FileText },
                { href: '/app/airlock', label: 'Privacy airlock', icon: ShieldAlert },
                { href: '/app/security', label: 'Security & sandbox', icon: Lock },
                { href: '/app/skills', label: 'Skills & memory', icon: Brain },
                { href: '/app/costs', label: 'Cost & speed', icon: BarChart2 },
                { href: '/app/how-it-works', label: 'How it works', icon: HelpCircle },
                { href: '/app/about', label: 'About & links', icon: Info },
              ].map(({ href, label, icon: Icon }) => (
                <Command.Item
                  key={href}
                  value={label}
                  onSelect={() => go(href)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text cursor-pointer hover:bg-surface-2 aria-selected:bg-primary/10 aria-selected:text-primary transition-colors"
                >
                  <Icon size={15} className="text-muted shrink-0" aria-hidden="true" />
                  {label}
                </Command.Item>
              ))}
            </Command.Group>

            {/* Actions */}
            <Command.Group heading="Actions" className="text-[11px] font-medium text-muted px-2 py-1.5 uppercase tracking-wider mt-2">
              <Command.Item
                value="Switch theme"
                onSelect={() => {
                  setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
                  setOpen(false);
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text cursor-pointer hover:bg-surface-2 aria-selected:bg-primary/10 aria-selected:text-primary transition-colors"
              >
                {resolvedTheme === 'dark' ? (
                  <Sun size={15} className="text-muted shrink-0" aria-hidden="true" />
                ) : (
                  <Moon size={15} className="text-muted shrink-0" aria-hidden="true" />
                )}
                Switch theme
              </Command.Item>

              <Command.Item
                value="Simulate attack"
                onSelect={async () => {
                  setOpen(false);
                  router.push('/app/security');
                  if (onSimulateAttack) await onSimulateAttack();
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text cursor-pointer hover:bg-surface-2 aria-selected:bg-primary/10 aria-selected:text-primary transition-colors"
              >
                <Bomb size={15} className="text-danger shrink-0" aria-hidden="true" />
                Simulate prompt injection attack
              </Command.Item>

              {['architecture_sync', 'pr_review', 'competitive_scout'].map((key, i) => (
                <Command.Item
                  key={key}
                  value={`Run preset ${['A', 'B', 'C'][i]}: ${['Architecture sync', 'PR review', 'Deep scout'][i]}`}
                  onSelect={() => {
                    setOpen(false);
                    router.push('/app/briefing');
                    if (onRunPreset) onRunPreset(key);
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text cursor-pointer hover:bg-surface-2 aria-selected:bg-primary/10 aria-selected:text-primary transition-colors"
                >
                  <Zap size={15} className="text-primary shrink-0" aria-hidden="true" />
                  Run preset {['A', 'B', 'C'][i]}: {['Architecture sync', 'PR review', 'Deep scout'][i]}
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
};
