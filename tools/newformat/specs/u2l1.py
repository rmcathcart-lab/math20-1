from pichelp import *
T = lambda x: '<span class="tex">%s</span>' % x


def _rad(x, y, w, col, idx=''):
    """a big radical sign with a ? under its bar (index written in the crook when given)"""
    p = f'M{x},{y+34} L{x+11},{y+27} L{x+25},{y+70} L{x+44},{y} L{x+48+w},{y}'
    ix = f'<text x="{x+14}" y="{y+22}" font-size="24" font-weight="800" fill="{col}" text-anchor="middle">{idx}</text>' if idx else ''
    q = f'<text x="{x+48+w/2}" y="{y+58}" font-size="48" font-weight="800" fill="{INK}" text-anchor="middle">?</text>'
    return f'<path d="{p}" fill="none" stroke="{col}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/>{ix}{q}'


PIC = svg(
    f'<g>{bob(9, 1.8)}{_rad(18, 34, 64, BLUE)}</g>'
    f'<g>{bob(9, 1.8, .7)}{_rad(178, 34, 64, RED, "3")}</g>'
    f'<g>{bob(6, 2.2, .3)}<rect x="113" y="150" width="104" height="80" rx="14" fill="#fffdf6" stroke="{INK}" stroke-width="5"/>'
    f'<text x="165" y="208" font-size="54" font-weight="800" fill="{AMBER}" text-anchor="middle">?{blink(1.6)}</text></g>',
    'A square root sign and a cube root sign, each over a mystery number, and a mystery card')

SPEC = dict(
    warm=dict(
        title='Who Am I?',
        ctx=['I am a whole number bigger than 1.', 'My <b>square root</b> is a whole number.', 'My <b>cube root</b> is a whole number too.'],
        ask='What is the smallest number I could be?',
        pic=PIC,
        strip=strip(sdrive('🔍', 7, size=34, flip=False), sblink('❓', 300, 0, 30)),
        nudge='How do you know nothing smaller works?',
        reveal=(f'<b>64.</b> {T(r"\sqrt{64}=8")} and {T(r"\sqrt[3]{64}=4")}. The perfect squares 4, 9, 16, 25, 36 and 49 all fail '
                f'the cube-root test, and the cubes 8 and 27 fail the square-root test. The next number that works is <b>729</b> '
                f'({T(r"27^2")} and {T(r"9^3")}).')),
    drop_cards=['s2b', 's3c', 's3e', 's6b'],
    drop_expl=['tiles'],
    drop_str=['  <h3 class="sub">Why can a number come out? Cut the square into tiles</h3>\n'],
    practice=dict(after='ex4', qs='1–5', rest='6–18', line='Evaluate roots, sort rational from irrational, use one root sign, then write entire radicals as mixed radicals.',
                  chips=[('1–2', 'Evaluate roots; principal roots'), ('3', 'Rational or irrational; between two whole numbers'),
                         ('4', 'True or false: one root sign'), ('5', 'Entire to mixed, simplest form')],
                  note='We carry on when most of the class has reached Question 5.'),
)
