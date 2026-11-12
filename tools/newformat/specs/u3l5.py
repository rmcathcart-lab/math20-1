from pichelp import *
T = lambda x: '<span class="tex">%s</span>' % x


def boards():
    """Three boards, 13 m, 7 m and 5 m (20 px per metre), each on its own row so they are never lined up end to end."""
    out = ''
    for i, (m, x, y) in enumerate(((13, 35, 34), (7, 50, 108), (5, 175, 182))):
        w = m * 20
        grain = ''.join(f'<line x1="{x + 14 + k * 37}" y1="{y + 6 + (k % 2) * 22}" x2="{x + 34 + k * 37}" y2="{y + 6 + (k % 2) * 22}" stroke="#b07a3c" stroke-width="2" stroke-linecap="round"/>'
                        for k in range(max(1, (w - 30) // 37)))
        out += (f'<g>{bob(5, 2 + i * .35, i * .4)}<rect x="{x}" y="{y}" width="{w}" height="34" rx="5" fill="#d8a465" stroke="#9c6a2f" stroke-width="3.5"/>'
                f'{grain}<text x="{x + w / 2}" y="{y + 25}" font-size="22" font-weight="800" fill="#4a2f12" text-anchor="middle">{m} m</text></g>')
    return svg(out, 'Three boards: 13 m, 7 m and 5 m long')


SPEC = dict(
    warm=dict(
        title='The Garden Bed Mystery',
        ctx=['Sam says he built a triangle-shaped garden bed from three boards, <b>13 m</b>, <b>7 m</b> and <b>5 m</b> long, without cutting any of them.'],
        ask='Is Sam telling the truth?',
        pic=boards(),
        strip=strip(sb('🕵️', 70), sblink('🔍', 150), sb('🪵', 230, .4), sb('🌱', 305, .8)),
        nudge='How could you check?',
        reveal=('<b>No.</b> Lay the 13 m board down. The 5 m and 7 m boards together reach only 12 m, so their ends can never meet: '
                'there is no triangle. In every triangle, any two sides add to more than the third.')),
    drop_expl=['label', 'soh', 'proof', 'supp', 'findSide', 'river'],
    replace=[('<h3>Right-triangle warm-up</h3>', '<h3>Right-triangle review</h3>')],
    practice=dict(after='ex6', qs='1–6', rest='7–15', line='The right-triangle review, then the sine law for sides and for angles.',
                  chips=[('1', 'Right-triangle review'), ('2', 'Writing the sine law'), ('3, 5', 'Finding sides'), ('4, 6', 'Finding angles')],
                  note='We carry on when most of the class has reached Question 4.'),
)
