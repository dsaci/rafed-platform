/* رافد — Content Library Page */
import { supabase } from '@/lib/supabase';
import { ContentClient } from './ContentClient';
import type { Content } from '@/types';
import type { Metadata } from 'next';
import { processPlatforms } from '@/lib/virtual-platforms';

export const metadata: Metadata = {
  title: 'مكتبة المحتوى — رافد',
  description: 'شروحات ومقالات وأسئلة شائعة حول المنصات الرقمية التربوية',
};

export const revalidate = 60;

export default async function ContentPage() {
  const [contentRes, platformsRes] = await Promise.all([
    supabase.from('content').select('*, platform:platforms(*)').eq('published', true).order('created_at', { ascending: false }),
    supabase.from('platforms').select('id, name').eq('status', 'active').order('order_index'),
  ]);

  const dedupe = (arr: any[], key: string) => {
    const seen = new Set();
    return arr.filter(item => {
      if (seen.has(item[key])) return false;
      seen.add(item[key]);
      return true;
    });
  };

  const content = dedupe((contentRes.data as Content[]) || [], 'title');
  let platforms = dedupe((platformsRes.data as { id: string; name: string }[]) || [], 'name');
  platforms = processPlatforms(platforms as any[]);

  // Filter out Employment and Updates
  platforms = platforms.filter((p: any) => !p.name.includes('مسابقات التوظيف') && !p.name.includes('جدول المستجدات'));

  return (
    <ContentClient
      content={content}
      platforms={platforms}
    />
  );
}
