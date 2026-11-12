from pichelp import *
T = lambda x: '<span class="tex">%s</span>' % x

# A sheet of A4 (1 by root-2, portrait) whose top half folds down over the bottom half and back, and beside it the
# half stood upright: the same shape, smaller. The long side is only labelled "?".
_Y = 125   # the fold line
PAPER = svg(
    # the bottom half (stays)
    f'<rect x="40" y="{_Y}" width="120" height="85" fill="#fffdf6" stroke="{INK}" stroke-width="3.5"/>'
    # the top half folds down around the fold line and back
    f'<g transform="translate(0 {_Y})"><g><animateTransform attributeName="transform" type="scale" values="1 1;1 1;1 -1;1 -1;1 1" keyTimes="0;.2;.45;.75;1" dur="4s" repeatCount="indefinite"/>'
    f'<g transform="translate(0 {-_Y})"><rect x="40" y="40" width="120" height="85" fill="#eef3fb" stroke="{INK}" stroke-width="3.5"/></g></g></g>'
    f'<line x1="34" y1="{_Y}" x2="166" y2="{_Y}" stroke="{BLUE}" stroke-width="2.5" stroke-dasharray="7 6"/>'
    f'<text x="100" y="236" font-size="26" font-weight="800" fill="{INK}" text-anchor="middle">1</text>'
    + qmark(18, 136, 34)
    # the half, stood up: same shape, smaller
    + f'<g>{bob(5, 2.4)}<rect x="208" y="92" width="85" height="120" fill="#eef3fb" stroke="{INK}" stroke-width="3.5"/>'
    f'<text x="250" y="80" font-size="19" font-weight="700" fill="{GREEN}" text-anchor="middle">same shape!</text></g>',
    'A sheet of paper folding in half, and the half stood up beside it')

SPEC = dict(
    warm=dict(
        title='The Magic Paper',
        ctx=['Most of the world uses <b>A4</b> paper, not our letter paper. Fold a sheet of A4 in half, and the half is '
             '<b>exactly the same shape</b> as the whole sheet, just smaller.'],
        ask='If the short side is 1, how long is the long side?',
        pic=PAPER,
        strip=strip(sdrive('📄', 6, hop=6), sdrive('📄', 6, begin=3, hop=6)),
        nudge='Guess first. Can you prove it?',
        reveal=f'<b>{T(r"\sqrt2\approx1.414")}</b>. Call the long side {T("L")}. The half is {T("1")} by {T(r"\tfrac L2")}, and the '
               f'same shape means long ÷ short is the same: {T(r"\dfrac L1=\dfrac{1}{L/2}")}, so {T("L^2=2")} and {T(r"L=\sqrt2")}. '
               f'Check a real sheet: 297&nbsp;mm by 210&nbsp;mm, and {T(r"297\div210\approx1.414")}. '
               f'(Letter paper, 11 by 8.5, does <b>not</b> do this: its half is a different shape.)'),
    # twoRoutes, twoTermNum and problems only replayed Examples 2, 5 and 8 with a second version of the same steps.
    drop_expl=['twoRoutes', 'twoTermNum', 'problems'],
    replace=[(' (a square of side √b shows √b·√b = b)', '')],
    practice=dict(after='ex4', qs='1–5', rest='6–19', line='Divide radicals, divide every term, and rationalize one-term denominators.',
                  chips=[('1', 'Divide radicals'), ('2', 'Radicands that don’t divide evenly'), ('3', 'Divide each term'),
                         ('4–5', 'Rationalize, and no fraction under a radical')],
                  note='We carry on when most of the class has reached Question 4.'),
)
