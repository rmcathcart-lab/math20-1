from pichelp import *
import math
T = lambda x: '<span class="tex">%s</span>' % x


def _handshakes():
    """Eight people in a ring; a line appears for each handshake, one pair at a time, then the ring resets.
    It shows 8 people (28 lines), never the 30 of the question."""
    cx, cy, R, N = 165, 128, 92, 8
    pts = [(cx + R * math.cos(math.radians(-90 + 360 * k / N)), cy + R * math.sin(math.radians(-90 + 360 * k / N))) for k in range(N)]
    pairs = [(i, j) for i in range(N) for j in range(i + 1, N)]
    lines = ''
    for k, (i, j) in enumerate(pairs):
        t0 = .03 + k * .03; t1 = t0 + .02
        (x1, y1), (x2, y2) = pts[i], pts[j]
        lines += (f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{BLUE}" stroke-width="2.5" opacity="0">'
                  f'<animate attributeName="opacity" values="0;0;.7;.7;0" keyTimes="0;{t0:.2f};{t1:.2f};.95;1" dur="10s" repeatCount="indefinite"/></line>')
    faces = ['🙂', '😀', '😄', '🙂', '😊', '😀', '🙂', '😄']
    ppl = ''.join(f'<g>{bob(4, 1.4 + (k % 3) * .2, k * .15)}<circle cx="{x:.1f}" cy="{y:.1f}" r="19" fill="#fffdf6" stroke="{INK}" stroke-width="2.5"/>'
                  f'<text x="{x:.1f}" y="{y + 9:.1f}" font-size="26" text-anchor="middle">{faces[k]}</text></g>' for k, (x, y) in enumerate(pts))
    return svg(lines + ppl + f'<g>{bob(8, 1.2)}<text x="{cx}" y="{cy + 14}" font-size="40" text-anchor="middle">🤝</text></g>',
               'Eight people in a ring; a line appears for every handshake')


SPEC = dict(
    warm=dict(
        title='The Handshake Puzzle',
        ctx=['On the first day of a new club, all <b>30</b> members shake hands with each other.',
             'Every pair of members shakes hands <b>exactly once</b>.'],
        ask='How many handshakes is that?',
        pic=_handshakes(),
        strip=strip(sb('🤝', 200, 0, 34), sb('🤝', 255, .4, 34), sb('🤝', 310, .8, 34)),
        nudge='Guess first. Then work it out.',
        reveal=f'<b>435 handshakes.</b> The first member shakes 29 hands, the next one 28 new hands, then 27, … down to 1: '
               f'{T(r"29+28+\dots+1=435")}. ({T(r"30\times29=870")} counts every handshake twice.)'),
    drop_expl=['twoFormulas', 'unknownHunt', 'cans', 'runner'],
    drop_expl_with_prev=['staircase'],
    drop_str=['  <h3 class="sub">The same idea with blocks</h3>\n',
              '  <h3 class="sub">Where the first formula comes from</h3>\n',
              '  <h3 class="sub">Linear or quadratic?</h3>\n',
              '  <h3 class="sub">The can display</h3>\n'],
    practice=dict(after='ex4', qs='1–5', rest='6–18',
                  line='Partial sums, pairing, and the two sum formulas.',
                  chips=[('1', 'A series and its partial sums'), ('2', 'Pairing'), ('3–5', 'The sum formulas')],
                  note='We carry on when most of the class has reached Question 4.'),
)
