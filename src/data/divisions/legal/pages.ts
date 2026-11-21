/**
 * فرع NAWA Legal Tech: نصوص الصفحات باللغتين (الرئيسية، طريقة العمل، من نحن، التواصل، الأعمال، الخدمات، الخصوصية).
 * *…* داخل العنوان = العبارة الذهبية الوحيدة.
 * العناصر المعلّمة draft تجريبية ولا تظهر في الموقع الحي.
 *
 * قاعدة مهنية ثابتة في كل النصوص: نوى تبني التقنية للمحامي، ولا تقدّم استشارة قانونية ولا تحل محل المحامي.
 * (ممارسة المحاماة في العراق للمحامين المسجلين في النقابة: قانون المحاماة رقم 173 لسنة 1965)
 */
import { site } from '../../../config/site';

export const home = {
  en: {
    eyebrow: 'Legal tech · Baghdad',
    title: 'We build legal intelligence that *works.*',
    sub: 'Research, contracts, cases and documents, organised into one system for law firms and legal teams in Iraq.',
    // draft: أرقام نموذجية (من مثال مكتب المحاماة التجريبي) — استبدلها بأرقام حقيقية مقاسة
    proof: [
      { value: '0', label: 'missed hearings in one firm’s first six months' },
      { value: '4 wks', label: 'from signature to launch' },
      { value: '9 hrs', label: 'of searching and retyping removed each week' },
    ],
    services: { eyebrow: 'Services', title: 'Six services. *One practice.*', lead: 'Each one solves a different problem. Together they run a legal practice.', skip: 'Skip the services', all: 'All services' },
    work: { eyebrow: 'Work', title: 'Results, in *numbers.*', all: 'All work' },
    process: { eyebrow: 'How we work', title: 'A clear path from first call to *launch.*', lead: 'Six stages. In each one you know what happens, what you get and what we need from you.', link: 'See the full process' },
    principles: {
      eyebrow: 'Principles',
      title: 'What you can *hold us to.*',
      items: [
        { name: 'The lawyer decides', text: 'Our systems search, draft, sort and remind. Every legal judgement stays with a licensed lawyer.' },
        { name: 'Sources, not guesses', text: 'Every answer points to the law, the article or the document it came from. If there is no source, it says so.' },
        { name: 'Confidential by design', text: 'Access by role, a record of who opened what, and your files never used to train public models.' },
        { name: 'Arabic first', text: 'Built for Iraqi legal Arabic, its terms and its paperwork, with English alongside.' },
      ],
    },
    place: { eyebrow: 'Baghdad', title: 'Built in Baghdad. *Made to travel.*', text: 'We work from Baghdad, close to the courts and the paperwork we build for. A system that runs here runs in Erbil, Basra and wherever your clients are.', cities: 'Baghdad · Erbil · Basra · Amman · Riyadh · Dubai · Cairo · Istanbul' },
    faq: {
      eyebrow: 'Questions',
      title: 'Questions we hear *first.*',
      items: [
        { q: 'Do you give legal advice?', a: 'No. We build technology for lawyers. Advice, pleadings and decisions stay with your licensed lawyers.' },
        { q: 'Where are our files kept, and who can see them?', a: 'In the hosting you approve, encrypted, with access by role. We agree in writing who on our side can reach what, and when.' },
        { q: 'Can AI get the law wrong?', a: 'Yes, which is why it shows its sources and a lawyer reviews every output before it is used. We test it on your real cases before launch.' },
        { q: 'How long does a project take?', a: 'It depends on the scope. After a first call we give you a written timeline, stage by stage, before any work starts.' },
        { q: 'How much does it cost?', a: 'We quote a fixed price once we understand how your office works. You see the full cost before you sign.' },
        { q: 'Who owns the system and the data?', a: 'You do. Code, data and accounts are handed over to you at launch.' },
      ],
    },
    // يقود لزر الدعوة "Discover where your legal work slips" (تشخيص /launch)
    closing: { title: 'Every month, some deadlines *come too close.*', text: 'Nine quick answers show where your legal work slips, why, and the first step to hold it. 60 seconds, free.' },
  },
  ar: {
    eyebrow: 'تقنية قانونية · بغداد',
    title: 'نبني ذكاء قانوني *يشتغل*',
    sub: 'البحث والعقود والقضايا والمستندات، في نظام واحد لمكاتب المحاماة والأقسام القانونية في العراق.',
    proof: [
      { value: '0', label: 'جلسة فاتت مكتباً واحداً في أول ستة أشهر' },
      { value: '4 أسابيع', label: 'من التوقيع إلى الإطلاق' },
      { value: '9 ساعات', label: 'من البحث وإعادة الكتابة تُزال كل أسبوع' },
    ],
    services: { eyebrow: 'الخدمات', title: 'ست خدمات. *مكتب واحد.*', lead: 'كل خدمة تحل مشكلة مختلفة. ومجتمعةً تدير مكتباً قانونياً كاملاً.', skip: 'تخطَّ الخدمات', all: 'كل الخدمات' },
    work: { eyebrow: 'الأعمال', title: 'نتائج *بالأرقام*', all: 'كل الأعمال' },
    process: { eyebrow: 'طريقة العمل', title: 'طريق واضح من أول مكالمة إلى *الإطلاق*', lead: 'ست مراحل. في كل مرحلة تعرف ماذا يحدث، وماذا تستلم، وماذا نحتاج منك.', link: 'شاهد طريقة العمل كاملة' },
    principles: {
      eyebrow: 'مبادئنا',
      title: 'ما تستطيع أن *تحاسبنا عليه*',
      items: [
        { name: 'المحامي يقرر', text: 'أنظمتنا تبحث وتصيغ وترتّب وتذكّر. وكل تقدير قانوني يبقى عند محامٍ مرخّص.' },
        { name: 'مصادر لا تخمين', text: 'كل جواب يشير إلى القانون أو المادة أو المستند الذي جاء منه. وإذا لم يجد مصدراً يقول ذلك.' },
        { name: 'السرية من التصميم', text: 'صلاحيات حسب الدور، وسجل بمن فتح ماذا، وملفاتك لا تُستخدم لتدريب نماذج عامة.' },
        { name: 'العربية أولاً', text: 'مبني للغة القانونية العراقية ومصطلحاتها وأوراقها، والإنجليزية إلى جانبها.' },
      ],
    },
    place: { eyebrow: 'بغداد', title: 'بُني في بغداد. *ويعمل في كل مكان.*', text: 'نعمل من بغداد، قريباً من المحاكم والأوراق التي نبني لها. النظام الذي يعمل هنا يعمل في أربيل والبصرة وأينما كان موكلوك.', cities: 'بغداد · أربيل · البصرة · عمّان · الرياض · دبي · القاهرة · إسطنبول' },
    faq: {
      eyebrow: 'أسئلة',
      title: 'أسئلة نسمعها *أولاً*',
      items: [
        { q: 'هل تقدّمون استشارة قانونية؟', a: 'لا. نبني التقنية للمحامين. الاستشارة واللوائح والقرارات تبقى عند محاميك المرخّصين.' },
        { q: 'أين تُحفظ ملفاتنا، ومن يراها؟', a: 'في الاستضافة التي توافق عليها، مشفّرة، وبصلاحيات حسب الدور. ونتفق كتابةً على من يصل إلى ماذا من طرفنا، ومتى.' },
        { q: 'هل يخطئ الذكاء الاصطناعي في القانون؟', a: 'نعم، ولهذا يعرض مصادره ويراجع المحامي كل مخرَج قبل استخدامه. ونختبره على قضاياك الحقيقية قبل الإطلاق.' },
        { q: 'كم يستغرق المشروع؟', a: 'حسب حجم العمل. بعد المكالمة الأولى نعطيك جدولاً زمنياً مكتوباً، مرحلة بمرحلة، قبل أن يبدأ أي عمل.' },
        { q: 'كم التكلفة؟', a: 'نحدد سعراً ثابتاً بعد أن نفهم كيف يعمل مكتبك. وترى التكلفة كاملة قبل أن توقّع.' },
        { q: 'من يملك النظام والبيانات؟', a: 'أنت. الكود والبيانات والحسابات تُسلَّم لك عند الإطلاق.' },
      ],
    },
    closing: { title: 'كل شهر، مواعيد *تقترب أكثر من اللازم*', text: 'تسع إجابات سريعة تُظهر أين يضيع شغلك القانوني ولماذا، وأول خطوة لضبطه. 60 ثانية، مجاناً.' },
  },
} as const;

