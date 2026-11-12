from pichelp import *
T = lambda x: '<span class="tex">%s</span>' % x

TILES = ('<div class="vw-wodb">'
         + ''.join(f'<div><b>{k}</b>{T(v)}</div>' for k, v in [('A', r'\sqrt{36}'), ('B', r'\sqrt[3]{27}'), ('C', r'\sqrt{20}'), ('D', r'\sqrt{\tfrac94}')])
         + '</div>')

SPEC = dict(
    warm=dict(
        title='Which One Doesn’t Belong?',
        ask='Three of these belong together. Which one is the odd one out, and why?',
        body=TILES,
        strip=strip(srock('🤔', 40), sb('❓', 130, 0, 34), sb('❓', 200, .4, 34), sb('❓', 270, .8, 34)),
        nudge='What is your reason?',
        reveal=f'<b>Every one of them can be the odd one out.</b> '
               f'<b>A</b> {T(r"\sqrt{36}=6")} is the only even number. '
               f'<b>B</b> {T(r"\sqrt[3]{27}=3")} is the only cube root. '
               f'<b>C</b> {T(r"\sqrt{20}=2\sqrt5")} is the only irrational number. '
               f'<b>D</b> {T(r"\sqrt{\tfrac94}=\tfrac32")} is the only one with a fraction under the root, and the only answer less than 2. '
               f'Did your neighbour pick a different one?'),
    # whyWrong: picture proofs of the three errors (the flip cards above it keep the errors and their fixes).
    # varRad, collect, areaModel, rationalize, rectangle: second versions of animations from Lessons 1-6 (and two of
    # them picture proofs: the square of side √3 and the square-minus-a-square).
    drop_expl=['whyWrong', 'varRad', 'collect', 'areaModel', 'rationalize', 'rectangle'],
    replace=[('data-section="Multiplying: the area model"', 'data-section="Multiplying"'),
             ('An area model keeps track: one box for each pair of terms. Inside each box, multiply',
              'Multiply every term of one bracket by every term of the other. In each product, multiply')],
    # review lesson: no practice break (the whole lesson leads into Assignment 7)
)
