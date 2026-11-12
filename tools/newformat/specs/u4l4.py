from pichelp import *
T = lambda x: '<span class="tex">%s</span>' % x

# Two truths and a lie, no calculator. Three products next to 20 × 20; the lie is 18 × 22 (it is 396). The strip: a
# fibbing face rocking beside floating question marks (nothing says which card is the lie).
TILES = ('<div class="vw-tiles" style="--n:3;--fs:34px">'
         + ''.join(f'<div><b>{k}</b>{T(e)}</div>' for k, e in [('A', r'20\times20=400'), ('B', r'19\times21=399'), ('C', r'18\times22=397')])
         + '</div>')

SPEC = dict(
    warm=dict(
        title='Two Truths and a Lie',
        ask='Two of these are true. One is a lie. Which one? <b>No calculator!</b>',
        body=TILES,
        strip=strip(srock('🤥', 50), sfloat('❓', 150, 3), sfloat('❓', 225, 3.4, 1.1), sfloat('❓', 300, 3.8, 2.2)),
        nudge='How can you tell without multiplying it all out?',
        reveal=(f'<b>C is the lie:</b> {T(r"18\times22=396")}. A and B are true. Moving 1 away from 20 on each side '
                f'loses {T("1")}; moving 2 away loses {T("4")}; moving 3 away ({T(r"17\times23")}) would lose {T("9")}.')),
    # Removed: the multiplying-grid and cut-and-slide square pictures of why the pattern works (and the patio copy of the
    # cut-and-slide with its card), the dot-array GCF picture, and the banner replay of Example 3 (with its card).
    # Kept: the X for a sum of squares (product +n, sum 0: nothing to circle), the three-checks stamp, fractions,
    # the keep-going factor tree, the A/B boxes for binomials, the checklist flowchart and the factor cards.
    drop_expl=['foilCancel', 'gcfFirst'],
    drop_cards=['s2b', 's5b'],
    drop_str=['  <h3 class="sub">Why it works: cut a square out of a square</h3>\n'],
    drop_expl_with_prev=['cutSlide'],
    practice=dict(after='ex2', qs='1–3', rest='4–16', line='Recognize a difference of squares, take out a GCF first, and spot a sum that does not factor.',
                  chips=[('1', 'Factor, if possible'), ('2', 'GCF first'), ('3', 'Trigonometric expressions')],
                  note='We carry on when most of the class has reached Question 3.'),
)
