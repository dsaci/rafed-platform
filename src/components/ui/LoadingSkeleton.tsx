/* ═══════════════════════════════
   رافد — Loading Skeleton
   ═══════════════════════════════ */

import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'circle' | 'rect';
  count?: number;
}

export function LoadingSkeleton({ className, variant = 'text', count = 1 }: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-white/5 rounded-lg';

  const variantClasses = {
    text: 'h-4 w-full',
    card: 'h-48 w-full rounded-[20px]',
    circle: 'h-12 w-12 rounded-full',
    rect: 'h-32 w-full rounded-xl',
  };

  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={cn(baseClasses, variantClasses[variant], className)} />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-[20px] border border-white/5 bg-white/[0.03] p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/5 animate-pulse" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-white/5 rounded animate-pulse w-3/4" />
          <div className="h-3 bg-white/5 rounded animate-pulse w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-white/5 rounded animate-pulse" />
        <div className="h-3 bg-white/5 rounded animate-pulse w-5/6" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center p-4 rounded-xl bg-white/[0.02]">
          <div className="h-4 bg-white/5 rounded animate-pulse w-24" />
          <div className="h-4 bg-white/5 rounded animate-pulse flex-1" />
          <div className="h-4 bg-white/5 rounded animate-pulse w-20" />
          <div className="h-4 bg-white/5 rounded animate-pulse w-16" />
        </div>
      ))}
    </div>
  );
}

