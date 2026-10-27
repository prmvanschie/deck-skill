# Icons — bespoke animated line-icon set

Generate a small set of **custom inline-SVG line icons** for the deck's actual concepts (market, value-chain, persona, timeline, agent, …) — not a generic icon library. They inherit the accent, draw themselves on slide-enter, and keep the deck single-file.

## Derive the icon style from the brand (do this first)
The icon set must look **cut from the same cloth as the brand and the deck** — not a stock line-icon pack dropped in. Before drawing, read the client's logo/brand and set the icon system to echo it:
- **Stroke weight** — match the logo's line weight (hairline brand → thin icons; bold brand → chunky 2.5–3px).
- **Corners & joins** — rounded logo → `stroke-linejoin:round`, rounded caps; sharp/geometric brand → mitred joins, butt caps; a brand with a signature *cut/angle* → echo that cut in the icons.
- **Geometry** — geometric brand → icons built on circles/45° angles; organic brand → looser curves.
- **Signature move** — if the logo has a recognisable device (a ring, a slash, a dot, a notch), work it into the icons (e.g. every icon sits in the brand's ring, or shares its terminal).
- **Grid & optical size** — one consistent grid (24px), consistent visual weight across the set.
For **house-brand** decks, echo the user's own mark's geometry. Result: someone seeing one icon should feel it belongs to this brand's deck.

## Rules
- **Line style**, one consistent stroke width (`stroke-width` ~2 at the 24px design grid), `fill="none"`, round caps/joins.
- **`currentColor`** for the stroke — so an icon inherits whatever color its container sets (accent on light, on-dark on dark). Never hardcode a hex.
- **24×24 viewBox**, scaled up via CSS where placed.
- Store **once as a `<symbol>` sprite**, reference with `<use>` — keeps the file lean and the deck single-file.
- Bespoke geometry per concept; if you start from a known shape (Lucide/Phosphor as mental reference), redraw it in the deck's stroke language — don't paste a library.

## Sprite + use
Put the sprite once near the top of `<body>` (hidden), reference anywhere:
```html
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="ic-market" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path data-draw d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6"/>
  </symbol>
  <symbol id="ic-flow" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path data-draw d="M4 6h6M14 6h6M4 18h6M14 18h6"/><circle data-draw cx="12" cy="12" r="2.5"/>
  </symbol>
  <!-- one symbol per concept the deck actually uses -->
</svg>

<span class="ic" style="color:var(--accent)"><svg><use href="#ic-market"/></svg></span>
```
```css
.ic svg { width: 56px; height: 56px; }   /* size at placement */
```

## Self-drawing animation
`viewport-base.css` already arms any path/shape marked `data-draw`: on `.slide.visible` it animates `stroke-dashoffset` from the path length to 0 (~0.75s, eased), respecting `prefers-reduced-motion`. For accurate timing, set the path length so dash math is exact:
```js
// after load: give each [data-draw] its own length so the draw is clean
document.querySelectorAll('[data-draw]').forEach(function(p){
  var len = (p.getTotalLength ? p.getTotalLength() : 100);
  p.style.setProperty('--len', len);
});
```
Optional: after the stroke draws, pop a small accent dot (a `<circle>` that scales in) for life. Keep it subtle.

## Don't
- ✗ raster/emoji icons, 3D stock icons, or a full imported icon font.
- ✗ hardcoded colors (breaks dark/light inheritance).
- ✗ filled/duotone blobs — keep it line-work consistent with the deck.
