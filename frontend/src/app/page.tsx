'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Terminal,
  ShieldAlert,
  Cpu,
  Brain,
} from 'lucide-react';
import {
  HealthStatus,
  FinOpsTelemetry,
  AgentRunResponse,
  SecurityStateResponse,
  MemoryStateResponse,
  HermesSkill,
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
import { Header } from '@/components/Header';
import { EditorialHero } from '@/components/EditorialHero';
import { WorkspacePanel } from '@/components/WorkspacePanel';
import { TavilyAirlock } from '@/components/TavilyAirlock';
import { NemoClawHUD } from '@/components/NemoClawHUD';
import { SkillStudio } from '@/components/SkillStudio';
import { CommandPalette } from '@/components/ui/CommandPalette';

const TABS = [
  { id: 'workspace', label: '01 // WORKSPACE', sub: 'Executive Runner', icon: Terminal },
  { id: 'airlock', label: '02 // AIRLOCK', sub: 'Tavily Privacy Filter', icon: ShieldAlert },
  { id: 'security', label: '03 // NEMOCLAW', sub: 'Out-of-Process Guard', icon: Cpu },
  { id: 'skills', label: '04 // SKILLS', sub: 'Episodic Memory & Studio', icon: Brain },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('workspace');
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [telemetry, setTelemetry] = useState<FinOpsTelemetry | null>(null);
  const [agentResult, setAgentResult] = useState<AgentRunResponse | null>(null);
  const [loadingRun, setLoadingRun] = useState(false);
  const [securityState, setSecurityState] = useState<SecurityStateResponse | null>(null);
  const [memoryState, setMemoryState] = useState<MemoryStateResponse | null>(null);
  const [cmdOpen, setCmdOpen] = useState(false);

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
    const res = await simulateAttack();
    // Refresh security state
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
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      <Header
        telemetry={telemetry}
        health={health}
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        onOpenCommand={() => {
          const down = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
          document.dispatchEvent(down);
        }}
      />

      <CommandPalette
        onSelectTab={(tab) => setActiveTab(tab)}
        onRunPreset={(presetKey) => {
          setActiveTab('workspace');
          // Trigger preset
          if (presetKey === 'architecture_sync') {
            handleRunAgent(
              'Prep my technical briefing for my 2 PM architecture sync on Project Titan, check FastAPI & Next.js CVEs.',
              'project_titan',
              presetKey
            );
          }
        }}
        onSimulateAttack={async () => {
          setActiveTab('security');
          await handleSimulateAttack();
        }}
        onTriggerScout={async () => {
          setActiveTab('skills');
          await handleTriggerScout();
        }}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* Editorial Hero Statement inspired by reference typography */}
        <EditorialHero />

        {/* 4-Panel Navigation Rails */}
        <div>
          <div className="flex items-center justify-between pb-2 mb-3">
            <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
              [ NAVIGATION // RUNTIME MODULES ]
            </span>
            <span className="text-[10px] font-mono text-emerald-400">
              [ ACTIVE: {activeTab.toUpperCase()} ]
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 border-b border-slate-900 pb-4">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`p-3 rounded text-left transition-all relative border ${
                    isActive
                      ? 'bg-slate-900/90 border-slate-700 text-white shadow-sm'
                      : 'bg-slate-950/60 border-slate-900 text-slate-400 hover:text-slate-200 hover:border-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-2 font-mono text-xs font-bold">
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span>[ {tab.label} ]</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1 pl-5">
                    {tab.sub}
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-glow"
                      className="absolute inset-0 border border-emerald-500/30 rounded pointer-events-none"
                      transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Views */}
        <div className="pt-2">
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
        </div>
      </main>

      {/* Global Perimeter Footer */}
      <footer className="border-t border-slate-900/90 py-5 px-4 text-xs font-mono text-slate-500 bg-slate-950">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-400">[ HERMESSHIELD° V1.0.0 ]</span>
            <span>—</span>
            <span>[ ZERO-TRUST SOVEREIGN PERSONAL AI ]</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-600">
            <span>[ NEBIUS TOKEN FACTORY ]</span>
            <span>[ NVIDIA NEMOCLAW ]</span>
            <span className="text-emerald-400 font-semibold">[ DEVPOST 2026 ]</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
