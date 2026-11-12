from pichelp import *
import math
T = lambda x: '<span class="tex">%s</span>' % x


def _pizza():
    """A pizza with 5 dots on the crust; the 10 straight cuts between them appear one by one, then the pizza resets.
    It shows the 5-dot case only (16 pieces, given in the text), never the 6-dot one."""
    cx, cy, R = 150, 128, 96
    pts = [(cx + R * math.cos(math.radians(a)), cy + R * math.sin(math.radians(a))) for a in (-90, -18, 54, 126, 198)]
    pep = ''.join(f'<circle cx="{x}" cy="{y}" r="9" fill="#c0503c" opacity=".85"/>' for x, y in ((118, 92), (182, 100), (150, 150), (110, 160), (196, 162), (156, 70)))
    pairs = [(i, j) for i in range(5) for j in range(i + 1, 5)]
    cuts = ''
    for k, (i, j) in enumerate(pairs):
        t0 = .05 + k * .07; t1 = t0 + .05
        (x1, y1), (x2, y2) = pts[i], pts[j]
        cuts += (f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{INK}" stroke-width="3.5" stroke-linecap="round" opacity="0">'
                 f'<animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;{t0:.2f};{t1:.2f};.94;1" dur="8s" repeatCount="indefinite"/></line>')
    dots = ''.join(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="7.5" fill="{BLUE}" stroke="#fff" stroke-width="2.5"/>' for x, y in pts)
    return svg(f'<circle cx="{cx}" cy="{cy}" r="{R + 8}" fill="#d99a4e"/><circle cx="{cx}" cy="{cy}" r="{R - 4}" fill="#f6d27a"/>{pep}{cuts}{dots}'
               + qmark(292, 70, 46, RED) + f'<text x="292" y="238" font-size="20" font-weight="800" fill="{BLUE}" text-anchor="middle">6 dots?</text>',
               'A pizza with five dots on the crust; straight cuts join every pair of dots')


SPEC = dict(
    warm=dict(
        title='Pizza Cuts',
        ctx=['Put dots on the crust of a pizza, then make a straight cut between <b>every pair</b> of dots. Count the pieces.',
             '1&nbsp;dot: <b>1</b>&nbsp;piece. 2&nbsp;dots: <b>2</b>. 3&nbsp;dots: <b>4</b>. 4&nbsp;dots: <b>8</b>. 5&nbsp;dots: <b>16</b>.'],
        ask='How many pieces will 6 dots make?',
        pic=_pizza(),
        strip=strip(sspin('🍕', 210, 6, 36), sb('🧀', 270, 0, 32), sb('🍕', 320, .5, 30)),
        nudge='Guess first. Then sketch it and count.',
        reveal='<b>31, not 32!</b> It looked like doubling, but the pattern breaks. (Space the 6 dots evenly and three cuts meet in the middle: only <b>30</b>.) '
               'A few terms can’t prove a pattern: we need a rule.'),
    drop_expl=['twoWays', 'finite'],
    drop_str=['  <h3 class="sub">Rule or formula: which is faster?</h3>\n'],
    drop_cards=['s1b', 's2b'],
    practice=dict(after='ex4', qs='2–7', rest='1 and 8–14',
                  line='Classify, finite or infinite, and use a general term. Question 1 waits for the end of the lesson (its last part is about the graph).',
                  chips=[('2–3', 'Arithmetic, geometric or neither'), ('4–5', 'Finite or infinite; the next two terms'), ('6–7', 'Using a general term')],
                  note='We carry on when most of the class has reached Question 6.'),
)
