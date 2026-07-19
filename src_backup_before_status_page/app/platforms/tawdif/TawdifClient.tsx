'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { GlassCard } from '@/components/ui/GlassCard';
import { GoldButton } from '@/components/ui/GoldButton';
import { GoldBadge } from '@/components/ui/GoldBadge';
import {
  HiOutlineCalendar,
  HiOutlineClipboardList,
  HiOutlineDocumentText,
  HiOutlineAcademicCap,
  HiOutlineUserGroup,
  HiOutlineExclamation,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineExternalLink,
} from 'react-icons/hi';
import type { Platform } from '@/types';

interface TawdifClientProps {
  platform: Platform;
}

/* ── البيانات المحقونة ── */
const COMPETITION = {
  title: 'مسابقة توظيف على أساس الاختبارات — رتب التربية 2026',
  announcement: 'تعلن وزارة التربية الوطنية عن فتح مسابقة توظيف على أساس الاختبارات للالتحاق بالرتب التالية:',
  ranks: [
    'مشرف التربية',
    'مربي متخصص في الدعم التربوي',
    'مستشار محلل للتوجيه والإرشاد المدرسي والمهني',
    'مقتصد',
    'نائب مقتصد',
    'ملحق رئيسي بالمخابر',
    'مستشار التغذية المدرسية',
  ],
  registrationStart: '13 جويلية 2026',
  registrationEnd: '03 أوت 2026',
  writtenExamDate: '26 سبتمبر 2026',
  platformUrl: 'https://tawdif.education.dz/',
};

const TIMELINE = [
  {
    period: 'من 13 جويلية إلى 03 أوت 2026',
    title: 'التسجيل والإيداع الإلكتروني',
    desc: 'التسجيل والإيداع الإلكتروني لملفات الترشح عبر المنصة الرقمية. تتزامن مرحلة إيداع الملفات مع عملية تأكيد ودراسة الملفات إلكترونياً.',
    icon: HiOutlineClipboardList,
    status: 'active' as const,
    color: 'from-green-500 to-emerald-400',
  },
  {
    period: 'قبل 26 سبتمبر 2026',
    title: 'سحب الاستدعاءات',
    desc: 'سحب استدعاءات المترشحين المقبولين.',
    icon: HiOutlineDocumentText,
    status: 'upcoming' as const,
    color: 'from-blue-500 to-cyan-400',
  },
  {
    period: 'يوم 26 سبتمبر 2026',
    title: 'إجراء الاختبارات الكتابية',
    desc: 'يتم إجراء الاختبارات الكتابية على مستوى مراكز الامتحان في الولاية.',
    icon: HiOutlineAcademicCap,
    status: 'upcoming' as const,
    color: 'from-purple-500 to-indigo-400',
  },
  {
    period: 'بعد نتائج الكتابي',
    title: 'سحب استدعاءات الامتحان الشفهي',
    desc: 'نتائج الامتحانات الكتابية — سحب استدعاءات الامتحان الشفهي.',
    icon: HiOutlineDocumentText,
    status: 'upcoming' as const,
    color: 'from-amber-500 to-orange-400',
  },
  {
    period: 'لاحقاً',
    title: 'إجراء الاختبار الشفهي',
    desc: 'يتم إجراء الاختبارات الشفهية على مستوى مراكز الامتحان في الولاية.',
    icon: HiOutlineUserGroup,
    status: 'upcoming' as const,
    color: 'from-rose-500 to-pink-400',
  },
  {
    period: 'لاحقاً',
    title: 'إعلان النتائج النهائية',
    desc: 'إعلان النتائج النهائية للمسابقة.',
    icon: HiOutlineCheckCircle,
    status: 'upcoming' as const,
    color: 'from-teal-500 to-green-400',
  },
];

const REGISTRATION_STEPS = [
  { step: 1, title: 'الشروط', desc: 'الموافقة على الشروط الأساسية للمشاركة.' },
  { step: 2, title: 'الترشح', desc: 'إدخال بيانات الترشح بدقة واختيار الرتبة.' },
  { step: 3, title: 'الحالة المدنية والعائلية', desc: 'ملء المعلومات الشخصية والعائلية للمترشح.' },
  { step: 4, title: 'الشهادة والمسار الدراسي', desc: 'إدخال بيانات الشهادات والمؤهلات.' },
  { step: 5, title: 'الحالة المهنية', desc: 'إدخال الخبرة المهنية إن وجدت.' },
  { step: 6, title: 'التأكيد', desc: 'مراجعة المعلومات وتأكيد الملف نهائياً.' },
];

