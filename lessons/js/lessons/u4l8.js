/* Math 20-1 · Unit 4 · Lesson 8 — Unit 4 Review (no calculator).
 * Warm-up (The Mystery Box: a box drawn to scale whose label says V = x³ + 6x² + 8x; try x = 1, 2, …, read the edges;
 * the big one: the edges are x, x + 2, x + 4 — GCF first, then product 8 and sum 6), and the explainers:
 *   machine (STAR: the factoring checklist as a sorting machine. An expression drops from the hopper onto a belt, the
 *     GCF gate pulls out a common factor, the terms gate counts the terms, a chute routes it to one of seven stations
 *     (difference of squares, x² + bx + c, decomposition, perfect square, substitution, grouping, does not factor),
 *     the factors land in the tray, any factor that still factors goes round again, then the factored form is expanded
 *     back and stamped. The summary table's examples, Example 1 checks and three review questions),
 *   solveRecap (one side = 0, divide out a number GCF, factor, zero product "either–or" switches, and the roots as the
 *     graph's x-intercepts; x² = 5x and the lost root; Example 4 checks and a review question),
 *   radRecap (the six-step rail beside the working, with a verify card and stamp for every candidate: √x = −3,
 *     √(x + 2) = x, Example 7 checks, a review question),
 *   errors (the five common errors: the wrong work, a test that catches it, the fix and the rule),
 *   subDos (box the repeated chunk, wrap it as A (and B), factor, unwrap in brackets, simplify, factor again;
 *     Example 2 checks),
 *   kHunt (Example 3: the factor cards with the candidate binomial sliding over them; the factor pairs of −12 giving
 *     every k on a number line; the (3x ± 7)² area square giving k = ±42),
 *   rootsGraph (zeros of y = 2x² − x − 6 as x-intercepts, a double root that touches, and roots → factors → equation
 *     with its graph through the roots; Example 5 and 4(d) checks),
 *   frame (Example 6 to scale: the frame grows around the photo with a live area readout, the equation, −29
 *     inadmissible, 28 × 38 = 1 064 ✓),
 *   radGraph (each side of a radical equation as a graph: they meet at the root; the mirror graph meets at the
 *     extraneous root; Example 7(b) and 8 and two more),
 *   twoRad (two radicals: restrictions on a number line, isolate, square a binomial, isolate again (a new
 *     restriction), square again, solve, verify; Example 8(c) and a review question).
 * Colours: GCF rose (#a33357), chunk A / squaring amber, B blue, roots / zero product blue, radicals purple,
 *   checks and admissible green, extraneous / inadmissible / errors red. No calculator in Unit 4. */
import {
  h, tex, add, box, Graph, NumberLine, ValueTable, stamp, stampIn, checkCard, mountExplainers, pop, fadeIn, sleep,
  tween, svgEl, pulse, shake, anim, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const GCF = '#a33357', AMB = COLORS.amber, BLU = COLORS.blue, GRN = COLORS.green, PUR = COLORS.purple, RED = COLORS.red;
const INK = COLORS.ink, GRAY = COLORS.gray, BRAND = '#7a1f3d', TEAL = '#0e7c86';
const K = (c, s) => `\\textcolor{${c}}{${s}}`;
const cA = (s = 'A') => K(AMB, s), cB = (s = 'B') => K(BLU, s);
const bA = (s) => `\\fcolorbox{${AMB}}{#fff4dd}{$${s}$}`, bB = (s) => `\\fcolorbox{${BLU}}{#e6eefc}{$${s}$}`;
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
const panel = (stage, x, y, w, hh, title, cls = '') => div(stage, 'u4l8-panel ' + cls, title ? `<div class="u4l8-ph">${title}</div>` : '', x, y, w, hh);
const lineIn = (p, html, cls = '') => { const d = h('div', 'u4l8-line ' + cls, html); p.appendChild(d); hide(d); return d; };
/* a maths line; a leading '#' makes it a small working note (a product–sum hunt, a substitution) */
const mline = (p, t, cls = '') => (t.startsWith('#') ? lineIn(p, T(t.slice(1)), 'u4l8-note ' + cls) : lineIn(p, T(t), cls));
const stampAt = (host, text, ok, x, y, o = {}) => hide(stamp(host, text, Object.assign({ ok, x, y }, o)));
const drawOn = (c, G, el, ms = 800) => { el.style.opacity = ''; return G.drawIn(el, ms, c); };
const hideP = (p) => { hide(p); if (p.label) hide(p.label); return p; };
const popP = (c, p) => Promise.all([pop(c, p), p.label ? show(c, p.label) : null]);
const moveTo = (c, el, x, y, ms = 500, to = {}) => anim(c, el, [{ left: el.style.left, top: el.style.top, opacity: el.style.opacity || 1, transform: el.style.transform || 'none' },
  Object.assign({ left: x + 'px', top: y + 'px', opacity: el.style.opacity || 1, transform: el.style.transform || 'none' }, to)], ms);
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
/* TeX for a polynomial: poly([2, -3, 1], ['x^2', 'x', '']) → 2x^2-3x+1 */
const poly = (cs, vs) => { let out = ''; cs.forEach((k, i) => { if (!k) return; const m = Math.abs(k), v = vs[i]; out += (k < 0 ? '-' : out ? '+' : '') + (v ? (m === 1 ? '' : m) + v : m); }); return out || '0'; };
const lin = (a, b, v = 'x') => poly([a, b], [v, '']);
const frac = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d) || 1; n /= g; d /= g; return d === 1 ? String(n) : `${n < 0 ? '-' : ''}\\frac{${Math.abs(n)}}{${d}}`; };

/* ====================================================================================================
 * Warm-up: The Mystery Box. Edges x + 4 (along the right-down axis), x + 2 (left-down) and x (up), 22 px per cm.
 * ==================================================================================================== */
function mountBox() {
  const host = document.getElementById('u4l8-box'); if (!host) return;
  const W = 560, H = 360, S = 21, C = Math.cos(Math.PI / 6);
  const svg = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u4l8-boxsvg' }, host);
  const labs = [0, 1, 2].map(() => { const d = h('div', 'u4l8-blab'); host.appendChild(d); return d; });
  const read = h('div', 'u4l8-bread'); host.appendChild(read);
  let x = 1, edges = false, alg = false;
  function draw() {
    svg.innerHTML = '';
    const L = x + 4, D = x + 2, U = x;
    const P = (a, b, u) => [(a - b) * C * S, (a + b) * 0.5 * S - u * S];
    const corners = [[0, 0, 0], [L, 0, 0], [0, D, 0], [L, D, 0], [0, 0, U], [L, 0, U], [0, D, U], [L, D, U]].map((q) => P(...q));
    const xs = corners.map((p) => p[0]), ys = corners.map((p) => p[1]);
    const ox = W / 2 - (Math.min(...xs) + Math.max(...xs)) / 2, oy = H / 2 - (Math.min(...ys) + Math.max(...ys)) / 2;
    const Q = (a, b, u) => { const p = P(a, b, u); return [p[0] + ox, p[1] + oy]; };
    const poly4 = (pts, fill) => svgEl('polygon', { points: pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' '), fill, stroke: '#7a5233', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, svg);
    const seg = (p, q) => svgEl('line', { x1: p[0], y1: p[1], x2: q[0], y2: q[1], stroke: 'rgba(122,82,51,.32)', 'stroke-width': 1.3 }, svg);
    poly4([Q(0, 0, U), Q(L, 0, U), Q(L, D, U), Q(0, D, U)], '#ebcf9b');
    poly4([Q(0, D, 0), Q(L, D, 0), Q(L, D, U), Q(0, D, U)], '#d7af70');
    poly4([Q(L, 0, 0), Q(L, D, 0), Q(L, D, U), Q(L, 0, U)], '#c39457');
    for (let i = 1; i < L; i++) { seg(Q(i, 0, U), Q(i, D, U)); seg(Q(i, D, 0), Q(i, D, U)); }
    for (let j = 1; j < D; j++) { seg(Q(0, j, U), Q(L, j, U)); seg(Q(L, j, 0), Q(L, j, U)); }
    for (let k = 1; k < U; k++) { seg(Q(0, D, k), Q(L, D, k)); seg(Q(L, 0, k), Q(L, D, k)); }
    // packing tape across the top
    const tw = 0.35;
    svgEl('polygon', { points: [Q(0, D / 2 - tw, U), Q(L, D / 2 - tw, U), Q(L, D / 2 + tw, U), Q(0, D / 2 + tw, U)].map((p) => p.join(',')).join(' '), fill: 'rgba(255,255,255,.45)' }, svg);
    // edge labels: length under the left-front face, depth under the right-front face, height up the left edge
    const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    const put = (d, p, dx, dy, txt) => { d.innerHTML = txt; d.style.left = (p[0] + dx) + 'px'; d.style.top = (p[1] + dy) + 'px'; };
    const e = (expr, val) => (!edges ? '?' : alg ? T(`${expr}=${val}`) : T(String(val)));
    put(labs[0], mid(Q(0, D, 0), Q(L, D, 0)), -26, 16, e('x+4', L));
    put(labs[1], mid(Q(L, D, 0), Q(L, 0, 0)), 26, 16, e('x+2', D));
    put(labs[2], mid(Q(0, D, 0), Q(0, D, U)), -30, 0, e('x', U));
    labs.forEach((d) => d.classList.toggle('q', !edges));
    const V = U ** 3 + 6 * U * U + 8 * U;
    read.innerHTML = T(`x=${x}:\\quad V=${x}^3+6(${x})^2+8(${x})=${V}`) + (edges ? ` &nbsp; ${T(`${U}\\times${D}\\times${L}=${U * D * L}`)} <b class="u4l8-ok">✓</b>` : '');
  }
  const set = (v) => { x = Math.max(1, Math.min(6, v)); draw(); };
  const b = (id, fn) => { const el = document.getElementById(id); if (el) el.addEventListener('click', fn); return el; };
  b('u4l8-xdn', () => set(x - 1)); b('u4l8-xup', () => set(x + 1));
  const eb = b('u4l8-edges', () => { edges = !edges; if (eb) eb.textContent = edges ? 'Hide the edges' : 'Show the edges'; draw(); });
  b('u4l8-wreveal', () => { edges = true; alg = true; if (eb) eb.textContent = 'Hide the edges'; draw(); });
  draw();
}

/* ====================================================================================================
 * STAR: the factoring machine
 * ==================================================================================================== */
