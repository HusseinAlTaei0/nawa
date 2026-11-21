/**
 * محرك "اكتشف وين يضيع شغلك القانوني" (فرع NAWA Legal Tech): منطق صافٍ بدون DOM وبدون نصوص.
 *
 * نفس الملف يُستخدم في 3 أماكن (عبر src/scripts/launch/engine.ts):
 *  1) المتصفح: يحسب النتيجة فوراً من أجوبة الزائر
 *  2) Netlify Function: يعيد الحساب في السيرفر (لا نثق بأرقام قادمة من المتصفح) ويقيّم الـ lead
 *  3) لاحقاً طبقة Claude: تأخذ الناتج المنظّم وتكتب تحليلاً، ولا تخترع أرقاماً
 *
 * الواجهة (Result, Assumptions, planetShape...) مطابقة لمحرك الوكالة (./agency.ts) حرفياً في الأسماء،
 * حتى تبقى الواجهة والسيرفر وقاعدة البيانات مشتركة بين الفروع. معنى كل حقل هنا مكتوب بجانبه.
 *
 * قواعد صارمة:
 *  - كل رقم يظهر للزائر نطاق (من–إلى) محافظ، والافتراضات مكشوفة وقابلة للتعديل
 *  - كل جملة في النتيجة مشروطة بأجوبة الزائر (لا نص عام "يشبه" الشخصي)
 *  - لا نقدّر "قيمة قضية خاسرة" ولا نخوّف بمبالغ: نعدّ المواعيد المعرّضة للخطر والساعات فقط
 *  - بدون enum وبدون namespaces حتى يعمل الملف مع Node --experimental-strip-types في الاختبارات
 */

export const DIVISION = 'legal' as const;

/* ---------------------------------------------------------------------------
 * 1) الأسئلة والخيارات (مفاتيح فقط؛ النصوص في src/data/divisions/legal/launch.ts)
 * ------------------------------------------------------------------------- */
export const OPTIONS = {
  // الأسئلة الأساسية التسعة (تبني الكوكب وتُحسب منها النتيجة)
  practice: ['litigation', 'corporate', 'general', 'inhouse', 'other'],
  team: ['solo', 'small', 'mid', 'large'],
  volume: ['m1', 'm2', 'm3', 'm4'],
  channels: ['whatsapp', 'phone', 'email', 'walkin', 'paper', 'telegram', 'portal'],
  deadlines: ['system', 'calendar', 'notebook', 'memory'],
  misses: ['none', 'once', 'few', 'often'],
  hours: ['h1', 'h2', 'h3', 'h4'],
  storage: ['paper', 'whatsapp', 'folders', 'excel', 'software'],
  bottleneck: ['research', 'drafting', 'deadlines', 'documents', 'intake', 'reporting'],
  // أسئلة "حدّد خطتك" الاختيارية بعد كشف النتيجة (تقييم الـ lead + الاعتراض الأساسي)
  timeline: ['now', 'quarter', 'later', 'curious'],
  decider: ['me', 'partners', 'manager', 'committee'],
  band: ['b1', 'b2', 'b3', 'b4'],
  worry: ['confidentiality', 'accuracy', 'price', 'staff', 'arabic'],
} as const;

export type Key = keyof typeof OPTIONS;
export type Opt<K extends Key> = (typeof OPTIONS)[K][number];
export const CORE = ['practice', 'team', 'volume', 'channels', 'deadlines', 'misses', 'hours', 'storage', 'bottleneck'] as const;
export const SHARPEN = ['timeline', 'decider', 'band', 'worry'] as const;
export type CoreKey = (typeof CORE)[number];
export type SharpenKey = (typeof SHARPEN)[number];
/** السؤال الوحيد متعدد الاختيار */
export const MULTI = 'channels' as const;
/** سؤال "شنو تريد تصلح أولاً": يُحدَّد مسبقاً إذا جاء الزائر من صفحة خدمة */
export const FOCUS = 'bottleneck' as const;
/** السؤال الذي يصف نوع الزائر (يُذكر في رسالة الواتساب) */
export const LEAD_KEY = 'practice' as const;
/** المفاتيح التي لها صيغة قصيرة داخل الجمل ({practice} {volume} ...) */
export const SHORT_KEYS = ['practice', 'team', 'volume', 'deadlines', 'misses', 'hours', 'storage', 'bottleneck'] as const;
/** الأجوبة التي لها عمود مستقل في launch_sessions (الباقي في answers jsonb فقط، مع division = 'legal') */
export const DB_COLUMNS = ['team', 'volume', 'channels', 'hours', 'bottleneck', 'timeline', 'decider', 'band', 'worry'] as const;

