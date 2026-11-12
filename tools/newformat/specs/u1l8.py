from pichelp import *
T = lambda x: '<span class="tex">%s</span>' % x

tile = lambda k, html: f'<div style="padding-top:34px"><b>{k}</b><span>{html}</span></div>'

SPEC = dict(
    warm=dict(
        title='Two Truths and a Lie',
        ask='Two of these are true. One is a lie. Which one?',
        body=('<div class="vw-tiles" style="--n:3;--fs:25px">'
              + tile('A', 'Keep adding ' + T(r'\tfrac12+\tfrac14+\tfrac18+\tfrac1{16}+\cdots') + ' forever. The total never gets past <b>1</b>.')
              + tile('B', 'Keep adding ' + T(r'1+\tfrac12+\tfrac13+\tfrac14+\cdots') + ' forever. The total never gets past <b>100</b>.')
              + tile('C', T(r'0.999\ldots') + ' (nines that go on forever) is exactly equal to <b>1</b>.')
              + '</div>'),
        strip=strip(sb('😇', 90, 0), sb('😇', 170, .3), srock('🤥', 250), sspin('🌀', 312, 5, 28, 30)),
        nudge='Which one is the lie? How sure are you?',
        reveal=('<b>B is the lie!</b> Its total grows forever, just very slowly: ' + T(r'\tfrac13+\tfrac14') + ' is more than '
                + T(r'\tfrac12') + ', the next four terms are more than ' + T(r'\tfrac12') + ', the next eight are more than '
                + T(r'\tfrac12') + ', and so on: another half, again and again. (It passes 100 only after about '
                + T(r'10^{43}') + ' terms.) <b>A</b> is true: each piece fills half of the gap that is left, so it never gets past 1. '
                '<b>C</b> is true too: ' + T(r'\tfrac13=0.333\ldots') + ', so ' + T(r'3\times\tfrac13=0.999\ldots') + ', and that is 1.')),
    # partials (s1b): a dot plot that repeats Example 1(b); powers: bars of r^n (the table above shows it); gap: a replay
    # of Example 3; solve: replays of Example 4; ceiling: a second application replay (Example 7).
    # Kept: fill (the square fills beside the number line), gate (through the gate? verdicts), decimal (the blocks),
    # bounce (the ball), xrange (the gate pulled back to x).
    drop_cards=['s1b'],
    drop_expl=['powers', 'gap', 'solve', 'ceiling'],
    practice=dict(after='ex3', qs='1–4', rest='5–18', line='Partial sums, convergent or divergent, and the sum to infinity.',
                  chips=[('1–2', 'Partial sums'), ('3', 'Convergent or divergent?'), ('4', 'How close is close?')],
                  note='We carry on when most of the class has finished Question 3.'),
)
