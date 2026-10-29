'use client';

import React from 'react';
import { PageHeader } from '@/components/app/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Github,
  ExternalLink,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  Lock,
  Globe,
  Terminal,
} from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const stack = [
    {
      name: 'NVIDIA Nemotron',
      category: 'Foundation Models',
      desc: 'Nemotron-3-Nano (30B) for instant edge scrubbing & Nemotron-3-Super (70B) for deep technical synthesis.',
      badge: 'Tier 1 & 2',
      variant: 'cyan' as const,
    },
    {
      name: 'Nebius AI Studio',
      category: 'Inference Infrastructure',
      desc: 'High-throughput H100 SXM5 GPU token factory delivering low-latency sovereign inferences with >82% cost savings.',
      badge: 'H100 SXM5',
      variant: 'emerald' as const,
    },
    {
      name: 'Context.dev SDK',
      category: 'Web Data & Scraping',
      desc: 'Live CVE advisory discovery, GFM markdown extraction, and direct web extraction via context.dev endpoints.',
      badge: 'Live Extractor',
      variant: 'purple' as const,
    },
    {
      name: 'Tavily Search API',
      category: 'Deep Web Search',
      desc: 'Privacy Airlock destination for scrubbed technical queries, vulnerability feeds, and security intelligence.',
      badge: 'Zero Leak',
      variant: 'amber' as const,
    },
    {
      name: 'NVIDIA NemoClaw',
      category: 'Zero-Trust Sandboxing',
      desc: 'Declarative out-of-process subprocess firewall enforcing <15ms intercept latencies against unauthorized exfiltration.',
      badge: '<15ms Guard',
      variant: 'rose' as const,
    },
    {
      name: 'Next.js 14 & Tailwind',
      category: 'Frontend Engineering',
      desc: 'App router with full SSR/CSR ergonomics, shadcn/21st.dev luxury design tokens, and high-density typography.',
      badge: 'Shadcn + 21st',
      variant: 'outline' as const,
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <PageHeader
        title="About HermesShield"
        description="A personal AI assistant that keeps your secrets secret. Built for the NVIDIA × Nebius AI Hackathon 2026."
        badge="NVIDIA × Nebius Hackathon"
      />

      {/* Hero Overview */}
      <Card className="border-border/80 bg-gradient-to-br from-surface via-surface-2/40 to-surface overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-40 bg-primary/5 blur-3xl pointer-events-none" />
        <CardContent className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base sm:text-lg">HermesShield Sovereign System</CardTitle>
                <Badge variant="emerald" size="sm">
                  v1.0 Sovereign
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Devpost Hackathon Edition · October 2026
              </CardDescription>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-text/80 leading-relaxed max-w-3xl">
            Traditional personal AI agents leak local files, corporate environment variables, and proprietary source code directly to public third-party LLMs and search engines. HermesShield solves this through deterministic sandboxing (NemoClaw), an offline PII/Secret scrubbing step (Privacy Airlock), and multi-tier model routing powered by Nebius AI Studio.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-surface-2 hover:bg-surface border border-border text-text transition-colors"
            >
              <Github size={14} />
              GitHub Repository
              <ExternalLink size={12} className="text-muted" />
            </a>
            <Link
              href="/app/briefing"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-primary text-primary-fg hover:opacity-90 transition-opacity"
            >
              <Sparkles size={14} />
              Launch Interactive Briefing
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Tech Stack Bento Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-sm font-semibold text-text flex items-center gap-2">
            <Layers size={16} className="text-primary" />
            Integrated Technology Stack
          </h3>
          <span className="text-xs font-mono text-muted">6 Core Pillars</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stack.map((item) => (
            <Card
              key={item.name}
              className="border-border/80 hover:border-border transition-all flex flex-col justify-between"
            >
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted">
                    {item.category}
                  </span>
                  <Badge variant={item.variant} size="sm">
                    {item.badge}
                  </Badge>
                </div>
                <h4 className="text-sm font-semibold text-text">{item.name}</h4>
                <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
