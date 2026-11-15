# NAWA website — rules for every session

Read `docs/design-context.md` before any design or front-end work. It is the single source of truth for the brand, palette, motion budget and where each signature piece lives.

## Adding a new visual effect or component (owner's standing rule)
The owner often brings a component from React Bits, 21st.dev, Aceternity and similar libraries. Never paste it in as-is. Every new piece goes through the checklist in `docs/design-context.md` → "Adding a new effect". In short:

1. **Rebuild it, don't import it.** Write it from scratch for this stack (Astro + a plain TypeScript module in `src/scripts/`, Canvas 2D or CSS; WebGL only through cobe). No React, no paid-library code, no license keys.
2. **Brand first.** Only the NAWA palette (black, white/grey, gold at 3-5% of the screen). Purple, blue, pink or green in a reference are always translated to white/grey + gold. Gold is earned: use it for the moment of interaction or the focal point, not for everything.
3. **Choose the place with care, never at random.** Before writing code, decide where it goes and say why:
   - Prefer upgrading an existing piece that does the same job over adding a second one (e.g. the Globe replaced the old globe in "Made to travel").
   - One signature moment per page. Check the "Signature pieces" list and fill the page that has none, or the section whose message the effect explains.
   - The effect must explain the section's message (sunrise = a new start next to "Start a project"; orbits = "Made to travel").
4. **Performance and access.** Pause off-screen and when the tab is hidden, a single static frame when motion is off, DPR capped, `aria-hidden` on decoration, never mirror lighting or rotation in Arabic.
5. **Verify.** `npm run check`, `npm run build`, then screenshot desktop (EN) and mobile (AR) before pushing. Update the "Signature pieces" list in `docs/design-context.md`.
