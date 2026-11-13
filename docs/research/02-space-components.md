# Space-themed UI components for NAWA

> Report by the `space-component-scout` agent, 13 November 2026.
> CodePen, uiverse.io, Mobbin and the Codrops hub pages returned 403 to the agent, and Dribbble returned an empty page.
> For those, descriptions come from search snippets. For React Bits, Magic UI and Aceternity the agent checked the actual
> registry source, so dependency and reduced-motion notes are confirmed. Bundle sizes are gzip figures from bundlephobia.

Two things to know before adopting anything:
- **Licences.** React Bits is "MIT + Commons Clause": you can use it in the site but not resell the components. Magic UI is MIT. Aceternity's licence allows use in end products but not redistribution. Shadertoy shaders default to CC BY-NC-SA unless the author says otherwise, so treat them as reference only.
- **Gold in WebGL units.** `#C5A463` = `[0.773, 0.643, 0.388]`.

---

## 1. Background starfields / star dust / parallax

**1.1 React Bits – Galaxy** — https://reactbits.dev/backgrounds/galaxy
- **Tech:** raw WebGL fragment shader, no dependencies.
- **Props:** `starColors`, `density`, `twinkleIntensity`, `rotationSpeed`, `speed`, `mouseRepulsion`, `clickWarp`, `intro`, `transparent`, `dpr`, `disableAnimation`.
- **Built-in:** respects `prefers-reduced-motion`, caps DPR at 2, pauses when off-screen or the tab is hidden.
- **Cost:** medium (full-screen shader). On mobile set `dpr={1}` and low density.
- **RTL:** no issues.
- **Adapt:** `starColors={['#fff','#fff','#E9DFC8','#C5A463']}`, speed about 0.2, glow low, repulsion off on touch. Use as the **Home hero** background only. `clickWarp` doubles as a warp accent.

**1.2 Aceternity – Stars Background** (paired with Shooting Stars) — https://ui.aceternity.com/components/shooting-stars-and-stars-background
- **Tech:** Canvas2D twinkle, no dependencies.
- **Props:** `starDensity` (0.00015), `allStarsTwinkle`, `twinkleProbability`, `min/maxTwinkleSpeed`.
- **Cost:** low. It does **not** handle reduced motion or off-screen pausing, so you'd add both.
- **Adapt:** halve the density and set twinkle probability to about 0.3. Good candidate for the **site-wide fixed layer**.

**1.3 SmoothUI – Gravity Stars** (Edu Calvo) — https://21st.dev/@educalvolpz/components/gravity-stars
- **Tech:** canvas with faint constellation links and a pointer "gravity well". Depends on `motion` (already in your stack). MIT.
- **Cost:** low–medium.
- **Adapt:** gold links at 15% opacity. Fits the **Contact/CTA** section ("pulled into orbit").

**1.4 Nebula Space Background** (Haim Repael Azoulay) — https://21st.dev/@1haim/components/nebula-space-background.md
- **Tech:** WebGL, no dependencies, MIT. It drifts for up to 60 seconds, then rests, leaving only a low-rate twinkle, so the GPU is nearly idle after that. That's the right pattern for mid-range phones.
- **Adapt:** near-black base with a faint warm tint. Fits behind **About / manifesto**.

**1.5 Pure-CSS box-shadow parallax stars**
- https://codepen.io/d3vsh4/pen/LMYLYp ("Parallax Pixel Stars", three layers at different speeds)
- https://codepen.io/ArneSava/pen/BaWxOaR (`translateZ` depth)
- **Tech:** CSS/SCSS. CodePen public pens default to MIT.
- **Cost:** low, but huge `box-shadow` lists cost paint on Android. Bake them into a tiling SVG or PNG instead.
- **Adapt:** use as the **first-paint / SSR / reduced-motion fallback** under any WebGL layer.

**1.6 drei `<Stars>`** — https://drei.docs.pmnd.rs/staging/stars
- **Tech:** shader points with `radius`, `depth`, `count`, `factor`, `saturation={0}`, `fade`. MIT.
- **Cost:** low, but only worth it inside an R3F canvas you already have.

## 2. Galaxies & milky-way bands

