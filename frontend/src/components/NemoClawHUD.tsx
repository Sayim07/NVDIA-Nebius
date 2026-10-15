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
} from 'lucide-react';
import { SecurityEvent, AttackSimulationResponse } from '@/lib/types';
import { TiltCard } from './ui/TiltCard';
import { Magnetic } from './ui/Magnetic';

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
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            className="p-4 rounded bg-rose-950/80 border border-rose-500/80 text-rose-100 shadow-[0_0_25px_rgba(244,63,94,0.3)] flex flex-col md:flex-row md:items-center justify-between gap-3"
          >
            <div className="flex items-start space-x-3.5">
              <div className="p-2 rounded bg-rose-900/60 border border-rose-500/40 text-rose-300 mt-0.5">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono tracking-wider text-rose-300">
                    [ NEMOCLAW INTERCEPT // OUT-OF-PROCESS ]
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-rose-900 text-rose-200 border border-rose-600/60 font-bold uppercase">
                    BLOCKED
                  </span>
                </div>
                <h4 className="text-xs font-bold font-mono tracking-tight text-white uppercase mt-0.5">
                  CRITICAL: Secret Exfiltration Attempt Intercepted & Blocked!
                </h4>
                <p className="text-[11px] text-rose-300/90 mt-1 leading-relaxed">
                  {attackAlert.details}
                </p>
                <div className="flex items-center space-x-3 mt-2 text-[10px] font-mono text-rose-400">
                  <span>[ LATENCY: {attackAlert.execution_latency_ms}ms ]</span>
                  <span>[ RULE: {attackAlert.violated_rule} ]</span>
                  <span>[ SUBPROCESS SPAWNED: FALSE ]</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setAttackAlert(null)}
              className="px-3 py-1.5 text-[10px] font-mono rounded bg-rose-900/80 hover:bg-rose-800 text-rose-200 border border-rose-700/60 transition-colors self-start md:self-center font-bold"
            >
              [ DISMISS ALERT ]
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simulator Trigger Card */}
      <TiltCard className="p-5 bg-slate-900/90 border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-wider text-rose-400">
                [ 03 // NEMOCLAW RUNTIME ]
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-950 text-rose-300 border border-rose-800/60 font-semibold">
                OUT-OF-PROCESS GUARANTEE
              </span>
            </div>
            <h3 className="text-base font-bold text-white tracking-tight uppercase mt-0.5 flex items-center gap-2">
              NVIDIA NemoClaw & OpenShell <span className="font-editorial italic font-normal text-rose-400 lowercase text-lg tracking-normal">sandbox guard</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Deterministic out-of-process gatekeeper evaluating incoming agent execution against declarative policies. Evaluates sensitive paths (`.env`, `id_rsa`) in &lt;15ms before execution reaches the shell.
            </p>
          </div>

          <Magnetic>
            <button
              onClick={handleRunAttack}
              disabled={simulating}
              className="flex items-center space-x-2 px-4 py-2.5 rounded bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(244,63,94,0.35)] transition-all disabled:opacity-50 shrink-0"
            >
              {simulating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>[ INTERCEPTING ATTACK... ]</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>[ ! SIMULATE INJECTION ATTACK ]</span>
                </>
              )}
            </button>
          </Magnetic>
        </div>
      </TiltCard>

      {/* Grid: Policy Viewer & Security Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Live Declarative Policy YAML */}
        <div className="lg:col-span-5">
          <TiltCard className="p-5 bg-slate-900/90 border border-slate-800 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
                <div className="flex items-center space-x-2">
                  <FileCode2 className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-200">
                    [ CONFIG/NEMOCLAW-POLICY.YAML ]
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">[ STRICT ACTIVE ]</span>
              </div>

              <pre className="p-3.5 rounded bg-slate-950 border border-slate-800/90 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-[460px] leading-relaxed">
                {policyYaml}
              </pre>
            </div>

            <div className="pt-3 mt-4 border-t border-slate-800/80 text-[10px] font-mono text-slate-500 flex justify-between">
              <span>[ DENIED: curl, wget, nc, rm ]</span>
              <span>[ TIMEOUT: 5.0s ]</span>
            </div>
          </TiltCard>
        </div>

        {/* Right: Security Events Audit Log Table */}
        <div className="lg:col-span-7">
          <TiltCard className="p-5 bg-slate-900/90 border border-slate-800 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-200">
                    [ SECURITY AUDIT LOG // SQLITE ]
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-slate-500">
                  [ {events.length} RECORDED EVENTS ]
                </span>
              </div>

              <div className="overflow-x-auto max-h-[460px]">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                      <th className="pb-2">[ TIMESTAMP ]</th>
                      <th className="pb-2">[ COMMAND ]</th>
                      <th className="pb-2">[ STATUS ]</th>
                      <th className="pb-2">[ POLICY RULE ]</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {events.length > 0 ? (
                      events.map((evt, idx) => (
                        <tr key={idx} className="hover:bg-slate-950/40">
                          <td className="py-2.5 text-[10px] text-slate-500 whitespace-nowrap">
                            {evt.timestamp.split('T')[1]?.split('.')[0] || evt.timestamp}
                          </td>
                          <td className="py-2.5 text-slate-300 font-mono text-[11px] max-w-[200px] truncate">
                            {evt.command}
                          </td>
                          <td className="py-2.5 whitespace-nowrap">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                evt.status === 'BLOCKED'
                                  ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                              }`}
                            >
                              [ {evt.status} ]
                            </span>
                          </td>
                          <td className="py-2.5 text-[10px] text-slate-400 whitespace-nowrap">
                            {evt.policy_rule}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-slate-500 text-xs font-mono">
                          [ NO AUDIT EVENTS LOGGED YET — EXECUTE COMMANDS OR TRIGGER ATTACK SIMULATION ]
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-3 mt-4 border-t border-slate-800/80 text-[10px] font-mono text-slate-500 flex justify-between">
              <span>[ OPENSHELL: ENFORCING ]</span>
              <span>[ 100% OUT-OF-PROCESS ]</span>
            </div>
          </TiltCard>
        </div>
      </div>
    </div>
  );
};
