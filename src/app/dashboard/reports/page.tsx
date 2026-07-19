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
    try {
      const [r, p] = await Promise.all([
        supabase.from('reports').select('*, platform:platforms(*)').order('generated_at', { ascending: false }),
        supabase.from('platforms').select('*').order('order_index'),
      ]);
      
      let fetchedReports = r.data || [];
      // Fallback for Demo Mode if Supabase is empty/offline
      if (fetchedReports.length === 0) {
        const stored = localStorage.getItem('demo_reports');
        if (stored) fetchedReports = JSON.parse(stored);
      }
      setReports(fetchedReports as Report[]);
      setPlatforms((p.data as Platform[]) || []);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      const stored = localStorage.getItem('demo_reports');
      if (stored) setReports(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const generateReport = async () => {
    setGenerating(true);
    try {
      // Demo Mode: Pull actual data to sync with dashboard
      await new Promise(res => setTimeout(res, 1500));
      
      const ticketsStr = localStorage.getItem('demo_submitted_tickets');
      let tickets = ticketsStr ? JSON.parse(ticketsStr) : [];
      
      // Filter by platform if selected
      if (platformId) {
        tickets = tickets.filter((t: any) => t.platform === platformId);
      }
      
      // Calculate real numbers from tickets
      const total_issues = tickets.length;
      const solved_issues = tickets.filter((t: any) => t.status === 'solved').length;
      const escalated_issues = tickets.filter((t: any) => t.status === 'escalated').length;

      const newReport = {
        id: `REP-${Math.floor(Math.random() * 10000)}`,
        title: `تقرير ${period === 'weekly' ? 'أسبوعي' : 'شهري'} ${platformId ? '- مخصص' : '- شامل'}`,
        period,
        generated_at: new Date().toISOString(),
        total_issues,
        solved_issues,
        escalated_issues,
        summary: total_issues === 0 
          ? 'لا توجد أي انشغالات مسجلة لهذه الفترة/المنصة.'
          : 'هذا تقرير دقيق تم توليده بناءً على البيانات الحالية المتوفرة في النظام.'
      };
      
      const stored = localStorage.getItem('demo_reports');
      const prev = stored ? JSON.parse(stored) : [];
      localStorage.setItem('demo_reports', JSON.stringify([newReport, ...prev]));

      addToast('success', 'تم توليد التقرير بنجاح بناءً على البيانات الفعلية');
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
    const fetchEscalated = async () => {
      try {
        const { data, error } = await supabase.from('issues').select('id, ticket_number, description, wilaya, created_at').eq('status', 'escalated').order('created_at', { ascending: false }).limit(10);
        if (error || !data || data.length === 0) throw new Error();
        setIssues(data);
      } catch (err) {
        // Fallback demo data from localStorage to ensure tight synchronization
        const stored = localStorage.getItem('demo_submitted_tickets');
        if (stored) {
          const tickets = JSON.parse(stored);
          const escalated = tickets.filter((t: any) => t.status === 'escalated');
          setIssues(escalated.map((t: any) => ({
            id: t.id,
            ticket_number: t.id,
            description: t.description,
            wilaya: 'غير محدد',
            created_at: t.created_at || new Date().toISOString()
          })));
        } else {
          setIssues([]); // 0 escalated issues
        }
      }
    };
    fetchEscalated();
  }, []);

  if (issues.length === 0) return <p className="text-sm text-white/30">لا توجد انشغالات مرفوعة</p>;

  return (
    <div className="space-y-2">
      {issues.map((i) => (
        <div key={i.id} className="flex items-center gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/10">
          <code className="text-xs text-red-400 font-bold" dir="ltr">{i.ticket_number}</code>
          <span className="text-xs text-white/70 flex-1 truncate">{i.description}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-white/40">{i.wilaya}</span>
        </div>
      ))}
    </div>
  );
}

