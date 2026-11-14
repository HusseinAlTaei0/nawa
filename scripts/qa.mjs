/**
 * فحص الجودة للموقع المبني (dist) عبر Playwright.
 *
 * الاستخدام:
 *   PUBLIC_SHOW_DRAFTS=true npm run build && npx astro preview --port 4321   (في نافذة)
 *   npm run qa                                                              (في نافذة أخرى)
 *
 * يفحص كل صفحة باللغتين على عرض ديسكتوب (1440) وموبايل (390):
 *   أخطاء الكونسول، طلبات فاشلة، سكرول أفقي، lang/dir، عنوان h1 واحد،
 *   canonical + hreflang + صورة المعاينة، ثم يحفظ لقطة كاملة في مجلد qa/
 * ثم: شاشة البداية، وضع إيقاف الحركة، علامات نموذج Netlify، ووزن JavaScript لكل صفحة.
 */
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, readdirSync, existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { chromium } = createRequire(import.meta.url)('playwright');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.env.BASE || 'http://localhost:4321';
const out = path.join(root, 'qa');
mkdirSync(out, { recursive: true });

const routes = ['', 'services/', 'services/ai-agents/', 'services/erp-systems/', 'work/', 'process/', 'about/', 'contact/'];
if (existsSync(path.join(root, 'dist/en/work/clinic-that-answers-itself/index.html'))) routes.push('work/clinic-that-answers-itself/');
const sizes = [{ name: 'desktop', width: 1440, height: 900 }, { name: 'phone', width: 390, height: 844 }];
const problems = [];
const note = (where, msg) => { problems.push(`${where}: ${msg}`); };

const browser = await chromium.launch();
for (const size of sizes) {
  const ctx = await browser.newContext({ viewport: { width: size.width, height: size.height }, deviceScaleFactor: 1 });
  // نتخطى شاشة البداية في لقطات الصفحات (تُفحص لوحدها في الأسفل)
  await ctx.addInitScript(() => { try { sessionStorage.setItem('nawa-seen', '1'); } catch {} });
  for (const lang of ['en', 'ar']) {
    for (const route of routes) {
      const url = `${BASE}/${lang}/${route}`, where = `${size.name} /${lang}/${route}`;
      const page = await ctx.newPage();
      page.on('console', (m) => { if (m.type() === 'error') note(where, 'console: ' + m.text()); });
      page.on('pageerror', (e) => note(where, 'script error: ' + e.message));
      page.on('response', (r) => { if (r.status() >= 400) note(where, `HTTP ${r.status()} ${r.url()}`); });
      await page.goto(url, { waitUntil: 'load' });
      await page.waitForTimeout(700);
      const info = await page.evaluate(() => ({
        lang: document.documentElement.lang, dir: document.documentElement.dir,
        h1: document.querySelectorAll('h1').length,
        canonical: !!document.querySelector('link[rel="canonical"]'),
        hreflang: document.querySelectorAll('link[rel="alternate"][hreflang]').length,
        og: document.querySelector('meta[property="og:image"]')?.content || '',
        desc: document.querySelector('meta[name="description"]')?.content || '',
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      }));
      if (info.lang !== lang) note(where, `html lang is "${info.lang}"`);
      if (info.dir !== (lang === 'ar' ? 'rtl' : 'ltr')) note(where, `html dir is "${info.dir}"`);
      if (info.h1 !== 1) note(where, `${info.h1} h1 elements`);
      if (!info.canonical) note(where, 'no canonical');
      if (info.hreflang < 3) note(where, `only ${info.hreflang} hreflang links`);
      if (!info.og) note(where, 'no og:image');
      if (info.desc.length < 40) note(where, 'description too short');
      if (info.overflow > 0) note(where, `horizontal overflow ${info.overflow}px`);
      // نمرّ على الصفحة كلها حتى تظهر العناصر (reveal) وتُحمَّل الصور، ثم نلتقط الصورة
      const h = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < h; y += size.height * 0.7) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(140); }
      const overflow2 = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (overflow2 > 0) note(where, `horizontal overflow after scroll ${overflow2}px`);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(350);
      const file = `${size.name}-${lang}-${route.replace(/\//g, '_') || 'home'}.png`;
      await page.screenshot({ path: path.join(out, file), fullPage: true });
      await page.close();
    }
  }
  await ctx.close();
}

