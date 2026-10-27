// frontend/src/components/ui/AdminModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {
  ShieldCheck,
  Lock,
  Unlock,
  RotateCcw,
  Check,
  AlertCircle,
  X,
  Sparkles,
} from 'lucide-react';
import {
  getQuotaState,
  verifyAndUnlockAdmin,
  lockAdminMode,
  resetFreeRuns,
} from '@/lib/quotaStore';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [runsUsed, setRunsUsed] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const q = getQuotaState();
      setIsAdmin(q.isAdmin);
      setRunsUsed(q.runsUsed);
      setPasscode('');
      setErrorMsg('');
    }
  }, [isOpen]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const success = verifyAndUnlockAdmin(passcode);
    if (success) {
      setIsAdmin(true);
      setErrorMsg('');
      if (onSuccess) onSuccess();
      setTimeout(() => {
        onClose();
      }, 700);
    } else {
      setErrorMsg('Invalid admin passcode. Hint: hermes2026');
    }
  };

  const handleLock = () => {
    lockAdminMode();
    setIsAdmin(false);
    setErrorMsg('');
  };

  const handleResetRuns = () => {
    resetFreeRuns();
    setRunsUsed(0);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md animate-fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[94vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-800 bg-slate-950 p-6 text-slate-100 shadow-2xl focus:outline-none animate-in fade-in-0 zoom-in-95">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                  isAdmin
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                    : 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                }`}
              >
                {isAdmin ? <ShieldCheck className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
              </div>
              <div>
                <Dialog.Title className="text-base font-semibold text-white">
                  {isAdmin ? 'Admin Evaluator Active' : 'Admin & Evaluator Gate'}
                </Dialog.Title>
                <Dialog.Description className="text-xs text-slate-400 mt-0.5">
                  {isAdmin
                    ? 'Unlimited master access unlocked. Quota limits are bypassed.'
                    : 'Enter the master evaluation passcode to unlock unlimited access.'}
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close asChild>
              <button
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-900 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          {/* Body */}
          {isAdmin ? (
            <div className="mt-5 space-y-4">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                  <Sparkles className="h-4 w-4" />
                  <span>UNLIMITED BYPASS ACTIVE</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  You are in master administrative mode. The 3-scan demo limit will never interrupt your workflow.
                </p>
              </div>

              {/* Reset counters & Lock controls */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleResetRuns}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Reset Demo Counter (Current: {runsUsed}/3)</span>
                </button>

                <button
                  type="button"
                  onClick={handleLock}
                  className="flex items-center justify-center gap-2 rounded-xl border border-rose-900/40 bg-rose-950/20 p-2.5 text-xs font-medium text-rose-300 hover:bg-rose-900/30 transition-colors"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>Lock Admin Mode (Test Normal User Flow)</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUnlock} className="mt-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-slate-300">
                  MASTER PASSCODE
                </label>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="Enter passcode..."
                  required
                  autoFocus
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-2 text-xs font-mono text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                {errorMsg && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-1 font-mono">
                    <AlertCircle className="h-3 w-3" />
                    {errorMsg}
                  </p>
                )}
                <p className="text-[10px] text-slate-500">
                  Developer default passcode: <code className="text-slate-400">hermes2026</code>
                </p>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-all active:scale-[0.98]"
              >
                <Unlock className="h-3.5 w-3.5" />
                <span>Verify & Unlock Unlimited Mode</span>
              </button>
            </form>
          )}

          {/* Shortcut note */}
          <div className="mt-4 border-t border-slate-900 pt-3 text-center">
            <span className="text-[10px] font-mono text-slate-600">
              Pro tip: Press <kbd className="bg-slate-900 px-1 py-0.5 rounded border border-slate-800 text-slate-400">Ctrl+Shift+A</kbd> anywhere to toggle this panel.
            </span>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
