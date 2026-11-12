from pichelp import *
T = lambda x: '<span class="tex">%s</span>' % x

TILE = lambda k, em, html: f'<div class="lab"><b>{k}</b><span style="font-size:44px;line-height:1.1">{em}</span><span>{html}</span></div>'

SPEC = dict(
    warm=dict(
        title='Two Truths and a Lie',
        ask='Two of these are true. One is a lie. Which one is the lie?',
        body=('<div class="vw-tiles" style="--n:3;--fs:23px">'
              + TILE('A', '💇', 'Hair grows about <b>1.25 cm</b> a month. In <b>2 years</b> it grows about <b>30 cm</b>.')
              + TILE('B', '🐷', 'Put <b>$5</b> in a piggy bank every week. After <b>4 years</b> it holds more than <b>$1000</b>.')
              + TILE('C', '🗼', 'The CN Tower stair climb has <b>1776 steps</b>. At <b>10 steps a minute</b> you’d reach the top in under <b>2 hours</b>.')
              + '</div>'),
        strip=strip(sroad(54), sdrive('🚶', 8, 0, 34), sdrive('🏃', 5, -2, 34), sb('🐷', 312, 0, 30)),
        nudge='Which one can you check fastest?',
        reveal=f'<b>C is the lie.</b> {T(r"1776\div10\approx178")} minutes is almost <b>3 hours</b>. '
               f'A is true ({T(r"1.25\times24=30")} cm) and B is true ({T(r"5\times52\times4=1040")} dollars).'),
    drop_expl=['system', 'feeRate', 'truck'],
    practice=dict(after='ex3', qs='1–5', rest='6–15',
                  line='Two terms known: find d, the first term and the general term, then use them.',
                  chips=[('1–2', 'd, t₁ and the general term'), ('3–4', 'Terms in between; is it a term?'), ('5', 'The can display')],
                  note='We carry on when most of the class has reached Question 4.'),
)
