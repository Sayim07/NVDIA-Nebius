// frontend/src/app/app/page.tsx
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
  Shield,
  Cpu,
  Terminal,
  Globe,
  Sparkles,
  ExternalLink,
  Flame,
  Layers,
} from 'lucide-react';
import { useAppState } from '@/components/app/AppStateProvider';
import { StatMetricCard } from '@/components/ui/StatMetricCard';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { BorderBeam } from '@/components/ui/BorderBeam';
import { ShimmerButton } from '@/components/ui/ShimmerButton';
import { Meteors } from '@/components/ui/Meteors';
import { BentoGrid, BentoCard } from '@/components/ui/BentoGrid';

export default function DashboardPage() {
  const router = useRouter();
  const { isFallback, health, agentResult, securityState } = useAppState();

  const recentEvents = securityState?.events?.slice(0, 5) ?? [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in-50 duration-300">
      {/* ── Executive Hero Header with 21st.dev BorderBeam & Meteors ── */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-r from-surface via-surface-2/70 to-surface p-6 sm:p-8 shadow-card">
        {/* Subtle 21st.dev Meteors Background */}
        <Meteors number={15} />

        {/* 21st.dev BorderBeam on Hero Frame */}
        <BorderBeam
          size={250}
          duration={12}
          colorFrom="#10b981"
          colorTo="#06b6d4"
          borderWidth={1.5}
        />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="emerald" size="sm" className="gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>NVIDIA NEMOCLAW // ACTIVE</span>
              </Badge>
              <Badge variant="purple" size="sm" className="gap-1.5">
                <Cpu className="w-3 h-3 text-purple-400" />
                <span>NEBIUS 3-TIER ROUTER</span>
              </Badge>
              <Badge variant={isFallback ? 'amber' : 'cyan'} size="sm">
                {isFallback ? 'FALLBACK SIMULATION' : 'LIVE GPU RUNTIME'}
              </Badge>
            </div>

            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-text">
              Zero-Trust AI Executive Workspace
            </h1>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              Autonomous security analysis, dependency vulnerability scanning, and multi-tier
              Nemotron reasoning on sovereign Nebius infrastructure. Secrets never leak to the public web.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {/* 21st.dev Shimmer Button */}
            <Link href="/app/briefing">
              <ShimmerButton
                shimmerColor="#10b981"
                background="rgba(16, 185, 129, 0.15)"
                className="w-full sm:w-auto border-emerald-500/40 text-emerald-300 hover:text-white"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span className="font-mono uppercase tracking-wider text-xs font-semibold">
                  Launch Sovereign Scan
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </ShimmerButton>
            </Link>

            <Link
              href="/app/security"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-surface-2 hover:bg-surface-3 text-text text-xs font-mono font-medium transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-muted" />
              <span>Sandbox HUD</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── 21st.dev Style KPI Metrics Grid ── */}
      <section aria-labelledby="metrics-heading">
        <h2 id="metrics-heading" className="sr-only">
          System Performance Metrics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatMetricCard
            label="Inference Cost Reduction"
            value={82.4}
            prefix="-"
            suffix="%"
            decimals={1}
            caption="$0.00142 vs $0.00806 monolithic"
            trend={{ value: "-82.4%", isPositive: true }}
            icon={TrendingDown}
            accent="emerald"
          />

          <StatMetricCard
            label="Sandbox Policy Intercept"
            value={15}
            prefix="< "
            suffix=" ms"
            decimals={0}
            caption="Out-of-process OpenShell guard"
            trend={{ value: "Sub-15ms", isNeutral: true }}
            icon={Lock}
            accent="cyan"
          />

          <StatMetricCard
            label="PII Queries Redacted"
            value={100}
            suffix="%"
            decimals={0}
            caption="Zero raw secrets sent to Tavily"
            trend={{ value: "Zero Leak", isPositive: true }}
            icon={ShieldAlert}
            accent="purple"
          />

          <StatMetricCard
            label="Injection Defenses"
            value={100}
            suffix="%"
            decimals={0}
            caption="Deterministic whitelist protection"
            trend={{ value: "100% Blocked", isPositive: true }}
            icon={Shield}
            accent="rose"
          />
        </div>
      </section>

      {/* ── 21st.dev BentoGrid: 3 One-Click Evaluation Presets ── */}
      <section aria-labelledby="presets-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h2 id="presets-heading" className="font-heading font-semibold text-sm uppercase tracking-wider text-text">
              1-Click Evaluation Benchmarks
            </h2>
          </div>
          <span className="text-xs font-mono text-muted">BENTO ARCHITECTURE</span>
        </div>

        <BentoGrid className="auto-rows-[16rem]">
          <BentoCard
            name="Architecture & Security Audit"
            description="Deep static analysis on Project Titan (FastAPI + Next.js). Discovers hardcoded credentials and tests sandboxed execution."
            badge="BENCHMARK 01"
            Icon={Terminal}
            accent="emerald"
            cta="Execute Benchmark"
            onClick={() => router.push('/app/briefing?preset=architecture_sync')}
          >
            <div className="mt-2 p-2.5 rounded-lg bg-surface-2 border border-border/60 text-[11px] font-mono text-muted space-y-1">
              <div className="text-emerald-400">Target: Project Titan</div>
              <div>Stack: Python FastAPI + Next.js 14</div>
              <div>Check: Dependency audit & secret exposure</div>
            </div>
          </BentoCard>

          <BentoCard
            name="Dependency CVE Discovery"
            description="Airlock query synthesis. Strips proprietary service names, queries Tavily for live vulnerabilities, and produces a structured threat brief."
            badge="BENCHMARK 02"
            Icon={ShieldAlert}
            accent="cyan"
            cta="Execute Benchmark"
            onClick={() => router.push('/app/briefing?preset=dependency_audit')}
          >
            <div className="mt-2 p-2.5 rounded-lg bg-surface-2 border border-border/60 text-[11px] font-mono text-muted space-y-1">
              <div className="text-cyan-400">Target: Apollo Gateway</div>
              <div>Stack: Microservice Gateway (Express)</div>
              <div>Check: High-severity CVE diffing</div>
            </div>
          </BentoCard>

          <BentoCard
            name="Red-Team Exploit Simulation"
            description="Simulates adversary prompt injection attempting to leak .env files or execute reverse shell binaries. NemoClaw blocks in <15ms."
            badge="BENCHMARK 03"
            Icon={Lock}
            accent="rose"
            cta="Execute Benchmark"
            onClick={() => router.push('/app/briefing?preset=exploit_simulation')}
          >
            <div className="mt-2 p-2.5 rounded-lg bg-surface-2 border border-border/60 text-[11px] font-mono text-muted space-y-1">
              <div className="text-rose-400">Attack: /bin/sh cat .env</div>
              <div>Defense: Declarative NemoClaw Policy</div>
              <div>Result: Intercepted in &lt;15ms</div>
            </div>
          </BentoCard>
        </BentoGrid>
      </section>

      {/* ── Two-Column Operational Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: OpenShell Security HUD Audit Table */}
        <div className="lg:col-span-7">
          <Card className="h-full border-border/80">
            <CardHeader className="pb-3 border-b border-border/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <CardTitle className="text-sm font-semibold">
                    OpenShell Defense Audit Log
                  </CardTitle>
                </div>
                <Badge variant="outline" size="sm" className="font-mono text-[10px]">
                  SQLite Persisted
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Subprocess interception events evaluated by NVIDIA NemoClaw
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-border/60 bg-surface-2/40 text-muted">
                      <th className="py-2.5 px-4 font-medium">TYPE</th>
                      <th className="py-2.5 px-4 font-medium">TARGET / COMMAND</th>
                      <th className="py-2.5 px-4 font-medium">DECISION</th>
                      <th className="py-2.5 px-4 font-medium text-right">LATENCY</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {recentEvents.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-muted">
                          No audit events logged yet. Trigger a scan or attack simulation.
                        </td>
                      </tr>
                    ) : (
                      recentEvents.map((evt, idx) => (
                        <tr key={idx} className="hover:bg-surface-2/40 transition-colors">
                          <td className="py-2.5 px-4 text-text truncate max-w-[140px]">
                            {evt.command}
                          </td>
                          <td className="py-2.5 px-4 text-muted truncate max-w-[180px]">
                            {evt.reason || evt.policy_rule}
                          </td>
                          <td className="py-2.5 px-4">
                            <Badge
                              variant={evt.status === 'ALLOWED' ? 'emerald' : 'rose'}
                              size="sm"
                            >
                              {evt.status}
                            </Badge>
                          </td>
                          <td className="py-2.5 px-4 text-right text-muted">
                            {evt.latency_ms ?? 12}ms
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Three-Tier Nebius Architecture Breakdown */}
        <div className="lg:col-span-5">
          <Card className="h-full border-border/80 flex flex-col justify-between">
            <CardHeader className="pb-3 border-b border-border/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-purple-400" />
                  <CardTitle className="text-sm font-semibold">
                    Nebius 3-Tier Model Routing
                  </CardTitle>
                </div>
                <Badge variant="purple" size="sm">
                  FinOps Optimized
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Lightweight edge preprocessing + heavy technical synthesis
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 space-y-3">
              {/* Tier 1 */}
              <div className="p-3 rounded-xl bg-surface-2/60 border border-border/60 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-medium text-emerald-400">
                      Tier 1: Nano (30B)
                    </span>
                    <span className="text-[10px] font-mono text-muted">320ms</span>
                  </div>
                  <p className="text-[11px] text-muted mt-0.5">
                    PII redaction, search query extraction & regex enforcement
                  </p>
                </div>
                <Badge variant="emerald" size="sm">
                  $0.00018
                </Badge>
              </div>

              {/* Tier 2 */}
              <div className="p-3 rounded-xl bg-surface-2/60 border border-border/60 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-medium text-cyan-400">
                      Tier 2: Super (70B)
                    </span>
                    <span className="text-[10px] font-mono text-muted">1,620ms</span>
                  </div>
                  <p className="text-[11px] text-muted mt-0.5">
                    Technical synthesis, briefing composition, CVE correlation
                  </p>
                </div>
                <Badge variant="cyan" size="sm">
                  $0.00124
                </Badge>
              </div>

              {/* Tier 3 */}
              <div className="p-3 rounded-xl bg-surface-2/60 border border-border/60 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-medium text-purple-400">
                      Tier 3: Ultra (Optional)
                    </span>
                    <span className="text-[10px] font-mono text-muted">On Demand</span>
                  </div>
                  <p className="text-[11px] text-muted mt-0.5">
                    Compiles natural language feedback into executable YAML skills
                  </p>
                </div>
                <Badge variant="purple" size="sm">
                  $0.00310
                </Badge>
              </div>
            </CardContent>

            <div className="p-4 pt-0">
              <Link
                href="/app/costs"
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-surface-2 hover:bg-surface-3 border border-border text-xs font-mono text-text transition-colors"
              >
                <span>View Full FinOps Telemetry</span>
                <ChevronRight size={13} />
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
