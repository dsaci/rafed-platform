import { BookingClient } from './BookingClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'حجز موعد عن بعد (AnyDesk) — رافد',
  description: 'احجز موعداً ليقوم التقني بالاتصال بحاسوبك عن بعد ومساعدتك في حل المشاكل المعقدة.',
};

export default function BookingPage() {
  return <BookingClient />;
}
