/**
 * كوكب الزائر: يُبنى من أجوبته سؤالاً بعد سؤال (لحظة الصفحة المميزة).
 *
 * الفكرة: في البداية غبار ذهبي متناثر. كل جواب يسحب جزءاً من الغبار ليصير كرة،
 * ثم تضيف الأجوبة صفات: الكثافة (عدد الرسائل)، الأقمار (القنوات)، الحلقة (حجم الفريق)،
 * التوهج (سرعة الرد)، الانتظام (النظام الحالي)، والتسرّب (نقاط تنفصل وتبتعد = زبائن يفلتون).
 * هكذا يرى الزائر "مشكلته" قبل أن يقرأها، ويشعر أنه بنى شيئاً (IKEA effect).
 *
 * الأداء والوصول: canvas زخرفي (aria-hidden)، يتوقف خارج الشاشة ومع إخفاء التبويب،
 * إطار ثابت واحد عند إيقاف الحركة، DPR ≤ 1.5 (1.25 للموبايل)، والإضاءة من أعلى اليسار دائماً (لا تنعكس في العربية).
 */
import { motionOn, onMotionChange, rng, fitCanvas } from '../motion';

export interface PlanetParams {
  /** نسبة البناء 0..1 (عدد الأسئلة المجابة / 9) */
  form: number;
  /** كثافة النقاط 0..1 (حجم الرسائل) */
  density: number;
  /** عدد الأقمار 0..7 (القنوات) */
  moons: number;
  /** الحلقة 0..1 (حجم الفريق) */
  ring: number;
  /** التوهج 0..1 (سرعة الرد) */
  glow: number;
  /** التسرّب 0..1 (من يسأل ويختفي) */
  leak: number;
  /** الانتظام 0..1 (ورق = فوضى، نظام = هدوء) */
  order: number;
}

export const EMPTY: PlanetParams = { form: 0, density: 0.45, moons: 0, ring: 0, glow: 0.4, leak: 0, order: 0.6 };

const GOLD = '#C5A463', GOLD_BRIGHT = '#F0E2BE', GOLD_DEEP = '#8F713D', GREY = '#9a9a9a';
const L = [-0.55, 0.62, 0.56]; // اتجاه الضوء (ثابت، لا ينعكس)

interface Scene {
  n: number; sph: Float32Array; dust: Float32Array; seed: Float32Array;
  ringN: number; ring: Float32Array;
}

function buildScene(n: number, ringN: number): Scene {
  const r = rng(77), ga = Math.PI * (3 - Math.sqrt(5));
  const sph = new Float32Array(n * 3), dust = new Float32Array(n * 3), seed = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const y = 1 - ((i + 0.5) / n) * 2, rad = Math.sqrt(1 - y * y), th = i * ga;
    sph[i * 3] = Math.cos(th) * rad; sph[i * 3 + 1] = y; sph[i * 3 + 2] = Math.sin(th) * rad;
    const a = r() * Math.PI * 2, d = 1.3 + r() * 1.3;
    dust[i * 3] = Math.cos(a) * d; dust[i * 3 + 1] = (r() - 0.5) * 1.6; dust[i * 3 + 2] = Math.sin(a) * d;
    seed[i] = r(); // ترتيب انضمام النقطة للكرة + طور الاهتزاز
  }
  const ring = new Float32Array(ringN * 3);
  for (let i = 0; i < ringN; i++) {
    const rr = 1.45 + r() * 0.6, a = r() * Math.PI * 2;
    ring[i * 3] = Math.cos(a) * rr; ring[i * 3 + 1] = (r() - 0.5) * 0.03; ring[i * 3 + 2] = Math.sin(a) * rr;
  }
  return { n, sph, dust, seed, ringN, ring };
}

