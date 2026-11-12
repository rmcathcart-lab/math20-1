from pichelp import *
T = lambda x: '<span class="tex">%s</span>' % x

# A well 10 m deep (20 px per metre, bottom y = 228, top y = 28). The snail climbs 3 m, slides 2 m, climbs, slides …
# and the loop starts over at 6 m, long before the top, so the picture never shows the answer.
_M = 20
_ys = [0, 3, 1, 4, 2, 5, 3, 6, 6, 0]
_vals = ';'.join(f'0 {-_M * m}' for m in _ys)
_kt = '0;.11;.22;.33;.44;.55;.66;.77;.93;1'
# the sun is out while the snail climbs, the moon while it slides back
_day = '1;0;1;0;1;0;1;1;1;1'
_night = ';'.join(str(1 - int(v)) for v in _day.split(';'))
_bricks = ''.join(f'<line x1="{x0}" y1="{y}" x2="{x0 + 46}" y2="{y}" stroke="#b9a989" stroke-width="2"/>' for x0 in (84, 200) for y in range(48, 228, 20)) \
    + ''.join(f'<line x1="{x0 + (23 if (y // 20) % 2 else 11)}" y1="{y}" x2="{x0 + (23 if (y // 20) % 2 else 11)}" y2="{y + 20}" stroke="#b9a989" stroke-width="2"/>' for x0 in (84, 200) for y in range(28, 228, 20))
WELL = svg(
    f'<rect x="84" y="28" width="46" height="200" fill="#e6dcc6"/><rect x="200" y="28" width="46" height="200" fill="#e6dcc6"/>{_bricks}'
    f'<rect x="130" y="28" width="70" height="200" fill="#f6f2e8"/><rect x="130" y="212" width="70" height="16" fill="#9cc3e6"/>'
    f'<line x1="66" y1="28" x2="314" y2="28" stroke="{GREEN}" stroke-width="6" stroke-linecap="round"/>'
    f'<line x1="50" y1="28" x2="50" y2="228" stroke="{INK}" stroke-width="3"/>'
    + ''.join(f'<line x1="44" y1="{28 + i * _M}" x2="56" y2="{28 + i * _M}" stroke="{INK}" stroke-width="2.5"/>' for i in range(11))
    + f'<text x="38" y="34" font-size="17" font-weight="700" fill="{INK}" text-anchor="end">10 m</text>'
    f'<text x="38" y="233" font-size="17" font-weight="700" fill="{INK}" text-anchor="end">0</text>'
    f'<g><animateTransform attributeName="transform" type="translate" values="{_vals}" keyTimes="{_kt}" dur="7s" repeatCount="indefinite"/>'
    f'<text x="150" y="214" font-size="34" text-anchor="middle" transform="rotate(90 150 202)">🐌</text></g>'
    f'<text x="280" y="70" font-size="34" text-anchor="middle">☀️<animate attributeName="opacity" values="{_day}" keyTimes="{_kt}" calcMode="discrete" dur="7s" repeatCount="indefinite"/></text>'
    f'<text x="280" y="70" font-size="30" text-anchor="middle">🌙<animate attributeName="opacity" values="{_night}" keyTimes="{_kt}" calcMode="discrete" dur="7s" repeatCount="indefinite"/></text>',
    'A snail climbing up the inside wall of a 10 m well, sliding back a little each night')

SPEC = dict(
    warm=dict(
        title='The Snail in the Well',
        ctx=['A snail is at the bottom of a well <b>10&nbsp;m</b> deep.', 'Every day it climbs <b>up 3&nbsp;m</b>. Every night it slides <b>back down 2&nbsp;m</b>.'],
        ask='On which day does the snail reach the top?',
        pic=WELL,
        strip=strip(sdrive('🐌', 16, size=30), sblink('☀️', 300, 0, 28, 3, lo=0), sblink('🌙', 300, 1.5, 26, 3, lo=0)),
        nudge='Act it out, day by day. How sure are you?',
        reveal=('<b>Day 8.</b> Each full day and night gains only 1 m, so after 7 days and 7 nights the snail is 7 m up. '
                'On day 8 it climbs 3 m, reaches <b>10 m</b> and crawls out, so it never slides back that night. '
                '(Most people say day 10: they forget the last climb doesn’t need a night.)')),
    drop_cards=['s4b'],
    drop_expl=['legsVsHyp', 'indexBins', 'fracFront', 'varBins', 'radSeq'],
    drop_expl_with_prev=['squareCut', 'cubeCut'],
    drop_str=['  <h3 class="sub">Why <span class="tex">\\sqrt{72}=6\\sqrt{2}</span>: cut the square</h3>\n',
              '  <h3 class="sub">Cut the cube</h3>\n',
              '  <h3 class="sub">Bins by index and radicand</h3>\n',
              '  <h3 class="sub">Two parts, two hops</h3>\n'],
    practice=dict(after='ex3', qs='1–5', rest='6–17', line='Combine like radicals; simplify first when the radicands look different.',
                  chips=[('1', 'Combine like radicals'), ('2', 'Spot the error; like or not?'), ('3–4', 'Simplify first, then combine'),
                         ('5', 'Cube roots and fourth roots')],
                  note='We carry on when most of the class has reached Question 5.'),
)
