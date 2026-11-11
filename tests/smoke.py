"""Smoke test of the student site in practice mode (no backend): sign in with a name, the home page lists every unit and
lesson ("coming soon" until a lesson file is loaded), and the first open lesson (if any) shows its first question.
Needs python3 -m http.server 8831 (repo root). SHOTS=dir for the screenshots (default /tmp/shots)."""
import asyncio, sys, os
from playwright.async_api import async_playwright
OUT=os.environ.get('SHOTS','/tmp/shots'); os.makedirs(OUT,exist_ok=True)
BASE=os.environ.get('BASE','http://localhost:8831/')
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        pg=await b.new_page(viewport={'width':1300,'height':900})
        errs=[]
        pg.on('pageerror',lambda e: errs.append(str(e)))
        pg.on('console',lambda m: errs.append('console:'+m.text) if m.type=='error' else None)
        await pg.route('**/cdn.jsdelivr.net/**', lambda r: r.abort())
        # practice mode: the real config.js has the class backend, so serve one with no backend
        await pg.route(BASE + 'js/config.js', lambda r: r.fulfill(status=200, content_type='application/javascript',
            body="var HW_CONFIG = { siteName: 'Math 20-1 Practice', backend: '' };"))
        await pg.goto(BASE)
        await pg.wait_for_selector('#nm',timeout=8000)
        await pg.fill('#nm','Test Student'); await pg.keyboard.press('Enter')
        await pg.wait_for_selector('.unit',timeout=8000)
        await pg.screenshot(path=OUT+'/home.png',full_page=True)
        n=await pg.evaluate("""() => ({ units: document.querySelectorAll('.unit').length, rows: document.querySelectorAll('.lesson-line').length,
          soon: document.querySelectorAll('.lr-soon').length, open: document.querySelectorAll('a.lesson-row').length,
          catalog: HW.CATALOG.reduce((s, u) => s + u.lessons.length, 0), built: Object.keys(HW.lessons).length })""")
        print('home', n)
        assert n['units']==len(await pg.evaluate("HW.CATALOG")), 'every unit on the home page'
        if n['open']:
            await pg.click('a.lesson-row')
            await pg.wait_for_selector('.qcard')
            await pg.screenshot(path=OUT+'/q1.png',full_page=True)
            print('first question:', (await pg.inner_text('.qcard'))[:80].replace('\n',' '))
        else:
            print('no lessons yet: every lesson shows as coming soon' if n['soon']==n['catalog'] else 'MISMATCH: coming soon %d of %d' % (n['soon'], n['catalog']))
        print('errors',errs)
        await b.close()
asyncio.run(main())
