/* Math 20-1 · Unit 3 · Lesson 5 — The Sine Law.
 * Warm-up (The Shade Sail: tap a corner to light the edge it does not touch; three sails; the 30-60-90 sail's edges are
 * 5 : 8.7 : 10, not 5 : 10 : 15), and the explainers:
 *   label (vertices in capitals, each angle and the side it does not touch share a letter and a colour; the angle sum;
 *     the largest angle faces the longest side), soh (SOH CAH TOA on the RightTriangle block; Example 1 checks),
 *   split (Example 2: the altitude from C splits the oblique triangle; the two right triangles slide apart and are solved),
 *   proof (STAR: the altitude h from C written as b sin A and as a sin B; the two expressions slide together into
 *     a sin B = b sin A, divide by sin A sin B, and the colours sort into matching side–angle pairs; another shape, the
 *     altitude from A, an obtuse angle B with sin(180° − B) = sin B),
 *   supp (y = sin θ from 0° to 180°: fold at 90°, sin θ = sin(180° − θ), sin⁻¹ gives only the acute one),
 *   pairHunt (four triangles: AAS, ASA, SSA, SSS — which have a known pair, or can get one from the angle sum),
 *   findSide (Example 4 and 5 checks: third angle, known pair, side on top, multiply),
 *   findAngle (Example 6 checks: known pair, why the angle is acute, sines on top, sin⁻¹, the obtuse twin rejected, solve),
 *   bearing (reading bearings on a compass; Example 7 check: the fire towers),
 *   river (Example 8 check: the sine law for PT, then the altitude w = PT sin 57° and the area).
 * Colours (kept through the lesson): pair A (∠A and a) blue, pair B green, pair C purple, the altitude h rose
 * (#a33357), the KNOWN PAIR amber, the unknown red. Triangles are drawn to scale from the data. */
