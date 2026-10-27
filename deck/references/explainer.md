# Explainer mode — storyline first, then build

Use this mode when the deck's job is to **explain a hard, strategic topic** (not to present a brand or content the user already has shaped). Here the hard part isn't the look — it's the **content architecture**: breaking a complex idea into a clear, interesting build-up. So in this mode you **plan the storyline first, get it approved, then build.** This is the deliberate opposite of the default brand flow (sample-first, emergent). See `SKILL.md` for the two modes.

## When it fires (auto-detect, then confirm)
Signals: the user gives a topic/concept + source material and wants it *explained/taught*; the subject is layered or counter-intuitive; words like "explain", "break down", "how X works", "help people understand", "make this clear". Confirm in one line: *"This looks like an explainer — I'll storyline it first, then we build. Right?"* If it's really a brand/known-content deck, fall back to the default.

The user **supplies the material** (their research/notes/links). You do not auto-research. Only use claims grounded in what they give (house rule: sourced). If a gap is load-bearing, ask them rather than invent.

## E1 — Frame it (light)
Ask only what shapes the story:
- **Audience** — who, and how expert already?
- **The one walk-away** — the single thing they must understand when they leave.
- **Known-hard parts** — what usually confuses people about this.

## E2 — Decompose into a storyline (the core step)
Break the topic down, first-principles:
1. **Find the thesis** — the one walk-away, in a sentence. Everything serves it.
2. **Extract the load-bearing ideas** — the 5–12 things someone *must* grasp to get the thesis. Cut the rest.
3. **Order for build-up** — each idea rests only on ideas already shown. **No forward references** (never rely on something explained later). Start from what the audience already knows and add one new thing at a time.
4. **One idea = one slide.** If a slide carries two ideas, split it. If two slides carry one idea, merge.
5. **Give each slide its point** — an assertion headline that *is* the idea (reuse `narrative.md` headline patterns; `Before–After–Bridge` suits progressions). The 3 bullets are the sub-parts that make that one point land — not a second point.

## Pedagogy toolkit (make it clear AND interesting)
Pull the right tool per idea:
- **Start from the known** — anchor the new idea to something familiar before abstracting.
- **Concrete before abstract** — a specific example/scenario first, the principle second.
- **One analogy per hard idea** — a metaphor from the audience's world (and it can become the slide's visual — see below).
- **Curiosity gap** — pose the question, let it sit, then answer on the next slide (a great use of a beat slide).
- **What is → what could be** (Duarte) — contrast the current/painful with the better, to create momentum.
- **Name the misconception, then correct it** — "You'd think X. Actually Y." Sticky and clarifying.
- **The "so what" beat** — every few slides, land why it matters.
Keep prose lean and assertive (stop-slop; no hedging, no filler, no em dashes). Sourced only.

## E3 — The editable storyboard (the approval gate)
Write the storyline to **`<deck>-storyboard.md`** beside the deck, in this format, then **stop and let the user edit/approve. Build nothing until they approve.**

```
# <Deck title> — storyboard
Thesis: <the one thing they walk away understanding>
Audience: <who + expertise>  ·  Arc: <how it builds, in a phrase>

## Slide 1 — <the one point, as an assertion headline>
- <bullet: a sub-part this slide covers>
- <bullet>
- <bullet>
Visual: <proposed representation — a diagrams.md family, an image, or "type + space">
Beat: concept | question | reveal | proof | divider

## Slide 2 — …
```
Invite the user to tweak wording, reorder, split/merge, cut, or change a visual. When they're happy, that storyboard is **locked** — the build follows it, not an emergent outline.

## E4 — Build against the locked storyboard
- **Pick the look per deck** (ask): a topic-bespoke direction (`style-discovery.md`, 3 previews) **or** house brand (`brand-house.md`). Establish a **through-line visual metaphor** that can recur and *evolve* across the deck (the explainer's version of the logo motif — e.g. a shape that gains parts as the idea builds).
- Build **slide by slide following the storyboard** (locked content, improvised craft). Each slide: header-top, **exactly one point**, lean text, ambient motion, dark/light beats for the divider/question slides.
- **Every concept slide gets a fresh strategic visual** (`diagrams.md`): for that idea, pick the family that explains it best, via the **diverge-on-three** gate. Rough matches: *composition* → cutaway/exploded; *relationship/parts-of-a-system* → orbit/constellation/system; *change over time* → morph or timeline; *hierarchy/evolution/decision* → tree/branching; *a process* → a fresh journey (not the default flowchart); *scale/proportion* → object metaphor (iceberg, etc.). **Never repeat a family across the deck; never the default boxes-and-arrows.**
- **Rhythm:** don't run 10 concept slides in a row. Punctuate with beats — a question slide (curiosity gap), a statement slide (the "so what"), a section divider (dark). This is what makes a long explainer breathe.

## E5 — Quality + deliver
Run the usual gate (`critique.md` incl. the explainer lens, `anti-slop-checklist.md`, stop-slop the prose), screenshot-verify, open, offer PDF. Explainer-specific checks: does each slide make exactly one point? Would a smart newcomer get each slide in ~5 seconds? Does the story actually build with no forward references? Is every concept's visual a different, fresh representation?

## Reuse
`diagrams.md` (the per-concept visual engine — central here), `narrative.md` (headline patterns + Before–After–Bridge), `style-discovery.md` / `brand-house.md` (the look), plus every house hard rule. Research tools can help if the user asks, but they are not part of the default flow — the user brings the material.
