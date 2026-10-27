# Charts & diagrams — inline SVG only

**No Chart.js, no ECharts, no external libs.** Build charts and diagrams as inline SVG/CSS using `currentColor` + `var(--accent)`. This keeps the deck single-file, theme-agnostic (recolors for free), and exportable to PPTX later. One chart/diagram per slide — never combined with a bullet list.

Rules:
- Colors only via tokens (`var(--accent)`, `currentColor`, ink at opacity) so it adapts to any direction.
- Numbers in the mono/tabular style; use `font-variant-numeric: tabular-nums`.
- **No `<text>` inside SVG** for labels — position HTML labels absolutely over the SVG (cleaner type, and survives PPTX export).
- Use a diagram when the *relationship* matters more than the values; a chart when magnitude matters.

## Bar (CSS, simplest)
```html
<div class="bars">
  <div class="bar" style="--v:78"><span class="bv">78%</span></div>
  <div class="bar" style="--v:45"><span class="bv">45%</span></div>
</div>
<style>
.bars{display:flex;gap:24px;align-items:flex-end;height:360px}
.bar{flex:1;height:calc(var(--v)*1%);background:var(--accent);border-radius:10px 10px 0 0;position:relative}
.bar .bv{position:absolute;top:-36px;left:0;right:0;text-align:center;font-family:var(--font-mono)}
</style>
```

## Donut / ring (SVG `stroke-dasharray`, no conic-gradient)
```html
<svg viewBox="0 0 120 120" style="width:300px">
  <circle cx="60" cy="60" r="52" fill="none" stroke="var(--line)" stroke-width="12"/>
  <circle cx="60" cy="60" r="52" fill="none" stroke="var(--accent)" stroke-width="12"
          stroke-linecap="round" stroke-dasharray="calc(68 * 3.267) 1000"
          transform="rotate(-90 60 60)"/>   <!-- 68% of 2πr(≈326.7) -->
</svg>
```

## Big-number / KPI (the most-used "chart")
```html
<div class="kpi"><div class="kpi-n">€1.8B</div><div class="kpi-l mono">run-rate, 2026</div></div>
<style>.kpi-n{font-family:var(--font-display);font-weight:900;font-size:220px;line-height:.9;color:var(--accent);font-variant-numeric:tabular-nums}</style>
```

## Funnel (CSS) — see also components.md
Stacked descending bars with drop-off labels between stages.

## Horizontal flowchart (SVG, currentColor + one accent focal)
```html
<svg viewBox="0 0 800 120" style="width:100%">
  <defs><marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
    <path d="M0 0l6 3-6 3z" fill="currentColor"/></marker></defs>
  <rect x="10"  y="40" width="180" height="56" rx="8" fill="none" stroke="currentColor" stroke-width="2"/>
  <rect x="310" y="40" width="180" height="56" rx="8" fill="none" stroke="var(--accent)" stroke-width="2.5"/>  <!-- focal -->
  <rect x="610" y="40" width="180" height="56" rx="8" fill="none" stroke="currentColor" stroke-width="2"/>
  <line x1="190" y1="68" x2="305" y2="68" stroke="currentColor" stroke-width="2" marker-end="url(#arr)"/>
  <line x1="490" y1="68" x2="605" y2="68" stroke="currentColor" stroke-width="2" marker-end="url(#arr)"/>
</svg>
<!-- HTML labels positioned over each rect; never <text> in the SVG -->
```

Other patterns to build the same way: vertical timeline (spine + dots, accent first dot), 2×2 matrix (focal quadrant in accent), simple org/hierarchy. Animate reveals with the `.reveal` / `data-draw` system from `viewport-base.css`.
