/* Math 20-1 · Unit 1 · Lesson 3 — Arithmetic Sequences in Context.
 * Warm-up (Kangaroo Tracks: two prints left on the beach, count the hops, find print #1), the Example 8 figures,
 * and the explainers:
 *   gapSplit (STAR: two known tiles on a strip, count the jumps, split the gap equally, step back to t1, then the
 *     tiles drop onto a graph as dots (n, t_n) and the slope triangle shows slope = d; Example 1, 2, 3 checks),
 *   system (bar model of t1 + (p−1)d and t1 + (q−1)d: the common part cancels when you subtract; Example 1(c) check),
 *   amphi (rows of seats as arcs: d from rows p and q, row 1, and the number of rows from the back row; Example 3),
 *   startOrAfter (one money timeline, two numberings: t1 at the start vs after one period; Example 4(b)(c)),
 *   firstPass (bars against a threshold: solve the inequality, round to fit the question, check both sides; 4(d), 5(d)),
 *   feeRate (stacked bars: hourly blocks plus the fixed fee; the fee is a "0-hour job" = t1 − d; Example 5),
 *   truck (years as positions, straight-line depreciation and the first year below a value; Example 6),
 *   balloon (readings every 100 m with a thermometer: reading n is at 100(n − 1) m; Example 7),
 *   linear (dots (n, t_n) on a line: slope d, intercept t1 − d is not a term, dots not joined; Example 8 checks).
 * Colours (unit pair): d / common difference amber, t1 / first term teal (#0e7c7b); known terms burgundy; b purple. */
