'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/app/PageHeader';
import { ArchitectureShowcase } from '@/components/ArchitectureShowcase';

export default function HowItWorksPage() {
  const router = useRouter();

  const handleSelectTab = (tabId: string) => {
    const routeMap: Record<string, string> = {
      workspace: '/app/briefing',
      airlock: '/app/airlock',
      security: '/app/security',
      skills: '/app/skills',
    };
    const dest = routeMap[tabId] ?? `/app/${tabId}`;
    router.push(dest);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="How It Works"
        description="Comprehensive architectural overview of HermesShield: out-of-process NemoClaw sandbox, zero-exfiltration Privacy Airlock, multi-tier Nebius inference, and episodic memory persistence."
        badge="Zero-Trust Pipeline"
      />

      <ArchitectureShowcase onSelectConsoleTab={handleSelectTab} />
    </div>
  );
}
