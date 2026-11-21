/**
 * فرع NAWA Legal Tech: بيانات الخدمات الست (اللغتان جنباً إلى جنب حتى يبقى النصان متطابقين).
 * كل خدمة = كوكب في الصفحة الرئيسية + صفحة تفاصيل /services/<slug>/ + زاوية من سداسي الشعار.
 *
 * timeline: مدة تقديرية تجريبية (draft) — لا تظهر في الموقع الحي حتى تؤكدها.
 * limits: كل خدمة تقول صراحة إنها أداة للمحامي ولا تقدّم استشارة قانونية.
 */
import type { Lang } from '../../../config/site';

export type PlanetKey = 'jupiter' | 'violet' | 'earth' | 'saturn' | 'mars' | 'moon';

export interface ServiceCopy {
  name: string;
  short: string; // اسم قصير لنقاط المدار
  outcome: string; // سطر واحد: النتيجة
  title: string; // عنوان صفحة الخدمة (*…* = العبارة الذهبية)
  intro: string;
  problems: string[];
  deliverables: string[];
  flow: [string, string, string]; // من → النظام → إلى
  sectors: { name: string; text: string }[];
  limits: string[];
  faq: { q: string; a: string }[];
  timeline: string; // draft
  wa: string; // رسالة واتساب الجاهزة
}

export interface Service {
  slug: string;
  planet: PlanetKey;
  en: ServiceCopy;
  ar: ServiceCopy;
}

