/**
 * Netlify Function: الخادم الوحيد لاختبار "اكتشف ليش تخسر زبائنك".
 * يعمل على نفس الدومين (/api/launch/*)، لذلك سياسة CSP (connect-src 'self') لا تتغير.
 *
 * المسارات (كلها POST + JSON):
 *   /api/launch/event    خطوة في القمع (sendBeacon) → دالة launch_track في Supabase
 *   /api/launch/session  أجوبة مجهولة بعد النتيجة → صف في launch_sessions، ويعيد {id, token}
 *   /api/launch/lead     بيانات التواصل + الموافقة → launch_leads + تنبيه Telegram + بريد Resend
 *   /api/launch/update   "حدّد خطتك" أو ضغطة الواتساب → تحديث الجلسة (يتطلب token الجلسة)
 *
 * الأمان:
 *   - مفتاح service_role في متغيرات Netlify فقط، لا يصل للمتصفح أبداً
 *   - كل الأجوبة تمر على sanitize() والأرقام يعاد حسابها هنا بنفس المحرك (لا نثق بأرقام المتصفح)
 *   - فخ honeypot + حد أدنى للوقت + حد للطلبات لكل IP (مخزن كـ hash مملّح فقط) + فحص Origin
 *   - كل نص من الزائر يُهرَّب (escape) قبل وضعه في رسالة Telegram أو البريد
 *
 * متغيرات البيئة (Netlify → Site configuration → Environment variables):
 *   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY        (مطلوبة للحفظ؛ المفتاح service_role القديم أو sb_secret_ الجديد)
 *   TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID           (تنبيه فوري للمجموعة)
 *   TELEGRAM_FALLBACK_CHAT_ID                      (اختياري: حساب شخصي إذا فشل الإرسال للمجموعة)
 *   RESEND_API_KEY, LEAD_EMAIL_TO, LEAD_EMAIL_FROM (تنبيه بالبريد؛ FROM اختياري)
 *   LAUNCH_SALT                                    (ملح لتشفير IP؛ أي نص عشوائي طويل)
 * أي متغير ناقص: الخدمة تكمل بدونه وتكتب تحذيراً في السجل (الـ lead لا يضيع).
 */
import {
  compute, leadScore, sanitize, isComplete, SHARPEN, type Answers,
} from '../../src/scripts/launch/engine.ts';

interface Ctx { ip?: string; params?: Record<string, string>; waitUntil?: (p: Promise<unknown>) => void }

export const config = { path: '/api/launch/:action' };

const env = (k: string) => (typeof Netlify !== 'undefined' ? Netlify.env.get(k) : undefined) ?? process.env[k] ?? '';
declare const Netlify: { env: { get(k: string): string | undefined } } | undefined;

const MAX_BODY = 16_000;
const RATE_PER_HOUR = 20;
const MIN_MS = 4_000;
const SITE = 'https://nawa-iq.com';

/* ---------------------------------------------------------------------------
 * أدوات
 * ------------------------------------------------------------------------- */
const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max) : '');
const int = (v: unknown, min: number, max: number) => (typeof v === 'number' && Number.isFinite(v) ? Math.max(min, Math.min(max, Math.round(v))) : null);
const oneOf = <T extends string>(v: unknown, list: readonly T[]): T | null => (typeof v === 'string' && (list as readonly string[]).includes(v) ? (v as T) : null);
const isUuid = (v: unknown): v is string => typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

