from pichelp import *
T = lambda x: '<span class="tex">%s</span>' % x


def tag():
    """a sneaker with a price tag: $100, then +50% and -50% stickers slap on, then the tag asks $ ? (a loop; never shows $75)"""
    tagp = (f'<g transform="rotate(-8 205 95)"><path d="M150 60 h120 a8 8 0 0 1 8 8 v58 a8 8 0 0 1 -8 8 h-120 l-26 -37 z" fill="#fff6d8" stroke="{INK}" stroke-width="3"/>'
            f'<circle cx="140" cy="97" r="6" fill="#fff" stroke="{INK}" stroke-width="2.5"/>'
            f'<text x="212" y="113" font-size="44" font-weight="800" fill="{INK}" text-anchor="middle">$100'
            '<animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;.62;.64;.97;1" dur="6s" repeatCount="indefinite"/></text>'
            f'<text x="212" y="113" font-size="44" font-weight="800" fill="{RED}" text-anchor="middle" opacity="0">$ ?'
            '<animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;.62;.64;.97;1" dur="6s" repeatCount="indefinite"/></text></g>')
    def sticker(x, y, txt, col, t0):
        return (f'<g opacity="0"><animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;{t0};{t0 + .02};.97;1" dur="6s" repeatCount="indefinite"/>'
                f'<circle cx="{x}" cy="{y}" r="32" fill="{col}"/><text x="{x}" y="{y + 6}" font-size="17" font-weight="800" fill="#fff" text-anchor="middle">{txt}</text></g>')
    string = f'<path d="M140 97 C110 120 100 150 110 175" fill="none" stroke="{INK}" stroke-width="2.5"/>'
    return svg(string + emo('👟', 110, 228, 76, 5, 1.6) + tagp + sticker(266, 44, '+50%', GREEN, .2) + sticker(292, 150, '−50%', RED, .42),
               'A sneaker with a $100 price tag; a +50% sticker, then a −50% sticker, then the tag shows $ ?')


SPEC = dict(
    warm=dict(
        title='The Sneaky Sale',
        ctx=['A pair of sneakers costs <b>$100</b>.',
             'The store <b>raises</b> the price by <b>50%</b>. A month later, the new price goes on sale for <b>50% off</b>.'],
        ask='What do the sneakers cost now?',
        pic=tag(),
        strip=strip(sdrive('👟', 6, size=34, hop=4), sb('🏷️', 300, 0, 30, 5, 2)),
        nudge='Work it out, then convince the person beside you.',
        reveal=('<b>$75, not $100!</b> Up 50%: the price becomes $150. Then 50% off takes half of <b>$150</b>, which is $75 off, '
                'not $50. The second percent is taken from a bigger number. (Sale first, then the raise? $50, then $75 again.)')),
    # factor: bars for each percent change (repeats the key cards and the tip); buildSeq: a line-by-line replay of
    # Example 2; periods: a timeline replay of Example 4. Kept: startShift (the toggle), compound (interest on interest),
    # rateRoot (the power machine), hunt (try-every-n table), twoRates (the "too high!" ghost bar).
    drop_expl=['factor', 'buildSeq', 'periods'],
    practice=dict(after='ex3', qs='1–4', rest='5–18', line='Growth factors, building a sequence, and where the sequence starts.',
                  chips=[('1', 'State the growth factor'), ('2', 'Build the sequence'), ('3–4', 'Where does it start?')],
                  note='We carry on when most of the class has finished Question 3.'),
)
