'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Lock, Sparkles, Terminal } from 'lucide-react';

interface TerminalOverlayProps {
  isVisible: boolean;
  onComplete?: () => void;
}

export function TerminalOverlay({ isVisible, onComplete }: TerminalOverlayProps) {
  // Typing state machine
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  // 0: typing raw prompt
  // 1: highlighting secrets with red pills
  // 2: typing cleaned query
  // 3: status chips tick on

  const [rawText, setRawText] = useState('');
  const [cleanedText, setCleanedText] = useState('');

  const fullRaw = 'Check if our Project Titan staging server (staging.titan.acme.io) with key AKIA... has any new security advisories.';
  const fullCleaned = 'FastAPI and Next.js CVE security advisories';

  useEffect(() => {
    if (!isVisible) {
      setStep(0);
      setRawText('');
      setCleanedText('');
      return;
    }

    let isMounted = true;
    let charIndex = 0;

    // Step 0: Type raw prompt character by character
    const rawInterval = setInterval(() => {
      if (!isMounted) return;
      if (charIndex < fullRaw.length) {
        setRawText(fullRaw.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(rawInterval);
        // Pause 400ms then move to step 1 (redaction)
        setTimeout(() => {
          if (!isMounted) return;
          setStep(1);

          // Pause 700ms then move to step 2 (cleaned query typing)
          setTimeout(() => {
            if (!isMounted) return;
            setStep(2);

            let cleanIndex = 0;
            const cleanInterval = setInterval(() => {
              if (!isMounted) return;
              if (cleanIndex < fullCleaned.length) {
                setCleanedText(fullCleaned.slice(0, cleanIndex + 1));
                cleanIndex++;
              } else {
                clearInterval(cleanInterval);
                // Pause 300ms then show status chips (step 3)
                setTimeout(() => {
                  if (!isMounted) return;
                  setStep(3);
                  if (onComplete) {
                    setTimeout(onComplete, 1200);
                  }
                }, 300);
              }
            }, 25);
          }, 800);
        }, 450);
      }
    }, 22);

    return () => {
      isMounted = false;
      clearInterval(rawInterval);
    };
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: -16 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-xl mx-auto rounded-2xl border border-border bg-surface/92 backdrop-blur-2xl shadow-2xl overflow-hidden select-none"
        >
          {/* Terminal Title Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-2/60">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-danger/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-warning/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-primary/80" />
              <span className="ml-2 font-mono text-xs text-muted font-medium flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-primary" />
                <span>airlock-scrubber · stream</span>
              </span>
            </div>

            <span className="font-mono text-[11px] text-muted/70 px-2 py-0.5 rounded bg-surface border border-border/80">
              {step < 1 ? 'ANALYZING' : step < 3 ? 'REDACTING' : 'SANITIZED'}
            </span>
          </div>

          {/* Terminal Content Body */}
          <div className="p-4 sm:p-5 space-y-4">
            {/* 1. Raw Prompt Line */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-muted mb-1.5">
                <span className="text-danger flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  RAW PROMPT ON DEVICE
                </span>
                {step >= 1 && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-danger font-medium"
                  >
                    3 secrets flagged
                  </motion.span>
                )}
              </div>

              <div className="p-3 rounded-xl bg-surface-2 border border-border font-mono text-xs sm:text-sm text-text leading-relaxed">
                {step === 0 ? (
                  <span>
                    {rawText}
                    <span className="inline-block w-1.5 h-4 ml-0.5 bg-primary animate-pulse align-middle" />
                  </span>
                ) : (
                  <span>
                    Check if our{' '}
                    <motion.span
                      initial={{ backgroundColor: 'rgba(248, 113, 113, 0.4)' }}
                      animate={{ backgroundColor: 'rgba(248, 113, 113, 0.2)' }}
                      className="px-1.5 py-0.5 rounded bg-danger/20 text-danger border border-danger/40 font-semibold"
                    >
                      [PROJECT NAME]
                    </motion.span>{' '}
                    staging server (
                    <motion.span
                      initial={{ backgroundColor: 'rgba(248, 113, 113, 0.4)' }}
                      animate={{ backgroundColor: 'rgba(248, 113, 113, 0.2)' }}
                      className="px-1.5 py-0.5 rounded bg-danger/20 text-danger border border-danger/40 font-semibold"
                    >
                      [INTERNAL URL]
                    </motion.span>
                    ) with key{' '}
                    <motion.span
                      initial={{ backgroundColor: 'rgba(248, 113, 113, 0.4)' }}
                      animate={{ backgroundColor: 'rgba(248, 113, 113, 0.2)' }}
                      className="px-1.5 py-0.5 rounded bg-danger/20 text-danger border border-danger/40 font-semibold"
                    >
                      [API KEY]
                    </motion.span>{' '}
                    has any new security advisories.
                  </span>
                )}
              </div>
            </div>

            {/* 2. Cleaned Query Line (reveals at step 2) */}
            {step >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-primary mb-1.5">
                  <span className="flex items-center gap-1 font-medium">
                    <Sparkles className="w-3 h-3 text-primary" />
                    SANITIZED QUERY SENT TO TAVILY
                  </span>
                  <span className="text-primary font-medium">0 secrets leaked</span>
                </div>

                <div className="p-3 rounded-xl bg-primary/10 border border-primary/30 font-mono text-xs sm:text-sm text-text leading-relaxed">
                  <span className="text-primary font-medium">{cleanedText}</span>
                  {step === 2 && (
                    <span className="inline-block w-1.5 h-4 ml-0.5 bg-primary animate-pulse align-middle" />
                  )}
                </div>
              </motion.div>
            )}

            {/* 3. Live Status Chips (reveals at step 3) */}
            {step >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="pt-1 flex flex-wrap items-center gap-2"
              >
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-primary/15 text-primary border border-primary/25">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Airlock: secrets removed
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-surface-2 text-text border border-border">
                  <span className="w-2 h-2 rounded-full bg-highlight animate-pulse" />
                  Safe to search
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-mono text-muted border border-border">
                  11.4ms
                </span>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