async function sha256(s: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
const randomToken = () => [...crypto.getRandomValues(new Uint8Array(24))].map((b) => b.toString(16).padStart(2, '0')).join('');

/** رقم الواتساب بالصيغة الدولية بدون + (العراق: 07xxxxxxxxx → 9647xxxxxxxxx) */
export function normalizePhone(raw: string): string | null {
  let d = raw.replace(/[^\d]/g, '');
  if (d.startsWith('00')) d = d.slice(2);
  if (d.length === 11 && d.startsWith('07')) d = '964' + d.slice(1);
  else if (d.length === 10 && d.startsWith('7')) d = '964' + d;
  return d.length >= 10 && d.length <= 15 ? d : null;
}

/* ---------------------------------------------------------------------------
 * Supabase (PostgREST مباشرة بـ fetch: بدون مكتبة إضافية)
 * ------------------------------------------------------------------------- */
const db = {
  ok: () => !!(env('SUPABASE_URL') && env('SUPABASE_SERVICE_ROLE_KEY')),
  async req(path: string, init: RequestInit & { prefer?: string } = {}) {
    const key = env('SUPABASE_SERVICE_ROLE_KEY');
    const res = await fetch(`${env('SUPABASE_URL').replace(/\/$/, '')}/rest/v1/${path}`, {
      ...init,
      headers: {
        // مفاتيح Supabase الجديدة (sb_secret_…) ليست JWT: تُرسل في apikey فقط. المفاتيح القديمة (JWT) تُرسل في الاثنين
        apikey: key, ...(key.startsWith('eyJ') ? { Authorization: `Bearer ${key}` } : {}), 'Content-Type': 'application/json',
        ...(init.prefer ? { Prefer: init.prefer } : {}),
      },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) throw new Error(`supabase ${res.status}: ${(await res.text()).slice(0, 300)}`);
    return res;
  },
  async insert<T>(table: string, row: Record<string, unknown>): Promise<T> {
    const res = await this.req(table, { method: 'POST', body: JSON.stringify(row), prefer: 'return=representation' });
    return ((await res.json()) as T[])[0];
  },
  async patch(table: string, filter: string, row: Record<string, unknown>) {
    await this.req(`${table}?${filter}`, { method: 'PATCH', body: JSON.stringify(row), prefer: 'return=minimal' });
  },
  async select<T>(table: string, query: string): Promise<T[]> {
    return (await (await this.req(`${table}?${query}`)).json()) as T[];
  },
  async count(table: string, query: string): Promise<number> {
    const res = await this.req(`${table}?${query}`, { method: 'HEAD', prefer: 'count=exact' });
    return Number(res.headers.get('content-range')?.split('/')[1] ?? 0);
  },
  async rpc(fn: string, args: Record<string, unknown>) {
    await this.req(`rpc/${fn}`, { method: 'POST', body: JSON.stringify(args) });
  },
};

/* ---------------------------------------------------------------------------
 * تجهيز صف الجلسة من جسم الطلب (كل الحقول منظّفة، والأرقام محسوبة هنا)
 * ------------------------------------------------------------------------- */
function sessionRow(b: Record<string, unknown>, ipHash: string) {
  const answers: Answers = sanitize(b.answers);
  const as = (b.assumptions ?? {}) as Record<string, unknown>;
  const override = { value: typeof as.value === 'number' ? as.value : undefined, conv: typeof as.conv === 'number' ? as.conv : undefined };
  const r = compute(answers, override);
  const ls = leadScore(answers);
  const rush = (b.rush ?? {}) as Record<string, unknown>;
  const src = (b.source ?? {}) as Record<string, unknown>;
  const durations = Array.isArray(b.durations) ? b.durations.slice(0, 9).map((d) => int(d, 0, 3_600_000) ?? 0) : null;
  return {
    answers, complete: isComplete(answers),
    row: {
      anon_id: isUuid(b.anon) ? b.anon : null,
      code: /^NW-[A-Z0-9]{5}$/.test(String(b.code)) ? b.code : null,
      lang: oneOf(b.lang, ['en', 'ar'] as const),
      cta_variant: oneOf(b.variant, ['a', 'b'] as const),
      industry: answers.industry ?? null, team: answers.team ?? null, volume: answers.volume ?? null, channels: answers.channels ?? null,
      reply: answers.reply ?? null, vanish: answers.vanish ?? null, hours: answers.hours ?? null, system: answers.system ?? null,
      bottleneck: answers.bottleneck ?? null, timeline: answers.timeline ?? null, decider: answers.decider ?? null, band: answers.band ?? null, worry: answers.worry ?? null,
      answers, durations_ms: durations,
      rush_played: typeof rush.played === 'boolean' ? rush.played : null,
      rush_answered: int(rush.answered, 0, 50), rush_total: int(rush.total, 0, 50),
      score: r.score, archetype: r.archetype, inquiries: r.inquiries,
      lost_lo: r.lost[0], lost_hi: r.lost[1], recoverable_lo: r.recoverable[0], recoverable_hi: r.recoverable[1],
      hours_free_lo: r.hoursFree[0], hours_free_hi: r.hoursFree[1], money_lo: r.money[0], money_hi: r.money[1],
      assumption_value: r.assumptions.value, assumption_conv: r.assumptions.conv,
      fit: ls.fit, intent: ls.intent, lead_score: ls.total, grade: ls.grade,
      source_from: str(src.from, 40) || null, utm_source: str(src.utm_source, 80) || null, utm_medium: str(src.utm_medium, 80) || null,
      utm_campaign: str(src.utm_campaign, 120) || null, referrer: str(src.referrer, 120) || null, device: oneOf(src.device, ['mobile', 'desktop'] as const),
      ip_hash: ipHash, total_ms: int(b.ms, 0, 86_400_000),
    },
    result: r, score: ls,
  };
}

/* ---------------------------------------------------------------------------
 * التنبيهات
 * ------------------------------------------------------------------------- */
const LABEL: Record<string, string> = {
  clinic: 'Clinic', restaurant: 'Restaurant/café', store: 'Online store', retail: 'Shop', realestate: 'Real estate', education: 'Education', services: 'Services company', other: 'Other',
  solo: '1 (owner)', small: '2-3', mid: '4-10', large: '10+', v1: '<10/day', v2: '10-30/day', v3: '30-100/day', v4: '100+/day',
  minutes: 'minutes', hour: 'within the hour', morning: 'next morning', late: 'whenever',
  few: '~10%', some: '~30%', half: '~50%', most: 'most', h1: '<3h/wk', h2: '3-8h/wk', h3: '8-15h/wk', h4: '15h+/wk',
  paper: 'paper', head: 'memory', excel: 'Excel', wabiz: 'WhatsApp labels', software: 'own software',
  replies: 'fast replies', bookings: 'bookings', orders: 'orders', followup: 'follow-up', admin: 'admin/ERP', presence: 'online presence',
  now: 'this month', quarter: '≤3 months', later: 'later this year', curious: 'just exploring',
  me: 'decides alone', partner: 'with partner/family', manager: 'needs manager', committee: 'committee',
  b1: '<150k IQD/mo', b2: '150-450k', b3: '450k-1.2M', b4: '1.2M+', robotic: 'sounds robotic', data: 'data privacy', mistakes: 'wrong answers', price: 'cost', staff: 'staff resistance',
};
const L = (v?: string | null) => esc(v ? LABEL[v] ?? v : '—');
const money = (n: number) => (n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${Math.round(n / 1e3)}k` : String(n));

interface LeadInfo { name: string; business: string; city: string; whatsapp: string; marketing: boolean }
interface SessionInfo { code: string | null; lang: string | null; cta_variant: string | null; source_from: string | null; utm_source: string | null; archetype: string; score: number }

function alertText(lead: LeadInfo, s: SessionInfo, a: Answers, r: ReturnType<typeof compute>, g: ReturnType<typeof leadScore>) {
  const lines = [
    `<b>New lead · ${g.grade}</b> (${g.total}/100 · fit ${g.fit} · intent ${g.intent})`,
    `${esc(lead.name)}${lead.business ? ` · ${esc(lead.business)}` : ''}${lead.city ? ` · ${esc(lead.city)}` : ''}`,
    `WhatsApp: +${lead.whatsapp}`,
    '',
    `Orbit: <b>${s.archetype}</b> ${s.score}/100 · code ${s.code ?? '—'}`,
    `${L(a.industry)} · team ${L(a.team)} · ${L(a.volume)} · channels: ${(a.channels ?? []).join(', ') || '—'}`,
    `Reply: ${L(a.reply)} · vanish: ${L(a.vanish)} · repetitive: ${L(a.hours)} · system: ${L(a.system)}`,
    `Wants to fix: <b>${L(a.bottleneck)}</b>`,
    `Lost ${r.lost[0]}–${r.lost[1]} inquiries/mo · at stake ${money(r.money[0])}–${money(r.money[1])} IQD/mo`,
    a.timeline || a.decider || a.band ? `Timing: ${L(a.timeline)} · ${L(a.decider)} · value: ${L(a.band)} · worry: ${L(a.worry)}` : 'Sharpen answers: not yet',
    '',
    `Lang ${s.lang ?? '—'} · headline ${s.cta_variant ?? '—'} · from ${esc(s.source_from ?? '—')}${s.utm_source ? ` · utm ${esc(s.utm_source)}` : ''} · marketing ${lead.marketing ? 'yes' : 'no'}`,
  ];
  return lines.join('\n');
}

async function sendTelegram(token: string, chat: string, text: string, waNumber?: string, waText?: string): Promise<boolean> {
  try {
    const body: Record<string, unknown> = { chat_id: chat, text, parse_mode: 'HTML', disable_web_page_preview: true };
    if (waNumber) body.reply_markup = { inline_keyboard: [[{ text: 'Reply on WhatsApp', url: `https://wa.me/${waNumber}${waText ? `?text=${encodeURIComponent(waText)}` : ''}` }]] };
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) console.error('[launch] Telegram', res.status, (await res.text()).slice(0, 200));
    return res.ok;
  } catch (e) { console.error('[launch] Telegram failed', e); return false; }
}

