/* ═══════════════════════════════
   رافد — Layout Shell
   Conditionally renders Navbar/Footer
   (hides them for /dashboard and /login routes)
   ═══════════════════════════════ */

'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');
  const isLogin = pathname === '/login';
  const hideChrome = isDashboard || isLogin;

  return (
    <>
      {!hideChrome && <Navbar />}
      {children}
      {!hideChrome && <Footer />}
    </>
  );
}

