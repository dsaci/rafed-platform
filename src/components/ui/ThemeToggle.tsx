'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10" />;
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 hover:bg-gold-primary/10 hover:border-gold-primary/30 group"
      aria-label={isDark ? 'التبديل للوضع الفاتح' : 'التبديل للوضع الداكن'}
      title={isDark ? 'الوضع الفاتح' : 'الوضع الداكن'}
    >
      {isDark ? (
        <HiOutlineSun className="w-5 h-5 text-gold-primary transition-transform duration-500 hover:rotate-180" />
      ) : (
        <HiOutlineMoon className="w-5 h-5 text-gold-primary transition-transform duration-500 hover:-rotate-12" />
      )}
      <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs font-bold whitespace-nowrap px-2 py-1 rounded bg-white dark:bg-dark-surface text-slate-900 dark:text-white shadow-lg pointer-events-none">
        {isDark ? 'فاتح' : 'داكن'}
      </span>
    </button>
  );
}
