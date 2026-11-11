/* Math 20-1 · Unit 3 · Lesson 2 — Trigonometric Ratios from a Point on the Terminal Arm (calculator, Degree mode).
 * Warm-up (The Tower Crane: a top-down site map; the trolley rolls along the jib and the jib swings; distance and the
 *   "east is always 3/5 of the way out" fraction), and the explainers:
 *   rFind (plot P, terminal arm and rotation, drop the perpendicular → reference triangle, legs |x| |y| as lengths,
 *     Pythagoras, simplify the radical; concept P(−4, 3) and Example 1 checks),
 *   ratios (SOH CAH TOA in quadrant 1 becomes y/r, x/r, y/x; P moves to quadrant 2 and the signs follow x and y;
 *     Example 2, 3(a)–(c) checks and Example 3(d): three mini planes with sign stickers),
 *   quadrantal (the arm turns 0° → 90° → … → 360° with r = 1 and the table fills; 1/0 is undefined; Example 4(b):
 *     (0, −7) slides to (0, −1) with the same ratios),
 *   sweep (r = 1, the arm sweeps all the way round with live sin/cos/tan bars; tan shoots off near 90° and 270°;
 *     a "closer and closer to 90°" table),
 *   slide (STAR: P slides along a fixed terminal arm: the reference triangle grows, x, y, r change, the ratio
 *     meter does not; similar ghost triangles; then P is reflected into quadrants 2, 3, 4 and only the signs flip;
 *     drag P yourself; Example 5 check builds the P, Q, R, S table),
 *   refSign (sketch the angle, the reference angle to the nearest x-axis, the quadrant-1 triangle flips into place,
 *     the leg that decides the sign lights up; Example 6 checks),
 *   findAngle (θ_R = tan⁻¹(|y|/|x|) on a calculator screen, the placement card lights the quadrant's rule, θ sweeps
 *     round with a live readout; "why not tan⁻¹(y/x)?" with the calculator's wrong arm in quadrant 4; Example 7),
 *   robot (Example 8: a robotic arm at T(−12, −5): its length, the ratios, and the swing from 0° to 202.6°).
 * Colours (kept through Unit 3): terminal arm / rotation θ in the course burgundy, reference angle θ_R amber;
 *   x (adjacent) blue, y (opposite) red, r (hypotenuse) rose. */
import {
  h, tex, add, box, Graph, stamp, stampIn, mountExplainers, pop, fadeIn, appear, sleep, tween,
  svgEl, liveCtx, pulse, place, anim, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const BR = COLORS.brand, AMB = COLORS.amber, XC = COLORS.blue, YC = COLORS.red, RC = COLORS.teal, GRN = COLORS.green, INK = COLORS.ink, GRAY = COLORS.gray, PUR = COLORS.purple;
const cX = (s) => `\\textcolor{${XC}}{${s}}`, cY = (s) => `\\textcolor{${YC}}{${s}}`, cR = (s) => `\\textcolor{${RC}}{${s}}`;
const cA = (s) => `\\textcolor{${AMB}}{${s}}`, cB = (s) => `\\textcolor{${BR}}{${s}}`;
const RAD = Math.PI / 180;

/* ---------- numbers ---------- */
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const grp = (n) => { const s = String(n), neg = s[0] === '-', b = neg ? s.slice(1) : s, [i, f] = b.split('.'); return (neg ? '-' : '') + (i.length >= 4 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : i) + (f != null ? '.' + f : ''); };
const fx = (v, d = 1) => { const k = Math.pow(10, d); let s = (Math.round((v + Math.sign(v) * 1e-9) * k) / k).toFixed(d); if (s === '-0' || /^-0\.0+$/.test(s)) s = s.slice(1); return s; };
const fz = (v, d = 1) => fx(v, d).replace(/\.?0+$/, '') || '0';   // trailing zeros dropped
const hn = (s) => String(s).replace('-', '−');                       // HTML minus
const sq = (v) => (v < 0 ? `(${v})^2` : `${v}^2`);
const angOf = (x, y) => { let a = Math.atan2(y, x) / RAD; if (a < -1e-9) a += 360; return Math.abs(a) < 1e-9 ? 0 : a; };
const quad = (x, y) => (Math.abs(x) < 1e-9 || Math.abs(y) < 1e-9 ? 0 : x > 0 ? (y > 0 ? 1 : 4) : (y > 0 ? 2 : 3));
const refOf = (deg) => { const d = ((deg % 360) + 360) % 360; return d <= 90 ? d : d <= 180 ? 180 - d : d <= 270 ? d - 180 : 360 - d; };
/** √n = a√b */
function sqrtParts(n) { for (let k = Math.floor(Math.sqrt(n) + 1e-9); k > 1; k--) if (n % (k * k) === 0) return [k, n / (k * k)]; return [1, n]; }
function sqrtTex(n) { const [a, b] = sqrtParts(n); return b === 1 ? String(a) : `${a === 1 ? '' : a}\\sqrt{${b}}`; }
/** p/q in lowest terms with the sign in front (q may be negative) */
function fracTex(p, q, d = '\\dfrac') { const s = p * q < 0 ? '-' : ''; p = Math.abs(p); q = Math.abs(q); const g = gcd(p, q) || 1; p /= g; q /= g; return q === 1 ? s + p : `${s}${d}{${p}}{${q}}`; }
/** num / √n written the booklet's way: [as substituted, (reduced), rationalized] */
function overR(num, n, d = '\\dfrac') {
  const [a, b] = sqrtParts(n), out = [`${d}{${num}}{${sqrtTex(n)}}`];
  if (b === 1) { const f = fracTex(num, a, d); if (f !== out[0]) out.push(f); return out; }
  const g = gcd(num, a) || 1, s = num < 0 ? '-' : '', p = Math.abs(num) / g, q = a / g;
  if (g !== 1 || num < 0) out.push(`${s}${d}{${p}}{${q === 1 ? '' : q}\\sqrt{${b}}}`);
  const g2 = gcd(p, q * b), P = p / g2, Q = q * b / g2;
  out.push(Q === 1 ? `${s}${P === 1 ? '' : P}\\sqrt{${b}}` : `${s}${d}{${P === 1 ? '' : P}\\sqrt{${b}}}{${Q}}`);
  return out;
}
/** y/x for integers, booklet style */
function yOverX(y, x, d = '\\dfrac') { const a = `${d}{${y}}{${x}}`, f = fracTex(y, x, d); return f === a ? [a] : [a, f]; }
/** the three ratios of (x, y), as equation chains */
function ratioTex(x, y) {
  const n = x * x + y * y;
  return { n, r: sqrtTex(n), sin: overR(y, n), cos: overR(x, n), tan: x === 0 ? null : yOverX(y, x) };
}

/* ---------- small DOM helpers ---------- */
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
const panel = (stage, x, y, w, hh, title, cls = '') => div(stage, 'u3l2-panel ' + cls, title ? `<div class="u3l2-ph">${title}</div>` : '', x, y, w, hh);
const lineIn = (p, html, cls = '') => { const d = h('div', 'u3l2-line ' + cls, html); p.appendChild(d); hide(d); return d; };
const showAll = (c, els) => Promise.all(els.map((e) => appear(c, e, 320)));
const hiddenStamp = (host, text, o) => { const s = stamp(host, text, o); s.style.opacity = 0; return s; };

/* ---------- SVG paths ---------- */
const P2 = (cx, cy, R, a) => [cx + R * Math.cos(a * RAD), cy - R * Math.sin(a * RAD)];
const f1 = (v) => v.toFixed(1);
function arcD(cx, cy, R, a0, a1) {
  if (Math.abs(a1 - a0) < 0.05) return '';
  const n = Math.max(1, Math.ceil(Math.abs(a1 - a0) / 120)), p = P2(cx, cy, R, a0); let d = `M${f1(p[0])} ${f1(p[1])}`;
  for (let i = 1; i <= n; i++) { const q = P2(cx, cy, R, a0 + (a1 - a0) * i / n); d += ` A${f1(R)} ${f1(R)} 0 0 ${a1 > a0 ? 0 : 1} ${f1(q[0])} ${f1(q[1])}`; }
  return d;
}
const wedgeD = (cx, cy, R, a0, a1) => (Math.abs(a1 - a0) < 0.05 ? '' : `M${f1(cx)} ${f1(cy)} L` + arcD(cx, cy, R, a0, a1).slice(1) + ' Z');
function headD(x, y, dx, dy, L = 13, w = 6) {
  const m = Math.hypot(dx, dy) || 1, ux = dx / m, uy = dy / m;
  return `M${f1(x)} ${f1(y)} L${f1(x - L * ux + w * uy)} ${f1(y - L * uy - w * ux)} L${f1(x - L * ux - w * uy)} ${f1(y - L * uy + w * ux)} Z`;
}
/** arrowhead at the end of a rotation arc from a0 to a1 (radius R) */
function arcHead(cx, cy, R, a0, a1, L, w) {
  if (Math.abs(a1 - a0) < 8) return '';
  const [x, y] = P2(cx, cy, R, a1), s = a1 > a0 ? 1 : -1;
  return headD(x, y, -Math.sin(a1 * RAD) * s, -Math.cos(a1 * RAD) * s, L, w);
}

/* =====================================================================================================
 * Plane: a coordinate grid with a point P on a terminal arm, the rotation arc θ, the reference triangle and
 * the reference angle θ_R. Everything is redrawn from (x, y) by draw(), so tweens just call set().
 * ===================================================================================================== */
class Plane {
  constructor(host, o) {
    this.o = o;
    const w = this.win = o.win || { xmin: -o.R, xmax: o.R, ymin: -o.R, ymax: o.R };
    const G = this.G = new Graph(host, Object.assign({ x: o.x, y: o.y, width: o.size, height: o.size, xstep: o.step || 1, ystep: o.step || 1,
      xlabels: o.lab || 0, ylabels: o.lab || 0, fontSize: o.fs || 15 }, w, o.graph || {}));
    const L = G.layers.data, TP = G.layers.top, sw = o.thin ? 0.7 : 1;
    this.under = svgEl('g', {}, L);
    this.ghosts = svgEl('g', {}, L);
    this.tri = svgEl('polygon', { fill: BR, 'fill-opacity': 0.1 }, L);
    this.wedge = svgEl('path', { fill: AMB, 'fill-opacity': 0.26 }, L);
    this.refArc = svgEl('path', { fill: 'none', stroke: AMB, 'stroke-width': 3.2 * sw }, L);
    this.legX = svgEl('line', { stroke: XC, 'stroke-width': 7 * sw, 'stroke-linecap': 'round', 'stroke-opacity': 0.8 }, L);
    this.legY = svgEl('line', { stroke: YC, 'stroke-width': 7 * sw, 'stroke-linecap': 'round', 'stroke-opacity': 0.8 }, L);
    this.drop = svgEl('line', { stroke: INK, 'stroke-width': 2.2 * sw, 'stroke-dasharray': '7 6' }, L);
    this.rmark = svgEl('path', { fill: 'none', stroke: INK, 'stroke-width': 1.8 * sw }, L);
    this.rot = svgEl('path', { fill: 'none', stroke: BR, 'stroke-width': 2.8 * sw, 'stroke-linecap': 'round' }, L);
    this.rotHead = svgEl('path', { fill: BR }, L);
    this.arm = svgEl('line', { stroke: BR, 'stroke-width': 4.5 * sw, 'stroke-linecap': 'round' }, L);
    this.armHead = svgEl('path', { fill: BR }, L);
    this.over = svgEl('g', {}, L);
    this.dot = svgEl('circle', { r: o.dotR || 7.5, fill: BR, stroke: '#fff', 'stroke-width': 2.5 }, TP);
    const lab = (cls) => { const d = h('div', 'bk-lab u3l2-lab ' + cls); G.html.appendChild(d); return d; };
    this.L = { P: lab('bk-ptlab u3l2-lp'), x: lab('u3l2-lx'), y: lab('u3l2-ly'), r: lab('u3l2-lr'), th: lab('u3l2-lth'), thR: lab('u3l2-lthr') };
    this.x = o.px ?? 1; this.y = o.py ?? 1; this.deg = null; this.rotA = null; this.armF = 1;
    this.rotR = o.rotR || 28; this.refR = o.refR || 52;
    this.groups = {
      arm: [this.arm, this.armHead], rot: [this.rot, this.rotHead, this.L.th], ref: [this.wedge, this.refArc, this.L.thR],
      tri: [this.tri, this.drop, this.rmark], legX: [this.legX], legY: [this.legY], dot: [this.dot], P: [this.L.P],
      lx: [this.L.x], ly: [this.L.y], lr: [this.L.r]
    };
    if (o.hidden !== false) this.hide(...Object.keys(this.groups));
    this.draw();
  }
  els(names) { return names.flatMap((n) => this.groups[n] || []); }
  hide(...names) { this.els(names).forEach((e) => (e.style.opacity = 0)); return this; }
  showNow(...names) { this.els(names).forEach((e) => (e.style.opacity = 1)); return this; }
  show(c, ...names) { return showAll(c, this.els(names)); }
  lab(name, html) { this.L[name].innerHTML = html; this.draw(); return this; }
  set(x, y, deg = null) { this.x = x; this.y = y; this.deg = deg; this.draw(); return this; }
  polar(r, deg) { return this.set(r * Math.cos(deg * RAD), r * Math.sin(deg * RAD), deg); }
  get r() { return Math.hypot(this.x, this.y); }
  get theta() { return this.deg != null ? this.deg : angOf(this.x, this.y); }
  /** the far end of the arm in graph units (to just inside the window) */
  armEnd(ux, uy) {
    const w = this.win, big = 1e9;
    const tx = ux > 1e-9 ? w.xmax / ux : ux < -1e-9 ? w.xmin / ux : big, ty = uy > 1e-9 ? w.ymax / uy : uy < -1e-9 ? w.ymin / uy : big;
    return Math.min(tx, ty) * (this.o.armK || 0.94);
  }
  draw() {
    const G = this.G, x = this.x, y = this.y, r = Math.hypot(x, y), set = (el, a) => { for (const k in a) el.setAttribute(k, a[k]); };
    const [ox, oy] = G.toPx(0, 0), [px, py] = G.toPx(x, y), [bx, by] = G.toPx(x, 0), th = this.theta;
    const tiny = (v) => Math.abs(v) < 1e-9;
    // arm
    if (r > 1e-9) {
      const ux = Math.cos(th * RAD), uy = Math.sin(th * RAD), tE = Math.max(this.armEnd(ux, uy), r + 0.0001) * this.armF;
      const [ex, ey] = G.toPx(ux * tE, uy * tE);
      set(this.arm, { x1: ox, y1: oy, x2: ex, y2: ey });
      this.armHead.setAttribute('d', this.armF > 0.98 && !this.o.noHead ? headD(ex + (ex - ox) / (Math.hypot(ex - ox, ey - oy) || 1) * 4, ey + (ey - oy) / (Math.hypot(ex - ox, ey - oy) || 1) * 4, ex - ox, ey - oy, 15, 7) : '');
    }
    // rotation arc
    const a1 = this.rotA != null ? this.rotA : th, R1 = this.rotR;
    this.rot.setAttribute('d', arcD(ox, oy, R1, 0, a1));
    this.rotHead.setAttribute('d', arcHead(ox, oy, R1, 0, a1, 11, 5.5));
    { const am = a1 / 2, rr = R1 + (Math.abs(a1) < 40 ? 22 : 16), [lx, ly] = P2(ox, oy, rr, Math.abs(a1) < 40 ? am * 0.9 : am); place(this.L.th, lx, ly, 'c'); }
    // reference angle
    const q = quad(x, y), R2 = this.refR;
    if (q) {
      const [b0, b1] = q === 1 ? [0, th] : q === 2 ? [th, 180] : q === 3 ? [180, th] : [th, 360];
      this.wedge.setAttribute('d', wedgeD(ox, oy, R2, b0, b1)); this.refArc.setAttribute('d', arcD(ox, oy, R2, b0, b1));
      const span = b1 - b0, [lx, ly] = P2(ox, oy, R2 + (span < 24 ? 26 : 20), (b0 + b1) / 2);
      place(this.L.thR, lx, ly, 'c');
    } else { this.wedge.setAttribute('d', ''); this.refArc.setAttribute('d', ''); }
    // reference triangle
    set(this.tri, { points: `${f1(ox)},${f1(oy)} ${f1(bx)},${f1(by)} ${f1(px)},${f1(py)}` });
    set(this.drop, { x1: px, y1: py, x2: bx, y2: by });
    set(this.legX, { x1: ox, y1: oy, x2: bx, y2: by }); set(this.legY, { x1: bx, y1: by, x2: px, y2: py });
    if (!tiny(x) && !tiny(y) && Math.abs(bx - ox) > 16 && Math.abs(py - by) > 16) {
      const s = 11, sx = Math.sign(ox - bx), sy = Math.sign(py - by);
      this.rmark.setAttribute('d', `M${f1(bx + sx * s)} ${f1(by)} L${f1(bx + sx * s)} ${f1(by + sy * s)} L${f1(bx)} ${f1(by + sy * s)}`);
    } else this.rmark.setAttribute('d', '');
    set(this.dot, { cx: px, cy: py });
    if (this.handle) set(this.handle, { cx: px, cy: py });
    // labels
    { const lw = this.L.P.offsetWidth || 0; let side = x >= 0 ? 'e' : 'w';
      if (side === 'w' && px - lw - 10 < 2) side = 'e'; else if (side === 'e' && px + lw + 10 > G.W - 2) side = 'w';
      place(this.L.P, px, py, (y >= 0 ? 'n' : 's') + side, 8); }
    place(this.L.x, (ox + bx) / 2, by, y >= 0 ? 's' : 'n', 6);
    { const lw = this.L.y.offsetWidth || 0; let side = x >= 0 ? 'e' : 'w';
      if (side === 'w' && bx - lw - 11 < 2) side = 'e'; else if (side === 'e' && bx + lw + 11 > G.W - 2) side = 'w';
      place(this.L.y, bx, (by + py) / 2, side, 9); }
    { const mx = (ox + px) / 2, my = (oy + py) / 2, dx = px - ox, dy = py - oy, m = Math.hypot(dx, dy) || 1; let nx = -dy / m, ny = dx / m;
      if ((bx - mx) * nx + (by - my) * ny > 0) { nx = -nx; ny = -ny; }
      place(this.L.r, mx + nx * 20, my + ny * 20, 'c'); }
    if (this.onDraw) this.onDraw(this);
  }
  /** a faint copy of the current reference triangle */
  ghost(cls = 'u3l2-ghost') {
    const G = this.G, [ox, oy] = G.toPx(0, 0), [px, py] = G.toPx(this.x, this.y), [bx, by] = G.toPx(this.x, 0);
    const g = svgEl('polygon', { class: cls, points: `${f1(ox)},${f1(oy)} ${f1(bx)},${f1(by)} ${f1(px)},${f1(py)}`, fill: BR, 'fill-opacity': 0.05, stroke: BR, 'stroke-width': 1.8, 'stroke-dasharray': '5 5', 'stroke-opacity': 0.55 }, this.ghosts);
    return g;
  }
  /** drag P along its arm (finger or Pencil): onMove() after each move */
  draggable(onMove, onStart) {
    const hd = this.handle = svgEl('circle', { r: 24, fill: 'transparent', 'data-tap': '', class: 'u3l2-handle' }, this.G.layers.top);
    let on = false;
    hd.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); try { hd.setPointerCapture(e.pointerId); } catch (_) { /* */ } on = true; if (onStart) onStart(); });
    hd.addEventListener('pointermove', (e) => {
      if (!on) return; e.preventDefault();
      const [gx, gy] = this.G.fromEvent(e), th = this.theta, ux = Math.cos(th * RAD), uy = Math.sin(th * RAD);
      const t = Math.max(this.o.dragMin || 1, Math.min(this.armEnd(ux, uy) * 0.98, gx * ux + gy * uy));
      this.set(ux * t, uy * t); if (onMove) onMove();
    });
    const end = () => { on = false; };
    hd.addEventListener('pointerup', end); hd.addEventListener('pointercancel', end);
    this.draw();
  }
}

