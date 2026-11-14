/**
 * سلوك الموقع العام (يُحمَّل في كل صفحة):
 * شاشة البداية، الهيدر، قائمة الموبايل، شريط الإجراءات، الظهور عند السكرول،
 * زر إيقاف الحركة، كسوف تبديل اللغة، مؤشر القمر، وتلوين مراحل العمل.
 */
import { motionOn, setMotion, onMotionChange } from './motion';

const html = document.documentElement;

/* ---------- شاشة البداية: تُزال بعد رفع الستارة (أو فوراً عند الضغط) ---------- */
const pre = document.querySelector<HTMLElement>('.preloader');
let ready = !html.hasAttribute('data-preload');
const whenReady: Array<() => void> = [];
function finishPreload() {
  if (ready) return;
  ready = true;
  html.removeAttribute('data-preload');
  whenReady.forEach((fn) => fn());
}
if (!ready && pre) {
  pre.addEventListener('animationend', (e) => { if (e.animationName === 'curtain') finishPreload(); });
  pre.addEventListener('click', finishPreload);
  window.addEventListener('keydown', finishPreload, { once: true });
  setTimeout(finishPreload, 4000); // أمان: لا تبقى الستارة أبداً
} else { ready = true; html.removeAttribute('data-preload'); }
const afterPreload = (fn: () => void) => (ready ? fn() : whenReady.push(fn));

/* ---------- الهيدر: شفاف فوق الـ hero ثم خلفية بعد السكرول ---------- */
const header = document.querySelector<HTMLElement>('.site-header');
const bar = document.querySelector<HTMLElement>('.action-bar');
const footer = document.querySelector<HTMLElement>('.site-footer');
function onScroll() {
  const y = window.scrollY;
  header?.classList.toggle('scrolled', y > 40);
  if (bar) {
    const nearEnd = footer ? footer.getBoundingClientRect().top < window.innerHeight - 40 : false;
    bar.classList.toggle('show', y > window.innerHeight * 0.6 && !nearEnd);
  }
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- قائمة الموبايل ---------- */
const burger = document.querySelector<HTMLButtonElement>('.burger');
const menu = document.querySelector<HTMLElement>('.mobile-menu');
const main = document.querySelector<HTMLElement>('main');
function setMenu(open: boolean) {
  if (!burger || !menu) return;
  menu.classList.toggle('open', open);
  header?.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? burger.dataset.close! : burger.dataset.open!);
  document.body.style.overflow = open ? 'hidden' : '';
  // inert يمنع التركيز على ما خلف القائمة
  if (open) { main?.setAttribute('inert', ''); footer?.setAttribute('inert', ''); menu.removeAttribute('inert'); }
  else { main?.removeAttribute('inert'); footer?.removeAttribute('inert'); menu.setAttribute('inert', ''); }
}
burger?.addEventListener('click', () => setMenu(!menu?.classList.contains('open')));
window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu?.classList.contains('open')) { setMenu(false); burger?.focus(); } });
window.matchMedia('(min-width: 961px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

/* ---------- الظهور عند السكرول ---------- */
afterPreload(() => {
  const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!motionOn() || !('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('in')); return; }
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  els.forEach((el) => io.observe(el));
});

/* ---------- مراحل العمل: النقطة تصير ذهبية عندما تصل إليها ---------- */
const stages = document.querySelectorAll<HTMLElement>('.stage');
if (stages.length) {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) e.target.classList.add('reached'); }), { rootMargin: '0px 0px -35% 0px' });
  stages.forEach((s) => io.observe(s));
}

/* ---------- زر الحركة في الفوتر (WCAG 2.2.2: إيقاف الحركة المستمرة) ---------- */
const toggle = document.querySelector<HTMLButtonElement>('.motion-toggle');
function paintToggle() {
  if (!toggle) return;
  const on = motionOn();
  toggle.textContent = on ? toggle.dataset.on! : toggle.dataset.off!;
  toggle.setAttribute('aria-pressed', String(on));
}
toggle?.addEventListener('click', () => setMotion(!motionOn()));
onMotionChange(paintToggle);
paintToggle();

/* ---------- كسوف تبديل اللغة ----------
   قرص داكن بحافة ذهبية يعبر الشاشة. في منتصفه ننتقل للصفحة المقابلة باللغة الأخرى،
   والصفحة الجديدة تكمل خروج القرص. هكذا لا يرى الزائر انقلاب الاتجاه RTL/LTR. */
function disc(): { el: HTMLElement; D: number; far: number } {
  const w = window.innerWidth, h = window.innerHeight, D = Math.hypot(w, h) * 1.12;
  const el = document.createElement('div');
  el.className = 'eclipse';
  el.style.cssText = `width:${D}px;height:${D}px;top:${(h - D) / 2}px;left:${(w - D) / 2}px`;
  document.body.appendChild(el);
  return { el, D, far: w / 2 + D / 2 + 90 };
}
document.querySelectorAll<HTMLAnchorElement>('a[data-lang-switch]').forEach((a) => a.addEventListener('click', (e) => {
  if (!motionOn() || e.metaKey || e.ctrlKey || e.shiftKey) return;
  e.preventDefault();
  const sign = html.dir === 'rtl' ? -1 : 1;
  const { el, far } = disc();
  try { sessionStorage.setItem('nawa-eclipse', String(sign)); } catch { /* نتجاهل */ }
  el.animate([{ transform: `translateX(${-far * sign}px)` }, { transform: 'translateX(0)' }], { duration: 480, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' })
    .onfinish = () => { window.location.href = a.href; };
}));
if (html.hasAttribute('data-eclipse')) {
  const sign = Number(html.dataset.eclipse) || 1;
  const { el, far } = disc();
  html.classList.add('eclipse-out');
  el.animate([{ transform: 'translateX(0)' }, { transform: `translateX(${far * sign}px)` }], { duration: 520, easing: 'cubic-bezier(.65,0,.35,1)' })
    .onfinish = () => { el.remove(); html.removeAttribute('data-eclipse'); html.classList.remove('eclipse-out'); };
}
// إذا عاد الزائر بزر الرجوع (bfcache) نزيل أي قرص عالق
window.addEventListener('pageshow', (e) => { if (e.persisted) document.querySelectorAll('.eclipse').forEach((n) => n.remove()); });

/* ---------- مؤشر القمر: حلقة ذهبية صغيرة تتبع الماوس (المؤشر الأصلي يبقى ظاهراً) ---------- */
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const c = document.createElement('div');
  c.className = 'moon-cursor'; c.setAttribute('aria-hidden', 'true');
  document.body.appendChild(c);
  let x = 0, y = 0, tx = 0, ty = 0, raf = 0;
  const tick = () => {
    x += (tx - x) * 0.2; y += (ty - y) * 0.2;
    c.style.transform = `translate(${x}px, ${y}px)`;
    raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.3 ? requestAnimationFrame(tick) : 0;
  };
  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || !motionOn()) { c.classList.remove('on'); return; }
    tx = e.clientX; ty = e.clientY;
    if (!c.classList.contains('on')) { x = tx; y = ty; c.classList.add('on'); }
    c.classList.toggle('big', !!(e.target as Element).closest?.('a, button, summary, label, .node'));
    if (!raf) raf = requestAnimationFrame(tick);
  }, { passive: true });
  document.addEventListener('pointerleave', () => c.classList.remove('on'));
}