export type Answers = { [K in Exclude<Key, 'channels'>]?: Opt<K> } & { channels?: Opt<'channels'>[] };

/** تنظيف أجوبة قادمة من مصدر غير موثوق (المتصفح أو رابط مشاركة): أي قيمة خارج القائمة تُحذف */
export function sanitize(raw: unknown): Answers {
  const out: Record<string, unknown> = {};
  if (!raw || typeof raw !== 'object') return out as Answers;
  const src = raw as Record<string, unknown>;
  for (const key of Object.keys(OPTIONS) as Key[]) {
    const allowed = OPTIONS[key] as readonly string[];
    const v = src[key];
    if (key === MULTI) {
      if (Array.isArray(v)) {
        const list = [...new Set(v.filter((x): x is string => typeof x === 'string' && allowed.includes(x)))];
        if (list.length) out[key] = list;
      }
    } else if (typeof v === 'string' && allowed.includes(v)) out[key] = v;
  }
  return out as Answers;
}

export const isComplete = (a: Answers): boolean =>
  CORE.every((k) => (k === MULTI ? !!a.channels?.length : a[k] !== undefined));

/* ---------------------------------------------------------------------------
 * 2) الافتراضات (قابلة للتعديل من الزائر في التقرير الكامل)
 * ------------------------------------------------------------------------- */
/**
 * لكل نوع ممارسة:
 *  value = قيمة ساعة واحدة من وقت المحامي (دينار عراقي)
 *  conv  = نسبة الساعات المتحررة التي تتحول فعلاً إلى عمل قانوني مفيد أو مدفوع (الباقي يضيع بطبيعة اليوم)
 * (الاسمان value و conv مشتركان مع محرك الوكالة حتى تبقى الواجهة وقاعدة البيانات واحدة)
 *
 * ⚠️ PLACEHOLDER: أرقام تقديرية أولية ومحافظة. يجب أن يؤكدها صاحب نوى من مكاتب حقيقية قبل الإطلاق.
 * تظهر للزائر بوضوح كـ "افتراض" ويستطيع تعديلها.
 */
export const PRESETS: Record<Opt<'practice'>, { value: number; conv: number }> = {
  litigation: { value: 40_000, conv: 0.5 },
  corporate: { value: 60_000, conv: 0.6 },
  general: { value: 35_000, conv: 0.5 },
  inhouse: { value: 25_000, conv: 0.7 }, // كلفة الساعة على الشركة، والوقت المتحرر يعود للعمل مباشرة
  other: { value: 30_000, conv: 0.5 },
};

/** ملفات مفتوحة (قضايا + عقود + معاملات) في الوقت نفسه: منتصف كل فئة */
const VOLUME_MID: Record<Opt<'volume'>, number> = { m1: 12, m2: 40, m3: 100, m4: 220 };
/** مواعيد لكل ملف مفتوح شهرياً: جلسة، مهلة طعن أو تبليغ، تجديد عقد أو وكالة. تقدير محافظ */
const DEADLINES_PER_MATTER = 1.5;
/** مواعيد "كادت تفوت" خلال 3 أشهر حسب كلام الزائر نفسه: منتصف كل فئة */
const MISS_MID: Record<Opt<'misses'>, number> = { none: 0, once: 1, few: 3, often: 6 };
/** نسبة المواعيد المعرّضة للانزلاق حسب طريقة المتابعة (تقدير داخلي محافظ، يُعرض كنطاق) */
const SLIP: Record<Opt<'deadlines'>, number> = { system: 0.003, calendar: 0.01, notebook: 0.02, memory: 0.04 };
/** من المواعيد المعرّضة: كم نسبة يلتقطها تنبيه تلقائي مبكر؟ أقل إذا كان عندك نظام تنبيه أصلاً */
const CAUGHT: Record<Opt<'deadlines'>, number> = { system: 0.3, calendar: 0.6, notebook: 0.8, memory: 0.9 };
/** ساعات أسبوعية على الشغل المتكرر: منتصف كل فئة */
const HOURS_MID: Record<Opt<'hours'>, number> = { h1: 2, h2: 5.5, h3: 11.5, h4: 20 };
/**
 * حصة الساعات المتكررة القابلة للتحرير. أقل من فرع الوكالة عمداً: كل مخرَج يراجعه محامٍ.
 * للمقارنة: McKinsey (2017) قدّرت أن نحو 23% من مجمل عمل المحامي قابل للأتمتة، و Remus & Levy (2016) نحو 13%.
 * نحن نطبّق النسبة على الساعات المتكررة التي ذكرها الزائر فقط، لا على كل عمله.
 */
