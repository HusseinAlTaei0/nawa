/**
 * محرك "اكتشف ليش تخسر زبائنك" (Launch Test): منطق صافٍ بدون DOM وبدون نصوص.
 *
 * نفس الملف يُستخدم في 3 أماكن:
 *  1) المتصفح: يحسب النتيجة فوراً من أجوبة الزائر
 *  2) Netlify Function: يعيد الحساب في السيرفر (لا نثق بأرقام قادمة من المتصفح) ويقيّم الـ lead
 *  3) لاحقاً طبقة Claude: تأخذ الناتج المنظّم (أرقام + مفاتيح) وتكتب تحليلاً، ولا تخترع أرقاماً
 *
 * قواعد صارمة:
 *  - كل رقم يظهر للزائر نطاق (من–إلى) محافظ، والافتراضات مكشوفة وقابلة للتعديل
 *  - كل جملة في النتيجة مشروطة بأجوبة الزائر (لا نص عام "يشبه" الشخصي = تأثير بارنوم)
 *  - بدون enum وبدون namespaces حتى يعمل الملف مع Node --experimental-strip-types في الاختبارات
 */

/* ---------------------------------------------------------------------------
 * 1) الأسئلة والخيارات (مفاتيح فقط؛ النصوص في src/data/launch.ts)
 * ------------------------------------------------------------------------- */
export const OPTIONS = {
  // الأسئلة الأساسية التسعة (تبني الكوكب وتُحسب منها النتيجة)
  industry: ['clinic', 'restaurant', 'store', 'retail', 'realestate', 'education', 'services', 'other'],
  team: ['solo', 'small', 'mid', 'large'],
  volume: ['v1', 'v2', 'v3', 'v4'],
  channels: ['whatsapp', 'instagram', 'facebook', 'phone', 'walkin', 'telegram', 'website'],
  reply: ['minutes', 'hour', 'morning', 'late'],
  vanish: ['few', 'some', 'half', 'most'],
  hours: ['h1', 'h2', 'h3', 'h4'],
  system: ['paper', 'head', 'excel', 'wabiz', 'software'],
  bottleneck: ['replies', 'bookings', 'orders', 'followup', 'admin', 'presence'],
  // أسئلة "حدّد خطتك" الاختيارية بعد كشف النتيجة (تقييم الـ lead + الاعتراض الأساسي)
  timeline: ['now', 'quarter', 'later', 'curious'],
  decider: ['me', 'partner', 'manager', 'committee'],
  band: ['b1', 'b2', 'b3', 'b4'],
  worry: ['robotic', 'data', 'mistakes', 'price', 'staff'],
} as const;

export type Key = keyof typeof OPTIONS;
export type Opt<K extends Key> = (typeof OPTIONS)[K][number];
export const CORE = ['industry', 'team', 'volume', 'channels', 'reply', 'vanish', 'hours', 'system', 'bottleneck'] as const;
export const SHARPEN = ['timeline', 'decider', 'band', 'worry'] as const;
export type CoreKey = (typeof CORE)[number];
export type SharpenKey = (typeof SHARPEN)[number];
/** السؤال الوحيد متعدد الاختيار */
export const MULTI: Key = 'channels';

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
  CORE.every((k) => (k === 'channels' ? !!a.channels?.length : a[k] !== undefined));

/* ---------------------------------------------------------------------------
 * 2) الافتراضات (قابلة للتعديل من الزائر في التقرير الكامل)
 * ------------------------------------------------------------------------- */
/**
 * لكل نشاط: قيمة أول عملية شراء لزبون جديد (بالدينار العراقي) ونسبة تحوّل الاستفسار إلى زبون.
 * ⚠️ PLACEHOLDER: أرقام تقديرية أولية. يجب أن يؤكدها صاحب نوى من مشاريعه الحقيقية قبل الإطلاق.
 * تظهر للزائر بوضوح كـ "افتراض" ويستطيع تعديلها.
 */
export const PRESETS: Record<Opt<'industry'>, { value: number; conv: number }> = {
  clinic: { value: 50_000, conv: 0.35 },
  restaurant: { value: 25_000, conv: 0.5 },
  store: { value: 35_000, conv: 0.3 },
  retail: { value: 40_000, conv: 0.3 },
  realestate: { value: 1_500_000, conv: 0.03 },
  education: { value: 400_000, conv: 0.15 },
  services: { value: 250_000, conv: 0.1 },
  other: { value: 50_000, conv: 0.2 },
};

