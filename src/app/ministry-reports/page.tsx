import { MinistryReportsClient } from './MinistryReportsClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تقارير الوزارة — رافد',
  description: 'سجل التقارير التلقائية المرفوعة لوزارة التربية الوطنية بناءً على الانشغالات المحلولة والإشكالات التقنية.',
};

export default function MinistryReportsPage() {
  return <MinistryReportsClient />;
}
