'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  HealthStatus,
  FinOpsTelemetry,
  AgentRunResponse,
  SecurityStateResponse,
  MemoryStateResponse,
  AttackSimulationResponse,
  OvernightScoutResponse,
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

interface AppState {
  // Data
  health: HealthStatus | null;
  telemetry: FinOpsTelemetry | null;
  agentResult: AgentRunResponse | null;
  securityState: SecurityStateResponse | null;
  memoryState: MemoryStateResponse | null;

  // Status
  loadingRun: boolean;
  initialized: boolean;
  isFallback: boolean;

  // Actions
  handleRunAgent: (instruction: string, workspaceId: string, presetName?: string, workspaceContext?: string) => Promise<void>;
  handleSimulateAttack: () => Promise<AttackSimulationResponse>;
  handleSaveMemory: (newMarkdown: string) => Promise<void>;
  handleCompileSkill: (feedbackText: string) => Promise<void>;
  handleTriggerScout: () => Promise<OvernightScoutResponse>;
  refreshSecurity: () => Promise<void>;
  refreshMemory: () => Promise<void>;
}

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [telemetry, setTelemetry] = useState<FinOpsTelemetry | null>(null);
  const [agentResult, setAgentResult] = useState<AgentRunResponse | null>(null);
  const [loadingRun, setLoadingRun] = useState(false);
  const [securityState, setSecurityState] = useState<SecurityStateResponse | null>(null);
  const [memoryState, setMemoryState] = useState<MemoryStateResponse | null>(null);
  const [initialized, setInitialized] = useState(false);

  const isFallback = health?.is_fallback ?? true;

  // Initial data load (once, shared across all pages)
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

      setInitialized(true);
    }
    init();
  }, []);

  const handleRunAgent = useCallback(async (instruction: string, workspaceId: string, presetName?: string, workspaceContext?: string) => {
    setLoadingRun(true);
    try {
      const res = await runAgent({
        instruction,
        workspace_id: workspaceId,
        preset_name: presetName,
        workspace_context: workspaceContext,
      });
      setAgentResult(res);
      setTelemetry(res.finops);
      // Refresh security audit log after run
      const sec = await fetchSecurityState();
      setSecurityState(sec);
    } catch (e) {
      console.error('Agent execution error:', e);
    } finally {
      setLoadingRun(false);
    }
  }, []);

  const handleSimulateAttack = useCallback(async (): Promise<AttackSimulationResponse> => {
    const res = await simulateAttack();
    const sec = await fetchSecurityState();
    setSecurityState(sec);
    return res;
  }, []);

  const handleSaveMemory = useCallback(async (newMarkdown: string) => {
    await updateMemory(newMarkdown);
    const mem = await fetchMemoryState();
    setMemoryState(mem);
  }, []);

  const handleCompileSkill = useCallback(async (feedbackText: string) => {
    await compileSkill({ user_feedback: feedbackText });
    const mem = await fetchMemoryState();
    setMemoryState(mem);
  }, []);

  const handleTriggerScout = useCallback(async (): Promise<OvernightScoutResponse> => {
    return await triggerOvernightScout();
  }, []);

  const refreshSecurity = useCallback(async () => {
    try {
      const sec = await fetchSecurityState();
      setSecurityState(sec);
    } catch (e) {
      console.warn('Security refresh failed:', e);
    }
  }, []);

  const refreshMemory = useCallback(async () => {
    try {
      const mem = await fetchMemoryState();
      setMemoryState(mem);
    } catch (e) {
      console.warn('Memory refresh failed:', e);
    }
  }, []);

  return (
    <AppStateContext.Provider
      value={{
        health,
        telemetry,
        agentResult,
        securityState,
        memoryState,
        loadingRun,
        initialized,
        isFallback,
        handleRunAgent,
        handleSimulateAttack,
        handleSaveMemory,
        handleCompileSkill,
        handleTriggerScout,
        refreshSecurity,
        refreshMemory,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState(): AppState {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used inside AppStateProvider');
  return ctx;
}
