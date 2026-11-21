/**
 * الفرع الفعّال من نوى. كل الصفحات تقرأ نصوصها من هنا.
 *
 * ⚠️ للتبديل بين الفروع غيّر 3 أسطر معاً (والبناء يتوقف بخطأ واضح إذا اختلفت):
 *   1) هذا الملف:                      './divisions/<id>'
 *   2) src/scripts/launch/engine.ts:    './engines/<id>.ts'
 *   3) src/config/site.ts:              division: '<id>'
 * التفاصيل في src/data/divisions/README.md
 */
export * from './divisions/legal';
