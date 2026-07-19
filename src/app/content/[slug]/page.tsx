import { supabase } from '@/lib/supabase';
import { ContentDetailClient } from './ContentDetailClient';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'رافد — تفاصيل المحتوى',
  description: 'المحتوى التعليمي والتوضيحي في منصة رافد',
};

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function ContentDetailPage({ params }: PageProps) {
  const { slug } = params;

  // Fetch content by slug
  const { data: content, error } = await supabase
    .from('content')
    .select('*, platform:platform_id(name)')
    .eq('slug', slug)
    .single();

  if (error || !content) {
    notFound();
  }

  // Increment views
  await supabase.rpc('increment_content_views', { content_id: content.id });

  return <ContentDetailClient content={content} />;
}