/**
 * فرع NAWA Legal Tech: نصوص "اكتشف وين يضيع شغلك القانوني" (التشخيص /launch) باللغتين.
 * المنطق والأرقام في src/scripts/launch/engines/legal.ts؛ هنا الكلام فقط.
 *
 * قواعد الكتابة:
 *  - صوت نوى: هادئ، واثق، أرقام بدل الصفات، بدون علامات تعجب وبدون إيموجي
 *  - الأسئلة بالعربي بلهجة عراقية خفيفة، والنتيجة بعربية واضحة
 *  - كل جملة في النتيجة تحتوي متغيراً من أجوبة الزائر ({...}) حتى لا تكون نصاً عاماً
 *  - المتغيرات المتاحة: {practice} {team} {volume} {deadlines} {misses} {hours} {storage} {bottleneck}
 *  - لا نسأل أبداً عن تفاصيل قضية أو اسم موكل، ولا نخوّف بمبالغ: نتكلم عن مواعيد وساعات
 */
import type { Lang } from '../../../config/site';
import type { Key, Opt, Archetype, StepKey } from '../../../scripts/launch/engines/legal';

type OptLabels<K extends Key> = Record<Opt<K>, string>;
export interface QuestionCopy<K extends Key = Key> { title: string; hint?: string; options: OptLabels<K> }
type Questions = { [K in Key]: QuestionCopy<K> };

export interface LaunchCopy {
  meta: { title: string; description: string };
  eyebrow: string;
  /** العنوان الرئيسي: a = اختيار صاحب نوى، b = المنافس في اختبار A/B */
  h1: { a: string; b: string };
  sub: string;
  intro: { rush: string; skip: string; note: string };
  rush: {
    label: string; messages: string[]; reply: string; replied: string; typing: string; counter: string; time: string;
    summary: string; agent: string; agentTag: string; staticTitle: string; staticText: string; next: string;
  };
  flow: { progress: string; back: string; next: string; multiHint: string; planetLabel: string; restart: string };
  questions: Questions;
  /** صيغ قصيرة تُدرج داخل الجمل */
  short: { practice: OptLabels<'practice'>; team: OptLabels<'team'>; volume: OptLabels<'volume'>; deadlines: OptLabels<'deadlines'>; misses: OptLabels<'misses'>; hours: OptLabels<'hours'>; storage: OptLabels<'storage'>; bottleneck: OptLabels<'bottleneck'> };
  analysing: { title: string; steps: string[] };
  reveal: {
    eyebrow: string; scoreLabel: string; scoreNote: string; lostLabel: string; lostNote: string; rushQuote: string;
    sharedNote: string; sharedCta: string;
  };
  archetypes: Record<Archetype, { name: string; line: string }>;
  gate: {
    title: string; text: string; name: string; business: string; city: string; whatsapp: string; whatsappHint: string;
    consentContact: string; consentMarketing: string; privacy: string; submit: string; sending: string; fail: string;
    errName: string; errWhatsapp: string; errConsent: string; skip: string;
  };
  report: {
    eyebrow: string; title: string; code: string;
    /** perYear (اختياري): وحدة الرقمين lost و recoverable إذا كانا سنويين (فرع legal)، وإلا perMonth */
    numbers: { lost: string; recoverable: string; hours: string; money: string; perMonth: string; perYear?: string };
    assumptions: { title: string; value: string; conv: string; note: string };
    forecast: { title: string; text: string; current: string; automated: string; months: string; setup: string; gap: string };
    planTitle: string; stepLabel: string; more: string;
    method: { title: string; items: string[] };
  };
  steps: Record<StepKey, { title: string; text: string }>;
  sharpen: { title: string; text: string; saved: string };
  close: { title: string; text: string; wa: string; waMessage: string; share: string; shareText: string; download: string; copied: string; contact: string };
  noscript: string;
  currency: { unit: string; thousand: string; million: string };
}

