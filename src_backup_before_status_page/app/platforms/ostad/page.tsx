import { OstadClient } from './OstadClient';
import type { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import type { Platform, Issue } from '@/types';

export const metadata: Metadata = {
  title: 'فضاء الأستاذ — رافد',
  description: 'المنصة الوزارية الرسمية المخصصة لأساتذة قطاع التربية الوطنية في الجزائر. واجهة الاستعراض والدعم التقني.',
};

export default async function OstadPlatformPage() {
  // جلب الانشغالات المحلولة المتعلقة بمنصة الأستاذ إن وجدت في قاعدة البيانات
  // سنفترض أن معرف المنصة هو 'ostad' في قاعدة البيانات إذا تم إدخالها
  const { data: issuesRes } = await supabase
    .from('issues')
    .select('*')
    .eq('platform_id', 'ostad')
    .eq('status', 'solved')
    .order('resolved_at', { ascending: false })
    .limit(5);

  const ostadPlatform: Platform = {
    id: 'ostad',
    name: 'فضاء الأستاذ',
    description: 'المنصة الوزارية الرسمية المخصصة لأساتذة قطاع التربية الوطنية. تعتبر البوابة المركزية للاطلاع على البيانات المهنية، استخراج الوثائق، وتسيير الأفواج التربوية.',
    url: 'https://ostad.education.dz/',
    category: 'administrative',
    status: 'active',
    is_official: true,
  };

  return <OstadClient platform={ostadPlatform} solvedIssues={(issuesRes as Issue[]) || []} />;
}
