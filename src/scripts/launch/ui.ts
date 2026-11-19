/**
 * واجهة "اكتشف ليش تخسر زبائنك": تتحكم بالمراحل كلها.
 *
 * المراحل: intro → (rush اختياري) → 9 أسئلة → analysing → reveal (نتيجة جزئية + بوابة الواتساب) → report
 * - كل النصوص تأتي من JSON داخل الصفحة (لغة الصفحة فقط) حتى يبقى حجم JavaScript صغيراً
 * - كل الأرقام من engine.ts (نفس الكود الذي يعيد السيرفر الحساب به)
 * - القياس: خطوة واحدة رقمية لكل زائر (أقصى مرحلة وصلها) + نسخة العنوان (A/B) عبر sendBeacon
 * - الوصول: كل خيار زر حقيقي، التركيز ينتقل لعنوان كل مرحلة، الإعلانات عبر aria-live
 */
import {
  OPTIONS, CORE, SHARPEN, compute, decode, encode, isComplete, resultCode, defaultAssumptions,
  type Answers, type Key, type Result, type Range,
} from './engine';
import { createPlanet, type PlanetParams } from './planet';
import { runRush, type RushResult } from './rush';
import { makeCard } from './card';
import { motionOn } from '../motion';
import { whatsappLink } from '../../config/site';
import type { LaunchCopy } from '../../data/launch';

type Copy = LaunchCopy & { paths: { services: Record<string, string>; contact: string; launch: string } };

/* ---------------------------------------------------------------------------
 * أدوات صغيرة
 * ------------------------------------------------------------------------- */
const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ''));
const $ = <T extends Element = HTMLElement>(root: ParentNode, sel: string) => root.querySelector<T & Element>(sel) as unknown as T;
const el = <K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string) => {
  const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e;
};
const store = {
  get(k: string) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k: string, v: string) { try { localStorage.setItem(k, v); } catch { /* تخزين غير متاح (وضع خاص): نكمل بدونه */ } },
};
const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx'.replace(/x/g, () => ((Math.random() * 16) | 0).toString(16)));
/** رقم داخل <bdi dir="ltr"> (قاعدة الهوية: الأرقام تبقى LTR في العربية) */
const bdi = (text: string) => { const b = el('bdi'); b.dir = 'ltr'; b.textContent = text; return b; };
const fmt = (n: number) => new Intl.NumberFormat('en-US').format(n);

/* ---------------------------------------------------------------------------
 * التشغيل
 * ------------------------------------------------------------------------- */
const root = document.querySelector<HTMLElement>('[data-launch]');
if (root) init(root);

