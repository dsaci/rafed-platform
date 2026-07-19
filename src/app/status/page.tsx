import { supabase } from '@/lib/supabase';
import { StatusClient } from './StatusClient';
import type { Platform } from '@/types';
import type { Metadata } from 'next';
import { processPlatforms } from '@/lib/virtual-platforms';

export const metadata: Metadata = {
  title: 'حالة المنصات — رافد',
  description: 'مؤشر حالة جميع المنصات الرقمية لوزارة التربية الوطنية',
};

export const revalidate = 60; // Revalidate every minute for near real-time status

export default async function StatusPage() {
  let data: any[] | null = null;
  try {
    const res = await supabase
      .from('platforms')
      .select('*')
      .order('order_index');
    data = res.data;
  } catch (error) {
    console.error('Failed to fetch platforms from Supabase:', error);
    data = []; // Fallback to empty array so virtual platforms still load
  }

  const dedupe = (arr: any[], key: string) => {
    const seen = new Set();
    return arr.filter(item => {
      if (seen.has(item[key])) return false;
      seen.add(item[key]);
      return true;
    });
  };

  let platforms = dedupe((data as Platform[]) || [], 'name');
  
  // Inject virtual platforms and process them using our robust function
  platforms = processPlatforms(platforms);

  return <StatusClient platforms={platforms} />;
}
