# Decisions agreed with the owner

Date: 13 November 2026. Where a research report disagrees with this file, this file wins.

| Topic | Decision | Note |
|---|---|---|
| Foundation | Astro 7 (static), Tailwind v4, plain TypeScript for every effect (Canvas 2D and CSS), cobe for the globe, Netlify | Changed from Next.js after the UI/UX agent's recommendation. No React, three.js, GSAP or Lenis were needed; add them only if a feature requires it |
| Language | English default + full Arabic (RTL). Routes `/en/...` and `/ar/...`, English slugs in both | The UI/UX report suggested Arabic first; the owner chose English default |
| Colours | Black `#0A0A0A`, white, champagne gold `#C5A463` at 3-5% of the screen. No blue, no purple | One exception chosen by the owner: the planet photos inside the service cards keep their natural colours |
| Fonts | Playfair Display, Montserrat, Najwa Arabic (Arabic headings), IBM Plex Sans Arabic (Arabic body and UI) | Owner checks Najwa's web licence. Swappable in one line |
| Services | AI Agents, Automation, Websites & Web Apps, ERP Systems, SaaS Products, Branding | 6 services, one per corner of the logo hexagon. The reports assumed 5 |
| Pages | Home, Services + 6 detail pages, Work + case-study template, Process, About, Contact, 404 | Insights, Trust, Privacy, Careers: not in this round |
| Content | Templates with sample content flagged `draft: true`, shown in dev and preview only | Production shows honest empty states, never invented numbers |
| Contact details | Placeholders in `src/config/site.ts` | Owner fills in later |
| Contact form | Netlify Forms (honeypot + AJAX) | Can be wired to n8n by webhook later |
| Motion level | Calm luxury, 80% clarity and proof / 20% signature moments | One "wow" per page that explains the offer |
| Signature moments | Eclipse language switch, Launch on form submit, Baghdad from orbit (cobe), first-visit logo preloader, moon cursor (desktop only) | "Mission Control" AI assistant is a later phase |
| Hero | **C**: a ringed planet made of gold points. Points scatter away from the pointer like two like magnetic poles, then return | `src/scripts/heroplanet.ts` |
| Site background | **B's gold star cloud on every page**, slowed down so it is restful. Speeds up slightly on scroll | `src/scripts/sky.ts` |
| Opening screen | **A's logo build**: black screen, the logo draws itself, a curtain lifts. Once per session, skippable by click or key | `.preloader` in `src/layouts/Base.astro` |
| Home services | **B**: scrolling cards with the real planet photos from the old design. Pinned on desktop for about 2.5 screens with a skip link; native swipe on phones | `src/components/ServiceRail.astro`, `src/scripts/rail.ts` |
| Services page top | **A's hexagon orbit**, with a solid white centre disc like the logo | `src/pages/[lang]/services/index.astro`, `src/scripts/orbit.ts` |
| Still-image tier | Reduced motion, Save-Data, 2g/3g, or 2 GB of memory or less | The plan said 4 GB; lowered so mid-range phones keep the moving stars |
| Old site | Preserved in git history at commit `01b0769` (local tag `v1-legacy`), then removed from the working tree | |

| Call to action (Nov 19, 2026) | Every "Start a project" button now leads to the "Discover why you are losing customers" diagnosis (`/[lang]/launch/`): optional 6-second rush warm-up (B) + 9 questions that build the visitor's planet (A, the foundation). Partial result free, full report after a WhatsApp number | Research: `docs/research/04-interactive-cta.md`. WhatsApp and the contact form stay for visitors ready to talk |
| CTA copy | Owner's headline "اكتشف ليش تخسر زبائنك" / "Discover why you are losing customers", A/B tested against "كم زبون ضاع منك هالأسبوع؟" | Variant stored per visitor (`nawa-cta`), saved on every visit, session and lead |
| Result | Fixed formula now (`engine.ts`), hybrid later (the same structured result narrated by Claude) | Every number is a conservative range with visible, editable assumptions |
| Data | Supabase (RLS locked, written only by the Netlify Function with the service key) | Netlify Forms stays for the contact form only |
| Lead alerts | Telegram (instant, with a reply-on-WhatsApp button) and email (Resend) | The WhatsApp Business API is not used: the visitor starts the chat with a pre-filled result code |
| Privacy | New `/privacy` page: GDPR-style practice (consent, 12-month retention, deletion on request) | Iraq has no data protection law in force yet |
| Rebrand (Nov 21, 2026) | NAWA becomes **NAWA Legal Tech** for law firms and in-house legal teams in Iraq. Same voice, new field. Every word rewritten, the diagnosis rebuilt ("Discover where your legal work slips": 6-second office rush + 9 questions on matters, deadlines, close calls and where files live; result in deadlines at risk per year and lawyer hours per month) | The agency site is kept as a division (`src/data/divisions/agency/`, `engines/agency.ts`, git tag `nawa-agency-v1`) for future branches (NAWA Branding, NAWA Scaling). Supabase migration `20261121000000_launch_division.sql` adds `division` |

## Open items for the owner
- Legal diagnosis: confirm `PRESETS` in `src/scripts/launch/engines/legal.ts` (value of one lawyer hour in IQD per type of practice, and the share of freed hours that goes back into legal work). Have one Iraqi lawyer read the legal copy before launch.
- Legal diagnosis: apply `supabase/migrations/20261121000000_launch_division.sql` before deploying.
- Launch diagnosis (agency, preserved): confirm the per-industry presets in `PRESETS` (`src/scripts/launch/engine.ts`): value of a new customer in IQD and the share of inquiries that become customers.
- Launch diagnosis: apply the Supabase migration, create the Telegram bot and Resend key, and set the environment variables listed in the README.
- Launch diagnosis: share the questions you ask in real discovery calls today so the 9 questions can be tuned to them.
- Confirm the Najwa Arabic licence allows web embedding.
- Check the Netlify site settings: "Base directory" must be empty now that the project is at the repo root.
- Confirm you hold the rights to the four planet images carried over from the old site (Earth, Mars, the violet planet, the Moon). Jupiter and Saturn are NASA/JPL public-domain images.
- Fill in `src/config/site.ts`: WhatsApp number, phone, hours, reply-time promise, social links.
- Supply when ready: real contact details, case studies with measured numbers, client logos with permission, team names and photos, "from" prices.
