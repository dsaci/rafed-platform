'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { GlassCard } from '@/components/ui/GlassCard';
import { GoldButton } from '@/components/ui/GoldButton';
import { GoldBadge } from '@/components/ui/GoldBadge';
import { HiOutlineDocumentText, HiOutlineDocumentReport, HiOutlineIdentification, HiOutlineMail, HiOutlineBell, HiOutlineUserGroup, HiOutlineRefresh, HiOutlineLogout, HiOutlineTruck, HiOutlineArrowRight, HiOutlineBookOpen, HiOutlineQuestionMarkCircle } from 'react-icons/hi';
import type { Platform, Issue } from '@/types';
import { OSTAD_MODULES_DATA } from './ostad-data';

interface OstadClientProps {
  platform: Platform;
  solvedIssues: Issue[];
}

const MODULES = [
  {
    id: 'pedagogical',
    title: 'وثائقي البيداغوجية',
    desc: 'تحميل الوثائق البيداغوجية (مذكرات، تدرجات سنوية...)',
    icon: HiOutlineDocumentText,
    color: 'from-blue-500 to-cyan-400',
    isNew: false
  },
  {
    id: 'administrative',
    title: 'وثائقي الإدارية',
    desc: 'طلب الوثائق الإدارية (شهادة عمل، مجمل الخدمات...)',
    icon: HiOutlineDocumentReport,
    color: 'from-amber-500 to-orange-400',
    isNew: false
  },
  {
    id: 'data',
    title: 'بياناتي',
    desc: 'عرض البيانات المدنية والوظيفية مع طلب التصحيح',
    icon: HiOutlineIdentification,
    color: 'from-teal-400 to-emerald-400',
    isNew: false
  },
  {
    id: 'concerns',
    title: 'انشغالات',
    desc: 'طرح مختلف الانشغالات',
    icon: HiOutlineMail,
    color: 'from-cyan-400 to-blue-500',
    isNew: false
  },
  {
    id: 'services',
    title: 'الخدمات',
    desc: 'طلب خدمات (إشعار بالغياب، المشاركة في الحركة...)',
    icon: HiOutlineBell,
    color: 'from-indigo-400 to-purple-500',
    isNew: false
  },
  {
    id: 'groups',
    title: 'أفواجي التربوية',
    desc: 'عرض قوائم بيانات التلاميذ، تحميل القوائم، حجز النقاط..',
    icon: HiOutlineUserGroup,
    color: 'from-rose-400 to-pink-500',
    isNew: false
  },
  {
    id: 'exchange',
    title: 'النقل عن طريق التبادل',
    desc: 'إدراج الطلبات، نتائج المعالجة',
    icon: HiOutlineRefresh,
    color: 'from-cyan-300 to-blue-400',
    isNew: true
  },
  {
    id: 'outside',
    title: 'النقل خارج الادارة المستخدمة',
    desc: 'الدخول/الخروج الولائي',
    icon: HiOutlineLogout,
    color: 'from-amber-400 to-orange-500',
    isNew: true
  },
  {
    id: 'movement',
    title: 'الحركة التنقلية السنوية',
    desc: 'المشاركة في الحركة التنقلية',
    icon: HiOutlineTruck,
    color: 'from-blue-500 to-indigo-500',
    isNew: true
  },
  {
    id: 'guides',
    title: 'الشروحات',
    desc: 'مكتبة الشروحات المرئية والمكتوبة لاستخدام المنصة',
    icon: HiOutlineBookOpen,
    color: 'from-emerald-400 to-teal-500',
    isNew: true
  },
  {
    id: 'faq',
    title: 'الأسئلة الشائعة',
    desc: 'إجابات شاملة لأكثر التساؤلات والاشكالات تداولاً',
    icon: HiOutlineQuestionMarkCircle,
    color: 'from-fuchsia-400 to-purple-500',
    isNew: true
  }
];

