# NAWA shared context (read by every design agent)

This file is the single source of truth the three design agents (`.claude/agents/`) load before they work.
Update it here when a decision changes, not inside each agent.

## Who NAWA is
- NAWA (Arabic: نوى) is an AI agency from Baghdad, Iraq. Domain: nawa-iq.com.
- Builds: AI agents, automation (WhatsApp, email, reports), websites and web apps, ERP systems, SaaS products, brands.
- Clients today: Iraqi companies and founders (clinics, retailers, SMEs). Ambition: the most trusted AI agency in Iraq, the most professional in the Middle East.
- Tagline: "We build intelligence that works." / "نبني ذكاء يشتغل".
- Voice: serious, disciplined, calm confidence. Numbers over adjectives. Honest limits. Short sentences. No hype, no exclamation marks, no emoji.

## Site decisions (agreed with the owner)
- Stack: Astro (static output), Tailwind v4, plain TypeScript modules in `src/scripts/` for every effect (Canvas 2D and CSS, no React or three.js), cobe for the globe. Hosted on Netlify.
- Languages: English default, full Arabic (RTL). Routes `/en/...` and `/ar/...` with English slugs in both.
- Pages: Home, Services (+ 6 detail pages), Work (+ case-study template), Process, About, Contact, 404.
- Services (6, one per corner of the logo hexagon): AI Agents, Automation, Websites & Web Apps, ERP Systems, SaaS Products, Branding.
- Content: templates with sample content flagged `draft: true`. Production never shows invented numbers, logos or testimonials.
- Contact: Netlify Forms. WhatsApp is the primary channel.
- Motion level: calm luxury, about 80% clarity and proof, 20% signature moments. One "wow" per page, and it must explain the offer.
- Signature pieces already built: gold star cloud behind every page (`sky.ts`), gold point-cloud planet hero with pointer repel (`heroplanet.ts`), opening screen where the logo draws itself, service cards with real planet photos (`rail.ts`), hexagon orbit on the Services page (`orbit.ts`), eclipse language switch and moon cursor (`site.ts`), launch trail on form success (`form.ts`), Baghdad globe (`globe.ts`).

## Visual identity
- Space: stars, planets, orbits, galaxies, shooting stars. Rendered quietly, never as sci-fi cliche.
- Logo: a rounded hexagon outline around a solid disc ("a planet held in its orbit"). Never stretched, rotated, recoloured or mirrored.
- Palette (no other hues, no blue, no purple; the one exception is the planet photos inside service cards, which keep their natural colours):
  - ground `#0A0A0A`, surfaces `#111111` / `#1A1A1A` / `#242424`, hairline `#2A2A2A` (decorative only), control borders `#666666` or lighter
  - text `#FFFFFF` (headings), `#EDEDED` (body), `#888888` (muted)
  - gold `#C5A463`, gold-deep `#8F713D`, gold-bright `#DDC288` (hover and focus ring)
  - gold covers at most 3-5% of any viewport: primary CTA, active state, orbit highlight, key numbers, focus ring
  - gold in WebGL units: `[0.773, 0.643, 0.388]`
- Type: Playfair Display (display, 40px and up), Montserrat (text, uppercase tracked labels), Najwa Arabic (Arabic headings, single weight), IBM Plex Sans Arabic (Arabic body and UI).
- Arabic rules: no italics, no uppercase, no letter-spacing, never split text per character. Numbers, phones, prices and URLs stay LTR inside `<bdi dir="ltr">`. Western digits in both languages.
- RTL: mirror layout, arrows and timelines. Never mirror the logo, photos, planet lighting, orbit direction, maps or numbers. Logical CSS properties only.
- Shapes: frames are sharp (cards radius 0-2px, flat, hairline edge). Things you press are round (planet button: gold core inside an orbit ring).

## Motion and performance budgets
- House easing `cubic-bezier(0.22, 1, 0.36, 1)` for reveals, `expo.inOut` for page and scene transitions.
- Durations: micro 150-250ms, reveals 700-900ms, transitions 900-1200ms, stagger 50-70ms.
- No scroll-jacking, no tilt on cards or forms, never hide the native cursor.
- At most one WebGL context in view. Pause off-screen and when the tab is hidden. DPR capped at 1.5 on mobile.
- `prefers-reduced-motion`, `Save-Data`, 2g/3g or `deviceMemory <= 2` all get a static tier. The footer has a Motion on/off button.
- Targets on a mid-range Android over slow 4G: LCP under 2.5s, INP under 200ms, CLS under 0.05. LCP is text, never a canvas.
- WCAG 2.2 AA. Decorative layers are `aria-hidden`. Every interactive visual has a real button or link.

## Where things live
- Research reports: `docs/research/` (01 UI/UX audit, 02 space components, 03 award sites, decisions).
- Design tokens and component styles: `src/styles/global.css`. Effects: `src/scripts/`. Components: `src/components/`. Copy: `src/i18n/ui.ts`, `src/data/`. Site config: `src/config/site.ts`.
- Sample content is flagged `draft` and only shows when `PUBLIC_SHOW_DRAFTS=true` (dev and Netlify previews). See `src/lib/drafts.ts`.
- Checks: `npm run check` (types), `npm run qa` against `astro preview` (see `scripts/qa.mjs`).
