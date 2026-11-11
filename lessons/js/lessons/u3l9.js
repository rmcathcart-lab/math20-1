/* Math 20-1 · Unit 3 · Lesson 9 — Unit 3 Review.
 * Warm-up (The Mystery Triangle: clue cards ∠A = 30°, b = 10 cm, then a; h = 10 sin 30° = 5 decides whether a fixes
 * no, one or two triangles; the big one: a = 7 gives two), and the explainers:
 *   castRecap (terminal arm sweeping round, reference angle wedge, CAST letters and sign stickers; Example 1(a), 1(b),
 *     1(c) and 4(a) checks), exactTable (the two special triangles fill the exact-value table; Example 4(b) check),
 *   lawsRecap (sine law with matching side–angle pairs, cosine law for SSS, area as ½ab sin C with the outside height;
 *     Example 6 checks), ambiguous (side a swings from C and hits the base ray 0, 1 or 2 times, compared with
 *     h = b sin A, with the table lighting up; Example 7 checks and a review question),
 *   whichLaw (the "which law?" decision chart lights its path; a small sketch of the givens and the first equation),
 *   pointRatios (point P, reference triangle, r, signs, θ_R and θ; Example 2 and 3 checks),
 *   solveTrig (unit circle: a height, a sideways distance or a slope meets the circle twice; θ_R from the inverse key or
 *     a special triangle, quadrants from CAST; Examples 4(c) and 5 checks),
 *   toolSorter (star: triangle cards with their given parts highlighted are dealt and dropped into four bins: primary
 *     ratios, sine law, cosine law, ambiguous with the triangle count), problemSolve (Example 8: two triangles; bearings).
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

/* =============================== warm-up: The Mystery Triangle =============================== */
/* Three clue cards: ∠A = 30°, b = 10 cm, a = ? The closest the ray gets to C is h = 10 sin 30° = 5 cm, so
 * a = 4 gives no triangle, a = 5 one (right), a = 7 two, a = 12 one. */