/**
 * تنبيه Telegram: للمجموعة (TELEGRAM_CHAT_ID) أولاً، وإذا فشل (البوت طُرد من المجموعة، صلاحيات...)
 * نحاول مرة واحدة على الحساب الشخصي (TELEGRAM_FALLBACK_CHAT_ID) حتى لا يضيع أي lead.
 */
async function telegram(text: string, waNumber?: string, waText?: string): Promise<boolean> {
  const token = env('TELEGRAM_BOT_TOKEN'), chat = env('TELEGRAM_CHAT_ID'), fallback = env('TELEGRAM_FALLBACK_CHAT_ID');
  if (!token || !(chat || fallback)) { console.warn('[launch] Telegram not configured'); return false; }
  if (chat && (await sendTelegram(token, chat, text, waNumber, waText))) return true;
  if (fallback && fallback !== chat) return sendTelegram(token, fallback, `${text}\n\n(Group delivery failed: sent here instead)`, waNumber, waText);
  return false;
}

async function email(subject: string, html: string, text: string): Promise<boolean> {
  const key = env('RESEND_API_KEY'), to = env('LEAD_EMAIL_TO');
  if (!key || !to) { console.warn('[launch] Email not configured'); return false; }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: env('LEAD_EMAIL_FROM') || 'NAWA Leads <onboarding@resend.dev>', to: to.split(',').map((x) => x.trim()), subject, html, text }),
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) console.error('[launch] Resend', res.status, (await res.text()).slice(0, 200));
    return res.ok;
  } catch (e) { console.error('[launch] Email failed', e); return false; }
}