/** المراحل الست. duration تجريبي (draft). */
export const processData = {
  en: {
    eyebrow: 'Process',
    title: 'How a project runs, from first call to *orbit.*',
    lead: 'Six stages. Each one ends with something you can see and check.',
    get: 'You get',
    need: 'We need',
    typical: 'Typical length',
    stages: [
      { name: 'Discovery', text: 'A first conversation about how your office works today: cases, contracts, deadlines and where the files live.', get: 'A clear statement of the problem.', need: 'An hour with the partner or legal manager who knows the work best.', duration: '1 call' },
      { name: 'Scoping', text: 'We write down what will be built, who will see what, what it will cost and how long it will take.', get: 'A fixed proposal, a timeline and a confidentiality agreement.', need: 'Sample documents with names removed, and a list of the tools you use.', duration: '3–5 days' },
      { name: 'Design', text: 'Screens, matter structure, permissions and alerts, agreed before any code is written.', get: 'A design you can click through or read.', need: 'Feedback from the lawyers and staff who will use it.', duration: '1–2 weeks' },
      { name: 'Build', text: 'We build in short cycles and show you working software, tested on your own kinds of cases.', get: 'Regular demos of real progress.', need: 'Quick answers when legal or procedural questions come up.', duration: '2–8 weeks' },
      { name: 'Launch', text: 'We move your files in, train your team and switch the system on, with the old way kept as a fallback for the first weeks.', get: 'A working system and a trained team.', need: 'A named owner on your side.', duration: '1–2 weeks' },
      { name: 'Orbit', text: 'After launch we watch the system, fix issues and keep it in step with new laws and new ways of working.', get: 'Monitoring, fixes and regular reports.', need: 'Tell us what changes in your practice.', duration: 'Ongoing' },
    ],
    models: {
      eyebrow: 'Ways to work with us',
      title: 'Three ways to *start.*',
      items: [
        { name: 'Pilot', text: 'One team or one type of matter at a fixed price, to prove the system before a larger commitment.' },
        { name: 'Project', text: 'A defined system with a fixed scope, price and timeline.' },
        { name: 'Retainer', text: 'Ongoing development, support and legal-content updates, month by month.' },
      ],
    },
  },
  ar: {
    eyebrow: 'طريقة العمل',
    title: 'كيف يسير المشروع، من أول مكالمة إلى *المدار*',
    lead: 'ست مراحل. كل مرحلة تنتهي بشيء تراه وتتحقق منه.',
    get: 'تستلم',
    need: 'نحتاج منك',
    typical: 'المدة المعتادة',
    stages: [
      { name: 'الاستكشاف', text: 'محادثة أولى عن طريقة عمل مكتبك اليوم: القضايا والعقود والمواعيد وأين تعيش الملفات.', get: 'صياغة واضحة للمشكلة.', need: 'ساعة مع الشريك أو مدير القسم القانوني الأدرى بالعمل.', duration: 'مكالمة واحدة' },
      { name: 'تحديد النطاق', text: 'نكتب ما الذي سيُبنى، ومن يرى ماذا، وكم يكلّف، وكم يستغرق.', get: 'عرض بسعر ثابت وجدول زمني واتفاقية سرية.', need: 'نماذج من مستنداتك بعد حذف الأسماء، وقائمة بالأدوات التي تستخدمها.', duration: 'من 3 إلى 5 أيام' },
      { name: 'التصميم', text: 'الشاشات وهيكل الملفات والصلاحيات والتنبيهات، نتفق عليها قبل كتابة أي كود.', get: 'تصميم تستطيع تجربته أو قراءته.', need: 'ملاحظات من المحامين والموظفين الذين سيستخدمونه.', duration: 'من أسبوع إلى أسبوعين' },
      { name: 'البناء', text: 'نبني على دورات قصيرة ونريك نظاماً يعمل، مختبراً على أنواع قضاياك نفسها.', get: 'عروض منتظمة لتقدّم حقيقي.', need: 'إجابات سريعة عند ظهور أسئلة قانونية أو إجرائية.', duration: 'من أسبوعين إلى 8 أسابيع' },
      { name: 'الإطلاق', text: 'ننقل ملفاتك، وندرّب فريقك، ونشغّل النظام، مع إبقاء الطريقة القديمة احتياطاً في الأسابيع الأولى.', get: 'نظام يعمل وفريق مدرَّب.', need: 'مسؤول محدد من طرفك.', duration: 'من أسبوع إلى أسبوعين' },
      { name: 'المدار', text: 'بعد الإطلاق نراقب النظام ونصلح الأعطال ونبقيه متماشياً مع القوانين الجديدة وطرق العمل الجديدة.', get: 'مراقبة وإصلاحات وتقارير دورية.', need: 'أخبرنا بما يتغير في عملك.', duration: 'مستمر' },
    ],
    models: {
      eyebrow: 'طرق العمل معنا',
      title: 'ثلاث طرق *للبدء*',
      items: [
        { name: 'تجربة أولى', text: 'فريق واحد أو نوع واحد من الملفات بسعر ثابت، لإثبات النظام قبل التزام أكبر.' },
        { name: 'مشروع', text: 'نظام محدد بنطاق وسعر وجدول زمني ثابت.' },
        { name: 'اتفاق شهري', text: 'تطوير ودعم وتحديث للمحتوى القانوني، شهراً بشهر.' },
      ],
    },
  },
} as const;

