from pichelp import *
T = lambda x: '<span class="tex">%s</span>' % x

# Four right/equilateral triangles drawn to ONE scale (so their sizes can be compared), side lengths on them.
S = 14
def _tri(pts, labs):
    poly = ' '.join(f'{x:.1f},{y:.1f}' for x, y in pts)
    t = ''.join(f'<text x="{x:.1f}" y="{y:.1f}" font-size="19" font-weight="800" fill="{BLUE}" text-anchor="middle" dominant-baseline="central">{s}</text>' for x, y, s in labs)
    return f'<svg viewBox="0 0 210 124" style="width:100%;max-width:270px;height:auto"><polygon points="{poly}" fill="#f6eef1" stroke="{INK}" stroke-width="3.5" stroke-linejoin="round"/>{t}</svg>'
def _right(a, b, c):           # legs a (vertical) and b (horizontal), hypotenuse c; right angle at bottom-left
    x0, y0 = 105 - b * S / 2, 58 + a * S / 2
    P = [(x0, y0), (x0 + b * S, y0), (x0, y0 - a * S)]
    return _tri(P, [(x0 - 13, y0 - a * S / 2, a), (x0 + b * S / 2, y0 + 13, b), (x0 + b * S / 2 + 14, y0 - a * S / 2 - 10, c)])
def _equi(s):
    w, hh = s * S, s * S * 0.866
    x0, y0 = 105 - w / 2, 58 + hh / 2
    P = [(x0, y0), (x0 + w, y0), (105, y0 - hh)]
    return _tri(P, [(105, y0 + 13, s), (x0 + w / 4 - 14, y0 - hh / 2 - 4, s), (x0 + 3 * w / 4 + 14, y0 - hh / 2 - 4, s)])
TILES = (f'<div class="vw-wodb"><div><b>A</b>{_right(3, 4, 5)}</div><div><b>B</b>{_right(6, 8, 10)}</div>'
         f'<div><b>C</b>{_right(5, 12, 13)}</div><div><b>D</b>{_equi(4)}</div></div>')

SPEC = dict(
    warm=dict(
        title='Which One Doesn’t Belong?',
        ask='Which triangle doesn’t belong? Be ready to say why.',
        body=TILES,
        strip=strip(srock('📐', 120, 14, 2.4, 40), sb('🤔', 190, .3, 38), srock('🔺', 260, 12, 2.0, 36)),
        nudge='Can you find a reason for a different one?',
        reveal='Every one of them can be the odd one out. <b>A</b> has the smallest area (6). <b>B</b> is the only one with all even sides (it is A, twice as big). <b>C</b> has the biggest area (30) and the longest perimeter. <b>D</b> is the only one with no right angle.'),
    # The build-a-triangle explainer, the semicircle picture proof of sin θ = sin(180° − θ), the Example 3 replay
    # and the decision-chart card go. Kept: the swinging side (slider), solving both triangles (keep/reject), and
    # the ferry/strut scene.
    drop_expl=['fixers', 'supp', 'six'],
    drop_cards=['s2b'],
    practice=dict(after='ex4', qs='1–5', rest='6–17', line='What SSA means, then count the triangles with the height ' + T('h') + '.',
                  chips=[('1–2', 'SSA and the other cases'), ('3–4', 'The height and the count'), ('5', 'Count without the sine law')],
                  note='We carry on when most of the class has reached Question 4.'),
)
