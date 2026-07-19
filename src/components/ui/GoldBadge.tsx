/* ═══════════════════════════════
   رافد — Gold Badge Component
   ═══════════════════════════════ */

import React from 'react';
import { cn } from '@/lib/utils';

interface GoldBadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'status';
  colorClass?: string;
  className?: string;
}

export function GoldBadge({
  children,
  variant = 'gold',
  colorClass,
  className,
}: GoldBadgeProps) {
  const baseClasses = cn(
    'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border',
    variant === 'gold' && 'bg-gold-primary/10 text-slate-800 dark:text-gold-light border-gold-primary/30 dark:border-gold-border',
    variant === 'status' && colorClass,
    className
  );

  return <span className={baseClasses}>{children}</span>;
}