const STN = [
  { k: 'dos', name: 'Difference of squares', sub: `2 terms · ${T('A^2-B^2')}`, color: PUR },
  { k: 'tri', name: T('x^2+bx+c'), sub: `3 terms · product ${T('c')}, sum ${T('b')}`, color: GRN },
  { k: 'dec', name: 'Decomposition', sub: `3 terms · product ${T('ac')}, sum ${T('b')}`, color: BLU },
  { k: 'ps', name: 'Perfect square', sub: `3 terms · ${T('A^2\\pm2AB+B^2')}`, color: TEAL },
  { k: 'sub', name: 'Substitution', sub: '3 terms · a repeated chunk', color: AMB },
  { k: 'grp', name: 'Grouping', sub: '4 terms · in pairs', color: BRAND },
  { k: 'no', name: 'Does not factor', sub: 'a sum of squares · no pair', color: RED }
];
const WHY = {
  dos: 'Both terms are squares, <b>subtracted</b>: a <b>difference of squares</b>.',
  tri: `Leading coefficient 1: <b>${T('x^2+bx+c')}</b>.`,
  dec: 'Leading coefficient not 1: <b>decomposition</b>.',
  ps: 'First and last terms are squares: test for a <b>perfect square</b>.',
  sub: 'A <b>repeated chunk</b>: <b>substitution</b>.',
  grp: 'Four terms: <b>grouping</b>.'
};
const MC = {
  grp: { label: 'grouping', e: 'x^3-4x^2+3x-12', terms: ['x^3', '-4x^2', '+3x', '-12'], st: 'grp',
    how: 'group in pairs, take the GCF of each pair, then the common binomial.',
    work: ['=x^2(x-4)+3(x-4)', '=(x-4)(x^2+3)'], fac: ['x-4', 'x^2+3'],
    done: `${T('x-4')} is linear and ${T('x^2+3')} is a sum`, fin: '(x-4)(x^2+3)',
    chk: ['(x-4)(x^2+3)=x^3+3x-4x^2-12', '=x^3-4x^2+3x-12'] },
  dec: { label: 'decomposition', e: '6x^2+7x-3', terms: ['6x^2', '+7x', '-3'], st: 'dec',
    how: `product ${T('ac=-18')} and sum ${T('7')}: ${T('9')} and ${T('-2')}. Split the middle term and group.`,
    work: ['#ac=-18:\\ 9+(-2)=7', '=6x^2+9x-2x-3', '=3x(2x+3)-(2x+3)', '=(2x+3)(3x-1)'], fac: ['2x+3', '3x-1'],
    done: 'both factors are linear', fin: '(2x+3)(3x-1)', chk: ['(2x+3)(3x-1)=6x^2-2x+9x-3', '=6x^2+7x-3'] },
  ps: { label: 'perfect square', e: '9x^2-30x+25', terms: ['9x^2', '-30x', '+25'], st: 'ps',
    how: `${T('9x^2=(3x)^2')} and ${T('25=5^2')}, and the middle is ${T('2AB=2(3x)(5)=30x')} (with a minus sign).`,
    work: ['#9x^2=(3x)^2,\\ 25=5^2,\\ 2(3x)(5)=30x', '=(3x-5)^2'], fac: ['3x-5', '3x-5'],
    done: 'the factor is linear (it appears twice)', fin: '(3x-5)^2', chk: ['(3x-5)^2=9x^2-15x-15x+25', '=9x^2-30x+25'] },
  dos: { label: 'diff. of squares', e: 'x^4-81', terms: ['x^4', '-81'], st: 'dos',
    how: `${T('x^4=(x^2)^2')} and ${T('81=9^2')}: ${T('A=x^2')}, ${T('B=9')}.`,
    work: ['#A=x^2,\\ B=9', '=(x^2-9)(x^2+9)'], fac: ['x^2-9', 'x^2+9'],
    again: [{ of: 'x^2-9', st: 'dos', cap: `${T('x^2-9=x^2-3^2')} is a difference of squares <b>again</b>.`, work: 'x^2-9=(x-3)(x+3)', res: ['x-3', 'x+3'] }],
    done: `${T('x^2+9')} is a <b>sum</b> of squares: it stays`, fin: '(x-3)(x+3)(x^2+9)', chk: ['(x-3)(x+3)=x^2-9', '(x^2-9)(x^2+9)=x^4-81'] },
  sub: { label: 'substitution', e: '(x+1)^2-5(x+1)+6', terms: ['(x+1)^2', '-5(x+1)', '+6'], st: 'sub',
    why: `The chunk ${T('(x+1)')} repeats: <b>substitution</b>.`,
    how: `let ${T('A=x+1')}, factor in ${T('A')}, put ${T('(x+1)')} back in brackets, simplify.`,
    work: ['#A=x+1:\\ A^2-5A+6', '=(A-2)(A-3)', '=[(x+1)-2][(x+1)-3]', '=(x-1)(x-2)'], fac: ['x-1', 'x-2'],
    done: 'both factors are linear', fin: '(x-1)(x-2)', chk: ['(x-1)(x-2)=x^2-3x+2', '(x+1)^2-5(x+1)+6=x^2-3x+2'] },
  e1a: { label: '(a)', e: '4x^3-8x^2-60x', gcf: '4x', gnote: 'Every term has a 4 and an x.', after: 'x^2-2x-15', terms: ['x^2', '-2x', '-15'], st: 'tri',
    how: `product ${T('-15')} and sum ${T('-2')}: ${T('-5')} and ${T('3')}.`,
    work: ['#(-5)(3)=-15,\\ -5+3=-2', '=4x(x-5)(x+3)'], fac: ['x-5', 'x+3'],
    done: 'every factor is linear', fin: '4x(x-5)(x+3)', chk: ['4x(x-5)(x+3)=4x(x^2-2x-15)', '=4x^3-8x^2-60x'] },
  e1b: { label: '(b)', e: '10x^2-11xy-6y^2', terms: ['10x^2', '-11xy', '-6y^2'], st: 'dec',
    how: `two variables, same hunt: product ${T('ac=-60')} and sum ${T('-11')}: ${T('-15')} and ${T('4')}.`,
    work: ['#ac=-60:\\ -15+4=-11', '=10x^2-15xy+4xy-6y^2', '=5x(2x-3y)+2y(2x-3y)', '=(2x-3y)(5x+2y)'], fac: ['2x-3y', '5x+2y'],
    done: 'both factors are linear', fin: '(2x-3y)(5x+2y)', chk: ['(2x-3y)(5x+2y)=10x^2+4xy-15xy-6y^2', '=10x^2-11xy-6y^2'] },
  e1c: { label: '(c)', e: 'x^3+2x^2-9x-18', terms: ['x^3', '+2x^2', '-9x', '-18'], st: 'grp',
    how: `${T('x^2(x+2)')} and ${T('-9(x+2)')}: the common binomial is ${T('x+2')}.`,
    work: ['=x^2(x+2)-9(x+2)', '=(x+2)(x^2-9)'], fac: ['x+2', 'x^2-9'],
    again: [{ of: 'x^2-9', st: 'dos', cap: `${T('x^2-9')} is a <b>difference of squares</b>: back through the machine.`, work: 'x^2-9=(x-3)(x+3)', res: ['x-3', 'x+3'] }],
    done: 'every factor is linear', fin: '(x+2)(x-3)(x+3)', chk: ['(x-3)(x+3)=x^2-9', '(x+2)(x^2-9)=x^3+2x^2-9x-18'] },
  e1d: { label: '(d)', e: '\\tfrac{1}{3}x^2-2x-9', gcf: '\\tfrac{1}{3}', gnote: `A fraction leads: factor out ${T('\\tfrac13')} (dividing each term by ${T('\\tfrac13')} is multiplying it by 3).`,
    after: 'x^2-6x-27', terms: ['x^2', '-6x', '-27'], st: 'tri', how: `product ${T('-27')} and sum ${T('-6')}: ${T('-9')} and ${T('3')}.`,
    work: ['#(-9)(3)=-27,\\ -9+3=-6', '=\\tfrac{1}{3}(x-9)(x+3)'], fac: ['x-9', 'x+3'],
    done: 'both binomials are linear', fin: '\\tfrac{1}{3}(x-9)(x+3)', chk: ['\\tfrac{1}{3}(x-9)(x+3)=\\tfrac{1}{3}(x^2-6x-27)', '=\\tfrac{1}{3}x^2-2x-9'] },
  r1: { label: T('2x^3-18x'), e: '2x^3-18x', gcf: '2x', gnote: 'Both terms have a 2 and an x.', after: 'x^2-9', terms: ['x^2', '-9'], st: 'dos',
    how: `${T('x^2')} and ${T('9=3^2')} are squares, subtracted: ${T('A=x')}, ${T('B=3')}.`, work: ['=2x(x-3)(x+3)'], fac: ['x-3', 'x+3'],
    done: 'every factor is linear', fin: '2x(x-3)(x+3)', chk: ['2x(x-3)(x+3)=2x(x^2-9)', '=2x^3-18x'] },
  r2: { label: T('x^2+4x+6'), e: 'x^2+4x+6', terms: ['x^2', '+4x', '+6'], st: 'tri',
    how: `product ${T('6')} and sum ${T('4')} (both numbers positive)?`, work: ['#1\\times6:\\ 1+6=7', '#2\\times3:\\ 2+3=5'], reject: true,
    rcap: `<b>No pair has sum 4</b>: the trinomial <b>does not factor</b>. (Close: ${T('(x+2)^2=x^2+4x+4')}, not ${T('+6')}.)` },
  r3: { label: T('x^4-13x^2+36'), e: 'x^4-13x^2+36', terms: ['x^4', '-13x^2', '+36'], st: 'sub',
    why: `${T('x^4=(x^2)^2')}: the chunk ${T('x^2')} repeats. <b>Substitution</b>.`,
    how: `let ${T('A=x^2')}: product ${T('36')} and sum ${T('-13')} are ${T('-4')} and ${T('-9')}.`,
    work: ['#A=x^2:\\ A^2-13A+36', '=(A-4)(A-9)', '=(x^2-4)(x^2-9)'], fac: ['x^2-4', 'x^2-9'],
    again: [{ of: 'x^2-4', st: 'dos', cap: `${T('x^2-4')} is a difference of squares.`, work: 'x^2-4=(x-2)(x+2)', res: ['x-2', 'x+2'] },
      { of: 'x^2-9', st: 'dos', cap: `So is ${T('x^2-9')}.`, work: 'x^2-9=(x-3)(x+3)', res: ['x-3', 'x+3'] }],
    done: 'every factor is linear', fin: '(x-2)(x+2)(x-3)(x+3)', chk: ['(x^2-4)(x^2-9)=x^4-9x^2-4x^2+36', '=x^4-13x^2+36'] }
};
const TCOL = [BLU, AMB, GRN, PUR];
const machine = {
  title: 'The factoring machine',
  height: 452, minW: 980, capH: 84,
  choices: [{ sep: 'Table:' }, ...['grp', 'dec', 'ps', 'dos', 'sub'].map((v) => ({ v, label: MC[v].label })),
    { sep: 'Example 1:' }, ...['e1a', 'e1b', 'e1c', 'e1d'].map((v) => ({ v, label: MC[v].label })),
    { sep: 'Review:' }, ...['r1', 'r2', 'r3'].map((v) => ({ v, label: MC[v].label }))],
  ask: (v) => `${/^e1/.test(v) ? `Example 1${MC[v].label}: f` : 'F'}actor fully: ${T(MC[v].e)}`,
  make(stage, v, ex) {
    const d = MC[v], W = ex.W, BY = 112, G1 = 214, G2 = 388, SX = 512, SW = 230, SH = 42, SG = 6;
    const svg = svgEl('svg', { width: W, height: 452, class: 'u4l8-msvg' }, stage);
    // hopper, belt, rollers, scanner beams
    svgEl('path', { d: 'M52 2 L188 2 L156 60 L84 60 Z', fill: '#efe9dc', stroke: '#b9ad94', 'stroke-width': 3, 'stroke-linejoin': 'round' }, svg);
    svgEl('text', { x: 120, y: 38, 'text-anchor': 'middle', class: 'u4l8-hoptxt' }, svg).textContent = 'IN';
    svgEl('rect', { x: 6, y: 134, width: 484, height: 14, rx: 7, fill: '#3a4254' }, svg);
    for (let x = 22; x < 490; x += 34) svgEl('circle', { cx: x, cy: 141, r: 3.6, fill: '#9aa0ab' }, svg);
    const beam = (x) => svgEl('line', { x1: x, x2: x, y1: 84, y2: 132, stroke: '#c9c2b3', 'stroke-width': 3, 'stroke-dasharray': '5 5' }, svg);
    const beams = [beam(G1), beam(G2)];
    const stations = STN.map((s, i) => {
      const y = 4 + i * (SH + SG), el = div(stage, 'u4l8-st', `<b>${s.name}</b><span class="u4l8-sts">${s.sub}</span>`, SX, y, SW, SH);
      el.style.setProperty('--st', s.color); return Object.assign({}, s, { el, cy: y + SH / 2 });
    });
    const chutes = {}; stations.forEach((s) => { chutes[s.k] = svgEl('path', { d: `M490 ${BY} C 502 ${BY}, 498 ${s.cy}, ${SX} ${s.cy}`, fill: 'none', stroke: '#ddd6c8', 'stroke-width': 3 }, svg); });
    const g1 = div(stage, 'u4l8-gate', '<i></i><b>GCF?</b>', G1 - 64, 40, 128, 44);
    const g2 = div(stage, 'u4l8-gate', '<i></i><b>Terms?</b><span class="u4l8-cnt">–</span>', G2 - 74, 40, 148, 44);
    const cnt = g2.querySelector('.u4l8-cnt');
    const lamp = (g, cls) => { g.classList.remove('on', 'no'); g.classList.add(cls); };
    // tray, working, result band
    const TX = SX + SW + 14, TW = W - TX - 2;
    const tray = panel(stage, TX, 4, TW, 336, 'Factors', 'u4l8-tray'), chipsBox = h('div', 'u4l8-chips'); tray.appendChild(chipsBox);
    const nLines = 1 + (d.gcf ? 1 : 0) + (d.work || []).length + (d.again || []).length + (d.chk || []).length;
    const wp = panel(stage, 6, 160, 486, 288, 'Working', 'u4l8-work' + (nLines > 7 ? ' u4l8-tight' : ''));
    const band = div(stage, 'u4l8-band', '', SX, 348, W - SX - 2, 100); hide(band);
    const okSt = stampAt(stage, d.reject ? '✗ DOES NOT FACTOR' : '✓ EXPANDS BACK', !d.reject, SX + SW + 14 + (W - SX - SW - 16) / 2, 300, { size: 'sm' });
    const card = div(stage, 'u4l8-mcard', T(d.e), 120, 34); hide(card);
    const chips = [];
    const addChip = (t, cls = '', before = null) => { const el = h('div', 'u4l8-fchip ' + cls, T(t)); if (before) chipsBox.insertBefore(el, before); else chipsBox.appendChild(el); hide(el); const o = { t, el }; if (before) chips.splice(chips.findIndex((q) => q.el === before), 0, o); else chips.push(o); return el; };
    const L0 = lineIn(wp, T(d.e), 'u4l8-eq0');
    const Lg = d.gcf ? lineIn(wp, T(`=${d.gcf}(${d.after})`)) : null;
    const Lw = (d.work || []).map((t) => mline(wp, t));
    const La = (d.again || []).map((a) => lineIn(wp, T(a.work), 'u4l8-again'));
    const Lc = (d.chk || []).map((t, i) => lineIn(wp, (i ? '' : '<b>Check:</b> ') + T(t + (i === d.chk.length - 1 ? '\\ \\checkmark' : '')), 'u4l8-chk'));
    const S = stations.find((s) => s.k === d.st), n = d.terms.length;
    const steps = [];
    steps.push({ cap: `Into the machine: ${T(d.e)}. <b>Gate 1: is there a GCF?</b>`,
      run: async (c) => {
        card.style.opacity = 1; await anim(c, card, [{ top: '34px', opacity: 0 }, { top: BY + 'px', opacity: 1 }], 600);
        await show(c, L0); await moveTo(c, card, G1, BY, 520);
      } });
    if (d.gcf) steps.push({ cap: `<b>Yes: the GCF is ${T(d.gcf)}.</b> ${d.gnote} What’s left: ${T(d.after)}.`,
      run: async (c) => { lamp(g1, 'on'); beams[0].setAttribute('stroke', GCF); const gc = addChip(d.gcf, 'u4l8-gcf'); await pop(c, gc); card.innerHTML = T(d.after); await pulse(c, card, 1.1); await show(c, Lg); } });
    else steps.push({ cap: '<b>No common factor</b> (other than 1): it rolls on to gate 2.', run: async (c) => { lamp(g1, 'no'); await shake(c, g1); } });
    steps.push({ cap: `<b>Gate 2: ${n} terms.</b> ${d.why || WHY[d.st]}`,
      run: async (c) => {
        await moveTo(c, card, G2, BY, 520);
        card.innerHTML = T(d.terms.map((t, i) => K(TCOL[i % 4], t)).join(''));
        cnt.textContent = n; lamp(g2, 'on'); beams[1].setAttribute('stroke', S.color); await pop(c, cnt);
        const ch = chutes[d.st]; ch.setAttribute('stroke', S.color); ch.setAttribute('stroke-width', 5);
        await moveTo(c, card, SX + SW / 2, S.cy, 700, { opacity: 0, transform: 'scale(.45)' });
        S.el.classList.add('on'); await pulse(c, S.el, 1.05);
      } });
    steps.push({ cap: `<b>${S.name}:</b> ${d.how}`,
      run: async (c) => {
        for (const l of Lw) await show(c, l);
        if (!d.reject) for (const t of d.fac) await pop(c, addChip(t));
      } });
    if (d.reject) {
      const NO = stations.find((s) => s.k === 'no');
      steps.push({ cap: d.rcap,
        run: async (c) => { S.el.classList.remove('on'); NO.el.classList.add('on'); await shake(c, NO.el); band.innerHTML = `<div class="u4l8-bh">Result</div>${T(d.e)} <b class="u4l8-xr">does not factor</b>`; band.classList.add('u4l8-bandno'); await show(c, band); await stampIn(c, okSt); } });
      return steps;
    }
    (d.again || []).forEach((a, i) => {
      const AS = stations.find((s) => s.k === a.st);
      steps.push({ cap: `<b>Factor again?</b> ${a.cap}`,
        run: async (c) => {
          const o = chips.find((q) => q.t === a.of); o.el.classList.add('u4l8-again');
          stations.forEach((s) => s.el.classList.remove('on')); AS.el.classList.add('on'); await pulse(c, o.el, 1.12); await pulse(c, AS.el, 1.05);
          await show(c, La[i]);
          const news = a.res.map((t) => addChip(t, 'u4l8-new', o.el));
          o.el.remove(); chips.splice(chips.indexOf(o), 1);
          for (const e of news) await pop(c, e);
        } });
    });
    steps.push({ cap: `<b>Check every factor:</b> ${d.done}. <b>Factored fully:</b> ${T(d.fin)}.`,
      run: async (c) => {
        stations.forEach((s) => s.el.classList.remove('on'));
        chips.forEach((q) => { if (!q.el.querySelector('em')) q.el.insertAdjacentHTML('beforeend', '<em>✓</em>'); q.el.classList.add('u4l8-done'); });
        band.innerHTML = `<div class="u4l8-bh">Factored fully</div>${T(`=${d.fin}`)}`; await show(c, band);
      } });
    steps.push({ cap: '<b>Expand to check:</b> multiplying the factors back gives the original expression ✓.',
      run: async (c) => { for (const l of Lc) await show(c, l); await stampIn(c, okSt); } });
    return steps;
  }
};

