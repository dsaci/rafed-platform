/* ═══════════════════════════════
   رافد — Empty State Component
   ═══════════════════════════════ */

import React from 'react';
import { GoldButton } from './GoldButton';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <span className="text-6xl mb-4">{icon}</span>
      <h3 className="text-xl font-bold text-white/80 mb-2">{title}</h3>
      <p className="text-sm text-white/40 max-w-md mb-6">{description}</p>
      {actionLabel && (
        <GoldButton href={actionHref} onClick={onAction} variant="secondary">
          {actionLabel}
        </GoldButton>
      )}
    </div>
  );
}

