# NAWA website rebuild: UX direction report

> Report by the `ui-ux-director` agent, 13 November 2026. File references point to the legacy site
> (`portfolio/`, commit `01b0769`). Contrast ratios are the agent's calculations. Bundle sizes are estimates.
> Where this report and `decisions.md` differ, `decisions.md` wins.

---

## 0. Summary

- **The visual DNA is worth keeping.** That means: the black ground, the gold dust field that speeds up when you scroll, the thin rotating orbit ring, the planet that bleeds off the edge of a card, Playfair with tracked Montserrat labels, and the expo-out masked reveal.
- **The current build is a mood board, not a foundation.** It is a client-rendered personal SPA. There is no navigation on mobile, no i18n, no SEO, the form does nothing, and the custom cursor works against users. Keep the structure of none of it. Port the look.
- **Recommendation:** Astro (static output) with React islands. Every route exists in `/ar/` and `/en/`. The Arabic edition is written natively, and WhatsApp is the main way people convert.
- **Treat space as a layer system with budgets.** Allow one WebGL moment on the whole site (Home hero). Everything else is static SVG or AVIF, plus one earned "shooting star".

---

## 1. Audit of the current site

### 1.1 Keep (the DNA)
- **The gold particle field reacts to scroll speed.** In `portfolio/src/components/Hero3D.jsx:30-47`, the spin of the star cloud follows scroll velocity and eases back to an idle drift. This is the signature. Rebuild it within a budget (§5.6) and recolour it from amber `#f59e0b` to brand gold `#C5A463`.
- **The rotating hairline orbit ring.** `portfolio/src/components/Hero.jsx:10-14` becomes the logo's orbit.
- **The masked line-reveal headline with `ease [0.22,1,0.36,1]`.** In `Hero.jsx:32-62`. Make this the house easing.
- **The tracked uppercase micro-label** (`Hero.jsx:23`) and the Playfair + Montserrat pairing. Both already match the brand draft.
- **The planet composition.** In `portfolio/src/components/Works.jsx:130-143`, a planet sits partly off the card edge with an inner shadow and rim light. Keep the composition, replace the images, and drop the spin.
- **The focus-dimming idea.** Inactive cards dim behind the active one (`Works.jsx:185-188`). Keep it as a principle, not a mechanism.
- **WhatsApp as a primary channel** and the copy-email affordance (`portfolio/src/components/Contact.jsx:89-125`).
- **01–04 numbering** as an editorial device.
- **`netlify.toml`.** The base dir, security headers and immutable asset caching are all sound.

### 1.2 Kill
- **The custom cursor.** It is set in `portfolio/src/index.css:28-38` (`* { cursor:none !important }`), `portfolio/src/App.jsx:30` and `portfolio/src/components/CustomCursor.jsx`.
  - It calls `setState` on every mousemove (line 11), so React re-renders at 60–120 Hz.
  - The spring makes it lag behind the real pointer, which makes clicking imprecise.
  - On touch devices the circle stays stuck in the top-left corner.
  - It hides the OS cursors that low-vision users configure.
- **The 500vh service carousel** (`Works.jsx:70`).
  - It forces five screens of scrolling to see four cards.
  - On a 375px phone each card is about 319×180px (`w-[85vw] aspect-[16/9]`) but holds a `text-4xl` title, subtitle, paragraph and CTA inside `p-8 overflow-hidden`. The content gets clipped.
  - Inactive cards stay keyboard-focusable underneath the 85% black overlay.
