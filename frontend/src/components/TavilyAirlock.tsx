// frontend/src/components/TavilyAirlock.tsx
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
  Globe,
  CheckCircle2,
} from 'lucide-react';
import { AirlockResult } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { BorderBeam } from '@/components/ui/BorderBeam';

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
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Top Banner: The Tavily Privacy Airlock System */}
      <Card className="relative overflow-hidden border-cyan-500/30 bg-gradient-to-r from-surface via-surface to-cyan-950/20 p-6 shadow-card">
        <BorderBeam
          size={240}
          duration={12}
          colorFrom="#06b6d4"
          colorTo="#10b981"
          borderWidth={1.5}
        />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
          <div className="flex items-start sm:items-center gap-4">
            <div className="p-3 rounded-xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="cyan">02 // PRIVACY AIRLOCK</Badge>
                <Badge variant="outline">ZERO-PII WEB SCOUT</Badge>
              </div>
              <h2 className="text-lg font-heading font-bold text-text tracking-tight uppercase">
                Privacy-Preserving Tavily Airlock
              </h2>
              <p className="text-xs text-muted max-w-2xl leading-relaxed">
                Two-stage sanitization (Regex Firewall + Tier 1 Nemotron Nano) scrubs proprietary tokens,
                developer identities, and corporate hostnames before any query touches the public internet.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono self-start sm:self-center shrink-0">
            <Badge variant="secondary" className="gap-1.5 py-1">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>{diff.scrub_latency_ms}ms</span>
            </Badge>
            <Badge variant={isCached ? 'emerald' : 'cyan'} className="gap-1.5 py-1">
              <Database className="w-3 h-3" />
              <span>{isCached ? '24h CACHE HIT' : 'LIVE DISPATCH'}</span>
            </Badge>
          </div>
        </div>
      </Card>

      {/* Side-by-Side Visual Diff Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Raw Internal Context */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-3 border-b border-border/80">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-rose-400">
                <Lock className="w-4 h-4 text-rose-400" />
                <span>Raw Context (Pre-Airlock)</span>
              </CardTitle>
              <Badge variant="rose" className="gap-1 text-[10px]">
                <ShieldAlert className="w-3 h-3" />
                PII DETECTED
              </Badge>
            </div>
            <CardDescription>
              Local workspace context containing sensitive credentials and internal identifiers
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4 flex-1">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono leading-relaxed min-h-[140px] select-all">
              {diff.raw_context}
            </div>

            <div className="mt-4 pt-3 border-t border-border/60">
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted mb-2">
                Redacted Entities ({diff.scrubbed_entities.length})
              </div>
              <div className="flex flex-wrap gap-1.5">
                {diff.scrubbed_entities.map((item, idx) => (
                  <Badge key={idx} variant="rose" className="text-[10px]">
                    [REDACTED: {item}]
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Sanitized Web Query */}
        <Card className="relative overflow-hidden flex flex-col justify-between shadow-card border-emerald-500/30">
          <BorderBeam
            size={200}
            duration={10}
            colorFrom="#10b981"
            colorTo="#06b6d4"
            borderWidth={1.5}
          />
          <CardHeader className="pb-3 border-b border-border/80 relative z-10">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Sanitized Query (Dispatched)</span>
              </CardTitle>
              <Badge variant="emerald" className="gap-1 text-[10px]">
                <ShieldCheck className="w-3 h-3" />
                AIRLOCK APPROVED
              </Badge>
            </div>
            <CardDescription>
              Abstract technical packages & version tokens dispatched to Tavily & Context.dev
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4 flex-1">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-400 font-mono leading-relaxed min-h-[140px] select-all">
              {diff.sanitized_query}
            </div>

            <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] font-mono text-muted">
              <span>QUERY LENGTH: {diff.sanitized_query.length} CHARS</span>
              <span className="text-emerald-400">TAVILY DEPTH: BASIC (1 CREDIT)</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Discovered CVE Advisories Feed */}
      <Card>
        <CardHeader className="pb-3 border-b border-border/80">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Discovered Web Advisories & CVE Intelligence ({sources.length})</span>
            </CardTitle>
            <Badge variant="secondary" className="text-[10px]">
              CACHED 24H IN SQLITE
            </Badge>
          </div>
          <CardDescription>
            Live security advisories retrieved from Mitre and national vulnerability databases
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sources.map((src, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-border/80 bg-surface-2/60 hover:border-border hover:bg-surface-2 transition-all flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-semibold text-text leading-snug">
                      {src.title}
                    </h4>
                    {src.cve_id && (
                      <Badge variant="rose" className="shrink-0 text-[10px]">
                        {src.cve_id}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted mt-2 leading-relaxed line-clamp-3">
                    {src.content}
                  </p>
                </div>

                <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[11px] font-mono text-muted">
                  <span>RELEVANCE: {(src.score * 100).toFixed(0)}%</span>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <span>View Advisory</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
