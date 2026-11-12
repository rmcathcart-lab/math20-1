/* Math 20-1 · Unit 3 · Lesson 1 — Angles in Standard Position and Reference Angles.
 * Warm-up (The Ferris Wheel: your seat starts level with the hub; how often is it 10 m from hub height?), and explainers:
 *   standard (vertex, initial arm, terminal arm, θ; a clockwise turn and a turn past 360°; Example 2 check),
 *   quadrants (the four quadrants light up, quadrantal angles, sketching 300° with the 45° landmark; Example 1 check),
 *   points (signs of x and y name the quadrant; Example 3 checks: plot, arm, rotation),
 *   sweep (STAR: the terminal arm sweeps 0° → 360° with a live readout; the reference angle shades as a wedge to the
 *     nearest x-axis and its formula lights up per quadrant; drag the arm; any angle; Example 4 check),
 *   backwards (from θR and the quadrant back to θ; Example 5 check, all six rows),
 *   four (one reference triangle flipped into all four quadrants; Example 6 checks),
 *   reflect (P(a, b) reflected in the y-axis, both axes, the x-axis; Example 7 check),
 *   mistakes (measured to the y-axis, the wrong quadrant's formula; Example 8 check: Ana, Ben, Cole).
 * Colours (kept through Unit 3): terminal arm and θ in the course accent #7a1f3d, reference angle θR in amber,
 * "same arm as" in blue, mistakes in red. */
