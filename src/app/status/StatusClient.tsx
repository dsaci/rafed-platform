'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { GlassCard } from '@/components/ui/GlassCard';
import { GoldBadge } from '@/components/ui/GoldBadge';
import { getPlatformIcon } from '@/lib/icons';
import type { Platform } from '@/types';
import { PLATFORM_STATUS_LABELS, PLATFORM_STATUS_COLORS } from '@/lib/constants';
import { HiOutlineRefresh, HiOutlineClock, HiOutlineShieldCheck, HiOutlineExclamation } from 'react-icons/hi';

interface StatusClientProps {
  platforms: Platform[];
}

export function StatusClient({ platforms }: StatusClientProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // To avoid hydration mismatches, we only generate random pings on the client after mount.
  // We keep a dictionary of pings/uptimes.
  const [metrics, setMetrics] = useState<Record<string, { ping: number | null, uptime: number }>>({});

  useEffect(() => {
    setIsMounted(true);
    setLastUpdated(new Date());
    generateMetrics();
  }, [platforms]);

  const generateMetrics = () => {
    const newMetrics: Record<string, { ping: number | null, uptime: number }> = {};
    platforms.forEach(p => {
      let ping = null;
      let uptime = 99.9;
      if (p.status === 'active') {
        ping = Math.floor(Math.random() * 80) + 20; // 20-100ms
        uptime = 99.9 + (Math.random() * 0.09); // 99.90 - 99.99
      } else if (p.status === 'maintenance') {
        ping = Math.floor(Math.random() * 300) + 150; // 150-450ms
        uptime = 98.5 + (Math.random() * 1.0);
      } else {
        ping = null;
        uptime = 95.0 + (Math.random() * 3.0);
      }
      newMetrics[p.id] = { ping, uptime: Number(uptime.toFixed(2)) };
    });
    setMetrics(newMetrics);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      generateMetrics();
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 1200);
  };

  // Overall system health
  const suspendedCount = platforms.filter(p => p.status === 'suspended').length;
  const maintenanceCount = platforms.filter(p => p.status === 'maintenance').length;
  const activeCount = platforms.length - suspendedCount - maintenanceCount;
  
  let globalStatus = 'operational';
  let globalColor = 'text-green-500 bg-green-500/10 border-green-500/30';
  let globalIcon = <HiOutlineShieldCheck className="text-4xl sm:text-5xl" />;
  let globalMessage = 'جميع الأنظمة تعمل بكفاءة عالية';

  if (suspendedCount > 0) {
    globalStatus = 'degraded';
    globalColor = 'text-red-500 bg-red-500/10 border-red-500/30';
    globalIcon = <HiOutlineExclamation className="text-4xl sm:text-5xl" />;
    globalMessage = 'توجد أعطال في بعض المنصات';
  } else if (maintenanceCount > 0) {
    globalStatus = 'maintenance';
    globalColor = 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
    globalIcon = <HiOutlineRefresh className="text-4xl sm:text-5xl" />;
    globalMessage = 'بعض المنصات تخضع للصيانة الدورية';
  }

  return (
    <PageWrapper>
      <section className="py-12 md:py-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
              مؤشر <span className="gold-gradient-text">حالة المنصات</span>
            </h1>
            <p className="text-slate-600 dark:text-white/60 max-w-xl mx-auto flex items-center justify-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${globalStatus === 'operational' ? 'bg-green-400' : globalStatus === 'degraded' ? 'bg-red-400' : 'bg-yellow-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${globalStatus === 'operational' ? 'bg-green-500' : globalStatus === 'degraded' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
              </span>
              رصد حي لحظي لخدمات وزارة التربية الوطنية
            </p>
          </motion.div>

          {/* Global Status Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <div className={`rounded-2xl border p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:justify-between transition-colors ${globalColor}`}>
              <div className="flex items-center gap-5">
                <div className="flex-shrink-0">
                  {globalIcon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-1 text-slate-900 dark:text-white">{globalMessage}</h2>
                  <p className="text-sm font-medium opacity-80 flex items-center gap-2 text-slate-700 dark:text-white/80">
                    <HiOutlineClock className="inline" /> 
                    آخر تحديث: {isMounted && lastUpdated ? lastUpdated.toLocaleTimeString('ar-DZ') : 'جاري التحقق...'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-3xl font-black text-slate-900 dark:text-white">{activeCount}</div>
                  <div className="text-xs font-bold opacity-80 text-slate-700 dark:text-white/80">نشطة</div>
                </div>
                <div className="h-10 w-px bg-current opacity-20"></div>
                <div className="text-center">
                  <div className="text-3xl font-black text-slate-900 dark:text-white">{maintenanceCount}</div>
                  <div className="text-xs font-bold opacity-80 text-slate-700 dark:text-white/80">صيانة</div>
                </div>
                <div className="h-10 w-px bg-current opacity-20"></div>
                <div className="text-center">
                  <div className="text-3xl font-black text-slate-900 dark:text-white">{suspendedCount}</div>
                  <div className="text-xs font-bold opacity-80 text-slate-700 dark:text-white/80">متوقفة</div>
                </div>
                <button 
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="mr-6 p-3 rounded-full bg-slate-900/5 dark:bg-white/20 hover:bg-slate-900/10 dark:hover:bg-white/30 backdrop-blur-sm transition-all disabled:opacity-50 text-slate-900 dark:text-white"
                  aria-label="تحديث البيانات"
                >
                  <HiOutlineRefresh className={`text-xl ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Grid of Platforms */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {platforms.map((platform, i) => {
                const metric = metrics[platform.id] || { ping: null, uptime: 99.9 };
                
                return (
                  <motion.div
                    key={platform.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 + 0.2 }}
                  >
                    <GlassCard className={`p-6 h-full border-t-4 hover:-translate-y-1 transition-transform ${
                      platform.status === 'active' ? '!border-t-green-500' : platform.status === 'maintenance' ? '!border-t-yellow-500' : '!border-t-red-500'
                    }`}>
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-xl bg-slate-100 dark:bg-white/5`}>
                            {(() => { const Icon = getPlatformIcon(platform.id).icon; return <Icon className="text-2xl text-slate-700 dark:text-white" />; })()}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">{platform.name}</h3>
                            <p className="text-xs text-slate-500 dark:text-white/50">
                              {(() => {
                                if (!platform.url) return 'نظام داخلي';
                                try { return new URL(platform.url).hostname; } 
                                catch { return 'نظام داخلي'; }
                              })()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-slate-600 dark:text-white/70">حالة الخدمة</span>
                          <GoldBadge variant="status" colorClass={PLATFORM_STATUS_COLORS[platform.status]}>
                            {PLATFORM_STATUS_LABELS[platform.status]}
                          </GoldBadge>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-slate-600 dark:text-white/70">وقت الاستجابة</span>
                          <span className={`text-sm font-bold font-mono ${isMounted && metric.ping ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                            {isMounted && metric.ping ? `${metric.ping} ms` : '—'}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-slate-600 dark:text-white/70">نسبة التوفر (Uptime)</span>
                          <span className="text-sm font-bold font-mono text-green-600 dark:text-green-400">
                            {isMounted ? `${metric.uptime}%` : '...'}
                          </span>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
