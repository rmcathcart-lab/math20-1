/* Math 20-1 · Unit 1 · Lesson 2 — Arithmetic Sequences.
 * Warm-up (Fence Posts and Clock Chimes: posts vs rails, chimes vs gaps — always one fewer), the Example 5 toothpick
 * figure, and the explainers:
 *   diffHops (difference hops above a row of terms: equal → arithmetic, d, next two terms; Example 1(a)–(f); one pair
 *     isn't enough), jumps (STAR: a number line of terms with the n − 1 jumps of d counted out from t_1 to t_n;
 *     3, 7, 11 … to t_6 and Example 2(b) t_30), generalTerm (substitute t_1 and d, expand, simplify, check with a table;
 *     Example 2(a)–(b), Example 5(a)–(b)), isTerm (solve for n; a natural n lands on a term, a decimal n falls between
 *     two terms; Example 2(c), 2(d), a negative n), bothWays (from a middle term: add d going right, subtract d going
 *     left; Example 3(a), 3(b)), countTerms (gap ÷ d = jumps, + 1 = terms; 2, 5, …, 20, Example 4(a), 4(b)),
 *     toothpicks (4, 7, 10, 13 built stick by stick; 3n + 1 = one stick + 3 per square; Example 5(b)–(c)),
 *     findPart (two known terms: share the gap over n − 1 jumps for d, or walk back for t_1; Example 6(a)–(c)),
 *     means (squeeze k boxes between the ends: k + 2 terms, k + 1 jumps; notes example, Example 7(a), 7(b)),
 *     unknown (three expressions: equal differences, or the middle is the mean; Example 8).
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
 * Warm-up: Fence Posts and Clock Chimes
 * ==================================================================================================== */
