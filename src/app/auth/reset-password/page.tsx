/* ═══════════════════════════════
   رافد — إعادة تعيين كلمة المرور
   ═══════════════════════════════ */

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineLockClosed,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
} from 'react-icons/hi';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/ToastProvider';

/* ── Password validation ── */
interface PasswordCheck {
  label: string;
  test: (pw: string) => boolean;
}

const PASSWORD_CHECKS: PasswordCheck[] = [
  { label: '٨ أحرف على الأقل', test: (pw) => pw.length >= 8 },
  { label: 'حرف كبير واحد على الأقل', test: (pw) => /[A-Z]/.test(pw) },
  { label: 'حرف صغير واحد على الأقل', test: (pw) => /[a-z]/.test(pw) },
  { label: 'رقم واحد على الأقل', test: (pw) => /[0-9]/.test(pw) },
  { label: 'رمز خاص واحد على الأقل (!@#$...)', test: (pw) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw) },
];

function getStrengthColor(score: number, total: number) {
  const pct = score / total;
  if (pct <= 0.2) return 'bg-red-500';
  if (pct <= 0.4) return 'bg-orange-500';
  if (pct <= 0.6) return 'bg-yellow-500';
  if (pct <= 0.8) return 'bg-lime-500';
  return 'bg-green-500';
}

function getStrengthLabel(score: number, total: number) {
  const pct = score / total;
  if (pct <= 0.2) return 'ضعيفة جداً';
  if (pct <= 0.4) return 'ضعيفة';
  if (pct <= 0.6) return 'متوسطة';
  if (pct <= 0.8) return 'جيدة';
  return 'قوية';
}

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

export default function ResetPasswordPage() {
  const router = useRouter();
  const { addToast } = useToast();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  /* Wait for Supabase to pick up the recovery token from the URL hash */
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        setSessionReady(true);
      }
    });
    // Also check immediately in case the event already fired
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setSessionReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  /* Compute strength */
  const passedChecks = useMemo(
    () => PASSWORD_CHECKS.map((c) => ({ ...c, passed: c.test(password) })),
    [password]
  );
  const strengthScore = passedChecks.filter((c) => c.passed).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (strengthScore < PASSWORD_CHECKS.length) {
      setError('كلمة المرور لا تستوفي جميع المتطلبات');
      return;
    }
    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين');
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        const errorMap: Record<string, string> = {
          'New password should be different from the old password.': 'يجب أن تكون كلمة المرور الجديدة مختلفة عن القديمة',
          'Auth session missing!': 'انتهت صلاحية الرابط، يرجى طلب رابط جديد',
        };
        throw new Error(errorMap[updateError.message] || 'حدث خطأ أثناء تحديث كلمة المرور');
      }

      setSuccess(true);
      addToast('success', 'تم تحديث كلمة المرور بنجاح');
      setTimeout(() => router.push('/auth/signin'), 3000);
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
              إعادة تعيين كلمة المرور
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-slate-500 dark:text-white/40"
            >
              أدخل كلمة مرور جديدة وقوية
            </motion.p>
          </div>

          <AnimatePresence mode="wait">
            {!success ? (
              /* ── Reset form ── */
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {/* Session not ready warning */}
                {!sessionReady && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-5 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-center"
                  >
                    <p className="text-xs text-yellow-300">
                      جارٍ التحقق من صلاحية الرابط...
                    </p>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* New Password */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-600 dark:text-white/70">كلمة المرور الجديدة</label>
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
                        autoComplete="new-password"
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

                  {/* Password strength */}
                  <AnimatePresence>
                    {password.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-white/[0.06] space-y-3">
                          {/* Strength bar */}
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                              <motion.div
                                className={`h-full rounded-full ${getStrengthColor(strengthScore, PASSWORD_CHECKS.length)}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${(strengthScore / PASSWORD_CHECKS.length) * 100}%` }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                            <span className="text-xs text-slate-500 dark:text-white/50 min-w-[60px] text-left">
                              {getStrengthLabel(strengthScore, PASSWORD_CHECKS.length)}
                            </span>
                          </div>
                          {/* Checklist */}
                          <div className="grid grid-cols-1 gap-1.5">
                            {passedChecks.map((check, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-center gap-2"
                              >
                                {check.passed ? (
                                  <HiOutlineCheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                                ) : (
                                  <HiOutlineXCircle className="w-4 h-4 text-slate-400 dark:text-white/20 flex-shrink-0" />
                                )}
                                <span className={`text-xs ${check.passed ? 'text-green-400/80' : 'text-slate-400 dark:text-white/30'}`}>
                                  {check.label}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-600 dark:text-white/70">تأكيد كلمة المرور</label>
                    <div className="relative">
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gold-primary/60">
                        <HiOutlineLockClosed className="w-5 h-5" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                        placeholder="••••••••"
                        dir="ltr"
                        className={`w-full pr-12 pl-12 py-3.5 rounded-xl bg-slate-100 dark:bg-white/5 border text-slate-900 dark:text-white placeholder:text-slate-400 dark:text-white/20 focus:outline-none focus:bg-white/[0.08] transition-all duration-300 text-right ${
                          confirmPassword && confirmPassword !== password
                            ? 'border-red-500/50 focus:border-red-500/70'
                            : 'border-gold-border focus:border-gold-primary/60'
                        }`}
                        autoComplete="new-password"
                      />
                      {confirmPassword && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                          {confirmPassword === password ? (
                            <HiOutlineCheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <HiOutlineXCircle className="w-5 h-5 text-red-400" />
                          )}
                        </div>
                      )}
                    </div>
                    {confirmPassword && confirmPassword !== password && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-red-400 mr-1"
                      >
                        كلمتا المرور غير متطابقتين
                      </motion.p>
                    )}
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
                    disabled={loading || !sessionReady}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-3.5 rounded-2xl font-bold text-base transition-all duration-300 bg-gradient-to-l from-gold-primary to-gold-light text-dark-base hover:shadow-gold-hover hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 mt-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>جارٍ التحديث...</span>
                      </>
                    ) : (
                      <span>تحديث كلمة المرور</span>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            ) : (
              /* ── Success state ── */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-5"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="w-20 h-20 rounded-3xl bg-gradient-to-br from-green-500/20 to-green-400/10 border border-green-500/30 flex items-center justify-center mx-auto"
                >
                  <HiOutlineCheckCircle className="w-10 h-10 text-green-400" />
                </motion.div>

                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-green-400">تم تحديث كلمة المرور!</h2>
                  <p className="text-slate-500 dark:text-white/50 text-sm">
                    سيتم تحويلك إلى صفحة تسجيل الدخول خلال ثوانٍ...
                  </p>
                </div>

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