/** يرسم إطاراً واحداً للكوكب على أي سياق (يُستخدم أيضاً لبطاقة المشاركة) */
export function paint(ctx: CanvasRenderingContext2D, w: number, h: number, sc: Scene, p: PlanetParams, t: number, leakers?: Leaker[]) {
  ctx.clearRect(0, 0, w, h);
  const R = Math.min(w, h) * 0.26, cx = w / 2, cy = h / 2;
  const rot = t * 0.08, tilt = 0.38, ct = Math.cos(tilt), st = Math.sin(tilt);
  const xf = (x: number, y: number, z: number, a: number): [number, number, number] => {
    const ca = Math.cos(a), sa = Math.sin(a);
    const x1 = x * ca + z * sa, z1 = -x * sa + z * ca;
    return [x1, y * ct - z1 * st, y * st + z1 * ct];
  };

  // هالة التوهج (سرعة الرد): ذهب خافت جداً حول الكرة
  if (p.form > 0.2 && p.glow > 0.05) {
    const g = ctx.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * (1.5 + p.glow * 0.5));
    g.addColorStop(0, `rgba(197,164,99,${0.13 * p.glow * p.form})`);
    g.addColorStop(1, 'rgba(197,164,99,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  }

  // الحلقة: الجزء الخلفي، الكرة، ثم الأمامي
  const ringCount = Math.floor(sc.ringN * p.ring * Math.min(1, p.form * 1.5));
  const ringPass = (front: boolean) => {
    ctx.fillStyle = GOLD;
    for (let i = 0; i < ringCount; i++) {
      const [x, y, z] = xf(sc.ring[i * 3], sc.ring[i * 3 + 1], sc.ring[i * 3 + 2], rot * 0.5);
      if ((z >= 0) !== front) continue;
      if (!front && x * x + y * y < 1) continue;
      ctx.globalAlpha = front ? 0.55 : 0.25;
      ctx.fillRect(cx + x * R - 0.6, cy - y * R - 0.6, 1.2, 1.2);
    }
  };
  ringPass(false);

  const visible = Math.floor(sc.n * (0.45 + 0.55 * p.density));
  // البناء أسرع في البداية: أول جوابين يكوّنان شكل الكرة بوضوح
  const fe = 1 - Math.pow(1 - Math.max(0, Math.min(1, p.form)), 1.7);
  const jitter = (1 - p.order) * 0.07;
  for (let i = 0; i < visible; i++) {
    const s = sc.seed[i];
    // انضمام تدريجي: النقطة تنتقل من الغبار إلى الكرة عندما يتجاوز form بذرتها
    const k = Math.max(0, Math.min(1, (fe * 1.25 - s) * 4));
    const e = k * k * (3 - 2 * k);
    const wob = jitter * Math.sin(t * 2.2 + s * 40);
    let x = sc.sph[i * 3] * (1 + wob), y = sc.sph[i * 3 + 1] * (1 + wob), z = sc.sph[i * 3 + 2] * (1 + wob);
    x = sc.dust[i * 3] + (x - sc.dust[i * 3]) * e; y = sc.dust[i * 3 + 1] + (y - sc.dust[i * 3 + 1]) * e; z = sc.dust[i * 3 + 2] + (z - sc.dust[i * 3 + 2]) * e;
    const [X, Y, Z] = xf(x, y, z, rot);
    if (e > 0.95 && Z < 0) continue; // الوجه الخلفي للكرة المكتملة مخفي
    const b = Math.max(0, X * L[0] + Y * L[1] + Z * L[2]);
    if (e < 0.5) { ctx.globalAlpha = 0.3 + 0.35 * s; ctx.fillStyle = s > 0.8 ? GOLD_DEEP : GREY; }
    else {
      ctx.globalAlpha = 0.08 + 0.92 * Math.pow(b, 1.2) * (0.55 + 0.45 * p.glow);
      ctx.fillStyle = b > 0.78 ? GOLD_BRIGHT : b > 0.3 ? GOLD : GOLD_DEEP;
    }
    const size = e < 0.5 ? 1.3 : 1 + 1.2 * b;
    ctx.fillRect(cx + X * R - size / 2, cy - Y * R - size / 2, size, size);
  }
  ringPass(true);

  // الأقمار: واحد لكل قناة، مدارات مختلفة الميل
  const moons = Math.round(p.moons);
  for (let m = 0; m < moons; m++) {
    const a = t * (0.25 + m * 0.04) + m * 1.7, d = 1.7 + (m % 3) * 0.32, inc = (m - 3) * 0.12;
    const [X, Y, Z] = xf(Math.cos(a) * d, Math.sin(a) * d * inc, Math.sin(a) * d, 0);
    if (Z < 0 && X * X + Y * Y < 1) continue;
    ctx.globalAlpha = Z < 0 ? 0.45 : 0.95; ctx.fillStyle = m === 0 ? GOLD : '#ededed';
    ctx.beginPath(); ctx.arc(cx + X * R, cy - Y * R, m === 0 ? 3.4 : 2.4, 0, Math.PI * 2); ctx.fill();
  }

  // التسرّب: نقاط تنفصل عن السطح وتبتعد ببطء ثم تختفي
  if (leakers) {
    ctx.fillStyle = GOLD;
    for (const l of leakers) {
      if (l.life <= 0) continue;
      const d = 1 + (1 - l.life) * 1.4;
      const [X, Y] = xf(l.x * d, l.y * d, l.z * d, rot);
      ctx.globalAlpha = 0.7 * l.life;
      ctx.fillRect(cx + X * R - 0.9, cy - Y * R - 0.9, 1.8, 1.8);
    }
  }
  ctx.globalAlpha = 1;
}

export interface Leaker { x: number; y: number; z: number; life: number }

export function createPlanet(canvas: HTMLCanvasElement) {
  const small = window.innerWidth < 760;
  const scene = buildScene(small ? 1500 : 2600, small ? 450 : 800);
  const target: PlanetParams = { ...EMPTY }, cur: PlanetParams = { ...EMPTY };
  const leakers: Leaker[] = Array.from({ length: 70 }, () => ({ x: 0, y: 0, z: 0, life: 0 }));
  const r = rng(5);
  let w = 0, h = 0, ctx: CanvasRenderingContext2D | null = null, t = 3, raf = 0, last = 0, visible = true, spawn = 0;

  const draw = () => { if (ctx) paint(ctx, w, h, scene, cur, t, motionOn() ? leakers : undefined); };
  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000)); last = now; t += dt;
    // اقتراب ناعم من القيم الجديدة (منحنى أسّي)
    const k = 1 - Math.exp(-dt * 3.2);
    for (const key of Object.keys(cur) as (keyof PlanetParams)[]) cur[key] += (target[key] - cur[key]) * k;
    // تسرّب: عدد النقاط المنفصلة في الثانية يتناسب مع نسبة من يختفي
    spawn += dt * cur.leak * 14 * Math.min(1, cur.form);
    while (spawn >= 1) {
      spawn -= 1;
      const l = leakers.find((x) => x.life <= 0);
      if (l) { const i = Math.floor(r() * scene.n); l.x = scene.sph[i * 3]; l.y = scene.sph[i * 3 + 1]; l.z = scene.sph[i * 3 + 2]; l.life = 1; }
    }
    for (const l of leakers) if (l.life > 0) l.life -= dt * 0.35;
    draw();
  }
  const start = () => { if (!raf && motionOn() && visible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); } };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };
  const resize = () => { const f = fitCanvas(canvas, small ? 1.25 : 1.5); if (f) { w = f.w; h = f.h; ctx = f.ctx; draw(); } };

  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver((es) => { visible = es[0].isIntersecting; visible ? start() : stop(); }).observe(canvas);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  onMotionChange((on) => { if (on) start(); else { stop(); Object.assign(cur, target); draw(); } });
  resize();
  start();

  return {
    set(p: Partial<PlanetParams>) {
      Object.assign(target, p);
      if (!motionOn()) { Object.assign(cur, target); draw(); }
    },
    get params(): PlanetParams { return { ...target }; },
    /** صورة ثابتة للكوكب المكتمل (لبطاقة المشاركة) */
    render(c: CanvasRenderingContext2D, cw: number, ch: number) { paint(c, cw, ch, scene, target, 3.2); },
  };
}
