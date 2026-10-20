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
  RotateCcw,
} from 'lucide-react';
import { content } from '@/content/content';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import LandingHero3D from '@/components/landing/LandingHero3D';
import { VideoModal } from '@/components/ui/VideoModal';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { LandingMenuOverlay } from '@/components/landing/LandingMenuOverlay';
import { TerminalOverlay } from '@/components/landing/TerminalOverlay';
import { LandingLoader } from '@/components/landing/LandingLoader';

export default function LandingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaderReplay, setIsLoaderReplay] = useState(false);
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Cinematic Intro Sequence State (5 Stages)
  const [introProgress, setIntroProgress] = useState(1.0);
  const [introCaption, setIntroCaption] = useState<string | null>(null);
  const [isIntroPlaying, setIsIntroPlaying] = useState(false);
  const [isTerminalVisible, setIsTerminalVisible] = useState(false);
  const introTlRef = useRef<gsap.core.Timeline | null>(null);

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

  // Skip Intro
  const skipIntro = useCallback(() => {
    if (introTlRef.current) introTlRef.current.kill();
    setIntroCaption(null);
    setIsIntroPlaying(false);
    setIsTerminalVisible(false);
    setIntroProgress(1.0);
    try {
      localStorage.setItem('hs-intro-seen', 'true');
    } catch {
      // Ignore storage error
    }
  }, []);

  // Start / Replay Intro
  const startIntro = useCallback(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      setIntroProgress(1.0);
      setIsIntroPlaying(false);
      setIsTerminalVisible(false);
      return;
    }

    setIsIntroPlaying(true);
    setIntroProgress(0.0);
    setIsTerminalVisible(false);
    setIntroCaption('Your AI sees everything.');

    if (introTlRef.current) introTlRef.current.kill();

    const progressObj = { p: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        setIntroCaption(null);
        setIsIntroPlaying(false);
        setIsTerminalVisible(false);
        setIntroProgress(1.0);
        try {
          localStorage.setItem('hs-intro-seen', 'true');
        } catch {
          // Ignore storage error
        }
      },
    });

    introTlRef.current = tl;

    // Stage 1 (0 to 2s): Nebula stars drift, caption "Your AI sees everything."
    // Stage 2 (2 to 4.5s): Stars converge into shield silhouette, caption "So we built a shield around it."
    tl.to({}, { duration: 2.0 })
      .call(() => {
        setIntroCaption('So we built a shield around it.');
      })
      .to(progressObj, {
        p: 1.0,
        duration: 2.5,
        ease: 'power3.inOut',
        onUpdate: () => setIntroProgress(progressObj.p),
      })
      // Stage 3 (4.5 to 6s): Star flight
      .call(() => {
        setIntroCaption(null);
      })
      .to({}, { duration: 1.5 })
      // Stage 4 (6 to 11.5s): Typed prompts (Terminal Overlay appears)
      .call(() => {
        setIsTerminalVisible(true);
      })
      .to({}, { duration: 5.2 })
      // Stage 5 (11.5s+): Terminal fades out, Title state reveals
      .call(() => {
        setIsTerminalVisible(false);
        setIsIntroPlaying(false);
      });
  }, []);

  // Keyboard shortcut for skipping intro (Space / Esc)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (isIntroPlaying && (e.code === 'Space' || e.key === 'Escape')) {
        e.preventDefault();
        skipIntro();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isIntroPlaying, skipIntro]);

  // Staggered Hero Entrance animation with GSAP (< 1.2s total)
  const playHeroEntrance = useCallback(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

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
  }, []);

  // Guarantee initial hidden state during loading so there is zero flash on reveal
  useEffect(() => {
    if (isLoading) {
      const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;
      if (!prefersReducedMotion) {
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
        if (sceneRef.current) {
          gsap.set(sceneRef.current, { opacity: 0, scale: 0.94 });
        }
      }
    }
  }, [isLoading]);

  // Loader Completion Handler
  const handleLoaderComplete = useCallback(() => {
    setIsLoading(false);
    if (isLoaderReplay) {
      setIsLoaderReplay(false);
      startIntro();
    } else {
      playHeroEntrance();
    }
  }, [isLoaderReplay, startIntro, playHeroEntrance]);

  // Replay Intro with Loader
  const handleReplayWithLoader = useCallback(() => {
    setIsLoaderReplay(true);
    setIsLoading(true);
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
      // If video modal or menu overlay is open, don't trigger transition
      if (isVideoOpen || isMenuOpen) return;

      if (e.key === 'Enter') {
        e.preventDefault();
        handleGetStarted();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleGetStarted, isVideoOpen, isMenuOpen]);

  // Subtle scroll gesture to navigate to /app
  useEffect(() => {
    let accumulatedDelta = 0;
    const handleWheel = (e: WheelEvent) => {
      if (isVideoOpen || isMenuOpen || isTransitioning) return;
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
      {/* 1. Dedicated Full-Screen Loader (Opaque theme bg, z-[100]) */}
      {isLoading && (
        <LandingLoader
          onComplete={handleLoaderComplete}
          isReplay={isLoaderReplay}
        />
      )}

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

      {/* FULL-VIEWPORT 3D CANVAS (Hidden while loading so assets preload without flash) */}
      <div
        ref={sceneRef}
        className="fixed inset-0 z-0 pointer-events-none overflow-visible select-none"
        style={{ visibility: isLoading ? 'hidden' : 'visible' }}
        aria-hidden="true"
      >
        <LandingHero3D progress={introProgress} isZooming={isTransitioning} />
      </div>

      {/* HERO CONTENT SHELL: Fully hidden & inert until loader completes (zero layout shift, zero flash) */}
      <div
        className="h-full w-full flex flex-col justify-between relative z-10"
        style={{ visibility: isLoading ? 'hidden' : 'visible' }}
        inert={isLoading ? true : undefined}
        aria-hidden={isLoading ? true : undefined}
      >
        {/* TOP BAR */}
        <div ref={topBarRef as any} className="relative z-30 w-full">
          <LandingNavbar
            onGetStarted={handleGetStarted}
            onOpenVideo={() => setIsVideoOpen(true)}
            isTransitioning={isTransitioning}
          />
        </div>

        {/* MAIN VIEWPORT: Left text block + Right spacer */}
        <main className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-2 min-h-0 pointer-events-none">
          {/* Left Column: Text & CTAs (col-span-7) */}
          <div
            className={`lg:col-span-7 flex flex-col justify-center max-w-2xl relative z-10 pointer-events-auto transition-all duration-700 ${
              isIntroPlaying
                ? 'opacity-0 pointer-events-none translate-y-4'
                : 'opacity-100 translate-y-0'
            }`}
          >
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

            {/* Subtext */}
            <p
              ref={subtextRef}
              className="text-base sm:text-lg text-muted leading-relaxed mb-7 max-w-xl"
            >
              {content.hero.subtext}
            </p>

            {/* CTAs */}
            <div
              ref={ctaGroupRef}
              className="flex flex-wrap items-center gap-3.5 mb-8 relative z-30"
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

          {/* Right Column spacer */}
          <div className="hidden lg:block lg:col-span-5 pointer-events-none" aria-hidden="true" />
        </main>

        {/* Cinematic Stage 4: Typed Terminal Overlay */}
        {isIntroPlaying && isTerminalVisible && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center pointer-events-none p-6 bg-bg/50 backdrop-blur-sm">
            <div className="w-full max-w-xl pointer-events-auto">
              <TerminalOverlay isVisible={isTerminalVisible} />
            </div>
            <button
              id="skip-intro-btn"
              onClick={skipIntro}
              className="mt-6 pointer-events-auto px-4 py-1.5 rounded-full text-xs font-medium text-muted hover:text-text bg-surface-2/80 hover:bg-surface-2 border border-border transition-colors cursor-pointer shadow-sm"
            >
              Skip intro (Space / Esc)
            </button>
          </div>
        )}

        {/* Cinematic Intro Caption Overlay (Stages 1 & 2) */}
        {isIntroPlaying && introCaption && !isTerminalVisible && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-between pointer-events-none py-24 px-6">
            <div className="px-6 py-3.5 rounded-full bg-surface/90 border border-border/80 backdrop-blur-xl shadow-2xl text-center pointer-events-auto transition-all animate-fade-in">
              <p className="font-heading text-lg sm:text-2xl text-text font-semibold tracking-tight">
                {introCaption}
              </p>
            </div>
            <button
              id="skip-intro-caption-btn"
              onClick={skipIntro}
              className="pointer-events-auto px-4 py-1.5 rounded-full text-xs font-medium text-muted hover:text-text bg-surface-2/80 hover:bg-surface-2 border border-border transition-colors cursor-pointer shadow-sm"
            >
              Skip intro (Space / Esc)
            </button>
          </div>
        )}

        {/* BOTTOM HINT (Press Enter to begin) + Replay Intro */}
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

          <div className="flex items-center gap-3 sm:gap-4 text-[11px]">
            <button
              id="replay-intro-btn"
              onClick={handleReplayWithLoader}
              className="inline-flex items-center gap-1.5 text-muted hover:text-text transition-colors cursor-pointer"
              title="Replay intro with loader"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Replay intro</span>
            </button>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">MIT Licensed</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">v1.0.0</span>
          </div>
        </footer>
      </div>

      {/* Navigation Full-Screen Overlay */}
      <LandingMenuOverlay
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onOpenVideo={() => setIsVideoOpen(true)}
        onReplayIntro={handleReplayWithLoader}
      />

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