export const servicesPage = {
  en: {
    eyebrow: 'Services',
    title: 'Six services around *one practice.*',
    lead: 'Pick a service on the orbit to see what it does, or read the list below.',
    listTitle: 'What each service *delivers.*',
    hint: 'Use the arrows, click a point, or swipe.',
    labels: { problems: 'Problems we solve', deliverables: 'What you get', how: 'How it works', sectors: 'Where it fits', limits: 'Honest limits', limitsLead: 'What this will not do.', faq: 'Questions', timeline: 'Typical timeline', price: 'Price', priceText: 'A fixed quote after a first call. You see the full cost before you sign.', ask: 'Ask about this service', other: 'Other services' },
  },
  ar: {
    eyebrow: 'الخدمات',
    title: 'ست خدمات حول *مكتب واحد*',
    lead: 'اختر خدمة من المدار لترى ما تفعله، أو اقرأ القائمة في الأسفل.',
    listTitle: 'ماذا تقدّم *كل خدمة*',
    hint: 'استخدم الأسهم، أو اضغط على نقطة، أو اسحب.',
    labels: { problems: 'مشكلات نحلّها', deliverables: 'ماذا تستلم', how: 'كيف يعمل', sectors: 'أين يناسب', limits: 'حدود صريحة', limitsLead: 'ما لن يفعله هذا النظام.', faq: 'أسئلة', timeline: 'المدة المعتادة', price: 'السعر', priceText: 'سعر ثابت بعد المكالمة الأولى. وترى التكلفة كاملة قبل أن توقّع.', ask: 'اسأل عن هذه الخدمة', other: 'خدمات أخرى' },
  },
} as const;

