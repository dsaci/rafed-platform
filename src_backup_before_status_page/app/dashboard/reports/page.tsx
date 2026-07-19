/* رافد — Dashboard Reports Page */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { GoldButton } from '@/components/ui/GoldButton';
import { GoldBadge } from '@/components/ui/GoldBadge';
import { useToast } from '@/components/ui/ToastProvider';
import { supabase } from '@/lib/supabase';
import { formatArabicDate, formatArabicNumber } from '@/lib/utils';
import type { Report, Platform } from '@/types';

export default function DashboardReportsPage() {
  const { addToast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [platformId, setPlatformId] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [r, p] = await Promise.all([
      supabase.from('reports').select('*, platform:platforms(*)').order('generated_at', { ascending: false }),
      supabase.from('platforms').select('*').order('order_index'),
    ]);
    setReports((r.data as Report[]) || []);
    setPlatforms((p.data as Platform[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const generateReport = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period, platformId: platformId || null }),
      });
      if (!res.ok) throw new Error();
      addToast('success', 'تم توليد التقرير بنجاح');
      fetchData();
    } catch {
      addToast('error', 'حدث خطأ أثناء توليد التقرير');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-extrabold gold-gradient-text">التقارير</motion.h1>

      {/* Generate Report */}
      <GlassCard className="p-6" hover={false} animate={false}>
        <h3 className="text-sm font-bold text-gold-light mb-4">توليد تقرير جديد</h3>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="text-xs text-white/40 mb-1 block">الفترة</label>
            <select value={period} onChange={(e) => setPeriod(e.target.value as 'weekly' | 'monthly')}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-gold-border text-white text-sm focus:outline-none">
              <option value="weekly" className="bg-dark-surface">أسبوعي</option>
              <option value="monthly" className="bg-dark-surface">شهري</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="text-xs text-white/40 mb-1 block">المنصة (اختياري)</label>
            <select value={platformId} onChange={(e) => setPlatformId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-gold-border text-white text-sm focus:outline-none">
              <option value="" className="bg-dark-surface">جميع المنصات</option>
              {platforms.map((p) => <option key={p.id} value={p.id} className="bg-dark-surface">{p.name}</option>)}
            </select>
          </div>
          <GoldButton onClick={generateReport} loading={generating}>توليد التقرير</GoldButton>
        </div>
      </GlassCard>

      {/* Escalated Issues */}
      <GlassCard className="p-6" hover={false} animate={false}>
        <h3 className="text-sm font-bold text-red-400 mb-4">🔺 الانشغالات المرفوعة — جاهزة للرفع للوزارة</h3>
        <EscalatedIssuesList />
      </GlassCard>

      {/* Reports List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white/60">التقارير السابقة</h3>
        {reports.length === 0 && !loading && <p className="text-sm text-white/30">لا توجد تقارير بعد</p>}
        {reports.map((report) => (
          <GlassCard key={report.id} className="p-5" animate={false}>
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-base font-bold text-white mb-1">{report.title}</h4>
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <GoldBadge>{report.period === 'weekly' ? 'أسبوعي' : 'شهري'}</GoldBadge>
                  <span>{formatArabicDate(report.generated_at)}</span>
                  {report.platform && <span>• {report.platform.name}</span>}
                </div>
              </div>
              <div className="flex gap-4 text-center">
                <div><p className="text-lg font-bold text-gold-light">{formatArabicNumber(report.total_issues)}</p><p className="text-[10px] text-white/30">إجمالي</p></div>
                <div><p className="text-lg font-bold text-green-400">{formatArabicNumber(report.solved_issues)}</p><p className="text-[10px] text-white/30">محلول</p></div>
                <div><p className="text-lg font-bold text-red-400">{formatArabicNumber(report.escalated_issues)}</p><p className="text-[10px] text-white/30">مرفوع</p></div>
              </div>
            </div>
            {report.summary && <p className="text-sm text-white/50 mt-3 border-t border-white/5 pt-3">{report.summary}</p>}
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

function EscalatedIssuesList() {
  const [issues, setIssues] = useState<{ id: string; ticket_number: string; description: string; wilaya: string; created_at: string }[]>([]);

  useEffect(() => {
    supabase.from('issues').select('id, ticket_number, description, wilaya, created_at').eq('status', 'escalated').order('created_at', { ascending: false }).limit(10)
      .then(({ data }) => setIssues(data || []));
  }, []);

  if (issues.length === 0) return <p className="text-sm text-white/30">لا توجد انشغالات مرفوعة</p>;

  return (
    <div className="space-y-2">
      {issues.map((i) => (
        <div key={i.id} className="flex items-center gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/10">
          <code className="text-xs text-red-400" dir="ltr">{i.ticket_number}</code>
          <span className="text-xs text-white/50 flex-1 truncate">{i.description.slice(0, 80)}</span>
          <span className="text-xs text-white/30">{i.wilaya}</span>
        </div>
      ))}
    </div>
  );
}

