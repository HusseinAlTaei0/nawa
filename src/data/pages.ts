/**
 * نصوص الصفحات باللغتين (الرئيسية، طريقة العمل، من نحن، التواصل، الأعمال، صفحة الخدمات).
 * *…* داخل العنوان = العبارة الذهبية الوحيدة.
 * العناصر المعلّمة draft تجريبية ولا تظهر في الموقع الحي.
 */
import { site } from '../config/site';

export const home = {
  en: {
    eyebrow: 'AI agency · Baghdad',
    title: 'We build intelligence that *works.*',
    sub: 'AI agents, automation and software for companies in Iraq and the Middle East.',
    // draft: أرقام نموذجية (من مثال العيادة في دليل الهوية) — استبدلها بأرقام حقيقية مقاسة
    proof: [
      { value: '3 hrs', label: 'saved at one clinic’s front desk every day' },
      { value: '3 wks', label: 'from signature to launch' },
      { value: '20 hrs', label: 'of manual work removed each week' },
    ],
    services: { eyebrow: 'Services', title: 'Six services. *One system.*', lead: 'Each one solves a different problem. Together they run a business.', skip: 'Skip the services', all: 'All services' },
    work: { eyebrow: 'Work', title: 'Results, in *numbers.*', all: 'All work' },
    process: { eyebrow: 'How we work', title: 'A clear path from first call to *launch.*', lead: 'Six stages. In each one you know what happens, what you get and what we need from you.', link: 'See the full process' },
    principles: {
      eyebrow: 'Principles',
      title: 'What you can *hold us to.*',
      items: [
        { name: 'Numbers over adjectives', text: 'We describe results in hours saved and money kept. If we cannot measure it, we do not promise it.' },
        { name: 'Honest limits', text: 'We tell you what a system will not do, and how long the work will really take.' },
        { name: 'You own what we build', text: 'The code, the data and the accounts are yours. You get a full handover.' },
        { name: 'Arabic first', text: 'Systems that speak to your customers in their language, Iraqi dialect included.' },
      ],
    },
    place: { eyebrow: 'Baghdad', title: 'Built in Baghdad. *Made to travel.*', text: 'We work from Baghdad and take projects from across Iraq and the region. A system that runs here runs wherever your customers are.', cities: 'Baghdad · Erbil · Basra · Amman · Riyadh · Dubai · Cairo · Istanbul' },
    faq: {
      eyebrow: 'Questions',
      title: 'Questions we hear *first.*',
      items: [
        { q: 'Do we need AI at all?', a: 'Sometimes not. If a simple automation or a better website solves the problem, we say so and build that.' },
        { q: 'How long does a project take?', a: 'It depends on the scope. After a first call we give you a written timeline, stage by stage, before any work starts.' },
        { q: 'How much does it cost?', a: 'We quote a fixed price once we understand the problem. You see the full cost before you sign.' },
        { q: 'Who owns the system?', a: 'You do. Code, data and accounts are handed over to you at launch.' },
        { q: 'Does it work in Arabic?', a: 'Yes. We build for Arabic first, with Iraqi dialect for customer conversations, and English alongside.' },
        { q: 'What happens after launch?', a: 'We stay on to monitor, fix and improve the system under a support agreement, for as long as you want.' },
      ],
    },
    closing: { title: 'Tell us what slows your team *down.*', text: 'One conversation is enough to know whether we can help.' },
  },
  ar: {
    eyebrow: 'وكالة ذكاء اصطناعي · بغداد',
    title: 'نبني ذكاء *يشتغل*',
    sub: 'وكلاء ذكاء اصطناعي وأتمتة وأنظمة برمجية للشركات في العراق والشرق الأوسط.',
    proof: [
      { value: '3 ساعات', label: 'توفَّر يومياً في استقبال عيادة واحدة' },
      { value: '3 أسابيع', label: 'من التوقيع إلى الإطلاق' },
      { value: '20 ساعة', label: 'من العمل اليدوي تُزال كل أسبوع' },
    ],
    services: { eyebrow: 'الخدمات', title: 'ست خدمات. *نظام واحد.*', lead: 'كل خدمة تحل مشكلة مختلفة. ومجتمعةً تدير شركة كاملة.', skip: 'تخطَّ الخدمات', all: 'كل الخدمات' },
    work: { eyebrow: 'الأعمال', title: 'نتائج *بالأرقام*', all: 'كل الأعمال' },
    process: { eyebrow: 'طريقة العمل', title: 'طريق واضح من أول مكالمة إلى *الإطلاق*', lead: 'ست مراحل. في كل مرحلة تعرف ماذا يحدث، وماذا تستلم، وماذا نحتاج منك.', link: 'شاهد طريقة العمل كاملة' },
    principles: {
      eyebrow: 'مبادئنا',
      title: 'ما تستطيع أن *تحاسبنا عليه*',
      items: [
        { name: 'الأرقام قبل الصفات', text: 'نصف النتائج بالساعات التي وفّرناها والمال الذي حفظناه. وما لا نستطيع قياسه لا نعد به.' },
        { name: 'حدود صريحة', text: 'نخبرك بما لن يفعله النظام، وكم سيأخذ العمل من الوقت فعلاً.' },
        { name: 'ما نبنيه ملكك', text: 'الكود والبيانات والحسابات لك. وتستلمها كاملة عند التسليم.' },
        { name: 'العربية أولاً', text: 'أنظمة تخاطب عملاءك بلغتهم، وباللهجة العراقية أيضاً.' },
      ],
    },
    place: { eyebrow: 'بغداد', title: 'بُني في بغداد. *ويعمل في كل مكان.*', text: 'نعمل من بغداد ونستقبل مشاريع من العراق والمنطقة. النظام الذي يعمل هنا يعمل أينما كان عملاؤك.', cities: 'بغداد · أربيل · البصرة · عمّان · الرياض · دبي · القاهرة · إسطنبول' },
    faq: {
      eyebrow: 'أسئلة',
      title: 'أسئلة نسمعها *أولاً*',
      items: [
        { q: 'هل نحتاج الذكاء الاصطناعي أصلاً؟', a: 'أحياناً لا. إذا كانت أتمتة بسيطة أو موقع أفضل يحل المشكلة، نقول لك ذلك ونبنيه.' },
        { q: 'كم يستغرق المشروع؟', a: 'حسب حجم العمل. بعد المكالمة الأولى نعطيك جدولاً زمنياً مكتوباً، مرحلة بمرحلة، قبل أن يبدأ أي عمل.' },
        { q: 'كم التكلفة؟', a: 'نحدد سعراً ثابتاً بعد أن نفهم المشكلة. وترى التكلفة كاملة قبل أن توقّع.' },
        { q: 'من يملك النظام؟', a: 'أنت. الكود والبيانات والحسابات تُسلَّم لك عند الإطلاق.' },
        { q: 'هل يعمل بالعربية؟', a: 'نعم. نبني للعربية أولاً، وباللهجة العراقية في محادثات العملاء، والإنجليزية إلى جانبها.' },
        { q: 'ماذا بعد الإطلاق؟', a: 'نبقى معك للمراقبة والإصلاح والتطوير ضمن اتفاق دعم، للمدة التي تريدها.' },
      ],
    },
    closing: { title: 'أخبرنا ما الذي *يؤخّر فريقك*', text: 'محادثة واحدة تكفي لنعرف إن كنا نستطيع المساعدة.' },
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
      { name: 'Discovery', text: 'A first conversation about the problem, the people involved and what success looks like.', get: 'A clear statement of the problem.', need: 'An hour with the person who knows the work best.', duration: '1 call' },
      { name: 'Scoping', text: 'We write down what will be built, what it will cost and how long it will take.', get: 'A fixed proposal with a timeline.', need: 'Access to the tools and data the system will touch.', duration: '3–5 days' },
      { name: 'Design', text: 'Screens, conversation flows and data structure, agreed before any code is written.', get: 'A design you can click through or read.', need: 'Feedback from the people who will use it.', duration: '1–2 weeks' },
      { name: 'Build', text: 'We build in short cycles and show you working software as we go.', get: 'Regular demos of real progress.', need: 'Quick answers when questions come up.', duration: '2–8 weeks' },
      { name: 'Launch', text: 'We test with real cases, train your team and switch the system on.', get: 'A working system and a trained team.', need: 'A named owner on your side.', duration: '1 week' },
      { name: 'Orbit', text: 'After launch we watch the system, fix issues and keep improving it.', get: 'Monitoring, fixes and regular reports.', need: 'Tell us what changes in your business.', duration: 'Ongoing' },
    ],
    models: {
      eyebrow: 'Ways to work with us',
      title: 'Three ways to *start.*',
      items: [
        { name: 'Pilot', text: 'A small first project at a fixed price, to prove the idea before a larger commitment.' },
        { name: 'Project', text: 'A defined system with a fixed scope, price and timeline.' },
        { name: 'Retainer', text: 'Ongoing development and support, month by month.' },
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
      { name: 'الاستكشاف', text: 'محادثة أولى عن المشكلة، ومن يتعامل معها، وكيف يبدو النجاح.', get: 'صياغة واضحة للمشكلة.', need: 'ساعة مع الشخص الأدرى بالعمل.', duration: 'مكالمة واحدة' },
      { name: 'تحديد النطاق', text: 'نكتب ما الذي سيُبنى، وكم يكلّف، وكم يستغرق.', get: 'عرض بسعر ثابت وجدول زمني.', need: 'صلاحية الوصول إلى الأدوات والبيانات التي سيتعامل معها النظام.', duration: 'من 3 إلى 5 أيام' },
      { name: 'التصميم', text: 'الشاشات ومسارات المحادثة وهيكل البيانات، نتفق عليها قبل كتابة أي كود.', get: 'تصميم تستطيع تجربته أو قراءته.', need: 'ملاحظات ممن سيستخدمون النظام.', duration: 'من أسبوع إلى أسبوعين' },
      { name: 'البناء', text: 'نبني على دورات قصيرة ونريك نظاماً يعمل في كل دورة.', get: 'عروض منتظمة لتقدّم حقيقي.', need: 'إجابات سريعة عند ظهور الأسئلة.', duration: 'من أسبوعين إلى 8 أسابيع' },
      { name: 'الإطلاق', text: 'نختبر على حالات حقيقية، وندرّب فريقك، ثم نشغّل النظام.', get: 'نظام يعمل وفريق مدرَّب.', need: 'مسؤول محدد من طرفك.', duration: 'أسبوع واحد' },
      { name: 'المدار', text: 'بعد الإطلاق نراقب النظام ونصلح الأعطال ونواصل تطويره.', get: 'مراقبة وإصلاحات وتقارير دورية.', need: 'أخبرنا بما يتغير في عملك.', duration: 'مستمر' },
    ],
    models: {
      eyebrow: 'طرق العمل معنا',
      title: 'ثلاث طرق *للبدء*',
      items: [
        { name: 'تجربة أولى', text: 'مشروع صغير بسعر ثابت، لإثبات الفكرة قبل التزام أكبر.' },
        { name: 'مشروع', text: 'نظام محدد بنطاق وسعر وجدول زمني ثابت.' },
        { name: 'اتفاق شهري', text: 'تطوير ودعم مستمران، شهراً بشهر.' },
      ],
    },
  },
} as const;

