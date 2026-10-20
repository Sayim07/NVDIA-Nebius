'use client';

import React from 'react';
import { PageHeader } from '@/components/app/PageHeader';
import { SkillStudio } from '@/components/SkillStudio';
import { useAppState } from '@/components/app/AppStateProvider';

export default function SkillsPage() {
  const {
    memoryState,
    handleSaveMemory,
    handleCompileSkill,
    handleTriggerScout,
  } = useAppState();

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Skills & Memory Studio"
        description="Inspect persistent episodic memory markdown, compile natural-language developer feedback into executable Python skills, and simulate autonomous overnight research scouting."
        badge="Episodic Memory Vault"
      />

      <SkillStudio
        memoryMarkdown={memoryState?.memory_markdown ?? ''}
        skills={memoryState?.skills ?? []}
        onSaveMemory={handleSaveMemory}
        onCompileSkill={handleCompileSkill}
        onTriggerScout={handleTriggerScout}
      />
    </div>
  );
}
