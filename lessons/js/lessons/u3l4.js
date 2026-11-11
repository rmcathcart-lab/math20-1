/* Math 20-1 · Unit 3 · Lesson 4 — Exact Values from Special Triangles (no calculator).
 * Warm-up (Which Wrench Fits?: a hexagon nut of side 2 cut into equilateral triangles; flat to flat is 2√3), and the explainers:
 *   cut (STAR: a unit square sliced on its diagonal → 1, 1, √2; an equilateral triangle of side 2 halved → 1, √3, 2),
 *   read (SOH CAH TOA on each special triangle, rationalizing; Example 1 check),
 *   unit (each triangle shrunk to hypotenuse 1 lands on the unit circle at (cos θ, sin θ); an arm sweeping 0° → 90°),
 *   patterns (the table: sines √0/2 … √4/2, cosines reversed, tan = sin ÷ cos; Example 2 check),
 *   flip (STAR: one special triangle flipped into all four quadrants with its sign stickers; CAST),
 *   anyq (quadrant → reference angle → table → sign; quadrantal angles with r = 1; Example 3 check),
 *   subst (exact values in brackets, then simplify; sin²θ = (sin θ)²; Example 4 check),
 *   solve (isolate, sign → CAST quadrants, the table read backwards, place θR; Examples 5 and 6),
 *   point (a scaled special triangle under a point → θ, r; a ratio and a quadrant; a rotation; Example 7).
 * Colours: terminal arm / rotation angle in the course accent (brand), reference angle amber; the 45-45-90 triangle blue,
 * the 30-60-90 triangle purple; positive signs green, negative signs red. */
