/**
 * اختبارات محرك Launch Test (بدون أي مكتبة): node --test --experimental-strip-types tests/
 * تتأكد أن الأرقام نطاقات منطقية، وأن الهوية والخطة والتقييم مشروطة بالأجوبة فعلاً.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  compute, archetype, orbitScore, leadScore, encode, decode, sanitize, isComplete, nice, resultCode, plan,
  OPTIONS, CORE, type Answers,
} from '../src/scripts/launch/engine.ts';

const base: Answers = {
  industry: 'clinic', team: 'small', volume: 'v2', channels: ['whatsapp', 'instagram'],
  reply: 'hour', vanish: 'some', hours: 'h2', system: 'excel', bottleneck: 'replies',
};

test('complete answers are detected', () => {
  assert.equal(isComplete(base), true);
  assert.equal(isComplete({ ...base, channels: [] }), false);
  const { bottleneck, ...rest } = base; void bottleneck;
  assert.equal(isComplete(rest), false);
});

test('sanitize drops unknown keys and values', () => {
  const s = sanitize({ industry: 'clinic', team: 'huge', channels: ['whatsapp', 'fax', 'whatsapp'], evil: '<script>' });
  assert.deepEqual(s, { industry: 'clinic', channels: ['whatsapp'] });
  assert.deepEqual(sanitize(null), {});
  assert.deepEqual(sanitize('x'), {});
});

test('every archetype is reachable and conditioned on answers', () => {
  assert.equal(archetype({ ...base, team: 'solo', volume: 'v2' }), 'lone');
  assert.equal(archetype({ ...base, volume: 'v3', reply: 'morning' }), 'crowded');
  assert.equal(archetype({ ...base, system: 'paper' }), 'drifting');
  assert.equal(archetype({ ...base, vanish: 'most' }), 'leak');
  assert.equal(archetype({ ...base, system: 'software', reply: 'minutes', vanish: 'few', hours: 'h1', channels: ['whatsapp', 'instagram', 'phone'] }), 'ready');
  assert.equal(archetype(base), 'steady');
});

test('orbit score stays in 0..100 for every combination of scored answers', () => {
  let min = 100, max = 0;
  for (const system of OPTIONS.system) for (const reply of OPTIONS.reply) for (const vanish of OPTIONS.vanish) for (const hours of OPTIONS.hours) for (let n = 1; n <= 7; n++) {
    const s = orbitScore({ system, reply, vanish, hours, channels: OPTIONS.channels.slice(0, n) as Answers['channels'] });
    min = Math.min(min, s); max = Math.max(max, s);
  }
  assert.ok(min >= 0 && max <= 100, `${min}..${max}`);
  assert.equal(max, 100);
});

test('ranges are ordered, positive and respond to inputs', () => {
  const r = compute(base);
  for (const k of ['lost', 'recoverable', 'customers', 'money', 'hoursFree'] as const) {
    assert.ok(r[k][0] <= r[k][1], `${k} ordered`);
    assert.ok(r[k][0] >= 0, `${k} non-negative`);
  }
  assert.ok(r.recoverable[1] <= r.lost[1], 'recoverable never exceeds lost');
  const busier = compute({ ...base, volume: 'v4' });
  assert.ok(busier.lost[0] > r.lost[0], 'more volume -> more lost');
  const slower = compute({ ...base, reply: 'late' });
  assert.ok(slower.recoverable[0] > r.recoverable[0], 'slower reply -> more recoverable');
  const custom = compute(base, { value: 1_000_000 });
  assert.ok(custom.money[0] > r.money[0], 'assumption override changes money');
  assert.equal(compute(base, { conv: 7 }).assumptions.conv, r.assumptions.conv, 'invalid override ignored');
});

test('forecast: automated path never below current and starts after the setup month', () => {
  const { forecast } = compute({ ...base, reply: 'late', vanish: 'most' });
  assert.equal(forecast.current.length, 12);
  assert.equal(forecast.automated[0], forecast.current[0]);
  forecast.automated.forEach((v, i) => assert.ok(v >= forecast.current[i]));
  assert.ok(forecast.automated[11] > forecast.current[11]);
});

test('plan follows bottleneck and current system', () => {
  assert.deepEqual(plan({ ...base, bottleneck: 'admin', system: 'paper' }).map((s) => s.key), ['erp', 'crm', 'report']);
  assert.deepEqual(plan({ ...base, bottleneck: 'presence' }).map((s) => s.key), ['presence', 'excel', 'brand']);
  assert.equal(plan(base)[0].service, 'ai-agents');
});

test('lead score grades', () => {
  assert.equal(leadScore({ ...base, volume: 'v4', team: 'mid', hours: 'h4', timeline: 'now', decider: 'me', band: 'b4' }).grade, 'A');
  assert.equal(leadScore({ ...base, volume: 'v1', team: 'solo', hours: 'h1', industry: 'other', timeline: 'curious', decider: 'committee', band: 'b1' }).grade, 'C');
  const s = leadScore(base);
  assert.equal(s.total, s.fit + s.intent);
  assert.ok(s.fit <= 50 && s.intent <= 50);
});

test('share code round-trips every core answer and rejects garbage', () => {
  const a: Answers = { ...base, channels: ['whatsapp', 'telegram', 'website'] };
  const code = encode(a);
  assert.equal(code.length, CORE.length + 1);
  assert.deepEqual(decode(code), sanitize(a));
  assert.equal(decode('zzzzzzzzzz'), null);
  assert.equal(decode(''), null);
  assert.equal(encode({ industry: 'clinic' }), '');
});

test('nice rounding and result code', () => {
  assert.equal(nice(1234), 1200);
  assert.equal(nice(87), 87);
  assert.equal(nice(-5), 0);
  assert.match(resultCode(), /^NW-[A-HJ-NP-Z2-9]{5}$/);
});