/* =====================================================================================================
 * Warm-up: The Tower Crane (top view). Tower at the origin; the trolley at d = 10 … 30 m along a jib pointing
 * along (3, 4)/5 or (−4, 3)/5, so its coordinates are always whole numbers.
 * ===================================================================================================== */
function mountCrane() {
  const host = document.getElementById('u3l2-crane'); if (!host) return;
  const W = 560, H = 360, S = 8.4, OX = 300, OY = 300; // px per metre, the tower's position
  const P = (x, y) => [OX + x * S, OY - y * S];
  const svg = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u3l2-cranesvg' }, host);
  svgEl('rect', { x: 0, y: 0, width: W, height: H, rx: 14, fill: '#efe7d6' }, svg);
  // site details: a gravel pad, a building footprint, piles of material
  svgEl('rect', { x: 40, y: 34, width: 150, height: 96, rx: 6, fill: '#d9cfbb', stroke: '#b9ab90', 'stroke-width': 2 }, svg);
  svgEl('rect', { x: 380, y: 60, width: 130, height: 70, rx: 6, fill: '#cfd8df', stroke: '#9fb0bd', 'stroke-width': 2 }, svg);
  [[90, 250, 22], [470, 215, 16], [60, 330, 12]].forEach(([x, y, r]) => svgEl('circle', { cx: x, cy: y, r, fill: '#c8b48c', stroke: '#a8946c', 'stroke-width': 2 }, svg));
  for (let gx = -35; gx <= 30; gx += 5) { const [x] = P(gx, 0); svgEl('line', { x1: x, x2: x, y1: 0, y2: H, stroke: '#d8ccb4', 'stroke-width': gx === 0 ? 0 : 1 }, svg); }
  for (let gy = -5; gy <= 40; gy += 5) { const [, y] = P(0, gy); svgEl('line', { x1: 0, x2: W, y1: y, y2: y, stroke: '#d8ccb4', 'stroke-width': gy === 0 ? 0 : 1 }, svg); }
  svgEl('line', { x1: 0, x2: W, y1: OY, y2: OY, stroke: '#8a7d64', 'stroke-width': 2, 'stroke-dasharray': '8 6' }, svg);
  svgEl('line', { x1: OX, x2: OX, y1: 0, y2: H, stroke: '#8a7d64', 'stroke-width': 2, 'stroke-dasharray': '8 6' }, svg);
  const t = (x, y, s, a = 'middle', cls = 'u3l2-ctext') => { const e = svgEl('text', { x, y, 'text-anchor': a, class: cls }, svg); e.textContent = s; return e; };
  t(W - 12, OY - 8, 'east (+x)', 'end'); t(OX + 8, 22, 'north (+y)', 'start');
  // shadow triangle (east and north legs) and the jib group
  const legs = svgEl('g', {}, svg);
  const east = svgEl('line', { stroke: XC, 'stroke-width': 5, 'stroke-linecap': 'round' }, legs), north = svgEl('line', { stroke: YC, 'stroke-width': 5, 'stroke-linecap': 'round' }, legs);
  const jib = svgEl('g', {}, svg);
  jib.style.transformBox = 'view-box'; jib.style.transformOrigin = '0 0';
  // the jib drawn along +x from the tower: lattice beam to 32 m, counter-jib to −9 m with a counterweight
  const L = 32 * S, bw = 7;
  svgEl('rect', { x: OX - 9 * S, y: OY - bw, width: 9 * S + L, height: 2 * bw, fill: '#f2c230', stroke: '#9c7a10', 'stroke-width': 2 }, jib);
  for (let k = -9 * S; k < L - 8; k += 14) svgEl('path', { d: `M${OX + k} ${OY - bw} L${OX + k + 7} ${OY + bw} L${OX + k + 14} ${OY - bw}`, fill: 'none', stroke: '#9c7a10', 'stroke-width': 1.4 }, jib);
  svgEl('rect', { x: OX - 9 * S - 4, y: OY - 14, width: 30, height: 28, rx: 3, fill: '#7d8794', stroke: '#4c5561', 'stroke-width': 2 }, jib);
  const trolley = svgEl('g', {}, jib);
  svgEl('rect', { x: -11, y: -13, width: 22, height: 26, rx: 4, fill: '#2e3c4f', stroke: '#fff', 'stroke-width': 2 }, trolley);
  svgEl('circle', { cx: 0, cy: 0, r: 5, fill: '#f2c230' }, trolley);
  svgEl('rect', { x: OX - 13, y: OY - 13, width: 26, height: 26, rx: 4, fill: '#c93a33', stroke: '#7a1f1a', 'stroke-width': 2.5 }, svg); // the tower
  const dlab = svgEl('text', { class: 'u3l2-cdist', 'text-anchor': 'middle' }, svg);
  const info = div(host, 'u3l2-cinfo', '', 10, 8);
  const DIRS = [[3 / 5, 4 / 5], [-4 / 5, 3 / 5]], DS = [10, 15, 20, 25, 30];
  let di = 0, k = 0, ang = Math.atan2(4, 3) / RAD, showD = false, busy = false;
  const bIn = document.getElementById('u3l2-cin'), bOut = document.getElementById('u3l2-cout'), bSw = document.getElementById('u3l2-cswing'), bD = document.getElementById('u3l2-cdist');
  const paint = (dd = DS[k]) => {
    jib.setAttribute('transform', `rotate(${-ang} ${OX} ${OY})`);
    trolley.setAttribute('transform', `translate(${OX + dd * S} ${OY})`);
    const u = [Math.cos(ang * RAD), Math.sin(ang * RAD)], [tx, ty] = P(u[0] * dd, u[1] * dd);
    east.setAttribute('x1', OX); east.setAttribute('y1', OY); east.setAttribute('x2', tx); east.setAttribute('y2', OY);
    north.setAttribute('x1', tx); north.setAttribute('y1', OY); north.setAttribute('x2', tx); north.setAttribute('y2', ty);
    dlab.setAttribute('x', (OX + tx) / 2 - u[1] * 26); dlab.setAttribute('y', (OY + ty) / 2 - u[0] * 26 + 6);
    dlab.textContent = showD ? `${fz(dd, 1)} m` : '';
    const still = Math.abs(dd - DS[k]) < 1e-6 && Math.abs(ang - Math.atan2(DIRS[di][1], DIRS[di][0]) / RAD) < 1e-6;
    const X = Math.round(DIRS[di][0] * DS[k]), Y = Math.round(DIRS[di][1] * DS[k]);
    info.innerHTML = still ? `Trolley at <b>(${hn(X)}, ${Y})</b>${showD ? ` · <b>${DS[k]} m</b> from the tower` : ''}` : 'moving…';
    legs.style.opacity = still ? 1 : 0.35;
    bIn.disabled = k === 0 || busy; bOut.disabled = k === DS.length - 1 || busy; bSw.disabled = busy;
    bD.textContent = showD ? 'Hide distance' : 'Show distance';
  };
  const c = liveCtx();
  const roll = async (nk) => { if (busy) return; busy = true; const d0 = DS[k], d1 = DS[nk]; k = nk; await tween(c, 650, (s) => paint(d0 + (d1 - d0) * s)); busy = false; paint(); };
  bIn.addEventListener('click', () => { if (k > 0) roll(k - 1); });
  bOut.addEventListener('click', () => { if (k < DS.length - 1) roll(k + 1); });
  bSw.addEventListener('click', async () => {
    if (busy) return; busy = true; const a0 = ang; di = 1 - di; const a1 = Math.atan2(DIRS[di][1], DIRS[di][0]) / RAD;
    await tween(c, 1100, (s) => { ang = a0 + (a1 - a0) * s; paint(); }); ang = a1; busy = false; paint();
  });
  bD.addEventListener('click', () => { showD = !showD; paint(); });
  paint();
}

