/* ═══════════════════════════════
   رافد — Dashboard Bookings
   صفحة إدارة المواعيد (للمسؤولين)
   ═══════════════════════════════ */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { GoldBadge } from '@/components/ui/GoldBadge';
import { HiOutlineCalendar, HiOutlinePhone, HiOutlineDesktopComputer } from 'react-icons/hi';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';

export default function BookingsPage() {
  const { userRole } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    // تحميل المواعيد من localStorage للـ Demo
    try {
      const stored = localStorage.getItem('demo_submitted_bookings');
      if (stored) {
        setBookings(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);

  // إذا لم يكن مديراً نعيده لصفحة لوحة التحكم العامة
  useEffect(() => {
    if (userRole !== 'admin' && userRole !== 'superadmin') {
      router.replace('/dashboard');
    }
  }, [userRole, router]);

  const updateStatus = (id: string, newStatus: string) => {
    const updated = bookings.map(b => b.id === id ? { ...b, status: newStatus } : b);
    setBookings(updated);
    localStorage.setItem('demo_submitted_bookings', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold gold-gradient-text">مواعيد الدعم عن بعد</h1>
        <p className="text-sm text-slate-500 dark:text-white/40 mt-1">
          إدارة جلسات AnyDesk المحجوزة من قبل المستخدمين
        </p>
      </motion.div>

      {bookings.length === 0 ? (
        <GlassCard className="p-16 text-center" hover={false}>
          <span className="text-5xl block mb-4">📅</span>
          <p className="text-slate-500 dark:text-white/40 text-sm">لا توجد مواعيد محجوزة حالياً</p>
          <p className="text-slate-400 dark:text-white/20 text-xs mt-2">ستظهر هنا طلبات الدعم المباشر عبر AnyDesk</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AnimatePresence>
            {bookings.map((booking, i) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard className="p-5 flex flex-col h-full" hover={false}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-xs text-gold-light font-mono" dir="ltr">{booking.id}</code>
                        <GoldBadge 
                          variant="status" 
                          colorClass={
                            booking.status === 'pending' ? 'text-blue-400 bg-blue-500/10' :
                            booking.status === 'completed' ? 'text-green-400 bg-green-500/10' :
                            'text-red-400 bg-red-500/10'
                          }
                        >
                          {
                            booking.status === 'pending' ? 'في الانتظار' :
                            booking.status === 'completed' ? 'مكتمل' : 'ملغى'
                          }
                        </GoldBadge>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-2">
                        {booking.platform === 'ostad' ? 'فضاء الأستاذ' : booking.platform === 'tawdif' ? 'منصة توظيف' : booking.platform === 'awlyaa' ? 'فضاء الأولياء' : 'أخرى'}
                      </h3>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-slate-800 dark:text-white">{booking.date}</p>
                      <p className="text-lg font-extrabold text-gold-primary">{booking.time}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-white/60 mb-4 line-clamp-2 flex-1">
                    {booking.description}
                  </p>

                  <div className="space-y-2 mb-4 pt-4 border-t border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-white/70">
                      <HiOutlinePhone className="w-4 h-4 text-gold-light" />
                      <span dir="ltr">{booking.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-white/70">
                      <HiOutlineDesktopComputer className="w-4 h-4 text-gold-light" />
                      <span>AnyDesk:</span>
                      <code className="bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded text-blue-400 font-bold tracking-widest" dir="ltr">
                        {booking.anyDeskId || 'لم يحدد بعد'}
                      </code>
                    </div>
                  </div>

                  {booking.status === 'pending' && (
                    <div className="flex gap-2 mt-auto">
                      <button 
                        onClick={() => updateStatus(booking.id, 'completed')}
                        className="flex-1 py-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-500 text-xs font-bold transition-colors border border-green-500/20"
                      >
                        ✔ إنهاء الجلسة
                      </button>
                      <button 
                        onClick={() => updateStatus(booking.id, 'cancelled')}
                        className="flex-1 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold transition-colors border border-red-500/20"
                      >
                        ✖ إلغاء
                      </button>
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
