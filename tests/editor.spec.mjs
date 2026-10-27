// Browser test for the deck editor, written against tests/CONTRACT.md (M1: foundation).
// Run: npm test (after npx playwright install chromium). Prints PASS/FAIL per check.
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const REF_DIR = fileURLToPath(new URL('../deck/references/', import.meta.url));
const DL_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'deck-editor-'));
const DECK_PATH = '/scaffold.html';
const ED = '.slide .ed'; // the first match is the text the test edits
const TIMEOUT = 5000;
const COMMIT_WAIT = 700; // contract: a text edit commits after 600 ms without typing
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png' };

// ---------- static server: /<file> from deck/references, /dl/<n>/<file> from the download dir ----------
const overrides = new Map(); // url path -> file on disk, to serve an old download at the deck's own URL
const inside = (root, rel) => {
  const p = path.resolve(root, rel);
  return p.startsWith(path.resolve(root) + path.sep) ? p : null;
};
const server = http.createServer((req, res) => {
  const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const file = overrides.get(p) ?? (p.startsWith('/dl/') ? inside(DL_DIR, p.slice(4)) : inside(REF_DIR, p.slice(1)));
  if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404).end('not found'); return; }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' });
  fs.createReadStream(file).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${server.address().port}`;
const DECK_URL = BASE + DECK_PATH;

// ---------- browser helpers ----------
const browser = await chromium.launch();

async function newContext() {
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, acceptDownloads: true });
  ctx.setDefaultTimeout(TIMEOUT);
  await ctx.addInitScript(() => { delete window.showSaveFilePicker; delete Window.prototype.showSaveFilePicker; });
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

// Click into the first .ed, replace its text, then Tab out so it commits.
async function editText(page, text) {
  await page.locator(ED).first().click();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.type(text);
  await page.keyboard.press('Tab');
  await page.waitForTimeout(COMMIT_WAIT);
}

// Pick the next option in a font <select>; returns the family name the CSS variable must contain.
async function pickFont(page, sel) {
  const { index, family } = await page.$eval(sel, s => {
    const i = (s.selectedIndex + 1) % s.options.length;
    const o = s.options[i];
    const fam = /[,'"]/.test(o.value) ? o.value.split(',')[0].replace(/['"]/g, '').trim() : o.textContent.trim();
    return { index: i, family: fam };
  });
  await page.selectOption(sel, { index });
  return family;
}

// Set the text-size slider to 110, or 90 if it is already 110; returns the expected --scale.
async function pickScale(page) {
  const slider = page.locator('#deckScale');
  const target = Number(await slider.inputValue()) === 110 ? 90 : 110;
  await slider.fill(String(target));
  return target / 100;
}

// Click the first swatch whose color differs from the current --accent; returns that color.
async function pickAccent(page) {
  const c = await page.evaluate(() => {
    const n = v => String(v).replace(/["'\s]/g, '').toLowerCase();
    const cur = n(getComputedStyle(document.documentElement).getPropertyValue('--accent'));
    return [...document.querySelectorAll('#deckSwatches button[data-c]')].map(b => b.dataset.c).find(c => n(c) !== cur);
  });
  assert.ok(c, 'no accent swatch differs from the current --accent');
  await page.click(`#deckSwatches button[data-c="${c}"]`);
  return c;
}

async function pickDesign(page) {
  return {
    display: await pickFont(page, '#deckFDisplay'),
    body: await pickFont(page, '#deckFBody'),
    scale: await pickScale(page),
    accent: await pickAccent(page),
  };
}

// Trigger a save and keep the downloaded file under /dl/<n>/<suggested name>.
let downloads = 0;
async function download(page, trigger) {
  const [d] = await Promise.all([page.waitForEvent('download', { timeout: TIMEOUT }), trigger()]);
  const dir = path.join(DL_DIR, String(++downloads));
  fs.mkdirSync(dir);
  const name = d.suggestedFilename();
  const file = path.join(dir, name);
  await d.saveAs(file);
  return { name, file, url: `${BASE}/dl/${downloads}/${encodeURIComponent(name)}` };
}

