/* ═══════════════════════════════
   رافد — Auth Error Page
   صفحة أخطاء المصادقة
   ═══════════════════════════════ */

'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

const ERROR_MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
  EMAIL_NOT_VERIFIED: 'يرجى التحقق من بريدك الإلكتروني أولاً',
  USER_NOT_FOUND: 'المستخدم غير موجود',
  EMAIL_ALREADY_EXISTS: 'هذا البريد مسجل بالفعل',
  SESSION_EXPIRED: 'انتهت جلستك، يرجى تسجيل الدخول مجدداً',
  RATE_LIMIT_EXCEEDED: 'محاولات كثيرة جداً. حاول بعد ساعة',
  INVALID_TOKEN: 'الرابط غير صحيح أو انتهت صلاحيته',
  ACCOUNT_LOCKED: 'الحساب مقفول مؤقتاً',
  DEFAULT: 'حدث خطأ أثناء المصادقة. حاول مرة أخرى',
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get('error') || 'DEFAULT';
  const errorMessage = ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.DEFAULT;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8 text-center">
          {/* أيقونة الخطأ */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center"
          >
            <HiOutlineExclamationCircle className="w-10 h-10 text-red-400" />
          </motion.div>

          {/* العنوان */}
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            خطأ في المصادقة
          </h1>

          {/* رسالة الخطأ */}
          <p className="text-slate-500 dark:text-white/50 mb-8 leading-relaxed">
            {errorMessage}
          </p>

          {/* أزرار الإجراء */}
          <div className="flex flex-col gap-3">
            <Link
              href="/auth/signin"
              className="w-full px-6 py-3 rounded-xl bg-gradient-to-l from-gold-primary to-gold-light text-dark-base font-bold text-center transition-all hover:shadow-lg hover:shadow-gold-primary/20"
            >
              إعادة تسجيل الدخول
            </Link>
            <Link
              href="/"
              className="w-full px-6 py-3 rounded-xl border border-gold-border text-gold-light font-medium text-center transition-all hover:bg-gold-primary/5"
            >
              العودة للرئيسية
            </Link>
          </div>

          {/* كود الخطأ */}
          <p className="mt-6 text-xs text-slate-400 dark:text-white/20">
            كود الخطأ: {errorCode}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