import {
  h, tex, add, box, Graph, RightTriangle, stamp, stampIn, mountExplainers, pop, fadeIn, appear, sleep, tween,
  svgEl, liveCtx, pulse, place, drawIn, anim, arrowHead, rightMark, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const BR = COLORS.brand, RF = COLORS.amber, C45 = COLORS.blue, C30 = COLORS.purple, POS = COLORS.green, NEG = COLORS.red, INK = COLORS.ink, GRAY = COLORS.gray;
const cB = (s) => `\\textcolor{${BR}}{${s}}`, cR = (s) => `\\textcolor{${RF}}{${s}}`, cP = (s) => `\\textcolor{${POS}}{${s}}`, cN = (s) => `\\textcolor{${NEG}}{${s}}`;
const c45 = (s) => `\\textcolor{${C45}}{${s}}`, c30 = (s) => `\\textcolor{${C30}}{${s}}`;
const D = (a) => `${a}^\\circ`;
const rad = (a) => (a * Math.PI) / 180, cosd = (a) => Math.cos(rad(a)), sind = (a) => Math.sin(rad(a));
const S2 = Math.SQRT2, S3 = Math.sqrt(3);
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const dim = (c, el, o = 0.3) => anim(c, el, [{ opacity: o }], 320);
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
const panel = (stage, x, y, w, hh, title, cls = '') => div(stage, 'u3l4-panel ' + cls, title ? `<div class="u3l4-ph">${title}</div>` : '', x, y, w, hh);
const lineIn = (p, html, cls = '') => { const d = h('div', 'u3l4-line ' + cls, html); p.appendChild(d); hide(d); return d; };
const lab = (host, px, py, html, cls = '', pos = 'c') => { const d = h('div', 'u3l4-lab ' + cls, html); host.appendChild(d); place(d, px, py, pos, 4); return d; };
const pd = (pts) => 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L');
const quadOf = (a) => (a < 90 ? 1 : a < 180 ? 2 : a < 270 ? 3 : 4);
const ROMAN = ['', 'I', 'II', 'III', 'IV'];
const refOf = (a) => [0, a, 180 - a, a - 180, 360 - a][quadOf(a)];
const placeTex = (q, r) => [null, D(r), `180^\\circ-${D(r)}=${D(180 - r)}`, `180^\\circ+${D(r)}=${D(180 + r)}`, `360^\\circ-${D(r)}=${D(360 - r)}`][q];
const angleIn = (q, r) => [0, r, 180 - r, 180 + r, 360 - r][q];
const POSQ = { sin: [1, 2], cos: [1, 4], tan: [1, 3] };
const SIGN = (fn, q) => (POSQ[fn].includes(q) ? 1 : -1);
/* the table: unsigned exact values (rationalized) for the reference angles */
const TAB = {
  sin: { 0: '0', 30: '\\dfrac{1}{2}', 45: '\\dfrac{\\sqrt{2}}{2}', 60: '\\dfrac{\\sqrt{3}}{2}', 90: '1' },
  cos: { 0: '1', 30: '\\dfrac{\\sqrt{3}}{2}', 45: '\\dfrac{\\sqrt{2}}{2}', 60: '\\dfrac{1}{2}', 90: '0' },
  tan: { 0: '0', 30: '\\dfrac{\\sqrt{3}}{3}', 45: '1', 60: '\\sqrt{3}', 90: '\\text{undefined}' }
};
const TABt = { sin: { 30: '\\tfrac{1}{2}', 45: '\\tfrac{\\sqrt{2}}{2}', 60: '\\tfrac{\\sqrt{3}}{2}' }, cos: { 30: '\\tfrac{\\sqrt{3}}{2}', 45: '\\tfrac{\\sqrt{2}}{2}', 60: '\\tfrac{1}{2}' }, tan: { 30: '\\tfrac{\\sqrt{3}}{3}', 45: '1', 60: '\\sqrt{3}' } };
const sgnT = (s, v) => (s < 0 ? '-' + v : v);

/* ====================================================================================================
 * quadrant scenes on a Graph: arms, rotation arcs, reference arcs, reference triangles, CAST
 * ==================================================================================================== */
function qGraph(stage, x, y, size, R, o = {}) {
  return new Graph(stage, { x, y, width: size, height: size, xmin: -R, xmax: R, ymin: -R, ymax: R, xstep: o.step || 1, ystep: o.step || 1,
    numbers: o.numbers ?? true, xlabels: o.labels || 0, ylabels: o.labels || 0, fontSize: 15, cls: 'u3l4-g', pad: [28, 28, 18, 18] });
}
function arcPts(G, rpx, a0, a1) {
  const [cx, cy] = G.toPx(0, 0), n = Math.max(6, Math.ceil(Math.abs(a1 - a0) / 3)), out = [];
  for (let i = 0; i <= n; i++) { const a = a0 + ((a1 - a0) * i) / n; out.push([cx + rpx * cosd(a), cy - rpx * sind(a)]); }
  return out;
}
/* an arc at the origin from a0 to a1 (degrees, ccw), radius r px; arrow at a1; label at the middle */
function mkArc(G, o) {
  const g = svgEl('g', { class: 'bk-curve' }, o.layer || G.layers.top), color = o.color || BR;
  g.style.color = color;
  const p = svgEl('path', { class: 'bk-stroke', fill: 'none', stroke: color, 'stroke-width': o.width || 3, 'stroke-linecap': 'round' }, g);
  let head = null, L = null;
  if (o.label != null) { L = h('div', 'u3l4-arclab ' + (o.lcls || ''), o.label); L.style.color = color; G.html.appendChild(L); }
  g.set = (a0, a1) => {
    p.setAttribute('d', Math.abs(a1 - a0) < 0.01 ? 'M0 0' : pd(arcPts(G, o.r, a0, a1)));
    if (head) head.remove(); head = null;
    if (o.arrow && Math.abs(a1 - a0) > 6) { const [cx, cy] = G.toPx(0, 0), a = a1; head = arrowHead(g, cx + o.r * cosd(a), cy - o.r * sind(a), -sind(a), -cosd(a), { color, width: 2.6 }); }
    if (L) { const m = (a0 + a1) / 2, [cx, cy] = G.toPx(0, 0), lr = o.lr || o.r + 22; place(L, cx + lr * cosd(m), cy - lr * sind(m), 'c'); L.style.visibility = Math.abs(a1 - a0) < 1 ? 'hidden' : ''; }
  };
  g.L = L; g.set(o.a0 || 0, o.a1 == null ? 0 : o.a1);
  g.kill = () => { g.remove(); if (L) L.remove(); };
  return g;
}
/* a terminal arm from the origin to (x, y) graph units */
function mkArm(G, o = {}) {
  const g = svgEl('g', { class: 'bk-curve' }, o.layer || G.layers.top), color = o.color || BR;
  g.style.color = color;
  const p = svgEl('path', { class: 'bk-stroke', fill: 'none', stroke: color, 'stroke-width': o.width || 4, 'stroke-linecap': 'round' }, g);
  if (o.dash) p.setAttribute('stroke-dasharray', o.dash);
  const dot = o.dot === false ? null : svgEl('circle', { r: 6.5, fill: color, stroke: '#fff', 'stroke-width': 2 }, g);
  g.set = (x, y) => { const [x0, y0] = G.toPx(0, 0), [x1, y1] = G.toPx(x, y); p.setAttribute('d', `M${x0} ${y0} L${x1} ${y1}`); if (dot) { dot.setAttribute('cx', x1); dot.setAttribute('cy', y1); } g.at = [x, y]; };
  g.set(o.x ?? 0, o.y ?? 0);
  return g;
}
/* reference triangle under the point (x, y): O, (x, 0), (x, y); legs coloured by sign when o.signs */
function mkTri(G, o = {}) {
  const g = svgEl('g', { class: 'u3l4-tri' }, o.layer || G.layers.data), fill = o.fill || RF;
  const poly = svgEl('polygon', { fill, 'fill-opacity': o.fo ?? 0.16, stroke: 'none' }, g);
  const lx = svgEl('path', { fill: 'none', 'stroke-width': 4.5, 'stroke-linecap': 'round' }, g);
  const ly = svgEl('path', { fill: 'none', 'stroke-width': 4.5, 'stroke-linecap': 'round' }, g);
  const hyp = svgEl('path', { fill: 'none', stroke: o.hyp || BR, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
  const rm = svgEl('path', { fill: 'none', stroke: INK, 'stroke-width': 1.8 }, g);
  const labs = {};
  ['x', 'y', 'r'].forEach((k) => { if (o.labels && o.labels[k] != null) { labs[k] = h('div', 'u3l4-lab u3l4-tl', o.labels[k]); G.html.appendChild(labs[k]); } });
  g.labs = labs;
  g.set = (x, y) => {
    const O = G.toPx(0, 0), A = G.toPx(x, 0), P = G.toPx(x, y);
    poly.setAttribute('points', [O, A, P].map((p) => p.join(',')).join(' '));
    const sx = x < -1e-9 ? NEG : POS, sy = y < -1e-9 ? NEG : POS;
    lx.setAttribute('stroke', o.signs ? sx : o.leg || INK); ly.setAttribute('stroke', o.signs ? sy : o.leg || INK);
    lx.setAttribute('d', `M${O[0]} ${O[1]} L${A[0]} ${A[1]}`); ly.setAttribute('d', `M${A[0]} ${A[1]} L${P[0]} ${P[1]}`); hyp.setAttribute('d', `M${O[0]} ${O[1]} L${P[0]} ${P[1]}`);
    const s = 11, dx = x > 0 ? -s : s, dy = y > 0 ? -s : s;
    rm.setAttribute('d', Math.abs(x) < 0.05 || Math.abs(y) < 0.05 ? 'M0 0' : `M${A[0] + dx} ${A[1]} L${A[0] + dx} ${A[1] + dy} L${A[0]} ${A[1] + dy}`);
    const off = 20;
    if (labs.x) place(labs.x, (O[0] + A[0]) / 2, A[1] + (y > 0 ? off : -off), 'c');
    if (labs.y) place(labs.y, A[0] + (x > 0 ? off + 8 : -off - 8), (A[1] + P[1]) / 2, 'c');
    if (labs.r) { const mx = (O[0] + P[0]) / 2, my = (O[1] + P[1]) / 2, L = Math.hypot(P[0] - O[0], P[1] - O[1]) || 1, nx = -(P[1] - O[1]) / L, ny = (P[0] - O[0]) / L, sg = (x * y > 0 ? -1 : 1); place(labs.r, mx + nx * 18 * sg, my + ny * 18 * sg, 'c'); }
    if (labs.x) labs.x.style.color = o.signs ? sx : ''; if (labs.y) labs.y.style.color = o.signs ? sy : '';
    g.at = [x, y];
  };
  g.set(o.x ?? 1, o.y ?? 1);
  g.kill = () => { g.remove(); Object.values(labs).forEach((l) => l.remove()); };
  g.fade = (c, v, lv = v) => Promise.all([anim(c, g, [{ opacity: v }], 300), ...Object.values(labs).map((l) => anim(c, l, [{ opacity: lv }], 300))]);
  return g;
}
/* CAST letters and quadrant tints */
function mkCast(G, R, o = {}) {
  const k = R * 0.64, out = {};
  const L = { 1: ['A', 'All'], 2: ['S', 'Sine'], 3: ['T', 'Tangent'], 4: ['C', 'Cosine'] };
  const P = { 1: [k, k], 2: [-k, k], 3: [-k, -k], 4: [k, -k] };
  for (const q of [1, 2, 3, 4]) {
    const [x, y] = P[q];
    out[q] = G.label(x, y, `<b>${L[q][0]}</b><small>${L[q][1]}</small>`, { cls: 'u3l4-cast' + (o.small ? ' u3l4-cast-sm' : '') });
  }
  return out;
}
function quadRect(G, q, R, color, op = 0.13) {
  const sx = q === 1 || q === 4 ? 1 : -1, sy = q <= 2 ? 1 : -1;
  const [x0, y0] = G.toPx(0, 0), [x1, y1] = G.toPx(sx * R, sy * R);
  return svgEl('rect', { x: Math.min(x0, x1), y: Math.min(y0, y1), width: Math.abs(x1 - x0), height: Math.abs(y1 - y0), fill: color, 'fill-opacity': op, class: 'u3l4-qr' }, G.layers.bg);
}
/* animate an arm from angle a0 to a1 (length len), with a rotation arc */
async function sweep(c, G, arm, arc, a0, a1, len, ms = 900) {
  await tween(c, ms, (t) => { const a = a0 + (a1 - a0) * t; arm.set(len * cosd(a), len * sind(a)); arc.set(0, a); });
}

/* ====================================================================================================
 * Warm-up: Which Wrench Fits? A pointy-top hexagon nut, side 2 cm.
 * ==================================================================================================== */
function mountNut() {
  const host = document.getElementById('u3l4-nut'); if (!host) return;
  const W = 560, H = 392, cx = 280, cy = 158, s = 56, Rr = 2 * s, ap = Rr * S3 / 2; // side 2 cm = 112 px
  const svg = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u3l4-nutsvg' }, host);
  const defs = svgEl('defs', {}, svg);
  const gr = svgEl('linearGradient', { id: 'u3l4-steel', x1: 0, y1: 0, x2: 1, y2: 1 }, defs);
  svgEl('stop', { offset: '0', 'stop-color': '#e3e7ec' }, gr); svgEl('stop', { offset: '.55', 'stop-color': '#aab2bd' }, gr); svgEl('stop', { offset: '1', 'stop-color': '#7d8692' }, gr);
  const V = [0, 1, 2, 3, 4, 5].map((k) => [cx + Rr * cosd(90 + 60 * k), cy - Rr * sind(90 + 60 * k)]);
  const pts = (a) => a.map((p) => p.join(',')).join(' ');
  svgEl('polygon', { points: pts(V.map(([x, y]) => [x + 5, y + 7])), fill: 'rgba(0,0,0,.14)' }, svg);
  svgEl('polygon', { points: pts(V), fill: 'url(#u3l4-steel)', stroke: '#59606b', 'stroke-width': 3, 'stroke-linejoin': 'round' }, svg);
  svgEl('circle', { cx, cy, r: ap * 0.9, fill: 'none', stroke: '#c8ced6', 'stroke-width': 3 }, svg);
  svgEl('circle', { cx, cy, r: 40, fill: '#3a4048', stroke: '#272b31', 'stroke-width': 3 }, svg);
  [33, 26].forEach((r) => svgEl('circle', { cx, cy, r, fill: 'none', stroke: '#59606b', 'stroke-width': 1.6, 'stroke-dasharray': '5 4' }, svg));
  const layer = (n) => { const g = svgEl('g', { class: 'u3l4-nl' }, svg); g.dataset.n = n; return g; };
  const labs = h('div', 'u3l4-nutlabs'); host.appendChild(labs);
  const L = (n, x, y, html, cls = '') => { const d = lab(labs, x, y, html, 'u3l4-nlab ' + cls); d.dataset.n = n; return d; };
  // 6 triangles
  const gT = layer('tri');
  V.forEach((p, k) => { const q = V[(k + 1) % 6]; svgEl('polygon', { points: pts([[cx, cy], p, q]), fill: k % 2 ? '#7b4fc4' : '#a68ae0', 'fill-opacity': 0.34, stroke: '#4b2f86', 'stroke-width': 2.4, 'stroke-linejoin': 'round' }, gT); });
  L('tri', (V[0][0] + V[1][0]) / 2 - 18, (V[0][1] + V[1][1]) / 2 - 12, T('2'));
  L('tri', cx - 26, cy - 54, T('60^\\circ'), 'u3l4-nsm u3l4-nwhite');
  // corner to corner
  const gC = layer('corner');
  svgEl('line', { x1: V[0][0], y1: V[0][1], x2: V[3][0], y2: V[3][1], stroke: '#c93a33', 'stroke-width': 4, 'stroke-linecap': 'round' }, gC);
  [V[0], V[3]].forEach((p) => svgEl('circle', { cx: p[0], cy: p[1], r: 6, fill: '#c93a33', stroke: '#fff', 'stroke-width': 2 }, gC));
  L('corner', cx - 46, cy + 76, '4 cm', 'u3l4-nred');
  // wrench: jaws on the left and right flats, handle down
  const gW = layer('wrench'), jx = ap, jo = ap + 32, top = cy - 64, ib = cy + Rr + 8, ob = ib + 30;
  svgEl('path', { d: `M${cx - jx} ${top} L${cx - jo} ${top} L${cx - jo} ${ob - 14} Q${cx - jo} ${ob} ${cx - jo + 18} ${ob} L${cx - 34} ${ob} L${cx - 26} ${H} L${cx + 26} ${H} L${cx + 34} ${ob} L${cx + jo - 18} ${ob} Q${cx + jo} ${ob} ${cx + jo} ${ob - 14} L${cx + jo} ${top} L${cx + jx} ${top} L${cx + jx} ${ib} L${cx - jx} ${ib} Z`, fill: '#5b6676', 'fill-opacity': 0.9, stroke: '#2e3540', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, gW);
  const dy = 18;
  svgEl('line', { x1: cx - jx, y1: top - 4, x2: cx - jx, y2: dy - 6, stroke: '#1f5bd6', 'stroke-width': 1.6, 'stroke-dasharray': '4 3' }, gW);
  svgEl('line', { x1: cx + jx, y1: top - 4, x2: cx + jx, y2: dy - 6, stroke: '#1f5bd6', 'stroke-width': 1.6, 'stroke-dasharray': '4 3' }, gW);
  svgEl('line', { x1: cx - jx + 10, y1: dy, x2: cx + jx - 10, y2: dy, stroke: '#1f5bd6', 'stroke-width': 3 }, gW);
  arrowHead(gW, cx - jx, dy, -1, 0, { color: '#1f5bd6', width: 3 }); arrowHead(gW, cx + jx, dy, 1, 0, { color: '#1f5bd6', width: 3 });
  const qm = L('wrench', cx, dy, '?', 'u3l4-nblue u3l4-nq');
  // half triangle: centre, the midpoint of the right flat, the corner above it
  const gH = layer('half'), M = [cx + ap, cy], Cn = V[5];
  svgEl('polygon', { points: pts([[cx, cy], M, Cn]), fill: '#f6d24a', 'fill-opacity': 0.75, stroke: '#7a1f3d', 'stroke-width': 3, 'stroke-linejoin': 'round' }, gH);
  svgEl('path', { d: `M${M[0] - 11} ${M[1]} L${M[0] - 11} ${M[1] - 11} L${M[0]} ${M[1] - 11}`, fill: 'none', stroke: '#1c2230', 'stroke-width': 2 }, gH);
  svgEl('line', { x1: cx - ap, y1: cy, x2: cx, y2: cy, stroke: '#7a1f3d', 'stroke-width': 3, 'stroke-dasharray': '7 5' }, gH);
  L('half', (cx + M[0]) / 2, cy + 16, T('\\sqrt{3}'), 'u3l4-nbr');
  L('half', (cx - ap + cx) / 2, cy + 16, T('\\sqrt{3}'), 'u3l4-nbr');
  L('half', M[0] + 16, (M[1] + Cn[1]) / 2, T('1'), 'u3l4-nbr');
  L('half', (cx + Cn[0]) / 2 - 8, (cy + Cn[1]) / 2 - 14, T('2'), 'u3l4-nbr');
  const ansL = L('half', cx, dy, T('2\\sqrt{3}\\approx3.46') + ' cm', 'u3l4-nblue u3l4-nansl');
  const on = {};
  const paint = () => {
    svg.querySelectorAll('.u3l4-nl').forEach((g) => g.classList.toggle('u3l4-on', !!on[g.dataset.n]));
    labs.querySelectorAll('[data-n]').forEach((d) => d.classList.toggle('u3l4-on', !!on[d.dataset.n]));
    qm.classList.toggle('u3l4-on', !!on.wrench && !on.half);
    ansL.classList.toggle('u3l4-on', !!on.half);
    document.querySelectorAll('[data-nut]').forEach((b) => b.classList.toggle('u3l4-bon', !!on[b.dataset.nut]));
  };
  document.querySelectorAll('[data-nut]').forEach((b) => b.addEventListener('click', () => { on[b.dataset.nut] = !on[b.dataset.nut]; paint(); }));
  paint();
}

/* =============================== Example 1 figures =============================== */
function mountFigs() {
  const fa = document.getElementById('u3l4-f1a');
  if (fa) {
    const W = 230, H = 180, S = 130, x0 = 50, y0 = 160;
    const svg = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}` }, fa);
    svgEl('path', { d: `M${x0} ${y0} L${x0} ${y0 - S} L${x0 + S} ${y0 - S}`, fill: 'none', stroke: GRAY, 'stroke-width': 2, 'stroke-dasharray': '6 5' }, svg);
    svgEl('polygon', { points: `${x0},${y0} ${x0 + S},${y0} ${x0 + S},${y0 - S}`, fill: '#e3ecfb', stroke: INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, svg);
    rightMark(svg, [x0 + S, y0], [x0, y0], [x0 + S, y0 - S], 13, { color: INK });
    lab(fa, x0 + S / 2, y0 + 12, T('1')); lab(fa, x0 + S + 14, y0 - S / 2, T('1')); lab(fa, x0 + S / 2 - 14, y0 - S / 2 - 12, T('d'));
    lab(fa, x0 + 34, y0 - 12, T('45^\\circ'), 'u3l4-fsm'); lab(fa, x0 + S - 14, y0 - S + 40, T('45^\\circ'), 'u3l4-fsm');
  }
  const fb = document.getElementById('u3l4-f1b');
  if (fb) {
    const W = 250, H = 180, u = 85, x0 = 40, y0 = 160, ax = x0 + u, ay = y0 - u * S3;
    const svg = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}` }, fb);
    svgEl('polygon', { points: `${x0},${y0} ${x0 + 2 * u},${y0} ${ax},${ay}`, fill: '#efe8fa', stroke: INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, svg);
    svgEl('line', { x1: ax, y1: ay, x2: ax, y2: y0, stroke: INK, 'stroke-width': 2, 'stroke-dasharray': '6 5' }, svg);
    rightMark(svg, [ax, y0], [ax + 10, y0], [ax, y0 - 10], 11, { color: INK });
    lab(fb, x0 + u / 2 - 14, y0 - u * S3 / 2, T('2')); lab(fb, x0 + 1.5 * u + 14, y0 - u * S3 / 2, T('2'));
    lab(fb, x0 + u / 2, y0 + 11, T('1')); lab(fb, x0 + 1.5 * u, y0 + 11, T('1')); lab(fb, ax - 11, y0 - 46, T('h'), 'u3l4-fsm');
    lab(fb, x0 + 30, y0 - 11, T('60^\\circ'), 'u3l4-fsm'); lab(fb, ax - 16, ay + 46, T('30^\\circ'), 'u3l4-fsm u3l4-f30');
  }
}

/* =============================== explainer: cut the shapes (STAR) =============================== */
/* the short arc at corner V between the rays to P1 and P2 */
function cornerArc(svg, V, P1, P2, r, color) {
  const g = svgEl('g', {}, svg), a1 = Math.atan2(P1[1] - V[1], P1[0] - V[0]), a2 = Math.atan2(P2[1] - V[1], P2[0] - V[0]);
  const sw = ((a2 - a1 + 4 * Math.PI) % (2 * Math.PI)) < Math.PI ? 1 : 0;
  svgEl('path', { d: `M${V[0] + r * Math.cos(a1)} ${V[1] + r * Math.sin(a1)} A${r} ${r} 0 0 ${sw} ${V[0] + r * Math.cos(a2)} ${V[1] + r * Math.sin(a2)}`, fill: 'none', stroke: color, 'stroke-width': 3 }, g);
  return g;
}
const cut = {
  title: 'Two special triangles, cut from two shapes',
  height: 420, minW: 900,
  choices: [{ v: 'sq', label: 'Cut the square' }, { v: 'eq', label: 'Cut the equilateral triangle' }],
  ask: (v) => (v === 'sq' ? 'A square has side 1. Cut it on a diagonal: what are the angles and sides of each half?' : 'An equilateral triangle has side 2. Cut it with an altitude: what are the angles and sides of each half?'),
  make(stage, v, ex) {
    const W = ex.W, H = 420;
    const P = panel(stage, 600, 26, W - 616, 370, v === 'sq' ? 'The 45-45-90 triangle' : 'The 30-60-90 triangle', v === 'sq' ? 'u3l4-p45' : 'u3l4-p30');
    // a half: a full-stage layer with its own svg + labels, so it slides as one piece
    const half = (cls, ox = 0, oy = 0) => {
      const box0 = div(stage, 'u3l4-half ' + cls, '', ox, oy, 580 - ox, H - oy);
      const s = svgEl('svg', { width: 580 - ox, height: H - oy, viewBox: `${ox} ${oy} ${580 - ox} ${H - oy}`, class: 'u3l4-ov' }, box0);
      const d = div(box0, 'u3l4-hl0', '', -ox, -oy); // labels in stage coordinates (a zero-size holder)
      return { d, s, box: box0 };
    };
    if (v === 'sq') {
      const S = 230, x0 = 150, y0 = 340, BL = [x0, y0], BRc = [x0 + S, y0], TR = [x0 + S, y0 - S], TL = [x0, y0 - S];
      const lo = half(''), up = half('', 80, 40), whole = half('u3l4-whole');
      const tri = (hh, pts, fill) => svgEl('polygon', { points: pts.map((p) => p.join(',')).join(' '), fill, stroke: INK, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, hh.s);
      tri(lo, [BL, BRc, TR], '#e3ecfb'); tri(up, [BL, TL, TR], '#d5e2fa');
      rightMark(lo.s, BRc, BL, TR, 16, { color: INK }); rightMark(up.s, TL, BL, TR, 16, { color: INK });
      const wm = svgEl('g', {}, whole.s); rightMark(wm, BL, BRc, TL, 16, { color: INK }); rightMark(wm, TR, TL, BRc, 16, { color: INK }); hide(wm);
      lab(lo.d, x0 + S / 2, y0 + 20, T('1')); lab(lo.d, x0 + S + 20, y0 - S / 2, T('1'));
      lab(up.d, x0 + S / 2, y0 - S - 20, T('1')); lab(up.d, x0 - 20, y0 - S / 2, T('1'));
      const cutG = svgEl('g', { class: 'bk-curve' }, whole.s); svgEl('path', { class: 'bk-stroke', d: `M${BL[0]} ${BL[1]} L${TR[0]} ${TR[1]}`, stroke: BR, 'stroke-width': 3.5, 'stroke-dasharray': '10 7', fill: 'none' }, cutG); hide(cutG);
      const sc = hide(lab(whole.d, x0 + S / 2 + 30, y0 - S / 2 + 36, '✂', 'u3l4-scis'));
      const a45 = [];
      const arc = (hh, V, A, B, txt, lx, ly) => { const g = cornerArc(hh.s, V, A, B, 44, C45);
        const t = lab(hh.d, lx, ly, T(txt), 'u3l4-ang45'); hide(g); hide(t); a45.push(g, t); };
      arc(lo, BL, BRc, TR, '45^\\circ', x0 + 66, y0 - 20); arc(lo, TR, BL, BRc, '45^\\circ', x0 + S - 22, y0 - S + 70);
      arc(up, BL, TR, TL, '45^\\circ', x0 + 22, y0 - 70); arc(up, TR, TL, BL, '45^\\circ', x0 + S - 70, y0 - S + 20);
      const dL = hide(lab(lo.d, x0 + S / 2 + 18, y0 - S / 2 + 20, T('d'), 'u3l4-big u3l4-cbr'));
      const dR = hide(lab(lo.d, x0 + S / 2 + 26, y0 - S / 2 + 26, T('\\sqrt{2}'), 'u3l4-big u3l4-cbr'));
      const l1 = lineIn(P, `Legs: ${T('1')} and ${T('1')}. Angles: ${T('45^\\circ,\\ 45^\\circ,\\ 90^\\circ')}`);
      const l2 = lineIn(P, T('d^2=1^2+1^2=2'), 'u3l4-big');
      const l3 = lineIn(P, `${T('d=\\sqrt{2}')} <span class="muted">(about 1.41)</span>`, 'u3l4-big');
      const l4 = lineIn(P, `<div class="u3l4-tribadge u3l4-tb45">${T('1,\\ \\ 1,\\ \\ \\sqrt{2}')}</div><div class="muted u3l4-small">The hypotenuse is the longest side: ${T('\\sqrt{2}>1')}.</div>`);
      return [
        { cap: 'A <b>square</b> with side 1: four right angles.', run: (c) => show(c, wm) },
        { cap: 'Cut it along a <b>diagonal</b>, corner to corner.', run: async (c) => { cutG.style.opacity = 1; await Promise.all([drawIn(cutG, 800, c), show(c, sc)]); } },
        { cap: 'The cut splits two of the 90° corners in half: <b>45°</b> and <b>45°</b>.', run: async (c) => { await dim(c, wm, 0); for (const e of a45) show(c, e); await sleep(c, 400); } },
        { cap: 'Pull the halves apart: two copies of the same <b>45-45-90</b> triangle.', run: async (c) => { await Promise.all([dim(c, cutG, 0), dim(c, sc, 0)]); await anim(c, up.box, [{ transform: 'translate(-70px, -16px)', opacity: 0.4 }], 700); await show(c, l1); } },
        { cap: `Two legs of 1. Pythagoras finds the hypotenuse: ${T('d^2=1^2+1^2=2')}.`, run: async (c) => { await show(c, dL); await show(c, l2); } },
        { cap: `${T('d=\\sqrt{2}')}, a bit longer than a leg.`, run: async (c) => { await dim(c, dL, 0); await pop(c, dR); await show(c, l3); } },
        { cap: `Remember it: the <b>45-45-90 triangle</b> has sides ${T('1,\\ 1,\\ \\sqrt{2}')}.`, run: (c) => pop(c, l4) }
      ];
    }
    // equilateral, side 2
    const u = 130, x0 = 160, y0 = 360, A = [x0, y0], B = [x0 + 2 * u, y0], M = [x0 + u, y0], Ap = [x0 + u, y0 - u * S3];
    const lf = half(''), rt = half('', 0, 0), whole = half('u3l4-whole');
    const tri = (hh, pts, fill) => svgEl('polygon', { points: pts.map((p) => p.join(',')).join(' '), fill, stroke: INK, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, hh.s);
    tri(lf, [A, M, Ap], '#efe8fa'); tri(rt, [M, B, Ap], '#e6dcf7');
    lab(lf.d, (A[0] + Ap[0]) / 2 - 22, (A[1] + Ap[1]) / 2, T('2')); lab(rt.d, (B[0] + Ap[0]) / 2 + 22, (B[1] + Ap[1]) / 2, T('2'));
    const base2 = lab(whole.d, M[0], y0 + 22, T('2'));
    const b1 = hide(lab(lf.d, (A[0] + M[0]) / 2, y0 + 22, T('1'), 'u3l4-big')), b2 = hide(lab(rt.d, (B[0] + M[0]) / 2, y0 + 22, T('1'), 'u3l4-big'));
    const arcAt = (hh, V, P1, P2, r, color) => cornerArc(hh.s, V, P1, P2, r, color);
    const s60 = [arcAt(lf, A, B, Ap, 40, C30), arcAt(rt, B, Ap, A, 40, C30), arcAt(whole, Ap, A, B, 40, C30)];
    const t60 = [lab(lf.d, A[0] + 58, A[1] - 22, T('60^\\circ'), 'u3l4-ang30'), lab(rt.d, B[0] - 58, B[1] - 22, T('60^\\circ'), 'u3l4-ang30'), lab(whole.d, Ap[0], Ap[1] + 62, T('60^\\circ'), 'u3l4-ang30')];
    [...s60, ...t60].forEach(hide);
    const s30 = [arcAt(lf, Ap, A, M, 52, RF), arcAt(rt, Ap, M, B, 52, RF)];
    const t30 = [lab(lf.d, Ap[0] - 17, Ap[1] + 76, T('30^\\circ'), 'u3l4-ang30r'), lab(rt.d, Ap[0] + 17, Ap[1] + 76, T('30^\\circ'), 'u3l4-ang30r')];
    [...s30, ...t30].forEach(hide);
    const cutG = svgEl('g', { class: 'bk-curve' }, whole.s); svgEl('path', { class: 'bk-stroke', d: `M${Ap[0]} ${Ap[1]} L${M[0]} ${M[1]}`, stroke: BR, 'stroke-width': 3.5, 'stroke-dasharray': '10 7', fill: 'none' }, cutG); hide(cutG);
    const rmk = [svgEl('g', {}, lf.s), svgEl('g', {}, rt.s)]; rightMark(rmk[0], M, A, Ap, 15, { color: INK }); rightMark(rmk[1], M, B, Ap, 15, { color: INK }); rmk.forEach(hide);
    const hL = hide(lab(lf.d, M[0] - 18, (M[1] + Ap[1]) / 2 + 30, T('h'), 'u3l4-big u3l4-cbr'));
    const hR = hide(lab(lf.d, M[0] - 26, (M[1] + Ap[1]) / 2 + 30, T('\\sqrt{3}'), 'u3l4-big u3l4-cbr'));
    const l1 = lineIn(P, `Hypotenuse ${T('2')}, shortest side ${T('1')}. Angles ${T('30^\\circ,\\ 60^\\circ,\\ 90^\\circ')}`);
    const l2 = lineIn(P, T('h^2=2^2-1^2=3'), 'u3l4-big');
    const l3 = lineIn(P, `${T('h=\\sqrt{3}')} <span class="muted">(about 1.73)</span>`, 'u3l4-big');
    const l4 = lineIn(P, `<div class="u3l4-tribadge u3l4-tb30">${T('1,\\ \\ \\sqrt{3},\\ \\ 2')}</div><div class="u3l4-small"><b class="u3l4-pair1">1</b> opposite <b class="u3l4-pair1">30°</b> · <b class="u3l4-pair2">√3</b> opposite <b class="u3l4-pair2">60°</b> · <b>2</b> is the hypotenuse</div>`);
    return [
      { cap: 'An <b>equilateral</b> triangle with side 2: all three angles are <b>60°</b>.', run: async (c) => { for (const e of [...s60, ...t60]) show(c, e); await sleep(c, 400); } },
      { cap: 'Cut it with an <b>altitude</b>: straight down from the top, at 90° to the base.', run: async (c) => { cutG.style.opacity = 1; await drawIn(cutG, 700, c); rmk.forEach((e) => show(c, e)); await sleep(c, 300); } },
      { cap: 'The cut halves the base (<b>1</b> and <b>1</b>) and the top angle (<b>30°</b> and <b>30°</b>).', run: async (c) => { dim(c, base2, 0); dim(c, s60[2], 0); await dim(c, t60[2], 0); [b1, b2, ...s30, ...t30].forEach((e) => show(c, e)); await sleep(c, 400); } },
      { cap: 'Pull the halves apart: two copies of a <b>30-60-90</b> triangle.', run: async (c) => { await dim(c, cutG, 0); await anim(c, rt.box, [{ transform: 'translate(96px, 0)', opacity: 0.4 }], 700); await show(c, l1); } },
      { cap: `Hypotenuse 2, bottom 1. Pythagoras: ${T('h^2=2^2-1^2=3')}.`, run: async (c) => { await show(c, hL); await show(c, l2); } },
      { cap: `${T('h=\\sqrt{3}')}: the sides are ${T('1,\\ \\sqrt{3},\\ 2')}.`, run: async (c) => { await dim(c, hL, 0); await pop(c, hR); await show(c, l3); } },
      { cap: 'The <b>shortest side (1) is opposite the smallest angle (30°)</b>, √3 is opposite 60°, and 2 is the hypotenuse.', run: async (c) => { b1.classList.add('u3l4-pair1'); t30[0].classList.add('u3l4-pair1'); hR.classList.add('u3l4-pair2'); t60[0].classList.add('u3l4-pair2'); await pop(c, l4); await Promise.all([pulse(c, b1, 1.3), pulse(c, t30[0], 1.3)]); } }
    ];
  }
};

/* =============================== explainer: read the ratios =============================== */
const RD = {
  r45: { base: 1, rise: 1, sides: { a: '1', b: '1', c: '\\sqrt{2}' }, at: 'A', ang: 45, opp: '1', adj: '1', hyp: '\\sqrt{2}', col: C45 },
  r30: { base: S3, rise: 1, sides: { a: '1', b: '\\sqrt{3}', c: '2' }, at: 'A', ang: 30, opp: '1', adj: '\\sqrt{3}', hyp: '2', col: C30 },
  r60: { base: S3, rise: 1, sides: { a: '1', b: '\\sqrt{3}', c: '2' }, at: 'B', ang: 60, opp: '\\sqrt{3}', adj: '1', hyp: '2', col: C30 }
};
const read = {
  title: 'Read the ratios off the triangle',
  height: 420, minW: 900,
  choices: [{ v: 'r45', label: '45°' }, { v: 'r30', label: '30°' }, { v: 'r60', label: '60°' }, { sep: 'Check:' }, { v: 'ex1', label: 'Example 1 check' }],
  ask: (v) => (v === 'ex1' ? 'Example 1: find d and h, then the ratios of 45°, 30° and 60°.' : `What are the exact values of sin, cos and tan of ${RD[v].ang}°?`),
  make(stage, v, ex) {
    if (v === 'ex1') return readEx1(stage, ex);
    const d = RD[v], W = ex.W;
    const tri = new RightTriangle(stage, { x: 10, y: 20, width: 470, height: 380, base: d.base, rise: d.rise, right: 'bl', names: { right: 'C', base: 'A', top: 'B' }, sides: d.sides, angles: {}, pad: 64 });
    tri.angle(d.at, D(d.ang), { color: 'amber', r: 40 });
    const oth = d.at === 'A' ? 'B' : 'A'; tri.angle(oth, D(90 - d.ang), { color: GRAY, r: 30 });
    const P = panel(stage, 510, 20, W - 526, 380, `The ratios of ${d.ang}°`);
    const f = (t) => `\\dfrac{\\text{${t}}}{\\text{hyp}}`;
    const lS = lineIn(P, T(`\\sin ${D(d.ang)}=${f('opp')}=\\dfrac{${d.opp}}{${d.hyp}}`), 'u3l4-big');
    const lC = lineIn(P, T(`\\cos ${D(d.ang)}=${f('adj')}=\\dfrac{${d.adj}}{${d.hyp}}`), 'u3l4-big');
    const lT = lineIn(P, T(`\\tan ${D(d.ang)}=\\dfrac{\\text{opp}}{\\text{adj}}=\\dfrac{${d.opp}}{${d.adj}}`), 'u3l4-big');
    const steps = [{ cap: `Stand at the <b>${d.ang}°</b> angle and name the sides: opposite, adjacent, hypotenuse.`, run: (c) => tri.highlight(c, d.at, { long: true }) }];
    if (v === 'r45') {
      const lR = lineIn(P, `Rationalize: ${T('\\dfrac{1}{\\sqrt{2}}\\cdot\\dfrac{\\sqrt{2}}{\\sqrt{2}}=\\dfrac{\\sqrt{2}}{2}')}`, 'u3l4-line-key');
      const lA = lineIn(P, `${T('\\sin 45^\\circ=\\cos 45^\\circ=\\dfrac{\\sqrt{2}}{2}')}, &nbsp;${T('\\tan 45^\\circ=1')}`, 'u3l4-line-ans');
      steps.push(
        { cap: `${T('\\sin 45^\\circ=\\dfrac{\\text{opp}}{\\text{hyp}}=\\dfrac{1}{\\sqrt{2}}')}.`, run: (c) => show(c, lS) },
        { cap: `${T('\\cos 45^\\circ=\\dfrac{1}{\\sqrt{2}}')} too: the two legs are equal.`, run: (c) => show(c, lC) },
        { cap: `${T('\\tan 45^\\circ=\\dfrac{1}{1}=1')}.`, run: (c) => show(c, lT) },
        { cap: `Rationalize ${T('\\dfrac{1}{\\sqrt{2}}')}: multiply the top and the bottom by ${T('\\sqrt{2}')}.`, run: (c) => show(c, lR) },
        { cap: `${T('\\sin 45^\\circ=\\cos 45^\\circ=\\dfrac{\\sqrt{2}}{2}')} and ${T('\\tan 45^\\circ=1')}.`, run: (c) => pop(c, lA) });
    } else if (v === 'r30') {
      const lR = lineIn(P, `Rationalize: ${T('\\dfrac{1}{\\sqrt{3}}\\cdot\\dfrac{\\sqrt{3}}{\\sqrt{3}}=\\dfrac{\\sqrt{3}}{3}')}`, 'u3l4-line-key');
      const lA = lineIn(P, `${T('\\sin 30^\\circ=\\dfrac{1}{2}')}, ${T('\\cos 30^\\circ=\\dfrac{\\sqrt{3}}{2}')}, ${T('\\tan 30^\\circ=\\dfrac{\\sqrt{3}}{3}')}`, 'u3l4-line-ans');
      steps.push(
        { cap: `${T('\\sin 30^\\circ=\\dfrac{1}{2}')}: the side opposite 30° is the short one.`, run: (c) => show(c, lS) },
        { cap: `${T('\\cos 30^\\circ=\\dfrac{\\sqrt{3}}{2}')}.`, run: (c) => show(c, lC) },
        { cap: `${T('\\tan 30^\\circ=\\dfrac{1}{\\sqrt{3}}')}.`, run: (c) => show(c, lT) },
        { cap: `Rationalize: multiply the top and the bottom by ${T('\\sqrt{3}')}.`, run: (c) => show(c, lR) },
        { cap: `${T('\\sin 30^\\circ=\\dfrac{1}{2},\\ \\cos 30^\\circ=\\dfrac{\\sqrt{3}}{2},\\ \\tan 30^\\circ=\\dfrac{\\sqrt{3}}{3}')}.`, run: (c) => pop(c, lA) });
    } else {
      const lR = lineIn(P, `${T('\\tan 60^\\circ=\\dfrac{\\sqrt{3}}{1}=\\sqrt{3}')}: nothing to rationalize.`, 'u3l4-line-key');
      const lA = lineIn(P, `Same triangle, other corner: opposite and adjacent <b>swap</b>, so ${T('\\sin 60^\\circ=\\cos 30^\\circ')} and ${T('\\cos 60^\\circ=\\sin 30^\\circ')}.`, 'u3l4-line-ans');
      steps.push(
        { cap: `${T('\\sin 60^\\circ=\\dfrac{\\sqrt{3}}{2}')}: now the long leg is opposite.`, run: (c) => show(c, lS) },
        { cap: `${T('\\cos 60^\\circ=\\dfrac{1}{2}')}.`, run: (c) => show(c, lC) },
        { cap: `${T('\\tan 60^\\circ=\\dfrac{\\sqrt{3}}{1}=\\sqrt{3}')}.`, run: async (c) => { await show(c, lT); await show(c, lR); } },
        { cap: `From the 60° corner, the side that was opposite 30° is now adjacent: ${T('\\sin 60^\\circ=\\cos 30^\\circ')}.`, run: (c) => pop(c, lA) });
    }
    return steps;
  }
};
function readEx1(stage, ex) {
  const W = ex.W;
  const t1 = new RightTriangle(stage, { x: 0, y: 4, width: 300, height: 200, base: 1, rise: 1, right: 'bl', names: { right: 'C', base: 'A', top: 'B' }, sides: { a: '1', b: '1', c: 'd' }, pad: 42 });
  t1.angle('A', '45^\\circ', { color: C45, r: 30 });
  const t2 = new RightTriangle(stage, { x: 0, y: 214, width: 300, height: 200, base: S3, rise: 1, right: 'bl', names: { right: 'C', base: 'A', top: 'B' }, sides: { a: '1', b: 'h', c: '2' }, pad: 42 });
  t2.angle('A', '30^\\circ', { color: C30, r: 30 }); t2.angle('B', '60^\\circ', { color: C30, r: 26 });
  const pA = panel(stage, 312, 4, 300, 410, '(a) 45°', 'u3l4-p45'), pB = panel(stage, 626, 4, W - 640, 410, '(b) 30° and 60°', 'u3l4-p30');
  const a = [
    lineIn(pA, T('d^2=1^2+1^2=2')), lineIn(pA, T('d=\\sqrt{2}')),
    lineIn(pA, T('\\sin 45^\\circ=\\dfrac{1}{\\sqrt{2}}=\\dfrac{\\sqrt{2}}{2}')), lineIn(pA, T('\\cos 45^\\circ=\\dfrac{1}{\\sqrt{2}}=\\dfrac{\\sqrt{2}}{2}')), lineIn(pA, T('\\tan 45^\\circ=\\dfrac{1}{1}=1'))
  ];
  const b = [
    lineIn(pB, `${T('h^2=2^2-1^2=3')}, so ${T('h=\\sqrt{3}')}`),
    lineIn(pB, T('\\sin 30^\\circ=\\dfrac{1}{2}'), 'u3l4-ln-sm'), lineIn(pB, T('\\cos 30^\\circ=\\dfrac{\\sqrt{3}}{2}'), 'u3l4-ln-sm'), lineIn(pB, T('\\tan 30^\\circ=\\dfrac{1}{\\sqrt{3}}=\\dfrac{\\sqrt{3}}{3}'), 'u3l4-ln-sm'),
    lineIn(pB, T('\\sin 60^\\circ=\\dfrac{\\sqrt{3}}{2}'), 'u3l4-ln-sm'), lineIn(pB, T('\\cos 60^\\circ=\\dfrac{1}{2}'), 'u3l4-ln-sm'), lineIn(pB, T('\\tan 60^\\circ=\\dfrac{\\sqrt{3}}{1}=\\sqrt{3}'), 'u3l4-ln-sm')
  ];
  const all = (c, arr) => { arr.forEach((e, i) => fadeIn(c, e, 320, { delay: i * 160 })); return sleep(c, arr.length * 160 + 360); };
  return [
    { cap: `(a) ${T('d^2=1^2+1^2=2')}, so ${T('d=\\sqrt{2}')}.`, run: (c) => all(c, a.slice(0, 2)) },
    { cap: `(a) The ratios of 45°, rationalized: ${T('\\dfrac{\\sqrt{2}}{2}')}, ${T('\\dfrac{\\sqrt{2}}{2}')}, ${T('1')}.`, run: async (c) => { await t1.highlight(c, 'A'); await all(c, a.slice(2)); } },
    { cap: `(b) ${T('h^2=2^2-1^2=3')}, so ${T('h=\\sqrt{3}')}.`, run: (c) => all(c, b.slice(0, 1)) },
    { cap: '(b) From the 30° corner: 1 is opposite, h is adjacent.', run: async (c) => { await t2.highlight(c, 'A'); await all(c, b.slice(1, 4)); } },
    { cap: '(b) From the 60° corner they swap.', run: async (c) => { await t2.highlight(c, 'B'); await all(c, b.slice(4)); } }
  ];
}

/* =============================== explainer: the unit circle =============================== */
const UROWS = [
  { a: 0, pt: '(1,\\ 0)', cos: '1', sin: '0' },
  { a: 30, pt: '\\left(\\tfrac{\\sqrt{3}}{2},\\ \\tfrac{1}{2}\\right)', cos: '\\tfrac{\\sqrt{3}}{2}', sin: '\\tfrac{1}{2}' },
  { a: 45, pt: '\\left(\\tfrac{\\sqrt{2}}{2},\\ \\tfrac{\\sqrt{2}}{2}\\right)', cos: '\\tfrac{\\sqrt{2}}{2}', sin: '\\tfrac{\\sqrt{2}}{2}' },
  { a: 60, pt: '\\left(\\tfrac{1}{2},\\ \\tfrac{\\sqrt{3}}{2}\\right)', cos: '\\tfrac{1}{2}', sin: '\\tfrac{\\sqrt{3}}{2}' },
  { a: 90, pt: '(0,\\ 1)', cos: '0', sin: '1' }
];
const UTAN = { 0: '0', 30: '\\tfrac{\\sqrt{3}}{3}', 45: '1', 60: '\\sqrt{3}', 90: '\\text{undefined}' };
const unit = {
  title: 'Shrink the triangles onto a circle of radius 1',
  height: 430, minW: 900,
  choices: [{ v: 'shrink', label: 'Shrink the triangles' }, { v: 'sweep', label: 'Sweep 0° → 90°' }],
  ask: (v) => (v === 'shrink' ? 'Where does each triangle’s corner land when its hypotenuse is 1?' : 'What happens to sin θ, cos θ and tan θ as θ grows from 0° to 90°?'),
  make(stage, v, ex) {
    const W = ex.W, G = new Graph(stage, { x: 4, y: 4, width: 424, height: 424, xmin: -0.12, xmax: 1.84, ymin: -0.12, ymax: 1.84, xstep: 0.25, ystep: 0.25, numbers: false, pad: [28, 28, 18, 18] });
    G.label(1, 0, '1', { cls: 'u3l4-ax1', pos: 'se', gap: 3 }); G.label(0, 1, '1', { cls: 'u3l4-ax1', pos: 'w', gap: 6 });
    const circ = svgEl('path', { d: pd(arcPts(G, G.ux, 0, 90)), fill: 'none', stroke: '#6b7280', 'stroke-width': 2.4 }, G.layers.data);
    void circ; G.label(1.3, 1.28, 'radius 1', { cls: 'u3l4-r1', pos: 'c' });
    // table panel
    const P = panel(stage, 446, 4, W - 460, 420, '');
    const tb = h('table', 'u3l4-utab'); P.appendChild(tb);
    tb.innerHTML = `<tr><th>${T('\\theta')}</th><th>point</th><th>${T('\\cos\\theta')}</th><th>${T('\\sin\\theta')}</th>${v === 'sweep' ? `<th>${T('\\tan\\theta')}</th>` : ''}</tr>` +
      UROWS.map((r) => `<tr data-a="${r.a}"><td>${T(D(r.a))}</td><td class="u3l4-up">${T(r.pt)}</td><td class="u3l4-uc">${T(r.cos)}</td><td class="u3l4-us">${T(r.sin)}</td>${v === 'sweep' ? `<td class="u3l4-ut">${T(UTAN[r.a])}</td>` : ''}</tr>`).join('');
    const row = (a) => tb.querySelector(`tr[data-a="${a}"]`);
    const cells = (a) => [...row(a).querySelectorAll('td:not(:first-child)')];
    if (v === 'shrink') {
      UROWS.forEach((r) => cells(r.a).forEach(hide));
      const fillRow = (c, a) => Promise.all(cells(a).map((e, i) => fadeIn(c, e, 300, { delay: i * 120 })));
      const tri30 = mkTri(G, { fill: C30, fo: 0.18, leg: C30, hyp: C30, labels: { x: T('\\sqrt{3}'), y: T('1'), r: T('2') }, x: S3, y: 1 });
      const tri45 = mkTri(G, { fill: C45, fo: 0.18, leg: C45, hyp: C45, labels: { x: T('1'), y: T('1'), r: T('\\sqrt{2}') }, x: 1, y: 1 });
      const tri60 = mkTri(G, { fill: C30, fo: 0.18, leg: C30, hyp: C30, labels: { x: T('\\tfrac{1}{2}'), y: T('\\tfrac{\\sqrt{3}}{2}'), r: T('1') }, x: 0.5, y: S3 / 2 });
      [tri30, tri45, tri60].forEach((t) => t.fade(null, 0));
      const pts = {}; UROWS.forEach((r) => { pts[r.a] = G.point(cosd(r.a), sind(r.a), { color: r.a === 45 ? C45 : r.a % 90 ? C30 : INK, r: 6 }); hide(pts[r.a]); });
      const shrink = (c, t, X, Y, k, labels) => tween(c, 900, (s) => { const f = 1 + (k - 1) * s; t.set(X * f, Y * f); }).then(() => { Object.keys(labels).forEach((key) => { t.labs[key].innerHTML = labels[key]; }); t.set(X * k, Y * k); });
      return [
        { cap: 'The 30-60-90 triangle, hypotenuse 2, with its <b>30°</b> angle at the origin.', run: (c) => tri30.fade(c, 1) },
        { cap: 'Divide every side by <b>2</b>: the hypotenuse becomes <b>1</b>.', run: (c) => shrink(c, tri30, S3, 1, 0.5, { x: T('\\tfrac{\\sqrt{3}}{2}'), y: T('\\tfrac{1}{2}'), r: T('1') }) },
        { cap: `The corner lands on the circle at ${T('\\left(\\tfrac{\\sqrt{3}}{2},\\ \\tfrac{1}{2}\\right)')}: that is ${T('(\\cos 30^\\circ,\\ \\sin 30^\\circ)')}.`, run: async (c) => { await pop(c, pts[30]); await fillRow(c, 30); } },
        { cap: `The 45-45-90 triangle ${T('(1,\\ 1,\\ \\sqrt{2})')} divided by ${T('\\sqrt{2}')}: corner at ${T('\\left(\\tfrac{\\sqrt{2}}{2},\\ \\tfrac{\\sqrt{2}}{2}\\right)')}.`, run: async (c) => { await tri30.fade(c, 0.25, 0); await tri45.fade(c, 1); await shrink(c, tri45, 1, 1, 1 / S2, { x: T('\\tfrac{\\sqrt{2}}{2}'), y: T('\\tfrac{\\sqrt{2}}{2}'), r: T('1') }); await pop(c, pts[45]); await fillRow(c, 45); } },
        { cap: `The 30-60-90 triangle turned round (60° at the origin): corner at ${T('\\left(\\tfrac{1}{2},\\ \\tfrac{\\sqrt{3}}{2}\\right)')}.`, run: async (c) => { await tri45.fade(c, 0.25, 0); await tri60.fade(c, 1); await pop(c, pts[60]); await fillRow(c, 60); } },
        { cap: `0° and 90° are on the axes: the points ${T('(1,\\ 0)')} and ${T('(0,\\ 1)')}.`, run: async (c) => { await tri60.fade(c, 0.25, 0); pop(c, pts[0]); await pop(c, pts[90]); await fillRow(c, 0); await fillRow(c, 90); } },
        { cap: `On this circle ${T('r=1')}, so ${T('\\cos\\theta=x')} and ${T('\\sin\\theta=y')}: <b>across</b> and <b>up</b>.`, run: async (c) => { tb.classList.add('u3l4-hlcols'); await pulse(c, tb, 1.02); } }
      ];
    }
    // sweep
    tb.classList.add('u3l4-hlcols');
    UROWS.forEach((r) => { cells(r.a).forEach(hide); });
    const arm = mkArm(G, { x: 1, y: 0 }), arc = mkArc(G, { r: 40, color: BR, label: T('\\theta'), lr: 60 });
    const up = svgEl('path', { fill: 'none', stroke: C45, 'stroke-width': 6, 'stroke-linecap': 'round' }, G.layers.data);
    const acr = svgEl('path', { fill: 'none', stroke: POS, 'stroke-width': 6, 'stroke-linecap': 'round' }, G.layers.data);
    let upL = null;
    const setB = (a) => { const [x0, y0] = G.toPx(0, 0), [x1, y1] = G.toPx(cosd(a), sind(a)); up.setAttribute('d', `M${x1} ${y0} L${x1} ${y1}`); acr.setAttribute('d', `M${x0} ${y0 + 0.5} L${x1} ${y0 + 0.5}`); if (upL) G.moveTo(upL, cosd(a) + 0.02, Math.max(0.12, sind(a) / 2)); };
    let cur = 0;
    const go = (c, a) => { const a0 = cur; cur = a; return tween(c, 900, (t) => { const b = a0 + (a - a0) * t; arm.set(cosd(b), sind(b)); arc.set(0, b); setB(b); }); };
    const fill = (c, a) => Promise.all(cells(a).map((e, i) => fadeIn(c, e, 300, { delay: i * 100 })));
    G.label(0.5, -0.06, '<b>across</b> = cos', { cls: 'u3l4-blab u3l4-bgreen' });
    upL = G.label(1.02, 0.5, '<b>up</b> = sin', { cls: 'u3l4-blab u3l4-bblue', pos: 'e' }); hide(upL); setB(0);
    return [
      { cap: `0°: the point ${T('(1,\\ 0)')}. Up ${T('\\sin 0^\\circ=0')}, across ${T('\\cos 0^\\circ=1')}, ${T('\\tan 0^\\circ=0')}.`, run: (c) => fill(c, 0) },
      { cap: `Turn to 30°: up grows to ${T('\\tfrac{1}{2}')}, across shrinks to ${T('\\tfrac{\\sqrt{3}}{2}')}.`, run: async (c) => { await go(c, 30); show(c, upL); await fill(c, 30); } },
      { cap: `45°: up and across are <b>equal</b>, ${T('\\tfrac{\\sqrt{2}}{2}')} each, so ${T('\\tan 45^\\circ=1')}.`, run: async (c) => { await go(c, 45); await fill(c, 45); } },
      { cap: `60°: up ${T('\\tfrac{\\sqrt{3}}{2}')}, across ${T('\\tfrac{1}{2}')}. ${T('\\tan 60^\\circ=\\sqrt{3}')}: steeper and steeper.`, run: async (c) => { await go(c, 60); await fill(c, 60); } },
      { cap: `90°: up 1, across 0. ${T('\\tan 90^\\circ=\\tfrac{1}{0}')} is <b>undefined</b>.`, run: async (c) => { await go(c, 90); await fill(c, 90); } },
      { cap: '<b>sin θ increases</b> from 0 to 1, <b>cos θ decreases</b> from 1 to 0, and tan θ grows with no largest value.', run: (c) => pulse(c, tb, 1.02) }
    ];
  }
};

/* =============================== explainer: patterns in the table =============================== */
const COLS = [0, 30, 45, 60, 90];
const SINR = ['\\dfrac{\\sqrt{0}}{2}', '\\dfrac{\\sqrt{1}}{2}', '\\dfrac{\\sqrt{2}}{2}', '\\dfrac{\\sqrt{3}}{2}', '\\dfrac{\\sqrt{4}}{2}'];
const SINV = ['0', '\\dfrac{1}{2}', '\\dfrac{\\sqrt{2}}{2}', '\\dfrac{\\sqrt{3}}{2}', '1'];
const COSV = SINV.slice().reverse();
const TANV = ['0', '\\dfrac{\\sqrt{3}}{3}', '1', '\\sqrt{3}', '\\text{undefined}'];
const TANW = [
  '\\dfrac{0}{1}=0',
  '\\dfrac{\\tfrac{1}{2}}{\\tfrac{\\sqrt{3}}{2}}=\\dfrac{1}{\\sqrt{3}}=\\dfrac{\\sqrt{3}}{3}',
  '\\dfrac{\\tfrac{\\sqrt{2}}{2}}{\\tfrac{\\sqrt{2}}{2}}=1',
  '\\dfrac{\\tfrac{\\sqrt{3}}{2}}{\\tfrac{1}{2}}=\\sqrt{3}',
  '\\dfrac{1}{0}\\ \\text{is undefined}'
];
const patterns = {
  title: 'Patterns in the table',
  height: 420, minW: 900,
  choices: [{ v: 'sin', label: 'Sines: √0 to √4 over 2' }, { v: 'cos', label: 'Cosines: reversed' }, { v: 'tan', label: 'tan = sin ÷ cos' }, { sep: 'Check:' }, { v: 'ex2', label: 'Example 2 check' }],
  ask: (v) => ({ sin: 'Is there a pattern in the sines of 0°, 30°, 45°, 60°, 90°?', cos: 'How are the cosines related to the sines?', tan: 'How do you get the tangents from the sines and cosines?', ex2: 'Example 2: complete the table of exact values.' }[v]),
  make(stage, v, ex) {
    const W = ex.W, cw = 150, lw = 130, tw = lw + 5 * cw, x0 = Math.max(0, (W - tw) / 2);
    const tb = div(stage, 'u3l4-ptab', '', x0, 6, tw);
    tb.style.gridTemplateColumns = `${lw}px repeat(5, ${cw}px)`;
    const C = {}; const cell = (r, j, html, cls = '') => { const d = h('div', 'u3l4-pc ' + cls, html); tb.appendChild(d); C[r + j] = d; return d; };
    cell('h', 'x', T('\\theta'), 'u3l4-ph0'); COLS.forEach((a, j) => cell('h', j, T(D(a)), 'u3l4-ph0'));
    ['sin', 'cos', 'tan'].forEach((r) => { cell(r, 'x', T(`\\${r}\\theta`), 'u3l4-pr0'); COLS.forEach((a, j) => cell(r, j, '<span class="u3l4-pv"></span>')); });
    const setV = (r, j, t) => { C[r + j].firstChild.innerHTML = T(t); };
    const vIn = (c, r, j, t, delay = 0) => { setV(r, j, t); return fadeIn(c, C[r + j].firstChild, 320, { delay }); };
    const ov = svgEl('svg', { class: 'u3l4-ov', width: W, height: 420 }, stage);
    const arrow = (r, dir, color, text) => {
      const y = 396, xa = x0 + lw + 20, xb = x0 + tw - 20, g = svgEl('g', { class: 'bk-curve' }, ov); g.style.color = color;
      svgEl('path', { class: 'bk-stroke', d: dir > 0 ? `M${xa} ${y} L${xb} ${y}` : `M${xb} ${y} L${xa} ${y}`, stroke: color, 'stroke-width': 3, fill: 'none' }, g);
      arrowHead(g, dir > 0 ? xb : xa, y, dir, 0, { color, width: 3 });
      const t = div(stage, 'u3l4-arrlab', text, x0 + lw + 2.5 * cw, y - 18); t.style.translate = '-50% -50%'; t.style.color = color; hide(g); hide(t);
      return { g, t, run: async (c) => { g.style.opacity = 1; await drawIn(g, 700, c); await show(c, t); } };
    };
    const work = div(stage, 'u3l4-pwork', '', x0, 318, tw, 58); hide(work);
    const fillRow = (c, r, vals) => Promise.all(vals.map((t, j) => vIn(c, r, j, t, j * 140)));
    const pre = (r, vals) => vals.forEach((t, j) => setV(r, j, t));
    if (v === 'sin') {
      const up = arrow('sin', 1, POS, 'increasing: 0 → 1');
      work.innerHTML = `${T('\\sqrt{0}=0,\\quad \\sqrt{1}=1,\\quad \\sqrt{4}=2')}`;
      return [
        { cap: `Count under the root: ${T('\\sqrt{0},\\ \\sqrt{1},\\ \\sqrt{2},\\ \\sqrt{3},\\ \\sqrt{4}')}, all over 2.`, run: (c) => fillRow(c, 'sin', SINR) },
        { cap: `Simplify the roots you know: ${T('\\sqrt{0}=0')}, ${T('\\sqrt{1}=1')}, ${T('\\sqrt{4}=2')}.`, run: async (c) => { await show(c, work); for (const j of [0, 1, 4]) { C['sin' + j].classList.add('u3l4-hit'); await vIn(c, 'sin', j, SINV[j]); } } },
        { cap: `The sines: ${T('0,\\ \\tfrac{1}{2},\\ \\tfrac{\\sqrt{2}}{2},\\ \\tfrac{\\sqrt{3}}{2},\\ 1')}. They <b>increase</b> from 0 to 1.`, run: (c) => up.run(c) }
      ];
    }
    if (v === 'cos') {
      pre('sin', SINV);
      const dn = arrow('cos', -1, NEG, 'decreasing: 1 → 0');
      return [
        { cap: 'The cosines are the <b>same list, backwards</b>: the last sine is the first cosine.', run: async (c) => { for (let j = 0; j < 5; j++) { C['sin' + (4 - j)].classList.add('u3l4-hit'); await vIn(c, 'cos', j, COSV[j]); await sleep(c, 120); C['sin' + (4 - j)].classList.remove('u3l4-hit'); } } },
        { cap: 'So the cosines <b>decrease</b> from 1 to 0.', run: (c) => dn.run(c) },
        { cap: `${T('\\sin 30^\\circ=\\cos 60^\\circ')} and ${T('\\sin 60^\\circ=\\cos 30^\\circ')}: 30° and 60° are the two corners of the <b>same triangle</b>.`, run: async (c) => { ['sin1', 'cos3'].forEach((k) => C[k].classList.add('u3l4-pairA')); ['sin3', 'cos1'].forEach((k) => C[k].classList.add('u3l4-pairB')); await pulse(c, tb, 1.02); } }
      ];
    }
    if (v === 'tan') {
      pre('sin', SINV); pre('cos', COSV);
      const st = (j) => ({
        cap: j === 4 ? `${T('\\tan 90^\\circ=\\dfrac{1}{0}')}: we can’t divide by 0, so it is <b>undefined</b>.` : j === 1 ? `${T('\\tan 30^\\circ=\\dfrac{1}{\\sqrt{3}}')}: the 2s cancel. Rationalize: ${T('\\dfrac{\\sqrt{3}}{3}')}.` : j === 0 ? `${T('\\tan\\theta=\\dfrac{\\sin\\theta}{\\cos\\theta}')}. At 0°: ${T('\\dfrac{0}{1}=0')}.` : `${T(`\\tan ${D(COLS[j])}=${TANW[j]}`)}${j === 2 ? ': a number divided by itself.' : ': the 2s cancel.'}`,
        run: async (c) => {
          tb.querySelectorAll('.u3l4-hit').forEach((e) => e.classList.remove('u3l4-hit'));
          C['sin' + j].classList.add('u3l4-hit'); C['cos' + j].classList.add('u3l4-hit');
          work.innerHTML = T(`\\tan ${D(COLS[j])}=\\dfrac{\\sin ${D(COLS[j])}}{\\cos ${D(COLS[j])}}=${TANW[j]}`); work.style.opacity = 1; await fadeIn(c, work.firstChild, 300);
          await vIn(c, 'tan', j, TANV[j]); if (j === 4) C.tan4.classList.add('u3l4-undef');
        }
      });
      return [0, 1, 2, 3, 4].map(st);
    }
    // ex2
    return [
      { cap: `Sines: ${T('\\tfrac{\\sqrt{0}}{2},\\ \\tfrac{\\sqrt{1}}{2},\\ \\tfrac{\\sqrt{2}}{2},\\ \\tfrac{\\sqrt{3}}{2},\\ \\tfrac{\\sqrt{4}}{2}')}, simplified.`, run: (c) => fillRow(c, 'sin', SINV) },
      { cap: 'Cosines: the same list, backwards.', run: (c) => fillRow(c, 'cos', COSV) },
      { cap: `Tangents: sin ÷ cos, rationalized. ${T('\\tan 90^\\circ')} is undefined.`, run: async (c) => { await fillRow(c, 'tan', TANV); C.tan4.classList.add('u3l4-undef'); } },
      { cap: 'Know it from memory: rebuild it from the patterns or the two triangles whenever you need it.', run: async (c) => { work.innerHTML = `<div class="u3l4-tribadge u3l4-tb45">${T('1,\\ 1,\\ \\sqrt{2}')}</div><div class="u3l4-tribadge u3l4-tb30">${T('1,\\ \\sqrt{3},\\ 2')}</div>`; await show(c, work); } }
    ];
  }
};

/* =============================== explainer: one triangle, four quadrants (STAR) =============================== */
const FL = {
  f30: { r: 30, a: S3, b: 1, R: 2.6, xs: '\\sqrt{3}', ys: '1', rs: '2', col: C30, pt: (sx, sy) => `(${sx < 0 ? '-' : ''}\\sqrt{3},\\ ${sy < 0 ? '-' : ''}1)`, v: { sin: '\\tfrac{1}{2}', cos: '\\tfrac{\\sqrt{3}}{2}', tan: '\\tfrac{\\sqrt{3}}{3}' } },
  f45: { r: 45, a: 1, b: 1, R: 1.85, xs: '1', ys: '1', rs: '\\sqrt{2}', col: C45, pt: (sx, sy) => `(${sx < 0 ? '-' : ''}1,\\ ${sy < 0 ? '-' : ''}1)`, v: { sin: '\\tfrac{\\sqrt{2}}{2}', cos: '\\tfrac{\\sqrt{2}}{2}', tan: '1' } },
  f60: { r: 60, a: 1, b: S3, R: 2.6, xs: '1', ys: '\\sqrt{3}', rs: '2', col: C30, pt: (sx, sy) => `(${sx < 0 ? '-' : ''}1,\\ ${sy < 0 ? '-' : ''}\\sqrt{3})`, v: { sin: '\\tfrac{\\sqrt{3}}{2}', cos: '\\tfrac{1}{2}', tan: '\\sqrt{3}' } }
};
const QS = [[1, 1, 1], [2, -1, 1], [3, -1, -1], [4, 1, -1]];
const flip = {
  title: 'One triangle, four quadrants',
  height: 430, minW: 920,
  choices: [{ v: 'f30', label: '30° triangle' }, { v: 'f45', label: '45° triangle' }, { v: 'f60', label: '60° triangle' }],
  ask: (v) => `Flip the ${FL[v].r}° reference triangle into every quadrant. What changes, and what stays the same?`,
  make(stage, v, ex) {
    const d = FL[v], W = ex.W, G = qGraph(stage, 2, 2, 426, d.R, { step: v === 'f45' ? 0.5 : 1, labels: 1 });
    const P = panel(stage, 446, 2, W - 458, 426, '');
    const tb = h('table', 'u3l4-ftab'); P.appendChild(tb);
    tb.innerHTML = `<tr><th></th><th>${T('\\theta')}</th><th>${T('P(x,\\ y)')}</th><th>${T('\\sin\\theta')}</th><th>${T('\\cos\\theta')}</th><th>${T('\\tan\\theta')}</th></tr>` +
      QS.map(([q, sx, sy]) => {
        const th = angleIn(q, d.r), s = { sin: sy, cos: sx, tan: sx * sy };
        const val = (k) => `<td class="u3l4-fv ${s[k] > 0 ? 'u3l4-pos' : 'u3l4-neg'}">${T(sgnT(s[k], d.v[k]))}</td>`;
        return `<tr data-q="${q}"><td class="u3l4-fq">${ROMAN[q]}</td><td>${T(D(th))}</td><td>${T(d.pt(sx, sy))}</td>${val('sin')}${val('cos')}${val('tan')}</tr>`;
      }).join('');
    const rows = [...tb.querySelectorAll('tr[data-q]')]; rows.forEach(hide);
    const note = div(P, 'u3l4-fnote', `${T(`r=${d.rs}`)} in every quadrant (${T('r>0')}). ${T('\\sin\\theta=\\tfrac{y}{r}')}, ${T('\\cos\\theta=\\tfrac{x}{r}')}, ${T('\\tan\\theta=\\tfrac{y}{x}')}`); hide(note);
    const cast = mkCast(G, d.R, { small: true }); Object.values(cast).forEach(hide);
    const tris = {}, arms = {};
    const mk = (q, sx, sy) => {
      const t = mkTri(G, { fill: d.col, fo: 0.16, signs: true, hyp: BR, labels: { x: T((sx < 0 ? '-' : '') + d.xs), y: T((sy < 0 ? '-' : '') + d.ys), r: T(d.rs) }, x: sx * d.a, y: sy * d.b });
      t.fade(null, 0); tris[q] = t; return t;
    };
    QS.forEach(([q, sx, sy]) => mk(q, sx, sy));
    const rot = mkArc(G, { r: 30, color: BR, arrow: true, label: '', lr: 34, width: 2.6 }), ref = mkArc(G, { r: 52, color: RF, width: 3.5, label: T('\\theta_R'), lr: 74 });
    const thL = div(stage, 'u3l4-thbadge', '', 14, 14); hide(thL);
    const setAng = (q) => { const th = angleIn(q, d.r); rot.set(0, th); const a0 = [0, 0, th, 180, th][q], a1 = [0, th, 180, th, 360][q]; ref.set(a0, a1); thL.innerHTML = `${T(`\\theta=${D(th)}`)} &nbsp; ${T(`\\theta_R=${D(d.r)}`)}`; };
    setAng(1); hide(rot); hide(ref); if (ref.L) hide(ref.L);
    const flipTo = async (c, from, q, sx, sy) => {
      const [, fx, fy] = QS[from - 1], t = tris[q];
      Object.values(t.labs).forEach((l) => (l.style.opacity = 0));
      t.style.opacity = 1;
      await tween(c, 900, (s) => { const X = fx + (sx - fx) * s, Y = fy + (sy - fy) * s; t.set(X * d.a, Y * d.b); });
      t.set(sx * d.a, sy * d.b); await Promise.all(Object.values(t.labs).map((l) => fadeIn(c, l, 300)));
    };
    const caps = {
      1: `Quadrant I: ${T(`\\theta=${D(d.r)}`)}. The triangle gives ${T(`P${d.pt(1, 1)}`)} and ${T(`r=${d.rs}`)}.`,
      2: `<b>Flip</b> it over the y-axis into Quadrant II: ${T(`\\theta=${placeTex(2, d.r)}`)}. Now <b>x is negative</b>.`,
      3: `Flip it over the x-axis into Quadrant III: ${T(`\\theta=${placeTex(3, d.r)}`)}. Now <b>x and y are both negative</b>.`,
      4: `Flip it back over the y-axis into Quadrant IV: ${T(`\\theta=${placeTex(4, d.r)}`)}. Only <b>y is negative</b>.`
    };
    const step = (q, from) => ({
      cap: caps[q],
      run: async (c) => {
        if (q === 1) { await tris[1].fade(c, 1); await Promise.all([show(c, rot), show(c, ref), ref.L ? show(c, ref.L) : 0, show(c, thL)]); }
        else { await tris[from].fade(c, 0.45, 0); await flipTo(c, from, q, QS[q - 1][1], QS[q - 1][2]); setAng(q); await pop(c, thL); }
        await show(c, rows[q - 1]);
      }
    });
    return [
      step(1), step(2, 1), step(3, 2), step(4, 3),
      { cap: 'Same triangle, same side lengths, so the <b>same numbers</b> in every quadrant. Only the <b>signs</b> change.', run: async (c) => { Object.values(tris).forEach((t) => t.fade(c, 1, 0)); await show(c, note); await pulse(c, tb, 1.02); } },
      { cap: 'Which ratios are positive? <b>A</b>ll in I, <b>S</b>ine in II, <b>T</b>angent in III, <b>C</b>osine in IV: <b>CAST</b>.', run: async (c) => { [rot, ref].forEach((e) => dim(c, e, 0)); if (ref.L) dim(c, ref.L, 0); dim(c, thL, 0); for (const q of [1, 2, 3, 4]) await pop(c, cast[q]); tb.classList.add('u3l4-signs'); await sleep(c, 200); } }
    ];
  }
};

/* =============================== explainer: exact value in any quadrant (Example 3 check) =============================== */
const AQ = {
  a: { fn: 'sin', th: 240, ans: '-\\dfrac{\\sqrt{3}}{2}' },
  b: { fn: 'cos', th: 135, ans: '-\\dfrac{\\sqrt{2}}{2}' },
  c: { fn: 'tan', th: 330, ans: '-\\dfrac{\\sqrt{3}}{3}' },
  d: { fn: 'cos', th: 225, ans: '-\\dfrac{\\sqrt{2}}{2}' },
  e: { fn: 'sin', th: 180, quad: true, pt: [-1, 0], ptT: '(-1,\\ 0)', work: '\\sin 180^\\circ=\\dfrac{y}{r}=\\dfrac{0}{1}=0', ans: '0' },
  f: { fn: 'tan', th: 270, quad: true, pt: [0, -1], ptT: '(0,\\ -1)', work: '\\tan 270^\\circ=\\dfrac{y}{x}=\\dfrac{-1}{0}', ans: '\\text{undefined}' }
};
const anyq = {
  title: 'Quadrant, reference angle, table, sign',
  height: 430, minW: 920,
  choices: [{ sep: 'Example 3 check:' }, ...Object.keys(AQ).map((k) => ({ v: k, label: `(${k}) ` + T(`\\${AQ[k].fn} ${D(AQ[k].th)}`) }))],
  ask: (v) => `Example 3(${v}): determine the exact value of ${T(`\\${AQ[v].fn} ${D(AQ[v].th)}`)}.`,
  make(stage, v, ex) {
    const d = AQ[v], W = ex.W, R = 2.6, G = qGraph(stage, 2, 2, 426, R, { labels: 1 }), th = d.th, q = quadOf(th);
    const cast = mkCast(G, R, { small: true });
    const P = panel(stage, 446, 2, W - 458, 426, T(`\\${d.fn} ${D(th)}`), 'u3l4-pq');
    const arm = mkArm(G, { x: 2.2, y: 0 }), rot = mkArc(G, { r: 30, color: BR, arrow: true, width: 2.6, label: '', lr: 34 });
    if (d.quad) {
      const [px, py] = d.pt, len = 1;
      const pt = G.point(px, py, { color: INK, r: 7, label: T(d.ptT), pos: px < 0 ? 'nw' : 'se' }); hide(pt); if (pt.label) hide(pt.label);
      const l1 = lineIn(P, `${T(D(th))} is a <b>quadrantal angle</b>: the arm is on an axis.`);
      const l2 = lineIn(P, `Use the point ${T(d.ptT)} with ${T('r=1')}.`);
      const l3 = lineIn(P, T(d.work), 'u3l4-big');
      const l4 = lineIn(P, `${T(`\\${d.fn} ${D(th)}`)} ${d.ans === '0' ? T('=0') : 'is <b>undefined</b>: we can’t divide by 0.'}`, 'u3l4-line-ans');
      const stp = d.ans === '0' ? null : stamp(stage, 'undefined', { ok: false, x: 640, y: 330, rotate: -6 }); if (stp) hide(stp);
      return [
        { cap: `Rotate to ${T(D(th))} from the positive x-axis.`, run: async (c) => { await sweep(c, G, arm, rot, 0, th, len, 1000); await show(c, l1); } },
        { cap: `The arm lies on the axis: use the point ${T(d.ptT)}, ${T('r=1')}.`, run: async (c) => { await Promise.all([pop(c, pt), show(c, pt.label)]); await show(c, l2); } },
        { cap: `${T(d.work)}${d.ans === '0' ? '.' : ': division by 0.'}`, run: (c) => show(c, l3) },
        { cap: d.ans === '0' ? `${T('\\sin 180^\\circ=0')}.` : `${T('\\tan 270^\\circ')} is <b>undefined</b>.`, run: async (c) => { await pop(c, l4); if (stp) await stampIn(c, stp); } }
      ];
    }
    const r = refOf(th), r2 = 2, tri = mkTri(G, { fill: RF, fo: 0.16, signs: true, x: r2 * cosd(th), y: r2 * sind(th) }); tri.fade(null, 0);
    const ref = mkArc(G, { r: 52, color: RF, width: 3.5, label: T(D(r)), lr: 78 }); const a0 = [0, 0, th, 180, th][q], a1 = [0, th, 180, th, 360][q]; ref.set(a0, a1); hide(ref); hide(ref.L);
    const qr = quadRect(G, q, R, RF, 0.12); hide(qr);
    const sg = SIGN(d.fn, q), refT = [null, '', `180^\\circ-${D(th)}`, `${D(th)}-180^\\circ`, `360^\\circ-${D(th)}`][q];
    const l1 = lineIn(P, `<span class="u3l4-lk">1</span> Quadrant ${ROMAN[q]}`);
    const l2 = lineIn(P, `<span class="u3l4-lk">2</span> ${T(`\\theta_R=${refT}=${cR(D(r))}`)}`);
    const l3 = lineIn(P, `<span class="u3l4-lk">3</span> Table: ${T(`\\${d.fn} ${D(r)}=${TAB[d.fn][r]}`)}`);
    const l4 = lineIn(P, `<span class="u3l4-lk">4</span> CAST: ${d.fn} is <b class="${sg > 0 ? 'u3l4-tpos' : 'u3l4-tneg'}">${sg > 0 ? 'positive' : 'negative'}</b> in Quadrant ${ROMAN[q]}`);
    const l5 = lineIn(P, T(`\\${d.fn} ${D(th)}=${sg < 0 ? '-' : ''}\\${d.fn} ${D(r)}=${d.ans}`), 'u3l4-line-ans u3l4-big');
    return [
      { cap: `Rotate to ${T(D(th))}: it ends in <b>Quadrant ${ROMAN[q]}</b>.`, run: async (c) => { await sweep(c, G, arm, rot, 0, th, 2.2, 1000); await show(c, qr); await show(c, l1); } },
      { cap: `The reference angle goes to the nearest x-axis: ${T(`\\theta_R=${refT}=${D(r)}`)}.`, run: async (c) => { await Promise.all([show(c, ref), show(c, ref.L)]); await tri.fade(c, 1); await show(c, l2); } },
      { cap: `${T(D(r))} is in the table: ${T(`\\${d.fn} ${D(r)}=${TAB[d.fn][r]}`)}.`, run: (c) => show(c, l3) },
      { cap: `CAST: in Quadrant ${ROMAN[q]} only ${['', 'all', 'sin', 'tan', 'cos'][q]} ${q === 1 ? 'are' : 'is'} positive, so ${d.fn} is <b>${sg > 0 ? 'positive' : 'negative'}</b>.`, run: async (c) => { await pulse(c, cast[q], 1.3); await show(c, l4); } },
      { cap: `${T(`\\${d.fn} ${D(th)}=${d.ans}`)}.`, run: (c) => pop(c, l5) }
    ];
  }
};

/* =============================== explainer: exact expressions =============================== */
const SB = {
  a: { e: '\\sin^2 60^\\circ+\\cos 180^\\circ', look: [['\\sin 60^\\circ', 'table', '\\dfrac{\\sqrt{3}}{2}', C45], ['\\cos 180^\\circ', 'point (−1, 0), r = 1', '-1', C30]],
    lines: [`=\\left(${c45('\\dfrac{\\sqrt{3}}{2}')}\\right)^2+(${c30('-1')})`, '=\\dfrac{3}{4}-1', '=-\\dfrac{1}{4}'],
    caps: ['Put each value in brackets. The square goes on the bracket.', 'Square the top and the bottom.', `${T('\\sin^2 60^\\circ+\\cos 180^\\circ=-\\dfrac{1}{4}')}.`] },
  b: { e: '2\\cos 45^\\circ\\sin 135^\\circ', look: [['\\cos 45^\\circ', 'table', '\\dfrac{\\sqrt{2}}{2}', C45], ['\\sin 135^\\circ', 'QII, θR = 45°, sin +', '\\dfrac{\\sqrt{2}}{2}', C30]],
    lines: [`=2\\left(${c45('\\dfrac{\\sqrt{2}}{2}')}\\right)\\left(${c30('\\dfrac{\\sqrt{2}}{2}')}\\right)`, '=\\dfrac{2\\cdot2}{4}', '=1'],
    caps: ['Replace each ratio by its value in brackets.', `Multiply: ${T('\\sqrt{2}\\cdot\\sqrt{2}=2')}, and ${T('2\\cdot2=4')} on the bottom.`, `${T('2\\cos 45^\\circ\\sin 135^\\circ=1')}.`] },
  c: { e: '\\dfrac{\\tan 150^\\circ}{1+\\tan^2 210^\\circ}', look: [['\\tan 150^\\circ', 'QII, θR = 30°, tan −', '-\\dfrac{\\sqrt{3}}{3}', C45], ['\\tan 210^\\circ', 'QIII, θR = 30°, tan +', '\\dfrac{\\sqrt{3}}{3}', C30]],
    lines: [`\\tan^2 210^\\circ=\\left(${c30('\\dfrac{\\sqrt{3}}{3}')}\\right)^2=\\dfrac{3}{9}=\\dfrac{1}{3}`, `=\\dfrac{${c45('-\\frac{\\sqrt{3}}{3}')}}{1+\\frac{1}{3}}=\\dfrac{-\\frac{\\sqrt{3}}{3}}{\\frac{4}{3}}`, '=-\\dfrac{\\sqrt{3}}{3}\\cdot\\dfrac{3}{4}=-\\dfrac{\\sqrt{3}}{4}'],
    caps: [`Square first: ${T('\\tan^2 210^\\circ=\\dfrac{1}{3}')}.`, `The bottom: ${T('1+\\dfrac{1}{3}=\\dfrac{4}{3}')}.`, `Dividing by ${T('\\dfrac{4}{3}')} is multiplying by ${T('\\dfrac{3}{4}')}: ${T('-\\dfrac{\\sqrt{3}}{4}')}.`] }
};
const subst = {
  title: 'Exact values in brackets, then simplify',
  height: 440, minW: 900,
  choices: [{ v: 'sq', label: T('\\sin^2\\theta') + ' means…' }, { sep: 'Example 4 check:' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }, { v: 'c', label: '(c)' }, { v: 'd', label: '(d)' }],
  ask: (v) => (v === 'sq' ? `What does ${T('\\sin^2 60^\\circ')} mean?` : v === 'd' ? `Example 4(d): is ${T('\\sin 60^\\circ=2\\sin 30^\\circ')}? Explain.` : `Example 4(${v}): determine the exact value of ${T(SB[v].e)}.`),
  make(stage, v, ex) {
    const W = ex.W;
    if (v === 'sq') return substSq(stage, ex);
    if (v === 'd') return substD(stage, ex);
    const d = SB[v];
    const top = div(stage, 'u3l4-sbe', T(d.e), 0, 16, W); void top;
    const cards = d.look.map(([r, how, val, col], i) => { const k = div(stage, 'u3l4-look', `<div>${T(`${r}=${val}`)}</div><small>${how}</small>`, 40 + i * ((W - 80) / 2), 104, (W - 120) / 2); k.style.borderColor = col; hide(k); return k; });
    const P = div(stage, 'u3l4-sbw', '', 60, 200, W - 120, 232);
    const ls = d.lines.map((t, i) => lineIn(P, T(t), i === d.lines.length - 1 ? 'u3l4-line-ans u3l4-big' : 'u3l4-big'));
    return [
      { cap: `Find each ratio’s exact value first: ${d.look.map((x) => T(x[0])).join(' and ')}.`, run: async (c) => { for (const k of cards) await show(c, k); } },
      ...d.lines.map((t, i) => ({ cap: d.caps[i], run: (c) => (i === d.lines.length - 1 ? pop(c, ls[i]) : show(c, ls[i])) }))
    ];
  }
};
function substSq(stage, ex) {
  const W = ex.W, P = div(stage, 'u3l4-sbw', '', 60, 10, W - 120, 300);
  const l0 = lineIn(P, T('\\sin^2 60^\\circ'), 'u3l4-huge'); l0.style.opacity = 1;
  const l1 = lineIn(P, T('=(\\sin 60^\\circ)^2'), 'u3l4-big');
  const l2 = lineIn(P, T(`=\\left(${c45('\\dfrac{\\sqrt{3}}{2}')}\\right)^2`), 'u3l4-big');
  const l3 = lineIn(P, T('=\\dfrac{(\\sqrt{3})^2}{2^2}=\\dfrac{3}{4}'), 'u3l4-line-ans u3l4-big');
  const no = div(stage, 'u3l4-wrong', `${T('\\sin(60^2)')} ✗ &nbsp; <span>the angle is not squared</span>`, 60, 330, W - 120); hide(no);
  return [
    { cap: `The little 2 squares the <b>value</b> of ${T('\\sin 60^\\circ')}: ${T('\\sin^2 60^\\circ=(\\sin 60^\\circ)^2')}.`, run: (c) => show(c, l1) },
    { cap: `Find ${T('\\sin 60^\\circ')} in the table and put it in brackets.`, run: (c) => show(c, l2) },
    { cap: `Square the top <b>and</b> the bottom: ${T('\\dfrac{3}{4}')}.`, run: (c) => pop(c, l3) },
    { cap: `It is <b>not</b> ${T('\\sin(60^2)')}: the angle stays 60°.`, run: (c) => show(c, no) }
  ];
}
function substD(stage, ex) {
  const W = ex.W, P = panel(stage, 470, 16, W - 486, 390, 'Is it equal?');
  const l1 = lineIn(P, T(`\\sin 60^\\circ=${c45('\\dfrac{\\sqrt{3}}{2}')}\\approx0.87`), 'u3l4-big');
  const l2 = lineIn(P, T(`2\\sin 30^\\circ=2\\left(${c30('\\dfrac{1}{2}')}\\right)=1`), 'u3l4-big');
  const l3 = lineIn(P, '<b>No.</b> Doubling the angle does not double the sine.', 'u3l4-line-ans');
  // a quarter circle with the two heights
  const sz = 400, x0 = 40, y0 = 380, u = 320, svg = svgEl('svg', { class: 'u3l4-ov', width: 460, height: 420 }, stage);
  svgEl('path', { d: `M${x0 + u} ${y0} A${u} ${u} 0 0 0 ${x0} ${y0 - u}`, fill: 'none', stroke: '#9aa0ab', 'stroke-width': 2.4 }, svg);
  svgEl('line', { x1: x0 - 10, y1: y0, x2: x0 + u + 30, y2: y0, stroke: INK, 'stroke-width': 2 }, svg);
  svgEl('line', { x1: x0, y1: y0 + 10, x2: x0, y2: y0 - u - 20, stroke: INK, 'stroke-width': 2 }, svg);
  void sz;
  const bar = (a, color, w = 6) => { const X = x0 + u * cosd(a), Y = y0 - u * sind(a); const g = svgEl('g', { class: 'bk-curve' }, svg); g.style.color = color;
    svgEl('path', { class: 'bk-stroke', d: `M${x0} ${y0} L${X} ${Y}`, stroke: '#7a1f3d', 'stroke-width': 3, fill: 'none' }, g);
    svgEl('path', { class: 'bk-stroke', d: `M${X} ${y0} L${X} ${Y}`, stroke: color, 'stroke-width': w, fill: 'none', 'stroke-linecap': 'round' }, g); hide(g); return { g, X, Y }; };
  const b30 = bar(30, C30), b60 = bar(60, C45);
  const twice = svgEl('path', { d: `M${b30.X + 26} ${y0} L${b30.X + 26} ${y0 - u}`, stroke: C30, 'stroke-width': 6, 'stroke-linecap': 'round', fill: 'none', 'stroke-dasharray': '2 0' }, svg); hide(twice);
  const top1 = svgEl('line', { x1: x0, y1: y0 - u, x2: x0 + u + 20, y2: y0 - u, stroke: C30, 'stroke-width': 1.6, 'stroke-dasharray': '5 4' }, svg); hide(top1);
  const L30 = lab(stage, b30.X + 4, y0 - u * 0.25, T('\\tfrac{1}{2}'), 'u3l4-cpur', 'e'); hide(L30);
  const L60 = lab(stage, b60.X - 6, y0 - u * 0.43, T('\\tfrac{\\sqrt{3}}{2}'), 'u3l4-cblu', 'w'); hide(L60);
  const L2 = lab(stage, b30.X + 34, y0 - u * 0.62, '2 × ½ = 1', 'u3l4-cpur u3l4-small', 'e'); hide(L2);
  lab(stage, x0 + 52, y0 - 16, T('30^\\circ'), 'u3l4-small');
  return [
    { cap: `${T('\\sin 60^\\circ')} is the height of the 60° point on a circle of radius 1: ${T('\\dfrac{\\sqrt{3}}{2}\\approx0.87')}.`, run: async (c) => { b60.g.style.opacity = 1; await drawIn(b60.g, 700, c); await show(c, L60); await show(c, l1); } },
    { cap: `${T('\\sin 30^\\circ')} is the height at 30°: ${T('\\dfrac{1}{2}')}. Twice that is ${T('1')}, the full radius.`, run: async (c) => { b30.g.style.opacity = 1; await drawIn(b30.g, 700, c); await show(c, L30); await Promise.all([show(c, twice), show(c, top1), show(c, L2)]); await show(c, l2); } },
    { cap: `${T('0.87\\ne1')}: <b>no</b>. Doubling the angle does not double the sine.`, run: (c) => pop(c, l3) }
  ];
}

/* =============================== explainer: solving exactly =============================== */
const SV = {
  a: { lab: '\\sin\\theta=-\\tfrac{\\sqrt{3}}{2}', eq: '\\sin\\theta=-\\dfrac{\\sqrt{3}}{2}', iso: [], fn: 'sin', s: -1, ref: 60, ex: '5(a)' },
  b: { lab: '\\cos\\theta=-\\tfrac{1}{\\sqrt{2}}', eq: '\\cos\\theta=-\\dfrac{1}{\\sqrt{2}}', iso: ['\\cos\\theta=-\\dfrac{\\sqrt{2}}{2}'], fn: 'cos', s: -1, ref: 45, ex: '5(b)' },
  c: { lab: '\\tan\\theta=\\sqrt{3}', eq: '\\tan\\theta=\\sqrt{3}', iso: [], fn: 'tan', s: 1, ref: 60, ex: '5(c)' },
  d: { lab: '2\\sin\\theta+1=0', eq: '2\\sin\\theta+1=0', iso: ['2\\sin\\theta=-1', '\\sin\\theta=-\\dfrac{1}{2}'], fn: 'sin', s: -1, ref: 30, ex: '6(a)' },
  e: { lab: '\\sqrt{3}\\tan\\theta+1=0', eq: '\\sqrt{3}\\tan\\theta+1=0', iso: ['\\tan\\theta=-\\dfrac{1}{\\sqrt{3}}=-\\dfrac{\\sqrt{3}}{3}'], fn: 'tan', s: -1, ref: 30, max: 180, ex: '6(b)' },
  f: { lab: '\\tan^2\\theta=1', eq: '\\tan^2\\theta=1', iso: ['\\tan\\theta=\\pm1'], fn: 'tan', s: 0, ref: 45, ex: '6(c)' }
};
const solve = {
  title: 'Solve exactly: CAST and the table read backwards',
  height: 430, minW: 940, capH: 86,
  choices: [{ sep: 'Example 5 check:' }, ...['a', 'b', 'c'].map((k) => ({ v: k, label: T(SV[k].lab) })), { sep: 'Example 6 check:' }, ...['d', 'e', 'f'].map((k) => ({ v: k, label: T(SV[k].lab) }))],
  ask: (v) => `Example ${SV[v].ex}: solve ${T(SV[v].eq)}, ${T(SV[v].max ? '0^\\circ\\le\\theta\\le180^\\circ' : '0^\\circ\\le\\theta<360^\\circ')}, without a calculator.`,
  make(stage, v, ex) {
    const d = SV[v], W = ex.W, R = 2.6, gs = 420, G = qGraph(stage, W - gs - 4, 4, gs, R, { labels: 1, numbers: false }), fn = d.fn;
    const cast = mkCast(G, R, { small: true }); void cast;
    const quads = d.s === 0 ? [1, 2, 3, 4] : [1, 2, 3, 4].filter((q) => SIGN(fn, q) === d.s);
    const sols = quads.map((q) => angleIn(q, d.ref)).sort((a, b) => a - b);
    const keep = sols.filter((a) => !d.max || a <= d.max);
    const qrs = quads.map((q) => { const r = quadRect(G, q, R, POS, 0.14); hide(r); return r; });
    if (d.max) { const [x0, y0] = G.toPx(-R, 0), [x1, y1] = G.toPx(R, R); const r = svgEl('rect', { x: x0, y: y1, width: x1 - x0, height: y0 - y1, fill: 'none', stroke: BR, 'stroke-width': 2.5, 'stroke-dasharray': '8 6' }, G.layers.top); hide(r); qrs.push(r); }
    const P = panel(stage, 4, 4, W - gs - 24, 420, '');
    const L0 = lineIn(P, T(d.eq), 'u3l4-big'); L0.style.opacity = 1;
    const Li = d.iso.map((t) => lineIn(P, T(t), 'u3l4-big'));
    const sgnTxt = d.s === 0 ? 'Both signs: + gives I, III; − gives II, IV' : `${d.s < 0 ? 'Negative' : 'Positive'} ${fn}: Quadrants ${quads.map((q) => ROMAN[q]).join(' and ')}`;
    const Ls = lineIn(P, `<span class="u3l4-lk">2</span> ${sgnTxt}`);
    // the table row, read backwards
    const strip = h('div', 'u3l4-strip'); strip.innerHTML = `<div class="u3l4-sh">${T('\\theta_R')}</div>` + [30, 45, 60].map((a) => `<div class="u3l4-sh">${T(D(a))}</div>`).join('') +
      `<div class="u3l4-sv0">${T(`\\${fn}`)}</div>` + [30, 45, 60].map((a) => `<div class="u3l4-sv" data-a="${a}">${T(TABt[fn][a])}</div>`).join('');
    const Lt = lineIn(P, `<span class="u3l4-lk">3</span> Table: which angle has ${T(`\\${fn}=${TABt[fn][d.ref]}`)}?`); Lt.appendChild(strip);
    const Lr = lineIn(P, T(`\\theta_R=${cR(D(d.ref))}`));
    const Lp = lineIn(P, `<span class="u3l4-lk">4</span> ` + quads.map((q) => T(placeTex(q, d.ref).replace(/=([0-9]+\^\\circ)$/, `=${cB('$1')}`))).join('<span class="u3l4-or">,</span> '));
    const La = lineIn(P, `${T('\\theta=')} ${keep.map((a) => T(cB(D(a)))).join(' or ')}`, 'u3l4-line-ans u3l4-big');
    // arms
    const arms = {}, refs = {}, labs = {};
    quads.forEach((q) => {
      const a = angleIn(q, d.ref);
      arms[q] = mkArm(G, { x: 2.15 * cosd(a), y: 2.15 * sind(a) }); hide(arms[q]);
      refs[q] = mkArc(G, { r: 46, color: RF, width: 3, a0: [0, 0, a, 180, a][q], a1: [0, a, 180, a, 360][q] }); hide(refs[q]);
      labs[q] = G.label(2.4 * cosd(a), 2.4 * sind(a), T(D(a)), { cls: 'u3l4-alab' }); hide(labs[q]);
    });
    const placeQ = (c, q) => Promise.all([show(c, arms[q]), show(c, refs[q]), pop(c, labs[q])]);
    const steps = [];
    if (d.iso.length) steps.push({ cap: v === 'b' ? `<span class="u3l4-lk">1</span> Rationalize: ${T('-\\dfrac{1}{\\sqrt{2}}=-\\dfrac{\\sqrt{2}}{2}')}, a value in the table.` : v === 'f' ? `<span class="u3l4-lk">1</span> Take the square root of both sides: ${T('\\tan\\theta=\\pm1')}. <b>Both</b> signs count.` : v === 'e' ? `<span class="u3l4-lk">1</span> Isolate: ${T('\\sqrt{3}\\tan\\theta=-1')}, divide by ${T('\\sqrt{3}')}, then rationalize.` : `<span class="u3l4-lk">1</span> Isolate the ratio: subtract 1, then divide by 2.`, run: async (c) => { for (const l of Li) await show(c, l); } });
    steps.push({ cap: `<span class="u3l4-lk">2</span> ${d.s === 0 ? `${T('\\tan')} is positive in I and III, negative in II and IV: <b>all four</b> quadrants.` : `${T(`\\${fn}`)} is <b>${d.s < 0 ? 'negative' : 'positive'}</b> in Quadrants ${quads.map((q) => ROMAN[q]).join(' and ')} (CAST).`}`, run: async (c) => { qrs.forEach((r) => show(c, r)); await show(c, Ls); } });
    steps.push({ cap: `<span class="u3l4-lk">3</span> Read the table backwards: ${T(`\\${fn}\\,\\theta_R=${TABt[fn][d.ref]}`)} at ${T(D(d.ref))}, so ${T(`\\theta_R=${D(d.ref)}`)}.`, run: async (c) => { await show(c, Lt); const m = strip.querySelector(`.u3l4-sv[data-a="${d.ref}"]`); m.classList.add('u3l4-match'); await pulse(c, m, 1.2); await show(c, Lr); } });
    if (d.s === 0) {
      steps.push({ cap: `<span class="u3l4-lk">4</span> ${T('\\tan\\theta=1')}: ${T('45^\\circ')} and ${T('180^\\circ+45^\\circ=225^\\circ')}.`, run: async (c) => { await placeQ(c, 1); await placeQ(c, 3); } });
      steps.push({ cap: `${T('\\tan\\theta=-1')}: ${T('180^\\circ-45^\\circ=135^\\circ')} and ${T('360^\\circ-45^\\circ=315^\\circ')}.`, run: async (c) => { await placeQ(c, 2); await placeQ(c, 4); await show(c, Lp); } });
    } else {
      quads.forEach((q, i) => steps.push({ cap: `<span class="u3l4-lk">4</span> Place ${T(D(d.ref))} in Quadrant ${ROMAN[q]}: ${T(placeTex(q, d.ref))}.`, run: async (c) => { await placeQ(c, q); if (i === quads.length - 1) await show(c, Lp); } }));
    }
    if (d.max) {
      const q4 = quads.find((q) => angleIn(q, d.ref) > d.max), x = stamp(stage, '✗', { ok: false, x: W - gs + 300, y: 290, size: 'sm' }); hide(x);
      steps.push({ cap: `The interval stops at ${T('180^\\circ')} (the top half): ${T(D(angleIn(q4, d.ref)))} is <b>out</b>.`, run: async (c) => { await dim(c, arms[q4], 0.25); await dim(c, refs[q4], 0.2); await stampIn(c, x); } });
    }
    steps.push({ cap: `${T('\\theta=')} ${keep.map((a) => T(D(a))).join(' or ')}.`, run: (c) => pop(c, La) });
    return steps;
  }
};

/* =============================== explainer: exact angle from a point =============================== */
const PT = {
  a: { ask: 'Example 7(a): P(2√3, −2) is on the terminal arm of θ. Determine θ exactly.', label: 'P(2\\sqrt{3},\\ -2)' },
  b: { ask: 'Example 7(b): Q(−3, −3√3) is on the terminal arm of θ. Determine θ and r.', label: 'Q(-3,\\ -3\\sqrt{3})' },
  c: { ask: 'Example 7(c): sin A = 1/2 and A is not in Quadrant I. Determine A, cos A and tan A.', label: '\\sin A=\\tfrac{1}{2}' },
  d: { ask: 'Example 7(d): a terminal arm rotates counterclockwise from the arm through (−1, 1) to the arm through (1, −√3). Through what angle does it rotate?', label: '\\text{the rotation}' }
};
const point = {
  title: 'A special triangle in disguise',
  height: 430, minW: 920, capH: 86,
  choices: [{ sep: 'Example 7 check:' }, ...Object.keys(PT).map((k) => ({ v: k, label: `(${k}) ` + T(PT[k].label) }))],
  ask: (v) => PT[v].ask,
  make(stage, v, ex) {
    const W = ex.W;
    if (v === 'a' || v === 'b') {
      const A = v === 'a', R = A ? 4.6 : 7, G = qGraph(stage, 2, 2, 426, R, { numbers: false });
      const px = A ? 2 * S3 : -3, py = A ? -2 : -3 * S3, th = A ? 330 : 240, r = A ? 30 : 60, q = A ? 4 : 3, k = A ? 2 : 3;
      const P = panel(stage, 446, 2, W - 458, 426, T(PT[v].label), 'u3l4-pq');
      const arm = mkArm(G, { x: px, y: py }); hide(arm);
      const pt = G.label(px, py, T(A ? 'P(2\\sqrt{3},\\ -2)' : 'Q(-3,\\ -3\\sqrt{3})'), { cls: 'bk-ptlab u3l4-ptl', pos: A ? 'sw' : 'sw' }); hide(pt);
      const tri = mkTri(G, { fill: C30, fo: 0.16, leg: C30, x: px, y: py, labels: { x: T(A ? '2\\sqrt{3}' : '3'), y: T(A ? '2' : '3\\sqrt{3}'), r: T(A ? '4' : '6') } }); tri.fade(null, 0);
      if (tri.labs.r) tri.labs.r.style.opacity = 0;
      const ref = mkArc(G, { r: 40, color: RF, width: 3.5, label: T(D(r)), lr: 64, a0: A ? th : 180, a1: A ? 360 : th }); hide(ref); hide(ref.L);
      const rot = mkArc(G, { r: 26, color: BR, arrow: true, width: 2.6 }); hide(rot);
      const circ = svgEl('path', { d: pd(arcPts(G, 6 * G.ux, 0, 360)), fill: 'none', stroke: BR, 'stroke-width': 2, 'stroke-dasharray': '6 6' }, G.layers.data); hide(circ);
      const l1 = lineIn(P, A ? `${T('2\\sqrt{3}\\approx3.5')} right, 2 down: <b>Quadrant IV</b>` : `3 left, ${T('3\\sqrt{3}\\approx5.2')} down: <b>Quadrant III</b>`);
      const l2 = lineIn(P, `Legs ${T(A ? '2' : '3')} and ${T(A ? '2\\sqrt{3}' : '3\\sqrt{3}')}: ${T('1:\\sqrt{3}:2')} <b>times ${k}</b>`);
      const l3 = lineIn(P, T(A ? '\\tan\\theta=\\dfrac{-2}{2\\sqrt{3}}=-\\dfrac{1}{\\sqrt{3}}' : '\\tan\\theta=\\dfrac{-3\\sqrt{3}}{-3}=\\sqrt{3}'), 'u3l4-big');
      const l4 = lineIn(P, `${T(`\\theta_R=${cR(D(r))}`)}, so ${T(`\\theta=${A ? '360^\\circ-30^\\circ' : '180^\\circ+60^\\circ'}=${cB(D(th))}`)}`, A ? 'u3l4-line-ans' : '');
      const steps = [
        { cap: A ? `Plot ${T('P(2\\sqrt{3},\\ -2)')}: about 3.5 right and 2 down, in <b>Quadrant IV</b>.` : `Plot ${T('Q(-3,\\ -3\\sqrt{3})')}: 3 left and about 5.2 down, in <b>Quadrant III</b>.`, run: async (c) => { await show(c, arm); await show(c, pt); await show(c, l1); } },
        { cap: `Drop to the x-axis. Legs ${T(A ? '2' : '3')} and ${T(A ? '2\\sqrt{3}' : '3\\sqrt{3}')}: the ${T('1:\\sqrt{3}:2')} triangle <b>scaled by ${k}</b>.`, run: async (c) => { await tri.fade(c, 1); tri.labs.r.style.opacity = 0; await show(c, l2); } },
        { cap: `${T(A ? '\\tan\\theta=\\dfrac{y}{x}=\\dfrac{-2}{2\\sqrt{3}}=-\\dfrac{1}{\\sqrt{3}}' : '\\tan\\theta=\\dfrac{y}{x}=\\dfrac{-3\\sqrt{3}}{-3}=\\sqrt{3}')}.`, run: (c) => show(c, l3) },
        { cap: `${T(A ? '\\tan\\theta_R=\\dfrac{1}{\\sqrt{3}}' : '\\tan\\theta_R=\\sqrt{3}')}, so ${T(`\\theta_R=${D(r)}`)}. Quadrant ${ROMAN[q]}: ${T(`\\theta=${A ? '360^\\circ-30^\\circ' : '180^\\circ+60^\\circ'}=${D(th)}`)}.`, run: async (c) => { await Promise.all([show(c, ref), show(c, ref.L)]); rot.style.opacity = 1; await tween(c, 900, (t) => rot.set(0, th * t)); await show(c, l4); } }
      ];
      if (!A) {
        const l5 = lineIn(P, T(`r=\\sqrt{(-3)^2+(-3\\sqrt{3})^2}=\\sqrt{9+27}=\\sqrt{36}=${cB('6')}`), 'u3l4-line-ans');
        steps.push({ cap: `${T('r=\\sqrt{9+27}=\\sqrt{36}=6')}: the hypotenuse 2, times 3.`, run: async (c) => { await fadeIn(c, tri.labs.r, 300); await appear(c, circ, 500); await show(c, l5); } });
      }
      return steps;
    }
    const R = 2.6, G = qGraph(stage, 2, 2, 426, R, { labels: 1 });
    const P = panel(stage, 446, 2, W - 458, 426, T(v === 'c' ? '\\sin A=\\tfrac{1}{2},\\ A\\ \\text{not in QI}' : '(-1,\\ 1)\\to(1,\\ -\\sqrt{3})'), 'u3l4-pq');
    if (v === 'c') {
      const cast = mkCast(G, R, { small: true }); void cast;
      const qr = [quadRect(G, 1, R, POS), quadRect(G, 2, R, POS)]; qr.forEach(hide);
      const t1 = mkTri(G, { fill: C30, fo: 0.14, signs: true, x: S3, y: 1, labels: { x: T('\\sqrt{3}'), y: T('1'), r: T('2') } }); t1.fade(null, 0);
      const t2 = mkTri(G, { fill: C30, fo: 0.16, signs: true, x: -S3, y: 1, labels: { x: T('-\\sqrt{3}'), y: T('1'), r: T('2') } }); t2.fade(null, 0);
      const x1 = stamp(stage, 'not QI', { ok: false, x: 300, y: 70, size: 'sm', rotate: -6 }); hide(x1);
      const rot = mkArc(G, { r: 26, color: BR, arrow: true, width: 2.6 }); hide(rot);
      const ref = mkArc(G, { r: 46, color: RF, width: 3.5, a0: 150, a1: 180, label: T('30^\\circ'), lr: 72 }); hide(ref); hide(ref.L);
      const l1 = lineIn(P, `sin positive: Quadrant I or II (S in CAST)`);
      const l2 = lineIn(P, `${T('\\sin A=\\dfrac{y}{r}=\\dfrac{1}{2}')}: ${T('y=1,\\ r=2')}, the 30-60-90 triangle`);
      const l3 = lineIn(P, `Not QI, so <b>Quadrant II</b>: ${T('\\theta_R=30^\\circ')}, ${T(`A=180^\\circ-30^\\circ=${cB('150^\\circ')}`)}`);
      const l4 = lineIn(P, T('\\cos A=-\\cos 30^\\circ=-\\dfrac{\\sqrt{3}}{2}'), 'u3l4-line-ans');
      const l5 = lineIn(P, T('\\tan A=-\\tan 30^\\circ=-\\dfrac{\\sqrt{3}}{3}'), 'u3l4-line-ans');
      return [
        { cap: `${T('\\sin A')} is positive: Quadrant I or II.`, run: async (c) => { qr.forEach((r) => show(c, r)); await show(c, l1); } },
        { cap: `${T('\\sin A=\\dfrac{1}{2}=\\dfrac{y}{r}')}: height 1, hypotenuse 2. The 30-60-90 triangle fits in <b>both</b> quadrants.`, run: async (c) => { await t1.fade(c, 1); await t2.fade(c, 1); await show(c, l2); } },
        { cap: 'A is <b>not</b> in Quadrant I: cross it out. Quadrant II, reference angle 30°.', run: async (c) => { await t1.fade(c, 0.2); await stampIn(c, x1); await Promise.all([show(c, ref), show(c, ref.L)]); } },
        { cap: `${T('A=180^\\circ-30^\\circ=150^\\circ')}.`, run: async (c) => { rot.style.opacity = 1; await tween(c, 900, (t) => rot.set(0, 150 * t)); await show(c, l3); } },
        { cap: `In Quadrant II x is negative, so cos and tan are negative: ${T('\\cos A=-\\dfrac{\\sqrt{3}}{2}')}, ${T('\\tan A=-\\dfrac{\\sqrt{3}}{3}')}.`, run: async (c) => { await show(c, l4); await show(c, l5); } }
      ];
    }
    // d: the rotation
    const a1 = mkArm(G, { x: -1, y: 1, color: C45 }), a2 = mkArm(G, { x: 1, y: -S3, color: C30 }); hide(a1); hide(a2);
    const p1 = G.label(-1, 1, T('(-1,\\ 1)'), { cls: 'bk-ptlab u3l4-ptl', pos: 'nw' }), p2 = G.label(1, -S3, T('(1,\\ -\\sqrt{3})'), { cls: 'bk-ptlab u3l4-ptl', pos: 'se' }); hide(p1); hide(p2);
    const r1 = mkArc(G, { r: 30, color: C45, width: 3, a0: 0, a1: 135, arrow: true, label: T('135^\\circ'), lr: 50 }); hide(r1); hide(r1.L);
    const r2 = mkArc(G, { r: 20, color: C30, width: 2.4, a0: 0, a1: 300, arrow: true }); hide(r2);
    const sw = mkArc(G, { r: 70, color: BR, width: 5, a0: 135, a1: 135, arrow: true, label: T('165^\\circ'), lr: 96, lcls: 'u3l4-arcbig' }); hide(sw); hide(sw.L);
    const l1 = lineIn(P, `${T('(-1,\\ 1)')}: QII, ${T('\\tan=\\dfrac{1}{-1}=-1')}, ${T('\\theta_R=45^\\circ')}, angle ${T(c45('135^\\circ'))}`);
    const l2 = lineIn(P, `${T('(1,\\ -\\sqrt{3})')}: QIV, ${T('\\tan=\\dfrac{-\\sqrt{3}}{1}=-\\sqrt{3}')}, ${T('\\theta_R=60^\\circ')}, angle ${T(c30('300^\\circ'))}`);
    const l3 = lineIn(P, `Rotation: ${T(`300^\\circ-135^\\circ=${cB('165^\\circ')}`)}`, 'u3l4-line-ans u3l4-big');
    return [
      { cap: `Start: ${T('(-1,\\ 1)')} in Quadrant II. ${T('\\tan=-1')}, so ${T('\\theta_R=45^\\circ')} and the angle is ${T('180^\\circ-45^\\circ=135^\\circ')}.`, run: async (c) => { await show(c, a1); await show(c, p1); await Promise.all([show(c, r1), show(c, r1.L)]); await show(c, l1); } },
      { cap: `End: ${T('(1,\\ -\\sqrt{3})')} in Quadrant IV. ${T('\\tan=-\\sqrt{3}')}, so ${T('\\theta_R=60^\\circ')} and the angle is ${T('360^\\circ-60^\\circ=300^\\circ')}.`, run: async (c) => { await show(c, a2); await show(c, p2); await show(c, r2); await show(c, l2); } },
      { cap: `Counterclockwise from 135° to 300°: ${T('300^\\circ-135^\\circ=165^\\circ')}.`, run: async (c) => { await Promise.all([dim(c, r1, 0.3), dim(c, r1.L, 0.3), dim(c, r2, 0.3)]); sw.style.opacity = 1; sw.L.style.opacity = 1; await tween(c, 1000, (t) => sw.set(135, 135 + 165 * t)); await show(c, l3); } }
    ];
  }
};

/* =============================== Stand Up Break =============================== */
/* exact values as k·√m / n (m ∈ {1, 2, 3, 6}) so expressions can be simplified */
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const V = (n, d = 1, m = 1) => { if (n === 0) return { n: 0, d: 1, m: 1 }; const g = gcd(n, d); let N = n / g, Dd = d / g; if (Dd < 0) { N = -N; Dd = -Dd; } return { n: N, d: Dd, m }; };
const vmul = (a, b) => { let m = a.m * b.m, k = 1; if (m === 4) { m = 1; k = 2; } else if (m === 9) { m = 1; k = 3; } return V(a.n * b.n * k, a.d * b.d, m); };
const vadd = (a, b) => (a.m === b.m || a.n === 0 || b.n === 0 ? V(a.n * b.d + b.n * a.d, a.d * b.d, a.n === 0 ? b.m : a.m) : null);
const vtex = (v, frac = 'dfrac') => {
  if (v.n === 0) return '0';
  const s = v.n < 0 ? '-' : '', k = Math.abs(v.n), top = v.m === 1 ? String(k) : (k === 1 ? '' : k) + `\\sqrt{${v.m}}`;
  return v.d === 1 ? s + top : `${s}\\${frac}{${top}}{${v.d}}`;
};
const BASE = { sin: { 0: V(0), 30: V(1, 2), 45: V(1, 2, 2), 60: V(1, 2, 3), 90: V(1) }, cos: { 0: V(1), 30: V(1, 2, 3), 45: V(1, 2, 2), 60: V(1, 2), 90: V(0) }, tan: { 0: V(0), 30: V(1, 3, 3), 45: V(1), 60: V(1, 1, 3) } };
function trig(fn, a) { // exact value of fn(a) for a multiple of 30 or 45 (not tan at 90/270)
  if (a % 90 === 0) { const k = (a / 90) % 4, x = [1, 0, -1, 0][k], y = [0, 1, 0, -1][k]; return fn === 'sin' ? V(y) : fn === 'cos' ? V(x) : V(y); }
  const q = quadOf(a), r = refOf(a), b = BASE[fn][r]; return SIGN(fn, q) > 0 ? b : V(-b.n, b.d, b.m);
}
const ANG = [30, 45, 60, 120, 135, 150, 210, 225, 240, 300, 315, 330];
standup('u3l4', {
  intro: 'At your whiteboard, no calculator: quadrant, reference angle, the table, the sign. Exact answers only!',
  levels: {
    BEG: (r) => {
      const fn = r.pick(['sin', 'cos', 'tan']), a = r.pick(ANG.filter((x) => x > 90)), q = quadOf(a), ref = refOf(a), s = SIGN(fn, q);
      return { text: 'Determine the exact value.', q: `\\${fn} ${D(a)}`,
        a: [`\\text{Quadrant ${ROMAN[q]}},\\ \\theta_R=${D(ref)},\\ \\text{${fn} ${s > 0 ? 'positive' : 'negative'}}`, `\\${fn} ${D(a)}=${s < 0 ? '-' : ''}\\${fn} ${D(ref)}=${vtex(trig(fn, a))}`] };
    },
    PRG: (r) => {
      const kind = r.int(0, 2);
      if (kind === 0) { // sin²A + cos²B  or  sin²A − cos B (quadrantal)
        const A = r.pick(ANG), B = r.pick(ANG), sA = trig('sin', A), cB2 = trig('cos', B), a2 = vmul(sA, sA), b2 = vmul(cB2, cB2), tot = vadd(a2, b2);
        return { text: 'Determine the exact value.', q: `\\sin^2 ${D(A)}+\\cos^2 ${D(B)}`,
          a: [`=\\left(${vtex(sA)}\\right)^2+\\left(${vtex(cB2)}\\right)^2`, `=${vtex(a2)}+${vtex(b2)}`, `=${vtex(tot)}`] };
      }
      if (kind === 1) { // k sin A cos B with the same reference angle
        const ref = r.pick([30, 45, 60]), qs = r.shuffle([1, 2, 3, 4]), A = angleIn(qs[0], ref), B = angleIn(qs[1], ref), k = r.pick([2, 4]);
        const sA = trig('sin', A), cB2 = trig('cos', B), p = vmul(V(k), vmul(sA, cB2));
        return { text: 'Determine the exact value.', q: `${k}\\sin ${D(A)}\\cos ${D(B)}`,
          a: [`=${k}\\left(${vtex(sA)}\\right)\\left(${vtex(cB2)}\\right)`, `=${vtex(p)}`] };
      }
      const ref = r.pick([30, 45, 60]), qs = r.shuffle([1, 2, 3, 4]), A = angleIn(qs[0], ref), B = angleIn(qs[1], ref), Q = r.pick([90, 180, 270, 0]);
      const tA = trig('tan', A), tB = trig('tan', B), c = trig('cos', Q), p = vmul(tA, tB), tot = vadd(p, c);
      return { text: 'Determine the exact value.', q: `\\tan ${D(A)}\\tan ${D(B)}+\\cos ${D(Q)}`,
        a: [`=\\left(${vtex(tA)}\\right)\\left(${vtex(tB)}\\right)+(${vtex(c)})`, `=${vtex(p)}+(${vtex(c)})`, `=${vtex(tot)}`] };
    },
    MAS: (r) => {
      const E = r.pick([
        { eq: '2\\cos\\theta-1=0', iso: '\\cos\\theta=\\tfrac{1}{2}', fn: 'cos', s: 1, ref: 60 },
        { eq: '2\\sin\\theta-\\sqrt{3}=0', iso: '\\sin\\theta=\\tfrac{\\sqrt{3}}{2}', fn: 'sin', s: 1, ref: 60 },
        { eq: '\\sqrt{2}\\sin\\theta+1=0', iso: '\\sin\\theta=-\\tfrac{1}{\\sqrt{2}}=-\\tfrac{\\sqrt{2}}{2}', fn: 'sin', s: -1, ref: 45 },
        { eq: '\\tan\\theta+\\sqrt{3}=0', iso: '\\tan\\theta=-\\sqrt{3}', fn: 'tan', s: -1, ref: 60 },
        { eq: '2\\cos\\theta+1=0', iso: '\\cos\\theta=-\\tfrac{1}{2}', fn: 'cos', s: -1, ref: 60 },
        { eq: '\\sqrt{3}\\tan\\theta-1=0', iso: '\\tan\\theta=\\tfrac{1}{\\sqrt{3}}=\\tfrac{\\sqrt{3}}{3}', fn: 'tan', s: 1, ref: 30 },
        { eq: '4\\sin^2\\theta=3', iso: '\\sin\\theta=\\pm\\tfrac{\\sqrt{3}}{2}', fn: 'sin', s: 0, ref: 60 },
        { eq: '2\\cos^2\\theta-1=0', iso: '\\cos\\theta=\\pm\\tfrac{1}{\\sqrt{2}}=\\pm\\tfrac{\\sqrt{2}}{2}', fn: 'cos', s: 0, ref: 45 },
        { eq: '2\\sin\\theta+2=1', iso: '\\sin\\theta=-\\tfrac{1}{2}', fn: 'sin', s: -1, ref: 30 },
        { eq: '\\sqrt{2}\\cos\\theta+1=0', iso: '\\cos\\theta=-\\tfrac{1}{\\sqrt{2}}=-\\tfrac{\\sqrt{2}}{2}', fn: 'cos', s: -1, ref: 45 },
        { eq: '\\tan^2\\theta=3', iso: '\\tan\\theta=\\pm\\sqrt{3}', fn: 'tan', s: 0, ref: 60 },
        { eq: '2\\sin\\theta-\\sqrt{2}=0', iso: '\\sin\\theta=\\tfrac{\\sqrt{2}}{2}', fn: 'sin', s: 1, ref: 45 }
      ]);
      const quads = E.s === 0 ? [1, 2, 3, 4] : [1, 2, 3, 4].filter((q) => SIGN(E.fn, q) === E.s), sols = quads.map((q) => angleIn(q, E.ref)).sort((a, b) => a - b);
      return { text: 'Solve for θ, 0° ≤ θ < 360°, without a calculator.', q: E.eq,
        a: [E.iso, `\\text{Quadrants ${quads.map((q) => ROMAN[q]).join(', ')}};\\ \\theta_R=${D(E.ref)}`, `\\theta=${sols.map(D).join(',\\ ')}`] };
    }
  }
});

/* =============================== mount =============================== */
mountNut();
mountFigs();
export const explainers = mountExplainers({ cut, read, unit, patterns, flip, anyq, subst, solve, point });
export const _test = { trig, vtex, vmul, vadd, AQ, SV, SB, FL, TAB, refOf, angleIn };
void liveCtx; void c45; void cN; void cP;
