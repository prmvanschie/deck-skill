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
