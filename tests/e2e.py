"""End-to-end: a student signs in with the mock ledger (class list, PIN), sees the units, answers the first question of
the first open lesson (if any lesson is built yet: wrong, then right; then leaves the page for new numbers), uses the
calculator (degree-mode trig), signs in on a second device with the PIN, then every Teacher Ledger tab is opened.
answer() / ladder() / tree() below answer any question by input type, for lesson-specific checks.
Needs: python3 -m http.server 8831 (repo root) and node backend/mock_server.js 8835."""
import asyncio, os, json, urllib.request
from playwright.async_api import async_playwright
OUT = os.environ.get('SHOTS', '/tmp/shots'); os.makedirs(OUT, exist_ok=True)
BASE = 'http://localhost:8831/'; MOCK = 'http://localhost:8835/'
CONFIG = "var HW_CONFIG = { siteName: 'Math 20-1 Practice', backend: '%s' };" % MOCK

def stats(): return json.loads(urllib.request.urlopen(MOCK + '__stats').read())

async def setup(page, errs):
    page.on('pageerror', lambda e: errs.append('pageerror: ' + str(e)))
    page.on('console', lambda m: errs.append('console: ' + m.text) if m.type == 'error' and 'jsdelivr' not in m.text and 'ERR_FAILED' not in m.text else None)
    await page.route('**/cdn.jsdelivr.net/**', lambda r: r.abort())
    await page.route('**/fonts.googleapis.com/**', lambda r: r.abort())
    await page.route('**/cdnjs.cloudflare.com/**', lambda r: r.abort())
    await page.route(BASE + 'js/config.js', lambda r: r.fulfill(status=200, content_type='application/javascript', body=CONFIG))

async def inst(page): return await page.evaluate("HW.App.cur().inst ? {key: HW.App.cur().inst.key, type: HW.App.cur().inst.input.type, n: HW.App.cur().inst.input.n, opts: HW.App.cur().inst.input.options} : null")
async def goto_item(page, id): await page.evaluate("location.hash = '#/lesson/u1l1/%s'" % id); await page.wait_for_timeout(250)
async def fb(page): return await page.evaluate("(document.querySelector('.qcard .feedback')||{}).className + ' | ' + ((document.querySelector('.qcard .feedback')||{}).innerText||'')")

async def answer(page, i, right=True):
    t = i['type']; key = i['key']
    if t == 'list':
        vals = key if right else key[:-1] + [9999]
        for v in vals: await page.fill('.chip-input', str(v)); await page.keyboard.press(',')
    elif t == 'number':
        await page.fill('.w-number input', key if right else str(int(float(key)) + 1))
    elif t == 'math':
        await page.fill('.w-math input', key.replace('\\times ', '*').replace('^{', '^').replace('}', '') if right else '2*3')
    elif t == 'mc':
        k = key if right else [o['key'] for o in i['opts'] if o['key'] != key][0]
        await page.click('.mc-opt:has(.mc-key:text-is("%s"))' % k)
    elif t == 'classify':
        if right and key['choice'] == 'prime': await page.click('.cls-btn:has-text("Prime")')
        elif right: await page.click('.cls-btn:has-text("Composite")'); ins = page.locator('.cls-proof input'); await ins.nth(0).fill(key['a']); await ins.nth(1).fill(key['b'])
        else: await page.click('.cls-btn:has-text("%s")' % ('Composite' if key['choice'] == 'prime' else 'Prime'))
        if not right and key['choice'] == 'prime': ins = page.locator('.cls-proof input'); await ins.nth(0).fill('3'); await ins.nth(1).fill('7')
    elif t == 'select':
        for v in key: await page.click('.sel-chip >> text="%s"' % v)
    elif t == 'pairs':
        for j, p in enumerate(key if right else key[1:]):
            rows = page.locator('.pair-row')
            if await rows.count() <= j: await page.click('text=+ Add another pair')
            r = page.locator('.pair-row').nth(j); ins = r.locator('input'); await ins.nth(0).fill(p[0]); await ins.nth(1).fill(p[1])
    await page.click('.btn-check')
    await page.wait_for_timeout(200)

