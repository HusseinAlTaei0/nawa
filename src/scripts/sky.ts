/**
 * خلفية الموقع: سحابة النجوم الذهبية (نقل لفكرة Hero3D في الموقع القديم، لكن على Canvas 2D بدون three.js).
 * - نقاط داخل كرة، والكاميرا في داخلها، تدور ببطء شديد حتى تكون مريحة للعين
 * - سرعة الدوران تزيد قليلاً مع السكرول ثم تهدأ
 * - تتوقف عندما يكون التبويب مخفياً، وترسم إطاراً واحداً ثابتاً إذا كانت الحركة متوقفة
 * - زاوية الدوران تُحفظ بين الصفحات حتى لا "تقفز" السماء عند التنقل
 */
import { motionOn, onMotionChange, rng, fitCanvas } from './motion';

const GOLD = '#C5A463';
const BASE_SPEED = 0.007;   // راديان/ثانية: بطيء ومريح
const SCROLL_GAIN = 0.011;  // تأثير السكرول على السرعة
const MAX_BOOST = 0.2;

const canvas = document.getElementById('sky') as HTMLCanvasElement | null;
if (canvas) {
  const small = window.innerWidth < 700;
  const count = small ? 1100 : 2600;
  const r = rng(9);
  const pts = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const rad = 1.5 * Math.cbrt(r()), th = r() * Math.PI * 2, ph = Math.acos(2 * r() - 1);
    pts[i * 3] = rad * Math.sin(ph) * Math.cos(th);
    pts[i * 3 + 1] = rad * Math.sin(ph) * Math.sin(th);
    pts[i * 3 + 2] = rad * Math.cos(ph);
  }

  let rotY = 0, rotX = 0;
  try {
    const saved = sessionStorage.getItem('nawa-sky');
    if (saved) { const [a, b] = saved.split(',').map(Number); if (isFinite(a) && isFinite(b)) { rotY = a; rotX = b; } }
  } catch { /* نتجاهل */ }
  window.addEventListener('pagehide', () => { try { sessionStorage.setItem('nawa-sky', `${rotY},${rotX}`); } catch { /* نتجاهل */ } });

  let w = 0, h = 0, ctx: CanvasRenderingContext2D | null = null;
  const resize = () => { const f = fitCanvas(canvas, small ? 1.25 : 1.5); if (f) { w = f.w; h = f.h; ctx = f.ctx; draw(); } };

  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
    const f = (h / 2) / Math.tan((75 * Math.PI) / 360);
    const cy = Math.cos(rotY), sy = Math.sin(rotY), cx = Math.cos(rotX), sx = Math.sin(rotX), q = Math.SQRT1_2;
    ctx.fillStyle = GOLD;
    for (let i = 0; i < pts.length; i += 3) {
      const x = pts[i], y = pts[i + 1], z = pts[i + 2];
      const x1 = x * cy + z * sy, z1 = -x * sy + z * cy;
      const y1 = y * cx - z1 * sx, z2 = y * sx + z1 * cx;
      const zc = z2 - 1;
      if (zc > -0.06) continue;
      const s = f / -zc;
      const px = w / 2 + (x1 * q - y1 * q) * s, py = h / 2 - (x1 * q + y1 * q) * s;
      if (px < 0 || px > w || py < 0 || py > h) continue;
      const size = Math.min(2.4, Math.max(0.7, 0.003 * s));
      ctx.globalAlpha = 0.6 * Math.min(1, 0.3 + 0.45 / -zc);
      ctx.fillRect(px - size / 2, py - size / 2, size, size);
    }
    ctx.globalAlpha = 1;
  }

  let speed = BASE_SPEED, lastY = window.scrollY, last = performance.now(), raf = 0, skip = false;
  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    const y = window.scrollY, d = Math.abs(y - lastY); lastY = y;
    speed += (BASE_SPEED + Math.min(MAX_BOOST, d * SCROLL_GAIN) - speed) * 0.04;
    rotY -= speed * dt; rotX -= 0.0035 * dt;
    // على الشاشات الصغيرة نرسم إطاراً ونتخطى إطاراً (30fps) لتوفير البطارية
    if (small) { skip = !skip; if (skip) return; }
    draw();
  }
  const start = () => { if (!raf && motionOn() && !document.hidden) { last = performance.now(); lastY = window.scrollY; raf = requestAnimationFrame(frame); } };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };

  new ResizeObserver(resize).observe(canvas);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  onMotionChange((on) => { if (on) start(); else { stop(); draw(); } });
  resize();
  start();
}
