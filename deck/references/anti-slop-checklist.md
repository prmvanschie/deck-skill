# Anti-slop checklist — the pre-delivery gate

Run this before showing the user any deck. Treat it as a **bug hunt**: assume there are problems; if you found none, you didn't look hard enough. It has four parts: the hard rules (house identity), the general anti-slop gate (field-wide), prose, and extra checks for explainer decks.

## Part 1 — Hard rules (NON-NEGOTIABLE)

- [ ] **Headline only** — no ledes (descriptive line under a title), no eyebrows/kickers (small label above a title), no subheads. Grep the markup for stray label rows above headings and remove them.
- [ ] **No all-caps tracked add-on labels — anywhere.** Grep the markup for `text-transform: uppercase` / `letter-spacing` on slide content and kill the decorative ones: eyebrows, `SECTION LABELS`, dot/plus-separated rows (`NOVEMBER · …`, `BUDGET + LIVELY`), contents/topics teasers, card tags/chips/pills. If you see ALL-CAPS letter-spaced text that isn't a functional chart unit, delete it.
- [ ] **Cover = title only** — the title slide has the deck title and at most a quiet sentence-case date/author/client. No eyebrow, no tagline row, no dotted topic teaser, no "what's inside" list.
- [ ] **Cards not overused** — scan every slide: is it a card just because? Most slides should be type + space. Cards only for genuinely comparable grouped items, never on back-to-back slides. If >half the slides are box-grids, redesign.
- [ ] **No slide numbers on slides** — no `01 / 02`, no "Page N / M" in slide content. (Dot-nav chrome is fine.)
- [ ] **No colored line/bar on a card border** — no colored top-stripe, no colored left-rule as a card edge. Color is in the *fill*. (See `cards.md`.)
- [ ] **Dark/light rhythm** — cover + chapter dividers dark, content slides light (unless an all-dark/all-light direction was chosen with the user).
- [ ] **Sourced + stop-slop** — every claim is grounded; tone is assertive and concrete; no corporate filler, no "in today's fast-paced world", no em-dash-itis.
- [ ] **Bullets are never plain `•`** — em-dash / mono glyph / custom marker.

## Part 2 — General anti-slop gate

