from pichelp import *
import random
T = lambda x: '<span class="tex">%s</span>' % x


def board():
    """a chessboard; the first squares of the bottom row fill with 1, 2, 4, 8, 16, 32 grains (a loop), the far corner asks ?"""
    X0, Y0, C = 16, 14, 28
    sq = ''.join(f'<rect x="{X0 + c * C}" y="{Y0 + r * C}" width="{C}" height="{C}" fill="{"#efdfbd" if (r + c) % 2 == 0 else "#b98d5c"}"/>'
                 for r in range(8) for c in range(8))
    frame = f'<rect x="{X0 - 6}" y="{Y0 - 6}" width="{8 * C + 12}" height="{8 * C + 12}" rx="6" fill="none" stroke="#6b4a26" stroke-width="6"/>'
    rnd = random.Random(7); piles = []
    for k in range(6):
        n, x, y = 2 ** k, X0 + k * C, Y0 + 7 * C
        rx = 3.4 if n <= 8 else 2.5 if n <= 16 else 1.9
        g = ''.join(f'<ellipse cx="{x + 5 + rnd.random() * (C - 10):.1f}" cy="{y + 5 + rnd.random() * (C - 10):.1f}" rx="{rx}" ry="{rx * .62:.1f}" '
                    f'fill="#ffffff" stroke="#6b5a2e" stroke-width=".9" transform="rotate({rnd.randint(0, 180)} {x + C / 2} {y + C / 2})"/>' for _ in range(n))
        t = 0.13 * k
        anim = (f'<animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;{t:.2f};{t + .02:.2f};.9;1" dur="7s" repeatCount="indefinite"/>' if k else
                '<animate attributeName="opacity" values="1;1;0" keyTimes="0;.9;1" dur="7s" repeatCount="indefinite"/>')
        piles.append(f'<g>{anim}{g}</g>')
    q = f'<g>{blink(1.4)}<text x="{X0 + 7 * C + C / 2}" y="{Y0 + C - 5}" font-size="26" font-weight="800" fill="{RED}" text-anchor="middle">?</text></g>'
    return svg(sq + frame + ''.join(piles) + q + emo('👑', 290, 70, 44, 6, 1.8),
               'A chessboard: the first squares hold 1, 2, 4, 8, 16 and 32 grains of rice; the last square is a question mark')


SPEC = dict(
    warm=dict(
        title='Rice on the Chessboard',
        ctx=['A king promises a reward: <b>1 grain</b> of rice on the first square of a chessboard, <b>2</b> on the next, '
             '<b>4</b> on the next, doubling on every one of the <b>64</b> squares.',
             'A 1 kg bag of rice holds about 40&#8239;000 grains.'],
        ask='Estimate: how much rice does the king owe?',
        pic=board(),
        strip=strip(sfloat('🍚', 120, 3.2, 0, 30), sfloat('🍚', 190, 3.2, 1.1, 30), sfloat('🍚', 260, 3.2, 2.2, 30)),
        nudge='A bag? A truck? The whole school? Guess, then compare with your neighbour.',
        reveal=('<b>Far more than the school!</b> The total is ' + T('2^{64}-1') + ', about 18 quintillion '
                '(18&#8239;000&#8239;000&#8239;000&#8239;000&#8239;000&#8239;000) grains: about 460 trillion bags (460 billion tonnes), '
                'more rice than the whole world grows in 500 years. The last square alone holds more than all the other 63 squares together.')),
    # ghost: a second explanation of the second form; whichOne: a flowchart (the def card says it); findSum: a
    # line-by-line replay of Example 2; findR: replays of Example 5; stairs: a bar picture of t_n = S_n − S_(n−1).
    # Kept: shift (the cancelling), findN (climb the table of powers), ball (the bounce path), phone (the phone tree).
    drop_expl=['whichOne', 'findSum', 'stairs'],
    drop_expl_with_prev=['ghost'],
    drop_str=['  <h3 class="sub">The second form: one hop past the end</h3>\n',
              '  <h3 class="sub">Which formula?</h3>\n',
              '  <h3 class="sub">Substitute, then evaluate carefully</h3>\n'],
    drop_cards=['s3b'],
    practice=dict(after='ex3', qs='1–3', rest='4–18', line='Find the sum: with the number of terms, or with the last term.',
                  chips=[('1', 'Sum when you know ' + T('n')), ('2', 'Sum when you know the last term'), ('3', 'From a general term')],
                  note='We carry on when most of the class has finished Question 2.'),
)
