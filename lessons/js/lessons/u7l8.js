/* Math 20-1 · Unit 7 · Lesson 8 — Unit 7 Review.
 * New lesson format (2026-11-11): the warm-up ("The Night Bridge") is plain markup on the page (no code).
 * Card figures: every grid on the page is drawn here from the real functions ([data-fig]); the answer layer (class
 * u7l8-ans) shows when its part's Answer is revealed.
 * Explainers:
 *   verdict (keep it or extraneous? Both sides of the equation as graphs; each case is a crossing of the line with a dashed
 *            "ghost" y = A or y = −A; the board verifies each candidate and stamps it; a crossing below the x-axis, where
 *            |A| never goes, is extraneous. Example 3(c), 4(a), 4(b) checks),
 *   recip   (the procedure for y = 1/f(x), step numbers beside the steps: zeros → asymptotes, y = ±1 → invariant points,
 *            the y-intercept or the vertex flies to its reciprocal, the branches, domain and range; Example 5, 6(b)),
 *   match   (STAR, a whole-class round: one graph and four pictures; the class votes, a clue, then the graph itself turns
 *            into the matching picture (the part below the axis flips up, or the reciprocal grows out of the asymptotes)
 *            and the wrong pictures get their mistake written on them. Six rounds: |f| of a line and of a parabola, 1/f of a
 *            line, of a parabola with two zeros and with none, and a backwards round).
 * Colours: f blue, |f| purple, 1/f orange, asymptotes slate (dashed), y = ±1 gray (dotted), zeros / invariant points
 * amber, kept / matching green, extraneous / wrong red. Calculator allowed. */
