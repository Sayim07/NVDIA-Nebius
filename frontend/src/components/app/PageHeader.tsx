'use client';

import React from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  badge?: string;
}

export function PageHeader({ title, description, action, badge }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-2 border-b border-border/40">
      <div className="min-w-0 space-y-1.5">
        {badge && (
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] font-mono tracking-wider text-primary uppercase font-semibold">
              {badge}
            </span>
          </div>
        )}
        <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-text">
          {title}
        </h1>
        <p className="text-muted text-xs sm:text-sm leading-relaxed max-w-2xl">
          {description}
        </p>
      </div>
      {action && <div className="shrink-0 pt-1">{action}</div>}
    </div>
  );
}
