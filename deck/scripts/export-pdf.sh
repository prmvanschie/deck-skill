#!/usr/bin/env bash
# export-pdf.sh — render a single-file deck to a one-slide-per-page PDF.
#
#   bash export-pdf.sh <deck.html> [out.pdf] [--compact]
#
# Headless Chromium (Playwright) screenshots each .slide at 1920x1080 (or
# 1280x720 with --compact) and assembles a landscape PDF. Animations are
# captured at their final state. First run installs Playwright + Chromium.
# Adapted (reimplemented) from the MIT-licensed frontend-slides exporter.
set -euo pipefail

W=1920; H=1080
ARGS=()
for a in "$@"; do
  case "$a" in
    --compact) W=1280; H=720 ;;
    *) ARGS+=("$a") ;;
  esac
done
set -- ${ARGS[@]+"${ARGS[@]}"}

[ $# -ge 1 ] || { echo "usage: bash export-pdf.sh <deck.html> [out.pdf] [--compact]" >&2; exit 1; }
IN="$1"
[ -f "$IN" ] || { echo "not found: $IN" >&2; exit 1; }
IN="$(cd "$(dirname "$IN")" && pwd)/$(basename "$IN")"
OUT="${2:-${IN%.html}.pdf}"
OUT="$(cd "$(dirname "$OUT")" && pwd)/$(basename "$OUT")"

command -v npx >/dev/null || { echo "Node.js required (brew install node)" >&2; exit 1; }

TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
SERVE_DIR="$(dirname "$IN")"; FILE="$(basename "$IN")"
printf '{ "name":"deck-export","private":true,"type":"module" }' > "$TMP/package.json"

cat > "$TMP/run.mjs" <<'JS'
import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFileSync } from 'fs';
import { join, extname } from 'path';

const [serveDir, file, out, wS, hS] = process.argv.slice(2);
const W = +wS, H = +hS;
const MIME = { '.html':'text/html','.css':'text/css','.js':'application/javascript','.json':'application/json',
  '.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.gif':'image/gif','.svg':'image/svg+xml',
  '.webp':'image/webp','.woff':'font/woff','.woff2':'font/woff2','.ttf':'font/ttf' };
const server = createServer((req,res)=>{
  try { const p = join(serveDir, decodeURIComponent(req.url)==='/'?file:decodeURIComponent(req.url));
    const c = readFileSync(p); res.writeHead(200,{'Content-Type':MIME[extname(p).toLowerCase()]||'application/octet-stream'}); res.end(c);
  } catch { res.writeHead(404); res.end('nf'); }
});
const port = await new Promise(r=>server.listen(0,()=>r(server.address().port)));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport:{ width:W, height:H } });
await page.goto(`http://localhost:${port}/`, { waitUntil:'networkidle' });
await page.evaluate(()=>document.fonts && document.fonts.ready);
// Hide the deck's own controls (edit button, panel, dot nav, keyboard hint) so they stay out of the PDF.
await page.addStyleTag({ content: '.deck-chrome,.deck-editbtn,.deck-panel,.deck-tip{display:none!important}' });
await page.waitForTimeout(1200);
const n = await page.evaluate(()=>document.querySelectorAll('.slide:not(.deck-hidden)').length);
if (!n) { console.error('No .slide elements found.'); await browser.close(); server.close(); process.exit(1); }

const shots = [];
for (let i=0;i<n;i++){
  await page.evaluate((idx)=>{
    const s = document.querySelectorAll('.slide:not(.deck-hidden)');
    s.forEach((el,j)=>{ const on=j===idx;
      el.classList.toggle('active',on); el.classList.toggle('visible',on);
      el.style.visibility = on?'visible':'hidden'; el.style.opacity = on?'1':'0';
    });
    document.querySelectorAll('.slide:not(.deck-hidden)')[idx].querySelectorAll('.reveal').forEach(e=>{e.style.opacity='1';e.style.transform='none';});
    document.querySelectorAll('.slide:not(.deck-hidden)')[idx].querySelectorAll('[data-draw]').forEach(e=>{e.style.strokeDashoffset='0';});
  }, i);
  await page.waitForTimeout(450);
  const b = await page.screenshot({ type:'png' });
  shots.push(b.toString('base64'));
  console.log(`  slide ${i+1}/${n}`);
}
await browser.close(); server.close();

const html = `<!doctype html><style>*{margin:0}@page{size:${W}px ${H}px;margin:0}
.p{width:${W}px;height:${H}px;page-break-after:always}.p:last-child{page-break-after:auto}
img{width:${W}px;height:${H}px;display:block}</style>`
+ shots.map(b=>`<div class="p"><img src="data:image/png;base64,${b}"></div>`).join('');
const b2 = await chromium.launch(); const pg = await b2.newPage();
await pg.setContent(html,{waitUntil:'load'});
await pg.pdf({ path:out, width:`${W}px`, height:`${H}px`, printBackground:true, margin:{top:0,right:0,bottom:0,left:0} });
await b2.close();
console.log('PDF: '+out);
JS

echo "Setting up Playwright (first run downloads Chromium, ~30-60s)…"
( cd "$TMP" && npm install playwright >/dev/null 2>&1 && npx playwright install chromium >/dev/null 2>&1 ) \
  || { echo "Playwright setup failed. Try: npx playwright install chromium" >&2; exit 1; }

node "$TMP/run.mjs" "$SERVE_DIR" "$FILE" "$OUT" "$W" "$H"
echo "Done → $OUT ($(du -h "$OUT" | cut -f1 | xargs))"
command -v open >/dev/null && open "$OUT" || true