import {
  h, tex, add, box, Graph, stamp, stampIn, mountExplainers, pop, fadeIn, sleep, tween, svgEl, liveCtx, pulse, place,
  anim, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const AC = COLORS.brand, RC = COLORS.amber, BL = COLORS.blue, RD = COLORS.red, GN = COLORS.green, INK = COLORS.ink, QF = '#f7e9ee';
const cA = (s) => `\\textcolor{${AC}}{${s}}`, cR = (s) => `\\textcolor{${RC}}{${s}}`, cB = (s) => `\\textcolor{${BL}}{${s}}`, cD = (s) => `\\textcolor{${RD}}{${s}}`;
const dg = (v) => `${v}^\\circ`;
const TD = (v) => T(dg(v));
const XA = T('x') + '-axis', YA = T('y') + '-axis';
const D2R = Math.PI / 180;
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
const panel = (stage, x, y, w, hh, title, cls = '') => div(stage, 'u3l1-panel ' + cls, title ? `<div class="u3l1-ph">${title}</div>` : '', x, y, w, hh);
const lineIn = (p, html, cls = '') => { const d = h('div', 'u3l1-line ' + cls, html); p.appendChild(d); hide(d); return d; };
const setH = (el, html) => { if (el._h !== html) { el._h = html; el.innerHTML = html; } };

/* ---------------- the reference angle of θ (0° ≤ θ ≤ 360°, whole degrees) ---------------- */
const QWORD = { 1: 'quadrant 1', 2: 'quadrant 2', 3: 'quadrant 3', 4: 'quadrant 4' };
export function refOf(t) {
  if (t === 0 || t === 360) return { q: 0, ref: 0, a: t, b: t, near: t, axis: `the positive ${XA}`, calc: `\\theta_R=0^\\circ` };
  if (t === 180) return { q: 0, ref: 0, a: 180, b: 180, near: 180, axis: `the negative ${XA}`, calc: `\\theta_R=0^\\circ` };
  if (t === 90) return { q: 0, ref: 90, a: 0, b: 90, near: 0, axis: `the positive ${YA}`, calc: `\\theta_R=90^\\circ` };
  if (t === 270) return { q: 0, ref: 90, a: 270, b: 360, near: 360, axis: `the negative ${YA}`, calc: `\\theta_R=90^\\circ` };
  if (t < 90) return { q: 1, ref: t, a: 0, b: t, near: 0, f: '\\theta_R=\\theta', calc: `\\theta_R=\\theta=${dg(t)}` };
  if (t < 180) return { q: 2, ref: 180 - t, a: t, b: 180, near: 180, f: '\\theta_R=180^\\circ-\\theta', calc: `\\theta_R=180^\\circ-${dg(t)}=${dg(180 - t)}` };
  if (t < 270) return { q: 3, ref: t - 180, a: 180, b: t, near: 180, f: '\\theta_R=\\theta-180^\\circ', calc: `\\theta_R=${dg(t)}-180^\\circ=${dg(t - 180)}` };
  return { q: 4, ref: 360 - t, a: t, b: 360, near: 360, f: '\\theta_R=360^\\circ-\\theta', calc: `\\theta_R=360^\\circ-${dg(t)}=${dg(360 - t)}` };
}
/* the angle from θR and the quadrant */
export function fromRef(r, q) { return q === 1 ? r : q === 2 ? 180 - r : q === 3 ? 180 + r : 360 - r; }
const FROM = { 1: (r) => dg(r), 2: (r) => `180^\\circ-${dg(r)}=${dg(180 - r)}`, 3: (r) => `180^\\circ+${dg(r)}=${dg(180 + r)}`, 4: (r) => `360^\\circ-${dg(r)}=${dg(360 - r)}` };

/* ---------------- drawing: arcs and arrowheads in px (angles in degrees, counterclockwise, y up) ---------------- */
const headPts = (x, y, dx, dy, L = 13, hw = 6.5) => {
  const l = Math.hypot(dx, dy) || 1, ux = dx / l, uy = dy / l;
  return [[x, y], [x - L * ux + hw * uy, y - L * uy - hw * ux], [x - L * ux - hw * uy, y - L * uy + hw * ux]].map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
};
function arcPx(cx, cy, r, a, b, grow = 0) {
  const n = Math.max(2, Math.ceil(Math.abs(b - a) / 2)), out = [];
  for (let i = 0; i <= n; i++) { const t = a + (b - a) * i / n, rr = r + grow * Math.abs(t - a) / 360; out.push([cx + rr * Math.cos(t * D2R), cy - rr * Math.sin(t * D2R)]); }
  return out;
}
const pathOf = (pts) => 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L');

/* A dial: axes through (cx, cy) with an SVG for arms, arcs and wedges and an HTML layer for KaTeX labels. */
class Dial {
  constructor(host, opts = {}) {
    const o = Object.assign({ w: 440, h: 400, R: 150, mini: false, cls: '', axisLabels: true }, opts);
    if (o.cx == null) o.cx = o.w / 2; if (o.cy == null) o.cy = o.h / 2;
    if (o.ext == null) o.ext = o.R + 34; if (o.exty == null) o.exty = o.ext;
    if (o.xlo == null) o.xlo = o.ext; if (o.ylo == null) o.ylo = o.exty;
    this.o = o; this.cx = o.cx; this.cy = o.cy; this.R = o.R;
    const el = h('div', 'u3l1-dial ' + o.cls); box(el, o.w, o.h);
    if (o.x != null) add(host, el, o.x, o.y); else host.appendChild(el);
    this.el = el;
    this.svg = svgEl('svg', { width: o.w, height: o.h, viewBox: `0 0 ${o.w} ${o.h}` }, el);
    const L = () => svgEl('g', {}, this.svg);
    this.lq = L(); this.lref = L(); this.lax = L(); this.larc = L(); this.larm = L(); this.ltop = L();
    this.html = h('div', 'u3l1-dhtml'); el.appendChild(this.html);
    const { cx, cy } = this, ex = o.ext, ey = o.exty, xl = o.xlo, yl = o.ylo;
    this.q = {};
    [[1, cx, cy - ey, ex, ey], [2, cx - xl, cy - ey, xl, ey], [3, cx - xl, cy, xl, yl], [4, cx, cy, ex, yl]].forEach(([k, x, y, w, hh]) => {
      const r = svgEl('rect', { x, y, width: w, height: hh, fill: QF }, this.lq); r.style.opacity = 0; r.style.transition = 'opacity .3s'; this.q[k] = r;
    });
    const aw = o.mini ? 1.6 : 2.4;
    svgEl('line', { x1: cx - xl, y1: cy, x2: cx + ex, y2: cy, stroke: INK, 'stroke-width': aw }, this.lax);
    svgEl('line', { x1: cx, y1: cy + yl, x2: cx, y2: cy - ey, stroke: INK, 'stroke-width': aw }, this.lax);
    if (!o.mini) {
      svgEl('polygon', { points: headPts(cx + ex + 5, cy, 1, 0, 11, 5.5), fill: INK }, this.lax);
      svgEl('polygon', { points: headPts(cx, cy - ey - 5, 0, -1, 11, 5.5), fill: INK }, this.lax);
      if (o.axisLabels) { this.lab(cx + ex + 2, cy + 6, T('x'), 's', 'u3l1-axl'); this.lab(cx + 9, cy - ey - 4, T('y'), 'e', 'u3l1-axl'); }
    }
  }
  P(a, r = this.R) { return [this.cx + r * Math.cos(a * D2R), this.cy - r * Math.sin(a * D2R)]; }
  arcPts(r, a, b, grow = 0) { return arcPx(this.cx, this.cy, r, a, b, grow); }
  lab(px, py, html, pos = 'c', cls = '') { const d = h('div', 'u3l1-lab ' + cls, html); this.html.appendChild(d); place(d, px, py, pos, 0); return d; }
  labAt(a, r, html, cls = '') { const [x, y] = this.P(a, r); return this.lab(x, y, html, 'c', cls); }
  move(d, a, r) { const [x, y] = this.P(a, r); place(d, x, y, 'c', 0); }
  fillQ(k, on) { for (const j of [1, 2, 3, 4]) if (k === 0 || j === k) this.q[j].style.opacity = on ? 1 : 0; }
  /* the terminal arm (or any arm): a thick line from the vertex */
  arm(a, o = {}) {
    const g = svgEl('g', {}, this.larm), r = o.r ?? this.R, w = o.width ?? (this.o.mini ? 2.6 : 5);
    const line = svgEl('line', { x1: this.cx, y1: this.cy, stroke: o.color || AC, 'stroke-width': w, 'stroke-linecap': 'round' }, g);
    if (o.dash) line.setAttribute('stroke-dasharray', o.dash);
    const A = { g, line, a, set: (v) => { A.a = v; const [x, y] = this.P(v, r); line.setAttribute('x2', x.toFixed(1)); line.setAttribute('y2', y.toFixed(1)); if (A.hg) A.hg.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`); } };
    if (o.dot) { A.hg = svgEl('g', {}, g); A.hgi = svgEl('g', {}, A.hg); A.dot = svgEl('circle', { r: o.dot, fill: o.color || AC, stroke: '#fff', 'stroke-width': 2.5 }, A.hgi); }
    A.set(a); return A;
  }
  /* a rotation arc with an arrowhead, from a0 to a1 (a1 < a0: clockwise); grow > 0 makes a spiral (px per turn) */
  rot(a0, a1, o = {}) {
    const g = svgEl('g', {}, this.larc), color = o.color || AC, r = o.r ?? 44, grow = o.grow ?? 0;
    const path = svgEl('path', { fill: 'none', stroke: color, 'stroke-width': o.width ?? (this.o.mini ? 2 : 3), 'stroke-linecap': 'round' }, g);
    if (o.dash) path.setAttribute('stroke-dasharray', o.dash);
    const head = o.arrow === false ? null : svgEl('polygon', { fill: color }, g);
    const S = { g, path, head, set: (b, a = S.a0) => {
      S.a0 = a; S.a1 = b;
      if (Math.abs(b - a) < 0.5) { path.setAttribute('d', ''); if (head) head.setAttribute('points', ''); return; }
      const pts = this.arcPts(r, a, b, grow); path.setAttribute('d', pathOf(pts));
      if (head) {
        if (Math.abs(b - a) < 7) { head.setAttribute('points', ''); return; }
        const p = pts[pts.length - 1], q = pts[pts.length - 2];
        head.setAttribute('points', headPts(p[0], p[1], p[0] - q[0], p[1] - q[1], o.hl ?? (this.o.mini ? 8 : 12), o.hw ?? (this.o.mini ? 4 : 6)));
      }
    } };
    S.a0 = a0; S.set(a1, a0); return S;
  }
  /* a shaded wedge from a to b (the reference angle), with a dashed edge */
  wedge(a, b, o = {}) {
    const g = svgEl('g', {}, this.lref), color = o.color || RC, r = o.r ?? this.R * 0.62;
    const fill = svgEl('path', { fill: color, 'fill-opacity': o.op ?? 0.24, stroke: 'none' }, g);
    const edge = svgEl('path', { fill: 'none', stroke: color, 'stroke-width': o.width ?? (this.o.mini ? 2 : 3.2), 'stroke-dasharray': o.dash ?? (this.o.mini ? '4 3' : '8 5') }, g);
    const Wd = { g, fill, edge, r, set: (p, q) => {
      Wd.a = p; Wd.b = q;
      if (Math.abs(q - p) < 0.3) { fill.setAttribute('d', ''); edge.setAttribute('d', ''); return; }
      const pts = this.arcPts(r, p, q);
      fill.setAttribute('d', `M${this.cx} ${this.cy}L` + pts.map((s) => s[0].toFixed(1) + ' ' + s[1].toFixed(1)).join('L') + 'Z');
      edge.setAttribute('d', pathOf(pts));
    } };
    Wd.set(a, b); return Wd;
  }
}
/* live readout "θ = 130°" */
function readout(host, x, y, sym = '\\theta', cls = '') {
  const d = div(host, 'u3l1-ro ' + cls, '', x, y);
  const R0 = { el: d, set: (v) => setH(d, T(`${sym}=${cA(dg(Math.round(v)))}`)) };
  R0.set(0); return R0;
}
/* turn an arm (and its rotation arc, readout, …) from its angle to b */
function turner(paint, start = 0) {
  const s = { cur: start };
  s.go = (c, b, ms = 1200) => { const a = s.cur; s.cur = b; return tween(c, ms * Math.min(1.6, Math.max(0.45, Math.abs(b - a) / 150)), (k) => paint(a + (b - a) * k)); };
  return s;
}

/* ====================================================================================================
 * Warm-up: The Ferris Wheel. Radius 20 m; the seat starts level with the hub, on the right; counterclockwise.
 * ==================================================================================================== */
function mountWheel() {
  const host = document.getElementById('u3l1-wheel'); if (!host) return;
  const W = 480, H = 360, cx = 240, cy = 166, R = 130, M = 20;
  const svg = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u3l1-wsvg' }, host);
  svgEl('rect', { x: 0, y: 0, width: W, height: H, rx: 14, fill: '#eaf3fb' }, svg);
  svgEl('rect', { x: 0, y: H - 30, width: W, height: 30, fill: '#a9cf86' }, svg);
  svgEl('path', { d: `M${cx - 96} ${H - 30}L${cx} ${cy}L${cx + 96} ${H - 30}`, fill: 'none', stroke: '#7d8594', 'stroke-width': 9, 'stroke-linejoin': 'round' }, svg);
  const wg = svgEl('g', {}, svg);
  svgEl('circle', { cx, cy, r: R, fill: 'none', stroke: '#5b6475', 'stroke-width': 5 }, wg);
  svgEl('circle', { cx, cy, r: R * 0.82, fill: 'none', stroke: '#9aa3b3', 'stroke-width': 2 }, wg);
  for (let k = 0; k < 12; k++) { const a = k * 30 * D2R; svgEl('line', { x1: cx, y1: cy, x2: cx + R * Math.cos(a), y2: cy - R * Math.sin(a), stroke: '#8b93a3', 'stroke-width': 2 }, wg); }
  // hub height
  svgEl('line', { x1: 14, y1: cy, x2: W - 14, y2: cy, stroke: '#3a4254', 'stroke-width': 2, 'stroke-dasharray': '8 6' }, svg);
  const hubLab = h('div', 'u3l1-hublab', 'hub height'); host.appendChild(hubLab); place(hubLab, 16, cy - 4, 'ne', 0);
  svgEl('circle', { cx, cy, r: 9, fill: '#3a4254' }, svg);
  // start mark
  svgEl('polygon', { points: `${cx + R + 20},${cy} ${cx + R + 34},${cy - 8} ${cx + R + 34},${cy + 8}`, fill: AC }, svg);
  const startLab = h('div', 'u3l1-startlab', 'start'); host.appendChild(startLab); place(startLab, cx + R + 30, cy - 12, 'n', 0);
  // the angle turned
  const arc = svgEl('path', { fill: 'none', stroke: AC, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, svg);
  const arcHead = svgEl('polygon', { fill: AC }, svg);
  // the height bracket
  const brk = svgEl('g', {}, svg);
  const bl = svgEl('line', { stroke: BL, 'stroke-width': 3.5 }, brk), bt1 = svgEl('line', { stroke: BL, 'stroke-width': 3 }, brk), bt2 = svgEl('line', { stroke: BL, 'stroke-width': 3 }, brk);
  const bLab = h('div', 'u3l1-blab', ''); host.appendChild(bLab);
  // gondolas (they hang straight down)
  const cars = [];
  for (let k = 0; k < 12; k++) {
    const g = svgEl('g', {}, svg), me = k === 0;
    svgEl('line', { x1: 0, y1: 0, x2: 0, y2: 10, stroke: '#5b6475', 'stroke-width': 2.5 }, g);
    svgEl('rect', { x: -15, y: 8, width: 30, height: 22, rx: 6, fill: me ? AC : '#f2c14e', stroke: me ? '#4d1026' : '#b88a1b', 'stroke-width': 2 }, g);
    if (me) { const t = svgEl('text', { x: 0, y: 24, 'text-anchor': 'middle', fill: '#fff', 'font-size': 13, 'font-weight': 800, 'font-family': 'system-ui, sans-serif' }, g); t.textContent = 'YOU'; }
    svgEl('circle', { r: 4, fill: '#5b6475' }, g);
    cars.push(g);
  }
  svg.appendChild(cars[0]); // ours on top
  const info = div(host, 'u3l1-winfo', '', 10, 8);
  const bBack = document.getElementById('u3l1-wback'), bFwd = document.getElementById('u3l1-wfwd'), bReset = document.getElementById('u3l1-wreset');
  let ang = 0, busy = false;
  const ht = (a) => M * Math.sin(a * D2R);
  const f1 = (v) => { const s = (Math.round(v * 10) / 10).toFixed(1); return s.endsWith('.0') ? s.slice(0, -2) : s; };
  const paint = (a) => {
    wg.setAttribute('transform', `rotate(${(-a).toFixed(2)} ${cx} ${cy})`);
    cars.forEach((g, k) => { const t = (a + 30 * k) * D2R; g.setAttribute('transform', `translate(${(cx + R * Math.cos(t)).toFixed(1)} ${(cy - R * Math.sin(t)).toFixed(1)})`); });
    if (a > 0.5) {
      const pts = arcPx(cx, cy, 46, 0, a); arc.setAttribute('d', pathOf(pts));
      const p = pts[pts.length - 1], q = pts[pts.length - 2]; arcHead.setAttribute('points', a > 8 ? headPts(p[0], p[1], p[0] - q[0], p[1] - q[1], 12, 6) : '');
    } else { arc.setAttribute('d', ''); arcHead.setAttribute('points', ''); }
    const sx = cx + R * Math.cos(a * D2R), sy = cy - R * Math.sin(a * D2R), hh = ht(a);
    const bx = sx + (Math.cos(a * D2R) >= 0 ? 30 : -30);
    bl.setAttribute('x1', bx); bl.setAttribute('x2', bx); bl.setAttribute('y1', cy); bl.setAttribute('y2', sy);
    [[bt1, cy], [bt2, sy]].forEach(([l, y]) => { l.setAttribute('x1', bx - 7); l.setAttribute('x2', bx + 7); l.setAttribute('y1', y); l.setAttribute('y2', y); });
    brk.style.opacity = Math.abs(hh) < 0.3 ? 0 : 1;
    bLab.textContent = f1(Math.abs(hh)) + ' m'; place(bLab, bx + (Math.cos(a * D2R) >= 0 ? 8 : -8), (cy + sy) / 2, Math.cos(a * D2R) >= 0 ? 'e' : 'w', 0);
    bLab.style.opacity = Math.abs(hh) < 0.3 ? 0 : 1;
  };
  const words = (a) => { const hh = ht(a); return Math.abs(hh) < 0.05 ? 'your seat is <b>level with the hub</b>' : `your seat is <b>${f1(Math.abs(hh))} m ${hh > 0 ? 'above' : 'below'}</b> the hub`; };
  const paintInfo = () => { info.innerHTML = `Turned <b>${ang}°</b> · ${words(ang)}`; bBack.disabled = ang <= 0; bFwd.disabled = ang >= 360; };
  const go = async (to) => {
    if (busy) return; busy = true; const from = ang; ang = to; paintInfo();
    await tween(liveCtx(), 420, (k) => paint(from + (to - from) * k)); busy = false;
  };
  bBack.addEventListener('click', () => { if (ang > 0) go(ang - 15); });
  bFwd.addEventListener('click', () => { if (ang < 360) go(ang + 15); });
  bReset.addEventListener('click', () => { go(0); });
  paint(0); paintInfo();
}

/* ====================================================================================================
 * Static figures on the cards
 * ==================================================================================================== */
function mountFigures() {
  // section 1: the parts of an angle in standard position
  const f1 = document.querySelector('[data-fig="std"]');
  if (f1) {
    const D = new Dial(f1, { w: 420, h: 290, R: 150, cx: 200, cy: 200, ext: 190, exty: 175, xlo: 180, ylo: 70 });
    const th = 130;
    svgEl('line', { x1: D.cx, y1: D.cy, x2: D.cx + 175, y2: D.cy, stroke: INK, 'stroke-width': 6, 'stroke-linecap': 'round' }, D.larm);
    D.arm(th, { r: 165 }); D.rot(0, th, { r: 46 });
    svgEl('circle', { cx: D.cx, cy: D.cy, r: 6, fill: INK }, D.ltop);
    D.labAt(th / 2, 74, T(cA('\\theta')), 'u3l1-big');
    D.lab(D.cx + 112, D.cy + 10, 'initial arm', 's', 'u3l1-word');
    const [tx, ty] = D.P(th, 120); D.lab(tx - 16, ty, 'terminal arm', 'w', 'u3l1-word u3l1-ac');
    D.lab(D.cx - 10, D.cy + 10, 'vertex', 'sw', 'u3l1-word');
  }
  // section 2: quadrants
  const f2 = document.querySelector('[data-fig="quads"]');
  if (f2) {
    const D = new Dial(f2, { w: 400, h: 270, R: 110, cx: 200, cy: 140, ext: 160, exty: 112 });
    [[1, 1, -1], [2, -1, -1], [3, -1, 1], [4, 1, 1]].forEach(([k, sx, sy]) => D.lab(D.cx + sx * 82, D.cy + sy * 56, `Quadrant ${k}`, 'c', 'u3l1-word'));
    D.lab(D.cx + 118, D.cy - 4, `${TD(0)}, ${TD(360)}`, 'n', 'u3l1-tag');
    D.lab(D.cx - 118, D.cy - 4, TD(180), 'n', 'u3l1-tag');
    D.lab(D.cx - 8, D.cy - 100, TD(90), 'w', 'u3l1-tag');
    D.lab(D.cx + 8, D.cy + 100, TD(270), 'e', 'u3l1-tag');
  }
  // section 3: the four reference-angle pictures
  document.querySelectorAll('[data-fig="ref"]').forEach((el) => {
    const th = Number(el.dataset.ang), info = refOf(th);
    const D = new Dial(el, { w: 210, h: 180, R: 72, cx: 105, cy: 92, ext: 92, exty: 82, axisLabels: false });
    D.arm(th, { width: 4 }); D.rot(0, th, { r: 24, width: 2.5, hl: 9, hw: 4.5 });
    D.wedge(info.a, info.b, { r: 54 });
    D.labAt(th / 2, th < 90 ? 34 : 38, T(cA('\\theta')), 'u3l1-sm');
    D.labAt((info.a + info.b) / 2, 70, T(cR('\\theta_R')), 'u3l1-sm');
  });
  // sketches in the examples: blank axes; the arm (and the reference angle) appear with the answer
  const SZ = { m: { w: 200, h: 170, R: 64, ext: 84, exty: 74 }, s: { w: 74, h: 62, R: 26, ext: 30, exty: 27, mini: true }, l: { w: 250, h: 220, R: 86, ext: 108, exty: 98 } };
  document.querySelectorAll('[data-sk]').forEach((el) => {
    const sz = SZ[el.dataset.sk] || SZ.m, D = new Dial(el, Object.assign({ axisLabels: true }, sz));
    const a = Number(el.dataset.ang); if (isNaN(a)) return;
    const els = [];
    const A = D.arm(a, { width: sz.mini ? 2.6 : 3.6 }); els.push(A.g);
    if (!sz.mini) {
      if (a > 360) els.push(D.rot(0, a, { r: 16, grow: 10, width: 2.2, hl: 9, hw: 4.5 }).g);
      else els.push(D.rot(0, a, { r: 20, width: 2.2, hl: 9, hw: 4.5 }).g);
    }
    if (el.dataset.ref) {
      const [p, q] = el.dataset.ref.split(',').map(Number);
      els.push(D.wedge(p, q, { r: sz.R * 0.62 }).g);
      els.push(D.labAt((p + q) / 2, sz.R * 0.62 + 20, T(cR(dg(Math.abs(q - p)))), 'u3l1-sm u3l1-halo'));
    }
    if (el.dataset.ya) { // Example 8: the y-axis "reference angle" (dotted, red)
      const [p, q] = el.dataset.ya.split(',').map(Number);
      const pth = svgEl('path', { d: pathOf(D.arcPts(sz.R * 0.9, p, q)), fill: 'none', stroke: RD, 'stroke-width': 3, 'stroke-dasharray': '2 5', 'stroke-linecap': 'round' }, D.lref); els.push(pth);
      els.push(D.labAt((p + q) / 2, sz.R * 0.9 + 18, T(cD(dg(Math.abs(q - p)))), 'u3l1-sm u3l1-halo'));
    }
    els.forEach((e) => e.classList.add('u3l1-sol'));
  });
  // Example 3: grids with a point on the terminal arm
  document.querySelectorAll('[data-grid]').forEach((el) => {
    const [x, y] = el.dataset.grid.split(',').map(Number), th = Number(el.dataset.th), name = el.dataset.name;
    const G = new Graph(el, { width: 250, height: 250, xmin: -6.8, xmax: 6.8, ymin: -6.8, ymax: 6.8, numbers: false });
    const sol = svgEl('g', { class: 'u3l1-sol' }, G.layers.top);
    const s = Math.min(1.15, 6.6 / Math.max(Math.abs(x), Math.abs(y))), [ox, oy] = G.toPx(0, 0), [ex2, ey2] = G.toPx(x * s, y * s);
    svgEl('line', { x1: ox, y1: oy, x2: ex2, y2: ey2, stroke: AC, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, sol);
    const pts = arcPx(ox, oy, 20, 0, th), p = pts[pts.length - 1], q = pts[pts.length - 2];
    svgEl('path', { d: pathOf(pts), fill: 'none', stroke: AC, 'stroke-width': 2.4 }, sol);
    svgEl('polygon', { points: headPts(p[0], p[1], p[0] - q[0], p[1] - q[1], 9, 4.5), fill: AC }, sol);
    G.point(x, y, { color: AC, label: T(`${name}(${x},\\ ${y})`), pos: y > 0 ? 'n' : 's', cls: 'u3l1-sol', labelCls: 'u3l1-sol', labelColor: AC });
  });
  // Example 7: P(3, 5) and its reflections
  const g7 = document.querySelector('[data-fig="ex7"]');
  if (g7) {
    const G = new Graph(g7, { width: 330, height: 330, xmin: -6.8, xmax: 6.8, ymin: -6.8, ymax: 6.8, numbers: false });
    const [ox, oy] = G.toPx(0, 0), armTo = (x, y, cls, color) => { const [a, b] = G.toPx(x * 7 / 6, y * 7 / 6); const l = svgEl('line', { x1: ox, y1: oy, x2: a, y2: b, stroke: color, 'stroke-width': 3, 'stroke-linecap': 'round' }, G.layers.data); if (cls) l.classList.add(cls); };
    armTo(3, 5, '', INK);
    G.point(3, 5, { color: INK, label: T('P(3,\\ 5)'), pos: 'e' });
    [['Q', -3, 5, 'w'], ['R', -3, -5, 'w'], ['S', 3, -5, 'e']].forEach(([n, x, y, pos]) => { armTo(x, y, 'u3l1-sol', AC); G.point(x, y, { color: AC, label: T(n), pos, cls: 'u3l1-sol', labelCls: 'u3l1-sol', labelColor: AC }); });
  }
}

/* =============================== explainer: standard position =============================== */
const standard = {
  title: 'An angle in standard position',
  height: 400, minW: 900,
  choices: [{ v: 'parts', label: 'Parts of the angle' }, { v: 'neg', label: 'Clockwise 60°' }, { v: 'big', label: 'A turn of 480°' }, { sep: 'Check:' }, { v: 'ex2', label: 'Example 2 check' }],
  ask: (v) => ({
    parts: 'What makes an angle <b>in standard position</b>?',
    neg: `A <b>clockwise</b> rotation of ${TD(60)}: which angle from ${TD(0)} to ${TD(360)} has the same terminal arm?`,
    big: `A <b>counterclockwise</b> rotation of ${TD(480)}: which angle from ${TD(0)} to ${TD(360)} has the same terminal arm?`,
    ex2: `Example 2: sketch each rotation, then state the angle from ${TD(0)} to ${TD(360)} with the same terminal arm.`
  }[v]),
  make(stage, v, ex) {
    if (v === 'ex2') return standardEx2(stage, ex);
    const D = new Dial(stage, { x: 8, y: 4, w: 480, h: 392, R: 158, cx: 240, cy: 200, ext: 205, exty: 178 });
    const ro = readout(stage, 18, 14);
    const Pn = panel(stage, 512, 18, ex.W - 530, 360, '');
    let rotArc = D.rot(0, 0, { r: 46, grow: v === 'big' ? 30 : 0, r0: 0 }), arm, thLab = null;
    const paint = (t) => { arm.set(t); rotArc.set(t, 0); ro.set(t); if (thLab) D.move(thLab, v === 'big' ? (t % 360) / 2 + 20 : t / 2, v === 'big' ? 104 : 76); };
    if (v === 'parts') {
      const vtx = svgEl('g', {}, D.ltop); svgEl('circle', { cx: D.cx, cy: D.cy, r: 7, fill: INK }, vtx); vtx.style.opacity = 0;
      const vLab = hide(D.lab(D.cx - 10, D.cy + 10, 'vertex', 'sw', 'u3l1-word'));
      const ini = svgEl('line', { x1: D.cx, y1: D.cy, x2: D.cx + 190, y2: D.cy, stroke: INK, 'stroke-width': 7, 'stroke-linecap': 'round' }, D.larm); ini.style.opacity = 0;
      const iLab = hide(D.lab(D.cx + 120, D.cy + 12, 'initial arm', 's', 'u3l1-word'));
      arm = D.arm(0, { r: 172 }); arm.g.style.opacity = 0;
      const [tx, ty] = D.P(130, 128), tLab = hide(D.lab(tx - 18, ty, 'terminal arm', 'w', 'u3l1-word u3l1-ac'));
      thLab = hide(D.labAt(0, 76, T(cA('\\theta')), 'u3l1-big'));
      const full = svgEl('circle', { cx: D.cx, cy: D.cy, r: 120, fill: 'none', stroke: BL, 'stroke-width': 2.5, 'stroke-dasharray': '3 6' }, D.lref); full.style.opacity = 0;
      const fullLab = hide(D.labAt(-38, 138, T(cB('360^\\circ')) + ' <span class="u3l1-bl">one full turn</span>', 'u3l1-halo'));
      ro.el.style.opacity = 0;
      const L = [
        lineIn(Pn, `<b>Vertex</b>: at the origin.`),
        lineIn(Pn, `<b>Initial arm</b>: on the positive ${XA}.`),
        lineIn(Pn, `<b class="u3l1-ac">Terminal arm</b>: turns away from the initial arm.`),
        lineIn(Pn, `<b class="u3l1-ac">Rotation angle</b> ${T(cA('\\theta'))}: the amount of turning. Counterclockwise is <b>positive</b>.`),
        lineIn(Pn, `One full turn is ${TD(360)}. In this course, ${T('0^\\circ\\le\\theta\\le360^\\circ')}.`, 'u3l1-line-key')
      ];
      const T1 = turner(paint);
      return [
        { cap: 'The <b>vertex</b> of the angle is at the <b>origin</b>.', run: async (c) => { await pop(c, vtx); await show(c, vLab); await show(c, L[0]); } },
        { cap: `The <b>initial arm</b> lies along the <b>positive ${XA}</b>. Every angle in standard position starts here.`, run: async (c) => { await anim(c, ini, [{ opacity: 0 }, { opacity: 1 }], 400); await show(c, iLab); await show(c, L[1]); } },
        { cap: `A second arm, the <b>terminal arm</b>, turns away from it: here, <b>counterclockwise</b>.`, run: async (c) => { arm.g.style.opacity = 1; ro.el.style.opacity = 1; await T1.go(c, 130, 1400); await show(c, tLab); await show(c, L[2]); } },
        { cap: `The amount of turning is the <b>rotation angle</b>: ${T(cA('\\theta=130^\\circ'))}. Counterclockwise turns are <b>positive</b>.`, run: async (c) => { paint(130); await pop(c, thLab); await show(c, L[3]); } },
        { cap: `One <b>full turn</b> is ${TD(360)}. In this course the rotation angle is between ${TD(0)} and ${TD(360)}.`, run: async (c) => { await anim(c, full, [{ opacity: 0 }, { opacity: 1 }], 500); await show(c, fullLab); await show(c, L[4]); } }
      ];
    }
    arm = D.arm(0, { r: 172 });
    const T1 = turner(paint);
    if (v === 'neg') {
      const same = D.rot(0, 300, { r: 96, color: BL, dash: '7 6', width: 3 }); same.g.style.opacity = 0;
      const sLab = hide(D.labAt(150, 120, T(cB('300^\\circ')), 'u3l1-halo u3l1-big'));
      thLab = hide(D.labAt(-30, 72, T(cA('-60^\\circ')), 'u3l1-halo'));
      const L = [
        lineIn(Pn, `<b>Clockwise</b> turns are <b>negative</b>: ${T(cA('\\theta=-60^\\circ'))}.`),
        lineIn(Pn, `It stops in <b>quadrant 4</b>.`),
        lineIn(Pn, `Same arm as ${T(cB('360^\\circ-60^\\circ=300^\\circ'))}.`, 'u3l1-line-key')
      ];
      return [
        { cap: 'Start on the initial arm, the positive ' + XA + '.', run: (c) => pulse(c, arm.g, 1.02) },
        { cap: `Turn <b>clockwise</b> ${TD(60)}. A clockwise turn is a <b>negative</b> angle: ${T(cA('-60^\\circ'))}.`, run: async (c) => { await T1.go(c, -60, 1100); await show(c, thLab); await show(c, L[0]); } },
        { cap: `It stops in quadrant 4. Turning <b>counterclockwise</b> to the same arm takes ${T(cB('360^\\circ-60^\\circ=300^\\circ'))}.`, run: async (c) => { await show(c, L[1]); same.g.style.opacity = 1; await tween(c, 1300, (k) => same.set(300 * k, 0)); await pop(c, sLab); await show(c, L[2]); } },
        { cap: `${T('-60^\\circ')} and ${T('300^\\circ')} have the <b>same terminal arm</b>. In this course we name it ${TD(300)}.`, run: (c) => pulse(c, sLab, 1.15) }
      ];
    }
    // big: 480°
    thLab = hide(D.labAt(80, 104, T(cA('480^\\circ')), 'u3l1-halo'));
    const same = D.rot(0, 120, { r: 128, color: BL, dash: '7 6', width: 3 }); same.g.style.opacity = 0;
    const sLab = hide(D.labAt(60, 150, T(cB('120^\\circ')), 'u3l1-halo u3l1-big'));
    const L = [
      lineIn(Pn, `One full turn: ${TD(360)}, back on the initial arm.`),
      lineIn(Pn, `Then ${T('480^\\circ-360^\\circ=120^\\circ')} more.`),
      lineIn(Pn, `Same arm as ${T(cB('120^\\circ'))}, in <b>quadrant 2</b>.`, 'u3l1-line-key')
    ];
    return [
      { cap: `Turn counterclockwise one <b>full turn</b>: ${TD(360)} brings the arm all the way back to the start.`, run: async (c) => { await T1.go(c, 360, 2000); await show(c, L[0]); } },
      { cap: `Keep going: ${T('480^\\circ-360^\\circ=120^\\circ')} more.`, run: async (c) => { await T1.go(c, 480, 1100); await show(c, thLab); await show(c, L[1]); } },
      { cap: `The arm stops on the <b>same arm as</b> ${T(cB('120^\\circ'))}: subtract the full turn.`, run: async (c) => { same.g.style.opacity = 1; await tween(c, 900, (k) => same.set(120 * k, 0)); await pop(c, sLab); await show(c, L[2]); } }
    ];
  }
};
function standardEx2(stage, ex) {
  const w = (ex.W - 24) / 2, parts = [
    { t: '(a) clockwise ' + TD(135) + ', that is, ' + T('-135^\\circ'), a: -135, same: 225, txt: `Clockwise ${TD(135)} stops in quadrant 3: same arm as ${T(cB('360^\\circ-135^\\circ=225^\\circ'))}.` },
    { t: '(b) counterclockwise ' + TD(420), a: 420, same: 60, txt: `One full turn, then ${T('420^\\circ-360^\\circ=60^\\circ')} more, into quadrant 1: same arm as ${T(cB('60^\\circ'))}.` }
  ].map((d, i) => {
    const x0 = 8 + i * (w + 8);
    div(stage, 'u3l1-ptitle', d.t, x0 + 8, 6);
    const D = new Dial(stage, { x: x0, y: 34, w, h: 290, R: 112, cx: w / 2, cy: 148, ext: 140, exty: 130 });
    const arm = D.arm(0, { r: 122 }), rot = D.rot(0, 0, { r: 34, grow: d.a > 360 ? 24 : 0 });
    const ro = readout(stage, x0 + 10, 44, '\\theta', 'u3l1-ro-sm');
    const same = D.rot(0, d.same, { r: d.a > 360 ? 88 : 74, color: BL, dash: '7 6', width: 3 }); same.g.style.opacity = 0;
    const sLab = hide(D.labAt(d.same / 2, (d.a > 360 ? 88 : 74) + 22, T(cB(dg(d.same))), 'u3l1-halo'));
    const txt = hide(div(stage, 'u3l1-ptext', d.txt, x0 + 8, 330, w - 16));
    const paint = (t) => { arm.set(t); rot.set(t, 0); ro.set(t); };
    return { d, T1: turner(paint), same, sLab, txt };
  });
  const [A, B] = parts;
  return [
    { cap: `(a) Turn <b>clockwise</b> ${TD(135)}: a negative angle, ${T(cA('-135^\\circ'))}. It stops in quadrant 3.`, run: (c) => A.T1.go(c, -135, 1200) },
    { cap: `(a) Counterclockwise to the same arm: ${T(cB('360^\\circ-135^\\circ=225^\\circ'))}.`, run: async (c) => { A.same.g.style.opacity = 1; await tween(c, 1000, (k) => A.same.set(225 * k, 0)); await pop(c, A.sLab); await show(c, A.txt); } },
    { cap: `(b) Turn counterclockwise ${TD(420)}: one full turn of ${TD(360)}, and then some.`, run: (c) => B.T1.go(c, 420, 2000) },
    { cap: `(b) The extra ${T('420^\\circ-360^\\circ=60^\\circ')} stops in quadrant 1. Same arm as ${T(cB('60^\\circ'))}.`, run: async (c) => { B.same.g.style.opacity = 1; await tween(c, 700, (k) => B.same.set(60 * k, 0)); await pop(c, B.sLab); await show(c, B.txt); } }
  ];
}

/* =============================== explainer: quadrants =============================== */
const QRANGE = { 1: '0^\\circ<\\theta<90^\\circ', 2: '90^\\circ<\\theta<180^\\circ', 3: '180^\\circ<\\theta<270^\\circ', 4: '270^\\circ<\\theta<360^\\circ' };
const quadrants = {
  title: 'Quadrants and quadrantal angles',
  height: 400, minW: 900,
  choices: [{ v: 'quads', label: 'The four quadrants' }, { v: 'axes', label: 'Quadrantal angles' }, { v: 's300', label: 'Sketch 300°' }, { sep: 'Check:' }, { v: 'ex1', label: 'Example 1 check' }],
  ask: (v) => ({
    quads: 'How are the quadrants numbered, and which angles land in each?',
    axes: 'Where does the terminal arm land for 90°, 180°, 270° and 360°?',
    s300: `Sketch ${TD(300)} in standard position. Where does it stop?`,
    ex1: 'Example 1: sketch each angle in standard position and state where its terminal arm lies.'
  }[v]),
  make(stage, v, ex) {
    if (v === 'ex1') return quadEx1(stage, ex);
    const D = new Dial(stage, { x: 8, y: 4, w: 480, h: 392, R: 160, cx: 240, cy: 200, ext: 205, exty: 178 });
    const ro = readout(stage, 18, 14);
    const arm = D.arm(0, { r: 172 }), rot = D.rot(0, 0, { r: 44 });
    const paint = (t) => { arm.set(t); rot.set(t, 0); ro.set(t); };
    const T1 = turner(paint);
    const Pn = panel(stage, 512, 18, ex.W - 530, 360, '');
    const qLab = {}; [[1, 1, -1], [2, -1, -1], [3, -1, 1], [4, 1, 1]].forEach(([k, sx, sy]) => (qLab[k] = hide(D.lab(D.cx + sx * 140, D.cy + sy * 30, `Quadrant ${k}`, 'c', 'u3l1-word u3l1-qlab'))));
    const tag = (a, txt, pos) => { const [x, y] = D.P(a, a % 180 === 0 ? 168 : 150); return hide(D.lab(x + (a === 90 || a === 270 ? 10 : 0), y + (a % 180 === 0 ? -8 : 0), txt, pos, 'u3l1-tag')); };
    if (v === 'quads') {
      const L = [1, 2, 3, 4].map((k) => lineIn(Pn, `<b>Quadrant ${k}</b>: ${T(QRANGE[k])}`));
      const n = lineIn(Pn, `Numbered <b>counterclockwise</b>, starting from the positive ${XA}.`, 'u3l1-line-key');
      const step = (k) => async (c) => { await T1.go(c, 90 * k - 45, 900); D.fillQ(0, false); D.fillQ(k, true); await show(c, qLab[k]); await show(c, L[k - 1]); };
      return [
        { cap: `Between ${TD(0)} and ${TD(90)} the arm is in <b>quadrant 1</b>.`, run: step(1) },
        { cap: `Between ${TD(90)} and ${TD(180)}: <b>quadrant 2</b>.`, run: step(2) },
        { cap: `Between ${TD(180)} and ${TD(270)}: <b>quadrant 3</b>.`, run: step(3) },
        { cap: `Between ${TD(270)} and ${TD(360)}: <b>quadrant 4</b>.`, run: step(4) },
        { cap: `The quadrants are numbered <b>counterclockwise</b>, the same way the terminal arm turns.`, run: async (c) => { D.fillQ(0, false); for (const k of [1, 2, 3, 4]) { D.fillQ(k, true); await sleep(c, 220); } await show(c, n); } }
      ];
    }
    if (v === 'axes') {
      const tags = { 90: tag(90, TD(90), 'e'), 180: tag(180, TD(180), 'n'), 270: tag(270, TD(270), 'e'), 360: tag(0, `${TD(0)}, ${TD(360)}`, 'n') };
      const L = lineIn(Pn, `An angle whose terminal arm lies <b>on an axis</b> is a <b>quadrantal angle</b>: ${T('0^\\circ,\\ 90^\\circ,\\ 180^\\circ,\\ 270^\\circ,\\ 360^\\circ')}.`);
      const L2 = lineIn(Pn, 'A quadrantal angle is <b>not in any quadrant</b>.', 'u3l1-line-key');
      const L3 = lineIn(Pn, `${TD(0)} and ${TD(360)} share the same arm: the positive ${XA}.`);
      return [
        { cap: `${TD(90)}: the arm lies on the positive ${YA}. It is on an axis, not in a quadrant.`, run: async (c) => { await T1.go(c, 90, 900); await pop(c, tags[90]); await show(c, L); } },
        { cap: `${TD(180)}: on the negative ${XA}.`, run: async (c) => { await T1.go(c, 180, 900); await pop(c, tags[180]); } },
        { cap: `${TD(270)}: on the negative ${YA}.`, run: async (c) => { await T1.go(c, 270, 900); await pop(c, tags[270]); await show(c, L2); } },
        { cap: `${TD(360)}: a full turn, back on the positive ${XA}, the same arm as ${TD(0)}.`, run: async (c) => { await T1.go(c, 360, 900); await pop(c, tags[360]); await show(c, L3); } }
      ];
    }
    // sketch 300°
    const tags = [tag(90, TD(90), 'e'), tag(180, TD(180), 'n'), tag(270, TD(270), 'e')];
    const ghost = D.arm(315, { r: 172, color: '#9aa0ab', width: 3, dash: '6 6' }); ghost.g.style.opacity = 0;
    const gLab = hide(D.labAt(315, 196, T('315^\\circ'), 'u3l1-gray'));
    const L = [
      lineIn(Pn, `Start on the positive ${XA}, turn counterclockwise.`),
      lineIn(Pn, `Pass ${TD(90)}, ${TD(180)}, ${TD(270)}.`),
      lineIn(Pn, `${T('300^\\circ=270^\\circ+30^\\circ')}: <b>quadrant 4</b>.`, 'u3l1-line-key'),
      lineIn(Pn, `Landmark: halfway through a quadrant is ${TD(45)} past the axis. ${T('270^\\circ+45^\\circ=315^\\circ')}, so ${TD(300)} stops a little before halfway.`)
    ];
    return [
      { cap: `Start on the positive ${XA} and turn <b>counterclockwise</b>.`, run: (c) => show(c, L[0]) },
      { cap: `Count the axes as you pass them: ${TD(90)}, ${TD(180)}, ${TD(270)}.`, run: async (c) => { await show(c, L[1]); for (const [k, a] of [[0, 90], [1, 180], [2, 270]]) { await T1.go(c, a, 700); await pop(c, tags[k]); } } },
      { cap: `${TD(300)} is ${TD(30)} past ${TD(270)}, so it stops in <b>quadrant 4</b>.`, run: async (c) => { await T1.go(c, 300, 700); D.fillQ(4, true); await show(c, qLab[4]); await show(c, L[2]); } },
      { cap: `Check with a landmark: halfway through quadrant 4 is ${T('270^\\circ+45^\\circ=315^\\circ')}. ${TD(300)} is a little <b>before</b> halfway.`, run: async (c) => { await anim(c, ghost.g, [{ opacity: 0 }, { opacity: 1 }], 400); await show(c, gLab); await show(c, L[3]); } }
    ];
  }
};
function quadEx1(stage, ex) {
  const n = 4, w = (ex.W - 16) / n, items = [
    { t: '(a) ' + TD(160), a: 160, q: 2, ans: 'Quadrant 2', why: `between ${TD(90)} and ${TD(180)}` },
    { t: '(b) ' + TD(245), a: 245, q: 3, ans: 'Quadrant 3', why: `between ${TD(180)} and ${TD(270)}` },
    { t: '(c) ' + TD(335), a: 335, q: 4, ans: 'Quadrant 4', why: `between ${TD(270)} and ${TD(360)}` },
    { t: '(d) ' + TD(90), a: 90, q: 0, ans: `On the positive ${YA}`, why: 'quadrantal' }
  ].map((d, i) => {
    const x0 = 8 + i * w;
    div(stage, 'u3l1-ptitle', d.t, x0 + 10, 8);
    const D = new Dial(stage, { x: x0, y: 40, w: w - 6, h: 250, R: 92, cx: (w - 6) / 2, cy: 130, ext: 106, exty: 104 });
    const arm = D.arm(0, { r: 100, width: 4.5 }), rot = D.rot(0, 0, { r: 28, width: 2.6, hl: 10, hw: 5 });
    const ans = hide(div(stage, 'u3l1-ptext u3l1-center', `<b>${d.ans}</b><br><span class="muted">${d.why}</span>`, x0 + 4, 304, w - 14));
    const paint = (t) => { arm.set(t); rot.set(t, 0); };
    return { d, D, T1: turner(paint), ans };
  });
  return items.map((it) => ({
    cap: `${it.d.t}: ${it.d.q ? `${it.d.why}, so the terminal arm is in <b>quadrant ${it.d.q}</b>.` : `the arm stops on the positive ${YA}: a <b>quadrantal</b> angle, not in any quadrant.`}`,
    run: async (c) => { await it.T1.go(c, it.d.a, 1000); if (it.d.q) it.D.fillQ(it.d.q, true); await show(c, it.ans); }
  }));
}

/* =============================== explainer: a point on the terminal arm =============================== */
const SIGN = { 1: ['+', '+'], 2: ['-', '+'], 3: ['-', '-'], 4: ['+', '-'] };
const EX3 = { a: { n: 'A', x: -6, y: 2, th: 161.6, q: 2 }, b: { n: 'B', x: 1, y: -3, th: 288.4, q: 4 }, c: { n: 'C', x: -2, y: -5, th: 248.2, q: 3 } };
const points = {
  title: 'A point on the terminal arm',
  height: 420, minW: 900,
  choices: [{ v: 'signs', label: 'Signs in each quadrant' }, { sep: 'Check:' }, { v: 'a', label: 'Example 3 (a)' }, { v: 'b', label: 'Example 3 (b)' }, { v: 'c', label: 'Example 3 (c)' }],
  ask: (v) => (v === 'signs' ? `How do the signs of ${T('x')} and ${T('y')} tell you the quadrant?` : `Example 3 (${v}): ${T(`${EX3[v].n}(${EX3[v].x},\\ ${EX3[v].y})`)} is on the terminal arm of ${T('\\theta')}. Plot it, draw ${T('\\theta')} and state its quadrant.`),
  make(stage, v, ex) {
    const G = new Graph(stage, { x: 10, y: 6, width: 408, height: 408, xmin: -7, xmax: 7, ymin: -7, ymax: 7, xlabels: 2, ylabels: 2 });
    const Pn = panel(stage, 444, 18, ex.W - 462, 384, '');
    const [ox, oy] = G.toPx(0, 0), qr = {};
    const [x7, y7] = G.toPx(7, 7), [xm, ym] = G.toPx(-7, -7);
    [[1, ox, y7, x7 - ox, oy - y7], [2, xm, y7, ox - xm, oy - y7], [3, xm, oy, ox - xm, ym - oy], [4, ox, oy, x7 - ox, ym - oy]].forEach(([k, x, y, w, hh]) => { const r = svgEl('rect', { x, y, width: w, height: hh, fill: QF }, G.layers.bg); r.style.opacity = 0; qr[k] = r; });
    const fillQ = (k) => { for (const j of [1, 2, 3, 4]) qr[j].style.opacity = j === k ? 1 : 0; };
    if (v === 'signs') {
      const stick = {}; [[1, 3.6, 3.6], [2, -3.6, 3.6], [3, -3.6, -3.6], [4, 3.6, -3.6]].forEach(([k, x, y]) => (stick[k] = hide(G.label(x, y, T(`(${SIGN[k][0]},\\ ${SIGN[k][1]})`), { cls: 'u3l1-stick' }))));
      const rows = [1, 2, 3, 4].map((k) => lineIn(Pn, `<b>Quadrant ${k}</b>: ${T(`x${SIGN[k][0] === '+' ? '>' : '<'}0,\\ y${SIGN[k][1] === '+' ? '>' : '<'}0`)}`));
      const pt = G.point(-4, 0, { color: AC, label: T('(-4,\\ 0)'), pos: 'n', labelColor: AC }); pt.style.opacity = 0; pt.label.style.opacity = 0;
      const last = lineIn(Pn, `A point <b>on an axis</b> (a coordinate is 0) is on the arm of a <b>quadrantal</b> angle: ${T('(-4,\\ 0)')} is on the arm of ${TD(180)}.`, 'u3l1-line-key');
      const step = (k, cap) => ({ cap, run: async (c) => { fillQ(k); await pop(c, stick[k]); await show(c, rows[k - 1]); } });
      return [
        step(1, `Quadrant 1: right of the ${YA} and above the ${XA}, so ${T('x>0')} and ${T('y>0')}.`),
        step(2, `Quadrant 2: left, so ${T('x<0')}; above, so ${T('y>0')}.`),
        step(3, `Quadrant 3: left and below: ${T('x<0')} and ${T('y<0')}.`),
        step(4, `Quadrant 4: right and below: ${T('x>0')} and ${T('y<0')}.`),
        { cap: `On an axis, one coordinate is 0: ${T('(-4,\\ 0)')} is on the negative ${XA}, the arm of ${TD(180)}.`, run: async (c) => { fillQ(0); pt.style.opacity = 1; await pop(c, pt); pt.label.style.opacity = 1; await show(c, pt.label); await show(c, last); } }
      ];
    }
    const d = EX3[v], name = `${d.n}(${d.x},\\ ${d.y})`;
    const gd = G.guides(d.x, d.y); gd.style.opacity = 0;
    const pt = G.point(d.x, d.y, { color: AC, label: T(name), pos: d.y > 0 ? 'n' : 's', labelColor: AC }); pt.style.opacity = 0; pt.label.style.opacity = 0;
    const s = Math.min(1.2, 6.8 / Math.max(Math.abs(d.x), Math.abs(d.y))), [ex2, ey2] = G.toPx(d.x * s, d.y * s);
    const armL = svgEl('line', { x1: ox, y1: oy, x2: ox, y2: oy, stroke: AC, 'stroke-width': 4.5, 'stroke-linecap': 'round' }, G.layers.data);
    const arcP = svgEl('path', { fill: 'none', stroke: AC, 'stroke-width': 3 }, G.layers.data), arcH = svgEl('polygon', { fill: AC }, G.layers.data);
    const thLab = hide(div(G.html, 'u3l1-lab u3l1-halo', T(cA('\\theta'))));
    const mid = arcPx(ox, oy, 52, d.th / 2, d.th / 2)[0]; place(thLab, mid[0], mid[1], 'c', 0);
    const sx = d.x < 0 ? '<' : '>', sy = d.y < 0 ? '<' : '>';
    const L = [
      lineIn(Pn, `${T(name)}: ${Math.abs(d.x)} ${d.x < 0 ? 'left' : 'right'}, ${Math.abs(d.y)} ${d.y < 0 ? 'down' : 'up'}.`),
      lineIn(Pn, `Signs: ${T(`x${sx}0,\\ y${sy}0`)}.`),
      lineIn(Pn, `Terminal arm: from the origin through ${T(d.n)}.`),
      lineIn(Pn, `${T(`x${sx}0,\\ y${sy}0`)}: <b>quadrant ${d.q}</b>`, 'u3l1-line-key'),
      lineIn(Pn, `${T(`\\theta\\approx${dg(Math.round(d.th))}`)}. Lesson 2 shows how to find it.`, 'u3l1-line-sm muted')
    ];
    return [
      { cap: `Plot ${T(name)}: ${Math.abs(d.x)} ${d.x < 0 ? 'left' : 'right'} and ${Math.abs(d.y)} ${d.y < 0 ? 'down' : 'up'}.`, run: async (c) => { gd.style.opacity = 1; await G.reveal(gd, c); pt.style.opacity = 1; await pop(c, pt); pt.label.style.opacity = 1; await show(c, pt.label); await show(c, L[0]); } },
      { cap: `Look at the signs: ${T(`x${sx}0`)} and ${T(`y${sy}0`)}.`, run: (c) => show(c, L[1]) },
      { cap: `The <b>terminal arm</b> starts at the origin and passes through ${T(d.n)}.`, run: async (c) => { await tween(c, 700, (k) => { armL.setAttribute('x2', ox + (ex2 - ox) * k); armL.setAttribute('y2', oy + (ey2 - oy) * k); }); await show(c, L[2]); } },
      { cap: `${T('\\theta')} turns counterclockwise from the positive ${XA} to the arm: it stops in <b>quadrant ${d.q}</b>.`, run: async (c) => {
        await tween(c, 1100, (k) => { const pts = arcPx(ox, oy, 30, 0, d.th * k); arcP.setAttribute('d', pathOf(pts)); const p = pts[pts.length - 1], q = pts[pts.length - 2]; arcH.setAttribute('points', d.th * k > 8 ? headPts(p[0], p[1], p[0] - q[0], p[1] - q[1], 12, 6) : ''); });
        fillQ(d.q); await show(c, thLab); await show(c, L[3]); await show(c, L[4]);
      } }
    ];
  }
};

/* =============================== explainer (STAR): sweep the arm, watch the reference angle =============================== */
const EX4 = [205, 118, 289, 47];
const sweep = {
  title: 'The reference angle: always back to the x-axis',
  height: 430, minW: 940, capH: 86,
  choices: [{ v: 'sweep', label: 'Sweep 0° → 360°' }, { v: 'axes', label: 'Quadrantal angles' }, { sep: 'Check:' }, { v: 'ex4', label: 'Example 4 check' }],
  custom: [0, 360],
  ask: (v) => (v === 'sweep' ? `As the terminal arm turns, how far is it from the <b>${XA}</b>?` : v === 'axes' ? 'What is the reference angle when the terminal arm is on an axis?'
    : v === 'ex4' ? `Example 4: sketch each angle and its reference angle. Determine ${T('\\theta_R')}.` : `Find the reference angle of ${TD(v)}.`),
  make(stage, v, ex) {
    const D = new Dial(stage, { x: 6, y: 4, w: 490, h: 422, R: 172, cx: 245, cy: 214, ext: 215, exty: 196 });
    const glow = svgEl('line', { x1: D.cx, y1: D.cy, x2: D.cx, y2: D.cy, stroke: RC, 'stroke-width': 13, 'stroke-linecap': 'round', 'stroke-opacity': 0.35 }, D.lq);
    const wedge = D.wedge(0, 0, { r: 108 }), rot = D.rot(0, 0, { r: 44 });
    const arm = D.arm(0, { r: 186, dot: 11 });
    const hit = svgEl('circle', { r: 26, fill: 'transparent', 'data-tap': '', class: 'u3l1-hit' }, arm.hg);
    const thLab = D.labAt(0, 70, T(cA('\\theta')), 'u3l1-big');
    const refLab = D.labAt(0, 140, '', 'u3l1-halo u3l1-reflab');
    const ro = readout(stage, 14, 12);
    const P = panel(stage, 512, 12, ex.W - 526, 406, '');
    const top = div(P, 'u3l1-qchip', '');
    const rows = [1, 2, 3, 4].map((k) => { const r = h('div', 'u3l1-row', `<span class="u3l1-rq">Q${k}</span><span>${T(['', '\\theta_R=\\theta', '\\theta_R=180^\\circ-\\theta', '\\theta_R=\\theta-180^\\circ', '\\theta_R=360^\\circ-\\theta'][k])}</span>`); P.appendChild(r); return r; });
    const calc = div(P, 'u3l1-calc', '');
    const res = div(P, 'u3l1-res', '');
    let cur = 0;
    const paint = (tt) => {
      const t = Math.max(0, Math.min(360, tt)); cur = t;
      const ti = Math.round(t), info = refOf(ti);
      arm.set(t); rot.set(t, 0); ro.set(t);
      let a = info.a, b = info.b;
      if (info.q === 1) { a = 0; b = t; } else if (info.q === 2) { a = t; b = 180; } else if (info.q === 3) { a = 180; b = t; } else if (info.q === 4) { a = t; b = 360; }
      wedge.set(a, b);
      const gx = info.near === 180 ? D.cx - 205 : D.cx + 205; glow.setAttribute('x2', gx);
      D.move(thLab, t > 2 ? t / 2 : 10, t < 25 ? 60 : 70); thLab.style.opacity = t > 3 ? 1 : 0;
      if (info.ref > 0) {
        const m = (a + b) / 2;
        if (info.ref < 22) { const side = Math.sign(m - info.near) || 1; D.move(refLab, info.near - side * 13, 132); } else D.move(refLab, m, 140); setH(refLab, T(cR(`\\theta_R=${dg(info.ref)}`))); refLab.style.opacity = 1;
      } else refLab.style.opacity = 0;
      setH(top, info.q ? `<b>Quadrant ${info.q}</b>` : `On ${info.axis}: <b>quadrantal</b>`);
      rows.forEach((r, i) => r.classList.toggle('on', info.q === i + 1));
      setH(calc, T(cR(info.calc)));
    };
    const go = (c, b, ms = 1500) => { const a = cur; return tween(c, ms * Math.min(1.5, Math.max(0.5, Math.abs(b - a) / 120)), (k) => paint(a + (b - a) * k)); };
    // drag the arm (the dot): finger or Pencil
    let drag = null;
    const angAt = (e) => { const r = D.svg.getBoundingClientRect(), sc = D.o.w / r.width, px = (e.clientX - r.left) * sc, py = (e.clientY - r.top) * sc; let a = Math.atan2(D.cy - py, px - D.cx) / D2R; if (a < 0) a += 360; return a; };
    hit.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); drag = e.pointerId; try { hit.setPointerCapture(e.pointerId); } catch (er) { /* */ } });
    hit.addEventListener('pointermove', (e) => { if (drag !== e.pointerId) return; let a = Math.round(angAt(e)); if (cur > 300 && a < 60) a = 360; else if (cur > 330 && a === 0) a = 360; if (cur < 30 && a > 300) a = 0; paint(a); });
    const end = (e) => { if (drag === e.pointerId) drag = null; };
    hit.addEventListener('pointerup', end); hit.addEventListener('pointercancel', end);
    paint(0);
    if (v === 'sweep') {
      return [
        { cap: `<b>Quadrant 1</b>: the arm turns straight up from the ${XA}, so the gap to the ${XA} is the angle itself: ${T(cR('\\theta_R=\\theta'))}.`, run: (c) => go(c, 60) },
        { cap: `Past ${TD(90)}, in <b>quadrant 2</b>, the nearest part of the ${XA} is the <b>negative</b> ${XA} at ${TD(180)}: ${T(cR('\\theta_R=180^\\circ-\\theta'))}.`, run: (c) => go(c, 140, 1900) },
        { cap: `Past ${TD(180)}, in <b>quadrant 3</b>, measure <b>back</b> to ${TD(180)}: ${T(cR('\\theta_R=\\theta-180^\\circ'))}.`, run: (c) => go(c, 215, 1700) },
        { cap: `In <b>quadrant 4</b> the nearest part of the ${XA} is the positive ${XA} again, at ${TD(360)}: ${T(cR('\\theta_R=360^\\circ-\\theta'))}.`, run: (c) => go(c, 320, 1700) },
        { cap: `At ${TD(360)}, ${T(cR('\\theta_R=0^\\circ'))}. A reference angle is always between ${TD(0)} and ${TD(90)}, and always measured to the <b>${XA}</b>.`, run: (c) => go(c, 360, 1000) },
        { cap: `Your turn: <b>drag the dot</b> on the terminal arm to any angle and read off ${T(cR('\\theta_R'))}.`, run: async (c) => { await go(c, 250, 900); await pulse(c, arm.hgi, 1.5, 700); } }
      ];
    }
    if (v === 'axes') {
      const cap = (t) => { const i = refOf(t); return `${TD(t)}: the arm is on ${i.axis}, so ${T(cR(`\\theta_R=${dg(i.ref)}`))}${i.ref === 90 ? ` (a quarter turn from the ${XA})` : ` (it lies on the ${XA})`}.`; };
      return [0, 90, 180, 270, 360].map((t) => ({ cap: cap(t), run: (c) => go(c, t, 1100) }));
    }
    if (v === 'ex4') {
      const done = [];
      return EX4.map((t, i) => {
        const info = refOf(t), L = '(' + 'abcd'[i] + ')';
        return { cap: `${L} ${TD(t)} is in <b>quadrant ${info.q}</b>: ${T(cR(info.calc))}.`, run: async (c) => {
          await go(c, t, 1500); done[i] = `<div><b>${L}</b> ${T(dg(t))} → ${T(cR(dg(info.ref)))}</div>`; setH(res, done.filter(Boolean).join('')); await pulse(c, calc, 1.08);
        } };
      });
    }
    const t = Number(v), info = refOf(t);
    return [
      { cap: `Turn the terminal arm to ${TD(t)}.`, run: (c) => go(c, t, 1500) },
      { cap: info.q ? `${TD(t)} is in <b>quadrant ${info.q}</b>: ${T(cR(info.f))}.` : `${TD(t)} is a quadrantal angle: the arm is on ${info.axis}.`, run: (c) => (info.q ? pulse(c, rows[info.q - 1], 1.05) : pulse(c, top, 1.08)) },
      { cap: `${T(cR(info.calc))}`, run: (c) => pulse(c, calc, 1.1) }
    ];
  }
};

/* =============================== explainer: working backwards =============================== */
const EX5 = [{ r: 35, q: 3 }, { r: 72, q: 2 }, { r: 16, q: 4 }, { r: 50, q: 1 }, { r: 0, ax: 180, where: `negative ${XA}` }, { r: 90, ax: 270, where: `negative ${YA}` }];
const backwards = {
  title: 'Working backwards: from θR to θ',
  height: 410, minW: 920,
  choices: [{ v: 'c20', label: '20° in quadrant 3' }, { v: 'c65', label: '65° in quadrant 4' }, { sep: 'Check:' }, { v: 'ex5', label: 'Example 5 check' }],
  ask: (v) => (v === 'ex5' ? `Example 5: determine the rotation angle ${T('\\theta')}, ${T('0^\\circ\\le\\theta\\le360^\\circ')}, from the reference angle and where the terminal arm lies.`
    : `The reference angle is ${TD(v === 'c20' ? 20 : 65)} and the terminal arm is in quadrant ${v === 'c20' ? 3 : 4}. Find ${T('\\theta')}.`),
  make(stage, v, ex) {
    if (v === 'ex5') return backEx5(stage, ex);
    const r = v === 'c20' ? 20 : 65, q = v === 'c20' ? 3 : 4, th = fromRef(r, q), near = q === 3 ? 180 : 360;
    const D = new Dial(stage, { x: 6, y: 4, w: 480, h: 402, R: 165, cx: 240, cy: 205, ext: 205, exty: 185 });
    const qLab = hide(D.lab(D.cx + (q === 4 ? 1 : -1) * 120, D.cy + 140, `Quadrant ${q}`, 'c', 'u3l1-word u3l1-qlab'));
    const nearDot = svgEl('circle', { cx: near === 180 ? D.cx - 165 : D.cx + 165, cy: D.cy, r: 8, fill: RC }, D.ltop); nearDot.style.opacity = 0;
    const nearLab = hide(D.lab(near === 180 ? D.cx - 165 : D.cx + 165, D.cy - 12, TD(near), 'n', 'u3l1-tag'));
    const a0 = q === 3 ? 180 : 360, a1 = q === 3 ? 180 + r : 360 - r;
    const wedge = D.wedge(a0, a0, { r: 112 }), arm = D.arm(a0, { r: 178 }); arm.g.style.opacity = 0;
    const rLab = hide(D.labAt((a0 + a1) / 2, 140, T(cR(dg(r))), 'u3l1-halo'));
    const rot = D.rot(0, 0, { r: 46 }), thLab = hide(D.labAt(th / 2, 74, T(cA(`\\theta=${dg(th)}`)), 'u3l1-halo'));
    const Pn = panel(stage, 508, 14, ex.W - 522, 382, '');
    const L = [
      lineIn(Pn, `${T(cR(`\\theta_R=${dg(r)}`))}, arm in <b>quadrant ${q}</b>.`),
      lineIn(Pn, `Quadrant ${q} meets the ${XA} at ${TD(near)}. Turn ${TD(r)} from there, <b>into</b> quadrant ${q}.`),
      lineIn(Pn, `${T(cA(`\\theta=${FROM[q](r)}`))}`, 'u3l1-line-key u3l1-line-big'),
      lineIn(Pn, `<div class="u3l1-ph">In each quadrant</div>Q1: ${T('\\theta=\\theta_R')} · Q2: ${T('\\theta=180^\\circ-\\theta_R')}<br>Q3: ${T('\\theta=180^\\circ+\\theta_R')} · Q4: ${T('\\theta=360^\\circ-\\theta_R')}`, 'u3l1-line-sm')
    ];
    return [
      { cap: `The terminal arm is somewhere in <b>quadrant ${q}</b>, ${TD(r)} from the ${XA}.`, run: async (c) => { D.fillQ(q, true); await show(c, qLab); await show(c, L[0]); } },
      { cap: `Quadrant ${q} touches the ${XA} at ${TD(near)}. The reference angle is measured from <b>there</b>.`, run: async (c) => { nearDot.style.opacity = 1; await pop(c, nearDot); await show(c, nearLab); } },
      { cap: `Turn ${T(cR(dg(r)))} away from ${TD(near)}, into quadrant ${q}: that places the terminal arm.`, run: async (c) => { arm.g.style.opacity = 1; await tween(c, 900, (k) => { const b = a0 + (a1 - a0) * k; arm.set(b); wedge.set(Math.min(a0, b), Math.max(a0, b)); }); await show(c, rLab); await show(c, L[1]); } },
      { cap: `Now measure ${T('\\theta')} from the <b>positive</b> ${XA}: ${T(cA(`\\theta=${FROM[q](r)}`))}.`, run: async (c) => { await tween(c, 1500, (k) => rot.set(th * k, 0)); await show(c, thLab); await show(c, L[2]); } },
      { cap: 'The same thinking in every quadrant gives these rules. A quick sketch tells you which one to use.', run: (c) => show(c, L[3]) }
    ];
  }
};
function backEx5(stage, ex) {
  const D = new Dial(stage, { x: 4, y: 4, w: 400, h: 400, R: 140, cx: 200, cy: 202, ext: 178, exty: 172 });
  const wedge = D.wedge(0, 0, { r: 96 }), arm = D.arm(0, { r: 152 }), rot = D.rot(0, 0, { r: 40 });
  arm.g.style.opacity = 0;
  const rLab = D.labAt(0, 120, '', 'u3l1-halo'); rLab.style.opacity = 0;
  const tb = div(stage, 'u3l1-tb', '', 420, 10, ex.W - 432);
  tb.innerHTML = `<div class="u3l1-tr u3l1-th"><span>${T('\\theta_R')}</span><span>Terminal arm</span><span>Rotation angle ${T('\\theta')}</span></div>`;
  const rows = EX5.map((d) => {
    const r = h('div', 'u3l1-tr', `<span>${T(cR(dg(d.r)))}</span><span>${d.q ? 'quadrant ' + d.q : d.where}</span><span class="u3l1-tv"></span>`); tb.appendChild(r);
    d.th = d.q ? fromRef(d.r, d.q) : d.ax; d.calc = d.q ? FROM[d.q](d.r) : dg(d.ax);
    return r;
  });
  return EX5.map((d, i) => ({
    cap: d.q ? `${T(cR(dg(d.r)))} in quadrant ${d.q}: ${T(cA(`\\theta=${d.calc}`))}.` : `${T(cR(dg(d.r)))} on the ${d.where}: the arm is on an axis, so ${T(cA(`\\theta=${dg(d.ax)}`))}.`,
    run: async (c) => {
      rows.forEach((r, j) => r.classList.toggle('on', j === i));
      D.fillQ(0, false); if (d.q) D.fillQ(d.q, true);
      arm.g.style.opacity = 1;
      const from = arm.a, to = d.th;
      const info = refOf(to);
      rLab.style.opacity = 0;
      await tween(c, 1100, (k) => { const t = from + (to - from) * k; arm.set(t); rot.set(t, 0); });
      wedge.set(info.a, info.b);
      if (d.r > 0) { D.move(rLab, (info.a + info.b) / 2, d.r < 22 ? 170 : 122); setH(rLab, T(cR(dg(d.r)))); await show(c, rLab); }
      const cell = rows[i].querySelector('.u3l1-tv'); setH(cell, T(cA(d.calc))); await pop(c, cell);
    }
  }));
}

/* =============================== explainer: four angles with one reference angle =============================== */
const four = {
  title: 'Four angles, one reference angle',
  height: 420, minW: 920,
  choices: [{ v: 30, label: 'θR = 30°' }, { v: 55, label: 'θR = 55°' }, { sep: 'Check:' }, { v: 'a', label: 'Example 6 (a) 128°' }, { v: 'b', label: 'Example 6 (b) 341°' }],
  ask: (v) => (v === 'a' || v === 'b' ? `Example 6 (${v}): determine the three other angles from ${TD(0)} to ${TD(360)} with the same reference angle as ${TD(v === 'a' ? 128 : 341)}.`
    : `Which angles from ${TD(0)} to ${TD(360)} have a reference angle of ${TD(v)}?`),
  make(stage, v, ex) {
    const given = v === 'a' ? 128 : v === 'b' ? 341 : null;
    const r = given ? refOf(given).ref : Number(v), q0 = given ? refOf(given).q : 1;
    const D = new Dial(stage, { x: 6, y: 4, w: 500, h: 412, R: 162, cx: 250, cy: 206, ext: 214, exty: 190 });
    const SG = { 1: [1, 1], 2: [-1, 1], 3: [-1, -1], 4: [1, -1] };
    const bx = D.R * Math.cos(r * D2R), by = D.R * Math.sin(r * D2R);
    const tris = {};
    const mkTri = (q) => {
      const g = svgEl('g', {}, D.lref); g.style.opacity = 0;
      const poly = svgEl('polygon', { fill: RC, 'fill-opacity': 0.2, stroke: 'none' }, g);
      const leg = svgEl('line', { stroke: RC, 'stroke-width': 2.5, 'stroke-dasharray': '6 5' }, g);
      const arc = svgEl('path', { fill: 'none', stroke: RC, 'stroke-width': 3.2 }, g);
      const hyp = svgEl('line', { x1: D.cx, y1: D.cy, stroke: AC, 'stroke-width': 5, 'stroke-linecap': 'round' }, D.larm); hyp.style.opacity = 0;
      const T0 = { g, hyp, set: (fx, fy) => {
        const P = [D.cx + bx * fx, D.cy - by * fy], F = [D.cx + bx * fx, D.cy];
        poly.setAttribute('points', `${D.cx},${D.cy} ${F[0].toFixed(1)},${F[1]} ${P[0].toFixed(1)},${P[1].toFixed(1)}`);
        leg.setAttribute('x1', F[0]); leg.setAttribute('y1', F[1]); leg.setAttribute('x2', P[0]); leg.setAttribute('y2', P[1]);
        hyp.setAttribute('x2', D.cx + (bx * fx) * 1.12); hyp.setAttribute('y2', D.cy - (by * fy) * 1.12);
        if (Math.abs(fx) > 0.98 && Math.abs(fy) > 0.98) { const a0 = fx > 0 ? (fy > 0 ? 0 : 360 - r) : 180 - (fy > 0 ? r : -r), a1 = fx > 0 ? (fy > 0 ? r : 360) : 180; arc.setAttribute('d', pathOf(D.arcPts(54, Math.min(a0, a1), Math.max(a0, a1)))); } else arc.setAttribute('d', '');
      } };
      T0.set(...SG[q]); tris[q] = T0; return T0;
    };
    [1, 2, 3, 4].forEach(mkTri);
    const angLab = {}, refLab = {};
    [1, 2, 3, 4].forEach((q) => {
      const th = fromRef(r, q), [sx, sy] = SG[q];
      const [px, py] = [D.cx + bx * sx * 1.12, D.cy - by * sy * 1.12];
      angLab[q] = hide(D.lab(px + sx * 8, py - sy * 6, T(cA(dg(th))), (sy > 0 ? 'n' : 's') + (sx > 0 ? 'e' : 'w'), 'u3l1-halo u3l1-big'));
      const mid = q === 1 ? r / 2 : q === 2 ? 180 - r / 2 : q === 3 ? 180 + r / 2 : 360 - r / 2;
      refLab[q] = hide(D.labAt(mid, r < 30 ? 96 : 84, T(cR(dg(r))), 'u3l1-halo'));
    });
    const rot = D.rot(0, 0, { r: 32 });
    const Pn = panel(stage, 528, 14, ex.W - 542, 392, '');
    const row = {}; [1, 2, 3, 4].forEach((q) => (row[q] = lineIn(Pn, `<b>Q${q}</b>: ${T(cA(`\\theta=${FROM[q](r)}`))}`)));
    const sum = lineIn(Pn, `${T(`${dg(r)},\\ ${dg(180 - r)},\\ ${dg(180 + r)},\\ ${dg(360 - r)}`)}: all four have ${T(cR(`\\theta_R=${dg(r)}`))}.`, 'u3l1-line-key');
    const showQ = async (c, q) => { const T0 = tris[q]; T0.g.style.opacity = 1; T0.hyp.style.opacity = 1; await anim(c, T0.g, [{ opacity: 0 }, { opacity: 1 }], 350); await show(c, refLab[q]); await show(c, angLab[q]); await show(c, row[q]); await tween(c, 700, (k) => rot.set(fromRef(r, q) * k, 0)); };
    const flip = async (c, from, to) => {
      const T0 = tris[to], [ax, ay] = SG[from], [bx2, by2] = SG[to];
      T0.set(ax, ay); T0.g.style.opacity = 1; T0.hyp.style.opacity = 1; rot.set(0, 0);
      await tween(c, 1100, (k) => T0.set(ax + (bx2 - ax) * k, ay + (by2 - ay) * k));
      T0.set(bx2, by2); await show(c, refLab[to]); await show(c, angLab[to]); await show(c, row[to]);
      await tween(c, 800, (k) => rot.set(fromRef(r, to) * k, 0));
    };
    const axisWord = (from, to) => (SG[from][0] !== SG[to][0] ? YA : XA);
    if (!given) {
      return [
        { cap: `Quadrant 1: turn ${T(cR(dg(r)))} up from the ${XA}. Here ${T(cA(`\\theta=${dg(r)}`))}.`, run: (c) => showQ(c, 1) },
        { cap: `Flip it across the ${YA} into quadrant 2. Still ${T(cR(dg(r)))} from the ${XA}: ${T(cA(`\\theta=${FROM[2](r)}`))}.`, run: (c) => flip(c, 1, 2) },
        { cap: `Flip across the ${XA} into quadrant 3: ${T(cA(`\\theta=${FROM[3](r)}`))}.`, run: (c) => flip(c, 2, 3) },
        { cap: `Flip across the ${YA} into quadrant 4: ${T(cA(`\\theta=${FROM[4](r)}`))}.`, run: (c) => flip(c, 3, 4) },
        { cap: `Four angles from ${TD(0)} to ${TD(360)}, one reference angle: ${T(`${dg(r)},\\ ${dg(180 - r)},\\ ${dg(180 + r)},\\ ${dg(360 - r)}`)}.`, run: async (c) => { rot.set(0, 0); await show(c, sum); } }
      ];
    }
    const info = refOf(given), order = q0 === 2 ? [[2, 1], [2, 3], [3, 4]] : [[4, 1], [1, 2], [2, 3]];
    return [
      { cap: `${TD(given)} is in quadrant ${q0}: ${T(cR(info.calc))}.`, run: (c) => showQ(c, q0) },
      ...order.map(([f, t]) => ({ cap: `Flip across the ${axisWord(f, t)} into quadrant ${t}: ${T(cA(t === 1 ? `\\theta=${dg(r)}` : `\\theta=${FROM[t](r)}`))}.`, run: (c) => flip(c, f, t) })),
      { cap: `The three other angles: ${T([1, 2, 3, 4].filter((q) => q !== q0).map((q) => dg(fromRef(r, q))).join(',\\ '))}.`, run: async (c) => { rot.set(0, 0); await show(c, sum); } }
    ];
  }
};

/* =============================== explainer: reflecting a point in the axes =============================== */
const REF = {
  gen: { x: 4, y: 3, th: null },
  p43: { x: 4, y: 3, th: 37 },
  ex7: { x: 3, y: 5, th: 59 }
};
const reflect = {
  title: 'Reflecting a point in the axes',
  height: 420, minW: 920, capH: 86,
  choices: [{ v: 'gen', label: 'P(a, b) in general' }, { v: 'p43', label: 'P(4, 3), θ ≈ 37°' }, { sep: 'Check:' }, { v: 'ex7', label: 'Example 7 check' }],
  ask: (v) => (v === 'ex7' ? `Example 7: ${T('P(3,\\ 5)')} is on the terminal arm of ${TD(59)}. Reflect it in the ${YA}, in both axes and in the ${XA}. Which rotation angles pass through the images?`
    : v === 'gen' ? `${T('P(a,\\ b)')}, with ${T('a,\\ b>0')}, is on the terminal arm of ${T('\\theta')}. Where do its reflections land?` : `${T('P(4,\\ 3)')} is on the terminal arm of about ${TD(37)}. Which angles pass through its reflections?`),
  make(stage, v, ex) {
    const d = REF[v], gen = v === 'gen';
    const G = new Graph(stage, { x: 8, y: 6, width: 408, height: 408, xmin: -7, xmax: 7, ymin: -7, ymax: 7, numbers: !gen, xlabels: 2, ylabels: 2 });
    const Pn = panel(stage, 440, 14, ex.W - 454, 392, '');
    const [ox, oy] = G.toPx(0, 0), ux = G.ux;
    const ang0 = gen ? Math.atan2(d.y, d.x) / D2R : d.th;
    const thS = (q) => (gen ? ['\\theta', '180^\\circ-\\theta', '180^\\circ+\\theta', '360^\\circ-\\theta'][q - 1] : FROM[q](d.th).split('=').pop());
    const calcS = (q) => (gen ? thS(q) : FROM[q](d.th));
    const nm = (n, sx, sy) => (gen ? `${n}(${sx < 0 ? '-' : ''}a,\\ ${sy < 0 ? '-' : ''}b)` : `${n}(${sx * d.x},\\ ${sy * d.y})`);
    const armTo = (x, y, color, w = 4) => { const s = Math.min(1.25, 6.8 / Math.max(Math.abs(x), Math.abs(y))), [a, b] = G.toPx(x * s, y * s); const l = svgEl('line', { x1: ox, y1: oy, x2: a, y2: b, stroke: color, 'stroke-width': w, 'stroke-linecap': 'round' }, G.layers.data); return l; };
    const setArm = (l, x, y) => { const s = Math.min(1.25, 6.8 / Math.max(Math.abs(x), Math.abs(y), 0.01)), [a, b] = G.toPx(x * s, y * s); l.setAttribute('x2', a); l.setAttribute('y2', b); };
    const refArc = (q) => { // amber arc at the vertex between the arm and the nearest x-axis
      const th = q === 1 ? ang0 : q === 2 ? 180 - ang0 : q === 3 ? 180 + ang0 : 360 - ang0, near = q === 1 ? 0 : q === 4 ? 360 : 180;
      const p = svgEl('path', { d: pathOf(arcPx(ox, oy, 42, Math.min(th, near), Math.max(th, near))), fill: 'none', stroke: RC, 'stroke-width': 3.5 }, G.layers.data); p.style.opacity = 0;
      const m = arcPx(ox, oy, 66, (th + near) / 2, (th + near) / 2)[0], l = hide(div(G.html, 'u3l1-lab u3l1-halo u3l1-sm', T(cR(gen ? '\\theta' : dg(d.th))))); place(l, m[0], m[1], 'c', 0);
      return { p, l };
    };
    const SG = { 1: [1, 1], 2: [-1, 1], 3: [-1, -1], 4: [1, -1] }, NM = { 1: 'P', 2: 'Q', 3: 'R', 4: 'S' };
    const P0 = G.point(d.x, d.y, { color: INK, label: T(nm('P', 1, 1)), pos: 'ne' });
    armTo(d.x, d.y, INK);
    const ra1 = refArc(1);
    const rows = {};
    rows[1] = lineIn(Pn, `${T(nm('P', 1, 1))}: quadrant 1, ${T(gen ? '\\theta' : `\\theta=${dg(d.th)}`)}`);
    const how = { 2: `in the ${YA}`, 3: 'in both axes', 4: `in the ${XA}` };
    [2, 3, 4].forEach((q) => (rows[q] = lineIn(Pn, `${how[q]}: ${T(cA(nm(NM[q], ...SG[q])))}, Q${q}: ${T(cA(calcS(q)))}`)));
    const last = lineIn(Pn, gen ? `Each image keeps the reference angle ${T(cR('\\theta'))}: only the quadrant changes.` : `All four arms make ${T(cR(dg(d.th)))} with the ${XA}.`, 'u3l1-line-key');
    const rot = { p: svgEl('path', { fill: 'none', stroke: AC, 'stroke-width': 3 }, G.layers.data), h: svgEl('polygon', { fill: AC }, G.layers.data) };
    const setRot = (b) => { if (b < 1) { rot.p.setAttribute('d', ''); rot.h.setAttribute('points', ''); return; } const pts = arcPx(ox, oy, 24, 0, b); rot.p.setAttribute('d', pathOf(pts)); const p = pts[pts.length - 1], q = pts[pts.length - 2]; rot.h.setAttribute('points', headPts(p[0], p[1], p[0] - q[0], p[1] - q[1], 11, 5.5)); };
    const steps = [{ cap: `${T(nm('P', 1, 1))} is on the terminal arm of ${gen ? T('\\theta') : `an angle of about ${TD(d.th)}`}, in quadrant 1. Its reference angle is ${gen ? 'the angle itself' : `about ${TD(d.th)}`}.`, run: async (c) => { ra1.p.style.opacity = 1; await show(c, ra1.l); await show(c, rows[1]); await tween(c, 700, (k) => setRot(ang0 * k)); } }];
    const verb = { 2: `the ${T('x')}-coordinate changes sign`, 3: 'both coordinates change sign', 4: `the ${T('y')}-coordinate changes sign` };
    [2, 3, 4].forEach((q) => {
      const [sx, sy] = SG[q], th = q === 2 ? 180 - ang0 : q === 3 ? 180 + ang0 : 360 - ang0;
      const pt = G.point(d.x, d.y, { color: AC }); pt.style.opacity = 0;
      const arm = armTo(d.x, d.y, AC); arm.style.opacity = 0;
      const lab = hide(G.label(sx * d.x, sy * d.y, T(cA(nm(NM[q], sx, sy))), { pos: (sy > 0 ? 'n' : 's') + (sx > 0 ? 'e' : 'w'), cls: 'bk-ptlab', gap: 5 }));
      const ra = refArc(q);
      steps.push({ cap: `Reflect ${how[q]}: ${verb[q]}. ${T(cA(nm(NM[q], sx, sy)))} is in quadrant ${q}, and the rotation angle is ${T(cA(calcS(q)))}.`, run: async (c) => {
        setRot(0); pt.style.opacity = 1; arm.style.opacity = 1;
        await tween(c, 1100, (k) => { const x = d.x + (sx * d.x - d.x) * k, y = d.y + (sy * d.y - d.y) * k; G.moveTo(pt, x, y); setArm(arm, x, y); });
        await show(c, lab); ra.p.style.opacity = 1; await show(c, ra.l); await show(c, rows[q]);
        await tween(c, 900, (k) => setRot(th * k));
      } });
    });
    steps.push({ cap: gen ? `Reflecting keeps the reference angle and moves the arm to another quadrant: ${T('180^\\circ-\\theta')}, ${T('180^\\circ+\\theta')}, ${T('360^\\circ-\\theta')}.` : `All four arms make ${T(cR(dg(d.th)))} with the ${XA}: ${T(`${dg(d.th)},\\ ${dg(180 - d.th)},\\ ${dg(180 + d.th)},\\ ${dg(360 - d.th)}`)}.`, run: async (c) => { setRot(0); await show(c, last); } });
    void ux;
    return steps;
  }
};

/* =============================== explainer: common mistakes =============================== */
const mistakes = {
  title: 'Common mistakes with reference angles',
  height: 410, minW: 920, capH: 86,
  choices: [{ v: 'y110', label: 'Measured to the y-axis: 110°' }, { v: 'f200', label: 'Wrong formula: 200°' }, { sep: 'Check:' }, { v: 'ex8', label: 'Example 8 check' }],
  ask: (v) => (v === 'ex8' ? `Example 8: Ana says the reference angle for ${TD(251)} is ${TD(19)}, Ben says ${TD(109)} and Cole says ${TD(71)}. Who is correct?`
    : `Find the reference angle of ${TD(v === 'y110' ? 110 : 200)}.`),
  make(stage, v, ex) {
    const th = v === 'ex8' ? 251 : v === 'y110' ? 110 : 200, info = refOf(th);
    const D = new Dial(stage, { x: 6, y: 4, w: 470, h: 402, R: 160, cx: 235, cy: 204, ext: 200, exty: 186 });
    const arm = D.arm(0, { r: 172 }), rot = D.rot(0, 0, { r: 40 });
    const ro = readout(stage, 14, 12);
    const paint = (t) => { arm.set(t); rot.set(t, 0); ro.set(t); };
    const T1 = turner(paint);
    const right = D.wedge(info.a, info.b, { r: 112 }); right.g.style.opacity = 0;
    const rLab = hide(D.labAt((info.a + info.b) / 2, 138, T(cR(dg(info.ref))), 'u3l1-halo u3l1-big'));
    const mk = (a, b, r, color, dash) => { const p = svgEl('path', { d: pathOf(D.arcPts(r, a, b)), fill: 'none', stroke: color, 'stroke-width': 3.5, 'stroke-dasharray': dash, 'stroke-linecap': 'round' }, D.lref); p.style.opacity = 0; return p; };
    const lab = (a, r, html) => hide(D.labAt(a, r, html, 'u3l1-halo u3l1-big'));
    const cards = div(stage, 'u3l1-cards', '', 496, 12, ex.W - 510);
    const card = (who, html) => { const k = h('div', 'u3l1-card', `<div class="u3l1-who">${who}</div><div>${html}</div>`); cards.appendChild(k); hide(k); return k; };
    const stampOn = (k, ok) => { const s = stamp(k, null, { ok, cls: 'u3l1-stp' }); s.style.opacity = 0; return s; };
    if (v === 'ex8') {
      const ana = mk(251, 270, 150, RD, '2 6'), aLab = lab(262, 176, T(cD('19^\\circ')));
      const ben = mk(251, 360, 82, RD, '9 6'), bLab = lab(305, 104, T(cD('109^\\circ')));
      const kA = card('Ana: ' + TD(19), `${T('270^\\circ-251^\\circ=19^\\circ')}: measured to the negative <b>${YA}</b>.`);
      const kB = card('Ben: ' + TD(109), `${T('360^\\circ-251^\\circ=109^\\circ')}: the <b>quadrant 4</b> formula. Not even acute.`);
      const kC = card('Cole: ' + TD(71), `Quadrant 3: ${T(cR('251^\\circ-180^\\circ=71^\\circ'))}.`);
      const sA = stampOn(kA, false), sB = stampOn(kB, false), sC = stampOn(kC, true);
      return [
        { cap: `Sketch first: ${TD(251)} is past ${TD(180)} but not yet ${TD(270)}, so it is in <b>quadrant 3</b>.`, run: async (c) => { await T1.go(c, 251, 1500); D.fillQ(3, true); } },
        { cap: `<b>Ana</b> said ${TD(19)}: ${T('270^\\circ-251^\\circ')}. That is the gap to the negative <b>${YA}</b> (dotted). A reference angle goes to the ${XA}.`, run: async (c) => { ana.style.opacity = 1; await show(c, aLab); await show(c, kA); await stampIn(c, sA); } },
        { cap: `<b>Ben</b> said ${TD(109)}: ${T('360^\\circ-251^\\circ')}, the quadrant 4 formula. ${TD(109)} is bigger than ${TD(90)}: it cannot be a reference angle.`, run: async (c) => { ben.style.opacity = 1; await show(c, bLab); await show(c, kB); await stampIn(c, sB); } },
        { cap: `<b>Cole</b> is correct: quadrant 3, so ${T(cR('\\theta_R=251^\\circ-180^\\circ=71^\\circ'))}, the gap back to the negative ${XA}.`, run: async (c) => { right.g.style.opacity = 1; await anim(c, right.g, [{ opacity: 0 }, { opacity: 1 }], 400); await show(c, rLab); await show(c, kC); await stampIn(c, sC); } }
      ];
    }
    if (v === 'y110') {
      const wrong = mk(90, 110, 150, RD, '2 6'), wLab = lab(100, 178, T(cD('20^\\circ')));
      const kW = card('To the ' + YA + ': ' + TD(20), `${T('110^\\circ-90^\\circ=20^\\circ')}: the gap to the <b>${YA}</b>.`);
      const kR = card('To the ' + XA + ': ' + TD(70), `Quadrant 2: ${T(cR('180^\\circ-110^\\circ=70^\\circ'))}.`);
      const sW = stampOn(kW, false), sR = stampOn(kR, true);
      return [
        { cap: `${TD(110)} is in <b>quadrant 2</b>, just past the ${YA}.`, run: async (c) => { await T1.go(c, 110, 1300); D.fillQ(2, true); } },
        { cap: `The arm is close to the ${YA}, so it is tempting to say ${T('110^\\circ-90^\\circ=20^\\circ')}. But that is measured to the <b>${YA}</b>.`, run: async (c) => { wrong.style.opacity = 1; await show(c, wLab); await show(c, kW); await stampIn(c, sW); } },
        { cap: `Always measure to the <b>${XA}</b>: ${T(cR('\\theta_R=180^\\circ-110^\\circ=70^\\circ'))}.`, run: async (c) => { right.g.style.opacity = 1; await show(c, rLab); await show(c, kR); await stampIn(c, sR); } },
        { cap: `Notice ${T('20^\\circ+70^\\circ=90^\\circ')}: the ${YA} gap is the <b>other</b> part of the quadrant, not the reference angle.`, run: (c) => pulse(c, rLab, 1.15) }
      ];
    }
    const kW = card('Quadrant 2 formula', `${T('180^\\circ-200^\\circ=-20^\\circ')}: negative!`);
    const kR = card('Quadrant 3 formula', `${T(cR('200^\\circ-180^\\circ=20^\\circ'))}`);
    const sW = stampOn(kW, false), sR = stampOn(kR, true);
    return [
      { cap: `${TD(200)} is past ${TD(180)}: <b>quadrant 3</b>.`, run: async (c) => { await T1.go(c, 200, 1300); D.fillQ(3, true); } },
      { cap: `Using the quadrant 2 formula gives ${T('180^\\circ-200^\\circ=-20^\\circ')}. A reference angle is never negative: wrong formula.`, run: async (c) => { await show(c, kW); await stampIn(c, sW); } },
      { cap: `Quadrant 3: measure back to ${TD(180)}. ${T(cR('\\theta_R=200^\\circ-180^\\circ=20^\\circ'))}. A quick sketch picks the right formula.`, run: async (c) => { right.g.style.opacity = 1; await show(c, rLab); await show(c, kR); await stampIn(c, sR); } }
    ];
  }
};

/* =============================== Stand Up Break =============================== */
const pickAng = (r) => { let t; do t = r.int(1, 359); while (t % 90 === 0 || t % 45 === 0 && r.chance(0.6)); return t; };
standup('u3l1', {
  intro: 'At your whiteboard: sketch it first, then find the quadrant and the reference angle.',
  levels: {
    BEG: (r) => {
      const t = pickAng(r), i = refOf(t);
      return { text: 'Sketch the angle in standard position. State its quadrant and its reference angle.', q: `\\theta=${dg(t)}`,
        a: [`\\text{Quadrant ${i.q}}`, i.calc] };
    },
    PRG: (r) => {
      if (r.chance(0.5)) {
        const t = pickAng(r), i = refOf(t), others = [1, 2, 3, 4].filter((q) => q !== i.q).map((q) => dg(fromRef(i.ref, q)));
        return { text: `Find the three other angles from ${TD(0)} to ${TD(360)} with the same reference angle.`, q: `\\theta=${dg(t)}`,
          a: [i.calc, others.join(',\\ ')] };
      }
      const ref = r.int(5, 85), q = r.pick([2, 3, 4]);
      return { text: `The reference angle is ${TD(ref)} and the terminal arm is in <b>quadrant ${q}</b>. Find the rotation angle ${T('\\theta')}.`, q: '',
        a: [`\\theta=${FROM[q](ref)}`] };
    },
    MAS: (r) => {
      if (r.chance(0.5)) {
        const cw = r.chance(0.5), k = cw ? pickAng(r) : 360 + pickAng(r), t = cw ? 360 - k : k - 360, i = refOf(t);
        return { text: `A <b>${cw ? 'clockwise' : 'counterclockwise'}</b> rotation of ${TD(k)}. State the angle from ${TD(0)} to ${TD(360)} with the same terminal arm, its quadrant and its reference angle.`, q: '',
          a: [cw ? `360^\\circ-${dg(k)}=${dg(t)}` : `${dg(k)}-360^\\circ=${dg(t)}`, `\\text{Quadrant ${i.q}},\\quad ${i.calc}`] };
      }
      let a, b; do { a = r.int(1, 6); b = r.int(1, 6); } while (a === b);
      const th = Math.round(Math.atan2(b, a) / D2R), q = r.pick([2, 3, 4]), how = { 2: `the ${YA}`, 3: 'both axes', 4: `the ${XA}` }[q];
      const img = q === 2 ? `(${-a},\\ ${b})` : q === 3 ? `(${-a},\\ ${-b})` : `(${a},\\ ${-b})`;
      return { text: `${T(`P(${a},\\ ${b})`)} is on the terminal arm of an angle of about ${TD(th)}. Reflect ${T('P')} in ${how}. State the image and the rotation angle whose terminal arm passes through it.`, q: '',
        a: [`${img}\\ \\text{is in quadrant ${q}}`, `\\theta\\approx${FROM[q](th)}`] };
    }
  }
});

/* =============================== mount =============================== */
mountWheel();
mountFigures();
export const explainers = mountExplainers({ standard, quadrants, points, sweep, backwards, four, reflect, mistakes });
export const _test = { refOf, fromRef, EX3, EX4, EX5 };
