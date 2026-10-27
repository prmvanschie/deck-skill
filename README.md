# /deck

A Claude Code skill that builds HTML presentations without the tells of an AI-made deck.

You know the look: a small label in spaced-out capitals above every title, every slide a grid of cards with a colored stripe on the edge, "01 / 12" in the corner. This skill bans those patterns and a list of others, so you can spend your time on what the deck says.

## What you get

- **One HTML file per deck.** All CSS and JavaScript sit inline, so you can email it or open it in any browser.
- **Your client's brand from a URL.** Give the skill a client's website and it takes the logo, colors and images from it, then turns a shape from the logo into an animated motif behind the slides.
- **Slides built with you.** The skill makes a cover and two or three sample slides first. After you approve the look, you grow the deck together, a few slides at a time.
- **Explainer mode for hard topics.** When the job is to explain something complex, the skill writes a storyboard with one point per slide and waits for your approval before it builds.
- **A fixed 16:9 stage.** You author every slide at 1920×1080 and the deck scales as a whole, so the PDF matches the screen.
- **Presenter mode, an edit mode and PDF export.** Press `S` for presenter mode. Press Edit to change text, fonts, text size and accent, with undo and redo. Save writes the whole deck, edits included, to one HTML file you can send.

## The house rules

The skill checks every slide against these before it shows you anything:

- Headline only: no label above the title and no subtitle under it.
- No small labels in spaced-out capitals, anywhere.
- The cover shows the title, at most with a quiet date or client name.
- Cards only for comparable items, and never on two slides in a row.
- No slide numbers on the slides.
- No colored stripe on a card's edge.
- Dark cover and chapter slides, light content slides.
- No em dashes in sentences.
- No Inter, Roboto or Arial as a display font.

The full list lives in `deck/SKILL.md` and `deck/references/anti-slop-checklist.md`.

## Install

```bash
git clone https://github.com/prmvanschie/deck-skill.git
cp -R deck-skill/deck ~/.claude/skills/deck
```

Then type `/deck` in Claude Code, or ask for a presentation.

The first time you build a deck in your own company's look, the skill asks for your website and saves your brand in `references/brand-house.md`.

The first house-brand deck writes your brand into the skill folder. Back up `deck/references/brand-house.md` before you copy a newer version over it.

## Requirements

- Claude Code.
- Node.js for the PDF script. Each run installs Playwright into a temp folder, so it needs a network connection; Chromium downloads once. You can also skip the script and print to PDF from the browser.
- The skill opens previews with `open`, which works on macOS. On other systems, open the HTML file yourself.

Optional: a web-scraping tool such as Firecrawl gives better brand extraction from a client's site, and an image-generation tool such as nano-banana fills gaps where the client has no usable images. The skill works without both.

## Works well with

[stop-slop](https://github.com/hardikpandya/stop-slop) by Hardik Pandya, which removes AI writing patterns from prose. The deck skill calls it for slide copy when you have it installed.

## Credits

Paul van Schie wrote this skill after studying the open-source HTML-deck skills. Ideas come from [frontend-slides](https://github.com/zarazhangrui/frontend-slides) and beautiful-html-templates by Zara Zhang, huashu-design, html-ppt-skill, ppt-agent-skill, and Anthropic's frontend-design and pptx skills. See `THIRD_PARTY_NOTICES.md` for adapted code.

## License

MIT
