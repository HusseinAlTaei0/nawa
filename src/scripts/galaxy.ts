/**
 * مجرة البكسلات (هيدر صفحة Process): آلاف النقاط البيضاء الصغيرة في مجرة حلزونية تدور ببطء.
 * المعنى: عمل مبعثر (مهام، بيانات، تفاصيل) ينتظم حول قلب واحد ويدور كنظام.
 * التفاعل: النقاط تحت المؤشر "تسخن" إلى الذهبي ثم تبرد ببطء، فيترك المؤشر أثراً ذهبياً يتلاشى.
 * (مستوحاة من Binary Orbits في React Bits Pro، مكتوبة من الصفر بـ Canvas 2D وبألوان NAWA فقط)
 *
 * الأداء: النقاط تُكتب مباشرة في مخزن بكسلات (ImageData) بجمع ضوئي، بدل آلاف أوامر fillRect.
 * - يتوقف خارج الشاشة أو عند إخفاء التبويب، وإطار ثابت واحد عند إيقاف الحركة
 * - اتجاه الدوران لا ينعكس في العربية (قاعدة الهوية)؛ موضع المجرة فقط يتبع اتجاه الصفحة عبر CSS
 */
import { motionOn, onMotionChange, rng } from './motion';

// ---------- الألوان (RGB 0..1) ----------
const WHITE: [number, number, number] = [0.93, 0.93, 0.93];   // نقاط الأذرع: أبيض مائل للرمادي
const CORE: [number, number, number] = [1.0, 0.95, 0.86];     // القلب: أبيض دافئ
const GOLD: [number, number, number] = [0.87, 0.76, 0.53];    // الذهبي الفاتح عند التسخين (#DDC288)

// ---------- شكل المجرة ----------
const ARMS = 2;            // عدد الأذرع
const TWIST = 6.2;         // مقدار التفاف الذراع من القلب إلى الطرف (راديان) ≈ دورة كاملة كما في المرجع
const INCL = 1.05;         // ميل قرص المجرة عن النظر (0 = من فوق، π/2 = من الجانب)
const ROLL = -0.22;        // دوران الإهليلج على الشاشة (مثل المرجع)
const SPIN = 0.045;        // سرعة الدوران (راديان/ثانية) — دوران صلب حتى لا تلتف الأذرع مع الوقت
const HOVER_R = 0.24;       // نصف قطر التسخين كنسبة من نصف قطر المجرة على الشاشة
const COOL = 0.7;          // سرعة التبريد: أقل = أثر ذهبي أطول

const canvas = document.querySelector<HTMLCanvasElement>('.galaxy');
if (canvas) setup(canvas);

