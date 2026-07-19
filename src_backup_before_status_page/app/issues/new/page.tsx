/* ═══════════════════════════════
   رافد — Submit Issue Page
   ═══════════════════════════════ */

import { supabase } from '@/lib/supabase';
import { IssueForm } from '@/components/forms/IssueForm';
import { PageWrapper } from '@/components/layout/PageWrapper';
import type { Platform } from '@/types';
import type { Metadata } from 'next';

import { processPlatforms } from '@/lib/virtual-platforms';

export const metadata: Metadata = {
  title: 'أرسل انشغالك — رافد',
  description: 'أرسل مشكلتك التقنية وسنساعدك في إيجاد الحل المناسب',
};

interface Props {
  searchParams: { platform?: string };
}

export default async function NewIssuePage({ searchParams }: Props) {
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
  
  // Filter out Employment and Updates
  platforms = platforms.filter(p => !p.name.includes('مسابقات التوظيف') && !p.name.includes('جدول المستجدات'));

  return (
    <PageWrapper>
      <section className="py-12 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-extrabold gold-gradient-text mb-4">
              أرسل انشغالك
            </h1>
            <p className="text-white/40 max-w-lg mx-auto">
              صف المشكلة التي تواجهها وسيقوم فريقنا والذكاء الاصطناعي بتشخيصها وتقديم الحل
            </p>
          </div>

          <IssueForm
            platforms={platforms}
            preselectedPlatformId={searchParams.platform}
          />
        </div>
      </section>
    </PageWrapper>
  );
}

