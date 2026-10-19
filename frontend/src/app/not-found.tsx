/**
 * 404 - Not Found Page
 * Sovereign cyber design matching HermesShield design system.
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#07090D] text-slate-100 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface-1 border border-white/10 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(118,185,0,0.15)]">
        <ShieldAlert className="w-8 h-8 text-nvidia" />
      </div>

      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-surface-2 border border-white/10 text-xs text-white/70 font-mono mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-nvidia animate-pulse" />
        <span>HTTP 404 // ROUTE NOT FOUND</span>
      </div>

      <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight text-white mb-3">
        Perimeter boundary <span className="font-editorial italic font-normal text-nvidia text-5xl sm:text-6xl">reached.</span>
      </h1>

      <p className="max-w-md text-base text-white/70 mb-8 font-sans">
        The requested resource is outside the zero-trust perimeter or does not exist.
      </p>

      <Link
        href="/"
        className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-nvidia hover:bg-nvidia-hover text-black font-semibold text-sm transition-all duration-200 shadow-[0_0_20px_rgba(118,185,0,0.3)] hover:shadow-[0_0_30px_rgba(118,185,0,0.5)]"
      >
        <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
}
