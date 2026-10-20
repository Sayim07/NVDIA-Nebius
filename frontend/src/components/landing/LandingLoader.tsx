'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useProgress } from '@react-three/drei';
import { Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LandingLoaderProps {
  onComplete: () => void;
  isReplay?: boolean;
}

export function LandingLoader({ onComplete, isReplay = false }: LandingLoaderProps) {
  const { progress: dreiProgress, active: dreiActive } = useProgress();
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);
  const [isExited, setIsExited] = useState(false);

  // Store Drei progress in ref to avoid effect recreation loops
  const dreiProgressRef = useRef(dreiProgress);
  const dreiActiveRef = useRef(dreiActive);
  useEffect(() => {
    dreiProgressRef.current = dreiProgress;
    dreiActiveRef.current = dreiActive;
  }, [dreiProgress, dreiActive]);

  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      prefersReducedMotion.current = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;
    }

    // Lock body scroll while loader is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Combined Progress Engine: Drei + Min Display Time + Failsafe Max Time
  useEffect(() => {
    let isRepeatSession = false;
    try {
      if (typeof window !== 'undefined' && sessionStorage.getItem('hs-loaded') === 'true' && !isReplay) {
        isRepeatSession = true;
      }
    } catch {
      // Storage access error ignored
    }

    const minTime = isRepeatSession ? 800 : 1800; // 0.8s for repeat, 1.8s for fresh
    const maxTime = 6000; // 6.0s failsafe maximum
    const startTime = Date.now();

    let currentVal = 0;
    let animId: number | null = null;
    let completed = false;

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const timeRatio = Math.min(1.0, elapsed / minTime);

      const dActive = dreiActiveRef.current;
      const dProgress = dreiProgressRef.current;
      const assetsRatio = dActive ? dProgress / 100 : 1.0;

      // Target progress calculation:
      // Hold at 90% maximum until minTime is reached
      let target = 0;
      if (elapsed < minTime) {
        // While within minTime, interpolate smoothly up to 90%
        target = Math.min(90, Math.max(timeRatio * 90, assetsRatio * 90));
      } else {
        // After minTime has elapsed, allow reaching 100% if assets are ready or if maxTime reached
        if (!dActive || dProgress >= 100 || elapsed >= maxTime) {
          target = 100;
        } else {
          // Creep smoothly between 90 and 99 while waiting for any remaining assets
          const extraRatio = Math.min(1.0, (elapsed - minTime) / (maxTime - minTime));
          target = 90 + extraRatio * 9;
        }
      }

      // Smooth monotonic easing step towards target
      if (currentVal < target) {
        const step = Math.max(0.35, (target - currentVal) * 0.12);
        currentVal = Math.min(target, currentVal + step);
      }

      // Check for completion at 100%
      if (target >= 100 && currentVal >= 99.6 && !completed) {
        completed = true;
        currentVal = 100;
        setDisplayProgress(100);
        setIsFinishing(true);

        try {
          sessionStorage.setItem('hs-loaded', 'true');
        } catch {
          // Storage access error ignored
        }

        // 100% completion flash & pulse (300ms) -> Exit fade+scale (600ms) -> onComplete()
        setTimeout(() => {
          setIsExited(true);
          setTimeout(() => {
            onComplete();
          }, 600); // 0.6s exit fade + scale out
        }, 300); // 300ms 100% flash & gentle pulse

        return;
      }

      setDisplayProgress(currentVal);
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isReplay, onComplete]);

  // SVG Ring Calculations
  // Radius = 54px, Circumference = 2 * PI * 54 ≈ 339.292
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (displayProgress / 100) * circumference;

  // Progressive Shield Glow values
  const shieldOpacity = 0.35 + (displayProgress / 100) * 0.65;
  const glowRadius = Math.round((displayProgress / 100) * 18);

  return (
    <AnimatePresence>
      {!isExited && (
        <motion.div
          key="hermes-landing-loader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: prefersReducedMotion.current ? 1 : 1.05,
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-[100] bg-bg flex flex-col items-center justify-center select-none"
          role="progressbar"
          aria-valuenow={Math.round(displayProgress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Loading HermesShield"
        >
          {/* Subtle Ambient Radial Glow behind loader */}
          <div
            className="absolute w-80 h-80 rounded-full pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle, var(--primary) 0%, transparent 70%)`,
              opacity: prefersReducedMotion.current ? 0.04 : shieldOpacity * 0.12,
            }}
            aria-hidden="true"
          />

          {/* Center Graphic: Shield + Circular SVG Progress Ring */}
          <div className="relative flex items-center justify-center">
            {/* SVG Progress Ring */}
            <svg
              className="w-36 h-36 -rotate-90 transform"
              viewBox="0 0 128 128"
              aria-hidden="true"
            >
              {/* Background Faint Track Ring */}
              <circle
                cx="64"
                cy="64"
                r={radius}
                className="stroke-border/40"
                strokeWidth="4"
                fill="none"
              />

              {/* Progress Filling Ring */}
              <circle
                cx="64"
                cy="64"
                r={radius}
                className={`transition-[stroke-dashoffset] duration-75 ease-linear ${
                  isFinishing ? 'stroke-primary brightness-125' : 'stroke-primary'
                }`}
                strokeWidth="4.5"
                strokeLinecap="round"
                fill="none"
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset,
                  filter: prefersReducedMotion.current
                    ? 'none'
                    : isFinishing
                    ? `drop-shadow(0 0 16px var(--primary)) drop-shadow(0 0 6px var(--primary))`
                    : `drop-shadow(0 0 ${glowRadius * 0.7}px var(--primary))`,
                }}
              />
            </svg>

            {/* Centre Shield Icon with Progressive Glow + One Gentle Pulse at 100% */}
            <motion.div
              className="absolute flex items-center justify-center"
              animate={
                isFinishing && !prefersReducedMotion.current
                  ? { scale: [1, 1.1, 1] }
                  : { scale: 1 }
              }
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              style={{
                opacity: shieldOpacity,
                filter: prefersReducedMotion.current
                  ? 'none'
                  : isFinishing
                  ? `drop-shadow(0 0 24px var(--primary))`
                  : `drop-shadow(0 0 ${glowRadius}px var(--primary))`,
              }}
            >
              <div className="w-12 h-12 rounded-xl bg-surface/90 border border-primary/30 flex items-center justify-center text-primary shadow-sm">
                <Shield className="w-6 h-6 stroke-[2.2] text-primary" />
              </div>
            </motion.div>
          </div>

          {/* Smooth Numerical Percentage Counter (0% -> 100%, Tabular Nums, Mono Font) */}
          <div className="mt-8 flex flex-col items-center gap-1.5">
            <span className="font-mono text-sm sm:text-base font-semibold text-text tracking-wider tabular-nums">
              {Math.round(displayProgress)}%
            </span>
            <span className="font-mono text-[11px] text-muted tracking-tight">
              INITIALIZING CYBER CORE
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
