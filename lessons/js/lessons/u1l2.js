/* Math 20-1 · Unit 1 · Lesson 2 — Arithmetic Sequences.
 * The Example 5 toothpick figure and the explainers (the warm-up is plain markup in the page,
 * tools/newformat/specs/u1l2.py):
 *   generalTerm (substitute t_1 and d, expand, simplify, check with a table; Example 2(a)–(b), Example 5(a)–(b)),
 *   isTerm (solve for n; a natural n lands on a term, a decimal n falls between two terms; Example 2(c), 2(d), a
 *     negative n), countTerms (gap ÷ d = jumps, + 1 = terms; 2, 5, …, 20, Example 4(a), 4(b)),
 *   findPart (two known terms: share the gap over n − 1 jumps for d, or walk back for t_1; Example 6(a)–(c)),
 *   means (squeeze k boxes between the ends: k + 2 terms, k + 1 jumps; notes example, Example 7(a), 7(b)),
 *   unknown (three expressions: equal differences, or the middle is the mean; Example 8).
 * Colours: first term t_1 teal, common difference d amber, position n blue, the target term / given term burgundy. */
import {
  h, tex, add, box, NumberLine, ValueTable, stamp, stampIn, mountExplainers, pop, fadeIn, appear, sleep, tween,
  texNum, svgEl, liveCtx, pulse, place, drawIn, arrowHead, COLORS, fmt
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const TEAL = '#0e7c86', AMB = COLORS.amber, BLU = COLORS.blue, BRD = COLORS.brand, RED = COLORS.red, GRN = COLORS.green, INK = COLORS.ink, GRAY = '#9aa0ab';
const tc = (c) => (s) => `\\textcolor{${c}}{${s}}`;
const cT = tc(TEAL), cD = tc(AMB), cN = tc(BLU), cB = tc(BRD), cX = tc(RED), cG = tc(GRN);
const N = (v) => texNum(v, 4);
const P = (v) => (v < 0 ? `(${N(v)})` : N(v));
const Q = (v) => `(${N(v)})`;   // always bracketed: (n-1)(3)
const sgn = (v) => (v < 0 ? N(v) : '+' + N(v));
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const show = (c, el, ms = 320) => fadeIn(c, el, ms);
/** a linear expression d·n + c in the booklet's style: 3n+1, 9n-9, 48-7n, 7.5-3.5n */
function lin(d, c, v = 'n') {
  const dn = (Math.abs(d) === 1 ? '' : N(Math.abs(d))) + v;
  if (d > 0) return c === 0 ? dn : `${dn}${c < 0 ? '-' : '+'}${N(Math.abs(c))}`;
  return c === 0 ? `-${dn}` : `${N(c)}-${dn}`;
}
/** a − b for TeX strings, b bracketed when it is negative or has more than one term */
const needP = (b) => b.startsWith('-') || /[+-]/.test(b.slice(1));
const subT = (a, b) => `${a}-${needP(b) ? `(${b})` : b}`;

/* ---------------- small drawing helpers ---------------- */
function overlay(stage, W, H) {
  const s = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u1l2-ov' }, stage);
  s.style.left = '0px'; s.style.top = '0px'; return s;
}
/** a curved arrow from x1 to x2 at height y (above, or below with o.below); g.top = its peak */
function arc(svg, x1, x2, y, o = {}) {
  const hgt = o.hgt ?? Math.min(46, 14 + Math.abs(x2 - x1) * 0.3), s = o.below ? 1 : -1, mx = (x1 + x2) / 2, cy = y + s * 2 * hgt;
  const color = o.color || AMB, w = o.w || 3.2;
  const g = svgEl('g', { class: 'u1l2-arc' }, svg);
  g.path = svgEl('path', { d: `M${x1.toFixed(1)} ${y} Q${mx.toFixed(1)} ${cy} ${x2.toFixed(1)} ${y}`, class: 'bk-stroke', fill: 'none', stroke: color, 'stroke-width': w, 'stroke-linecap': 'round' }, g);
  g.head = arrowHead(g, x2, y, x2 - mx, y - cy, { width: w, color, cls: 'bk-end' });
  g.top = [mx, y + s * hgt]; g.below = !!o.below;
  return g;
}
/** an HTML label placed at (px, py) on the stage */
function lab(stage, html, px, py, pos = 'c', cls = '', gap = 4) { const d = h('div', 'u1l2-lab ' + cls, html); stage.appendChild(d); place(d, px, py, pos, gap); return d; }
/** a hop arrow with its label, drawn in (labels sit at the peak) */
async function hopArc(c, stage, svg, x1, x2, y, html, o = {}) {
  const g = arc(svg, x1, x2, y, o);
  const l = html == null ? null : lab(stage, html, g.top[0], g.top[1], o.below ? 's' : 'n', 'u1l2-hl ' + (o.lcls || ''), 3);
  if (l) { l.style.color = o.color || AMB; hide(l); }
  await drawIn(g, o.ms ?? 380, c);
  if (l) await show(c, l, 200);
  return { g, l };
}
/** a stack of algebra lines in a panel; each starts hidden */
function lines(stage, x, y, w, arr, cls = '') {
  const p = add(stage, box(h('div', 'u1l2-lines ' + cls), w), x, y);
  return arr.map((s) => { const d = h('div', 'u1l2-ln', s); hide(d); p.appendChild(d); return d; });
}
const panel = (stage, x, y, w, hh, cls = '', html = '') => add(stage, box(h('div', 'u1l2-panel ' + cls, html), w, hh), x, y);

/** a row of term cells with labels under them */
class Row {
  constructor(stage, o) {
    this.o = o; this.cells = []; this.subs = [];
    for (let i = 0; i < o.n; i++) {
      this.cells.push(add(stage, box(h('div', 'u1l2-cell ' + (o.cls || '')), o.cw, o.ch), this.x(i), o.y));
      if (o.subs) { const s = h('div', 'u1l2-csub', o.subs[i] || ''); stage.appendChild(s); place(s, this.cx(i), o.y + o.ch + 2, 's', 0); this.subs.push(s); }
    }
  }
  x(i) { return this.o.x0 + i * (this.o.cw + this.o.gap); }
  cx(i) { return this.x(i) + this.o.cw / 2; }
  get top() { return this.o.y - 4; }
  get bot() { return this.o.y + this.o.ch + (this.o.subs ? 32 : 4); }
  set(i, html, cls) { const c = this.cells[i]; c.innerHTML = html; if (cls) c.classList.add(...cls.split(' ')); return c; }
}
/** a row of n cells centred on the stage */
function rowFor(stage, W, n, y, o = {}) {
  const gap = o.gap ?? 36, cw = Math.min(o.max || 140, Math.floor((W - 60 - (n - 1) * gap) / n)), x0 = (W - (n * cw + (n - 1) * gap)) / 2;
  return new Row(stage, Object.assign({ n, x0, y, cw, ch: o.ch || 70, gap }, o));
}

/* ====================================================================================================
 * Toothpick squares (the Example 5 figure)
 * ==================================================================================================== */
const PICK = '#d39a4f';
function stick(parent, x1, y1, x2, y2, color = PICK, w = 7) {
  const g = svgEl('g', { class: 'u1l2-stick' }, parent);
  g.line = svgEl('path', { d: `M${x1} ${y1} L${x2} ${y2}`, class: 'bk-stroke', stroke: color, 'stroke-width': w, 'stroke-linecap': 'round' }, g);
  return g;
}
const recolor = (s, color) => s.line.setAttribute('stroke', color);
/** the sticks of square i (0-based) in a row starting at x0 with unit u: [left?, top, bottom, right] */
function squareSticks(parent, x0, y0, u, i, color, first) {
  const a = x0 + i * u, b = a + u, inset = 5, out = [];
  if (first) out.push(stick(parent, a, y0 + inset, a, y0 + u - inset, color));
  out.push(stick(parent, a + inset, y0, b - inset, y0, color), stick(parent, a + inset, y0 + u, b - inset, y0 + u, color), stick(parent, b, y0 + inset, b, y0 + u - inset, color));
  return out;
}
function mountFigures() {
  const host = document.getElementById('u1l2-tpfig'); if (!host) return;
  const W = 640, H = 120, u = 52, svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H }, host);
  [[1, 30], [2, 170], [3, 362]].forEach(([n, x0]) => {
    for (let i = 0; i < n; i++) squareSticks(svg, x0, 14, u, i, PICK, i === 0);
    svgEl('text', { x: x0 + (n * u) / 2, y: 104, 'text-anchor': 'middle', class: 'u1l2-figt' }, svg).textContent = `${n} square${n > 1 ? 's' : ''}`;
  });
}

