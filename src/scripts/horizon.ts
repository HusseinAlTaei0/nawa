/**
 * Horizon Bloom: شروق ينكسر فوق الحافة المضيئة لكوكب مظلم، في قسم الختام أسفل كل صفحة.
 * الفكرة: "بداية مشروعك" — الضوء يتصاعد من خلف الكوكب كلما اقترب الزائر من زر التواصل.
 * (مستوحى من Horizon Bloom في React Bits Pro، لكنه مكتوب من الصفر بـ Canvas 2D وبألوان NAWA فقط)
 *
 * طبقات المشهد (من الخلف للأمام):
 *  1) هالة واسعة في السماء فوق الحافة
 *  2) ستارة من خيوط ضوء رفيعة تتصاعد عمودياً على الحافة (مثل الشفق)، أكثف وأطول في الوسط وتتموّج ببطء
 *  3) كتلة توهج ساطعة ملتصقة بالحافة في الوسط
 *  4) الكوكب المعتم + انعكاس خافت للضوء على سطحه تحت الحافة
 *  5) الحافة المضيئة على العرض كله (عدة طبقات = توهج بدون blur مكلف)
 *
 * - المؤشر: الخيوط تحت المؤشر تطول وتسطع وتميل نحوه، ويتلاشى التأثير بهدوء عند خروجه
 * - التقدّم يتبع التمرير (لا scroll-jacking)، والرسم يتوقف خارج الشاشة أو عند إخفاء التبويب
 * - عند إيقاف الحركة يُرسم إطار ثابت واحد (الشروق مكتمل)
 * - المشهد متناظر، فلا يحتاج انعكاساً في العربية
 */
import { motionOn, onMotionChange, fitCanvas, rng } from './motion';

// ألوان الهوية فقط: أبيض دافئ لقلب الضوء، ثم ذهبي فاتح، ذهبي، ذهبي غامق
const CORE = '255,247,230', GOLD_BRIGHT = '221,194,136', GOLD = '197,164,99', GOLD_DEEP = '143,113,61';

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/**
 * خيط ضوء واحد مرسوم مسبقاً مرة واحدة (sprite): ساطع في الأسفل ويتلاشى للأعلى، وحوافه الجانبية ناعمة.
 * رسم صورة جاهزة أسرع بكثير من إنشاء gradient لكل خيط في كل إطار.
 */
function makeStreak(): HTMLCanvasElement {
  const s = document.createElement('canvas');
  s.width = 16; s.height = 256;
  const g = s.getContext('2d')!;
  const v = g.createLinearGradient(0, 256, 0, 0);
  v.addColorStop(0, `rgba(${CORE},1)`);
  v.addColorStop(0.18, `rgba(${GOLD_BRIGHT},0.75)`);
  v.addColorStop(0.55, `rgba(${GOLD},0.28)`);
  v.addColorStop(1, `rgba(${GOLD},0)`);
  g.fillStyle = v; g.fillRect(0, 0, 16, 256);
  // نقصّ الحواف الجانبية بتدرّج أفقي حتى يبدو الخيط ضبابياً لا مستطيلاً
  g.globalCompositeOperation = 'destination-in';
  const hgr = g.createLinearGradient(0, 0, 16, 0);
  hgr.addColorStop(0, 'rgba(0,0,0,0)'); hgr.addColorStop(0.5, 'rgba(0,0,0,1)'); hgr.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = hgr; g.fillRect(0, 0, 16, 256);
  return s;
}

document.querySelectorAll<HTMLCanvasElement>('.horizon-bloom').forEach(setup);

