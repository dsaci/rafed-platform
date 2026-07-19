export const OSTAD_PLATFORM = {
  id: 'ostad',
  name: 'فضاء الأستاذ',
  description: 'المنصة الوزارية الرسمية المخصصة لأساتذة قطاع التربية الوطنية. تعتبر البوابة المركزية للاطلاع على البيانات المهنية، استخراج الوثائق، وتسيير الأفواج التربوية.',
  category: 'educational',
  status: 'active',
  is_official: true,
  order_index: 1,
  url: 'https://ostad.education.dz/'
};

export const MOWADAF_PLATFORM = {
  id: 'mowadaf',
  name: 'منصة موظف',
  description: 'هي بوابة الخدمات الرقمية الشاملة لموظفي قطاع التربية الوطنية. تشمل كل الموظفين والإداريين، وتحتوي أيضاً على الامتحانات المهنية للرتب.',
  category: 'admin',
  status: 'active',
  is_official: true,
  order_index: 2,
};

export const TAWDIF_PLATFORM = {
  id: 'tawdif',
  name: 'منصة توظيف',
  description: 'منصة إلكترونية شاملة خاصة بالمرشحين الخارجيين، تحتوي على جميع مسابقات التوظيف الرسمية في قطاع التربية الوطنية.',
  category: 'external',
  status: 'active',
  is_official: true,
  order_index: 3,
  url: 'https://tawdif.education.dz/'
};

export const EVALUATION_PLATFORM = {
  id: 'evaluation',
  name: 'منصة تقييم المكتسبات',
  description: 'منصة مخصصة لتقييم مكتسبات مرحلة التعليم الابتدائي ومتابعة مستوى التحصيل الدراسي للتلاميذ.',
  category: 'educational',
  status: 'active',
  is_official: true,
  order_index: 4,
};

export const AWLYAA_PLATFORM = {
  id: 'awlyaa',
  name: 'فضاء أولياء التلاميذ',
  description: 'مرحبا بكم في فضاء أولياء التلاميذ يُعتبر فضاء الأولياء منصة رقمية نوعيًة في مجال التربية، ووسيلة تكنولوجية فعالة لتعزيز مشاركة أولياء الأمور في العملية التعليمية، حيث يوفر لهم بيئة رقمية غنية بمجموعة من الخدمات والمعلومات التي تساعدهم على مرافقة أبنائهم طيلة مسارهم الدراسي، كالاطلاع على النتائج المدرسية، معلومات التمدرس، الغيابات، وكذا الاستفادة من عدة خدمات عن بعد كطلب تحويل التلاميذ، إعادة إدماج التلاميذ، رخصة تخفيض السن..',
  category: 'parent',
  status: 'active',
  is_official: true,
  order_index: 5,
  url: 'https://awlyaa.education.dz/'
};

export const INSTITUTION_SPACE_PLATFORM = {
  id: 'institution_space',
  name: 'فضاء المؤسسة',
  description: 'بوابة رقمية مخصصة لمديري المؤسسات التربوية لتسيير شؤون المؤسسة بشكل متكامل.',
  category: 'admin',
  status: 'active',
  is_official: true,
  order_index: 6,
};

export const ONEC_PLATFORM = {
  id: 'onec',
  name: 'موقع الديوان الوطني للامتحانات والمسابقات : ONEC',
  description: 'الموقع الرسمي للديوان الوطني (ONEC) المخصص لتنظيم وتسيير كافة الامتحانات المدرسية الوطنية.',
  category: 'educational',
  status: 'active',
  is_official: true,
  order_index: 8,
};

export const LITERACY_PLATFORM = {
  id: 'literacy',
  name: 'الديوان الوطني لمحو الأمية وتعليم الكبار',
  description: 'فضاء مخصص لإدارة شؤون محو الأمية وتعليم الكبار التابع لوزارة التربية الوطنية.',
  category: 'admin',
  status: 'active',
  is_official: true,
  order_index: 10,
};

export const PUBLICATIONS_PLATFORM = {
  id: 'publications',
  name: 'الديوان الوطني للمطبوعات المدرسية',
  description: 'مؤسسة عمومية ذات طابع صناعي وتجاري للتعامل مع المطبوعات والكتب المدرسية وتوزيعها.',
  category: 'admin',
  status: 'active',
  is_official: true,
  order_index: 11,
};

const ALL_VIRTUAL_PLATFORMS = [
  OSTAD_PLATFORM,
  MOWADAF_PLATFORM,
  TAWDIF_PLATFORM,
  EVALUATION_PLATFORM,
  AWLYAA_PLATFORM,
  INSTITUTION_SPACE_PLATFORM,
  ONEC_PLATFORM,
  LITERACY_PLATFORM,
  PUBLICATIONS_PLATFORM,
];

export function processPlatforms(platforms: any[]) {
  // If database is empty or unreachable, return our complete virtual list
  if (!platforms || platforms.length === 0) {
    return ALL_VIRTUAL_PLATFORMS.sort((a, b) => a.order_index - b.order_index);
  }

  // Otherwise, merge database platforms with our virtual platforms
  let processed = [...platforms];
  
  ALL_VIRTUAL_PLATFORMS.forEach(virtualP => {
    // Check if database already has this platform (by ID or exact Name)
    const exists = processed.some(dbP => dbP.id === virtualP.id || dbP.name === virtualP.name);
    if (!exists) {
      processed.push(virtualP);
    }
  });

  // Clean up any duplicates or incorrect platforms coming from DB
  processed = processed.filter(p => {
    // الامتحانات المهنية للرتب تم دمجها في منصة موظف
    if (p.name.includes('الامتحانات المهنية') || p.name.includes('الرتب')) return false;
    // حركة الأساتذة تم دمجها في فضاء الأستاذ
    if (p.name.includes('حركة')) return false;
    return true;
  });

  return processed.sort((a, b) => (a.order_index || 99) - (b.order_index || 99));
}
