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
import { WorkspacePanel } from '@/components/WorkspacePanel';
import { TavilyAirlock } from '@/components/TavilyAirlock';
import { NemoClawHUD } from '@/components/NemoClawHUD';
import { SkillStudio } from '@/components/SkillStudio';
import { CommandPalette } from '@/components/ui/CommandPalette';

const TABS = [
  { id: 'workspace', label: 'Executive Workspace', icon: Terminal },
  { id: 'airlock', label: 'Tavily Privacy Airlock', icon: ShieldAlert },
  { id: 'security', label: 'NemoClaw Security HUD', icon: Cpu },
  { id: 'skills', label: 'Hermes Skill Studio', icon: Brain },
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
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header
        telemetry={telemetry}
        health={health}
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

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {/* 4-Panel Navigation Tabs */}
        <div className="flex items-center space-x-1 sm:space-x-2 border-b border-slate-800 pb-3 mb-6 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-3 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-colors whitespace-nowrap ${
                  isActive ? 'text-slate-100' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute inset-0 bg-slate-800/80 border border-slate-700/60 rounded-lg -z-10 shadow-sm"
                    transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Views */}
        <div>
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

      {/* Global Footer */}
      <footer className="border-t border-slate-900 py-4 px-4 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>HermesShield v1.0.0 — Sovereign Personal AI Control Center</span>
          <span className="text-slate-600">Built for Nebius x NVIDIA Hackathon 2026</span>
        </div>
      </footer>
    </div>
  );
}