**2.1 Three.js Journey "Galaxy Generator"**
- Lesson (paywalled): https://threejs-journey.com/lessons/galaxy-generator
- MIT open-source port: https://awesome.ecosyste.ms/projects/github.com%2Falvarosabu%2Fthreejs-galaxy-generator
- Shader-animated follow-up lesson: https://www.threejs-journey.com/lessons/animated-galaxy
- **Tech:** BufferGeometry points with branches, spin and randomness. It ports easily to R3F.
- **Cost:** medium at about 50k points. Use 15–20k on mobile.
- **Adapt:** gold core fading to white-grey arms, rotating very slowly. Fits the **About/Vision** section or the end of the scroll journey.

**2.2 Codrops – "Creating a Particles Galaxy with Three.js"** (Viverse recreation, 2022) — https://tympanus.net/codrops/2022/06/21/creating-a-particles-galaxy-with-three-js
- **Tech:** Three.js points with custom shaders. Check the licence of each demo.
- **Cost:** medium–high. Use it as a reference for camera framing and particle shading.

**2.3 shadcn.io – Galaxy** (WebGL2 disc with dust lanes) — https://www.shadcn.io/background/galaxy
- **Also:** Spiral Galaxy Shader (WebGPU, about 50 KB runtime) — https://www.shadcn.io/shaders/spiral-galaxy-shader
- The code is **Pro-only (paywalled)**, and I saw no licence stated.
- **Why it's listed:** it's the best model of responsible shader behaviour. It draws only on-screen, lowers its own resolution when frames run long, shows one still frame under reduced motion, and has a CSS fallback.
- It also warns that white text over the bright bulge drops to about 3:1 contrast. Copy the pattern, not the code.

**2.4 Shadertoy – "Star Nest" by Kali** — https://www.shadertoy.com/view/XlfGRj
- **Tech:** volumetric GLSL. Licence is ambiguous: ports say MIT, Shadertoy's default is CC BY-NC-SA.
- **Cost:** high on mobile (iterative volumetric loop). Use only as a still-frame or desktop reference.

## 3. Planets, ringed planets, orbit systems

**3.1 Magic UI – Orbiting Circles** — https://magicui.design/docs/components/orbiting-circles
- **Tech:** CSS keyframes (rotate → translate → counter-rotate) plus an SVG hairline path. No JS animation. MIT.
- **Props:** `radius`, `duration`, `speed`, `reverse`, `path`, `iconSize`.
- **Catch:** the registry code uses Tailwind v4 syntax (`size-(--icon-size)`, an `@theme` keyframe). Move the keyframe into `tailwind.config` for Tailwind 3.
- **Adapt:** change the stroke to gold at 25% opacity and 0.5px, and put service icons in as moons. Fits **Services** ("our stack in orbit"). For RTL, consider reversing the direction.

**3.2 React Bits – Orbit Images** — https://reactbits.dev/animations/orbit-images
- **Tech:** items orbit along any SVG path, including tilted ellipses. No dependencies. Respects reduced motion and pauses off-screen.
- **Adapt:** client logos on a tilted ellipse that slows on hover. Fits **Clients / Work**.

**3.3 uiverse – CSS solar-system loader** (00Kubi) — https://uiverse.io/00Kubi/wise-walrus-39
- **Tech:** pure CSS with 1px `rgba(255,255,255,.1)` orbits and rotate/translate keyframes. uiverse posts are MIT.
- **Adapt:** strip the colours to white discs with one gold planet. Good base for the **preloader / 404**.

**3.4 CodePen – modern-CSS solar system** (Eric Ros) — https://codepen.io/ekros/pen/rNbGebK
- **Tech:** `sin()`/`cos()`, `@property`, `pi` for elliptical orbits.
- **Alt:** time-scaled orbits — https://codepen.io/kowlor/pen/ZYYQoy
- **Adapt:** an **orbit navigation hub** where each planet links to a service page. Needs a recent Chromium WebView for trig functions.

**3.5 3D ringed planet (R3F)**
- three.js Saturn reference: https://codepen.io/prisoner849/pen/oNwaNqz
- Fresnel rim glow: ektogamat fake-glow-material-r3f (MIT) — https://awesome.ecosyste.ms/projects/github.com%2Fektogamat%2Ffake-glow-material-r3f
- **Cost:** medium–high (three + R3F ≈ 237 KB gzip).
- **Adapt:** a matte-black sphere with a thin gold fresnel rim and a 1px ring is **your logo in 3D** ("planet held in orbit"). Desktop hero accent only.

