// frontend/src/components/NemoClawHUD.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  ShieldCheck,
  FileCode2,
  Terminal,
  Activity,
  AlertTriangle,
  Play,
  RefreshCw,
  CheckCircle2,
  Lock,
  Cpu,
  Info,
} from 'lucide-react';
import { SecurityEvent, AttackSimulationResponse } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { BorderBeam } from '@/components/ui/BorderBeam';
import { ShimmerButton } from '@/components/ui/ShimmerButton';

interface NemoClawHUDProps {
  policyYaml: string;
  events: SecurityEvent[];
  onSimulateAttack: () => Promise<AttackSimulationResponse>;
}

export const NemoClawHUD: React.FC<NemoClawHUDProps> = ({
  policyYaml,
  events,
  onSimulateAttack,
}) => {
  const [simulating, setSimulating] = useState(false);
  const [attackAlert, setAttackAlert] = useState<AttackSimulationResponse | null>(null);

  const handleRunAttack = async () => {
    setSimulating(true);
    try {
      const res = await onSimulateAttack();
      setAttackAlert(res);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Red-Team Attack Alert Banner */}
      <AnimatePresence>
        {attackAlert && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            className="p-5 rounded-2xl bg-rose-950/80 border border-rose-500/80 text-rose-100 shadow-[0_0_30px_rgba(244,63,94,0.25)] flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-rose-900/60 border border-rose-500/40 text-rose-300 mt-0.5 shrink-0">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="rose">OUT-OF-PROCESS INTERCEPT</Badge>
                  <span className="text-[10px] font-mono text-rose-300 font-bold uppercase">
                    VIOLATION TERMINATED
                  </span>
                </div>
                <h4 className="text-sm font-heading font-bold text-white tracking-tight uppercase">
                  Critical: Secret Exfiltration Attempt Intercepted & Blocked!
                </h4>
                <p className="text-xs text-rose-200/90 leading-relaxed max-w-2xl">
                  {attackAlert.details}
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono text-rose-400">
                  <span>LATENCY: {attackAlert.execution_latency_ms}ms</span>
                  <span>•</span>
                  <span>RULE: {attackAlert.violated_rule}</span>
                  <span>•</span>
                  <span>SUBPROCESS SPAWNED: FALSE</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setAttackAlert(null)}
              className="px-3.5 py-1.5 text-xs font-mono rounded-lg bg-rose-900 hover:bg-rose-800 text-rose-200 border border-rose-700/60 transition-colors self-start md:self-center font-semibold cursor-pointer shrink-0"
            >
              Dismiss Alert
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simulator Trigger Banner Card with 21st.dev BorderBeam */}
      <Card className="relative overflow-hidden border-rose-500/30 bg-gradient-to-r from-surface via-surface to-rose-950/20 p-6 shadow-card">
        <BorderBeam
          size={240}
          duration={10}
          colorFrom="#f43f5e"
          colorTo="#f59e0b"
          borderWidth={1.5}
        />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge variant="rose">03 // OPENSHELL SUPERVISOR</Badge>
              <Badge variant="outline">SUB-15MS INTERCEPT</Badge>
            </div>
            <h3 className="text-lg font-heading font-bold text-text tracking-tight uppercase">
              Out-of-Process Deterministic Sandbox
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              Enforces declarative least-privilege security policies before subprocess calls touch your shell.
              Command chaining (<code className="text-rose-400">&amp;&amp;</code>, <code className="text-rose-400">|</code>), sensitive paths (<code className="text-rose-400">.env</code>, <code className="text-rose-400">id_rsa</code>), and secret dumping are blocked in &lt;15ms.
            </p>
          </div>

          <ShimmerButton
            onClick={handleRunAttack}
            disabled={simulating}
            shimmerColor="#f43f5e"
            background="rgba(244, 63, 94, 0.2)"
            className="border-rose-500/40 text-rose-200 hover:text-white"
          >
            {simulating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Intercepting Attack...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Simulate Injection Attack</span>
              </>
            )}
          </ShimmerButton>
        </div>
      </Card>

      {/* Grid: Policy Viewer & Security Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Live Declarative Policy YAML */}
        <div className="lg:col-span-5">
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-3 border-b border-border/80">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider">
                  <FileCode2 className="w-4 h-4 text-cyan-400" />
                  <span>config/nemoclaw-policy.yaml</span>
                </CardTitle>
                <Badge variant="emerald">STRICT ACTIVE</Badge>
              </div>
              <CardDescription>
                Declarative security rules enforced by the OpenShell supervisor
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 flex-1">
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-[480px] leading-relaxed select-all">
                {policyYaml}
              </pre>
            </CardContent>
            <div className="p-4 border-t border-border/60 text-[11px] font-mono text-muted flex items-center justify-between">
              <span>DENIED: curl, wget, nc, rm, bash</span>
              <span>TIMEOUT: 5.0s</span>
            </div>
          </Card>
        </div>

        {/* Right: Security Events Audit Log Table */}
        <div className="lg:col-span-7">
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-3 border-b border-border/80">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>Security Audit Log (SQLite)</span>
                </CardTitle>
                <Badge variant="secondary">
                  {events.length} RECORDED EVENTS
                </Badge>
              </div>
              <CardDescription>
                Persistent history of verified commands and blocked violations
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 flex-1">
              <div className="overflow-x-auto max-h-[480px]">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-border text-muted text-[10px] uppercase">
                      <th className="pb-2.5 font-medium">Timestamp</th>
                      <th className="pb-2.5 font-medium">Command</th>
                      <th className="pb-2.5 font-medium">Status</th>
                      <th className="pb-2.5 font-medium">Policy Rule</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {events.length > 0 ? (
                      events.map((evt, idx) => (
                        <tr key={idx} className="hover:bg-surface-2/60 transition-colors">
                          <td className="py-2.5 text-[11px] text-muted whitespace-nowrap">
                            {evt.timestamp.split('T')[1]?.split('.')[0] || evt.timestamp}
                          </td>
                          <td className="py-2.5 text-text font-mono text-xs max-w-[220px] truncate pr-2">
                            {evt.command}
                          </td>
                          <td className="py-2.5 whitespace-nowrap">
                            <Badge
                              variant={evt.status === 'BLOCKED' ? 'rose' : 'emerald'}
                              className="text-[10px]"
                            >
                              {evt.status}
                            </Badge>
                          </td>
                          <td className="py-2.5 text-[11px] text-muted whitespace-nowrap">
                            {evt.policy_rule}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-16 text-center text-muted text-xs font-mono">
                          No audit events logged yet. Execute commands or trigger attack simulation.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <div className="p-4 border-t border-border/60 text-[11px] font-mono text-muted flex items-center justify-between">
              <span>SUPERVISOR: OPENSHELL ENFORCING</span>
              <span className="text-emerald-400">100% OUT-OF-PROCESS</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
