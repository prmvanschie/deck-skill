# Editor contract

The test in `editor.spec.mjs` checks the deck editor against this contract. The fixture is `deck/references/scaffold.html`, served over a local HTTP server and opened in headless Chromium at a 1920×1080 viewport.

## M1: foundation

### Elements
| Id | What it is |
|----|------------|
| `#deckEdit` | Button that toggles edit mode. Text reads `Edit` when off and `Done` when on. |
| `#deckPanel` | The edit panel. Has class `open` while editing. |
| `#deckSave` | Saves the deck as a complete HTML file with every edit in it. |
| `#deckUndo`, `#deckRedo` | Undo and redo the last committed change. Disabled (`disabled` attribute) when there is nothing to undo or redo. |
| `#deckReset` | Clears the autosaved edits and reloads the original file (after a `confirm()`). |
| `#deckFDisplay`, `#deckFBody` | `<select>` for display and body font. |
| `#deckScale` | Range input for text size, 80 to 125. |
| `#deckSwatches button[data-c]` | Accent color swatches. |
| `.ed` | Editable text elements. `contenteditable="true"` only while editing. |

Edit mode adds class `editing` to `<body>`.

### Behaviour
1. **Save to file.** Clicking `#deckSave`, or pressing Cmd/Ctrl+S, saves the deck. When `window.showSaveFilePicker` exists the editor uses it; otherwise it triggers a normal download. The test removes `window.showSaveFilePicker` with an init script, so it always gets a download. The suggested file name is the deck's own file name (`scaffold.html` for the fixture).
2. **The saved file holds every edit.** Opened in a fresh browser context (empty localStorage), the downloaded file shows:
   - edited text in `.ed` elements;
   - the chosen display font, body font, text size and accent, as the values of the CSS custom properties `--font-display`, `--font-body`, `--scale` (0.8 to 1.25) and `--accent` on `document.documentElement`.
3. **The saved file opens clean.** In the downloaded file: `<body>` has no `editing` class, `#deckPanel` lacks class `open`, no element has `contenteditable="true"`, and exactly one `.slide` has class `active`: the first one.
4. **Autosave.** Reloading the page in the same browser context keeps every edit (text and design).
5. **An older file ignores newer autosaves.** Each save stamps the file with a revision (`data-deck-rev` on `#deckStage`). On load, the editor only restores autosaved edits whose revision matches the file's revision. Test: save a file (rev A), make another edit, save again (rev B). Open the first downloaded file in the same browser context: it shows the state of rev A, not rev B.
6. **Undo and redo.** These count as one committed change each: picking an accent, a font, or a text size; a text edit (committed when the element loses focus, or after 600 ms without typing). `#deckUndo` reverts the last change, `#deckRedo` reapplies it. Cmd/Ctrl+Z and Cmd/Ctrl+Shift+Z do the same when focus is not inside a contenteditable element. Undo works for text edits and for design changes, in any order, at least 50 steps deep.
7. **Reset.** `#deckReset` (with `confirm()` accepted) removes the autosaved edits, and after the reload the deck shows its original text and design.
8. **Panel labels.** No heading inside `#deckPanel` has a computed `text-transform` of `uppercase`.
9. **Navigation still works.** Outside edit mode, ArrowDown moves the `active` class from slide 1 to slide 2.

## M2: structure

The "current slide" is the slide with class `active`. Every action below works on the current slide, counts as one committed change for undo/redo, autosaves, and ends up in a saved file.

### Elements
| Id | What it is |
|----|------------|
| `#deckSlidePos` | Text `Slide N of M` for the current slide (1-based, counting every slide, hidden ones included). |
| `#deckSlideUp`, `#deckSlideDown` | Move the current slide one place earlier or later. It stays the current slide. Disabled at the first or last position. |
| `#deckSlideDup` | Insert a copy of the current slide right after it. The copy becomes the current slide. |
| `#deckSlideDel` | Delete the current slide, without a confirm dialog. The slide that takes its place becomes current (the previous one if it was the last). Disabled when only one slide is left. |
| `#deckSlideHide` | Toggle class `deck-hidden` on the current slide. |
| `#deckSlideDark` | Toggle class `dark` on the current slide. |
| `#deckLayout` | `<select>` with one option per slide layout. Its option values are the `data-layout` values of the `<section class="slide" data-layout="…">` elements inside `<template id="deckLayouts">`. |
| `#deckSlideAdd` | Insert a new slide right after the current one, copied from the layout chosen in `#deckLayout`. The new slide keeps its `data-layout` attribute and becomes current. |
| `#deckNotes` | `<textarea>` with the speaker notes of the current slide: the text of its `aside.notes`. |

The scaffold's `#deckLayouts` template holds at least these layouts: `title`, `statement`, `bullets`, `two-columns`, `divider`.

### Behaviour
1. **Position.** `#deckSlidePos` updates after every navigation and structure change.
2. **Move.** On a deck of at least three slides, moving slide 2 down puts that slide at position 3, keeps it current, and `#deckSlidePos` reads `Slide 3 of M`. Moving it up again restores the original order.
3. **Duplicate.** The slide count goes up by one, and the new slide's text content equals the original's.
4. **Delete.** The slide count goes down by one and the deleted slide's text is gone.
5. **Hide.** A hidden slide stays visible and editable in edit mode. Outside edit mode, ArrowDown on the slide before it skips it and lands on the slide after it. With print media emulated, a hidden slide has computed `display: none`. A saved file keeps the `deck-hidden` class.
6. **Dark.** The `dark` class toggles on and off.
7. **Add from layout.** For each layout value, adding it inserts a slide with that `data-layout` right after the current slide. While editing, its `.ed` elements have `contenteditable="true"`.
8. **Notes.** `#deckNotes` shows the current slide's notes and updates when the current slide changes. Typing in it and then blurring it (or 600 ms without typing) writes the text into the slide's `aside.notes`, creating that element when the slide has none. Notes survive a save to file.
9. **Undo.** Each move, duplicate, delete, hide, dark toggle, add and notes edit is one undo step. Undo restores the slide count, order and classes from before the action, and the current slide index stays within range.
10. **Navigation while editing.** With edit mode on and focus on `<body>`, ArrowDown moves to the next slide, hidden slides included.
11. **M1 still holds.** Every M1 check keeps passing.
