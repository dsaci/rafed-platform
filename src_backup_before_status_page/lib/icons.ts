// src/lib/icons.ts
/**
 * نظام الأيقونات الموحد للمنصة
 * جميع الأيقونات مأخوذة من react-icons/hi2 و react-icons/hi
 * كل أيقونة لها لون وخلفية موحدة
 */

import { HiCheckCircle, HiExclamationCircle, HiXCircle } from 'react-icons/hi2';
import { HiClock } from 'react-icons/hi';
import {
  HiOutlineAcademicCap,
  HiOutlineHome,
  HiOutlineShieldCheck,
  HiOutlineUserGroup,
  HiOutlineIdentification,
  HiOutlineBookOpen,
  HiOutlineCalculator,
  HiOutlineOfficeBuilding,
  HiOutlinePencilAlt,
  HiOutlineDocumentText,
  HiOutlineEye,
  HiOutlineLockClosed,
  HiOutlineBell,
  HiOutlineDownload,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineCheck,
  HiOutlineX,
  HiCurrencyDollar,
  HiOutlineLibrary,
} from 'react-icons/hi';
import { HiOutlineExclamation, HiOutlineInformationCircle } from 'react-icons/hi';

/**
 * حالات التذاكر (Ticket Status)
 * 4 حالات رئيسية مع أيقونات وألوان مختلفة
 */
export const ICON_TICKET_STATUS = {
  open: {
    icon: HiExclamationCircle,
    color: 'text-orange-500',
    bgColor: 'bg-orange-100',
    label: 'مفتوح',
    description: 'تذكرة جديدة قيد المعالجة',
  },
  pending: {
    icon: HiClock,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-100',
    label: 'معلق',
    description: 'بانتظار رد المستخدم',
  },
  resolved: {
    icon: HiCheckCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-100',
    label: 'محلول',
    description: 'تم حل المشكلة بنجاح',
  },
  closed: {
    icon: HiXCircle,
    color: 'text-gray-500',
    bgColor: 'bg-gray-100',
    label: 'مغلق',
    description: 'تذكرة مغلقة نهائياً',
  },
} as const;

/**
 * المنصات الرقمية (10 منصات)
 * كل منصة لها أيقونة فريدة ولون مميز
 */
export const ICON_PLATFORM = {
  supabase: {
    icon: HiOutlineShieldCheck,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    label: 'قاعدة البيانات',
    category: 'تقنية',
  },
  e_services: {
    icon: HiOutlineIdentification,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    label: 'الخدمات الإلكترونية',
    category: 'خدمي',
  },
  evaluation: {
    icon: HiOutlineCalculator,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    label: 'تقييم المكتسبات',
    category: 'تعليمي',
  },
  recruitment: {
    icon: HiOutlineUserGroup,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    label: 'التوظيف',
    category: 'إداري',
  },
  payroll: {
    icon: HiCurrencyDollar,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    label: 'الرواتب',
    category: 'مالي',
  },
  exams: {
    icon: HiOutlinePencilAlt,
    color: 'text-rose-600',
    bgColor: 'bg-rose-100',
    label: 'الامتحانات',
    category: 'تعليمي',
  },
  institution: {
    icon: HiOutlineOfficeBuilding,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100',
    label: 'فضاء المؤسسة',
    category: 'إداري',
  },
  parent_space: {
    icon: HiOutlineHome,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    label: 'فضاء الأولياء',
    category: 'أسري',
  },
  documents: {
    icon: HiOutlineDocumentText,
    color: 'text-slate-600',
    bgColor: 'bg-slate-100',
    label: 'المستندات',
    category: 'إداري',
  },
} as const;

/**
 * أنواع المستخدمين (User Roles)
 * 4 أدوار أساسية مع أيقونات مختلفة
 */