/* =============================== static figures =============================== */
function mountFigures() {
  const f1e = document.getElementById('u3l2-fig1');
  if (f1e) {
    const p = new Plane(f1e, { size: 330, win: { xmin: -5.6, xmax: 2.2, ymin: -1.6, ymax: 6.2 }, graph: { grid: false, numbers: false }, px: -4, py: 3, hidden: false, rotR: 24, refR: 48 });
    p.lab('P', T('P(x,\\,y)')).lab('x', T(cX('|x|'))).lab('y', T(cY('|y|'))).lab('r', T(cR('r'))).lab('th', T(cB('\\theta'))).lab('thR', T(cA('\\theta_R')));
    p.hide('legX', 'legY');
  }
  const f2e = document.getElementById('u3l2-fig2');
  if (f2e) {
    const p = new Plane(f2e, { size: 270, win: { xmin: -6, xmax: 26, ymin: -4, ymax: 28 }, step: 2, lab: 10, fs: 13, px: 7, py: 24, hidden: false, rotR: 22, refR: 40 });
    p.lab('P', T('(7,\\,24)')).lab('th', T(cB('\\theta')));
    p.hide('ref', 'legX', 'legY', 'lx', 'ly', 'lr');
  }
  const f4e = document.getElementById('u3l2-fig4');
  if (f4e) {
    const G = new Graph(f4e, { width: 290, height: 290, xmin: -1.8, xmax: 1.8, ymin: -1.8, ymax: 1.8, grid: false, numbers: false, fontSize: 15 });
    const [ox, oy] = G.toPx(0, 0);
    svgEl('circle', { cx: ox, cy: oy, r: G.ux, fill: 'none', stroke: '#b9bec8', 'stroke-width': 2 }, G.layers.data);
    [[1, 0, 'se'], [0, 1, 'ne'], [-1, 0, 'sw'], [0, -1, 'se']].forEach(([x, y, pos]) => G.point(x, y, { label: T(`(${x},\\,${y})`), pos, color: BR }));
  }
  const f8e = document.getElementById('u3l2-fig8');
  if (f8e) { const R = robotScene(f8e, { width: 330, height: 230, fs: 13 }); R.setArm(angOf(-12, -5)); R.G.point(-12, -5, { label: T('T(-12,\\,-5)'), pos: 's', color: INK, r: 5 }); }
}

/* =============================== explainer: r from the reference triangle =============================== */
const RF = {
  c: { label: 'P(−4, 3)', x: -4, y: 3, n: 'P', R: 6, step: 1 },
  a: { label: 'Example 1(a)', x: -20, y: 21, n: 'P', R: 25, step: 5, lab: 10 },
  b: { label: 'Example 1(b)', x: 4, y: -6, n: 'Q', R: 8, step: 1, lab: 2 },
  cc: { label: 'Example 1(c)', x: -3, y: -3, n: 'R', R: 5, step: 1 }
};
const QN = ['on an axis', 'quadrant 1', 'quadrant 2', 'quadrant 3', 'quadrant 4'];
const moveWords = (x, y) => `${Math.abs(x)} ${x < 0 ? 'left' : 'right'}, ${Math.abs(y)} ${y < 0 ? 'down' : 'up'}`;
const rFind = {
  title: `The distance ${T('r')} from the origin`,
  height: 452, minW: 940,
  choices: [{ v: 'c', label: RF.c.label }, { sep: 'Check:' }, ...['a', 'b', 'cc'].map((k) => ({ v: k, label: RF[k].label }))],
  ask: (v) => (v === 'c' ? `How far is ${T('P(-4,\\,3)')} from the origin?` : `Example 1: the exact distance ${T('r')} from the origin to ${T(`${RF[v].n}(${RF[v].x},\\,${RF[v].y})`)}.`),
  make(stage, v, ex) {
    const d = RF[v], { x, y } = d, n = x * x + y * y, [a, b] = sqrtParts(n), q = quad(x, y), rT = sqrtTex(n);
    const p = new Plane(stage, { x: 10, y: 6, size: 440, R: d.R, step: d.step, lab: d.lab, px: x, py: y });
    p.lab('P', T(`${d.n}(${x},\\,${y})`)).lab('th', T(cB('\\theta'))).lab('thR', T(cA('\\theta_R')))
      .lab('x', T(cX(`|x|=${Math.abs(x)}`))).lab('y', T(cY(`|y|=${Math.abs(y)}`))).lab('r', T(cR(`r=${rT}`)));
    const W = ex.W - 476, pn = panel(stage, 466, 14, W, 424, 'Work');
    const l1 = lineIn(pn, `${T(`${d.n}(${x},\\,${y})`)} is in <b>${QN[q]}</b>.`);
    const l2 = lineIn(pn, `Legs: ${T(cX(`|x|=${Math.abs(x)}`))}, &nbsp; ${T(cY(`|y|=${Math.abs(y)}`))}`);
    const l3 = lineIn(pn, T(`${cR('r')}^2=x^2+y^2`), 'u3l2-line-key');
    const l4 = lineIn(pn, T(`${cR('r')}=\\sqrt{${sq(x)}+${sq(y)}}`));
    const l5 = lineIn(pn, T(`\\phantom{r}=\\sqrt{${grp(x * x)}+${grp(y * y)}}=\\sqrt{${grp(n)}}`));
    const l6 = lineIn(pn, b === 1 ? T(`\\phantom{r}=\\boldsymbol{${a}}`) : a === 1 ? T(`\\phantom{r}=\\boldsymbol{\\sqrt{${n}}}`) : T(`\\phantom{r}=\\sqrt{${a * a}\\cdot${b}}=\\boldsymbol{${rT}}`), 'u3l2-line-ans');
    const st = hiddenStamp(stage, T('r>0'), { ok: true, x: 466 + W - 70, y: 400, size: 'sm', cls: 'u3l2-nocaps' });
    const last = b === 1 ? `${T(`r=${a}`)}. A distance is never negative: ${T('r>0')}${x < 0 && y < 0 ? ', even though both coordinates are negative' : ''}.`
      : a === 1 ? `${T(`\\sqrt{${n}}`)} has no square factor, so ${T(`r=\\sqrt{${n}}`)} is already in simplest form.`
        : `${T(`\\sqrt{${n}}`)} is not a whole number: take out the square factor ${a * a}. ${T(`r=${rT}`)}${x < 0 && y < 0 ? ', positive even though both coordinates are negative' : ''}.`;
    return [
      { cap: `Plot ${T(`${d.n}(${x},\\,${y})`)}: ${moveWords(x, y)}. It is in <b>${QN[q]}</b>.`, run: async (c) => { await p.show(c, 'dot', 'P'); await show(c, l1); } },
      { cap: `The <b>terminal arm</b> starts at the origin and passes through ${T(d.n)}. ${T(cB('\\theta'))} turns counterclockwise from the positive ${T('x')}-axis.`,
        run: async (c) => { p.armF = 0; p.rotA = 0; p.draw(); p.showNow('arm'); await tween(c, 700, (t) => { p.armF = t; p.draw(); }); p.showNow('rot'); await tween(c, 900, (t) => { p.rotA = t * p.theta; p.draw(); }); p.rotA = null; p.draw(); } },
      { cap: `Drop a perpendicular to the ${T('x')}-axis: the <b>reference triangle</b>. Its angle at the origin is the reference angle ${T(cA('\\theta_R'))}.`, run: (c) => p.show(c, 'tri', 'ref') },
      { cap: `The legs are <b>lengths</b>: ${T(`|x|=${Math.abs(x)}`)} and ${T(`|y|=${Math.abs(y)}`)}. A length is never negative.`, run: async (c) => { await p.show(c, 'legX', 'legY', 'lx', 'ly'); await show(c, l2); } },
      { cap: `Pythagoras: ${T('r^2=x^2+y^2')}. Squaring takes away any negative sign: ${T(`${sq(x)}=${grp(x * x)}`)}${y < 0 ? `, ${T(`${sq(y)}=${grp(y * y)}`)}` : ''}.`, run: async (c) => { await show(c, l3); await show(c, l4); await show(c, l5); } },
      { cap: last, run: async (c) => { await show(c, l6); await p.show(c, 'lr'); await stampIn(c, st); } }
    ];
  }
};

