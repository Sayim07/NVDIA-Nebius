'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import gsap from 'gsap';
import {
  Shield,
  ArrowRight,
  Play,
  Github,
  CornerDownLeft,
} from 'lucide-react';
import { content } from '@/content/content';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import LandingHero3D from '@/components/landing/LandingHero3D';
import { VideoModal } from '@/components/ui/VideoModal';

export default function LandingPage() {
  const router = useRouter();
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Animation container refs
  const containerRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaGroupRef = useRef<HTMLDivElement>(null);
  const trustLineRef = useRef<HTMLDivElement>(null);
  const bottomHintRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const wipeRef = useRef<HTMLDivElement>(null);

  // Check if returning user and prefetch /app
  useEffect(() => {
    router.prefetch('/app');
    try {
      const visited = localStorage.getItem('hs-visited');
      if (visited === 'true') {
        setIsReturningUser(true);
      }
    } catch {
      // Ignore storage access errors
    }
  }, [router]);

  // Entrance animation with GSAP (< 1.2s total)
  useEffect(() => {
    // If user prefers reduced motion, skip GSAP animation
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Initial state
      gsap.set(
        [
          topBarRef.current,
          pillRef.current,
          titleRef.current,
          subtextRef.current,
          ctaGroupRef.current,
          trustLineRef.current,
          bottomHintRef.current,
        ],
        { opacity: 0, y: 16 }
      );

      gsap.set(sceneRef.current, { opacity: 0, scale: 0.94 });

      // Staggered reveal
      tl.to(topBarRef.current, { opacity: 1, y: 0, duration: 0.4 })
        .to(sceneRef.current, { opacity: 1, scale: 1, duration: 0.8 }, '-=0.2')
        .to(pillRef.current, { opacity: 1, y: 0, duration: 0.35 }, '-=0.6')
        .to(titleRef.current, { opacity: 1, y: 0, duration: 0.4 }, '-=0.45')
        .to(subtextRef.current, { opacity: 1, y: 0, duration: 0.35 }, '-=0.35')
        .to(ctaGroupRef.current, { opacity: 1, y: 0, duration: 0.35 }, '-=0.25')
        .to(trustLineRef.current, { opacity: 1, y: 0, duration: 0.3 }, '-=0.2')
        .to(bottomHintRef.current, { opacity: 1, y: 0, duration: 0.3 }, '-=0.2');
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // "Get Started" page transition
  const handleGetStarted = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    try {
      localStorage.setItem('hs-visited', 'true');
    } catch {
      // Storage access error
    }

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      router.push('/app');
      return;
    }

    // Elegant zoom into shield + wipe overlay (0.55s)
    const tl = gsap.timeline({
      onComplete: () => {
        router.push('/app');
      },
    });

    if (wipeRef.current) {
      tl.to(wipeRef.current, {
        opacity: 1,
        duration: 0.55,
        ease: 'power2.inOut',
      });
    } else {
      setTimeout(() => router.push('/app'), 550);
    }
  }, [isTransitioning, router]);

  // Keyboard shortcut listener: Enter key triggers "Get started"
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If video modal is open, don't trigger transition
      if (isVideoOpen) return;

      if (e.key === 'Enter') {
        e.preventDefault();
        handleGetStarted();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleGetStarted, isVideoOpen]);

  // Subtle scroll gesture to navigate to /app
  useEffect(() => {
    let accumulatedDelta = 0;
    const handleWheel = (e: WheelEvent) => {
      if (isVideoOpen || isTransitioning) return;
      if (e.deltaY > 0) {
        accumulatedDelta += e.deltaY;
        if (accumulatedDelta > 150) {
          handleGetStarted();
        }
      } else {
        accumulatedDelta = 0;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [handleGetStarted, isVideoOpen, isTransitioning]);

  return (
    <div
      ref={containerRef}
      className="h-[100dvh] w-full overflow-hidden bg-bg text-text flex flex-col justify-between relative select-none"
    >
      {/* Background dot grid pattern */}
      <div
        className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none"
        aria-hidden="true"
      />

      {/* Radial forest wash */}
      <div
        className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(52,211,153,0.06),transparent_70%)] pointer-events-none dark:bg-[radial-gradient(circle,rgba(52,211,153,0.08),transparent_70%)]"
        aria-hidden="true"
      />

      {/* Transition Wipe Overlay */}
      <div
        ref={wipeRef}
        className="absolute inset-0 z-50 bg-bg pointer-events-none opacity-0"
        aria-hidden="true"
      />

      {/* TOP BAR (Minimal) */}
      <header
        ref={topBarRef}
        className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-8 py-5 flex items-center justify-between"
      >
        {/* Brand Logo: Shield mark + HermesShield */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shadow-sm">
            <Shield className="w-4 h-4 fill-primary/20 text-primary" />
          </div>
          <span className="font-heading font-semibold text-base sm:text-lg tracking-tight text-text">
            {content.meta.name}
          </span>
        </div>

        {/* Right Nav: GitHub + ThemeToggle + Skip to app */}
        <div className="flex items-center gap-3 sm:gap-4">
          <a
            href={content.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-muted hover:text-text hover:bg-surface-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
            aria-label="GitHub Repository"
          >
            <Github className="w-4 h-4" />
          </a>

          <ThemeToggle />

          <button
            id="skip-to-app-btn"
            onClick={handleGetStarted}
            className="text-xs sm:text-sm font-medium text-muted hover:text-primary transition-colors focus:outline-none focus:underline pl-1 cursor-pointer"
          >
            Skip to app →
          </button>
        </div>
      </header>

      {/* MAIN VIEWPORT: Left text block + Right 3D hero */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-2 min-h-0">
        {/* Left Column: Text & CTAs (col-span-7) */}
        <div className="lg:col-span-7 flex flex-col justify-center max-w-2xl">
          {/* Pill badge */}
          <div ref={pillRef} className="mb-5 inline-block">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-surface border border-border text-muted shadow-sm">
              <span className="w-2 h-2 rounded-full bg-highlight animate-pulse" />
              {content.hero.eyebrow}
            </span>
          </div>

          {/* H1 Heading */}
          <h1
            ref={titleRef}
            className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-semibold tracking-tight text-text leading-[1.12] mb-5"
          >
            A personal AI that keeps your secrets{' '}
            <span className="text-primary">secret.</span>
          </h1>

          {/* Subtext (max 2 lines) */}
          <p
            ref={subtextRef}
            className="text-base sm:text-lg text-muted leading-relaxed mb-7 max-w-xl"
          >
            {content.hero.subtext}
          </p>

          {/* CTAs */}
          <div
            ref={ctaGroupRef}
            className="flex flex-wrap items-center gap-3.5 mb-8"
          >
            {/* Primary CTA */}
            <button
              id="get-started-btn"
              onClick={handleGetStarted}
              disabled={isTransitioning}
              className="group relative inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-medium text-sm text-primary-fg bg-primary hover:opacity-95 shadow-sm hover:shadow-md transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
            >
              <span>
                {isReturningUser ? 'Continue to dashboard' : 'Get started'}
              </span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Secondary CTA: Video modal */}
            <button
              id="watch-demo-btn"
              onClick={() => setIsVideoOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm text-text bg-surface hover:bg-surface-2 border border-border shadow-sm hover:border-primary/30 transition-all focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current text-primary" />
              <span>Watch 3-min demo</span>
            </button>
          </div>

          {/* Tiny Trust Line */}
          <div
            ref={trustLineRef}
            className="flex items-center gap-2 text-xs text-muted/80 tracking-normal"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
            <span>
              Built with NVIDIA NemoClaw · Nebius Token Factory · NVIDIA Nemotron · Tavily
            </span>
          </div>
        </div>

        {/* Right Column: The 3D Scene (col-span-5) */}
        <div
          ref={sceneRef}
          className="lg:col-span-5 h-[320px] sm:h-[420px] lg:h-[480px] w-full flex items-center justify-center relative"
        >
          <LandingHero3D isZooming={isTransitioning} />
        </div>
      </main>

      {/* BOTTOM HINT (Press Enter to begin) */}
      <footer
        ref={bottomHintRef}
        className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between text-xs text-muted/70"
      >
        <div className="flex items-center gap-2">
          <span>Scroll or press</span>
          <kbd className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-border bg-surface text-text font-mono text-[11px] shadow-2xs">
            Enter <CornerDownLeft className="w-3 h-3 text-muted" />
          </kbd>
          <span>to begin</span>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-[11px]">
          <span>MIT Licensed</span>
          <span>·</span>
          <span>v1.0.0</span>
        </div>
      </footer>

      {/* Video Walkthrough Modal */}
      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        videoUrl={content.links.youtube}
        title="HermesShield — 3-Minute Demo"
      />
    </div>
  );
}
