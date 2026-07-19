/* ═══════════════════════════════
   رافد — Issue Detail Page
   صفحة تفاصيل الانشغال
   ═══════════════════════════════ */

import { supabase } from '@/lib/supabase';
import { IssueDetailClient } from './IssueDetailClient';
import { notFound } from 'next/navigation';
import type { Issue } from '@/types';
import type { Metadata } from 'next';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data } = await supabase
    .from('issues')
    .select('ticket_number, description')
    .eq('id', params.id)
    .single();

  if (!data) return { title: 'انشغال غير موجود — رافد' };

  return {
    title: `تذكرة ${data.ticket_number} — رافد`,
    description: data.description?.slice(0, 160) || 'تفاصيل الانشغال',
  };
}

export default async function IssueDetailPage({ params }: Props) {
  const { data, error } = await supabase
    .from('issues')
    .select(`
      *,
      platform:platforms(id, name, icon, category)
    `)
    .eq('id', params.id)
    .single();

  if (!data || error) notFound();

  return <IssueDetailClient issue={data as Issue} />;
}
