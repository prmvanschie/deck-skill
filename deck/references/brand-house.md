# House brand tokens

Use when the user picks **house brand** mode: decks in their own company's look instead of a client's. Apply these tokens and skip the 3-direction style discovery, because the look is fixed.

Status: not set up

**First run:** if the status line above says "not set up", ask the user for their website URL (or their brand guide), derive the values with `brand-ingestion.md`, show them the result, and write it into this file once they approve. Change the status line to "set up". Every house-brand deck after that reuses it; optional fields (voice, dark-background logo) may stay TODO.

`brand-ingestion.md` yields the accent, ink and dark surface. Derive the rest from those: `--slide-bg` from the site's background (usually white or off-white), `--stage-bg` a few steps darker than `--slide-dark`, `--ink-2` and `--mute` as lighter tints of `--ink`, `--line` as `--ink` at ~8% on the background.

## Palette
| Role | Hex |
|------|-----|
| Primary / accent | `TODO` |
| Dark surface (cover + dividers) | `TODO` |
| Text ink on light | `TODO` |
| Background | `TODO` |

Note which colors fail contrast as body text (bright accents usually do) and use those as fills and highlights only.

## Tokens (drop into `:root`)
```css
:root {
  --stage-bg:   TODO;   /* letterbox behind stage, darker than --slide-dark */
  --slide-bg:   TODO;   /* light content slides */
  --slide-dark: TODO;   /* cover + chapter dividers */
  --ink:        TODO;   /* headings/body ink on light */
  --ink-2:      TODO;
  --mute:       TODO;
  --line:       TODO;
  --accent:     TODO;   /* fills/highlights */
  --accent-soft:TODO;   /* accent at ~8% opacity */
  --accent-ink: TODO;   /* accent that must read as text on light */
  --on-dark:    #ffffff;
  --radius:     12px;
}
```

## Type
- **Display:** TODO (load from Google Fonts / Fontshare)
- **Body:** TODO
- If the brand mandates a single family, that satisfies the "distinctive display" rule for house decks. Do emphasis with `--accent-ink` + weight instead of a font switch. Client decks still get a distinctive face of their own.

## Logo
- Light bg: TODO (URL or inline SVG)
- Dark bg: TODO

Place the wordmark small, top-left, low-emphasis chrome on content slides; larger on the cover. Download and inline the SVG so the deck stays self-contained and works offline.

## Notes
- Cover + chapter dividers on `--slide-dark`; content on `--slide-bg`. One accent for fills, markers and key numbers.
- Voice: TODO (one line on how the brand sounds). Still stop-slop: no corporate filler.
