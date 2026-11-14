/**
 * إعدادات الموقع العامة — كل القيم التي تحتاج تعديلها في مكان واحد.
 *
 * ⚠️ القيم المعلّمة بـ PLACEHOLDER مؤقتة. غيّرها قبل النشر الحقيقي.
 */
export const site = {
  name: 'NAWA',
  nameAr: 'نوى',
  url: 'https://nawa-iq.com',

  // PLACEHOLDER: رقم واتساب الشركة بالصيغة الدولية بدون + أو أصفار (مثال: 9647701234567)
  whatsapp: '9640000000000',
  // PLACEHOLDER: رقم الهاتف كما يظهر للزائر
  phoneDisplay: '+964 000 000 0000',
  // PLACEHOLDER: البريد الرسمي
  email: 'info@nawa-iq.com',

  // PLACEHOLDER: العنوان وساعات العمل
  address: { en: 'Baghdad, Iraq', ar: 'بغداد، العراق' },
  hours: { en: 'Sunday to Thursday, 9:00 to 17:00 (Baghdad time)', ar: 'الأحد إلى الخميس، 9:00 إلى 17:00 (بتوقيت بغداد)' },

  // PLACEHOLDER: وعد زمن الرد. لا تكتب وعداً لا تستطيع الالتزام به.
  replyTime: { en: 'within one working day', ar: 'خلال يوم عمل واحد' },

  // PLACEHOLDER: روابط التواصل الاجتماعي (اترك الرابط فارغاً لإخفائه)
  social: {
    instagram: '',
    linkedin: '',
    facebook: '',
  },
} as const;

export type Lang = 'en' | 'ar';
export const LANGS: Lang[] = ['en', 'ar'];

/** رابط واتساب مع رسالة جاهزة */
export function whatsappLink(message = ''): string {
  const q = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${site.whatsapp}${q}`;
}
