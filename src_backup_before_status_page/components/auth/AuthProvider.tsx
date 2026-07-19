/* ═══════════════════════════════
   رافد — Auth Provider
   سياق المصادقة على مستوى التطبيق
   ═══════════════════════════════ */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

// ═══════════════════════════════════════════════════════════════════════
// أنواع البيانات
// ═══════════════════════════════════════════════════════════════════════

interface AuthContextValue {
  /** المستخدم الحالي */
  user: User | null;
  /** الجلسة الحالية */
  session: Session | null;
  /** حالة التحميل */
  isLoading: boolean;
  /** هل المستخدم مسجل الدخول؟ */
  isAuthenticated: boolean;
  /** هل البريد مؤكد؟ */
  isEmailVerified: boolean;
  /** دور المستخدم */
  userRole: string;
  /** تسجيل الخروج */
  signOut: () => Promise<void>;
  /** تحديث بيانات المستخدم */
  refreshUser: () => Promise<void>;
}

// ═══════════════════════════════════════════════════════════════════════
// السياق
// ═══════════════════════════════════════════════════════════════════════

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Hook للوصول إلى سياق المصادقة
 * @returns بيانات المصادقة والدوال المساعدة
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// ═══════════════════════════════════════════════════════════════════════
// المزود (Provider)
// ═══════════════════════════════════════════════════════════════════════

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ─────────────────────────────────────────────────────────────────
  // تحميل الجلسة الأولية
  // ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (mounted) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    getInitialSession();

    // ─────────────────────────────────────────────────────────────
    // الاستماع لتغييرات حالة المصادقة
    // ─────────────────────────────────────────────────────────────
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (mounted) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          setIsLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ─────────────────────────────────────────────────────────────────
  // تسجيل الخروج
  // ─────────────────────────────────────────────────────────────────
  async function signOut() {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // تحديث بيانات المستخدم
  // ─────────────────────────────────────────────────────────────────
  async function refreshUser() {
    try {
      const { data: { user: refreshedUser } } = await supabase.auth.getUser();
      setUser(refreshedUser);
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // القيم المشتقة
  // ─────────────────────────────────────────────────────────────────
  const isAuthenticated = !!user;
  const isEmailVerified = !!user?.email_confirmed_at;
  const userRole = user?.user_metadata?.role || 'user';

  const value: AuthContextValue = {
    user,
    session,
    isLoading,
    isAuthenticated,
    isEmailVerified,
    userRole,
    signOut,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
