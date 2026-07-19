/* ═══════════════════════════════
   رافد — Gold Button Component
   ═══════════════════════════════ */

'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface GoldButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-l from-gold-primary to-gold-light text-slate-900 font-bold hover:shadow-gold-hover hover:scale-[1.02]',
  secondary:
    'bg-gold-primary/10 text-slate-800 dark:text-gold-light border border-gold-primary/40 dark:border-gold-border hover:bg-gold-primary/20 hover:border-gold-primary/60',
  outline:
    'bg-transparent text-slate-800 dark:text-gold-light border border-gold-primary/40 dark:border-gold-border hover:bg-gold-primary/10 hover:border-gold-primary/60',
  ghost:
    'bg-transparent text-slate-800 dark:text-gold-light hover:bg-slate-100 dark:hover:bg-white/5',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm rounded-xl',
  md: 'px-6 py-3 text-base rounded-2xl',
  lg: 'px-8 py-4 text-lg rounded-2xl',
};

export function GoldButton({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  disabled = false,
  loading = false,
  className,
  type = 'button',
  fullWidth = false,
}: GoldButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 font-tajawal transition-all duration-300',
    'min-h-[44px] select-none',
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'w-full',
    (disabled || loading) && 'opacity-50 cursor-not-allowed pointer-events-none',
    className
  );

  const content = (
    <>
      {loading && (
        <svg
          className="animate-spin h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
    >
      {content}
    </motion.button>
  );
}

