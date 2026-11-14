/**
 * كروت الخدمات المتحركة في الصفحة الرئيسية.
 * - موبايل/لمس: سكرول أفقي طبيعي مع snap + أسهم
 * - ديسكتوب: القسم "يثبت" والسكرول العمودي يحرّك الكروت أفقياً (بحد أقصى ~2.5 شاشة، مع رابط تخطٍّ)
 * - RTL: اتجاه scrollLeft سالب في العربية، لذلك نضرب في sign
 */
import { motionOn, onMotionChange } from './motion';

const sec = document.querySelector<HTMLElement>('[data-rail]');
if (sec) {
  const rail = sec.querySelector<HTMLElement>('.rail')!;
  const cards = [...rail.querySelectorAll<HTMLElement>('.svc-card')];
  const cur = sec.querySelector<HTMLElement>('.cur');
  const prog = sec.querySelector<HTMLElement>('.prog i');
  const n = cards.length;
  const sign = document.documentElement.dir === 'rtl' ? -1 : 1;
  const pad = (i: number) => String(i + 1).padStart(2, '0');
  let active = 0, pinned = false;

  const setActive = (i: number) => {
    if (i === active && cards[i].classList.contains('on')) return;
    active = i;
    cards.forEach((c, j) => c.classList.toggle('on', j === i));
    if (cur) cur.textContent = pad(i);
    if (prog) prog.style.width = `${((i + 1) / n) * 100}%`;
  };

  // ----- وضع التثبيت -----
  const mq = window.matchMedia('(min-width: 1024px) and (min-height: 640px) and (pointer: fine)');
  const range = () => sec.offsetHeight - window.innerHeight;
  const secTop = () => sec.getBoundingClientRect().top + window.scrollY;
  const onScroll = () => {
    if (!pinned) return;
    const p = Math.min(1, Math.max(0, (window.scrollY - secTop()) / Math.max(1, range())));
    rail.scrollLeft = sign * p * (rail.scrollWidth - rail.clientWidth);
    setActive(Math.round(p * (n - 1)));
  };
  const goPinned = (i: number, smooth = true) => {
    window.scrollTo({ top: secTop() + (i / (n - 1)) * range(), behavior: smooth && motionOn() ? 'smooth' : 'auto' });
  };
  const applyMode = () => {
    const want = mq.matches && motionOn();
    if (want === pinned) return;
    pinned = want;
    sec.classList.toggle('pinned', pinned);
    if (pinned) onScroll(); else rail.scrollLeft = 0;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => { applyMode(); onScroll(); });
  mq.addEventListener('change', applyMode);
  onMotionChange(applyMode);

  // ----- الوضع العادي: نعرف الكرت النشط من موضعه داخل الشريط -----
  const io = new IntersectionObserver((es) => {
    if (pinned) return;
    es.forEach((e) => { if (e.isIntersecting && e.intersectionRatio > 0.6) setActive(cards.indexOf(e.target as HTMLElement)); });
  }, { root: rail, threshold: [0.6, 0.9] });
  cards.forEach((c) => io.observe(c));

  // الأسهم + التنقل بلوحة المفاتيح (التركيز على كرت يجلبه إلى المنتصف)
  sec.querySelectorAll<HTMLButtonElement>('[data-step]').forEach((b) => b.addEventListener('click', () => {
    const i = Math.max(0, Math.min(n - 1, active + Number(b.dataset.step)));
    if (pinned) goPinned(i);
    else cards[i].scrollIntoView({ behavior: motionOn() ? 'smooth' : 'auto', inline: 'center', block: 'nearest' });
  }));
  cards.forEach((c, i) => c.addEventListener('focus', () => { if (pinned) goPinned(i, false); }));

  applyMode();
  setActive(0);
}
