// Browser test for the deck editor, written against tests/CONTRACT.md (M2: structure).
// Run: npm test (after npx playwright install chromium). Prints PASS/FAIL per check.
// M2 point 11 ("M1 still holds") is covered by editor.spec.mjs.
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const REF_DIR = fileURLToPath(new URL('../deck/references/', import.meta.url));
const DL_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'deck-editor-m2-'));
const TIMEOUT = 5000;
const COMMIT_WAIT = 700; // contract: an edit commits after 600 ms without typing
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png' };
const REQUIRED_LAYOUTS = ['title', 'statement', 'bullets', 'two-columns', 'divider'];
const M2_IDS = ['#deckSlidePos', '#deckSlideUp', '#deckSlideDown', '#deckSlideDup', '#deckSlideDel', '#deckSlideHide', '#deckSlideDark', '#deckLayout', '#deckSlideAdd', '#deckNotes'];

// ---------- static server: /<file> from deck/references, /dl/<n>/<file> from the download dir ----------
const inside = (root, rel) => {
  const p = path.resolve(root, rel);
  return p.startsWith(path.resolve(root) + path.sep) ? p : null;
};
const server = http.createServer((req, res) => {
  const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const file = p.startsWith('/dl/') ? inside(DL_DIR, p.slice(4)) : inside(REF_DIR, p.slice(1));
  if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404).end('not found'); return; }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' });
  fs.createReadStream(file).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${server.address().port}`;
const DECK_URL = BASE + '/scaffold.html';

// ---------- browser helpers ----------
const browser = await chromium.launch();

async function newContext() {
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, acceptDownloads: true });
  ctx.setDefaultTimeout(TIMEOUT);
  await ctx.addInitScript(() => {
    delete window.showSaveFilePicker; delete Window.prototype.showSaveFilePicker;
    // The deck's slides: every .slide outside the edit panel (template content is never matched).
    window.__slides = () => [...document.querySelectorAll('.slide')].filter(s => !s.closest('#deckPanel'));
  });
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort()); // keep the run offline and fast
  ctx.on('page', p => p.on('dialog', d => d.accept()));
  return ctx;
}

async function withContext(fn) {
  const ctx = await newContext();
  try { return await fn(ctx); } finally { await ctx.close(); }
}

async function openDeck(ctx, url = DECK_URL) {
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'load' });
  await page.locator('.slide').first().waitFor({ state: 'attached' });
  return page;
}

const isEditing = page => page.evaluate(() => document.body.classList.contains('editing'));

async function enterEdit(page) {
  if (await isEditing(page)) return;
  await page.click('#deckEdit');
  await page.waitForFunction(() => document.body.classList.contains('editing'));
}

async function exitEdit(page) {
  if (!(await isEditing(page))) return;
  await page.click('#deckEdit');
  await page.waitForFunction(() => !document.body.classList.contains('editing'));
}

const blurActive = page => page.evaluate(() => document.activeElement?.blur());

let downloads = 0;
async function download(page, trigger) {
  const [d] = await Promise.all([page.waitForEvent('download', { timeout: TIMEOUT }), trigger()]);
  const dir = path.join(DL_DIR, String(++downloads));
  fs.mkdirSync(dir);
  const name = d.suggestedFilename();
  await d.saveAs(path.join(dir, name));
  return `${BASE}/dl/${downloads}/${encodeURIComponent(name)}`;
}

// ---------- deck state ----------
const q = v => JSON.stringify(v);
const ok = (cond, msg) => (cond ? null : msg);

const deckState = page => page.evaluate(() => {
  const ss = window.__slides();
  const norm = t => (t ?? '').replace(/\s+/g, ' ').trim();
  return {
    count: ss.length,
    active: ss.flatMap((s, i) => (s.classList.contains('active') ? [i] : [])),
    pos: norm(document.getElementById('deckSlidePos')?.textContent),
    slides: ss.map(s => ({
      text: norm(s.textContent),
      layout: s.getAttribute('data-layout'),
      hidden: s.classList.contains('deck-hidden'),
      dark: s.classList.contains('dark'),
      notesCount: s.querySelectorAll('aside.notes').length,
      notes: s.querySelector('aside.notes') ? norm(s.querySelector('aside.notes').textContent) : null,
    })),
  };
});

// One string per slide: layout, hidden/dark classes and text (which includes the notes).
const sigs = s => s.slides.map(x => [x.layout ?? '', x.hidden ? 'hidden' : '', x.dark ? 'dark' : '', x.text].join('|'));
const short = list => q(list.map(x => (x.length > 48 ? x.slice(0, 45) + '...' : x)));
const without = (list, i) => list.filter((_, j) => j !== i);
const sameList = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);
const posIs = (s, n, m) => ok(new RegExp(`\\bSlide ${n} of ${m}\\b`).test(s.pos), `#deckSlidePos reads ${q(s.pos)}, want "Slide ${n} of ${m}"`);
const currentIs = (s, i) => ok(s.active.length === 1 && s.active[0] === i, `current slide is ${q(s.active.map(a => a + 1))}, want ${i + 1}`);

