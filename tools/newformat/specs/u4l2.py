from pichelp import *
T = lambda x: '<span class="tex">%s</span>' % x

# A two-digit mystery number: two blank digit cards with "?" on them, a magnifying glass sweeping across. Nothing on
# the cards gives a digit away (the twist, that there are two answers, is only in the Reveal).
def _card(x, begin):
    return (f'<g><animateTransform attributeName="transform" type="translate" values="0 0;0 -8;0 0" dur="1.8s" begin="{begin}s" repeatCount="indefinite"/>'
            f'<rect x="{x}" y="62" width="96" height="128" rx="16" fill="#fffdf6" stroke="{INK}" stroke-width="4"/>'
            f'<text x="{x + 48}" y="150" font-size="76" font-weight="800" fill="{BLUE}" text-anchor="middle">?{blink(1.8, begin, .3)}</text></g>')
GLASS = ('<g><animateTransform attributeName="transform" type="translate" values="40 0;190 0;40 0" dur="5s" repeatCount="indefinite"/>'
         f'<circle cx="40" cy="196" r="30" fill="#dfeefe" fill-opacity=".55" stroke="{INK}" stroke-width="5"/>'
         f'<line x1="62" y1="218" x2="90" y2="244" stroke="{AMBER}" stroke-width="11" stroke-linecap="round"/></g>')
MYSTERY = svg(_card(60, 0) + _card(174, .9) + GLASS + qmark(300, 50, 34, RED), 'Two mystery digit cards and a magnifying glass')

SPEC = dict(
    warm=dict(
        title='Who Am I?',
        ctx='I am a two-digit number. Multiply my two digits and you get <b>24</b>. Add them and you get <b>10</b>.',
        ask='Who am I?',
        pic=MYSTERY,
        strip=strip(sdrive('🕵️', 8, size=36), sfloat('❔', 250, 3.2), sfloat('❔', 300, 3.6, 1.6, 26)),
        nudge='How do you know?',
        reveal=('<b>46</b>, or <b>64</b>! The digits must be 4 and 6: ' + T(r'4\times6=24') + ' and ' + T('4+6=10') + '. '
                '(3 and 8 multiply to 24 but add to 11; 2 and 12 is not two digits.) Two numbers fit the riddle, '
                'depending on which digit comes first.')),
    # Removed: the area-model "why ac and b" proof, the second copy of the hunt (its sign step and Example 3/4 choices
    # are now in the one decomposition explainer), the two-variable area-model box, and the square-picture proof of
    # the perfect-square pattern. Kept: the decomposition X (one procedure), guess and check, GCF first (with its
    # "not fully factored" stamps), fractions, and the perfect-square test stamps.
    drop_expl=['areaWhy', 'huntNeg', 'boxMethod', 'squareModel'],
    replace=[('<p>List the factor pairs of <span class="tex">ac</span> and check their sums until one is <span class="tex">b</span>. Then split, group and factor out the common bracket.</p>',
              '<p>Draw the X: <span class="tex">ac</span> on top, <span class="tex">b</span> underneath. List the factor pairs of <span class="tex">ac</span> and check their sums until one is <span class="tex">b</span>, and circle it. Then split, group and factor out the common bracket.</p>')],
    practice=dict(after='ex4', qs='1–5', rest='6–18', line='Decomposition, with and without negative terms, then guess and check.',
                  chips=[('1', 'Decomposition'), ('2–3', 'Negative terms'), ('4', 'Guess and check'), ('5', 'Check a student’s answer')],
                  note='We carry on when most of the class has reached Question 4.'),
)
