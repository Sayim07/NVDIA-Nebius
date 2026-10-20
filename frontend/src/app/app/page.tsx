'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Lock,
  ShieldAlert,
  BarChart2,
  Brain,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Zap,
  TrendingDown,
} from 'lucide-react';
import { useAppState } from '@/components/app/AppStateProvider';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

// ─── Stat cards ───────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  caption: string;
  accent: 'primary' | 'info' | 'warning' | 'highlight';
}

function StatCard({ label, value, prefix, suffix, decimals, caption, accent }: StatCardProps) {
  const accentMap = {
    primary: 'text-primary bg-primary/10 border-primary/20',
    info: 'text-info bg-info/10 border-info/20',
    warning: 'text-warning bg-warning/10 border-warning/20',
    highlight: 'text-highlight bg-highlight/10 border-highlight/20',
  };

  return (
    <div className={`rounded-2xl border p-5 ${accentMap[accent]} transition-colors`}>
      <div className="text-2xl sm:text-3xl font-heading font-bold tabular-nums">
        <AnimatedCounter
          value={value}
          prefix={prefix}
          suffix={suffix}
          decimals={decimals ?? 0}
          duration={1.4}
        />
      </div>
      <div className="mt-1.5 text-sm font-medium">{label}</div>
      <p className="mt-1 text-xs opacity-70 leading-snug">{caption}</p>
      <p className="mt-1 text-[10px] opacity-50 font-mono">sample data</p>
    </div>
  );
}

// ─── Feature link cards ───────────────────────────────────────────────────────
interface FeatureLinkProps {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
}

