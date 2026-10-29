// frontend/src/components/ui/Badge.tsx
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border font-mono font-medium transition-colors whitespace-nowrap',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary/10 text-primary border-primary/20 hover:bg-primary/20',
        secondary:
          'border-transparent bg-surface-2 text-text border-border hover:bg-surface-2/80',
        emerald:
          'border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/15',
        rose:
          'border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/15',
        cyan:
          'border-cyan-500/20 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/15',
        amber:
          'border-amber-500/20 bg-amber-500/10 text-amber-400 hover:bg-amber-500/15',
        purple:
          'border-purple-500/20 bg-purple-500/10 text-purple-400 hover:bg-purple-500/15',
        outline:
          'border-border text-muted hover:border-slate-700 hover:text-text',
      },
      size: {
        default: 'px-2.5 py-0.5 text-xs',
        sm: 'px-2 py-0.5 text-[10px]',
        lg: 'px-3 py-1 text-xs',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}