/* ---------------------------------------------------------------------------
 * المعالج
 * ------------------------------------------------------------------------- */
export default async function handler(req: Request, context: Ctx = {}): Promise<Response> {
  if (req.method !== 'POST') return json(405, { error: 'method' });
  const url = new URL(req.url);
  // طلبات من مواقع أخرى (المتصفح يرسل Origin): نرفضها
  const origin = req.headers.get('origin');
  if (origin && new URL(origin).host !== url.host && !origin.startsWith(SITE)) return json(403, { error: 'origin' });

  const raw = await req.text();
  if (raw.length > MAX_BODY) return json(413, { error: 'too large' });
  let b: Record<string, unknown>;
  try { b = JSON.parse(raw); if (!b || typeof b !== 'object') throw 0; } catch { return json(400, { error: 'json' }); }

  const action = context.params?.action ?? url.pathname.split('/').pop() ?? '';
  const ip = context.ip || req.headers.get('x-nf-client-connection-ip') || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '';
  const ipHash = (await sha256(`${env('LAUNCH_SALT') || 'nawa-launch'}:${ip}`)).slice(0, 32);
  const later = (p: Promise<unknown>) => (context.waitUntil ? context.waitUntil(p) : p);

  try {
    switch (action) {
      case 'event': return await onEvent(b);
      case 'session': return await onSession(b, ipHash);
      case 'lead': return await onLead(b, ipHash, later);
      case 'update': return await onUpdate(b, later);
      default: return json(404, { error: 'action' });
    }
  } catch (e) {
    console.error(`[launch] ${action} failed`, e);
    return json(500, { error: 'server' });
  }
}