import {
  h, tex, add, box, fit, Box, Graph, stamp, stampIn, mountExplainers, pop, fadeIn, appear, sleep, tween,
  pairTex, texNum, svgEl, liveCtx, pulse, drawIn, place, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const DC = COLORS.amber, TC = '#0e7c7b', KC = COLORS.brand, BC = COLORS.purple, INK = COLORS.ink, GRAY = COLORS.gray,
  RED = COLORS.red, GRN = COLORS.green, SLATE = COLORS.slate;
const cD = (s) => `\\textcolor{${DC}}{${s}}`, cT = (s) => `\\textcolor{${TC}}{${s}}`, cK = (s) => `\\textcolor{${KC}}{${s}}`,
  cB = (s) => `\\textcolor{${BC}}{${s}}`, cR = (s) => `\\textcolor{${RED}}{${s}}`, cG = (s) => `\\textcolor{${GRN}}{${s}}`;

/* ---------- numbers ---------- */
/** TeX number: thin space in 5+ digit whole parts (as in the booklet: 6600, 96\,800) */
function tn(v) {
  const s = texNum(v), neg = s[0] === '-';
  let [i, f] = (neg ? s.slice(1) : s).split('.');
  if (i.length >= 5) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');
  return (neg ? '-' : '') + i + (f ? '.' + f : '');
}
/** HTML number (narrow no-break space, real minus) */
const hn = (v) => tn(v).replace(/\\,/g, ' ').replace('-', '−');
/** a number in brackets when negative, for substitutions */
const par = (v) => (v < 0 ? `(${tn(v)})` : tn(v));
const money = (v) => (v < 0 ? '-' : '') + '\\$' + tn(Math.abs(v));
/** mn + b in the booklet's style: 5n-1, 90n+2400, 7-2.5n (constant first when the slope is negative) */
function lin(m, b, v = 'n') {
  const mt = (a) => (a === 1 ? '' : tn(a)) + v;
  if (m < 0 && b > 0) return `${tn(b)}-${mt(-m)}`;
  if (m < 0) return `-${mt(-m)}${b < 0 ? '-' + tn(-b) : ''}`;
  return `${mt(m)}${b > 0 ? '+' + tn(b) : b < 0 ? '-' + tn(-b) : ''}`;
}
/** a nice axis step for a span split into about k parts */
function niceStep(span, k = 8) {
  const raw = span / k, p = 10 ** Math.floor(Math.log10(raw));
  return [1, 2, 2.5, 5, 10].map((m) => m * p).find((s) => s >= raw - 1e-9);
}
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const show = (c, el, ms = 320) => fadeIn(c, el, ms);
/** a right-hand panel of algebra lines */
function panel(stage, x, y, w, hh, title) {
  const p = add(stage, box(h('div', 'u1l3-panel', title ? `<div class="u1l3-ph">${title}</div>` : ''), w, hh), x, y);
  return p;
}
const pline = (p, html, cls = '') => { const d = h('div', 'u1l3-line ' + cls, html); p.appendChild(d); return hide(d); };
/** an SVG layer over the whole stage (arcs, braces, flying dots) */
function overlay(stage, W, H) {
  const s = svgEl('svg', { class: 'u1l3-ov', width: W, height: H, viewBox: `0 0 ${W} ${H}` });
  stage.appendChild(s); s.style.left = '0px'; s.style.top = '0px'; return s;
}
/** a hop arc from x1 to x2 (top side), as a drawable stroke */
function arc(parent, x1, x2, y, lift, color, o = {}) {
  const mx = (x1 + x2) / 2;
  return svgEl('path', { class: 'bk-stroke', d: `M${x1.toFixed(1)} ${y} Q${mx.toFixed(1)} ${y - lift * 2} ${x2.toFixed(1)} ${y}`, fill: 'none', stroke: color,
    'stroke-width': o.w || 3, 'stroke-linecap': 'round', 'stroke-dasharray': o.dash || null }, parent);
}
/** a curly brace under a span (opens downward, label below) */
function brace(parent, x1, x2, y, color, o = {}) {
  const m = (x1 + x2) / 2, r = Math.min(9, (x2 - x1) / 4), s = o.up ? -1 : 1;
  const d = `M${x1} ${y} q0 ${s * r} ${r} ${s * r} L${m - r} ${y + s * r} q${r} 0 ${r} ${s * r} q0 ${-s * r} ${r} ${-s * r} L${x2 - r} ${y + s * r} q${r} 0 ${r} ${-s * r}`;
  return svgEl('path', { class: 'bk-stroke', d, fill: 'none', stroke: color, 'stroke-width': 2.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, parent);
}
/** an HTML label at stage px */
function slab(stage, x, y, html, pos = 'c', cls = '') { const d = h('div', 'bk-lab u1l3-slab ' + cls, html); stage.appendChild(d); place(d, x, y, pos, 0); return d; }

/* ---------- a small bar chart (custom block on Box) ---------- */
class Bars extends Box {
  constructor(host, o) {
    super(host, o, 'u1l3-bars', o.width, o.height);
    this.P = Object.assign({ l: 10, r: 10, t: 14, b: 34 }, o.pad || {});
    Object.assign(this, { n0: o.n0, n1: o.n1, vmin: o.vmin, vmax: o.vmax });
    this.bw = Math.min(o.bw || 44, this.pitch * 0.66);
    this.gBg = svgEl('g', {}, this.svg); this.gBars = svgEl('g', {}, this.svg); this.gTop = svgEl('g', {}, this.svg);
    const y0 = this.py(this.vmin);
    svgEl('line', { x1: this.P.l - 4, x2: this.W - this.P.r, y1: y0, y2: y0, stroke: INK, 'stroke-width': 2 }, this.gBg);
    if (o.ticks) {
      for (const v of o.ticks) {
        const y = this.py(v);
        svgEl('line', { x1: this.P.l, x2: this.W - this.P.r, y1: y, y2: y, stroke: '#e3e1da', 'stroke-width': 1 }, this.gBg);
        (this.tl = this.tl || {})[v] = this.hlabel(this.P.l - 8, y, (o.tickFmt || hn)(v), { pos: 'w', cls: 'u1l3-tick', gap: 0 });
      }
      svgEl('line', { x1: this.P.l, x2: this.P.l, y1: this.P.t - 6, y2: y0, stroke: INK, 'stroke-width': 2 }, this.gBg);
    }
    if (o.broken) { // a zig-zag on the value axis: it doesn't start at 0
      const x = this.P.l, y = y0 - 14;
      svgEl('path', { d: `M${x - 7} ${y + 5} l7 -5 l-7 -5 l7 -5`, fill: 'none', stroke: INK, 'stroke-width': 2 }, this.gBg);
    }
    this.nl = {};
    if (o.nlab) for (let n = this.n0; n <= this.n1; n++) { const t = o.nlab(n); if (t != null) this.nl[n] = this.hlabel(this.px(n), y0 + 6, t, { pos: 's', cls: 'u1l3-nlab', gap: 0 }); }
  }
  get pitch() { return (this.W - this.P.l - this.P.r) / (this.n1 - this.n0 + 1); }
  px(n) { return this.P.l + (n - this.n0 + 0.5) * this.pitch; }
  py(v) { return this.P.t + (this.vmax - v) / (this.vmax - this.vmin) * (this.H - this.P.t - this.P.b); }
  /** a bar segment for position n from value a to value b (starts empty: grow() it) */
  seg(n, a, b, o = {}) {
    const r = svgEl('rect', { x: this.px(n) - (o.w || this.bw) / 2, width: o.w || this.bw, rx: 3, fill: o.color || GRAY, stroke: o.stroke || 'none', 'stroke-width': o.sw || 0,
      'stroke-dasharray': o.dash || null, 'fill-opacity': o.op ?? 1 }, o.layer || this.gBars);
    r.a = a; r.b = b; this.setSeg(r, a, o.empty === false ? b : a); return r;
  }
  setSeg(r, a, b) { const y0 = this.py(a), y1 = this.py(b); r.setAttribute('y', Math.min(y0, y1)); r.setAttribute('height', Math.abs(y0 - y1)); r.cur = b; }
  grow(c, r, ms = 360) { const a = r.a, b = r.b; return tween(c, ms, (t) => this.setSeg(r, a, a + (b - a) * t)); }
  bar(n, v, o = {}) { return this.seg(n, this.vmin, v, o); }
  /** a dashed level line with a label at the right */
  level(v, html, color = RED) {
    const y = this.py(v), g = svgEl('g', {}, this.gTop);
    svgEl('line', { class: 'bk-stroke', x1: this.P.l, x2: this.W - this.P.r, y1: y, y2: y, stroke: color, 'stroke-width': 2.6, 'stroke-dasharray': '9 7' }, g);
    if (html) g.lab = this.hlabel(this.P.l - 6, y, html, { pos: 'w', cls: 'u1l3-lvl', gap: 0 });
    if (g.lab) g.lab.style.color = color;
    if (this.tl && this.tl[v]) this.tl[v].style.visibility = 'hidden';
    return g;
  }
  vlab(n, v, html, cls = '') { return this.hlabel(this.px(n), this.py(v) - 4, html, { pos: 'n', cls: 'u1l3-vlab ' + cls, gap: 0 }); }
}
async function growAll(c, B, rs, ms = 360, gap = 40) { for (const r of rs) { await B.grow(c, r, ms); if (gap) await sleep(c, gap); } }

/* ====================================================================================================
 * Warm-up: Kangaroo Tracks. Print n is at 4n − 2 m (2, 6, 10, …, 34). Only #3 (10 m) and #8 (30 m) are left.
 * ==================================================================================================== */
function mountBeach() {
  const host = document.getElementById('u1l3-beach'); if (!host) return;
  let busyJ = false, busyB = false;
  const build = () => {
    host.innerHTML = '';
    const W = Math.max(480, host.clientWidth || 600), H = 262, X = (m) => 26 + m * (W - 52) / 41, PY = 150;
    const svg = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u1l3-bsvg', role: 'img', 'aria-label': 'Kangaroo footprints on a beach with a tape measure' }, host);
    svgEl('rect', { x: 0, y: 0, width: W, height: H, rx: 14, fill: '#f4e4bf' }, svg);
    // the sea at the top
    let d = `M0 0 H${W} V34`;
    for (let x = W; x > 0; x -= 40) d += ` q-10 10 -20 0 q-10 -10 -20 0`;
    svgEl('path', { d: d + ' Z', fill: '#8ccbe0' }, svg);
    // the wave that washed the prints away (wet sand)
    let w2 = `M0 40 H${W} V178`;
    for (let x = W; x > 0; x -= 60) w2 += ` q-15 14 -30 0 q-15 -14 -30 0`;
    const wet = svgEl('path', { d: w2 + ' Z', fill: '#bfe0e8', 'fill-opacity': 0.55 }, svg);
    // tape measure
    svgEl('rect', { x: X(0) - 8, y: 206, width: X(40) - X(0) + 16, height: 34, rx: 5, fill: '#f6c945', stroke: '#9a7a14', 'stroke-width': 1.5 }, svg);
    for (let m = 0; m <= 40; m++) {
      const big = m % 10 === 0, mid = m % 2 === 0;
      svgEl('line', { x1: X(m), x2: X(m), y1: 206, y2: 206 + (big ? 16 : mid ? 10 : 6), stroke: '#5b470a', 'stroke-width': big ? 2 : 1.2 }, svg);
      if (big) { const t = svgEl('text', { x: X(m), y: 236, 'text-anchor': 'middle', class: 'u1l3-tape' }, svg); t.textContent = m + ' m'; }
    }
    // kangaroo, facing right, at the far end
    const k = svgEl('g', { transform: `translate(${X(39.2)} ${PY - 4})`, class: 'u1l3-roo' }, svg);
    svgEl('path', { d: 'M-6 22 C-26 30 -40 34 -52 30 C-40 26 -26 20 -14 12 Z', fill: '#a8642c' }, k); // tail
    svgEl('ellipse', { cx: 0, cy: 2, rx: 13, ry: 22, transform: 'rotate(18)', fill: '#b8733a' }, k);
    svgEl('ellipse', { cx: 2, cy: 26, rx: 16, ry: 5, fill: '#a8642c' }, k); // feet
    svgEl('circle', { cx: 9, cy: -24, r: 8.5, fill: '#b8733a' }, k);
    svgEl('path', { d: 'M12 -26 L22 -22 L12 -19 Z', fill: '#b8733a' }, k); // snout
    svgEl('ellipse', { cx: 5, cy: -36, rx: 3, ry: 8, transform: 'rotate(-12 5 -36)', fill: '#a8642c' }, k);
    svgEl('circle', { cx: 11, cy: -26, r: 1.6, fill: '#111' }, k);
    svgEl('path', { d: 'M8 -6 L16 2', stroke: '#a8642c', 'stroke-width': 4, 'stroke-linecap': 'round' }, k);
    const prints = {};
    for (let n = 1; n <= 9; n++) {
      const x = X(4 * n - 2), g = svgEl('g', { class: 'u1l3-print' }, svg);
      for (const dy of [-8, 8]) {
        svgEl('ellipse', { cx: x, cy: PY + dy, rx: 12, ry: 4.6, fill: '#8a6a3c' }, g);
        svgEl('circle', { cx: x + 13, cy: PY + dy, r: 2.6, fill: '#8a6a3c' }, g);
      }
      const tag = h('div', 'u1l3-ptag' + (n === 3 || n === 8 ? ' u1l3-ptag-on' : ''), '#' + n);
      host.appendChild(tag); place(tag, x, PY - 22, 'n', 0);
      const ml = h('div', 'u1l3-pm', (4 * n - 2) + ' m'); host.appendChild(ml); place(ml, x, 188, 'c', 0);
      const drop = svgEl('line', { x1: x, x2: x, y1: PY + 16, y2: 206, stroke: '#8a6a3c', 'stroke-width': 1.5, 'stroke-dasharray': '3 4' }, svg);
      prints[n] = { g, tag, ml, drop };
      if (n !== 3 && n !== 8) { g.style.opacity = 0; tag.style.opacity = 0; ml.style.opacity = 0; drop.style.opacity = 0; }
    }
    const arcs = svgEl('g', {}, svg), nums = [];
    return { svg, X, PY, prints, wet, arcs, nums };
  };
  let S = build();
  const c = liveCtx();
  const jumps = async () => {
    if (busyJ || S.arcs.childNodes.length) return; busyJ = true; const S0 = S;
    for (let i = 3; i < 8; i++) {
      const x1 = S.X(4 * i - 2) + 6, x2 = S.X(4 * i + 2) - 6, p = arc(S.arcs, x1, x2, S.PY - 30, 22, DC, { w: 3 });
      await drawIn(p, 260, c);
      const t = h('div', 'u1l3-hopn', String(i - 2)); if (S !== S0) break; S.svg.parentNode.appendChild(t); place(t, (x1 + x2) / 2, S.PY - 74, 'c', 0); await c.pop(t, 240); S.nums.push(t);
    }
    busyJ = false;
  };
  const back = async () => {
    if (busyB || S.back) return; busyB = true; S.back = true;
    await c.anim(S.wet, [{ opacity: 1 }, { opacity: 0 }], 500);
    for (let n = 1; n <= 9; n++) { const P = S.prints[n]; if (n === 3 || n === 8) { P.ml.style.opacity = 1; continue; } for (const e of [P.g, P.tag, P.ml, P.drop]) e.style.opacity = 1; await c.pop(P.g, 200); }
    busyB = false;
  };
  document.getElementById('u1l3-wjumps')?.addEventListener('click', jumps);
  document.getElementById('u1l3-wprints')?.addEventListener('click', back);
  document.getElementById('u1l3-wreset')?.addEventListener('click', () => { if (!busyJ && !busyB) S = build(); });
  let lastW = host.clientWidth;
  new ResizeObserver(() => { const w = host.clientWidth; if (!busyJ && !busyB && w && Math.abs(w - lastW) > 4) { lastW = w; S = build(); } }).observe(host);
}

/* ====================================================================================================
 * Explainer (STAR): two known terms on a strip → equal jumps → back to t1 → dots on a line with slope d.
 * ==================================================================================================== */
const GS = {
  demo: { label: T('t_2=7,\\ t_5=16'), p: 2, tp: 7, q: 5, tq: 16 },
  ex1: { label: 'Example 1 check', p: 4, tp: 19, q: 11, tq: 54 },
  ex2: { label: 'Example 2 check', p: 6, tp: -8, q: 20, tq: -43, extra: 50 },
  ex3: { label: 'Example 3 check', p: 6, tp: 64, q: 16, tq: 94, row: true }
};
const gapSplit = {
  title: 'Two known terms: split the gap into equal jumps',
  height: 500,
  choices: Object.keys(GS).map((k) => ({ v: k, label: GS[k].label })),
  intro: 'Only two tiles are known. Count the jumps between them, then share out the change. Press <b>Next</b>.',
  make(stage, k, ex) {
    const g = GS[k], { p, tp, q, tq } = g, J = q - p, dv = (tq - tp) / J, t1 = tp - (p - 1) * dv;
    const vals = Array.from({ length: q }, (_, i) => t1 + i * dv);
    const W = ex.W, H = 500, pitch = Math.min(100, (W - 40) / q), x0 = (W - pitch * q) / 2, cx = (n) => x0 + (n - 0.5) * pitch;
    const TY = 66, TH = 50, tw = pitch - (pitch < 60 ? 3 : 6);
    const tiles = [];
    for (let n = 1; n <= q; n++) {
      const known = n === p || n === q, el = h('div', 'u1l3-tile' + (known ? ' u1l3-known' : ''), known ? T(tn(vals[n - 1])) : '?');
      box(el, tw, TH); add(stage, el, cx(n) - tw / 2, TY); tiles.push(el);
      const lab = h('div', 'u1l3-tpos' + (known ? ' u1l3-tpos-k' : ''), T(`t_{${n}}`)); stage.appendChild(lab); place(lab, cx(n), TY + TH + 3, 's', 0);
    }
    const em = (v) => { const t = tn(v).replace(/\\,/g, ''); return 0.5 * t.replace(/[^0-9]/g, '').length + (t.includes('-') ? 0.78 : 0) + (t.includes('.') ? 0.28 : 0); };
    const FS = Math.max(14, Math.min(21, ...vals.map((v) => (tw - 6) / em(v))));
    const tfs = () => FS;
    const setTile = (n, cls) => { const el = tiles[n - 1]; el.innerHTML = T(tn(vals[n - 1])); el.classList.add(cls); el.style.fontSize = tfs(vals[n - 1]) + 'px'; return el; };
    tiles.forEach((el, i) => { if (i + 1 === p || i + 1 === q) el.style.fontSize = tfs(vals[i]) + 'px'; });
    // graph and panel underneath
    const GY = 212, GH = 284, GW = Math.round(W * 0.58), PX = GW + 30;
    const lo = Math.min(0, ...vals), hi = Math.max(0, ...vals), st = niceStep(hi - lo, 7);
    const ymin = Math.floor(lo / st - 1e-9) * st - (lo < 0 ? st * 0.4 : 0), ymax = Math.ceil(hi / st + 0.25) * st;
    const G = new Graph(stage, { x: 14, y: GY, width: GW, height: GH, xmin: 0, xmax: q + 0.8, ymin, ymax, ystep: st, ylabels: st * 2,
      xlabels: q > 12 ? 2 : 1, xtitle: 'n', ytitle: 't_n', fontSize: 15, arrows: false });
    const P = panel(stage, PX, GY, W - PX - 14, GH, g.row ? 'Rows of seats' : 'The algebra');
    const ov = overlay(stage, W, H);
    const pk = (s) => cK(s);
    const L1 = pline(P, `jumps: ${T(`${q}-${p}=${J}`)}`), L2 = pline(P, `change: ${T(`${tn(tq)}-${par(tp)}=${tn(tq - tp)}`)}`);
    const L3 = pline(P, T(`${cD('d')}=\\dfrac{${tn(tq - tp)}}{${J}}=${cD(tn(dv))}`), 'u1l3-big');
    const L4 = pline(P, T(`${tn(tp)}=${cT('t_1')}+${p - 1}(${tn(dv)})\\ \\Rightarrow\\ ${cT('t_1')}=${cT(tn(t1))}`));
    const L5 = pline(P, T(`t_n=${tn(t1)}+(n-1)(${tn(dv)})=${lin(dv, t1 - dv)}`), 'u1l3-ans');
    const L6 = g.extra ? pline(P, T(`t_{${g.extra}}=${tn(t1 + (g.extra - 1) * dv)}`)) : null;
    const jumpArcs = [], jumpLabs = [];
    let tri = null;
    const steps = [
      { cap: `Count the <b>jumps</b> from ${T(`t_{${p}}`)} to ${T(`t_{${q}}`)}: ${T(`${q}-${p}=${J}`)} jumps. Count the <b>gaps</b>, not the tiles.`,
        run: async (c) => {
          for (let n = p; n < q; n++) {
            const a = arc(ov, cx(n) + 4, cx(n + 1) - 4, TY - 3, Math.min(15, pitch * 0.3), GRAY, { w: 2.6 }); jumpArcs.push(a);
            await drawIn(a, Math.max(70, 700 / J), c);
            const l = slab(stage, (cx(n) + cx(n + 1)) / 2, TY - 22, String(n - p + 1), 'n', 'u1l3-jn'); jumpLabs.push(l); await pop(c, l, 160);
          }
          await show(c, L1);
        } },
      { cap: `Over those ${J} jumps the terms change by ${T(`${tn(tq)}-${par(tp)}=${tn(tq - tp)}`)}.`,
        run: async (c) => {
          const b = brace(ov, cx(p), cx(q), TY + TH + 30, KC); await drawIn(b, 500, c);
          const l = slab(stage, (cx(p) + cx(q)) / 2, TY + TH + 44, T(`${tn(tq - tp)}\\ \\text{in}\\ ${J}\\ \\text{jumps}`), 's', 'u1l3-brl'); await pop(c, l, 260);
          await show(c, L2);
        } },
      { cap: `Every jump is the same size, so share the change equally: ${T(`${cD('d')}=${tn(tq - tp)}\\div${J}=${cD(tn(dv))}`)}.`,
        run: async (c) => {
          jumpArcs.forEach((a) => a.setAttribute('stroke', DC));
          jumpLabs.forEach((l) => { l.innerHTML = (dv > 0 ? '+' : '') + hn(dv); l.classList.add('u1l3-jd'); if (pitch < 60) l.style.fontSize = '14.5px'; });
          await show(c, L3);
          for (let n = p + 1; n < q; n++) await pop(c, setTile(n, 'u1l3-fill'), Math.max(90, 500 / J));
        } },
      { cap: p > 1 ? `Jump <b>back</b> ${p - 1} time${p > 2 ? 's' : ''} to reach ${T(cT('t_1'))}: ${T(`${cT('t_1')}=${tn(tp)}-${p - 1}(${tn(dv)})=${cT(tn(t1))}`)}.` : `${T(`t_${p}`)} is ${T('t_1')}.`,
        run: async (c) => {
          for (let n = p - 1; n >= 1; n--) {
            const a = arc(ov, cx(n) + 4, cx(n + 1) - 4, TY - 3, Math.min(15, pitch * 0.3), TC, { w: 2.6, dash: '5 5' }); await drawIn(a, 260, c);
            const l = slab(stage, (cx(n) + cx(n + 1)) / 2, TY - 22, (dv > 0 ? '−' : '+') + hn(Math.abs(dv)), 'n', 'u1l3-jn u1l3-jt'); if (pitch < 60) l.style.fontSize = '14.5px'; await pop(c, l, 160);
            await pop(c, setTile(n, n === 1 ? 'u1l3-first' : 'u1l3-fill'), 200);
          }
          await show(c, L4);
        } },
      { cap: `Now plot every term as a point ${T('(n,\\ t_n)')}. Each tile drops onto the graph.`,
        run: async (c) => {
          for (let n = 1; n <= q; n++) {
            const [gx, gy] = G.toPx(n, vals[n - 1]), sx = cx(n), sy = TY + TH / 2, tx = 14 + gx, ty = GY + gy;
            const col = n === 1 ? TC : n === p || n === q ? KC : INK;
            const dot = svgEl('circle', { cx: sx, cy: sy, r: 6.5, fill: col, stroke: '#fff', 'stroke-width': 2 }, ov);
            await tween(c, Math.max(110, 1300 / q), (t) => { dot.setAttribute('cx', sx + (tx - sx) * t); dot.setAttribute('cy', sy + (ty - sy) * t); });
            dot.remove(); G.point(n, vals[n - 1], { color: col, r: 6.5 });
          }
        } },
      { cap: `Run ${T(String(J))}, rise ${T(tn(tq - tp))}: the slope is ${T(`\\dfrac{${tn(tq - tp)}}{${J}}=${cD(tn(dv))}`)}. The common difference <b>is the slope</b>: the formula for ${T('d')} is the slope formula.`,
        run: async (c) => {
          const s1 = G.segment([p, tp], [q, tp], { color: SLATE, width: 3, dash: '6 5' }), s2 = G.segment([q, tp], [q, tq], { color: DC, width: 4 });
          await G.drawIn(s1, 500, c);
          const l1 = G.label((p + q) / 2, tp, `run ${J}`, { pos: 's', cls: 'bk-ptlab u1l3-glab' }); await pop(c, l1, 200);
          await G.drawIn(s2, 500, c);
          const l2 = G.label(q, (tp + tq) / 2, `rise ${hn(tq - tp)}`, { pos: 'w', cls: 'bk-ptlab u1l3-glab u1l3-glab-d', gap: 10 }); await pop(c, l2, 200);
          tri = G.line({ m: dv, b: t1 - dv }, { color: DC, width: 2, dash: '3 7', arrows: false });
          await G.drawIn(tri, 600, c);
        } },
      { cap: `General term: ${T(`t_n=${cT(tn(t1))}+(n-1)(${tn(dv)})=${lin(dv, t1 - dv)}`)}.${g.extra ? ` And ${T(`t_{${g.extra}}=${lin(dv, t1 - dv).replace('n', `(${g.extra})`)}=${tn(t1 + (g.extra - 1) * dv)}`)}.` : g.row ? ` Row 1 has ${T(cT(tn(t1)))} seats.` : ''}`,
        run: async (c) => { await show(c, L5); if (L6) await show(c, L6); } }
    ];
    return steps;
  }
};

/* ====================================================================================================
 * Explainer: the system of two equations as two bars; subtracting cancels t1 and the shared d's.
 * ==================================================================================================== */
const SY = {
  demo: { label: T('t_3=14,\\ t_7=30'), p: 3, tp: 14, q: 7, tq: 30 },
  ex1c: { label: 'Example 1(c) check', p: 4, tp: 19, q: 11, tq: 54 }
};
const system = {
  title: 'Two equations, one subtraction',
  height: 470,
  choices: Object.keys(SY).map((k) => ({ v: k, label: SY[k].label })),
  intro: 'Write each known term as t₁ plus some d’s. Then compare the two bars. Press <b>Next</b>.',
  make(stage, k, ex) {
    const g = SY[k], { p, tp, q, tq } = g, J = q - p, dv = (tq - tp) / J, t1 = tp - (p - 1) * dv;
    const W = ex.W, BX = 120, s = (W - BX - 120) / tq, BH = 50, YA = 34, YB = 120;
    const mkBar = (y, nd) => {
      const blocks = [];
      const t = add(stage, box(h('div', 'u1l3-blk u1l3-blk-t', T('t_1')), t1 * s - 3, BH), BX, y); blocks.push(hide(t));
      for (let i = 0; i < nd; i++) { const b = add(stage, box(h('div', 'u1l3-blk u1l3-blk-d', T('d')), dv * s - 3, BH), BX + (t1 + i * dv) * s, y); blocks.push(hide(b)); }
      return blocks;
    };
    const lA = add(stage, h('div', 'u1l3-blab', T(`t_{${p}}`)), 20, YA + 10), lB = add(stage, h('div', 'u1l3-blab', T(`t_{${q}}`)), 20, YB + 10);
    const A = mkBar(YA, p - 1), B = mkBar(YB, q - 1);
    const eA = add(stage, h('div', 'u1l3-beq', T(`=${tn(tp)}`)), BX + tp * s + 8, YA + 10), eB = add(stage, h('div', 'u1l3-beq', T(`=${tn(tq)}`)), BX + tq * s + 8, YB + 10);
    const ov = overlay(stage, W, 470);
    const alg = add(stage, box(h('div', 'u1l3-alg'), W - 40, 250), 20, 206);
    const al = (html) => { const d = h('div', 'u1l3-aline', html); alg.appendChild(d); return hide(d); };
    const A1 = al(T(`t_{${p}}:\\quad ${cT('t_1')}+${p - 1}${cD('d')}=${tn(tp)}`)), A2 = al(T(`t_{${q}}:\\quad ${cT('t_1')}+${q - 1}${cD('d')}=${tn(tq)}`));
    const A3 = al(T(`\\text{subtract:}\\quad (${cT('t_1')}+${q - 1}${cD('d')})-(${cT('t_1')}+${p - 1}${cD('d')})=${tn(tq)}-${tn(tp)}`));
    const A4 = al(T(`${J}${cD('d')}=${tn(tq - tp)}\\ \\Rightarrow\\ ${cD('d')}=${cD(tn(dv))}`));
    const A5 = al(T(`${cT('t_1')}+${p - 1}(${tn(dv)})=${tn(tp)}\\ \\Rightarrow\\ ${cT('t_1')}=${cT(tn(t1))}`));
    const shared = BX + tp * s;
    return [
      { cap: `Write ${T(`t_{${p}}`)} with the general term: ${T(`${cT('t_1')}+${p - 1}${cD('d')}=${tn(tp)}`)}. One ${T('t_1')} and ${p - 1} ${T('d')}’s.`,
        run: async (c) => { for (const b of A) await pop(c, b, 200); await pulse(c, eA, 1.15); await show(c, A1); } },
      { cap: `And ${T(`t_{${q}}`)}: ${T(`${cT('t_1')}+${q - 1}${cD('d')}=${tn(tq)}`)}.`,
        run: async (c) => { for (const b of B) await pop(c, b, 160); await pulse(c, eB, 1.15); await show(c, A2); } },
      { cap: `Both bars start with the same ${T(`${cT('t_1')}+${p - 1}${cD('d')}`)}. Line them up.`,
        run: async (c) => {
          const r = svgEl('rect', { class: 'bk-stroke', x: BX - 6, y: YA - 8, width: shared - BX + 9, height: YB + BH - YA + 16, rx: 10, fill: 'none', stroke: KC, 'stroke-width': 3, 'stroke-dasharray': '8 6' }, ov);
          await drawIn(r, 600, c);
        } },
      { cap: `<b>Subtract</b> the equations: ${T('t_1')} and the ${p - 1} shared ${T('d')}’s cancel. What is left: ${T(`${J}${cD('d')}=${tn(tq)}-${tn(tp)}=${tn(tq - tp)}`)}.`,
        run: async (c) => {
          await show(c, A3);
          await Promise.all(B.slice(0, p).map((b) => c ? c.anim(b, [{ opacity: 1 }, { opacity: 0.18 }], 500) : (b.style.opacity = 0.18)));
          const br = brace(ov, shared, BX + tq * s, YB + BH + 8, DC); await drawIn(br, 500, c);
          const l = slab(stage, (shared + BX + tq * s) / 2, YB + BH + 24, T(`${J}${cD('d')}=${tn(tq - tp)}`), 's', 'u1l3-brl'); await pop(c, l, 250);
        } },
      { cap: `So ${T(`${cD('d')}=${tn(tq - tp)}\\div${J}=${cD(tn(dv))}`)}: every amber block is ${tn(dv)}.`,
        run: async (c) => { await show(c, A4); for (const b of A.slice(1).concat(B.slice(1))) b.innerHTML = T(cD(tn(dv))); } },
      { cap: `Substitute into either equation: ${T(`${cT('t_1')}+${p - 1}(${tn(dv)})=${tn(tp)}`)}, so ${T(`${cT('t_1')}=${cT(tn(t1))}`)}. Same answer as counting jumps.`,
        run: async (c) => { A[0].innerHTML = T(cT(tn(t1))); B[0].innerHTML = T(cT(tn(t1))); await pulse(c, A[0], 1.12); await show(c, A5); } }
    ];
  }
};

/* ====================================================================================================
 * Explainer: rows of seats (amphitheatre).
 * ==================================================================================================== */
const AM = {
  demo: { label: 'Rows 4 and 9, back row 82', p: 4, tp: 34, q: 9, tq: 54, back: 82 },
  ex3: { label: 'Example 3 check', p: 6, tp: 64, q: 16, tq: 94, back: 133 }
};
const amphi = {
  title: 'Rows of seats: d, row 1, and how many rows',
  height: 480,
  choices: Object.keys(AM).map((k) => ({ v: k, label: AM[k].label })),
  intro: (k) => `Row ${AM[k].p} has ${AM[k].tp} seats and row ${AM[k].q} has ${AM[k].tq}. The back row has ${AM[k].back}. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const g = AM[k], { p, tp, q, tq, back } = g, dv = (tq - tp) / (q - p), t1 = tp - (p - 1) * dv, N = (back - t1) / dv + 1;
    const W = ex.W, CX = 318, BY = 410, r0 = 70, rMax = 266, sp = (rMax - r0) / (N - 1), R = (n) => r0 + (n - 1) * sp;
    const svg = svgEl('svg', { class: 'u1l3-ov', width: 600, height: 480, viewBox: '0 0 600 480' }); stage.appendChild(svg); svg.style.left = '0px'; svg.style.top = '0px';
    svgEl('path', { d: `M${CX - 48} ${BY} A48 48 0 0 1 ${CX + 48} ${BY} Z`, fill: '#d9cbb0' }, svg);
    const stg = slab(stage, CX, BY - 16, 'stage', 'c', 'u1l3-stage');
    svgEl('line', { x1: CX - rMax - 14, x2: CX + rMax + 14, y1: BY, y2: BY, stroke: '#bdb6a6', 'stroke-width': 2 }, svg);
    const rows = {};
    const seats = (n) => t1 + (n - 1) * dv;
    const mkRow = (n) => {
      const r = R(n), len = Math.PI * r, per = len / seats(n);
      const a = svgEl('path', { d: `M${CX - r} ${BY} A${r} ${r} 0 0 1 ${CX + r} ${BY}`, fill: 'none', stroke: '#9aa0ab', 'stroke-width': Math.min(6, sp * 0.62),
        'stroke-dasharray': `${(per * 0.55).toFixed(2)} ${(per * 0.45).toFixed(2)}`, class: 'u1l3-row' }, svg);
      rows[n] = a; return a;
    };
    for (let n = 1; n <= q; n++) mkRow(n);
    const later = []; for (let n = q + 1; n <= N; n++) later.push(hide(mkRow(n)));
    const tag = (n, txt, color, low) => { const l = slab(stage, CX - R(n), BY + (low ? 34 : 8), txt, 's', 'u1l3-rowtag'); l.style.color = color; return hide(l); };
    const cnt = (n, txt, color, low) => { const l = slab(stage, CX + R(n), BY + (low ? 34 : 8), txt, 's', 'u1l3-rowtag'); l.style.color = color; return hide(l); };
    const tp1 = tag(p, `row ${p}`, KC), tq1 = tag(q, `row ${q}`, KC), cp = cnt(p, `${tp}`, KC), cq = cnt(q, `${tq}`, KC);
    const t11 = tag(1, 'row 1', TC, true), c11 = cnt(1, `${t1}`, TC, true), tN = tag(N, `row ${N}`, DC, true), cN = cnt(N, `${back}`, DC, true);
    const PX = 610, P = panel(stage, PX, 14, W - PX - 14, 452, 'Seats per row');
    const L1 = pline(P, T(`d=\\dfrac{${tq}-${tp}}{${q}-${p}}=\\dfrac{${tq - tp}}{${q - p}}=${cD(dv)}`), 'u1l3-big');
    const L2 = pline(P, T(`${tp}=${cT('t_1')}+${p - 1}(${dv})\\Rightarrow ${cT('t_1')}=${cT(t1)}`));
    const L3 = pline(P, T(`${back}=${t1}+${dv}(n-1)`));
    const L4 = pline(P, T(`${back - t1}=${dv}(n-1)\\Rightarrow n-1=${N - 1}`));
    const L5 = pline(P, T(`n=${N}`) + ' rows', 'u1l3-ans');
    const color = (n, col, w) => { rows[n].setAttribute('stroke', col); if (w) rows[n].setAttribute('stroke-width', w); };
    let st = null;
    return [
      { cap: `Row ${p} has ${T(cK(tp))} seats and row ${q} has ${T(cK(tq))} seats. Each row has the same number of <b>extra</b> seats.`,
        run: async (c) => { color(p, KC, 6); color(q, KC, 6); for (const e of [tp1, cp, tq1, cq]) await show(c, e, 220); } },
      { cap: `From row ${p} to row ${q} is ${T(`${q}-${p}=${q - p}`)} jumps, and ${T(`${tq}-${tp}=${tq - tp}`)} more seats: ${T(`d=${tq - tp}\\div${q - p}=${cD(dv)}`)} extra seats per row.`,
        run: async (c) => { for (let n = p + 1; n < q; n++) { color(n, '#d7a54a'); await sleep(c, 50); } await show(c, L1); } },
      { cap: `Back ${p - 1} jumps to row 1: ${T(`${cT('t_1')}=${tp}-${p - 1}(${dv})=${cT(t1)}`)} seats in row 1.`,
        run: async (c) => { for (let n = p - 1; n >= 1; n--) { color(n, n === 1 ? TC : '#7fb7b6', n === 1 ? 6 : null); await sleep(c, 80); } await show(c, t11); await show(c, c11); await show(c, L2); } },
      { cap: `The back row has ${T(cD(back))} seats. From ${t1} up to ${back} is ${T(`${back}-${t1}=${back - t1}`)} more seats: ${T(`${back - t1}\\div${dv}=${N - 1}`)} jumps after row 1.`,
        run: async (c) => { await show(c, L3); for (const a of later) { a.style.opacity = 1; await appear(c, a, 60); } color(N, DC, 6); await show(c, tN); await show(c, cN); await show(c, L4); } },
      { cap: `${N - 1} jumps after row 1 is row ${T(cD(N))}: there are <b>${N} rows</b>. (Not ${N - 1}: the jumps don’t count row 1 itself.)`,
        run: async (c) => { await show(c, L5); st = stamp(stage, `${N} rows`, { ok: true, x: CX + 120, y: 40, rotate: -6 }); await stampIn(c, st); } }
    ];
  }
};

/* ====================================================================================================
 * Explainer: t1 at the start or after the first period (one timeline, two numberings).
 * ==================================================================================================== */
const SA = {
  ex4: { label: 'Example 4 check', start: 2400, d: 90, K: 15, unit: 'year', units: 'years', ex4: true },
  jar: { label: 'Savings: $35, then $20 a week', start: 35, d: 20, K: 6, unit: 'week', units: 'weeks' }
};
const startOrAfter = {
  title: 'What does t₁ stand for?',
  height: 470,
  choices: Object.keys(SA).map((k) => ({ v: k, label: SA[k].label })),
  intro: 'Same money, two ways to number it. Press <b>Next</b>.',
  make(stage, k, ex) {
    const g = SA[k], { start, d, K } = g, W = ex.W, BX = 168, BW = W - BX - 14;
    const vmax = (start + K * d) * 1.18;
    const B = new Bars(stage, { x: BX, y: 6, width: BW, height: 300, n0: 0, n1: K, vmin: 0, vmax, pad: { l: 4, r: 4, t: 30, b: 34 },
      nlab: (n) => String(n) });
    const bars = []; for (let n = 0; n <= K; n++) bars.push(B.bar(n, start + n * d, { color: '#c9c3b5' }));
    const tl = add(stage, h('div', 'u1l3-rtag u1l3-rtag-0', `${g.units[0].toUpperCase() + g.units.slice(1)} from now`), 12, 278);
    const px = (n) => BX + B.px(n);
    const mkRow = (y, f, cls, label) => {
      const t = add(stage, box(h('div', 'u1l3-rtag ' + cls, label), 146, 44), 10, y);
      const cells = [];
      for (let n = 0; n <= K; n++) { const s = f(n); const e = h('div', 'u1l3-cell ' + cls, s == null ? '–' : T(s)); stage.appendChild(e); place(e, px(n), y + 22, 'c', 0); cells.push(e); }
      return { t: hide(t), cells: cells.map(hide) };
    };
    const rowA = mkRow(334, (n) => `t_{${n + 1}}`, 'u1l3-ra', `${T(cT('t_1'))} = at the start`);
    const rowB = mkRow(394, (n) => (n === 0 ? null : `t_{${n}}`), 'u1l3-rb', `${T(cT('t_1'))} = after ${g.unit} 1`);
    const vl = (n, cls = '') => hide(B.vlab(n, start + n * d, T(money(start + n * d)), cls));
    const v0 = vl(0), v1 = vl(1), vK = vl(K, 'u1l3-vlab-k');
    const mark = (cell, cls) => cell.classList.add(cls);
    const endV = start + K * d;
    return [
      { cap: g.ex4 ? `Interest each year: ${T(`2400\\times0.0375=${money(90)}`)}. The value starts at ${T(money(start))} and grows by ${T(cD(money(d)))} every year.`
        : `The jar starts with ${T(money(start))} and grows by ${T(cD(money(d)))} every ${g.unit}.`,
        run: async (c) => { await show(c, tl); for (const b of bars) await B.grow(c, b, 70); await show(c, v0); await show(c, v1); } },
      { cap: `<b>Way 1:</b> let ${T(`${cT('t_1')}=${tn(start)}`)}, the value <b>at the start</b> (${g.unit} 0). Number the bars from there.`,
        run: async (c) => { await show(c, rowA.t); for (const e of rowA.cells) await appear(c, e, 40); mark(rowA.cells[0], 'u1l3-cell-t'); bars[0].setAttribute('fill', TC); } },
      { cap: `After ${K} ${g.units} is ${K} jumps past ${T('t_1')}: position ${T(String(K + 1))}. ${T(`t_{${K + 1}}=${tn(start)}+${K}(${d})=${tn(endV)}`)}.`,
        run: async (c) => { bars[K].setAttribute('fill', DC); mark(rowA.cells[K], 'u1l3-cell-k'); await show(c, vK); await pulse(c, rowA.cells[K], 1.25); } },
      { cap: `<b>Way 2:</b> let ${T(`${cT('t_1')}=${tn(start + d)}`)}, the value <b>after the first ${g.unit}</b>. Now the bar at ${g.unit} 0 has no position.`,
        run: async (c) => { await show(c, rowB.t); for (const e of rowB.cells) await appear(c, e, 40); mark(rowB.cells[1], 'u1l3-cell-t'); } },
      { cap: `After ${K} ${g.units} is now position ${T(String(K))}: ${T(`t_{${K}}=${tn(start + d)}+${K - 1}(${d})=${tn(endV)}`)}. <b>Same money, different position.</b>`,
        run: async (c) => { mark(rowB.cells[K], 'u1l3-cell-k'); await pulse(c, rowB.cells[K], 1.25); } },
      { cap: `${T('t_1')} at the start: after ${T('k')} periods is ${T('t_{k+1}')}. ${T('t_1')} after one period: after ${T('k')} periods is ${T('t_k')}. Say which one you are using.`,
        run: async (c) => { const s = stamp(stage, T(money(endV)) + ' both ways', { ok: true, x: BX + 30, y: 24, rotate: -4, size: 'sm' }); await stampIn(c, s); } }
    ];
  }
};

/* ====================================================================================================
 * Explainer: "first passes" — inequality, the marker between two bars, round to fit the question, check both sides.
 * ==================================================================================================== */
const FP = {
  ex4d: { label: 'Example 4(d) check', m: 90, b: 2400, op: '>', lim: 4000, nlo: 12, nhi: 21, vmin: 3000, vmax: 4500, ticks: [3000, 3500, 4000, 4500],
    what: 'value after n years', ask: 'first more than', unit: 'years', broken: true },
  ex5d: { label: 'Example 5(d) check', m: 45, b: 70, op: '<=', lim: 600, nlo: 6, nhi: 14, vmin: 0, vmax: 800, ticks: [0, 200, 400, 600, 800],
    what: 'cost of an n-hour job', ask: 'at most', unit: 'hours' }
};
const firstPass = {
  title: 'When does it first pass…? Round to fit the question',
  height: 470,
  choices: Object.keys(FP).map((k) => ({ v: k, label: FP[k].label })),
  intro: 'An inequality gives a decimal. The question decides which natural number to keep. Press <b>Next</b>.',
  make(stage, k, ex) {
    const g = FP[k], { m, b, lim } = g, nStar = (lim - b) / m, up = g.op === '>', ans = up ? Math.floor(nStar + 1e-9) + 1 : Math.floor(nStar + 1e-9);
    const other = up ? ans - 1 : ans + 1, W = ex.W, BW = 560;
    const B = new Bars(stage, { x: 10, y: 10, width: BW, height: 450, n0: g.nlo, n1: g.nhi, vmin: g.vmin, vmax: g.vmax, ticks: g.ticks, broken: g.broken,
      pad: { l: 64, r: 12, t: 26, b: 40 }, nlab: (n) => T(`${n}`), tickFmt: (v) => '$' + hn(v) });
    const bars = []; for (let n = g.nlo; n <= g.nhi; n++) bars.push(B.bar(n, m * n + b, { color: '#c9c3b5' }));
    const nl = add(stage, h('div', 'u1l3-nax', T('n')), 10 + BW - 10, 430);
    const lv = B.level(lim, T(money(lim)), RED); hide(lv); hide(lv.lab); if (B.tl && B.tl[lim]) B.tl[lim].style.visibility = '';
    const P = panel(stage, BW + 26, 10, W - BW - 40, 450, 'Solve and round');
    const opT = up ? '>' : '\\le';
    const L1 = pline(P, T(`${m}n+${tn(b)}${opT}${tn(lim)}`), 'u1l3-big');
    const L2 = pline(P, T(`${m}n${opT}${tn(lim - b)}`));
    const L3 = pline(P, T(`n${opT}${tn(lim - b)}\\div${m}=${texNum(nStar, 2)}\\ldots`));
    const L4 = pline(P, up ? `first natural number above: ${T(`n=${ans}`)}` : `largest natural number allowed: ${T(`n=${ans}`)}`, 'u1l3-ans');
    const L5 = pline(P, `${T(`t_{${other}}=${money(m * other + b)}`)} ${up ? 'not yet' : 'too much'} ✗`, 'u1l3-soft');
    const L6 = pline(P, `${T(`t_{${ans}}=${money(m * ans + b)}`)} ✓`, 'u1l3-ok');
    let mk = null;
    const mx = 10 + B.P.l + (nStar - g.nlo + 0.5) * B.pitch;
    return [
      { cap: `${g.what[0].toUpperCase() + g.what.slice(1)}: ${T(`t_n=${m}n+${tn(b)}`)}. “${g.ask[0].toUpperCase() + g.ask.slice(1)} ${T(money(lim))}” gives ${T(`${m}n+${tn(b)}${opT}${tn(lim)}`)}.`,
        run: async (c) => { await growAll(c, B, bars, 120, 0); lv.style.opacity = 1; if (B.tl && B.tl[lim]) B.tl[lim].style.visibility = 'hidden'; await drawIn(lv, 500, c); await show(c, lv.lab, 250); await show(c, L1); } },
      { cap: `Solve like an equation: ${T(`${m}n${opT}${tn(lim - b)}`)}, so ${T(`n${opT}${texNum(nStar, 2)}\\ldots`)}. That is between two bars.`,
        run: async (c) => {
          await show(c, L2); await show(c, L3);
          const ln = svgEl('line', { class: 'bk-stroke', x1: mx, x2: mx, y1: 20, y2: 420, stroke: SLATE, 'stroke-width': 2.5, 'stroke-dasharray': '6 5' });
          const sv = overlay(stage, W, 470); sv.appendChild(ln); await drawIn(ln, 400, c);
          mk = slab(stage, mx, 22, T(`n=${texNum(nStar, 1)}`), 's', 'u1l3-mk'); await pop(c, mk, 220);
        } },
      { cap: up ? `${T('n')} must be a natural number. The bars left of the line are not over ${T(money(lim))} yet; the <b>first</b> one past it is ${T(`n=${ans}`)}. Round <b>up</b>.`
        : `${T('n')} must be a natural number. Bars right of the line cost more than ${T(money(lim))}; the <b>largest</b> one allowed is ${T(`n=${ans}`)}. Round <b>down</b>, even though ${texNum(nStar, 1)} would usually round to ${Math.round(nStar)}.`,
        run: async (c) => {
          bars.forEach((r, i) => { const n = g.nlo + i, ok = up ? n >= ans : n <= ans; r.setAttribute('fill', ok ? '#9fd0b5' : '#e9b9b4'); });
          bars[ans - g.nlo].setAttribute('fill', GRN); await show(c, L4); await pulse(c, B.nl[ans], 1.4);
        } },
      { cap: `Check the terms on <b>both sides</b>: ${T(`t_{${other}}=${money(m * other + b)}`)} ${up ? 'is not over yet' : 'is too much'}, ${T(`t_{${ans}}=${money(m * ans + b)}`)} works. Answer: <b>${ans} ${g.unit}</b>.`,
        run: async (c) => {
          const a = B.vlab(other, m * other + b, T(money(m * other + b)), 'u1l3-vlab-x'), bb = B.vlab(ans, m * ans + b, T(money(m * ans + b)), 'u1l3-vlab-ok');
          await pop(c, a, 200); await pop(c, bb, 200); await show(c, L5); await show(c, L6);
        } }
    ];
  }
};

/* ====================================================================================================
 * Explainer: a fixed fee plus a rate (stacked bars; the fee is a "0-hour job").
 * ==================================================================================================== */
const FR = {
  ex5: { label: 'Example 5 check', c1: 115, d: 45, ask: 8 },
  bike: { label: 'Bike rental: $22, $30, $38', c1: 22, d: 8, ask: 8 }
};
const feeRate = {
  title: 'Fee plus rate: the fee is one step before t₁',
  height: 470,
  choices: Object.keys(FR).map((k) => ({ v: k, label: FR[k].label })),
  intro: 'Three job prices. Where is the fixed fee hiding? Press <b>Next</b>.',
  make(stage, k, ex) {
    const g = FR[k], { c1, d, ask } = g, fee = c1 - d, W = ex.W, BW = 570, cost = (n) => fee + d * n;
    const vmax = cost(ask) * 1.12, st = niceStep(vmax, 5);
    const ticks = []; for (let v = 0; v <= vmax; v += st) ticks.push(v);
    const B = new Bars(stage, { x: 10, y: 10, width: BW, height: 450, n0: 0, n1: ask, vmin: 0, vmax, ticks, tickFmt: (v) => '$' + hn(v),
      pad: { l: 58, r: 10, t: 24, b: 40 }, bw: 46, nlab: (n) => `${n} h` });
    B.nl[0].classList.add('u1l3-ghostl');
    const tot = [1, 2, 3].map((n) => B.bar(n, cost(n), { color: '#c9c3b5' }));
    const vls = [1, 2, 3].map((n) => hide(B.vlab(n, cost(n), T(money(cost(n))))));
    const P = panel(stage, BW + 26, 10, W - BW - 40, 450, 'Cost of an n-hour job');
    const L1 = pline(P, T(`${cT('t_1')}=${cT(c1)},\\quad ${cD('d')}=${c1 + d}-${c1}=${cD(d)}`));
    const L2 = pline(P, `${T(cD('d'))} = the hourly rate, ${T(money(d))}/h`);
    const L3 = pline(P, T(`\\text{fee}=${cT('t_1')}-${cD('d')}=${c1}-${d}=${cB(money(fee))}`), 'u1l3-big');
    const L4 = pline(P, T(`t_n=${c1}+${d}(n-1)=${cD(d)}n+${cB(fee)}`), 'u1l3-ans');
    const L5 = pline(P, T(`t_{${ask}}=${d}(${ask})+${fee}=${money(cost(ask))}`));
    const stack = (n, layer) => { const out = [B.seg(n, 0, fee, { color: BC, op: 0.85 })]; for (let i = 0; i < n; i++) out.push(B.seg(n, fee + i * d, fee + (i + 1) * d - d * 0.04, { color: DC })); return out; };
    return [
      { cap: `A 1-hour job costs ${T(money(c1))}, 2 hours ${T(money(c1 + d))}, 3 hours ${T(money(c1 + 2 * d))}.`,
        run: async (c) => { await growAll(c, B, tot, 300, 40); for (const v of vls) await show(c, v, 200); } },
      { cap: `Each extra hour adds ${T(`${c1 + d}-${c1}=${cD(d)}`)}: ${T(`${cD('d')}=${d}`)} is the <b>hourly rate</b>.`,
        run: async (c) => {
          const ov = overlay(stage, W, 470);
          for (let n = 1; n < 3; n++) {
            const a = arc(ov, 10 + B.px(n), 10 + B.px(n + 1), 10 + B.py(cost(n)) - 30, 16, DC, { w: 2.6 }); await drawIn(a, 300, c);
            const l = slab(stage, 10 + (B.px(n) + B.px(n + 1)) / 2, 10 + B.py(cost(n)) - 50, T(cD(`+${d}`)), 'n', 'u1l3-jn'); await pop(c, l, 180);
          }
          await show(c, L1); await show(c, L2);
        } },
      { cap: `Split each bar into one ${T(cD(money(d)))} block per hour… and the same ${T(cB(money(fee)))} is always left at the bottom: the <b>fixed fee</b>.`,
        run: async (c) => {
          vls.forEach((v) => (v.style.opacity = 0));
          tot.forEach((r) => (r.style.opacity = 0.15));
          for (const n of [1, 2, 3]) { const s = stack(n); for (const r of s) await B.grow(c, r, 160); }
        } },
      { cap: `The fee is the cost of a “0-hour job”, one step <b>before</b> ${T('t_1')}: ${T(`${cT('t_1')}-${cD('d')}=${c1}-${d}=${cB(fee)}`)}.`,
        run: async (c) => {
          const gst = B.seg(0, 0, fee, { color: BC, op: 0.18, stroke: BC, sw: 2.5, dash: '6 4' }); await B.grow(c, gst, 400);
          const l = B.vlab(0, fee, T(cB(money(fee))), 'u1l3-vlab-b'); await pop(c, l, 220); await show(c, L3);
        } },
      { cap: `General term: ${T(`t_n=${c1}+${d}(n-1)=${cD(d)}n+${cB(fee)}`)}: ${T(money(d))} per hour plus the ${T(money(fee))} fee.`,
        run: (c) => show(c, L4) },
      { cap: `An ${ask}-hour job: ${T(`t_{${ask}}=${d}(${ask})+${fee}=${money(cost(ask))}`)}.`,
        run: async (c) => { const s = stack(ask); for (const r of s) await B.grow(c, r, 110); const l = B.vlab(ask, cost(ask), T(money(cost(ask))), 'u1l3-vlab-ok'); await pop(c, l, 220); await show(c, L5); } }
    ];
  }
};

/* ====================================================================================================
 * Explainer: straight-line depreciation; years are positions.
 * ==================================================================================================== */
const TK = {
  ex6: { label: 'Example 6 check', y1: 2018, ya: 2021, va: 96800, yb: 2026, vb: 63800, lim: 15000, what: 'food truck' },
  tractor: { label: 'A tractor (bought 2019)', y1: 2019, ya: 2020, va: 85000, yb: 2024, vb: 61000, lim: 40000, what: 'tractor' }
};
const truck = {
  title: 'Losing the same value every year',
  height: 480,
  choices: Object.keys(TK).map((k) => ({ v: k, label: TK[k].label })),
  intro: (k) => `The ${TK[k].what} was bought in ${TK[k].y1}, so ${TK[k].y1} is t₁. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const g = TK[k], pa = g.ya - g.y1 + 1, pb = g.yb - g.y1 + 1, dv = (g.vb - g.va) / (pb - pa), t1 = g.va - (pa - 1) * dv, bb = t1 - dv;
    const nStar = (bb - g.lim) / (-dv), ans = Math.floor(nStar + 1e-9) + 1, N = ans, W = ex.W, val = (n) => t1 + (n - 1) * dv;
    const vmax = t1 * 1.12, st = niceStep(vmax, 5), ticks = []; for (let v = 0; v <= vmax; v += st) ticks.push(v);
    const B = new Bars(stage, { x: 10, y: 6, width: W - 24, height: 350, n0: 1, n1: N, vmin: 0, vmax, ticks, tickFmt: (v) => hn(v),
      pad: { l: 74, r: 8, t: 22, b: 62 }, bw: 34, nlab: (n) => String(g.y1 + n - 1) });
    Object.values(B.nl).forEach((e) => e.classList.add('u1l3-yr'));
    const nrow = []; for (let n = 1; n <= N; n++) { const e = B.hlabel(B.px(n), B.py(0) + 32, T(`t_{${n}}`), { pos: 's', cls: 'u1l3-nlab u1l3-tpos', gap: 0 }); nrow.push(hide(e)); }
    const bars = {}; for (let n = 1; n <= N; n++) bars[n] = B.bar(n, val(n), { color: n === pa || n === pb ? KC : '#c9c3b5' });
    const P = add(stage, box(h('div', 'u1l3-panel u1l3-hpanel'), W - 24, 112), 10, 362);
    const L1 = pline(P, `${T(`d=\\dfrac{${tn(g.vb)}-${tn(g.va)}}{${pb}-${pa}}=\\dfrac{${tn(g.vb - g.va)}}{${pb - pa}}=${cD(tn(dv))}`)}`);
    const L2 = pline(P, T(`${tn(g.va)}=${cT('t_1')}+${pa - 1}(${tn(dv)})\\Rightarrow ${cT('t_1')}=${cT(money(t1))}`));
    const L3 = pline(P, T(`t_n=${tn(t1)}${tn(dv)}(n-1)=${lin(dv, bb)}<${tn(g.lim)}\\Rightarrow n>${texNum(nStar, 1)}`));
    const L4 = pline(P, `${T(`n=${ans}`)}: the year ${T(`${g.y1}+${ans - 1}=${g.y1 + ans - 1}`)}`, 'u1l3-ans');
    const ys = (n) => g.y1 + n - 1;
    return [
      { cap: `${g.y1} is ${T('t_1')}, so count positions from there: ${g.ya} is ${T(`t_{${pa}}`)} and ${g.yb} is ${T(`t_{${pb}}`)} (position = year − ${g.y1 - 1}).`,
        run: async (c) => { for (const e of nrow) await appear(c, e, 50); B.nl[pa].classList.add('u1l3-yr-k'); B.nl[pb].classList.add('u1l3-yr-k'); } },
      { cap: `Known: ${T(`t_{${pa}}=${money(g.va)}`)} and ${T(`t_{${pb}}=${money(g.vb)}`)}.`,
        run: async (c) => { await B.grow(c, bars[pa], 400); await B.grow(c, bars[pb], 400); await pop(c, B.vlab(pa, g.va, T(tn(g.va)), 'u1l3-vlab-k'), 200); await pop(c, B.vlab(pb, g.vb, T(tn(g.vb)), 'u1l3-vlab-k'), 200); } },
      { cap: `${T(`${pb}-${pa}=${pb - pa}`)} jumps, change ${T(`${tn(g.vb - g.va)}`)}: ${T(`d=${tn(g.vb - g.va)}\\div${pb - pa}=${cD(tn(dv))}`)}. It loses ${T(money(-dv))} every year.`,
        run: async (c) => { for (let n = pa + 1; n < pb; n++) await B.grow(c, bars[n], 220); await show(c, L1); } },
      { cap: `Back ${pa - 1} jump${pa > 2 ? 's' : ''} to ${g.y1}: ${T(`${cT('t_1')}=${tn(g.va)}+${pa - 1}(${tn(-dv)})=${cT(money(t1))}`)}, the purchase price.`,
        run: async (c) => { for (let n = pa - 1; n >= 1; n--) { if (n === 1) bars[1].setAttribute('fill', TC); await B.grow(c, bars[n], 260); } await pop(c, B.vlab(1, t1, T(cT(tn(t1))), 'u1l3-vlab-t'), 200); await show(c, L2); } },
      { cap: `Worth less than ${T(money(g.lim))}: ${T(`${lin(dv, bb)}<${tn(g.lim)}`)} gives ${T(`n>${texNum(nStar, 1)}`)}, so the first one is ${T(`n=${ans}`)}.`,
        run: async (c) => {
          const lv = B.level(g.lim, T(money(g.lim))); await drawIn(lv, 400, c);
          for (let n = pb + 1; n <= N; n++) await B.grow(c, bars[n], 160);
          bars[ans].setAttribute('fill', GRN); await show(c, L3);
        } },
      { cap: `${T(`t_{${ans}}`)} is the year ${T(`${g.y1}+${ans - 1}=${ys(ans)}`)}: worth ${T(money(val(ans)))}. (In ${ys(ans - 1)}, ${T(`t_{${ans - 1}}=${money(val(ans - 1))}`)}, still above.)`,
        run: async (c) => { await pop(c, B.vlab(ans, val(ans), T(tn(val(ans))), 'u1l3-vlab-ok'), 200); bars[ans - 1].setAttribute('fill', '#e9b9b4'); B.nl[ans].classList.add('u1l3-yr-ok'); await show(c, L4); } }
    ];
  }
};

/* ====================================================================================================
 * Explainer: the weather balloon (reading n is at 100(n − 1) m).
 * ==================================================================================================== */
const balloon = {
  title: 'Example 7: a reading every 100 m',
  height: 490,
  intro: 'Reading 1 is at the ground. Watch which reading lands at each height. Press <b>Next</b>.',
  make(stage, _v, ex) {
    const W = ex.W, AX = 96, Y0 = 462, Y1 = 100, HMAX = 5000, yA = (a) => Y0 - a / HMAX * (Y0 - Y1);
    const temp = (a) => 21 - 0.65 * a / 100, tr = (n) => 21.65 - 0.65 * n;
    const svg = svgEl('svg', { class: 'u1l3-ov', width: 470, height: 490, viewBox: '0 0 470 490' }); stage.appendChild(svg); svg.style.left = '0px'; svg.style.top = '0px';
    // sky gradient
    const defs = svgEl('defs', {}, svg), lg = svgEl('linearGradient', { id: 'u1l3-sky', x1: 0, y1: 1, x2: 0, y2: 0 }, defs);
    svgEl('stop', { offset: '0', 'stop-color': '#eaf5fb' }, lg); svgEl('stop', { offset: '1', 'stop-color': '#c4dcf0' }, lg);
    svgEl('rect', { x: AX, y: Y1 - 10, width: 210, height: Y0 - Y1 + 10, fill: 'url(#u1l3-sky)', rx: 8 }, svg);
    svgEl('rect', { x: AX - 10, y: Y0, width: 230, height: 14, fill: '#8bb174' }, svg);
    svgEl('line', { x1: AX, x2: AX, y1: Y1 - 10, y2: Y0, stroke: INK, 'stroke-width': 2 }, svg);
    for (let a = 0; a <= HMAX; a += 100) {
      const big = a % 500 === 0, y = yA(a);
      svgEl('line', { x1: AX - (big ? 10 : 5), x2: AX, y1: y, y2: y, stroke: INK, 'stroke-width': big ? 2 : 1 }, svg);
      if (big && a % 1000 === 0) slab(stage, AX - 14, y, `${hn(a)} m`, 'w', 'u1l3-alt');
    }
    // readings (dots on the axis) appear as the balloon passes them
    const dots = {}; for (let n = 1; n <= 50; n++) { const dd = svgEl('circle', { cx: AX + 8, cy: yA(100 * (n - 1)), r: 2.6, fill: n === 1 ? TC : DC }, svg); dots[n] = hide(dd); }
    // the balloon
    const bl = svgEl('g', {}, svg);
    svgEl('path', { d: 'M0 22 L0 40', stroke: SLATE, 'stroke-width': 1.5 }, bl);
    svgEl('ellipse', { cx: 0, cy: 0, rx: 17, ry: 21, fill: '#e2574c', stroke: '#9c2d24', 'stroke-width': 1.5 }, bl);
    svgEl('rect', { x: -6, y: 40, width: 12, height: 9, fill: '#6b5536', rx: 2 }, bl);
    const BXp = AX + 70; const setB = (a) => bl.setAttribute('transform', `translate(${BXp} ${yA(a) - 50})`);
    let alt = 0; setB(0);
    const rd = h('div', 'u1l3-rd', ''); stage.appendChild(rd);
    const setRd = (a) => { rd.innerHTML = `${hn(a)} m · ${T(`${tn(Math.round(temp(a) * 100) / 100)}^{\\circ}\\text{C}`)}`; place(rd, BXp + 26, yA(a) - 56, 'e', 0); };
    // thermometer
    const TX = 380, TT = 50, TB = 430, tY = (t) => TB - (t + 15) / 40 * (TB - TT);
    svgEl('rect', { x: TX - 9, y: TT - 12, width: 18, height: TB - TT + 24, rx: 9, fill: '#fff', stroke: SLATE, 'stroke-width': 2 }, svg);
    svgEl('circle', { cx: TX, cy: TB + 22, r: 16, fill: '#d23b2f', stroke: SLATE, 'stroke-width': 2 }, svg);
    for (let t = -15; t <= 25; t += 5) { svgEl('line', { x1: TX + 9, x2: TX + 18, y1: tY(t), y2: tY(t), stroke: SLATE, 'stroke-width': 1.5 }, svg); slab(stage, TX + 22, tY(t), `${t < 0 ? '−' + (-t) : t}°`, 'e', 'u1l3-tick'); }
    const lim = svgEl('line', { x1: TX - 18, x2: TX + 18, y1: tY(-10), y2: tY(-10), stroke: RED, 'stroke-width': 3, 'stroke-dasharray': '5 4' }, svg); hide(lim);
    const merc = svgEl('rect', { x: TX - 4.5, width: 9, fill: '#d23b2f', rx: 3 }, svg);
    const setT = (t) => { merc.setAttribute('y', tY(t)); merc.setAttribute('height', TB + 10 - tY(t)); };
    const goto = async (c, a, ms) => {
      const a0 = alt; await tween(c, ms, (t) => { const v = a0 + (a - a0) * t; setB(v); setRd(v); setT(temp(v)); for (let n = 1; n <= 50; n++) if (100 * (n - 1) <= v + 1e-6) dots[n].style.opacity = 1; });
      alt = a;
    };
    setRd(0); setT(21); dots[1].style.opacity = 1;
    const P = panel(stage, 490, 10, W - 504, 470, 'Readings');
    const L1 = pline(P, T(`${cT('t_1')}=${cT('21')},\\quad ${cD('d')}=${cD('-0.65')}`));
    const L2 = pline(P, T('21,\\ 20.35,\\ 19.7,\\ \\dots'));
    const L3 = pline(P, T('t_n=21-0.65(n-1)=21.65-0.65n'), 'u1l3-big');
    const L4 = pline(P, `2500 m: 25 steps, ${T('n=26')}`);
    const L5 = pline(P, T(`t_{26}=21.65-0.65(26)=4.75^{\\circ}\\text{C}`), 'u1l3-ans');
    const L6 = pline(P, T('21.65-0.65n<-10\\Rightarrow n>48.7'));
    const L7 = pline(P, `${T('n=49')}: ${T('t_{49}=-10.2^{\\circ}\\text{C}')}`, 'u1l3-ans');
    const L8 = pline(P, `${T('48\\times100=4800')} m`, 'u1l3-ans');
    const tag = (n, txt, color) => { const e = slab(stage, AX + 14, yA(100 * (n - 1)), txt, 'e', 'u1l3-rtg'); e.style.color = color; return hide(e); };
    const g1 = tag(1, T('t_1'), TC), g26 = tag(26, T('t_{26}'), DC), g49 = tag(49, T('t_{49}'), RED);
    return [
      { cap: `Reading 1 is at the ground: ${T(`${cT('t_1')}=21`)}. Every 100 m higher it is 0.65 °C colder: ${T(`${cD('d')}=-0.65`)}.`,
        run: async (c) => { await show(c, g1); await show(c, L1); } },
      { cap: `Reading 2 is at 100 m and reading 3 at 200 m: ${T('20.35')} and ${T('19.7')}.`,
        run: async (c) => { await goto(c, 200, 900); await show(c, L2); } },
      { cap: `General term: ${T('t_n=21-0.65(n-1)=21.65-0.65n')}.`, run: (c) => show(c, L3) },
      { cap: `2500 m is <b>25 steps</b> of 100 m above reading 1, so it is reading ${T('n=26')}, not 25.`,
        run: async (c) => { await goto(c, 2500, 1800); await show(c, g26); await show(c, L4); } },
      { cap: `${T('t_{26}=21.65-0.65(26)=4.75')} °C.`, run: async (c) => { await pulse(c, rd, 1.15); await show(c, L5); } },
      { cap: `First reading below ${T('-10')} °C: ${T('21.65-0.65n<-10')} gives ${T('n>48.7')}, so ${T('n=49')}: ${T('t_{49}=-10.2')} °C. (Reading 48 is still ${T('-9.55')} °C.)`,
        run: async (c) => { lim.style.opacity = 1; await appear(c, lim, 300); await show(c, L6); await goto(c, 4800, 1700); await show(c, g49); await show(c, L7); } },
      { cap: `Reading 49 is ${T('48')} steps above reading 1: ${T('48\\times100=4800')} m above the station.`,
        run: (c) => show(c, L8) }
    ];
  }
};

/* ====================================================================================================
 * Explainer: arithmetic sequences are linear functions on the natural numbers.
 * ==================================================================================================== */
const LN = {
  ex8: { label: 'Example 8(a)(b) check', t1: 9, d: 4, N: 4, ymax: 26, ask: 25 },
  ex8c: { label: 'Example 8(c) check', t1: 28, d: -2, N: 4, ymax: 34, fx: true }
};
const linear = {
  title: 'The dots of an arithmetic sequence lie on a line',
  height: 480,
  choices: Object.keys(LN).map((k) => ({ v: k, label: LN[k].label })),
  intro: (k) => (LN[k].fx ? 'f(x) = 30 − 2x, but only for x = 1, 2, 3, … Press <b>Next</b>.' : 'The graph from Example 8: four terms as points. Press <b>Next</b>.'),
  make(stage, k, ex) {
    const g = LN[k], { t1, d, N } = g, b = t1 - d, W = ex.W, v = g.fx ? 'x' : 'n', val = (n) => t1 + (n - 1) * d;
    const G = new Graph(stage, { x: 14, y: 8, width: 470, height: 466, xmin: 0, xmax: 6.6, ymin: 0, ymax: g.ymax, ystep: 2, ylabels: 4,
      xtitle: v, ytitle: g.fx ? 'f(x)' : 't_n', arrows: false, fontSize: 16 });
    const P = panel(stage, 506, 8, W - 520, 466, g.fx ? 'A linear function' : 'Line or sequence?');
    const name = (n) => (g.fx ? `f(${n})` : `t_{${n}}`);
    const L1 = pline(P, T(Array.from({ length: N }, (_, i) => `${name(i + 1)}=${val(i + 1)}`).join(',\\ ')));
    const L2 = pline(P, T(`${cD('d')}=${val(2)}-${val(1)}=${cD(d)}=\\text{slope}`), 'u1l3-big');
    const L3 = pline(P, T(`${cB('b')}=${cT('t_1')}-${cD('d')}=${t1}-${par(d)}=${cB(b)}`));
    const L4 = pline(P, g.fx ? `${T('x=0')} is not in the domain: no point there` : `${T('n=0')}: no term there`, 'u1l3-soft');
    const L5 = g.fx ? pline(P, `${T('28,\\ 26,\\ 24,\\ 22,\\ \\dots')} arithmetic, ${T(`d=${cD(-2)}`)}`, 'u1l3-ans')
      : pline(P, T(`t_n=${cT(t1)}+${cD(d)}(n-1)=${cD(d)}n+${cB(b)}`), 'u1l3-ans');
    const L6 = g.ask ? pline(P, T(`t_{${g.ask}}=${d}(${g.ask})+${b}=${d * g.ask + b}`), 'u1l3-ans') : null;
    const pts = [];
    return [
      { cap: g.fx ? `Put ${T('x=1,\\ 2,\\ 3,\\ 4')} into ${T('f(x)=30-2x')}: ${T('28,\\ 26,\\ 24,\\ 22')}. Plot each as a point.`
        : `Plot the terms as points ${T('(n,\\ t_n)')}: ${T('(1,\\ 9),\\ (2,\\ 13),\\ (3,\\ 17),\\ (4,\\ 21)')}.`,
        run: async (c) => { for (let n = 1; n <= N; n++) { const p = G.point(n, val(n), { color: n === 1 ? TC : INK, r: 7.5, label: g.fx ? null : T(pairTex(n, val(n))), pos: 'nw', labelCls: 'u1l3-glab' }); pts.push(p); await G.reveal(p, c); } await show(c, L1); } },
      { cap: `Each step <b>right 1</b> goes ${d > 0 ? 'up' : 'down'} ${T(String(Math.abs(d)))}: the change per step is ${T(`${cD('d')}=${d}`)}, so the <b>slope is ${T(String(d))}</b>.`,
        run: async (c) => {
          for (let n = 1; n < N; n++) {
            const s1 = G.segment([n, val(n)], [n + 1, val(n)], { color: SLATE, width: 2.5 }), s2 = G.segment([n + 1, val(n)], [n + 1, val(n + 1)], { color: DC, width: 4 });
            await G.drawIn(s1, 240, c); await G.drawIn(s2, 240, c);
            const l = G.label(n + 1, (val(n) + val(n + 1)) / 2, T(cD((d > 0 ? '+' : '') + d)), { pos: 'e', cls: 'bk-ptlab', gap: 6 }); await pop(c, l, 160);
          }
          await show(c, L2);
        } },
      { cap: `The dots line up: they sit on the line ${T(`${g.fx ? 'y' : 't_n'}=${lin(d, b, v)}`)}, with slope ${T(cD(String(d)))}.`,
        run: async (c) => { const ln = G.line({ m: d, b }, { color: SLATE, width: 2, dash: '4 7', arrows: false }); await G.drawIn(ln, 700, c); } },
      { cap: `Step <b>back</b> once from ${T('t_1')} to ${T(`${v}=0`)}: ${T(`${t1}-${par(d)}=${b}`)}. That is ${T(`${cB('b')}=${cT('t_1')}-${cD('d')}=${cB(b)}`)}, where the line crosses the vertical axis.`,
        run: async (c) => { const p = G.point(0, b, { color: BC, open: true, r: 8, label: T(cB(`b=${b}`)), pos: 'e', labelCls: 'u1l3-glab', gap: 10 }); await G.reveal(p, c); await show(c, L3); } },
      { cap: `But ${T(cB('b'))} is <b>not a term</b>: there is no ${T(`${v}=0`)}, and no ${T(`${v}=2.5`)} either. The domain is ${T('1,\\ 2,\\ 3,\\ \\dots')}, so the points stay <b>separate dots</b>, never joined.`,
        run: async (c) => {
          const x = G.point(2.5, val(2.5), { color: RED, open: true, r: 7, label: T(cR(g.fx ? 'f(2.5)?\\ \\text{no}' : 't_{2.5}?\\ \\text{no}')), pos: d > 0 ? 'nw' : 'sw', labelCls: 'u1l3-glab', gap: 8 });
          await G.reveal(x, c); await show(c, L4);
        } },
      { cap: g.fx ? `The range values ${T('28,\\ 26,\\ 24,\\ 22,\\ \\dots')} form an arithmetic sequence: ${T('t_1=28')}, ${T(`d=${cD(-2)}`)}, the slope of ${T('f')}.`
        : `${T(`t_n=${cD(d)}n+${cB(b)}`)}: ${T(`m=d=${d}`)} and ${T(`b=t_1-d=${b}`)}. So ${T(`t_{${g.ask}}=${d}(${g.ask})+${b}=${d * g.ask + b}`)}.`,
        run: async (c) => { await show(c, L5); if (L6) await show(c, L6); } }
    ];
  }
};

/* ====================================================================================================
 * Example 8 figures (static).
 * ==================================================================================================== */
function ex8Graph(host, w, ans) {
  const G = new Graph(host, { width: w, height: Math.round(w * 1.05), xmin: 0, xmax: 5.5, ymin: 0, ymax: 25, ystep: 2, ylabels: 4, xtitle: 'n', ytitle: 't_n', arrows: false, fontSize: 16 });
  if (ans) { G.line({ m: 4, b: 5 }, { color: SLATE, width: 2, dash: '4 6', arrows: false }); G.point(0, 5, { color: BC, open: true, r: 6.5, label: T(cB('5')), pos: 'e', gap: 8 }); }
  [[1, 9], [2, 13], [3, 17], [4, 21]].forEach(([x, y]) => G.point(x, y, { color: INK, r: 6.5 }));
  return G;
}
function mountFigures() {
  const f = document.getElementById('u1l3-ex8fig'); if (f) ex8Graph(f, 330, false);
  const a = document.getElementById('u1l3-ex8ans'); if (a) ex8Graph(a, 250, true);
}

/* =============================== Stand Up Break! (whiteboard stations; ../standup.js) ===============================
 * Section 1 skills: two terms that are not consecutive → d and t1 (BEG), plus the general term (PRG, d may be
 * negative), then the general term and a far term or "which term is …" (MAS, d may be a half). */
const suLin = (m, b) => lin(m, b).replace(/-/g, '-');
function suPick(r, dset) {
  for (;;) {
    const d = r.pick(dset), t1 = r.int(-12, 30), p = r.int(2, 7), q = p + r.int(3, 9);
    const tp = t1 + (p - 1) * d, tq = t1 + (q - 1) * d;
    if (Math.abs(tp) <= 120 && Math.abs(tq) <= 120 && t1 !== 0) return { d, t1, p, q, tp, tq };
  }
}
const suD = (s) => `d=\\dfrac{${tn(s.tq)}-${par(s.tp)}}{${s.q}-${s.p}}=\\dfrac{${tn(s.tq - s.tp)}}{${s.q - s.p}}=${tn(s.d)}`;
const suT1 = (s) => `${tn(s.tp)}=t_1+${s.p - 1}(${tn(s.d)})\\ \\Rightarrow\\ t_1=${tn(s.t1)}`;
standup('u1l3', {
  intro: 'Two terms, the whole sequence: count the jumps, share the change, then step back to t₁.',
  levels: {
    BEG: (r) => { const s = suPick(r, [2, 3, 4, 5, 6, 7]);
      return { text: 'Determine <i>d</i> and <i>t</i><sub>1</sub>.', q: `t_{${s.p}}=${tn(s.tp)},\\quad t_{${s.q}}=${tn(s.tq)}`, a: [suD(s), suT1(s)] }; },
    PRG: (r) => { const s = suPick(r, [-6, -5, -4, -3, -2, 2, 3, 4, 5, 8]);
      return { text: 'Determine <i>d</i>, <i>t</i><sub>1</sub> and the general term.', q: `t_{${s.p}}=${tn(s.tp)},\\quad t_{${s.q}}=${tn(s.tq)}`,
        a: [suD(s), suT1(s), `t_n=${tn(s.t1)}+(n-1)(${tn(s.d)})=${suLin(s.d, s.t1 - s.d)}`] }; },
    MAS: (r) => {
      const s = suPick(r, [-3.5, -2.5, -1.5, 1.5, 2.5, 3.5, -4, 6]);
      if (r.chance(0.5)) {
        const N = r.int(30, 60);
        return { text: `Determine the general term, then <i>t</i><sub>${N}</sub>.`, q: `t_{${s.p}}=${tn(s.tp)},\\quad t_{${s.q}}=${tn(s.tq)}`,
          a: [suD(s), suT1(s), `t_n=${suLin(s.d, s.t1 - s.d)}`, `t_{${N}}=${tn(s.t1 + (N - 1) * s.d)}`] };
      }
      const n = s.q + r.int(5, 20), v = s.t1 + (n - 1) * s.d;
      return { text: `Which term of the sequence is ${hn(v)}?`, q: `t_{${s.p}}=${tn(s.tp)},\\quad t_{${s.q}}=${tn(s.tq)}`,
        a: [suD(s), suT1(s), `t_n=${suLin(s.d, s.t1 - s.d)}`, `${suLin(s.d, s.t1 - s.d)}=${tn(v)}\\ \\Rightarrow\\ n=${n}`, `\\text{It is }t_{${n}}`] };
    }
  }
});

/* =============================== mount =============================== */
mountBeach();
mountFigures();
export const explainers = mountExplainers({ gapSplit, system, amphi, startOrAfter, firstPass, feeRate, truck, balloon, linear });
export const _test = { tn, lin, GS, SY, AM, SA, FP, FR, TK, LN };
