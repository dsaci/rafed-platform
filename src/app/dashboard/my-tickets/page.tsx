/* ═══════════════════════════════
   رافد — تذاكري (My Tickets)
   واجهة المستخدم العادي لتتبع انشغالاته
   ═══════════════════════════════ */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { GoldBadge } from '@/components/ui/GoldBadge';
import { GoldButton } from '@/components/ui/GoldButton';
import { useToast } from '@/components/ui/ToastProvider';
import { supabase } from '@/lib/supabase';
import { ISSUE_STATUS_LABELS, ISSUE_STATUS_COLORS } from '@/lib/constants';
import { formatRelativeTime } from '@/lib/utils';
import type { Issue } from '@/types';
import Link from 'next/link';

// ═══════════════════════════════════════════════════════════════════════
// بيانات تجريبية (Demo Data) لعرض الواجهة بدون قاعدة بيانات
// ═══════════════════════════════════════════════════════════════════════
const DEMO_TICKETS: Issue[] = [
  {
    id: 'demo-1',
    ticket_number: 'RAF-2026-001',
    platform_id: 'ostad',
    user_type: 'teacher',
    wilaya: 'الجزائر العاصمة',
    description: 'لا أستطيع الوصول إلى كشف الراتب في فضاء الأستاذ. تظهر رسالة "خطأ في الخادم" عند محاولة تحميل الوثيقة.',
    contact: 'demo@rafed.dz',
    anonymous: false,
    status: 'processing',
    solution: null,
    ai_diagnosis: 'مشكلة في خادم الوثائق - يرجى إعادة المحاولة بعد تحديث الصفحة',
    priority: 'normal',
    internal_notes: null,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    resolved_at: null,
    platform: {
      id: 'ostad', name: 'فضاء الأستاذ', category: 'teacher', is_official: true,
      description: '', url: '', status: 'active', icon: null, order_index: 1,
      created_at: '', updated_at: ''
    },
  },
  {
    id: 'demo-2',
    ticket_number: 'RAF-2026-002',
    platform_id: 'mowadaf',
    user_type: 'teacher',
    wilaya: 'وهران',
    description: 'مشكلة في تحديث البيانات الشخصية على منصة موظف. الاسم يظهر بالفرنسية فقط ولا يقبل الكتابة بالعربية.',
    contact: 'demo@rafed.dz',
    anonymous: false,
    status: 'solved',
    solution: 'تم حل المشكلة: يرجى استخدام متصفح Chrome وتفعيل لغة الإدخال العربية من إعدادات لوحة المفاتيح قبل الكتابة في الحقول.',
    ai_diagnosis: null,
    priority: 'low',
    internal_notes: null,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    resolved_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    platform: {
      id: 'mowadaf', name: 'منصة موظف', category: 'admin', is_official: true,
      description: '', url: '', status: 'active', icon: null, order_index: 2,
      created_at: '', updated_at: ''
    },
  },
  {
    id: 'demo-3',
    ticket_number: 'RAF-2026-003',
    platform_id: 'ostad',
    user_type: 'teacher',
    wilaya: 'قسنطينة',
    description: 'طلب استخراج شهادة عمل من فضاء الأستاذ. الزر لا يستجيب عند الضغط عليه.',
    contact: 'demo@rafed.dz',
    anonymous: false,
    status: 'new',
    solution: null,
    ai_diagnosis: null,
    priority: 'high',
    internal_notes: null,
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    resolved_at: null,
    platform: {
      id: 'ostad', name: 'فضاء الأستاذ', category: 'teacher', is_official: true,
      description: '', url: '', status: 'active', icon: null, order_index: 1,
      created_at: '', updated_at: ''
    },
  },
];

// ═══════════════════════════════════════════════════════════════════════
// حالة التذكرة كـ Timeline
// ═══════════════════════════════════════════════════════════════════════
const STATUS_STEPS = ['new', 'processing', 'solved'] as const;
const STATUS_STEP_LABELS: Record<string, string> = {
  new: 'مسجلة',
  processing: 'قيد المعالجة',
  solved: 'تم الحل',
};