export const ICON_USER_ROLE = {
  teacher: {
    icon: HiOutlineAcademicCap,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
    label: 'أستاذ',
    description: 'معلم أو مدرس',
  },
  admin: {
    icon: HiOutlineShieldCheck,
    color: 'text-red-500',
    bgColor: 'bg-red-100',
    label: 'إداري',
    description: 'موظف إداري',
  },
  parent: {
    icon: HiOutlineHome,
    color: 'text-amber-500',
    bgColor: 'bg-amber-100',
    label: 'ولي',
    description: 'ولي التلميذ',
  },
  employee: {
    icon: HiOutlineIdentification,
    color: 'text-green-500',
    bgColor: 'bg-green-100',
    label: 'موظف',
    description: 'موظف بالوزارة',
  },
} as const;

/**
 * أيقونات الإجراءات (Action Icons)
 * أيقونات للعمليات المختلفة
 */
export const ICON_ACTION = {
  create: {
    icon: HiOutlinePencilAlt,
    color: 'text-blue-500',
    label: 'إنشاء',
  },
  edit: {
    icon: HiOutlinePencil,
    color: 'text-amber-500',
    label: 'تعديل',
  },
  view: {
    icon: HiOutlineEye,
    color: 'text-purple-500',
    label: 'عرض',
  },
  delete: {
    icon: HiOutlineTrash,
    color: 'text-red-500',
    label: 'حذف',
  },
  approve: {
    icon: HiOutlineCheck,
    color: 'text-green-500',
    label: 'موافقة',
  },
  reject: {
    icon: HiOutlineX,
    color: 'text-red-500',
    label: 'رفض',
  },
  lock: {
    icon: HiOutlineLockClosed,
    color: 'text-gray-500',
    label: 'قفل',
  },
  download: {
    icon: HiOutlineDownload,
    color: 'text-blue-500',
    label: 'تحميل',
  },
  notification: {
    icon: HiOutlineBell,
    color: 'text-yellow-500',
    label: 'إشعار',
  },
  info: {
    icon: HiOutlineInformationCircle,
    color: 'text-blue-500',
    label: 'معلومات',
  },
} as const;

/** Helper functions */
export function getTicketStatusIcon(status: keyof typeof ICON_TICKET_STATUS) {
  return ICON_TICKET_STATUS[status];
}

export function getPlatformIcon(platform: string) {
  if (platform === 'literacy-virtual-id') {
    return { icon: HiOutlineLibrary, color: 'text-indigo-400', bgColor: 'bg-indigo-900/50', label: 'الديوان الوطني لمحو الأمية', category: 'administrative' };
  }
  if (platform === 'publications-virtual-id') {
    return { icon: HiOutlineBookOpen, color: 'text-fuchsia-400', bgColor: 'bg-fuchsia-900/50', label: 'الديوان الوطني للمطبوعات المدرسية', category: 'administrative' };
  }
  if (platform === 'ostad') {
    return { icon: HiOutlineAcademicCap, color: 'text-gold-light', bgColor: 'bg-gold-primary/10', label: 'فضاء الأستاذ', category: 'educational' };
  }
  if (platform === 'tawdif') {
    return { icon: HiOutlineUserGroup, color: 'text-rose-400', bgColor: 'bg-rose-900/50', label: 'منصة توظيف', category: 'external' };
  }
  const fallback = { icon: HiOutlineDocumentText, color: 'text-gray-500', bgColor: 'bg-gray-100', label: platform, category: '' };
  if (platform in ICON_PLATFORM) {
    return ICON_PLATFORM[platform as keyof typeof ICON_PLATFORM];
  }
  return fallback;
}

export function getUserRoleIcon(role: keyof typeof ICON_USER_ROLE) {
  return ICON_USER_ROLE[role];
}

export function getActionIcon(action: keyof typeof ICON_ACTION) {
  return ICON_ACTION[action];
}

/** Utility to fetch all platforms */
export function getAllPlatforms() {
  return Object.entries(ICON_PLATFORM).map(([key, value]) => ({
    id: key,
    ...value,
  }));
}

/** Utility to fetch all user roles */
export function getAllUserRoles() {
  return Object.entries(ICON_USER_ROLE).map(([key, value]) => ({
    id: key,
    ...value,
  }));
}

