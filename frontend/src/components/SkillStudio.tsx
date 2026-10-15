'use client';

import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  Save,
  Moon,
  CheckCircle2,
  Cpu,
  RefreshCw,
  Code2,
} from 'lucide-react';
import { HermesSkill, OvernightScoutResponse } from '@/lib/types';
import { TiltCard } from './ui/TiltCard';
import { Magnetic } from './ui/Magnetic';

interface SkillStudioProps {
  memoryMarkdown: string;
  skills: HermesSkill[];
  onSaveMemory: (newMarkdown: string) => Promise<void>;
  onCompileSkill: (feedback: string) => Promise<void>;
  onTriggerScout: () => Promise<OvernightScoutResponse>;
}

export const SkillStudio: React.FC<SkillStudioProps> = ({
  memoryMarkdown,
  skills,
  onSaveMemory,
  onCompileSkill,
  onTriggerScout,
}) => {
  const [memoryText, setMemoryText] = useState(memoryMarkdown);
  const [feedback, setFeedback] = useState(
    "Great briefing, but next time always include a 'Rollback Plan' section and verify npm package deprecation status via Tavily."
  );
  const [savingMemory, setSavingMemory] = useState(false);
  const [compiling, setCompiling] = useState(false);
  const [runningScout, setRunningScout] = useState(false);
  const [scoutResult, setScoutResult] = useState<OvernightScoutResponse | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveMem = async () => {
    setSavingMemory(true);
    try {
      await onSaveMemory(memoryText);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } finally {
      setSavingMemory(false);
    }
  };

  const handleCompile = async () => {
    if (!feedback.trim()) return;
    setCompiling(true);
    try {
      await onCompileSkill(feedback);
    } finally {
      setCompiling(false);
    }
  };

  const handleScout = async () => {
    setRunningScout(true);
    try {
      const res = await onTriggerScout();
      setScoutResult(res);
    } finally {
      setRunningScout(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Overnight Scout Job Trigger */}
      <TiltCard className="p-5 bg-slate-900/90 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center space-x-3.5">
            <div className="p-2.5 rounded bg-violet-950/70 border border-violet-500/40 text-violet-400 shrink-0">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-wider text-violet-400">
                  [ 04 // AUTONOMOUS SCOUTING ]
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-violet-950 text-violet-300 border border-violet-800/60 font-semibold">
                  BACKGROUND CRON JOB
                </span>
              </div>
              <h3 className="text-base font-bold text-white tracking-tight uppercase mt-0.5">
                Nebius Serverless Overnight <span className="font-editorial italic font-normal text-violet-400 lowercase text-lg tracking-normal">scout pipeline</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 max-w-2xl leading-relaxed">
                Automated off-hours dependency monitoring via the Tavily Airlock. Writes structured briefings to `data/briefings/` while minimizing token expenditure.
              </p>
            </div>
          </div>

          <Magnetic>
            <button
              onClick={handleScout}
              disabled={runningScout}
              className="flex items-center space-x-2 px-4 py-2.5 rounded bg-violet-600 hover:bg-violet-500 text-white text-xs font-mono font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all disabled:opacity-50 shrink-0"
            >
              {runningScout ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>[ SCOUTING IN PROGRESS... ]</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 fill-current" />
                  <span>[ DISPATCH OVERNIGHT SCOUT ]</span>
                </>
              )}
            </button>
          </Magnetic>
        </div>

        {scoutResult && (
          <div className="mt-4 p-3 rounded bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 flex items-center justify-between">
            <span>[ JOB COMPLETED: {scoutResult.job_id} ]</span>
            <span>[ SAVED: {scoutResult.briefing_path} ]</span>
          </div>
        )}
      </TiltCard>

      {/* Grid: Memory Editor & Self-Writing Skill Compiler */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: MEMORY.md Editor */}
        <div className="lg:col-span-6">
          <TiltCard className="p-5 bg-slate-900/90 border border-slate-800 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
                <div className="flex items-center space-x-2">
                  <Brain className="w-4 h-4 text-violet-400" />
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-200">
                    [ DATA/MEMORY.MD // EPISODIC RECALL ]
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-slate-500">[ LIVE DISK SYNC ]</span>
              </div>

              <textarea
                value={memoryText}
                onChange={(e) => setMemoryText(e.target.value)}
                rows={16}
                className="w-full p-3.5 rounded bg-slate-950 border border-slate-800/90 text-xs font-mono text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50 leading-relaxed transition-colors"
                placeholder="Contents of data/MEMORY.md..."
              />
            </div>

            <div className="pt-3 mt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500">
                {saveSuccess ? '[ CHANGES SAVED TO DISK ]' : '[ HUMAN-READABLE PERSISTENT MEMORY ]'}
              </span>
              <Magnetic>
                <button
                  onClick={handleSaveMem}
                  disabled={savingMemory}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-slate-200 border border-slate-700 transition-colors"
                >
                  {savingMemory ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>[ SAVE MEMORY ]</span>
                </button>
              </Magnetic>
            </div>
          </TiltCard>
        </div>

        {/* Right Column: Skill Compiler & Catalog */}
        <div className="lg:col-span-6 space-y-6">
          {/* Feedback Compiler Console */}
          <TiltCard className="p-5 bg-slate-900/90 border border-slate-800">
            <div className="flex items-center space-x-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-200">
                [ HERMES SKILL COMPILER // TIER 3 NEMOTRON ULTRA ]
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
              Operational feedback synthesis: Tier 3 Nemotron Ultra extracts behavioral heuristics and compiles a validated YAML skill.
            </p>

            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
              className="w-full p-3 rounded bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 transition-colors"
              placeholder="e.g. Next time, always check CVE databases for FastAPI..."
            />

            <div className="mt-3 flex justify-end">
              <Magnetic>
                <button
                  onClick={handleCompile}
                  disabled={compiling || !feedback.trim()}
                  className="flex items-center space-x-2 px-4 py-2 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-mono font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all disabled:opacity-50"
                >
                  {compiling ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>[ COMPILING YAML SKILL... ]</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-3.5 h-3.5" />
                      <span>[ COMPILE TO YAML SKILL ]</span>
                    </>
                  )}
                </button>
              </Magnetic>
            </div>
          </TiltCard>

          {/* Compiled Skills Catalog */}
          <TiltCard className="p-5 bg-slate-900/90 border border-slate-800">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800/80">
              <div className="flex items-center space-x-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-200">
                  [ COMPILED SKILLS CATALOG // {skills.length} ]
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500">[ DATA/SKILLS/*.YAML ]</span>
            </div>

            <div className="space-y-3 max-h-[220px] overflow-y-auto">
              {skills.map((skill, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-emerald-400">
                      [ {skill.skill_name} ]
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      [ v{skill.version} ]
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                    {skill.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {skill.trigger_conditions.slice(0, 2).map((t, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[9px] font-mono bg-slate-900 text-slate-400 border border-slate-800"
                      >
                        [ TRIGGER: {t} ]
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TiltCard>
        </div>
      </div>
    </div>
  );
};
