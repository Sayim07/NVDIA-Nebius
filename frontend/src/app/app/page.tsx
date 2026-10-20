'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal,
  ShieldAlert,
  Cpu,
  Brain,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import {
  HealthStatus,
  FinOpsTelemetry,
  AgentRunResponse,
  SecurityStateResponse,
  MemoryStateResponse,
} from '@/lib/types';
import {
  fetchHealth,
  runAgent,
  fetchSecurityState,
  simulateAttack,
  fetchMemoryState,
  updateMemory,
  compileSkill,
  triggerOvernightScout,
} from '@/lib/api';
import { Navbar } from '@/components/sections/Navbar';
import { Hero } from '@/components/sections/Hero';
import { MetricsRibbon } from '@/components/MetricsRibbon';
import { ArchitectureShowcase } from '@/components/ArchitectureShowcase';
import { AirlockSection } from '@/components/AirlockSection';
import { FinOpsHUD } from '@/components/FinOpsHUD';
import { WorkspacePanel } from '@/components/WorkspacePanel';
import { TavilyAirlock } from '@/components/TavilyAirlock';
import { NemoClawHUD } from '@/components/NemoClawHUD';
import { SkillStudio } from '@/components/SkillStudio';
import { CommandPalette } from '@/components/ui/CommandPalette';

