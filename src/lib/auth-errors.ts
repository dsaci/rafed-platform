/* ═══════════════════════════════════════════════════════
   رافد — أخطاء المصادقة
   Auth Error Definitions & Handling
   ═══════════════════════════════════════════════════════ */

// ═══════════════════════════════════════════════════════
// فئة خطأ المصادقة — AuthError Class
// ═══════════════════════════════════════════════════════

/**
 * فئة خطأ مخصصة لأخطاء المصادقة
 * تمتد من Error وتضيف رمز الخطأ ورمز الحالة ورسالة المستخدم
 *
 * @example
 * throw new AuthError(
 *   'Invalid credentials provided',
 *   'INVALID_CREDENTIALS',
 *   401,
 *   'البريد الإلكتروني أو كلمة المرور غير صحيحة'
 * );
 */
export class AuthError extends Error {
  /** رمز الخطأ الفريد (مثل: INVALID_CREDENTIALS) */
  public readonly code: string;

  /** رمز حالة HTTP (مثل: 401, 403, 409) */
  public readonly statusCode: number;

  /** رسالة مخصصة للمستخدم بالعربية */
  public readonly userMessage: string;

  constructor(
    message: string,
    code: string,
    statusCode: number,
    userMessage: string
  ) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
    this.statusCode = statusCode;
    this.userMessage = userMessage;

    // الحفاظ على سلسلة النموذج الأولي في TypeScript
    Object.setPrototypeOf(this, AuthError.prototype);
  }

  /**
   * تحويل الخطأ إلى كائن JSON آمن للإرسال إلى العميل
   * لا يتضمن تفاصيل فنية حساسة
   */
  toJSON() {
    return {
      error: {
        code: this.code,
        message: this.userMessage,
        statusCode: this.statusCode,
      },
    };
  }
}

// ═══════════════════════════════════════════════════════
// ثوابت الأخطاء — Error Constants
// ═══════════════════════════════════════════════════════

/** واجهة تعريف الخطأ */
interface AuthErrorDefinition {
  /** رمز الخطأ الفريد */
  code: string;
  /** رمز حالة HTTP */
  statusCode: number;
  /** رسالة فنية بالإنجليزية (للسجلات) */
  message: string;
  /** رسالة المستخدم بالعربية */
  userMessage: string;
}

/**
 * قائمة أخطاء المصادقة المعرّفة مسبقاً
 * كل خطأ يحتوي على رمز فريد، رمز حالة HTTP، ورسائل بالعربية والإنجليزية
 */
export const AUTH_ERRORS = {
  /** بيانات الاعتماد غير صحيحة (بريد إلكتروني أو كلمة مرور خاطئة) */
  INVALID_CREDENTIALS: {
    code: 'INVALID_CREDENTIALS',
    statusCode: 401,
    message: 'Invalid email or password',
    userMessage: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
  },

  /** البريد الإلكتروني لم يتم التحقق منه بعد */
  EMAIL_NOT_VERIFIED: {
    code: 'EMAIL_NOT_VERIFIED',
    statusCode: 403,
    message: 'Email not verified',
    userMessage: 'يرجى التحقق من بريدك الإلكتروني أولاً',
  },

  /** المستخدم غير موجود في قاعدة البيانات */
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    statusCode: 404,
    message: 'User not found',
    userMessage: 'المستخدم غير موجود',
  },

  /** البريد الإلكتروني مسجل مسبقاً */
  EMAIL_ALREADY_EXISTS: {
    code: 'EMAIL_ALREADY_EXISTS',
    statusCode: 409,
    message: 'Email already registered',
    userMessage: 'هذا البريد مسجل بالفعل',
  },

  /** كلمة المرور لا تستوفي متطلبات القوة */
  WEAK_PASSWORD: {
    code: 'WEAK_PASSWORD',
    statusCode: 400,
    message: 'Password does not meet requirements',
    userMessage: 'كلمة المرور ضعيفة',
  },

  /** انتهت صلاحية الجلسة */
  SESSION_EXPIRED: {
    code: 'SESSION_EXPIRED',
    statusCode: 401,
    message: 'Session has expired',
    userMessage: 'انتهت جلستك، يرجى تسجيل الدخول مرة أخرى',
  },

  /** تجاوز حد المحاولات المسموح */
  RATE_LIMIT_EXCEEDED: {
    code: 'RATE_LIMIT_EXCEEDED',
    statusCode: 429,
    message: 'Too many attempts, please try again later',
    userMessage: 'محاولات كثيرة جداً، يرجى المحاولة لاحقاً',
  },

  /** رابط التحقق أو إعادة التعيين غير صالح أو منتهي */
  INVALID_TOKEN: {
    code: 'INVALID_TOKEN',
    statusCode: 400,
    message: 'Invalid or expired token',
    userMessage: 'رابط غير صحيح أو منتهي الصلاحية',
  },

  /** فشل التحقق من رمز CSRF */
  CSRF_TOKEN_INVALID: {
    code: 'CSRF_TOKEN_INVALID',
    statusCode: 403,
    message: 'CSRF token validation failed',
    userMessage: 'فشل التحقق من الأمان، يرجى إعادة المحاولة',
  },

  /** الحساب مقفول بسبب محاولات فاشلة متعددة */
  ACCOUNT_LOCKED: {
    code: 'ACCOUNT_LOCKED',
    statusCode: 403,
    message: 'Account has been locked due to multiple failed attempts',
    userMessage: 'الحساب مقفول مؤقتاً بسبب محاولات فاشلة متعددة',
  },
} as const satisfies Record<string, AuthErrorDefinition>;

// ═══════════════════════════════════════════════════════
// أنواع مشتقة — Derived Types
// ═══════════════════════════════════════════════════════

/** نوع رموز الأخطاء المتاحة */
export type AuthErrorCode = keyof typeof AUTH_ERRORS;

// ═══════════════════════════════════════════════════════
// دوال مساعدة — Helper Functions
// ═══════════════════════════════════════════════════════

/**
 * الحصول على رسالة الخطأ بالعربية من رمز الخطأ
 * يُرجع رسالة افتراضية إذا لم يُعثر على الرمز
 *
 * @param code - رمز الخطأ (مثل: 'INVALID_CREDENTIALS')
 * @returns رسالة الخطأ بالعربية
 */
export function getAuthErrorMessage(code: string): string {
  const errorDef = AUTH_ERRORS[code as AuthErrorCode];

  if (errorDef) {
    return errorDef.userMessage;
  }

  // رسالة افتراضية للأخطاء غير المعرّفة
  return 'حدث خطأ غير متوقع، يرجى المحاولة لاحقاً';
}

/**
 * إنشاء كائن AuthError من تعريف خطأ مسبق
 * اختصار لإنشاء أخطاء شائعة
 *
 * @param errorCode - رمز الخطأ من AUTH_ERRORS
 * @returns كائن AuthError جاهز للرمي
 *
 * @example
 * throw createAuthError('INVALID_CREDENTIALS');
 */
export function createAuthError(errorCode: AuthErrorCode): AuthError {
  const def = AUTH_ERRORS[errorCode];
  return new AuthError(def.message, def.code, def.statusCode, def.userMessage);
}

/**
 * التحقق مما إذا كان الخطأ من نوع AuthError
 *
 * @param error - الخطأ المراد فحصه
 * @returns true إذا كان الخطأ من نوع AuthError
 */
export function isAuthError(error: unknown): error is AuthError {
  return error instanceof AuthError;
}
