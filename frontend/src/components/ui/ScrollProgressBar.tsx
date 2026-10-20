/**
 * Scroll Progress Bar
 * Thin forest green (#0B6E4F) progress bar anchored at the top of the viewport.
 */

'use client';

import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export const ScrollProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[2.5px] bg-primary z-[60] origin-left pointer-events-none"
      aria-hidden="true"
    />
  );
};
