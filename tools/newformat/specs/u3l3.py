from pichelp import *
T = lambda x: '<span class="tex">%s</span>' % x


def mirrors():
    """Two mirrors standing at a right angle like an open book, one duck in front (no reflections drawn: that is the answer)."""
    MF, MS = '#dcebf7', '#5b7fa6'
    left = f'<polygon points="165,28 35,62 35,212 165,160" fill="{MF}" stroke="{MS}" stroke-width="4" stroke-linejoin="round"/>'
    right = f'<polygon points="165,28 295,62 295,212 165,160" fill="{MF}" stroke="{MS}" stroke-width="4" stroke-linejoin="round"/>'
    shine = ''.join(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="#fff" stroke-width="7" stroke-linecap="round">{blink(2.6, b, .1)}</line>'
                    for x1, y1, x2, y2, b in ((60, 120, 95, 80, 0), (75, 150, 125, 95, .5), (235, 80, 270, 120, 1.3), (205, 95, 255, 150, 1.8)))
    table = f'<polygon points="0,190 35,212 165,160 295,212 330,190 330,250 0,250" fill="#efe3c9"/>'
    return svg(table + left + right + shine + f'<line x1="165" y1="28" x2="165" y2="160" stroke="{MS}" stroke-width="5"/>'
               + emo('🦆', 165, 238, 60, 6, 1.8), 'Two mirrors at a right angle with one duck in front of them')


SPEC = dict(
    warm=dict(
        title='Ducks in the Mirrors',
        ctx=['Two flat mirrors stand on a table, edge to edge at a <b>right angle</b>, like a book opened halfway. '
             'One rubber duck sits in front of them, between the mirrors.'],
        ask='Looking in, how many ducks can you see, counting the real one?',
        pic=mirrors(),
        strip=strip(sdrive('🦆', 7, 0, 36, hop=3), sdrive('🦆', 7, 3.5, 36, hop=3)),
        nudge='Try it at home with two mirrors!',
        reveal=('<b>4 ducks.</b> The real one, one in each mirror, and a <b>third reflection</b> right in the corner where the mirrors meet: '
                'a reflection of a reflection, seen in both mirrors at once.')),
    drop_expl=['mirror', 'placeR', 'isolate'],
    practice=dict(after='ex4', qs='1–7', rest='8–19', line='Signs from CAST, the same ratio of the reference angle, and the other two ratios from one.',
                  chips=[('1–2', 'Signs from CAST'), ('3–4', 'Same ratio of ' + T('\\theta_R') + ', the other angle'), ('5–7', 'The other two ratios')],
                  note='We carry on when most of the class has reached Question 5.'),
)
