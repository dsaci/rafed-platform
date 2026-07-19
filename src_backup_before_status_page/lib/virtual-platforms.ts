
export const OSTAD_PLATFORM = {
  id: 'ostad',
  name: 'فضاء الأستاذ',
  description: 'المنصة الوزارية الرسمية المخصصة لأساتذة قطاع التربية الوطنية. تعتبر البوابة المركزية للاطلاع على البيانات المهنية، استخراج الوثائق، وتسيير الأفواج التربوية.',
  category: 'educational',
  status: 'active',
  is_official: true,
  order_index: 1, // تظهر في البداية لأهميتها
  url: 'https://ostad.education.dz/'
};

export const LITERACY_PLATFORM = {
  id: 'literacy-virtual-id',
  name: 'الديوان الوطني لمحو الأمية وتعليم الكبار',
  description: 'فضاء مخصص لإدارة شؤون محو الأمية وتعليم الكبار التابع للوصاية وزارة التربية الوطنية.',
  category: 'administrative',
  status: 'active',
  is_official: true,
  order_index: 20
};

export const PUBLICATIONS_PLATFORM = {
  id: 'publications-virtual-id',
  name: 'الديوان الوطني للمطبوعات المدرسية',
  description: 'مؤسسة عمومية ذات طابع صناعي وتجاري للتعامل مع المطبوعات والكتب المدرسية تحت وصاية وزارة التربية الوطنية.',
  category: 'administrative',
  status: 'active',
  is_official: true,
  order_index: 21
};

export const TAWDIF_PLATFORM = {
  id: 'tawdif',
  name: 'منصة توظيف',
  description: 'منصة إلكترونية شاملة تحتوي على جميع مسابقات التوظيف الرسمية في قطاع التربية الوطنية، تهدف هذه البوابة إلى تسهيل عملية البحث عن المسابقات من خلال تجميع كافة المنصات الإلكترونية الوظيفية في مكان واحد.',
  category: 'external',
  status: 'active',
  is_official: true,
  order_index: 22,
  url: 'https://tawdif.education.dz/'
};

export function injectVirtualPlatforms(platforms: any[]) {
  // Add ostad platform
  const hasOstad = platforms.some(p => p.id === OSTAD_PLATFORM.id);
  // Add literacy platform
  const hasLiteracy = platforms.some(p => p.id === LITERACY_PLATFORM.id || p.name === LITERACY_PLATFORM.name);
  // Add publications platform
  const hasPublications = platforms.some(p => p.id === PUBLICATIONS_PLATFORM.id || p.name === PUBLICATIONS_PLATFORM.name);
  // Add tawdif platform
  const hasTawdif = platforms.some(p => p.id === TAWDIF_PLATFORM.id || p.name === TAWDIF_PLATFORM.name);
  
  let updated = [...platforms];
  if (!hasOstad) {
    updated.push(OSTAD_PLATFORM);
  }
  if (!hasLiteracy) {
    updated.push(LITERACY_PLATFORM);
  }
  if (!hasPublications) {
    updated.push(PUBLICATIONS_PLATFORM);
  }
  if (!hasTawdif) {
    updated.push(TAWDIF_PLATFORM);
  }
  
  return updated.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
}

/**
 * دالة مركزية لمعالجة المنصات المسترجعة من قاعدة البيانات
 * تقوم بحقن المنصات الافتراضية، دمج/تعديل المنصات، وحذف ما يجب حذفه
 */
export function processPlatforms(platforms: any[]) {
  // 1. إضافة المنصات الافتراضية
  let processed = injectVirtualPlatforms(platforms);
  
  // 2. تحديث وتعديل المنصات الموجودة
  processed = processed.map(p => {
    // تحديث منصة موظف (أو الخدمات الإلكترونية)
    if (p.name.includes('موظف') || p.name.includes('الخدمات')) {
      return {
        ...p,
        name: 'منصة موظف',
        description: 'هي بوابة الخدمات الرقمية لموظفي قطاع التربية الوطنية. بوابة موحدة وآمنة مصممة خصيصاً للأسرة التربوية — أساتذة، مديرون، موظفون إداريون، وكل أعضاء الطاقم التربوي.',
      };
    }
    return p;
  });

  // 3. حذف المنصات المدمجة أو غير المطلوبة
  processed = processed.filter(p => {
    // حذف الامتحانات المهنية للرتب (تم دمجها في منصة موظف)
    if (p.name.includes('الامتحانات') || p.name.includes('الرتب')) {
      return false;
    }
    
    // دمج منصات الأساتذة في منصة واحدة (الافتراضية ostad)
    // نمنع المنصات القادمة من قاعدة البيانات التي تشبه "فضاء الأستاذ" لكي لا تتكرر
    const isTeacherPlatform = p.name.includes('فضاء الاستاذ') || 
                              p.name.includes('فضاء الأستاذ') || 
                              p.name.includes('فضاء الاساتذة') || 
                              p.name.includes('فضاء الأساتذة');
    if (p.id !== 'ostad' && isTeacherPlatform) {
      return false;
    }
    
    return true;
  });

  return processed;
}