// ---------- state reading and comparison ----------
const FIELDS = ['text', 'display', 'body', 'scale', 'accent'];
const norm = v => String(v ?? '').replace(/["'\s]/g, '').toLowerCase();
const q = v => JSON.stringify(v);

const readState = page => page.evaluate(sel => {
  const cs = getComputedStyle(document.documentElement);
  const v = n => cs.getPropertyValue(n).trim();
  const ed = document.querySelector(sel);
  return { text: ed ? ed.textContent.trim() : null, display: v('--font-display'), body: v('--font-body'), scale: v('--scale'), accent: v('--accent') };
}, ED);

// State must reflect chosen values (fonts: variable contains the family name).
const wants = exp => s => {
  const p = [];
  if ('text' in exp && s.text !== exp.text) p.push(`text is ${q(s.text)}, want ${q(exp.text)}`);
  for (const [k, cssVar] of [['display', '--font-display'], ['body', '--font-body']])
    if (exp[k] && !norm(s[k]).includes(norm(exp[k]))) p.push(`${cssVar} is ${q(s[k])}, want it to contain ${q(exp[k])}`);
  if (exp.scale != null && !(Math.abs(parseFloat(s.scale) - exp.scale) < 1e-3)) p.push(`--scale is ${q(s.scale)}, want ${exp.scale}`);
  if (exp.accent && norm(s.accent) !== norm(exp.accent)) p.push(`--accent is ${q(s.accent)}, want ${q(exp.accent)}`);
  return p;
};

// State must equal an earlier snapshot.
const sameField = (k, a, b) => {
  if (k === 'text') return a === b;
  if (k === 'scale' && Number.isFinite(parseFloat(a)) && Number.isFinite(parseFloat(b))) return Math.abs(parseFloat(a) - parseFloat(b)) < 1e-3;
  return norm(a) === norm(b);
};
const same = snap => s => FIELDS.filter(k => !sameField(k, s[k], snap[k])).map(k => `${k} is ${q(s[k])}, want ${q(snap[k])}`);

async function expectState(page, test, label, timeout = 3000) {
  const end = Date.now() + timeout;
  let problems;
  for (;;) {
    problems = test(await readState(page));
    if (!problems.length) return;
    if (Date.now() > end) throw new Error(`${label}: ${problems.join('; ')}`);
    await page.waitForTimeout(100);
  }
}

const hasDisabled = (page, sel) => page.locator(sel).evaluate(el => el.hasAttribute('disabled'));
async function expectDisabled(page, sel, disabled, label) {
  await page.waitForFunction(([s, d]) => document.querySelector(s)?.hasAttribute('disabled') === d, [sel, disabled], { timeout: 2000 })
    .catch(() => { throw new Error(`${label}: ${sel} should ${disabled ? '' : 'not '}be disabled`); });
}

let originalState; // the fixture's untouched state, read once from a fresh context
async function original() {
  originalState ??= await withContext(async ctx => readState(await openDeck(ctx)));
  return originalState;
}

// ---------- checks ----------
const checks = [];
const check = (name, fn) => checks.push({ name, fn });
const shared = {};

check('elements: ids exist and edit mode toggles', () => withContext(async ctx => {
  const page = await openDeck(ctx);
  for (const id of ['#deckEdit', '#deckPanel', '#deckSave', '#deckUndo', '#deckRedo', '#deckReset', '#deckFDisplay', '#deckFBody', '#deckScale'])
    assert.equal(await page.locator(id).count(), 1, `${id} should exist exactly once`);
  assert.ok(await page.locator('#deckSwatches button[data-c]').count() > 0, 'no #deckSwatches button[data-c]');
  assert.ok(await page.locator('.ed').count() > 0, 'no .ed elements');
  for (const id of ['#deckFDisplay', '#deckFBody'])
    assert.equal(await page.$eval(id, el => el.tagName), 'SELECT', `${id} should be a <select>`);
  const range = await page.$eval('#deckScale', el => ({ type: el.type, min: el.min, max: el.max }));
  assert.deepEqual(range, { type: 'range', min: '80', max: '125' }, '#deckScale should be a range 80..125');
  assert.ok(await hasDisabled(page, '#deckUndo'), '#deckUndo should start disabled');
  assert.ok(await hasDisabled(page, '#deckRedo'), '#deckRedo should start disabled');

  const ui = () => page.evaluate(() => ({
    label: document.getElementById('deckEdit').textContent.trim(),
    editing: document.body.classList.contains('editing'),
    open: document.getElementById('deckPanel').classList.contains('open'),
    eds: [...document.querySelectorAll('.ed')].map(e => e.getAttribute('contenteditable')),
    ce: document.querySelectorAll('[contenteditable="true"]').length,
  }));
  let s = await ui();
  assert.ok(s.label === 'Edit' && !s.editing && !s.open && s.ce === 0, `off state wrong: ${q(s)}`);
  await enterEdit(page);
  s = await ui();
  assert.equal(s.label, 'Done', '#deckEdit should read Done while editing');
  assert.ok(s.open, '#deckPanel should have class open while editing');
  assert.ok(s.eds.every(v => v === 'true'), 'every .ed should be contenteditable="true" while editing');
  await exitEdit(page);
  s = await ui();
  assert.ok(s.label === 'Edit' && !s.open && s.ce === 0, `state after leaving edit mode wrong: ${q(s)}`);
}));

check('1 save-to-file: button and Cmd/Ctrl+S download scaffold.html', () => withContext(async ctx => {
  const page = await openDeck(ctx);
  await enterEdit(page);
  const text = 'Saved headline';
  await editText(page, text);
  const design = await pickDesign(page);
  // Move to slide 2 and stay in edit mode, so a clean saved file proves the editor cleaned it.
  await exitEdit(page);
  await page.keyboard.press('ArrowDown');
  await enterEdit(page);
  const saved = await download(page, () => page.click('#deckSave'));
  assert.equal(saved.name, 'scaffold.html', 'suggested file name from #deckSave');
  shared.saved = { ...saved, exp: { text, ...design } };
  await blurActive(page);
  const viaKey = await download(page, () => page.keyboard.press('ControlOrMeta+s'));
  assert.equal(viaKey.name, 'scaffold.html', 'suggested file name from Cmd/Ctrl+S');
}));

check('2 saved-file-holds-edits: text, fonts, scale, accent in a fresh context', () => withContext(async ctx => {
  assert.ok(shared.saved, 'no saved file (check 1 failed)');
  const page = await openDeck(ctx, shared.saved.url);
  await expectState(page, wants(shared.saved.exp), 'saved file');
}));

check('3 saved-file-opens-clean: no edit state, first slide active', async () => {
  assert.ok(shared.saved, 'no saved file (check 1 failed)');
  const inspect = doc => ({
    editing: doc.body.classList.contains('editing'),
    panelOpen: !!doc.getElementById('deckPanel')?.classList.contains('open'),
    contenteditable: doc.querySelectorAll('[contenteditable="true"]').length,
    active: [...doc.querySelectorAll('.slide')].flatMap((s, i) => s.classList.contains('active') ? [i] : []),
  });
  const want = { editing: false, panelOpen: false, contenteditable: 0, active: [0] };
  await withContext(async ctx => {
    const page = await openDeck(ctx, shared.saved.url);
    const html = fs.readFileSync(shared.saved.file, 'utf8');
    const raw = await page.evaluate(([h, f]) => new Function('doc', `return (${f})(doc)`)(new DOMParser().parseFromString(h, 'text/html')), [html, inspect.toString()]);
    assert.deepEqual(raw, want, `file markup not clean: ${q(raw)}`);
    const live = await page.evaluate(f => new Function('doc', `return (${f})(doc)`)(document), inspect.toString());
    assert.deepEqual(live, want, `loaded file not clean: ${q(live)}`);
  });
});

check('4 autosave: reload keeps text and design', () => withContext(async ctx => {
  const page = await openDeck(ctx);
  await enterEdit(page);
  const exp = { text: 'Autosaved headline' };
  await editText(page, exp.text);
  Object.assign(exp, await pickDesign(page));
  await page.waitForTimeout(COMMIT_WAIT);
  await page.reload({ waitUntil: 'load' });
  await expectState(page, wants(exp), 'after reload');
}));

check('5 older-file-ignores-newer-autosave: rev A file shows rev A', () => withContext(async ctx => {
  const page = await openDeck(ctx);
  await enterEdit(page);
  const a = { text: 'Revision A headline' };
  await editText(page, a.text);
  a.accent = await pickAccent(page);
  const fileA = await download(page, () => page.click('#deckSave'));
  const b = { text: 'Revision B headline' };
  await editText(page, b.text);
  b.accent = await pickAccent(page);
  await page.waitForTimeout(COMMIT_WAIT);
  const fileB = await download(page, () => page.click('#deckSave'));
  await page.close();

  const rev = p => p.locator('#deckStage').getAttribute('data-deck-rev');
  // Rev A served at the deck's own URL, where the rev B autosave lives.
  overrides.set(DECK_PATH, fileA.file);
  try {
    const p = await openDeck(ctx, DECK_URL);
    await expectState(p, wants(a), 'rev A file at the original URL');
    await p.close();
  } finally { overrides.delete(DECK_PATH); }
  const pa = await openDeck(ctx, fileA.url);
  await expectState(pa, wants(a), 'rev A file at its download URL');
  const revA = await rev(pa);
  const pb = await openDeck(ctx, fileB.url);
  await expectState(pb, wants(b), 'rev B file');
  const revB = await rev(pb);
  assert.ok(revA && revB && revA !== revB, `#deckStage data-deck-rev should be set and differ: A=${q(revA)} B=${q(revB)}`);
}));

check('6a undo-redo: buttons step through mixed text and design changes', () => withContext(async ctx => {
  const page = await openDeck(ctx);
  await enterEdit(page);
  const snaps = [await readState(page)];
  await editText(page, 'Undo step one'); snaps.push(await readState(page));
  await pickAccent(page); snaps.push(await readState(page));
  await editText(page, 'Undo step two'); snaps.push(await readState(page));
  await pickFont(page, '#deckFDisplay'); snaps.push(await readState(page));
  await pickScale(page); snaps.push(await readState(page));
  await expectDisabled(page, '#deckRedo', true, 'after changes');
  for (let i = snaps.length - 2; i >= 0; i--) {
    await page.click('#deckUndo');
    await expectState(page, same(snaps[i]), `after undo to step ${i}`);
  }
  await expectDisabled(page, '#deckUndo', true, 'after undoing everything');
  for (let i = 1; i < snaps.length; i++) {
    await page.click('#deckRedo');
    await expectState(page, same(snaps[i]), `after redo to step ${i}`);
  }
  await expectDisabled(page, '#deckRedo', true, 'after redoing everything');
  await expectDisabled(page, '#deckUndo', false, 'after redoing everything');
}));

check('6b undo-redo-keyboard: Cmd/Ctrl+Z and Cmd/Ctrl+Shift+Z outside contenteditable', () => withContext(async ctx => {
  const page = await openDeck(ctx);
  await enterEdit(page);
  const s0 = await readState(page);
  await editText(page, 'Keyboard undo text');
  const s1 = await readState(page);
  await pickAccent(page);
  const s2 = await readState(page);
  await blurActive(page);
  await page.keyboard.press('ControlOrMeta+KeyZ');
  await expectState(page, same(s1), 'after first Cmd/Ctrl+Z (accent)');
  await page.keyboard.press('ControlOrMeta+KeyZ');
  await expectState(page, same(s0), 'after second Cmd/Ctrl+Z (text)');
  await page.keyboard.press('ControlOrMeta+Shift+KeyZ');
  await expectState(page, same(s1), 'after first Cmd/Ctrl+Shift+Z');
  await page.keyboard.press('ControlOrMeta+Shift+KeyZ');
  await expectState(page, same(s2), 'after second Cmd/Ctrl+Shift+Z');
}));

check('6c undo-depth: at least 50 steps', () => withContext(async ctx => {
  const page = await openDeck(ctx);
  await enterEdit(page);
  const steps = [() => pickAccent(page), () => pickScale(page), () => pickFont(page, '#deckFDisplay'), () => pickFont(page, '#deckFBody')];
  const snaps = [await readState(page)];
  for (let i = 0; i < 55; i++) { await steps[i % steps.length](); snaps.push(await readState(page)); }
  for (let i = 0; i < 50; i++) await page.click('#deckUndo');
  await expectState(page, same(snaps[5]), 'after 55 changes and 50 undos');
  for (let i = 0; i < 50; i++) await page.click('#deckRedo');
  await expectState(page, same(snaps[55]), 'after 50 redos');
}));

check('7 reset: clears autosave and restores the original deck', async () => {
  const orig = await original();
  await withContext(async ctx => {
    const page = await openDeck(ctx);
    await enterEdit(page);
    const exp = { text: 'About to be reset' };
    await editText(page, exp.text);
    Object.assign(exp, await pickDesign(page));
    await page.waitForTimeout(COMMIT_WAIT);
    await page.reload({ waitUntil: 'load' });
    await expectState(page, wants(exp), 'precondition: edits autosaved');
    await enterEdit(page);
    const loaded = page.waitForEvent('load');
    await page.click('#deckReset');
    await loaded;
    await expectState(page, same(orig), 'after reset');
    await page.reload({ waitUntil: 'load' });
    await expectState(page, same(orig), 'after a second reload');
  });
});

check('8 panel-headings: none uppercase', () => withContext(async ctx => {
  const page = await openDeck(ctx);
  await enterEdit(page);
  const upper = await page.$$eval('#deckPanel :is(h1, h2, h3, h4, h5, h6, [role="heading"])',
    hs => hs.filter(h => getComputedStyle(h).textTransform === 'uppercase').map(h => h.textContent.trim()));
  assert.deepEqual(upper, [], `uppercase headings: ${q(upper)}`);
}));

check('9 navigation: ArrowDown moves active from slide 1 to slide 2', () => withContext(async ctx => {
  const page = await openDeck(ctx);
  assert.ok(!(await isEditing(page)), 'deck should open outside edit mode');
  const activeIdx = () => page.$$eval('.slide', ss => ss.flatMap((s, i) => s.classList.contains('active') ? [i] : []));
  assert.deepEqual(await activeIdx(), [0], 'slide 1 should be the only active slide at start');
  await page.keyboard.press('ArrowDown');
  await page.waitForFunction(() => {
    const ss = document.querySelectorAll('.slide');
    return ss[1]?.classList.contains('active') && !ss[0].classList.contains('active');
  }, null, { timeout: 2000 }).catch(async () => { throw new Error(`active slides after ArrowDown: ${q(await activeIdx())}`); });
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
