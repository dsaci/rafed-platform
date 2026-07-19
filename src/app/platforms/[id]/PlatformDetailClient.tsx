/* ═══════════════════════════════
   رافد — Platform Detail Client
   ═══════════════════════════════ */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { GoldButton } from '@/components/ui/GoldButton';
import { GoldBadge } from '@/components/ui/GoldBadge';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  CATEGORY_LABELS,
  PLATFORM_STATUS_LABELS,
  PLATFORM_STATUS_COLORS,
  CONTENT_TYPE_LABELS,
} from '@/lib/constants';
import { getPlatformIcon } from '@/lib/icons';
import { formatRelativeTime, truncate } from '@/lib/utils';
import type { Platform, Issue, Content } from '@/types';

interface Props {
  platform: Platform;
  solvedIssues: Issue[];
  content: Content[];
}

const TABS = [
  { key: 'tutorials', label: 'الشروحات' },
  { key: 'faq', label: 'الأسئلة الشائعة' },
  { key: 'solved', label: 'الانشغالات المحلولة' },
];

export function PlatformDetailClient({ platform, solvedIssues, content }: Props) {
  const [activeTab, setActiveTab] = useState('tutorials');

  const tutorials = content.filter((c) => c.type === 'video' || c.type === 'article');
  const faqs = content.filter((c) => c.type === 'faq');

  const PlatformIcon = getPlatformIcon(platform.id).icon;

  return (
    <PageWrapper>
      <section className="py-12 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Platform Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard className="p-8" animate={false} hover={false}>
              <div className="flex flex-col md:flex-row items-start gap-6">
                <span className="text-5xl text-gold-light"><PlatformIcon className="w-12 h-12" /></span>
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
                    {platform.name}
                  </h1>
                  <p className="text-white/50 mb-4">{platform.description}</p>
                  <div className="flex items-center gap-2 flex-wrap mb-4">
                    <GoldBadge>{CATEGORY_LABELS[platform.category]}</GoldBadge>
                    <GoldBadge
                      variant="status"
                      colorClass={PLATFORM_STATUS_COLORS[platform.status]}
                    >
                      {PLATFORM_STATUS_LABELS[platform.status]}
                    </GoldBadge>
                    {platform.is_official && (
                      <GoldBadge className="bg-green-500/10 text-green-400 border-green-500/30">
                        ✓ منصة رسمية
                      </GoldBadge>
                    )}
                  </div>
                  {platform.url && (
                    <a
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gold-light hover:underline"
                    >
                      زيارة المنصة ↗
                    </a>
                  )}
                </div>
                <GoldButton href={`/issues/new?platform=${platform.id}`}>
                  أرسل انشغالك عن هذه المنصة
                </GoldButton>
              </div>
            </GlassCard>
          </motion.div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mt-8 mb-6 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-gold-primary/10 text-gold-light border border-gold-border'
                    : 'text-white/40 hover:text-white/70 border border-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'tutorials' && (
            <div className="space-y-4">
              {tutorials.length > 0 ? (
                tutorials.map((item) => (
                  <GlassCard key={item.id} className="p-6">
                    <Link href={`/content/${item.slug}`} className="block">
                      <div className="flex items-center gap-2 mb-2">
                        <GoldBadge>{CONTENT_TYPE_LABELS[item.type]}</GoldBadge>
                        <span className="text-xs text-white/30">👁️ {item.views}</span>
                      </div>
                      <h3 className="text-base font-bold text-white mb-1">{item.title}</h3>
                      {item.body && (
                        <p className="text-sm text-white/40">{truncate(item.body, 150)}</p>
                      )}
                    </Link>
                  </GlassCard>
                ))
              ) : (
                <EmptyState
                  icon="📚"
                  title="لا توجد شروحات بعد"
                  description="سيتم إضافة شروحات لهذه المنصة قريباً"
                />
              )}
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-4">
              {faqs.length > 0 ? (
                faqs.map((item) => (
                  <GlassCard key={item.id} className="p-6">
                    <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                    {item.body && (
                      <p className="text-sm text-white/50 leading-relaxed">{item.body}</p>
                    )}
                  </GlassCard>
                ))
              ) : (
                <EmptyState
                  icon="❓"
                  title="لا توجد أسئلة شائعة بعد"
                  description="سيتم إضافة أسئلة وأجوبة لهذه المنصة قريباً"
                />
              )}
            </div>
          )}

          {activeTab === 'solved' && (
            <div className="space-y-4">
              {solvedIssues.length > 0 ? (
                solvedIssues.map((issue) => (
                  <GlassCard key={issue.id} className="p-6">
                    <Link href={`/issues/${issue.id}`} className="block">
                      <div className="flex items-center gap-2 mb-2">
                        <GoldBadge className="bg-green-500/10 text-green-400 border-green-500/30">
                          محلول ✓
                        </GoldBadge>
                        <span className="text-xs text-white/30">
                          {issue.resolved_at ? formatRelativeTime(issue.resolved_at) : ''}
                        </span>
                      </div>
                      <p className="text-sm text-white/70 mb-2">
                        {truncate(issue.description, 200)}
                      </p>
                      {issue.solution && (
                        <p className="text-sm text-green-400/70">
                          💡 {truncate(issue.solution, 100)}
                        </p>
                      )}
                    </Link>
                  </GlassCard>
                ))
              ) : (
                <EmptyState
                  icon="📭"
                  title="لا توجد انشغالات محلولة بعد"
                  description="لم يتم حل أي انشغال لهذه المنصة بعد"
                />
              )}
            </div>
          )}
        </div>
      </section>
    </PageWrapper>
  );
}

