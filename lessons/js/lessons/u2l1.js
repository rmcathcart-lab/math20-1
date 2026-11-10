/* Math 20-1 · Unit 2 · Lesson 1 — Mixed and Entire Radicals.
 * Warm-up (Tilted Squares on a dot grid: box-and-corners areas 9, 2, 8; two of B's sides lie along C, so √8 = 2√2),
 * the Example 10 grid, a Stand Up Break, and the explainers:
 *   rootFind (what number, used n times? fill n factor boxes; principal root; even index + negative = not real;
 *     Example 1 checks),
 *   ladder (the ladder of perfect powers: the radicand lands on a rung (rational) or between two (irrational, between
 *     k and k + 1); fractions use two ladders; Example 2 checks),
 *   underOne (two roots slide under one radical sign for × and ÷; √9 + √16 vs √25 with unit squares),
 *   trueFalse (Example 3 checks: left side vs right side, TRUE / FALSE stamp),
 *   tiles (a square of area 48 cut into 16 tiles of area 3: side = 4√3),
 *   hunt (the star: hunt the perfect-power factors of the radicand, the largest splits off and ESCAPES the root sign
 *     as the coefficient; Example 4 checks),
 *   primes (prime factors inside the root; pairs / triples escape as one factor; Example 5(a)(b) checks),
 *   simplest (simplest-form check: hunt again; Kai's 2√18, Example 5(c)),
 *   copies (copies of √3 ≈ 1.732 on a number line; Example 6 checks),
 *   goIn (mixed → entire: the coefficient is raised to the index and goes back IN; Example 7 checks),
 *   order (cards become entire radicals, radicands on a number line, cards re-sort; Example 8 checks),
 *   context (exact lengths: floor tiles, planter cube, hypotenuse, distance on a grid; Examples 9 and 10 checks).
 * Colours (Unit 2): radicand (what stays under the root) blue #1f5bd6; coefficient (the number in front) and the
 * perfect-power factor that becomes it amber #c27a0e; index purple #7b4fc4; misses red. No calculator in this unit. */
