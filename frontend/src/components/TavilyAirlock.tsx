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
      <TiltCard className="p-4 bg-slate-900/90 border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                Privacy-Preserving Tavily Airlock
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                  Target: $3,000 Best Use of Tavily
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Zero-PII sanitization engine combining deterministic regex firewalls with Tier 1 Nemotron Nano before web dispatch.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono">
            <div className="flex items-center px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-cyan-400 mr-1.5" />
              <span>{diff.scrub_latency_ms}ms</span>
            </div>
            <div className="flex items-center px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">
              <Database className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
              <span>{isCached ? '24h Cache HIT' : 'Live Search'}</span>
            </div>
          </div>
        </div>
      </TiltCard>

      {/* Side-by-Side Visual Diff Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Raw Internal Context */}
        <TiltCard className="p-5 bg-slate-900/90 border-slate-800">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-rose-400" />
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-200">
                Internal Context (Pre-Airlock)
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-950/80 text-rose-300 border border-rose-800/60 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" />
              Blocked PII Detected
            </span>
          </div>

          <div className="p-3.5 rounded-md bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono leading-relaxed min-h-[140px]">
            {diff.raw_context}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2">
              Scrubbed Entities ({diff.scrubbed_entities.length})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {diff.scrubbed_entities.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[11px] font-mono bg-rose-950/60 text-rose-300 border border-rose-800/50"
                >
                  [REDACTED] {item}
                </span>
              ))}
            </div>
          </div>
        </TiltCard>

        {/* Right Column: Sanitized Web Query */}
        <TiltCard className="p-5 bg-slate-900/90 border-slate-800">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-200">
                Sanitized Tavily Search Query
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              100% Zero-Trust Approved
            </span>
          </div>

          <div className="p-3.5 rounded-md bg-slate-950 border border-slate-800 text-xs text-emerald-300 font-mono leading-relaxed min-h-[140px]">
            {diff.sanitized_query}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Query Length: {diff.sanitized_query.length} chars</span>
            <span className="text-emerald-400">Tavily Depth: Basic (1 credit)</span>
          </div>
        </TiltCard>
      </div>

      {/* Discovered CVE Advisories Feed */}
      <TiltCard className="p-5 bg-slate-900/90 border-slate-800">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-200 flex items-center gap-2">
            Discovered Intelligence & Extracted Advisories ({sources.length})
          </h3>
          <span className="text-[10px] font-mono text-slate-500">
            Cached for 24h in SQLite (hermesshield.db)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sources.map((src, i) => (
            <div
              key={i}
              className="p-3.5 rounded-md bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between space-y-2"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-semibold text-slate-200 leading-snug">
                    {src.title}
                  </h4>
                  {src.cve_id && (
                    <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-mono bg-rose-950 text-rose-300 border border-rose-800/50">
                      {src.cve_id}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed line-clamp-3">
                  {src.content}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Score: {(src.score * 100).toFixed(0)}%</span>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <span>Source URL</span>
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
