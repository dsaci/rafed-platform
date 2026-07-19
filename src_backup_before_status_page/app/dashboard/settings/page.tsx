/* رافد — Dashboard Settings Page */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { GoldButton } from '@/components/ui/GoldButton';
import { GoldBadge } from '@/components/ui/GoldBadge';
import { useToast } from '@/components/ui/ToastProvider';
import { supabase } from '@/lib/supabase';
import { PLATFORM_STATUS_LABELS, PLATFORM_STATUS_COLORS } from '@/lib/constants';
import type { Platform, Profile } from '@/types';

export default function DashboardSettingsPage() {
  const { addToast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [fullName, setFullName] = useState('');

  const fetchData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) { setProfile(data as Profile); setFullName((data as Profile).full_name || ''); }
    }
    const { data: p } = await supabase.from('platforms').select('*').order('order_index');
    setPlatforms((p as Platform[]) || []);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const updateProfile = async () => {
    if (!profile) return;
    const { error } = await supabase.from('profiles').update({ full_name: fullName }).eq('id', profile.id);
    if (error) { addToast('error', 'حدث خطأ'); return; }
    addToast('success', 'تم تحديث الملف الشخصي');
  };

  const togglePlatformStatus = async (id: string, current: string) => {
    const next = current === 'active' ? 'maintenance' : current === 'maintenance' ? 'suspended' : 'active';
    const { error } = await supabase.from('platforms').update({ status: next }).eq('id', id);
    if (error) { addToast('error', 'حدث خطأ'); return; }
    addToast('success', `تم تحديث حالة المنصة إلى: ${PLATFORM_STATUS_LABELS[next]}`);
    fetchData();
  };

  return (
    <div className="space-y-8">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-extrabold gold-gradient-text">الإعدادات</motion.h1>

      {/* Profile */}
      <GlassCard className="p-6" hover={false} animate={false}>
        <h3 className="text-sm font-bold text-gold-light mb-4">الملف الشخصي</h3>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="text-xs text-white/40 mb-1 block">الاسم الكامل</label>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-gold-border text-white text-sm focus:outline-none" />
          </div>
          {profile && (
            <div>
              <label className="text-xs text-white/40 mb-1 block">الدور</label>
              <GoldBadge>{profile.role === 'superadmin' ? 'مشرف عام' : 'مشرف'}</GoldBadge>
            </div>
          )}
          <GoldButton onClick={updateProfile} size="sm">حفظ</GoldButton>
        </div>
      </GlassCard>

      {/* Platform Management */}
      <GlassCard className="p-6" hover={false} animate={false}>
        <h3 className="text-sm font-bold text-gold-light mb-4">إدارة المنصات</h3>
        <div className="space-y-3">
          {platforms.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div>
                <p className="text-sm text-white/80 font-medium">{p.name}</p>
                <p className="text-xs text-white/30">{p.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <GoldBadge variant="status" colorClass={PLATFORM_STATUS_COLORS[p.status]}>
                  {PLATFORM_STATUS_LABELS[p.status]}
                </GoldBadge>
                <button onClick={() => togglePlatformStatus(p.id, p.status)} className="text-xs text-gold-light hover:underline">تغيير</button>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

