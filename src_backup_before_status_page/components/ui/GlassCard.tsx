/* ═══════════════════════════════
   رافد — Glass Card Component
   ═══════════════════════════════ */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  animate?: boolean;
  delay?: number;
}

export function GlassCard({
  children,
  className,
  hover = true,
  onClick,
  animate = true,
  delay = 0,
}: GlassCardProps) {
  const baseClasses = cn(
    'relative rounded-[20px] border border-gold-border',
    'bg-[rgba(255,255,255,0.06)] backdrop-blur-[20px]',
    'transition-all duration-300',
    hover && 'hover:border-[rgba(201,168,76,0.6)] hover:shadow-gold-hover cursor-pointer',
    onClick && 'cursor-pointer',
    className
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5, delay }}
        className={baseClasses}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={baseClasses} onClick={onClick}>
      {children}
    </div>
  );
}

