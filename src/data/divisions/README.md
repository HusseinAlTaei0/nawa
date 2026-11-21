# فروع نوى (Divisions)

الموقع قالب واحد، والنصوص لكل فرع في مجلد مستقل. الفرع الفعّال اليوم: **legal** (NAWA Legal Tech).

| الفرع | المجلد | التشخيص (/launch) | الحالة |
|---|---|---|---|
| `legal`: NAWA Legal Tech | `src/data/divisions/legal/` | `engines/legal.ts`: "اكتشف وين يضيع شغلك القانوني" | **مفعّل** |
| `agency`: NAWA Agency (وكالة الذكاء الاصطناعي) | `src/data/divisions/agency/` | `engines/agency.ts`: "اكتشف ليش تخسر زبائنك" | محفوظ كما كان حتى 21 نوفمبر 2026 |

النسخة الكاملة من الموقع قبل التحول محفوظة أيضاً في git: الوسم `nawa-agency-v1` (commit `620dd01`).

## ماذا يحتوي كل فرع
- `ui.ts`: القائمة والأزرار والفوتر والدعوة الرئيسية (CTA) ورسالة واتساب الافتراضية
- `pages.ts`: الرئيسية، طريقة العمل، الخدمات، الأعمال، من نحن، التواصل، الخصوصية
- `services.ts`: الخدمات الست (كوكب لكل خدمة، زاوية من سداسي الشعار)
- `launch.ts`: كل نصوص التشخيص (التحمية، الأسئلة، النتيجة، التقرير)
- `index.ts`: يصدّر كل ما سبق + `DIVISION_ID`
- خارج المجلد: محرك التشخيص `src/scripts/launch/engines/<id>.ts`، ودراسات الحالة `src/content/work/<id>/`، وصور المعاينة (`scripts/make-brand-assets.mjs`، صور الوكالة القديمة في `docs/divisions/agency/`)

## تبديل الفرع (3 أسطر)
1. `src/data/division.ts` → `export * from './divisions/<id>';`
2. `src/scripts/launch/engine.ts` → `export * from './engines/<id>.ts';`
3. `src/config/site.ts` → `division: '<id>'`

إذا اختلفت الأسطر الثلاثة يتوقف `npm run build` برسالة `[division]` واضحة (الحارس في `src/layouts/Base.astro`).
بعد التبديل: أعد توليد صور المعاينة (`node scripts/make-brand-assets.mjs`) بنص الفرع.

## إضافة فرع جديد (مثل NAWA Branding أو NAWA Scaling)
1. انسخ `src/data/divisions/legal/` إلى `src/data/divisions/<id>/` وغيّر `DIVISION_ID` والنصوص.
2. انسخ `src/scripts/launch/engines/legal.ts` إلى `engines/<id>.ts`: غيّر `DIVISION` والأسئلة والحساب، **مع الإبقاء على نفس الصادرات** (`Result`، `planetShape`، `alertLines`...)؛ الواجهة والسيرفر مشتركان ويعتمدان عليها.
3. أضف `<id>` إلى نوع `Division` في `src/config/site.ts` وإلى قيد `division` في Supabase (migration جديدة).
4. أضف اختبار `tests/launch-engine-<id>.test.ts`.
5. الأقرب للمستقبل: كل فرع على نطاق فرعي (مثلاً `legal.nawa-iq.com`) بنفس الكود ومتغير بيئة يختار الفرع. الهيكل الحالي جاهز لذلك.

## قاعدة الصوت (لكل الفروع)
هادئ، واثق، أرقام قبل الصفات، حدود صريحة، جمل قصيرة، بلا مبالغة ولا علامات تعجب ولا إيموجي. عبارة ذهبية واحدة `*…*` في كل عنوان. الفرع يغيّر المجال، لا النبرة.
