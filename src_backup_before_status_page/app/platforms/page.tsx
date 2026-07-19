/* ═══════════════════════════════
   رافد — Platforms Page
   ═══════════════════════════════ */

import { supabase } from '@/lib/supabase';
import { PlatformsClient } from './PlatformsClient';
import type { Platform } from '@/types';
import type { Metadata } from 'next';
import { processPlatforms } from '@/lib/virtual-platforms';

export const metadata: Metadata = {
  title: 'المنصات المدعومة — رافد',
  description: 'تصفح جميع المنصات الرقمية التربوية المدعومة من رافد',
};

export const revalidate = 60;

export default async function PlatformsPage() {
  const { data } = await supabase
    .from('platforms')
    .select('*')
    .order('order_index');

  const dedupe = (arr: any[], key: string) => {
    const seen = new Set();
    return arr.filter(item => {
      if (seen.has(item[key])) return false;
      seen.add(item[key]);
      return true;
    });
  };

  let platforms = dedupe((data as Platform[]) || [], 'name');
  platforms = processPlatforms(platforms);

  // Exclude the externally-handled platforms from the standard grid
  const filteredPlatforms = platforms.filter(p => !p.name.includes('مسابقات التوظيف') && !p.name.includes('جدول المستجدات'));

  return <PlatformsClient platforms={filteredPlatforms} />;
}