// Poll the deck until test(state) reports no problems; returns the passing state.
async function until(page, label, test, timeout = 3000) {
  const end = Date.now() + timeout;
  for (;;) {
    const s = await deckState(page);
    const problems = test(s).filter(Boolean);
    if (!problems.length) return s;
    if (Date.now() > end) throw new Error(`${label}: ${problems.join('; ')}`);
    await page.waitForTimeout(100);
  }
}

const activeIdx = page => page.evaluate(() => window.__slides().findIndex(s => s.classList.contains('active')));

// Press a key and wait until the current slide changes.
async function step(page, key) {
  const before = await activeIdx(page);
  await page.keyboard.press(key);
  await page.waitForFunction(b => window.__slides().findIndex(s => s.classList.contains('active')) !== b, before, { timeout: 2000 })
    .catch(() => { throw new Error(`${key} did not leave slide ${before + 1}`); });
}

// Make slide idx (0-based) current via the deck's own navigation outside edit mode, then return to edit mode.
// Only used while no slide before idx is hidden.
async function goTo(page, idx) {
  await exitEdit(page);
  await blurActive(page);
  while ((await activeIdx(page)) > 0) await step(page, 'ArrowUp');
  for (let i = 0; i < idx; i++) await step(page, 'ArrowDown');
  assert.equal(await activeIdx(page), idx, `could not navigate to slide ${idx + 1}`);
  await enterEdit(page);
}

// In edit mode: add slides from layouts until the deck has at least n.
async function ensureSlides(page, n) {
  const layouts = await page.$$eval('#deckLayout option', os => os.map(o => o.value));
  for (let s = await deckState(page); s.count < n; ) {
    await page.selectOption('#deckLayout', layouts[s.count % layouts.length]);
    await page.click('#deckSlideAdd');
    const want = s.count + 1;
    s = await until(page, 'setup: add a slide', t => [ok(t.count === want, `count is ${t.count}, want ${want}`)]);
  }
}

async function expectDisabled(page, sel, disabled, label) {
  await page.waitForFunction(([s, d]) => document.querySelector(s)?.hasAttribute('disabled') === d, [sel, disabled], { timeout: 2000 })
    .catch(() => { throw new Error(`${label}: ${sel} should ${disabled ? '' : 'not '}be disabled`); });
}

async function expectNotes(page, want, label) {
  await page.waitForFunction(w => document.getElementById('deckNotes')?.value.replace(/\s+/g, ' ').trim() === w, want, { timeout: 2000 })
    .catch(async () => { throw new Error(`${label}: #deckNotes is ${q(await page.inputValue('#deckNotes'))}, want ${q(want)}`); });
}

