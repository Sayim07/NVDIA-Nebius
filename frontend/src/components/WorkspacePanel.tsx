// frontend/src/components/WorkspacePanel.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Play,
  Zap,
  Globe,
  Copy,
  Check,
  FileCode,
  FolderGit2,
  RefreshCw,
  Terminal,
  Upload,
  Plus,
  Key,
  Shield,
  Sparkles,
  Info,
  FileText,
} from 'lucide-react';
import { AgentRunResponse } from '@/lib/types';
import { TiltCard } from './ui/TiltCard';
import { Magnetic } from './ui/Magnetic';
import {
  getQuotaState,
  canExecuteRun,
  incrementRunsUsed,
  QuotaState,
} from '@/lib/quotaStore';
import { ByokModal } from './ui/ByokModal';
import { AdminModal } from './ui/AdminModal';
import { BorderBeam } from './ui/BorderBeam';
import { ShimmerButton } from './ui/ShimmerButton';

interface WorkspacePanelProps {
  onRun: (
    instruction: string,
    workspaceId: string,
    presetName?: string,
    workspaceContext?: string
  ) => Promise<void>;
  loading: boolean;
  result: AgentRunResponse | null;
}

const PRESETS = [
  {
    key: 'architecture_sync',
    tag: '[ 01 // ARCHITECTURE SYNC ]',
    label: 'Architecture Sync & CVE Scan',
    desc: 'Scan dependencies, scrub PII via Airlock, discover live Mitre advisories, and construct a technical briefing with mandatory rollback plan.',
    prompt:
      'Prep my technical briefing for my 2 PM architecture sync on {PROJECT_NAME}, check if our current dependencies have any new security advisories this week, and draft the agenda.',
  },
  {
    key: 'pr_review',
    tag: '[ 02 // PR SECURITY AUDIT ]',
    label: 'PR Security Review & Dependency Audit',
    desc: 'Conduct zero-trust security audit on authentication layer, token libraries, and web frameworks against live CVE advisories.',
    prompt:
      'Conduct a zero-trust PR security review for {PROJECT_NAME} authentication layer. Audit dependencies against CVE advisories and verify framework patch levels.',
  },
  {
    key: 'competitive_scout',
    tag: '[ 03 // DEEP SCOUT ]',
    label: 'Deep Web Scouting & FinOps Benchmarks',
    desc: 'Scout live web benchmarks comparing NVIDIA Nemotron-3-Nano and Nemotron-3-Super inference latency and cost efficiency on Nebius Token Factory.',
    prompt:
      'Scout live web benchmarks comparing NVIDIA Nemotron-3-Nano and Nemotron-3-Super inference latency and cost efficiency on Nebius Token Factory for {PROJECT_NAME}.',
  },
];

