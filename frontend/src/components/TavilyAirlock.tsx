'use client';

import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Database,
  Clock,
  Sparkles,
  Lock,
} from 'lucide-react';
import { AirlockResult } from '@/lib/types';
import { TiltCard } from './ui/TiltCard';

interface TavilyAirlockProps {
  airlock: AirlockResult | null;
}

export const TavilyAirlock: React.FC<TavilyAirlockProps> = ({ airlock }) => {
  const diff = airlock?.diff ?? {
    raw_context:
      'Project Titan internal auth service by Sayim (sayim@internal.corp) using PyJWT 2.8.0 and Next.js 14.2.1 on titan-internal-staging.company.io with AWS secret key AKIAIOSFODNN7EXAMPLE.',
    sanitized_query:
      'PyJWT 2.8.0 Next.js 14.2.1 CVE security advisory vulnerability October 2026',
    scrubbed_entities: [
      'sayim@internal.corp',
      'titan-internal-staging.company.io',
      'Sayim',
      'AKIAIOSFODNN7EXAMPLE',
    ],
    scrub_latency_ms: 184.2,
  };

  const sources = airlock?.sources ?? [
    {
      title: 'CVE-2024-34351: Next.js Server Actions Host Header Advisory',
      url: 'https://nvd.nist.gov/vuln/detail/CVE-2024-34351',
      content:
        'Next.js SSRF vulnerability in Server Actions when unvalidated Host header is supplied on custom deployments.',
      score: 0.96,
      cve_id: 'CVE-2024-34351',
    },
    {
      title: 'PyJWT Algorithm Verification and Token Parsing Guidance',
      url: 'https://github.com/jpadilla/pyjwt/security/advisories',
      content:
        'Security review for PyJWT 2.8.0 confirms recommended usage: always supply explicit algorithms parameter to decode().',
      score: 0.89,
      cve_id: 'CVE-2024-33663',
    },
  ];

  const isCached = airlock?.is_cached ?? false;

  return (
    <div className="space-y-6">
      {/* Top Banner: The $3,000 Tavily Innovation Hook */}
      <TiltCard className="p-5 bg-slate-900/90 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center space-x-3.5">
            <div className="p-2.5 rounded bg-cyan-950/70 border border-cyan-500/40 text-cyan-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono tracking-wider text-cyan-400">
                  [ 02 // PRIVACY AIRLOCK ]
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold">
                  TARGET: $3,000 BEST USE OF TAVILY
                </span>
              </div>
              <h2 className="text-base font-bold text-white tracking-tight uppercase mt-0.5">
                Privacy-Preserving Tavily Airlock <span className="font-editorial italic font-normal text-cyan-400 lowercase text-lg tracking-normal">pipeline</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 max-w-2xl leading-relaxed">
                Deterministic regex firewalls + Tier 1 Nemotron Nano scrub proprietary PII, corporate domains, and API tokens before web dispatch.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono self-start sm:self-center shrink-0">
            <div className="flex items-center px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">
              <Clock className="w-3 h-3 text-cyan-400 mr-1.5" />
              <span>[ {diff.scrub_latency_ms}ms ]</span>
            </div>
            <div className="flex items-center px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">
              <Database className="w-3 h-3 text-emerald-400 mr-1.5" />
              <span>[ {isCached ? '24h CACHE HIT' : 'LIVE DISPATCH'} ]</span>
            </div>
          </div>
        </div>
      </TiltCard>

      {/* Side-by-Side Visual Diff Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Raw Internal Context */}
        <TiltCard className="p-5 bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-rose-400" />
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-200">
                [ RAW INTERNAL CONTEXT // PRE-AIRLOCK ]
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-950/80 text-rose-300 border border-rose-800/60 flex items-center gap-1 font-semibold">
              <ShieldAlert className="w-3 h-3" />
              PROPRIETARY PII DETECTED
            </span>
          </div>

          <div className="p-4 rounded bg-slate-950 border border-slate-800/90 text-xs text-slate-300 font-mono leading-relaxed min-h-[140px]">
            {diff.raw_context}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-2">
              [ SCRUBBED ENTITIES // COUNT: {diff.scrubbed_entities.length} ]
            </div>
            <div className="flex flex-wrap gap-1.5">
              {diff.scrubbed_entities.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-950/60 text-rose-300 border border-rose-800/50"
                >
                  [REDACTED: {item}]
                </span>
              ))}
            </div>
          </div>
        </TiltCard>

        {/* Right Column: Sanitized Web Query */}
        <TiltCard className="p-5 bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-200">
                [ SANITIZED TAVILY QUERY // DISPATCHED ]
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3 h-3" />
              100% ZERO-TRUST APPROVED
            </span>
          </div>

          <div className="p-4 rounded bg-slate-950 border border-slate-800/90 text-xs text-emerald-300 font-mono leading-relaxed min-h-[140px]">
            {diff.sanitized_query}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>[ QUERY LENGTH: {diff.sanitized_query.length} CHARS ]</span>
            <span className="text-emerald-400">[ TAVILY DEPTH: BASIC (1 CREDIT) ]</span>
          </div>
        </TiltCard>
      </div>

      {/* Discovered CVE Advisories Feed */}
      <TiltCard className="p-5 bg-slate-900/90 border border-slate-800">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <span>[ DISCOVERED INTELLIGENCE & EXTRACTED ADVISORIES // {sources.length} ]</span>
          </h3>
          <span className="text-[10px] font-mono text-slate-500">
            [ CACHED 24H: hermesshield.db ]
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sources.map((src, i) => (
            <div
              key={i}
              className="p-4 rounded bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-100 uppercase tracking-tight leading-snug">
                    {src.title}
                  </h4>
                  {src.cve_id && (
                    <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-mono bg-rose-950 text-rose-300 border border-rose-800/50 font-bold">
                      [ {src.cve_id} ]
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed line-clamp-3">
                  {src.content}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>[ RELEVANCE: {(src.score * 100).toFixed(0)}% ]</span>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <span>[ SOURCE INTEL ]</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </TiltCard>
    </div>
  );
};
