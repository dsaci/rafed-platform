/* ═══════════════════════════════
   رافد — Dashboard Layout
   نظام القوائم الديناميكية (RBAC)
   ═══════════════════════════════ */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/ToastProvider';
import { useAuth } from '@/components/auth/AuthProvider';

// ═══════════════════════════════════════════════════════════════════════
// قوائم التنقل المبنية على الصلاحيات (RBAC Tabs)
// ═══════════════════════════════════════════════════════════════════════

const ADMIN_TABS = [
  { label: 'نظرة عامة', href: '/dashboard', icon: '📊' },
  { label: 'الانشغالات', href: '/dashboard/issues', icon: '📩' },
  { label: 'المواعيد', href: '/dashboard/bookings', icon: '📅' },
  { label: 'المحتوى', href: '/dashboard/content', icon: '📝' },
  { label: 'التقارير', href: '/dashboard/reports', icon: '📈' },
  { label: 'الإعدادات', href: '/dashboard/settings', icon: '⚙️' },
];

const USER_TABS = [
  { label: 'ملخص حسابي', href: '/dashboard', icon: '🏠' },
  { label: 'تذاكري', href: '/dashboard/my-tickets', icon: '🎫' },
  { label: 'الإشعارات', href: '/dashboard/notifications', icon: '🔔' },
];

// ═══════════════════════════════════════════════════════════════════════

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { addToast } = useToast();
  const { userRole, signOut, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAdmin = userRole === 'admin' || userRole === 'superadmin';
  const tabs = isAdmin ? ADMIN_TABS : USER_TABS;

  const handleLogout = async () => {
    await signOut();
    addToast('success', 'تم تسجيل الخروج بنجاح');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-base">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 h-16 bg-white/80 dark:bg-dark-surface/90 backdrop-blur-xl border-b border-slate-200 dark:border-gold-border/30 flex items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-gold-light"
          >
            ☰
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-bl from-gold-primary to-gold-light flex items-center justify-center text-dark-base font-extrabold text-sm">
              ر
            </div>
            <span className="text-lg font-bold text-gold-light">لوحة التحكم</span>
          </Link>
          {/* شارة الدور */}
          <span className={cn(
            'text-[10px] px-2 py-0.5 rounded-full font-bold',
            isAdmin 
              ? 'bg-gold-primary/15 text-gold-light border border-gold-border' 
              : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
          )}>
            {isAdmin ? 'مدير' : 'مستخدم'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-sm text-slate-500 dark:text-white/40 hover:text-slate-700 dark:hover:text-white/80 transition-colors"
          >
            العودة للموقع
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all"
          >
            خروج
          </button>
        </div>
      </div>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed lg:sticky top-16 right-0 z-30 h-[calc(100vh-4rem)] w-64 bg-white/95 dark:bg-dark-surface/95 backdrop-blur-xl border-l border-slate-200 dark:border-gold-border/20 transition-transform duration-300',
            'lg:translate-x-0',
            sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
          )}
        >
          <nav className="p-4 space-y-1">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                    isActive
                      ? 'bg-gold-primary/10 text-gold-light border border-gold-border'
                      : 'text-slate-500 dark:text-white/50 hover:text-slate-700 dark:hover:text-white/80 hover:bg-slate-100 dark:hover:bg-white/5'
                  )}
                >
                  <span className="text-lg">{tab.icon}</span>
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="dashboard-tab"
                      className="mr-auto w-1 h-4 rounded-full bg-gold-primary"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* فاصل */}
          <div className="px-4 py-2">
            <div className="h-px bg-slate-200 dark:bg-white/10" />
          </div>

          {/* روابط مساعدة */}
          <div className="px-4 space-y-1">
            <Link
              href="/content"
              className="flex items-center gap-3 px-4 py-2 rounded-xl text-xs text-slate-400 dark:text-white/30 hover:text-slate-500 dark:hover:text-white/50 transition-all"
            >
              <span>📚</span>
              قاعدة المعرفة
            </Link>
            <Link
              href="/status"
              className="flex items-center gap-3 px-4 py-2 rounded-xl text-xs text-slate-400 dark:text-white/30 hover:text-slate-500 dark:hover:text-white/50 transition-all"
            >
              <span>🟢</span>
              حالة المنصات
            </Link>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 lg:mr-0 min-h-[calc(100vh-4rem)]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 md:p-8"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
