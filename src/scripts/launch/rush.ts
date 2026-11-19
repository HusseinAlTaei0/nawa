/**
 * "ساعة الذروة": تحمية مدتها 6 ثواني قبل الأسئلة (اختيارية دائماً، زر التخطي ظاهر).
 *
 * - 12 رسالة زبون بلهجة الزائر تصل أسرع فأسرع (من رسالة كل 0.9 ث إلى رسالة كل 0.3 ث)
 * - الرد: ضغطة على الفقاعة، أو Enter/Space يرد على أقدم رسالة. كل رد "يُكتب" 0.55 ث (مثل الحقيقة)، فلا أحد يلحق على الكل
 * - الرسالة التي لا يُرد عليها خلال 1.6 ث تسقط في بئر جاذبية أسفل المسرح (Canvas 2D رمادي بحافة ذهبية)
 * - عند 6 ث: ملخص + إعادة سريعة (~1 ث) "نفس الـ 6 ثواني مع وكيل نوى": كل الرسائل يُرد عليها بالذهبي
 * - بدون حركة: لوحة ثابتة (قبل/بعد) بنفس الرسالة وزر متابعة
 *
 * الفقاعات عناصر DOM حقيقية (أزرار) حتى يعمل تشكيل العربي وقارئ الشاشة، والـ canvas زخرفي فقط.
 */
import { motionOn, fitCanvas, rng } from '../motion';

export interface RushCopy {
  label: string; messages: string[]; reply: string; replied: string; typing: string; counter: string; time: string;
  summary: string; agent: string; agentTag: string; staticTitle: string; staticText: string; next: string;
}
export interface RushResult { played: boolean; answered: number; total: number }

const GAME_MS = 6000, LIFE_MS = 1600, TYPE_MS = 550;
/** أوقات وصول الرسائل (ث): الفواصل تقصر من 0.9 إلى 0.3 */
const ARRIVALS = [0, 0.85, 1.6, 2.25, 2.8, 3.3, 3.75, 4.15, 4.5, 4.8, 5.1, 5.4];

