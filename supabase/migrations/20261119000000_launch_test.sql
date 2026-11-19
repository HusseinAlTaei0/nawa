-- =============================================================================
-- NAWA · "اكتشف ليش تخسر زبائنك" (Launch Test)
-- الجداول: launch_visits (القمع/funnel لكل زائر) · launch_sessions (الأجوبة والنتيجة) · launch_leads (بيانات التواصل)
-- الأمان: RLS مفعّل بدون أي سياسة = لا وصول للمفاتيح العامة (anon/authenticated).
--         الكتابة فقط من Netlify Function بمفتاح service_role (لا يظهر في المتصفح أبداً).
-- =============================================================================

create extension if not exists pgcrypto;

-- 1) القمع: صف واحد لكل زائر مجهول (معرّف عشوائي من المتصفح)، وأقصى خطوة وصلها
--    الخطوات: 0 فتح الصفحة · 1 بدأ الأسئلة · 2..10 بعد كل سؤال · 11 النتيجة · 12 ترك الرقم · 13 الواتساب · 14 حدّد خطته
create table if not exists public.launch_visits (
  anon_id       uuid primary key,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  lang          text check (lang in ('en', 'ar')),
  cta_variant   text check (cta_variant in ('a', 'b')),
  saw_cta       boolean not null default false,       -- شاف زر الدعوة في آخر صفحة (مقام اختبار A/B)
  source_from   text,
  device        text check (device in ('mobile', 'desktop')),
  max_step      int not null default -1,
  rush_played   boolean,
  rush_answered int,
  rush_total    int
);

-- 2) الجلسة: الأجوبة كأعمدة منفصلة (سهلة للتحليل) + النتيجة المحسوبة في السيرفر
create table if not exists public.launch_sessions (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  token_hash      text not null,                    -- sha256 لرمز يملكه متصفح الزائر فقط (للتحديثات اللاحقة)
  anon_id         uuid,
  code            text,                              -- كود النتيجة NW-XXXXX الذي يرسله الزائر بالواتساب
  lang            text check (lang in ('en', 'ar')),
  cta_variant     text check (cta_variant in ('a', 'b')),
  -- الأجوبة الأساسية
  industry text, team text, volume text, channels text[], reply text, vanish text, hours text, system text, bottleneck text,
  -- "حدّد خطتك" (اختيارية)
  timeline text, decider text, band text, worry text,
  answers         jsonb not null default '{}'::jsonb,
  durations_ms    int[],
  rush_played     boolean, rush_answered int, rush_total int,
  -- النتيجة
  score int, archetype text, inquiries int,
  lost_lo int, lost_hi int, recoverable_lo int, recoverable_hi int, hours_free_lo int, hours_free_hi int,
  money_lo bigint, money_hi bigint, assumption_value bigint, assumption_conv numeric(5,4),
  -- تقييم الـ lead (داخلي للمبيعات)
  fit int, intent int, lead_score int, grade text check (grade in ('A', 'B', 'C')),
  -- المصدر
  source_from text, utm_source text, utm_medium text, utm_campaign text, referrer text, device text,
  ip_hash         text,                              -- sha256 مملّح لعنوان IP: لمنع الإساءة فقط، لا يمكن عكسه
  whatsapp_clicked boolean not null default false,
  total_ms        int
);
create index if not exists launch_sessions_created_idx on public.launch_sessions (created_at desc);
create index if not exists launch_sessions_ip_idx on public.launch_sessions (ip_hash, created_at desc);
create index if not exists launch_sessions_anon_idx on public.launch_sessions (anon_id);

-- 3) الـ lead: بيانات التواصل والموافقة، ومرحلة البيع (CRM بسيط)
create table if not exists public.launch_leads (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  session_id        uuid not null unique references public.launch_sessions(id) on delete cascade,
  name              text not null,
  business          text,
  city              text,
  whatsapp          text not null,                   -- أرقام فقط بالصيغة الدولية بدون + (مثل 9647701234567)
  consent_contact   boolean not null,
  consent_marketing boolean not null default false,
  consent_at        timestamptz not null default now(),
  consent_text      text,                            -- نص الموافقة كما رآه الزائر (إثبات)
  status            text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost')),
  owner             text,
  notes             text,
  contacted_at      timestamptz,
  alerted_telegram  boolean not null default false,
  alerted_email     boolean not null default false
);
create index if not exists launch_leads_created_idx on public.launch_leads (created_at desc);
create index if not exists launch_leads_status_idx on public.launch_leads (status);

-- RLS: مفعّل وبدون سياسات = المفاتيح العامة لا تقرأ ولا تكتب شيئاً
alter table public.launch_visits   enable row level security;
alter table public.launch_sessions enable row level security;
alter table public.launch_leads    enable row level security;
revoke all on public.launch_visits, public.launch_sessions, public.launch_leads from anon, authenticated;

