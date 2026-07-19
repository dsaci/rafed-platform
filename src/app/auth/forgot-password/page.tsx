/* ═══════════════════════════════
   رافد — نسيت كلمة المرور
   ═══════════════════════════════ */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineAtSymbol, HiOutlineMail } from 'react-icons/hi';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/ToastProvider';

/* ── Floating particles ── */
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-gold-primary/30"
          initial={{ x: `${18 + i * 16}%`, y: '110%', opacity: 0 }}
          animate={{ y: '-10%', opacity: [0, 0.5, 0] }}
          transition={{ duration: 9 + i * 2, repeat: Infinity, delay: i * 1.4, ease: 'linear' }}
        />
      ))}
    </div>
  );
}

export default function ForgotPasswordPage() {
  const { addToast } = useToast();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('يرجى إدخال البريد الإلكتروني');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('بريد إلكتروني غير صالح');
      return;
    }

    setLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        }
      );

      if (resetError) {
        throw new Error('حدث خطأ أثناء إرسال رابط إعادة التعيين');
      }

      setSent(true);
      addToast('success', 'تحقق من بريدك الإلكتروني لإعادة تعيين كلمة المرور');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ غير متوقع';
      setError(msg);
      addToast('error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-base relative flex items-center justify-center py-12 px-4" dir="rtl">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient opacity-40" />
      <div className="absolute inset-0 grid-bg opacity-20" />
      <FloatingParticles />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md z-10"
      >
        <div className="relative rounded-[24px] border border-gold-border bg-[rgba(255,255,255,0.06)] backdrop-blur-[20px] p-8 shadow-gold">
          {/* Top glow */}
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
              نسيت كلمة المرور
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-slate-500 dark:text-white/40"
            >
              أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور
            </motion.p>
          </div>

          <AnimatePresence mode="wait">
            {!sent ? (
              /* ── Request form ── */
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
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
                      autoFocus
                    />
                  </div>
                </div>

                {/* Error */}
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

                {/* Submit */}
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
                      <span>جارٍ الإرسال...</span>
                    </>
                  ) : (
                    <>
                      <HiOutlineMail className="w-5 h-5" />
                      <span>إرسال رابط إعادة التعيين</span>
                    </>
                  )}
                </motion.button>
              </motion.form>
            ) : (
              /* ── Success state ── */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-5"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="w-20 h-20 rounded-3xl bg-gradient-to-br from-green-500/20 to-green-400/10 border border-green-500/30 flex items-center justify-center mx-auto"
                >
                  <HiOutlineMail className="w-10 h-10 text-green-400" />
                </motion.div>

                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-green-400">تم إرسال الرابط!</h2>
                  <p className="text-slate-500 dark:text-white/50 text-sm leading-relaxed">
                    تحقق من بريدك الإلكتروني لإعادة تعيين كلمة المرور
                  </p>
                  {email && (
                    <p className="text-gold-primary font-mono text-sm bg-slate-100 dark:bg-white/5 rounded-xl py-2 px-4 inline-block" dir="ltr">
                      {email}
                    </p>
                  )}
                </div>

                <p className="text-slate-400 dark:text-white/30 text-xs">
                  لم يصلك البريد؟ تحقق من مجلد الرسائل غير المرغوب فيها
                </p>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setSent(false); setEmail(''); }}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 bg-slate-100 dark:bg-white/5 border border-gold-border text-gold-light hover:bg-slate-200 dark:hover:bg-slate-200 dark:bg-white/10 hover:border-gold-primary/50"
                >
                  إعادة المحاولة ببريد آخر
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Back link */}
          <div className="text-center mt-6 pt-6 border-t border-white/[0.06]">
            <Link
              href="/auth/signin"
              className="text-sm text-slate-500 dark:text-white/40 hover:text-slate-500 dark:text-white/60 transition-colors"
            >
              ← العودة إلى تسجيل الدخول
            </Link>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <div className="w-1.5 h-1.5 rounded-full bg-gold-primary/40 animate-pulse-gold" />
        </div>
      </motion.div>
    </div>
  );
}