export const servicesPage = {
  en: {
    eyebrow: 'Services',
    title: 'Six services around *one core.*',
    lead: 'Pick a service on the orbit to see what it does, or read the list below.',
    listTitle: 'What each service *delivers.*',
    hint: 'Use the arrows, click a point, or swipe.',
    labels: { problems: 'Problems we solve', deliverables: 'What you get', how: 'How it works', sectors: 'Where it fits', limits: 'Honest limits', limitsLead: 'What this will not do.', faq: 'Questions', timeline: 'Typical timeline', price: 'Price', priceText: 'A fixed quote after a first call. You see the full cost before you sign.', ask: 'Ask about this service', other: 'Other services' },
  },
  ar: {
    eyebrow: 'الخدمات',
    title: 'ست خدمات حول *نواة واحدة*',
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
    lead: 'Each case follows the same order: the problem, the system we built, and the measured result.',
    emptyTitle: 'Case studies are being prepared.',
    emptyText: 'We publish a project only when its numbers are measured and the client has approved it. Until then, message us and we will walk you through recent work.',
    labels: { problem: 'Problem', system: 'System', result: 'Result', client: 'Client', sector: 'Sector', year: 'Year', service: 'Service', similar: 'Have a similar problem?', back: 'All work' },
  },
  ar: {
    eyebrow: 'الأعمال',
    title: 'نتائج *بالأرقام*',
    lead: 'كل دراسة حالة تسير بالترتيب نفسه: المشكلة، ثم النظام الذي بنيناه، ثم النتيجة المقاسة.',
    emptyTitle: 'دراسات الحالة قيد الإعداد.',
    emptyText: 'لا ننشر مشروعاً إلا بعد قياس أرقامه وموافقة العميل. وإلى ذلك الحين، راسلنا ونعرض عليك أعمالنا الأخيرة.',
    labels: { problem: 'المشكلة', system: 'النظام', result: 'النتيجة', client: 'العميل', sector: 'القطاع', year: 'السنة', service: 'الخدمة', similar: 'عندك مشكلة مشابهة؟', back: 'كل الأعمال' },
  },
} as const;

