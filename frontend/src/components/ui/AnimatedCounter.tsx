'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface CounterProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export const AnimatedCounter: React.FC<CounterProps> = ({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 1.2,
  className = '',
}) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const countObj = useRef({ count: 0 });

  useGSAP(
    () => {
      if (!spanRef.current) return;
      gsap.to(countObj.current, {
        count: value,
        duration,
        ease: 'power2.out',
        onUpdate: () => {
          if (spanRef.current) {
            spanRef.current.textContent = `${prefix}${countObj.current.count.toFixed(decimals)}${suffix}`;
          }
        },
      });
    },
    [value, decimals, prefix, suffix, duration]
  );

  return (
    <span ref={spanRef} className={className}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
};