- **Hotlinked images.** Wikimedia originals in `Works.jsx:10-46` (Earth, Moon, Mars, Jupiter photos with hue-rotate filters) and Unsplash in `Projects.jsx:14,25`. We don't control their size, caching or availability.
- **The in-plane `spin_120s` on photo textures** (`Works.jsx:137`). A photographed sphere rotating like a vinyl record reads as cheap to a trained eye.
- **About 18 MB of PNGs in `portfolio/public/`.** `1.png` is 1.4 MB, `2.png` 3.7 MB, `3.png` 3.9 MB and `4.png` 8.1 MB at 5000×5000. None is referenced in code, but they all deploy. `4.png` has visible black matte rectangles at its corners, and `3.png` has a clipped bottom edge. Don't reuse them.
- **3D tilt cards and the tilting form** (`portfolio/src/components/WorksPage.jsx:13-95`, `Contact.jsx:15-42,130-148`). A form that moves while you type in it is hostile.
- **Glassmorphism and very large blurs.** `backdrop-blur-xl` / `-3xl` and `blur-[90px…150px]` layers in `Works.jsx:125,132`, `Contact.jsx:48-57,147,150` and `WorksPage.jsx:107`. These are the most expensive things you can ask a mid-range Android GPU to do.
- **Off-brand colour.** Blue, purple, orange and green glows, plus three competing golds: amber-500 `#F59E0B` everywhere, Tailwind `gold` `#D4AF37`, and brand `#C5A463`. The maroon `accent #891707` is unused (`portfolio/tailwind.config.js:10-12`).
- **Faux typography.**
  - `font-black` (weight 900) is used throughout, but `index.css:2` only loads up to weight 700 / 600, so browsers synthesize the bold.
  - `font-mono` (the system mono) acts as a third, off-brand typeface.
  - `perspective-[2000px|1500px|1000px]` (`Works.jsx:71`, `WorksPage.jsx:45`, `Contact.jsx:143`) is not a Tailwind 3 utility, so it most likely outputs no CSS. That would mean the 3D rotations render with no perspective at all. Worth confirming in the built CSS.
- **Freelancer voice.** "Hussein Al-Taei" (Hero, Navbar, footer), "Reality & Dream", "Finance & Technology", "CONTACT ME", "The Lab", "INITIATE CONNECTION", "SYSTEM 0X", "Open for opportunities", a personal Gmail address, and "Copied!" with an exclamation mark.
- **`portfolio/src/components/Projects.jsx` (unused).** Two problems:
  - It contains invented metrics ("99/100 | SEO 100", "10k+ leads").
  - It showcases a product that scrapes Google Maps and sends automated WhatsApp outreach. Unsolicited bulk WhatsApp messaging conflicts with WhatsApp Business policy and with "most trusted". Never bring it back.
- **"Space reserved for future case study" placeholders** (`WorksPage.jsx:76-78`).

### 1.3 Accessibility (WCAG 2.2 AA)
- **No navigation on mobile.** The links are `hidden md:flex` and there is no menu (`portfolio/src/components/Navbar.jsx:26`).
- **Broken links.**
  - `/#about` points to nothing.
  - `Link to="/#contact"` does nothing useful, because React Router doesn't scroll to hashes.
  - Hero "Explore" goes to `#works`, but no element has that id (`Hero.jsx:80`).
- **Contrast failures:**
  - `text-white/40` (about 3.8:1) used at 10px in `Hero.jsx:72` and `Contact.jsx:91,108`.
  - `text-gray-500` (about 4.1:1) in `Hero.jsx:23` and the footer.
  - Placeholders `gray-600` (about 2.7:1).
  - Text sizes of 9–10px.
  - `mix-blend-difference` on the nav and `mix-blend-overlay` on titles make contrast unpredictable.
- **Form (`Contact.jsx:152-194`):**
  - Labels are not associated with inputs (no `htmlFor`/`id`) and inputs have no `name`.
  - Submit only calls `preventDefault`.
  - `focus:outline-none` leaves only a 50%-alpha border change as the focus indicator, which fails 2.4.7.
- **Motion:**
  - There is no reduced-motion handling anywhere. `App.css` mentions it but is a Vite leftover that nothing imports.
  - Infinite ambient motion has no pause control (2.2.2).
  - `scroll-behavior: smooth` has no guard.
  - The scroll-jacked carousel is hard to use with a keyboard.
- **Headings:** Home has two `<h1>` elements ("Reality" and "Dream"). The only services heading is decorative 5%-opacity text.

### 1.4 Performance (mid-range Android, Iraqi networks)
- **Network reality.** Ookla puts Iraq's median mobile download at roughly 50–65 Mbps. Medians hide congestion, outages and weak coverage outside Baghdad, so design for "slow 4G on a three-year-old Android".
- **Client-rendered SPA.** Users see a black screen until about 350 KB gzipped of JS (three, r3f, drei, framer, react-dom, router; estimated) downloads, parses and runs. The LCP waits on JavaScript.
- **The WebGL canvas** is fixed and full-screen on every route, renders 5,000 points every frame forever, has no DPR cap, does not pause off-screen, and has no fallback.
- **Google Fonts are loaded with CSS `@import`**, which is render-blocking and creates a request chain. Two families and seven styles are loaded, some never used, and weights that are used aren't loaded.
- **Unused dependencies:** `@splinetool/react-spline` and `maath`. Vite 8 beta is pinned through `overrides`.
- **`h-screen` (100vh)** makes the hero jump as mobile browser chrome appears and disappears.

