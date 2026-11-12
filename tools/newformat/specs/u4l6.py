from pichelp import *
T = lambda x: '<span class="tex">%s</span>' % x

TILES = ('<div class="vw-tiles" style="--n:4;--fs:64px">'
         + ''.join(f'<div><b>{k}</b>{v}</div>' for k, v in [('A', '9'), ('B', '16'), ('C', '25'), ('D', '43')])
         + '</div>')

SPEC = dict(
    warm=dict(
        title='Which One Doesn’t Belong?',
        ask='Which number doesn’t belong with the others? Give a reason.',
        body=TILES,
        strip=strip(srock('🤔', 120, 10, 2.2, 40), sb('🟦', 190, 0, 30), sb('🟨', 235, .3, 30), sb('🟥', 280, .6, 30)),
        nudge='Can you find a reason for a different one?',
        reveal='<b>Every one of them can be the odd one out.</b><br>'
               '<b>A, 9:</b> the only one-digit number. &nbsp; <b>B, 16:</b> the only even number. &nbsp; '
               '<b>C, 25:</b> the only multiple of 5. &nbsp; '
               f'<b>D, 43:</b> the only one that isn’t a perfect square ({T(r"\sqrt9=3,\ \sqrt{16}=4,\ \sqrt{25}=5")}, but {T(r"\sqrt{43}")} isn’t a whole number).'),
    drop_expl=['restrict', 'eachTerm', 'noMeet', 'twoRad'],
    practice=dict(after='ex3', qs='1–4', rest='5–16', line='Restriction first, then isolate, square and verify every answer.',
                  chips=[('1', 'Restrictions'), ('2–3', 'Isolate, square, verify'), ('4', 'Catch the extraneous root')],
                  note='We carry on when most of the class has reached Question 4.'),
)
