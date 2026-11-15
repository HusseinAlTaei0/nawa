/**
 * "بغداد من المدار": كرة أرضية داكنة بنقاط بيضاء للقارات، تحيط بها مدارات ذهبية تتحرك عليها مذنّبات صغيرة،
 * وأقواس ذهبية من بغداد إلى مدن المنطقة. (مستوحاة من Globe في React Bits Pro، بألوان NAWA)
 *
 * طبقتان داخل .globe-box:
 *  1) canvas.globe-earth  → الكرة نفسها عبر مكتبة cobe (WebGL، ~6KB). تُحمَّل فقط عند اقتراب القسم من الشاشة.
 *  2) canvas.globe-orbits → المدارات والمذنّبات بـ Canvas 2D فوق الكرة. الجزء الخلفي من كل مدار يختفي خلف الكرة.
 *
 * - السحب بالمؤشر/الإصبع يدير الكرة أفقياً، وعند الإفلات تعود بهدوء لتواجه بغداد
 * - يتوقف كل شيء خارج الشاشة أو عند إخفاء التبويب، ويُرسم إطار ثابت عند إيقاف الحركة
 * - إذا لم يدعم الجهاز WebGL تبقى الكرة البديلة الثابتة (.fallback) والمدارات تعمل فوقها
 * - اتجاه الدوران والإضاءة لا ينعكسان في العربية (قاعدة الهوية)
 */
import { motionOn, onMotionChange, fitCanvas } from './motion';

// ---------- الإعدادات ----------
const BAGHDAD: [number, number] = [33.31, 44.36];
const CITIES: [number, number][] = [
  [36.19, 44.01], // أربيل
  [30.51, 47.78], // البصرة
  [31.95, 35.93], // عمّان
  [24.71, 46.68], // الرياض
  [25.2, 55.27],  // دبي
  [30.04, 31.24], // القاهرة
  [41.01, 28.98], // إسطنبول
];
const GOLD_GL: [number, number, number] = [0.773, 0.643, 0.388];
const GOLD = '197,164,99', GOLD_BRIGHT = '221,194,136', CORE = '255,248,232';

/** نسبة قطر الكرة إلى عرض الصندوق. canvas الكرة أصغر من الصندوق حتى تتسع المدارات حولها */
const EARTH_FRAC = 0.74;
/** نصف قطر الكرة المرسومة داخل canvas الـ cobe كنسبة من نصف عرضه (cobe يترك هامشاً للتوهج) */
const COBE_SPHERE = 0.8;

/**
 * المدارات: نصف القطر (× نصف قطر الكرة)، الميل، زاوية العقدة، سرعة المذنّب (دورة/ثانية)، سرعة دوران مستوى المدار.
 * القيم مختارة يدوياً حتى تتقاطع المدارات بشكل متوازن مثل المرجع.
 */
const ORBITS = [
  { r: 1.16, inc: 1.18, node: 0.5, speed: 0.04, prec: 0.018 },
  { r: 1.3, inc: 1.45, node: 2.3, speed: -0.032, prec: -0.014 },
  { r: 1.1, inc: 0.6, node: 4.1, speed: 0.05, prec: 0.022 },
  { r: 1.24, inc: 0.95, node: 5.4, speed: 0.028, prec: 0.012 },
];
const SEG = 180;       // عدد القطع لكل مدار (نعومة المنحنى)
const TAIL = 0.12;     // طول ذيل المذنّب كنسبة من المدار

const box = document.querySelector<HTMLElement>('[data-globe]');
if (box) setup(box);

