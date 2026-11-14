/**
 * نصوص الواجهة المشتركة (القائمة، الأزرار، الفوتر) باللغتين + دوال مساعدة للروابط.
 * نصوص الصفحات نفسها موجودة في src/data/.
 */
import type { Lang } from '../config/site';

export const dirOf = (lang: Lang) => (lang === 'ar' ? 'rtl' : 'ltr');
export const otherLang = (lang: Lang): Lang => (lang === 'ar' ? 'en' : 'ar');

/** يبني رابط صفحة داخلية: path('ar', 'services/automation') => /ar/services/automation/ */
export function path(lang: Lang, route = ''): string {
  const clean = route.replace(/^\/+|\/+$/g, '');
  return `/${lang}/${clean ? clean + '/' : ''}`;
}

/** نفس الصفحة الحالية باللغة الأخرى (زر تبديل اللغة يذهب للصفحة المقابلة وليس للرئيسية) */
export function switchLangPath(pathname: string, to: Lang): string {
  const rest = pathname.replace(/^\/(en|ar)(\/|$)/, '');
  return `/${to}/${rest}`;
}

export const ui = {
  en: {
    siteTitle: 'NAWA · AI agency in Baghdad',
    siteDescription: 'NAWA builds AI agents, automation, websites, ERP and SaaS products, and brands for companies in Iraq and the Middle East.',
    skip: 'Skip to content',
    nav: { services: 'Services', work: 'Work', process: 'Process', about: 'About', contact: 'Contact' },
    cta: 'Start a project',
    whatsapp: 'WhatsApp',
    langSwitch: 'العربية',
    langSwitchLabel: 'التبديل إلى العربية',
    menu: 'Menu',
    close: 'Close',
    more: 'Learn more',
    prev: 'Previous',
    next: 'Next',
    sample: 'Sample content',
    sampleNote: 'Sample content for the template. It is hidden on the live site until real, approved content replaces it.',
    footer: {
      tagline: 'We build intelligence that works.',
      explore: 'Explore',
      services: 'Services',
      contact: 'Contact',
      motionOn: 'Motion: on',
      motionOff: 'Motion: off',
      motionLabel: 'Turn background motion on or off',
      rights: 'All rights reserved.',
      credits: 'Jupiter and Saturn images: NASA/JPL.',
    },
    waDefault: 'Hello NAWA, I would like to start a project.',
  },
  ar: {
    siteTitle: 'نوى · وكالة ذكاء اصطناعي في بغداد',
    siteDescription: 'نوى تبني وكلاء ذكاء اصطناعي وأتمتة ومواقع وأنظمة ERP ومنتجات SaaS وهويات للشركات في العراق والشرق الأوسط.',
    skip: 'انتقل إلى المحتوى',
    nav: { services: 'الخدمات', work: 'الأعمال', process: 'طريقة العمل', about: 'من نحن', contact: 'تواصل' },
    cta: 'ابدأ مشروعك',
    whatsapp: 'واتساب',
    langSwitch: 'English',
    langSwitchLabel: 'Switch to English',
    menu: 'القائمة',
    close: 'إغلاق',
    more: 'اعرف أكثر',
    prev: 'السابق',
    next: 'التالي',
    sample: 'محتوى تجريبي',
    sampleNote: 'محتوى تجريبي لملء القالب. لا يظهر في الموقع الحي إلى أن يُستبدل بمحتوى حقيقي ومعتمد.',
    footer: {
      tagline: 'نبني ذكاء يشتغل.',
      explore: 'تصفّح',
      services: 'الخدمات',
      contact: 'تواصل',
      motionOn: 'الحركة: مفعّلة',
      motionOff: 'الحركة: متوقفة',
      motionLabel: 'تشغيل أو إيقاف حركة الخلفية',
      rights: 'جميع الحقوق محفوظة.',
      credits: 'صور المشتري وزحل: NASA/JPL.',
    },
    waDefault: 'مرحباً نوى، أريد أن أبدأ مشروعاً.',
  },
} as const;

/** يحوّل *كلمة* داخل عنوان إلى <em> (العبارة الذهبية الوحيدة في العنوان) */
export function gold(text: string): string {
  return text.replace(/\*(.+?)\*/g, '<em>$1</em>');
}
/** نفس النص بدون علامات النجمة (للعناوين في <title> و aria-label) */
export function plain(text: string): string {
  return text.replace(/\*/g, '');
}
