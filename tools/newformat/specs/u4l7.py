from pichelp import *
T = lambda x: '<span class="tex">%s</span>' % x


def board():
    s, ox, oy = 26, 61, 17
    cells = ''.join(f'<rect x="{ox + c * s}" y="{oy + r * s}" width="{s}" height="{s}" fill="{"#e9d9c2" if (r + c) % 2 == 0 else "#8a6440"}"/>'
                    for r in range(8) for c in range(8))
    frame = f'<rect x="{ox - 6}" y="{oy - 6}" width="{8 * s + 12}" height="{8 * s + 12}" rx="6" fill="none" stroke="{INK}" stroke-width="5"/>'
    # a knight that hops around the board (an L each time), and a blinking ?
    knight = (f'<g><animateTransform attributeName="transform" type="translate" values="0 0;52 -26;78 26;26 52;0 0" keyTimes="0;.25;.5;.75;1" dur="5s" calcMode="discrete" repeatCount="indefinite"/>'
              f'<g>{bob(10, .62)}<text x="{ox + 2.5 * s}" y="{oy + 5.5 * s}" font-size="40" text-anchor="middle" dominant-baseline="central">♞</text></g></g>')
    return frame + cells + knight + f'<g>{bob(7, 1.4)}<text x="300" y="60" font-size="44" font-weight="800" fill="{BLUE}" text-anchor="middle">?</text></g>'


SPEC = dict(
    warm=dict(
        title='Squares on a Chessboard',
        ctx='A chessboard is an 8 by 8 grid of little squares.',
        ask='How many squares can you find on a chessboard?',
        pic=svg(board(), 'A chessboard with a knight hopping on it'),
        strip=strip(sdrive('♞', 6, size=38, hop=5), sdrive('♟', 6, 3, size=34, hop=4)),
        nudge='How did you count them?',
        reveal=f'<b>204</b>, not 64! Count the squares of <b>every</b> size: 64 small ones ({T("1\\times1")}), 49 of size {T("2\\times2")}, 36 of size {T("3\\times3")}, … down to 1 big one ({T("8\\times8")}).<br>'
               f'{T("64+49+36+25+16+9+4+1=204")}, the sum of the first eight perfect squares.'),
    drop_expl=['binSq', 'restrict2', 'twoWays'],
    practice=dict(after='ex5', qs='1–7', rest='8–17', line='Square a whole side, factor, then check every root in the original.',
                  chips=[('1–2', 'Squaring a binomial, restrictions'), ('3–6', 'Isolate, square, factor, check'), ('7', 'Read the graph')],
                  note='We carry on when most of the class has reached Question 6.'),
)