/* =============================== explainer: the ratios from x, y and r =============================== */
const RT = {
  e2: { label: 'Example 2', x: 7, y: 24, win: { xmin: -6, xmax: 26, ymin: -4, ymax: 28 }, step: 2, lab: 10, ex: 'Example 2' },
  e3a: { label: 'Example 3(a)', x: -9, y: 40, win: { xmin: -46, xmax: 12, ymin: -8, ymax: 50 }, step: 5, lab: 10, ex: 'Example 3(a)' },
  e3b: { label: 'Example 3(b)', x: -5, y: -12, win: { xmin: -14, xmax: 6, ymin: -16, ymax: 4 }, step: 1, lab: 5, ex: 'Example 3(b)' },
  e3c: { label: 'Example 3(c)', x: 6, y: -3, win: { xmin: -4, xmax: 9, ymin: -8, ymax: 5 }, step: 1, lab: 2, ex: 'Example 3(c)' }
};
const chain = (arr) => arr.join('=');
const ratios = {
  title: `From SOH CAH TOA to ${T('x')}, ${T('y')} and ${T('r')}`,
  height: 452, minW: 940,
  choices: [{ v: 'c', label: 'Quadrant 1 → quadrant 2' }, { sep: 'Check:' }, ...Object.keys(RT).map((k) => ({ v: k, label: RT[k].label })), { v: 'e3d', label: 'Example 3(d): the signs' }],
  ask: (v) => (v === 'c' ? 'SOH CAH TOA works in a right triangle. What happens when the point is not in quadrant 1?'
    : v === 'e3d' ? 'Example 3(d): in each part, which ratios are negative? What decides the sign?'
      : `${RT[v].ex}: ${T(`(${RT[v].x},\\,${RT[v].y})`)} is on the terminal arm of ${T('\\theta')}. Find ${T('\\sin\\theta')}, ${T('\\cos\\theta')} and ${T('\\tan\\theta')}.`),
  make(stage, v, ex) {
    if (v === 'c') return ratiosConcept(stage, ex);
    if (v === 'e3d') return ratiosSigns(stage, ex);
    const d = RT[v], { x, y } = d, R = ratioTex(x, y), q = quad(x, y);
    const p = new Plane(stage, { x: 10, y: 6, size: 440, win: d.win, step: d.step, lab: d.lab, px: x, py: y });
    p.lab('P', T(`(${x},\\,${y})`)).lab('th', T(cB('\\theta'))).lab('x', T(cX(`x=${x}`))).lab('y', T(cY(`y=${y}`))).lab('r', T(cR(`r=${R.r}`)));
    const W = ex.W - 476, pn = panel(stage, 466, 14, W, 424, 'Work');
    const lr = lineIn(pn, T(`r=\\sqrt{${grp(x * x)}+${grp(y * y)}}=\\sqrt{${grp(R.n)}}=${cR(R.r)}`));
    const ls = lineIn(pn, T(`\\sin\\theta=\\dfrac{${cY('y')}}{${cR('r')}}=${chain(R.sin)}`), 'u3l2-line-big');
    const lc = lineIn(pn, T(`\\cos\\theta=\\dfrac{${cX('x')}}{${cR('r')}}=${chain(R.cos)}`), 'u3l2-line-big');
    const lt = lineIn(pn, T(`\\tan\\theta=\\dfrac{${cY('y')}}{${cX('x')}}=${chain(R.tan)}`), 'u3l2-line-big');
    const sg = (v2) => (v2 < 0 ? 'negative' : 'positive');
    const capS = `${T('\\sin\\theta=\\dfrac{y}{r}')}${R.sin.length > 2 ? ', then rationalize' : ''}: ${T(R.sin[R.sin.length - 1])}. ${y < 0 ? `${T('y<0')}, so it is <b>negative</b>.` : `${T('y>0')}: positive.`}`;
    const capC = `${T('\\cos\\theta=\\dfrac{x}{r}')}${R.cos.length > 2 ? ', then rationalize' : ''}: ${T(R.cos[R.cos.length - 1])}. ${x < 0 ? `${T('x<0')}, so it is <b>negative</b>.` : `${T('x>0')}: positive.`}`;
    const capT = `${T('\\tan\\theta=\\dfrac{y}{x}')}: ${T(R.tan[R.tan.length - 1])}. ${x * y < 0 ? 'Opposite signs: <b>negative</b>.' : x < 0 ? 'Two negatives: <b>positive</b>.' : 'Both positive.'}`;
    void sg;
    return [
      { cap: `Plot ${T(`(${x},\\,${y})`)} in <b>${QN[q]}</b>, draw the terminal arm and the reference triangle.`, run: async (c) => { await p.show(c, 'dot', 'P', 'arm', 'rot'); await p.show(c, 'tri', 'lx', 'ly'); } },
      { cap: `First ${T('r')}: ${T(`r=\\sqrt{${sq(x)}+${sq(y)}}=${R.r}`)}.`, run: async (c) => { await p.show(c, 'lr'); await show(c, lr); } },
      { cap: capS, run: async (c) => { await p.show(c, 'legY'); await show(c, ls); } },
      { cap: capC, run: async (c) => { p.hide('legY'); await p.show(c, 'legX'); await show(c, lc); } },
      { cap: capT, run: async (c) => { await p.show(c, 'legY'); await show(c, lt); } }
    ];
  }
};
function ratiosConcept(stage, ex) {
  const p = new Plane(stage, { x: 10, y: 6, size: 440, R: 6, step: 1, px: 4, py: 3 });
  p.lab('P', T('P(4,\\,3)')).lab('th', T(cB('\\theta'))).lab('x', T(cX('\\text{adjacent}'))).lab('y', T(cY('\\text{opposite}'))).lab('r', T(cR('\\text{hypotenuse}')));
  const W = ex.W - 476, pn = panel(stage, 466, 14, W, 424, '');
  const box10 = div(pn, 'u3l2-soh', '', null, null);
  const row = (f, top, bot, val) => `<div class="u3l2-sohr">${T(`\\${f}\\theta=\\dfrac{${top}}{${bot}}${val ? '=' + val : ''}`)}</div>`;
  const paint = (mode) => {
    if (mode === 0) box10.innerHTML = `<div class="u3l2-ph">Math 10C: SOH CAH TOA</div>${row('sin', cY('\\text{opp}'), cR('\\text{hyp}'))}${row('cos', cX('\\text{adj}'), cR('\\text{hyp}'))}${row('tan', cY('\\text{opp}'), cX('\\text{adj}'))}`;
    else {
      const x = Math.round(p.x), y = p.y, n = x * x + y * y;
      box10.innerHTML = `<div class="u3l2-ph">Math 20-1: any quadrant</div>${row('sin', cY('y'), cR('r'), `\\dfrac{${y}}{5}${fracTex(y, 5) !== `\\dfrac{${y}}{5}` ? '=' + fracTex(y, 5) : ''}`)}${row('cos', cX('x'), cR('r'), x < 0 ? `\\dfrac{${x}}{5}=${fracTex(x, 5)}` : `\\dfrac{${x}}{5}`)}${row('tan', cY('y'), cX('x'), x < 0 ? `\\dfrac{${y}}{${x}}=${fracTex(y, x)}` : `\\dfrac{${y}}{${x}}`)}`;
      box10.querySelectorAll('.u3l2-sohr').forEach((r, i) => r.classList.toggle('u3l2-neg', x < 0 && i > 0));
      void n;
    }
  };
  paint(0); hide(box10);
  const note = lineIn(pn, `${T('r>0')} always, so: &nbsp; <b>sin</b> has the sign of ${T(cY('y'))}, &nbsp; <b>cos</b> has the sign of ${T(cX('x'))}.`, 'u3l2-line-key');
  return [
    { cap: 'Math 10C: a right triangle with an acute angle θ. <b>SOH CAH TOA</b>.', run: async (c) => { await p.show(c, 'tri', 'arm', 'dot', 'rot', 'lx', 'ly', 'lr'); await show(c, box10); } },
    { cap: `Put the triangle on the axes: <b>adjacent</b> = ${T(cX('x'))}, <b>opposite</b> = ${T(cY('y'))}, <b>hypotenuse</b> = ${T(cR('r'))}. Here ${T('x=4')}, ${T('y=3')}, ${T('r=5')}.`,
      run: async (c) => { p.lab('x', T(cX('x=4'))).lab('y', T(cY('y=3'))).lab('r', T(cR('r=5'))); await p.show(c, 'P'); paint(1); await pulse(c, box10, 1.04); } },
    { cap: `Move ${T('P')} to ${T('(-4,\\,3)')} in quadrant 2. The triangle flips over; ${T('r')} is still 5, but now ${T(cX('x=-4'))}.`,
      run: async (c) => { p.lab('x', T(cX('x'))); await tween(c, 1400, (t) => p.set(4 - 8 * t, 3)); p.set(-4, 3); p.lab('P', T('P(-4,\\,3)')).lab('x', T(cX('x=-4'))); } },
    { cap: `${T('\\sin\\theta=\\tfrac{3}{5}')} stays positive. ${T('\\cos\\theta=-\\tfrac{4}{5}')} and ${T('\\tan\\theta=-\\tfrac{3}{4}')} are <b>negative</b>: they use ${T('x')}.`, run: async (c) => { paint(1); await pulse(c, box10, 1.04); } },
    { cap: `${T('r')} is a distance, so ${T('r>0')}. The sign of ${T('\\sin\\theta')} is the sign of ${T('y')}; the sign of ${T('\\cos\\theta')} is the sign of ${T('x')}.`, run: (c) => show(c, note) }
  ];
}
function ratiosSigns(stage, ex) {
  const pts = [['(a)', -9, 40, 48, 6], ['(b)', -5, -12, 14, 2], ['(c)', 6, -3, 8, 1]], cw = (ex.W - 40) / 3;
  const cols = pts.map(([lab, x, y, R, st], i) => {
    const X = 14 + i * (cw + 6);
    const g = hide(div(stage, 'u3l2-sgcol', '', X, 8, cw, 436));
    div(g, 'u3l2-sgh', `${lab} ${T(`(${x},\\,${y})`)}`, null, null);
    const host = div(g, 'u3l2-sghost', '', null, null);
    const p = new Plane(host, { size: 220, R, step: st, graph: { numbers: false, grid: false }, px: x, py: y, hidden: false, thin: true, rotR: 16, refR: 30, dotR: 6 });
    p.hide('ref', 'legX', 'legY', 'lx', 'ly', 'lr', 'P', 'rot');
    const sgn = (v) => (v < 0 ? '<b class="u3l2-sgm">−</b>' : '<b class="u3l2-sgp">+</b>');
    const t = div(g, 'u3l2-sgt', `<div>${T('x')} ${sgn(x)} &nbsp; ${T('y')} ${sgn(y)} &nbsp; ${T('r')} ${sgn(1)}</div>`, null, null);
    const rows = [['sin', y], ['cos', x], ['tan', x * y]].map(([f, s]) => { const r = h('div', 'u3l2-sgr' + (s < 0 ? ' u3l2-sgneg' : ''), `${T(`\\${f}\\theta`)} ${sgn(s)}`); t.appendChild(r); hide(r); return r; });
    return { g, rows };
  });
  const caps = ['(a) Quadrant 2: <b>x is negative</b>, so <b>cos</b> and <b>tan</b> are negative.', '(b) Quadrant 3: x and y are both negative: <b>sin</b> and <b>cos</b> are negative, but tan = (−)/(−) is positive.', '(c) Quadrant 4: <b>y is negative</b>, so <b>sin</b> and <b>tan</b> are negative.'];
  return [
    ...cols.map((cl, i) => ({ cap: caps[i], run: async (c) => { await show(c, cl.g); for (const r of cl.rows) await appear(c, r, 220); } })),
    { cap: `${T('r>0')}, so only ${T('x')} and ${T('y')} decide: <b>sin</b> follows ${T('y')}, <b>cos</b> follows ${T('x')}, <b>tan</b> is positive when ${T('x')} and ${T('y')} have the same sign.`,
      run: async (c) => { await Promise.all(cols.flatMap((cl) => cl.rows.filter((r) => r.classList.contains('u3l2-sgneg')).map((r) => pulse(c, r, 1.12)))); } }
  ];
}

/* =============================== explainer: quadrantal angles =============================== */
const QT = [[0, 1, 0], [90, 0, 1], [180, -1, 0], [270, 0, -1], [360, 1, 0]];
const quadrantal = {
  title: 'Quadrantal angles: the arm on an axis',
  height: 452, minW: 940,
  choices: [{ v: 'tbl', label: 'Example 4(a): the table' }, { sep: 'Check:' }, { v: 'b', label: 'Example 4(b)' }],
  ask: (v) => (v === 'tbl' ? 'Example 4(a): the points with r = 1 on the axes. Complete the table.' : `Example 4(b): ${T('(0,\\,-7)')} is on the terminal arm of ${T('\\theta')}. State ${T('\\theta')} and the three ratios.`),
  make(stage, v, ex) { return v === 'tbl' ? quadTable(stage, ex) : quadB(stage, ex); }
};
function quadTable(stage, ex) {
  const p = new Plane(stage, { x: 10, y: 6, size: 440, R: 1.6, step: 0.5, lab: 1, px: 1, py: 0, rotR: 30 });
  const [ox, oy] = p.G.toPx(0, 0);
  svgEl('circle', { cx: ox, cy: oy, r: p.G.ux, fill: 'none', stroke: '#b9bec8', 'stroke-width': 2, 'stroke-dasharray': '6 5' }, p.under);
  p.lab('th', '');
  const W = ex.W - 476, pn = panel(stage, 466, 14, W, 424, 'With r = 1');
  const tb = h('table', 'u3l2-tbl u3l2-xt'); pn.appendChild(tb);
  const cell = (s) => T(s);
  tb.innerHTML = ['\\theta', '\\text{point}', '\\sin\\theta', '\\cos\\theta', '\\tan\\theta'].map((rh, ri) => `<tr><th>${cell(rh)}</th>${QT.map(([dg, x, y], ci) => {
    const v = ri === 0 ? `${dg}^\\circ` : ri === 1 ? `(${x},\\,${y})` : ri === 2 ? `${y}` : ri === 3 ? `${x}` : (x === 0 ? null : '0');
    return `<td data-c="${ci}" data-r="${ri}" class="${ri > 1 ? 'u3l2-hid' : ''}${ri === 4 && v === null ? ' u3l2-und' : ''}">${v === null ? 'undef.' : cell(v)}</td>`;
  }).join('')}</tr>`).join('');
  const cells = (ci) => [...tb.querySelectorAll(`td[data-c="${ci}"]`)];
  const colOn = (c, ci) => Promise.all(cells(ci).map((td) => { td.classList.add('u3l2-cur'); return td.classList.contains('u3l2-hid') ? (td.classList.remove('u3l2-hid'), appear(c, td, 300)) : Promise.resolve(); }));
  const colOff = (ci) => cells(ci).forEach((td) => td.classList.remove('u3l2-cur'));
  const fl = lineIn(pn, '', 'u3l2-line-sm'); fl.style.marginTop = '12px';
  const und = hiddenStamp(stage, '÷ 0 !', { ok: false, x: 466 + W - 70, y: 330, size: 'sm' });
  const turn = async (c, a0, a1) => { p.showNow('rot'); await tween(c, 900, (t) => p.polar(1, a0 + (a1 - a0) * t)); p.polar(1, a1); };
  const fr = (top, bot) => `\\tfrac{${top}}{${bot}}`;
  const caps = [
    `${T('\\theta=0^\\circ')}: the arm lies on the positive ${T('x')}-axis. ${T('P(1,\\,0)')}: ${T(`\\sin=${fr(0, 1)}=0`)}, ${T(`\\cos=${fr(1, 1)}=1`)}, ${T(`\\tan=${fr(0, 1)}=0`)}.`,
    `${T('90^\\circ')}: ${T('P(0,\\,1)')}. ${T('\\sin 90^\\circ=1')}, ${T('\\cos 90^\\circ=0')}, and ${T(`\\tan 90^\\circ=${fr(1, 0)}`)}: we can’t divide by 0, so it is <b>undefined</b>.`,
    `${T('180^\\circ')}: ${T('P(-1,\\,0)')}. ${T('\\sin=0')}, ${T('\\cos=-1')}, ${T(`\\tan=${fr(0, '-1')}=0`)}.`,
    `${T('270^\\circ')}: ${T('P(0,\\,-1)')}. ${T('\\sin=-1')}, ${T('\\cos=0')}, ${T(`\\tan=${fr('-1', 0)}`)} is <b>undefined</b> again.`,
    `${T('360^\\circ')}: one full turn, back to ${T('(1,\\,0)')}. The same values as ${T('0^\\circ')}.`,
    `With ${T('r=1')}: ${T('\\sin\\theta=y')} and ${T('\\cos\\theta=x')}, read straight off the point. ${T('\\tan\\theta')} is undefined where ${T('x=0')}: ${T('90^\\circ')} and ${T('270^\\circ')}.`
  ];
  return [
    { cap: caps[0], run: async (c) => { p.polar(1, 0); await p.show(c, 'arm', 'dot'); await colOn(c, 0); } },
    { cap: caps[1], run: async (c) => { colOff(0); await turn(c, 0, 90); await colOn(c, 1); await stampIn(c, und); } },
    { cap: caps[2], run: async (c) => { colOff(1); und.style.opacity = 0; await turn(c, 90, 180); await colOn(c, 2); } },
    { cap: caps[3], run: async (c) => { colOff(2); await turn(c, 180, 270); await colOn(c, 3); } },
    { cap: caps[4], run: async (c) => { colOff(3); await turn(c, 270, 360); await colOn(c, 4); } },
    { cap: caps[5], run: async (c) => { colOff(4); fl.innerHTML = `Point with ${T('r=1')}: ${T('(\\cos\\theta,\\,\\sin\\theta)')}`; await show(c, fl); await Promise.all([...tb.querySelectorAll('.u3l2-und')].map((td) => pulse(c, td, 1.15))); } }
  ];
}
function quadB(stage, ex) {
  const p = new Plane(stage, { x: 10, y: 6, size: 440, R: 8, step: 1, lab: 2, px: 0, py: -7, rotR: 30 });
  p.lab('P', T('(0,\\,-7)')).lab('th', T(cB('270^\\circ')));
  const W = ex.W - 476, pn = panel(stage, 466, 14, W, 424, 'Work');
  const l1 = lineIn(pn, `On the negative ${T('y')}-axis: ${T('\\theta=270^\\circ')}`);
  const l2 = lineIn(pn, T('r=7'));
  const l3 = lineIn(pn, T('\\sin\\theta=\\dfrac{-7}{7}=-1\\qquad\\cos\\theta=\\dfrac{0}{7}=0'), 'u3l2-line-big');
  const l4 = lineIn(pn, `${T('\\tan\\theta=\\dfrac{-7}{0}')} &nbsp; <b class="u3l2-red">undefined</b>`, 'u3l2-line-big');
  const l5 = lineIn(pn, `With ${T('(0,\\,-1)')}: ${T('\\sin\\theta=\\tfrac{-1}{1}=-1')}, ${T('\\cos\\theta=\\tfrac{0}{1}=0')}, ${T('\\tan\\theta=\\tfrac{-1}{0}')} undefined: <b>the same</b>.`, 'u3l2-line-key');
  const und = hiddenStamp(stage, '÷ 0 !', { ok: false, x: 466 + W - 60, y: 196, size: 'sm' });
  return [
    { cap: `${T('(0,\\,-7)')} is on the negative ${T('y')}-axis, so the terminal arm points straight down: ${T('\\theta=270^\\circ')}.`,
      run: async (c) => { p.deg = 270; p.draw(); await p.show(c, 'dot', 'P', 'arm'); p.rotA = 0; p.showNow('rot'); await tween(c, 900, (t) => { p.rotA = 270 * t; p.draw(); }); p.rotA = null; p.draw(); await show(c, l1); } },
    { cap: `There is no triangle to draw: ${T('r')} is just the distance down the axis, ${T('r=7')}.`, run: (c) => show(c, l2) },
    { cap: `${T('\\sin\\theta=\\tfrac{y}{r}=\\tfrac{-7}{7}=-1')} and ${T('\\cos\\theta=\\tfrac{x}{r}=\\tfrac{0}{7}=0')}.`, run: (c) => show(c, l3) },
    { cap: `${T('\\tan\\theta=\\tfrac{y}{x}=\\tfrac{-7}{0}')}: dividing by zero, so ${T('\\tan\\theta')} is <b>undefined</b>.`, run: async (c) => { await show(c, l4); await stampIn(c, und); } },
    { cap: `Slide the point up the arm to ${T('(0,\\,-1)')}: the same ratios. Any point on the arm gives the same ratios.`,
      run: async (c) => { p.lab('P', ''); await tween(c, 1100, (t) => p.set(0, -7 + 6 * t, 270)); p.set(0, -1, 270); p.lab('P', T('(0,\\,-1)')); await show(c, l5); } }
  ];
}

