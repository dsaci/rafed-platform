/* رافد — Not Found Page */
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-base">
      <div className="text-center px-4">
        <h1 className="text-8xl font-extrabold gold-gradient-text mb-4">٤٠٤</h1>
        <p className="text-xl text-white/50 mb-8">الصفحة المطلوبة غير موجودة</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-l from-gold-primary to-gold-light text-dark-base font-bold transition-all hover:shadow-gold-hover"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}