const AUTOMATABLE: [number, number] = [0.3, 0.5];
/** هامش النطاق حول التقدير المركزي */
const SPREAD: [number, number] = [0.7, 1.15];
/** شهر البناء: المسار الآلي يبدأ من الشهر الثاني (صراحة: النظام لا يُبنى في يوم) */
const SETUP_MONTHS = 1;

/* ---------------------------------------------------------------------------
 * 3) درجة المدار /100: "قد إيش مكتبك ماسك ملفاته ومواعيده"
 * ------------------------------------------------------------------------- */
const SCORE = {
  deadlines: { system: 24, calendar: 16, notebook: 7, memory: 0 },
  misses: { none: 22, once: 15, few: 7, often: 0 },
  storage: { paper: 2, whatsapp: 4, folders: 14, excel: 11, software: 22 },
  hours: { h1: 18, h2: 12, h3: 6, h4: 2 },
} as const;
/** قنوات قليلة = وصول محدود، وقنوات كثيرة بلا نظام = طلبات مبعثرة. الأفضل بين الاثنين */
const channelScore = (n: number) => (n === 0 ? 0 : n === 1 ? 9 : n <= 3 ? 12 : 6);

export function orbitScore(a: Answers): number {
  let s = 0;
  if (a.deadlines) s += SCORE.deadlines[a.deadlines];
  if (a.misses) s += SCORE.misses[a.misses];
  if (a.storage) s += SCORE.storage[a.storage];
  if (a.hours) s += SCORE.hours[a.hours];
  s += channelScore(a.channels?.length ?? 0);
  return Math.max(0, Math.min(100, s));
}

/* ---------------------------------------------------------------------------
 * 4) هوية المدار (قواعد مرتّبة؛ أول قاعدة تنطبق تفوز)
 * ------------------------------------------------------------------------- */
export type Archetype = 'lone' | 'crowded' | 'drifting' | 'closepass' | 'ready' | 'steady';
const rank = <K extends Key>(k: K, v: Opt<K> | undefined) => (v === undefined ? -1 : (OPTIONS[k] as readonly string[]).indexOf(v));

export function archetype(a: Answers): Archetype {
  if (a.team === 'solo' && (rank('volume', a.volume) >= 1 || rank('hours', a.hours) >= 1)) return 'lone';
  if (rank('volume', a.volume) >= 2 && (a.deadlines === 'notebook' || a.deadlines === 'memory')) return 'crowded';
  if (a.storage === 'paper' || a.storage === 'whatsapp') return 'drifting';
  if (a.misses === 'few' || a.misses === 'often') return 'closepass';
  return orbitScore(a) >= 75 ? 'ready' : 'steady';
}

/* ---------------------------------------------------------------------------
 * 5) الخطة: 3 خطوات مربوطة بخدمات NAWA Legal Tech (slugs في src/data/divisions/legal/services.ts)
 * ------------------------------------------------------------------------- */
export type StepKey =
  | 'assistant' | 'drafting' | 'alerts' | 'archive' | 'intake' | 'dashboard' // الخطوة 1: حسب ما يريد إصلاحه
  | 'digitize' | 'gather' | 'structure' | 'matters' | 'connect'             // الخطوة 2: حسب مكان الملفات
  | 'report';                                                              // الخطوة 3: القياس
export interface Step { key: StepKey; service: string }

const STEP1: Record<Opt<'bottleneck'>, Step> = {
  research: { key: 'assistant', service: 'legal-assistant' },
  drafting: { key: 'drafting', service: 'contracts' },
  deadlines: { key: 'alerts', service: 'case-management' },
  documents: { key: 'archive', service: 'documents' },
  intake: { key: 'intake', service: 'client-intake' },
  reporting: { key: 'dashboard', service: 'compliance' },
};
const STEP2: Record<Opt<'storage'>, Step> = {
  paper: { key: 'digitize', service: 'documents' },
  whatsapp: { key: 'gather', service: 'documents' },
  folders: { key: 'structure', service: 'case-management' },
  excel: { key: 'matters', service: 'case-management' },
  software: { key: 'connect', service: 'case-management' },
};

