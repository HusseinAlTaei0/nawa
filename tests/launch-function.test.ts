/**
 * اختبارات Netlify Function بدون شبكة: fetch مُستبدل بمحاكاة لـ Supabase و Telegram و Resend.
 */
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import handler, { normalizePhone } from '../netlify/functions/launch.mts';

type Call = { url: string; method: string; body: any; headers: Record<string, string> };
let calls: Call[] = [];
let sessionsInHour = 0;
const realFetch = globalThis.fetch;

function mockFetch(opts: { failDb?: boolean } = {}) {
  globalThis.fetch = (async (input: any, init: any = {}) => {
    const url = String(input), method = init.method || 'GET';
    const body = init.body ? JSON.parse(init.body) : null;
    calls.push({ url, method, body, headers: init.headers || {} });
    if (url.includes('supabase.test')) {
      if (opts.failDb) return new Response('boom', { status: 500 });
      if (method === 'HEAD') return new Response(null, { status: 200, headers: { 'content-range': `0-0/${sessionsInHour}` } });
      if (url.includes('/launch_sessions') && method === 'POST') return Response.json([{ id: '11111111-1111-4111-8111-111111111111' }]);
      if (url.includes('/launch_sessions') && method === 'GET') return Response.json([{ id: '11111111-1111-4111-8111-111111111111', answers: { industry: 'clinic' }, grade: 'C' }]);
      if (url.includes('/launch_leads') && method === 'GET') return Response.json([{ name: 'Ali', whatsapp: '9647701234567' }]);
      if (method === 'POST') return Response.json([{}]);
      return new Response(null, { status: 204 });
    }
    if (url.includes('api.telegram.org') || url.includes('api.resend.com')) return Response.json({ ok: true });
    return new Response('unexpected', { status: 599 });
  }) as typeof fetch;
}

const env = { SUPABASE_URL: 'https://supabase.test', SUPABASE_SERVICE_ROLE_KEY: 'srk', TELEGRAM_BOT_TOKEN: 'tg', TELEGRAM_CHAT_ID: '1', RESEND_API_KEY: 're', LEAD_EMAIL_TO: 'a@b.c' };
const answers = { industry: 'clinic', team: 'small', volume: 'v3', channels: ['whatsapp'], reply: 'morning', vanish: 'half', hours: 'h3', system: 'paper', bottleneck: 'replies' };
const leadBody = (extra: Record<string, unknown> = {}) => ({
  anon: '22222222-2222-4222-8222-222222222222', variant: 'a', lang: 'ar', code: 'NW-ABCDE', answers, ms: 60000,
  contact: { name: 'Ali <b>', business: 'Clinic', city: 'Baghdad', whatsapp: '0770 123 4567' }, consent: { contact: true, marketing: false }, hp: '',
  ...extra,
});
const req = (action: string, body: unknown, headers: Record<string, string> = {}) =>
  new Request(`https://nawa-iq.com/api/launch/${action}`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });
const ctx = (action: string) => ({ params: { action }, ip: '1.2.3.4' });

beforeEach(() => {
  calls = []; sessionsInHour = 0;
  for (const k of Object.keys(env)) process.env[k] = (env as Record<string, string>)[k];
  mockFetch();
});
process.on('exit', () => { globalThis.fetch = realFetch; });

test('normalizes Iraqi numbers', () => {
  assert.equal(normalizePhone('0770 123 4567'), '9647701234567');
  assert.equal(normalizePhone('+964 770 123 4567'), '9647701234567');
  assert.equal(normalizePhone('00964 7701234567'), '9647701234567');
  assert.equal(normalizePhone('12345'), null);
});

test('lead: saves session + lead, alerts Telegram and email, escapes user text', async () => {
  const res = await handler(req('lead', leadBody()), ctx('lead'));
  assert.equal(res.status, 200);
  const out = await res.json();
  assert.equal(out.saved, true);
  assert.ok(out.token && out.id);
  const sess = calls.find((c) => c.url.endsWith('/launch_sessions') && c.method === 'POST')!;
  assert.equal(sess.body.grade !== undefined, true);
  assert.equal(sess.body.archetype, 'crowded');
  assert.ok(/^[0-9a-f]{64}$/.test(sess.body.token_hash), 'token stored only as hash');
  assert.equal(sess.body.ip_hash.length, 32);
  assert.ok(!JSON.stringify(sess.body).includes('1.2.3.4'), 'raw IP never stored');
  const lead = calls.find((c) => c.url.endsWith('/launch_leads') && c.method === 'POST')!;
  assert.equal(lead.body.whatsapp, '9647701234567');
  const tg = calls.find((c) => c.url.includes('telegram'))!;
  assert.ok(tg.body.text.includes('Ali &lt;b&gt;'), 'user text escaped');
  assert.ok(tg.body.text.includes('&lt;10') || !tg.body.text.includes('<10'), 'labels escaped');
  assert.ok(tg.body.reply_markup.inline_keyboard[0][0].url.startsWith('https://wa.me/9647701234567'));
  assert.ok(calls.some((c) => c.url.includes('resend')));
});