function bell(parent, x, y, s = 1) {
  const g = svgEl('g', { class: 'u1l2-bell', transform: `translate(${x} ${y}) scale(${s})` }, parent);
  const inner = svgEl('g', {}, g);
  svgEl('path', { d: 'M-13 9 Q-14 -14 0 -15 Q14 -14 13 9 Z', fill: '#e8b12f', stroke: '#8a5a00', 'stroke-width': 1.6 }, inner);
  svgEl('rect', { x: -16, y: 8, width: 32, height: 5, rx: 2.5, fill: '#c98f12', stroke: '#8a5a00', 'stroke-width': 1.2 }, inner);
  svgEl('circle', { cx: 0, cy: 16, r: 3.6, fill: '#8a5a00' }, inner);
  svgEl('circle', { cx: 0, cy: -16, r: 3, fill: '#8a5a00' }, inner);
  g.inner = inner; return g;
}
function mountYard() {
  const host = document.getElementById('u1l2-yard'); if (!host) return;
  const W = 600, H = 390, X0 = 52, X1 = 548, GY = 160, TY = 330;
  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, class: 'u1l2-yardsvg' }, host);
  const fx = (m) => X0 + (m / 12) * (X1 - X0);
  svgEl('rect', { x: 0, y: 0, width: W, height: GY, fill: '#eef5fb' }, svg);
  svgEl('rect', { x: 0, y: GY, width: W, height: 44, fill: '#dcebd2' }, svg);
  svgEl('line', { x1: 10, x2: W - 10, y1: GY, y2: GY, stroke: '#5b7a45', 'stroke-width': 3 }, svg);
  for (let m = 0; m <= 12; m++) {
    svgEl('line', { x1: fx(m), x2: fx(m), y1: GY, y2: GY + (m % 3 ? 6 : 11), stroke: '#3d5530', 'stroke-width': 2 }, svg);
    if (m % 3 === 0) svgEl('text', { x: fx(m), y: GY + 32, 'text-anchor': 'middle', class: 'u1l2-ytk' }, svg).textContent = m + ' m';
  }
  const fence = svgEl('g', {}, svg), chimes = svgEl('g', {}, svg);
  const c1 = svgEl('text', { x: 16, y: 32, class: 'u1l2-ytxt' }, svg), c2 = svgEl('text', { x: 16, y: 236, class: 'u1l2-ytxt' }, svg);
  svgEl('line', { x1: 0, x2: W, y1: 206, y2: 206, stroke: '#e2ddd1', 'stroke-width': 2 }, svg);
  const st = { busy: false };
  const reset = () => { fence.innerHTML = ''; chimes.innerHTML = ''; c1.textContent = 'Fence: press Build'; c2.textContent = 'Chimes: press Ring'; };
  const run = (fn) => async () => { if (st.busy) return; st.busy = true; try { await fn(liveCtx()); } finally { st.busy = false; } };
  document.getElementById('u1l2-build').addEventListener('click', run(async (c) => {
    fence.innerHTML = '';
    for (let i = 0; i <= 4; i++) {
      const m = 3 * i;
      if (i) for (const y of [GY - 58, GY - 30]) {
        const r = svgEl('path', { d: `M${fx(m - 3) + 7} ${y} L${fx(m) - 7} ${y}`, class: 'bk-stroke', stroke: '#b07a43', 'stroke-width': 7, 'stroke-linecap': 'round' }, fence);
        await drawIn(r, 260, c);
      }
      const g = svgEl('g', {}, fence);
      svgEl('rect', { x: fx(m) - 8, y: GY - 80, width: 16, height: 80, rx: 2, fill: '#7a4a24', stroke: '#4a2c12', 'stroke-width': 1.5 }, g);
      svgEl('path', { d: `M${fx(m) - 8} ${GY - 80} L${fx(m)} ${GY - 92} L${fx(m) + 8} ${GY - 80} Z`, fill: '#7a4a24', stroke: '#4a2c12', 'stroke-width': 1.5 }, g);
      await pop(c, g, 300);
      c1.textContent = `posts: ${i + 1}     rails: ${i}`;
      await sleep(c, 220);
    }
    c1.textContent = 'posts: 5     rails: 4   (one fewer!)';
  }));
  const ring = (k) => run(async (c) => {
    chimes.innerHTML = '';
    const secs = k - 1, tx = (s) => X0 + (s / secs) * (X1 - X0);
    svgEl('line', { x1: X0 - 14, x2: X1 + 14, y1: TY, y2: TY, stroke: INK, 'stroke-width': 2.5 }, chimes);
    for (let s = 0; s <= secs; s++) {
      svgEl('line', { x1: tx(s), x2: tx(s), y1: TY - 6, y2: TY + 6, stroke: INK, 'stroke-width': 2 }, chimes);
      svgEl('text', { x: tx(s), y: TY + 26, 'text-anchor': 'middle', class: 'u1l2-ytk' }, chimes).textContent = s + ' s';
    }
    for (let i = 0; i < k; i++) {
      if (i) {
        const a = svgEl('path', { d: `M${tx(i - 1) + 6} ${TY - 12} Q${(tx(i - 1) + tx(i)) / 2} ${TY - 30} ${tx(i) - 6} ${TY - 12}`, class: 'bk-stroke', fill: 'none', stroke: AMB, 'stroke-width': 2.6 }, chimes);
        await drawIn(a, k > 6 ? 150 : 240, c);
      }
      const b = bell(chimes, tx(i), TY - 58, k > 6 ? 0.8 : 1);
      await pop(c, b.inner, 260);
      c2.textContent = `chimes: ${i + 1}     gaps: ${i}     time: ${i} s`;
      await sleep(c, k > 6 ? 90 : 200);
    }
    c2.textContent = `chimes: ${k}     gaps: ${k - 1}     time: ${k - 1} s`;
  });
  document.getElementById('u1l2-ring6').addEventListener('click', ring(6));
  document.getElementById('u1l2-ring12').addEventListener('click', ring(12));
  document.getElementById('u1l2-wreset').addEventListener('click', () => { if (!st.busy) reset(); });
  reset();
}