export function plan(a: Answers): Step[] {
  const s1 = STEP1[a.bottleneck ?? 'deadlines'];
  let s2 = STEP2[a.storage ?? 'folders'];
  // لا نكرر الخدمة نفسها في خطوتين متتاليتين: ننتقل للخدمة المكمّلة
  if (s2.service === s1.service) s2 = s1.service === 'documents' ? { key: 'matters', service: 'case-management' } : { key: 'gather', service: 'documents' };
  const s3: Step = a.bottleneck === 'reporting' ? { key: 'assistant', service: 'legal-assistant' } : { key: 'report', service: 'compliance' };
  return [s1, s2, s3];
}

/* ---------------------------------------------------------------------------
 * 6) الحساب الكامل
 * ------------------------------------------------------------------------- */
export type Range = [number, number];
export interface Assumptions { value: number; conv: number }
export interface Result {
  score: number;
  archetype: Archetype;
  /** ملفات مفتوحة في الوقت نفسه (تقدير مركزي) */
  inquiries: number;
  /** مواعيد معرّضة للانزلاق سنوياً (جلسات، مهل، تجديدات): "كادت تفوت"، لا خسائر مؤكدة */
  lost: Range;
  /** منها: كم يلتقطه تنبيه تلقائي مبكر */
  recoverable: Range;
  /** ساعات شهرية على الشغل المتكرر */
  hours: number;
  /** منها: الساعات القابلة للتحرير */
  hoursFree: Range;
  /** ساعات شهرية تعود لعمل قانوني مفيد (المتحرر × conv) */
  customers: Range;
  /** قيمة تلك الساعات شهرياً (دينار) */
  money: Range;
  /** توقع 12 شهر: ساعات تراكمية ترجع للعمل القانوني. اليوم صفر، ومع النظام تبدأ بعد شهر البناء */
  forecast: { current: number[]; automated: number[] };
  plan: Step[];
  assumptions: Assumptions;
}

/** تقريب "إنساني": رقمان معنويان (1234 => 1200، 87 => 87، 0.4 => 0) */
export function nice(n: number): number {
  if (!isFinite(n) || n <= 0) return 0;
  if (n < 10) return Math.round(n);
  const p = Math.pow(10, Math.floor(Math.log10(n)) - 1);
  return Math.round(n / p) * p;
}
const range = (center: number): Range => {
  const lo = nice(center * SPREAD[0]), hi = nice(center * SPREAD[1]);
  return [Math.min(lo, hi), Math.max(lo, hi)];
};

export function defaultAssumptions(a: Answers): Assumptions {
  return { ...PRESETS[a.practice ?? 'other'] };
}

export function compute(a: Answers, override?: Partial<Assumptions>): Result {
  const as: Assumptions = { ...defaultAssumptions(a), ...cleanOverride(override) };
  const matters = VOLUME_MID[a.volume ?? 'm1'];
  const method = a.deadlines ?? 'calendar';
  const deadlinesYear = matters * DEADLINES_PER_MATTER * 12;
  // المعرّض للخطر: متوسط ما قاله الزائر عن نفسه (×4 للسنة) وما يتوقعه النموذج من طريقة المتابعة
  const selfYear = MISS_MID[a.misses ?? 'none'] * 4;
  const modelYear = deadlinesYear * SLIP[method];
  const atRisk = (selfYear + modelYear) / 2;
  const caught = atRisk * CAUGHT[method];
  const hours = Math.round(HOURS_MID[a.hours ?? 'h1'] * 4.3);
  const freeC = hours * ((AUTOMATABLE[0] + AUTOMATABLE[1]) / 2);
  const usefulC = freeC * as.conv;

  // التوقع: ساعات تراكمية ترجع للعمل القانوني. المسار الحالي صفر بصراحة (لا شيء يتغير بدون نظام)،
  // والآلي يضيف الساعات المفيدة كل شهر بعد شهر البناء. (المواعيد تُعرض كأرقام سنوية، لا كخط: الفرق فيها صغير نسبةً لمجموعها)
  const current: number[] = [], automated: number[] = [];
  let au = 0;
  for (let m = 1; m <= 12; m++) {
    au += m > SETUP_MONTHS ? usefulC : 0;
    current.push(0); automated.push(Math.round(au));
  }

  return {
    score: orbitScore(a),
    archetype: archetype(a),
    inquiries: nice(matters),
    lost: range(atRisk),
    recoverable: range(caught),
    hours,
    hoursFree: [nice(hours * AUTOMATABLE[0]), nice(hours * AUTOMATABLE[1])],
    customers: range(usefulC),
    money: range(usefulC * as.value),
    forecast: { current, automated },
    plan: plan(a),
    assumptions: as,
  };
}

