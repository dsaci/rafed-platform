/* ═══════════════════════════════
   رافد — Home Page Client Component
   ═══════════════════════════════ */

'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { GoldButton } from '@/components/ui/GoldButton';
import { GoldBadge } from '@/components/ui/GoldBadge';
import { StatsCard } from '@/components/ui/StatsCard';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { CATEGORY_LABELS, CONTENT_TYPE_LABELS } from '@/lib/constants';
import { getPlatformIcon } from '@/lib/icons';
import { formatRelativeTime, truncate } from '@/lib/utils';
import type { Platform, Issue, Content, HomeStats } from '@/types';

interface HomeClientProps {
  platforms: Platform[];
  employmentPlatform: Platform | null;
  updatesPlatform: Platform | null;
  solvedIssues: Issue[];
  latestContent: Content[];
  stats: HomeStats;
}

export function HomeClient({ platforms, employmentPlatform, updatesPlatform, solvedIssues, latestContent, stats }: HomeClientProps) {
  return (
    <PageWrapper withPadding={false}>
      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-dark-base dark:bg-dark-base bg-slate-50 grid-bg" />
        <div className="absolute inset-0 hero-gradient" />

        {/* Floating orbs */}
        <motion.div
          animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-gold-primary/5 dark:bg-gold-primary/5 blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0], x: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/3 left-1/3 w-96 h-96 rounded-full bg-gold-light/5 dark:bg-gold-light/5 blur-3xl"
        />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Logo badge */}
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-gold-border bg-[rgba(255,255,255,0.85)] dark:bg-gold-primary/5 shadow-sm dark:shadow-none mb-8">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-bl from-gold-primary to-gold-light flex items-center justify-center text-dark-base font-extrabold text-sm">
                ر
              </div>
              <span className="text-sm font-bold text-gold-primary dark:text-gold-light">المرافقة الرقمية التربوية</span>
            </div>

            {/* Main heading */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              <span className="gold-gradient-text">نرصد، نرافق، نحسّن</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-2xl text-slate-700 dark:text-white/80 font-semibold max-w-3xl mx-auto mb-10 leading-relaxed">
              منصة رافد — المرافق الرقمي لمنظومة التربية الوطنية الجزائرية.
              نشخّص مشاكلك التقنية ونرافقك حتى الحل.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
              <GoldButton href="/issues/new" size="lg">
                أرسل انشغالك
              </GoldButton>
              <GoldButton href="/platforms" variant="outline" size="lg">
                تصفح المنصات
              </GoldButton>
              {employmentPlatform && (
                <Link
                  href="/platforms/tawdif"
                  className="relative flex items-center gap-3 px-6 md:px-8 py-3.5 rounded-2xl bg-[#ffffff] dark:bg-[rgba(255,255,255,0.05)] border-2 border-gold-primary/40 hover:border-gold-light shadow-lg dark:shadow-none hover:shadow-xl transition-all font-bold group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-primary/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <span className="text-2xl group-hover:scale-110 transition-transform relative z-10">🎓</span>
                  <span className="text-sm md:text-base relative z-10 text-slate-900 dark:text-white">مسابقات التوظيف (فضاء المترشحين)</span>
                  <span className="relative z-10 text-xs font-extrabold bg-gradient-to-r from-gold-primary to-gold-light text-slate-900 px-3 py-1 rounded-full mr-2 shadow-sm">متاح الآن</span>
                </Link>
              )}
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-24 md:bottom-28 left-1/2 -translate-x-1/2"
        >
          <div className="w-7 h-11 rounded-full border-2 border-slate-400 dark:border-[rgba(255,255,255,0.35)] flex items-start justify-center pt-2 shadow-sm">
            <div className="w-1.5 h-3 rounded-full bg-gold-primary dark:bg-gold-light/70" />
          </div>
        </motion.div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="relative z-20 -mt-16 pb-12 md:pb-16 px-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <StatsCard label="إجمالي الانشغالات" value={stats.totalIssues} icon="📩" delay={0} />
            <StatsCard label="الانشغالات المحلولة" value={stats.solvedIssues} icon="✅" delay={0.1} color="text-green-400" />
            <StatsCard label="المنصات المدعومة" value={stats.totalPlatforms} icon="🖥️" delay={0.2} />
            <StatsCard label="الولايات المغطاة" value={stats.totalWilayas} icon="🗺️" delay={0.3} />
          </div>
        </div>
      </section>

      {/* ── Updates / Announcements Section ── */}
      {updatesPlatform && (
        <section className="bg-[#ffffff] dark:bg-dark-surface border-y border-gold-border/30 py-6 overflow-hidden relative shadow-sm dark:shadow-none">
          <div className="absolute inset-0 bg-gold-primary/5 pattern-dots opacity-20" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="flex items-center gap-3 md:w-1/4 shrink-0">
              <span className="w-12 h-12 rounded-xl bg-gold-primary/10 border border-gold-border flex items-center justify-center text-2xl animate-pulse-gold">
                🔔
              </span>
              <div>
                <h2 className="text-lg font-bold gold-gradient-text leading-tight">
                  {updatesPlatform.name}
                </h2>
                <p className="text-xs text-slate-500 dark:text-white/50">أحدث الإعلانات الرسمية</p>
              </div>
            </div>
            
            <div className="flex-1 bg-slate-50 dark:bg-dark-base/50 backdrop-blur-sm border border-slate-200 dark:border-white/5 rounded-xl p-4 w-full flex items-center justify-between group cursor-pointer hover:bg-slate-100 dark:hover:bg-white/5 transition-colors" onClick={() => window.location.href = `/platforms/${updatesPlatform.id}`}>
              <div className="flex items-center gap-4 overflow-hidden w-full">
                <span className="text-gold-primary dark:text-gold-light text-xs font-bold whitespace-nowrap bg-gold-primary/10 dark:bg-gold-primary/20 px-2 py-1 rounded">جديد</span>
                <p className="text-sm text-slate-700 dark:text-white/80 truncate font-medium">
                  اضغط هنا لعرض كافة المستجدات والمنشورات الرسمية المتعلقة بالقطاع التربوي...
                </p>
              </div>
              <span className="text-gold-primary dark:text-gold-light opacity-50 group-hover:opacity-100 group-hover:-translate-x-1 transition-all mr-4">
                ←
              </span>
            </div>
          </div>
        </section>
      )}

      {/* ── Platforms Section ── */}
      <section className="section-dark py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold gold-gradient-text mb-4">
              المنصات المدعومة
            </h2>
            <p className="text-slate-500 dark:text-white/40 max-w-xl mx-auto">
              نغطي أهم المنصات الرقمية في المنظومة التربوية الجزائرية
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {platforms.slice(0, 6).map((platform, i) => (
              <GlassCard key={platform.id} delay={i * 0.1} className="p-6">
                <Link href={`/platforms/${platform.id}`} className="block">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">
                      {(() => { const Icon = getPlatformIcon(platform.id).icon; return <Icon className="text-3xl" />; })()}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">{platform.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-white/40 mb-3 line-clamp-2">
                        {platform.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <GoldBadge>{CATEGORY_LABELS[platform.category]}</GoldBadge>
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
            ))}
          </div>

          {platforms.length > 6 && (
            <div className="text-center mt-8">
              <GoldButton href="/platforms" variant="outline">
                عرض جميع المنصات
              </GoldButton>
            </div>
          )}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="section-darker py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold gold-gradient-text mb-4">
              كيف يعمل رافد؟
            </h2>
            <p className="text-slate-500 dark:text-white/40 max-w-xl mx-auto">
              ثلاث خطوات بسيطة من انشغالك إلى الحل
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: '📩', title: 'أرسل انشغالك', desc: 'صف المشكلة التي تواجهها على أي منصة رقمية تربوية' },
              { step: '02', icon: '🤖', title: 'نشخّص المشكلة', desc: 'يقوم الذكاء الاصطناعي بتحليل المشكلة وتقديم حلول فورية' },
              { step: '03', icon: '✅', title: 'نحلّ ونرافق', desc: 'نقدم لك حلاً مفصلاً أو نرفع المشكلة للجهة المعنية' },
            ].map((item, i) => (
              <GlassCard key={item.step} delay={i * 0.15} className="p-8 text-center">
                <span className="text-5xl mb-4 block">{item.icon}</span>
                <span className="text-xs font-bold text-gold-primary/50 mb-2 block">
                  الخطوة {item.step}
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-sm text-slate-500 dark:text-white/40 leading-relaxed">{item.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── Solved Issues ── */}
      {solvedIssues.length > 0 && (
        <section className="section-dark py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-extrabold gold-gradient-text mb-4">
                آخر الانشغالات المحلولة
              </h2>
              <p className="text-slate-500 dark:text-white/40 max-w-xl mx-auto">
                اطلع على المشاكل التي تم حلها مؤخراً
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {solvedIssues.map((issue, i) => (
                <GlassCard key={issue.id} delay={i * 0.1} className="p-6">
                  <Link href={`/issues/${issue.id}`} className="block">
                    <div className="flex items-center gap-2 mb-3">
                      <GoldBadge className="bg-green-500/10 text-green-400 border-green-500/30">
                        محلول ✓
                      </GoldBadge>
                      <span className="text-xs text-slate-400 dark:text-white/30">
                        {issue.resolved_at ? formatRelativeTime(issue.resolved_at) : ''}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-white/70 mb-3 line-clamp-3">
                      {truncate(issue.description, 120)}
                    </p>
                    {issue.platform && (
                      <p className="text-xs text-gold-light/60">
                        {(() => { const Icon = getPlatformIcon(issue.platform.id).icon; return <Icon className="text-3xl" />; })()} {issue.platform.name}
                      </p>
                    )}
                  </Link>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Latest Content ── */}
      {latestContent.length > 0 && (
        <section className="section-darker py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-extrabold gold-gradient-text mb-4">
                مكتبة المحتوى
              </h2>
              <p className="text-slate-500 dark:text-white/40 max-w-xl mx-auto">
                شروحات ومقالات لمساعدتك في استخدام المنصات الرقمية
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {latestContent.map((item, i) => (
                <GlassCard key={item.id} delay={i * 0.1} className="p-6">
                  <Link href={`/content/${item.slug}`} className="block">
                    <GoldBadge className="mb-3">{CONTENT_TYPE_LABELS[item.type]}</GoldBadge>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                    {item.body && (
                      <p className="text-sm text-slate-500 dark:text-white/40 line-clamp-2">{truncate(item.body, 100)}</p>
                    )}
                    <div className="flex items-center gap-3 mt-3 text-xs text-slate-400 dark:text-white/30">
                      <span>👁️ {item.views}</span>
                      {item.platform && <span>{item.platform.name}</span>}
                    </div>
                  </Link>
                </GlassCard>
              ))}
            </div>

            <div className="text-center mt-8">
              <GoldButton href="/content" variant="outline">
                تصفح المكتبة الكاملة
              </GoldButton>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA Section ── */}
      <section className="section-dark py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <GlassCard className="p-8 md:p-12" animate hover={false}>
            <h2 className="text-2xl md:text-3xl font-extrabold gold-gradient-text mb-4">
              هل تواجه مشكلة على منصة رقمية؟
            </h2>
            <p className="text-slate-500 dark:text-white/40 mb-8 max-w-lg mx-auto">
              أرسل انشغالك الآن وسنساعدك في تشخيص المشكلة وإيجاد الحل المناسب
            </p>
            <GoldButton href="/issues/new" size="lg">
              أرسل انشغالك الآن
            </GoldButton>
          </GlassCard>
        </div>
      </section>
    </PageWrapper>
  );
}