/* =============================== explainer: sweep the arm, watch tan =============================== */
const sweep = {
  title: `Sweep the arm: ${T('\\sin')}, ${T('\\cos')} and ${T('\\tan')} as ${T('\\theta')} turns`,
  height: 452, minW: 940,
  choices: [{ v: 'all', label: 'All the way round' }, { v: 'near', label: 'Closer and closer to 90°' }],
  ask: (v) => (v === 'all' ? 'Turn the terminal arm from 0° to 360° with r = 1. What happens to each ratio?' : `What happens to ${T('\\tan\\theta')} as ${T('\\theta')} gets close to ${T('90^\\circ')}?`),
  make(stage, v, ex) {
    const p = new Plane(stage, { x: 10, y: 6, size: 440, R: 1.5, step: 0.25, lab: 0.5, px: 1, py: 0, rotR: 30 });
    const [ox, oy] = p.G.toPx(0, 0);
    svgEl('circle', { cx: ox, cy: oy, r: p.G.ux, fill: 'none', stroke: '#b9bec8', 'stroke-width': 2, 'stroke-dasharray': '6 5' }, p.under);
    p.lab('th', '').lab('x', '').lab('y', '');
    p.showNow('arm', 'dot', 'rot', 'tri', 'legX', 'legY');
    const W = ex.W - 476, pn = panel(stage, 466, 14, W, 424, '');
    if (v === 'near') return sweepNear(p, pn, stage, ex);
    const read = div(pn, 'u3l2-sread', '', null, null);
    const MAXT = 4, BW = W - 196;
    const bars = [['sin', YC], ['cos', XC], ['tan', PUR]].map(([f, col]) => {
      const r = div(pn, 'u3l2-bar', `<div class="u3l2-bl">${T(`\\${f}\\theta`)}</div><div class="u3l2-btrack"><div class="u3l2-bzero"></div><div class="u3l2-bfill"></div><div class="u3l2-boff"></div></div><div class="u3l2-bv"></div>`, null, null);
      r.querySelector('.u3l2-bfill').style.background = col; r.querySelector('.u3l2-btrack').style.width = BW + 'px';
      return r;
    });
    const scale = div(pn, 'u3l2-bscale', `sin and cos bars: from −1 to 1 &nbsp;·&nbsp; tan bar: from −${MAXT} to ${MAXT}`, null, null);
    void scale;
    const setBar = (r, val, max) => {
      const fill = r.querySelector('.u3l2-bfill'), off = r.querySelector('.u3l2-boff'), vv = r.querySelector('.u3l2-bv');
      if (val == null) { fill.style.width = '0px'; off.textContent = ''; vv.innerHTML = '<b class="u3l2-red">undefined</b>'; return; }
      const cl = Math.max(-max, Math.min(max, val)), wpx = Math.abs(cl) / max * BW / 2;
      fill.style.width = wpx + 'px'; fill.style.left = (cl >= 0 ? BW / 2 : BW / 2 - wpx) + 'px';
      off.textContent = Math.abs(val) > max ? (val > 0 ? '→' : '←') : ''; off.style.left = (val > 0 ? BW - 6 : -16) + 'px';
      vv.innerHTML = hn(Math.abs(val) >= 100 ? fx(val, 0) : fx(val, 3));
    };
    p.onDraw = () => {
      const th = p.theta, x = p.x, y = p.y, und = Math.abs(x) < 1e-6;
      read.innerHTML = `${T(`\\theta=${fx(th, 0)}^\\circ`)} &nbsp; ${T(`P(${cX(fx(x, 3))},\\ ${cY(fx(y, 3))})`)}`;
      setBar(bars[0], y, 1); setBar(bars[1], x, 1); setBar(bars[2], und ? null : y / x, MAXT);
    };
    p.polar(1, 0);
    const turn = (c, a0, a1, ms) => tween(c, ms, (t) => p.polar(1, a0 + (a1 - a0) * t), (t) => t).then(() => p.polar(1, a1));
    return [
      { cap: `Start at ${T('0^\\circ')}: ${T('P(1,\\,0)')}. ${T('\\sin 0^\\circ=0')}, ${T('\\cos 0^\\circ=1')}, ${T('\\tan 0^\\circ=\\tfrac{0}{1}=0')}.`, run: (c) => pulse(c, read, 1.05) },
      { cap: `Turn to ${T('80^\\circ')}. ${T('x')} is getting small, so ${T('\\tfrac{y}{x}')} gets big: ${T('\\tan 80^\\circ\\approx5.671')}.`, run: (c) => turn(c, 0, 80, 1600) },
      { cap: `At exactly ${T('90^\\circ')}, ${T('x=0')}. ${T('\\tfrac{1}{0}')} has no value: ${T('\\tan 90^\\circ')} is <b>undefined</b>.`, run: (c) => turn(c, 80, 90, 900) },
      { cap: `Just past ${T('90^\\circ')}, ${T('x')} is a small <b>negative</b> number: at ${T('100^\\circ')}, ${T('\\tan\\theta\\approx-5.671')}.`, run: (c) => turn(c, 90, 100, 900) },
      { cap: `Keep turning: ${T('180^\\circ')}, then ${T('270^\\circ')} (where ${T('x=0')} again), and back to ${T('360^\\circ')}.`, run: (c) => turn(c, 100, 360, 5200) },
      { cap: `${T('\\sin\\theta')} and ${T('\\cos\\theta')} stay between ${T('-1')} and ${T('1')} (with ${T('r=1')} they are ${T('y')} and ${T('x')}). ${T('\\tan\\theta')} can be any number, but is undefined at ${T('90^\\circ')} and ${T('270^\\circ')}.`, run: (c) => Promise.all(bars.map((b) => pulse(c, b, 1.03))) }
    ];
  }
};
function sweepNear(p, pn, stage, ex) {
  const AS = [60, 80, 89, 89.9];
  const tb = h('table', 'u3l2-tbl u3l2-nt'); pn.appendChild(tb);
  tb.innerHTML = `<tr><th>${T('\\theta')}</th><th>${T('x')}</th><th>${T('y')}</th><th>${T('\\tan\\theta=\\tfrac{y}{x}')}</th></tr>` +
    AS.concat([90]).map((a) => { const x = Math.cos(a * RAD), y = Math.sin(a * RAD); return `<tr class="u3l2-hidr"><td>${T(`${a}^\\circ`)}</td><td>${T(a === 90 ? '0' : fx(x, 4))}</td><td>${T(a === 90 ? '1' : fx(y, 4))}</td><td>${a === 90 ? '<b class="u3l2-red">undefined</b>' : T(fz(y / x, 2).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,'))}</td></tr>`; }).join('');
  const rows = [...tb.querySelectorAll('tr.u3l2-hidr')]; rows.forEach(hide);
  p.lab('x', T(cX('x')));
  const go = async (c, a0, a1, i) => { await tween(c, 900, (t) => p.polar(1, a0 + (a1 - a0) * t)); p.polar(1, a1); await appear(c, rows[i], 300); };
  const tanS = (a) => fz(Math.tan(a * RAD), 2).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');
  return [
    { cap: `${T('60^\\circ')}: ${T('x=0.5')}, so ${T(`\\tan 60^\\circ=\\tfrac{0.866}{0.5}\\approx${tanS(60)}`)}.`, run: (c) => go(c, 0, 60, 0) },
    { cap: `${T('80^\\circ')}: ${T('x')} is smaller. ${T(`\\tan 80^\\circ\\approx${tanS(80)}`)}.`, run: (c) => go(c, 60, 80, 1) },
    { cap: `${T('89^\\circ')}: ${T('x\\approx0.0175')}, tiny. ${T(`\\tan 89^\\circ\\approx${tanS(89)}`)}.`, run: (c) => go(c, 80, 89, 2) },
    { cap: `${T('89.9^\\circ')}: ${T('x\\approx0.0017')}. ${T(`\\tan 89.9^\\circ\\approx${tanS(89.9)}`)}. Dividing by a tinier and tinier number…`, run: (c) => go(c, 89, 89.9, 3) },
    { cap: `…until at ${T('90^\\circ')}, ${T('x=0')}: there is no number ${T('\\tfrac{1}{0}')}. ${T('\\tan 90^\\circ')} is <b>undefined</b>.`, run: (c) => go(c, 89.9, 90, 4) }
  ];
}

