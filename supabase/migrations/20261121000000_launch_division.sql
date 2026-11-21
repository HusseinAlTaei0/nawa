-- =============================================================================
-- NAWA Legal Tech: التشخيص (/launch) صار مشتركاً بين فروع نوى.
--
-- ما يتغير:
--   1) عمود division في launch_sessions: 'agency' (كل الصفوف القديمة) أو 'legal' (الحالي)
--   2) أجوبة فرع legal لها مفاتيح جديدة (practice, deadlines, misses, storage...). تُحفظ كاملة في answers (jsonb)
--      والمشترك منها فقط في الأعمدة القديمة (team, volume, channels, hours, bottleneck, timeline, decider, band, worry).
--      معنى العمود يُقرأ دائماً مع division (volume في legal = عدد الملفات المفتوحة، لا عدد الرسائل)
--   3) العروض v_launch_leads و v_launch_answers تعرض division وتقرأ الأجوبة من answers حتى تعمل للفرعين
--
-- ⚠️ طبّق هذا الملف قبل نشر الموقع الجديد: الـ Function يرسل division، وبدونه يفشل حفظ الجلسة
--    (الـ lead لا يضيع: يصل على Telegram والبريد مع ملاحظة "Not saved to the database").
-- =============================================================================

alter table public.launch_sessions
  add column if not exists division text not null default 'agency' check (division in ('agency', 'legal'));

create index if not exists launch_sessions_division_idx on public.launch_sessions (division, created_at desc);

-- قائمة الـ leads للمبيعات: نفس السابق + الفرع + كل الأجوبة (jsonb) حتى تظهر أسئلة legal الجديدة
drop view if exists public.v_launch_leads;
create view public.v_launch_leads with (security_invoker = true) as
select
  l.created_at, s.division, l.status, s.grade, s.lead_score, l.name, l.business, l.city,
  'https://wa.me/' || l.whatsapp as whatsapp_link, s.code, s.archetype, s.score,
  s.answers,
  s.industry, s.team, s.volume, s.channels, s.reply, s.vanish, s.hours, s.system, s.bottleneck,
  s.timeline, s.decider, s.band, s.worry,
  s.lost_lo, s.lost_hi, s.hours_free_lo, s.hours_free_hi, s.money_lo, s.money_hi,
  s.whatsapp_clicked, s.cta_variant, s.lang, s.source_from, s.utm_source,
  l.consent_marketing, l.notes, l.id as lead_id, s.id as session_id
from public.launch_leads l
join public.launch_sessions s on s.id = l.session_id
order by l.created_at desc;

-- توزيع الأجوبة لكل فرع: يقرأ من answers (jsonb) فيعمل مع أي أسئلة
drop view if exists public.v_launch_answers;
create view public.v_launch_answers with (security_invoker = true) as
select s.division, q.key as question, q.value as answer, count(*) as n
from public.launch_sessions s
cross join lateral (
  select e.key, e.value #>> '{}' as value from jsonb_each(coalesce(s.answers, '{}'::jsonb)) e where jsonb_typeof(e.value) = 'string'
  union all select 'channel', c from jsonb_array_elements_text(case when jsonb_typeof(s.answers -> 'channels') = 'array' then s.answers -> 'channels' else '[]'::jsonb end) c
  union all select 'archetype', s.archetype
) q
where q.value is not null
group by 1, 2, 3
order by 1, 2, 4 desc;

revoke all on public.v_launch_leads, public.v_launch_answers from anon, authenticated;
