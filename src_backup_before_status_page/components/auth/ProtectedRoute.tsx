/* ═══════════════════════════════
   رافد — ProtectedRoute Component
   حماية الصفحات على مستوى العميل
   ═══════════════════════════════ */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** الدور المطلوب للوصول */
  requiredRole?: 'admin' | 'superadmin';
  /** رابط إعادة التوجيه عند عدم المصادقة */
  redirectTo?: string;
  /** هل يتطلب تأكيد البريد الإلكتروني؟ */
  requireEmailVerification?: boolean;
}

/**
 * مكون حماية الصفحات
 * يتحقق من:
 * 1. وجود جلسة نشطة
 * 2. تأكيد البريد الإلكتروني (اختياري)
 * 3. دور المستخدم (اختياري)
 */
export function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = '/auth/signin',
  requireEmailVerification = true,
}: ProtectedRouteProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!mounted) return;

        // ─────────────────────────────────────────────────────────
        // 1. لا يوجد مستخدم → إعادة التوجيه لتسجيل الدخول
        // ─────────────────────────────────────────────────────────
        if (!user) {
          const currentPath = window.location.pathname;
          router.push(`${redirectTo}?callbackUrl=${encodeURIComponent(currentPath)}`);
          return;
        }

        // ─────────────────────────────────────────────────────────
        // 2. بريد غير مؤكد → إعادة التوجيه للتحقق
        // ─────────────────────────────────────────────────────────
        if (requireEmailVerification && !user.email_confirmed_at) {
          router.push(`/auth/verify-email?email=${encodeURIComponent(user.email || '')}`);
          return;
        }

        // ─────────────────────────────────────────────────────────
        // 3. التحقق من الدور
        // ─────────────────────────────────────────────────────────
        if (requiredRole) {
          const userRole = user.user_metadata?.role || 'user';
          if (userRole !== requiredRole && userRole !== 'superadmin') {
            router.push('/dashboard');
            return;
          }
        }

        // ─────────────────────────────────────────────────────────
        // 4. مصرح بالوصول
        // ─────────────────────────────────────────────────────────
        setIsAuthorized(true);
      } catch (error) {
        if (mounted) {
          router.push(redirectTo);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    checkAuth();

    // ─────────────────────────────────────────────────────────────
    // الاستماع لتغييرات حالة المصادقة
    // ─────────────────────────────────────────────────────────────
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === 'SIGNED_OUT') {
          setIsAuthorized(false);
          router.push(redirectTo);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router, redirectTo, requiredRole, requireEmailVerification]);

  // ─────────────────────────────────────────────────────────────────
  // حالة التحميل
  // ─────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          {/* شعار رافد مع تأثير النبض */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-bl from-gold-primary to-gold-light flex items-center justify-center animate-pulse">
            <span className="text-dark-base font-extrabold text-2xl">ر</span>
          </div>
          {/* مؤشر التحميل */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gold-primary animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-gold-primary animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-gold-primary animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <p className="text-slate-500 dark:text-white/40 text-sm">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────
  // غير مصرح
  // ─────────────────────────────────────────────────────────────────
  if (!isAuthorized) {
    return null;
  }

  // ─────────────────────────────────────────────────────────────────
  // مصرح بالوصول
  // ─────────────────────────────────────────────────────────────────
  return <>{children}</>;
}
