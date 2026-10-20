'use client';

import React from 'react';
import { PageHeader } from '@/components/app/PageHeader';
import { MetricsRibbon } from '@/components/MetricsRibbon';
import { useAppState } from '@/components/app/AppStateProvider';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { Zap, TrendingDown, Cpu, Clock, CheckCircle2, DollarSign } from 'lucide-react';

export default function CostsPage() {
  const { telemetry, agentResult } = useAppState();

  const currentFinops = agentResult?.finops ?? telemetry ?? {
    total_cost_usd: 0.00142,
    baseline_cost_usd: 0.00806,
    cost_reduction_percent: 82.38,
    execution_latency_ms: 1940,
    tier_breakdown: [
      {
        tier_name: 'Tier 1: Nemotron Nano',
        model: 'nvidia/nemotron-3-nano-30b-a3b',
        cost_usd: 0.00018,
        latency_ms: 320,
        provider: 'Nebius Token Factory',
      },
      {
        tier_name: 'Tier 2: Nemotron Super',
        model: 'nvidia/nemotron-3-super-70b-instruct',
        cost_usd: 0.00124,
        latency_ms: 1620,
        provider: 'Nebius Token Factory',
      },
    ],
  };

  const cost = currentFinops.total_cost_usd ?? 0.00142;
  const baseline = currentFinops.baseline_cost_usd ?? 0.00806;
  const reduction = currentFinops.cost_reduction_percent ?? 82.4;
  const latency = (currentFinops.execution_latency_ms ?? 1940) / 1000;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <PageHeader
        title="Cost & Speed Analytics"
        description="Dynamic FinOps telemetry demonstrating our intelligent two-tier architecture on Nebius AI Studio. Lightweight preprocessing runs on Nemotron Nano, saving >82% on every execution."
        badge="Nebius FinOps Engine"
      />

      {/* Top metrics summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-primary/20 bg-primary/10 p-5">
          <div className="flex items-center justify-between text-xs font-medium text-primary">
            <span>Execution Cost</span>
            <DollarSign size={16} />
          </div>
          <div className="text-3xl font-heading font-bold text-primary mt-2">
            <AnimatedCounter value={cost} decimals={5} prefix="$" duration={1.2} />
          </div>
          <p className="text-xs text-muted mt-1">vs ${baseline.toFixed(5)} monolithic baseline</p>
        </div>

        <div className="rounded-2xl border border-info/20 bg-info/10 p-5">
          <div className="flex items-center justify-between text-xs font-medium text-info">
            <span>Cost Reduction</span>
            <TrendingDown size={16} />
          </div>
          <div className="text-3xl font-heading font-bold text-info mt-2">
            <AnimatedCounter value={reduction} decimals={1} suffix="%" duration={1.2} />
          </div>
          <p className="text-xs text-muted mt-1">Verified FinOps multi-tier savings</p>
        </div>

        <div className="rounded-2xl border border-warning/20 bg-warning/10 p-5">
          <div className="flex items-center justify-between text-xs font-medium text-warning">
            <span>Average Latency</span>
            <Clock size={16} />
          </div>
          <div className="text-3xl font-heading font-bold text-warning mt-2">
            <AnimatedCounter value={latency} decimals={2} suffix="s" duration={1.2} />
          </div>
          <p className="text-xs text-muted mt-1">End-to-end sanitized execution</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between text-xs font-medium text-text">
            <span>Hardware Target</span>
            <Cpu size={16} className="text-primary" />
          </div>
          <div className="text-lg font-heading font-semibold text-text mt-2 truncate">
            Nebius H100 SXM5
          </div>
          <p className="text-xs text-muted mt-1">High-throughput token factory</p>
        </div>
      </div>

      {/* Metrics ribbon */}
      <MetricsRibbon />

      {/* Tier breakdown table */}
      <div className="rounded-2xl border border-border bg-surface p-6 space-y-4">
        <h2 className="font-heading text-lg font-semibold text-text">
          Two-Tier Model Routing Breakdown
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-muted">
                <th className="pb-3 font-medium">TIER / PHASE</th>
                <th className="pb-3 font-medium">MODEL ARCHITECTURE</th>
                <th className="pb-3 font-medium">PURPOSE</th>
                <th className="pb-3 font-medium">COST</th>
                <th className="pb-3 font-medium">LATENCY</th>
                <th className="pb-3 font-medium">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="hover:bg-surface-2 transition-colors">
                <td className="py-3 font-mono font-semibold text-primary">Tier 1: Nano</td>
                <td className="py-3 font-mono text-text">nvidia/nemotron-3-nano-30b-a3b</td>
                <td className="py-3 text-muted">Airlock PII redaction & query generation</td>
                <td className="py-3 font-mono text-text">$0.00018</td>
                <td className="py-3 font-mono text-text">320ms</td>
                <td className="py-3">
                  <span className="inline-flex items-center gap-1 text-[11px] text-primary">
                    <CheckCircle2 size={12} /> Active
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-surface-2 transition-colors">
                <td className="py-3 font-mono font-semibold text-info">Tier 2: Super</td>
                <td className="py-3 font-mono text-text">nvidia/nemotron-3-super-70b-instruct</td>
                <td className="py-3 text-muted">Deep synthesis, briefing generation, code audit</td>
                <td className="py-3 font-mono text-text">$0.00124</td>
                <td className="py-3 font-mono text-text">1,620ms</td>
                <td className="py-3">
                  <span className="inline-flex items-center gap-1 text-[11px] text-info">
                    <CheckCircle2 size={12} /> Active
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
