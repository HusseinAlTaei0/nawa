/**
 * يولّد الأيقونات وصور معاينة الروابط (Open Graph) من الشعار، باستخدام Playwright.
 * التشغيل:  node scripts/make-brand-assets.mjs
 * الناتج:   public/favicon-32.png, apple-touch-icon.png, icon-512.png, og/og-en.png, og/og-ar.png
 * شغّله مرة أخرى فقط إذا تغيّر الشعار أو الشعار اللفظي.
 */
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Playwright مثبّت على الجهاز (عام) وليس ضمن اعتماديات المشروع، لذلك نحمّله بـ require
const { chromium } = createRequire(import.meta.url)('playwright');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const HEX = 'M106.94 5.38A15 15 0 0 1 121.94 5.38L218.01 60.85A15 15 0 0 1 225.51 73.84L225.51 184.77A15 15 0 0 1 218.01 197.76L121.94 253.22A15 15 0 0 1 106.94 253.22L10.87 197.76A15 15 0 0 1 3.37 184.77L3.37 73.84A15 15 0 0 1 10.88 60.85Z';
const mark = (stroke) => `<svg viewBox="0 0 228.89 258.61" xmlns="http://www.w3.org/2000/svg"><path d="${HEX}" fill="none" stroke="#fff" stroke-width="${stroke}" stroke-linejoin="round"/><circle cx="114.54" cy="131.1" r="44.3" fill="#fff"/></svg>`;
const b64 = (f) => readFileSync(path.join(root, f)).toString('base64');
const fonts = `
@font-face{font-family:Playfair;src:url(data:font/woff2;base64,${b64('node_modules/@fontsource-variable/playfair-display/files/playfair-display-latin-wght-normal.woff2')})}
@font-face{font-family:PlayfairI;src:url(data:font/woff2;base64,${b64('node_modules/@fontsource-variable/playfair-display/files/playfair-display-latin-wght-italic.woff2')})}
@font-face{font-family:Mont;src:url(data:font/woff2;base64,${b64('node_modules/@fontsource-variable/montserrat/files/montserrat-latin-wght-normal.woff2')})}
@font-face{font-family:Najwa;src:url(data:font/woff2;base64,${b64('src/assets/fonts/NajwaArabic-Regular.woff2')})}`;

// نجوم ذهبية ثابتة (نفس البذرة = نفس الصورة)
let seed = 7; const rnd = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
const stars = Array.from({ length: 260 }, () => `<circle cx="${(rnd() * 1200).toFixed(1)}" cy="${(rnd() * 630).toFixed(1)}" r="${(0.5 + rnd() * 1.1).toFixed(2)}" fill="#C5A463" opacity="${(0.25 + rnd() * 0.55).toFixed(2)}"/>`).join('');

const og = (lang) => `<!doctype html><html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}"><head><meta charset="utf-8"><style>${fonts}
*{margin:0;box-sizing:border-box}body{width:1200px;height:630px;background:#0a0a0a;color:#fff;position:relative;overflow:hidden}
svg.sky{position:absolute;inset:0}.in{position:absolute;inset:0;padding:72px 80px;display:flex;flex-direction:column;justify-content:space-between}
.brand{display:flex;align-items:center;gap:18px}.brand svg{width:44px}.wm{font:600 22px Mont;letter-spacing:.32em}
[dir=rtl] .wm{font:400 44px Najwa;letter-spacing:0}
h1{font:400 92px/1.04 Playfair;letter-spacing:-.02em;max-width:900px}h1 em{font-family:PlayfairI;font-style:italic;color:#C5A463}
[dir=rtl] h1{font:400 104px/1.3 Najwa;letter-spacing:0}[dir=rtl] h1 em{font-family:Najwa;font-style:normal}
p{font:500 20px Mont;letter-spacing:.24em;text-transform:uppercase;color:#8f8f8f}[dir=rtl] p{font:400 30px Najwa;letter-spacing:0}
.ring{position:absolute;border:1px solid #8F713D;border-radius:50%;opacity:.5}
</style></head><body>
<svg class="sky" viewBox="0 0 1200 630">${stars}</svg>
<div class="ring" style="width:520px;height:520px;${lang === 'ar' ? 'left' : 'right'}:-150px;top:60px"></div>
<div class="ring" style="width:720px;height:720px;${lang === 'ar' ? 'left' : 'right'}:-250px;top:-40px;opacity:.25"></div>
<div class="in"><div class="brand">${mark(12)}<span class="wm">${lang === 'ar' ? 'نوى' : 'NAWA'}</span></div>
<h1>${lang === 'ar' ? 'نبني ذكاء <em>يشتغل</em>' : 'We build intelligence that <em>works.</em>'}</h1>
<p>${lang === 'ar' ? 'وكالة ذكاء اصطناعي · بغداد' : 'AI agency · Baghdad'}</p></div></body></html>`;

const icon = (size, pad, radius) => `<!doctype html><html><body style="margin:0;width:${size}px;height:${size}px;background:#0a0a0a;border-radius:${radius}px;display:grid;place-items:center"><div style="width:${size - pad * 2}px">${mark(size <= 64 ? 16 : 9)}</div></body></html>`;

const browser = await chromium.launch();
const shot = async (html, w, h, file, transparent = false) => {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(root, 'public', file), omitBackground: transparent });
  await page.close();
  console.log('wrote public/' + file);
};
await shot(og('en'), 1200, 630, 'og/og-en.png');
await shot(og('ar'), 1200, 630, 'og/og-ar.png');
await shot(icon(32, 6, 7), 32, 32, 'favicon-32.png', true);
await shot(icon(180, 38, 0), 180, 180, 'apple-touch-icon.png');
await shot(icon(512, 116, 0), 512, 512, 'icon-512.png');
await browser.close();
