/* رافد — Dashboard Overview */
import { supabase } from '@/lib/supabase';
import { DashboardOverviewClient } from './DashboardOverviewClient';
import type { DashboardStats, Issue } from '@/types';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'لوحة التحكم — رافد' };
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  let issues = null;
  let platforms = null;
  let contentCount = null;

  try {
    const results = await Promise.all([
      supabase.from('issues').select('id, status, platform_id, wilaya, created_at, priority'),
      supabase.from('platforms').select('id, name'),
      supabase.from('content').select('id'),
    ]);
    issues = results[0].data;
    platforms = results[1].data;
    contentCount = results[2].data;
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
  }

  const allIssues = issues || [];
  const stats: DashboardStats = {
    totalIssues: allIssues.length,
    newIssues: allIssues.filter((i) => i.status === 'new').length,
    processingIssues: allIssues.filter((i) => i.status === 'processing').length,
    solvedIssues: allIssues.filter((i) => i.status === 'solved').length,
    escalatedIssues: allIssues.filter((i) => i.status === 'escalated').length,
    totalPlatforms: (platforms || []).length,
    totalContent: (contentCount || []).length,
  };

  // Platform breakdown
  const platformBreakdown = (platforms || []).map((p) => ({
    name: p.name,
    count: allIssues.filter((i) => i.platform_id === p.id).length,
  })).filter((p) => p.count > 0).sort((a, b) => b.count - a.count);

  // Status breakdown
  const statusBreakdown = [
    { name: 'جديد', value: stats.newIssues, color: '#3B82F6' },
    { name: 'قيد المعالجة', value: stats.processingIssues, color: '#EAB308' },
    { name: 'محلول', value: stats.solvedIssues, color: '#22C55E' },
    { name: 'مرفوع', value: stats.escalatedIssues, color: '#EF4444' },
  ];

  return (
    <DashboardOverviewClient
      stats={stats}
      platformBreakdown={platformBreakdown}
      statusBreakdown={statusBreakdown}
    />
  );
}