/** رسائل زبائن جدد في يوم عادي: منتصف كل فئة */
const VOLUME_MID: Record<Opt<'volume'>, number> = { v1: 6, v2: 20, v3: 60, v4: 150 };
/** أيام العمل في الشهر */
const WORK_DAYS = 26;
/** ساعات أسبوعية على المهام المتكررة: منتصف كل فئة */
const HOURS_MID: Record<Opt<'hours'>, number> = { h1: 2, h2: 5.5, h3: 11.5, h4: 20 };
/** نسبة من يسأل ويختفي (إجابة الزائر نفسه) */
const VANISH: Record<Opt<'vanish'>, number> = { few: 0.1, some: 0.3, half: 0.5, most: 0.7 };
/**
 * من الذين اختفوا: كم نسبة يمكن استرجاعها بالرد خلال دقيقة؟ تعتمد على سرعة الرد الحالية.
 * محافظة عمداً. الاتجاه مدعوم بدراسات سرعة الاستجابة (Oldroyd/InsideSales، HBR 2011) وليس بأرقامها الحرفية.
 */
const RECOVERABLE: Record<Opt<'reply'>, number> = { minutes: 0.12, hour: 0.25, morning: 0.4, late: 0.55 };
/** حصة المهام المتكررة القابلة للأتمتة (McKinsey: ~45% من الأنشطة المدفوعة قابلة تقنياً) */
const AUTOMATABLE: [number, number] = [0.4, 0.6];
/** هامش النطاق حول التقدير المركزي */
const SPREAD: [number, number] = [0.7, 1.15];
/** شهر البناء: المسار الآلي يبدأ من الشهر الثاني (صراحة: النظام لا يُبنى في يوم) */
const SETUP_MONTHS = 1;

/* ---------------------------------------------------------------------------
 * 3) درجة المدار /100: "قد إيش شغلك يمسك زبائنه بمداره"
 * ------------------------------------------------------------------------- */
const SCORE = {
  system: { paper: 5, head: 0, excel: 12, wabiz: 15, software: 22 },
  reply: { minutes: 22, hour: 16, morning: 8, late: 2 },
  vanish: { few: 20, some: 13, half: 7, most: 2 },
  hours: { h1: 22, h2: 15, h3: 8, h4: 3 },
} as const;
const channelScore = (n: number) => (n >= 3 ? 14 : n === 2 ? 10 : n === 1 ? 6 : 0);

export function orbitScore(a: Answers): number {
  let s = 0;
  if (a.system) s += SCORE.system[a.system];
  if (a.reply) s += SCORE.reply[a.reply];
  if (a.vanish) s += SCORE.vanish[a.vanish];
  if (a.hours) s += SCORE.hours[a.hours];
  s += channelScore(a.channels?.length ?? 0);
  return Math.max(0, Math.min(100, s));
}

/* ---------------------------------------------------------------------------
 * 4) هوية المدار (قواعد مرتّبة؛ أول قاعدة تنطبق تفوز)
 * ------------------------------------------------------------------------- */
export type Archetype = 'lone' | 'crowded' | 'drifting' | 'leak' | 'ready' | 'steady';
const rank = <K extends Key>(k: K, v: Opt<K> | undefined) => (v === undefined ? -1 : (OPTIONS[k] as readonly string[]).indexOf(v));

export function archetype(a: Answers): Archetype {
  if (a.team === 'solo' && (rank('volume', a.volume) >= 1 || rank('hours', a.hours) >= 1)) return 'lone';
  if (rank('volume', a.volume) >= 2 && (a.reply === 'morning' || a.reply === 'late')) return 'crowded';
  if (a.system === 'paper' || a.system === 'head') return 'drifting';
  if (a.vanish === 'half' || a.vanish === 'most') return 'leak';
  return orbitScore(a) >= 75 ? 'ready' : 'steady';
}

/* ---------------------------------------------------------------------------
 * 5) الخطة: 3 خطوات مربوطة بخدمات نوى
 * ------------------------------------------------------------------------- */
export type StepKey =
  | 'agent' | 'booking' | 'orders' | 'followup' | 'erp' | 'presence'     // الخطوة 1: حسب عنق الزجاجة
  | 'digitize' | 'excel' | 'crm' | 'connect'                              // الخطوة 2: حسب النظام الحالي
  | 'report' | 'brand';                                                   // الخطوة 3: القياس أو الهوية
export interface Step { key: StepKey; service: string }

const STEP1: Record<Opt<'bottleneck'>, Step> = {
  replies: { key: 'agent', service: 'ai-agents' },
  bookings: { key: 'booking', service: 'ai-agents' },
  orders: { key: 'orders', service: 'automation' },
  followup: { key: 'followup', service: 'automation' },
  admin: { key: 'erp', service: 'erp-systems' },
  presence: { key: 'presence', service: 'websites-web-apps' },
};
const STEP2: Record<Opt<'system'>, Step> = {
  paper: { key: 'digitize', service: 'erp-systems' },
  head: { key: 'digitize', service: 'erp-systems' },
  excel: { key: 'excel', service: 'automation' },
  wabiz: { key: 'crm', service: 'automation' },
  software: { key: 'connect', service: 'automation' },
};