/* ====================================================================================================
 * Solving by factoring: one side = 0, factor, either–or switches, roots on the graph
 * ==================================================================================================== */
const SR = {
  lost: { label: T('x^2=5x'), eq: 'x^2=5x', std: 'x^2-5x=0', fac: 'x(x-5)=0', fs: ['x', 'x-5'], sols: ['x=0', 'x=5'],
    roots: [[0, '0', 'nw'], [5, '5', 'ne']], f: (x) => x * x - 5 * x, ft: 'x^2-5x', win: { xmin: -2, xmax: 7, ymin: -8, ymax: 8, ylabels: 2 }, lost: true },
  a: { label: '(a)', eq: '6x^2=7x+3', std: '6x^2-7x-3=0', hunt: 'ac=-18:\\ -9+2=-7', more: ['3x(2x-3)+(2x-3)=0'], fac: '(2x-3)(3x+1)=0',
    fs: ['2x-3', '3x+1'], sols: ['x=\\frac{3}{2}', 'x=-\\frac{1}{3}'], roots: [[1.5, '\\frac{3}{2}', 'ne'], [-1 / 3, '-\\frac{1}{3}', 'nw']],
    f: (x) => 6 * x * x - 7 * x - 3, ft: '6x^2-7x-3', win: { xmin: -2, xmax: 3, ymin: -6, ymax: 6, xstep: 0.5, xlabels: 1, ylabels: 2 } },
  b: { label: '(b)', eq: '(x-4)(x+1)=6', pre: 'x^2-3x-4=6', std: 'x^2-3x-10=0', fac: '(x-5)(x+2)=0', fs: ['x-5', 'x+2'], sols: ['x=5', 'x=-2'],
    roots: [[5, '5', 'ne'], [-2, '-2', 'nw']], f: (x) => x * x - 3 * x - 10, ft: 'x^2-3x-10', win: { xmin: -4, xmax: 7, ymin: -14, ymax: 6, ystep: 2, ylabels: 4 } },
  c: { label: '(c)', eq: '3x^2-48=0', dv: '3(x^2-16)=0', dk: 3, fac: '3(x-4)(x+4)=0', fs: ['x-4', 'x+4'], sols: ['x=4', 'x=-4'],
    roots: [[4, '4', 'ne'], [-4, '-4', 'nw']], f: (x) => 3 * x * x - 48, ft: '3x^2-48', win: { xmin: -6, xmax: 6, ymin: -50, ymax: 20, ystep: 10, ylabels: 10 } },
  d: { label: '(d)', eq: '4x^2+20x+25=0', hunt: '(2x)^2+2(2x)(5)+5^2', fac: '(2x+5)^2=0', fs: ['2x+5', '2x+5'], sols: ['x=-\\frac{5}{2}'], double: true,
    roots: [[-2.5, '-\\frac{5}{2}', 'ne']], f: (x) => 4 * x * x + 20 * x + 25, ft: '4x^2+20x+25', win: { xmin: -5, xmax: 1, ymin: -2, ymax: 10, xstep: 0.5, xlabels: 1, ylabels: 2 } },
  rev: { label: T('2x^2+6x=20'), eq: '2x^2+6x=20', std: '2x^2+6x-20=0', dv: '2(x^2+3x-10)=0', dk: 2, hunt: '(5)(-2)=-10,\\ 5+(-2)=3', fac: '2(x+5)(x-2)=0', fs: ['x+5', 'x-2'],
    sols: ['x=-5', 'x=2'], roots: [[-5, '-5', 'nw'], [2, '2', 'ne']], f: (x) => 2 * x * x + 6 * x - 20, ft: '2x^2+6x-20', win: { xmin: -7, xmax: 4, ymin: -26, ymax: 10, ystep: 2, ylabels: 4 } }
};
const solveRecap = {
  title: 'Solving by factoring: 0, factor, switch',
  height: 420, minW: 960,
  choices: [{ sep: 'Concept:' }, { v: 'lost', label: SR.lost.label }, { sep: 'Example 4 check:' }, ...['a', 'b', 'c', 'd'].map((v) => ({ v, label: SR[v].label })), { sep: 'Review:' }, { v: 'rev', label: SR.rev.label }],
  ask: (v) => `${'abcd'.includes(v) && v.length === 1 ? `Example 4${SR[v].label}: s` : 'S'}olve by factoring: ${T(SR[v].eq)}`,
  make(stage, v, ex) {
    const d = SR[v], W = ex.W, GW = 400, PW = W - GW - 20;
    const P = panel(stage, 0, 4, PW, 410, '', 'u4l8-big');
    lineIn(P, T(d.eq), 'u4l8-eq0').style.opacity = 1;
    const Lpre = d.pre ? lineIn(P, `${T(d.pre)}<span class="u4l8-tag">expand first</span>`, 'u4l8-wl') : null;
    const Lstd = d.std ? lineIn(P, `${T(d.std)}<span class="u4l8-tag">one side = 0</span>`, 'u4l8-wl') : null;
    const Ldv = d.dv ? lineIn(P, `${T(d.dv)}<span class="u4l8-tag">common factor ${d.dk}</span>`, 'u4l8-wl') : null;
    const Lh = d.hunt ? lineIn(P, T(d.hunt), 'u4l8-note') : null;
    const Lm = (d.more || []).map((t) => lineIn(P, T(t)));
    const Lf = lineIn(P, `${T(d.fac)}<span class="u4l8-tag">factor</span>`, 'u4l8-wl');
    const sw = h('div', 'u4l8-sws'); P.appendChild(sw); hide(sw);
    const fsU = d.double ? [d.fs[0]] : d.fs;
    const sws = fsU.map((f, i) => {
      const e = h('div', 'u4l8-sw', `<span class="u4l8-swk"><i></i></span><span class="u4l8-swf">${T(f + '=0')}</span><span class="u4l8-swa">${T(d.sols[i])}</span>`);
      if (i) sw.appendChild(h('div', 'u4l8-or', 'or'));
      sw.appendChild(e); hide(e.querySelector('.u4l8-swa')); return e;
    });
    const Lr = lineIn(P, '', 'u4l8-rootsl');
    Lr.innerHTML = d.double ? `One root, twice: <b>${T(d.sols[0])}</b> (a double root)` : `Roots: <b>${T(d.sols.join('\\ \\text{ or }\\ '))}</b>`;
    const Llost = d.lost ? lineIn(P, `<span class="u4l8-xr">${T('\\cancel{\\dfrac{x^2}{x}=\\dfrac{5x}{x}}\\ \\Rightarrow\\ x=5')}</span> <span class="u4l8-xr">only: the root 0 is lost!</span>`, 'u4l8-lostl') : null;
    const G = new Graph(stage, Object.assign({ x: W - GW, y: 6, width: GW, height: GW, fontSize: 15 }, d.win));
    const cv = G.fn(d.f, { color: BLU, width: 4 }); cv.style.opacity = 0;
    const lab = G.label(d.win.xmin + 0.04 * (d.win.xmax - d.win.xmin), d.win.ymax - 0.04 * (d.win.ymax - d.win.ymin), T(`y=${d.ft}`), { pos: 'se', cls: 'u4l8-glab' }); hide(lab);
    const pts = d.roots.map(([x, t, pos]) => hideP(G.point(x, 0, { label: T(`(${t},\\,0)`), pos, color: GCF })));
    const steps = [];
    if (d.pre) steps.push({ cap: `<b>0 on one side first.</b> ${T('(x-4)(x+1)=6')} does <b>not</b> mean a factor is 6. Expand, then subtract 6: ${T(d.std)}.`, run: async (c) => { await show(c, Lpre); await show(c, Lstd); } });
    else if (d.std) steps.push({ cap: `<b>Move every term to one side:</b> ${T(d.std)}.`, run: (c) => show(c, Lstd) });
    if (d.dv) steps.push({ cap: `<b>Divide out the common factor ${d.dk}</b>: a number, which can never be 0. (Never divide by ${T('x')}.)`, run: (c) => show(c, Ldv) });
    steps.push({ cap: `<b>Factor:</b> ${T(d.fac)}.${d.double ? ' A <b>perfect square</b>.' : ''}`,
      run: async (c) => { if (Lh) await show(c, Lh); for (const l of Lm) await show(c, l); await show(c, Lf); } });
    steps.push({ cap: d.double ? `<b>Zero product property:</b> both factors are ${T('2x+5')}, so there is only one switch: ${T(d.sols[0])}.`
      : `<b>Zero product property:</b> if ${T('AB=0')}, then ${T('A=0')} <b>or</b> ${T('B=0')}. Flip each switch: ${T(d.sols.join(',\\ '))}.`,
      run: async (c) => { await show(c, sw); for (const e of sws) { e.classList.add('on'); await anim(c, e.querySelector('i'), [{ transform: 'translateX(0)' }, { transform: 'translateX(24px)' }], 300); await show(c, e.querySelector('.u4l8-swa')); } await show(c, Lr); } });
    steps.push({ cap: d.double ? `On the graph of ${T(`y=${d.ft}`)} the root is the vertex: the parabola <b>touches</b> the ${T('x')}-axis at ${T(`(${d.roots[0][1]},\\,0)`)}.`
      : `The roots are the <b>zeros</b> of ${T(`y=${d.ft}`)}: where its graph crosses the ${T('x')}-axis.`,
      run: async (c) => { await show(c, lab); await drawOn(c, G, cv, 900); for (const p of pts) await popP(c, p); } });
    if (d.lost) steps.push({ cap: `<b>Why not divide by ${T('x')}?</b> It assumes ${T('x\\ne0')}, so the root ${T('x=0')} is lost, though the graph crosses there too.`,
      run: async (c) => { await show(c, Llost); await pulse(c, pts[0], 1.6); } });
    return steps;
  }
};

/* ====================================================================================================
 * Radical equations: the six-step rail
 * ==================================================================================================== */
