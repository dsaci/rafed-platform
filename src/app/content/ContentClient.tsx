/* رافد — Content Library Client */
'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { GoldBadge } from '@/components/ui/GoldBadge';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { EmptyState } from '@/components/ui/EmptyState';
import { CONTENT_TYPE_LABELS } from '@/lib/constants';
import { truncate } from '@/lib/utils';
import type { Content } from '@/types';

const TYPE_FILTERS = [
  { value: 'all', label: 'الكل' },
  { value: 'video', label: 'فيديو' },
  { value: 'article', label: 'مقال' },
  { value: 'faq', label: 'أسئلة وأجوبة' },
];

interface Props {
  content: Content[];
  platforms: { id: string; name: string }[];
}

export function ContentClient({ content, platforms }: Props) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');

  const filtered = useMemo(() => {
    return content.filter((c) => {
      if (typeFilter !== 'all' && c.type !== typeFilter) return false;
      if (platformFilter !== 'all' && c.platform_id !== platformFilter) return false;
      if (search && !c.title.includes(search) && !(c.body || '').includes(search)) return false;
      return true;
    });
  }, [content, search, typeFilter, platformFilter]);

  return (
    <PageWrapper>
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <h1 className="text-3xl md:text-5xl font-extrabold gold-gradient-text mb-4">قاعدة المعرفة والمقالات</h1>
            <p className="text-slate-500 dark:text-white/40 max-w-xl mx-auto">قبل فتح تذكرة دعم، ابحث هنا.. قد يكون حل مشكلتك متوفراً بالفعل بفضل استفسارات زملائك السابقة.</p>
          </motion.div>

          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="✨ صف المشكلة التي تواجهها للبحث عن الحل..."
              className="flex-1 px-4 py-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-gold-border text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:border-gold-primary/50 focus:ring-1 focus:ring-gold-primary/50 transition-all shadow-sm"
            />
            <div className="flex gap-2 flex-wrap">
              {TYPE_FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setTypeFilter(f.value)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    typeFilter === f.value ? 'bg-gold-primary/10 text-gold-light border border-gold-border' : 'text-slate-500 dark:text-white/40 hover:text-slate-700 dark:hover:text-white/70 border border-transparent'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {platforms.length > 0 && (
            <div className="flex gap-2 mb-8 flex-wrap">
              <button onClick={() => setPlatformFilter('all')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${platformFilter === 'all' ? 'bg-gold-primary/10 text-gold-light' : 'text-slate-400 dark:text-white/30 hover:text-slate-500 dark:hover:text-white/60'}`}>
                كل المنصات
              </button>
              {platforms.map((p) => (
                <button key={p.id} onClick={() => setPlatformFilter(p.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${platformFilter === p.id ? 'bg-gold-primary/10 text-gold-light' : 'text-slate-400 dark:text-white/30 hover:text-slate-500 dark:hover:text-white/60'}`}>
                  {p.name}
                </button>
              ))}
            </div>
          )}

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => (
                <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3, delay: i * 0.03 }}>
                  <GlassCard className="p-6 h-full" animate={false}>
                    <Link href={`/content/${item.slug}`} className="block h-full">
                      <GoldBadge className="mb-3">{CONTENT_TYPE_LABELS[item.type]}</GoldBadge>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                      {item.body && <p className="text-sm text-slate-500 dark:text-white/40 line-clamp-3 mb-3">{truncate(item.body, 120)}</p>}
                      <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-white/30">
                        <span>👁️ {item.views}</span>
                        {item.platform && <span>{item.platform.name}</span>}
                      </div>
                    </Link>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filtered.length === 0 && (
            <EmptyState icon="📭" title="لا يوجد محتوى" description="لا يوجد محتوى يطابق معايير البحث" />
          )}
        </div>
      </section>
    </PageWrapper>
  );
}