const savedState = url => withContext(async ctx => deckState(await openDeck(ctx, url)));

async function setup(ctx, minSlides = 3) {
  const page = await openDeck(ctx);
  await enterEdit(page);
  await ensureSlides(page, minSlides);
  return page;
}

// ---------- checks ----------
const checks = [];
const check = (name, fn) => checks.push({ name, fn });

check('elements: M2 ids exist and #deckLayout matches the layout template', () => withContext(async ctx => {
  const page = await openDeck(ctx);
  for (const id of M2_IDS) assert.equal(await page.locator(id).count(), 1, `${id} should exist exactly once`);
  assert.equal(await page.$eval('#deckLayout', el => el.tagName), 'SELECT', '#deckLayout should be a <select>');
  assert.equal(await page.$eval('#deckNotes', el => el.tagName), 'TEXTAREA', '#deckNotes should be a <textarea>');
  const tpl = await page.evaluate(() => {
    const t = document.querySelector('template#deckLayouts');
    return t ? [...t.content.querySelectorAll('section.slide[data-layout]')].map(s => s.getAttribute('data-layout')) : null;
  });
  assert.ok(tpl, 'no <template id="deckLayouts">');
  for (const l of REQUIRED_LAYOUTS) assert.ok(tpl.includes(l), `#deckLayouts has no ${q(l)} layout (has ${q(tpl)})`);
  const opts = await page.$$eval('#deckLayout option', os => os.map(o => o.value));
  assert.deepEqual([...opts].sort(), [...tpl].sort(), `#deckLayout options ${q(opts)} should be the template layouts ${q(tpl)}`);
}));

check('1 position: #deckSlidePos follows navigation and structure changes', () => withContext(async ctx => {
  const page = await setup(ctx);
  const n = (await deckState(page)).count;
  await goTo(page, 0);
  await until(page, 'on slide 1', s => [posIs(s, 1, n)]);
  await goTo(page, 1);
  await until(page, 'after navigating to slide 2', s => [posIs(s, 2, n)]);
  await page.click('#deckSlideDup');
  await until(page, 'after duplicate', s => [posIs(s, 3, n + 1)]);
  await page.click('#deckSlideDel');
  await until(page, 'after delete', s => [posIs(s, 3, n)]);
  await page.click('#deckSlideUp');
  await until(page, 'after move up', s => [posIs(s, 2, n)]);
  await blurActive(page);
  await page.keyboard.press('ArrowDown');
  await until(page, 'after ArrowDown in edit mode', s => [posIs(s, 3, n)]);
}));

check('2 move: slide 2 down to 3 and back up, staying current', () => withContext(async ctx => {
  const page = await setup(ctx);
  await goTo(page, 1);
  const before = await deckState(page);
  const texts = before.slides.map(x => x.text);
  assert.equal(new Set(texts.slice(0, 3)).size, 3, `precondition: slides 1-3 need distinct text, got ${short(texts.slice(0, 3))}`);
  await expectDisabled(page, '#deckSlideUp', false, 'on slide 2');
  await expectDisabled(page, '#deckSlideDown', false, 'on slide 2');
  const moved = [texts[0], texts[2], texts[1], ...texts.slice(3)];
  await page.click('#deckSlideDown');
  await until(page, 'after move down', s => [
    ok(sameList(s.slides.map(x => x.text), moved), `order is ${short(s.slides.map(x => x.text))}, want ${short(moved)}`),
    currentIs(s, 2), posIs(s, 3, before.count),
  ]);
  await page.click('#deckSlideUp');
  await until(page, 'after move up', s => [
    ok(sameList(s.slides.map(x => x.text), texts), `order is ${short(s.slides.map(x => x.text))}, want ${short(texts)}`),
    currentIs(s, 1), posIs(s, 2, before.count),
  ]);
  await goTo(page, 0);
  await expectDisabled(page, '#deckSlideUp', true, 'on the first slide');
  await goTo(page, before.count - 1);
  await expectDisabled(page, '#deckSlideDown', true, 'on the last slide');
}));