function setup(canvas: HTMLCanvasElement) {
  const host = canvas.parentElement as HTMLElement;
  const streak = makeStreak();
  let w = 0, h = 0, ctx: CanvasRenderingContext2D | null = null;
  let p = 0, t = 0; // p: تقدّم الشروق 0→1 (ناعم)، t: الزمن لتموّج الخيوط
  // المؤشر: px موضعه الأفقي داخل الـ canvas، hp حضوره (0→1 بنعومة) حتى يظهر التأثير ويختفي بهدوء
  let px = 0, hp = 0, pointerIn = false;

  // خيوط الستارة: موضع على الحافة (u من -1 إلى 1)، طول، عرض، سرعة وطور التموّج. ثابتة لكل زيارة (بذرة ثابتة).
  type Ray = { u: number; len: number; wid: number; sp: number; ph: number; a: number };
  let rays: Ray[] = [];
  function buildRays() {
    const r = rng(37), n = w < 760 ? 100 : 220;
    rays = Array.from({ length: n }, () => {
      const k = r() * 2 - 1;
      const u = Math.sign(k) * Math.pow(Math.abs(k), 1.2); // تكثيف قرب الوسط
      return { u, len: 0.3 + r() * 0.7, wid: 2 + r() * 7, sp: 0.25 + r() * 0.6, ph: r() * 6.283, a: 0.35 + r() * 0.65 };
    });
  }

  /** هندسة المشهد: كوكب كبير لا يظهر منه إلا قوس الحافة أسفل القسم */
  function geometry() {
    const R = Math.max(w * 1.3, 620);                 // نصف القطر: انحناء واضح مثل المرجع (~10% من العرض عند الأطراف)
    const limbY = h - clamp(h * 0.22, 100, 220);       // أعلى نقطة في الحافة
    return { R, limbY, cx: w / 2, cy: limbY + R };
  }

  /**
   * تقدّم الشروق حسب التمرير: يبدأ (0) لحظة دخول القسم من أسفل الشاشة،
   * ويستمر بالازدياد حتى آخر بكسل في الصفحة (1). كلما اقترب الزائر من النهاية زاد الضوء وارتفعت الخيوط.
   */
  function scrollTarget() {
    const vh = window.innerHeight, y = window.scrollY;
    const startY = host.getBoundingClientRect().top + y - vh;              // موضع التمرير لحظة ظهور القسم
    const endY = document.documentElement.scrollHeight - vh;                // آخر موضع تمرير ممكن
    return clamp((y - startY) / Math.max(1, endY - startY), 0, 1);
  }

  function draw() {
    if (!ctx || !w) return;
    const c = ctx, { R, limbY, cx, cy } = geometry();
    const I = Math.pow(p, 0.8) * (1 + 0.04 * Math.sin(t * 0.7)); // الشدة تزداد بثبات حتى نهاية الصفحة
    const grow = Math.pow(p, 1.15);               // ارتفاع الخيوط: يتسارع قرب النهاية
    const spread = w * (0.36 + 0.14 * p);          // الستارة تتسع أيضاً مع التمرير
    const maxLen = clamp(h * 0.6, 220, 560);       // أقصى ارتفاع للخيوط عند نهاية الصفحة

    c.clearRect(0, 0, w, h);
    c.globalCompositeOperation = 'lighter'; // الضوء يُجمع فوق بعضه مثل الضوء الحقيقي

    // 1) هالة السماء: واسعة وخافتة، تغطي الأطراف أيضاً
    const sky = c.createRadialGradient(cx, limbY, 0, cx, limbY, w * 0.75);
    sky.addColorStop(0, `rgba(${GOLD},${0.13 * I})`);
    sky.addColorStop(0.45, `rgba(${GOLD_DEEP},${0.07 * I})`);
    sky.addColorStop(1, `rgba(${GOLD_DEEP},0)`);
    c.fillStyle = sky; c.fillRect(0, 0, w, h);

    // 2) ستارة الخيوط: كل خيط يخرج عمودياً على الحافة، وطوله يتموّج ببطء
    for (const ray of rays) {
      const x = cx + ray.u * spread;
      const dx = x - cx; if (Math.abs(dx) >= R) continue;
      const yb = cy - Math.sqrt(R * R - dx * dx);           // نقطة الحافة تحت الخيط
      const env = Math.exp(-ray.u * ray.u * 1.5);            // أقوى في الوسط، وتمتد لنحو نصف العرض
      const wave = 0.72 + 0.28 * Math.sin(t * ray.sp + ray.ph);
      // تأثير المؤشر: الخيوط القريبة منه أفقياً تطول وتسطع وتميل نحوه قليلاً (يعمل حتى قبل اكتمال الشروق)
      const b = hp * Math.exp(-(((x - px) / (w * 0.075)) ** 2));
      const len = maxLen * ray.len * wave * (env * grow + 0.5 * b);
      if (len < 3) continue;
      const lean = b * 0.14 * Math.tanh((px - x) / (w * 0.04));
      const ang = Math.atan2(dx, R) + lean;                  // ميل الخيط مع انحناء الحافة + انجذاب للمؤشر
      c.globalAlpha = Math.min(1, 0.42 * ray.a * (0.55 + 0.45 * wave) * (env * I + 0.75 * b));
      c.save(); c.translate(x, yb + 2); c.rotate(ang);
      c.drawImage(streak, -ray.wid / 2, -len, ray.wid, len);
      c.restore();
    }
    c.globalAlpha = 1;

    // 3) كتلة التوهج الساطعة الملتصقة بالحافة في الوسط (بيضاوية مسطّحة)
    c.save(); c.translate(cx, limbY); c.scale(1, 0.24);
    const core = c.createRadialGradient(0, 0, 0, 0, 0, w * 0.34);
    core.addColorStop(0, `rgba(${CORE},${0.95 * I})`);
    core.addColorStop(0.28, `rgba(${GOLD_BRIGHT},${0.5 * I})`);
    core.addColorStop(0.6, `rgba(${GOLD},${0.14 * I})`);
    core.addColorStop(1, `rgba(${GOLD},0)`);
    c.fillStyle = core; c.beginPath(); c.arc(0, 0, w * 0.34, 0, Math.PI * 2); c.fill();
    c.restore();

    // 4) الكوكب المعتم: يحجب النجوم والضوء خلفه
    c.globalCompositeOperation = 'source-over';
    const body = c.createLinearGradient(0, limbY, 0, h);
    body.addColorStop(0, '#0c0c0c'); body.addColorStop(1, '#060606');
    c.fillStyle = body;
    c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.fill();

    // انعكاس خافت للضوء على سطح الكوكب تحت الحافة مباشرة
    c.globalCompositeOperation = 'lighter';
    c.save(); c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.clip();
    c.translate(cx, limbY); c.scale(1, 0.18);
    const refl = c.createRadialGradient(0, 0, 0, 0, 0, w * 0.4);
    refl.addColorStop(0, `rgba(${CORE},${0.22 * I})`);
    refl.addColorStop(0.35, `rgba(${GOLD_DEEP},${0.1 * I})`);
    refl.addColorStop(1, `rgba(${GOLD_DEEP},0)`);
    c.fillStyle = refl; c.beginPath(); c.arc(0, 0, w * 0.4, 0, Math.PI * 2); c.fill();
    c.restore();

    // 5) الحافة المضيئة: ساطعة في الوسط وتبقى واضحة حتى الأطراف (كما في المرجع)
    const rimI = 0.2 + 0.8 * I; // حافة خافتة حتى قبل الشروق
    const rim = c.createLinearGradient(0, 0, w, 0);
    rim.addColorStop(0, `rgba(${GOLD},0.4)`);
    rim.addColorStop(0.25, `rgba(${GOLD_BRIGHT},0.6)`);
    rim.addColorStop(0.5, `rgba(${CORE},1)`);
    rim.addColorStop(0.75, `rgba(${GOLD_BRIGHT},0.6)`);
    rim.addColorStop(1, `rgba(${GOLD},0.4)`);
    const span = Math.asin(Math.min(1, (w * 0.55) / R));
    c.strokeStyle = rim;
    for (const [lw, a] of [[40, 0.035], [16, 0.08], [6, 0.22], [2.2, 0.6], [1, 1]] as const) {
      c.globalAlpha = a * rimI; c.lineWidth = lw;
      c.beginPath(); c.arc(cx, cy, R, -Math.PI / 2 - span, -Math.PI / 2 + span); c.stroke();
    }
    c.globalAlpha = 1;
    c.globalCompositeOperation = 'source-over';
  }

  // ---------- الحلقة والتحكم ----------
  let raf = 0, last = 0, visible = false;
  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    t += dt;
    p += (scrollTarget() - p) * Math.min(1, dt * 2.6); // تتبّع ناعم للتمرير
    hp += ((pointerIn ? 1 : 0) - hp) * Math.min(1, dt * 3);  // ظهور/اختفاء ناعم لتأثير المؤشر
    draw();
  }
  const start = () => { if (!raf && motionOn() && visible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); } };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };
  const still = () => { p = 1; t = 0; draw(); }; // الإطار الثابت: شروق مكتمل

  const resize = () => {
    const f = fitCanvas(canvas, window.innerWidth < 760 ? 1.25 : 1.5);
    if (!f) return;
    const narrowChanged = (w < 760) !== (f.w < 760) || !rays.length;
    w = f.w; h = f.h; ctx = f.ctx;
    if (narrowChanged) buildRays(); // عدد خيوط أقل على الموبايل
    if (motionOn()) { p = scrollTarget(); draw(); } else still();
  };

  // المؤشر على القسم كله (الـ canvas نفسه لا يستقبل أحداثاً حتى لا يحجب الأزرار)
  const setPointer = (e: PointerEvent) => { px = e.clientX - canvas.getBoundingClientRect().left; pointerIn = true; };
  host.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse' || e.buttons || e.pressure > 0) setPointer(e); });
  host.addEventListener('pointerdown', setPointer);
  host.addEventListener('pointerleave', () => { pointerIn = false; });
  host.addEventListener('pointerup', (e) => { if (e.pointerType !== 'mouse') pointerIn = false; });
  host.addEventListener('pointercancel', () => { pointerIn = false; });

  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver((es) => { visible = es[0].isIntersecting; visible ? start() : stop(); }, { rootMargin: '80px 0px' }).observe(canvas);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  onMotionChange((on) => { if (on) start(); else { stop(); still(); } });
}
