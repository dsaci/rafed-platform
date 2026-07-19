/* ═══════════════════════════════════════════════════════
   رافد — وحدة المصادقة الأساسية
   Auth Core Utilities
   ═══════════════════════════════════════════════════════ */

// ─── إعادة تصدير عميل Supabase ───
export { supabase, createServiceClient } from './supabase';

import { NextRequest } from 'next/server';

// ═══════════════════════════════════════════════════════
// تشفير كلمات المرور — Password Hashing (PBKDF2)
// ═══════════════════════════════════════════════════════

/** عدد جولات الاشتقاق — كلما زاد العدد زادت الحماية وبطء الحساب */
const PBKDF2_ITERATIONS = 100_000;

/** طول المفتاح المشتق بالبايت */
const KEY_LENGTH = 64;

/** طول الملح العشوائي بالبايت */
const SALT_LENGTH = 32;

/** خوارزمية التجزئة المستخدمة */
const HASH_ALGORITHM = 'SHA-512';

/**
 * تحويل مصفوفة بايت إلى سلسلة hex
 * @param buffer - مصفوفة البايت المراد تحويلها
 */
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * تحويل سلسلة hex إلى مصفوفة بايت
 * @param hex - السلسلة المراد تحويلها
 */
function hexToBuffer(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

/**
 * تشفير كلمة المرور باستخدام PBKDF2
 * يُنشئ ملحاً عشوائياً ويُرجع السلسلة بالصيغة: iterations.salt.hash
 *
 * @param password - كلمة المرور المراد تشفيرها
 * @returns سلسلة مشفرة بالصيغة "iterations.salt.hash"
 */
export async function hashPassword(password: string): Promise<string> {
  // توليد ملح عشوائي
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));

  // استيراد كلمة المرور كمفتاح خام
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  // اشتقاق المفتاح من كلمة المرور والملح
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: HASH_ALGORITHM,
    },
    keyMaterial,
    KEY_LENGTH * 8 // بالبت وليس البايت
  );

  const hashHex = bufferToHex(derivedBits);
  const saltHex = bufferToHex(salt.buffer);

  return `${PBKDF2_ITERATIONS}.${saltHex}.${hashHex}`;
}

/**
 * التحقق من كلمة المرور مقابل التجزئة المخزنة
 *
 * @param password - كلمة المرور المُدخلة
 * @param storedHash - التجزئة المخزنة بالصيغة "iterations.salt.hash"
 * @returns true إذا تطابقت كلمة المرور
 */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  const [iterationsStr, saltHex, originalHash] = storedHash.split('.');

  if (!iterationsStr || !saltHex || !originalHash) {
    return false;
  }

  const iterations = parseInt(iterationsStr, 10);
  const salt = hexToBuffer(saltHex);

  // استيراد كلمة المرور كمفتاح خام
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  // اشتقاق المفتاح بنفس المعاملات
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt.buffer as ArrayBuffer,
      iterations,
      hash: HASH_ALGORITHM,
    },
    keyMaterial,
    KEY_LENGTH * 8
  );

  const newHash = bufferToHex(derivedBits);

  // مقارنة آمنة ضد هجمات التوقيت — Timing-safe comparison
  if (newHash.length !== originalHash.length) {
    return false;
  }

  let mismatch = 0;
  for (let i = 0; i < newHash.length; i++) {
    mismatch |= newHash.charCodeAt(i) ^ originalHash.charCodeAt(i);
  }

  return mismatch === 0;
}

// ═══════════════════════════════════════════════════════
// تحديد المعدل — Rate Limiting
// ═══════════════════════════════════════════════════════

/** الحد الأقصى للمحاولات لكل عنوان IP في الساعة */
const MAX_ATTEMPTS = 5;

/** مدة النافذة الزمنية بالملي ثانية (ساعة واحدة) */
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

/** سجل محاولات تسجيل الدخول لكل عنوان IP */
interface RateLimitEntry {
  /** عدد المحاولات */
  count: number;
  /** وقت بداية النافذة الزمنية */
  windowStart: number;
}

/**
 * مخزن تحديد المعدل في الذاكرة
 * ملاحظة: في بيئة الإنتاج متعددة الخوادم، استخدم Redis بدلاً من ذلك
 */
const rateLimitStore = new Map<string, RateLimitEntry>();

/** واجهة نتيجة فحص تحديد المعدل */
export interface RateLimitResult {
  /** هل تم تجاوز الحد المسموح */
  limited: boolean;
  /** عدد المحاولات المتبقية */
  remaining: number;
  /** وقت إعادة التعيين (Unix timestamp بالملي ثانية) */
  resetAt: number;
}

/**
 * فحص تحديد المعدل لعنوان IP معين
 * يسمح بـ 5 محاولات في الساعة لكل عنوان IP
 *
 * @param identifier - عنوان IP أو معرف فريد آخر
 * @returns نتيجة فحص تحديد المعدل
 */