import {
  h, tex, add, box, RightTriangle, Graph, stamp, stampIn, mountExplainers, pop, fadeIn, appear, tween, svgEl, pulse,
  place, drawIn, anim, arrowHead, angleArc, rightMark, liveCtx, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const CA = COLORS.blue, CB = COLORS.green, CC = COLORS.purple, HC = COLORS.teal, KP = COLORS.amber, UN = COLORS.red;
const INK = COLORS.ink, GRAY = COLORS.gray, SLATE = COLORS.slate, BR = COLORS.brand;
const kc = (c) => (s) => `\\textcolor{${c}}{${s}}`;
const cA = kc(CA), cB = kc(CB), cC = kc(CC), cH = kc(HC), cK = kc(KP), cU = kc(UN), cBr = kc(BR);
const PCOL = [CA, CB, CC];
const RAD = Math.PI / 180, sinD = (d) => Math.sin(d * RAD), cosD = (d) => Math.cos(d * RAD), asinD = (v) => Math.asin(v) / RAD;
/** v rounded to d decimals, trailing zeros kept ("8.0") */
const fx = (v, d = 1) => { const k = Math.pow(10, d); return (Math.round((v + Math.sign(v) * 1e-9) * k) / k).toFixed(d); };
/** v rounded to d decimals, trailing zeros dropped */
const fz = (v, d = 2) => String(parseFloat(fx(v, d)));
const thin = (s) => s.replace(/^(\d+)(\d{3})(\.|$)/, '$1\\,$2$3');
const dg = (v) => `${v}^\\circ`;
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const vis = (el, on) => { if (el) el.style.display = on ? '' : 'none'; return el; };
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
const panel = (stage, x, y, w, hh, title, cls = '') => div(stage, 'u3l5-panel ' + cls, title ? `<div class="u3l5-ph">${title}</div>` : '', x, y, w, hh);
const lineIn = (p, html, cls = '') => { const d = h('div', 'u3l5-line ' + cls, html); p.appendChild(d); hide(d); return d; };
const dPath = (pts) => 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L');
const norm = (x, y) => { const l = Math.hypot(x, y) || 1; return [x / l, y / l]; };
/** label position from an outward direction (screen coords) */
const posFrom = (nx, ny) => (ny < -0.38 ? 'n' : ny > 0.38 ? 's' : '') + (nx < -0.38 ? 'w' : nx > 0.38 ? 'e' : '') || 'c';
const svgOn = (el) => { if (el) el.style.opacity = 1; return el; };
/** fade in an SVG piece (no slide) */
const appearIn = (c, el, ms = 320) => { if (!el) return Promise.resolve(); el.style.opacity = ''; return appear(c, el, ms); };
const hideS = (el) => { if (el) el.style.opacity = 0; return el; };

/* ====================================================================================================
 * Tri: a triangle (or any labelled figure) drawn to scale. V holds named points in math units (y up); the first three
 * names (or o.names) are the triangle. Labels are HTML (KaTeX) in an overlay. Everything is created visible; hide what
 * a step should reveal.
 * ==================================================================================================== */
class Tri {
  constructor(host, o) {
    o = this.o = Object.assign({ pad: 40, lw: 3.5, font: 20 }, o);
    const el = this.el = h('div', 'u3l5-tri' + (o.cls ? ' ' + o.cls : '')); box(el, o.w, o.h); el.style.fontSize = o.font + 'px';
    if (o.x != null) { el.style.position = 'absolute'; add(host, el, o.x, o.y); } else host.appendChild(el);
    this.svg = svgEl('svg', { width: o.w, height: o.h, viewBox: `0 0 ${o.w} ${o.h}`, class: 'u3l5-svg' }, el);
    this.ov = add(el, h('div', 'u3l5-ov'));
    this.V = Object.assign({}, o.V);
    this.names = o.names || Object.keys(o.V).slice(0, 3);
    if (o.s) { this.s = o.s; this.org = o.org; } else {
      const all = Object.values(o.V).concat(o.extra || []), xs = all.map((p) => p[0]), ys = all.map((p) => p[1]);
      const [pt, pr, pb, pl] = Array.isArray(o.pad) ? o.pad : [o.pad, o.pad, o.pad, o.pad];
      const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
      const aw = o.w - pl - pr, ah = o.h - pt - pb, s = this.s = Math.min(aw / ((x1 - x0) || 1), ah / ((y1 - y0) || 1));
      this.org = [pl + (aw - (x1 - x0) * s) / 2 - x0 * s, pt + (ah - (y1 - y0) * s) / 2 + y1 * s];
    }
    this.gFill = svgEl('g', {}, this.svg); this.gGlow = svgEl('g', {}, this.svg); this.gBody = svgEl('g', {}, this.svg); this.gTop = svgEl('g', {}, this.svg);
    this.px = {}; for (const k in this.V) this.px[k] = this.toPx(this.V[k]);
    const t3 = this.names.map((n) => this.px[n]); this.cen = [(t3[0][0] + t3[1][0] + t3[2][0]) / 3, (t3[0][1] + t3[1][1] + t3[2][1]) / 3];
  }
  toPx(p) { return [this.org[0] + p[0] * this.s, this.org[1] - p[1] * this.s]; }
  P(n) { return typeof n === 'string' ? this.px[n] : this.toPx(n); }
  others(n) { return this.names.filter((k) => k !== n); }
  len(p, q) { const A = this.V[p], B = this.V[q]; return Math.hypot(A[0] - B[0], A[1] - B[1]); }
  path(pts, a = {}, parent) {
    return svgEl('path', { class: 'bk-stroke', d: dPath(pts.map((p) => this.P(p))) + (a.closed ? 'Z' : ''), fill: a.fill || 'none', stroke: a.color || INK, 'stroke-width': a.width || this.o.lw, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-dasharray': a.dash || null }, parent || this.gBody);
  }
  body(a = {}) { return this.path([...this.names, this.names[0]], a); }
  /** the side opposite vertex n (or between two named points) */
  side(n, a = {}) { const [p, q] = Array.isArray(n) ? n : this.others(n); return this.path([p, q], a); }
  fill(ns, color, op = 0.14) { return svgEl('polygon', { points: ns.map((n) => this.P(n).map((v) => v.toFixed(1)).join(',')).join(' '), fill: color, 'fill-opacity': op, stroke: 'none' }, this.gFill); }
  glow(n, color, w = 13) { const [p, q] = Array.isArray(n) ? n : this.others(n); return svgEl('path', { d: dPath([this.P(p), this.P(q)]), stroke: color, 'stroke-width': w, 'stroke-opacity': 0.32, 'stroke-linecap': 'round', fill: 'none' }, this.gGlow); }
  lab(html, px, py, pos = 'c', cls = '', gap = 5) { const d = h('div', 'u3l5-lab' + (cls ? ' ' + cls : ''), html); this.ov.appendChild(d); place(d, px, py, pos, gap); d._at = [px, py, pos, gap]; return d; }
  relab(d, html) { d.innerHTML = html; const [x, y, p, g] = d._at; place(d, x, y, p, g); return d; }
  /** label on the side opposite n, outside the triangle (o.inside puts it inside) */
  sideLab(n, html, o = {}) {
    const [p, q] = Array.isArray(n) ? n : this.others(n), A = this.P(p), B = this.P(q), m = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
    let [nx, ny] = norm(-(B[1] - A[1]), B[0] - A[0]); const cen = o.cen || this.cen;
    if ((m[0] - cen[0]) * nx + (m[1] - cen[1]) * ny < 0) { nx = -nx; ny = -ny; }
    if (o.inside) { nx = -nx; ny = -ny; }
    const t = o.t != null ? o.t : 0.5, at = [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t];
    return this.lab(html, at[0] + nx * 3, at[1] + ny * 3, posFrom(nx, ny), 'u3l5-slab' + (o.cls ? ' ' + o.cls : ''), o.gap != null ? o.gap : 5);
  }
  vlab(n, html, o = {}) {
    const P = this.P(n), [nx, ny] = o.dir || norm(P[0] - this.cen[0], P[1] - this.cen[1]);
    return this.lab(html || T(n), P[0] + nx * 3, P[1] + ny * 3, o.pos || posFrom(nx, ny), 'u3l5-vx', o.gap != null ? o.gap : 5);
  }
  /** interior angle at n in degrees (between the two other triangle vertices, or o.ends) */
  deg(n, ends) { const V = this.P(n), [p, q] = (ends || this.others(n)).map((k) => this.P(k)); const u = norm(p[0] - V[0], p[1] - V[1]), v = norm(q[0] - V[0], q[1] - V[1]); return Math.acos(Math.max(-1, Math.min(1, u[0] * v[0] + u[1] * v[1]))) / RAD; }
  /** arc (+ optional label and wedge) at vertex n */
  ang(n, o = {}) {
    const V = this.P(n), [p, q] = (o.ends || this.others(n)).map((k) => this.P(k)), r = o.r || 30, color = o.color || INK;
    const u = norm(p[0] - V[0], p[1] - V[1]), v = norm(q[0] - V[0], q[1] - V[1]), deg = this.deg(n, o.ends);
    const g = svgEl('g', {}, this.gTop);
    let wedge = null;
    if (o.wedge) {
      const cr = u[0] * v[1] - u[1] * v[0], s0 = [V[0] + r * u[0], V[1] + r * u[1]], s1 = [V[0] + r * v[0], V[1] + r * v[1]];
      wedge = svgEl('path', { d: `M${V[0]} ${V[1]}L${s0[0]} ${s0[1]}A${r} ${r} 0 0 ${cr > 0 ? 1 : 0} ${s1[0]} ${s1[1]}Z`, fill: o.wedge, 'fill-opacity': o.op || 0.3, stroke: 'none' }, this.gFill);
    }
    const arc = angleArc(g, V, p, q, r, { color, width: o.width || 3 });
    let lab = null;
    if (o.lab != null) {
      const [bx, by] = norm(u[0] + v[0], u[1] + v[1]), dist = r + (o.labGap || 15) + (deg < 42 ? (42 - deg) * 0.9 : 0) + (o.extra || 0);
      lab = this.lab(o.lab, V[0] + bx * dist, V[1] + by * dist, 'c', 'u3l5-alab' + (o.cls ? ' ' + o.cls : ''));
      if (o.labColor || o.color) lab.style.color = o.labColor || o.color;
    }
    return { g, arc, lab, wedge, deg };
  }
  right(V, P, Q, o = {}) { return rightMark(o.parent || this.gTop, this.P(V), this.P(P), this.P(Q), o.s || 13, { color: o.color || INK }); }
  dot(n, color, r = 5) { const P = this.P(n); return svgEl('circle', { cx: P[0], cy: P[1], r, fill: color, stroke: '#fff', 'stroke-width': 2 }, this.gTop); }
}

/** a triangle from its base: names [left, right, top], angles at left and right, base length → V */
const mk = (n, aL, aR, base) => { const d = base * sinD(aR) / sinD(aL + aR); return { [n[0]]: [0, 0], [n[1]]: [base, 0], [n[2]]: [d * cosD(aL), d * sinD(aL)] }; };
const gStyle = (el, o) => { Object.assign(el.style, o); return el; };

/* ====================================================================================================
 * Static figures on the example cards (data-fig)
 * ==================================================================================================== */
const FIGS = {
  ex1a: (host) => {
    const F = new Tri(host, { w: 380, h: 200, pad: [24, 54, 18, 30], V: { P: [0, 0], Q: [15 * cosD(34), 0], R: [15 * cosD(34), 15 * sinD(34)] } });
    F.body(); F.right('Q', 'P', 'R'); F.ang('P', { r: 34, lab: T(dg(34)), extra: 8 });
    F.sideLab('Q', T('15.0\\text{ cm}')); F.sideLab('P', T('x'));
  },
  ex1b: (host) => {
    const F = new Tri(host, { w: 380, h: 200, pad: [20, 66, 34, 30], V: { P: [0, 0], Q: [11, 0], R: [11, 7] } });
    F.body(); F.right('Q', 'P', 'R'); F.ang('P', { r: 38, lab: T('\\theta'), extra: 6 });
    F.sideLab('R', T('11.0\\text{ cm}')); F.sideLab('P', T('7.0\\text{ cm}'));
  },
  ex2: (host) => {
    const V = mk(['A', 'B', 'C'], 38, 67, 14 * sinD(75) / sinD(67)); V.D = [V.C[0], 0];
    const F = new Tri(host, { w: 400, h: 250, pad: [36, 34, 40, 34], V });
    F.body(); F.path(['C', 'D'], { dash: '8 6', color: HC, width: 3 }); F.right('D', 'B', 'C', { color: HC });
    ['A', 'B', 'C'].forEach((n) => F.vlab(n)); F.vlab('D', null, { dir: [0, 1] });
    F.ang('A', { r: 36, lab: T(dg(38)) }); F.ang('B', { r: 30, lab: T(dg(67)) });
    F.sideLab('B', T('14.0\\text{ cm}')); F.lab(T(cH('h')), ...F.P([V.C[0], V.C[1] / 2]), 'e', 'u3l5-slab', 7);
  },
  ex3: (host) => {
    const V = mk(['A', 'B', 'C'], 55, 63, 10); V.D = [V.C[0], 0];
    const F = new Tri(host, { w: 360, h: 260, pad: [36, 30, 40, 30], V });
    F.body(); F.path(['C', 'D'], { dash: '8 6', color: HC, width: 3 }); F.right('D', 'B', 'C', { color: HC });
    ['A', 'B', 'C'].forEach((n) => F.vlab(n)); F.vlab('D', null, { dir: [0, 1] });
    F.ang('A', { r: 30, color: CA }); F.ang('B', { r: 30, color: CB });
    F.sideLab('B', T(cB('b'))); F.sideLab('A', T(cA('a'))); F.lab(T(cH('h')), ...F.P([V.C[0], V.C[1] / 2]), 'e', 'u3l5-slab', 7);
  },
  ex5a: (host) => {
    const F = new Tri(host, { w: 380, h: 210, pad: [34, 30, 30, 30], V: mk(['P', 'Q', 'R'], 52, 46, 23.5 * sinD(82) / sinD(52)) });
    F.body(); ['P', 'Q', 'R'].forEach((n) => F.vlab(n));
    F.ang('P', { r: 30, lab: T(dg(52)) }); F.ang('Q', { r: 30, lab: T(dg(46)) });
    F.sideLab('P', T('23.5\\text{ m}')); F.sideLab('Q', T('q'));
  },
  ex5b: (host) => {
    const F = new Tri(host, { w: 380, h: 210, pad: [32, 30, 34, 30], V: mk(['D', 'E', 'F'], 33, 109, 18) });
    F.body(); ['D', 'E', 'F'].forEach((n) => F.vlab(n));
    F.ang('D', { r: 36, lab: T(dg(33)) }); F.ang('E', { r: 24, lab: T(dg(109)), extra: 4 });
    F.sideLab('F', T('18.0\\text{ cm}')); F.sideLab('D', T('d')); F.sideLab('E', T('e'));
  },
  ex6a: (host) => {
    const B = asinD(9.2 * sinD(64) / 12.5), F = new Tri(host, { w: 380, h: 210, pad: [32, 30, 30, 30], V: mk(['A', 'B', 'C'], 64, B, 12.5 * sinD(180 - 64 - B) / sinD(64)) });
    F.body(); ['A', 'B', 'C'].forEach((n) => F.vlab(n));
    F.ang('A', { r: 30, lab: T(dg(64)) });
    F.sideLab('A', T('12.5\\text{ cm}')); F.sideLab('B', T('9.2\\text{ cm}'));
  },
  ex6b: (host) => {
    const X = asinD(14 * sinD(127) / 20), F = new Tri(host, { w: 380, h: 170, pad: [34, 30, 34, 30], V: mk(['X', 'Y', 'Z'], X, 180 - 127 - X, 20) });
    F.body(); ['X', 'Y', 'Z'].forEach((n) => F.vlab(n));
    F.ang('Z', { r: 22, lab: T(dg(127)), extra: -2 });
    F.sideLab('Z', T('20.0\\text{ m}')); F.sideLab('X', T('14.0\\text{ m}'));
  },
  ex7: (host) => towersFig(host, { w: 400, h: 300, stat: true }),
  ex8: (host) => riverFig(host, { w: 400, h: 290, stat: true })
};
function mountFigs() {
  document.querySelectorAll('[data-fig]').forEach((el) => { const f = FIGS[el.dataset.fig]; if (f && !el.dataset.done) { el.dataset.done = '1'; f(el); } });
}

/* the fire-tower map (Example 7), shared by the card and the explainer */
const TW = (() => { const AB = 12, AF = AB * sinD(62) / sinD(80), BF = AB * sinD(38) / sinD(80); return { AB, AF, BF, F: [AF * cosD(38), AF * sinD(38)] }; })();
function towersFig(host, o) {
  const NL = 8.6, V = { A: [0, 0], B: [TW.AB, 0], F: TW.F, NA: [0, NL], NB: [TW.AB, NL] };
  const F = new Tri(host, Object.assign({ pad: [44, 30, 40, 30], V, names: ['A', 'B', 'F'] }, o));
  const nA = F.path(['A', 'NA'], { color: GRAY, width: 2.5 }), nB = F.path(['B', 'NB'], { color: GRAY, width: 2.5 });
  const hA = arrowHead(F.gBody, ...F.P('NA'), 0, -1, { color: GRAY, width: 2.5 }), hB = arrowHead(F.gBody, ...F.P('NB'), 0, -1, { color: GRAY, width: 2.5 });
  const lNA = F.lab('<b>N</b>', ...F.P('NA'), 'n', 'u3l5-nlab', 3), lNB = F.lab('<b>N</b>', ...F.P('NB'), 'n', 'u3l5-nlab', 3);
  const base = F.side('F'), sA = F.side('B'), sB = F.side('A');
  const vA = F.vlab('A', null, { dir: [-0.7, 0.7] }), vB = F.vlab('B', null, { dir: [0.7, 0.7] }), vF = F.vlab('F', null, { dir: [0, -1] });
  const lAB = F.sideLab('F', T('12.0\\text{ km}'));
  const bA = F.ang('A', { ends: ['NA', 'F'], r: o.stat ? 30 : 46, lab: T(dg(52)), color: SLATE, extra: o.stat ? 0 : 4 });
  const bB = F.ang('B', { ends: ['NB', 'F'], r: o.stat ? 30 : 46, lab: T(dg(28)), color: SLATE, extra: o.stat ? 4 : 8 });
  return { F, nA, nB, hA, hB, lNA, lNB, base, sA, sB, vA, vB, vF, lAB, bA, bB };
}
/* the river (Example 8) */
const RV = (() => { const PQ = 250, PT = PQ * sinD(68) / sinD(55), w = PT * sinD(57); return { PQ, PT, w, T: [PT * cosD(57), w], area: 0.5 * PQ * w }; })();
function riverFig(host, o) {
  const V = { P: [0, 0], Q: [RV.PQ, 0], T: RV.T, W: [RV.T[0], 0], L0: [-38, 0], L1: [RV.PQ + 38, 0], U0: [-38, RV.w], U1: [RV.PQ + 38, RV.w] };
  const F = new Tri(host, Object.assign({ pad: [40, 18, 40, 18], V, names: ['P', 'Q', 'T'] }, o));
  svgEl('polygon', { points: ['L0', 'L1', 'U1', 'U0'].map((n) => F.P(n).join(',')).join(' '), fill: '#d8e8fb', stroke: 'none' }, F.gFill);
  for (let k = 1; k <= 3; k++) { const y = RV.w * k / 4, a = F.P([-30, y]), b = F.P([RV.PQ + 30, y]); svgEl('path', { d: `M${a[0]} ${a[1]} Q ${(a[0] + b[0]) / 2} ${a[1] - 7} ${b[0]} ${b[1]}`, stroke: '#a9c8ef', 'stroke-width': 2, fill: 'none', 'stroke-dasharray': '14 12' }, F.gFill); }
  F.path(['L0', 'L1'], { color: '#6f8f5a', width: 3 }); F.path(['U0', 'U1'], { color: '#6f8f5a', width: 3 });
  const rl = F.lab('river', ...F.P([RV.PQ + 22, RV.w * 0.5]), 'w', 'u3l5-river', 2);
  const tr = F.P('T'); const tree = svgEl('g', {}, F.gTop);
  svgEl('rect', { x: tr[0] - 32.5, y: tr[1] - 8, width: 5, height: 9, fill: '#7a5a3a' }, tree); svgEl('circle', { cx: tr[0] - 30, cy: tr[1] - 19, r: 12, fill: '#3f8f4f' }, tree);
  const base = F.side('T'), sP = F.side('Q'), sQ = F.side('P');
  const vP = F.vlab('P', null, { dir: [0, 1] }), vQ = F.vlab('Q', null, { dir: [0, 1] }), vT = F.vlab('T', null, { dir: [0.75, -0.66] });
  const lPQ = F.lab(T('250\\text{ m}'), ...F.P([RV.PQ / 2, 0]), 's', 'u3l5-slab', 7);
  const aP = F.ang('P', { r: 34, lab: T(dg(57)) }), aQ = F.ang('Q', { r: 30, lab: T(dg(68)) });
  return { F, rl, tree, base, sP, sQ, vP, vQ, vT, lPQ, aP, aQ };
}

/* ====================================================================================================
 * Warm-up: The Shade Sail
 * ==================================================================================================== */
const SAILS = {
  1: { ang: [60, 40, 80], given: 1, gv: 5 },
  2: { ang: [30, 90, 60], given: 0, gv: 5 },
  3: { ang: [25, 35, 120], given: 0, gv: 4 }
};
function mountSail() {
  const host = document.getElementById('u3l5-sail'); if (!host) return;
  const W = 560, H = 380, G = 340;
  let cur = 1, edgesOn = false, pick = null;
  const draw = () => {
    host.innerHTML = '';
    const d = SAILS[cur], [aL, aR, aT] = d.ang, k = d.gv / sinD(d.ang[d.given]);
    const e = d.ang.map((a) => k * sinD(a));        // edge opposite each corner
    const V0 = mk(['L', 'R', 'T'], aL, aR, e[2]), rot = -7 * RAD;
    const V = {}; for (const n in V0) { const [x, y] = V0[n]; V[n] = [x * Math.cos(rot) - y * Math.sin(rot), x * Math.sin(rot) + y * Math.cos(rot)]; }
    const svg = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u3l5-svg' }, host);
    const ov = add(host, h('div', 'u3l5-ov'));
    const defs = svgEl('defs', {}, svg), gr = svgEl('linearGradient', { id: 'u3l5-sky', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    svgEl('stop', { offset: '0', 'stop-color': '#dcecfb' }, gr); svgEl('stop', { offset: '1', 'stop-color': '#f7fbff' }, gr);
    const fg = svgEl('linearGradient', { id: 'u3l5-fab', x1: 0, y1: 0, x2: 1, y2: 1 }, defs);
    svgEl('stop', { offset: '0', 'stop-color': '#f4b860' }, fg); svgEl('stop', { offset: '1', 'stop-color': '#e98a4a' }, fg);
    svgEl('rect', { x: 0, y: 0, width: W, height: G, fill: 'url(#u3l5-sky)', rx: 14 }, svg);
    svgEl('rect', { x: 0, y: G, width: W, height: H - G, fill: '#9bc98a' }, svg);
    svgEl('circle', { cx: W - 52, cy: 46, r: 24, fill: '#ffd25a' }, svg);
    // fit the sail into x 50..510, y 40..G-60
    const xs = Object.values(V).map((p) => p[0]), ys = Object.values(V).map((p) => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const s = Math.min(440 / (x1 - x0), 220 / (y1 - y0)), ox = 60 + (440 - (x1 - x0) * s) / 2 - x0 * s, oy = 48 + (220 - (y1 - y0) * s) / 2 + y1 * s;
    const P = {}; for (const n in V) P[n] = [ox + V[n][0] * s, oy - V[n][1] * s];
    const cen = [(P.L[0] + P.R[0] + P.T[0]) / 3, (P.L[1] + P.R[1] + P.T[1]) / 3];
    // posts and ropes
    ['L', 'R', 'T'].forEach((n) => {
      const [x, y] = P[n], px = x + (x < cen[0] ? -10 : 10);
      svgEl('line', { x1: x, y1: y, x2: px, y2: y + 10, stroke: '#6b5a44', 'stroke-width': 2 }, svg);
      svgEl('rect', { x: px - 5, y: y + 8, width: 10, height: G + 8 - y - 8, fill: '#8a6a48', rx: 3 }, svg);
    });
    svgEl('polygon', { points: ['L', 'R', 'T'].map((n) => P[n].join(',')).join(' '), fill: 'url(#u3l5-fab)', 'fill-opacity': 0.97, stroke: '#9a4f1e', 'stroke-width': 3, 'stroke-linejoin': 'round' }, svg);
    const opp = { L: ['R', 'T'], R: ['T', 'L'], T: ['L', 'R'] }, idx = { L: 0, R: 1, T: 2 };
    const glows = {}, labs = {};
    ['L', 'R', 'T'].forEach((n) => {
      const [p, q] = opp[n], A = P[p], B = P[q];
      glows[n] = svgEl('line', { x1: A[0], y1: A[1], x2: B[0], y2: B[1], stroke: BR, 'stroke-width': 10, 'stroke-linecap': 'round', opacity: 0 }, svg);
      const m = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2]; let [nx, ny] = norm(-(B[1] - A[1]), B[0] - A[0]);
      if ((m[0] - cen[0]) * nx + (m[1] - cen[1]) * ny < 0) { nx = -nx; ny = -ny; }
      const L = h('div', 'u3l5-lab u3l5-sedge', T(`${fx(e[idx[n]], 1)}\\text{ m}`)); ov.appendChild(L); place(L, m[0] + nx * 4, m[1] + ny * 4, posFrom(nx, ny), 6);
      labs[n] = L; L.style.visibility = edgesOn || idx[n] === d.given ? 'visible' : 'hidden';
    });
    const arcs = {};
    ['L', 'R', 'T'].forEach((n) => {
      const V0p = P[n], [p, q] = opp[n], u = norm(P[p][0] - V0p[0], P[p][1] - V0p[1]), v = norm(P[q][0] - V0p[0], P[q][1] - V0p[1]);
      const a = d.ang[idx[n]], r = a >= 90 ? 22 : 30;
      arcs[n] = angleArc(svg, V0p, P[p], P[q], r, { color: '#5a2a0e', width: 2.5 });
      const [bx, by] = norm(u[0] + v[0], u[1] + v[1]), dist = r + 18 + (a < 42 ? (42 - a) * 0.9 : 0);
      const L = h('div', 'u3l5-lab u3l5-sang', T(dg(a))); ov.appendChild(L); place(L, V0p[0] + bx * dist, V0p[1] + by * dist, 'c');
      const hit = svgEl('circle', { cx: V0p[0], cy: V0p[1], r: 30, fill: '#fff', 'fill-opacity': 0.01, stroke: BR, 'stroke-width': 0, 'data-tap': '', class: 'u3l5-hit' }, svg);
      hit.addEventListener('click', () => { pick = pick === n ? null : n; mark(); });
    });
    const mark = () => ['L', 'R', 'T'].forEach((n) => {
      const on = pick === n; glows[n].setAttribute('opacity', on ? 0.55 : 0); arcs[n].setAttribute('stroke', on ? BR : '#5a2a0e'); arcs[n].setAttribute('stroke-width', on ? 5 : 2.5);
      if (on) labs[n].style.visibility = 'visible'; else labs[n].style.visibility = edgesOn || idx[n] === d.given ? 'visible' : 'hidden';
      labs[n].classList.toggle('u3l5-on', on);
    });
    mark();
  };
  const wrap = host.parentElement;
  wrap.querySelectorAll('[data-sail]').forEach((b) => b.addEventListener('click', () => { cur = +b.dataset.sail; pick = null; draw(); wrap.querySelectorAll('[data-sail]').forEach((x) => x.classList.toggle('u3l5-bon', x === b)); }));
  const eb = document.getElementById('u3l5-edges');
  if (eb) eb.addEventListener('click', () => { edgesOn = !edgesOn; eb.classList.toggle('u3l5-bon', edgesOn); eb.textContent = edgesOn ? 'Hide edges' : 'Show edges'; draw(); });
  const first = wrap.querySelector('[data-sail="1"]'); if (first) first.classList.add('u3l5-bon');
  draw();
}

/* ====================================================================================================
 * 1. label: vertices, opposite sides, the angle sum, the largest angle faces the longest side
 * ==================================================================================================== */
const LB = {
  abc: { n: ['A', 'B', 'C'], aL: 50, aR: 60, base: 10.0, unit: 'cm', label: '△ABC' },
  pqr: { n: ['P', 'Q', 'R'], aL: 42, aR: 63, base: 9.0, unit: 'm', label: '△PQR' },
  xyz: { n: ['X', 'Y', 'Z'], aL: 28, aR: 40, base: 12.0, unit: 'cm', label: 'Obtuse △XYZ' }
};
const label = {
  title: 'Each angle and the side across from it',
  height: 372, minW: 940,
  choices: Object.keys(LB).map((v) => ({ v, label: LB[v].label })),
  ask: (v) => `Label ${T(`\\triangle ${LB[v].n.join('')}`)}: which side goes with which angle?`,
  make(stage, v, ex) {
    const d = LB[v], n = d.n, ang = [d.aL, d.aR, 180 - d.aL - d.aR];
    const F = new Tri(stage, { x: 0, y: 0, w: 540, h: 372, pad: [44, 44, 44, 44], V: mk(n, d.aL, d.aR, d.base) });
    F.body({ width: 4 });
    const pnl = panel(stage, 556, 8, ex.W - 564, 356, '');
    const vls = n.map((k) => hide(F.vlab(k)));
    const lens = n.map((k) => { const [p, q] = F.others(k); return F.len(p, q); });
    const parts = n.map((k, i) => {
      const col = PCOL[i], low = k.toLowerCase();
      const A = F.ang(k, { r: ang[i] > 90 ? 24 : 32, color: col, width: 3.5, wedge: col, op: 0.22, lab: T(kc(col)(dg(ang[i]))), extra: 2 });
      [A.g, A.wedge, A.lab].forEach(hide);
      const gl = hideS(F.glow(k, col, 14)), sl = hide(F.sideLab(k, T(kc(col)(low)), { cls: 'u3l5-big' }));
      return { A, gl, sl, low, col };
    });
    const iMax = ang.indexOf(Math.max(...ang)), iMin = ang.indexOf(Math.min(...ang));
    const L = [lineIn(pnl, `Vertices: ${T(n.join(',\\ '))} (capitals).<br>Angles: ${T(n.map((k) => `\\angle ${k}`).join(',\\ '))}.`)]
      .concat(parts.map((p, i) => lineIn(pnl, `${T(kc(p.col)(p.low))} is opposite ${T(kc(p.col)(`\\angle ${n[i]}`))}`)))
      .concat([lineIn(pnl, `${T(ang.map(dg).join('+') + '=180^\\circ')}`, 'u3l5-line-key'),
        lineIn(pnl, `Largest angle ${T(kc(PCOL[iMax])(dg(ang[iMax])))} → longest side ${T(kc(PCOL[iMax])(`${parts[iMax].low}\\approx${fx(lens[iMax], 1)}`))} ${d.unit}<br>Smallest ${T(kc(PCOL[iMin])(dg(ang[iMin])))} → shortest ${T(kc(PCOL[iMin])(`${parts[iMin].low}\\approx${fx(lens[iMin], 1)}`))} ${d.unit}`, 'u3l5-line-ans')]);
    const lenL = parts.map((p, i) => hide(F.sideLab(n[i], T(`${fx(lens[i], 1)}\\text{ ${d.unit}}`), { inside: true, cls: 'u3l5-small' })));
    const steps = [
      { cap: `Name the <b>vertices</b> with capital letters. The angles are ${T(n.map((k) => `\\angle ${k}`).join(',\\ '))}.`, run: async (c) => { for (const e of vls) await pop(c, e, 260); await show(c, L[0]); } }
    ];
    parts.forEach((p, i) => steps.push({
      cap: `${T(kc(p.col)(`\\angle ${n[i]}`))} and the side it does <b>not</b> touch: that side is ${T(kc(p.col)(p.low))}, the matching lowercase letter.`,
      run: async (c) => { svgOn(p.A.g); svgOn(p.A.wedge); await drawIn(p.A.arc, 300, c); await appearIn(c, p.A.wedge, 250); svgOn(p.gl); await drawIn(p.gl, 450, c); await pop(c, p.sl); await show(c, L[1 + i]); }
    }));
    steps.push({ cap: `The three angles always add to ${T('180^\\circ')}: ${T(ang.map(dg).join('+') + '=180^\\circ')}.`, run: async (c) => { for (const p of parts) await pop(c, p.A.lab, 300); await show(c, L[4]); } });
    steps.push({ cap: `The <b>largest</b> angle is opposite the <b>longest</b> side, and the smallest angle is opposite the shortest side.${ang[iMax] > 90 ? ` Here the obtuse angle ${T(`\\angle ${n[iMax]}`)} faces the longest side.` : ''}`,
      run: async (c) => { for (const e of lenL) await show(c, e); await pulse(c, parts[iMax].sl, 1.25, 600); await show(c, L[5]); } });
    return steps;
  }
};

/* ====================================================================================================
 * 1. soh: SOH CAH TOA in a right triangle (Example 1 checks)
 * ==================================================================================================== */
const SH = {
  e1a: { base: 15 * cosD(34), rise: 15 * sinD(34), sides: { q: '15.0\\text{ cm}', p: 'x' }, ang: dg(34), label: 'Example 1(a) check' },
  e1b: { base: 11, rise: 7, sides: { r: '11.0\\text{ cm}', p: '7.0\\text{ cm}' }, ang: '\\theta', label: 'Example 1(b) check' }
};
const soh = {
  title: 'SOH CAH TOA in a right triangle',
  height: 340, minW: 940,
  choices: Object.keys(SH).map((v) => ({ v, label: SH[v].label })),
  ask: (v) => (v === 'e1a' ? `Example 1(a): determine ${T('x')}.` : `Example 1(b): determine ${T('\\theta')}.`),
  make(stage, v, ex) {
    const d = SH[v];
    const R = new RightTriangle(stage, { x: 8, y: 6, width: 520, height: 330, base: d.base, rise: d.rise, right: 'br', names: { right: 'Q', base: 'P', top: 'R' }, sides: d.sides, angles: { P: d.ang }, pad: 92 });
    const pnl = panel(stage, 548, 8, ex.W - 556, 324, '');
    const mn = div(pnl, 'u3l5-soh', '<span>SOH</span><span>CAH</span><span>TOA</span>');
    const sp = [...mn.children];
    if (v === 'e1a') {
      const x = 15 * sinD(34);
      const L = [lineIn(pnl, `${T('x')}: <b>opposite</b> ${T(dg(34))} · ${T('15.0')}: <b>hypotenuse</b>`), lineIn(pnl, T('\\sin34^\\circ=\\dfrac{x}{15.0}'), 'u3l5-big'), lineIn(pnl, T(`x=15.0\\sin34^\\circ\\approx${fx(x, 4)}\\dots`)), lineIn(pnl, `${T('x\\approx8.4')} cm`, 'u3l5-line-ans')];
      return [
        { cap: `Name the sides from the ${T(dg(34))} angle’s point of view.`, run: (c) => R.highlight(c, 'P', { long: true }) },
        { cap: `${T('x')} is <b>opposite</b> and ${T('15.0')} is the <b>hypotenuse</b>: O and H, so <b>SOH</b>, the sine.`, run: async (c) => { await show(c, L[0]); sp[0].classList.add('u3l5-on'); await pulse(c, sp[0], 1.15); await show(c, L[1]); } },
        { cap: `Multiply both sides by ${T('15.0')}: ${T('x=15.0\\sin34^\\circ\\approx8.4')} cm.`, run: async (c) => { await show(c, L[2]); await show(c, L[3]); } }
      ];
    }
    const th = Math.atan(7 / 11) / RAD;
    const L = [lineIn(pnl, `${T('7.0')}: <b>opposite</b> ${T('\\theta')} · ${T('11.0')}: <b>adjacent</b>`), lineIn(pnl, T('\\tan\\theta=\\dfrac{7.0}{11.0}'), 'u3l5-big'), lineIn(pnl, `Undo tan with ${T('\\tan^{-1}')} (<span class="keys"><kbd>2nd</kbd><kbd>tan⁻¹</kbd></span>):<br>${T(`\\theta=\\tan^{-1}\\!\\left(\\dfrac{7.0}{11.0}\\right)\\approx${fx(th, 3)}^\\circ`)}`), lineIn(pnl, `${T('\\theta\\approx32^\\circ')}`, 'u3l5-line-ans')];
    return [
      { cap: `Name the sides from the angle ${T('\\theta')}’s point of view.`, run: (c) => R.highlight(c, 'P', { long: true }) },
      { cap: `${T('7.0')} is <b>opposite</b> and ${T('11.0')} is <b>adjacent</b>: O and A, so <b>TOA</b>, the tangent.`, run: async (c) => { await show(c, L[0]); sp[2].classList.add('u3l5-on'); await pulse(c, sp[2], 1.15); await show(c, L[1]); } },
      { cap: `To find the <b>angle</b>, use the inverse: ${T('\\theta=\\tan^{-1}\\!\\left(\\tfrac{7.0}{11.0}\\right)\\approx32^\\circ')}.`, run: async (c) => { await show(c, L[2]); await show(c, L[3]); } }
    ];
  }
};

/* ====================================================================================================
 * 2. split: Example 2 — the altitude splits the triangle into two right triangles
 * ==================================================================================================== */
const SPL = { ex2: { A: 38, B: 67, b: 14, label: 'Example 2 check' }, try: { A: 50, B: 72, b: 9, label: 'Another triangle' } };
const split = {
  title: 'Split it with an altitude',
  height: 410, minW: 940,
  choices: Object.keys(SPL).map((v) => ({ v, label: SPL[v].label })),
  ask: (v) => { const d = SPL[v]; return `${T(`\\angle A=${dg(d.A)},\\ \\angle B=${dg(d.B)},\\ AC=${fx(d.b, 1)}`)} cm. Find the altitude ${T('h')}, then ${T('BC')}.`; },
  make(stage, v, ex) {
    const d = SPL[v], C = 180 - d.A - d.B, c = d.b * sinD(C) / sinD(d.B), hh = d.b * sinD(d.A), AD = d.b * cosD(d.A), BC = hh / sinD(d.B);
    const V = { A: [0, 0], B: [c, 0], C: [AD, hh], D: [AD, 0] }, bS = fx(d.b, 1);
    const box0 = { x: 26, y: 4, w: 500, h: 330, pad: [44, 60, 46, 40], V };
    const F = new Tri(stage, box0);
    const body = F.body({ width: 4 });
    const vl = ['A', 'B', 'C'].map((n) => F.vlab(n));
    const aA = F.ang('A', { r: 40, lab: T(dg(d.A)) }), aB = F.ang('B', { r: 32, lab: T(dg(d.B)) });
    const lb = F.sideLab('B', T(`${bS}\\text{ cm}`));
    const alt = hideS(F.path(['C', 'D'], { color: HC, width: 3.5, dash: '9 7' })), rm = hideS(F.right('D', 'B', 'C', { color: HC })), vD = hide(F.vlab('D', null, { dir: [0, 1] }));
    const lh = hide(F.lab(T(cH('h')), ...F.P([AD, hh / 2]), 'e', 'u3l5-slab', 7));
    const st = hide(stamp(stage, 'no right angle', { ok: false, x: 300, y: 372, size: 'sm' }));
    // the two right triangles, at the same scale and place, then slid apart
    const piece = (names, fillc) => {
      const P = new Tri(stage, Object.assign({}, box0, { V, names, s: F.s, org: F.org, cls: 'u3l5-piece' }));
      P.fill(names, fillc, 0.2); P.body({ width: 4 }); P.path(['C', 'D'], { color: HC, width: 3.5 }); P.right('D', names[0] === 'A' ? 'A' : 'B', 'C', { color: HC });
      hide(P.el); return P;
    };
    const L1 = piece(['A', 'D', 'C'], '#e8b6c6'), R1 = piece(['D', 'B', 'C'], '#c7cbd6');
    L1.vlab('A'); L1.vlab('C', null, { dir: [-0.3, -1] }); L1.vlab('D', null, { dir: [0, 1] }); L1.ang('A', { r: 40, lab: T(dg(d.A)) }); L1.sideLab('D', T(`${bS}`)); L1.lab(T(cH('h')), ...L1.P([AD, hh / 2]), 'w', 'u3l5-slab', 8);
    R1.vlab('B'); R1.vlab('C', null, { dir: [0.3, -1] }); R1.vlab('D', null, { dir: [0, 1] }); R1.ang('B', { r: 30, lab: T(dg(d.B)) }); R1.lab(T(cH('h')), ...R1.P([AD, hh / 2]), 'e', 'u3l5-slab', 8);
    const bcl = R1.sideLab('D', T(cU('BC')), { gap: 6 });
    const pnl = panel(stage, 548, 8, ex.W - 556, 394, '');
    const L = [lineIn(pnl, `<b>△ACD:</b> ${T(`\\sin${dg(d.A)}=\\dfrac{h}{${bS}}`)}`), lineIn(pnl, `${T(`h=${bS}\\sin${dg(d.A)}\\approx${fx(hh, 2)}`)} cm<br><span class="muted">keep ${T(`${fx(hh, 4)}\\dots`)}</span>`, 'u3l5-line-key'),
      lineIn(pnl, `<b>△BCD:</b> ${T(`\\sin${dg(d.B)}=\\dfrac{h}{BC}`)}`), lineIn(pnl, `${T(`BC=\\dfrac{h}{\\sin${dg(d.B)}}=\\dfrac{${fx(hh, 4)}\\dots}{\\sin${dg(d.B)}}\\approx${fx(BC, 1)}`)} cm`, 'u3l5-line-ans')];
    const spread = async (c) => { await Promise.all([anim(c, L1.el, [{ transform: 'translateX(0)' }, { transform: 'translateX(-26px)' }], 700), anim(c, R1.el, [{ transform: 'translateX(0)' }, { transform: 'translateX(34px)' }], 700)]); };
    return [
      { cap: `An <b>oblique</b> triangle: no right angle, so SOH CAH TOA can’t be used on it directly.`, run: (c) => { st.style.opacity = 1; return stampIn(c, st); } },
      { cap: `Drop the <b>altitude</b> ${T(cH('h'))} from ${T('C')}, perpendicular to ${T('AB')}. It meets ${T('AB')} at ${T('D')}.`, run: async (c) => { st.style.opacity = 0; svgOn(alt); await drawIn(alt, 600, c); svgOn(rm); await appearIn(c, rm); await pop(c, vD); await pop(c, lh); } },
      { cap: `Now there are <b>two right triangles</b>: ${T('\\triangle ACD')} and ${T('\\triangle BCD')}. They share the side ${T(cH('h'))}.`, run: async (c) => {
        [body, aA.g, aB.g, alt, rm].forEach((e) => { e.style.opacity = 0.12; }); [...vl, aA.lab, aB.lab, lb, vD, lh].forEach((e) => { e.style.opacity = 0; });
        L1.el.style.opacity = 1; R1.el.style.opacity = 1; await spread(c); } },
      { cap: `In ${T('\\triangle ACD')}, ${T(cH('h'))} is opposite ${T(dg(d.A))} and ${T(bS)} is the hypotenuse: ${T(`\\sin${dg(d.A)}=\\dfrac{h}{${bS}}`)}.`, run: (c) => show(c, L[0]) },
      { cap: `${T(`h=${bS}\\sin${dg(d.A)}\\approx${fx(hh, 2)}`)} cm. Keep all its decimals in the calculator.`, run: (c) => show(c, L[1]) },
      { cap: `In ${T('\\triangle BCD')}, ${T(cH('h'))} is opposite ${T(dg(d.B))} and ${T('BC')} is the hypotenuse: ${T(`\\sin${dg(d.B)}=\\dfrac{h}{BC}`)}.`, run: (c) => show(c, L[2]) },
      { cap: `${T(`BC=\\dfrac{h}{\\sin${dg(d.B)}}\\approx${fx(BC, 1)}`)} cm. Two steps through ${T('h')}; the sine law will do this in <b>one</b>.`, run: async (c) => { await show(c, L[3]); R1.relab(bcl, T(`${fx(BC, 1)}`)); await pop(c, bcl); } }
    ];
  }
};

/* ====================================================================================================
 * 3. proof (STAR): the same h two ways → a/sin A = b/sin B, colour-coded pairs
 * ==================================================================================================== */
const PF = {
  acute: { A: 55, B: 65, c: 10, from: 'C', label: 'Acute triangle' },
  other: { A: 36, B: 80, c: 10, from: 'C', label: 'Another shape' },
  fromA: { A: 55, B: 65, c: 10, from: 'A', label: 'Altitude from A' },
  obtuse: { A: 30, B: 118, c: 6, from: 'C', label: 'Obtuse ∠B' }
};
const pc = (L) => kc(PCOL['ABC'.indexOf(L.toUpperCase())])(L);   // a letter in its pair colour
const proof = {
  title: 'The sine law: the same height, written two ways',
  height: 452, minW: 940, capH: 86,
  choices: Object.keys(PF).map((v) => ({ v, label: PF[v].label })),
  ask: (v) => (PF[v].from === 'A' ? `Prove ${T('\\dfrac{b}{\\sin B}=\\dfrac{c}{\\sin C}')} with the altitude from ${T('A')}.` : `Prove ${T('\\dfrac{a}{\\sin A}=\\dfrac{b}{\\sin B}')} with the altitude from ${T('C')}.`),
  make(stage, v, ex) {
    const d = PF[v], Cg = 180 - d.A - d.B, a = d.c * sinD(d.A) / sinD(Cg), b = d.c * sinD(d.B) / sinD(Cg);
    const V = mk(['A', 'B', 'C'], d.A, d.B, d.c), deg = { A: d.A, B: d.B, C: Cg }, len = { a, b, c: d.c };
    // apex, the two base vertices X1, X2 (X1's right triangle on the left), the foot D
    const apex = d.from, [X1, X2] = apex === 'C' ? ['A', 'B'] : ['B', 'C'];
    const G0 = V[X1], G1 = V[X2], Q = V[apex], ux = G1[0] - G0[0], uy = G1[1] - G0[1], tt = ((Q[0] - G0[0]) * ux + (Q[1] - G0[1]) * uy) / (ux * ux + uy * uy);
    V.D = [G0[0] + tt * ux, G0[1] + tt * uy];
    const obt = tt > 1;   // the foot lies beyond X2: X2 is obtuse
    const x1 = X1.toLowerCase(), x2 = X2.toLowerCase();
    const F = new Tri(stage, { x: 0, y: 0, w: 560, h: 286, pad: [40, 40, 36, 36], V, names: ['A', 'B', 'C'] });
    const f1 = hideS(F.fill([X1, 'D', apex], '#e8b6c6', 0.28)), f2 = hideS(F.fill([X2, 'D', apex], '#c7cbd6', 0.4));
    F.body({ width: 4 });
    const ext = obt ? hideS(F.path([X2, 'D'], { color: GRAY, width: 2.5, dash: '6 6' })) : null;
    ['A', 'B', 'C'].forEach((n) => F.vlab(n));
    const sl = {}; ['A', 'B', 'C'].forEach((n) => { sl[n] = F.sideLab(n, T(pc(n.toLowerCase())), { cls: 'u3l5-big' }); });
    const arcs = {}; ['A', 'B', 'C'].forEach((n) => { arcs[n] = F.ang(n, { r: deg[n] > 90 ? 22 : 30, color: PCOL['ABC'.indexOf(n)], wedge: PCOL['ABC'.indexOf(n)], op: 0.25 }); hideS(arcs[n].wedge); });
    const ext2 = obt ? F.ang(X2, { ends: ['D', apex], r: 26, color: SLATE, lab: T(`180^\\circ-${X2}`), cls: 'u3l5-small', extra: 18 }) : null;
    if (ext2) [ext2.g, ext2.lab].forEach(hide);
    const alt = hideS(F.path([apex, 'D'], { color: HC, width: 3.5, dash: '9 7' })), rm = hideS(F.right('D', X1, apex, { color: HC }));
    const DD = F.P('D'), AP = F.P(apex), hm = [(DD[0] + AP[0]) / 2, (DD[1] + AP[1]) / 2];
    const vD = hide(F.lab(T('D'), DD[0], DD[1], apex === 'C' ? 's' : 'se', 'u3l5-vx', 6));
    const lh = hide(F.lab(T(cH('h')), hm[0], hm[1], apex === 'C' ? (obt ? 'w' : 'e') : 'ne', 'u3l5-slab', 7));
    const glows = {}; ['A', 'B', 'C'].forEach((n) => { glows[n] = hideS(F.glow(n, PCOL['ABC'.indexOf(n)], 14)); });
    const degL = ['A', 'B', 'C'].map((n) => { const A0 = F.ang(n, { r: 1, lab: T(dg(fz(deg[n], 1))), cls: 'u3l5-small', extra: 22 }); hide(A0.g); return hide(A0.lab); });
    // the two working cards under the triangle
    const tn = (X) => (apex === 'A' ? `A${X}D` : `${X}${apex}D`), t1 = `\\triangle ${tn(X1)}`, t2 = `\\triangle ${tn(X2)}`;
    const card = (x, tri, cls, l1, l2) => {
      const k = div(stage, 'u3l5-card ' + cls, `<div class="u3l5-ch">In ${T(tri)}</div>`, x, 296, 268, 150);
      const a1 = div(k, 'u3l5-cl', l1), a2 = div(k, 'u3l5-cl', l2); hide(a1); hide(a2); hide(k); return { k, a1, a2, src: a2.querySelector('.u3l5-slot') };
    };
    const rhs1 = `${pc(x2)}\\sin ${pc(X1)}`, rhs2 = `${pc(x1)}\\sin ${pc(X2)}`;
    const K1 = card(8, t1, 'u3l5-card1', T(`\\sin ${pc(X1)}=\\dfrac{${cH('h')}}{${pc(x2)}}`), `${T(`${cH('h')}=`)}<span class="u3l5-slot">${T(rhs1)}</span>`);
    const K2 = card(284, t2, 'u3l5-card2', obt ? T(`\\sin(180^\\circ-${pc(X2)})=\\dfrac{${cH('h')}}{${pc(x1)}}`) : T(`\\sin ${pc(X2)}=\\dfrac{${cH('h')}}{${pc(x1)}}`),
      obt ? `${T(`${cH('h')}=${pc(x1)}\\sin(180^\\circ-${X2})=`)}<span class="u3l5-slot">${T(rhs2)}</span>` : `${T(`${cH('h')}=`)}<span class="u3l5-slot">${T(rhs2)}</span>`);
    // the derivation panel
    const pnl = panel(stage, 572, 0, ex.W - 572, 448, '');
    const P1 = lineIn(pnl, `<span class="u3l5-slot">${T(rhs2)}</span>${T('=')}<span class="u3l5-slot">${T(rhs1)}</span>`, 'u3l5-big u3l5-pl1');
    const P2 = lineIn(pnl, T(`\\dfrac{${pc(x1)}\\cancel{\\sin ${X2}}}{\\sin ${X1}\\cancel{\\sin ${X2}}}=\\dfrac{${pc(x2)}\\cancel{\\sin ${X1}}}{\\cancel{\\sin ${X1}}\\sin ${X2}}`));
    const P3 = lineIn(pnl, T(`\\dfrac{${pc(x1)}}{\\sin ${pc(X1)}}=\\dfrac{${pc(x2)}}{\\sin ${pc(X2)}}`), 'u3l5-huge u3l5-line-key');
    const r1 = len[x1] / sinD(deg[X1]), r2 = len[x2] / sinD(deg[X2]);
    const P4 = lineIn(pnl, `This triangle: ${T(`\\dfrac{${fx(len[x1], 2)}}{\\sin${dg(fz(deg[X1], 1))}}\\approx${fx(r1, 2)}`)}, &nbsp;${T(`\\dfrac{${fx(len[x2], 2)}}{\\sin${dg(fz(deg[X2], 1))}}\\approx${fx(r2, 2)}`)} ✓`, 'u3l5-small');
    const law = `\\dfrac{${pc('a')}}{\\sin ${pc('A')}}=\\dfrac{${pc('b')}}{\\sin ${pc('B')}}=\\dfrac{${pc('c')}}{\\sin ${pc('C')}}`;
    const P5 = lineIn(pnl, `${apex === 'C' ? `An altitude from ${T('A')} gives ${T(`\\tfrac{${pc('b')}}{\\sin ${pc('B')}}=\\tfrac{${pc('c')}}{\\sin ${pc('C')}}`)} the same way:` : `With the altitude from ${T('C')} (${T(`\\tfrac{${pc('a')}}{\\sin ${pc('A')}}=\\tfrac{${pc('b')}}{\\sin ${pc('B')}}`)}):`}<div class="u3l5-lawl">${T(law)}</div><span class="u3l5-kpill">known pair</span> Use it when one side <b>and</b> its opposite angle are both known.`, 'u3l5-line-ans');
    const rel = (el) => { const sr = stage.getBoundingClientRect(), k = sr.width / stage.offsetWidth || 1, r = el.getBoundingClientRect(); return [(r.left - sr.left) / k, (r.top - sr.top) / k]; };
    const slide = async (c) => {
      const tg = P1.querySelectorAll('.u3l5-slot'), jobs = [];
      for (const [src, dst] of [[K2.src, tg[0]], [K1.src, tg[1]]]) {
        const [sx, sy] = rel(src), [tx, ty] = rel(dst), fl = div(stage, 'u3l5-fly', src.innerHTML, sx, sy);
        src.classList.add('u3l5-gone');
        jobs.push(anim(c, fl, [{ transform: 'translate(0,0) scale(1)' }, { transform: `translate(${(tx - sx) / 2}px, ${(ty - sy) / 2 - 30}px) scale(1.25)`, offset: 0.5 }, { transform: `translate(${tx - sx}px, ${ty - sy}px) scale(1)` }], 1100).then(() => { fl.remove(); }));
      }
      await Promise.all(jobs); P1.style.transform = 'none'; await appear(c, P1, 200);
    };
    const tri1 = T(t1), tri2 = T(t2);
    const steps = [
      { cap: `Any triangle. Drop the altitude ${T(cH('h'))} from ${T(apex)} ${obt ? `to ${T(X1 + X2)} <b>extended</b>: ${T(`\\angle ${X2}`)} is obtuse, so it lands outside` : `to ${T(X1 + X2)}`}. It meets the line at ${T('D')}.`,
        run: async (c) => { if (ext) { svgOn(ext); await drawIn(ext, 400, c); } svgOn(alt); await drawIn(alt, 600, c); svgOn(rm); await appearIn(c, rm); await pop(c, vD); await pop(c, lh); } },
      { cap: `Left: the right triangle ${tri1}. ${T(cH('h'))} is opposite ${T(`\\angle ${pc(X1)}`)} and ${T(pc(x2))} is the hypotenuse.`,
        run: async (c) => { svgOn(f1); await appearIn(c, f1, 300); svgOn(arcs[X1].wedge); await appearIn(c, arcs[X1].wedge); await show(c, K1.k); await show(c, K1.a1); } },
      { cap: `Multiply both sides by ${T(pc(x2))}: ${T(`${cH('h')}=${rhs1}`)}.`, run: (c) => show(c, K1.a2) },
      { cap: obt ? `Right: ${tri2}. Its angle at ${T(X2)} is ${T(`180^\\circ-${X2}`)}, and ${T(`\\sin(180^\\circ-${X2})=\\sin ${X2}`)}, so ${T(`${cH('h')}=${rhs2}`)}.` : `Right: ${tri2}. ${T(`\\sin ${pc(X2)}=\\dfrac{h}{${pc(x1)}}`)}, so ${T(`${cH('h')}=${rhs2}`)}.`,
        run: async (c) => { svgOn(f2); await appearIn(c, f2, 300); if (ext2) { svgOn(ext2.g); await appearIn(c, ext2.g); await pop(c, ext2.lab); } else { svgOn(arcs[X2].wedge); await appearIn(c, arcs[X2].wedge); } await show(c, K2.k); await show(c, K2.a1); await show(c, K2.a2); } },
      { cap: `Both expressions are the <b>same height</b> ${T(cH('h'))}. Slide them together: ${T(`${rhs2}=${rhs1}`)}.`, run: (c) => slide(c) },
      { cap: `Divide both sides by ${T(`\\sin ${X1}\\sin ${X2}`)}.`, run: (c) => show(c, P2) },
      { cap: `${T(`\\dfrac{${pc(x1)}}{\\sin ${pc(X1)}}=\\dfrac{${pc(x2)}}{\\sin ${pc(X2)}}`)}: each side sits over the sine of <b>its own opposite angle</b>. The colours pair up.`,
        run: async (c) => { await show(c, P3); for (const n of [X1, X2]) { svgOn(glows[n]); await drawIn(glows[n], 380, c); svgOn(arcs[n].wedge); await pulse(c, sl[n], 1.3, 500); } } },
      { cap: `Check with this triangle’s measurements: both ratios come out the same, about ${T(fx(r1, 2))}.`, run: async (c) => { for (const n of ['A', 'B', 'C']) { F.relab(sl[n], T(`${pc(n.toLowerCase())}\\approx${fx(len[n.toLowerCase()], 2)}`)); await pop(c, sl[n], 260); } for (const e of degL) await show(c, e); await show(c, P4); } },
      { cap: `${apex === 'C' ? 'A third altitude adds the last pair.' : 'Put both results together.'} The <b>sine law</b>: ${T(law)}. To use it you need a <b>known pair</b>.`,
        run: async (c) => { const n3 = 'ABC'.split('').find((k) => k !== X1 && k !== X2); svgOn(glows[n3]); await drawIn(glows[n3], 380, c); svgOn(arcs[n3].wedge); await appearIn(c, arcs[n3].wedge); await show(c, P5); } }
    ];
    return steps;
  }
};

/* ====================================================================================================
 * 3. supp: sin(180° − θ) = sin θ on the graph of y = sin θ
 * ==================================================================================================== */
const SU = { 130: { note: '' }, 109: { note: 'Example 5(b)' }, 127: { note: 'Example 6(b)' }, 150: { note: '' } };
const supp = {
  title: 'An obtuse angle and its partner have the same sine',
  height: 362, minW: 940,
  choices: [130, 109, 127, 150].map((v) => ({ v, label: `${v}°` + (SU[v].note ? ` (${SU[v].note})` : '') })),
  ask: (v) => `Compare ${T(`\\sin${dg(v)}`)} with ${T(`\\sin${dg(180 - v)}`)}.`,
  make(stage, v, ex) {
    const th = +v, pr = 180 - th, y = sinD(th);
    const G = new Graph(stage, { x: 0, y: 2, width: 590, height: 358, xmin: -14, xmax: 196, ymin: -0.16, ymax: 1.2, xstep: 30, ystep: 0.25, numbers: false, xtitle: '\\theta', ytitle: '', fontSize: 16 });
    [[0, '0^\\circ'], [180, '180^\\circ']].forEach(([x, s]) => G.label(x, 0, T(s), { pos: 's', cls: 'u3l5-axl' }));
    G.label(0, 1, T('1'), { pos: 'w', cls: 'u3l5-axl' });
    const curve = hideS(G.fn((x) => sinD(x), { from: 0, to: 180, color: SLATE, arrows: false, width: 3.5 }));
    const cl = hide(G.label(150, sinD(150) + 0.05, T('y=\\sin\\theta'), { pos: 'ne', cls: 'bk-ptlab' }));
    const p1 = hide(G.point(th, y, { color: BR, r: 7 })), d1 = hideS(G.segment([th, 0], [th, y], { color: BR, dash: true, width: 3 }));
    const l1 = hide(G.label(th, 0, T(cBr(dg(th))), { pos: 's', cls: 'u3l5-axl u3l5-axb' }));
    const fold = hideS(G.vline(90)), foldL = hide(G.label(90, 1.13, T('90^\\circ'), { pos: 'c', cls: 'bk-ptlab u3l5-axl' }));
    const p2 = hide(G.point(pr, y, { color: KP, r: 7 })), d2 = hideS(G.segment([pr, 0], [pr, y], { color: KP, dash: true, width: 3 }));
    const l2 = hide(G.label(pr, 0, T(cK(dg(pr))), { pos: 's', cls: 'u3l5-axl u3l5-axb' }));
    const ghost = hide(G.point(th, y, { color: BR, r: 6 }));
    const hl = hideS(G.segment([pr, y], [th, y], { color: KP, dash: true, width: 2.5 }));
    const hy = hide(G.label((th + pr) / 2, y, T(`${fx(y, 4)}`), { pos: 'n', cls: 'bk-ptlab' }));
    const pnl = panel(stage, 606, 8, ex.W - 614, 346, '');
    const L = [lineIn(pnl, T(`\\sin${dg(th)}\\approx${fx(y, 4)}`)), lineIn(pnl, T(`180^\\circ-${dg(th)}=${dg(pr)}`)), lineIn(pnl, T(`\\sin${dg(pr)}\\approx${fx(y, 4)}`), 'u3l5-line-key'),
      lineIn(pnl, `Quadrant II, reference angle ${T(cK(dg(pr)))}: sine is <b>positive</b> (the S in CAST).`, 'u3l5-small'),
      lineIn(pnl, `${T(`\\sin^{-1}(${fx(y, 4)})=${dg(pr)}`)} only: the calculator never gives ${T(dg(th))}.`, 'u3l5-line-ans u3l5-small')];
    return [
      { cap: `The graph of ${T('y=\\sin\\theta')} from ${T('0^\\circ')} to ${T('180^\\circ')}: up to 1 at ${T('90^\\circ')}, then back down. Every value is <b>positive</b>.`, run: async (c) => { svgOn(curve); await drawIn(curve, 900, c); await show(c, cl); } },
      { cap: `${T(cBr(`\\theta=${dg(th)}`))}: its sine is the <b>height</b> of this point, ${T(`\\sin${dg(th)}\\approx${fx(y, 4)}`)}.`, run: async (c) => { svgOn(d1); await drawIn(d1, 400, c); await pop(c, p1); await pop(c, l1); await show(c, L[0]); } },
      { cap: `Fold the graph at ${T('90^\\circ')}: ${T(dg(th))} lands on ${T(cK(`180^\\circ-${dg(th)}=${dg(pr)}`))}.`, run: async (c) => {
        svgOn(fold); await appearIn(c, fold); await pop(c, foldL); ghost.style.opacity = 1; await G.move(c, ghost, pr, y, 800); ghost.style.opacity = 0; await pop(c, p2); svgOn(d2); await drawIn(d2, 400, c); await pop(c, l2); await show(c, L[1]); } },
      { cap: `<b>Same height</b>, so the same sine: ${T(`\\sin${dg(th)}=\\sin${dg(pr)}\\approx${fx(y, 4)}`)}.`, run: async (c) => { svgOn(hl); await drawIn(hl, 500, c); await pop(c, hy); await show(c, L[2]); } },
      { cap: `Lesson 3: ${T(dg(th))} is in quadrant II with reference angle ${T(cK(dg(pr)))}, and sine is positive there.`, run: (c) => show(c, L[3]) },
      { cap: `The sine law works with obtuse angles. But going <b>backwards</b>, ${T('\\sin^{-1}')} gives only the acute ${T(dg(pr))}: to <b>find</b> an angle we must know it is acute.`, run: (c) => show(c, L[4]) }
    ];
  }
};

/* ====================================================================================================
 * 4. pairHunt: which triangles have a known pair?
 * ==================================================================================================== */
const pairHunt = {
  title: 'Hunt for the known pair',
  height: 380, minW: 940,
  ask: `Which triangles have a <b>known pair</b> (an angle and its opposite side)?`,
  make(stage, v, ex) {
    const cw = (ex.W - 36) / 4;
    const ssaB = asinD(9 * sinD(48) / 12);
    const sssA = Math.acos((9 * 9 + 10 * 10 - 12 * 12) / (2 * 9 * 10)) / RAD, sssB = Math.acos((12 * 12 + 10 * 10 - 81) / (2 * 12 * 10)) / RAD;
    const D = [
      { V: mk(['A', 'B', 'C'], 48, 70, 12 * sinD(62) / sinD(48)), ang: { A: 48, B: 70 }, side: { A: '12' }, head: '1 · AAS' },
      { V: mk(['A', 'B', 'C'], 48, 70, 12), ang: { A: 48, B: 70 }, side: { C: '12' }, head: '2 · ASA' },
      { V: mk(['A', 'B', 'C'], 48, ssaB, 12 * sinD(180 - 48 - ssaB) / sinD(48)), ang: { A: 48 }, side: { A: '12', B: '9' }, head: '3 · SSA' },
      { V: mk(['A', 'B', 'C'], sssA, sssB, 10), ang: {}, side: { A: '12', B: '9', C: '10' }, head: '4 · SSS' }
    ];
    const figs = D.map((d, i) => {
      const x = 6 + i * (cw + 8), bx = div(stage, 'u3l5-mini', `<div class="u3l5-mh">${d.head}</div>`, x, 0, cw, 236);
      const F = new Tri(bx, { x: 0, y: 30, w: cw, h: 204, pad: [30, 34, 30, 34], V: d.V, font: 18 });
      F.body(); ['A', 'B', 'C'].forEach((n) => F.vlab(n));
      const marks = {};
      for (const n of ['A', 'B', 'C']) {
        const A = F.ang(n, { r: 22, lab: d.ang[n] ? T(dg(d.ang[n])) : null, cls: 'u3l5-small', wedge: KP, op: 0.4 }); hideS(A.wedge); if (!d.ang[n]) hide(A.g);
        const S = d.side[n] ? F.sideLab(n, T(d.side[n]), { cls: 'u3l5-small' }) : null;
        marks[n] = { A, S, gl: hideS(F.glow(n, KP, 12)) };
      }
      const verdict = hide(div(stage, 'u3l5-verdict', '', x, 248, cw, 126));
      return { F, marks, verdict, x };
    });
    const pair = async (c, i, n) => { const m = figs[i].marks[n]; svgOn(m.A.g); svgOn(m.A.wedge); await appearIn(c, m.A.wedge); svgOn(m.gl); await drawIn(m.gl, 400, c); };
    const say = async (c, i, html, ok) => { const vv = figs[i].verdict; vv.innerHTML = html; vv.classList.add(ok ? 'u3l5-vok' : 'u3l5-vno'); await show(c, vv); };
    const c3a = figs[1].F.ang('C', { r: 22, lab: T(cK('62^\\circ')), cls: 'u3l5-small', color: KP }), c3lab = hide(c3a.lab); hide(c3a.g);
    return [
      { cap: `<b>1.</b> ${T('\\angle A=48^\\circ')} and ${T('a=12')} are both known: a <b>known pair</b>. The sine law can start right away.`, run: async (c) => { await pair(c, 0, 'A'); await say(c, 0, `✓ ${T('\\angle A')} and ${T('a')}<br>Find ${T('b')} or ${T('c')} next.`, true); } },
      { cap: `<b>2.</b> ${T('c=12')} is known, but ${T('\\angle C')} isn’t, yet. The angle sum gives it: ${T('\\angle C=180^\\circ-48^\\circ-70^\\circ=62^\\circ')}. Now ${T('\\angle C')} and ${T('c')} are a pair.`,
        run: async (c) => { svgOn(c3a.g); await drawIn(c3a.arc, 300, c); await pop(c, c3lab); await pair(c, 1, 'C'); await say(c, 1, `✓ after ${T('180^\\circ')}:<br>${T('\\angle C=62^\\circ')} and ${T('c')}`, true); } },
      { cap: `<b>3.</b> ${T('\\angle A=48^\\circ')} and ${T('a=12')}: a known pair. The unknown is the <b>angle</b> ${T('\\angle B')}, so put the sines on top.`, run: async (c) => { await pair(c, 2, 'A'); await say(c, 2, `✓ ${T('\\angle A')} and ${T('a')}<br>Find ${T('\\angle B')}: sines on top.`, true); } },
      { cap: `<b>4.</b> Three sides and <b>no angles</b>: no known pair, and the angle sum can’t help. The sine law can’t start. Next lesson: the <b>cosine law</b>.`, run: async (c) => { await say(c, 3, `✗ no angle at all<br>Cosine law (Lesson 6)`, false); } }
    ];
  }
};

/* ====================================================================================================
 * 4. findSide: Example 4 and 5 checks
 * ==================================================================================================== */
const FS = {
  e4a: { n: ['A', 'B', 'C'], ang: [38, 67], kv: 14, ks: 'B', find: ['A'], unit: 'cm', label: 'Example 4(a)', note: `The same ${T('9.4')} cm as Example 2, in <b>one</b> step.` },
  e4b: { n: ['A', 'B', 'C'], ang: [38, 67], kv: 14, ks: 'B', find: ['C'], unit: 'cm', label: 'Example 4(b)' },
  e5a: { n: ['P', 'Q', 'R'], ang: [52, 46], kv: 23.5, ks: 'P', find: ['Q'], unit: 'm', label: 'Example 5(a)' },
  e5b: { n: ['D', 'E', 'F'], ang: [33, 109], kv: 18, ks: 'F', find: ['E', 'D'], unit: 'cm', label: 'Example 5(b)', note: `Check: ${T('e')} is opposite the largest angle, ${T('109^\\circ')}, so it is the longest side ✓` }
};
const findSide = {
  title: 'Finding a side with the sine law',
  height: 430, minW: 940, capH: 86,
  choices: Object.keys(FS).map((v) => ({ v, label: FS[v].label + ' check' })),
  ask: (v) => {
    const d = FS[v], [L, R] = d.n;
    return `${d.label}: ${T(`\\angle ${L}=${dg(d.ang[0])},\\ \\angle ${R}=${dg(d.ang[1])},\\ ${d.ks.toLowerCase()}=${fx(d.kv, 1)}`)} ${d.unit}. Find ${d.find.map((n) => T(n.toLowerCase())).join(' and ')}.`;
  },
  make(stage, v, ex) {
    const d = FS[v], n = d.n, deg = { [n[0]]: d.ang[0], [n[1]]: d.ang[1], [n[2]]: 180 - d.ang[0] - d.ang[1] };
    const K = d.ks, kS = fx(d.kv, 1), k = d.kv / sinD(deg[K]);
    const base = k * sinD(deg[n[2]]), V = mk(n, d.ang[0], d.ang[1], base);
    const F = new Tri(stage, { x: 0, y: 0, w: 520, h: 430, pad: [52, 50, 52, 50], V });
    F.body({ width: 4 }); n.forEach((m) => F.vlab(m));
    const known = [n[0], n[1]], third = n[2], need3 = !known.includes(K) || d.find.some((f) => !known.includes(f));
    const A = {}; n.forEach((m) => { A[m] = F.ang(m, { r: deg[m] > 90 ? 24 : 32, lab: T(dg(deg[m])), wedge: KP, op: 0.35, extra: 2 }); hideS(A[m].wedge); if (m === third) [A[m].g, A[m].lab].forEach(hide); });
    const kGl = hideS(F.glow(K, KP, 15)), kLab = F.sideLab(K, T(`${kS}\\text{ ${d.unit}}`));
    const U = d.find.map((m) => ({ m, low: m.toLowerCase(), val: k * sinD(deg[m]), gl: hideS(F.glow(m, UN, 13)), lab: hide(F.sideLab(m, T(cU(m.toLowerCase())), { cls: 'u3l5-big' })) }));
    const pnl = panel(stage, 536, 0, ex.W - 536, 430, '');
    const steps = [];
    steps.push({ cap: `Given: ${T(`\\angle ${n[0]}=${dg(d.ang[0])}`)}, ${T(`\\angle ${n[1]}=${dg(d.ang[1])}`)} and ${T(`${K.toLowerCase()}=${kS}`)}. We want ${U.map((u) => T(cU(u.low))).join(' and ')} (red).`,
      run: async (c) => { for (const u of U) { svgOn(u.gl); await drawIn(u.gl, 400, c); await pop(c, u.lab); } } });
    if (need3) {
      const why = !known.includes(K) ? `The known side ${T(`${K.toLowerCase()}=${kS}`)} is opposite ${T(`\\angle ${third}`)}, which isn’t given.` : `The side we want is opposite ${T(`\\angle ${third}`)}, which isn’t given.`;
      const l3 = lineIn(pnl, T(`\\angle ${third}=180^\\circ-${dg(d.ang[0])}-${dg(d.ang[1])}=${dg(deg[third])}`));
      steps.push({ cap: `${why} Find it first: ${T(`\\angle ${third}=180^\\circ-${dg(d.ang[0])}-${dg(d.ang[1])}=${dg(deg[third])}`)}.`, run: async (c) => { svgOn(A[third].g); await drawIn(A[third].arc, 300, c); await pop(c, A[third].lab); await show(c, l3); } });
    }
    const lk = lineIn(pnl, `<span class="u3l5-kpill">known pair</span> ${T(`\\angle ${K}=${dg(deg[K])}`)}, ${T(`${K.toLowerCase()}=${kS}`)}`);
    steps.push({ cap: `<b>Known pair:</b> ${T(cK(`\\angle ${K}=${dg(deg[K])}`))} and ${T(cK(`${K.toLowerCase()}=${kS}`))}, an angle and the side opposite it.`,
      run: async (c) => { svgOn(A[K].wedge); await appearIn(c, A[K].wedge); svgOn(kGl); await drawIn(kGl, 450, c); await pulse(c, kLab, 1.2); await show(c, lk); } });
    U.forEach((u) => {
      const s = deg[u.m], prop = `\\dfrac{${u.low}}{\\sin${dg(s)}}=\\dfrac{${kS}}{\\sin${dg(deg[K])}}`, sol = `${u.low}=\\dfrac{${kS}\\sin${dg(s)}}{\\sin${dg(deg[K])}}\\approx${fx(u.val, 1)}`;
      const a1 = lineIn(pnl, T(prop)), a2 = lineIn(pnl, `${T(sol)} ${d.unit}`, 'u3l5-line-ans');
      steps.push({ cap: `${T(cU(u.low))} is opposite ${T(`\\angle ${u.m}=${dg(s)}`)}. Sine law with the side we want <b>on top</b>: ${T(prop)}.`, run: async (c) => { svgOn(A[u.m].g); await pulse(c, A[u.m].lab, 1.25); await show(c, a1); } });
      steps.push({ cap: `Multiply both sides by ${T(`\\sin${dg(s)}`)}: ${T(sol)} ${d.unit}.`, run: async (c) => { await show(c, a2); u.gl.style.opacity = 0.25; u.gl.setAttribute('stroke', COLORS.green); F.relab(u.lab, T(`${fx(u.val, 1)}`)); await pop(c, u.lab); } });
    });
    if (d.note) { const ln = lineIn(pnl, d.note, 'u3l5-small'); steps.push({ cap: d.note, run: (c) => show(c, ln) }); }
    return steps;
  }
};

/* ====================================================================================================
 * 5. findAngle: Example 6 checks
 * ==================================================================================================== */
const FA = {
  e6a: { n: ['A', 'B', 'C'], kn: 'A', kd: 64, kv: 12.5, on: 'B', ov: 9.2, unit: 'cm', label: 'Example 6(a) check', why: 'long' },
  e6b: { n: ['X', 'Y', 'Z'], kn: 'Z', kd: 127, kv: 20, on: 'X', ov: 14, unit: 'm', label: 'Example 6(b) check', why: 'obtuse' }
};
const findAngle = {
  title: 'Finding an angle: sines on top',
  height: 430, minW: 940, capH: 86,
  choices: Object.keys(FA).map((v) => ({ v, label: FA[v].label })),
  ask: (v) => { const d = FA[v]; return `${T(`\\angle ${d.kn}=${dg(d.kd)},\\ ${d.kn.toLowerCase()}=${fx(d.kv, 1)},\\ ${d.on.toLowerCase()}=${fx(d.ov, 1)}`)} ${d.unit}. Find ${T(`\\angle ${d.on}`)}, then solve the triangle.`; },
  make(stage, v, ex) {
    const d = FA[v], K = d.kn, O = d.on, R = d.n.find((m) => m !== K && m !== O), k = K.toLowerCase(), o = O.toLowerCase(), r = R.toLowerCase();
    const sO = d.ov * sinD(d.kd) / d.kv, aO = asinD(sO), aR = 180 - d.kd - aO, vr = d.kv * sinD(aR) / sinD(d.kd);
    const deg = { [K]: d.kd, [O]: aO, [R]: aR }, kS = fx(d.kv, 1), oS = fx(d.ov, 1);
    const V = mk(d.n, deg[d.n[0]], deg[d.n[1]], d.kv * sinD(deg[d.n[2]]) / sinD(d.kd));
    const F = new Tri(stage, { x: 0, y: 0, w: 520, h: 430, pad: [56, 50, 56, 50], V });
    F.body({ width: 4 }); d.n.forEach((m) => F.vlab(m));
    const aK = F.ang(K, { r: d.kd > 90 ? 24 : 32, lab: T(dg(d.kd)), wedge: KP, op: 0.35 }); hideS(aK.wedge);
    const aOo = F.ang(O, { r: 32, lab: T(cU(`\\angle ${O}=?`)), wedge: UN, op: 0.18, extra: 18 }); hideS(aOo.wedge);
    const aRr = F.ang(R, { r: aR > 90 ? 24 : 32, lab: T(`${dg(fx(aR, 1))}`), extra: 6 }); [aRr.g, aRr.lab].forEach(hide);
    const kGl = hideS(F.glow(K, KP, 15)), kL = F.sideLab(K, T(`${k}=${kS}`)), oL = F.sideLab(O, T(`${o}=${oS}`));
    const rL = hide(F.sideLab(R, T(`${r}\\approx${fx(vr, 1)}`)));
    const pnl = panel(stage, 536, 0, ex.W - 536, 430, '');
    const reason = d.why === 'long' ? `${T(`${k}=${kS}>${o}=${oS}`)}: the known angle is opposite the <b>longer</b> side, so ${T(`\\angle ${O}<\\angle ${K}`)}: <b>acute</b>.`
      : `${T(`\\angle ${K}=${dg(d.kd)}`)} is <b>obtuse</b>. Only one angle can be, so ${T(`\\angle ${O}`)} is acute.`;
    const L = [
      lineIn(pnl, `<span class="u3l5-kpill">known pair</span> ${T(`\\angle ${K}=${dg(d.kd)}`)}, ${T(`${k}=${kS}`)}`),
      lineIn(pnl, reason, 'u3l5-small'),
      lineIn(pnl, T(`\\dfrac{\\sin ${O}}{${oS}}=\\dfrac{\\sin${dg(d.kd)}}{${kS}}\\ \\Rightarrow\\ \\sin ${O}=\\dfrac{${oS}\\sin${dg(d.kd)}}{${kS}}\\approx${fx(sO, 4)}`), 'u3l5-small'),
      lineIn(pnl, `${T(`\\angle ${O}=\\sin^{-1}(${fx(sO, 4)}\\dots)\\approx${fx(aO, 1)}^\\circ\\approx${dg(Math.round(aO))}`)}`, 'u3l5-line-ans'),
      lineIn(pnl, `${T(`180^\\circ-${fx(aO, 1)}^\\circ=${fx(180 - aO, 1)}^\\circ`)}: ${T(`${dg(d.kd)}+${fx(180 - aO, 1)}^\\circ>180^\\circ`)} <b class="u3l5-red">✗</b>`, 'u3l5-small'),
      lineIn(pnl, T(`\\angle ${R}\\approx180^\\circ-${dg(d.kd)}-${fx(aO, 1)}^\\circ=${fx(aR, 1)}^\\circ\\approx${dg(Math.round(aR))}`), 'u3l5-small'),
      lineIn(pnl, `${T(`${r}=\\dfrac{${kS}\\sin${fx(aR, 1)}^\\circ}{\\sin${dg(d.kd)}}\\approx${fx(vr, 1)}`)} ${d.unit}`, 'u3l5-line-ans')
    ];
    return [
      { cap: `Given ${T(`\\angle ${K}=${dg(d.kd)}`)}, ${T(`${k}=${kS}`)} and ${T(`${o}=${oS}`)}. We want the <b>angle</b> ${T(cU(`\\angle ${O}`))}.`, run: async (c) => { svgOn(aOo.wedge); await appearIn(c, aOo.wedge); await pulse(c, aOo.lab, 1.2); } },
      { cap: `<b>Known pair:</b> ${T(cK(`\\angle ${K}=${dg(d.kd)}`))} and ${T(cK(`${k}=${kS}`))}.`, run: async (c) => { svgOn(aK.wedge); await appearIn(c, aK.wedge); svgOn(kGl); await drawIn(kGl, 450, c); await show(c, L[0]); } },
      { cap: d.why === 'long' ? `Can ${T(`\\angle ${O}`)} be obtuse? No: ${T(`${k}>${o}`)}, and the larger side faces the larger angle, so ${T(`\\angle ${O}`)} is smaller than ${T(dg(d.kd))}. Only one triangle.`
        : `Can ${T(`\\angle ${O}`)} be obtuse? No: ${T(`\\angle ${K}`)} already is, and a triangle has only one obtuse angle. Only one triangle.`, run: (c) => show(c, L[1]) },
      { cap: `<b>Sines on top</b>: ${T(`\\dfrac{\\sin ${O}}{${oS}}=\\dfrac{\\sin${dg(d.kd)}}{${kS}}`)}, so ${T(`\\sin ${O}\\approx${fx(sO, 4)}`)}.`, run: (c) => show(c, L[2]) },
      { cap: `${T(`\\angle ${O}=\\sin^{-1}(${fx(sO, 4)}\\dots)\\approx${fx(aO, 1)}^\\circ`)}, so ${T(`\\angle ${O}\\approx${dg(Math.round(aO))}`)}.`, run: async (c) => { F.relab(aOo.lab, T(`${fx(aO, 1)}^\\circ`)); aOo.wedge.setAttribute('fill', COLORS.green); await pop(c, aOo.lab); await show(c, L[3]); } },
      { cap: `The obtuse angle with the same sine, ${T(`${fx(180 - aO, 1)}^\\circ`)}, doesn’t fit beside ${T(dg(d.kd))}. Only the acute answer works.`, run: (c) => show(c, L[4]) },
      { cap: `The angle sum: ${T(`\\angle ${R}\\approx180^\\circ-${dg(d.kd)}-${fx(aO, 1)}^\\circ=${fx(aR, 1)}^\\circ\\approx${dg(Math.round(aR))}`)}.`, run: async (c) => { svgOn(aRr.g); await drawIn(aRr.arc, 300, c); await pop(c, aRr.lab); await show(c, L[5]); } },
      { cap: `The last side, with the known pair: ${T(`${r}=\\dfrac{${kS}\\sin${fx(aR, 1)}^\\circ}{\\sin${dg(d.kd)}}\\approx${fx(vr, 1)}`)} ${d.unit}. The triangle is <b>solved</b>.`, run: async (c) => { await pop(c, rL); await show(c, L[6]); } }
    ];
  }
};

/* ====================================================================================================
 * 6. bearing: reading bearings; Example 7 (fire towers)
 * ==================================================================================================== */
const bearing = {
  title: 'Bearings: face north (or south), then turn',
  height: 420, minW: 940, capH: 86,
  choices: [{ v: 'read', label: 'Reading bearings' }, { v: 'ex7', label: 'Example 7 check' }],
  ask: (v) => (v === 'read' ? `Draw the bearings N${T('52^\\circ')}E, N${T('28^\\circ')}W and S${T('40^\\circ')}W.` : `Example 7: how far is the fire from each tower?`),
  make(stage, v, ex) {
    if (v === 'read') return bearingRead(stage, ex);
    const M = towersFig(stage, { x: 0, y: 0, w: 520, h: 420, font: 20, pad: [44, 96, 40, 40] });
    const F = M.F, A = F.P('A'), B = F.P('B'), Fp = F.P('F');
    [M.sA, M.sB, M.vF, M.bA.g, M.bA.lab, M.bB.g, M.bB.lab].forEach(hide);
    hideS(M.sA); hideS(M.sB);
    const rayA = hideS(svgEl('path', { class: 'bk-stroke', d: '', stroke: BR, 'stroke-width': 3.5, fill: 'none', 'stroke-linecap': 'round' }, F.gTop));
    const rayB = hideS(svgEl('path', { class: 'bk-stroke', d: '', stroke: BR, 'stroke-width': 3.5, fill: 'none', 'stroke-linecap': 'round' }, F.gTop));
    const RL = Math.hypot(Fp[0] - A[0], Fp[1] - A[1]) * 1.12, RLB = Math.hypot(Fp[0] - B[0], Fp[1] - B[1]) * 1.25;
    const setRay = (el, P0, phi, Lr) => { const e = [P0[0] + Lr * sinD(phi), P0[1] - Lr * cosD(phi)]; el.setAttribute('d', dPath([P0, e])); };
    const fdot = hide(svgEl('g', {}, F.gTop)); svgEl('circle', { cx: Fp[0], cy: Fp[1], r: 9, fill: '#e8542c', stroke: '#fff', 'stroke-width': 2 }, fdot);
    const iA = F.ang('A', { r: 56, color: CA, lab: T(cA('38^\\circ')), wedge: CA, op: 0.15 }), iB = F.ang('B', { r: 56, color: CB, lab: T(cB('62^\\circ')), wedge: CB, op: 0.15 });
    [iA.g, iA.lab, iA.wedge, iB.g, iB.lab, iB.wedge].forEach(hide);
    const iF = F.ang('F', { r: 30, lab: T(cK('80^\\circ')), wedge: KP, op: 0.4, color: KP }); [iF.g, iF.lab, iF.wedge].forEach(hide);
    const gAB = hideS(F.glow('F', KP, 15));
    const lAF = hide(F.sideLab('B', T(cU('AF\\approx10.8')), { cls: 'u3l5-big' })), lBF = hide(F.sideLab('A', T(cU('BF\\approx7.5')), { cls: 'u3l5-big' }));
    const pnl = panel(stage, 536, 0, ex.W - 536, 420, '');
    const L = [lineIn(pnl, `At ${T('A')}: ${T('\\angle FAB=90^\\circ-52^\\circ=38^\\circ')}`), lineIn(pnl, `At ${T('B')}: ${T('\\angle FBA=90^\\circ-28^\\circ=62^\\circ')}`),
      lineIn(pnl, `${T('\\angle F=180^\\circ-38^\\circ-62^\\circ=80^\\circ')}<br><span class="u3l5-kpill">known pair</span> ${T('\\angle F')}, ${T('AB=12.0')}`),
      lineIn(pnl, `${T(`AF=\\dfrac{12.0\\sin62^\\circ}{\\sin80^\\circ}\\approx${fx(TW.AF, 1)}`)} km`, 'u3l5-line-ans'), lineIn(pnl, `${T(`BF=\\dfrac{12.0\\sin38^\\circ}{\\sin80^\\circ}\\approx${fx(TW.BF, 1)}`)} km`, 'u3l5-line-ans')];
    const sweep = (c, el, P0, to, Lr) => { el.style.opacity = 1; return tween(c, 1100, (t) => setRay(el, P0, to * t, Lr)); };
    return [
      { cap: `Tower ${T('B')} is 12.0 km due <b>east</b> of tower ${T('A')}. Each tower has its own <b>north</b> line.`, run: async (c) => { await pulse(c, M.lNA, 1.3); await pulse(c, M.lNB, 1.3); } },
      { cap: `From ${T('A')}: N${T('52^\\circ')}E. Face north, then turn ${T('52^\\circ')} toward the east.`, run: async (c) => { await sweep(c, rayA, A, 52, RL); svgOn(M.bA.g); await drawIn(M.bA.arc, 300, c); await pop(c, M.bA.lab); } },
      { cap: `From ${T('B')}: N${T('28^\\circ')}W. Face north, then turn ${T('28^\\circ')} toward the west.`, run: async (c) => { await sweep(c, rayB, B, -28, RLB); svgOn(M.bB.g); await drawIn(M.bB.arc, 300, c); await pop(c, M.bB.lab); } },
      { cap: `The two sightings cross at the fire ${T('F')}: triangle ${T('ABF')}.`, run: async (c) => { fdot.style.opacity = 1; await pop(c, fdot); await pop(c, M.vF); rayA.style.opacity = rayB.style.opacity = 0.25; svgOn(M.sA); svgOn(M.sB); await Promise.all([drawIn(M.sA, 400, c), drawIn(M.sB, 400, c)]); } },
      { cap: `Inside the triangle at ${T('A')}: north to east is ${T('90^\\circ')}, so ${T('\\angle FAB=90^\\circ-52^\\circ=38^\\circ')}.`, run: async (c) => { [iA.g, iA.wedge].forEach(svgOn); await appearIn(c, iA.wedge); await pop(c, iA.lab); await show(c, L[0]); } },
      { cap: `At ${T('B')}: north to west is ${T('90^\\circ')}, so ${T('\\angle FBA=90^\\circ-28^\\circ=62^\\circ')}.`, run: async (c) => { [iB.g, iB.wedge].forEach(svgOn); await appearIn(c, iB.wedge); await pop(c, iB.lab); await show(c, L[1]); } },
      { cap: `${T('\\angle F=180^\\circ-38^\\circ-62^\\circ=80^\\circ')}, opposite ${T('AB=12.0')} km: the <b>known pair</b>.`, run: async (c) => { [iF.g, iF.wedge].forEach(svgOn); await appearIn(c, iF.wedge); await pop(c, iF.lab); svgOn(gAB); await drawIn(gAB, 450, c); await show(c, L[2]); } },
      { cap: `${T('AF')} is opposite ${T('\\angle B=62^\\circ')}: ${T(`AF=\\dfrac{12.0\\sin62^\\circ}{\\sin80^\\circ}\\approx${fx(TW.AF, 1)}`)} km.`, run: async (c) => { await pop(c, lAF); await show(c, L[3]); } },
      { cap: `${T('BF')} is opposite ${T('\\angle A=38^\\circ')}: ${T(`BF=\\dfrac{12.0\\sin38^\\circ}{\\sin80^\\circ}\\approx${fx(TW.BF, 1)}`)} km. Tower ${T('B')} is closer.`, run: async (c) => { await pop(c, lBF); await show(c, L[4]); } }
    ];
  }
};
function bearingRead(stage, ex) {
  const cx = 250, cy = 214, R = 168;
  const svg = svgEl('svg', { width: 520, height: 420, viewBox: '0 0 520 420', class: 'u3l5-svg' }, stage); svg.style.position = 'absolute'; svg.style.left = '0'; svg.style.top = '0';
  const ov = div(stage, 'u3l5-ov', '', 0, 0, 520, 420);
  svgEl('circle', { cx, cy, r: R, fill: '#f6f3ec', stroke: '#d8d1c2', 'stroke-width': 2 }, svg);
  for (let a = 0; a < 360; a += 10) { const r0 = a % 90 === 0 ? R - 18 : a % 30 === 0 ? R - 11 : R - 6; svgEl('line', { x1: cx + r0 * sinD(a), y1: cy - r0 * cosD(a), x2: cx + R * sinD(a), y2: cy - R * cosD(a), stroke: '#b9b1a0', 'stroke-width': a % 90 === 0 ? 2.5 : 1.5 }, svg); }
  const NS = svgEl('line', { x1: cx, y1: cy - R, x2: cx, y2: cy + R, stroke: SLATE, 'stroke-width': 2.5 }, svg);
  svgEl('line', { x1: cx - R, y1: cy, x2: cx + R, y2: cy, stroke: '#c9c2b2', 'stroke-width': 2 }, svg);
  [['N', 0, -1], ['E', 1, 0], ['S', 0, 1], ['W', -1, 0]].forEach(([t, dx, dy]) => { const d = h('div', 'u3l5-lab u3l5-nlab u3l5-big', `<b>${t}</b>`); ov.appendChild(d); place(d, cx + dx * (R + 18), cy + dy * (R + 18), 'c'); });
  const B = [
    { from: 0, turn: 52, col: BR, name: 'N52°E', words: `face <b>north</b>, turn ${T('52^\\circ')} toward the <b>east</b>` },
    { from: 0, turn: -28, col: CB, name: 'N28°W', words: `face <b>north</b>, turn ${T('28^\\circ')} toward the <b>west</b>` },
    { from: 180, turn: 40, col: CC, name: 'S40°W', words: `face <b>south</b>, turn ${T('40^\\circ')} toward the <b>west</b>` }
  ];
  const parts = B.map((b) => {
    const ray = svgEl('path', { d: '', stroke: b.col, 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, svg); hideS(ray);
    const arc = svgEl('path', { d: '', stroke: b.col, 'stroke-width': 3, fill: 'none' }, svg); hideS(arc);
    const end = b.from + b.turn, mid = b.from + b.turn / 2, lab = h('div', 'u3l5-lab u3l5-alab', T(kc(b.col)(dg(Math.abs(b.turn))))); ov.appendChild(lab); place(lab, cx + 78 * sinD(mid), cy - 78 * cosD(mid), 'c'); hide(lab);
    const nm = h('div', 'u3l5-lab u3l5-bname', b.name); nm.style.color = b.col; ov.appendChild(nm); place(nm, cx + (R - 34) * sinD(end), cy - (R - 34) * cosD(end), posFrom(sinD(end), -cosD(end)), 4); hide(nm);
    const set = (t) => {
      const a = b.from + b.turn * t; ray.setAttribute('d', dPath([[cx, cy], [cx + (R - 22) * sinD(a), cy - (R - 22) * cosD(a)]]));
      const r = 52, s0 = [cx + r * sinD(b.from), cy - r * cosD(b.from)], s1 = [cx + r * sinD(a), cy - r * cosD(a)];
      arc.setAttribute('d', `M${s0[0]} ${s0[1]}A${r} ${r} 0 0 ${b.turn > 0 ? 1 : 0} ${s1[0]} ${s1[1]}`);
    };
    return { b, ray, arc, lab, nm, set };
  });
  const pnl = panel(stage, 536, 0, ex.W - 536, 420, '');
  const L = parts.map((p) => lineIn(pnl, `<b style="color:${p.b.col}">${p.b.name}</b>: ${p.b.words}`)).concat([lineIn(pnl, `The angle is always measured from the <b>north–south</b> line. Inside a triangle you often need ${T('90^\\circ')} minus it.`, 'u3l5-line-key u3l5-small')]);
  const go = async (c, p) => { p.ray.style.opacity = 1; p.arc.style.opacity = 1; await tween(c, 1100, (t) => p.set(t)); await pop(c, p.lab); await pop(c, p.nm); };
  return [
    { cap: `A bearing starts by facing <b>north</b> or <b>south</b> (the first letter), then turns toward <b>east</b> or <b>west</b> (the last letter).`, run: (c) => anim(c, NS, [{ strokeWidth: 2.5 }, { strokeWidth: 7 }, { strokeWidth: 2.5 }], 700) },
    ...parts.map((p, i) => ({ cap: `<b>${p.b.name}</b>: ${p.b.words}.`, run: async (c) => { await go(c, p); await show(c, L[i]); } })),
    { cap: `The turn is always measured from the <b>north–south</b> line, never from east–west. In a triangle you often need ${T('90^\\circ')} minus the bearing angle.`, run: (c) => show(c, L[3]) }
  ];
}

/* ====================================================================================================
 * 6. river: Example 8
 * ==================================================================================================== */
const river = {
  title: 'Across the river: the sine law, then a right triangle',
  height: 410, minW: 940, capH: 86,
  ask: `Example 8: ${T('PQ=250')} m, ${T('\\angle TPQ=57^\\circ')}, ${T('\\angle TQP=68^\\circ')}. Find ${T('PT')}, the width and the area.`,
  make(stage, v, ex) {
    const M = riverFig(stage, { x: 0, y: 0, w: 540, h: 410, font: 20 });
    const F = M.F;
    [M.sP, M.sQ].forEach(hideS); [M.aP.g, M.aP.lab, M.aQ.g, M.aQ.lab].forEach(hide);
    const aT = F.ang('T', { r: 28, color: KP, wedge: KP, op: 0.4, lab: T(cK('55^\\circ')) }); [aT.g, aT.lab, aT.wedge].forEach(hide);
    const gPQ = hideS(F.glow('T', KP, 15)), gPT = hideS(F.glow('Q', UN, 13));
    const lPT = hide(F.sideLab('Q', T(cU('PT\\approx283.0')), { cls: 'u3l5-big' }));
    const alt = hideS(F.path(['T', 'W'], { color: HC, width: 3.5, dash: '9 7' })), rm = hideS(F.right('W', 'Q', 'T', { color: HC }));
    const lw = hide(F.lab(T(cH('w')), ...F.P([RV.T[0], RV.w / 2]), 'e', 'u3l5-slab u3l5-big', 7));
    const rt = hideS(F.fill(['P', 'W', 'T'], HC, 0.16)), all = hideS(F.fill(['P', 'Q', 'T'], KP, 0.2));
    const pnl = panel(stage, 556, 0, ex.W - 556, 410, '');
    const L = [lineIn(pnl, `${T('\\angle T=180^\\circ-57^\\circ-68^\\circ=55^\\circ')}<br><span class="u3l5-kpill">known pair</span> ${T('\\angle T')}, ${T('PQ=250')}`),
      lineIn(pnl, `${T(`PT=\\dfrac{250\\sin68^\\circ}{\\sin55^\\circ}\\approx${fx(RV.PT, 1)}`)} m`, 'u3l5-line-ans'),
      lineIn(pnl, `${T(`w=PT\\sin57^\\circ\\approx${fx(RV.PT, 2)}\\sin57^\\circ\\approx${fx(RV.w, 1)}`)} m`, 'u3l5-line-ans'),
      lineIn(pnl, `${T(`\\text{Area}=\\tfrac12(250)(${fx(RV.w, 2)}\\dots)\\approx${thin(fx(RV.area, 0))}`)} m${T('^2')}`, 'u3l5-line-ans')];
    return [
      { cap: `${T('P')} and ${T('Q')} are 250 m apart along one bank. The tree ${T('T')} is on the far bank: nobody can measure across the water.`, run: async (c) => { await pulse(c, M.lPQ, 1.25); } },
      { cap: `She measures the angles from both ends: ${T('\\angle TPQ=57^\\circ')} and ${T('\\angle TQP=68^\\circ')}.`, run: async (c) => { [M.sP, M.sQ].forEach(svgOn); await Promise.all([drawIn(M.sP, 500, c), drawIn(M.sQ, 500, c)]); svgOn(M.aP.g); svgOn(M.aQ.g); await pop(c, M.aP.lab); await pop(c, M.aQ.lab); } },
      { cap: `${T('\\angle T=180^\\circ-57^\\circ-68^\\circ=55^\\circ')}, opposite ${T('PQ=250')} m: a <b>known pair</b>.`, run: async (c) => { [aT.g, aT.wedge].forEach(svgOn); await appearIn(c, aT.wedge); await pop(c, aT.lab); svgOn(gPQ); await drawIn(gPQ, 450, c); await show(c, L[0]); } },
      { cap: `${T('PT')} is opposite ${T('\\angle Q=68^\\circ')}: ${T(`PT=\\dfrac{250\\sin68^\\circ}{\\sin55^\\circ}\\approx${fx(RV.PT, 1)}`)} m.`, run: async (c) => { svgOn(gPT); await drawIn(gPT, 450, c); await pop(c, lPT); await show(c, L[1]); } },
      { cap: `The <b>width</b> ${T(cH('w'))} is the altitude from ${T('T')}: straight across, perpendicular to the banks.`, run: async (c) => { svgOn(alt); await drawIn(alt, 600, c); svgOn(rm); await appearIn(c, rm); await pop(c, lw); } },
      { cap: `In the right triangle with hypotenuse ${T('PT')}, ${T(cH('w'))} is opposite ${T('57^\\circ')}: ${T(`w=PT\\sin57^\\circ\\approx${fx(RV.w, 1)}`)} m.`, run: async (c) => { svgOn(rt); await appearIn(c, rt, 400); await show(c, L[2]); } },
      { cap: `Area ${T('=\\tfrac12(\\text{base})(\\text{height})')} ${T(`=\\tfrac12(250)(${fx(RV.w, 2)}\\dots)\\approx${thin(fx(RV.area, 0))}`)} m${T('^2')}.`, run: async (c) => { rt.style.opacity = 0; svgOn(all); await appearIn(c, all, 400); await show(c, L[3]); } }
    ];
  }
};

/* =============================== Stand Up Break =============================== */
const SETS = [['A', 'B', 'C'], ['P', 'Q', 'R'], ['D', 'E', 'F'], ['X', 'Y', 'Z'], ['G', 'H', 'J']];
/** a small SVG sketch for the standup card: names [left, right, top], angles at left/right, labels {L, R, T (angles), l, r, t (sides opposite)} */
function sketch(n, aL, aR, lab) {
  const W = 320, H = 190, V = mk(n, aL, aR, 10), pts = n.map((k) => V[k]);
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]), s = Math.min(240 / (Math.max(...xs) - Math.min(...xs)), 120 / (Math.max(...ys) - Math.min(...ys)));
  const ox = 40 + (240 - (Math.max(...xs) - Math.min(...xs)) * s) / 2 - Math.min(...xs) * s, oy = 150;
  const P = pts.map((p) => [ox + p[0] * s, oy - p[1] * s]), cen = [(P[0][0] + P[1][0] + P[2][0]) / 3, (P[0][1] + P[1][1] + P[2][1]) / 3];
  let out = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="font: italic 19px 'Times New Roman',serif"><polygon points="${P.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="#1c2230" stroke-width="3" stroke-linejoin="round"/>`;
  P.forEach((p, i) => { const [dx, dy] = norm(p[0] - cen[0], p[1] - cen[1]); out += `<text x="${(p[0] + dx * 16).toFixed(1)}" y="${(p[1] + dy * 16 + 6).toFixed(1)}" text-anchor="middle" font-weight="bold">${n[i]}</text>`; });
  ['L', 'R', 'T'].forEach((k, i) => { if (!lab[k]) return; const p = P[i], [dx, dy] = norm(cen[0] - p[0], cen[1] - p[1]); out += `<text x="${(p[0] + dx * 38).toFixed(1)}" y="${(p[1] + dy * 38 + 6).toFixed(1)}" text-anchor="middle" font-style="normal" font-size="16" fill="#7a1f3d">${lab[k]}</text>`; });
  ['l', 'r', 't'].forEach((k, i) => {
    if (!lab[k]) return; const [p, q] = [0, 1, 2].filter((j) => j !== i).map((j) => P[j]), m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    let [nx, ny] = norm(-(q[1] - p[1]), q[0] - p[0]); if ((m[0] - cen[0]) * nx + (m[1] - cen[1]) * ny < 0) { nx = -nx; ny = -ny; }
    out += `<text x="${(m[0] + nx * 18).toFixed(1)}" y="${(m[1] + ny * 18 + 6).toFixed(1)}" text-anchor="middle" font-style="normal" font-size="16">${lab[k]}</text>`;
  });
  return out + '</svg>';
}
standup('u3l5', {
  intro: 'At your whiteboard: sketch the triangle, find the known pair, then use the sine law.',
  levels: {
    BEG: (r) => { // AAS with the pair given: find one side
      const n = r.pick(SETS), aL = r.int(36, 72), aR = r.int(40, 80), s = r.int(80, 250) / 10, k = s / sinD(aL), want = k * sinD(aR);
      const [L, R] = n, l = L.toLowerCase(), rr = R.toLowerCase();
      return { text: `In ${T(`\\triangle ${n.join('')}`)}, ${T(`\\angle ${L}=${dg(aL)}`)}, ${T(`\\angle ${R}=${dg(aR)}`)} and ${T(`${l}=${fx(s, 1)}`)} cm. Find ${T(rr)} to the nearest tenth.`, q: '',
        fig: sketch(n, aL, aR, { L: `${aL}°`, R: `${aR}°`, l: `${fx(s, 1)} cm`, r: rr }),
        a: [`\\text{known pair: }\\angle ${L},\\ ${l}`, `\\dfrac{${rr}}{\\sin${dg(aR)}}=\\dfrac{${fx(s, 1)}}{\\sin${dg(aL)}}`, `${rr}=\\dfrac{${fx(s, 1)}\\sin${dg(aR)}}{\\sin${dg(aL)}}\\approx${fx(want, 1)}\\text{ cm}`] };
    },
    PRG: (r) => { // ASA: the side between the two angles; find the third angle first
      const n = r.pick(SETS), aL = r.int(35, 75), aR = r.int(35, 80), aT = 180 - aL - aR, s = r.int(100, 300) / 10, k = s / sinD(aT), want = k * sinD(aL);
      const [L, , Tn] = n, l = L.toLowerCase(), t = Tn.toLowerCase();
      return { text: `In ${T(`\\triangle ${n.join('')}`)}, ${T(`\\angle ${n[0]}=${dg(aL)}`)}, ${T(`\\angle ${n[1]}=${dg(aR)}`)} and ${T(`${n[0]}${n[1]}=${fx(s, 1)}`)} m. Find ${T(l)} to the nearest tenth.`, q: '',
        fig: sketch(n, aL, aR, { L: `${aL}°`, R: `${aR}°`, t: `${fx(s, 1)} m`, l }),
        a: [`\\angle ${Tn}=180^\\circ-${dg(aL)}-${dg(aR)}=${dg(aT)}\\ (\\text{opposite }${t}=${n[0]}${n[1]})`, `${l}=\\dfrac{${fx(s, 1)}\\sin${dg(aL)}}{\\sin${dg(aT)}}\\approx${fx(want, 1)}\\text{ m}`] };
    },
    MAS: (r) => { // two angles (one obtuse) and a side not opposite either: find both other sides, check the longest
      const n = r.pick(SETS), aR = r.int(100, 125), aL = r.int(18, 180 - aR - 18), aT = 180 - aL - aR, s = r.int(80, 220) / 10, k = s / sinD(aT);
      const [L, R, Tn] = n, l = L.toLowerCase(), rr = R.toLowerCase(), t = Tn.toLowerCase();
      return { text: `In ${T(`\\triangle ${n.join('')}`)}, ${T(`\\angle ${L}=${dg(aL)}`)}, ${T(`\\angle ${R}=${dg(aR)}`)} and ${T(`${L}${R}=${fx(s, 1)}`)} cm. Find ${T(l)} and ${T(rr)}. Which side is the longest? Why?`, q: '',
        fig: sketch(n, aL, aR, { L: `${aL}°`, R: `${aR}°`, t: `${fx(s, 1)} cm` }),
        a: [`\\angle ${Tn}=180^\\circ-${dg(aL)}-${dg(aR)}=${dg(aT)}`, `${l}=\\dfrac{${fx(s, 1)}\\sin${dg(aL)}}{\\sin${dg(aT)}}\\approx${fx(k * sinD(aL), 1)}\\text{ cm}`, `${rr}=\\dfrac{${fx(s, 1)}\\sin${dg(aR)}}{\\sin${dg(aT)}}\\approx${fx(k * sinD(aR), 1)}\\text{ cm}`, `${rr}\\text{ is longest: opposite the obtuse }\\angle ${R}`] };
    }
  }
});

/* =============================== mount =============================== */
mountSail();
mountFigs();
export const explainers = mountExplainers({ label, soh, split, proof, supp, pairHunt, findSide, findAngle, bearing, river });
export const _test = { fx, fz, mk, LB, SH, SPL, PF, FS, FA, TW, RV, liveCtx };