export const workPage = {
  en: {
    eyebrow: 'Work',
    title: 'Results, in *numbers.*',
    lead: 'Each case follows the same order: the problem, the system we built, and the measured result. Client names appear only with written permission.',
    emptyTitle: 'Case studies are being prepared.',
    emptyText: 'Legal work is confidential, so we publish a project only when its numbers are measured and the client has approved every line. Until then, message us and we will walk you through recent work.',
    labels: { problem: 'Problem', system: 'System', result: 'Result', client: 'Client', sector: 'Sector', year: 'Year', service: 'Service', similar: 'Have a similar problem?', back: 'All work' },
  },
  ar: {
    eyebrow: 'الأعمال',
    title: 'نتائج *بالأرقام*',
    lead: 'كل دراسة حالة تسير بالترتيب نفسه: المشكلة، ثم النظام الذي بنيناه، ثم النتيجة المقاسة. ولا يظهر اسم العميل إلا بموافقته المكتوبة.',
    emptyTitle: 'دراسات الحالة قيد الإعداد.',
    emptyText: 'العمل القانوني سري، لذلك لا ننشر مشروعاً إلا بعد قياس أرقامه وموافقة العميل على كل سطر فيه. وإلى ذلك الحين، راسلنا ونعرض عليك أعمالنا الأخيرة.',
    labels: { problem: 'المشكلة', system: 'النظام', result: 'النتيجة', client: 'العميل', sector: 'القطاع', year: 'السنة', service: 'الخدمة', similar: 'عندك مشكلة مشابهة؟', back: 'كل الأعمال' },
  },
} as const;

