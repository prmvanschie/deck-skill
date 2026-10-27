# Cards — non-slop recipes (NEVER a colored edge)

Hard rule: **no colored line/bar on a card's border** — no colored top-stripe, no colored left-rule. Color lives in the *fill*, the border stays monochrome (ink at low opacity) or there's no border at all. This matches the dominant convention across well-designed decks; only the slop-adjacent ones brand a card with an edge stripe.

Pick the recipe that fits the chosen direction. All pull from `var(--…)` tokens so they retheme for free. Cards are flat unless the direction is explicitly "bold" (then the hard-offset recipe). Never apply a uniform drop-shadow to everything — depth is intentional.

## When NOT to use a card (read first — cards are over-used)

A card is a container for **grouping genuinely distinct, comparable items**. It is not the default way to put content on a slide. Before wrapping anything in a card, try the slide as plain **type + space**.

- **Default to no card.** A headline + a few lines, set with real hierarchy and air, beats a box almost every time. Most content slides need zero cards.
- **One idea ≠ a card.** A single point, a quote, a stat, a paragraph — none of these is a card. Just set the type.
- **A list ≠ a row of cards.** Three sequential points are a list (em-dash markers), not three boxes.
- **Use a card only when** the slide genuinely shows 2–4 *parallel, comparable* things the eye should weigh side by side (3 neighbourhoods, 3 pricing tiers, before/after). Then the card boundary earns its place.
- **Never two card-grid slides in a row.** If consecutive slides are box grids, the deck reads as a template. Break it with a statement, big-number, chapter beat, or a plain type slide.
- **No labels on cards.** A card holds a heading (sentence case) + content. No all-caps tracked tag/chip/pill at the bottom or top (`BUDGET + LIVELY` is banned — house rule).

If more than about half the slides are card grids, stop and redesign — that's the tell of a deck that reached for boxes instead of designing.

---

## Shape cards to the deck — not one default box

The fastest way a deck looks template-made: the *same* rounded-rectangle tinted box on every slide. Vary the card's **form and radius** to the direction and topic. The recipes below are starting points, not a uniform — adapt the shape:

- **Match the brand / topic.** Echo the client's real UI radius (sharp, or pill, or 4px), or the topic's forms — a travel deck can use postcard frames, ticket stubs, luggage-tag shapes, photo borders; a Swiss deck uses hard right angles; an editorial deck often uses *no box at all* (hairline-separated columns).
- **Often, drop the box.** A row of "facts" reads better as a **hairline-divided band** (thin rules between columns, no fills) than four identical tinted boxes. Quiet/editorial directions especially.
- **Vary across the deck.** Don't reuse one card style on every slide — a stat band, a quote panel, and a comparison grid should not all be the same box.
- **Radius is a design choice per deck**, set once as `--radius` and used consistently *within* a deck — but chosen to fit (0 for Swiss/bold, large for soft/playful, pill for friendly), not defaulted to the same 16–20px every time.

### Design ONE dedicated card shape per client
When a client-branded deck does use cards, give it a **single bespoke card shape with an interesting, subtle deviation from a plain square** — used consistently across that deck so it's part of the brand system. Not a stock rounded rectangle, and **not circular**. Play with the outline:
- a **clipped/angled corner** (one corner cut at 45° — `clip-path: polygon(...)`), echoing the logo's geometry;
- a small **notch** or step in one edge;
- an **asymmetric radius** (e.g. three sharp corners, one big round — `border-radius: 2px 2px 2px 28px`);
- a shape **derived from the logo motif** (the brand's ring/angle/cut informing the card outline).
Pick one deviation, keep it tasteful and consistent. It should feel designed-for-them, not decorative-for-its-own-sake.
```css
/* examples of a subtle non-square deviation */
.card { clip-path: polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%); } /* cut top-right corner */
.card { border-radius: 3px 3px 3px 26px; }                                            /* one soft corner */
```

### Card bans (always)
- **No coloured line/bar on the border** — a coloured top-stripe or edge-rule is a hallmark AI tell. Color lives in the fill.
- **No numbering on cards.** No `01 / 02`, and preferably no numbers at all — a card almost never needs a counter. Let the heading and order speak.
- **No all-caps tracked label / eyebrow / tag / chip** on a card.

### 1. Tinted fill (premium / quiet) — default for light decks
Single accent at graded opacities; shadowless. The most portable "looks expensive" card.
```css
.card { background: var(--accent-soft, rgba(0,0,0,.04));   /* accent @ ~4–8% */
        border: 1.5px solid color-mix(in srgb, var(--accent) 20%, transparent);
        border-radius: 16px; padding: 36px; }
```
Pair with: headlines near-ink, every *number* in the accent.

### 2. Soft paper (editorial / warm)
White/cream fill, layered soft shadow, generous radius, **no border**.
```css
.card { background: #fff; border: 0; border-radius: 20px; padding: 36px;
        box-shadow: 0 18px 50px -30px rgba(20,30,80,.28), 0 2px 6px rgba(0,0,0,.04); }
```

### 3. Glassmorphism (atmospheric / gradient or image bg) — needs a non-flat background
```css
.card { background: rgba(255,255,255,.10); backdrop-filter: blur(14px);
        border: 1px solid rgba(255,255,255,.18);          /* white hairline, not accent */
        border-radius: 18px; padding: 36px;
        box-shadow: 0 8px 32px rgba(0,0,0,.18), inset 0 1px 0 rgba(255,255,255,.25); }
```
Only over a gradient/image/atmospheric bg — over flat color it reads as a plain box.

### 4. Hard-offset "sticker" (bold / brutalist) — for confident directions
Ink border + ink offset shadow, zero blur, locked to a unit; lifts on hover.
```css
.card { background: #fff; border: 3px solid var(--ink); border-radius: 0;
        box-shadow: 8px 8px 0 var(--ink); padding: 32px;
        transition: transform .12s, box-shadow .12s; }
.card:hover { transform: translate(-2px,-2px); box-shadow: 10px 10px 0 var(--ink); }
```
Coupling rule: Npx border ↔ matched Npx solid offset, always bottom-right. Border stays ink (not colored).

### 5. Offset color-slab (branded "shadow" without an edge stripe)
A solid accent rectangle sits *behind* the card — colored depth, but it's a shadow, not a border.
```css
.card { position: relative; background: #fff; border: 1.5px solid var(--ink); border-radius: 4px; padding: 32px; }
.card::before { content: ""; position: absolute; inset: 0; transform: translate(10px,10px);
               background: var(--accent); z-index: -1; }
```

### 6. Double-outline (hand-drawn / crafted)
A second ink border offset behind via `::before`, no fill — depth with no shadow.
```css
.card { position: relative; border: 3px solid var(--ink); border-radius: 0; padding: 32px; }
.card::before { content: ""; position: absolute; inset: 0; transform: translate(7px,7px);
               border: 2px solid var(--ink); }   /* no fill — canvas shows through */
```

---

## Elevation system (when you do use shadows)
Define three, use them by intent — never one shadow everywhere:
```css
:root {
  --shadow-sm: 0 2px 6px rgba(0,0,0,.05);
  --shadow-md: 0 12px 30px -16px rgba(0,0,0,.18);
  --shadow-lg: 0 40px 90px -42px rgba(0,0,0,.28);
}
```

## Forbidden (the slop list)
- ✗ colored top-stripe / left-rule as a card edge (the house ban)
- ✗ uniform drop-shadow on every element
- ✗ glassmorphism over a flat background
- ✗ rounded card + colored left-border accent (the 2020–24 cliché)