const RAIL = ['Restrictions', 'Isolate', 'Square', 'Radical left?', 'Solve', 'Verify'];
const RR = {
  neg: { label: T('\\sqrt{x}=-3'), eq: '\\sqrt{x}=-3', R: ['x\\ge0'], isoCap: 'The radical is already alone, and it equals a <b>negative</b> number. A square root is never negative: there can be no solution. Watch what squaring does anyway.',
    sq: ['x=9'], sqCap: `${T('(\\sqrt{x})^2=x')} and ${T('(-3)^2=9')}.`, solve: [], solveCap: `Squaring gave ${T('x=9')} directly.`,
    cands: [{ x: '9', L: ['\\sqrt{9}', '3'], R: ['-3'], ok: false }], fin: '\\text{no solution}', finCap: `Squaring turned ${T('-3')} into ${T('9=3^2')}: it can’t tell ${T('3')} from ${T('-3')}. <b>No solution.</b>` },
  two: { label: T('\\sqrt{x+2}=x'), eq: '\\sqrt{x+2}=x', R: ['x+2\\ge0\\Rightarrow x\\ge-2', 'x\\ge0\\ \\text{(the other side)}'], rCap: `the radicand ${T('x+2\\ge0')}, and the side opposite the radical is ${T('\\ge0')}: so ${T('x\\ge0')}`,
    isoCap: 'The radical is already alone.', sq: ['x+2=x^2'], solve: ['0=x^2-x-2', '0=(x-2)(x+1)', 'x=2\\ \\text{or}\\ x=-1'], solveCap: `A quadratic: factor. ${T('x=2')} or ${T('x=-1')}.`,
    cands: [{ x: '2', L: ['\\sqrt{4}', '2'], R: ['2'], ok: true }, { x: '-1', L: ['\\sqrt{1}', '1'], R: ['-1'], ok: false, note: `It also breaks the restriction ${T('x\\ge0')}.` }], fin: 'x=2' },
  a: { label: '(a)', eq: '3\\sqrt{2x-1}-2=7', R: ['2x-1\\ge0\\Rightarrow x\\ge\\frac{1}{2}'], iso: [['3\\sqrt{2x-1}=9', '+ 2'], ['\\sqrt{2x-1}=3', '÷ 3']],
    isoCap: `Undo what is outside the root, outside in: add 2, then divide by 3.`, sq: ['2x-1=9'], solve: ['2x=10\\Rightarrow x=5'], solveCap: `${T('x=5')}, which meets ${T('x\\ge\\frac12')}.`,
    cands: [{ x: '5', L: ['3\\sqrt{9}-2', '3(3)-2', '7'], R: ['7'], ok: true }], fin: 'x=5' },
  b: { label: '(b)', eq: '\\sqrt{x+8}+4=x', R: ['x+8\\ge0\\Rightarrow x\\ge-8'], iso: [['\\sqrt{x+8}=x-4', '− 4'], ['x-4\\ge0\\Rightarrow x\\ge4', 'other side ≥ 0', 'u4l8-rl']],
    isoCap: `Subtract 4. Now the side opposite the radical must be ${T('\\ge0')} too: ${T('x\\ge4')}.`, sq: ['x+8=(x-4)^2', 'x+8=x^2-8x+16'],
    sqCap: `Square the binomial side as ${T('(a-b)^2=a^2-2ab+b^2')}: ${T('(x-4)^2=x^2-8x+16')}, not ${T('x^2+16')}.`,
    solve: ['0=x^2-9x+8', '0=(x-1)(x-8)', 'x=1\\ \\text{or}\\ x=8'], solveCap: `Product 8, sum ${T('-9')}: ${T('x=1')} or ${T('x=8')}.`,
    cands: [{ x: '8', L: ['\\sqrt{16}+4', '8'], R: ['8'], ok: true }, { x: '1', L: ['\\sqrt{9}+4', '7'], R: ['1'], ok: false, note: `(It also breaks ${T('x\\ge4')}.)` }], fin: 'x=8' },
  rev: { label: T('\\sqrt{x+7}=x+1'), eq: '\\sqrt{x+7}=x+1', R: ['x+7\\ge0\\Rightarrow x\\ge-7', 'x+1\\ge0\\Rightarrow x\\ge-1'], rCap: `${T('x\\ge-7')} from the radicand and ${T('x\\ge-1')} from the other side: ${T('x\\ge-1')}`,
    isoCap: 'The radical is already alone.', sq: ['x+7=(x+1)^2', 'x+7=x^2+2x+1'], sqCap: `${T('(x+1)^2=x^2+2x+1')}: keep the middle term.`,
    solve: ['0=x^2+x-6', '0=(x+3)(x-2)', 'x=-3\\ \\text{or}\\ x=2'], solveCap: `${T('x=-3')} or ${T('x=2')}.`,
    cands: [{ x: '2', L: ['\\sqrt{9}', '3'], R: ['3'], ok: true }, { x: '-3', L: ['\\sqrt{4}', '2'], R: ['-2'], ok: false, note: `(It also breaks ${T('x\\ge-1')}.)` }], fin: 'x=2' }
};
function rail(stage, x, y, w, labels) {
  const r = div(stage, 'u4l8-rail', '', x, y, w);
  const pills = labels.map((t, i) => { const p = h('div', 'u4l8-rstep', `<b>${i + 1}</b>${t}`); r.appendChild(p); return p; });
  const on = (i) => pills.forEach((p, j) => { p.classList.toggle('on', j === i); p.classList.toggle('done', j < i); });
  /* light step i and nudge its pill (every step then animates, even one with no new working) */
  const go = (c, i) => { on(i); return pulse(c, pills[i], 1.04); };
  return { el: r, on, go, pills };
}
const workLine = (p, t, note, cls = '') => lineIn(p, `<span class="u4l8-lt">${T(t)}</span>${note ? `<span class="u4l8-tag">${note}</span>` : ''}`, 'u4l8-wl ' + cls);
function verifySteps(stage, cands, VX, VW, y0, gap, okTxt = '✓ root') {
  let y = y0;
  return cands.map((k, i) => {
    const card = checkCard(stage, { title: 'Verify', at: `x=${k.x}`, left: k.L, right: k.R, ok: k.ok, x: VX, y, width: VW, hidden: true, cls: 'u4l8-ck' });
    const cy = y; y += card.offsetHeight ? card.offsetHeight + 14 : gap;
    const st = stampAt(stage, k.ok ? okTxt : '✗ extraneous', k.ok, VX + VW / 2, cy + 180, { size: 'sm' });
    /* the stamp takes the place of the card's verdict row */
    st.place = () => { st.style.top = (cy + card.offsetHeight - 22) + 'px'; card.verdict.style.visibility = 'hidden'; };
    return { k, card, st };
  });
}
const radRecap = {
  title: 'Radical equations: six steps, then check every root',
  height: 430, minW: 980, capH: 84,
  choices: [{ sep: 'Concept:' }, { v: 'neg', label: RR.neg.label }, { v: 'two', label: RR.two.label }, { sep: 'Example 7 check:' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }, { sep: 'Review:' }, { v: 'rev', label: RR.rev.label }],
  ask: (v) => `${v.length === 1 ? `Example 7(${v}): s` : 'S'}olve and verify ${T(RR[v].eq)}.`,
  make(stage, v, ex) {
    const d = RR[v], W = ex.W, VW = 300, VX = W - VW, PX = 196, PW = VX - PX - 14;
    const R = rail(stage, 0, 4, 182, RAIL);
    const P = panel(stage, PX, 4, PW, 420, '', 'u4l8-big2');
    lineIn(P, T(d.eq), 'u4l8-eq0').style.opacity = 1;
    const lR = d.R.map((t) => workLine(P, t, '', 'u4l8-rl'));
    const lI = (d.iso || []).map(([t, n, cls]) => workLine(P, t, n, cls || ''));
    const lS = d.sq.map((t, i) => workLine(P, t, i === 0 ? 'square both sides' : ''));
    const lV = d.solve.map((t) => workLine(P, t, ''));
    const lF = lineIn(P, `<b>Answer:</b> ${T(d.fin)}`, 'u4l8-ansl');
    const vs = verifySteps(stage, d.cands, VX, VW, 4, 212);
    const steps = [
      { cap: `<b>1. Restrictions:</b> ${d.rCap || `the radicand must be ${T('\\ge0')}: ${T(d.R[d.R.length - 1])}`}.`, run: async (c) => { await R.go(c, 0); for (const l of lR) await show(c, l); } },
      { cap: `<b>2. Isolate.</b> ${d.isoCap}`, run: async (c) => { await R.go(c, 1); for (const l of lI) await show(c, l); } },
      { cap: `<b>3. Square both sides.</b> ${d.sqCap || 'Squaring undoes the square root.'}`, run: async (c) => { await R.go(c, 2); for (const l of lS) await show(c, l); } },
      { cap: '<b>4. A radical left?</b> No: skip to solving.', run: async (c) => { await R.go(c, 3); } },
      { cap: `<b>5. Solve.</b> ${d.solveCap}`, run: async (c) => { await R.go(c, 4); for (const l of lV) await show(c, l); } }
    ];
    vs.forEach(({ k, card, st }, i) => steps.push({
      cap: `<b>6. Verify ${T('x=' + k.x)}</b> in the <b>original</b> equation: ${k.ok ? `both sides are ${T(k.R[k.R.length - 1])}. A root ✓` : `left side ${T(k.L[k.L.length - 1])}, right side ${T(k.R[k.R.length - 1])}. Not equal: <b class="u4l8-xr">extraneous</b>. ${k.note || ''}`}`,
      run: async (c) => { await R.go(c, 5); await card.play(c); st.place(); await stampIn(c, st); if (i === vs.length - 1) R.pills[5].classList.add('done'); } }));
    steps.push({ cap: d.finCap || `<b>Answer:</b> ${T(d.fin)}. Only the roots that pass the check count.`, run: (c) => show(c, lF) });
    return steps;
  }
};

/* ====================================================================================================
 * Common errors
 * ==================================================================================================== */
const ER = {
  sq: { label: T('(x-2)^2'), ask: `Expand ${T('(x-2)^2')}.`, wrong: ['(x-2)^2', '=x^2+4'], test: ['x=3:\\quad(3-2)^2=1', '3^2+4=13\\ne1'],
    tcap: `Test it with ${T('x=3')}: ${T('(3-2)^2=1')} but ${T('9+4=13')}. Wrong!`, fix: ['(x-2)^2=(x-2)(x-2)', '=x^2-2x-2x+4', '=x^2-4x+4'],
    fcap: 'Write it as a product of two brackets and multiply every term.', rule: `Square a binomial as ${T('(a-b)^2=a^2-2ab+b^2')}: the middle term ${T('-2ab')} is the one that gets lost.` },
  full: { label: 'not fully factored', ask: `Ava factored ${T('2x^2-8')} as ${T('(2x-4)(x+2)')}.`, wrong: ['2x^2-8', '=(2x-4)(x+2)'], test: ['(2x-4)(x+2)=2x^2-8\\ \\checkmark', '2x-4=2(x-2)\\ \\text{still factors!}'],
    tcap: `Expanding gives ${T('2x^2-8')}, so the product is right, but ${T('2x-4')} still has a common factor of 2: <b>not fully factored</b>.`, fix: ['2x^2-8=2(x^2-4)', '=2(x-2)(x+2)'],
    fcap: 'Take out the GCF <b>first</b>, then factor what is left.', rule: '<b>GCF first</b>, then check every factor: none may factor again.' },
  sum: { label: T('x^2+9'), ask: `Factor ${T('x^2+9')}.`, wrong: ['x^2+9', '=(x+3)(x-3)'], test: ['(x+3)(x-3)=x^2-9\\ne x^2+9', '(x+3)^2=x^2+6x+9\\ne x^2+9'],
    tcap: `Expand: ${T('(x+3)(x-3)=x^2-9')}, and ${T('(x+3)^2')} has a middle term. Nothing works.`, fix: ['\\text{product }9,\\ \\text{sum }0:\\ \\text{no pair}', 'x^2+9\\ \\text{does not factor}'],
    fcap: 'For two numbers with product +9 and sum 0, they would need opposite signs (sum 0) and the same sign (product +9). Impossible.', rule: `A <b>sum</b> of squares ${T('A^2+B^2')} does not factor. Only a <b>difference</b> does.` },
  div: { label: 'dividing by x', ask: `Ben solved ${T('x^2=5x')} by dividing both sides by ${T('x')}.`, wrong: ['x^2=5x', '\\dfrac{x^2}{x}=\\dfrac{5x}{x}', 'x=5'], test: ['x=0:\\quad0^2=5(0)\\ \\checkmark', '\\text{but }x=0\\text{ is gone!}'],
    tcap: `Try ${T('x=0')}: ${T('0^2=5(0)')}. It is a root, and Ben’s answer lost it.`, fix: ['x^2-5x=0', 'x(x-5)=0', 'x=0\\ \\text{or}\\ x=5'],
    fcap: 'Move every term to one side and factor out the x instead.', rule: 'Never divide both sides by an expression containing the variable: it assumes it is not 0, and a root is lost.' },
  ext: { label: 'extraneous', ask: `Solve ${T('\\sqrt{x}=x-2')}.`, wrong: ['\\sqrt{x}=x-2', 'x=x^2-4x+4', '0=(x-1)(x-4)', 'x=1\\ \\text{or}\\ x=4'], test: ['x=1:\\quad\\sqrt{1}=1', '1-2=-1\\ne1'],
    tcap: `Both are roots of the <b>squared</b> equation, but check ${T('x=1')} in the original: ${T('\\sqrt{1}=1')} and ${T('1-2=-1')}.`, fix: ['x=4:\\ \\sqrt{4}=2=4-2\\ \\checkmark', 'x=1\\ \\text{is extraneous}', '\\text{Root: }x=4'],
    fcap: `${T('x=4')} passes the check; ${T('x=1')} does not.`, rule: '<b>Verify every root</b> in the original equation: squaring can add a root that does not work.' }
};
const errors = {
  title: 'Common errors: spot it, test it, fix it',
  height: 392, minW: 940,
  choices: Object.keys(ER).map((v) => ({ v, label: ER[v].label })),
  ask: (v) => ER[v].ask,
  make(stage, v, ex) {
    const d = ER[v], W = ex.W, HW = (W - 16) / 2;
    const A = panel(stage, 0, 4, HW, 236, 'Looks right?', 'u4l8-bad u4l8-big3');
    const B = panel(stage, HW + 16, 4, HW, 236, 'Fixed', 'u4l8-good u4l8-big3');
    const lw = d.wrong.map((t) => lineIn(A, T(t)));
    const lf = d.fix.map((t) => lineIn(B, T(t)));
    const tb = panel(stage, 0, 252, HW, 136, 'Test it', 'u4l8-testp');
    const lt = d.test.map((t) => lineIn(tb, T(t)));
    const rb = div(stage, 'u4l8-rule', `<b>Rule.</b> ${d.rule}`, HW + 16, 252, HW, 136); hide(rb);
    const xs = stampAt(stage, '✗', false, HW - 50, 50, { size: 'lg' }), ok = stampAt(stage, '✓', true, W - 50, 50, { size: 'lg' });
    return [
      { cap: '<b>Is this right?</b> Look for the error before the next step.', run: async (c) => { for (const l of lw) await show(c, l); } },
      { cap: `<b>Test it.</b> ${d.tcap}`, run: async (c) => { for (const l of lt) await show(c, l); await stampIn(c, xs); } },
      { cap: `<b>Fix it.</b> ${d.fcap}`, run: async (c) => { for (const l of lf) await show(c, l); await stampIn(c, ok); } },
      { cap: `<b>The rule:</b> ${d.rule}`, run: (c) => show(c, rb) }
    ];
  }
};

