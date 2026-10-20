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
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
      <div className="min-w-0">
        {badge && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-primary/10 text-primary border border-primary/20 mb-3">
            {badge}
          </span>
        )}
        <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-text">{title}</h1>
        <p className="mt-1.5 text-muted text-sm leading-relaxed max-w-xl">{description}</p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
