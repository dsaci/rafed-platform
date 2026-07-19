/* ═══════════════════════════════
   رافد — Status Timeline
   ═══════════════════════════════ */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { IssueStatus } from '@/types';
import { ISSUE_STATUS_LABELS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface StatusTimelineProps {
  currentStatus: IssueStatus;
}

const STATUSES: IssueStatus[] = ['new', 'processing', 'solved'];

const STATUS_ICONS: Record<IssueStatus, string> = {
  new: '📩',
  processing: '⚙️',
  solved: '✅',
  escalated: '🔺',
};

export function StatusTimeline({ currentStatus }: StatusTimelineProps) {
  const isEscalated = currentStatus === 'escalated';
  const currentIndex = isEscalated ? 1 : STATUSES.indexOf(currentStatus);

  const displayStatuses = isEscalated
    ? (['new', 'processing', 'escalated'] as IssueStatus[])
    : STATUSES;

  return (
    <div className="flex items-center justify-between w-full py-6">
      {displayStatuses.map((status, index) => {
        const isActive = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <React.Fragment key={status}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.2 }}
              className="flex flex-col items-center gap-2"
            >
              <div
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center text-xl border-2 transition-all',
                  isActive
                    ? 'border-gold-primary bg-gold-primary/20 shadow-gold'
                    : 'border-white/10 bg-white/5',
                  isCurrent && 'ring-4 ring-gold-glow'
                )}
              >
                {STATUS_ICONS[status]}
              </div>
              <span
                className={cn(
                  'text-xs font-bold',
                  isActive ? 'text-gold-light' : 'text-white/30'
                )}
              >
                {ISSUE_STATUS_LABELS[status]}
              </span>
            </motion.div>
            {index < displayStatuses.length - 1 && (
              <div className="flex-1 mx-2">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: index < currentIndex ? 1 : 0 }}
                  transition={{ delay: (index + 1) * 0.2, duration: 0.4 }}
                  className="h-0.5 bg-gradient-to-l from-gold-primary to-gold-light origin-right"
                />
                {index >= currentIndex && (
                  <div className="h-0.5 bg-white/10 -mt-0.5" />
                )}
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

