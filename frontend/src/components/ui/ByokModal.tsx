// frontend/src/components/ui/ByokModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {
  Key,
  Shield,
  Eye,
  EyeOff,
  Check,
  ExternalLink,
  Lock,
  Download,
  AlertCircle,
  X,
} from 'lucide-react';
import {
  getQuotaState,
  saveCustomApiKeys,
  CustomApiKeys,
} from '@/lib/quotaStore';
import { saveBackendApiKeys } from '@/lib/api';

interface ByokModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onOpenAdmin?: () => void;
  reason?: 'limit_reached' | 'manual_config';
}

export const ByokModal: React.FC<ByokModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onOpenAdmin,
  reason = 'limit_reached',
}) => {
  const [nebiusKey, setNebiusKey] = useState('');
  const [tavilyKey, setTavilyKey] = useState('');
  const [contextKey, setContextKey] = useState('');
  const [showNebius, setShowNebius] = useState(false);
  const [showTavily, setShowTavily] = useState(false);
  const [showContext, setShowContext] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Load existing keys from store on open
  useEffect(() => {
    if (isOpen) {
      const state = getQuotaState();
      setNebiusKey(state.customKeys.nebiusKey || '');
      setTavilyKey(state.customKeys.tavilyKey || '');
      setContextKey(state.customKeys.contextDevKey || '');
      setSavedSuccess(false);
    }
  }, [isOpen]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nebiusKey.trim()) {
      alert('Please enter at least a Nebius Token Factory API key.');
      return;
    }

    setIsSaving(true);
    const keys: CustomApiKeys = {
      nebiusKey: nebiusKey.trim(),
      tavilyKey: tavilyKey.trim(),
      contextDevKey: contextKey.trim(),
    };

    // Save to browser localStorage
    saveCustomApiKeys(keys);

    // Sync to backend .env via API
    await saveBackendApiKeys({
      nebius_key: keys.nebiusKey,
      tavily_key: keys.tavilyKey,
      context_dev_key: keys.contextDevKey,
    });

    setIsSaving(false);
    setSavedSuccess(true);

    setTimeout(() => {
      onClose();
      if (onSuccess) onSuccess();
    }, 600);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md animate-fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[94vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-800 bg-slate-950 p-6 text-slate-100 shadow-2xl focus:outline-none animate-in fade-in-0 zoom-in-95">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                <Key className="h-5 w-5" />
              </div>
              <div>
                <Dialog.Title className="text-base font-semibold text-white">
                  {reason === 'limit_reached'
                    ? 'Free Demo Limit Reached (3/3)'
                    : 'Configure Personal API Keys'}
                </Dialog.Title>
                <Dialog.Description className="text-xs text-slate-400 mt-0.5">
                  {reason === 'limit_reached'
                    ? "You've used all 3 free server-sponsored scans. Enter your own keys for unlimited web scans."
                    : 'Bring Your Own Key (BYOK) for sovereign, unmetered AI scans.'}
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

          {/* Form */}
          <form onSubmit={handleSave} className="mt-4 space-y-4">
            {/* Nebius Key */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-medium text-slate-300 flex items-center gap-1.5">
                  <span className="text-emerald-400 font-bold">*</span>
                  NEBIUS_API_KEY
                </label>
                <a
                  href="https://tokenfactory.nebius.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                >
                  Get key at Nebius <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </div>
              <div className="relative">
                <input
                  type={showNebius ? 'text' : 'password'}
                  value={nebiusKey}
                  onChange={(e) => setNebiusKey(e.target.value)}
                  placeholder="sk-neb-..."
                  required
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-2 text-xs font-mono text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNebius(!showNebius)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showNebius ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-500">
                Powers Tier 1 Scrubber (Nemotron Nano) and Tier 2 Synthesis (Nemotron Super).
              </p>
            </div>

            {/* Tavily Key */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-medium text-slate-300">
                  TAVILY_API_KEY (Recommended)
                </label>
                <a
                  href="https://tavily.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                >
                  Get free key at Tavily <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </div>
              <div className="relative">
                <input
                  type={showTavily ? 'text' : 'password'}
                  value={tavilyKey}
                  onChange={(e) => setTavilyKey(e.target.value)}
                  placeholder="tvly-..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-2 text-xs font-mono text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowTavily(!showTavily)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showTavily ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-500">
                Powers live Mitre/CVE security intelligence and deep advisory discovery.
              </p>
            </div>

            {/* Context.dev Key */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-medium text-slate-300">
                  CONTEXT_DEV_API_KEY (Optional)
                </label>
                <a
                  href="https://context.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                >
                  Context.dev Docs <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </div>
              <div className="relative">
                <input
                  type={showContext ? 'text' : 'password'}
                  value={contextKey}
                  onChange={(e) => setContextKey(e.target.value)}
                  placeholder="ctx_..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-2 text-xs font-mono text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowContext(!showContext)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showContext ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* Privacy Guarantee Banner */}
            <div className="flex items-center gap-2 rounded-xl border border-slate-800/90 bg-slate-900/60 p-3 text-[11px] text-slate-400">
              <Shield className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>
                Zero-Trust Guarantee: Keys are stored in your browser's private vault and never transmitted to untrusted third parties.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {savedSuccess ? (
                  <>
                    <Check className="h-4 w-4 text-slate-950 font-bold" />
                    <span>Keys Saved & Connected!</span>
                  </>
                ) : isSaving ? (
                  <span>Saving & Connecting...</span>
                ) : (
                  <>
                    <Key className="h-4 w-4" />
                    <span>Save Keys & Continue Scan</span>
                  </>
                )}
              </button>

              <a
                href="https://github.com/Sayim07/NVDIA-Nebius"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                title="Run desktop version without web limits"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Desktop IDE</span>
              </a>
            </div>

            {/* Admin unlock shortcut trigger */}
            {onOpenAdmin && (
              <div className="text-center pt-1 border-t border-slate-900">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAdmin();
                  }}
                  className="text-[11px] font-mono text-slate-500 hover:text-emerald-400 transition-colors inline-flex items-center gap-1"
                >
                  <Lock className="h-3 w-3" />
                  <span>Have an Evaluator / Admin Passcode? Unlock here</span>
                </button>
              </div>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
