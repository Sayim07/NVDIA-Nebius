'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ExternalLink,
  ArrowRight,
  Shield,
  Layers,
  Lock,
  TrendingDown,
  Terminal,
  Play,
  Github,
  RotateCcw,
} from 'lucide-react';
import { content, OverlayMenuItem } from '@/content/content';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface LandingMenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenVideo?: () => void;
  onReplayIntro?: () => void;
}

const itemIcons: Record<string, React.ElementType> = {
  overview: RotateCcw,
  'how-it-works': Layers,
  airlock: Lock,
  costs: TrendingDown,
  demo: Terminal,
  video: Play,
  app: ArrowRight,
  github: Github,
};

export function LandingMenuOverlay({
  isOpen,
  onClose,
  onOpenVideo,
  onReplayIntro,
}: LandingMenuOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape & trap focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleItemClick = (item: OverlayMenuItem) => {
    if (item.action === 'video') {
      onClose();
      if (onOpenVideo) onOpenVideo();
    } else if (item.action === 'replay') {
      onClose();
      if (onReplayIntro) onReplayIntro();
    } else {
      onClose();
    }
  };

  const menuVariants = {
    closed: { opacity: 0 },
    open: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.03,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, y: 16 },
    open: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
          className="fixed inset-0 z-50 flex flex-col justify-between bg-bg/95 backdrop-blur-xl text-text p-6 sm:p-10 select-none overflow-y-auto"
        >
          {/* Top Bar of Overlay */}
          <div className="w-full max-w-5xl mx-auto flex items-center justify-between border-b border-border pb-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shadow-sm">
                <Shield className="w-4 h-4 fill-primary/20 text-primary" />
              </div>
              <span className="font-heading font-semibold text-lg tracking-tight text-text">
                {content.meta.name}
              </span>
            </div>

            <button
              id="close-overlay-btn"
              onClick={onClose}
              className="p-2 rounded-xl border border-border bg-surface hover:bg-surface-2 text-muted hover:text-text transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items (Staggered Grid) */}
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="exit"
            className="w-full max-w-5xl mx-auto py-8 sm:py-12 grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 my-auto"
          >
            {content.nav.overlayMenu.map((item) => {
              const Icon = itemIcons[item.id] || ArrowRight;
              const isExternal = item.href?.startsWith('http');

              const contentNode = (
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-surface-2 border border-border group-hover:border-primary/40 group-hover:bg-primary/10 text-muted group-hover:text-primary transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-medium text-base text-text group-hover:text-primary transition-colors">
                        {item.label}
                      </span>
                      {isExternal && <ExternalLink className="w-3.5 h-3.5 text-muted/60" />}
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-muted mt-0.5 line-clamp-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              );

              return (
                <motion.div key={item.id} variants={itemVariants}>
                  {item.href ? (
                    isExternal ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleItemClick(item)}
                        className="group block p-4 rounded-2xl border border-border bg-surface hover:bg-surface-2 hover:border-primary/30 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                      >
                        {contentNode}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => handleItemClick(item)}
                        className="group block p-4 rounded-2xl border border-border bg-surface hover:bg-surface-2 hover:border-primary/30 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                      >
                        {contentNode}
                      </Link>
                    )
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleItemClick(item)}
                      className="group w-full text-left p-4 rounded-2xl border border-border bg-surface hover:bg-surface-2 hover:border-primary/30 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                    >
                      {contentNode}
                    </button>
                  )}
                </motion.div>
              );
            })}
          </motion.div>

          {/* Footer of Overlay */}
          <div className="w-full max-w-5xl mx-auto pt-5 border-t border-border flex flex-wrap items-center justify-between gap-4 text-xs text-muted">
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <span>Theme: toggle Dark (Forest Night) or Light (Paper & Forest)</span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span>Built for the Nebius x NVIDIA Global AI Hackathon</span>
              <span>·</span>
              <span className="px-2 py-0.5 rounded border border-border bg-surface text-text font-mono text-[11px]">
                MIT License
              </span>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
