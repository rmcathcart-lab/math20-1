/* Math 20-1 · Unit 3 · Lesson 7 — The Ambiguous Case.
 * Warm-up (Gus the Goat: a goat tied 5 m from a fence; ropes of 4, 5 and 7 m reach it 0, 1 or 2 times), and the explainers:
 *   fixers (build a triangle from SSS, SAS, ASA, AAS: always one; SSA: the free side swings and lands twice;
 *     Example 1 check: four mini triangles PQR with the given parts coloured),
 *   supp (two arms on a semicircle with the same height: sin θ = sin(180° − θ); backwards from sin B = k: two angles,
 *     one (k = 1) or none (k > 1); Example 2 check),
 *   swing (STAR: ∠A and b fixed, a slider sets a; side a swings from C and lands 0, 1 or 2 times on the arm, with h and b
 *     marked on the slider's ruler and the count live; acute and obtuse A; Example 4 checks),
 *   six (Example 3 check: the six summary sketches swing one by one and get their counts),
 *   decide (a decision chart: acute? a ≥ b? then h; Example 4 checks),
 *   solve2 (both triangles solved side by side: count, sine law, B1 and B2 = 180° − B1, keep or reject, finish each;
 *     Example 5 and 6 checks),
 *   ferry (word problems with two positions: the ferry entering and leaving the beacon's range, the roof strut swinging
 *     onto the beam; Example 7 and 8 checks).
 * Colours (kept through the lesson): the given angle A and its opposite side a rose (the course accent), side b blue,
 * the height h amber, triangle 1 / B acute green, triangle 2 / B obtuse purple, impossible landings red. */
