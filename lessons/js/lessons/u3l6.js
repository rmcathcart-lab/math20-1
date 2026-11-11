/* Math 20-1 · Unit 3 · Lesson 6 — The Cosine Law.
 * Warm-up (The Snapping Crocodile: jaws of 30 cm and 40 cm hinged together; the gap between the tips at 0°, 90° and,
 * the big one, 60° — not 50 cm, because Pythagoras only works at 90°), and the explainers:
 *   cases (Example 1: mark the three known parts, then look for a known pair ∠A & a, ∠B & b, ∠C & c; SAS and SSS have none),
 *   alt (Example 2: drop the altitude, h = b sin A, AD = b cos A, DB = c − AD, then Pythagoras; plus a demo triangle),
 *   derive (the proof with letters: x = b cos A, h² + x² = b², a² = h² + (c − x)², expand, regroup, substitute),
 *   forms (which letters go where: pick the side, the angle opposite it, the two sides that form it; Example 6's y² form),
 *   pythag (STAR: "Pythagoras with a correction": sides a and b fixed with a hinge at C; as C opens from 60° through 90° to
 *     130°, side c stretches, squares on the three sides show c² against a² + b², and the −2ab cos C bar changes sign at
 *     90°; a slider for any angle; Example 4(c) check: 3, 5, 120° gives 49),
 *   side (SAS, Example 4(a), (b), (c) checks, and "The order trap": multiply first gives 8.7, subtract first gives an
 *     impossible 3.4),
 *   angle (solving the law for cos A; Example 5(a) and 5(b) checks: the subtracted side, the sign of the cosine),
 *   dial (cos θ as the x-coordinate on a half circle: one angle for each cosine; sine has two; Example 5 values),
 *   solve (Example 6: cosine law, then the sine law for the smaller angle, then the angle sum, checked; and why the
 *     smaller angle: the sine law gives 58° for an angle that is really 122°),
 *   boats (Example 7: bearings N25°E and S60°E, the angle between them, the cosine law; a demo N40°E / S10°W),
 *   para (Example 8: both diagonals of a parallelogram from 62° and 118°; a rectangle check at 90°).
 * Colours (kept through the unit's sine/cosine law lessons): the angle in the law and the side opposite it rose (the course
 * accent), the two sides that form the angle blue, the correction term −2ab cos C and the altitude h amber, acute green,
 * obtuse purple, impossible red. */
