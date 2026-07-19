/* ═══════════════════════════════
   رافد — Notification Provider
   مزود الإشعارات الهجين (Toast + Drawer + Center)
   ═══════════════════════════════ */

'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  subscribeToAll,
  getDisplayType,
  playNotificationSound,
  EVENT_ICONS,
} from '@/lib/notifications';
import type { RafedNotification, NotificationCategory } from '@/lib/notifications';
import {
  HiOutlineBell,
  HiOutlineX,
  HiOutlineCheck,
  HiOutlineExclamation,
} from 'react-icons/hi';

// ═══════════════════════════════════════════════════════════════════════
// أنواع البيانات
// ═══════════════════════════════════════════════════════════════════════

interface NotificationContextValue {
  /** جميع الإشعارات */
  notifications: RafedNotification[];
  /** عدد الإشعارات غير المقروءة */
  unreadCount: number;
  /** هل اللوحة الجانبية مفتوحة */
  isDrawerOpen: boolean;
  /** فتح/إغلاق اللوحة الجانبية */
  toggleDrawer: () => void;
  /** قراءة إشعار */
  markAsRead: (id: string) => void;
  /** قراءة الكل */
  markAllAsRead: () => void;
  /** حذف إشعار */
  removeNotification: (id: string) => void;
  /** مسح الكل */
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}

// ═══════════════════════════════════════════════════════════════════════
// Toast الفرعي (3 ثوانٍ)
// ═══════════════════════════════════════════════════════════════════════

function NotificationToast({
  notification,
  onDismiss,
}: {
  notification: RafedNotification;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const priorityColors = {
    low: 'border-blue-500/30 bg-blue-500/10',
    normal: 'border-gold-border bg-gold-primary/10',
    high: 'border-orange-500/30 bg-orange-500/10',
    critical: 'border-red-500/30 bg-red-500/10',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start gap-3 px-4 py-3 rounded-2xl border backdrop-blur-xl max-w-sm ${priorityColors[notification.priority]}`}
    >
      <span className="text-xl flex-shrink-0">
        {EVENT_ICONS[notification.category]}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-900 dark:text-white">{notification.title}</p>
        <p className="text-xs text-slate-500 dark:text-white/60 truncate">{notification.message}</p>
      </div>
      <button
        onClick={onDismiss}
        className="text-slate-500 dark:text-white/40 hover:text-slate-700 dark:text-white/80 transition-colors flex-shrink-0"
      >
        <HiOutlineX className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// Drawer الجانبي (للإشعارات المهمة)
// ═══════════════════════════════════════════════════════════════════════

function NotificationDrawer({
  isOpen,
  notifications,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
}: {
  isOpen: boolean;
  notifications: RafedNotification[];
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 bottom-0 w-full sm:w-[420px] bg-white dark:bg-dark-surface/95 backdrop-blur-xl border-r border-gold-border/20 z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/5">
              <div className="flex items-center gap-3">
                <HiOutlineBell className="w-5 h-5 text-gold-light" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">الإشعارات</h2>
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-gold-primary/20 text-gold-light text-xs font-bold">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <>
                    <button
                      onClick={onMarkAllAsRead}
                      className="text-xs text-slate-500 dark:text-white/40 hover:text-slate-600 dark:text-white/70 transition-colors px-2 py-1 rounded"
                    >
                      قراءة الكل
                    </button>
                    <button
                      onClick={onClearAll}
                      className="text-xs text-red-400/60 hover:text-red-400 transition-colors px-2 py-1 rounded"
                    >
                      مسح الكل
                    </button>
                  </>
                )}
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-slate-200 dark:bg-white/10 flex items-center justify-center text-slate-500 dark:text-white/60 hover:text-slate-900 dark:text-white transition-all"
                >
                  <HiOutlineX className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <HiOutlineBell className="w-12 h-12 text-white/10 mb-3" />
                  <p className="text-slate-400 dark:text-white/30 text-sm">لا توجد إشعارات</p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        notification.read
                          ? 'bg-white/3 border-slate-200 dark:border-white/5'
                          : 'bg-gold-primary/5 border-gold-border/20'
                      }`}
                      onClick={() => onMarkAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-lg flex-shrink-0">
                          {EVENT_ICONS[notification.category]}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className={`text-sm font-bold ${notification.read ? 'text-slate-500 dark:text-white/60' : 'text-slate-900 dark:text-white'}`}>
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <div className="w-2 h-2 rounded-full bg-gold-primary flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-white/40">{notification.message}</p>
                          <p className="text-xs text-slate-400 dark:text-white/20 mt-1">
                            {new Date(notification.createdAt).toLocaleString('ar-DZ')}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// المزود الرئيسي
// ═══════════════════════════════════════════════════════════════════════

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<RafedNotification[]>([]);
  const [toasts, setToasts] = useState<RafedNotification[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // ─────────────────────────────────────────────────────────────────
  // الاشتراك في الأحداث عند تسجيل الدخول
  // ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated) {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      return;
    }

    const unsubscribe = subscribeToAll((notification) => {
      // إضافة للقائمة الدائمة
      setNotifications((prev) => [notification, ...prev].slice(0, 100));

      // تحديد نوع العرض
      const displayType = getDisplayType(notification.priority);

      if (displayType === 'toast') {
        setToasts((prev) => [...prev, notification]);
      } else if (displayType === 'drawer') {
        setIsDrawerOpen(true);
        playNotificationSound();
      }
      // 'center' يُضاف فقط للقائمة الدائمة (بدون تنبيه)
    });

    unsubscribeRef.current = unsubscribe;

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [isAuthenticated]);

  // ─────────────────────────────────────────────────────────────────
  // دوال التحكم
  // ─────────────────────────────────────────────────────────────────
  const toggleDrawer = useCallback(() => {
    setIsDrawerOpen((prev) => !prev);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const value: NotificationContextValue = {
    notifications,
    unreadCount,
    isDrawerOpen,
    toggleDrawer,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-20 left-4 z-[100] flex flex-col gap-3 max-w-sm">
        <AnimatePresence>
          {toasts.map((toast) => (
            <NotificationToast
              key={toast.id}
              notification={toast}
              onDismiss={() => removeToast(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isDrawerOpen}
        notifications={notifications}
        onClose={() => setIsDrawerOpen(false)}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
        onClearAll={clearAll}
      />
    </NotificationContext.Provider>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// زر الإشعارات (للـ Navbar)
// ═══════════════════════════════════════════════════════════════════════

export function NotificationBell() {
  const { unreadCount, toggleDrawer } = useNotifications();

  return (
    <button
      onClick={toggleDrawer}
      className="relative w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-slate-200 dark:bg-white/10 flex items-center justify-center transition-all"
      aria-label="الإشعارات"
    >
      <HiOutlineBell className="w-5 h-5 text-slate-500 dark:text-white/60" />
      {unreadCount > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold-primary text-dark-base text-xs font-bold flex items-center justify-center"
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </motion.span>
      )}
    </button>
  );
}