function FeatureLink({ href, icon: Icon, title, description }: FeatureLinkProps) {
  return (
    <Link
      href={href}
      prefetch
      className="group flex items-start gap-4 p-4 rounded-2xl border border-border bg-surface hover:bg-surface-2 hover:border-primary/30 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div className="p-2.5 rounded-xl bg-surface-2 border border-border group-hover:bg-primary/10 group-hover:border-primary/30 text-muted group-hover:text-primary transition-all shrink-0">
        <Icon size={18} aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-sm text-text group-hover:text-primary transition-colors">
            {title}
          </span>
          <ChevronRight
            size={14}
            className="text-muted group-hover:text-primary transition-all group-hover:translate-x-0.5 shrink-0"
            aria-hidden="true"
          />
        </div>
        <p className="text-xs text-muted mt-0.5 leading-relaxed">{description}</p>
      </div>
    </Link>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const { isFallback, health, agentResult, securityState } = useAppState();

  // Recent events from security state
  const recentEvents = securityState?.events?.slice(0, 4) ?? [];

  // Stats (single source of truth numbers)
  const stats: StatCardProps[] = [
    {
      label: 'Lower AI cost',
      value: 82.4,
      prefix: '-',
      suffix: '%',
      decimals: 1,
      caption: '$0.00142 vs $0.00806 baseline per briefing',
      accent: 'primary',
    },
    {
      label: 'Policy check time',
      value: 15,
      prefix: '<',
      suffix: ' ms',
      decimals: 0,
      caption: 'Out-of-process sandbox intercept latency',
      accent: 'info',
    },
    {
      label: 'Searches scrubbed',
      value: 100,
      suffix: '%',
      decimals: 0,
      caption: 'Secrets removed before every Tavily search',
      accent: 'highlight',
    },
    {
      label: 'Attacks blocked',
      value: 1,
      suffix: '/1',
      decimals: 0,
      caption: 'Prompt injection attempt blocked in sandbox test',
      accent: 'warning',
    },
  ];

  const presets = [
    {
      key: 'architecture_sync',
      label: 'Architecture sync',
      description: 'Check Project Titan deps & CVEs',
    },
    {
      key: 'pr_review',
      label: 'PR security review',
      description: 'Audit PyJWT 2.8.0 & Next.js patches',
    },
    {
      key: 'competitive_scout',
      label: 'Deep web scout',
      description: 'Benchmark Nemotron inference costs',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-text">
            Welcome back
          </h1>
          <p className="mt-1 text-muted text-sm">
            Your private AI assistant is ready. All searches are scrubbed before they leave your
            machine.
          </p>
        </div>
        <Link
          href="/app/briefing"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-fg font-medium text-sm hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-primary shrink-0"
        >
          New briefing
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>

      {/* ── Status chips ── */}
      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Sandbox active
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-info/10 text-info border border-info/20">
          <CheckCircle2 size={12} aria-hidden="true" />
          Airlock armed
        </span>
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
            isFallback
              ? 'bg-warning/10 text-warning border-warning/20'
              : 'bg-primary/10 text-primary border-primary/20'
          }`}
          title={
            isFallback
              ? 'Running on local fallback data. Start the FastAPI backend to connect live.'
              : `Connected to backend v${health?.version ?? '?'}`
          }
        >
          {isFallback ? (
            <>
              <AlertTriangle size={12} aria-hidden="true" /> Demo mode
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Live
            </>
          )}
        </span>
      </div>

      {/* ── Stat cards ── */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">
          Performance statistics
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </section>

      {/* ── Feature link cards ── */}
      <section aria-labelledby="features-heading">
        <h2
          id="features-heading"
          className="text-sm font-medium text-muted uppercase tracking-wider mb-3"
        >
          Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FeatureLink
            href="/app/security"
            icon={Lock}
            title="Safe command sandbox"
            description="Blocks risky commands and secret file access before they run"
          />
          <FeatureLink
            href="/app/airlock"
            icon={ShieldAlert}
            title="Private web search"
            description="Removes emails, keys and internal names from every search"
          />
          <FeatureLink
            href="/app/costs"
            icon={BarChart2}
            title="Smart cost routing"
            description="Routes tasks to the right model size — up to 82.4% cheaper"
          />
          <FeatureLink
            href="/app/skills"
            icon={Brain}
            title="Learns your preferences"
            description="Turns your corrections into reusable YAML skills"
          />
        </div>
      </section>

      {/* ── Bottom row: recent activity + preset strip ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent activity */}
        <section
          aria-labelledby="activity-heading"
          className="lg:col-span-3 bg-surface rounded-2xl border border-border p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2
              id="activity-heading"
              className="font-medium text-sm text-text flex items-center gap-2"
            >
              <Activity size={15} className="text-muted" aria-hidden="true" />
              Recent activity
            </h2>
            <Link
              href="/app/security"
              className="text-xs text-muted hover:text-primary transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-2">
            {recentEvents.length === 0 ? (
              <p className="text-xs text-muted py-4 text-center">
                No events yet — run a briefing to see activity
              </p>
            ) : (
              recentEvents.map((ev, i) => (
                <div
                  key={ev.id ?? i}
                  className="flex items-start gap-3 px-3 py-2.5 rounded-xl bg-surface-2 border border-border"
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                      ev.status === 'BLOCKED' ? 'bg-danger' : 'bg-primary'
                    }`}
                    aria-label={ev.status}
                  />
                  <div className="flex-1 min-w-0">
                    <code className="text-xs text-text/80 font-mono truncate block">
                      {ev.command.slice(0, 50)}
                      {ev.command.length > 50 ? '…' : ''}
                    </code>
                    <p className="text-[11px] text-muted mt-0.5">{ev.reason}</p>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${
                      ev.status === 'BLOCKED'
                        ? 'text-danger border-danger/30 bg-danger/10'
                        : 'text-primary border-primary/30 bg-primary/10'
                    }`}
                  >
                    {ev.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Try a preset strip */}
        <section
          aria-labelledby="presets-heading"
          className="lg:col-span-2 bg-surface rounded-2xl border border-border p-5 flex flex-col"
        >
          <h2
            id="presets-heading"
            className="font-medium text-sm text-text flex items-center gap-2 mb-4"
          >
            <Zap size={15} className="text-primary" aria-hidden="true" />
            Try a preset
          </h2>
          <div className="space-y-2 flex-1">
            {presets.map((p) => (
              <Link
                key={p.key}
                href={`/app/briefing?preset=${p.key}`}
                className="group flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl border border-border bg-surface-2 hover:bg-primary/10 hover:border-primary/30 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="min-w-0">
                  <div className="text-xs font-medium text-text group-hover:text-primary transition-colors truncate">
                    {p.label}
                  </div>
                  <div className="text-[11px] text-muted truncate">{p.description}</div>
                </div>
                <ChevronRight
                  size={14}
                  className="text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <Link
              href="/app/briefing"
              className="flex items-center gap-2 text-xs text-muted hover:text-primary transition-colors"
            >
              <TrendingDown size={13} aria-hidden="true" />
              View cost savings →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