function setup(canvas: HTMLCanvasElement) {
  const small = window.innerWidth < 760;
  const N = small ? 5200 : 11000;
  const r = rng(11);

  // خصائص كل نقطة: البعد عن المركز، الزاوية الأولى، ارتفاع بسيط عن القرص، السطوع، اللون الأساسي، الحرارة (0..1)
  const rad = new Float32Array(N), ang = new Float32Array(N), lift = new Float32Array(N);
  const lum = new Float32Array(N), warm = new Float32Array(N), heat = new Float32Array(N), tw = new Float32Array(N);
  const gauss = () => { let u = 0, v = 0; while (!u) u = r(); while (!v) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };

  for (let i = 0; i < N; i++) {
    // ثلاث مجموعات: انتفاخ مركزي (16%)، نجوم منتشرة بين الأذرع تملأ القرص (26%)، والأذرع الحلزونية (58%)
    const kind = r();
    const bulge = kind < 0.16, field = !bulge && kind < 0.42;
    let d: number, a: number;
    if (bulge) {
      d = Math.abs(gauss()) * 0.11;
      a = r() * Math.PI * 2;
    } else if (field) {
      d = 0.1 + Math.sqrt(r()) * 0.92;
      a = r() * Math.PI * 2;
    } else {
      d = 0.07 + Math.pow(r(), 0.9) * 0.93;               // توزيع على طول الذراع
      const arm = Math.floor(r() * ARMS);
      const spread = gauss() * (0.1 + d * 0.22);          // الأذرع تتسع نحو الأطراف
      a = arm * (Math.PI * 2 / ARMS) + d * TWIST + spread;
      d += gauss() * 0.02;
    }
    rad[i] = Math.min(1.05, Math.abs(d));
    ang[i] = a;
    lift[i] = gauss() * 0.02 * (1 - rad[i]);              // سماكة خفيفة للقرص، أكبر قرب القلب
    lum[i] = (bulge ? 0.6 : field ? 0.18 : 0.32) + Math.pow(r(), 3) * 0.75; // قلة من النقاط ساطعة جداً (تلألؤ)
    warm[i] = Math.max(0, 1 - rad[i] / 0.35);             // القلب أدفأ لوناً
    tw[i] = r() * 6.283;
  }

  const ctx = canvas.getContext('2d')!;
  let W = 0, H = 0, img: ImageData | null = null, acc: Float32Array | null = null;
  let t = 0, raf = 0, last = 0, visible = false;
  const pointer = { x: -9999, y: -9999, on: false };
  // موضع كل نقطة على الشاشة (لحساب التسخين بنفس الإحداثيات المرسومة)
  const sx = new Float32Array(N), sy = new Float32Array(N);

  function resize() {
    const b = canvas.getBoundingClientRect();
    // كثافة بكسل منخفضة عمداً: هذا "شكل البكسل" المطلوب، وأخف على المعالج
    const dpr = Math.min(window.devicePixelRatio || 1, small ? 1 : 1.25);
    W = Math.max(1, Math.round(b.width * dpr)); H = Math.max(1, Math.round(b.height * dpr));
    canvas.width = W; canvas.height = H;
    img = ctx.createImageData(W, H);
    acc = new Float32Array(W * H * 3);
    draw(0);
  }

  /** يضيف ضوءاً (لون × شدة) إلى بكسل في المخزن */
  function splat(x: number, y: number, cr: number, cg: number, cb: number, k: number) {
    const xi = x | 0, yi = y | 0;
    if (xi < 0 || yi < 0 || xi >= W || yi >= H) return;
    const o = (yi * W + xi) * 3;
    acc![o] += cr * k; acc![o + 1] += cg * k; acc![o + 2] += cb * k;
  }

  function draw(dt: number) {
    if (!img || !acc) return;
    const cx = W / 2, cy = H / 2;
    const S = Math.min(W * 0.42, (H * 0.44) / Math.cos(INCL)); // نصف قطر المجرة بالبكسل (هامش حتى لا تُقص)
    const ci = Math.cos(INCL), cr = Math.cos(ROLL), sr = Math.sin(ROLL);
    const rot = t * SPIN;
    const hr = S * HOVER_R, hr2 = hr * hr;
    const cool = Math.exp(-dt * COOL);
    acc.fill(0);

    for (let i = 0; i < N; i++) {
      // 1) الموضع: دوران حول المركز ثم إسقاط القرص المائل على الشاشة
      const a = ang[i] + rot, d = rad[i] * S;
      const x0 = Math.cos(a) * d, z0 = Math.sin(a) * d;
      const y0 = z0 * ci + lift[i] * S;
      const x = cx + x0 * cr - y0 * sr, y = cy + x0 * sr + y0 * cr;
      sx[i] = x; sy[i] = y;

      // 2) الحرارة: تسخن تحت المؤشر وتبرد مع الوقت
      let hh = heat[i] * cool;
      if (pointer.on) {
        const dx = x - pointer.x, dy = y - pointer.y, q = dx * dx + dy * dy;
        if (q < hr2) hh = Math.max(hh, 1 - Math.sqrt(q) / hr);
      }
      heat[i] = hh;

      // 3) اللون: أبيض/أبيض دافئ ← ذهبي حسب الحرارة، والسطوع يرتفع مع الحرارة
      const wm = warm[i];
      let R = WHITE[0] + (CORE[0] - WHITE[0]) * wm, G = WHITE[1] + (CORE[1] - WHITE[1]) * wm, B = WHITE[2] + (CORE[2] - WHITE[2]) * wm;
      R += (GOLD[0] - R) * hh; G += (GOLD[1] - G) * hh; B += (GOLD[2] - B) * hh;
      const k = lum[i] * (0.82 + 0.18 * Math.sin(t * 1.7 + tw[i])) * (1 + hh * 2.2);

      // 4) الكتابة: بكسل واحد، والنقاط الساطعة تأخذ صليباً صغيراً (لمعة)
      splat(x, y, R, G, B, k);
      if (k > 0.8) { const s = k * 0.35; splat(x + 1, y, R, G, B, s); splat(x - 1, y, R, G, B, s); splat(x, y + 1, R, G, B, s); splat(x, y - 1, R, G, B, s); }
    }

    // 5) تحويل الضوء المتجمّع إلى بكسلات شفافة الخلفية (حتى تظهر نجوم الموقع خلفها)
    const px = img.data;
    for (let p = 0, o = 0; p < px.length; p += 4, o += 3) {
      const R = acc[o], G = acc[o + 1], B = acc[o + 2];
      const m = R > G ? (R > B ? R : B) : (G > B ? G : B);
      if (m <= 0.002) { px[p + 3] = 0; continue; }
      const al = m > 1 ? 1 : m, inv = 255 / m;
      px[p] = R * inv; px[p + 1] = G * inv; px[p + 2] = B * inv; px[p + 3] = al * 255;
    }
    ctx.putImageData(img, 0, 0);

    // 6) توهج القلب فوق النقاط (طبقة ضوء ناعمة بيضاوية بميل المجرة)
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.translate(cx, cy); ctx.rotate(ROLL); ctx.scale(1, ci);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, S * 0.42);
    g.addColorStop(0, 'rgba(255,246,228,0.55)');
    g.addColorStop(0.25, 'rgba(221,194,136,0.16)');
    g.addColorStop(1, 'rgba(197,164,99,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, S * 0.42, 0, Math.PI * 2); ctx.fill();
    // هالة واسعة خافتة للقرص كله
    const h2 = ctx.createRadialGradient(0, 0, S * 0.2, 0, 0, S * 1.05);
    h2.addColorStop(0, 'rgba(237,237,237,0.05)');
    h2.addColorStop(1, 'rgba(237,237,237,0)');
    ctx.fillStyle = h2; ctx.beginPath(); ctx.arc(0, 0, S * 1.05, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  // ---------- الحلقة ----------
  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    t += dt;
    draw(dt);
  }
  const start = () => { if (!raf && motionOn() && visible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); } };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };

  // ---------- المؤشر ----------
  // نحوّل إحداثيات المؤشر إلى بكسلات الـ canvas (قد تختلف عن بكسلات CSS)
  const setPointer = (e: PointerEvent) => {
    const b = canvas.getBoundingClientRect();
    pointer.x = ((e.clientX - b.left) / b.width) * W; pointer.y = ((e.clientY - b.top) / b.height) * H; pointer.on = true;
  };
  canvas.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse' || e.buttons || e.pressure > 0) setPointer(e); });
  canvas.addEventListener('pointerdown', setPointer);
  const release = () => { pointer.on = false; };
  canvas.addEventListener('pointerleave', release);
  canvas.addEventListener('pointerup', (e) => { if (e.pointerType !== 'mouse') release(); });
  canvas.addEventListener('pointercancel', release);

  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver((es) => { visible = es[0].isIntersecting; visible ? start() : stop(); }).observe(canvas);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  onMotionChange((on) => { if (on) start(); else { stop(); heat.fill(0); draw(0); } });
}
