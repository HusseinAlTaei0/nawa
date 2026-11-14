/**
 * "بغداد من المدار": كرة أرضية داكنة بنقاط وأقواس ذهبية من بغداد إلى مدن المنطقة (مكتبة cobe ~6KB).
 * - المكتبة تُحمَّل فقط عندما يقترب القسم من الشاشة
 * - تتوقف عن الدوران خارج الشاشة، وترسم إطاراً ثابتاً عند إيقاف الحركة
 * - إذا لم يدعم الجهاز WebGL يبقى الشكل الثابت البديل (.fallback) ظاهراً
 */
import { motionOn, onMotionChange } from './motion';

const box = document.querySelector<HTMLElement>('[data-globe]');
if (box) {
  const canvas = box.querySelector('canvas')!;
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
  const GOLD: [number, number, number] = [0.773, 0.643, 0.388];
  let started = false;

  const init = async () => {
    if (started) return; started = true;
    try {
      const { default: createGlobe } = await import('cobe');
      const size = Math.round(box.clientWidth * Math.min(window.devicePixelRatio || 1, 1.5));
      // phi/theta يوجّهان الكرة حتى تكون بغداد في الواجهة
      const basePhi = 4.03, theta = 0.42;
      let phi = basePhi, raf = 0, visible = true, t = 0;
      const globe = createGlobe(canvas, {
        devicePixelRatio: 1, width: size, height: size, phi, theta,
        dark: 1, diffuse: 1.1, mapSamples: 14000, mapBrightness: 4.2, mapBaseBrightness: 0.02,
        baseColor: [0.16, 0.16, 0.16], markerColor: GOLD, glowColor: [0.12, 0.1, 0.07],
        markers: [{ location: BAGHDAD, size: 0.085 }, ...CITIES.map((c) => ({ location: c, size: 0.04 }))],
        arcs: CITIES.map((c) => ({ from: BAGHDAD, to: c })),
        arcColor: GOLD, arcWidth: 0.5, arcHeight: 0.22, markerElevation: 0.01,
      });
      box.classList.add('ready');
      const frame = () => {
        raf = requestAnimationFrame(frame);
        t += 0.016;
        phi = basePhi + Math.sin(t * 0.18) * 0.32; // تأرجح هادئ حول بغداد بدل دوران كامل
        globe.update({ phi });
      };
      const start = () => { if (!raf && motionOn() && visible && !document.hidden) raf = requestAnimationFrame(frame); };
      const stop = () => { cancelAnimationFrame(raf); raf = 0; };
      new IntersectionObserver((es) => { visible = es[0].isIntersecting; visible ? start() : stop(); }).observe(box);
      document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
      onMotionChange((on) => (on ? start() : stop()));
      globe.update({ phi });
      start();
    } catch {
      /* لا WebGL أو فشل التحميل: يبقى الشكل الثابت */
    }
  };
  new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { o.disconnect(); init(); } }, { rootMargin: '300px' }).observe(box);
}