-- 4) تتبّع القمع بعملية واحدة (insert أو تحديث أقصى خطوة) — تُستدعى من الـ Function فقط
create or replace function public.launch_track(
  p_anon uuid, p_step int, p_variant text, p_lang text, p_from text, p_device text,
  p_rush_played boolean default null, p_rush_answered int default null, p_rush_total int default null
) returns void
language sql
security invoker
set search_path = public
as $$
  insert into public.launch_visits as v (anon_id, lang, cta_variant, saw_cta, source_from, device, max_step, rush_played, rush_answered, rush_total)
  values (p_anon, p_lang, p_variant, p_step = -1, nullif(p_from, ''), p_device, greatest(p_step, -1), p_rush_played, p_rush_answered, p_rush_total)
  on conflict (anon_id) do update set
    updated_at    = now(),
    saw_cta       = v.saw_cta or excluded.saw_cta,
    max_step      = greatest(v.max_step, excluded.max_step),
    lang          = coalesce(excluded.lang, v.lang),
    cta_variant   = coalesce(v.cta_variant, excluded.cta_variant),
    source_from   = coalesce(v.source_from, excluded.source_from),
    device        = coalesce(v.device, excluded.device),
    rush_played   = coalesce(excluded.rush_played, v.rush_played),
    rush_answered = coalesce(excluded.rush_answered, v.rush_answered),
    rush_total    = coalesce(excluded.rush_total, v.rush_total);
$$;
revoke all on function public.launch_track(uuid, int, text, text, text, text, boolean, int, int) from public, anon, authenticated;
grant execute on function public.launch_track(uuid, int, text, text, text, text, boolean, int, int) to service_role;

-- 5) لوحات القراءة (security_invoker حتى لا تتجاوز RLS)
-- القمع لكل نسخة عنوان ولغة: كم شاف الزر، فتح الصفحة، بدأ، أجاب كل سؤال، شاف النتيجة، ترك رقمه، ضغط الواتساب
create or replace view public.v_launch_funnel with (security_invoker = true) as
select
  coalesce(cta_variant, '?') as cta_variant,
  coalesce(lang, '?')        as lang,
  count(*) filter (where saw_cta)        as saw_cta,
  count(*) filter (where max_step >= 0)  as opened,
  count(*) filter (where max_step >= 1)  as started,
  count(*) filter (where rush_played)    as played_rush,
  count(*) filter (where max_step >= 2)  as q1, count(*) filter (where max_step >= 3) as q2, count(*) filter (where max_step >= 4) as q3,
  count(*) filter (where max_step >= 5)  as q4, count(*) filter (where max_step >= 6) as q5, count(*) filter (where max_step >= 7) as q6,
  count(*) filter (where max_step >= 8)  as q7, count(*) filter (where max_step >= 9) as q8, count(*) filter (where max_step >= 10) as q9,
  count(*) filter (where max_step >= 11) as reveal,
  count(*) filter (where max_step >= 12) as lead,
  count(*) filter (where max_step >= 13) as whatsapp
from public.launch_visits
group by 1, 2;

-- قائمة الـ leads للمبيعات: الأحدث أولاً، مع التقييم وأهم الأجوبة ورابط واتساب مباشر
create or replace view public.v_launch_leads with (security_invoker = true) as
select
  l.created_at, l.status, s.grade, s.lead_score, l.name, l.business, l.city,
  'https://wa.me/' || l.whatsapp as whatsapp_link, s.code, s.archetype, s.score,
  s.industry, s.team, s.volume, s.channels, s.reply, s.vanish, s.hours, s.system, s.bottleneck,
  s.timeline, s.decider, s.band, s.worry,
  s.lost_lo, s.lost_hi, s.money_lo, s.money_hi, s.whatsapp_clicked, s.cta_variant, s.lang, s.source_from, s.utm_source,
  l.consent_marketing, l.notes, l.id as lead_id, s.id as session_id
from public.launch_leads l
join public.launch_sessions s on s.id = l.session_id
order by l.created_at desc;

-- توزيع الأجوبة (لأبحاث السوق والتسويق): كل سؤال × كل جواب × العدد
create or replace view public.v_launch_answers with (security_invoker = true) as
select q.key as question, q.value as answer, count(*) as n
from public.launch_sessions s
cross join lateral (
  select 'industry' as key, s.industry as value union all select 'team', s.team union all select 'volume', s.volume
  union all select 'reply', s.reply union all select 'vanish', s.vanish union all select 'hours', s.hours
  union all select 'system', s.system union all select 'bottleneck', s.bottleneck union all select 'timeline', s.timeline
  union all select 'decider', s.decider union all select 'band', s.band union all select 'worry', s.worry
  union all select 'archetype', s.archetype union all select 'channel', unnest(s.channels)
) q
where q.value is not null
group by 1, 2
order by 1, 3 desc;

revoke all on public.v_launch_funnel, public.v_launch_leads, public.v_launch_answers from anon, authenticated;

-- 6) الاحتفاظ: حذف بيانات التواصل بعد 12 شهراً من آخر نشاط (كما في صفحة الخصوصية)
--    شغّلها شهرياً (pg_cron أو يدوياً): select public.launch_purge();
create or replace function public.launch_purge() returns int
language sql
security invoker
set search_path = public
as $$
  with d as (
    delete from public.launch_leads
    where coalesce(contacted_at, created_at) < now() - interval '12 months' and status <> 'won'
    returning 1
  ) select count(*)::int from d;
$$;
revoke all on function public.launch_purge() from public, anon, authenticated;
grant execute on function public.launch_purge() to service_role;
