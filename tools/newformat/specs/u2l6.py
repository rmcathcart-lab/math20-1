from pichelp import *
T = lambda x: '<span class="tex">%s</span>' % x

# A stopwatch whose hand sweeps round, with a thinking face bobbing beside it. No numbers that hint at the answer.
_cx, _cy, _r = 150, 140, 88
WATCH = svg(
    f'<rect x="{_cx-14}" y="{_cy-_r-30}" width="28" height="20" rx="4" fill="{INK}"/>'
    f'<line x1="{_cx+62}" y1="{_cy-_r+14}" x2="{_cx+76}" y2="{_cy-_r}" stroke="{INK}" stroke-width="8" stroke-linecap="round"/>'
    f'<circle cx="{_cx}" cy="{_cy}" r="{_r}" fill="#fffdf6" stroke="{INK}" stroke-width="6"/>'
    + ''.join(f'<line x1="{_cx}" y1="{_cy-_r+8}" x2="{_cx}" y2="{_cy-_r+(20 if a % 90 == 0 else 14)}" stroke="{INK}" stroke-width="{4 if a % 90 == 0 else 2.5}" transform="rotate({a} {_cx} {_cy})"/>' for a in range(0, 360, 30))
    + f'<line x1="{_cx}" y1="{_cy}" x2="{_cx}" y2="{_cy-_r+16}" stroke="{RED}" stroke-width="4.5" stroke-linecap="round">'
      f'<animateTransform attributeName="transform" type="rotate" values="0 {_cx} {_cy};360 {_cx} {_cy}" dur="3s" repeatCount="indefinite"/></line>'
    f'<circle cx="{_cx}" cy="{_cy}" r="7" fill="{RED}"/>'
    + emo('🧠', 286, 96, 52, 8, 1.4),
    'A stopwatch with its hand sweeping round')

SPEC = dict(
    warm=dict(
        title='Beat the Calculator',
        ctx=['One person in the room gets a calculator. Everyone else gets nothing: no calculator, no paper. Ready, set, <b>go!</b>'],
        ask=f'What is {T(r"49\times51")}?',
        pic=WATCH,
        strip=strip(sroad(), sdrive('🏎️', 3.2), sdrive('🚗', 4.4, begin=1.4)),
        nudge='How did the fastest person do it?',
        reveal=f'<b>2499.</b> The quick way: both numbers are 1 away from 50, so '
               f'{T(r"49\times51=(50-1)(50+1)=50^2-1^2=2500-1")}. The two middle parts cancel. '
               f'Same trick: {T(r"98\times102=100^2-2^2=9996")}.'),
    # square: a picture proof (and its warm-up chip). machine2 / machine3: extra versions of the conjugate machine.
    # reduce and combine: replays of Examples 2-6 already covered by the tip and the booklet working.
    drop_expl_with_prev=['square'],
    drop_expl=['machine2', 'reduce', 'machine3', 'combine'],
    drop_str=['  <h3 class="sub">Why the radicals disappear: a picture</h3>\n',
              '  <h3 class="sub">Simplify first, or simplify later?</h3>\n'],
    practice=dict(after='ex2', qs='1–3', rest='4–18', line='Conjugates, then rationalize binomial denominators.',
                  chips=[('1', 'Conjugates and their products'), ('2', 'Rationalize a binomial denominator'),
                         ('3', 'A radical on top as well')],
                  note='We carry on when most of the class has reached Question 3.'),
)
