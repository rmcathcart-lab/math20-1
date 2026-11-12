from pichelp import *
T = lambda x: '<span class="tex">%s</span>' % x


def clock():
    """A clock face whose hands race round (the minute hand 12 times as fast as the hour hand), starting at 3:00."""
    cx, cy, R = 165, 125, 108
    ticks = ''.join(f'<line x1="{cx}" y1="{cy - R + 9}" x2="{cx}" y2="{cy - R + (25 if a % 90 == 0 else 18)}" stroke="{INK}" '
                    f'stroke-width="{5 if a % 90 == 0 else 3}" stroke-linecap="round" transform="rotate({a} {cx} {cy})"/>' for a in range(0, 360, 30))
    nums = ''.join(f'<text x="{x}" y="{y}" font-size="24" font-weight="800" fill="{INK}" text-anchor="middle" dominant-baseline="central">{n}</text>'
                   for n, x, y in ((12, cx, cy - R + 42), (3, cx + R - 40, cy), (6, cx, cy + R - 40), (9, cx - R + 40, cy)))
    hand = lambda L, w, col, a0, dur: (f'<line x1="{cx}" y1="{cy + 10}" x2="{cx}" y2="{cy - L}" stroke="{col}" stroke-width="{w}" stroke-linecap="round">'
                                      f'<animateTransform attributeName="transform" type="rotate" values="{a0} {cx} {cy};{a0 + 360} {cx} {cy}" dur="{dur}s" repeatCount="indefinite"/></line>')
    return svg(f'<circle cx="{cx}" cy="{cy}" r="{R}" fill="#fffdf6" stroke="{INK}" stroke-width="6"/>' + ticks + nums
               + hand(58, 10, INK, 90, 48) + hand(88, 6, BLUE, 0, 4) + f'<circle cx="{cx}" cy="{cy}" r="7" fill="{RED}"/>',
               'A clock with its hands racing round')


SPEC = dict(
    warm=dict(
        title='Clock Hands',
        ctx=['At 3:00, the minute hand and the hour hand of a clock make a <b>right angle</b>.'],
        ask='How many times in one whole day (24 hours) do the hands make a right angle?',
        pic=clock(),
        strip=strip(srock('⏰', 70), sb('🕒', 160, .2), sb('🕘', 230, .5), sb('🕛', 300, .8)),
        nudge='How did you count?',
        reveal=('<b>44 times</b>, not 48. In 12 hours the minute hand laps the hour hand only <b>11</b> times (not 12), '
                'and every lap has 2 right angles: <span class="tex">11\\times2=22</span> right angles every 12 hours, so 44 in a day.')),
    drop_expl=['quadrants', 'points', 'backwards', 'reflect'],
    practice=dict(after='ex5', qs='1–6', rest='7–18', line='Sketch the angle, name where it lands, and find reference angles both ways.',
                  chips=[('1–2', 'Sketch it, name the quadrant'), ('3–4', 'Reference angles'), ('5', 'Clockwise and past 360°'), ('6', 'Work backwards')],
                  note='We carry on when most of the class has reached Question 5.'),
)