/* =============================== STAR explainer: slide P along the arm, then reflect it =============================== */
const SL = {
  a: { label: 'Arm through (3, 4)', u: [3, 4], k: [1, 3, 2] },
  b: { label: 'Arm through (1, 2)', u: [1, 2], k: [1, 5, 3] }
};
const slide = {
  title: `Slide ${T('P')} along the arm, then reflect it`,
  height: 466, minW: 960, capH: 84,
  choices: [{ v: 'a', label: SL.a.label }, { v: 'b', label: SL.b.label }, { sep: 'Check:' }, { v: 'e5', label: 'Example 5 check' }],
  ask: (v) => (v === 'e5' ? `Example 5: reflect ${T('P(3,\\,4)')} into the other quadrants and complete the table.`
    : `Does it matter <b>which</b> point on the terminal arm we use? And what does a reflection change? <span class="muted">(Drag ${T('P')} along the arm any time.)</span>`),
  make(stage, v, ex) {
    if (v === 'e5') return slideE5(stage, ex);
    const d = SL[v], [u1, u2] = d.u;
    const p = new Plane(stage, { x: 10, y: 6, size: 454, R: 13, step: 1, lab: 5, px: u1 * d.k[0], py: u2 * d.k[0], dragMin: 0.8 });
    p.lab('th', T(cB('\\theta')));
    const W = ex.W - 492, pn = hide(panel(stage, 482, 10, W, 446, 'The ratio meter', 'u3l2-meter'));
    const top = div(pn, 'u3l2-mtop', '', null, null), rows = div(pn, 'u3l2-mrows', '', null, null);
    const note = hide(div(pn, 'u3l2-mnote', '', null, null));
    let exact = true, frozen = false;
    const isInt = (v2) => Math.abs(v2 - Math.round(v2)) < 1e-6;
    const paint = () => {
      if (frozen) return;
      const x = p.x, y = p.y, r = p.r, ex2 = exact && isInt(x) && isInt(y);
      const X = ex2 ? String(Math.round(x)) : fx(x, 2), Y = ex2 ? String(Math.round(y)) : fx(y, 2);
      const n = Math.round(x * x + y * y), Rt = ex2 ? sqrtTex(n) : fx(r, 2);
      top.innerHTML = `<div>${T(`${cX('x')}=${X}`)}</div><div>${T(`${cY('y')}=${Y}`)}</div><div>${T(`${cR('r')}=${Rt}`)}</div>`;
      const row = (f, a, b, val) => `<div class="u3l2-mrow${val < -1e-9 ? ' u3l2-mneg' : ''}"><span class="u3l2-mf">${T(`\\${f}\\theta=${a}`)}</span><span class="u3l2-mv">${T(`\\approx${fx(val, 3)}`)}</span></div>`;
      rows.innerHTML = row('sin', `\\dfrac{${Y}}{${Rt}}`, 0, y / r) + row('cos', `\\dfrac{${X}}{${Rt}}`, 0, x / r) + row('tan', `\\dfrac{${Y}}{${X}}`, 0, y / x);
    };
    p.onDraw = paint;
    p.draggable(() => { exact = false; paint(); }, () => { exact = false; });
    p.lab('P', T('P'));
    const ptL = () => p.lab('P', T(`P(${Math.round(p.x)},\\,${Math.round(p.y)})`));
    const k = d.k, A = [u1 * k[0], u2 * k[0]], B = [u1 * k[1], u2 * k[1]], C = [u1 * k[2], u2 * k[2]];
    const n0 = u1 * u1 + u2 * u2, rA = sqrtTex(n0 * k[0] * k[0]), rB = sqrtTex(n0 * k[1] * k[1]);
    const dec = (v2) => fx(v2, 3), sv = dec(u2 / Math.sqrt(n0)), cv = dec(u1 / Math.sqrt(n0)), tv = dec(u2 / u1);
    const slideTo = async (c, to, ms = 1500) => { const x0 = p.x, y0 = p.y; p.lab('P', T('P')); await tween(c, ms, (t) => p.set(x0 + (to[0] - x0) * t, y0 + (to[1] - y0) * t)); p.set(to[0], to[1]); exact = true; paint(); ptL(); };
    const flip = async (c, sx, sy, ms = 1300) => { const x0 = p.x, y0 = p.y; frozen = true; pn.classList.add('u3l2-dim'); p.lab('P', T('P')).lab('th', '');
      await tween(c, ms, (t) => p.set(x0 * (1 - (1 - sx) * t), y0 * (1 - (1 - sy) * t))); p.set(x0 * sx, y0 * sy);
      frozen = false; exact = true; pn.classList.remove('u3l2-dim'); paint(); ptL(); p.lab('th', T(cB('\\theta'))); await pulse(c, rows, 1.03); };
    const stick = [];
    const stickers = () => { // a sign sticker in each quadrant
      const G = p.G, R = 13;
      [[1, 1], [-1, 1], [-1, -1], [1, -1]].forEach(([sx, sy], i) => {
        const [px, py] = G.toPx(sx * 9.8, sy * 2.8), s = (v2) => (v2 < 0 ? '<b class="u3l2-sgm">−</b>' : '<b class="u3l2-sgp">+</b>');
        const e = div(G.html, 'u3l2-stick', `<div class="u3l2-sq">Q${i + 1}</div>sin ${s(sy)} &nbsp;cos ${s(sx)} &nbsp;tan ${s(sx * sy)}`, null, null);
        place(e, px, py, 'c'); hide(e); stick.push(e);
        const g = svgEl('polygon', { class: 'u3l2-ghost4', points: [[0, 0], [sx * Math.abs(C[0]), 0], [sx * Math.abs(C[0]), sy * Math.abs(C[1])]].map((q) => G.toPx(q[0], q[1]).map(f1).join(',')).join(' '), fill: BR, 'fill-opacity': 0.07, stroke: BR, 'stroke-width': 1.6, 'stroke-dasharray': '5 5', 'stroke-opacity': 0.5 }, p.ghosts);
        hide(g); stick.push(g);
      });
    };
    stickers();
    paint();
    const fr = (a, b) => `\\tfrac{${a}}{${b}}`;
    return [
      { cap: `The terminal arm through ${T(`(${u1},\\,${u2})`)}. Take ${T(`P(${A[0]},\\,${A[1]})`)}: ${T(`r=${rA}`)}. Read the three ratios on the meter.`,
        run: async (c) => { ptL(); await p.show(c, 'arm', 'rot', 'tri', 'dot', 'P'); await show(c, pn); } },
      { cap: `Slide ${T('P')} out along the arm to ${T(`(${B[0]},\\,${B[1]})`)}. The triangle grows: ${T('x')}, ${T('y')} and ${T('r')} all change (${T(`r=${rB}`)})…`,
        run: async (c) => { p.ghost(); await slideTo(c, B, 1700); } },
      { cap: `…but the ratios don’t: ${T(`\\sin\\theta\\approx${sv}`)}, ${T(`\\cos\\theta\\approx${cv}`)}, ${T(`\\tan\\theta\\approx${tv}`)}, the same as before.`, run: (c) => Promise.all([...rows.querySelectorAll('.u3l2-mv')].map((e) => pulse(c, e, 1.18))) },
      { cap: `Slide back in to ${T(`(${C[0]},\\,${C[1]})`)}. Still ${sv}, ${cv} and ${tv}.`, run: async (c) => { p.ghost(); await slideTo(c, C, 1200); } },
      { cap: 'Every triangle on the arm has the <b>same angles</b>: they are <b>similar</b>, so their sides are in the same ratios. Any point on the arm gives the same sin, cos and tan.',
        run: async (c) => { await Promise.all([...p.ghosts.querySelectorAll('.u3l2-ghost')].map((g) => anim(c, g, [{ strokeOpacity: 0.55 }, { strokeOpacity: 1 }, { strokeOpacity: 0.55 }], 900))); note.innerHTML = 'Similar triangles: same shape, different size.'; await show(c, note); } },
      { cap: `Now <b>reflect</b> ${T('P')} in the ${T('y')}-axis: ${T(`(${-C[0]},\\,${C[1]})`)} in quadrant 2. Same size triangle; only ${T('x')} changes sign. ${T('\\cos\\theta')} and ${T('\\tan\\theta')} turn negative.`,
        run: async (c) => { p.ghosts.querySelectorAll('.u3l2-ghost').forEach((g) => g.remove()); note.style.opacity = 0; await flip(c, -1, 1); } },
      { cap: `Reflect in the ${T('x')}-axis: ${T(`(${-C[0]},\\,${-C[1]})`)} in quadrant 3. Now ${T('y<0')} too: ${T('\\sin\\theta')} is negative, and ${T(`\\tan\\theta=${fr('-', '-')}`)} is positive again.`, run: (c) => flip(c, 1, -1) },
      { cap: `Reflect in the ${T('y')}-axis: ${T(`(${C[0]},\\,${-C[1]})`)} in quadrant 4. ${T('x>0')}, ${T('y<0')}: only ${T('\\cos\\theta')} is positive.`, run: (c) => flip(c, -1, 1) },
      { cap: `One reference triangle, four quadrants: the ratios keep their <b>size</b> (${sv}, ${cv}, ${tv}). Only the <b>signs</b> change, and the quadrant decides them.`, run: (c) => showAll(c, stick) }
    ];
  }
};
function slideE5(stage, ex) {
  const p = new Plane(stage, { x: 10, y: 6, size: 454, R: 6, step: 1, lab: 2, px: 3, py: 4, rotR: 26, refR: 46 });
  p.lab('P', T('P(3,\\,4)')).lab('th', T(cB('\\theta'))).lab('thR', T(cA('53.1^\\circ')));
  const W = ex.W - 492, pn = panel(stage, 482, 10, W, 446, 'Example 5');
  const PTS = [['P', 3, 4, 1, '53.1'], ['Q', -3, 4, 2, '126.9'], ['R', -3, -4, 3, '233.1'], ['S', 3, -4, 4, '306.9']];
  const tb = h('table', 'u3l2-tbl u3l2-e5t'); pn.appendChild(tb);
  const RW = [['\\text{Point}', ([n, x, y]) => `${n}(${x},\\,${y})`], ['\\text{Quadrant}', (q) => String(q[3])], ['r', () => '5'], ['\\theta', (q) => `${q[4]}^\\circ`],
    ['\\sin\\theta', ([, , y]) => fracTex(y, 5, '\\tfrac')], ['\\cos\\theta', ([, x]) => fracTex(x, 5, '\\tfrac')], ['\\tan\\theta', ([, x, y]) => fracTex(y, x, '\\tfrac')]];
  tb.innerHTML = RW.map(([hd, f]) => `<tr><th>${T(hd)}</th>${PTS.map((q, ci) => `<td data-c="${ci}" class="u3l2-hid">${T(f(q))}</td>`).join('')}</tr>`).join('');
  const col = (c, ci) => Promise.all([...tb.querySelectorAll(`td[data-c="${ci}"]`)].map((td) => { td.classList.remove('u3l2-hid'); return appear(c, td, 300); }));
  const calc = lineIn(pn, `<span class="u3l2-scr1">sin(233.1)</span><span class="u3l2-scr2">${ti(Math.sin(233.1 * RAD))}</span>`, 'u3l2-scr u3l2-scrrow');
  const names = [];
  const flip = async (c, sx, sy, q) => {
    const g = p.ghost(); const nm = div(p.G.html, 'u3l2-gname', T(PTS[q - 1][0]), null, null); const [gx, gy] = p.G.toPx(p.x, p.y); place(nm, gx, gy, (p.y >= 0 ? 'n' : 's') + (p.x >= 0 ? 'e' : 'w'), 6); names.push(nm); void g;
    p.lab('P', '').lab('th', '').lab('thR', '');
    const x0 = p.x, y0 = p.y; await tween(c, 1200, (t) => p.set(x0 * (1 - (1 - sx) * t), y0 * (1 - (1 - sy) * t))); p.set(x0 * sx, y0 * sy);
    const Q = PTS[q]; p.lab('P', T(`${Q[0]}(${Q[1]},\\,${Q[2]})`)).lab('th', T(cB(`${Q[4]}^\\circ`))).lab('thR', T(cA('53.1^\\circ')));
    p.rotA = 0; p.draw(); await tween(c, 800, (t) => { p.rotA = p.theta * t; p.draw(); }); p.rotA = null; p.draw();
    await col(c, q);
  };
  return [
    { cap: `${T('P(3,\\,4)')}: quadrant 1, ${T('r=\\sqrt{9+16}=5')}, ${T('\\theta=\\tan^{-1}\\!\\left(\\tfrac{4}{3}\\right)\\approx53.1^\\circ')}.`, run: async (c) => { await p.show(c, 'arm', 'rot', 'tri', 'dot', 'P', 'ref'); await col(c, 0); } },
    { cap: `Reflect in the ${T('y')}-axis: ${T('Q(-3,\\,4)')} in quadrant 2. ${T('\\theta=180^\\circ-53.1^\\circ=126.9^\\circ')}.`, run: (c) => flip(c, -1, 1, 1) },
    { cap: `Reflect in both axes: ${T('R(-3,\\,-4)')} in quadrant 3. ${T('\\theta=180^\\circ+53.1^\\circ=233.1^\\circ')}.`, run: (c) => flip(c, 1, -1, 2) },
    { cap: `Reflect in the ${T('x')}-axis: ${T('S(3,\\,-4)')} in quadrant 4. ${T('\\theta=360^\\circ-53.1^\\circ=306.9^\\circ')}.`, run: (c) => flip(c, -1, 1, 3) },
    { cap: `Check a column in Degree mode: ${T('\\sin 233.1^\\circ\\approx-0.80')}, and ${T('-\\tfrac{4}{5}=-0.8')}. ✓`, run: async (c) => { await show(c, calc); await pulse(c, tb.querySelector('tr:nth-child(5) td[data-c="2"]'), 1.25); } },
    { cap: `Every column has the same numbers ${T('\\tfrac{4}{5}')}, ${T('\\tfrac{3}{5}')}, ${T('\\tfrac{4}{3}')}: <b>only the signs change</b>. Each ratio of ${T('\\theta')} is the ratio of ${T('\\theta_R')} or its negative.`,
      run: (c) => Promise.all([...tb.querySelectorAll('tr:nth-child(n+5) td')].map((td) => pulse(c, td, 1.12))) }
  ];
}