**3.6 21st.dev – Orbital Hero Section** (Yura Dubinin) — https://21st.dev/@yura/components/orbital-hero-section
- MIT, with orbits based on real J2000 elements and Kepler's laws. The helical trails are busy, so take the restraint idea, not the visuals.

## 4. Shooting stars / meteors / comets

**4.1 Aceternity – Shooting Stars** (same URL as 1.2)
- **Tech:** SVG, no dependencies.
- **Props:** `minSpeed`/`maxSpeed`, `minDelay`/`maxDelay` (4200–8700 ms), `starColor`/`trailColor` gradient.
- **Adapt:** white head, gold-to-transparent trail, delay **15–30 s**. Mirror the angle in RTL.

**4.2 Magic UI – Meteors** — https://magicui.design/docs/components/meteors
- **Tech:** CSS keyframes. Props: `number`, `angle` (215°), delay and duration ranges. MIT.
- **Catch:** uses Tailwind v4 classes, and positions are computed from `window.innerWidth` instead of the container.
- **Adapt:** at most 3 meteors, inside **cards** rather than full-screen.

**4.3 CodePen – Yusuke Nakaya meteor shower** (SCSS) — https://codepen.io/YusukeNakaya/pen/abNdeOj
- Pure CSS with nth-child random delays. Good for a zero-JS fallback.

**4.4 Canvas starfield + shooting stars in one loop** — https://dev.to/usman_awan/how-i-built-a-grok-inspired-starfield-shooting-stars-using-html-canvas-3872
- One requestAnimationFrame loop for both effects is cheaper than separate layers. Worth copying the architecture.

**4.5 drei `<Trail>`** — https://drei.docs.pmnd.rs/misc/trail-use-trail
- For a comet inside an R3F scene.

## 5. Orbit-ring / magnetic / "planet" buttons

**5.1 React Bits – Star Border** — https://reactbits.dev/animations/star-border
- **Tech:** Canvas2D. A star travels the outline of a pill or card with a trail. No dependencies, reduced motion respected.
- **Props:** `color`, `trailColor`, `thickness`, `trailLength`, `sparkle`, `direction`, `hover:'lap'`, `clickPulse`.
- **Catch:** one canvas per button, so limit it to **one primary CTA**.
- **Adapt:** gold star, `hover="lap"` = "a satellite circles your CTA".

**5.2 React Bits – Magnet** — https://reactbits.dev/animations/magnet
- Spring physics, no dependencies. It's automatically disabled under reduced motion and when there's no fine pointer. Wrap planet buttons with low strength.

**5.3 Magic UI – Border Beam** — https://magicui.design/docs/components/border-beam
- Uses `motion`. A gold beam on the **featured contact or pricing card**.

**5.4 Framer – Magic Orbit Button** (free, Framer-only) — https://www.framer.com/marketplace/components/magic-orbit-button/
- Interaction reference only.

**5.5 CodePen – jh3y hover/focus orbit button** — https://codepen.io/jh3y/pen/eYPYKep
- From the snippet: it triggers on `:is(:hover, :focus-visible)`, so keyboard users get the same effect. That's the right accessibility pattern.

**Recipe for the NAWA planet button:** a 1px gold SVG ring plus a solid disc. The disc scales from 0.55 to 0.7 on hover or focus-visible. A 4px moon orbits with `animation-play-state: paused` until engaged. Animate transform only. Total cost: about 0 KB.

## 6. Space heroes & scroll "journeys"

**6.1 Codrops – "How to Build Cinematic 3D Scroll Experiences with GSAP"** (Nov 2025) — https://tympanus.net/codrops/2025/11/19/how-to-build-cinematic-3d-scroll-experiences-with-gsap/
- **Tech:** ScrollTrigger scrubbing a Three.js camera through "chapters".
- **Adapt:** a Home journey of Baghdad/Earth → orbit → galaxy (services) → warp to contact.

**6.2 Codrops – Blender camera path + GSAP** (Jul 2026) — https://tympanus.net/codrops/2026/07/07/building-a-scroll-driven-3d-gallery-using-a-blender-camera-path-with-three-js-and-gsap/
- An authored flight path. More controlled than a procedural one.

**6.3 drei `ScrollControls`** — https://drei.docs.pmnd.rs/controls/scroll-controls
- Keeps the journey in one canvas, but it hijacks scrolling. Native scroll plus ScrollTrigger is more accessible.