async def ladder(page, n, mistakes=True):
    import math
    def spf(x):
        p = 2
        while p * p <= x:
            if x % p == 0: return p
            p += 1
        return x
    cur = n; first = True
    while cur > 1:
        d = spf(cur)
        if mistakes and first:
            await page.fill('.ldiv input', '4'); await page.fill('.lnum input', str(cur // 4 if cur % 4 == 0 else 1)); await page.click('.lgo'); await page.wait_for_timeout(150)
            print('   ladder step hint:', (await fb(page))[:120])
            first = False
        await page.fill('.ldiv input', str(d)); await page.fill('.lnum input', str(cur // d)); await page.click('.lgo'); await page.wait_for_timeout(120)
        cur //= d

async def tree(page, n):
    def spf(x):
        p = 2
        while p * p <= x:
            if x % p == 0: return p
            p += 1
        return x
    for _ in range(40):
        opens = page.locator('.tlabel.open')
        if await opens.count() == 0: break
        lab = opens.first; v = int(await lab.get_attribute('data-v'))
        await lab.click(); await page.wait_for_timeout(80)
        p = spf(v)
        if p == v: await page.click('.tcircle')
        else:
            ins = page.locator('.tsplit input'); await ins.nth(0).fill(str(p)); await ins.nth(1).fill(str(v // p)); await page.click('.tsplit .btn')
        await page.wait_for_timeout(80)

async def main():
    errs = []
    async with async_playwright() as p:
        b = await p.chromium.launch()
        ctx = await b.new_context(viewport={'width': 1300, 'height': 950})
        page = await ctx.new_page(); await setup(page, errs)
        await page.goto(BASE + '?class=10c-b')
        await page.wait_for_selector('.name-btn', timeout=10000)
        await page.screenshot(path=OUT + '/e2e_names.png')
        await page.click('.name-btn:has-text("Ava Brown")')
        pins = page.locator('.field.pin'); await pins.nth(0).fill('1234'); await pins.nth(1).fill('1234')
        await page.click('.btn-primary'); await page.wait_for_selector('.unit')
        home = await page.evaluate("({ units: document.querySelectorAll('.unit').length, open: document.querySelectorAll('a.lesson-row').length, soon: document.querySelectorAll('.lr-soon').length })")
        print('home:', home); assert home['units'] == 8, home
        if home['open']:
            first = await page.evaluate("(document.querySelector('a.lesson-row').getAttribute('href')||'').replace(/^#\\/lesson\\//, '').split('/')[0]")
            await page.click('a.lesson-row'); await page.wait_for_selector('.qcard')
            # the sidebar starts with a link to the lesson on the teaching site (if it has one), for this student's block (10c-b → B)
            tl = await page.evaluate("[(document.querySelector('.qnav a.teach-link')||{}).href || '', HW.TEACHING.lessons.indexOf('%s') >= 0]" % first)
            print('lesson', first, '| teaching link:', tl[0] or '(none: no teaching page yet)')
            if tl[1]: assert tl[0].endswith('/?class=B'), tl
            i = await inst(page)
            if i and i['type'] in ('list', 'number', 'mc'):
                await answer(page, i, False); print('first item wrong ->', (await fb(page))[:120])
                await page.evaluate("location.hash = location.hash"); i = await inst(page)
                if i['type'] == 'list': await page.evaluate("document.querySelectorAll('.chip .chip-x').forEach(function (x) { x.click(); })")
                await answer(page, i); print('first item right ->', (await fb(page))[:60])
            else: print('first item type', i and i['type'], '(answer it in a lesson-specific test)')
            before = await page.evaluate("HW.App.cur().inst && HW.App.cur().inst.prompt")
            await page.evaluate("Object.defineProperty(document,'hasFocus',{value:()=>false,configurable:true}); window.dispatchEvent(new Event('blur'))"); await page.wait_for_timeout(1700)
            await page.evaluate("Object.defineProperty(document,'hasFocus',{value:()=>true,configurable:true}); window.dispatchEvent(new Event('focus'))"); await page.wait_for_timeout(300)
            notice = await page.evaluate("(document.querySelector('.notice.warn')||{}).innerText")
            print('leave: new numbers' if (await page.evaluate("HW.App.cur().inst && HW.App.cur().inst.prompt")) != before else 'leave: same numbers (the question may have no random numbers)', '| notice:', (notice or '')[:80])
            await page.evaluate("location.hash = '#/'"); await page.wait_for_selector('.unit')
        # calculator: order of operations, and trig in degree mode (sin opens a bracket like the real one)
        await page.click('.top-calc'); await page.wait_for_selector('.calc:not(.hidden)')
        async def keys(ks):
            for k in ks: await page.click('.ck[data-a="%s"]' % k)
            return (await page.inner_text('.calc-l1')) + ' = ' + (await page.inner_text('.calc-l2'))
        print('calc:', await keys(['7', '6', '5', '0', 'div', '2', 'enter']))
        r = await keys(['clear', 'clear', 'sin', '3', '0', 'rp', 'enter']); print('calc:', r); assert r.strip().endswith('0.5'), r
        await page.screenshot(path=OUT + '/e2e_calc.png')
        await page.click('.calc-close')
        await page.evaluate("HW.Ledger.flush()"); await page.wait_for_timeout(800)
        await page.screenshot(path=OUT + '/e2e_home.png')

        # second device: sign in with the PIN
        p2 = await ctx.browser.new_page(); await setup(p2, errs)
        await p2.goto(BASE + '?class=10c-b'); await p2.wait_for_selector('.name-btn'); await p2.click('.name-btn:has-text("Ava Brown")')
        await p2.fill('.field.pin', '9999'); await p2.click('.btn-primary'); await p2.wait_for_timeout(300); print('bad pin ->', await p2.inner_text('.form-err'))
        await p2.fill('.field.pin', '1234'); await p2.click('.btn-primary'); await p2.wait_for_selector('.unit'); await p2.wait_for_timeout(800)
        print('device 2 signed in:', await p2.evaluate("!!document.querySelector('.unit')"))

        s = stats()['sheets']
        print('sheets rows:', {k: len(v) for k, v in s.items()})
        print('events:', [r[5] for r in s['Events'][1:]][:12])

        # teacher dashboard
        t = await ctx.browser.new_page(viewport={'width': 1400, 'height': 1000}); await setup(t, errs)
        await t.goto(BASE + 'teacher/'); await t.evaluate("localStorage.setItem('hw:tkey','testkey'); localStorage.setItem('hw:ttab','live'); localStorage.setItem('hw:nodemo','1')"); await t.goto(BASE + 'teacher/?class=10c-b')
        await t.wait_for_selector('.tab', timeout=10000); await t.wait_for_timeout(800); await t.screenshot(path=OUT + '/dash_live.png', full_page=True)
        tabs = await t.evaluate("[...document.querySelectorAll('.tab')].map(function (x) { return x.textContent.trim(); })"); print('tabs:', tabs)
        for tab in tabs:
            await t.click('.tab >> nth=%d' % tabs.index(tab)); await t.wait_for_timeout(500)
            await t.screenshot(path=OUT + '/dash_%s.png' % ''.join(c for c in tab.lower() if c.isalnum())[:20], full_page=True)
        print('ERRORS:', errs)
        await b.close()
asyncio.run(main())