### 1.5 SEO, i18n, code hygiene
- **SEO.** There is no meta description, Open Graph tags, canonical, sitemap or robots file, and the favicon is `vite.svg`.
  - Crawlers for WhatsApp, Telegram and LinkedIn link previews don't run JavaScript. **Links to the site shared on WhatsApp currently show nothing.** In Iraq, that's the main way links travel.
- **i18n is at zero.**
  - Strings are hard-coded and only `lang="en"` is set, with no `dir`.
  - Layout uses physical direction classes: `left-1/2`, `-right-[15%]`, `border-l-2 pl-4`, `left-6`, `translate-x-2`.
  - Uppercase and letter-spacing are used everywhere; both break Arabic.
  - The arrows don't mirror.
- **Hygiene:**
  - Dead files: `App.css`, `src/assets/react.svg`, the template README and `Projects.jsx`.
  - The root `package.json` and its `node_modules` duplicate the dependencies, add `lucide-react`, `clsx` and `tailwind-merge`, and are unused by the Netlify build.
  - Comments mix languages. There is no TypeScript.

---

## 2. Information architecture

```
/ar/  and  /en/   (every route exists in both; English slugs in both locales)
├── Home
├── Services
│   ├── ai-agents
│   ├── automation            (WhatsApp, email, reports)
│   ├── websites-web-apps
│   ├── erp-saas
│   └── brand                 (company and personal brands)
├── Work
│   └── [case-study]
├── Process                   (how we work, engagement models, ownership)
├── About                     (team, Baghdad office, principles)
├── Insights                  (Phase 2: launch with at least 4 Arabic-first posts)
├── Contact                   (WhatsApp, book a call, form, office)
├── Trust                     (AI and data policy: where data lives, who owns what)
├── Privacy · Terms
└── 404                       ("Lost orbit")
```

**Why this structure:**
- **Services split into five pages.** Each service is a different buyer with a different search intent. "أتمتة واتساب" and "نظام ERP" are different queries and need different proof.
- **Process gets its own page.** Iraqi SMEs have often been burned by freelancers who disappeared. Showing steps, contracts, handover and support is the strongest trust lever after case studies.
- **The Trust page is the differentiator** for "most trusted AI agency". Almost no regional agency publishes its data-handling rules.
- **Industries come later.** Hold off on industry pages until there are two or more case studies per sector. Until then, sector is a filter on Work and a section on each service page.
- **Insights waits for content.** An empty blog hurts trust more than having no blog.
- **Slugs stay in English in both locales.** Arabic slugs turn into very long percent-encoded strings when shared on WhatsApp.
- **Build i18n for three locales.** Kurdish Sorani (`ckb`, also right-to-left) is a likely future locale.

**What a B2B buyer in Iraq or MENA needs to see before contacting:**
1. **A real company:** legal name, registration number if one exists, a Baghdad address with map, office photos, an Iraqi phone number, and hours (Sun–Thu, Baghdad time).
2. **Faces:** the founder and the team with names, roles and LinkedIn. In Iraq, people buy from people.
3. **Proof with numbers:** case studies with before/after figures and a measurement window, client logos (with permission), and named testimonials, ideally short Arabic video.
4. **A live demo:** "Message our agent on WhatsApp". For an AI agency, this is the strongest proof available.
5. **WhatsApp-first contact** with a promised response time.
6. **Pricing signals:** "from" prices or engagement models, the currency (USD/IQD), and what drives the cost.
7. **Ownership and exit:** you own the code and data, there is a handover, and an SLA.
8. **Data handling:** hosting location, NDA on request, and no training on client data.
9. **Arabic of equal quality to the English**, not machine-translated.

---

## 3. Page-by-page blueprints

Format: **Section → content → space visual.**

### Home
- **Goal:** within 10 seconds a visitor knows who NAWA is, what it builds, for whom and where, and takes one step.
- **Primary CTA:** Book a 30-minute call. **Secondary:** WhatsApp.