// شاشة البداية: تظهر في أول زيارة ثم تختفي
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/en/`, { waitUntil: 'domcontentloaded' });
  const shown = await page.evaluate(() => document.documentElement.hasAttribute('data-preload'));
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(out, 'preloader-mid.png') });
  await page.waitForTimeout(3300);
  const gone = await page.evaluate(() => !document.documentElement.hasAttribute('data-preload'));
  if (!shown) note('preloader', 'did not show on first visit');
  if (!gone) note('preloader', 'still present after 4s');
  await page.reload({ waitUntil: 'domcontentloaded' });
  if (await page.evaluate(() => document.documentElement.hasAttribute('data-preload'))) note('preloader', 'showed again on second load in the same session');
  await ctx.close();
}

// وضع إيقاف الحركة: لا شاشة بداية، لا أخطاء، والمحتوى ظاهر
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => note('reduced motion', 'script error: ' + e.message));
  await page.goto(`${BASE}/en/`, { waitUntil: 'load' });
  await page.waitForTimeout(600);
  const r = await page.evaluate(() => ({ motion: document.documentElement.dataset.motion, pre: document.documentElement.hasAttribute('data-preload'), hidden: [...document.querySelectorAll('[data-reveal]')].filter((e) => getComputedStyle(e).opacity === '0').length }));
  if (r.motion !== 'off') note('reduced motion', `data-motion is "${r.motion}"`);
  if (r.pre) note('reduced motion', 'preloader shown');
  if (r.hidden) note('reduced motion', `${r.hidden} elements stay invisible`);
  await page.screenshot({ path: path.join(out, 'reduced-motion-home.png') });
  await ctx.close();
}
await browser.close();

// نموذج Netlify
for (const lang of ['en', 'ar']) {
  const html = readFileSync(path.join(root, `dist/${lang}/contact/index.html`), 'utf8');
  for (const need of ['data-netlify="true"', `name="form-name" value="contact-${lang}"`, 'name="bot-field"', 'netlify-honeypot="bot-field"']) {
    if (!html.includes(need)) note(`contact form /${lang}/`, `missing ${need}`);
  }
}

// وزن JavaScript (gzip) لكل صفحة: الملفات التي يحمّلها الـ HTML مباشرة
const js = {};
for (const f of readdirSync(path.join(root, 'dist/_astro')).filter((f) => f.endsWith('.js'))) js[f] = gzipSync(readFileSync(path.join(root, 'dist/_astro', f))).length;
console.log('\nJavaScript per page (gzip):');
for (const route of routes) {
  const html = readFileSync(path.join(root, 'dist/en', route, 'index.html'), 'utf8');
  const used = [...new Set([...html.matchAll(/\/_astro\/([\w.\-]+\.js)/g)].map((m) => m[1]))];
  const inline = [...html.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/g)].reduce((n, m) => n + m[1].length, 0);
  const total = used.reduce((n, f) => n + (js[f] || 0), 0);
  console.log(`  /en/${route}`.padEnd(46), `${(total / 1024).toFixed(1)} KB in ${used.length} files, ${(inline / 1024).toFixed(1)} KB inline (uncompressed)`);
  if (total > 40 * 1024) note(`/en/${route}`, `JS is ${(total / 1024).toFixed(1)} KB gzip, over the 40 KB budget`);
}
console.log('  all chunks:', Object.entries(js).map(([f, n]) => `${f} ${(n / 1024).toFixed(1)}KB`).join(', '));

console.log(problems.length ? `\n${problems.length} problem(s):\n- ` + problems.join('\n- ') : '\nNo problems found.');
process.exit(problems.length ? 1 : 0);