check('3 duplicate: copy inserted right after, same text, becomes current', () => withContext(async ctx => {
  const page = await setup(ctx);
  await goTo(page, 1);
  const before = await deckState(page);
  await page.click('#deckSlideDup');
  await until(page, 'after duplicate', s => [
    ok(s.count === before.count + 1, `count is ${s.count}, want ${before.count + 1}`),
    currentIs(s, 2),
    ok(s.slides[2]?.text === before.slides[1].text, `copy text is ${short([s.slides[2]?.text ?? ''])}, want ${short([before.slides[1].text])}`),
    ok(sameList(without(sigs(s), 2), sigs(before)), 'the other slides changed'),
  ]);
}));

check('4 delete: slide and its text gone, neighbour current, disabled at one slide, no dialog', () => withContext(async ctx => {
  const page = await setup(ctx);
  let dialogs = 0;
  page.on('dialog', () => dialogs++);
  await goTo(page, 1);
  const before = await deckState(page);
  const gone = before.slides[1].text;
  assert.equal(before.slides.filter(x => x.text === gone).length, 1, 'precondition: slide 2 text should be unique');
  await page.click('#deckSlideDel');
  let s = await until(page, 'after deleting slide 2', t => [
    ok(t.count === before.count - 1, `count is ${t.count}, want ${before.count - 1}`),
    ok(!t.slides.some(x => x.text === gone), 'deleted slide text still present'),
    ok(sameList(sigs(t), without(sigs(before), 1)), `slides are ${short(sigs(t))}`),
    currentIs(t, 1),
  ]);
  await goTo(page, s.count - 1);
  const n = s.count;
  await page.click('#deckSlideDel');
  s = await until(page, 'after deleting the last slide', t => [ok(t.count === n - 1, `count is ${t.count}, want ${n - 1}`), currentIs(t, n - 2)]);
  while (s.count > 1) {
    const c = s.count;
    await expectDisabled(page, '#deckSlideDel', false, `with ${c} slides`);
    await page.click('#deckSlideDel');
    s = await until(page, `delete down to ${c - 1}`, t => [ok(t.count === c - 1, `count is ${t.count}, want ${c - 1}`)]);
  }
  await expectDisabled(page, '#deckSlideDel', true, 'with one slide left');
  assert.equal(dialogs, 0, 'delete should not open a dialog');
}));

check('5 hide: editable while editing, skipped by navigation, display none in print, kept in saved file', () => withContext(async ctx => {
  const page = await setup(ctx);
  await goTo(page, 1);
  await page.click('#deckSlideHide');
  const s = await until(page, 'after hide', t => [ok(t.slides[1].hidden, 'slide 2 should have class deck-hidden'), currentIs(t, 1), posIs(t, 2, t.count)]);
  const shown = await page.evaluate(() => {
    const sl = window.__slides()[1];
    return { display: getComputedStyle(sl).display, eds: [...sl.querySelectorAll('.ed')].map(e => e.getAttribute('contenteditable')) };
  });
  assert.notEqual(shown.display, 'none', 'hidden slide should stay visible in edit mode');
  assert.ok(shown.eds.every(v => v === 'true'), `hidden slide .ed elements should be contenteditable="true", got ${q(shown.eds)}`);

  await exitEdit(page);
  await blurActive(page);
  await step(page, 'ArrowUp');
  await until(page, 'back on slide 1', t => [currentIs(t, 0)]);
  await step(page, 'ArrowDown');
  await until(page, 'ArrowDown outside edit mode should skip hidden slide 2', t => [currentIs(t, 2)]);

  await page.emulateMedia({ media: 'print' });
  const printDisplay = await page.evaluate(() => getComputedStyle(window.__slides()[1]).display);
  await page.emulateMedia({ media: 'screen' });
  assert.equal(printDisplay, 'none', 'hidden slide in print media');

  await enterEdit(page);
  const url = await download(page, () => page.click('#deckSave'));
  const saved = await savedState(url);
  assert.deepEqual(saved.slides.map(x => x.hidden), s.slides.map(x => x.hidden), 'deck-hidden classes in the saved file');
}));