import {
  h, tex, add, box, Graph, stamp, stampIn, mountExplainers, pop, fadeIn, sleep, anim, pulse, shake, tween, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const F = COLORS.blue, A = COLORS.purple, R = '#d9730d', AM = COLORS.amber, GR = COLORS.green, RD = COLORS.red, SL = COLORS.slate, GY = '#8d93a0';
/** captions and asks may hold $…$ TeX */
const md = (s) => (typeof s === 'string' ? s.replace(/\$([^$]+)\$/g, (_, t) => T(t)) : s);
function mdDef(def) {
  const mk = def.make, a = def.ask;
  def.make = function (stage, v, ex) { return (mk.call(this, stage, v, ex) || []).map((st) => Object.assign(st, { cap: typeof st.cap === 'string' ? md(st.cap) : st.cap })); };
  if (typeof a === 'function') def.ask = (v) => md(a(v)); else if (typeof a === 'string') def.ask = md(a);
  return def;
}
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const show = (c, el) => { el.style.opacity = ''; return fadeIn(c, el, 320); };
const popIn = (c, el) => { el.style.opacity = ''; return pop(c, el); };
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
/** a numbered step row (the step number beside the step) */
const row = (stage, n, html, x, y, w) => hide(div(stage, 'u7l8-row', `<span class="u7l8-num">${n}</span><span class="u7l8-rt">${html}</span>`, x, y, w));
const stampAt = (stage, text, ok, x, y, rot) => hide(stamp(stage, text, { ok, x, y, rotate: rot ?? (ok ? -5 : -8), size: 'sm' }));
const stampShow = async (c, st, ok) => { st.style.opacity = ''; await stampIn(c, st); if (ok === false) await shake(c, st); };
/** a point (and its label) that starts hidden */
const hpt = (G, x, y, o) => { const p = G.point(x, y, o); hide(p); if (p.label) hide(p.label); return p; };
const showPt = async (c, G, p) => { p.style.opacity = ''; if (p.label) p.label.style.opacity = ''; await G.reveal(p, c); };
/** a curve that starts hidden and draws in */
const hcurve = (el) => { el.style.opacity = 0; return el; };
const drawCurve = (c, G, el, ms = 800) => { el.style.opacity = ''; return G.drawIn(el, ms, c); };
const dotted = (G, y) => G.hline(y, { color: GY, width: 2, dash: '3 6' });

/* =============================== card figures =============================== */
const FIGS = {
  e2a: { w: 340, h: 420, win: { xmin: -2.5, xmax: 5.5, ymin: -4.5, ymax: 5.5 },
    given: (G) => G.fn('4-2*x', { color: F, width: 3 }),
    ans: (G) => [G.fn('abs(4-2*x)', { color: A, width: 4.5 }), G.point(2, 0, { color: AM, label: T('(2,\\ 0)'), pos: 'se' })] },
  e2b: { w: 400, h: 400, win: { xmin: -4.5, xmax: 4.5, ymin: -3.5, ymax: 5.5 },
    given: (G) => G.fn('0.5*x^2-2', { color: F, width: 3 }),
    ans: (G) => [G.fn('abs(0.5*x^2-2)', { color: A, width: 4.5 }), G.point(-2, 0, { color: AM }), G.point(2, 0, { color: AM }),
      G.point(0, 2, { color: A, label: T('(0,\\ 2)'), pos: 'ne' })] },
  e5: { w: 380, h: 380, win: { xmin: -1.5, xmax: 5.5, ymin: -3.5, ymax: 3.5 },
    given: (G) => { dotted(G, 1); dotted(G, -1); },
    ans: (G) => [G.fn('2*x-4', { color: F, width: 3, dash: true }), G.vline(2, { color: SL }),
      G.fn('1/(2*x-4)', { color: R, width: 4, breaks: [2], samples: 400 }),
      G.point(2.5, 1, { color: AM }), G.point(1.5, -1, { color: AM }), G.point(0, -0.25, { color: R })] },
  e6a: { w: 370, h: 420, win: { xmin: -0.5, xmax: 6.5, ymin: -3.5, ymax: 4.5 },
    given: (G) => G.fn('-x^2+6*x-5', { color: F, width: 3 }),
    ans: (G) => [G.fn('abs(-x^2+6*x-5)', { color: A, width: 4.5 }), G.point(1, 0, { color: AM }), G.point(5, 0, { color: AM })] },
  e6b: { w: 370, h: 420, win: { xmin: -0.5, xmax: 6.5, ymin: -3.5, ymax: 4.5 },
    given: (G) => { dotted(G, 1); dotted(G, -1); G.fn('-x^2+6*x-5', { color: F, width: 3 }); },
    ans: (G) => [G.vline(1, { color: SL }), G.vline(5, { color: SL }), G.fn('1/(-x^2+6*x-5)', { color: R, width: 4, breaks: [1, 5], samples: 500 }),
      G.point(3, 0.25, { color: R }), ...[3 - Math.sqrt(3), 3 + Math.sqrt(3)].map((x) => G.point(x, 1, { color: AM })),
      ...[3 - Math.sqrt(5), 3 + Math.sqrt(5)].map((x) => G.point(x, -1, { color: AM }))] }
};
function buildFigs() {
  document.querySelectorAll('.u7l8 [data-fig]').forEach((el) => {
    const f = FIGS[el.dataset.fig]; if (!f || el.dataset.built) return; el.dataset.built = '1';
    const G = new Graph(el, Object.assign({ width: f.w, height: f.h, fontSize: 15 }, f.win));
    if (f.given) f.given(G);
    (f.ans(G) || []).forEach((e) => { if (e) { e.classList.add('u7l8-ans'); if (e.label) e.label.classList.add('u7l8-ans'); } });
  });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', buildFigs); else buildFigs();

/* =============================== explainer: keep it or extraneous? =============================== */
const VD = {
  e3c: { label: 'Example 3(c) check', ask: 'Example 3(c): solve $|x+4|=3x-2$.', At: 'x+4', Bt: '3x-2',
    Af: (x) => x + 4, Bf: (x) => 3 * x - 2,
    win: { xmin: -6.5, xmax: 4.5, ymin: -8.5, ymax: 10.5, ylabels: 2 },
    c1: [{ x: 3, xt: '3', chk: '|7|=7,\\ \\ 3(3)-2=7', pos: 'nw' }],
    c2: [{ x: -0.5, xt: '-\\tfrac12', chk: '\\left|\\tfrac72\\right|=\\tfrac72,\\ \\ 3\\left(-\\tfrac12\\right)-2=-\\tfrac72', pos: 'se' }],
    c1cap: 'The ghost $y=x+4$ is the right arm of the V, carried on. It crosses the line at $x=3$.',
    c2cap: 'The ghost $y=-(x+4)$ is the left arm, carried on <b>below the axis</b>. It crosses the line at $x=-\\tfrac12$.',
    vcap: 'At $x=3$ both sides are $7$: <b>keep</b>. At $x=-\\tfrac12$ the right side is $-\\tfrac72$, below the $x$-axis, where $|x+4|$ never goes: <b>extraneous</b>.',
    res: 'x=3', resNote: '(x=-\\tfrac12\\text{ is extraneous})' },
  e4a: { label: 'Example 4(a) check', ask: 'Example 4(a): solve $|x^2-3x-4|=6$.', At: 'x^2-3x-4', Bt: '6',
    Af: (x) => x * x - 3 * x - 4, Bf: () => 6,
    win: { xmin: -3.5, xmax: 6.5, ymin: -7.5, ymax: 9.5, ylabels: 2 },
    c1: [{ x: -2, xt: '-2', chk: '|4+6-4|=6', pos: 'nw' }, { x: 5, xt: '5', chk: '|25-15-4|=6', pos: 'ne' }],
    c2: [{ x: 1, xt: '1', chk: '|1-3-4|=|-6|=6', pos: 'sw' }, { x: 2, xt: '2', chk: '|4-6-4|=|-6|=6', pos: 'se' }],
    c1cap: 'The ghost $y=x^2-3x-4$ (the parabola without the bars) crosses $y=6$ at $x=-2$ and $x=5$.',
    c2cap: 'The ghost $y=-(x^2-3x-4)$, the flipped parabola, crosses $y=6$ at $x=1$ and $x=2$.',
    vcap: 'The right side is $6$, a positive constant: every crossing is <b>above</b> the $x$-axis, on the W. All four check: <b>none is extraneous</b>.',
    res: 'x=-2,\\ 1,\\ 2,\\ 5', resNote: '' },
  e4b: { label: 'Example 4(b) check', ask: 'Example 4(b): solve $|x^2-5|=4x$.', At: 'x^2-5', Bt: '4x',
    Af: (x) => x * x - 5, Bf: (x) => 4 * x,
    win: { xmin: -6.5, xmax: 6.5, ymin: -23, ymax: 23, ystep: 2, ylabels: 4 },
    c1: [{ x: 5, xt: '5', chk: '|20|=20,\\ \\ 4(5)=20', pos: 'w' }, { x: -1, xt: '-1', chk: '|-4|=4,\\ \\ 4(-1)=-4', pos: 'se' }],
    c2: [{ x: 1, xt: '1', chk: '|-4|=4,\\ \\ 4(1)=4', pos: 'nw' }, { x: -5, xt: '-5', chk: '|20|=20,\\ \\ 4(-5)=-20', pos: 'e' }],
    c1cap: 'The ghost $y=x^2-5$ crosses the line $y=4x$ at $x=5$ and $x=-1$.',
    c2cap: 'The ghost $y=-(x^2-5)$ crosses the line at $x=1$ and $x=-5$.',
    vcap: 'Where $x<0$ the right side $4x$ is negative, so those crossings are <b>below</b> the $x$-axis: $x=-1$ and $x=-5$ are <b>extraneous</b>.',
    res: 'x=1\\ \\text{or}\\ x=5', resNote: '(x=-1,\\ -5\\text{ are extraneous})' }
};
const verdict = mdDef({
  title: 'Keep it or extraneous?',
  height: 430, minW: 960, capH: 88,
  choices: Object.keys(VD).map((k) => ({ v: k, label: VD[k].label })),
  ask: (v) => VD[v].ask,
  make(stage, v, ex) {
    const d = VD[v], W = ex.W, GW = 450;
    const G = new Graph(stage, Object.assign({ x: 4, y: 4, width: GW, height: 420, fontSize: 14 }, d.win));
    const absA = hcurve(G.fn((x) => Math.abs(d.Af(x)), { color: A, width: 5 }));
    const rhs = hcurve(G.fn(d.Bf, { color: R, width: 3.5 }));
    const g1 = hcurve(G.fn(d.Af, { color: GY, width: 2.5, dash: '8 7' }));
    const g2 = hcurve(G.fn((x) => -d.Af(x), { color: GY, width: 2.5, dash: '8 7' }));
    const leg = hide(div(stage, 'u7l8-legend', `<span class="u7l8-lp">${T('y=|' + d.At + '|')}</span><span class="u7l8-lo">${T('y=' + d.Bt)}</span><span class="u7l8-lg">ghosts ${T('y=\\pm(' + d.At + ')')}</span>`, 14, 8));
    const cands = [...d.c1.map((k) => ({ ...k, cs: 1 })), ...d.c2.map((k) => ({ ...k, cs: 2 }))];
    cands.forEach((k) => {
      k.y = d.Bf(k.x); k.ok = k.y >= 0;
      k.pt = hpt(G, k.x, k.y, { color: AM, r: 7, label: T('x=' + k.xt), pos: k.pos });
      if (k.pt.label) k.pt.label.classList.add('u7l8-lab');
    });
    const BX = GW + 18, BW = W - BX - 4, n = cands.length, RH = n > 2 ? 70 : 92;
    const board = div(stage, 'u7l8-board', `<div class="u7l8-bh">Candidates · verify in ${T('|' + d.At + '|=' + d.Bt)}</div>`, BX, 4, BW, 330);
    cands.forEach((k, i) => {
      k.row = hide(div(board, 'u7l8-cand', `<div class="u7l8-ch"><span class="u7l8-cs">Case ${k.cs}</span>${T('x=' + k.xt)}</div><div class="u7l8-cv">${T(k.chk)}</div>`, 10, 36 + i * (RH + 4), BW - 24, RH));
      k.cv = hide(k.row.querySelector('.u7l8-cv'));
      k.st = stampAt(board, k.ok ? 'keep' : 'extraneous!', k.ok, BW - (k.ok ? 92 : 150), 36 + i * (RH + 4) + 2, k.ok ? -5 : -8);
    });
    const ans = hide(div(stage, 'u7l8-ansbox', `Solution: ${T('\\boldsymbol{' + d.res + '}')} ${d.resNote ? `<span class="u7l8-cv">${T(d.resNote)}</span>` : ''}`, BX, 346, BW));
    const step = async (c, list) => { for (const k of list) { await show(c, k.row); await showPt(c, G, k.pt); } };
    return [
      { cap: `Graph both sides: the left side $y=|${d.At}|$ in purple, the right side $y=${d.Bt}$ in orange. A solution is an $x$ where they <b>meet</b>.`,
        run: async (c) => { await show(c, leg); await drawCurve(c, G, absA, 900); await drawCurve(c, G, rhs, 700); } },
      { cap: `<b>Case 1:</b> $${d.At}=${d.Bt}$. ${d.c1cap}`,
        run: async (c) => { await drawCurve(c, G, g1, 800); await step(c, cands.filter((k) => k.cs === 1)); } },
      { cap: `<b>Case 2:</b> $${d.At}=-(${d.Bt})$, the same as $-(${d.At})=${d.Bt}$. ${d.c2cap}`,
        run: async (c) => { await drawCurve(c, G, g2, 800); await step(c, cands.filter((k) => k.cs === 2)); } },
      { cap: `<b>Verify</b> each one in the original equation. ${d.vcap}`,
        run: async (c) => {
          for (const k of cands) {
            await show(c, k.cv); k.row.classList.add(k.ok ? 'ok' : 'bad');
            k.pt.querySelector('circle').setAttribute('fill', k.ok ? GR : RD);
            await stampShow(c, k.st, k.ok); await sleep(c, 120);
          }
        } },
      { cap: `The solution${cands.filter((k) => k.ok).length > 1 ? 's are' : ' is'} where the purple graph and the orange graph really meet: $${d.res}$.`,
        run: async (c) => { await show(c, ans); for (const k of cands) if (!k.ok) { k.pt.style.opacity = '.35'; if (k.pt.label) k.pt.label.style.opacity = '.35'; } } }
    ];
  }
});

/* =============================== explainer: building the reciprocal =============================== */
const RC = {
  e5: { label: 'Example 5 check', ask: 'Example 5: sketch $y=\\dfrac{1}{2x-4}$ from $f(x)=2x-4$.', ft: '2x-4',
    f: (x) => 2 * x - 4, win: { xmin: -1.5, xmax: 5.5, ymin: -3.5, ymax: 3.5 }, gw: 420, zeros: [2], zt: 'x=2', flab: [3.35, 2.9, 'w'],
    zcap: '$2x-4=0$ at $x=2$: one vertical asymptote, $x=2$.',
    inv: [[2.5, 1, '\\left(\\tfrac52,\\ 1\\right)', 'nw'], [1.5, -1, '\\left(\\tfrac32,\\ -1\\right)', 'se']],
    icap: '$2x-4=1$ at $x=\\tfrac52$ and $2x-4=-1$ at $x=\\tfrac32$: invariant points $\\left(\\tfrac52,\\ 1\\right)$, $\\left(\\tfrac32,\\ -1\\right)$.',
    key: { from: [0, -4], to: [0, -0.25], t: '\\left(0,\\ -\\tfrac14\\right)', pos: 'nw', row: '<b>Key point</b> <i>y</i>-intercept', cap: 'The $y$-intercept of $f$ is $-4$, so the reciprocal’s $y$-intercept is $\\tfrac{1}{-4}=-\\tfrac14$.' },
    bcap: 'Right of $x=2$, $f$ is positive, so the branch is positive; left of it, both are negative. Near $x=2$, $f$ is tiny and $\\tfrac1f$ is huge; far away, $\\tfrac1f$ hugs $y=0$.',
    dom: '\\{x\\mid x\\ne2,\\ x\\in\\mathbb{R}\\}', rng: '\\{y\\mid y\\ne0,\\ y\\in\\mathbb{R}\\}' },
  e6b: { label: 'Example 6(b) check', ask: 'Example 6(b): sketch $y=\\dfrac{1}{f(x)}$ for $f(x)=-x^2+6x-5$.', ft: '-x^2+6x-5',
    f: (x) => -x * x + 6 * x - 5, win: { xmin: -0.5, xmax: 6.5, ymin: -3.5, ymax: 4.5 }, gw: 400, zeros: [1, 5], zt: 'x=1,\\ x=5', flab: [4.75, 4.0, 'e'],
    zcap: '$-(x-1)(x-5)=0$ at $x=1$ and $x=5$: two vertical asymptotes.',
    inv: [[3 - Math.sqrt(3), 1, '3-\\sqrt3', 'nw'], [3 + Math.sqrt(3), 1, '3+\\sqrt3', 'ne'], [3 - Math.sqrt(5), -1, '3-\\sqrt5', 'sw'], [3 + Math.sqrt(5), -1, '3+\\sqrt5', 'se']],
    icap: '$f(x)=1$: $x=3\\pm\\sqrt3$; $f(x)=-1$: $x=3\\pm\\sqrt5$. Four invariant points.',
    key: { from: [3, 4], to: [3, 0.25], t: '\\left(3,\\ \\tfrac14\\right)', pos: 'n', row: '<b>Key point</b> the vertex', cap: 'The vertex $(3,\\ 4)$ is a <b>maximum</b> of $f$ ($a<0$). It becomes $\\left(3,\\ \\tfrac14\\right)$, a <b>minimum</b> point of the reciprocal.' },
    bcap: 'Between the zeros $f$ is positive: a ∪-shaped branch above the axis with its minimum at $\\left(3,\\ \\tfrac14\\right)$. Outside them $f$ is negative: two branches below the axis.',
    dom: '\\{x\\mid x\\ne1,\\ x\\ne5,\\ x\\in\\mathbb{R}\\}', rng: '\\left\\{y\\mid y<0\\text{ or }y\\ge\\tfrac14,\\ y\\in\\mathbb{R}\\right\\}' }
};
const recip = mdDef({
  title: 'Building y = 1/f(x)',
  height: 430, minW: 960, capH: 88,
  choices: Object.keys(RC).map((k) => ({ v: k, label: RC[k].label })),
  ask: (v) => RC[v].ask,
  make(stage, v, ex) {
    const d = RC[v], W = ex.W, GW = d.gw;
    const G = new Graph(stage, Object.assign({ x: 4, y: 4, width: GW, height: 422, fontSize: 14 }, d.win));
    G.fn(d.f, { color: F, width: 3 });
    G.label(d.flab[0], d.flab[1], T('y=' + d.ft), { pos: d.flab[2], cls: 'u7l8-lab', color: F });
    const asy = d.zeros.map((z) => hcurve(G.vline(z, { color: SL, width: 2.5 })));
    const zp = d.zeros.map((z) => hpt(G, z, 0, { color: AM }));
    const hz = hcurve(G.hline(0, { color: SL, width: 2.5 }));
    const pm = [hcurve(dotted(G, 1)), hcurve(dotted(G, -1))];
    const inv = d.inv.map(([x, y, t, pos]) => { const p = hpt(G, x, y, { color: AM, label: T(t), pos }); if (p.label) p.label.classList.add('u7l8-lab'); return p; });
    const kp = hpt(G, d.key.from[0], d.key.from[1], { color: R, r: 8 });
    const kl = hide(G.label(d.key.to[0], d.key.to[1], T(d.key.t), { pos: d.key.pos, cls: 'u7l8-lab', color: R, dy: d.key.pos === 'n' ? -6 : 0 }));
    const rec = hcurve(G.fn((x) => 1 / d.f(x), { color: R, width: 4.5, breaks: d.zeros, samples: 600 }));
    const RX = GW + 22, RW = W - RX - 4, ys = [8, 74, 140, 206, 272];
    const r = [
      row(stage, 1, `<b>Zeros</b> of ${T('f')} → asymptotes ${T(d.zt)}, ${T('y=0')}`, RX, ys[0], RW),
      row(stage, 2, `<b>${T('f=\\pm1')}</b> → invariant points`, RX, ys[1], RW),
      row(stage, 3, `${d.key.row} → ${T(d.key.t)}`, RX, ys[2], RW),
      row(stage, 4, '<b>Branches</b> same sign as <i>f</i>, toward the asymptotes', RX, ys[3], RW),
      row(stage, 5, '<b>Domain, range</b>', RX, ys[4], RW)
    ];
    const ans = hide(div(stage, 'u7l8-ansbox', `Domain ${T(d.dom)}<br>Range ${T(d.rng)}`, RX, 330, RW));
    return [
      { cap: `<b>Step 1.</b> ${d.zcap} The horizontal asymptote is always $y=0$.`,
        run: async (c) => { await show(c, r[0]); for (const p of zp) await showPt(c, G, p); for (const a of asy) await drawCurve(c, G, a, 500); await drawCurve(c, G, hz, 500); } },
      { cap: `<b>Step 2.</b> ${d.icap} $\\tfrac11=1$ and $\\tfrac{1}{-1}=-1$, so those points stay put.`,
        run: async (c) => { await show(c, r[1]); await Promise.all(pm.map((l) => drawCurve(c, G, l, 500))); for (const p of inv) await showPt(c, G, p); } },
      { cap: `<b>Step 3.</b> ${d.key.cap}`,
        run: async (c) => { await show(c, r[2]); await showPt(c, G, kp); await sleep(c, 200); await G.move(c, kp, d.key.to[0], d.key.to[1], 900); await show(c, kl); } },
      { cap: `<b>Step 4.</b> ${d.bcap}`,
        run: async (c) => { await show(c, r[3]); await drawCurve(c, G, rec, 1400); } },
      { cap: '<b>Step 5.</b> Domain: every $x$ except the zeros of $f$. Range: the reciprocals of the values of $f$ ($y=0$ is never one).',
        run: async (c) => { await show(c, r[4]); await show(c, ans); } }
    ];
  }
});

/* =============================== explainer (STAR): match the graph, a whole-class round =============================== */
const recipOf = (f) => (x) => 1 / f(x);
const MT = {
  r1: { label: 'Round 1', kind: 'abs', ft: 'f(x)=-x+2', f: (x) => -x + 2, zeros: [2], win: { xmin: -4.5, xmax: 6.5, ymin: -4.5, ymax: 6.5 },
    q: 'Which picture is $y=|f(x)|$?', right: 2,
    cands: [{ f: (x) => x - 2, why: 'the whole line was reflected' }, { f: (x) => -Math.abs(x - 2), why: 'the part above was flipped down' },
      { f: (x) => Math.abs(2 - x), why: 'a V at the zero (2, 0)' }, { f: (x) => Math.abs(x) + 2, why: 'its vertex is at the y-intercept, not the zero' }],
    clue: 'The line is below the $x$-axis right of its zero, $x=2$. Only that part flips; $(2,\\ 0)$ stays put.',
    win2: '<b>C</b>: keep the part above the axis, flip the part below. A V with its vertex at the zero $(2,\\ 0)$.' },
  r2: { label: 'Round 2', kind: 'abs', ft: 'f(x)=x^2-2x-3', f: (x) => x * x - 2 * x - 3, zeros: [-1, 3], clueP: [[1, -4]], win: { xmin: -4.5, xmax: 6.5, ymin: -5.5, ymax: 6.5 },
    q: 'Which picture is $y=|f(x)|$?', right: 3,
    cands: [{ f: (x) => -(x * x - 2 * x - 3), why: 'the whole parabola was reflected' }, { f: (x) => (x - 1) * (x - 1), why: 'shifted up 4: the zeros moved' },
      { f: (x) => -Math.abs(x * x - 2 * x - 3), why: 'the wrong parts were flipped' }, { f: (x) => Math.abs(x * x - 2 * x - 3), why: 'only the arc below the axis flips' }],
    clue: 'Only the arc between the zeros $x=-1$ and $x=3$ is below the axis. The vertex $(1,\\ -4)$ will become $(1,\\ 4)$.',
    win2: '<b>D</b>: the arc between the zeros flips up into a W with a local maximum $(1,\\ 4)$. The outside parts are unchanged.' },
  r3: { label: 'Round 3', kind: 'rec', ft: 'f(x)=x-1', f: (x) => x - 1, zeros: [1], win: { xmin: -4.5, xmax: 6.5, ymin: -5.5, ymax: 5.5 },
    q: 'Which picture is $y=\\dfrac{1}{f(x)}$?', right: 0,
    cands: [{ f: (x) => 1 / (x - 1), asy: [1], why: 'asymptote x = 1, same signs as f' }, { f: (x) => 1 / (x + 1), asy: [-1], why: 'the asymptote is at x = −1, not the zero of f' },
      { f: (x) => -1 / (x - 1), asy: [1], why: 'the signs are flipped' }, { f: (x) => Math.abs(1 / (x - 1)), asy: [1], why: 'positive on the left, but f is negative there' }],
    clue: 'The zero $x=1$ gives the asymptote. Left of it $f$ is <b>negative</b>, right of it <b>positive</b>: the reciprocal has the same signs.',
    win2: '<b>A</b>: an asymptote at $x=1$, a negative branch on the left and a positive one on the right, through $(2,\\ 1)$ and $(0,\\ -1)$.' },
  r4: { label: 'Round 4', kind: 'rec', ft: 'f(x)=x^2-4', f: (x) => x * x - 4, zeros: [-2, 2], clueP: [[0, -4]], win: { xmin: -5.5, xmax: 5.5, ymin: -5.5, ymax: 5.5 },
    q: 'Which picture is $y=\\dfrac{1}{f(x)}$?', right: 2,
    cands: [{ f: (x) => 1 / (x * x - 1), asy: [-1, 1], why: 'asymptotes at x = ±1, not at the zeros ±2' }, { f: (x) => -1 / (x * x - 4), asy: [-2, 2], why: 'the signs are flipped' },
      { f: (x) => 1 / (x * x - 4), asy: [-2, 2], why: 'asymptotes x = ±2, max (0, −¼)' }, { f: (x) => 1 / (x * x + 4), why: 'no asymptotes, but f has two zeros' }],
    clue: 'Zeros $\\pm2$: two asymptotes. Between them $f$ is negative, with its minimum $(0,\\ -4)$, so the reciprocal has a <b>maximum</b> $\\left(0,\\ -\\tfrac14\\right)$.',
    win2: '<b>C</b>: asymptotes $x=\\pm2$, positive outside, and a middle branch below the axis with a maximum point $\\left(0,\\ -\\tfrac14\\right)$.' },
  r5: { label: 'Round 5', kind: 'rec', ft: 'f(x)=(x-1)^2+1', f: (x) => (x - 1) * (x - 1) + 1, zeros: [], clueP: [[1, 1]], win: { xmin: -3.5, xmax: 5.5, ymin: -3.5, ymax: 5.5 },
    q: 'Which picture is $y=\\dfrac{1}{f(x)}$?', right: 1,
    cands: [{ f: (x) => (x - 1) * (x - 1) + 1, why: 'that is f itself: only the vertex is invariant' }, { f: (x) => 1 / ((x - 1) * (x - 1) + 1), why: 'no asymptotes, max at (1, 1)' },
      { f: (x) => 1 / ((x - 1) * (x - 1)), asy: [1], why: 'an asymptote, but f has no zeros' }, { f: (x) => -1 / ((x - 1) * (x - 1) + 1), why: 'negative, but f is always positive' }],
    clue: '$f(x)\\ge1$ is never $0$: <b>no vertical asymptotes</b>. Its vertex $(1,\\ 1)$ is on the line $y=1$, so it is an invariant point.',
    win2: '<b>B</b>: always positive, no vertical asymptotes, and the minimum $(1,\\ 1)$ of $f$ becomes a <b>maximum</b> $(1,\\ 1)$. Range $0<y\\le1$.' },
  r6: { label: 'Round 6: backwards', kind: 'back', ft: 'y=\\dfrac{1}{f(x)}', f: (x) => x - 3, zeros: [3], win: { xmin: -4.5, xmax: 6.5, ymin: -5.5, ymax: 5.5 },
    q: 'Backwards! This is the graph of $y=\\dfrac{1}{f(x)}$. Which picture is $y=f(x)$?', right: 3,
    cands: [{ f: (x) => 3 - x, why: 'the signs are flipped' }, { f: (x) => (x - 3) * (x - 3), why: 'its reciprocal would be positive on both sides' },
      { f: (x) => x + 3, why: 'its zero is −3: the asymptote would be x = −3' }, { f: (x) => x - 3, why: 'zero at 3, negative left, positive right' }],
    clue: 'The asymptote $x=3$ means $f$ has a <b>zero</b> at $x=3$. The left branch is negative and the right branch positive, so $f$ is too.',
    win2: '<b>D</b>: $f(x)=x-3$. Its zero is the asymptote, and it passes through the invariant points $(4,\\ 1)$ and $(2,\\ -1)$.' }
};
const LET = ['A', 'B', 'C', 'D'];
const match = mdDef({
  title: 'Match the graph',
  height: 434, minW: 980, capH: 88,
  choices: Object.keys(MT).map((k) => ({ v: k, label: MT[k].label })),
  ask: (v) => MT[v].q,
  make(stage, v, ex) {
    const d = MT[v], W = ex.W, MW = 420;
    const G = new Graph(stage, Object.assign({ x: 4, y: 6, width: MW, height: 420, fontSize: 14 }, d.win));
    const back = d.kind === 'back';
    const mainF = back ? recipOf(d.f) : d.f;
    const main = hcurve(G.fn(mainF, { color: back ? R : F, width: 3.5, breaks: back ? d.zeros : [], samples: 500 }));
    const mainAsy = back ? d.zeros.map((z) => hcurve(G.vline(z, { color: SL, width: 2.5 }))) : [];
    const lab = hide(div(stage, 'u7l8-mainlab', T(d.ft), 16, 12));
    lab.style.color = back ? R : F;
    // the clue layer
    const below = d.kind === 'abs' ? hcurve(G.fn((x) => (d.f(x) < 0 ? d.f(x) : NaN), { color: RD, width: 7, samples: 400 })) : null;
    const zp = [...d.zeros.map((z) => hpt(G, z, 0, { color: AM })), ...(d.clueP || []).map(([x, y]) => hpt(G, x, y, { color: AM }))];
    const cAsy = d.kind === 'rec' ? d.zeros.map((z) => hcurve(G.vline(z, { color: SL, width: 2.5 }))) : [];
    const one = d.kind !== 'abs' ? hcurve(dotted(G, 1)) : null, mone = d.kind !== 'abs' ? hcurve(dotted(G, -1)) : null;
    // the reveal layer: the graph turns into the answer
    const st = { t: 0 };
    const morph = d.kind === 'abs' ? hcurve(G.fn((x) => { const y = d.f(x); return y >= 0 ? y : y * (1 - 2 * st.t); }, { color: A, width: 5, samples: 400 })) : null;
    const rec = d.kind === 'rec' ? hcurve(G.fn(recipOf(d.f), { color: R, width: 4.5, breaks: d.zeros, samples: 600 })) : null;
    const fwd = back ? hcurve(G.fn(d.f, { color: F, width: 4 })) : null;
    const fwdP = back ? [hpt(G, 4, 1, { color: AM }), hpt(G, 2, -1, { color: AM })] : [];
    // the four pictures
    const CX = MW + 18, CW = Math.floor((W - CX - 10) / 2), CH = 211;
    const cards = d.cands.map((k, i) => {
      const card = hide(div(stage, 'u7l8-mcard', `<div class="u7l8-letter">${LET[i]}</div>`, CX + (i % 2) * (CW + 10), 4 + Math.floor(i / 2) * (CH + 8), CW, CH));
      const g = new Graph(card, Object.assign({ width: CW - 16, height: CH - 40, fontSize: 11, numbers: false, xtitle: '', ytitle: '', fnArrows: false }, d.win));
      (k.asy || []).forEach((z) => g.vline(z, { color: SL, width: 1.8, dash: '6 5' }));
      g.fn(k.f, { color: back ? F : d.kind === 'abs' ? A : R, width: 3.5, breaks: k.asy || [], samples: 400 });
      const tag = hide(div(card, 'u7l8-tag' + (i === d.right ? ' ok' : ''), (i === d.right ? '✓ ' : '✗ ') + k.why));
      return { card, tag };
    });
    const win = cards[d.right];
    const stp = stampAt(stage, 'Match!', true, CX + (d.right % 2) * (CW + 10) + CW - 110, 4 + Math.floor(d.right / 2) * (CH + 8) + CH - 60, -6);
    const what = d.kind === 'abs' ? '$y=|f(x)|$' : d.kind === 'rec' ? '$y=\\dfrac{1}{f(x)}$' : '$y=f(x)$';
    return [
      { cap: `${back ? 'The orange graph is the reciprocal.' : 'The blue graph is $' + d.ft + '$.'} Which of A, B, C, D is ${what}? <b>Vote now</b>: 1, 2, 3 or 4 fingers.`,
        run: async (c) => {
          await show(c, lab); await drawCurve(c, G, main, 800); for (const a of mainAsy) await drawCurve(c, G, a, 400);
          for (const k of cards) { await show(c, k.card); await sleep(c, 120); }
        } },
      { cap: `<b>Clue.</b> ${d.clue} <b>Vote again.</b>`,
        run: async (c) => {
          if (below) await drawCurve(c, G, below, 700);
          for (const p of zp) await showPt(c, G, p);
          for (const a of cAsy) await drawCurve(c, G, a, 450);
          if (one) await Promise.all([drawCurve(c, G, one, 450), drawCurve(c, G, mone, 450)]);
        } },
      { cap: `<b>Watch the graph.</b> ${d.win2}`,
        run: async (c) => {
          if (morph) {
            morph.style.opacity = ''; if (below) below.style.opacity = '.35';
            await tween(c, 1300, (t) => { st.t = t; morph._bkDraw(); });
            main.style.opacity = '.4';
          }
          if (rec) await drawCurve(c, G, rec, 1400);
          if (fwd) { await drawCurve(c, G, fwd, 900); for (const p of fwdP) await showPt(c, G, p); }
          win.card.classList.add('win'); await pulse(c, win.card, 1.04); await stampShow(c, stp, true);
        } },
      { cap: '<b>Why not the others?</b> Each wrong picture has its mistake written on it. Which mistake would you make on the test?',
        run: async (c) => {
          await show(c, win.tag);
          for (const k of cards) if (k !== win) { k.card.classList.add('off'); await show(c, k.tag); await sleep(c, 120); }
        } }
    ];
  }
});

/* =============================== Stand Up Break ===============================
 * BEG piecewise form of y = |mx + b| (an integer zero), PRG solve k|x + p| + q = s (two solutions or none),
 * MAS the reciprocal of a quadratic with two zeros: asymptotes, the turning point and its type, the range. */
const linT = (m, b) => { const mm = m === 1 ? '' : m === -1 ? '-' : String(m); return b === 0 ? `${mm}x` : `${mm}x${b > 0 ? '+' : '-'}${Math.abs(b)}`; };
const xp = (p) => (p === 0 ? 'x' : `x${p > 0 ? '+' : '-'}${Math.abs(p)}`);
standup('u7l8', {
  intro: 'At your whiteboard: isolate before you split, verify every answer, and build a reciprocal from the zeros, ±1 and the vertex.',
  levels: {
    BEG: (r) => {
      for (let t = 0; t < 200; t++) {
        const m = r.pick([1, 2, 3, 4, -1, -2, -3, -4]), z = r.int(-6, 6);
        if (!z) continue;
        const b = -m * z, Ap = linT(m, b), An = linT(-m, -b);
        return { text: 'Write in piecewise form.', q: `y=|${Ap}|`,
          a: [`${Ap}\\ge0\\Rightarrow x${m > 0 ? '\\ge' : '\\le'}${z}`,
            m > 0 ? `y=\\begin{cases}${Ap}, & \\text{if } x\\ge${z}\\\\ ${An}, & \\text{if } x<${z}\\end{cases}` : `y=\\begin{cases}${Ap}, & \\text{if } x\\le${z}\\\\ ${An}, & \\text{if } x>${z}\\end{cases}`] };
      }
      return { text: 'Write in piecewise form.', q: 'y=|2x-8|', a: ['2x-8\\ge0\\Rightarrow x\\ge4', 'y=\\begin{cases}2x-8, & \\text{if } x\\ge4\\\\ -2x+8, & \\text{if } x<4\\end{cases}'] };
    },
    PRG: (r) => {
      for (let t = 0; t < 200; t++) {
        const k = r.int(2, 4), p = r.int(-6, 6), q = r.int(-9, 9), cc = r.chance(0.2) ? -r.int(1, 5) : r.int(1, 8);
        if (!p || !q) continue;
        const s = k * cc + q, lhs = `${k}|${xp(p)}|${q > 0 ? '+' : '-'}${Math.abs(q)}`;
        const a = [`${k}|${xp(p)}|=${k * cc}`, `|${xp(p)}|=${cc}`];
        if (cc < 0) a.push('\\text{An absolute value is never negative: no solution.}');
        else a.push(`${xp(p)}=${cc}\\ \\text{or}\\ ${xp(p)}=${-cc}`, `x=${cc - p}\\ \\text{or}\\ x=${-cc - p}`);
        return { text: 'Solve algebraically and verify.', q: `${lhs}=${s}`, a };
      }
      return { text: 'Solve algebraically and verify.', q: '2|x-3|+1=9', a: ['2|x-3|=8', '|x-3|=4', 'x-3=4\\ \\text{or}\\ x-3=-4', 'x=7\\ \\text{or}\\ x=-1'] };
    },
    MAS: (r) => {
      const half = r.pick([1, 2]), p = r.int(-4, 4), r1 = p - half, r2 = p + half, qv = -half * half;
      const B = -(r1 + r2), C = r1 * r2;
      const f = `x^2${B ? (B > 0 ? '+' : '-') + (Math.abs(B) === 1 ? '' : Math.abs(B)) + 'x' : ''}${C ? (C > 0 ? '+' : '-') + Math.abs(C) : ''}`;
      const inv = qv === -1 ? '-1' : '-\\tfrac14', fac = `(${xp(-r1)})(${xp(-r2)})`;
      return { text: `For ${tex('y=\\dfrac{1}{f(x)}')}, state the asymptotes, the turning point and its type, and the range.`, q: `f(x)=${f}`,
        a: [`f(x)=${fac}=(${xp(-p)})^2${qv}`, `\\text{Asymptotes } x=${r1},\\ x=${r2},\\ y=0`,
          `\\text{Vertex }(${p},\\ ${qv}),\\ a>0:\\ \\text{maximum point }\\left(${p},\\ ${inv}\\right)${qv === -1 ? '\\ (\\text{invariant})' : ''}`,
          `\\text{Range } \\left\\{y\\mid y\\le${inv}\\ \\text{or}\\ y>0,\\ y\\in\\mathbb{R}\\right\\}`] };
    }
  }
});

/* =============================== mount =============================== */
export const explainers = mountExplainers({ verdict, recip, match });
export const _test = { VD, RC, MT, FIGS };
