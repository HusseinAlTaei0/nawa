/**
 * Horizon Bloom: شروق يطلع من خلف حافة كوكب مظلم، في قسم الختام أسفل كل صفحة.
 * الفكرة: "بداية مشروعك" — الضوء يكسر حافة الكوكب كلما اقترب الزائر من زر التواصل.
 * (مستوحى من فكرة Horizon Bloom في React Bits Pro، لكنه مكتوب من الصفر بـ Canvas 2D وبألوان NAWA فقط)
 *
 * - الشمس ترتفع حسب موضع القسم في الشاشة (تمرير طبيعي، لا scroll-jacking)
 * - يتوقف عن الرسم خارج الشاشة أو عند إخفاء التبويب
 * - عند إيقاف الحركة يُرسم إطار ثابت واحد (الشروق مكتمل)
 * - المشهد متناظر، فلا يحتاج انعكاساً في العربية
 */
import { motionOn, onMotionChange, fitCanvas } from './motion';

// ألوان الهوية فقط (ذهبي / ذهبي غامق / ذهبي فاتح / أبيض دافئ لقلب الشمس)
const GOLD = '197,164,99', GOLD_DEEP = '143,113,61', GOLD_BRIGHT = '221,194,136', CORE = '255,248,232';
const RAYS = 9; // عدد أشعة الضوء فوق الأفق

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

document.querySelectorAll<HTMLCanvasElement>('.horizon-bloom').forEach(setup);

