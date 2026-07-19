/* ═══════════════════════════════
   رافد — Footer Component
   ═══════════════════════════════ */

import React from 'react';
import Link from 'next/link';

const FOOTER_SECTIONS = [
  {
    title: 'المنصة',
    links: [
      { label: 'الرئيسية', href: '/' },
      { label: 'المنصات المدعومة', href: '/platforms' },
      { label: 'أرسل انشغالك', href: '/issues/new' },
      { label: 'تتبع انشغالك', href: '/issues/new' },
    ],
  },
  {
    title: 'الخدمات',
    links: [
      { label: 'الدعم التقني', href: '/issues/new' },
      { label: 'التشخيص الذكي', href: '/issues/new' },
      { label: 'رفع المشكلات', href: '/issues/new' },
      { label: 'التقارير', href: '/dashboard' },
    ],
  },
  {
    title: 'الموارد',
    links: [
      { label: 'مكتبة المحتوى', href: '/content' },
      { label: 'شروحات الفيديو', href: '/content' },
      { label: 'الأسئلة الشائعة', href: '/content' },
      { label: 'المقالات', href: '/content' },
    ],
  },
  {
    title: 'التواصل',
    links: [
      { label: 'عن رافد', href: '/' },
      { label: 'لوحة التحكم', href: '/dashboard' },
      { label: 'سياسة الخصوصية', href: '/' },
      { label: 'شروط الاستخدام', href: '/' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-white dark:bg-dark-base border-t border-gold-border/30">
      {/* Gold divider */}
      <div className="h-px bg-gradient-to-l from-transparent via-gold-primary to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-bold text-gold-light mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 dark:text-white/40 hover:text-slate-700 dark:hover:text-slate-700 dark:text-white/80 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Logo + Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-bl from-gold-primary to-gold-light flex items-center justify-center text-dark-base font-extrabold text-sm">
              ر
            </div>
            <span className="text-sm font-bold bg-gradient-to-l from-gold-primary to-gold-light bg-clip-text text-transparent">
              رافد — المرافقة الرقمية التربوية
            </span>
          </div>
          <p className="text-xs text-slate-400 dark:text-white/30">
            © {new Date().getFullYear()} رافد — المرافقة الرقمية التربوية. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}

