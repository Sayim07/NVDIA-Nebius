// frontend/src/components/ui/BentoGrid.tsx
// From 21st.dev & Magic UI
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

export const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'grid w-full auto-rows-[22rem] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
        className
      )}
    >
      {children}
    </div>
  );
};

export interface BentoCardProps {
  name: string;
  className?: string;
  background?: ReactNode;
  Icon?: React.ElementType;
  description: string;
  href?: string;
  cta?: string;
  badge?: string;
  accent?: 'emerald' | 'cyan' | 'rose' | 'amber' | 'purple';
  children?: ReactNode;
  onClick?: () => void;
}

export const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  badge,
  accent = 'emerald',
  children,
  onClick,
}: BentoCardProps) => {
  const accentBorder = {
    emerald: 'hover:border-emerald-500/50 group-hover:shadow-[0_0_25px_rgba(16,185,129,0.1)]',
    cyan: 'hover:border-cyan-500/50 group-hover:shadow-[0_0_25px_rgba(6,182,212,0.1)]',
    rose: 'hover:border-rose-500/50 group-hover:shadow-[0_0_25px_rgba(244,63,94,0.1)]',
    amber: 'hover:border-amber-500/50 group-hover:shadow-[0_0_25px_rgba(245,158,11,0.1)]',
    purple: 'hover:border-purple-500/50 group-hover:shadow-[0_0_25px_rgba(168,85,247,0.1)]',
  }[accent];

  const accentText = {
    emerald: 'text-emerald-400',
    cyan: 'text-cyan-400',
    rose: 'text-rose-400',
    amber: 'text-amber-400',
    purple: 'text-purple-400',
  }[accent];

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-surface/90 backdrop-blur-sm p-6 transition-all duration-300',
        onClick && 'cursor-pointer',
        accentBorder,
        className
      )}
    >
      {/* Background layer */}
      {background && (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity">
          {background}
        </div>
      )}

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between">
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface-2 text-text transition-all group-hover:scale-105">
            <Icon className={cn('h-5 w-5', accentText)} />
          </div>
        )}
        {badge && (
          <span className="rounded-full border border-border bg-surface-2 px-2.5 py-0.5 text-[10px] font-mono font-medium text-muted">
            {badge}
          </span>
        )}
      </div>

      {/* Content Slot / Interactive visualization */}
      {children && (
        <div className="relative z-10 flex-1 my-3 overflow-hidden">
          {children}
        </div>
      )}

      {/* Bottom Text & CTA */}
      <div className="relative z-10 flex flex-col gap-1.5 pt-2">
        <h3 className="text-base font-semibold text-text tracking-tight group-hover:text-primary transition-colors">
          {name}
        </h3>
        <p className="text-xs text-muted leading-relaxed line-clamp-2">
          {description}
        </p>

        {cta && (
          <div className="pt-2 flex items-center gap-1.5 text-xs font-mono font-semibold text-primary transition-all group-hover:translate-x-1">
            <span>{cta}</span>
            <ArrowRight size={13} />
          </div>
        )}
      </div>
    </div>
  );
};