export const aboutPage = {
  en: {
    eyebrow: 'About',
    title: 'An AI agency from *Baghdad.*',
    lead: 'NAWA builds systems that work: AI agents, automation, websites, ERP and SaaS products, and brands for companies and founders.',
    essence: [
      { label: 'Vision', text: 'The largest and most trusted AI agency in Iraq, and the most professional in the Middle East.' },
      { label: 'Mission', text: 'Study the newest AI tools and apply them to the problems of the Iraqi and Arab market.' },
      { label: 'Purpose', text: 'Close the technology gap in Iraq. Iraq deserves to keep pace with the world in AI.' },
      { label: 'Promise', text: 'A technical solution that actually works: reliable, professional and designed for you. No exaggeration, no empty promises, no surprises.', gold: true },
    ],
    mark: { eyebrow: 'The mark', title: 'A core, held in its *orbit.*', text: 'The mark is a hexagon drawn as one line around a solid disc. The hexagon is the structure we build. The disc is the core: the one thing a system exists to do. Read together, it is a planet held in its orbit.' },
    voice: { eyebrow: 'How we speak', title: 'Plain words, *real numbers.*', items: ['The result, not the technology.', 'Numbers over adjectives.', 'Honest limits, stated early.', 'Short sentences. No exaggeration.'] },
    team: { eyebrow: 'Team', title: 'The people behind the *work.*', members: [
      { name: 'Team member', role: 'Founder · Strategy and product' },
      { name: 'Team member', role: 'AI engineering' },
      { name: 'Team member', role: 'Design' },
    ] },
  },
  ar: {
    eyebrow: 'من نحن',
    title: 'وكالة ذكاء اصطناعي من *بغداد*',
    lead: 'نوى تبني أنظمة تعمل: وكلاء ذكاء اصطناعي، وأتمتة، ومواقع، وأنظمة ERP ومنتجات SaaS، وهويات للشركات والمؤسسين.',
    essence: [
      { label: 'الرؤية', text: 'أكبر وكالة ذكاء اصطناعي في العراق وأكثرها ثقة، والأكثر احترافاً في الشرق الأوسط.' },
      { label: 'المهمة', text: 'ندرس أحدث أدوات الذكاء الاصطناعي ونطبّقها على مشكلات السوق العراقي والعربي.' },
      { label: 'الغاية', text: 'سدّ الفجوة التقنية في العراق. العراق يستحق أن يواكب العالم في الذكاء الاصطناعي.' },
      { label: 'الوعد', text: 'حل تقني يعمل فعلاً: موثوق ومحترف ومصمَّم لك. بلا مبالغة، بلا وعود فارغة، بلا مفاجآت.', gold: true },
    ],
    mark: { eyebrow: 'الشعار', title: 'نواة ثابتة في *مدارها*', text: 'الشعار سداسي مرسوم بخط واحد حول قرص مصمت. السداسي هو البنية التي نبنيها. والقرص هو النواة: الشيء الوحيد الذي وُجد النظام من أجله. ومعاً يُقرآن ككوكب ثابت في مداره.' },
    voice: { eyebrow: 'كيف نتكلم', title: 'كلام واضح *وأرقام حقيقية*', items: ['النتيجة لا التقنية.', 'الأرقام قبل الصفات.', 'حدود صريحة تُقال مبكراً.', 'جمل قصيرة. بلا مبالغة.'] },
    team: { eyebrow: 'الفريق', title: 'من يقف خلف *العمل*', members: [
      { name: 'عضو الفريق', role: 'المؤسس · الاستراتيجية والمنتج' },
      { name: 'عضو الفريق', role: 'هندسة الذكاء الاصطناعي' },
      { name: 'عضو الفريق', role: 'التصميم' },
    ] },
  },
} as const;