1. **Hero.** H1 "We build intelligence *that works*." / "نبني ذكاء **يشتغل**", with the gold phrase. Subline: "AI agents, automation and software for companies in Iraq and the Middle East. Built in Baghdad." Two CTAs.
   - Visual: the gold particle field (the signature) and the logo's hexagonal orbit ring rotating slowly behind the H1.
2. **Proof strip.** Three verified numbers: projects shipped, hours automated per month, median reply time. Each has a footnote.
   - Visual: none (calm after the hero).
3. **Logo wall.** Monochrome client logos. Ship only once logos are approved.
   - Visual: hairline rule.
4. **Services ("The NAWA system").** Five bodies, each with: problem → outcome, typical timeline, "from" price, and a link.
   - Visual: five custom planets on a single orbit (mapping in §5.6).
   - Desktop gets a pinned scroll section of at most 250vh, with a "01/05" counter and a "Skip" link, as a nod to the old carousel. Mobile gets a native swipe scroll-snap row.
5. **Featured work.** Two or three tiles with metric-first headlines.
   - Visual: sharp "observation plate" frames with a coordinate-style metadata line.
6. **Live demo.** "Message our agent", with a WhatsApp deep link and a QR code on desktop.
   - Visual: a constellation diagram (customer → agent → your systems).
7. **How we work.** Four steps, each with a duration and a deliverable, linking to Process.
   - Visual: one orbit with checkpoints and a moon that advances via CSS scroll-driven animation.
8. **Principles.** Numbers over adjectives · Honest limits · You own everything · Arabic-first.
   - Visual: faint hexagon grid.
9. **Testimonials.** One to three, each with name, role, company and photo.
   - Visual: none.
10. **Team and place.** Faces plus an office photo: "Built in Baghdad."
    - Visual: milky-way band behind.
11. **FAQ.** Six objections: cost, timeline, data, Arabic quality, maintenance, "do we even need AI?"
12. **Closing CTA.** "Tell us what slows your team down."
    - Visual: the ringed planet inside the logo hexagon, the hero brand image.

**Owner supplies:** real metrics with sources, logos and permissions, testimonials, team and office photos, "from" prices, and a demo agent number.

### Services overview
- **Goal:** route each visitor to the right service.
- **CTAs:** Book a call · "Not sure? Describe the problem" (form with service = "Not sure").
- **Sections:**
  - Intro.
  - Five service rows: planet, outcome, deliverables, timeline, "from" price.
  - Engagement models table: Pilot (fixed fee, 2–4 weeks) · Project · Retainer.
  - FAQ and CTA.
- **Visual:** the full system, all five planets on concentric orbits, static SVG and AVIF.

### Service detail (one template, five pages)
- **Goal:** qualify the visitor and convert.
- **Primary CTA:** Book a call with the service pre-tagged. **Secondary:** WhatsApp with a pre-filled message ("مرحبا NAWA، أريد الاستفسار عن وكلاء الذكاء الاصطناعي").

1. **Hero.** An outcome-led H1 and the service planet. Example, to be replaced with a measured figure: "An agent that answers your customers on WhatsApp, in Iraqi Arabic, in seconds."
2. **Problems we solve.** Three or four pains, in the buyer's words.
3. **What you get.** A concrete list of deliverables.
4. **How it works.** Constellation diagram: channels → agent → CRM, sheets, ERP.
5. **Proof.** The most relevant case study and its stat block.
6. **Use cases by sector.** Clinics, retail, SMEs.
7. **Timeline.** Week by week.
8. **Pricing signal.** A "from" price and the factors that drive cost.
9. **Honest limits.** "What this won't do." This section defines the brand.
10. **Integrations.** Logos.
11. **FAQ.** Includes FAQPage schema.
12. **CTA.**

**Owner supplies:** scope, prices, limits, integrations and one proof point per service.

### Work index
- **Goal:** proof at a glance.
- **Content:** filter chips (service, sector) and tiles. Each tile has a 16:10 thumbnail, a "Sector · Baghdad · 2026" line, a metric headline such as "−38% no-shows" (illustrative), and tags.
- **Visual:** a star-chart grid. Tiles are flat with hairline frames.
- **Rules:**
  - With fewer than three cases, hide this page and show the cases on Home.
  - NDA work can run anonymously ("a private clinic group in Baghdad") as long as the numbers are real.

