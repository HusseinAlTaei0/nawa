# موقع NAWA (نوى)

موقع وكالة NAWA للذكاء الاصطناعي. مبني بـ **Astro** (صفحات HTML ثابتة) باللغتين الإنجليزية `/en/` والعربية `/ar/`، ويُنشر على **Netlify**.

## التشغيل

```bash
npm install
```

```bash
npm run dev
```

يفتح الموقع على `http://localhost:4321/en/`. في وضع التطوير يظهر المحتوى التجريبي (المعلّم بشارة "Sample content").

```bash
npm run build
```

يبني الموقع النهائي في مجلد `dist/` (بدون المحتوى التجريبي).

## أين أعدّل ماذا

| ماذا تريد أن تغيّر | الملف |
|---|---|
| رقم واتساب، البريد، العنوان، ساعات العمل، وعد زمن الرد | `src/config/site.ts` |
| نصوص القائمة والأزرار والفوتر | `src/i18n/ui.ts` |
| نصوص الخدمات الست (اللغتان جنباً إلى جنب) | `src/data/services.ts` |
| نصوص الرئيسية، طريقة العمل، من نحن، التواصل، الأعمال | `src/data/pages.ts` |
| دراسات الحالة (ملف Markdown لكل دراسة ولكل لغة) | `src/content/work/en/` و `src/content/work/ar/` |
| الألوان والخطوط وأشكال المكوّنات | `src/styles/global.css` |
| صور الكواكب | `src/assets/planets/` |

## المحتوى التجريبي

الأرقام، دراسة الحالة النموذجية، مدد المراحل، وأعضاء الفريق كلها **تجريبية**. تظهر فقط في `npm run dev` وفي معاينات Netlify، ولا تظهر في الموقع الحي حتى لا ننشر أرقاماً غير حقيقية.

- لنشر دراسة حالة حقيقية: عدّل ملفها واجعل `draft: false`.
- الأرقام في الصفحة الرئيسية: `home.*.proof` في `src/data/pages.ts`، وتتحكم بظهورها `src/lib/drafts.ts`.

## الحركة والتأثيرات (`src/scripts/`)

| الملف | ماذا يفعل |
|---|---|
| `sky.ts` | سحابة النجوم الذهبية خلف كل الصفحات. السرعة في `BASE_SPEED` |
| `heroplanet.ts` | كوكب الواجهة المصنوع من نجوم، وتطاير النجوم عند اقتراب المؤشر (`REPEL_FORCE`, `SPRING`, `DAMPING`) |
| `rail.ts` | كروت الخدمات المتحركة في الرئيسية |
| `orbit.ts` | المدار السداسي في صفحة الخدمات |
| `globe.ts` | الكرة الأرضية (بغداد والمدن) |
| `form.ts` | نموذج التواصل ولحظة "الإطلاق" بعد الإرسال |
| `site.ts` | شاشة البداية، القائمة، كسوف تبديل اللغة، مؤشر القمر، زر إيقاف الحركة |

كل الحركة تتوقف تلقائياً إذا كان الزائر مفعّلاً "تقليل الحركة" في جهازه، أو ضغط زر الحركة في الفوتر.

## الفحص

```bash
npm run check
```

```bash
PUBLIC_SHOW_DRAFTS=true npm run build && npx astro preview --port 4321
```

ثم في نافذة ثانية:

```bash
npm run qa
```

يفحص كل الصفحات باللغتين على الديسكتوب والموبايل ويحفظ لقطات في `qa/`. يحتاج Playwright مثبتاً على الجهاز.

### اختبار "اكتشف ليش تخسر زبائنك"

```bash
npm test
```

اختبارات المحرك (الأرقام، الهوية، التقييم) والـ Netlify Function (الحفظ، التنبيهات، الحماية) بدون شبكة.

```bash
node --experimental-strip-types scripts/launch-e2e.mjs
```

مع `astro preview` شغّال: يمر على المسار كاملاً في متصفح حقيقي (التحمية، 9 أسئلة، النتيجة، البوابة، التقرير) بالإنجليزي على الديسكتوب وبالعربي على الموبايل.

## اختبار "اكتشف ليش تخسر زبائنك" (`/launch`)

كل أزرار الدعوة في الموقع تؤدي لصفحة `/[lang]/launch/`: تحمية 6 ثواني اختيارية، ثم 9 أسئلة تبني كوكب الزائر، ثم نتيجة جزئية مجانية، ثم تقرير كامل مقابل رقم الواتساب.