const GALLERY_IMAGES = [
  { src: '/images/tawdif/tawdif-guide.png', alt: 'الدليل الشامل للتسجيل في منصة التوظيف لقطاع التربية' },
  { src: '/images/tawdif/tawdif-calendar.png', alt: 'رزنامة التسجيل والمتابعة' },
  { src: '/images/tawdif/tawdif-steps.png', alt: 'خطوات التسجيل عبر المنصة' },
  { src: '/images/tawdif/tawdif-rafed.png', alt: 'منصة رافد — المرافق الرقمي لمنظومة التربية الوطنية' },
];

export function TawdifClient({ platform }: TawdifClientProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'guide'>('overview');

  // حساب الأيام المتبقية
  const endDate = new Date('2026-08-03');
  const now = new Date();
  const daysLeft = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  const isOpen = now <= endDate && now >= new Date('2026-07-13');

  return (
    <PageWrapper>
      {/* ── Hero Section ── */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden border-b border-gold-border/20">
        <div className="absolute inset-0 bg-dark-base dark:bg-dark-base bg-[#ffffff] grid-bg" />
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/10 to-transparent dark:from-green-900/20" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center lg:text-right flex-1"
            >
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-6 flex-wrap">
                <GoldBadge className="inline-flex">🎓 مسابقات التوظيف</GoldBadge>
                {isOpen && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 text-sm font-bold animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    التسجيلات مفتوحة الآن
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
                منصة <span className="gold-gradient-text">توظيف</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-white/70 mb-4 leading-relaxed max-w-2xl">
                {platform.description}
              </p>
              {isOpen && (
                <p className="text-base font-bold text-green-600 dark:text-green-400 mb-8">
                  ⏳ متبقي {daysLeft} يوم على انتهاء التسجيلات
                </p>
              )}
              <div className="flex items-center justify-center lg:justify-start gap-4 flex-wrap">
                <a
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3.5 rounded-xl bg-green-600 hover:bg-green-700 text-[#ffffff] font-bold transition-all shadow-lg shadow-green-500/20 flex items-center gap-2"
                >
                  <HiOutlineExternalLink className="text-xl" />
                  الدخول لمنصة توظيف
                </a>
                <GoldButton href={`/issues/new?platform=${platform.id}`} variant="outline">
                  طرح انشغال تقني
                </GoldButton>
              </div>
            </motion.div>

            {/* صورة الدليل الشامل */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-1 w-full max-w-lg hidden md:block"
            >
              <div className="relative rounded-2xl overflow-hidden border border-gold-border/30 shadow-2xl shadow-green-500/10">
                <img
                  src="/images/tawdif/tawdif-guide.png"
                  alt="الدليل الشامل للتسجيل في منصة التوظيف"
                  className="w-full h-auto object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── إعلان عاجل ── */}
      <section className="bg-green-50 dark:bg-green-900/10 border-y border-green-200 dark:border-green-500/20 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start gap-4">
            <div className="flex items-center gap-3 shrink-0">
              <span className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center text-2xl">
                📢
              </span>
              <div>
                <h2 className="text-lg font-bold text-green-800 dark:text-green-300">إعلان رسمي</h2>
                <p className="text-xs text-green-600 dark:text-green-400/70">وزارة التربية الوطنية</p>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-green-900 dark:text-green-200 leading-relaxed">
                {COMPETITION.announcement}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {COMPETITION.ranks.map((rank) => (
                  <span key={rank} className="inline-flex px-3 py-1 rounded-lg bg-green-100 dark:bg-green-800/30 border border-green-200 dark:border-green-700/50 text-green-800 dark:text-green-300 text-xs font-bold">
                    {rank}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Navigation Tabs ── */}
      <section className="bg-white/50 dark:bg-white/5 border-b border-gold-border/20 sticky top-16 md:top-20 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 overflow-x-auto">
            {([
              { id: 'overview' as const, label: 'نظرة عامة', icon: '📋' },
              { id: 'timeline' as const, label: 'رزنامة المسابقة', icon: '📅' },
              { id: 'guide' as const, label: 'دليل التسجيل', icon: '📖' },
            ]).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 font-bold text-sm md:text-base border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-green-600 text-green-700 dark:border-green-400 dark:text-green-400'
                    : 'border-transparent text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white/80'
                }`}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Content Area ── */}
      <section className="py-16 md:py-24 bg-slate-50 dark:bg-transparent min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ══ نظرة عامة ══ */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">

              {/* بطاقات إحصائية */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <GlassCard className="p-6 text-center bg-white dark:bg-dark-surface">
                  <span className="text-4xl block mb-3">🎓</span>
                  <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{COMPETITION.ranks.length}</p>
                  <p className="text-sm text-slate-500 dark:text-white/50 mt-1">رتب مفتوحة للتوظيف</p>
                </GlassCard>
                <GlassCard className="p-6 text-center bg-white dark:bg-dark-surface">
                  <span className="text-4xl block mb-3">📅</span>
                  <p className="text-3xl font-extrabold text-green-600 dark:text-green-400">{daysLeft}</p>
                  <p className="text-sm text-slate-500 dark:text-white/50 mt-1">يوم متبقي للتسجيل</p>
                </GlassCard>
                <GlassCard className="p-6 text-center bg-white dark:bg-dark-surface">
                  <span className="text-4xl block mb-3">✍️</span>
                  <p className="text-xl font-extrabold text-slate-900 dark:text-white">26 سبتمبر</p>
                  <p className="text-sm text-slate-500 dark:text-white/50 mt-1">تاريخ الاختبارات الكتابية</p>
                </GlassCard>
                <GlassCard className="p-6 text-center bg-white dark:bg-dark-surface">
                  <span className="text-4xl block mb-3">🌐</span>
                  <p className="text-xl font-extrabold gold-gradient-text">tawdif.education.dz</p>
                  <p className="text-sm text-slate-500 dark:text-white/50 mt-1">المنصة الرسمية</p>
                </GlassCard>
              </div>

              {/* معرض الصور */}
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-8 text-center">
                  📸 معرض <span className="gold-gradient-text">المستجدات</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {GALLERY_IMAGES.map((img, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="group relative rounded-2xl overflow-hidden border border-gold-border/20 shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <p className="text-[#ffffff] text-sm font-bold">{img.alt}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* ملاحظات هامة */}
              <GlassCard className="p-6 md:p-8 bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-500/20">
                <div className="flex items-start gap-4">
                  <HiOutlineExclamation className="text-3xl text-amber-600 dark:text-amber-400 shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-amber-900 dark:text-amber-300 mb-3">ملاحظات هامة</h3>
                    <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                      <li>• المترشح مسؤول على صحة ودقة المعلومات المصرح بها.</li>
                      <li>• تعتبر كل معلومة غير صحيحة تصريحاً كاذباً يعرض صاحبها للإجراءات القانونية المعمول بها.</li>
                      <li>• العملية تتم بالكامل وحصراً عبر المنصة: <strong>tawdif.education.dz</strong></li>
                      <li>• تتزامن مرحلة إيداع الملفات مع عملية تأكيد ودراسة الملفات إلكترونياً.</li>
                    </ul>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* ══ رزنامة المسابقة ══ */}
          {activeTab === 'timeline' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
                  📅 رزنامة <span className="gold-gradient-text">المسابقة</span>
                </h2>
                <p className="text-slate-600 dark:text-white/60">
                  جميع المراحل والمواعيد المهمة لمسابقة التوظيف 2026
                </p>
              </div>

              {/* صورة الرزنامة */}
              <div className="max-w-3xl mx-auto mb-12 rounded-2xl overflow-hidden border border-gold-border/20 shadow-xl">
                <img
                  src="/images/tawdif/tawdif-calendar.png"
                  alt="رزنامة التسجيل والمتابعة"
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Timeline */}
              <div className="max-w-3xl mx-auto space-y-6">
                {TIMELINE.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`relative flex items-start gap-6 p-6 rounded-2xl border transition-all ${
                      item.status === 'active'
                        ? 'bg-green-50 dark:bg-green-900/10 border-green-300 dark:border-green-500/30 shadow-lg shadow-green-500/10'
                        : 'bg-white dark:bg-dark-surface border-slate-200 dark:border-white/10'
                    }`}
                  >
                    {item.status === 'active' && (
                      <div className="absolute top-4 left-4">
                        <span className="flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
                        </span>
                      </div>
                    )}
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-[#ffffff] text-2xl shrink-0 shadow-lg`}>
                      <item.icon />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h3>
                        {item.status === 'active' && (
                          <span className="text-xs font-bold bg-green-100 dark:bg-green-800/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                            جاري الآن
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 dark:text-white/50 font-bold mb-1">
                        <HiOutlineClock className="inline ml-1" /> {item.period}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-white/60 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ══ دليل التسجيل ══ */}
          {activeTab === 'guide' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
                  📖 دليل <span className="gold-gradient-text">التسجيل</span> خطوة بخطوة
                </h2>
                <p className="text-slate-600 dark:text-white/60">
                  اتبع هذه الخطوات للتسجيل بنجاح في منصة توظيف
                </p>
              </div>

              {/* صورة الخطوات */}
              <div className="max-w-3xl mx-auto mb-12 rounded-2xl overflow-hidden border border-gold-border/20 shadow-xl">
                <img
                  src="/images/tawdif/tawdif-steps.png"
                  alt="خطوات التسجيل عبر المنصة"
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* خطوات التسجيل */}
              <div className="max-w-3xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {REGISTRATION_STEPS.map((step, i) => (
                    <motion.div
                      key={step.step}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <GlassCard className="p-6 h-full bg-white dark:bg-dark-surface hover:shadow-xl hover:-translate-y-1 transition-all">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center text-[#ffffff] text-xl font-extrabold shrink-0 shadow-lg">
                            {step.step}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{step.title}</h3>
                            <p className="text-sm text-slate-600 dark:text-white/60 leading-relaxed">{step.desc}</p>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* شروط المشاركة */}
              <GlassCard className="p-6 md:p-8 max-w-3xl mx-auto bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-500/20">
                <h3 className="text-xl font-bold text-blue-900 dark:text-blue-300 mb-4 flex items-center gap-2">
                  <HiOutlineDocumentText className="text-2xl" /> الشروط والموافقات
                </h3>
                <div className="space-y-3 text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                  <p>• الموافقة على إلغاء التسجيل واتخاذ الإجراءات اللازمة في حالة اكتشاف أي معلومة غير صحيحة أو غير مطابقة للوثائق المرفوعة.</p>
                  <p>• الموافقة على استخدام المعطيات الشخصية من طرف مصالح وزارة التربية الوطنية والديوان الوطني للامتحانات والمسابقات طبقاً لأحكام القانون 18-07 المؤرخ 10 يونيو 2018 المتعلق بحماية الأشخاص الطبيعيين في مجال معالجة المعطيات ذات الطابع الشخصي.</p>
                  <p>• يحق للمترشح الاطلاع على معطياته وطلب تصحيحها أو الاعتراض على معالجتها وفقاً للقانون.</p>
                </div>
              </GlassCard>
            </motion.div>
          )}

        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <GlassCard className="p-8 md:p-12" animate hover={false}>
            <span className="text-5xl block mb-4">🎓</span>
            <h2 className="text-2xl md:text-3xl font-extrabold gold-gradient-text mb-4">
              سجّل الآن في مسابقة التوظيف
            </h2>
            <p className="text-slate-500 dark:text-white/40 mb-8 max-w-lg mx-auto">
              التسجيلات مفتوحة من {COMPETITION.registrationStart} إلى غاية {COMPETITION.registrationEnd}. لا تفوّت الفرصة!
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <a
                href={COMPETITION.platformUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 rounded-xl bg-green-600 hover:bg-green-700 text-[#ffffff] font-bold transition-all shadow-lg shadow-green-500/20 flex items-center gap-2"
              >
                <HiOutlineExternalLink className="text-xl" />
                التسجيل عبر المنصة
              </a>
              <GoldButton href="/issues/new?platform=tawdif" variant="outline">
                هل تواجه مشكلة تقنية؟
              </GoldButton>
            </div>
          </GlassCard>
        </div>
      </section>
    </PageWrapper>
  );
}