const CONSOLE_TABS = [
  { id: 'workspace', label: '01 // WORKSPACE RUNNER', sub: 'Executive Briefings & Presets', icon: Terminal },
  { id: 'airlock', label: '02 // TAVILY AIRLOCK', sub: 'Zero-PII Search Diff', icon: ShieldAlert },
  { id: 'security', label: '03 // NEMOCLAW GUARD', sub: 'Out-of-Process Ledger', icon: Cpu },
  { id: 'skills', label: '04 // HERMES SKILLS', sub: 'Episodic Memory & YAML', icon: Brain },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('workspace');
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [telemetry, setTelemetry] = useState<FinOpsTelemetry | null>(null);
  const [agentResult, setAgentResult] = useState<AgentRunResponse | null>(null);
  const [loadingRun, setLoadingRun] = useState(false);
  const [securityState, setSecurityState] = useState<SecurityStateResponse | null>(null);
  const [memoryState, setMemoryState] = useState<MemoryStateResponse | null>(null);
  const consoleRef = useRef<HTMLDivElement>(null);

  const isFallback = health?.is_fallback ?? true;

  // Initial handshake and state loading
  useEffect(() => {
    async function init() {
      try {
        const h = await fetchHealth();
        setHealth(h);
      } catch (e) {
        console.warn('Backend offline or health unreachable:', e);
      }

      try {
        const sec = await fetchSecurityState();
        setSecurityState(sec);
      } catch (e) {
        console.warn('Security state unreachable:', e);
      }

      try {
        const mem = await fetchMemoryState();
        setMemoryState(mem);
      } catch (e) {
        console.warn('Memory state unreachable:', e);
      }
    }
    init();
  }, []);

  const scrollToConsole = () => {
    const el = document.getElementById('console');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRunAgent = async (instruction: string, workspaceId: string, presetName?: string) => {
    setLoadingRun(true);
    try {
      const res = await runAgent({ instruction, workspace_id: workspaceId, preset_name: presetName });
      setAgentResult(res);
      setTelemetry(res.finops);
      // Refresh security audit log
      const sec = await fetchSecurityState();
      setSecurityState(sec);
    } catch (e) {
      console.error('Agent execution error:', e);
    } finally {
      setLoadingRun(false);
    }
  };

  const handleSimulateAttack = async () => {
    setActiveTab('security');
    scrollToConsole();
    const res = await simulateAttack();
    const sec = await fetchSecurityState();
    setSecurityState(sec);
    return res;
  };

  const handleSaveMemory = async (newMarkdown: string) => {
    await updateMemory(newMarkdown);
    const mem = await fetchMemoryState();
    setMemoryState(mem);
  };

  const handleCompileSkill = async (feedbackText: string) => {
    await compileSkill({ user_feedback: feedbackText });
    const mem = await fetchMemoryState();
    setMemoryState(mem);
  };

  const handleTriggerScout = async () => {
    return await triggerOvernightScout();
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg text-ink font-sans selection:bg-primary/10 selection:text-primary">
      {/* Section 1: Modern Responsive Navbar */}
      <Navbar

        onOpenCommand={() => {
          const down = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
          document.dispatchEvent(down);
        }}
        onScrollToConsole={scrollToConsole}
      />

      {/* Global Cmd+K Command Palette */}
      <CommandPalette
        onSelectTab={(tab) => {
          setActiveTab(tab);
          scrollToConsole();
        }}
        onRunPreset={(presetKey) => {
          setActiveTab('workspace');
          scrollToConsole();
          if (presetKey === 'architecture_sync') {
            handleRunAgent(
              'Prep my technical briefing for my 2 PM architecture sync on Project Titan, check FastAPI & Next.js CVEs.',
              'project_titan',
              presetKey
            );
          }
        }}
        onSimulateAttack={async () => {
          await handleSimulateAttack();
        }}
        onTriggerScout={async () => {
          setActiveTab('skills');
          scrollToConsole();
          await handleTriggerScout();
        }}
      />

      {/* Section 2: High-Impact Hero with Italic Accent & Trust Row */}
      <Hero
        onScrollToConsole={scrollToConsole}
        onSimulateAttack={handleSimulateAttack}
      />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 py-6 space-y-16">
        {/* Section 2: Key Proof Metrics */}
        <MetricsRibbon />

        {/* Section 3: Architecture Bento Grid */}
        <ArchitectureShowcase
          onSelectConsoleTab={(tabId) => {
            setActiveTab(tabId);
            scrollToConsole();
          }}
        />

        {/* Section 4: Tavily Airlock Deep Dive */}
        <AirlockSection
          onOpenAirlock={() => {
            setActiveTab('airlock');
            scrollToConsole();
          }}
        />

        {/* Section 5: The Live Interactive Console */}
        <section id="console" ref={consoleRef} className="pt-8 pb-16 border-t border-white/[0.08]">
          {/* Console Header Bar */}
          <div className="p-5 rounded-t-2xl bg-surface-1 border border-white/[0.08] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2.5">
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-surface-2 border border-white/[0.08] text-[11px] font-mono text-white/70">
                  <span className={`w-1.5 h-1.5 rounded-full ${isFallback ? 'bg-warning animate-pulse' : 'bg-nvidia animate-pulse'}`} />
                  <span>{isFallback ? 'Offline Simulation' : 'Nemotron Live'}</span>
                </span>
                <span className="text-xs text-white/40 font-mono">Interactive Execution Runtime</span>
              </div>
              <h2 className="text-xl font-heading font-bold text-white tracking-tight flex items-center gap-2">
                HermesShield live console <span className="font-editorial italic font-normal text-nvidia text-2xl tracking-normal">runtime</span>
              </h2>
            </div>

            {/* Docked FinOps Telemetry HUD */}
            <div className="shrink-0">
              <FinOpsHUD telemetry={telemetry} health={health} />
            </div>
          </div>

          {/* Unified Console Tab Switcher */}
          <div className="bg-slate-950 border-x border-b border-slate-800 p-2">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {CONSOLE_TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative p-3 rounded text-left transition-all border ${
                      isActive
                        ? 'bg-slate-900 border-slate-700 text-white shadow-sm'
                        : 'bg-slate-950/40 border-slate-900 text-slate-400 hover:text-slate-200 hover:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-2 font-mono text-xs font-bold">
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                      <span className="tracking-wider">{tab.label}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-1 pl-5">
                      {tab.sub}
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="active-console-tab"
                        className="absolute inset-0 border border-emerald-500/40 rounded pointer-events-none"
                        transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Tab Panel Container */}
          <div className="p-6 bg-slate-950/70 border-x border-b border-slate-800 rounded-b-xl min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                {activeTab === 'workspace' && (
                  <WorkspacePanel
                    onRun={handleRunAgent}
                    loading={loadingRun}
                    result={agentResult}
                  />
                )}

                {activeTab === 'airlock' && (
                  <TavilyAirlock airlock={agentResult?.airlock ?? null} />
                )}

                {activeTab === 'security' && (
                  <NemoClawHUD
                    policyYaml={securityState?.policy_yaml ?? ''}
                    events={securityState?.events ?? []}
                    onSimulateAttack={handleSimulateAttack}
                  />
                )}

                {activeTab === 'skills' && (
                  <SkillStudio
                    memoryMarkdown={memoryState?.memory_markdown ?? ''}
                    skills={memoryState?.skills ?? []}
                    onSaveMemory={handleSaveMemory}
                    onCompileSkill={handleCompileSkill}
                    onTriggerScout={handleTriggerScout}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </main>

      {/* Agency-Grade Global Perimeter Footer */}
      <footer className="border-t border-slate-900 py-8 px-4 text-xs font-mono text-slate-500 bg-slate-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-white uppercase">HERMESSHIELD°</span>
            <span>—</span>
            <span className="text-slate-400">Zero-Trust Sovereign Personal AI & Deep Web Scout</span>
          </div>

          <div className="flex items-center space-x-4 text-slate-500">
            <span>[ NVIDIA NEMOCLAW ]</span>
            <span>[ NEBIUS TOKEN FACTORY ]</span>
            <span>[ TAVILY AIRLOCK ]</span>
            <span className="text-emerald-400 font-bold">[ DEVPOST 2026 ]</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
