---
name: deck
description: Build beautiful, on-brand, single-file HTML presentations (decks) for clients and the user's own company. Use when the user wants to create a presentation, pitch deck, talk slides, client deck, or HTML slides — from a topic, an outline, rough notes, or finished copy. Works collaboratively: makes a few example slides from the input first, then builds the deck together slide by slide (not one-shot, no full storyline locked upfront). Distinctive, headline-driven, fixed 16:9 stage, with a live edit panel, presenter mode, and PDF export. Triggers: "build a deck", "maak een deck", "presentatie", "pitch deck", "slides voor [klant]", "/deck".
---

# Deck — beautiful HTML presentations

Build **zero-dependency, single-file HTML decks** that run in any browser, look genuinely designed (never "AI slop"), and carry a strict house discipline. One source file holds all CSS + JS inline. Slides are authored on a fixed **1920×1080 stage** scaled as a whole to the viewport.

This skill is the distilled best of the whole HTML-deck field, rebuilt to one standard. Its identity is **discipline**: headline-only slides, no slide numbers, no colored card edges, sourced content only — plus a per-deck design direction, a critique gate, presenter mode, and PDF export.

---

## Core principles

1. **Single file, zero dependencies.** All CSS/JS inline. Fonts from Google Fonts / Fontshare via `<link>`. No build step, no npm. Portable and emailable.
2. **Fixed 16:9 stage (NON-NEGOTIABLE).** Author every slide at 1920×1080; scale the whole stage to fit, letterbox/pillarbox. Never reflow slide content per device. Makes layout predictable and PDF exact. See `references/viewport-base.css`.
3. **Distinctive, not generic.** Commit to one bold aesthetic direction. Avoid the AI-slop defaults (see hard rules + `references/anti-slop-checklist.md`).
4. **Brand-true.** Every deck is either **client-branded** (palette/type/logo derived from the client) or **house brand** (the user's own tokens in `references/brand-house.md`). Ask which at runtime.
5. **Verify before deliver.** Run the critique + anti-slop gate, then screenshot-verify. Quality is a pass, not a hope.
6. **Alive and visual.** Every deck has a signature motif and at least one ambient animation rooted in the brand or topic, uses real imagery where the topic benefits, and shapes its cards to the deck (not one default rounded box on every slide). A clean-but-flat deck is a failed deck. See `references/motion.md`.

---

## Hard rules (house style — these OVERRIDE any template or direction)

These are non-negotiable. Every other deck skill in the field violates at least one of these by default; these rules are what make these decks look designed.

- **Headline only.** No ledes (the descriptive line under a title), no eyebrows/kickers (small label above a title), no subheads. Each slide's headline carries the meaning. If a borrowed layout ships an eyebrow/lede, strip it.
- **No all-caps tracked add-on labels — anywhere. (The #1 slop tell.)** Ban every decorative mini-label set in `text-transform: uppercase` + wide `letter-spacing`, in ALL its disguises:
  - an eyebrow above a title;
  - a "section label" like `WHERE TO SLEEP`;
  - a dot- or plus-separated row like `NOVEMBER · A FRIENDS' ITINERARY` or `ICONS · BEACH · SAMBA · TRAILS`;
  - a "contents / topics / what's inside" teaser row (especially on the cover);
  - a tag / chip / pill on a card like `BUDGET + LIVELY` or `SAFE + CALM`.
  If such a label feels necessary, it almost never is — delete it and let the heading, number, or content speak. (Only genuinely *functional* micro-text may remain — e.g. a chart's axis unit — and even then prefer sentence case, small, minimal.)
- **Cover = title only.** The title slide is the deck title, nothing more. Optionally a quiet date / author / client name as plain **sentence-case** text, small and low-emphasis — never a tracked uppercase row, never a dotted topic teaser, never a "what's inside" list.
- **Cards are not the default container.** Do NOT wrap everything in cards. Most slides should be **type + space** — a headline and a few lines, set with hierarchy and air. Reach for a card only to group genuinely distinct, comparable items (e.g. 3 options side by side), and never on consecutive slides. If every slide is a grid of boxes, the deck has failed. See `references/cards.md` ("When NOT to use a card").
- **No slide numbering on slides.** No `01 / 02`, no "Page 3 / 12" printed on the slide content. The deck shell may show a position dot-nav as chrome, but numbers never live on the slide.
- **No colored line/bar on card borders.** Never a colored top-stripe or left-rule as a card's edge. Color lives in the *fill*, not the border. Use the card recipes in `references/cards.md`.
- **Dark/light rhythm.** Cover + chapter dividers are DARK; content slides are LIGHT. A dark slide announces a new part; light slides are the content. (A chosen all-dark or all-light direction may override this — confirm with the user.)
- **No em dashes in slide prose.** The em-dash (`—`) is reserved for the bullet marker *only*. Inside any sentence — headline, body, caption, speaker note — use a comma, colon, or period instead. (En-dashes in number ranges like `R$10–15` or `Dec–Feb` are fine.)
- **Sourced + stop-slop prose.** Only claims you can ground. Assertive, concrete, plain. Banned: corporate filler, hedging, and AI tells — `it's not just X, it's Y`; `in today's fast-paced world`; `whether you're A or B`; `unlock / elevate / seamless / robust / leverage`; rule-of-three padding; needless adverbs. Write copy first-time-clean, then run the stop-slop pass in step 4, quality.
- **Distinctive type.** Never Inter / Roboto / Arial / system fonts as a *display* face. Never converge on Space Grotesk across decks. Pair a characterful display font with a clean body font.
- **Bullets are never plain `•`.** Use an em-dash, a custom geometric marker, or a mono glyph in the deck's accent.

---

## How it works — two modes

**First, detect the mode** (and confirm in one line before proceeding):
- **Explainer mode** — the deck's job is to *explain a hard, strategic topic* the user brings material for. The content architecture is the hard part, so you **plan a storyline first, get it approved, then build.** Jump to "Explainer mode — storyline first" below (`references/explainer.md`).
- **Default (brand / known-content) mode** — everything else: a brand or client deck, a pitch, content the user already has shaped. You do NOT plan the storyline upfront — sample the look, then co-build. The default flow follows.

If it's genuinely unclear which, ask.

### Default mode — sample first, then co-build

**Collaborative, not one-shot.** Do NOT plan the whole storyline upfront or generate a finished deck in one go. From whatever input the user gives, make **a few example slides**, get their reaction, then grow the deck **with them, slide by slide**. The outline emerges as you go — their call, not a plan you lock in advance. (This is the default; **explainer mode is the deliberate exception** — it plans the storyline first, because there the hard part is the breakdown, not the look.)

The one thing you *do* settle early is the **design system** (so slides stay consistent). Everything else is emergent.

### 1. Start light
Quick, low-friction. Infer what you can from the input; ask only what you genuinely need — usually just:
- **Brand** — client-branded or house brand? (the runtime fork)
- **Density** — speaker-led (big type, few words) or reading-first (denser)? Infer from context if obvious.
Take whatever material the user brings (a topic, rough notes, a doc) — you do **not** need the full story to start.

### 2. Make a few example slides (the first move)
Build a **small sample — a cover + 2–3 representative content slides** — in one design direction. This locks the **look**, not the storyline: tokens, type, ambient motion, imagery approach, plus three brand-derived signatures:
- the **logo motif** — a shape lifted from the client's own logo (a ring, a cut-out letter, an angle), enlarged and animated behind every slide, plus an animated logo reveal on the cover (`references/logo-motif.md`);
- a **brand-styled icon set** — icons drawn to echo the brand's stroke, corners, and geometry, not a stock pack (`references/icons.md`);
- **only if the deck genuinely needs cards**, one **dedicated card shape** with a subtle non-square deviation (`references/cards.md`) — cards stay the exception, not the default.
Set up: **Client-branded →** run style discovery (`references/style-discovery.md`, 3 previews opened in the browser), ingest brand, extract the logo shape, and **download the client's website images** for use across slides (`references/brand-ingestion.md`, `references/logo-motif.md`); **House brand →** house tokens (`references/brand-house.md`). Read `references/design-directions.md` for the recipe library, `references/motion.md` for the signature visual + animation.
- Build the sample on the scaffold (`references/scaffold.html` + full `references/viewport-base.css`) as **one real deck file** that we'll keep growing — not throwaway previews.
- **Open it, and ask the user what they think.** Adjust the look and approach until it's right. Stop here — do not expand to a full deck.

### 3. Co-build, slide by slide
From the agreed sample, grow the deck as the user directs — a few slides at a time. Add, revise, reorder, rewrite, or drop slides on request. Keep appending into the same file.
Every new slide reuses the established system and obeys the house rules automatically: headline-only (no eyebrows/ledes/labels/numbers), varied card forms (`references/cards.md`), **header-top layout** (the headline pins to the top of every content slide; wrap the rest in `.slide-body` so the content is vertically centered in the space beneath — even sparse slides keep the header up top, never the whole block floating in the middle), **subtle ambient background motion behind content**, inline-SVG charts (`references/charts.md`), **animated strategic visuals** where a concept needs explaining — **invent a fresh representation each time** (cutaway, exploded 3D build, orbit, tree, generated render with animated hotspots, map, morph…), never default to the same boxes-and-arrows flow; diverge on three ideas first and the visual's own motion carries the story (`references/diagrams.md`), bespoke icons (`references/icons.md`), your components (`references/components.md`), no em dashes, sourced copy. Pull a narrative shape from `references/narrative.md` only if the user wants help structuring — never impose one.

### 4. Quality as you go
Don't save it all for the end. On each new/changed slide, apply `references/anti-slop-checklist.md` (house rules + slop), stop-slop the prose (zero em dashes in sentences; invoke the `stop-slop` skill if available), and screenshot-verify non-trivial layouts (`scripts/export-pdf.sh` render or Preview/Playwright — check 16:9, overflow, overlap, contrast). Run the deeper `references/critique.md` pass on request or before a big share.

### 5. Deliver anytime
The deck is always live: `open` it whenever. It ships with the design/edit panel (fonts, accent, text size; click any text to edit; autosaves), presenter mode (`S`), **top-to-bottom navigation** (scroll or ↓/↑; a dot-column on the right shows position), and print. Offer **PDF export** (`references/pdf-export.md` / `scripts/export-pdf.sh`) whenever the user wants a file. Clean up `.deck/previews/` if style discovery created any.

---

### Explainer mode — storyline first (for hard topics the user brings material for)

When you detect a complex topic to *explain*, switch to `references/explainer.md`. In short:
1. **Confirm** the mode. The user supplies the material — no auto-research; sourced only.
2. **Frame** lightly: audience + expertise, the one walk-away, the known-hard parts.
3. **Decompose → editable storyboard.** Break the idea into **one point per slide** (3 bullets each + a proposed visual), built up with **no forward references**. Write it to `<deck>-storyboard.md` and **stop for approval — build nothing until the user approves.**
4. **Pick the look per deck** (bespoke via `style-discovery.md`, or house brand) + a through-line visual metaphor that evolves across the deck.
5. **Build against the locked storyboard** — each concept slide a **fresh strategic visual** (`references/diagrams.md`, never repeat a family, never the default flowchart), header-top, one point per slide, beats (question / statement / dark divider) for rhythm.
6. **Gate + deliver** as usual (critique incl. the explainer lens, anti-slop, stop-slop, screenshot-verify, PDF).

---

## Reference files

| File | Read when |
|------|-----------|
| `references/viewport-base.css` | Steps 2 and 3, build — include its full contents in every deck |
| `references/scaffold.html` | Steps 2 and 3, build — the single-file shell (stage, nav, design panel, autosave, presenter, print) |
| `references/explainer.md` | Explainer mode — decompose a hard topic into a storyline-first, one-point-per-slide storyboard (approval gate before building) |
| `references/narrative.md` | Step 3, co-build — deck structures + copy formulas (ledes stripped) |
| `references/style-discovery.md` | Step 2, sample slides — the 3-direction "show, don't tell" flow |
| `references/design-directions.md` | Step 2, sample slides — the recipe library (each with a `forbidden` list) |
| `references/brand-house.md` | Step 2, sample slides — house brand tokens (sets itself up from the user's website on first run) |
| `references/brand-ingestion.md` | Step 2, sample slides — fetch client logo + palette |
| `references/cards.md` | Steps 2 and 3, build — the 6 non-slop card recipes (no colored edge) |
| `references/charts.md` | Steps 2 and 3, build — inline-SVG charts & diagrams (data) |
| `references/diagrams.md` | Steps 2 and 3, build — strategic schematic diagrams whose intrinsic animation tells the story (journeys, systems, loops) |
| `references/components.md` | Steps 2 and 3, build — funnel, persona, timeline, big-number, two-col, mockups |
| `references/motion.md` | Sample step — signature visual, ambient animation, imagery (required, rooted in brand/topic) |
| `references/logo-motif.md` | Sample step — extract a shape from the client's logo as the deck's animated visual signature |
| `references/icons.md` | Sample step — brand-styled animated icon set |
| `references/critique.md` | Step 4, quality — the 5-dimension critique loop |
| `references/anti-slop-checklist.md` | Step 4, quality — the pre-delivery quality gate |
| `references/pdf-export.md` | Step 5, deliver — HTML → PDF |
| `scripts/export-pdf.sh` | Step 5, deliver — Playwright PDF export |

---

## Lineage

Rebuilt fresh from a full study of the HTML-deck field. Code in `references/viewport-base.css` and `scripts/export-pdf.sh` is adapted from the MIT-licensed `frontend-slides` (see THIRD_PARTY_NOTICES.md in the repo root). Other ideas adapted (not copied) from MIT-licensed `frontend-slides` & `beautiful-html-templates` (Zara Zhang), `huashu-design` (alchaincyf), `html-ppt-skill` (lewislulu), `Akxan/ppt-agent-skill`; and from Anthropic's `frontend-design` and `pptx` skills. AGPL/unlicensed skills (guizang, slide-creator) informed ideas only. Backbone and the live design panel come from Paul van Schie's own client decks.