async function onEvent(b: Record<string, unknown>) {
  if (!isUuid(b.anon)) return json(400, { error: 'anon' });
  const step = int(b.step, -1, 14);
  if (step === null) return json(400, { error: 'step' });
  if (!db.ok()) return json(202, { ok: true, stored: false });
  await db.rpc('launch_track', {
    p_anon: b.anon, p_step: step,
    p_variant: oneOf(b.variant, ['a', 'b'] as const), p_lang: oneOf(b.lang, ['en', 'ar'] as const),
    p_from: str(b.from, 40), p_device: oneOf(b.device, ['mobile', 'desktop'] as const),
    p_rush_played: typeof b.rush_played === 'boolean' ? b.rush_played : null,
    p_rush_answered: int(b.rush_answered, 0, 50), p_rush_total: int(b.rush_total, 0, 50),
  });
  return json(200, { ok: true });
}

async function rateLimited(ipHash: string) {
  const since = new Date(Date.now() - 3600_000).toISOString();
  return (await db.count('launch_sessions', `select=id&ip_hash=eq.${ipHash}&created_at=gte.${encodeURIComponent(since)}`)) >= RATE_PER_HOUR;
}

type Created = { error: Response } | { error?: undefined; id: string; token: string; s: ReturnType<typeof sessionRow> };
async function createSession(b: Record<string, unknown>, ipHash: string): Promise<Created> {
  const s = sessionRow(b, ipHash);
  if (!s.complete) return { error: json(400, { error: 'incomplete' }) };
  const token = randomToken();
  const row = await db.insert<{ id: string }>('launch_sessions', { ...s.row, token_hash: await sha256(token) });
  return { id: row.id, token, s };
}

async function onSession(b: Record<string, unknown>, ipHash: string) {
  if (!db.ok()) return json(202, { ok: true, stored: false });
  if (await rateLimited(ipHash)) return json(429, { error: 'rate' });
  const c = await createSession(b, ipHash);
  if (c.error) return c.error;
  return json(200, { id: c.id, token: c.token });
}

/** يتحقق أن الزائر يملك الجلسة (token) ويعيدها */
async function ownSession(b: Record<string, unknown>) {
  const sess = (b.session ?? b) as Record<string, unknown>;
  if (!isUuid(sess.id) || typeof sess.token !== 'string' || sess.token.length > 100) return null;
  const rows = await db.select<{ id: string; answers: Answers; grade: string }>('launch_sessions', `select=id,answers,grade&id=eq.${sess.id}&token_hash=eq.${await sha256(sess.token)}`);
  return rows[0] ?? null;
}

