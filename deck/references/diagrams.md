# Strategic visuals — invent a fresh representation every time

A strategic visual takes ONE concept, finds its essence, and invents a picture plus a meaningful motion that explains it. This is a **creative act, not a template fill.** The failure mode — and it is a strong pull — is defaulting to the same horizontal boxes-and-arrows flow every single time. **Treat "another left-to-right node flow" as slop.** A schematic can be a cutaway, an exploded 3D build, an orbit, a tree, an iceberg, a generated render with animated hotspots, a map, a morph, a particle field — anything that fits *this* idea and *this* brand.

Two non-negotiables:
1. **Invented for this concept and this brand/topic.** Derive the representation from the subject's own world, never a generic flowchart. (Twix → a cross-section, a snap, an exploded stack, a caramel-pull; Pokémon → an evolution tree, a type-orbit, a battle arena.)
2. **Never twice.** Don't reuse a structure within a deck or from the recent deck. If the last strategic visual was a flow, this one is a different family. Variety is the whole point.

## Before building: diverge, then choose (REQUIRED — this is the anti-slop mechanism)
Never jump to the first idea. **Generate three genuinely different representations, each from a different family below.** For each, write one line: the **metaphor**, the **one motion that teaches**, and **why it's true to the subject**. Then pick the option that is (a) instantly legible, (b) most true to the subject, (c) most surprising-yet-clear. For a key slide, show the user the three one-liners and let them choose.
- The plain horizontal flow may be one of the three, but it wins only if it genuinely beats the others — which it rarely should.
- If your three ideas are all variations of the same shape, you haven't diverged. Push into different families.

## Representation families (a menu to spark ideas, NOT templates)
Pick a *different* family than last time. The listed motion is the *kind* that teaches for that family — invent the specifics.
- **Object / metaphor made literal** — iceberg, bridge, engine, tree, river, mountain climb, scales, gears, funnel-as-object. *Motion:* the object works (water flows, gears mesh, the climber ascends).
- **Cutaway / exploded view** — parts separated in space; ideal for "what's inside" or architecture. *Motion:* parts assemble or explode; a signal passes through the layers.
- **Isometric / 2.5D scene** — a small world at an angle. *Motion:* things move through the scene.
- **Generated base + animated overlays** — nano-banana renders a rich base (a 3D object, a scene, a stylised map); you animate SVG/CSS hotspots, paths, highlights and numbers on top. This is how you get real 3D and texture *and* keep meaningful motion.
- **Orbit / constellation / system** — nodes revolving a core; relationships as gravity or links. *Motion:* orbiting, pulsing connections.
- **Tree / branching** — hierarchy, evolution, a decision. *Motion:* branches grow; one path lights up.
- **Map / journey through space** — a stylised map with a travelling path.
- **Morph / before → after** — one form becomes another. *Motion:* the transformation itself.
- **Physics / particles / flow-field** — emergent motion for crowds, energy, markets, adoption. *Motion:* the particles.
- **Matrix / timeline** — the conventional grids. Use only when genuinely the best fit, and still make the motion mean something.
- **Last resort: horizontal node-and-line flow.** The single most overused schematic there is. Only if nothing truer exists — and never two decks running.

## Technique toolbox (ingredients to compose into whatever form you invent)
Single-file, tokens for color, reduced-motion safe, labels in HTML (never SVG `<text>`).
- **SVG paths + marching dashes** (`stroke-dasharray` + animated `stroke-dashoffset`) — flow/direction along *any* shape, not just a straight line.
- **Travelling element** — `offset-path` on any path (a curve, an orbit, a coastline, a branch) + animated `offset-distance`; or SMIL `animateMotion`.
- **CSS 3D** — `perspective`, `rotateX/Y`, `translateZ` for isometric, exploded, stacked, card-flip and cutaway effects.
- **Canvas** — particles, flow-fields, constellations, subtle physics.
- **Generated image + overlay** — a nano-banana base with animated SVG/HTML on top (hotspots light, a path draws, a value counts).
- **Morph** — animate `clip-path`, path `d` interpolation, or cross-fade between two states.
- **Staggered highlight / pulse / glow / count-up** — sequence, emphasis, magnitude.

```css
/* the workhorses — building blocks, NOT the finished diagram */
.flow-line{stroke-dasharray:2 15;animation:march 1.1s linear infinite}       /* direction along any path */
@keyframes march{to{stroke-dashoffset:-17}}
.traveler{offset-path:path('...');animation:travel 5s ease-in-out infinite}  /* a thing riding any path */
@keyframes travel{0%,7%{offset-distance:0%}90%,100%{offset-distance:100%}}
.focus{animation:glow 2.2s ease-in-out infinite}                             /* emphasis */
@keyframes glow{0%,100%{transform:scale(1);opacity:.22}50%{transform:scale(1.6);opacity:.04}}
```

## How to brief one (five)
1. **Concept** — what idea are we explaining?
2. **Essence** — its 2–5 core parts or steps.
3. **Family / metaphor** — which representation, rooted in the subject's world? (Diverge first — offer three.)
4. **Story** — what must it make obvious; what to emphasize?
5. **Motion** — what moves and *why* — and it must differ from the last diagram.

## Guardrails
- Legible before clever. One primary motion that teaches; slow, loopable.
- Root the metaphor in the brand/topic — the same instinct as the logo motif.
- One strategic visual per slide, centered under the header. **Crop the SVG `viewBox` tight to the drawn content** (no empty top/bottom band) — dead space inside the viewBox shifts the visual's optical centre and makes it float high even when the box is "centered". And ensure the deck actually defines `.slide-body` (flex, `justify-content:center`) so the content truly centers below the header.
- Reduced-motion: freeze at a clear final state.
- **Originality check (run every time):** Would this read as a generic flowchart? Is it the same shape as another slide or the last deck? If yes — reinvent from the subject's world.