check('6 dark: class toggles on and off, and autosaves', () => withContext(async ctx => {
  const page = await setup(ctx, 1);
  const i = await activeIdx(page);
  const initial = (await deckState(page)).slides[i].dark;
  await page.click('#deckSlideDark');
  await until(page, 'after first toggle', s => [ok(s.slides[i].dark === !initial, `dark is ${s.slides[i].dark}, want ${!initial}`)]);
  await page.click('#deckSlideDark');
  await until(page, 'after second toggle', s => [ok(s.slides[i].dark === initial, `dark is ${s.slides[i].dark}, want ${initial}`)]);
  await page.click('#deckSlideDark');
  await until(page, 'after third toggle', s => [ok(s.slides[i].dark === !initial, 'toggle did not apply')]);
  await page.waitForTimeout(COMMIT_WAIT);
  await page.reload({ waitUntil: 'load' });
  await until(page, 'after reload', s => [ok(s.slides[i]?.dark === !initial, 'dark toggle was not autosaved')]);
}));

check('7 add-from-layout: every layout inserts after current, keeps data-layout, editable', () => withContext(async ctx => {
  const page = await setup(ctx, 1);
  const layouts = await page.$$eval('#deckLayout option', os => os.map(o => o.value));
  assert.ok(layouts.length > 0, '#deckLayout has no options');
  for (const layout of layouts) {
    const before = await deckState(page);
    const cur = before.active[0];
    await page.selectOption('#deckLayout', layout);
    await page.click('#deckSlideAdd');
    await until(page, `add ${q(layout)}`, s => [
      ok(s.count === before.count + 1, `count is ${s.count}, want ${before.count + 1}`),
      currentIs(s, cur + 1),
      ok(s.slides[cur + 1]?.layout === layout, `new slide data-layout is ${q(s.slides[cur + 1]?.layout)}, want ${q(layout)}`),
      ok(sameList(without(sigs(s), cur + 1), sigs(before)), 'the other slides changed'),
    ]);
    const eds = await page.evaluate(i => [...window.__slides()[i].querySelectorAll('.ed')].map(e => e.getAttribute('contenteditable')), cur + 1);
    assert.ok(eds.every(v => v === 'true'), `${q(layout)} slide .ed elements should be contenteditable="true", got ${q(eds)}`);
  }
}));

check('8 notes: textarea follows current slide, writes aside.notes on blur and after 600 ms, saved to file', () => withContext(async ctx => {
  const page = await setup(ctx);
  await goTo(page, 0);
  let s = await deckState(page);
  await expectNotes(page, s.slides[0].notes ?? '', 'on slide 1');
  // Slide 3 gets no notes element, so the editor has to create one.
  await page.evaluate(() => window.__slides()[2].querySelectorAll('aside.notes').forEach(a => a.remove()));
  await goTo(page, 1);
  s = await deckState(page);
  await expectNotes(page, s.slides[1].notes ?? '', 'on slide 2');

  const viaBlur = 'Notes written then blurred';
  await page.fill('#deckNotes', viaBlur);
  await blurActive(page);
  await until(page, 'slide 2 notes after blur', t => [ok(t.slides[1].notes === viaBlur, `aside.notes is ${q(t.slides[1].notes)}, want ${q(viaBlur)}`)]);

  await goTo(page, 2);
  await expectNotes(page, '', 'on slide 3 without notes');
  const viaPause = 'Notes committed by pause';
  await page.click('#deckNotes');
  await page.keyboard.type(viaPause);
  await page.waitForTimeout(COMMIT_WAIT);
  await until(page, 'slide 3 notes after 600 ms without typing', t => [
    ok(t.slides[2].notesCount === 1, `slide 3 has ${t.slides[2].notesCount} aside.notes, want 1`),
    ok(t.slides[2].notes === viaPause, `aside.notes is ${q(t.slides[2].notes)}, want ${q(viaPause)}`),
  ]);
  await goTo(page, 1);
  await expectNotes(page, viaBlur, 'back on slide 2');

  const url = await download(page, () => page.click('#deckSave'));
  const saved = await savedState(url);
  assert.equal(saved.slides[1]?.notes, viaBlur, 'slide 2 notes in the saved file');
  assert.equal(saved.slides[2]?.notes, viaPause, 'slide 3 notes in the saved file');
}));

