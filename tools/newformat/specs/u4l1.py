from pichelp import *
T = lambda x: '<span class="tex">%s</span>' % x

# Which one doesn't belong? Four numbers, and every one of them can be the odd one out (that twist is only in the
# Reveal). The strip: a magnifying glass sliding past blinking question marks.
WODB = ('<div class="vw-wodb">' + ''.join(f'<div><b>{k}</b>{n}</div>' for k, n in [('A', 12), ('B', 16), ('C', 25), ('D', 36)]) + '</div>')

SPEC = dict(
    warm=dict(
        title='Which One Doesn’t Belong?',
        ask='Which number doesn’t belong with the others? Why?',
        body=WODB,
        strip=strip(sblink('❓', 70, 0, 34), sblink('❓', 170, .5, 34), sblink('❓', 270, 1, 34), sdrive('🔍', 6, size=38)),
        nudge='Pick one and give a reason. Can someone beat it?',
        reveal=('<b>Every one of them can be the odd one out.</b> <b>12</b> is the only one that isn’t a perfect square. '
                '<b>16</b> is the only one made of 2s alone (2 × 2 × 2 × 2). <b>25</b> is the only odd number. '
                '<b>36</b> is the only one with 9 factors (1, 2, 3, 4, 6, 9, 12, 18, 36). Any answer with a good reason wins.')),
    # Removed: the algebra-tile rectangle (a tile proof) with its lead-in, the tiles-that-can't-make-a-rectangle explainer
    # (the X now has Example 7(a) as a choice), and the ascending-order replay (the paragraph in s5b says it).
    # Kept: GCF chips, the bracket parcel, grouping braces, the X (one procedure for x² + bx + c), the factoring checklist
    # flowchart, the slide-along factor test, and the to-scale patio.
    drop_expl=['tryRect', 'ascending'],
    drop_expl_with_prev=['tiles'],
    replace=[
        (' Two variables: <span class="tex">(x+my)(x+ny)</span>. Tiles: the sides of the rectangle.</div>',
         ' Two variables: <span class="tex">(x+my)(x+ny)</span>.</div>'),
        ('factoring x^2 + bx + c and x^2 + bxy + cy^2 with product and sum (algebra tiles making a rectangle)',
         'factoring x^2 + bx + c and x^2 + bxy + cy^2 with product and sum (the X)'),
    ],
    practice=dict(after='ex3', qs='1–3', rest='4–16', line='Common factors: a GCF, a common bracket, then grouping.',
                  chips=[('1', 'Take out the GCF'), ('2', 'A common bracket'), ('3', 'Factor by grouping')],
                  note='We carry on when most of the class has reached Question 3.'),
)