/* =============================== explainer: writing the general term =============================== */
const GT = {
  ex2: { lab: 'Example 2(a)–(b)', terms: [41, 34, 27, 20], k: 30, ask: `Example 2: ${T('41,\\ 34,\\ 27,\\ 20,\\ \\dots')} &nbsp;(a) the general term in simplest form &nbsp;(b) ${T('t_{30}')}` },
  ex5: { lab: 'Example 5(a)–(b)', terms: [4, 7, 10, 13], k: 40, ask: `Example 5: toothpicks ${T('4,\\ 7,\\ 10,\\ 13,\\ \\dots')} &nbsp;(a) the general term &nbsp;(b) ${T('t_{40}')}, for 40 squares` }
};
const generalTerm = {
  title: 'Substitute, expand, simplify',
  height: 400,
  minW: 880,
  choices: Object.keys(GT).map((k) => ({ v: k, label: GT[k].lab })),
  ask: (v) => GT[v].ask,
  make(stage, v, ex) {
    const D = GT[v], W = ex.W, [t1, t2] = D.terms, d = t2 - t1, c0 = t1 - d, k = D.k, tk = c0 + d * k;
    const svg = overlay(stage, W, 400);
    const R = new Row(stage, { n: 4, x0: 24, y: 48, cw: 88, ch: 56, gap: 30 });
    D.terms.forEach((t, i) => R.set(i, T(i ? N(t) : cT(N(t))), i ? 'u1l2-csm' : 'u1l2-csm u1l2-c1'));
    const dots = lab(stage, T('\\dots'), R.x(3) + 88 + 22, 76, 'c', 'u1l2-dots');
    const op = (x) => (x < 0 ? '-' : '+');
    const L = lines(stage, 24, 128, Math.round(W * 0.6), [
      T(`t_1=${cT(N(t1))},\\qquad d=${N(t2)}-${P(t1)}=${cD(N(d))}`),
      T(`t_n=${cT('t_1')}+(n-1)${cD('d')}`),
      T(`t_n=${cT(N(t1))}+(n-1)${cD(Q(d))}`),
      T(`t_n=${N(t1)}${op(d)}${N(Math.abs(d))}n${op(-d)}${N(Math.abs(d))}`),
      T(`t_n=\\boxed{${lin(d, c0)}}`),
      T(`t_{${k}}=${d > 0 ? `${N(d)}(${k})${op(c0)}${N(Math.abs(c0))}=${N(d * k)}${op(c0)}${N(Math.abs(c0))}` : `${N(c0)}-${N(-d)}(${k})=${N(c0)}-${N(-d * k)}`}=${cB(N(tk))}`)
    ], 'u1l2-alg');
    const tb = new ValueTable(stage, { x: W - 340, y: 128, headers: ['n', 't_n', lin(d, c0)], rows: D.terms.map((t, i) => [i + 1, t, t]), hide: 2, tap: false, cellW: 100, cellH: 50 });
    hide(tb.el);
    const chk = stamp(stage, '✓ matches', { ok: true, x: W - 190, y: 100, size: 'sm' }); hide(chk);
    return [
      { cap: `Read ${T(cT('t_1'))} and ${T(cD('d'))} from the terms: ${T(`t_1=${N(t1)}`)} and ${T(`d=${N(t2)}-${P(t1)}=${N(d)}`)}.`,
        run: async (c) => { for (let i = 0; i < 3; i++) await hopArc(c, stage, svg, R.cx(i) + 12, R.cx(i + 1) - 12, R.top, T(sgn(d)), { hgt: 20, ms: 260 }); await show(c, L[0]); } },
      { cap: `Start from the general term: ${T('t_n=t_1+(n-1)d')}.`, run: (c) => show(c, L[1]) },
      { cap: `Substitute ${T(cT(`t_1=${N(t1)}`))} and ${T(cD(`d=${N(d)}`))}. Keep the brackets.`, run: (c) => show(c, L[2]) },
      { cap: `Expand: ${T(`(n-1)${Q(d)}=${N(d)}n${op(-d)}${N(Math.abs(d))}`)}.`, run: (c) => show(c, L[3]) },
      { cap: `Collect the numbers: ${T(`${N(t1)}${op(-d)}${N(Math.abs(d))}=${N(c0)}`)}. In simplest form, ${T(`t_n=${lin(d, c0)}`)}.`, run: (c) => show(c, L[4]) },
      { cap: `Check it: ${T('n=1,2,3,4')} give ${T(D.terms.join(',\\ '))}, the terms we started with ✓`,
        run: async (c) => { await show(c, tb.el); await tb.fill(c, { col: 2, stagger: 160 }); await stampIn(c, chk); } },
      { cap: `(b) Now any term is one substitution: ${T(`t_{${k}}=${N(tk)}`)}.${v === 'ex5' ? ' A row of 40 squares takes 121 toothpicks.' : ''}`, run: (c) => show(c, L[5]) }
    ];
  }
};

