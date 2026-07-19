'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { GoldButton } from '@/components/ui/GoldButton';
import { HiOutlineLightBulb, HiOutlineChatAlt2, HiOutlineSearch, HiOutlineExclamationCircle, HiOutlineArrowRight } from 'react-icons/hi';
import { getPlatformIcon } from '@/lib/icons';
import type { Platform } from '@/types';

// Simulated AI responses based on common keywords
const KNOWLEDGE_BASE: Record<string, string[]> = {
  'كلمة المرور': ['تأكد من كتابة كلمة المرور باللغة الإنجليزية', 'اضغط على نسيت كلمة المرور من واجهة المنصة', 'تأكد من عدم تشغيل زر Caps Lock'],
  'الحساب': ['إذا تم تجميد حسابك يرجى مراجعة الإدارة المختصة', 'تأكد من تفعيل الحساب عبر بريدك الإلكتروني'],
  'التحميل': ['تأكد من اتصالك بالإنترنت', 'حاول مسح الكاش (Cache) للمتصفح عبر الضغط على Ctrl+F5'],
  'البيانات': ['قد تحتاج الإحصائيات لبعض الوقت لتتحدث تلقائياً', 'تأكد من حفظ التغييرات قبل الخروج'],
};

interface Props {
  platforms: Platform[];
}

