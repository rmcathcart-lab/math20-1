"""Coins on the student home page, in practice mode (no backend: HW_CONFIG.backend = ''), with a mix of levels across Units 1 and 2:
  - a new student: Unit 1 has started, so RF9 and RF10 begin as Blanks (shown faintly, no pop-up),
  - practice on Unit 1 strikes RF9 → "New coin!" opens big (the device had seen the Blanks); Esc closes,
  - a device that has never shown coins just remembers what there is (no pop-up),
  - more practice (RF10 → Gold, and Unit 2's AN2 → Bronze) plus a released exit slip (stubbed, RF9 → Two-Tone) → "New coins!",
  - tapping a coin opens the viewer: the seven levels, the ones reached lit; tapping a passed level shows it big,
    the levels not reached can't be tapped, the X is centred, Next steps through, X closes; nothing new → no pop-up.
Screenshots (small) in SHOTS (default /tmp): coins_head.png, coins_new.png, coins_viewer.png.
Needs the static server on 8831: python3 tests/coins_home_test.py"""
import asyncio, os
from playwright.async_api import async_playwright
BASE = os.environ.get('BASE', 'http://localhost:8831/'); OUT = os.environ.get('SHOTS', '/tmp')
FONTS = '/home/claude/math10c/assets/outline/fonts/barlow-condensed-latin-%s-normal.woff2'   # the real font, if it's here
FILL = """([lid, n]) => { const S = HW.App.state(), L = HW.lessons[lid]; S.lessons[lid] = S.lessons[lid] || { items: {}, qv: {}, cur: null, secs: 0, updated: 0 };
  L.items.filter(it => !it.extra).slice(0, n).forEach(it => { S.lessons[lid].items[it.id] = { s: 'done', v: 0, tv: 0, wrong: 0, steps: 0, forms: 0, reveals: 0, credit: 'first', secs: 30, at: Date.now(), prac: 0, done: Date.now() }; });
  S.lessons[lid].updated = Date.now(); HW.App.save(); return L.items.filter(it => !it.extra).slice(0, n).map(it => it.level).join(' '); }"""
