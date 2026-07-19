/* ═══════════════════════════════
   رافد — نظام الإشعارات الهجين
   Toast + Drawer + Notification Center
   ═══════════════════════════════ */

import { supabase } from './supabase';

// ═══════════════════════════════════════════════════════════════════════
// أنواع الإشعارات
// ═══════════════════════════════════════════════════════════════════════

export type NotificationPriority = 'low' | 'normal' | 'high' | 'critical';
export type NotificationCategory = 'issues' | 'platforms' | 'system' | 'analytics';

export interface RafedNotification {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  /** هل تم قراءتها */
  read: boolean;
  /** البيانات الإضافية */
  metadata?: Record<string, any>;
  /** رابط الإجراء */
  actionUrl?: string;
  /** وقت الإنشاء */
  createdAt: string;
}

// ═══════════════════════════════════════════════════════════════════════
// أنواع الأحداث
// ═══════════════════════════════════════════════════════════════════════

export type NotificationEvent =
  // أحداث الانشغالات
  | 'issue_created'
  | 'issue_updated'
  | 'issue_resolved'
  | 'issue_closed'
  | 'issue_escalated'
  // أحداث المنصات
  | 'platform_added'
  | 'platform_disabled'
  | 'platform_restored'
  // أحداث النظام
  | 'system_maintenance'
  | 'system_new_feature'
  // أحداث التحليلات
  | 'analytics_daily'
  | 'analytics_weekly';

// ═══════════════════════════════════════════════════════════════════════
// تحديد الأولوية حسب الحدث
// ═══════════════════════════════════════════════════════════════════════

const EVENT_PRIORITY: Record<NotificationEvent, NotificationPriority> = {
  issue_created: 'normal',
  issue_updated: 'low',
  issue_resolved: 'normal',
  issue_closed: 'low',
  issue_escalated: 'high',
  platform_added: 'normal',
  platform_disabled: 'critical',
  platform_restored: 'high',
  system_maintenance: 'critical',
  system_new_feature: 'normal',
  analytics_daily: 'low',
  analytics_weekly: 'low',
};

// ═══════════════════════════════════════════════════════════════════════
// تحديد الفئة حسب الحدث
// ═══════════════════════════════════════════════════════════════════════

const EVENT_CATEGORY: Record<NotificationEvent, NotificationCategory> = {
  issue_created: 'issues',
  issue_updated: 'issues',
  issue_resolved: 'issues',
  issue_closed: 'issues',
  issue_escalated: 'issues',
  platform_added: 'platforms',
  platform_disabled: 'platforms',
  platform_restored: 'platforms',
  system_maintenance: 'system',
  system_new_feature: 'system',
  analytics_daily: 'analytics',
  analytics_weekly: 'analytics',
};

// ═══════════════════════════════════════════════════════════════════════
// رسائل الأحداث بالعربية
// ═══════════════════════════════════════════════════════════════════════

const EVENT_MESSAGES: Record<NotificationEvent, { title: string; message: string }> = {
  issue_created: { title: 'انشغال جديد', message: 'تم إنشاء انشغال جديد' },
  issue_updated: { title: 'تحديث انشغال', message: 'تم تحديث حالة الانشغال' },
  issue_resolved: { title: 'انشغال محلول ✓', message: 'تم حل الانشغال بنجاح' },
  issue_closed: { title: 'انشغال مغلق', message: 'تم إغلاق الانشغال' },
  issue_escalated: { title: '⚠️ انشغال مرفوع', message: 'تم رفع الانشغال للجهة المعنية' },
  platform_added: { title: 'منصة جديدة', message: 'تمت إضافة منصة جديدة' },
  platform_disabled: { title: '🔴 منصة معطلة', message: 'تم تعطيل المنصة مؤقتاً' },
  platform_restored: { title: '🟢 منصة مستعادة', message: 'تم استعادة المنصة' },
  system_maintenance: { title: '🔧 صيانة مجدولة', message: 'صيانة مجدولة للنظام' },
  system_new_feature: { title: '✨ ميزة جديدة', message: 'تمت إضافة ميزة جديدة' },
  analytics_daily: { title: '📊 ملخص يومي', message: 'ملخص الانشغالات اليومي جاهز' },
  analytics_weekly: { title: '📈 ملخص أسبوعي', message: 'ملخص الانشغالات الأسبوعي جاهز' },
};

// ═══════════════════════════════════════════════════════════════════════
// أيقونات الأحداث
// ═══════════════════════════════════════════════════════════════════════