/* =============================== explainer: is it a term? =============================== */
const IT = {
  c: { lab: 'Example 2(c): ' + T('-295'), v: -295 },
  d: { lab: 'Example 2(d): ' + T('-300'), v: -300 },
  up: { lab: 'Is ' + T('100') + ' a term?', v: 100 }
};
const isTerm = {
  title: 'Solve for n: is it a natural number?',
  height: 380,
  minW: 860,
  choices: Object.keys(IT).map((k) => ({ v: k, label: IT[k].lab })),
  ask: (v) => (v === 'up' ? `Is ${T('100')} a term of ${T('41,\\ 34,\\ 27,\\ 20,\\ \\dots')} (${T('t_n=48-7n')})?` : `Example 2${v === 'c' ? '(c): which term is equal to' : '(d): is'} ${T(N(IT[v].v))}${v === 'd' ? ' a term of the sequence' : ''}? (${T('t_n=48-7n')})`),
  make(stage, v, ex) {
    const W = ex.W, val = IT[v].v, f = (n) => 48 - 7 * n, nx = (48 - val) / 7, whole = Number.isInteger(nx) && nx >= 1;
    const nT = (whole ? '=' : '\\approx ') + N(Math.round(nx * 10) / 10);
    const L = lines(stage, 24, 16, 460, [T(`48-7n=${cB(N(val))}`), T(`-7n=${N(val - 48)}`), T(`${cN('n')}${cN(nT)}`)], 'u1l2-alg');
    const note = add(stage, box(h('div', 'u1l2-note'), W - 520), 500, 24); hide(note);
    const lo = v === 'up' ? 20 : -323, hi = v === 'up' ? 112 : -268;
    const NL = new NumberLine(stage, { x: 10, y: 168, width: W - 20, height: 206, min: lo, max: hi, step: v === 'up' ? 5 : 1, numbers: false, axisY: 96 });
    hide(NL.el);
    const ks = v === 'up' ? [1, 2, 3] : [46, 47, 48, 49, 50, 51, 52];
    const labs = ks.map((k) => { const d = h('div', 'u1l2-tlab', `<div class="u1l2-tv">${T(N(f(k)))}</div><div>${T(cN(`t_{${k}}`))}</div>`); NL.html.appendChild(d); place(d, NL.toPx(f(k)), NL.ay + 12, 's', 0); return d; });
    void labs;
    const pin = h('div', 'u1l2-pin', `<div class="u1l2-pinv">${T(N(val))}</div><div class="u1l2-pinl"></div>`); NL.html.appendChild(pin); place(pin, NL.toPx(val), NL.ay - 4, 'n', 0); hide(pin);
    const steps = [
      { cap: `Set the general term equal to the number: ${T(`48-7n=${N(val)}`)}.`, run: (c) => show(c, L[0]) },
      { cap: `Solve for ${T('n')}: ${T(`-7n=${N(val - 48)}`)}, so ${T(`n${nT}`)}.`, run: async (c) => { await show(c, L[1]); await show(c, L[2]); } },
      { cap: `Look at the terms near ${T(N(val))}: they are ${T('7')} apart, one at each <b>natural number</b> position.`,
        run: async (c) => { await show(c, NL.el); for (const k of ks) { const p = NL.point(f(k), { color: k === 1 ? TEAL : INK, r: 8 }); await pop(c, p, 160); } } }
    ];
    if (v === 'c') steps.push({ cap: `${T('n=49')} is a natural number, so ${T('-295')} <b>is</b> a term: it is ${T('t_{49}')}. It lands right on a term.`,
      run: async (c) => { await fadeIn(c, pin, 420, { from: 'translateY(-40px)' }); note.innerHTML = `${T(cB('-295=t_{49}'))}`; await show(c, note); await stampIn(c, stamp(stage, 'A term ✓', { ok: true, x: W - 120, y: 120 })); } });
    else if (v === 'd') steps.push({ cap: `${T('n\\approx49.7')} is <b>not</b> a natural number: ${T('-300')} falls <b>between</b> ${T('t_{49}=-295')} and ${T('t_{50}=-302')}. No term lands there.`,
      run: async (c) => { await fadeIn(c, pin, 420, { from: 'translateY(-40px)' }); note.innerHTML = `There is no ${T('t_{49.7}')}: positions are ${T('1,2,3,\\dots')}`; await show(c, note); await stampIn(c, stamp(stage, 'Not a term', { ok: false, x: W - 120, y: 120 })); } });
    else steps.push({ cap: `A position can’t be negative or a decimal. The terms start at ${T(cT('41'))} and only go <b>down</b>, so they never reach ${T('100')}.`,
      run: async (c) => {
        await fadeIn(c, pin, 420, { from: 'translateY(-40px)' });
        for (let k = 1; k < 3; k++) await NL.hop(c, f(k), f(k + 1), { height: 30, color: AMB, label: T('-7') });
        note.innerHTML = `${T('n\\approx-7.4')}: there is no position ${T('-7.4')}`; await show(c, note); await stampIn(c, stamp(stage, 'Not a term', { ok: false, x: W - 120, y: 120 }));
      } });
    return steps;
  }
};

