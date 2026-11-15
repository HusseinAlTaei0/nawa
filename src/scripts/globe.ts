/**
 * "بغداد من المدار": كرة أرضية داكنة بنقاط بيضاء للقارات، وأقواس ذهبية تنطلق من بغداد إلى مدن العالم.
 * (مستوحاة من Globe في React Bits Pro، بألوان NAWA)
 *
 * طبقتان داخل .globe-box:
 *  1) canvas.globe-earth → الكرة ونقاط المدن عبر مكتبة cobe (WebGL). تُحمَّل فقط عند اقتراب القسم من الشاشة.
 *  2) canvas.globe-arcs  → الأقواس بـ Canvas 2D فوق الكرة. نرسمها بأنفسنا (لا بأقواس cobe) حتى نحرّكها:
 *     عند ظهور القسم تخرج الأقواس من بغداد واحداً بعد الآخر، ثم تسري عليها نبضات ضوء هادئة.
 *     نستخدم نفس معادلة الإسقاط التي تستخدمها cobe داخلياً، فتنطبق الأقواس على الكرة تماماً.
 *
 * التفاعل:
 *  - السحب بالفأرة يدير الكرة في كل الاتجاهات (أفقياً وعمودياً)، وعند الإفلات تعود بنابض ناعم لتواجه بغداد.
 *    باللمس: السحب الأفقي يدير الكرة والعمودي يبقى تمريراً للصفحة (حتى لا تحبس الكرة الزائر على الموبايل).
 *  - المرور بالمؤشر على أي مدينة (أو لمسها) يُظهر اسمها.
 *
 * - يتوقف كل شيء خارج الشاشة أو عند إخفاء التبويب، وإطار ثابت (الأقواس مكتملة) عند إيقاف الحركة
 * - إذا لم يدعم الجهاز WebGL تبقى الكرة البديلة الثابتة (.fallback)
 * - اتجاه الدوران والإضاءة لا ينعكسان في العربية (قاعدة الهوية)
 */
import { motionOn, onMotionChange, fitCanvas } from './motion';

// ---------- المدن ----------
type City = { en: string; ar: string; loc: [number, number] };
const BAGHDAD: City = { en: 'Baghdad', ar: 'بغداد', loc: [33.31, 44.36] };
const CITIES: City[] = [
  { en: 'Erbil', ar: 'أربيل', loc: [36.19, 44.01] },
  { en: 'Basra', ar: 'البصرة', loc: [30.51, 47.78] },
  { en: 'Amman', ar: 'عمّان', loc: [31.95, 35.93] },
  { en: 'Riyadh', ar: 'الرياض', loc: [24.71, 46.68] },
  { en: 'Doha', ar: 'الدوحة', loc: [25.29, 51.53] },
  { en: 'Abu Dhabi', ar: 'أبوظبي', loc: [24.45, 54.38] },
  { en: 'Dubai', ar: 'دبي', loc: [25.2, 55.27] },
  { en: 'Cairo', ar: 'القاهرة', loc: [30.04, 31.24] },
  { en: 'Istanbul', ar: 'إسطنبول', loc: [41.01, 28.98] },
  { en: 'Berlin', ar: 'برلين', loc: [52.52, 13.4] },
  { en: 'Paris', ar: 'باريس', loc: [48.86, 2.35] },
  { en: 'London', ar: 'لندن', loc: [51.51, -0.13] },
  { en: 'New York', ar: 'نيويورك', loc: [40.71, -74.01] },
  { en: 'Beijing', ar: 'بكين', loc: [39.9, 116.4] },
  { en: 'Tokyo', ar: 'طوكيو', loc: [35.68, 139.69] },
  { en: 'Singapore', ar: 'سنغافورة', loc: [1.35, 103.82] },
];

// ---------- الألوان والإعدادات ----------
const GOLD_GL: [number, number, number] = [0.773, 0.643, 0.388];
const GOLD = '197,164,99', GOLD_BRIGHT = '221,194,136', CORE = '255,248,232';

/** نسبة عرض canvas الكرة إلى الصندوق (يجب أن تطابق CSS .globe-earth). الباقي هامش لارتفاع الأقواس */
const EARTH_FRAC = 0.84;
/** نصف قطر الكرة داخل canvas الـ cobe (ثابت في المكتبة) */
const SPHERE = 0.8;
const ELEV = 0.012;        // ارتفاع النقاط عن السطح (markerElevation)
const ARC_SEG = 56;        // نعومة كل قوس
const ARC_DUR = 1.5;       // مدة خروج القوس الواحد (ثانية)
const ARC_STAGGER = 0.11;  // الفاصل بين بداية قوس والذي يليه
const HIT = 20;            // نصف قطر منطقة المرور فوق المدينة (بكسل)