function setup(box: HTMLElement) {
  const earth = box.querySelector<HTMLCanvasElement>('.globe-earth')!;
  const orbits = box.querySelector<HTMLCanvasElement>('.globe-orbits')!;
  let ctx: CanvasRenderingContext2D | null = null, w = 0, h = 0;

  // حالة الدوران: basePhi يجعل بغداد في الواجهة، drag إزاحة من السحب تتلاشى بعد الإفلات
  const basePhi = 4.03, theta = 0.32;
  let drag = 0, dragV = 0, dragging = false, lastX = 0;
  let t = 0, visible = false, raf = 0, last = 0;
  let globe: { update: (s: { phi?: number }) => void } | null = null;

  // ---------- المدارات (Canvas 2D) ----------
  function drawOrbits() {
    if (!ctx || !w) return;
    const c = ctx, cx = w / 2, cy = h / 2;
    const R = (w * EARTH_FRAC / 2) * COBE_SPHERE; // نصف قطر الكرة على الشاشة
    c.clearRect(0, 0, w, h);
    c.lineCap = 'round';

    for (const o of ORBITS) {
      const node = o.node + t * o.prec;
      // متجها مستوى المدار: u على خط العقدة، v عمودي عليه ومائل بزاوية inc
      const ux = Math.cos(node), uy = 0, uz = Math.sin(node);
      const vx = -Math.sin(node) * Math.cos(o.inc), vy = Math.sin(o.inc), vz = Math.cos(node) * Math.cos(o.inc);
      const rr = R * o.r;
      const head = ((t * o.speed) % 1 + 1) % 1; // موضع المذنّب على المدار (0..1)

      let px = 0, py = 0, pz = 0;
      for (let i = 0; i <= SEG; i++) {
        const a = (i / SEG) * Math.PI * 2;
        const ca = Math.cos(a), sa = Math.sin(a);
        const x = cx + rr * (ca * ux + sa * vx), y = cy - rr * (ca * uy + sa * vy), z = ca * uz + sa * vz;
        if (i > 0) {
          const mx = (x + px) / 2 - cx, my = (y + py) / 2 - cy, mz = (z + pz) / 2;
          const hidden = mz < 0 && mx * mx + my * my < R * R; // خلف الكرة ومحجوب بها
          if (!hidden) {
            // بُعد هذه القطعة خلف المذنّب (0 = عند الرأس)، لرسم الذيل المتوهّج
            const f = i / SEG, back = ((head - f) % 1 + 1) % 1;
            const inTail = back < TAIL;
            const base = mz >= 0 ? 0.42 : 0.16; // الجزء الأمامي أوضح
            c.globalAlpha = inTail ? Math.max(base, 1 - back / TAIL) : base;
            c.strokeStyle = inTail ? `rgb(${back < TAIL * 0.25 ? CORE : GOLD_BRIGHT})` : `rgb(${GOLD})`;
            c.lineWidth = inTail ? 1.4 - 0.5 * (back / TAIL) : 0.9;
            c.beginPath(); c.moveTo(px, py); c.lineTo(x, y); c.stroke();
          }
        }
        px = x; py = y; pz = z;
      }

      // رأس المذنّب: نقطة مضيئة بهالة صغيرة (إذا لم تكن خلف الكرة)
      const a = head * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a);
      const hx = rr * (ca * ux + sa * vx), hy = -rr * (ca * uy + sa * vy), hz = ca * uz + sa * vz;
      if (!(hz < 0 && hx * hx + hy * hy < R * R)) {
        const g = c.createRadialGradient(cx + hx, cy + hy, 0, cx + hx, cy + hy, 9);
        g.addColorStop(0, `rgba(${CORE},${hz >= 0 ? 1 : 0.5})`);
        g.addColorStop(0.3, `rgba(${GOLD_BRIGHT},${hz >= 0 ? 0.5 : 0.2})`);
        g.addColorStop(1, `rgba(${GOLD},0)`);
        c.globalAlpha = 1; c.fillStyle = g;
        c.beginPath(); c.arc(cx + hx, cy + hy, 9, 0, Math.PI * 2); c.fill();
      }
    }
    c.globalAlpha = 1;
  }

  // ---------- الكرة (cobe / WebGL) ----------
  async function initEarth() {
    try {
      const { default: createGlobe } = await import('cobe');
      const size = Math.round(earth.clientWidth * Math.min(window.devicePixelRatio || 1, 1.5));
      globe = createGlobe(earth, {
        devicePixelRatio: 1, width: size, height: size, phi: basePhi, theta,
        dark: 1, diffuse: 1.2,
        mapSamples: 16000, mapBrightness: 5.5, mapBaseBrightness: 0,
        baseColor: [0.32, 0.32, 0.32],          // نقاط القارات: رمادي فاتح يميل للأبيض (كما في المرجع)
        markerColor: GOLD_GL,                   // بغداد والمدن بالذهبي
        glowColor: [0.16, 0.155, 0.145],        // هالة ناعمة دافئة حول الكرة
        markers: [{ location: BAGHDAD, size: 0.055 }, ...CITIES.map((c) => ({ location: c, size: 0.025 }))],
        arcs: CITIES.map((c) => ({ from: BAGHDAD, to: c })),
        arcColor: GOLD_GL, arcWidth: 0.45, arcHeight: 0.24, markerElevation: 0.01,
      });
      box.classList.add('ready');
      render();
    } catch {
      /* لا WebGL أو فشل التحميل: تبقى الكرة البديلة الثابتة */
    }
  }

  function render() {
    globe?.update({ phi: basePhi + drag + (motionOn() ? Math.sin(t * 0.15) * 0.18 : 0) });
    drawOrbits();
  }

  // ---------- الحلقة ----------
  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    t += dt;
    if (!dragging) {
      drag += dragV * dt; dragV *= Math.pow(0.04, dt);      // عطالة بعد الإفلات
      drag += (0 - drag) * Math.min(1, dt * 0.6);           // العودة لمواجهة بغداد
    }
    render();
  }
  const start = () => { if (!raf && motionOn() && visible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); } };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };

  const resize = () => {
    const f = fitCanvas(orbits, window.innerWidth < 760 ? 1.25 : 1.5);
    if (f) { w = f.w; h = f.h; ctx = f.ctx; drawOrbits(); }
  };

  // ---------- السحب ----------
  box.addEventListener('pointerdown', (e) => {
    if (!motionOn()) return;
    dragging = true; lastX = e.clientX; dragV = 0;
    box.setPointerCapture(e.pointerId); box.classList.add('dragging');
  });
  box.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const d = ((e.clientX - lastX) / box.clientWidth) * Math.PI; // سحب عرض الصندوق كاملاً = نصف دورة
    drag += d; dragV = d * 60; lastX = e.clientX;
  });
  const release = () => { dragging = false; box.classList.remove('dragging'); };
  box.addEventListener('pointerup', release);
  box.addEventListener('pointercancel', release);

  new ResizeObserver(resize).observe(orbits);
  new IntersectionObserver((es) => { visible = es[0].isIntersecting; visible ? start() : stop(); }).observe(box);
  // تحميل cobe فقط عند اقتراب القسم من الشاشة
  new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { o.disconnect(); initEarth(); } }, { rootMargin: '300px' }).observe(box);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  onMotionChange((on) => { if (on) start(); else { stop(); drag = 0; render(); } });
  resize();
}
