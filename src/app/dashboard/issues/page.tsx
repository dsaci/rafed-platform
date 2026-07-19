/* رافد — Dashboard Issues Page */
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { GoldButton } from '@/components/ui/GoldButton';
import { GoldBadge } from '@/components/ui/GoldBadge';
import { Modal } from '@/components/ui/Modal';
import { TableSkeleton } from '@/components/ui/LoadingSkeleton';
import { useToast } from '@/components/ui/ToastProvider';
import { supabase } from '@/lib/supabase';
import { ISSUE_STATUS_LABELS, ISSUE_STATUS_COLORS, PRIORITY_LABELS, PRIORITY_COLORS, WILAYAS } from '@/lib/constants';
import { formatRelativeTime, truncate, generateSlug } from '@/lib/utils';
import type { Issue, IssueStatus } from '@/types';

export default function DashboardIssuesPage() {
  const { addToast } = useToast();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [newStatus, setNewStatus] = useState<IssueStatus>('new');
  const [solution, setSolution] = useState('');

  const fetchIssues = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from('issues').select('*, platform:platforms(*)').order('created_at', { ascending: false });
      setIssues((data as Issue[]) || []);
    } catch (error) {
      console.error('Failed to fetch issues:', error);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchIssues(); }, [fetchIssues]);

  const filtered = useMemo(() => {
    return issues.filter((i) => {
      if (statusFilter !== 'all' && i.status !== statusFilter) return false;
      if (search && !i.description.includes(search) && !i.ticket_number.includes(search) && !i.wilaya.includes(search)) return false;
      return true;
    });
  }, [issues, statusFilter, search]);

  const updateIssue = async () => {
    if (!selectedIssue) return;
    const updates: Record<string, string | null> = { status: newStatus };
    if (solution) updates.solution = solution;
    if (newStatus === 'solved') updates.resolved_at = new Date().toISOString();

    const { error } = await supabase.from('issues').update(updates).eq('id', selectedIssue.id);
    if (error) { addToast('error', 'حدث خطأ'); return; }
    addToast('success', 'تم تحديث الانشغال بنجاح');
    setSelectedIssue(null);
    setSolution('');
    fetchIssues();
  };

  const convertToArticle = async () => {
    if (!selectedIssue || !selectedIssue.solution) {
      addToast('error', 'يجب أن يحتوي الانشغال على حل أولاً للتمكن من تحويله.');
      return;
    }
    
    // استخلاص عنوان مناسب من بداية الوصف
    let titleText = selectedIssue.description.split('\n')[0].trim();
    if (titleText.length > 50) titleText = titleText.substring(0, 50) + '...';
    
    const slug = generateSlug(titleText + '-' + selectedIssue.ticket_number);
    const body = `**السؤال:**\n${selectedIssue.description}\n\n**الحل:**\n${selectedIssue.solution}`;
    
    const data = {
      title: titleText,
      slug: slug,
      type: 'faq',
      platform_id: selectedIssue.platform_id,
      body: body,
      published: true,
      published_at: new Date().toISOString(),
      tags: ['faq', 'تحويل-آلي']
    };
    
    const { error } = await supabase.from('content').insert(data);
    if (error) { 
      addToast('error', `حدث خطأ أثناء التحويل: ${error.message}`); 
    } else { 
      addToast('success', 'تم تحويل الانشغال إلى مقال بنجاح وتم نشره في المكتبة!'); 
    }
  };

  return (
    <div className="space-y-6">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-extrabold gold-gradient-text">
        إدارة الانشغالات
      </motion.h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث بالوصف أو رقم التذكرة..."
          className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-gold-border text-white placeholder:text-white/20 focus:outline-none focus:border-gold-primary/50" />
        <div className="flex gap-2 flex-wrap">
          {['all', 'new', 'processing', 'solved', 'escalated'].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${statusFilter === s ? 'bg-gold-primary/10 text-gold-light border border-gold-border' : 'text-white/40 border border-transparent'}`}>
              {s === 'all' ? 'الكل' : ISSUE_STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Issues Table */}
      {loading ? <TableSkeleton rows={8} /> : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-right text-xs font-bold text-white/40 pb-3 pr-4">التذكرة</th>
                <th className="text-right text-xs font-bold text-white/40 pb-3">المنصة</th>
                <th className="text-right text-xs font-bold text-white/40 pb-3">الولاية</th>
                <th className="text-right text-xs font-bold text-white/40 pb-3">الأولوية</th>
                <th className="text-right text-xs font-bold text-white/40 pb-3">الحالة</th>
                <th className="text-right text-xs font-bold text-white/40 pb-3">التاريخ</th>
                <th className="text-right text-xs font-bold text-white/40 pb-3">إجراء</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((issue) => (
                <tr key={issue.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 pr-4"><code className="text-xs text-gold-light" dir="ltr">{issue.ticket_number}</code></td>
                  <td className="py-3 text-xs text-white/60 max-w-[120px] truncate">{issue.platform?.name || '—'}</td>
                  <td className="py-3 text-xs text-white/60">{issue.wilaya}</td>
                  <td className="py-3"><GoldBadge variant="status" colorClass={PRIORITY_COLORS[issue.priority]} className="text-[10px]">{PRIORITY_LABELS[issue.priority]}</GoldBadge></td>
                  <td className="py-3"><GoldBadge variant="status" colorClass={ISSUE_STATUS_COLORS[issue.status]} className="text-[10px]">{ISSUE_STATUS_LABELS[issue.status]}</GoldBadge></td>
                  <td className="py-3 text-xs text-white/30">{formatRelativeTime(issue.created_at)}</td>
                  <td className="py-3">
                    <button onClick={() => { setSelectedIssue(issue); setNewStatus(issue.status); setSolution(issue.solution || ''); }}
                      className="text-xs text-gold-light hover:underline">عرض</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-center py-8 text-white/30 text-sm">لا توجد انشغالات</p>}
        </div>
      )}

      {/* Issue Detail Modal */}
      <Modal isOpen={!!selectedIssue} onClose={() => setSelectedIssue(null)} title={`التذكرة: ${selectedIssue?.ticket_number || ''}`}>
        {selectedIssue && (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-white/40 mb-1">الوصف</p>
              <p className="text-sm text-white/70">{truncate(selectedIssue.description, 300)}</p>
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">تغيير الحالة</label>
              <select value={newStatus} onChange={(e) => setNewStatus(e.target.value as IssueStatus)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-gold-border text-white text-sm focus:outline-none">
                {Object.entries(ISSUE_STATUS_LABELS).map(([k, v]) => <option key={k} value={k} className="bg-dark-surface">{v}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">الحل</label>
              <textarea value={solution} onChange={(e) => setSolution(e.target.value)} rows={4} placeholder="اكتب الحل هنا..."
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-gold-border text-white text-sm placeholder:text-white/20 focus:outline-none resize-none" />
            </div>
            <div className="flex gap-3 pt-2">
              <GoldButton onClick={updateIssue}>حفظ التغييرات</GoldButton>
              <GoldButton variant="ghost" onClick={() => setSelectedIssue(null)}>إلغاء</GoldButton>
            </div>
            
            {selectedIssue.status === 'solved' && selectedIssue.solution && (
              <div className="pt-4 mt-4 border-t border-white/10 flex flex-col gap-2">
                <p className="text-xs text-white/50 text-center">إثراء قاعدة المعرفة: هل هذا الانشغال متكرر؟</p>
                <GoldButton variant="ghost" className="w-full border border-gold-primary/30 hover:bg-gold-primary/10" onClick={convertToArticle}>
                  ✨ تحويل إلى مقال (سؤال وجواب) ونشره
                </GoldButton>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