// ---------- رياضيات الكرة (منقولة من cobe حتى تتطابق المواقع) ----------
type V3 = [number, number, number];
/** خط عرض/طول → نقطة على كرة نصف قطرها 1 بنظام إحداثيات cobe */
function toVec([lat, lng]: [number, number]): V3 {
  const r = (lat * Math.PI) / 180, a = (lng * Math.PI) / 180 - Math.PI, o = Math.cos(r);
  return [-o * Math.cos(a), Math.sin(r), o * Math.sin(a)];
}
/** إسقاط نقطة ثلاثية الأبعاد على الشاشة: يعيد [x, y] بين 0 و1 داخل canvas الكرة، والعمق، والظهور */
function project(p: V3, phi: number, theta: number): [number, number, number, boolean] {
  const ct = Math.cos(theta), cp = Math.cos(phi), st = Math.sin(theta), sp = Math.sin(phi);
  const c = cp * p[0] + sp * p[2];
  const s = sp * st * p[0] + ct * p[1] - cp * st * p[2];
  const z = -sp * ct * p[0] + st * p[1] + cp * ct * p[2];
  return [(c + 1) / 2, (-s + 1) / 2, z, z >= 0 || c * c + s * s >= SPHERE * SPHERE];
}
/** نقطة على القوس بين a وb (كلاهما على الكرة) عند s∈[0,1] مع ارتفاع h عن السطح */
function arcPoint(a: V3, b: V3, s: number, h: number): V3 {
  const dot = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const om = Math.acos(dot), so = Math.sin(om) || 1;
  const k1 = Math.sin((1 - s) * om) / so, k2 = Math.sin(s * om) / so;
  const r = SPHERE * (1 + ELEV + h * Math.sin(Math.PI * s));
  return [(a[0] * k1 + b[0] * k2) * r, (a[1] * k1 + b[1] * k2) * r, (a[2] * k1 + b[2] * k2) * r];
}
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