export function SmartDiagnosisClient({ platforms }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  const handleAnalyze = () => {
    if (!problemDescription.trim()) return;
    setIsAnalyzing(true);
    setStep(3);
    
    // Simulate AI Analysis
    setTimeout(() => {
      let found = false;
      const suggestions = [];
      for (const [key, tips] of Object.entries(KNOWLEDGE_BASE)) {
        if (problemDescription.includes(key)) {
          suggestions.push(...tips);
          found = true;
        }
      }
      
      if (!found) {
        suggestions.push('يبدو أن هذه المشكلة تتطلب تدخلاً تقنياً مخصصاً.');
        suggestions.push('يرجى تحويل هذا الاستعلام إلى تذكرة دعم ليقوم فريقنا بالتحقق منها.');
      }
      
      setAiSuggestions(suggestions);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleConvertToTicket = () => {
    const params = new URLSearchParams();
    if (selectedPlatform) params.set('platform', selectedPlatform);
    if (problemDescription) params.set('title', problemDescription.substring(0, 50));
    router.push(`/issues/new?${params.toString()}`);
  };

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold-primary/10 text-gold-primary mb-6 ring-1 ring-gold-primary/20">
            <span className="text-3xl">🤖</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            التشخيص <span className="gold-gradient-text">الذكي</span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-white/60 max-w-2xl mx-auto">
            مساعدك الآلي لحل المشاكل التقنية في ثوانٍ. دعنا نشخص المشكلة قبل رفع تذكرة الدعم.
          </p>
        </div>

        {/* Wizard Progress */}
        <div className="flex items-center justify-center mb-12 relative max-w-2xl mx-auto">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-100 dark:bg-white/5 rounded-full z-0" />
          <div 
            className="absolute right-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-l from-gold-primary to-gold-light rounded-full z-0 transition-all duration-500"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          />
          
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex-1 flex justify-center z-10">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all duration-300 ${
                step >= num 
                  ? 'bg-white dark:bg-dark-surface border-gold-primary text-gold-light shadow-[0_0_15px_rgba(212,175,55,0.3)]' 
                  : 'bg-white dark:bg-dark-base border-slate-300 dark:border-white/10 text-slate-500 dark:text-white/40'
              }`}>
                {num}
              </div>
            </div>
          ))}
        </div>

        {/* Wizard Content */}
        <div className="bg-white dark:bg-dark-surface border border-gold-border/30 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-primary/5 rounded-full blur-[80px] pointer-events-none" />

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">أين تواجه المشكلة؟</h2>
                  <p className="text-slate-500 dark:text-white/50">اختر المنصة التي تريد تشخيص حالتها</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {platforms.map((platform) => {
                    const isSelected = selectedPlatform === platform.id;
                    const { icon: Icon, color, bgColor, category } = getPlatformIcon(platform.id);
                    return (
                      <button
                        key={platform.id}
                        onClick={() => setSelectedPlatform(platform.id)}
                        className={`p-4 rounded-2xl border text-right transition-all duration-200 flex items-center gap-4 ${
                          isSelected 
                            ? 'bg-gold-primary/10 border-gold-primary text-slate-900 dark:text-white shadow-[0_0_15px_rgba(212,175,55,0.15)] scale-[1.02]' 
                            : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-600 dark:text-white/70 hover:bg-slate-200 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/10'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? 'bg-gold-primary text-dark-base' : bgColor + ' ' + color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 truncate">
                          <div className="font-bold truncate">{platform.name}</div>
                          <div className="text-xs opacity-60 truncate">{category || platform.category}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-end pt-6 mt-8 border-t border-slate-200 dark:border-white/5">
                  <GoldButton 
                    onClick={() => setStep(2)} 
                    disabled={!selectedPlatform}
                  >
                    التالي <HiOutlineArrowRight className="mr-2 inline" />
                  </GoldButton>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">ما هي المشكلة بالتحديد؟</h2>
                  <p className="text-slate-500 dark:text-white/50">صف لنا المشكلة التي تواجهها لنتمكن من مساعدتك</p>
                </div>

                <div className="space-y-4">
                  <textarea
                    value={problemDescription}
                    onChange={(e) => setProblemDescription(e.target.value)}
                    placeholder="مثال: لا أستطيع تسجيل الدخول إلى فضاء الأستاذ وتظهر لي رسالة كلمة المرور خاطئة..."
                    className="w-full h-40 bg-white dark:bg-dark-base border border-slate-300 dark:border-white/10 rounded-2xl p-5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:border-gold-primary focus:ring-1 focus:ring-gold-primary transition-all resize-none"
                  />
                  
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-slate-500 dark:text-white/50 px-2 py-1">مقترحات شائعة:</span>
                    {['نسيت كلمة المرور', 'لا توجد بيانات', 'مشكلة في التحميل', 'الحساب مقفل'].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setProblemDescription(prev => prev ? prev + ' ' + tag : tag)}
                        className="text-xs bg-slate-100 dark:bg-white/5 hover:bg-gold-primary/20 hover:text-gold-light border border-slate-300 dark:border-white/10 hover:border-gold-primary/30 text-slate-600 dark:text-white/70 px-3 py-1.5 rounded-full transition-all"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-6 mt-8 border-t border-slate-200 dark:border-white/5">
                  <button 
                    onClick={() => setStep(1)}
                    className="px-6 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 text-slate-600 dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    رجوع
                  </button>
                  <GoldButton 
                    onClick={handleAnalyze}
                    disabled={problemDescription.length < 5}
                  >
                    تشخيص <HiOutlineSearch className="mr-2 inline" />
                  </GoldButton>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                {isAnalyzing ? (
                  <div className="py-20 flex flex-col items-center justify-center space-y-6">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <div className="absolute inset-0 border-4 border-slate-100 dark:border-white/5 rounded-full" />
                      <div className="absolute inset-0 border-4 border-gold-primary border-t-transparent rounded-full animate-spin" />
                      <span className="text-3xl animate-pulse">🤖</span>
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">جاري تحليل المشكلة...</h3>
                      <p className="text-slate-500 dark:text-white/50">يقوم الذكاء الاصطناعي بالبحث في قاعدة المعرفة</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 text-green-400 mb-4">
                        <HiOutlineLightBulb className="w-8 h-8" />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">نتائج التشخيص</h2>
                      <p className="text-slate-500 dark:text-white/50">بناءً على المعطيات، إليك الحلول المقترحة:</p>
                    </div>

                    <div className="space-y-4">
                      {aiSuggestions.map((suggestion, index) => (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          key={index}
                          className="p-5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 flex items-start gap-4"
                        >
                          <div className="mt-1 w-6 h-6 rounded-full bg-gold-primary/20 text-gold-light flex items-center justify-center shrink-0">
                            {index + 1}
                          </div>
                          <p className="text-slate-700 dark:text-white/80 leading-relaxed">{suggestion}</p>
                        </motion.div>
                      ))}
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 mt-8">
                      <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                        <HiOutlineChatAlt2 className="w-6 h-6" />
                      </div>
                      <div className="flex-1 text-center sm:text-right">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-1">لم تُحل المشكلة بعد؟</h4>
                        <p className="text-sm text-slate-500 dark:text-white/60">يمكنك تحويل هذا التشخيص إلى تذكرة دعم وسيقوم فريقنا بمتابعتها فوراً.</p>
                      </div>
                      <GoldButton onClick={handleConvertToTicket} variant="outline" className="shrink-0 bg-blue-500/10 border-blue-500/30 text-blue-300 hover:bg-blue-500/20 hover:text-blue-200">
                        تحويل إلى تذكرة <HiOutlineExclamationCircle className="mr-2 inline" />
                      </GoldButton>
                    </div>

                    <div className="flex justify-center pt-4">
                      <button 
                        onClick={() => { setStep(1); setProblemDescription(''); }}
                        className="text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white text-sm underline underline-offset-4 transition-colors"
                      >
                        إجراء تشخيص جديد
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageWrapper>
  );
}