/* =============================== explainer: how many terms? =============================== */
const CT = {
  small: { lab: T('2,5,8,\\dots,20'), t1: 2, d: 3, tn: 20, min: -1, max: 23, step: 1 },
  a: { lab: 'Example 4(a)', t1: 8, d: -6, tn: -166, min: -176, max: 18, step: 10 },
  b: { lab: 'Example 4(b)', t1: 108, d: 9, tn: 594, lo: 100, hi: 600, min: 82, max: 618, step: 9 }
};
const countTerms = {
  title: 'Gap ÷ d = jumps; jumps + 1 = terms',
  height: 430,
  minW: 880,
  choices: Object.keys(CT).map((k) => ({ v: k, label: CT[k].lab })),
  ask: (v) => (v === 'small' ? `How many terms are in ${T('2,\\ 5,\\ 8,\\ \\dots,\\ 20')}?` : v === 'a' ? `Example 4(a): how many terms are in ${T('8,\\ 2,\\ -4,\\ \\dots,\\ -166')}?` : 'Example 4(b): how many multiples of 9 are there between 100 and 600?'),
  make(stage, v, ex) {
    const D = CT[v], W = ex.W, gap = D.tn - D.t1, J = gap / D.d, n = J + 1, big = J > 10;
    const NL = new NumberLine(stage, { x: 10, y: 0, width: W - 20, height: 230, min: D.min, max: D.max, step: D.step, numbers: false, axisY: 118, minor: 0 });
    const pinT = (val, html, cls) => { const p = h('div', 'u1l2-pin ' + cls, `<div class="u1l2-pinv">${html}</div><div class="u1l2-pinl"></div>`); NL.html.appendChild(p); place(p, NL.toPx(val), NL.ay - 4, 'n', 0); hide(p); return p; };
    const p1 = pinT(D.t1, T(cT(`t_1=${N(D.t1)}`)), 'u1l2-pin-t'), p2 = pinT(D.tn, T(cB(`t_n=${N(D.tn)}`)), 'u1l2-pin-b');
    let bounds = [];
    if (D.lo != null) bounds = [D.lo, D.hi].map((b) => { const g = svgEl('g', {}, NL.layers.top); svgEl('circle', { cx: NL.toPx(b), cy: NL.ay, r: 8, fill: '#fff', stroke: GRAY, 'stroke-width': 3 }, g); const l = h('div', 'u1l2-blab', T(N(b))); NL.html.appendChild(l); place(l, NL.toPx(b), NL.ay + 44, 's', 0); hide(g); hide(l); return [g, l]; });
    const LW = Math.round(W * 0.56);
    const L = lines(stage, 18, 240, LW, [
      T(`${N(D.tn)}=${N(D.t1)}+(n-1)${Q(D.d)}`),
      T(`${N(gap)}=${N(D.d)}(n-1)\\ \\Rightarrow\\ n-1=${N(J)}\\ \\Rightarrow\\ n=${cB(N(n))}`)
    ], 'u1l2-alg');
    const right = panel(stage, LW + 34, 240, W - LW - 48, 180, 'u1l2-pr');
    right.innerHTML = `<div class="u1l2-crow"><span class="u1l2-ck">gap</span><b></b></div><div class="u1l2-crow"><span class="u1l2-ck">jumps</span><b></b></div><div class="u1l2-crow u1l2-cterm"><span class="u1l2-ck">terms</span><b></b></div>`;
    const cr = [...right.querySelectorAll('.u1l2-crow')]; cr.forEach(hide);
    const [vGap, vJ, vN] = cr.map((r) => r.querySelector('b'));
    vGap.innerHTML = T(`${N(D.tn)}-${P(D.t1)}=${N(gap)}`); vJ.innerHTML = T(`${N(gap)}\\div${P(D.d)}=${N(J)}`); vN.innerHTML = T(`${N(J)}+1=${cB(N(n))}`);
    const bar = NL.interval(Math.min(D.t1, D.tn), Math.max(D.t1, D.tn), { color: '#e9c8d3', width: 12 }); hide(bar);
    const gl = h('div', 'u1l2-gaplab', `gap ${T(N(gap))}`); NL.html.appendChild(gl); place(gl, NL.toPx((D.t1 + D.tn) / 2), NL.ay - 18, 'n', 0); hide(gl);
    const steps = [];
    if (D.lo != null) {
      steps.push({ cap: `“Between 100 and 600”: ${T('100\\div9\\approx11.1')}, so the first multiple of 9 <b>inside</b> is ${T('9\\times12=108')}.`,
        run: async (c) => { for (const [g, l] of bounds) { await appear(c, g, 200); await show(c, l, 200); } await pop(c, NL.point(D.t1, { color: TEAL, r: 7 }), 200); await show(c, p1); } });
      steps.push({ cap: `${T('600\\div9\\approx66.7')}, so the last is ${T('9\\times66=594')}. These are ${T(cT('t_1'))} and ${T(cB('t_n'))}, with ${T(cD('d=9'))}.`,
        run: async (c) => { await pop(c, NL.point(D.tn, { color: BRD, r: 7 }), 200); await show(c, p2); } });
    } else steps.push({ cap: `Mark the first term ${T(cT(`t_1=${N(D.t1)}`))} and the last term ${T(cB(`t_n=${N(D.tn)}`))}. The jumps are ${T(cD(`d=${N(D.d)}`))}.`,
      run: async (c) => { await pop(c, NL.point(D.t1, { color: TEAL, r: 8 }), 200); await show(c, p1); await pop(c, NL.point(D.tn, { color: BRD, r: 8 }), 200); await show(c, p2); } });
    steps.push({ cap: `The whole gap from ${T('t_1')} to ${T('t_n')}: ${T(`${N(D.tn)}-${P(D.t1)}=${N(gap)}`)}.`,
      run: async (c) => { await appear(c, bar, 300); await show(c, gl); await show(c, cr[0]); } });
    steps.push({ cap: `Jumps of ${T(N(D.d))} fill the gap: ${T(`${N(gap)}\\div${P(D.d)}=${N(J)}`)} <b>jumps</b>.`,
      run: async (c) => {
        for (let j = 0; j < J; j++) {
          const a = D.t1 + j * D.d, b = a + D.d;
          if (big) { // many short jumps: plain scallops, no arrowheads
            const p1 = NL.toPx(a), p2 = NL.toPx(b), y = NL.ay + 6;
            const sc = svgEl('path', { d: `M${p1} ${y} Q${(p1 + p2) / 2} ${y + 24} ${p2} ${y}`, class: 'bk-stroke', fill: 'none', stroke: AMB, 'stroke-width': 2.2 }, NL.layers.data);
            await drawIn(sc, 40, c);
          } else await NL.hop(c, a, b, { below: true, height: 30, ms: 260, color: AMB });
          if (j < J - 1) { const p = NL.point(b, { color: INK, r: big ? 3.5 : 6 }); if (!big) await pop(c, p, 120); }
        }
        await show(c, cr[1]);
      } });
    steps.push({ cap: `The terms are <b>one more</b> than the jumps, because ${T('t_1')} counts too. ${T(`${N(J)}+1=${N(n)}`)} ${v === 'b' ? 'multiples' : 'terms'}.`,
      run: async (c) => { await show(c, cr[2]); await pulse(c, cr[2], 1.08); } });
    steps.push({ cap: `Same thing with the formula: substitute into ${T('t_n=t_1+(n-1)d')} and solve: ${T(`n=${N(n)}`)}.`,
      run: async (c) => { await show(c, L[0]); await show(c, L[1]); } });
    return steps;
  }
};

