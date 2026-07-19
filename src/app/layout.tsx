import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { LayoutShell } from '@/components/layout/LayoutShell';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { NotificationProvider } from '@/components/notifications/NotificationProvider';

import { LiveChatWidget } from '@/components/support/LiveChatWidget';

export const metadata: Metadata = {
  title: 'رافد — المرافقة الرقمية التربوية',
  description: 'منصة رافد الموحدة لوزارة التربية الوطنية. نظام ذكي لتشخيص المشاكل وتتبع الانشغالات.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={'font-cairo bg-slate-50 dark:bg-dark-base text-slate-900 dark:text-white antialiased selection:bg-gold-primary/30 selection:text-gold-light transition-colors duration-300'}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AuthProvider>
            <ToastProvider>
              <NotificationProvider>
                <LayoutShell>{children}</LayoutShell>
                <LiveChatWidget />
              </NotificationProvider>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}