**6.4 jh3y – hold-to-jump hyperspace** — https://codepen.io/jh3y/pen/RmZLXp
- Canvas plus a GSAP-tweened speed. Simpler reference: https://www.kirupa.com/animations/animated_3d_starfield_effect.htm
- **Adapt:** a ≤600 ms warp on the contact CTA, falling back to a fade under reduced motion.

**6.5 React Bits – Lightfall** — https://reactbits.dev/backgrounds/lightfall
- Streaks bend into warp trails on hold. No dependencies. Use for a section transition.
- Avoid **Hyperspeed** (pulls in three, highway visuals).

**6.6 21st.dev – Comet Hero Section** — https://21st.dev/@rhllom/components/comet-hero-section
- framer-motion: planet, asteroids, comet cursor. Licence unknown, so inspiration only.

## 7. Cards / bento / spotlight borders

**7.1 React Bits – Spotlight Card** — https://reactbits.dev/components/spotlight-card
- No dependencies. The spotlight spills onto neighbouring cards. The loop stops when idle, and reduced motion is respected. Gold spotlight at 12% opacity.

**7.2 React Bits – Magic Bento** — https://reactbits.dev/components/magic-bento
- **Dependencies:** Hugeicons.
- **Props:** `glowColor`, `enableStars`, `particleCount`, `enableSpotlight`, `enableBorderGlow`, `enableTilt`, `enableMagnetism`, `disableAnimations`.
- **Adapt:** turn off tilt and magnetism, keep 4–6 stars. Fits **Services bento**.

**7.3 Aceternity – Glowing Effect** (Cursor-style border) — https://ui.aceternity.com/components/glowing-effect
- **Props:** `blur`, `spread`, `proximity`, `borderWidth`, `disabled`.
- Recolour the gradient to gold and white.

**7.4 Magic UI – Magic Card** — https://magicui.design/docs/components/magic-card
- Gradient spotlight border, uses `motion`.

**7.5 Aceternity – Glowing Stars card** — https://ui.aceternity.com/components/glowing-stars-effect
- A dot grid that lights up on hover, like a "constellation card".