/* ====================================================================================================
 * Toothpick squares (Example 5 figure and the toothpicks explainer)
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

/* =============================== explainer: the common difference =============================== */
const DH = {
  a: { lab: '(a)', terms: ['13', '21', '29', '37'], diffs: ['8', '8', '8'], d: '8', next: ['45', '53'] },
  b: { lab: '(b)', terms: ['6', '1.5', '-3', '-7.5'], diffs: ['-4.5', '-4.5', '-4.5'], d: '-4.5', next: ['-12', '-16.5'] },
  c: { lab: '(c)', terms: ['\\frac{1}{3}', '\\frac{5}{6}', '\\frac{4}{3}', '\\frac{11}{6}'], six: ['\\frac{2}{6}', '\\frac{5}{6}', '\\frac{8}{6}', '\\frac{11}{6}'],
    diffs: ['\\frac{3}{6}', '\\frac{3}{6}', '\\frac{3}{6}'], d: '\\frac{1}{2}', next: ['\\frac{14}{6}', '\\frac{17}{6}'] },
  d: { lab: '(d)', terms: ['3', '6', '12', '24'], diffs: ['3', '6', '12'], no: true },
  e: { lab: '(e)', terms: ['4a+b', '7a-b', '10a-3b'], diffs: ['3a-2b', '3a-2b'], d: '3a-2b', next: ['13a-5b', '16a-7b'] },
  f: { lab: '(f)', terms: ['2', '5', '9', '14'], diffs: ['3', '4', '5'], no: true },
  pair: { lab: 'One pair isn’t enough', terms: ['1', '3', '5', '9'], diffs: ['2', '2', '4'], no: true, pair: true }
};
const hopT = (s) => (s.startsWith('-') ? s : '+' + (needP(s) ? `(${s})` : s));
const diffHops = {
  title: 'Find the common difference',
  height: 330,
  minW: 860,
  choices: [{ sep: 'Example 1:' }, ...['a', 'b', 'c', 'd', 'e', 'f'].map((k) => ({ v: k, label: DH[k].lab })), { sep: 'Watch out:' }, { v: 'pair', label: DH.pair.lab }],
  ask: (v) => (v === 'pair' ? `Is ${T('1,\\ 3,\\ 5,\\ 9,\\ \\dots')} arithmetic?` : `Example 1${DH[v].lab}: is ${T(DH[v].terms.join(',\\ ') + ',\\ \\dots')} arithmetic? If so, find ${T('d')} and the next two terms.`),
  make(stage, v, ex) {
    const D = DH[v], W = ex.W, k = D.terms.length, slots = D.no ? k : k + 2;
    const svg = overlay(stage, W, 330);
    const R = rowFor(stage, W, slots, 96, { gap: 40, max: 150, subs: Array.from({ length: slots }, (_, i) => T(cN(`t_${i + 1}`))) });
    D.terms.forEach((t, i) => R.set(i, T(i ? t : cT(t)), i ? '' : 'u1l2-c1'));
    for (let i = k; i < slots; i++) { R.cells[i].classList.add('u1l2-cnext'); hide(R.cells[i]); hide(R.subs[i]); }
    const cur = D.six || D.terms;
    const verdict = add(stage, box(h('div', 'u1l2-verdict'), W - 260), 30, 236); hide(verdict);
    const hops = [];
    const doHop = async (c, i, red) => {
      const r = await hopArc(c, stage, svg, R.cx(i) + 14, R.cx(i + 1) - 14, R.top, T(hopT(D.diffs[i]).replace('\\frac', '\\dfrac')), { hgt: 30, color: red ? RED : AMB });
      hops.push(r); return r;
    };
    const work = (i) => `${subT(cur[i + 1], cur[i])}=${D.diffs[i]}`;
    const steps = [];
    if (D.six) steps.push({ cap: `Fractions: rewrite every term with the <b>same denominator</b>, sixths. Then subtracting is easy.`,
      run: async (c) => { for (let i = 0; i < k; i++) { R.set(i, T(i ? D.six[i] : cT(D.six[i]))); await pop(c, R.cells[i], 260); } } });
    steps.push({ cap: `Subtract each term from the one <b>after</b> it: ${T(work(0))}.`, run: (c) => doHop(c, 0) });
    if (D.pair) {
      steps.push({ cap: `Next pair: ${T(work(1))}. So far, so good…`, run: (c) => doHop(c, 1) });
      steps.push({ cap: `Last pair: ${T(work(2))}. <b>Not</b> the same as the others!`, run: (c) => doHop(c, 2, true) });
      steps.push({ cap: `Two matching differences were <b>not enough</b>: check <b>every</b> difference. ${T('1,3,5,9')} is <b>not arithmetic</b>.`,
        run: async (c) => { verdict.innerHTML = `Differences ${T('2,\\ 2,\\ ' + cX('4'))}: not all equal`; await show(c, verdict); await stampIn(c, stamp(stage, 'Not arithmetic', { ok: false, x: W - 160, y: 266 })); } });
      return steps;
    }
    steps.push({ cap: `Do the same for <b>every</b> pair: ${D.diffs.slice(1).map((s, i) => T(work(i + 1))).join(' and ')}.`,
      run: async (c) => { for (let i = 1; i < k - 1; i++) await doHop(c, i); } });
    if (D.no) {
      steps.push({ cap: `The differences ${T(D.diffs.join(',\\ '))} are <b>not all equal</b>, so the sequence is <b>not arithmetic</b>.`,
        run: async (c) => {
          hops.forEach((r, i) => { if (i) { r.l.style.color = RED; r.g.path.setAttribute('stroke', RED); r.g.head.setAttribute('fill', RED); } });
          verdict.innerHTML = `Differences ${T(D.diffs.join(',\\ '))}: not equal`; await show(c, verdict);
          await stampIn(c, stamp(stage, 'Not arithmetic', { ok: false, x: W - 160, y: 266 }));
        } });
      return steps;
    }
    steps.push({ cap: `All the differences are equal: <b>arithmetic</b>, with ${T(cD('d=' + D.d))}${D.six ? ` (${T('\\frac{3}{6}=\\frac{1}{2}')})` : ''}.`,
      run: async (c) => {
        verdict.innerHTML = `${T(`${cD('d')}=t_2-t_1=${D.diffs[0]}${D.six ? '=' + D.d : ''}`)}`; await show(c, verdict);
        await stampIn(c, stamp(stage, 'Arithmetic', { ok: true, x: W - 150, y: 266 }));
      } });
    const dP = needP(D.diffs[0]) ? `(${D.diffs[0]})` : D.diffs[0];
    steps.push({ cap: `Next two terms: keep adding ${T(cD('d'))}. ${T(`${cur[k - 1]}+${dP}=${D.next[0]}${D.six ? '=\\frac{7}{3}' : ''}`)}, then ${T(`${D.next[0]}+${dP}=${D.next[1]}`)}.`,
      run: async (c) => {
        for (let j = 0; j < 2; j++) {
          const i = k + j; await hopArc(c, stage, svg, R.cx(i - 1) + 14, R.cx(i) - 14, R.top, T(hopT(D.diffs[0]).replace('\\frac', '\\dfrac')), { hgt: 30 });
          R.set(i, T(D.next[j])); await show(c, R.cells[i], 260); await show(c, R.subs[i], 200);
        }
      } });
    return steps;
  }
};

