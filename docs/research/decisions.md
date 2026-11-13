# Decisions agreed with the owner

Date: 13 November 2026. Where a research report disagrees with this file, this file wins.

| Topic | Decision | Note |
|---|---|---|
| Foundation | Astro 7 (static) + React islands, Tailwind v4, GSAP / Motion, R3F where needed, Netlify | Changed from Next.js after the UI/UX agent's recommendation |
| Language | English default + full Arabic (RTL). Routes `/en/...` and `/ar/...`, English slugs in both | The UI/UX report suggested Arabic first; the owner chose English default |
| Colours | Black `#0A0A0A`, white, champagne gold `#C5A463` at 3-5% of the screen. No blue, no purple | |
| Fonts | Playfair Display, Montserrat, Najwa Arabic (Arabic headings), IBM Plex Sans Arabic (Arabic body and UI) | Owner checks Najwa's web licence. Swappable in one line |
| Services | AI Agents, Automation, Websites & Web Apps, ERP Systems, SaaS Products, Branding | 6 services, one per corner of the logo hexagon. The reports assumed 5 |
| Pages | Home, Services + 6 detail pages, Work + case-study template, Process, About, Contact, 404 | Insights, Trust, Privacy, Careers: not in this round |
| Content | Templates with sample content flagged `draft: true`, shown in dev and preview only | Production shows honest empty states, never invented numbers |
| Contact details | Placeholders in `src/config/site.ts` | Owner fills in later |
| Contact form | Netlify Forms (honeypot + AJAX) | Can be wired to n8n by webhook later |
| Motion level | Calm luxury, 80% clarity and proof / 20% signature moments | One "wow" per page that explains the offer |
| Signature moments | Eclipse language switch, Launch on form submit, Baghdad from orbit (cobe), first-visit logo preloader, moon cursor (desktop only) | "Mission Control" AI assistant is a later phase |
| Hero | Pending: chosen after the visual prototypes | Options A (logo comes alive), B (refined star cloud), C (planet made of gold stars) |
| Services section | Pending: chosen after the visual prototypes | Options A (hexagon orbit), B (scrolling planet cards), C (bento grid) |
| Old site | Preserved in git history at commit `01b0769` (local tag `v1-legacy`), then removed from the working tree | |

## Open items for the owner
- Confirm the Najwa Arabic licence allows web embedding.
- Clear "Base directory = portfolio" in the Netlify site settings once the new project is at the repo root.
- Supply when ready: real contact details, case studies with measured numbers, client logos with permission, team names and photos, "from" prices.
