/* ═══════════════════════════════
   رافد — Zod Validators
   ═══════════════════════════════ */

import { z } from 'zod';

export const issueFormSchema = z.object({
  platform_id: z.string().uuid('يرجى اختيار المنصة'),
  user_type: z.enum(['teacher', 'admin', 'parent', 'employee'], {
    errorMap: () => ({ message: 'يرجى اختيار نوع المستخدم' }),
  }),
  wilaya: z.string().min(1, 'يرجى اختيار الولاية'),
  description: z
    .string()
    .min(20, 'يجب أن يكون الوصف 20 حرفاً على الأقل')
    .max(2000, 'يجب ألا يتجاوز الوصف 2000 حرف'),
  contact: z.string().optional(),
  anonymous: z.boolean().default(false),
});

export const contentFormSchema = z.object({
  platform_id: z.string().uuid('يرجى اختيار المنصة'),
  title: z.string().min(5, 'يجب أن يكون العنوان 5 أحرف على الأقل'),
  slug: z.string().min(3, 'يجب أن يكون الرابط 3 أحرف على الأقل'),
  type: z.enum(['video', 'article', 'faq'], {
    errorMap: () => ({ message: 'يرجى اختيار نوع المحتوى' }),
  }),
  body: z.string().optional(),
  video_url: z.string().url('رابط غير صالح').optional().or(z.literal('')),
  thumbnail: z.string().optional(),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
});

export const loginFormSchema = z.object({
  email: z.string().email('بريد إلكتروني غير صالح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
});

export const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

export type IssueFormValues = z.infer<typeof issueFormSchema>;
export type ContentFormValues = z.infer<typeof contentFormSchema>;
export type LoginFormValues = z.infer<typeof loginFormSchema>;

