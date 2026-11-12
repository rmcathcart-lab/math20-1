from pichelp import *
T = lambda x: '<span class="tex">%s</span>' % x

# An emoji picture puzzle: three lines of lunch, then one question. The picture is just the three foods bobbing (no
# numbers on it); the strip is a food truck driving along. The twists (multiply before you add, and a taco of −3) are
# only in the Reveal.
EQ = lambda s: f'<span style="font-size:38px;letter-spacing:.04em">{s}</span>'
LUNCH = svg(emo('🍕', 78, 112, 76, 10, 1.5) + emo('🍔', 250, 112, 76, 10, 1.5, .5) + emo('🌮', 165, 222, 76, 10, 1.5, 1)
            + qmark(165, 70, 44, RED), 'A pizza, a burger and a taco bouncing')

SPEC = dict(
    warm=dict(
        title='The Lunch Puzzle',
        ctx=[EQ('🍕 + 🍕 + 🍕 = 30'), EQ('🍕 + 🍔 + 🍔 = 20'), EQ('🍔 + 🌮 × 🌮 = 14')],
        ask='What is 🍕 + 🍔 × 🌮 ?',
        pic=LUNCH,
        strip=strip(sroad(), sdrive('🚚', 7, size=38)),
        nudge='Convince the person beside you.',
        reveal=('<b>25.</b> 🍕 is 10 (three of them make 30), so 🍔 is 5 (10 + 5 + 5 = 20). Then 🌮 × 🌮 = 9, so 🌮 is 3. '
                'And 10 + 5 × 3 = 10 + 15 = <b>25</b>: multiply before you add, so it is not 45. '
                '(Sneaky: −3 × −3 is 9 too. A taco of −3 would give 10 − 15 = −5.)')),
    # Removed: the difference-of-squares "why" (Lesson 4 teaches it), the Example 3 side-by-side replay, and the
    # perfect-square area grid (with its card, which was not in the booklet). Kept: spot the quadratic form, the
    # substitution box (one procedure), the factor tree, the X for a ≠ 1, the binomial box, the substitute-or-expand
    # race, and any chunk / two boxes.
    drop_expl=['dos', 'decomp'],
    drop_cards=['s4c'],
    replace=[('<p>List the factor pairs of <span class="tex">ac</span> in order and stop when the sum is <span class="tex">b</span>.',
              '<p>Use the X: <span class="tex">ac</span> on top, <span class="tex">b</span> underneath. List the factor pairs of <span class="tex">ac</span> in order and circle the one whose sum is <span class="tex">b</span>.')],
    practice=dict(after='ex4', qs='1–4', rest='5–15', line='Substitute, factor, put it back, then factor every factor fully.',
                  chips=[('1', 'Substitution'), ('2', 'Finish with a difference of squares'), ('3', 'Leading coefficient not 1'), ('4', 'Take out −1 first')],
                  note='We carry on when most of the class has reached Question 3.'),
)
