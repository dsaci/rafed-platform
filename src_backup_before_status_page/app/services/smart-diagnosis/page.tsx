import type { Metadata } from 'next';
import { SmartDiagnosisClient } from './SmartDiagnosisClient';
import { supabase } from '@/lib/supabase';
import { processPlatforms } from '@/lib/virtual-platforms';
import type { Platform } from '@/types';

export const metadata: Metadata = {
  title: 'التشخيص الذكي — رافد',
  description: 'معالج الذكاء الاصطناعي لتشخيص وحل المشكلات التقنية',
};

export default async function SmartDiagnosisPage() {
  const { data } = await supabase
    .from('platforms')
    .select('*')
    .eq('status', 'active')
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
  // Filter out Employment and Updates just like issues page
  platforms = platforms.filter(p => !p.name.includes('مسابقات التوظيف') && !p.name.includes('جدول المستجدات'));

  return <SmartDiagnosisClient platforms={platforms} />;
}

