/**
 * دوال مساعدة للغة والروابط والعناوين.
 * النصوص نفسها في الفرع الفعّال: src/data/divisions/<division>/ (انظر src/data/division.ts).
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

// نصوص الواجهة تأتي من الفرع الفعّال (src/data/division.ts)
export { ui } from '../data/division';


/** يحوّل *كلمة* داخل عنوان إلى <em> (العبارة الذهبية الوحيدة في العنوان) */
export function gold(text: string): string {
  return text.replace(/\*(.+?)\*/g, '<em>$1</em>');
}
/** نفس النص بدون علامات النجمة (للعناوين في <title> و aria-label) */
export function plain(text: string): string {
  return text.replace(/\*/g, '');
}