/* =============================== explainer (STAR): why n − 1 jumps =============================== */
const JP = {
  small: { lab: T('3,7,11,\\dots') + ' to ' + T('t_6'), t1: 3, d: 4, n: 6, min: -1, max: 26, step: 1 },
  ex2: { lab: 'Example 2(b): ' + T('t_{30}'), t1: 41, d: -7, n: 30, min: -172, max: 50, step: 10 }
};
const jumps = {
  title: 'From t₁ to tₙ: count the jumps',
  height: 430,
  minW: 880,
  choices: Object.keys(JP).map((k) => ({ v: k, label: JP[k].lab })),
  ask: (v) => (v === 'small' ? `How many jumps of ${T(cD('d=4'))} take ${T(cT('t_1=3'))} to ${T('t_6')} in ${T('3,\\ 7,\\ 11,\\ \\dots')}?` : `Example 2(b): find ${T('t_{30}')} for ${T('41,\\ 34,\\ 27,\\ 20,\\ \\dots')} by counting the jumps.`),
  make(stage, v, ex) {
    const D = JP[v], W = ex.W, big = D.n > 8, n = D.n;
    const vals = Array.from({ length: n }, (_, i) => D.t1 + i * D.d), last = vals[n - 1];
    const NL = new NumberLine(stage, { x: 10, y: 0, width: W - 20, height: 204, min: D.min, max: D.max, step: D.step, numbers: false, axisY: 126 });
    const dots = [], tlabs = [];
    const labelled = (i) => !big || i < 3 || i === n - 1;
    vals.forEach((t, i) => {
      if (!labelled(i)) { tlabs.push(null); return; }
      const d = h('div', 'u1l2-tlab' + (big ? ' u1l2-tlab-sm' : ''), `<div class="u1l2-tv">${T(i === 0 ? cT(N(t)) : i === n - 1 ? cB(N(t)) : N(t))}</div>${big && i > 0 && i < n - 1 ? '' : `<div>${T(cN(`t_{${i + 1}}`))}</div>`}`);
      NL.html.appendChild(d); place(d, NL.toPx(t), NL.ay + 12, 's', 0); hide(d); tlabs.push(d);
    });
    const PY = 214, LW = Math.round(W * 0.5) - 20;
    const left = panel(stage, 14, PY, LW, 206, 'u1l2-plist', `<div class="u1l2-ph">Jumps from ${T('t_1')}</div>`);
    const rows = [];
    const rowTex = (i) => `t_{${i + 1}}=${cT(N(D.t1))}+${cN(i)}${cD(Q(D.d))}${i === n - 1 ? '=' + cB(N(last)) : ''}`;
    const shown = big ? [0, 1, 2, -1, n - 1] : vals.map((_, i) => i);
    shown.forEach((i) => { const d = h('div', 'u1l2-ln' + (i < 0 ? ' u1l2-vd' : ''), i < 0 ? '⋮' : T(rowTex(i))); hide(d); left.appendChild(d); rows[i < 0 ? 'dots' : i] = d; });
    const right = panel(stage, LW + 28, PY, W - LW - 42, 206, 'u1l2-pr');
    right.innerHTML = `<div class="u1l2-count"><div><span class="u1l2-ck">terms</span><b class="u1l2-cv">0</b></div><div class="u1l2-cj"><span class="u1l2-ck">jumps</span><b class="u1l2-cv">0</b></div></div>
      <div class="u1l2-legend1">1 jump = ${T(cD('d=' + N(D.d)))}</div><div class="u1l2-fbox"></div>`;
    const [cTerms, cJumps] = right.querySelectorAll('.u1l2-cv'), fbox = right.querySelector('.u1l2-fbox'), jcell = right.querySelector('.u1l2-cj');
    hide(right.querySelector('.u1l2-legend1')); hide(fbox);
    const setCount = (t, j) => { cTerms.textContent = t; cJumps.textContent = j; };
    const hops = [];
    const dot = async (c, i) => {
      const p = NL.point(vals[i], { color: i === 0 ? TEAL : i === n - 1 ? BRD : INK, r: big ? 6 : 8 }); dots[i] = p;
      await pop(c, p, 220); if (tlabs[i]) await show(c, tlabs[i], 200);
      if (rows[i]) await show(c, rows[i], 200);
      setCount(i + 1, i);
    };
    const jump = async (c, i, ms) => { // the jump from term i-1 to term i
      const r = await NL.hop(c, vals[i - 1], vals[i], { label: labelled(i) || i === n - 1 ? `<span class="u1l2-jn">${i}</span>` : null, height: big ? 20 : 56, ms, color: AMB });
      hops.push(r); await dot(c, i);
    };
    const fT = `t_n=${cT('t_1')}+(${cN('n')}-1)${cD('d')}`;
    const fillF = `${T(fT)}<div class="u1l2-fsub">${T(`t_{${n}}=${cT(N(D.t1))}+(${cN(n)}-1)${cD(Q(D.d))}=${N(D.t1)}${D.d * (n - 1) < 0 ? '-' : '+'}${N(Math.abs(D.d * (n - 1)))}=${cB(N(last))}`)}</div>`;
    const steps = [
      { cap: `Start on the first term, ${T(cT(`t_1=${N(D.t1)}`))}. Standing on ${T('t_1')} takes <b>0 jumps</b>.`, run: (c) => dot(c, 0) },
      { cap: `One jump of ${T(cD(`d=${N(D.d)}`))}${D.d < 0 ? ' (a step <b>left</b>: d is negative)' : ''} lands on ${T(`t_2=${N(vals[1])}`)}: <b>1 jump</b> to reach position 2.`,
        run: async (c) => { await show(c, right.querySelector('.u1l2-legend1')); await jump(c, 1); } },
      { cap: `Two jumps reach ${T(`t_3=${N(vals[2])}`)}. The jump count is always <b>one behind</b> the position.`, run: (c) => jump(c, 2) }
    ];
    if (!big) steps.push({ cap: `Keep going: ${T('t_4,\\ t_5,\\ t_6')}. Reaching ${T('t_6')} takes <b>5 jumps</b>.`, run: async (c) => { for (let i = 3; i < n; i++) await jump(c, i); } });
    else steps.push({ cap: `Keep jumping, all the way to ${T(`t_{${n}}`)}. Watch the jump counter…`,
      run: async (c) => { if (rows.dots) await show(c, rows.dots, 150); for (let i = 3; i < n; i++) await jump(c, i, 70); } });
    steps.push({ cap: `<b>${n} terms</b>, but only <b>${n - 1} jumps</b>: the jumps sit <b>between</b> the terms, like rails between fence posts. ${T('t_1')} needs none.`,
      run: async (c) => { jcell.classList.add('u1l2-hot'); await pulse(c, jcell, 1.12); } });
    steps.push({ cap: `So ${T('t_n')} is ${T(cT('t_1'))} plus ${T(cN('(n-1)'))} jumps of ${T(cD('d'))}: ${T(fT)}. Here ${T(`t_{${n}}=${N(D.t1)}+${n - 1}${Q(D.d)}=${N(last)}`)}.`,
      run: async (c) => { fbox.innerHTML = fillF; await show(c, fbox); } });
    return steps;
  }
};

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

