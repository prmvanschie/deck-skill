# Design directions — the recipe library

A curated set of distinctive, non-slop directions distilled from studying ~34 professional deck templates. Each is a **recipe, not a template**: preserve its palette, type, signature device, card style, and atmosphere; never copy demo content. Each names what it **forbids** so the look can't drift into slop.

Use these for the client-branded style-discovery (`style-discovery.md`) and for the build. You may always **design a custom direction** instead when the brief has a sharper, more specific opportunity — hold it to the same bar (committed palette, distinctive type, one signature device, a `forbidden` list).

All directions obey the house rules: headline-only, no slide numbers, no colored card edge, em-dash bullets, distinctive display type — **and no all-caps tracked add-on labels** (no eyebrows, no `SECTION LABELS`, no card tags/chips, no dotted contents rows; cover = title only).

> **On "mono chrome".** Several directions below traditionally carry a mono uppercase label layer (eyebrows, section tags, kickers). That layer is **banned** here. Where a direction mentions mono/`<em>`/markers, use the mono font *only* for the occasional genuinely functional caption (a chart axis unit) in **sentence case** — never as a decorative label, eyebrow, or tag. Hierarchy comes from size, weight, and space, not from a little tracked label.

> **Every direction needs a signature motif + one ambient animation + (where the topic benefits) imagery** — see `motion.md`. Pick the device from the direction's "Signature" line and make it move subtly and repeat. Shape cards to the direction (see `cards.md` "Shape cards to the deck"); don't reuse one rounded box everywhere.

---

