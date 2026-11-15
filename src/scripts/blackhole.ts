/**
 * الثقب الأسود (صفحة 404): "هذه الصفحة خرجت من مدارها" — سحبها ثقب أسود.
 * المشهد: قرص تراكم رفيع يمتد على عرض الشاشة، حلقة فوتونات مضيئة حول أفق حدث أسود،
 * و"جناحان" من الضوء المنحني يلتقيان بالقرص (شكل العين).
 * القرص يتموّج بهدوء، وسماكته تزيد قرب الثقب وترقّ نحو الأطراف.
 * التفاعل: الثقب يتبع المؤشر بنابض ناعم. أفقياً: الضوء الذي يتركه خلفه يتمدد كالعجين ويبقى متصلاً به.
 * عمودياً: القرص ينحني في الاتجاه المعاكس ويلتف حول الثقب (مثل صور المرجع)
 * (شكل metaball بين موضع الضوء الأصلي والثقب)، ثم يعود كل شيء لمكانه عند ابتعاد المؤشر.
 * (مستوحى من قالب Gravitas على Framer، مكتوب من الصفر بـ Canvas 2D وبألوان NAWA: أبيض + ذهبي فقط)
 *
 * - يتوقف خارج الشاشة أو عند إخفاء التبويب، وإطار ثابت (الثقب في المركز) عند إيقاف الحركة
 * - المشهد متناظر ولا ينعكس في العربية
 */
import { motionOn, onMotionChange, fitCanvas } from './motion';

const CORE = '255,250,240', GOLD_BRIGHT = '221,194,136', GOLD = '197,164,99';
const SPRING = 26, DAMP = 7.5;   // نابض حركة الثقب: أعلى SPRING = أسرع، أعلى DAMP = ارتداد أقل
const BLOB_SCALE = 5;            // دقة طبقة "العجين" (1/5): أعلى = حواف أنعم

const canvas = document.querySelector<HTMLCanvasElement>('.blackhole');
if (canvas) setup(canvas);

type P = { x: number; y: number };

/**
 * شكل "العجين" بين دائرتين (metaball): يعيد نقاط مسار الجسر الواصل بينهما، أو null إذا كانتا متباعدتين جداً.
 * مبني على طريقة Varun Vachhar المعروفة لرسم metaballs بمنحنيات بيزيه.
 */
function bridge(c1: P, r1: number, c2: P, r2: number, v = 0.55, handle = 2.4) {
  const d = Math.hypot(c2.x - c1.x, c2.y - c1.y);
  if (d > r1 + r2 * 6 || d <= Math.abs(r1 - r2)) return null;
  let u1 = 0, u2 = 0;
  if (d < r1 + r2) {
    u1 = Math.acos((r1 * r1 + d * d - r2 * r2) / (2 * r1 * d));
    u2 = Math.acos((r2 * r2 + d * d - r1 * r1) / (2 * r2 * d));
  }
  const ab = Math.atan2(c2.y - c1.y, c2.x - c1.x);
  const spread = Math.acos((r1 - r2) / d);
  const a1 = ab + u1 + (spread - u1) * v, a2 = ab - u1 - (spread - u1) * v;
  const a3 = ab + Math.PI - u2 - (Math.PI - u2 - spread) * v, a4 = ab - Math.PI + u2 + (Math.PI - u2 - spread) * v;
  const at = (c: P, a: number, r: number): P => ({ x: c.x + Math.cos(a) * r, y: c.y + Math.sin(a) * r });
  const p1 = at(c1, a1, r1), p2 = at(c1, a2, r1), p3 = at(c2, a3, r2), p4 = at(c2, a4, r2);
  const d2 = Math.min(v * handle, Math.hypot(p1.x - p3.x, p1.y - p3.y) / (r1 + r2)) * Math.min(1, (d * 2) / (r1 + r2));
  const h1 = at(p1, a1 - Math.PI / 2, r1 * d2), h2 = at(p2, a2 + Math.PI / 2, r1 * d2);
  const h3 = at(p3, a3 + Math.PI / 2, r2 * d2), h4 = at(p4, a4 - Math.PI / 2, r2 * d2);
  return { p1, p2, p3, p4, h1, h2, h3, h4 };
}

