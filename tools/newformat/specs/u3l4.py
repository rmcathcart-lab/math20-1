from pichelp import *
T = lambda x: '<span class="tex">%s</span>' % x


def pizzabox():
    """An open, empty square pizza box and a breadstick rocking above it (it is not shown lying in the box)."""
    stick = (f'<g><animateTransform attributeName="transform" type="rotate" values="-9 165 34;9 165 34;-9 165 34" dur="2.6s" repeatCount="indefinite"/>'
             f'<rect x="100" y="26" width="130" height="17" rx="8.5" fill="#e2b06a" stroke="#a8712f" stroke-width="3"/>'
             + ''.join(f'<circle cx="{x}" cy="34" r="1.8" fill="#fff6e0"/>' for x in range(114, 222, 14)) + '</g>')
    box = (f'<rect x="95" y="72" width="140" height="140" rx="4" fill="#f1dcb3" stroke="#b78b4a" stroke-width="5"/>'
           f'<rect x="105" y="82" width="120" height="120" rx="3" fill="#f7e8c8" stroke="#d2b07a" stroke-width="2"/>')
    lab = (f'<text x="165" y="238" font-size="21" font-weight="700" fill="{INK}" text-anchor="middle">30 cm</text>'
           f'<text x="70" y="142" font-size="21" font-weight="700" fill="{INK}" text-anchor="middle" transform="rotate(-90 70 142)">30 cm</text>')
    return svg(stick + box + lab + qmark(280, 70, 44, RED), 'An empty square pizza box and a breadstick')


SPEC = dict(
    warm=dict(
        title='The Breadstick Box',
        ctx=['A pizza box is a square, <b>30 cm</b> on each side. You want to hide one long breadstick lying flat on the bottom of the empty box.'],
        ask='What is the longest breadstick that fits? Estimate first.',
        pic=pizzabox(),
        strip=strip(sb('🍕', 80), srock('🥖', 165), sb('🍕', 250, .5), sb('😋', 310, .9)),
        nudge='Write your estimate down first.',
        reveal=(f'<b>About 42 cm</b>, laid corner to corner. The diagonal of the square is much longer than a side: {T("30\\sqrt{2}\\approx42.4")} cm.')),
    drop_expl=['read', 'unit', 'patterns', 'anyq', 'subst'],
    practice=dict(after='ex4', qs='1–5', rest='6–18', line='Exact values from the special triangles, in any quadrant, and in expressions.',
                  chips=[('1', 'The special triangles'), ('2', 'Exact values, any quadrant'), ('3', 'Patterns in the table'), ('4–5', 'Exact expressions')],
                  note='We carry on when most of the class has reached Question 4.'),
)
