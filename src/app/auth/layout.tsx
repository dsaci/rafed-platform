/* ═══════════════════════════════
   رافد — Auth Layout
   تصميم موحد لصفحات المصادقة
   ═══════════════════════════════ */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'رافد — المصادقة',
  description: 'تسجيل الدخول أو إنشاء حساب جديد في منصة رافد',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* خلفية متحركة */}
      <div className="absolute inset-0 bg-dark-base grid-bg" />
      <div className="absolute inset-0 hero-gradient" />
      
      {/* كرات ضوئية زخرفية */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-gold-primary/5 blur-3xl animate-pulse" />
      <div className="absolute bottom-1/3 left-1/3 w-96 h-96 rounded-full bg-gold-light/5 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-2/3 right-2/3 w-48 h-48 rounded-full bg-gold-primary/3 blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />

      {/* المحتوى */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

