from pichelp import *
T = lambda x: '<span class="tex">%s</span>' % x


def dots():
    """Four labelled points on a bare grid, blinking in turn (no circle: that would give the twist away)."""
    c, ox, oy = 21, 60, 20          # 10 x 10 grid, origin at its centre
    O = (ox + 5 * c, oy + 5 * c)
    P = lambda x, y: (O[0] + x * c, O[1] - y * c)
    pts = [('A', 3, 4, BLUE), ('B', -4, -3, GREEN), ('C', 0, -5, AMBER), ('D', -4, 4, RED)]
    axes = (f'<g stroke="{INK}" stroke-width="3" stroke-linecap="round"><line x1="{ox - 6}" y1="{O[1]}" x2="{ox + 10 * c + 6}" y2="{O[1]}"/>'
            f'<line x1="{O[0]}" y1="{oy - 6}" x2="{O[0]}" y2="{oy + 10 * c + 6}"/></g>')
    dd = ''
    for i, (n, x, y, col) in enumerate(pts):
        px, py = P(x, y)
        dx = -16 if x <= 0 else 16
        dd += (f'<g>{blink(2.4, i * .6, .25)}<circle cx="{px}" cy="{py}" r="8" fill="{col}"/>'
               f'<text x="{px + dx}" y="{py + (16 if y < 0 else -6)}" font-size="22" font-weight="800" fill="{col}" text-anchor="middle">{n}</text></g>')
    return svg(grid(10, 10, c, ox, oy) + axes + dd, 'Four points on a grid')


TILE = lambda n, p: f'<div><b>{n}</b>{T(p)}</div>'

SPEC = dict(
    warm=dict(
        title='Which One Doesn’t Belong?',
        ask='Four points. Which one doesn’t belong? Be ready to say why.',
        body=('<div class="vw-tiles" style="--n:2;--fs:40px">' + TILE('A', '(3,\\ 4)') + TILE('B', '(-4,\\ -3)')
              + TILE('C', '(0,\\ -5)') + TILE('D', '(-4,\\ 4)') + '</div>'),
        pic=dots(),
        strip=strip(sb('📍', 70), sb('📍', 150, .3), sb('📍', 230, .6), srock('🤔', 305)),
        nudge='Can you find a reason for a different one?',
        reveal=('<b>Every one can be the odd one out.</b> A is the only one with both coordinates positive (quadrant 1). '
                'B is the only one in quadrant 3. C is the only one on an axis. '
                'D is the only one that is <b>not 5 units</b> from the origin: A, B and C are all exactly 5 away '
                f'(for A, {T("\\sqrt{3^2+4^2}=5")}), but D is {T("\\sqrt{32}\\approx5.7")}.')),
    drop_expl=['rFind', 'quadrantal', 'refSign'],
    practice=dict(after='s3b', qs='1–7', rest='8–18', line='The distance ' + T('r') + ', then exact ratios from a point, including points on an axis.',
                  chips=[('1', 'The distance ' + T('r')), ('2–4', 'Exact ratios from a point'), ('5–6', 'Quadrantal angles'), ('7', 'Signs without calculating')],
                  note='We carry on when most of the class has reached Question 5.'),
)
