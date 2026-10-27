# Critique loop — score, then fix

After building (Phase 6), critique the deck like a senior designer would, then act on it. This catches "technically fine but not good" before the user sees it. Pair it with `anti-slop-checklist.md` (mechanical) — this file is judgment.

Run it across the deck (sample the cover, 2–3 content slides, a chapter divider, the close). Score each dimension **0–10**, then produce the action list.

## The 5 dimensions

1. **Direction alignment** — does every slide embody the one chosen aesthetic direction, purely? Any element that belongs to a different look is a defect. (Squint: does it read as one designed system?)
2. **Visual hierarchy** — one clear focal point per slide; title ≥ ~2.5× body; the eye lands where the meaning is. The "delete test": remove any element — if the slide doesn't get worse, it shouldn't be there.
3. **Craft** — 8px-ish spacing rhythm, ≤2 font families, restrained palette, pixel alignment, consistent radii/borders. No accidental near-misses (two greys that should be one).
4. **Function** — does it serve the audience and the desired action? Is the one thing per slide obvious? Does the narrative move (problem → shift → resolution), not just list?
5. **Originality** — is there an "unexpected but right" decision? Or is it on-distribution (gradient orbs, generic cards, centered everything)? Distinctive ≠ loud — restraint counts.

**Weighting by deck type:** speaker-led → hierarchy + function lead, originality welcome. Reading-first → function + craft + hierarchy lead. High-stakes client pitch → all five matter; alignment + craft must be ≥8.

## Output template

```
Overall: X.X / 10  (Excellent 8+ · Good 6–7.9 · Needs work 4–5.9 · Fail <4)

Per dimension:
  Direction alignment  X/10 — one line
  Visual hierarchy     X/10 — one line
  Craft                X/10 — one line
  Function             X/10 — one line
  Originality          X/10 — one line

KEEP — what's working (in design language), so it survives revision.

FIX — sorted by severity:
  ⚠ fatal      Current: … / Problem: … / Fix: … (with specifics)
  ⚡ important  Current: … / Problem: … / Fix: …
  💡 polish     …

QUICK WINS — if there were only 5 minutes, do these 3.
```

Then apply the fatal + important fixes, re-render, and re-verify (Phase 7). One fix often creates another — recheck the slides you touched. Don't declare done until a full pass surfaces nothing new.

## Common deck problems (pre-flight self-check)

- Gradient orbs / generic glow used as "design" → replace with a context-specific device.
- Title not assertive — a noun phrase ("Overview", "Our approach") instead of a claim. Rewrite as a judgment.
- More than ~3 new terms/acronyms on one slide → split or define.
- 3+ consecutive slides with the same layout → insert a visual break (big-number, quote, chapter beat).
- Card with a colored border stripe → convert to a fill-based card (house rule).
- Eyebrow/lede crept in from a borrowed layout → strip (house rule).
- All-caps tracked label anywhere — eyebrow, `SECTION LABEL`, card chip (`BUDGET + LIVELY`), dotted contents row (`A · B · C`) → delete; let the heading/content carry it (house rule).
- Cover has a tagline, eyebrow, or topic-teaser row → remove; title only (house rule).
- Cards used as the default — box-grid on most/consecutive slides → redesign to type + space; keep cards only for genuinely comparable groups (house rule).
- A strategic concept shown as yet another left-to-right boxes-and-arrows flow → reinvent from the subject's world; diverge on three families and pick a fresher one (`diagrams.md`).

## Explainer decks — extra lens (`explainer.md`)
For decks whose job is to *explain* a hard topic, also check:
- **One point per slide** — does each slide make exactly one point? If two, split.
- **The 5-second test** — would a smart newcomer grasp each slide in ~5 seconds? If not, simplify the point or the visual.
- **It builds** — each slide rests only on ideas already shown; **no forward references**; the thesis lands by the end.
- **Distinct visuals** — every concept has a fresh representation; no two concept slides share a `diagrams.md` family.
- **Interesting, not just clear** — is there a curiosity gap, an analogy, or a "so what" beat keeping it alive, or is it a flat list of facts?