### Case study
- **Content:** Context (client, sector, size) → Problem (quantified) → Approach → Solution (screens or short video) → Results (stat blocks with the measurement window) → Timeline and team → Client quote → Stack → Next case.
- **CTA:** "Have a similar problem?"
- **Visual:** a "mission plate" hero; results styled as orbit gauges at most.

### Process
- **Goal:** lower perceived risk.
- **Steps:** Discovery call (free, 30 minutes) → Scoping (fixed proposal in X days) → Design → Build in sprints with weekly demos → Launch → Operate (SLA). Each step lists duration, what you get, and what we need from you.
- **Also covers:** engagement models, contracts and IP ownership, data and security, communication (a shared WhatsApp group plus a weekly report), support hours.
- **Visual:** an orbit path whose checkpoints light up on scroll (CSS only).

### About
- **Content:**
  - Mission.
  - The name and the logo: a core held in its orbit, using the "nucleus" reading of نوى if the owner endorses it.
  - Founder story.
  - Team grid.
  - Principles: the brand voice rules stated as public commitments.
  - Company facts in numbers: founded, team size, shipped projects.
  - Office (address, map, photos). Partners.
- **Visual:** the animated logo (core and orbit) as the hero, and a spiral galaxy with a gold core for "the Middle East ambition".

### Contact
- **Three doors, in this order:**
  1. WhatsApp (fastest, with the reply-time promise).
  2. Book a 30-minute call (Cal.com or Calendly embed, timezone Asia/Baghdad; check the Arabic UI).
  3. Write to us (form, §4.4).
- **Then:** address, map, hours, phone, and an email on the domain.
- **Success state:** "We'll reply on WhatsApp within 2 working hours (Sun–Thu)", plus the site's one shooting star.

### Trust · Privacy · Terms · 404
- Text pages with a 68ch measure.
- 404 is a lone drifting planet with "This page left orbit" and links home.

---

## 4. Navigation and conversion

### 4.1 Navigation
- **Desktop:**
  - Logo at the start edge.
  - Links: Services (mega-menu with the five planets and one-liners) · Work · Process · About · Insights (once it exists).
  - At the end: the language switch and the gold primary button "Book a call".
- **Header behaviour:** height 64px. Transparent over the hero, then solid `#0A0A0A` at 90% opacity with a hairline bottom border after 80px of scroll. Remove `mix-blend-difference`.
- **Mobile:**
  - A hamburger opens a full-screen sheet with large links, the language switch, and the CTAs in the thumb zone.
  - After the hero, show a slim **bottom action bar**: "WhatsApp | Book a call". Respect safe-area insets, and hide it near the footer and while the form is open.
- **Basics:** skip link, `aria-current`, `aria-expanded` on the menus, and a visible focus ring everywhere.

### 4.2 Language switch and RTL
- **The switch:**
  - It goes to the **equivalent page**, never to Home.
  - Its label is in the target language: "العربية" / "English". No flags.
  - Store the choice in a cookie.
  - Auto-redirect only at the root, via Netlify `[[redirects]]` with `conditions = {Language=["ar"]}` / `{Country=["IQ"]}`. Never override a choice the user has made.
- **Markup:** set `<html lang dir>` per locale at build time. Add `hreflang` (`ar`, `en`, `x-default`) and a canonical per page.
- **Mirror:** grid and column order, nav order, text alignment, directional icons (arrows, chevrons, the external-link "↗" becomes "↖"), swipe and carousel direction, process timelines (start on the right), breadcrumbs, hover nudges, form layout, and quote marks (« » in Arabic).
- **Do NOT mirror:**
  - The logo and the Latin wordmark.
  - Screenshots and photos.
  - **Planet lighting** (keep the light coming from the top-left).
  - Orbit rotation (physics stays physics).
  - Clockwise progress rings and play icons.
  - Brand glyphs (the WhatsApp icon).
  - Chart time axes.
  - Numbers, phone numbers, prices, emails and URLs. Keep these LTR with `dir="ltr"` / `<bdi>`.