const ISSUES = [
  {
    title: 'صعوبة الولوج وكلمة المرور',
    problem: 'رسالة "البريد أو رقم التعريف غير صحيح" أو نسيان كلمة المرور.',
    rafedSolution: 'نوفر شروحات لتغيير كلمة المرور إلكترونياً، ونوجه الأستاذ للتأكد من حجز بياناته الصحيحة عبر مدير المؤسسة على النظام المعلوماتي للوزارة.'
  },
  {
    title: 'أخطاء في البيانات المهنية (بياناتي)',
    problem: 'عدم تطابق الدرجة، الرتبة، أو الحالة المدنية.',
    rafedSolution: 'نوضح الخطوات الصحيحة لرفع "طلب تصحيح" عبر المنصة وإرفاق الوثائق الثبوتية لمدير المؤسسة للمصادقة.'
  },
  {
    title: 'مشاكل حجز النقاط (أفواجي التربوية)',
    problem: 'اختفاء قوائم التلاميذ أو غلق مفاجئ لفترة الحجز.',
    rafedSolution: 'نرسل إشعارات فورية عبر رافد بمواعيد الحجز، ونوجه حول كيفية التواصل مع الرقمنة محلياً لفتح المجالات الزمنية.'
  }
];

export function OstadClient({ platform, solvedIssues }: OstadClientProps) {
  const [activeTab, setActiveTab] = useState<'modules' | 'troubleshooting'>('modules');
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const selectedData = selectedModule ? OSTAD_MODULES_DATA[selectedModule] : null;
  const selectedModuleInfo = selectedModule ? MODULES.find(m => m.id === selectedModule) : null;

  return (
    <PageWrapper>
      {/* ── Hero Section ── */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden border-b border-gold-border/20">
        <div className="absolute inset-0 bg-dark-base dark:bg-dark-base bg-[#ffffff] grid-bg" />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-transparent dark:from-blue-900/20" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center lg:text-right flex-1"
            >
              <GoldBadge className="mb-6 inline-flex">بوابة الأستاذ الرسمية</GoldBadge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
                فضاء <span className="gold-gradient-text">الأستاذ</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-white/70 mb-8 leading-relaxed max-w-2xl">
                {platform.description}
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-4 flex-wrap">
                <a 
                  href={platform.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-[#ffffff] font-bold transition-all shadow-lg shadow-blue-500/20"
                >
                  الدخول للمنصة الوزارية
                </a>
                <GoldButton href={`/issues/new?platform=${platform.id}`} variant="outline">
                  طرح انشغال تقني
                </GoldButton>
              </div>
            </motion.div>

            {/* Login Screenshot Mockup */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-1 w-full max-w-lg hidden md:block perspective-1000"
            >
              <div className="relative rounded-2xl overflow-hidden border-4 border-slate-800 dark:border-white/10 shadow-2xl shadow-gold-primary/20 rotate-y-[-10deg] rotate-x-[5deg] hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700">
                <div className="absolute inset-0 bg-gradient-to-tr from-gold-primary/20 to-transparent z-10 pointer-events-none" />
                {/* 
                  ملاحظة: يمكنك وضع صورة الدخول (login) هنا 
                  عن طريق وضعها في مجلد public/images/ostad-login.png
                */}
                <img 
                  src="/images/ostad-login.png" 
                  alt="واجهة الدخول لفضاء الأستاذ" 
                  className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity"
                  onError={(e) => {
                    // Fallback in case image is not found yet
                    e.currentTarget.src = "https://via.placeholder.com/800x600/0d1b2a/F0C040?text=Ostad+Login+Interface";
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Navigation Tabs ── */}
      <section className="bg-white/50 dark:bg-white/5 border-b border-gold-border/20 sticky top-16 md:top-20 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <button
              onClick={() => { setActiveTab('modules'); setSelectedModule(null); }}
              className={`py-4 px-2 font-bold text-sm md:text-base border-b-2 transition-colors ${
                activeTab === 'modules'
                  ? 'border-blue-900 text-blue-900 dark:border-gold-primary dark:text-gold-light'
                  : 'border-transparent text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white/80'
              }`}
            >
              الخدمات والوحدات (11)
            </button>
            <button
              onClick={() => setActiveTab('troubleshooting')}
              className={`py-4 px-2 font-bold text-sm md:text-base border-b-2 transition-colors ${
                activeTab === 'troubleshooting'
                  ? 'border-blue-900 text-blue-900 dark:border-gold-primary dark:text-gold-light'
                  : 'border-transparent text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white/80'
              }`}
            >
              جسر الدعم التقني (رافد)
            </button>
          </div>
        </div>
      </section>

      {/* ── Content Area ── */}
      <section className="py-16 md:py-24 bg-slate-50 dark:bg-transparent min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Modules Grid & Details */}
          {activeTab === 'modules' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              {!selectedModule ? (
                <>
                  {/* Dashboard Visual Reference */}
              <div className="relative rounded-3xl overflow-hidden border border-gold-border/30 shadow-2xl max-w-5xl mx-auto group">
                <div className="absolute inset-0 bg-dark-base/60 backdrop-blur-[2px] z-10 group-hover:backdrop-blur-0 group-hover:bg-transparent transition-all duration-700 flex flex-col items-center justify-center opacity-100 group-hover:opacity-0">
                  <span className="text-4xl mb-4">🔍</span>
                  <p className="text-[#ffffff] font-bold text-lg px-6 py-2 bg-dark-surface/80 rounded-full border border-gold-border/50">مرر الفأرة لرؤية لوحة التحكم الرسمية</p>
                </div>
                <img 
                  src="/images/ostad-dashboard.png" 
                  alt="لوحة تحكم فضاء الأستاذ" 
                  className="w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/1200x800/0d1b2a/F0C040?text=Ostad+Dashboard+Interface";
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MODULES.map((mod, i) => (
                  <GlassCard 
                    key={mod.id} 
                    delay={i * 0.1} 
                    className="p-6 relative overflow-hidden group bg-white dark:bg-dark-surface cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all"
                    onClick={() => setSelectedModule(mod.id)}
                  >
                    {mod.isNew && (
                      <div className="absolute top-4 left-4 bg-red-500 text-[#ffffff] text-[10px] font-bold px-2 py-1 rounded">
                        جديد
                      </div>
                    )}
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${mod.color} flex items-center justify-center text-[#ffffff] text-2xl mb-6 shadow-lg shadow-current/20 group-hover:scale-110 transition-transform`}>
                      <mod.icon />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{mod.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-white/60 leading-relaxed">{mod.desc}</p>
                  </GlassCard>
                ))}
              </div>
              </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-4xl mx-auto"
                >
                  <button 
                    onClick={() => setSelectedModule(null)}
                    className="flex items-center gap-2 text-slate-500 dark:text-white/50 hover:text-gold-primary mb-8 transition-colors font-bold"
                  >
                    <HiOutlineArrowRight className="text-xl" /> عودة للخدمات
                  </button>

                  {selectedModuleInfo && selectedData && (
                    <div className="space-y-8">
                      {/* Header */}
                      <div className="flex items-center gap-4 border-b border-gold-border/20 pb-6">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedModuleInfo.color} flex items-center justify-center text-[#ffffff] text-3xl shadow-lg`}>
                          <selectedModuleInfo.icon />
                        </div>
                        <div>
                          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">{selectedModuleInfo.title}</h2>
                          <p className="text-slate-600 dark:text-white/60">{selectedModuleInfo.desc}</p>
                        </div>
                      </div>

                      {/* Usage Guide */}
                      {selectedData.usageGuide.length > 0 && (
                        <GlassCard className="p-6 md:p-8 bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-500/20">
                          <h3 className="text-xl font-bold text-blue-900 dark:text-blue-300 mb-4 flex items-center gap-2">
                            <span>📖</span> دليل الاستخدام
                          </h3>
                          <ul className="space-y-3">
                            {selectedData.usageGuide.map((step, i) => (
                              <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-white/80">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 flex items-center justify-center text-xs font-bold mt-0.5">{i + 1}</span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ul>
                        </GlassCard>
                      )}

                      {/* Issues Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Solved */}
                        {selectedData.solvedIssues.length > 0 && (
                          <div className="space-y-4">
                            <h4 className="font-bold text-green-600 dark:text-green-400 flex items-center gap-2"><span>✅</span> حلول شائعة (محلولة)</h4>
                            {selectedData.solvedIssues.map((issue, i) => (
                              <GlassCard key={i} className="p-4 border-l-4 border-l-green-500 bg-white dark:bg-dark-surface hover:shadow-md transition-shadow">
                                <h5 className="font-bold text-sm mb-1 text-slate-900 dark:text-white">{issue.title}</h5>
                                <p className="text-xs text-slate-600 dark:text-white/60">{issue.desc}</p>
                              </GlassCard>
                            ))}
                          </div>
                        )}

                        {/* Tracked */}
                        {selectedData.trackedIssues.length > 0 && (
                          <div className="space-y-4">
                            <h4 className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2"><span>🔍</span> إشكالات قيد المتابعة</h4>
                            {selectedData.trackedIssues.map((issue, i) => (
                              <GlassCard key={i} className="p-4 border-l-4 border-l-blue-500 bg-white dark:bg-dark-surface hover:shadow-md transition-shadow">
                                <h5 className="font-bold text-sm mb-1 text-slate-900 dark:text-white">{issue.title}</h5>
                                <p className="text-xs text-slate-600 dark:text-white/60">{issue.desc}</p>
                              </GlassCard>
                            ))}
                          </div>
                        )}

                        {/* Pending */}
                        {selectedData.pendingIssues.length > 0 && (
                          <div className="space-y-4">
                            <h4 className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2"><span>⏳</span> حلول قيد الدراسة</h4>
                            {selectedData.pendingIssues.map((issue, i) => (
                              <GlassCard key={i} className="p-4 border-l-4 border-l-amber-500 bg-white dark:bg-dark-surface hover:shadow-md transition-shadow">
                                <h5 className="font-bold text-sm mb-1 text-slate-900 dark:text-white">{issue.title}</h5>
                                <p className="text-xs text-slate-600 dark:text-white/60">{issue.desc}</p>
                              </GlassCard>
                            ))}
                          </div>
                        )}

                        {/* Escalated */}
                        {selectedData.escalatedIssues.length > 0 && (
                          <div className="space-y-4">
                            <h4 className="font-bold text-red-600 dark:text-red-400 flex items-center gap-2"><span>🏛️</span> مرفوعة للوصاية</h4>
                            {selectedData.escalatedIssues.map((issue, i) => (
                              <GlassCard key={i} className="p-4 border-l-4 border-l-red-500 bg-white dark:bg-dark-surface hover:shadow-md transition-shadow">
                                <h5 className="font-bold text-sm mb-1 text-slate-900 dark:text-white">{issue.title}</h5>
                                <p className="text-xs text-slate-600 dark:text-white/60">{issue.desc}</p>
                              </GlassCard>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Troubleshooting Bridge */}
          {activeTab === 'troubleshooting' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
                  جسر <span className="gold-gradient-text">رافد</span> للدعم التقني
                </h2>
                <p className="text-slate-600 dark:text-white/60">
                  نقوم بتشخيص أعطال ومشاكل "فضاء الأستاذ" ونوفر حلولاً عملية فورية بناءً على توجيهات النظام المعلوماتي لوزارة التربية.
                </p>
              </div>

              {ISSUES.map((issue, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-none"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2 text-red-500 dark:text-red-400 font-bold mb-2">
                        <span className="text-xl">⚠️</span> المشكلة الشائعة
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{issue.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-white/60">{issue.problem}</p>
                    </div>
                    
                    <div className="hidden md:block w-px bg-slate-200 dark:bg-white/10" />
                    <div className="md:hidden h-px bg-slate-200 dark:bg-white/10" />

                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold mb-2">
                        <span className="text-xl">💡</span> حل رافد
                      </div>
                      <p className="text-sm text-slate-700 dark:text-white/80 leading-relaxed bg-green-50 dark:bg-green-500/10 p-4 rounded-xl border border-green-100 dark:border-green-500/20">
                        {issue.rafedSolution}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              <div className="mt-12 text-center">
                <GlassCard className="p-8 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-500/20">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">هل تواجه مشكلة أخرى غير مذكورة؟</h3>
                  <p className="text-slate-600 dark:text-white/60 mb-6">فريق رافد التقني مستعد لتشخيص المشكلة ومرافقتك خطوة بخطوة.</p>
                  <GoldButton href={`/issues/new?platform=${platform.id}`}>
                    فتح تذكرة دعم مخصصة
                  </GoldButton>
                </GlassCard>
              </div>
            </motion.div>
          )}

        </div>
      </section>
    </PageWrapper>
  );
}

