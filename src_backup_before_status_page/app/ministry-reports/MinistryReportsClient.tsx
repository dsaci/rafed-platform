'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { GlassCard } from '@/components/ui/GlassCard';
import { GoldBadge } from '@/components/ui/GoldBadge';
import { supabase } from '@/lib/supabase';
import { formatRelativeTime } from '@/lib/utils';
import { HiOutlineDocumentReport, HiOutlineCheckCircle, HiOutlineExclamationCircle, HiOutlineRefresh, HiOutlineDownload, HiOutlineChartPie } from 'react-icons/hi';
import type { Issue } from '@/types';

// Mock report type for the frontend logic
interface MinistryReport {
  id: string;
  issue_id: string;
  platform_name: string;
  issue_description: string;
  resolution_summary: string;
  status: 'sent' | 'pending';
  created_at: string;
  impact_level: 'high' | 'medium' | 'low';
}

export function MinistryReportsClient() {
  const [reports, setReports] = useState<MinistryReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [isUnlocked, setIsUnlocked] = useState(true);

  // Real-time listener for any new solved issues
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('ministry_unlocked') !== 'true') {
      setIsUnlocked(false);
      return;
    }
    
    fetchReports();

    // Subscribe to any updates in the 'issues' table
    const subscription = supabase
      .channel('public:issues')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'issues' }, (payload) => {
        const updatedIssue = payload.new as Issue;
        if (updatedIssue.status === 'solved') {
          // If an issue was just solved, automatically refresh the reports
          fetchReports();
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  if (!isUnlocked) {
    return (
      <PageWrapper>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-red-500">ممنوع الوصول 🚫</h1>
            <p className="text-slate-600 dark:text-white/60">هذه الصفحة مخصصة لتقارير الوزارة السرية فقط.</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  const fetchReports = async () => {
    setIsRefreshing(true);
    try {
      // 1. Fetch recently solved issues
      const { data: solvedIssues, error } = await supabase
        .from('issues')
        .select('*, platform:platforms(name)')
        .eq('status', 'solved')
        .order('resolved_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      // 2. Transform them into "Ministry Reports" format
      const generatedReports: MinistryReport[] = (solvedIssues || []).map((issue: any) => ({
        id: `REP-${issue.id.substring(0, 8).toUpperCase()}`,
        issue_id: issue.id,
        platform_name: issue.platform?.name || 'منصة غير محددة',
        issue_description: issue.description,
        resolution_summary: issue.admin_response || 'تم حل المشكلة تقنياً وإعادة ضبط الإعدادات.',
        status: 'sent',
        created_at: issue.resolved_at || issue.created_at,
        impact_level: issue.priority === 'high' || issue.priority === 'critical' ? 'high' : 'medium'
      }));

      // Add a dummy pending report for demonstration of the automated system
      generatedReports.unshift({
        id: 'REP-AUTO-001',
        issue_id: 'auto-generated',
        platform_name: 'النظام المعلوماتي للوزارة',
        issue_description: 'تأخر تزامن النقاط التربوية بين فضاء الأستاذ والقاعدة المركزية',
        resolution_summary: 'جاري إعداد تقرير تقني مفصل حول أسباب التأخر في المزامنة (Sync Latency) لرفعه لمديرية الرقمنة.',
        status: 'pending',
        created_at: new Date().toISOString(),
        impact_level: 'high'
      });

      setReports(generatedReports);
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const getImpactColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'low': return 'text-green-500 bg-green-500/10 border-green-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <PageWrapper>
      <section className="py-12 md:py-20 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-primary/5 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <GoldBadge>نظام التقارير الآلية</GoldBadge>
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-bold animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  تحديث تلقائي مفعل
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
                تقارير <span className="gold-gradient-text">الوزارة</span>
              </h1>
              <p className="text-slate-600 dark:text-white/60 max-w-2xl">
                رصيد التقارير التقنية التي يتم توليدها ورفعها تلقائياً للجهات الوصية عند حل أي انشغال، لضمان التحسين المستمر للمنصات الرقمية.
              </p>
            </div>
            
            <button 
              onClick={fetchReports}
              disabled={isRefreshing}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/80 hover:bg-slate-50 dark:hover:bg-white/5 transition-all font-medium text-sm ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <HiOutlineRefresh className={`text-lg ${isRefreshing ? 'animate-spin' : ''}`} />
              تحديث البيانات
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            <GlassCard className="p-5 flex items-center gap-4 bg-white dark:bg-dark-surface">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 text-2xl">
                <HiOutlineDocumentReport />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{reports.length}</p>
                <p className="text-xs text-slate-500 dark:text-white/50">إجمالي التقارير المولّدة</p>
              </div>
            </GlassCard>
            <GlassCard className="p-5 flex items-center gap-4 bg-white dark:bg-dark-surface">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 text-2xl">
                <HiOutlineCheckCircle />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {reports.filter(r => r.status === 'sent').length}
                </p>
                <p className="text-xs text-slate-500 dark:text-white/50">تقارير مُرسلة للوزارة</p>
              </div>
            </GlassCard>
            <GlassCard className="p-5 flex items-center gap-4 bg-white dark:bg-dark-surface">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 text-2xl">
                <HiOutlineExclamationCircle />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {reports.filter(r => r.status === 'pending').length}
                </p>
                <p className="text-xs text-slate-500 dark:text-white/50">تقارير قيد التجهيز</p>
              </div>
            </GlassCard>
          </div>

          {/* Reports List */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-gold-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : reports.length === 0 ? (
              <GlassCard className="p-12 text-center">
                <p className="text-slate-500 dark:text-white/50">لا توجد تقارير حالياً.</p>
              </GlassCard>
            ) : (
              reports.map((report, i) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <GlassCard className="p-6 bg-white dark:bg-dark-surface hover:shadow-md transition-all border-l-4 border-l-transparent hover:border-l-gold-primary">
                    <div className="flex flex-col lg:flex-row gap-6">
                      
                      {/* Meta info */}
                      <div className="lg:w-1/4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-slate-500 dark:text-white/40">{report.id}</span>
                          <span className="text-xs text-slate-400 dark:text-white/30">
                            {formatRelativeTime(report.created_at)}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">{report.platform_name}</h3>
                        <div className="flex gap-2">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${report.status === 'sent' ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'}`}>
                            {report.status === 'sent' ? 'تم الرفع للوزارة' : 'قيد التجهيز'}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${getImpactColor(report.impact_level)}`}>
                            تأثير {report.impact_level === 'high' ? 'عالي' : report.impact_level === 'medium' ? 'متوسط' : 'منخفض'}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="lg:w-2/4 space-y-4">
                        <div>
                          <p className="text-xs font-bold text-slate-400 dark:text-white/40 mb-1">وصف الإشكال المرصود:</p>
                          <p className="text-sm text-slate-700 dark:text-white/80 line-clamp-2">{report.issue_description}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 dark:text-white/40 mb-1">الحل التقني المُنفذ / التوصية:</p>
                          <p className="text-sm text-slate-700 dark:text-white/80 bg-slate-50 dark:bg-white/5 p-3 rounded-lg border border-slate-100 dark:border-white/5">
                            {report.resolution_summary}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="lg:w-1/4 flex flex-row lg:flex-col justify-end gap-3 lg:border-r border-slate-200 dark:border-white/10 lg:pr-6">
                        <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white/80 transition-colors text-xs font-bold">
                          <HiOutlineDownload className="text-lg" />
                          تحميل التقرير (PDF)
                        </button>
                        <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 hover:border-gold-primary hover:text-gold-primary text-slate-600 dark:text-white/60 transition-colors text-xs font-bold">
                          <HiOutlineChartPie className="text-lg" />
                          عرض الإحصائيات
                        </button>
                      </div>

                    </div>
                  </GlassCard>
                </motion.div>
              ))
            )}
          </div>

        </div>
      </section>
    </PageWrapper>
  );
}