- **Implementation:** use logical properties only (`ms-/me-/ps-/pe-/start-/end-`, `text-start`, and `rtl:` variants). Lint against `left-`, `right-`, `pl-` and `pr-`.
- **Arabic text rules:**
  - No uppercase or letter-spacing. Tracked English labels become weight and size contrast in Arabic.
  - **No italics.** The gold italic Playfair phrase becomes gold colour only in Arabic.
  - No justification.
  - Wrap Latin product names inside Arabic sentences in `<bdi>`.
- **Digits:** choose one convention and apply it everywhere. I recommend Western digits (0–9) in Arabic for stats, prices and phone numbers, since they scan like data and match the English edition. Check this with five target clients.
- **Copy:** write Arabic natively in clear MSA with Iraqi warmth (the tagline "يشتغل" sets that register), then have an Iraqi reviewer check it.

### 4.3 CTA strategy
- **One primary CTA site-wide:** "Book a 30-minute call" / "احجز مكالمة 30 دقيقة".
  - It is the only gold-filled button, and at most one appears per viewport.
  - Secondary: WhatsApp (outline). Tertiary: text links ("See the case study").
- **Make CTAs contextual:** pre-fill the service on service pages, and use "Have a similar problem?" on case studies.
- **Microcopy:** plain verbs, no exclamation marks, no metaphor ("Initiate connection" goes).
- **Analytics:** a privacy-friendly tool (Plausible or Umami) tracking WhatsApp clicks, booking completion, form submissions and language switches.

### 4.4 Lead form (qualification)
**Step 1 (required):**
- Name
- Company
- WhatsApp number (defaults to +964, `dir="ltr"`, `inputmode="tel"`)
- Service interest (multi-select chips, including "Not sure")
- "What do you want to improve?" (textarea)

**Step 2 (optional):**
- Role
- Timeline (ASAP / 1–3 months / Exploring)
- Budget range in USD, including "Not sure yet"
- Preferred channel (WhatsApp / Call / Email)
- Preferred language (AR / EN)
- How did you hear about us
- Email (optional; many Iraqi SMEs prefer WhatsApp)

**Plus:**
- Privacy consent.
- A honeypot and Cloudflare Turnstile against spam.
- Submissions go through a Netlify Function to the CRM and notify the team on WhatsApp.

---

## 5. Design system

### 5.1 Type
- **Latin:**
  - Playfair Display 400 and 600, plus Italic 400 for one gold phrase per page, used for display and H1–H3.
  - Montserrat 400/500/600 for text and UI.
  - Labels: 12px, uppercase, +0.16em tracking, 500 weight.
  - Drop the mono face and weight 900.
- **Arabic:**
  - I could not confirm Najwa's web licence or its weights. A single weight can't carry UI hierarchy.
  - Recommendation: Najwa for Arabic display only, and **IBM Plex Sans Arabic** (OFL, multiple weights) for Arabic body and UI.
  - Maximum two Arabic faces.
- **Scale:** fluid with `clamp()` on a roughly 1.25 ratio:
  - EN: 12 / 14 / 16 (body) / 18 (lead) / 24 / 32 / 44 / 64 / 88. Display uses `clamp(2.75rem, 1.5rem + 5vw, 5.5rem)`.
  - AR body is **18px with line-height 1.75**. AR headings use line-height 1.35. EN body uses 1.6 and EN display 1.05–1.1.
  - Tune Arabic display sizes by eye against matching x-height.
- **Measure:** body maximum 38rem (about 65ch).
- **Stats:** `font-variant-numeric: lining-nums tabular-nums`.
- **Font loading:**
  - Self-host subset WOFF2 files and preload two files per locale.
  - Arabic pages load Arabic fonts plus a Latin subset only.
  - `font-display: swap` for body. Font budget is at most 150 KB per locale.

### 5.2 Grid and spacing
- **4px base.** Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160.
- **Breakpoints:** 360 / 640 / 768 / 1024 / 1280 / 1536.
- **Columns:**
  - Mobile: 4 columns, 16px gutters, 20px margins.
  - Tablet: 8 columns, 24px gutters, 32px margins.
  - Desktop: 12 columns, 32px gutters, 48–80px margins.
- **Widths:** content max 1280px, text column 680px, bleed media up to 1440px.
- **Rhythm:** sections get 128–160px vertical padding on desktop and 72–96px on mobile. The hero uses `min-height: 100svh`.

