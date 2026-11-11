/* Math 20-1 · Unit 3 · Lesson 8 — Choosing the Sine Law or the Cosine Law.
 * Warm-up (The Treasure Map: 10 paces on 060°, 10 paces on 180°: how far from the palm tree? an equilateral triangle),
 * and the explainers:
 *   chooser (the decision chart walked node by node for each part of Example 1, the triangle's known parts marked),
 *   clock (clock hands from 12 like bearings, the angle between them, the tips joined: SAS → cosine law; Example 2),
 *   bearingForms (a compass rose: three-digit bearings ↔ N/S…E/W form, and a back bearing; Example 3 checks),
 *   route (STAR: a compass-rose bearing builder: two legs drawn from their bearings and distances, a new north line at
 *     the turn, the back bearing, the angle inside the triangle, cosine law, sine law, return bearing; Examples 4, 5),
 *   plus a live "Build a route" card (± bearings and distances, the working updates),
 *   mast (elevation from two points: △ABT first with the sine law, then right △BFT; Example 6),
 *   plot (a quadrilateral split by a diagonal: SAS, then a full pair; Example 7),
 *   circle (isosceles radii, central = 2 × inscribed with C sliding along the arc, chord bisector, tangents; Example 8),
 *   area (the height a sin C, ½ab sin C, SSS → cosine law first, the plot as two triangles; Example 9).
 * Colours (Unit 3): known full pair amber, the angle inside the triangle rose (course accent), leg 1 / known parts
 * blue, leg 2 green, back bearing purple, the unknown red. */
import {
  h, tex, add, box, Box, Flowchart, mountExplainers, pop, fadeIn, sleep, tween, svgEl, liveCtx, pulse, drawIn,
  arrowHead, rightMark, col, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const AC = COLORS.teal, PAIR = COLORS.amber, KN = COLORS.blue, UNK = COLORS.red, L1 = COLORS.blue, L2 = COLORS.green,
  BK = COLORS.purple, INK = COLORS.ink, GRAY = COLORS.gray, NLC = '#7d838f';
const cP = (s) => `\\textcolor{${PAIR}}{${s}}`, cA = (s) => `\\textcolor{${AC}}{${s}}`, cU = (s) => `\\textcolor{${UNK}}{${s}}`;

/* =============================== numbers =============================== */
const fx = (v, d = 2, keep = false) => { const k = Math.pow(10, d); let s = (Math.round((v + Math.sign(v) * 1e-9) * k) / k).toFixed(d); if (!keep && s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, ''); return s; };
const grp = (s, sep) => { const neg = s[0] === '-', b = neg ? s.slice(1) : s, [i, f] = b.split('.'); const ii = i.length >= 4 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, sep) : i; return (neg ? '-' : '') + ii + (f != null ? '.' + f : ''); };
const nt = (v, d = 2, keep = false) => grp(fx(v, d, keep), '\\,');
const rad = (d) => d * Math.PI / 180, deg = (r) => r * 180 / Math.PI;
const sn = (d) => Math.sin(rad(d)), cs = (d) => Math.cos(rad(d));
const n360 = (b) => ((b % 360) + 360) % 360;
const lawC = (a, b, g) => Math.sqrt(a * a + b * b - 2 * a * b * cs(g));
const angC = (a, b, c) => deg(Math.acos((a * a + b * b - c * c) / (2 * a * b))); // angle opposite c
const dg = (v, d = 1) => `${nt(v, d)}^\\circ`;
const b3 = (b) => { let v = Math.round(n360(b)); if (v >= 360) v -= 360; return String(v).padStart(3, '0'); };
const bT = (b) => `${b3(b)}^\\circ`;
function quad(b) { b = Math.round(n360(b) * 10) / 10; if (b <= 90) return ['N', b, 'E']; if (b <= 180) return ['S', 180 - b, 'E']; if (b <= 270) return ['S', b - 180, 'W']; return ['N', 360 - b, 'W']; }
const qT = (ns, a, ew) => `\\text{${ns}}\\,${fx(a, 1)}^\\circ\\,\\text{${ew}}`;
const qf = (b) => {
  const v = Math.round(n360(b)) % 360;
  if (v === 0) return '\\text{due north}'; if (v === 90) return '\\text{due east}'; if (v === 180) return '\\text{due south}'; if (v === 270) return '\\text{due west}';
  const [ns, a, ew] = quad(v); return qT(ns, a, ew);
};
const sq = (v, d = 1) => (Math.abs(v - Math.round(v)) < 1e-7 ? `=${nt(v, 0)}` : `\\approx${nt(v, d)}`);

