/* رافد — Login Page */
'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { GoldButton } from '@/components/ui/GoldButton';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { useToast } from '@/components/ui/ToastProvider';
import { supabase } from '@/lib/supabase';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectTo = searchParams.get('redirect') || '/dashboard';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('يرجى ملء جميع الحقول');
      return;
    }
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) throw authError;
      addToast('success', 'تم تسجيل الدخول بنجاح');
      router.refresh();
      router.push(redirectTo);
    } catch {
      setError('بريد إلكتروني أو كلمة مرور غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard className="p-8" animate={false} hover={false}>
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-bl from-gold-primary to-gold-light flex items-center justify-center text-dark-base font-extrabold text-3xl mx-auto mb-4 shadow-gold-glow">
          ر
        </div>
        <h1 className="text-4xl font-bold gold-gradient-text font-thmanyah mb-2">رَافِد</h1>
        <p className="text-sm text-slate-500 dark:text-white/40">لوحة تحكم المشرفين</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-slate-600 dark:text-white/70 mb-2">البريد الإلكتروني</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@rafed.dz"
            dir="ltr"
            className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-gold-border text-slate-900 dark:text-white placeholder:text-slate-400 dark:text-white/20 focus:outline-none focus:border-gold-primary/50 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-600 dark:text-white/70 mb-2">كلمة المرور</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            dir="ltr"
            className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-gold-border text-slate-900 dark:text-white placeholder:text-slate-400 dark:text-white/20 focus:outline-none focus:border-gold-primary/50 transition-all"
          />
        </div>
        {error && <p className="text-sm text-red-400 text-center">{error}</p>}
        <GoldButton type="submit" loading={loading} fullWidth>
          دخول
        </GoldButton>
      </form>
    </GlassCard>
  );
}

export default function LoginPage() {
  return (
    <PageWrapper>
      <section className="min-h-[80vh] flex items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md px-4"
        >
          <Suspense
            fallback={
              <div className="w-full max-w-md h-96 rounded-[20px] bg-slate-50 dark:bg-white/[0.03] animate-pulse" />
            }
          >
            <LoginForm />
          </Suspense>
        </motion.div>
      </section>
    </PageWrapper>
  );
}
