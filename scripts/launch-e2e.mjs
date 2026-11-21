/**
 * اختبار شامل لمسار التشخيص (/launch) في متصفح حقيقي (Playwright) ضد astro preview.
 * طلبات /api/launch/* تُوجَّه للـ Netlify Function الحقيقية داخل Node (بدون Supabase: تعمل بوضع "غير مخزّن").
 *
 * الاستخدام:
 *   npm run build && npx astro preview --port 4321      (نافذة)
 *   node --experimental-strip-types scripts/launch-e2e.mjs [مجلد اللقطات]
 */
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import handler from '../netlify/functions/launch.mts';

const { chromium, devices } = createRequire(import.meta.url)('playwright');
const BASE = process.env.BASE || 'http://localhost:4321';
const out = process.argv[2] || 'qa/launch';
mkdirSync(out, { recursive: true });
const problems = [];
const apiCalls = [];
const note = (w, m) => problems.push(`${w}: ${m}`);

async function wire(ctx, where) {
  await ctx.addInitScript(() => { try { sessionStorage.setItem('nawa-seen', '1'); } catch {} });
  await ctx.route('**/api/launch/**', async (route) => {
    const r = route.request();
    const action = new URL(r.url()).pathname.split('/').pop();
    const res = await handler(new Request(r.url(), { method: r.method(), headers: { 'Content-Type': 'application/json', origin: BASE }, body: r.postData() || undefined }), { params: { action }, ip: '127.0.0.1' });
    apiCalls.push(`${where} ${action} → ${res.status}`);
    await route.fulfill({ status: res.status, contentType: 'application/json', body: await res.text() });
  });
}
const watch = (page, where) => {
  page.on('console', (m) => { if (m.type() === 'error') note(where, 'console: ' + m.text()); });
  page.on('pageerror', (e) => note(where, 'script error: ' + e.message));
};
const shot = (page, name, full = false) => page.screenshot({ path: path.join(out, name), fullPage: full });

async function answerAll(page, picks = {}) {
  for (let i = 0; i < 9; i++) {
    await page.waitForSelector('[data-screen="q"]:not([hidden]) .lt-opt');
    const title = await page.textContent('.lt-q');
    const opts = page.locator('[data-screen="q"] .lt-opt');
    const n = await opts.count();
    const nextVisible = await page.isVisible('.lt-next');
    if (nextVisible) { // متعدد الاختيار
      await opts.nth(0).click(); await opts.nth(1).click();
      if (i === 3 && picks.shotMulti) await shot(page, picks.shotMulti);
      await page.click('.lt-next');
    } else {
      await opts.nth(Math.min(n - 1, picks[i] ?? 2)).click();
    }
    if (i === 4 && picks.shotQ) await shot(page, picks.shotQ);
    await page.waitForFunction((t) => document.querySelector('.lt-q')?.textContent !== t || !document.querySelector('[data-screen="q"]:not([hidden])'), title);
  }
}

const browser = await chromium.launch();

// 1) ديسكتوب إنجليزي: التحمية + الأسئلة + النتيجة + البوابة + التقرير الكامل
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  await wire(ctx, 'desktop-en');
  const page = await ctx.newPage(); watch(page, 'desktop-en');
  await page.goto(`${BASE}/en/launch/?from=closing`, { waitUntil: 'load' });
  await page.waitForTimeout(800);
  await shot(page, 'd-en-1-intro.png');
  const h1 = await page.textContent('h1');
  if (!/legal work slips|nearly slipped/.test(h1)) note('desktop-en', 'h1 text: ' + h1);
  await page.click('.lt-rush-btn');
  await page.waitForTimeout(1300);
  for (let k = 0; k < 3; k++) { const b = page.locator('.rbubble[data-state="wait"]').first(); if (await b.count()) { await b.click().catch(() => {}); await page.waitForTimeout(600); } }
  await shot(page, 'd-en-2-rush.png');
  await page.waitForSelector('.rush-stage.done', { timeout: 9000 });
  await page.waitForTimeout(900);
  await shot(page, 'd-en-3-rush-summary.png');
  const sum = await page.textContent('.rush-sum');
  if (!/You (answered|handled) \d+ of 12/.test(sum)) note('desktop-en', 'rush summary: ' + sum);
  const t0 = Date.now();
  await page.waitForSelector('[data-screen="q"]:not([hidden])', { timeout: 6000 });
  const rushTotal = Date.now() - t0;
  await answerAll(page, { shotQ: 'd-en-4-question.png', shotMulti: 'd-en-4b-multi.png' });
  await page.waitForSelector('[data-screen="reveal"]:not([hidden])', { timeout: 8000 });
  await page.waitForTimeout(1200);
  await shot(page, 'd-en-5-reveal.png');
  const arch = await page.textContent('.lt-arch');
  if (!arch?.trim()) note('desktop-en', 'no archetype');
  if (!/^#r=[0-9a-z]{10}$/.test(new URL(page.url()).hash)) note('desktop-en', 'no share hash: ' + page.url());
  // البوابة: خطأ أولاً ثم إرسال صحيح
  await page.click('.lt-gate button[type="submit"]');
  const errs = await page.locator('.lt-gate .err:not(:empty)').count();
  if (errs < 3) note('desktop-en', `gate validation showed ${errs} errors`);
  await page.fill('#lt-name', 'Test Owner'); await page.fill('#lt-wa', '0770 123 4567');
  await page.fill('#lt-biz', 'Test Clinic'); await page.fill('#lt-city', 'Baghdad');
  await page.check('[name="consent_contact"]');
  await shot(page, 'd-en-6-gate.png');
  await page.click('.lt-gate button[type="submit"]');
  await page.waitForSelector('[data-screen="report"]:not([hidden])', { timeout: 8000 });
  await page.waitForTimeout(600);
  const mode = await page.getAttribute('[data-screen="report"]', 'data-mode');
  if (mode !== 'full') note('desktop-en', 'report mode ' + mode);
  if (!(await page.locator('.lt-chart polyline').count())) note('desktop-en', 'no forecast chart');
  if ((await page.locator('.lt-plan li').count()) !== 3) note('desktop-en', 'plan steps != 3');
  // تغيير الافتراض يغيّر المبلغ
  const before = await page.textContent('[data-n="money"]');
  await page.fill('#lt-av', '5000000');
  const after = await page.textContent('[data-n="money"]');
  if (before === after) note('desktop-en', 'assumption change did not update money');
  // حدّد خطتك
  await page.locator('.lt-sq').nth(0).locator('.lt-chip').first().click();
  await page.waitForTimeout(1200);
  const wa = await page.getAttribute('.lt-wa', 'href');
  if (!/^https:\/\/wa\.me\/\d+\?text=.*NW-/.test(decodeURIComponent(wa || ''))) note('desktop-en', 'whatsapp link: ' + wa);
  await shot(page, 'd-en-7-report.png', true);
  console.log('rush → Q1 handoff (ms):', rushTotal);
  await ctx.close();
}

