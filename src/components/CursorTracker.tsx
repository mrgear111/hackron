'use client';

import { useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';

export default function CursorTracker() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <motion.div 
      className="fixed inset-0 pointer-events-none z-50"
      style={{ x: cursorX, y: cursorY }}
    >
      {/* Main cursor dot */}
      <div className="relative -ml-1.5 -mt-1.5">
        {/* Inner dot */}
        <div className="w-3 h-3 rounded-full bg-cyan-500/50" />
        
        {/* Outer ring */}
        <div className="absolute -inset-1 rounded-full border border-purple-500/30 animate-pulse" />
        
        {/* Glow effect */}
        <div className="absolute -inset-2 rounded-full bg-cyan-500/10 blur-sm" />
      </div>
    </motion.div>
  );
} 