export const aboutPage = {
  en: {
    eyebrow: 'About',
    title: 'A legal tech company from *Baghdad.*',
    lead: 'NAWA builds the systems behind a modern legal practice: research assistants, contract and case management, document archives, client intake and compliance reporting, for law firms and in-house legal teams.',
    essence: [
      { label: 'Vision', text: 'The most trusted legal technology company in Iraq, and the most professional in the Middle East.' },
      { label: 'Mission', text: 'Study the newest legal technology and apply it to Iraqi law, Iraqi courts and the way Iraqi offices really work.' },
      { label: 'Purpose', text: 'Close the technology gap in Iraqi legal work. Lawyers here deserve the same tools as lawyers anywhere.' },
      { label: 'Promise', text: 'A technical solution that actually works: reliable, confidential and designed for your practice. No exaggeration, no empty promises, no surprises.', gold: true },
    ],
    mark: { eyebrow: 'The mark', title: 'A core, held in its *orbit.*', text: 'The mark is a hexagon drawn as one line around a solid disc. The hexagon is the structure we build: procedures, permissions, records. The disc is the core it protects: the client’s matter. Read together, it is a planet held in its orbit.' },
    voice: { eyebrow: 'How we speak', title: 'Plain words, *real numbers.*', items: ['The result, not the technology.', 'Numbers over adjectives.', 'Honest limits, stated early.', 'Short sentences. No exaggeration.'] },
    team: { eyebrow: 'Team', title: 'The people behind the *work.*', members: [
      { name: 'Team member', role: 'Founder · Strategy and product' },
      { name: 'Team member', role: 'Legal engineering' },
      { name: 'Team member', role: 'Legal adviser to the product' },
    ] },
  },
  ar: {
    eyebrow: 'من نحن',
    title: 'شركة تقنية قانونية من *بغداد*',
    lead: 'نوى تبني الأنظمة التي يقوم عليها المكتب القانوني الحديث: مساعد بحث قانوني، وإدارة العقود والقضايا، وأرشيف المستندات، واستقبال الموكلين، وتقارير الامتثال، لمكاتب المحاماة والأقسام القانونية.',
    essence: [
      { label: 'الرؤية', text: 'الشركة الأكثر ثقة في التقنية القانونية في العراق، والأكثر احترافاً في الشرق الأوسط.' },
      { label: 'المهمة', text: 'ندرس أحدث التقنيات القانونية ونطبّقها على القانون العراقي والمحاكم العراقية وطريقة عمل المكاتب العراقية فعلاً.' },
      { label: 'الغاية', text: 'سدّ الفجوة التقنية في العمل القانوني العراقي. المحامي هنا يستحق الأدوات نفسها التي يملكها المحامي في أي مكان.' },
      { label: 'الوعد', text: 'حل تقني يعمل فعلاً: موثوق وسري ومصمَّم لمكتبك. بلا مبالغة، بلا وعود فارغة، بلا مفاجآت.', gold: true },
    ],
    mark: { eyebrow: 'الشعار', title: 'نواة ثابتة في *مدارها*', text: 'الشعار سداسي مرسوم بخط واحد حول قرص مصمت. السداسي هو البنية التي نبنيها: الإجراءات والصلاحيات والسجلات. والقرص هو النواة التي تحميها: ملف الموكل. ومعاً يُقرآن ككوكب ثابت في مداره.' },
    voice: { eyebrow: 'كيف نتكلم', title: 'كلام واضح *وأرقام حقيقية*', items: ['النتيجة لا التقنية.', 'الأرقام قبل الصفات.', 'حدود صريحة تُقال مبكراً.', 'جمل قصيرة. بلا مبالغة.'] },
    team: { eyebrow: 'الفريق', title: 'من يقف خلف *العمل*', members: [
      { name: 'عضو الفريق', role: 'المؤسس · الاستراتيجية والمنتج' },
      { name: 'عضو الفريق', role: 'الهندسة القانونية' },
      { name: 'عضو الفريق', role: 'المستشار القانوني للمنتج' },
    ] },
  },
} as const;

