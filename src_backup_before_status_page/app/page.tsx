/* ═══════════════════════════════
   رافد — Home Page
   ═══════════════════════════════ */

import { supabase } from '@/lib/supabase';
import { getPlatformIcon } from '@/lib/icons';
import { processPlatforms } from '@/lib/virtual-platforms';
import { HomeClient } from './HomeClient';
import type { Platform, Issue, Content, HomeStats } from '@/types';

export const revalidate = 60; // ISR: revalidate every 60 seconds

async function getHomeData() {
  const [platformsRes, solvedIssuesRes, contentRes, statsRes] = await Promise.all([
    supabase.from('platforms').select('*').eq('status', 'active').order('order_index'),
    supabase
      .from('issues')
      .select('*, platform:platforms(*)')
      .eq('status', 'solved')
      .order('resolved_at', { ascending: false })
      .limit(6),
    supabase
      .from('content')
      .select('*, platform:platforms(*)')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(6),
    supabase.from('issues').select('id, status'),
  ]);

  const dedupe = (arr: any[], key: string) => {
    const seen = new Set();
    return arr.filter(item => {
      if (seen.has(item[key])) return false;
      seen.add(item[key]);
      return true;
    });
  };

  let allPlatforms = dedupe((platformsRes.data as Platform[]) || [], 'name');
  allPlatforms = processPlatforms(allPlatforms);
  
  // Extract specific platforms for custom architectural display
  const employmentPlatform = allPlatforms.find(p => p.id === 'tawdif' || p.name.includes('مسابقات التوظيف') || p.name.includes('منصة توظيف')) || null;
  const updatesPlatform = allPlatforms.find(p => p.name.includes('جدول المستجدات')) || null;
  
  // Filter them out of the main grid
  const platforms = allPlatforms.filter(p => p.id !== employmentPlatform?.id && p.id !== updatesPlatform?.id);

  const solvedIssues = (solvedIssuesRes.data as Issue[]) || [];
  const latestContent = dedupe((contentRes.data as Content[]) || [], 'title');
  const allIssues = statsRes.data || [];

  const stats: HomeStats = {
    totalIssues: allIssues.length,
    solvedIssues: allIssues.filter((i) => i.status === 'solved').length,
    totalPlatforms: allPlatforms.length,
    totalWilayas: 69,
  };

  return { platforms, employmentPlatform, updatesPlatform, solvedIssues, latestContent, stats };
}

export default async function HomePage() {
  const { platforms, employmentPlatform, updatesPlatform, solvedIssues, latestContent, stats } = await getHomeData();

  return (
    <HomeClient
      platforms={platforms}
      employmentPlatform={employmentPlatform}
      updatesPlatform={updatesPlatform}
      solvedIssues={solvedIssues}
      latestContent={latestContent}
      stats={stats}
    />
  );
}

