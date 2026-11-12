"""Math 20-1 lesson format (Ryan, 2026-11-11). Same format as Math 15's Class view, but Math 20-1 has ONLY the class
version: material that Math 15 keeps as "Full notes" is removed from the page (it stays in git history and, where it is
booklet content, in the booklet).

  python3 tools/newformat/restructure.py u3l5 [u3l6 ...]

Each lesson has a spec file tools/newformat/specs/<key>.py that defines SPEC (see specs/README.md for every field).
The script always rebuilds the page from the ORIGINAL kept in tools/newformat/orig/<key>.html (copied there on the
first run), so it can be re-run after editing the spec. Hand edits to a converted index.html are lost on the next
run: put them in the spec (`replace`) instead.

What it does:
  * removes the old warm-up card (data-ink="warm", plus any cards in `drop_with_warm`);
  * removes explainers named in `drop_expl` (and `drop_expl_with_prev`: also the lead-in <p> just before it),
    whole cards (`drop_cards`, by data-ink), exact strings (`drop_str`) and every "Think" part (unless think=False);
  * applies `replace` / `replace_all` (exact string pairs);
  * puts the NEW warm-up card first (above the title card): one clear question, picture beside it, the twist only
    behind Reveal, and an optional small moving strip in the top-right corner;
  * adds at most one green practice-break card after `practice['after']` and renames the summary's assignment card
    "Assignment N · Questions <rest>";
  * links lessons/css/format.css.
"""
import re, sys, os, importlib.util
HERE = os.path.dirname(os.path.abspath(__file__)); REPO = os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, HERE)
T = lambda x: '<span class="tex">%s</span>' % x


def load(key):
    p = f'{HERE}/specs/{key}.py'
    spec = importlib.util.spec_from_file_location(f'spec_{key}', p); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    return m.SPEC


