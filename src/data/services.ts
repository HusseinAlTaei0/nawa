/**
 * بيانات الخدمات الست (اللغتان جنباً إلى جنب حتى يبقى النصان متطابقين).
 * كل خدمة = كوكب في الصفحة الرئيسية + صفحة تفاصيل /services/<slug>/
 *
 * timeline: مدة تقديرية تجريبية (draft) — لا تظهر في الموقع الحي حتى تؤكدها.
 */
import type { Lang } from '../config/site';

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
    slug: 'ai-agents',
    planet: 'jupiter',
    en: {
      name: 'AI Agents',
      short: 'Agents',
      outcome: 'Agents that answer your customers on WhatsApp and the web, in Iraqi Arabic, at any hour.',
      title: 'An agent that answers your customers, so your team *doesn’t have to.*',
      intro: 'Most customer messages ask the same few questions. An AI agent answers them at once, books the appointment or takes the order, and hands the conversation to a person when it should.',
      problems: ['The same questions answered by hand, all day.', 'Messages that arrive at night and wait until morning.', 'Leads that go cold because nobody replied in time.'],
      deliverables: ['An agent trained on your services, prices and policies.', 'WhatsApp and website chat connected to one inbox.', 'Handover to your staff, with the full conversation.', 'A dashboard of what customers ask and how it was answered.'],
      flow: ['Customer message', 'The agent', 'Your bookings, orders or CRM'],
      sectors: [
        { name: 'Clinics', text: 'Booking, reminders and common questions.' },
        { name: 'Retail', text: 'Product questions, order status and returns.' },
        { name: 'Services', text: 'Qualifying enquiries before a person calls back.' },
      ],
      limits: ['It will not replace your staff. It takes the repeated work off them.', 'It answers from what you give it. Wrong or missing information in means wrong answers out.', 'Sensitive decisions, such as medical advice or refunds, stay with a person.'],
      faq: [
        { q: 'Does it understand Iraqi dialect?', a: 'Yes. We test it on real messages from your customers before launch and correct it where it misreads.' },
        { q: 'What if it does not know the answer?', a: 'It says so and passes the conversation to your team. It does not guess.' },
        { q: 'Which channels does it work on?', a: 'WhatsApp and your website to start. Other channels can be added.' },
      ],
      timeline: '2–4 weeks',
      wa: 'Hello NAWA, I would like to ask about AI agents.',
    },
    ar: {
      name: 'وكلاء الذكاء الاصطناعي',
      short: 'الوكلاء',
      outcome: 'وكلاء يجيبون عملاءك على واتساب والموقع، باللهجة العراقية، في أي ساعة.',
      title: 'وكيل يجيب عملاءك، حتى *لا ينشغل فريقك*',
      intro: 'معظم رسائل العملاء تسأل الأسئلة نفسها. الوكيل الذكي يجيب عنها فوراً، ويحجز الموعد أو يسجّل الطلب، ويحوّل المحادثة إلى موظف عندما يلزم.',
      problems: ['الأسئلة نفسها تُجاب يدوياً طوال اليوم.', 'رسائل تصل ليلاً وتنتظر حتى الصباح.', 'عملاء محتملون يضيعون لأن أحداً لم يرد في الوقت المناسب.'],
      deliverables: ['وكيل مدرَّب على خدماتك وأسعارك وسياساتك.', 'واتساب ومحادثة الموقع في صندوق وارد واحد.', 'تحويل إلى موظفيك مع المحادثة كاملة.', 'لوحة تبيّن ماذا يسأل العملاء وكيف أُجيبوا.'],
      flow: ['رسالة العميل', 'الوكيل', 'الحجوزات أو الطلبات أو نظام العملاء'],
      sectors: [
        { name: 'العيادات', text: 'الحجز والتذكير والأسئلة الشائعة.' },
        { name: 'المتاجر', text: 'أسئلة المنتجات وحالة الطلب والإرجاع.' },
        { name: 'الخدمات', text: 'فرز الاستفسارات قبل أن يتصل الموظف.' },
      ],
      limits: ['لن يحل محل موظفيك. يرفع عنهم العمل المتكرر.', 'يجيب مما تعطيه. المعلومة الخاطئة أو الناقصة تعني جواباً خاطئاً.', 'القرارات الحساسة، كالنصيحة الطبية أو استرجاع المبالغ، تبقى عند الموظف.'],
      faq: [
        { q: 'هل يفهم اللهجة العراقية؟', a: 'نعم. نختبره على رسائل حقيقية من عملائك قبل الإطلاق ونصحّح ما يخطئ في فهمه.' },
        { q: 'ماذا لو لم يعرف الجواب؟', a: 'يقول ذلك ويحوّل المحادثة إلى فريقك. لا يخمّن.' },
        { q: 'على أي قنوات يعمل؟', a: 'واتساب وموقعك في البداية. ويمكن إضافة قنوات أخرى.' },
      ],
      timeline: 'من أسبوعين إلى 4 أسابيع',
      wa: 'مرحباً نوى، أريد الاستفسار عن وكلاء الذكاء الاصطناعي.',
    },
  },
  {
    slug: 'automation',
    planet: 'violet',
    en: {
      name: 'Automation',
      short: 'Automation',
      outcome: 'WhatsApp, email and reports that run on their own, so your team stops repeating the same work.',
      title: 'The work your team repeats every day, *done on its own.*',
      intro: 'Confirmations, reminders, reports and data entry follow rules. We turn those rules into workflows that run without anyone starting them.',
      problems: ['Hours spent copying data between sheets and systems.', 'Reminders and follow-ups that depend on someone remembering.', 'Reports that take a day to assemble and arrive late.'],
      deliverables: ['Workflows connecting the tools you already use.', 'Automatic messages on WhatsApp and email.', 'Reports delivered to your phone on schedule.', 'Alerts when something needs a person.'],
      flow: ['A trigger: an order, a form, a time', 'The workflow', 'Messages, records and reports'],
      sectors: [
        { name: 'Clinics', text: 'Appointment confirmations and follow-up after a visit.' },
        { name: 'Retail', text: 'Order updates, stock alerts and a daily sales report.' },
        { name: 'Offices', text: 'Invoice reminders and new-lead alerts for the team.' },
      ],
      limits: ['It automates rules, not judgement. Exceptions still go to a person.', 'It depends on the tools it connects. If one changes, the workflow needs updating.', 'We do not build bulk unsolicited messaging. It breaks WhatsApp’s rules and your customers’ trust.'],
      faq: [
        { q: 'Do we have to change the tools we use?', a: 'Usually not. We connect what you already have and only suggest a change when a tool cannot be connected.' },
        { q: 'What happens when a workflow fails?', a: 'You get an alert and so do we. Nothing fails silently.' },
      ],
      timeline: '1–3 weeks',
      wa: 'Hello NAWA, I would like to ask about automation.',
    },
    ar: {
      name: 'الأتمتة',
      short: 'الأتمتة',
      outcome: 'واتساب وبريد وتقارير تعمل وحدها، فلا يكرر فريقك العمل نفسه كل يوم.',
      title: 'العمل الذي يكرره فريقك كل يوم، *يُنجَز وحده*',
      intro: 'التأكيدات والتذكيرات والتقارير وإدخال البيانات تسير وفق قواعد. نحوّل هذه القواعد إلى مسارات عمل تشتغل دون أن يبدأها أحد.',
      problems: ['ساعات تُصرف في نقل البيانات بين الجداول والأنظمة.', 'تذكيرات ومتابعات تعتمد على أن يتذكر أحدهم.', 'تقارير يأخذ تجميعها يوماً كاملاً وتصل متأخرة.'],
      deliverables: ['مسارات عمل تربط الأدوات التي تستخدمها أصلاً.', 'رسائل تلقائية على واتساب والبريد.', 'تقارير تصل إلى هاتفك في موعدها.', 'تنبيهات عندما يحتاج الأمر إلى موظف.'],
      flow: ['حدث: طلب أو نموذج أو موعد', 'مسار العمل', 'رسائل وسجلات وتقارير'],
      sectors: [
        { name: 'العيادات', text: 'تأكيد المواعيد والمتابعة بعد الزيارة.' },
        { name: 'المتاجر', text: 'تحديثات الطلبات وتنبيهات المخزون وتقرير المبيعات اليومي.' },
        { name: 'المكاتب', text: 'تذكير بالفواتير وتنبيه الفريق بالعملاء الجدد.' },
      ],
      limits: ['تؤتمت القواعد لا التقدير. الحالات الاستثنائية تبقى عند الموظف.', 'تعتمد على الأدوات التي تربطها. إذا تغيّرت إحداها يحتاج المسار إلى تحديث.', 'لا نبني إرسالاً جماعياً غير مرغوب فيه. يخالف قواعد واتساب ويضر بثقة عملائك.'],
      faq: [
        { q: 'هل علينا تغيير الأدوات التي نستخدمها؟', a: 'في الغالب لا. نربط ما عندك، ونقترح التغيير فقط إذا تعذّر ربط أداة.' },
        { q: 'ماذا يحدث إذا تعطّل مسار؟', a: 'يصلك تنبيه ويصلنا أيضاً. لا شيء يتعطل بصمت.' },
      ],
      timeline: 'من أسبوع إلى 3 أسابيع',
      wa: 'مرحباً نوى، أريد الاستفسار عن الأتمتة.',
    },
  },
  {
    slug: 'websites-web-apps',
    planet: 'earth',
    en: {
      name: 'Websites & Web Apps',
      short: 'Web',
      outcome: 'Fast websites and web apps, from a single landing page to a full platform.',
      title: 'A website that loads fast and *brings you customers.*',
      intro: 'Your site is where a customer decides whether to contact you. We build sites and web apps that load quickly on Iraqi networks, read well in Arabic and English, and lead to a clear next step.',
      problems: ['A site that is slow on mobile data.', 'Visitors who leave without contacting you.', 'A site nobody on your team can update.'],
      deliverables: ['Design and build in Arabic and English.', 'Pages that search engines and link previews can read.', 'Contact and booking that reach you on WhatsApp.', 'A way for your team to edit content.'],
      flow: ['A visitor', 'Your site', 'A message, a booking or an order'],
      sectors: [
        { name: 'Companies', text: 'A company site that explains what you do and proves it.' },
        { name: 'Stores', text: 'A catalogue or shop with ordering.' },
        { name: 'Platforms', text: 'Customer portals, dashboards and internal tools.' },
      ],
      limits: ['A site does not bring visitors by itself. It needs content, search work or advertising.', 'We do not use ready-made templates that every other company has.', 'Good content takes your input. We write it with you, not without you.'],
      faq: [
        { q: 'Can you redesign our existing site?', a: 'Yes. We keep what works, move your content and addresses, and replace the rest.' },
        { q: 'Will it work on slow connections?', a: 'That is a requirement, not an extra. We test on mid-range phones and mobile data.' },
      ],
      timeline: '2–6 weeks',
      wa: 'Hello NAWA, I would like to ask about a website or web app.',
    },
    ar: {
      name: 'المواقع وتطبيقات الويب',
      short: 'الويب',
      outcome: 'مواقع وتطبيقات سريعة، من صفحة هبوط واحدة إلى منصة كاملة.',
      title: 'موقع سريع التحميل، *ويجلب لك العملاء*',
      intro: 'موقعك هو المكان الذي يقرر فيه العميل أن يتواصل معك أو لا. نبني مواقع وتطبيقات ويب تُحمَّل بسرعة على الشبكات العراقية، وتُقرأ جيداً بالعربية والإنجليزية، وتقود إلى خطوة واضحة.',
      problems: ['موقع بطيء على بيانات الهاتف.', 'زوار يغادرون دون أن يتواصلوا معك.', 'موقع لا يستطيع أحد في فريقك تحديثه.'],
      deliverables: ['تصميم وبناء بالعربية والإنجليزية.', 'صفحات تقرؤها محركات البحث ومعاينات الروابط.', 'تواصل وحجز يصلانك على واتساب.', 'طريقة سهلة ليعدّل فريقك المحتوى.'],
      flow: ['الزائر', 'موقعك', 'رسالة أو حجز أو طلب'],
      sectors: [
        { name: 'الشركات', text: 'موقع يشرح ما تفعله ويثبته.' },
        { name: 'المتاجر', text: 'كتالوج أو متجر مع الطلب.' },
        { name: 'المنصات', text: 'بوابات عملاء ولوحات تحكم وأدوات داخلية.' },
      ],
      limits: ['الموقع لا يجلب الزوار وحده. يحتاج إلى محتوى أو تحسين بحث أو إعلان.', 'لا نستخدم قوالب جاهزة موجودة عند كل شركة أخرى.', 'المحتوى الجيد يحتاج مشاركتك. نكتبه معك لا بدونك.'],
      faq: [
        { q: 'هل تعيدون تصميم موقعنا الحالي؟', a: 'نعم. نُبقي ما ينفع، وننقل محتواك وروابطك، ونستبدل الباقي.' },
        { q: 'هل يعمل على الاتصال البطيء؟', a: 'هذا شرط أساسي وليس إضافة. نختبر على هواتف متوسطة وبيانات الهاتف.' },
      ],
      timeline: 'من أسبوعين إلى 6 أسابيع',
      wa: 'مرحباً نوى، أريد الاستفسار عن موقع أو تطبيق ويب.',
    },
  },
  {
    slug: 'erp-systems',
    planet: 'saturn',
    en: {
      name: 'ERP Systems',
      short: 'ERP',
      outcome: 'Accounting, inventory and HR in one system, shaped around how your business runs.',
      title: 'One system for the whole business, *built around how you work.*',
      intro: 'When accounts, stock and staff live in separate sheets, nobody sees the full picture. We build one system where every department works from the same numbers.',
      problems: ['Numbers that differ from one sheet to the next.', 'Stock you only discover is missing when a customer asks.', 'Month-end closing that takes days.'],
      deliverables: ['Modules for accounting, inventory, sales and HR.', 'Roles and permissions for each employee.', 'Live reports for the people who decide.', 'Migration of your existing data.'],
      flow: ['Sales, purchases and staff', 'One system', 'Live reports for the owner'],
      sectors: [
        { name: 'Trading', text: 'Stock across branches, purchases and supplier accounts.' },
        { name: 'Clinics', text: 'Patients, appointments, billing and pharmacy stock.' },
        { name: 'Workshops and factories', text: 'Jobs, materials and the cost of each order.' },
      ],
      limits: ['It is not installed in a week. A real ERP needs your processes mapped first.', 'It only works if the team uses it. We train them, and you need to require it.', 'We start with the modules you need. Not everything at once.'],
      faq: [
        { q: 'Can it work in dinars and dollars?', a: 'Yes. Multiple currencies and exchange rates are part of the accounting design.' },
        { q: 'Can we start with one module?', a: 'Yes. Most clients start with the department that hurts most and add others later.' },
      ],
      timeline: '2–4 months',
      wa: 'Hello NAWA, I would like to ask about an ERP system.',
    },
    ar: {
      name: 'أنظمة ERP',
      short: 'ERP',
      outcome: 'المحاسبة والمخزون والموارد البشرية في نظام واحد، مبني على طريقة عملك.',
      title: 'نظام واحد للشركة كلها، *مبني على طريقة عملك*',
      intro: 'عندما تعيش الحسابات والمخزون والموظفون في جداول متفرقة، لا يرى أحد الصورة كاملة. نبني نظاماً واحداً يعمل فيه كل قسم على الأرقام نفسها.',
      problems: ['أرقام تختلف من جدول إلى آخر.', 'بضاعة لا تكتشف نقصها إلا حين يسأل العميل.', 'إقفال شهري يستغرق أياماً.'],
      deliverables: ['وحدات للمحاسبة والمخزون والمبيعات والموارد البشرية.', 'أدوار وصلاحيات لكل موظف.', 'تقارير حيّة لأصحاب القرار.', 'نقل بياناتك الحالية إلى النظام.'],
      flow: ['المبيعات والمشتريات والموظفون', 'نظام واحد', 'تقارير حيّة لصاحب العمل'],
      sectors: [
        { name: 'التجارة', text: 'مخزون الفروع والمشتريات وحسابات الموردين.' },
        { name: 'العيادات', text: 'المرضى والمواعيد والفواتير ومخزون الصيدلية.' },
        { name: 'الورش والمصانع', text: 'الطلبيات والمواد وتكلفة كل طلب.' },
      ],
      limits: ['لا يُركَّب في أسبوع. النظام الحقيقي يحتاج أولاً إلى رسم إجراءات عملك.', 'ينجح فقط إذا استخدمه الفريق. نحن ندرّبهم، وأنت تُلزمهم به.', 'نبدأ بالوحدات التي تحتاجها. لا كل شيء دفعة واحدة.'],
      faq: [
        { q: 'هل يعمل بالدينار والدولار؟', a: 'نعم. تعدد العملات وأسعار الصرف جزء من تصميم المحاسبة.' },
        { q: 'هل نبدأ بوحدة واحدة؟', a: 'نعم. أغلب العملاء يبدؤون بالقسم الأكثر تعباً ثم يضيفون غيره.' },
      ],
      timeline: 'من شهرين إلى 4 أشهر',
      wa: 'مرحباً نوى، أريد الاستفسار عن نظام ERP.',
    },
  },
  {
    slug: 'saas-products',
    planet: 'mars',
    en: {
      name: 'SaaS Products',
      short: 'SaaS',
      outcome: 'Your product idea, built as software that customers subscribe to.',
      title: 'Your idea, built as a product *people subscribe to.*',
      intro: 'A SaaS product is a business, not only software. We help you decide what the first version must do, build it, and put it in front of paying customers.',
      problems: ['An idea with no technical team to build it.', 'A first version that tries to do everything and ships nothing.', 'A product that works for ten users and breaks at a thousand.'],
      deliverables: ['A first version focused on one problem.', 'Accounts, subscriptions and payments.', 'An admin panel to run the business.', 'Hosting, monitoring and a plan to grow.'],
      flow: ['Your idea', 'A first version', 'Paying subscribers'],
      sectors: [
        { name: 'Founders', text: 'From an idea to a product customers can try.' },
        { name: 'Companies', text: 'Turning an internal tool into a product you sell.' },
        { name: 'Industries', text: 'Software for one sector, such as clinics or schools.' },
      ],
      limits: ['We cannot promise customers. We build the product and help you test demand early.', 'A first version is small on purpose. Features are added when users ask for them.', 'Payment options in Iraq are limited. We design around what is available.'],
      faq: [
        { q: 'Do we own the code?', a: 'Yes. The product, the code and the customer data belong to you.' },
        { q: 'Can you keep developing it after launch?', a: 'Yes. Most products need a team after launch, and we can be that team.' },
      ],
      timeline: '2–3 months',
      wa: 'Hello NAWA, I would like to ask about building a SaaS product.',
    },
    ar: {
      name: 'منتجات SaaS',
      short: 'SaaS',
      outcome: 'فكرة منتجك تتحول إلى برنامج يشترك فيه عملاؤك.',
      title: 'فكرتك تتحول إلى منتج *يشترك فيه الناس*',
      intro: 'منتج SaaS مشروع تجاري وليس برنامجاً فقط. نساعدك في تحديد ما يجب أن تفعله النسخة الأولى، ثم نبنيها ونضعها أمام عملاء يدفعون.',
      problems: ['فكرة بلا فريق تقني يبنيها.', 'نسخة أولى تحاول أن تفعل كل شيء فلا تُطلق شيئاً.', 'منتج يعمل مع عشرة مستخدمين وينهار مع ألف.'],
      deliverables: ['نسخة أولى تركّز على مشكلة واحدة.', 'حسابات واشتراكات ومدفوعات.', 'لوحة إدارة لتشغيل المشروع.', 'استضافة ومراقبة وخطة للنمو.'],
      flow: ['فكرتك', 'نسخة أولى', 'مشتركون يدفعون'],
      sectors: [
        { name: 'المؤسسون', text: 'من الفكرة إلى منتج يجرّبه العملاء.' },
        { name: 'الشركات', text: 'تحويل أداة داخلية إلى منتج تبيعه.' },
        { name: 'القطاعات', text: 'برنامج لقطاع واحد، كالعيادات أو المدارس.' },
      ],
      limits: ['لا نستطيع أن نعدك بالعملاء. نبني المنتج ونساعدك في اختبار الطلب مبكراً.', 'النسخة الأولى صغيرة عن قصد. تُضاف المزايا حين يطلبها المستخدمون.', 'وسائل الدفع في العراق محدودة. نصمّم على ما هو متاح.'],
      faq: [
        { q: 'هل نملك الكود؟', a: 'نعم. المنتج والكود وبيانات العملاء ملك لك.' },
        { q: 'هل تواصلون تطويره بعد الإطلاق؟', a: 'نعم. أغلب المنتجات تحتاج فريقاً بعد الإطلاق، ونستطيع أن نكون ذلك الفريق.' },
      ],
      timeline: 'من شهرين إلى 3 أشهر',
      wa: 'مرحباً نوى، أريد الاستفسار عن بناء منتج SaaS.',
    },
  },
  {
    slug: 'branding',
    planet: 'moon',
    en: {
      name: 'Branding',
      short: 'Brand',
      outcome: 'A name, a mark and a voice for companies and founders, built on substance.',
      title: 'A brand built on what you *really do.*',
      intro: 'A brand is what people remember after they leave. We define what you stand for, then design the name, the mark and the voice that carry it across every screen and page.',
      problems: ['A company that looks different in every place it appears.', 'A founder with experience that nobody outside can see.', 'Content that sounds like every competitor.'],
      deliverables: ['Strategy: who you serve and what you promise.', 'Logo, colours, type and usage rules.', 'A voice guide in Arabic and English.', 'Templates for social media, presentations and print.'],
      flow: ['What you really do', 'Strategy and identity', 'One look and voice everywhere'],
      sectors: [
        { name: 'Companies', text: 'A full identity, from logo to stationery.' },
        { name: 'Founders', text: 'A personal brand built on real experience.' },
        { name: 'Products', text: 'Naming and identity for a new product.' },
      ],
      limits: ['A logo does not fix a weak offer. We start with what you do and for whom.', 'We do not write exaggerated claims. If we cannot support it, we do not say it.', 'A brand needs consistency after delivery. We give you the rules and templates to keep it.'],
      faq: [
        { q: 'Do you work in Arabic and English?', a: 'Yes. The identity and the voice are designed in both from the start.' },
        { q: 'Can you refresh an existing brand?', a: 'Yes. We keep what people already recognise and fix what holds it back.' },
      ],
      timeline: '3–5 weeks',
      wa: 'Hello NAWA, I would like to ask about branding.',
    },
    ar: {
      name: 'الهوية والعلامة',
      short: 'الهوية',
      outcome: 'اسم وشعار وصوت للشركات والمؤسسين، مبني على مضمون حقيقي.',
      title: 'علامة مبنية على ما *تفعله حقاً*',
      intro: 'العلامة هي ما يتذكره الناس بعد أن يغادروا. نحدد ما تمثّله، ثم نصمّم الاسم والشعار والصوت الذي يحمله في كل شاشة وصفحة.',
      problems: ['شركة تظهر بشكل مختلف في كل مكان.', 'مؤسس صاحب خبرة لا يراها أحد من الخارج.', 'محتوى يشبه محتوى كل المنافسين.'],
      deliverables: ['استراتيجية: من تخدم وبماذا تعد.', 'شعار وألوان وخطوط وقواعد استخدام.', 'دليل صوت بالعربية والإنجليزية.', 'قوالب للتواصل الاجتماعي والعروض والمطبوعات.'],
      flow: ['ما تفعله حقاً', 'استراتيجية وهوية', 'شكل وصوت واحد في كل مكان'],
      sectors: [
        { name: 'الشركات', text: 'هوية كاملة، من الشعار إلى المطبوعات.' },
        { name: 'المؤسسون', text: 'علامة شخصية مبنية على خبرة حقيقية.' },
        { name: 'المنتجات', text: 'تسمية وهوية لمنتج جديد.' },
      ],
      limits: ['الشعار لا يصلح عرضاً ضعيفاً. نبدأ بما تفعله ولمن.', 'لا نكتب ادعاءات مبالغاً فيها. ما لا نستطيع إثباته لا نقوله.', 'العلامة تحتاج إلى ثبات بعد التسليم. نعطيك القواعد والقوالب للحفاظ عليها.'],
      faq: [
        { q: 'هل تعملون بالعربية والإنجليزية؟', a: 'نعم. الهوية والصوت يُصمَّمان باللغتين من البداية.' },
        { q: 'هل تجددون علامة قائمة؟', a: 'نعم. نُبقي ما يعرفه الناس ونصلح ما يعيقها.' },
      ],
      timeline: 'من 3 إلى 5 أسابيع',
      wa: 'مرحباً نوى، أريد الاستفسار عن بناء الهوية.',
    },
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
export const serviceCopy = (s: Service, lang: Lang): ServiceCopy => s[lang];