export const services: Service[] = [
  {
    slug: 'legal-assistant',
    planet: 'jupiter',
    en: {
      name: 'AI Legal Assistant',
      short: 'Assistant',
      outcome: 'An assistant that searches Iraqi law, your precedents and your files, and shows its sources.',
      title: 'Research that takes minutes, *with every source shown.*',
      intro: 'Much of a lawyer’s day goes into finding the right article, the last similar case or the clause you wrote two years ago. The assistant searches Iraqi legislation and your own archive in Arabic, answers with the exact text it relied on, and leaves the judgement to you.',
      problems: ['Hours spent searching gazettes, books and old files for one article.', 'Knowledge that lives in one senior lawyer’s head.', 'First drafts of memos written from a blank page every time.'],
      deliverables: ['An assistant connected to the Iraqi laws you work with most.', 'Search across your own precedents, memos and templates.', 'Every answer linked to the article or document it came from.', 'Access by role, with a record of every question asked.'],
      flow: ['A legal question', 'The assistant', 'An answer with its sources, for the lawyer to review'],
      sectors: [
        { name: 'Litigation firms', text: 'Finding articles, procedure and similar past cases quickly.' },
        { name: 'Corporate firms', text: 'Checking companies, investment and labour rules before drafting.' },
        { name: 'In-house teams', text: 'Fast first answers to internal questions, reviewed by the team.' },
      ],
      limits: ['It does not give legal advice. A licensed lawyer reviews every answer before it is used.', 'It answers from the laws and documents it has been given. If a law is missing or out of date, it says so instead of guessing.', 'It does not replace reading the full text for decisive questions.'],
      faq: [
        { q: 'Does it understand Iraqi legal Arabic?', a: 'Yes. We test it on your real questions before launch and correct its terms where it misreads.' },
        { q: 'What if it does not know?', a: 'It says it found no source. It is built not to invent an article or a ruling.' },
        { q: 'Is our archive used to train public AI?', a: 'No. Your documents stay in your system and are never used to train public models.' },
      ],
      timeline: '3–6 weeks',
      wa: 'Hello NAWA, I would like to ask about the AI legal assistant.',
    },
    ar: {
      name: 'المساعد القانوني الذكي',
      short: 'المساعد',
      outcome: 'مساعد يبحث في القوانين العراقية وسوابقك وملفاتك، ويعرض مصادره.',
      title: 'بحث يأخذ دقائق، *ومصدر كل جواب أمامك*',
      intro: 'جزء كبير من يوم المحامي يذهب في البحث عن المادة الصحيحة، أو آخر قضية مشابهة، أو بند كتبته قبل سنتين. المساعد يبحث في التشريعات العراقية وأرشيفك الخاص بالعربية، ويجيب بالنص الذي اعتمد عليه حرفياً، ويترك التقدير لك.',
      problems: ['ساعات تُصرف في الوقائع والكتب والملفات القديمة بحثاً عن مادة واحدة.', 'معرفة تعيش في رأس محامٍ كبير واحد.', 'مسودات المذكرات تبدأ من صفحة فارغة كل مرة.'],
      deliverables: ['مساعد مربوط بالقوانين العراقية التي تعمل عليها أكثر.', 'بحث في سوابقك ومذكراتك ونماذجك الخاصة.', 'كل جواب مربوط بالمادة أو المستند الذي جاء منه.', 'صلاحيات حسب الدور، وسجل بكل سؤال طُرح.'],
      flow: ['سؤال قانوني', 'المساعد', 'جواب بمصادره، يراجعه المحامي'],
      sectors: [
        { name: 'مكاتب التقاضي', text: 'الوصول السريع إلى المواد والإجراءات والقضايا المشابهة.' },
        { name: 'مكاتب الشركات', text: 'التحقق من قواعد الشركات والاستثمار والعمل قبل الصياغة.' },
        { name: 'الأقسام القانونية', text: 'أجوبة أولى سريعة على الأسئلة الداخلية، يراجعها الفريق.' },
      ],
      limits: ['لا يقدّم استشارة قانونية. المحامي المرخّص يراجع كل جواب قبل استخدامه.', 'يجيب مما أُعطي من قوانين ومستندات. وإذا كان القانون ناقصاً أو قديماً يقول ذلك ولا يخمّن.', 'لا يغني عن قراءة النص كاملاً في المسائل الحاسمة.'],
      faq: [
        { q: 'هل يفهم اللغة القانونية العراقية؟', a: 'نعم. نختبره على أسئلتك الحقيقية قبل الإطلاق ونصحّح مصطلحاته حيث يخطئ.' },
        { q: 'ماذا لو لم يعرف؟', a: 'يقول إنه لم يجد مصدراً. هو مبني حتى لا يخترع مادة أو حكماً.' },
        { q: 'هل يُستخدم أرشيفنا لتدريب ذكاء اصطناعي عام؟', a: 'لا. مستنداتك تبقى في نظامك ولا تُستخدم أبداً لتدريب نماذج عامة.' },
      ],
      timeline: 'من 3 إلى 6 أسابيع',
      wa: 'مرحباً نوى، أريد الاستفسار عن المساعد القانوني الذكي.',
    },
  },
  {
    slug: 'contracts',
    planet: 'violet',
    en: {
      name: 'Contract Management',
      short: 'Contracts',
      outcome: 'Contracts drafted from your templates, reviewed against your rules, and renewed on time.',
      title: 'Every contract in one place, *and no renewal missed.*',
      intro: 'Contracts are written from old files, signed in several versions and forgotten in a drawer until a problem appears. We build one place where contracts are drafted from approved templates, checked against your standard positions, and tracked to every renewal and obligation.',
      problems: ['Contracts rewritten from an old file, with the old mistakes.', 'Nobody sure which version was actually signed.', 'Renewals and notice periods discovered after they pass.'],
      deliverables: ['A library of approved templates and clauses, in Arabic and English.', 'Review that flags clauses outside your standard positions.', 'One record per contract: signed copy, parties, values and dates.', 'Alerts before every renewal, expiry and notice period.'],
      flow: ['A new or signed contract', 'The contract system', 'Clean drafts, clear records, timely alerts'],
      sectors: [
        { name: 'Corporate firms', text: 'Drafting and reviewing contracts for many clients at once.' },
        { name: 'In-house teams', text: 'Supplier, lease and employment contracts across the company.' },
        { name: 'Real estate and contracting', text: 'Leases, sale contracts and subcontracts with many deadlines.' },
      ],
      limits: ['It does not negotiate or decide. It shows the lawyer what differs from your standard.', 'Its review is only as good as the positions you agree with us. We write them with your lawyers.', 'Electronic signing follows Iraqi law (Electronic Signature and Electronic Transactions Law No. 78 of 2012). Where paper is required, we track the paper.'],
      faq: [
        { q: 'Can it read our old paper contracts?', a: 'Yes. We scan them, extract parties, dates and values, and a person checks the result.' },
        { q: 'Does it work in Arabic and English?', a: 'Yes. Templates, review and records work in both, including bilingual contracts.' },
      ],
      timeline: '3–5 weeks',
      wa: 'Hello NAWA, I would like to ask about contract management.',
    },
    ar: {
      name: 'إدارة العقود',
      short: 'العقود',
      outcome: 'عقود تُصاغ من نماذجك، وتُراجَع وفق قواعدك، وتُجدَّد في وقتها.',
      title: 'كل عقد في مكان واحد، *ولا تجديد يفوتك*',
      intro: 'العقود تُكتب من ملفات قديمة، وتُوقَّع بأكثر من نسخة، وتُنسى في الدرج حتى تظهر مشكلة. نبني مكاناً واحداً تُصاغ فيه العقود من نماذج معتمدة، وتُفحص وفق مواقفك الثابتة، وتُتابَع حتى آخر تجديد والتزام.',
      problems: ['عقود تُعاد كتابتها من ملف قديم، بأخطائه القديمة.', 'لا أحد متأكد أي نسخة وُقّعت فعلاً.', 'تجديدات ومهل إشعار تُكتشف بعد فواتها.'],
      deliverables: ['مكتبة نماذج وبنود معتمدة، بالعربية والإنجليزية.', 'مراجعة تنبّه إلى البنود الخارجة عن مواقفك الثابتة.', 'سجل واحد لكل عقد: النسخة الموقعة والأطراف والقيم والتواريخ.', 'تنبيهات قبل كل تجديد وانتهاء ومهلة إشعار.'],
      flow: ['عقد جديد أو موقَّع', 'نظام العقود', 'مسودات نظيفة وسجلات واضحة وتنبيهات في وقتها'],
      sectors: [
        { name: 'مكاتب الشركات', text: 'صياغة ومراجعة عقود لعملاء كثيرين في الوقت نفسه.' },
        { name: 'الأقسام القانونية', text: 'عقود الموردين والإيجار والعمل في كل الشركة.' },
        { name: 'العقارات والمقاولات', text: 'عقود إيجار وبيع ومقاولات ثانوية بمواعيد كثيرة.' },
      ],
      limits: ['لا يفاوض ولا يقرر. يُري المحامي ما يختلف عن مواقفك الثابتة.', 'مراجعته بقدر جودة المواقف التي نتفق عليها. ونكتبها مع محاميك.', 'التوقيع الإلكتروني يتبع القانون العراقي (قانون التوقيع الإلكتروني والمعاملات الإلكترونية رقم 78 لسنة 2012). وحيث يُشترط الورق، نتابع الورق.'],
      faq: [
        { q: 'هل يقرأ عقودنا الورقية القديمة؟', a: 'نعم. نمسحها ضوئياً ونستخرج الأطراف والتواريخ والقيم، ويراجع شخص النتيجة.' },
        { q: 'هل يعمل بالعربية والإنجليزية؟', a: 'نعم. النماذج والمراجعة والسجلات تعمل باللغتين، بما فيها العقود ثنائية اللغة.' },
      ],
      timeline: 'من 3 إلى 5 أسابيع',
      wa: 'مرحباً نوى، أريد الاستفسار عن إدارة العقود.',
    },
  },
  {
    slug: 'case-management',
    planet: 'saturn',
    en: {
      name: 'Case & Practice Management',
      short: 'Cases',
      outcome: 'Cases, hearings, deadlines, files and fees in one system the whole office can see.',
      title: 'Every case, hearing and deadline, *in one orbit.*',
      intro: 'When hearings live in a diary, files in a cabinet and updates in WhatsApp, one absence is enough for a deadline to slip. We build one system where every matter has its file, its people, its dates and its fees, and the office is reminded before anything is due.',
      problems: ['Hearing dates kept in one diary that one person holds.', 'Appeal periods and notifications counted by hand.', 'Clients calling to ask for news nobody has written down.'],
      deliverables: ['One record per matter: parties, court, documents, notes and fees.', 'A shared calendar of hearings and time limits, with alerts.', 'Tasks assigned to lawyers and staff, with status.', 'Time and fee tracking, and invoices from the same record.'],
      flow: ['A new matter or a court date', 'The practice system', 'Reminders, tasks and an up-to-date file'],
      sectors: [
        { name: 'Litigation firms', text: 'Hearings, adjournments, appeal periods and court documents.' },
        { name: 'General practices', text: 'Mixed matters, powers of attorney and client follow-up.' },
        { name: 'In-house teams', text: 'Disputes, outside counsel and reports to management.' },
      ],
      limits: ['It reminds, it does not count legal time limits for you. A lawyer confirms each limit when it is entered.', 'It only works if the office uses it. We train the team, and the partners need to require it.', 'We start with the matters that matter most. Not every old file on day one.'],
      faq: [
        { q: 'Can it work in Kurdistan courts as well?', a: 'Yes. Courts, procedures and languages are set per matter.' },
        { q: 'Can clients see their case status?', a: 'If you want, a client portal can show the status you choose to share, and nothing else.' },
      ],
      timeline: '1–3 months',
      wa: 'Hello NAWA, I would like to ask about a case management system.',
    },
    ar: {
      name: 'إدارة القضايا والمكتب',
      short: 'القضايا',
      outcome: 'القضايا والجلسات والمواعيد والملفات والأتعاب في نظام واحد يراه المكتب كله.',
      title: 'كل قضية وجلسة وموعد، *في مدار واحد*',
      intro: 'عندما تعيش الجلسات في أجندة، والملفات في خزانة، والتحديثات في الواتساب، يكفي غياب شخص واحد حتى يفلت موعد. نبني نظاماً واحداً يكون فيه لكل ملف أوراقه وأشخاصه ومواعيده وأتعابه، ويُنبَّه المكتب قبل أي استحقاق.',
      problems: ['مواعيد الجلسات في أجندة واحدة يحملها شخص واحد.', 'مُدد الطعن والتبليغات تُحسب باليد.', 'موكلون يتصلون يسألون عن أخبار لم يكتبها أحد.'],
      deliverables: ['سجل واحد لكل ملف: الأطراف والمحكمة والمستندات والملاحظات والأتعاب.', 'تقويم مشترك للجلسات والمدد القانونية، مع تنبيهات.', 'مهام موزعة على المحامين والموظفين، مع حالتها.', 'متابعة الوقت والأتعاب، والفواتير من السجل نفسه.'],
      flow: ['ملف جديد أو موعد محكمة', 'نظام المكتب', 'تذكيرات ومهام وملف محدَّث'],
      sectors: [
        { name: 'مكاتب التقاضي', text: 'الجلسات والتأجيلات ومدد الطعن ومستندات المحكمة.' },
        { name: 'المكاتب العامة', text: 'ملفات متنوعة ووكالات ومتابعة الموكلين.' },
        { name: 'الأقسام القانونية', text: 'النزاعات والمحامون الخارجيون والتقارير للإدارة.' },
      ],
      limits: ['يذكّر ولا يحسب المدد القانونية بدلاً منك. المحامي يؤكد كل مدة عند إدخالها.', 'ينجح فقط إذا استخدمه المكتب. نحن ندرّب الفريق، والشركاء يُلزمون به.', 'نبدأ بالملفات الأهم. لا كل ملف قديم في اليوم الأول.'],
      faq: [
        { q: 'هل يعمل مع محاكم إقليم كردستان أيضاً؟', a: 'نعم. المحاكم والإجراءات واللغات تُضبط لكل ملف.' },
        { q: 'هل يرى الموكل حالة قضيته؟', a: 'إذا أردت، بوابة للموكل تعرض الحالة التي تختار مشاركتها، ولا شيء غيرها.' },
      ],
      timeline: 'من شهر إلى 3 أشهر',
      wa: 'مرحباً نوى، أريد الاستفسار عن نظام إدارة القضايا.',
    },
  },
  {
    slug: 'documents',
    planet: 'moon',
    en: {
      name: 'Document Archive',
      short: 'Archive',
      outcome: 'Paper files and WhatsApp attachments turned into one searchable archive, in Arabic.',
      title: 'Find any document *in seconds, not days.*',
      intro: 'Pleadings, powers of attorney, court decisions and signed contracts sit in cabinets, phones and personal folders. We scan and read them with Arabic text recognition, file each one under its matter, and make the whole archive searchable by name, number, date or phrase.',
      problems: ['A whole morning lost looking for one signed copy.', 'Documents sent on WhatsApp and lost with the phone.', 'Several copies of the same file, none of them sure.'],
      deliverables: ['Scanning and Arabic text recognition for your existing files.', 'Every document filed under its matter and client.', 'Search by name, number, date or any phrase inside the text.', 'Versions, access by role and a record of who opened what.'],
      flow: ['Paper, PDF or a WhatsApp attachment', 'The archive', 'The right document, found in seconds'],
      sectors: [
        { name: 'Long-established offices', text: 'Years of paper files moved into one archive.' },
        { name: 'Litigation firms', text: 'Court decisions and pleadings ready for every hearing.' },
        { name: 'In-house teams', text: 'Company records, licences and contracts in one place.' },
      ],
      limits: ['Text recognition is not perfect, especially on handwriting and old stamps. Key fields are checked by a person.', 'Scanning does not replace originals where the law requires them. Keep them.', 'We do not take files out of your office without a signed custody record.'],
      faq: [
        { q: 'Who does the scanning?', a: 'Our team at your office, or your staff with our process and equipment. Files stay under your custody.' },
        { q: 'Where is the archive stored?', a: 'In the hosting you approve, encrypted, with backups. You hold the keys.' },
      ],
      timeline: '2–6 weeks, depending on volume',
      wa: 'Hello NAWA, I would like to ask about a document archive.',
    },
    ar: {
      name: 'أرشفة المستندات',
      short: 'الأرشيف',
      outcome: 'الملفات الورقية ومرفقات الواتساب تتحول إلى أرشيف واحد قابل للبحث، بالعربية.',
      title: 'أي مستند تجده *بثوانٍ، لا بأيام*',
      intro: 'اللوائح والوكالات وقرارات المحاكم والعقود الموقعة موزعة بين الخزائن والهواتف والمجلدات الشخصية. نمسحها ونقرؤها بتقنية التعرّف على النص العربي، ونضع كل مستند تحت ملفه، ونجعل الأرشيف كله قابلاً للبحث بالاسم أو الرقم أو التاريخ أو أي عبارة.',
      problems: ['صباح كامل يضيع بحثاً عن نسخة موقعة واحدة.', 'مستندات أُرسلت على الواتساب وضاعت مع الهاتف.', 'نسخ متعددة من الملف نفسه، ولا يقين في أي منها.'],
      deliverables: ['مسح ضوئي وتعرّف على النص العربي لملفاتك الحالية.', 'كل مستند تحت ملفه وموكله.', 'بحث بالاسم أو الرقم أو التاريخ أو أي عبارة داخل النص.', 'نسخ متتابعة، وصلاحيات حسب الدور، وسجل بمن فتح ماذا.'],
      flow: ['ورق أو PDF أو مرفق واتساب', 'الأرشيف', 'المستند الصحيح، بثوانٍ'],
      sectors: [
        { name: 'المكاتب العريقة', text: 'سنوات من الملفات الورقية في أرشيف واحد.' },
        { name: 'مكاتب التقاضي', text: 'قرارات المحاكم واللوائح جاهزة لكل جلسة.' },
        { name: 'الأقسام القانونية', text: 'سجلات الشركة وإجازاتها وعقودها في مكان واحد.' },
      ],
      limits: ['التعرّف على النص ليس كاملاً، خصوصاً مع خط اليد والأختام القديمة. الحقول المهمة يراجعها شخص.', 'المسح لا يغني عن الأصول حيث يشترطها القانون. احتفظ بها.', 'لا نُخرج ملفات من مكتبك دون محضر استلام موقَّع.'],
      faq: [
        { q: 'من يقوم بالمسح؟', a: 'فريقنا في مكتبك، أو موظفوك بطريقتنا ومعداتنا. والملفات تبقى في عهدتك.' },
        { q: 'أين يُحفظ الأرشيف؟', a: 'في الاستضافة التي توافق عليها، مشفّراً، مع نسخ احتياطية. والمفاتيح عندك.' },
      ],
      timeline: 'من أسبوعين إلى 6 أسابيع حسب الحجم',
      wa: 'مرحباً نوى، أريد الاستفسار عن أرشفة المستندات.',
    },
  },
  {
    slug: 'client-intake',
    planet: 'earth',
    en: {
      name: 'Client Intake',
      short: 'Intake',
      outcome: 'New legal requests on WhatsApp received, sorted and booked, so no client waits unanswered.',
      title: 'Every new client answered, *without a lawyer on the phone all day.*',
      intro: 'Most first messages to a law office ask the same things: fees, documents needed, office hours, the next available consultation. An intake assistant answers those at once, collects the basic facts, checks for conflicts, and books the consultation with the right lawyer.',
      problems: ['Lawyers interrupted all day by first-contact calls.', 'Messages at night that wait until morning, or forever.', 'Consultations booked without the basic facts or documents.'],
      deliverables: ['An intake assistant on WhatsApp and your website, in Iraqi Arabic.', 'A short structured form for each type of matter.', 'A conflict check against your existing clients before booking.', 'Consultations booked into the right lawyer’s calendar, with reminders.'],
      flow: ['A new client message', 'The intake assistant', 'A booked consultation with the facts collected'],
      sectors: [
        { name: 'Family and personal status', text: 'Sensitive first contact, handled calmly and privately.' },
        { name: 'Labour and commercial', text: 'Collecting contracts and facts before the first meeting.' },
        { name: 'General practices', text: 'Sorting requests to the right lawyer.' },
      ],
      limits: ['It does not advise clients. It answers practical questions and hands every legal question to a lawyer.', 'It never promises an outcome or quotes a fee you have not approved.', 'Sensitive matters go straight to a person, with the conversation attached.'],
      faq: [
        { q: 'Will clients know it is not a person?', a: 'Yes. It introduces itself as the office assistant. Trust starts with honesty.' },
        { q: 'Is it allowed for a law office?', a: 'Answering practical questions and booking is not legal practice. We keep it to that, and your lawyers review the script.' },
      ],
      timeline: '2–4 weeks',
      wa: 'Hello NAWA, I would like to ask about client intake on WhatsApp.',
    },
    ar: {
      name: 'استقبال الموكلين',
      short: 'الاستقبال',
      outcome: 'الطلبات القانونية الجديدة على الواتساب تُستقبَل وتُفرَز وتُحجَز، فلا ينتظر موكل بلا جواب.',
      title: 'كل موكل جديد يجد جواباً، *دون أن يبقى محامٍ على الهاتف طوال اليوم*',
      intro: 'معظم الرسائل الأولى لمكتب المحاماة تسأل الأشياء نفسها: الأتعاب، والمستندات المطلوبة، وأوقات الدوام، وأقرب موعد استشارة. مساعد الاستقبال يجيب عنها فوراً، ويجمع الوقائع الأساسية، ويتحقق من تعارض المصالح، ويحجز الاستشارة مع المحامي المناسب.',
      problems: ['محامون تقطعهم طوال اليوم اتصالات التواصل الأول.', 'رسائل ليلية تنتظر حتى الصباح، أو إلى الأبد.', 'استشارات تُحجز دون الوقائع أو المستندات الأساسية.'],
      deliverables: ['مساعد استقبال على الواتساب والموقع، باللهجة العراقية.', 'نموذج قصير منظّم لكل نوع من الملفات.', 'فحص تعارض المصالح مع موكليك الحاليين قبل الحجز.', 'استشارات تُحجز في تقويم المحامي المناسب، مع تذكير.'],
      flow: ['رسالة موكل جديد', 'مساعد الاستقبال', 'استشارة محجوزة والوقائع مجموعة'],
      sectors: [
        { name: 'الأحوال الشخصية', text: 'تواصل أول حساس، يُدار بهدوء وخصوصية.' },
        { name: 'العمل والتجارة', text: 'جمع العقود والوقائع قبل الاجتماع الأول.' },
        { name: 'المكاتب العامة', text: 'توجيه الطلبات إلى المحامي المناسب.' },
      ],
      limits: ['لا يقدّم استشارة للموكلين. يجيب عن الأسئلة العملية ويحوّل كل سؤال قانوني إلى محامٍ.', 'لا يعد بنتيجة أبداً ولا يذكر أتعاباً لم توافق عليها.', 'الملفات الحساسة تذهب مباشرة إلى شخص، مع المحادثة كاملة.'],
      faq: [
        { q: 'هل يعرف الموكل أنه ليس شخصاً؟', a: 'نعم. يعرّف بنفسه كمساعد المكتب. الثقة تبدأ بالصراحة.' },
        { q: 'هل هذا مسموح لمكتب محاماة؟', a: 'الإجابة عن الأسئلة العملية والحجز ليست ممارسة للمحاماة. نُبقيه في هذه الحدود، ومحاموك يراجعون نصوصه.' },
      ],
      timeline: 'من أسبوعين إلى 4 أسابيع',
      wa: 'مرحباً نوى، أريد الاستفسار عن استقبال الموكلين على الواتساب.',
    },
  },
  {
    slug: 'compliance',
    planet: 'mars',
    en: {
      name: 'Compliance & Reporting',
      short: 'Reports',
      outcome: 'Licences, obligations and legal risk tracked, and reported to management without a week of spreadsheets.',
      title: 'Know what is due, *before anyone asks.*',
      intro: 'Companies carry licences, filings and regulatory obligations that expire quietly. Law firms need to see workload and fees across partners. We build registers and dashboards that track every obligation and produce the report management asks for, from live data.',
      problems: ['Licences and registrations that lapse without notice.', 'Monthly legal reports assembled by hand from five files.', 'Management unable to see legal risk until it becomes a case.'],
      deliverables: ['A register of licences, filings and obligations with owners and dates.', 'Alerts before every renewal and filing deadline.', 'Dashboards of open matters, exposure and workload.', 'Monthly reports produced from live data, in Arabic and English.'],
      flow: ['Obligations, matters and deadlines', 'The register', 'Alerts and reports for the people who decide'],
      sectors: [
        { name: 'In-house teams', text: 'Licences, regulatory filings and board reports.' },
        { name: 'Banks and telecoms', text: 'Many obligations, many regulators, one register.' },
        { name: 'Law firms', text: 'Workload, fees and matters across partners.' },
      ],
      limits: ['It tracks the obligations you and your lawyers define. It does not decide what the law requires of you.', 'A dashboard is only as current as the data entered. We design it so updates take seconds.', 'It does not replace a legal audit. It makes one faster.'],
      faq: [
        { q: 'Can it follow changes in regulations?', a: 'We can add new obligations as they are published, under a support agreement. Your lawyers confirm what applies.' },
        { q: 'Can we start with licences only?', a: 'Yes. Most teams start with the register that hurts most and add others later.' },
      ],
      timeline: '3–6 weeks',
      wa: 'Hello NAWA, I would like to ask about compliance and reporting.',
    },
    ar: {
      name: 'الامتثال والتقارير',
      short: 'الامتثال',
      outcome: 'الإجازات والالتزامات والمخاطر القانونية تحت المتابعة، وتقارير للإدارة دون أسبوع من الجداول.',
      title: 'اعرف ما يستحق، *قبل أن يسأل أحد*',
      intro: 'الشركات تحمل إجازات وتسجيلات والتزامات تنظيمية تنتهي بصمت. ومكاتب المحاماة تحتاج أن ترى حجم العمل والأتعاب عبر الشركاء. نبني سجلات ولوحات تتابع كل التزام، وتُخرج التقرير الذي تطلبه الإدارة من بيانات حيّة.',
      problems: ['إجازات وتسجيلات تنتهي دون تنبيه.', 'تقارير قانونية شهرية تُجمع باليد من خمسة ملفات.', 'إدارة لا ترى المخاطر القانونية حتى تصبح قضية.'],
      deliverables: ['سجل للإجازات والتسجيلات والالتزامات مع المسؤول والتاريخ.', 'تنبيهات قبل كل تجديد وموعد تقديم.', 'لوحات بالملفات المفتوحة والمخاطر وحجم العمل.', 'تقارير شهرية من بيانات حيّة، بالعربية والإنجليزية.'],
      flow: ['الالتزامات والملفات والمواعيد', 'السجل', 'تنبيهات وتقارير لأصحاب القرار'],
      sectors: [
        { name: 'الأقسام القانونية', text: 'الإجازات والتقديمات التنظيمية وتقارير مجلس الإدارة.' },
        { name: 'المصارف والاتصالات', text: 'التزامات كثيرة وجهات رقابية كثيرة وسجل واحد.' },
        { name: 'مكاتب المحاماة', text: 'حجم العمل والأتعاب والملفات عبر الشركاء.' },
      ],
      limits: ['يتابع الالتزامات التي تحددها أنت ومحاموك. لا يقرر ما يفرضه القانون عليك.', 'اللوحة بقدر حداثة البيانات المُدخلة. نصممها حتى يأخذ التحديث ثوانٍ.', 'لا يغني عن تدقيق قانوني. يجعله أسرع.'],
      faq: [
        { q: 'هل يتابع تغيّر الأنظمة؟', a: 'نضيف الالتزامات الجديدة عند نشرها، ضمن اتفاق دعم. ومحاموك يؤكدون ما ينطبق.' },
        { q: 'هل نبدأ بالإجازات فقط؟', a: 'نعم. أغلب الفرق تبدأ بالسجل الأكثر تعباً ثم تضيف غيره.' },
      ],
      timeline: 'من 3 إلى 6 أسابيع',
      wa: 'مرحباً نوى، أريد الاستفسار عن الامتثال والتقارير.',
    },
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
export const serviceCopy = (s: Service, lang: Lang): ServiceCopy => s[lang];