- [ ] **Display font is NOT** Inter / Roboto / Arial / system-ui, and not one of the converged AI picks (Space Grotesk, Bricolage Grotesque, Instrument Serif) unless the brand uses it. Client decks: the display font is the brand's own font or a named substitute for it, recorded in the deck's head comment.
- [ ] **No purple-gradient-on-white.** Specifically ban `linear-gradient(135deg,#667eea,#764ba2)` on a light bg — the single most overused AI pattern. No generic indigo `#6366f1` as the whole identity.
- [ ] **Shadows have hierarchy** — a small/medium/large system, not one drop-shadow on everything. Depth is applied with intent (see `cards.md`).
- [ ] **All colors are CSS variables** — no raw hex scattered in rules; everything reads `var(--…)` so the design panel + theme switch work.
- [ ] **Type scale via variables** — at least 3 clearly distinct text sizes; a real hierarchy (title ≥ ~2.5× body). Squint test: one clear focal point per slide.
- [ ] **Signature motif present + repeated** — one visual device rooted in the brand/topic, recurring across slides (not decoration-by-default).
- [ ] **At least one ambient animation** rooted in the brand/topic (drift, breathing light, parallax, self-draw, count-up) — the deck is not visually static. Reduced-motion safe.
- [ ] **Strategic visuals are invented, not default flowcharts** — each concept slide uses a *different* representation family (cutaway / orbit / tree / 3D render / map / morph…), no two diagram slides look alike, the metaphor is rooted in the subject, and it isn't a repeat of the last deck's. (See `diagrams.md` — diverge on three first.)
- [ ] **Every slide has subtle ambient background motion** behind content (not just the hero) — low-contrast, readable.
- [ ] **Header-top layout** — the headline sits at the TOP of every content slide; the content below is vertically centered in the remaining space (via `.slide-body`). Not the whole block centered, and not content stuck at the very top with a dead bottom.
- [ ] **Top-to-bottom navigation** — the deck advances vertically (scroll / ↓↑), with a dot-column on the right, not a horizontal bottom row.
- [ ] **Logo motif present** (client-branded) — a shape lifted from the logo, enlarged + animated behind slides; cover has an animated logo reveal.
- [ ] **Icons echo the brand** — stroke/corners/geometry match the logo, not a stock line-icon pack.
- [ ] **Cards used sparingly** — and if used, ONE dedicated non-square card shape (subtle corner/notch/asymmetric-radius, not circular), no coloured edge, **no numbering**.
- [ ] **Imagery where the topic benefits** (travel/place/people/product) — cohesively treated to the palette, never raw clashing stock; not just the cover.
- [ ] **Cards are not all the same box** — card form/radius varies and fits the brand/topic; fact rows often better as hairline bands than identical tinted boxes.
- [ ] **Background has depth** — gradient mesh, grain, graph-paper tone, or atmospheric glow where the direction calls for it; not a flat solid unless the direction is deliberately flat (Swiss/editorial).
- [ ] **Contrast passes WCAG AA (4.5:1)** for body text. Saturated accents often fail as text — lighten for text use.
- [ ] **`prefers-reduced-motion` honored** (already in `viewport-base.css` — confirm it's included).
- [ ] **No leftover placeholder or raw-markup text** — grep for `lorem`, `REPLACE-ME`, `goes here`, `xxxx`, and stray source syntax rendered on a slide: `[[`, `]]` (wikilinks), unrendered `**bold**`, `##`, or instruction/comment text. None of that belongs on a slide.
- [ ] **`SAVE_KEY` is deck-specific** (not the scaffold default).

## Part 3 — Prose (stop-slop)

Read **every word** of slide copy *and speaker notes*. The em dash is the most common miss — hunt it specifically.

- [ ] **Zero em dashes in sentences.** Grep the file for `—`; the only allowed hit is the bullet marker (`.li::before { content: "—" }`). Every em dash inside a headline, body line, caption, or note → replace with a comma, colon, or period. (En-dashes in ranges `R$10–15`, `Dec–Feb`, `8–12` are fine.)
- [ ] **No AI tells / filler:** `it's not just X, it's Y`; `in today's fast-paced world`; `whether you're A or B`; `unlock`, `elevate`, `seamless`, `robust`, `leverage`, `dive in`, `at the end of the day`; rule-of-three padding; needless adverbs (`truly`, `simply`, `really`).
- [ ] **Headlines are assertions**, not noun-phrase labels ("Our approach" → a claim).
- [ ] **Sourced** — every number/claim is grounded, or marked "estimate".
- [ ] **Run the `stop-slop` skill** on the deck's text if available, for the full rubric; otherwise apply its rules by hand.

## Part 4 — Explainer decks (if applicable)

- [ ] **Storyboard was approved before building** — the `<deck>-storyboard.md` was written and okayed; the build follows it, not an emergent outline.
- [ ] **Exactly one point per slide** — no slide carries two ideas.
- [ ] **No forward references** — each slide rests only on ideas already shown; the thesis lands by the end.
- [ ] **Every concept has a distinct fresh visual** — no two concept slides share a `diagrams.md` family; no default flowchart.
- [ ] **5-second test** — a smart newcomer grasps each slide fast; it's interesting (curiosity gap / analogy / "so what" beats), not a flat fact list.

## Slop fingerprints to catch

- Gradient orbs / blurred color blobs as the only "design".
- Identical card grids on every slide (vary cards, callouts, big-number, two-col).
- Everything centered; generic hero with centered title + subtitle + two pill buttons.
- Glassmorphism over a flat background (glass only reads over a non-flat bg).
- A colored bar under every title (Anthropic's own pptx skill: *"NEVER use accent lines under titles"*).

If any box fails, fix it and re-run the affected slides before delivery.