/* =============================== explainer: find t_1 or d from two known terms =============================== */
const FP = {
  a: { lab: 'Example 6(a): find ' + T('t_1'), find: 't1', d: 6, k: 15, tk: 71, min: -22, max: 80, step: 2 },
  b: { lab: 'Example 6(b): find ' + T('d'), find: 'd', t1: 4, k: 13, tk: -38, min: -46, max: 12, step: 1 },
  c: { lab: 'Example 6(c): find ' + T('d'), find: 'd', t1: 12, k: 16, tk: 87, min: 4, max: 95, step: 5 }
};
const findPart = {
  title: 'Two terms, n − 1 equal jumps between them',
  height: 430,
  minW: 880,
  choices: Object.keys(FP).map((k) => ({ v: k, label: FP[k].lab })),
  ask: (v) => (v === 'a' ? `Example 6(a): ${T('d=6')} and ${T('t_{15}=71')}. Determine ${T('t_1')}.` : v === 'b' ? `Example 6(b): ${T('t_1=4')} and ${T('t_{13}=-38')}. Determine ${T('d')} and the general term.` : 'Example 6(c): 16 terms; the first is 12 and the last is 87. Determine ' + T('d') + '.'),
  make(stage, v, ex) {
    const D = FP[v], W = ex.W, J = D.k - 1, d = D.find === 'd' ? (D.tk - D.t1) / J : D.d, t1 = D.find === 't1' ? D.tk - J * D.d : D.t1, gap = D.tk - t1;
    const NL = new NumberLine(stage, { x: 10, y: 0, width: W - 20, height: 232, min: D.min, max: D.max, step: D.step, numbers: false, axisY: 120 });
    const pinT = (val, html) => { const p = h('div', 'u1l2-pin', `<div class="u1l2-pinv">${html}</div><div class="u1l2-pinl"></div>`); NL.html.appendChild(p); place(p, NL.toPx(val), NL.ay - 4, 'n', 0); hide(p); return p; };
    const pk = pinT(D.tk, T(cB(`t_{${D.k}}=${N(D.tk)}`))), p1 = pinT(t1, T(cT(`t_1=${N(t1)}`)));
    const dk = NL.point(D.tk, { color: BRD, r: 8 }), d1 = NL.point(t1, { color: TEAL, r: 8 }); hide(dk); hide(d1);
    const bar = NL.interval(Math.min(t1, D.tk), Math.max(t1, D.tk), { color: '#e9c8d3', width: 12 }); hide(bar);
    const gl = h('div', 'u1l2-gaplab', ''); NL.html.appendChild(gl); place(gl, NL.toPx((t1 + D.tk) / 2), NL.ay - 18, 'n', 0); hide(gl);
    const jl = h('div', 'u1l2-jlab', `<b>${J}</b> equal jumps`); NL.html.appendChild(jl); place(jl, NL.toPx((t1 + D.tk) / 2), NL.ay + 40, 's', 0); hide(jl);
    const hops = async (c, back) => {
      for (let j = 0; j < J; j++) {
        const a = back ? D.tk - j * d : t1 + j * d, b = back ? a - d : a + d;
        await NL.hop(c, a, b, { below: true, height: 22, ms: 70, color: back ? TEAL : AMB, width: 2.6 });
        if (j < J - 1) NL.point(b, { color: INK, r: 4 });
      }
    };
    const LW = Math.round(W * 0.6);
    const op = (x) => (x < 0 ? '-' : '+');
    const alg = D.find === 't1'
      ? [`${N(D.tk)}=t_1+(${D.k}-1)(${N(d)})`, `${N(D.tk)}=t_1+${N(J * d)}`, `${cT('t_1')}=${cT(N(t1))}`]
      : [`${N(D.tk)}=${N(t1)}+(${D.k}-1)d`, `${N(gap)}=${J}d\\ \\Rightarrow\\ ${cD('d')}=${cD(N(d))}`].concat(v === 'b' ? [`t_n=${N(t1)}+(n-1)${Q(d)}=${N(t1)}${op(d)}${N(Math.abs(d))}n${op(-d)}${N(Math.abs(d))}=\\boxed{${lin(d, t1 - d)}}`] : []);
    const L = lines(stage, 18, 244, LW + 160, alg.map(T), 'u1l2-alg');
    const steps = [];
    if (D.find === 't1') {
      steps.push({ cap: `We know ${T(cB(`t_{15}=71`))} and ${T(cD('d=6'))}. Where is ${T(cT('t_1'))}?`, run: async (c) => { await pop(c, dk, 200); await show(c, pk); } });
      steps.push({ cap: `${T('t_1')} is ${T('15-1=14')} jumps <b>back</b> from ${T('t_{15}')}.`, run: async (c) => { await hops(c, true); await show(c, jl); } });
      steps.push({ cap: `14 jumps of 6 cover ${T('14\\times6=84')}.`, run: async (c) => { gl.innerHTML = T('14\\times6=84'); await appear(c, bar, 300); await show(c, gl); } });
      steps.push({ cap: `So ${T('t_1=71-84=-13')}.`, run: async (c) => { await pop(c, d1, 200); await show(c, p1); } });
      steps.push({ cap: `With the formula: ${T('71=t_1+(15-1)(6)')}, so ${T('71=t_1+84')} and ${T('t_1=-13')}.`, run: async (c) => { for (const l of L) await show(c, l, 260); } });
      return steps;
    }
    const known = v === 'c' ? `16 terms: the first is ${T(cT('t_1=12'))} and the last, 87, is ${T(cB('t_{16}'))}.` : `Mark what we know: ${T(cT(`t_1=${N(t1)}`))} and ${T(cB(`t_{${D.k}}=${N(D.tk)}`))}.`;
    steps.push({ cap: known, run: async (c) => { await pop(c, d1, 200); await show(c, p1); await pop(c, dk, 200); await show(c, pk); } });
    steps.push({ cap: `From ${T('t_1')} to ${T(`t_{${D.k}}`)} is ${T(`${D.k}-1=${J}`)} <b>equal jumps</b>.`, run: async (c) => { await hops(c, false); await show(c, jl); } });
    steps.push({ cap: `The whole gap: ${T(`${N(D.tk)}-${P(t1)}=${N(gap)}`)}.`, run: async (c) => { gl.innerHTML = `gap ${T(N(gap))}`; await appear(c, bar, 300); await show(c, gl); } });
    steps.push({ cap: `Share the gap equally: ${T(`d=${N(gap)}\\div${J}=${N(d)}`)}.`, run: async (c) => { jl.innerHTML = `<b>${J}</b> jumps of ${T(cD(N(d)))}`; await pulse(c, jl, 1.12); } });
    steps.push({ cap: `With the formula: ${T(alg[0])}, so ${T(`d=${N(d)}`)}.${v === 'b' ? ` General term: ${T(`t_n=${lin(d, t1 - d)}`)}.` : ''}`, run: async (c) => { for (const l of L) await show(c, l, 260); } });
    return steps;
  }
};