| الجزء | المكان |
|---|---|
| الأرقام والهوية وتقييم الـ lead (منطق فقط) | `src/scripts/launch/engine.ts` |
| النصوص باللغتين (الأسئلة، النتائج، الخطوات) | `src/data/launch.ts` |
| الافتراضات لكل نشاط (قيمة الزبون ونسبة التحويل) ⚠️ PLACEHOLDER | `PRESETS` في `engine.ts` |
| الواجهة، التحمية، الكوكب، بطاقة المشاركة | `src/scripts/launch/` + `src/components/LaunchTest.astro` |
| الخادم (حفظ + تنبيهات) | `netlify/functions/launch.mts` |
| قاعدة البيانات | `supabase/migrations/20261119000000_launch_test.sql` |

### التفعيل (مرة واحدة)

1. **Supabase** (مطبّق على مشروع NAWA الحالي `rrrszzriwtodxmatnets` بجانب جداول الـ CRM، بجداول منفصلة تبدأ بـ `launch_`): لأي مشروع جديد طبّق ملف الـ migration (SQL Editor أو `supabase db push`). يُنشئ الجداول بـ RLS مقفل، ولوحات القراءة `v_launch_funnel` و `v_launch_leads` و `v_launch_answers`.
2. **Telegram**: أنشئ بوت عبر @BotFather وخذ التوكن، أرسل له أي رسالة، ثم خذ `chat.id` من `https://api.telegram.org/bot<TOKEN>/getUpdates`.
3. **Resend**: أنشئ مفتاح API. للإرسال من `@nawa-iq.com` وثّق الدومين في Resend، وإلا يُرسل من `onboarding@resend.dev` (لبريدك فقط).
4. **Netlify → Site configuration → Environment variables** (Functions scope):

| المتغير | القيمة |
|---|---|
| `SUPABASE_URL` | `https://<project>.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | مفتاح السيرفر من Supabase → Project Settings → API Keys: الجديد `sb_secret_…` أو القديم `service_role` (سري: لا يوضع في الكود أبداً) |
| `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` | من الخطوة 2 (معرّف مجموعة يبدأ بـ `-100`) |
| `TELEGRAM_FALLBACK_CHAT_ID` | اختياري: حساب شخصي يستلم التنبيه إذا فشل الإرسال للمجموعة |
| `RESEND_API_KEY` / `LEAD_EMAIL_TO` | من الخطوة 3، وأكثر من بريد بفاصلة |
| `LEAD_EMAIL_FROM` | اختياري، مثل `NAWA Leads <leads@nawa-iq.com>` |
| `LAUNCH_SALT` | أي نص عشوائي طويل (لتشفير عناوين IP) |

أي متغير ناقص لا يكسر شيئاً: الـ Function تكمل وتكتب تحذيراً في السجل. إذا فشلت قاعدة البيانات يصل الـ lead كاملاً في التنبيهات.

### القراءة اليومية

- كل lead جديد يصل على Telegram خلال ثوانٍ مع تقييم A/B/C وزر "Reply on WhatsApp". الهدف: الرد خلال 5 دقائق.
- `v_launch_leads` في Supabase = قائمة المبيعات. غيّر `status` في `launch_leads` (new → contacted → qualified → proposal → won/lost) وأضف `notes`.
- `v_launch_funnel` = أين يتوقف الناس، ونتيجة اختبار العنوان (a = "اكتشف ليش تخسر زبائنك"، b = "كم زبون ضاع منك هالأسبوع؟"). احكم بعد ~300 زائر بدأ الاختبار لكل نسخة.
- `v_launch_answers` = توزيع الأجوبة (للتسويق وأبحاث السوق).
- الاحتفاظ: شغّل `select public.launch_purge();` شهرياً (يحذف بيانات التواصل بعد 12 شهراً كما في صفحة الخصوصية).

## ملفات أخرى

- `docs/research/`: تقارير البحث الثلاثة والقرارات المتفق عليها.
- `docs/design-context.md`: ملخص الهوية والقواعد الذي تقرؤه وكلاء التصميم في `.claude/agents/`.
- `docs/prototypes/`: صفحة النماذج الأولية التي اختيرت منها الواجهة.
- `scripts/make-brand-assets.mjs`: يولّد الأيقونات وصور معاينة الروابط من الشعار.