function setup(canvas: HTMLCanvasElement) {
  const host = canvas.parentElement as HTMLElement;
  let w = 0, h = 0, ctx: CanvasRenderingContext2D | null = null;
  let p = 0, t = 0; // p: تقدّم الشروق 0→1 (ناعم)، t: الزمن لحركة التنفس والأشعة

  // لكل شعاع زاوية وطول وعرض ثابتة (قيم محددة حتى يبقى الشكل نفسه في كل زيارة)
  const rays = Array.from({ length: RAYS }, (_, i) => {
    const s = Math.sin(i * 12.9898) * 43758.5453, f = s - Math.floor(s);
    return { a: ((i / (RAYS - 1)) * 2 - 1) * 1.25, len: 0.55 + f * 0.45, wid: 0.018 + f * 0.03, ph: f * 6.28 };
  });

  /** هندسة المشهد: كوكب كبير جداً لا يظهر منه إلا قوس الحافة أسفل القسم */
  function geometry() {
    const R = Math.max(w * 1.55, 680);                 // نصف قطر الكوكب: أكبر = انحناء أهدأ
    const limbY = h - clamp(h * 0.2, 90, 200);          // أعلى نقطة في حافة الكوكب
    const sunR = clamp(w * 0.026, 13, 32);              // نصف قطر قرص الشمس
    return { R, limbY, cx: w / 2, cy: limbY + R, sunR };
  }

  /** تقدّم الشروق حسب التمرير: يبدأ حين يدخل القسم من الأسفل ويكتمل حين يظهر كاملاً */
  function scrollTarget() {
    const r = host.getBoundingClientRect(), vh = window.innerHeight;
    return clamp((vh - r.top) / Math.max(1, Math.min(r.height, vh)), 0, 1);
  }

  function draw() {
    if (!ctx || !w) return;
    const c = ctx, { R, limbY, cx, cy, sunR } = geometry();
    const e = easeOut(p);
    const I = e * (1 + 0.05 * Math.sin(t * 0.8)); // شدة الضوء مع "تنفس" خفيف
    const sunY = limbY + sunR * 1.6 - e * sunR * 1.9; // من مخفية تماماً إلى قمة القرص فوق الحافة

    c.clearRect(0, 0, w, h);
    c.globalCompositeOperation = 'lighter'; // الضوء يُجمع فوق بعضه مثل الضوء الحقيقي

    // 1) توهج السماء فوق الأفق
    const wash = c.createRadialGradient(cx, limbY, 0, cx, limbY, w * (0.42 + 0.22 * e));
    wash.addColorStop(0, `rgba(${GOLD},${0.17 * I})`);
    wash.addColorStop(0.4, `rgba(${GOLD_DEEP},${0.07 * I})`);
    wash.addColorStop(1, `rgba(${GOLD_DEEP},0)`);
    c.fillStyle = wash; c.fillRect(0, 0, w, h); // كامل الارتفاع: الكوكب يغطي الجزء السفلي، فلا يظهر خط قص

    // 2) أشعة ناعمة تنفتح من الشمس إلى الأعلى وتتمايل ببطء
    for (const ray of rays) {
      const a = -Math.PI / 2 + ray.a + 0.035 * Math.sin(t * 0.25 + ray.ph);
      const L = h * 0.95 * ray.len * e, half = ray.wid * (1 + 0.25 * Math.sin(t * 0.4 + ray.ph));
      if (L < 2) continue;
      const ex = cx + Math.cos(a) * L, ey = sunY + Math.sin(a) * L;
      const g = c.createLinearGradient(cx, sunY, ex, ey);
      g.addColorStop(0, `rgba(${GOLD_BRIGHT},${0.075 * I})`); // خافتة عمداً: الذهبي ≤ 5% من الشاشة
      g.addColorStop(1, `rgba(${GOLD_BRIGHT},0)`);
      c.fillStyle = g;
      c.beginPath(); c.moveTo(cx, sunY);
      c.lineTo(cx + Math.cos(a - half) * L, sunY + Math.sin(a - half) * L);
      c.lineTo(cx + Math.cos(a + half) * L, sunY + Math.sin(a + half) * L);
      c.closePath(); c.fill();
    }

    // 3) قرص الشمس وهالتها (الجزء السفلي سيغطيه الكوكب في الخطوة التالية)
    const sun = c.createRadialGradient(cx, sunY, 0, cx, sunY, sunR * 4.5);
    sun.addColorStop(0, `rgba(${CORE},${e})`);
    sun.addColorStop(0.14, `rgba(${CORE},${0.9 * e})`);
    sun.addColorStop(0.22, `rgba(${GOLD_BRIGHT},${0.45 * e})`);
    sun.addColorStop(0.5, `rgba(${GOLD},${0.12 * e})`);
    sun.addColorStop(1, `rgba(${GOLD},0)`);
    c.fillStyle = sun; c.beginPath(); c.arc(cx, sunY, sunR * 4.5, 0, Math.PI * 2); c.fill();

    // 4) الكوكب: جسم معتم يحجب النجوم والشمس خلفه
    c.globalCompositeOperation = 'source-over';
    c.fillStyle = '#070707';
    c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.fill();

    // 5) ضوء الغلاف الجوي ينتشر على الجانب المظلم قرب الحافة
    c.globalCompositeOperation = 'lighter';
    const scatter = c.createRadialGradient(cx, limbY, 0, cx, limbY, w * 0.32);
    scatter.addColorStop(0, `rgba(${GOLD_DEEP},${0.16 * I})`);
    scatter.addColorStop(1, `rgba(${GOLD_DEEP},0)`);
    c.save(); c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.clip();
    c.fillStyle = scatter; c.fillRect(0, limbY - 2, w, h - limbY + 2);
    c.restore();

    // 6) حافة الكوكب المضيئة: أقوى عند الشمس وتخفت نحو الأطراف (عدة طبقات = توهج بدون blur مكلف)
    const rimI = 0.18 + 0.82 * I; // حافة خافتة حتى قبل الشروق
    const rim = c.createLinearGradient(0, 0, w, 0);
    rim.addColorStop(0, `rgba(${GOLD},0)`);
    rim.addColorStop(0.2, `rgba(${GOLD},0.22)`);
    rim.addColorStop(0.43, `rgba(${GOLD_BRIGHT},0.7)`);
    rim.addColorStop(0.5, `rgba(${CORE},1)`);
    rim.addColorStop(0.57, `rgba(${GOLD_BRIGHT},0.7)`);
    rim.addColorStop(0.8, `rgba(${GOLD},0.22)`);
    rim.addColorStop(1, `rgba(${GOLD},0)`);
    const span = Math.asin(Math.min(1, (w * 0.62) / R));
    c.strokeStyle = rim;
    for (const [lw, a] of [[24, 0.04], [10, 0.1], [3.5, 0.35], [1.2, 0.95]] as const) {
      c.globalAlpha = a * rimI; c.lineWidth = lw;
      c.beginPath(); c.arc(cx, cy, R, -Math.PI / 2 - span, -Math.PI / 2 + span); c.stroke();
    }
    c.globalAlpha = 1;

    // 7) وهج أفقي رفيع على خط الأفق (anamorphic flare)
    c.save(); c.translate(cx, limbY); c.scale(1, 0.035);
    const flare = c.createRadialGradient(0, 0, 0, 0, 0, w * 0.42);
    flare.addColorStop(0, `rgba(${CORE},${0.5 * I})`);
    flare.addColorStop(0.25, `rgba(${GOLD_BRIGHT},${0.16 * I})`);
    flare.addColorStop(1, `rgba(${GOLD},0)`);
    c.fillStyle = flare; c.beginPath(); c.arc(0, 0, w * 0.42, 0, Math.PI * 2); c.fill();
    c.restore();

    c.globalCompositeOperation = 'source-over';
  }

  // ---------- الحلقة والتحكم ----------
  let raf = 0, last = 0, visible = false;
  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    t += dt;
    p += (scrollTarget() - p) * Math.min(1, dt * 2.6); // تتبّع ناعم للتمرير
    draw();
  }
  const start = () => { if (!raf && motionOn() && visible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); } };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };
  const still = () => { p = 1; t = 0; draw(); }; // الإطار الثابت: شروق مكتمل

  const resize = () => {
    const f = fitCanvas(canvas, window.innerWidth < 760 ? 1.25 : 1.5);
    if (!f) return;
    w = f.w; h = f.h; ctx = f.ctx;
    if (motionOn()) { p = scrollTarget(); draw(); } else still();
  };

  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver((es) => { visible = es[0].isIntersecting; visible ? start() : stop(); }, { rootMargin: '80px 0px' }).observe(canvas);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  onMotionChange((on) => { if (on) start(); else { stop(); still(); } });
}
