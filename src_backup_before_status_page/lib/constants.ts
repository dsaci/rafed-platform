import type { FilterOption, NavLink } from '@/types';
import {
  ICON_PLATFORM,
  ICON_USER_ROLE,
  ICON_TICKET_STATUS,
} from './icons';

// 69 Algerian Wilayas
export const WILAYAS: FilterOption[] = [
  { value: 'أدرار', label: '01 - أدرار' },
  { value: 'الشلف', label: '02 - الشلف' },
  { value: 'الأغواط', label: '03 - الأغواط' },
  { value: 'أم البواقي', label: '04 - أم البواقي' },
  { value: 'باتنة', label: '05 - باتنة' },
  { value: 'بجاية', label: '06 - بجاية' },
  { value: 'بسكرة', label: '07 - بسكرة' },
  { value: 'بشار', label: '08 - بشار' },
  { value: 'البليدة', label: '09 - البليدة' },
  { value: 'البويرة', label: '10 - البويرة' },
  { value: 'تمنراست', label: '11 - تمنراست' },
  { value: 'تبسة', label: '12 - تبسة' },
  { value: 'تلمسان', label: '13 - تلمسان' },
  { value: 'تيارت', label: '14 - تيارت' },
  { value: 'تيزي وزو', label: '15 - تيزي وزو' },
  { value: 'الجزائر', label: '16 - الجزائر' },
  { value: 'الجلفة', label: '17 - الجلفة' },
  { value: 'جيجل', label: '18 - جيجل' },
  { value: 'سطيف', label: '19 - سطيف' },
  { value: 'سعيدة', label: '20 - سعيدة' },
  { value: 'سكيكدة', label: '21 - سكيكدة' },
  { value: 'سيدي بلعباس', label: '22 - سيدي بلعباس' },
  { value: 'عنابة', label: '23 - عنابة' },
  { value: 'قالمة', label: '24 - قالمة' },
  { value: 'قسنطينة', label: '25 - قسنطينة' },
  { value: 'المدية', label: '26 - المدية' },
  { value: 'مستغانم', label: '27 - مستغانم' },
  { value: 'المسيلة', label: '28 - المسيلة' },
  { value: 'معسكر', label: '29 - معسكر' },
  { value: 'ورقلة', label: '30 - ورقلة' },
  { value: 'وهران', label: '31 - وهران' },
  { value: 'البيض', label: '32 - البيض' },
  { value: 'إليزي', label: '33 - إليزي' },
  { value: 'برج بوعريريج', label: '34 - برج بوعريريج' },
  { value: 'بومرداس', label: '35 - بومرداس' },
  { value: 'الطارف', label: '36 - الطارف' },
  { value: 'تندوف', label: '37 - تندوف' },
  { value: 'تيسمسيلت', label: '38 - تيسمسيلت' },
  { value: 'الوادي', label: '39 - الوادي' },
  { value: 'خنشلة', label: '40 - خنشلة' },
  { value: 'سوق أهراس', label: '41 - سوق أهراس' },
  { value: 'تيبازة', label: '42 - تيبازة' },
  { value: 'ميلة', label: '43 - ميلة' },
  { value: 'عين الدفلى', label: '44 - عين الدفلى' },
  { value: 'النعامة', label: '45 - النعامة' },
  { value: 'عين تموشنت', label: '46 - عين تموشنت' },
  { value: 'غرداية', label: '47 - غرداية' },
  { value: 'غليزان', label: '48 - غليزان' },
  { value: 'تيميمون', label: '49 - تيميمون' },
  { value: 'برج باجي مختار', label: '50 - برج باجي مختار' },
  { value: 'أولاد جلال', label: '51 - أولاد جلال' },
  { value: 'بني عباس', label: '52 - بني عباس' },
  { value: 'إن صالح', label: '53 - إن صالح' },
  { value: 'إن قزام', label: '54 - إن قزام' },
  { value: 'تقرت', label: '55 - تقرت' },
  { value: 'جانت', label: '56 - جانت' },
  { value: 'المغير', label: '57 - المغير' },
  { value: 'المنيعة', label: '58 - المنيعة' },
  { value: 'الجزائر شرق', label: '59 - الجزائر شرق' },
  { value: 'الجزائر غرب', label: '60 - الجزائر غرب' },
  { value: 'الجزائر وسط', label: '61 - الجزائر وسط' },
  { value: 'باتنة جنوب', label: '62 - باتنة جنوب' },
  { value: 'البليدة شرق', label: '63 - البليدة شرق' },
  { value: 'بجاية غرب', label: '64 - بجاية غرب' },
  { value: 'تيزي وزو شرق', label: '65 - تيزي وزو شرق' },
  { value: 'سطيف شرق', label: '66 - سطيف شرق' },
  { value: 'وهران شرق', label: '67 - وهران شرق' },
  { value: 'ورقلة شرق', label: '68 - ورقلة شرق' },
  { value: 'عين صالح غرب', label: '69 - عين صالح غرب' },
];

export const CONTENT_TYPE_LABELS: Record<string, string> = {
  video: 'فيديو توضيحي',
  article: 'مقال',
  faq: 'سؤال شائع',
};

export const ISSUE_STATUS_LABELS: Record<string, string> = {
  new: 'جديد',
  processing: 'قيد المعالجة',
  solved: 'تم الحل',
  escalated: 'مُصعد',
};

export const ISSUE_PRIORITY_LABELS: Record<string, string> = {
  low: 'منخفض',
  normal: 'عادي',
  high: 'مرتفع',
  critical: 'حرج',
};

export const PLATFORM_CATEGORY_LABELS: Record<string, string> = {
  teacher: 'الأساتذة',
  admin: 'الإدارة',
  parent: 'الأولياء',
  external: 'خارجي',
};
export const PLATFORM_STATUS_LABELS: Record<string, string> = {
  active: 'نشط',
  maintenance: 'صيانة',
  suspended: 'متوقف',
};

export const PLATFORM_STATUS_COLORS: Record<string, string> = {
  active: 'text-green-500 bg-green-500/10 border-green-500/20',
  maintenance: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
  suspended: 'text-red-500 bg-red-500/10 border-red-500/20',
};
export const CATEGORY_LABELS: Record<string, string> = {
  teacher: 'الأساتذة',
  admin: 'الإدارة',
  parent: 'الأولياء',
  external: 'خارجي',
};

export const NAV_LINKS = [
  { href: '/', label: 'الرئيسية' },
  { href: '/platforms', label: 'المنصات' },
  { href: '/content', label: 'المكتبة' },
  { href: '/issues', label: 'الانشغالات' },
];
export const PLATFORM_CATEGORIES: FilterOption[] = [
  { value: 'all', label: 'الكل' },
  { value: 'teacher', label: 'الأساتذة' },
  { value: 'admin', label: 'الإدارة' },
  { value: 'parent', label: 'الأولياء' },
  { value: 'external', label: 'خارجي' },
];export const USER_TYPES = [
  { value: 'teacher', label: 'أستاذ' },
  { value: 'admin', label: 'إداري' },
  { value: 'parent', label: 'ولي التلميذ' },
  { value: 'supervisor', label: 'مشرف تربوي' },
  { value: 'other', label: 'آخر' }
];