### 5.3 Colour (contrast checked)
| Token | Value | Use | Contrast on #0A0A0A |
|---|---|---|---|
| ground | #0A0A0A | page background | – |
| surface 1/2/3 | #111 / #1A1A1A / #242424 | cards, inputs, menus | – |
| hairline | #2A2A2A | **decorative only** | 1.4:1 |
| ui-border | ≥ #666 | input and control borders (1.4.11 needs ≥3:1 against #111) | ≥3:1 |
| text | #FFFFFF headings, #EDEDED body | | ~17–19:1 |
| text-muted | #888 | secondary text; fails on #242424 (4.4:1), use #999 there | 5.6:1 |
| gold | #C5A463 | primary core, the gold phrase, active state | 8.4:1 |
| gold-deep | #8F713D | borders and large text only | 4.3:1 |
| gold-bright | #DDC288 | hover, **focus ring** (2px with 2px offset) | 11.5:1 |

- **Gold covers no more than 5% of any viewport** and always means either "act here" or "this matters".
- **No other hues.** That includes the WhatsApp button: use the glyph's shape, in white or gold, not a green fill.

### 5.4 Components
- **Buttons ("things you press are round"):**
  - **Primary planet:** a gold pill with black text (8.4:1) and an orbit-ring ornament. On hover the core grows by 4% and a moon makes one orbit of the ring in 1.2s. With reduced motion, hover is a colour shift only.
  - **Secondary:** an outline pill with a ≥3:1 border.
  - **Text link:** an arrow that mirrors in RTL.
  - **Icon button:** 44px circle.
  - All buttons are at least 48px tall.
- **Cards ("frames are sharp"):** corner radius 0–2px, flat #111 surface, hairline border that turns gold-deep on hover. The whole card is clickable through a single stretched link. No blur, no tilt.
- **Specialised blocks:**
  - Service card: planet AVIF at 160px, title, outcome, deliverables, from-price.
  - Case tile and stat block: number, unit, label and a **source footnote**.
  - Testimonial with a round avatar.
  - FAQ built on native `<details>`.
  - Logo wall, team card, process step, pricing-model table, CTA band, mega-menu, bottom action bar, breadcrumbs, chips, footer.
- **Forms:** label above the field, 48px fields on #111, ≥3:1 border, gold-bright focus ring, inline errors with icon and text tied via `aria-describedby`, and an LTR phone field.

### 5.5 Motion
- **Durations:**
  - Press and hover: 120–180ms.
  - Menus and accordions: 200–280ms.
  - Section reveals: 400–600ms, fading in with a 12–16px rise, once only, with a 60ms stagger across at most four items.
  - Hero entrance: at most 1.2s total.
  - Ambient loops: 20–120s.
- **Easing:** `cubic-bezier(0.22,1,0.36,1)` for entrances (the house curve), `cubic-bezier(0.65,0,0.35,1)` for state changes, and linear only for ambient rotation.
- **Never:** scroll-jacking, tilt, cursor effects, or springs on scroll position.
- **Reduced motion:**
  - WebGL is replaced by a static poster.
  - Loops, parallax and smooth scroll are off.
  - Fades are 150ms or shorter.
- **Data and device constraints:** `Save-Data`, `deviceMemory ≤ 4` or no WebGL2 all trigger the same poster mode.
- **Pause control:** a footer toggle, "Motion: On/Off", stored in localStorage, satisfies WCAG 2.2.2 and reads as a premium detail.

### 5.6 The "space layer" system
| Layer | Scope | Implementation | Budget |
|---|---|---|---|
| **L0 Deep field** | Global | Tiled WebP/SVG star dust at two depths; CSS drift of 90s or more; off under reduced motion | ≤ 20 KB, no JS |
| **L1 Signature** | Home hero only | The rebuilt gold particle cloud | See below |
| **L2 Bodies** | Per section | Pre-rendered planets (AVIF with alpha), SVG orbits, SVG constellations, milky-way band | ≤ 80 KB per planet; static by default; at most one animating per viewport |
| **L3 Events** | Earned | Shooting star (once, on form success); flare glint on primary button hover | Once per session |

**L1 Signature details:**
- Load it after the LCP with a dynamic import and `client:idle`; the LCP itself is a poster AVIF of about 100 KB.
- 5,000 points on desktop, 1,500 on mobile. DPR at most 1.5.
- Pause when out of view (IntersectionObserver) and when the tab is hidden.
- Colour `#C5A463`. It adds about 200 KB gzipped of JS, on Home only.