function cleanOverride(o?: Partial<Assumptions>): Partial<Assumptions> {
  const out: Partial<Assumptions> = {};
  if (o?.value !== undefined && isFinite(o.value) && o.value > 0 && o.value < 1e10) out.value = Math.round(o.value);
  if (o?.conv !== undefined && isFinite(o.conv) && o.conv > 0 && o.conv <= 1) out.conv = o.conv;
  return out;
}

/* ---------------------------------------------------------------------------
 * 7) الكوكب: كل جواب يغيّر شيئاً واحداً في الكوكب الذي يُبنى أمام الزائر (planet.ts)
 * ------------------------------------------------------------------------- */
export interface PlanetShape { form: number; density: number; moons: number; ring: number; glow: number; leak: number; order: number }

export function planetShape(a: Answers): PlanetShape {
  const answered = CORE.filter((k) => (k === MULTI ? a.channels?.length : a[k])).length;
  return {
    form: Math.max(0.04, answered / CORE.length),
    density: a.volume ? { m1: 0.35, m2: 0.55, m3: 0.8, m4: 1 }[a.volume] : 0.45,
    moons: a.channels?.length ?? 0,
    ring: a.team ? { solo: 0, small: 0.4, mid: 0.7, large: 1 }[a.team] : 0,
    glow: a.deadlines ? { system: 1, calendar: 0.7, notebook: 0.35, memory: 0.12 }[a.deadlines] : 0.4,
    leak: a.misses ? { none: 0.05, once: 0.3, few: 0.65, often: 1 }[a.misses] : 0,
    order: a.storage ? { paper: 0.1, whatsapp: 0.05, folders: 0.55, excel: 0.5, software: 1 }[a.storage] : 0.6,
  };
}

/** قادم من صفحة خدمة (?service=slug): نحدد مسبقاً جواب "شنو تريد تصلح" (الزائر يؤكده بنفسه) */
export const SERVICE_TO_FOCUS: Record<string, Opt<'bottleneck'>> = {
  'legal-assistant': 'research', contracts: 'drafting', 'case-management': 'deadlines',
  documents: 'documents', 'client-intake': 'intake', compliance: 'reporting',
};

/* ---------------------------------------------------------------------------
 * 8) تقييم الـ lead (للمبيعات فقط، لا يظهر للزائر): ملاءمة 0–50 + نية 0–50
 * ------------------------------------------------------------------------- */
export type Grade = 'A' | 'B' | 'C';
export interface LeadScore { fit: number; intent: number; total: number; grade: Grade }

const FIT = {
  volume: { m1: 3, m2: 8, m3: 13, m4: 15 },
  team: { solo: 5, small: 10, mid: 12, large: 12 },
  hours: { h1: 2, h2: 6, h3: 10, h4: 13 },
} as const;
const INTENT = {
  timeline: { now: 20, quarter: 14, later: 7, curious: 2 },
  decider: { me: 15, partners: 11, manager: 7, committee: 5 },
  band: { b1: 3, b2: 8, b3: 12, b4: 15 },
} as const;
/** إجابة متروكة في الأسئلة الاختيارية = قيمة وسطى منخفضة (لا نعاقب من تخطاها بشدة) */
const SKIPPED = 5;

export function leadScore(a: Answers): LeadScore {
  const fit =
    (a.practice && a.practice !== 'other' ? 10 : 5) +
    (a.volume ? FIT.volume[a.volume] : 0) +
    (a.team ? FIT.team[a.team] : 0) +
    (a.hours ? FIT.hours[a.hours] : 0);
  const intent =
    (a.timeline ? INTENT.timeline[a.timeline] : SKIPPED) +
    (a.decider ? INTENT.decider[a.decider] : SKIPPED) +
    (a.band ? INTENT.band[a.band] : SKIPPED);
  const total = fit + intent;
  return { fit, intent, total, grade: total >= 70 ? 'A' : total >= 45 ? 'B' : 'C' };
}

/* ---------------------------------------------------------------------------
 * 9) تنبيه الفريق (Telegram والبريد): أسطر نصية خام، والسيرفر يهرّبها قبل الإرسال
 * ------------------------------------------------------------------------- */
