// frontend/src/components/ui/ShimmerButton.tsx
// From 21st.dev (id: 833 by dillionverma)
import React, { CSSProperties } from 'react';
import { cn } from '@/lib/utils';

export interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
}

export const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = '#10b981',
      shimmerSize = '0.08em',
      shimmerDuration = '2.5s',
      borderRadius = '12px',
      background = 'rgba(15, 23, 42, 0.95)',
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        style={
          {
            '--spread': '90deg',
            '--shimmer-color': shimmerColor,
            '--radius': borderRadius,
            '--speed': shimmerDuration,
            '--cut': shimmerSize,
            '--bg': background,
          } as CSSProperties
        }
        className={cn(
          'group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-emerald-500/20 px-5 py-2.5 text-xs font-mono font-medium text-white [background:var(--bg)] [border-radius:var(--radius)]',
          'transform-gpu transition-all duration-300 ease-in-out hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] active:translate-y-px disabled:opacity-50 disabled:pointer-events-none',
          className
        )}
        ref={ref}
        {...props}
      >
        {/* spark container */}
        <div
          className={cn(
            '-z-30 blur-[2px]',
            'absolute inset-0 overflow-visible [container-type:size]'
          )}
        >
          {/* spark */}
          <div className="absolute inset-0 h-[100cqh] animate-shimmer-slide [aspect-ratio:1] [border-radius:0] [mask:none]">
            <div className="animate-spin-around absolute -inset-full w-auto rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))] [translate:0_0]" />
          </div>
        </div>

        {/* Highlight inner glow */}
        <div
          className={cn(
            'inset-0 absolute size-full',
            'rounded-[inherit] shadow-[inset_0_-8px_12px_rgba(255,255,255,0.06)]',
            'transform-gpu transition-all duration-300 ease-in-out',
            'group-hover:shadow-[inset_0_-6px_12px_rgba(16,185,129,0.15)]',
            'group-active:shadow-[inset_0_-10px_12px_rgba(16,185,129,0.25)]'
          )}
        />

        {/* backdrop */}
        <div
          className={cn(
            'absolute -z-20 [background:var(--bg)] [border-radius:var(--radius)] [inset:var(--cut)]'
          )}
        />

        <div className="relative z-10 flex items-center gap-2">
          {children}
        </div>
      </button>
    );
  }
);

ShimmerButton.displayName = 'ShimmerButton';

export default ShimmerButton;
