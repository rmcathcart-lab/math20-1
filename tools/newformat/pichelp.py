"""Helpers for small looping warm-up pictures (from the Math 15 tool) (Ryan, 2026-11-11: a fun visual that moves, to pull eyes to the screen
as students come in). Plain SVG with SMIL animation, viewBox 330 x 250, no scripts. A picture must never give the
answer away. They are not paused for reduced motion (Ryan's choice, 2026-11-11)."""
INK, BLUE, RED, GREEN, AMBER, LINE = '#4a4436', '#2b55a0', '#c93a33', '#12805a', '#e0a11b', '#d9d3c4'
def svg(inner, label, vb='0 0 330 250'):
    return f'<svg viewBox="{vb}" role="img" aria-label="{label}">{inner}</svg>'
def bob(dy=8, dur=1.6, begin=0):
    return f'<animateTransform attributeName="transform" type="translate" values="0 0;0 {-dy};0 0" dur="{dur}s" begin="{begin}s" repeatCount="indefinite"/>'
def blink(dur=1.6, begin=0, lo=.25):
    return f'<animate attributeName="opacity" values="1;{lo};1" dur="{dur}s" begin="{begin}s" repeatCount="indefinite"/>'
def emo(ch, x, y, size=70, dy=10, dur=1.6, begin=0):
    return f'<g>{bob(dy, dur, begin)}<text x="{x}" y="{y}" font-size="{size}" text-anchor="middle">{ch}</text></g>'
def qmark(x, y, size=40, col=BLUE):
    return f'<g>{bob(7, 1.4)}<text x="{x}" y="{y}" font-size="{size}" font-weight="800" fill="{col}" text-anchor="middle">?</text></g>'
def die(x, y, s, pips):
    r = s * .16; pr = s * .085
    pos = {'c': (.5, .5), 'tl': (.27, .27), 'tr': (.73, .27), 'bl': (.27, .73), 'br': (.73, .73)}
    return f'<rect x="{x}" y="{y}" width="{s}" height="{s}" rx="{r}" fill="#fffdf6" stroke="{INK}" stroke-width="{max(2.5, s*.03):.1f}"/>' + ''.join(f'<circle cx="{x + s*pos[k][0]:.1f}" cy="{y + s*pos[k][1]:.1f}" r="{pr:.1f}" fill="{RED}"/>' for k in pips)
def bracket(x, y1, y2, col=BLUE, w=3):
    return f'<g stroke="{col}" stroke-width="{w}" stroke-linecap="round"><line x1="{x}" y1="{y1}" x2="{x}" y2="{y2}"/><line x1="{x-8}" y1="{y1}" x2="{x+8}" y2="{y1}"/><line x1="{x-8}" y1="{y2}" x2="{x+8}" y2="{y2}"/></g>'
def grid(cols, rows, cell, ox=20, oy=20):
    W, H = cols * cell, rows * cell
    return f'<g stroke="{LINE}" stroke-width="1.5">' + ''.join(f'<line x1="{ox+c*cell}" y1="{oy}" x2="{ox+c*cell}" y2="{oy+H}"/>' for c in range(cols + 1)) + ''.join(f'<line x1="{ox}" y1="{oy+r*cell}" x2="{ox+W}" y2="{oy+r*cell}"/>' for r in range(rows + 1)) + '</g>'

def strip(*els, label=''):
    return f'<svg viewBox="0 0 340 60" aria-hidden="true">{"".join(els)}</svg>'
def sb(ch, x, begin=0, size=40, dy=7, dur=1.5, y=46):
    return f'<g>{bob(dy, dur, begin)}<text x="{x}" y="{y}" font-size="{size}" text-anchor="middle">{ch}</text></g>'
def sblink(ch, x, begin=0, size=40, dur=1.6, y=46, lo=.15):
    return f'<text x="{x}" y="{y}" font-size="{size}" text-anchor="middle">{ch}{blink(dur, begin, lo)}</text>'
def sspin(ch, x, dur=4, size=40, y=30, rev=False):
    return f'<g><animateTransform attributeName="transform" type="rotate" values="{"360" if rev else "0"} {x} {y};{"0" if rev else "360"} {x} {y}" dur="{dur}s" repeatCount="indefinite"/><text x="{x}" y="{y}" font-size="{size}" text-anchor="middle" dominant-baseline="central">{ch}</text></g>'
def srock(ch, x, deg=12, dur=2.2, size=44, y=46):
    return f'<g><animateTransform attributeName="transform" type="rotate" values="{-deg} {x} {y};{deg} {x} {y};{-deg} {x} {y}" dur="{dur}s" repeatCount="indefinite"/><text x="{x}" y="{y}" font-size="{size}" text-anchor="middle">{ch}</text></g>'
def sdrive(ch, dur=5, begin=0, size=40, y=46, x0=-40, x1=380, flip=True, hop=0):
    inner = f'<text x="0" y="{y}" font-size="{size}" text-anchor="middle"{" transform=" + chr(34) + "scale(-1 1)" + chr(34) if flip else ""}>{ch}</text>'
    if hop: inner = f'<g>{bob(hop, .5)}{inner}</g>'
    return f'<g transform="translate({x0} 0)"><animateTransform attributeName="transform" type="translate" values="{x0} 0;{x1} 0" dur="{dur}s" begin="{begin}s" repeatCount="indefinite"/>{inner}</g>'
def sroad(y=52):
    return f'<line x1="0" y1="{y}" x2="340" y2="{y}" stroke="{LINE}" stroke-width="3" stroke-dasharray="16 12"><animate attributeName="stroke-dashoffset" values="0;-28" dur=".7s" repeatCount="indefinite"/></line>'
def sfloat(ch, x, dur=3, begin=0, size=30):
    return f'<text x="{x}" font-size="{size}" text-anchor="middle">{ch}<animate attributeName="y" values="64;-6" dur="{dur}s" begin="{begin}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.15;.8;1" dur="{dur}s" begin="{begin}s" repeatCount="indefinite"/></text>'
def sbatt(x, col, dur):
    return (f'<rect x="{x}" y="14" width="92" height="36" rx="7" fill="#fffdf6" stroke="{INK}" stroke-width="3.5"/><rect x="{x+92}" y="24" width="7" height="16" rx="2" fill="{INK}"/>'
            f'<rect x="{x+6}" y="20" height="24" rx="3" fill="{col}"><animate attributeName="width" values="80;4;80" keyTimes="0;.9;1" dur="{dur}s" repeatCount="indefinite"/></rect>')
def sclock(x=170):
    hand = lambda L, w, dur: f'<line x1="{x}" y1="30" x2="{x}" y2="{30 - L}" stroke="{INK}" stroke-width="{w}" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" values="0 {x} 30;360 {x} 30" dur="{dur}s" repeatCount="indefinite"/></line>'
    return f'<circle cx="{x}" cy="30" r="27" fill="#fffdf6" stroke="{INK}" stroke-width="3.5"/>' + ''.join(f'<line x1="{x}" y1="6" x2="{x}" y2="10" stroke="{INK}" stroke-width="2.5" transform="rotate({a} {x} 30)"/>' for a in range(0, 360, 30)) + hand(14, 4.5, 48) + hand(22, 3, 4) + f'<circle cx="{x}" cy="30" r="3" fill="{RED}"/>'
def ssquares(n=12):
    return ''.join(f'<rect x="{30 + i*24}" y="20" width="20" height="20" rx="3" fill="{[BLUE, AMBER, GREEN, RED][i % 4]}">{blink(2.4, i * .2, .2)}</rect>' for i in range(n))