/* =============================== explainer: same ratio of θ_R, with a sign =============================== */
const RS = {
  c: { label: 'cos 150°', f: 'cos', a: 150, ex: '' },
  a: { label: '(a) sin 250°', f: 'sin', a: 250, ex: 'Example 6(a)' },
  b: { label: '(b) cos 130°', f: 'cos', a: 130, ex: 'Example 6(b)' },
  cc: { label: '(c) tan 310°', f: 'tan', a: 310, ex: 'Example 6(c)' },
  d: { label: '(d) sin 165°', f: 'sin', a: 165, ex: 'Example 6(d)' }
};
const refSign = {
  title: 'The reference angle gives the size, the quadrant the sign',
  height: 452, minW: 940,
  choices: [{ v: 'c', label: RS.c.label }, { sep: 'Example 6 check:' }, ...['a', 'b', 'cc', 'd'].map((k) => ({ v: k, label: RS[k].label }))],
  ask: (v) => `${RS[v].ex ? RS[v].ex + ': write' : 'Write'} ${T(`\\${RS[v].f} ${RS[v].a}^\\circ`)} as the same ratio of the reference angle, with the correct sign.`,
  make(stage, v, ex) {
    const d = RS[v], a = d.a, q = a < 90 ? 1 : a < 180 ? 2 : a < 270 ? 3 : 4, ar = refOf(a), R1 = 1;
    const x = Math.cos(a * RAD), y = Math.sin(a * RAD);
    const p = new Plane(stage, { x: 10, y: 6, size: 440, R: 1.25, step: 0.25, lab: 1, px: x, py: y, rotR: 34, refR: 66 });
    const [ox, oy] = p.G.toPx(0, 0);
    svgEl('circle', { cx: ox, cy: oy, r: p.G.ux * R1, fill: 'none', stroke: '#d0d3da', 'stroke-width': 1.6, 'stroke-dasharray': '5 5' }, p.under);
    p.lab('th', T(cB(`${a}^\\circ`))).lab('thR', T(cA(`${ar}^\\circ`)));
    const sx = x < 0 ? -1 : 1, sy = y < 0 ? -1 : 1;
    const g1 = (px2, py2) => [[0, 0], [px2, 0], [px2, py2]].map((pt) => p.G.toPx(pt[0], pt[1]).map(f1).join(',')).join(' ');
    const X1 = Math.cos(ar * RAD), Y1 = Math.sin(ar * RAD);
    const ghost = svgEl('polygon', { points: g1(X1, Y1), fill: AMB, 'fill-opacity': 0.12, stroke: AMB, 'stroke-width': 2, 'stroke-dasharray': '6 5' }, p.ghosts); hide(ghost);
    const gl = div(p.G.html, 'u3l2-gq1', T(cA(`${ar}^\\circ`)), null, null); { const [lx, ly] = P2(ox, oy, 88, ar / 2); place(gl, lx, ly, 'c'); } hide(gl);
    const mover = svgEl('polygon', { points: g1(X1, Y1), fill: BR, 'fill-opacity': 0.12, stroke: BR, 'stroke-width': 2.4 }, p.ghosts); hide(mover);
    const sign = d.f === 'sin' ? sy : d.f === 'cos' ? sx : sx * sy, sTxt = sign < 0 ? '-' : '';
    const W = ex.W - 476, pn = panel(stage, 466, 14, W, 424, 'Work');
    const l1 = lineIn(pn, `${T(`${a}^\\circ`)} is in <b>quadrant ${q}</b>.`);
    const l2 = lineIn(pn, `${T(cA('\\theta_R'))} ${T(`=${q === 2 ? `180^\\circ-${a}^\\circ` : q === 3 ? `${a}^\\circ-180^\\circ` : q === 4 ? `360^\\circ-${a}^\\circ` : `${a}^\\circ`}=${cA(`${ar}^\\circ`)}`)}`);
    const why = d.f === 'sin' ? `sine follows ${T('y')}: ${T(sy < 0 ? 'y<0' : 'y>0')}` : d.f === 'cos' ? `cosine follows ${T('x')}: ${T(sx < 0 ? 'x<0' : 'x>0')}` : `tangent follows ${T('\\tfrac{y}{x}')}: ${T(`\\tfrac{${sy < 0 ? '-' : '+'}}{${sx < 0 ? '-' : '+'}}`)}`;
    const l3 = lineIn(pn, `Sign: ${why}, so <b>${sign < 0 ? 'negative' : 'positive'}</b>.`);
    const l4 = lineIn(pn, T(`\\${d.f} ${a}^\\circ=${sTxt}\\${d.f} ${ar}^\\circ`), 'u3l2-line-ans u3l2-line-big');
    const F = { sin: Math.sin, cos: Math.cos, tan: Math.tan }[d.f], v1 = F(a * RAD), v2 = F(ar * RAD);
    const l5 = lineIn(pn, `<span class="muted">Calculator:</span> ${T(`\\${d.f} ${a}^\\circ\\approx${fx(v1, 4)}`)}, &nbsp; ${T(`\\${d.f} ${ar}^\\circ\\approx${fx(v2, 4)}`)}`, 'u3l2-line-sm');
    const legs = d.f === 'sin' ? ['legY'] : d.f === 'cos' ? ['legX'] : ['legX', 'legY'];
    p.lab('x', T(cX(sx < 0 ? 'x<0' : 'x>0'))).lab('y', T(cY(sy < 0 ? 'y<0' : 'y>0')));
    const labs = d.f === 'sin' ? ['ly'] : d.f === 'cos' ? ['lx'] : ['lx', 'ly'];
    return [
      { cap: `Sketch ${T(`${a}^\\circ`)}: ${q === 1 ? 'less than 90°' : q === 2 ? 'between 90° and 180°' : q === 3 ? 'past 180°' : 'past 270°'}, so the terminal arm is in <b>quadrant ${q}</b>.`,
        run: async (c) => { p.rotA = 0; p.draw(); p.showNow('rot'); await p.show(c, 'arm', 'dot'); await tween(c, 1000, (t) => { p.rotA = a * t; p.draw(); }); p.rotA = null; p.draw(); await show(c, l1); } },
      { cap: `The reference angle goes to the <b>nearest</b> ${T('x')}-axis: ${T(`\\theta_R=${ar}^\\circ`)}.`, run: async (c) => { await p.show(c, 'ref'); await show(c, l2); } },
      { cap: `Its reference triangle is the ${T(`${ar}^\\circ`)} triangle from quadrant 1, reflected into quadrant ${q}: the same size, so the same ratio <b>size</b>.`,
        run: async (c) => { await showAll(c, [ghost, gl, mover]); await tween(c, 1100, (t) => mover.setAttribute('points', g1(X1 * (1 - (1 - sx) * t), Y1 * (1 - (1 - sy) * t)))); await p.show(c, 'tri'); mover.style.opacity = 0; } },
      { cap: `The sign: ${why}.`, run: async (c) => { await p.show(c, ...legs, ...labs); await show(c, l3); } },
      { cap: `So ${T(`\\${d.f} ${a}^\\circ=${sTxt}\\${d.f} ${ar}^\\circ`)}. The calculator agrees: ${T(fx(v1, 4))} and ${T(fx(v2, 4))}.`, run: async (c) => { await show(c, l4); await show(c, l5); } }
    ];
  }
};

/* =============================== explainer: finding θ from a point =============================== */
const FA = {
  w: { label: 'Why not tan⁻¹(y/x)?', x: -3, y: 2 },
  a: { label: '(a) (5, 2)', x: 5, y: 2, ex: 'Example 7(a)' },
  b: { label: '(b) (−4, 5)', x: -4, y: 5, ex: 'Example 7(b)' },
  c: { label: '(c) (−6, −1)', x: -6, y: -1, ex: 'Example 7(c)' },
  d: { label: '(d) (3, −5)', x: 3, y: -5, ex: 'Example 7(d)' }
};
const PLACE = ['', '\\theta=\\theta_R', '\\theta=180^\\circ-\\theta_R', '\\theta=180^\\circ+\\theta_R', '\\theta=360^\\circ-\\theta_R'];
const ti = (v) => hn(Number(v.toPrecision(10)).toString().replace(/^(-?)0\./, '$1.')); // a TI-84 style result (−.7996…)
function findSetup(stage, ex, d) {
  const { x, y } = d, q = quad(x, y), tR = Math.atan(Math.abs(y) / Math.abs(x)) / RAD, tR1 = Number(fx(tR, 1));
  const th1 = q === 1 ? tR1 : q === 2 ? 180 - tR1 : q === 3 ? 180 + tR1 : 360 - tR1;
  const p = new Plane(stage, { x: 10, y: 6, size: 440, R: 7, step: 1, lab: 2, px: x, py: y, rotR: 30, refR: 58 });
  p.lab('P', T(`(${x},\\,${y})`)).lab('x', T(cX(String(Math.abs(x))))).lab('y', T(cY(String(Math.abs(y))))).lab('thR', T(cA(`${fx(tR, 1)}^\\circ`))).lab('th', '');
  const W = ex.W - 476, pn = panel(stage, 466, 10, W, 432, '');
  const scr = div(pn, 'u3l2-scr', '', null, null);
  const scrLine = (expr, val) => { const r = h('div', 'u3l2-scrrow', `<span class="u3l2-scr1">${expr}</span><span class="u3l2-scr2">${val}</span>`); scr.appendChild(r); hide(r); return r; };
  const plc = div(pn, 'u3l2-place', [1, 2, 3, 4].map((k) => `<div class="u3l2-pr" data-q="${k}"><b>Q${k}</b> ${T(PLACE[k])}</div>`).join(''), null, null);
  const res = lineIn(pn, '', 'u3l2-line-ans u3l2-line-big');
  const live = div(p.G.html, 'u3l2-live', '', null, null); place(live, 430, 12, 'sw'); hide(live);
  const sweepTo = async (c, deg) => { p.rotA = 0; p.lab('th', ''); p.draw(); p.showNow('rot'); await appear(c, live, 200);
    await tween(c, 1500, (t) => { p.rotA = deg * t; p.draw(); live.innerHTML = T(`\\theta=${fx(deg * t, 1)}^\\circ`); }); p.rotA = null; p.draw(); live.innerHTML = T(`\\theta\\approx${fx(deg, 1)}^\\circ`); };
  const light = (k) => plc.querySelectorAll('.u3l2-pr').forEach((e) => e.classList.toggle('on', +e.dataset.q === k));
  return { x, y, q, tR, tR1, th1, p, pn, scr, scrLine, plc, res, sweepTo, light, live };
}
const findAngle = {
  title: `Finding ${T('\\theta')} from a point`,
  height: 452, minW: 940,
  choices: [{ v: 'w', label: FA.w.label }, { sep: 'Example 7 check:' }, ...['a', 'b', 'c', 'd'].map((k) => ({ v: k, label: FA[k].label }))],
  ask: (v) => (v === 'w' ? `${T('(-3,\\,2)')} is on the terminal arm of ${T('\\theta')}. Why doesn’t ${T('\\tan^{-1}\\!\\left(\\tfrac{y}{x}\\right)')} give ${T('\\theta')}?`
    : `${FA[v].ex}: ${T(`(${FA[v].x},\\,${FA[v].y})`)} is on the terminal arm of ${T('\\theta')}, ${T('0^\\circ\\le\\theta<360^\\circ')}. Find ${T('\\theta')} to the nearest tenth.`),
  make(stage, v, ex) {
    const S = findSetup(stage, ex, FA[v]), { x, y, q, tR, tR1, th1, p } = S;
    const ay = Math.abs(y), axx = Math.abs(x);
    const sc1 = v === 'w' ? S.scrLine(`tan⁻¹(${y}/${hn(x)})`, ti(Math.atan(y / x) / RAD)) : null, sc2 = S.scrLine(`tan⁻¹(${ay}/${axx})`, ti(tR));
    const placeTex = q === 1 ? `\\theta=\\theta_R\\approx${fx(tR, 1)}^\\circ` : `\\theta=${q === 2 ? `180^\\circ-${fx(tR1, 1)}^\\circ` : q === 3 ? `180^\\circ+${fx(tR1, 1)}^\\circ` : `360^\\circ-${fx(tR1, 1)}^\\circ`}=${fx(th1, 1)}^\\circ`;
    if (v === 'w') {
      const wrong = Math.atan(y / x) / RAD;
      const G = p.G, [ox, oy] = G.toPx(0, 0), u = [Math.cos(wrong * RAD), Math.sin(wrong * RAD)], [ex2, ey2] = G.toPx(u[0] * 6.6, u[1] * 6.6);
      const half = svgEl('rect', { x: ox, y: G.toPx(0, 7)[1], width: G.toPx(7, 0)[0] - ox, height: G.toPx(0, -7)[1] - G.toPx(0, 7)[1], fill: '#c93a33', 'fill-opacity': 0.06 }, p.under); hide(half);
      const hl = div(G.html, 'u3l2-halflab', 'tan⁻¹ only gives<br>−90° to 90°', null, null); place(hl, G.toPx(3.6, 6)[0], G.toPx(3.6, 6)[1], 'c'); hide(hl);
      const gw = svgEl('g', {}, p.over); hide(gw);
      svgEl('line', { x1: ox, y1: oy, x2: ex2, y2: ey2, stroke: YC, 'stroke-width': 4, 'stroke-dasharray': '10 7', 'stroke-linecap': 'round' }, gw);
      svgEl('path', { d: arcD(ox, oy, 40, 0, wrong), fill: 'none', stroke: YC, 'stroke-width': 2.6 }, gw);
      svgEl('path', { d: arcHead(ox, oy, 40, 0, wrong, 11, 5.5), fill: YC }, gw);
      const wl = div(G.html, 'u3l2-wlab', T(`${fx(wrong, 1)}^\\circ`), null, null); { const [lx, ly] = P2(ox, oy, 62, wrong / 2); place(wl, lx, ly, 'c'); } hide(wl);
      const bad = hiddenStamp(stage, '✗ quadrant 4', { ok: false, x: 300, y: 380, size: 'sm' }), good = hiddenStamp(stage, '✓', { ok: true, x: 96, y: 64 });
      return [
        { cap: `Plot ${T('(-3,\\,2)')}: <b>quadrant 2</b>. So ${T('\\theta')} must be between ${T('90^\\circ')} and ${T('180^\\circ')}.`, run: async (c) => { await p.show(c, 'dot', 'P', 'arm'); } },
        { cap: `Type ${T('\\tan^{-1}\\!\\left(\\tfrac{y}{x}\\right)')} with the signs left in: ${T(`\\tan^{-1}\\!\\left(\\tfrac{2}{-3}\\right)\\approx${fx(wrong, 1)}^\\circ`)}. That turns <b>clockwise</b>…`,
          run: async (c) => { await show(c, sc1); await appear(c, gw, 500); await show(c, wl); } },
        { cap: `…into <b>quadrant 4</b>, nowhere near ${T('P')}! The calculator only ever answers between ${T('-90^\\circ')} and ${T('90^\\circ')} (quadrants 1 and 4).`, run: async (c) => { await showAll(c, [half, hl]); await stampIn(c, bad); } },
        { cap: `Use the leg <b>lengths</b> instead: ${T(`\\theta_R=\\tan^{-1}\\!\\left(\\tfrac{2}{3}\\right)\\approx${fx(tR, 1)}^\\circ`)}.`,
          run: async (c) => { gw.style.opacity = 0.15; wl.style.opacity = 0; bad.style.opacity = 0; half.style.opacity = 0; hl.style.opacity = 0; await p.show(c, 'tri', 'lx', 'ly', 'ref'); await show(c, sc2); } },
        { cap: `Then place it: quadrant 2, ${T(placeTex)}. ✓`, run: async (c) => { S.light(2); await S.sweepTo(c, th1); S.res.innerHTML = T(`\\theta\\approx${fx(th1, 1)}^\\circ`); await show(c, S.res); await stampIn(c, good); } }
      ];
    }
    return [
      { cap: `Plot ${T(`(${x},\\,${y})`)}: ${moveWords(x, y)}. It is in <b>quadrant ${q}</b>.`, run: async (c) => { await p.show(c, 'dot', 'P', 'arm'); } },
      { cap: `The reference triangle has legs ${T(String(axx))} and ${T(String(ay))}: ${T(`\\theta_R=\\tan^{-1}\\!\\left(\\tfrac{${ay}}{${axx}}\\right)\\approx${fx(tR, 1)}^\\circ`)}.`,
        run: async (c) => { await p.show(c, 'tri', 'legX', 'legY', 'lx', 'ly'); await show(c, sc2); await p.show(c, 'ref'); } },
      { cap: q === 1 ? `Quadrant 1: the angle <b>is</b> the reference angle, ${T('\\theta=\\theta_R')}.` : `Quadrant ${q}: ${T(PLACE[q])}.`, run: async (c) => { S.light(q); await pulse(c, S.plc.querySelector(`[data-q="${q}"]`), 1.06); } },
      { cap: `${T(placeTex)}: turn counterclockwise from the positive ${T('x')}-axis all the way to the arm.`,
        run: async (c) => { await S.sweepTo(c, th1); S.res.innerHTML = T(placeTex); await show(c, S.res); } }
    ];
  }
};

