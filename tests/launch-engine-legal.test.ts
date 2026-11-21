/**
 * اختبارات محرك فرع NAWA Legal Tech ("اكتشف وين يضيع شغلك القانوني"): node --test --experimental-strip-types tests/
 * تتأكد أن الأرقام نطاقات منطقية، وأن الهوية والخطة والتقييم مشروطة بالأجوبة فعلاً.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  compute, archetype, orbitScore, leadScore, encode, decode, sanitize, isComplete, plan, planetShape, alertLines,
  OPTIONS, CORE, SERVICE_TO_FOCUS, DIVISION, type Answers,
} from '../src/scripts/launch/engines/legal.ts';
import * as active from '../src/scripts/launch/engine.ts';

const base: Answers = {
  practice: 'litigation', team: 'small', volume: 'm2', channels: ['whatsapp', 'phone'],
  deadlines: 'calendar', misses: 'once', hours: 'h2', storage: 'folders', bottleneck: 'deadlines',
};

test('the active engine is the legal one', () => {
  assert.equal(DIVISION, 'legal');
  assert.equal(active.DIVISION, 'legal');
});

test('complete answers are detected', () => {
  assert.equal(isComplete(base), true);
  assert.equal(isComplete({ ...base, channels: [] }), false);
  const { storage, ...rest } = base; void storage;
  assert.equal(isComplete(rest), false);
});

test('sanitize drops unknown keys, values and agency answers', () => {
  const s = sanitize({ practice: 'litigation', industry: 'clinic', team: 'huge', channels: ['whatsapp', 'instagram', 'whatsapp'], evil: '<script>' });
  assert.deepEqual(s, { practice: 'litigation', channels: ['whatsapp'] });
});

test('every archetype is reachable and conditioned on answers', () => {
  assert.equal(archetype({ ...base, team: 'solo', volume: 'm2' }), 'lone');
  assert.equal(archetype({ ...base, volume: 'm3', deadlines: 'memory' }), 'crowded');
  assert.equal(archetype({ ...base, storage: 'whatsapp' }), 'drifting');
  assert.equal(archetype({ ...base, misses: 'often' }), 'closepass');
  assert.equal(archetype({ ...base, deadlines: 'system', misses: 'none', storage: 'software', hours: 'h1' }), 'ready');
  assert.equal(archetype(base), 'steady');
});

test('orbit score stays in 0..100 for every combination of scored answers', () => {
  let min = 100, max = 0;
  for (const deadlines of OPTIONS.deadlines) for (const misses of OPTIONS.misses) for (const storage of OPTIONS.storage) for (const hours of OPTIONS.hours) for (let n = 0; n <= 7; n++) {
    const s = orbitScore({ deadlines, misses, storage, hours, channels: OPTIONS.channels.slice(0, n) as Answers['channels'] });
    min = Math.min(min, s); max = Math.max(max, s);
  }
  assert.ok(min >= 0 && max <= 100, `${min}..${max}`);
  assert.ok(max >= 95, 'a well-run office can reach the top');
});

test('ranges are ordered, positive and respond to inputs', () => {
  const r = compute(base);
  for (const k of ['lost', 'recoverable', 'customers', 'money', 'hoursFree'] as const) {
    assert.ok(r[k][0] <= r[k][1], `${k} ordered`);
    assert.ok(r[k][0] >= 0, `${k} non-negative`);
  }
  assert.ok(r.recoverable[1] <= r.lost[1], 'caught never exceeds at risk');
  assert.ok(compute({ ...base, volume: 'm4' }).lost[0] > r.lost[0], 'more matters -> more deadlines at risk');
  assert.ok(compute({ ...base, deadlines: 'memory' }).lost[0] > r.lost[0], 'weaker tracking -> more at risk');
  assert.ok(compute({ ...base, misses: 'often' }).lost[0] > r.lost[0], 'self-reported near-misses count');
  assert.ok(compute({ ...base, hours: 'h4' }).hoursFree[0] > r.hoursFree[0], 'more repetitive hours -> more freed');
  assert.ok(compute(base, { value: 500_000 }).money[0] > r.money[0], 'assumption override changes money');
  assert.equal(compute(base, { conv: 7 }).assumptions.conv, r.assumptions.conv, 'invalid override ignored');
});

test('freed hours stay a minority of the repetitive hours (a lawyer reviews everything)', () => {
  const r = compute({ ...base, hours: 'h4' });
  assert.ok(r.hoursFree[1] <= r.hours * 0.5 + 1);
});

test('forecast: automated path never below current and starts after the setup month', () => {
  const { forecast } = compute({ ...base, deadlines: 'memory', misses: 'often', volume: 'm3' });
  assert.equal(forecast.current.length, 12);
  assert.equal(forecast.automated[0], forecast.current[0]);
  forecast.automated.forEach((v, i) => assert.ok(v >= forecast.current[i]));
  assert.ok(forecast.automated[11] > forecast.current[11]);
});

test('plan follows the bottleneck and where files live, without repeating a service', () => {
  assert.deepEqual(plan({ ...base, bottleneck: 'research', storage: 'paper' }).map((s) => s.key), ['assistant', 'digitize', 'report']);
  assert.deepEqual(plan({ ...base, bottleneck: 'documents', storage: 'paper' }).map((s) => s.key), ['archive', 'matters', 'report']);
  assert.deepEqual(plan({ ...base, bottleneck: 'reporting' }).map((s) => s.key), ['dashboard', 'structure', 'assistant']);
  for (const bottleneck of OPTIONS.bottleneck) for (const storage of OPTIONS.storage) {
    const p = plan({ ...base, bottleneck, storage });
    assert.notEqual(p[0].service, p[1].service, `${bottleneck}/${storage}`);
  }
});

test('every service slug maps back to a question answer', () => {
  const slugs = new Set(Object.keys(SERVICE_TO_FOCUS));
  for (const b of OPTIONS.bottleneck) for (const st of OPTIONS.storage) for (const s of plan({ ...base, bottleneck: b, storage: st })) assert.ok(slugs.has(s.service), s.service);
});

test('planet shape is complete and bounded', () => {
  const p = planetShape(base);
  assert.equal(p.form, 1);
  for (const v of [p.density, p.ring, p.glow, p.leak, p.order]) assert.ok(v >= 0 && v <= 1);
  assert.equal(planetShape({}).form, 0.04);
});

test('lead score grades', () => {
  assert.equal(leadScore({ ...base, volume: 'm4', team: 'mid', hours: 'h4', timeline: 'now', decider: 'me', band: 'b4' }).grade, 'A');
  assert.equal(leadScore({ ...base, volume: 'm1', team: 'solo', hours: 'h1', practice: 'other', timeline: 'curious', decider: 'committee', band: 'b1' }).grade, 'C');
});

test('alert lines are plain text with the key facts', () => {
  const lines = alertLines({ ...base, timeline: 'now' }, compute(base));
  assert.ok(lines.join('\n').includes('Litigation firm'));
  assert.ok(lines.join('\n').includes('Deadlines at risk'));
  assert.ok(lines.join('\n').includes('this month'));
});

test('share code round-trips every core answer and rejects garbage', () => {
  const a: Answers = { ...base, channels: ['whatsapp', 'telegram', 'portal'] };
  const code = encode(a);
  assert.equal(code.length, CORE.length + 1);
  assert.deepEqual(decode(code), sanitize(a));
  assert.equal(decode('zzzzzzzzzz'), null);
  assert.equal(encode({ practice: 'litigation' }), '');
});
