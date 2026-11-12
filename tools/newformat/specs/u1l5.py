from pichelp import *
T = lambda x: '<span class="tex">%s</span>' % x
NB = '&#8239;'  # thin space in big numbers


def _gifts():
    """Gift A: a money bag. Gift B: coin stacks of 1, 2, 4, 8, 16 appearing day by day, then starting over.
    It shows only the first five days (given in the text), never the totals."""
    bag = (f'<g>{bob(6, 1.8)}<text x="70" y="150" font-size="84" text-anchor="middle">💰</text></g>'
           f'<text x="70" y="200" font-size="22" font-weight="800" fill="{GREEN}" text-anchor="middle">A</text>')
    stacks = ''
    for k, n in enumerate((1, 2, 4, 8, 16)):
        x = 150 + k * 34; t0 = .08 + k * .16
        coins = ''.join(f'<ellipse cx="{x}" cy="{196 - i * 9}" rx="14" ry="5" fill="{AMBER}" stroke="#a8740c" stroke-width="1.5"/>' for i in range(n))
        stacks += (f'<g opacity="0"><animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;{t0:.2f};{t0 + .04:.2f};.94;1" dur="7s" repeatCount="indefinite"/>'
                   f'{coins}<text x="{x}" y="222" font-size="16" font-weight="700" fill="{INK}" text-anchor="middle">{k + 1}</text></g>')
    return svg(bag + f'<line x1="122" y1="40" x2="122" y2="220" stroke="{LINE}" stroke-width="3" stroke-dasharray="6 6"/>' + stacks
               + f'<text x="218" y="246" font-size="18" font-weight="800" fill="{BLUE}" text-anchor="middle">B, day by day</text>' + qmark(108, 62, 40, RED),
               'A money bag beside stacks of coins that double every day')


SPEC = dict(
    warm=dict(
        title='Would You Rather?',
        ctx=[f'Gift A: <b>$1{NB}000{NB}000</b>, all of it today.',
             'Gift B: <b>1¢</b> today, <b>2¢</b> tomorrow, <b>4¢</b> the day after, … doubling every day for <b>30 days</b>.'],
        ask='Which gift would you rather have?',
        pic=_gifts(),
        strip=strip(sfloat('🪙', 200, 2.6, 0, 28), sfloat('🪙', 250, 2.6, .9, 28), sfloat('🪙', 300, 2.6, 1.7, 28)),
        nudge='Vote first. Then estimate gift B.',
        reveal=f'<b>Gift B, by far.</b> Day 30 alone brings {T(r"2^{29}")} cents, <b>$5{NB}368{NB}709.12</b>, and all 30 days add up to '
               f'<b>$10{NB}737{NB}418.23</b>. Gift B passes a million dollars on day 27.'),
    drop_expl=['ratioHops', 'oddEven', 'bSquared'],
    practice=dict(after='ex3', qs='1–6', rest='7–17',
                  line='Find r, write the general term, graph the terms and find one exact term.',
                  chips=[('1–2', 'Arithmetic, geometric or neither'), ('3–5', 'The general term and the graph'), ('6', 'One exact term')],
                  note='We carry on when most of the class has reached Question 5.'),
)