const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ''));
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export async function runRush(stage: HTMLElement, copy: RushCopy): Promise<RushResult> {
  const total = Math.min(copy.messages.length, ARRIVALS.length);
  const list = stage.querySelector<HTMLElement>('.rush-list')!;
  const hud = stage.querySelector<HTMLElement>('.rush-count')!;
  const timer = stage.querySelector<HTMLElement>('.rush-time')!;
  const live = stage.querySelector<HTMLElement>('.rush-live')!;
  const well = stage.querySelector<HTMLCanvasElement>('.rush-well')!;
  list.replaceChildren();

  // بدون حركة: لوحة ثابتة ونفس الفكرة، والزائر يكمل بنفسه
  if (!motionOn()) {
    stage.classList.add('static');
    const box = document.createElement('div'); box.className = 'rush-static';
    const h = document.createElement('h2'); h.textContent = copy.staticTitle;
    const p = document.createElement('p'); p.textContent = copy.staticText;
    const b = document.createElement('button'); b.type = 'button'; b.className = 'lt-next'; b.textContent = copy.next;
    box.append(h, p, b); list.append(box);
    b.focus();
    await new Promise<void>((r) => b.addEventListener('click', () => r(), { once: true }));
    return { played: false, answered: 0, total };
  }

  stage.classList.remove('static', 'done');
  const r = rng(Date.now() & 0xffff);
  const wellFx = startWell(well);
  let answered = 0, typingUntil = 0, missed = 0;
  const active: HTMLButtonElement[] = [];
  // 8 خانات (عمودان × 4 صفوف): كل فقاعة تأخذ خانة فارغة عشوائية فلا تتراكب الفقاعات
  const slots = Array.from({ length: 8 }, (_, i) => ({ col: i % 2, row: Math.floor(i / 2), busy: false }));
  const t0 = performance.now();
  hud.textContent = fill(copy.counter, { a: 0, t: total });

  const reply = (b: HTMLButtonElement) => {
    const now = performance.now();
    if (b.dataset.state !== 'wait' || now < typingUntil) { b.classList.add('nudge'); setTimeout(() => b.classList.remove('nudge'), 250); return; }
    typingUntil = now + TYPE_MS;
    b.dataset.state = 'typing';
    b.querySelector('.rb-state')!.textContent = copy.typing;
    active.splice(active.indexOf(b), 1);
    setTimeout(() => {
      b.dataset.state = 'done';
      b.querySelector('.rb-state')!.textContent = copy.replied;
      answered++;
      hud.textContent = fill(copy.counter, { a: answered, t: total });
      setTimeout(() => b.remove(), 500);
    }, TYPE_MS);
  };

  const spawn = (i: number) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'rbubble'; b.dataset.state = 'wait';
    b.setAttribute('aria-label', `${copy.reply}: ${copy.messages[i]}`);
    const msg = document.createElement('span'); msg.className = 'rb-msg'; msg.textContent = copy.messages[i];
    const st = document.createElement('span'); st.className = 'rb-state'; st.setAttribute('aria-hidden', 'true');
    b.append(msg, st);
    const free = slots.filter((s) => !s.busy);
    const slot = free.length ? free[Math.floor(r() * free.length)] : slots[Math.floor(r() * slots.length)];
    slot.busy = true;
    b.dataset.slot = String(slots.indexOf(slot));
    b.style.insetInlineStart = `${3 + slot.col * 48 + r() * 8}%`;
    b.style.insetBlockStart = `${slot.row * 25 + r() * 4}%`;
    b.addEventListener('click', () => reply(b));
    const release = () => { slot.busy = false; };
    b.addEventListener('transitionend', (e) => { if (e.propertyName === 'opacity' && b.dataset.state !== 'wait' && b.dataset.state !== 'typing') release(); });
    setTimeout(release, LIFE_MS + TYPE_MS + 700);
    list.append(b); active.push(b);
    requestAnimationFrame(() => b.classList.add('in'));
    setTimeout(() => {
      if (b.dataset.state !== 'wait') return;
      fall(b);
    }, LIFE_MS);
  };

  const fall = (b: HTMLButtonElement) => {
    b.dataset.state = 'lost'; missed++;
    const i = active.indexOf(b); if (i >= 0) active.splice(i, 1);
    b.disabled = true;
    // تسقط نحو مركز البئر (أسفل المنتصف)
    const sr = stage.getBoundingClientRect(), br = b.getBoundingClientRect();
    const dx = sr.left + sr.width / 2 - (br.left + br.width / 2), dy = sr.bottom - 30 - (br.top + br.height / 2);
    b.style.transform = `translate(${dx}px, ${dy}px) scale(0.15)`;
    b.classList.add('falling');
    wellFx.pulse();
    setTimeout(() => b.remove(), 650);
  };

  // لوحة المفاتيح: Enter/Space على المسرح = رد على أقدم رسالة
  const onKey = (e: KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !(e.target instanceof HTMLButtonElement && e.target.classList.contains('rbubble'))) {
      e.preventDefault(); const b = active[0]; if (b) reply(b);
    }
  };
  stage.addEventListener('keydown', onKey);
  stage.focus({ preventScroll: true });

  const timers = ARRIVALS.slice(0, total).map((s, i) => setTimeout(() => spawn(i), s * 1000));
  const tick = setInterval(() => {
    const left = Math.max(0, GAME_MS - (performance.now() - t0));
    timer.textContent = fill(copy.time, { s: (left / 1000).toFixed(1) });
  }, 100);
  await wait(GAME_MS);
  clearInterval(tick); timers.forEach(clearTimeout);
  timer.textContent = fill(copy.time, { s: '0.0' });
  stage.removeEventListener('keydown', onKey);
  // ما تبقى على الشاشة لم يُرد عليه: يسقط
  [...active].forEach(fall);
  await wait(450);

  // الملخص + الإعادة مع الوكيل
  stage.classList.add('done');
  list.replaceChildren();
  const sum = document.createElement('p'); sum.className = 'rush-sum'; sum.textContent = fill(copy.summary, { a: answered, t: total });
  const ag = document.createElement('p'); ag.className = 'rush-agent'; ag.textContent = fill(copy.agent, { t: total });
  const col = document.createElement('div'); col.className = 'rush-replay';
  list.append(sum, col, ag);
  live.textContent = `${sum.textContent} ${ag.textContent}`;
  copy.messages.slice(0, total).forEach((m, i) => {
    setTimeout(() => {
      const row = document.createElement('div'); row.className = 'rr';
      const q = document.createElement('span'); q.className = 'rr-q'; q.textContent = m;
      const a = document.createElement('span'); a.className = 'rr-a'; a.textContent = copy.agentTag;
      row.append(q, a); col.append(row);
      requestAnimationFrame(() => row.classList.add('in'));
    }, i * 70);
  });
  await wait(total * 70 + 1500);
  wellFx.stop();
  void missed;
  return { played: true, answered, total };
}

/** بئر الجاذبية: دوامة نقاط رمادية بحافة ذهبية، تومض عند سقوط رسالة */
function startWell(canvas: HTMLCanvasElement) {
  const f = fitCanvas(canvas, window.innerWidth < 760 ? 1.25 : 1.5);
  if (!f) return { pulse() {}, stop() {} };
  const { ctx, w, h } = f;
  const r = rng(9), N = 260;
  const pts = Array.from({ length: N }, () => ({ a: r() * Math.PI * 2, d: 0.15 + r() * 0.85, s: 0.4 + r() * 0.8 }));
  let flash = 0, raf = 0, last = performance.now();
  const cx = w / 2, cy = h - 28, RX = Math.min(w * 0.36, 260), RY = 22;
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    ctx.clearRect(0, 0, w, h);
    for (const p of pts) {
      p.a += dt * p.s * (1.6 / p.d); p.d -= dt * 0.06; if (p.d < 0.08) p.d = 1;
      ctx.globalAlpha = 0.15 + 0.5 * (1 - p.d);
      ctx.fillStyle = '#9a9a9a';
      ctx.fillRect(cx + Math.cos(p.a) * RX * p.d, cy + Math.sin(p.a) * RY * p.d, 1.3, 1.3);
    }
    flash = Math.max(0, flash - dt * 2.5);
    ctx.globalAlpha = 0.35 + 0.65 * flash;
    ctx.strokeStyle = '#C5A463'; ctx.lineWidth = 1 + flash * 1.5;
    ctx.beginPath(); ctx.ellipse(cx, cy, RX, RY, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.globalAlpha = 1;
  };
  raf = requestAnimationFrame(frame);
  return {
    pulse() { flash = 1; },
    stop() { cancelAnimationFrame(raf); ctx.clearRect(0, 0, w, h); },
  };
}
