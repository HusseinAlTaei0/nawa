# Award-site benchmark: research and playbook for NAWA

> Report by the `awwwards-analyst` agent, 13 November 2026.

## Scope and method

The agent picked 15 sites in three groups: space and "world-building" winners, top creative studios, and premium AI/tech companies. Every award below was confirmed on an Awwwards site page or the Awwwards Sites of the Year list, on the Webby page, or in the studio's own published statement, and the source is named. Design tokens (fonts, sizes, colours) for Linear, Lusion, Unseen and Anthropic were pulled from the live CSS. Layout and IA notes come from the live pages. Motion and WebGL notes come from published case studies, because the agent could not render WebGL itself. Active Theory sent the crawler a "Your browser is not supported" page, which is a finding in itself.

**Seed ideas dropped or only mentioned in passing:**
- **Dogstudio:** the only Awwwards entry for its own site is a 2011 Honorable Mention. Its KIKK Festival 2016 project was a Site of the Year.
- **Resn** (KPR, SOTY 2022) and **Locomotive** (Pangram Pangram, SOTY 2021): verified on the SOTY list, not analysed.
- **Obys, 14islands, OpenAI:** no awards could be verified, so they were left out.
- **GSAP showcase:** the page currently lists small portfolios with no space or agency relevance.
- **Godly, Lapa Ninja, SiteInspire:** not searched.

---

## Part 1: Site-by-site analysis

### A. Space, cosmic and world-building

