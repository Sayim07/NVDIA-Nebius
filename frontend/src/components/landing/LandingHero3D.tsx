'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';

// Dynamic import with SSR false for Three.js / R3F
const DynamicShieldScene = dynamic(
  () => import('@/components/three/ShieldScene'),
  {
    ssr: false,
    loading: () => <ShieldPosterFallback />,
  }
);

// High-fidelity SVG Shield Poster Fallback for LCP & WebGL fallback
export function ShieldPosterFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center relative select-none">
      <div className="absolute inset-0 radial-gradient pointer-events-none" />
      <div className="relative flex items-center justify-center">
        {/* Outer subtle glow ring */}
        <div className="absolute w-72 h-72 rounded-full border border-primary/20 animate-pulse" />
        <div className="absolute w-84 h-84 rounded-full border border-highlight/15" />

        {/* Shield outline */}
        <svg
          viewBox="0 0 120 140"
          className="w-48 h-56 text-primary drop-shadow-[0_0_24px_rgba(52,211,153,0.25)]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          {/* Faceted shield geometry */}
          <polygon
            points="60,10 108,30 108,70 60,126 12,70 12,30"
            className="fill-primary/10 stroke-primary/50"
          />
          <polygon
            points="60,10 60,126 12,70"
            className="fill-primary/5 stroke-primary/30"
          />
          <polygon
            points="60,34 92,48 92,72 60,108 28,72 28,48"
            className="fill-transparent stroke-highlight/60"
            strokeDasharray="4 2"
          />
          <circle cx="60" cy="68" r="4" className="fill-primary" />
        </svg>
      </div>
    </div>
  );
}

interface LandingHero3DProps {
  isZooming?: boolean;
}

export default function LandingHero3D({ isZooming = false }: LandingHero3DProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    setMounted(true);
    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
      }
    } catch {
      setHasWebGL(false);
    }
  }, []);

  const isDark = mounted ? resolvedTheme === 'dark' : true;

  if (!mounted) {
    return <ShieldPosterFallback />;
  }

  if (!hasWebGL) {
    return <ShieldPosterFallback />;
  }

  return (
    <div className="w-full h-full relative overflow-hidden select-none">
      <React.Suspense fallback={<ShieldPosterFallback />}>
        <DynamicShieldScene isDark={isDark} isZooming={isZooming} />
      </React.Suspense>
    </div>
  );
}
