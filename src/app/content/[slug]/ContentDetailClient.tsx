'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { GlassCard } from '@/components/ui/GlassCard';
import { GoldBadge } from '@/components/ui/GoldBadge';
import { CONTENT_TYPE_LABELS } from '@/lib/constants';
import type { Content } from '@/types';

interface Props {
  content: Content & { platform?: { name: string } };
}

export function ContentDetailClient({ content }: Props) {
  return (
    <PageWrapper>
      <section className="py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/content" className="inline-block mb-8 text-gold-light hover:text-gold-primary transition-colors">
            &rarr; العودة إلى المكتبة
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard className="p-8 md:p-12">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <GoldBadge>{CONTENT_TYPE_LABELS[content.type] || content.type}</GoldBadge>
                {content.platform && (
                  <span className="text-sm text-slate-500 dark:text-white/50 bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-full">
                    {content.platform.name}
                  </span>
                )}
                <span className="text-sm text-slate-400 dark:text-white/40 mr-auto">
                  👁️ {content.views} مشاهدة
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-8 leading-tight">
                {content.title}
              </h1>

              {content.video_url && (
                <div className="mb-10 rounded-2xl overflow-hidden bg-slate-900 aspect-video relative shadow-xl">
                  {content.video_url.includes('youtube.com') || content.video_url.includes('youtu.be') ? (
                    <iframe
                      src={content.video_url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                      className="absolute inset-0 w-full h-full"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <video controls src={content.video_url} className="absolute inset-0 w-full h-full object-cover"></video>
                  )}
                </div>
              )}

              {content.body && (
                <div className="prose prose-lg dark:prose-invert prose-gold max-w-none text-slate-700 dark:text-slate-300">
                  {content.body.split('\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              )}
            </GlassCard>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  );
}