test('lead: honeypot and too-fast submissions are silently dropped', async () => {
  let res = await handler(req('lead', leadBody({ hp: 'http://spam' })), ctx('lead'));
  assert.equal(res.status, 200); assert.equal(calls.length, 0);
  res = await handler(req('lead', leadBody({ ms: 1000 })), ctx('lead'));
  assert.equal(res.status, 200); assert.equal(calls.length, 0);
});

test('lead: validation errors', async () => {
  assert.equal((await handler(req('lead', leadBody({ consent: { contact: false } })), ctx('lead'))).status, 400);
  assert.equal((await handler(req('lead', leadBody({ contact: { name: 'A', whatsapp: '0770' } })), ctx('lead'))).status, 400);
  assert.equal((await handler(req('lead', leadBody({ answers: { industry: 'clinic' } })), ctx('lead'))).status, 400);
});

test('lead: database down still sends alerts', async () => {
  mockFetch({ failDb: true });
  const res = await handler(req('lead', leadBody()), ctx('lead'));
  assert.equal(res.status, 200);
  assert.equal((await res.json()).saved, false);
  const tg = calls.find((c) => c.url.includes('telegram'))!;
  assert.ok(tg.body.text.includes('Not saved'));
});

test('session: rate limit per IP hash', async () => {
  sessionsInHour = 20;
  const res = await handler(req('session', leadBody()), ctx('session'));
  assert.equal(res.status, 429);
});

test('rejects other origins, bad JSON and unknown actions', async () => {
  assert.equal((await handler(req('session', leadBody(), { Origin: 'https://evil.example' }), ctx('session'))).status, 403);
  assert.equal((await handler(new Request('https://nawa-iq.com/api/launch/session', { method: 'POST', body: '{' }), ctx('session'))).status, 400);
  assert.equal((await handler(req('nope', {}), ctx('nope'))).status, 404);
  assert.equal((await handler(new Request('https://nawa-iq.com/api/launch/event'), ctx('event'))).status, 405);
});

test('event: validated and sent to launch_track', async () => {
  assert.equal((await handler(req('event', { anon: 'x', step: 2 }), ctx('event'))).status, 400);
  const res = await handler(req('event', { anon: '22222222-2222-4222-8222-222222222222', step: 99, variant: 'b', lang: 'en' }), ctx('event'));
  assert.equal(res.status, 200);
  const rpc = calls.find((c) => c.url.includes('rpc/launch_track'))!;
  assert.equal(rpc.body.p_step, 14, 'step clamped');
  assert.equal(rpc.body.p_variant, 'b');
});

test('update: needs the session token; regrade triggers a Telegram note', async () => {
  const body = { id: '11111111-1111-4111-8111-111111111111', token: 'abc', sharpen: { timeline: 'now', decider: 'me', band: 'b4', hacked: 'x' } };
  const res = await handler(req('update', body), ctx('update'));
  assert.equal(res.status, 200);
  const get = calls.find((c) => c.method === 'GET' && c.url.includes('launch_sessions'))!;
  assert.ok(get.url.includes('token_hash=eq.'), 'token checked by hash');
  const patch = calls.find((c) => c.method === 'PATCH')!;
  assert.equal(patch.body.timeline, 'now');
  assert.equal(patch.body.hacked, undefined);
  assert.ok(calls.some((c) => c.url.includes('telegram') && c.body.text.includes('Lead update')));
  assert.equal((await handler(req('update', { id: 'bad', token: 'x' }), ctx('update'))).status, 403);
});

test('without any env: lead still answers 200 (alerts skipped, nothing thrown)', async () => {
  for (const k of Object.keys(env)) delete process.env[k];
  const res = await handler(req('lead', leadBody()), ctx('lead'));
  assert.equal(res.status, 200);
  assert.equal(calls.length, 0);
});