def run(key):
    sp = load(key); u, l = re.match(r'u(\d+)l(\d+)$', key).groups()
    path = f'{REPO}/lessons/u{u}/l{l}/index.html'; orig = f'{HERE}/orig/{key}.html'
    if not os.path.exists(orig):
        os.makedirs(f'{HERE}/orig', exist_ok=True); open(orig, 'w').write(open(path).read())
    s = open(orig).read()
    assert 'format.css' not in s, 'orig already converted'

    def rep(a, b, n=1):
        nonlocal s
        assert s.count(a) == n, (key, a[:90], s.count(a)); s = s.replace(a, b)

    def sec_span(ink):
        m = re.search(r'<section class="[^"]*"[^>]*data-ink="%s"[^>]*>' % re.escape(ink), s); assert m, (key, 'no card', ink)
        i = m.start()
        # take the "<!-- ==== ... ==== -->" comment line just above the card with it
        cm = s.rfind('<!--', 0, i)
        if cm != -1 and s[cm:i].strip().endswith('-->') and s[cm:i].count('\n') <= 2 and '<section' not in s[cm:i]:
            i = cm
        return i, s.index('</section>', m.start()) + len('</section>')

    def cut(i, j):
        nonlocal s
        s = s[:i].rstrip() + '\n\n' + s[j:].lstrip('\n')

    css = f'<link rel="stylesheet" href="../../css/lessons/{key}.css">'
    rep(css, css + '\n<link rel="stylesheet" href="../../css/format.css">')

    # --- removals
    for name in sp.get('drop_expl', []) + sp.get('drop_expl_with_prev', []):
        ms = list(re.finditer(r'[ \t]*<div class="explainer[^"]*"[^>]*data-explainer="%s"[^>]*></div>\n?' % re.escape(name), s))
        assert len(ms) == 1, (key, 'explainer', name, len(ms))
        i, j = ms[0].start(), ms[0].end()
        if name in sp.get('drop_expl_with_prev', []):
            before = s[:i].rstrip(); assert before.endswith('</p>'), (key, name, before[-90:])
            i = before.rindex('<p')
            while i > 0 and s[i - 1] in ' \t': i -= 1
        s = s[:i] + s[j:]
    for a in sp.get('drop_str', []):
        rep(a, '')
    for ink in sp.get('drop_cards', []):
        i, j = sec_span(ink); cut(i, j)
    if sp.get('think', True):
        while True:
            m = re.search(r'[ \t]*<div class="part think[^"]*"', s)
            if not m: break
            # find the matching </div> for this part
            k, depth = m.end(), 1
            while depth:
                o, c = s.find('<div', k), s.find('</div>', k)
                if o != -1 and o < c: depth += 1; k = o + 4
                else: depth -= 1; k = c + 6
            s = s[:m.start()] + s[k:].lstrip('\n')
    for a, b in sp.get('replace', []):
        rep(a, b)
    for a, b in sp.get('replace_all', []):
        assert a in s, (key, 'replace_all', a[:60]); s = s.replace(a, b)

    # --- old warm-up out, new warm-up first
    i, j = sec_span('warm'); cut(i, j)
    for ink in sp.get('drop_with_warm', []):
        i, j = sec_span(ink); cut(i, j)
    w = sp['warm']
    reveal = f'''
  <div class="bk-wq vw-rev"><div class="q-line"><div class="q-num">?</div><div>{w.get('nudge', 'Convince the person beside you.')}</div><button class="pill small" type="button" data-bk-toggle>Reveal</button></div>
    <div class="bk-ans">{w['reveal']}</div></div>'''
    pic = f'<div class="vw-art">{w["pic"]}</div>' if w.get('pic') else ''
    if w.get('ctx') is not None:          # text style: the situation, then the question, picture beside
        ctx = ''.join(f'<p class="vw-ctx">{c}</p>' for c in ([w['ctx']] if isinstance(w['ctx'], str) else w['ctx']))
        inner = f'<div class="vw-seq{" has-art" if pic else ""}"><div class="vw-txt">{ctx}<p class="vw-ask">{w["ask"]}</p></div>{pic}</div>'
        head = ''
    else:                                 # tile/picture style: the question on top, then the body
        inner = (f'<div class="vw-seq has-art"><div class="vw-txt">{w["body"]}</div>{pic}</div>' if pic else w['body'])
        head = f'\n  <p class="wf-rule vw-rule">{w["ask"]}</p>'
    stripx = f'\n  <div class="vw-strip">{w["strip"]}</div>' if w.get('strip') else ''
    new = f'''<!-- ================= warm-up: one clear question, first thing on the screen ================= -->
<section class="card warm wf" data-ink="warmq" data-section="Warm-up: {w['title']}">{stripx}
  <div class="wf-head"><span class="badge warm-b">Warm-up</span><h2>{w['title']}</h2>{head}</div>
  {inner}{reveal}
</section>

'''
    hi, _ = sec_span('hero'); s = s[:hi] + new + s[hi:]

    # --- one practice break
    pr = sp.get('practice')
    if pr:
        chips = ''.join(f'<span><b>{a}</b>{b}</span>' for a, b in pr['chips'])
        card = f'''

<!-- ================= practice break (one per lesson at most) ================= -->
<section class="card practice" data-ink="p1" data-section="Practice: Questions {pr['qs']}">
  <div class="pr-k">Your turn</div>
  <h2>Assignment {l} · Questions {pr['qs']}</h2>
  <p class="pr-t">{pr['line']}</p>
  <div class="pr-chips n{len(pr['chips'])}">{chips}</div>
  <div class="pr-foot"><span>{pr.get('note', 'We carry on when most of the class has finished.')}</span><a class="pill" href="../../../#/lesson/{key}">Open the Practice site</a></div>
</section>'''
        _, j = sec_span(pr['after']); s = s[:j] + card + s[j:]
        m = re.search(r'(<a class="assign" href="[^"]*">\s*<div><div class="kicker">Your turn</div><b>)Assignment %s — ([^<]*(?:<span class="tex">[^<]*</span>[^<]*)*)(</b>)' % l, s)
        assert m, (key, 'assign card')
        s = s[:m.start()] + m.group(1) + f"Assignment {l} · Questions {pr['rest']}" + m.group(3) + s[m.end():]

    open(path, 'w').write(s)
    cards = re.findall(r'<section [^>]*data-section="([^"]*)"', s)
    nex = len(re.findall(r'data-explainer=', s)); was = len(re.findall(r'data-explainer=', open(orig).read()))
    print(f'{key}: {len(cards)} cards, {nex} animations (was {was}): ' + ' | '.join(cards))


if __name__ == '__main__':
    for k in sys.argv[1:]: run(k)
