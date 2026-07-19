/* ═══════════════════════════════
   رافد — إشعاراتي (User Notifications)
   ═══════════════════════════════ */

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { GoldButton } from '@/components/ui/GoldButton';
import { useNotifications } from '@/components/notifications/NotificationProvider';

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, clearAll, unreadCount } = useNotifications();

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold gold-gradient-text">الإشعارات</h1>
          <p className="text-sm text-slate-500 dark:text-white/40 mt-1">
            {unreadCount > 0 ? `لديك ${unreadCount} إشعار غير مقروء` : 'لا توجد إشعارات جديدة'}
          </p>
        </div>
        {notifications.length > 0 && (
          <div className="flex gap-2">
            <GoldButton variant="ghost" className="text-xs" onClick={markAllAsRead}>قراءة الكل</GoldButton>
            <GoldButton variant="ghost" className="text-xs text-red-400" onClick={clearAll}>مسح الكل</GoldButton>
          </div>
        )}
      </motion.div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <GlassCard className="p-16 text-center" hover={false}>
          <span className="text-5xl block mb-4">🔔</span>
          <p className="text-slate-500 dark:text-white/40 text-sm">لا توجد إشعارات حالياً</p>
          <p className="text-slate-400 dark:text-white/20 text-xs mt-2">ستظهر هنا تحديثات تذاكرك وأخبار المنصات</p>
        </GlassCard>
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {notifications.map((n, i) => (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ delay: i * 0.02 }}
              >
                <GlassCard
                  className={`p-4 cursor-pointer transition-all ${!n.read ? 'border-gold-border/40' : ''}`}
                  hover={true}
                  onClick={() => markAsRead(n.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className={`text-sm font-bold ${n.read ? 'text-slate-500 dark:text-white/50' : 'text-slate-900 dark:text-white'}`}>
                          {n.title}
                        </p>
                        {!n.read && <div className="w-2 h-2 rounded-full bg-gold-primary flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-white/40">{n.message}</p>
                      <p className="text-[10px] text-slate-400 dark:text-white/20 mt-1">
                        {new Date(n.createdAt).toLocaleString('ar-DZ')}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
