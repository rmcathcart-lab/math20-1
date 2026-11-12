from pichelp import *
T = lambda x: '<span class="tex">%s</span>' % x


def card(x, y, begin):
    # a face-down playing card that rocks, with a ? on its back
    cx, cy = x + 45, y + 65
    return (f'<g><animateTransform attributeName="transform" type="rotate" values="-7 {cx} {cy};7 {cx} {cy};-7 {cx} {cy}" dur="2.4s" begin="{begin}s" repeatCount="indefinite"/>'
            f'<rect x="{x}" y="{y}" width="90" height="130" rx="12" fill="{BLUE}" stroke="{INK}" stroke-width="3.5"/>'
            f'<rect x="{x + 9}" y="{y + 9}" width="72" height="112" rx="8" fill="none" stroke="#fff" stroke-width="2.5" stroke-dasharray="6 5"/>'
            f'<text x="{cx}" y="{cy + 18}" font-size="52" font-weight="800" fill="#fff" text-anchor="middle">?</text></g>')


def tag(x, y, txt, col, begin):
    return (f'<g><rect x="{x}" y="{y}" width="120" height="44" rx="22" fill="#fffdf6" stroke="{col}" stroke-width="3"/>'
            f'<text x="{x + 60}" y="{y + 31}" font-size="26" font-weight="800" fill="{col}" text-anchor="middle">{txt}</text>{blink(2.4, begin, .45)}</g>')


PIC = svg(card(62, 40, 0) + card(178, 40, 1.2) + tag(40, 192, '× → 0', RED, 0) + tag(170, 192, '+ → 7', GREEN, 1.2),
          'Two face-down cards with question marks, and the clues: multiply to 0, add to 7')

SPEC = dict(
    warm=dict(
        title='Who Are We?',
        ctx=['We are two secret numbers.', 'Multiply us and you get <b>0</b>. Add us and you get <b>7</b>.'],
        ask='Who are we?',
        pic=PIC,
        strip=strip(srock('🃏', 150, 10, 2.4, 40), sblink('❓', 205, 0, 32), srock('🃏', 260, 10, 2.4, 40)),
        nudge='How do you know there’s no other pair?',
        reveal=f'<b>0 and 7.</b> The only way two numbers multiply to 0 is if one of them <b>is</b> 0. Then the other one must be 7, since {T("0+7=7")}. No other pair works.'),
    drop_expl=['zpp', 'fromRoots', 'ball'],
    practice=dict(after='ex4', qs='1–5', rest='6–18', line='Get 0 on one side, factor fully, then set each factor equal to 0.',
                  chips=[('1', 'Already factored'), ('2–3', 'Factor, then solve'), ('4–5', 'Standard form first')],
                  note='We carry on when most of the class has reached Question 4.'),
)
