'use client';

import React from 'react';
import { PageHeader } from '@/components/app/PageHeader';
import { TavilyAirlock } from '@/components/TavilyAirlock';
import { useAppState } from '@/components/app/AppStateProvider';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function AirlockPage() {
  const { agentResult } = useAppState();

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Privacy Airlock"
        description="Every outbound search query passes through an offline Nemotron Nano scrubbing step. Secrets, credentials, internal domains, and personal data are eliminated before contacting public search or CVE APIs."
        badge="Zero Data Exfiltration"
        action={
          !agentResult ? (
            <Link
              href="/app/briefing"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-primary text-primary-fg hover:opacity-90 transition-opacity"
            >
              <Zap size={14} />
              Run briefing to see live diff
              <ArrowRight size={14} />
            </Link>
          ) : undefined
        }
      />

      <TavilyAirlock airlock={agentResult?.airlock ?? null} />
    </div>
  );
}
