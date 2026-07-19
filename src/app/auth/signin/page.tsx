/* ═══════════════════════════════
   رافد — تسجيل الدخول
   ═══════════════════════════════ */

'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineLockClosed, HiOutlineAtSymbol } from 'react-icons/hi';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/ToastProvider';

/* ── Animated floating particles ── */
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-gold-primary/30"
          initial={{
            x: `${20 + i * 15}%`,
            y: '110%',
            opacity: 0,
          }}
          animate={{
            y: '-10%',
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            delay: i * 1.5,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

/* ── Sign-in Form (needs Suspense for useSearchParams) ── */
function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const callbackUrl = searchParams.get('callbackUrl') || searchParams.get('redirect') || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('يرجى إدخال البريد الإلكتروني');
      return;
    }
    if (!password) {
      setError('يرجى إدخال كلمة المرور');
      return;
    }

    setLoading(true);
    try {
      // ─────────────────────────────────────────────────────────────
      // Demo Mode Bypass (للتجريب المحلي بدون قاعدة بيانات فعلية)
      // ─────────────────────────────────────────────────────────────
      if (email.trim() === 'admin@rafed.dz' && password === 'admin123') {
        document.cookie = "demo_admin=true; path=/; max-age=86400";
        addToast('success', 'تم الدخول بوضعية التجريب (المدير)');
        router.refresh();
        router.push(callbackUrl);
        return;
      }

      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        // Map common Supabase errors to Arabic messages
        const errorMap: Record<string, string> = {
          'Invalid login credentials': 'بريد إلكتروني أو كلمة مرور غير صحيحة',
          'Email not confirmed': 'لم يتم تأكيد البريد الإلكتروني بعد',
          'Too many requests': 'محاولات كثيرة جداً، يرجى المحاولة لاحقاً',
          'User not found': 'لا يوجد حساب بهذا البريد الإلكتروني',
        };
        throw new Error(errorMap[authError.message] || 'حدث خطأ أثناء تسجيل الدخول');
      }

      addToast('success', 'تم تسجيل الدخول بنجاح');
      router.refresh();
      router.push(callbackUrl);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'حدث خطأ غير متوقع';
      setError(message);
      addToast('error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Email field */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-slate-600 dark:text-white/70">
          البريد الإلكتروني
        </label>
        <div className="relative">
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gold-primary/60">
            <HiOutlineAtSymbol className="w-5 h-5" />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); }}
            placeholder="example@rafed.dz"
            dir="ltr"
            className="w-full pr-12 pl-4 py-3.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-gold-border text-slate-900 dark:text-white placeholder:text-slate-400 dark:text-white/20 focus:outline-none focus:border-gold-primary/60 focus:bg-white/[0.08] transition-all duration-300 text-right"
            autoComplete="email"
          />
        </div>
      </div>

      {/* Password field */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Link
            href="/auth/forgot-password"
            className="text-xs text-gold-primary/70 hover:text-gold-light transition-colors"
          >
            نسيت كلمة المرور؟
          </Link>
          <label className="block text-sm font-bold text-slate-600 dark:text-white/70">
            كلمة المرور
          </label>
        </div>
        <div className="relative">
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gold-primary/60">
            <HiOutlineLockClosed className="w-5 h-5" />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            placeholder="••••••••"
            dir="ltr"
            className="w-full pr-12 pl-12 py-3.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-gold-border text-slate-900 dark:text-white placeholder:text-slate-400 dark:text-white/20 focus:outline-none focus:border-gold-primary/60 focus:bg-white/[0.08] transition-all duration-300 text-right"
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30 hover:text-slate-500 dark:text-white/60 transition-colors text-sm"
            tabIndex={-1}
          >
            {showPassword ? 'إخفاء' : 'إظهار'}
          </button>
        </div>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30">
              <span className="text-red-400 text-lg">✕</span>
              <p className="text-sm text-red-300 flex-1">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit button */}
      <motion.button
        type="submit"
        disabled={loading}
        whileTap={{ scale: 0.97 }}
        className="w-full py-3.5 rounded-2xl font-bold text-base transition-all duration-300 bg-gradient-to-l from-gold-primary to-gold-light text-dark-base hover:shadow-gold-hover hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>جارٍ تسجيل الدخول...</span>
          </>
        ) : (
          <>
            <HiOutlineLockClosed className="w-5 h-5" />
            <span>تسجيل الدخول</span>
          </>
        )}
      </motion.button>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-300 dark:border-white/10" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-4 bg-white dark:bg-dark-surface text-slate-400 dark:text-white/30">أو</span>
        </div>
      </div>

      {/* Sign up link */}
      <div className="text-center">
        <p className="text-sm text-slate-500 dark:text-white/40">
          ليس لديك حساب؟{' '}
          <Link
            href="/auth/signup"
            className="text-gold-primary hover:text-gold-light font-bold transition-colors"
          >
            إنشاء حساب جديد
          </Link>
        </p>
      </div>
    </form>
  );
}

/* ── Page Component ── */
export default function SignInPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-base relative flex items-center justify-center py-12 px-4" dir="rtl">
      {/* Background effects */}
      <div className="absolute inset-0 hero-gradient opacity-40" />
      <div className="absolute inset-0 grid-bg opacity-20" />
      <FloatingParticles />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md z-10"
      >
        {/* Glass card */}
        <div className="relative rounded-[24px] border border-gold-border bg-[rgba(255,255,255,0.06)] backdrop-blur-[20px] p-8 shadow-gold">
          {/* Top glow line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[1px] bg-gradient-to-r from-transparent via-gold-primary/50 to-transparent" />

          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', duration: 0.8, delay: 0.2 }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-bl from-gold-primary to-gold-light flex items-center justify-center text-dark-base font-extrabold text-3xl mx-auto mb-4 shadow-gold"
            >
              ر
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold gold-gradient-text mb-2"
            >
              تسجيل الدخول
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-slate-500 dark:text-white/40"
            >
              مرحباً بك مجدداً في رافد
            </motion.p>
          </div>

          {/* Form */}
          <Suspense
            fallback={
              <div className="space-y-5">
                <div className="h-[72px] rounded-xl bg-slate-100 dark:bg-white/5 animate-pulse" />
                <div className="h-[72px] rounded-xl bg-slate-100 dark:bg-white/5 animate-pulse" />
                <div className="h-12 rounded-2xl bg-slate-100 dark:bg-white/5 animate-pulse" />
              </div>
            }
          >
            <SignInForm />
          </Suspense>
        </div>

        {/* Bottom decorative dot */}
        <div className="flex justify-center mt-6">
          <div className="w-1.5 h-1.5 rounded-full bg-gold-primary/40 animate-pulse-gold" />
        </div>
      </motion.div>
    </div>
  );
}