/* =============================== explainer: arithmetic means =============================== */
const MN = {
  def: { lab: 'Notes: 4 … 22', a: 4, b: 22, k: 2 },
  a: { lab: 'Example 7(a)', a: 7, b: -18, k: 4 },
  b: { lab: 'Example 7(b)', a: -9, b: 26, k: 1 }
};
const means = {
  title: 'k means → k + 2 terms → k + 1 jumps',
  height: 430,
  minW: 880,
  choices: Object.keys(MN).map((k) => ({ v: k, label: MN[k].lab })),
  ask: (v) => (v === 'def' ? `The arithmetic means between 4 and 22 in ${T('4,\\ 10,\\ 16,\\ 22')}` : v === 'a' ? `Example 7(a): insert four arithmetic means between 7 and ${T('-18')}.` : `Example 7(b): insert one arithmetic mean between ${T('-9')} and 26.`),
  make(stage, v, ex) {
    const D = MN[v], W = ex.W, n = D.k + 2, J = D.k + 1, d = (D.b - D.a) / J, vals = Array.from({ length: n }, (_, i) => D.a + i * d);
    const svg = overlay(stage, W, 430);
    const R = rowFor(stage, W, n, 52, { gap: 44, max: 120, ch: 62, subs: vals.map((_, i) => T(cN(`t_${i + 1}`))) });
    R.set(0, T(cT(N(D.a)))); R.set(n - 1, T(cB(N(D.b))));
    for (let i = 1; i < n - 1; i++) { R.cells[i].classList.add('u1l2-cmean'); hide(R.cells[i]); }
    R.subs.forEach(hide);
    const lo = Math.min(D.a, D.b), hi = Math.max(D.a, D.b), padv = (hi - lo) * 0.06;
    const NL = new NumberLine(stage, { x: 30, y: 172, width: W - 60, height: 130, min: lo - padv, max: hi + padv, step: (hi - lo) > 30 ? 5 : 1, numbers: false, axisY: 56 });
    const nlab = (val, html) => { const l = h('div', 'u1l2-nlab', html); NL.html.appendChild(l); place(l, NL.toPx(val), NL.ay + 12, 's', 0); return l; };
    const e1 = NL.point(D.a, { color: TEAL, r: 8 }), e2 = NL.point(D.b, { color: BRD, r: 8 }); nlab(D.a, T(cT(N(D.a)))); nlab(D.b, T(cB(N(D.b))));
    const L = lines(stage, 24, 312, W - 48, [
      T(`${D.k}\\ \\text{mean${D.k > 1 ? 's' : ''}}+2\\ \\text{ends}=${n}\\ \\text{terms}:\\quad t_1=${N(D.a)},\\ \\ t_{${n}}=${N(D.b)}`),
      T(`${N(D.b)}=${N(D.a)}+${J}d\\ \\Rightarrow\\ ${cD('d')}=${N(D.b - D.a)}\\div${J}=${cD(N(d))}`)
    ], 'u1l2-alg');
    void e1; void e2;
    const meansT = vals.slice(1, -1).map(N).join(',\\ ');
    const steps = [
      { cap: `The two ends: ${T(cT(N(D.a)))} and ${T(cB(N(D.b)))}.`, run: async (c) => { await pop(c, R.cells[0], 240); await pop(c, R.cells[n - 1], 240); } },
      { cap: `Squeeze in <b>${D.k}</b> empty box${D.k > 1 ? 'es' : ''} for the mean${D.k > 1 ? 's' : ''}.`, run: async (c) => { for (let i = 1; i < n - 1; i++) await pop(c, R.cells[i], 220); } },
      { cap: `${D.k} mean${D.k > 1 ? 's' : ''} + 2 ends = <b>${n} terms</b>, so ${T(N(D.b))} is ${T(`t_${n}`)}. Between the ends: <b>${J} equal jumps</b>.`,
        run: async (c) => { for (const s of R.subs) await show(c, s, 160); await show(c, L[0]); } },
      { cap: `${T(`${N(D.b)}=${N(D.a)}+${J}d`)}, so ${T(`d=${N(D.b - D.a)}\\div${J}=${N(d)}`)}.`, run: (c) => show(c, L[1]) },
      { cap: `Fill the boxes by adding ${T(cD(N(d)))}: ${T(meansT)}. ${v === 'def' ? 'The means between 4 and 22 are 10 and 16.' : D.k > 1 ? `These are the four <b>arithmetic means</b>.` : 'That is the <b>arithmetic mean</b>.'}`,
        run: async (c) => {
          for (let i = 1; i < n; i++) {
            await hopArc(c, stage, svg, R.cx(i - 1) + 14, R.cx(i) - 14, R.top, T(sgn(d)), { hgt: 24, ms: 260 });
            if (i < n - 1) { R.set(i, `<b>${T(N(vals[i]))}</b>`); await pop(c, R.cells[i], 200); const p = NL.point(vals[i], { color: AMB, r: 8 }); nlab(vals[i], T(N(vals[i]))); await pop(c, p, 160); }
          }
        } }
    ];
    if (v === 'b') steps.push({ cap: `One mean is just the <b>average</b>: ${T('\\frac{-9+26}{2}=8.5')}, exactly halfway between the ends.`,
      run: async (c) => { for (const half of [[D.a, 8.5], [8.5, D.b]]) await NL.hop(c, half[0], half[1], { height: 34, color: TEAL, label: T('+17.5') }); } });
    return steps;
  }
};

