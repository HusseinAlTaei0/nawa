/**
 * حالة الحركة في الموقع.
 * html[data-motion="off"] تُضبط مبكراً في <head> (تفضيل الزائر، أو prefers-reduced-motion، أو جهاز/اتصال ضعيف).
 * كل سكربت متحرك يسأل motionOn() قبل أن يبدأ، ويستمع لـ onMotionChange إذا غيّر الزائر الزر في الفوتر.
 */
export const motionOn = (): boolean => document.documentElement.dataset.motion !== 'off';

export function setMotion(on: boolean): void {
  document.documentElement.dataset.motion = on ? 'on' : 'off';
  try { localStorage.setItem('nawa-motion', on ? 'on' : 'off'); } catch { /* التخزين غير متاح: نتجاهل */ }
  window.dispatchEvent(new CustomEvent('nawa:motion', { detail: on }));
}

export function onMotionChange(fn: (on: boolean) => void): void {
  window.addEventListener('nawa:motion', (e) => fn((e as CustomEvent<boolean>).detail));
}

/** مولّد أرقام عشوائية ثابت (نفس البذرة = نفس السماء في كل زيارة) */
export function rng(seed: number): () => number {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** يضبط حجم الـ canvas على حجمه الظاهر مع حد أقصى لكثافة البكسل (أداء أفضل على الموبايل) */
export function fitCanvas(canvas: HTMLCanvasElement, maxDpr = 1.5): { w: number; h: number; ctx: CanvasRenderingContext2D } | null {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const r = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
  canvas.width = Math.max(1, Math.round(r.width * dpr));
  canvas.height = Math.max(1, Math.round(r.height * dpr));
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { w: r.width, h: r.height, ctx };
}