/* =============================== explainer: going both ways from a middle term =============================== */
const BW = {
  a: { lab: 'Example 3(a)', n: 6, k: 4, v: 11, d: -3 },
  b: { lab: 'Example 3(b)', n: 5, k: 4, v: 4, d: 2.5 }
};
const bothWays = {
  title: 'Right: add d. Left: subtract d.',
  height: 350,
  minW: 860,
  choices: Object.keys(BW).map((k) => ({ v: k, label: BW[k].lab })),
  ask: (v) => (v === 'a' ? `Example 3(a): ${T('t_4=11')} and ${T('d=-3')}. Write the first six terms.` : `Example 3(b): fill in the missing terms, with ${T('d=2.5')} and ${T('t_4=4')}.`),
  make(stage, v, ex) {
    const D = BW[v], W = ex.W, vals = Array.from({ length: D.n }, (_, i) => D.v + (i + 1 - D.k) * D.d), kk = D.k - 1;
    const svg = overlay(stage, W, 350);
    const R = rowFor(stage, W, D.n, 92, { gap: 46, max: 130, subs: vals.map((_, i) => T(cN(`t_${i + 1}`))) });
    vals.forEach((_, i) => R.set(i, '?', 'u1l2-cq'));
    R.set(kk, T(cB(N(D.v)))); R.cells[kk].classList.remove('u1l2-cq'); R.cells[kk].classList.add('u1l2-cgiven');
    const fill = async (c, i) => { const cl = R.cells[i]; cl.classList.remove('u1l2-cq'); R.set(i, T(i === 0 ? cT(N(vals[i])) : N(vals[i]))); await pop(c, cl, 260); };
    const right = vals.slice(D.k), leftV = vals.slice(0, kk).reverse();
    const box1 = add(stage, box(h('div', 'u1l2-note u1l2-short'), W - 80), 40, 292); hide(box1);
    return [
      { cap: `We know ${T(cB(`t_${D.k}=${N(D.v)}`))} and ${T(cD(`d=${N(D.d)}`))}.`, run: (c) => pulse(c, R.cells[kk], 1.08) },
      { cap: `Going <b>right</b>, add ${T('d')}: ${right.map((x, j) => T(`${N(j ? right[j - 1] : D.v)}+${P(D.d)}=${N(x)}`)).join(', then ')}.`,
        run: async (c) => { for (let i = D.k; i < D.n; i++) { await hopArc(c, stage, svg, R.cx(i - 1) + 14, R.cx(i) - 14, R.top, T(sgn(D.d)), { hgt: 30 }); await fill(c, i); } } },
      { cap: `Going <b>left</b>, undo it: <b>subtract</b> ${T('d')}${D.d < 0 ? ` (subtracting ${T(N(D.d))} adds ${T(N(-D.d))})` : ''}: ${T(leftV.map(N).join(',\\ '))}.`,
        run: async (c) => { for (let i = kk - 1; i >= 0; i--) { await hopArc(c, stage, svg, R.cx(i + 1) - 22, R.cx(i) + 22, R.bot + 2, T(sgn(-D.d)), { hgt: 26, below: true, color: TEAL }); await fill(c, i); } } },
      { cap: `The sequence: ${T(vals.map(N).join(',\\ '))}. Every step to the right is ${T(sgn(D.d))} ✓`,
        run: async (c) => { for (const cl of R.cells) await pulse(c, cl, 1.06, 220); } },
      { cap: `Shortcut: ${T(cT('t_1'))} is ${T(String(D.k - 1))} jumps <b>back</b> from ${T(`t_${D.k}`)}: ${T(`t_1=${N(D.v)}-${D.k - 1}${Q(D.d)}=${N(vals[0])}`)}.`,
        run: async (c) => { box1.innerHTML = `${T(`t_1=t_${D.k}-(${D.k}-1)${cD('d')}=${N(D.v)}-${D.k - 1}${cD(Q(D.d))}=${cT(N(vals[0]))}`)}`; await show(c, box1); } }
    ];
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
    steps.push({ cap: `The terms are the posts: <b>one more</b> than the jumps, because ${T('t_1')} counts too. ${T(`${N(J)}+1=${N(n)}`)} ${v === 'b' ? 'multiples' : 'terms'}.`,
      run: async (c) => { await show(c, cr[2]); await pulse(c, cr[2], 1.08); } });
    steps.push({ cap: `Same thing with the formula: substitute into ${T('t_n=t_1+(n-1)d')} and solve: ${T(`n=${N(n)}`)}.`,
      run: async (c) => { await show(c, L[0]); await show(c, L[1]); } });
    return steps;
  }
};

