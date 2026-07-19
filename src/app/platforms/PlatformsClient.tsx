/* ═══════════════════════════════
   رافد — Platforms Client Component
   ═══════════════════════════════ */

'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { GoldBadge } from '@/components/ui/GoldBadge';
import { PageWrapper } from '@/components/layout/PageWrapper';
import {
  PLATFORM_CATEGORIES,
  CATEGORY_LABELS,
  PLATFORM_STATUS_LABELS,
  PLATFORM_STATUS_COLORS,
} from '@/lib/constants';
import { getPlatformIcon } from '@/lib/icons';
import type { Platform } from '@/types';

interface PlatformsClientProps {
  platforms: Platform[];
}

export function PlatformsClient({ platforms }: PlatformsClientProps) {
  const [activeCategory, setActiveCategory] = useState('all');

  const uniquePlatforms = useMemo(() => {
    const seen = new Set();
    return platforms.filter(p => {
      if (seen.has(p.name)) return false;
      seen.add(p.name);
      return true;
    });
  }, [platforms]);

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return uniquePlatforms;
    return uniquePlatforms.filter((p) => p.category === activeCategory);
  }, [uniquePlatforms, activeCategory]);

  return (
    <PageWrapper>
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-5xl font-extrabold gold-gradient-text mb-4">
              المنصات المدعومة
            </h1>
            <p className="text-slate-500 dark:text-white/60 max-w-xl mx-auto">
              جميع المنصات الرقمية في المنظومة التربوية الجزائرية
            </p>
          </motion.div>

          {/* Filter Tabs */}
          <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
            {PLATFORM_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeCategory === cat.value
                    ? 'bg-gold-primary/10 text-gold-primary dark:text-gold-light border border-gold-border'
                    : 'text-slate-500 dark:text-white/60 hover:text-slate-800 dark:hover:text-white/80 hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Platform Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((platform, i) => (
                <motion.div
                  key={platform.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <GlassCard className="p-6 h-full" animate={false}>
                    <Link href={`/platforms/${platform.id}`} className="block h-full">
                      <div className="flex items-start gap-4">
                        <span className="text-3xl flex-shrink-0">
                          {(() => { const Icon = getPlatformIcon(platform.id).icon; return <Icon className="text-3xl" />; })()}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 truncate">
                            {platform.name}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-white/60 mb-4 line-clamp-2">
                            {platform.description}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <GoldBadge>{CATEGORY_LABELS[platform.category]}</GoldBadge>
                            <GoldBadge
                              variant="status"
                              colorClass={PLATFORM_STATUS_COLORS[platform.status]}
                            >
                              {PLATFORM_STATUS_LABELS[platform.status]}
                            </GoldBadge>
                            {platform.is_official && (
                              <GoldBadge className="bg-green-500/10 text-green-400 border-green-500/30">
                                رسمية
                              </GoldBadge>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <span className="text-5xl block mb-4">🔍</span>
              <p className="text-slate-500 dark:text-white/60">لا توجد منصات في هذه الفئة</p>
            </div>
          )}
        </div>
      </section>
    </PageWrapper>
  );
}

