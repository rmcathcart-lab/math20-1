from pichelp import *
T = lambda x: '<span class="tex">%s</span>' % x


def _calendar():
    """A month that starts on a Sunday; rings bob around the example column 4, 11, 18 (not the answer, 12, 19, 26)."""
    cw, ch, x0, y0 = 42, 36, 18, 62
    head = ''.join(f'<text x="{x0 + c*cw + cw/2}" y="{y0 - 12}" font-size="15" font-weight="800" fill="{INK}" text-anchor="middle">{d}</text>' for c, d in enumerate('SMTWTFS'))
    cells = ''
    for d in range(1, 32):
        c, r = (d - 1) % 7, (d - 1) // 7
        cells += (f'<rect x="{x0 + c*cw + 2}" y="{y0 + r*ch + 2}" width="{cw - 4}" height="{ch - 4}" rx="5" fill="#fffdf6" stroke="{LINE}" stroke-width="1.5"/>'
                  f'<text x="{x0 + c*cw + cw/2}" y="{y0 + r*ch + ch/2 + 6}" font-size="17" fill="{INK}" text-anchor="middle">{d}</text>')
    rings = ''.join(f'<g>{bob(4, 1.6, i * .25)}<circle cx="{x0 + 3*cw + cw/2}" cy="{y0 + r*ch + ch/2}" r="16" fill="none" stroke="{RED}" stroke-width="3.5"/></g>' for i, r in enumerate((0, 1, 2)))
    top = f'<rect x="{x0}" y="8" width="{7*cw}" height="26" rx="6" fill="{BLUE}"/>' + ''.join(f'<circle cx="{x0 + 7*cw*f}" cy="21" r="5" fill="#fff"/>' for f in (.25, .75))
    return svg(top + head + cells + rings + qmark(250, 236, 34, RED), 'A calendar page with three dates circled straight down one column', '0 0 330 250')


SPEC = dict(
    warm=dict(
        title='The Calendar Trick',
        ctx=['Your friend secretly circles <b>three dates</b> straight down one column of a calendar, like 4, 11 and 18.',
             'Then they tell you the three dates add up to <b>57</b>.'],
        ask='Which three dates did they circle?',
        pic=_calendar(),
        strip=strip(sb('🗓️', 200, 0, 34), sblink('🔮', 255, 0, 34), sb('🎩', 310, .4, 34)),
        nudge='Could you do it in your head for any sum?',
        reveal=f'<b>12, 19 and 26.</b> Divide by 3 to get the middle date ({T(r"57\div3=19")}), then go one week up and one week down. '
               'It works every time, because the three dates go up by the same 7 each step.'),
    drop_expl=['diffHops', 'bothWays'],
    drop_expl_with_prev=['jumps'],
    drop_str=['  <h3 class="sub">Why <span class="tex">n-1</span> and not <span class="tex">n</span>?</h3>\n'],
    drop_cards=['s3b'],
    practice=dict(after='ex3', qs='1–6', rest='7–18',
                  line='Find d, fill in missing terms, write the general term and decide whether a number is a term.',
                  chips=[('1–3', 'd, missing terms, first four terms'), ('4–5', 'The general term'), ('6', 'The plus-sign tiles')],
                  note='We carry on when most of the class has reached Question 5.'),
)
