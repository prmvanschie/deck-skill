# Signature visual & motion — every deck must feel alive

A deck with generic fade-ups and identical boxes is boring, even when it's clean. **Every deck carries (1) a signature visual motif and (2) at least one ambient animation — both rooted in the brand or the topic.** Not decoration for its own sake; a device that *belongs* to this subject.

This is a required output, checked in Phase 6. Tasteful and CSS-first; always respect `prefers-reduced-motion`.

## 1. Find the device (brand or topic)
Before building, name the one visual idea this deck is about:
- **Brand-rooted:** the client's logo glyph, a brand shape, a signature color behaviour, their actual UI texture (grid, dot, gradient).
- **Topic-rooted:** the subject's own iconography. Rio → the Copacabana wave-pavement, sun, horizon, mountains. Finance → ledger lines, candlesticks. A product → its real UI. A place → its skyline/landmark.

Pick ONE and repeat it: as a background motif, a section device, a divider, the way cards are shaped. Repetition is what makes it read as designed.

## 2. Motion layers
- **Ambient background on every slide** — a subtle animated layer *behind* content (z-index below the text, e.g. via `.slide::before`/`::after`): a drifting warm light/haze, a slow gradient shift, or a faint drifting motif at the foot. So no slide is ever fully static. Keep it low-contrast and slow — it must never fight the content.
- **Intrinsic diagram motion** — when a slide explains a concept (a journey, system, workflow, loop), the *diagram itself moves* to tell the story: the flow travels through the steps, the key node pulses, data runs along the links. This is meaning, not decoration — see `references/diagrams.md`. (Distinct from the ambient/background motion here; a strategic slide can have both.)
- **Entrance** (already in `viewport-base.css`): staggered `.reveal`, self-drawing `[data-draw]` icons. Use them.
- **One ambient / hero animation** that embodies the device. Examples, all CSS/JS, no libraries:
  - a **drifting motif** (waves rolling, grid panning, particles) on dark slides
  - a **rising/pulsing light** (sun-glow that breathes, gradient that shifts)
  - **parallax** between a background motif and foreground content on slide-enter
  - a **self-drawing line** that traces a route, coastline, or chart
  - a **count-up** on a hero number
- Keep it subtle and slow (6–20s loops) so it's atmosphere, not distraction. One strong moment beats five twitchy ones.

```css
/* example: slow horizontal drift for a repeating motif (e.g. the Rio wave) */
@keyframes drift { to { background-position: 1920px 0; } }
.motif-drift { animation: drift 24s linear infinite; }
@media (prefers-reduced-motion: reduce){ .motif-drift{ animation: none; } }
```

## 3. Imagery
When the topic benefits (travel, place, people, product, event), **use real imagery** — don't rely on CSS shapes alone.
- **Cohesion over stock-dump.** Images must share a treatment so the deck reads as one piece: a duotone/overlay in the palette, a consistent crop, a grain pass, or a unifying tint. Raw mismatched stock is its own kind of slop.
- **Sources:** first, **download the client's own website images** (`brand-ingestion.md`) and use the good ones — real product/team/environment shots bring a deck to life. Then generate a cohesive set with **nano-banana** or another image-generation tool, if one is available (styled to the chosen direction's palette) for a designed, on-brand look; or curated real photos for documentary subjects. Save to an `assets/` folder beside the deck (a deck + assets folder is fine; it's still portable).
- **Placement:** full-bleed hero on cover/dividers with a palette-matched gradient scrim so text stays readable; supporting images in two-column or as textured panels. Never the same image twice (except a logo).
- **Treat images as design:** `object-fit: cover`, a gradient overlay in `--slide-dark`/`--accent`, optional `mix-blend-mode` or a duotone filter to lock them to the palette.

## Don't
- ✗ float/pulse/spin with no connection to the subject (generic = slop).
- ✗ animate everything; motion on every element reads as nervous.
- ✗ drop raw stock photos that clash with the palette.
- ✗ ship a deck whose only "visual" is the title slide.