import {
  h, tex, add, box, stamp, stampIn, mountExplainers, pop, fadeIn, appear, tween, svgEl, pulse, place, drawIn, arrowHead,
  angleArc, rightMark, liveCtx, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const AC = COLORS.teal, BC = COLORS.blue, HC = COLORS.amber, G1 = COLORS.green, G2 = COLORS.purple, RED = COLORS.red, INK = COLORS.ink, GRAY = COLORS.gray;
const kc = (c) => (s) => `\\textcolor{${c}}{${s}}`;
const cA = kc(AC), cB = kc(BC), cH = kc(HC), c1 = kc(G1), c2 = kc(G2), cR = kc(RED);
const RAD = Math.PI / 180, sinD = (d) => Math.sin(d * RAD), cosD = (d) => Math.cos(d * RAD);
const acosD = (v) => Math.acos(Math.max(-1, Math.min(1, v))) / RAD, asinD = (v) => Math.asin(Math.max(-1, Math.min(1, v))) / RAD;
/** v rounded to d decimals, trailing zeros kept ("8.0") */
const fx = (v, d = 1) => { const k = Math.pow(10, d); return (Math.round((v + Math.sign(v) * 1e-9) * k) / k).toFixed(d); };
/** v rounded to d decimals, trailing zeros dropped */
const fz = (v, d = 2) => String(parseFloat(fx(v, d)));
const law = (b, c, A) => Math.sqrt(b * b + c * c - 2 * b * c * cosD(A));
const angSSS = (opp, s1, s2) => acosD((s1 * s1 + s2 * s2 - opp * opp) / (2 * s1 * s2));
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const vis = (el, on) => { if (el) el.style.display = on ? '' : 'none'; return el; };
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
const panel = (stage, x, y, w, hh, title, cls = '') => div(stage, 'u3l6-panel ' + cls, title ? `<div class="u3l6-ph">${title}</div>` : '', x, y, w, hh);
const lineIn = (p, html, cls = '') => { const d = h('div', 'u3l6-line ' + cls, html); p.appendChild(d); hide(d); return d; };
const lab = (host, html, px, py, pos = 'c', cls = '', gap = 5) => { const d = h('div', 'u3l6-lab' + (cls ? ' ' + cls : ''), html); host.appendChild(d); place(d, px, py, pos, gap); return d; };
const dPath = (pts) => 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L');
const stroke = (parent, pts, color, width = 3.5, dash) => svgEl('path', { class: 'bk-stroke', d: dPath(pts), fill: 'none', stroke: color, 'stroke-width': width, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-dasharray': dash || null }, parent);
const setLn = (el, a, b) => { el.setAttribute('x1', a[0]); el.setAttribute('y1', a[1]); el.setAttribute('x2', b[0]); el.setAttribute('y2', b[1]); };
const ptsAttr = (pts) => pts.map((q) => q[0].toFixed(1) + ',' + q[1].toFixed(1)).join(' ');
const norm2 = (x, y) => { const l = Math.hypot(x, y) || 1; return [x / l, y / l]; };
/** label position from an outward direction (screen coords) */
const posFrom = (nx, ny) => (ny < -0.38 ? 'n' : ny > 0.38 ? 's' : '') + (nx < -0.38 ? 'w' : nx > 0.38 ? 'e' : '') || 'c';
/** draw a hidden stroke in (it starts at opacity 0) */
const drawOn = async (c, el, ms = 500) => { el.style.opacity = 1; await drawIn(el, ms, c); };

/* ====================================================================================================
 * TriFig: a figure drawn to scale from points in math units (y up), fitted into a w × h box.
 * pts: { A: [x, y], … } (the first three, or o.tri, are the triangle); extra: more points to fit (feet, dims).
 * ==================================================================================================== */
class TriFig {
  constructor(host, opts) {
    const o = this.o = Object.assign({ pad: 44, font: 19, lw: 4 }, opts);
    const el = this.el = h('div', 'u3l6-fig' + (o.cls ? ' ' + o.cls : '')); box(el, o.w, o.h); el.style.fontSize = o.font + 'px';
    if (o.x != null) { el.style.position = 'absolute'; add(host, el, o.x, o.y); } else host.appendChild(el);
    this.svg = svgEl('svg', { width: o.w, height: o.h, viewBox: `0 0 ${o.w} ${o.h}`, class: 'u3l6-svg' }, el);
    this.ov = add(el, h('div', 'u3l6-ov'));
    const all = Object.values(o.pts).concat(o.extra || []);
    const xs = all.map((p) => p[0]), ys = all.map((p) => p[1]);
    const [pt, pr, pb, pl] = Array.isArray(o.pad) ? o.pad : [o.pad, o.pad, o.pad, o.pad];
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const aw = o.w - pl - pr, ah = o.h - pt - pb, s = this.s = Math.min(aw / Math.max(1e-6, x1 - x0), ah / Math.max(1e-6, y1 - y0));
    const ox = pl + (aw - (x1 - x0) * s) / 2 - x0 * s, oy = pt + (ah - (y1 - y0) * s) / 2 + y1 * s;
    this.P = (x, y) => [ox + x * s, oy - y * s];
    this.V = {}; for (const k in o.pts) this.V[k] = this.P(...o.pts[k]);
    this.gFill = svgEl('g', {}, this.svg); this.gBase = svgEl('g', {}, this.svg); this.gTop = svgEl('g', {}, this.svg);
    this.tri = o.tri || Object.keys(o.pts).slice(0, 3);
    const tv = this.tri.map((k) => this.V[k]);
    this.cen = o.cen ? this.P(...o.cen) : [(tv[0][0] + tv[1][0] + tv[2][0]) / 3, (tv[0][1] + tv[1][1] + tv[2][1]) / 3];
  }
  px(p) { return typeof p === 'string' ? this.V[p] : p; }
  seg(p, q, color = INK, width, dash, layer) { return stroke(layer || this.gBase, [this.px(p), this.px(q)], color, width || this.o.lw, dash); }
  outN(p, q) {
    const A = this.px(p), B = this.px(q), m = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
    const [ux, uy] = norm2(B[0] - A[0], B[1] - A[1]); let nx = -uy, ny = ux;
    if (nx * (m[0] - this.cen[0]) + ny * (m[1] - this.cen[1]) < 0) { nx = -nx; ny = -ny; }
    return { A, B, nx, ny };
  }
  /** a label beside side pq, outside the figure (o.in: inside), o.t = where along the side */
  sideLab(p, q, html, cls = '', o = {}) {
    const { A, B, nx, ny } = this.outN(p, q), t = o.t != null ? o.t : 0.5, sg = o.in ? -1 : 1;
    const pnt = [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t], gap = o.gap != null ? o.gap : 5;
    const d = lab(this.ov, html, pnt[0] + sg * nx * 3, pnt[1] + sg * ny * 3, posFrom(sg * nx, sg * ny), 'u3l6-sl ' + cls, gap);
    const w = d.offsetWidth, hh = d.offsetHeight;
    if (w) { const ext = (w / 2) * Math.abs(nx) + (hh / 2) * Math.abs(ny) + gap + 2; place(d, pnt[0] + sg * nx * ext, pnt[1] + sg * ny * ext, 'c'); }
    return d;
  }
  vlab(k, html, cls = '') {
    const V = this.V[k], [dx, dy] = norm2(V[0] - this.cen[0], V[1] - this.cen[1]);
    return lab(this.ov, html || T(k), V[0] + dx * 3, V[1] + dy * 3, posFrom(dx, dy), 'u3l6-vx ' + cls, 5);
  }
  others(k) { return this.tri.filter((t) => t !== k); }
  arc(k, color = AC, r = 30, pq, layer) { const [p, q] = pq || this.others(k); return angleArc(layer || this.gTop, this.V[k], this.px(p), this.px(q), r, { color, width: 3 }); }
  angLab(k, html, r = 30, cls = '', pq, extra = 0) {
    const [p, q] = pq || this.others(k), V = this.V[k], P1 = this.px(p), Q1 = this.px(q);
    const u = norm2(P1[0] - V[0], P1[1] - V[1]), v = norm2(Q1[0] - V[0], Q1[1] - V[1]);
    const ang = Math.acos(Math.max(-1, Math.min(1, u[0] * v[0] + u[1] * v[1]))) / RAD, bis = norm2(u[0] + v[0], u[1] + v[1]);
    const d = r + 22 + extra + (ang < 50 ? (50 - ang) * 0.9 : 0);
    return lab(this.ov, html, V[0] + bis[0] * d, V[1] + bis[1] * d, 'c', 'u3l6-al ' + cls);
  }
  fill(keys, color, op = 0.14) { return svgEl('polygon', { points: ptsAttr(keys.map((k) => this.px(k))), fill: color, 'fill-opacity': op, stroke: 'none' }, this.gFill); }
  rmark(V, P, Q, color = HC) { return rightMark(this.gTop, this.px(V), this.px(P), this.px(Q), 14, { color, width: 2.5 }); }
  /** a dimension line under segment pq (offset px below), with end ticks and a label */
  dim(p, q, off, html, color = INK, cls = '') {
    const A = this.px(p), B = this.px(q), g = svgEl('g', {}, this.gTop), y = Math.max(A[1], B[1]) + off;
    stroke(g, [[A[0] + 2, y], [B[0] - 2, y]], color, 2.2);
    stroke(g, [[A[0] + 2, y - 7], [A[0] + 2, y + 7]], color, 2.2); stroke(g, [[B[0] - 2, y - 7], [B[0] - 2, y + 7]], color, 2.2);
    const l = lab(this.ov, html, (A[0] + B[0]) / 2, y + 3, 's', 'u3l6-dimlab ' + cls, 3);
    return { g, l };
  }
}
/** the triangle from SAS: angle at V (origin), VP along +x, VQ at the angle */
const sasPts = (ang, lp, lq) => ({ V: [0, 0], P: [lp, 0], Q: [lq * cosD(ang), lq * sinD(ang)] });
/** C from SSS with A at the origin and B = (c, 0): b = AC, a = BC */
const sssC = (a, b, c) => { const x = (b * b + c * c - a * a) / (2 * c); return [x, Math.sqrt(Math.max(0, b * b - x * x))]; };

/* ====================================================================================================
 * Warm-up: The Snapping Crocodile. Lower jaw 30 cm (fixed), upper jaw 40 cm hinged to it; the gap between the tips.
 * ==================================================================================================== */
function mountCroc() {
  const host = document.getElementById('u3l6-croc'); if (!host) return;
  const W = 560, H = 340, S = 6.1, HX = 150, HY = 286, LL = 30 * S, LU = 40 * S;
  const svg = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u3l6-crocsvg' }, host);
  const ov = add(host, h('div', 'u3l6-ov'));
  const defs = svgEl('defs', {}, svg), cp = svgEl('clipPath', { id: 'u3l6-cclip' }, defs); svgEl('rect', { x: 0, y: 0, width: W, height: H, rx: 14 }, cp);
  const root = svgEl('g', { 'clip-path': 'url(#u3l6-cclip)' }, svg);
  svgEl('rect', { x: 0, y: 0, width: W, height: H, fill: '#d6edf3' }, root);
  for (let i = 0; i < 9; i++) { const y = 30 + i * 34, x = (i * 131) % 460 + 20; svgEl('path', { d: `M${x} ${y} q10 -6 20 0 t20 0`, fill: 'none', stroke: '#a9d3df', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, root); }
  svgEl('rect', { x: 0, y: HY + 26, width: W, height: H - HY, fill: '#9cc9d6' }, root);
  for (let x = 470; x < W; x += 16) svgEl('path', { d: `M${x} ${H} q${4 + (x % 5)} -60 ${-2 + (x % 7)} -${110 + (x % 40)}`, fill: 'none', stroke: '#5f9a4a', 'stroke-width': 4, 'stroke-linecap': 'round' }, root);
  const GRN = '#5d8f3c', DRK = '#3f6b28';
  const mouth = svgEl('polygon', { points: '0,0', fill: '#e58f8f', 'fill-opacity': 0.85 }, root);
  // lower jaw (fixed), teeth pointing up
  const lower = svgEl('g', { transform: `translate(${HX} ${HY})` }, root);
  for (let x = 26; x < LL - 6; x += 15) svgEl('polygon', { points: `${x},3 ${x + 7},3 ${x + 3.5},-6`, fill: '#fffdf4', stroke: '#c9c2a8', 'stroke-width': 1 }, lower);
  svgEl('path', { d: `M-34 26 L-30 3 L${LL} 3 Q${LL + 8} 6 ${LL + 4} 14 L${LL - 18} 22 Q${LL / 2} 30 -34 26 Z`, fill: GRN, stroke: DRK, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, lower);
  svgEl('path', { d: `M10 16 Q${LL / 2} 22 ${LL - 24} 16`, fill: 'none', stroke: '#c8d88a', 'stroke-width': 5, 'stroke-linecap': 'round' }, lower);
  // upper jaw (rotates about the hinge), teeth pointing down
  const upper = svgEl('g', {}, root);
  for (let x = 30; x < LU - 6; x += 15) svgEl('polygon', { points: `${x},-3 ${x + 7},-3 ${x + 3.5},6`, fill: '#fffdf4', stroke: '#c9c2a8', 'stroke-width': 1 }, upper);
  svgEl('path', { d: `M-30 4 L0 -3 L${LU} -3 Q${LU + 10} -6 ${LU + 6} -16 Q${LU - 4} -24 ${LU - 18} -20 L60 -30 Q20 -36 -30 -34 Z`, fill: GRN, stroke: DRK, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, upper);
  svgEl('ellipse', { cx: LU - 6, cy: -17, rx: 6, ry: 4, fill: DRK }, upper);
  for (let x = 70; x < LU - 30; x += 26) svgEl('circle', { cx: x, cy: -20, r: 3, fill: DRK, 'fill-opacity': 0.5 }, upper);
  // head and body (fixed, on top of the hinge)
  const body = svgEl('g', {}, root);
  svgEl('path', { d: `M-20 ${HY + 30} L-20 ${HY - 40} Q40 ${HY - 66} ${HX - 10} ${HY - 40} Q${HX + 34} ${HY - 22} ${HX + 26} ${HY + 4} Q${HX + 14} ${HY + 32} ${HX - 20} ${HY + 30} Z`, fill: GRN, stroke: DRK, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, body);
  for (let x = 6; x < HX - 30; x += 22) svgEl('path', { d: `M${x} ${HY - 46 - (x > 60 ? 4 : 0)} l8 -12 l8 12`, fill: DRK, stroke: DRK, 'stroke-width': 2, 'stroke-linejoin': 'round' }, body);
  svgEl('ellipse', { cx: HX - 18, cy: HY - 46, rx: 19, ry: 15, fill: GRN, stroke: DRK, 'stroke-width': 2.5 }, body);
  svgEl('circle', { cx: HX - 15, cy: HY - 49, r: 9, fill: '#fff8c6', stroke: DRK, 'stroke-width': 1.5 }, body);
  svgEl('ellipse', { cx: HX - 13, cy: HY - 49, rx: 2.6, ry: 7, fill: '#1c2230' }, body);
  svgEl('path', { d: `M${HX - 40} ${HY + 8} Q${HX - 10} ${HY + 20} ${HX + 16} ${HY + 6}`, fill: 'none', stroke: '#c8d88a', 'stroke-width': 6, 'stroke-linecap': 'round' }, body);
  // measurements
  const top = svgEl('g', {}, svg);
  const gap = svgEl('line', { stroke: AC, 'stroke-width': 4, 'stroke-dasharray': '9 7', 'stroke-linecap': 'round' }, top);
  const tipL = svgEl('circle', { r: 6, fill: AC, stroke: '#fff', 'stroke-width': 2 }, top), tipU = svgEl('circle', { r: 6, fill: AC, stroke: '#fff', 'stroke-width': 2 }, top);
  let arcEl = null;
  const lLow = lab(ov, '30 cm', HX + LL / 2, HY + 30, 's', 'u3l6-ctag u3l6-ctag-b', 2);
  const lUp = lab(ov, '40 cm', 0, 0, 'n', 'u3l6-ctag u3l6-ctag-b', 2);
  const lAng = lab(ov, '', 0, 0, 'c', 'u3l6-ctag u3l6-ctag-a');
  const lGap = lab(ov, '', 0, 0, 'ne', 'u3l6-ctag u3l6-ctag-g', 6);
  let revealed = false, cur = 0;
  const set = (th) => {
    cur = th;
    upper.setAttribute('transform', `translate(${HX} ${HY}) rotate(${-th})`);
    const LT = [HX + LL, HY], UT = [HX + LU * cosD(th), HY - LU * sinD(th)];
    mouth.setAttribute('points', ptsAttr([[HX, HY], LT, UT]));
    setLn(gap, LT, UT); tipL.setAttribute('cx', LT[0]); tipL.setAttribute('cy', LT[1]); tipU.setAttribute('cx', UT[0]); tipU.setAttribute('cy', UT[1]);
    if (arcEl) arcEl.remove(); arcEl = null;
    if (th > 3) { arcEl = angleArc(top, [HX, HY], LT, UT, 46, { color: AC, width: 3.5 }); }
    vis(lAng, th > 3); place(lAng, HX + 72 * cosD(th / 2), HY - 72 * sinD(th / 2), 'c'); lAng.textContent = Math.round(th) + '°';
    const um = [HX + (LU / 2) * cosD(th), HY - (LU / 2) * sinD(th)];
    place(lUp, um[0] - 30 * sinD(th), um[1] - 30 * cosD(th), 'c');
    const gl = Math.sqrt(900 + 1600 - 2400 * cosD(th));
    const gm = [(LT[0] + UT[0]) / 2, (LT[1] + UT[1]) / 2];
    lGap.innerHTML = 'gap ' + (revealed ? (Math.abs(gl - Math.round(gl)) < 0.05 ? Math.round(gl) : fx(gl, 1)) + ' cm' : '?');
    place(lGap, gm[0] + 6, gm[1] - (th < 8 ? 18 : 6), th < 8 ? 'n' : 'ne', 6);
  };
  set(0);
  const btns = [...document.querySelectorAll('#wu [data-open]')];
  let job = 0;
  btns.forEach((b) => b.addEventListener('click', () => {
    btns.forEach((x) => x.classList.toggle('on', x === b));
    const th1 = +b.dataset.open, th0 = cur, my = ++job;
    tween(liveCtx(), 700, (t) => { if (my !== job) return false; set(th0 + (th1 - th0) * t); });
  }));
  // the real numbers appear once the big one is revealed (they would give it away)
  const rv = document.querySelector('#u3l6-poll [data-poll-reveal]');
  if (rv) rv.addEventListener('click', () => { revealed = true; set(cur); });
}

/* ====================================================================================================
 * explainer: can the sine law start? (Example 1)
 * ==================================================================================================== */
const CS = {
  a: { label: '(a) ∠A, ∠C, c', giv: ['A', 'C', 'c'], pair: 'C', t: '\\angle A,\\ \\angle C,\\ c' },
  b: { label: '(b) b, c, ∠A', giv: ['b', 'c', 'A'], pair: null, kind: 'SAS', t: 'b,\\ c,\\ \\angle A' },
  c: { label: '(c) a, b, c', giv: ['a', 'b', 'c'], pair: null, kind: 'SSS', t: 'a,\\ b,\\ c' },
  d: { label: '(d) ∠B, b, a', giv: ['B', 'b', 'a'], pair: 'B', t: '\\angle B,\\ b,\\ a\\ (b>a)' }
};
const cases = {
  title: 'Can the sine law start?',
  height: 384, minW: 940,
  choices: [{ sep: 'Example 1:' }, ...Object.keys(CS).map((k) => ({ v: k, label: CS[k].label }))],
  ask: (v) => `Example 1${CS[v].label.slice(0, 3)}: given ${T(CS[v].t)}. Can the sine law be the first step?`,
  make(stage, v, ex) {
    const W = ex.W, d = CS[v], kn = new Set(d.giv);
    const F = new TriFig(stage, { x: 0, y: 0, w: 470, h: 380, pts: { A: [0, 0], B: [7.2, 0], C: [2.5, 3.9] }, pad: [40, 50, 46, 50] });
    const SD = { a: ['B', 'C'], b: ['A', 'C'], c: ['A', 'B'] };
    const sideEl = {}, angEl = {}, knownEls = [];
    for (const s in SD) {
      const known = kn.has(s);
      F.seg(SD[s][0], SD[s][1], GRAY, 3, '8 7');
      if (known) { sideEl[s] = hide(F.seg(SD[s][0], SD[s][1], BC, 5)); knownEls.push(sideEl[s], hide(F.sideLab(SD[s][0], SD[s][1], T(cB(s)), 'u3l6-lab-b'))); }
      else F.sideLab(SD[s][0], SD[s][1], `${T(s)}<span class="u3l6-q">?</span>`, 'u3l6-ghost');
    }
    for (const k of ['A', 'B', 'C']) {
      F.vlab(k);
      if (kn.has(k)) { angEl[k] = hide(F.arc(k, AC, 32)); knownEls.push(angEl[k], hide(F.angLab(k, T(cA(`\\angle ${k}`)), 32, 'u3l6-lab-ang'))); }
      else F.angLab(k, '<span class="u3l6-q">?</span>', 26, 'u3l6-ghost');
    }
    // halos for the pair being checked
    const halo = {};
    for (const k of ['A', 'B', 'C']) {
      const s = k.toLowerCase(), g = svgEl('g', {}, F.gFill);
      stroke(g, [F.V[SD[s][0]], F.V[SD[s][1]]], '#f2c45a', 16).setAttribute('stroke-opacity', 0.55);
      angleArc(g, F.V[k], F.V[F.others(k)[0]], F.V[F.others(k)[1]], 32, { color: '#f2c45a', width: 14 }).setAttribute('stroke-opacity', 0.55);
      hide(g); halo[k] = g;
    }
    const pn = panel(stage, 486, 8, W - 494, 366, 'Look for a known pair');
    const rows = {};
    for (const k of ['A', 'B', 'C']) {
      const s = k.toLowerCase(), aK = kn.has(k), sK = kn.has(s);
      const r = h('div', 'u3l6-prow', `<span class="u3l6-tok ${aK ? 'on-a' : 'off'}">${T('\\angle ' + k)}</span><span class="u3l6-amp">&amp;</span><span class="u3l6-tok ${sK ? 'on-b' : 'off'}">${T(s)}</span><span class="u3l6-pres">${aK && sK ? '<b class="u3l6-ok">✓ a pair</b>' : `<span class="u3l6-no">✗ ${!aK && !sK ? 'neither known' : (aK ? T(s) : T('\\angle ' + k)) + ' unknown'}</span>`}</span>`);
      pn.appendChild(r); rows[k] = r; r.querySelector('.u3l6-pres').style.opacity = 0;
    }
    const verdict = div(pn, 'u3l6-verdict ' + (d.pair ? 'ok' : 'no'), d.pair
      ? `Known pair ${T(`(\\angle ${d.pair},\\ ${d.pair.toLowerCase()})`)}: <b>yes</b>, the sine law can start.${v === 'd' ? ' <span class="u3l6-small">(<span class="tex-i">b</span> &gt; <span class="tex-i">a</span>, so there is only one triangle.)</span>' : ''}`
      : `No known pair: this is <b>${d.kind}</b>. The sine law can’t start. Use the <b>cosine law</b>.`);
    hide(verdict);
    const st = stamp(stage, d.pair ? 'Sine law ✓' : d.kind, { ok: !!d.pair, x: W - 200, y: 300 }); hide(st);
    const steps = [{ cap: `Given ${T(CS[v].t)}. Colour the three <b>known</b> parts; the unknown parts stay grey.`, run: async (c) => { await Promise.all(knownEls.map((e) => (e.tagName === 'path' ? drawOn(c, e, 400) : show(c, e)))); } }];
    let prev = null;
    for (const k of ['A', 'B', 'C']) {
      const s = k.toLowerCase(), aK = kn.has(k), sK = kn.has(s);
      const st2 = aK && sK ? `both known: <b>a pair!</b>` : !aK && !sK ? 'neither is known: no pair.' : `${aK ? 'side ' + T(s) : T('\\angle ' + k)} is unknown: no pair.`;
      steps.push({ cap: `${T('\\angle ' + k)} and the side opposite it, ${T(s)}: ${st2}`, run: async (c) => { if (prev) prev.style.opacity = 0; prev = halo[k]; await appear(c, halo[k], 250); await show(c, rows[k].querySelector('.u3l6-pres')); } });
    }
    steps.push({ cap: d.pair ? `The pair ${T(`(\\angle ${d.pair},\\ ${d.pair.toLowerCase()})`)} gets the sine law started: ${T(`\\dfrac{\\sin ${d.pair}}{${d.pair.toLowerCase()}}`)} is known.` : `<b>${d.kind}</b>: no angle comes with its opposite side, so every sine-law ratio has two unknowns. Today’s tool: the <b>cosine law</b>.`,
      run: async (c) => { if (prev) prev.style.opacity = 0; if (d.pair) await appear(c, halo[d.pair], 250); await show(c, verdict); await stampIn(c, st); } });
    return steps;
  }
};

/* ====================================================================================================
 * explainer: Example 2, right triangles only
 * ==================================================================================================== */
const AL = {
  ex2: { label: 'Example 2 check', A: 42, b: 9, c: 13, sb: '9.0', sc: '13.0' },
  demo: { label: '∠A = 65°, AC = 7.0, AB = 10.0', A: 65, b: 7, c: 10, sb: '7.0', sc: '10.0' }
};
const alt = {
  title: 'Splitting a SAS triangle into right triangles',
  height: 392, minW: 940,
  choices: [{ v: 'ex2', label: AL.ex2.label }, { v: 'demo', label: AL.demo.label }],
  ask: (v) => { const d = AL[v]; return `${T(`\\angle A=${d.A}^\\circ`)}, ${T(`AC=${d.sb}`)} cm, ${T(`AB=${d.sc}`)} cm. Find ${T('BC')} with right triangles only.`; },
  make(stage, v, ex) {
    const d = AL[v], W = ex.W, A = d.A;
    const hh = +fx(d.b * sinD(A), 3), x = +fx(d.b * cosD(A), 3), rest = +fx(d.c - x, 3), bc = Math.sqrt(hh * hh + rest * rest);
    const F = new TriFig(stage, { x: 0, y: 0, w: 520, h: 388, pts: { A: [0, 0], B: [d.c, 0], C: [d.b * cosD(A), d.b * sinD(A)], D: [d.b * cosD(A), 0] }, pad: [44, 40, 92, 40] });
    const fL = hide(F.fill(['A', 'C', 'D'], HC, 0.14)), fR = hide(F.fill(['B', 'C', 'D'], G2, 0.12));
    F.seg('A', 'C', BC, 4.5); F.seg('A', 'B', BC, 4.5);
    const bcD = F.seg('B', 'C', AC, 4, '9 7'), bcS = hide(F.seg('B', 'C', AC, 5));
    F.arc('A', AC, 34); F.angLab('A', T(cA(`${A}^\\circ`)), 34, 'u3l6-lab-ang');
    ['A', 'B', 'C'].forEach((k) => F.vlab(k));
    F.sideLab('A', 'C', T(cB(`${d.sb}\\text{ cm}`)), 'u3l6-lab-b');
    const lAB = F.sideLab('A', 'B', T(cB(`${d.sc}\\text{ cm}`)), 'u3l6-lab-b', { t: 0.8 });
    const lBCq = F.sideLab('B', 'C', `${T('BC')}<span class="u3l6-q">?</span>`, 'u3l6-lab-a');
    const lBC = hide(F.sideLab('B', 'C', T(cA(`\\approx${fx(bc, 1)}\\text{ cm}`)), 'u3l6-lab-a'));
    const alt = hide(F.seg('C', 'D', HC, 3.5, '8 6')), rm = hide(F.rmark('D', 'B', 'C'));
    const lD = hide(lab(F.ov, T('D'), F.V.D[0], F.V.D[1] + 4, 's', 'u3l6-vx', 4));
    const lh = hide(lab(F.ov, T(cH('h')), F.V.D[0] + 6, (F.V.C[1] + F.V.D[1]) / 2, 'e', 'u3l6-lab-h', 4));
    const dA = F.dim('A', 'D', 46, T(c2(`${fx(x, 3)}`)), G2), dB = F.dim('D', 'B', 46, T(c2(`${fx(rest, 3)}`)), G2);
    [dA.g, dA.l, dB.g, dB.l].forEach(hide);
    const pn = panel(stage, 534, 8, W - 542, 374, 'Right triangles only');
    const L0 = lineIn(pn, `${T(`\\angle A=${A}^\\circ`)}, ${T(`AC=${d.sb}`)}, ${T(`AB=${d.sc}`)}: SAS, no known pair.`, 'u3l6-line-sm');
    const L1 = lineIn(pn, `${T('\\triangle ACD')}: ${T(`${cH('h')}=${d.sb}\\sin${A}^\\circ\\approx${fx(hh, 3)}`)}`);
    const L2 = lineIn(pn, T(`${c2('AD')}=${d.sb}\\cos${A}^\\circ\\approx${fx(x, 3)}`));
    const L3 = lineIn(pn, T(`${c2('DB')}=${d.sc}-${fx(x, 3)}\\approx${fx(rest, 3)}`));
    const L4 = lineIn(pn, `${T('\\triangle BCD')}: ${T(`BC=\\sqrt{${fx(hh, 3)}^2+${fx(rest, 3)}^2}`)}`);
    const L5 = lineIn(pn, `${T(cA(`BC\\approx${fx(bc, 1)}`))} <b>cm</b>`, 'u3l6-line-ans');
    return [
      { cap: `${T(`\\angle A=${A}^\\circ`)} is between ${T(`AC=${d.sb}`)} and ${T(`AB=${d.sc}`)}: SAS. Find ${T('BC')} using <b>right triangles only</b>.`, run: (c) => show(c, L0) },
      { cap: `Drop the <b>altitude</b> ${T('CD')} from ${T('C')} to ${T('AB')}. It makes two right triangles.`, run: async (c) => { await drawOn(c, alt, 500); await Promise.all([show(c, rm), show(c, lD), show(c, lh)]); } },
      { cap: `In ${T('\\triangle ACD')}, ${T(cB(d.sb))} is the hypotenuse: ${T(`h=${d.sb}\\sin${A}^\\circ\\approx${fx(hh, 3)}`)} cm.`, run: async (c) => { await appear(c, fL, 300); await show(c, L1); } },
      { cap: `And ${T(`AD=${d.sb}\\cos${A}^\\circ\\approx${fx(x, 3)}`)} cm.`, run: async (c) => { lAB.style.opacity = 0; await Promise.all([appear(c, dA.g, 300), show(c, dA.l)]); await show(c, L2); } },
      { cap: `The rest of ${T('AB')}: ${T(`DB=${d.sc}-${fx(x, 3)}\\approx${fx(rest, 3)}`)} cm.`, run: async (c) => { await Promise.all([appear(c, dB.g, 300), show(c, dB.l)]); await appear(c, fR, 300); await show(c, L3); } },
      { cap: `${T('\\triangle BCD')} has legs ${T('h')} and ${T('DB')}. Pythagoras: ${T(`BC=\\sqrt{${fx(hh, 3)}^2+${fx(rest, 3)}^2}\\approx${fx(bc, 1)}`)} cm.`, run: async (c) => { await show(c, L4); bcD.style.opacity = 0; lBCq.style.opacity = 0; await drawOn(c, bcS, 400); await show(c, lBC); await show(c, L5); } },
      { cap: `It works, but it takes four steps. Next: do the same steps <b>once, with letters</b>, and get one formula.`, run: (c) => pulse(c, pn, 1.02) }
    ];
  }
};

/* ====================================================================================================
 * explainer: the proof with letters
 * ==================================================================================================== */
const derive = {
  title: 'Where the cosine law comes from',
  height: 404, minW: 940,
  ask: `Prove that ${T('a^2=b^2+c^2-2bc\\cos A')} in any ${T('\\triangle ABC')}.`,
  make(stage, v, ex) {
    const W = ex.W;
    const F = new TriFig(stage, { x: 0, y: 0, w: 450, h: 400, pts: { A: [0, 0], B: [4, 0], C: [1.6, 2.2], D: [1.6, 0] }, pad: [40, 40, 96, 40] });
    const fL = hide(F.fill(['A', 'C', 'D'], HC, 0.16)), fR = hide(F.fill(['B', 'C', 'D'], G2, 0.13));
    F.seg('A', 'C', BC, 4.5); F.seg('A', 'B', BC, 4.5); F.seg('B', 'C', AC, 4.5);
    F.arc('A', AC, 30); F.angLab('A', T(cA('A')), 30, 'u3l6-lab-ang');
    ['A', 'B', 'C'].forEach((k) => F.vlab(k));
    F.sideLab('A', 'C', T(cB('b')), 'u3l6-lab-b'); F.sideLab('B', 'C', T(cA('a')), 'u3l6-lab-a');
    const lc = F.sideLab('A', 'B', T(cB('c')), 'u3l6-lab-b', { gap: 10 });
    const altS = hide(F.seg('C', 'D', HC, 3.5, '8 6')), rm = hide(F.rmark('D', 'B', 'C'));
    const lD = hide(lab(F.ov, T('D'), F.V.D[0], F.V.D[1] + 4, 's', 'u3l6-vx', 4));
    const lh = hide(lab(F.ov, T(cH('h')), F.V.D[0] + 6, (F.V.C[1] + F.V.D[1]) / 2, 'e', 'u3l6-lab-h', 4));
    const dA = F.dim('A', 'D', 50, T(c2('x')), G2), dB = F.dim('D', 'B', 50, T(c2('c-x')), G2);
    [dA.g, dA.l, dB.g, dB.l].forEach(hide);
    const pn = panel(stage, 462, 6, W - 470, 392, 'The proof');
    const X = c2('x'), Hh = cH('h');
    const L = [
      lineIn(pn, `${T('\\triangle ACD')}: ${T(`\\cos A=\\dfrac{${X}}{b}\\ \\Rightarrow\\ ${X}=b\\cos A`)}`),
      lineIn(pn, T(`${Hh}^2+${X}^2=b^2`), 'u3l6-line-sm'),
      lineIn(pn, `${T('\\triangle BCD')}: ${T(`a^2=${Hh}^2+(c-${X})^2`)}`),
      lineIn(pn, `Expand: ${T(`a^2=${Hh}^2+c^2-2c${X}+${X}^2`)}`),
      lineIn(pn, `Regroup: ${T(`a^2=\\boxed{${Hh}^2+${X}^2}+c^2-2c${X}`)}`),
      lineIn(pn, `Substitute: ${T(`a^2=b^2+c^2-2c(b\\cos A)`)}`),
      lineIn(pn, T(`${cA('a')}^2=${cB('b')}^2+${cB('c')}^2${cH('-2bc\\cos A')}`), 'u3l6-line-key')
    ];
    return [
      { cap: `Any ${T('\\triangle ABC')}. Drop the altitude ${T(Hh)} from ${T('C')}; its foot ${T('D')} splits ${T('c')} into ${T(X)} and ${T(`c-${X}`)}.`, run: async (c) => { await drawOn(c, altS, 450); await Promise.all([show(c, rm), show(c, lD), show(c, lh)]); lc.style.opacity = 0; await Promise.all([appear(c, dA.g, 300), show(c, dA.l), appear(c, dB.g, 300), show(c, dB.l)]); } },
      { cap: `Left right triangle ${T('ACD')}: ${T(`\\cos A=\\dfrac{\\text{adjacent}}{\\text{hypotenuse}}=\\dfrac{${X}}{b}`)}, so ${T(`${X}=b\\cos A`)}.`, run: async (c) => { await appear(c, fL, 300); await show(c, L[0]); } },
      { cap: `Pythagoras in ${T('ACD')}: ${T(`${Hh}^2+${X}^2=b^2`)}.`, run: (c) => show(c, L[1]) },
      { cap: `Right triangle ${T('BCD')} has legs ${T(Hh)} and ${T(`c-${X}`)}: ${T(`a^2=${Hh}^2+(c-${X})^2`)}.`, run: async (c) => { await appear(c, fR, 300); await show(c, L[2]); } },
      { cap: `Expand ${T(`(c-${X})^2=c^2-2c${X}+${X}^2`)}.`, run: (c) => show(c, L[3]) },
      { cap: `Regroup: ${T(`${Hh}^2`)} and ${T(`${X}^2`)} side by side. That pair is exactly ${T('b^2')}.`, run: async (c) => { await show(c, L[4]); await pulse(c, L[1], 1.06); } },
      { cap: `Substitute ${T('b^2')} for ${T(`${Hh}^2+${X}^2`)} and ${T('b\\cos A')} for ${T(X)}.`, run: (c) => show(c, L[5]) },
      { cap: `${T('a^2=b^2+c^2-2bc\\cos A')}. ${T('h')} and ${T('x')} are gone: only two sides and the angle between them (<b>SAS</b>) are left.`, run: async (c) => { await show(c, L[6]); await pulse(c, L[6], 1.05); } }
    ];
  }
};

/* ====================================================================================================
 * explainer: which letters go where
 * ==================================================================================================== */
const FM = {
  a: { label: 'a² = …', N: ['A', 'B', 'C'], pts: { A: [0, 0], B: [7.6, 0], C: [2.7, 4.1] }, k: 'A' },
  b: { label: 'b² = …', N: ['A', 'B', 'C'], pts: { A: [0, 0], B: [7.6, 0], C: [2.7, 4.1] }, k: 'B' },
  c: { label: 'c² = …', N: ['A', 'B', 'C'], pts: { A: [0, 0], B: [7.6, 0], C: [2.7, 4.1] }, k: 'C' },
  xyz: { label: 'Example 6: △XYZ, y² = …', N: ['X', 'Y', 'Z'], pts: { Y: [0, 0], X: [22, 0], Z: [15 * cosD(37), 15 * sinD(37)] }, k: 'Y' }
};
const forms = {
  title: 'Which letters go where?',
  height: 360, minW: 940,
  choices: [{ v: 'a', label: FM.a.label }, { v: 'b', label: FM.b.label }, { v: 'c', label: FM.c.label }, { sep: 'Check:' }, { v: 'xyz', label: FM.xyz.label }],
  ask: (v) => `Write the form of the cosine law that starts with ${T(FM[v].k.toLowerCase() + '^2')}.`,
  make(stage, v, ex) {
    const W = ex.W, d = FM[v], k = d.k, s = k.toLowerCase();
    const F = new TriFig(stage, { x: 0, y: 0, w: 450, h: 356, pts: d.pts, tri: Object.keys(d.pts), pad: [44, 44, 44, 44] });
    const [p, q] = F.others(k).sort();    // the other two vertices, alphabetical
    const ps = p.toLowerCase(), qs = q.toLowerCase();
    // side opposite vertex X joins the other two
    const sideOf = (X) => F.others(X);
    const base = {};
    for (const X of F.tri) { const [u, w] = sideOf(X); base[X] = F.seg(u, w, INK, 3.5); F.sideLab(u, w, T(X.toLowerCase()), 'u3l6-lab-k'); F.vlab(X); }
    const hiS = hide(F.seg(...sideOf(k), AC, 6)), hiP = hide(F.seg(...sideOf(p), BC, 6)), hiQ = hide(F.seg(...sideOf(q), BC, 6));
    const arcK = hide(F.arc(k, AC, 34)), labK = hide(F.angLab(k, T(cA(k)), 34, 'u3l6-lab-ang'));
    const pn = panel(stage, 464, 30, W - 472, 300, '');
    const big = div(pn, 'u3l6-fbig', '');
    const p1 = add(big, h('span', 'u3l6-fp', T(`${cA(s)}^2={}`))), p2 = add(big, h('span', 'u3l6-fp', T(`${cB(ps)}^2+${cB(qs)}^2-2${cB(ps + qs)}`))), p3 = add(big, h('span', 'u3l6-fp', T(`\\,\\cos ${cA(k)}`)));
    [p1, p2, p3].forEach(hide);
    const note = hide(div(pn, 'u3l6-fnote', `The side on the left, ${T(cA(s))}, is <b>opposite</b> the angle at the end, ${T(cA('\\angle ' + k))}. The other two sides, ${T(cB(ps))} and ${T(cB(qs))}, <b>form</b> that angle.`));
    return [
      { cap: `Start with the side you want, ${T(cA(s))}. It goes on the left: ${T(`${s}^2=\\dots`)}`, run: async (c) => { await drawOn(c, hiS, 400); await show(c, p1); } },
      { cap: `The angle <b>opposite</b> ${T(s)} is ${T('\\angle ' + k)}. It goes at the end: ${T(`\\dots\\cos ${k}`)}`, run: async (c) => { await drawOn(c, arcK, 300); await show(c, labK); await show(c, p3); } },
      { cap: `The other two sides, ${T(cB(ps))} and ${T(cB(qs))}, meet at ${T(k)}: they <b>form</b> the angle. They fill the middle: ${T(`${ps}^2+${qs}^2-2${ps}${qs}`)}.`, run: async (c) => { await Promise.all([drawOn(c, hiP, 400), drawOn(c, hiQ, 400)]); await show(c, p2); } },
      { cap: `${T(`${s}^2=${ps}^2+${qs}^2-2${ps}${qs}\\cos ${k}`)}. Same pattern every time, whatever the letters.`, run: (c) => show(c, note) }
    ];
  }
};

/* ====================================================================================================
 * STAR explainer: Pythagoras with a correction. C at the origin, CA = b along +x, CB = a at angle θ. Squares on all three
 * sides; bars a² + b², −2ab cos C and c² on the right; a slider for the angle.
 * ==================================================================================================== */
class Hinge {
  constructor(host, o) {
    this.o = o; const a = this.a = o.a, b = this.b = o.b, N = this.N = o.N;
    const el = this.el = h('div', 'u3l6-fig'); box(el, o.w, o.h); el.style.position = 'absolute'; add(host, el, o.x, o.y); el.style.fontSize = '18px';
    const svg = this.svg = svgEl('svg', { width: o.w, height: o.h, viewBox: `0 0 ${o.w} ${o.h}`, class: 'u3l6-svg' }, el);
    this.ov = add(el, h('div', 'u3l6-ov'));
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (let t = o.thMin; t <= o.thMax + 0.01; t += 2) for (const p of this.geo(t).all) { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }
    const pad = 22, s = this.s = Math.min((o.w - 2 * pad) / (x1 - x0), (o.h - 2 * pad) / (y1 - y0));
    const ox = pad + ((o.w - 2 * pad) - (x1 - x0) * s) / 2 - x0 * s, oy = pad + ((o.h - 2 * pad) - (y1 - y0) * s) / 2 + y1 * s;
    this.P = (p) => [ox + p[0] * s, oy - p[1] * s];
    const gSq = svgEl('g', {}, svg), gTri = svgEl('g', {}, svg); this.gTop = svgEl('g', {}, svg);
    const sq = (fill, strokeC) => svgEl('polygon', { fill, 'fill-opacity': 0.16, stroke: strokeC, 'stroke-width': 2, 'stroke-opacity': 0.7 }, gSq);
    this.sqA = sq(BC, BC); this.sqB = sq(BC, BC); this.sqC = sq(AC, AC);
    this.fillT = svgEl('polygon', { fill: '#fff', stroke: 'none' }, gTri);
    const ln = (color, w) => svgEl('line', { stroke: color, 'stroke-width': w, 'stroke-linecap': 'round' }, gTri);
    this.sA = ln(BC, 5); this.sB = ln(BC, 5); this.sC = ln(AC, 5);
    this.rm = svgEl('path', { fill: 'none', stroke: HC, 'stroke-width': 2.5 }, this.gTop);
    this.arcEl = null;
    const L = (cls, html = '') => lab(this.ov, html, 0, 0, 'c', cls);
    this.aA = L('u3l6-area u3l6-area-b', T(`${cB(N.a)}^2=${a * a}`)); this.aB = L('u3l6-area u3l6-area-b', T(`${cB(N.b)}^2=${b * b}`)); this.aC = L('u3l6-area u3l6-area-c');
    this.lAng = L('u3l6-al u3l6-lab-ang');
    this.vC = L('u3l6-vx', T(N.C)); this.vA = L('u3l6-vx', T(N.A)); this.vB = L('u3l6-vx', T(N.B));
    this.th = null;
  }
  geo(th) {
    const a = this.a, b = this.b, C = [0, 0], A = [b, 0], B = [a * cosD(th), a * sinD(th)];
    const sqB = [C, A, [b, -b], [0, -b]];
    const nA = [-sinD(th) * a, cosD(th) * a], sqA = [C, B, [B[0] + nA[0], B[1] + nA[1]], nA];
    const dx = B[0] - A[0], dy = B[1] - A[1], c = Math.hypot(dx, dy); let n = [-dy, dx];
    if (n[0] * (C[0] - A[0]) + n[1] * (C[1] - A[1]) > 0) n = [dy, -dx];
    const sqC = [A, B, [B[0] + n[0], B[1] + n[1]], [A[0] + n[0], A[1] + n[1]]];
    return { A, B, C, c, sqA, sqB, sqC, all: [...sqA, ...sqB, ...sqC] };
  }
  set(th) {
    this.th = th; const g = this.geo(th), P = this.P, N = this.N, a = this.a, b = this.b;
    const Ap = P(g.A), Bp = P(g.B), Cp = P(g.C);
    this.sqA.setAttribute('points', ptsAttr(g.sqA.map(P))); this.sqB.setAttribute('points', ptsAttr(g.sqB.map(P))); this.sqC.setAttribute('points', ptsAttr(g.sqC.map(P)));
    this.fillT.setAttribute('points', ptsAttr([Ap, Bp, Cp]));
    setLn(this.sA, Cp, Bp); setLn(this.sB, Cp, Ap); setLn(this.sC, Ap, Bp);
    if (this.arcEl) this.arcEl.remove();
    const right = Math.abs(th - 90) < 0.25;
    this.arcEl = right ? null : angleArc(this.gTop, Cp, Ap, Bp, 26, { color: AC, width: 3 });
    if (right) { const u = norm2(Ap[0] - Cp[0], Ap[1] - Cp[1]), v = norm2(Bp[0] - Cp[0], Bp[1] - Cp[1]), k = 15; this.rm.setAttribute('d', `M${Cp[0] + u[0] * k} ${Cp[1] + u[1] * k}L${Cp[0] + (u[0] + v[0]) * k} ${Cp[1] + (u[1] + v[1]) * k}L${Cp[0] + v[0] * k} ${Cp[1] + v[1] * k}`); this.rm.style.display = ''; }
    else this.rm.style.display = 'none';
    const cen = (pts) => { const q = pts.map(P); return [q.reduce((s, p) => s + p[0], 0) / 4, q.reduce((s, p) => s + p[1], 0) / 4]; };
    place(this.aA, ...cen(g.sqA), 'c'); place(this.aB, ...cen(g.sqB), 'c'); place(this.aC, ...cen(g.sqC), 'c');
    const c2v = g.c * g.c;
    this.aC.innerHTML = T(`${cA(N.c)}^2=${Math.abs(c2v - Math.round(c2v)) < 0.005 ? Math.round(c2v) : fx(c2v, 1)}`);
    // side labels inside the triangle
    const tc = [(Ap[0] + Bp[0] + Cp[0]) / 3, (Ap[1] + Bp[1] + Cp[1]) / 3];
    const bis = norm2(Math.cos(th / 2 * RAD), -Math.sin(th / 2 * RAD));
    place(this.lAng, Cp[0] + bis[0] * 46, Cp[1] + bis[1] * 46, 'c'); this.lAng.innerHTML = T(cA(`${fx(th, 0)}^\\circ`));
    const vl = (el, V) => { const [dx, dy] = norm2(V[0] - tc[0], V[1] - tc[1]); place(el, V[0] + dx * 4, V[1] + dy * 4, posFrom(dx, dy), 4); };
    vl(this.vC, Cp); vl(this.vA, Ap); vl(this.vB, Bp);
    if (this.onSet) this.onSet(th, { c2: c2v, c: g.c, corr: -2 * a * b * cosD(th), S: a * a + b * b });
  }
  go(c, th1, ms = 1200) { const th0 = this.th; return tween(c, ms, (t) => { this.set(th0 + (th1 - th0) * t); }); }
}
const PY = {
  std: { label: 'a = 3, b = 4', a: 3, b: 4, N: { C: 'C', a: 'a', b: 'b', c: 'c', A: 'A', B: 'B' } },
  ex4c: { label: 'Example 4(c) check: 3, 5, 120°', a: 3, b: 5, N: { C: 'E', a: 'd', b: 'f', c: 'e', A: 'D', B: 'F' } }
};
const pythag = {
  title: 'Pythagoras with a correction',
  height: 440, minW: 940,
  choices: [{ v: 'std', label: PY.std.label }, { sep: 'Check:' }, { v: 'ex4c', label: PY.ex4c.label }],
  ask: (v) => { const N = PY[v].N, d = PY[v]; return `Sides ${T(cB(`${N.a}=${d.a}`))} and ${T(cB(`${N.b}=${d.b}`))} are hinged at ${T(N.C)}. As ${T(`\\angle ${N.C}`)} opens, how does ${T(cA(N.c + '^2'))} compare with ${T(cB(`${N.a}^2+${N.b}^2`))}?`; },
  make(stage, v, ex) {
    const W = ex.W, d = PY[v], N = d.N, a = d.a, b = d.b, S = a * a + b * b, TH0 = 45, TH1 = 135;
    const F = new Hinge(stage, { x: 0, y: 0, w: 540, h: 440, a, b, N, thMin: TH0, thMax: TH1 });
    const pw = W - 556, pn = panel(stage, 552, 4, pw, 432, '');
    const maxV = S + 2 * a * b * cosD(TH0), TW = pw - 28 - 92 - 64, k = TW / maxV;
    pn.innerHTML = `<div class="u3l6-law1">${T(`${cA(N.c)}^2=${cB(N.a)}^2+${cB(N.b)}^2${cH(`-2${N.a}${N.b}\\cos ${N.C}`)}`)}</div>
      <div class="u3l6-read"><span class="u3l6-rC"></span><span class="u3l6-rcos"></span><span class="u3l6-rc"></span></div>
      <div class="u3l6-bars" style="--tw:${TW}px">
        <div class="u3l6-brow"><span class="u3l6-bl">${T(cB(`${N.a}^2+${N.b}^2`))}</span><div class="u3l6-btrack"><div class="u3l6-bar u3l6-ba" style="left:0;width:${a * a * k}px"></div><div class="u3l6-bar u3l6-bb" style="left:${a * a * k}px;width:${b * b * k}px"></div></div><span class="u3l6-bv">${S}</span></div>
        <div class="u3l6-brow u3l6-brk"><span class="u3l6-bl">${T(cH(`-2${N.a}${N.b}\\cos ${N.C}`))}</span><div class="u3l6-btrack"><div class="u3l6-bar u3l6-bk"></div></div><span class="u3l6-bv u3l6-bvk"></span></div>
        <div class="u3l6-brow"><span class="u3l6-bl">${T(cA(`${N.c}^2`))}</span><div class="u3l6-btrack"><div class="u3l6-bar u3l6-bc"></div></div><span class="u3l6-bv u3l6-bvc"></span></div>
        <div class="u3l6-bguide" style="left:${92 + S * k}px"></div>
      </div>
      <div class="u3l6-sign"></div>
      <div class="u3l6-slrow"><span class="u3l6-sll">${T(`\\angle ${N.C}`)}</span><div class="u3l6-slwrap"></div></div>`;
    const rC = pn.querySelector('.u3l6-rC'), rcos = pn.querySelector('.u3l6-rcos'), rc = pn.querySelector('.u3l6-rc'), bk = pn.querySelector('.u3l6-bk'), bc = pn.querySelector('.u3l6-bc');
    const bvk = pn.querySelector('.u3l6-bvk'), bvc = pn.querySelector('.u3l6-bvc'), sign = pn.querySelector('.u3l6-sign'), rowK = pn.querySelector('.u3l6-brk');
    const nice = (v2) => (Math.abs(v2 - Math.round(v2)) < 0.005 ? String(Math.round(v2)) : fx(v2, 1));
    const inp = h('input', 'u3l6-slider'); inp.type = 'range'; inp.min = TH0; inp.max = TH1; inp.step = 0.5; inp.setAttribute('aria-label', 'size of the angle');
    pn.querySelector('.u3l6-slwrap').appendChild(inp);
    F.onSet = (th, r) => {
      rC.innerHTML = T(`${cA(`\\angle ${N.C}=${fx(th, 0)}^\\circ`)}`);
      rcos.innerHTML = T(`\\cos ${N.C}\\approx${fx(cosD(th), 3)}`);
      rc.innerHTML = T(cA(Math.abs(r.c - Math.round(r.c)) < 0.0005 ? `${N.c}=${Math.round(r.c)}` : `${N.c}\\approx${fx(r.c, 2)}`));
      const corr = r.corr, x0 = Math.min(S, S + corr) * k, wd = Math.abs(corr) * k;
      bk.style.left = x0 + 'px'; bk.style.width = Math.max(0, wd) + 'px'; bk.classList.toggle('neg', corr < -0.01);
      bc.style.width = r.c2 * k + 'px';
      bvk.innerHTML = Math.abs(corr) < 0.05 ? '0' : (corr > 0 ? '+' : '−') + nice(Math.abs(corr));
      bvc.innerHTML = nice(r.c2);
      const z = Math.abs(th - 90) < 0.25;
      sign.className = 'u3l6-sign ' + (z ? 'z' : corr < 0 ? 'm' : 'p');
      sign.innerHTML = z ? `${T(`\\cos90^\\circ=0`)}: no correction. <b>Pythagoras!</b>` : corr < 0 ? `Acute: ${T(`\\cos ${N.C}>0`)}, so the correction is <b>subtracted</b>: ${T(cA(N.c + '^2'))} is <b>less</b> than ${S}.` : `Obtuse: ${T(`\\cos ${N.C}<0`)}, so the correction is <b>added</b>: ${T(cA(N.c + '^2'))} is <b>more</b> than ${S}.`;
      if (+inp.value !== th) inp.value = th;
    };
    inp.addEventListener('input', () => { let th = +inp.value; if (Math.abs(th - 90) < 1.6) th = 90; F.set(th); });
    F.set(90);
    const sq = [F.sqA, F.sqB, F.sqC];
    if (v === 'ex4c') {
      const t120 = -2 * a * b * cosD(120);
      return [
        { cap: `Example 4(c): ${T(cB('d=3'))} and ${T(cB('f=5'))} form ${T('\\angle E')}. At ${T('90^\\circ')} we would have ${T('e^2=9+25=34')}.`, run: (c) => Promise.all(sq.map((e) => pulse(c, e, 1.0, 400))) },
        { cap: `Open the hinge to ${T('\\angle E=120^\\circ')}. ${T('\\cos120^\\circ=-\\tfrac12')}, so the correction is ${T(cH(`-2(3)(5)\\left(-\\tfrac12\\right)=+${fz(t120, 2)}`))}.`, run: async (c) => { await F.go(c, 120, 1200); await pulse(c, rowK, 1.05); } },
        { cap: `${T('e^2=34+15=49')}, so ${T(cA('e=7'))} exactly: the third side, with no calculator.`, run: (c) => pulse(c, rc, 1.3) }
      ];
    }
    const k60 = -2 * a * b * cosD(60), k130 = -2 * a * b * cosD(130), c130 = S + k130;
    return [
      { cap: `Sides ${T(cB('a=3'))} and ${T(cB('b=4'))} are fixed, hinged at ${T('C')}. At ${T('\\angle C=90^\\circ')} the squares obey Pythagoras: ${T('9+16=25=c^2')}.`, run: (c) => Promise.all(sq.map((e) => pulse(c, e, 1.0, 400))) },
      { cap: `Close the hinge to ${T('60^\\circ')}. Side ${T(cA('c'))} gets shorter: ${T(cA('c^2=13'))} is <b>less</b> than ${T(cB('a^2+b^2=25'))}.`, run: (c) => F.go(c, 60, 1300) },
      { cap: `The shortfall is the <b>correction</b>: ${T(cH(`2ab\\cos C=2(3)(4)(0.5)=${fz(-k60, 2)}`))}. So ${T(`c^2=25-12=13`)}.`, run: (c) => pulse(c, rowK, 1.06) },
      { cap: `Open past ${T('90^\\circ')} to ${T('130^\\circ')}. Side ${T(cA('c'))} stretches: ${T(cA(`c^2\\approx${fx(c130, 1)}`))} is <b>more</b> than 25.`, run: (c) => F.go(c, 130, 1800) },
      { cap: `${T(`\\cos130^\\circ\\approx${fx(cosD(130), 3)}`)} is negative, so ${T(cH(`-2ab\\cos C\\approx+${fx(k130, 1)}`))} is <b>added</b>: ${T(`c^2\\approx25+${fx(k130, 1)}`)}.`, run: (c) => pulse(c, rowK, 1.06) },
      { cap: `Swing back: the amber bar shrinks to <b>zero at exactly 90°</b>, then changes sign.`, run: async (c) => { await F.go(c, 90, 1500); await pulse(c, sign, 1.05); } },
      { cap: `${T(`c^2=a^2+b^2${cH('-2ab\\cos C')}`)}: the cosine law is <b>Pythagoras with a correction</b>. Drag the slider to try any angle.`, run: (c) => pulse(c, inp, 1.1) }
    ];
  }
};

/* ====================================================================================================
 * explainer: finding a side (SAS), Example 4 checks, and the order-of-operations trap
 * ==================================================================================================== */
const SS = {
  ex4a: { label: 'Example 4(a)', V: 'A', P: 'B', Q: 'C', ang: 42, lp: 13, lq: 9, sp: '13.0', sq: '9.0', u: 'cm' },
  ex4b: { label: 'Example 4(b)', V: 'Q', P: 'P', Q: 'R', ang: 128, lp: 11.2, lq: 7.5, sp: '11.2', sq: '7.5', u: 'm' },
  ex4c: { label: 'Example 4(c), exact', V: 'E', P: 'D', Q: 'F', ang: 120, lp: 5, lq: 3, sp: '5', sq: '3', u: '', exact: true }
};
const side = {
  title: 'Finding a side (SAS)',
  height: 404, minW: 940, capH: 84,
  choices: [{ sep: 'Check:' }, { v: 'ex4a', label: SS.ex4a.label }, { v: 'ex4b', label: SS.ex4b.label }, { v: 'ex4c', label: SS.ex4c.label }, { sep: 'Watch out:' }, { v: 'trap', label: 'The order trap' }],
  ask: (v) => {
    if (v === 'trap') return `Example 4(a) two ways: ${T('a^2=9^2+13^2-2(9)(13)\\cos42^\\circ')}. Which order is right?`;
    const d = SS[v]; return `${T(`\\triangle ${[d.P, d.V, d.Q].sort().join('')}`)}: ${T(`\\angle ${d.V}=${d.ang}^\\circ`)}, ${T(`${d.P.toLowerCase()}=${d.sq}`)}, ${T(`${d.Q.toLowerCase()}=${d.sp}`)}. Determine ${T(d.V.toLowerCase())}.`;
  },
  make(stage, v, ex) {
    if (v === 'trap') return trapSteps(stage, ex);
    const W = ex.W, d = SS[v], A = d.ang, sv = d.V.toLowerCase(), sP = d.Q.toLowerCase(), sQ = d.P.toLowerCase(); // VP is named by Q, VQ by P
    const pts = sasPts(A, d.lp, d.lq), PT = { [d.V]: pts.V, [d.P]: pts.P, [d.Q]: pts.Q };
    const F = new TriFig(stage, { x: 0, y: 0, w: 470, h: 400, pts: PT, tri: [d.V, d.P, d.Q], pad: [46, 52, 52, 52] });
    F.seg(d.V, d.P, BC, 4.5); F.seg(d.V, d.Q, BC, 4.5);
    const opD = F.seg(d.P, d.Q, AC, 4, '9 7'), opS = hide(F.seg(d.P, d.Q, AC, 5));
    F.arc(d.V, AC, 30); F.angLab(d.V, T(cA(`${A}^\\circ`)), 30, 'u3l6-lab-ang');
    [d.V, d.P, d.Q].forEach((k) => F.vlab(k));
    const un = d.u ? `\\text{ ${d.u}}` : '';
    F.sideLab(d.V, d.P, T(cB(`${sP}=${d.sp}`)), 'u3l6-lab-b'); F.sideLab(d.V, d.Q, T(cB(`${sQ}=${d.sq}`)), 'u3l6-lab-b');
    const val = law(d.lq, d.lp, A), sum = d.lq * d.lq + d.lp * d.lp, prod = 2 * d.lq * d.lp, term = prod * cosD(A), sq2 = sum - term;
    const lq = F.sideLab(d.P, d.Q, `${T(cA(sv))}<span class="u3l6-q">?</span>`, 'u3l6-lab-a');
    const lAns = hide(F.sideLab(d.P, d.Q, T(cA(d.exact ? `${sv}=${fz(val, 3)}` : `${sv}\\approx${fx(val, 1)}${un}`)), 'u3l6-lab-a'));
    const pn = panel(stage, 484, 6, W - 492, 392, 'SAS: find the side opposite the angle');
    const L1 = lineIn(pn, `${T(cA(`\\angle ${d.V}=${A}^\\circ`))} is between ${T(cB(`${sQ}=${d.sq}`))} and ${T(cB(`${sP}=${d.sp}`))}.`, 'u3l6-line-sm');
    const L2 = lineIn(pn, T(`${cA(sv)}^2=${cB(sQ)}^2+${cB(sP)}^2-2${cB(sQ + sP)}\\cos ${cA(d.V)}`));
    const L3 = lineIn(pn, T(`${sv}^2=${d.sq}^2+${d.sp}^2-2(${d.sq})(${d.sp})\\cos${A}^\\circ`), 'u3l6-line-sm');
    let L4, L5, c4, c5;
    if (d.exact) {
      L4 = lineIn(pn, T(`${sv}^2=${fz(d.lq * d.lq, 2)}+${fz(d.lp * d.lp, 2)}-${fz(prod, 2)}\\left(-\\tfrac{1}{2}\\right)=${fz(sq2, 2)}`));
      L5 = lineIn(pn, T(cA(`${sv}=\\sqrt{${fz(sq2, 2)}}=${fz(val, 3)}`)), 'u3l6-line-ans');
      c4 = `No calculator: ${T('\\cos120^\\circ=-\\tfrac12')} (special triangle). ${T(`-${fz(prod, 2)}\\left(-\\tfrac12\\right)=+${fz(-term, 2)}`)} is <b>added</b>: ${T(`${sv}^2=${fz(sq2, 2)}`)}.`;
      c5 = `${T(`${sv}=\\sqrt{49}=7`)}, exactly.`;
    } else if (A > 90) {
      L4 = lineIn(pn, T(`${sv}^2\\approx${fx(sum, 2)}+${fx(-term, 2)}=${fx(sq2, 2)}`));
      L5 = lineIn(pn, `${T(cA(`${sv}\\approx${fx(val, 1)}`))} <b>${d.u}</b>`, 'u3l6-line-ans');
      c4 = `${T(`\\cos${A}^\\circ<0`)}, so ${T(`-2(${d.sq})(${d.sp})\\cos${A}^\\circ\\approx+${fx(-term, 2)}`)} is <b>added</b>: ${T(`${sv}^2\\approx${fx(sq2, 2)}`)}.`;
      c5 = `Square root: ${T(`${sv}\\approx${fx(val, 1)}`)} ${d.u}, longer than both other sides, as an obtuse angle demands.`;
    } else {
      L4 = lineIn(pn, T(`${sv}^2=${fz(sum, 2)}-${fz(prod, 2)}\\cos${A}^\\circ\\approx${fz(sum, 2)}-${fx(term, 2)}\\approx${fx(sq2, 2)}`), 'u3l6-line-sm');
      L5 = lineIn(pn, `${T(cA(`${sv}\\approx${fx(val, 1)}`))} <b>${d.u}</b>${v === 'ex4a' ? ', as in Example 2' : ''}`, 'u3l6-line-ans');
      c4 = `<b>Multiply first:</b> ${T(`2(${d.sq})(${d.sp})\\cos${A}^\\circ\\approx${fx(term, 2)}`)}, then subtract it from ${T(fz(sum, 2))}: ${T(`${sv}^2\\approx${fx(sq2, 2)}`)}.`;
      c5 = `Square root: ${T(`${sv}\\approx${fx(val, 1)}`)} ${d.u}${v === 'ex4a' ? ', the same answer as Example 2 in one line' : ''}.`;
    }
    return [
      { cap: `${T(`\\angle ${d.V}=${A}^\\circ`)} is the <b>contained</b> angle, between the two known sides. The unknown side ${T(cA(sv))} is <b>opposite</b> it.`, run: async (c) => { await show(c, L1); await pulse(c, opD, 1.0, 300); } },
      { cap: `Use the form that starts with the unknown side: ${T(`${sv}^2=${sQ}^2+${sP}^2-2${sQ}${sP}\\cos ${d.V}`)}.`, run: (c) => show(c, L2) },
      { cap: `Substitute the two sides and the angle.`, run: (c) => show(c, L3) },
      { cap: c4, run: (c) => show(c, L4) },
      { cap: c5, run: async (c) => { await show(c, L5); opD.style.opacity = 0; lq.style.opacity = 0; await drawOn(c, opS, 400); await show(c, lAns); } }
    ];
  }
};
function trapSteps(stage, ex) {
  const W = ex.W, tw = (W - 30) / 2, sum = 250, prod = 234, ok2 = sum - prod * cosD(42), bad2 = (sum - prod) * cosD(42), ok = Math.sqrt(ok2), bad = Math.sqrt(bad2);
  const pL = panel(stage, 6, 4, tw, 200, '<span class="u3l6-ok">✓</span> Multiply first', 'u3l6-p1'), pR = panel(stage, 24 + tw, 4, tw, 200, '<span class="u3l6-no">✗</span> Subtract first', 'u3l6-p2');
  const ls = [
    lineIn(pL, T('a^2=81+169-\\underbrace{234\\cos42^\\circ}_{\\text{first}}')),
    lineIn(pL, T(`a^2\\approx250-${fx(prod * cosD(42), 2)}=${fx(ok2, 2)}`)),
    lineIn(pL, T(c1(`a\\approx${fx(ok, 2)}`)), 'u3l6-line-ans')
  ];
  const rs = [
    lineIn(pR, T('a^2=(\\underbrace{81+169-234}_{\\text{first}})\\cos42^\\circ')),
    lineIn(pR, T(`a^2=16\\cos42^\\circ\\approx${fx(bad2, 2)}`)),
    lineIn(pR, T(cR(`a\\approx${fx(bad, 2)}`)), 'u3l6-line-bad')
  ];
  // the picture: AB = 13 along the base, AC = 9 at 42°; BC drawn true, and a rod of the wrong length hanging from C
  const pts = sasPts(42, 13, 9);
  const F = new TriFig(stage, { x: 0, y: 212, w: W, h: 190, pts: { A: pts.V, B: pts.P, C: pts.Q }, pad: [30, 300, 40, 300] });
  F.seg('A', 'B', BC, 4); F.seg('A', 'C', BC, 4); ['A', 'B', 'C'].forEach((k) => F.vlab(k));
  F.sideLab('A', 'B', T(cB('13')), 'u3l6-lab-b'); F.sideLab('A', 'C', T(cB('9')), 'u3l6-lab-b');
  F.arc('A', AC, 24); F.angLab('A', T(cA('42^\\circ')), 24, 'u3l6-lab-ang');
  const good = hide(F.seg('C', 'B', G1, 4.5)), gl = hide(F.sideLab('C', 'B', T(c1(fx(ok, 2))), 'u3l6-lab-g'));
  const u = norm2(F.V.B[0] - F.V.C[0], F.V.B[1] - F.V.C[1]), tip = [F.V.C[0] + u[0] * bad * F.s, F.V.C[1] + u[1] * bad * F.s];
  const rod = hide(stroke(F.gTop, [F.V.C, tip], RED, 5)), rl = hide(lab(F.ov, T(cR(`${fx(bad, 2)}`)) + ' <span class="u3l6-short">can’t reach B</span>', tip[0] + 6, tip[1], 'e', 'u3l6-lab-r', 4));
  const st = stamp(stage, 'impossible', { ok: false, x: W - 190, y: 320 }); hide(st);
  return [
    { cap: `Typed all at once, the calculator does ${T('2\\times9\\times13\\cos42^\\circ')} <b>first</b> (multiplication before subtraction), then subtracts.`, run: async (c) => { for (const e of ls) await show(c, e); } },
    { cap: `A common slip: work out ${T('81+169-234=16')} first, then multiply by ${T('\\cos42^\\circ')}.`, run: async (c) => { for (const e of rs) await show(c, e); } },
    { cap: `Which is right? Look at the triangle: ${T('B')} is 13 from ${T('A')} and ${T('C')} is only 9 from ${T('A')}, so ${T('BC')} must be <b>more than</b> ${T('13-9=4')}.`, run: async (c) => { await drawOn(c, good, 400); await show(c, gl); } },
    { cap: `${T(`a\\approx${fx(bad, 2)}`)} can’t even reach ${T('B')}: impossible. Multiply ${T('2bc\\cos A')} <b>before</b> you subtract: ${T(`a\\approx${fx(ok, 1)}`)} cm.`, run: async (c) => { await drawOn(c, rod, 400); await show(c, rl); await stampIn(c, st); } }
  ];
}

/* ====================================================================================================
 * explainer: finding an angle (SSS)
 * ==================================================================================================== */
const angle = {
  title: 'Finding an angle (SSS)',
  height: 396, minW: 940, capH: 84,
  choices: [{ v: 'solve', label: 'Solve the law for cos A' }, { sep: 'Check:' }, { v: 'ex5a', label: 'Example 5(a)' }, { v: 'ex5b', label: 'Example 5(b)' }],
  ask: (v) => (v === 'solve' ? `Rearrange ${T('a^2=b^2+c^2-2bc\\cos A')} to give ${T('\\cos A')}.` : v === 'ex5a' ? `Example 5(a): sides 13, 11 and 8. Determine ${T('\\angle A')}.` : 'Example 5(b): sides 6.5 cm, 9.2 cm and 13.8 cm. Determine the largest angle.'),
  make(stage, v, ex) {
    const W = ex.W;
    if (v === 'solve') {
      const F = new TriFig(stage, { x: 0, y: 20, w: 400, h: 340, pts: { A: [0, 0], B: [7.4, 0], C: [2.6, 4.2] }, pad: 44 });
      F.seg('A', 'B', BC, 4); F.seg('A', 'C', BC, 4); const sa = F.seg('B', 'C', AC, 4.5);
      F.arc('A', AC, 30); F.angLab('A', T(cA('A')), 30, 'u3l6-lab-ang'); ['A', 'B', 'C'].forEach((k) => F.vlab(k));
      F.sideLab('A', 'B', T(cB('c')), 'u3l6-lab-b'); F.sideLab('A', 'C', T(cB('b')), 'u3l6-lab-b'); F.sideLab('B', 'C', T(cA('a')), 'u3l6-lab-a');
      const pn = panel(stage, 414, 6, W - 422, 384, 'Solve for the cosine');
      const L = [
        lineIn(pn, T(`${cA('a')}^2=b^2+c^2-2bc\\cos ${cA('A')}`)),
        lineIn(pn, `Add ${T('2bc\\cos A')}: &nbsp;${T(`${cA('a')}^2+2bc\\cos A=b^2+c^2`)}`),
        lineIn(pn, `Subtract ${T(cA('a') + '^2')}: &nbsp;${T(`2bc\\cos A=b^2+c^2-${cA('a')}^2`)}`),
        lineIn(pn, `Divide by ${T('2bc')}: &nbsp;${T(`\\cos ${cA('A')}=\\dfrac{b^2+c^2-${cA('a')}^2}{2bc}`)}`, 'u3l6-line-key')
      ];
      return [
        { cap: `Start from the law. Goal: ${T('\\cos A')} alone on one side.`, run: (c) => show(c, L[0]) },
        { cap: `Add ${T('2bc\\cos A')} to both sides.`, run: (c) => show(c, L[1]) },
        { cap: `Subtract ${T('a^2')} from both sides.`, run: (c) => show(c, L[2]) },
        { cap: `Divide both sides by ${T('2bc')}: ${T('\\cos A=\\dfrac{b^2+c^2-a^2}{2bc}')}.`, run: (c) => show(c, L[3]) },
        { cap: `The side that is <b>subtracted</b>, ${T(cA('a'))}, is the side <b>opposite</b> the angle you want, ${T(cA('\\angle A'))}.`, run: async (c) => { await pulse(c, sa, 1.0, 300); await pulse(c, L[3], 1.05); } }
      ];
    }
    if (v === 'ex5a') {
      const Cc = sssC(8, 11, 13), cosA = (121 + 169 - 64) / 286, Aang = acosD(cosA);
      const F = new TriFig(stage, { x: 0, y: 10, w: 460, h: 370, pts: { A: [0, 0], B: [13, 0], C: Cc }, pad: [46, 46, 50, 46] });
      F.seg('A', 'B', BC, 4.5); F.seg('A', 'C', BC, 4.5); const sa = F.seg('B', 'C', INK, 4.5), saH = hide(F.seg('B', 'C', AC, 6));
      ['A', 'B', 'C'].forEach((k) => F.vlab(k));
      F.sideLab('A', 'B', T(cB('13')), 'u3l6-lab-b'); F.sideLab('A', 'C', T(cB('11')), 'u3l6-lab-b'); const l8 = F.sideLab('B', 'C', T('8'), 'u3l6-lab-k');
      const arc = F.arc('A', AC, 34), q = F.angLab('A', '<span class="u3l6-q">?</span>', 34, 'u3l6-lab-ang'), qa = hide(F.angLab('A', T(cA(`\\approx${fx(Aang, 0)}^\\circ`)), 34, 'u3l6-lab-ang', null, 10));
      const pn = panel(stage, 474, 6, W - 482, 384, 'SSS: find ∠A');
      const L = [
        lineIn(pn, T(`\\cos ${cA('A')}=\\dfrac{b^2+c^2-${cA('a')}^2}{2bc}`)),
        lineIn(pn, T(`\\cos A=\\dfrac{11^2+13^2-${cA('8')}^2}{2(11)(13)}=\\dfrac{226}{286}\\approx${fx(cosA, 4)}`)),
        lineIn(pn, `${T(`${fx(cosA, 4)}>0`)}: <b class="u3l6-g1">positive, so acute</b>`, 'u3l6-line-sm'),
        lineIn(pn, T(cA(`\\angle A=\\cos^{-1}(${fx(cosA, 4)}\\dots)\\approx${fx(Aang, 0)}^\\circ`)), 'u3l6-line-ans')
      ];
      return [
        { cap: `Three sides, no angle. Want ${T(cA('\\angle A'))}: the side <b>opposite</b> it is ${T(cA('a=8'))}, the one that will be subtracted.`, run: async (c) => { await drawOn(c, saH, 400); l8.innerHTML = T(cA('8')); await show(c, L[0]); } },
        { cap: `Substitute: ${T(`\\cos A=\\dfrac{11^2+13^2-8^2}{2(11)(13)}=\\dfrac{226}{286}\\approx${fx(cosA, 4)}`)}.`, run: (c) => show(c, L[1]) },
        { cap: `The cosine is <b>positive</b>, so ${T('\\angle A')} is <b>acute</b>.`, run: (c) => show(c, L[2]) },
        { cap: `${T(`\\angle A=\\cos^{-1}(${fx(cosA, 4)}\\dots)\\approx${fx(Aang, 0)}^\\circ`)}.`, run: async (c) => { q.style.opacity = 0; await show(c, L[3]); await show(c, qa); await pulse(c, arc, 1.0, 300); } }
      ];
    }
    // ex5b: base 13.8, apex where 6.5 and 9.2 meet
    const s1 = 6.5, s2 = 9.2, s3 = 13.8, Cc = sssC(s2, s1, s3), num = s1 * s1 + s2 * s2 - s3 * s3, den = 2 * s1 * s2, cs = num / den, th = acosD(cs);
    const F = new TriFig(stage, { x: 0, y: 30, w: 470, h: 300, pts: { P: [0, 0], Q: [s3, 0], R: Cc }, pad: [56, 40, 50, 40] });
    const sl = F.seg('P', 'Q', INK, 4.5), slH = hide(F.seg('P', 'Q', AC, 6.5)); F.seg('P', 'R', BC, 4.5); F.seg('Q', 'R', BC, 4.5);
    const l138 = F.sideLab('P', 'Q', T('13.8'), 'u3l6-lab-k'); F.sideLab('P', 'R', T(cB('6.5')), 'u3l6-lab-b'); F.sideLab('Q', 'R', T(cB('9.2')), 'u3l6-lab-b');
    const arc = hide(F.arc('R', G2, 24)), qa = hide(lab(F.ov, T(c2('\\theta')), F.V.R[0], F.V.R[1] + 34, 'c', 'u3l6-al u3l6-lab-ang')), qv = hide(lab(F.ov, T(c2(`\\theta\\approx${fx(th, 0)}^\\circ`)), F.V.R[0], F.V.R[1] - 8, 'n', 'u3l6-al u3l6-lab-ang', 6));
    const smA = hide(F.arc('Q', G1, 40)), sm = hide(lab(F.ov, '<span class="u3l6-small">smallest angle, opposite 6.5</span>', F.V.Q[0], F.V.Q[1] + 34, 'sw', 'u3l6-note', 4));
    const pn = panel(stage, 484, 6, W - 492, 384, 'SSS: the largest angle');
    const L = [
      lineIn(pn, `Longest side ${T(cA('13.8'))}, so the largest angle ${T(c2('\\theta'))} is opposite it.`, 'u3l6-line-sm'),
      lineIn(pn, T(`\\cos\\theta=\\dfrac{6.5^2+9.2^2-${cA('13.8')}^2}{2(6.5)(9.2)}`)),
      lineIn(pn, T(`\\cos\\theta=\\dfrac{${fx(num, 2)}}{${fx(den, 1)}}\\approx${fx(cs, 4)}`)),
      lineIn(pn, `${T(`${fx(cs, 4)}<0`)}: <b class="u3l6-g2">negative, so obtuse</b>`, 'u3l6-line-sm'),
      lineIn(pn, T(c2(`\\theta=\\cos^{-1}(${fx(cs, 4)}\\dots)\\approx${fx(th, 0)}^\\circ`)), 'u3l6-line-ans')
    ];
    return [
      { cap: `The <b>largest angle</b> is opposite the <b>longest side</b>, 13.8 cm. (The smallest angle is opposite the shortest side, 6.5 cm.)`, run: async (c) => { await drawOn(c, slH, 400); l138.innerHTML = T(cA('13.8')); await drawOn(c, arc, 300); await show(c, qa); await drawOn(c, smA, 300); await show(c, sm); await show(c, L[0]); } },
      { cap: `Subtract the side opposite ${T('\\theta')}: ${T('\\cos\\theta=\\dfrac{6.5^2+9.2^2-13.8^2}{2(6.5)(9.2)}')}.`, run: (c) => show(c, L[1]) },
      { cap: `${T(`\\cos\\theta=\\dfrac{${fx(num, 2)}}{${fx(den, 1)}}\\approx${fx(cs, 4)}`)}.`, run: (c) => show(c, L[2]) },
      { cap: `The cosine is <b>negative</b>, so ${T('\\theta')} is <b>obtuse</b>. That fits: the triangle is flat and wide.`, run: (c) => show(c, L[3]) },
      { cap: `${T(`\\theta=\\cos^{-1}(${fx(cs, 4)}\\dots)\\approx${fx(th, 0)}^\\circ`)}. ${T('\\cos^{-1}')} gives the obtuse angle directly: no second answer to look for.`, run: async (c) => { qa.style.opacity = 0; await show(c, L[4]); await show(c, qv); } }
    ];
  }
};

/* ====================================================================================================
 * explainer: one cosine, one angle (cos θ is the x-coordinate on a half circle of radius 1)
 * ==================================================================================================== */
const dial = {
  title: 'One cosine, one angle',
  height: 404, minW: 940,
  ask: `Can two different angles between ${T('0^\\circ')} and ${T('180^\\circ')} have the same cosine?`,
  make(stage, v, ex) {
    const W = ex.W, R = 196, O = [262, 266];
    const svg = svgEl('svg', { width: 540, height: 404, viewBox: '0 0 540 404', class: 'u3l6-svg' }, stage); svg.style.position = 'absolute'; svg.style.left = '0px'; svg.style.top = '0px';
    const ov = div(stage, 'u3l6-ov', '', 0, 0, 540, 404);
    const X = (cv) => O[0] + cv * R;
    // zones on the axis
    const zA = svgEl('rect', { x: X(0), y: O[1] - 7, width: R, height: 14, rx: 4, fill: G1, 'fill-opacity': 0.22 }, svg), zO = svgEl('rect', { x: X(-1), y: O[1] - 7, width: R, height: 14, rx: 4, fill: G2, 'fill-opacity': 0.22 }, svg);
    hide(zA); hide(zO);
    svgEl('path', { d: `M${X(-1)} ${O[1]} A${R} ${R} 0 0 1 ${X(1)} ${O[1]}`, fill: 'none', stroke: '#c9c3b4', 'stroke-width': 3 }, svg);
    svgEl('line', { x1: X(-1) - 20, y1: O[1], x2: X(1) + 22, y2: O[1], stroke: INK, 'stroke-width': 2.5 }, svg);
    arrowHead(svg, X(1) + 30, O[1], 1, 0, { color: INK, width: 2.5 });
    for (const t of [-1, -0.5, 0, 0.5, 1]) { svgEl('line', { x1: X(t), y1: O[1] - 6, x2: X(t), y2: O[1] + 6, stroke: INK, 'stroke-width': 2 }, svg); lab(ov, T(t === 0 ? '0' : String(t)), X(t), O[1] + 10, 's', 'u3l6-tk', 2); }
    lab(ov, T('x=\\cos\\theta'), X(1) + 18, O[1] + 40, 'c', 'u3l6-tk');
    const lAc = hide(lab(ov, '<b>acute</b>', X(0.5), O[1] + 58, 'c', 'u3l6-zl u3l6-g1')), lOb = hide(lab(ov, '<b>obtuse</b>', X(-0.5), O[1] + 58, 'c', 'u3l6-zl u3l6-g2')), lRt = hide(lab(ov, `${T('90^\\circ')}`, X(0), O[1] + 58, 'c', 'u3l6-zl u3l6-hc'));
    const gD = svgEl('g', {}, svg);
    const trace = svgEl('path', { fill: 'none', stroke: AC, 'stroke-width': 5, 'stroke-opacity': 0.35, 'stroke-linecap': 'round' }, gD);
    const rad = svgEl('line', { stroke: AC, 'stroke-width': 4.5, 'stroke-linecap': 'round' }, gD), drop = svgEl('line', { stroke: BC, 'stroke-width': 3, 'stroke-dasharray': '7 6' }, gD);
    const dot = svgEl('circle', { r: 8, fill: AC, stroke: '#fff', 'stroke-width': 2.5 }, gD), cdot = svgEl('circle', { r: 8, fill: BC, stroke: '#fff', 'stroke-width': 2.5 }, gD);
    let arcEl = null;
    const aLab = lab(ov, '', 0, 0, 'c', 'u3l6-al u3l6-lab-ang'), cLab = lab(ov, '', 0, 0, 'n', 'u3l6-lab-cv', 10);
    // the sine comparison (two points at the same height)
    const gS = svgEl('g', {}, svg); hide(gS);
    const yS = O[1] - 0.6 * R, s1 = asinD(0.6), xS1 = X(cosD(s1)), xS2 = X(cosD(180 - s1));
    svgEl('line', { x1: X(-1) - 14, y1: yS, x2: X(1) + 14, y2: yS, stroke: HC, 'stroke-width': 3, 'stroke-dasharray': '8 6' }, gS);
    for (const xs of [xS1, xS2]) { svgEl('line', { x1: O[0], y1: O[1], x2: xs, y2: yS, stroke: HC, 'stroke-width': 3 }, gS); svgEl('circle', { cx: xs, cy: yS, r: 7, fill: HC, stroke: '#fff', 'stroke-width': 2 }, gS); }
    const sL1 = hide(lab(ov, T(cH(`${fx(s1, 0)}^\\circ`)), xS1 + 8, yS - 4, 'ne', 'u3l6-lab-h', 4)), sL2 = hide(lab(ov, T(cH(`${fx(180 - s1, 0)}^\\circ`)), xS2 - 8, yS - 4, 'nw', 'u3l6-lab-h', 4)), sL = hide(lab(ov, T(cH('\\sin\\theta=0.6')), X(0.86), yS + 6, 'se', 'u3l6-lab-h', 2));
    // readout
    const pn = panel(stage, 552, 30, W - 560, 300, '');
    pn.innerHTML = `<div class="u3l6-dv"><span class="u3l6-dth"></span></div><div class="u3l6-dv"><span class="u3l6-dcs"></span></div><div class="u3l6-dkind"></div><div class="u3l6-dnote"></div>`;
    const dth = pn.querySelector('.u3l6-dth'), dcs = pn.querySelector('.u3l6-dcs'), dk = pn.querySelector('.u3l6-dkind'), dn = pn.querySelector('.u3l6-dnote');
    let t0 = null;
    const set = (th, tr) => {
      const P = [O[0] + R * cosD(th), O[1] - R * sinD(th)], Cx = X(cosD(th));
      setLn(rad, O, P); setLn(drop, P, [Cx, O[1]]); dot.setAttribute('cx', P[0]); dot.setAttribute('cy', P[1]); cdot.setAttribute('cx', Cx); cdot.setAttribute('cy', O[1]);
      if (arcEl) arcEl.remove(); arcEl = th > 2 ? angleArc(gD, O, [O[0] + 10, O[1]], P, 40, { color: AC, width: 3 }) : null;
      place(aLab, O[0] + 66 * cosD(th / 2), O[1] - 66 * sinD(th / 2), 'c'); aLab.innerHTML = T(cA(`${fx(th, 0)}^\\circ`));
      place(cLab, Cx, O[1] - 12, 'n', 4); cLab.innerHTML = T(cB(fx(cosD(th), 2)));
      dth.innerHTML = T(cA(`\\theta=${fx(th, 1)}^\\circ`)); dcs.innerHTML = T(cB(`\\cos\\theta\\approx${fx(cosD(th), 4)}`));
      const k = Math.abs(th - 90) < 0.3 ? 'r' : th < 90 ? 'a' : 'o';
      dk.className = 'u3l6-dkind ' + k; dk.innerHTML = k === 'r' ? `cos = 0: <b>right angle</b>` : k === 'a' ? `cos &gt; 0: <b>acute</b>` : `cos &lt; 0: <b>obtuse</b>`;
      if (tr) { if (t0 == null) t0 = th; const pts = []; for (let q = t0; q <= th + 0.01; q += 2) pts.push([O[0] + R * cosD(q), O[1] - R * sinD(q)]); trace.setAttribute('d', pts.length > 1 ? dPath(pts) : ''); }
    };
    let cur = 38;
    const go = (c, th1, ms = 1200, tr = false) => { const a0 = cur; return tween(c, ms, (t) => { cur = a0 + (th1 - a0) * t; set(cur, tr); }); };
    set(cur);
    const a5 = acosD(226 / 286), b5 = acosD((6.5 * 6.5 + 9.2 * 9.2 - 13.8 * 13.8) / (2 * 6.5 * 9.2));
    return [
      { cap: `Put the angle ${T(cA('\\theta'))} at the centre of a half circle of radius 1. The point’s ${T('x')}-coordinate is ${T(cB('\\cos\\theta'))}.`, run: (c) => pulse(c, cdot, 1.0, 300) },
      { cap: `Sweep ${T('\\theta')} from ${T('0^\\circ')} to ${T('180^\\circ')}: ${T(cB('\\cos\\theta'))} slides from ${T('1')} down to ${T('-1')} and <b>never comes back</b>.`, run: async (c) => { await go(c, 0, 500); t0 = 0; await go(c, 180, 2600, true); } },
      { cap: `Acute angles have <b>positive</b> cosines, ${T('90^\\circ')} has cosine 0, obtuse angles have <b>negative</b> cosines.`, run: async (c) => { await Promise.all([appear(c, zA, 300), appear(c, zO, 300)]); await Promise.all([show(c, lAc), show(c, lOb), show(c, lRt)]); } },
      { cap: `So each cosine belongs to <b>one</b> angle. Example 5(a): ${T(`\\cos A\\approx${fx(226 / 286, 4)}`)} gives only ${T(`${fx(a5, 0)}^\\circ`)}.`, run: async (c) => { trace.setAttribute('d', ''); await go(c, a5, 1200); dn.innerHTML = `Example 5(a): ${T(`\\angle A\\approx${fx(a5, 0)}^\\circ`)}`; } },
      { cap: `Example 5(b): ${T(`\\cos\\theta\\approx${fx(cosD(b5), 4)}`)} is negative and gives only ${T(`${fx(b5, 0)}^\\circ`)}: obtuse, straight from ${T('\\cos^{-1}')}.`, run: async (c) => { await go(c, b5, 1200); dn.innerHTML = `Example 5(b): ${T(`\\theta\\approx${fx(b5, 0)}^\\circ`)}`; } },
      { cap: `Sine is different: ${T('\\sin\\theta=0.6')} is the <b>height</b> of two points, ${T(`${fx(s1, 0)}^\\circ`)} and ${T(`${fx(180 - s1, 0)}^\\circ`)}. The sine law can miss the obtuse one; the cosine law can’t.`, run: async (c) => { await appear(c, gS, 400); await Promise.all([show(c, sL), show(c, sL1), show(c, sL2)]); dn.innerHTML = `${T('\\sin^{-1}0.6')} gives only ${T(`${fx(s1, 1)}^\\circ`)}, but ${T(`${fx(180 - s1, 1)}^\\circ`)} has the same sine.`; } }
    ];
  }
};

/* ====================================================================================================
 * explainer: solving a SAS triangle completely (Example 6) and why the smaller angle comes next
 * ==================================================================================================== */
const solve = {
  title: 'Solving a SAS triangle',
  height: 410, minW: 940, capH: 84,
  choices: [{ sep: 'Check:' }, { v: 'ex6', label: 'Example 6' }, { sep: 'Why?' }, { v: 'why', label: 'Why the smaller angle next?' }],
  ask: (v) => (v === 'ex6' ? `Solve ${T('\\triangle XYZ')}: ${T('\\angle Y=37^\\circ')}, ${T('x=15.0')} cm, ${T('z=22.0')} cm.` : `Solve ${T('\\triangle ABC')}: ${T('\\angle B=30^\\circ')}, ${T('a=10')} cm, ${T('c=18')} cm. Which angle should come after ${T('b')}?`),
  make(stage, v, ex) {
    const W = ex.W;
    if (v === 'ex6') {
      const Yv = 37, x = 15, z = 22, y = law(x, z, Yv), sX = x * sinD(Yv) / y, Xa = asinD(sX), Za = 180 - Yv - +fx(Xa, 1), cZ = (x * x + y * y - z * z) / (2 * x * y);
      const F = new TriFig(stage, { x: 0, y: 0, w: 470, h: 404, pts: { Y: [0, 0], X: [z, 0], Z: [x * cosD(Yv), x * sinD(Yv)] }, pad: [50, 46, 50, 46] });
      F.seg('Y', 'X', BC, 4.5); F.seg('Y', 'Z', BC, 4.5); const yD = F.seg('X', 'Z', AC, 4, '9 7'), yS = hide(F.seg('X', 'Z', AC, 5));
      ['X', 'Y', 'Z'].forEach((k) => F.vlab(k));
      F.arc('Y', AC, 32); F.angLab('Y', T(cA('37^\\circ')), 32, 'u3l6-lab-ang');
      F.sideLab('Y', 'X', T(cB('z=22.0')), 'u3l6-lab-b'); const lx = F.sideLab('Y', 'Z', T(cB('x=15.0')), 'u3l6-lab-b');
      const yq = F.sideLab('X', 'Z', `${T(cA('y'))}<span class="u3l6-q">?</span>`, 'u3l6-lab-a'), yl = hide(F.sideLab('X', 'Z', T(cA(`y\\approx${fx(y, 1)}`)), 'u3l6-lab-a'));
      const xHalo = hide(F.seg('Y', 'Z', G1, 12)); xHalo.setAttribute('stroke-opacity', 0.3);
      const aX = hide(F.arc('X', G1, 30)), lX = hide(F.angLab('X', T(c1(`${fx(Xa, 0)}^\\circ`)), 30, 'u3l6-lab-ang'));
      const aZ = hide(F.arc('Z', G2, 28)), lZ = hide(F.angLab('Z', T(c2(`${fx(Za, 0)}^\\circ`)), 28, 'u3l6-lab-ang'));
      const pn = panel(stage, 484, 6, W - 492, 398, 'Solve △XYZ');
      const L = [
        lineIn(pn, `<b>1</b> ${T(`y^2=15.0^2+22.0^2-2(15.0)(22.0)\\cos37^\\circ\\approx${fx(y * y, 2)}`)}`, 'u3l6-line-sm'),
        lineIn(pn, T(cA(`y\\approx${fx(y, 1)}\\text{ cm}`)) + ` <span class="u3l6-small">(store ${T(`${fx(y, 3)}\\dots`)})</span>`, 'u3l6-line-sm'),
        lineIn(pn, `<b>2</b> ${T('\\angle X')} is opposite the shorter side, 15.0: acute.`, 'u3l6-line-sm'),
        lineIn(pn, T(`\\sin X=\\dfrac{15.0\\sin37^\\circ}{${fx(y, 3)}\\dots}\\approx${fx(sX, 4)}\\ \\Rightarrow\\ ${c1(`\\angle X\\approx${fx(Xa, 0)}^\\circ`)}`), 'u3l6-line-sm'),
        lineIn(pn, `<b>3</b> ${T(c2(`\\angle Z\\approx180^\\circ-37^\\circ-${fx(Xa, 1)}^\\circ\\approx${fx(Za, 0)}^\\circ`))}`, 'u3l6-line-sm'),
        lineIn(pn, `Check: ${T(`\\cos Z=\\dfrac{15.0^2+${fx(y, 3)}^2-22.0^2}{2(15.0)(${fx(y, 3)})}\\approx${fx(cZ, 3)}`)} ✓`, 'u3l6-line-sm u3l6-line-ans')
      ];
      return [
        { cap: `${T('\\angle Y=37^\\circ')} is between ${T('x=15.0')} and ${T('z=22.0')}: <b>SAS</b>. Step 1 is the cosine law for ${T('y')}.`, run: (c) => pulse(c, yD, 1.0, 300) },
        { cap: `${T(`y^2\\approx${fx(y * y, 2)}`)}, so ${T(`y\\approx${fx(y, 1)}`)} cm. Keep ${T(`${fx(y, 3)}\\dots`)} in the calculator.`, run: async (c) => { await show(c, L[0]); await show(c, L[1]); yD.style.opacity = 0; yq.style.opacity = 0; await drawOn(c, yS, 400); await show(c, yl); } },
        { cap: `Now ${T('(\\angle Y,\\ y)')} is a known pair. Next, the <b>smaller</b> unknown angle: ${T('\\angle X')}, opposite the shorter side ${T('x=15.0')}. It must be acute, so the sine law is safe.`, run: async (c) => { await appear(c, xHalo, 300); await show(c, L[2]); } },
        { cap: `${T(`\\sin X=\\dfrac{15.0\\sin37^\\circ}{${fx(y, 3)}\\dots}\\approx${fx(sX, 4)}`)}, so ${T(`\\angle X\\approx${fx(Xa, 0)}^\\circ`)}.`, run: async (c) => { await show(c, L[3]); await drawOn(c, aX, 300); await show(c, lX); } },
        { cap: `The angles add to ${T('180^\\circ')}: ${T(`\\angle Z\\approx180^\\circ-37^\\circ-${fx(Xa, 1)}^\\circ\\approx${fx(Za, 0)}^\\circ`)}.`, run: async (c) => { await show(c, L[4]); await drawOn(c, aZ, 300); await show(c, lZ); } },
        { cap: `Check ${T('\\angle Z')} with the cosine law: ${T(`\\cos Z\\approx${fx(cZ, 3)}`)}, negative, so obtuse: ${T(`\\angle Z\\approx${fx(acosD(cZ), 0)}^\\circ`)} ✓.`, run: (c) => show(c, L[5]) }
      ];
    }
    // why: ∠B = 30°, a = 10, c = 18: the big angle C is obtuse and the sine law gives its acute partner
    const Bv = 30, a = 10, cc = 18, b = law(a, cc, Bv), sC = cc * sinD(Bv) / b, Cw = asinD(sC), sA = a * sinD(Bv) / b, Aa = asinD(sA), Cr = 180 - Bv - Aa;
    const F = new TriFig(stage, { x: 0, y: 0, w: 470, h: 404, pts: { B: [0, 0], A: [cc, 0], C: [a * cosD(Bv), a * sinD(Bv)] }, pad: [70, 40, 60, 40] });
    F.seg('B', 'A', BC, 4.5); F.seg('B', 'C', BC, 4.5); F.seg('A', 'C', AC, 4.5);
    ['A', 'B', 'C'].forEach((k) => F.vlab(k));
    F.arc('B', AC, 34); F.angLab('B', T(cA('30^\\circ')), 34, 'u3l6-lab-ang');
    F.sideLab('B', 'A', T(cB('c=18')), 'u3l6-lab-b'); F.sideLab('B', 'C', T(cB('a=10')), 'u3l6-lab-b'); F.sideLab('A', 'C', T(cA(`b\\approx${fx(b, 2)}`)), 'u3l6-lab-a');
    const aC = hide(F.arc('C', G2, 24)), lCw = hide(lab(F.ov, T(cR(`${fx(Cw, 1)}^\\circ\\ ?`)), F.V.C[0], F.V.C[1] - 10, 'n', 'u3l6-lab-r', 6));
    const lCr = hide(lab(F.ov, T(c2(`${fx(Cr, 1)}^\\circ`)), F.V.C[0], F.V.C[1] - 10, 'n', 'u3l6-al u3l6-lab-ang', 6));
    const aA = hide(F.arc('A', G1, 40)), lA = hide(F.angLab('A', T(c1(`${fx(Aa, 1)}^\\circ`)), 40, 'u3l6-lab-ang'));
    const pn = panel(stage, 484, 6, W - 492, 398, 'Which angle next?');
    const L = [
      lineIn(pn, T(`b^2=10^2+18^2-2(10)(18)\\cos30^\\circ\\approx${fx(b * b, 2)},\\ b\\approx${fx(b, 2)}`), 'u3l6-line-sm'),
      lineIn(pn, `${T(cR(`\\sin C=\\dfrac{18\\sin30^\\circ}{${fx(b, 2)}}\\approx${fx(sC, 4)}\\Rightarrow C\\approx${fx(Cw, 1)}^\\circ`))} <b class="u3l6-no">✗</b>`, 'u3l6-line-sm u3l6-line-bad'),
      lineIn(pn, `${T('\\sin^{-1}')} gives only the acute angle. The real ${T(c2(`\\angle C=180^\\circ-${fx(Cw, 1)}^\\circ=${fx(Cr, 1)}^\\circ`))}.`, 'u3l6-line-sm'),
      lineIn(pn, `Safe: ${T('\\angle A')} is opposite the <b>shortest</b> side, 10: ${T(c1(`\\sin A=\\dfrac{10\\sin30^\\circ}{${fx(b, 2)}}\\approx${fx(sA, 4)}\\Rightarrow A\\approx${fx(Aa, 1)}^\\circ`))}`, 'u3l6-line-sm'),
      lineIn(pn, T(c2(`\\angle C=180^\\circ-30^\\circ-${fx(Aa, 1)}^\\circ\\approx${fx(Cr, 1)}^\\circ`)) + ' ✓', 'u3l6-line-ans')
    ];
    const st = stamp(stage, 'wrong angle', { ok: false, x: 120, y: 60 }); hide(st);
    return [
      { cap: `SAS: ${T(`b^2=10^2+18^2-2(10)(18)\\cos30^\\circ`)}, so ${T(`b\\approx${fx(b, 2)}`)} cm. Now pick the next angle.`, run: (c) => show(c, L[0]) },
      { cap: `Try the sine law on ${T('\\angle C')}, opposite the <b>longest</b> side 18: ${T(`\\sin C\\approx${fx(sC, 4)}`)}, and ${T('\\sin^{-1}')} says ${T(`${fx(Cw, 1)}^\\circ`)} …`, run: async (c) => { await show(c, L[1]); await drawOn(c, aC, 300); await show(c, lCw); } },
      { cap: `… but look at the picture: ${T('\\angle C')} is clearly <b>obtuse</b>. ${T('\\sin^{-1}')} only gives acute angles; the real ${T(`\\angle C=${fx(Cr, 1)}^\\circ`)}.`, run: async (c) => { await stampIn(c, st); lCw.style.opacity = 0; await show(c, lCr); await show(c, L[2]); } },
      { cap: `The safe order: the <b>smaller</b> angle next. ${T('\\angle A')} is opposite the shortest side, so it can’t be obtuse: ${T(`\\angle A\\approx${fx(Aa, 1)}^\\circ`)}.`, run: async (c) => { st.style.opacity = 0; await show(c, L[3]); await drawOn(c, aA, 300); await show(c, lA); } },
      { cap: `Then the angle sum gives the big one: ${T(`\\angle C\\approx${fx(Cr, 1)}^\\circ`)}. (Or find the largest angle with the cosine law, which never misses an obtuse angle.)`, run: (c) => show(c, L[4]) }
    ];
  }
};

/* ====================================================================================================
 * Bearings scene (Example 7 and a demo): harbour H, north up; bearings as degrees clockwise from north
 * ==================================================================================================== */
const brg = (deg, r) => [r * sinD(deg), r * cosD(deg)];
function boatScene(host, d, o) {
  const P1 = brg(d.b1, d.r1), P2 = brg(d.b2, d.r2), top = Math.max(P1[1], P2[1], 0) + 2.2, bot = Math.min(P1[1], P2[1], 0) - 1.6;
  const F = new TriFig(host, Object.assign({ pts: { H: [0, 0], P: P1, Q: P2 }, extra: [[0, top], [0, bot], [-1.5, 0]], pad: [30, 70, 30, 40], font: 18 }, o));
  const H = F.V.H, Np = F.P(0, top - 0.6), Sp = F.P(0, bot + 0.3);
  svgEl('line', { x1: H[0], y1: Np[1], x2: H[0], y2: Sp[1], stroke: GRAY, 'stroke-width': 2.5 }, F.gBase);
  arrowHead(F.gBase, H[0], Np[1] - 6, 0, -1, { color: GRAY, width: 2.5 });
  lab(F.ov, '<b>N</b>', H[0], Np[1] - 10, 'n', 'u3l6-compass', 2); lab(F.ov, '<b>S</b>', H[0], Sp[1], 's', 'u3l6-compass', 4);
  const p1 = F.seg('H', 'P', BC, 4.5), p2 = F.seg('H', 'Q', BC, 4.5);
  const r1 = F.sideLab('H', 'P', T(cB(`${d.r1}\\text{ km}`)), 'u3l6-lab-b', { in: true, t: 0.62 }), r2 = F.sideLab('H', 'Q', T(cB(`${d.r2}\\text{ km}`)), 'u3l6-lab-b', { in: true, t: 0.62 });
  F.vlab('H');
  const nb = d.b1, sb = d.b2;
  const a1 = angleArc(F.gTop, H, Np, F.V.P, 58, { color: '#5a6070', width: 2.5 });
  const m1 = (nb > 180 ? (nb + 360) / 2 : nb / 2) * RAD, l1 = lab(F.ov, T(`${d.t1}^\\circ`), H[0] + 80 * Math.sin(m1), H[1] - 80 * Math.cos(m1), 'c', 'u3l6-lab-brg');
  const sAng = sb - 180, a2 = angleArc(F.gTop, H, Sp, F.V.Q, 44, { color: '#5a6070', width: 2.5 });
  const m2 = (180 + sAng / 2) * RAD, l2 = lab(F.ov, T(`${d.t2}^\\circ`), H[0] + 68 * Math.sin(m2), H[1] - 68 * Math.cos(m2), 'c', 'u3l6-lab-brg');
  const aH = F.arc('H', AC, 30, ['P', 'Q']);
  const mH = ((d.b1 + d.b2) / 2) * RAD, lH = lab(F.ov, T(cA(`${Math.abs(d.b2 - d.b1)}^\\circ`)), H[0] + 52 * Math.sin(mH), H[1] - 52 * Math.cos(mH), 'c', 'u3l6-al u3l6-lab-ang');
  const dd = F.seg('P', 'Q', AC, 4, '9 7'), dl = F.sideLab('P', 'Q', T(cA(o.dLab || 'd')), 'u3l6-lab-a');
  const boat = (p, b) => { const g = svgEl('g', {}, F.gTop); svgEl('path', { d: 'M-13 2 L13 2 L8 9 L-8 9 Z', fill: '#7a5a3a' }, g); svgEl('path', { d: 'M0 0 L0 -20 L12 -2 Z', fill: '#fff', stroke: INK, 'stroke-width': 1.5 }, g); svgEl('line', { x1: 0, y1: 2, x2: 0, y2: -21, stroke: INK, 'stroke-width': 2 }, g); g.setAttribute('transform', `translate(${p[0]} ${p[1]})`); return g; };
  const bt1 = boat(F.V.P), bt2 = boat(F.V.Q);
  return { F, p1, p2, r1, r2, a1, l1, a2, l2, aH, lH, dd, dl, bt1, bt2 };
}
const BT = {
  ex7: { label: 'Example 7 check', b1: 25, r1: 14, b2: 120, r2: 19, t1: 25, t2: 60, w1: 'east', w2: 'east', from1: '25^\\circ', n1: 'N25^\\circ\\text{E}', n2: 'S60^\\circ\\text{E}', from2: '180^\\circ-60^\\circ=120^\\circ' },
  demo: { label: 'Demo: N50°W and S20°W', b1: 310, r1: 10, b2: 200, r2: 13, t1: 50, t2: 20, w1: 'west', w2: 'west', n1: 'N50^\\circ\\text{W}', n2: 'S20^\\circ\\text{W}', from1: '360^\\circ-50^\\circ=310^\\circ', from2: '180^\\circ+20^\\circ=200^\\circ' }
};
const boats = {
  title: 'Bearings and the angle between two paths',
  height: 420, minW: 940, capH: 84,
  choices: [{ v: 'ex7', label: BT.ex7.label }, { v: 'demo', label: BT.demo.label }],
  ask: (v) => { const d = BT[v]; return `Two boats leave harbour ${T('H')}: ${d.r1} km on ${T(d.n1)} and ${d.r2} km on ${T(d.n2)}. How far apart are they?`; },
  make(stage, v, ex) {
    const W = ex.W, d = BT[v], ang = Math.abs(d.b2 - d.b1), hi = Math.max(d.b1, d.b2), lo = Math.min(d.b1, d.b2), dist = law(d.r1, d.r2, ang);
    const S = boatScene(stage, d, { x: 0, y: 0, w: 500, h: 416 });
    const all = [S.p1, S.p2, S.r1, S.r2, S.a1, S.l1, S.a2, S.l2, S.aH, S.lH, S.dd, S.dl, S.bt1, S.bt2]; all.forEach(hide);
    const pn = panel(stage, 512, 6, W - 520, 404, 'Find the distance');
    const L = [
      lineIn(pn, `Clockwise from north: boat 1 at ${T(d.from1)}, boat 2 at ${T(d.from2)}.`, 'u3l6-line-sm'),
      lineIn(pn, T(cA(`\\angle H=${hi}^\\circ-${lo}^\\circ=${ang}^\\circ`))),
      lineIn(pn, T(`d^2=${d.r1}^2+${d.r2}^2-2(${d.r1})(${d.r2})\\cos${ang}^\\circ\\approx${fx(dist * dist, 2)}`), 'u3l6-line-sm'),
      lineIn(pn, `${T(cA(`d\\approx${fx(dist, 1)}`))} <b>km</b>`, 'u3l6-line-ans')
    ];
    const sail = async (c, path, bt, P, lbl) => {
      path.style.opacity = 1; bt.style.opacity = 1; const H = S.F.V.H;
      const job = drawIn(path, 1100, c);
      await tween(c, 1100, (t) => { bt.setAttribute('transform', `translate(${H[0] + (P[0] - H[0]) * t} ${H[1] + (P[1] - H[1]) * t})`); });
      await job; await show(c, lbl);
    };
    return [
      { cap: `Harbour ${T('H')}, north up. Boat 1: ${T(d.n1)} means face <b>north</b>, then turn ${T(`${d.t1}^\\circ`)} toward <b>${d.w1}</b>. It sails ${d.r1} km.`, run: async (c) => { await sail(c, S.p1, S.bt1, S.F.V.P, S.r1); await drawOn(c, S.a1, 300); await show(c, S.l1); } },
      { cap: `Boat 2: ${T(d.n2)} means face <b>south</b>, then turn ${T(`${d.t2}^\\circ`)} toward <b>${d.w2}</b>. It sails ${d.r2} km.`, run: async (c) => { await sail(c, S.p2, S.bt2, S.F.V.Q, S.r2); await drawOn(c, S.a2, 300); await show(c, S.l2); } },
      { cap: `The angle between the paths: measured clockwise from north, boat 1 is at ${T(d.from1)} and boat 2 at ${T(d.from2)}. So ${T(`\\angle H=${hi}^\\circ-${lo}^\\circ=${ang}^\\circ`)}.`, run: async (c) => { await show(c, L[0]); await drawOn(c, S.aH, 400); await show(c, S.lH); await show(c, L[1]); } },
      { cap: `${T(`${d.r1}`)} km and ${T(`${d.r2}`)} km with the ${T(`${ang}^\\circ`)} angle <b>between</b> them: SAS. The distance ${T('d')} is opposite ${T('\\angle H')}.`, run: async (c) => { await drawOn(c, S.dd, 500); await show(c, S.dl); } },
      { cap: `${T(`d^2=${d.r1}^2+${d.r2}^2-2(${d.r1})(${d.r2})\\cos${ang}^\\circ\\approx${fx(dist * dist, 2)}`)}, so ${T(`d\\approx${fx(dist, 1)}`)} km.`, run: async (c) => { await show(c, L[2]); await show(c, L[3]); S.dl.innerHTML = T(cA(`d\\approx${fx(dist, 1)}\\text{ km}`)); } }
    ];
  }
};

/* ====================================================================================================
 * Parallelogram scene (Example 8 and a rectangle check)
 * ==================================================================================================== */
function paraScene(host, d, o) {
  const D = [d.s * cosD(d.ang), d.s * sinD(d.ang)], B = [d.l, 0], Cc = [d.l + D[0], D[1]];
  const F = new TriFig(host, Object.assign({ pts: { A: [0, 0], B, C: Cc, D }, tri: ['A', 'B', 'C'], cen: [(d.l + D[0]) / 2, D[1] / 2], pad: [40, 40, 44, 40], font: 18 }, o));
  const fABD = F.fill(['A', 'B', 'D'], AC, 0.13), fABC = F.fill(['A', 'B', 'C'], G2, 0.12);
  F.seg('A', 'B', INK, 4); F.seg('B', 'C', INK, 4); F.seg('C', 'D', INK, 4); F.seg('D', 'A', INK, 4);
  ['A', 'B', 'C', 'D'].forEach((k) => F.vlab(k));
  F.sideLab('A', 'B', T(`${d.sl}\\text{ cm}`), 'u3l6-lab-k'); F.sideLab('A', 'D', T(`${d.ss}\\text{ cm}`), 'u3l6-lab-k');
  const aA = F.arc('A', AC, 30, ['B', 'D']), lA = F.angLab('A', T(cA(`${d.ang}^\\circ`)), 30, 'u3l6-lab-ang', ['B', 'D']);
  const right = d.ang === 90;
  const aB = F.arc('B', G2, 30, ['A', 'C']), lB = F.angLab('B', T(c2(`${180 - d.ang}^\\circ`)), 30, 'u3l6-lab-ang', ['A', 'C']);
  const bd = F.seg('B', 'D', AC, 4, '9 7'), ac = F.seg('A', 'C', G2, 4, '9 7');
  const lBC = F.sideLab('B', 'C', T(`${d.ss}`), 'u3l6-lab-k u3l6-small');
  return { F, fABD, fABC, aA, lA, aB, lB, bd, ac, lBC, right };
}
const PA = {
  ex8: { label: 'Example 8 check', l: 14, s: 9, ang: 62, sl: '14.0', ss: '9.0' },
  rect: { label: 'Rectangle check: 90°', l: 14, s: 9, ang: 90, sl: '14.0', ss: '9.0' }
};
const para = {
  title: 'The diagonals of a parallelogram',
  height: 400, minW: 940, capH: 84,
  choices: [{ v: 'ex8', label: PA.ex8.label }, { v: 'rect', label: PA.rect.label }],
  ask: (v) => `Parallelogram ${T('ABCD')}: ${T('AB=14.0')} cm, ${T('AD=9.0')} cm, ${T(`\\angle DAB=${PA[v].ang}^\\circ`)}. Determine both diagonals.`,
  make(stage, v, ex) {
    const W = ex.W, d = PA[v], bd = law(d.l, d.s, d.ang), ac = law(d.l, d.s, 180 - d.ang);
    const S = paraScene(stage, d, { x: 0, y: 0, w: 520, h: 396, pad: d.ang === 90 ? [40, 40, 44, 80] : [40, 40, 44, 40] });
    [S.fABD, S.fABC, S.aB, S.lB, S.bd, S.ac, S.lBC].forEach(hide);
    const pn = panel(stage, 532, 6, W - 540, 388, 'Two triangles, two diagonals');
    const lBD = hide(S.F.sideLab('B', 'D', T(cA(`${fx(bd, 1)}`)), 'u3l6-lab-a', { in: true, t: 0.62 })), lAC = hide(S.F.sideLab('A', 'C', T(c2(`${fx(ac, 1)}`)), 'u3l6-lab-g2', { in: true, t: 0.7 }));
    if (v === 'rect') {
      const L = [
        lineIn(pn, T(`BD^2=14.0^2+9.0^2-2(14.0)(9.0)(0)=277`), 'u3l6-line-sm'),
        lineIn(pn, T(`AC^2=14.0^2+9.0^2-2(14.0)(9.0)(0)=277`), 'u3l6-line-sm'),
        lineIn(pn, `${T(`BD=AC=\\sqrt{277}\\approx${fx(bd, 1)}`)} <b>cm</b>`, 'u3l6-line-ans')
      ];
      return [
        { cap: `A rectangle is a parallelogram with ${T('90^\\circ')} angles. ${T('\\cos90^\\circ=0')}, so the correction vanishes: plain Pythagoras.`, run: async (c) => { await appear(c, S.fABD, 300); await drawOn(c, S.bd, 400); await show(c, L[0]); await show(c, lBD); } },
        { cap: `${T('\\angle ABC')} is also ${T('90^\\circ')}, so ${T('AC')} gives the same: the diagonals of a rectangle are <b>equal</b>.`, run: async (c) => { S.fABD.style.opacity = 0; await appear(c, S.fABC, 300); await drawOn(c, S.ac, 400); await show(c, L[1]); await show(c, lAC); } },
        { cap: `${T(`\\sqrt{277}\\approx${fx(bd, 1)}`)} cm. Tilt the rectangle into Example 8’s parallelogram and one diagonal shrinks while the other grows.`, run: (c) => show(c, L[2]) }
      ];
    }
    const L = [
      lineIn(pn, `${T('\\triangle ABD')}: ${T(cA('\\angle A=62^\\circ'))} is between 14.0 and 9.0.`, 'u3l6-line-sm'),
      lineIn(pn, T(`BD^2=14.0^2+9.0^2-2(14.0)(9.0)\\cos62^\\circ`), 'u3l6-line-sm'),
      lineIn(pn, `${T(`BD^2\\approx${fx(bd * bd, 2)}`)}, &nbsp;${T(cA(`BD\\approx${fx(bd, 1)}`))} <b>cm</b>`, 'u3l6-line-ans'),
      lineIn(pn, `${T(c2('\\angle ABC=180^\\circ-62^\\circ=118^\\circ'))}, ${T('BC=AD=9.0')}`, 'u3l6-line-sm'),
      lineIn(pn, T(`AC^2=14.0^2+9.0^2-2(14.0)(9.0)\\cos118^\\circ`), 'u3l6-line-sm'),
      lineIn(pn, `${T(`AC^2\\approx${fx(ac * ac, 2)}`)}, &nbsp;${T(c2(`AC\\approx${fx(ac, 1)}`))} <b>cm</b>`, 'u3l6-line-ans')
    ];
    return [
      { cap: `Diagonal ${T('BD')} cuts off ${T('\\triangle ABD')}: sides 14.0 and 9.0 with the ${T('62^\\circ')} angle <b>between</b> them. SAS, and ${T('BD')} is opposite ${T('\\angle A')}.`, run: async (c) => { await appear(c, S.fABD, 300); await drawOn(c, S.bd, 500); await show(c, L[0]); } },
      { cap: `${T(`BD^2=14.0^2+9.0^2-2(14.0)(9.0)\\cos62^\\circ\\approx${fx(bd * bd, 2)}`)}, so ${T(`BD\\approx${fx(bd, 1)}`)} cm.`, run: async (c) => { await show(c, L[1]); await show(c, L[2]); await show(c, lBD); } },
      { cap: `For ${T('AC')}, use ${T('\\triangle ABC')}. Adjacent angles of a parallelogram add to ${T('180^\\circ')}: ${T('\\angle ABC=118^\\circ')}, and opposite sides are equal: ${T('BC=AD=9.0')}.`, run: async (c) => { S.fABD.style.opacity = 0; await appear(c, S.fABC, 300); await drawOn(c, S.aB, 300); await Promise.all([show(c, S.lB), show(c, S.lBC)]); await show(c, L[3]); } },
      { cap: `${T(`AC^2=14.0^2+9.0^2-2(14.0)(9.0)\\cos118^\\circ\\approx${fx(ac * ac, 2)}`)}: the cosine is negative, so this time the term is <b>added</b>.`, run: async (c) => { await drawOn(c, S.ac, 500); await show(c, L[4]); } },
      { cap: `${T(`AC\\approx${fx(ac, 1)}`)} cm. The <b>longer</b> diagonal is opposite the <b>obtuse</b> angle.`, run: async (c) => { await show(c, L[5]); await show(c, lAC); } }
    ];
  }
};

/* ====================================================================================================
 * static figures on the example cards
 * ==================================================================================================== */
function mountStatics() {
  const f2 = document.getElementById('u3l6-fig2');
  if (f2) {
    const A = 42, b = 9, c = 13, F = new TriFig(f2, { w: 440, h: 290, pts: { A: [0, 0], B: [c, 0], C: [b * cosD(A), b * sinD(A)], D: [b * cosD(A), 0] }, pad: [34, 34, 62, 34], font: 18 });
    F.seg('A', 'B', INK, 3.5); F.seg('A', 'C', INK, 3.5); F.seg('B', 'C', INK, 3.5); F.seg('C', 'D', HC, 3, '8 6'); F.rmark('D', 'B', 'C');
    ['A', 'B', 'C'].forEach((k) => F.vlab(k)); lab(F.ov, T('D'), F.V.D[0], F.V.D[1] + 4, 's', 'u3l6-vx', 4);
    F.arc('A', INK, 30); F.angLab('A', T('42^\\circ'), 30, 'u3l6-lab-k');
    F.sideLab('A', 'C', '9.0 cm', 'u3l6-lab-k'); F.sideLab('A', 'B', '13.0 cm', 'u3l6-lab-k', { t: 0.8, gap: 30 });
    lab(F.ov, T(cH('h')), F.V.D[0] + 6, (F.V.C[1] + F.V.D[1]) / 2, 'e', 'u3l6-lab-h', 4);
  }
  const f3 = document.getElementById('u3l6-fig3');
  if (f3) {
    const F = new TriFig(f3, { w: 380, h: 300, pts: { A: [0, 0], B: [4, 0], C: [1.6, 2.2], D: [1.6, 0] }, pad: [34, 30, 80, 30], font: 18 });
    F.seg('A', 'B', INK, 3.5); F.seg('A', 'C', INK, 3.5); F.seg('B', 'C', INK, 3.5); F.seg('C', 'D', HC, 3, '8 6'); F.rmark('D', 'B', 'C');
    ['A', 'B', 'C'].forEach((k) => F.vlab(k)); lab(F.ov, T('D'), F.V.D[0], F.V.D[1] + 4, 's', 'u3l6-vx', 4);
    F.arc('A', INK, 28); F.angLab('A', T('A'), 28, 'u3l6-lab-k');
    F.sideLab('A', 'C', T('b'), 'u3l6-lab-k'); F.sideLab('B', 'C', T('a'), 'u3l6-lab-k');
    lab(F.ov, T(cH('h')), F.V.D[0] + 6, (F.V.C[1] + F.V.D[1]) / 2, 'e', 'u3l6-lab-h', 4);
    F.dim('A', 'D', 40, T('x')); F.dim('D', 'B', 40, T('c-x'));
  }
  const f5 = document.getElementById('u3l6-fig5');
  if (f5) {
    const F = new TriFig(f5, { w: 380, h: 220, pts: { A: [0, 0], B: [13, 0], C: sssC(8, 11, 13) }, pad: [30, 34, 34, 34], font: 18 });
    F.seg('A', 'B', INK, 3.5); F.seg('A', 'C', INK, 3.5); F.seg('B', 'C', INK, 3.5);
    ['A', 'B', 'C'].forEach((k) => F.vlab(k));
    F.sideLab('A', 'B', '13', 'u3l6-lab-k'); F.sideLab('A', 'C', '11', 'u3l6-lab-k'); F.sideLab('B', 'C', '8', 'u3l6-lab-k');
    F.arc('A', INK, 30); F.angLab('A', '?', 30, 'u3l6-lab-k');
  }
  const f6 = document.getElementById('u3l6-fig6');
  if (f6) {
    const F = new TriFig(f6, { w: 440, h: 270, pts: { Y: [0, 0], X: [22, 0], Z: [15 * cosD(37), 15 * sinD(37)] }, pad: [34, 34, 40, 34], font: 18 });
    F.seg('Y', 'X', INK, 3.5); F.seg('Y', 'Z', INK, 3.5); F.seg('X', 'Z', INK, 3.5);
    ['X', 'Y', 'Z'].forEach((k) => F.vlab(k));
    F.sideLab('Y', 'X', '22.0 cm', 'u3l6-lab-k'); F.sideLab('Y', 'Z', '15.0 cm', 'u3l6-lab-k');
    F.arc('Y', INK, 30); F.angLab('Y', T('37^\\circ'), 30, 'u3l6-lab-k');
  }
  const f7 = document.getElementById('u3l6-fig7');
  if (f7) { const S = boatScene(f7, BT.ex7, { w: 440, h: 330 }); vis(S.aH, false); vis(S.lH, false); }
  const f8 = document.getElementById('u3l6-fig8');
  if (f8) { const S = paraScene(f8, PA.ex8, { w: 440, h: 270 }); [S.fABD, S.fABC, S.aB, S.lB, S.lBC].forEach((e) => vis(e, false)); }
}

/* =============================== Stand Up Break =============================== */
standup('u3l6', {
  intro: 'At your whiteboard: sketch the triangle, decide SAS or SSS, then use the cosine law. Multiply before you subtract.',
  levels: {
    BEG: (r) => { // a side from SAS
      const A = r.pick([34, 47, 52, 58, 66, 73, 104, 112, 126]), b = r.int(6, 15); let c = r.int(7, 18); if (c === b) c += 2;
      const a = law(b, c, A);
      return { text: `In ${T('\\triangle ABC')}, ${T(`\\angle A=${A}^\\circ`)}, ${T(`b=${b}`)} cm and ${T(`c=${c}`)} cm. Determine ${T('a')} to the nearest tenth.`, q: '',
        a: [`a^2=${b}^2+${c}^2-2(${b})(${c})\\cos${A}^\\circ\\approx${fx(a * a, 2)}`, `a\\approx${fx(a, 1)}\\text{ cm}`] };
    },
    PRG: (r) => { // the largest angle from SSS
      let s;
      do { s = [r.int(4, 14), r.int(4, 14), r.int(5, 18)].sort((x, y) => x - y); } while (s[0] + s[1] <= s[2] + 1 || s[0] === s[2]);
      const [p, q, l] = s, num = p * p + q * q - l * l, den = 2 * p * q, th = acosD(num / den);
      return { text: `A triangle has sides ${p} m, ${q} m and ${l} m. Determine its largest angle to the nearest degree.`, q: '',
        a: [`\\text{opposite }${l}:\\ \\cos\\theta=\\dfrac{${p}^2+${q}^2-${l}^2}{2(${p})(${q})}=\\dfrac{${num}}{${den}}\\approx${fx(num / den, 4)}`, `\\theta\\approx${fx(th, 0)}^\\circ${num < 0 ? '\\ \\text{(obtuse)}' : ''}`] };
    },
    MAS: (r) => { // solve a SAS triangle completely
      const C = r.pick([28, 41, 55, 63, 108, 117, 132]), a = r.int(7, 14); let b = r.int(9, 20); if (Math.abs(b - a) < 2) b += 3;
      const c = law(a, b, C), small = Math.min(a, b), sn = small === a ? 'A' : 'B', ot = sn === 'A' ? 'B' : 'A';
      const sv = small * sinD(C) / c, S1 = asinD(sv), S2 = 180 - C - S1;
      return { text: `Solve ${T('\\triangle ABC')} if ${T(`\\angle C=${C}^\\circ`)}, ${T(`a=${a}`)} cm and ${T(`b=${b}`)} cm. Sides to the nearest tenth, angles to the nearest degree.`, q: '',
        a: [`c^2=${a}^2+${b}^2-2(${a})(${b})\\cos${C}^\\circ\\approx${fx(c * c, 2)},\\ c\\approx${fx(c, 1)}`, `\\sin ${sn}=\\dfrac{${small}\\sin${C}^\\circ}{${fx(c, 3)}}\\approx${fx(sv, 4)},\\ \\angle ${sn}\\approx${fx(S1, 0)}^\\circ`, `\\angle ${ot}\\approx180^\\circ-${C}^\\circ-${fx(S1, 1)}^\\circ\\approx${fx(S2, 0)}^\\circ`] };
    }
  }
});

/* =============================== mount =============================== */
mountCroc();
mountStatics();
export const explainers = mountExplainers({ cases, alt, derive, forms, pythag, side, angle, dial, solve, boats, para });
export const _test = { fx, fz, law, angSSS, sssC, TriFig, Hinge, SS, BT, PA };