export const contactPage = {
  en: {
    eyebrow: 'Contact',
    title: 'Start with a *conversation.*',
    lead: `Tell us what you want to improve. We reply ${site.replyTime.en}.`,
    waTitle: 'WhatsApp',
    waText: 'The fastest way to reach us.',
    waBtn: 'Message us on WhatsApp',
    formTitle: 'Or write to us',
    fields: { name: 'Name', company: 'Company', companyOpt: 'optional', phone: 'WhatsApp number', service: 'What do you need?', unsure: 'Not sure yet', message: 'What do you want to improve?' },
    errors: { name: 'Enter your name.', phone: 'Enter a number we can reach on WhatsApp.', message: 'Tell us a little about what you need.' },
    send: 'Send',
    sending: 'Sending',
    success: `Your message is on its way. We reply ${site.replyTime.en}.`,
    fail: 'The message was not sent. Check your connection and try again, or message us on WhatsApp.',
    details: { email: 'Email', phone: 'Phone', address: 'Address', hours: 'Hours' },
    testTitle: 'Not sure what to ask for?',
    testText: 'Nine quick answers show where customers slip away and which step to take first. 60 seconds, free.',
    testBtn: 'Discover why you are losing customers',
  },
  ar: {
    eyebrow: 'تواصل',
    title: 'لنبدأ *بمحادثة*',
    lead: `أخبرنا بما تريد تحسينه. نرد ${site.replyTime.ar}.`,
    waTitle: 'واتساب',
    waText: 'أسرع طريقة للوصول إلينا.',
    waBtn: 'راسلنا على واتساب',
    formTitle: 'أو اكتب لنا',
    fields: { name: 'الاسم', company: 'الشركة', companyOpt: 'اختياري', phone: 'رقم واتساب', service: 'ماذا تحتاج؟', unsure: 'لست متأكداً بعد', message: 'ما الذي تريد تحسينه؟' },
    errors: { name: 'اكتب اسمك.', phone: 'اكتب رقماً نصل إليك به على واتساب.', message: 'اكتب لنا قليلاً عمّا تحتاجه.' },
    send: 'إرسال',
    sending: 'جارٍ الإرسال',
    success: `رسالتك في طريقها إلينا. نرد ${site.replyTime.ar}.`,
    fail: 'لم تُرسل الرسالة. تحقق من الاتصال وحاول مجدداً، أو راسلنا على واتساب.',
    details: { email: 'البريد', phone: 'الهاتف', address: 'العنوان', hours: 'ساعات العمل' },
    testTitle: 'مو متأكد شنو تحتاج؟',
    testText: 'تسع أجوبة سريعة تبيّن وين يفلتون الزبائن وأي خطوة تبدي بيها. 60 ثانية، مجاناً.',
    testBtn: 'اكتشف ليش تخسر زبائنك',
  },
} as const;