**1. Messenger, by abeto** (https://messenger.abeto.co)
- **Awards:** Listed on the Awwwards Sites of the Year page for 2025. Third parties (Digidop, dappasol) say it is the Developer Site of the Year. Site of the Day on 10 Nov 2025 (7.92). Dev Award 8.21: Animations 9.0, WPO 8.8, Accessibility 7.6.
- **Layout and type:** The whole site is a game on one tiny planet that you can walk all the way around, with about seven places on it. The UI is built in WebGL. Glyphs are generated with WebAssembly and rendered straight on the GPU. The HUD is minimal. There is no text chat, only 3D emoji.
- **Colour and light:** The Awwwards palette has only two colours (#81BFBC, #C9D5C3). Every colour in the game comes from one 16×16 px texture atlas, so changing the lighting or mood is a single swap.
- **Motion:** An over-the-shoulder "smart camera" follows you automatically. You steer with one finger on mobile or the mouse on desktop. Gravity pulls toward the planet's core.
- **3D and performance:** A custom LOD system with 4 levels, built to avoid visible popping. Assets are tracked and freed the moment they are unused, so iOS Safari doesn't kill the page for memory. Custom tools split and compress models and textures.
- **Psychology:** The tone is "calm but a little weird," with no hand-holding and about 15 minutes of play. A small planet is a whole world you can take in at a glance, so cognitive load stays low and curiosity stays high.
- **Steal this:** Treat NAWA as one small, complete planet the visitor can turn around. Also copy the palette-atlas idea: drive every scene colour from one token texture, so a section can shift from "night" to "gold hour" with a single uniform.

**2. Igloo Inc, by abeto × Bureaux** (https://www.igloo.inc)
- **Awards:** Awwwards SOTY 2024, on the SOTY list. abeto publicly announced both Site of the Year and Developer Site of the Year. Site of the Day on 23 Jul 2024 (7.92). Dev 7.66: Animations 9.6, Accessibility 6.6.
- **Layout:** Only three sections plus a footer: an intro scene, a portfolio where each company is its own ice block, and a links section with an interactive particle simulation.
- **Colour:** Two cold greys (#b6bac5, #383e4e). Because there is no hue, the material (ice) carries the luxury.
- **Motion:** Scene transitions mix chromatic aberration, "tech displacement" and frost. Text scrambles and glitches are done in a WebGL shader by shifting the offset of an SDF texture, which avoids DOM reflow.
- **3D and performance:** A custom crystal-growth algorithm (built with Houdini). A custom VDB exporter compresses volume data to below the size of a typical image. Textures load and shaders compile in the background. The intro is animated in-engine rather than shipped as video.
- **Sound:** Music and effects are tied to particle movement.
- **Psychology:** Showing each company as a precious, crafted object signals value without saying it. Three sections means there is almost nothing to decide.
- **Steal this:** Give each case study its own celestial material (ice moon, gold planet, gas giant) so the work reads as precious objects, not tiles.

**3. Star Atlas, by Hello Monday / DEPT®** (staratlas.com; the live site may differ from the 2021 awarded version)
- **Awards:** Awwwards SOTY 2021 (Users' Choice, per DEPT). 2022 Webby People's Voice in Entertainment.
- **Colour:** Deliberately "colorful and light to move away from the traditionally dark sci-fi aesthetic."
- **3D:** Ships and planets are rendered as star-like point clouds. A custom shader adds a cheap animated depth of field, and models are compressed with Draco. Stack: Three.js, GSAP, Cinema4D.
- **Hero:** A "galactic portal" that pulls the visitor in.
- **Psychology:** Breaking the genre's expectations makes the site memorable. When the medium (points of light) is also the metaphor (stars), the craft reads as intelligent rather than decorative.
- **Steal this:** Render NAWA's 3D objects (the planet, the logo, client "worlds") as gold point clouds, so everything is literally made of stars. It is abstract, cheap on the GPU, and avoids cartoon planets.

**4. NASA's Eyes on the Solar System, by NASA/JPL** (https://eyes.nasa.gov/apps/solar-system/)
- **Awards:** None verified for this app. A sibling JPL product, Eyes on the Earth, won a 2013 Webby.
- **What it is:** Fully browser-based since 2022 with no install. It includes 126 spacecraft and guided stories (Artemis I, Perseverance's landing, Voyager's Grand Tour). Desktop uses keyboard rotate/pan/zoom; mobile uses touch and pinch. An August 2026 update added full Mars terrain and a free-fly mode.
- **Psychology:** Authority comes from real data. Two depths of engagement work well: a guided story for the casual visitor and free exploration for the curious.
- **Steal this:** Offer two modes, "Guided tour" (a 45–60 s scripted camera path through the services) and "Explore" (free orbit). Use scientific labelling: thin uppercase labels with hairline leader lines.

**5. Bruno Simon portfolio** (https://bruno-simon.com)
- **Awards:** Awwwards SOTY 2019 for the earlier version. The new version was Site of the Day on 21 Jan 2026 (8.11) with a Dev Award (Accessibility 6.6). Tags: Three.js, GSAP, WebGL.
- **Psychology:** Play is the proof of skill, and hidden discoveries create a reward loop.
- **Steal this:** Add one or two hidden rewards as a bonus, never as the main path. For example, clicking the logo five times assembles the NAWA constellation.

### B. Creative studios

**6. Lusion** (https://lusion.co)
- **Awards:** Lusion v3 was Awwwards SOTY 2023 and Developer SOTY 2023. Lusion states on Codrops that its studio site won Site of the Year from FWA, Awwwards and CSSDA. Its Spaace project (with plan8) was Site of the Day on 24 Jun 2024.
- **Type and tokens:** A single family, Aeonik. h1 is about 48px and body about 16.8px. Fully pill-shaped buttons and a 4px spacing base.
- **IA:**
  - Hero statement plus "scroll to explore."
  - "Bold Ideas, Brought to Life," with "Our Approach" and "Play Reel."
  - Featured Work: 12 projects with letter-scramble titles.
  - Philosophy section.
  - Big closing CTA: "Is your big idea ready to go wild? Let's work together!"
  - Footer with separate *hello@* and *business@* emails and a link to the R&D Labs site.
  - A PLAY/MUTE sound toggle.
- **Psychology:** No logo wall; the work is the proof. Separating "new business" from general enquiries quietly signals a professional sales process.
- **Steal this:** Split contact into General and New Business routes. Add a "NAWA Labs" link for AI experiments, which is strong authority for an AI agency.

**7. Active Theory** (https://activetheory.net)
- **Awards:** v6 was Site of the Day on 6 Feb 2024 (7.95). Dev 7.92: Animations 9.6, Accessibility 6.4. The v4 site was Awwwards SOTY 2018.
- **Prometheus Fuels**, the studio's project for a client: SOTY 2021 and Site of the Day on 4 May 2021 (8.4, Creativity 8.94). It is a "stylized interactive story" that explains making fuel from air, a deep-tech idea explained through WebGL storytelling.
- **v6:** Awwwards describes it as adding "new rendering techniques, AI chat and multiplayer."
- **Caution:** The crawler got a "Your browser is not supported" wall. Hard gates can lose crawlers, link previews and some real users.
- **Steal this:** For an AI agency, the website should itself be a demo, so put a real bilingual AI assistant inside the experience. Do not copy the unsupported-browser wall.

**8. Immersive Garden** (https://immersive-g.com)
- **Awards:** Awwwards SOTY 2018 (Orano), 2017 (The New Mobile Workforce) and 2012 (Blacknegative). Masar Destination, a Saudi Arabian destination, was Site of the Day on 26 Oct 2022 (7.74, palette #d6d5cf / #1d434f). OMEGA Space Sustainability received an Honorable Mention on 22 Jun 2023.
- **IA:**
  - Hero: "Innovative digital experiences studio."
  - One long statement sentence.
  - "Our approach" and "Our mission."
  - A project list in the format *Client \ Type* plus one line of outcome (Louis Vuitton, Cartier, Dior, Longines, Omega, Masar).
  - "Click to enable sound."
- **Psychology:** Borrowed prestige from luxury houses builds authority. Masar proves a Gulf client can carry world-class WebGL, a useful local-relevance precedent for NAWA.
- **Steal this:** Use the "Client \ Type — one-line outcome" list format. It is elegant, scannable and good for SEO.

**9. Unseen Studio** (https://unseen.co)
- **Awards:** Site of the Day on 6 Feb 2023 (7.99) and Dev Award 7.86. Its own metadata claims "Design Studio of the Year – Awwwards" (self-reported, not checked).
- **Type:** Neue Montreal for body (about 19px) and Saol Display serif for display (h2 about 115px). This is the closest analogue to NAWA's Playfair + Montserrat pairing, with a display-to-body ratio of about 6:1.
- **Colour:** The Awwwards palette is #EDC1CB plus #000: one accent on black.
- **Steal this:** Very large serif display set against small, airy sans body copy. That contrast is what makes it feel "editorial luxury."

**10. Lando Norris, by OFF+BRAND** (https://landonorris.com)
- **Awards:** Awwwards Site of the Year 2025 (SOTY list). Site of the Day on 17 Nov 2025 (8.18, Creativity 8.71). Dev 7.58, Accessibility 7.0. Tags: WebGL, GSAP, Webflow.
- **Colour:** #D2FF00 lime plus #111112 near-black. One electric accent, rationed, and taken from his actual helmet.
- **3D:** A real-time helmet hero. A third-party breakdown says it is Three.js rendering a glTF model with PBR maps.
- **Results:** OFF+BRAND told Codrops the hero concept had "the biggest impact we'd ever seen" and became a meme that people widely recreated.
- **Steal this:** Derive the accent from a real brand artefact (NAWA's gold orbit ring). Design one hero concept distinctive enough that people screenshot and share it.

### C. Premium AI and tech

**11. Linear** (https://linear.app; no award verified)
- **Tokens:** Inter plus Berkeley Mono. h1 64px, h2 48px, body 15px. 4px spacing base. Background #08090A, secondary text #8A8F98, light pill button on dark.
- **IA:**
  - Hero: "The product development system for teams and agents."
  - Four feature chapters, each with sub-feature tabs and "Learn more →."
  - A changelog strip.
  - Testimonials (OpenAI, Ramp, Opendoor) plus "50,000+ product teams."
  - Closing line: "Built for the future. Available today."
- **Psychology:** Low energy, high confidence. The product UI is the hero. The changelog proves momentum.
- **Steal this:** Add a "Lab notes / Shipped this month" strip for NAWA. Keep headlines pure white and body text grey, so white means "important."

**12. Stripe** (https://stripe.com; Stripe Sessions 2024 got an Awwwards Honorable Mention on 22 Mar 2024)
- **Hero:** "Financial infrastructure to grow your revenue." with "Get started" and "Sign up with Google."
- **Signature:** An animated WebGL gradient. Third-party reverse engineering says it is built on a small wrapper called "minigl," and community posts note its battery cost.
- **Proof:** A stats band (135+, $1.9T, 99.999%, 200M+), a logo wall, and customer stories that each carry a metric.
- **Steal this:** A band of four hard numbers, plus one ambient shader that *is* the brand (a slow gold orbit-light), with a static fallback image.

**13. Next.js Conf, by Vercel / basement studio** (https://nextjs.org/conf)
- **Awards:** Site of the Day on 16 Sep 2024 (7.4), Dev 7.52.
- **Discipline:** The palette is a single accent (#0057FF).
- **Steal this:** A one-accent system holds up even on a loud event page.

**14. Anthropic** (https://www.anthropic.com; no award verified)
- **Tokens:** Custom serif headings with a custom sans body. Ivory #FAF9F5 background, #141413 text, body about 22px, h2 about 80px.
- **Psychology:** An AI company that chose warmth, a serif and paper tones over sci-fi. That reads as safety and judgement rather than hype.
- **Steal this:** Generous body size (20–22px) and editorial serif headlines make AI feel humane. NAWA's Playfair can do the same job on black.

**15. Apple product pages** (https://www.apple.com; no award)
- **Technique:** Scroll-scrubbed canvas image sequences, as on the AirPods Pro page. They load lighter sequences or a single fallback image on some devices.
- **Steal this:** On mobile, use a pre-rendered planet image sequence (AVIF/WebP frames) instead of real-time 3D. It looks identical and costs far less.

---

## Part 2: Cross-site patterns

**What the scores reveal.** These are the Awwwards jury subscores collected:

| Site | Usability | Creativity | Dev: Animations | Dev: Accessibility |
|---|---|---|---|---|
| Igloo Inc | 7.50 | 8.31 | 9.6 | 6.6 |
| Messenger | 7.46 | 8.23 | 9.0 | 7.6 |
| Lando Norris | 7.90 | 8.71 | 8.6 | 7.0 |
| Bruno Simon 2026 | 7.83 | 8.62 | 8.6 | 6.6 |
| Active Theory v6 | 7.29 | 8.68 | 9.6 | 6.4 |
| Masar Destination | 7.42 | 8.04 | 9.0 | 6.4 |
| Prometheus Fuels | 7.77 | 8.94 | 9.0 | 7.2 |

In every case Creativity is the highest SOTD subscore and Usability the lowest. Animations is always the highest dev subscore and Accessibility always the lowest. Awwwards weights Design 40%, Usability 30%, Creativity 20%, Content 10%.

The lesson: award winners are rewarded for spectacle, and they consistently underperform on accessibility and usability. A B2B agency can match the craft and beat them on clarity. That is both a business advantage and a way to stand out.

**What winners consistently do:**
1. **One idea, executed totally.** Messenger is one planet, Igloo is ice, Star Atlas is points of light, Lando is the helmet. The best ones make the medium the metaphor.
2. **Palettes of two colours, sometimes three.** Every Awwwards palette collected has one to three colours, almost always a near-black or neutral plus one accent. NAWA's black / white / gold already fits this.
3. **Custom tooling and performance craft are part of the art.** Compressed volumes, LOD, memory management, shaders compiled in the background.
4. **Continuity instead of cuts.** Transitions are scene morphs (frost, displacement, camera moves), never hard page swaps.
5. **Sound as a layer.** Always off by default, with a visible toggle (Lusion, Immersive Garden, Igloo).
6. **Few sections.** Igloo has three. Lusion's homepage has six.
7. **Proof through the work.** The studios show work or famous clients. The tech companies show numbers, logos and quotes.

**What separates Site-of-the-Year level from merely "pretty":** "Pretty" is effects without an idea: template parallax, generic particles, inconsistent easing. SOTY level means:
- a concept you can say in one sentence;
- a single material world;
- motion with one coherent personality;
- micro-craft (text scramble, cursor, sound);
- a technical story behind it.

For a B2B site, add one more layer the winners mostly skip: the spectacle must *explain the offer*.

---

## Part 3: Psychology playbook for a premium B2B AI agency in Iraq and MENA

**The first 5 seconds.** The visitor must learn three things before any spectacle finishes: *who you are* (an AI agency in Baghdad), *what you do* (agents, automation, systems), and *that you are serious* (calm, high-craft visuals). Calm luxury signals competence. Loud neon, glitch and crypto aesthetics signal risk to conservative enterprise and government buyers. So take Igloo's craft without its crypto tone.

**Trust in a relationship-driven market** (a cultural judgement, not measured data):
- Show real founder and team faces with names and titles.
- Give a physical Baghdad address, a local phone number and WhatsApp.
- Show Iraqi and MENA client logos and sectors.
- Write Arabic copy natively; never ship it as a translation afterthought.
- Address data security and privacy openly (where data lives, who can access it).
- Show your process step by step, with engagement models.

**Authority:**
- Case studies in the form Problem → System → Result, with a number.
- An Arabic-language "Labs" or insights stream on applied AI. Arabic thought leadership is scarce, so it differentiates.
- Real partner badges only.

**How much spectacle: roughly 80/20.** About 80% of the scroll should be clarity and proof, and 20% signature moments. Allow one "wow" per page, and make it carry information: the orbit shows how the services connect. Design for mid-range Android phones and inconsistent mobile networks. That is a working assumption, not a measured figure, so check it against NAWA's analytics.

**Curiosity and reward loops:**
- Progressive disclosure: hovering a star reveals a metric, and clicking opens the case.
- A guided tour versus free exploration (the NASA pattern).
- One hidden reward.

Each reward should give the visitor information, not just decoration.

**Managing cognitive load:**
- At most 5 services.
- One primary CTA label site-wide.
- Persistent, conventional navigation. The winners hide their nav; NAWA shouldn't.

**Emotional tone:** Slow, long easing reads as luxury, and snappy UI feedback reads as competence, so use both. Scenes breathe; buttons respond instantly. Gold should feel like candlelight, not neon.

---

## Part 4: 30 rules for NAWA's site

**Layout**
1. Use a 12-column grid. Text containers max out at 1200–1280px, and 3D canvases go full-bleed. Outer margins: `clamp(20px, 5vw, 96px)`.
2. Use an 8px spacing scale (Linear uses a 4px base). Section padding is `clamp(96px, 14vh, 200px)` on desktop and 64–80px on mobile.
3. One idea per viewport. The hero is `100svh`. At most two pinned sequences per page, each no longer than 250vh. The homepage is no more than about 9 screens.
4. Keep at least 55% negative space in every content viewport. Darkness is the luxury material.

**Typography**

5. Use Playfair Display only at 40px and above. The display range is `clamp(48px, 8vw, 128px)`, Unseen-like scale with a display-to-body ratio of about 6:1. Track it −1% to −2% at large sizes.
6. Montserrat body text is 18px desktop and 16px mobile, line-height 1.6, measure 60–72 characters. Eyebrow labels are Montserrat 12–13px uppercase with 0.16–0.2em tracking.
7. Set Najwa about 10% larger than the Latin text at the same role, with a body line-height of 1.75 and a measure of 50–65 characters. Never letter-space Arabic, because it breaks the joining. Create hierarchy with size and weight instead.
8. Keep headlines pure white (#FFFFFF) and body an off-white of about #E8E6E1 at roughly 85% visual weight. Secondary text is about #8A8A8A, as Linear does.

**Colour and light**

9. Ratio: about 85% black, 12% white, and at most 3% gold. Gold is allowed in only five places: the primary CTA, the active state, the orbit or ring highlight, key numbers, and focus rings.
10. #C5A463 on black is about 8.9:1 contrast, so it passes AAA. On white it is about 2.4:1, so it fails. Never set gold text on a light surface. For gold buttons, put black text on the gold.
11. Use near-black (#050506) rather than pure #000 for large surfaces. Allow one light source per scene, and keep gold bloom at 0.35 opacity or less. No purple nebulae and no lens flares.

**Motion**

12. Use one house curve, `cubic-bezier(0.22, 1, 0.36, 1)`, for reveals, and `expo.inOut` for scene and page transitions. Durations: micro 150–250ms, reveals 700–900ms, page transitions 900–1200ms, staggers 50–70ms.
13. The preloader must be under 2.5s perceived. It shows real progress (the orbit ring filling) and is skipped on repeat visits within a session.
14. Use Lenis smooth scroll on desktop only (lerp 0.08–0.1) and native scroll on touch. ScrollTrigger scrub is 0.6–1.
15. Show a custom cursor only on `(pointer: fine)`: an 8–10px dot with a gold ring on hover. Magnetic CTAs pull at most 10px. Restore the native cursor on inputs.
16. Under `prefers-reduced-motion`, replace scrubbed 3D with still frames and 200ms opacity fades, and turn off parallax.

**3D and space effects**

17. Use one persistent r3f canvas behind the DOM. All real text stays in the DOM for SEO, screen readers and Arabic shaping. If text must live in 3D, use a library that handles Arabic shaping and bidirectional text, and test it with Najwa.
18. Starfield: instanced points, about 3–5k on desktop and 800–1,500 on mobile. Cap device pixel ratio at [1, 2] on desktop and [1, 1.5] on mobile. Render only on demand when idle, and pause when the tab is hidden or the canvas is off-screen.
19. Build 3D objects as gold point clouds or simple spheres with a rim light, not textured photo-real planets. That is cheaper, more abstract, and more on-brand.
20. Fallback chain: no WebGL2, low device memory or the save-data setting → serve a pre-rendered image sequence or AVIF poster of the same scene. Never show an unsupported-browser wall.

**Content**

21. The hero headline is 8 words or fewer and states the offer. The subline is 20 words or fewer and names Iraq/MENA. The CTA is visible at load.
22. Put proof within the first two scrolls: client logos, a band of 3–4 hard numbers, and one named testimonial with a photo.
23. Every case study follows Problem → System → Result (with a number), in both languages.

**Conversion**

24. The header carries a persistent primary CTA ("Book a consultation" / «احجز استشارة») plus a WhatsApp button, and the CTA repeats every 2–3 screens.
25. The contact form has 5 fields or fewer, with a stated response time (for example, "Reply within 24 hours"). Split routes into New project and General enquiry, as Lusion does.

**Performance**

26. Budgets: LCP under 2.5s on 4G, INP under 200ms, initial JS under 200KB gzipped before 3D. Load the 3D chunk after LCP. Total 3D assets 3–5MB or less with Draco/Meshopt and KTX2. Degrade the scene automatically when frame rate drops below about 45fps.
27. Subset the fonts (Latin plus the Arabic ranges you use). Preload only 2 critical weights, use `font-display: swap`, and keep the total font payload at or under 150KB.

**Accessibility**

28. Target WCAG 2.2 AA, which is where the winners lose points. The canvas gets `aria-hidden` and every interactive "planet" has a real `<button>` equivalent. Focus rings are a 2px gold line with a 3px offset. Sound is off by default with a visible toggle.

**Bilingual and RTL**

29. Use `dir="rtl"` at the root and CSS logical properties only (`margin-inline-start`, `inset-inline`). In Arabic, mirror *UI flow*: progress bars, carousels, the process path, horizontal reveals. Do not mirror physical or brand objects: the logo, planet spin, star maps, or numbers inside data.
30. Use /en and /ar routes with hreflang tags. Switching language keeps the visitor's current section. Write Arabic copy natively, not as a translation. Decide once whether Arabic text uses Western or Arabic-Indic digits, and apply that choice everywhere.

---

## Part 5: Signature moments

**1. "The Held Planet" hero** (medium complexity)
On load, the hexagon orbit draws itself as an SVG stroke over about 1.2s. Then the disc resolves into a softly lit sphere with a gold rim light, held inside the hexagon, which is the logo coming alive. The starfield parallaxes by 2° or less with the cursor or device tilt. The DOM headline fades up 300ms after the ring closes. On mobile this is a 60–90 frame image sequence. The scene is the logo, so it builds brand recall from the first second.

**2. "Orbit of Services"** (medium-high)
The services orbit the NAWA planet as moons. Scrolling rotates the orbit. The front moon gets a gold ring and its one-line value proposition appears in the DOM. Clicking flies the camera into that moon (about 1s, `expo.inOut`) and transitions to the service page. Arrow keys rotate the orbit. Mobile uses a 2D SVG orbit with snap scrolling. The spatial arrangement explains that the services form one system.

**3. "Case-Study Constellations"** (medium-high)
Each project is a star, and stars are grouped into constellations by sector (Government, Finance, Retail, Health, Industry). Hovering a star shows the result metric. Filtering by sector re-forms the constellations with a 900ms morph. Clicking opens the case study, where the star expands into that project's own "world" material (the Igloo idea). An ordinary accessible list version sits underneath.

**4. "Process as Orbital Transfer"** (medium)
The process (Discover → Design → Build → Launch → Orbit/Support) is drawn as a transfer path between two orbits. A small probe travels along it as the visitor scrolls. Each burn point pins briefly (no more than 250vh total) and shows deliverables and duration. In RTL the path flows right to left. It makes an abstract process concrete and suggests precision.

**5. "Baghdad from Orbit"** (medium)
The "Where we are / Who we serve" section is a night-side Earth view centred on Mesopotamia, with city lights and the glint of the Tigris and Euphrates. Points of light mark the cities of clients across Iraq and MENA. This grounds the cosmic metaphor in place and turns local relevance into an emotional beat. If you use NASA night-light imagery, check its licence terms first.

**6. "Eclipse language switch"** (medium)
Toggling EN ↔ AR sends the gold disc across the screen like an eclipse (450–600ms). The layout mirrors while it is covered, which hides the RTL reflow that otherwise looks broken. It turns a technical necessity into a signature moment that reinforces bilingual pride.

**7. "Mission Control" AI satellite** (medium-high)
A small satellite icon opens a bilingual AI assistant (the idea from Active Theory v6's AI chat) that answers questions about services and qualifies leads, then hands off to WhatsApp or the booking flow. For an AI agency, a working agent is the most credible proof there is. Keep it fast, honest and optional.

**8. "Launch" contact** (low-medium)
On submit, the button compresses, ignites into a gold trail rising up the viewport (about 1.2s) and settles into the message: "Your mission is in orbit. We reply within 24 hours." The emotional payoff comes exactly at the conversion point.

---

## Part 6: Anti-patterns to avoid

- Preloaders longer than about 3s, or a preloader shown on every visit.
- Scroll-jacking that hides where you are or how long the page is. More than two pinned sequences.
- Real text rendered in WebGL. It hurts SEO, accessibility and Arabic shaping. Igloo and Messenger get away with it as game-like experiences; a B2B agency cannot.
- Gold text on light backgrounds, gold everywhere, and gold gradients that turn yellow-orange.
- Sci-fi clichés: purple and teal nebulae, lens flares, stock astronauts, glowing "AI brain" imagery, glitch overload.
- "Browser not supported" walls, with no fallback for weak GPUs or low-memory phones.
- A spectacular hero with no stated offer, and navigation hidden behind a hamburger on desktop.
- Sound that autoplays. A cursor that hides the native pointer on forms.
- An Arabic version that is a machine translation, a mirrored logo, or a planet spinning the wrong way because the whole canvas was flipped.
- Fake or vague metrics. Logo walls of companies you never worked with.
- Ignoring reduced-motion preferences. Shipping 10MB+ of 3D on the critical path.
- Copying a winner's look without its single idea. Pretty without meaning reads as a template.

---

## Sources

- Awwwards Sites of the Year list: https://www.awwwards.com/websites/sites_of_the_year/
- Awwwards site pages:
  - https://www.awwwards.com/sites/igloo-inc
  - https://www.awwwards.com/sites/lando-norris
  - https://www.awwwards.com/sites/messenger
  - https://www.awwwards.com/sites/brunos-portfolio
  - https://www.awwwards.com/sites/active-theory-v6
  - https://www.awwwards.com/sites/prometheus-fuels
  - https://www.awwwards.com/sites/unseen-studio
  - https://www.awwwards.com/sites/masar-destination
  - https://www.awwwards.com/sites/omega-space-sustainability
  - https://www.awwwards.com/sites/spaace
  - https://www.awwwards.com/sites/next-js-conf-1
  - https://www.awwwards.com/sites/stripe-sessions-2024
  - https://www.awwwards.com/sites/immersive-garden
  - https://www.awwwards.com/sites/dogstudio
- Case studies:
  - Igloo Inc: https://www.awwwards.com/igloo-inc-case-study.html
  - Messenger: https://www.awwwards.com/messenger.html
  - abeto's SOTY announcement: https://x.com/abeto_co/status/1900152588768579701
  - Digidop 2025 awards summary: https://www.digidop.com/blog/5-web-design-trends-2025
- Lusion on Codrops: https://tympanus.net/codrops/2026/04/13/lusion-where-digital-craft-meets-ambitious-experimentation/
- OFF+BRAND on Codrops: https://tympanus.net/codrops/2026/08/17/creativity-at-enterprise-scale-without-compromise-the-offbrand-story/
- Star Atlas:
  - https://www.webbyawards.com/crafted-with-code/star-atlas/
  - https://hellomonday.com/work/staratlas
- NASA Eyes:
  - https://www.jpl.nasa.gov/news/explore-the-solar-system-with-nasas-new-and-improved-3d-eyes/
  - https://winners.webbyawards.com/2013/websites/general-websites/science/147795/nasas-eyes-on-the-earth
- Stripe gradient: https://www.bram.us/2021/10/13/how-to-create-the-stripe-website-gradient-effect
- Apple scroll technique: https://css-tricks.com/?p=308477
- Live pages scraped: https://lusion.co, https://linear.app, https://stripe.com, https://immersive-g.com, https://unseen.co, https://www.anthropic.com, https://activetheory.net
