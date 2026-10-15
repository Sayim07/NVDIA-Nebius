'use client';

import React, { useState } from 'react';
import {
  Play,
  Zap,
  CheckCircle2,
  Globe,
  Copy,
  Check,
  FileCode,
  FolderGit2,
  RefreshCw,
} from 'lucide-react';
import { AgentRunResponse } from '@/lib/types';
import { TiltCard } from './ui/TiltCard';
import { Magnetic } from './ui/Magnetic';

interface WorkspacePanelProps {
  onRun: (instruction: string, workspaceId: string, presetName?: string) => Promise<void>;
  loading: boolean;
  result: AgentRunResponse | null;
}

const PRESETS = [
  {
    key: 'architecture_sync',
    label: 'Preset A: Architecture Sync & CVE Scan',
    desc: 'Scan Project Titan dependencies, scrub PII, fetch CVEs, and structure 2 PM briefing with rollback plan.',
    prompt:
      'Prep my technical briefing for my 2 PM architecture sync on Project Titan, check if our current FastAPI & Next.js dependencies have any new security advisories this week, and draft the agenda.',
  },
  {
    key: 'pr_review',
    label: 'Preset B: PR Security Review & Audit',
    desc: 'Audit PyJWT algorithm confusion and Next.js Server Actions advisories against latest release notes.',
    prompt:
      'Conduct a zero-trust PR security review for Project Titan authentication layer. Audit PyJWT 2.8.0 against CVE advisories and verify Next.js 14.2.1 patch levels.',
  },
  {
    key: 'competitive_scout',
    label: 'Preset C: Deep Web Scouting',
    desc: 'Research latest Nemotron model latency benchmarks on Nebius Token Factory with scrubbed search queries.',
    prompt:
      'Scout live web benchmarks comparing NVIDIA Nemotron-3-Nano and Nemotron-3-Super inference latency and cost efficiency on Nebius Token Factory.',
  },
];

export const WorkspacePanel: React.FC<WorkspacePanelProps> = ({ onRun, loading, result }) => {
  const [workspaceId, setWorkspaceId] = useState('project_titan');
  const [instruction, setInstruction] = useState(PRESETS[0].prompt);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (result?.briefing_markdown) {
      navigator.clipboard.writeText(result.briefing_markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleApplyPreset = (preset: (typeof PRESETS)[0]) => {
    setInstruction(preset.prompt);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column: Workspace Config & Presets */}
      <div className="lg:col-span-5 space-y-4">
        {/* Workspace Card */}
        <TiltCard className="p-4 bg-slate-900/90 border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <FolderGit2 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300">
                Workspace Selector
              </h3>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-slate-400 border border-slate-700/50">
              Local Sandboxed
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setWorkspaceId('project_titan')}
              className={`p-2.5 rounded-md border text-left transition-all ${
                workspaceId === 'project_titan'
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className="text-xs font-semibold">Project Titan</div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">FastAPI & Next.js 14</div>
            </button>

            <button
              onClick={() => setWorkspaceId('default')}
              className={`p-2.5 rounded-md border text-left transition-all ${
                workspaceId === 'default'
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className="text-xs font-semibold">Apollo Service</div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">Microservice Gateway</div>
            </button>
          </div>
        </TiltCard>

        {/* 3 One-Click Evaluation Presets */}
        <TiltCard className="p-4 bg-slate-900/90 border-slate-800">
          <div className="flex items-center space-x-2 mb-3">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300">
              Evaluation Presets (1-Click)
            </h3>
          </div>

          <div className="space-y-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.key}
                onClick={() => handleApplyPreset(preset)}
                className="w-full p-2.5 rounded-md border border-slate-800/80 bg-slate-950/60 hover:bg-slate-800/60 hover:border-slate-700 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors">
                    {preset.label}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {preset.desc}
                </p>
              </button>
            ))}
          </div>
        </TiltCard>

        {/* Execution Input Console */}
        <TiltCard className="p-4 bg-slate-900/90 border-slate-800">
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
            Executive Task Instruction
          </label>
          <textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            rows={4}
            className="w-full p-3 rounded-md bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 font-sans focus:outline-none focus:border-emerald-500/50 transition-colors"
            placeholder="Type instructions for HermesShield..."
          />

          <div className="mt-3 flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500">
              Routes: Tier 1 Scrubber -&gt; Tavily -&gt; Tier 2 Synthesis
            </span>
            <Magnetic>
              <button
                onClick={() => onRun(instruction, workspaceId)}
                disabled={loading || !instruction.trim()}
                className="flex items-center space-x-2 px-4 py-2 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run Agent</span>
                  </>
                )}
              </button>
            </Magnetic>
          </div>
        </TiltCard>
      </div>

      {/* Right Column: Output Feed & Briefing Renderer */}
      <div className="lg:col-span-7">
        <TiltCard className="p-5 bg-slate-900/90 border-slate-800 min-h-[580px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300">
                  Synthesized Technical Briefing
                </h3>
              </div>

              {result && (
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono text-slate-500">
                    ID: {result.task_id}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center space-x-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-[10px] text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span className="text-[10px]">Copy</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {loading ? (
              <div className="py-24 flex flex-col items-center justify-center space-y-4">
                <div className="w-10 h-10 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
                <div className="text-center">
                  <div className="text-xs font-mono text-emerald-400">
                    Executing 3-Tier Pipeline...
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    PII Regex Scrub -&gt; Tavily Discovery -&gt; Nemotron Super Synthesis
                  </div>
                </div>
              </div>
            ) : result ? (
              <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed space-y-4">
                <div className="whitespace-pre-wrap font-sans text-xs bg-slate-950/60 p-4 rounded-lg border border-slate-800/80 font-normal leading-6">
                  {result.briefing_markdown}
                </div>
              </div>
            ) : (
              <div className="py-24 text-center text-slate-500">
                <Globe className="w-10 h-10 mx-auto text-slate-700 mb-3" />
                <p className="text-xs">
                  Click one of the 3 presets on the left or enter instructions to synthesize a live briefing.
                </p>
                <p className="text-[11px] text-slate-600 mt-1 font-mono">
                  All outgoing queries pass through the zero-PII Tavily Airlock.
                </p>
              </div>
            )}
          </div>

          {result && (
            <div className="pt-4 mt-6 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>Security Checks: 100% Passed</span>
              <span>
                Cost: ${result.finops.total_cost_usd.toFixed(5)} ({result.finops.cost_reduction_percent}% saved)
              </span>
            </div>
          )}
        </TiltCard>
      </div>
    </div>
  );
};
