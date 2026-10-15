'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
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
  maxTilt = 6,
  sheen = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const card = cardRef.current;
      if (!card) return;

      gsap.set(card, { transformPerspective: 1000, transformStyle: 'preserve-3d' });

      const handleMouseMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -maxTilt;
        const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * maxTilt;

        gsap.to(card, { rotateX, rotateY, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });

        if (sheenRef.current) {
          const sheenX = (x / rect.width) * 100;
          const sheenY = (y / rect.height) * 100;
          gsap.to(sheenRef.current, {
            background: `radial-gradient(circle at ${sheenX}% ${sheenY}%, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 65%)`,
            duration: 0.2,
            ease: 'none',
          });
        }
      };

      const handleMouseLeave = () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power3.out', overwrite: 'auto' });
        if (sheenRef.current) gsap.to(sheenRef.current, { background: 'transparent', duration: 0.4 });
      };

      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
      };
    },
    { scope: cardRef }
  );

  return (
    <div
      ref={cardRef}
      className={cn(
        'relative rounded-lg bg-slate-900/80 border border-slate-800 shadow-sm transition-shadow hover:shadow-md will-change-transform overflow-hidden',
        className
      )}
    >
      {sheen && <div ref={sheenRef} className="pointer-events-none absolute inset-0 z-10" aria-hidden="true" />}
      <div className="relative z-0 h-full">{children}</div>
    </div>
  );
};
