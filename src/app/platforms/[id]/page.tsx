/* ═══════════════════════════════
   رافد — Platform Detail Page
   ═══════════════════════════════ */

import { supabase } from '@/lib/supabase';
import { PlatformDetailClient } from './PlatformDetailClient';
import { notFound } from 'next/navigation';
import type { Platform, Issue, Content } from '@/types';
import type { Metadata } from 'next';
import { TAWDIF_PLATFORM, LITERACY_PLATFORM, PUBLICATIONS_PLATFORM } from '@/lib/virtual-platforms';

interface Props {
  params: { id: string };
}

function getVirtualPlatform(id: string): Platform | null {
  if (id === 'tawdif') return TAWDIF_PLATFORM as Platform;
  if (id === 'literacy-virtual-id') return LITERACY_PLATFORM as Platform;
  if (id === 'publications-virtual-id') return PUBLICATIONS_PLATFORM as Platform;
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const virtual = getVirtualPlatform(params.id);
  if (virtual) {
    return {
      title: `${virtual.name} — رافد`,
      description: virtual.description || `تفاصيل منصة ${virtual.name}`,
    };
  }

  const { data } = await supabase
    .from('platforms')
    .select('name, description')
    .eq('id', params.id)
    .single();

  if (!data) return { title: 'منصة غير موجودة — رافد' };

  return {
    title: `${data.name} — رافد`,
    description: data.description || `تفاصيل منصة ${data.name}`,
  };
}

export default async function PlatformDetailPage({ params }: Props) {
  const virtualPlatform = getVirtualPlatform(params.id);

  const [platformRes, issuesRes, contentRes] = await Promise.all([
    virtualPlatform 
      ? Promise.resolve({ data: virtualPlatform }) 
      : supabase.from('platforms').select('*').eq('id', params.id).single(),
    supabase
      .from('issues')
      .select('*')
      .eq('platform_id', params.id)
      .eq('status', 'solved')
      .order('resolved_at', { ascending: false })
      .limit(10),
    supabase
      .from('content')
      .select('*')
      .eq('platform_id', params.id)
      .eq('published', true)
      .order('created_at', { ascending: false }),
  ]);

  const platform = platformRes.data as Platform;
  if (!platform) notFound();

  return (
    <PlatformDetailClient
      platform={platform}
      solvedIssues={(issuesRes.data as Issue[]) || []}
      content={(contentRes.data as Content[]) || []}
    />
  );
}