/* =============================== drawing helpers =============================== */
const f1 = (v) => v.toFixed(1);
const sa = (b) => rad(b - 90);                                  // bearing → screen angle (clockwise from +x)
const uv = (a) => [Math.cos(a), Math.sin(a)];
const addP = (p, v, s = 1) => [p[0] + v[0] * s, p[1] + v[1] * s];
const sub = (p, q) => [p[0] - q[0], p[1] - q[1]];
const unit = (v) => { const L = Math.hypot(v[0], v[1]) || 1; return [v[0] / L, v[1] / L]; };
const mid = (p, q, t = 0.5) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
const angTo = (V, P) => Math.atan2(P[1] - V[1], P[0] - V[0]);
const sweepBetween = (V, P, Q) => { let d = angTo(V, Q) - angTo(V, P); while (d <= -Math.PI) d += 2 * Math.PI; while (d > Math.PI) d -= 2 * Math.PI; return d; };
const arcD = (V, a1, sw, r) => { const s = addP(V, uv(a1), r), e = addP(V, uv(a1 + sw), r); return `M${f1(s[0])} ${f1(s[1])}A${r} ${r} 0 ${Math.abs(sw) > Math.PI ? 1 : 0} ${sw > 0 ? 1 : 0} ${f1(e[0])} ${f1(e[1])}`; };
const wedgeD = (V, a1, sw, r) => `M${f1(V[0])} ${f1(V[1])}L` + arcD(V, a1, sw, r).slice(1) + 'Z';
const ptsD = (pts, closed) => 'M' + pts.map((p) => f1(p[0]) + ' ' + f1(p[1])).join('L') + (closed ? 'Z' : '');
/* a label beside segment PQ, on the side away from point G (px) */
const sideAt = (P, Q, G, d = 22) => { const M = mid(P, Q), n = unit([-(Q[1] - P[1]), Q[0] - P[0]]), s = (M[0] - G[0]) * n[0] + (M[1] - G[1]) * n[1] >= 0 ? 1 : -1; return addP(M, n, d * s); };
const away = (P, G, d) => addP(P, unit(sub(P, G)), d);
/* a label beside segment PQ at fraction t along it, on the side away from G */
const legLab = (P, Q, G, t = 0.5, d = 26) => { const M = mid(P, Q, t), n = unit([-(Q[1] - P[1]), Q[0] - P[0]]), s = (M[0] - G[0]) * n[0] + (M[1] - G[1]) * n[1] >= 0 ? 1 : -1; return addP(M, n, d * s); };
const cen = (pts) => [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
/* fit math points (y up) into a px box; returns P(pt) → px */
function fitter(pts, W, H, pad) {
  const [pt, pr, pb, pl] = Array.isArray(pad) ? pad : [pad, pad, pad, pad];
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const s = Math.min((W - pl - pr) / Math.max(x1 - x0, 1e-6), (H - pt - pb) / Math.max(y1 - y0, 1e-6));
  const ox = pl + ((W - pl - pr) - s * (x1 - x0)) / 2, oy = pt + ((H - pt - pb) - s * (y1 - y0)) / 2;
  const P = (p) => [ox + s * (p[0] - x0), oy + s * (y1 - p[1])]; P.s = s; return P;
}

class Fig extends Box {
  constructor(host, o) { super(host, o, 'u3l8-fig', o.width, o.height); this.L0 = this.layer('bg'); this.L1 = this.layer('fill'); this.L2 = this.layer('lines'); this.L3 = this.layer('top'); }
  pathD(d, o = {}) {
    const p = svgEl('path', { class: 'bk-stroke', d, fill: 'none', stroke: col(o.color, INK), 'stroke-width': o.width ?? 3, 'stroke-dasharray': o.dash === true ? '10 8' : o.dash, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, o.layer || this.L2);
    if (o.hide) p.style.opacity = 0; return p;
  }
  line(pts, o = {}) { return this.pathD(ptsD(pts, o.closed), o); }
  tint(pts, o = {}) { const p = svgEl('path', { d: ptsD(pts, true), fill: col(o.color, AC), 'fill-opacity': o.fo ?? 0.14, stroke: 'none' }, o.layer || this.L1); if (o.hide) p.style.opacity = 0; return p; }
  dot(p, o = {}) { const c = svgEl('circle', { class: 'u3l8-dot', cx: f1(p[0]), cy: f1(p[1]), r: o.r || 6, fill: col(o.color, INK), stroke: '#fff', 'stroke-width': 2 }, this.L3); if (o.hide) c.style.opacity = 0; return c; }
  lab(p, html, o = {}) { const d = this.hlabel(p[0], p[1], html, { pos: o.pos || 'c', cls: 'u3l8-lab' + (o.cls ? ' ' + o.cls : ''), color: o.color, gap: o.gap ?? 6 }); if (o.hide) d.style.opacity = 0; return d; }
  grp(o = {}) { const g = svgEl('g', {}, o.layer || this.L2); if (o.hide) g.style.opacity = 0; return g; }
}
/* show helpers: everything is created hidden (opacity 0) and shown by a step */
async function drawOn(c, el, ms = 600) { if (!el) return; el.style.opacity = 1; await drawIn(el, ms, c); if (el.lab) await fadeIn(c, el.lab, 260); }
const show = (c, el, ms = 320) => (el ? fadeIn(c, el, ms) : Promise.resolve());
const popIn = (c, el, ms = 360) => (el ? pop(c, el, ms) : Promise.resolve());
const dim = (...els) => els.forEach((e) => { if (e) { e.style.opacity = 0.32; if (e.lab) e.lab.style.opacity = 0.45; } });

/** dashed north line at V (px): arrow and N on top */
function northLine(F, V, o = {}) {
  const up = o.up ?? 64, down = o.down ?? 0, g = F.grp({ hide: o.hide });
  F.pathD(`M${f1(V[0])} ${f1(V[1] + down)}L${f1(V[0])} ${f1(V[1] - up)}`, { color: NLC, width: 2.2, dash: '7 6', layer: g });
  arrowHead(g, V[0], V[1] - up - 3, 0, -1, { color: NLC, width: 2.4, cls: 'bk-end' });
  g.lab = F.lab([V[0], V[1] - up - 4], '<b>N</b>', { pos: 'n', cls: 'u3l8-nlab', hide: o.hide, gap: 1 });
  return g;
}
/** clockwise arc at V from bearing b1 to bearing b2, with an arrow and a label */
function bArc(F, V, b1, b2, r, o = {}) {
  const sw = rad(n360(b2 - b1)), g = F.grp({ hide: o.hide });
  F.pathD(arcD(V, sa(b1), sw, r), { color: o.color, width: o.width || 2.6, layer: g });
  if (o.arrow !== false && sw > 0.12) { const e = sa(b1) + sw, P = addP(V, uv(e), r); arrowHead(g, P[0], P[1], -Math.sin(e), Math.cos(e), { color: col(o.color, INK), width: 2.4, cls: 'bk-end' }); }
  if (o.label) { const at = o.occ ? freeAt(b1, deg(sw), o.occ) : (o.at ?? 0.5), m = sa(b1) + at * sw; g.lb = b1 + at * deg(sw); g.lab = F.lab(addP(V, uv(m), r + (o.lr || 22)), o.label, { color: o.color, hide: o.hide, cls: o.lcls }); }
  return g;
}
/* where along a clockwise arc (b1, sweep sw degrees) a label is farthest from the occupied bearings (lines, other labels) */
function freeAt(b1, sw, occ) {
  const ts = []; for (let t = 0.12; t <= 0.881; t += 0.02) ts.push(t); ts.sort((a, b) => Math.abs(a - 0.5) - Math.abs(b - 0.5));
  let best = 0.5, bestD = -1;
  for (const t of ts) { const b = b1 + sw * t, dm = Math.min(...occ.map((q) => { const d = Math.abs(n360(b - q)); return Math.min(d, 360 - d); })); if (dm > bestD + 0.5) { bestD = dm; best = t; } }
  return best;
}
/** the interior angle at V between the rays to P and Q (px): a tinted wedge, or a right-angle mark */
function angMark(F, V, P, Q, o = {}) {
  const a1 = angTo(V, P), sw = sweepBetween(V, P, Q), r = o.r || 30, g = F.grp({ hide: o.hide, layer: F.L1 });
  if (o.right) rightMark(g, V, P, Q, 15, { color: col(o.color, INK), width: 2.4 });
  else {
    svgEl('path', { d: wedgeD(V, a1, sw, r), fill: col(o.color, AC), 'fill-opacity': o.fo ?? 0.2, stroke: 'none' }, g);
    F.pathD(arcD(V, a1, sw, r), { color: o.color || AC, width: 2.5, layer: g });
  }
  if (o.label) { const m = a1 + sw / 2, dist = o.ld || Math.max(r + 22, Math.min(88, 24 / Math.sin(Math.abs(sw) / 2))); g.lab = F.lab(addP(V, uv(m), dist), o.label, { color: o.lcolor || o.color, hide: o.hide, cls: o.lcls }); }
  return g;
}
/** a leg drawn as a path with an arrowhead part way along (direction of travel) */
function leg(F, A, B, o = {}) {
  const g = F.grp({ hide: o.hide });
  F.pathD(ptsD([A, B]), { color: o.color, width: o.width || 4.5, dash: o.dash, layer: g });
  if (o.arrow !== false) { const M = mid(A, B, 0.6), u = unit(sub(B, A)); arrowHead(g, M[0] + u[0] * 7, M[1] + u[1] * 7, u[0], u[1], { color: col(o.color, INK), width: 3.4, cls: 'bk-end' }); }
  return g;
}
const panel = (stage, x, y, w, hh, title) => { const d = h('div', 'u3l8-panel', title ? `<div class="u3l8-ph">${title}</div>` : ''); box(d, w, hh); d.style.position = 'absolute'; return add(stage, d, x, y); };
const lineIn = (p, html, cls = '') => { const d = h('div', 'u3l8-line ' + cls, html); p.appendChild(d); d.style.opacity = 0; return d; };

/* ====================================================================================================
 * Warm-up: The Treasure Map. 10 paces on 060°, then 10 paces on 180°.
 * ==================================================================================================== */
function mountMap() {
  const host = document.getElementById('u3l8-map'); if (!host) return;
  const W = 560, H = 360, F = new Fig(host, { width: W, height: H }), L0 = F.L0;
  const wob = (cx, cy, rx, ry, n, amp, seed) => { const pts = []; for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2, k = 1 + amp * Math.sin(i * 2.3 + seed) * Math.cos(i * 1.7 + seed * 0.5); pts.push([cx + rx * k * Math.cos(a), cy + ry * k * Math.sin(a)]); } return pts; };
  svgEl('rect', { x: 3, y: 3, width: W - 6, height: H - 6, rx: 18, fill: '#f2e2bb', stroke: '#b38b52', 'stroke-width': 3 }, L0);
  svgEl('rect', { x: 16, y: 16, width: W - 32, height: H - 32, rx: 12, fill: '#cfe2df', stroke: '#9fbfbb', 'stroke-width': 2 }, L0);
  [[60, 60], [120, 330], [470, 335], [80, 190], [520, 200]].forEach(([x, y]) => svgEl('path', { d: `M${x} ${y}q8 -7 16 0t16 0`, fill: 'none', stroke: '#86aba6', 'stroke-width': 2.4, 'stroke-linecap': 'round' }, L0));
  svgEl('path', { d: ptsD(wob(300, 226, 238, 132, 28, 0.07, 1.3), true), fill: '#ecd7a3', stroke: '#b9955c', 'stroke-width': 3, 'stroke-linejoin': 'round' }, L0);
  svgEl('path', { d: ptsD(wob(372, 268, 64, 30, 14, 0.12, 4), true), fill: '#9cc27a', 'fill-opacity': 0.55, stroke: 'none' }, L0);
  // compass rose (sea, top right)
  const RC = [486, 72];
  for (let k = 0; k < 8; k++) { const a = rad(k * 45 - 90), L = k % 2 ? 22 : 40, w = k % 2 ? 6 : 9, tip = addP(RC, uv(a), L), l = addP(RC, uv(a + Math.PI / 2), w), r = addP(RC, uv(a - Math.PI / 2), w);
    svgEl('path', { d: ptsD([tip, l, RC, r], true), fill: k === 0 ? '#c93a33' : k % 2 ? '#c9b07a' : '#6b5330', stroke: '#4d3a1f', 'stroke-width': 1 }, L0); }
  svgEl('circle', { cx: RC[0], cy: RC[1], r: 4, fill: '#4d3a1f' }, L0);
  F.lab([RC[0], RC[1] - 42], '<b>N</b>', { pos: 'n', cls: 'u3l8-mapn', gap: 0 });
  // palm tree at the start
  const S = [178, 246], u = 168, TU = addP(S, [sn(60), -cs(60)], u), X = addP(TU, [0, 1], u);
  const tr = svgEl('g', { transform: 'translate(-34 4)' }, L0);
  svgEl('path', { d: `M${S[0] - 4} ${S[1] + 6}C${S[0] - 10} ${S[1] - 18} ${S[0] - 2} ${S[1] - 40} ${S[0] + 8} ${S[1] - 58}`, fill: 'none', stroke: '#7a5228', 'stroke-width': 7, 'stroke-linecap': 'round' }, tr);
  const top = [S[0] + 8, S[1] - 58];
  [[-150, 34], [-110, 30], [-40, 32], [10, 34], [-75, 26]].forEach(([a, L]) => { const e = addP(top, uv(rad(a)), L), m = addP(mid(top, e), uv(rad(a - 90)), 9); svgEl('path', { d: `M${f1(top[0])} ${f1(top[1])}Q${f1(m[0])} ${f1(m[1])} ${f1(e[0])} ${f1(e[1])}`, fill: 'none', stroke: '#2f7d32', 'stroke-width': 7, 'stroke-linecap': 'round' }, tr); });
  svgEl('circle', { cx: S[0], cy: S[1], r: 6, fill: '#7a5228' }, F.L3);
  F.lab([S[0] - 30, S[1] + 14], 'palm tree', { pos: 'sw', cls: 'u3l8-mapl' });
  // the walk
  const n0 = northLine(F, S, { hide: true, up: 70 }), a0 = bArc(F, S, 0, 60, 40, { color: L1, hide: true, label: T('060^\\circ'), lr: 22 });
  const w1 = F.pathD(ptsD([S, TU]), { color: '#5a3d1e', width: 5, dash: '2 13', hide: true });
  const nT = northLine(F, TU, { hide: true, up: 56 }), aT = bArc(F, TU, 0, 180, 30, { color: L2, hide: true, label: T('180^\\circ'), lr: 20, at: 0.5 });
  const w2 = F.pathD(ptsD([TU, X]), { color: '#5a3d1e', width: 5, dash: '2 13', hide: true });
  const turn = F.dot(TU, { color: '#5a3d1e', r: 5, hide: true });
  const xg = F.grp({ hide: true, layer: F.L3 });
  F.pathD(`M${X[0] - 13} ${X[1] - 13}L${X[0] + 13} ${X[1] + 13}M${X[0] + 13} ${X[1] - 13}L${X[0] - 13} ${X[1] + 13}`, { color: '#c93a33', width: 6, layer: xg });
  const home = F.pathD(ptsD([X, S]), { color: '#c93a33', width: 3.5, dash: true, hide: true });
  const q = F.lab(mid(S, X), T('?'), { cls: 'u3l8-mapq', hide: true });
  const l1 = F.lab(addP(mid(S, TU, 0.62), unit([TU[1] - S[1], -(TU[0] - S[0])]), -24), '10 paces', { cls: 'u3l8-mapl', hide: true }), l2 = F.lab(mid(TU, X, 0.62), '10 paces', { cls: 'u3l8-mapl', hide: true, pos: 'e', gap: 12 });
  const info = F.lab([30, 30], '', { pos: 'se', cls: 'u3l8-mapinfo', gap: 0 });
  const msgs = ['Start at the palm tree, facing north.', 'Leg 1: 10 paces on a bearing of 060°.', 'Leg 2: 10 paces on a bearing of 180°. Dig!', 'How far is the treasure from the tree?'];
  const bs = ['u3l8-m1', 'u3l8-m2', 'u3l8-m3', 'u3l8-m0'].map((id) => document.getElementById(id));
  let k = 0, busy = false;
  const paint = () => { info.innerHTML = msgs[k]; bs[0].disabled = k !== 0; bs[1].disabled = k !== 1; bs[2].disabled = k !== 2; };
  const run = async (fn) => { if (busy) return; busy = true; try { await fn(liveCtx()); } finally { busy = false; paint(); } };
  bs[0].addEventListener('click', () => run(async (c) => { k = 1; paint(); await drawOn(c, n0, 400); await drawOn(c, a0, 600); await drawOn(c, w1, 900); await show(c, l1); await popIn(c, turn); }));
  bs[1].addEventListener('click', () => run(async (c) => { k = 2; paint(); await drawOn(c, nT, 400); await drawOn(c, aT, 600); await drawOn(c, w2, 900); await show(c, l2); xg.style.opacity = 1; await pop(c, xg, 420); }));
  bs[2].addEventListener('click', () => run(async (c) => { k = 3; paint(); await drawOn(c, home, 700); await popIn(c, q); }));
  bs[3].addEventListener('click', () => { if (busy) return; k = 0; [n0, n0.lab, a0, a0.lab, w1, nT, nT.lab, aT, aT.lab, w2, turn, xg, home, q, l1, l2].forEach((e) => { if (e) e.style.opacity = 0; }); paint(); });
  paint();
}

/* ====================================================================================================
 * explainer: choosing a method (decision chart walked for each part of Example 1)
 * ==================================================================================================== */
const CHN = {
  q1: { x: 150, y: 44, w: 286, h: 62, html: '<b>Is it a right triangle?</b>', cls: 'bk-round' },
  a1: { x: 464, y: 44, w: 286, h: 70, html: '<b>Primary ratios</b>SOH CAH TOA, Pythagoras', color: KN },
  q2: { x: 150, y: 152, w: 286, h: 76, html: '<b>Is a full pair known?</b>an angle <i>and</i> its opposite side', cls: 'bk-round' },
  a2: { x: 464, y: 152, w: 286, h: 76, html: '<b>Sine law</b>finding an angle: check the ambiguous case', color: PAIR },
  q3: { x: 150, y: 262, w: 286, h: 62, html: '<b>SAS or SSS?</b>', cls: 'bk-round' },
  a3: { x: 464, y: 262, w: 286, h: 76, html: '<b>Cosine law</b>SAS → third side · SSS → an angle', color: L2 },
  x: { x: 150, y: 364, w: 286, h: 62, html: '<b>Can’t be solved</b>AAA: the shape, but no size', color: UNK, cls: 'bk-dashed' }
};
const CHE = [{ from: 'q1', to: 'a1', label: 'yes' }, { from: 'q1', to: 'q2', label: 'no' }, { from: 'q2', to: 'a2', label: 'yes' }, { from: 'q2', to: 'q3', label: 'no' },
  { from: 'q3', to: 'a3', label: 'yes' }, { from: 'q3', to: 'x', label: 'no' }];
const NO_RT = 'Is it a right triangle? <b>No</b>: no angle is ' + T('90^\\circ') + '.';
const CH = {
  a: { lab: '(a)', V: 'ABC', ang: [34, 56, 90], ask: `Example 1(a): ${T('\\triangle ABC')}: ${T('\\angle C=90^\\circ')}, ${T('\\angle A=34^\\circ')}, ${T('c=12')}; find ${T('b')}.`,
    marks: { C: ['90^\\circ', 'k', 'right'], A: ['34^\\circ', 'k'], c: ['12', 'k'], b: ['b=?', 'u'] }, path: ['q1', 'a1'],
    caps: [`Is it a right triangle? <b>Yes</b>: ${T('\\angle C=90^\\circ')}.`, `<b>Primary ratios.</b> ${T('c')} is the hypotenuse and ${T('b')} is adjacent to ${T('\\angle A')}: ${T('b=12\\cos 34^\\circ')}.`] },
  b: { lab: '(b)', V: 'DEF', ang: [49.6, 78.4, 52], ask: `Example 1(b): ${T('\\triangle DEF')}: ${T('d=7')}, ${T('e=9')}, ${T('\\angle F=52^\\circ')}; find ${T('f')}.`,
    marks: { d: ['7', 'k'], e: ['9', 'k'], F: ['52^\\circ', 'k'], f: ['f=?', 'u'] }, path: ['q1', 'q2', 'q3', 'a3'],
    caps: [NO_RT, `A full pair? ${T('\\angle F')} is known but ${T('f')} is not; ${T('d')} and ${T('e')} are known but not their angles. <b>No.</b>`,
      `${T('\\angle F')} is the angle <b>between</b> ${T('d')} and ${T('e')}: <b>SAS</b>.`, `<b>Cosine law</b> for the third side: ${T('f^2=7^2+9^2-2(7)(9)\\cos 52^\\circ')}.`] },
  c: { lab: '(c)', V: 'GHJ', ang: [41, 58.5, 80.5], ask: `Example 1(c): ${T('\\triangle GHJ')}: ${T('\\angle G=41^\\circ')}, ${T('g=10')}, ${T('h=13')}; find ${T('\\angle H')}.`,
    marks: { G: ['41^\\circ', 'p'], g: ['10', 'p'], h: ['13', 'k'], H: ['?', 'u'] }, path: ['q1', 'q2', 'a2'],
    caps: [NO_RT, `${T('\\angle G')} and ${T('g')} (opposite it) are a <b>full pair</b>. <b>Yes.</b>`,
      `<b>Sine law:</b> ${T('\\frac{\\sin H}{13}=\\frac{\\sin 41^\\circ}{10}')}. Finding an angle from SSA: <b>check for a second answer</b>.`] },
  d: { lab: '(d)', V: 'KLM', ang: [24.62, 41.81, 113.58], ask: `Example 1(d): ${T('\\triangle KLM')}: ${T('k=5')}, ${T('l=8')}, ${T('m=11')}; find the largest angle.`,
    marks: { k: ['5', 'k'], l: ['8', 'k'], m: ['11', 'k'], M: ['?', 'u'] }, path: ['q1', 'q2', 'q3', 'a3'],
    caps: [`Is it a right triangle? ${T('5^2+8^2=89')} but ${T('11^2=121')}: <b>no</b>.`, 'No angle is known, so there is no full pair. <b>No.</b>', 'All three sides are known: <b>SSS</b>.',
      `<b>Cosine law</b> for ${T('\\angle M')}: the largest angle is opposite the longest side, ${T('m=11')}.`] },
  e: { lab: '(e)', V: 'PQR', ang: [50, 60, 70], ghost: true, ask: `Example 1(e): ${T('\\triangle PQR')}: ${T('\\angle P=50^\\circ')}, ${T('\\angle Q=60^\\circ')}, ${T('\\angle R=70^\\circ')}; find ${T('p')}.`,
    marks: { P: ['50^\\circ', 'k'], Q: ['60^\\circ', 'k'], R: ['70^\\circ', 'k'], p: ['p=?', 'u'] }, path: ['q1', 'q2', 'q3', 'x'],
    caps: [NO_RT, 'No side is known at all, so there is no full pair. <b>No.</b>', 'Only angles are known: <b>AAA</b>, not SAS or SSS. <b>No.</b>',
      `A smaller (or bigger) triangle has the <b>same angles</b>: the size isn't fixed, so ${T('p')} <b>can't be found</b>.`] },
  f: { lab: '(f)', V: 'STU', ang: [35, 105, 40], ask: `Example 1(f): ${T('\\triangle STU')}: ${T('\\angle S=35^\\circ')}, ${T('\\angle T=105^\\circ')}, ${T('s=8')}; find ${T('u')}.`,
    marks: { S: ['35^\\circ', 'p'], T: ['105^\\circ', 'k'], s: ['8', 'p'], u: ['u=?', 'u'], U: ['40^\\circ', 'k', null, 2] }, path: ['q1', 'q2', 'a2'],
    caps: [NO_RT, `${T('\\angle S')} and ${T('s')} are a <b>full pair</b>. <b>Yes.</b> (Also ${T('\\angle U=180^\\circ-35^\\circ-105^\\circ=40^\\circ')}.)`,
      `<b>Sine law</b> with the full pair: ${T('\\frac{u}{\\sin 40^\\circ}=\\frac{8}{\\sin 35^\\circ}')}.`] }
};
const KC = { k: KN, p: PAIR, u: UNK };
/* triangle with the given angles (deg, for vertices V[0..2]), largest angle on top, fitted to a box */
function triShape(angs) {
  const k = angs.indexOf(Math.max(...angs)), i = (k + 1) % 3, j = (k + 2) % 3, L = sn(angs[k]), sik = sn(angs[j]), pts = [];
  pts[i] = [0, 0]; pts[j] = [L, 0]; pts[k] = [sik * cs(angs[i]), sik * sn(angs[i])]; return pts;
}
function triFig(host, o, d, P0) {
  const F = new Fig(host, o), m = triShape(d.ang), P = P0 || fitter(m, o.width, o.tH || o.height, [44, 44, 44, 44]), px = m.map(P), G = cen(px), V = d.V.split('');
  F.line(px, { closed: true, width: 3.5 });
  px.forEach((p, i) => F.lab(away(p, G, 20), `<b>${V[i]}</b>`, { cls: 'u3l8-vname' }));
  const marks = {};
  for (const key in d.marks) {
    const [t, kind, right, late] = d.marks[key], color = KC[kind], vi = V.indexOf(key);
    if (vi >= 0) { // an angle
      const A = px[vi], B = px[(vi + 1) % 3], C = px[(vi + 2) % 3];
      marks[key] = angMark(F, A, B, C, { r: 26, right: !!right, color, label: T(kind === 'u' ? cU(t) : t), lcolor: color, hide: true, ld: right ? 34 : null, lcls: kind === 'p' ? 'u3l8-lpair' : '' });
    } else { // a side: lower-case letter opposite its vertex
      const vi2 = V.indexOf(key.toUpperCase()), B = px[(vi2 + 1) % 3], C = px[(vi2 + 2) % 3];
      const seg = F.line([B, C], { color, width: 5, hide: true });
      seg.lab = F.lab(sideAt(B, C, G, 24), T(t), { color, hide: true, cls: kind === 'p' ? 'u3l8-lpair' : '' }); marks[key] = seg;
    }
    marks[key].late = late;
  }
  return { F, px, marks, P };
}
const chooser = {
  title: 'Which tool? Walk the decision chart',
  height: 410, minW: 960,
  choices: Object.keys(CH).map((k) => ({ v: k, label: 'Example 1' + CH[k].lab })),
  ask: (v) => CH[v].ask,
  make(stage, v, ex) {
    const d = CH[v], fcx = ex.W - 624;
    const tri = triFig(stage, { x: 6, y: 4, width: fcx - 16, height: 400, tH: 300 }, d);
    const lg = h('div', 'u3l8-legend', `<span class="u3l8-key u3l8-kk">known</span><span class="u3l8-key u3l8-kp">full pair</span><span class="u3l8-key u3l8-ku">to find</span>`);
    add(stage, lg, 14, 322); lg.style.position = 'absolute';
    let ghost = null;
    if (d.ghost) { const P = fitter(triShape(d.ang), fcx - 16, 300, [44, 44, 44, 44]), s = 0.36, g = triShape(d.ang).map(P), G = cen(g);
      const gp = g.map((p) => [fcx - 110 + (p[0] - G[0]) * s, 348 + (p[1] - G[1]) * s]);
      ghost = tri.F.grp({ hide: true }); tri.F.pathD(ptsD(gp, true), { color: AC, width: 3, layer: ghost }); tri.F.tint(gp, { color: AC, fo: 0.15, layer: ghost }); }
    const F = new Flowchart(stage, { x: fcx, y: 4, width: 616, height: 402, nodes: CHN, edges: CHE });
    const early = Object.values(tri.marks).filter((m) => m.late == null);
    const steps = [{ cap: 'Mark what is <b>known</b> on the sketch, and what we want to <b>find</b>.', run: async (c) => { for (const m of early) { await drawOn(c, m, 300); } } }];
    d.path.forEach((id, i) => steps.push({
      cap: d.caps[i],
      run: async (c) => {
        if (i) await F.go(c, d.path[i - 1], id); await F.visit(c, id);
        for (const m of Object.values(tri.marks)) if (m.late === i) await drawOn(c, m, 300);
        if (ghost && id === 'x') { ghost.style.opacity = 1; await pop(c, ghost, 500); }
      }
    }));
    return steps;
  }
};

/* =============================== explainer: clock hands =============================== */
const CK = { demo: { lab: 'Try 9:45', H: 9, M: 45 }, a: { lab: 'Example 2(a) check', H: 4, M: 0 }, b: { lab: 'Example 2(b) check', H: 2, M: 30 } };
const clockG = (d) => { const mA = 6 * d.M, hA = 30 * (d.H % 12) + 0.5 * d.M, diff = Math.abs(hA - mA), ang = diff > 180 ? 360 - diff : diff, d2 = 81 + 36 - 108 * cs(ang); return { mA, hA, diff, ang, d2, dd: Math.sqrt(d2) }; };
const tm = (d) => `${d.H}{:}${String(d.M).padStart(2, '0')}`;
const clock = {
  title: 'Clock hands make a triangle',
  height: 420, minW: 940,
  choices: Object.keys(CK).map((k) => ({ v: k, label: CK[k].lab })),
  ask: (v) => `At ${T(tm(CK[v]))}, find the angle between the hands (minute hand 9 cm, hour hand 6 cm) and the distance between their tips.`,
  make(stage, v, ex) {
    const d = CK[v], g = clockG(d), O = [212, 210], R = 196, MH = 150, HH = 100;
    const F = new Fig(stage, { x: 6, y: 0, width: 424, height: 420 });
    svgEl('circle', { cx: O[0], cy: O[1], r: R, fill: '#fff', stroke: INK, 'stroke-width': 4 }, F.L0);
    for (let i = 0; i < 60; i++) { const a = rad(i * 6 - 90), big = i % 5 === 0; F.pathD(ptsD([addP(O, uv(a), big ? R - 18 : R - 9), addP(O, uv(a), R - 3)]), { color: big ? INK : GRAY, width: big ? 4 : 2, layer: F.L0 }); }
    for (let k = 1; k <= 12; k++) F.lab(addP(O, uv(rad(k * 30 - 90)), R - 38), String(k), { cls: 'u3l8-cnum' });
    const mH = F.pathD('', { color: L1, width: 7 }), hH = F.pathD('', { color: L2, width: 9 });
    const setH = (p, L, a) => { const e = addP(O, uv(sa(a)), L); p.setAttribute('d', ptsD([O, e])); };
    setH(mH, MH, 0); setH(hH, HH, 0); F.dot(O, { r: 8 });
    const mTip = addP(O, uv(sa(g.mA)), MH), hTip = addP(O, uv(sa(g.hA)), HH);
    const am = g.mA > 0 ? bArc(F, O, 0, g.mA, 122, { color: L1, hide: true, label: T(`${g.mA}^\\circ`), lr: -24, occ: [g.hA, 0, g.mA] }) : null;
    const ah = bArc(F, O, 0, g.hA, 46, { color: L2, hide: true, label: T(dg(g.hA)), lr: 20, occ: [g.mA, 0, g.hA] });
    const w = angMark(F, O, mTip, hTip, { r: 84, color: AC, fo: 0.16, label: T(cA(dg(g.ang))), hide: true, ld: 108 });
    if (g.ang < 40) { const st = n360(sweepBetween(O, mTip, hTip) > 0 ? g.mA : g.hA), L = addP(O, uv(sa(st - 24)), 78); w.lab.style.left = L[0] + 'px'; w.lab.style.top = L[1] + 'px'; }
    const dl = F.pathD(ptsD([mTip, hTip]), { color: UNK, width: 4, dash: true, hide: true });
    const G = cen([O, mTip, hTip]);
    const tipLab = (tip, other, html, color) => { const n = unit([-(tip[1] - O[1]), tip[0] - O[0]]), M = mid(O, tip, 0.78), sg = (M[0] - other[0]) * n[0] + (M[1] - other[1]) * n[1] >= 0 ? 1 : -1; return F.lab(addP(M, n, 20 * sg), html, { color, hide: true, cls: 'u3l8-lsm u3l8-halo' }); };
    const lm = tipLab(mTip, hTip, T('9\\text{ cm}'), L1), lh = tipLab(hTip, mTip, T('6\\text{ cm}'), L2);
    const ld = F.lab(away(mid(mTip, hTip), G, 18), T(cU('d')), { hide: true });
    const pn = panel(stage, 446, 10, ex.W - 458, 400, `The hands at ${T(tm(d))}`);
    const mTxt = d.M === 0 ? `\\text{at the 12: }0^\\circ` : `\\text{at the ${d.M / 5}: }${d.M / 5}\\times30^\\circ=${g.mA}^\\circ`;
    const hTxt = d.M === 0 ? `\\text{at the ${d.H}: }${d.H}\\times30^\\circ=${g.hA}^\\circ` : `${d.H}\\times30^\\circ+${d.M}\\times0.5^\\circ=${dg(g.hA)}`;
    const hi = Math.max(g.hA, g.mA), lo = Math.min(g.hA, g.mA);
    const aTxt = g.diff > 180 ? `360^\\circ-(${dg(hi)}-${dg(lo)})=${dg(g.ang)}` : `${dg(hi)}-${dg(lo)}=${cA(dg(g.ang))}`;
    const ln = [
      lineIn(pn, `<span class="u3l8-lk">minute</span>${T(mTxt)}`), lineIn(pn, `<span class="u3l8-lk">hour</span>${T(hTxt)}`),
      lineIn(pn, `<span class="u3l8-lk">angle</span>${T(aTxt)}`), lineIn(pn, `<span class="u3l8-lk">SAS</span>${T(`d^2=9^2+6^2-2(9)(6)\\cos ${dg(g.ang)}`)}`),
      lineIn(pn, T(`d^2${sq(g.d2, 2)},\\quad d\\approx${nt(g.dd, 1, true)}\\text{ cm}`), 'u3l8-line-ans')
    ];
    return [
      { cap: d.M === 0 ? `The minute hand points at the 12. Clock angles are measured <b>clockwise from 12</b>, like bearings.` : `The minute hand moves ${T('30^\\circ')} per number: at the ${d.M / 5}, it is ${T(`${g.mA}^\\circ`)} clockwise from 12.`,
        run: async (c) => { await tween(c, 900, (t) => setH(mH, MH, g.mA * t)); if (am) await drawOn(c, am, 500); await show(c, ln[0]); } },
      { cap: d.M === 0 ? `The hour hand points at the ${d.H}: ${T(`${d.H}\\times30^\\circ=${g.hA}^\\circ`)}.` : `The hour hand moves ${T('0.5^\\circ')} each minute, so at ${T(tm(d))} it is <b>past</b> the ${d.H}: ${T(`${d.H}(30^\\circ)+${d.M}(0.5^\\circ)=${dg(g.hA)}`)}.`,
        run: async (c) => { await tween(c, 1000, (t) => setH(hH, HH, g.hA * t)); await drawOn(c, ah, 500); await show(c, ln[1]); } },
      { cap: `The angle between the hands: ${T(aTxt)}.`, run: async (c) => { dim(am, ah); await drawOn(c, w, 500); await show(c, ln[2]); } },
      { cap: `Join the tips. Two sides (9 cm and 6 cm) and the angle <b>between</b> them: <b>SAS</b>, so the <b>cosine law</b>.`,
        run: async (c) => { await Promise.all([show(c, lm), show(c, lh)]); await drawOn(c, dl, 600); await show(c, ld); await show(c, ln[3]); } },
      { cap: `${T(`d^2=81+36-108\\cos ${dg(g.ang)}${sq(g.d2, 2)}`)}, so the tips are about <b>${nt(g.dd, 1, true)} cm</b> apart.`, run: (c) => show(c, ln[4]) }
    ];
  }
};

/* =============================== explainer: bearing forms (compass rose) =============================== */
const BF = {
  n140: { lab: 'Notes: ' + T('140^\\circ'), b: 140, ask: `Write the bearing ${T('140^\\circ')} in N/S…E/W form.` },
  a: { lab: '(a) ' + T('065^\\circ'), b: 65 }, b: { lab: '(b) ' + T('250^\\circ'), b: 250 }, c: { lab: '(c) ' + T('310^\\circ'), b: 310 }, d: { lab: '(d) ' + T('165^\\circ'), b: 165 },
  e: { lab: '(e) ' + T(qT('S', 15, 'W')), q: ['S', 15, 'W'] }, f: { lab: '(f) ' + T(qT('N', 20, 'W')), q: ['N', 20, 'W'] }, g: { lab: '(g) ' + T(qT('S', 62, 'E')), q: ['S', 62, 'E'] },
  h: { lab: '(h) back', back: 300, ask: `Example 3(h): ${T('B')} is on a bearing of ${T('300^\\circ')} from ${T('A')}. Find the bearing of ${T('A')} from ${T('B')}.` }
};
const qToB = (ns, a, ew) => (ns === 'N' ? (ew === 'E' ? a : 360 - a) : (ew === 'E' ? 180 - a : 180 + a));
const ROWS = [['N', 'E', '\\theta'], ['S', 'E', '180^\\circ-\\theta'], ['S', 'W', '180^\\circ+\\theta'], ['N', 'W', '360^\\circ-\\theta']];
const bearingForms = {
  title: 'Two ways to write a direction',
  height: 420, minW: 940,
  choices: [{ v: 'n140', label: BF.n140.lab }, { sep: 'Example 3' }, ...'abcdefgh'.split('').map((k) => ({ v: k, label: BF[k].lab }))],
  ask: (v) => BF[v].ask || (BF[v].q ? `Example 3${BF[v].lab.slice(0, 3)}: write ${T(qT(...BF[v].q))} as a three-digit bearing.` : `Example 3${BF[v].lab.slice(0, 3)}: write ${T(bT(BF[v].b))} in N/S…E/W form.`),
  make(stage, v, ex) {
    const d = BF[v];
    const pn = panel(stage, 470, 10, ex.W - 482, 400, 'N/S…E/W form ↔ bearing');
    if (d.back != null) return backSteps(stage, ex, d, pn);
    const O = [228, 214], R = 166, F = new Fig(stage, { x: 4, y: 0, width: 460, height: 420 });
    svgEl('circle', { cx: O[0], cy: O[1], r: R, fill: '#fff', stroke: '#c9c3b4', 'stroke-width': 2.5 }, F.L0);
    for (let i = 0; i < 36; i++) { const a = rad(i * 10 - 90), big = i % 3 === 0; F.pathD(ptsD([addP(O, uv(a), big ? R - 14 : R - 7), addP(O, uv(a), R)]), { color: big ? '#8a8f99' : '#c0c4cb', width: big ? 2.6 : 1.6, layer: F.L0 }); }
    F.pathD(ptsD([[O[0], O[1] - R], [O[0], O[1] + R]]), { color: '#b4b9c2', width: 2, layer: F.L0 }); F.pathD(ptsD([[O[0] - R, O[1]], [O[0] + R, O[1]]]), { color: '#b4b9c2', width: 2, layer: F.L0 });
    [['N', 0], ['E', 90], ['S', 180], ['W', 270]].forEach(([t, b]) => F.lab(addP(O, uv(sa(b)), R + 16), `<b>${t}</b>`, { cls: 'u3l8-rosel' }));
    [['000', [O[0] + 14, O[1] - R - 16], 'e'], ['090', [O[0] + R + 24, O[1] + 14], 's'], ['180', [O[0] + 14, O[1] + R + 16], 'e'], ['270', [O[0] - R - 24, O[1] + 14], 's']].forEach(([t, p, pos]) => F.lab(p, T(`${t}^\\circ`), { pos, cls: 'u3l8-rosen', gap: 2 }));
    F.dot(O, { r: 6 });
    const halfN = F.pathD(ptsD([O, [O[0], O[1] - R]]), { color: L1, width: 6, hide: true }), halfS = F.pathD(ptsD([O, [O[0], O[1] + R]]), { color: PAIR, width: 6, hide: true });
    const halfNa = F.pathD(ptsD([O, [O[0], O[1] - R]]), { color: PAIR, width: 6, hide: true });
    const ray = F.pathD('', { color: INK, width: 4.5, hide: true }), rayH = arrowHead(F.L3, 0, 0, 1, 0, { color: INK, width: 4 }); rayH.style.opacity = 0;
    const setRay = (b) => { const e = addP(O, uv(sa(b)), R - 10); ray.setAttribute('d', ptsD([O, e])); rayH.setAttribute('points', [[e[0], e[1]], addP(addP(e, uv(sa(b)), -17), uv(sa(b) + Math.PI / 2), 8), addP(addP(e, uv(sa(b)), -17), uv(sa(b) - Math.PI / 2), 8)].map((p) => f1(p[0]) + ',' + f1(p[1])).join(' ')); };
    const bArcEl = F.pathD('', { color: L1, width: 3.2, hide: true }), qArcEl = F.pathD('', { color: PAIR, width: 3.2, hide: true });
    const bLab = F.lab([0, 0], '', { color: L1, hide: true, cls: 'u3l8-big' }), qLab = F.lab([0, 0], '', { color: PAIR, hide: true, cls: 'u3l8-big' });
    const setArc = (el, lab, from, sw, r, txt) => { el.setAttribute('d', Math.abs(sw) < 0.01 ? 'M0 0' : arcD(O, sa(from), rad(sw), r)); lab.innerHTML = txt; const p = addP(O, uv(sa(from + sw / 2)), r + 26); lab.style.left = p[0] + 'px'; lab.style.top = p[1] + 'px'; };
    // the rule table
    const tb = h('table', 'u3l8-rule'); tb.innerHTML = `<tr><th>N/S…E/W</th><th>bearing</th></tr>` + ROWS.map(([ns, ew, f]) => `<tr><td>${T(`\\text{${ns}}\\,\\theta\\,\\text{${ew}}`)}</td><td>${T(f)}</td></tr>`).join('');
    pn.appendChild(tb);
    const rowEl = (ns, ew) => tb.rows[1 + ROWS.findIndex((r) => r[0] === ns && r[1] === ew)];
    if (d.b != null) {
      const b = d.b, [ns, a, ew] = quad(b), from = ns === 'N' ? 0 : 180, sw = (ns === 'N') === (ew === 'E') ? a : -a;
      const fTxt = ns === 'N' ? (ew === 'E' ? `${b}^\\circ` : `360^\\circ-${b}^\\circ=${a}^\\circ`) : (ew === 'E' ? `180^\\circ-${b}^\\circ=${a}^\\circ` : `${b}^\\circ-180^\\circ=${a}^\\circ`);
      const r1 = lineIn(pn, `<span class="u3l8-lk">angle</span>${T(`\\theta=${fTxt}`)}`), r2 = lineIn(pn, T(`${bT(b)}=${qT(ns, a, ew)}`), 'u3l8-line-ans u3l8-big');
      return [
        { cap: `Face <b>north</b>. A bearing turns <b>clockwise from north</b>.`, run: (c) => drawOn(c, halfN, 450) },
        { cap: `Turn clockwise ${T(`${b}^\\circ`)}: the bearing ${T(bT(b))}.`, run: async (c) => { ray.style.opacity = 1; rayH.style.opacity = 1; bArcEl.style.opacity = 1; bLab.style.opacity = 1;
          await tween(c, 1100, (t) => { setRay(b * t); setArc(bArcEl, bLab, 0, b * t, 56, T(bT(Math.round(b * t)))); }); } },
        { cap: `The arrow is ${ns === 'N' ? 'above' : 'below'} the east–west line, so start from <b>${ns === 'N' ? 'north' : 'south'}</b>.`, run: (c) => drawOn(c, ns === 'N' ? halfNa : halfS, 450) },
        { cap: `Then turn toward <b>${ew === 'E' ? 'east' : 'west'}</b>: ${T(`\\theta=${fTxt}`)}.`,
          run: async (c) => { qArcEl.style.opacity = 1; qLab.style.opacity = 1; await tween(c, 800, (t) => setArc(qArcEl, qLab, from, sw * t, 112, T(`${fx(a * t, 0)}^\\circ`))); rowEl(ns, ew).classList.add('on'); await show(c, r1); } },
        { cap: `${T(bT(b))} is ${T(qT(ns, a, ew))}.`, run: (c) => show(c, r2) }
      ];
    }
    const [ns, a, ew] = d.q, b = qToB(ns, a, ew), from = ns === 'N' ? 0 : 180, sw = (ns === 'N') === (ew === 'E') ? a : -a;
    const fTxt = ROWS.find((r) => r[0] === ns && r[1] === ew)[2].replace('\\theta', `${a}^\\circ`) + (ns === 'N' && ew === 'E' ? '' : `=${b}^\\circ`);
    const r1 = lineIn(pn, `<span class="u3l8-lk">bearing</span>${T(fTxt)}`), r2 = lineIn(pn, T(`${qT(ns, a, ew)}=${bT(b)}`), 'u3l8-line-ans u3l8-big');
    return [
      { cap: `${T(qT(ns, a, ew))}: face <b>${ns === 'N' ? 'north' : 'south'}</b>…`, run: (c) => drawOn(c, ns === 'N' ? halfNa : halfS, 450) },
      { cap: `…and turn ${T(`${a}^\\circ`)} toward <b>${ew === 'E' ? 'east' : 'west'}</b>.`, run: async (c) => { ray.style.opacity = 1; rayH.style.opacity = 1; qArcEl.style.opacity = 1; qLab.style.opacity = 1;
        await tween(c, 800, (t) => { setRay(from + sw * t); setArc(qArcEl, qLab, from, sw * t, 112, T(`${fx(a * t, 0)}^\\circ`)); }); } },
      { cap: `Now measure from <b>north, clockwise</b>, all the way round to the arrow: ${T(fTxt)}.`, run: async (c) => { await drawOn(c, halfN, 300); bArcEl.style.opacity = 1; bLab.style.opacity = 1;
        await tween(c, 1100, (t) => setArc(bArcEl, bLab, 0, b * t, 56, T(bT(Math.round(b * t))))); rowEl(ns, ew).classList.add('on'); await show(c, r1); } },
      { cap: `${T(qT(ns, a, ew))} is the bearing ${T(bT(b))}.`, run: (c) => show(c, r2) }
    ];
  }
};
function backSteps(stage, ex, d, pn) {
  const F = new Fig(stage, { x: 4, y: 0, width: 460, height: 420 }), A = [352, 318], L = 270, B = addP(A, uv(sa(d.back)), L), bb = n360(d.back - 180);
  const nA = northLine(F, A, { up: 96 }), nB = northLine(F, B, { up: 96, down: 70, hide: true });
  F.dot(A, { r: 7 }); F.lab([A[0] + 10, A[1] + 6], `<b>A</b>`, { pos: 'se', cls: 'u3l8-vname' });
  const aA = bArc(F, A, 0, d.back, 46, { color: L1, hide: true, label: T(bT(d.back)), lr: 24, at: 0.62 });
  const ab = leg(F, A, B, { color: L1, hide: true }), dB = F.dot(B, { r: 7, hide: true }), nmB = F.lab([B[0] - 8, B[1] + 8], '<b>B</b>', { pos: 'sw', cls: 'u3l8-vname', hide: true });
  const nrm = unit([-(A[1] - B[1]), A[0] - B[0]]), off = (p) => addP(p, nrm, 13), back = leg(F, off(addP(B, unit(sub(A, B)), 14)), off(addP(A, unit(sub(B, A)), 40)), { color: BK, width: 3, dash: '9 7', hide: true });
  const aB = bArc(F, B, 0, bb, 40, { color: BK, hide: true, label: T(bT(bb)), lr: 22 });
  const r0 = lineIn(pn, `<span class="u3l8-lk">at A</span>${T(`\\text{bearing of }B=${bT(d.back)}`)}`);
  const r1 = lineIn(pn, `<span class="u3l8-lk">turn</span>${T(`${bT(d.back)}${d.back >= 180 ? '-' : '+'}180^\\circ=${bT(bb)}`)}`);
  const r2 = lineIn(pn, T(`\\text{bearing of }A\\text{ from }B=${bT(bb)}`), 'u3l8-line-ans');
  const r3 = lineIn(pn, 'Back bearing: <b>add</b> 180° to a bearing under 180°, <b>subtract</b> 180° from one of 180° or more.', 'u3l8-line-sm');
  pn.querySelector('.u3l8-ph').innerHTML = 'Back bearings';
  return [
    { cap: `${T('B')} is on a bearing of ${T(bT(d.back))} <b>from</b> ${T('A')}: the angle is measured <b>at</b> ${T('A')}, clockwise from north.`,
      run: async (c) => { await drawOn(c, aA, 700); await drawOn(c, ab, 700); await Promise.all([popIn(c, dB), show(c, nmB)]); await show(c, r0); } },
    { cap: `At ${T('B')}, draw a <b>new north line</b>. North lines are <b>parallel</b>.`, run: (c) => drawOn(c, nB, 500) },
    { cap: `To look back at ${T('A')}, turn around: the direction changes by ${T('180^\\circ')}.`, run: (c) => drawOn(c, back, 700) },
    { cap: `${T(`${bT(d.back)}-180^\\circ=${bT(bb)}`)}, measured at ${T('B')}, clockwise from north.`, run: async (c) => { await drawOn(c, aB, 700); await show(c, r1); } },
    { cap: `The bearing of ${T('A')} from ${T('B')} is ${T(bT(bb))}: the <b>back bearing</b>.`, run: async (c) => { await show(c, r2); await show(c, r3); } }
  ];
}

/* ====================================================================================================
 * STAR explainer: a compass-rose bearing builder (two legs from bearings and distances)
 * ==================================================================================================== */
function routeGeom(d) {
  const v = (b, L) => [L * sn(b), L * cs(b)];
  if (d.fan) { const P1 = v(d.b1, d.d1), P2 = v(d.b2, d.d2), diff = Math.abs(d.b2 - d.b1), inner = diff > 180 ? 360 - diff : diff; return { fan: true, pts: [[0, 0], P1, P2], diff, inner, dist: lawC(d.d1, d.d2, inner) }; }
  const Q = v(d.b1, d.d1), R = [Q[0] + d.d2 * sn(d.b2), Q[1] + d.d2 * cs(d.b2)];
  const back = n360(d.b1 + 180), diff = Math.abs(back - d.b2), inner = diff > 180 ? 360 - diff : diff;
  const PR = Math.hypot(R[0], R[1]), angP = angC(d.d1, PR, d.d2), bPR = n360(deg(Math.atan2(R[0], R[1]))), cw = n360(bPR - d.b1) < 180;
  return { pts: [[0, 0], Q, R], back, diff, inner, PR, sinP: d.d2 * sn(inner) / PR, angP, bPR, cw, ret: n360(bPR + 180) };
}
/* text pieces shared by the explainer, the builder and the Stand Up Break */
const rt = {
  back: (d, g) => `${bT(d.b1)}${d.b1 < 180 ? '+' : '-'}180^\\circ=${bT(g.back)}`,
  inner: (d, g) => { const hi = Math.max(g.back, d.b2), lo = Math.min(g.back, d.b2); return g.diff > 180 ? `360^\\circ-(${bT(hi)}-${bT(lo)})=${dg(g.inner, 1)}` : `${bT(hi)}-${bT(lo)}=${dg(g.inner, 1)}`; },
  bPR: (d, g) => { const raw = g.cw ? d.b1 + g.angP : d.b1 - g.angP; return `${bT(d.b1)}${g.cw ? '+' : '-'}${dg(g.angP)}${raw >= 360 ? '-360^\\circ' : raw < 0 ? '+360^\\circ' : ''}\\approx${bT(g.bPR)}`; },
  ret: (g) => `${bT(g.bPR)}${g.bPR < 180 ? '+' : '-'}180^\\circ=${bT(g.ret)}`
};
function routeFig(host, o, d, g, all = false) {
  const F = new Fig(host, o), Pf = fitter(g.pts, o.width, o.height, [96, 58, 86, 58]), px = g.pts.map(Pf), G = cen(px), hide = !all, nm = d.names || ['P', 'Q', 'R'];
  const E = { F, px };
  const [P, Q, R] = px;
  E.nP = northLine(F, P, { up: 70, hide: false });
  E.dP = F.dot(P, { r: 7 }); E.nmP = F.lab(away(P, G, 22), `<b>${nm[0]}</b>`, { cls: 'u3l8-vname' });
  if (g.fan) {
    const bis = (d.b1 + d.b2) / 2;
    E.a1 = bArc(F, P, 0, d.b1, 46, { color: L1, hide, label: T(bT(d.b1)), lr: 22, occ: [0, d.b1, d.b2, bis] });
    E.a2 = bArc(F, P, 0, d.b2, 76, { color: L2, hide, label: T(bT(d.b2)), lr: 22, occ: [0, d.b1, d.b2, bis, E.a1.lb] });
    E.l1 = leg(F, P, Q, { color: L1, hide }); E.l2 = leg(F, P, R, { color: L2, hide });
    E.t1 = F.lab(legLab(P, Q, R, 0.62), T(`${nt(d.d1, 1)}\\text{ km}`), { color: L1, hide, cls: 'u3l8-halo' }); E.t2 = F.lab(legLab(P, R, Q, 0.62), T(`${nt(d.d2, 1)}\\text{ km}`), { color: L2, hide, cls: 'u3l8-halo' });
    E.dQ = F.dot(Q, { r: 6, color: L1, hide }); E.dR = F.dot(R, { r: 6, color: L2, hide });
    E.w = angMark(F, P, Q, R, { r: 32, color: AC, label: T(cA(dg(g.inner, 0))), hide, ld: 60 });
    E.side = F.pathD(ptsD([Q, R]), { color: UNK, width: 3.5, dash: true, hide }); E.tS = F.lab(sideAt(Q, R, P, 24), T(cU('d')), { hide });
    return E;
  }
  const bisP = g.cw ? d.b1 + g.angP / 2 : d.b1 - g.angP / 2;
  E.a1 = bArc(F, P, 0, d.b1, 44, { color: L1, hide, label: T(bT(d.b1)), lr: 22, occ: [0, d.b1, g.bPR, bisP] });
  E.l1 = leg(F, P, Q, { color: L1, hide }); E.t1 = F.lab(legLab(P, Q, R, 0.62), T(`${nt(d.d1, 1)}\\text{ km}`), { color: L1, hide, cls: 'u3l8-halo' });
  E.dQ = F.dot(Q, { r: 7, hide }); E.nmQ = F.lab(away(Q, G, 22), `<b>${nm[1]}</b>`, { cls: 'u3l8-vname', hide });
  E.nQ = northLine(F, Q, { up: 70, down: 48, hide });
  E.a2 = bArc(F, Q, 0, d.b2, 36, { color: L2, hide, label: T(bT(d.b2)), lr: 20, occ: [0, 180, g.back, d.b2] });
  E.l2 = leg(F, Q, R, { color: L2, hide }); E.t2 = F.lab(legLab(Q, R, P, 0.62), T(`${nt(d.d2, 1)}\\text{ km}`), { color: L2, hide, cls: 'u3l8-halo' });
  E.dR = F.dot(R, { r: 7, hide }); E.nmR = F.lab(away(R, G, 22), `<b>${nm[2]}</b>`, { cls: 'u3l8-vname', hide });
  const bisQ = (() => { const a = sa(g.back), sw = sweepBetween(Q, P, R); return deg(a + sw / 2) + 90; })();
  E.aB = bArc(F, Q, 0, g.back, 58, { color: BK, hide, label: T(bT(g.back)), lr: 22, occ: [0, 180, g.back, d.b2, E.a2.lb, bisQ] });
  E.wQ = angMark(F, Q, P, R, { r: 26, color: AC, label: T(cA(dg(g.inner, 0))), hide, ld: 52 });
  E.side = F.pathD(ptsD([P, R]), { color: UNK, width: 3.5, dash: true, hide }); E.tS = F.lab(sideAt(P, R, Q, 24), T(cU(`${nt(g.PR, 1)}\\text{ km}`)), { hide });
  E.wP = angMark(F, P, Q, R, { r: 24, color: PAIR, label: T(`\\textcolor{${PAIR}}{${dg(g.angP)}}`), hide: true, ld: 46 });
  E.aPR = bArc(F, P, 0, g.bPR, 92, { color: UNK, hide: true, label: T(cU(bT(g.bPR))), lr: 22, occ: [0, d.b1, g.bPR] });
  E.nR = northLine(F, R, { up: 58, hide: true });
  E.aRet = bArc(F, R, 0, g.ret, 34, { color: UNK, hide: true, label: T(cU(bT(g.ret))), lr: 22, occ: [0, n360(d.b2 + 180), g.ret] });
  return E;
}
const RT = {
  ex4: { lab: 'Example 4 check', fan: true, b1: 50, d1: 135, b2: 165, d2: 120, names: ['A', '', ''],
    ask: `Example 4: one aircraft flies on ${T('050^\\circ')} at 540 km/h, the other on ${T('165^\\circ')} at 480 km/h. How far apart are they after 15 min?` },
  ex5: { lab: 'Example 5 check', b1: 60, d1: 18, b2: 170, d2: 25,
    ask: `Example 5: ${T('P')} to ${T('Q')}: 18 km on ${T('060^\\circ')}; ${T('Q')} to ${T('R')}: 25 km on ${T('170^\\circ')}. Find the distance and bearing from ${T('R')} back to ${T('P')}.` },
  left: { lab: 'A left turn', b1: 130, d1: 12, b2: 30, d2: 16,
    ask: `A boat sails 12 km on ${T('130^\\circ')}, then 16 km on ${T('030^\\circ')}. How far, and on what bearing, back to the start?` }
};
const route = {
  title: 'Bearing builder: two legs make a triangle',
  height: 470, minW: 960, capH: 92,
  choices: Object.keys(RT).map((k) => ({ v: k, label: RT[k].lab })),
  ask: (v) => RT[v].ask,
  make(stage, v, ex) {
    const d = RT[v], g = routeGeom(d), mw = 560, E = routeFig(stage, { x: 4, y: 0, width: mw, height: 470 }, d, g);
    const pn = panel(stage, mw + 14, 10, ex.W - mw - 26, 450, 'Working');
    if (g.fan) {
      const ln = [lineIn(pn, `<span class="u3l8-lk">plane 1</span>${T('540(0.25)=135\\text{ km}')}`), lineIn(pn, `<span class="u3l8-lk">plane 2</span>${T('480(0.25)=120\\text{ km}')}`),
        lineIn(pn, `<span class="u3l8-lk">angle</span>${T(`165^\\circ-50^\\circ=${cA('115^\\circ')}`)}`), lineIn(pn, `<span class="u3l8-lk">SAS</span>${T('d^2=135^2+120^2')}<br>${T('\\qquad-2(135)(120)\\cos 115^\\circ')}`),
        lineIn(pn, T(`d^2\\approx${nt(g.dist * g.dist, 1)},\\ \\ d\\approx${nt(g.dist, 0)}\\text{ km}`), 'u3l8-line-ans')];
      return [
        { cap: `Both planes leave the airport ${T('A')}. Draw a <b>north line</b>: bearings turn clockwise from north.`, run: (c) => pulse(c, E.nP, 1.06) },
        { cap: `In 15 min ${T('=0.25')} h, plane 1 flies ${T('540(0.25)=135')} km on ${T('050^\\circ')}.`, run: async (c) => { await drawOn(c, E.a1, 600); await drawOn(c, E.l1, 800); await Promise.all([popIn(c, E.dQ), show(c, E.t1)]); await show(c, ln[0]); } },
        { cap: `Plane 2 flies ${T('480(0.25)=120')} km on ${T('165^\\circ')}.`, run: async (c) => { await drawOn(c, E.a2, 700); await drawOn(c, E.l2, 800); await Promise.all([popIn(c, E.dR), show(c, E.t2)]); await show(c, ln[1]); } },
        { cap: `Both bearings are measured from the same north line, so the angle between the paths is ${T(`165^\\circ-50^\\circ=${cA('115^\\circ')}`)}.`, run: async (c) => { dim(E.a1, E.a2); await drawOn(c, E.w, 500); await show(c, ln[2]); } },
        { cap: `Two sides and the angle <b>between</b> them: <b>SAS</b>, so the <b>cosine law</b>.`, run: async (c) => { await drawOn(c, E.side, 600); await show(c, E.tS); await show(c, ln[3]); } },
        { cap: `${T(`d^2\\approx${nt(g.dist * g.dist, 1)}`)}, so the planes are about <b>${nt(g.dist, 0)} km</b> apart.`, run: (c) => show(c, ln[4]) }
      ];
    }
    const [nP, nQ, nR] = d.names || ['P', 'Q', 'R'], left = !g.cw;
    const ln = [
      lineIn(pn, `<span class="u3l8-lk">leg 1</span>${T(`${nP}${nQ}=${d.d1}\\text{ km on }${bT(d.b1)}`)}`),
      lineIn(pn, `<span class="u3l8-lk">leg 2</span>${T(`${nQ}${nR}=${d.d2}\\text{ km on }${bT(d.b2)}`)}`),
      lineIn(pn, `<span class="u3l8-lk">back</span>${T(rt.back(d, g))}`),
      lineIn(pn, `<span class="u3l8-lk">inside</span>${T(`\\angle ${nP}${nQ}${nR}=${rt.inner(d, g)}`)}`),
      lineIn(pn, `<span class="u3l8-lk">SAS</span>${T(`${nP}${nR}^2=${d.d1}^2+${d.d2}^2-2(${d.d1})(${d.d2})\\cos ${dg(g.inner, 0)}`)}`, 'u3l8-line-sm'),
      lineIn(pn, T(`${nP}${nR}^2\\approx${nt(g.PR * g.PR, 1)},\\ \\ ${nP}${nR}\\approx${nt(g.PR, 1)}\\text{ km}`)),
      lineIn(pn, `<span class="u3l8-lk">sine law</span>${T(`\\sin\\angle ${nQ}${nP}${nR}=\\frac{${d.d2}\\sin ${dg(g.inner, 0)}}{${nt(g.PR, 2, true)}}\\approx${fx(g.sinP, 4, true)}`)}`, 'u3l8-line-sm'),
      lineIn(pn, T(`\\angle ${nQ}${nP}${nR}\\approx${cP(dg(g.angP))}`)),
      lineIn(pn, `<span class="u3l8-lk">${nR} from ${nP}</span>${T(rt.bPR(d, g))}`),
      lineIn(pn, `<span class="u3l8-lk">return</span>${T(`${rt.ret(g)}\\ (${qf(g.ret)})`)}`, 'u3l8-line-ans')
    ];
    const hi = Math.max(g.back, d.b2), lo = Math.min(g.back, d.b2);
    return [
      { cap: `Start at ${T(nP)} with a <b>north line</b>. Leg 1: ${d.d1} km on a bearing of ${T(bT(d.b1))}.`,
        run: async (c) => { await drawOn(c, E.a1, 700); await drawOn(c, E.l1, 800); await Promise.all([popIn(c, E.dQ), show(c, E.nmQ), show(c, E.t1)]); await show(c, ln[0]); } },
      { cap: `At ${T(nQ)}, draw a <b>new north line</b>. North lines are <b>parallel</b>, so every bearing is measured the same way.`, run: (c) => drawOn(c, E.nQ, 600) },
      { cap: `Leg 2: ${d.d2} km on a bearing of ${T(bT(d.b2))}, measured at ${T(nQ)}.`,
        run: async (c) => { await drawOn(c, E.a2, 700); await drawOn(c, E.l2, 800); await Promise.all([popIn(c, E.dR), show(c, E.nmR), show(c, E.t2)]); await show(c, ln[1]); } },
      { cap: `Looking back from ${T(nQ)} to ${T(nP)}: the <b>back bearing</b> ${T(rt.back(d, g))}.`, run: async (c) => { dim(E.a1); await drawOn(c, E.aB, 800); await show(c, ln[2]); } },
      { cap: g.diff > 180 ? `Clockwise from ${T(bT(lo))} to ${T(bT(hi))} is ${T(dg(g.diff, 0))}: that's the <b>outside</b>. The angle inside the triangle is ${T(`360^\\circ-${dg(g.diff, 0)}=${cA(dg(g.inner, 0))}`)}.`
        : `The angle <b>inside</b> the triangle at ${T(nQ)} is between ${T(`${nQ}${nP}`)} (${T(bT(g.back))}) and ${T(`${nQ}${nR}`)} (${T(bT(d.b2))}): ${T(`${bT(hi)}-${bT(lo)}=${cA(dg(g.inner, 0))}`)}.`,
        run: async (c) => { dim(E.a2, E.aB); await drawOn(c, E.wQ, 600); await show(c, ln[3]); } },
      { cap: `Close the triangle. Two sides and the angle between them: <b>SAS</b>, so the <b>cosine law</b>: ${T(`${nP}${nR}\\approx${nt(g.PR, 1)}`)} km.`,
        run: async (c) => { await drawOn(c, E.side, 700); await show(c, E.tS); await show(c, ln[4]); await show(c, ln[5]); } },
      { cap: `Now ${T(`\\angle ${nQ}`)} and ${T(`${nP}${nR}`)} are a <b>full pair</b>: the <b>sine law</b> gives ${T(`\\angle ${nQ}${nP}${nR}\\approx${dg(g.angP)}`)} (acute: ${T(`${nQ}${nR}=${d.d2}`)} is shorter than ${T(`${nP}${nR}`)}).`,
        run: async (c) => { await drawOn(c, E.wP, 600); await show(c, ln[6]); await show(c, ln[7]); } },
      { cap: `${T(nR)} is ${left ? '<b>anticlockwise</b>' : 'clockwise'} from ${T(nQ)} as seen from ${T(nP)}, so ${left ? '<b>subtract</b>' : 'add'}: the bearing of ${T(nR)} from ${T(nP)} is ${T(rt.bPR(d, g))}.`,
        run: async (c) => { dim(E.a1); await drawOn(c, E.aPR, 900); await show(c, ln[8]); } },
      { cap: `To sail home, turn around at ${T(nR)}: ${T(rt.ret(g))} (${T(qf(g.ret))}), about ${T(nt(g.PR, 1))} km.`,
        run: async (c) => { await drawOn(c, E.nR, 500); await drawOn(c, E.aRet, 800); await show(c, ln[9]); } }
    ];
  }
};

/* ---------------- Build a route: a live builder on a card ---------------- */
function mountBuilder() {
  const host = document.getElementById('u3l8-build'); if (!host) return;
  const st = { b1: 60, d1: 18, b2: 170, d2: 25 }, figHost = host.querySelector('.u3l8-bfig'), out = host.querySelector('.u3l8-bout');
  const lim = { b1: [0, 355, 5], b2: [0, 355, 5], d1: [5, 30, 1], d2: [5, 30, 1] };
  const draw = () => {
    host.querySelectorAll('[data-v]').forEach((el) => { const k = el.dataset.v; el.innerHTML = k[0] === 'b' ? T(bT(st[k])) : T(`${st[k]}\\text{ km}`); });
    figHost.innerHTML = '';
    const d = Object.assign({}, st), g = routeGeom(d);
    if (g.inner < 6 || g.inner > 174) { out.innerHTML = `<div class="u3l8-line u3l8-warn">${g.inner < 6 ? 'Leg 2 heads almost straight back.' : 'Leg 2 carries straight on.'} The three points are (nearly) in a line: <b>no triangle</b>. Change a bearing.</div>`; routeFig(figHost, { width: 520, height: 430 }, d, g, true); return; }
    routeFig(figHost, { width: 520, height: 430 }, d, g, true);
    const right = Math.abs(g.inner - 90) < 0.5, obtP = g.angP > 90;
    out.innerHTML = [
      `<span class="u3l8-lk">back</span>${T(rt.back(d, g))}`,
      `<span class="u3l8-lk">inside</span>${T(`\\angle PQR=${rt.inner(d, g)}`)}${right ? ' <b>right triangle!</b>' : ''}`,
      `<span class="u3l8-lk">cosine law</span>${T(`PR\\approx${nt(g.PR, 1)}\\text{ km}`)}`,
      `<span class="u3l8-lk">${obtP ? 'cosine law' : 'sine law'}</span>${T(`\\angle QPR\\approx${dg(g.angP)}`)}${obtP ? ' (obtuse)' : ''}`,
      `<span class="u3l8-lk">R from P</span>${T(rt.bPR(d, g))}`,
      `<span class="u3l8-lk">return</span>${T(`${rt.ret(g)}\\ (${qf(g.ret)})`)}`
    ].map((s, i) => `<div class="u3l8-line${i === 5 ? ' u3l8-line-ans' : ''}">${s}</div>`).join('');
  };
  host.querySelectorAll('[data-k]').forEach((b) => b.addEventListener('click', () => {
    const k = b.dataset.k, [lo, hi, step] = lim[k], dir = Number(b.dataset.d);
    st[k] = k[0] === 'b' ? n360(st[k] + dir * step) : Math.min(hi, Math.max(lo, st[k] + dir * step)); draw();
  }));
  host.querySelector('[data-reset]').addEventListener('click', () => { Object.assign(st, { b1: 60, d1: 18, b2: 170, d2: 25 }); draw(); });
  draw();
}

/* =============================== explainer: elevation from two points (two triangles) =============================== */
const mastGeom = (d) => { const ATB = d.b - d.a, BT = d.AB * sn(d.a) / sn(ATB), TF = BT * sn(d.b), BF = BT * cs(d.b); return { ATB, ABT: 180 - d.b, BT, TF, BF, AF: d.AB + BF }; };
function mastFig(host, o, d, m) {
  const F = new Fig(host, o), pl = 54, pr = 76, pt = 44, pb = 64, s = Math.min((o.width - pl - pr) / m.AF, (o.height - pt - pb) / m.TF), gy = o.height - pb;
  const P = (x, y) => [pl + s * x, gy - s * y], A = P(0, 0), B = P(d.AB, 0), Fp = P(m.AF, 0), Tp = P(m.AF, m.TF);
  F.line([[A[0] - 34, gy], [Fp[0] + 56, gy]], { color: '#8a6d3b', width: 3, layer: F.L0 });
  for (let x = A[0] - 26; x < Fp[0] + 50; x += 18) F.line([[x, gy + 2], [x - 9, gy + 11]], { color: '#c2a878', width: 2, layer: F.L0 });
  F.line([Fp, Tp], { color: '#5b6474', width: 8 });
  const sA = F.line([A, Tp], { width: 3 }), sB = F.line([B, Tp], { width: 3 });
  rightMark(F.L2, Fp, A, Tp, 15, { color: INK, width: 2.2 });
  const aA = angMark(F, A, Fp, Tp, { r: 54, color: KN, label: T(`${d.a}^\\circ`), ld: 82 }), aB = angMark(F, B, Fp, Tp, { r: 42, color: KN, label: T(`${d.b}^\\circ`), ld: 66 });
  const tAB = F.lab([(A[0] + B[0]) / 2, gy + 24], T(`${d.AB}\\text{ m}`), { color: KN });
  [[A, 'A', 'sw'], [B, 'B', 's'], [Fp, 'F', 's'], [Tp, 'T', 'n']].forEach(([p, t, pos]) => F.lab(p, `<b>${t}</b>`, { pos, cls: 'u3l8-vname', gap: 8 }));
  [A, B, Tp].forEach((p) => F.dot(p, { r: 5 }));
  return { F, A, B, Fp, Tp, aA, aB, tAB, sB };
}
const MS = { ex6: { lab: 'Example 6 check', a: 28, b: 47, AB: 40 }, demo: { lab: 'Try 22° and 35°, 60 m apart', a: 22, b: 35, AB: 60 } };
const mast = {
  title: 'Two triangles: solve the one with enough information first',
  height: 430, minW: 960,
  choices: Object.keys(MS).map((k) => ({ v: k, label: MS[k].lab.replace(/(\d+)°/g, (s, n) => T(`${n}^\\circ`)) })),
  ask: (v) => { const d = MS[v]; return `From ${T('A')} the angle of elevation of the top ${T('T')} of a mast is ${T(`${d.a}^\\circ`)}. ${d.AB} m closer, at ${T('B')}, it is ${T(`${d.b}^\\circ`)}. How tall is the mast?`; },
  make(stage, v, ex) {
    const d = MS[v], m = mastGeom(d), fw = 590, M = mastFig(stage, { x: 4, y: 0, width: fw, height: 430 }, d, m), F = M.F;
    const tABT = F.tint([M.A, M.B, M.Tp], { color: PAIR, fo: 0.16, hide: true }), tBFT = F.tint([M.B, M.Fp, M.Tp], { color: KN, fo: 0.14, hide: true });
    const aABT = angMark(F, M.B, M.A, M.Tp, { r: 26, color: AC, label: T(cA(`${m.ABT}^\\circ`)), hide: true, ld: 48 });
    const aT = angMark(F, M.Tp, M.A, M.B, { r: 64, color: PAIR, label: T(cP(`${m.ATB}^\\circ`)), hide: true, ld: m.ATB < 16 ? 128 : 100 });
    const bt = F.line([M.B, M.Tp], { color: UNK, width: 5, hide: true }); const tBT = F.lab(sideAt(M.B, M.Tp, M.A, 30), T(cU(`${nt(m.BT, 2, true)}\\text{ m}`)), { hide: true, pos: 'c' });
    const tf = F.line([M.Fp, M.Tp], { color: UNK, width: 8, hide: true }); const tTF = F.lab(mid(M.Fp, M.Tp), T(cU(`${nt(m.TF, 1, true)}\\text{ m}`)), { hide: true, pos: 'e', gap: 14 });
    const pn = panel(stage, fw + 14, 10, ex.W - fw - 26, 410, 'Working');
    const ln = [
      lineIn(pn, `<span class="u3l8-lk">straight</span>${T(`\\angle ABT=180^\\circ-${d.b}^\\circ=${m.ABT}^\\circ`)}`),
      lineIn(pn, `<span class="u3l8-lk">△ABT</span>${T(`\\angle ATB=180^\\circ-${d.a}^\\circ-${m.ABT}^\\circ=${cP(`${m.ATB}^\\circ`)}`)}`),
      lineIn(pn, `<span class="u3l8-lk">sine law</span>${T(`BT=\\frac{${d.AB}\\sin ${d.a}^\\circ}{\\sin ${m.ATB}^\\circ}\\approx${nt(m.BT, 2, true)}\\text{ m}`)}`),
      lineIn(pn, `<span class="u3l8-lk">△BFT</span>${T(`TF=BT\\sin ${d.b}^\\circ\\approx${nt(m.TF, 1, true)}\\text{ m}`)}`),
      lineIn(pn, `The mast is about <b>${nt(m.TF, 1, true)} m</b> tall.`, 'u3l8-line-ans')
    ];
    return [
      { cap: `Two triangles share the side ${T('BT')}. The right triangle ${T('BFT')} has <b>no known side</b>, so it can't be solved yet.`, run: async (c) => { await drawOn(c, tBFT, 300); await pulse(c, M.sB, 1.02); } },
      { cap: `Start with ${T('\\triangle ABT')}: it has a known side, ${T(`AB=${d.AB}`)} m.`, run: async (c) => { tBFT.style.opacity = 0; await show(c, tABT); } },
      { cap: `Angles on a straight line add to ${T('180^\\circ')}: ${T(`\\angle ABT=180^\\circ-${d.b}^\\circ=${m.ABT}^\\circ`)}.`, run: async (c) => { await drawOn(c, aABT, 500); await show(c, ln[0]); } },
      { cap: `Angles in ${T('\\triangle ABT')}: ${T(`\\angle ATB=180^\\circ-${d.a}^\\circ-${m.ABT}^\\circ=${m.ATB}^\\circ`)}.`, run: async (c) => { await drawOn(c, aT, 500); await show(c, ln[1]); } },
      { cap: `${T(`${m.ATB}^\\circ`)} is opposite ${T(`AB=${d.AB}`)} m: a <b>full pair</b>. Sine law: ${T(`BT=\\frac{${d.AB}\\sin ${d.a}^\\circ}{\\sin ${m.ATB}^\\circ}\\approx${nt(m.BT, 2, true)}`)} m.`,
        run: async (c) => { M.tAB.style.color = PAIR; M.tAB.classList.add('u3l8-lpair'); await pulse(c, M.tAB, 1.25); await drawOn(c, bt, 500); await show(c, tBT); await show(c, ln[2]); } },
      { cap: `Now the right triangle ${T('BFT')} has its hypotenuse ${T('BT')}: ${T(`TF=BT\\sin ${d.b}^\\circ\\approx${nt(m.TF, 1, true)}`)} m.`,
        run: async (c) => { tABT.style.opacity = 0.35; await show(c, tBFT); await drawOn(c, tf, 500); await show(c, tTF); await show(c, ln[3]); } },
      { cap: `The mast is about <b>${nt(m.TF, 1, true)} m</b> tall.`, run: (c) => show(c, ln[4]) }
    ];
  }
};

/* =============================== explainer: a quadrilateral split by a diagonal =============================== */
function plotGeom(d) {
  const AC2 = lawC(d.AB, d.BC, d.B), sinA = d.CD * sn(d.D) / AC2, CAD = deg(Math.asin(sinA)), ACD = 180 - d.D - CAD, AD = AC2 * sn(ACD) / sn(d.D);
  const B = [0, 0], C = [d.BC, 0], A = [d.AB * cs(d.B), d.AB * sn(d.B)], u = [(A[0] - C[0]) / AC2, (A[1] - C[1]) / AC2];
  const crossB = u[0] * (B[1] - C[1]) - u[1] * (B[0] - C[0]), t = rad(ACD) * (crossB > 0 ? -1 : 1);
  const w = [u[0] * Math.cos(t) - u[1] * Math.sin(t), u[0] * Math.sin(t) + u[1] * Math.cos(t)], D = [C[0] + d.CD * w[0], C[1] + d.CD * w[1]];
  return { AC: AC2, sinA, CAD, ACD, AD, per: d.AB + d.BC + d.CD + AD, A, B, C, D, ar1: 0.5 * d.AB * d.BC * sn(d.B), ar2: 0.5 * AC2 * d.CD * sn(ACD) };
}
function plotFig(host, o, d, p) {
  const F = new Fig(host, o), Pf = fitter([p.A, p.B, p.C, p.D], o.width, o.height, [46, 62, 50, 62]), [A, B, C, D] = [p.A, p.B, p.C, p.D].map(Pf), G = cen([A, B, C, D]);
  const t1 = F.tint([A, B, C], { color: KN, fo: 0.13, hide: true }), t2 = F.tint([A, C, D], { color: PAIR, fo: 0.15, hide: true });
  F.line([A, B, C, D], { closed: true, width: 3.5 }); const diag = F.line([A, C], { color: '#8a8f99', width: 2.6, dash: '9 7' });
  const aB = angMark(F, B, A, C, { r: 30, color: KN, label: T(`${d.B}^\\circ`), ld: 52 }), aD = angMark(F, D, A, C, { r: 30, color: KN, label: T(`${d.D}^\\circ`), ld: 54 });
  const lAB = F.lab(sideAt(A, B, G, 26), T(d.labs[0]), { color: KN }), lBC = F.lab(sideAt(B, C, G, 22), T(d.labs[1]), { color: KN }), lCD = F.lab(sideAt(C, D, G, 26), T(d.labs[2]), { color: KN });
  [[A, 'A'], [B, 'B'], [C, 'C'], [D, 'D']].forEach(([q, t]) => F.lab(away(q, G, 20), `<b>${t}</b>`, { cls: 'u3l8-vname' }));
  return { F, A, B, C, D, G, t1, t2, diag, aB, aD, lAB, lBC, lCD };
}
const PL = {
  ex7: { lab: 'Example 7 check', AB: 7, BC: 9.5, B: 112, CD: 6, D: 80, labs: ['7.0', '9.5', '6.0'], u: 'm' },
  demo: { lab: 'Try another plot', AB: 8, BC: 11, B: 95, CD: 7, D: 70, labs: ['8.0', '11.0', '7.0'], u: 'm' }
};
const plotAsk = (d) => `Plot ${T('ABCD')}: ${T(`AB=${d.labs[0]}`)} m, ${T(`BC=${d.labs[1]}`)} m, ${T(`\\angle ABC=${d.B}^\\circ`)}, ${T(`CD=${d.labs[2]}`)} m, ${T(`\\angle ADC=${d.D}^\\circ`)}. Find ${T('AC')}, ${T('AD')} and the perimeter.`;
const plot = {
  title: 'A quadrilateral split into two triangles',
  height: 420, minW: 960,
  choices: Object.keys(PL).map((k) => ({ v: k, label: PL[k].lab })),
  ask: (v) => plotAsk(PL[v]),
  make(stage, v, ex) {
    const d = PL[v], p = plotGeom(d), fw = 470, Q = plotFig(stage, { x: 4, y: 0, width: fw, height: 420 }, d, p), F = Q.F;
    const acL = F.line([Q.A, Q.C], { color: UNK, width: 4.5, hide: true }), tAC = F.lab(mid(Q.A, Q.C, 0.42), T(cU(`${nt(p.AC, 2, true)}`)), { hide: true, cls: 'u3l8-halo' });
    const aCAD = angMark(F, Q.A, Q.C, Q.D, { r: 46, color: AC, label: T(cA(dg(p.CAD))), hide: true, ld: 78 }), aACD = angMark(F, Q.C, Q.D, Q.A, { r: 34, color: AC, label: T(cA(dg(p.ACD))), hide: true, ld: 60 });
    const adL = F.line([Q.A, Q.D], { color: UNK, width: 5, hide: true }), tAD = F.lab(sideAt(Q.A, Q.D, Q.G, 24), T(cU(`${nt(p.AD, 2, true)}`)), { hide: true });
    const per = F.line([Q.A, Q.B, Q.C, Q.D], { closed: true, color: COLORS.green, width: 7, hide: true });
    const pn = panel(stage, fw + 14, 10, ex.W - fw - 26, 400, 'Working');
    const ACr = Math.round(p.AC * 100) / 100, ACDr = Math.round(p.ACD * 10) / 10;
    const ln = [
      lineIn(pn, `<span class="u3l8-lk">△ABC</span>${T(`AC^2=${d.AB}^2+${d.BC}^2-2(${d.AB})(${d.BC})\\cos ${d.B}^\\circ`)}`, 'u3l8-line-sm'),
      lineIn(pn, T(`AC^2\\approx${nt(p.AC * p.AC, 2)},\\ \\ AC\\approx${nt(p.AC, 2, true)}\\text{ ${d.u}}`)),
      lineIn(pn, `<span class="u3l8-lk">△ACD</span>${T(`\\sin\\angle CAD=\\frac{${d.labs[2]}\\sin ${d.D}^\\circ}{${nt(ACr, 2, true)}}\\approx${fx(p.sinA, 4, true)}`)}`, 'u3l8-line-sm'),
      lineIn(pn, T(`\\angle CAD\\approx${dg(p.CAD)}\\ \\ \\text{(acute: }CD<AC)`)),
      lineIn(pn, T(`\\angle ACD\\approx180^\\circ-${d.D}^\\circ-${dg(p.CAD)}=${dg(p.ACD)}`)),
      lineIn(pn, `<span class="u3l8-lk">sine law</span>${T(`AD=\\frac{${nt(ACr, 2, true)}\\sin ${dg(ACDr)}}{\\sin ${d.D}^\\circ}\\approx${nt(p.AD, 1, true)}\\text{ ${d.u}}`)}`, 'u3l8-line-sm'),
      lineIn(pn, T(`P\\approx${d.labs[0]}+${d.labs[1]}+${d.labs[2]}+${nt(p.AD, 2, true)}\\approx${nt(p.per, 1, true)}\\text{ ${d.u}}`), 'u3l8-line-ans')
    ];
    return [
      { cap: `${T('\\triangle ACD')} has only ${T('CD')} and ${T('\\angle D')}: not enough yet. ${T('\\triangle ABC')} has two sides and the angle <b>between</b> them.`, run: (c) => show(c, Q.t1) },
      { cap: `${T('\\triangle ABC')} is <b>SAS</b>: cosine law. ${T(`AC\\approx${nt(p.AC, 2, true)}`)} m, the side the two triangles <b>share</b>.`, run: async (c) => { await drawOn(c, acL, 500); await show(c, tAC); await show(c, ln[0]); await show(c, ln[1]); } },
      { cap: `In ${T('\\triangle ACD')}, ${T(`\\angle D=${d.D}^\\circ`)} and ${T('AC')} (opposite it) are a <b>full pair</b>: sine law for ${T('\\angle CAD')}. Only acute, since ${T('CD')} is shorter than ${T('AC')}.`,
        run: async (c) => { Q.t1.style.opacity = 0.3; await show(c, Q.t2); Q.aD.lab.style.color = PAIR; Q.aD.lab.classList.add('u3l8-lpair'); tAC.innerHTML = T(cP(nt(p.AC, 2, true))); tAC.classList.add('u3l8-lpair'); await drawOn(c, aCAD, 500); await show(c, ln[2]); await show(c, ln[3]); } },
      { cap: `Angles in ${T('\\triangle ACD')}: ${T(`\\angle ACD\\approx${dg(p.ACD)}`)}.`, run: async (c) => { await drawOn(c, aACD, 500); await show(c, ln[4]); } },
      { cap: `Sine law again: ${T(`AD\\approx${nt(p.AD, 1, true)}`)} m.`, run: async (c) => { await drawOn(c, adL, 500); await show(c, tAD); await show(c, ln[5]); } },
      { cap: `The <b>perimeter</b> goes around the <b>outside</b> (not along ${T('AC')}): about <b>${nt(p.per, 1, true)} m</b>.`, run: async (c) => { await drawOn(c, per, 1200); await show(c, ln[6]); } }
    ];
  }
};

/* =============================== explainer: triangles in circles =============================== */
function circGeom(d) { const cosO = (2 * d.r * d.r - d.c * d.c) / (2 * d.r * d.r), O = deg(Math.acos(cosO)); return { cosO, O, ins: O / 2, dist: Math.sqrt(d.r * d.r - d.c * d.c / 4), ATB: 180 - O, TA: d.r * Math.tan(rad(O / 2)), OT: d.r / cs(O / 2) }; }
function circFig(host, o, d, q, full) {
  const F = new Fig(host, o), s = Math.min((o.height - 64) / (d.r + q.OT), (o.width - 80) / (2 * d.r)), R = s * d.r, cx = o.width / 2, cy = 30 + R;
  const P = (a) => [cx + R * cs(a), cy - R * sn(a)], O = [cx, cy], A = P(270 - q.O / 2), B = P(270 + q.O / 2), Tt = [cx, cy + s * q.OT], C = P(d.cDeg);
  svgEl('circle', { cx, cy, r: R, fill: '#fff', stroke: INK, 'stroke-width': 3 }, F.L0);
  const rA = F.line([O, A], { color: KN, width: 3 }), rB = F.line([O, B], { color: KN, width: 3 }), ch = F.line([A, B], { width: 3.5 });
  F.dot(O, { r: 6 }); F.lab([cx + 6, cy - 6], '<b>O</b>', { pos: 'ne', cls: 'u3l8-vname', gap: 2 });
  [[A, 'A', 'w'], [B, 'B', 'e']].forEach(([p, t, pos]) => F.lab(p, `<b>${t}</b>`, { pos, cls: 'u3l8-vname', gap: 10 }));
  const lr = F.lab(sideAt(O, A, B, 26), T(`${d.r}`), { color: KN, cls: 'u3l8-lsm' }), lc = F.lab(mid(A, B, 0.3), T(`${nt(d.c, 1, true)}`), { pos: 's', cls: 'u3l8-lsm', gap: 6 });
  const E = { F, O, A, B, T: Tt, C, P, R, s, cx, cy, lc };
  if (full) {
    F.line([A, C, B], { width: 2.6 }); F.line([A, Tt, B], { width: 2.6 });
    F.lab(C, '<b>C</b>', { pos: 'n', cls: 'u3l8-vname', gap: 8 }); F.lab(Tt, '<b>T</b>', { pos: 's', cls: 'u3l8-vname', gap: 6 });
  }
  return E;
}
const CI = { ex8: { lab: 'Example 8 check', r: 6.5, c: 10, cDeg: 100 }, demo: { lab: 'Try radius 5, chord 8', r: 5, c: 8, cDeg: 105 } };
const circle = {
  title: 'Triangles in a circle',
  height: 470, minW: 960, capH: 92,
  choices: Object.keys(CI).map((k) => ({ v: k, label: CI[k].lab })),
  ask: (v) => { const d = CI[v]; return `Radius ${d.r} cm, chord ${T('AB')} = ${nt(d.c, 1, true)} cm, ${T('C')} on the major arc, tangents at ${T('A')} and ${T('B')} meet at ${T('T')}. Find ${T('\\angle AOB')}, ${T('\\angle ACB')}, the distance from ${T('O')} to the chord, ${T('\\angle ATB')} and ${T('TA')}.`; },
  make(stage, v, ex) {
    const d = CI[v], q = circGeom(d), fw = 400, E = circFig(stage, { x: 4, y: 0, width: fw, height: 470 }, d, q, false), F = E.F;
    const aO = angMark(F, E.O, E.A, E.B, { r: 30, color: AC, label: T(cA(dg(q.O))), hide: true, ld: 50 }); aO.lab.style.left = (parseFloat(aO.lab.style.left) - 34) + 'px';
    const cg = F.grp({ hide: true }), cAp = F.pathD('', { width: 2.8, layer: cg }), cDot = svgEl('circle', { r: 6, fill: INK, stroke: '#fff', 'stroke-width': 2 }, cg);
    const cArc = svgEl('path', { fill: PAIR, 'fill-opacity': 0.22, stroke: PAIR, 'stroke-width': 2.5 }, cg), cLab = F.lab([0, 0], T(cP(dg(q.ins))), { hide: true }), cNm = F.lab([0, 0], '<b>C</b>', { cls: 'u3l8-vname', hide: true });
    const placeC = (a) => { const C = E.P(a); cAp.setAttribute('d', ptsD([E.A, C, E.B])); cDot.setAttribute('cx', f1(C[0])); cDot.setAttribute('cy', f1(C[1]));
      const a1 = angTo(C, E.A), sw = sweepBetween(C, E.A, E.B); cArc.setAttribute('d', wedgeD(C, a1, sw, 34)); const L = addP(C, uv(a1 + sw / 2), 62); cLab.style.left = L[0] + 'px'; cLab.style.top = L[1] + 'px';
      const N = away(C, [E.cx, E.cy], 20); cNm.style.left = N[0] + 'px'; cNm.style.top = N[1] + 'px'; return deg(Math.abs(sw)); };
    placeC(d.cDeg);
    const M = mid(E.A, E.B), om = F.line([E.O, M], { color: PAIR, width: 3, hide: true }), rm = F.grp({ hide: true }); rightMark(rm, M, E.O, E.B, 13, { color: INK, width: 2 });
    const tD = F.lab(mid(E.O, M), T(cU('d')), { pos: 'e', gap: 8, hide: true }), tH = F.lab(mid(M, E.B), T(`${nt(d.c / 2, 1, true)}`), { pos: 'n', gap: 4, hide: true, cls: 'u3l8-lsm', color: PAIR });
    const tg = F.grp({ hide: true }); F.pathD(ptsD([E.A, E.T, E.B]), { width: 2.8, layer: tg }); rightMark(tg, E.A, E.O, E.T, 13, { color: INK, width: 2 }); rightMark(tg, E.B, E.O, E.T, 13, { color: INK, width: 2 });
    const tDot = F.dot(E.T, { r: 5, hide: true }), tNm = F.lab(E.T, '<b>T</b>', { pos: 's', cls: 'u3l8-vname', hide: true, gap: 6 });
    const aT = angMark(F, E.T, E.A, E.B, { r: 30, color: AC, label: T(cA(dg(q.ATB))), hide: true, ld: 50 }); aT.lab.style.left = (parseFloat(aT.lab.style.left) + 34) + 'px';
    const tOAT = F.tint([E.O, E.A, E.T], { color: KN, fo: 0.15, hide: true }), ot = F.line([E.O, E.T], { color: '#8a8f99', width: 2.4, dash: '8 6', hide: true });
    const tTA = F.lab(sideAt(E.A, E.T, E.O, 24), T(cU(`${nt(q.TA, 1, true)}`)), { hide: true });
    const pn = panel(stage, fw + 14, 10, ex.W - fw - 26, 450, 'Working');
    const read = h('div', 'u3l8-read', ''); read.style.opacity = 0; read.style.position = 'absolute'; add(stage, read, 12, 8);
    const r = d.r, half = d.c / 2;
    const ln = [
      lineIn(pn, `<span class="u3l8-lk">(a) SSS</span>${T(`\\cos\\angle AOB=\\frac{${r}^2+${r}^2-${nt(d.c, 0)}^2}{2(${r})(${r})}\\approx${fx(q.cosO, 4, true)}`)}`, 'u3l8-line-sm'),
      lineIn(pn, T(`\\angle AOB\\approx${dg(q.O)}\\approx${dg(q.O, 0)}`)),
      lineIn(pn, `<span class="u3l8-lk">(b)</span>${T(`\\angle ACB=\\tfrac12(${dg(q.O)})\\approx${dg(q.ins, 0)}`)}`),
      lineIn(pn, `<span class="u3l8-lk">(c)</span>${T(`d=\\sqrt{${r}^2-${nt(half, 1)}^2}\\approx${nt(q.dist, 1, true)}\\text{ cm}`)}`),
      lineIn(pn, `<span class="u3l8-lk">(d)</span>${T(`\\angle ATB=360^\\circ-90^\\circ-90^\\circ-${dg(q.O)}\\approx${dg(q.ATB, 0)}`)}`, 'u3l8-line-sm'),
      lineIn(pn, T(`TA=${r}\\tan ${dg(q.ins)}\\approx${nt(q.TA, 1, true)}\\text{ cm}`), 'u3l8-line-ans')
    ];
    return [
      { cap: `${T(`OA=OB=${r}`)} cm: both are <b>radii</b>. A chord and two radii make an <b>isosceles</b> triangle.`, run: async (c) => { await pulse(c, E.lc, 1.25); } },
      { cap: `(a) Three sides known (<b>SSS</b>): cosine law. ${T(`\\cos\\angle AOB\\approx${fx(q.cosO, 4, true)}`)}${q.cosO < 0 ? ': <b>negative</b>, so the angle is obtuse' : ''}. ${T(`\\angle AOB\\approx${dg(q.O)}`)}.`,
        run: async (c) => { await drawOn(c, aO, 500); await show(c, ln[0]); await show(c, ln[1]); } },
      { cap: `(b) ${T('\\angle ACB')} is an <b>inscribed angle</b> on the same arc: <b>half</b> the central angle, ${T(`\\tfrac12(${dg(q.O)})\\approx${dg(q.ins, 0)}`)}.`,
        run: async (c) => { cg.style.opacity = 1; cNm.style.opacity = 1; await fadeIn(c, cg, 400); await show(c, cLab); await show(c, ln[2]); } },
      { cap: `Slide ${T('C')} along the major arc: the inscribed angle <b>does not change</b>.`,
        run: async (c) => { read.style.opacity = 1; const go = (a0, a1, ms) => tween(c, ms, (t) => { const v2 = placeC(a0 + (a1 - a0) * t); read.innerHTML = `${T('\\angle ACB=')} ${T(cP(dg(v2)))}`; });
          await go(d.cDeg, 168, 900); await go(168, 18, 1500); await go(18, d.cDeg, 900); } },
      { cap: `(c) The perpendicular from ${T('O')} <b>bisects</b> the chord: half-chord ${T(nt(half, 1, true))}. Pythagoras: ${T(`d\\approx${nt(q.dist, 1, true)}`)} cm.`,
        run: async (c) => { read.style.opacity = 0; await drawOn(c, om, 500); await Promise.all([show(c, rm), show(c, tD), show(c, tH)]); await show(c, ln[3]); } },
      { cap: `(d) A tangent is <b>perpendicular</b> to the radius: ${T('\\angle OAT=\\angle OBT=90^\\circ')}.`, run: async (c) => { await drawOn(c, tg, 800); await Promise.all([popIn(c, tDot), show(c, tNm)]); } },
      { cap: `The angles of quadrilateral ${T('OATB')} add to ${T('360^\\circ')}: ${T(`\\angle ATB\\approx${dg(q.ATB, 0)}`)}.`, run: async (c) => { await drawOn(c, aT, 500); await show(c, ln[4]); } },
      { cap: `Right ${T('\\triangle OAT')}, with ${T(`\\angle AOT=\\tfrac12(${dg(q.O)})=${dg(q.ins)}`)}: ${T(`TA=${r}\\tan ${dg(q.ins)}\\approx${nt(q.TA, 1, true)}`)} cm.`,
        run: async (c) => { await show(c, tOAT); await drawOn(c, ot, 400); await show(c, tTA); await show(c, ln[5]); } }
    ];
  }
};

/* =============================== explainer: area = ½ab sin C =============================== */
function areaFig(host, o, d) {
  const C0 = [0, 0], A0 = [d.b, 0], B0 = [d.a * cs(d.C), d.a * sn(d.C)], H0 = [B0[0], 0];
  const F = new Fig(host, o), Pf = fitter([C0, A0, B0, H0], o.width, o.height, [50, 50, 64, 56]), [C, A, B, H] = [C0, A0, B0, H0].map(Pf), G = cen([A, B, C]);
  F.line([A, B, C], { closed: true, width: 3.5 });
  [[A, 'A'], [B, 'B'], [C, 'C']].forEach(([p, t]) => F.lab(away(p, G, 20), `<b>${t}</b>`, { cls: 'u3l8-vname' }));
  const la = F.lab(sideAt(C, B, G, d.C > 90 ? -24 : 24), T(d.ta || `a=${d.a}`), { color: KN }), lb = F.lab(sideAt(C, A, G, 24), T(d.tb || `b=${d.b}`), { color: KN });
  const lc = d.tc ? F.lab(sideAt(A, B, G, 24), T(d.tc), { color: d.tcColor || INK }) : null;
  const aC = d.Ck === 'u' ? angMark(F, C, A, B, { r: 30, color: UNK, label: T(cU('\\theta')), hide: true, ld: 54 }) : angMark(F, C, A, B, { r: 30, color: AC, label: T(cA(`${d.C}^\\circ`)), ld: 54 });
  return { F, A, B, C, H, G, la, lb, lc, aC };
}
const AR = {
  why: { lab: 'Why ½ab sin C?', a: 8, b: 11, C: 50, ask: `Where does ${T('\\text{Area}=\\tfrac12ab\\sin C')} come from?` },
  a: { lab: 'Example 9(a) check', a: 42, b: 55, C: 74, ta: '42\\text{ m}', tb: '55\\text{ m}', tc: 'c', tcColor: UNK, ask: 'Example 9(a): sides 42 m and 55 m with 74° between them. Find the area and the perimeter.' },
  b: { lab: 'Example 9(b) check', a: 7, b: 9, C: angC(7, 9, 12), Ck: 'u', ta: '7', tb: '9', tc: '12', ask: 'Example 9(b): find the area of a triangle with sides 7 cm, 9 cm and 12 cm.' },
  c: { lab: 'Example 9(c) check', plot: true, ask: 'Example 9(c): find the area of the garden plot in Example 7.' }
};
const area = {
  title: 'Area from two sides and the angle between them',
  height: 420, minW: 960,
  choices: Object.keys(AR).map((k) => ({ v: k, label: AR[k].lab.replace('½ab sin C', T('\\tfrac12ab\\sin C')) })),
  ask: (v) => AR[v].ask.replace(/(\d+)°/g, (s, n) => T(`${n}^\\circ`)),
  make(stage, v, ex) {
    const d = AR[v], fw = 470;
    if (d.plot) return areaPlot(stage, ex, fw);
    const Z = areaFig(stage, { x: 4, y: 0, width: fw, height: 420 }, d), F = Z.F, obt = d.C > 90;
    const base = F.line([Z.C, Z.A], { color: PAIR, width: 7, hide: true });
    const ext = obt ? F.line([Z.C, Z.H], { color: '#8a8f99', width: 2.4, dash: '6 6', hide: true }) : null;
    const alt = F.grp({ hide: true }); F.pathD(ptsD([Z.B, Z.H]), { color: AC, width: 3.4, dash: '9 6', layer: alt }); rightMark(alt, Z.H, Z.B, obt ? Z.A : Z.C, 13, { color: AC, width: 2.2 });
    const tH = F.lab(mid(Z.B, Z.H), T(cA('h')), { pos: obt ? 'w' : 'e', gap: 10, hide: true });
    const rt2 = F.tint([Z.B, Z.C, Z.H], { color: AC, fo: 0.16, hide: true });
    const pn = panel(stage, fw + 14, 10, ex.W - fw - 26, 400, 'Working');
    if (v === 'why') {
      const ln = [lineIn(pn, T('\\text{Area}=\\tfrac12(\\text{base})(\\text{height})=\\tfrac12\\,b\\,h')), lineIn(pn, T('\\sin C=\\frac{h}{a}\\ \\Rightarrow\\ h=a\\sin C')),
        lineIn(pn, T('\\text{Area}=\\tfrac12\\,b\\,(a\\sin C)=\\tfrac12ab\\sin C'), 'u3l8-line-ans u3l8-big'), lineIn(pn, T('=\\tfrac12bc\\sin A=\\tfrac12ac\\sin B'), 'u3l8-line-sm')];
      return [
        { cap: `Area ${T('=\\tfrac12(\\text{base})(\\text{height})')}. Use side ${T('b')} as the <b>base</b>.`, run: async (c) => { await drawOn(c, base, 500); await show(c, ln[0]); } },
        { cap: `The <b>height</b> ${T('h')} drops from ${T('B')} at right angles to the base.`, run: async (c) => { await drawOn(c, alt, 600); await show(c, tH); } },
        { cap: `In the right triangle with hypotenuse ${T('a')}: ${T('\\sin C=\\frac{h}{a}')}, so ${T('h=a\\sin C')}.`, run: async (c) => { await show(c, rt2); await show(c, ln[1]); } },
        { cap: `Area ${T('=\\tfrac12\\,b\\,(a\\sin C)=\\tfrac12ab\\sin C')}: two sides and the angle <b>between</b> them (SAS).`, run: (c) => show(c, ln[2]) },
        { cap: `Any two sides with their contained angle work: ${T('\\tfrac12bc\\sin A')} or ${T('\\tfrac12ac\\sin B')}.`, run: (c) => show(c, ln[3]) }
      ];
    }
    if (v === 'a') {
      const ar = 0.5 * 42 * 55 * sn(74), c2 = lawC(42, 55, 74);
      const ln = [lineIn(pn, `<span class="u3l8-lk">area</span>${T(`\\tfrac12(42)(55)\\sin 74^\\circ\\approx${nt(ar, 0)}\\text{ m}^2`)}`, 'u3l8-line-ans'),
        lineIn(pn, `<span class="u3l8-lk">SAS</span>${T('c^2=42^2+55^2-2(42)(55)\\cos 74^\\circ')}`, 'u3l8-line-sm'), lineIn(pn, T(`c^2\\approx${nt(c2 * c2, 1)},\\ \\ c\\approx${nt(c2, 2)}\\text{ m}`)),
        lineIn(pn, `<span class="u3l8-lk">perimeter</span>${T(`42+55+${nt(c2, 2)}\\approx${nt(42 + 55 + c2, 1)}\\text{ m}`)}`, 'u3l8-line-ans')];
      return [
        { cap: `Two sides and the angle <b>between</b> them: the area formula works straight away.`, run: async (c) => { await drawOn(c, alt, 500); await show(c, tH); } },
        { cap: `Area ${T(`=\\tfrac12(42)(55)\\sin 74^\\circ\\approx${nt(ar, 0)}`)} m² (the height is ${T('42\\sin 74^\\circ')}).`, run: (c) => show(c, ln[0]) },
        { cap: `The perimeter needs the third side: <b>SAS</b>, so the cosine law: ${T(`c\\approx${nt(c2, 2)}`)} m.`, run: async (c) => { await show(c, ln[1]); await show(c, ln[2]); } },
        { cap: `Perimeter ${T(`\\approx42+55+${nt(c2, 2)}\\approx${nt(42 + 55 + c2, 1)}`)} m.`, run: (c) => show(c, ln[3]) }
      ];
    }
    const th = d.C, ar = 0.5 * 7 * 9 * sn(th);
    const ln = [lineIn(pn, `<span class="u3l8-lk">SSS</span>${T('\\cos\\theta=\\frac{7^2+9^2-12^2}{2(7)(9)}=\\frac{-14}{126}')}`, 'u3l8-line-sm'), lineIn(pn, T(`\\theta\\approx${dg(th)}`)),
      lineIn(pn, `<span class="u3l8-lk">area</span>${T(`\\tfrac12(7)(9)\\sin ${dg(th)}\\approx${nt(ar, 1, true)}\\text{ cm}^2`)}`, 'u3l8-line-ans')];
    return [
      { cap: `Three sides and <b>no angle</b> (SSS): the area formula needs an angle first.`, run: (c) => pulse(c, Z.lc, 1.25) },
      { cap: `Cosine law for ${T('\\theta')}, opposite 12 (between 7 and 9): ${T('\\cos\\theta=\\frac{-14}{126}')}, ${T(`\\theta\\approx${dg(th)}`)}: obtuse.`, run: async (c) => { await drawOn(c, Z.aC, 500); await show(c, ln[0]); await show(c, ln[1]); } },
      { cap: `The height now falls <b>outside</b> the base, but it is still ${T(`7\\sin ${dg(th)}`)}: ${T('\\sin(180^\\circ-\\theta)=\\sin\\theta')}.`, run: async (c) => { await drawOn(c, ext, 400); await drawOn(c, alt, 600); await show(c, tH); } },
      { cap: `Area ${T(`=\\tfrac12(7)(9)\\sin ${dg(th)}\\approx${nt(ar, 1, true)}`)} cm².`, run: (c) => show(c, ln[2]) }
    ];
  }
};
function areaPlot(stage, ex, fw) {
  const d = PL.ex7, p = plotGeom(d), Q = plotFig(stage, { x: 4, y: 0, width: fw, height: 420 }, d, p), F = Q.F;
  const aACD = angMark(F, Q.C, Q.D, Q.A, { r: 34, color: AC, label: T(cA('74.6^\\circ')), hide: true, ld: 60 });
  const c1 = F.lab(mid(cen([Q.A, Q.B, Q.C]), mid(Q.A, Q.C), 0.45), T(`\\approx${nt(p.ar1, 2)}`), { hide: true, cls: 'u3l8-big u3l8-halo', color: KN }), c2 = F.lab(cen([Q.A, Q.C, Q.D]), T(`\\approx${nt(p.ar2, 2)}`), { hide: true, cls: 'u3l8-big u3l8-halo', color: '#a86a0a' });
  const pn = panel(stage, fw + 14, 10, ex.W - fw - 26, 400, 'Working'), a2 = p.ar2;
  const ln = [lineIn(pn, `<span class="u3l8-lk">△ABC</span>${T(`\\tfrac12(7)(9.5)\\sin 112^\\circ\\approx${nt(p.ar1, 2)}`)}`), lineIn(pn, `<span class="u3l8-lk">△ACD</span>${T(`\\tfrac12(13.75)(6.0)\\sin 74.6^\\circ\\approx${nt(a2, 2)}`)}`, 'u3l8-line-sm'),
    lineIn(pn, `<span class="u3l8-lk">total</span>${T(`${nt(p.ar1, 2)}+${nt(a2, 2)}\\approx${nt(p.ar1 + a2, 1)}\\text{ m}^2`)}`, 'u3l8-line-ans')];
  return [
    { cap: `The diagonal ${T('AC')} splits the plot into two triangles. Add their areas.`, run: async (c) => { await show(c, Q.t1); await show(c, Q.t2); } },
    { cap: `${T('\\triangle ABC')}: sides 7 and 9.5 with ${T('112^\\circ')} between them: ${T(`\\tfrac12(7)(9.5)\\sin 112^\\circ\\approx${nt(p.ar1, 2)}`)}.`, run: async (c) => { await show(c, c1); await show(c, ln[0]); } },
    { cap: `${T('\\triangle ACD')}: from Example 7, ${T('AC\\approx13.75')} and ${T('CD=6.0')} with ${T('\\angle ACD\\approx74.6^\\circ')} between them: ${T(`\\approx${nt(a2, 2)}`)}.`, run: async (c) => { await drawOn(c, aACD, 500); await show(c, c2); await show(c, ln[1]); } },
    { cap: `Total area ${T(`\\approx${nt(p.ar1 + a2, 1)}`)} m².`, run: (c) => show(c, ln[2]) }
  ];
}

/* =============================== static figures on cards =============================== */
function mountFigs() {
  const f1h = document.getElementById('u3l8-fig140');
  if (f1h) { // bearing 140° = S 40° E
    const F = new Fig(f1h, { width: 250, height: 250 }), O = [118, 120], R = 96;
    F.line([[O[0], O[1] + R], [O[0], O[1] - R]], { color: '#8a8f99', width: 2.2 }); F.line([[O[0] - R, O[1]], [O[0] + R, O[1]]], { color: '#8a8f99', width: 2.2 });
    arrowHead(F.L2, O[0], O[1] - R - 2, 0, -1, { color: '#8a8f99', width: 2.4 });
    [['N', 0], ['E', 90], ['S', 180], ['W', 270]].forEach(([t, b]) => F.lab(addP(O, uv(sa(b)), R + 14), `<b>${t}</b>`, { cls: 'u3l8-rosel u3l8-lsm' }));
    const E = addP(O, uv(sa(140)), R - 4); F.line([O, E], { width: 4 }); arrowHead(F.L3, E[0], E[1], Math.cos(sa(140)), Math.sin(sa(140)), { color: INK, width: 4 });
    bArc(F, O, 0, 140, 36, { color: L1, label: T('140^\\circ'), lr: 24, at: 0.3 });
    F.pathD(arcD(O, sa(180), -rad(40), 62), { color: PAIR, width: 3 }); F.lab(addP(O, uv(sa(160)), 82), T('40^\\circ'), { color: PAIR, cls: 'u3l8-lsm' });
    F.dot(O, { r: 5 }); F.lab([O[0] - 6, O[1] + 4], T('A'), { pos: 'sw', cls: 'u3l8-lsm' }); F.lab(E, T('B'), { pos: 'e', gap: 8 });
  }
  const mh = document.getElementById('u3l8-figmast'); if (mh) { const d = MS.ex6; mastFig(mh, { width: 400, height: 250 }, d, mastGeom(d)); }
  const ph = document.getElementById('u3l8-figplot'); if (ph) { const d = PL.ex7; plotFig(ph, { width: 340, height: 290 }, d, plotGeom(d)); }
  const ch = document.getElementById('u3l8-figcirc'); if (ch) { const d = CI.ex8; circFig(ch, { width: 290, height: 330 }, d, circGeom(d), true); }
}

/* =============================== Stand Up Break =============================== */
const dT = (b) => T(bT(b));
standup('u3l8', {
  intro: 'At your whiteboard: sketch it, mark every angle you can find from the bearings, then choose the law.',
  levels: {
    BEG: (r) => { // bearing ↔ N/S…E/W form, back bearing
      let b; do { b = 5 * r.int(1, 71); } while (b % 90 === 0);
      const bb = n360(b + 180), [ns, a, ew] = quad(b);
      if (r.chance(0.5)) return { text: 'Write this bearing in N/S…E/W form, and give its back bearing.', q: bT(b), a: [`${bT(b)}=${qT(ns, a, ew)}`, `\\text{back bearing: }${bT(b)}${b < 180 ? '+' : '-'}180^\\circ=${bT(bb)}`] };
      return { text: 'Write this direction as a three-digit bearing, and give its back bearing.', q: qT(ns, a, ew), a: [`${qT(ns, a, ew)}=${bT(b)}`, `\\text{back bearing: }${bT(bb)}\\ (${qf(bb)})`] };
    },
    PRG: (r) => { // two boats from one dock
      const b1 = 5 * r.int(1, 30), gap = 5 * r.int(8, 30), b2 = b1 + gap, d1 = r.int(6, 20), d2 = r.int(6, 20), dd = lawC(d1, d2, gap);
      return { text: `Two boats leave a dock. One sails <b>${d1} km</b> on a bearing of ${dT(b1)}; the other sails <b>${d2} km</b> on a bearing of ${dT(b2)}. How far apart are they, to the nearest tenth of a km?`, q: '',
        a: [`\\text{angle between: }${bT(b2)}-${bT(b1)}=${gap}^\\circ`, `d^2=${d1}^2+${d2}^2-2(${d1})(${d2})\\cos ${gap}^\\circ\\approx${nt(dd * dd, 1)}`, `d\\approx${nt(dd, 1, true)}\\text{ km}`] };
    },
    MAS: (r) => { // a route with a turn: distance and return bearing
      for (let t = 0; t < 60; t++) {
        const d = { b1: 5 * r.int(1, 71), d1: r.int(8, 25), b2: 5 * r.int(0, 71), d2: r.int(8, 25) }, g = routeGeom(d);
        if (g.inner < 40 || g.inner > 140 || g.angP >= 88 || d.b1 % 90 === 0 || d.b2 % 90 === 0) continue;
        return { text: `A ship sails <b>${d.d1} km</b> from port ${T('P')} on a bearing of ${dT(d.b1)} to ${T('Q')}, then <b>${d.d2} km</b> on a bearing of ${dT(d.b2)} to ${T('R')}. Find the distance and the bearing from ${T('R')} straight back to ${T('P')}.`, q: '',
          a: [`\\text{back bearing at }Q:\\ ${rt.back(d, g)}`, `\\angle PQR=${rt.inner(d, g)}`, `PR^2=${d.d1}^2+${d.d2}^2-2(${d.d1})(${d.d2})\\cos ${dg(g.inner, 0)},\\ PR\\approx${nt(g.PR, 1, true)}\\text{ km}`,
            `\\sin\\angle QPR=\\frac{${d.d2}\\sin ${dg(g.inner, 0)}}{${nt(g.PR, 2, true)}},\\ \\angle QPR\\approx${dg(g.angP)}`, `\\text{bearing of }R\\text{ from }P:\\ ${rt.bPR(d, g)}`, `\\text{return: }${rt.ret(g)}`] };
      }
      return null;
    }
  }
});

/* =============================== mount =============================== */
mountMap();
mountBuilder();
mountFigs();
export const explainers = mountExplainers({ chooser, clock, bearingForms, route, mast, plot, circle, area });
export const _test = { routeGeom, mastGeom, plotGeom, circGeom, clockG, quad, qf, bT };