/* =============================== explainer: the robotic arm (Example 8) =============================== */
function robotScene(host, o) {
  const G = new Graph(host, { x: o.x, y: o.y, width: o.width, height: Math.round((o.width - 36) / 21 * 14 + 36), xmin: -15, xmax: 6, ymin: -8, ymax: 6, xlabels: 5, ylabels: 5, fontSize: o.fs || 15 });
  const [ox, oy] = G.toPx(0, 0), u = G.ux, L = 13 * u;
  const arm = svgEl('g', {}, G.layers.top); arm.style.transformBox = 'view-box'; arm.style.transformOrigin = '0 0';
  svgEl('rect', { x: ox, y: oy - 0.45 * u, width: L, height: 0.9 * u, rx: 0.45 * u, fill: '#9aa3b0', stroke: '#4c5561', 'stroke-width': 2 }, arm);
  svgEl('rect', { x: ox + L * 0.48, y: oy - 0.55 * u, width: 0.7 * u, height: 1.1 * u, rx: 0.2 * u, fill: '#7d8794' }, arm);
  svgEl('path', { d: `M${ox + L - 0.1 * u} ${oy - 0.45 * u} l${0.9 * u} ${-0.45 * u} M${ox + L - 0.1 * u} ${oy + 0.45 * u} l${0.9 * u} ${0.45 * u}`, stroke: '#4c5561', 'stroke-width': 3, 'stroke-linecap': 'round', fill: 'none' }, arm);
  svgEl('circle', { cx: ox, cy: oy, r: 0.9 * u, fill: '#2e3c4f', stroke: '#fff', 'stroke-width': 2 }, G.layers.top);
  svgEl('circle', { cx: ox + L, cy: oy, r: 0.32 * u, fill: BR }, arm);
  const setArm = (deg) => arm.setAttribute('transform', `rotate(${-deg} ${ox} ${oy})`);
  return { G, arm, setArm, ox, oy };
}
const robot = {
  title: 'Example 8 check: the robotic arm',
  height: 404, minW: 940,
  choices: [{ v: 'e8', label: 'Example 8 check' }],
  ask: () => `Example 8: the arm’s tip is at ${T('T(-12,\\,-5)')} (cm). Its length, the three ratios, and ${T('\\theta')}.`,
  make(stage, v, ex) {
    const S = robotScene(stage, { x: 10, y: 8, width: 570 }), G = S.G;
    const th = angOf(-12, -5), tR = Math.atan(5 / 12) / RAD;
    S.setArm(th);
    const T0 = G.point(-12, -5, { label: T('T(-12,\\,-5)'), pos: 's', color: INK, r: 5 });
    const [ox, oy] = G.toPx(0, 0), [bx, by] = G.toPx(-12, 0), [tx, ty] = G.toPx(-12, -5);
    const tri = svgEl('g', {}, G.layers.data); hide(tri);
    svgEl('line', { x1: ox, y1: oy, x2: bx, y2: by, stroke: XC, 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-opacity': 0.8 }, tri);
    svgEl('line', { x1: bx, y1: by, x2: tx, y2: ty, stroke: YC, 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-opacity': 0.8 }, tri);
    const lx = div(G.html, 'bk-lab u3l2-lx', T(cX('12')), null, null); place(lx, (ox + bx) / 2, by, 'n', 6); hide(lx);
    const ly = div(G.html, 'bk-lab u3l2-ly', T(cY('5')), null, null); place(ly, bx, (by + ty) / 2, 'w', 8); hide(ly);
    const lr = div(G.html, 'bk-lab u3l2-lr', T(cR('13')), null, null); place(lr, (ox + tx) / 2 + 8, (oy + ty) / 2 + 22, 'c'); hide(lr);
    const wedge = svgEl('path', { d: wedgeD(ox, oy, 70, 180, th), fill: AMB, 'fill-opacity': 0.3, stroke: AMB, 'stroke-width': 2.5 }, G.layers.data); hide(wedge);
    const wl = div(G.html, 'bk-lab u3l2-lthr', T(cA(`${fx(tR, 1)}^\\circ`)), null, null); { const [a, b] = P2(ox, oy, 96, 180 + tR / 2); place(wl, a, b, 'c'); } hide(wl);
    const rot = svgEl('path', { fill: 'none', stroke: BR, 'stroke-width': 3 }, G.layers.data), rh = svgEl('path', { fill: BR }, G.layers.data);
    const live = div(G.html, 'u3l2-live', '', null, null); place(live, 560, 12, 'sw'); hide(live);
    const W = ex.W - 602, pn = panel(stage, 592, 8, W, 388, 'Work');
    const l1 = lineIn(pn, `(a) ${T('r=\\sqrt{(-12)^2+(-5)^2}')}<br>${T('\\phantom{(a)\\ r}=\\sqrt{144+25}=\\sqrt{169}=\\boldsymbol{13}')} cm`);
    const l2 = lineIn(pn, `(b) ${T('\\sin\\theta=\\dfrac{y}{r}=-\\dfrac{5}{13}')}`, 'u3l2-line-big');
    const l3 = lineIn(pn, `${T('\\phantom{(b)}\\ \\cos\\theta=\\dfrac{x}{r}=-\\dfrac{12}{13}')}`, 'u3l2-line-big');
    const l4 = lineIn(pn, `${T('\\phantom{(b)}\\ \\tan\\theta=\\dfrac{y}{x}=\\dfrac{-5}{-12}=\\dfrac{5}{12}')}`, 'u3l2-line-big');
    const l5 = lineIn(pn, `(c) Q3: ${T(`\\theta_R=\\tan^{-1}\\!\\left(\\tfrac{5}{12}\\right)\\approx${fx(tR, 1)}^\\circ`)}`);
    const l6 = lineIn(pn, T(`\\theta=180^\\circ+${fx(tR, 1)}^\\circ=\\boldsymbol{${fx(180 + Number(fx(tR, 1)), 1)}^\\circ}`), 'u3l2-line-ans');
    const setRot = (a) => { rot.setAttribute('d', arcD(ox, oy, 44, 0, a)); rh.setAttribute('d', arcHead(ox, oy, 44, 0, a, 12, 6)); };
    return [
      { cap: `The arm pivots at the origin; its tip is at ${T('T(-12,\\,-5)')}, in <b>quadrant 3</b>. The arm is the terminal arm, and its length is ${T('r')}.`, run: (c) => pulse(c, T0.label, 1.15) },
      { cap: `(a) Drop the perpendicular: legs 12 and 5. ${T('r=\\sqrt{144+25}=\\sqrt{169}=13')} cm.`, run: async (c) => { await showAll(c, [tri, lx, ly]); await show(c, lr); await show(c, l1); } },
      { cap: `(b) ${T('\\sin\\theta=-\\tfrac{5}{13}')} (${T('y<0')}) and ${T('\\cos\\theta=-\\tfrac{12}{13}')} (${T('x<0')}).`, run: async (c) => { await show(c, l2); await show(c, l3); } },
      { cap: `${T('\\tan\\theta=\\tfrac{-5}{-12}=\\tfrac{5}{12}')}: two negatives, so it is <b>positive</b>.`, run: (c) => show(c, l4) },
      { cap: `(c) Quadrant 3: the reference angle is to the negative ${T('x')}-axis. ${T(`\\theta_R=\\tan^{-1}\\!\\left(\\tfrac{5}{12}\\right)\\approx${fx(tR, 1)}^\\circ`)}.`, run: async (c) => { await showAll(c, [wedge, wl]); await show(c, l5); } },
      { cap: `${T(`\\theta=180^\\circ+${fx(tR, 1)}^\\circ=${fx(180 + Number(fx(tR, 1)), 1)}^\\circ`)}. Watch the arm swing there, counterclockwise from the positive ${T('x')}-axis.`,
        run: async (c) => { T0.label.style.opacity = 0.3; await appear(c, live, 200); await tween(c, 2200, (t) => { const a = th * t; S.setArm(a); setRot(a); live.innerHTML = T(`\\theta=${fx(a, 1)}^\\circ`); });
          S.setArm(th); setRot(th); live.innerHTML = T(`\\theta\\approx${fx(th, 1)}^\\circ`); T0.label.style.opacity = 1; await show(c, l6); } }
    ];
  }
};

/* =============================== Stand Up Break =============================== */
const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15], [20, 21, 29], [12, 16, 20]];
standup('u3l2', {
  intro: 'At your whiteboard: sketch the point, draw the reference triangle, then find r and the ratios (or the angle).',
  levels: {
    BEG: (r) => { // a Pythagorean-triple point in quadrant 1 or 2
      const [a, b] = r.pick(TRIPLES), [x0, y0] = r.chance(0.5) ? [a, b] : [b, a], x = r.chance(0.5) ? x0 : -x0, y = y0, R = ratioTex(x, y);
      return { text: `The point <b>${T(`(${x},\\,${y})`)}</b> is on the terminal arm of ${T('\\theta')}. Find ${T('r')} and the exact values of ${T('\\sin\\theta')}, ${T('\\cos\\theta')} and ${T('\\tan\\theta')}.`, q: '',
        a: [`r=\\sqrt{${sq(x)}+${sq(y)}}=${R.r}`, `\\sin\\theta=${chain(R.sin)},\\quad\\cos\\theta=${chain(R.cos)},\\quad\\tan\\theta=${chain(R.tan)}`] };
    },
    PRG: (r) => { // any quadrant, r a radical: rationalize
      let x, y, n;
      do { x = r.int(1, 7) * r.sign(); y = r.int(1, 7) * r.sign(); n = x * x + y * y; } while (sqrtParts(n)[1] === 1);
      const R = ratioTex(x, y);
      return { text: `The point <b>${T(`(${x},\\,${y})`)}</b> is on the terminal arm of ${T('\\theta')}. Find the exact values of the three ratios, with rational denominators. Which ones are negative?`, q: '',
        a: [`r=\\sqrt{${grp(x * x)}+${grp(y * y)}}=${R.r}`, `\\sin\\theta=${chain(R.sin)}`, `\\cos\\theta=${chain(R.cos)}`, `\\tan\\theta=${chain(R.tan)}`] };
    },
    MAS: (r) => { // find θ in quadrant 2, 3 or 4
      const q = r.pick([2, 3, 4]); let ax, ay; do { ax = r.int(1, 9); ay = r.int(1, 9); } while (ax === ay);
      const x = q === 2 || q === 3 ? -ax : ax, y = q === 3 || q === 4 ? -ay : ay, tR = Number(fx(Math.atan(ay / ax) / RAD, 1));
      const th = q === 2 ? 180 - tR : q === 3 ? 180 + tR : 360 - tR, R = ratioTex(x, y);
      return { text: `The point <b>${T(`(${x},\\,${y})`)}</b> is on the terminal arm of ${T('\\theta')}, ${T('0^\\circ\\le\\theta<360^\\circ')}. Find ${T('\\cos\\theta')} exactly, then ${T('\\theta')} to the nearest tenth of a degree.`, q: '',
        a: [`r=${R.r},\\quad\\cos\\theta=${chain(R.cos)}`, `\\text{Q${q}: }\\theta_R=\\tan^{-1}\\!\\left(\\tfrac{${ay}}{${ax}}\\right)\\approx${fx(tR, 1)}^\\circ`,
          `\\theta=${q === 2 ? '180^\\circ-' : q === 3 ? '180^\\circ+' : '360^\\circ-'}${fx(tR, 1)}^\\circ=${fx(th, 1)}^\\circ`] };
    }
  }
});

/* =============================== mount =============================== */
mountCrane();
mountFigures();
export const explainers = mountExplainers({ rFind, ratios, quadrantal, sweep, slide, refSign, findAngle, robot });
export const _test = { sqrtParts, sqrtTex, fracTex, overR, yOverX, ratioTex, refOf, angOf };
void GRN; void GRAY; void sleep; void pop;
