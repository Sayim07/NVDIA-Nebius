'use client';

import React from 'react';
import { PageHeader } from '@/components/app/PageHeader';
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
    },
    {
      name: 'Nebius AI Studio',
      category: 'Inference Infrastructure',
      desc: 'High-throughput H100 SXM5 GPU token factory delivering low-latency sovereign inferences with 82.4% cost savings.',
    },
    {
      name: 'Context.dev SDK',
      category: 'Web Data & Scraping',
      desc: 'Live CVE advisory discovery, GFM markdown extraction, and direct web extraction via context.dev endpoints.',
    },
    {
      name: 'Tavily Search API',
      category: 'Deep Web Search',
      desc: 'Privacy Airlock destination for scrubbed technical queries, vulnerability feeds, and security intelligence.',
    },
    {
      name: 'NVIDIA NemoClaw',
      category: 'Zero-Trust Sandboxing',
      desc: 'Declarative out-of-process subprocess firewall enforcing <15ms intercept latencies against unauthorized exfiltration.',
    },
    {
      name: 'Next.js 14 & Tailwind',
      category: 'Frontend Engineering',
      desc: 'App router with full SSR/CSR ergonomics, dark/light theme tokens, and React Three Fiber 3D visuals.',
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
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold text-text">HermesShield Sovereign System</h2>
            <p className="text-xs text-muted">Devpost Hackathon Edition • October 2026</p>
          </div>
        </div>

        <p className="text-sm text-text/80 leading-relaxed max-w-3xl">
          Traditional personal AI agents leak local files, corporate environment variables, and proprietary source code directly to public third-party LLMs and search engines. HermesShield solves this through deterministic sandboxing (NemoClaw), an offline PII/Secret scrubbing step (Privacy Airlock), and multi-tier model routing powered by Nebius AI Studio.
        </p>

        <div className="pt-4 flex flex-wrap gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium bg-surface-2 hover:bg-surface border border-border text-text transition-colors"
          >
            <Github size={15} />
            GitHub Repository
            <ExternalLink size={12} className="text-muted" />
          </a>
          <Link
            href="/app/briefing"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium bg-primary text-primary-fg hover:opacity-90 transition-opacity"
          >
            <Sparkles size={15} />
            Launch Interactive Briefing
          </Link>
        </div>
      </div>

      {/* Tech Stack Bento Grid */}
      <div className="space-y-4">
        <h3 className="font-heading text-base font-semibold text-text flex items-center gap-2">
          <Layers size={18} className="text-primary" />
          Integrated Technology Stack
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stack.map((item) => (
            <div
              key={item.name}
              className="p-5 rounded-2xl border border-border bg-surface hover:bg-surface-2 transition-colors flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-primary">
                  {item.category}
                </span>
                <h4 className="text-sm font-semibold text-text mt-1">{item.name}</h4>
                <p className="text-xs text-muted mt-2 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
