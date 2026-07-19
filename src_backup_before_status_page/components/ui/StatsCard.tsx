/* ═══════════════════════════════
   رافد — Stats Card Component
   ═══════════════════════════════ */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { formatArabicNumber } from '@/lib/utils';

interface StatsCardProps {
  label: string;
  value: number;
  icon: string;
  delay?: number;
  color?: string;
}

export function StatsCard({ label, value, icon, delay = 0, color }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="relative rounded-[24px] border border-gold-primary/30 bg-[#ffffff] dark:bg-[#0d1b2a]/80 shadow-lg dark:shadow-[0_4px_24px_rgba(201,168,76,0.08)] backdrop-blur-xl p-6 md:p-8 hover:border-gold-light hover:shadow-xl dark:hover:shadow-[0_8px_32px_rgba(201,168,76,0.15)] hover:-translate-y-2 transition-all duration-300 group overflow-hidden"
    >
      {/* Decorative background glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-gold-primary/10 dark:bg-gold-primary/15 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="flex items-center gap-5 relative z-10">
        {/* Icon container */}
        <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-gold-primary/15 to-gold-primary/5 dark:from-gold-primary/25 dark:to-gold-primary/10 border border-gold-primary/20 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
          <span className="text-3xl md:text-4xl">
            {icon}
          </span>
        </div>
        
        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm md:text-base font-bold text-slate-800 dark:text-white mb-1.5 leading-snug">
            {label}
          </p>
          <motion.p
            initial={{ scale: 0.5, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: delay + 0.2 }}
            className={`text-3xl md:text-4xl font-extrabold tracking-tight ${color || 'text-gold-primary dark:text-gold-light'}`}
          >
            {formatArabicNumber(value)}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}

