/**
 * نصوص "اكتشف ليش تخسر زبائنك" (Launch Test) باللغتين.
 * المنطق والأرقام في src/scripts/launch/engine.ts؛ هنا الكلام فقط.
 *
 * قواعد الكتابة:
 *  - صوت نوى: هادئ، واثق، أرقام بدل الصفات، بدون علامات تعجب وبدون إيموجي
 *  - الأسئلة بالعربي بلهجة عراقية خفيفة، والنتيجة بعربية واضحة
 *  - كل جملة في النتيجة تحتوي متغيراً من أجوبة الزائر ({...}) حتى لا تكون نصاً عاماً
 *  - المتغيرات المتاحة: {industry} {volume} {reply} {vanish} {hours} {system} {bottleneck} {channels} {team}
 */
import type { Lang } from '../../../config/site';
import type { Key, Opt, Archetype, StepKey } from '../../../scripts/launch/engines/agency';

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
  short: { volume: OptLabels<'volume'>; reply: OptLabels<'reply'>; vanish: OptLabels<'vanish'>; hours: OptLabels<'hours'>; industry: OptLabels<'industry'>; system: OptLabels<'system'>; bottleneck: OptLabels<'bottleneck'>; team: OptLabels<'team'> };
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
      title: 'Discover why you are losing customers',
      description: 'Nine quick answers, one honest diagnosis: how many inquiries slip away from your business each month, why, and the three steps that bring them back.',
    },
    eyebrow: 'Free diagnosis · 60 seconds',
    h1: { a: 'Discover why you are *losing customers*', b: 'How many customers did you *lose this week*?' },
    sub: '60 seconds. A result built from your answers.',
    intro: {
      rush: 'Try answering 6 seconds of customers',
      skip: 'Skip to the questions',
      note: 'A short warm-up: real customer messages arrive. Reply to as many as you can.',
    },
    rush: {
      label: 'Warm-up: customer messages arriving',
      messages: [
        'How much is it?', 'Where are you located?', 'Is it in stock?', 'Any slot tomorrow?', 'Do you deliver to Karrada?', 'Are you open now?',
        'Price for two?', 'Is the doctor in today?', 'Can I pay with ZainCash?', 'Do you have size L?', 'Send me the location', 'Still available?',
      ],
      reply: 'Reply to',
      replied: 'Replied',
      typing: 'Typing',
      counter: '{a} of {t} answered',
      time: '{s}s',
      summary: 'You answered {a} of {t} in 6 seconds.',
      agent: 'The same 6 seconds with a NAWA agent: {t} of {t}, each in under a second.',
      agentTag: 'Agent',
      staticTitle: '12 customer messages in 6 seconds',
      staticText: 'One person typing replies answers about five of them. The rest wait, and many never come back. An agent answers all twelve in under a second each.',
      next: 'Continue to the questions',
    },
    flow: {
      progress: 'Question {i} of {n}',
      back: 'Back',
      next: 'Continue',
      multiHint: 'Choose all that apply',
      planetLabel: 'Your business, built from your answers',
      restart: 'Start again',
    },
    questions: {
      industry: { title: 'Your business is a…', options: { clinic: 'Clinic or medical centre', restaurant: 'Restaurant or café', store: 'Online store (Instagram, Facebook)', retail: 'Shop or showroom', realestate: 'Real estate', education: 'School, institute or courses', services: 'Company or professional services', other: 'Something else' } },
      team: { title: 'On a normal day, how many people answer your customers?', options: { solo: 'Just me', small: '2 to 3', mid: '4 to 10', large: 'More than 10' } },
      volume: { title: 'A normal Thursday. How many new customer messages reach you?', hint: 'Questions about price, booking, location or availability, across all channels.', options: { v1: 'Fewer than 10', v2: '10 to 30', v3: '30 to 100', v4: 'More than 100' } },
      channels: { title: 'Where do customers reach you?', options: { whatsapp: 'WhatsApp', instagram: 'Instagram', facebook: 'Facebook / Messenger', phone: 'Phone calls', walkin: 'Walk-ins', telegram: 'Telegram', website: 'Website' } },
      reply: { title: 'A customer writes at 11 pm. When do they get a reply?', options: { minutes: 'Within minutes', hour: 'Within the hour', morning: 'Next morning', late: 'When someone gets to it' } },
      vanish: { title: 'Honestly, how many ask the price and then disappear?', hint: 'Nobody sees this answer but you and us.', options: { few: 'About 1 in 10', some: 'About 3 in 10', half: 'About half', most: 'Most of them' } },
      hours: { title: 'Each week, how many hours go into copy-paste, "how much?" replies, invoices and reports?', options: { h1: 'Under 3 hours', h2: '3 to 8 hours', h3: '8 to 15 hours', h4: 'More than 15 hours' } },
      system: { title: 'Customers and orders live mostly in…', options: { paper: 'A notebook or paper', head: 'Our heads', excel: 'Excel or Google Sheets', wabiz: 'WhatsApp Business labels', software: 'A dedicated system or software' } },
      bottleneck: { title: 'If you could fix one thing this month, it would be…', options: { replies: 'Answering messages fast', bookings: 'Bookings and appointments', orders: 'Taking and tracking orders', followup: 'Following up with people who went quiet', admin: 'Accounts, stock and reports', presence: 'Being found and trusted online' } },
      timeline: { title: 'When should things start improving?', options: { now: 'This month', quarter: 'In the next three months', later: 'Later this year', curious: 'Just exploring' } },
      decider: { title: 'Who would you need to convince?', options: { me: 'Nobody, I decide', partner: 'My partner or family', manager: 'A manager above me', committee: 'A board or committee' } },
      band: { title: 'If a system saved you 10 hours a week, what would that be worth each month?', options: { b1: 'Under 150k IQD', b2: '150k to 450k IQD', b3: '450k to 1.2M IQD', b4: 'More than 1.2M IQD' } },
      worry: { title: 'What worries you most about using AI with customers?', options: { robotic: 'It will sound robotic', data: 'Who sees our data', mistakes: 'It will give wrong answers', price: 'The cost', staff: 'My team will resist it' } },
    },
    short: {
      volume: { v1: 'fewer than 10', v2: '10 to 30', v3: '30 to 100', v4: 'more than 100' },
      reply: { minutes: 'within minutes', hour: 'within the hour', morning: 'the next morning', late: 'whenever someone gets to it' },
      vanish: { few: 'about 1 in 10', some: 'about 3 in 10', half: 'about half', most: 'most' },
      hours: { h1: 'under 3', h2: '3 to 8', h3: '8 to 15', h4: 'more than 15' },
      industry: { clinic: 'a clinic', restaurant: 'a restaurant', store: 'an online store', retail: 'a shop', realestate: 'a real estate business', education: 'a school', services: 'a services company', other: 'your business' },
      system: { paper: 'a notebook', head: 'your heads', excel: 'spreadsheets', wabiz: 'WhatsApp labels', software: 'your own system' },
      bottleneck: { replies: 'answering fast', bookings: 'bookings', orders: 'orders', followup: 'follow-up', admin: 'accounts and reports', presence: 'being found online' },
      team: { solo: 'you alone', small: '2 to 3 people', mid: '4 to 10 people', large: 'a team of more than 10' },
    },
    analysing: {
      title: 'Reading your answers',
      steps: ['Measuring your monthly inquiries', 'Checking reply speed against what customers expect', 'Matching your bottleneck to a plan'],
    },
    reveal: {
      eyebrow: 'Your orbit',
      scoreLabel: 'Orbit score',
      scoreNote: 'How well your business holds customers in its orbit, out of 100.',
      lostLabel: 'Inquiries slipping away each month',
      lostNote: 'From your own answers: {volume} new messages a day, and {vanish} disappear after asking.',
      rushQuote: 'In the warm-up you answered {a} of {t} messages in 6 seconds.',
      sharedNote: 'This is a result someone shared with you.',
      sharedCta: 'Find yours in 60 seconds',
    },
    archetypes: {
      lone: { name: 'Lone Star', line: 'You answer every customer of {industry} yourself. With {volume} new messages a day, each reply takes time away from the work only you can do.' },
      crowded: { name: 'Crowded Planet', line: 'Demand is not your problem: {volume} new messages a day. But replies come {reply}, and by then many customers have already asked someone else.' },
      drifting: { name: 'Drifting Moon', line: 'Your customers and orders live in {system}. That works until someone is away, a page is lost, or nobody remembers who asked what.' },
      leak: { name: 'Quiet Leak', line: '{vanish} of the people who ask you a price never come back. The leak is silent, so it rarely shows up in any report.' },
      ready: { name: 'Ready Orbit', line: 'Your foundations are solid: replies {reply} and customers kept in {system}. Your next gains come from {bottleneck}, not from fixing basics.' },
      steady: { name: 'Steady Orbit', line: 'Things run, but they run on effort: {hours} hours a week of repetitive work and replies {reply}. The biggest win is in {bottleneck}.' },
    },
    gate: {
      title: 'Get your full report',
      text: 'The full report shows the money at stake, a 12-month forecast with and without automation, and a three-step plan for {industry}. We send nothing else unless you ask.',
      name: 'Your name',
      business: 'Business name',
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
      title: 'What is slipping away, and how to keep it',
      code: 'Result code',
      numbers: { lost: 'Inquiries lost', recoverable: 'Could be won back with instant replies', hours: 'Hours freed from repetitive work', money: 'Value at stake', perMonth: 'per month' },
      assumptions: {
        title: 'Assumptions you can change',
        value: 'Value of a new customer (IQD)',
        conv: 'Inquiries that become customers (%)',
        note: 'Starting values are typical for {industry}. Change them to your real numbers and every figure updates.',
      },
      forecast: {
        title: 'Your next 12 months',
        text: 'New customers won from inquiries, month by month, on two paths.',
        current: 'As today',
        automated: 'With instant replies',
        months: 'Month',
        setup: 'Month 1 is for building the system.',
        gap: 'About {n} more customers in 12 months.',
      },
      planTitle: 'Your three steps',
      stepLabel: 'Step {i}',
      more: 'How this works',
      method: {
        title: 'How we calculated this',
        items: [
          'Monthly inquiries = your daily messages (middle of the range you chose) × 26 working days.',
          'Inquiries lost = monthly inquiries × the share you said disappear.',
          'Won back with instant replies: 12% to 55% of lost inquiries, depending on how fast you reply today. Research on response speed (Oldroyd, MIT/InsideSales 2007; Harvard Business Review 2011) shows the chance of reaching a lead falls sharply after the first minutes. We use deliberately conservative shares.',
          'Hours freed: 40% to 60% of the repetitive hours you reported (McKinsey estimates about 45% of paid activities can be automated with current technology).',
          'Every number is a range around the estimate. It is a starting point for a conversation, not a promise.',
        ],
      },
    },
    steps: {
      agent: { title: 'An agent that answers in under a minute', text: 'A WhatsApp and Instagram agent that answers price, location and availability questions day and night, in your tone, and hands real conversations to your team.' },
      booking: { title: 'Bookings that confirm themselves', text: 'Customers pick a free slot in the chat, get a confirmation and a reminder the day before. Fewer no-shows, no back-and-forth.' },
      orders: { title: 'Orders captured without copy-paste', text: 'Every order from WhatsApp or Instagram lands in one list with name, address and status, ready for delivery and accounts.' },
      followup: { title: 'Automatic follow-up', text: 'Customers who went quiet get a polite follow-up at the right time, and your team sees who is ready to buy.' },
      erp: { title: 'Stock, accounts and reports in one system', text: 'One system for sales, stock and expenses, with the reports you now build by hand produced automatically.' },
      presence: { title: 'A website that sells while you sleep', text: 'A fast bilingual site that answers the questions customers ask before they trust you, and sends them straight to WhatsApp.' },
      digitize: { title: 'Move customers out of {system}', text: 'Every customer, order and booking in one simple system your whole team can see, so nothing depends on memory or paper.' },
      excel: { title: 'Spreadsheets that update themselves', text: 'Connect your sheets to your channels so orders and customers are recorded automatically, with a live dashboard instead of manual copying.' },
      crm: { title: 'From WhatsApp labels to a real customer list', text: 'Every conversation linked to a customer record with stage, history and next step, so follow-up never depends on scrolling chats.' },
      connect: { title: 'Connect your system to your channels', text: 'Your existing software receives messages, orders and bookings directly, without anyone retyping them.' },
      report: { title: 'A weekly report on your phone', text: 'Inquiries, reply time, customers won and lost, every week in one message. What gets measured gets better.' },
      brand: { title: 'A brand customers recognise and trust', text: 'A clear identity across your page, website and messages, so new customers know who you are before they ask the price.' },
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
      waMessage: 'Hello NAWA, my result code is {code}. Orbit: {archetype} ({score}/100). {industry}. I would like to discuss the plan.',
      share: 'Share my orbit',
      shareText: 'My business orbit: {archetype}, {score}/100. Find yours:',
      download: 'Download my orbit card',
      copied: 'Link copied',
      contact: 'Prefer a form? Contact page',
    },
    noscript: 'This diagnosis needs JavaScript. You can still reach us directly:',
    currency: { unit: 'IQD', thousand: 'k', million: 'M' },
  },

  ar: {
    meta: {
      title: 'اكتشف ليش تخسر زبائنك',
      description: 'تسع أجوبة سريعة وتشخيص صريح: كم استفسار يضيع من شغلك كل شهر، وليش، وثلاث خطوات ترجّعهم.',
    },
    eyebrow: 'تشخيص مجاني · 60 ثانية',
    h1: { a: 'اكتشف ليش *تخسر زبائنك*', b: 'كم زبون *ضاع منك* هالأسبوع؟' },
    sub: '60 ثانية. نتيجة مبنية على أجوبتك.',
    intro: {
      rush: 'جرّب ترد على 6 ثواني من الزبائن',
      skip: 'انتقل للأسئلة مباشرة',
      note: 'تحمية قصيرة: رسائل زبائن حقيقية توصلك. رد على أكثر عدد تكدر عليه.',
    },
    rush: {
      label: 'تحمية: رسائل زبائن واصلة',
      messages: ['بيش؟', 'وين موقعكم؟', 'متوفر؟', 'اكو حجز باچر؟', 'توصلون للكرادة؟', 'فاتحين هسه؟', 'السعر لشخصين؟', 'الدكتور موجود اليوم؟', 'اكدر ادفع زين كاش؟', 'اكو قياس L؟', 'دزلي اللوكيشن', 'بعده موجود؟'],
      reply: 'رد على',
      replied: 'تم الرد',
      typing: 'يكتب',
      counter: '{a} من {t} انرد عليها',
      time: '{s} ث',
      summary: 'رديت على {a} من {t} خلال 6 ثواني.',
      agent: 'نفس الـ 6 ثواني مع وكيل نوى: {t} من {t}، كل رد بأقل من ثانية.',
      agentTag: 'الوكيل',
      staticTitle: '12 رسالة زبون خلال 6 ثواني',
      staticText: 'شخص واحد يكتب الردود يلحق على حوالي خمسة. الباقي ينتظرون، وهواية منهم ما يرجعون. الوكيل يرد على الاثني عشر، كل رد بأقل من ثانية.',
      next: 'كمّل للأسئلة',
    },
    flow: {
      progress: 'السؤال {i} من {n}',
      back: 'رجوع',
      next: 'كمّل',
      multiHint: 'اختار كل اللي ينطبق',
      planetLabel: 'شغلك، مبني من أجوبتك',
      restart: 'ابدأ من جديد',
    },
    questions: {
      industry: { title: 'شغلك هو…', options: { clinic: 'عيادة أو مركز طبي', restaurant: 'مطعم أو كافيه', store: 'متجر أونلاين (إنستغرام، فيسبوك)', retail: 'محل أو معرض', realestate: 'عقارات', education: 'مدرسة، معهد أو دورات', services: 'شركة أو خدمات مهنية', other: 'شي ثاني' } },
      team: { title: 'بيوم عادي، كم واحد يرد على زبائنك؟', options: { solo: 'بس آني', small: '2 إلى 3', mid: '4 إلى 10', large: 'أكثر من 10' } },
      volume: { title: 'خميس عادي. كم رسالة من زبائن جدد توصلك؟', hint: 'أسئلة عن السعر، الحجز، الموقع أو التوفر، من كل القنوات.', options: { v1: 'أقل من 10', v2: '10 إلى 30', v3: '30 إلى 100', v4: 'أكثر من 100' } },
      channels: { title: 'منين يوصلك الزبون؟', options: { whatsapp: 'واتساب', instagram: 'إنستغرام', facebook: 'فيسبوك / ماسنجر', phone: 'اتصالات', walkin: 'يجي للمحل', telegram: 'تلگرام', website: 'الموقع الإلكتروني' } },
      reply: { title: 'زبون كتبلك الساعة 11 بالليل. إمتى يوصله الرد؟', options: { minutes: 'خلال دقايق', hour: 'خلال ساعة', morning: 'الصبح', late: 'من يفضى واحد' } },
      vanish: { title: 'بصراحة، كم واحد يسأل عن السعر ويختفي؟', hint: 'هذا الجواب محد يشوفه غيرك وغيرنا.', options: { few: 'تقريباً واحد من كل 10', some: 'تقريباً 3 من كل 10', half: 'تقريباً النص', most: 'أغلبهم' } },
      hours: { title: 'كل أسبوع، كم ساعة تروح على النسخ واللصق، ورد "بيش؟"، والفواتير والتقارير؟', options: { h1: 'أقل من 3 ساعات', h2: '3 إلى 8 ساعات', h3: '8 إلى 15 ساعة', h4: 'أكثر من 15 ساعة' } },
      system: { title: 'الزبائن والطلبات محفوظين أغلبهم بـ…', options: { paper: 'دفتر أو ورق', head: 'براسنا', excel: 'إكسل أو Google Sheets', wabiz: 'تصنيفات واتساب بزنس', software: 'نظام أو برنامج خاص' } },
      bottleneck: { title: 'لو تكدر تصلّح شي واحد هالشهر، راح يكون…', options: { replies: 'الرد السريع على الرسائل', bookings: 'الحجوزات والمواعيد', orders: 'استلام الطلبات ومتابعتها', followup: 'متابعة اللي سألوا وسكتوا', admin: 'الحسابات والمخزن والتقارير', presence: 'الناس تلگانا وتثق بينا أونلاين' } },
      timeline: { title: 'إمتى تريد الأمور تبدي تتحسن؟', options: { now: 'هالشهر', quarter: 'خلال الثلاث أشهر الجاية', later: 'بعدين هالسنة', curious: 'بس دا أستكشف' } },
      decider: { title: 'منو لازم تقنعه؟', options: { me: 'محد، آني أقرر', partner: 'شريكي أو أهلي', manager: 'مدير فوگي', committee: 'مجلس أو لجنة' } },
      band: { title: 'لو نظام يوفرلك 10 ساعات بالأسبوع، شكد يسوى عندك بالشهر؟', options: { b1: 'أقل من 150 ألف دينار', b2: '150 إلى 450 ألف دينار', b3: '450 ألف إلى مليون و200', b4: 'أكثر من مليون و200' } },
      worry: { title: 'شنو أكثر شي يقلقك من استخدام الذكاء الاصطناعي ويا الزبائن؟', options: { robotic: 'يطلع كلامه آلي', data: 'منو يشوف بياناتنا', mistakes: 'يجاوب غلط', price: 'الكلفة', staff: 'الموظفين ما يتقبلوه' } },
    },
    short: {
      volume: { v1: 'أقل من 10', v2: '10 إلى 30', v3: '30 إلى 100', v4: 'أكثر من 100' },
      reply: { minutes: 'خلال دقائق', hour: 'خلال ساعة', morning: 'في الصباح التالي', late: 'متى ما تفرّغ أحد' },
      vanish: { few: 'تقريباً واحد من كل 10', some: 'تقريباً 3 من كل 10', half: 'تقريباً النصف', most: 'أغلبهم' },
      hours: { h1: 'أقل من 3', h2: '3 إلى 8', h3: '8 إلى 15', h4: 'أكثر من 15' },
      industry: { clinic: 'عيادتك', restaurant: 'مطعمك', store: 'متجرك', retail: 'محلك', realestate: 'مكتبك العقاري', education: 'مدرستك', services: 'شركتك', other: 'شغلك' },
      system: { paper: 'الدفتر', head: 'الذاكرة', excel: 'جداول الإكسل', wabiz: 'تصنيفات الواتساب', software: 'نظامك الخاص' },
      bottleneck: { replies: 'سرعة الرد', bookings: 'الحجوزات', orders: 'الطلبات', followup: 'المتابعة', admin: 'الحسابات والتقارير', presence: 'الحضور أونلاين' },
      team: { solo: 'أنت وحدك', small: '2 إلى 3 أشخاص', mid: '4 إلى 10 أشخاص', large: 'فريق أكثر من 10' },
    },
    analysing: {
      title: 'نقرأ أجوبتك',
      steps: ['نحسب استفساراتك الشهرية', 'نقارن سرعة ردك بتوقعات الزبائن', 'نربط مشكلتك الأساسية بخطة'],
    },
    reveal: {
      eyebrow: 'مدارك',
      scoreLabel: 'درجة المدار',
      scoreNote: 'قدرة شغلك على إبقاء الزبائن في مداره، من 100.',
      lostLabel: 'استفسارات تفلت منك كل شهر',
      lostNote: 'من أجوبتك أنت: {volume} رسالة جديدة يومياً، و{vanish} يختفون بعد السؤال.',
      rushQuote: 'في التحمية رديت على {a} من {t} رسالة خلال 6 ثواني.',
      sharedNote: 'هذه نتيجة شاركها معك شخص آخر.',
      sharedCta: 'اكتشف نتيجتك خلال 60 ثانية',
    },
    archetypes: {
      lone: { name: 'النجم الوحيد', line: '{team} ترد على كل زبائن {industry}. ومع {volume} رسالة جديدة يومياً، كل رد يأخذ وقتاً من الشغل اللي ما يسويه غيرك.' },
      crowded: { name: 'الكوكب المزدحم', line: 'الطلب مو مشكلتك: {volume} رسالة جديدة يومياً. لكن الرد يوصل {reply}، وبوقتها هواية زبائن سألوا غيرك.' },
      drifting: { name: 'القمر التائه', line: 'زبائنك وطلباتك محفوظة في {system}. هذا يمشي لحد ما يغيب أحد، أو تضيع ورقة، أو محد يتذكر منو سأل عن شنو.' },
      leak: { name: 'التسرّب الهادئ', line: 'من كل اللي يسألونك عن السعر، {vanish} ما يرجعون. التسرّب هادئ، فنادراً ما يظهر في أي تقرير.' },
      ready: { name: 'المدار الجاهز', line: 'أساسك قوي: الرد يوصل {reply} والزبائن محفوظين في {system}. ربحك الجاي من {bottleneck}، مو من تصليح الأساسيات.' },
      steady: { name: 'المدار الثابت', line: 'الشغل ماشي، بس ماشي بالجهد: {hours} ساعات أسبوعياً على شغل متكرر، والرد يوصل {reply}. أكبر ربح عندك في {bottleneck}.' },
    },
    gate: {
      title: 'استلم تقريرك الكامل',
      text: 'التقرير الكامل يبيّن المبلغ اللي على المحك، وتوقع 12 شهر مع الأتمتة وبدونها، وخطة من 3 خطوات لـ{industry}. ما نرسل أي شي ثاني إلا إذا طلبت.',
      name: 'اسمك',
      business: 'اسم الشغل',
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
      title: 'شنو دا يفلت منك، وشلون تحافظ عليه',
      code: 'كود النتيجة',
      numbers: { lost: 'استفسارات ضايعة', recoverable: 'ممكن ترجعها بالرد الفوري', hours: 'ساعات تتحرر من الشغل المتكرر', money: 'قيمة على المحك', perMonth: 'شهرياً' },
      assumptions: {
        title: 'افتراضات تگدر تغيّرها',
        value: 'قيمة الزبون الجديد (دينار)',
        conv: 'نسبة الاستفسارات اللي تصير زبائن (%)',
        note: 'القيم الأولية تقديرية لـ{industry}. غيّرها لأرقامك الحقيقية وكل الأرقام تتحدث.',
      },
      forecast: {
        title: 'الـ 12 شهر الجاية',
        text: 'زبائن جدد من الاستفسارات، شهر بشهر، بمسارين.',
        current: 'مثل اليوم',
        automated: 'مع الرد الفوري',
        months: 'الشهر',
        setup: 'الشهر الأول لبناء النظام.',
        gap: 'تقريباً {n} زبون إضافي خلال 12 شهر.',
      },
      planTitle: 'خطواتك الثلاث',
      stepLabel: 'الخطوة {i}',
      more: 'شلون يشتغل',
      method: {
        title: 'شلون حسبنا هذه الأرقام',
        items: [
          'الاستفسارات الشهرية = رسائلك اليومية (منتصف الفئة اللي اخترتها) × 26 يوم عمل.',
          'الاستفسارات الضايعة = الاستفسارات الشهرية × النسبة اللي قلت إنها تختفي.',
          'المسترجَع بالرد الفوري: من 12% إلى 55% من الضايع حسب سرعة ردك الحالية. أبحاث سرعة الاستجابة (Oldroyd، MIT/InsideSales 2007؛ Harvard Business Review 2011) تبيّن أن فرصة الوصول للزبون تنزل بشدة بعد الدقائق الأولى. استخدمنا نسباً محافظة عمداً.',
          'الساعات المتحررة: من 40% إلى 60% من الساعات المتكررة اللي ذكرتها (ماكنزي تقدّر أن حوالي 45% من الأنشطة المدفوعة قابلة للأتمتة بالتقنية الحالية).',
          'كل رقم نطاق حول التقدير. هو بداية حديث، مو وعد.',
        ],
      },
    },
    steps: {
      agent: { title: 'وكيل يرد بأقل من دقيقة', text: 'وكيل على الواتساب والإنستغرام يجاوب عن السعر والموقع والتوفر ليل نهار، بأسلوبك، ويحوّل المحادثات الجدية لفريقك.' },
      booking: { title: 'حجوزات تتأكد لوحدها', text: 'الزبون يختار موعد فارغ داخل المحادثة، ويوصله تأكيد وتذكير قبلها بيوم. غيابات أقل وبدون أخذ ورد.' },
      orders: { title: 'طلبات تنسجل بدون نسخ ولصق', text: 'كل طلب من الواتساب أو الإنستغرام ينزل بقائمة وحدة بالاسم والعنوان والحالة، جاهز للتوصيل والحسابات.' },
      followup: { title: 'متابعة تلقائية', text: 'اللي سألوا وسكتوا توصلهم متابعة مؤدبة بالوقت المناسب، وفريقك يشوف منو جاهز يشتري.' },
      erp: { title: 'المخزن والحسابات والتقارير بنظام واحد', text: 'نظام واحد للمبيعات والمخزن والمصاريف، والتقارير اللي تسويها هسه باليد تطلع لوحدها.' },
      presence: { title: 'موقع يبيع وأنت نايم', text: 'موقع سريع باللغتين يجاوب الأسئلة اللي يسألها الزبون قبل ما يثق بيك، ويوديه للواتساب مباشرة.' },
      digitize: { title: 'طلّع زبائنك من {system}', text: 'كل زبون وطلب وحجز بنظام بسيط واحد يشوفه كل الفريق، فمحد يعتمد على الذاكرة أو الورق.' },
      excel: { title: 'جداول تحدّث نفسها', text: 'نربط جداولك بقنواتك حتى الطلبات والزبائن تنسجل لوحدها، مع لوحة مباشرة بدل النسخ اليدوي.' },
      crm: { title: 'من تصنيفات الواتساب لقائمة زبائن حقيقية', text: 'كل محادثة مربوطة بسجل زبون بيه المرحلة والتاريخ والخطوة الجاية، فالمتابعة ما تعتمد على التمرير بالمحادثات.' },
      connect: { title: 'اربط نظامك بقنواتك', text: 'برنامجك الحالي يستلم الرسائل والطلبات والحجوزات مباشرة، بدون ما أحد يعيد كتابتها.' },
      report: { title: 'تقرير أسبوعي على موبايلك', text: 'الاستفسارات، وقت الرد، الزبائن اللي كسبتهم وخسرتهم، كل أسبوع برسالة وحدة. اللي ينقاس يتحسن.' },
      brand: { title: 'هوية يعرفها الزبون ويثق بيها', text: 'هوية واضحة بصفحتك وموقعك ورسائلك، حتى الزبون الجديد يعرف منو أنت قبل ما يسأل عن السعر.' },
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
      waMessage: 'مرحباً نوى، كود نتيجتي {code}. المدار: {archetype} ({score}/100). {industry}. أريد أناقش الخطة.',
      share: 'شارك مدارك',
      shareText: 'مدار شغلي: {archetype}، {score}/100. اكتشف مدارك:',
      download: 'نزّل بطاقة مدارك',
      copied: 'انسخ الرابط',
      contact: 'تفضّل النموذج؟ صفحة التواصل',
    },
    noscript: 'هذا التشخيص يحتاج JavaScript. تگدر تتواصل ويانا مباشرة:',
    currency: { unit: 'دينار', thousand: 'ألف', million: 'مليون' },
  },
};
