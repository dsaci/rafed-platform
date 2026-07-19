/* رافد — Issue Detail Client */
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { GoldBadge } from '@/components/ui/GoldBadge';
import { GoldButton } from '@/components/ui/GoldButton';
import { StatusTimeline } from '@/components/ui/StatusTimeline';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { useToast } from '@/components/ui/ToastProvider';
import { ISSUE_STATUS_LABELS, ISSUE_STATUS_COLORS } from '@/lib/constants';
import { getPlatformIcon } from '@/lib/icons';
import { formatArabicDate } from '@/lib/utils';
import type { Issue } from '@/types';

export function IssueDetailClient({ issue }: { issue: Issue }) {
  const { addToast } = useToast();

  const copyTicket = () => {
    navigator.clipboard.writeText(issue.ticket_number);
    addToast('success', 'تم نسخ رقم التذكرة');
  };

  let diagnosisData: { diagnosis?: string; solution_steps?: string[]; confidence?: string; should_escalate?: boolean; escalation_reason?: string | null } | null = null;
  try {
    if (issue.ai_diagnosis) diagnosisData = JSON.parse(issue.ai_diagnosis);
  } catch { diagnosisData = null; }

  return (
    <PageWrapper>
      <section className="py-12 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Header */}
            <GlassCard className="p-8" animate={false} hover={false}>
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-white/30">رقم التذكرة:</span>
                    <code className="text-gold-light font-bold" dir="ltr">{issue.ticket_number}</code>
                    <button onClick={copyTicket} className="text-white/30 hover:text-gold-light transition-colors text-sm">📋</button>
                  </div>
                  <p className="text-xs text-white/30">{formatArabicDate(issue.created_at)}</p>
                </div>
                <GoldBadge variant="status" colorClass={ISSUE_STATUS_COLORS[issue.status]}>
                  {ISSUE_STATUS_LABELS[issue.status]}
                </GoldBadge>
              </div>
              <StatusTimeline currentStatus={issue.status} />
            </GlassCard>

            {/* Description */}
            <GlassCard className="p-6 mt-4" animate={false} hover={false}>
              <h3 className="text-sm font-bold text-gold-light mb-3">وصف المشكلة</h3>
              <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">{issue.description}</p>
              {issue.platform && (
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-sm text-white/40">
                  <span>
                    {(() => {
                      const Icon = getPlatformIcon(issue.platform.id).icon;
                      return <Icon className="w-5 h-5" />;
                    })()}
                  </span>
                  <span>{issue.platform.name}</span>
                </div>
              )}
            </GlassCard>

            {/* AI Diagnosis */}
            {diagnosisData && (
              <GlassCard className="p-6 mt-4" animate={false} hover={false}>
                <h3 className="text-sm font-bold text-gold-light mb-3">🤖 التشخيص الذكي</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-4">{diagnosisData.diagnosis}</p>
                {diagnosisData.solution_steps && diagnosisData.solution_steps.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-white/50">خطوات الحل:</p>
                    {diagnosisData.solution_steps.map((step, i) => (
                      <div key={i} className="flex items-start gap-3 bg-white/[0.03] rounded-xl p-3">
                        <span className="w-6 h-6 rounded-full bg-gold-primary/20 text-gold-light text-xs flex items-center justify-center flex-shrink-0 font-bold">{i + 1}</span>
                        <p className="text-sm text-white/60">{step}</p>
                      </div>
                    ))}
                  </div>
                )}
                {diagnosisData.should_escalate && diagnosisData.escalation_reason && (
                  <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                    <p className="text-sm text-red-400">⚠️ {diagnosisData.escalation_reason}</p>
                  </div>
                )}
              </GlassCard>
            )}

            {/* Solution */}
            {issue.solution && (
              <GlassCard className="p-6 mt-4 border-green-500/30" animate={false} hover={false}>
                <h3 className="text-sm font-bold text-green-400 mb-3">✅ الحل</h3>
                <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">{issue.solution}</p>
              </GlassCard>
            )}

            {/* Share */}
            <div className="mt-6 text-center">
              <GoldButton variant="outline" onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                addToast('success', 'تم نسخ رابط التذكرة');
              }}>
                مشاركة التذكرة 🔗
              </GoldButton>
            </div>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  );
}

