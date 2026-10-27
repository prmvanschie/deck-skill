# Components — reusable slide blocks

Distilled from real client decks. All headline-only, no eyebrows/numbers, tokens for color, em-dash markers. Combine with `cards.md`, `charts.md`, `icons.md`.

## Big-number hero (one powerful metric)
```html
<section class="slide center">
  <h2 class="h2 reveal">A headline framing the number</h2>
  <div class="kpi reveal" style="--d:1"><span class="kpi-n">22%</span></div>
  <p class="reveal" style="--d:2">One line of grounding context.</p>
</section>
```

## Two-column split (compare / text + visual)
```html
<div class="twocol">
  <div><h2 class="h2 reveal">Left headline</h2><div class="list">…</div></div>
  <div class="reveal" style="--d:2"><!-- chart / mockup / image --></div>
</div>
<style>.twocol{display:grid;grid-template-columns:1fr 1fr;gap:72px;align-items:center;flex:1;min-height:0}</style>
```

## Customer-journey funnel (descending bars + drop-off)
```html
<div class="funnel">
  <div class="fstage"><div class="fp">100%</div><div class="fbar" style="height:150px;background:var(--accent)"></div><div class="fn">Hand-off</div></div>
  <div class="fdrop">−55%</div>
  <div class="fstage"><div class="fp">45%</div><div class="fbar" style="height:68px;background:var(--accent-soft)"></div><div class="fn">Started</div></div>
</div>
<style>
.funnel{display:flex;align-items:flex-end;gap:14px;margin-top:48px;flex:1;min-height:0}
.fstage{flex:1;display:flex;flex-direction:column;justify-content:flex-end}
.fp{font-family:var(--font-display);font-weight:800;font-size:30px;text-align:center;margin-bottom:8px}
.fbar{width:100%;border-radius:10px 10px 0 0}
.fn{font-family:var(--font-mono);font-size:16px;color:var(--mute);text-align:center;margin-top:12px}
.fdrop{align-self:center;font-family:var(--font-mono);font-size:18px;color:var(--mute);padding-bottom:24px}
</style>
```

## Persona anchor + principles (positioning)
Two-column: a filled persona card (tinted/soft, no colored edge) on the left; a hairline-separated principle list on the right. Each principle: a small accent dot marker + bold term + muted description.

## Timeline / process (steps)
Horizontal nodes joined by a line with the first/active node in accent; or a vertical spine with dots. Build as inline SVG (`charts.md`) or a flex row of node cards. Names below, no step numbers as eyebrows.

## Readiness spectrum (3-state gradient)
A horizontal line with three nodes (cold→mid→warm) over three labeled columns — for "three kinds of X" slides. Gradient line via `linear-gradient`, nodes as bordered dots.

## Diptych (head vs heart / before vs after)
Two halves split by a 1px center rule; each half = a small line icon + a bold term + a question + a one-line answer. Left in accent, right in a second tone.

## Product mockups (browser / phone / chat)
Lightweight CSS mockups for "what the customer sees" slides:
- **Browser:** rounded panel, top bar with 3 dots + faux URL, content area.
- **Phone:** dark rounded frame, inner screen, status line.
- **Chat / WhatsApp:** tinted bubble stack, sender label, time + ✓✓.
Keep them schematic and on-palette (use tokens). Great for benchmark/inspiration slides.

## Chapter divider (dark)
```html
<section class="slide dark center">
  <h2 class="display reveal">Chapter title</h2>
</section>
```
Cover + dividers dark; content light — the rhythm. No subtitle/lede unless the user asks.