/** صفحة الخصوصية (مطلوبة لأن الموقع يجمع بيانات اختبار "اكتشف ليش تخسر زبائنك") */
export const privacyPage = {
  en: {
    eyebrow: 'Privacy',
    title: 'Your data, *plainly.*',
    lead: 'What we collect on this site, why, how long we keep it, and how to have it deleted.',
    sections: [
      { h: 'What we collect', p: [
        'Diagnosis answers: the multiple-choice answers you give in "Discover why you are losing customers" (your type of business, message volume, reply time and similar). They describe your business, not you, and we store them without your name unless you choose to send your report.',
        'Contact details, only if you give them: your name, business name, city and WhatsApp number, with the time you agreed to be contacted.',
        'Basic usage: which step of the diagnosis you reached, which headline you saw, the page you came from, and whether you use a phone or a computer. We store a random identifier in your browser for this, not your name or IP address. Your IP address is turned into a one-way code that is only used to block abuse.',
        'Contact form messages you send us.',
      ] },
      { h: 'Why', p: [
        'To show you your result, send you your report and reply to you on WhatsApp if you asked us to.',
        'To understand which questions help businesses most and improve the diagnosis and our services.',
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
        'Iraq does not yet have a comprehensive data protection law in force. We follow practices modelled on the European GDPR anyway: clear consent, minimum data, a fixed retention period and deletion on request.',
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
    lead: 'ماذا نجمع في هذا الموقع، ولماذا، وكم نحتفظ به، وكيف تطلب حذفه.',
    sections: [
      { h: 'ماذا نجمع', p: [
        'أجوبة التشخيص: اختياراتك في "اكتشف ليش تخسر زبائنك" (نوع الشغل، عدد الرسائل، سرعة الرد وما شابه). هذه تصف شغلك وليس شخصك، ونحفظها بدون اسمك إلا إذا اخترت أن نرسل لك تقريرك.',
        'بيانات التواصل، فقط إذا أعطيتها: اسمك، اسم الشغل، المدينة ورقم الواتساب، مع وقت موافقتك على التواصل.',
        'استخدام بسيط: إلى أي خطوة وصلت في التشخيص، أي عنوان رأيت، من أي صفحة جئت، وهل تستخدم موبايل أو حاسبة. نحفظ لذلك معرّفاً عشوائياً في متصفحك، وليس اسمك أو عنوان الـ IP. عنوان الـ IP يتحول إلى رمز باتجاه واحد يُستخدم فقط لمنع الإساءة.',
        'رسائل نموذج التواصل التي ترسلها لنا.',
      ] },
      { h: 'لماذا', p: [
        'لنعرض لك نتيجتك، ونرسل تقريرك، ونرد عليك في الواتساب إذا طلبت ذلك.',
        'لنفهم أي الأسئلة تفيد الشركات أكثر ونحسّن التشخيص وخدماتنا.',
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
        'لا يوجد في العراق حتى الآن قانون شامل نافذ لحماية البيانات. نطبّق مع ذلك ممارسات مستوحاة من اللائحة الأوروبية GDPR: موافقة واضحة، أقل قدر من البيانات، مدة حفظ محددة، وحذف عند الطلب.',
      ] },
    ],
    contactH: 'للتواصل',
    contactP: 'أسئلة أو طلبات حذف:',
    waMsg: 'مرحباً نوى، عندي طلب بخصوص الخصوصية.',
    updated: 'آخر تحديث',
  },
} as const;
