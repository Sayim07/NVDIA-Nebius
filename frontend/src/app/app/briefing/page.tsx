'use client';

import React from 'react';
import { PageHeader } from '@/components/app/PageHeader';
import { WorkspacePanel } from '@/components/WorkspacePanel';
import { useAppState } from '@/components/app/AppStateProvider';

export default function BriefingPage() {
  const { handleRunAgent, loadingRun, agentResult } = useAppState();

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Workspace Briefing"
        description="Run sovereign agent workflows with Privacy Airlock scrubbing, multi-tier Nemotron routing on Nebius, and real-time CVE intelligence."
        badge="NVIDIA Nemotron Super"
      />

      <WorkspacePanel
        onRun={handleRunAgent}
        loading={loadingRun}
        result={agentResult}
      />
    </div>
  );
}
