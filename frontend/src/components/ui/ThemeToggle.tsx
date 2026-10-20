'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`w-9 h-9 rounded-lg border border-border bg-surface flex items-center justify-center opacity-60 ${className}`}
        aria-hidden="true"
      />
    );
  }

  const isDark = resolvedTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      id="theme-toggle"
      data-testid="theme-toggle"
      onClick={toggleTheme}
      type="button"
      className={`relative w-9 h-9 rounded-lg border border-border bg-surface hover:bg-surface-2 text-text flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-soft cursor-pointer ${className}`}
      aria-label={isDark ? 'Switch to light theme (Paper & Forest)' : 'Switch to dark theme (Forest Night)'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <motion.div
        key={isDark ? 'dark' : 'light'}
        initial={{ rotate: -45, scale: 0.6, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        exit={{ rotate: 45, scale: 0.6, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-center justify-center"
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-warning" strokeWidth={2} />
        ) : (
          <Moon className="w-4 h-4 text-primary" strokeWidth={2} />
        )}
      </motion.div>
    </button>
  );
};
