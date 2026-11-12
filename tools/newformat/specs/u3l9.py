from pichelp import *
T = lambda x: '<span class="tex">%s</span>' % x

# A little arrow walks round and round a triangle, turning at each corner (it goes with statement A, but does not
# say whether A is true or false).
_TRI = 'M60 200 L280 200 L120 50 Z'
WALKER = svg(
    f'<path d="{_TRI}" fill="#f6eef1" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/>'
    f'<g><animateMotion path="{_TRI}" dur="7s" repeatCount="indefinite" rotate="auto"/>'
    f'<polygon points="16,0 -10,-11 -4,0 -10,11" fill="{RED}" stroke="{INK}" stroke-width="2" stroke-linejoin="round" transform="translate(0 14)"/></g>'
    + qmark(286, 70, 40, BLUE),
    'An arrow walking around the outside of a triangle')

STATES = (
    '<div class="vw-tiles u3l9-ttl" style="--n:1;--fs:25px">'
    '<div class="lab"><b>A</b>Walk once around the outside of any triangle and you turn a total of 360°.</div>'
    '<div class="lab"><b>B</b>You can build a triangle from sticks 3&nbsp;cm, 4&nbsp;cm and 8&nbsp;cm long.</div>'
    '<div class="lab"><b>C</b>Every triangle has at least two acute angles.</div>'
    '</div>')

SPEC = dict(
    warm=dict(
        title='Two Truths and a Lie',
        ask='Two of these are true and one is a lie. Which one is the lie?',
        body=STATES,
        pic=WALKER,
        strip=strip(sb('🤥', 120, 0, 38), sblink('❓', 180, .2, 34), sb('✅', 240, .6, 34)),
        nudge='How could you prove it?',
        reveal='<b>B is the lie.</b> The two short sticks together are only 3 + 4 = 7&nbsp;cm, so they can’t reach across 8&nbsp;cm. '
               '<b>A</b> is true: you turn at each corner, and after one lap you face the way you started, a full 360°. '
               '<b>C</b> is true: the angles add to 180°, so two of them can’t both be 90° or more.'),
    # Review page: the exact-value builder, the laws replay, the which-law chart (the tool sorter does it better),
    # the point-on-the-arm replay and the Example 8 replay go. Kept: the CAST sweep, the ambiguous-case swing with its
    # table, solving on the unit circle, and the tool sorter.
    drop_expl=['exactTable', 'lawsRecap', 'whichLaw', 'pointRatios', 'problemSolve'],
    practice=dict(after='ex5', qs='1–7', rest='8–27', line='Angles in standard position, points, exact values and solving for θ.',
                  chips=[('1–2', 'Reference angles and points'), ('3–4', 'Ratios and exact values'), ('5–7', 'Solving for θ')],
                  note='We carry on when most of the class has reached Question 5.'),
)
