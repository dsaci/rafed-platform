/* ═══════════════════════════════
   رافد — Wilaya Select Component
   ═══════════════════════════════ */

'use client';

import React, { useState, useMemo } from 'react';
import { WILAYAS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface WilayaSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}

export function WilayaSelect({ value, onChange, error, className }: WilayaSelectProps) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!search) return WILAYAS;
    return WILAYAS.filter(
      (w) => w.label.includes(search) || w.value.includes(search)
    );
  }, [search]);

  const selectedLabel = WILAYAS.find((w) => w.value === value)?.label || '';

  return (
    <div className={cn('relative', className)}>
      <label className="block text-sm font-bold text-slate-600 dark:text-white/70 mb-2">الولاية</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full px-4 py-3 rounded-xl text-right bg-slate-100 dark:bg-white/5 border text-slate-900 dark:text-white transition-all',
          error ? 'border-red-500/50' : 'border-gold-border hover:border-gold-primary/50',
          isOpen && 'border-gold-primary/50'
        )}
      >
        {value ? selectedLabel : 'اختر الولاية...'}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-20 rounded-xl border border-gold-border bg-white dark:bg-dark-surface/95 backdrop-blur-xl overflow-hidden shadow-glass">
          <div className="p-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن ولاية..."
              className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 dark:text-white/30 focus:outline-none focus:border-gold-primary/50"
              autoFocus
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filtered.map((wilaya) => (
              <button
                key={wilaya.value}
                type="button"
                onClick={() => {
                  onChange(wilaya.value);
                  setIsOpen(false);
                  setSearch('');
                }}
                className={cn(
                  'w-full text-right px-4 py-2.5 text-sm transition-colors hover:bg-gold-primary/10',
                  value === wilaya.value
                    ? 'text-gold-light bg-gold-primary/5'
                    : 'text-slate-600 dark:text-white/70'
                )}
              >
                {wilaya.label}
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="px-4 py-4 text-sm text-slate-400 dark:text-white/30 text-center">لا توجد نتائج</p>
            )}
          </div>
        </div>
      )}

      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