function setup(box: HTMLElement) {
  const earth = box.querySelector<HTMLCanvasElement>('.globe-earth')!;
  const arcsCanvas = box.querySelector<HTMLCanvasElement>('.globe-arcs')!;
  const label = box.querySelector<HTMLElement>('.globe-label')!;
  const lang = document.documentElement.lang === 'ar' ? 'ar' : 'en';
  let ctx: CanvasRenderingContext2D | null = null, w = 0, h = 0;

  // الأقواس محسوبة مسبقاً بإحداثيات الكرة (لا تتغير)، والارتفاع يزيد مع طول المسافة
  const home = toVec(BAGHDAD.loc);
  const arcs = CITIES.map((c, i) => {
    const to = toVec(c.loc);
    const ang = Math.acos(Math.max(-1, Math.min(1, home[0] * to[0] + home[1] * to[1] + home[2] * to[2])));
    const hgt = 0.06 + 0.28 * (ang / Math.PI);
    const pts = Array.from({ length: ARC_SEG + 1 }, (_, k) => arcPoint(home, to, k / ARC_SEG, hgt));
    return { city: c, pts, start: i * ARC_STAGGER, pulse: Math.random() * 6 };
  });
  const allCities = [BAGHDAD, ...CITIES];
  const cityVecs = allCities.map((c) => { const v = toVec(c.loc); const r = SPHERE * (1 + ELEV); return [v[0] * r, v[1] * r, v[2] * r] as V3; });

  // ---------- الدوران ----------
  const basePhi = 4.03, baseTheta = 0.32;             // بغداد في الواجهة
  let dPhi = 0, dTheta = 0, vPhi = 0, vTheta = 0;      // إزاحة السحب وسرعتها
  let dragging = false, lastX = 0, lastY = 0, dragAxisY = true;
  let t = 0, arcT = -1, visible = false, raf = 0, last = 0;
  let globe: { update: (s: { phi?: number; theta?: number }) => void } | null = null;
  const phi = () => basePhi + dPhi + (motionOn() && !dragging ? Math.sin(t * 0.15) * 0.12 : 0);
  const theta = () => baseTheta + dTheta;

  /** يحوّل موضعاً داخل canvas الكرة (0..1) إلى بكسلات الصندوق */
  const toBox = (u: number, v: number): [number, number] => {
    const off = (1 - EARTH_FRAC) / 2;
    return [(off + u * EARTH_FRAC) * w, (off + v * EARTH_FRAC) * h];
  };

  // ---------- رسم الأقواس ----------
  function drawArcs() {
    if (!ctx || !w) return;
    const c = ctx, P = phi(), T = theta();
    c.clearRect(0, 0, w, h);
    c.lineCap = 'round';
    const done = arcT < 0 ? 1 : 0; // عند إيقاف الحركة (arcT = -1) تُرسم الأقواس مكتملة

    for (const a of arcs) {
      const prog = done ? 1 : easeOut(Math.max(0, Math.min(1, (arcT - a.start) / ARC_DUR)));
      if (prog <= 0) continue;
      const n = Math.max(1, Math.round(prog * ARC_SEG));
      let px = 0, py = 0, pv = false;
      for (let k = 0; k <= n; k++) {
        const [u, v, , vis] = project(a.pts[k], P, T);
        const [x, y] = toBox(u, v);
        if (k > 0 && vis && pv) {
          c.globalAlpha = 0.75; c.strokeStyle = `rgb(${GOLD})`; c.lineWidth = 1.1;
          c.beginPath(); c.moveTo(px, py); c.lineTo(x, y); c.stroke();
        }
        px = x; py = y; pv = vis;
      }
      // رأس القوس أثناء خروجه: نقطة مضيئة بهالة
      if (prog < 1 && pv) glow(c, px, py, 7, 1);
      // بعد الاكتمال: نبضة ضوء تسري من بغداد إلى المدينة كل بضع ثوانٍ
      if (prog >= 1 && motionOn()) {
        const ph = ((t + a.pulse) % 5.5) / 1.6; // 1.6 ثانية للمسير ثم استراحة
        if (ph < 1) {
          const kk = Math.min(ARC_SEG, Math.round(easeOut(ph) * ARC_SEG));
          const [u, v, , vis] = project(a.pts[kk], P, T);
          if (vis) { const [x, y] = toBox(u, v); glow(c, x, y, 5, 0.9); }
        }
      }
    }
    c.globalAlpha = 1;
  }
  function glow(c: CanvasRenderingContext2D, x: number, y: number, r: number, a: number) {
    const g = c.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(${CORE},${a})`);
    g.addColorStop(0.35, `rgba(${GOLD_BRIGHT},${0.55 * a})`);
    g.addColorStop(1, `rgba(${GOLD},0)`);
    c.globalAlpha = 1; c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
  }

  // ---------- اسم المدينة عند المرور ----------
  let hoverIdx = -1;
  function pickCity(mx: number, my: number) {
    const P = phi(), T = theta();
    let best = -1, bestD = HIT * HIT;
    cityVecs.forEach((v, i) => {
      const [u, vv, z, vis] = project(v, P, T);
      if (!vis || z < 0) return; // المدن خلف الكرة لا تُختار
      const [x, y] = toBox(u, vv), d = (x - mx) ** 2 + (y - my) ** 2;
      if (d < bestD) { bestD = d; best = i; }
    });
    return best;
  }
  function placeLabel() {
    if (hoverIdx < 0) { label.classList.remove('on'); return; }
    const [u, v, z, vis] = project(cityVecs[hoverIdx], phi(), theta());
    if (!vis || z < 0) { label.classList.remove('on'); return; }
    const [x, y] = toBox(u, v);
    label.textContent = allCities[hoverIdx][lang];
    label.style.left = `${x}px`; label.style.top = `${y}px`;
    label.classList.add('on');
  }

  // ---------- الكرة (cobe / WebGL) ----------
  async function initEarth() {
    try {
      const { default: createGlobe } = await import('cobe');
      const size = Math.round(earth.clientWidth * Math.min(window.devicePixelRatio || 1, 1.5));
      globe = createGlobe(earth, {
        devicePixelRatio: 1, width: size, height: size, phi: phi(), theta: theta(),
        dark: 1, diffuse: 1.2,
        mapSamples: 16000, mapBrightness: 5.5, mapBaseBrightness: 0,
        baseColor: [0.32, 0.32, 0.32],          // نقاط القارات: رمادي فاتح يميل للأبيض
        markerColor: GOLD_GL,                   // بغداد والمدن بالذهبي
        glowColor: [0.16, 0.155, 0.145],        // هالة ناعمة دافئة حول الكرة
        markers: [{ location: BAGHDAD.loc, size: 0.05 }, ...CITIES.map((c) => ({ location: c.loc, size: 0.022 }))],
        markerElevation: ELEV,
      });
      box.classList.add('ready');
      render();
    } catch {
      /* لا WebGL أو فشل التحميل: تبقى الكرة البديلة الثابتة */
    }
  }

  function render() {
    globe?.update({ phi: phi(), theta: theta() });
    drawArcs();
    if (hoverIdx >= 0) placeLabel();
  }

  // ---------- الحلقة ----------
  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    t += dt;
    if (arcT >= 0) arcT += dt;
    if (!dragging) {
      // عطالة قصيرة بعد الإفلات، ثم نابض يعيد الكرة إلى بغداد
      dPhi += vPhi * dt; dTheta += vTheta * dt;
      const damp = Math.pow(0.02, dt); vPhi *= damp; vTheta *= damp;
      const back = Math.min(1, dt * 2.2);
      dPhi += (0 - dPhi) * back; dTheta += (0 - dTheta) * back;
    }
    render();
  }
  const start = () => { if (!raf && motionOn() && visible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); } };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };

  const resize = () => {
    const f = fitCanvas(arcsCanvas, window.innerWidth < 760 ? 1.25 : 1.5);
    if (f) { w = f.w; h = f.h; ctx = f.ctx; drawArcs(); }
  };

  // ---------- السحب والمرور ----------
  const local = (e: PointerEvent): [number, number] => { const b = box.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
  box.addEventListener('pointerdown', (e) => {
    const [mx, my] = local(e);
    if (e.pointerType !== 'mouse') { hoverIdx = pickCity(mx, my); placeLabel(); } // اللمس: لمسة على مدينة تُظهر اسمها
    if (!motionOn()) return;
    dragging = true; lastX = e.clientX; lastY = e.clientY; vPhi = vTheta = 0;
    dragAxisY = e.pointerType === 'mouse' || e.pointerType === 'pen'; // باللمس نترك العمودي للتمرير
    box.setPointerCapture(e.pointerId); box.classList.add('dragging');
  });
  box.addEventListener('pointermove', (e) => {
    if (dragging) {
      const k = Math.PI / box.clientWidth; // سحب عرض الصندوق كاملاً = نصف دورة
      const dx = (e.clientX - lastX) * k, dy = dragAxisY ? (e.clientY - lastY) * k : 0;
      dPhi += dx; dTheta = Math.max(-1.25, Math.min(1.25, dTheta + dy));
      vPhi = dx * 60; vTheta = dy * 60; lastX = e.clientX; lastY = e.clientY;
      if (!motionOn()) render();
      return;
    }
    if (e.pointerType === 'mouse') {
      const [mx, my] = local(e);
      const i = pickCity(mx, my);
      if (i !== hoverIdx) { hoverIdx = i; placeLabel(); box.classList.toggle('on-city', i >= 0); }
    }
  });
  const release = () => { dragging = false; box.classList.remove('dragging'); };
  box.addEventListener('pointerup', release);
  box.addEventListener('pointercancel', release);
  box.addEventListener('pointerleave', () => { if (!dragging) { hoverIdx = -1; placeLabel(); box.classList.remove('on-city'); } });

  new ResizeObserver(resize).observe(arcsCanvas);
  new IntersectionObserver((es) => {
    visible = es[0].isIntersecting;
    if (visible && arcT < 0 && motionOn()) arcT = 0; // أول ظهور: تبدأ الأقواس بالخروج من بغداد
    visible ? start() : stop();
  }, { threshold: 0.35 }).observe(box);
  // تحميل cobe فقط عند اقتراب القسم من الشاشة
  new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { o.disconnect(); initEarth(); } }, { rootMargin: '300px' }).observe(box);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  onMotionChange((on) => { if (on) start(); else { stop(); dPhi = dTheta = 0; arcT = -1; render(); } });
  resize();
}

// التشغيل في آخر الملف: بعد تعريف كل الدوال والثوابت أعلاه (easeOut وغيرها)
const box = document.querySelector<HTMLElement>('[data-globe]');
if (box) setup(box);