import {
  h, tex, add, box, Graph, NumberLine, stamp, stampIn, mountExplainers, pop, fadeIn, appear, sleep, tween,
  svgEl, liveCtx, pulse, place, drawIn, shake, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const RAD = '#1f5bd6', CO = '#c27a0e', IDX = '#7b4fc4', BR = '#7a1f3d', RED = COLORS.red, OK = COLORS.green, INK = COLORS.ink, GRAY = COLORS.gray;
const cR = (s) => `\\textcolor{${RAD}}{${s}}`, cC = (s) => `\\textcolor{${CO}}{${s}}`, cI = (s) => `\\textcolor{${IDX}}{${s}}`, cX = (s) => `\\textcolor{${RED}}{${s}}`;
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const show = (c, el, ms = 320) => fadeIn(c, el, ms);
const lab = (stage, html, cls, x, y, pos = 'c', gap = 0) => { const d = h('div', 'u2l1-lab ' + (cls || ''), html); stage.appendChild(d); place(d, x, y, pos, gap); return d; };
const panel = (stage, x, y, w, hh, title, cls = '') => add(stage, box(h('div', 'u2l1-panel ' + cls, title ? `<div class="u2l1-ph">${title}</div>` : ''), w, hh), x, y);
/** an integer for TeX: real minus, thin space in numbers ≥ 1000 */
const tn = (v) => { const a = Math.abs(v), s = String(a); return (v < 0 ? '-' : '') + (a >= 1000 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : s); };
const rt = (n, s) => (n === 2 ? `\\sqrt{${s}}` : `\\sqrt[${n}]{${s}}`);
const POW = { 2: 'square', 3: 'cube', 4: 'fourth power', 5: 'fifth power' };
const POWS = { 2: 'squares', 3: 'cubes', 4: 'fourth powers', 5: 'fifth powers' };
const ROOTW = { 2: 'square root', 3: 'cube root', 4: 'fourth root', 5: 'fifth root' };
const GROUP = { 2: 'pair', 3: 'triple' };
const prod = (a) => a.reduce((p, x) => p * x, 1);
function primeFactors(n) { const out = []; let m = n; for (let p = 2; p * p <= m; p++) while (m % p === 0) { out.push(p); m /= p; } if (m > 1) out.push(m); return out; }
/** tile width (px) for an integer at font size fs */
const wNum = (v, fs) => { const d = String(Math.abs(v)).length; return Math.round(fs * (0.62 * d + 0.8) + (v < 0 ? fs * 0.62 : 0) + (Math.abs(v) >= 1000 ? fs * 0.2 : 0)); };
function stageSvg(stage) { return svgEl('svg', { class: 'u2l1-svg', width: '100%', height: '100%' }, stage); }

/* =========================================================================================================
 * Rad: a radical drawn big: coefficient tiles in front, the radical sign (with its index), radicand tiles under the
 * bar. set(c, out, in) slides every tile to its place (tiles crossing the sign can arc over it), fades in new tiles and
 * fades out dropped ones, and stretches the bar to fit.
 * ========================================================================================================= */
class Rad {
  constructor(stage, svg, o) {
    Object.assign(this, { stage, svg, xs: o.xs, y: o.y, th: o.th || 64, fs: o.fs || 34, n: o.n || 2 });
    this.g = svgEl('g', {}, svg);
    this.path = svgEl('path', { fill: 'none', stroke: INK, 'stroke-width': 4.6, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, this.g);
    if (this.n > 2) { this.ix = h('div', 'u2l1-idx', String(this.n)); stage.appendChild(this.ix); place(this.ix, this.xs + 15, this.y + this.th * 0.47, 'nw', 0); }
    this.xe = this.x0 + 40; this.vis = new Set(); this.draw();
  }
  get x0() { return this.xs + 50; }
  draw() { const { xs, y, th } = this, top = y - 11; this.path.setAttribute('d', `M${xs} ${y + th * 0.63} L${xs + 11} ${y + th * 0.52} L${xs + 26} ${y + th + 6} L${xs + 44} ${top} L${this.xe} ${top}`); }
  tile(html, kind = 'rad', w = 60) {
    const el = h('div', 'u2l1-rt u2l1-rt-' + kind, html);
    el.style.width = w + 'px'; el.style.height = this.th + 'px'; el.style.fontSize = this.fs + 'px'; el.style.opacity = 0;
    el._x = null; el._y = this.y; this.stage.appendChild(el); return el;
  }
  num(v, kind) { return this.tile(T(tn(v)), kind, wNum(v, this.fs)); }
  op(s = '\\times') { return this.tile(T(s), 'op', Math.round(this.fs * 0.85)); }
  /** show el at x right away (part of the starting picture) */
  put(el, x) { el._x = x; el._y = this.y; el.style.left = x + 'px'; el.style.top = this.y + 'px'; el.style.opacity = 1; this.vis.add(el); return el; }
  layout(out, inn, wOf) {
    const pos = new Map(); let x = this.xs - 14;
    for (let i = out.length - 1; i >= 0; i--) { x -= wOf(out[i]); pos.set(out[i], x); x -= 5; }
    x = this.x0; for (const e of inn) { pos.set(e, x); x += wOf(e) + 5; }
    return { pos, xe: Math.max(x + 6, this.x0 + 40) };
  }
  /** start state without animation */
  start(out, inn) { const { pos, xe } = this.layout(out, inn, (e) => parseFloat(e.style.width)); [...out, ...inn].forEach((e) => this.put(e, pos.get(e))); this.xe = xe; this.draw(); }
  async set(c, out, inn, o = {}) {
    const wm = new Map((o.morph || []).filter((m) => m[3]).map((m) => [m[0], m[3]]));
    const wOf = (e) => wm.get(e) || parseFloat(e.style.width);
    const { pos, xe } = this.layout(out, inn, wOf);
    const ms = o.ms ?? 700, arc = new Set(o.arc || []), lift = o.lift ?? 86, at = o.at || new Map(), to = o.to || new Map();
    const next = new Set([...out, ...inn]);
    const leaving = [...this.vis].filter((e) => !next.has(e)), entering = [...next].filter((e) => !this.vis.has(e));
    entering.forEach((e) => { e._x = at.has(e) ? at.get(e) : pos.get(e); e._y = this.y; });
    const all = [...next, ...leaving], from = new Map(all.map((e) => [e, e._x]));
    const dest = new Map(all.map((e) => [e, next.has(e) ? pos.get(e) : to.has(e) ? to.get(e) : e._x]));
    const xe0 = this.xe; let morphed = false;
    const fn = (t) => {
      for (const e of all) {
        const fx = from.get(e), tx = dest.get(e);
        e.style.left = (fx + (tx - fx) * t) + 'px';
        e.style.top = (this.y - (arc.has(e) ? lift * Math.sin(Math.PI * t) : 0)) + 'px';
      }
      entering.forEach((e) => (e.style.opacity = Math.min(1, t * 1.7))); leaving.forEach((e) => (e.style.opacity = Math.max(0, 1 - t * 1.4)));
      this.xe = xe0 + (xe - xe0) * t; this.draw();
      if (!morphed && t >= 0.5) {
        morphed = true;
        (o.morph || []).forEach(([e, html, kind, w]) => { e.innerHTML = html; if (kind) e.className = 'u2l1-rt u2l1-rt-' + kind; if (w) e.style.width = w + 'px'; });
      }
    };
    await tween(c, ms, fn);
    all.forEach((e) => (e._x = dest.get(e))); leaving.forEach((e) => (e.style.opacity = 0)); next.forEach((e) => (e.style.opacity = 1));
    this.vis = next;
  }
  right() { return this.xe; }
}

/** a working line: TeX pieces that appear one at a time */
function chain(stage, x, y, w, parts, cls = '') {
  const d = add(stage, box(h('div', 'u2l1-chain ' + cls), w, null), x, y);
  const sp = parts.map((p) => { const s = h('span', 'u2l1-cp', T(p)); hide(s); d.appendChild(s); return s; });
  return { d, sp, show: (c, i) => (sp[i] ? show(c, sp[i], 300) : Promise.resolve()) };
}

/* =========================================================================================================
 * Warm-up: Tilted Squares. Dot grid 0..12 × 0..5; A upright 3×3; B corners (5,1) (6,2) (5,3) (4,2) (area 2);
 * C corners (9,0) (11,2) (9,4) (7,2) (area 8). "Lay B's side along C": two copies of B's side cover C's side.
 * ========================================================================================================= */
function mountDots() {
  const host = document.getElementById('u2l1-dots'); if (!host) return;
  const U = 46, PX = 22, PY = 18, NX = 12, NY = 5, W = NX * U + 2 * PX, H = NY * U + 2 * PY + 30;
  const P = (x, y) => [PX + x * U, PY + (NY - y) * U];
  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, class: 'u2l1-dots-svg' }, host);
  svgEl('rect', { x: 0, y: 0, width: W, height: H, rx: 14, fill: '#fbf8f3' }, svg);
  const under = svgEl('g', {}, svg), shapes = svgEl('g', {}, svg), dotsG = svgEl('g', {}, svg), over = svgEl('g', {}, svg);
  for (let x = 0; x <= NX; x++) for (let y = 0; y <= NY; y++) { const [px, py] = P(x, y); svgEl('circle', { cx: px, cy: py, r: 3.6, fill: '#7d8494' }, dotsG); }
  const poly = (pts, fill, stroke, parent = shapes, extra = {}) => svgEl('polygon', Object.assign({ points: pts.map((p) => P(...p).join(',')).join(' '), fill, stroke, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, extra), parent);
  poly([[0, 1], [3, 1], [3, 4], [0, 4]], '#eceef3', '#3a4254');
  poly([[5, 1], [6, 2], [5, 3], [4, 2]], '#dfe8fb', RAD);
  poly([[9, 0], [11, 2], [9, 4], [7, 2]], '#efe7fa', IDX);
  const name = (t, x, y) => { const [px, py] = P(x, y); const e = svgEl('text', { x: px, y: py + 6, 'text-anchor': 'middle', class: 'u2l1-wname' }, over); e.textContent = t; return e; };
  name('A', 1.5, 2.5); name('B', 5, 2); name('C', 9, 2);
  // box and corners
  const boxG = svgEl('g', { opacity: 0 }, under);
  const boxR = (x0, y0, x1, y1) => { const [a, b] = P(x0, y1), [c2, d] = P(x1, y0); svgEl('rect', { x: a, y: b, width: c2 - a, height: d - b, fill: 'none', stroke: '#9a6a1c', 'stroke-width': 2.5, 'stroke-dasharray': '7 5' }, boxG); };
  boxR(4, 1, 6, 3); boxR(7, 0, 11, 4);
  const corner = (pts) => poly(pts, '#f6dcae', 'none', boxG, { 'stroke-width': 0 });
  [[[4, 1], [5, 1], [4, 2]], [[5, 1], [6, 1], [6, 2]], [[6, 2], [6, 3], [5, 3]], [[4, 2], [5, 3], [4, 3]]].forEach(corner);
  [[[7, 0], [9, 0], [7, 2]], [[9, 0], [11, 0], [11, 2]], [[11, 2], [11, 4], [9, 4]], [[7, 2], [9, 4], [7, 4]]].forEach(corner);
  const ctext = (t, x, y) => { const [px, py] = P(x, y); const e = svgEl('text', { x: px, y: py + 6, 'text-anchor': 'middle', class: 'u2l1-wcorner' }, boxG); e.textContent = t; };
  ctext('½', 4.3, 1.3); ctext('½', 5.7, 1.3); ctext('½', 5.7, 2.7); ctext('½', 4.3, 2.7);
  ctext('2', 7.6, 0.6); ctext('2', 10.4, 0.6); ctext('2', 10.4, 3.4); ctext('2', 7.6, 3.4);
  const areaNote = h('div', 'u2l1-wnote'); host.appendChild(areaNote); areaNote.style.opacity = 0;
  areaNote.innerHTML = `B: ${T('4-4\\left(\\tfrac12\\right)=2')} &nbsp;·&nbsp; C: ${T('16-4(2)=8')}`;
  // copies of B's side
  const layG = svgEl('g', {}, over);
  const tag = h('div', 'u2l1-wtag'); host.appendChild(tag); tag.style.opacity = 0; tag.innerHTML = `${T(cC('2') + '\\times' + cR('\\sqrt2') + '=\\sqrt8')}`;
  const st = { box: false, busy: false, laid: false };
  const ctx = liveCtx();
  document.getElementById('u2l1-box').onclick = async () => {
    if (st.busy) return; st.box = !st.box;
    boxG.setAttribute('opacity', st.box ? 1 : 0); areaNote.style.opacity = st.box ? 1 : 0;
  };
  document.getElementById('u2l1-lay').onclick = async () => {
    if (st.busy || st.laid) return; st.busy = true; st.laid = true;
    const segs = [[[4, 2], [5, 1], [7, 2], [8, 1]], [[4, 2], [5, 1], [8, 1], [9, 0]]];
    let k = 0;
    for (const [a0, b0, a1, b1] of segs) {
      k++;
      const ln = svgEl('line', { stroke: RAD, 'stroke-width': 9, 'stroke-linecap': 'round', opacity: 0.9 }, layG);
      const num = svgEl('text', { class: 'u2l1-wcount', 'text-anchor': 'middle' }, layG); num.textContent = k;
      await tween(ctx, 900, (t) => {
        const a = P(a0[0] + (a1[0] - a0[0]) * t, a0[1] + (a1[1] - a0[1]) * t), b = P(b0[0] + (b1[0] - b0[0]) * t, b0[1] + (b1[1] - b0[1]) * t);
        ln.setAttribute('x1', a[0]); ln.setAttribute('y1', a[1]); ln.setAttribute('x2', b[0]); ln.setAttribute('y2', b[1]);
        num.setAttribute('x', (a[0] + b[0]) / 2 - 16); num.setAttribute('y', (a[1] + b[1]) / 2 - 10);
      });
      await sleep(ctx, 150);
    }
    const [tx, ty] = P(8, 1); place(tag, tx - 30, ty + 30, 'sw', 0); await fadeIn(ctx, tag, 400);
    st.busy = false;
  };
  document.getElementById('u2l1-wreset').onclick = () => {
    if (st.busy) return; st.box = false; st.laid = false; boxG.setAttribute('opacity', 0); areaNote.style.opacity = 0; layG.innerHTML = ''; tag.style.opacity = 0;
  };
}

/* =========================================================================================================
 * explainer: what number, used n times? (Example 1)
 * ========================================================================================================= */
const RF = {
  a: { n: 2, x: 121, lab: '\\sqrt{121}', ex: 'Example 1(a)' },
  b: { n: 2, x: 49, out: true, lab: '-\\sqrt{49}', ex: 'Example 1(b)' },
  c: { n: 2, x: -49, lab: '\\sqrt{-49}', ex: 'Example 1(c)' },
  d: { n: 3, x: -125, lab: '\\sqrt[3]{-125}', ex: 'Example 1(d)' },
  e: { n: 4, x: 81, lab: '\\sqrt[4]{81}', ex: 'Example 1(e)' },
  f: { n: 4, x: -81, lab: '\\sqrt[4]{-81}', ex: 'Example 1(f)' },
  g: { n: 5, x: -1, lab: '\\sqrt[5]{-1}', ex: 'Example 1(g)' },
  h: { n: 3, frac: [8, 27], lab: '\\sqrt[3]{\\dfrac{8}{27}}', ex: 'Example 1(h)' },
  i: { n: 2, dec: true, x: 0.09, r: 0.3, lab: '\\sqrt{0.09}', ex: 'Example 1(i)' }
};
const rfChoices = [{ sep: 'Example 1 check:' }, ...'abcdefghi'.split('').map((k) => ({ v: k, label: `(${k}) ${T(RF[k].lab)}` }))];
const rootFind = {
  title: 'What number, used n times?',
  height: 400,
  choices: rfChoices,
  intro: (k) => `Evaluate ${T(RF[k].lab)} if it is a real number. Press <b>Next</b>.`,
  ask: (k) => `<b>${RF[k].ex}.</b> Evaluate ${T(RF[k].lab)} if possible.`,
  make(stage, k, ex) {
    const d = RF[k], W = ex.W, n = d.n;
    const BW = d.dec ? 100 : 84, BH = 74, OPW = 38;
    const rowW = n * BW + (n - 1) * OPW + 40 + 150, X0 = Math.max(20, (W - rowW) / 2);
    const fmtV = (v) => (d.dec ? String(v) : tn(v));
    function row(y, target) {
      const boxes = [], prods = [];
      for (let i = 0; i < n; i++) {
        const x = X0 + i * (BW + OPW);
        const b = add(stage, box(h('div', 'u2l1-fbox', '?'), BW, BH), x, y); hide(b); boxes.push(b);
        if (i > 0) { const o = lab(stage, T('\\times'), 'u2l1-fop', x - OPW / 2, y + BH / 2); hide(o); boxes.push(o); }
        if (i > 0) { const p = lab(stage, '', 'u2l1-fprod', x + BW / 2, y + BH + 10, 's', 0); hide(p); prods.push(p); }
      }
      const eq = lab(stage, T('=' + fmtV(target)), 'u2l1-feq', X0 + n * BW + (n - 1) * OPW + 18, y + BH / 2, 'e', 0); hide(eq);
      return { boxes: boxes.filter((b) => b.classList.contains('u2l1-fbox')), ops: boxes.filter((b) => !b.classList.contains('u2l1-fbox')), prods, eq };
    }
    const showRow = async (c, R) => { for (const b of R.boxes) { b.style.opacity = 1; } R.ops.forEach((o) => (o.style.opacity = 1)); await Promise.all(R.boxes.map((b) => pop(c, b, 300))); await show(c, R.eq); };
    async function fill(c, R, v, mult = (a, b) => a * b) {
      let p = v;
      for (let i = 0; i < n; i++) {
        const b = R.boxes[i]; b.innerHTML = T(v < 0 ? `(${fmtV(v)})` : fmtV(v)); b.classList.add('u2l1-fill'); await pop(c, b, 220);
        if (i > 0) { p = mult(p, v); const q = R.prods[i - 1]; q.innerHTML = T('\\to ' + fmtV(Math.round(p * 1e6) / 1e6)); q.style.opacity = 1; await pop(c, q, 200); }
      }
      return p;
    }
    const resY = d.frac ? 300 : 262;
    const res = lab(stage, '', 'u2l1-fres', W / 2, resY, 'c'); hide(res);
    const stOk = stamp(stage, '', { ok: true, x: W - 150, y: resY }); hide(stOk);
    const steps = [];
    const prodTex = (v) => Array(n).fill(v < 0 ? `(${fmtV(v)})` : fmtV(v)).join('\\times');
    if (d.frac) {
      const [p, q] = d.frac, a = Math.round(Math.cbrt(p)), b = Math.round(Math.cbrt(q));
      const R1 = row(30, p), R2 = row(150, q);
      const t1 = lab(stage, 'top', 'u2l1-ftag', X0 - 12, 30 + BH / 2, 'w'), t2 = lab(stage, 'bottom', 'u2l1-ftag', X0 - 12, 150 + BH / 2, 'w'); hide(t1); hide(t2);
      res.innerHTML = T(`${d.lab}=\\dfrac{${a}}{${b}}`); stOk.textContent = '✓ rational';
      steps.push({ cap: `A cube root of a fraction: find the cube root of the <b>top</b> and of the <b>bottom</b>.`, run: async (c) => { await showRow(c, R1); await showRow(c, R2); t1.style.opacity = 1; t2.style.opacity = 1; } });
      steps.push({ cap: `Top: ${T(`${prodTex(a)}=${p}`)}, so ${T(`\\sqrt[3]{${p}}=${a}`)}.`, run: (c) => fill(c, R1, a) });
      steps.push({ cap: `Bottom: ${T(`${prodTex(b)}=${q}`)}, so ${T(`\\sqrt[3]{${q}}=${b}`)}.`, run: (c) => fill(c, R2, b) });
      steps.push({ cap: `${T(`${d.lab}=\\dfrac{${a}}{${b}}`)}. Check: ${T(`\\left(\\tfrac{${a}}{${b}}\\right)^3=\\tfrac{${p}}{${q}}`)}.`, run: async (c) => { await show(c, res); await stampIn(c, stOk); } });
      return steps;
    }
    const R = row(46, d.x);
    const even = n % 2 === 0;
    if (d.x < 0 && even) {
      const kk = Math.round(Math.pow(-d.x, 1 / n)), kn = kk ** n;
      res.innerHTML = `${T(d.lab)} is <b>not a real number</b>`; const stNo = stamp(stage, 'not a real number', { ok: false, x: W / 2, y: resY + 62 }); hide(stNo);
      const miss = lab(stage, T(cX('\\ne' + tn(d.x))), 'u2l1-fmiss', X0 + n * BW + (n - 1) * OPW + 40, 46 + BH + 34, 'c'); hide(miss);
      steps.push({ cap: `${T(d.lab)} asks: what number, used as a factor <b>${n}</b> times, makes ${T(tn(d.x))}?`, run: (c) => showRow(c, R) });
      steps.push({ cap: `Try ${T(String(kk))}: ${T(`${prodTex(kk)}=${kn}`)}. Positive, not ${T(tn(d.x))}.`, run: async (c) => { await fill(c, R, kk); miss.style.opacity = 1; await pop(c, miss); } });
      steps.push({ cap: `Try ${T(String(-kk))}: ${T(`${prodTex(-kk)}=${kn}`)}. <b>Still positive!</b>`, run: async (c) => { R.prods.forEach((p) => (p.style.opacity = 0)); await fill(c, R, -kk); await shake(c, miss); } });
      steps.push({ cap: `An <b>even</b> number of equal factors is never negative. No real number works: ${T(d.lab)} is <b>not a real number</b>.`, run: async (c) => { await show(c, res); stNo.style.opacity = 1; await stampIn(c, stNo); } });
      return steps;
    }
    const x = d.x, r = d.dec ? d.r : Math.sign(x) * Math.round(Math.pow(Math.abs(x), 1 / n)), ans = d.out ? -r : r;
    res.innerHTML = T(`${d.lab}=${fmtV(ans)}`); stOk.textContent = '✓ ' + (d.out ? 'minus outside' : 'real root');
    const ask = d.out ? `The minus sign is <b>outside</b> the root. First find ${T('\\sqrt{49}')}: what number, used twice, makes 49?`
      : `${T(d.lab)} asks: what number, used as a factor <b>${n}</b> times, makes ${T(fmtV(x))}?`;
    steps.push({ cap: ask, run: (c) => showRow(c, R) });
    const tryCap = d.dec ? `Try ${T('0.3')}: ${T('0.3\\times0.3=0.09')} (${T('3\\times3=9')}, and two decimal places).`
      : `Try ${T(fmtV(r))}: ${T(`${prodTex(r)}=${tn(x)}`)} ✓` + (x < 0 ? ' An <b>odd</b> number of negatives multiplies to a negative.' : '');
    steps.push({ cap: tryCap, run: (c) => fill(c, R, r, d.dec ? (a, b) => Math.round(a * b * 1e6) / 1e6 : undefined) });
    const endCap = d.out ? `${T('\\sqrt{49}=7')}, so ${T('-\\sqrt{49}=-7')}. The root is fine; the minus in front makes the answer negative.`
      : k === 'a' ? `${T('\\sqrt{121}=11')}. (${T('(-11)^2=121')} too, but ${T('\\sqrt{\\phantom{x}}')} means the <b>principal</b>, non-negative root.)`
        : `${T(`${d.lab}=${fmtV(ans)}`)}.` + (x < 0 ? ` An odd index allows a negative radicand.` : '');
    steps.push({ cap: endCap, run: async (c) => { await show(c, res); await stampIn(c, stOk); } });
    return steps;
  }
};

/* =========================================================================================================
 * explainer: the ladder of perfect powers (Example 2)
 * ========================================================================================================= */
const LD = {
  50: { n: 2, v: 50, lab: '\\sqrt{50}', ex: 'Example 2(a)(i) and (b)(i)' },
  m216: { n: 3, v: -216, lab: '\\sqrt[3]{-216}', ex: 'Example 2(a)(ii)' },
  f4964: { n: 2, frac: [49, 64], lab: '\\sqrt{\\dfrac{49}{64}}', ex: 'Example 2(a)(iii)' },
  q40: { n: 4, v: 40, lab: '\\sqrt[4]{40}', ex: 'Example 2(a)(iv)' },
  d04: { n: 2, frac: [2, 5], dec: '0.4', lab: '\\sqrt{0.4}', ex: 'Example 2(a)(v)' },
  d049: { n: 2, frac: [49, 100], dec: '0.49', lab: '\\sqrt{0.49}', ex: 'Example 2(a)(vi)' },
  c50: { n: 3, v: 50, lab: '\\sqrt[3]{50}', ex: 'Example 2(b)(ii)' }
};
/** a ladder lying on its side: rungs at the perfect n-th powers around v */
function ladder(stage, svg, x, y, L, n, v, side) {
  const r = Math.pow(v, 1 / n), kr = Math.round(r), exact = Math.abs(kr ** n - v) < 1e-9, kf = exact ? kr : Math.floor(r + 1e-9);
  const kTop = kf + 1, kLo = Math.max(0, kTop - 4), lo = kLo ** n, hi = kTop ** n, px = (val) => x + (val - lo) / (hi - lo) * L;
  const g = svgEl('g', {}, svg); g.style.opacity = 0;
  const RH = 30;
  const band = svgEl('rect', { x: px(kf ** n), y, width: exact ? 0 : px((kf + 1) ** n) - px(kf ** n), height: RH, fill: CO, 'fill-opacity': 0.22 }, g); band.style.opacity = 0;
  svgEl('line', { x1: x - 16, x2: x + L + 16, y1: y, y2: y, stroke: '#8d6532', 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
  svgEl('line', { x1: x - 16, x2: x + L + 16, y1: y + RH, y2: y + RH, stroke: '#8d6532', 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
  const labs = [], rungs = {};
  for (let k = kLo; k <= kTop; k++) {
    const p = px(k ** n); rungs[k] = svgEl('line', { x1: p, x2: p, y1: y, y2: y + RH, stroke: '#a77b3e', 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
    labs.push(lab(stage, T(cR(tn(k ** n))), 'u2l1-lrv', p, y - 6, 'n'), lab(stage, T(cC(String(k))), 'u2l1-lrk', p, y + RH + 6, 's'));
  }
  labs.forEach(hide);
  if (side) { const s = lab(stage, side, 'u2l1-lside', x - 30, y + RH / 2, 'w'); hide(s); labs.push(s); }
  const ball = svgEl('circle', { cx: px(v), cy: y - 120, r: 11, fill: RAD, stroke: '#fff', 'stroke-width': 3 }, svg); ball.style.opacity = 0;
  const bl = lab(stage, `<b>${T(tn(v))}</b>`, 'u2l1-lball', px(v), y - 44, 'n'); hide(bl);
  const between = lab(stage, exact ? `on the rung: ${T(`${tn(v)}=${kr}^{${n}}`)}` : `between ${T(cC(String(kf)))} and ${T(cC(String(kf + 1)))}`, 'u2l1-lbetween ' + (exact ? 'u2l1-lon' : ''), exact ? px(v) : (px(kf ** n) + px((kf + 1) ** n)) / 2, y + RH + 40, 's'); hide(between);
  return {
    exact, kr, kf, lo, hi,
    list: Array.from({ length: kTop - kLo + 1 }, (_, i) => tn((kLo + i) ** n)).join(',\\ '),
    async draw(c) { g.style.opacity = 1; await appear(c, g, 300); for (const l of labs) l.style.opacity = 1; await Promise.all(labs.map((l) => fadeIn(c, l, 260))); },
    async drop(c) {
      ball.style.opacity = 1;
      await tween(c, 650, (t) => ball.setAttribute('cy', y - 120 + (120 + RH / 2) * t));
      bl.style.opacity = 1; await pop(c, bl, 260);
      if (exact) { rungs[kr].setAttribute('stroke', OK); ball.setAttribute('fill', OK); } else { band.style.opacity = 1; await appear(c, band, 260); }
      between.style.opacity = 1; await pop(c, between, 300);
    }
  };
}
const ladderDef = {
  title: 'The ladder of perfect powers',
  height: 420,
  choices: [{ sep: 'Example 2 check:' }, ...Object.keys(LD).map((k) => ({ v: k, label: T(LD[k].lab) }))],
  intro: (k) => `Is ${T(LD[k].lab)} rational or irrational? Press <b>Next</b>.`,
  ask: (k) => `<b>${LD[k].ex}.</b> ${T(LD[k].lab)}: rational or irrational?` + (k === '50' || k === 'c50' ? ' Between which two whole numbers?' : ''),
  make(stage, k, ex) {
    const d = LD[k], W = ex.W, n = d.n, svg = stageSvg(stage), steps = [];
    const verdict = lab(stage, '', 'u2l1-lverd', W / 2, 382, 'c'); hide(verdict);
    const st = stamp(stage, '', { ok: true, x: W - 140, y: 382 }); hide(st);
    if (d.frac) {
      const [p, q] = d.frac, LW = W / 2 - 150, A = ladder(stage, svg, 80, 196, LW, n, p), B = ladder(stage, svg, W / 2 + 70, 196, LW, n, q);
      const rational = A.exact && B.exact;
      const fl = lab(stage, T(d.dec ? `${d.dec}=\\dfrac{${cR(p)}}{${cR(q)}}` : `\\dfrac{${cR(p)}}{${cR(q)}}`), 'u2l1-lfrac', W / 2, 30, 'c'); hide(fl);
      const tA = lab(stage, `top: ${T(cR(p))}`, 'u2l1-lside', 80 + LW / 2, 60, 'c'), tB = lab(stage, `bottom: ${T(cR(q))}`, 'u2l1-lside', W / 2 + 70 + LW / 2, 60, 'c'); hide(tA); hide(tB);
      verdict.innerHTML = rational ? `${T(`${d.lab}=\\dfrac{${A.kr}}{${B.kr}}` + (d.dec ? `=${A.kr / B.kr}` : ''))}` : `neither ${T(String(p))} nor ${T(String(q))} is a perfect square`;
      st.textContent = rational ? '✓ rational' : 'irrational'; st.className = st.className.replace(/bk-(ok|no|mid)/, rational ? 'bk-ok' : 'bk-mid');
      steps.push({ cap: d.dec ? `First write the decimal as a fraction in lowest terms: ${T(`${d.dec}=\\dfrac{${p}}{${q}}`)}. Then check the top and the bottom.` : `A fraction: check the top (${p}) and the bottom (${q}) on the ladder of perfect squares.`,
        run: async (c) => { await show(c, fl); tA.style.opacity = 1; tB.style.opacity = 1; await A.draw(c); await B.draw(c); } });
      steps.push({ cap: `Top: ${p} ${A.exact ? `is a rung, ${T(`${p}=${A.kr}^2`)}` : `lands between rungs`}. Bottom: ${q} ${B.exact ? `is a rung, ${T(`${q}=${B.kr}^2`)}` : `lands between rungs`}.`,
        run: async (c) => { await A.drop(c); await B.drop(c); } });
      steps.push({ cap: rational ? `Both are perfect squares, so ${T(`${d.lab}=\\dfrac{${A.kr}}{${B.kr}}`)}${d.dec ? ` ${T(`=${A.kr / B.kr}`)}` : ''}: <b>rational</b>.` : `Neither ${p} nor ${q} is a perfect square, so ${T(d.lab)} is <b>irrational</b>.`,
        run: async (c) => { await show(c, verdict); await stampIn(c, st); } });
      return steps;
    }
    const v = Math.abs(d.v), L = ladder(stage, svg, 90, 182, W - 180, n, v);
    const neg = d.v < 0;
    verdict.innerHTML = L.exact ? T(`${d.lab}=${neg ? '-' : ''}${L.kr}`) : T(`${L.kf}<${d.lab}<${L.kf + 1}`);
    st.textContent = L.exact ? '✓ rational' : 'irrational'; st.className = st.className.replace(/bk-(ok|no|mid)/, L.exact ? 'bk-ok' : 'bk-mid');
    steps.push({ cap: (neg ? `Odd index: ${T(`${d.lab}=-\\sqrt[3]{${v}}`)}. Look for ${v} on the ladder of cubes. ` : '') + `The rungs are the perfect ${POWS[n]} ${T(L.list)}; under each rung is its ${ROOTW[n]}.`,
      run: (c) => L.draw(c) });
    steps.push({ cap: L.exact ? `${v} lands right <b>on</b> a rung: ${T(`${tn(v)}=${L.kr}^{${n}}`)}.` : `${v} lands <b>between</b> two rungs: ${T(`${tn(L.kf ** n)}<${v}<${tn((L.kf + 1) ** n)}`)}.`,
      run: (c) => L.drop(c) });
    steps.push({ cap: L.exact ? `So ${T(`${d.lab}=${neg ? '-' : ''}${L.kr}`)}, an integer: <b>rational</b>.` : `So ${T(d.lab)} is between ${L.kf} and ${L.kf + 1}. ${v} is not a perfect ${POW[n]}, so ${T(d.lab)} is <b>irrational</b>.`,
      run: async (c) => { await show(c, verdict); await stampIn(c, st); } });
    return steps;
  }
};

/* =========================================================================================================
 * explainer: under one root (× and ÷ merge; + does not)
 * ========================================================================================================= */
const UO = {
  m1: { a: 4, b: 9, op: '\\times', label: T('\\sqrt4\\times\\sqrt9') },
  m2: { a: 3, b: 12, op: '\\times', label: T('\\sqrt3\\times\\sqrt{12}') },
  d1: { a: 50, b: 2, op: '\\div', label: T('\\sqrt{50}\\div\\sqrt2') },
  a1: { add: true, label: T('\\sqrt9+\\sqrt{16}') }
};
const underOne = {
  title: 'One radical sign',
  height: 400,
  choices: [{ v: 'm1', label: UO.m1.label }, { v: 'm2', label: UO.m2.label }, { v: 'd1', label: UO.d1.label }, { sep: 'Does + work?' }, { v: 'a1', label: UO.a1.label }],
  intro: (k) => `${UO[k].label}: can it go under one root? Press <b>Next</b>.`,
  ask: (k) => (UO[k].add ? `Is ${T('\\sqrt9+\\sqrt{16}')} the same as ${T('\\sqrt{9+16}')}?` : `Work out ${UO[k].label} two ways.`),
  make(stage, k, ex) {
    const d = UO[k], W = ex.W, svg = stageSvg(stage);
    if (d.add) return addMake(stage, svg, W);
    const div = d.op === '\\div', v = div ? d.a / d.b : d.a * d.b, rv = Math.round(Math.sqrt(v));
    const y = 92, R1 = new Rad(stage, svg, { xs: 200, y }), ta = R1.num(d.a, 'rad');
    R1.start([], [ta]);
    const opx = R1.right() + 22, top = R1.op(d.op); R1.put(top, opx);
    const xs2 = opx + parseFloat(top.style.width) + 22, R2 = new Rad(stage, svg, { xs: xs2, y }), tb = R1.num(d.b, 'rad');
    R1.put(tb, R2.x0); R2.xe = R2.x0 + parseFloat(tb.style.width) + 6; R2.draw();
    const P = panel(stage, 40, 236, W - 80, 128, 'Check');
    const sa = Math.sqrt(d.a), sb = Math.sqrt(d.b), whole = Number.isInteger(sa) && Number.isInteger(sb);
    const l1 = h('div', 'u2l1-pline', whole ? T(`\\sqrt{${d.a}}=${sa}\\quad\\sqrt{${d.b}}=${sb}\\quad ${sa}${d.op}${sb}=${div ? sa / sb : sa * sb}`) : `Neither ${T(String(d.a))} nor ${T(String(d.b))} is a perfect square, so neither root comes out evenly on its own.`);
    const l2 = h('div', 'u2l1-pline', T(`\\sqrt{${d.a}${d.op}${d.b}}=\\sqrt{${v}}=${rv}`));
    P.append(l1, l2); hide(l1); hide(l2);
    const res = lab(stage, '', 'u2l1-big', 0, y + 32, 'e'); hide(res);
    const st = stamp(stage, whole ? '✓ same answer' : '✓ it comes out!', { ok: true, x: W - 150, y: 70 }); hide(st);
    let tv;
    return [
      { cap: whole ? `Each root on its own: ${T(`\\sqrt{${d.a}}=${sa}`)} and ${T(`\\sqrt{${d.b}}=${sb}`)}, so the answer is ${T(String(div ? sa / sb : sa * sb))}.` : `Neither ${d.a} nor ${d.b} is a perfect square. Try putting them together.`, run: (c) => show(c, l1) },
      { cap: `Same index: the two radicands go under <b>one</b> radical sign, ${T(`\\sqrt{${d.a}${d.op}${d.b}}`)}.`,
        run: async (c) => { await Promise.all([anim2(c, R2.g, 0), R1.set(c, [], [ta, top, tb])]); } },
      { cap: `${T(`${d.a}${d.op}${d.b}=${v}`)}, a perfect square: ${T(`\\sqrt{${v}}=${rv}`)}. ${whole ? 'The same answer ✓' : 'It comes out to a whole number.'}`,
        run: async (c) => {
          tv = R1.num(v, 'rad'); await R1.set(c, [], [tv], { at: new Map([[tv, R1.x0]]) });
          res.innerHTML = T('=' + rv); place(res, R1.right() + 18, y + 32, 'e', 0); res.style.opacity = 1; await pop(c, res);
          await show(c, l2); await stampIn(c, st);
        } }
    ];
  }
};
const anim2 = (c, g, op) => tween(c, 400, (t) => (g.style.opacity = 1 - t * (1 - op)));
function addMake(stage, svg, W) {
  const u = 34, base = 300, gx = 70;
  const sqA = [], sqB = [];
  const unit = (x, y, fill) => svgEl('rect', { x, y, width: u - 3, height: u - 3, rx: 3, fill, stroke: '#fff', 'stroke-width': 1 }, svg);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) sqA.push(unit(gx + i * u, base - (j + 1) * u, '#8fb0ef'));
  const bx = gx + 3 * u + 10;
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) sqB.push(unit(bx + i * u, base - (j + 1) * u, '#5d87e0'));
  [...sqA, ...sqB].forEach((r) => (r.style.opacity = 0));
  const lA = lab(stage, `area ${T('9')}`, 'u2l1-alab', gx + 1.5 * u, base - 3 * u - 8, 'n'), lB = lab(stage, `area ${T('16')}`, 'u2l1-alab', bx + 2 * u, base - 4 * u - 8, 'n'); hide(lA); hide(lB);
  const sA = lab(stage, T(cC('3')), 'u2l1-slab', gx + 1.5 * u, base + 6, 's'), sB = lab(stage, T(cC('4')), 'u2l1-slab', bx + 2 * u, base + 6, 's'); hide(sA); hide(sB);
  const br = svgEl('path', { class: 'bk-stroke', d: `M${gx} ${base + 40} L${gx} ${base + 50} L${bx + 4 * u} ${base + 50} L${bx + 4 * u} ${base + 40}`, fill: 'none', stroke: CO, 'stroke-width': 3.5 }, svg); br.style.opacity = 0;
  const s7 = lab(stage, T(cC('3+4=7')), 'u2l1-slab', (gx + bx + 4 * u) / 2, base + 54, 's'); hide(s7);
  const cx = W - 330, all = [...sqA, ...sqB];
  const s5 = lab(stage, T(cC('5')), 'u2l1-slab', cx + 2.5 * u, base + 6, 's'), l25 = lab(stage, `area ${T('9+16=25')}`, 'u2l1-alab', cx + 2.5 * u, base - 5 * u - 8, 'n'); hide(s5); hide(l25);
  const e1 = lab(stage, T('\\sqrt9+\\sqrt{16}=3+4=7'), 'u2l1-eqbox', 40, 22, 'e'), e2 = lab(stage, T('\\sqrt{9+16}=\\sqrt{25}=5'), 'u2l1-eqbox', W - 40, 22, 'w'); hide(e1); hide(e2);
  e1.style.translate = '0 0'; e2.style.translate = '-100% 0';
  const ne = lab(stage, T(cX('5\\ne7')), 'u2l1-big', W / 2 + 20, 200, 'c'); hide(ne);
  const st = stamp(stage, '√(a+b) ≠ √a + √b', { ok: false, x: W - 205, y: 372 }); hide(st);
  return [
    { cap: `${T('\\sqrt9')} is the side of a square of area 9; ${T('\\sqrt{16}')} is the side of a square of area 16.`,
      run: async (c) => { all.forEach((r) => (r.style.opacity = 1)); await appear(c, svg, 200); [lA, lB, sA, sB].forEach((e) => (e.style.opacity = 1)); await Promise.all([lA, lB, sA, sB].map((e) => fadeIn(c, e))); } },
    { cap: `${T('\\sqrt9+\\sqrt{16}=3+4=7')}: the two sides laid end to end.`, run: async (c) => { br.style.opacity = 1; await drawIn(br, 500, c); await show(c, s7); await show(c, e1); } },
    { cap: `${T('\\sqrt{9+16}=\\sqrt{25}')}: move all 25 unit squares into <b>one</b> square.`,
      run: async (c) => {
        [lA, lB, sA, sB].forEach((e) => (e.style.opacity = 0));
        const from = all.map((r) => [parseFloat(r.getAttribute('x')), parseFloat(r.getAttribute('y'))]);
        const to = all.map((_, i) => [cx + (i % 5) * u, base - (Math.floor(i / 5) + 1) * u]);
        await tween(c, 1100, (t) => all.forEach((r, i) => { r.setAttribute('x', from[i][0] + (to[i][0] - from[i][0]) * t); r.setAttribute('y', from[i][1] + (to[i][1] - from[i][1]) * t); }));
        s5.style.opacity = 1; l25.style.opacity = 1; await pop(c, s5); await show(c, e2);
      } },
    { cap: `Its side is <b>5</b>, not 7. A root does <b>not</b> split over + (or −): ${T('\\sqrt{9+16}\\ne\\sqrt9+\\sqrt{16}')}.`, run: async (c) => { await pop(c, ne); await stampIn(c, st); } }
  ];
}

/* =========================================================================================================
 * explainer: true or false? (Example 3 checks)
 * ========================================================================================================= */
const TF = {
  a: { s: '\\sqrt2\\times\\sqrt{18}=6', L: ['\\sqrt2\\times\\sqrt{18}', '=\\sqrt{2\\times18}', '=\\sqrt{36}', '=6'], R: ['6', null, null, '6'], ok: true, why: `Multiply under one root: ${T('\\sqrt{36}=6')}.` },
  b: { s: '\\sqrt{36+64}=\\sqrt{36}+\\sqrt{64}', L: ['\\sqrt{36+64}', '=\\sqrt{100}', '=10'], R: ['\\sqrt{36}+\\sqrt{64}', '=6+8', '=14'], ok: false, why: `Add first, then take the root: ${T('10\\ne14')}.` },
  c: { s: '\\dfrac{\\sqrt{72}}{\\sqrt2}=6', L: ['\\dfrac{\\sqrt{72}}{\\sqrt2}', '=\\sqrt{\\tfrac{72}{2}}', '=\\sqrt{36}', '=6'], R: ['6', null, null, '6'], ok: true, why: `Divide under one root: ${T('\\sqrt{36}=6')}.` },
  d: { s: '\\sqrt{169}-\\sqrt{25}=\\sqrt{144}', L: ['\\sqrt{169}-\\sqrt{25}', '=13-5', '=8'], R: ['\\sqrt{144}', null, '=12'], ok: false, why: `Subtracting radicands doesn’t work: ${T('8\\ne12')}.` },
  e: { s: '\\sqrt[3]4\\times\\sqrt[3]{16}=4', L: ['\\sqrt[3]4\\times\\sqrt[3]{16}', '=\\sqrt[3]{64}', '=4'], R: ['4', null, '4'], ok: true, why: `Same index 3: ${T('\\sqrt[3]{64}=4')}.` },
  f: { s: '\\sqrt[3]2+\\sqrt[3]6=\\sqrt[3]8', L: ['\\sqrt[3]2+\\sqrt[3]6', '>\\sqrt[3]1+\\sqrt[3]1', '>2'], R: ['\\sqrt[3]8', null, '=2'], ok: false, why: `Roots can’t be added under one sign: ${T('\\sqrt[3]2>1')} and ${T('\\sqrt[3]6>1')}, so the left side is more than 2.` }
};
const trueFalse = {
  title: 'True or false? Work out both sides',
  height: 380,
  choices: [{ sep: 'Example 3 check:' }, ...'abcdef'.split('').map((k) => ({ v: k, label: `(${k})` }))],
  intro: (k) => `Is ${T(TF[k].s)} true? Press <b>Next</b>.`,
  ask: (k) => `<b>Example 3(${k}).</b> True or false: ${T(TF[k].s)}`,
  make(stage, k, ex) {
    const d = TF[k], W = ex.W, n = d.L.length;
    const card = add(stage, box(h('div', 'bk-check u2l1-tf'), 600, null), 60, 18);
    card.innerHTML = `<div class="bk-ck-h">Check</div>`;
    const grid = h('div', 'bk-ck-grid'); card.appendChild(grid);
    grid.innerHTML = '<div class="bk-ck-sh">Left side</div><div></div><div class="bk-ck-sh">Right side</div>';
    const Ls = [], Rs = []; let mid;
    for (let i = 0; i < n; i++) {
      const last = i === n - 1;
      const a = h('div', 'bk-ck-c' + (last ? ' bk-ck-v' : ''), d.L[i] != null ? T(d.L[i]) : ''), m = h('div', 'bk-ck-m', last ? (d.ok ? '=' : '≠') : ''), b = h('div', 'bk-ck-c' + (last ? ' bk-ck-v' : ''), d.R[i] != null ? T(d.R[i]) : '');
      grid.append(a, m, b); Ls.push(a); Rs.push(b); if (last) mid = m;
      hide(a); hide(b); hide(m);
    }
    if (!d.ok) card.classList.add('u2l1-tfno');
    const verdict = h('div', 'bk-ck-verdict ' + (d.ok ? 'bk-ok' : 'bk-no'), d.ok ? '✓ Both sides are equal' : '✗ The sides are not equal'); card.appendChild(verdict); hide(verdict);
    const st = stamp(stage, d.ok ? 'TRUE' : 'FALSE', { ok: d.ok, x: W - 160, y: 150, size: 'lg' }); hide(st);
    return [
      { cap: `Work out the <b>left side</b>.`, run: async (c) => { for (const e of Ls) { if (!e.innerHTML) { e.style.opacity = 1; continue; } await show(c, e); await sleep(c, 120); } } },
      { cap: `Work out the <b>right side</b>.`, run: async (c) => { for (const e of Rs) { if (!e.innerHTML) { e.style.opacity = 1; continue; } await show(c, e); await sleep(c, 120); } } },
      { cap: `${d.ok ? '<b>True.</b>' : '<b>False.</b>'} ${d.why}`, run: async (c) => { await pop(c, mid); await pop(c, verdict); await stampIn(c, st); } }
    ];
  }
};

/* =========================================================================================================
 * tiles: a square of area k²·m cut into k² tiles of area m (or a cube of volume k³·m into k³ little cubes)
 * ========================================================================================================= */
function tileSquare(stage, svg, x, y, S, k, m, o = {}) {
  const t = S / k, g = svgEl('g', {}, svg);
  const out = svgEl('rect', { x, y, width: S, height: S, fill: '#eef3fd', stroke: RAD, 'stroke-width': 4 }, g);
  const grid = svgEl('g', { opacity: 0 }, g);
  for (let i = 1; i < k; i++) {
    svgEl('line', { x1: x + i * t, x2: x + i * t, y1: y, y2: y + S, stroke: RAD, 'stroke-width': k > 8 ? 1.2 : 2, 'stroke-opacity': 0.7 }, grid);
    svgEl('line', { y1: y + i * t, y2: y + i * t, x1: x, x2: x + S, stroke: RAD, 'stroke-width': k > 8 ? 1.2 : 2, 'stroke-opacity': 0.7 }, grid);
  }
  const tl = [];
  if (k <= 6) for (let i = 0; i < k; i++) for (let j = 0; j < k; j++) { const e = svgEl('text', { x: x + (i + 0.5) * t, y: y + (j + 0.5) * t + 7, 'text-anchor': 'middle', class: 'u2l1-tnum' }, grid); e.textContent = m; tl.push(e); }
  const one = svgEl('rect', { x, y: y + S - t, width: t, height: t, fill: RAD, 'fill-opacity': 0.55, stroke: RAD, 'stroke-width': 2 }, g); one.style.opacity = 0;
  const area = lab(stage, `area ${T(cR(tn(k * k * m)))}${o.unit ? ' ' + o.unit : ''}`, 'u2l1-tarea', x + S / 2, y + S / 2, 'c');
  const side0 = lab(stage, T(`\\sqrt{${tn(k * k * m)}}`), 'u2l1-tside', x + S / 2, y + S + 8, 's');
  const oneL = lab(stage, T(cR(`\\sqrt{${m}}`)), 'u2l1-tone', x + t / 2, y + S + 8, 's'); hide(oneL);
  const ticks = svgEl('g', {}, svg); ticks.style.opacity = 0;
  for (let i = 0; i <= k; i++) svgEl('line', { x1: x + i * t, x2: x + i * t, y1: y + S + 2, y2: y + S + 12, stroke: CO, 'stroke-width': 3 }, ticks);
  svgEl('path', { d: `M${x} ${y + S + 22} L${x} ${y + S + 30} L${x + S} ${y + S + 30} L${x + S} ${y + S + 22}`, fill: 'none', stroke: CO, 'stroke-width': 3 }, ticks);
  const sideK = lab(stage, `side ${T(`${cC(String(k))}\\sqrt{${cR(String(m))}}`)}`, 'u2l1-tside', x + S / 2, y + S + 34, 's'); hide(sideK);
  return { g, grid, one, area, side0, oneL, ticks, sideK, t };
}
function isoCube(stage, svg, ox, oy, L, k) {
  const c30 = Math.cos(Math.PI / 6), s30 = 0.5;
  const P = (a, b, c) => [ox + (a - b) * c30 * L, oy + (a + b) * s30 * L - c * L];
  const ptsStr = (arr) => arr.map((p) => P(...p).join(',')).join(' ');
  const g = svgEl('g', {}, svg);
  svgEl('polygon', { points: ptsStr([[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]]), fill: '#dfe8fb', stroke: RAD, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, g);
  svgEl('polygon', { points: ptsStr([[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]]), fill: '#c9d8f7', stroke: RAD, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, g);
  svgEl('polygon', { points: ptsStr([[0, 1, 0], [1, 1, 0], [1, 1, 1], [0, 1, 1]]), fill: '#b3c8f2', stroke: RAD, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, g);
  const grid = svgEl('g', { opacity: 0 }, g);
  const ln = (p, q) => svgEl('line', { x1: P(...p)[0], y1: P(...p)[1], x2: P(...q)[0], y2: P(...q)[1], stroke: RAD, 'stroke-width': 1.3, 'stroke-opacity': 0.75 }, grid);
  for (let i = 1; i < k; i++) {
    const f = i / k;
    ln([f, 0, 1], [f, 1, 1]); ln([0, f, 1], [1, f, 1]);
    ln([1, f, 0], [1, f, 1]); ln([1, 0, f], [1, 1, f]);
    ln([f, 1, 0], [f, 1, 1]); ln([0, 1, f], [1, 1, f]);
  }
  const u = 1 / k, a0 = 1 - u, one = svgEl('g', {}, g); one.style.opacity = 0;
  [[[a0, a0, 1], [1, a0, 1], [1, 1, 1], [a0, 1, 1]], [[1, a0, a0], [1, 1, a0], [1, 1, 1], [1, a0, 1]], [[a0, 1, a0], [1, 1, a0], [1, 1, 1], [a0, 1, 1]]]
    .forEach((f) => svgEl('polygon', { points: ptsStr(f), fill: RAD, 'fill-opacity': 0.6, stroke: RAD, 'stroke-width': 2 }, one));
  const ticks = svgEl('g', {}, svg); ticks.style.opacity = 0;
  for (let i = 0; i <= k; i++) { const [px, py] = P(1, 1 - i / k, 0); svgEl('line', { x1: px, y1: py, x2: px + 6, y2: py + 11, stroke: CO, 'stroke-width': 3 }, ticks); }
  const mid = P(1, 0.5, 0), top = P(1, 1, 1), cE = P(1, 1, 1 - u / 2);
  return { g, grid, one, ticks, mid, top, cE, P };
}

const TL = { 8: { k: 2, m: 2 }, 18: { k: 3, m: 2 }, 48: { k: 4, m: 3 } };
const tilesDef = {
  title: 'Cut the square into tiles',
  height: 420,
  choices: [{ v: 8, label: T('\\sqrt8') }, { v: 18, label: T('\\sqrt{18}') }, { v: 48, label: T('\\sqrt{48}') }],
  intro: (v) => `Why is ${T(`\\sqrt{${v}}`)} a mixed radical? Press <b>Next</b>.`,
  ask: (v) => `Why does a number come out of ${T(`\\sqrt{${v}}`)}?`,
  make(stage, v, ex) {
    const { k, m } = TL[v], W = ex.W, svg = stageSvg(stage), S = 300, x = 90, y = 28;
    const Q = tileSquare(stage, svg, x, y, S, k, m);
    const P = panel(stage, x + S + 90, 40, W - (x + S + 90) - 40, 300, 'Working');
    const lines = [`\\text{area}=${cR(v)}`, `${v}=${cC(k * k)}\\times${cR(m)}`, `\\text{${k * k} tiles, each of area }${cR(m)}`, `\\text{tile side}=${cR(`\\sqrt{${m}}`)}`, `\\sqrt{${v}}=${cC(k)}\\sqrt{${cR(m)}}`].map((s) => { const e = h('div', 'u2l1-pline', T(s)); P.appendChild(e); hide(e); return e; });
    const st = stamp(stage, '✓ ' + `${k}√${m}`, { ok: true, x: W - 150, y: 380 }); hide(st);
    return [
      { cap: `A square with area ${T(cR(v))} has side ${T(`\\sqrt{${v}}`)}.`, run: (c) => show(c, lines[0]) },
      { cap: `${T(`${v}=${cC(k * k)}\\times${cR(m)}`)}: cut the square into ${T(cC(k * k))} small squares, each of area ${T(cR(m))} (a ${k} by ${k} grid).`,
        run: async (c) => { Q.area.style.opacity = 0; Q.grid.setAttribute('opacity', 1); await appear(c, Q.grid, 500); await show(c, lines[1]); await show(c, lines[2]); } },
      { cap: `Each small square has area ${T(cR(m))}, so its side is ${T(cR(`\\sqrt{${m}}`))}.`, run: async (c) => { Q.one.style.opacity = 1; await appear(c, Q.one, 300); Q.oneL.style.opacity = 1; Q.side0.style.opacity = 0; await pop(c, Q.oneL); await show(c, lines[3]); } },
      { cap: `One side of the big square is ${T(cC(k))} small sides: ${T(`\\sqrt{${v}}=${cC(k)}\\sqrt{${cR(m)}}`)}. The ${T(cC(k))} is ${T(`\\sqrt{${k * k}}`)}: the number of tiles along a side.`,
        run: async (c) => { Q.ticks.style.opacity = 1; await appear(c, Q.ticks, 300); Q.oneL.style.opacity = 0; await pop(c, Q.sideK); await show(c, lines[4]); await stampIn(c, st); } }
    ];
  }
};

/* =========================================================================================================
 * explainer: the factor hunt (entire → mixed) and the simplest-form check
 * ========================================================================================================= */
const HU = {
  48: { n: 2, r: 48 },
  a: { n: 2, r: 75, ex: 'Example 4(a)' }, b: { n: 2, r: 120, ex: 'Example 4(b)' }, c: { n: 2, r: 252, ex: 'Example 4(c)' },
  d: { n: 2, r: 98, co: 3, ex: 'Example 4(d)' }, e: { n: 3, r: 250, ex: 'Example 4(e)' }, f: { n: 3, r: -432, ex: 'Example 4(f)' },
  g: { n: 4, r: 162, ex: 'Example 4(g)' }, h: { n: 3, r: 375, co: -2, ex: 'Example 4(h)' }, i: { n: 4, r: 1280, ex: 'Example 4(i)' }
};
const SI = {
  12: { n: 2, r: 12, co: 5 }, 16: { n: 3, r: 16, co: 3 }, 30: { n: 2, r: 30, co: 2 },
  kai: { n: 2, r: 18, co: 2, ex: 'Example 5(c)', kai: true }
};
const radTex = (co, n, inner) => `${co == null ? '' : co === -1 ? '-' : tn(co)}${rt(n, inner)}`;
function huntRow(stage, ks, n, a, y, W) {
  const TW = 60, GAP = ks.length > 11 ? 6 : 12, tot = ks.length * TW + (ks.length - 1) * GAP, X0 = (W - tot) / 2;
  const items = ks.map((k, i) => {
    const v = k ** n, x = X0 + i * (TW + GAP);
    const el = add(stage, box(h('div', 'u2l1-cand', T(tn(v))), TW, 44), x, y);
    const kl = lab(stage, T(cI(`${k}^{${n}}`)), 'u2l1-ck', x + TW / 2, y - 4, 'n');
    const q = a % v === 0 ? a / v : null, ql = lab(stage, q != null ? T('\\to' + cR(tn(q))) : T(cX('\\times')), 'u2l1-cq', x + TW / 2, y + 50, 's'); hide(ql);
    return { k, v, el, kl, ql, q };
  });
  return {
    items,
    async test(c) { for (const it of items) { it.el.classList.add(it.q != null ? 'u2l1-yes' : 'u2l1-no'); it.ql.style.opacity = 1; if (it.q != null) await pop(c, it.el, 240); else await sleep(c, 120); } },
    async mark(c, k) { const it = items.find((x) => x.k === k); if (!it) return; it.el.classList.add('u2l1-best'); await pulse(c, it.el, 1.2, 500); }
  };
}
function huntSteps(stage, d, ex, mode) {
  const W = ex.W, svg = stageSvg(stage), n = d.n, a = Math.abs(d.r), sg = Math.sign(d.r), hasCo = d.co != null, co = hasCo ? d.co : 1;
  const ks = []; for (let k = 2; k ** n < a; k++) ks.push(k);
  const divs = ks.filter((k) => a % k ** n === 0), kb = divs.length ? divs[divs.length - 1] : null;
  const y = 104, R = new Rad(stage, svg, { xs: 250, y, n });
  const tCo = hasCo ? R.num(co, 'co') : null, tR = R.num(d.r, 'rad');
  R.start(hasCo ? [tCo] : [], [tR]);
  const row = huntRow(stage, ks, n, a, 238, W);
  const listTex = ks.length > 6 ? `${tn(ks[0] ** n)},\\ ${tn(ks[1] ** n)},\\ ${tn(ks[2] ** n)},\\ \\dots,\\ ${tn(ks[ks.length - 1] ** n)}` : ks.map((k) => tn(k ** n)).join(',\\ ');
  const startTex = radTex(hasCo ? co : null, n, cR(tn(d.r)));
  const steps = [];
  const stY = 128, stX = W - 150;
  if (mode === 'simplest' && !kb) {
    const ch = chain(stage, 40, 340, W - 80, [startTex]);
    const st = stamp(stage, '✓ simplest form', { ok: true, x: stX, y: stY }); hide(st);
    steps.push({ cap: `Simplest form? Hunt: does ${T(String(a))} have a perfect-${POW[n]} factor? Test ${T(listTex)}.`, run: async (c) => { await ch.show(c, 0); await row.test(c); } });
    steps.push({ cap: `None of them divides ${a}. ${T(startTex)} is already in <b>simplest form</b>.`, run: (c) => stampIn(c, st) });
    return steps;
  }
  const big = kb ** n, rest = a / big, out = sg * kb, fin = co * out;
  const restTex = cR(tn(rest)), bigTex = cC(tn(sg * big)), outTex = cC(tn(out));
  const parts = [startTex, `=${radTex(hasCo ? co : null, n, bigTex + '\\times' + restTex)}`];
  if (hasCo) parts.push(`=${tn(co)}\\times${outTex}${rt(n, restTex)}`, `=${cC(tn(fin))}${rt(n, restTex)}`);
  else parts.push(`=${rt(n, bigTex)}\\times${rt(n, restTex)}`, `=${outTex}${rt(n, restTex)}`);
  const ch = chain(stage, 30, 342, W - 60, parts);
  let kaiCh = null;
  if (d.kai) kaiCh = chain(stage, 30, 386, W - 60, ['\\text{Largest first: }\\sqrt{72}=\\sqrt{' + cC(36) + '\\times' + cR(2) + '}=' + cC(6) + '\\sqrt{' + cR(2) + '}'], 'u2l1-chain2');
  const tP = R.num(sg * big, 'pp'), tX = R.op(), tRest = R.num(rest, 'rad');
  const stNo = mode === 'simplest' ? stamp(stage, 'not simplest', { ok: false, x: stX, y: stY }) : null; if (stNo) hide(stNo);
  const st = stamp(stage, '✓ simplest form', { ok: true, x: stX, y: stY }); hide(st);
  const huntCap = mode === 'simplest' ? `Simplest form? Hunt: does ${T(String(a))} have a perfect-${POW[n]} factor? Test ${T(listTex)}.`
    : `Hunt for perfect ${POWS[n]} that divide ${T(tn(a))}: test ${T(listTex)}.`;
  steps.push({ cap: huntCap, run: async (c) => { await ch.show(c, 0); await row.test(c); } });
  if (mode === 'simplest') steps.push({ cap: `Yes: ${T(cC(big))} divides ${a}. So ${T(startTex)} is <b>not</b> in simplest form yet.`, run: async (c) => { await row.mark(c, kb); stNo.style.opacity = 1; await stampIn(c, stNo); } });
  const splitCap = (divs.length > 1 ? `${divs.length} of them divide ${a}; use the <b>largest</b>, ${T(cC(tn(big)))}: ` : `${T(cC(tn(big)))} divides ${a}: `) + `${T(`${tn(d.r)}=${bigTex}\\times${restTex}`)}.`;
  steps.push({ cap: splitCap,
    run: async (c) => {
      if (mode !== 'simplest') await row.mark(c, kb); else if (stNo) stNo.style.opacity = 0;
      const x0 = tR._x; await R.set(c, hasCo ? [tCo] : [], [tP, tX, tRest], { at: new Map([[tP, x0], [tX, x0], [tRest, x0]]) }); await ch.show(c, 1);
    } });
  const k2 = hasCo ? R.op() : null;
  steps.push({ cap: `${T(tn(sg * big))} is a perfect ${POW[n]}: ${T(`${rt(n, tn(sg * big))}=${tn(out)}`)}. It <b>escapes</b> the root sign and lands in front` + (hasCo ? `, next to the ${T(tn(co))}.` : '.'),
    run: async (c) => {
      await R.set(c, hasCo ? [tCo, k2, tP] : [tP], [tRest], { arc: [tP], ms: 1000, morph: [[tP, T(tn(out)), 'co', wNum(out, R.fs)]] });
      await ch.show(c, 2);
    } });
  if (hasCo) {
    const tF = R.num(fin, 'co');
    steps.push({ cap: `Multiply the numbers in front: ${T(`${tn(co)}\\times${tn(out)}=${tn(fin)}`)}.`,
      run: async (c) => { await R.set(c, [tF], [tRest], { at: new Map([[tF, tCo._x]]) }); await ch.show(c, 3); } });
  }
  const finTex = `${cC(tn(fin))}${rt(n, restTex)}`;
  steps.push({ cap: `${mode === 'simplest' ? 'Hunt again: ' : 'Check: '}${T(String(rest))} has no perfect-${POW[n]} factor, so ${T(finTex)} is in <b>simplest form</b>.`, run: (c) => stampIn(c, st) });
  if (d.kai) steps.push({ cap: `Kai’s answer needed a second round. Using the <b>largest</b> perfect square first does it in one step.`, run: (c) => kaiCh.show(c, 0) });
  return steps;
}
const hunt = {
  title: 'The factor hunt: entire → mixed',
  height: 400,
  choices: [{ v: 48, label: T('\\sqrt{48}') }, { sep: 'Example 4 check:' }, ...'abcdefghi'.split('').map((k) => ({ v: k, label: `(${k})` }))],
  intro: (k) => `Write ${T(radTex(HU[k].co ?? null, HU[k].n, tn(HU[k].r)))} as a mixed radical. Press <b>Next</b>.`,
  ask: (k) => `${HU[k].ex ? `<b>${HU[k].ex}.</b> ` : ''}Write ${T(radTex(HU[k].co ?? null, HU[k].n, tn(HU[k].r)))} as a mixed radical in simplest form.`,
  make(stage, k, ex) { return huntSteps(stage, HU[k], ex, 'hunt'); }
};
const simplest = {
  title: 'Simplest form? Hunt again',
  height: 420,
  choices: [{ v: 12, label: T('5\\sqrt{12}') }, { v: 16, label: T('3\\sqrt[3]{16}') }, { v: 30, label: T('2\\sqrt{30}') }, { sep: 'Example 5(c) check:' }, { v: 'kai', label: `Kai: ${T('2\\sqrt{18}')}` }],
  intro: (k) => `Is ${T(radTex(SI[k].co, SI[k].n, tn(SI[k].r)))} in simplest form? Press <b>Next</b>.`,
  ask: (k) => (SI[k].kai ? `<b>Example 5(c).</b> Kai wrote ${T('\\sqrt{72}=2\\sqrt{18}')}. Is this in simplest form?` : `Is ${T(radTex(SI[k].co, SI[k].n, tn(SI[k].r)))} in simplest form?`),
  make(stage, k, ex) { return huntSteps(stage, SI[k], ex, 'simplest'); }
};

/* =========================================================================================================
 * explainer: prime factors; pairs / triples escape (Example 5(a)(b))
 * ========================================================================================================= */
const PR = { a: { n: 2, r: 2700, ex: 'Example 5(a)' }, b: { n: 3, r: 3024, ex: 'Example 5(b)' }, 392: { n: 2, r: 392 }, 648: { n: 3, r: 648 } };
const primes = {
  title: 'Prime factors: groups escape',
  height: 410,
  minW: 960,
  choices: [{ sep: 'Example 5 check:' }, { v: 'a', label: T('\\sqrt{2\\,700}') }, { v: 'b', label: T('\\sqrt[3]{3\\,024}') }, { sep: 'More:' }, { v: 392, label: T('\\sqrt{392}') }, { v: 648, label: T('\\sqrt[3]{648}') }],
  intro: (k) => `Simplify ${T(rt(PR[k].n, tn(PR[k].r)))} using prime factors. Press <b>Next</b>.`,
  ask: (k) => `${PR[k].ex ? `<b>${PR[k].ex}.</b> ` : ''}Simplify ${T(rt(PR[k].n, tn(PR[k].r)))} using prime factors.`,
  make(stage, k, ex) {
    const d = PR[k], n = d.n, W = ex.W, svg = stageSvg(stage), ps = primeFactors(d.r);
    // group equal primes in runs of n; leftovers stay
    const groups = [], lefts = []; let i = 0;
    while (i < ps.length) { let j = i; while (j < ps.length && ps[j] === ps[i]) j++; let c2 = j - i, at = i; while (c2 >= n) { groups.push({ p: ps[i], idx: Array.from({ length: n }, (_, q) => at + q) }); at += n; c2 -= n; } for (let q = 0; q < c2; q++) lefts.push(at + q); i = j; }
    const outs = groups.map((g) => g.p), leftV = lefts.map((q) => ps[q]), pOut = prod(outs), pIn = prod(leftV);
    const R = new Rad(stage, svg, { xs: 270, y: 96, n, th: 58, fs: 30 });
    const tR = R.num(d.r, 'rad'); R.start([], [tR]);
    const tiles = ps.map((p) => R.num(p, 'rad')), ops = ps.slice(1).map(() => R.op());
    const inner = []; tiles.forEach((t, q) => { if (q) inner.push(ops[q - 1]); inner.push(t); });
    const factTex = ps.join('\\times');
    const outTex = outs.map((p) => cC(p)).join('\\times'), leftTex = leftV.map((p) => cR(p)).join('\\times');
    const ch = chain(stage, 30, 300, W - 60, [`${rt(n, tn(d.r))}=${rt(n, factTex)}`, `=${outTex}${rt(n, leftTex)}`, `=${cC(pOut)}${rt(n, cR(pIn))}`]);
    const brG = svgEl('g', {}, svg); brG.style.opacity = 0; const brL = [];
    const st = stamp(stage, '✓ simplest form', { ok: true, x: W - 140, y: 380 }); hide(st);
    const grpWord = GROUP[n], gw = groups.map((g) => Array(n).fill(g.p).join('\\cdot')).join(',\\ ');
    return [
      { cap: `Prime factors: ${T(`${tn(d.r)}=${factTex}`)}.`, run: async (c) => { const x0 = tR._x; await R.set(c, [], inner, { at: new Map(inner.map((e) => [e, x0])), ms: 800 }); await ch.show(c, 0); } },
      { cap: `Index ${n}: each <b>${grpWord}</b> of equal factors is a perfect ${POW[n]}. ${grpWord[0].toUpperCase() + grpWord.slice(1)}s: ${T(gw)}. Left over: ${T(leftV.join(',\\ ') || '\\text{none}')}.`,
        run: async (c) => {
          groups.forEach((g) => {
            g.idx.forEach((q) => { tiles[q].className = 'u2l1-rt u2l1-rt-pp'; });
            const a = tiles[g.idx[0]], b = tiles[g.idx[n - 1]], x1 = a._x + 4, x2 = b._x + parseFloat(b.style.width) - 4, yb = R.y + R.th + 8;
            svgEl('path', { d: `M${x1} ${yb} L${x1} ${yb + 10} L${x2} ${yb + 10} L${x2} ${yb}`, fill: 'none', stroke: CO, 'stroke-width': 3 }, brG);
            brL.push(lab(stage, grpWord, 'u2l1-grp', (x1 + x2) / 2, yb + 12, 's'));
          });
          brG.style.opacity = 1; await appear(c, brG, 300); await Promise.all(brL.map((e) => fadeIn(c, e)));
        } },
      { cap: `Each ${grpWord} escapes as <b>one</b> factor: ${T(outs.map((p) => cC(p)).join(',\\ '))} go in front. ${T(leftV.map((p) => cR(p)).join(',\\ '))} ${leftV.length > 1 ? 'stay' : 'stays'} inside.`,
        run: async (c) => {
          brG.style.opacity = 0; brL.forEach((e) => (e.style.opacity = 0));
          const leaders = groups.map((g) => tiles[g.idx[0]]), outList = []; leaders.forEach((t, q) => { if (q) outList.push(R.op()); outList.push(t); });
          const inList = []; lefts.forEach((q, j) => { if (j) inList.push(R.op()); inList.push(tiles[q]); });
          const { pos } = R.layout(outList, inList, (e) => parseFloat(e.style.width));
          const to = new Map(); groups.forEach((g) => g.idx.slice(1).forEach((q) => to.set(tiles[q], pos.get(tiles[g.idx[0]]))));
          await R.set(c, outList, inList, { arc: [...leaders, ...to.keys()], to, ms: 1100, morph: leaders.map((t) => [t, t.innerHTML, 'co']) });
          await ch.show(c, 1);
        } },
      { cap: `Multiply: ${T(`${outs.join('\\times')}=${cC(pOut)}`)} in front` + (leftV.length > 1 ? `, ${T(`${leftV.join('\\times')}=${cR(pIn)}`)} inside` : '') + `. ${T(`${rt(n, tn(d.r))}=${cC(pOut)}${rt(n, cR(pIn))}`)}.`,
        run: async (c) => { const tO = R.num(pOut, 'co'), tI = R.num(pIn, 'rad'); await R.set(c, [tO], [tI], { at: new Map([[tO, R.xs - 120], [tI, R.x0]]) }); await ch.show(c, 2); await stampIn(c, st); } }
    ];
  }
};

/* =========================================================================================================
 * explainer: copies of √3 (Example 6)
 * ========================================================================================================= */
const CP = {
  a: { k: 10, N: '300', simp: '\\sqrt{300}=\\sqrt{100\\times3}=10\\sqrt3', val: '17.32', max: 19, ls: 1 },
  b: { k: 2, N: '12', simp: '\\sqrt{12}=\\sqrt{4\\times3}=2\\sqrt3', val: '3.464', max: 4, ls: 1 },
  c: { k: 0.1, N: '0.03', simp: '\\sqrt{0.03}=\\sqrt{\\tfrac{3}{100}}=\\dfrac{\\sqrt3}{10}', val: '0.1732', max: 2, ls: 1, minor: 0.1 },
  d: { k: 4, N: '48', simp: '\\sqrt{48}=\\sqrt{16\\times3}=4\\sqrt3', val: '6.928', max: 8, ls: 1 }
};
const copies = {
  title: 'Copies of √3',
  height: 380,
  choices: [{ sep: 'Example 6 check:' }, ...'abcd'.split('').map((k) => ({ v: k, label: `(${k}) ${T(`\\sqrt{${CP[k].N}}`)}` }))],
  intro: (k) => `Estimate ${T(`\\sqrt{${CP[k].N}}`)} from ${T('\\sqrt3\\approx1.732')}. Press <b>Next</b>.`,
  ask: (k) => `<b>Example 6(${k}).</b> Given ${T('\\sqrt3\\approx1.732')}, estimate ${T(`\\sqrt{${CP[k].N}}`)}.`,
  make(stage, k, ex) {
    const d = CP[k], W = ex.W, frac = d.k < 1;
    const top = lab(stage, T(d.simp), 'u2l1-eqbox', W / 2, 22, 'c'); top.style.translate = '-50% 0'; hide(top);
    const NL = new NumberLine(stage, { x: 20, y: 120, width: W - 40, height: 150, min: 0, max: d.max, step: 1, labelStep: d.ls, minor: d.minor || 0, axisY: 100, fontSize: 17 });
    const L = NL.layers.data, ux = (NL.toPx(1) - NL.toPx(0)), S3 = 1.732, bh = 34, by = NL.ay - 14 - bh;
    const bars = [];
    const nb = frac ? 1 : d.k;
    for (let i = 0; i < nb; i++) {
      const g = svgEl('g', {}, L); g.style.opacity = 0;
      svgEl('rect', { x: NL.toPx(i * S3), y: by, width: S3 * ux, height: bh, rx: 5, fill: '#dfe8fb', stroke: RAD, 'stroke-width': 2.5 }, g);
      if (S3 * ux >= 46) { const t = svgEl('text', { x: NL.toPx((i + 0.5) * S3), y: by + bh / 2 + 7, 'text-anchor': 'middle', class: 'u2l1-bartxt' }, g); t.textContent = '√3'; }
      bars.push(g);
    }
    const pieces = svgEl('g', {}, L); pieces.style.opacity = 0;
    if (frac) for (let i = 1; i < 10; i++) svgEl('line', { x1: NL.toPx(i * S3 / 10), x2: NL.toPx(i * S3 / 10), y1: by, y2: by + bh, stroke: RAD, 'stroke-width': 2 }, pieces);
    const one = svgEl('rect', { x: NL.toPx(0), y: by, width: S3 / 10 * ux, height: bh, fill: CO, 'fill-opacity': 0.6 }, L); one.style.opacity = 0;
    const end = frac ? S3 / 10 : d.k * S3;
    const mk = NL.point(end, { color: CO, r: 9 }); mk.style.opacity = 0;
    const vl = lab(stage, `${T(`\\sqrt{${d.N}}\\approx${cC(d.val)}`)}`, 'u2l1-big u2l1-cval', 20 + NL.toPx(end), 120 + NL.ay + 46, 's'); hide(vl);
    const cnt = lab(stage, '', 'u2l1-ccnt', W / 2, 120 + by - 30, 'c'); hide(cnt);
    const st = stamp(stage, '≈ ' + d.val, { ok: true, x: W - 140, y: 340 }); hide(st);
    const mult = frac ? `1.732\\div10=${d.val}` : `${d.k}\\times1.732=${d.val}`;
    return [
      { cap: `Simplify first, so the radicand is ${T('3')}: ${T(d.simp)}.`, run: (c) => show(c, top) },
      { cap: frac ? `${T('\\dfrac{\\sqrt3}{10}')} is <b>one tenth</b> of ${T('\\sqrt3')}: cut one ${T('\\sqrt3')} bar into 10 equal pieces.` : `${T(`${d.k}\\sqrt3`)} is ${d.k} copies of ${T('\\sqrt3\\approx1.732')}, laid end to end.`,
        run: async (c) => {
          for (const [i, b] of bars.entries()) { b.style.opacity = 1; await pop(c, b, 220); if (!frac) { cnt.innerHTML = `${i + 1} × √3`; cnt.style.opacity = 1; } }
          if (frac) { pieces.style.opacity = 1; await appear(c, pieces, 300); one.style.opacity = 1; await appear(c, one, 300); }
        } },
      { cap: `${T(mult)}, so ${T(`\\sqrt{${d.N}}\\approx${d.val}`)}.` + (d.k === 10 ? ' Multiplying by 10 just moves the decimal point.' : frac ? ' Dividing by 10 moves the decimal point back one place.' : ''),
        run: async (c) => { mk.style.opacity = 1; await pop(c, mk); await show(c, vl); await stampIn(c, st); } }
    ];
  }
};

/* =========================================================================================================
 * explainer: going back in (mixed → entire; Example 7)
 * ========================================================================================================= */
const GI = {
  c5: { co: [5, 1], n: 2, b: 2 }, cm2: { co: [-2, 1], n: 3, b: 7 },
  a: { co: [4, 1], n: 2, b: 3, ex: 'Example 7(a)' }, b: { co: [7, 1], n: 2, b: 2, ex: 'Example 7(b)' }, c: { co: [-2, 1], n: 2, b: 11, ex: 'Example 7(c)' },
  d: { co: [3, 1], n: 3, b: 4, ex: 'Example 7(d)' }, e: { co: [-5, 1], n: 3, b: 2, ex: 'Example 7(e)' }, f: { co: [2, 1], n: 4, b: 5, ex: 'Example 7(f)' },
  g: { co: [1, 2], n: 2, b: 20, ex: 'Example 7(g)' }, h: { co: [2, 3], n: 3, b: 54, ex: 'Example 7(h)' }
};
const qT = ([p, q], d = 't') => (q === 1 ? tn(p) : `${p < 0 ? '-' : ''}\\${d}frac{${Math.abs(p)}}{${q}}`);
const giStart = (g) => `${g.co[1] === 1 ? tn(g.co[0]) : `\\dfrac{${g.co[0]}}{${g.co[1]}}`}${rt(g.n, g.b)}`;
const goIn = {
  title: 'Going back in: mixed → entire',
  height: 400,
  choices: [{ v: 'c5', label: T('5\\sqrt2') }, { v: 'cm2', label: T('-2\\sqrt[3]7') }, { sep: 'Example 7 check:' }, ...'abcdefgh'.split('').map((k) => ({ v: k, label: `(${k})` }))],
  intro: (k) => `Write ${T(giStart(GI[k]))} as an entire radical. Press <b>Next</b>.`,
  ask: (k) => `${GI[k].ex ? `<b>${GI[k].ex}.</b> ` : ''}Write ${T(giStart(GI[k]))} as an entire radical.`,
  make(stage, k, ex) {
    const g = GI[k], W = ex.W, n = g.n, svg = stageSvg(stage), [p, q] = g.co, neg = p < 0, even = n % 2 === 0, keepOut = neg && even;
    const base = keepOut ? [-p, q] : [p, q];             // what goes in
    const pin = [base[0] ** n, base[1] ** n];             // raised to the index
    const prodV = pin[0] * g.b / pin[1];
    const y = 112, R = new Rad(stage, svg, { xs: 360, y, n });
    const fracW = 66;
    const coW = q === 1 ? wNum(p, R.fs) : fracW + (neg ? 20 : 0);
    const tCo = R.tile(T(cC(qT(g.co))), 'co', coW), tB = R.num(g.b, 'rad');
    R.start([tCo], [tB]);
    const bT = qT(base), bPow = base[1] === 1 ? (base[0] < 0 ? `(${tn(base[0])})^{${n}}` : `${tn(base[0])}^{${n}}`) : `\\left(${bT}\\right)^{${n}}`;
    const pinT = qT(pin);
    const tMin = keepOut ? R.tile(T('-'), 'neg', 30) : null, tAbs = keepOut ? R.tile(T(cC(qT(base))), 'co', wNum(base[0], R.fs)) : null;
    const powW = base[1] === 1 ? wNum(base[0], R.fs) + 34 + (base[0] < 0 ? 24 : 0) : 104;
    const mover = keepOut ? tAbs : tCo, tX = R.op(), tP = R.num(prodV, 'rad');
    const pinW = pin[1] === 1 ? wNum(pin[0], R.fs) : fracW;
    const lead = keepOut ? '-' : '';
    const parts = [giStart(g), `=${lead}${rt(n, cC(bPow))}\\times${rt(n, cR(g.b))}`, `=${lead}${rt(n, cC(pin[1] === 1 ? (pin[0] < 0 ? `(${tn(pin[0])})` : tn(pin[0])) : pinT) + '\\times' + cR(g.b))}`, `=${lead}${rt(n, tn(prodV))}`];
    const ch = chain(stage, 30, 330, W - 60, parts);
    const st = stamp(stage, '✓ entire radical', { ok: true, x: W - 150, y: 60 }); hide(st);
    const steps = [];
    const powCap = keepOut ? `<b>Even index:</b> the minus sign stays <b>outside</b> (a square root is never negative). Write ${T(bT)} as ${T(rt(n, bPow))}.`
      : (neg ? `<b>Odd index:</b> the sign can go inside. ` : '') + `Write ${T(qT(g.co))} as a ${ROOTW[n]}: raise it to the power ${T(cI(n))}, ${T(`${bPow}=${pinT}`)}.`;
    steps.push({ cap: powCap,
      run: async (c) => {
        await ch.show(c, 0);
        if (keepOut) { await R.set(c, [tMin, tAbs], [tB], { at: new Map([[tMin, tCo._x], [tAbs, tCo._x]]), ms: 500 }); }
        await R.set(c, [...(keepOut ? [tMin] : []), mover], [tB], { morph: [[mover, T(cC(bPow)), 'co', powW]], ms: 600 });
        await ch.show(c, 1);
      } });
    steps.push({ cap: `${T(`${bPow}=${pinT}`)} goes <b>back in</b> under the root sign, multiplying the radicand: ${T(`${pinT}\\times${g.b}`)}.`,
      run: async (c) => {
        await R.set(c, keepOut ? [tMin] : [], [mover, tX, tB], { arc: [mover], ms: 1000, morph: [[mover, T(cC(pinT)), 'pp', pinW]] });
        await ch.show(c, 2);
      } });
    steps.push({ cap: `Multiply the radicands: ${T(`${pinT}\\times${g.b}=${tn(prodV)}`)}. So ${T(`${giStart(g)}=${lead}${rt(n, tn(prodV))}`)}.`,
      run: async (c) => { await R.set(c, keepOut ? [tMin] : [], [tP], { at: new Map([[tP, R.x0]]) }); await ch.show(c, 3); await stampIn(c, st); } });
    return steps;
  }
};

/* =========================================================================================================
 * explainer: comparing and ordering (Example 8)
 * ========================================================================================================= */
const OR = {
  a: { n: 2, items: [[3, 6], [2, 13], [5, 2], [1, 55], [4, 3]], up: true, zones: [[47, 56]], lstep: 1, ex: 'Example 8(a)' },
  b: { n: 3, items: [[2, 9], [3, 3], [1, 70], [-2, 10], [-3, 3]], up: false, zones: [[-83, -78], [68, 84]], lstep: 2, ex: 'Example 8(b)' },
  c: { n: 2, items: [[2, 5], [3, 2], [1, 19]], up: true, zones: [[16, 22]], lstep: 1 }
};
const mixT = (n, [a, b]) => `${a === 1 ? '' : a === -1 ? '-' : tn(a)}${rt(n, b)}`;
const orderDef = {
  title: 'Make them entire, then compare',
  height: 430,
  choices: [{ v: 'c', label: `${T('2\\sqrt5,\\ 3\\sqrt2,\\ \\sqrt{19}')}` }, { sep: 'Example 8 check:' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }],
  intro: (k) => `Order ${T(OR[k].items.map((it) => mixT(OR[k].n, it)).join(',\\ '))}. Press <b>Next</b>.`,
  ask: (k) => `${OR[k].ex ? `<b>${OR[k].ex}.</b> ` : ''}Arrange ${T(OR[k].items.map((it) => mixT(OR[k].n, it)).join(',\\ \\ '))} from <b>${OR[k].up ? 'least to greatest' : 'greatest to least'}</b>.`,
  make(stage, k, ex) {
    const d = OR[k], W = ex.W, n = d.n, svg = stageSvg(stage), N = d.items.length;
    const ent = d.items.map(([a, b]) => a ** n * b);
    const CW = 160, CH = 112, gap = (W - 40 - N * CW) / Math.max(1, N - 1), cx = (i) => 20 + i * (CW + Math.min(gap, 60)) + (N < 5 ? (W - 40 - N * CW - (N - 1) * Math.min(gap, 60)) / 2 : 0);
    const cards = d.items.map(([a, b], i) => {
      const el = add(stage, box(h('div', 'u2l1-card'), CW, CH), cx(i), 14);
      const ap = a < 0 ? `(${a})` : String(a), how = a === 1 ? '' : `${ap}^{${n}}\\times${b}`;
      el.innerHTML = `<div class="u2l1-cmix">${T(mixT(n, [a, b]))}</div><div class="u2l1-cent">${T(`=${rt(n, cR(tn(ent[i])))}`)}</div><div class="u2l1-chow">${how ? T(how) : '&nbsp;'}</div>`;
      el.querySelectorAll('.u2l1-cent, .u2l1-chow').forEach(hide);
      el._x = cx(i); return el;
    });
    // number line of radicands (with a break between zones)
    const z = d.zones, BRK = z.length > 1 ? 54 : 0, X0 = 50, L = W - 100 - BRK, span = z.reduce((s, q) => s + q[1] - q[0], 0);
    const toX = (v) => { let x = X0; for (let i = 0; i < z.length; i++) { const [a, b] = z[i], w = (b - a) / span * L; if (v <= b || i === z.length - 1) return x + (v - a) / (b - a) * w; x += w + BRK; } return x; };
    const AY = 226, axis = svgEl('g', {}, svg); axis.style.opacity = 0;
    z.forEach(([a, b]) => {
      svgEl('line', { x1: toX(a) - 10, x2: toX(b) + 10, y1: AY, y2: AY, stroke: INK, 'stroke-width': 3 }, axis);
      for (let v = a; v <= b; v++) {
        const x = toX(v); svgEl('line', { x1: x, x2: x, y1: AY - 7, y2: AY + 7, stroke: INK, 'stroke-width': 2 }, axis);
        if ((v - a) % d.lstep === 0 || ent.includes(v)) { const t = svgEl('text', { x, y: AY + 28, 'text-anchor': 'middle', class: 'u2l1-axnum' + (ent.includes(v) ? ' u2l1-axhit' : '') }, axis); t.textContent = String(v).replace('-', '−'); }
      }
    });
    if (z.length > 1) { const xb = toX(z[0][1]) + 10 + BRK / 2; svgEl('path', { d: `M${xb - 12} ${AY + 10} L${xb - 4} ${AY - 10} M${xb + 4} ${AY + 10} L${xb + 12} ${AY - 10}`, stroke: INK, 'stroke-width': 2.5, fill: 'none' }, axis); }
    const axT = lab(stage, `radicands (index ${n})`, 'u2l1-axt', W / 2, AY + 44, 's'); hide(axT);
    const sorted = ent.map((v, i) => i).sort((i, j) => (d.up ? ent[i] - ent[j] : ent[j] - ent[i]));
    const dots = ent.map((v, i) => {
      const x = toX(v), g = svgEl('g', {}, svg); g.style.opacity = 0;
      svgEl('circle', { cx: x, cy: AY, r: 9, fill: RAD, stroke: '#fff', 'stroke-width': 2.5 }, g);
      const rank = [...ent].sort((a, b) => a - b).indexOf(v);
      const l = lab(stage, T(rt(n, cR(tn(v)))), 'u2l1-dotl', x, AY - 14 - (rank % 2) * 34, 'n'); hide(l);
      return { g, l };
    });
    const rel = d.up ? '<' : '>';
    const RY = 312, SG = 34, sw = N * CW + (N - 1) * SG, sx = (W - sw) / 2;
    const sortedCards = sorted.map((i, j) => ({ i, x: sx + j * (CW + SG) }));
    const signs = sortedCards.slice(1).map((s) => { const e = lab(stage, T(rel), 'u2l1-big', s.x - SG / 2, RY + 40, 'c'); hide(e); return e; });
    const ordT = sorted.map((i) => mixT(n, d.items[i])).join(`\\ ${rel}\\ `);
    return [
      { cap: `Make each one an <b>entire radical</b>: ${n === 2 ? 'square' : 'cube'} the number in front and multiply it by the radicand.` + (n === 3 ? ' A negative in front goes inside as a negative.' : ''),
        run: async (c) => { for (const el of cards) { const [e1, e2] = [el.querySelector('.u2l1-chow'), el.querySelector('.u2l1-cent')]; e1.style.opacity = 1; e2.style.opacity = 1; await Promise.all([fadeIn(c, e1, 260), fadeIn(c, e2, 260)]); } } },
      { cap: `Same index, so compare the <b>radicands</b>: ${T(ent.map((v) => tn(v)).join(',\\ '))}. Place them on a number line.`,
        run: async (c) => { axis.style.opacity = 1; await appear(c, axis, 300); axT.style.opacity = 1; for (const dt of dots) { dt.g.style.opacity = 1; dt.l.style.opacity = 1; await pop(c, dt.l, 220); } } },
      { cap: `The larger the radicand, the larger the radical. ${d.up ? 'Least to greatest' : 'Greatest to least'}: ${T(ordT)}.`,
        run: async (c) => {
          const from = cards.map((e) => [e._x, 14]);
          await tween(c, 1000, (t) => sortedCards.forEach((s) => { const e = cards[s.i], [fx, fy] = from[s.i]; e.style.left = (fx + (s.x - fx) * t) + 'px'; e.style.top = (fy + (RY - fy) * t) + 'px'; }));
          for (const s of signs) { s.style.opacity = 1; await pop(c, s, 200); }
        } }
    ];
  }
};

/* =========================================================================================================
 * explainer: radicals in context (Examples 9 and 10)
 * ========================================================================================================= */
const CX = {
  a: { ex: 'Example 9(a)', ask: `A square floor has area ${T('288\\ \\text{m}^2')}. Side length and perimeter?` },
  b: { ex: 'Example 9(b)', ask: `A cube planter holds ${T('1\\,080\\ \\text{cm}^3')}. Edge length?` },
  c: { ex: 'Example 10(a)', ask: `Right triangle with legs 4 cm and 8 cm. Hypotenuse?` },
  d: { ex: 'Example 10(b)', ask: `Length of ${T('AB')} with ${T('A(-2,\\ 5)')} and ${T('B(4,\\ -1)')}?` }
};
const context = {
  title: 'Exact lengths',
  height: 430,
  choices: [{ sep: 'Example 9 check:' }, { v: 'a', label: '(a) floor' }, { v: 'b', label: '(b) planter' }, { sep: 'Example 10 check:' }, { v: 'c', label: '(a) triangle' }, { v: 'd', label: '(b) segment AB' }],
  intro: (k) => `${CX[k].ask} Press <b>Next</b>.`,
  ask: (k) => `<b>${CX[k].ex}.</b> ${CX[k].ask}`,
  make(stage, k, ex) {
    const W = ex.W, svg = stageSvg(stage);
    const P = panel(stage, 470, 26, W - 500, 370, 'Working');
    const lines = (arr) => arr.map((s) => { const e = h('div', 'u2l1-pline', T(s)); P.appendChild(e); hide(e); return e; });
    if (k === 'a') {
      const Q = tileSquare(stage, svg, 90, 26, 312, 12, 2, { unit: T('\\text{m}^2') });
      const ln = lines([`A=${cR(288)}\\ \\text{m}^2`, `288=${cC(144)}\\times${cR(2)}`, `s=\\sqrt{288}=${cC(12)}\\sqrt{${cR(2)}}\\ \\text{m}`, `P=4\\times12\\sqrt2=${cC(48)}\\sqrt{${cR(2)}}\\ \\text{m}`]);
      const per = svgEl('rect', { x: 90, y: 26, width: 312, height: 312, fill: 'none', stroke: CO, 'stroke-width': 7 }, svg); per.style.opacity = 0;
      return [
        { cap: `Side ${T('=\\sqrt{288}')}. Hunt: the largest perfect square in 288 is ${T(cC(144))}, so ${T(`288=${cC(144)}\\times${cR(2)}`)}.`, run: async (c) => { await show(c, ln[0]); await show(c, ln[1]); } },
        { cap: `That is ${T(cC(144))} tiles of ${T(cR('2\\ \\text{m}^2'))}: a ${T('12\\times12')} grid. Each tile’s side is ${T(cR('\\sqrt2'))}.`, run: async (c) => { Q.area.style.opacity = 0; Q.grid.setAttribute('opacity', 1); await appear(c, Q.grid, 500); Q.one.style.opacity = 1; Q.side0.style.opacity = 0; Q.oneL.style.opacity = 1; await pop(c, Q.oneL); } },
        { cap: `One side is 12 tile sides: ${T(`s=${cC(12)}\\sqrt{${cR(2)}}\\ \\text{m}`)}.`, run: async (c) => { Q.ticks.style.opacity = 1; Q.oneL.style.opacity = 0; await appear(c, Q.ticks, 300); await pop(c, Q.sideK); await show(c, ln[2]); } },
        { cap: `Perimeter: four sides, ${T('P=4\\times12\\sqrt2=48\\sqrt2\\ \\text{m}')}.`, run: async (c) => { per.style.opacity = 1; await drawIn(per, 600, c); await show(c, ln[3]); } }
      ];
    }
    if (k === 'b') {
      const Cb = isoCube(stage, svg, 250, 175, 150, 6);
      const ln = lines([`V=${cR('1\\,080')}\\ \\text{cm}^3`, `1\\,080=${cC(216)}\\times${cR(5)}`, `e=\\sqrt[3]{1\\,080}=${cC(6)}\\sqrt[3]{${cR(5)}}\\ \\text{cm}`]);
      const vlab = lab(stage, `volume ${T(cR('1\\,080'))}`, 'u2l1-tarea', 250, 175 - 75, 'c');
      const ol = lab(stage, T(cR('\\sqrt[3]5')), 'u2l1-tone', Cb.cE[0] + 8, Cb.cE[1], 'e'); hide(ol);
      const el = lab(stage, `edge ${T(`${cC(6)}\\sqrt[3]{${cR(5)}}`)}`, 'u2l1-tside', Cb.mid[0] + 18, Cb.mid[1] + 14, 'se'); hide(el);
      return [
        { cap: `Edge ${T('=\\sqrt[3]{1\\,080}')}. Hunt for the largest perfect cube: ${T(`1\\,080=${cC(216)}\\times${cR(5)}`)} (${T('216=6^3')}).`, run: async (c) => { await show(c, ln[0]); await show(c, ln[1]); } },
        { cap: `That is ${T(cC(216))} little cubes of ${T(cR('5\\ \\text{cm}^3'))}, ${T('6\\times6\\times6')}. Each little cube’s edge is ${T(cR('\\sqrt[3]5'))}.`, run: async (c) => { vlab.style.opacity = 0; Cb.grid.setAttribute('opacity', 1); await appear(c, Cb.grid, 500); Cb.one.style.opacity = 1; await appear(c, Cb.one, 300); await pop(c, ol); } },
        { cap: `One edge is 6 little edges: ${T(`e=${cC(6)}\\sqrt[3]{${cR(5)}}\\ \\text{cm}`)}.`, run: async (c) => { Cb.ticks.style.opacity = 1; await appear(c, Cb.ticks, 300); await pop(c, el); await show(c, ln[2]); } }
      ];
    }
    if (k === 'c') {
      const G = new Graph(stage, { x: 20, y: 40, width: 440, height: 290, xmin: -1, xmax: 9, ymin: -1, ymax: 5, xlabels: 2, ylabels: 2, origin: false, numbers: false, arrows: false, axes: false, fontSize: 15 });
      const A = [0, 0], B = [8, 0], C = [0, 4];
      const l1 = G.segment(A, B, { color: CO, width: 5 }), l2 = G.segment(A, C, { color: CO, width: 5 }), hy = G.segment(B, C, { color: RAD, width: 5 });
      [l1, l2, hy].forEach(hide);
      const [ax, ay] = G.toPx(0, 0); svgEl('path', { d: `M${ax + 16} ${ay} L${ax + 16} ${ay - 16} L${ax} ${ay - 16}`, fill: 'none', stroke: INK, 'stroke-width': 2.5 }, G.layers.top);
      const t1 = G.label(4, 0, T(cC('8')), { pos: 's', cls: 'bk-ptlab' }), t2 = G.label(0, 2, T(cC('4')), { pos: 'w', cls: 'bk-ptlab' }), t3 = G.label(4, 2, T(cR('c')), { pos: 'ne', cls: 'bk-ptlab' });
      [t1, t2, t3].forEach(hide);
      const ln = lines(['c^2=4^2+8^2', '=16+64=80', 'c=\\sqrt{80}', `=\\sqrt{${cC(16)}\\times${cR(5)}}`, `=${cC(4)}\\sqrt{${cR(5)}}\\ \\text{cm}`]);
      return [
        { cap: `Legs ${T('4')} and ${T('8')}; the hypotenuse ${T('c')} is across from the right angle.`, run: async (c) => { for (const e of [l1, l2]) { e.style.opacity = 1; await G.drawIn(e, 500, c); } [t1, t2].forEach((e) => (e.style.opacity = 1)); hy.style.opacity = 1; await G.drawIn(hy, 600, c); t3.style.opacity = 1; } },
        { cap: `Pythagorean theorem: ${T('c^2=4^2+8^2=16+64=80')}, so ${T('c=\\sqrt{80}')}.`, run: async (c) => { for (const e of ln.slice(0, 3)) await show(c, e); } },
        { cap: `Hunt: ${T(`80=${cC(16)}\\times${cR(5)}`)}, so ${T(`c=${cC(4)}\\sqrt{${cR(5)}}\\ \\text{cm}`)} exactly.`, run: async (c) => { await show(c, ln[3]); await show(c, ln[4]); t3.innerHTML = T(`c=${cC(4)}\\sqrt{${cR(5)}}`); await pulse(c, t3); } }
      ];
    }
    const G = new Graph(stage, { x: 20, y: 14, width: 400, height: 400, xmin: -4, xmax: 6, ymin: -3, ymax: 7, xlabels: 2, ylabels: 2, fontSize: 15 });
    const A = [-2, 5], B = [4, -1], Cc = [-2, -1];
    const seg = G.segment(A, B, { color: RAD, width: 5 });
    G.point(...A, { label: T('A(-2,\\ 5)'), pos: 'ne', color: INK }); G.point(...B, { label: T('B(4,\\ -1)'), pos: 'se', color: INK });
    const v = G.segment(A, Cc, { color: CO, width: 4, dash: true }), hz = G.segment(Cc, B, { color: CO, width: 4, dash: true }); hide(v); hide(hz);
    const tv = G.label(-2, 2, T(cC('6')), { pos: 'w', cls: 'bk-ptlab' }), th = G.label(1, -1, T(cC('6')), { pos: 's', cls: 'bk-ptlab' }); hide(tv); hide(th);
    const ln = lines(['\\Delta x=4-(-2)=6', '\\Delta y=-1-5=-6', 'AB=\\sqrt{6^2+(-6)^2}', '=\\sqrt{72}', `=\\sqrt{${cC(36)}\\times${cR(2)}}=${cC(6)}\\sqrt{${cR(2)}}`]);
    return [
      { cap: `Draw the legs: down from ${T('A')} and across to ${T('B')}. Horizontal change ${T('4-(-2)=6')}; vertical change ${T('-1-5=-6')}.`,
        run: async (c) => { v.style.opacity = 1; await G.drawIn(v, 500, c); tv.style.opacity = 1; hz.style.opacity = 1; await G.drawIn(hz, 500, c); th.style.opacity = 1; await show(c, ln[0]); await show(c, ln[1]); } },
      { cap: `Pythagorean theorem with legs 6 and 6: ${T('AB=\\sqrt{6^2+(-6)^2}=\\sqrt{72}')}.`, run: async (c) => { await show(c, ln[2]); await show(c, ln[3]); } },
      { cap: `Hunt: ${T(`72=${cC(36)}\\times${cR(2)}`)}, so ${T(`AB=${cC(6)}\\sqrt{${cR(2)}}`)} exactly.`, run: async (c) => { await show(c, ln[4]); await pulse(c, seg, 1.04); } }
    ];
  }
};

/* =============================== static figures =============================== */
function mountFigures() {
  const f = document.getElementById('u2l1-ex10fig'); if (!f) return;
  const G = new Graph(f, { width: 300, height: 300, xmin: -4, xmax: 6, ymin: -3, ymax: 7, xlabels: 2, ylabels: 2, fontSize: 14 });
  G.segment([-2, 5], [4, -1], { color: INK, width: 3.5 });
  G.point(-2, 5, { label: T('A'), pos: 'nw', color: INK }); G.point(4, -1, { label: T('B'), pos: 'se', color: INK });
}

/* =============================== Stand Up Break =============================== */
const SQF = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15];
const CBF = [2, 3, 4, 5, 6, 7, 9, 10];
standup('u2l1', {
  intro: 'Whiteboards: hunt for the largest perfect power, let it escape, then check simplest form. No calculators.',
  levels: {
    BEG: (r) => { const k = r.int(2, 10), m = r.pick(SQF), N = k * k * m; return { text: 'Write as a mixed radical in simplest form.', q: `\\sqrt{${tn(N)}}`, a: [`\\sqrt{${k * k}\\times${m}}`, `=\\sqrt{${k * k}}\\times\\sqrt{${m}}`, `=${k}\\sqrt{${m}}`] }; },
    PRG: (r) => {
      if (r.chance(0.5)) { const k = r.int(2, 5), m = r.pick(CBF), s = r.pick([1, 1, -1]), N = s * k ** 3 * m; return { text: 'Write as a mixed radical in simplest form.', q: `\\sqrt[3]{${tn(N)}}`, a: [`\\sqrt[3]{${tn(s * k ** 3)}\\times${m}}`, `=${tn(s * k)}\\sqrt[3]{${m}}`] }; }
      const c = r.pick([2, 3, -2, -3, 4]), k = r.int(2, 6), m = r.pick(SQF), N = k * k * m; return { text: 'Simplify.', q: `${c}\\sqrt{${tn(N)}}`, a: [`${c}\\sqrt{${k * k}\\times${m}}`, `=${c}\\times${k}\\sqrt{${m}}`, `=${tn(c * k)}\\sqrt{${m}}`] };
    },
    MAS: (r) => {
      const used = new Set(), items = [];
      while (items.length < 4) { const a = r.int(2, 6), b = r.pick([2, 3, 5, 6, 7, 10, 11]); const e = a * a * b; if (e > 150 || used.has(e)) continue; used.add(e); items.push([a, b, e]); }
      const sorted = items.slice().sort((x, y) => x[2] - y[2]);
      return { text: 'Write each as an entire radical, then arrange from least to greatest.', q: items.map(([a, b]) => `${a}\\sqrt{${b}}`).join(',\\ \\ '),
        a: [items.map(([a, b, e]) => `${a}\\sqrt{${b}}=\\sqrt{${e}}`).join(',\\ \\ '), sorted.map(([a, b]) => `${a}\\sqrt{${b}}`).join('<')] };
    }
  }
});

/* =============================== mount =============================== */
mountDots();
mountFigures();
export const explainers = mountExplainers({ rootFind, ladder: ladderDef, underOne, trueFalse, tiles: tilesDef, hunt, primes, simplest, copies, goIn, order: orderDef, context });
export const _test = { RF, LD, UO, TF, HU, SI, PR, CP, GI, OR, primeFactors };