export const contactPage = {
  en: {
    eyebrow: 'Contact',
    title: 'Start with a *conversation.*',
    lead: `Tell us what you want to improve in your practice. We reply ${site.replyTime.en}. Please do not send client documents or case details here.`,
    waTitle: 'WhatsApp',
    waText: 'The fastest way to reach us.',
    waBtn: 'Message us on WhatsApp',
    formTitle: 'Or write to us',
    fields: { name: 'Name', company: 'Firm or company', companyOpt: 'optional', phone: 'WhatsApp number', service: 'What do you need?', unsure: 'Not sure yet', message: 'What do you want to improve? (no client details)' },
    errors: { name: 'Enter your name.', phone: 'Enter a number we can reach on WhatsApp.', message: 'Tell us a little about what you need.' },
    send: 'Send',
    sending: 'Sending',
    success: `Your message is on its way. We reply ${site.replyTime.en}.`,
    fail: 'The message was not sent. Check your connection and try again, or message us on WhatsApp.',
    details: { email: 'Email', phone: 'Phone', address: 'Address', hours: 'Hours' },
    testTitle: 'Not sure what to ask for?',
    testText: 'Nine quick answers show where your legal work slips and which step to take first. 60 seconds, free.',
    testBtn: 'Discover where your legal work slips',
  },
  ar: {
    eyebrow: 'تواصل',
    title: 'لنبدأ *بمحادثة*',
    lead: `أخبرنا بما تريد تحسينه في مكتبك. نرد ${site.replyTime.ar}. رجاءً لا ترسل هنا مستندات موكلين أو تفاصيل قضايا.`,
    waTitle: 'واتساب',
    waText: 'أسرع طريقة للوصول إلينا.',
    waBtn: 'راسلنا على واتساب',
    formTitle: 'أو اكتب لنا',
    fields: { name: 'الاسم', company: 'المكتب أو الشركة', companyOpt: 'اختياري', phone: 'رقم واتساب', service: 'ماذا تحتاج؟', unsure: 'لست متأكداً بعد', message: 'ما الذي تريد تحسينه؟ (بدون تفاصيل موكلين)' },
    errors: { name: 'اكتب اسمك.', phone: 'اكتب رقماً نصل إليك به على واتساب.', message: 'اكتب لنا قليلاً عمّا تحتاجه.' },
    send: 'إرسال',
    sending: 'جارٍ الإرسال',
    success: `رسالتك في طريقها إلينا. نرد ${site.replyTime.ar}.`,
    fail: 'لم تُرسل الرسالة. تحقق من الاتصال وحاول مجدداً، أو راسلنا على واتساب.',
    details: { email: 'البريد', phone: 'الهاتف', address: 'العنوان', hours: 'ساعات العمل' },
    testTitle: 'مو متأكد شنو تحتاج؟',
    testText: 'تسع أجوبة سريعة تبيّن وين يضيع شغلك القانوني وأي خطوة تبدي بيها. 60 ثانية، مجاناً.',
    testBtn: 'اكتشف وين يضيع شغلك القانوني',
  },
} as const;