### Editorial Serif (warm, authored, considered)
- **Scheme:** light, warm paper.
- **Palette:** paper `#f2eedf`, ink `#2a241b`, one warm accent (terracotta `#c1502e` or forest `#2e4a2a`).
- **Type:** display serif at **weight 500 with optical-size axis** (Fraunces / Source Serif 4 / Cormorant), negative tracking; body Work Sans / DM Sans; mono chrome.
- **Signature:** `<em>` switches to display-italic in the accent; a 36px accent rule binding a line to its headline (used sparingly, not as an eyebrow).
- **Cards:** soft-paper (#2) or tinted fill (#1).
- **Atmosphere:** flat warm field; depth from hairlines + a faint oversized ghost numeral/letter at ~6% opacity.
- **Forbidden:** sans display, neon, drop shadows everywhere, colored card edges, kickers.

### Swiss / International (precise, data-confident)
- **Scheme:** light (paper `#fafaf8`) or dark; **one** anchor accent only (IKB `#002FA7`, safety-orange `#FF6B35`, or lemon `#FFD500` on black).
- **Type:** sans only (a grotesk). The **inverse-weight law**: bigger = thinner (≥8vw → weight 200; 16px → 500). Headline:body ratio ≥ 8:1.
- **Signature:** visible 12-col grid logic; 1px hairline dividers only ("the hairline is a scalpel"); KPI "data hero" at 18–22% of slide width.
- **Cards:** flat fill or outline (#1 minus shadow); right angles, no radius.
- **Atmosphere:** flat; structure is the design. Optional faint grid tone.
- **Forbidden:** serifs, gradients, shadows, border-radius, multiple accents, centered body text.

### Bold Poster (loud, quotable, few words)
- **Scheme:** light with red/dark full-bleed panels; OR dark.
- **Palette:** paper `#fff` / ink `#1c1410` / one hot accent (`#d8000f`).
- **Type:** a heavy display (Shrikhand / Archivo Black / Bebas), occasionally rotated −6°; literary serif or grotesk body.
- **Signature:** tilted oversized display as the movement; decreasing-opacity stacked text-shadow on display over a same-hue panel (printed-press misregister).
- **Cards:** minimal; surface inversion (full-bleed accent or dark panels) does the work.
- **Atmosphere:** structural, not decorative.
- **Forbidden:** dense paragraphs, busy grids, soft pastel, colored card edges.

### Dark Tech (premium, product, confident)
- **Scheme:** dark. Bg `#050b1f → #0a1f3d`; accent cyan/indigo (`#22D3EE` / `#6366f1`).
- **Type:** Inter Tight / Clash display + Newsreader italic for `<em>` + JetBrains Mono chrome; tight display tracking (−0.045em).
- **Signature:** grid-dot texture (~1.5% opacity) + L-shaped corner lines + one off-center aurora glow.
- **Cards:** tinted fill (#1) on dark, or glass (#3) over the glow.
- **Atmosphere:** lit radial gradient + faint grid + grain.
- **Forbidden:** gradient blocks, leaf/organic decor, macaron candy colors, serif-magazine feel, colored card edges.

### Warm Paper (human, friendly, hospitality)
- **Scheme:** light, single warm ink (rust `#b53d2a`) on cream `#faf1e2`.
- **Type:** condensed grotesk display (Big Shoulders Display / Barlow Condensed) + a friendly serif/sans body; opacity-only hierarchy.
- **Signature:** **single-ink + opacity-only** system (100/78/50/32% alpha) — screen-print authority; 4px radial-dot riso paper texture.
- **Cards:** outline only (1.5px ink), solid/dashed internal divider rhythm.
- **Atmosphere:** the dot texture is the atmosphere.
- **Forbidden:** multiple accents, gradients, glass, drop shadows, colored card edges.

### Neo-Brutalist (graphic, scrappy-confident)
- **Scheme:** light; warm white + black + 1–2 pale accent **fills** (never as text).
- **Type:** heavy grotesk (Archivo Black / Space Grotesk 900) uppercase; mono labels.
- **Signature:** borders ARE the layout (3px ink, gapless cells); hard-offset shadow (#4); intentional ±2° tilt on some cards.
- **Cards:** hard-offset sticker (#4).
- **Atmosphere:** flat; oversized low-opacity numerals as wallpaper behind content.
- **Forbidden:** soft shadows, gradients, glass, pastel-as-text, colored *edge* accent (use ink borders + fills).

### Quiet Premium (board, investor, institutional)
- **Scheme:** mixed — navy `#1c2644` dark surfaces + bone `#f0ece3` light; single muted-gold accent `#c8a870`.
- **Type:** editorial serif (Source Serif 4) headlines + DM Sans body + IBM Plex Mono chrome; `<em>` = italic serif gold.
- **Signature:** restraint; vary the *surface* (navy↔bone) instead of adding a second color; near-invisible 80px grid on dark slides.
- **Cards:** flat + hairline (#1 without shadow).
- **Atmosphere:** sober; low density.
- **Forbidden:** hot colors, fast motion, playful shapes, dense clutter, colored card edges.

### Magazine (cultural, expressive, art-direction)
- **Scheme:** mixed tri-tone (e.g. burgundy `#7a1f35` + dusty pink `#f2b6c6` + mustard cream).
- **Type:** grotesk display (Familjen Grotesk / Schibsted Grotesk) with `<em>` → an italic serif such as Newsreader. New sections are announced by a dark chapter slide (the rhythm), not by a `§` or label marker.
- **Signature:** the `<em>` font-switch; alias-as-role discipline (≤3 hex values exposed as `--ink`/`--surface`/`--accent`).
- **Cards:** alternating fill inversion (surface↔accent), soft-but-geometric radius.
- **Atmosphere:** solid color-block sections; whispered low-opacity dividers.
- **Forbidden:** neutral greys, timid evenly-weighted palette, colored card edges, eyebrows.

---

## Atmosphere snippets (drop-in, theme-aware)
```css
/* grain — warms any flat surface (multiply on light, screen on dark) */
.grain::after{content:"";position:absolute;inset:0;pointer-events:none;opacity:.04;mix-blend-mode:multiply;
 background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E");}
/* lit radial — turns a flat dark slide into lit material */
.lit{background:radial-gradient(ellipse 90% 70% at 30% 30%, color-mix(in srgb,var(--accent) 12%, var(--slide-dark)), var(--slide-dark) 60%);}
/* graph-paper tone */
.grid-tone{background-image:linear-gradient(color-mix(in srgb,var(--ink) 8%, transparent) 1px,transparent 1px),
 linear-gradient(90deg,color-mix(in srgb,var(--ink) 8%, transparent) 1px,transparent 1px);background-size:40px 40px;}
```