function setup(canvas: HTMLCanvasElement) {
  const host = canvas.parentElement as HTMLElement;
  let ctx: CanvasRenderingContext2D | null = null, w = 0, h = 0;
  let t = 0, raf = 0, last = 0, visible = false;
  // إزاحة الثقب عن المركز (بكسل) وسرعتها، والهدف الذي يتبعه
  let ox = 0, oy = 0, vx = 0, vy = 0, tx = 0, ty = 0;
  let pointerOn = false;
  const blob = document.createElement('canvas'); // طبقة "العجين" منخفضة الدقة
  const haze = document.createElement('canvas'); // طبقة توهج القرص منخفضة الدقة
  // نقاط شريط القرص (تُعاد تهيئتها عند تغيّر العرض): x، y، السماكة، الشدة
  let xs = new Float32Array(0), ys = new Float32Array(0), th = new Float32Array(0), fade = new Float32Array(0);

  function draw() {
    if (!ctx || !w) return;
    const c = ctx;
    const ax = w / 2, ay = h / 2;                              // مركز القرص (موضع الضوء الأصلي)
    const R = Math.min(w * 0.085, h * 0.2);                    // نصف قطر أفق الحدث
    const hx = ax + ox, hy = ay + oy;                          // موضع الثقب الآن
    const breathe = 1 + 0.03 * Math.sin(t * 0.9);              // تنفس خفيف للضوء
    c.clearRect(0, 0, w, h);
    c.globalCompositeOperation = 'lighter';

    // 1) قرص التراكم: خط على عرض الشاشة يتموّج بهدوء، سميك قرب الثقب ويرقّ تدريجياً كلما ابتعد.
    //    عندما يتحرك الثقب للأعلى أو الأسفل ينحني القرص في الاتجاه المعاكس ويلتف حوله (عدسة الجاذبية).
    const sig = R * 2.3;                                       // عرض منطقة الانحناء حول الثقب
    const n = Math.ceil(w / 4) + 1;
    if (xs.length !== n) { xs = new Float32Array(n); ys = new Float32Array(n); th = new Float32Array(n); fade = new Float32Array(n); }
    for (let i = 0; i < n; i++) {
      const x = (i / (n - 1)) * w, d = (x - hx) / sig, g = Math.exp(-d * d);
      const far = Math.min(1, Math.abs(x - hx) / (w * 0.5));   // 0 عند الثقب → 1 عند الطرف البعيد
      // موجة هادئة: موجتان بطيئتان بطولين مختلفين، أوضح بعيداً عن الثقب
      const wave = (Math.sin(x * 0.011 - t * 0.9) * 2.2 + Math.sin(x * 0.0047 + t * 0.55) * 1.6) * (0.35 + 0.65 * (1 - g));
      xs[i] = x;
      ys[i] = ay - oy * g + wave;
      th[i] = 0.7 + R * 0.17 * Math.exp(-(((x - hx) / (R * 3.4)) ** 2)) + R * 0.05 * (1 - far); // السماكة
      fade[i] = Math.pow(1 - far, 1.4);                        // الشدة تخفت نحو الأطراف
    }
    // نرسم الشريط بعدة طبقات (توهج واسع خافت → قلب رفيع ساطع)، كلها بنفس الشكل
    const disc = c.createLinearGradient(0, 0, w, 0);
    const mid = Math.min(0.95, Math.max(0.05, hx / w));
    disc.addColorStop(0, `rgba(${GOLD},0.25)`);
    disc.addColorStop(Math.max(0.01, mid - 0.3), `rgba(${GOLD_BRIGHT},0.8)`);
    disc.addColorStop(mid, `rgba(${CORE},1)`);
    disc.addColorStop(Math.min(0.99, mid + 0.3), `rgba(${GOLD_BRIGHT},0.8)`);
    disc.addColorStop(1, `rgba(${GOLD},0.25)`);
    const band = (g: CanvasRenderingContext2D, k: number) => {
      g.beginPath();
      for (let i = 0; i < n; i++) { const hw = th[i] * k * (0.25 + 0.75 * fade[i]) / 2; i ? g.lineTo(xs[i], ys[i] - hw) : g.moveTo(xs[i], ys[i] - hw); }
      for (let i = n - 1; i >= 0; i--) { const hw = th[i] * k * (0.25 + 0.75 * fade[i]) / 2; g.lineTo(xs[i], ys[i] + hw); }
      g.closePath(); g.fill();
    };
    // طبقات التوهج العريضة على طبقة منخفضة الدقة ثم تُكبَّر: حواف ضبابية ناعمة بدل شريط رمادي حاد
    const gw = Math.ceil(w / BLOB_SCALE), gh = Math.ceil(h / BLOB_SCALE);
    if (haze.width !== gw || haze.height !== gh) { haze.width = gw; haze.height = gh; }
    const hz = haze.getContext('2d')!;
    hz.setTransform(1 / BLOB_SCALE, 0, 0, 1 / BLOB_SCALE, 0, 0);
    hz.clearRect(0, 0, w, h);
    hz.fillStyle = disc;
    hz.globalAlpha = 0.07 * breathe; band(hz, 6);
    hz.globalAlpha = 0.16 * breathe; band(hz, 2.6);
    c.imageSmoothingEnabled = true;
    c.drawImage(haze, 0, 0, w, h);
    // القلب الرفيع الساطع بدقة كاملة
    c.fillStyle = disc;
    c.globalAlpha = 0.5 * breathe; band(c, 1.3);
    c.globalAlpha = breathe; band(c, 0.55);
    c.globalAlpha = 1;

    // 2) الجناحان: الضوء المنحني فوق وتحت الثقب يلتقي بالقرص على الجانبين (شكل العين)
    c.save(); c.translate(hx, hy); c.scale(1.75, 1);
    // يبدأ ساطعاً من المركز (المغطى بالثقب) حتى لا تظهر حلقة رمادية على الأطراف
    const wing = c.createRadialGradient(0, 0, 0, 0, 0, R * 1.45);
    wing.addColorStop(0, `rgba(${CORE},${0.6 * breathe})`);
    wing.addColorStop(0.55, `rgba(${CORE},${0.4 * breathe})`);
    wing.addColorStop(0.75, `rgba(${GOLD_BRIGHT},0.16)`);
    wing.addColorStop(1, `rgba(${GOLD},0)`);
    c.fillStyle = wing; c.beginPath(); c.arc(0, 0, R * 1.45, 0, Math.PI * 2); c.fill();
    c.restore();

    // 3) حلقة الفوتونات: حلقة دائرية ساطعة ملتصقة بالأفق، بيضاء من الداخل وذهبية من الخارج
    const ring = c.createRadialGradient(hx, hy, R * 0.98, hx, hy, R * 1.7);
    ring.addColorStop(0, `rgba(${CORE},1)`);
    ring.addColorStop(0.18, `rgba(${CORE},${0.85 * breathe})`);
    ring.addColorStop(0.45, `rgba(${GOLD_BRIGHT},0.35)`);
    ring.addColorStop(1, `rgba(${GOLD},0)`);
    c.fillStyle = ring; c.beginPath(); c.arc(hx, hy, R * 1.7, 0, Math.PI * 2); c.fill();

    // 4) "العجين": إذا ابتعد الثقب عن المركز، يتمدد الضوء من المركز إليه ويبقى متصلاً
    // يعتمد على الإزاحة الأفقية فقط: الحركة العمودية تحني القرص (أعلاه) بدل أن تسحب الضوء
    const dist = Math.abs(ox);
    const ayA = ay - oy * Math.exp(-(((ax - hx) / sig) ** 2)); // موضع القرص تحت المركز
    if (dist > R * 0.35) {
      const k = Math.min(1, (dist - R * 0.35) / (R * 1.2));   // يظهر تدريجياً مع المسافة
      const rA = Math.min(R * 0.95, dist * 0.38);              // كتلة الضوء المتروكة: تكبر مع المسافة
      const rH = R * 1.18;
      // نرسم الشكل كاملاً (دائرتان + جسر) على طبقة صغيرة بدقة 1/BLOB_SCALE ثم نكبّرها:
      // التكبير يُنعّم الحواف مثل الضوء الحقيقي، والشكل يُرسم كقطعة واحدة بلا خطوط فاصلة.
      const bw = Math.ceil(w / BLOB_SCALE), bh = Math.ceil(h / BLOB_SCALE);
      if (blob.width !== bw || blob.height !== bh) { blob.width = bw; blob.height = bh; }
      const b2 = blob.getContext('2d')!;
      b2.setTransform(1 / BLOB_SCALE, 0, 0, 1 / BLOB_SCALE, 0, 0);
      b2.clearRect(0, 0, w, h);
      const fill = b2.createLinearGradient(ax, 0, hx, 0);
      fill.addColorStop(0, `rgba(${CORE},${0.95 * k})`);
      fill.addColorStop(0.55, `rgba(${CORE},${0.85 * k})`);
      fill.addColorStop(1, `rgba(${GOLD_BRIGHT},${0.9 * k})`);
      b2.fillStyle = fill;
      b2.beginPath(); b2.arc(ax, ayA, rA, 0, Math.PI * 2); b2.fill();
      b2.beginPath(); b2.arc(hx, hy, rH, 0, Math.PI * 2); b2.fill();
      const b = bridge({ x: ax, y: ayA }, rA, { x: hx, y: hy }, rH);
      if (b) {
        b2.beginPath();
        b2.moveTo(b.p1.x, b.p1.y);
        b2.bezierCurveTo(b.h1.x, b.h1.y, b.h3.x, b.h3.y, b.p3.x, b.p3.y);
        b2.lineTo(b.p4.x, b.p4.y);
        b2.bezierCurveTo(b.h4.x, b.h4.y, b.h2.x, b.h2.y, b.p2.x, b.p2.y);
        b2.closePath(); b2.fill();
      }
      c.save();
      c.imageSmoothingEnabled = true;
      c.shadowColor = `rgba(${GOLD},${0.7 * k})`; c.shadowBlur = R * 0.8; // هالة ذهبية واحدة حول الشكل كله
      c.drawImage(blob, 0, 0, w, h);
      c.restore();
    }

    // 5) أفق الحدث: قرص أسود معتم يبتلع كل ما خلفه، بحافة ضوء رفيعة
    c.globalCompositeOperation = 'source-over';
    c.fillStyle = '#000';
    c.beginPath(); c.arc(hx, hy, R, 0, Math.PI * 2); c.fill();
    c.strokeStyle = `rgba(${GOLD_BRIGHT},0.55)`; c.lineWidth = 1.2;
    c.beginPath(); c.arc(hx, hy, R + 0.6, 0, Math.PI * 2); c.stroke();
  }

  // ---------- الحلقة ----------
  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.04, (now - last) / 1000); last = now;
    t += dt;
    // بدون مؤشر: انجراف هادئ جداً حتى يبدو المشهد حياً
    const gx = pointerOn ? tx : Math.sin(t * 0.22) * w * 0.02, gy = pointerOn ? ty : 0;
    vx += ((gx - ox) * SPRING - vx * DAMP) * dt; vy += ((gy - oy) * SPRING - vy * DAMP) * dt;
    ox += vx * dt; oy += vy * dt;
    draw();
  }
  const start = () => { if (!raf && motionOn() && visible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); } };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };
  const still = () => { ox = oy = vx = vy = 0; draw(); };

  const resize = () => {
    const f = fitCanvas(canvas, window.innerWidth < 760 ? 1.25 : 1.5);
    if (f) { w = f.w; h = f.h; ctx = f.ctx; draw(); }
  };

  // ---------- المؤشر: الثقب يتبعه أفقياً بحرية، وعمودياً ضمن حد ----------
  const setTarget = (e: PointerEvent) => {
    if (!motionOn()) return;
    const b = canvas.getBoundingClientRect();
    const px = e.clientX - b.left - w / 2, py = e.clientY - b.top - h / 2;
    tx = Math.max(-w * 0.32, Math.min(w * 0.32, px * 0.7));
    ty = Math.max(-h * 0.24, Math.min(h * 0.24, py * 0.6)); // عمودياً بحرية أقل حتى يبقى الثقب داخل المشهد
    pointerOn = true;
  };
  host.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse' || e.buttons || e.pressure > 0) setTarget(e); });
  host.addEventListener('pointerdown', setTarget);
  const release = () => { pointerOn = false; };
  host.addEventListener('pointerleave', release);
  host.addEventListener('pointerup', (e) => { if (e.pointerType !== 'mouse') release(); });
  host.addEventListener('pointercancel', release);

  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver((es) => { visible = es[0].isIntersecting; visible ? start() : stop(); }).observe(canvas);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  onMotionChange((on) => { if (on) start(); else { stop(); still(); } });
}