export function checkRateLimit(identifier: string): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // إذا لم يكن هناك سجل سابق أو انتهت النافذة الزمنية
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(identifier, { count: 1, windowStart: now });
    return {
      limited: false,
      remaining: MAX_ATTEMPTS - 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    };
  }

  // زيادة العداد
  entry.count += 1;

  if (entry.count > MAX_ATTEMPTS) {
    return {
      limited: true,
      remaining: 0,
      resetAt: entry.windowStart + RATE_LIMIT_WINDOW_MS,
    };
  }

  return {
    limited: false,
    remaining: MAX_ATTEMPTS - entry.count,
    resetAt: entry.windowStart + RATE_LIMIT_WINDOW_MS,
  };
}

/**
 * إعادة تعيين عداد تحديد المعدل لعنوان IP معين
 * يُستخدم بعد تسجيل دخول ناجح
 *
 * @param identifier - عنوان IP أو معرف فريد
 */
export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
}

/**
 * تنظيف السجلات المنتهية من مخزن تحديد المعدل
 * يُنفّذ دورياً لمنع تسرب الذاكرة
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  rateLimitStore.forEach((entry, key) => {
    if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
      rateLimitStore.delete(key);
    }
  });
}

// تنظيف دوري كل 10 دقائق
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimitStore, 10 * 60 * 1000);
}

// ═══════════════════════════════════════════════════════
// التحقق من كلمة المرور — Password Validation
// ═══════════════════════════════════════════════════════

/** واجهة نتيجة التحقق من كلمة المرور */
export interface PasswordValidationResult {
  /** هل كلمة المرور صالحة */
  valid: boolean;
  /** قائمة الأخطاء بالعربية */
  errors: string[];
}

/**
 * التحقق من قوة كلمة المرور
 * المتطلبات: 8 أحرف على الأقل، حرف كبير، حرف صغير، رقم، رمز خاص
 *
 * @param password - كلمة المرور المراد فحصها
 * @returns نتيجة التحقق مع رسائل الخطأ بالعربية
 */
export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];

  if (!password || password.length < 8) {
    errors.push('يجب أن تكون كلمة المرور 8 أحرف على الأقل');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('يجب أن تحتوي على حرف كبير واحد على الأقل');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('يجب أن تحتوي على حرف صغير واحد على الأقل');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('يجب أن تحتوي على رقم واحد على الأقل');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)) {
    errors.push('يجب أن تحتوي على رمز خاص واحد على الأقل (!@#$%...)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ═══════════════════════════════════════════════════════
// التحقق من البريد الإلكتروني — Email Validation
// ═══════════════════════════════════════════════════════

/**
 * نمط التحقق من صيغة البريد الإلكتروني
 * يدعم معظم الصيغ القياسية وفقاً لـ RFC 5322 (مبسّط)
 */
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * التحقق من صحة عنوان البريد الإلكتروني
 *
 * @param email - عنوان البريد الإلكتروني
 * @returns true إذا كانت الصيغة صحيحة
 */
export function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) {
    return false;
  }

  return EMAIL_REGEX.test(email.trim().toLowerCase());
}

/**
 * تنظيف وتوحيد عنوان البريد الإلكتروني
 *
 * @param email - عنوان البريد الإلكتروني
 * @returns البريد الإلكتروني بعد التنظيف
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// ═══════════════════════════════════════════════════════
// إعدادات الجلسة — Session Configuration
// ═══════════════════════════════════════════════════════

/** إعدادات الجلسة الافتراضية */
export const SESSION_CONFIG = {
  /** مدة الجلسة بالثواني (30 يوم) */
  maxAge: 30 * 24 * 60 * 60,

  /** تأمين الكوكيز في بيئة الإنتاج فقط */
  secure: process.env.NODE_ENV === 'production',

  /** منع الوصول من JavaScript للحماية من XSS */
  httpOnly: true,

  /** سياسة إرسال الكوكيز مع الطلبات عبر المواقع */
  sameSite: 'lax' as const,

  /** مسار الكوكيز */
  path: '/',
} as const;

/** اسم كوكي الجلسة */
export const SESSION_COOKIE_NAME = 'rafed-session';

/** اسم كوكي CSRF */
export const CSRF_COOKIE_NAME = 'rafed-csrf';

// ═══════════════════════════════════════════════════════
// دوال مساعدة للطلبات — Request Helper Functions
// ═══════════════════════════════════════════════════════

/**
 * استخراج عنوان IP العميل من الطلب
 * يتحقق من رؤوس الوكيل العكسي أولاً ثم يرجع للقيمة الافتراضية
 *
 * @param request - كائن الطلب (NextRequest أو Request)
 * @returns عنوان IP العميل
 */
export function getClientIP(request: Request | NextRequest): string {
  // رأس Cloudflare
  const cfIP = request.headers.get('cf-connecting-ip');
  if (cfIP) return cfIP;

  // رأس X-Forwarded-For (أول عنوان IP في السلسلة)
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const firstIP = forwardedFor.split(',')[0]?.trim();
    if (firstIP) return firstIP;
  }

  // رأس X-Real-IP
  const realIP = request.headers.get('x-real-ip');
  if (realIP) return realIP;

  // القيمة الافتراضية
  return '0.0.0.0';
}

/**
 * استخراج معلومات وكيل المستخدم من الطلب
 *
 * @param request - كائن الطلب
 * @returns سلسلة وكيل المستخدم أو 'unknown'
 */
export function getUserAgent(request: Request | NextRequest): string {
  return request.headers.get('user-agent') || 'unknown';
}