/* =============================== explainer: three expressions in a row =============================== */
const UN = { diff: { lab: 'Example 8: equal differences' }, mean: { lab: 'Example 8: middle = mean' } };
const unknown = {
  title: 'Three terms in a row: equal gaps',
  height: 420,
  minW: 880,
  choices: Object.keys(UN).map((k) => ({ v: k, label: UN[k].lab })),
  ask: `Example 8: ${T('x-4,\\ \\ 2x+1,\\ \\ 5x-2')} are consecutive terms of an arithmetic sequence. Find ${T('x')}, the terms, the general term and ${T('t_{20}')}.`,
  make(stage, v, ex) {
    const W = ex.W, E = ['x-4', '2x+1', '5x-2'], V = [0, 9, 18];
    const svg = overlay(stage, W, 420);
    const R = rowFor(stage, W, 3, 76, { gap: 110, max: 190, ch: 68 });
    E.forEach((e, i) => R.set(i, T(e), 'u1l2-cexp'));
    const vl = V.map((x, i) => { const l = lab(stage, T(`=${cB(N(x))}`), R.cx(i), 76 + 68 + 8, 's', 'u1l2-vlab'); hide(l); return l; });
    const LW = Math.round(W * 0.64);
    const steps = [];
    const hopsA = [];
    const g = async (c, i, html) => { const r = await hopArc(c, stage, svg, R.cx(i) + 20, R.cx(i + 1) - 20, R.top, html, { hgt: 28 }); hopsA.push(r); return r; };
    const tbox = add(stage, box(h('div', 'u1l2-note'), W - LW - 60), LW + 40, 216); hide(tbox);
    if (v === 'diff') {
      const L = lines(stage, 24, 206, LW, [T('(2x+1)-(x-4)=x+5'), T('(5x-2)-(2x+1)=3x-3'), T('x+5=3x-3\\ \\Rightarrow\\ 8=2x\\ \\Rightarrow\\ \\boxed{x=4}')], 'u1l2-alg');
      steps.push({ cap: `Three terms in a row: the two <b>differences</b> (gaps) must be equal.`, run: async (c) => { await g(c, 0, '?'); await g(c, 1, '?'); } });
      steps.push({ cap: `First gap: ${T('(2x+1)-(x-4)=x+5')}.`, run: async (c) => { hopsA[0].l.innerHTML = T('x+5'); await pop(c, hopsA[0].l, 260); await show(c, L[0]); } });
      steps.push({ cap: `Second gap: ${T('(5x-2)-(2x+1)=3x-3')}.`, run: async (c) => { hopsA[1].l.innerHTML = T('3x-3'); await pop(c, hopsA[1].l, 260); await show(c, L[1]); } });
      steps.push({ cap: `Set the gaps equal and solve: ${T('x+5=3x-3')}, ${T('8=2x')}, so ${T('x=4')}.`, run: (c) => show(c, L[2]) });
    } else {
      const L = lines(stage, 24, 206, LW, [T('t_2=\\dfrac{t_1+t_3}{2}'), T('2x+1=\\dfrac{(x-4)+(5x-2)}{2}=\\dfrac{6x-6}{2}=3x-3'), T('2x+1=3x-3\\ \\Rightarrow\\ \\boxed{x=4}')], 'u1l2-alg');
      steps.push({ cap: `The middle term is the <b>mean</b> of its neighbours: ${T('t_2=\\frac{t_1+t_3}{2}')}.`, run: (c) => show(c, L[0]) });
      steps.push({ cap: `Substitute and simplify: ${T('\\frac{(x-4)+(5x-2)}{2}=\\frac{6x-6}{2}=3x-3')}.`, run: (c) => show(c, L[1]) });
      steps.push({ cap: `Solve: ${T('2x+1=3x-3')}, so ${T('x=4')}. The same answer as setting the differences equal.`, run: (c) => show(c, L[2]) });
    }
    steps.push({ cap: `Substitute ${T('x=4')}: the terms are ${T('0,\\ 9,\\ 18')}. Both gaps are ${T('9')} ✓${v === 'mean' ? ', and 9 is exactly halfway between 0 and 18' : ''}.`,
      run: async (c) => {
        for (const l of vl) await show(c, l, 220);
        if (hopsA.length) for (const [j, r] of hopsA.entries()) { r.l.innerHTML = T(v === 'diff' ? (j ? '3x-3=9' : 'x+5=9') : '+9'); await pop(c, r.l, 220); }
        else { await g(c, 0, T('+9')); await g(c, 1, T('+9')); }
      } });
    steps.push({ cap: `(b) ${T(cT('t_1=0'))}, ${T(cD('d=9'))}: ${T('t_n=0+(n-1)(9)=9n-9')}, so ${T('t_{20}=9(20)-9=171')}.`,
      run: async (c) => { tbox.innerHTML = `${T(`t_n=${cT('0')}+(n-1)${cD('(9)')}`)}<br>${T('t_n=\\boxed{9n-9}')}<br>${T(`t_{20}=9(20)-9=${cB('171')}`)}`; await show(c, tbox); } });
    return steps;
  }
};

