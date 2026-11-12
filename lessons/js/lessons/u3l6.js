/* Math 20-1 · Unit 3 · Lesson 6 — The Cosine Law.
 * The warm-up (Clyde's Big Bite) is plain markup with an SVG picture (tools/newformat/specs/u3l6.py). Explainers:
 *   cases (Example 1: mark the three known parts, then look for a known pair ∠A & a, ∠B & b, ∠C & c; SAS and SSS have none),
 *   pythag (STAR: "Pythagoras with a correction": sides a and b fixed with a hinge at C; as C opens from 60° through 90° to
 *     130°, side c stretches, squares on the three sides show c² against a² + b², and the −2ab cos C bar changes sign at
 *     90°; a slider for any angle; Example 4(c) check: 3, 5, 120° gives 49),
 *   side (SAS, Example 4(a), (b), (c) checks, and "The order trap": multiply first gives 8.7, subtract first gives an
 *     impossible 3.4),
 *   angle (solving the law for cos A; Example 5(a) and 5(b) checks: the subtracted side, the sign of the cosine),
 *   solve (Example 6: cosine law, then the sine law for the smaller angle, then the angle sum, checked; and why the
 *     smaller angle: the sine law gives 58° for an angle that is really 122°),
 *   boats (Example 7: bearings N25°E and S60°E, the angle between them, the cosine law; a demo N50°W / S20°W).
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
mountStatics();
export const explainers = mountExplainers({ cases, pythag, side, angle, solve, boats });
export const _test = { fx, fz, law, angSSS, sssC, TriFig, Hinge, SS, BT, PA };
