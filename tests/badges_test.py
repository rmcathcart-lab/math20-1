"""The retired outcome badges (js/badges.js, no longer loaded by the site: the coins in js/coins.js replaced them; this test
loads badges.js into the page itself): one design per Math 20-1 outcome, every symbol inside the face (the running stitch at
radius 29.5), different shapes for outcomes taught in the same unit, and the viewer (the badge on a sash, with the seven
levels) opens and closes. Writes a contact sheet of every badge and a screenshot of the sash to OUT (default /tmp/badges).
Needs the static server on 8831: python3 tests/badges_test.py"""
import asyncio, os
from playwright.async_api import async_playwright
OUT = os.environ.get('SHOTS', '/tmp/badges'); os.makedirs(OUT, exist_ok=True)
BASE = os.environ.get('BASE', 'http://localhost:8831/')
CHECK = r"""() => {
  const D = HW.Badges.DESIGNS, out = { missing: [], extra: [], far: {}, sameShape: [], sameColour: [] };
  const outs = Object.keys(HW.OUTCOMES).filter(o => !HW.NO_LEVEL[o]);
  outs.forEach(o => { if (!D[o]) out.missing.push(o); else if (!HW.Badges._icons[D[o].i]) out.missing.push(o + ' (symbol ' + D[o].i + ')'); });
  Object.keys(D).forEach(o => { if (outs.indexOf(o) < 0) out.extra.push(o); });
  const cols = {}; Object.keys(D).forEach(o => { (cols[D[o].f] = cols[D[o].f] || []).push(o); }); Object.values(cols).forEach(l => { if (l.length > 1) out.sameColour.push(l.join('/')); });
  HW.CATALOG.forEach(u => { const os = u.outcomes.split(/\s*·\s*/), seen = {}; os.forEach(o => { const s = D[o] && D[o].s; if (seen[s]) out.sameShape.push('Unit ' + u.unit + ': ' + seen[s] + '/' + o + ' (' + s + ')'); seen[s] = o; }); });
  // every point of every symbol stroke (plus half its width) stays inside the face
  const box = document.createElement('div'); document.body.appendChild(box);
  Object.keys(D).forEach(o => {
    box.innerHTML = HW.Badges.svg(o, 4, 200);
    const g = box.querySelector('g[stroke-linecap]'), m = g.getCTM(), sv = box.querySelector('svg'), sm = sv.getCTM().inverse();
    let worst = 0;
    g.querySelectorAll('path').forEach(p => {
      const L = p.getTotalLength(), w = Number(p.getAttribute('stroke-width')) / 2 * 0.92;
      for (let k = 0; k <= 60; k++) { const q = p.getPointAtLength(L * k / 60), a = new DOMPoint(q.x, q.y).matrixTransform(m).matrixTransform(sm); worst = Math.max(worst, Math.hypot(a.x - 50, a.y - 50) + w); }
    });
    out.far[o] = Math.round(worst * 10) / 10;
  });
  box.remove();
  return out;
}"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': 1100, 'height': 900}); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.route('**/cdn.jsdelivr.net/**', lambda r: r.abort())
        await pg.goto(BASE); await pg.wait_for_function('window.HW && HW.Coins && HW.CATALOG')
        await pg.add_script_tag(url=BASE + 'js/badges.js'); await pg.wait_for_function('!!(HW.Badges && HW.Badges.svg)')
        r = await pg.evaluate(CHECK)
        print('designs:', len(r['far']), '| missing:', r['missing'], '| not an outcome:', r['extra'])
        print('same twill colour:', r['sameColour'], '| same shape in a unit:', r['sameShape'])
        far = {o: v for o, v in r['far'].items() if v > 31}
        print('symbol reach (radius incl. stroke):', r['far']); print('outside the face (> 31):', far)
        ok = not r['missing'] and not r['extra'] and not r['sameColour'] and not r['sameShape'] and not far
        # contact sheet: every badge at Gold, and one outcome at all seven levels
        await pg.evaluate("""() => { document.body.innerHTML = '<div id=g style="display:grid;grid-template-columns:repeat(7,140px);gap:6px;padding:10px;background:#efe7d6"></div>';
          const g = document.getElementById('g'); Object.keys(HW.Badges.DESIGNS).forEach(o => { const d = document.createElement('div'); d.innerHTML = HW.Badges.svg(o, 4, 140); g.appendChild(d); });
          for (let t = 0; t < 7; t++) { const d = document.createElement('div'); d.innerHTML = HW.Badges.svg('RF9', t, 140); g.appendChild(d); } }""")
        await pg.wait_for_timeout(300); await pg.locator('#g').screenshot(path=OUT + '/badges_sheet.png')
        # the viewer: a badge on the sash with its seven levels; arrows step through the list; Esc closes
        await pg.evaluate("HW.Badges.open([{ o: 'RF9', tier: 4, src: 'from practice' }, { o: 'AN2', tier: 6 }, { o: 'T3', tier: 1 }], 0, { title: 'New badges!' })")
        await pg.wait_for_selector('.badge-pop .badge-ladder')
        got = await pg.evaluate("[...document.querySelectorAll('.badge-rung')].map(r => r.classList.contains('got') ? 1 : 0).join('')"); print('ladder:', got); ok = ok and got == '1111100'
        await pg.wait_for_timeout(300); await pg.screenshot(path=OUT + '/badges_sash.png')
        await pg.keyboard.press('ArrowRight'); await pg.wait_for_timeout(200); print('next:', await pg.inner_text('.badge-level'))
        await pg.keyboard.press('Escape'); ok = ok and await pg.locator('.badge-pop').count() == 0
        print('errors', errs); ok = ok and not errs
        print('PASS' if ok else 'FAIL'); await b.close()
asyncio.run(main())
