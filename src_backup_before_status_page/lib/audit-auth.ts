/* ═══════════════════════════════════════════════════════
   رافد — سجل تدقيق المصادقة
   Auth Audit Logging
   ═══════════════════════════════════════════════════════ */

import { supabase } from './supabase';
import { getClientIP, getUserAgent } from './auth';

// ═══════════════════════════════════════════════════════
// أنواع أحداث المصادقة — Auth Event Types
// ═══════════════════════════════════════════════════════

/**
 * أنواع أحداث المصادقة التي يتم تسجيلها في سجل التدقيق
 *
 * - login: تسجيل دخول ناجح
 * - logout: تسجيل خروج
 * - signup: إنشاء حساب جديد
 * - email_verified: تأكيد البريد الإلكتروني
 * - failed_login: محاولة تسجيل دخول فاشلة
 * - password_reset: طلب إعادة تعيين كلمة المرور
 * - password_changed: تغيير كلمة المرور بنجاح
 * - account_locked: قفل الحساب بسبب محاولات فاشلة
 */
export type AuthEventType =
  | 'login'
  | 'logout'
  | 'signup'
  | 'email_verified'
  | 'failed_login'
  | 'password_reset'
  | 'password_changed'
  | 'account_locked';

// ═══════════════════════════════════════════════════════
// واجهات البيانات — Data Interfaces
// ═══════════════════════════════════════════════════════

/** واجهة حدث التدقيق المُسجّل */
export interface AuditLogEntry {
  /** نوع الحدث */
  event_type: AuthEventType;
  /** معرّف المستخدم (UUID) — قد يكون null للأحداث الفاشلة */
  user_id: string | null;
  /** عنوان IP العميل */
  ip_address: string;
  /** معلومات وكيل المستخدم (المتصفح/الجهاز) */
  user_agent: string;
  /** بيانات إضافية متعلقة بالحدث */
  metadata?: Record<string, unknown>;
  /** الطابع الزمني — يتم تعيينه تلقائياً من Supabase */
  created_at?: string;
}

// ═══════════════════════════════════════════════════════
// دوال التسجيل — Logging Functions
// ═══════════════════════════════════════════════════════

/**
 * تسجيل حدث مصادقة في جدول audit_logs
 * يُستخدم لتتبع جميع أنشطة المصادقة لأغراض الأمان والتدقيق
 *
 * @param eventType - نوع الحدث (مثل: 'login', 'failed_login')
 * @param userId - معرّف المستخدم (null للأحداث بدون مستخدم محدد)
 * @param ipAddress - عنوان IP العميل
 * @param userAgent - سلسلة وكيل المستخدم
 * @param metadata - بيانات إضافية اختيارية (مثل: سبب الفشل، البريد المُستخدم)
 *
 * @example
 * await logAuthEvent('login', 'user-uuid', '192.168.1.1', 'Mozilla/5.0...', {
 *   method: 'email',
 * });
 *
 * @example
 * await logAuthEvent('failed_login', null, '10.0.0.1', 'curl/7.68', {
 *   email: 'attacker@example.com',
 *   reason: 'INVALID_CREDENTIALS',
 * });
 */
export async function logAuthEvent(
  eventType: AuthEventType,
  userId: string | null,
  ipAddress: string,
  userAgent: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  try {
    const entry: AuditLogEntry = {
      event_type: eventType,
      user_id: userId,
      ip_address: ipAddress,
      user_agent: userAgent,
      ...(metadata && { metadata }),
    };

    const { error } = await supabase.from('audit_logs').insert(entry);

    if (error) {
      // تسجيل الخطأ في وحدة التحكم دون إيقاف العملية الأصلية
      console.error(
        `[رافد | تدقيق] فشل تسجيل حدث ${eventType}:`,
        error.message
      );
    }
  } catch (err) {
    // لا نريد أن يفشل تسجيل الدخول بسبب فشل التدقيق
    console.error(
      '[رافد | تدقيق] خطأ غير متوقع أثناء تسجيل الحدث:',
      err instanceof Error ? err.message : err
    );
  }
}

/**
 * تسجيل حدث مصادقة مع استخراج عنوان IP ووكيل المستخدم تلقائياً من الطلب
 * اختصار لاستخدامه في مسارات API
 *
 * @param eventType - نوع الحدث
 * @param userId - معرّف المستخدم (أو null)
 * @param request - كائن الطلب (Request أو NextRequest)
 * @param metadata - بيانات إضافية اختيارية
 *
 * @example
 * // في مسار API
 * export async function POST(request: NextRequest) {
 *   // ... منطق تسجيل الدخول ...
 *   await logAuthEventFromRequest('login', user.id, request, {
 *     method: 'email',
 *   });
 * }
 */
export async function logAuthEventFromRequest(
  eventType: AuthEventType,
  userId: string | null,
  request: Request,
  metadata?: Record<string, unknown>
): Promise<void> {
  const ipAddress = getClientIP(request);
  const userAgent = getUserAgent(request);

  await logAuthEvent(eventType, userId, ipAddress, userAgent, metadata);
}

/**
 * تسجيل محاولة تسجيل دخول فاشلة مع البريد الإلكتروني وسبب الفشل
 * اختصار متخصص للمحاولات الفاشلة
 *
 * @param request - كائن الطلب
 * @param email - البريد الإلكتروني المُستخدم في المحاولة
 * @param reason - رمز سبب الفشل (مثل: 'INVALID_CREDENTIALS')
 */
export async function logFailedLogin(
  request: Request,
  email: string,
  reason: string
): Promise<void> {
  await logAuthEventFromRequest('failed_login', null, request, {
    email,
    reason,
    timestamp: new Date().toISOString(),
  });
}

/**
 * تسجيل قفل حساب بسبب محاولات فاشلة متعددة
 *
 * @param request - كائن الطلب
 * @param userId - معرّف المستخدم المقفول
 * @param email - البريد الإلكتروني للحساب المقفول
 */
export async function logAccountLocked(
  request: Request,
  userId: string,
  email: string
): Promise<void> {
  await logAuthEventFromRequest('account_locked', userId, request, {
    email,
    locked_at: new Date().toISOString(),
  });
}