function TicketTimeline({ status }: { status: string }) {
  const currentIndex = STATUS_STEPS.indexOf(status as any);
  const isEscalated = status === 'escalated';

  if (isEscalated) {
    return (
      <div className="flex items-center gap-1 mt-2">
        <span className="text-xs text-red-400 font-bold">🔺 تم تصعيد هذا الانشغال</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 mt-3">
      {STATUS_STEPS.map((step, i) => {
        const isReached = i <= currentIndex;
        return (
          <React.Fragment key={step}>
            <div className={cn(
              'flex items-center gap-1',
            )}>
              <div className={cn(
                'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all',
                isReached
                  ? 'bg-gold-primary text-dark-base'
                  : 'bg-slate-200 dark:bg-white/10 text-slate-400 dark:text-white/30'
              )}>
                {isReached ? '✓' : i + 1}
              </div>
              <span className={cn(
                'text-[10px]',
                isReached ? 'text-gold-light font-bold' : 'text-slate-400 dark:text-white/30'
              )}>
                {STATUS_STEP_LABELS[step]}
              </span>
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div className={cn(
                'flex-1 h-px mx-1',
                i < currentIndex ? 'bg-gold-primary' : 'bg-slate-200 dark:bg-white/10'
              )} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

// ═══════════════════════════════════════════════════════════════════════
// المكون الرئيسي
// ═══════════════════════════════════════════════════════════════════════

export default function MyTicketsPage() {
  const { addToast } = useToast();
  const [tickets, setTickets] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('issues')
        .select('*, platform:platforms(*)')
        .order('created_at', { ascending: false });
      if (data && data.length > 0) {
        setTickets(data as Issue[]);
      } else {
        // استخدام البيانات التجريبية والمحلية (لتجربة الـ Demo)
        let localTickets: Issue[] = [];
        try {
          const stored = localStorage.getItem('demo_submitted_tickets');
          if (stored) localTickets = JSON.parse(stored);
        } catch (e) {}
        setTickets([...localTickets, ...DEMO_TICKETS]);
      }
    } catch {
      // في حالة فشل الاتصال، نعرض البيانات التجريبية
      let localTickets: Issue[] = [];
      try {
        const stored = localStorage.getItem('demo_submitted_tickets');
        if (stored) localTickets = JSON.parse(stored);
      } catch (e) {}
      setTickets([...localTickets, ...DEMO_TICKETS]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  const filtered = tickets.filter(t => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    total: tickets.length,
    new: tickets.filter(t => t.status === 'new').length,
    processing: tickets.filter(t => t.status === 'processing').length,
    solved: tickets.filter(t => t.status === 'solved').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold gold-gradient-text">تذاكري</h1>
        <p className="text-sm text-slate-500 dark:text-white/40 mt-1">تابع حالة انشغالاتك وطلباتك المرسلة</p>
      </motion.div>

      {/* KPI Mini Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'الإجمالي', value: stats.total, icon: '📋', color: 'text-gold-light' },
          { label: 'جديدة', value: stats.new, icon: '🆕', color: 'text-blue-400' },
          { label: 'قيد المعالجة', value: stats.processing, icon: '⚙️', color: 'text-yellow-400' },
          { label: 'تم حلها', value: stats.solved, icon: '✅', color: 'text-green-400' },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <GlassCard className="p-4 text-center" hover={false}>
              <span className="text-xl">{kpi.icon}</span>
              <p className={`text-2xl font-extrabold mt-1 ${kpi.color}`}>{kpi.value}</p>
              <p className="text-[10px] text-slate-400 dark:text-white/30 mt-0.5">{kpi.label}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { value: 'all', label: 'الكل' },
          { value: 'new', label: 'جديدة' },
          { value: 'processing', label: 'قيد المعالجة' },
          { value: 'solved', label: 'محلولة' },
        ].map(f => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-medium transition-all',
              statusFilter === f.value
                ? 'bg-gold-primary/10 text-gold-light border border-gold-border'
                : 'text-slate-400 dark:text-white/40 border border-transparent hover:text-slate-600 dark:hover:text-white/60'
            )}
          >
            {f.label}
          </button>
        ))}

        <Link href="/issues/new" className="mr-auto">
          <GoldButton className="text-xs px-4 py-2">+ تذكرة جديدة</GoldButton>
        </Link>
      </div>

      {/* Tickets List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 rounded-2xl bg-slate-100 dark:bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <GlassCard className="p-12 text-center" hover={false}>
          <span className="text-4xl block mb-3">📭</span>
          <p className="text-slate-500 dark:text-white/40 text-sm">لا توجد تذاكر {statusFilter !== 'all' ? 'في هذه الحالة' : 'بعد'}</p>
          <Link href="/issues/new" className="inline-block mt-4">
            <GoldButton className="text-xs">أرسل أول انشغال لك</GoldButton>
          </Link>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((ticket, i) => (
              <motion.div
                key={ticket.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.03 }}
              >
                <GlassCard
                  className="p-5 cursor-pointer"
                  hover={true}
                  onClick={() => setExpandedId(expandedId === ticket.id ? null : ticket.id)}
                >
                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-xs text-gold-light font-mono" dir="ltr">{ticket.ticket_number}</code>
                        <GoldBadge variant="status" colorClass={ISSUE_STATUS_COLORS[ticket.status]} className="text-[10px]">
                          {ISSUE_STATUS_LABELS[ticket.status]}
                        </GoldBadge>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-white/70 line-clamp-2">{ticket.description}</p>
                    </div>
                    <div className="text-left flex-shrink-0">
                      <p className="text-[10px] text-slate-400 dark:text-white/30">{formatRelativeTime(ticket.created_at)}</p>
                      {ticket.platform && (
                        <p className="text-[10px] text-gold-light/60 mt-0.5">{ticket.platform.name}</p>
                      )}
                    </div>
                  </div>

                  {/* Timeline */}
                  <TicketTimeline status={ticket.status} />

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedId === ticket.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10 space-y-3">
                          {/* الوصف الكامل */}
                          <div>
                            <p className="text-[10px] text-slate-400 dark:text-white/30 mb-1 font-bold">الوصف الكامل</p>
                            <p className="text-xs text-slate-600 dark:text-white/50 leading-relaxed">{ticket.description}</p>
                          </div>

                          {/* التشخيص الآلي */}
                          {ticket.ai_diagnosis && (
                            <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20">
                              <p className="text-[10px] text-blue-400 mb-1 font-bold">🤖 تشخيص ذكي</p>
                              <p className="text-xs text-blue-300/70">{ticket.ai_diagnosis}</p>
                            </div>
                          )}

                          {/* الحل */}
                          {ticket.solution && (
                            <div className="p-3 rounded-xl bg-green-500/5 border border-green-500/20">
                              <p className="text-[10px] text-green-400 mb-1 font-bold">✅ الحل</p>
                              <p className="text-xs text-green-300/70">{ticket.solution}</p>
                            </div>
                          )}

                          {/* المعلومات الإضافية */}
                          <div className="flex flex-wrap gap-4 text-[10px] text-slate-400 dark:text-white/30">
                            <span>📍 {ticket.wilaya}</span>
                            {ticket.resolved_at && <span>🕐 حُلّ {formatRelativeTime(ticket.resolved_at)}</span>}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
