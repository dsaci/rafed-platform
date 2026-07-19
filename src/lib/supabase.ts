/* ═══════════════════════════════
   رافد — Supabase Client
   ═══════════════════════════════ */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// كشف ما إذا كان الرابط وهمياً (Placeholder) لتعطيل الاتصالات غير الضرورية
const isPlaceholderUrl = !supabaseUrl || supabaseUrl.includes('placeholder') || supabaseUrl.includes('qvlpbvzjnduzzaevumlt');

// Client-side Supabase instance (uses anon key)
// تعطيل Realtime WebSocket عندما يكون الرابط وهمياً لمنع أخطاء ERR_NAME_NOT_RESOLVED
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: isPlaceholderUrl ? 0 : 10,
    },
  },
  ...(isPlaceholderUrl && {
    global: {
      headers: { 'x-offline-mode': 'true' },
    },
  }),
});

// Server-side Supabase instance (uses service role key for admin operations)
export function createServiceClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

