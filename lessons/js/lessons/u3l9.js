/* Math 20-1 · Unit 3 · Lesson 9 — Unit 3 Review.
 * The warm-up (Two Truths and a Lie) is plain markup with an SVG picture (tools/newformat/specs/u3l9.py). Explainers:
 *   castRecap (terminal arm sweeping round, reference angle wedge, CAST letters and sign stickers; Example 1(a), 1(b),
 *     1(c) and 4(a) checks),
 *   ambiguous (side a swings from C and hits the base ray 0, 1 or 2 times, compared with h = b sin A, with the table
 *     lighting up; Example 7 checks and a review question),
 *   solveTrig (unit circle: a height, a sideways distance or a slope meets the circle twice; θ_R from the inverse key or
 *     a special triangle, quadrants from CAST; Examples 4(c) and 5 checks),
 *   toolSorter (star: triangle cards with their given parts highlighted are dealt and dropped into four bins: primary
 *     ratios, sine law, cosine law, ambiguous with the triangle count).
 * Colours: θ and the terminal arm in the course burgundy, θ_R amber, sine law blue, cosine law green, primary ratios
 * purple, the ambiguous case orange; a known side–angle pair blue, the pair being found teal (#a33357). */
import {
  h, tex, add, box, Box, Flowchart, stamp, stampIn, mountExplainers, pop, fadeIn, sleep, tween, anim,
  svgEl, liveCtx, pulse, drawIn, arrowHead, angleArc, rightMark, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const CT = '#7a1f3d', CR = COLORS.amber, CS = COLORS.blue, CC = COLORS.green, CP = COLORS.purple, CA = '#d0700a';
const PK = COLORS.teal, RED = COLORS.red, INK = COLORS.ink, GRAY = COLORS.gray;
const K = (c, s) => `\\textcolor{${c}}{${s}}`;
const cT = (s) => K(CT, s), cR = (s) => K(CR, s), cS = (s) => K(CS, s), cC = (s) => K(CC, s), cK = (s) => K(PK, s);
const rad = (d) => (d * Math.PI) / 180, deg = (r) => (r * 180) / Math.PI;
const sinD = (d) => Math.sin(rad(d)), cosD = (d) => Math.cos(rad(d)), tanD = (d) => Math.tan(rad(d));
const asinD = (v) => deg(Math.asin(v)), acosD = (v) => deg(Math.acos(v)), atanD = (v) => deg(Math.atan(v));
const r1 = (v) => Math.round(v * 10) / 10;
/** a number as TeX, dp places (trailing zeros kept, booklet style) */
const fx = (v, dp = 1) => (Math.abs(v) < 0.5 * 10 ** -dp ? 0 : v).toFixed(dp);
const dg = (v, dp = 1) => `${fx(v, dp)}^\\circ`;
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const panel = (stage, x, y, w, hh, title, cls = '') => add(stage, box(h('div', 'u3l9-panel ' + cls, title ? `<div class="u3l9-ph">${title}</div>` : ''), w, hh), x, y);
const line = (p, html, cls = '') => { const d = h('div', 'u3l9-line ' + cls, html); p.appendChild(d); return d; };
const lab = (B, x, y, html, cls = '', pos = 'c') => B.hlabel(x, y, html, { cls: 'u3l9-lab ' + cls, pos, gap: 0 });
const QN = ['', 'QI', 'QII', 'QIII', 'QIV'];
const quadOf = (t) => { t = ((t % 360) + 360) % 360; if (t % 90 === 0) return 0; return Math.floor(t / 90) + 1; };
const refOf = (t) => { const q = quadOf(t); return [0, t, 180 - t, t - 180, 360 - t][q]; };
const SIGN = { sin: [0, 1, 1, -1, -1], cos: [0, 1, -1, -1, 1], tan: [0, 1, -1, 1, -1] };
const LET = ['', 'A', 'S', 'T', 'C'];

/** a circular arc (math angles in degrees, counterclockwise from a1 to a2, screen y down) */
function arcD(cx, cy, r, a1, a2) {
  const p = (a) => [cx + r * Math.cos(rad(a)), cy - r * Math.sin(rad(a))];
  const [x1, y1] = p(a1), [x2, y2] = p(a2), large = Math.abs(a2 - a1) > 180 ? 1 : 0, sweep = a2 > a1 ? 0 : 1;
  return `M${x1.toFixed(2)} ${y1.toFixed(2)}A${r} ${r} 0 ${large} ${sweep} ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}
const wedgeD = (cx, cy, r, a1, a2) => `M${cx} ${cy}L` + arcD(cx, cy, r, a1, a2).slice(1) + 'Z';

/* =============================== a coordinate plane for standard position =============================== */
class Plane extends Box {
  /** o: { x, y, size, unit (px per unit), R (arm length px), grid, numStep, letters, degs } */
  constructor(host, o = {}) {
    o = Object.assign({ size: 440, unit: 170, R: 200, grid: false, numStep: 0, letters: true, degs: true }, o);
    super(host, o, 'u3l9-plane', o.size, o.size);
    const S = o.size, O = S / 2, OX = o.origin ? o.origin[0] : O, OY = o.origin ? o.origin[1] : O; this.O = [OX, OY]; this.u = o.unit; this.S = S;
    svgEl('rect', { x: 0, y: 0, width: S, height: S, rx: 14, fill: '#fcfbf8' }, this.svg);
    this.gQ = this.layer('q');
    this.qBg = {};
    [[1, OX, 0, S - OX, OY], [2, 0, 0, OX, OY], [3, 0, OY, OX, S - OY], [4, OX, OY, S - OX, S - OY]].forEach(([q, x, y, w, hh]) => { const r = svgEl('rect', { x, y, width: w, height: hh, fill: '#fff1c9', opacity: 0 }, this.gQ); this.qBg[q] = r; });
    if (o.grid) {
      const g = this.layer('grid'), nx0 = Math.ceil((4 - OX) / o.unit), nx1 = Math.floor((S - 4 - OX) / o.unit), ny0 = Math.ceil((OY - S + 4) / o.unit), ny1 = Math.floor((OY - 4) / o.unit);
      for (let k = nx0; k <= nx1; k++) { if (!k) continue; const p = OX + k * o.unit; svgEl('line', { x1: p, y1: 4, x2: p, y2: S - 4, stroke: '#e6e1d6', 'stroke-width': 1 }, g); if (o.numStep && k % o.numStep === 0 && p < S - 22 && p > 22) lab(this, p, OY + 13, String(k).replace('-', '−'), 'u3l9-num'); }
      for (let k = ny0; k <= ny1; k++) { if (!k) continue; const p = OY - k * o.unit; svgEl('line', { x1: 4, y1: p, x2: S - 4, y2: p, stroke: '#e6e1d6', 'stroke-width': 1 }, g); if (o.numStep && k % o.numStep === 0 && p > 22 && p < S - 22) lab(this, OX - 8, p, String(k).replace('-', '−'), 'u3l9-num', 'w'); }
    }
    const ax = this.layer('axes');
    svgEl('line', { x1: 10, y1: OY, x2: S - 12, y2: OY, stroke: INK, 'stroke-width': 2 }, ax); arrowHead(ax, S - 10, OY, 1, 0, { color: INK, width: 2 });
    svgEl('line', { x1: OX, y1: S - 10, x2: OX, y2: 12, stroke: INK, 'stroke-width': 2 }, ax); arrowHead(ax, OX, 10, 0, -1, { color: INK, width: 2 });
    lab(this, S - 14, OY - 16, T('x'), 'u3l9-axl'); lab(this, OX + 16, 16, T('y'), 'u3l9-axl');
    if (o.degs) { lab(this, S - 30, O + 15, '0°', 'u3l9-axd'); lab(this, O + 24, 30, '90°', 'u3l9-axd'); lab(this, 30, O - 15, '180°', 'u3l9-axd'); lab(this, O + 28, S - 26, '270°', 'u3l9-axd'); }
    this.qL = {};
    if (o.letters) [[1, 1, -1], [2, -1, -1], [3, -1, 1], [4, 1, 1]].forEach(([q, sx, sy]) => { this.qL[q] = lab(this, O + sx * S * 0.36, O + sy * S * 0.36, LET[q], 'u3l9-qlet'); });
    this.gRot = this.layer('rot'); this.gWedge = this.layer('wedge'); this.gArm = this.layer('arm'); this.gTop = this.layer('top');
  }
  px(x, y) { return [this.O[0] + x * this.u, this.O[1] - y * this.u]; }
  pa(a, r) { return [this.O[0] + r * Math.cos(rad(a)), this.O[1] - r * Math.sin(rad(a))]; }
  lightQ(q, on = true) { if (this.qL[q]) this.qL[q].classList.toggle('on', on); if (this.qBg[q]) this.qBg[q].setAttribute('opacity', on ? 0.75 : 0); }
  clearQ() { [1, 2, 3, 4].forEach((q) => this.lightQ(q, false)); }
  dot(x, y, html, o = {}) {
    const [px, py] = this.px(x, y), g = svgEl('g', { class: 'u3l9-dot' }, this.gTop);
    svgEl('circle', { cx: px, cy: py, r: o.r || 7, fill: o.color || CT, stroke: '#fff', 'stroke-width': 2 }, g);
    if (html) g.label = lab(this, px + (o.dx ?? (x < 0 ? -12 : 12)), py + (o.dy ?? (y < 0 ? 16 : -16)), html, 'u3l9-ptl ' + (o.cls || ''), o.pos || (x < 0 ? 'w' : 'e'));
    return g;
  }
  /** the terminal arm with its rotation arc and reference-angle wedge. o: { len, rotR, refR, thLab(θ), refLab(θ), color, rot, ref } */
  arm(o = {}) {
    const O = this.O, st = Object.assign({ len: this.o.R, rotR: 30, refR: 66, rot: true, ref: true, color: CT }, o);
    const wedge = svgEl('path', { fill: CR, 'fill-opacity': 0.26, stroke: CR, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, this.gWedge);
    const rot = svgEl('path', { fill: 'none', stroke: st.color, 'stroke-width': 2.5 }, this.gRot), head = svgEl('g', {}, this.gRot);
    const ln = svgEl('line', { x1: O[0], y1: O[1], stroke: st.color, 'stroke-width': 4.5, 'stroke-linecap': 'round' }, this.gArm);
    const tl = lab(this, 0, 0, '', 'u3l9-thlab'), rl = lab(this, 0, 0, '', 'u3l9-rlab');
    const api = {
      th: 0, st,
      set(th) {
        api.th = th; const [ex, ey] = this.pa(th, st.len);
        ln.setAttribute('x2', ex); ln.setAttribute('y2', ey);
        head.innerHTML = '';
        if (st.rot && th > 2) {
          rot.setAttribute('d', arcD(O[0], O[1], st.rotR, 0, th)); rot.style.display = '';
          const [hx, hy] = this.pa(th, st.rotR); arrowHead(head, hx, hy, -Math.sin(rad(th)), -Math.cos(rad(th)), { color: st.color, width: 2.5, L: 10, hw: 5 });
          const la = st.thAt === 'end' ? th - Math.min(16, th / 2) : th / 2, [lx, ly] = st.thAt === 'tip' ? this.pa(th, st.len + 34) : this.pa(la, st.rotR + (th < 40 ? 30 : 22));
          tl.innerHTML = st.thLab ? st.thLab(th) : ''; tl.style.display = tl.innerHTML ? '' : 'none'; lab0(tl, lx, ly);
        } else { rot.style.display = 'none'; tl.style.display = 'none'; }
        const q = quadOf(th);
        if (st.ref && q && Math.abs(th - Math.round(th / 90) * 90) > 0.6) {
          const [a1, a2] = [[0, 0], [0, th], [th, 180], [180, th], [th, 360]][q];
          wedge.setAttribute('d', wedgeD(O[0], O[1], st.refR, a1, a2)); wedge.style.display = '';
          const mid = (a1 + a2) / 2, [lx, ly] = this.pa(mid, st.refR + 26);
          rl.innerHTML = st.refLab ? st.refLab(th) : ''; rl.style.display = rl.innerHTML ? '' : 'none'; lab0(rl, lx, ly);
        } else { wedge.style.display = 'none'; rl.style.display = 'none'; }
      },
      async to(c, th, ms = 900) { const a = api.th; await tween(c, ms, (t) => api.set(a + (th - a) * t)); },
      quiet() { st.rot = false; rot.style.display = 'none'; head.innerHTML = ''; tl.style.display = 'none'; ln.setAttribute('stroke-width', 3.5); ln.setAttribute('stroke-opacity', 0.55); },
      els: [wedge, rot, head, ln, tl, rl]
    };
    api.set = api.set.bind(this);
    api.set(0); return api;
  }
}
/** move a centred label */
function lab0(el, x, y) { el.style.left = x + 'px'; el.style.top = y + 'px'; }

/* =============================== a triangle drawn to scale =============================== */
class TriFig extends Box {
  /** o: { x, y, width, height, pts: { A: [x, y], B: …, C: … } (units, y up), extra: [[x, y]…] (also fit), pad, fill } */
  constructor(host, o = {}) {
    o = Object.assign({ width: 320, height: 220, pad: 36, fill: '#f6eef1' }, o);
    super(host, o, 'u3l9-tri', o.width, o.height);
    const names = Object.keys(o.pts).slice(0, 3); this.names = names;
    const all = names.map((n) => o.pts[n]).concat(o.extra || []);
    const xs = all.map((p) => p[0]), ys = all.map((p) => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const padL = o.padL ?? o.pad, padR = o.padR ?? o.pad, padT = o.padT ?? o.pad, padB = o.padB ?? o.pad;
    const s = Math.min((o.width - padL - padR) / (x1 - x0 || 1), (o.height - padT - padB) / (y1 - y0 || 1));
    const ox = padL + ((o.width - padL - padR) - s * (x1 - x0)) / 2 - s * x0, oy = padT + ((o.height - padT - padB) + s * (y1 - y0)) / 2 + s * y0;
    this.s = s; this.P = (x, y) => [ox + s * x, oy - s * y];
    this.V = {}; names.forEach((n) => { this.V[n] = this.P(...o.pts[n]); });
    const [A, B, C] = names.map((n) => this.V[n]); this.cen = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];
    this.gFill = this.layer('fill'); this.gExtra = this.layer('extra'); this.gSide = this.layer('side'); this.gArc = this.layer('arc'); this.gTop = this.layer('top');
    this.fillEl = svgEl('polygon', { points: [A, B, C].map((p) => p.join(',')).join(' '), fill: o.fill, stroke: 'none' }, this.gFill);
    this.sideEls = {}; this.sideLabs = {}; this.arcs = {}; this.vLabs = {};
    names.forEach((v) => {
      const [p, q] = names.filter((n) => n !== v).map((n) => this.V[n]);
      const g = svgEl('g', { class: 'bk-curve u3l9-side' }, this.gSide); g.style.color = INK;
      svgEl('path', { class: 'bk-stroke', d: `M${p[0]} ${p[1]}L${q[0]} ${q[1]}`, stroke: 'currentColor', 'stroke-width': o.sw || 3.5, 'stroke-linecap': 'round', fill: 'none' }, g);
      const m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]; let nx = q[1] - p[1], ny = p[0] - q[0]; const L = Math.hypot(nx, ny) || 1; nx /= L; ny /= L;
      if ((m[0] - this.cen[0]) * nx + (m[1] - this.cen[1]) * ny < 0) { nx = -nx; ny = -ny; }
      g.mid = m; g.out = [nx, ny]; this.sideEls[v.toLowerCase()] = g;
    });
    if (o.vlabels !== false) names.forEach((v) => { const P = this.V[v]; let dx = P[0] - this.cen[0], dy = P[1] - this.cen[1]; const L = Math.hypot(dx, dy) || 1; this.vLabs[v] = lab(this, P[0] + (dx / L) * 18, P[1] + (dy / L) * 18, T(o.vtex ? o.vtex[v] || v : v), 'u3l9-vl'); });
  }
  side(k) { return this.sideEls[k.toLowerCase()]; }
  /** a label beside side k (k = lowercase name of the opposite vertex) */
  sideLab(k, html, o = {}) {
    const g = this.side(k), off = o.off ?? 20;
    const el = lab(this, g.mid[0] + g.out[0] * off, g.mid[1] + g.out[1] * off, html, 'u3l9-sl ' + (o.cls || ''));
    if (o.color) el.style.color = o.color; this.sideLabs[k.toLowerCase()] = el; return el;
  }
  /** an arc at vertex v with a label inside the angle */
  ang(v, html, o = {}) {
    const P = this.V[v], [Q1, Q2] = this.names.filter((n) => n !== v).map((n) => this.V[n]);
    const d1 = Math.hypot(Q1[0] - P[0], Q1[1] - P[1]), d2 = Math.hypot(Q2[0] - P[0], Q2[1] - P[1]);
    const r = o.r || Math.max(16, Math.min(30, 0.3 * Math.min(d1, d2)));
    const g = svgEl('g', { class: 'bk-curve u3l9-arc' }, this.gArc); g.style.color = o.color || CR;
    if (o.right) rightMark(g, P, Q1, Q2, 14, { color: 'currentColor', width: 2.2 }); else angleArc(g, P, Q1, Q2, r, { color: 'currentColor', width: 2.6 });
    if (html != null) {
      const u1 = [(Q1[0] - P[0]) / d1, (Q1[1] - P[1]) / d1], u2 = [(Q2[0] - P[0]) / d2, (Q2[1] - P[1]) / d2];
      let bx = u1[0] + u2[0], by = u1[1] + u2[1]; const bl = Math.hypot(bx, by) || 1; bx /= bl; by /= bl;
      const sinHalf = Math.sqrt(Math.max(0.0001, (1 - (u1[0] * u2[0] + u1[1] * u2[1])) / 2)), dist = Math.max(r + 16, Math.min(r + 46, 22 / sinHalf));
      g.label = lab(this, P[0] + bx * (o.dist || dist), P[1] + by * (o.dist || dist), html, 'u3l9-al ' + (o.cls || ''));
      if (o.color) g.label.style.color = o.color;
    }
    this.arcs[v] = g; return g;
  }
  paint(k, color) { const g = this.side(k); if (g) g.style.color = color; const l = this.sideLabs[k.toLowerCase()]; if (l) l.style.color = color; }
  paintAng(v, color) { const g = this.arcs[v]; if (!g) return; g.style.color = color; if (g.label) g.label.style.color = color; }
}
/** vertices of a triangle from its three sides opposite the named vertices: first vertex at the origin, the side
 * opposite the third vertex along the x-axis (names = [N0, N1, N2], sides = { n0, n1, n2 }, flip mirrors left-right) */
function triPts(names, sides, flip = false) {
  const [P, Q, R] = names, p = sides[P.toLowerCase()], q = sides[Q.toLowerCase()], r = sides[R.toLowerCase()];
  const angP = acosD((q * q + r * r - p * p) / (2 * q * r));
  let pts = { [P]: [0, 0], [Q]: [r, 0], [R]: [q * cosD(angP), q * sinD(angP)] };
  if (flip) pts = { [P]: [r, 0], [Q]: [0, 0], [R]: [r - q * cosD(angP), q * sinD(angP)] };
  return pts;
}
/** law of sines/cosines helpers: the third side from SAS, an angle from SSS */
const sas = (b, c, A) => Math.sqrt(b * b + c * c - 2 * b * c * cosD(A));
const sssAng = (a, b, c) => acosD((b * b + c * c - a * a) / (2 * b * c));

/* =============================== explainer: reference angles and CAST =============================== */
const CR_CH = {
  cast: { label: 'CAST' },
  ex1a: { label: 'Example 1(a) check', angles: [73, 164, 215, 342] },
  ex1b: { label: `1(b): ${T('\\theta_R=19^\\circ')}` },
  ex1c: { label: `1(c): ${T('P(3,\\,7)')}` },
  ex4a: { label: 'Example 4(a) check' }
};
const ruleTex = (th) => { const q = quadOf(th), r = refOf(th); const f = (v) => (Number.isInteger(v) ? String(v) : fx(v)); return ['', `\\theta_R=\\theta=${f(r)}^\\circ`, `\\theta_R=180^\\circ-${f(th)}^\\circ=${f(r)}^\\circ`, `\\theta_R=${f(th)}^\\circ-180^\\circ=${f(r)}^\\circ`, `\\theta_R=360^\\circ-${f(th)}^\\circ=${f(r)}^\\circ`][q]; };
function stickers(p, cls = '') {
  const row = h('div', 'u3l9-stk ' + cls); p.appendChild(row);
  const s = {}; ['sin', 'cos', 'tan'].forEach((f) => { s[f] = h('div', 'u3l9-sticker', ''); row.appendChild(s[f]); });
  return { row, set(q) { ['sin', 'cos', 'tan'].forEach((f) => { const pos = SIGN[f][q] > 0; s[f].className = 'u3l9-sticker ' + (q ? (pos ? 'pos' : 'neg') : ''); s[f].innerHTML = q ? `${f} ${pos ? '+' : '−'}` : f; }); }, s };
}
function rowsTable(p, heads, n, cls = '') {
  const t = h('table', 'u3l9-ptab ' + cls); p.appendChild(t);
  t.innerHTML = `<tr>${heads.map((x) => `<th>${x}</th>`).join('')}</tr>` + Array.from({ length: n }, () => `<tr>${heads.map(() => '<td><span class="u3l9-cv"></span></td>').join('')}</tr>`).join('');
  const rows = [...t.querySelectorAll('tr')].slice(1).map((tr) => [...tr.querySelectorAll('.u3l9-cv')]);
  rows.flat().forEach(hide);
  return { t, rows, async fill(c, i, vals) { rows[i].forEach((cv, j) => { cv.innerHTML = vals[j]; }); for (const cv of rows[i]) await show(c, cv); } };
}
const castRecap = {
  title: 'Reference angles and CAST',
  height: 444,
  minW: 940,
  choices: Object.keys(CR_CH).map((k) => ({ v: k, label: CR_CH[k].label })),
  intro: 'The terminal arm turns counterclockwise from the positive x-axis. Press <b>Next</b>.',
  make(stage, k, ex) {
    const W = ex.W, grid = k === 'ex1c';
    const Pl = new Plane(stage, { x: 0, y: 2, size: 440, unit: grid ? 21 : 170, R: grid ? 205 : 196, grid, numStep: grid ? 2 : 0, degs: !grid, letters: !grid });
    const PX = 456, PW = W - PX - 2, Pn = panel(stage, PX, 2, PW, 440, '', 'u3l9-crp');
    const thLab = (th) => T(cT(dg(th, Number.isInteger(r1(th)) ? 0 : 1).replace('.0^', '^')));
    const refLab = (th) => T(cR(dg(refOf(th), Number.isInteger(r1(refOf(th))) ? 0 : 1).replace('.0^', '^')));
    const steps = [];
    if (k === 'cast') {
      const st = stickers(Pn); st.set(0);
      const tb = rowsTable(Pn, ['Quadrant', 'Positive', T('\\theta_R')], 4, 'u3l9-ptab4');
      const arm = Pl.arm({ thLab, refLab });
      const A = [40, 140, 220, 320];
      const caps = [
        `<b>QI</b> (${T('0^\\circ')} to ${T('90^\\circ')}): ${T('x>0')} and ${T('y>0')}, so ${T('\\sin\\theta=\\frac{y}{r}')}, ${T('\\cos\\theta=\\frac{x}{r}')}, ${T('\\tan\\theta=\\frac{y}{x}')} are <b>all</b> positive: <b>A</b>.`,
        `<b>QII</b>: ${T('x<0')}, ${T('y>0')}. Only <b>sin</b> ${T('\\left(\\frac{y}{r}\\right)')} is positive: <b>S</b>. The reference angle is ${T(cR('180^\\circ-\\theta'))}.`,
        `<b>QIII</b>: ${T('x<0')}, ${T('y<0')}. ${T('\\tan\\theta=\\frac{y}{x}')} is negative ÷ negative: only <b>tan</b> is positive: <b>T</b>. ${T(cR('\\theta_R=\\theta-180^\\circ'))}.`,
        `<b>QIV</b>: ${T('x>0')}, ${T('y<0')}. Only <b>cos</b> ${T('\\left(\\frac{x}{r}\\right)')} is positive: <b>C</b>. ${T(cR('\\theta_R=360^\\circ-\\theta'))}.`
      ];
      const rows = [['I', 'all', T('\\theta')], ['II', 'sin', T('180^\\circ-\\theta')], ['III', 'tan', T('\\theta-180^\\circ')], ['IV', 'cos', T('360^\\circ-\\theta')]];
      A.forEach((th, i) => steps.push({ cap: caps[i], run: async (c) => { Pl.clearQ(); await arm.to(c, th); Pl.lightQ(i + 1); st.set(i + 1); await tb.fill(c, i, rows[i]); } }));
      steps.push({ cap: `Counterclockwise from QI: <b>A</b>ll, <b>S</b>in, <b>T</b>an, <b>C</b>os. The ${T(cR('\\theta_R'))} is always the acute angle to the <b>${T('x')}-axis</b>.`, run: async (c) => { Pl.clearQ(); [1, 2, 3, 4].forEach((q) => Pl.qL[q].classList.add('on')); await pulse(c, tb.t, 1.03); } });
      return steps;
    }
    if (k === 'ex1a') {
      const tb = rowsTable(Pn, [T('\\theta'), 'Quadrant', T('\\theta_R')], 4, 'u3l9-ptab4');
      const arm = Pl.arm({ thLab, refLab });
      CR_CH.ex1a.angles.forEach((th, i) => {
        const q = quadOf(th);
        steps.push({ cap: `${T(cT('\\theta=' + th + '^\\circ'))}: the terminal arm is in <b>${QN[q]}</b>, so ${T(cR(ruleTex(th)))}.`,
          run: async (c) => { Pl.clearQ(); await arm.to(c, th); Pl.lightQ(q); await tb.fill(c, i, [T(th + '^\\circ'), ['', 'I', 'II', 'III', 'IV'][q], T(ruleTex(th).replace('\\theta_R=', '').replace(/^\\theta=/, ''))]); } });
      });
      steps.push({ cap: `Each ${T(cR('\\theta_R'))} is the acute angle between the arm and the <b>${T('x')}-axis</b>: ${T('73^\\circ,\\ 16^\\circ,\\ 35^\\circ,\\ 18^\\circ')}.`, run: (c) => pulse(c, tb.t, 1.03) });
      return steps;
    }
    if (k === 'ex1b') {
      const tb = rowsTable(Pn, ['Quadrant', T('\\theta')], 4, 'u3l9-ptab4');
      const th4 = [19, 161, 199, 341], how = ['19^\\circ', '180^\\circ-19^\\circ=161^\\circ', '180^\\circ+19^\\circ=199^\\circ', '360^\\circ-19^\\circ=341^\\circ'];
      const arms = th4.map(() => null); let prev = null;
      th4.forEach((th, i) => {
        steps.push({ cap: i === 0 ? `${T(cR('\\theta_R=19^\\circ'))} in <b>QI</b>: the angle is just ${T(cT('\\theta=19^\\circ'))}.` : `<b>${QN[i + 1]}</b>: ${T(cT('\\theta=' + how[i]))}. Same ${T(cR('19^\\circ'))} wedge to the ${T('x')}-axis.`,
          run: async (c) => { if (prev) prev.quiet(); const a = arms[i] = Pl.arm({ thLab, refLab }); prev = a; Pl.clearQ(); await a.to(c, th, 800); Pl.lightQ(i + 1); await tb.fill(c, i, [QN[i + 1], T(how[i])]); } });
      });
      steps.push({ cap: `Four terminal arms, all ${T(cR('19^\\circ'))} from the ${T('x')}-axis: ${T('\\theta=19^\\circ,\\ 161^\\circ,\\ 199^\\circ,\\ 341^\\circ')}.`, run: (c) => { if (prev) prev.quiet(); Pl.clearQ(); return pulse(c, tb.t, 1.03); } });
      return steps;
    }
    if (k === 'ex1c') {
      const th = atanD(7 / 3), t1 = r1(th);
      const tb = rowsTable(Pn, ['Point', 'Quadrant', T('\\theta')], 4, 'u3l9-ptab4');
      const lab1 = (t) => T(cT(dg(r1(t))));
      const arm = Pl.arm({ thLab: lab1, refLab: () => T(cR(dg(t1))), refR: 50, rotR: 26 });
      const pts = [[3, 7, 'P'], [-3, 7, 'Q'], [-3, -7, 'R'], [3, -7, 'S']], angs = [t1, 180 - t1, 180 + t1, 360 - t1];
      const how = [`\\tan^{-1}\\!\\left(\\frac{7}{3}\\right)\\approx${fx(t1)}^\\circ`, `180^\\circ-${fx(t1)}^\\circ=${fx(angs[1])}^\\circ`, `180^\\circ+${fx(t1)}^\\circ=${fx(angs[2])}^\\circ`, `360^\\circ-${fx(t1)}^\\circ=${fx(angs[3])}^\\circ`];
      const dots = pts.map(([x, y, n]) => hide(Pl.dot(x, y, T(`${n}(${x},\\,${y})`.replace(/-/g, '-')), { color: n === 'P' ? CT : CT })));
      dots.forEach((d) => hide(d.label));
      const drop = (x, y) => { const [a, b] = Pl.px(x, 0), [cc, d] = Pl.px(x, y); return hide(svgEl('path', { d: `M${a} ${b}L${cc} ${d}`, stroke: GRAY, 'stroke-width': 2.5, 'stroke-dasharray': '6 5', fill: 'none' }, Pl.gTop)); };
      const drops = pts.map(([x, y]) => drop(x, y));
      const legs = [lab(Pl, Pl.px(1.5, 0)[0], Pl.px(0, 0)[1] + 14, T('3'), 'u3l9-leg'), lab(Pl, Pl.px(3, 3.5)[0] + 14, Pl.px(0, 3.5)[1], T('7'), 'u3l9-leg')].map(hide);
      steps.push({ cap: `Plot ${T('P(3,\\,7)')} in <b>QI</b>. The terminal arm passes through ${T('P')}.`, run: async (c) => { await pop(c, dots[0]); await show(c, dots[0].label); await arm.to(c, th, 800); } });
      steps.push({ cap: `The reference triangle has legs 3 and 7: ${T('\\tan\\theta=\\frac{y}{x}=\\frac{7}{3}')}, so ${T(cT('\\theta=' + how[0]))}.`, run: async (c) => { await show(c, drops[0]); legs.forEach((l) => show(c, l)); await tb.fill(c, 0, [T('P(3,\\,7)'), 'I', T(fx(t1) + '^\\circ')]); } });
      const names = ['', 'the <b>y-axis</b>', 'the <b>origin</b>', 'the <b>x-axis</b>'];
      [1, 2, 3].forEach((i) => {
        const [x, y, n] = pts[i];
        steps.push({ cap: `Reflect in ${names[i]}: ${T(`${n}(${x},\\,${y})`)} is in <b>${QN[i + 1]}</b>: ${T(cT(how[i]))}.`,
          run: async (c) => { arm.quiet(); await pop(c, dots[i]); await show(c, dots[i].label); await show(c, drops[i]); const a = Pl.arm({ thLab: lab1, refLab: () => T(cR(dg(t1))), refR: 50, rotR: 26 }); await a.to(c, angs[i], 800); if (i < 3) a.quiet(); await tb.fill(c, i, [T(`${n}(${x},\\,${y})`), ['', 'I', 'II', 'III', 'IV'][i + 1], T(fx(angs[i]) + '^\\circ')]); } });
      });
      steps.push({ cap: `All four have ${T(cR('\\theta_R=' + fx(t1) + '^\\circ'))}: the <b>same reference triangle</b>, flipped into each quadrant.`, run: (c) => pulse(c, tb.t, 1.03) });
      return steps;
    }
    // ex4a: exact values with signs
    const st = stickers(Pn); st.set(0);
    const tb = rowsTable(Pn, ['Value', 'Where', 'Exact'], 4, 'u3l9-ptab4 u3l9-ptab4a');
    const arm = Pl.arm({ thLab, refLab });
    const E = [
      { f: 'sin', th: 135, ref: 45, val: '\\dfrac{\\sqrt2}{2}', w: 'QII, 45°', cap: `${T('\\sin135^\\circ')}: <b>QII</b>, ${T(cR('\\theta_R=45^\\circ'))}. In QII only sin is positive (<b>S</b>): ${T('\\sin135^\\circ=+\\sin45^\\circ=\\dfrac{\\sqrt2}{2}')}.` },
      { f: 'cos', th: 210, ref: 30, val: '-\\dfrac{\\sqrt3}{2}', w: 'QIII, 30°', cap: `${T('\\cos210^\\circ')}: <b>QIII</b>, ${T(cR('\\theta_R=30^\\circ'))}. Only tan is positive there, so cos is <b>negative</b>: ${T('-\\cos30^\\circ=-\\dfrac{\\sqrt3}{2}')}.` },
      { f: 'tan', th: 300, ref: 60, val: '-\\sqrt3', w: 'QIV, 60°', cap: `${T('\\tan300^\\circ')}: <b>QIV</b>, ${T(cR('\\theta_R=60^\\circ'))}. Only cos is positive (<b>C</b>), so tan is negative: ${T('-\\tan60^\\circ=-\\sqrt3')}.` },
      { f: 'cos', th: 270, ref: 0, val: '0', w: 'on an axis', cap: `${T('\\cos270^\\circ')}: <b>quadrantal</b>. The point ${T('(0,\\,-1)')} is on the arm with ${T('r=1')}: ${T('\\cos270^\\circ=\\frac{x}{r}=\\frac{0}{1}=0')}.` }
    ];
    const qd = hide(Pl.dot(0, -1, T('(0,\\,-1)'), { dx: 14, dy: 0, pos: 'e' })); hide(qd.label);
    E.forEach((e, i) => steps.push({ cap: e.cap, run: async (c) => { Pl.clearQ(); await arm.to(c, e.th, 900); const q = quadOf(e.th); if (q) Pl.lightQ(q); st.set(q || 0); if (q) await pulse(c, st.s[e.f], 1.15); else { await pop(c, qd); await show(c, qd.label); } await tb.fill(c, i, [T(`\\${e.f}${e.th}^\\circ`), e.w, T(e.val)]); } }));
    steps.push({ cap: `Three questions every time: <b>which quadrant</b>, which ${T(cR('\\theta_R'))} (a special angle), and <b>which sign</b> (CAST).`, run: (c) => pulse(c, tb.t, 1.03) });
    return steps;
  }
};

/* =============================== explainer: the ambiguous case =============================== */
const AM = {
  two: { label: `Example 7: ${T('a=9')}`, A: 38, a: 9, b: 12, solve: true },
  none: { label: `7(c)(i) ${T('a=7')}`, A: 38, a: 7, b: 12 },
  big: { label: `(ii) ${T('a=13')}`, A: 38, a: 13, b: 12 },
  right: { label: `(iii) ${T('a=h')}`, A: 38, a: 12 * sinD(38), aTex: '12\\sin38^\\circ', b: 12 },
  sep: { sep: 'Review:' },
  rev: { label: T('\\angle A=44^\\circ,\\ a=11,\\ b=15'), A: 44, a: 11, b: 15 }
};
function ambRows(p) {
  const t = h('table', 'u3l9-amt'); p.appendChild(t);
  const R = [['acute', `${T('a<h')}`, 'none'], ['acute', `${T('a=h')}`, 'one (right)'], ['acute', `${T('h<a<b')}`, '<b>two</b>'], ['acute', `${T('a\\ge b')}`, 'one'], ['obtuse', `${T('a\\le b')}`, 'none'], ['obtuse', `${T('a>b')}`, 'one']];
  t.innerHTML = `<tr><th colspan="2">${T('\\angle A')} acute</th></tr>` + R.slice(0, 4).map((r, i) => `<tr data-i="${i}"><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('') + `<tr><th colspan="2">${T('\\angle A')} obtuse</th></tr>` + R.slice(4).map((r, i) => `<tr data-i="${i + 4}"><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('');
  return { t, on(i) { t.querySelectorAll('tr[data-i]').forEach((tr) => tr.classList.toggle('on', Number(tr.dataset.i) === i)); return t.querySelector(`tr[data-i="${i}"]`); } };
}
const ambiguous = {
  title: 'The ambiguous case: count the triangles',
  height: 430,
  minW: 960,
  choices: Object.keys(AM).map((k) => (AM[k].sep ? AM[k] : { v: k, label: AM[k].label })),
  ask: (k) => { const d = AM[k]; return `In ${T('\\triangle ABC')}, ${T(`\\angle A=${d.A}^\\circ`)}, ${T('a=' + (d.aTex || d.a))} cm and ${T('b=' + d.b)} cm. How many triangles?`; },
  make(stage, k, ex) {
    const d = AM[k], W = ex.W, FW = 600, PX = FW + 14, PW = W - PX - 2;
    const A = d.A, b = d.b, a = d.a, hgt = b * sinD(A), Cx = b * cosD(A), disc = a * a - hgt * hgt;
    const sq = disc > 1e-9 ? Math.sqrt(disc) : 0, x1 = Cx + sq, x2 = Cx - sq, tangent = Math.abs(disc) < 1e-9;
    const xmax = Math.max(x1 + 1.5, Cx + a * 0.6, b + 1), xmin = Math.min(0, x2) - 1.6;
    const B = new Box(stage, { x: 0, y: 2 }, 'u3l9-ambbox', FW, 426);
    const s = Math.min((FW - 40) / (xmax - xmin), 300 / hgt), ox = 20 - s * xmin, oy = 380, P = (x, y) => [ox + s * x, oy - s * y];
    const Ap = P(0, 0), Cp = P(Cx, hgt), Fp = P(Cx, 0);
    const gTri = svgEl('g', {}, B.svg), gGeo = svgEl('g', {}, B.svg), gTop = svgEl('g', {}, B.svg);
    svgEl('line', { x1: Ap[0], y1: Ap[1], x2: FW - 14, y2: Ap[1], stroke: INK, 'stroke-width': 3 }, gGeo); arrowHead(gGeo, FW - 10, Ap[1], 1, 0, { color: INK, width: 3 });
    if (xmin < -0.2) svgEl('line', { x1: P(xmin, 0)[0], y1: Ap[1], x2: Ap[0], y2: Ap[1], stroke: '#c9c3b5', 'stroke-width': 2.5, 'stroke-dasharray': '6 6' }, gGeo);
    const sideB = svgEl('path', { class: 'bk-stroke', d: `M${Ap.join(' ')}L${Cp.join(' ')}`, stroke: INK, 'stroke-width': 3.5, fill: 'none', 'stroke-linecap': 'round' }, gGeo);
    angleArc(gGeo, Ap, P(5, 0), Cp, 40, { color: CR, width: 3 });
    const la = lab(B, Ap[0] + 62 * cosD(A / 2), Ap[1] - 62 * sinD(A / 2), T(cR(A + '^\\circ')), 'u3l9-al');
    lab(B, Ap[0] + 6, Ap[1] + 18, T('A'), 'u3l9-vl'); lab(B, Cp[0], Cp[1] - 18, T('C'), 'u3l9-vl');
    const lb = lab(B, (Ap[0] + Cp[0]) / 2 - 24 * sinD(A), (Ap[1] + Cp[1]) / 2 - 24 * cosD(A), T('b=' + b), 'u3l9-sl');
    const alt = hide(svgEl('path', { d: `M${Cp.join(' ')}L${Fp.join(' ')}`, stroke: CR, 'stroke-width': 2.5, 'stroke-dasharray': '7 6', fill: 'none' }, gGeo));
    const altM = hide(rightMark(gGeo, Fp, Cp, P(xmax, 0), 12, { color: CR }));
    const lh = hide(lab(B, Fp[0] - 10, (Cp[1] + Fp[1]) / 2, T(cR('h\\approx' + fx(hgt, 2))), 'u3l9-sl', 'w'));
    // the swinging side a
    const seg = svgEl('line', { x1: Cp[0], y1: Cp[1], x2: Cp[0], y2: Cp[1] + a * s, stroke: PK, 'stroke-width': 4, 'stroke-linecap': 'round' }, gTop); hide(seg);
    const tip = svgEl('circle', { cx: Cp[0], cy: Cp[1] + a * s, r: 6, fill: PK }, gTop); hide(tip);
    const la2 = hide(lab(B, Cp[0] + 18, Cp[1] + a * s * 0.45, T(cK('a=' + fx(a, a % 1 ? 2 : 0))), 'u3l9-sl', 'e'));
    const reach = a >= hgt - 1e-9, phMax = reach ? (tangent ? 0 : acosD(hgt / a)) : 50;
    const arc = hide(svgEl('path', { class: 'bk-stroke', d: arcD(Cp[0], Cp[1], a * s, -90 - Math.min(phMax + 12, 80), -90 + Math.min(phMax + 12, 80)), stroke: PK, 'stroke-width': 2.2, 'stroke-dasharray': '6 6', fill: 'none' }, gGeo));
    const setSeg = (ph) => { const ex2 = Cp[0] + a * s * sinD(ph), ey = Cp[1] + a * s * cosD(ph); seg.setAttribute('x2', ex2); seg.setAttribute('y2', ey); tip.setAttribute('cx', ex2); tip.setAttribute('cy', ey); };
    const hit = (x, n, ok = true) => { const p = P(x, 0), g = svgEl('g', {}, gTop); svgEl('circle', { cx: p[0], cy: p[1], r: 8, fill: ok ? PK : '#fff', stroke: ok ? '#fff' : RED, 'stroke-width': ok ? 2 : 3 }, g); if (!ok) svgEl('path', { d: `M${p[0] - 10} ${p[1] - 10}L${p[0] + 10} ${p[1] + 10}M${p[0] + 10} ${p[1] - 10}L${p[0] - 10} ${p[1] + 10}`, stroke: RED, 'stroke-width': 3 }, g); g.label = lab(B, p[0], p[1] + 22, T(n), 'u3l9-vl'); hide(g); hide(g.label); return g; };
    const H1 = reach ? hit(x1, tangent ? 'B' : 'B_1') : null, H2 = reach && !tangent ? hit(x2, x2 > 1e-6 ? 'B_2' : '', x2 > 1e-6) : null;
    const triEl = (x, fill) => { const p = P(x, 0); return hide(svgEl('path', { d: `M${Ap.join(' ')}L${p.join(' ')}L${Cp.join(' ')}Z`, fill, 'fill-opacity': 0.55, stroke: 'none' }, gTri)); };
    const T1 = reach ? triEl(x1, '#cfe0fb') : null, T2 = reach && !tangent && x2 > 1e-6 ? triEl(x2, '#f6dccb') : null;
    const seg1 = reach ? hide(svgEl('path', { d: `M${Cp.join(' ')}L${P(x1, 0).join(' ')}`, stroke: PK, 'stroke-width': 3.5, fill: 'none' }, gGeo)) : null;
    const seg2 = H2 && x2 > 1e-6 ? hide(svgEl('path', { d: `M${Cp.join(' ')}L${P(x2, 0).join(' ')}`, stroke: PK, 'stroke-width': 3.5, fill: 'none', 'stroke-dasharray': '9 6' }, gGeo)) : null;
    const rmB = tangent ? hide(rightMark(gGeo, Fp, Cp, Ap, 14, { color: PK, width: 2.5 })) : null;
    // the table and the numbers
    const Pn = panel(stage, PX, 2, PW, 426, '', 'u3l9-ampn'), tb = ambRows(Pn);
    const nl = [line(Pn, T(`h=b\\sin A=${b}\\sin${A}^\\circ\\approx${fx(hgt, 2)}`)), line(Pn, '')].map(hide);
    const row = a < hgt - 1e-9 ? 0 : tangent ? 1 : a < b ? 2 : 3, count = [0, 1, 2, 1][row];
    const cmp = [`${T(`a=${fx(a, 0)}<h`)}: <b>no triangle</b>`, `${T('a=h')}: <b>one</b> right triangle`, `${T(`h<a<b`)} (${T(`${fx(hgt, 2)}<${fx(a, 0)}<${b}`)}): <b>two</b>`, `${T(`a=${fx(a, 0)}\\ge b=${b}`)}: <b>one</b>`][row];
    nl[1].innerHTML = cmp;
    const stp = hide(stamp(stage, count === 0 ? 'none' : count === 1 ? '1 triangle' : '2 triangles', { ok: count === 0 ? false : true, x: FW - 170, y: 20, size: 'sm' }));
    const steps = [
      { cap: `Draw ${T(cR('\\angle A=' + A + '^\\circ'))} and side ${T('b=' + b)}: that fixes ${T('C')}. The third vertex ${T('B')} is somewhere on the bottom ray.`, run: async (c) => { await drawIn(sideB, 600, c); await pulse(c, lb, 1.15); } },
      { cap: `The shortest distance from ${T('C')} to the ray is the height ${T(cR(`h=b\\sin A=${b}\\sin${A}^\\circ\\approx${fx(hgt, 2)}`))} cm.`, run: async (c) => { await show(c, alt); await show(c, altM); await show(c, lh); await show(c, nl[0]); } }
    ];
    if (!reach) {
      steps.push({ cap: `Side ${T(cK('a=' + a))} hangs down from ${T('C')}… but ${T(`${a}<${fx(hgt, 2)}`)}: it is <b>too short</b> to reach the ray, wherever it swings.`, run: async (c) => { [seg, tip, la2].forEach((e) => { e.style.opacity = 1; }); setSeg(0); await tween(c, 1300, (t) => setSeg(Math.sin(t * Math.PI * 2) * 45)); await show(c, arc); await drawIn(arc, 700, c); } });
      steps.push({ cap: `${T('a<h')}: <b>no triangle</b>. (On the calculator, ${T('\\sin B')} would come out greater than 1: an ERROR.)`, run: async (c) => { await show(c, nl[1]); tb.on(0); stp.style.opacity = 1; await stampIn(c, stp); } });
      return steps;
    }
    steps.push({ cap: tangent ? `Side ${T(cK('a=12\\sin38^\\circ'))} is <b>exactly</b> the height: hanging straight down, it just touches the ray.` : `Side ${T(cK('a=' + a))} swings from ${T('C')}. It is longer than ${T('h')}, so it reaches the ray…`,
      run: async (c) => { [seg, tip, la2].forEach((e) => { e.style.opacity = 1; }); setSeg(0); if (!tangent) { await tween(c, 800, (t) => setSeg(-phMax * t)); await tween(c, 1100, (t) => setSeg(-phMax + 2 * phMax * t)); } await show(c, arc); await drawIn(arc, 700, c); } });
    if (tangent) {
      steps.push({ cap: `${T('a=h')}: it meets the ray at <b>one</b> point, with a right angle: one right triangle, ${T('B=90^\\circ')}.`, run: async (c) => { await pop(c, H1); await show(c, H1.label); await show(c, T1); await show(c, rmB); await show(c, nl[1]); tb.on(1); stp.style.opacity = 1; await stampIn(c, stp); } });
      return steps;
    }
    if (row === 3) {
      steps.push({ cap: `It crosses the ray once at ${T('B_1')}. The other crossing is <b>behind ${T('A')}</b>, off the ray: ${T('a\\ge b')} gives <b>one</b> triangle.`, run: async (c) => { await pop(c, H1); await show(c, H1.label); await show(c, seg1); await show(c, T1); await pop(c, H2); await show(c, nl[1]); tb.on(3); stp.style.opacity = 1; await stampIn(c, stp); } });
      return steps;
    }
    steps.push({ cap: `…and it hits the ray <b>twice</b>, at ${T('B_1')} and ${T('B_2')}. ${T('h<a<b')}: <b>two triangles</b>.`, run: async (c) => { await pop(c, H1); await show(c, H1.label); await pop(c, H2); await show(c, H2.label); await show(c, seg1); await show(c, seg2); await show(c, nl[1]); tb.on(2); stp.style.opacity = 1; await stampIn(c, stp); } });
    if (d.solve || k === 'rev') {
      const sB = b * sinD(A) / a, Bd = asinD(sB), B1 = Math.round(Bd), B2 = 180 - B1, C1 = 180 - A - B1, C2 = 180 - A - B2;
      const c1 = a * sinD(C1) / sinD(A), c2 = a * sinD(C2) / sinD(A);
      const sl = [line(Pn, T(`\\sin B\\approx${sB.toFixed(4)}:\\ B\\approx${B1}^\\circ\\text{ or }${B2}^\\circ`))].map(hide);
      if (d.solve) {
        const t1 = hide(line(Pn, `${T('\\triangle_1')}: ${T(`C\\approx${C1}^\\circ`)}, ${T(`c\\approx${fx(c1)}`)}`)), t2 = hide(line(Pn, `${T('\\triangle_2')}: ${T(`C\\approx${C2}^\\circ`)}, ${T(`c\\approx${fx(c2)}`)}`));
        steps.push({ cap: `Sine law: ${T(`\\sin B=\\dfrac{${b}\\sin${A}^\\circ}{${a}}\\approx${sB.toFixed(4)}`)}, so ${T(`B\\approx${B1}^\\circ`)} (at ${T('B_1')}) or ${T(`180^\\circ-${B1}^\\circ=${B2}^\\circ`)} (at ${T('B_2')}).`, run: async (c) => { for (const e of sl) await show(c, e); } });
        steps.push({ cap: `Triangle 1: ${T(`C\\approx180^\\circ-${A}^\\circ-${B1}^\\circ=${C1}^\\circ`)}, ${T(`c=\\dfrac{${a}\\sin${C1}^\\circ}{\\sin${A}^\\circ}\\approx${fx(c1)}`)} cm.`, run: async (c) => { T2.style.opacity = 0.12; await pulse(c, T1, 1); await show(c, t1); } });
        steps.push({ cap: `Triangle 2: ${T(`C\\approx180^\\circ-${A}^\\circ-${B2}^\\circ=${C2}^\\circ`)}, ${T(`c=\\dfrac{${a}\\sin${C2}^\\circ}{\\sin${A}^\\circ}\\approx${fx(c2)}`)} cm.`, run: async (c) => { T1.style.opacity = 0.12; T2.style.opacity = 1; await pulse(c, T2, 1); await show(c, t2); } });
      } else {
        steps.push({ cap: `Both are real: ${T(`\\sin B\\approx${sB.toFixed(4)}`)} gives ${T(`B\\approx${B1}^\\circ`)} or ${T(`${B2}^\\circ`)}, and ${T(`${A}^\\circ+${B2}^\\circ<180^\\circ`)} leaves room for ${T('C')}.`, run: async (c) => { for (const e of sl) await show(c, e); } });
      }
    }
    return steps;
  }
};

/* =============================== explainer: solving for θ =============================== */
const ST = {
  c1: { label: '4(c)(i)', f: 'cos', a: -Math.sqrt(3) / 2, aT: '-\\dfrac{\\sqrt3}{2}', ask: '\\cos\\theta=-\\dfrac{\\sqrt3}{2}', ref: 30, refHow: '\\text{special triangle: }\\cos30^\\circ=\\tfrac{\\sqrt3}{2}' },
  c2: { label: '(ii)', f: 'tan', a: -1, aT: '-1', ask: '\\tan\\theta=-1', ref: 45, refHow: '\\text{special triangle: }\\tan45^\\circ=1' },
  c3: { label: '(iii)', f: 'sin', a: -Math.sqrt(2) / 2, aT: '-\\dfrac{\\sqrt2}{2}', ask: '2\\sin\\theta+\\sqrt2=0', pre: '2\\sin\\theta=-\\sqrt2\\ \\Rightarrow\\ \\sin\\theta=-\\dfrac{\\sqrt2}{2}', ref: 45, refHow: '\\text{special triangle: }\\sin45^\\circ=\\tfrac{\\sqrt2}{2}' },
  sep: { sep: 'Example 5:' },
  a: { label: '(a)', f: 'sin', a: 0.38, aT: '0.38', ask: '\\sin\\theta=0.38', calc: '\\sin^{-1}(0.38)' },
  b: { label: '(b)', f: 'tan', a: -2.5, aT: '-2.5', ask: '\\tan\\theta=-2.5', calc: '\\tan^{-1}(2.5)' },
  c: { label: '(c)', f: 'cos', a: -2 / 3, aT: '-\\dfrac{2}{3}', ask: '3\\cos\\theta+2=0', pre: '3\\cos\\theta=-2\\ \\Rightarrow\\ \\cos\\theta=-\\dfrac{2}{3}', calc: '\\cos^{-1}\\!\\left(\\tfrac{2}{3}\\right)' },
  d: { label: '(d)', f: 'sin', a: -1.3, aT: '-1.3', ask: '\\sin\\theta=-1.3', none: true },
  e: { label: '(e)', f: 'cos', a: -1, aT: '-1', ask: '\\cos\\theta=-1', quad: 180 }
};
const ST_WORD = { sin: 'a <b>height</b> on the circle', cos: 'a <b>sideways distance</b> on the circle', tan: 'the <b>slope</b> of the arm: a line through the origin' };
const solveTrig = {
  title: 'Solving for θ: usually two answers',
  height: 444,
  minW: 940,
  capH: 84,
  choices: Object.keys(ST).map((k) => (ST[k].sep ? ST[k] : { v: k, label: ST[k].label })),
  ask: (k) => `Solve ${T(ST[k].ask)} for ${T('0^\\circ\\le\\theta<360^\\circ')}${ST[k].calc ? ', to the nearest tenth of a degree' : ST[k].none || ST[k].quad ? ', to the nearest tenth of a degree' : ' exactly'}.`,
  make(stage, k, ex) {
    const d = ST[k], W = ex.W, U = 150;
    const Pl = new Plane(stage, { x: 0, y: 2, size: 440, unit: U, R: U, letters: true, degs: true });
    const O = Pl.O, circ = svgEl('circle', { cx: O[0], cy: O[1], r: U, fill: 'none', stroke: '#b9b2a3', 'stroke-width': 2.2 }, Pl.gRot);
    lab(Pl, O[0] + U * 0.72, O[1] + U * 0.78, T('r=1'), 'u3l9-num');
    const PX = 456, Pn = panel(stage, PX, 2, W - PX - 2, 440, '', 'u3l9-work');
    const ref = d.ref ?? (d.none || d.quad ? 0 : r1(d.f === 'sin' ? asinD(Math.abs(d.a)) : d.f === 'cos' ? acosD(Math.abs(d.a)) : atanD(Math.abs(d.a))));
    const pos = d.a > 0, quads = { sin: pos ? [1, 2] : [3, 4], cos: pos ? [1, 4] : [2, 3], tan: pos ? [1, 3] : [2, 4] }[d.f];
    const place = (q) => [0, ref, 180 - ref, 180 + ref, 360 - ref][q];
    const sols = quads.map(place), how = (q) => ['', `${fx(ref, d.ref ? 0 : 1)}^\\circ`, `180^\\circ-${fx(ref, d.ref ? 0 : 1)}^\\circ=${fx(place(2), d.ref ? 0 : 1)}^\\circ`, `180^\\circ+${fx(ref, d.ref ? 0 : 1)}^\\circ=${fx(place(3), d.ref ? 0 : 1)}^\\circ`, `360^\\circ-${fx(ref, d.ref ? 0 : 1)}^\\circ=${fx(place(4), d.ref ? 0 : 1)}^\\circ`][q];
    // the line for the value
    const lineEl = (() => {
      if (d.f === 'sin') { const y = O[1] - d.a * U; return svgEl('line', { x1: 12, y1: y, x2: Pl.S - 12, y2: y, stroke: CR, 'stroke-width': 2.6, 'stroke-dasharray': '9 6' }, Pl.gRot); }
      if (d.f === 'cos') { const x = O[0] + d.a * U; return svgEl('line', { x1: x, y1: 12, x2: x, y2: Pl.S - 12, stroke: CR, 'stroke-width': 2.6, 'stroke-dasharray': '9 6' }, Pl.gRot); }
      const L = 210, an = Math.atan(d.a); return svgEl('line', { x1: O[0] - L * Math.cos(an), y1: O[1] + L * Math.sin(an), x2: O[0] + L * Math.cos(an), y2: O[1] - L * Math.sin(an), stroke: CR, 'stroke-width': 2.6, 'stroke-dasharray': '9 6' }, Pl.gRot);
    })(); hide(lineEl);
    const an0 = Math.atan(d.a), up = d.f === 'tan' ? (Math.sin(an0) >= 0 ? 1 : -1) : 1, tanP = [O[0] + up * 108 * Math.cos(an0) + 16 * Math.sin(an0) * up, O[1] - up * 108 * Math.sin(an0) + 16 * Math.cos(an0) * up];
    const lineLab = hide(lab(Pl, d.f === 'sin' ? O[0] + 58 : d.f === 'cos' ? O[0] + d.a * U + 10 : tanP[0], d.f === 'sin' ? O[1] - d.a * U - 16 : d.f === 'cos' ? 26 : tanP[1], T(cR(d.f === 'sin' ? 'y=' + d.aT.replace('dfrac', 'tfrac') : d.f === 'cos' ? 'x=' + d.aT.replace('dfrac', 'tfrac') : '\\text{slope }' + d.aT)), 'u3l9-lnl', d.f === 'cos' ? 'e' : 'c'));
    const hits = d.none ? [] : d.quad ? [Pl.pa(d.quad, U)] : sols.map((t) => Pl.pa(t, U));
    const hitEls = hits.map((p) => hide(svgEl('circle', { cx: p[0], cy: p[1], r: 7.5, fill: CT, stroke: '#fff', 'stroke-width': 2 }, Pl.gTop)));
    const L = [];
    if (d.pre) L.push(line(Pn, T(d.pre)));
    const Lr = line(Pn, `<b>1.</b> ${T(cR('\\theta_R'))}: ${d.calc ? T(`${d.calc}\\approx${fx(ref)}^\\circ`) : d.ref ? T(d.refHow) : ''}`);
    const Lq = line(Pn, `<b>2.</b> ${d.f} ${pos ? '+' : '−'}: ${quads.map((q) => QN[q]).join(', ')}`);
    const Lp = line(Pn, `<b>3.</b> ${T(quads.map((q) => how(q)).join(',\\quad '))}`, 'u3l9-l3');
    const La = line(Pn, d.none ? '<b>No solution</b>' : d.quad ? T('\\theta=180^\\circ') : T(`\\theta=${sols.map((t) => fx(t, d.ref ? 0 : 1) + '^\\circ').join(',\\ ')}`), 'u3l9-wans');
    [...L, Lr, Lq, Lp, La].forEach(hide);
    const steps = [];
    if (d.pre) steps.push({ cap: `Get the ratio by itself first: ${T(d.pre)}.`, run: (c) => show(c, L[0]) });
    if (d.none) {
      steps.push({ cap: `${T('\\sin\\theta')} is a height on the circle with ${T('r=1')}, so it is always between ${T('-1')} and ${T('1')}. The line ${T('y=-1.3')} is <b>below</b> the circle.`, run: async (c) => { await show(c, lineEl); await show(c, lineLab); } });
      const stp = hide(stamp(stage, 'no solution', { ok: false, x: 150, y: 250, size: 'sm' }));
      steps.push({ cap: `It never meets the circle: <b>no solution</b>. The calculator agrees: ${T('\\sin^{-1}(-1.3)')} gives ERROR: DOMAIN.`, run: async (c) => { await show(c, La); stp.style.opacity = 1; await stampIn(c, stp); } });
      return steps;
    }
    if (d.quad) {
      steps.push({ cap: `${T('\\cos\\theta')} is the sideways distance ${T('x')} on the circle with ${T('r=1')}: draw ${T('x=-1')}. It only <b>touches</b> the circle, at ${T('(-1,\\,0)')}.`, run: async (c) => { await show(c, lineEl); await show(c, lineLab); await pop(c, hitEls[0]); } });
      const arm = Pl.arm({ len: U, thLab: () => T(cT('180^\\circ')) });
      steps.push({ cap: `One point, on the axis: one solution, ${T(cT('\\theta=180^\\circ'))} (quadrantal).`, run: async (c) => { await arm.to(c, 180, 800); await show(c, La); } });
      return steps;
    }
    steps.push({ cap: `${T('\\' + d.f + '\\theta')} is ${ST_WORD[d.f]}${d.f === 'tan' ? ` with slope ${T(d.aT)}` : `: draw ${T((d.f === 'sin' ? 'y=' : 'x=') + d.aT)}`}. It meets the circle <b>twice</b>: two answers.`, run: async (c) => { await show(c, lineEl); await show(c, lineLab); for (const e of hitEls) await pop(c, e); } });
    steps.push({ cap: d.calc ? `<b>Step 1:</b> ${T(cR('\\theta_R=' + d.calc + '\\approx' + fx(ref) + '^\\circ'))}. Use the <b>positive</b> value: the screen gives the QI angle.` : `<b>Step 1:</b> ${T(cR('\\theta_R=' + ref + '^\\circ'))} from a ${T(d.refHow)}.`, run: (c) => show(c, Lr) });
    steps.push({ cap: `<b>Step 2:</b> ${d.f} is ${pos ? 'positive' : 'negative'} in <b>${quads.map((q) => QN[q]).join('</b> and <b>')}</b> (CAST).`, run: async (c) => { quads.forEach((q) => Pl.lightQ(q)); await show(c, Lq); } });
    const arms = [];
    steps.push({ cap: `<b>Step 3:</b> place ${T(cR('\\theta_R'))} in each: ${T(quads.map((q) => how(q)).join(',\\ \\ '))}.`, run: async (c) => {
      for (let i = 0; i < quads.length; i++) { const a = Pl.arm({ len: U, rotR: 22 + i * 12, refR: 52, thAt: 'tip', thLab: () => T(cT(fx(sols[i], d.ref ? 0 : 1) + '^\\circ')), refLab: () => T(cR(fx(ref, d.ref ? 0 : 1) + '^\\circ')) }); arms.push(a); await a.to(c, sols[i], 800); }
      await show(c, Lp); await show(c, La);
    } });
    return steps;
  }
};

/* =============================== explainer: the tool sorter (star) =============================== */
const BINS = [
  { k: 'P', name: 'Primary ratios', sub: 'SOH CAH TOA', color: CP, bg: '#f1ebfb' },
  { k: 'S', name: 'Sine law', sub: 'a full pair', color: CS, bg: '#e9f0fd' },
  { k: 'C', name: 'Cosine law', sub: 'SAS · SSS', color: CC, bg: '#e6f4ee' },
  { k: 'A', name: 'Ambiguous', sub: 'SSA: count!', color: CA, bg: '#fdf0de' }
];
/* a card: tri (names, sides, flip), sl / al (given parts, '?' unknown), right, find, bin, n (triangle count), why lines */
const SORT = {
  ex: { label: 'Booklet examples', cards: [
    { t: 'Ex 6(a)', names: ['P', 'Q', 'R'], sides: { p: 15.2, q: 15.2 * sinD(71) / sinD(48), r: 15.2 * sinD(61) / sinD(48) }, sl: { p: '15.2', r: '?' }, al: { P: '48^\\circ', Q: '71^\\circ' }, find: 'r', bin: 'S',
      why: ['no', `${T('p')} and ${T('\\angle P')}`, 'no: two angles and a side'] },
    { t: 'Ex 6(b)', names: ['A', 'B', 'C'], sides: { a: 7, b: 9, c: 13 }, sl: { a: '7', b: '9', c: '13' }, al: { C: '?' }, find: 'the largest angle', bin: 'C', why: ['no', 'none: three sides, no angle (SSS)'] },
    { t: 'Ex 7', ssa: { A: 38, a: 9, b: 12 }, find: 'both triangles', bin: 'A', n: 2, why: ['no', `${T('a')} and ${T('\\angle A')}`, `yes: ${T('h\\approx7.39<9<12')}`] },
    { t: 'Ex 8(a), △BFT', names: ['B', 'F', 'T'], sides: { b: 172.46 * sinD(52), f: 172.46, t: 172.46 * cosD(52) }, right: 'F', sl: { f: '172.5', b: '?' }, al: { B: '52^\\circ' }, find: 'TF', bin: 'P', why: [`yes: ${T('\\angle F=90^\\circ')}`] },
    { t: 'Ex 8(b)', names: ['O', 'P', 'Q'], sides: { o: sas(21, 27, 115), p: 27, q: 21 }, sl: { p: '27', q: '21', o: '?' }, al: { O: '115^\\circ' }, find: 'd', bin: 'C', why: ['no', `none: the ${T('115^\\circ')} is opposite the unknown (SAS)`] },
    { t: 'Ex 8(a), △ABT', names: ['A', 'B', 'T'], sides: { t: 120, a: 120 * sinD(31) / sinD(21), b: 120 * sinD(128) / sinD(21) }, sl: { t: '120', a: '?' }, al: { A: '31^\\circ', B: '128^\\circ' }, find: 'BT', bin: 'S',
      why: ['no', `${T('AB')} and ${T('\\angle T=21^\\circ')} (third angle)`, 'no: two angles and a side'] },
    { t: 'Ex 7(c)(i)', ssa: { A: 38, a: 7, b: 12 }, find: 'how many?', bin: 'A', n: 0, why: ['no', `${T('a')} and ${T('\\angle A')}`, `yes: ${T('a=7<h\\approx7.39')}`] },
    { t: 'Ex 7(c)(ii)', ssa: { A: 38, a: 13, b: 12 }, find: 'how many?', bin: 'A', n: 1, why: ['no', `${T('a')} and ${T('\\angle A')}`, `yes: ${T('a=13\\ge b=12')}`] }
  ] },
  mix: { label: 'Mixed review', cards: [
    { t: 'Card 1', names: ['A', 'B', 'C'], sides: { c: 10, a: 10 * sinD(35), b: 10 * cosD(35) }, right: 'C', sl: { c: '10', a: '?' }, al: { A: '35^\\circ' }, find: 'a', bin: 'P', why: [`yes: ${T('\\angle C=90^\\circ')}`] },
    { t: 'Card 2', names: ['D', 'E', 'F'], sides: { d: 12, e: 12 * sinD(75) / sinD(40), f: 12 * sinD(65) / sinD(40) }, sl: { d: '12', e: '?' }, al: { D: '40^\\circ', E: '75^\\circ' }, find: 'e', bin: 'S', why: ['no', `${T('d')} and ${T('\\angle D')}`, 'no: two angles and a side'] },
    { t: 'Card 3', names: ['K', 'L', 'M'], sides: { k: 5, l: 6, m: 8 }, sl: { k: '5', l: '6', m: '8' }, al: { K: '?' }, find: 'the smallest angle', bin: 'C', why: ['no', 'none: SSS'] },
    { t: 'Card 4', ssa: { A: 30, a: 5, b: 8 }, find: 'how many?', bin: 'A', n: 2, why: ['no', `${T('a')} and ${T('\\angle A')}`, `yes: ${T('h=4<5<8')}`] },
    { t: 'Card 5', names: ['P', 'Q', 'R'], sides: { p: sas(9, 14, 62), q: 9, r: 14 }, sl: { q: '9', r: '14', p: '?' }, al: { P: '62^\\circ' }, find: 'p', bin: 'C', why: ['no', `none: ${T('62^\\circ')} is between the sides (SAS)`] },
    { t: 'Card 6', ssa: { A: 120, a: 10, b: 7 }, find: 'how many?', bin: 'A', n: 1, why: ['no', `${T('a')} and ${T('\\angle A')}`, `yes: obtuse, ${T('a>b')}`] },
    { t: 'Card 7', ssa: { A: 50, a: 6, b: 10 }, find: 'how many?', bin: 'A', n: 0, why: ['no', `${T('a')} and ${T('\\angle A')}`, `yes: ${T('a=6<h\\approx7.66')}`] },
    { t: 'Card 8', names: ['X', 'Y', 'Z'], sides: { z: 10, x: 10 * sinD(50) / sinD(70), y: 10 * sinD(60) / sinD(70) }, sl: { z: '10', x: '?' }, al: { X: '50^\\circ', Y: '60^\\circ' }, find: 'x', bin: 'S', why: ['no', `${T('z')} and ${T('\\angle Z=70^\\circ')} (third angle)`, 'no: ASA'] }
  ] },
  asg: { label: 'Assignment-style', cards: [
    { t: '8(a)', names: ['D', 'E', 'F'], sides: { e: 18.5, d: 18.5 * sinD(54) / sinD(67), f: 18.5 * sinD(59) / sinD(67) }, sl: { e: '18.5', d: '?' }, al: { D: '54^\\circ', E: '67^\\circ' }, find: 'd and f', bin: 'S', why: ['no', `${T('e')} and ${T('\\angle E')}`, 'no: AAS'] },
    { t: '8(b)', ssa: { A: 112, a: 11.4, b: 8.7, names: ['X', 'Z', 'Y'] }, find: '∠Z', bin: 'A', n: 1, why: ['no', `${T('x')} and ${T('\\angle X')}`, `yes: obtuse, ${T('x>z')}`] },
    { t: '9(a)', names: ['A', 'B', 'C'], sides: { b: sas(14, 22, 37), a: 14, c: 22 }, sl: { a: '14', c: '22', b: '?' }, al: { B: '37^\\circ' }, find: 'b', bin: 'C', why: ['no', 'none: SAS'] },
    { t: '9(b)', names: ['A', 'B', 'C'], sides: { a: 8, b: 11, c: 16 }, sl: { a: '8', b: '11', c: '16' }, al: {}, find: 'all three angles', bin: 'C', why: ['no', 'none: SSS'] },
    { t: '11(a)', ssa: { A: 40, a: 5, b: 12 }, find: 'how many?', bin: 'A', n: 0, why: ['no', `${T('a')} and ${T('\\angle A')}`, `yes: ${T('a<h\\approx7.71')}`] },
    { t: '11(b)', ssa: { A: 30, a: 6, b: 12 }, find: 'how many?', bin: 'A', n: 1, why: ['no', `${T('a')} and ${T('\\angle A')}`, `yes: ${T('a=h=6')}`] },
    { t: '22', names: ['A', 'B', 'C'], sides: { a: sas(85, 62, 71), b: 85, c: 62 }, sl: { b: '85', c: '62', a: '?' }, al: { A: '71^\\circ' }, find: 'the third side', bin: 'C', why: ['no', 'none: SAS'] },
    { t: '20', ssa: { A: 44, a: 11, b: 15 }, find: 'how many?', bin: 'A', n: 2, why: ['no', `${T('a')} and ${T('\\angle A')}`, `yes: ${T('h\\approx10.42<11<15')}`] }
  ] }
};
const CW = 300, CH = 214, MS = 0.36;
/** draw a card's figure: a triangle to scale with its given parts, or (SSA) the angle, side b and the loose side a */
function cardFig(card, d) {
  const BW = CW - 8, BH = CH - 64;
  if (!d.ssa) {
    const F = new TriFig(null, { width: BW, height: BH, pts: triPts(d.names, d.sides, d.flip), pad: 30, padT: 26, padB: 26, sw: 3 });
    card.appendChild(F.el); F.el.classList.add('u3l9-cfig');
    for (const k in d.sl) { const v = d.sl[k]; F.sideLab(k, v === '?' ? '<span class="u3l9-unk">?</span>' : T(v), { cls: v === '?' ? 'u3l9-cl' : 'u3l9-given u3l9-cl', off: 16 }); if (v !== '?') F.paint(k, CT); else F.paint(k, '#9aa0ab'); }
    for (const v in d.al) { const val = d.al[v]; F.ang(v, val === '?' ? '<span class="u3l9-unk">?</span>' : T(val), { color: val === '?' ? GRAY : CT, cls: (val === '?' ? '' : 'u3l9-given ') + 'u3l9-cl' }); }
    if (d.right) F.ang(d.right, null, { right: true, color: CT });
    return { F };
  }
  const { A, a, b } = d.ssa, nm = d.ssa.names || ['A', 'B', 'C'], hgt = b * sinD(A), Cx = b * cosD(A);
  const disc = a * a - hgt * hgt, sq = disc > 1e-9 ? Math.sqrt(disc) : 0, x1 = Cx + sq, x2 = Cx - sq;
  const xmin = Math.min(0, Cx) - 0.6, xmax = Math.max(x1, Cx + 0.6 * a, Math.abs(b) * 0.8) + 0.8;
  const Bx = new Box(null, {}, 'u3l9-cfig', BW, BH); card.appendChild(Bx.el);
  const s = Math.min((BW - 30) / (xmax - xmin), (BH - 48) / hgt), ox = 16 - s * xmin, oy = BH - 22, P = (x, y) => [ox + s * x, oy - s * y];
  const Ap = P(0, 0), Cp = P(Cx, hgt);
  svgEl('line', { x1: Ap[0], y1: Ap[1], x2: BW - 8, y2: Ap[1], stroke: INK, 'stroke-width': 2.6 }, Bx.svg); arrowHead(Bx.svg, BW - 6, Ap[1], 1, 0, { color: INK, width: 2.4, L: 9, hw: 4.5 });
  svgEl('path', { d: `M${Ap.join(' ')}L${Cp.join(' ')}`, stroke: CT, 'stroke-width': 3, fill: 'none' }, Bx.svg);
  angleArc(Bx.svg, Ap, P(xmax, 0), Cp, 22, { color: CT, width: 2.4 });
  lab(Bx, Ap[0] + 40 * cosD(Math.min(A / 2, 70)), Ap[1] - 40 * sinD(Math.min(A / 2, 70)) + (A > 90 ? 0 : 0), T(A + '^\\circ'), 'u3l9-given u3l9-cl');
  lab(Bx, Ap[0] - 2, Ap[1] + 13, T(nm[0]), 'u3l9-vl u3l9-cvl'); lab(Bx, Cp[0], Cp[1] - 13, T(nm[2] || 'C'), 'u3l9-vl u3l9-cvl');
  const bl = (nm[1] || 'B').toLowerCase(), al = nm[0].toLowerCase();
  lab(Bx, (Ap[0] + Cp[0]) / 2 - 16 * sinD(A), (Ap[1] + Cp[1]) / 2 - 16 * cosD(A), T(`${bl}=${b}`), 'u3l9-given u3l9-cl');
  // side a: a loose stick hanging from C
  const ph = 28, stub = Math.min(a, hgt * 0.62) * s;
  svgEl('path', { d: `M${Cp[0]} ${Cp[1]}L${Cp[0] + stub * sinD(ph)} ${Cp[1] + stub * cosD(ph)}`, stroke: PK, 'stroke-width': 3, 'stroke-dasharray': '6 4', fill: 'none', 'stroke-linecap': 'round' }, Bx.svg);
  lab(Bx, Cp[0] + stub * sinD(ph) + 8, Cp[1] + stub * cosD(ph) * 0.55, T(`${al}=${a}`), 'u3l9-given u3l9-cl', 'e');
  // the swing (shown when sorted): an arc of radius a from C, and the hits
  const reach = a >= hgt - 1e-9, phM = reach ? acosD(Math.min(1, hgt / a)) : 45;
  const swing = svgEl('g', { class: 'u3l9-swing' }, Bx.svg); swing.style.opacity = 0;
  svgEl('path', { d: arcD(Cp[0], Cp[1], a * s, -90 - Math.min(phM + 10, 80), -90 + Math.min(phM + 10, 80)), stroke: PK, 'stroke-width': 2.2, 'stroke-dasharray': '5 5', fill: 'none' }, swing);
  if (reach) [x1, x2].filter((x, i) => (i === 0 || sq > 1e-6) && x > 1e-6).forEach((x) => svgEl('circle', { cx: P(x, 0)[0], cy: oy, r: 6, fill: PK, stroke: '#fff', 'stroke-width': 2 }, swing));
  return { swing };
}
function makeCard(stage, d) {
  const card = add(stage, box(h('div', 'u3l9-card'), CW, CH), 8, 6);
  card.appendChild(h('div', 'u3l9-ch', `<b>${d.t.replace('△', T('\\triangle') + '\u2009')}</b>`));
  const fig = cardFig(card, d);
  card.appendChild(h('div', 'u3l9-cf', `Find ${/^[a-zA-Z]{1,2}$/.test(d.find) ? T(d.find) : d.find.replace('∠Z', T('\\angle Z'))}`));
  const badge = h('div', 'u3l9-badge', String(d.n ?? '')); badge.style.opacity = 0; card.appendChild(badge);
  card.fig = fig; card.badge = badge; return card;
}
const toolSorter = {
  title: 'Which tool? Sort the triangles',
  height: 470,
  minW: 980,
  choices: Object.keys(SORT).map((k) => ({ v: k, label: SORT[k].label })),
  intro: 'Each card shows what is given (in colour). Guess its bin first, then press <b>Next</b>.',
  make(stage, k, ex) {
    const set = SORT[k].cards, W = ex.W;
    const BY = 238, gap = 10, BWd = (W - 3 * gap) / 4, BHt = 230;
    const bins = BINS.map((b, i) => {
      const el = add(stage, box(h('div', 'u3l9-bin', `<div class="u3l9-binh"><b>${b.name}</b><span>${b.sub}</span></div>`), BWd, BHt), i * (BWd + gap), BY);
      el.style.setProperty('--bin', b.color); el.style.background = b.bg; return { ...b, el, x: i * (BWd + gap), n: 0 };
    });
    const RX = CW + 24, RW = W - RX - 2, R = panel(stage, RX, 6, RW, 222, '', 'u3l9-why');
    const qs = ['Right angle?', 'A full pair? (side + opposite angle)', 'SSA? (angle not between the sides)'];
    const rowEls = qs.map((q) => { const r = h('div', 'u3l9-wrow', `<span class="u3l9-wq">${q}</span><span class="u3l9-wv"></span>`); R.appendChild(r); return r; });
    const verdict = h('div', 'u3l9-verdict', ''); R.appendChild(verdict);
    const cards = set.map((d) => { const c = makeCard(stage, d); c.style.opacity = 0; return c; });
    const slot = (bin) => { const i = bin.n++; const col = i % 2, rowI = Math.floor(i / 2); return [bin.x + 8 + col * (CW * MS + 8 + (BWd - 16 - 2 * CW * MS - 8) / 1), BY + 50 + rowI * (CH * MS + 8)]; };
    const reasons = (d) => {
      const why = d.why, out = [];
      out.push(why[0].startsWith('yes') ? `<b class="ok">✓</b> ${why[0]}` : `<b class="no">✗</b> no`);
      if (why[1] != null) out.push(why[1].startsWith('none') ? `<b class="no">✗</b> ${why[1]}` : `<b class="ok">✓</b> ${why[1]}`);
      if (why[2] != null) out.push(why[2].startsWith('yes') ? `<b class="amb">!</b> ${why[2]}` : `<b class="no">✗</b> ${why[2]}`);
      return out;
    };
    const binOf = (d) => bins.find((b) => b.k === d.bin);
    const verdictTxt = (d) => ({ P: '→ <b>Primary ratios</b>', S: '→ <b>Sine law</b>', C: '→ <b>Cosine law</b>', A: `→ <b>Ambiguous</b>: ${d.n} triangle${d.n === 1 ? '' : 's'}` })[d.bin];
    const clearWhy = () => { rowEls.forEach((r) => { r.querySelector('.u3l9-wv').innerHTML = ''; r.style.opacity = 0.35; }); verdict.innerHTML = ''; verdict.style.color = ''; };
    clearWhy();
    const steps = [];
    set.forEach((d, i) => {
      const card = cards[i], b = binOf(d), givenTxt = d.ssa ? `${T(`\\angle ${(d.ssa.names || ['A'])[0]}=${d.ssa.A}^\\circ`)}, two sides` : 'the coloured parts';
      steps.push({ cap: `<b>${d.t}</b>: given ${givenTxt}. Find ${/^[a-zA-Z]{1,2}$/.test(d.find) ? T(d.find) : d.find.replace('∠Z', T('\\angle Z'))}. <b>Which bin?</b>`,
        run: async (c) => { clearWhy(); card.style.opacity = 1; await anim(c, card, [{ opacity: 0, transform: 'translateX(-40px) rotate(-6deg)' }, { opacity: 1, transform: 'none' }], 450); } });
      const rs = reasons(d);
      steps.push({ cap: `${rs.map((r, j) => `${qs[j].split('?')[0]}? ${r.replace(/<b class="\w+">.<\/b> /, '')}`).join('. ')}. ${verdictTxt(d).replace('→ ', 'So: ')}.`,
        run: async (c) => {
          for (let j = 0; j < rs.length; j++) { const r = rowEls[j]; r.querySelector('.u3l9-wv').innerHTML = rs[j]; r.style.opacity = 1; await show(c, r.querySelector('.u3l9-wv')); }
          verdict.innerHTML = verdictTxt(d); verdict.style.color = b.color; await show(c, verdict);
          if (card.fig.swing) { card.fig.swing.style.opacity = 1; await fadeIn(c, card.fig.swing, 400); }
          if (d.bin === 'A') { card.badge.style.opacity = 1; await pop(c, card.badge); }
          const [tx, ty] = slot(b);
          await anim(c, card, [{ transform: 'none' }, { transform: `translate(${tx - 8}px, ${ty - 6}px) scale(${MS})` }], 750);
          card.classList.add('u3l9-sorted');
        } });
    });
    steps.push({ cap: `<b>The rule:</b> right angle → SOH CAH TOA. A full pair → sine law (SSA: compare ${T('a')} with ${T('h=b\\sin A')} and ${T('b')} first). No full pair (SAS, SSS) → cosine law.`, run: async (c) => { clearWhy(); for (const b of bins) await pulse(c, b.el, 1.03); } });
    return steps;
  }
};

/* =============================== static figures on the example cards =============================== */
function staticFigs() {
  const f7 = document.getElementById('u3l9-fig7');
  if (f7) {
    const A = 38, b = 12, Cx = b * cosD(A), hgt = b * sinD(A), sq = Math.sqrt(81 - hgt * hgt), x1 = Cx + sq, x2 = Cx - sq;
    const B = new Box(f7, {}, 'u3l9-f7', 300, 180), s = 270 / x1 * 0.95, P = (x, y) => [14 + x * s, 160 - y * s];
    const Ap = P(0, 0), Cp = P(Cx, hgt), B1 = P(x1, 0), B2 = P(x2, 0);
    svgEl('path', { d: `M${Ap.join(' ')}L${B1.join(' ')}L${Cp.join(' ')}Z`, fill: '#eef3fc', stroke: INK, 'stroke-width': 2.6, 'stroke-linejoin': 'round' }, B.svg);
    svgEl('path', { d: `M${Cp.join(' ')}L${B2.join(' ')}`, stroke: INK, 'stroke-width': 2.4, 'stroke-dasharray': '7 5', fill: 'none' }, B.svg);
    [['A', Ap, -4, 14], ['C', Cp, 0, -14], ['B_1', B1, 4, 14], ['B_2', B2, 0, 14]].forEach(([n, p, dx, dy]) => lab(B, p[0] + dx, p[1] + dy, T(n), 'u3l9-vl u3l9-small'));
    lab(B, (Ap[0] + Cp[0]) / 2 - 12, (Ap[1] + Cp[1]) / 2 - 6, T('12'), 'u3l9-sl u3l9-small'); lab(B, (Cp[0] + B1[0]) / 2 + 12, (Cp[1] + B1[1]) / 2 - 4, T('9'), 'u3l9-sl u3l9-small'); lab(B, (Cp[0] + B2[0]) / 2 - 10, (Cp[1] + B2[1]) / 2 + 6, T('9'), 'u3l9-sl u3l9-small');
  }
  const f8 = document.getElementById('u3l9-fig8');
  if (f8) {
    // the booklet's figure, to scale: A(−226.2, 0), B(−106.2, 0), F(0, 0), T(0, 135.9)
    const B = new Box(f8, {}, 'u3l9-f8', 400, 214), k = 1.3;
    const Ap = [362 - 226.2 * k, 194], Bp = [362 - 106.2 * k, 194], Fp = [362, 194], Tp = [362, 194 - 135.9 * k];
    svgEl('path', { d: `M${Ap.join(' ')}L${Fp.join(' ')}L${Tp.join(' ')}Z`, fill: 'none', stroke: INK, 'stroke-width': 2.4, 'stroke-linejoin': 'round' }, B.svg);
    svgEl('path', { d: `M${Bp.join(' ')}L${Tp.join(' ')}`, stroke: INK, 'stroke-width': 2.2, fill: 'none' }, B.svg);
    rightMark(B.svg, Fp, Ap, Tp, 11, { color: INK });
    [['A', Ap, 0, 13], ['B', Bp, 0, 13], ['F', Fp, 0, 13], ['T', Tp, 0, -12]].forEach(([n, p, dx, dy]) => lab(B, p[0] + dx, p[1] + dy, T(n), 'u3l9-vl u3l9-small'));
    lab(B, (Ap[0] + Bp[0]) / 2, Ap[1] + 13, '120 m', 'u3l9-sl u3l9-small'); lab(B, Ap[0] + 50, Ap[1] - 10, T('31^\\circ'), 'u3l9-al u3l9-small'); lab(B, Bp[0] + 36, Bp[1] - 14, T('52^\\circ'), 'u3l9-al u3l9-small');
  }
}

/* =============================== Stand Up Break =============================== */
const SPEC = [[30, '\\frac{1}{2}', '\\frac{\\sqrt3}{2}', '\\frac{\\sqrt3}{3}'], [45, '\\frac{\\sqrt2}{2}', '\\frac{\\sqrt2}{2}', '1'], [60, '\\frac{\\sqrt3}{2}', '\\frac{1}{2}', '\\sqrt3']];
const neg = (s) => (s.startsWith('-') ? s.slice(1) : '-' + s);
standup('u3l9', {
  intro: 'At your whiteboard: sketch it first, then answer. Calculator in Degree mode; exact values stay exact.',
  levels: {
    BEG: (r) => {
      if (r.chance(0.5)) {
        const q = r.int(1, 4), ref = r.int(11, 79), th = [0, ref, 180 - ref, 180 + ref, 360 - ref][q];
        return { text: 'State the quadrant and the reference angle. Then give the other three angles from 0° to 360° with the same reference angle.', q: `\\theta=${th}^\\circ`,
          a: [`\\text{Q${['', 'I', 'II', 'III', 'IV'][q]}},\\ \\ ${ruleTex(th)}`, `\\text{same }\\theta_R:\\ ${[ref, 180 - ref, 180 + ref, 360 - ref].filter((t) => t !== th).map((t) => t + '^\\circ').join(',\\ ')}`] };
      }
      const [ref, s, c, t] = r.pick(SPEC), q = r.int(2, 4), f = r.pick(['sin', 'cos', 'tan']), th = [0, ref, 180 - ref, 180 + ref, 360 - ref][q];
      const base = { sin: s, cos: c, tan: t }[f], sg = SIGN[f][q] > 0, val = sg ? base : neg(base);
      return { text: '<b>No calculator.</b> Determine the exact value.', q: `\\${f}${th}^\\circ`, a: [`\\text{Q${['', 'I', 'II', 'III', 'IV'][q]}},\\ \\theta_R=${ref}^\\circ,\\ \\${f}\\ ${sg ? '+' : '-'}`, `\\${f}${th}^\\circ=${val}`] };
    },
    PRG: (r) => {
      if (r.chance(0.5)) {
        const trip = r.pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]]), sx = r.sign(), sy = r.sign(), sw = r.chance(0.5);
        const x = sx * (sw ? trip[1] : trip[0]), y = sy * (sw ? trip[0] : trip[1]), rr = trip[2], th = (deg(Math.atan2(y, x)) + 360) % 360, ref = refOf(th);
        const fr = (n, d) => (n < 0 ? `-\\frac{${-n}}{${d}}` : `\\frac{${n}}{${d}}`), tn = (n, d) => fr(n * Math.sign(d), Math.abs(d));
        return { text: `The point is on the terminal arm of ${T('\\theta')}. Determine ${T('r')}, the exact values of the three primary ratios, and ${T('\\theta')} to the nearest tenth of a degree.`, q: `P(${x},\\,${y})`,
          a: [`r=\\sqrt{${x * x}+${y * y}}=${rr}`, `\\sin\\theta=${fr(y, rr)},\\ \\cos\\theta=${fr(x, rr)},\\ \\tan\\theta=${tn(y, x)}`, `\\theta_R=\\tan^{-1}\\left(\\frac{${Math.abs(y)}}{${Math.abs(x)}}\\right)\\approx${fx(ref)}^\\circ,\\ \\ \\theta\\approx${fx(th)}^\\circ`] };
      }
      const f = r.pick(['sin', 'cos', 'tan']), v = (f === 'tan' ? r.int(2, 40) / 10 : r.int(10, 95) / 100) * r.sign();
      const ref = r1(f === 'sin' ? asinD(Math.abs(v)) : f === 'cos' ? acosD(Math.abs(v)) : atanD(Math.abs(v)));
      const quads = { sin: v > 0 ? [1, 2] : [3, 4], cos: v > 0 ? [1, 4] : [2, 3], tan: v > 0 ? [1, 3] : [2, 4] }[f], pl = (q) => [0, ref, 180 - ref, 180 + ref, 360 - ref][q];
      return { text: `Solve for ${T('0^\\circ\\le\\theta<360^\\circ')}, to the nearest tenth of a degree.`, q: `\\${f}\\theta=${v}`,
        a: [`\\theta_R=\\${f}^{-1}(${Math.abs(v)})\\approx${fx(ref)}^\\circ`, `\\${f}\\ ${v > 0 ? '+' : '-'}:\\ \\text{Q${['', 'I', 'II', 'III', 'IV'][quads[0]]}, Q${['', 'I', 'II', 'III', 'IV'][quads[1]]}}`, `\\theta=${quads.map((q) => fx(pl(q)) + '^\\circ').join(',\\ ')}`] };
    },
    MAS: (r) => {
      const kind = r.int(0, 2);
      if (kind === 0) {
        const b = r.int(6, 20), c = r.int(6, 20), A = r.int(25, 130), a = sas(b, c, A);
        return { text: `In ${T('\\triangle ABC')}, two sides and the angle between them are given. Choose the law and determine ${T('a')} to the nearest tenth.`, q: `b=${b},\\ \\ c=${c},\\ \\ \\angle A=${A}^\\circ`,
          a: ['\\text{SAS: cosine law}', `a^2=${b}^2+${c}^2-2(${b})(${c})\\cos${A}^\\circ\\approx${fx(a * a, 2)}`, `a\\approx${fx(a)}`] };
      }
      if (kind === 1) {
        const A = r.int(30, 70), B = r.int(30, 70), a = r.int(8, 25), C = 180 - A - B, b = a * sinD(B) / sinD(A);
        return { text: `In ${T('\\triangle ABC')}, choose the law and determine ${T('b')} to the nearest tenth.`, q: `\\angle A=${A}^\\circ,\\ \\ \\angle C=${C}^\\circ,\\ \\ a=${a}`,
          a: [`\\angle B=180^\\circ-${A}^\\circ-${C}^\\circ=${B}^\\circ`, `\\text{full pair }(a,\\ \\angle A)\\text{: sine law}`, `b=\\dfrac{${a}\\sin${B}^\\circ}{\\sin${A}^\\circ}\\approx${fx(b)}`] };
      }
      const A = r.int(25, 60), b = r.int(10, 20), hh = b * sinD(A), want = r.int(0, 2);
      const lo2 = Math.floor(hh) + 1, hi2 = b - 1;
      const a = want === 0 ? Math.max(1, Math.ceil(hh) - 1 - r.int(0, 1)) : want === 2 && lo2 <= hi2 ? r.int(lo2, hi2) : b + r.int(0, 4);
      const n = a < hh ? 0 : a < b ? 2 : 1;
      return { text: `How many triangles are possible? Show the comparison you used.`, q: `\\angle A=${A}^\\circ,\\ \\ a=${a},\\ \\ b=${b}`,
        a: [`h=${b}\\sin${A}^\\circ\\approx${fx(hh, 2)}`, n === 0 ? `a<h:\\ \\text{no triangle}` : n === 2 ? `h<a<b:\\ \\text{two triangles}` : `a\\ge b:\\ \\text{one triangle}`] };
    }
  }
});

/* =============================== mount =============================== */
staticFigs();
export const explainers = mountExplainers({ castRecap, ambiguous, solveTrig, toolSorter });
export const _test = { CR_CH, AM, ST, SORT, triPts, refOf, quadOf };