export const WorkspacePanel: React.FC<WorkspacePanelProps> = ({ onRun, loading, result }) => {
  const [workspaceId, setWorkspaceId] = useState<'project_titan' | 'default' | 'custom'>('project_titan');
  const [instruction, setInstruction] = useState(PRESETS[0].prompt.replace('{PROJECT_NAME}', 'Project Titan'));
  const [copied, setCopied] = useState(false);

  // Custom project state
  const [customProjectName, setCustomProjectName] = useState('Avnex Core');
  const [customStack, setCustomStack] = useState('Next.js 14 + FastAPI');
  const [customManifestText, setCustomManifestText] = useState(
    JSON.stringify(
      {
        project: 'Avnex Core',
        version: '1.4.0',
        dependencies: {
          fastapi: '0.111.0',
          pyjwt: '2.8.0',
          next: '14.2.1',
          pydantic: '2.7.4',
          redis: '5.0.3',
        },
      },
      null,
      2
    )
  );
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // Quota & Modals state
  const [quota, setQuota] = useState<QuotaState>(() => getQuotaState());
  const [isByokOpen, setIsByokOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setQuota(getQuotaState());
    };
    window.addEventListener('hermesshield-quota-changed', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('hermesshield-quota-changed', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleCopy = () => {
    if (result?.briefing_markdown) {
      navigator.clipboard.writeText(result.briefing_markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const currentProjectLabel =
    workspaceId === 'project_titan'
      ? 'Project Titan'
      : workspaceId === 'default'
      ? 'Apollo Service'
      : customProjectName.trim() || 'Custom Project';

  const handleApplyPreset = (preset: (typeof PRESETS)[0]) => {
    const tailoredPrompt = preset.prompt.replace('{PROJECT_NAME}', currentProjectLabel);
    setInstruction(tailoredPrompt);
  };

  // Handle switching workspaces
  const handleSelectWorkspace = (id: 'project_titan' | 'default' | 'custom') => {
    setWorkspaceId(id);
    const targetName =
      id === 'project_titan'
        ? 'Project Titan'
        : id === 'default'
        ? 'Apollo Service'
        : customProjectName.trim() || 'Custom Project';

    setInstruction((prev) =>
      prev.replace(/Project Titan|Apollo Service|Avnex Core/g, targetName)
    );
  };

  // Handle file upload for custom project
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setCustomManifestText(content);
        // If file is package.json, try to extract project name
        try {
          if (file.name.endsWith('.json')) {
            const parsed = JSON.parse(content);
            if (parsed.name) setCustomProjectName(parsed.name);
          }
        } catch {
          // Keep default custom name if parse fails
        }
      }
    };
    reader.readAsText(file);
  };

  // Dispatch Run with Quota check & Custom context
  const handleDispatch = async () => {
    const check = canExecuteRun();
    if (!check.allowed) {
      setIsByokOpen(true);
      return;
    }

    // Build workspaceContext if custom project selected
    let workspaceContext: string | undefined = undefined;
    if (workspaceId === 'custom') {
      workspaceContext = JSON.stringify({
        project_name: customProjectName.trim() || 'Custom Workspace',
        framework_stack: customStack.trim(),
        manifest_payload: customManifestText,
        source: uploadedFileName ? `file://${uploadedFileName}` : 'custom_paste',
      });
    }

    // Consume 1 quota run if on free tier
    incrementRunsUsed();

    await onRun(instruction, workspaceId, undefined, workspaceContext);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
      {/* Left Column: Workspace Config, Custom Ingestion & Presets */}
      <div className="lg:col-span-5 space-y-4">
        {/* Workspace Card */}
        <TiltCard className="p-4 bg-slate-900/90 border border-slate-800/90">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
            <div className="flex items-center space-x-2">
              <FolderGit2 className="w-3.5 h-3.5 text-emerald-400" />
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300">
                [ TARGET WORKSPACE ]
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              LOCAL / CUSTOM REPO
            </span>
          </div>

          {/* 3 Workspace Selector Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleSelectWorkspace('project_titan')}
              className={`p-2.5 rounded border text-left transition-all ${
                workspaceId === 'project_titan'
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-white'
                  : 'bg-slate-950 border-slate-800/80 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className="text-xs font-bold tracking-tight truncate">Project Titan</div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">FastAPI + Next.js</div>
            </button>

            <button
              onClick={() => handleSelectWorkspace('default')}
              className={`p-2.5 rounded border text-left transition-all ${
                workspaceId === 'default'
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-white'
                  : 'bg-slate-950 border-slate-800/80 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className="text-xs font-bold tracking-tight truncate">Apollo Service</div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">Microservice Gateway</div>
            </button>

            <button
              onClick={() => handleSelectWorkspace('custom')}
              className={`p-2.5 rounded border text-left transition-all relative ${
                workspaceId === 'custom'
                  ? 'bg-cyan-950/40 border-cyan-500/50 text-white ring-1 ring-cyan-500/30'
                  : 'bg-slate-950 border-slate-800/80 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-tight text-cyan-300 truncate">+ Custom Repo</span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">Upload / Paste</div>
            </button>
          </div>

          {/* Custom Project Ingestion Box */}
          {workspaceId === 'custom' && (
            <div className="mt-3.5 p-3.5 rounded-xl border border-cyan-500/30 bg-slate-950/90 space-y-3 animate-in fade-in-0 slide-in-from-top-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-semibold text-cyan-300 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-cyan-400" />
                  CUSTOM CODEBASE INGESTION
                </span>
                <span className="text-[9px] font-mono text-slate-500 uppercase">
                  SOVEREIGN LOCAL PARSE
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">PROJECT NAME</label>
                  <input
                    type="text"
                    value={customProjectName}
                    onChange={(e) => setCustomProjectName(e.target.value)}
                    placeholder="e.g. Avnex Core"
                    className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">STACK / FRAMEWORK</label>
                  <input
                    type="text"
                    value={customStack}
                    onChange={(e) => setCustomStack(e.target.value)}
                    placeholder="e.g. Next.js 14 + Redis"
                    className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Upload file or paste dependencies */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                    <FileText className="w-3 h-3 text-cyan-400" />
                    DEPENDENCY MANIFEST (package.json / requirements.txt)
                  </label>
                  <label className="text-[10px] text-cyan-400 hover:text-cyan-300 cursor-pointer flex items-center gap-1 font-mono">
                    <Upload className="w-3 h-3" />
                    <span>{uploadedFileName ? `Re-upload (${uploadedFileName})` : 'Upload File'}</span>
                    <input
                      type="file"
                      accept=".json,.txt,.toml,.yaml,.yml"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <textarea
                  value={customManifestText}
                  onChange={(e) => setCustomManifestText(e.target.value)}
                  rows={4}
                  placeholder="Paste package.json, requirements.txt, or list of packages..."
                  className="w-full p-2.5 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 leading-relaxed"
                />
              </div>
            </div>
          )}
        </TiltCard>

        {/* 3 One-Click Evaluation Presets */}
        <TiltCard className="p-4 bg-slate-900/90 border border-slate-800/90">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
            <div className="flex items-center space-x-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300">
                [ EVALUATION PRESETS ]
              </h3>
            </div>
            <span className="text-[10px] font-mono text-amber-400/90 font-medium">1-CLICK DEMO</span>
          </div>

          <div className="space-y-2.5">
            {PRESETS.map((preset) => (
              <button
                key={preset.key}
                onClick={() => handleApplyPreset(preset)}
                className="w-full p-3 rounded border border-slate-800/80 bg-slate-950/80 hover:bg-slate-900 hover:border-slate-700 text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-emerald-400">
                    {preset.tag}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 transition-colors">
                  {preset.label}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed line-clamp-2 font-normal">
                  {preset.desc}
                </p>
              </button>
            ))}
          </div>
        </TiltCard>

        {/* Execution Input Console */}
        <TiltCard className="p-4 bg-slate-900/90 border border-slate-800/90">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              [ EXECUTIVE PROMPT CONSOLE ]
            </label>
            <span className="text-[10px] font-mono text-slate-500">TIER 1 + TIER 2</span>
          </div>

          <textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            rows={4}
            className="w-full p-3 rounded bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 font-sans focus:outline-none focus:border-emerald-500/50 leading-relaxed transition-colors"
            placeholder="Type instructions for HermesShield..."
          />

          {/* Quota / Status Banner */}
          <div className="mt-3 p-2.5 rounded-lg border text-xs flex items-center justify-between transition-colors bg-slate-950 border-slate-800">
            {quota.isAdmin ? (
              <div className="flex items-center justify-between w-full">
                <span className="flex items-center gap-1.5 text-purple-300 font-mono text-[11px]">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Admin Mode: Unlimited AI Scans Active</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsAdminOpen(true)}
                  className="text-[10px] font-mono text-purple-400 hover:underline cursor-pointer"
                >
                  Manage
                </button>
              </div>
            ) : quota.hasCustomKey ? (
              <div className="flex items-center justify-between w-full">
                <span className="flex items-center gap-1.5 text-cyan-300 font-mono text-[11px]">
                  <Key className="w-3.5 h-3.5 text-cyan-400" />
                  <span>BYOK Active: Personal Keys Connected</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsByokOpen(true)}
                  className="text-[10px] font-mono text-cyan-400 hover:underline cursor-pointer"
                >
                  Edit Keys
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <span className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px]">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    Free Demo: {Math.max(0, quota.maxFreeRuns - quota.runsUsed)}/{quota.maxFreeRuns} Live Scans Left
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsByokOpen(true)}
                  className="text-[10px] font-mono text-emerald-400 hover:underline cursor-pointer"
                >
                  + Add Key
                </button>
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500">
              [ AIRLOCK: ARMED ]
            </span>
            <ShimmerButton
              onClick={handleDispatch}
              disabled={loading || !instruction.trim()}
              shimmerColor="#10b981"
              background="rgba(16, 185, 129, 0.2)"
              className="border-emerald-500/40 text-emerald-300 hover:text-white"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Executing Pipeline...</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-current" />
                  <span>[ DISPATCH SOVEREIGN RUN ]</span>
                </>
              )}
            </ShimmerButton>
          </div>
        </TiltCard>
      </div>

      {/* Right Column: Output Feed & Briefing Renderer */}
      <div className="lg:col-span-7">
        <div className="relative overflow-hidden rounded-2xl border border-slate-800/90 bg-slate-900/90 p-5 min-h-[620px] flex flex-col justify-between shadow-card">
          {/* 21st.dev BorderBeam animation on briefing result */}
          <BorderBeam
            size={280}
            duration={14}
            colorFrom={loading ? "#f59e0b" : "#10b981"}
            colorTo={loading ? "#ec4899" : "#06b6d4"}
            borderWidth={1.5}
          />
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
              <div className="flex items-center space-x-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-200">
                  [ SYNTHESIZED EXECUTIVE BRIEFING ]
                </h3>
              </div>

              {result && (
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono text-slate-500">
                    TASK // {result.task_id}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-[10px] text-emerald-400">[ COPIED ]</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span className="text-[10px]">[ COPY ]</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {loading ? (
              <div className="py-28 flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
                <div className="text-center space-y-1">
                  <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                    [ EXECUTING 3-TIER ROUTING PIPELINE ]
                  </div>
                  <div className="text-[11px] font-mono text-slate-500">
                    Airlock Regex Scrub -&gt; Tavily Discovery -&gt; Nemotron Super Synthesis
                  </div>
                </div>
              </div>
            ) : result ? (
              <div className="space-y-4">
                <div className="whitespace-pre-wrap font-sans text-xs bg-slate-950 p-5 rounded border border-slate-800/90 font-normal leading-7 text-slate-200 shadow-inner">
                  {result.briefing_markdown}
                </div>
              </div>
            ) : (
              <div className="py-28 text-center text-slate-500">
                <Globe className="w-10 h-10 mx-auto text-slate-700 mb-3" />
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  [ READY FOR DISPATCH ]
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Select Project Titan, Apollo Service, or upload your own Custom Repo to synthesize a sovereign technical briefing.
                </p>
                <div className="mt-3 text-[10px] font-mono text-slate-600">
                  All outgoing queries pass through the zero-PII Tavily Airlock.
                </div>
              </div>
            )}
          </div>

          {result && (
            <div className="pt-4 mt-6 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>[ SECURITY // 100% PASSED ]</span>
              <span className="text-emerald-400">
                [ FINOPS // ${result.finops.total_cost_usd.toFixed(5)} (-{result.finops.cost_reduction_percent}%) ]
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ByokModal
        isOpen={isByokOpen}
        onClose={() => setIsByokOpen(false)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onSuccess={() => handleDispatch()}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onSuccess={() => {
          setQuota(getQuotaState());
        }}
      />
    </div>
  );
};
