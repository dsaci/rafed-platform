/* رافد — Dashboard Overview Client */
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { StatsCard } from '@/components/ui/StatsCard';
import { GlassCard } from '@/components/ui/GlassCard';
import type { DashboardStats } from '@/types';

interface Props {
  stats: DashboardStats;
  platformBreakdown: { name: string; count: number }[];
  statusBreakdown: { name: string; value: number; color: string }[];
}

export function DashboardOverviewClient({ stats, platformBreakdown, statusBreakdown }: Props) {
  const maxPlatformCount = Math.max(...platformBreakdown.map((p) => p.count), 1);

  return (
    <div className="space-y-8">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-extrabold gold-gradient-text">
        نظرة عامة
      </motion.h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="جديد" value={stats.newIssues} icon="📩" color="text-blue-400" />
        <StatsCard label="قيد المعالجة" value={stats.processingIssues} icon="⚙️" delay={0.1} color="text-yellow-400" />
        <StatsCard label="محلول" value={stats.solvedIssues} icon="✅" delay={0.2} color="text-green-400" />
        <StatsCard label="مرفوع" value={stats.escalatedIssues} icon="🔺" delay={0.3} color="text-red-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Breakdown */}
        <GlassCard className="p-6" hover={false}>
          <h3 className="text-sm font-bold text-gold-light mb-6">توزيع الحالات</h3>
          <div className="space-y-4">
            {statusBreakdown.map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-white/60 w-24">{item.name}</span>
                <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.totalIssues > 0 ? (item.value / stats.totalIssues) * 100 : 0}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
                <span className="text-sm font-bold text-white/80 w-8 text-left">{item.value}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Platform Breakdown */}
        <GlassCard className="p-6" hover={false}>
          <h3 className="text-sm font-bold text-gold-light mb-6">الانشغالات حسب المنصة</h3>
          <div className="space-y-3">
            {platformBreakdown.slice(0, 8).map((item, i) => (
              <div key={item.name} className="flex items-center gap-3">
                <span className="text-sm text-white/60 truncate w-32 flex-shrink-0">{item.name}</span>
                <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.count / maxPlatformCount) * 100}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className="h-full rounded-full bg-gradient-to-l from-gold-primary to-gold-light"
                  />
                </div>
                <span className="text-sm font-bold text-gold-light w-8 text-left">{item.count}</span>
              </div>
            ))}
            {platformBreakdown.length === 0 && (
              <p className="text-sm text-white/30 text-center py-4">لا توجد بيانات بعد</p>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard label="إجمالي الانشغالات" value={stats.totalIssues} icon="📊" />
        <StatsCard label="المنصات" value={stats.totalPlatforms} icon="🖥️" delay={0.1} />
        <StatsCard label="المحتوى" value={stats.totalContent} icon="📝" delay={0.2} />
      </div>
    </div>
  );
}

