'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  sheen?: boolean;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        'relative rounded-lg bg-slate-900/80 border border-slate-800 shadow-sm transition-all duration-200 overflow-hidden',
        className
      )}
    >
      <div className="relative z-0 h-full">{children}</div>
    </div>
  );
};