/* ====================================================================================================
 * Box it, wrap it, factor, unwrap: substitution and differences of squares with chunks (Example 2)
 * ==================================================================================================== */
const DOSF = `${cA()}^2-${cB()}^2=(${cA()}-${cB()})(${cA()}+${cB()})`;
const SD = {
  a: { e: '3(x-1)^2+4(x-1)-4', steps: [
    { cap: `<b>Spot the chunk:</b> ${T('(x-1)')} appears twice, once squared.`, t: `=3${bA('(x-1)')}^2+4${bA('(x-1)')}-4` },
    { cap: `<b>Wrap it:</b> let ${T(cA() + '=x-1')}. Now it is an ordinary trinomial in ${T(cA())}.`, t: `${cA()}=x-1:\\quad 3${cA()}^2+4${cA()}-4`, plain: true },
    { cap: `<b>Factor in ${T(cA())}:</b> product ${T('ac=-12')} and sum ${T('4')}: ${T('6')} and ${T('-2')}.`, t: `=(3${cA()}-2)(${cA()}+2)`, note: 'ac=-12:\\ 6+(-2)=4' },
    { cap: `<b>Unwrap in brackets:</b> ${T('(x-1)')} goes back wherever ${T(cA())} was.`, t: `=[3${bA('(x-1)')}-2][${bA('(x-1)')}+2]` },
    { cap: `<b>Simplify each factor:</b> ${T('3x-3-2=3x-5')} and ${T('x-1+2=x+1')}.`, t: '=(3x-3-2)(x-1+2)=(3x-5)(x+1)' }],
    facs: ['3x-5', 'x+1'], again: [], doneCap: 'Both factors are linear.', fin: '(3x-5)(x+1)' },
  b: { e: '9x^4-37x^2+4', steps: [
    { cap: `<b>Spot the chunk:</b> ${T('x^4=(x^2)^2')}, so the chunk is ${T('x^2')}.`, t: `=9\\left(${bA('x^2')}\\right)^2-37${bA('x^2')}+4` },
    { cap: `<b>Wrap it:</b> let ${T(cA() + '=x^2')}.`, t: `${cA()}=x^2:\\quad 9${cA()}^2-37${cA()}+4`, plain: true },
    { cap: `<b>Factor in ${T(cA())}:</b> product ${T('ac=36')} and sum ${T('-37')}: ${T('-36')} and ${T('-1')}.`, t: `=(9${cA()}-1)(${cA()}-4)`, note: 'ac=36:\\ (-36)+(-1)=-37' },
    { cap: `<b>Unwrap:</b> ${T('x^2')} goes back in.`, t: `=(9${bA('x^2')}-1)(${bA('x^2')}-4)=(9x^2-1)(x^2-4)` }],
    facs: ['9x^2-1', 'x^2-4'], again: [{ of: '9x^2-1', res: ['3x-1', '3x+1'], cap: `${T('9x^2-1=(3x)^2-1^2')}: a difference of squares.` },
      { of: 'x^2-4', res: ['x-2', 'x+2'], cap: `${T('x^2-4=x^2-2^2')}: another one.` }], fin: '(3x-1)(3x+1)(x-2)(x+2)' },
  c: { e: '16x^4-81y^4', steps: [
    { cap: `<b>Two terms, subtracted, both squares:</b> ${T('16x^4=(4x^2)^2')} and ${T('81y^4=(9y^2)^2')}.`, t: `=\\left(${bA('4x^2')}\\right)^2-\\left(${bB('9y^2')}\\right)^2` },
    { cap: `<b>The pattern:</b> ${T(DOSF)}.`, t: DOSF, plain: true },
    { cap: `<b>Unwrap:</b> ${T(cA() + '=4x^2')}, ${T(cB() + '=9y^2')}.`, t: `=\\left(${bA('4x^2')}-${bB('9y^2')}\\right)\\left(${bA('4x^2')}+${bB('9y^2')}\\right)` }],
    facs: ['4x^2-9y^2', '4x^2+9y^2'], again: [{ of: '4x^2-9y^2', res: ['2x-3y', '2x+3y'], cap: `${T('4x^2-9y^2=(2x)^2-(3y)^2')}: a difference of squares again.` },
      { of: '4x^2+9y^2', keep: true, cap: `${T('4x^2+9y^2')} is a <b>sum</b> of squares: it does not factor.` }], fin: '(2x-3y)(2x+3y)(4x^2+9y^2)' },
  d: { e: '25(x+1)^2-4(x-2)^2', steps: [
    { cap: `<b>Two squares of chunks:</b> ${T('25(x+1)^2=[5(x+1)]^2')} and ${T('4(x-2)^2=[2(x-2)]^2')}.`, t: `=\\left[${bA('5(x+1)')}\\right]^2-\\left[${bB('2(x-2)')}\\right]^2` },
    { cap: `<b>The pattern:</b> ${T(DOSF)}, with ${T(cA() + '=5(x+1)')} and ${T(cB() + '=2(x-2)')}.`, t: DOSF, plain: true },
    { cap: '<b>Unwrap in brackets:</b> keep each chunk whole.', t: `=\\left[${bA('5(x+1)')}-${bB('2(x-2)')}\\right]\\left[${bA('5(x+1)')}+${bB('2(x-2)')}\\right]` },
    { cap: `<b>Simplify each factor.</b> The minus reaches <b>every</b> term of ${T(cB())}: ${T('-2(x-2)=-2x+4')}.`, t: '=(5x+5-2x+4)(5x+5+2x-4)' },
    { cap: `Collect like terms: ${T('(3x+9)(7x+1)')}.`, t: '=(3x+9)(7x+1)' }],
    facs: ['3x+9', '7x+1'], again: [{ of: '3x+9', res: ['3', 'x+3'], cap: `${T('3x+9')} has a <b>GCF of 3</b>: ${T('3(x+3)')}. Simplifying uncovered it.`, gcf: true }], fin: '3(x+3)(7x+1)' },
  e: { e: '\\dfrac{x^2}{9}-\\dfrac{y^2}{4}', steps: [
    { cap: `<b>Root the top and the bottom:</b> ${T('\\frac{x^2}{9}=\\left(\\frac{x}{3}\\right)^2')} and ${T('\\frac{y^2}{4}=\\left(\\frac{y}{2}\\right)^2')}.`, t: `=\\left(${bA('\\frac{x}{3}')}\\right)^2-\\left(${bB('\\frac{y}{2}')}\\right)^2` },
    { cap: `<b>The pattern:</b> ${T(DOSF)}.`, t: DOSF, plain: true },
    { cap: '<b>Unwrap:</b> the fractions go straight in.', t: `=\\left(${bA('\\frac{x}{3}')}-${bB('\\frac{y}{2}')}\\right)\\left(${bA('\\frac{x}{3}')}+${bB('\\frac{y}{2}')}\\right)` }],
    facs: ['\\frac{x}{3}-\\frac{y}{2}', '\\frac{x}{3}+\\frac{y}{2}'], again: [], doneCap: 'Both factors are linear.', fin: '\\left(\\frac{x}{3}-\\frac{y}{2}\\right)\\left(\\frac{x}{3}+\\frac{y}{2}\\right)' }
};
const subDos = {
  title: 'Box it, wrap it, factor it, unwrap it',
  height: 430, minW: 980,
  choices: [{ sep: 'Example 2 check:' }, ...'abcde'.split('').map((v) => ({ v, label: `(${v})` }))],
  ask: (v) => `Example 2(${v}): factor fully ${T(SD[v].e)}.`,
  make(stage, v, ex) {
    const d = SD[v], W = ex.W, RW = 270, PW = W - RW - 16;
    const P = panel(stage, 0, 4, PW, 420, '', 'u4l8-big4');
    lineIn(P, T(d.e), 'u4l8-eq0').style.opacity = 1;
    const ls = d.steps.map((s) => lineIn(P, `<span class="u4l8-lt">${T(s.t)}</span>${s.note ? `<span class="u4l8-tag">${T(s.note)}</span>` : ''}`, 'u4l8-wl' + (s.plain ? ' u4l8-plainl' : '')));
    const R = panel(stage, W - RW, 4, RW, 420, 'Factor again?', 'u4l8-fa');
    const list = h('div', 'u4l8-falist'); R.appendChild(list);
    const fin = h('div', 'u4l8-fafin', `<div class="u4l8-ph">Factored fully</div>${T(d.fin)}`); R.appendChild(fin); hide(fin);
    const cards = [];
    const mk = (t, before) => { const el = h('div', 'u4l8-fchip', T(t)); if (before) list.insertBefore(el, before); else list.appendChild(el); hide(el); const o = { t, el }; cards.push(o); return el; };
    const steps = d.steps.map((s, i) => ({ cap: s.cap, run: (c) => show(c, ls[i]) }));
    steps.push({ cap: `<b>Factor again?</b> Check each factor.${d.again.length ? '' : ' ' + d.doneCap}`,
      run: async (c) => { for (const t of d.facs) await pop(c, mk(t)); if (!d.again.length) cards.forEach((q) => { q.el.insertAdjacentHTML('beforeend', '<em>✓</em>'); q.el.classList.add('u4l8-done'); }); } });
    d.again.forEach((a) => steps.push({ cap: a.cap,
      run: async (c) => {
        const o = cards.find((q) => q.t === a.of);
        if (a.keep) { o.el.insertAdjacentHTML('beforeend', '<em class="u4l8-stay">stays</em>'); o.el.classList.add('u4l8-done'); await pulse(c, o.el, 1.1); return; }
        o.el.classList.add('u4l8-again'); await pulse(c, o.el, 1.1);
        const news = a.res.map((t, j) => mk(t, o.el)); if (a.gcf) news[0].classList.add('u4l8-gcf');
        o.el.remove(); cards.splice(cards.indexOf(o), 1);
        for (const e of news) await pop(c, e);
      } }));
    steps.push({ cap: `<b>Factored fully:</b> ${T(d.fin)}.`,
      run: async (c) => { cards.forEach((q) => { if (!q.el.querySelector('em')) q.el.insertAdjacentHTML('beforeend', '<em>✓</em>'); q.el.classList.add('u4l8-done'); }); await show(c, fin); } });
    return steps;
  }
};

/* ====================================================================================================
 * Example 3: is it a factor? every k; the perfect-square k
 * ==================================================================================================== */