// 2) موبايل عربي: تخطي التحمية، ثم "مو هسه" = تقرير مختصر
{
  const ctx = await browser.newContext({ ...devices['iPhone 13'] });
  await wire(ctx, 'phone-ar');
  const page = await ctx.newPage(); watch(page, 'phone-ar');
  await page.goto(`${BASE}/ar/launch/?service=erp-systems`, { waitUntil: 'load' });
  await page.waitForTimeout(800);
  await shot(page, 'm-ar-1-intro.png');
  if ((await page.getAttribute('html', 'dir')) !== 'rtl') note('phone-ar', 'not rtl');
  await page.click('.lt-skip-btn');
  await answerAll(page, { shotQ: 'm-ar-2-question.png', 8: 99 });
  await page.waitForSelector('[data-screen="reveal"]:not([hidden])', { timeout: 8000 });
  await page.waitForTimeout(1200);
  await shot(page, 'm-ar-3-reveal.png', true);
  const ov = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (ov > 0) note('phone-ar', `horizontal overflow ${ov}px`);
  await page.click('[data-act="gate-skip"]');
  await page.waitForSelector('[data-screen="report"]:not([hidden])');
  if ((await page.getAttribute('[data-screen="report"]', 'data-mode')) !== 'lite') note('phone-ar', 'skip did not give lite report');
  await shot(page, 'm-ar-4-lite.png', true);
  await ctx.close();
}

// 3) بدون حركة: التحمية لوحة ثابتة
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });
  await wire(ctx, 'reduced');
  const page = await ctx.newPage(); watch(page, 'reduced');
  await page.goto(`${BASE}/en/launch/`, { waitUntil: 'load' });
  await page.click('.lt-rush-btn');
  await page.waitForSelector('.rush-static');
  await shot(page, 'r-en-rush-static.png');
  await page.click('.rush-static .lt-next');
  await page.waitForSelector('[data-screen="q"]:not([hidden])');
  await ctx.close();
}

// 4) رابط مشاركة من شخص آخر + زر الختام في الرئيسية بنسخة B
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await wire(ctx, 'shared');
  await ctx.addInitScript(() => { try { localStorage.setItem('nawa-cta', 'b'); } catch {} });
  const page = await ctx.newPage(); watch(page, 'shared');
  await page.goto(`${BASE}/en/launch/#r=1220102201`, { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  if (await page.isHidden('.lt-shared')) note('shared', 'shared note hidden');
  if (await page.isVisible('.lt-gate')) note('shared', 'gate visible on shared result');
  await shot(page, 's-en-shared.png');
  const h1 = await page.textContent('h1');
  if (!/lose this week|nearly slipped/.test(h1)) note('shared', 'variant b h1 not applied: ' + h1);
  await page.goto(`${BASE}/en/`, { waitUntil: 'load' });
  const lbl = await page.textContent('.closing .cta-launch .btn-label');
  if (!/lose this week|nearly slipped/.test(lbl)) note('home', 'closing variant b label: ' + lbl);
  const href = await page.getAttribute('.closing .cta-launch', 'href');
  if (!href?.startsWith('/en/launch/')) note('home', 'closing href ' + href);
  await page.locator('.closing .cta-launch').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await shot(page, 'h-en-closing.png');
  await ctx.close();
}
await browser.close();
console.log('API calls:\n  ' + [...new Set(apiCalls)].join('\n  '));
console.log(problems.length ? `\n${problems.length} problem(s):\n- ` + problems.join('\n- ') : '\nNo problems found.');
process.exit(problems.length ? 1 : 0);