**Warning:** Aceternity **Card Spotlight** (https://ui.aceternity.com/components/card-spotlight) pulls in `canvas-reveal-effect`, which depends on `@react-three/fiber` and three, so each card gets its own WebGL context. Avoid it in grids.

## 8. Text effects (Arabic and RTL)

**The rule:** splitting text into characters breaks Arabic letter joining. In Arabic, animate by **word or line only**, or use effects that never split the text.

**8.1 GSAP SplitText + `splitArabicText` helper** — https://gsap.com/docs/v3/HelperFunctions/helpers/splitArabicText (demo: https://codepen.io/GreenSock/pen/WbojPLO)
- It inserts Zero-Width Joiners using a hard-coded list of non-joining letters plus lam-alef. Test it against Najwa's ligatures.
- GSAP, including SplitText and DrawSVG, has been free under its standard licence since Apr 2025 (https://gsap.com/community/standard-license/).

**8.2 React Bits – Split Text** — https://reactbits.dev/text-animations/split-text
- GSAP-based, respects reduced motion. Use chars for EN, `words`/`lines` for AR.

**8.3 Magic UI – Text Animate** — https://magicui.design/docs/components/text-animate
- Animates by `word`, `line` or `character`. AR-safe with `by="word"`/`"line"`.
- Alt: Motion Primitives Text Effect (MIT) — https://21st.dev/@ibelick/components/text-effect

**8.4 React Bits – Shiny Text** — https://reactbits.dev/text-animations/shiny-text
- A light sweep over the whole string with **no splitting, so it's Arabic-safe**. Triggers on view, hover or loop.
- **Adapt:** one champagne sheen across Playfair and Najwa headings on view. Reverse the sweep in RTL.

**8.5 Scramble / decrypt**
- React Bits Decrypted Text — https://reactbits.dev/text-animations/decrypted-text
- Magic UI Hyper Text — https://magicui.design/docs/components/hyper-text
- Use them for **EN labels and numbers only**. In AR they produce disjoint glyphs and bidi jumps. Keep the final text in an `aria-label`.

**8.6 Constellation-line text:** I found nothing ready-made.
- **Recipe:** sample points from text drawn on an offscreen canvas (approach: https://codepen.io/ziiw/pen/VYjeggY), then connect them (https://npmjs.com/package/constellation-sketcher).
- For Arabic, run `document.fonts.load('… Najwa')` first and set canvas `direction='rtl'`.
- Bake "NAWA / نوى" to a static SVG at build time and animate the stroke-dashoffset. Zero runtime cost.

## 9. Globes & maps (Baghdad → MENA)

**9.1 cobe v2** — https://github.com/shuding/cobe
- **Size and licence:** 5.8 KB gzip, MIT.
- **Features:** markers, **arcs** (`arcColor`, `arcWidth`, `arcHeight`), DOM-bound labels via CSS Anchor Positioning, and a `--cobe-visible-{id}` variable for hiding labels behind the globe.
- **Adapt:** `dark:1`, `baseColor:[.1,.1,.1]`, gold markers and arcs. Baghdad at [33.31, 44.36] with arcs to Erbil, Basra, Amman, Riyadh, Dubai, Cairo, Istanbul.
- Pause `onRender` when off-screen. Anchor-positioned labels need a fallback on older Android WebViews.

**9.2 Magic UI – Globe** — https://magicui.design/docs/components/globe
- A cobe wrapper, but it pins `cobe@^0.6.4`, which predates the arcs and DOM-marker features. Bump it or use cobe directly.

**9.3 Magic UI – Dotted Map** — https://magicui.design/docs/components/dotted-map
- `svg-dotted-map` (13.7 KB gzip), with `markers` and `markerColor` (default orange, change to gold). A light 2D option for mobile.

**9.4 Aceternity – World Map** — https://ui.aceternity.com/components/world-map
- SVG dots plus animated arcs via `motion`, with a `dots` prop of from/to pairs.
- **Catch:** its `dotted-map` dependency is **145 KB gzip**. Generate the SVG at build time instead. Never mirror maps in RTL.

**9.5 react-globe.gl** — https://github.com/vasturiano/react-globe.gl
- MIT and powerful, but **about 500 KB gzip**. Avoid.

## 10. Preloaders, page transitions, cursors

**10.1 Logo preloader with GSAP DrawSVG or CSS dashoffset**
- Draw the hexagon outline, then fill the disc. Zero extra KB if done in CSS.
- First visit only, ≤1.2 s, skipped when assets are cached.

**10.2 LottieFiles orbit loaders** (Lottie Simple License)
- "Planet Orbit" (dotLottie 13.4 KB) — https://lottiefiles.com/fr/free-animation/planet-orbit-C1U2GdiJmS
- "Calm Orbit Lens Loader" (7.2 KB) — https://lottiefiles.com/fr/free-animation/calm-orbit-lens-loader-0RmCUm3FrS
- **Catch:** the player costs about 32 KB gzip. Only worth it if you need Lottie elsewhere.

**10.3 View Transitions circular reveal ("the planet expands")**
- Pen: https://codepen.io/ajv/pen/ByoOWdM
- React/Next guide: https://rebeccamdeprey.com/blog/view-transition-api
- Motion example: https://motion.dev/examples/react-animate-view-clip-path
- **Adapt:** a gold `clip-path: circle()` grows from the clicked planet button into the next route. Crossfade under reduced motion.

**10.4 Cursors**
- Magic UI Smooth Cursor (https://magicui.design/docs/components/smooth-cursor) **hides the native cursor**, so avoid it.
- React Bits Target Cursor (https://reactbits.dev/animations/target-cursor) has an off-brand sci-fi reticle.
- **Recommended:** keep the native cursor and add a 6px "moon" follower with a 1px gold ring. Only on `(pointer:fine) and (prefers-reduced-motion:no-preference)`, with `aria-hidden` and `pointer-events:none`. It grows around interactive elements.

---

## Top 20 shortlist

| # | Component | Cat. | Source | Cost | Where |
|---|---|---|---|---|---|
| 1 | Galaxy (starColors, dpr, reduced-motion built in) | 1 | React Bits | Med | Home hero |
| 2 | cobe v2 with arcs | 9 | GitHub | Low | Baghdad→MENA |
| 3 | Orbiting Circles (port to TW3) | 3 | Magic UI | Low | Services, logo lockups |
| 4 | Custom planet button + Magnet | 5 | Recipe + React Bits | Low | All CTAs |
| 5 | Shooting Stars (sparse, gold trail) | 4 | Aceternity | Low | Global layer |
| 6 | Stars Background (canvas) | 1 | Aceternity | Low | Global layer |
| 7 | Shiny Text (Arabic-safe) | 8 | React Bits | Low | Headings EN/AR |
| 8 | Text Animate by word/line | 8 | Magic UI | Low | Body reveals EN/AR |
| 9 | Spotlight Card | 7 | React Bits | Low | Services, Work |
| 10 | Star Border (1 CTA only) | 5 | React Bits | Low | Hero CTA |
| 11 | View-Transition circular reveal | 10 | Pattern | Low | Route changes |
| 12 | Logo DrawSVG preloader | 10 | GSAP | Low | First visit |
| 13 | Orbit Images (elliptical) | 3 | React Bits | Low | Clients |
| 14 | Galaxy Generator port (R3F) | 2 | 3JS Journey / MIT port | Med | About finale (desktop) |
| 15 | GSAP Cinematic 3D scroll | 6 | Codrops | High | Home journey (desktop) |
| 16 | Glowing Effect border | 7 | Aceternity | Low | Featured cards |
| 17 | Dotted Map (svg-dotted-map) | 9 | Magic UI | Low | Mobile globe fallback |
| 18 | Nebula Space Background (rests after 60 s) | 1 | 21st.dev | Med→Low | About |
| 19 | CSS solar-system loader | 3 | uiverse | Low | 404 / loading |
| 20 | Fresnel ringed planet (R3F) | 3 | three.js + ektogamat | High | Desktop hero accent |

## Recommended "space layer" kit

1. **Global sky:** a baked SVG/PNG star tile for SSR and the fallback, plus Aceternity Stars Background at low density.
2. **Hero galaxy:** React Bits Galaxy, lazy-loaded, desktop and high-tier devices only. Mobile keeps the global sky.
3. **Rare meteor:** Aceternity Shooting Stars, one at a time, every 15–30 s.
4. **Orbit system:** Magic UI Orbiting Circles restyled as gold hairline rings. This is the brand's signature motif.
5. **Planet button:** the custom button plus React Bits Magnet, with Star Border on one CTA.
6. **Cards:** React Bits Spotlight Card with a gold spotlight, and Glowing Effect on one featured card.
7. **Text:** Shiny Text and Text Animate (word/line). Character splitting in EN only.
8. **Globe:** cobe Baghdad arcs, with Dotted Map on low-end devices.
9. **Transitions:** View-Transition gold circle reveal and the logo preloader.

**Performance budget**
- **WebGL:** at most **one active WebGL context in view**. Mount and unmount Galaxy, cobe and any R3F scene with IntersectionObserver, or share a single R3F canvas via drei `<View>`.
- **Frame loops:** pause requestAnimationFrame off-screen and on `visibilitychange`.
- **Resolution:** cap DPR at 1.5 on mobile. Use drei `PerformanceMonitor`/`AdaptiveDpr` where R3F is used.
- **Tiers:** if `Save-Data`, effective connection 2g/3g, or `deviceMemory ≤ 4` → CSS-only tier with no WebGL.
- **Reduced motion:** a static frame everywhere. This is built into React Bits; Aceternity and Magic UI need it added.
- **JS:** keep the space layer under about 40 KB gzip beyond `motion` (which you already ship) and GSAP (27 KB). three/R3F (about 237 KB) goes in a desktop-only lazy chunk.
- **LCP:** must be text, never a canvas.
- **Animation:** transform and opacity only. No large `filter: blur` or `backdrop-filter` over animated canvases on Android.

## Things to avoid
- Colourful NASA-style planets, purple/cyan nebula gradients (the Aceternity defaults `#9E00FF`/`#2EB9DF`), rockets, astronauts, UFOs, cartoon moons.
- Meteor showers (20+ meteors), constant warp-speed backgrounds, Hyperspeed "highway", sci-fi reticle cursors, matrix-style scrambles. These are the cheesy end of the theme.
- Heavy runtimes: Spline (about 275 KB plus the scene), react-globe.gl (about 500 KB), `@react-three/postprocessing` bloom (about 100 KB plus GPU cost), tsparticles (Aceternity Sparkles), WebGPU-only demos, Shadertoy raymarchers.
- One WebGL context per card (Aceternity Card Spotlight).
- Scroll-jacking for the journey, and replacing the native cursor.
- Per-character effects on Arabic. Mirroring maps or globes in RTL. Orbit or sweep directions that ignore `dir`.
- Gold used as fill everywhere: keep it for cores, trails and hairlines (about 5% of pixels).
- Code with "unknown" licences (many 21st.dev items), and reselling or redistributing React Bits or Aceternity code.