const LABEL: Record<string, string> = {
  litigation: 'Litigation firm', corporate: 'Corporate/contracts firm', general: 'General practice', inhouse: 'In-house legal team', other: 'Other',
  solo: '1 lawyer', small: '2-5', mid: '6-15', large: '15+',
  m1: '<20 open matters', m2: '20-60 matters', m3: '60-150 matters', m4: '150+ matters',
  system: 'system alerts', calendar: 'shared calendar', notebook: 'diary/notebook', memory: 'memory',
  none: 'no near-misses', once: '1 near-miss/qtr', few: '2-4/qtr', often: '5+/qtr',
  h1: '<3h/wk', h2: '3-8h/wk', h3: '8-15h/wk', h4: '15h+/wk',
  paper: 'paper files', whatsapp: 'WhatsApp chats', folders: 'shared folders', excel: 'Excel', software: 'own software',
  research: 'legal research', drafting: 'drafting/review', deadlines: 'deadlines', documents: 'documents', intake: 'client intake', reporting: 'reporting/compliance',
  now: 'this month', quarter: '≤3 months', later: 'later this year', curious: 'just exploring',
  me: 'decides alone', partners: 'with partners', manager: 'needs manager', committee: 'board/committee',
  b1: '<150k IQD/mo', b2: '150-450k', b3: '450k-1.2M', b4: '1.2M+',
  confidentiality: 'confidentiality', accuracy: 'accuracy', price: 'cost', staff: 'team adoption', arabic: 'legal Arabic',
};
const L = (v?: string | null) => (v ? LABEL[v] ?? v : '—');
const iqd = (n: number) => (n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${Math.round(n / 1e3)}k` : String(n));

export function sharpenLine(a: Answers): string {
  return a.timeline || a.decider || a.band ? `Timing: ${L(a.timeline)} · ${L(a.decider)} · value: ${L(a.band)} · worry: ${L(a.worry)}` : 'Sharpen answers: not yet';
}

export function alertLines(a: Answers, r: Result): string[] {
  return [
    `${L(a.practice)} · team ${L(a.team)} · ${L(a.volume)} · channels: ${(a.channels ?? []).join(', ') || '—'}`,
    `Deadlines: ${L(a.deadlines)} · ${L(a.misses)} · repetitive: ${L(a.hours)} · files: ${L(a.storage)}`,
    `Wants to fix: ${L(a.bottleneck)}`,
    `Deadlines at risk ${r.lost[0]}–${r.lost[1]}/yr · hours back ${r.hoursFree[0]}–${r.hoursFree[1]}/mo · worth ${iqd(r.money[0])}–${iqd(r.money[1])} IQD/mo`,
    sharpenLine(a),
  ];
}

/* ---------------------------------------------------------------------------
 * 10) رابط المشاركة: الأجوبة الأساسية فقط (بدون أي بيانات شخصية) في سلسلة قصيرة
 * ------------------------------------------------------------------------- */
const ALPHA = '0123456789abcdefghijklmnopqrstuvwxyz';
export function encode(a: Answers): string {
  if (!isComplete(a)) return '';
  let s = '';
  for (const k of CORE) {
    if (k === MULTI) {
      let mask = 0;
      for (const c of a.channels ?? []) mask |= 1 << OPTIONS.channels.indexOf(c);
      s += ALPHA[mask >> 5] + ALPHA[mask & 31];
    } else s += ALPHA[(OPTIONS[k] as readonly string[]).indexOf(a[k] as string)];
  }
  return s;
}
export function decode(code: string): Answers | null {
  if (typeof code !== 'string' || code.length !== CORE.length + 1) return null;
  const out: Record<string, unknown> = {};
  let i = 0;
  for (const k of CORE) {
    if (k === MULTI) {
      const mask = (ALPHA.indexOf(code[i]) << 5) | ALPHA.indexOf(code[i + 1]);
      i += 2;
      if (mask <= 0) return null;
      out.channels = OPTIONS.channels.filter((_, j) => mask & (1 << j));
    } else {
      const v = (OPTIONS[k] as readonly string[])[ALPHA.indexOf(code[i++])];
      if (v === undefined) return null;
      out[k] = v;
    }
  }
  const a = sanitize(out);
  return isComplete(a) ? a : null;
}

/** كود النتيجة الذي يرسله الزائر بالواتساب (بدون حروف ملتبسة مثل 0/O و 1/I) */
export function resultCode(rand: () => number = Math.random): string {
  const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 5; i++) s += abc[Math.floor(rand() * abc.length)];
  return `NW-${s}`;
}