function mountMystery() {
  const host = document.getElementById('u3l9-myst'); if (!host) return;
  const W = Math.max(540, Math.min(640, host.clientWidth || 600)), H = 224, s = 24, A = 30, b = 10;
  const B = new Box(host, {}, 'u3l9-mbox', W, H);
  const Ap = [64, 196], P = (x, y) => [Ap[0] + x * s, Ap[1] - y * s], Cx = b * cosD(A), hh = b * sinD(A), Cp = P(Cx, hh);
  svgEl('rect', { x: 0, y: 0, width: W, height: H, rx: 16, fill: '#fbf7ef' }, B.svg);
  const g1 = svgEl('g', {}, B.svg), g2 = svgEl('g', {}, B.svg), gT = svgEl('g', {}, B.svg), g3 = svgEl('g', {}, B.svg);
  // clue 1: the angle and the ray
  svgEl('line', { x1: Ap[0], y1: Ap[1], x2: W - 16, y2: Ap[1], stroke: INK, 'stroke-width': 3 }, g1); arrowHead(g1, W - 12, Ap[1], 1, 0, { color: INK, width: 3 });
  svgEl('line', { x1: Ap[0], y1: Ap[1], x2: P(13, 13 * Math.tan(rad(A)))[0], y2: P(13, 13 * Math.tan(rad(A)))[1], stroke: '#c9c3b5', 'stroke-width': 2.5, 'stroke-dasharray': '7 6' }, g1);
  angleArc(g1, Ap, P(5, 0), Cp, 46, { color: CR, width: 3 });
  lab(B, Ap[0] + 74, Ap[1] - 18, T(cR('30^\\circ')), 'u3l9-al'); lab(B, Ap[0] - 4, Ap[1] + 20, T('A'), 'u3l9-vl');
  // clue 2: side b and C, with the height
  svgEl('path', { d: `M${Ap.join(' ')}L${Cp.join(' ')}`, stroke: CT, 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, g2);
  svgEl('circle', { cx: Cp[0], cy: Cp[1], r: 6, fill: CT }, g2);
  lab(B, Cp[0] - 4, Cp[1] - 20, T('C'), 'u3l9-vl'); lab(B, (Ap[0] + Cp[0]) / 2 - 18, (Ap[1] + Cp[1]) / 2 - 16, T('b=10'), 'u3l9-sl');
  const Fp = P(Cx, 0);
  svgEl('path', { d: `M${Cp.join(' ')}L${Fp.join(' ')}`, stroke: CR, 'stroke-width': 2.4, 'stroke-dasharray': '6 5', fill: 'none' }, g2);
  rightMark(g2, Fp, Cp, P(20, 0), 11, { color: CR });
  lab(B, Fp[0] + 8, (Cp[1] + Fp[1]) / 2, T(cR('h=5')), 'u3l9-sl', 'e');
  const els = [g1, g2, g3, gT]; const lab1 = [...B.html.children];
  const set2 = lab1.slice(2, 5); const set1 = lab1.slice(0, 2);
  const msg = lab(B, W - 18, 22, '', 'u3l9-mmsg', 'w'), qm = lab(B, W / 2, H / 2, '?', 'u3l9-mq0');
  let step = 0, curA = null;
  const c = liveCtx();
  const showA = async (a) => {
    curA = a; g3.innerHTML = ''; gT.innerHTML = '';
    const disc = a * a - hh * hh, sq = disc > 1e-9 ? Math.sqrt(disc) : 0, tangent = Math.abs(disc) < 1e-9, reach = disc > -1e-9;
    const ph = reach ? (tangent ? 0 : acosD(hh / a)) : 40, R = a * s;
    const arc = svgEl('path', { class: 'bk-stroke', d: arcD(Cp[0], Cp[1], R, -90 - Math.min(ph + 12, 80), -90 + Math.min(ph + 12, 80)), stroke: PK, 'stroke-width': 2.4, 'stroke-dasharray': '6 6', fill: 'none' }, g3);
    const hits = reach ? (tangent ? [Cx] : [Cx + sq, Cx - sq].filter((x) => x > 1e-6)) : [];
    hits.forEach((x, i) => {
      const p = P(x, 0);
      svgEl('path', { d: `M${Ap.join(' ')}L${p.join(' ')}L${Cp.join(' ')}Z`, fill: i ? '#f6dccb' : '#cfe0fb', 'fill-opacity': 0.6 }, gT);
      svgEl('path', { d: `M${Cp.join(' ')}L${p.join(' ')}`, stroke: PK, 'stroke-width': 3.5, fill: 'none', 'stroke-dasharray': i ? '9 6' : '' }, g3);
      svgEl('circle', { cx: p[0], cy: p[1], r: 7, fill: PK, stroke: '#fff', 'stroke-width': 2 }, g3);
    });
    if (!reach) { const e = [Cp[0] + R * sinD(18), Cp[1] + R * cosD(18)]; svgEl('path', { d: `M${Cp.join(' ')}L${e.join(' ')}`, stroke: PK, 'stroke-width': 3.5, fill: 'none' }, g3); }
    const n = hits.length;
    msg.innerHTML = `${T(cK('a=' + a))}: <b>${n === 0 ? 'no triangle' : n === 1 ? (tangent ? 'one (right) triangle' : 'one triangle') : 'two triangles!'}</b>`;
    document.querySelectorAll('[data-u3l9-a]').forEach((btn) => btn.classList.toggle('on', Number(btn.dataset.u3l9A) === a));
    await drawIn(arc, 700, c);
  };
  const vis = (k) => { step = k; g1.style.opacity = k >= 1 ? 1 : 0; set1.forEach((e) => { e.style.opacity = k >= 1 ? 1 : 0; }); g2.style.opacity = k >= 2 ? 1 : 0; set2.forEach((e) => { e.style.opacity = k >= 2 ? 1 : 0; });
    document.querySelectorAll('.u3l9-clue').forEach((cd, i) => cd.classList.toggle('open', i < k)); qm.style.opacity = k ? 0 : 1; };
  const reset = () => { curA = null; g3.innerHTML = ''; gT.innerHTML = ''; msg.innerHTML = ''; document.querySelectorAll('[data-u3l9-a]').forEach((b2) => b2.classList.remove('on')); vis(0); };
  reset(); void els;
  document.querySelectorAll('.u3l9-clue').forEach((cd, i) => cd.addEventListener('click', () => { if (i < 2) vis(Math.max(step, i + 1)); else { vis(2); showA(12); } }));
  document.querySelectorAll('[data-u3l9-a]').forEach((btn) => btn.addEventListener('click', () => { vis(2); showA(Number(btn.dataset.u3l9A)); }));
  const r = document.getElementById('u3l9-wreset'); if (r) r.addEventListener('click', reset);
}

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

/* =============================== explainer: the exact-value table =============================== */
const XT_COLS = [0, 30, 45, 60, 90, 180, 270];
const XT_VAL = {
  sin: ['0', '\\frac{1}{2}', '\\frac{\\sqrt2}{2}', '\\frac{\\sqrt3}{2}', '1', '0', '-1'],
  cos: ['1', '\\frac{\\sqrt3}{2}', '\\frac{\\sqrt2}{2}', '\\frac{1}{2}', '0', '-1', '0'],
  tan: ['0', '\\frac{\\sqrt3}{3}', '1', '\\sqrt3', '\\text{undef.}', '0', '\\text{undef.}']
};
function xTable(stage, x, y, w) {
  const t = add(stage, h('table', 'u3l9-xt'), x, y); t.style.width = w + 'px';
  t.innerHTML = `<tr><th>${T('\\theta')}</th>${XT_COLS.map((a) => `<th>${T(a + '^\\circ')}</th>`).join('')}</tr>` +
    ['sin', 'cos', 'tan'].map((f) => `<tr><th>${T('\\' + f + '\\theta')}</th>${XT_VAL[f].map((v, j) => `<td data-f="${f}" data-j="${j}"><span class="u3l9-cv">${T(v)}</span></td>`).join('')}</tr>`).join('');
  const cell = (f, a) => t.querySelector(`td[data-f="${f}"][data-j="${XT_COLS.indexOf(a)}"]`);
  return { t, cell, hideAll() { t.querySelectorAll('.u3l9-cv').forEach(hide); },
    async col(c, a) { for (const f of ['sin', 'cos', 'tan']) { const cv = cell(f, a).firstChild; await show(c, cv); } },
    hl(f, a, on = true) { const td = cell(f, a); td.classList.toggle('hl', on); return td; } };
}
const exactTable = {
  title: 'Exact values from the special triangles',
  height: 430,
  minW: 960,
  choices: [{ v: 'build', label: 'Build the table' }, { v: 'ex4b', label: 'Example 4(b) check' }],
  intro: 'No calculator: two triangles hold every exact value. Press <b>Next</b>.',
  make(stage, k, ex) {
    const W = ex.W, TX = 372, TW = W - TX - 2, XT = xTable(stage, TX, 6, TW);
    // left: the two triangles
    const B1 = new Box(stage, { x: 0, y: 0 }, 'u3l9-stbox', 356, 200), B2 = new Box(stage, { x: 0, y: 214 }, 'u3l9-stbox', 356, 214);
    const sq = 132, x0 = 70, y0 = 176, sqG = svgEl('g', {}, B1.svg);
    svgEl('rect', { x: x0, y: y0 - sq, width: sq, height: sq, fill: 'none', stroke: '#c9c3b5', 'stroke-width': 2.5, 'stroke-dasharray': '7 6' }, sqG);
    const t45 = svgEl('path', { d: `M${x0} ${y0}L${x0 + sq} ${y0}L${x0 + sq} ${y0 - sq}Z`, fill: '#f6eef1', stroke: INK, 'stroke-width': 3.2, 'stroke-linejoin': 'round' }, B1.svg);
    rightMark(B1.svg, [x0 + sq, y0], [x0, y0], [x0 + sq, y0 - sq], 13, { color: INK });
    const g45 = [lab(B1, x0 + sq / 2, y0 + 16, T('1'), 'u3l9-stl'), lab(B1, x0 + sq + 16, y0 - sq / 2, T('1'), 'u3l9-stl'), lab(B1, x0 + sq / 2 - 20, y0 - sq / 2 - 14, T(cK('\\sqrt2')), 'u3l9-stl'),
      lab(B1, x0 + 40, y0 - 13, T(cR('45^\\circ')), 'u3l9-stl'), lab(B1, x0 + sq - 14, y0 - sq + 42, T(cR('45^\\circ')), 'u3l9-stl')];
    angleArc(B1.svg, [x0, y0], [x0 + sq, y0], [x0 + sq, y0 - sq], 24, { color: CR }); angleArc(B1.svg, [x0 + sq, y0 - sq], [x0, y0], [x0 + sq, y0], 24, { color: CR });
    lab(B1, 268, 30, '<b>45°–45°–90°</b>', 'u3l9-stt');
    const s2 = 78, bx = 40, by = 184, hgt = 2 * s2 * Math.sqrt(3) / 2, apex = [bx + 2 * s2 / 2 + s2 / 2 * 0, by - hgt];
    const eq = svgEl('path', { d: `M${bx} ${by}L${bx + 2 * s2} ${by}L${bx + s2} ${by - hgt}Z`, fill: 'none', stroke: '#c9c3b5', 'stroke-width': 2.5, 'stroke-dasharray': '7 6' }, B2.svg);
    const t30 = svgEl('path', { d: `M${bx + s2} ${by}L${bx + 2 * s2} ${by}L${bx + s2} ${by - hgt}Z`, fill: '#f6eef1', stroke: INK, 'stroke-width': 3.2, 'stroke-linejoin': 'round' }, B2.svg);
    rightMark(B2.svg, [bx + s2, by], [bx + 2 * s2, by], [bx + s2, by - hgt], 12, { color: INK });
    angleArc(B2.svg, [bx + 2 * s2, by], [bx + s2, by], [bx + s2, by - hgt], 24, { color: CR }); angleArc(B2.svg, [bx + s2, by - hgt], [bx + s2, by], [bx + 2 * s2, by], 30, { color: CR });
    const g30 = [lab(B2, bx + 1.5 * s2, by + 15, T('1'), 'u3l9-stl'), lab(B2, bx + 1.5 * s2 + 22, by - hgt / 2 - 6, T('2'), 'u3l9-stl'), lab(B2, bx + s2 - 22, by - hgt / 2, T(cK('\\sqrt3')), 'u3l9-stl'),
      lab(B2, bx + 2 * s2 - 40, by - 14, T(cR('60^\\circ')), 'u3l9-stl'), lab(B2, bx + s2 + 13, by - hgt + 48, T(cR('30^\\circ')), 'u3l9-stl'), lab(B2, bx + s2 / 2 - 4, by - hgt / 2 - 8, T('2'), 'u3l9-stl u3l9-stg'), lab(B2, bx + s2 / 2, by + 15, T('1'), 'u3l9-stl u3l9-stg')];
    lab(B2, 280, 30, '<b>30°–60°–90°</b>', 'u3l9-stt');
    // under the table: the quadrantal points / the work
    const PY = 214, Pn = panel(stage, TX, PY, TW, 214, '', 'u3l9-xwork');
    if (k === 'build') {
      XT.hideAll(); [t45, sqG, t30, eq].forEach(hide); g45.concat(g30).forEach(hide);
      [...B1.svg.querySelectorAll('.bk-arc, .bk-rmark')].concat([...B2.svg.querySelectorAll('.bk-arc, .bk-rmark')]).forEach(hide);
      const Q = new Plane(Pn, { x: 6, y: 6, size: 200, unit: 70, R: 90, letters: false, degs: false });
      const qd = [[1, 0, '(1,\\,0)', 'e', 0], [0, 1, '(0,\\,1)', 'e', 90], [-1, 0, '(-1,\\,0)', 'w', 180], [0, -1, '(0,\\,-1)', 'e', 270]].map(([x, y, t, p]) => { const d = Q.dot(x, y, T(t), { r: 6, pos: p, dx: p === 'w' ? -6 : 8, dy: y > 0 ? 12 : y < 0 ? -12 : -14 }); hide(d); hide(d.label); return d; });
      svgEl('circle', { cx: 100, cy: 100, r: 70, fill: 'none', stroke: '#c9c3b5', 'stroke-width': 2, 'stroke-dasharray': '5 5' }, Q.gRot);
      const ql = hide(add(Pn, h('div', 'u3l9-xq', `${T('r=1')}: ${T('\\sin\\theta=y')}, ${T('\\cos\\theta=x')}, ${T('\\tan\\theta=\\frac{y}{x}')}<br>${T('x=0')} at ${T('90^\\circ')}, ${T('270^\\circ')}: ${T('\\tan')} is <b>undefined</b>`), 222, 30));
      const S = (els) => (c) => Promise.all(els.map((e) => show(c, e)));
      return [
        { cap: `A square with sides 1, cut along its diagonal: two ${T('45^\\circ')}–${T('45^\\circ')}–${T('90^\\circ')} triangles. The diagonal is ${T(cK('\\sqrt{1^2+1^2}=\\sqrt2'))}.`, run: async (c) => { await show(c, sqG); await show(c, t45); await S(g45.concat([...B1.svg.querySelectorAll('.bk-arc, .bk-rmark')]))(c); } },
        { cap: `Read ${T('45^\\circ')}: ${T('\\sin45^\\circ=\\frac{1}{\\sqrt2}=\\frac{\\sqrt2}{2}')}, ${T('\\cos45^\\circ=\\frac{\\sqrt2}{2}')}, ${T('\\tan45^\\circ=\\frac{1}{1}=1')}.`, run: (c) => XT.col(c, 45) },
        { cap: `An equilateral triangle with sides 2 (every angle ${T('60^\\circ')}), cut in half: sides 1, 2 and ${T(cK('\\sqrt{2^2-1^2}=\\sqrt3'))}.`, run: async (c) => { await show(c, eq); await show(c, t30); await S(g30.concat([...B2.svg.querySelectorAll('.bk-arc, .bk-rmark')]))(c); } },
        { cap: `From ${T('30^\\circ')}: opposite 1, adjacent ${T('\\sqrt3')}, hypotenuse 2. ${T('\\sin30^\\circ=\\frac12')}, ${T('\\cos30^\\circ=\\frac{\\sqrt3}{2}')}, ${T('\\tan30^\\circ=\\frac{1}{\\sqrt3}=\\frac{\\sqrt3}{3}')}.`, run: (c) => XT.col(c, 30) },
        { cap: `From ${T('60^\\circ')}: opposite ${T('\\sqrt3')}, adjacent 1. ${T('\\sin60^\\circ=\\frac{\\sqrt3}{2}')}, ${T('\\cos60^\\circ=\\frac12')}, ${T('\\tan60^\\circ=\\sqrt3')}.`, run: (c) => XT.col(c, 60) },
        { cap: `Quadrantal angles: the points ${T('(1,0)')}, ${T('(0,1)')}, ${T('(-1,0)')}, ${T('(0,-1)')} with ${T('r=1')}. ${T('\\tan=\\frac{y}{x}')} is undefined when ${T('x=0')}.`, run: async (c) => { for (const d of qd) { await pop(c, d); show(c, d.label); } await show(c, ql); for (const a of [0, 90, 180, 270]) await XT.col(c, a); } }
      ];
    }
    // Example 4(b)
    const L = [line(Pn, T('2\\sin150^\\circ-\\tan^2225^\\circ+\\cos180^\\circ'), 'u3l9-x4h'),
      line(Pn, `${T('2\\sin150^\\circ')}: QII, ${T(cR('\\theta_R=30^\\circ'))}, sin + ${T('\\Rightarrow 2\\left(\\frac12\\right)=1')}`),
      line(Pn, `${T('\\tan^2225^\\circ=(\\tan225^\\circ)^2')}: QIII, ${T(cR('\\theta_R=45^\\circ'))}, tan + ${T('\\Rightarrow(1)^2=1')}`),
      line(Pn, `${T('\\cos180^\\circ')}: the point ${T('(-1,\\,0)')} ${T('\\Rightarrow -1')}`),
      line(Pn, T('=1-1+(-1)=\\boldsymbol{-1}'), 'u3l9-x4a')];
    L.slice(1).forEach(hide);
    const stp = hide(stamp(stage, '✓', { x: W - 70, y: 380 }));
    return [
      { cap: `${T('2\\sin150^\\circ')}: ${T('150^\\circ')} is in QII with ${T(cR('\\theta_R=30^\\circ'))}, and sin is positive there (<b>S</b>). ${T('\\sin150^\\circ=\\sin30^\\circ=\\frac12')}, so ${T('2\\left(\\frac12\\right)=1')}.`, run: async (c) => { XT.hl('sin', 30); await show(c, L[1]); } },
      { cap: `${T('\\tan^2225^\\circ')} means ${T('(\\tan225^\\circ)^2')}. QIII, ${T(cR('\\theta_R=45^\\circ'))}, tan positive (<b>T</b>): ${T('\\tan225^\\circ=1')}, squared: 1.`, run: async (c) => { XT.hl('tan', 45); await show(c, L[2]); } },
      { cap: `${T('\\cos180^\\circ')}: quadrantal, the point ${T('(-1,\\,0)')} with ${T('r=1')}: ${T('\\cos180^\\circ=-1')}.`, run: async (c) => { XT.hl('cos', 180); await show(c, L[3]); } },
      { cap: `Put it together: ${T('1-1+(-1)=-1')}.`, run: async (c) => { await show(c, L[4]); stp.style.opacity = 1; await stampIn(c, stp); } }
    ];
  }
};

/* =============================== explainer: sine law, cosine law, area =============================== */
const lawsRecap = {
  title: 'Sine law, cosine law, area',
  height: 420,
  minW: 940,
  capH: 84,
  choices: [{ v: 'sin', label: 'Sine law: Example 6(a)' }, { v: 'cos', label: 'Cosine law: 6(b)' }, { v: 'area', label: 'Area: 6(c)' }],
  ask: (k) => ({ sin: `(a) In ${T('\\triangle PQR')}, ${T('\\angle P=48^\\circ')}, ${T('\\angle Q=71^\\circ')} and ${T('p=15.2')} cm. Determine ${T('r')}.`, cos: '(b) A triangle has sides 7 m, 9 m and 13 m. Determine its largest angle.', area: '(c) Determine the area of the triangle in (b) to the nearest square metre.' }[k]),
  make(stage, k, ex) {
    const W = ex.W, FW = 520, PX = FW + 16, Pn = panel(stage, PX, 2, W - PX - 2, 414, 'Work', 'u3l9-work');
    const steps = [];
    if (k === 'sin') {
      const R = 180 - 48 - 71, p = 15.2, q = p * sinD(71) / sinD(48), r = p * sinD(R) / sinD(48);
      const F = new TriFig(stage, { x: 0, y: 2, width: FW, height: 414, pts: triPts(['P', 'Q', 'R'], { p, q, r }), pad: 52 });
      const sp = hide(F.sideLab('p', T('p=15.2'))), sr = hide(F.sideLab('r', T('r=\\ ?'))), aP = F.ang('P', T('48^\\circ')), aQ = F.ang('Q', T('71^\\circ')), aR = F.ang('R', T('61^\\circ'));
      [aP, aQ, aR].forEach((a) => { hide(a); hide(a.label); });
      const L = [line(Pn, `${T('\\angle R=180^\\circ-48^\\circ-71^\\circ=61^\\circ')}`), line(Pn, `Full pair: ${T(cS('p'))} and ${T(cS('\\angle P'))}: <b>sine law</b>`),
        line(Pn, T(`\\dfrac{${cK('r')}}{\\sin ${cK('61^\\circ')}}=\\dfrac{${cS('15.2')}}{\\sin ${cS('48^\\circ')}}`), 'u3l9-big'), line(Pn, T('r=\\dfrac{15.2\\sin61^\\circ}{\\sin48^\\circ}'), 'u3l9-big'), line(Pn, T(`r\\approx${fx(r)}\\text{ cm}`), 'u3l9-wans')].map(hide);
      const stp = hide(stamp(stage, '✓', { x: W - 70, y: 370 }));
      steps.push({ cap: `Mark what is given: ${T('\\angle P=48^\\circ')}, ${T('\\angle Q=71^\\circ')} and the side ${T('p=15.2')} cm (opposite ${T('P')}). We want ${T('r')}.`, run: async (c) => { for (const a of [aP, aQ]) { await show(c, a); await show(c, a.label); } await show(c, sp); await show(c, sr); } });
      steps.push({ cap: `Two angles known, so the third is free: ${T('\\angle R=180^\\circ-48^\\circ-71^\\circ=61^\\circ')}.`, run: async (c) => { await show(c, aR); await show(c, aR.label); await show(c, L[0]); } });
      steps.push({ cap: `${T(cS('p'))} and ${T(cS('\\angle P'))} are opposite each other: a <b>full pair</b>. A full pair means the <b>sine law</b>.`, run: async (c) => { F.paint('p', CS); F.paintAng('P', CS); await pulse(c, sp, 1.2); await show(c, L[1]); } });
      steps.push({ cap: `The side we want, ${T(cK('r'))}, pairs with ${T(cK('\\angle R=61^\\circ'))}: ${T(`\\dfrac{${cK('r')}}{\\sin61^\\circ}=\\dfrac{${cS('15.2')}}{\\sin48^\\circ}`)}.`, run: async (c) => { F.paint('r', PK); F.paintAng('R', PK); await show(c, L[2]); } });
      steps.push({ cap: `Multiply both sides by ${T('\\sin61^\\circ')}: ${T('r=\\dfrac{15.2\\sin61^\\circ}{\\sin48^\\circ}\\approx' + fx(r))} cm.`, run: async (c) => { await show(c, L[3]); await show(c, L[4]); sr.innerHTML = T(cK('r\\approx' + fx(r))); await pop(c, sr); stp.style.opacity = 1; await stampIn(c, stp); } });
      return steps;
    }
    // the 7-9-13 triangle: C at the origin, B on the x-axis (a = CB = 7), A up-left (b = CA = 9)
    const a = 7, b = 9, cc = 13, Cang = sssAng(cc, a, b), cosC = (a * a + b * b - cc * cc) / (2 * a * b);
    const pts = { A: [b * cosD(Cang), b * sinD(Cang)], B: [a, 0], C: [0, 0] };
    const F = new TriFig(stage, { x: 0, y: 2, width: FW, height: 414, pts, extra: [[b * cosD(Cang), 0]], pad: 54, padB: 60 });
    const sa = F.sideLab('a', T('7')), sb = F.sideLab('b', T('9')), sc = F.sideLab('c', T('13'));
    if (k === 'cos') {
      const aC = F.ang('C', T('C=\\ ?')); hide(aC); hide(aC.label);
      const L = [line(Pn, 'SSS: no full pair, so the <b>cosine law</b>'), line(Pn, 'largest angle: opposite the longest side, 13 m'),
        line(Pn, T('\\cos C=\\dfrac{7^2+9^2-13^2}{2(7)(9)}'), 'u3l9-big'), line(Pn, T('=\\dfrac{-39}{126}\\approx' + fx(cosC, 4)), 'u3l9-big'), line(Pn, T('C\\approx108^\\circ\\ \\text{(obtuse)}'), 'u3l9-wans')].map(hide);
      const stp = hide(stamp(stage, '✓', { x: W - 70, y: 370 }));
      steps.push({ cap: `Three sides and <b>no</b> angles (SSS): there is no full pair, so the sine law can’t start. Use the <b>cosine law</b>.`, run: async (c) => { await pulse(c, F.el, 1.02); await show(c, L[0]); } });
      steps.push({ cap: `The largest angle is opposite the <b>longest side</b>, 13 m. Call that angle ${T('C')}, so ${T('c=13')}.`, run: async (c) => { F.paint('c', PK); await show(c, aC); await show(c, aC.label); await show(c, L[1]); } });
      steps.push({ cap: `${T('\\cos C=\\dfrac{a^2+b^2-c^2}{2ab}=\\dfrac{7^2+9^2-13^2}{2(7)(9)}=\\dfrac{-39}{126}\\approx' + fx(cosC, 4))}.`, run: async (c) => { await show(c, L[2]); await show(c, L[3]); } });
      steps.push({ cap: `A <b>negative</b> cosine means an <b>obtuse</b> angle: ${T('C=\\cos^{-1}(' + fx(cosC, 4) + ')\\approx108^\\circ')}. (${T(cosC.toFixed(4))} is ${T('\\cos108^\\circ')}, not ${T('\\cos72^\\circ')}.)`, run: async (c) => { await show(c, L[4]); aC.label.innerHTML = T(cK('C\\approx108^\\circ')); await pop(c, aC.label); stp.style.opacity = 1; await stampIn(c, stp); } });
      return steps;
    }
    // area
    const aC = F.ang('C', T('108.03^\\circ'), { color: CC });
    const Ap = F.V.A, foot = F.P(b * cosD(Cang), 0), Cp = F.V.C, Bp = F.V.B;
    const ext = hide(svgEl('path', { d: `M${Cp[0]} ${Cp[1]}L${foot[0]} ${foot[1]}`, stroke: GRAY, 'stroke-width': 2.5, 'stroke-dasharray': '7 6', fill: 'none' }, F.gExtra));
    const alt = hide(svgEl('path', { d: `M${Ap[0]} ${Ap[1]}L${foot[0]} ${foot[1]}`, stroke: CC, 'stroke-width': 3, 'stroke-dasharray': '8 6', fill: 'none' }, F.gExtra));
    const rm = hide(rightMark(F.gExtra, foot, Cp, Ap, 13, { color: CC }));
    const hl = hide(lab(F, foot[0] - 34, (Ap[1] + foot[1]) / 2, T(cC('h')), 'u3l9-sl'));
    const hh = b * sinD(Cang), area = 0.5 * a * b * sinD(Cang);
    const L = [line(Pn, `two sides ${T('a=7')}, ${T('b=9')} and the angle between them, ${T('C\\approx108.03^\\circ')} (unrounded)`), line(Pn, T(`h=9\\sin C\\approx${fx(hh, 2)}`)),
      line(Pn, T('\\text{Area}=\\tfrac12(\\text{base})(h)=\\tfrac12(7)(9\\sin C)'), ''), line(Pn, T('=\\tfrac12ab\\sin C'), 'u3l9-big'), line(Pn, T(`\\approx\\tfrac12(63)(${sinD(Cang).toFixed(4)})\\approx30\\text{ m}^2`), 'u3l9-wans')].map(hide);
    const stp = hide(stamp(stage, '✓', { x: W - 70, y: 370 }));
    steps.push({ cap: `Area needs <b>two sides and the angle between them</b>: ${T('a=7')}, ${T('b=9')} and ${T(cC('C\\approx108.03^\\circ'))} from (b). Keep the unrounded ${T('C')}.`, run: async (c) => { F.paint('a', CC); F.paint('b', CC); await pulse(c, aC.label, 1.2); await show(c, L[0]); } });
    steps.push({ cap: `The height from ${T('A')} to side ${T('a')}: ${T(cC('h=9\\sin C\\approx' + fx(hh, 2)))}. ${T('C')} is obtuse, so the height lands <b>outside</b>, on side ${T('a')} extended.`, run: async (c) => { await show(c, ext); await drawIn(alt, 700, c); alt.style.opacity = 1; await show(c, rm); await show(c, hl); await show(c, L[1]); } });
    steps.push({ cap: `${T('\\text{Area}=\\tfrac12(\\text{base})(\\text{height})=\\tfrac12(7)(9\\sin C)')}: that is ${T('\\tfrac12ab\\sin C')}.`, run: async (c) => { F.fillEl.setAttribute('fill', '#dcefe6'); await pulse(c, F.fillEl, 1); await show(c, L[2]); await show(c, L[3]); } });
    steps.push({ cap: `${T(`\\tfrac12(7)(9)\\sin C\\approx\\tfrac12(63)(${sinD(Cang).toFixed(4)})\\approx${fx(area, 2)}`)}: about <b>30 m²</b>.`, run: async (c) => { await show(c, L[4]); stp.style.opacity = 1; await stampIn(c, stp); } });
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

/* =============================== explainer: which law? (decision chart) =============================== */
const WL_NODES = {
  q1: { x: 300, y: 32, w: 330, h: 54, html: '<b>Right triangle?</b>a 90° angle you can use', cls: 'bk-diamond' },
  rt: { x: 92, y: 128, w: 170, h: 60, html: '<b>SOH CAH TOA</b>or Pythagoras', color: CP },
  q2: { x: 380, y: 128, w: 360, h: 62, html: '<b>A full pair?</b>a side and its opposite angle', cls: 'bk-diamond' },
  sl: { x: 250, y: 232, w: 190, h: 58, html: '<b>Sine law</b>', color: CS },
  cl: { x: 500, y: 232, w: 200, h: 66, html: '<b>Cosine law</b>SAS or SSS', color: CC },
  q3: { x: 250, y: 322, w: 330, h: 56, html: '<b>SSA?</b>the angle is not between the sides', cls: 'bk-diamond' },
  amb: { x: 140, y: 400, w: 200, h: 46, html: '<b>count the triangles</b>', color: CA },
  go: { x: 380, y: 400, w: 160, h: 46, html: '<b>solve</b>', color: CS }
};
const WL_EDGES = [
  { from: 'q1', to: 'rt', label: 'yes' }, { from: 'q1', to: 'q2', label: 'no' },
  { from: 'q2', to: 'sl', label: 'yes' }, { from: 'q2', to: 'cl', label: 'no' },
  { from: 'sl', to: 'q3' }, { from: 'q3', to: 'amb', label: 'yes' }, { from: 'q3', to: 'go', label: 'no' }
];
const WL = {
  e6a: { label: 'Example 6(a)', ask: `In ${T('\\triangle PQR')}, ${T('\\angle P=48^\\circ')}, ${T('\\angle Q=71^\\circ')}, ${T('p=15.2')} cm. Find ${T('r')}.`,
    path: ['q1', 'q2', 'sl', 'q3', 'go'], c1: 'No right angle.', c2: `Two angles given, so ${T('\\angle R=61^\\circ')} too. ${T('p')} is opposite ${T('\\angle P')}: a full pair.`, c3: 'Two angles and a side (AAS): not SSA.',
    eq: `\\dfrac{r}{\\sin61^\\circ}=\\dfrac{15.2}{\\sin48^\\circ}`, tri: { names: ['P', 'Q', 'R'], sides: { p: 15.2, q: 15.2 * sinD(71) / sinD(48), r: 15.2 * sinD(61) / sinD(48) }, sl: { p: '15.2', r: '?' }, al: { P: '48^\\circ', Q: '71^\\circ' } } },
  e6b: { label: '6(b)', ask: 'A triangle has sides 7 m, 9 m and 13 m. Find its largest angle.', path: ['q1', 'q2', 'cl'], c1: `No right angle (${T('7^2+9^2\\ne13^2')}).`, c2: 'Three sides, no angles: no full pair. SSS.',
    eq: `\\cos C=\\dfrac{7^2+9^2-13^2}{2(7)(9)}`, tri: { names: ['A', 'B', 'C'], sides: { a: 7, b: 9, c: 13 }, sl: { a: '7', b: '9', c: '13' }, al: { C: '?' } } },
  e7: { label: '7', ask: `${T('\\angle A=38^\\circ')}, ${T('a=9')} cm, ${T('b=12')} cm. Solve the triangle.`, path: ['q1', 'q2', 'sl', 'q3', 'amb'], c1: 'No right angle.', c2: `${T('a')} is opposite ${T('\\angle A')}: a full pair.`, c3: `${T('\\angle A')} is not between ${T('a')} and ${T('b')}: SSA.`,
    eq: `h=12\\sin38^\\circ\\approx7.39`, tri: { names: ['A', 'B', 'C'], sides: { a: 9, b: 12, c: 9 * sinD(87) / sinD(38) }, sl: { a: '9', b: '12' }, al: { A: '38^\\circ' } } },
  e8a1: { label: '8(a): △ABT', ask: `${T('\\triangle ABT')}: ${T('AB=120')} m, ${T('\\angle A=31^\\circ')}, ${T('\\angle ABT=128^\\circ')}. Find ${T('BT')}.`, path: ['q1', 'q2', 'sl', 'q3', 'go'], c1: 'No right angle.', c2: `Third angle ${T('\\angle T=21^\\circ')} is opposite ${T('AB=120')}: a full pair.`, c3: 'Two angles and a side (ASA): not SSA.',
    eq: `\\dfrac{BT}{\\sin31^\\circ}=\\dfrac{120}{\\sin21^\\circ}`, tri: { names: ['A', 'B', 'T'], sides: { t: 120, a: 120 * sinD(31) / sinD(21), b: 120 * sinD(128) / sinD(21) }, sl: { t: '120', a: '?' }, al: { A: '31^\\circ', B: '128^\\circ' } } },
  e8a2: { label: '8(a): △BFT', ask: `Right ${T('\\triangle BFT')}: ${T('BT\\approx172.46')} m, ${T('\\angle B=52^\\circ')}. Find ${T('TF')}.`, path: ['q1', 'rt'], c1: `${T('\\angle F=90^\\circ')}: a right triangle. ${T('TF')} is opposite ${T('52^\\circ')}, ${T('BT')} is the hypotenuse: SOH.`,
    eq: `TF=172.46\\sin52^\\circ`, tri: { names: ['B', 'F', 'T'], sides: { b: 172.46 * sinD(52), f: 172.46, t: 172.46 * cosD(52) }, right: 'F', sl: { f: '172.46', b: '?' }, al: { B: '52^\\circ' } } },
  e8b: { label: '8(b)', ask: `Boats: 21 km and 27 km from the dock, ${T('115^\\circ')} apart. Find the distance ${T('d')} between them.`, path: ['q1', 'q2', 'cl'], c1: 'No right angle.', c2: `${T('d')} is opposite the ${T('115^\\circ')} angle, but ${T('d')} is unknown: no full pair. SAS.`,
    eq: `d^2=21^2+27^2-2(21)(27)\\cos115^\\circ`, tri: { names: ['O', 'P', 'Q'], sides: { o: sas(21, 27, 115), p: 27, q: 21 }, sl: { p: '27', q: '21', o: '?d' }, al: { O: '115^\\circ' } } },
  sep: { sep: 'Review:' },
  surv: { label: 'Surveyor', ask: 'A triangular lot has sides 85 m and 62 m with an angle of 71° between them. Find the third side.', path: ['q1', 'q2', 'cl'], c1: 'No right angle.', c2: `The ${T('71^\\circ')} angle is opposite the unknown side: no full pair. SAS.`,
    eq: `x^2=85^2+62^2-2(85)(62)\\cos71^\\circ`, tri: { names: ['A', 'B', 'C'], sides: { a: sas(85, 62, 71), b: 85, c: 62 }, sl: { b: '85', c: '62', a: '?x' }, al: { A: '71^\\circ' } } },
  obt: { label: 'Obtuse SSA', ask: `In ${T('\\triangle XYZ')}, ${T('\\angle X=112^\\circ')}, ${T('x=11.4')} m and ${T('z=8.7')} m. Find ${T('\\angle Z')}.`, path: ['q1', 'q2', 'sl', 'q3', 'amb'], c1: 'No right angle.', c2: `${T('x')} is opposite ${T('\\angle X')}: a full pair.`, c3: `${T('\\angle X')} is not between ${T('x')} and ${T('z')}: SSA. Obtuse and ${T('x>z')}: one triangle.`,
    eq: `\\dfrac{\\sin Z}{8.7}=\\dfrac{\\sin112^\\circ}{11.4}`, tri: { names: ['X', 'Y', 'Z'], sides: { x: 11.4, z: 8.7, y: 11.4 * sinD(180 - 112 - asinD(8.7 * sinD(112) / 11.4)) / sinD(112) }, sl: { x: '11.4', z: '8.7' }, al: { X: '112^\\circ', Z: '?' } } }
};
function sketch(host, x, y, w, hh, t, o = {}) {
  const F = new TriFig(host, { x, y, width: w, height: hh, pts: triPts(t.names, t.sides, o.flip), pad: o.pad || 40 });
  for (const k in t.sl) { const v = t.sl[k], unk = v[0] === '?'; F.sideLab(k, unk ? `<span class="u3l9-unk">${v.length > 1 ? T(v.slice(1)) : '?'}</span>` : T(v), { cls: unk ? '' : 'u3l9-given' }); if (!unk) F.paint(k, CT); }
  for (const v in t.al) { const val = t.al[v]; F.ang(v, val === '?' ? '<span class="u3l9-unk">?</span>' : T(val), { color: val === '?' ? GRAY : CT, cls: val === '?' ? '' : 'u3l9-given' }); }
  if (t.right) F.ang(t.right, null, { right: true, color: INK });
  return F;
}
const whichLaw = {
  title: 'Which law?',
  height: 430,
  minW: 960,
  capH: 84,
  choices: Object.keys(WL).map((k) => (WL[k].sep ? WL[k] : { v: k, label: WL[k].label.replace('△', '△') })),
  ask: (k) => WL[k].ask,
  make(stage, k, ex) {
    const d = WL[k], W = ex.W;
    const F = new Flowchart(stage, { x: 0, y: 2, width: 600, height: 428, nodes: WL_NODES, edges: WL_EDGES, cls: 'u3l9-fc' });
    const PX = 616, Pn = panel(stage, PX, 2, W - PX - 2, 426, 'Given', 'u3l9-work');
    sketch(Pn, null, null, W - PX - 36, 178, d.tri);
    const cl = [d.c1, d.c2, d.c3].filter(Boolean).map((c) => hide(line(Pn, c, 'u3l9-wlc')));
    const eq = hide(line(Pn, T(d.eq), 'u3l9-wf ' + (d.path.includes('cl') ? 'u3l9-wfc' : d.path.includes('rt') ? 'u3l9-wfp' : 'u3l9-wfs')));
    const steps = []; const p = d.path;
    steps.push({ cap: `<b>Right triangle?</b> ${d.c1}`, run: async (c) => { await F.visit(c, 'q1'); await show(c, cl[0]); } });
    if (p[1] === 'rt') {
      steps.push({ cap: `Use the primary ratios: ${T(d.eq)}.`, run: async (c) => { await F.go(c, 'q1', 'rt'); await F.visit(c, 'rt'); await show(c, eq); } });
      return steps;
    }
    steps.push({ cap: `<b>A full pair?</b> ${d.c2}`, run: async (c) => { await F.go(c, 'q1', 'q2'); await F.visit(c, 'q2'); await show(c, cl[1]); } });
    if (p[2] === 'cl') {
      steps.push({ cap: `No full pair: the <b>cosine law</b>. ${T(d.eq)}`, run: async (c) => { await F.go(c, 'q2', 'cl'); await F.visit(c, 'cl'); await show(c, eq); } });
      return steps;
    }
    steps.push({ cap: `A full pair: the <b>sine law</b>. But first: is it SSA?`, run: async (c) => { await F.go(c, 'q2', 'sl'); await F.visit(c, 'sl'); } });
    steps.push({ cap: `<b>SSA?</b> ${d.c3}`, run: async (c) => { await F.go(c, 'sl', 'q3'); await F.visit(c, 'q3'); await show(c, cl[2]); } });
    const leaf = p[4];
    steps.push({ cap: leaf === 'amb' ? `SSA: <b>count the triangles</b> before solving. ${T(d.eq)}` : `Not SSA: one triangle. Solve with the sine law: ${T(d.eq)}.`, run: async (c) => { await F.go(c, 'q3', leaf); await F.visit(c, leaf); await show(c, eq); } });
    return steps;
  }
};

/* =============================== explainer: a point on the terminal arm =============================== */
const PR = {
  a: { label: 'Example 2(a)', x: -8, y: -15, unit: 21, num: 2, origin: [330, 60], r: '17', rHow: '\\sqrt{64+225}=17', sin: '-\\dfrac{15}{17}', cos: '-\\dfrac{8}{17}', tan: '\\dfrac{15}{8}', tR: 'tan^{-1}', refHow: '\\tan^{-1}\\!\\left(\\frac{15}{8}\\right)', thHow: '180^\\circ+61.9^\\circ=241.9^\\circ' },
  b: { label: '2(b)', x: 4, y: -6, unit: 44, num: 1, origin: [120, 100], r: '2\\sqrt{13}', rHow: '\\sqrt{16+36}=\\sqrt{52}=2\\sqrt{13}', sin: '\\dfrac{-6}{2\\sqrt{13}}=-\\dfrac{3\\sqrt{13}}{13}', cos: '\\dfrac{2\\sqrt{13}}{13}', tan: '-\\dfrac{3}{2}', refHow: '\\tan^{-1}(1.5)', thHow: '360^\\circ-56.3^\\circ=303.7^\\circ' },
  c: { label: '2(c)', x: -5, y: 0, unit: 52, num: 1, origin: [340, 220], r: '5', rHow: '5', sin: '\\dfrac{0}{5}=0', cos: '\\dfrac{-5}{5}=-1', tan: '\\dfrac{0}{-5}=0', thHow: '180^\\circ' },
  e3: { label: 'Example 3', x: -Math.sqrt(21), y: -2, unit: 38, num: 1 }
};
const pointRatios = {
  title: 'A point on the terminal arm',
  height: 444,
  minW: 940,
  capH: 84,
  choices: Object.keys(PR).map((k) => ({ v: k, label: PR[k].label })),
  ask: (k) => (k === 'e3' ? `Given ${T('\\sin\\theta=-\\frac{2}{5}')} and ${T('\\tan\\theta>0')}, find the exact values of ${T('\\cos\\theta')} and ${T('\\tan\\theta')}.` : `${T(`P(${PR[k].x},\\,${PR[k].y})`)} is on the terminal arm. Find the exact ratios and ${T('\\theta')}.`),
  make(stage, k, ex) {
    const d = PR[k], W = ex.W;
    const Pl = new Plane(stage, { x: 0, y: 2, size: 440, unit: d.unit, R: 210, grid: true, numStep: d.num, letters: k === 'e3', degs: false, origin: d.origin });
    const PX = 456, Pn = panel(stage, PX, 2, W - PX - 2, 440, '', 'u3l9-work');
    const [Px, Py] = Pl.px(d.x, d.y), [Fx, Fy] = Pl.px(d.x, 0), O = Pl.O;
    const th = (deg(Math.atan2(d.y, d.x)) + 360) % 360, ref = refOf(th), q = quadOf(th);
    const arm = Pl.arm({ len: Math.hypot(Px - O[0], Py - O[1]), thLab: (t) => T(cT('\\theta')), refLab: () => T(cR('\\theta_R')), rotR: 30, refR: 58 });
    arm.els.forEach(hide);
    const rLab = hide(lab(Pl, (O[0] + Px) / 2 + (d.y < 0 ? 18 : -18) * (d.x < 0 ? -1 : 1), (O[1] + Py) / 2 - 12, T(cT('r')), 'u3l9-leg'));
    const drop = hide(svgEl('path', { d: `M${Px} ${Py}L${Fx} ${Fy}`, stroke: GRAY, 'stroke-width': 2.5, 'stroke-dasharray': '6 5', fill: 'none' }, Pl.gTop));
    const steps = [];
    if (k === 'e3') {
      const circ = hide(svgEl('circle', { cx: O[0], cy: O[1], r: 5 * d.unit, fill: 'none', stroke: CT, 'stroke-width': 2, 'stroke-dasharray': '6 6' }, Pl.gRot));
      const yl = hide(svgEl('line', { x1: 10, y1: Pl.px(0, -2)[1], x2: Pl.S - 10, y2: Pl.px(0, -2)[1], stroke: CR, 'stroke-width': 2.2, 'stroke-dasharray': '8 6' }, Pl.gRot));
      const ghost = hide(Pl.dot(Math.sqrt(21), -2, '', { color: '#c9c3b5' }));
      const P = hide(Pl.dot(d.x, d.y, T('(-\\sqrt{21},\\,-2)'), { dx: 44, dy: 24, pos: 'c' })); hide(P.label);
      const legs = [hide(lab(Pl, (O[0] + Fx) / 2, O[1] - 14, T('x'), 'u3l9-leg')), hide(lab(Pl, Fx - 14, (Fy + Py) / 2, T('2'), 'u3l9-leg', 'w'))];
      const L = [line(Pn, `${T('\\sin<0')}: QIII or QIV. ${T('\\tan>0')}: QI or QIII. <b>Both: QIII.</b>`), line(Pn, `${T('\\sin\\theta=\\frac{y}{r}=\\frac{-2}{5}')}: ${T('y=-2')}, ${T('r=5')}`), line(Pn, T('x^2+(-2)^2=5^2\\Rightarrow x^2=21')), line(Pn, `${T('x=-\\sqrt{21}')} (negative in QIII)`),
        line(Pn, T('\\cos\\theta=-\\dfrac{\\sqrt{21}}{5}'), 'u3l9-big'), line(Pn, T('\\tan\\theta=\\dfrac{-2}{-\\sqrt{21}}=\\dfrac{2}{\\sqrt{21}}=\\dfrac{2\\sqrt{21}}{21}'), 'u3l9-big')].map(hide);
      steps.push({ cap: `${T('\\sin\\theta<0')}: QIII or QIV. ${T('\\tan\\theta>0')}: QI or QIII. Only <b>QIII</b> is on both lists (<b>T</b> in CAST).`, run: async (c) => { Pl.lightQ(3); await show(c, L[0]); } });
      steps.push({ cap: `${T('\\sin\\theta=\\frac{y}{r}=\\frac{-2}{5}')}: use ${T('y=-2')} and ${T('r=5')}. The arm meets the circle of radius 5 at height ${T('-2')}: in QIII or QIV.`, run: async (c) => { await show(c, circ); await show(c, yl); await show(c, ghost); await show(c, L[1]); } });
      steps.push({ cap: `Pythagoras: ${T('x^2+(-2)^2=5^2')}, so ${T('x^2=21')} and ${T('x=-\\sqrt{21}')} (QIII: ${T('x')} is negative). The QIV point is the wrong one.`, run: async (c) => { await show(c, L[2]); await pop(c, P); await show(c, P.label); arm.els.forEach((e) => { e.style.opacity = 1; }); await arm.to(c, th, 700); await show(c, drop); legs.forEach((l) => show(c, l)); await show(c, L[3]); } });
      steps.push({ cap: `${T('\\cos\\theta=\\frac{x}{r}=-\\frac{\\sqrt{21}}{5}')} and ${T('\\tan\\theta=\\frac{y}{x}=\\frac{-2}{-\\sqrt{21}}=\\frac{2\\sqrt{21}}{21}')} (rationalized).`, run: async (c) => { await show(c, L[4]); await show(c, L[5]); } });
      return steps;
    }
    const Pd = hide(Pl.dot(d.x, d.y, T(`P(${d.x},\\,${d.y})`), d.y === 0 ? { dx: 0, dy: -22, pos: 'c' } : {})); hide(Pd.label);
    const legs = d.y === 0 ? [] : [hide(lab(Pl, (O[0] + Fx) / 2, O[1] + (d.y < 0 ? -14 : 14), T(String(Math.abs(d.x))), 'u3l9-leg')), hide(lab(Pl, Fx + (d.x < 0 ? -14 : 14), (Fy + Py) / 2, T(String(Math.abs(d.y))), 'u3l9-leg', d.x < 0 ? 'w' : 'e'))];
    const qName = q ? `<b>${QN[q]}</b>: ${T(d.x < 0 ? 'x<0' : 'x>0')} and ${T(d.y < 0 ? 'y<0' : 'y>0')}` : 'on the <b>negative x-axis</b>: a quadrantal angle';
    const L = [line(Pn, T(`r=${d.rHow}`)), line(Pn, T(`\\sin\\theta=${d.sin}`), 'u3l9-big'), line(Pn, T(`\\cos\\theta=${d.cos}`), 'u3l9-big'), line(Pn, T(`\\tan\\theta=${d.tan}`), 'u3l9-big'),
      line(Pn, q ? T(`\\theta_R=${d.refHow}\\approx${fx(ref)}^\\circ`) : ''), line(Pn, T(`\\theta=${d.thHow}`), 'u3l9-wans')].map(hide);
    steps.push({ cap: `Plot ${T(`P(${d.x},\\,${d.y})`)}. It is ${qName}.`, run: async (c) => { await pop(c, Pd); await show(c, Pd.label); if (q) Pl.lightQ(q); } });
    if (q) steps.push({ cap: `Drop to the ${T('x')}-axis: the reference triangle has legs ${T(String(Math.abs(d.x)))} and ${T(String(Math.abs(d.y)))}.`, run: async (c) => { await show(c, drop); for (const l of legs) await show(c, l); } });
    steps.push({ cap: `${T('r=\\sqrt{x^2+y^2}=' + d.rHow)}. ${T('r')} is a distance: always positive.`, run: async (c) => { arm.els.forEach((e) => { if (e.tagName === 'line') e.style.opacity = 1; }); arm.st.rot = false; arm.st.ref = false; await arm.to(c, th, 700); await show(c, rLab); await show(c, L[0]); } });
    steps.push({ cap: `Keep the signs of ${T('x')} and ${T('y')}: ${T(`\\sin\\theta=\\tfrac{y}{r}=${d.sin.replace(/dfrac/g, 'tfrac')}`)}, ${T(`\\cos\\theta=${d.cos.replace(/dfrac/g, 'tfrac')}`)}, ${T(`\\tan\\theta=${d.tan.replace(/dfrac/g, 'tfrac')}`)}.`, run: async (c) => { for (const l of L.slice(1, 4)) await show(c, l); } });
    if (q) {
      steps.push({ cap: `The reference angle is at the origin, to the ${T('x')}-axis: ${T(cR(`\\theta_R=${d.refHow}\\approx${fx(ref)}^\\circ`))} (use the positive ratio).`, run: async (c) => { arm.st.ref = true; arm.set(th); arm.els.forEach((e) => { e.style.opacity = 1; }); arm.st.rot = false; arm.set(th); await show(c, L[4]); } });
      steps.push({ cap: `${QN[q]}: ${T(cT(`\\theta=${d.thHow}`))}.`, run: async (c) => { arm.st.rot = true; arm.set(th); await show(c, L[5]); } });
    } else {
      steps.push({ cap: `${T('P')} is on the negative ${T('x')}-axis, so ${T(cT('\\theta=180^\\circ'))}, a quadrantal angle: no reference triangle needed.`, run: async (c) => { arm.st.rot = true; arm.els.forEach((e) => { e.style.opacity = 1; }); arm.set(th); await show(c, L[5]); } });
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

/* =============================== explainer: problem solving (Example 8) =============================== */
const problemSolve = {
  title: 'Two triangles, and bearings',
  height: 430,
  minW: 940,
  capH: 84,
  choices: [{ v: 'bld', label: 'Example 8(a): the building' }, { v: 'boat', label: '8(b): two boats' }],
  ask: (k) => (k === 'bld' ? `${T('A')} and ${T('B')} are 120 m apart in line with the base ${T('F')}. Elevations of the top ${T('T')}: ${T('31^\\circ')} from ${T('A')}, ${T('52^\\circ')} from ${T('B')}. Find ${T('TF')}.` : `Boats: 14 km/h on ${T('030^\\circ')} and 18 km/h on ${T('145^\\circ')}. How far apart after 1.5 h?`),
  make(stage, k, ex) {
    const W = ex.W, FW = 590, PX = FW + 14, Pn = panel(stage, PX, 2, W - PX - 2, 426, 'Work', 'u3l9-work');
    const B = new Box(stage, { x: 0, y: 2 }, 'u3l9-psbox', FW, 426);
    const stp = hide(stamp(stage, '✓', { x: W - 70, y: 370 }));
    if (k === 'bld') {
      const BT = 120 * sinD(31) / sinD(21), TF = BT * sinD(52), BF = BT * cosD(52), AF = 120 + BF;
      const s = 2.4, Fp = [FW - 40, 380], P = (x, y) => [Fp[0] + x * s, Fp[1] - y * s];
      const Ap = P(-AF, 0), Bp = P(-BF, 0), Tp = P(0, TF);
      svgEl('rect', { x: 6, y: Fp[1], width: FW - 12, height: 30, fill: '#e8e2d6' }, B.svg);
      svgEl('rect', { x: Fp[0] - 2, y: Tp[1], width: 30, height: Fp[1] - Tp[1], fill: '#d9d3c6', stroke: '#9e978a', 'stroke-width': 2 }, B.svg);
      const tABT = hide(svgEl('path', { d: `M${Ap.join(' ')}L${Bp.join(' ')}L${Tp.join(' ')}Z`, fill: '#cfe0fb', 'fill-opacity': 0.8 }, B.svg));
      const tBFT = hide(svgEl('path', { d: `M${Bp.join(' ')}L${Fp.join(' ')}L${Tp.join(' ')}Z`, fill: '#e3d7f6', 'fill-opacity': 0.85 }, B.svg));
      const seg = (p, q, col = INK, w = 3) => svgEl('path', { d: `M${p.join(' ')}L${q.join(' ')}`, stroke: col, 'stroke-width': w, fill: 'none', 'stroke-linecap': 'round' }, B.svg);
      seg(Ap, Fp); seg(Fp, Tp); seg(Ap, Tp); const sBT = seg(Bp, Tp);
      rightMark(B.svg, Fp, Ap, Tp, 13, { color: INK });
      angleArc(B.svg, Ap, Fp, Tp, 46, { color: CR, width: 2.6 }); angleArc(B.svg, Bp, Fp, Tp, 34, { color: CR, width: 2.6 });
      const a128 = hide(angleArc(B.svg, Bp, Tp, Ap, 26, { color: CS, width: 2.6 })), a21 = hide(angleArc(B.svg, Tp, Ap, Bp, 70, { color: CS, width: 2.6 }));
      lab(B, Ap[0] + 66, Ap[1] - 16, T(cR('31^\\circ')), 'u3l9-al'); lab(B, Bp[0] + 52, Bp[1] - 20, T(cR('52^\\circ')), 'u3l9-al');
      const l128 = hide(lab(B, Bp[0] - 16, Bp[1] - 34, T(cS('128^\\circ')), 'u3l9-al')), l21 = hide(lab(B, Tp[0] - 60, Tp[1] + 92, T(cS('21^\\circ')), 'u3l9-al'));
      [['A', Ap, 0, 18], ['B', Bp, 0, 18], ['F', Fp, 10, 18], ['T', Tp, 18, -12]].forEach(([n, p, dx, dy]) => lab(B, p[0] + dx, p[1] + dy, T(n), 'u3l9-vl'));
      lab(B, (Ap[0] + Bp[0]) / 2, Ap[1] + 18, T('120\\text{ m}'), 'u3l9-sl');
      const lBT = hide(lab(B, (Bp[0] + Tp[0]) / 2 - 34, (Bp[1] + Tp[1]) / 2 - 6, T(cS('BT')), 'u3l9-sl')), lTF = hide(lab(B, Tp[0] - 16, (Tp[1] + Fp[1]) / 2 + 30, T(cK('TF')), 'u3l9-sl', 'w'));
      const L = [line(Pn, `${T('\\angle ABT=180^\\circ-52^\\circ=128^\\circ')}`), line(Pn, T('\\angle ATB=180^\\circ-31^\\circ-128^\\circ=21^\\circ')),
        line(Pn, T('BT=\\dfrac{120\\sin31^\\circ}{\\sin21^\\circ}\\approx' + BT.toFixed(2)), 'u3l9-big'), line(Pn, T('TF=BT\\sin52^\\circ\\approx' + fx(TF) + '\\text{ m}'), 'u3l9-wans')].map(hide);
      return [
        { cap: `Sketch it: ${T('A')} and ${T('B')} are 120 m apart, and both sight lines go to the top ${T('T')}. We want the height ${T('TF')}.`, run: (c) => pulse(c, B.el, 1.01) },
        { cap: `Neither right triangle has a known side yet. But ${T('\\triangle ABT')} has ${T('AB=120')} m: <b>start there</b>.`, run: (c) => show(c, tABT) },
        { cap: `At ${T('B')}, a straight line: ${T(cS('\\angle ABT=180^\\circ-52^\\circ=128^\\circ'))}. Then ${T(cS('\\angle ATB=180^\\circ-31^\\circ-128^\\circ=21^\\circ'))}.`, run: async (c) => { await show(c, a128); await show(c, l128); await show(c, L[0]); await show(c, a21); await show(c, l21); await show(c, L[1]); } },
        { cap: `${T('AB=120')} is opposite ${T('\\angle ATB=21^\\circ')}: a full pair, so the <b>sine law</b>. ${T('BT')} is opposite ${T('31^\\circ')}: ${T('BT=\\dfrac{120\\sin31^\\circ}{\\sin21^\\circ}\\approx' + BT.toFixed(2))} m.`, run: async (c) => { sBT.setAttribute('stroke', CS); sBT.setAttribute('stroke-width', 4.5); await show(c, lBT); await show(c, L[2]); } },
        { cap: `Now right ${T('\\triangle BFT')} has a known hypotenuse ${T('BT')}. ${T('TF')} is opposite ${T('52^\\circ')}: SOH, ${T('TF=BT\\sin52^\\circ\\approx' + fx(TF))} m.`, run: async (c) => { tABT.style.opacity = 0.25; await show(c, tBFT); await show(c, lTF); await show(c, L[3]); stp.style.opacity = 1; await stampIn(c, stp); } }
      ];
    }
    // boats
    const d1 = 21, d2 = 27, dd = sas(d1, d2, 115), s = 9.2, O = [190, 200], P = (x, y) => [O[0] + x * s, O[1] - y * s];
    const Pp = P(d1 * sinD(30), d1 * cosD(30)), Qp = P(d2 * sinD(145), d2 * cosD(145));
    const g = svgEl('g', {}, B.svg);
    svgEl('line', { x1: O[0], y1: O[1], x2: O[0], y2: O[1] - 160, stroke: '#6b5532', 'stroke-width': 2.2, 'stroke-dasharray': '4 4' }, g); arrowHead(g, O[0], O[1] - 163, 0, -1, { color: '#6b5532', width: 2.2 });
    lab(B, O[0] - 16, O[1] - 160, '<b>N</b>', 'u3l9-vl');
    const p1 = svgEl('path', { class: 'bk-stroke', d: `M${O.join(' ')}L${Pp.join(' ')}`, stroke: INK, 'stroke-width': 3.5, fill: 'none' }, g);
    const p2 = svgEl('path', { class: 'bk-stroke', d: `M${O.join(' ')}L${Qp.join(' ')}`, stroke: INK, 'stroke-width': 3.5, fill: 'none' }, g);
    const dl = hide(svgEl('path', { d: `M${Pp.join(' ')}L${Qp.join(' ')}`, stroke: CC, 'stroke-width': 3.5, 'stroke-dasharray': '10 7', fill: 'none' }, g));
    const b1 = hide(svgEl('path', { d: arcD(O[0], O[1], 44, 60, 90), stroke: CT, 'stroke-width': 2.6, fill: 'none' }, g)), b2 = hide(svgEl('path', { d: arcD(O[0], O[1], 64, -55, 90), stroke: CT, 'stroke-width': 2.6, fill: 'none' }, g));
    const ab = hide(svgEl('path', { d: arcD(O[0], O[1], 30, -55, 60), stroke: CC, 'stroke-width': 3, fill: 'none' }, g));
    const lb1 = hide(lab(B, O[0] + 14, O[1] - 60, T(cT('030^\\circ')), 'u3l9-al')), lb2 = hide(lab(B, O[0] + 92, O[1] + 4, T(cT('145^\\circ')), 'u3l9-al')), lab115 = hide(lab(B, O[0] + 52, O[1] + 2 - 2, T(cC('115^\\circ')), 'u3l9-al'));
    lab115.style.top = (O[1] - 2) + 'px'; lab115.style.left = (O[0] + 40) + 'px';
    lab(B, O[0] - 30, O[1] + 4, 'dock', 'u3l9-vl');
    const l21 = hide(lab(B, (O[0] + Pp[0]) / 2 + 14, (O[1] + Pp[1]) / 2 + 8, T('21'), 'u3l9-sl', 'e')), l27 = hide(lab(B, (O[0] + Qp[0]) / 2 - 16, (O[1] + Qp[1]) / 2 + 8, T('27'), 'u3l9-sl', 'w')), ld = hide(lab(B, (Pp[0] + Qp[0]) / 2 + 18, (Pp[1] + Qp[1]) / 2, T(cC('d')), 'u3l9-sl', 'e'));
    const L = [line(Pn, T('14(1.5)=21\\text{ km},\\quad 18(1.5)=27\\text{ km}')), line(Pn, T('145^\\circ-30^\\circ=115^\\circ')), line(Pn, 'SAS: <b>cosine law</b>'),
      line(Pn, T('d^2=21^2+27^2-2(21)(27)\\cos115^\\circ'), 'u3l9-big'), line(Pn, T('\\approx1170+479.25=1649.25'), 'u3l9-big'), line(Pn, T('d\\approx' + fx(dd) + '\\text{ km}'), 'u3l9-wans')].map(hide);
    [p1, p2].forEach(hide);
    return [
      { cap: `Distance = speed × time: ${T('14(1.5)=21')} km and ${T('18(1.5)=27')} km.`, run: async (c) => { p1.style.opacity = 1; p2.style.opacity = 1; await drawIn(p1, 600, c); await drawIn(p2, 600, c); await show(c, l21); await show(c, l27); await show(c, L[0]); } },
      { cap: `Bearings are measured <b>clockwise from north</b>: ${T('030^\\circ')} and ${T('145^\\circ')}.`, run: async (c) => { await show(c, b1); await show(c, lb1); await show(c, b2); await show(c, lb2); } },
      { cap: `Both paths start at the dock, so the angle between them is the difference: ${T(cC('145^\\circ-30^\\circ=115^\\circ'))}.`, run: async (c) => { b1.style.opacity = 0.3; b2.style.opacity = 0.3; await show(c, ab); await show(c, lab115); await show(c, L[1]); } },
      { cap: `Two sides and the angle <b>between</b> them (SAS): the <b>cosine law</b>. ${T('d^2=21^2+27^2-2(21)(27)\\cos115^\\circ')}.`, run: async (c) => { await show(c, dl); await show(c, ld); await show(c, L[2]); await show(c, L[3]); } },
      { cap: `${T('\\cos115^\\circ')} is negative, so subtracting it <b>adds</b>: ${T('d^2\\approx1170+479.25=1649.25')} and ${T('d\\approx' + fx(dd))} km.`, run: async (c) => { await show(c, L[4]); await show(c, L[5]); stp.style.opacity = 1; await stampIn(c, stp); } }
    ];
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
  intro: 'At your whiteboard: sketch it first, then answer. Calculator in Degree mode (exact values: no calculator).',
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
mountMystery();
staticFigs();
export const explainers = mountExplainers({ castRecap, exactTable, lawsRecap, ambiguous, whichLaw, pointRatios, solveTrig, toolSorter, problemSolve });
export const _test = { CR_CH, AM, WL, PR, ST, SORT, triPts, refOf, quadOf };