const KH = {
  a: { e: '2x^2+5x-12', cand: 'x+4', lines: ['#ac=-24:\\ 8+(-3)=5', '=2x^2+8x-3x-12', '=2x(x+4)-3(x+4)', '=(x+4)(2x-3)'], facs: ['x+4', '2x-3'], hit: 0,
    hunt: `product ${T('ac=-24')} and sum ${T('5')}: ${T('8')} and ${T('-3')}. Split, group, factor.`, q: `Is ${T('x+4')} a factor of ${T('2x^2+5x-12')}?` },
  b: { e: '6x^3+x^2-2x', cand: '3x+2', lines: ['=x(6x^2+x-2)', '#ac=-12:\\ 4+(-3)=1', '=x(6x^2+4x-3x-2)', '=x[2x(3x+2)-(3x+2)]', '=x(3x+2)(2x-1)'], facs: ['x', '3x+2', '2x-1'], hit: 1,
    hunt: `GCF ${T('x')} first, then product ${T('ac=-12')} and sum ${T('1')}: ${T('4')} and ${T('-3')}.`, q: `Is ${T('3x+2')} a factor of ${T('6x^3+x^2-2x')}?` }
};
const KPAIRS = [[1, -12], [-1, 12], [2, -6], [-2, 6], [3, -4], [-3, 4]];
const kHunt = {
  title: 'Factors and missing coefficients',
  height: 420, minW: 960,
  choices: [{ sep: 'Example 3 check:' }, ...'abcd'.split('').map((v) => ({ v, label: `(${v})` }))],
  ask: (v) => (KH[v] ? `Example 3(${v}): ${KH[v].q}` : v === 'c' ? `Example 3(c): every integer ${T('k')} so that ${T('x^2+kx-12')} factors.` : `Example 3(d): ${T('k')} so that ${T('9x^2+kx+49')} is a perfect square.`),
  make(stage, v, ex) {
    const W = ex.W;
    if (KH[v]) {
      const d = KH[v], PW = 520;
      const P = panel(stage, 0, 4, PW, 410, '', 'u4l8-big');
      lineIn(P, T(d.e), 'u4l8-eq0').style.opacity = 1;
      const ls = d.lines.map((t) => mline(P, t));
      const RX = PW + 20, RW = W - RX;
      div(stage, 'u4l8-kh', 'Fully factored: the factor cards', RX, 10, RW);
      const row = div(stage, 'u4l8-krow', '', RX, 46, RW, 80);
      const cards = d.facs.map((t) => { const e = h('div', 'u4l8-kcard', T(t)); row.appendChild(e); hide(e); return e; });
      div(stage, 'u4l8-kh', `The candidate`, RX, 180, RW);
      const cand = div(stage, 'u4l8-kcard u4l8-kcand', T(d.cand), RX + RW / 2 - 70, 214, 140); hide(cand);
      const st = stampAt(stage, 'YES: a factor', true, RX + RW / 2, 250, { size: 'sm' });
      return [
        { cap: `<b>Factor fully first.</b> ${d.hunt}`, run: async (c) => { for (const l of ls) await show(c, l); } },
        { cap: `The fully factored form gives the <b>factor cards</b>: ${d.facs.map((t) => T(t)).join(', ')}.`, run: async (c) => { for (const e of cards) await pop(c, e); } },
        { cap: `Slide the candidate ${T(d.cand)} over the cards…`, run: async (c) => { await show(c, cand); } },
        { cap: `It matches a card: <b>yes</b>, ${T(d.cand)} is a factor of ${T(d.e)}.`,
          run: async (c) => {
            const t = cards[d.hit];
            await anim(c, cand, [{ left: cand.style.left, top: cand.style.top, width: cand.style.width }, { left: (RX + t.offsetLeft) + 'px', top: (46 + t.offsetTop) + 'px', width: t.offsetWidth + 'px' }], 700);
            t.classList.add('u4l8-hit'); cand.classList.add('u4l8-hit'); await stampIn(c, st);
          } }
      ];
    }
    if (v === 'c') {
      const tb = new ValueTable(stage, { x: 10, y: 8, headers: ['\\text{pair }m,\\ n', 'm\\times n', 'k=m+n'], rows: KPAIRS.map(([m, n]) => [`${m},\\ ${n}`, '-12', String(m + n)]), hide: () => true, tap: false, cellW: 150, cellH: 50 });
      const NX = 500, N = new NumberLine(stage, { x: NX, y: 30, width: W - NX, height: 110, min: -12, max: 12, step: 1, labelStep: 4 });
      div(stage, 'u4l8-kh', `Every possible ${T('k')}`, NX + 20, 6, 300);
      const dots = KPAIRS.map(([m, n]) => { const p = N.point(m + n, { label: T(String(m + n)), color: GCF }); hideP(p); return p; });
      const P = panel(stage, NX, 160, W - NX, 250, '', 'u4l8-big');
      const l1 = lineIn(P, `<b>${T('k=\\pm11,\\ \\pm4,\\ \\pm1')}</b>`, 'u4l8-ansl');
      const l2 = lineIn(P, T('k=11:\\ x^2+11x-12=(x+12)(x-1)'));
      const l3 = lineIn(P, T('k=-4:\\ x^2-4x-12=(x-6)(x+2)'));
      return [
        { cap: `List <b>every</b> pair of integers with product ${T('-12')}: one positive, one negative.`, run: async (c) => { for (let r = 0; r < 6; r++) { tb.reveal(r, 0, c); tb.reveal(r, 1, c); await sleep(c, 160); } } },
        { cap: `Each pair’s <b>sum</b> is a value of ${T('k')} that works: ${KPAIRS.map(([m, n]) => T(String(m + n))).join(', ')}.`,
          run: async (c) => { for (let r = 0; r < 6; r++) { tb.reveal(r, 2, c); await popP(c, dots[r]); } } },
        { cap: `Six pairs, six values, in ${T('\\pm')} pairs: ${T('k=\\pm11,\\ \\pm4,\\ \\pm1')}.`, run: (c) => show(c, l1) },
        { cap: `Check two: ${T('k=11')} uses ${T('12')} and ${T('-1')}; ${T('k=-4')} uses ${T('-6')} and ${T('2')}.`, run: async (c) => { await show(c, l2); await show(c, l3); } }
      ];
    }
    // (d) the perfect-square area model
    const S = 330, a = 220, b = S - a, X0 = 40, Y0 = 46;
    const svg = svgEl('svg', { width: 460, height: 420, class: 'u4l8-sqsvg' }, stage);
    const rect = (x, y, w, hh, fill) => svgEl('rect', { x: X0 + x, y: Y0 + y, width: w, height: hh, fill, stroke: '#1c2230', 'stroke-width': 2.5 }, svg);
    const parts = [rect(0, 0, a, a, '#e6eefc'), rect(a, 0, b, a, '#fff4dd'), rect(0, a, a, b, '#fff4dd'), rect(a, a, b, b, '#e8f5ef')];
    parts.forEach(hide);
    const lab = (x, y, t, cls = '') => { const e = div(stage, 'u4l8-sqlab ' + cls, T(t), X0 + x, Y0 + y); e.style.translate = '-50% -50%'; return hide(e); };
    const sideT = [lab(a / 2, -20, '3x'), lab(a + b / 2, -20, '7'), lab(-20, a / 2, '3x'), lab(-20, a + b / 2, '7')];
    const inT = [lab(a / 2, a / 2, '9x^2', 'u4l8-sqbig'), lab(a + b / 2, a / 2, '21x'), lab(a / 2, a + b / 2, '21x'), lab(a + b / 2, a + b / 2, '49')];
    const P = panel(stage, 480, 4, W - 480, 410, '', 'u4l8-big');
    const ls = ['9x^2=(3x)^2,\\quad 49=7^2', '(3x+7)^2=9x^2+21x+21x+49', '=9x^2+42x+49\\ \\Rightarrow\\ k=42', '(3x-7)^2=9x^2-42x+49\\ \\Rightarrow\\ k=-42'].map((t, i) => lineIn(P, T(t), i === 3 ? 'u4l8-negl' : ''));
    const fin = lineIn(P, `<b>${T('k=42')}</b> or <b>${T('k=-42')}</b>`, 'u4l8-ansl');
    return [
      { cap: `First and last terms are squares: ${T('9x^2=(3x)^2')} and ${T('49=7^2')}. So try ${T('(3x+7)^2')}.`, run: (c) => show(c, ls[0]) },
      { cap: `Build ${T('(3x+7)^2')} as a square of side ${T('3x+7')}.`, run: async (c) => { for (const e of sideT) await show(c, e); for (const p of parts) await fadeIn(c, p, 300); } },
      { cap: `The four pieces: ${T('9x^2')}, two rectangles of ${T('21x')}, and ${T('49')}.`, run: async (c) => { for (const e of inT) await pop(c, e); await show(c, ls[1]); } },
      { cap: `The middle term is ${T('21x+21x=42x')} (that is ${T('2AB=2(3x)(7)')}), so ${T('k=42')}.`, run: async (c) => { await pulse(c, inT[1], 1.3); await pulse(c, inT[2], 1.3); await show(c, ls[2]); } },
      { cap: `${T('(3x-7)^2')} works too: the two rectangles are ${T('-21x')} each, so ${T('k=-42')}.`, run: async (c) => { inT[1].innerHTML = T('-21x'); inT[2].innerHTML = T('-21x'); inT[1].classList.add('u4l8-xr'); inT[2].classList.add('u4l8-xr'); sideT[1].innerHTML = T('-7'); sideT[3].innerHTML = T('-7'); await show(c, ls[3]); await show(c, fin); } }
    ];
  }
};

/* ====================================================================================================
 * Roots, zeros, x-intercepts (Example 5) and equations from roots
 * ==================================================================================================== */
const RG = {
  a: { label: '5(a)', ask: `Example 5(a): the zeros of ${T('y=2x^2-x-6')} and the ${T('x')}-intercepts.`, mode: 'zeros', f: (x) => 2 * x * x - x - 6, ft: '2x^2-x-6',
    lines: ['2x^2-x-6=0', '#ac=-12:\\ -4+3=-1', '2x(x-2)+3(x-2)=0', '(x-2)(2x+3)=0'], roots: [[2, '2', 'ne'], [-1.5, '-\\frac{3}{2}', 'nw']],
    win: { xmin: -4, xmax: 4, ymin: -8, ymax: 8, ylabels: 2 } },
  d: { label: '4(d) double root', ask: `Example 4(d): ${T('4x^2+20x+25=0')} on a graph.`, mode: 'zeros', f: (x) => 4 * x * x + 20 * x + 25, ft: '4x^2+20x+25',
    lines: ['4x^2+20x+25=0', '#(2x)^2+2(2x)(5)+5^2', '(2x+5)^2=0'], roots: [[-2.5, '-\\frac{5}{2}', 'se']], double: true,
    win: { xmin: -5, xmax: 1, ymin: -2, ymax: 10, xstep: 0.5, xlabels: 1, ylabels: 2 } },
  b: { label: '5(b)', ask: `Example 5(b): an equation with integer coefficients whose roots are ${T('\\frac{2}{3}')} and ${T('-5')}.`, mode: 'from', roots: [[2 / 3, '\\frac{2}{3}', 'ne'], [-5, '-5', 'nw']],
    facs: ['x=\\frac{2}{3}\\Rightarrow3x=2\\Rightarrow3x-2=0', 'x=-5\\Rightarrow x+5=0'], prod: ['(3x-2)(x+5)=0', '3x^2+15x-2x-10=0', '3x^2+13x-10=0'],
    f: (x) => 3 * x * x + 13 * x - 10, ft: '3x^2+13x-10', fcap: `${T('x=\\frac{2}{3}')}: multiply by 3 to clear the fraction, then move it over: the factor is ${T('(3x-2)')}. And ${T('x=-5')} gives ${T('(x+5)')}.`,
    win: { xmin: -7, xmax: 3, ymin: -26, ymax: 10, ystep: 2, ylabels: 4 } },
  c: { label: T('\\text{roots }\\tfrac12,\\ 4'), ask: `Write a quadratic equation with integer coefficients whose roots are ${T('\\frac{1}{2}')} and ${T('4')}.`, mode: 'from', roots: [[0.5, '\\frac{1}{2}', 'nw'], [4, '4', 'ne']],
    facs: ['x=\\frac{1}{2}\\Rightarrow2x=1\\Rightarrow2x-1=0', 'x=4\\Rightarrow x-4=0'], prod: ['(2x-1)(x-4)=0', '2x^2-8x-x+4=0', '2x^2-9x+4=0'],
    f: (x) => 2 * x * x - 9 * x + 4, ft: '2x^2-9x+4', fcap: `${T('x=\\frac{1}{2}')} gives ${T('(2x-1)')} (a root ${T('\\frac{p}{q}')} gives ${T('(qx-p)')}); ${T('x=4')} gives ${T('(x-4)')}.`,
    win: { xmin: -2, xmax: 6, ymin: -8, ymax: 8, ylabels: 2 } }
};
const rootsGraph = {
  title: 'Roots = zeros = x-intercepts',
  height: 420, minW: 960,
  choices: [{ sep: 'Check:' }, ...['a', 'b', 'd'].map((v) => ({ v, label: RG[v].label })), { sep: 'Review:' }, { v: 'c', label: RG.c.label }],
  ask: (v) => RG[v].ask,
  make(stage, v, ex) {
    const d = RG[v], W = ex.W, GW = 440;
    const G = new Graph(stage, Object.assign({ x: 0, y: 6, width: GW, height: 408, fontSize: 15 }, d.win));
    const cv = G.fn(d.f, { color: BLU, width: 4 }); cv.style.opacity = 0;
    const glab = G.label(d.win.xmin + 0.04 * (d.win.xmax - d.win.xmin), d.win.ymax - 0.04 * (d.win.ymax - d.win.ymin), T(`y=${d.ft}`), { pos: 'se', cls: 'u4l8-glab' }); hide(glab);
    const pts = d.roots.map(([x, t, pos]) => hideP(G.point(x, 0, { label: T(`(${t},\\,0)`), pos, color: GCF })));
    const P = panel(stage, GW + 24, 4, W - GW - 24, 410, '', 'u4l8-big');
    const names = h('div', 'u4l8-names'); hide(names);
    const rts = d.roots.map((r) => r[1]).join(',\\ ');
    names.innerHTML = `<div><b>roots</b> of ${T(`${d.ft}=0`)}: ${T(rts)}</div><div><b>zeros</b> of ${T(`y=${d.ft}`)}: ${T(rts)}</div><div><b>${T('x')}-intercepts</b>: ${d.roots.map((r) => T(`(${r[1]},\\,0)`)).join(' and ')}</div>`;
    if (d.mode === 'zeros') {
      const ls = d.lines.map((t) => mline(P, t)); P.appendChild(names);
      return [
        { cap: `The graph of ${T(`y=${d.ft}`)}. Where does it meet the ${T('x')}-axis? Set ${T('y=0')} and solve.`, run: async (c) => { await show(c, glab); await drawOn(c, G, cv, 900); } },
        { cap: d.double ? `A <b>perfect square</b>: ${T('(2x+5)^2=0')}, one root ${T('x=-\\frac{5}{2}')}.` : `Decomposition: product ${T('-12')}, sum ${T('-1')}: ${T('-4')} and ${T('3')}. So ${T('x=2')} or ${T('x=-\\frac{3}{2}')}.`,
          run: async (c) => { for (const l of ls) await show(c, l); } },
        { cap: d.double ? `A double root: the vertex sits <b>on</b> the ${T('x')}-axis, so the graph <b>touches</b> at ${T('(-\\frac{5}{2},\\,0)')} without crossing.`
          : `The same two numbers, three names: <b>roots</b>, <b>zeros</b>, <b>${T('x')}-intercepts</b> ${T('(2,\\,0)')} and ${T('\\left(-\\frac{3}{2},\\,0\\right)')}.`,
          run: async (c) => { for (const p of pts) await popP(c, p); await show(c, names); } }
      ];
    }
    const lf = d.facs.map((t) => lineIn(P, T(t))), lp = d.prod.map((t, i) => lineIn(P, T(t), i === d.prod.length - 1 ? 'u4l8-ansl' : ''));
    P.appendChild(names);
    return [
      { cap: `Start from the roots: ${d.roots.map((r) => T(r[1])).join(' and ')} on the ${T('x')}-axis.`, run: async (c) => { for (const p of pts) await popP(c, p); } },
      { cap: `<b>Root → factor.</b> ${d.fcap}`, run: async (c) => { for (const l of lf) await show(c, l); } },
      { cap: `<b>Multiply the factors</b> and set the product to 0: ${T(`${d.ft}=0`)}.`, run: async (c) => { for (const l of lp) await show(c, l); } },
      { cap: `Its graph crosses the ${T('x')}-axis at exactly those roots. (Any multiple of the equation has the same roots.)`, run: async (c) => { await show(c, glab); await drawOn(c, G, cv, 900); await show(c, names); } }
    ];
  }
};

