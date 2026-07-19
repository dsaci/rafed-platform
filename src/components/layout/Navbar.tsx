/* ═══════════════════════════════
   رافد — Navbar Component
   مع دعم حالة المصادقة
   ═══════════════════════════════ */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_LINKS } from '@/lib/constants';
import { GoldButton } from '@/components/ui/GoldButton';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/auth/AuthProvider';
import { NotificationBell } from '@/components/notifications/NotificationProvider';
import { HiOutlineUser, HiOutlineLogout, HiOutlineCog } from 'react-icons/hi';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, signOut, userRole } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isMinistryUnlocked, setIsMinistryUnlocked] = useState(false);

  useEffect(() => {
    // التحقق من حالة القفل المحفوظة
    if (typeof window !== 'undefined' && localStorage.getItem('ministry_unlocked') === 'true') {
      setIsMinistryUnlocked(true);
    }

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const [clickCount, setClickCount] = useState(0);

  const handleSecretClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setClickCount(prev => {
      const newCount = prev + 1;
      if (newCount >= 3) {
        setIsMinistryUnlocked(true);
        localStorage.setItem('ministry_unlocked', 'true');
        return 0; // Reset
      }
      // إرجاع العداد للصفر إذا مر وقت طويل ولم يكمل 3 ضغطات
      setTimeout(() => setClickCount(0), 1000);
      return newCount;
    });
  };

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = () => setUserMenuOpen(false);
    if (userMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [userMenuOpen]);

  async function handleSignOut() {
    await signOut();
    router.push('/');
  }

  const visibleLinks = [
    ...NAV_LINKS,
    ...(isMinistryUnlocked ? [{ href: '/ministry-reports', label: 'تقارير الوزارة 🔐' }] : [])
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-dark-base/80 backdrop-blur-xl border-b border-gold-border shadow-gold'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div 
              onClick={handleSecretClick}
              className="w-10 h-10 rounded-xl bg-gradient-to-bl from-gold-primary to-gold-light flex items-center justify-center text-dark-base font-extrabold text-xl shadow-gold-glow cursor-pointer"
            >
              ر
            </div>
            <span className="text-2xl font-bold gold-gradient-text font-thmanyah tracking-wide">
              رَافِد
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {visibleLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative px-4 py-2 text-sm font-medium transition-colors rounded-xl',
                    isActive
                      ? 'text-gold-primary dark:text-gold-light'
                      : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white/90 hover:bg-slate-100 dark:hover:bg-white/5'
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-l from-gold-primary to-gold-light rounded-full"
                    />
                  )}
                </Link>
              );
            })}

            {/* Services Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 relative px-4 py-2 text-sm font-medium transition-colors rounded-xl text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white/90 hover:bg-slate-100 dark:hover:bg-white/5">
                الخدمات
                <motion.svg
                  className="w-4 h-4 text-slate-400 dark:text-white/40 group-hover:text-slate-700 dark:group-hover:text-white/70 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </button>
              
              <div className="absolute top-full right-0 mt-1 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100 z-50">
                <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-gold-border/30 rounded-xl shadow-xl overflow-hidden py-2 backdrop-blur-xl">
                  <Link href="/services/smart-diagnosis" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-white/70 hover:text-gold-primary dark:hover:text-gold-light hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <span className="text-xl">🤖</span>
                    <div>
                      <div className="font-bold">التشخيص الذكي</div>
                      <div className="text-xs text-slate-500 dark:text-white/30">معالج مدعوم بالذكاء الاصطناعي</div>
                    </div>
                  </Link>
                  <Link href="/issues/new" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-white/70 hover:text-gold-primary dark:hover:text-gold-light hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <span className="text-xl">📩</span>
                    <div>
                      <div className="font-bold">رفع المشكلات</div>
                      <div className="text-xs text-slate-500 dark:text-white/30">إرسال تذكرة دعم جديدة</div>
                    </div>
                  </Link>
                  <Link href="/services/support" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-white/70 hover:text-gold-primary dark:hover:text-gold-light hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <span className="text-xl">🎧</span>
                    <div>
                      <div className="font-bold">الدعم التقني</div>
                      <div className="text-xs text-slate-500 dark:text-white/30">قاعدة المعرفة والدردشة الحية</div>
                    </div>
                  </Link>
                  
                  {userRole === 'admin' && (
                    <>
                      <div className="h-px bg-slate-200 dark:bg-white/5 my-1" />
                      <Link href="/admin/reports" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-white/70 hover:text-red-500 dark:hover:text-red-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <span className="text-xl">📊</span>
                        <div>
                          <div className="font-bold">التقارير والإحصائيات</div>
                          <div className="text-xs text-slate-500 dark:text-white/30">لوحة تحكم المشرفين</div>
                        </div>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop CTA + Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isLoading ? (
              /* مؤشر تحميل صغير */
              <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />
            ) : isAuthenticated ? (
              /* المستخدم مسجل الدخول */
              <div className="flex items-center gap-3">
                <GoldButton href="/issues/new" size="sm">
                  أرسل انشغالك
                </GoldButton>
                
                <ThemeToggle />
                <NotificationBell />

                {/* قائمة المستخدم */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setUserMenuOpen(!userMenuOpen);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gold-border/30 bg-white/5 hover:bg-white/10 transition-all"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-bl from-gold-primary to-gold-light flex items-center justify-center text-dark-base text-xs font-bold">
                      {user?.user_metadata?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || 'م'}
                    </div>
                    <span className="text-sm text-slate-700 dark:text-white/70 max-w-[100px] truncate">
                      {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'مستخدم'}
                    </span>
                    <motion.svg
                      animate={{ rotate: userMenuOpen ? 180 : 0 }}
                      className="w-4 h-4 text-slate-500 dark:text-white/40"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </motion.svg>
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 top-full mt-2 w-56 rounded-xl bg-dark-surface/95 backdrop-blur-xl border border-gold-border/30 shadow-2xl overflow-hidden"
                      >
                        {/* معلومات المستخدم */}
                        <div className="px-4 py-3 border-b border-slate-200 dark:border-white/5">
                          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                            {user?.user_metadata?.full_name || 'مستخدم'}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-white/40 truncate">{user?.email}</p>
                        </div>

                        {/* روابط */}
                        <div className="py-1">
                          <Link
                            href="/dashboard"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                          >
                            <HiOutlineCog className="w-4 h-4" />
                            لوحة التحكم
                          </Link>
                          <Link
                            href="/profile"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                          >
                            <HiOutlineUser className="w-4 h-4" />
                            الملف الشخصي
                          </Link>
                          {(userRole === 'admin' || userRole === 'superadmin') && (
                            <Link
                              href="/admin"
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gold-light/70 hover:text-gold-light hover:bg-gold-primary/5 transition-colors"
                            >
                              <HiOutlineCog className="w-4 h-4" />
                              الإدارة
                            </Link>
                          )}
                        </div>

                        {/* تسجيل الخروج */}
                        <div className="border-t border-white/5 py-1">
                          <button
                            onClick={handleSignOut}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400/80 hover:text-red-400 hover:bg-red-500/5 transition-colors"
                          >
                            <HiOutlineLogout className="w-4 h-4" />
                            تسجيل الخروج
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              /* المستخدم غير مسجل */
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-white/60 hover:text-slate-900 dark:hover:text-white/90 transition-colors rounded-xl hover:bg-slate-100 dark:hover:bg-white/5"
                >
                  تسجيل الدخول
                </Link>
                <GoldButton href="/auth/signup" size="sm">
                  إنشاء حساب
                </GoldButton>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 rounded-xl bg-white/5 flex flex-col items-center justify-center gap-1.5 transition-colors hover:bg-white/10"
            aria-label="القائمة"
          >
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="w-5 h-0.5 bg-gold-light block"
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-5 h-0.5 bg-gold-light block"
            />
            <motion.span
              animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="w-5 h-0.5 bg-gold-light block"
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-dark-surface/95 backdrop-blur-xl border-b border-gold-border"
          >
            <div className="px-4 py-4 space-y-1">
              {visibleLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'block px-4 py-3 rounded-xl text-base font-medium transition-colors',
                      isActive
                        ? 'text-gold-light bg-gold-primary/10'
                        : 'text-slate-700 dark:text-white/60 hover:text-slate-900 dark:hover:text-white/90 hover:bg-slate-100 dark:hover:bg-white/5'
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              
              {/* Mobile Services Section */}
                <div className="py-2 border-y border-slate-200 dark:border-white/5 my-2">
                  <div className="px-4 py-2 text-xs font-bold text-gold-primary/80 dark:text-gold-primary/60 uppercase tracking-wider">الخدمات</div>
                  <Link href="/services/smart-diagnosis" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                    <span className="text-xl">🤖</span> التشخيص الذكي
                  </Link>
                  <Link href="/issues/new" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                    <span className="text-xl">📩</span> رفع المشكلات
                  </Link>
                  <Link href="/services/support" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                    <span className="text-xl">🎧</span> الدعم التقني
                  </Link>
                  {userRole === 'admin' && (
                    <Link href="/admin/reports" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 dark:text-red-400/80 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/5 transition-colors">
                      <span className="text-xl">📊</span> التقارير
                    </Link>
                  )}
                </div>
              <div className="pt-2 space-y-2">
                {isAuthenticated ? (
                  <>
                    {/* معلومات المستخدم في الموبايل */}
                    <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-100 dark:bg-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-bl from-gold-primary to-gold-light flex items-center justify-center text-dark-base text-sm font-bold">
                          {user?.user_metadata?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || 'م'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {user?.user_metadata?.full_name || 'مستخدم'}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-white/40">{user?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <NotificationBell />
                      </div>
                    </div>
                    
                    <GoldButton href="/issues/new" fullWidth size="md">
                      أرسل انشغالك
                    </GoldButton>
                    
                    <Link
                      href="/dashboard"
                      className="block px-4 py-3 rounded-xl text-base font-medium text-slate-700 dark:text-white/60 hover:text-slate-900 dark:hover:text-white/90 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                    >
                      لوحة التحكم
                    </Link>
                    
                    <button
                      onClick={handleSignOut}
                      className="w-full text-right px-4 py-3 rounded-xl text-base font-medium text-red-500 dark:text-red-400/70 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/5 transition-colors"
                    >
                      تسجيل الخروج
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center px-4 py-2">
                      <span className="text-slate-700 dark:text-white/60 text-sm">تغيير المظهر</span>
                      <ThemeToggle />
                    </div>
                    <GoldButton href="/auth/signin" fullWidth size="md" variant="outline">
                      تسجيل الدخول
                    </GoldButton>
                    <GoldButton href="/auth/signup" fullWidth size="md">
                      إنشاء حساب
                    </GoldButton>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