export function plan(a: Answers): Step[] {
  const s1 = STEP1[a.bottleneck ?? 'replies'];
  let s2 = STEP2[a.system ?? 'wabiz'];
  // إذا كانت الخطوة الأولى نظام ERP فلا نكرر "رقمنة" بنفس الخدمة: ننتقل للمتابعة الآلية
  if (s2.service === s1.service && s2.key === 'digitize' && s1.key === 'erp') s2 = { key: 'crm', service: 'automation' };
  const s3: Step = a.bottleneck === 'presence' ? { key: 'brand', service: 'branding' } : { key: 'report', service: 'automation' };
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
  /** استفسارات جديدة شهرياً (تقدير مركزي) */
  inquiries: number;
  /** استفسارات تختفي شهرياً حسب كلام الزائر نفسه */
  lost: Range;
  /** منها: كم يمكن استرجاعه بالرد خلال دقيقة */
  recoverable: Range;
  /** ساعات شهرية على المهام المتكررة */
  hours: number;
  /** منها: الساعات القابلة للتحرير بالأتمتة */
  hoursFree: Range;
  /** زبائن يمكن كسبهم شهرياً */
  customers: Range;
  /** قيمة شهرية على المحك (دينار) */
  money: Range;
  /** توقع 12 شهر: زبائن تراكمياً في المسارين */
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
  return { ...PRESETS[a.industry ?? 'other'] };
}

export function compute(a: Answers, override?: Partial<Assumptions>): Result {
  const as: Assumptions = { ...defaultAssumptions(a), ...cleanOverride(override) };
  const inquiries = VOLUME_MID[a.volume ?? 'v1'] * WORK_DAYS;
  const vanishShare = VANISH[a.vanish ?? 'few'];
  const lostC = inquiries * vanishShare;
  const recC = lostC * RECOVERABLE[a.reply ?? 'minutes'];
  const hours = Math.round(HOURS_MID[a.hours ?? 'h1'] * 4.3);
  const customersC = recC * as.conv;

  // التوقع: الزبائن التراكميون من الاستفسارات. المسار الحالي ثابت، والآلي يضيف المسترجَع بعد شهر البناء
  const base = inquiries * (1 - vanishShare) * as.conv;
  const current: number[] = [], automated: number[] = [];
  let c = 0, au = 0;
  for (let m = 1; m <= 12; m++) {
    c += base; au += base + (m > SETUP_MONTHS ? customersC : 0);
    current.push(Math.round(c)); automated.push(Math.round(au));
  }

  return {
    score: orbitScore(a),
    archetype: archetype(a),
    inquiries: nice(inquiries),
    lost: range(lostC),
    recoverable: range(recC),
    hours,
    hoursFree: [nice(hours * AUTOMATABLE[0]), nice(hours * AUTOMATABLE[1])],
    customers: range(customersC),
    money: range(customersC * as.value),
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
 * 7) تقييم الـ lead (للمبيعات فقط، لا يظهر للزائر): ملاءمة 0–50 + نية 0–50
 * ------------------------------------------------------------------------- */
export type Grade = 'A' | 'B' | 'C';
export interface LeadScore { fit: number; intent: number; total: number; grade: Grade }

const FIT = {
  volume: { v1: 3, v2: 8, v3: 13, v4: 15 },
  team: { solo: 5, small: 10, mid: 12, large: 12 },
  hours: { h1: 2, h2: 6, h3: 10, h4: 13 },
} as const;
const INTENT = {
  timeline: { now: 20, quarter: 14, later: 7, curious: 2 },
  decider: { me: 15, partner: 11, manager: 7, committee: 5 },
  band: { b1: 3, b2: 8, b3: 12, b4: 15 },
} as const;
/** إجابة متروكة في الأسئلة الاختيارية = قيمة وسطى منخفضة (لا نعاقب من تخطاها بشدة) */
const SKIPPED = 5;

export function leadScore(a: Answers): LeadScore {
  const fit =
    (a.industry && a.industry !== 'other' ? 10 : 5) +
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
 * 8) رابط المشاركة: الأجوبة الأساسية فقط (بدون أي بيانات شخصية) في سلسلة قصيرة
 * ------------------------------------------------------------------------- */
const ALPHA = '0123456789abcdefghijklmnopqrstuvwxyz';
export function encode(a: Answers): string {
  if (!isComplete(a)) return '';
  let s = '';
  for (const k of CORE) {
    if (k === 'channels') {
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
    if (k === 'channels') {
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