export const EVENT_ICONS: Record<NotificationCategory, string> = {
  issues: '📩',
  platforms: '🖥️',
  system: '⚙️',
  analytics: '📊',
};

// ═══════════════════════════════════════════════════════════════════════
// إنشاء إشعار من حدث
// ═══════════════════════════════════════════════════════════════════════

export function createNotification(
  event: NotificationEvent,
  metadata?: Record<string, any>,
  actionUrl?: string
): RafedNotification {
  const { title, message } = EVENT_MESSAGES[event];
  return {
    id: crypto.randomUUID(),
    title,
    message,
    category: EVENT_CATEGORY[event],
    priority: EVENT_PRIORITY[event],
    read: false,
    metadata,
    actionUrl,
    createdAt: new Date().toISOString(),
  };
}

// ═══════════════════════════════════════════════════════════════════════
// تحديد نوع العرض حسب الأولوية
// Toast (3s) | Drawer (مع صوت) | Notification Center
// ═══════════════════════════════════════════════════════════════════════

export type NotificationDisplayType = 'toast' | 'drawer' | 'center';

export function getDisplayType(priority: NotificationPriority): NotificationDisplayType {
  switch (priority) {
    case 'critical':
      return 'drawer'; // عرض في لوحة جانبية مع صوت
    case 'high':
      return 'drawer'; // عرض في لوحة جانبية
    case 'normal':
      return 'toast'; // إشعار سريع (3 ثوانٍ)
    case 'low':
      return 'center'; // في مركز الإشعارات فقط
    default:
      return 'toast';
  }
}

// ═══════════════════════════════════════════════════════════════════════
// الاشتراك في الأحداث الحقيقية (Supabase Realtime)
// ═══════════════════════════════════════════════════════════════════════

export type NotificationCallback = (notification: RafedNotification) => void;

/**
 * الاشتراك في إشعارات الانشغالات
 */
export function subscribeToIssues(callback: NotificationCallback) {
  const channel = supabase
    .channel('issues-notifications')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'issues' },
      (payload) => {
        const notification = createNotification(
          'issue_created',
          { issueId: payload.new.id, ticketNumber: payload.new.ticket_number },
          `/issues/${payload.new.id}`
        );
        callback(notification);
      }
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'issues' },
      (payload) => {
        const oldStatus = payload.old?.status;
        const newStatus = payload.new.status;

        let event: NotificationEvent = 'issue_updated';
        if (newStatus === 'solved') event = 'issue_resolved';
        else if (newStatus === 'closed') event = 'issue_closed';
        else if (newStatus === 'escalated') event = 'issue_escalated';

        const notification = createNotification(
          event,
          {
            issueId: payload.new.id,
            ticketNumber: payload.new.ticket_number,
            oldStatus,
            newStatus,
          },
          `/issues/${payload.new.id}`
        );
        callback(notification);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * الاشتراك في إشعارات المنصات
 */
export function subscribeToPlatforms(callback: NotificationCallback) {
  const channel = supabase
    .channel('platforms-notifications')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'platforms' },
      (payload) => {
        const notification = createNotification(
          'platform_added',
          { platformId: payload.new.id, platformName: payload.new.name },
          `/platforms/${payload.new.id}`
        );
        callback(notification);
      }
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'platforms' },
      (payload) => {
        const oldStatus = payload.old?.status;
        const newStatus = payload.new.status;

        let event: NotificationEvent = 'platform_added';
        if (newStatus === 'suspended' || newStatus === 'maintenance') {
          event = 'platform_disabled';
        } else if (oldStatus === 'suspended' || oldStatus === 'maintenance') {
          event = 'platform_restored';
        }

        const notification = createNotification(
          event,
          {
            platformId: payload.new.id,
            platformName: payload.new.name,
            oldStatus,
            newStatus,
          },
          `/platforms/${payload.new.id}`
        );
        callback(notification);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * الاشتراك في جميع الإشعارات
 */
export function subscribeToAll(callback: NotificationCallback) {
  const unsubIssues = subscribeToIssues(callback);
  const unsubPlatforms = subscribeToPlatforms(callback);

  return () => {
    unsubIssues();
    unsubPlatforms();
  };
}

// ═══════════════════════════════════════════════════════════════════════
// تشغيل صوت الإشعار
// ═══════════════════════════════════════════════════════════════════════

export function playNotificationSound() {
  try {
    // إنشاء صوت بسيط باستخدام Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch {
    // تجاهل الأخطاء الصوتية
  }
}
