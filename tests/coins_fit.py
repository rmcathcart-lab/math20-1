"""Coin designs (js/coins.js): one design per Math 20-1 outcome, different outlines and enamel colours for outcomes taught
in the same unit, and everything struck or engraved sits where it belongs at every level (the art is the same at every
level but Blank, which is unstruck):
  - the symbol and code on the obverse stay inside the core (inside its raised lip),
  - the lettering around the ring ("MATH 20-1 · AN2" on the obverse; the course name and the outcome's label on the
    reverse) stays on the ring: outside the enamel band and clear of the bead ring and rim, for every outline,
  - the reverse's mint mark and code stay inside the core, and the seven pips sit on the ring.
Prints the pixels out of place for each outcome. With --sheet <tier> (0 Blank … 6 Proof) it also draws a contact sheet of
every outcome at that level to SHOTS/coins_sheet_<tier>.png (default /tmp). Needs the static server on 8831:
python3 tests/coins_fit.py [--sheet 6]"""
import asyncio, os, sys
from playwright.async_api import async_playwright
OUT = os.environ.get('SHOTS', '/tmp'); BASE = os.environ.get('BASE', 'http://localhost:8831/')
FONTS = '/home/claude/math10c/assets/outline/fonts/barlow-condensed-latin-%s-normal.woff2'   # the real font, if it's here
JS = r"""() => {
  const M = HW.Coins, Gm = M._geom, N = 512, C = N / 2, S = N / 1024, out = { far: {}, missing: [], extra: [], sameShape: [], sameColour: [] };
  const outs = Object.keys(HW.OUTCOMES).filter(o => !HW.NO_LEVEL[o]), D = M.DESIGNS;
  outs.forEach(o => { if (!D[o]) out.missing.push(o); else if (!M._icons[D[o].i]) out.missing.push(o + ' (symbol ' + D[o].i + ')'); });
  Object.keys(D).forEach(o => { if (outs.indexOf(o) < 0) out.extra.push(o); });
  const cols = {}; Object.keys(D).forEach(o => { (cols[D[o].c] = cols[D[o].c] || []).push(o); }); Object.values(cols).forEach(l => { if (l.length > 1) out.sameColour.push(l.join('/')); });
  HW.CATALOG.forEach(u => { const os = u.outcomes.split(/\s*·\s*/), seen = {}, sc = {}; os.forEach(o => { if (!D[o]) return; const s = JSON.stringify(D[o].s); if (seen[s]) out.sameShape.push('Unit ' + u.unit + ': ' + seen[s] + '/' + o); seen[s] = o; }); });
  for (const o of Object.keys(D)) {
    const pts = M._outline(D[o].s);
    // distance in from the edge, for a point (in coin units)
    const inFrom = (x, y) => { let best = 1e9; for (let k = 0; k < pts.length; k++) { const a = pts[k], b = pts[(k + 1) % pts.length], dx = b[0] - a[0], dy = b[1] - a[1], t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy))); best = Math.min(best, Math.hypot(x - a[0] - t * dx, y - a[1] - t * dy)); } return best; };
    const count = (part, ok) => {
      const c = document.createElement('canvas'); c.width = c.height = N; const x = c.getContext('2d'); x.scale(S, S); M._art(o, x, part);
      const d = x.getImageData(0, 0, N, N).data; let bad = 0, n = 0;
      for (let i = 0; i < N * N; i++) if (d[i * 4 + 3] > 100) { n++; const px = (i % N + 0.5 - C) / C, py = (C - Math.floor(i / N) - 0.5) / C; if (!ok(Math.hypot(px, py), px, py)) bad++; }
      return [bad, n];
    };
    const ring = (r, px, py) => r > Gm.RING_IN + 0.004 && inFrom(px, py) > 0.106;          // on the ring, inside the bead ring (u = 0.09 ± 0.0105)
    const core = r => r < Gm.CORE_IN - 0.004;
    const f = count('core', core), rg = count('ring', ring), bk = count('back', (r, px, py) => r < Gm.RC ? core(r) : ring(r, px, py));
    let pips = 0; M._pipSpots(7).forEach(p => { const r = Math.hypot(p[0], p[1]); if (r - Gm.PIP_SIZE < Gm.RING_IN + 0.004 || inFrom(p[0], p[1]) - Gm.PIP_SIZE < 0.106) pips++; });
    out.far[o] = { core: f, ring: rg, back: bk, pips: pips };
  }
  return out;
}"""
async def fonts(pg):
    if not os.path.exists(FONTS % '800'): await pg.route('**/fonts.googleapis.com/**', lambda r: r.abort()); return
    css = ''.join("@font-face{font-family:'Barlow Condensed';font-style:normal;font-weight:%s;src:url(https://fonts.gstatic.com/x/%s.woff2) format('woff2')}" % (w, w) for w in ('700', '800'))
    await pg.route('**/fonts.googleapis.com/**', lambda r: r.fulfill(status=200, content_type='text/css', body=css))
    await pg.route('**/fonts.gstatic.com/x/*.woff2', lambda r: r.fulfill(status=200, content_type='font/woff2', body=open(FONTS % r.request.url.split('/')[-1][:3], 'rb').read()))
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
        pg = await b.new_page(viewport={'width': 1300, 'height': 900}, device_scale_factor=1); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e))); pg.set_default_timeout(900000)
        await pg.route('**/script.google.com/**', lambda r: r.abort()); await pg.route('**/cdn.jsdelivr.net/**', lambda r: r.abort()); await fonts(pg)
        await pg.route('**/js/config.js', lambda r: r.fulfill(status=200, content_type='application/javascript', body="var HW_CONFIG = { siteName: 'Math 20-1 Practice', backend: '' };"))
        await pg.goto(BASE); await pg.wait_for_function('window.HW && HW.Coins && HW.CATALOG')
        await pg.evaluate("Promise.all(['700', '800'].map(w => document.fonts.load(w + ' 100px \"Barlow Condensed\"')))")
        r = await pg.evaluate(JS)
        print('designs:', len(r['far']), '| missing:', r['missing'], '| not an outcome:', r['extra'])
        print('same enamel colour:', r['sameColour'], '| same outline in a unit:', r['sameShape'])
        bad = {}
        for o, v in r['far'].items():
            print('%-5s core %4d of %6d   ring %4d of %6d   reverse %4d of %6d   pips off the ring %d' % (o, v['core'][0], v['core'][1], v['ring'][0], v['ring'][1], v['back'][0], v['back'][1], v['pips']))
            if v['core'][0] or v['ring'][0] or v['back'][0] or v['pips'] or not v['core'][1]: bad[o] = v
        ok = not bad and not r['missing'] and not r['extra'] and not r['sameColour'] and not r['sameShape']
        if '--sheet' in sys.argv:
            tier = int(sys.argv[sys.argv.index('--sheet') + 1])
            # one coin at a time (big quality), each copied into an image, so a slow (software) renderer copes
            await pg.evaluate("""async (tier) => { document.body.className = ''; document.body.innerHTML = '<div id=g style="display:inline-grid;grid-template-columns:repeat(5,170px);gap:8px;padding:12px;background:#2a0a16;font:600 13px system-ui;color:#f3dfe5;text-align:center"></div><div id=host></div>';
              const gEl = document.getElementById('g'), host = document.getElementById('host'), frames = k => new Promise(r => { const f = () => (--k <= 0 ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); });
              for (const o of Object.keys(HW.Coins.DESIGNS)) {
                const c = HW.Coins.slot(o, tier, { big: true, drag: true }); c._coin.hold = 0; c._coin.holdX = 0.08; c.style.width = c.style.height = '170px'; host.appendChild(c);
                while (!HW.Coins._built(o, tier, true)) await new Promise(r => setTimeout(r, 150));
                await frames(4); const cell = document.createElement('div'), im = new Image(); im.src = c.toDataURL(); im.style.cssText = 'width:170px;height:170px;display:block';
                cell.appendChild(im); cell.appendChild(document.createTextNode(o)); gEl.appendChild(cell); c.remove();
              } }""", tier)
            await pg.locator('#g').screenshot(path=OUT + '/coins_sheet_%d.png' % tier); print('sheet:', OUT + '/coins_sheet_%d.png' % tier)
        print('errors', errs); ok = ok and not errs
        print('PASS' if ok else 'FAIL'); await b.close()
asyncio.run(main())
