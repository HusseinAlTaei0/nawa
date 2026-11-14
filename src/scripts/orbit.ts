/**
 * المدار السداسي في أعلى صفحة الخدمات: الخدمات الست على زوايا سداسي الشعار حول النواة البيضاء.
 * التحكم: الأسهم، الضغط على نقطة، السحب، أو مفاتيح الأسهم. الخدمة النشطة تنزل إلى أسفل المدار.
 * المدار نفسه لا ينعكس في العربية (فيزياء)، فقط اتجاه مفاتيح الأسهم.
 */
import { motionOn } from './motion';

interface Item { name: string; text: string; href: string; more: string; }

const root = document.querySelector<HTMLElement>('[data-orbit]');
if (root) {
  const orbit = root.querySelector<HTMLElement>('.orbit')!;
  const detail = root.querySelector<HTMLElement>('.orbit-detail')!;
  const nodes = [...orbit.querySelectorAll<HTMLButtonElement>('.node')];
  const items: Item[] = JSON.parse(root.dataset.items || '[]');
  const n = nodes.length;
  const rtl = document.documentElement.dir === 'rtl';
  const state = { a: 0, target: 0, raf: 0 };
  const idx = () => ((Math.round(state.target) % n) + n) % n;
  const pad = (i: number) => String(i + 1).padStart(2, '0');

  function layout() {
    const on = idx();
    nodes.forEach((node, i) => {
      const ang = ((90 + (i - state.a) * (360 / n)) * Math.PI) / 180, c = Math.cos(ang), s = Math.sin(ang);
      node.style.left = `${50 + 33 * c}%`;
      node.style.top = `${50 + 33 * s}%`;
      node.dataset.side = Math.abs(c) > 0.35 ? (c > 0 ? 'r' : 'l') : s > 0 ? 'b' : 't';
      node.classList.toggle('on', i === on);
      node.setAttribute('aria-pressed', String(i === on));
    });
  }
  function fill() {
    const i = idx(), it = items[i];
    detail.querySelector('.cur')!.textContent = pad(i);
    detail.querySelector('h2')!.textContent = it.name;
    detail.querySelector('p.txt')!.textContent = it.text;
    const link = detail.querySelector<HTMLAnchorElement>('a.tlink')!;
    link.href = it.href;
    link.setAttribute('aria-label', `${it.more}: ${it.name}`);
  }
  function run() {
    cancelAnimationFrame(state.raf);
    if (!motionOn()) { state.a = state.target; layout(); fill(); return; }
    const from = state.a, to = state.target, t0 = performance.now(), dur = 850;
    orbit.classList.add('moving'); detail.classList.add('swap');
    let swapped = false;
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 4);
      state.a = from + (to - from) * e; layout();
      if (!swapped && k > 0.3) { swapped = true; fill(); requestAnimationFrame(() => detail.classList.remove('swap')); }
      if (k < 1) state.raf = requestAnimationFrame(tick); else orbit.classList.remove('moving');
    };
    state.raf = requestAnimationFrame(tick);
  }
  const step = (d: number) => { state.target = Math.round(state.target) + d; run(); };
  const goTo = (i: number) => { let d = (((i - idx()) % n) + n) % n; if (d > n / 2) d -= n; if (d) { state.target = Math.round(state.target) + d; run(); } };

  nodes.forEach((node, i) => node.addEventListener('click', () => goTo(i)));
  root.querySelectorAll<HTMLButtonElement>('[data-step]').forEach((b) => b.addEventListener('click', () => step(Number(b.dataset.step))));
  root.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault(); step((e.key === 'ArrowRight') !== rtl ? 1 : -1);
  });
  let sx: number | null = null;
  orbit.addEventListener('pointerdown', (e) => { sx = e.clientX; });
  orbit.addEventListener('pointerup', (e) => { if (sx === null) return; const dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1); });

  layout(); fill();
}