function init(root: HTMLElement) {
  const copy = JSON.parse($<HTMLScriptElement>(root, '#lt-copy').textContent || '{}') as Copy;
  const lang = document.documentElement.lang === 'ar' ? 'ar' : 'en';
  const rtl = lang === 'ar';
  const api = root.dataset.api || '/api/launch';
  const screens = [...root.querySelectorAll<HTMLElement>('[data-screen]')];
  const planet = createPlanet($<HTMLCanvasElement>(root, '.lt-planet'));
  const params = new URLSearchParams(location.search);

  // الحالة
  const anon = store.get('nawa-anon') || uuid(); store.set('nawa-anon', anon);
  const variant = store.get('nawa-cta') === 'b' ? 'b' : 'a';
  const answers: Answers = {};
  const durations: number[] = [];
  let qi = 0, qStart = 0, rush: RushResult = { played: false, answered: 0, total: 0 };
  let result: Result | null = null, override: { value?: number; conv?: number } = {};
  let session: { id: string; token: string } | null = null, code = '', leadSent = false, maxStep = -1;
  const pageStart = performance.now();
  const source = {
    from: params.get('from') || '',
    utm_source: params.get('utm_source') || '', utm_medium: params.get('utm_medium') || '', utm_campaign: params.get('utm_campaign') || '',
    referrer: (() => { try { return document.referrer ? new URL(document.referrer).hostname : ''; } catch { return ''; } })(),
    device: matchMedia('(pointer: coarse)').matches || innerWidth < 760 ? 'mobile' : 'desktop',
  };
  // قادم من صفحة خدمة: نحدد مسبقاً جواب "شنو تريد تصلح" (الزائر يؤكده بنفسه)
  const SERVICE_TO_BOTTLENECK: Record<string, Answers['bottleneck']> = {
    'ai-agents': 'replies', automation: 'followup', 'websites-web-apps': 'presence', 'erp-systems': 'admin', 'saas-products': 'orders', branding: 'presence',
  };
  const preBottleneck = SERVICE_TO_BOTTLENECK[params.get('service') || ''];

  /* ----- القياس ----- */
  const post = async (path: string, body: unknown) => {
    const res = await fetch(`${api}/${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), keepalive: true });
    if (!res.ok) throw new Error(String(res.status));
    return res.json().catch(() => ({}));
  };
  /** الخطوات: 0 فتح الصفحة، 1 بعد التحمية/التخطي، 2..10 بعد كل سؤال، 11 النتيجة، 12 ترك الرقم، 13 الواتساب، 14 تحديد الخطة */
  const track = (step: number, extra: Record<string, unknown> = {}) => {
    if (step <= maxStep && !Object.keys(extra).length) return;
    maxStep = Math.max(maxStep, step);
    const body = JSON.stringify({ anon, step, variant, lang, from: source.from, device: source.device, ...extra });
    try {
      if (!navigator.sendBeacon?.(`${api}/event`, new Blob([body], { type: 'application/json' }))) throw 0;
    } catch { fetch(`${api}/event`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {}); }
  };
  track(0);

  /* ----- التنقل بين المراحل ----- */
  function show(name: string) {
    for (const s of screens) s.hidden = s.dataset.screen !== name;
    root.dataset.stage = name;
    const target = root.querySelector<HTMLElement>(`[data-screen="${name}"] [data-focus]`);
    const top = root.getBoundingClientRect().top;
    if (top < 0 || top > innerHeight * 0.5) root.scrollIntoView({ behavior: motionOn() ? 'smooth' : 'auto', block: 'start' });
    target?.focus({ preventScroll: true });
  }

  /* ----- الكوكب من الأجوبة ----- */
  const planetFrom = (a: Answers): Partial<PlanetParams> => {
    const answered = CORE.filter((k) => (k === 'channels' ? a.channels?.length : a[k])).length;
    return {
      form: Math.max(0.04, answered / CORE.length),
      density: a.volume ? { v1: 0.35, v2: 0.55, v3: 0.8, v4: 1 }[a.volume] : 0.45,
      moons: a.channels?.length ?? 0,
      ring: a.team ? { solo: 0, small: 0.4, mid: 0.7, large: 1 }[a.team] : 0,
      glow: a.reply ? { minutes: 1, hour: 0.7, morning: 0.35, late: 0.12 }[a.reply] : 0.4,
      leak: a.vanish ? { few: 0.1, some: 0.35, half: 0.65, most: 1 }[a.vanish] : 0,
      order: a.system ? { paper: 0.1, head: 0, excel: 0.55, wabiz: 0.6, software: 1 }[a.system] : 0.6,
    };
  };
  planet.set(planetFrom(answers));

  /* ----- العنوان: نسخة A/B (السكربت المضمّن بدّلها قبل الرسم؛ هنا فقط نتأكد) ----- */

  /* ----- المقدمة والتحمية ----- */
  $(root, '.lt-rush-btn').addEventListener('click', async () => {
    show('rush');
    rush = await runRush($(root, '.rush-stage'), copy.rush);
    track(1, { rush_played: rush.played, rush_answered: rush.answered, rush_total: rush.total });
    startQuestions();
  });
  $(root, '.lt-skip-btn').addEventListener('click', () => { track(1, { rush_played: false }); startQuestions(); });

  /* ----- الأسئلة ----- */
  const qScreen = $(root, '[data-screen="q"]');
  const qTitle = $(qScreen, '.lt-q'), qHint = $(qScreen, '.lt-hint'), qOpts = $(qScreen, '.lt-opts');
  const qStep = $(qScreen, '.lt-step'), qBar = $<HTMLElement>(qScreen, '.lt-bar i');
  const qBack = $<HTMLButtonElement>(qScreen, '.lt-back'), qNext = $<HTMLButtonElement>(qScreen, '.lt-next');
  qBack.textContent = copy.flow.back; qNext.textContent = copy.flow.next;

  function startQuestions() { qi = 0; renderQ(); show('q'); }
  /** على الموبايل: إذا صار عنوان السؤال تحت الهيدر أو خارج الشاشة نرجعه للأعلى */
  function keepInView() {
    // على الشاشات الضيقة نُبقي الكوكب الصغير ظاهراً فوق السؤال (هو اللحظة المميزة)، وإلا نكتفي بالسؤال
    const narrow = innerWidth < 900, target = narrow ? $<HTMLElement>(root, '.lt-visual') : qScreen;
    const r = qScreen.getBoundingClientRect(), head = 80;
    if (r.top < head || r.bottom > innerHeight + 200 || r.top > innerHeight * 0.6) target.scrollIntoView({ behavior: motionOn() ? 'smooth' : 'auto', block: 'start' });
  }

  function renderQ() {
    const key = CORE[qi] as Key, q = copy.questions[key], multi = key === 'channels';
    qStart = performance.now();
    qStep.textContent = fill(copy.flow.progress, { i: qi + 1, n: CORE.length });
    // شريط سريع ثم بطيء، ويبدأ بتقدّم ممنوح (12%) لأن الزائر بدأ فعلاً
    const p = qi / CORE.length;
    qBar.style.inlineSize = `${12 + 88 * (1 - Math.pow(1 - p, 1.5))}%`;
    qTitle.textContent = q.title;
    qHint.textContent = multi ? copy.flow.multiHint : q.hint || '';
    qHint.hidden = !qHint.textContent;
    qOpts.replaceChildren();
    qOpts.setAttribute('aria-label', q.title);
    if (key === 'bottleneck' && !answers.bottleneck && preBottleneck) answers.bottleneck = preBottleneck;
    for (const opt of OPTIONS[key] as readonly string[]) {
      const b = el('button', 'lt-opt'); b.type = 'button';
      b.textContent = (q.options as Record<string, string>)[opt];
      const cur = answers[key as keyof Answers];
      const on = multi ? (answers.channels as string[] | undefined)?.includes(opt) : cur === opt;
      b.setAttribute('aria-pressed', String(!!on));
      b.addEventListener('click', () => choose(key, opt, b));
      qOpts.append(b);
    }
    qNext.hidden = !multi;
    qNext.disabled = multi && !answers.channels?.length;
  }

  function choose(key: Key, opt: string, b: HTMLButtonElement) {
    if (key === 'channels') {
      const set = new Set(answers.channels ?? []);
      set.has(opt as never) ? set.delete(opt as never) : set.add(opt as never);
      answers.channels = OPTIONS.channels.filter((c) => set.has(c));
      b.setAttribute('aria-pressed', String(set.has(opt as never)));
      qNext.disabled = !answers.channels.length;
      planet.set(planetFrom(answers));
      return;
    }
    (answers as Record<string, string>)[key] = opt;
    for (const x of qOpts.querySelectorAll('button')) x.setAttribute('aria-pressed', String(x === b));
    planet.set(planetFrom(answers));
    setTimeout(advance, motionOn() ? 260 : 0);
  }

  function advance() {
    durations[qi] = Math.round(performance.now() - qStart);
    track(2 + qi);
    if (qi < CORE.length - 1) { qi++; renderQ(); qTitle.focus({ preventScroll: true }); keepInView(); }
    else analyse();
  }
  qNext.addEventListener('click', advance);
  qBack.addEventListener('click', () => {
    if (qi === 0) { show('intro'); return; }
    qi--; renderQ(); qTitle.focus({ preventScroll: true });
  });

  /* ----- التحليل (خطوات حقيقية قصيرة: Labour illusion بصدق) ----- */
  async function analyse() {
    show('analysing');
    const items = [...root.querySelectorAll<HTMLElement>('[data-screen="analysing"] li')];
    items.forEach((li) => li.classList.remove('on'));
    result = compute(answers);
    code = code || resultCode();
    const each = motionOn() ? 750 : 250;
    for (const li of items) { await new Promise((r) => setTimeout(r, each)); li.classList.add('on'); }
    await new Promise((r) => setTimeout(r, motionOn() ? 400 : 100));
    reveal(false);
    // حفظ الجلسة المجهولة (بدون أي بيانات شخصية) حتى نعرف أين يتوقف الناس وماذا يجيبون
    post('session', sessionBody()).then((r) => { if (r?.id && r?.token) session = { id: r.id, token: r.token }; }).catch(() => {});
  }

  const sessionBody = () => ({
    anon, variant, lang, code, answers, durations, rush, source,
    assumptions: override, ms: Math.round(performance.now() - pageStart),
  });

  /* ----- كشف النتيجة الجزئية ----- */
  const vars = (a: Answers) => ({
    industry: a.industry ? copy.short.industry[a.industry] : '',
    volume: a.volume ? copy.short.volume[a.volume] : '',
    reply: a.reply ? copy.short.reply[a.reply] : '',
    vanish: a.vanish ? copy.short.vanish[a.vanish] : '',
    hours: a.hours ? copy.short.hours[a.hours] : '',
    system: a.system ? copy.short.system[a.system] : '',
    bottleneck: a.bottleneck ? copy.short.bottleneck[a.bottleneck] : '',
    team: a.team ? copy.short.team[a.team] : '',
  });
  const cap = (s: string) => (rtl ? s : s.charAt(0).toUpperCase() + s.slice(1));

  function rangeInto(target: HTMLElement, r: Range, money = false) {
    target.replaceChildren();
    // نطاق عددي: كتلة LTR واحدة حتى لا ينقلب ترتيبه في العربية (550 – 900)
    if (!money) { target.append(bdi(`${fmt(r[0])} – ${fmt(r[1])}`)); return; }
    const part = (n: number) => {
      if (!money) return [bdi(fmt(n))];
      const c = copy.currency;
      if (n >= 1e6) { const v = (n / 1e6).toFixed(n >= 1e7 ? 0 : 1).replace(/\.0$/, ''); return rtl ? [bdi(v), ` ${c.million}`] : [bdi(`${v}${c.million}`)]; }
      if (n >= 1e3) { const v = String(Math.round(n / 1e3)); return rtl ? [bdi(v), ` ${c.thousand}`] : [bdi(`${v}${c.thousand}`)]; }
      return [bdi(fmt(n))];
    };
    target.append(...part(r[0]), ' – ', ...part(r[1]));
    if (money) target.append(` ${copy.currency.unit}`);
  }

  function reveal(shared: boolean) {
    if (!result) return;
    const sc = $(root, '[data-screen="reveal"]'), v = vars(answers);
    $(sc, '.lt-arch').textContent = copy.archetypes[result.archetype].name;
    $(sc, '.lt-line').textContent = cap(fill(copy.archetypes[result.archetype].line, v));
    const scoreEl = $(sc, '.lt-score b');
    countUp(scoreEl, result.score);
    rangeInto($(sc, '.lt-lost b'), result.lost);
    $(sc, '.lt-note').textContent = fill(copy.reveal.lostNote, v);
    const rq = $(sc, '.lt-rushq');
    rq.textContent = rush.played ? fill(copy.reveal.rushQuote, { a: rush.answered, t: rush.total }) : '';
    rq.hidden = !rush.played;
    $(sc, '.lt-shared').hidden = !shared;
    $(sc, '.lt-gate').hidden = shared;
    $(sc, '.lt-gate-text').textContent = fill(copy.gate.text, v);
    planet.set({ ...planetFrom(answers), form: 1 });
    show('reveal');
    if (!shared) {
      track(11);
      const enc = encode(answers);
      history.replaceState(null, '', `#r=${enc}`);
      // نتذكر آخر نتيجة لهذا المتصفح: إذا رجع لنفس الرابط يرى نتيجته (وليس ملاحظة "شاركها شخص آخر")
      store.set('nawa-last', enc); store.set('nawa-code', code);
    }
  }

  function countUp(target: HTMLElement, to: number) {
    if (!motionOn()) { target.textContent = String(to); return; }
    const t0 = performance.now(), dur = 900;
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      target.textContent = String(Math.round(to * e));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ----- البوابة: الواتساب مقابل التقرير الكامل ----- */
  const form = $<HTMLFormElement>(root, '.lt-gate');
  const gateStatus = $(form, '.form-status');
  const submitBtn = $<HTMLButtonElement>(form, 'button[type="submit"]');
  const submitLabel = $(submitBtn, '.btn-label');
  const setErr = (name: string, msg: string) => {
    const input = form.elements.namedItem(name) as HTMLInputElement;
    input.setAttribute('aria-invalid', String(!!msg));
    $(form, `#lt-err-${name}`).textContent = msg;
    return !msg;
  };
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = String(fd.get('name') || '').trim(), wa = String(fd.get('whatsapp') || '').replace(/[^\d]/g, '');
    const ok = [
      setErr('name', name.length >= 2 ? '' : copy.gate.errName),
      setErr('whatsapp', wa.length >= 10 && wa.length <= 15 ? '' : copy.gate.errWhatsapp),
      setErr('consent_contact', fd.get('consent_contact') ? '' : copy.gate.errConsent),
    ];
    if (ok.includes(false)) { form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(); return; }
    submitBtn.disabled = true; submitLabel.textContent = copy.gate.sending; gateStatus.textContent = '';
    try {
      const r = await post('lead', {
        ...sessionBody(), session,
        contact: { name, business: String(fd.get('business') || '').trim(), city: String(fd.get('city') || '').trim(), whatsapp: String(fd.get('whatsapp') || '') },
        consent: { contact: !!fd.get('consent_contact'), marketing: !!fd.get('consent_marketing') },
        consent_text: copy.gate.consentContact,
        hp: String(fd.get('website') || ''),
      });
      if (r?.id && r?.token) session = { id: r.id, token: r.token };
      leadSent = true;
      track(12);
      renderReport(true);
    } catch {
      // فشل الحفظ لا يعاقب الزائر: يرى تقريره، ونقترح الواتساب
      renderReport(true, copy.gate.fail);
    } finally {
      submitBtn.disabled = false; submitLabel.textContent = copy.gate.submit;
    }
  });
  $(root, '[data-act="gate-skip"]').addEventListener('click', () => renderReport(false));

  /* ----- التقرير الكامل ----- */
  const rep = $(root, '[data-screen="report"]');
  function renderReport(full: boolean, warning = '') {
    if (!result) return;
    rep.dataset.mode = full ? 'full' : 'lite';
    $(rep, '.lt-warn').textContent = warning;
    $(rep, '.lt-warn').hidden = !warning;
    $(rep, '.lt-code b').replaceChildren(bdi(code));
    if (full) { fillNumbers(); renderAssumptions(); renderForecast(); renderPlan(); }
    renderSharpen();
    renderClose();
    show('report');
  }

  function fillNumbers() {
    if (!result) return;
    rangeInto($(rep, '[data-n="lost"]'), result.lost);
    rangeInto($(rep, '[data-n="recoverable"]'), result.recoverable);
    rangeInto($(rep, '[data-n="hours"]'), result.hoursFree);
    rangeInto($(rep, '[data-n="money"]'), result.money, true);
  }

  function renderAssumptions() {
    const v = $<HTMLInputElement>(rep, '[name="a_value"]'), c = $<HTMLInputElement>(rep, '[name="a_conv"]');
    const d = { ...defaultAssumptions(answers), ...override };
    v.value = String(d.value); c.value = String(Math.round(d.conv * 100));
    $(rep, '.lt-assume-note').textContent = fill(copy.report.assumptions.note, vars(answers));
    const update = () => {
      const val = Number(v.value), cv = Number(c.value) / 100;
      override = { value: val > 0 ? val : undefined, conv: cv > 0 && cv <= 1 ? cv : undefined };
      result = compute(answers, override);
      fillNumbers(); renderForecast();
    };
    v.oninput = update; c.oninput = update;
  }

  function renderForecast() {
    if (!result) return;
    const { current, automated } = result.forecast;
    const W = 640, H = 260, P = { l: 44, r: 20, t: 18, b: 34 };
    const max = Math.max(1, ...automated) * 1.08;
    const x = (i: number) => { const px = P.l + (i / 11) * (W - P.l - P.r); return rtl ? W - px : px; };
    const y = (v: number) => H - P.b - (v / max) * (H - P.t - P.b);
    const line = (arr: number[]) => arr.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
    const area = `${line(automated)} ${[...current].reverse().map((v, i) => `${x(11 - i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')}`;
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('class', 'lt-chart'); svg.setAttribute('role', 'img');
    const gap = automated[11] - current[11];
    svg.setAttribute('aria-label', `${copy.report.forecast.title}. ${copy.report.forecast.current}: ${current[11]}. ${copy.report.forecast.automated}: ${automated[11]}.`);
    const mk = (tag: string, attrs: Record<string, string>) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); svg.append(n); return n; };
    for (const g of [0.25, 0.5, 0.75, 1]) mk('line', { x1: String(P.l), x2: String(W - P.r), y1: String(y(max * g / 1.08)), y2: String(y(max * g / 1.08)), class: 'grid' });
    mk('polygon', { points: area, class: 'gap' });
    mk('polyline', { points: line(current), class: 'cur' });
    mk('polyline', { points: line(automated), class: 'auto' });
    for (const m of [1, 3, 6, 9, 12]) { const t = mk('text', { x: String(x(m - 1)), y: String(H - 10), class: 'ax', 'text-anchor': 'middle' }); t.textContent = String(m); }
    const lab = (arr: number[], cls: string) => { const t = mk('text', { x: String(rtl ? x(11) + 6 : x(11) - 6), y: String(y(arr[11]) - 8), class: cls, 'text-anchor': rtl ? 'start' : 'end' }); t.textContent = fmt(arr[11]); };
    lab(current, 'v cur-v'); lab(automated, 'v auto-v');
    $(rep, '.lt-chart-box').replaceChildren(svg);
    $(rep, '.lt-gap').textContent = gap > 0 ? fill(copy.report.forecast.gap, { n: fmt(gap) }) : '';
  }

  function renderPlan() {
    if (!result) return;
    const ol = $(rep, '.lt-plan'); ol.replaceChildren();
    result.plan.forEach((s, i) => {
      const li = el('li', 'lt-stepc');
      const n = el('span', 'eyebrow', fill(copy.report.stepLabel, { i: i + 1 }));
      const h = el('h3', '', fill(copy.steps[s.key].title, vars(answers)));
      const p = el('p', '', copy.steps[s.key].text);
      const a = el('a', 'tlink'); a.href = copy.paths.services[s.service] || '#';
      a.append(copy.report.more, ' '); const ar = el('span', 'arrow', '→'); ar.setAttribute('aria-hidden', 'true'); a.append(ar);
      li.append(n, h, p, a); ol.append(li);
    });
  }

  function renderSharpen() {
    const box = $(rep, '.lt-sharpen-qs'); box.replaceChildren();
    for (const key of SHARPEN) {
      const q = copy.questions[key];
      const g = el('fieldset', 'lt-sq'); const lg = el('legend', '', q.title); g.append(lg);
      const row = el('div', 'chips');
      for (const opt of OPTIONS[key] as readonly string[]) {
        const b = el('button', 'lt-chip', (q.options as Record<string, string>)[opt]); b.type = 'button';
        b.setAttribute('aria-pressed', String(answers[key] === opt));
        b.addEventListener('click', () => {
          (answers as Record<string, string>)[key] = opt;
          for (const x of row.querySelectorAll('button')) x.setAttribute('aria-pressed', String(x === b));
          saveSharpen();
        });
        row.append(b);
      }
      g.append(row); box.append(g);
    }
  }
  let sharpenTimer = 0;
  function saveSharpen() {
    clearTimeout(sharpenTimer);
    sharpenTimer = window.setTimeout(async () => {
      const s = $(rep, '.lt-saved'); s.textContent = '';
      const sharpen = Object.fromEntries(SHARPEN.filter((k) => answers[k]).map((k) => [k, answers[k]]));
      track(14);
      try {
        if (session) await post('update', { ...session, sharpen });
        else { const r = await post('session', sessionBody()); if (r?.id) session = { id: r.id, token: r.token }; }
        s.textContent = copy.sharpen.saved;
      } catch { /* الحفظ اختياري: لا نزعج الزائر برسالة خطأ */ }
    }, 600);
  }

  function renderClose() {
    if (!result) return;
    const v = vars(answers);
    const msg = fill(copy.close.waMessage, {
      code, archetype: copy.archetypes[result.archetype].name, score: result.score,
      industry: answers.industry ? copy.questions.industry.options[answers.industry] : '',
    });
    const wa = $<HTMLAnchorElement>(rep, '.lt-wa');
    wa.href = whatsappLink(msg);
    wa.onclick = () => { track(13); if (session) post('update', { ...session, whatsapp_clicked: true }).catch(() => {}); };
    $(rep, '.lt-close-text').textContent = fill(copy.close.text, v);
  }

  /* ----- المشاركة ----- */
  const shareUrl = () => `${location.origin}${copy.paths.launch}#r=${encode(answers)}`;
  $(root, '[data-act="share"]').addEventListener('click', async () => {
    if (!result) return;
    const text = fill(copy.close.shareText, { archetype: copy.archetypes[result.archetype].name, score: result.score });
    const status = $(rep, '.lt-share-status');
    try {
      if (navigator.share) { await navigator.share({ title: copy.meta.title, text, url: shareUrl() }); return; }
      await navigator.clipboard.writeText(`${text} ${shareUrl()}`);
      status.textContent = copy.close.copied;
    } catch { /* ألغى الزائر المشاركة */ }
  });
  $(root, '[data-act="card"]').addEventListener('click', async () => {
    if (!result) return;
    const blob = await makeCard({
      render: planet.render, name: copy.archetypes[result.archetype].name, score: result.score,
      scoreLabel: copy.reveal.scoreLabel, eyebrow: copy.reveal.eyebrow, url: `nawa-iq.com${copy.paths.launch}`, rtl,
    });
    if (!blob) return;
    const file = new File([blob], `nawa-orbit-${result.archetype}.png`, { type: 'image/png' });
    try {
      if (navigator.canShare?.({ files: [file] })) { await navigator.share({ files: [file], title: copy.meta.title }); return; }
    } catch { /* المشاركة أُلغيت أو غير مدعومة: ننزّل الملف */ }
    const a = el('a'); a.href = URL.createObjectURL(blob); a.download = file.name; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  });

  /* ----- نتيجة مشاركة من شخص آخر (#r=...) ----- */
  $(root, '.lt-own-btn').addEventListener('click', () => {
    for (const k of Object.keys(answers)) delete (answers as Record<string, unknown>)[k];
    result = null; history.replaceState(null, '', location.pathname + location.search);
    planet.set({ ...planetFrom(answers) });
    show('intro');
  });
  const hash = location.hash.match(/^#r=([0-9a-z]+)$/);
  if (hash) {
    const shared = decode(hash[1]);
    if (shared && isComplete(shared)) {
      Object.assign(answers, shared);
      result = compute(answers);
      reveal(true);
      // نتيجتي أنا (رجعت لنفس الرابط): نعرض البوابة بدل ملاحظة "شاركها شخص آخر"
      if (store.get('nawa-last') === hash[1]) { $(root, '.lt-shared').hidden = true; form.hidden = false; code = store.get('nawa-code') || resultCode(); }
    }
  }
  void leadSent;
}
