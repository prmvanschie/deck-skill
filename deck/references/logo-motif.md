# Logo motif — the brand's own shape as the deck's visual signature

For **client-branded** decks, the strongest, most bespoke visual enhancer is a shape lifted **from the client's own logo**, enlarged and used as a recurring animated motif on every slide. This is what makes a deck feel unmistakably *theirs*.

## 1. Extract an *element*, not the wordmark
Don't slap the full logo on every slide. Pull the **one distinctive shape** out of it and enlarge that:
- **Circular / ring logo** → the ring(s) or circle, enlarged, bled off a corner.
- **A letter with a weird cut / negative space** → use that exact cut-out fragment as the motif.
- **An angular mark / chevron / slash** → repeat that angle.
- **A dot, spark, or orbit** → the dot/orbit, oversized.
- **A container shape** (rounded square, hexagon, blob) → that silhouette as a frame or bleed.
Choose the piece a viewer would recognise as "that's their mark," and make it big.

## 2. Place it as an ambient watermark (behind content)
Enlarged, low-opacity, off-corner, **behind the text** — never competing with it.
- `position:absolute; z-index:-1; pointer-events:none;` inside each slide.
- Opacity ~`.08–.18`. Bleed it off an edge/corner (negative offsets) so only part shows.
- **Adapt size/position/color per slide type** (dark vs light): different corner and a color that sits on that background.
- Inject it on **every** slide (one JS loop) so it's a consistent signature, not a one-off.

## 3. Animate it (this is the point)
Slow, ambient, reduced-motion safe: spin, counter-spin nested parts, a gentle float, or a one-time self-draw. Plus an **animated logo reveal on the cover** (the wordmark's letters draw/stagger in — the "nicely animated logo" moment).

## Recipe
```css
/* the extracted logo shape, enlarged behind every slide */
.brandmark { position:absolute; z-index:-1; pointer-events:none; opacity:.15;
  animation: bm-float 40s ease-in-out infinite; }
.brandmark svg { width:100%; height:100%; display:block; overflow:visible; }
.brandmark .outer { transform-box:fill-box; transform-origin:center; animation: bm-spin 64s linear infinite; }
.brandmark .inner { transform-box:fill-box; transform-origin:center; animation: bm-spinrev 48s linear infinite; }
/* size + corner + colour per background */
.slide.dark  .brandmark { width:720px; height:720px; left:-210px; bottom:-250px; }
.slide.dark  .brandmark .outer { fill: /* soft light-on-dark */; }
.slide:not(.dark) .brandmark { width:560px; height:560px; top:-185px; right:-165px; }
.slide:not(.dark) .brandmark .outer { fill: /* deep brand tone */; }
@keyframes bm-spin    { to { transform:rotate(360deg) } }
@keyframes bm-spinrev { to { transform:rotate(-360deg) } }
@keyframes bm-float   { 0%,100% { transform:translateY(0) } 50% { transform:translateY(22px) } }
@media (prefers-reduced-motion:reduce){ .brandmark, .brandmark * { animation:none !important; } }
```
```js
// inject the mark behind every slide (define MARK = the extracted-shape SVG)
const MARK = "<svg viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg'>…extracted logo shape…</svg>";
document.querySelectorAll('.slide').forEach(s => {
  const d = document.createElement('div'); d.className = 'brandmark'; d.innerHTML = MARK; s.appendChild(d);
});
```
Cover logo reveal: each letter is its own `<path class="lp">`, animated in with a staggered `transform:translateY→0; opacity→1` (`animation-delay: calc(var(--i)*.13s)`), reduced-motion safe.

## Guardrails
- Behind content always (`z-index:-1`), subtle opacity — the motif enhances, never fights the words.
- Vary corner/scale/tone across slide types so it feels composed, not stamped.
- If you only have a raster logo, trace the key shape into a small inline SVG (or isolate it) so it can be recolored (`currentColor`/`fill` var) and animated.
- House-brand decks: use the user's own mark/shape the same way.
