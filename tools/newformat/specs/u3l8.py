from pichelp import *
T = lambda x: '<span class="tex">%s</span>' % x

# The walk drawn on a flat map: down, right, up. On paper it does NOT close (the dashed "?" gap), which is the
# mystery; a paw print walks the route. No bear and no snow in the picture: that would give the colour away.
_P = 'M80 48 L80 188 L220 188 L220 48'
_leg = lambda x, y, t, a='middle': f'<text x="{x}" y="{y}" font-size="18" font-weight="800" fill="{BLUE}" text-anchor="{a}">{t}</text>'
WALK = svg(
    f'<path d="{_P}" fill="none" stroke="{INK}" stroke-width="4" stroke-dasharray="2 10" stroke-linecap="round"/>'
    f'<line x1="96" y1="48" x2="204" y2="48" stroke="{RED}" stroke-width="3" stroke-dasharray="8 7"/>'
    + qmark(150, 40, 36, RED) +
    f'<circle cx="80" cy="48" r="8" fill="{GREEN}"/><text x="62" y="40" font-size="16" font-weight="800" fill="{GREEN}" text-anchor="end">start</text>'
    + _leg(66, 124, '1 km', 'end') + _leg(150, 214, '1 km') + _leg(234, 124, '1 km', 'start') +
    f'<g><animateMotion path="{_P}" dur="6s" repeatCount="indefinite" keyPoints="0;1;1" keyTimes="0;.85;1" calcMode="linear"/>'
    f'<text x="0" y="0" font-size="30" text-anchor="middle" dominant-baseline="central">🐾</text></g>'
    # a small compass: N up, the needle wobbling
    f'<g transform="translate(292 200)"><circle r="26" fill="#fffdf6" stroke="{INK}" stroke-width="3"/>'
    f'<text y="-32" font-size="16" font-weight="800" fill="{INK}" text-anchor="middle">N</text>'
    f'<g><animateTransform attributeName="transform" type="rotate" values="-14;10;-6;4;-14" dur="3s" repeatCount="indefinite"/>'
    f'<polygon points="0,-20 6,0 -6,0" fill="{RED}"/><polygon points="0,20 6,0 -6,0" fill="#9aa0aa"/></g></g>',
    'A walk of 1 km south, 1 km east and 1 km north, drawn on a map')

SPEC = dict(
    warm=dict(
        title='The Bear Walk',
        ctx='A bear walks <b>1&nbsp;km south</b>, then <b>1&nbsp;km east</b>, then <b>1&nbsp;km north</b>. It ends up exactly where it started.',
        ask='What colour is the bear?',
        pic=WALK,
        strip=strip(sdrive('🐾', 8, size=30, flip=False), sspin('🧭', 300, 6, 36)),
        nudge='How could that walk end where it started?',
        reveal='<b>White: it is a polar bear.</b> Start at the <b>North Pole</b>. From the pole, every direction is south; walking “east” keeps you 1&nbsp;km from the pole, on a circle around it; walking north takes you straight back to the pole. (There are also starting points near the South Pole where the walk works, but no bears live there.)'),
    # The clock-hands replay, the bearing-forms compass, the quadrilateral replay (with its card) and the area
    # derivation chip go. Kept: the decision chart, the bearing builder (and the live "Build a route" card), the
    # two-triangle mast, the sliding inscribed angle in the circle, and one area procedure.
    drop_expl=['clock', 'bearingForms'],
    drop_cards=['s3b'],
    practice=dict(after='ex5', qs='1–5', rest='6–18', line='Choose a method, clock hands, bearing forms, and bearings that make a triangle.',
                  chips=[('1', 'Choose a method'), ('2', 'Clock hands'), ('3', 'The two bearing forms'), ('4–5', 'Bearings make a triangle')],
                  note='We carry on when most of the class has reached Question 4.'),
)
