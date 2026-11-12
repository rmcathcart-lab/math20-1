from pichelp import *
T = lambda x: '<span class="tex">%s</span>' % x

_spark = lambda x, y, s, b: f'<text x="{x}" y="{y}" font-size="{s}" text-anchor="middle">✨{blink(1.4, b, .1)}</text>'
_wand = ('<g><animateTransform attributeName="transform" type="rotate" values="-18 262 196;14 262 196;-18 262 196" dur="1.6s" repeatCount="indefinite"/>'
         f'<line x1="262" y1="196" x2="300" y2="96" stroke="{INK}" stroke-width="9" stroke-linecap="round"/>'
         '<line x1="294" y1="112" x2="300" y2="96" stroke="#fffdf6" stroke-width="7" stroke-linecap="round"/></g>')
HAT = svg(
    emo('🐇', 150, 132, 64, 22, 2.2)
    + f'<rect x="95" y="118" width="110" height="92" rx="6" fill="{INK}"/><rect x="95" y="182" width="110" height="16" fill="{RED}"/>'
    + f'<ellipse cx="150" cy="118" rx="55" ry="11" fill="#6b6455"/><ellipse cx="150" cy="212" rx="88" ry="15" fill="{INK}"/>'
    + _wand + _spark(272, 78, 30, 0) + _spark(48, 120, 26, .5) + _spark(230, 40, 22, .9) + _spark(70, 60, 20, 1.2),
    'A magician’s top hat with a rabbit peeking out, and a waving wand')

SPEC = dict(
    warm=dict(
        title='The Mind Reader',
        ctx=['Think of any number. <b>Double</b> it.', 'Add <b>10</b>. Then take <b>half</b> of the result.', 'Take away the number you started with.'],
        ask='What number did you end up with? (I already know.)',
        pic=HAT,
        strip=strip(sfloat('✨', 70, 3, 0, 26), srock('🎩', 170, 8, 2, 40), sfloat('✨', 270, 3.4, 1.2, 26)),
        nudge='Why does everyone get the same answer?',
        reveal=(f'<b>5</b>, whatever number you picked. Call your number {T("n")}: double it, {T("2n")}; add 10, {T("2n+10")}; '
                f'take half, {T("n+5")}; take away {T("n")}: {T("5")}. Your number cancels out, so it never mattered. '
                'Now invent a trick of your own that always lands on 7.')),
    drop_expl=['twoWays', 'squareTiles', 'splitBack', 'squareGrid', 'stretchSquash', 'areaFigs'],
    drop_str=['  <h3 class="sub">Multiply first, or simplify first?</h3>\n',
              '  <h3 class="sub">Why the corner is missing: the warm-up again</h3>\n'],
    replace=[('that forgets the two middle cells.', 'that forgets the two middle terms.')],
    practice=dict(after='ex3', qs='1–5', rest='6–18', line='Multiply coefficients and radicands, then simplify. State restrictions in Question 5.',
                  chips=[('1', 'Multiply and simplify'), ('2', 'Square or cube a radical'), ('3–4', 'Three factors; split it back'),
                         ('5', 'Variables and restrictions')],
                  note='We carry on when most of the class has reached Question 5.'),
)
