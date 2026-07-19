/* ═══════════════════════════════
   رافد — Middleware — حماية الصفحات
   Uses @supabase/ssr (modern approach)
   مع دعم Smart Redirect و Email Verification
   ═══════════════════════════════ */

import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ═══════════════════════════════════════════════════════════════════════
// المسارات العامة (لا تحتاج تسجيل دخول)
// ═══════════════════════════════════════════════════════════════════════
const PUBLIC_ROUTES = [
  '/',
  '/auth/signin',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/verify-email',
  '/auth/reset-password',
  '/auth/error',
  '/platforms',
  '/content',
  '/issues',
];

// ═══════════════════════════════════════════════════════════════════════
// المسارات المحمية (تحتاج تسجيل دخول)
// ═══════════════════════════════════════════════════════════════════════
const PROTECTED_ROUTES = [
  '/dashboard',
  '/issues/new',
  '/profile',
  '/admin',
];

// ═══════════════════════════════════════════════════════════════════════
// المسارات التي تتطلب التحقق من البريد الإلكتروني
// ═══════════════════════════════════════════════════════════════════════
const EMAIL_VERIFICATION_REQUIRED = [
  '/issues/new',
  '/dashboard',
  '/admin',
];

// ═══════════════════════════════════════════════════════════════════════
// المسارات التي تتطلب صلاحيات المدير
// ═══════════════════════════════════════════════════════════════════════
const ADMIN_ROUTES = ['/admin'];

// ═══════════════════════════════════════════════════════════════════════
// Rate Limiting Store (في الذاكرة)
// ═══════════════════════════════════════════════════════════════════════
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 3600000; // ساعة واحدة

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

// ═══════════════════════════════════════════════════════════════════════
// Middleware الرئيسي
// ═══════════════════════════════════════════════════════════════════════
export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: { headers: req.headers },
  });

  const pathname = req.nextUrl.pathname;

  // ─────────────────────────────────────────────────────────────────
  // 1. Rate Limiting على مسار تسجيل الدخول
  // ─────────────────────────────────────────────────────────────────
  if (pathname === '/auth/signin' && req.method === 'POST') {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') || 'unknown';
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'محاولات كثيرة جداً. حاول بعد ساعة' },
        { status: 429 }
      );
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // 2. تجاوز المسارات العامة
  // ─────────────────────────────────────────────────────────────────
  const isPublicRoute = PUBLIC_ROUTES.some(route => {
    if (route === '/') return pathname === '/';
    return pathname === route || pathname.startsWith(route + '/');
  });

  // تجاوز ملفات static و API
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/fonts') ||
    pathname.includes('.') ||
    isPublicRoute
  ) {
    return res;
  }

  // ─────────────────────────────────────────────────────────────────
  // 3. التحقق من المصادقة للمسارات المحمية
  // ─────────────────────────────────────────────────────────────────
  const isProtectedRoute = PROTECTED_ROUTES.some(route =>
    pathname.startsWith(route)
  );

  if (!isProtectedRoute) {
    return res;
  }

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
            cookiesToSet.forEach(({ name, value }) =>
              req.cookies.set(name, value)
            );
            res = NextResponse.next({
              request: { headers: req.headers },
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              res.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // ─────────────────────────────────────────────────────────────
    // 4. مستخدم غير مسجل → Smart Redirect إلى تسجيل الدخول
    // ─────────────────────────────────────────────────────────────
    if (!user) {
      const signinUrl = new URL('/auth/signin', req.url);
      signinUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(signinUrl);
    }

    // ─────────────────────────────────────────────────────────────
    // 5. التحقق من تأكيد البريد الإلكتروني
    // ─────────────────────────────────────────────────────────────
    const requiresVerification = EMAIL_VERIFICATION_REQUIRED.some(route =>
      pathname.startsWith(route)
    );

    if (requiresVerification && !user.email_confirmed_at) {
      const verifyUrl = new URL('/auth/verify-email', req.url);
      verifyUrl.searchParams.set('redirect', pathname);
      verifyUrl.searchParams.set('email', user.email || '');
      return NextResponse.redirect(verifyUrl);
    }

    // ─────────────────────────────────────────────────────────────
    // 6. التحقق من صلاحيات المدير
    // ─────────────────────────────────────────────────────────────
    const isAdminRoute = ADMIN_ROUTES.some(route =>
      pathname.startsWith(route)
    );

    if (isAdminRoute) {
      // التحقق من الدور من metadata المستخدم
      const userRole = user.user_metadata?.role || 'user';
      if (userRole !== 'admin' && userRole !== 'superadmin') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }
  } catch {
    // ─────────────────────────────────────────────────────────────
    // 7. خطأ في المصادقة → إعادة التوجيه لتسجيل الدخول
    // ─────────────────────────────────────────────────────────────
    const signinUrl = new URL('/auth/signin', req.url);
    signinUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signinUrl);
  }

  return res;
}

// ═══════════════════════════════════════════════════════════════════════
// Matcher - المسارات التي يعمل عليها الـ Middleware
// ═══════════════════════════════════════════════════════════════════════
export const config = {
  matcher: [
    /*
     * تطبيق على جميع المسارات ما عدا:
     * - _next/static (ملفات ثابتة)
     * - _next/image (تحسين الصور)
     * - favicon.ico
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

