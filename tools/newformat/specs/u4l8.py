from pichelp import *
T = lambda x: '<span class="tex">%s</span>' % x


def hat():
    # a magician's hat with a rabbit popping in and out, a wand that taps, and sparkles
    rabbit = (f'<g><animateTransform attributeName="transform" type="translate" values="0 64;0 64;0 0;0 0;0 64" keyTimes="0;.3;.45;.85;1" dur="3.2s" repeatCount="indefinite"/>'
              f'<text x="150" y="128" font-size="62" text-anchor="middle">🐇</text></g>')
    brim = f'<ellipse cx="150" cy="226" rx="92" ry="14" fill="{INK}"/>'
    body = (f'<path d="M92 128 L208 128 L200 222 L100 222 Z" fill="#2e2a22"/>'
            f'<rect x="96" y="176" width="108" height="18" fill="{RED}"/>'
            f'<ellipse cx="150" cy="128" rx="58" ry="11" fill="#1d1a15" stroke="{INK}" stroke-width="2"/>')
    # the rabbit sits behind the hat body: draw it first, then hide its lower half with the hat
    wand = (f'<g><animateTransform attributeName="transform" type="rotate" values="0 262 200;-18 262 200;0 262 200" dur="1.6s" repeatCount="indefinite"/>'
            f'<line x1="262" y1="200" x2="222" y2="118" stroke="{INK}" stroke-width="7" stroke-linecap="round"/>'
            f'<line x1="226" y1="126" x2="220" y2="114" stroke="#fff" stroke-width="7" stroke-linecap="round"/></g>')
    spark = ''.join(f'<text x="{x}" y="{y}" font-size="{s}" text-anchor="middle">✨{blink(1.8, b, .1)}</text>'
                    for x, y, s, b in [(232, 96, 30, 0), (60, 90, 26, .6), (276, 150, 22, 1.2), (40, 170, 22, .9)])
    clip = '<defs><clipPath id="u4l8hat"><rect x="0" y="0" width="330" height="129"/></clipPath></defs>'
    return clip + f'<g clip-path="url(#u4l8hat)">{rabbit}</g>' + body + brim + wand + spark


SPEC = dict(
    warm=dict(
        title='The Magic Number Trick',
        ctx=['Pick any number (not 0). Add 3. Square the answer. Subtract 9.',
             'Divide by the number you picked. Then subtract 6.'],
        ask='What number do you end up with? Compare with the person beside you.',
        pic=svg(hat(), 'A magician’s hat with a rabbit popping out and a wand tapping'),
        strip=strip(sblink('✨', 120, 0, 30), srock('🎩', 175, 10, 1.8, 40), sblink('✨', 230, .8, 30)),
        nudge='Will it work for every number? Why?',
        reveal=f'<b>You get back the number you picked!</b> Call it {T("x")}: {T("(x+3)^2-9=x^2+6x")}, and {T("\\dfrac{x^2+6x}{x}=\\dfrac{x(x+6)}{x}=x+6")}. Subtract 6: {T("x")}.<br>'
               f'<span class="muted">That’s also why 0 is not allowed: you can’t divide by 0.</span>'),
    drop_expl=['solveRecap', 'radRecap', 'errors', 'subDos', 'rootsGraph', 'twoRad'],
    replace=[(' Check the solving pipeline above (Example 4 chips).', ''),
             (' Check the radical-equation steps above (Example 7 chips).', '')],
)

# 2026-11-11: hat picture replaced by a number machine (u2l4 already uses the top hat)
def gear(cx, cy, r, teeth, col, dur, rev=False):
    pts = []
    import math
    for i in range(teeth * 2):
        a = math.pi * i / teeth
        rr = r if i % 2 == 0 else r * 0.78
        pts.append(f'{cx + rr*math.cos(a):.1f},{cy + rr*math.sin(a):.1f}')
    to = -360 if rev else 360
    return (f'<g><animateTransform attributeName="transform" type="rotate" from="0 {cx} {cy}" to="{to} {cx} {cy}" dur="{dur}s" repeatCount="indefinite"/>'
            f'<polygon points="{" ".join(pts)}" fill="{col}"/><circle cx="{cx}" cy="{cy}" r="{r*0.3:.1f}" fill="#fff"/></g>')

def machine():
    # a number machine: a card with "?" drops into the hopper, gears turn, a lamp blinks, a "?" card slides out
    body = (f'<rect x="70" y="70" width="190" height="120" rx="14" fill="#efe9dc" stroke="{INK}" stroke-width="4"/>'
            f'<path d="M135 70 L120 40 L210 40 L195 70 Z" fill="{LINE}" stroke="{INK}" stroke-width="4"/>'
            f'<rect x="240" y="150" width="50" height="26" rx="4" fill="{LINE}" stroke="{INK}" stroke-width="3"/>')
    gears = gear(120, 130, 30, 9, BLUE, 4) + gear(170, 118, 20, 7, AMBER, 2.7, True) + gear(212, 140, 26, 8, GREEN, 3.5)
    lamp = f'<circle cx="236" cy="88" r="9" fill="{RED}">{blink(0.9, 0, .2)}</circle>'
    card_in = (f'<g><animateTransform attributeName="transform" type="translate" values="0 -40;0 -40;0 30;0 30" keyTimes="0;.15;.5;1" dur="3.2s" repeatCount="indefinite"/>'
               f'<animate attributeName="opacity" values="1;1;0;0" keyTimes="0;.45;.5;1" dur="3.2s" repeatCount="indefinite"/>'
               f'<rect x="146" y="20" width="38" height="44" rx="6" fill="#fff" stroke="{INK}" stroke-width="3"/>'
               f'<text x="165" y="52" font-size="30" font-weight="700" text-anchor="middle" fill="{BLUE}">?</text></g>')
    card_out = (f'<g><animateTransform attributeName="transform" type="translate" values="0 0;0 0;46 0;46 0" keyTimes="0;.55;.8;1" dur="3.2s" repeatCount="indefinite"/>'
                f'<animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;.55;.6;.95;1" dur="3.2s" repeatCount="indefinite"/>'
                f'<rect x="248" y="182" width="38" height="44" rx="6" fill="#fff" stroke="{INK}" stroke-width="3"/>'
                f'<text x="267" y="214" font-size="30" font-weight="700" text-anchor="middle" fill="{RED}">?</text></g>')
    return body + gears + lamp + card_in + card_out
SPEC['warm']['title'] = 'The Number Machine'
SPEC['warm']['pic'] = svg(machine(), 'A number machine with turning gears: a mystery number goes in the top and a mystery number comes out')
SPEC['warm']['strip'] = strip(sspin('⚙️', 140, 4), sblink('💡', 190, 0, 34), sspin('⚙️', 240, 3, rev=True))
