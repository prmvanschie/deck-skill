# PDF export

Two paths. Because every deck is a fixed 1920×1080 stage, both produce clean one-slide-per-page landscape PDFs.

## Path A — browser print (no tooling)
The scaffold sets an `@page { size: 1920px 1080px; margin: 0 }` rule and `viewport-base.css` lays every slide out one-per-page in `@media print`. So: open the deck → Cmd-P → "Save as PDF" → landscape → margins none → enable "Background graphics". Fast, vector-crisp, no install. Animations render at their final state. Tell the user this is the quickest route.

## Path B — script (consistent, scriptable)
`scripts/export-pdf.sh` uses headless Chromium (Playwright) to screenshot each slide at 1920×1080 and assemble a PDF. Use when the user wants a file produced without touching the browser, or in a batch.

```bash
bash <this skill's folder>/scripts/export-pdf.sh path/to/deck.html [out.pdf] [--compact]
```
- Needs Node.js. Each run installs Playwright into a temp folder (needs network); Chromium downloads once (~30–60s) and is cached after that.
- `--compact` renders at 1280×720 (50–70% smaller file).
- Finds slides by `.slide`; the scaffold uses that class, so it works out of the box.
- Animations become their final visual state (static) — mention this so the user isn't surprised.

## Notes
- Inline/relative assets: the script serves the deck's folder over HTTP so fonts + relative images load. Keep logos inlined (base64/SVG) and the deck stays portable.
- If a deck has many full-bleed images, the PDF can get large; offer `--compact`.
- For an editable **PowerPoint** instead of PDF: not built in. Honest note — visually-rich HTML converts to PPTX poorly (text reflows, gradients/shadows drop). If a client truly needs editable .pptx, rebuild that deck with the `pptx` skill rather than converting. PDF is the reliable share format.
