# Style discovery — show, don't tell (client-branded mode)

People can't pick a design from words. So generate **3 genuinely different title slides**, open all three in the browser, and let the user react. Only for **client-branded** decks — house-brand mode skips this and uses house tokens.

## The rule
Never offer a text menu of directions. Show rendered slides. Each preview must look like a **real first slide of this deck** (real title, real client name/logo if available) — never a diagnostic card, never the words "Option A / preview / template / style" on the slide itself.

## Generate 3 directions via forcing-functions
Spawn three *different* logics so they don't converge on one safe minimalism:

1. **Brief-fit** — the direction from `design-directions.md` that best matches the brief's purpose, audience, and mood (e.g. board pitch → Quiet Premium; product → Dark Tech; cultural → Magazine).
2. **Brand-led** — built from the client's actual brand (palette/type/logo from `brand-ingestion.md`), styled confidently rather than literally copying their website.
3. **Wildcard** — an adventurous, context-specific pick: a second strong direction, or a custom direction designed for this exact deck. Make it clearly different from the other two. (Optionally anchor it to a real reference: a known award-winning deck/site in this space, or "the ideal studio for this client" — then design in that spirit.)

For conservative/high-stakes decks, keep all three readable and authoritative (the wildcard is "authoritative, not decorative"). For expressive decks, make the wildcard genuinely bold.

## Build + open
- Each preview is a **self-contained title slide** (~60–120 lines) using the fixed 1920×1080 stage, the direction's palette/type/signature device, and one entrance animation. Include the client logo (base64 or inlined SVG) if you have one.
- Write to `.deck/previews/style-a.html`, `style-b.html`, `style-c.html`.
- **Open all three automatically:** `open .deck/previews/style-a.html .deck/previews/style-b.html .deck/previews/style-c.html` (macOS).
- Then ask the user (one structured question): **Style A / B / C / Mix** — naming each by its feel ("warm editorial", "dark tech", "bold poster"), not by file name. If "Mix", ask which elements (e.g. "A's palette + C's type").

## After the pick
- Treat the chosen preview's CSS as the design recipe; expand the *same* system across every slide layout (don't switch directions mid-deck).
- Carry its palette, type, signature device, card style, and atmosphere into the full build (steps 2 and 3, build).
- Delete `.deck/previews/` at delivery (step 5, deliver).

## Preview authenticity (don't ship process labels)
Before opening, scan each preview's visible text — remove anything that says `preview`, `option`, `template`, `wildcard`, `style`, a file path, or a requirements note. The only chrome allowed is real deck chrome: the deck title, client name, date. And still no eyebrow/lede/number on the slide.
