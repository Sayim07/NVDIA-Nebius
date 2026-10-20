'use client';

import React from 'react';
import { PageHeader } from '@/components/app/PageHeader';
import { NemoClawHUD } from '@/components/NemoClawHUD';
import { useAppState } from '@/components/app/AppStateProvider';

export default function SecurityPage() {
  const { securityState, handleSimulateAttack } = useAppState();

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Security & Sandbox"
        description="NVIDIA NemoClaw sandboxing actively intercepts subprocess executions, shell escapes, and credential exfiltration in <15ms before code touches your host."
        badge="NVIDIA NemoClaw Enforced"
      />

      <NemoClawHUD
        policyYaml={securityState?.policy_yaml ?? ''}
        events={securityState?.events ?? []}
        onSimulateAttack={handleSimulateAttack}
      />
    </div>
  );
}
