// frontend/src/components/ui/StatMetricCard.tsx
'use client';

import React from 'react';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { cn } from '@/lib/utils';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';

export interface StatMetricCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  caption: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    isNeutral?: boolean;
  };
  icon?: React.ElementType;
  accent?: 'emerald' | 'cyan' | 'rose' | 'amber' | 'purple';
  className?: string;
}

export function StatMetricCard({
  label,
  value,
  prefix,
  suffix,
  decimals = 0,
  caption,
  trend,
  icon: Icon,
  accent = 'emerald',
  className,
}: StatMetricCardProps) {
  const accentStyles = {
    emerald: {
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      glow: 'group-hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]',
      bar: 'bg-emerald-500',
    },
    cyan: {
      border: 'border-cyan-500/20 hover:border-cyan-500/40',
      iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      glow: 'group-hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]',
      bar: 'bg-cyan-500',
    },
    rose: {
      border: 'border-rose-500/20 hover:border-rose-500/40',
      iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      glow: 'group-hover:shadow-[0_0_20px_rgba(244,63,94,0.1)]',
      bar: 'bg-rose-500',
    },
    amber: {
      border: 'border-amber-500/20 hover:border-amber-500/40',
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      glow: 'group-hover:shadow-[0_0_20px_rgba(245,158,11,0.1)]',
      bar: 'bg-amber-500',
    },
    purple: {
      border: 'border-purple-500/20 hover:border-purple-500/40',
      iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      glow: 'group-hover:shadow-[0_0_20px_rgba(139,92,246,0.1)]',
      bar: 'bg-purple-500',
    },
  };

  const style = accentStyles[accent];

  return (
    <div
      className={cn(
        'group relative flex flex-col justify-between rounded-xl border bg-surface/95 p-4 sm:p-5 transition-all duration-200',
        style.border,
        style.glow,
        className
      )}
    >
      {/* Top row: Label & Icon */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-mono tracking-wider uppercase text-muted">
          {label}
        </span>
        {Icon && (
          <div
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-lg border text-xs transition-transform group-hover:scale-105',
              style.iconBg
            )}
          >
            <Icon className="h-3.5 w-3.5" />
          </div>
        )}
      </div>

      {/* Main Metric Value */}
      <div className="my-1 flex items-baseline gap-2">
        <span className="font-heading text-2xl sm:text-3xl font-bold tabular-nums text-text tracking-tight">
          <AnimatedCounter
            value={value}
            prefix={prefix}
            suffix={suffix}
            decimals={decimals}
            duration={1.2}
          />
        </span>

        {trend && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 text-[11px] font-mono font-medium px-1.5 py-0.5 rounded',
              trend.isNeutral
                ? 'bg-surface-2 text-muted'
                : trend.isPositive
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-rose-500/10 text-rose-400'
            )}
          >
            {trend.isNeutral ? (
              <Minus className="h-2.5 w-2.5" />
            ) : trend.isPositive ? (
              <ArrowDownRight className="h-3 w-3" />
            ) : (
              <ArrowUpRight className="h-3 w-3" />
            )}
            {trend.value}
          </span>
        )}
      </div>

      {/* Caption & Micro-Spark Bar */}
      <div className="mt-2 pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-muted">
        <span className="truncate pr-2">{caption}</span>
        {/* Subtle mini progress pip */}
        <div className="flex items-center gap-1 shrink-0">
          <span className="h-1.5 w-1 rounded-full bg-border" />
          <span className="h-2.5 w-1 rounded-full bg-border" />
          <span className={cn('h-3.5 w-1 rounded-full', style.bar)} />
        </div>
      </div>
    </div>
  );
}
