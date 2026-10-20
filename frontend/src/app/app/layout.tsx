'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AppStateProvider, useAppState } from '@/components/app/AppStateProvider';
import { DesktopSidebar, MobileDrawer } from '@/components/app/AppSidebar';
import { AppTopBar } from '@/components/app/AppTopBar';
import { AppCommandPalette } from '@/components/app/AppCommandPalette';

const SIDEBAR_COLLAPSED_KEY = 'hs-sidebar-collapsed';

function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { handleSimulateAttack, handleRunAgent } = useAppState();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true';
    }
    return false;
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  // Persist collapse state
  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleMenuToggle = () => {
    const isMobile = window.innerWidth < 1024;
    if (isMobile) {
      setMobileOpen((prev) => !prev);
    } else {
      setSidebarCollapsed((prev) => !prev);
    }
  };

  const handleRunPreset = (presetKey: string) => {
    const PRESET_PROMPTS: Record<string, { instruction: string; workspaceId: string }> = {
      architecture_sync: {
        instruction:
          'Prep my technical briefing for my 2 PM architecture sync on Project Titan, check FastAPI & Next.js CVEs.',
        workspaceId: 'project_titan',
      },
      pr_review: {
        instruction:
          'Conduct a zero-trust PR security review for Project Titan authentication layer. Audit PyJWT 2.8.0 against CVE advisories.',
        workspaceId: 'project_titan',
      },
      competitive_scout: {
        instruction:
          'Scout live web benchmarks comparing NVIDIA Nemotron-3-Nano and Nemotron-3-Super inference latency and cost on Nebius.',
        workspaceId: 'project_titan',
      },
    };
    const preset = PRESET_PROMPTS[presetKey];
    if (preset) {
      handleRunAgent(preset.instruction, preset.workspaceId, presetKey);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bg text-text">
      {/* Desktop sidebar */}
      <DesktopSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((p) => !p)}
      />

      {/* Mobile drawer */}
      <MobileDrawer isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <AppTopBar onMenuToggle={handleMenuToggle} />

        {/* Page content with route transition & guaranteed visible scrollbar */}
        <main
          id="app-main-scroll"
          className="flex-1 overflow-y-scroll overflow-x-hidden scroll-smooth focus:outline-none"
          tabIndex={-1}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="min-h-full flex flex-col"
            >
              <div className="flex-1 pb-20">
                {children}
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Global command palette */}
      <AppCommandPalette
        onSimulateAttack={handleSimulateAttack}
        onRunPreset={handleRunPreset}
      />
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppStateProvider>
      <AppShell>{children}</AppShell>
    </AppStateProvider>
  );
}
