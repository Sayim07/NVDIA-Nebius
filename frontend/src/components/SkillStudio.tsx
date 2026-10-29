'use client';

import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  Save,
  Moon,
  Cpu,
  RefreshCw,
  Code2,
  CheckCircle2,
  Terminal,
  FileCode,
  Zap,
} from 'lucide-react';
import { HermesSkill, OvernightScoutResponse } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/Card';
import { Badge } from './ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/Tabs';
import { BorderBeam } from './ui/BorderBeam';
import { ShimmerButton } from './ui/ShimmerButton';

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
      setTimeout(() => setSaveSuccess(false), 2500);
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
      {/* Top Banner: Overnight Autonomous Scouting with 21st.dev BorderBeam */}
      <Card className="relative overflow-hidden border-purple-500/30 bg-gradient-to-r from-surface via-surface-2/40 to-purple-950/20 shadow-card">
        <BorderBeam
          size={240}
          duration={12}
          colorFrom="#a855f7"
          colorTo="#06b6d4"
          borderWidth={1.5}
        />
        <div className="absolute top-0 right-0 w-80 h-32 bg-purple-500/5 blur-3xl pointer-events-none" />
        <CardContent className="p-6 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <Moon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="purple" size="sm">
                    Autonomous Cron
                  </Badge>
                  <Badge variant="outline" size="sm" className="font-mono text-[10px]">
                    Nebius Serverless Worker
                  </Badge>
                </div>
                <h3 className="text-base font-semibold text-text tracking-tight">
                  Overnight Vulnerability & Threat Scout
                </h3>
                <p className="text-xs text-muted max-w-2xl leading-relaxed">
                  Automated background watcher executing scheduled CVE diffing through the Privacy Airlock. Results are saved directly into persistent episodic memory with zero user interruption.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <ShimmerButton
                onClick={handleScout}
                disabled={runningScout}
                shimmerColor="#a855f7"
                background="rgba(168, 85, 247, 0.2)"
                className="border-purple-500/40 text-purple-200 hover:text-white"
              >
                {runningScout ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Scouting Pipeline Active...</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5" />
                    <span>Dispatch Overnight Scout</span>
                  </>
                )}
              </ShimmerButton>
            </div>
          </div>

          {scoutResult && (
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs font-mono text-emerald-400 bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/20">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} />
                <span>Job Completed: {scoutResult.job_id}</span>
              </div>
              <span className="text-muted">Saved to: {scoutResult.briefing_path}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content Grid: Memory Editor & Skills Compiler */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: MEMORY.md Live Markdown Editor */}
        <div className="lg:col-span-7">
          <Card className="h-full flex flex-col justify-between border-border/80">
            <CardHeader className="pb-3 border-b border-border/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div>
                    <CardTitle className="text-sm">data/MEMORY.md</CardTitle>
                    <CardDescription className="text-xs">
                      Persistent episodic heuristics & developer preferences
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="cyan" size="sm">
                  Live Sync
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-4 flex-1">
              <div className="relative rounded-xl border border-border/80 bg-surface-2/60 overflow-hidden">
                <div className="flex items-center justify-between px-3 py-1.5 bg-surface-2 border-b border-border text-[11px] font-mono text-muted">
                  <span className="flex items-center gap-1.5">
                    <Terminal size={12} />
                    Markdown Buffer
                  </span>
                  <span>{memoryText.length} bytes</span>
                </div>
                <textarea
                  value={memoryText}
                  onChange={(e) => setMemoryText(e.target.value)}
                  rows={18}
                  className="w-full p-4 bg-transparent text-xs font-mono text-text placeholder:text-muted focus:outline-none leading-relaxed resize-none selection:bg-primary/20"
                  placeholder="Episodic memory contents..."
                  spellCheck={false}
                />
              </div>
            </CardContent>

            <CardFooter className="pt-3 border-t border-border/60 flex items-center justify-between">
              <div className="text-xs text-muted flex items-center gap-2">
                {saveSuccess ? (
                  <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
                    <CheckCircle2 size={13} /> Saved to disk successfully
                  </span>
                ) : (
                  <span>Human-readable markdown on filesystem</span>
                )}
              </div>
              <button
                onClick={handleSaveMem}
                disabled={savingMemory}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-surface-2 hover:bg-surface-3 text-xs font-medium text-text border border-border transition-colors disabled:opacity-50 cursor-pointer"
              >
                {savingMemory ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5 text-primary" />
                )}
                <span>Save Memory</span>
              </button>
            </CardFooter>
          </Card>
        </div>

        {/* Right Column: Natural Feedback Compiler & Compiled Skills Catalog */}
        <div className="lg:col-span-5 space-y-6">
          {/* Natural Language Skill Compiler */}
          <Card className="border-border/80">
            <CardHeader className="pb-3 border-b border-border/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <CardTitle className="text-sm">Natural Language Compiler</CardTitle>
                    <CardDescription className="text-xs">
                      Nemotron Ultra synthesizes feedback into YAML skills
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="amber" size="sm">
                  Tier 3
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-3">
              <p className="text-xs text-muted leading-relaxed">
                Provide correctional guidance. The agent will parse trigger rules, validate syntax, and write an immutable skill spec to <code className="text-text font-mono text-[11px]">data/skills/</code>.
              </p>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
                className="w-full p-3.5 rounded-xl bg-surface-2/70 border border-border text-xs text-text placeholder:text-muted focus:outline-none focus:border-amber-500/40 transition-colors leading-relaxed"
                placeholder="e.g. Always include a Rollback Plan section whenever proposing database migrations..."
              />
            </CardContent>

            <CardFooter className="pt-3 border-t border-border/60 flex items-center justify-end">
              <ShimmerButton
                onClick={handleCompile}
                disabled={compiling || !feedback.trim()}
                shimmerColor="#f59e0b"
                background="rgba(245, 158, 11, 0.2)"
                className="border-amber-500/40 text-amber-200 hover:text-white"
              >
                {compiling ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Compiling YAML...</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Compile YAML Skill</span>
                  </>
                )}
              </ShimmerButton>
            </CardFooter>
          </Card>

          {/* Compiled Skills Catalog */}
          <Card className="border-border/80">
            <CardHeader className="pb-3 border-b border-border/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <FileCode className="w-4 h-4" />
                  </div>
                  <div>
                    <CardTitle className="text-sm">Active Skills Catalog</CardTitle>
                    <CardDescription className="text-xs">
                      {skills.length} compiled skills loaded from data/skills/
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="emerald" size="sm">
                  {skills.length} Active
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-3 max-h-[320px] overflow-y-auto">
              {skills.length === 0 ? (
                <div className="text-center py-6 text-xs text-muted">
                  No custom skills compiled yet. Use the compiler above to generate one.
                </div>
              ) : (
                skills.map((skill, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-surface-2/60 border border-border/80 hover:border-border transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-medium text-emerald-400">
                        {skill.skill_name}
                      </span>
                      <span className="text-[10px] font-mono text-muted">v{skill.version}</span>
                    </div>
                    <p className="text-xs text-muted leading-relaxed line-clamp-2">
                      {skill.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {skill.trigger_conditions.slice(0, 3).map((t, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-surface text-muted border border-border"
                        >
                          trigger: {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
