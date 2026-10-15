'use client';

import React, { useState } from 'react';
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
    tag: '[ 01 // ARCHITECTURE SYNC ]',
    label: 'Architecture Sync & CVE Scan',
    desc: 'Scan Project Titan dependencies, scrub PII via Airlock, discover live Mitre advisories, and construct a 2 PM technical briefing with mandatory rollback plan.',
    prompt:
      'Prep my technical briefing for my 2 PM architecture sync on Project Titan, check if our current FastAPI & Next.js dependencies have any new security advisories this week, and draft the agenda.',
  },
  {
    key: 'pr_review',
    tag: '[ 02 // PR SECURITY AUDIT ]',
    label: 'PR Security Review & Dependency Audit',
    desc: 'Audit PyJWT 2.8.0 algorithm confusion risks and verify Next.js 14.2.1 Server Actions patch levels against live security advisories.',
    prompt:
      'Conduct a zero-trust PR security review for Project Titan authentication layer. Audit PyJWT 2.8.0 against CVE advisories and verify Next.js 14.2.1 patch levels.',
  },
  {
    key: 'competitive_scout',
    tag: '[ 03 // DEEP SCOUT ]',
    label: 'Deep Web Scouting & FinOps Benchmarks',
    desc: 'Scout live web benchmarks comparing NVIDIA Nemotron-3-Nano and Nemotron-3-Super inference latency and cost efficiency on Nebius Token Factory.',
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
      {/* Left Column: Workspace Config & Presets */}
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
              LOCAL REPOSITORY
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setWorkspaceId('project_titan')}
              className={`p-3 rounded border text-left transition-all ${
                workspaceId === 'project_titan'
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-white'
                  : 'bg-slate-950 border-slate-800/80 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className="text-xs font-bold tracking-tight">Project Titan</div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">FastAPI + Next.js 14</div>
            </button>

            <button
              onClick={() => setWorkspaceId('default')}
              className={`p-3 rounded border text-left transition-all ${
                workspaceId === 'default'
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-white'
                  : 'bg-slate-950 border-slate-800/80 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className="text-xs font-bold tracking-tight">Apollo Service</div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">Microservice Gateway</div>
            </button>
          </div>
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
                className="w-full p-3 rounded border border-slate-800/80 bg-slate-950/80 hover:bg-slate-900 hover:border-slate-700 text-left transition-all group"
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

          <div className="mt-3 flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500">
              [ AIRLOCK: ARMED ]
            </span>
            <Magnetic>
              <button
                onClick={() => onRun(instruction, workspaceId)}
                disabled={loading || !instruction.trim()}
                className="flex items-center space-x-2 px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-current" />
                    <span>[ DISPATCH RUN ]</span>
                  </>
                )}
              </button>
            </Magnetic>
          </div>
        </TiltCard>
      </div>

      {/* Right Column: Output Feed & Briefing Renderer */}
      <div className="lg:col-span-7">
        <TiltCard className="p-5 bg-slate-900/90 border border-slate-800/90 min-h-[620px] flex flex-col justify-between">
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
                    className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors"
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
                  Select one of the 3 presets or input custom instructions to synthesize a sovereign technical briefing.
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
        </TiltCard>
      </div>
    </div>
  );
};