/* ====================================================================================================
 * Example 6: the picture frame to scale
 * ==================================================================================================== */
const frame = {
  title: 'The picture frame',
  height: 420, minW: 960,
  choices: [{ sep: 'Example 6 check:' }, { v: 'f', label: 'the frame' }],
  ask: () => `Example 6: a 20 cm by 30 cm photo, a frame of width ${T('x')}, total area ${T('1\\,064')} cm².`,
  make(stage, v, ex) {
    const W = ex.W, SC = 9, CX = 230, CY = 190;
    const svg = svgEl('svg', { width: 470, height: 420, class: 'u4l8-frsvg' }, stage);
    const outer = svgEl('rect', { fill: '#8a5a33', stroke: '#5b3a1f', 'stroke-width': 3, rx: 3 }, svg);
    const photo = svgEl('g', {}, svg);
    svgEl('rect', { x: CX - 15 * SC, y: CY - 10 * SC, width: 30 * SC, height: 20 * SC, fill: '#cfe6f7' }, photo);
    svgEl('path', { d: `M${CX - 15 * SC} ${CY + 10 * SC} L${CX - 70} ${CY - 20} L${CX - 20} ${CY + 30} L${CX + 40} ${CY - 40} L${CX + 15 * SC} ${CY + 30} L${CX + 15 * SC} ${CY + 10 * SC} Z`, fill: '#6aa84f' }, photo);
    svgEl('circle', { cx: CX + 90, cy: CY - 50, r: 16, fill: '#f2c14e' }, photo);
    const lp = (x, y, t, cls = '') => { const e = div(stage, 'u4l8-frlab ' + cls, T(t), x, y); e.style.translate = '-50% -50%'; return e; };
    lp(CX, CY - 10 * SC + 16, '30'); lp(CX - 15 * SC + 18, CY, '20');
    const lw = lp(CX, 0, 'x', 'u4l8-frx'), lh = lp(0, CY, 'x', 'u4l8-frx');
    const lo1 = lp(CX, 0, '30+2x', 'u4l8-frout'), lo2 = lp(0, CY, '20+2x', 'u4l8-frout');
    const read = div(stage, 'u4l8-frread', '', 10, 372, 450, 40);
    const setX = (xw, num = false) => {
      const w = (30 + 2 * xw) * SC, hh = (20 + 2 * xw) * SC;
      outer.setAttribute('x', CX - w / 2); outer.setAttribute('y', CY - hh / 2); outer.setAttribute('width', w); outer.setAttribute('height', hh);
      lw.style.top = (CY - 10 * SC - xw * SC / 2) + 'px'; lh.style.left = (CX - 15 * SC - xw * SC / 2) + 'px';
      lo1.style.top = (CY + hh / 2 + 18) + 'px'; lo2.style.left = (CX + w / 2 + 34) + 'px';
      const A = (20 + 2 * xw) * (30 + 2 * xw), xs = Math.round(xw * 100) / 100;
      read.innerHTML = num ? T(`x=${xs}:\\ (${20 + 2 * xs})(${30 + 2 * xs})=${Math.round(A).toLocaleString('en-CA').replace(/,/g, '\\,')}\\text{ cm}^2`) : T('\\text{Area}=(20+2x)(30+2x)');
    };
    setX(3);
    hide(lw); hide(lh); hide(lo1); hide(lo2); hide(read); outer.style.opacity = 0;
    const P = panel(stage, 490, 4, W - 490, 410, '', 'u4l8-big');
    const ls = ['(20+2x)(30+2x)=1\\,064', '600+100x+4x^2=1\\,064', '4x^2+100x-464=0', '4(x^2+25x-116)=0', '4(x+29)(x-4)=0'].map((t) => lineIn(P, T(t)));
    const lr = lineIn(P, `${T('x=4')} &nbsp; or &nbsp; <span class="u4l8-strike">${T('x=-29')}</span>`, 'u4l8-ansl');
    const lc = lineIn(P, `Check: ${T('28\\times38=1\\,064')} ✓<br>The frame is <b>4 cm</b> wide.`, 'u4l8-okl');
    const no = stampAt(stage, 'INADMISSIBLE', false, W - 105, 238, { size: 'sm' }), ok = stampAt(stage, '✓ 1 064 cm²', true, 390, 26, { size: 'sm' });
    return [
      { cap: `<b>Sketch it.</b> The frame adds ${T('x')} on <b>both</b> sides, so the outside is ${T('(30+2x)')} by ${T('(20+2x)')}.`,
        run: async (c) => { await fadeIn(c, outer, 400); for (const e of [lw, lh, lo1, lo2, read]) await show(c, e); } },
      { cap: `Try a width: ${T('x=2')} gives ${T('24\\times34=816')} cm², too small. Let algebra find it exactly.`,
        run: async (c) => { await tween(c, 900, (t) => setX(3 - t, true)); } },
      { cap: `<b>The equation:</b> the outside area is ${T('1\\,064')}: ${T('(20+2x)(30+2x)=1\\,064')}.`, run: async (c) => { await show(c, ls[0]); } },
      { cap: `<b>Expand</b> and get <b>0 on one side</b>: ${T('4x^2+100x-464=0')}.`, run: async (c) => { await show(c, ls[1]); await show(c, ls[2]); } },
      { cap: `<b>GCF 4</b>, then product ${T('-116')} and sum ${T('25')}: ${T('29')} and ${T('-4')}.`, run: async (c) => { await show(c, ls[3]); await show(c, ls[4]); } },
      { cap: `${T('x=4')} or ${T('x=-29')}. A frame can’t be ${T('-29')} cm wide: that root is <b class="u4l8-xr">inadmissible</b>.`, run: async (c) => { await show(c, lr); await stampIn(c, no); } },
      { cap: `<b>Check in the story:</b> ${T('x=4')} makes the outside ${T('28')} by ${T('38')}, and ${T('28\\times38=1\\,064')} ✓. The frame is 4 cm wide.`,
        run: async (c) => { await tween(c, 900, (t) => setX(2 + 2 * t, true)); await show(c, lc); await stampIn(c, ok); } }
    ];
  }
};

/* ====================================================================================================
 * Each side as a graph: the root is where they meet; the extraneous root lives on the mirror
 * ==================================================================================================== */
const RGR = {
  b: { label: '7(b)', ask: `Example 7(b): ${T('\\sqrt{x+8}+4=x')} as two graphs.`, f1: (x) => Math.sqrt(x + 8) + 4, from: -8, s0: [-8, 4], t1: 'y=\\sqrt{x+8}+4', f2: (x) => x, t2: 'y=x',
    mir: (x) => 4 - Math.sqrt(x + 8), tm: 'y=4-\\sqrt{x+8}', root: [8, 8], fake: [1, 1], win: { xmin: -9, xmax: 11, ymin: -4, ymax: 12, xlabels: 2, ylabels: 2 },
    mcap: `Squaring ${T('\\sqrt{x+8}=x-4')} also accepts ${T('-\\sqrt{x+8}=x-4')}: the <b>mirror</b> graph ${T('y=4-\\sqrt{x+8}')}.`,
    alg: ['\\sqrt{x+8}=x-4', 'x+8=x^2-8x+16', '0=(x-1)(x-8)'], okT: 'x=8', fakeT: 'x=1' },
  e8: { label: '8(c)', ask: `Example 8: ${T('\\sqrt{2x+1}-\\sqrt{x+4}=1')} as two graphs.`, f1: (x) => Math.sqrt(2 * x + 1) - Math.sqrt(x + 4), from: -0.5, s0: [-0.5, -Math.sqrt(3.5)], t1: 'y=\\sqrt{2x+1}-\\sqrt{x+4}', f2: () => 1, t2: 'y=1',
    mline: -1, tm: 'y=-1', root: [12, 1], fake: [0, -1], win: { xmin: -2, xmax: 16, ymin: -3, ymax: 3, xlabels: 2 },
    mcap: `Squaring can’t tell ${T('1')} from ${T('-1')}: the squared equations also hold where the left side is ${T('-1')}.`,
    alg: ['x(x-12)=0', 'x=0\\ \\text{or}\\ x=12'], okT: 'x=12', fakeT: 'x=0' },
  neg: { label: T('\\sqrt{x}=-3'), ask: `${T('\\sqrt{x}=-3')} as two graphs.`, f1: (x) => Math.sqrt(x), from: 0, s0: [0, 0], t1: 'y=\\sqrt{x}', f2: () => -3, t2: 'y=-3',
    mir: (x) => -Math.sqrt(x), tm: 'y=-\\sqrt{x}', root: null, fake: [9, -3], win: { xmin: -1, xmax: 12, ymin: -5, ymax: 5 },
    mcap: `Squaring gives ${T('x=9')}, which also solves ${T('-\\sqrt{x}=-3')}: the mirror graph ${T('y=-\\sqrt{x}')}.`, alg: ['x=9'], fakeT: 'x=9' },
  rev: { label: T('\\sqrt{x+7}=x+1'), ask: `${T('\\sqrt{x+7}=x+1')} as two graphs.`, f1: (x) => Math.sqrt(x + 7), from: -7, s0: [-7, 0], t1: 'y=\\sqrt{x+7}', f2: (x) => x + 1, t2: 'y=x+1',
    mir: (x) => -Math.sqrt(x + 7), tm: 'y=-\\sqrt{x+7}', root: [2, 3], fake: [-3, -2], win: { xmin: -8, xmax: 5, ymin: -5, ymax: 6 },
    mcap: `Squaring also accepts ${T('-\\sqrt{x+7}=x+1')}: the mirror graph ${T('y=-\\sqrt{x+7}')}.`, alg: ['x+7=x^2+2x+1', '0=(x+3)(x-2)'], okT: 'x=2', fakeT: 'x=-3' }
};
const radGraph = {
  title: 'Two sides, two graphs',
  height: 420, minW: 960,
  choices: [{ sep: 'Check:' }, { v: 'b', label: RGR.b.label }, { v: 'e8', label: RGR.e8.label }, { sep: 'Concept:' }, { v: 'neg', label: RGR.neg.label }, { v: 'rev', label: RGR.rev.label }],
  ask: (v) => RGR[v].ask,
  make(stage, v, ex) {
    const d = RGR[v], W = ex.W, GW = 560;
    const G = new Graph(stage, Object.assign({ x: 0, y: 6, width: GW, height: 408, fontSize: 15 }, d.win));
    const c1 = G.fn(d.f1, { color: PUR, width: 4, from: d.from }); c1.style.opacity = 0;
    const s0 = hideP(G.point(d.s0[0], d.s0[1], { color: PUR, r: 6 }));
    const c2 = G.fn(d.f2, { color: BLU, width: 4 }); c2.style.opacity = 0;
    const cm = d.mline != null ? G.hline(d.mline, { color: RED, width: 3 }) : G.fn(d.mir, { color: RED, width: 3, dash: true, from: d.from });
    cm.style.opacity = 0;
    const rp = d.root ? hideP(G.point(d.root[0], d.root[1], { label: T(`(${d.root[0]},\\,${d.root[1]})\\ \\checkmark`), pos: 'nw', color: GRN, labelColor: GRN })) : null;
    const fp = hideP(G.point(d.fake[0], d.fake[1], { label: T(`(${d.fake[0]},\\,${d.fake[1]})\\ \\times`), pos: 'se', color: RED, labelColor: RED }));
    const P = panel(stage, GW + 20, 4, W - GW - 20, 410, '', 'u4l8-big5');
    const key = (col, t) => lineIn(P, `<span class="u4l8-key" style="background:${col}"></span>${T(t)}`, 'u4l8-keyl');
    const k1 = key(PUR, d.t1), k2 = key(BLU, d.t2), k3 = key(RED, d.tm);
    const la = d.alg.map((t) => lineIn(P, T(t), 'u4l8-note'));
    const lok = lineIn(P, d.root ? `<span class="u4l8-ok">${T(d.okT)}</span>: the graphs meet ✓` : '<span class="u4l8-xr">The graphs never meet: no solution.</span>');
    const lfk = lineIn(P, `<span class="u4l8-xr">${T(d.fakeT)}</span>: only the mirror meets: <b class="u4l8-xr">✗ extraneous</b>`);
    return [
      { cap: `<b>Left side:</b> ${T(d.t1)}. It starts at ${T(`x=${d.s0[0] === -0.5 ? '-\\frac{1}{2}' : d.s0[0]}`)} (the restriction).`, run: async (c) => { await show(c, k1); await popP(c, s0); await drawOn(c, G, c1, 900); } },
      { cap: `<b>Right side:</b> ${T(d.t2)}.`, run: async (c) => { await show(c, k2); await drawOn(c, G, c2, 700); } },
      { cap: d.root ? `They meet at ${T(`(${d.root[0]},\\,${d.root[1]})`)}: ${T(d.okT)} is the <b>root</b>.` : `They <b>never meet</b>: ${T('\\sqrt{x}')} is never negative. No solution.`,
        run: async (c) => { for (const l of la) await show(c, l); if (rp) await popP(c, rp); await show(c, lok); } },
      { cap: d.mcap, run: async (c) => { await show(c, k3); cm.style.opacity = ''; await G.drawIn(cm, 800, c); } },
      { cap: `That meets ${T(d.t2)} at ${T(`(${d.fake[0]},\\,${d.fake[1]})`)}: ${T(d.fakeT)} solves the <b>squared</b> equation but not the original. <b class="u4l8-xr">Extraneous.</b>`,
        run: async (c) => { await popP(c, fp); await show(c, lfk); } }
    ];
  }
};

