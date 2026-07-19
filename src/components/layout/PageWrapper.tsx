/* ═══════════════════════════════
   رافد — Page Wrapper Component
   ═══════════════════════════════ */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  withPadding?: boolean;
}

export function PageWrapper({ children, className, withPadding = true }: PageWrapperProps) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'min-h-screen',
        withPadding && 'pt-16 md:pt-20',
        className
      )}
    >
      {children}
    </motion.main>
  );
}