export const launchCopy: Record<Lang, LaunchCopy> = {
  en: {
    meta: {
      title: 'Discover where your legal work slips',
      description: 'Nine quick answers, one honest diagnosis: how many deadlines come too close each year, how many hours go into searching and retyping, and the three steps that hold your practice together.',
    },
    eyebrow: 'Free diagnosis · 60 seconds',
    h1: { a: 'Discover where your *legal work slips*', b: 'How many deadlines *nearly slipped* this month?' },
    sub: '60 seconds. A result built from your answers. No case or client details asked.',
    intro: {
      rush: 'Try handling 6 seconds of an office day',
      skip: 'Skip to the questions',
      note: 'A short warm-up: real requests arrive at a law office. Handle as many as you can.',
    },
    rush: {
      label: 'Warm-up: requests arriving at the office',
      messages: [
        'Review this contract by tomorrow', 'Hearing on Sunday. Where is the file?', 'Has the power of attorney expired?', 'Which version was signed?',
        'Was the notification served?', 'Client asking for news', 'Appeal period ends when?', 'Need the 2019 ruling',
        'Lease renewal due this week', 'Send me a copy of the deed', 'Is Thursday’s session confirmed?', 'Any conflict with this client?',
      ],
      reply: 'Handle',
      replied: 'Handled',
      typing: 'Working',
      counter: '{a} of {t} handled',
      time: '{s}s',
      summary: 'You handled {a} of {t} in 6 seconds.',
      agent: 'The same 6 seconds with a NAWA system: {t} of {t} filed, dated or answered, each in under a second.',
      agentTag: 'System',
      staticTitle: '12 office requests in 6 seconds',
      staticText: 'One person handles about five of them. The rest wait in a diary, a cabinet or a phone, and some come back as missed dates. A system files, dates and answers all twelve in under a second each.',
      next: 'Continue to the questions',
    },
    flow: {
      progress: 'Question {i} of {n}',
      back: 'Back',
      next: 'Continue',
      multiHint: 'Choose all that apply',
      planetLabel: 'Your practice, built from your answers',
      restart: 'Start again',
    },
    questions: {
      practice: { title: 'Your practice is…', options: { litigation: 'A litigation firm', corporate: 'A corporate and contracts firm', general: 'A general practice', inhouse: 'A legal department in a company', other: 'Something else' } },
      team: { title: 'How many lawyers and staff work on legal matters?', options: { solo: 'Just me', small: '2 to 5', mid: '6 to 15', large: 'More than 15' } },
      volume: { title: 'Right now, how many open matters do you carry?', hint: 'Cases, contracts under work and ongoing files, together.', options: { m1: 'Fewer than 20', m2: '20 to 60', m3: '60 to 150', m4: 'More than 150' } },
      channels: { title: 'Where do new requests and documents reach you?', options: { whatsapp: 'WhatsApp', phone: 'Phone calls', email: 'Email', walkin: 'Walk-ins to the office', paper: 'Official letters and paper mail', telegram: 'Telegram', portal: 'A system or portal' } },
      deadlines: { title: 'How do you keep track of hearings and time limits?', options: { system: 'A system that alerts us', calendar: 'A shared calendar', notebook: 'A diary or notebook', memory: 'We remember them' } },
      misses: { title: 'Honestly, in the last three months, how often did a date come too close?', hint: 'A hearing, an appeal period, a renewal. Nobody sees this answer but you and us.', options: { none: 'Never', once: 'Once', few: '2 to 4 times', often: 'More than 4 times' } },
      hours: { title: 'Each week, how many hours go into searching for files, retyping documents and chasing updates?', options: { h1: 'Under 3 hours', h2: '3 to 8 hours', h3: '8 to 15 hours', h4: 'More than 15 hours' } },
      storage: { title: 'Your files live mostly in…', options: { paper: 'Paper files and cabinets', whatsapp: 'WhatsApp chats and phones', folders: 'Shared folders or Drive', excel: 'Excel or Google Sheets', software: 'A dedicated system' } },
      bottleneck: { title: 'If you could fix one thing this month, it would be…', options: { research: 'Finding the law and precedents faster', drafting: 'Drafting and reviewing contracts', deadlines: 'Never missing a hearing or deadline', documents: 'Finding any document in seconds', intake: 'Answering new clients properly', reporting: 'Reports and compliance for management' } },
      timeline: { title: 'When should things start improving?', options: { now: 'This month', quarter: 'In the next three months', later: 'Later this year', curious: 'Just exploring' } },
      decider: { title: 'Who would you need to convince?', options: { me: 'Nobody, I decide', partners: 'My partners', manager: 'A manager above me', committee: 'A board or committee' } },
      band: { title: 'If a system gave your lawyers back 10 hours a week, what would that be worth each month?', options: { b1: 'Under 150k IQD', b2: '150k to 450k IQD', b3: '450k to 1.2M IQD', b4: 'More than 1.2M IQD' } },
      worry: { title: 'What worries you most about technology in legal work?', options: { confidentiality: 'Who can see our clients’ files', accuracy: 'It will get the law wrong', price: 'The cost', staff: 'The team will not use it', arabic: 'It will not understand legal Arabic' } },
    },
    short: {
      practice: { litigation: 'your litigation practice', corporate: 'your corporate practice', general: 'your practice', inhouse: 'your legal department', other: 'your practice' },
      team: { solo: 'you alone', small: '2 to 5 people', mid: '6 to 15 people', large: 'a team of more than 15' },
      volume: { m1: 'fewer than 20', m2: '20 to 60', m3: '60 to 150', m4: 'more than 150' },
      deadlines: { system: 'a system', calendar: 'a shared calendar', notebook: 'a diary', memory: 'memory' },
      misses: { none: 'none', once: 'one', few: '2 to 4', often: 'more than 4' },
      hours: { h1: 'under 3', h2: '3 to 8', h3: '8 to 15', h4: 'more than 15' },
      storage: { paper: 'paper files', whatsapp: 'WhatsApp chats', folders: 'shared folders', excel: 'spreadsheets', software: 'your own system' },
      bottleneck: { research: 'faster research', drafting: 'drafting', deadlines: 'deadlines', documents: 'documents', intake: 'client intake', reporting: 'reporting' },
    },
    analysing: {
      title: 'Reading your answers',
      steps: ['Counting the dates your open matters carry', 'Checking how you track them against how often they come close', 'Matching what you want to fix to a plan'],
    },
    reveal: {
      eyebrow: 'Your orbit',
      scoreLabel: 'Orbit score',
      scoreNote: 'How well your practice holds its files and dates in orbit, out of 100.',
      lostLabel: 'Deadlines at risk each year',
      lostNote: 'From your own answers: {volume} open matters tracked in {deadlines}. Close calls in the last three months: {misses}.',
      rushQuote: 'In the warm-up you handled {a} of {t} requests in 6 seconds.',
      sharedNote: 'This is a result someone shared with you.',
      sharedCta: 'Find yours in 60 seconds',
    },
    archetypes: {
      lone: { name: 'Lone Star', line: 'You carry {practice} yourself. With {volume} open matters, every hour spent searching or retyping comes out of the work only a lawyer can do.' },
      crowded: { name: 'Crowded Orbit', line: 'Work is not your problem: {volume} open matters. But hearings and time limits live in {deadlines}, and at this volume one absence is enough for a date to slip.' },
      drifting: { name: 'Drifting Moon', line: 'Your files live in {storage}. That works until a phone is lost, a cabinet is moved, or nobody remembers which copy was signed.' },
      closepass: { name: 'Close Pass', line: 'Dates came too close {misses} times in three months. Nothing was lost yet, which is why close passes rarely show up in any report.' },
      ready: { name: 'Ready Orbit', line: 'Your foundations are solid: dates in {deadlines} and files in {storage}. Your next gains come from {bottleneck}, not from fixing basics.' },
      steady: { name: 'Steady Orbit', line: 'The office runs, but it runs on effort: {hours} hours a week of searching and retyping. The biggest win is in {bottleneck}.' },
    },
    gate: {
      title: 'Get your full report',
      text: 'The full report shows the hours at stake and what they are worth, a 12-month view with and without automatic alerts, and a three-step plan for {practice}. We send nothing else unless you ask.',
      name: 'Your name',
      business: 'Firm or company',
      city: 'City',
      whatsapp: 'WhatsApp number',
      whatsappHint: 'Include the country code, e.g. +964 770 123 4567',
      consentContact: 'NAWA may contact me on WhatsApp about this result. I can stop it any time by replying STOP.',
      consentMarketing: 'Also send me occasional ideas and offers (optional).',
      privacy: 'How we handle your data',
      submit: 'Show my full report',
      sending: 'Preparing your report',
      fail: 'We could not save your details. Your report is below, and you can still message us on WhatsApp.',
      errName: 'Please write your name.',
      errWhatsapp: 'Please enter a WhatsApp number with at least 10 digits.',
      errConsent: 'Please tick this box so we can send your report.',
      skip: 'Not now',
    },
    report: {
      eyebrow: 'Full report',
      title: 'Where your legal work slips, and how to hold it',
      code: 'Result code',
      numbers: { lost: 'Deadlines at risk', recoverable: 'Caught early by automatic alerts', hours: 'Hours freed from searching and retyping', money: 'Value of those hours', perMonth: 'per month', perYear: 'per year' },
      assumptions: {
        title: 'Assumptions you can change',
        value: 'Value of one hour of a lawyer’s time (IQD)',
        conv: 'Freed hours that go back into legal work (%)',
        note: 'Starting values are conservative for {practice}. Change them to your real numbers and every figure updates.',
      },
      forecast: {
        title: 'Your next 12 months',
        text: 'Hours that go back into legal work, added up month by month, on two paths.',
        current: 'As today',
        automated: 'With the system',
        months: 'Month',
        setup: 'Month 1 is for building the system.',
        gap: 'About {n} hours back in legal work in 12 months.',
      },
      planTitle: 'Your three steps',
      stepLabel: 'Step {i}',
      more: 'How this works',
      method: {
        title: 'How we calculated this',
        items: [
          'Dates per year = your open matters (middle of the range you chose) × 1.5 dates per matter per month (hearings, time limits, renewals) × 12. A deliberately low estimate.',
          'Deadlines at risk = the average of two numbers: what you told us about close calls (× 4 for a year), and a small share of all your dates that depends on how you track them (0.3% with a system, up to 4% from memory).',
          'Caught early: 30% to 90% of those, depending on how you track dates today. Automatic alerts help most where tracking is by hand.',
          'Hours freed: 30% to 50% of the repetitive hours you reported, not of your whole work. Lower than in other fields on purpose, because a lawyer reviews every output. For comparison, McKinsey (2017) estimated about 23% of a lawyer’s total work could be automated, and Remus and Levy (2016) about 13%.',
          'Value = hours freed × the share that goes back into legal work × the value of an hour. We do not put a price on a lost case, and neither should anyone else.',
          'Every number is a range around the estimate. It is a starting point for a conversation, not a promise.',
        ],
      },
    },
    steps: {
      assistant: { title: 'A research assistant that shows its sources', text: 'Ask in Arabic, get the article, the precedent or your own past memo, with the exact text it relied on. Your lawyers review, the assistant searches.' },
      drafting: { title: 'Contracts from approved templates', text: 'New contracts start from your approved clauses, review flags what differs from your standard positions, and every renewal is tracked.' },
      alerts: { title: 'Every hearing and time limit, with an alert', text: 'One shared calendar for the whole office, fed from each matter, with reminders days before every hearing, appeal period and renewal.' },
      archive: { title: 'Any document in seconds', text: 'Your files scanned and read in Arabic, filed under their matter, and searchable by name, number, date or phrase.' },
      intake: { title: 'New clients answered properly', text: 'An intake assistant on WhatsApp answers practical questions, collects the facts, checks for conflicts and books the right lawyer.' },
      dashboard: { title: 'A live view for management', text: 'Open matters, exposure, licences and workload on one dashboard, with the monthly report produced from live data.' },
      digitize: { title: 'Move your practice out of {storage}', text: 'Your existing paper files scanned, read and filed under each matter, so nothing depends on one cabinet or one person.' },
      gather: { title: 'From {storage} to one archive', text: 'Documents that arrive on WhatsApp and email are saved straight into the right matter, not left in someone’s phone.' },
      structure: { title: 'One record per matter', text: 'Your shared folders become one structured file per matter: parties, court, documents, dates and fees, visible to the right people.' },
      matters: { title: 'From spreadsheets to a matter system', text: 'The sheets you keep today become a system where each matter has its dates, tasks and documents, updated by the people doing the work.' },
      connect: { title: 'Connect your system to the rest', text: 'Your existing software receives documents, requests and dates directly from WhatsApp, email and the calendar, without anyone retyping them.' },
      report: { title: 'A weekly report on your phone', text: 'Hearings this week, deadlines coming, matters opened and closed, hours recorded. One message every week. What gets measured gets better.' },
    },
    sharpen: {
      title: 'Sharpen your plan',
      text: 'Four optional taps so the plan fits your timing and the people involved.',
      saved: 'Saved',
    },
    close: {
      title: 'Talk it through with a person',
      text: 'Send your result to NAWA on WhatsApp. A person replies, not a bot.',
      wa: 'Send my result on WhatsApp',
      waMessage: 'Hello NAWA, my result code is {code}. Orbit: {archetype} ({score}/100). {practice}. I would like to discuss the plan.',
      share: 'Share my orbit',
      shareText: 'My practice’s orbit: {archetype}, {score}/100. Find yours:',
      download: 'Download my orbit card',
      copied: 'Link copied',
      contact: 'Prefer a form? Contact page',
    },
    noscript: 'This diagnosis needs JavaScript. You can still reach us directly:',
    currency: { unit: 'IQD', thousand: 'k', million: 'M' },
  },

  ar: {
    meta: {
      title: 'اكتشف وين يضيع شغلك القانوني',
      description: 'تسع أجوبة سريعة وتشخيص صريح: كم موعد يقترب أكثر من اللازم كل سنة، وكم ساعة تروح على البحث وإعادة الكتابة، وثلاث خطوات تضبط مكتبك.',
    },
    eyebrow: 'تشخيص مجاني · 60 ثانية',
    h1: { a: 'اكتشف وين *يضيع شغلك القانوني*', b: 'كم موعد *كاد يفوتك* هالشهر؟' },
    sub: '60 ثانية. نتيجة مبنية على أجوبتك. وما نسأل عن أي قضية أو موكل.',
    intro: {
      rush: 'جرّب تمشّي 6 ثواني من يوم المكتب',
      skip: 'انتقل للأسئلة مباشرة',
      note: 'تحمية قصيرة: طلبات حقيقية توصل لمكتب محاماة. مشّي أكثر عدد تكدر عليه.',
    },
    rush: {
      label: 'تحمية: طلبات واصلة للمكتب',
      messages: ['راجع هالعقد قبل باچر', 'جلسة الأحد، وين الملف؟', 'الوكالة منتهية؟', 'يا نسخة انوقعت؟', 'التبليغ وصل؟', 'الموكل يسأل شصار', 'مدة الطعن إمتى تخلص؟', 'نحتاج قرار 2019', 'تجديد الإيجار هالأسبوع', 'دزلي نسخة السند', 'جلسة الخميس مؤكدة؟', 'اكو تعارض ويا هالموكل؟'],
      reply: 'مشّي',
      replied: 'تمشّى',
      typing: 'يشتغل',
      counter: '{a} من {t} تمشّت',
      time: '{s} ث',
      summary: 'مشّيت {a} من {t} خلال 6 ثواني.',
      agent: 'نفس الـ 6 ثواني ويا نظام نوى: {t} من {t} انحفظت أو انربطت بموعد أو انرد عليها، كلها بأقل من ثانية.',
      agentTag: 'النظام',
      staticTitle: '12 طلب للمكتب خلال 6 ثواني',
      staticText: 'شخص واحد يلحق على حوالي خمسة. الباقي ينتظر بأجندة أو خزانة أو موبايل، وبعضها يرجع كمواعيد فاتت. النظام يحفظ ويربط بموعد ويرد على الاثني عشر، كل وحدة بأقل من ثانية.',
      next: 'كمّل للأسئلة',
    },
    flow: {
      progress: 'السؤال {i} من {n}',
      back: 'رجوع',
      next: 'كمّل',
      multiHint: 'اختار كل اللي ينطبق',
      planetLabel: 'مكتبك، مبني من أجوبتك',
      restart: 'ابدأ من جديد',
    },
    questions: {
      practice: { title: 'مكتبك هو…', options: { litigation: 'مكتب دعاوى ومرافعات', corporate: 'مكتب شركات وعقود', general: 'مكتب محاماة عام', inhouse: 'قسم قانوني بشركة', other: 'شي ثاني' } },
      team: { title: 'كم محامي وموظف يشتغلون على الملفات القانونية؟', options: { solo: 'بس آني', small: '2 إلى 5', mid: '6 إلى 15', large: 'أكثر من 15' } },
      volume: { title: 'هسه، كم ملف مفتوح عندك؟', hint: 'الدعاوى والعقود اللي بالشغل والمعاملات الجارية، كلها سوا.', options: { m1: 'أقل من 20', m2: '20 إلى 60', m3: '60 إلى 150', m4: 'أكثر من 150' } },
      channels: { title: 'منين توصلك الطلبات والمستندات الجديدة؟', options: { whatsapp: 'واتساب', phone: 'اتصالات', email: 'بريد إلكتروني', walkin: 'يجون للمكتب', paper: 'كتب رسمية وبريد ورقي', telegram: 'تلگرام', portal: 'نظام أو بوابة' } },
      deadlines: { title: 'شلون تتابعون الجلسات والمدد القانونية؟', options: { system: 'نظام ينبّهنا', calendar: 'تقويم مشترك', notebook: 'أجندة أو دفتر', memory: 'نتذكرها' } },
      misses: { title: 'بصراحة، بآخر ثلاث أشهر، كم مرة موعد قرّب أكثر من اللازم؟', hint: 'جلسة، مدة طعن، تجديد. هذا الجواب محد يشوفه غيرك وغيرنا.', options: { none: 'ولا مرة', once: 'مرة وحدة', few: '2 إلى 4 مرات', often: 'أكثر من 4 مرات' } },
      hours: { title: 'كل أسبوع، كم ساعة تروح على البحث عن الملفات، وإعادة كتابة المستندات، وملاحقة التحديثات؟', options: { h1: 'أقل من 3 ساعات', h2: '3 إلى 8 ساعات', h3: '8 إلى 15 ساعة', h4: 'أكثر من 15 ساعة' } },
      storage: { title: 'ملفاتكم محفوظة أغلبها بـ…', options: { paper: 'ملفات ورقية وخزانات', whatsapp: 'محادثات الواتساب والموبايلات', folders: 'مجلدات مشتركة أو Drive', excel: 'إكسل أو Google Sheets', software: 'نظام خاص' } },
      bottleneck: { title: 'لو تكدر تصلّح شي واحد هالشهر، راح يكون…', options: { research: 'أوصل للقانون والسوابق أسرع', drafting: 'صياغة العقود ومراجعتها', deadlines: 'ما يفوتني ولا موعد أو جلسة', documents: 'ألگى أي مستند بثواني', intake: 'أرد على الموكلين الجدد صح', reporting: 'التقارير والامتثال للإدارة' } },
      timeline: { title: 'إمتى تريد الأمور تبدي تتحسن؟', options: { now: 'هالشهر', quarter: 'خلال الثلاث أشهر الجاية', later: 'بعدين هالسنة', curious: 'بس دا أستكشف' } },
      decider: { title: 'منو لازم تقنعه؟', options: { me: 'محد، آني أقرر', partners: 'شركائي بالمكتب', manager: 'مدير فوگي', committee: 'مجلس أو لجنة' } },
      band: { title: 'لو نظام يرجّع لمحاميك 10 ساعات بالأسبوع، شكد يسوى عندك بالشهر؟', options: { b1: 'أقل من 150 ألف دينار', b2: '150 إلى 450 ألف دينار', b3: '450 ألف إلى مليون و200', b4: 'أكثر من مليون و200' } },
      worry: { title: 'شنو أكثر شي يقلقك من التقنية بالشغل القانوني؟', options: { confidentiality: 'منو يشوف ملفات موكلينا', accuracy: 'يغلط بالقانون', price: 'الكلفة', staff: 'الفريق ما يستخدمه', arabic: 'ما يفهم اللغة القانونية' } },
    },
    short: {
      practice: { litigation: 'مكتب الدعاوى مالتك', corporate: 'مكتب الشركات مالتك', general: 'مكتبك', inhouse: 'قسمك القانوني', other: 'مكتبك' },
      team: { solo: 'أنت وحدك', small: '2 إلى 5 أشخاص', mid: '6 إلى 15 شخص', large: 'فريق أكثر من 15' },
      volume: { m1: 'أقل من 20', m2: '20 إلى 60', m3: '60 إلى 150', m4: 'أكثر من 150' },
      deadlines: { system: 'نظام', calendar: 'تقويم مشترك', notebook: 'أجندة', memory: 'الذاكرة' },
      misses: { none: 'ولا مرة', once: 'مرة وحدة', few: '2 إلى 4 مرات', often: 'أكثر من 4 مرات' },
      hours: { h1: 'أقل من 3', h2: '3 إلى 8', h3: '8 إلى 15', h4: 'أكثر من 15' },
      storage: { paper: 'الملفات الورقية', whatsapp: 'محادثات الواتساب', folders: 'المجلدات المشتركة', excel: 'جداول الإكسل', software: 'نظامك الخاص' },
      bottleneck: { research: 'البحث الأسرع', drafting: 'الصياغة', deadlines: 'المواعيد', documents: 'المستندات', intake: 'استقبال الموكلين', reporting: 'التقارير' },
    },
    analysing: {
      title: 'نقرأ أجوبتك',
      steps: ['نحسب المواعيد اللي تحملها ملفاتك المفتوحة', 'نقارن طريقة متابعتك بعدد المرات اللي قرّبت بيها', 'نربط اللي تريد تصلّحه بخطة'],
    },
    reveal: {
      eyebrow: 'مدارك',
      scoreLabel: 'درجة المدار',
      scoreNote: 'قدرة مكتبك على إبقاء ملفاته ومواعيده في مدارها، من 100.',
      lostLabel: 'مواعيد معرّضة للخطر كل سنة',
      lostNote: 'من أجوبتك أنت: {volume} ملف مفتوح متابَع بـ{deadlines}. والمرات القريبة بآخر ثلاث أشهر: {misses}.',
      rushQuote: 'في التحمية مشّيت {a} من {t} طلب خلال 6 ثواني.',
      sharedNote: 'هذه نتيجة شاركها معك شخص آخر.',
      sharedCta: 'اكتشف نتيجتك خلال 60 ثانية',
    },
    archetypes: {
      lone: { name: 'النجم الوحيد', line: '{team} تشيل {practice} كله. ومع {volume} ملف مفتوح، كل ساعة بحث أو إعادة كتابة تنأخذ من الشغل اللي ما يسويه غير محامي.' },
      crowded: { name: 'المدار المزدحم', line: 'الشغل مو مشكلتك: {volume} ملف مفتوح. لكن الجلسات والمدد عايشة بـ{deadlines}، وبهذا الحجم يكفي غياب شخص واحد حتى يفلت موعد.' },
      drifting: { name: 'القمر التائه', line: 'ملفاتك عايشة بـ{storage}. هذا يمشي لحد ما يضيع موبايل، أو تنشال خزانة، أو محد يتذكر يا نسخة انوقعت.' },
      closepass: { name: 'المرور القريب', line: 'موعد قرّب أكثر من اللازم {misses} خلال ثلاث أشهر. لحد هسه ما ضاع شي، ولهذا المرور القريب نادراً ما يظهر بأي تقرير.' },
      ready: { name: 'المدار الجاهز', line: 'أساسك قوي: المواعيد بـ{deadlines} والملفات بـ{storage}. ربحك الجاي من {bottleneck}، مو من تصليح الأساسيات.' },
      steady: { name: 'المدار الثابت', line: 'المكتب ماشي، بس ماشي بالجهد: {hours} ساعات أسبوعياً على البحث وإعادة الكتابة. أكبر ربح عندك في {bottleneck}.' },
    },
    gate: {
      title: 'استلم تقريرك الكامل',
      text: 'التقرير الكامل يبيّن الساعات اللي على المحك وقيمتها، ونظرة 12 شهر ويا التنبيهات التلقائية وبدونها، وخطة من 3 خطوات لـ{practice}. ما نرسل أي شي ثاني إلا إذا طلبت.',
      name: 'اسمك',
      business: 'المكتب أو الشركة',
      city: 'المدينة',
      whatsapp: 'رقم الواتساب',
      whatsappHint: 'مع رمز الدولة، مثل ‎+964 770 123 4567',
      consentContact: 'أوافق أن نوى تتواصل وياي على الواتساب بخصوص هذه النتيجة، وأكدر أوقف هذا بأي وقت بكتابة "توقف".',
      consentMarketing: 'وابعثولي أفكار وعروض بين فترة وفترة (اختياري).',
      privacy: 'شلون نتعامل ويا بياناتك',
      submit: 'اعرض تقريري الكامل',
      sending: 'نجهّز تقريرك',
      fail: 'ما گدرنا نحفظ بياناتك. تقريرك تحت، وتگدر تراسلنا على الواتساب.',
      errName: 'اكتب اسمك رجاءً.',
      errWhatsapp: 'اكتب رقم واتساب بيه 10 أرقام على الأقل.',
      errConsent: 'أشّر على هذا المربع حتى نگدر نرسلك التقرير.',
      skip: 'مو هسه',
    },
    report: {
      eyebrow: 'التقرير الكامل',
      title: 'وين يضيع شغلك القانوني، وشلون تضبطه',
      code: 'كود النتيجة',
      numbers: { lost: 'مواعيد معرّضة للخطر', recoverable: 'تنلزم مبكراً بالتنبيه التلقائي', hours: 'ساعات تتحرر من البحث وإعادة الكتابة', money: 'قيمة هذه الساعات', perMonth: 'شهرياً', perYear: 'سنوياً' },
      assumptions: {
        title: 'افتراضات تگدر تغيّرها',
        value: 'قيمة ساعة وحدة من وقت المحامي (دينار)',
        conv: 'نسبة الساعات المتحررة اللي ترجع للشغل القانوني (%)',
        note: 'القيم الأولية محافظة لـ{practice}. غيّرها لأرقامك الحقيقية وكل الأرقام تتحدث.',
      },
      forecast: {
        title: 'الـ 12 شهر الجاية',
        text: 'ساعات ترجع للشغل القانوني، تتجمع شهر بشهر، بمسارين.',
        current: 'مثل اليوم',
        automated: 'مع النظام',
        months: 'الشهر',
        setup: 'الشهر الأول لبناء النظام.',
        gap: 'تقريباً {n} ساعة ترجع للشغل القانوني خلال 12 شهر.',
      },
      planTitle: 'خطواتك الثلاث',
      stepLabel: 'الخطوة {i}',
      more: 'شلون يشتغل',
      method: {
        title: 'شلون حسبنا هذه الأرقام',
        items: [
          'المواعيد بالسنة = ملفاتك المفتوحة (منتصف الفئة اللي اخترتها) × 1.5 موعد لكل ملف بالشهر (جلسات ومدد وتجديدات) × 12. تقدير منخفض عمداً.',
          'المواعيد المعرّضة للخطر = متوسط رقمين: اللي قلته لنا عن المرات القريبة (× 4 للسنة)، ونسبة صغيرة من كل مواعيدك تعتمد على طريقة متابعتها (0.3% مع نظام، لحد 4% من الذاكرة).',
          'اللي تنلزم مبكراً: من 30% إلى 90% منها حسب طريقة متابعتك اليوم. التنبيه التلقائي يفيد أكثر وين المتابعة باليد.',
          'الساعات المتحررة: من 30% إلى 50% من الساعات المتكررة اللي ذكرتها، مو من كل شغلك. أقل من مجالات ثانية عمداً، لأن المحامي يراجع كل مخرَج. للمقارنة: ماكنزي (2017) قدّرت حوالي 23% من مجمل عمل المحامي قابل للأتمتة، و Remus و Levy (2016) حوالي 13%.',
          'القيمة = الساعات المتحررة × النسبة اللي ترجع للشغل القانوني × قيمة الساعة. ما نحط سعر لقضية خاسرة، ولا لازم أحد يحط.',
          'كل رقم نطاق حول التقدير. هو بداية حديث، مو وعد.',
        ],
      },
    },
    steps: {
      assistant: { title: 'مساعد بحث يعرض مصادره', text: 'اسأل بالعربي، وتوصلك المادة أو السابقة أو مذكرتك القديمة، ويا النص اللي اعتمد عليه حرفياً. المحامي يراجع، والمساعد يبحث.' },
      drafting: { title: 'عقود من نماذج معتمدة', text: 'العقود الجديدة تبدي من بنودك المعتمدة، والمراجعة تأشّر اللي يختلف عن مواقفك الثابتة، وكل تجديد تحت المتابعة.' },
      alerts: { title: 'كل جلسة ومدة، ويا تنبيه', text: 'تقويم مشترك للمكتب كله، يتغذى من كل ملف، ويذكّر قبل كل جلسة ومدة طعن وتجديد بأيام.' },
      archive: { title: 'أي مستند بثواني', text: 'ملفاتك تنمسح وتنقرأ بالعربي، وتنحفظ تحت ملفها، وتنلگى بالاسم أو الرقم أو التاريخ أو أي عبارة.' },
      intake: { title: 'الموكل الجديد ينرد عليه صح', text: 'مساعد استقبال على الواتساب يجاوب الأسئلة العملية، ويجمع الوقائع، ويفحص التعارض، ويحجز ويا المحامي المناسب.' },
      dashboard: { title: 'صورة حيّة للإدارة', text: 'الملفات المفتوحة والمخاطر والإجازات وحجم العمل بلوحة وحدة، والتقرير الشهري يطلع من بيانات حيّة.' },
      digitize: { title: 'طلّع مكتبك من {storage}', text: 'ملفاتك الورقية الحالية تنمسح وتنقرأ وتنحفظ تحت كل ملف، فمحد يعتمد على خزانة وحدة أو شخص واحد.' },
      gather: { title: 'من {storage} لأرشيف واحد', text: 'المستندات اللي توصل بالواتساب والبريد تنحفظ مباشرة بالملف الصحيح، مو تبقى بموبايل أحد.' },
      structure: { title: 'سجل واحد لكل ملف', text: 'مجلداتك المشتركة تصير ملف منظم لكل قضية: الأطراف والمحكمة والمستندات والمواعيد والأتعاب، يشوفها الأشخاص الصح.' },
      matters: { title: 'من الجداول لنظام ملفات', text: 'الجداول اللي تمسكها اليوم تصير نظام، لكل ملف مواعيده ومهامه ومستنداته، يحدّثه اللي يشتغل عليه.' },
      connect: { title: 'اربط نظامك بالباقي', text: 'برنامجك الحالي يستلم المستندات والطلبات والمواعيد مباشرة من الواتساب والبريد والتقويم، بدون ما أحد يعيد كتابتها.' },
      report: { title: 'تقرير أسبوعي على موبايلك', text: 'جلسات هالأسبوع، المواعيد الجاية، الملفات اللي انفتحت وانسدت، الساعات المسجلة. رسالة وحدة كل أسبوع. اللي ينقاس يتحسن.' },
    },
    sharpen: {
      title: 'حدّد خطتك أكثر',
      text: 'أربع ضغطات اختيارية حتى تناسب الخطة وقتك والناس المعنيين.',
      saved: 'انحفظ',
    },
    close: {
      title: 'احچي ويا شخص حقيقي',
      text: 'ابعث نتيجتك لنوى على الواتساب. يرد عليك شخص حقيقي.',
      wa: 'ابعث نتيجتي على الواتساب',
      waMessage: 'مرحباً نوى، كود نتيجتي {code}. المدار: {archetype} ({score}/100). {practice}. أريد أناقش الخطة.',
      share: 'شارك مدارك',
      shareText: 'مدار مكتبي: {archetype}، {score}/100. اكتشف مدارك:',
      download: 'نزّل بطاقة مدارك',
      copied: 'انسخ الرابط',
      contact: 'تفضّل النموذج؟ صفحة التواصل',
    },
    noscript: 'هذا التشخيص يحتاج JavaScript. تگدر تتواصل ويانا مباشرة:',
    currency: { unit: 'دينار', thousand: 'ألف', million: 'مليون' },
  },
};
