from pichelp import *
T = lambda x: '<span class="tex">%s</span>' % x

TILES = ('<div class="vw-tiles" style="--n:4;--fs:64px">'
         '<div><b>A</b>16</div><div><b>B</b>27</div><div><b>C</b>36</div><div><b>D</b>64</div></div>')

SPEC = dict(
    warm=dict(
        title='Which One Doesn’t Belong?',
        ask='Four numbers. Which one doesn’t belong? Pick one and give a reason.',
        body=TILES,
        strip=strip(srock('🤔', 120, 9, 2.4, 42), sb('🧩', 185, .3, 36), sblink('❓', 245, 0, 32)),
        nudge='What’s your reason? Does anyone have a different pick?',
        reveal=('<b>Every one of them can be the odd one out.</b> '
                f'<b>A 16</b> is the only perfect <b>fourth</b> power ({T("2^4")}). '
                '<b>B 27</b> is the only odd number, and the only one that is not a perfect square. '
                f'<b>C 36</b> is the only one with two different prime factors ({T(r"2\times2\times3\times3")}). '
                f'<b>D 64</b> is the only one that is a perfect square <b>and</b> a perfect cube ({T("8^2")} and {T("4^3")}).')),
    drop_cards=['s1b'],
    drop_expl=['abs', 'allowed7', 'shapes'],
    drop_expl_with_prev=['radgraph'],
    drop_str=['  <h3 class="sub">Where is the radicand above zero?</h3>\n'],
    replace=[('<h3>Allowed, evaluated, or jammed?</h3>', '<h3>Allowed, evaluated, or not real?</h3>')],
    practice=dict(after='ex2', qs='1–3', rest='4–16', line='State the restrictions, then evaluate where the radical is real.',
                  chips=[('1', 'State the restriction'), ('2', 'Squares, cubes and denominators'), ('3', 'Restrict, then evaluate exactly')],
                  note='We carry on when most of the class has reached Question 3.'),
)