/* =============================== explainer: toothpick squares =============================== */
const toothpicks = {
  title: 'Toothpick squares: 4, 7, 10, 13, …',
  height: 400,
  minW: 860,
  choices: [{ v: 'build', label: 'Example 5(a): build it' }, { v: 'bc', label: 'Example 5(b)–(c)' }],
  ask: (v) => (v === 'build' ? 'Example 5(a): toothpicks for 1, 2, 3 and 4 squares, and the general term.' : 'Example 5(b) 40 squares? (c) The longest row from a box of 200 toothpicks, and how many are left over?'),
  make(stage, v, ex) {
    const W = ex.W, svg = overlay(stage, W, 400);
    if (v === 'build') {
      const u = 90, x0 = 40, y0 = 50, sq = [];
      const tb = new ValueTable(stage, { x: W - 350, y: 16, headers: ['\\text{squares}', '\\text{toothpicks}'], rows: [[1, 4], [2, 7], [3, 10], [4, 13]], hide: 1, tap: false, cellW: 120, cellH: 48, diffs: true, diffSpace: 64 });
      const L = lines(stage, 30, 260, W - 400, [T(`${cT('t_1=4')},\\quad ${cD('d=3')}`), T(`t_n=${cT('4')}+(n-1)${cD('(3)')}=4+3n-3=\\boxed{3n+1}`)], 'u1l2-alg');
      const tags = [];
      const build = async (c, i) => { const s = squareSticks(svg, x0, y0, u, i, i ? AMB : TEAL, i === 0); sq.push(s); for (const k of s) await drawIn(k, 160, c); await tb.reveal(i, 1, c); };
      return [
        { cap: `1 square: <b>4</b> toothpicks.`, run: (c) => build(c, 0) },
        { cap: `2 squares: the new square <b>shares</b> a side, so it needs only <b>3</b> more: ${T('4+3=7')}.`, run: (c) => build(c, 1) },
        { cap: `3 squares: 10. 4 squares: 13. Each new square adds 3 toothpicks, so ${T(cD('d=3'))}.`, run: async (c) => { await build(c, 2); await build(c, 3); await tb.diffs(c, { col: 1 }); } },
        { cap: `Arithmetic with ${T(cT('t_1=4'))} and ${T(cD('d=3'))}: ${T('t_n=4+(n-1)(3)=3n+1')}.`, run: async (c) => { await show(c, L[0]); await show(c, L[1]); } },
        { cap: `See ${T('3n+1')} in the picture: <b>1</b> starting toothpick, then <b>3</b> for every square (a ⊐ shape).`,
          run: async (c) => {
            recolor(sq[0][0], GRAY);
            sq.forEach((s, i) => s.slice(i ? 0 : 1).forEach((k) => recolor(k, i % 2 ? BLU : AMB)));
            tags.push(lab(stage, '<b>1</b>', x0, y0 + u + 26, 'c', 'u1l2-sqtag u1l2-sqtag1'));
            for (let i = 0; i < 4; i++) tags.push(lab(stage, '<b>3</b>', x0 + i * u + u / 2 + 8, y0 + u + 26, 'c', 'u1l2-sqtag'));
            for (const t of tags) await pop(c, t, 200);
          } }
      ];
    }
    // (b)–(c): a long row, then the box of 200
    const u = 50, x0 = 30, y0 = 30, items = [];
    for (let i = 0; i < 5; i++) items.push(...squareSticks(svg, x0, y0, u, i, PICK, i === 0));
    const dx = x0 + 5 * u + 60;
    for (let i = 0; i < 2; i++) items.push(...squareSticks(svg, dx, y0, u, i, PICK, i === 0));
    const ell = lab(stage, T('\\cdots'), x0 + 5 * u + 30, y0 + u / 2, 'c', 'u1l2-dots');
    const brace = lab(stage, '40 squares', (x0 + dx + 2 * u) / 2, y0 + u + 14, 's', 'u1l2-brace');
    const row = [ell, brace, ...items]; row.forEach(hide);
    const L = lines(stage, 30, 150, W - 330, [
      T(`t_{40}=3(40)+1=${cB('121')}`),
      T('3n+1=200\\ \\Rightarrow\\ 3n=199\\ \\Rightarrow\\ n=66.\\overline{3}'),
      T(`\\text{round down:}\\ \\ n=${cN('66')}\\ \\text{squares}`),
      T(`t_{66}=3(66)+1=199,\\qquad 200-199=${cB('1')}\\ \\text{left over}`)
    ], 'u1l2-alg');
    const boxEl = panel(stage, W - 280, 160, 250, 210, 'u1l2-tbox', '<div class="u1l2-ph">A box of 200</div>');
    const bs = svgEl('svg', { viewBox: '0 0 230 150', width: 230, height: 150 }, boxEl);
    svgEl('rect', { x: 20, y: 30, width: 190, height: 100, rx: 10, fill: '#f6e7cf', stroke: '#a8743f', 'stroke-width': 3 }, bs);
    for (let i = 0; i < 18; i++) stick(bs, 32 + i * 9.5, 42, 32 + i * 9.5, 118, PICK, 4);
    const spare = stick(bs, 70, 14, 170, 14, RED, 6); hide(spare);
    const sl = h('div', 'u1l2-spare', '1 left over'); boxEl.appendChild(sl); hide(sl);
    hide(boxEl);
    return [
      { cap: `(b) A row of 40 squares: ${T('t_{40}=3(40)+1=121')} toothpicks.`, run: async (c) => { for (const e of row) e.style.opacity = 1; await appear(c, svg, 300); await show(c, L[0]); } },
      { cap: `(c) A box of 200 toothpicks: solve ${T('3n+1=200')}. ${T('n=66.\\overline{3}')} is not a natural number.`, run: async (c) => { await show(c, boxEl); await show(c, L[1]); } },
      { cap: `You can’t build a third of a square, so round <b>down</b>: the longest row is <b>66 squares</b>.`, run: (c) => show(c, L[2]) },
      { cap: `${T('t_{66}=3(66)+1=199')} toothpicks are used, so <b>1</b> is left over.`, run: async (c) => { await show(c, L[3]); await appear(c, spare, 300); await show(c, sl); } }
    ];
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
mountYard();
mountFigures();
export const explainers = mountExplainers({ diffHops, jumps, generalTerm, isTerm, bothWays, countTerms, toothpicks, findPart, means, unknown });
export const _test = { lin, DH, JP, GT, IT, BW, CT, FP, MN };
void fmt; void tween; void GRN; void cG; void RED;

