import { TawdifClient } from './TawdifClient';
import type { Metadata } from 'next';
import type { Platform } from '@/types';

export const metadata: Metadata = {
  title: 'منصة توظيف — مسابقات التوظيف لقطاع التربية — رافد',
  description: 'الدليل الشامل للتسجيل في منصة التوظيف لرتب التربية. التسجيلات مفتوحة من 13 جويلية إلى 03 أوت 2026.',
};

export default function TawdifPlatformPage() {
  const tawdifPlatform: Platform = {
    id: 'tawdif',
    name: 'منصة توظيف',
    description: 'منصة إلكترونية شاملة تحتوي على جميع مسابقات التوظيف الرسمية في قطاع التربية الوطنية، تهدف هذه البوابة إلى تسهيل عملية البحث عن المسابقات من خلال تجميع كافة المنصات الإلكترونية الوظيفية في مكان واحد.',
    url: 'https://tawdif.education.dz/',
    category: 'external',
    status: 'active',
    is_official: true,
    icon: null,
    order_index: 22,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return <TawdifClient platform={tawdifPlatform} />;
}