**Service-to-body mapping (visual only, never in labels):**
- AI Agents: a planet with its own moon (autonomy in orbit around you).
- Automation: satellites on fixed orbits (repeatable rails).
- Websites & web apps: a ringed planet (the surface people touch).
- ERP & SaaS: a multi-planet system bound together (many modules, one gravity).
- Brand: a flare star (emits light, gets seen).

Commission five custom renders with one shared lighting setup and the brand palette (desaturated, gold rim light) instead of NASA photos.

**Hard limits:**
- One WebGL context site-wide.
- No `backdrop-filter` except on the nav.
- No live CSS blur above 40px on mobile; use pre-blurred images.
- Space never sits behind body text without a scrim.
- Performance targets on a mid-range Android over slow 4G:
  - Initial JS at most 170 KB gzipped, excluding the L1 island.
  - Home first load at most 1 MB.
  - LCP under 2.5s, INP under 200ms, CLS under 0.05.

---

## 6. Tech recommendation: Astro, static output

| | Vite SPA (today) | Next.js App Router (SSG) | **Astro (static)** |
|---|---|---|---|
| Static HTML per URL (SEO, WhatsApp/LinkedIn previews) | No (needs prerender hacks) | Yes | **Yes** |
| JS shipped on content pages | All of it | React runtime plus hydration | **Zero by default; islands only** |
| i18n routing, hreflang | Manual | next-intl | **Built-in i18n routing** |
| Reuse existing R3F/Framer code | – | Yes | **Yes, as React islands** |
| Typed bilingual content (services, cases, posts) | Manual | Bring a CMS | **Content collections + MDX** |
| Image pipeline (AVIF/WebP, srcset) | Manual | next/image | **astro:assets** |
| Netlify | Yes | Adapter | **Static; current netlify.toml works with small edits** |

**Choose Astro.**
- This is a marketing site: content-heavy, bilingual, performance-critical, with a few rich interactive moments. That is exactly what islands are for.
- The hero cloud becomes one `client:idle` React island. Forms and menus are small islands. Everything else ships as HTML and CSS.
- Use Tailwind v4, which has native logical properties and `rtl:` variants.
- Use View Transitions for page changes, disabled under reduced motion.
- Add a git-based CMS (Keystatic or Decap) once non-developers start editing.

**Choose Next.js only** if the plan is to put a client portal or product dashboards in the same codebase. Even then, I'd keep NAWA's products in separate apps.

**SEO setup:**
- Per-locale titles and descriptions.
- Organization + ProfessionalService schema with the Baghdad address; Service, FAQPage and Article schemas.
- A sitemap with alternate-language links.
- **A generated OG image per page per locale.** This is critical for WhatsApp sharing.
- A Google Business Profile for local search.
- Arabic keyword research for terms like "شركة ذكاء اصطناعي بغداد" and "أتمتة واتساب".

---

## 7. Top 15 UX rules for nawa-iq.com

1. **Say what NAWA does, for whom and where in the first viewport,** in plain words, in both languages.
2. **Use the metaphor in visuals, never in labels.** "Services", not "Systems"; "Work", not "The Lab".
3. **Every claim gets a number or gets cut,** and every number gets a footnote.
4. **One gold primary CTA per viewport.** WhatsApp is always one tap away on mobile.
5. **Arabic is a first-class edition,** written natively and reviewed by an Iraqi reader, never translated by machine.
6. **Mirror the reading direction, not the universe.** Never flip logos, photos, numbers, orbits or planet lighting.
7. **Never hide the native cursor, never hijack scroll, never tilt a form.**
8. **The page must be useful before the stars load:** content first, WebGL after LCP, a poster as fallback.
9. **Allow at most one ambient motion per viewport.** Everything has a reduced-motion state and a pause toggle.
10. **Gold covers no more than 5%** and means "act here" or "this matters".
11. **Frames are sharp and pressables are round.** Every pressable is at least 44–48px with a visible gold focus ring.
12. **Show faces, an address, hours and a response-time promise.**
13. **Every service page states its honest limits.**
14. **Forms ask only what you will use.** WhatsApp number over email. Confirm with when, and how, you will reply.
15. **No placeholders, ever.** If a case study isn't real and approved, the section doesn't ship. Test every release on a three-year-old Android over slow 4G.