async function onLead(b: Record<string, unknown>, ipHash: string, later: (p: Promise<unknown>) => unknown) {
  // فخ الروبوتات: نرد بنجاح وهمي حتى لا يعرف أنه انكشف
  if (str(b.hp, 200)) return json(200, { ok: true });
  if ((int(b.ms, 0, 86_400_000) ?? 0) < MIN_MS) return json(200, { ok: true });

  const c = (b.contact ?? {}) as Record<string, unknown>, consent = (b.consent ?? {}) as Record<string, unknown>;
  const name = str(c.name, 80), whatsapp = normalizePhone(str(c.whatsapp, 40));
  if (name.length < 2 || !whatsapp) return json(400, { error: 'contact' });
  if (consent.contact !== true) return json(400, { error: 'consent' });
  const lead: LeadInfo = { name, business: str(c.business, 120), city: str(c.city, 60), whatsapp, marketing: consent.marketing === true };

  const s = sessionRow(b, ipHash);
  if (!s.complete) return json(400, { error: 'incomplete' });

  let id: string | null = null, token: string | null = null, saved = false;
  if (db.ok()) {
    try {
      if (await rateLimited(ipHash)) return json(429, { error: 'rate' });
      const own = await ownSession(b);
      if (own) { id = own.id; await db.patch('launch_sessions', `id=eq.${id}`, { ...s.row, updated_at: new Date().toISOString() }); token = (b.session as Record<string, string>).token; }
      else { const cs = await createSession(b, ipHash); if (cs.error) return cs.error; id = cs.id; token = cs.token; }
      await db.insert('launch_leads', {
        session_id: id, name: lead.name, business: lead.business || null, city: lead.city || null, whatsapp: lead.whatsapp,
        consent_contact: true, consent_marketing: lead.marketing, consent_text: str(b.consent_text, 400) || null,
      });
      saved = true;
    } catch (e) {
      // الحفظ فشل: لا نخسر الـ lead، التنبيهات تحمل كل البيانات
      console.error('[launch] lead save failed, alerting anyway', e);
    }
  } else console.warn('[launch] Supabase not configured: lead only sent as alerts');

  const info: SessionInfo = { code: s.row.code as string | null, lang: s.row.lang, cta_variant: s.row.cta_variant, source_from: s.row.source_from, utm_source: s.row.utm_source, archetype: s.result.archetype, score: s.result.score };
  const text = alertText(lead, info, s.answers, s.result, s.score);
  const greet = s.row.lang === 'ar' ? `مرحباً ${lead.name}، معك نوى بخصوص نتيجتك ${info.code ?? ''}.` : `Hello ${lead.name}, this is NAWA about your result ${info.code ?? ''}.`;
  const alerts = Promise.allSettled([
    telegram(text + (saved ? '' : '\n\n⚠ Not saved to the database'), lead.whatsapp, greet),
    email(
      `[NAWA lead ${s.score.grade}] ${lead.name}${lead.business ? ` · ${lead.business}` : ''}`,
      `<div style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.6;white-space:pre-wrap">${text}</div><p><a href="https://wa.me/${lead.whatsapp}">Open WhatsApp chat</a></p>`,
      text.replace(/<[^>]+>/g, ''),
    ),
  ]).then(async ([tg, em]) => {
    if (saved && id) await db.patch('launch_leads', `session_id=eq.${id}`, {
      alerted_telegram: tg.status === 'fulfilled' && tg.value, alerted_email: em.status === 'fulfilled' && em.value,
    }).catch(() => {});
  });
  await later(alerts);
  return json(200, { ok: true, id, token, saved });
}

async function onUpdate(b: Record<string, unknown>, later: (p: Promise<unknown>) => unknown) {
  if (!db.ok()) return json(202, { ok: true, stored: false });
  const own = await ownSession(b);
  if (!own) return json(403, { error: 'session' });
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (b.whatsapp_clicked === true) patch.whatsapp_clicked = true;
  let regrade: { before: string; after: ReturnType<typeof leadScore>; answers: Answers } | null = null;
  if (b.sharpen && typeof b.sharpen === 'object') {
    const picked = sanitize(b.sharpen) as Record<string, unknown>;
    const sharpen = Object.fromEntries(SHARPEN.filter((k) => picked[k]).map((k) => [k, picked[k]]));
    const answers = sanitize({ ...own.answers, ...sharpen });
    const ls = leadScore(answers);
    Object.assign(patch, sharpen, { answers, fit: ls.fit, intent: ls.intent, lead_score: ls.total, grade: ls.grade });
    regrade = { before: own.grade, after: ls, answers };
  }
  await db.patch('launch_sessions', `id=eq.${own.id}`, patch);

  // إذا كان عنده lead وتغيّر تقييمه: رسالة قصيرة لـ Telegram حتى يعرف الفريق قبل الاتصال
  if (regrade && regrade.after.grade !== regrade.before) {
    const leads = await db.select<{ name: string; whatsapp: string }>('launch_leads', `select=name,whatsapp&session_id=eq.${own.id}`);
    if (leads[0]) {
      const a = regrade.answers;
      await later(telegram(
        `<b>Lead update · ${regrade.before} → ${regrade.after.grade}</b>\n${esc(leads[0].name)} · +${leads[0].whatsapp}\nTiming: ${L(a.timeline)} · ${L(a.decider)} · value: ${L(a.band)} · worry: ${L(a.worry)}`,
        leads[0].whatsapp,
      ));
    }
  }
  return json(200, { ok: true });
}