/* =============================== Stand Up Break! (whiteboard stations; ../standup.js) ===============================
 * Sits after Example 3 (Section 2: the general term). BEG: state d and the next two terms; PRG: the general term in
 * simplest form and one term; MAS: two terms given → d, t_1 and the general term. */
const SU_D = [-9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12];
const suSeq = (t1, d, k = 4) => Array.from({ length: k }, (_, i) => N(t1 + i * d)).join(',\\ ') + ',\\ \\dots';
standup('u1l2', {
  intro: 'At your whiteboard: find d, build tₙ = t₁ + (n − 1)d, and use it.',
  levels: {
    BEG: (r) => {
      const t1 = r.int(-20, 40), d = r.pick(SU_D);
      return { text: 'The sequence is arithmetic. State the common difference <i>d</i> and the next two terms.', q: suSeq(t1, d),
        a: [`d=${N(t1 + d)}-${P(t1)}=${N(d)}`, `\\text{next: }${N(t1 + 4 * d)},\\ \\ ${N(t1 + 5 * d)}`] };
    },
    PRG: (r) => {
      const t1 = r.int(-25, 60), d = r.pick(SU_D), k = r.int(15, 45);
      return { text: `Determine the general term in simplest form. Then determine <i>t</i><sub>${k}</sub>.`, q: suSeq(t1, d),
        a: [`t_1=${N(t1)},\\ \\ d=${N(d)}`, `t_n=${N(t1)}+(n-1)${Q(d)}=${lin(d, t1 - d)}`, `t_{${k}}=${N(t1 + (k - 1) * d)}`] };
    },
    MAS: (r) => {
      const d = r.pick(SU_D), t1 = r.int(-30, 30), a = r.int(2, 6), b = a + r.int(4, 12), A = t1 + (a - 1) * d, B = t1 + (b - 1) * d;
      return { text: 'An arithmetic sequence has these two terms. Determine <i>d</i>, the first term and the general term.', q: `t_{${a}}=${N(A)},\\qquad t_{${b}}=${N(B)}`,
        a: [`${b}-${a}=${b - a}\\ \\text{jumps}:\\ \\ ${N(B)}-${P(A)}=${b - a}d\\ \\Rightarrow\\ d=${N(d)}`, `t_1=${N(A)}-${a - 1}${Q(d)}=${N(t1)}`, `t_n=${N(t1)}+(n-1)${Q(d)}=${lin(d, t1 - d)}`] };
    }
  }
});

/* =============================== mount =============================== */
mountFigures();
export const explainers = mountExplainers({ generalTerm, isTerm, countTerms, findPart, means, unknown });
export const _test = { lin, GT, IT, CT, FP, MN };
void fmt; void tween; void GRN; void cG; void RED;

