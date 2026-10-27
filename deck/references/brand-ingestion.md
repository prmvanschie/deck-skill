# Brand ingestion — fetch the client's real assets

For **client-branded** decks. Get the real logo + palette, then inject them as `:root{--brand-*}` so the HTML can only reference real assets — brand consistency by construction, not willpower.

## Asset priority (by recognition value)
**Logo > product render > UI screenshot > color > font > vibe words.** Most skills only grab hex; the logo is what makes a deck unmistakably *theirs*. If the client/product is named, its real logo is a required asset.

## Logo — download chain (don't just curl `/logo.svg`; SPAs return empty shells)
Try in order until one yields a real file:
1. **svgl** — `https://api.svgl.app/` (search the brand; many tech brands present). Prefer the SVG.
2. **Simple Icons** — `https://cdn.simpleicons.org/<slug>` (monochrome SVG; recolor with `currentColor`).
3. **Favicon (last resort)** — `https://www.google.com/s2/favicons?domain=<domain>&sz=256` (raster, fine for a small mark).
Or scrape the brand site with firecrawl (`branding` format extracts colors/fonts/logo). Verify the SVG is real (`file`, non-empty, has `<path>`), not a placeholder.

## Palette
- Pull from the site (firecrawl `branding` format, or scrape CSS and `grep -oE '#[0-9A-Fa-f]{6}' | sort | uniq -c | sort -rn`).
- Reduce to a usable set: one dominant, 1–2 supporting, one sharp accent. Don't carry 30 near-duplicates.
- **Check contrast:** if the brand accent fails WCAG AA as text (common with bright brand colors), use it as a *fill/marker* and pick a darker tone for accent-as-text. (See `--accent` vs an accent-ink token.)
- Watch for demo-brand contamination in screenshots (don't ingest a competitor's color from a sample image).

## Site images — download them and use them (they bring the deck to life)
Scrape the client's website and **download every usable image**, then use the good ones across slides — real product shots, team photos, environments, textures.
- **Get them all:** firecrawl (`map`/`scrape`/`crawl`) or a scrape of the pages to collect `<img src>`, `srcset`, `og:image`, and CSS `background-image` URLs; download each into the deck's `assets/` folder.
- **Then curate hard:** drop icons/sprites/logos-as-img, tracking pixels, tiny or low-res files, and duplicates. Keep the hero-worthy, on-message ones.
- **Treat for cohesion:** a shared overlay/duotone/tint/grain so mixed sources read as one deck (see `motion.md`). Don't drop raw mismatched stock.
- **Prefer real brand imagery** where it exists; generate with nano-banana only to fill gaps.
- These are the client's own assets — fine to use in their deck. Skip anything watermarked or clearly third-party.

## Type
- Identify the brand's fonts; if they're available on Google Fonts / Fontshare, use them. If a paid/closed font, pick the closest open substitute and note it.
- Keep the house rule: a distinctive display face. If the brand font is generic (Inter/Roboto), use it for body and choose a characterful display companion that fits the brand's feel.

## Inject as tokens
Map everything to the deck's token contract so the design panel + theme stay consistent:
```css
:root{
  --accent:      #<brand-accent>;
  --accent-soft: color-mix(in srgb, var(--accent) 8%, transparent);
  --accent-ink:  #<darker-accent-for-text-if-needed>;
  --ink:         #<brand-dark-or-near-black>;
  --slide-dark:  #<brand-dark-surface>;
  /* fonts set on --font-display / --font-body */
}
```
- **Inline the logo SVG** (or base64 the raster) into the deck so it stays single-file and offline-safe. Place it small/low-emphasis on content slides, larger on the cover. Use `currentColor` for monochrome marks so they inherit the right color on dark vs light slides.

## Save
Note the chosen tokens + logo path in the deck brief so they're reused consistently across every slide.
