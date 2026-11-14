/**
 * كوكب الواجهة: كوكب بحلقة مصنوع من نقاط ضوء ذهبية.
 * التفاعل: عندما يقترب المؤشر (أو الإصبع) من الكوكب أو الحلقة تتطاير النجوم بعيداً عنه
 * مثل قطبين متشابهين من المغناطيس، ثم تعود بهدوء إلى مكانها.
 *
 * - يتوقف عن الرسم عندما يخرج من الشاشة أو يُخفى التبويب
 * - عند إيقاف الحركة يرسم إطاراً ثابتاً واحداً
 * - الإضاءة من أعلى اليسار دائماً (لا تنعكس في العربية)، لكن موضع الكوكب ينعكس مع الاتجاه
 */
import { motionOn, onMotionChange, rng, fitCanvas } from './motion';

const GOLD = '#C5A463', GOLD_BRIGHT = '#F0E2BE', GOLD_DEEP = '#8F713D';
const REPEL_FORCE = 9000;  // قوة الدفع (بكسل/ث²) عند مركز المؤشر
const SPRING = 10;         // قوة العودة إلى المكان الأصلي
const DAMPING = 4.2;       // التخميد: أقل = تطاير أطول

const canvas = document.querySelector<HTMLCanvasElement>('.hero-planet');
const host = canvas?.closest<HTMLElement>('.hero');
if (canvas && host) {
  const small = window.innerWidth < 760;
  const NS = small ? 2600 : 5200, NR = small ? 1400 : 2800;
  const r = rng(21), ga = Math.PI * (3 - Math.sqrt(5));
  const sph = new Float32Array(NS * 3), ring = new Float32Array(NR * 3);
  for (let i = 0; i < NS; i++) {
    const y = 1 - ((i + 0.5) / NS) * 2, rad = Math.sqrt(1 - y * y), th = i * ga + r() * 0.25;
    sph[i * 3] = Math.cos(th) * rad; sph[i * 3 + 1] = y; sph[i * 3 + 2] = Math.sin(th) * rad;
  }
  for (let i = 0; i < NR; i++) {
    let rr = 1.5 + r() * 0.78; if (rr > 1.86 && rr < 1.94) rr += 0.1; // فجوة في الحلقة
    const a = r() * Math.PI * 2;
    ring[i * 3] = Math.cos(a) * rr; ring[i * 3 + 1] = (r() - 0.5) * 0.02; ring[i * 3 + 2] = Math.sin(a) * rr;
  }
  // حالة كل نقطة على الشاشة: إزاحة (ox, oy) وسرعة (vx, vy)
  const sState = new Float32Array(NS * 4), rState = new Float32Array(NR * 4);

  let w = 0, h = 0, ctx: CanvasRenderingContext2D | null = null;
  const pointer = { x: 0, y: 0, on: false };
  const rtl = document.documentElement.dir === 'rtl';
  const tilt = 0.42, roll = -0.3, ct = Math.cos(tilt), st = Math.sin(tilt), cr = Math.cos(roll), sr = Math.sin(roll);
  const L = [-0.55, 0.62, 0.56]; // اتجاه الضوء
  let t = 14, nextStar = 6 + Math.random() * 8, starT = -1, starSeed = 1;

  function geometry() {
    const narrow = w < 760;
    const R = narrow ? Math.min(w * 0.2, h * 0.15) : Math.min(w * 0.135, h * 0.25);
    const cx = narrow ? w / 2 : (rtl ? w * 0.29 : w * 0.71), cy = narrow ? h * 0.27 : h * 0.52;
    return { R, cx, cy };
  }

  /** يحرّك النقطة (دفع من المؤشر + نابض العودة) ويعيد موضعها النهائي في out */
  const out = [0, 0];
  function physics(state: Float32Array, k: number, hx: number, hy: number, dt: number, reach: number) {
    let ox = state[k], oy = state[k + 1], vx = state[k + 2], vy = state[k + 3];
    if (pointer.on) {
      const dx = hx + ox - pointer.x, dy = hy + oy - pointer.y, d2 = dx * dx + dy * dy;
      if (d2 < reach * reach) {
        const d = Math.sqrt(d2) || 1, f = (1 - d / reach); const push = f * f * REPEL_FORCE * dt;
        vx += (dx / d) * push; vy += (dy / d) * push;
      }
    }
    if (ox || oy || vx || vy) {
      vx += (-SPRING * ox - DAMPING * vx) * dt; vy += (-SPRING * oy - DAMPING * vy) * dt;
      ox += vx * dt; oy += vy * dt;
      if (Math.abs(ox) < 0.02 && Math.abs(oy) < 0.02 && Math.abs(vx) < 0.4 && Math.abs(vy) < 0.4) { ox = oy = vx = vy = 0; }
      state[k] = ox; state[k + 1] = oy; state[k + 2] = vx; state[k + 3] = vy;
    }
    out[0] = hx + ox; out[1] = hy + oy;
  }

  function draw(dt: number) {
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
    const { R, cx, cy } = geometry();
    const reach = Math.max(90, R * 0.75);
    const rot = t * 0.06;

    const xf = (x: number, y: number, z: number, a: number): [number, number, number] => {
      const ca = Math.cos(a), sa = Math.sin(a);
      const x1 = x * ca + z * sa, z1 = -x * sa + z * ca;
      const y2 = y * ct - z1 * st, z2 = y * st + z1 * ct;
      return [x1 * cr - y2 * sr, x1 * sr + y2 * cr, z2];
    };

    // 1) الحلقة: الجزء الخلفي أولاً، ثم الكرة، ثم الجزء الأمامي
    const ringPass = (front: boolean) => {
      ctx!.fillStyle = GOLD;
      for (let i = 0, k = 0; i < ring.length; i += 3, k += 4) {
        const [x, y, z] = xf(ring[i], ring[i + 1], ring[i + 2], rot * 0.6);
        if ((z >= 0) !== front) continue;
        physics(rState, k, cx + x * R, cy - y * R, front ? dt : dt, reach);
        if (!front && x * x + y * y < 1 && !rState[k] && !rState[k + 1]) continue; // مخفي خلف الكوكب
        ctx!.globalAlpha = front ? 0.62 : 0.3;
        ctx!.fillRect(out[0] - 0.6, out[1] - 0.6, 1.2, 1.2);
      }
    };
    ringPass(false);

    for (let i = 0, k = 0; i < sph.length; i += 3, k += 4) {
      const [x, y, z] = xf(sph[i], sph[i + 1], sph[i + 2], rot);
      physics(sState, k, cx + x * R, cy - y * R, dt, reach);
      if (z < 0 && !sState[k] && !sState[k + 1]) continue; // الوجه الخلفي لا يُرسم إلا إذا كان متطايراً
      const b = Math.max(0, x * L[0] + y * L[1] + z * L[2]);
      ctx.globalAlpha = z < 0 ? 0.12 : 0.07 + 0.93 * Math.pow(b, 1.25);
      ctx.fillStyle = b > 0.78 ? GOLD_BRIGHT : b > 0.3 ? GOLD : GOLD_DEEP;
      const s = 0.9 + 1.1 * b;
      ctx.fillRect(out[0] - s / 2, out[1] - s / 2, s, s);
    }
    ringPass(true);

    // القمر الذهبي
    const [mx, my, mz] = xf(Math.cos(t * 0.2) * 3, 0, Math.sin(t * 0.2) * 3, 0);
    if (!(mz < 0 && mx * mx + my * my < 1)) {
      ctx.globalAlpha = mz < 0 ? 0.55 : 1; ctx.fillStyle = GOLD;
      ctx.beginPath(); ctx.arc(cx + mx * R, cy - my * R, mz < 0 ? 3 : 4.2, 0, Math.PI * 2); ctx.fill();
    }

    // نجمة عابرة واحدة كل 15–30 ثانية
    if (starT >= 0) {
      const p = starT / 1.1;
      if (p >= 1) { starT = -1; nextStar = 15 + Math.random() * 15; }
      else {
        const sr2 = rng(starSeed), x0 = w * (0.08 + 0.4 * sr2()), y0 = h * (0.1 + 0.2 * sr2()), len = Math.min(w, h) * 0.6;
        const dx = Math.cos(0.48), dy = Math.sin(0.48), hx = x0 + dx * len * p, hy = y0 + dy * len * p, tail = 110 * Math.sin(Math.PI * p);
        const g = ctx.createLinearGradient(hx, hy, hx - dx * tail, hy - dy * tail);
        g.addColorStop(0, 'rgba(255,255,255,.95)'); g.addColorStop(0.25, 'rgba(221,194,136,.7)'); g.addColorStop(1, 'rgba(197,164,99,0)');
        ctx.globalAlpha = 1; ctx.strokeStyle = g; ctx.lineWidth = 1.3;
        ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx - dx * tail, hy - dy * tail); ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  }

  let raf = 0, last = performance.now(), visible = true;
  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.04, (now - last) / 1000); last = now;
    t += dt;
    if (starT >= 0) starT += dt; else if ((nextStar -= dt) <= 0) { starT = 0; starSeed = Math.floor(now); }
    draw(dt);
  }
  const start = () => { if (!raf && motionOn() && visible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); } };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };
  const resize = () => { const f = fitCanvas(canvas, small ? 1.25 : 1.5); if (f) { w = f.w; h = f.h; ctx = f.ctx; draw(0); } };

  // المؤشر: نستمع على قسم الـ hero كله حتى يعمل التأثير حتى لو كان المؤشر فوق النص
  const setPointer = (e: PointerEvent) => { const b = canvas.getBoundingClientRect(); pointer.x = e.clientX - b.left; pointer.y = e.clientY - b.top; pointer.on = true; };
  host.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse' || e.buttons || e.pressure > 0) setPointer(e); });
  host.addEventListener('pointerdown', setPointer);
  const release = () => { pointer.on = false; };
  host.addEventListener('pointerleave', release);
  host.addEventListener('pointerup', (e) => { if (e.pointerType !== 'mouse') release(); });
  host.addEventListener('pointercancel', release);

  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver((es) => { visible = es[0].isIntersecting; visible ? start() : stop(); }).observe(canvas);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  onMotionChange((on) => { if (on) start(); else { stop(); sState.fill(0); rState.fill(0); draw(0); } });
  resize();
  start();
}