import {
  h, tex, add, box, Graph, Flowchart, stamp, stampIn, mountExplainers, pop, fadeIn, appear, tween, svgEl, pulse, place,
  drawIn, arrowHead, angleArc, rightMark, liveCtx, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const AC = COLORS.teal, BC = COLORS.blue, HC = COLORS.amber, G1 = COLORS.green, G2 = COLORS.purple, RED = COLORS.red, INK = COLORS.ink, GRAY = COLORS.gray, SLATE = COLORS.slate;
const kc = (c) => (s) => `\\textcolor{${c}}{${s}}`;
const cA = kc(AC), cB = kc(BC), cH = kc(HC), c1 = kc(G1), c2 = kc(G2), cR = kc(RED);
const RAD = Math.PI / 180, sinD = (d) => Math.sin(d * RAD), cosD = (d) => Math.cos(d * RAD), asinD = (v) => Math.asin(v) / RAD;
/** v rounded to d decimals, trailing zeros kept ("8.0") */
const fx = (v, d = 1) => { const k = Math.pow(10, d); return (Math.round((v + Math.sign(v) * 1e-9) * k) / k).toFixed(d); };
/** v rounded to d decimals, trailing zeros dropped */
const fz = (v, d = 2) => String(parseFloat(fx(v, d)));
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const vis = (el, on) => { if (el) el.style.display = on ? '' : 'none'; return el; };
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
const panel = (stage, x, y, w, hh, title, cls = '') => div(stage, 'u3l7-panel ' + cls, title ? `<div class="u3l7-ph">${title}</div>` : '', x, y, w, hh);
const lineIn = (p, html, cls = '') => { const d = h('div', 'u3l7-line ' + cls, html); p.appendChild(d); hide(d); return d; };
const lab = (host, html, px, py, pos = 'c', cls = '', gap = 5) => { const d = h('div', 'u3l7-lab' + (cls ? ' ' + cls : ''), html); host.appendChild(d); place(d, px, py, pos, gap); return d; };
const dPath = (pts) => 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L');
const stroke = (parent, pts, color, width = 3.5, dash) => svgEl('path', { class: 'bk-stroke', d: dPath(pts), fill: 'none', stroke: color, 'stroke-width': width, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-dasharray': dash || null }, parent);
const setLn = (el, a, b) => { el.setAttribute('x1', a[0]); el.setAttribute('y1', a[1]); el.setAttribute('x2', b[0]); el.setAttribute('y2', b[1]); };
const dotG = (parent, p, color, r = 6.5) => { const g = svgEl('g', {}, parent); svgEl('circle', { cx: p[0], cy: p[1], r, fill: color, stroke: '#fff', 'stroke-width': 2 }, g); return g; };
/** label position from an outward normal (screen coords) */
const posFrom = (nx, ny) => (ny < -0.35 ? 'n' : ny > 0.35 ? 's' : '') + (nx < -0.35 ? 'w' : nx > 0.35 ? 'e' : '') || 'c';
let UID = 0;

/** which row of the summary table: 0 a<h · 1 a=h · 2 h<a<b · 3 a≥b (acute A) · 4 a≤b · 5 a>b (obtuse or right A) */
function caseRow(A, a, b) {
  const hh = b * sinD(A), e = 1e-6 * b;
  if (A < 90) return a < hh - e ? 0 : Math.abs(a - hh) <= e ? 1 : a < b - e ? 2 : 3;
  return a <= b + e ? 4 : 5;
}
const ROWN = [0, 1, 2, 1, 0, 1];

/* ====================================================================================================
 * SSAFig: angle A at the origin, its base arm along +x, C on the other arm b from A, side a swinging from C.
 * set(a) redraws the landing spots (green = B1, acute B / purple = B2, obtuse B; red ✗ = behind A), swing(c, a) sweeps
 * side a like a compass first, goTo(c, a) slides a to a new length. Drawn to scale from the data.
 * ==================================================================================================== */
class SSAFig {
  constructor(host, opts) {
    const o = this.o = Object.assign({ names: ['A', 'B', 'C'], lw: 4, padX: 24, padT: 36, padB: 40, font: 19, arcR: 34, fillOp: 0.15, small: false }, opts);
    const el = this.el = h('div', 'u3l7-fig' + (o.small ? ' u3l7-fig-sm' : '') + (o.cls ? ' ' + o.cls : '')); box(el, o.w, o.h); el.style.fontSize = o.font + 'px';
    if (o.x != null) { el.style.position = 'absolute'; add(host, el, o.x, o.y); } else host.appendChild(el);
    const svg = this.svg = svgEl('svg', { width: o.w, height: o.h, viewBox: `0 0 ${o.w} ${o.h}`, class: 'u3l7-svg' }, el);
    this.ov = add(el, h('div', 'u3l7-ov'));
    const A = this.A = o.A, b = this.b = o.b, Cx = b * cosD(A), Cy = b * sinD(A);
    this.C = [Cx, Cy]; this.hgt = Cy;
    const amax = o.amax || 1.25 * b, rr = Math.sqrt(Math.max(0, amax * amax - Cy * Cy));
    const x0 = o.xr ? o.xr[0] : Math.min(0, Cx - rr) - 0.05 * b, x1 = o.xr ? o.xr[1] : Math.max(Cx + rr, 0.4 * b) + 0.05 * b;
    const aw = o.w - 2 * o.padX, ah = o.h - o.padT - o.padB, s = this.s = Math.min(aw / (x1 - x0), ah / Cy);
    this.ox = o.padX + (aw - (x1 - x0) * s) / 2 - x0 * s; this.oy = o.h - o.padB - (ah - Cy * s) / 2;
    const P = this.P = (x, y) => [this.ox + x * s, this.oy - y * s];
    const Ap = this.Ap = P(0, 0), Cp = this.Cp = P(Cx, Cy), Fp = this.Fp = P(Cx, 0);
    const defs = svgEl('defs', {}, svg), cid = 'u3l7cl' + (++UID), cp = svgEl('clipPath', { id: cid }, defs);
    svgEl('rect', { x: 0, y: 0, width: o.w, height: o.h }, cp);
    const G = (cls, clip) => svgEl('g', clip ? { class: cls, 'clip-path': `url(#${cid})` } : { class: cls }, svg);
    this.gFill = G('u3l7-gfill', true); this.gBase = G('', false); this.gH = G('', false); this.gDyn = G('u3l7-gdyn', true);
    this.gSw = G('', true); this.gTop = G('u3l7-gtop', false);
    // the two arms of angle A (the base arm runs on past B; behind A it is only a dashed extension)
    svgEl('line', { x1: 4, y1: Ap[1], x2: Ap[0], y2: Ap[1], stroke: GRAY, 'stroke-width': 2.5, 'stroke-dasharray': '7 7' }, this.gBase);
    svgEl('line', { x1: Ap[0], y1: Ap[1], x2: o.w - (o.arrow ? 12 : 4), y2: Ap[1], stroke: INK, 'stroke-width': o.lw, 'stroke-linecap': 'round' }, this.gBase);
    if (o.arrow) { arrowHead(this.gBase, o.w - 2, Ap[1], 1, 0, { color: INK, width: 3 }); if (typeof o.arrow === 'string') lab(this.ov, o.arrow, o.w - 8, Ap[1] - 6, 'nw', 'u3l7-lab-sm'); }
    svgEl('line', { x1: Ap[0], y1: Ap[1], x2: Cp[0], y2: Cp[1], stroke: BC, 'stroke-width': o.lw, 'stroke-linecap': 'round' }, this.gBase);
    angleArc(this.gBase, Ap, [Ap[0] + 10, Ap[1]], Cp, o.arcR, { color: AC, width: 3 });
    const bis = (A / 2) * RAD, rl = o.arcR + (o.small ? 14 : 19);
    if (o.labA !== false) lab(this.ov, o.labA || T(cA(o.names[0])), Ap[0] + rl * Math.cos(bis), Ap[1] - rl * Math.sin(bis), 'c', 'u3l7-lab-ang');
    lab(this.ov, T(o.names[0]), Ap[0], Ap[1] + 2, A < 90 ? 'sw' : 's', 'u3l7-vx', 4);
    lab(this.ov, T(o.names[2]), Cp[0], Cp[1] - 2, 'n', 'u3l7-vx', 6);
    const nx = -sinD(A), ny = -cosD(A);   // outward normal of AC on screen
    if (o.labB !== false) lab(this.ov, o.labB || T(cB(o.names[1].toLowerCase())), (Ap[0] + Cp[0]) / 2 + nx * 4, (Ap[1] + Cp[1]) / 2 + ny * 4, posFrom(nx, ny), 'u3l7-lab-b', 3);
    // the height from C (shown on request)
    svgEl('line', { x1: Cp[0], y1: Cp[1], x2: Fp[0], y2: Fp[1], stroke: HC, 'stroke-width': 3, 'stroke-dasharray': '8 6' }, this.gH);
    rightMark(this.gH, Fp, Cp, [Fp[0] + (Fp[0] > Ap[0] ? -10 : 10), Fp[1]], o.small ? 10 : 14, { color: HC });
    this.hLab = lab(this.ov, o.labH || T(cH('h')), Fp[0] + (A < 90 ? 4 : -4), (Cp[1] + Fp[1]) / 2, A < 90 ? 'e' : 'w', 'u3l7-lab-h', 4);
    this.showH(o.showH !== false);
    // the moving parts
    this.circ = svgEl('circle', { cx: Cp[0], cy: Cp[1], r: 1, fill: 'none', stroke: GRAY, 'stroke-width': 2, 'stroke-dasharray': '5 6' }, this.gDyn);
    this.fills = [0, 1].map(() => svgEl('polygon', { points: '0,0', 'fill-opacity': o.fillOp, stroke: 'none' }, this.gFill));
    this.sides = [0, 1].map(() => svgEl('line', { 'stroke-width': o.lw, 'stroke-linecap': 'round' }, this.gDyn));
    this.rod = svgEl('line', { stroke: AC, 'stroke-width': o.lw, 'stroke-linecap': 'round' }, this.gDyn);
    this.gap = svgEl('line', { stroke: RED, 'stroke-width': 3, 'stroke-dasharray': '3 5' }, this.gDyn);
    this.bArcs = [null, null];
    this.dots = [0, 1].map(() => dotG(this.gTop, [0, 0], G1, o.small ? 5 : 6.5));
    const hn = o.hitNames || {}, N1 = o.names[1];
    this.lb = { far: lab(this.ov, T(hn.far || `${N1}_1`), 0, 0, 's', 'u3l7-dl u3l7-vx'), near: lab(this.ov, T(hn.near || `${N1}_2`), 0, 0, 's', 'u3l7-dl u3l7-vx'), one: lab(this.ov, T(hn.one || N1), 0, 0, 's', 'u3l7-dl u3l7-vx') };
    this.xm = [0, 1].map(() => lab(this.ov, '✗', 0, 0, 'c', 'u3l7-dl u3l7-xm'));
    this.xt = [0, 1].map(() => lab(this.ov, '', 0, 0, 's', 'u3l7-dl u3l7-xt'));
    this.al = o.labS ? [0, 1].map(() => lab(this.ov, o.labS, 0, 0, 'c', 'u3l7-dl u3l7-lab-a', 4)) : null;
    this.shortL = lab(this.ov, 'too short', 0, 0, 'e', 'u3l7-dl u3l7-short');
    this.angB = !!o.angB; this.a = null;
    this.off();
    if (o.a != null) this.set(o.a);
  }
  showH(on) { vis(this.gH, on); vis(this.hLab, on); }
  off() {
    [this.circ, this.rod, this.gap, ...this.fills, ...this.sides, ...this.dots, ...this.bArcs].forEach((e) => vis(e, false));
    this.ov.querySelectorAll('.u3l7-dl').forEach((e) => vis(e, false));
  }
  set(a) {
    const o = this.o, s = this.s, [Cx, Cy] = this.C, hg = this.hgt, b = this.b, e = 1e-6 * b, P = this.P, Cp = this.Cp, Ap = this.Ap;
    this.a = a; this.off();
    vis(this.circ, true); this.circ.setAttribute('r', Math.max(0.1, a * s));
    let xs = [];
    if (Math.abs(a - hg) <= e) xs = [Cx]; else if (a > hg) { const r = Math.sqrt(a * a - hg * hg); xs = [Cx - r, Cx + r]; }
    const hits = xs.map((x) => ({ x, ok: x > 1e-4 * b })), nOk = hits.filter((p) => p.ok).length;
    if (!xs.length) {
      const tip = P(Cx, Cy - a); setLn(this.rod, Cp, tip); vis(this.rod, true);
      setLn(this.gap, tip, this.Fp); vis(this.gap, true);
      if (!o.small) { place(this.shortL, tip[0] + (this.A < 90 ? 6 : -6), (tip[1] + this.Fp[1]) / 2, this.A < 90 ? 'e' : 'w', 4); vis(this.shortL, true); }
    }
    hits.forEach((p, k) => {
      const i = hits.length === 2 ? k : 1, Bp = P(p.x, 0), far = i === 1, sd = this.sides[i];
      setLn(sd, Cp, Bp); vis(sd, true);
      if (p.ok) {
        const colr = nOk === 2 && !far ? G2 : G1;
        sd.setAttribute('stroke', AC); sd.removeAttribute('stroke-dasharray');
        const f = this.fills[i]; f.setAttribute('points', [Ap, Cp, Bp].map((q) => q[0].toFixed(1) + ',' + q[1].toFixed(1)).join(' ')); f.setAttribute('fill', colr); vis(f, true);
        const ci = this.dots[i].firstChild; ci.setAttribute('cx', Bp[0]); ci.setAttribute('cy', Bp[1]); ci.setAttribute('fill', colr); vis(this.dots[i], true);
        const L = nOk === 2 ? (far ? this.lb.far : this.lb.near) : this.lb.one; place(L, Bp[0], Bp[1] + 3, 's', 4); L.style.color = colr; vis(L, true);
        if (this.al) { const L2 = this.al[i], m = [(Cp[0] + Bp[0]) / 2, (Cp[1] + Bp[1]) / 2], left = hits.length === 1 || (!far && nOk === 2); place(L2, m[0] + (left ? -5 : 5), m[1], left ? 'w' : 'e', 3); vis(L2, true); }
        if (this.angB) { if (this.bArcs[i]) this.bArcs[i].remove(); this.bArcs[i] = angleArc(this.gTop, Bp, Ap, Cp, o.small ? 16 : 24, { color: colr, width: 3 }); this.gTop.insertBefore(this.bArcs[i], this.gTop.firstChild); }
      } else {
        sd.setAttribute('stroke', GRAY); sd.setAttribute('stroke-dasharray', '6 6');
        place(this.xm[i], Bp[0], Bp[1], 'c'); vis(this.xm[i], true);
        if (!o.small) { const near = Math.abs(Bp[0] - Ap[0]) < 60; this.xt[i].textContent = Math.abs(p.x) < 0.02 * b ? 'at ' + o.names[0] : 'behind ' + o.names[0]; place(this.xt[i], Bp[0], Bp[1] + (near ? -12 : 10), near ? 'n' : 's', 2); vis(this.xt[i], true); }
      }
    });
    const info = { n: nOk, hits, row: caseRow(this.A, a, b) };
    if (this.onSet) this.onSet(a, info);
    return info;
  }
  /** side a sweeps round from C like a compass (tracing its circle), then lands */
  async swing(c, a, ms = 1300) {
    this.set(a);
    if (!c || c.fast) return;
    const [Cx, Cy] = this.C, P = this.P;
    this.el.classList.add('u3l7-swinging');
    const tr = svgEl('polyline', { fill: 'none', stroke: AC, 'stroke-width': 2.5, 'stroke-opacity': 0.5, points: '' }, this.gSw);
    const rod = svgEl('line', { stroke: AC, 'stroke-width': this.o.lw, 'stroke-linecap': 'round' }, this.gSw);
    const f0 = 186, f1 = 354;
    try {
      await tween(c, ms, (t) => {
        const f = f0 + (f1 - f0) * t, pts = [];
        for (let q = f0; q <= f + 0.01; q += 2) { const p = P(Cx + a * cosD(q), Cy + a * sinD(q)); pts.push(p[0].toFixed(1) + ',' + p[1].toFixed(1)); }
        tr.setAttribute('points', pts.join(' ')); setLn(rod, this.Cp, P(Cx + a * cosD(f), Cy + a * sinD(f)));
      });
    } finally { tr.remove(); rod.remove(); this.el.classList.remove('u3l7-swinging'); }
    await Promise.all(this.dots.filter((d) => d.style.display !== 'none').map((d) => pop(c, d, 320)));
  }
  goTo(c, a1, ms = 900) { const a0 = this.a == null ? a1 : this.a; return tween(c, ms, (t) => { this.set(a0 + (a1 - a0) * t); }); }
}

/* ====================================================================================================
 * Warm-up: Gus the Goat. Post 5 m from the fence; the rope's circle meets the fence 0, 1 or 2 times.
 * ==================================================================================================== */
function goat(parent, x, y, flip = 1) {
  const g = svgEl('g', { transform: `translate(${x} ${y}) scale(${flip} 1)` }, parent);
  svgEl('ellipse', { cx: -14, cy: -14, rx: 20, ry: 12, fill: '#fbfaf6', stroke: '#6b6458', 'stroke-width': 2 }, g);
  [[-28, -4], [-20, -4], [-8, -4], [-1, -4]].forEach(([lx, ly]) => svgEl('line', { x1: lx, y1: ly, x2: lx, y2: ly + 13, stroke: '#6b6458', 'stroke-width': 3, 'stroke-linecap': 'round' }, g));
  svgEl('path', { d: 'M-2 -20 L8 -30 L14 -22 L10 -14 L2 -12 Z', fill: '#fbfaf6', stroke: '#6b6458', 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);
  svgEl('path', { d: 'M5 -29 Q2 -40 -6 -38 M9 -29 Q10 -40 4 -41', fill: 'none', stroke: '#8a6d3b', 'stroke-width': 2.6, 'stroke-linecap': 'round' }, g);
  svgEl('circle', { cx: 8, cy: -24, r: 1.8, fill: '#1c2230' }, g);
  svgEl('path', { d: 'M11 -14 L10 -7 L13 -10', fill: 'none', stroke: '#6b6458', 'stroke-width': 1.8 }, g);
  svgEl('path', { d: 'M-33 -20 Q-38 -24 -36 -16', fill: 'none', stroke: '#6b6458', 'stroke-width': 2.4, 'stroke-linecap': 'round' }, g);
  return g;
}
function mountField() {
  const host = document.getElementById('u3l7-field'); if (!host) return;
  const W = 560, H = 350, S = 34, X0 = 280, FY = 300, PY = FY - 5 * S;
  const svg = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u3l7-fieldsvg' }, host);
  const defs = svgEl('defs', {}, svg), cp = svgEl('clipPath', { id: 'u3l7-fclip' }, defs); svgEl('rect', { x: 0, y: 0, width: W, height: H, rx: 14 }, cp);
  const root = svgEl('g', { 'clip-path': 'url(#u3l7-fclip)' }, svg);
  svgEl('rect', { x: 0, y: 0, width: W, height: H, fill: '#cfe8b4' }, root);
  for (let i = 0; i < 46; i++) { const x = (i * 97) % W, y = (i * 61) % (FY - 20) + 8; svgEl('path', { d: `M${x} ${y} l3 -7 M${x + 5} ${y} l-2 -8`, stroke: '#9cc77f', 'stroke-width': 2, 'stroke-linecap': 'round' }, root); }
  svgEl('rect', { x: 0, y: FY + 8, width: W, height: H - FY, fill: '#e6d9b8' }, root);
  for (let x = 10; x < W; x += 22) { const yy = FY - 10 - ((x * 7) % 5); svgEl('line', { x1: x, y1: yy + 8, x2: x, y2: yy, stroke: '#5c9a43', 'stroke-width': 2 }, root); svgEl('circle', { cx: x, cy: yy, r: 4.2, fill: '#f6cf2c', stroke: '#d6a400', 'stroke-width': 1 }, root); }
  svgEl('rect', { x: 0, y: FY - 2, width: W, height: 6, fill: '#a5783f' }, root);
  svgEl('rect', { x: 0, y: FY + 9, width: W, height: 5, fill: '#a5783f' }, root);
  for (let x = 14; x < W; x += 48) svgEl('rect', { x: x - 4, y: FY - 10, width: 9, height: 30, rx: 2, fill: '#8a5f2d' }, root);
  const dyn = svgEl('g', {}, root);
  svgEl('circle', { cx: X0, cy: PY, r: 9, fill: '#7a5230', stroke: '#4a3018', 'stroke-width': 2 }, root);
  const info = h('div', 'u3l7-finfo', ''); host.appendChild(info);
  const draw = (L) => {
    dyn.innerHTML = '';
    if (!L) { goat(dyn, X0 + 46, PY + 40); svgEl('path', { d: `M${X0} ${PY} Q${X0 + 30} ${PY + 40} ${X0 + 42} ${PY + 28}`, fill: 'none', stroke: '#8b6b3e', 'stroke-width': 3 }, dyn); info.innerHTML = 'Pick a rope length.'; return; }
    svgEl('circle', { cx: X0, cy: PY, r: L * S, fill: 'rgba(255,255,255,.18)', stroke: '#5f6b7a', 'stroke-width': 2.5, 'stroke-dasharray': '7 7' }, dyn);
    svgEl('line', { x1: X0, y1: PY, x2: X0, y2: FY, stroke: HC, 'stroke-width': 3, 'stroke-dasharray': '6 5' }, dyn);
    const t5 = h('div', 'u3l7-flab', '5 m'); host.appendChild(t5); t5.classList.add('u3l7-fdyn');
    host.querySelectorAll('.u3l7-fdyn').forEach((e) => { if (e !== t5) e.remove(); }); place(t5, X0 - 8, (PY + FY) / 2 - 22, 'w', 2);
    if (L < 5) {
      const ty = PY + L * S;
      svgEl('line', { x1: X0, y1: PY, x2: X0, y2: ty, stroke: '#8b6b3e', 'stroke-width': 3.5 }, dyn);
      svgEl('line', { x1: X0 + 10, y1: ty, x2: X0 + 10, y2: FY, stroke: RED, 'stroke-width': 3, 'stroke-dasharray': '3 4' }, dyn);
      goat(dyn, X0 + 20, ty + 14);
      info.innerHTML = `<b>Rope ${L} m:</b> ${5 - L} m short. Gus can’t reach the fence.`;
    } else if (L === 5) {
      svgEl('line', { x1: X0, y1: PY, x2: X0, y2: FY - 6, stroke: '#8b6b3e', 'stroke-width': 3.5 }, dyn);
      svgEl('circle', { cx: X0, cy: FY - 8, r: 9, fill: 'none', stroke: G1, 'stroke-width': 3.5 }, dyn);
      goat(dyn, X0 + 26, FY - 14);
      info.innerHTML = '<b>Rope 5 m:</b> it just touches, at <b>1</b> spot (straight across).';
    } else {
      const dx = Math.sqrt(L * L - 25) * S, xs = [X0 - dx, X0 + dx];
      if (xs[0] > 0) svgEl('line', { x1: xs[0], y1: FY - 9, x2: xs[1], y2: FY - 9, stroke: G1, 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-opacity': 0.55 }, dyn);
      xs.forEach((x, i) => {
        svgEl('line', { x1: X0, y1: PY, x2: x, y2: FY - 6, stroke: '#8b6b3e', 'stroke-width': i ? 3.5 : 2.5, 'stroke-dasharray': i ? null : '6 5' }, dyn);
        svgEl('circle', { cx: x, cy: FY - 8, r: 9, fill: 'none', stroke: G1, 'stroke-width': 3.5 }, dyn);
      });
      goat(dyn, xs[1] - 6, FY - 14, -1);
      info.innerHTML = `<b>Rope ${L} m:</b> touches at <b>2</b> spots, ${fx(Math.sqrt(L * L - 25), 1)} m each side of the closest point.`;
    }
  };
  host.parentElement.querySelectorAll('[data-rope]').forEach((b) => b.addEventListener('click', () => {
    host.parentElement.querySelectorAll('[data-rope]').forEach((x) => x.classList.toggle('on', x === b)); draw(+b.dataset.rope);
  }));
  draw(0);
}

/* ====================================================================================================
 * explainer: which measurements fix a triangle?
 * ==================================================================================================== */
const FXK = { sss: 'SSS', sas: 'SAS', asa: 'ASA', aas: 'AAS', ssa: 'SSA' };
function plane(stage, x, y, w, hh) {
  const el = div(stage, 'u3l7-fig', '', x, y, w, hh);
  const svg = svgEl('svg', { width: w, height: hh, viewBox: `0 0 ${w} ${hh}`, class: 'u3l7-svg' }, el);
  const ov = add(el, h('div', 'u3l7-ov'));
  return { el, svg, ov };
}
/** a triangle PQR (unit coords) fitted into a box, given parts coloured; returns the pieces */
function miniTri(host, x, y, w, hh, V, giv, ghost) {
  const pts = Object.values(V).concat(ghost ? [ghost.p] : []), xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const xmn = Math.min(...xs), xmx = Math.max(...xs), ymn = Math.min(...ys), ymx = Math.max(...ys);
  const s = Math.min((w - 70) / (xmx - xmn), (hh - 64) / (ymx - ymn)), ox = x + (w - (xmx - xmn) * s) / 2 - xmn * s, oy = y + hh - 36 - ((hh - 64) - (ymx - ymn) * s) / 2 + ymn * s;
  const P = (p) => [ox + p[0] * s, oy - p[1] * s], K = Object.keys(V), Vp = {}; K.forEach((k) => (Vp[k] = P(V[k])));
  const cen = [(Vp[K[0]][0] + Vp[K[1]][0] + Vp[K[2]][0]) / 3, (Vp[K[0]][1] + Vp[K[1]][1] + Vp[K[2]][1]) / 3];
  const g = svgEl('g', {}, host.svg);
  svgEl('polygon', { points: K.map((k) => Vp[k].join(',')).join(' '), fill: '#f6eef1', stroke: 'none' }, g);
  if (ghost) {
    const gp = P(ghost.p);
    stroke(g, [Vp[ghost.from], gp], GRAY, 2.5, '6 6'); stroke(g, [Vp[ghost.base], gp], GRAY, 2.5, '6 6');
    lab(host.ov, T(ghost.name), gp[0], gp[1] + 2, 's', 'u3l7-vx u3l7-ghost', 3);
  }
  [[K[0], K[1]], [K[1], K[2]], [K[2], K[0]]].forEach(([u, v]) => {
    const key = u + v, key2 = v + u, gv = giv.sides[key] || giv.sides[key2];
    stroke(g, [Vp[u], Vp[v]], gv ? gv.c : SLATE, gv ? 4.5 : 2.2);
    if (gv) {
      const m = [(Vp[u][0] + Vp[v][0]) / 2, (Vp[u][1] + Vp[v][1]) / 2], d = [m[0] - cen[0], m[1] - cen[1]], L = Math.hypot(...d);
      lab(host.ov, gv.t, m[0] + (d[0] / L) * 4, m[1] + (d[1] / L) * 4, posFrom(d[0] / L, d[1] / L), 'u3l7-lab-sm', 3);
    }
  });
  K.forEach((k) => {
    const p = Vp[k], d = [p[0] - cen[0], p[1] - cen[1]], L = Math.hypot(...d);
    lab(host.ov, T(k), p[0] + (d[0] / L) * 4, p[1] + (d[1] / L) * 4, posFrom(d[0] / L, d[1] / L), 'u3l7-vx', 3);
    if (giv.angles[k]) {
      const o2 = K.filter((q) => q !== k);
      angleArc(g, p, Vp[o2[0]], Vp[o2[1]], 22, { color: AC, width: 3 });
      lab(host.ov, giv.angles[k], p[0] - (d[0] / L) * 44, p[1] - (d[1] / L) * 44, 'c', 'u3l7-lab-sm');
    }
  });
  return g;
}
const fixers = {
  title: 'Which measurements fix a triangle?',
  height: 380, minW: 940,
  choices: [...Object.keys(FXK).map((k) => ({ v: k, label: FXK[k] })), { sep: 'Check:' }, { v: 'ex1', label: 'Example 1 check' }],
  ask: (v) => (v === 'ex1' ? 'Example 1: name the type of information and say whether it fixes exactly one triangle.' : `Build a triangle from ${FXK[v]} information. Does everyone get the same one?`),
  make(stage, v, ex) {
    const W = ex.W;
    if (v === 'ex1') return fixersEx1(stage, ex);
    const info = panel(stage, 10, 14, 250, 170, 'Given');
    const verdict = hide(div(stage, 'u3l7-verdict', '', 10, 200, 250, 110));
    if (v === 'ssa') {
      const F = new SSAFig(stage, { x: 270, y: 0, w: W - 280, h: 370, A: 35, b: 8, amax: 5.9, labA: T(cA('35^\\circ')), labB: T(cB('b=8')), labS: T(cA('5.5')), showH: false, angB: true });
      info.insertAdjacentHTML('beforeend', `<div class="u3l7-line">${T(cA('\\angle A=35^\\circ'))}</div><div class="u3l7-line">${T(cB('b=AC=8'))}</div><div class="u3l7-line">${T(cA('a=BC=5.5'))}</div>`);
      verdict.innerHTML = '<b>Two</b> different triangles fit the same three measurements. SSA is <b>ambiguous</b>.';
      const st = stamp(stage, '2 triangles!', { ok: false, x: W - 110, y: 60 }); hide(st);
      return [
        { cap: `${T('\\angle A=35^\\circ')}, ${T('b=AC=8')} and ${T('a=BC=5.5')}. The angle is <b>not</b> between the two sides. ${T('C')} is fixed …`, run: (c) => pulse(c, F.el, 1.02) },
        { cap: `… but side ${T(cA('a'))} is attached only at ${T('C')}. It <b>swings like a compass</b> …`, run: (c) => F.swing(c, 5.5) },
        { cap: `… and lands in <b>two</b> places, ${T(c1('B_1'))} and ${T(c2('B_2'))}: two different triangles with the same three measurements.`, run: async (c) => { await show(c, verdict); await stampIn(c, st); } }
      ];
    }
    const pl = plane(stage, 270, 0, W - 280, 372), S = 42, P = (x, y) => [70 + x * S, 330 - y * S];
    const g = svgEl('g', {}, pl.svg), V = {};
    const st = stamp(stage, '1 triangle', { ok: true, x: W - 110, y: 60 }); hide(st);
    const base = stroke(g, [P(0, 0), P(8, 0)], BC, 4.5); hide(base);
    const lA = hide(lab(pl.ov, T('A'), ...P(0, 0), 'sw', 'u3l7-vx')), lB = hide(lab(pl.ov, T('B'), ...P(8, 0), 'se', 'u3l7-vx')), lc = hide(lab(pl.ov, T(cB('c=8')), ...P(4, 0), 's', 'u3l7-lab-b', 8));
    const baseIn = async (c) => { base.style.opacity = 1; await drawIn(base, 600, c); await Promise.all([show(c, lA), show(c, lB), show(c, lc)]); };
    const triFill = (Cu) => { const f = svgEl('polygon', { points: [P(0, 0), P(8, 0), P(...Cu)].map((q) => q.join(',')).join(' '), fill: G1, 'fill-opacity': 0.15 }, g); g.insertBefore(f, g.firstChild); return hide(f); };
    const lines = (arr) => arr.forEach((t) => info.insertAdjacentHTML('beforeend', `<div class="u3l7-line">${t}</div>`));
    const finish = async (c) => { await show(c, verdict); await stampIn(c, st); };
    if (v === 'sss') {
      const a = 5, b = 6, xC = (b * b - a * a + 64) / 16, yC = Math.sqrt(b * b - xC * xC), Cu = [xC, yC];
      lines([T(cB('a=5')), T(cB('b=6')), T(cB('c=8'))]);
      verdict.innerHTML = 'The two circles cross at one point above <span class="tex-i">AB</span>: <b>exactly one</b> triangle.';
      const arc = (cx, r, a0, a1, colr) => { const pts = []; for (let t = a0; t <= a1 + 0.01; t += 3) pts.push(P(cx + r * cosD(t), r * sinD(t))); return hide(stroke(g, pts, colr, 2.5, '6 6')); };
      const arcA = arc(0, b, 0, 150, BC), arcB = arc(8, a, 30, 180, AC);
      const sAC = hide(stroke(g, [P(0, 0), P(...Cu)], BC, 4.5)), sBC = hide(stroke(g, [P(8, 0), P(...Cu)], BC, 4.5)), fill = triFill(Cu);
      const Cd = dotG(g, P(...Cu), G1); hide(Cd); const lC = hide(lab(pl.ov, T('C'), ...P(...Cu), 'n', 'u3l7-vx', 10));
      const lb = hide(lab(pl.ov, T(cB('6')), ...P(xC / 2, yC / 2), 'nw', 'u3l7-lab-b', 4)), la = hide(lab(pl.ov, T(cB('5')), ...P((8 + xC) / 2, yC / 2), 'ne', 'u3l7-lab-b', 4));
      return [
        { cap: `Three sides: ${T('a=5')}, ${T('b=6')}, ${T('c=8')}. Lay down ${T('c=8')} as ${T('AB')}.`, run: baseIn },
        { cap: `Side ${T('b=6')} starts at ${T('A')}, so its end ${T('C')} is somewhere on this circle …`, run: async (c) => { arcA.style.opacity = 1; await drawIn(arcA, 700, c); } },
        { cap: `… and side ${T('a=5')} starts at ${T('B')}, so ${T('C')} is also on this circle.`, run: async (c) => { arcB.style.opacity = 1; await drawIn(arcB, 700, c); } },
        { cap: `The circles cross at <b>one</b> point above ${T('AB')}: that is ${T('C')}. (Below ${T('AB')} is the same triangle flipped over.)`, run: async (c) => { await pop(c, Cd); await show(c, lC); sAC.style.opacity = sBC.style.opacity = 1; await Promise.all([drawIn(sAC, 400, c), drawIn(sBC, 400, c)]); await Promise.all([show(c, fill), show(c, lb), show(c, la)]); } },
        { cap: `Everyone who builds it gets this same triangle: SSS fixes <b>exactly one</b> triangle.`, run: finish }
      ];
    }
    if (v === 'sas') {
      const Cu = [6 * cosD(50), 6 * sinD(50)], a = Math.sqrt(36 + 64 - 96 * cosD(50));
      lines([T(cB('b=6')), T(cA('\\angle A=50^\\circ')) + ' <span class="muted">(between)</span>', T(cB('c=8'))]);
      verdict.innerHTML = 'The angle is <b>between</b> the sides, so the gap can close only one way: <b>exactly one</b> triangle.';
      const arm = hide(stroke(g, [P(0, 0), P(...Cu)], BC, 4.5)), arcA = hide(angleArc(g, P(0, 0), P(1, 0), P(...Cu), 40, { color: AC, width: 3 }));
      const la = hide(lab(pl.ov, T(cA('50^\\circ')), ...P(1.45 * cosD(25), 1.45 * sinD(25)), 'c', 'u3l7-lab-sm')), lb = hide(lab(pl.ov, T(cB('6')), ...P(Cu[0] / 2, Cu[1] / 2), 'nw', 'u3l7-lab-b', 4));
      const Cd = dotG(g, P(...Cu), G1); hide(Cd); const lC = hide(lab(pl.ov, T('C'), ...P(...Cu), 'n', 'u3l7-vx', 10));
      const gapL = hide(stroke(g, [P(...Cu), P(8, 0)], G1, 4.5)), fill = triFill(Cu), lA2 = hide(lab(pl.ov, T(c1(`a\\approx${fx(a, 1)}`)), ...P((8 + Cu[0]) / 2, Cu[1] / 2), 'ne', 'u3l7-lab-b', 4));
      return [
        { cap: `Two sides and the angle <b>between</b> them: ${T('b=6')}, ${T('\\angle A=50^\\circ')}, ${T('c=8')}. Lay down ${T('c=8')}.`, run: baseIn },
        { cap: `Turn ${T('50^\\circ')} at ${T('A')} and measure ${T('b=6')} along that arm: ${T('C')} is fixed.`, run: async (c) => { arcA.style.opacity = arm.style.opacity = 1; await drawIn(arcA, 300, c); await show(c, la); await drawIn(arm, 500, c); await show(c, lb); await pop(c, Cd); await show(c, lC); } },
        { cap: `Only one way to close the gap: the third side ${T(`a\\approx${fx(a, 1)}`)} is fixed too.`, run: async (c) => { gapL.style.opacity = 1; await drawIn(gapL, 500, c); await Promise.all([show(c, fill), show(c, lA2)]); } },
        { cap: `SAS fixes <b>exactly one</b> triangle.`, run: finish }
      ];
    }
    if (v === 'asa' || v === 'aas') {
      const A = 50, B = 60, Cang = 70;
      if (v === 'asa') {
        const bl = 8 * sinD(B) / sinD(Cang), Cu = [bl * cosD(A), bl * sinD(A)];
        lines([T(cA('\\angle A=50^\\circ')), T(cB('c=8')) + ' <span class="muted">(between)</span>', T(cA('\\angle B=60^\\circ'))]);
        verdict.innerHTML = 'Two rays from the ends of the side cross only once: <b>exactly one</b> triangle.';
        const rA = hide(stroke(g, [P(0, 0), P(9.4 * cosD(A), 9.4 * sinD(A))], BC, 3)), rB = hide(stroke(g, [P(8, 0), P(8 - 7.6 * cosD(B), 7.6 * sinD(B))], BC, 3));
        const aA = hide(angleArc(g, P(0, 0), P(1, 0), P(...Cu), 40, { color: AC, width: 3 })), aB = hide(angleArc(g, P(8, 0), P(7, 0), P(...Cu), 40, { color: AC, width: 3 }));
        const la = hide(lab(pl.ov, T(cA('50^\\circ')), ...P(1.45 * cosD(25), 1.45 * sinD(25)), 'c', 'u3l7-lab-sm')), lbb = hide(lab(pl.ov, T(cA('60^\\circ')), ...P(8 - 1.45 * cosD(30), 1.45 * sinD(30)), 'c', 'u3l7-lab-sm'));
        const Cd = dotG(g, P(...Cu), G1); hide(Cd); const lC = hide(lab(pl.ov, T('C'), ...P(...Cu), 'w', 'u3l7-vx', 12)), fill = triFill(Cu);
        return [
          { cap: `Two angles and the side <b>between</b> them: ${T('\\angle A=50^\\circ')}, ${T('c=8')}, ${T('\\angle B=60^\\circ')}. Lay down ${T('c=8')}.`, run: baseIn },
          { cap: `A ray at ${T('50^\\circ')} from ${T('A')} …`, run: async (c) => { aA.style.opacity = rA.style.opacity = 1; await drawIn(aA, 300, c); await show(c, la); await drawIn(rA, 600, c); } },
          { cap: `… and a ray at ${T('60^\\circ')} from ${T('B')}.`, run: async (c) => { aB.style.opacity = rB.style.opacity = 1; await drawIn(aB, 300, c); await show(c, lbb); await drawIn(rB, 600, c); } },
          { cap: `Two rays cross <b>once</b>: ${T('C')} is fixed. ASA fixes <b>exactly one</b> triangle.`, run: async (c) => { await pop(c, Cd); await Promise.all([show(c, lC), show(c, fill)]); await finish(c); } }
        ];
      }
      // AAS: the angles fix the shape, the side fixes the size
      const a = 7, cFull = a * sinD(Cang) / sinD(A), bFull = a * sinD(B) / sinD(A);
      lines([T(cA('\\angle A=50^\\circ')), T(cA('\\angle B=60^\\circ')), T(cB('a=BC=7')) + ' <span class="muted">(not between)</span>']);
      verdict.innerHTML = 'The angles fix the <b>shape</b>, the side fixes the <b>size</b>: <b>exactly one</b> triangle. (AAS is ASA in disguise.)';
      base.remove(); lc.remove(); lB.remove();
      const tri = svgEl('polygon', { fill: G1, 'fill-opacity': 0.15, stroke: SLATE, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
      const bc = svgEl('line', { stroke: BC, 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
      const lB2 = lab(pl.ov, T('B'), 0, 0, 'se', 'u3l7-vx'), lC2 = lab(pl.ov, T('C'), 0, 0, 'nw', 'u3l7-vx', 6), lbc = lab(pl.ov, '', 0, 0, 'ne', 'u3l7-lab-b u3l7-live', 6);
      const lCang = hide(lab(pl.ov, T(`\\angle C=70^\\circ`), 0, 0, 'ne', 'u3l7-lab-sm', 10));
      const ruler = hide(lab(pl.ov, `<span class="u3l7-rtag">target ${T('BC=7')}</span>`, 470, 14, 's', '', 0));
      const draw = (k) => {
        const Bu = [cFull * k, 0], Cu = [bFull * k * cosD(A), bFull * k * sinD(A)];
        tri.setAttribute('points', [P(0, 0), P(...Bu), P(...Cu)].map((q) => q.join(',')).join(' ')); setLn(bc, P(...Bu), P(...Cu));
        place(lB2, ...P(...Bu), 'se', 4); place(lC2, ...P(...Cu), 'nw', 6); place(lCang, ...P(...Cu), 'ne', 10);
        const m = P((Bu[0] + Cu[0]) / 2, (Bu[1] + Cu[1]) / 2); place(lbc, m[0] + 4, m[1] - 4, 'ne', 4); lbc.innerHTML = `<i>BC</i> = ${fx(a * k, 1)}`;
      };
      const k0 = 0.36; draw(k0); lA.style.opacity = 1;
      return [
        { cap: `Two angles and a side <b>not</b> between them: ${T('\\angle A=50^\\circ')}, ${T('\\angle B=60^\\circ')}, ${T('a=7')}. The third angle is fixed too: ${T('\\angle C=180^\\circ-50^\\circ-60^\\circ=70^\\circ')}.`, run: (c) => show(c, lCang) },
        { cap: `The angles fix the <b>shape</b>. Grow the shape until ${T('BC=7')} …`, run: async (c) => { await show(c, ruler); await tween(c, 1500, (t) => draw(k0 + (1 - k0) * t)); } },
        { cap: `… it happens at exactly one size. AAS is ASA in disguise: <b>exactly one</b> triangle.`, run: finish }
      ];
    }
    return [];
  }
};
function fixersEx1(stage, ex) {
  const W = ex.W, cw = (W - 24) / 2, ch = 180, PP = [
    { t: '(a)', V: { P: [0, 0], Q: [12, 0], R: [7.333, 5.217] }, giv: { sides: { QR: { t: T(cB('p=7')), c: BC }, PR: { t: T(cB('q=9')), c: BC }, PQ: { t: T(cB('r=12')), c: BC } }, angles: {} }, v: '<b>SSS</b>: exactly one triangle.', ok: true },
    { t: '(b)', V: { P: [0, 0], Q: [11, 0], R: [8 * cosD(50), 8 * sinD(50)] }, giv: { sides: { PR: { t: T(cB('q=8')), c: BC }, PQ: { t: T(cB('r=11')), c: BC } }, angles: { P: T(cA('50^\\circ')) } }, v: '<span class="tex-i">∠P</span> is between <span class="tex-i">q</span> and <span class="tex-i">r</span>. <b>SAS</b>: exactly one.', ok: true },
    { t: '(c)', V: { P: [0, 0], Q: [10, 0], R: [(10 * sinD(72) / sinD(58)) * cosD(50), (10 * sinD(72) / sinD(58)) * sinD(50)] }, giv: { sides: { PQ: { t: T(cB('r=10')), c: BC } }, angles: { P: T(cA('50^\\circ')), Q: T(cA('72^\\circ')) } }, v: '<span class="tex-i">r</span> is between the angles. <b>ASA</b>: exactly one.', ok: true },
    { t: '(d)', V: { P: [0, 0], Q: [8 * cosD(50) + Math.sqrt(49 - Math.pow(8 * sinD(50), 2)), 0], R: [8 * cosD(50), 8 * sinD(50)] }, giv: { sides: { QR: { t: T(cA('p=7')), c: AC }, PR: { t: T(cB('q=8')), c: BC } }, angles: { P: T(cA('50^\\circ')) } }, ghost: { p: [8 * cosD(50) - Math.sqrt(49 - Math.pow(8 * sinD(50), 2)), 0], from: 'R', base: 'P', name: "Q'" }, v: '<span class="tex-i">∠P</span> is opposite <span class="tex-i">p</span>. <b>SSA</b>: not guaranteed (ambiguous case).', ok: false }
  ];
  const cards = PP.map((d, i) => {
    const x = 8 + (i % 2) * (cw + 8), y = 4 + Math.floor(i / 2) * (ch + 8), card = hide(div(stage, 'u3l7-mini', `<div class="u3l7-mh">${d.t}</div>`, x, y, cw, ch));
    const pl = { svg: svgEl('svg', { width: 300, height: ch, viewBox: `0 0 300 ${ch}`, class: 'u3l7-svg' }, card), ov: div(card, 'u3l7-ov', '', 0, 0, 300, ch) };
    miniTri(pl, 0, 6, 300, ch - 6, d.V, d.giv, d.ghost);
    div(card, 'u3l7-mv ' + (d.ok ? 'u3l7-mv-ok' : 'u3l7-mv-no'), d.v, 304, 34, cw - 316);
    return card;
  });
  const hh = 8 * sinD(50);
  return [
    { cap: `(a) Three sides are given: ${T('p')}, ${T('q')} and ${T('r')}. <b>SSS</b>: exactly one triangle.`, run: (c) => show(c, cards[0]) },
    { cap: `(b) ${T('q=PR')} and ${T('r=PQ')} meet at ${T('P')}, so ${T('\\angle P')} is <b>between</b> them. <b>SAS</b>: exactly one.`, run: (c) => show(c, cards[1]) },
    { cap: `(c) ${T('r=PQ')} joins ${T('P')} and ${T('Q')}: the side is <b>between</b> the angles. <b>ASA</b>: exactly one.`, run: (c) => show(c, cards[2]) },
    { cap: `(d) ${T('\\angle P')} is opposite ${T('p')}, not between ${T('p')} and ${T('q')}. <b>SSA</b>: not guaranteed. (Here ${T('p')} can land at ${T('Q')} or ${T("Q'")}: ${T(`h=8\\sin50^\\circ\\approx${fx(hh, 2)}<7<8`)}.)`, run: (c) => show(c, cards[3]) }
  ];
}

/* ====================================================================================================
 * explainer: sin θ = sin(180° − θ) on a semicircle (r = 1)
 * ==================================================================================================== */
const SP = {
  t30: { label: 'θ = 30°', th: 30 }, t50: { label: 'θ = 50°', th: 50 }, t80: { label: 'θ = 80°', th: 80 },
  ex2: { label: 'Example 2 check', k: 10 * sinD(40) / 7, ex2: true }, k1: { label: 'sin B = 1', k: 1 }, k11: { label: 'sin B = 1.1', k: 1.1 }
};
const supp = {
  title: 'Two angles, the same sine',
  height: 352, minW: 940,
  choices: [{ v: 't30', label: SP.t30.label }, { v: 't50', label: SP.t50.label }, { v: 't80', label: SP.t80.label }, { sep: 'Backwards:' }, { v: 'k1', label: 'sin B = 1' }, { v: 'k11', label: 'sin B = 1.1' }, { sep: 'Check:' }, { v: 'ex2', label: 'Example 2 check' }],
  ask: (v) => (SP[v].th ? `Compare ${T(`\\sin${SP[v].th}^\\circ`)} with ${T(`\\sin${180 - SP[v].th}^\\circ`)}.` : SP[v].ex2 ? `Example 2: ${T('\\sin B=\\dfrac{10\\sin40^\\circ}{7}\\approx0.9183')}. Which angles ${T('B')} between ${T('0^\\circ')} and ${T('180^\\circ')} work?` : `Which angles ${T('B')} between ${T('0^\\circ')} and ${T('180^\\circ')} have ${T(`\\sin B=${SP[v].k}`)}?`),
  make(stage, v, ex) {
    const W = ex.W, d = SP[v];
    const G = new Graph(stage, { x: 8, y: 18, width: 560, height: 330, xmin: -1.28, xmax: 1.28, ymin: -0.24, ymax: 1.3, xstep: 0.25, ystep: 0.25, xlabels: 0.5, ylabels: 0.5, fontSize: 15 });
    const pts = []; for (let t = 0; t <= 180; t += 3) pts.push(G.toPx(cosD(t), sinD(t)));
    stroke(G.layers.data, pts, SLATE, 2.5);
    const O = G.toPx(0, 0), pnl = panel(stage, 584, 8, W - 592, 336, '');
    const arms = (th) => {
      const P1 = [cosD(th), sinD(th)], P2 = [-cosD(th), sinD(th)];
      const a1 = hide(G.segment([0, 0], P1, { color: G1, width: 4 })), a2 = hide(G.segment([0, 0], P2, { color: G2, width: 4 }));
      const d1 = hide(G.point(...P1, { color: G1, r: 7 })), d2 = hide(G.point(...P2, { color: G2, r: 7 }));
      const h1 = hide(G.segment(P1, [P1[0], 0], { color: INK, dash: true, width: 2.5 })), h2 = hide(G.segment(P2, [P2[0], 0], { color: INK, dash: true, width: 2.5 }));
      const arc1 = hide(angleArc(G.layers.top, O, [O[0] + 10, O[1]], G.toPx(...P1), 44, { color: G1, width: 3 }));
      const arc2 = hide(angleArc(G.layers.top, O, [O[0] + 10, O[1]], G.toPx(...P2), 66, { color: G2, width: 3 }));
      const arcR = hide(angleArc(G.layers.top, O, [O[0] - 10, O[1]], G.toPx(...P2), 34, { color: HC, width: 3.5 }));
      const l1 = hide(G.label(0.32 * cosD(th / 2), 0.32 * sinD(th / 2) + 0.03, T(c1(`${fz(th, 1)}^\\circ`)), { pos: 'c', cls: 'bk-ptlab' }));
      const m2 = (180 - th) / 2, l2b = hide(G.label(0.47 * cosD(m2), 0.47 * sinD(m2) + 0.03, T(c2(`${fz(180 - th, 1)}^\\circ`)), { pos: 'c', cls: 'bk-ptlab' }));
      const lR = hide(G.label(-0.66, 0.1, T(cH(`\\theta_R=${fz(th, 1)}^\\circ`)), { pos: 'c', cls: 'bk-ptlab' }));
      const lP1 = hide(G.label(...P1, T('P(x,\\ y)'), { pos: P1[0] > 0.9 ? 'n' : 'ne', cls: 'bk-ptlab' })), lP2 = hide(G.label(...P2, T("P'(-x,\\ y)"), { pos: P2[0] < -0.9 ? 'n' : 'nw', cls: 'bk-ptlab' }));
      const same = hide(G.segment(P2, P1, { color: HC, dash: true, width: 2.5 }));
      const in1 = async (c) => { a1.style.opacity = arc1.style.opacity = 1; await drawIn(arc1, 300, c); await drawIn(a1, 500, c); await Promise.all([show(c, d1), show(c, l1), show(c, lP1)]); };
      const in2 = async (c) => { a2.style.opacity = arc2.style.opacity = 1; await drawIn(arc2, 400, c); await drawIn(a2, 500, c); await Promise.all([show(c, d2), show(c, l2b), show(c, lP2)]); };
      const hIn = async (c, both) => { for (const e of both ? [h1, h2] : [h1]) { e.style.opacity = 1; await drawIn(e, 350, c); } };
      return { in1, in2, hIn, same, arcR, lR, d1, d2, h1, h2 };
    };
    if (d.th) {
      const th = d.th, y = sinD(th), Z = arms(th);
      const L = [lineIn(pnl, `${T(`\\sin${th}^\\circ=\\dfrac{y}{r}=\\dfrac{y}{1}\\approx${fx(y, 4)}`)}`), lineIn(pnl, `${T(`180^\\circ-${th}^\\circ=${180 - th}^\\circ`)}`), lineIn(pnl, `${T(`\\sin${180 - th}^\\circ\\approx${fx(y, 4)}`)}`, 'u3l7-line-key'),
        lineIn(pnl, `Quadrant II, ${T(cH(`\\theta_R=${th}^\\circ`))}: sine is <b>positive</b> (the S in CAST).`), lineIn(pnl, `${T(`\\sin^{-1}(${fx(y, 4)})=${th}^\\circ`)} only.<br>The other answer: ${T(`180^\\circ-${th}^\\circ=${180 - th}^\\circ`)}.`, 'u3l7-line-ans')];
      return [
        { cap: `${T(c1(`\\theta=${th}^\\circ`))} in standard position, with ${T('r=1')}. Its sine is the <b>height</b> ${T('y')} of ${T('P')}.`, run: async (c) => { await Z.in1(c); await Z.hIn(c); await show(c, L[0]); } },
        { cap: `Reflect ${T('P')} in the ${T('y')}-axis: the terminal arm at ${T(c2(`180^\\circ-${th}^\\circ=${180 - th}^\\circ`))}.`, run: async (c) => { await Z.in2(c); await show(c, L[1]); } },
        { cap: `<b>Same height</b>, so the same sine: ${T(`\\sin${180 - th}^\\circ=\\sin${th}^\\circ\\approx${fx(y, 4)}`)}.`, run: async (c) => { await Z.hIn(c, true); Z.same.style.opacity = 1; await drawIn(Z.same, 500, c); await show(c, L[2]); } },
        { cap: `${T(`${180 - th}^\\circ`)} is in quadrant II with reference angle ${T(cH(`\\theta_R=${th}^\\circ`))}, where sine is positive.`, run: async (c) => { Z.arcR.style.opacity = 1; await drawIn(Z.arcR, 400, c); await show(c, Z.lR); await show(c, L[3]); } },
        { cap: `Backwards: ${T(`\\sin^{-1}(${fx(y, 4)})`)} gives only ${T(c1(`${th}^\\circ`))}. The other answer is ${T(c2(`180^\\circ-${th}^\\circ=${180 - th}^\\circ`))}.`, run: (c) => show(c, L[4]) }
      ];
    }
    const k = d.k, kl = d.ex2 ? fx(k, 4) : String(k);
    const kLine = hide(G.segment([-1.24, k], [1.24, k], { color: HC, dash: true, width: 3 })), kLab = hide(G.label(-1.24, k, T(cH(`y=${kl}`)), { pos: 'ne', cls: 'bk-ptlab' }));
    const kIn = async (c) => { kLine.style.opacity = 1; await drawIn(kLine, 600, c); await show(c, kLab); };
    if (d.ex2) {
      const B1 = asinD(k), Z = arms(B1);
      const L = [lineIn(pnl, `${T(`\\sin B\\approx${kl}`)}: find the points at height ${T(kl)}.`), lineIn(pnl, `${T(c1(`B_1=\\sin^{-1}(${kl})\\approx${fx(B1, 1)}^\\circ`))}`), lineIn(pnl, `${T(c2(`B_2=180^\\circ-${fx(B1, 1)}^\\circ=${fx(180 - B1, 1)}^\\circ`))}`),
        lineIn(pnl, `${T(`40^\\circ+${fx(B1, 1)}^\\circ<180^\\circ`)} ✓<br>${T(`40^\\circ+${fx(180 - B1, 1)}^\\circ<180^\\circ`)} ✓`), lineIn(pnl, '<b>Both</b> angles work: two triangles (Mia’s and Theo’s).', 'u3l7-line-ans')];
      return [
        { cap: `Example 2: ${T(`\\sin B\\approx${kl}`)}. On a circle with ${T('r=1')} the sine is the height: draw the line ${T(`y=${kl}`)}.`, run: async (c) => { await kIn(c); await show(c, L[0]); } },
        { cap: `The line crosses the semicircle <b>twice</b>, so <b>two</b> angles have this sine.`, run: async (c) => { Z.d1.style.opacity = Z.d2.style.opacity = 1; await Promise.all([pop(c, Z.d1), pop(c, Z.d2)]); } },
        { cap: `${T(`\\sin^{-1}(${kl})\\approx${fx(B1, 1)}^\\circ`)}: the <b>acute</b> one. That is all the calculator shows.`, run: async (c) => { await Z.in1(c); await show(c, L[1]); } },
        { cap: `The other: ${T(`180^\\circ-${fx(B1, 1)}^\\circ=${fx(180 - B1, 1)}^\\circ`)}, the <b>obtuse</b> one.`, run: async (c) => { await Z.in2(c); await show(c, L[2]); } },
        { cap: `Both fit beside ${T('\\angle A=40^\\circ')}: the angle sums stay under ${T('180^\\circ')}. <b>Two triangles.</b>`, run: async (c) => { await show(c, L[3]); await show(c, L[4]); } }
      ];
    }
    if (k === 1) {
      const top = hide(G.point(0, 1, { color: G1, r: 7 })), arm = hide(G.segment([0, 0], [0, 1], { color: G1, width: 4 }));
      const arc = hide(angleArc(G.layers.top, O, [O[0] + 10, O[1]], G.toPx(0, 1), 44, { color: G1, width: 3 }));
      const L = [lineIn(pnl, `${T('\\sin B=1')}: height 1, the top of the circle.`), lineIn(pnl, `${T(c1('B=90^\\circ'))} only (${T('180^\\circ-90^\\circ=90^\\circ')}: the same angle).`), lineIn(pnl, 'One angle: one <b>right</b> triangle.', 'u3l7-line-ans')];
      return [
        { cap: `${T('\\sin B=1')}: draw the line ${T('y=1')}.`, run: async (c) => { await kIn(c); await show(c, L[0]); } },
        { cap: `It <b>touches</b> the semicircle once, at the top: ${T('B=90^\\circ')}. Here ${T('180^\\circ-B')} is the same angle.`, run: async (c) => { arm.style.opacity = arc.style.opacity = 1; await drawIn(arc, 300, c); await drawIn(arm, 400, c); await pop(c, top); await show(c, L[1]); } },
        { cap: `One angle: <b>one</b> triangle, with a right angle at ${T('B')}.`, run: (c) => show(c, L[2]) }
      ];
    }
    const L = [lineIn(pnl, `${T('\\sin B=1.1')}: draw ${T('y=1.1')}.`), lineIn(pnl, `The highest point of the circle is ${T('y=1')}. Nothing reaches ${T('1.1')}.`), lineIn(pnl, '<b>No angle</b>, so <b>no triangle</b>.<br>The calculator says <b>ERROR: DOMAIN</b>.', 'u3l7-line-ans')];
    const miss = hide(stamp(stage, 'no angle', { ok: false, x: 300, y: 70 }));
    return [
      { cap: `${T('\\sin B=1.1')}: draw the line ${T('y=1.1')}.`, run: async (c) => { await kIn(c); await show(c, L[0]); } },
      { cap: `The line <b>misses</b> the semicircle: no point on it is higher than 1. No angle has a sine greater than 1.`, run: async (c) => { await show(c, L[1]); await stampIn(c, miss); } },
      { cap: `No angle, so <b>no triangle</b>. The calculator gives <b>ERROR: DOMAIN</b> for ${T('\\sin^{-1}(1.1)')}.`, run: (c) => show(c, L[2]) }
    ];
  }
};

/* ====================================================================================================
 * explainer (STAR): the swinging side with a live slider
 * ==================================================================================================== */
const SW = {
  acute: { label: 'Acute: ∠A = 40°, b = 10', A: 40, b: 10, amax: 13 },
  obtuse: { label: 'Obtuse: ∠A = 120°, b = 8', A: 120, b: 8, amax: 13 },
  ex4a: { label: 'Example 4 (30°)', A: 30, b: 14, amax: 18 },
  ex4b: { label: 'Example 4 (115°)', A: 115, b: 8, amax: 13 }
};
const ROWS_ACUTE = [['a<h', 0, 'too short'], ['a=h', 1, 'right triangle'], ['h<a<b', 2, 'B acute or obtuse'], ['a\\ge b', 1, '']];
const ROWS_OBT = [['a\\le b', 0, ''], ['a>b', 1, '']];
const swing = {
  title: 'The swinging side',
  height: 432, minW: 940, capH: 84,
  choices: [{ v: 'acute', label: SW.acute.label }, { v: 'obtuse', label: SW.obtuse.label }, { sep: 'Check:' }, { v: 'ex4a', label: SW.ex4a.label }, { v: 'ex4b', label: SW.ex4b.label }],
  ask: (v) => { const d = SW[v]; return `${T(`\\angle A=${d.A}^\\circ`)} and ${T(`b=${d.b}`)} are fixed. Drag the slider to change ${T(cA('a'))}: how many triangles?`; },
  make(stage, v, ex) {
    const d = SW[v], W = ex.W, A = d.A, b = d.b, hg = b * sinD(A), acute = A < 90, hT = fz(hg, 2);
    const F = new SSAFig(stage, { x: 4, y: 0, w: 624, h: 304, A, b, amax: d.amax, labA: T(cA(`${A}^\\circ`)), labB: T(cB(`b=${b}`)), labS: T(cA('a')), showH: false, padT: 40 });
    // the readout panel
    const pn = panel(stage, 640, 6, W - 648, 296, '');
    pn.innerHTML = `<div class="u3l7-ph">${acute ? 'Acute' : 'Obtuse'} ${T('\\angle A')} · ${acute ? T(`h\\approx${hT}`) + ', ' : ''}${T(`b=${b}`)}</div>
      <div class="u3l7-cline"><div class="u3l7-aval"><i>a</i> = <b class="u3l7-av">–</b></div><div class="u3l7-count"><span class="u3l7-cn">?</span><span class="u3l7-cw">triangles</span></div></div>
      <div class="u3l7-rows">${(acute ? ROWS_ACUTE : ROWS_OBT).map((r, i) => `<div class="u3l7-row" data-r="${acute ? i : i + 4}"><span>${T(r[0])}</span><b>${r[1]}</b><span class="u3l7-rn">${r[2]}</span></div>`).join('')}</div>`;
    const av = pn.querySelector('.u3l7-av'), cn = pn.querySelector('.u3l7-cn'), cw = pn.querySelector('.u3l7-cw'), rows = [...pn.querySelectorAll('.u3l7-row')];
    // the ruler (the slider's track): zones 0 | 1 | 2 | 1
    const rx0 = 92, rx1 = W - 48, RY = 344, ax = (a) => rx0 + (a / d.amax) * (rx1 - rx0);
    const rul = svgEl('svg', { width: W, height: 88, viewBox: `0 0 ${W} 88`, class: 'u3l7-rul' }, stage); rul.style.position = 'absolute'; rul.style.left = '0px'; rul.style.top = (RY - 40) + 'px';
    const ov = div(stage, 'u3l7-ov', '', 0, RY - 40, W, 88);
    const Y = 40, zone = (a0, a1, fill) => svgEl('rect', { x: ax(a0), y: Y - 7, width: Math.max(0, ax(a1) - ax(a0)), height: 14, rx: 3, fill }, rul);
    svgEl('line', { x1: rx0, y1: Y, x2: rx1, y2: Y, stroke: '#d9d3c7', 'stroke-width': 14, 'stroke-linecap': 'round' }, rul);
    const zl = [];
    const zLab = (a, t, colr) => { const e = lab(ov, t, ax(a), Y - 12, 'n', 'u3l7-zl', 2); e.style.color = colr; zl.push(e); return e; };
    const tick = (a, html, colr) => { const g = svgEl('g', {}, rul); svgEl('line', { x1: ax(a), y1: Y - 12, x2: ax(a), y2: Y + 12, stroke: colr, 'stroke-width': 3.5 }, g); const e = lab(ov, html, ax(a), Y + 12, 's', 'u3l7-tk', 2); return { g, e }; };
    lab(ov, T(cA('a')), rx0 - 40, Y, 'c', 'u3l7-ra');
    lab(ov, T('0'), rx0, Y + 12, 's', 'u3l7-tk', 2);
    let hTick = null;
    if (acute) {
      zone(0, hg, '#f3c9c6'); zone(hg, b, '#bfe3d3'); zone(b, d.amax, '#c9d8f5');
      zLab(hg / 2, '0', RED); zLab(hg, '1', HC); zLab((hg + b) / 2, '2', G1); zLab((b + d.amax) / 2, '1', BC);
      hTick = tick(hg, T(cH(`h\\approx${hT}`)), HC); hide(hTick.g); hide(hTick.e);
    } else { zone(0, b, '#f3c9c6'); zone(b, d.amax, '#c9d8f5'); zLab(b / 2, '0', RED); zLab((b + d.amax) / 2, '1', BC); }
    const bTick = tick(b, T(cB(`b=${b}`)), BC);
    const inp = h('input', 'u3l7-slider'); inp.type = 'range'; inp.min = 0; inp.max = d.amax; inp.step = 0.01; inp.value = 0; inp.setAttribute('aria-label', 'length of side a');
    const TW = 34; box(inp, rx1 - rx0 + TW, 34); inp.style.position = 'absolute'; add(stage, inp, rx0 - TW / 2, RY - 17);
    F.onSet = (a, info) => {
      av.textContent = fx(a, 2); cn.textContent = info.n; cw.textContent = info.n === 1 ? 'triangle' : 'triangles';
      cn.className = 'u3l7-cn u3l7-cn' + info.n; rows.forEach((r) => r.classList.toggle('on', +r.dataset.r === info.row));
      if (+inp.value !== a) inp.value = a;
    };
    inp.addEventListener('input', () => {
      let a = +inp.value; const tol = 0.012 * d.amax;
      if (acute && Math.abs(a - hg) < tol) a = hg; else if (Math.abs(a - b) < tol) a = b;
      F.showH(acute); if (hTick) { hTick.g.style.opacity = 1; hTick.e.style.opacity = 1; }
      F.set(Math.max(0.05, a));
    });
    const hIn = async (c) => { F.showH(true); await appear(c, F.gH, 400); if (hTick) await Promise.all([show(c, hTick.g), show(c, hTick.e)]); };
    const zonesPulse = async (c) => { for (const e of zl) await pulse(c, e, 1.35, 380); };
    const angOn = (on) => { F.angB = on; if (F.a != null) F.set(F.a); };
    if (v === 'acute') return [
      { cap: `${T('\\angle A=40^\\circ')} and ${T(cB('b=AC=10'))} are fixed, so ${T('C')} is fixed. The <b>shortest distance</b> from ${T('C')} to the arm is the height ${T(`${cH('h')}=10\\sin40^\\circ\\approx${hT}`)}.`, run: hIn },
      { cap: `${T('a=5<h')}: <b>too short</b>. Side ${T(cA('a'))} swings from ${T('C')} but never reaches the arm: <b>0 triangles</b>.`, run: (c) => F.swing(c, 5) },
      { cap: `${T(`a=h\\approx${hT}`)}: it <b>just touches</b> the arm. <b>1 triangle</b>, with a right angle at ${T('B')}.`, run: (c) => F.goTo(c, hg) },
      { cap: `${T('h<a<b')}: with ${T('a=7')} (Example 2) it lands <b>twice</b>, at ${T(c1('B_1'))} and ${T(c2('B_2'))}: <b>2 triangles</b>.`, run: async (c) => { await F.goTo(c, 7, 600); await F.swing(c, 7); } },
      { cap: `At ${T(c1('B_1'))} the angle ${T('B')} is acute (Mia); at ${T(c2('B_2'))} it is obtuse (Theo). Same ${T('\\angle A')}, ${T('b')} and ${T('a')}: two different triangles.`, run: async (c) => { angOn(true); await pulse(c, F.el, 1.02); } },
      { cap: `${T('a\\ge b')}: with ${T('a=11')} the near landing is <b>behind</b> ${T('A')}, not on the arm. Only <b>1 triangle</b>.`, run: (c) => F.goTo(c, 11) },
      { cap: `<b>Your turn:</b> drag the slider. As ${T(cA('a'))} grows past ${T(cH('h'))} and ${T(cB('b'))}, the count goes 0, 1, 2, 1.`, run: zonesPulse }
    ];
    if (v === 'obtuse') return [
      { cap: `${T('\\angle A=120^\\circ')} is <b>obtuse</b>: ${T('C')} leans back over the extension of the arm. Compare ${T(cA('a'))} with ${T(cB('b=8'))}.`, run: (c) => pulse(c, bTick.e, 1.3) },
      { cap: `${T('a=5')}: too short to reach the line at all: <b>0 triangles</b>.`, run: (c) => F.swing(c, 5) },
      { cap: `${T('a=7.5')}: it reaches the line twice, but <b>both</b> landings are behind ${T('A')}: still <b>0</b>.`, run: async (c) => { await F.goTo(c, 7.5, 600); await F.swing(c, 7.5); } },
      { cap: `${T('a=b=8')}: one landing is exactly at ${T('A')} (no triangle), the other is behind it: <b>0</b>.`, run: (c) => F.goTo(c, 8) },
      { cap: `${T('a=11>b')}: the far landing is on the arm: <b>1 triangle</b>.`, run: (c) => F.goTo(c, 11) },
      { cap: `Obtuse ${T('\\angle A')}: ${T('a\\le b')} gives none, ${T('a>b')} gives one. Drag the slider to see.`, run: zonesPulse }
    ];
    if (v === 'ex4a') return [
      { cap: `Example 4: ${T('\\angle A=30^\\circ')}, ${T('b=14')}, so ${T(`${cH('h')}=14\\sin30^\\circ=7`)}.`, run: hIn },
      { cap: `${T('a=5<h')}: too short: <b>0 triangles</b>.`, run: (c) => F.swing(c, 5) },
      { cap: `${T('a=7=h')}: it just touches: <b>1</b> right triangle.`, run: (c) => F.goTo(c, 7) },
      { cap: `${T('a=10')}: ${T('7<10<14')}, it lands twice: <b>2 triangles</b>.`, run: async (c) => { await F.goTo(c, 10, 600); await F.swing(c, 10); } },
      { cap: `${T('a=16')}: ${T('16\\ge14')}, the near landing is behind ${T('A')}: <b>1 triangle</b>.`, run: (c) => F.goTo(c, 16) }
    ];
    return [
      { cap: `Example 4, obtuse: ${T('\\angle A=115^\\circ')}, ${T('b=8')}. Compare ${T(cA('a'))} with ${T(cB('b'))}.`, run: (c) => pulse(c, bTick.e, 1.3) },
      { cap: `${T('a=6')}: ${T('6\\le8')}: <b>0 triangles</b>.`, run: (c) => F.swing(c, 6) },
      { cap: `${T('a=11')}: ${T('11>8')}: <b>1 triangle</b>.`, run: async (c) => { await F.goTo(c, 11, 600); await F.swing(c, 11); } }
    ];
  }
};

/* ====================================================================================================
 * Example 3: the six summary sketches (static on the card; swung one by one in the explainer)
 * ==================================================================================================== */
const SIX = [
  { A: 35, b: 10, a: 4.2, amax: 12.3, t: '(i)\\ a<h', cap: () => `${T('a<h')}: side ${T('a')} is too short to reach: <b>0</b>.` },
  { A: 35, b: 10, a: 10 * sinD(35), amax: 12.3, t: '(ii)\\ a=h', cap: () => `${T('a=h')}: it just touches: <b>1</b>, a right triangle (${T('B=90^\\circ')}).` },
  { A: 35, b: 10, a: 7.4, amax: 12.3, t: '(iii)\\ h<a<b', cap: () => `${T('h<a<b')}: it lands twice: <b>2</b> (${T('B')} acute or ${T('B')} obtuse).` },
  { A: 35, b: 10, a: 12, amax: 12.3, t: '(iv)\\ a\\ge b', cap: () => `${T('a\\ge b')}: the near landing is behind ${T('A')}: <b>1</b>.` },
  { A: 120, b: 8, a: 7.3, amax: 11.4, t: '(v)\\ A\\text{ obtuse},\\ a\\le b', cap: () => `Obtuse ${T('A')}, ${T('a\\le b')}: every landing is behind ${T('A')}: <b>0</b>.` },
  { A: 120, b: 8, a: 11, amax: 11.4, t: '(vi)\\ A\\text{ obtuse},\\ a>b', cap: () => `Obtuse ${T('A')}, ${T('a>b')}: the far landing is on the arm: <b>1</b>.` }
];
const sixFig = (host, d, o) => new SSAFig(host, Object.assign({ A: d.A, b: d.b, amax: d.amax, labA: false, labB: false, small: true, font: 16, lw: 3, arcR: 22, padT: 26, padB: 26, padX: 14, showH: d.A < 90 }, o));
const six = {
  title: 'Example 3 check: the six cases',
  height: 404, minW: 940,
  ask: 'Example 3: how many triangles does each sketch give?',
  make(stage, v, ex) {
    const W = ex.W, cw = (W - 32) / 3, ch = 196;
    const items = SIX.map((d, i) => {
      const x = 8 + (i % 3) * (cw + 8), y = 4 + Math.floor(i / 3) * (ch + 6);
      const card = div(stage, 'u3l7-sk6', '', x, y, cw, ch);
      const F = sixFig(card, d, { w: cw - 4, h: ch - 36 });
      card.appendChild(h('div', 'u3l7-skl', T(d.t)));
      const n = ROWN[caseRow(d.A, d.a, d.b)], bd = hide(div(card, 'u3l7-badge u3l7-badge' + n, `${n}`, cw - 52, 6));
      return { F, bd, d };
    });
    const st = items.map((it) => ({ cap: it.d.cap(), run: async (c) => { await it.F.swing(c, it.d.a, 900); await pop(c, it.bd); } }));
    st.push({ cap: `Only an <b>acute</b> ${T('A')} with ${T('h<a<b')} gives two triangles.`, run: (c) => pulse(c, items[2].bd, 1.4) });
    return st;
  }
};
function mountStatics() {
  const sx = document.getElementById('u3l7-six');
  if (sx) SIX.forEach((d) => { const card = add(sx, h('div', 'u3l7-sk')); sixFig(card, d, { w: 300, h: 160, a: d.a }); card.appendChild(h('div', 'u3l7-skl', T(d.t))); });
  const f0 = document.getElementById('u3l7-fig0');
  if (f0) new SSAFig(f0, { w: 400, h: 230, A: 35, b: 10, amax: 7.6, a: 7, labA: T(cA('A')), labB: T(cB('b')), labS: T(cA('a')), font: 18, padT: 30, padB: 34 });
  const f5 = document.getElementById('u3l7-fig5');
  if (f5) new SSAFig(f5, { w: 480, h: 250, A: 38, b: 13, amax: 9.6, a: 9, labA: T(cA('38^\\circ')), labB: T(cB('13.0')), labS: T(cA('9.0')), showH: false, font: 18 });
  const f7 = document.getElementById('u3l7-fig7');
  if (f7) new SSAFig(f7, { w: 560, h: 230, A: 22, b: 15, amax: 9.4, a: 8, names: ['P', 'F', 'B'], hitNames: { near: 'F_1', far: 'F_2' }, labA: T(cA('22^\\circ')), labB: T(cB('15\\text{ km}')), labS: T(cA('8')), showH: false, arrow: 'path', font: 18, padT: 30 });
}

/* ====================================================================================================
 * explainer: a decision chart for counting triangles
 * ==================================================================================================== */
const DC = { a5: { A: 30, b: 14, a: 5 }, a7: { A: 30, b: 14, a: 7 }, a10: { A: 30, b: 14, a: 10 }, a16: { A: 30, b: 14, a: 16 }, o6: { A: 115, b: 8, a: 6 }, o11: { A: 115, b: 8, a: 11 } };
const decide = {
  title: 'Counting triangles: a decision chart',
  height: 424, minW: 940,
  choices: [{ sep: 'Example 4, ∠A = 30°, b = 14:' }, { v: 'a5', label: 'a = 5' }, { v: 'a7', label: 'a = 7' }, { v: 'a10', label: 'a = 10' }, { v: 'a16', label: 'a = 16' }, { sep: '∠A = 115°, b = 8:' }, { v: 'o6', label: 'a = 6' }, { v: 'o11', label: 'a = 11' }],
  ask: (v) => { const d = DC[v]; return `${T(`\\angle A=${d.A}^\\circ`)}, ${T(`b=${d.b}`)}, ${T(`a=${d.a}`)}: how many triangles?`; },
  make(stage, v, ex) {
    const W = ex.W, cx = W / 2 + 60, d = DC[v], hg = d.b * sinD(d.A), row = caseRow(d.A, d.a, d.b);
    const nodes = {
      start: { x: cx, y: 32, w: 430, h: 50, html: `<b>SSA</b> ${T('\\angle A')}, ${T('a')} (opposite ${T('\\angle A')}), ${T('b')}`, cls: 'bk-round' },
      qA: { x: cx, y: 116, w: 250, h: 54, html: `<b>Is ${T('\\angle A')} acute?</b>`, cls: 'bk-diamond' },
      oq: { x: cx - 250, y: 206, w: 200, h: 54, html: `<b>Is ${T('a>b')}?</b>`, cls: 'bk-diamond' },
      o0: { x: cx - 345, y: 318, w: 150, h: 60, html: '<b>0 triangles</b>', color: 'red' },
      o1: { x: cx - 160, y: 318, w: 150, h: 60, html: '<b>1 triangle</b>', color: 'blue' },
      aq: { x: cx + 120, y: 206, w: 190, h: 54, html: `<b>Is ${T('a\\ge b')}?</b>`, cls: 'bk-diamond' },
      a1: { x: W - 80, y: 206, w: 136, h: 54, html: '<b>1 triangle</b>', color: 'blue' },
      hq: { x: cx + 120, y: 296, w: 250, h: 50, html: `<b>Find ${T(cH('h=b\\sin A'))}</b>` },
      r0: { x: cx - 40, y: 386, w: 150, h: 56, html: `${T('a<h')}<br><b>0</b>`, color: 'red' },
      r1: { x: cx + 120, y: 386, w: 150, h: 56, html: `${T('a=h')}<br><b>1</b> (right)`, color: 'amber' },
      r2: { x: cx + 280, y: 386, w: 150, h: 56, html: `${T('h<a<b')}<br><b>2</b>`, color: 'green' }
    };
    const edges = [
      { from: 'start', to: 'qA' }, { from: 'qA', to: 'oq', label: 'no', route: 'hv' }, { from: 'qA', to: 'aq', label: 'yes', route: 'hv' },
      { from: 'oq', to: 'o0', label: 'no', route: 'vhv' }, { from: 'oq', to: 'o1', label: 'yes', route: 'vhv' },
      { from: 'aq', to: 'a1', label: 'yes' }, { from: 'aq', to: 'hq', label: 'no' },
      { from: 'hq', to: 'r0', route: 'vhv' }, { from: 'hq', to: 'r1' }, { from: 'hq', to: 'r2', route: 'vhv' }
    ];
    const F = new Flowchart(stage, { x: 0, y: 0, width: W, height: 424, nodes, edges });
    const nb = panel(stage, 8, 8, 192, 166, 'Given');
    nb.insertAdjacentHTML('beforeend', `<div class="u3l7-line u3l7-line-sm">${T(cA(`\\angle A=${d.A}^\\circ`))}</div><div class="u3l7-line u3l7-line-sm">${T(cB(`b=${d.b}`))}</div><div class="u3l7-line u3l7-line-sm">${T(cA(`a=${d.a}`))}</div>`);
    const hl = lineIn(nb, T(cH(`h=${d.b}\\sin${d.A}^\\circ=${fz(hg, 2)}`)), 'u3l7-line-sm');
    const steps = [{ cap: `Given ${T(`\\angle A=${d.A}^\\circ`)}, ${T(`b=${d.b}`)} and ${T(`a=${d.a}`)} (the side opposite ${T('\\angle A')}).`, run: (c) => F.visit(c, 'start') }];
    const go = (from, to, cap, extra) => steps.push({ cap, run: async (c) => { await F.go(c, from, to); await F.visit(c, to); if (extra) await extra(c); } });
    if (d.A < 90) {
      go('start', 'qA', `${T(`\\angle A=${d.A}^\\circ`)} is <b>acute</b>.`);
      go('qA', 'aq', `Is ${T('a\\ge b')}? ${T(`${d.a}\\ge${d.b}`)}? <b>${d.a >= d.b ? 'Yes' : 'No'}</b>.`);
      if (d.a >= d.b) go('aq', 'a1', `The side opposite ${T('\\angle A')} is the longer one: <b>1 triangle</b>.`);
      else {
        go('aq', 'hq', `Not settled yet: find the height. ${T(`h=${d.b}\\sin${d.A}^\\circ=${fz(hg, 2)}`)}.`, (c) => show(c, hl));
        const r = ['r0', 'r1', 'r2'][row];
        const cap = row === 0 ? `${T(`${d.a}<${fz(hg, 2)}`)}: too short: <b>0 triangles</b>.` : row === 1 ? `${T(`a=h=${fz(hg, 2)}`)}: just touches: <b>1</b> right triangle.` : `${T(`${fz(hg, 2)}<${d.a}<${d.b}`)}: <b>2 triangles</b>.`;
        go('hq', r, cap);
      }
    } else {
      go('start', 'qA', `${T(`\\angle A=${d.A}^\\circ`)} is <b>obtuse</b>: no height needed.`);
      go('qA', 'oq', `Is ${T('a>b')}? ${T(`${d.a}>${d.b}`)}? <b>${d.a > d.b ? 'Yes' : 'No'}</b>.`);
      go('oq', d.a > d.b ? 'o1' : 'o0', d.a > d.b ? `<b>1 triangle</b>.` : `${T(`${d.a}\\le${d.b}`)}: <b>0 triangles</b>.`);
    }
    return steps;
  }
};

/* ====================================================================================================
 * explainer: solving both triangles
 * ==================================================================================================== */
const SV = {
  demo: { label: '∠A = 32°, a = 7, b = 11', A: 32, a: 7, b: 11, N: ['A', 'B', 'C'], u: 'cm', all: true },
  ex5: { label: 'Example 5', A: 38, a: 9, b: 13, sa: '9.0', sb: '13.0', N: ['A', 'B', 'C'], u: 'cm', all: true, warn: true },
  ex6a: { label: 'Example 6(a)', A: 47, a: 15, b: 11, N: ['P', 'Q', 'R'], u: 'm', all: false },
  ex6b: { label: 'Example 6(b)', A: 62, a: 8, b: 10, N: ['X', 'Y', 'Z'], u: 'cm', all: false },
  ex6c: { label: 'Example 6(c)', A: 108, a: 20, b: 14, N: ['K', 'L', 'M'], u: 'cm', all: true }
};
const solve2 = {
  title: 'Solving the ambiguous case',
  height: 440, minW: 940, capH: 84,
  choices: [{ v: 'demo', label: SV.demo.label }, { sep: 'Check:' }, ...['ex5', 'ex6a', 'ex6b', 'ex6c'].map((k) => ({ v: k, label: SV[k].label }))],
  ask: (v) => { const d = SV[v], [nA, nB, nC] = d.N, la = nA.toLowerCase(), lb = nB.toLowerCase(); return `${v === 'demo' ? '' : d.label + ': '}${T(`\\triangle ${nA}${nB}${nC}`)} with ${T(`\\angle ${nA}=${d.A}^\\circ`)}, ${T(`${la}=${d.sa || d.a}`)}, ${T(`${lb}=${d.sb || d.b}`)}. Find every possible ${T(`\\angle ${nB}`)}${d.all ? ' and solve each triangle' : ''}.`; },
  make(stage, v, ex) {
    const d = SV[v], W = ex.W, [nA, nB, nC] = d.N, la = nA.toLowerCase(), lb = nB.toLowerCase(), lc = nC.toLowerCase(), A = d.A, sa = d.sa || String(d.a), sb = d.sb || String(d.b);
    const hg = d.b * sinD(A), k = d.b * sinD(A) / d.a, acute = A < 90;
    const F = new SSAFig(stage, { x: 4, y: 20, w: 450, h: 400, A, b: d.b, amax: Math.max(d.a, hg * 0.8) * 1.04, names: d.N, labA: T(cA(`${A}^\\circ`)), labB: T(cB(sb)), labS: T(cA(sa)), showH: false, angB: true, padT: 40 });
    const P0 = panel(stage, 466, 4, W - 474, 120, 'Count, then the sine law'), P1 = panel(stage, 466, 132, W - 474, 150, `Triangle 1 · ${T(c1(`${nB}_1`))} acute`, 'u3l7-p1'), P2 = panel(stage, 466, 288, W - 474, 150, `Triangle 2 · ${T(c2(`${nB}_2`))} obtuse`, 'u3l7-p2');
    const sinTex = `\\sin ${nB}=\\dfrac{${sb}\\sin${A}^\\circ}{${sa}}`;
    const steps = [];
    if (k > 1) {
      const L0 = lineIn(P0, T(`${sinTex}\\approx${fx(k, 3)}>1`)), L1 = lineIn(P0, `No angle has a sine greater than 1: <b>no triangle</b>.`, 'u3l7-line-ans');
      P1.querySelector('.u3l7-ph').textContent = 'Check with the height'; P2.classList.add('u3l7-pdim');
      const L2 = lineIn(P1, `${T(`h=${sb}\\sin${A}^\\circ\\approx${fx(hg, 1)}`)}, ${T(`${la}=${sa}<h`)}: side ${T(la)} cannot reach.`);
      steps.push({ cap: `Sine law: ${T(`${sinTex}\\approx${fx(k, 3)}`)}. That is <b>greater than 1</b>.`, run: (c) => show(c, L0) });
      steps.push({ cap: `No angle has a sine greater than 1, so there is <b>no triangle</b>.`, run: (c) => show(c, L1) });
      steps.push({ cap: `The picture agrees: ${T(`h=${sb}\\sin${A}^\\circ\\approx${fx(hg, 1)}`)} and ${T(`${la}=${sa}<h`)}. Side ${T(la)} cannot reach.`, run: async (c) => { F.showH(true); await appear(c, F.gH, 300); await F.swing(c, d.a); await show(c, L2); } });
      return steps;
    }
    const B1 = asinD(k), B2 = 180 - B1, B1r = +fx(B1, 1), B2r = +fx(B2, 1), keep2 = A + B2 < 180;
    // count line
    let countCap, countTex;
    if (!acute) { countCap = `${T(`\\angle ${nA}`)} is obtuse and ${T(`${la}>${lb}`)}: <b>one</b> triangle.`; countTex = `\\angle ${nA}\\text{ obtuse},\\ ${la}>${lb}:\\ \\text{one}`; }
    else if (d.a >= d.b) { countCap = `${T(`${la}>${lb}`)}: the side opposite the given angle is longer: <b>one</b> triangle.`; countTex = `${la}>${lb}:\\ \\text{one triangle}`; }
    else { countCap = `${T(`h=${sb}\\sin${A}^\\circ\\approx${fx(hg, 1)}`)}. Since ${T(`${fx(hg, 1)}<${sa}<${sb}`)}, there are <b>two</b> triangles.`; countTex = `h\\approx${fx(hg, 1)}<${sa}<${sb}:\\ \\text{two}`; }
    const L0 = lineIn(P0, T(countTex)), L1 = lineIn(P0, T(`${sinTex}\\approx${fx(k, 4)}`));
    const showHnow = acute && d.a < d.b;
    steps.push({ cap: countCap, run: async (c) => { if (showHnow) { F.showH(true); await appear(c, F.gH, 300); } await F.swing(c, d.a); await show(c, L0); } });
    steps.push({ cap: `Sine law: ${T(`\\dfrac{\\sin ${nB}}{${lb}}=\\dfrac{\\sin ${nA}}{${la}}`)}, so ${T(`${sinTex}\\approx${fx(k, 4)}`)}.`, run: (c) => show(c, L1) });
    const M1 = lineIn(P1, T(c1(`${nB}_1=\\sin^{-1}(${fx(k, 4)})\\approx${fx(B1, 1)}^\\circ`)));
    steps.push({ cap: `${T(`${nB}_1=\\sin^{-1}(${fx(k, 4)})\\approx${fx(B1, 1)}^\\circ`)}: the acute angle the calculator gives.`, run: (c) => show(c, M1) });
    const M2 = lineIn(P2, T(`${c2(`${nB}_2=180^\\circ-${fx(B1, 1)}^\\circ=${fx(B2, 1)}^\\circ`)}`) + ' ' + (keep2 ? '<span class="u3l7-ok">✓ fits</span>' : `<br><span class="u3l7-no">${T(`${A}^\\circ+${fx(B2, 1)}^\\circ>180^\\circ`)} ✗ rejected</span>`), 'u3l7-line-sm');
    steps.push({ cap: `${T(`${nB}_2=180^\\circ-${fx(B1, 1)}^\\circ=${fx(B2, 1)}^\\circ`)}. ${keep2 ? `Check: ${T(`${A}^\\circ+${fx(B2, 1)}^\\circ<180^\\circ`)}, so it <b>fits</b>.` : `But ${T(`${A}^\\circ+${fx(B2, 1)}^\\circ>180^\\circ`)}: no room for a third angle, <b>rejected</b>.`}`, run: async (c) => { await show(c, M2); if (!keep2) P2.classList.add('u3l7-pdim'); } });
    const fin = (B, Br, P, colr, i) => {
      const Cr = +fx(180 - A - Br, 1), Cx = 180 - A - B, cc = d.a * sinD(Cx) / sinD(A);
      const l1 = lineIn(P, T(`${nC}=180^\\circ-${A}^\\circ-${fx(Br, 1)}^\\circ=${fx(Cr, 1)}^\\circ`), 'u3l7-line-sm');
      const l2 = d.all ? lineIn(P, T(`${lc}=\\dfrac{${sa}\\sin${fx(Cr, 1)}^\\circ}{\\sin${A}^\\circ}\\approx${fx(cc, 1)}\\text{ ${d.u}}`), 'u3l7-line-sm') : null;
      const capC = `${T(`${nC}=180^\\circ-${A}^\\circ-${fx(Br, 1)}^\\circ=${fx(Cr, 1)}^\\circ`)}${d.all ? `, then ${T(`${lc}=\\dfrac{${sa}\\sin${fx(Cr, 1)}^\\circ}{\\sin${A}^\\circ}\\approx${fx(cc, 1)}`)} ${d.u}` : ''}.`;
      return { Cr, cc, l1, l2, capC };
    };
    const t1 = fin(B1, B1r, P1, G1, 1);
    const focus = (i) => { F.fills.forEach((f, j) => (f.style.opacity = i === 0 || j === (i === 1 ? 1 : 0) ? 1 : 0.15)); };
    steps.push({ cap: `<b>${keep2 ? 'Triangle 1' : 'Finish the triangle'}:</b> ${t1.capC}`, run: async (c) => { focus(1); await show(c, t1.l1); if (t1.l2) await show(c, t1.l2); } });
    let t2 = null;
    if (keep2) { t2 = fin(B2, B2r, P2, G2, 2); steps.push({ cap: `<b>Triangle 2:</b> ${t2.capC}`, run: async (c) => { focus(2); await show(c, t2.l1); if (t2.l2) await show(c, t2.l2); } }); }
    const r0 = (x) => fx(x, 0);
    const ans1 = `${T(`\\angle ${nB}\\approx${r0(B1)}^\\circ`)}, ${T(`\\angle ${nC}\\approx${r0(t1.Cr)}^\\circ`)}${d.all ? `, ${T(`${lc}\\approx${fx(t1.cc, 1)}`)} ${d.u}` : ''}`;
    const ans2 = t2 ? `${T(`\\angle ${nB}\\approx${r0(B2)}^\\circ`)}, ${T(`\\angle ${nC}\\approx${r0(t2.Cr)}^\\circ`)}${d.all ? `, ${T(`${lc}\\approx${fx(t2.cc, 1)}`)} ${d.u}` : ''}` : '';
    steps.push({ cap: t2 ? `Two answers: ${ans1} <b>or</b> ${ans2}.` : `One answer: ${ans1}.`, run: async (c) => { focus(0); await pulse(c, P1, 1.02); if (t2) await pulse(c, P2, 1.02); } });
    if (d.warn) {
      const wrong = d.a * sinD(25) / sinD(A);
      steps.push({ cap: `<b>Watch out:</b> rounding ${T(`${nC}`)} to ${T('25^\\circ')} first gives ${T(`${lc}=\\dfrac{9.0\\sin25^\\circ}{\\sin38^\\circ}\\approx${fx(wrong, 1)}`)}, not ${fx(t2.cc, 1)}. Keep the unrounded values.`, run: (c) => pulse(c, P2, 1.03) });
    }
    return steps;
  }
};

/* ====================================================================================================
 * explainer: two positions in a word problem (the ferry, the roof strut)
 * ==================================================================================================== */
const WP = {
  ferry: { label: 'Example 7 check: the ferry', A: 22, b: 15, a: 8, u: 'km', N: ['P', 'F', 'B'] },
  strut: { label: 'Example 8 check: the strut', A: 28, b: 6.0, a: 3.5, u: 'm', N: ['A', 'D', 'C'] }
};
const ferry = {
  title: 'Two possible positions',
  height: 392, minW: 940, capH: 84,
  choices: [{ v: 'ferry', label: WP.ferry.label }, { v: 'strut', label: WP.strut.label }],
  ask: (v) => (v === 'ferry' ? 'Example 7: at what distances from port is the ferry exactly 8 km from the buoy?' : 'Example 8: how far from A can the foot of the 3.5 m strut be?'),
  make(stage, v, ex) {
    const d = WP[v], W = ex.W, FW = 610, FH = 388, A = d.A, b = d.b, a = d.a, Cx = b * cosD(A), Cy = b * sinD(A), hg = Cy;
    const r = Math.sqrt(a * a - hg * hg), xN = Cx - r, xF = Cx + r, ferryV = v === 'ferry';
    const x0 = -1.2, x1 = ferryV ? 23.5 : 8.8, ytop = ferryV ? Cy + a + 0.3 : Cy + 1.1, ybot = ferryV ? Cy - a - 0.4 : -0.9;
    const s = Math.min((FW - 20) / (x1 - x0), (FH - 20) / (ytop - ybot)), ox = 10 - x0 * s, oy = 10 + ytop * s;
    const P = (x, y) => [ox + x * s, oy - y * s];
    const pl = plane(stage, 4, 2, FW, FH), g = pl.svg, ovl = pl.ov;
    const bgc = svgEl('clipPath', { id: 'u3l7wp' + (++UID) }, svgEl('defs', {}, g)); svgEl('rect', { x: 0, y: 0, width: FW, height: FH, rx: 14 }, bgc);
    const scene = svgEl('g', { 'clip-path': `url(#${bgc.id})` }, g);
    const Ap = P(0, 0), Cp = P(Cx, Cy), Np = P(xN, 0), Fp = P(xF, 0);
    const pnl = panel(stage, FW + 16, 4, W - FW - 22, 384, '');
    const k = b * sinD(A) / a, Dac = asinD(k), Dob = 180 - Dac, Cac = 180 - A - +fx(Dac, 1), Cob = 180 - A - +fx(Dob, 1);
    const dFar = a * sinD(180 - A - Dac) / sinD(A), dNear = a * sinD(180 - A - Dob) / sinD(A);
    let actor, setActor, trace;
    if (ferryV) {
      svgEl('rect', { x: 0, y: 0, width: FW, height: FH, fill: '#d7ecf7' }, scene);
      for (let i = 0; i < 26; i++) { const x = (i * 131) % FW, y = (i * 71) % FH; svgEl('path', { d: `M${x} ${y} q8 -6 16 0 t16 0`, fill: 'none', stroke: '#b5d7ea', 'stroke-width': 2 }, scene); }
      svgEl('rect', { x: Ap[0] - 40, y: Ap[1] - 4, width: 40, height: 40, fill: '#c9b48a' }, scene);
      svgEl('line', { x1: Ap[0], y1: Ap[1], x2: FW - 14, y2: Ap[1], stroke: SLATE, 'stroke-width': 3, 'stroke-dasharray': '10 7' }, scene);
      arrowHead(scene, FW - 6, Ap[1], 1, 0, { color: SLATE, width: 3 });
      lab(ovl, 'path', FW - 12, Ap[1] + 6, 'sw', 'u3l7-lab-sm', 2);
    } else {
      svgEl('rect', { x: 0, y: 0, width: FW, height: FH, fill: '#f3ede2' }, scene);
      svgEl('rect', { x: 0, y: Ap[1], width: FW, height: 26, fill: '#b98a4f', stroke: '#8a6232', 'stroke-width': 2 }, scene);
      for (let x = 16; x < FW; x += 46) svgEl('line', { x1: x, y1: Ap[1] + 5, x2: x + 24, y2: Ap[1] + 5, stroke: '#a77a43', 'stroke-width': 2 }, scene);
      const ext = P(Cx + 1.1 * cosD(A), Cy + 1.1 * sinD(A));
      svgEl('line', { x1: Ap[0], y1: Ap[1], x2: ext[0], y2: ext[1], stroke: '#9a6a34', 'stroke-width': 14, 'stroke-linecap': 'round' }, scene);
      lab(ovl, 'ceiling beam', FW - 12, Ap[1] + 13, 'w', 'u3l7-beam', 2);
    }
    // PB / AC and the angle
    const pb = stroke(scene, [Ap, Cp], BC, ferryV ? 3.5 : 3); hide(pb);
    const arcA = hide(angleArc(scene, Ap, [Ap[0] + 10, Ap[1]], Cp, 52, { color: AC, width: 3 }));
    const lAng = hide(lab(ovl, T(cA(`${A}^\\circ`)), Ap[0] + 76 * cosD(A / 2), Ap[1] - 76 * sinD(A / 2), 'c', 'u3l7-lab-sm'));
    const lb = hide(lab(ovl, T(cB(`${fz(b, 1)}${ferryV ? '' : '.0'}\\text{ ${d.u}}`)), (Ap[0] + Cp[0]) / 2, (Ap[1] + Cp[1]) / 2 - 6, 'nw', 'u3l7-lab-b', 4));
    const lA = hide(lab(ovl, T(d.N[0]), Ap[0], Ap[1], 'sw', 'u3l7-vx', 4)), lC = hide(lab(ovl, T(d.N[2]), Cp[0], Cp[1] - 12, 'n', 'u3l7-vx', 8));
    // the range circle / the swing trace
    const circ = svgEl('circle', { cx: Cp[0], cy: Cp[1], r: a * s, fill: ferryV ? 'rgba(201,58,51,.06)' : 'none', stroke: AC, 'stroke-width': 2.5, 'stroke-dasharray': '7 6', class: 'bk-stroke' }, scene); hide(circ);
    if (ferryV) {
      const by = svgEl('g', {}, scene);
      svgEl('path', { d: `M${Cp[0] - 9} ${Cp[1] + 10} L${Cp[0] + 9} ${Cp[1] + 10} L${Cp[0] + 5} ${Cp[1] - 12} L${Cp[0] - 5} ${Cp[1] - 12} Z`, fill: '#fff', stroke: RED, 'stroke-width': 2.5 }, by);
      svgEl('rect', { x: Cp[0] - 7, y: Cp[1] - 4, width: 14, height: 6, fill: RED }, by);
      svgEl('circle', { cx: Cp[0], cy: Cp[1] - 15, r: 4, fill: '#f6cf2c' }, by);
      hide(by); lC.innerHTML = T(d.N[2]) + ' <span class="u3l7-lab-sm">buoy</span>'; pb._by = by;
      actor = svgEl('g', {}, scene);
      svgEl('path', { d: 'M-22 -6 L18 -6 L26 2 L-18 8 Z', fill: '#fff', stroke: SLATE, 'stroke-width': 2.2, 'stroke-linejoin': 'round' }, actor);
      svgEl('rect', { x: -10, y: -16, width: 18, height: 10, rx: 2, fill: BC }, actor);
      setActor = (x) => { const p = P(x, 0); actor.setAttribute('transform', `translate(${p[0].toFixed(1)} ${(p[1] - 4).toFixed(1)})`); };
      setActor(0); hide(actor);
    } else {
      actor = svgEl('line', { stroke: '#5a6070', 'stroke-width': 9, 'stroke-linecap': 'round' }, scene);
      setActor = (f) => setLn(actor, Cp, P(Cx + a * cosD(f), Cy + a * sinD(f)));
      setActor(270); hide(actor);
      svgEl('circle', { cx: Cp[0], cy: Cp[1], r: 7, fill: '#e8e2d6', stroke: '#5a6070', 'stroke-width': 3 }, scene);
      trace = svgEl('polyline', { fill: 'none', stroke: '#5a6070', 'stroke-width': 2.5, 'stroke-dasharray': '5 6', points: '' }, scene);
    }
    // the two positions
    const nm = ferryV ? ['F_1', 'F_2'] : ['D_1', 'D_2'], u = d.u;
    const sN = hide(stroke(scene, [Cp, Np], ferryV ? AC : '#5a6070', ferryV ? 3.5 : 8)), sF = hide(stroke(scene, [Cp, Fp], ferryV ? AC : '#5a6070', ferryV ? 3.5 : 8));
    const dN = hide(dotG(scene, Np, G2, 7)), dF = hide(dotG(scene, Fp, G1, 7));
    const lN = hide(lab(ovl, T(c2(nm[0])), Np[0], Np[1] + (ferryV ? 6 : 28), 's', 'u3l7-vx', 4)), lF = hide(lab(ovl, T(c1(nm[1])), Fp[0], Fp[1] + (ferryV ? 6 : 28), 's', 'u3l7-vx', 4));
    const fN = svgEl('polygon', { points: [Ap, Cp, Np].map((q) => q.join(',')).join(' '), fill: G2, 'fill-opacity': 0.16 }, scene), fF = svgEl('polygon', { points: [Ap, Cp, Fp].map((q) => q.join(',')).join(' '), fill: G1, 'fill-opacity': 0.14 }, scene);
    scene.insertBefore(fF, pb); scene.insertBefore(fN, pb); hide(fN); hide(fF);
    const hL = hide(stroke(scene, [Cp, P(Cx, 0)], HC, 3, '8 6')), hLab = hide(lab(ovl, T(cH(`h\\approx${fx(hg, 1)}`)), P(Cx, 0)[0] + 4, (Cp[1] + Ap[1]) / 2, 'e', 'u3l7-lab-h', 4));
    const aFar = hide(angleArc(scene, Fp, Ap, Cp, 28, { color: G1, width: 3 })), aNear = hide(angleArc(scene, Np, Ap, Cp, 24, { color: G2, width: 3 }));
    const inRange = hide(stroke(scene, [Np, Fp], G1, 7)); if (inRange) inRange.setAttribute('stroke-opacity', 0.6);
    const dimF = hide(lab(ovl, `<b>${fx(dFar, 1)} ${u}</b>`, (Ap[0] + Fp[0]) / 2 + 40, Ap[1] + (ferryV ? 34 : 56), 'c', 'u3l7-dim u3l7-dimF')), dimN = hide(lab(ovl, `<b>${fx(dNear, 1)} ${u}</b>`, (Ap[0] + Np[0]) / 2, Ap[1] + (ferryV ? 34 : 56), 'c', 'u3l7-dim u3l7-dimN'));
    // working
    const tri = ferryV ? '\\triangle PBF' : '\\triangle ACD', nA = d.N[0], nX = d.N[1], nC = d.N[2];
    const W0 = lineIn(pnl, `${T(tri)}: ${T(cA(`\\angle ${nA}=${A}^\\circ`))}, ${T(cA(`${nC}${nX}=${fz(a, 1)}`))} (opposite ${T(`\\angle ${nA}`)}), ${T(cB(`${nA}${nC}=${ferryV ? '15' : '6.0'}`))}`, 'u3l7-line-sm');
    const W1 = lineIn(pnl, T(`h=${ferryV ? '15' : '6.0'}\\sin${A}^\\circ\\approx${fx(hg, 1)}<${fz(a, 1)}<${ferryV ? '15' : '6.0'}`) + ': two', 'u3l7-line-sm');
    const W2 = lineIn(pnl, T(`\\sin ${nX}=\\dfrac{${ferryV ? '15' : '6.0'}\\sin${A}^\\circ}{${fz(a, 1)}}\\approx${fx(k, 4)}`), 'u3l7-line-sm');
    const W3 = lineIn(pnl, `${T(c1(`${nX}\\approx${fx(Dac, 1)}^\\circ`))} or ${T(c2(`${nX}\\approx${fx(Dob, 1)}^\\circ`))}`, 'u3l7-line-sm');
    const W4 = lineIn(pnl, T(c1(`${nX}=${fx(Dac, 1)}^\\circ:\\ \\angle ${nC}=${fx(Cac, 1)}^\\circ,\\ ${nA}${nX}\\approx${fx(dFar, 1)}`)), 'u3l7-line-sm');
    const W5 = lineIn(pnl, T(c2(`${nX}=${fx(Dob, 1)}^\\circ:\\ \\angle ${nC}=${fx(Cob, 1)}^\\circ,\\ ${nA}${nX}\\approx${fx(dNear, 1)}`)), 'u3l7-line-sm');
    const W6 = lineIn(pnl, ferryV ? `Exactly 8 km at about <b>${fx(dNear, 1)} km</b> and <b>${fx(dFar, 1)} km</b> from port.` : `The foot can be about <b>${fx(dNear, 1)} m</b> or <b>${fx(dFar, 1)} m</b> from ${T('A')}.`, 'u3l7-line-ans');
    const setup = async (c) => {
      for (const e of [lA, pb]) { e.style.opacity = 1; } await drawIn(pb, 500, c); if (pb._by) await show(c, pb._by);
      arcA.style.opacity = 1; await drawIn(arcA, 300, c); await Promise.all([show(c, lAng), show(c, lb), show(c, lC), show(c, lA)]);
    };
    const both = async (c) => { await Promise.all([pop(c, dN), pop(c, dF)]); await Promise.all([show(c, lN), show(c, lF)]); };
    const hStep = async (c) => { hL.style.opacity = 1; await drawIn(hL, 400, c); await show(c, hLab); await show(c, W0); await show(c, W1); };
    const angStep = async (c) => { aFar.style.opacity = aNear.style.opacity = 1; await Promise.all([drawIn(aFar, 300, c), drawIn(aNear, 300, c)]); await show(c, W2); await show(c, W3); };
    const farStep = async (c) => { sF.style.opacity = 1; await drawIn(sF, 300, c); await show(c, fF); await show(c, dimF); await show(c, W4); };
    const nearStep = async (c) => { sN.style.opacity = 1; await drawIn(sN, 300, c); await show(c, fN); await show(c, dimN); await show(c, W5); };
    if (ferryV) return [
      { cap: `Port ${T('P')}, buoy ${T('B')} 15 km away. The ferry’s path makes ${T('22^\\circ')} with ${T('PB')}.`, run: setup },
      { cap: `The beacon reaches 8 km: every point <b>exactly 8 km</b> from ${T('B')} is on this circle.`, run: async (c) => { circ.style.opacity = 1; await drawIn(circ, 900, c); } },
      { cap: `The ferry sails along its path. It is exactly 8 km from ${T('B')} <b>twice</b>: entering the range at ${T(c2('F_1'))}, leaving it at ${T(c1('F_2'))}.`, run: async (c) => { actor.style.opacity = 1; let sN2 = false, sF2 = false; await tween(c, 2600, (t) => { const x = 22.6 * t; setActor(x); if (!sN2 && x >= xN) { sN2 = true; dN.style.opacity = 1; lN.style.opacity = 1; } if (!sF2 && x >= xF) { sF2 = true; dF.style.opacity = 1; lF.style.opacity = 1; } }, (t) => t); await both(c); } },
      { cap: `In ${T('\\triangle PBF')}: ${T('\\angle P=22^\\circ')}, ${T('BF=8')} (opposite ${T('\\angle P')}), ${T('PB=15')}. ${T(`h=15\\sin22^\\circ\\approx${fx(hg, 1)}<8<15`)}: two positions.`, run: hStep },
      { cap: `Sine law: ${T(`\\sin F=\\dfrac{15\\sin22^\\circ}{8}\\approx${fx(k, 4)}`)}, so ${T(`F\\approx${fx(Dac, 1)}^\\circ`)} or ${T(`F=180^\\circ-${fx(Dac, 1)}^\\circ=${fx(Dob, 1)}^\\circ`)}.`, run: angStep },
      { cap: `${T(`F=${fx(Dac, 1)}^\\circ`)} is the far point ${T(c1('F_2'))}: ${T(`\\angle B=${fx(Cac, 1)}^\\circ`)}, ${T(`PF=\\dfrac{8\\sin${fx(Cac, 1)}^\\circ}{\\sin22^\\circ}\\approx${fx(dFar, 1)}`)} km.`, run: farStep },
      { cap: `${T(`F=${fx(Dob, 1)}^\\circ`)} is the near point ${T(c2('F_1'))}: ${T(`\\angle B=${fx(Cob, 1)}^\\circ`)}, ${T(`PF=\\dfrac{8\\sin${fx(Cob, 1)}^\\circ}{\\sin22^\\circ}\\approx${fx(dNear, 1)}`)} km.`, run: nearStep },
      { cap: `Exactly 8 km from the buoy at about <b>${fx(dNear, 1)} km</b> and <b>${fx(dFar, 1)} km</b> from port; within range in between.`, run: async (c) => { inRange.style.opacity = 1; await drawIn(inRange, 600, c); await show(c, W6); } }
    ];
    const fN0 = Math.atan2(-hg, xN - Cx) / RAD + 360, fF0 = Math.atan2(-hg, xF - Cx) / RAD + 360;
    return [
      { cap: `The rafter ${T('AC=6.0')} m makes ${T('28^\\circ')} with the ceiling beam at ${T('A')}.`, run: setup },
      { cap: `The 3.5 m strut is hinged at ${T('C')}. Its foot can only be on this circle: it <b>swings like a compass</b> …`, run: async (c) => { actor.style.opacity = 1; circ.style.opacity = 0.6; await tween(c, 1800, (t) => { const f = fN0 + (fF0 - fN0) * t, pts = []; for (let q = fN0; q <= f + 0.01; q += 2) { const p = P(Cx + a * cosD(q), Cy + a * sinD(q)); pts.push(p[0].toFixed(1) + ',' + p[1].toFixed(1)); } trace.setAttribute('points', pts.join(' ')); setActor(f); }); hide(actor); } },
      { cap: `… and rests on the beam in <b>two</b> places, ${T(c2('D_1'))} and ${T(c1('D_2'))}. ${T(`h=6.0\\sin28^\\circ\\approx${fx(hg, 1)}<3.5<6.0`)}: two positions.`, run: async (c) => { sN.style.opacity = sF.style.opacity = 1; await both(c); await hStep(c); } },
      { cap: `In ${T('\\triangle ACD')}: ${T(`\\sin D=\\dfrac{6.0\\sin28^\\circ}{3.5}\\approx${fx(k, 4)}`)}, so ${T(`D\\approx${fx(Dac, 1)}^\\circ`)} or ${T(`${fx(Dob, 1)}^\\circ`)}.`, run: angStep },
      { cap: `${T(`D=${fx(Dac, 1)}^\\circ`)} (the far foot): ${T(`\\angle C=${fx(Cac, 1)}^\\circ`)}, ${T(`AD=\\dfrac{3.5\\sin${fx(Cac, 1)}^\\circ}{\\sin28^\\circ}\\approx${fx(dFar, 1)}`)} m.`, run: async (c) => { await show(c, fF); await show(c, dimF); await show(c, W4); } },
      { cap: `${T(`D=${fx(Dob, 1)}^\\circ`)} (the near foot): ${T(`\\angle C=${fx(Cob, 1)}^\\circ`)}, ${T(`AD=\\dfrac{3.5\\sin${fx(Cob, 1)}^\\circ}{\\sin28^\\circ}\\approx${fx(dNear, 1)}`)} m.`, run: async (c) => { await show(c, fN); await show(c, dimN); await show(c, W5); } },
      { cap: `The foot of the strut can be about <b>${fx(dNear, 1)} m</b> or <b>${fx(dFar, 1)} m</b> from ${T('A')}.`, run: (c) => show(c, W6) }
    ];
  }
};

/* =============================== Stand Up Break =============================== */
const ssaSolve = (A, a, b) => { const k = b * sinD(A) / a, B1 = asinD(k), B2 = 180 - B1; return { k, B1, B2 }; };
standup('u3l7', {
  intro: 'At your whiteboard: sketch it, count the triangles with h = b sin A, then find every possible angle.',
  levels: {
    BEG: (r) => { // how many triangles?
      const kind = r.pick(['0', '1r', '2', '1b']);
      let A, b, a;
      if (kind === '1r') { A = 30; b = r.pick([8, 16, 18, 20]); a = b / 2; }
      else {
        A = r.pick([25, 35, 40, 45, 55, 60]); b = r.pick([8, 9, 14, 15, 16, 18, 20]); const hh = b * sinD(A);
        a = kind === '0' ? Math.max(1, Math.floor(hh - 0.6)) : kind === '2' ? Math.round(hh + (b - hh) / 2) : b + r.int(1, 4);
        if (kind === '2' && !(a > hh + 0.05 && a < b)) a = +(hh + (b - hh) / 2).toFixed(1);
      }
      const hh = b * sinD(A), n = ROWN[caseRow(A, a, b)];
      const cmp = n === 0 ? `${fz(a, 1)}<${fz(hh, 2)}` : caseRow(A, a, b) === 1 ? `a=h` : n === 2 ? `${fz(hh, 2)}<${fz(a, 1)}<${b}` : `${fz(a, 1)}\\ge${b}`;
      return { text: `In ${T('\\triangle ABC')}, ${T(`\\angle A=${A}^\\circ`)}, ${T(`b=${b}`)} cm and ${T(`a=${fz(a, 1)}`)} cm. How many triangles are possible?`, q: '',
        a: [`h=${b}\\sin${A}^\\circ\\approx${fz(hh, 2)}`, cmp, `\\text{${n} triangle${n === 1 ? '' : 's'}${n === 1 && caseRow(A, a, b) === 1 ? ' (right)' : ''}}`] };
    },
    PRG: (r) => { // both possible angles B
      const A = r.pick([28, 37, 41, 44, 52, 57]), b = r.pick([9, 11, 13, 17, 19]), hh = b * sinD(A);
      const a = Math.round((hh + (b - hh) * (0.3 + 0.4 * Math.random())) * 10) / 10, { k, B1, B2 } = ssaSolve(A, a, b);
      return { text: `In ${T('\\triangle ABC')}, ${T(`\\angle A=${A}^\\circ`)}, ${T(`a=${fz(a, 1)}`)} cm and ${T(`b=${b}`)} cm. Determine all possible measures of ${T('\\angle B')}, to the nearest degree.`, q: '',
        a: [`h\\approx${fz(hh, 2)}<${fz(a, 1)}<${b}:\\ \\text{two}`, `\\sin B=\\dfrac{${b}\\sin${A}^\\circ}{${fz(a, 1)}}\\approx${fx(k, 4)}`, `B\\approx${fx(B1, 0)}^\\circ\\ \\text{or}\\ B\\approx${fx(B2, 0)}^\\circ`] };
    },
    MAS: (r) => { // solve both triangles
      const A = r.pick([26, 31, 38, 43, 49]), b = r.pick([12, 14, 16, 21]), hh = b * sinD(A);
      const a = Math.round((hh + (b - hh) * (0.35 + 0.3 * Math.random())) * 10) / 10, { k, B1, B2 } = ssaSolve(A, a, b);
      const C1 = 180 - A - B1, C2 = 180 - A - B2, cc1 = a * sinD(C1) / sinD(A), cc2 = a * sinD(C2) / sinD(A);
      return { text: `Solve all possible triangles ${T('ABC')} with ${T(`\\angle A=${A}^\\circ`)}, ${T(`a=${fz(a, 1)}`)} cm and ${T(`b=${b}`)} cm. Angles to the nearest degree, sides to the nearest tenth.`, q: '',
        a: [`\\sin B\\approx${fx(k, 4)}:\\ B_1\\approx${fx(B1, 1)}^\\circ,\\ B_2\\approx${fx(B2, 1)}^\\circ`, `\\text{1: }B\\approx${fx(B1, 0)}^\\circ,\\ C\\approx${fx(C1, 0)}^\\circ,\\ c\\approx${fx(cc1, 1)}`, `\\text{2: }B\\approx${fx(B2, 0)}^\\circ,\\ C\\approx${fx(C2, 0)}^\\circ,\\ c\\approx${fx(cc2, 1)}`] };
    }
  }
});

/* =============================== mount =============================== */
mountField();
mountStatics();
export const explainers = mountExplainers({ fixers, supp, swing, six, decide, solve2, ferry });
export const _test = { fx, fz, caseRow, SSAFig, SW, SV, WP, SIX };