check('9 undo: each structure action is one step, restoring count, order and classes', () => withContext(async ctx => {
  const page = await setup(ctx);
  await goTo(page, 1);
  const actions = [
    ['move down', () => page.click('#deckSlideDown')],
    ['duplicate', () => page.click('#deckSlideDup')],
    ['hide', () => page.click('#deckSlideHide')],
    ['dark', () => page.click('#deckSlideDark')],
    ['add', async () => { await page.selectOption('#deckLayout', { index: 0 }); await page.click('#deckSlideAdd'); }],
    ['notes', async () => { await page.fill('#deckNotes', 'Notes for the undo check'); await blurActive(page); }],
    ['delete', () => page.click('#deckSlideDel')],
  ];
  const snaps = [await deckState(page)];
  for (const [name, act] of actions) {
    const prev = sigs(snaps.at(-1));
    await act();
    snaps.push(await until(page, `${name} (setup)`, s => [ok(!sameList(sigs(s), prev), 'deck did not change')]));
  }
  for (let i = actions.length - 1; i >= 0; i--) {
    await page.click('#deckUndo');
    await until(page, `undo ${actions[i][0]}`, s => [
      ok(s.count === snaps[i].count, `count is ${s.count}, want ${snaps[i].count}`),
      ok(sameList(sigs(s), sigs(snaps[i])), `slides are ${short(sigs(s))}, want ${short(sigs(snaps[i]))}`),
      ok(s.active.length === 1 && s.active[0] < s.count, `current slide out of range: ${q(s.active)} of ${s.count}`),
    ]);
  }
}));

check('10 navigation-while-editing: ArrowDown from <body> visits every slide, hidden included', () => withContext(async ctx => {
  const page = await setup(ctx);
  await goTo(page, 1);
  await page.click('#deckSlideHide');
  await until(page, 'hide slide 2', s => [ok(s.slides[1].hidden, 'slide 2 should have class deck-hidden')]);
  await exitEdit(page);
  await blurActive(page);
  await step(page, 'ArrowUp');
  await enterEdit(page);
  const n = (await until(page, 'back on slide 1', s => [currentIs(s, 0)])).count;
  for (let i = 1; i < n; i++) {
    await blurActive(page);
    assert.equal(await page.evaluate(() => document.activeElement === document.body), true, 'focus should be on <body>');
    await page.keyboard.press('ArrowDown');
    await until(page, `ArrowDown #${i} while editing`, s => [currentIs(s, i), posIs(s, i + 1, n)]);
  }
}));

// ---------- run ----------
let failed = 0;
try {
  for (const { name, fn } of checks) {
    try {
      await fn();
      console.log(`PASS ${name}`);
    } catch (e) {
      failed++;
      console.log(`FAIL ${name}: ${String(e?.message ?? e).replace(/\s*\n\s*/g, ' ')}`);
    }
  }
} finally {
  await browser.close();
  server.close();
  fs.rmSync(DL_DIR, { recursive: true, force: true });
}
console.log(`\n${checks.length - failed}/${checks.length} checks passed`);
process.exit(failed ? 1 : 0);
