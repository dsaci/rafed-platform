import React from 'react';
import type { Metadata } from 'next';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { GoldButton } from '@/components/ui/GoldButton';
import { HiOutlineSearch, HiOutlineChatAlt2, HiOutlinePhone, HiOutlineBookOpen, HiOutlineChevronLeft } from 'react-icons/hi';
import Link from 'next/link';
import { LiveChatButton } from '@/components/support/LiveChatButton';

export const metadata: Metadata = {
  title: 'الدعم التقني — رافد',
  description: 'قاعدة المعرفة والدردشة الحية مع فريق الدعم',
};

export default function SupportPage() {
  const faqs = [
    { q: 'كيف أستعيد كلمة المرور الخاصة بفضاء الأستاذ؟', a: 'يمكنك استعادة كلمة المرور بالضغط على زر "نسيت كلمة المرور" في الصفحة الرئيسية لفضاء الأستاذ وإدخال بريدك الإلكتروني لتلقي رابط الاستعادة.' },
    { q: 'حسابي موقوف بسبب كثرة المحاولات الخاطئة، ماذا أفعل؟', a: 'يتم رفع الإيقاف تلقائياً بعد 24 ساعة. إذا كنت بحاجة لدخول عاجل، يرجى رفع تذكرة دعم وسنقوم بمساعدتك.' },
    { q: 'كيف أحدث بياناتي في منصة الخدمات الإلكترونية؟', a: 'قم بتسجيل الدخول، واذهب إلى "الملف الشخصي" ثم اضغط على "تعديل البيانات" وقم برفع الوثائق الثبوتية الجديدة.' },
    { q: 'المنصة لا تفتح معي، ماذا أفعل؟', a: 'جرب استخدام التشخيص الذكي الخاص بنا، وتأكد من مسح ملفات الارتباط (Cookies) واستخدام أحدث نسخة من المتصفح.' },
  ];

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-primary/10 rounded-full blur-[100px] pointer-events-none" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 relative z-10">
            كيف يمكننا <span className="gold-gradient-text">مساعدتك؟</span>
          </h1>
          
          <div className="max-w-2xl mx-auto relative z-10 flex">
            <input 
              type="text" 
              placeholder="ابحث في قاعدة المعرفة... (مثال: كلمة المرور)" 
              className="w-full h-14 bg-dark-surface border border-gold-border/30 rounded-r-2xl pl-4 pr-12 text-white placeholder-white/40 focus:outline-none focus:border-gold-primary"
            />
            <div className="absolute top-0 right-0 h-14 w-12 flex items-center justify-center text-white/40">
              <HiOutlineSearch className="w-5 h-5" />
            </div>
            <button className="h-14 px-8 bg-gradient-to-l from-gold-primary to-gold-light text-dark-base font-bold rounded-l-2xl hover:opacity-90 transition-opacity">
              بحث
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content - Knowledge Base (2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-primary/10 text-gold-light flex items-center justify-center">
                <HiOutlineBookOpen className="w-6 h-6" />
              </div>
              الأسئلة الشائعة
            </h2>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-dark-surface border border-white/5 hover:border-gold-border/30 transition-colors rounded-2xl p-6 group cursor-pointer">
                  <h3 className="text-lg font-bold text-white/90 mb-3 group-hover:text-gold-light transition-colors">{faq.q}</h3>
                  <p className="text-white/60 leading-relaxed text-sm">{faq.a}</p>
                </div>
              ))}
            </div>

            <div className="text-center pt-4">
              <Link href="/content" className="inline-flex items-center gap-2 text-gold-light hover:text-white transition-colors">
                تصفح جميع المقالات في مكتبة المحتوى
                <HiOutlineChevronLeft />
              </Link>
            </div>
          </div>

          {/* Sidebar - Direct Contact (1 col) */}
          <div className="space-y-6">
            
            <div className="bg-gradient-to-br from-dark-surface to-dark-base border border-gold-border/20 rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px] group-hover:bg-blue-500/20 transition-all" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-6">
                  <HiOutlineChatAlt2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">المحادثة الحية</h3>
                <p className="text-white/60 text-sm mb-6 leading-relaxed">
                  تحدث مباشرة مع أحد وكلاء الدعم التقني لحل مشكلتك بسرعة (متاح من 8 صباحاً إلى 4 مساءً).
                </p>
                <LiveChatButton />
              </div>
            </div>

            <div className="bg-gradient-to-br from-dark-surface to-dark-base border border-gold-border/20 rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-32 h-32 bg-green-500/10 rounded-full blur-[40px] group-hover:bg-green-500/20 transition-all" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-green-500/10 text-green-400 flex items-center justify-center mb-6">
                  <HiOutlinePhone className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">حجز موعد عن بعد</h3>
                <p className="text-white/60 text-sm mb-6 leading-relaxed">
                  للمشاكل المعقدة، احجز موعداً ليقوم التقني بالاتصال بحاسوبك عن بعد (عبر AnyDesk) لمساعدتك.
                </p>
                <Link href="/services/support/booking" className="flex items-center justify-center w-full py-3 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 rounded-xl font-bold transition-all">
                  حجز موعد جديد
                </Link>
              </div>
            </div>

            <div className="bg-gold-primary/5 border border-gold-primary/20 rounded-3xl p-8 text-center mt-8">
              <h3 className="font-bold text-gold-light mb-2">لم تجد حلاً؟</h3>
              <p className="text-white/60 text-sm mb-6">لا تقلق، يمكنك دائماً رفع المشكلة بشكل تفصيلي في تذكرة مخصصة.</p>
              <GoldButton href="/issues/new" fullWidth>
                رفع المشكلة
              </GoldButton>
            </div>

          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