/** صفحة الخصوصية (مطلوبة لأن الموقع يجمع بيانات تشخيص "اكتشف وين يضيع شغلك القانوني") */
export const privacyPage = {
  en: {
    eyebrow: 'Privacy',
    title: 'Your data, *plainly.*',
    lead: 'What we collect on this site, why, how long we keep it, and how to have it deleted. This page is about this website. Client data inside the systems we build is governed by a separate written agreement with each office.',
    sections: [
      { h: 'What we collect', p: [
        'Diagnosis answers: the multiple-choice answers you give in "Discover where your legal work slips" (type of practice, number of open matters, how you track deadlines and similar). They describe your office, not your clients, and we store them without your name unless you choose to send your report. The diagnosis never asks for case or client details.',
        'Contact details, only if you give them: your name, firm name, city and WhatsApp number, with the time you agreed to be contacted.',
        'Basic usage: which step of the diagnosis you reached, which headline you saw, the page you came from, and whether you use a phone or a computer. We store a random identifier in your browser for this, not your name or IP address. Your IP address is turned into a one-way code that is only used to block abuse.',
        'Contact form messages you send us. Please do not include client documents or case details.',
      ] },
      { h: 'Why', p: [
        'To show you your result, send you your report and reply to you on WhatsApp if you asked us to.',
        'To understand which questions help legal teams most and improve the diagnosis and our services.',
        'We never sell your data and never share it with advertisers.',
      ] },
      { h: 'Where it is kept', p: [
        'Answers and contact details are stored in a secured database (Supabase) that only NAWA staff can read. New requests are also sent to our team on Telegram and by email so we can reply quickly.',
      ] },
      { h: 'How long', p: [
        'We keep contact details for 12 months after our last conversation, then delete them. Anonymous diagnosis answers may be kept longer as statistics.',
      ] },
      { h: 'Your choices', p: [
        'Reply STOP on WhatsApp at any time and we stop contacting you.',
        'Ask us to see, correct or delete your data and we do it within 7 days.',
        'Marketing messages are a separate, optional choice. Leaving that box empty means we only contact you about your result.',
      ] },
      { h: 'The law', p: [
        'Iraq does not yet have a comprehensive data protection law in force. We follow practices modelled on the European GDPR anyway: clear consent, minimum data, a fixed retention period and deletion on request. For the systems we build, we also respect the duty of confidentiality that lawyers owe their clients.',
      ] },
    ],
    contactH: 'Contact',
    contactP: 'Questions or deletion requests:',
    waMsg: 'Hello NAWA, I have a privacy request.',
    updated: 'Last updated',
  },
  ar: {
    eyebrow: 'الخصوصية',
    title: 'بياناتك، *بوضوح*',
    lead: 'ماذا نجمع في هذا الموقع، ولماذا، وكم نحتفظ به، وكيف تطلب حذفه. هذه الصفحة تخص الموقع فقط. أما بيانات الموكلين داخل الأنظمة التي نبنيها فتحكمها اتفاقية مكتوبة منفصلة مع كل مكتب.',
    sections: [
      { h: 'ماذا نجمع', p: [
        'أجوبة التشخيص: اختياراتك في "اكتشف وين يضيع شغلك القانوني" (نوع الممارسة، عدد الملفات المفتوحة، طريقة متابعة المواعيد وما شابه). هذه تصف مكتبك وليس موكليك، ونحفظها بدون اسمك إلا إذا اخترت أن نرسل لك تقريرك. التشخيص لا يسأل أبداً عن تفاصيل قضايا أو موكلين.',
        'بيانات التواصل، فقط إذا أعطيتها: اسمك، اسم المكتب، المدينة ورقم الواتساب، مع وقت موافقتك على التواصل.',
        'استخدام بسيط: إلى أي خطوة وصلت في التشخيص، أي عنوان رأيت، من أي صفحة جئت، وهل تستخدم موبايل أو حاسبة. نحفظ لذلك معرّفاً عشوائياً في متصفحك، وليس اسمك أو عنوان الـ IP. عنوان الـ IP يتحول إلى رمز باتجاه واحد يُستخدم فقط لمنع الإساءة.',
        'رسائل نموذج التواصل التي ترسلها لنا. رجاءً لا تضع فيها مستندات موكلين أو تفاصيل قضايا.',
      ] },
      { h: 'لماذا', p: [
        'لنعرض لك نتيجتك، ونرسل تقريرك، ونرد عليك في الواتساب إذا طلبت ذلك.',
        'لنفهم أي الأسئلة تفيد الفرق القانونية أكثر ونحسّن التشخيص وخدماتنا.',
        'لا نبيع بياناتك أبداً ولا نشاركها مع المعلنين.',
      ] },
      { h: 'أين تُحفظ', p: [
        'الأجوبة وبيانات التواصل محفوظة في قاعدة بيانات مؤمّنة (Supabase) لا يقرأها إلا فريق نوى. الطلبات الجديدة تصل لفريقنا أيضاً على تلگرام وبالبريد حتى نرد بسرعة.',
      ] },
      { h: 'كم نحتفظ بها', p: [
        'نحتفظ ببيانات التواصل 12 شهراً بعد آخر محادثة بيننا، ثم نحذفها. الأجوبة المجهولة قد تبقى أطول كإحصاءات.',
      ] },
      { h: 'خياراتك', p: [
        'اكتب "توقف" في الواتساب بأي وقت ونتوقف عن التواصل.',
        'اطلب أن ترى بياناتك أو تصححها أو تحذفها ونفعل ذلك خلال 7 أيام.',
        'رسائل العروض خيار منفصل واختياري. ترك ذلك المربع فارغاً يعني أننا نتواصل معك بخصوص نتيجتك فقط.',
      ] },
      { h: 'القانون', p: [
        'لا يوجد في العراق حتى الآن قانون شامل نافذ لحماية البيانات. نطبّق مع ذلك ممارسات مستوحاة من اللائحة الأوروبية GDPR: موافقة واضحة، أقل قدر من البيانات، مدة حفظ محددة، وحذف عند الطلب. وفي الأنظمة التي نبنيها نحترم أيضاً واجب السرية الذي يلتزم به المحامي تجاه موكله.',
      ] },
    ],
    contactH: 'للتواصل',
    contactP: 'أسئلة أو طلبات حذف:',
    waMsg: 'مرحباً نوى، عندي طلب بخصوص الخصوصية.',
    updated: 'آخر تحديث',
  },
} as const;