async def coins(page): return await page.evaluate("[...document.querySelectorAll('.hh-coins .coin-btn')].map(b => b.title + (b.classList.contains('is-new') ? ' (new)' : ''))")
async def home(page): await page.evaluate("location.hash = '#/x'; location.hash = '#/'")
async def main():
    errs = []
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
        ctx = await b.new_context(viewport={'width': 1100, 'height': 760}, device_scale_factor=1)
        await ctx.route('**/script.google.com/**', lambda r: r.abort()); await ctx.route('**/cdn.jsdelivr.net/**', lambda r: r.abort())
        await ctx.route('**/js/config.js', lambda r: r.fulfill(status=200, content_type='application/javascript', body="var HW_CONFIG = { siteName: 'Math 20-1 Practice', backend: '' };"))
        if os.path.exists(FONTS % '800'):
            css = ''.join("@font-face{font-family:'Barlow Condensed';font-style:normal;font-weight:%s;src:url(https://fonts.gstatic.com/x/%s.woff2) format('woff2')}" % (w, w) for w in ('700', '800'))
            await ctx.route('**/fonts.googleapis.com/**', lambda r: r.fulfill(status=200, content_type='text/css', body=css))
            await ctx.route('**/fonts.gstatic.com/x/*.woff2', lambda r: r.fulfill(status=200, content_type='font/woff2', body=open(FONTS % r.request.url.split('/')[-1][:3], 'rb').read()))
        else: await ctx.route('**/fonts.googleapis.com/**', lambda r: r.abort())
        a = await ctx.new_page(); a.set_default_timeout(180000)
        a.on('pageerror', lambda e: errs.append(str(e))); a.on('dialog', lambda d: errs.append('dialog ' + d.message))
        await a.goto(BASE); await a.fill('#nm', 'Ava Brown'); await a.click('.btn-primary'); await a.wait_for_selector('.lesson-row')
        await a.wait_for_timeout(1500); m = await coins(a); print('start:', m)
        assert m == ['RF9 · Blank · Not meeting', 'RF10 · Blank · Not meeting'], m           # Unit 1 has started, no practice yet
        assert await a.locator('.coin-btn.is-blank').count() == 2
        assert await a.locator('.coin-pop').count() == 0, 'a Blank should not pop up'
        print('RF9 levels done:', await a.evaluate(FILL, ['u1l1', 4]))
        await home(a); await a.wait_for_selector('.coin-pop', timeout=20000)
        m = await coins(a); print('after practice:', m); assert m[0].startswith('RF9 · Sterling · Emerging') and m[1].startswith('RF10 · Blank'), m
        t = await a.inner_text('.coin-pop'); assert 'new coin!' in t.lower(), t
        await a.keyboard.press('Escape'); assert await a.locator('.coin-pop').count() == 0
        # a device that has never shown coins just remembers what there is: no pop-up
        await a.evaluate("Object.keys(localStorage).filter(k => k.indexOf('hw:medals:') >= 0).forEach(k => localStorage.removeItem(k))")
        await home(a); await a.wait_for_timeout(2500)
        assert await a.locator('.coin-pop').count() == 0, 'the first time on a device should be quiet'
        # RF10 and AN2 from practice (Unit 2 starts), and a released exit slip on RF9 (stubbed): a mix of levels
        print('RF10 levels:', await a.evaluate(FILL, ['u1l5', 9]))
        print('AN2 levels:', await a.evaluate(FILL, ['u2l1', 3]))
        print(await a.evaluate("""() => { const ex = HW.EXITS && HW.EXITS.u1l1, def = { title: 'Exit slip 1.1', kind: 'exit', items: [{ l: 'u1l1', i: '1a' }] };
          HW.TestCore.summary = ((orig) => (d, marks) => d === def ? { levels: { RF9: 'ADV' } } : orig(d, marks))(HW.TestCore.summary);
          HW.TestMode.loadResults = () => Promise.resolve([{ id: 'X1', kind: 'exit', title: 'Exit slip 1.1', def, marks: 'c', launched: Date.now() }]);
          return 'exit slip stubbed: RF9 ADV'; }"""))
        await home(a); await a.wait_for_selector('.coin-pop', timeout=20000)
        m = await coins(a); print('now:', m)
        t = await a.inner_text('.coin-pop'); print('pop-up:', ' | '.join(t.split('\n')[:5]))
        assert 'new coins!' in t.lower(), t
        assert m == ['RF9 · Two-Tone · Advancing', 'RF10 · Gold · Progressing', 'AN2 · Bronze · Beginning'], m
        await a.wait_for_function("HW.Coins._built(document.querySelector('.coin-hero')._coin.o, document.querySelector('.coin-hero')._coin.tier, true)", polling=1000)
        await a.wait_for_timeout(2500); await a.screenshot(path=OUT + '/coins_new.png')
        await a.keyboard.press('Escape'); assert await a.locator('.coin-pop').count() == 0
        await a.wait_for_function("[...document.querySelectorAll('.hh-coins canvas')].every(c => c._coin && HW.Coins._built(c._coin.o, c._coin.tier, false))", polling=1000)
        await a.wait_for_timeout(1500); await a.locator('.home-head').screenshot(path=OUT + '/coins_head.png')
        await a.click('.hh-coins .coin-btn >> nth=0'); await a.wait_for_selector('.coin-pop .coin-ladder')
        got = await a.evaluate("[...document.querySelectorAll('.coin-rung')].map(r => r.className.includes('got') ? 1 : 0).join('')"); print('ladder:', got); assert got == '1111110', got
        await a.click('.coin-rung.got >> nth=1'); await a.wait_for_timeout(400)            # a level already passed becomes the big one
        print('picked:', await a.inner_text('.coin-metal'), '|', await a.inner_text('.coin-alloy'), '|', await a.inner_text('.coin-level')); assert (await a.inner_text('.coin-metal')) == 'Nickel'
        assert await a.evaluate("[...document.querySelectorAll('.coin-rung')].findIndex(r => r.classList.contains('here'))") == 1
        assert await a.locator('div.coin-rung').count() == 1                               # the level not reached can't be tapped
        xb = await a.evaluate("(() => { const b = document.querySelector('.coin-x').getBoundingClientRect(), s = document.querySelector('.coin-x svg').getBoundingClientRect(); return [Math.round((s.left + s.width / 2) - (b.left + b.width / 2)), Math.round((s.top + s.height / 2) - (b.top + b.height / 2))]; })()")
        print('X off centre by', xb); assert xb == [0, 0]
        await a.click('.coin-next'); await a.wait_for_timeout(500); print('next:', await a.inner_text('.coin-metal'), '|', await a.inner_text('.coin-level'))
        await a.wait_for_function("HW.Coins._built(document.querySelector('.coin-hero')._coin.o, document.querySelector('.coin-hero')._coin.tier, true)", polling=1000)
        await a.wait_for_timeout(2500); await a.screenshot(path=OUT + '/coins_viewer.png')
        await a.click('.coin-x'); assert await a.locator('.coin-pop').count() == 0
        await home(a); await a.wait_for_timeout(3000)                                       # back again: nothing new, no pop-up
        assert await a.locator('.coin-pop').count() == 0
        await b.close()
    errs = [e for e in errs if 'favicon' not in e]
    print('errors:', errs); assert not errs; print('PASS')
asyncio.run(main())
