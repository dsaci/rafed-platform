/* رافد — Dashboard Content Management */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { GoldButton } from '@/components/ui/GoldButton';
import { GoldBadge } from '@/components/ui/GoldBadge';
import { Modal } from '@/components/ui/Modal';
import { TableSkeleton } from '@/components/ui/LoadingSkeleton';
import { useToast } from '@/components/ui/ToastProvider';
import { supabase } from '@/lib/supabase';
import { CONTENT_TYPE_LABELS } from '@/lib/constants';
import { generateSlug } from '@/lib/utils';
import type { Content, Platform } from '@/types';

export default function DashboardContentPage() {
  const { addToast } = useToast();
  const [content, setContent] = useState<Content[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', slug: '', type: 'article', platform_id: '', body: '', video_url: '', published: false });

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [c, p] = await Promise.all([
      supabase.from('content').select('*, platform:platforms(*)').order('created_at', { ascending: false }),
      supabase.from('platforms').select('*').order('order_index'),
    ]);
    setContent((c.data as Content[]) || []);
    setPlatforms((p.data as Platform[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const resetForm = () => {
    setForm({ title: '', slug: '', type: 'article', platform_id: '', body: '', video_url: '', published: false });
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!form.title || !form.platform_id) { addToast('error', 'يرجى ملء الحقول المطلوبة'); return; }
    const slug = form.slug || generateSlug(form.title);
    const data = { ...form, slug, tags: [] as string[], published_at: form.published ? new Date().toISOString() : null };

    if (editingId) {
      const { error } = await supabase.from('content').update(data).eq('id', editingId);
      if (error) { addToast('error', 'حدث خطأ'); return; }
      addToast('success', 'تم تحديث المحتوى');
    } else {
      const { error } = await supabase.from('content').insert(data);
      if (error) { addToast('error', `حدث خطأ: ${error.message}`); return; }
      addToast('success', 'تم إضافة المحتوى');
    }
    setShowForm(false);
    resetForm();
    fetchData();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('content').delete().eq('id', id);
    if (error) { addToast('error', 'حدث خطأ'); return; }
    addToast('success', 'تم حذف المحتوى');
    fetchData();
  };

  const openEdit = (item: Content) => {
    setForm({ title: item.title, slug: item.slug, type: item.type, platform_id: item.platform_id || '', body: item.body || '', video_url: item.video_url || '', published: item.published });
    setEditingId(item.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-extrabold gold-gradient-text">إدارة المحتوى</motion.h1>
        <GoldButton onClick={() => { resetForm(); setShowForm(true); }}>+ إضافة محتوى</GoldButton>
      </div>

      {loading ? <TableSkeleton rows={6} /> : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-right text-xs font-bold text-white/40 pb-3 pr-4">العنوان</th>
                <th className="text-right text-xs font-bold text-white/40 pb-3">النوع</th>
                <th className="text-right text-xs font-bold text-white/40 pb-3">المنصة</th>
                <th className="text-right text-xs font-bold text-white/40 pb-3">المشاهدات</th>
                <th className="text-right text-xs font-bold text-white/40 pb-3">الحالة</th>
                <th className="text-right text-xs font-bold text-white/40 pb-3">إجراء</th>
              </tr>
            </thead>
            <tbody>
              {content.map((item) => (
                <tr key={item.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 pr-4 text-sm text-white/70 max-w-[200px] truncate">{item.title}</td>
                  <td className="py-3"><GoldBadge>{CONTENT_TYPE_LABELS[item.type]}</GoldBadge></td>
                  <td className="py-3 text-xs text-white/50">{item.platform?.name || '—'}</td>
                  <td className="py-3 text-xs text-white/40">{item.views}</td>
                  <td className="py-3">
                    <GoldBadge variant="status" colorClass={item.published ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-white/10 text-white/40 border-white/10'}>
                      {item.published ? 'منشور' : 'مسودة'}
                    </GoldBadge>
                  </td>
                  <td className="py-3 flex gap-2">
                    <button onClick={() => openEdit(item)} className="text-xs text-gold-light hover:underline">تعديل</button>
                    <button onClick={() => handleDelete(item.id)} className="text-xs text-red-400 hover:underline">حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {content.length === 0 && <p className="text-center py-8 text-white/30 text-sm">لا يوجد محتوى</p>}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={showForm} onClose={() => { setShowForm(false); resetForm(); }} title={editingId ? 'تعديل المحتوى' : 'إضافة محتوى جديد'} className="max-w-2xl">
        <div className="space-y-4">
          <div>
            <label className="text-xs text-white/40 mb-1 block">العنوان *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: generateSlug(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-gold-border text-white text-sm focus:outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/40 mb-1 block">النوع</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-gold-border text-white text-sm focus:outline-none">
                <option value="article" className="bg-dark-surface">مقال</option>
                <option value="video" className="bg-dark-surface">فيديو</option>
                <option value="faq" className="bg-dark-surface">سؤال وجواب</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">المنصة *</label>
              <select value={form.platform_id} onChange={(e) => setForm({ ...form, platform_id: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-gold-border text-white text-sm focus:outline-none">
                <option value="" className="bg-dark-surface">اختر...</option>
                {platforms.map((p) => <option key={p.id} value={p.id} className="bg-dark-surface">{p.name}</option>)}
              </select>
            </div>
          </div>
          {form.type === 'video' && (
            <div>
              <label className="text-xs text-white/40 mb-1 block">رابط الفيديو</label>
              <input value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} dir="ltr"
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-gold-border text-white text-sm focus:outline-none" />
            </div>
          )}
          <div>
            <label className="text-xs text-white/40 mb-1 block">المحتوى</label>
            <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={6}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-gold-border text-white text-sm focus:outline-none resize-none" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="accent-gold-primary" />
            <span className="text-sm text-white/60">نشر فوراً</span>
          </label>
          <div className="flex gap-3 pt-2">
            <GoldButton onClick={handleSave}>{editingId ? 'حفظ التعديلات' : 'إضافة'}</GoldButton>
            <GoldButton variant="ghost" onClick={() => { setShowForm(false); resetForm(); }}>إلغاء</GoldButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}

