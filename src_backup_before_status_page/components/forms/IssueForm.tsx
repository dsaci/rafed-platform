/* ═══════════════════════════════
   رافد — Multi-Step Issue Form
   ═══════════════════════════════ */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { GoldButton } from '@/components/ui/GoldButton';
import { WilayaSelect } from '@/components/forms/WilayaSelect';
import { useToast } from '@/components/ui/ToastProvider';
import { supabase } from '@/lib/supabase';
import { USER_TYPES } from '@/lib/constants';
import { issueFormSchema } from '@/lib/validators';
import type { Platform, IssueFormData } from '@/types';

interface IssueFormProps {
  platforms: Platform[];
  preselectedPlatformId?: string;
}

const STEPS = ['اختر المنصة والمعلومات', 'وصف المشكلة', 'معلومات التواصل'];

export function IssueForm({ platforms, preselectedPlatformId }: IssueFormProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<IssueFormData>({
    platform_id: preselectedPlatformId || '',
    user_type: 'teacher',
    wilaya: '',
    description: '',
    contact: '',
    anonymous: false,
  });

  const updateField = <K extends keyof IssueFormData>(key: K, value: IssueFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (!formData.platform_id) newErrors.platform_id = 'يرجى اختيار المنصة';
      if (!formData.wilaya) newErrors.wilaya = 'يرجى اختيار الولاية';
    }
    if (step === 1) {
      if (formData.description.length < 20)
        newErrors.description = 'يجب أن يكون الوصف 20 حرفاً على الأقل';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep((s) => Math.min(s + 1, 2));
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    const result = issueFormSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((e) => {
        if (e.path[0]) fieldErrors[e.path[0] as string] = e.message;
      });
      setErrors(fieldErrors);
      addToast('error', 'يرجى التحقق من البيانات المدخلة');
      return;
    }

    setLoading(true);
    try {
      // Insert issue
      const { data: issue, error: insertError } = await supabase
        .from('issues')
        .insert({
          platform_id: formData.platform_id,
          user_type: formData.user_type,
          wilaya: formData.wilaya,
          description: formData.description,
          contact: formData.contact || null,
          anonymous: formData.anonymous,
        })
        .select('id, ticket_number')
        .single();

      if (insertError) throw insertError;

      // Trigger AI diagnosis in background
      const platform = platforms.find((p) => p.id === formData.platform_id);
      fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issueId: issue.id,
          description: formData.description,
          platformName: platform?.name || '',
          userType: formData.user_type,
          wilaya: formData.wilaya,
        }),
      }).catch(() => {
        // Non-blocking — diagnosis runs in background
      });

      addToast('success', `تم إرسال انشغالك بنجاح — رقم التذكرة: ${issue.ticket_number}`);
      router.push(`/issues/${issue.id}`);
    } catch {
      addToast('error', 'حدث خطأ أثناء إرسال الانشغال. يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-8 px-2">
        {STEPS.map((label, i) => (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                  i <= step
                    ? 'border-gold-primary bg-gold-primary/20 text-gold-light'
                    : 'border-white/10 bg-white/5 text-white/30'
                }`}
              >
                {i + 1}
              </div>
              <span
                className={`text-xs hidden sm:block ${
                  i <= step ? 'text-gold-light' : 'text-white/30'
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 mx-3">
                <div
                  className={`h-0.5 transition-all ${
                    i < step
                      ? 'bg-gradient-to-l from-gold-primary to-gold-light'
                      : 'bg-white/10'
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Form Steps */}
      <GlassCard className="p-6 md:p-8" animate={false} hover={false}>
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-gold-light">اختر المنصة والمعلومات الأساسية</h2>

              {/* Platform Select */}
              <div>
                <label className="block text-sm font-bold text-white/70 mb-2">المنصة</label>
                <select
                  value={formData.platform_id}
                  onChange={(e) => updateField('platform_id', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white transition-all focus:outline-none ${
                    errors.platform_id
                      ? 'border-red-500/50'
                      : 'border-gold-border hover:border-gold-primary/50 focus:border-gold-primary/50'
                  }`}
                >
                  <option value="" className="bg-dark-surface">اختر المنصة...</option>
                  {platforms.map((p) => (
                    <option key={p.id} value={p.id} className="bg-dark-surface">
                      {p.name}
                    </option>
                  ))}
                </select>
                {errors.platform_id && (
                  <p className="mt-1 text-xs text-red-400">{errors.platform_id}</p>
                )}
              </div>

              {/* User Type */}
              <div>
                <label className="block text-sm font-bold text-white/70 mb-3">نوع المستخدم</label>
                <div className="grid grid-cols-2 gap-3">
                  {USER_TYPES.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => updateField('user_type', type.value as IssueFormData['user_type'])}
                      className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                        formData.user_type === type.value
                          ? 'border-gold-primary bg-gold-primary/10 text-gold-light'
                          : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Wilaya */}
              <WilayaSelect
                value={formData.wilaya}
                onChange={(v) => updateField('wilaya', v)}
                error={errors.wilaya}
              />
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-gold-light">صف المشكلة بالتفصيل</h2>
              <p className="text-sm text-white/40">
                اشرح المشكلة التي تواجهها بأكبر قدر ممكن من التفاصيل ليتمكن فريقنا من مساعدتك بشكل أفضل.
              </p>
              <div>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  rows={6}
                  placeholder="مثال: عند محاولة الدخول إلى فضاء الأستاذ تظهر رسالة خطأ..."
                  className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder:text-white/20 transition-all focus:outline-none resize-none ${
                    errors.description
                      ? 'border-red-500/50'
                      : 'border-gold-border hover:border-gold-primary/50 focus:border-gold-primary/50'
                  }`}
                />
                <div className="flex justify-between mt-1">
                  {errors.description && (
                    <p className="text-xs text-red-400">{errors.description}</p>
                  )}
                  <p className="text-xs text-white/20 mr-auto">
                    {formData.description.length}/2000
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-gold-light">معلومات التواصل (اختياري)</h2>
              <p className="text-sm text-white/40">
                يمكنك ترك بريدك الإلكتروني أو رقم هاتفك ليتم إعلامك عند حل المشكلة.
              </p>

              <div>
                <label className="block text-sm font-bold text-white/70 mb-2">
                  البريد الإلكتروني أو رقم الهاتف
                </label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => updateField('contact', e.target.value)}
                  placeholder="example@email.com أو 05XXXXXXXX"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gold-border text-white placeholder:text-white/20 transition-all focus:outline-none hover:border-gold-primary/50 focus:border-gold-primary/50"
                  dir="ltr"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.anonymous}
                  onChange={(e) => updateField('anonymous', e.target.checked)}
                  className="w-5 h-5 rounded border-gold-border bg-white/5 accent-gold-primary"
                />
                <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                  أرسل بشكل مجهول
                </span>
              </label>

              {/* Summary */}
              <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4 space-y-2">
                <h3 className="text-sm font-bold text-white/60">ملخص الانشغال</h3>
                <p className="text-sm text-white/40">
                  <span className="text-gold-light">المنصة:</span>{' '}
                  {platforms.find((p) => p.id === formData.platform_id)?.name || '—'}
                </p>
                <p className="text-sm text-white/40">
                  <span className="text-gold-light">الولاية:</span> {formData.wilaya || '—'}
                </p>
                <p className="text-sm text-white/40">
                  <span className="text-gold-light">الوصف:</span>{' '}
                  {formData.description.slice(0, 100)}
                  {formData.description.length > 100 ? '...' : ''}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
          {step > 0 ? (
            <GoldButton variant="ghost" onClick={handleBack}>
              السابق
            </GoldButton>
          ) : (
            <div />
          )}

          {step < 2 ? (
            <GoldButton onClick={handleNext}>التالي</GoldButton>
          ) : (
            <GoldButton onClick={handleSubmit} loading={loading}>
              إرسال الانشغال
            </GoldButton>
          )}
        </div>
      </GlassCard>
    </div>
  );
}

