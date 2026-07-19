'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { GlassCard } from '@/components/ui/GlassCard';
import { GoldButton } from '@/components/ui/GoldButton';
import { HiOutlineCalendar, HiOutlineDesktopComputer, HiOutlineShieldCheck, HiOutlineCheckCircle, HiOutlineClock, HiOutlineUserGroup, HiOutlineExclamationCircle } from 'react-icons/hi';

const STEPS = [
  { id: 1, title: 'الموعد', icon: HiOutlineCalendar },
  { id: 2, title: 'التفاصيل', icon: HiOutlineUserGroup },
  { id: 3, title: 'معلومات AnyDesk', icon: HiOutlineDesktopComputer },
  { id: 4, title: 'الشروط والالتزام', icon: HiOutlineShieldCheck },
];

const AVAILABLE_TIMES = ['09:00', '10:30', '13:00', '14:30', '16:00'];

export function BookingClient() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);

  // Form State
  const [availableDays, setAvailableDays] = useState<{date: string, label: string, fullLabel: string}[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  useEffect(() => {
    const days = [];
    const today = new Date();
    let current = new Date(today);
    current.setDate(current.getDate() + 1); // تبدأ المواعيد من الغد
    
    while(days.length < 4) {
      const dayOfWeek = current.getDay();
      // استثناء الجمعة (5) والسبت (6)
      if (dayOfWeek !== 5 && dayOfWeek !== 6) {
        const dateStr = current.toISOString().split('T')[0];
        const label = new Intl.DateTimeFormat('ar-DZ', { weekday: 'long' }).format(current);
        const fullLabel = new Intl.DateTimeFormat('ar-DZ', { weekday: 'long', day: 'numeric', month: 'long' }).format(current);
        days.push({ date: dateStr, label, fullLabel });
      }
      current.setDate(current.getDate() + 1);
    }
    setAvailableDays(days);
  }, []);
  const [platform, setPlatform] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [anyDeskId, setAnyDeskId] = useState('');
  const [agreedDisclaimer, setAgreedDisclaimer] = useState(false);
  const [agreedCommitment, setAgreedCommitment] = useState(false);

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep(c => c + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(c => c - 1);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // محاكاة إرسال البيانات
    setTimeout(() => {
      const generatedId = `ANYDESK-${Math.floor(1000 + Math.random() * 9000)}`;
      setTicketId(generatedId);
      
      // Save to localStorage for Admin Demo
      try {
        const newBooking = {
          id: generatedId,
          date: selectedDate,
          time: selectedTime,
          platform,
          description,
          phone,
          anyDeskId,
          status: 'pending',
          created_at: new Date().toISOString()
        };
        const stored = localStorage.getItem('demo_submitted_bookings');
        const prev = stored ? JSON.parse(stored) : [];
        localStorage.setItem('demo_submitted_bookings', JSON.stringify([newBooking, ...prev]));
      } catch (e) {}

      setIsSubmitting(false);
      setCurrentStep(5);
    }, 1500);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return selectedDate !== '' && selectedTime !== '';
      case 2: return platform !== '' && description.length >= 10 && phone !== '';
      case 3: return anyDeskId === '' || anyDeskId.length >= 9; // اختياري ولكن إذا أدخل يجب أن يكون 9 أرقام
      case 4: return agreedDisclaimer && agreedCommitment;
      default: return true;
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 min-h-[80vh]">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
            حجز موعد <span className="gold-gradient-text">للدعم عن بعد</span>
          </h1>
          <p className="text-slate-600 dark:text-white/60">
            سنقوم بالاتصال بجهازك عبر AnyDesk لحل المشكلة المعقدة أمامك.
          </p>
        </div>

        {/* Stepper (Only show if not on success step) */}
        {currentStep < 5 && (
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-white/10 rounded-full z-0" />
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gold-primary rounded-full z-0 transition-all duration-500" 
                style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }} 
              />
              
              {STEPS.map((step) => {
                const isActive = step.id === currentStep;
                const isPassed = step.id < currentStep;
                return (
                  <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                      isActive ? 'bg-gold-primary text-dark-base border-4 border-dark-base shadow-gold-glow' :
                      isPassed ? 'bg-gold-light text-dark-base' :
                      'bg-slate-200 dark:bg-dark-surface text-slate-500 border-2 border-slate-300 dark:border-white/20'
                    }`}>
                      {isPassed ? <HiOutlineCheckCircle className="text-xl" /> : step.id}
                    </div>
                    <span className={`text-xs font-bold hidden sm:block ${isActive || isPassed ? 'text-gold-primary' : 'text-slate-500'}`}>
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Content Area */}
        <GlassCard className="p-6 md:p-10 bg-white dark:bg-dark-surface shadow-xl">
          <AnimatePresence mode="wait">
            {/* ══ STEP 1: DATE & TIME ══ */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-3 text-gold-primary mb-6">
                  <HiOutlineCalendar className="text-3xl" />
                  <h2 className="text-xl font-bold">متى يناسبك الموعد؟</h2>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700 dark:text-white/80">1. اختر اليوم:</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {availableDays.map(day => (
                      <button
                        key={day.date}
                        onClick={() => setSelectedDate(day.date)}
                        className={`p-4 rounded-xl border transition-all text-center ${
                          selectedDate === day.date 
                            ? 'bg-gold-primary/10 border-gold-primary text-gold-primary dark:text-gold-light font-bold shadow-md' 
                            : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/10'
                        }`}
                      >
                        <span className="block text-lg mb-1">📅</span>
                        {day.fullLabel}
                      </button>
                    ))}
                  </div>
                </div>

                <AnimatePresence>
                  {selectedDate && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4 pt-4 border-t border-slate-200 dark:border-white/10"
                    >
                      <label className="block text-sm font-bold text-slate-700 dark:text-white/80">2. اختر التوقيت المتاح:</label>
                      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                        {AVAILABLE_TIMES.map(time => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`py-3 rounded-xl border transition-all text-center font-bold ${
                              selectedTime === time 
                                ? 'bg-gold-primary text-dark-base shadow-gold-glow border-gold-primary' 
                                : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/60 hover:border-gold-primary/50'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* ══ STEP 2: DETAILS ══ */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 text-gold-primary mb-6">
                  <HiOutlineUserGroup className="text-3xl" />
                  <h2 className="text-xl font-bold">تفاصيل المشكلة والاتصال</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-white/80 mb-2">في أي منصة تواجه المشكلة؟</label>
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-gold-primary focus:ring-1 focus:ring-gold-primary outline-none"
                    >
                      <option value="">-- اختر المنصة --</option>
                      <option value="ostad">فضاء الأستاذ</option>
                      <option value="tawdif">منصة توظيف</option>
                      <option value="awlyaa">فضاء الأولياء</option>
                      <option value="other">منصة أخرى</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-white/80 mb-2">وصف المشكلة بإيجاز</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="مثال: لا أستطيع طباعة شهادة العمل رغم ظهورها في الشاشة..."
                      rows={3}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-gold-primary focus:ring-1 focus:ring-gold-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-white/80 mb-2">رقم الهاتف للتواصل أثناء الموعد</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="05..."
                      dir="ltr"
                      className="w-full text-right bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-gold-primary focus:ring-1 focus:ring-gold-primary outline-none"
                    />
                    <p className="text-xs text-slate-500 mt-2">سيتصل بك التقني هاتفياً في نفس توقيت الموعد ليوجهك.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══ STEP 3: ANYDESK ══ */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 text-blue-500 mb-6">
                  <HiOutlineDesktopComputer className="text-3xl" />
                  <h2 className="text-xl font-bold">معلومات برنامج AnyDesk</h2>
                </div>

                <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4 md:p-6 text-sm text-blue-800 dark:text-blue-200 leading-relaxed mb-6">
                  <p className="mb-2"><strong>ما هو AnyDesk؟</strong></p>
                  <p className="mb-4">هو برنامج آمن يسمح لفريق الدعم برؤية شاشتك والتحكم بحاسوبك مؤقتاً لحل المشكلة.</p>
                  <a href="https://anydesk.com/en/downloads" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors">
                    تحميل البرنامج (إذا لم يكن لديك)
                  </a>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-white/80 mb-2">عنوان الـ AnyDesk الخاص بك (اختياري الآن)</label>
                  <input
                    type="text"
                    value={anyDeskId}
                    onChange={(e) => setAnyDeskId(e.target.value.replace(/\D/g, '').substring(0, 9))}
                    placeholder="مثال: 123456789"
                    dir="ltr"
                    className="w-full text-center text-xl tracking-[0.2em] bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-4 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                  <p className="text-xs text-slate-500 mt-2 text-center">يمكنك تركه فارغاً وتزويد التقني به أثناء المكالمة الهاتفية في الموعد المحدّد.</p>
                </div>
              </motion.div>
            )}

            {/* ══ STEP 4: DISCLAIMER & COMMITMENT ══ */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 text-red-500 mb-6">
                  <HiOutlineShieldCheck className="text-3xl" />
                  <h2 className="text-xl font-bold">الشروط القانونية والالتزام بالموعد</h2>
                </div>

                {/* 1. Legal Disclaimer */}
                <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 md:p-6 mb-4">
                  <h3 className="font-bold text-slate-800 dark:text-white mb-2">1. إخلاء المسؤولية القانونية</h3>
                  <p className="text-sm text-slate-600 dark:text-white/60 leading-relaxed mb-4">
                    بموافقتك، أنت تمنح تفويضاً مؤقتاً لفريق دعم &quot;رافد&quot; للدخول إلى جهاز الحاسوب الخاص بك. لا يتحمل فريقنا أي مسؤولية قانونية أو تقنية عن أي فقدان للبيانات الشخصية أو أضرار غير متعلقة ببرنامج التدخل المباشر في المنصات التربوية. يتم إغلاق الجلسة فور انتهاء المهمة ولا يمكننا الدخول مجدداً دون إذنك.
                  </p>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center mt-0.5">
                      <input 
                        type="checkbox" 
                        className="peer sr-only"
                        checked={agreedDisclaimer}
                        onChange={(e) => setAgreedDisclaimer(e.target.checked)}
                      />
                      <div className="w-5 h-5 rounded border-2 border-slate-300 dark:border-white/30 peer-checked:bg-red-500 peer-checked:border-red-500 transition-colors" />
                      <HiOutlineCheckCircle className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-sm font-bold text-slate-700 dark:text-white/80 group-hover:text-red-500 transition-colors">
                      قرأت وفهمت الشروط وأوافق على منح صلاحية الدخول المؤقت لجهازي.
                    </span>
                  </label>
                </div>

                {/* 2. Time Commitment (User Requested Addition) */}
                <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4 md:p-6">
                  <h3 className="font-bold text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-2">
                    <HiOutlineExclamationCircle className="text-lg" />
                    2. الالتزام الصارم بالموعد المحجوز
                  </h3>
                  <p className="text-sm text-amber-700 dark:text-amber-200/80 leading-relaxed mb-4">
                    لقد قمت بحجز موعد يوم <strong className="text-amber-900 dark:text-amber-100 bg-amber-200 dark:bg-amber-900/50 px-2 rounded mx-1">{availableDays.find(d => d.date === selectedDate)?.fullLabel}</strong> على الساعة <strong className="text-amber-900 dark:text-amber-100 bg-amber-200 dark:bg-amber-900/50 px-2 rounded mx-1">{selectedTime}</strong>. 
                    <br/>
                    هذا الوقت مخصص لك خصيصاً وسيتم تجميد عمل التقني لانتظارك. التخلف عن الموعد سيؤدي إلى حرمان مستخدمين آخرين من الدعم، وقد يعرض حسابك لعدم قبول طلبات حجز مستقبلية.
                  </p>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center mt-0.5">
                      <input 
                        type="checkbox" 
                        className="peer sr-only"
                        checked={agreedCommitment}
                        onChange={(e) => setAgreedCommitment(e.target.checked)}
                      />
                      <div className="w-5 h-5 rounded border-2 border-slate-300 dark:border-white/30 peer-checked:bg-amber-500 peer-checked:border-amber-500 transition-colors" />
                      <HiOutlineCheckCircle className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-sm font-bold text-slate-700 dark:text-white/80 group-hover:text-amber-500 transition-colors">
                      أتعهد شخصياً بالتواجد أمام جهازي في الموعد المحدد وفتح برنامج AnyDesk واستقبال مكالمة الدعم التقني.
                    </span>
                  </label>
                </div>
              </motion.div>
            )}

            {/* ══ STEP 5: SUCCESS TICKET ══ */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-6"
              >
                <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <HiOutlineCheckCircle className="text-6xl" />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">تم تأكيد الموعد بنجاح!</h2>
                <p className="text-slate-600 dark:text-white/60 max-w-md mx-auto leading-relaxed">
                  تم حجز تذكرتك. يرجى تجهيز جهازك وبرنامج AnyDesk قبل الموعد بـ 5 دقائق.
                </p>
                
                <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 max-w-sm mx-auto my-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-gold-primary to-gold-light" />
                  <p className="text-xs text-slate-500 mb-1">رقم التذكرة</p>
                  <p className="text-2xl font-mono font-bold text-slate-900 dark:text-white mb-4">{ticketId}</p>
                  
                  <div className="flex items-center justify-between text-sm text-slate-600 dark:text-white/80 border-t border-slate-200 dark:border-white/10 pt-4">
                    <span><HiOutlineCalendar className="inline mr-1"/> {availableDays.find(d => d.date === selectedDate)?.label}</span>
                    <span><HiOutlineClock className="inline mr-1"/> {selectedTime}</span>
                  </div>
                </div>

                <GoldButton href="/services/support">
                  العودة لمركز الدعم
                </GoldButton>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          {currentStep < 5 && (
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-200 dark:border-white/10">
              <button
                onClick={handleBack}
                disabled={currentStep === 1 || isSubmitting}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  currentStep === 1 
                    ? 'text-transparent cursor-default' 
                    : 'text-slate-600 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/10'
                }`}
              >
                رجوع
              </button>

              {currentStep < 4 ? (
                <button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className={`px-8 py-2.5 rounded-xl font-bold transition-all ${
                    isStepValid()
                      ? 'bg-gold-primary text-dark-base hover:bg-gold-light hover:shadow-gold-glow'
                      : 'bg-slate-200 dark:bg-white/10 text-slate-400 dark:text-white/30 cursor-not-allowed'
                  }`}
                >
                  التالي
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!isStepValid() || isSubmitting}
                  className={`flex items-center gap-2 px-8 py-2.5 rounded-xl font-bold transition-all ${
                    isStepValid() && !isSubmitting
                      ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-500/20'
                      : 'bg-slate-200 dark:bg-white/10 text-slate-400 dark:text-white/30 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      جاري التأكيد...
                    </>
                  ) : (
                    'تأكيد الموعد نهائياً'
                  )}
                </button>
              )}
            </div>
          )}
        </GlassCard>
      </div>
    </PageWrapper>
  );
}