/* ====================================================================================================
 * Two radicals: square twice (Example 8(c))
 * ==================================================================================================== */
const RAIL2 = ['Restrictions', 'Isolate one', 'Square', 'Isolate again', 'Square again', 'Solve', 'Verify'];
const TR = {
  e8: { label: '8(c)', eq: '\\sqrt{2x+1}-\\sqrt{x+4}=1', nl: { min: -6, max: 14 }, R: [[-4, 'x\\ge-4', GRAY, 0], [-0.5, 'x\\ge-\\frac{1}{2}', GRN, 16]], R2: [4, 'x\\ge4', AMB, 32],
    rcap: `${T('2x+1\\ge0\\Rightarrow x\\ge-\\frac12')} and ${T('x+4\\ge0\\Rightarrow x\\ge-4')}. Both hold when ${T('x\\ge-\\frac12')}.`,
    iso: '\\sqrt{2x+1}=1+\\sqrt{x+4}', sq: ['2x+1=\\left(1+\\sqrt{x+4}\\right)^2', `2x+1=1+${K(AMB, '2\\sqrt{x+4}')}+x+4`],
    sqcap: `The right side is a <b>binomial</b>: ${T('(1+\\sqrt{x+4})^2=1+2\\sqrt{x+4}+(x+4)')}. The middle term still has a radical.`,
    iso2: 'x-4=2\\sqrt{x+4}', i2cap: `Collect: ${T('x-4=2\\sqrt{x+4}')}. The side opposite must be ${T('\\ge0')}, so ${T('x\\ge4')} too.`,
    sq2: ['x^2-8x+16=4(x+4)=4x+16'], s2cap: `Square again, coefficient too: ${T('(2\\sqrt{x+4})^2=4(x+4)')}.`,
    solve: ['x^2-12x=0\\Rightarrow x(x-12)=0', 'x=0\\ \\text{or}\\ x=12'], scap: `${T('x(x-12)=0')}: ${T('x=0')} or ${T('x=12')}.`,
    cands: [{ x: '12', L: ['\\sqrt{25}-\\sqrt{16}', '1'], R: ['1'], ok: true }, { x: '0', L: ['\\sqrt{1}-\\sqrt{4}', '-1'], R: ['1'], ok: false, note: `(It also breaks ${T('x\\ge4')}.)` }], fin: 'x=12' },
  rev: { label: T('\\sqrt{x+5}-\\sqrt{x}=1'), eq: '\\sqrt{x+5}-\\sqrt{x}=1', nl: { min: -7, max: 7 }, R: [[-5, 'x\\ge-5', GRAY, 0], [0, 'x\\ge0', GRN, 16]], R2: null,
    rcap: `${T('x+5\\ge0')} and ${T('x\\ge0')}: both hold when ${T('x\\ge0')}.`,
    iso: '\\sqrt{x+5}=1+\\sqrt{x}', sq: ['x+5=\\left(1+\\sqrt{x}\\right)^2', `x+5=1+${K(AMB, '2\\sqrt{x}')}+x`], sqcap: `${T('(1+\\sqrt{x})^2=1+2\\sqrt{x}+x')}: the middle term keeps a radical.`,
    iso2: '4=2\\sqrt{x}\\Rightarrow\\sqrt{x}=2', i2cap: `The ${T('x')} terms cancel: ${T('4=2\\sqrt{x}')}, so ${T('\\sqrt{x}=2')}.`,
    sq2: ['x=4'], s2cap: `Square again: ${T('x=4')}.`, solve: [], scap: 'Nothing left to solve.',
    cands: [{ x: '4', L: ['\\sqrt{9}-\\sqrt{4}', '3-2', '1'], R: ['1'], ok: true }], fin: 'x=4' }
};
const twoRad = {
  title: 'Square, isolate, square again',
  height: 430, minW: 980, capH: 84,
  choices: [{ sep: 'Check:' }, { v: 'e8', label: 'Example 8(c)' }, { sep: 'Review:' }, { v: 'rev', label: TR.rev.label }],
  ask: (v) => `Solve and verify ${T(TR[v].eq)}.`,
  make(stage, v, ex) {
    const d = TR[v], W = ex.W, VW = 290, VX = W - VW, PX = 186, PW = VX - PX - 12;
    const R = rail(stage, 0, 4, 172, RAIL2);
    R.el.classList.add('u4l8-rail7');
    const N = new NumberLine(stage, { x: PX, y: 0, width: PW, height: 114, min: d.nl.min, max: d.nl.max, step: 1, labelStep: 2, axisY: 78 });
    const ivs = [...d.R, ...(d.R2 ? [d.R2] : [])].map(([a, t, col, lift]) => {
      const iv = N.interval(a, Infinity, { color: col, lift: lift + 8, width: 6 }); iv.style.opacity = 0;
      const lb = N.mark(a, T(t), { lift: lift + 4, color: col, cls: 'u4l8-nlab', pos: 'n' }); lb.style.top = (N.ay - lift - 8) + 'px'; lb.style.translate = 'calc(-100% - 12px) -50%'; hide(lb); return { iv, lb };
    });
    const P = panel(stage, PX, 114, PW, 312, '', 'u4l8-big6');
    lineIn(P, T(d.eq), 'u4l8-eq0').style.opacity = 1;
    const li = workLine(P, d.iso, 'isolate'), ls = d.sq.map((t, i) => workLine(P, t, i ? '' : 'square'));
    const li2 = workLine(P, d.iso2, 'isolate'), ls2 = d.sq2.map((t, i) => workLine(P, t, i ? '' : 'square again'));
    const lv = d.solve.map((t) => workLine(P, t, ''));
    const vs = verifySteps(stage, d.cands, VX, VW, 4, 212);
    const ivShow = async (c, k) => { ivs[k].iv.style.opacity = ''; await N.drawIn(ivs[k].iv, 500, c); await show(c, ivs[k].lb); };
    const steps = [
      { cap: `<b>1. Restrictions.</b> ${d.rcap}`, run: async (c) => { await R.go(c, 0); await ivShow(c, 0); await ivShow(c, 1); } },
      { cap: '<b>2. Isolate one radical:</b> move the other to the right side.', run: async (c) => { await R.go(c, 1); await show(c, li); } },
      { cap: `<b>3. Square both sides.</b> ${d.sqcap}`, run: async (c) => { await R.go(c, 2); for (const l of ls) await show(c, l); } },
      { cap: `<b>4. Isolate the radical that is left.</b> ${d.i2cap}`, run: async (c) => { await R.go(c, 3); await show(c, li2); if (d.R2) await ivShow(c, 2); } },
      { cap: `<b>5. Square again.</b> ${d.s2cap}`, run: async (c) => { await R.go(c, 4); for (const l of ls2) await show(c, l); } },
      { cap: `<b>6. Solve.</b> ${d.scap}`, run: async (c) => { await R.go(c, 5); for (const l of lv) await show(c, l); } }
    ];
    vs.forEach(({ k, card, st }, i) => steps.push({
      cap: `<b>7. Verify ${T('x=' + k.x)}:</b> ${k.ok ? `${T(k.L[0] + '=' + k.L[k.L.length - 1])} ✓ A root.` : `${T(k.L[0] + '=' + k.L[k.L.length - 1] + '\\ne1')}. <b class="u4l8-xr">Extraneous.</b> ${k.note || ''}`}`,
      run: async (c) => { await R.go(c, 6); await card.play(c); st.place(); await stampIn(c, st); if (i === vs.length - 1) R.pills[6].classList.add('done'); } }));
    steps.push({ cap: `<b>The root is ${T(d.fin)}.</b>`, run: async (c) => { await pulse(c, vs[0].card, 1.03); } });
    return steps;
  }
};

/* ====================================================================================================
 * Stand Up Break
 * ==================================================================================================== */
standup('u4l8', {
  intro: 'At your whiteboard: factor fully, solve, and verify. GCF first; check every root!',
  levels: {
    BEG: (r) => { // k(x − p)(x − q), factor fully
      const p = r.int(-9, 9) || 2, q = r.int(-9, 9) || -3, k = r.pick([1, 1, 2, 3, 5]);
      const b = -(p + q), c = p * q, tri = poly([1, b, c], ['x^2', 'x', '']);
      const f = (s) => (s === 0 ? 'x' : `(${lin(1, -s)})`);
      const facs = p === q ? `${f(p)}^2` : `${f(p)}${f(q)}`;
      return { text: 'Factor fully.', q: poly([k, k * b, k * c], ['x^2', 'x', '']),
        a: k === 1 ? [`=${facs}`] : [`=${k}(${tri})`, `=${k}${facs}`] };
    },
    PRG: (r) => { // (a x + m)(x + n) = 0 by decomposition
      let a, m; do { a = r.pick([2, 3, 4, 5, 6]); m = r.int(-7, 7); } while (!m || gcd(a, m) !== 1);
      const n = r.int(-8, 8) || 4, B = a * n + m, C = m * n;
      return { text: 'Solve by factoring.', q: `${poly([a, B, C], ['x^2', 'x', ''])}=0`,
        a: [`ac=${a * C}:\\ ${a * n}+(${m})=${B}`, `(${lin(a, m)})(${lin(1, n)})=0`, `x=${frac(-m, a)}\\ \\text{or}\\ x=${-n}`] };
    },
    MAS: (r) => {
      if (r.chance(0.5)) { // √(x + b) = x + d with one root and one extraneous root
        for (let tries = 0; tries < 200; tries++) {
          const rt = r.int(0, 8), s = r.int(-8, rt - 1);
          if ((rt + s) % 2 === 0) continue;
          const d = (1 - rt - s) / 2, b = d * d - rt * s;
          if (rt + d < 0 || s + d >= 0 || s + b < 0) continue;
          return { text: 'Solve and verify. Identify any extraneous root.', q: `\\sqrt{${lin(1, b)}}=${lin(1, d)}`,
            a: [`${lin(1, b)}=${poly([1, 2 * d, d * d], ['x^2', 'x', ''])}`, `0=${poly([1, 2 * d - 1, d * d - b], ['x^2', 'x', ''])}=(${lin(1, -rt)})(${lin(1, -s)})`,
              `x=${rt}:\\ \\sqrt{${rt + b}}=${rt + d}\\ \\checkmark`, `x=${s}:\\ \\sqrt{${s + b}}=${Math.sqrt(s + b)}\\ne${s + d}\\ \\text{(extraneous)}`] };
        }
      }
      // substitution: (x + p)² − (m + n)(x + p) + mn
      const p = r.int(-5, 5) || 1; let m = r.int(-6, 6) || 2, n = r.int(-6, 6) || -3; if (m === n) n = m + 1;
      const A = `(${lin(1, p)})`, bb = -(m + n), cc = m * n;
      const mid = bb === 0 ? '' : (bb < 0 ? '-' : '+') + (Math.abs(bb) === 1 ? '' : Math.abs(bb)) + A, con = cc === 0 ? '' : (cc < 0 ? '-' : '+') + Math.abs(cc);
      return { text: 'Factor fully using substitution.', q: `${A}^2${mid}${con}`,
        a: [`A=${lin(1, p)}:\\ ${poly([1, -(m + n), m * n], ['A^2', 'A', ''])}=(${lin(1, -m, 'A')})(${lin(1, -n, 'A')})`, `=(${lin(1, p - m)})(${lin(1, p - n)})`] };
    }
  }
});

/* =============================== mount =============================== */
mountBox();
export const explainers = mountExplainers({ machine, solveRecap, radRecap, errors, subDos, kHunt, rootsGraph, frame, radGraph, twoRad });
export const _test = { MC, SR, RR, ER, SD, KH, RG, RGR, TR, poly, lin, frac };
