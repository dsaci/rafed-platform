/* ═══════════════════════════════
   رافد — التحقق من البريد الإلكتروني
   ═══════════════════════════════ */

'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineMail, HiOutlineCheckCircle, HiOutlineRefresh } from 'react-icons/hi';
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
          initial={{ x: `${20 + i * 16}%`, y: '110%', opacity: 0 }}
          animate={{ y: '-10%', opacity: [0, 0.5, 0] }}
          transition={{ duration: 10 + i * 2, repeat: Infinity, delay: i * 1.5, ease: 'linear' }}
        />
      ))}
    </div>
  );
}

/* ── Animated envelope icon ── */
function EnvelopeAnimation({ verified }: { verified: boolean }) {
  return (
    <div className="relative mx-auto w-24 h-24 mb-6">
      <AnimatePresence mode="wait">
        {!verified ? (
          <motion.div
            key="envelope"
            initial={{ scale: 0 }}
            animate={{ scale: 1, y: [0, -8, 0] }}
            transition={{
              scale: { type: 'spring', duration: 0.6 },
              y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
            }}
            exit={{ scale: 0, rotate: 180 }}
            className="w-24 h-24 rounded-3xl bg-gradient-to-br from-gold-primary/20 to-gold-light/10 border border-gold-border flex items-center justify-center"
          >
            <HiOutlineMail className="w-12 h-12 text-gold-primary" />
          </motion.div>
        ) : (
          <motion.div
            key="check"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className="w-24 h-24 rounded-3xl bg-gradient-to-br from-green-500/20 to-green-400/10 border border-green-500/30 flex items-center justify-center"
          >
            <HiOutlineCheckCircle className="w-12 h-12 text-green-400" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pulse ring behind icon */}
      {!verified && (
        <motion.div
          className="absolute inset-0 rounded-3xl border border-gold-primary/20"
          animate={{ scale: [1, 1.3, 1.3], opacity: [0.5, 0, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </div>
  );
}

/* ── Inner content (uses useSearchParams) ── */
function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();

  const email = searchParams.get('email') || '';
  const [verified, setVerified] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  /* Check verification status every 5 seconds */
  const checkVerification = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email_confirmed_at) {
        setVerified(true);
        addToast('success', 'تم التحقق من بريدك الإلكتروني بنجاح!');
        setTimeout(() => router.push('/dashboard'), 3000);
      }
    } catch {
      // silently fail – user may not be logged in yet
    }
  }, [addToast, router]);

  useEffect(() => {
    if (verified) return;
    const interval = setInterval(checkVerification, 5000);
    checkVerification(); // immediate check
    return () => clearInterval(interval);
  }, [checkVerification, verified]);

  /* Cooldown timer for resend */
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleResend = async () => {
    if (!email || countdown > 0) return;
    setResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify-email`,
        },
      });
      if (error) throw error;
      addToast('success', 'تم إعادة إرسال رابط التحقق');
      setCountdown(60);
    } catch {
      addToast('error', 'فشل في إعادة إرسال الرابط');
    } finally {
      setResending(false);
    }
  };

  /* Mask email for display */
  const maskedEmail = email
    ? email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + '•'.repeat(Math.min(b.length, 6)) + c)
    : '';

  return (
    <>
      <EnvelopeAnimation verified={verified} />

      <AnimatePresence mode="wait">
        {!verified ? (
          <motion.div
            key="pending"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center space-y-4"
          >
            <h1 className="text-2xl font-bold gold-gradient-text">التحقق من البريد الإلكتروني</h1>
            <p className="text-slate-500 dark:text-white/50 text-sm leading-relaxed">
              تم إرسال رابط التحقق إلى بريدك الإلكتروني
            </p>
            {maskedEmail && (
              <p className="text-gold-primary font-mono text-sm bg-slate-100 dark:bg-white/5 rounded-xl py-2 px-4 inline-block" dir="ltr">
                {maskedEmail}
              </p>
            )}
            <p className="text-slate-400 dark:text-white/30 text-xs">
              يرجى فتح الرابط في بريدك الإلكتروني لتفعيل حسابك
            </p>

            {/* Auto-checking indicator */}
            <div className="flex items-center justify-center gap-2 text-white/25 text-xs pt-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <HiOutlineRefresh className="w-3.5 h-3.5" />
              </motion.div>
              <span>جارٍ التحقق تلقائياً...</span>
            </div>

            {/* Resend button */}
            <div className="pt-4">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleResend}
                disabled={resending || countdown > 0}
                className="px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 bg-slate-100 dark:bg-white/5 border border-gold-border text-gold-light hover:bg-slate-200 dark:hover:bg-slate-200 dark:bg-white/10 hover:border-gold-primary/50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {resending ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    إعادة الإرسال...
                  </span>
                ) : countdown > 0 ? (
                  `إعادة الإرسال خلال ${countdown} ثانية`
                ) : (
                  'إعادة إرسال رابط التحقق'
                )}
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="verified"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4"
          >
            <h1 className="text-2xl font-bold text-green-400">تم التحقق بنجاح!</h1>
            <p className="text-slate-500 dark:text-white/50 text-sm">
              سيتم تحويلك إلى لوحة التحكم خلال ثوانٍ...
            </p>
            {/* Progress bar */}
            <div className="w-48 h-1 mx-auto rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-green-400"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 3 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back to signin */}
      <div className="text-center pt-8">
        <Link
          href="/auth/signin"
          className="text-sm text-slate-400 dark:text-white/30 hover:text-slate-500 dark:text-white/60 transition-colors"
        >
          ← العودة إلى تسجيل الدخول
        </Link>
      </div>
    </>
  );
}

/* ── Page Component ── */
export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-base relative flex items-center justify-center py-12 px-4" dir="rtl">
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
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[1px] bg-gradient-to-r from-transparent via-gold-primary/50 to-transparent" />

          <Suspense
            fallback={
              <div className="text-center space-y-4">
                <div className="w-24 h-24 mx-auto rounded-3xl bg-slate-100 dark:bg-white/5 animate-pulse" />
                <div className="h-6 w-48 mx-auto rounded bg-slate-100 dark:bg-white/5 animate-pulse" />
                <div className="h-4 w-64 mx-auto rounded bg-slate-100 dark:bg-white/5 animate-pulse" />
              </div>
            }
          >
            <VerifyEmailContent />
          </Suspense>
        </div>

        <div className="flex justify-center mt-6">
          <div className="w-1.5 h-1.5 rounded-full bg-gold-primary/40 animate-pulse-gold" />
        </div>
      </motion.div>
    </div>
  );
}
