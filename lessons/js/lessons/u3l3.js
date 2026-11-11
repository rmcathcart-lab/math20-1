/* Math 20-1 · Unit 3 · Lesson 3 — The CAST Rule: Signs and Solving for Angles.
 * Warm-up (The Kaleidoscope: a ladybug at (4, 3) between mirrors on the axes; its twins sit at the same distance in
 * every quadrant; the y-axis twin is at 180° − 37° = 143°), and the explainers:
 *   castSigns (an arm sweeps through the quadrants: signs of x and y fill the sign table and the CAST letters light;
 *     sin / cos / tan sweeps paint each quadrant + or −; Example 1(b), 1(c) checks),
 *   mirror (one reference triangle reflected into all four quadrants, same size, CAST signs; Example 2(a)–(f) checks:
 *     ratio = ± ratio of θR, and the other angle with the same ratio),
 *   otherRatios (two clues light mini CAST tiles until one quadrant is left; the known line meets the circle of
 *     radius r at P; Pythagoras gives the third side with its sign; Examples 3, 4(a), 4(b) checks),
 *   twoAnswers (STAR: y = 0.6r cuts the circle in two terminal arms with the same height, CAST quadrants light up,
 *     same θR, two answers; the same for cos (vertical line) and tan (line through the origin); Example 5 checks),
 *   placeR (θR placed in each quadrant: the arm on the circle and hops on a 0°–360° strip from 0°, 180°, 360°;
 *     why sin⁻¹ of a negative number is not used),
 *   bounds (a horizontal line slides up: 2, 2, 1, 0 crossings; tan always 2; Example 6 checks with the quadrantal table),
 *   isolate (isolate the ratio like x, then CAST and a restricted interval; Example 7 checks),
 *   pedal (a bicycle crank, h = 17 sin θ: the line h = −6 meets the pedal's circle twice, h = 20 never; Example 8).
 * Colours: terminal arm / θ in the course accent (#7a1f3d), reference angle θR amber, positive green, negative red,
 * the "same value" line blue. */
import {
  h, tex, add, box, Graph, NumberLine, stamp, stampIn, mountExplainers, pop, fadeIn, sleep, tween,
  svgEl, pulse, drawIn, anim, arrowHead, shake, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const ARM = COLORS.brand, REF = COLORS.amber, POS = COLORS.green, NEG = COLORS.red, LN = COLORS.blue, GRAY = COLORS.gray;
const cA = (s) => `\\textcolor{${ARM}}{${s}}`, cR = (s) => `\\textcolor{${REF}}{${s}}`, cL = (s) => `\\textcolor{${LN}}{${s}}`;
const cP = (s) => `\\textcolor{${POS}}{${s}}`, cN = (s) => `\\textcolor{${NEG}}{${s}}`;
const RAD = Math.PI / 180;
const r1 = (v) => (Math.round(v * 10 + 1e-9) / 10).toFixed(1);   // nearest tenth, keeps ".0"
const r2 = (v) => (Math.round(v * 100 + 1e-9) / 100).toFixed(2);
const r3 = (v) => { const s = (Math.round(v * 1000) / 1000).toFixed(3).replace(/0+$/, '').replace(/\.$/, ''); return s === '-0' ? '0' : s; };
const r4 = (v) => (Math.round(v * 10000) / 10000).toFixed(4);
const QN = ['', 'I', 'II', 'III', 'IV'], LET = ['', 'A', 'S', 'T', 'C'];
const POSQ = { sin: [1, 2], cos: [1, 4], tan: [1, 3] };
const LETS = { sin: 'S and A', cos: 'A and C', tan: 'A and T' };
const FN = { sin: Math.sin, cos: Math.cos, tan: Math.tan };
const quadOf = (t) => { t = ((t % 360) + 360) % 360; return t < 90 ? 1 : t < 180 ? 2 : t < 270 ? 3 : 4; };
const refOf = (t) => [t, 180 - t, t - 180, 360 - t][quadOf(t) - 1];
const placeQ = (R, q) => [R, 180 - R, 180 + R, 360 - R][q - 1];
const sgnQ = (f, q) => (POSQ[f].includes(q) ? 1 : -1);
const quadsFor = (f, s) => (s > 0 ? POSQ[f] : [1, 2, 3, 4].filter((q) => !POSQ[f].includes(q)));
const qList = (qs) => qs.map((q) => QN[q]).join(' and ');
/** solve f θ = a for 0 ≤ θ < 360 (a not 0 or ±1) → { R, qs, ts } */
function solveT(f, a) {
  const inv = f === 'sin' ? Math.asin : f === 'cos' ? Math.acos : Math.atan;
  const R = inv(Math.abs(a)) / RAD, qs = quadsFor(f, Math.sign(a));
  return { R, qs, ts: qs.map((q) => placeQ(R, q)) };
}
/** "180° − 24.83°" style TeX for placing θR (given as a TeX number) in quadrant q */
const placeTex = (q, Rs) => [`${Rs}^\\circ`, `180^\\circ-${Rs}^\\circ`, `180^\\circ+${Rs}^\\circ`, `360^\\circ-${Rs}^\\circ`][q - 1];
const trig = (f, t) => FN[f](t * RAD);

const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
const panel = (stage, x, y, w, hh, title, cls = '') => div(stage, 'u3l3-panel ' + cls, title ? `<div class="u3l3-ph">${title}</div>` : '', x, y, w, hh);
const lineIn = (p, html, cls = '') => { const d = h('div', 'u3l3-line ' + cls, html); p.appendChild(d); hide(d); return d; };
const sg = (s) => `<span class="u3l3-sg ${s > 0 ? 'u3l3-sg-p' : 'u3l3-sg-m'}">${s > 0 ? '+' : '−'}</span>`;

/* ====================================================================================================
 * The circle picture: a Graph with no grid, the circle of radius r (one unit), quadrant tiles and CAST letters.
 * ==================================================================================================== */
class Wheel {
  constructor(stage, o) {
    const lim = this.lim = o.lim || 1.3;
    const G = this.G = new Graph(stage, { x: o.x, y: o.y, width: o.size, height: o.size, xmin: -lim, xmax: lim, ymin: -lim, ymax: lim, grid: false, numbers: false, pad: o.pad ?? 26 });
    const [ox, oy] = G.toPx(0, 0), [x0, y0] = G.toPx(-lim, lim), [x1, y1] = G.toPx(lim, -lim);
    this.O = [ox, oy]; this.u = G.ux;
    const R = { 1: [ox, y0, x1 - ox, oy - y0], 2: [x0, y0, ox - x0, oy - y0], 3: [x0, oy, ox - x0, y1 - oy], 4: [ox, oy, x1 - ox, y1 - oy] };
    this.tiles = {}; this.lets = {};
    for (const q of [1, 2, 3, 4]) { const [rx, ry, rw, rh] = R[q]; this.tiles[q] = svgEl('rect', { class: 'u3l3-tile', x: rx, y: ry, width: rw, height: rh }, G.layers.bg); }
    if (o.circle !== false) this.circ = svgEl('circle', { class: 'u3l3-circ', cx: ox, cy: oy, r: this.u }, G.layers.grid);
    if (o.letters !== false) for (const q of [1, 2, 3, 4]) {
      const sx = q === 1 || q === 4 ? 1 : -1, sy = q <= 2 ? 1 : -1, k = lim - 0.15;
      this.lets[q] = G.label(sx * k, sy * k, LET[q], { cls: 'u3l3-ql' });
      G.label(sx * k, sy * (k - 0.2), QN[q], { cls: 'u3l3-qn' });
    }
  }
  P(t, rr = 1) { return this.G.toPx(rr * Math.cos(t * RAD), rr * Math.sin(t * RAD)); }
  /** tile states: { q: 'pos' | 'neg' | 'cand' | 'ok' | null } (letters follow: green for pos/ok, red for neg) */
  paint(map) {
    for (const q of [1, 2, 3, 4]) {
      const k = map[q], t = this.tiles[q];
      t.classList.remove('u3l3-t-pos', 'u3l3-t-neg', 'u3l3-t-cand', 'u3l3-t-ok'); if (k) t.classList.add('u3l3-t-' + k);
      const L = this.lets[q]; if (L) { L.classList.toggle('u3l3-ql-pos', k === 'pos' || k === 'ok'); L.classList.toggle('u3l3-ql-neg', k === 'neg'); }
    }
  }
  /** one tile only (the letters are left alone) */
  tile(q, k) { const t = this.tiles[q]; t.classList.remove('u3l3-t-pos', 'u3l3-t-neg', 'u3l3-t-cand', 'u3l3-t-ok'); if (k) t.classList.add('u3l3-t-' + k); }
  async light(c, map) { this.paint(map); await Promise.all(Object.keys(map).filter((q) => map[q] && this.lets[q]).map((q) => pop(c, this.lets[q], 420))); }
  /** a terminal arm from the origin to angle t (degrees) on the circle; g.set(t) moves it */
  arm(t, o = {}) {
    const color = o.color || ARM, g = svgEl('g', { class: 'u3l3-armg' }, this.G.layers.top);
    const ln = svgEl('path', { class: 'bk-stroke', fill: 'none', stroke: color, 'stroke-width': o.w || 4.5, 'stroke-linecap': 'round' }, g);
    if (o.dash) ln.setAttribute('stroke-dasharray', o.dash);
    const dot = o.dot === false ? null : svgEl('circle', { class: 'bk-end', r: o.r || 7, fill: color, stroke: '#fff', 'stroke-width': 2 }, g);
    g.rr = o.rr || 1;
    g.set = (tt) => { g.t = tt; const [ox, oy] = this.O, [px, py] = this.P(tt, g.rr); ln.setAttribute('d', `M${ox} ${oy}L${px.toFixed(1)} ${py.toFixed(1)}`); if (dot) { dot.setAttribute('cx', px); dot.setAttribute('cy', py); } };
    g.set(t); return g;
  }
  /** an arc of radius rho px from angle a to b (counterclockwise when b > a), arrowhead at b unless arrow: false */
  arc(a, b, rho, o = {}) {
    const color = o.color || ARM, g = svgEl('g', {}, this.G.layers.top);
    const p = svgEl('path', { class: 'bk-stroke', fill: 'none', stroke: color, 'stroke-width': o.w || 3, 'stroke-linecap': 'round' }, g);
    const hd = svgEl('g', { class: o.arrow === false ? '' : 'bk-end' }, g);
    g.set = (aa, bb) => {
      const [ox, oy] = this.O, pt = (t) => [ox + rho * Math.cos(t * RAD), oy - rho * Math.sin(t * RAD)], span = bb - aa;
      hd.innerHTML = '';
      if (Math.abs(span) < 0.3) { p.setAttribute('d', 'M0 0'); p.style.display = 'none'; return; }
      p.style.display = '';
      const s = pt(aa), e = pt(bb), large = Math.abs(span) > 180 ? 1 : 0, sweep = span > 0 ? 0 : 1;
      p.setAttribute('d', `M${s[0].toFixed(1)} ${s[1].toFixed(1)}A${rho} ${rho} 0 ${large} ${sweep} ${e[0].toFixed(1)} ${e[1].toFixed(1)}`);
      if (o.arrow !== false && Math.abs(span) * RAD * rho > 16) { const d = span > 0 ? 1 : -1, tt = bb * RAD; arrowHead(hd, e[0], e[1], -Math.sin(tt) * d, -Math.cos(tt) * d, { width: 2.6, color }); }
    };
    g.set(a, b); return g;
  }
  refSpan(t) { const q = quadOf(t); return q === 1 ? [0, t] : q === 2 ? [t, 180] : q === 3 ? [180, t] : [t, 360]; }
  refArc(t, rho = 46) { const [a, b] = this.refSpan(t); return this.arc(a, b, rho, { color: REF, arrow: false, w: 4 }); }
  /** label at angle t, distance rr (graph units) from the origin */
  labAt(t, rr, html, cls = '') { return this.G.label(rr * Math.cos(t * RAD), rr * Math.sin(t * RAD), html, { cls: 'u3l3-alab ' + cls }); }
  refLab(t, Rtex, rr = 0.47) { const [a, b] = this.refSpan(t); return this.labAt((a + b) / 2, rr, T(cR(Rtex)), 'u3l3-alab-sm'); }
  /** the reference triangle O, (x, 0), (x, y) in graph units; pg.setXY(x, y) */
  tri(x, y, o = {}) {
    const color = o.color || REF;
    const pg = svgEl('polygon', { fill: color, 'fill-opacity': o.op ?? 0.18, stroke: color, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, this.G.layers.data);
    if (o.dash) pg.setAttribute('stroke-dasharray', o.dash);
    pg.setXY = (xx, yy) => { pg.x = xx; pg.y = yy; const a = this.O, b = this.G.toPx(xx, 0), c = this.G.toPx(xx, yy); pg.setAttribute('points', [a, b, c].map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ')); };
    pg.setXY(x, y); return pg;
  }
  /** the blue "same value" line: kind 'h' (y = a), 'v' (x = a) or 's' (through the origin with slope a) */
  vline(kind, a, o = {}) {
    const p = svgEl('path', { class: 'bk-stroke', fill: 'none', stroke: o.color || LN, 'stroke-width': o.w || 3.5, 'stroke-dasharray': o.dash ?? '10 7', 'stroke-linecap': 'round' }, this.G.layers.data);
    p.set = (aa) => {
      const L = this.lim; let A, B;
      if (kind === 'h') { A = [-L, aa]; B = [L, aa]; } else if (kind === 'v') { A = [aa, -L]; B = [aa, L]; }
      else { const k = Math.abs(aa) <= 1 ? L : L / Math.abs(aa); A = [-k, -k * aa]; B = [k, k * aa]; }
      const [ax, ay] = this.G.toPx(...A), [bx, by] = this.G.toPx(...B); p.setAttribute('d', `M${ax.toFixed(1)} ${ay.toFixed(1)}L${bx.toFixed(1)} ${by.toFixed(1)}`);
    };
    p.set(a); return p;
  }
  dot(t, color = ARM, rr = 1) { const [px, py] = this.P(t, rr); return svgEl('circle', { cx: px, cy: py, r: 8, fill: color, stroke: '#fff', 'stroke-width': 2.2 }, this.G.layers.top); }
}
/** a rotation to angle t: arm turning from t0 with its rotation arc (radius rho) */
async function turn(c, arm, arc, t0, t, ms = 800) { await tween(c, ms, (k) => { const tt = t0 + (t - t0) * k; arm.set(tt); if (arc) arc.set(0, tt); }); }

/* ====================================================================================================
 * Warm-up: The Kaleidoscope. A ladybug at (4, 3) on a circle of radius 5; mirrors on both axes.
 * ==================================================================================================== */
function bugShape(parent, px, py, sx, sy, rot) {
  const g = svgEl('g', { class: 'u3l3-bug', transform: `translate(${px.toFixed(1)} ${py.toFixed(1)}) scale(${sx} ${sy}) rotate(${rot.toFixed(2)})` }, parent);
  svgEl('ellipse', { cx: 0, cy: 3, rx: 14, ry: 16, fill: '#d6332b', stroke: '#5a1410', 'stroke-width': 2 }, g);
  svgEl('circle', { cx: 0, cy: -14, r: 7.5, fill: '#1c2230' }, g);
  svgEl('line', { x1: 0, y1: -12, x2: 0, y2: 19, stroke: '#5a1410', 'stroke-width': 2 }, g);
  [[-6, -2, 3.2], [6, -2, 3.2], [-7, 9, 3], [7, 9, 3], [0, 14, 2.6]].forEach(([x, y, r]) => svgEl('circle', { cx: x, cy: y, r, fill: '#1c2230' }, g));
  [[-3, -20, -7, -26], [3, -20, 7, -26]].forEach(([a, b, c, d]) => svgEl('line', { x1: a, y1: b, x2: c, y2: d, stroke: '#1c2230', 'stroke-width': 2, 'stroke-linecap': 'round' }, g));
  return g;
}
function mountKaleidoscope() {
  const host = document.getElementById('u3l3-kal'); if (!host) return;
  const u = 36, W = 520, H = 440, pad = 20, xm = (W - 2 * pad) / u / 2, ym = (H - 2 * pad) / u / 2;
  const G = new Graph(host, { width: W, height: H, xmin: -xm, xmax: xm, ymin: -ym, ymax: ym, pad, fontSize: 14, xlabels: 2, ylabels: 2 });
  const [ox, oy] = G.toPx(0, 0), [lx] = G.toPx(-xm, 0), [rx] = G.toPx(xm, 0), [, ty] = G.toPx(0, ym), [, by] = G.toPx(0, -ym);
  // mirrors (glass strips on the axes) and the track
  [[lx + 4, oy, rx - 4, oy], [ox, ty + 4, ox, by - 4]].forEach(([a, b, c, d]) => { svgEl('line', { class: 'u3l3-mirror', x1: a, y1: b, x2: c, y2: d }, G.layers.grid); svgEl('line', { class: 'u3l3-mirror2', x1: a, y1: b, x2: c, y2: d }, G.layers.grid); });
  svgEl('circle', { class: 'u3l3-circ-d', cx: ox, cy: oy, r: 5 * u }, G.layers.grid);
  const A0 = Math.atan2(3, 4) / RAD;            // 36.87°
  const twins = [
    { k: 'o', x: 4, y: 3, sx: 1, sy: 1, ang: A0 },
    { k: 'y', x: -4, y: 3, sx: -1, sy: 1, ang: 180 - A0 },
    { k: 'x', x: 4, y: -3, sx: 1, sy: -1, ang: 360 - A0 },
    { k: 'b', x: -4, y: -3, sx: -1, sy: -1, ang: 180 + A0 }
  ];
  const angG = svgEl('g', {}, G.layers.top), bugG = svgEl('g', {}, G.layers.top);
  twins.forEach((tw) => {
    const [px, py] = G.toPx(tw.x, tw.y);
    tw.arm = svgEl('line', { class: 'u3l3-wang', x1: ox, y1: oy, x2: px, y2: py, stroke: ARM, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, angG);
    const big = tw.ang > 90, rho = big ? 26 + (tw.k === 'b' ? 8 : tw.k === 'x' ? 16 : 0) : 46;
    const e = [ox + rho * Math.cos(tw.ang * RAD), oy - rho * Math.sin(tw.ang * RAD)];
    tw.arc = svgEl('path', { class: 'u3l3-wang', d: `M${ox + rho} ${oy}A${rho} ${rho} 0 ${tw.ang > 180 ? 1 : 0} 0 ${e[0].toFixed(1)} ${e[1].toFixed(1)}`, fill: 'none', stroke: ARM, 'stroke-width': 2.5 }, angG);
    tw.bug = bugShape(bugG, px, py, tw.sx, tw.sy, -A0);
    if (tw.k !== 'o') tw.bug.classList.add('u3l3-twin');
    const pos = tw.y > 0 ? (tw.x > 0 ? 'ne' : 'nw') : (tw.x > 0 ? 'se' : 'sw');
    tw.coord = G.label(tw.x, tw.y, T(`(${tw.x},\\ ${tw.y})`), { pos, cls: 'u3l3-wlab', gap: 16 });
    tw.angLab = G.label(tw.x * 0.55, tw.y * 0.55, T(`\\approx${Math.round(tw.ang)}^\\circ`), { cls: 'u3l3-wlab u3l3-wang', pos: tw.y > 0 ? (tw.x > 0 ? 'nw' : 'ne') : (tw.x > 0 ? 'sw' : 'se'), gap: 4 });
    tw.angLab.style.color = ARM;
    if (tw.k !== 'o') tw.coord.style.opacity = 0;
  });
  const st = { y: false, x: false, b: false, ang: false };
  const bY = document.getElementById('u3l3-my'), bX = document.getElementById('u3l3-mx'), bB = document.getElementById('u3l3-mb'), bA = document.getElementById('u3l3-mang');
  const paint = () => {
    const vis = { o: true, y: st.y || st.b, x: st.x || st.b, b: st.b };
    twins.forEach((tw) => {
      if (tw.k !== 'o') { tw.bug.classList.toggle('u3l3-on', vis[tw.k]); tw.coord.style.opacity = vis[tw.k] ? 1 : 0; tw.coord.style.transition = 'opacity .35s'; }
      const a = st.ang && vis[tw.k]; [tw.arm, tw.arc, tw.angLab].forEach((e) => e.classList.toggle('u3l3-on', a));
    });
    bY.classList.toggle('u3l3-pon', st.y); bX.classList.toggle('u3l3-pon', st.x); bB.classList.toggle('u3l3-pon', st.b); bA.classList.toggle('u3l3-pon', st.ang);
  };
  bY.addEventListener('click', () => { st.y = !st.y; paint(); });
  bX.addEventListener('click', () => { st.x = !st.x; paint(); });
  bB.addEventListener('click', () => { st.b = !st.b; paint(); });
  bA.addEventListener('click', () => { st.ang = !st.ang; paint(); });
  paint();
}

/* =============================== explainer 1: CAST signs =============================== */
const SWEEP = [35, 145, 215, 325];
const SWEEP_CAP = [
  `All three ratios are <b>positive</b>: <b>A</b>.`,
  `Only sine (it uses ${T('y')}) is positive: <b>S</b>.`,
  `Both negative, so ${T('\\tfrac{y}{x}')} is positive: only tangent, <b>T</b>.`,
  `Only cosine (it uses ${T('x')}) is positive: <b>C</b>.`
];
const SX = [0, 1, -1, -1, 1], SY = [0, 1, 1, -1, -1];
const CS_C = [{ t: 162, f: 'sin', n: '(i)' }, { t: 251, f: 'cos', n: '(ii)' }, { t: 304, f: 'tan', n: '(iii)' }, { t: 200, f: 'tan', n: '(iv)' }];
const ONLY = ['', 'all three are positive', 'only S (sine) is positive', 'only T (tangent) is positive', 'only C (cosine) is positive'];
const castSigns = {
  title: 'Where is each ratio positive?',
  height: 430, minW: 940,
  choices: [{ v: 'sweep', label: 'Sweep the arm round' }, { v: 'sin', label: T('\\sin\\theta') }, { v: 'cos', label: T('\\cos\\theta') }, { v: 'tan', label: T('\\tan\\theta') },
    { sep: 'Check:' }, { v: 'ex1b', label: 'Example 1(b)' }, { v: 'ex1c', label: 'Example 1(c)' }],
  ask: (v) => ({
    sweep: 'Example 1(a): which ratios are positive in each quadrant?', sin: `Where is ${T('\\sin\\theta')} positive, and where is it negative?`,
    cos: `Where is ${T('\\cos\\theta')} positive, and where is it negative?`, tan: `Where is ${T('\\tan\\theta')} positive, and where is it negative?`,
    ex1b: 'Example 1(b): in which quadrant(s) does θ terminate?', ex1c: 'Example 1(c): positive or negative? Name the quadrant first.'
  })[v],
  make(stage, v, ex) {
    const W = new Wheel(stage, { x: 8, y: 2, size: 426 }), PX = 456, PW = ex.W - PX - 8;
    const pn = panel(stage, PX, 6, PW, 418, '');
    const arm = hide(W.arm(SWEEP[0])), rot = hide(W.arc(0, 0, 30));
    const xLeg = svgEl('path', { fill: 'none', 'stroke-width': 6, 'stroke-linecap': 'round' }, W.G.layers.top), yLeg = svgEl('path', { fill: 'none', 'stroke-width': 4, 'stroke-dasharray': '8 6' }, W.G.layers.top);
    W.G.layers.top.insertBefore(xLeg, arm); W.G.layers.top.insertBefore(yLeg, arm); hide(xLeg); hide(yLeg);
    const legs = (t) => { const x = Math.cos(t * RAD), y = Math.sin(t * RAD), O = W.O, A = W.G.toPx(x, 0), B = W.G.toPx(x, y);
      xLeg.setAttribute('d', `M${O[0]} ${O[1]}L${A[0].toFixed(1)} ${A[1].toFixed(1)}`); yLeg.setAttribute('d', `M${A[0].toFixed(1)} ${A[1].toFixed(1)}L${B[0].toFixed(1)} ${B[1].toFixed(1)}`);
      xLeg.setAttribute('stroke', x >= 0 ? POS : NEG); yLeg.setAttribute('stroke', y >= 0 ? POS : NEG); };
    const fl = lineIn(pn, T('\\sin\\theta=\\tfrac{y}{r},\\quad\\cos\\theta=\\tfrac{x}{r},\\quad\\tan\\theta=\\tfrac{y}{x},\\quad r>0'), 'u3l3-line-key');
    fl.style.textAlign = 'center';

    if (v === 'sweep') {
      const rd = lineIn(pn, '', ''); rd.style.textAlign = 'center';
      const tb = div(pn, 'u3l3-st', ''); tb.style.marginTop = '8px';
      const cell = (html, cls = '') => { const d = h('div', cls, html); tb.appendChild(d); return d; };
      ['', 'I', 'II', 'III', 'IV'].forEach((s) => cell(s, 'u3l3-sth'));
      const vals = {};
      ['sin', 'cos', 'tan'].forEach((f) => { cell(T(`\\${f}\\theta`), 'u3l3-sth'); vals[f] = [0, 1, 2, 3, 4].map((q) => (q ? hide(cell(sgnQ(f, q) > 0 ? '+' : '−', 'u3l3-stv ' + (sgnQ(f, q) > 0 ? 'u3l3-p' : 'u3l3-m'))) : null)); });
      const note = lineIn(pn, `<b>C</b> · <b>A</b> · <b>S</b> · <b>T</b>, counterclockwise from IV. <i>All Students Take Calculus.</i>`, 'u3l3-line-ans u3l3-line-sm'); note.style.marginTop = '12px';
      const steps = [{ cap: `${T('r')} is a distance, so ${T('r>0')} always. The signs of the three ratios come only from the signs of ${T('x')} and ${T('y')}.`, run: (c) => pulse(c, fl, 1.04) }];
      SWEEP.forEach((t, i) => {
        const q = i + 1, t0 = i ? SWEEP[i - 1] : 0;
        steps.push({
          cap: `Quadrant ${QN[q]}: ${T(`x${SX[q] > 0 ? '>' : '<'}0`)} and ${T(`y${SY[q] > 0 ? '>' : '<'}0`)}. ${SWEEP_CAP[i]}`,
          run: async (c) => {
            if (!i) { arm.style.opacity = 1; rot.style.opacity = 1; xLeg.style.opacity = 1; yLeg.style.opacity = 1; }
            [1, 2, 3, 4].forEach((k) => W.tile(k, k === q ? 'cand' : null));
            await tween(c, i ? 700 : 600, (k) => { const tt = t0 + (t - t0) * k; arm.set(tt); rot.set(0, tt); legs(tt); });
            rd.innerHTML = `Quadrant ${QN[q]}: &nbsp;${T('x')} ${sg(SX[q])} &nbsp; ${T('y')} ${sg(SY[q])}`; rd.style.opacity = 1;
            for (const f of ['sin', 'cos', 'tan']) await pop(c, vals[f][q], 260);
            W.lets[q].classList.add('u3l3-ql-pos'); await pop(c, W.lets[q], 420);
          }
        });
      });
      steps.push({ cap: `Read the letters counterclockwise from Quadrant IV: <b>C, A, S, T</b>. The memory aid starts in Quadrant I: <i>All Students Take Calculus</i>.`,
        run: async (c) => { [1, 2, 3, 4].forEach((k) => W.tile(k, null)); for (const q of [1, 2, 3, 4]) W.lets[q].classList.add('u3l3-ql-pos'); await show(c, note); for (const q of [4, 1, 2, 3]) await pulse(c, W.lets[q], 1.35, 420); } });
      return steps;
    }

    if (v === 'sin' || v === 'cos' || v === 'tan') {
      const f = v, pq = POSQ[f];
      const why = { sin: `${T('\\sin\\theta=\\tfrac{y}{r}')} and ${T('r>0')}, so ${T('\\sin\\theta')} has the <b>sign of ${T('y')}</b>.`,
        cos: `${T('\\cos\\theta=\\tfrac{x}{r}')} and ${T('r>0')}, so ${T('\\cos\\theta')} has the <b>sign of ${T('x')}</b>.`,
        tan: `${T('\\tan\\theta=\\tfrac{y}{x}')} is positive when ${T('x')} and ${T('y')} have the <b>same sign</b>.` }[f];
      const rd = lineIn(pn, '', 'u3l3-eqbig'); rd.style.opacity = 0;
      const res = lineIn(pn, `${T(`\\${f}\\theta>0`)}: Quadrants <b>${qList(pq)}</b> (${LETS[f]})<br>${T(`\\${f}\\theta<0`)}: Quadrants <b>${qList(quadsFor(f, -1))}</b>`, 'u3l3-line-ans');
      const sweepTo = 358;
      return [
        { cap: why, run: (c) => pulse(c, fl, 1.04) },
        { cap: `Sweep the arm all the way round and watch the sign of ${T(`\\${f}\\theta`)}.`,
          run: async (c) => {
            arm.style.opacity = 1; rot.style.opacity = 1; xLeg.style.opacity = 1; yLeg.style.opacity = 1; rd.style.opacity = 1; let last = '';
            await tween(c, 3200, (k) => {
              const tt = 3 + (sweepTo - 3) * k; arm.set(tt); rot.set(0, tt); legs(tt);
              const map = {}; for (const q of [1, 2, 3, 4]) if (tt > (q - 1) * 90 + 2) map[q] = sgnQ(f, q) > 0 ? 'pos' : 'neg';
              const q = quadOf(tt), key = q + ':' + Object.keys(map).length;
              if (key !== last) { last = key; W.paint(map); rd.innerHTML = `${T(`\\${f}\\theta`)} ${sg(sgnQ(f, q))}`; }
            }, (t) => t);
          } },
        { cap: `So ${T(`\\${f}\\theta`)} is positive in Quadrants ${qList(pq)} (${LETS[f]}) and negative in the other two.`, run: async (c) => { await show(c, res); for (const q of pq) await pop(c, W.lets[q], 380); } }
      ];
    }

    if (v === 'ex1b') {
      const L1 = lineIn(pn, `(i) ${T('\\cos\\theta>0')}: &nbsp;<b>I or IV</b>`), L2 = lineIn(pn, `(ii) ${T('\\tan\\theta<0')}: &nbsp;<b>II or IV</b>`);
      const L3 = lineIn(pn, `(iii) ${T('\\sin\\theta<0')}: III or IV`), L4 = lineIn(pn, `&emsp;&emsp;and ${T('\\tan\\theta>0')}: I or III &nbsp;→ &nbsp;<b>III</b>`, 'u3l3-line-ans');
      return [
        { cap: `(i) ${T('\\cos\\theta>0')}: cosine is positive where ${T('x>0')}, right of the y-axis: Quadrants I and IV.`, run: async (c) => { await W.light(c, { 1: 'pos', 4: 'pos' }); await show(c, L1); } },
        { cap: `(ii) ${T('\\tan\\theta<0')}: tangent is negative where neither A nor T is: Quadrants II and IV.`, run: async (c) => { await W.light(c, { 2: 'neg', 4: 'neg' }); await show(c, L2); } },
        { cap: `(iii) First clue, ${T('\\sin\\theta<0')}: below the x-axis, Quadrant III or IV.`, run: async (c) => { await W.light(c, { 3: 'cand', 4: 'cand' }); await show(c, L3); } },
        { cap: `Second clue, ${T('\\tan\\theta>0')}: Quadrant I or III. Only <b>Quadrant III</b> fits both clues.`, run: async (c) => { await W.light(c, { 3: 'ok' }); await show(c, L4); } }
      ];
    }

    // ex1c: four angles, quadrant first
    const lines = CS_C.map((d) => { const q = quadOf(d.t), s = sgnQ(d.f, q); return lineIn(pn, `${d.n} ${T(`\\${d.f}${d.t}^\\circ`)}: Quadrant ${QN[q]}, ${LET[q]} → <b>${s > 0 ? 'positive' : 'negative'}</b>`, 'u3l3-line-sm'); });
    const tl = hide(W.labAt(0, 1.16, '', 'u3l3-c-arm'));
    return CS_C.map((d, i) => {
      const q = quadOf(d.t), s = sgnQ(d.f, q), t0 = i ? CS_C[i - 1].t : 0;
      return {
        cap: `${d.n} ${T(`${d.t}^\\circ`)} is in Quadrant ${QN[q]}, where ${ONLY[q]}. So ${T(`\\${d.f}${d.t}^\\circ`)} is <b>${s > 0 ? 'positive' : 'negative'}</b>.`,
        run: async (c) => {
          arm.style.opacity = 1; rot.style.opacity = 1; tl.style.opacity = 0;
          await turn(c, arm, rot, t0, d.t, 800);
          tl.innerHTML = T(cA(`${d.t}^\\circ`)); W.G.moveTo(tl, 1.16 * Math.cos(d.t * RAD), 1.16 * Math.sin(d.t * RAD)); await show(c, tl);
          await W.light(c, { [q]: s > 0 ? 'pos' : 'neg' }); await show(c, lines[i]);
        }
      };
    });
  }
};

/* =============================== explainer 2: one triangle, four quadrants =============================== */
const MI = {
  four: { label: 'One triangle, four quadrants' },
  a: { t: 132, f: 'cos', n: '(a)' }, b: { t: 214, f: 'sin', n: '(b)' }, c: { t: 297, f: 'tan', n: '(c)' }, d: { t: 349, f: 'sin', n: '(d)' },
  e: { t: 132, f: 'cos', n: '(e)', other: true }, f: { t: 128, f: 'tan', n: '(f)', other: true }
};
const refTexOf = (t) => { const q = quadOf(t), R = refOf(t); return [`${t}^\\circ`, `180^\\circ-${t}^\\circ=${R}^\\circ`, `${t}^\\circ-180^\\circ=${R}^\\circ`, `360^\\circ-${t}^\\circ=${R}^\\circ`][q - 1]; };
const mirror = {
  title: 'Same triangle, new signs',
  height: 440, minW: 940,
  choices: [{ v: 'four', label: MI.four.label }, { sep: 'Example 2 check:' },
    ...['a', 'b', 'c', 'd'].map((k) => ({ v: k, label: `${MI[k].n} ${T(`\\${MI[k].f}${MI[k].t}^\\circ`)}` })),
    { v: 'e', label: `(e) other angle, ${T('\\cos')}` }, { v: 'f', label: `(f) other angle, ${T('\\tan')}` }],
  ask: (v) => (v === 'four' ? `Why do ${T('30^\\circ')}, ${T('150^\\circ')}, ${T('210^\\circ')} and ${T('330^\\circ')} have ratios of the same size?`
    : MI[v].other ? `Example 2${MI[v].n}: the other angle ${T('\\theta')}, ${T('0^\\circ\\le\\theta<360^\\circ')}, with ${T(`\\${MI[v].f}\\theta=\\${MI[v].f}${MI[v].t}^\\circ`)}.`
      : `Example 2${MI[v].n}: write ${T(`\\${MI[v].f}${MI[v].t}^\\circ`)} as the same ratio of its reference angle.`),
  make(stage, v, ex) {
    const W = new Wheel(stage, { x: 8, y: 2, size: 436 }), PX = 466, PW = ex.W - PX - 8;
    const pn = panel(stage, PX, 6, PW, 428, '');
    if (v === 'four') return mirrorFour(W, pn);
    const d = MI[v], t = d.t, f = d.f, q = quadOf(t), R = refOf(t), s = sgnQ(f, q), x = Math.cos(t * RAD), y = Math.sin(t * RAD);
    const arm = hide(W.arm(0)), rot = hide(W.arc(0, 0, 28)), tl = hide(W.labAt(t, 1.17, T(cA(`${t}^\\circ`)))), tr = hide(W.tri(x, y));
    const ra = hide(W.refArc(t, 52)), rl = hide(W.refLab(t, `${R}^\\circ`, 0.5));
    const ft = `\\${f}${t}^\\circ`, fR = `\\${f}${R}^\\circ`, v1 = trig(f, t);
    const L1 = lineIn(pn, `${T(`${t}^\\circ`)}: Quadrant <b>${QN[q]}</b>`), L2 = lineIn(pn, T(cR(`\\theta_R=${refTexOf(t)}`)));
    if (!d.other) {
      const ghost = hide(W.tri(Math.cos(R * RAD), Math.sin(R * RAD), { op: 0.06, dash: '7 5' })), garm = hide(W.arm(R, { color: GRAY, w: 3, dash: '8 6', dot: false }));
      const L3 = lineIn(pn, `Quadrant ${QN[q]}: ${ONLY[q]}, so ${T(ft)} is <b>${s > 0 ? 'positive' : 'negative'}</b>.`, 'u3l3-line-sm');
      const L4 = lineIn(pn, T(`${ft}=${s > 0 ? '' : '-'}${fR}`), 'u3l3-line-key u3l3-eqbig');
      const L5 = lineIn(pn, `Check: ${T(`${ft}\\approx${r4(v1)}`)}, &nbsp;${T(`${fR}\\approx${r4(trig(f, R))}`)}`, 'u3l3-line-sm');
      return [
        { cap: `${T(`${t}^\\circ`)} is in Quadrant ${QN[q]}.`, run: async (c) => { arm.style.opacity = 1; rot.style.opacity = 1; await turn(c, arm, rot, 0, t, 900); await show(c, tl); await show(c, L1); } },
        { cap: `Reference angle: ${T(cR(`\\theta_R=${refTexOf(t)}`))}, measured to the <b>x-axis</b>.`, run: async (c) => { await show(c, tr); ra.style.opacity = 1; await drawIn(ra, 500, c); await show(c, rl); await show(c, L2); } },
        { cap: `The same triangle at ${T(`${R}^\\circ`)} in Quadrant I: ${T(ft)} and ${T(fR)} have the <b>same size</b>.`,
          run: async (c) => { ghost.style.opacity = 1; garm.style.opacity = 1; const X = Math.cos(R * RAD), Y = Math.sin(R * RAD); await tween(c, 900, (k) => ghost.setXY(x + (X - x) * k, y + (Y - y) * k)); await drawIn(garm, 400, c); } },
        { cap: `In Quadrant ${QN[q]} ${ONLY[q]}, so ${T(ft)} is ${s > 0 ? 'positive' : 'negative'}: ${T(`${ft}=${s > 0 ? '' : '-'}${fR}`)}.`,
          run: async (c) => { await W.light(c, { [q]: s > 0 ? 'pos' : 'neg' }); await show(c, L3); await show(c, L4); await show(c, L5); } }
      ];
    }
    // the other angle with the same ratio
    const qs = quadsFor(f, s), q2 = qs.find((k) => k !== q), t2 = placeQ(R, q2), x2 = Math.cos(t2 * RAD), y2 = Math.sin(t2 * RAD);
    const tr2 = hide(W.tri(x, y)), arm2 = hide(W.arm(t2)), rot2 = hide(W.arc(0, t2, 40)), tl2 = hide(W.labAt(t2, 1.17, T(cA(`${t2}^\\circ`)))), ra2 = hide(W.refArc(t2, 52)), rl2 = hide(W.refLab(t2, `${R}^\\circ`, 0.5));
    const FN2 = { sin: 'Sine', cos: 'Cosine', tan: 'Tangent' }[f];
    const L3 = lineIn(pn, `${FN2} is ${s > 0 ? 'positive' : 'negative'} in Quadrants ${qList(qs)}.`, 'u3l3-line-sm');
    const L4 = lineIn(pn, T(`\\theta=${placeTex(q2, R)}=${t2}^\\circ`), 'u3l3-line-key u3l3-eqbig');
    const L5 = lineIn(pn, `Check: ${T(`\\${f}${t2}^\\circ\\approx${r4(trig(f, t2))}`)}, &nbsp;${T(`${ft}\\approx${r4(v1)}`)}`, 'u3l3-line-sm');
    const how = f === 'tan' ? ' The new arm points straight through the origin: the opposite point, the same slope.' : q2 === 3 || q === 3 ? ' Reflect the triangle in the x-axis.' : ' Reflect the triangle in the y-axis.';
    return [
      { cap: `${T(ft)}: ${T(`${t}^\\circ`)} is in Quadrant ${QN[q]} with ${T(cR(`\\theta_R=${R}^\\circ`))}, and ${T(`\\${f}`)} is ${s > 0 ? 'positive' : 'negative'} there.`,
        run: async (c) => { arm.style.opacity = 1; rot.style.opacity = 1; await turn(c, arm, rot, 0, t, 800); await show(c, tl); await show(c, tr); ra.style.opacity = 1; await drawIn(ra, 400, c); await show(c, rl); await show(c, L1); await show(c, L2); } },
      { cap: `${FN2} is ${s > 0 ? 'positive' : 'negative'} in Quadrants ${qList(qs)}. The other angle is in <b>Quadrant ${QN[q2]}</b>.`, run: async (c) => { await W.light(c, { [q]: s > 0 ? 'pos' : 'neg', [q2]: s > 0 ? 'pos' : 'neg' }); await show(c, L3); } },
      { cap: `Same reference angle in Quadrant ${QN[q2]}: ${T(`\\theta=${placeTex(q2, R)}=${t2}^\\circ`)}.${how}`,
        run: async (c) => { tr2.style.opacity = 1; await tween(c, 900, (k) => tr2.setXY(x + (x2 - x) * k, y + (y2 - y) * k)); arm2.style.opacity = 1; rot2.style.opacity = 1; await drawIn(arm2, 400, c); await drawIn(rot2, 500, c); await show(c, tl2); ra2.style.opacity = 1; await show(c, ra2); await show(c, rl2); await show(c, L4); } },
      { cap: `Check on the calculator: ${T(`\\${f}${t2}^\\circ\\approx${r4(trig(f, t2))}`)}, the same as ${T(ft)}.`, run: (c) => show(c, L5) }
    ];
  }
};
function mirrorFour(W, pn) {
  const R = 30, angs = [30, 150, 210, 330], X = Math.cos(R * RAD), Y = Math.sin(R * RAD);
  const tris = angs.map(() => hide(W.tri(X, Y))), arms = angs.map((t) => hide(W.arm(t))), refs = angs.map((t) => hide(W.refArc(t, 50)));
  const tls = angs.map((t) => hide(W.labAt(t, 1.17, T(cA(`${t}^\\circ`)))));
  const stk = angs.map((t, i) => { const q = i + 1, l = W.G.label(SX[q] * 0.45, SY[q] * 1.0, `${T('x')} ${sg(SX[q])} &nbsp;${T('y')} ${sg(SY[q])}`, { cls: 'u3l3-stk' }); return hide(l); });
  const rl = hide(W.refLab(30, '30^\\circ', 0.62));
  const tbl = h('table', 'u3l3-tbl'); tbl.style.margin = '4px auto 8px'; tbl.style.fontSize = '18px';
  tbl.innerHTML = `<tr><th>${T('\\theta')}</th><th>${T('\\sin\\theta')}</th><th>${T('\\cos\\theta')}</th><th>${T('\\tan\\theta')}</th></tr>` + angs.map((t) => `<tr><th>${T(`${t}^\\circ`)}</th>${['sin', 'cos', 'tan'].map((f) => `<td class="${trig(f, t) > 0 ? 'u3l3-p' : 'u3l3-m'}">${T(r3(trig(f, t)))}</td>`).join('')}</tr>`).join('');
  pn.appendChild(tbl); hide(tbl);
  const rows = [...tbl.querySelectorAll('tr')].slice(1);
  const key = lineIn(pn, `${T('\\sin150^\\circ=\\sin30^\\circ')}<br>${T('\\cos150^\\circ=-\\cos30^\\circ')}<br>${T('\\tan150^\\circ=-\\tan30^\\circ')}`, 'u3l3-line-key');
  key.style.textAlign = 'center';
  const flip = async (c, i, from) => { const fx = Math.sign(Math.cos(angs[from] * RAD)), fy = Math.sign(Math.sin(angs[from] * RAD)), tx = SX[i + 1], ty = SY[i + 1];
    tris[i].style.opacity = 1; await tween(c, 900, (k) => tris[i].setXY(X * (fx + (tx - fx) * k), Y * (fy + (ty - fy) * k))); arms[i].style.opacity = 1; await drawIn(arms[i], 350, c); refs[i].style.opacity = 1; await show(c, refs[i]); await show(c, tls[i]); await show(c, stk[i]); };
  return [
    { cap: `${T(cR('\\theta_R=30^\\circ'))} in Quadrant I: the arm, the x-axis and a drop line make a right triangle. Both legs are positive.`,
      run: async (c) => { arms[0].style.opacity = 1; await drawIn(arms[0], 500, c); await show(c, tris[0]); refs[0].style.opacity = 1; await drawIn(refs[0], 400, c); await show(c, rl); await show(c, tls[0]); await show(c, stk[0]); } },
    { cap: `Reflect it in the y-axis: ${T('150^\\circ')}. The same triangle, but now ${T('x<0')}.`, run: (c) => flip(c, 1, 0) },
    { cap: `Reflect that one in the x-axis: ${T('210^\\circ')}. Now ${T('x<0')} and ${T('y<0')}.`, run: (c) => flip(c, 2, 1) },
    { cap: `And back across the y-axis: ${T('330^\\circ')}, with ${T('x>0')} and ${T('y<0')}.`, run: (c) => flip(c, 3, 2) },
    { cap: `Four copies of one triangle: every ratio has the <b>same size</b> as for ${T('30^\\circ')}. Only the <b>signs</b> change, and CAST gives them.`,
      run: async (c) => { await W.light(c, { 1: 'pos', 2: 'pos', 3: 'pos', 4: 'pos' }); await show(c, tbl); } },
    { cap: `So ${T('\\sin150^\\circ=\\sin30^\\circ')}, ${T('\\cos150^\\circ=-\\cos30^\\circ')} and ${T('\\tan150^\\circ=-\\tan30^\\circ')}.`,
      run: async (c) => { rows[1].classList.add('u3l3-hlrow'); await show(c, key); } }
  ];
}

/* =============================== explainer 3: the other ratios from one ratio =============================== */
const OR = {
  demo: { label: `${T('\\sin\\theta=\\tfrac35')}, ${T('\\cos\\theta<0')}`, given: '\\sin\\theta=\\dfrac{3}{5},\\ \\ \\cos\\theta<0', find: `${T('\\cos\\theta')} and ${T('\\tan\\theta')}`,
    c1: { tex: '\\sin\\theta=\\tfrac35>0', qs: [1, 2] }, c2: { tex: '\\cos\\theta<0', qs: [2, 3] }, q: 2,
    read: '\\sin\\theta=\\tfrac{y}{r}=\\tfrac{3}{5}:\\ y=3,\\ r=5', readNote: 'The known height: a horizontal line.', known: 'y',
    py: 'x^2=r^2-y^2=25-9=16', pyNote: `${T('x=-4')}: negative in Quadrant II.`, X: -4, Y: 3, R: 5, xl: '-4', yl: '3', rl: '5', ppos: 'n',
    ans: ['\\cos\\theta=\\dfrac{x}{r}=-\\dfrac{4}{5}', '\\tan\\theta=\\dfrac{y}{x}=\\dfrac{3}{-4}=-\\dfrac{3}{4}'], lim: 6.4, step: 1 },
  ex3: { label: 'Example 3 check', given: '\\cos\\theta=-\\dfrac{8}{17},\\ \\ \\tan\\theta>0', find: `${T('\\sin\\theta')} and ${T('\\tan\\theta')}`,
    c1: { tex: '\\cos\\theta=-\\tfrac{8}{17}<0', qs: [2, 3] }, c2: { tex: '\\tan\\theta>0', qs: [1, 3] }, q: 3,
    read: '\\cos\\theta=\\tfrac{x}{r}=\\tfrac{-8}{17}:\\ x=-8,\\ r=17', readNote: `${T('r')} is always positive, so the minus sign goes with ${T('x')}.`, known: 'x',
    py: 'y^2=r^2-x^2=289-64=225', pyNote: `${T('y=-15')}: negative in Quadrant III.`, X: -8, Y: -15, R: 17, xl: '-8', yl: '-15', rl: '17',
    ans: ['\\sin\\theta=\\dfrac{y}{r}=-\\dfrac{15}{17}', '\\tan\\theta=\\dfrac{y}{x}=\\dfrac{-15}{-8}=\\dfrac{15}{8}'], lim: 19.5, step: 1, major: 5 },
  ex4a: { label: 'Example 4(a) check', given: '\\tan\\theta=\\dfrac{2}{5},\\ \\ \\sin\\theta<0', find: `${T('\\sin\\theta')} and ${T('\\cos\\theta')}`,
    c1: { tex: '\\tan\\theta=\\tfrac25>0', qs: [1, 3] }, c2: { tex: '\\sin\\theta<0', qs: [3, 4] }, q: 3,
    read: '\\tan\\theta=\\tfrac{y}{x}=\\tfrac{-2}{-5}:\\ x=-5,\\ y=-2', readNote: 'Both negative in Quadrant III.', known: 'xy',
    py: 'r=\\sqrt{(-5)^2+(-2)^2}=\\sqrt{29}', pyNote: `${T('r')} is a length: positive.`, X: -5, Y: -2, R: Math.sqrt(29), xl: '-5', yl: '-2', rl: '\\sqrt{29}',
    ans: ['\\sin\\theta=\\dfrac{-2}{\\sqrt{29}}=-\\dfrac{2\\sqrt{29}}{29}', '\\cos\\theta=\\dfrac{-5}{\\sqrt{29}}=-\\dfrac{5\\sqrt{29}}{29}'], ppos: 's', lim: 7.5, step: 1, rat: true },
  ex4b: { label: 'Example 4(b) check', given: '\\sin\\theta=\\dfrac{2}{3},\\ \\ 90^\\circ<\\theta<180^\\circ', find: `${T('\\cos\\theta')} and ${T('\\tan\\theta')}`,
    c1: { tex: '\\sin\\theta=\\tfrac23>0', qs: [1, 2] }, c2: { tex: '90^\\circ<\\theta<180^\\circ', qs: [2] }, q: 2,
    read: '\\sin\\theta=\\tfrac{y}{r}=\\tfrac{2}{3}:\\ y=2,\\ r=3', readNote: 'The known height: a horizontal line.', known: 'y',
    py: 'x^2=r^2-y^2=9-4=5', pyNote: `${T('x=-\\sqrt5')}: negative in Quadrant II.`, X: -Math.sqrt(5), Y: 2, R: 3, xl: '-\\sqrt5', yl: '2', rl: '3', ppos: 'n',
    ans: ['\\cos\\theta=\\dfrac{x}{r}=-\\dfrac{\\sqrt5}{3}', '\\tan\\theta=\\dfrac{2}{-\\sqrt5}=-\\dfrac{2\\sqrt5}{5}'], lim: 3.9, step: 1, rat: true }
};
const otherRatios = {
  title: 'One ratio and a quadrant → the other two',
  height: 440, minW: 940, capH: 86,
  choices: [{ v: 'demo', label: OR.demo.label }, { sep: 'Check:' }, { v: 'ex3', label: OR.ex3.label }, { v: 'ex4a', label: OR.ex4a.label }, { v: 'ex4b', label: OR.ex4b.label }],
  ask: (v) => `Given ${T(OR[v].given.replace(/dfrac/g, 'tfrac'))}, find the exact values of ${OR[v].find}.`,
  make(stage, v, ex) {
    const d = OR[v], L = d.lim;
    const G = new Graph(stage, { x: 8, y: 2, width: 436, height: 436, xmin: -L, xmax: L, ymin: -L, ymax: L, xstep: d.step, ystep: d.step, major: d.major || 0, numbers: true, fontSize: 14, pad: 26, xlabels: d.major || (L > 5 ? 2 : 1), ylabels: d.major || (L > 5 ? 2 : 1) });
    const O = G.toPx(0, 0), u = G.ux;
    const [x0, y0] = G.toPx(-L, L), [x1, y1] = G.toPx(L, -L);
    const RQ = { 1: [O[0], y0, x1 - O[0], O[1] - y0], 2: [x0, y0, O[0] - x0, O[1] - y0], 3: [x0, O[1], O[0] - x0, y1 - O[1]], 4: [O[0], O[1], x1 - O[0], y1 - O[1]] };
    const tile = svgEl('rect', { class: 'u3l3-tile', x: RQ[d.q][0], y: RQ[d.q][1], width: RQ[d.q][2], height: RQ[d.q][3] }, G.layers.bg);
    const PX = 466, PW = ex.W - PX - 8, pn = panel(stage, PX, 6, PW, 428, '');
    const top = div(pn, 'u3l3-cluerow', ''); const gv = h('div', 'u3l3-eqbig', T(d.given)); gv.style.flex = '1'; gv.style.margin = '0'; gv.style.fontSize = '22px'; top.appendChild(gv);
    const mini = h('div', 'u3l3-mini'); top.appendChild(mini);
    const mt = {}; [2, 1, 3, 4].forEach((q) => { mt[q] = h('div', 'u3l3-mt', QN[q]); mini.appendChild(mt[q]); });
    const L1 = lineIn(pn, `Clue 1: ${T(d.c1.tex)} → ${d.c1.qs.map((q) => QN[q]).join(' or ')}`, 'u3l3-line-sm');
    const L2 = lineIn(pn, `Clue 2: ${T(d.c2.tex)} → ${d.c2.qs.map((q) => QN[q]).join(' or ')}`, 'u3l3-line-sm');
    const L3 = lineIn(pn, T(d.read), 'u3l3-line-sm'), L4 = lineIn(pn, T(d.py), 'u3l3-line-sm');
    const L5 = lineIn(pn, d.ans.map((a) => T(a)).join('<br>'), 'u3l3-line-ans'); L5.style.lineHeight = '1.9';
    // the picture: the known line meets the circle of radius r at P
    const circ = hide(svgEl('circle', { class: 'u3l3-circ-d', cx: O[0], cy: O[1], r: d.R * u }, G.layers.data));
    let kn = null;
    if (d.known === 'x') kn = G.segment([d.X, -L], [d.X, L], { color: LN, dash: true, width: 3 });
    if (d.known === 'y') kn = G.segment([-L, d.Y], [L, d.Y], { color: LN, dash: true, width: 3 });
    if (kn) hide(kn);
    const legX = hide(G.segment([0, 0], [d.X, 0], { color: REF, width: 5 })), legY = hide(G.segment([d.X, 0], [d.X, d.Y], { color: REF, width: 5 }));
    const hyp = hide(G.segment([0, 0], [d.X, d.Y], { color: ARM, width: 4.5 }));
    const P = hide(G.point(d.X, d.Y, { color: ARM, label: T(`P\\left(${d.xl},\\ ${d.yl}\\right)`), pos: d.ppos || (d.Y > 0 ? 'nw' : 'sw') }));
    if (P.label) hide(P.label);
    const lx = hide(G.label(d.X / 2, 0, T(cR(`x=${d.xl}`)), { pos: d.Y > 0 ? 's' : 'n', cls: 'bk-ptlab', gap: 6 }));
    const ly = hide(G.label(d.X, d.Y / 2, T(cR(`y=${d.yl}`)), { pos: d.X > 0 ? 'e' : 'w', cls: 'bk-ptlab', gap: 8 }));
    const lr = hide(G.label(d.X / 2, d.Y / 2, T(cA(`r=${d.rl}`)), { pos: d.Y > 0 ? 'ne' : 'se', cls: 'bk-ptlab', gap: 6 }));
    const th = Math.atan2(d.Y, d.X) / RAD, ang = (th + 360) % 360;
    const rotG = svgEl('g', {}, G.layers.top), rp = svgEl('path', { class: 'bk-stroke', fill: 'none', stroke: ARM, 'stroke-width': 3 }, rotG); hide(rotG);
    { const rho = 26, e = [O[0] + rho * Math.cos(ang * RAD), O[1] - rho * Math.sin(ang * RAD)]; rp.setAttribute('d', `M${O[0] + rho} ${O[1]}A${rho} ${rho} 0 ${ang > 180 ? 1 : 0} 0 ${e[0].toFixed(1)} ${e[1].toFixed(1)}`); const hd = svgEl('g', { class: 'bk-end' }, rotG); arrowHead(hd, e[0], e[1], -Math.sin(ang * RAD), -Math.cos(ang * RAD), { width: 2.6, color: ARM }); }
    const both = d.c1.qs.filter((q) => d.c2.qs.includes(q));
    const mark = (qs, cls) => qs.forEach((q) => mt[q].classList.add(cls));
    return [
      { cap: `Clue 1: ${T(d.c1.tex)}, so Quadrant ${d.c1.qs.map((q) => QN[q]).join(' or ')}.`, run: async (c) => { mark(d.c1.qs, 'u3l3-mt-a'); await show(c, L1); } },
      { cap: `Clue 2: ${T(d.c2.tex)}: ${d.c2.qs.length > 1 ? 'Quadrant ' + d.c2.qs.map((q) => QN[q]).join(' or ') : 'Quadrant ' + QN[d.c2.qs[0]]}. Both clues: <b>Quadrant ${QN[d.q]}</b>.`,
        run: async (c) => { mark(d.c2.qs, 'u3l3-mt-b'); both.forEach((q) => { mt[q].classList.remove('u3l3-mt-a', 'u3l3-mt-b'); mt[q].classList.add('u3l3-mt-ab'); }); tile.classList.add('u3l3-t-ok'); await pop(c, mt[d.q], 400); await show(c, L2); } },
      { cap: `${T(d.read)}. ${d.readNote}`,
        run: async (c) => {
          await show(c, L3);
          if (d.known === 'xy') { P.style.opacity = 1; await pop(c, P, 380); await show(c, P.label); legX.style.opacity = 1; await drawIn(legX, 400, c); await show(c, lx); legY.style.opacity = 1; await drawIn(legY, 400, c); await show(c, ly); }
          else { circ.style.opacity = 1; await show(c, circ); kn.style.opacity = 1; await drawIn(kn, 600, c); await show(c, d.known === 'x' ? lx : ly); if (d.known === 'x') { legX.style.opacity = 1; await drawIn(legX, 400, c); } }
        } },
      { cap: `${T(d.py)}. ${d.pyNote}`,
        run: async (c) => {
          await show(c, L4);
          if (d.known === 'xy') { hyp.style.opacity = 1; await drawIn(hyp, 500, c); await show(c, lr); }
          else {
            P.style.opacity = 1; await pop(c, P, 380); await show(c, P.label);
            if (d.known === 'x') { legY.style.opacity = 1; await drawIn(legY, 400, c); await show(c, ly); } else { legX.style.opacity = 1; legY.style.opacity = 1; await drawIn(legY, 300, c); await drawIn(legX, 400, c); await show(c, lx); }
            hyp.style.opacity = 1; await drawIn(hyp, 400, c); await show(c, lr);
          }
        } },
      { cap: `Read the ratios from the triangle${d.rat ? ' and rationalize the denominators' : ''}: ${T(d.ans[0].replace(/dfrac/g, 'tfrac'))}, ${T(d.ans[1].replace(/dfrac/g, 'tfrac'))}.`,
        run: async (c) => { rotG.style.opacity = 1; await drawIn(rotG, 500, c); await show(c, L5); } }
    ];
  }
};

/* =============================== explainer 4 (STAR): two answers =============================== */
const TA = {
  s6: { f: 'sin', a: 0.6 }, c6: { f: 'cos', a: 0.6 }, t6: { f: 'tan', a: 0.6 }, sm6: { f: 'sin', a: -0.6 },
  e5a: { f: 'sin', a: 0.42, n: '5(a)' }, e5b: { f: 'cos', a: -0.73, n: '5(b)' }, e5c: { f: 'tan', a: -3.5, n: '5(c)' }
};
const aTex = (a) => String(a).replace(/^(-?)0\./, '$10.');
const twoAnswers = {
  title: 'Why two answers?',
  height: 470, minW: 960, capH: 84,
  choices: [...['s6', 'c6', 't6', 'sm6'].map((k) => ({ v: k, label: T(`\\${TA[k].f}\\theta=${aTex(TA[k].a)}`) })), { sep: 'Example 5 check:' },
    ...['e5a', 'e5b', 'e5c'].map((k) => ({ v: k, label: `(${TA[k].n.slice(2, 3)}) ${T(`\\${TA[k].f}\\theta=${aTex(TA[k].a)}`)}` }))],
  ask: (v) => `${TA[v].n ? `Example ${TA[v].n}: solve` : 'Solve'} ${T(`\\${TA[v].f}\\theta=${aTex(TA[v].a)}`)} for ${T('0^\\circ\\le\\theta<360^\\circ')}.`,
  make(stage, v, ex) {
    const d = TA[v], f = d.f, a = d.a, A = Math.abs(a), sol = solveT(f, a), R = sol.R, Rs = r2(R), ts = sol.ts, qs = sol.qs;
    const kind = f === 'sin' ? 'h' : f === 'cos' ? 'v' : 's';
    const W = new Wheel(stage, { x: 6, y: 2, size: 466 }), PX = 496, PW = ex.W - PX - 8;
    const pn = panel(stage, PX, 6, PW, 456, '');
    const eq = lineIn(pn, T(`\\${f}\\theta=${aTex(a)}`), 'u3l3-eqbig'); eq.style.opacity = 1;
    const mean = { h: `y=${aTex(a)}r`, v: `x=${aTex(a)}r`, s: `\\tfrac{y}{x}=${aTex(a)}` }[kind];
    const L1 = lineIn(pn, `${T(`\\${f}\\theta=${f === 'sin' ? '\\tfrac{y}{r}' : f === 'cos' ? '\\tfrac{x}{r}' : '\\tfrac{y}{x}'}`)}, so ${T(cL(mean))}`);
    const L2 = lineIn(pn, `${a > 0 ? 'Positive' : 'Negative'} ${f}: Quadrants <b>${qList(qs)}</b>`);
    const L3 = lineIn(pn, T(cR(`\\theta_R=\\${f}^{-1}(${aTex(A)})\\approx${Rs}^\\circ`)));
    const L4 = lineIn(pn, qs.map((q, i) => `${QN[q]}: ${T(q === 1 ? `\\theta\\approx${r1(ts[i])}^\\circ` : `\\theta\\approx${placeTex(q, Rs)}\\approx${r1(ts[i])}^\\circ`)}`).join('<br>'), 'u3l3-line-ans');
    // sample arm for step 1
    const sT = 62, sArm = hide(W.arm(0, { color: '#b46a85', w: 3.5 })), bar = svgEl('path', { fill: 'none', stroke: LN, 'stroke-width': 5, 'stroke-linecap': 'round' }, W.G.layers.top); hide(bar);
    const rLab = hide(W.labAt(sT + 14, 0.62, T('r'), 'u3l3-c-arm'));
    const setBar = (tt) => { const x = Math.cos(tt * RAD), y = Math.sin(tt * RAD), B = W.G.toPx(x, 0), P = W.G.toPx(x, y), O = W.O;
      bar.setAttribute('d', f === 'sin' ? `M${B[0]} ${B[1]}L${P[0]} ${P[1]}` : f === 'cos' ? `M${O[0]} ${O[1]}L${B[0]} ${B[1]}` : 'M0 0'); };
    const line = hide(W.vline(kind, a)), lineLab = hide(W.G.label(...(kind === 'h' ? [0.04, a] : [a, W.lim - 0.04]),
      T(cL(mean)), { pos: kind === 'h' ? (a > 0 ? 'ne' : 'se') : (a > 0 ? 'sw' : 'se'), cls: 'bk-ptlab', gap: 5 }));
    if (kind === 's') lineLab.style.display = 'none';   // the line runs along both arms: its name is in the panel
    const arms = ts.map((t) => hide(W.arm(t))), refs = ts.map((t) => hide(W.refArc(t, 56)));
    const rls = ts.map((t) => hide(W.refLab(t, `${r1(R)}^\\circ`, 0.55)));
    const rots = ts.map((t, i) => hide(W.arc(0, t, 26 + 10 * i)));
    const tls = ts.map((t) => hide(W.labAt(t, 1.17, T(cA(`${r1(t)}^\\circ`)))));
    const what = { sin: 'height, so the same sine', cos: 'x-coordinate, so the same cosine', tan: 'slope, so the same tangent' }[f];
    const intro = {
      sin: `Every terminal arm ends on a circle of radius ${T('r')}. ${T('\\sin\\theta=\\tfrac{y}{r}')} compares the point's <b>height</b> with ${T('r')}.`,
      cos: `Every terminal arm ends on a circle of radius ${T('r')}. ${T('\\cos\\theta=\\tfrac{x}{r}')} compares how far <b>right</b> the point is with ${T('r')}.`,
      tan: `Every terminal arm ends on a circle of radius ${T('r')}. ${T('\\tan\\theta=\\tfrac{y}{x}')} is the <b>slope</b> of the terminal arm.`
    }[f];
    const meanCap = {
      h: `${T(`\\sin\\theta=${aTex(a)}`)} means ${T(cL(mean))}: every point at that height is on the blue line.`,
      v: `${T(`\\cos\\theta=${aTex(a)}`)} means ${T(cL(mean))}: every point that far ${a > 0 ? 'right' : 'left'} is on the blue line.`,
      s: `${T(`\\tan\\theta=${aTex(a)}`)}: every point on the line through the origin with slope ${T(aTex(a))}.`
    }[kind];
    const signCap = a > 0 ? `Positive ${f}: ${LETS[f]}. Quadrants ${qList(qs)} light up.` : `Negative ${f}: the two quadrants with no ${LETS[f].replace('and', 'or')}: Quadrants ${qList(qs)}.`;
    const solCap = qs.map((q, i) => T(q === 1 ? `\\theta\\approx${r1(ts[i])}^\\circ` : `\\theta\\approx${placeTex(q, Rs)}\\approx${r1(ts[i])}^\\circ`)).join(' and ');
    return [
      { cap: intro, run: async (c) => { sArm.style.opacity = 1; bar.style.opacity = 1; await tween(c, 900, (k) => { const tt = 5 + (sT - 5) * k; sArm.set(tt); setBar(tt); }); await show(c, rLab); } },
      { cap: meanCap, run: async (c) => { await anim(c, sArm, [{ opacity: 1 }, { opacity: 0 }], 300); bar.style.opacity = 0; rLab.style.opacity = 0; line.style.opacity = 1; await drawIn(line, 700, c); await show(c, lineLab); await show(c, L1); } },
      { cap: `The line cuts the circle <b>twice</b>: two terminal arms with the same ${what}.`, run: async (c) => { for (const ar of arms) { ar.style.opacity = 1; await drawIn(ar, 450, c); } } },
      { cap: signCap, run: async (c) => { const m = {}; qs.forEach((q) => (m[q] = a > 0 ? 'pos' : 'neg')); await W.light(c, m); await show(c, L2); } },
      { cap: `Both arms make the same angle with the x-axis: ${T(cR(`\\theta_R=\\${f}^{-1}(${aTex(A)})\\approx${Rs}^\\circ`))}. Use the <b>positive</b> number.`,
        run: async (c) => { for (let i = 0; i < 2; i++) { refs[i].style.opacity = 1; await drawIn(refs[i], 400, c); await show(c, rls[i]); } await show(c, L3); } },
      { cap: solCap, run: async (c) => { for (let i = 0; i < 2; i++) { rots[i].style.opacity = 1; await drawIn(rots[i], 600, c); await show(c, tls[i]); } await show(c, L4); } }
    ];
  }
};

/* =============================== explainer 5: placing θR in each quadrant =============================== */
const PR = { r40: { R: 40, label: T('\\theta_R=40^\\circ') }, r65: { R: 65, label: T('\\theta_R=65^\\circ') }, neg: { label: `Why ${T('|a|')}? ${T('\\sin\\theta=-0.42')}` } };
const placeR = {
  title: 'Placing the reference angle',
  height: 440, minW: 960, capH: 84,
  choices: Object.keys(PR).map((k) => ({ v: k, label: PR[k].label })),
  ask: (v) => (v === 'neg' ? `Solve ${T('\\sin\\theta=-0.42')}, ${T('0^\\circ\\le\\theta<360^\\circ')}. Why not just use ${T('\\sin^{-1}(-0.42)')}?` : `Where does ${T(`\\theta_R=${PR[v].R}^\\circ`)} land in each quadrant?`),
  make(stage, v, ex) {
    const W = new Wheel(stage, { x: 6, y: 4, size: 430 }), NX = 452, NW = ex.W - NX - 6, neg = v === 'neg';
    const NL = new NumberLine(stage, { x: NX, y: 12, width: NW, height: 140, min: neg ? -90 : 0, max: 360, step: 90, minor: 30, labels: (x) => T(`${x}^\\circ`), axisY: 82, pad: 30 });
    // quadrant bands
    [1, 2, 3, 4].forEach((q) => { const a = NL.toPx((q - 1) * 90), b = NL.toPx(q * 90); svgEl('rect', { class: 'u3l3-band', x: a, y: 40, width: b - a, height: 42, fill: q % 2 ? '#f6efe6' : '#efe9f2' }, NL.svg).parentNode.insertBefore(NL.svg.lastChild, NL.svg.children[1]);
      NL.hlabel((a + b) / 2, 128, QN[q], { cls: 'u3l3-qn' }); });
    const tiles = [1, 2, 3, 4].map((q) => { const t = div(stage, 'u3l3-ftile', `<div class="u3l3-fq">Quadrant ${QN[q]}</div>${T(['\\theta_R', '180^\\circ-\\theta_R', '180^\\circ+\\theta_R', '360^\\circ-\\theta_R'][q - 1])}<div class="u3l3-fv"></div>`, NX + 10 + ((q - 1) % 2) * ((NW - 30) / 2 + 10), 160 + Math.floor((q - 1) / 2) * 100, (NW - 30) / 2, 88); return t; });
    if (!neg) {
      const R = PR[v].R, bases = [0, 180, 180, 360];
      const arms = [], refs = [], tls = [], rls = [];
      [1, 2, 3, 4].forEach((q) => { const t = placeQ(R, q); arms.push(hide(W.arm(t))); refs.push(hide(W.refArc(t, 50))); tls.push(hide(W.labAt(t, 1.17, T(cA(`${t}^\\circ`))))); rls.push(hide(W.refLab(t, `${R}^\\circ`, 0.55))); });
      const caps = [
        `Quadrant I: the reference angle <b>is</b> the angle. ${T(`\\theta=${R}^\\circ`)}.`,
        `Quadrant II: stop ${T(cR(`${R}^\\circ`))} short of ${T('180^\\circ')}. ${T(`\\theta=180^\\circ-${R}^\\circ=${180 - R}^\\circ`)}.`,
        `Quadrant III: go ${T(cR(`${R}^\\circ`))} past ${T('180^\\circ')}. ${T(`\\theta=180^\\circ+${R}^\\circ=${180 + R}^\\circ`)}.`,
        `Quadrant IV: stop ${T(cR(`${R}^\\circ`))} short of ${T('360^\\circ')}. ${T(`\\theta=360^\\circ-${R}^\\circ=${360 - R}^\\circ`)}.`
      ];
      const steps = [1, 2, 3, 4].map((q) => ({
        cap: caps[q - 1],
        run: async (c) => {
          const t = placeQ(R, q), i = q - 1; arms[i].style.opacity = 1; await drawIn(arms[i], 450, c); refs[i].style.opacity = 1; await drawIn(refs[i], 350, c); await show(c, rls[i]); await show(c, tls[i]);
          await NL.hop(c, bases[i], t, { label: T(cR(`${t > bases[i] ? '+' : '-'}${R}^\\circ`)), color: REF, height: 30 });
          const p = NL.point(t, { color: ARM, label: T(cA(`${t}^\\circ`)) }); p.style.opacity = 1; await pop(c, p, 300);
          tiles[i].classList.add('u3l3-fon'); tiles[i].querySelector('.u3l3-fv').innerHTML = T(`=${t}^\\circ`); await pulse(c, tiles[i], 1.05);
        }
      }));
      steps.push({ cap: `Every answer is ${T(cR('\\theta_R'))} away from ${T('0^\\circ')}, ${T('180^\\circ')} or ${T('360^\\circ')}: from the <b>x-axis</b>, never from the y-axis.`,
        run: async (c) => { for (const x of [0, 180, 360]) { const px = NL.toPx(x), m = svgEl('line', { x1: px, x2: px, y1: 22, y2: NL.ay + 12, stroke: REF, 'stroke-width': 3.5, 'stroke-dasharray': '6 5' }, NL.layers.data); await fadeIn(c, m, 300); } } });
      return steps;
    }
    // why |a|
    const sR = Math.asin(0.42) / RAD, t3 = 180 + sR, t4 = 360 - sR;
    const bad = hide(W.arm(-sR, { color: NEG })), badArc = hide(W.arc(0, -sR, 40, { color: NEG })), badLab = hide(W.labAt(-sR, 1.2, T(cN(`-${r2(sR)}^\\circ`))));
    const ok = hide(W.arm(sR, { color: GRAY, w: 3, dash: '8 6', dot: false })), okArc = hide(W.refArc(sR, 56)), okLab = hide(W.refLab(sR, `${r2(sR)}^\\circ`, 0.6));
    const a3 = hide(W.arm(t3)), a4 = hide(W.arm(t4)), r3a = hide(W.refArc(t3, 50)), r4a = hide(W.refArc(t4, 50)), l3 = hide(W.labAt(t3, 1.17, T(cA(`${r1(t3)}^\\circ`)))), l4 = hide(W.labAt(t4, 1.17, T(cA(`${r1(t4)}^\\circ`))));
    const band = hide(NL.interval(0, 360, { color: 'green', openB: true, lift: 0 }));
    return [
      { cap: `The calculator gives ${T('\\sin^{-1}(-0.42)\\approx-24.83^\\circ')}: a <b>clockwise</b> angle, outside ${T('0^\\circ\\le\\theta<360^\\circ')}.`,
        run: async (c) => { bad.style.opacity = 1; badArc.style.opacity = 1; await drawIn(badArc, 500, c); await drawIn(bad, 300, c); await show(c, badLab); band.style.opacity = 1; await drawIn(band, 500, c); const p = NL.point(-sR, { color: NEG, label: T(cN('-24.8^\\circ')) }); await pop(c, p, 300); await shake(c, p); } },
      { cap: `Use the positive value: ${T(cR('\\theta_R=\\sin^{-1}(0.42)\\approx24.83^\\circ'))}, an acute angle to the x-axis.`,
        run: async (c) => { await anim(c, bad, [{ opacity: 1 }, { opacity: 0.25 }], 300); badArc.style.opacity = 0.25; ok.style.opacity = 1; await drawIn(ok, 400, c); okArc.style.opacity = 1; await drawIn(okArc, 400, c); await show(c, okLab); } },
      { cap: `Negative sine: Quadrants III and IV. ${T('\\theta\\approx180^\\circ+24.83^\\circ\\approx204.8^\\circ')} and ${T('360^\\circ-24.83^\\circ\\approx335.2^\\circ')}.`,
        run: async (c) => {
          await W.light(c, { 3: 'neg', 4: 'neg' });
          for (const [ar, ra, lb, t, q] of [[a3, r3a, l3, t3, 3], [a4, r4a, l4, t4, 4]]) {
            ar.style.opacity = 1; await drawIn(ar, 400, c); ra.style.opacity = 1; await show(c, ra); await show(c, lb);
            await NL.hop(c, q === 3 ? 180 : 360, t, { label: T(cR(`${q === 3 ? '+' : '-'}24.8^\\circ`)), color: REF, height: 28 });
            const p = NL.point(t, { color: ARM, label: T(cA(`${r1(t)}^\\circ`)) }); await pop(c, p, 300);
            tiles[q - 1].classList.add('u3l3-fon'); tiles[q - 1].querySelector('.u3l3-fv').innerHTML = T(`\\approx${r1(t)}^\\circ`);
          }
        } }
    ];
  }
};

/* =============================== explainer 6: one, two or no solutions =============================== */
const BD = {
  slide: { label: `Slide the line: ${T('\\sin\\theta=a')}` },
  a: { f: 'sin', kind: 'h', a: -1, n: '(a)', ts: [270], cells: [['sin', 3]] },
  b: { f: 'cos', kind: 'v', a: 0, n: '(b)', ts: [90, 270], cells: [['cos', 1], ['cos', 3]] },
  c: { f: 'tan', kind: 'h', a: 0, n: '(c)', ts: [0, 180], cells: [['tan', 0], ['tan', 2]] },
  d: { f: 'cos', kind: 'v', a: -1.15, n: '(d)', ts: [], cells: [] }
};
const hits = (kind, a) => { // circle crossings of y = a (h) or x = a (v), as angles
  if (Math.abs(a) > 1 + 1e-9) return [];
  if (Math.abs(Math.abs(a) - 1) < 1e-9) return kind === 'h' ? [a > 0 ? 90 : 270] : [a > 0 ? 0 : 180];
  return solveT(kind === 'h' ? 'sin' : 'cos', a).ts;
};
const bounds = {
  title: 'Two, one or no solutions?',
  height: 450, minW: 940, capH: 84,
  choices: [{ v: 'slide', label: BD.slide.label }, { sep: 'Example 6 check:' }, ...['a', 'b', 'c', 'd'].map((k) => ({ v: k, label: `${BD[k].n} ${T(`\\${BD[k].f}\\theta=${BD[k].a}`)}` }))],
  ask: (v) => (v === 'slide' ? `How many solutions does ${T('\\sin\\theta=a')} have, for different values of ${T('a')}?` : `Example 6${BD[v].n}: solve ${T(`\\${BD[v].f}\\theta=${BD[v].a}`)}, ${T('0^\\circ\\le\\theta<360^\\circ')}.`),
  make(stage, v, ex) {
    const W = new Wheel(stage, { x: 6, y: 2, size: 446, lim: 1.42 }), PX = 476, PW = ex.W - PX - 8;
    const pn = panel(stage, PX, 6, PW, 436, '');
    const cnt = div(pn, 'u3l3-eqbig', ''); cnt.style.textAlign = 'center';
    const setCnt = (n) => { const s = n === 0 ? 'no solution' : n === 1 ? '1 solution' : '2 solutions'; if (cnt.dataset.s !== s) { cnt.dataset.s = s; cnt.innerHTML = `<b style="color:${n ? POS : NEG}">${s}</b>`; } };
    const dots = [0, 1].map(() => hide(svgEl('circle', { r: 9, fill: LN, stroke: '#fff', 'stroke-width': 2.4 }, W.G.layers.top)));
    const placeDots = (angs) => dots.forEach((d, i) => { if (i < angs.length) { const [px, py] = W.P(angs[i]); d.setAttribute('cx', px); d.setAttribute('cy', py); d.style.opacity = 1; } else d.style.opacity = 0; });
    const st = stamp(stage, 'No solution', { ok: false, x: 6 + 446 / 2, y: 340, size: 'lg' }); hide(st);
    if (v === 'slide') {
      const line = hide(W.vline('h', 0.6)), lab = hide(W.G.label(W.lim - 0.04, 0.6, '', { pos: 'nw', cls: 'bk-ptlab', gap: 4 }));
      const setA = (a) => { line.set(a); W.G.moveTo(lab, W.lim - 0.04, a); const hs = hits('h', a); placeDots(hs); setCnt(hs.length); };
      const labTex = (a) => { lab.innerHTML = T(cL(`y=${a}r`)); };
      const L1 = lineIn(pn, `${T('\\sin\\theta=\\tfrac{y}{r}')} and ${T('-r\\le y\\le r')}, so ${T('-1\\le\\sin\\theta\\le1')}. The same for ${T('\\cos\\theta')}.`, 'u3l3-line-key');
      const L2 = lineIn(pn, `${T('\\tan\\theta=\\tfrac{y}{x}')} can be <b>any</b> number: always two solutions.`, 'u3l3-line-ans');
      const sl = hide(W.vline('s', 0.3));
      const slide = (a0, a1) => async (c) => { await tween(c, 900, (k) => setA(a0 + (a1 - a0) * k)); labTex(a1); };
      return [
        { cap: `${T('\\sin\\theta=0.6')}: the line ${T('y=0.6r')} cuts the circle twice. <b>Two</b> solutions.`, run: async (c) => { line.style.opacity = 1; setA(0.6); labTex(0.6); await drawIn(line, 600, c); await show(c, lab); } },
        { cap: `${T('\\sin\\theta=0.9')}: higher up, still two.`, run: slide(0.6, 0.9) },
        { cap: `${T('\\sin\\theta=1')}: the line just touches the top of the circle. <b>One</b> solution, ${T('\\theta=90^\\circ')}.`, run: slide(0.9, 1) },
        { cap: `${T('\\sin\\theta=1.2')}: the line misses the circle, because ${T('y')} is never more than ${T('r')}. <b>No solution.</b>`, run: async (c) => { await slide(1, 1.2)(c); st.style.opacity = 1; await stampIn(c, st); await show(c, L1); } },
        { cap: `Tangent is different: ${T('\\tan\\theta=a')} is a line through the origin, and it <b>always</b> crosses the circle twice, however steep.`,
          run: async (c) => { st.style.opacity = 0; line.style.opacity = 0; lab.style.opacity = 0; sl.style.opacity = 1;
            await tween(c, 1800, (k) => { const m = Math.tan((17 + 66 * k) * RAD); sl.set(m); const t = Math.atan(m) / RAD; placeDots([t, t + 180]); setCnt(2); }); await show(c, L2); } }
      ];
    }
    const d = BD[v];
    const tb = h('table', 'u3l3-tbl u3l3-qt'); tb.style.margin = '8px auto';
    const QV = { sin: ['0', '1', '0', '-1'], cos: ['1', '0', '-1', '0'], tan: ['0', '\\text{undef.}', '0', '\\text{undef.}'] };
    tb.innerHTML = `<tr><th>${T('\\theta')}</th>${[0, 90, 180, 270].map((t) => `<td>${T(`${t}^\\circ`)}</td>`).join('')}</tr>` + ['sin', 'cos', 'tan'].map((f) => `<tr data-f="${f}"><th>${T(`\\${f}\\theta`)}</th>${QV[f].map((s) => `<td>${T(s)}</td>`).join('')}</tr>`).join('');
    pn.appendChild(tb);
    const line = hide(W.vline(d.kind, d.a, d.a === 0 ? { w: 5 } : {}));
    const lt = d.kind === 'h' ? `y=${d.a === 0 ? '0' : d.a === -1 ? '-r' : d.a + 'r'}` : `x=${d.a === 0 ? '0' : d.a + 'r'}`;
    const lab = hide(W.G.label(...(d.kind === 'h' ? [W.lim - 0.04, d.a] : [d.a, W.lim - 0.04]), d.a === 0 ? '' : T(cL(lt)), { pos: d.kind === 'h' ? (d.a <= 0 ? 'sw' : 'nw') : (d.a < 0 ? 'se' : 'sw'), cls: 'bk-ptlab', gap: 4 }));
    const arms = d.ts.map((t) => hide(W.arm(t))), rots = d.ts.map((t, i) => (t ? hide(W.arc(0, t, 28 + 10 * i)) : null)), tls = d.ts.map((t) => hide(W.labAt(t, 1.2, T(cA(`${t}^\\circ`)))));
    const ans = lineIn(pn, d.ts.length ? T(`\\theta=${d.ts.map((t) => t + '^\\circ').join('\\ \\text{or}\\ ')}`) : `<b>No solution</b>: ${T('-1.15<-1')}`, d.ts.length ? 'u3l3-line-ans u3l3-eqbig' : 'u3l3-line-no u3l3-eqbig');
    const mean = { a: `${T('\\sin\\theta=-1')} means ${T('y=-r')}: the very bottom of the circle.`, b: `${T('\\cos\\theta=0')} means ${T('x=0')}: the vertical line is the y-axis itself.`,
      c: `${T('\\tan\\theta=\\tfrac{y}{x}=0')} means ${T('y=0')}: the line is the x-axis itself.`, d: `${T('\\cos\\theta=-1.15')} means ${T('x=-1.15r')}: a vertical line to the <b>left</b> of the whole circle.` }[v];
    const res = { a: `That point is on the negative y-axis: ${T('\\theta=270^\\circ')}, only <b>one</b> solution.`, b: `It meets the circle at the top and the bottom: ${T('\\theta=90^\\circ')} or ${T('270^\\circ')}.`,
      c: `It meets the circle at both ends of the x-axis: ${T('\\theta=0^\\circ')} or ${T('180^\\circ')}.`, d: `It never meets the circle: ${T('x')} is never less than ${T('-r')}. ${T('-1.15<-1')}, so there is <b>no solution</b>.` }[v];
    return [
      { cap: mean, run: async (c) => { line.style.opacity = 1; await drawIn(line, 700, c); await show(c, lab); placeDots(d.ts); for (const dd of dots) if (dd.style.opacity === '1') await pop(c, dd, 300); setCnt(d.ts.length); } },
      { cap: res, run: async (c) => {
        if (!d.ts.length) { await shake(c, line); st.style.opacity = 1; await stampIn(c, st); }
        for (let i = 0; i < d.ts.length; i++) { arms[i].style.opacity = 1; await drawIn(arms[i], 400, c); if (rots[i]) { rots[i].style.opacity = 1; await drawIn(rots[i], 500, c); } await show(c, tls[i]); }
        d.cells.forEach(([f, k]) => tb.querySelector(`tr[data-f="${f}"]`).children[k + 1].classList.add('u3l3-hl'));
        await show(c, ans);
      } }
    ];
  }
};

/* =============================== explainer 7: isolate first, then solve =============================== */
const IS = {
  like: { label: 'Like solving for x' },
  a: { n: '(a)', f: 'sin', a: -0.4, absTex: '0.4', rows: [['5\\sin\\theta+2=0', ''], ['5\\sin\\theta=-2', `${T('-2')} both sides`], ['\\sin\\theta=-0.4', `${T('\\div5')} both sides`]],
    caps: ['Subtract 2 from both sides.', 'Divide both sides by 5.'] },
  b: { n: '(b)', f: 'cos', a: 2 / 3, absTex: '\\tfrac{2}{3}', aTex: '\\tfrac{2}{3}', rows: [['3(2-\\cos\\theta)=4', ''], ['6-3\\cos\\theta=4', 'expand'], ['-3\\cos\\theta=-2', `${T('-6')} both sides`], ['\\cos\\theta=\\tfrac{2}{3}', `${T('\\div(-3)')}`]],
    caps: ['Expand the brackets.', 'Subtract 6 from both sides.', `Divide both sides by ${T('-3')}.`] },
  c: { n: '(c)', f: 'tan', a: -8 / 3, absTex: '\\tfrac{8}{3}', rows: [['3\\tan\\theta+8=0', ''], ['3\\tan\\theta=-8', `${T('-8')} both sides`], ['\\tan\\theta=-\\tfrac{8}{3}', `${T('\\div3')} both sides`]],
    caps: ['Subtract 8 from both sides.', 'Divide both sides by 3.'], int: [0, 180], intTex: '0^\\circ\\le\\theta\\le180^\\circ' }
};
const isolate = {
  title: 'Isolate the ratio, then solve',
  height: 450, minW: 960, capH: 84,
  choices: [{ v: 'like', label: IS.like.label }, { sep: 'Example 7 check:' }, ...['a', 'b', 'c'].map((k) => ({ v: k, label: `${IS[k].n} ${T(IS[k].rows[0][0])}` }))],
  ask: (v) => (v === 'like' ? `Compare ${T('5x+2=0')} with ${T('5\\sin\\theta+2=0')}.` : `Example 7${IS[v].n}: solve ${T(IS[v].rows[0][0])}, ${T(IS[v].intTex || '0^\\circ\\le\\theta<360^\\circ')}, to the nearest tenth of a degree.`),
  make(stage, v, ex) {
    if (v === 'like') {
      const cols = [['5x+2=0', '5x=-2', 'x=-0.4'], ['5\\boxed{\\sin\\theta}+2=0', '5\\boxed{\\sin\\theta}=-2', '\\boxed{\\sin\\theta}=-0.4']];
      const notes = ['', `${T('-2')} both sides`, `${T('\\div5')} both sides`];
      const CW = (ex.W - 40) / 2, ps = [panel(stage, 10, 10, CW, 330, 'A linear equation'), panel(stage, 30 + CW, 10, CW, 330, 'A trig equation')];
      const rows = cols.map((col, j) => col.map((s, i) => { const r = div(ps[j], 'u3l3-eqr', `<div>${T(s)}</div><div class="u3l3-eqn">${notes[i]}</div>`); hide(r); return r; }));
      const end = div(stage, 'u3l3-panel u3l3-line-key', `${T('x=-0.4')} is the answer. ${T('\\sin\\theta=-0.4')} is only <b>half</b> the job: now find the angles with CAST, as in Example 7(a).`, 10, 352, ex.W - 20, 86); hide(end);
      end.style.fontSize = '20px';
      return [
        { cap: `Side by side: a linear equation and a trig equation. Treat ${T('\\sin\\theta')} as <b>one thing</b>, like ${T('x')}.`, run: async (c) => { await show(c, rows[0][0]); await show(c, rows[1][0]); } },
        { cap: 'Subtract 2 from both sides, in both.', run: async (c) => { await show(c, rows[0][1]); await show(c, rows[1][1]); } },
        { cap: 'Divide both sides by 5, in both.', run: async (c) => { await show(c, rows[0][2]); await show(c, rows[1][2]); } },
        { cap: `${T('x=-0.4')} is finished, but ${T('\\sin\\theta=-0.4')} still has to be solved for ${T('\\theta')}.`, run: (c) => show(c, end) }
      ];
    }
    const d = IS[v], f = d.f, sol = solveT(f, d.a), R = sol.R, Rs = r2(R), qs = sol.qs, ts = sol.ts;
    const EW = 450, pn = panel(stage, 8, 6, EW, 436, 'Isolate');
    const rows = d.rows.map(([s, n], i) => { const r = div(pn, 'u3l3-eqr', `<div>${T(s)}</div><div class="u3l3-eqn">${n}</div>`); if (i) hide(r); return r; });
    const sL1 = lineIn(pn, `${d.a > 0 ? 'Positive' : 'Negative'} ${f}: Quadrants <b>${qList(qs)}</b>`, 'u3l3-line-sm');
    const sL2 = lineIn(pn, T(cR(`\\theta_R=\\${f}^{-1}\\!\\left(${d.absTex}\\right)\\approx${Rs}^\\circ`)), 'u3l3-line-sm');
    const sL3 = lineIn(pn, qs.map((q, i) => `${QN[q]}: ${T(`\\theta\\approx${placeTex(q, Rs)}\\approx${r1(ts[i])}^\\circ`)}`).join('<br>'), 'u3l3-line-ans u3l3-line-sm');
    const WX = EW + 30, WS = 300, W = new Wheel(stage, { x: WX + (ex.W - WX - WS) / 2, y: 2, size: WS, lim: 1.32 });
    const NL = new NumberLine(stage, { x: WX - 6, y: 318, width: ex.W - WX, height: 122, min: 0, max: 360, step: 90, minor: 30, labels: (x) => T(`${x}^\\circ`), axisY: 74, pad: 26 });
    const arms = ts.map((t) => hide(W.arm(t, { r: 6 }))), refs = ts.map((t) => hide(W.refArc(t, 36)));
    const steps = d.caps.map((cap, i) => ({ cap, run: (c) => show(c, rows[i + 1]) }));
    let semi = null, band = null, x2 = null, st2 = null;
    if (d.int) {
      const [ox, oy] = W.O, r = W.u;
      semi = hide(svgEl('path', { d: `M${ox + r} ${oy}A${r} ${r} 0 0 0 ${ox - r} ${oy}Z`, fill: POS, 'fill-opacity': 0.16, stroke: POS, 'stroke-width': 2 }, W.G.layers.data));
      band = hide(NL.interval(0, 180, { color: 'green', lift: 0 }));
    }
    steps.push({ cap: `${d.a > 0 ? 'Positive' : 'Negative'} ${f}: Quadrants ${qList(qs)}. ${T(cR(`\\theta_R=\\${f}^{-1}\\!\\left(${d.absTex}\\right)\\approx${Rs}^\\circ`))}.`,
      run: async (c) => { const m = {}; qs.forEach((q) => (m[q] = d.a > 0 ? 'pos' : 'neg')); await W.light(c, m); await show(c, sL1); await show(c, sL2); } });
    const pts = [];
    steps.push({ cap: `${T(`\\theta\\approx${r1(ts[0])}^\\circ`)} or ${T(`\\theta\\approx${r1(ts[1])}^\\circ`)}.`,
      run: async (c) => { for (let i = 0; i < 2; i++) { arms[i].style.opacity = 1; await drawIn(arms[i], 400, c); refs[i].style.opacity = 1; await show(c, refs[i]); const p = NL.point(ts[i], { color: ARM, label: T(cA(`${r1(ts[i])}^\\circ`)) }); pts.push(p); await pop(c, p, 300); } await show(c, sL3); } });
    if (d.int) {
      const keep = ts.filter((t) => t >= d.int[0] && t <= d.int[1]), drop = ts.filter((t) => !(t >= d.int[0] && t <= d.int[1]));
      steps.push({ cap: `Only ${T(d.intTex)} counts: keep ${T(`${r1(keep[0])}^\\circ`)}. ${T(`${r1(drop[0])}^\\circ`)} is outside the interval.`,
        run: async (c) => {
          semi.style.opacity = 1; await show(c, semi); band.style.opacity = 1; await drawIn(band, 500, c);
          const i = ts.indexOf(drop[0]); await anim(c, arms[i], [{ opacity: 1 }, { opacity: 0.2 }], 300); if (pts[i]) { pts[i].style.opacity = 0.35; if (pts[i].label) pts[i].label.style.opacity = 0.35; }
          if (!x2) { x2 = NL.hlabel(NL.toPx(drop[0]), NL.ay, '✗', { cls: 'u3l3-x' }); }
          await pop(c, x2, 300);
          if (!st2) st2 = lineIn(pn, `In the interval: <b>${T(`\\theta\\approx${r1(keep[0])}^\\circ`)}</b> only`, 'u3l3-line-key');
          await show(c, st2);
        } });
    }
    return steps;
  }
};

/* =============================== explainer 8: the bicycle pedal =============================== */
const PD = { turn: { label: 'Watch it turn' }, e8a: { label: 'Example 8(a): 6 cm below' }, e8b: { label: 'Example 8(b): 20 cm above' } };
const pedal = {
  title: 'The bicycle pedal: h = 17 sin θ',
  height: 450, minW: 940, capH: 84,
  choices: [{ v: 'turn', label: PD.turn.label }, { sep: 'Check:' }, { v: 'e8a', label: PD.e8a.label }, { v: 'e8b', label: PD.e8b.label }],
  ask: (v) => (v === 'turn' ? `How does the pedal's height ${T('h=17\\sin\\theta')} change as the crank turns?` : v === 'e8a' ? `Example 8(a): at what angles is the pedal 6 cm below the axle?` : 'Example 8(b): can the pedal ever be 20 cm above the axle?'),
  make(stage, v, ex) {
    const L = 24, G = new Graph(stage, { x: 6, y: 2, width: 446, height: 446, xmin: -L, xmax: L, ymin: -L, ymax: L, grid: false, numbers: false, xtitle: '', ytitle: '', pad: 14 });
    const O = G.toPx(0, 0), u = G.ux, RC = 17;
    svgEl('circle', { cx: O[0], cy: O[1], r: RC * u, class: 'u3l3-circ-d' }, G.layers.grid);
    // ruler at x = 21
    const rx = G.toPx(21, 0)[0];
    svgEl('line', { class: 'u3l3-ruler', x1: rx, x2: rx, y1: G.toPx(0, 20)[1], y2: G.toPx(0, -20)[1] }, G.layers.grid);
    for (let y = -20; y <= 20; y += 5) { const py = G.toPx(0, y)[1]; svgEl('line', { class: 'u3l3-ruler', x1: rx - 5, x2: rx + 5, y1: py, y2: py }, G.layers.grid); svgEl('text', { class: 'u3l3-rnum', x: rx + 9, y: py + 5 }, G.layers.grid).textContent = String(y).replace('-', '−'); }
    svgEl('text', { class: 'u3l3-rnum', x: rx - 4, y: G.toPx(0, 22)[1] }, G.layers.grid).textContent = 'h (cm)';
    // chainring with teeth
    const ring = svgEl('g', {}, G.layers.top);
    svgEl('circle', { class: 'u3l3-chain', cx: O[0], cy: O[1], r: 5.4 * u, 'stroke-dasharray': '5 4', 'stroke-width': 7 }, ring);
    svgEl('circle', { cx: O[0], cy: O[1], r: 4.6 * u, fill: '#eceef2', stroke: '#5b6475', 'stroke-width': 2 }, ring);
    const crank = svgEl('line', { stroke: '#3a4254', 'stroke-width': 11, 'stroke-linecap': 'round' }, G.layers.top);
    svgEl('circle', { cx: O[0], cy: O[1], r: 9, fill: '#5b6475', stroke: '#fff', 'stroke-width': 2 }, G.layers.top);
    const pd = svgEl('rect', { class: 'u3l3-pedal', width: 40, height: 14, rx: 4 }, G.layers.top);
    const hbar = svgEl('line', { stroke: LN, 'stroke-width': 2.5, 'stroke-dasharray': '6 5' }, G.layers.top);
    const hmark = svgEl('circle', { r: 6, fill: LN }, G.layers.top);
    const rotA = svgEl('path', { fill: 'none', stroke: ARM, 'stroke-width': 3 }, G.layers.top);
    const PX = 476, PW = ex.W - PX - 8, pn = panel(stage, PX, 6, PW, 436, '');
    const f0 = lineIn(pn, T('h=17\\sin\\theta'), 'u3l3-eqbig'); f0.style.opacity = 1;
    const rd = lineIn(pn, '', 'u3l3-read'); rd.style.opacity = 1; rd.style.textAlign = 'center';
    const set = (t) => {
      const x = RC * Math.cos(t * RAD), y = RC * Math.sin(t * RAD), [px, py] = G.toPx(x, y);
      crank.setAttribute('x1', O[0]); crank.setAttribute('y1', O[1]); crank.setAttribute('x2', px); crank.setAttribute('y2', py);
      pd.setAttribute('x', px - 20); pd.setAttribute('y', py - 7);
      hbar.setAttribute('x1', px); hbar.setAttribute('x2', rx); hbar.setAttribute('y1', py); hbar.setAttribute('y2', py); hmark.setAttribute('cx', rx); hmark.setAttribute('cy', py);
      const tt = ((t % 360) + 360) % 360, rho = 62, e = [O[0] + rho * Math.cos(tt * RAD), O[1] - rho * Math.sin(tt * RAD)];
      rotA.setAttribute('d', tt < 0.5 ? 'M0 0' : `M${O[0] + rho} ${O[1]}A${rho} ${rho} 0 ${tt > 180 ? 1 : 0} 0 ${e[0].toFixed(1)} ${e[1].toFixed(1)}`);
      rd.innerHTML = `θ = ${r1(tt)}° &nbsp;&nbsp; h = ${r1(17 * Math.sin(tt * RAD)).replace('-', '−')} cm`;
    };
    const t0 = 50; set(t0);
    const hl = (y0) => { const s = G.segment([-L + 1, y0], [L - 6, y0], { color: LN, dash: true, width: 3.5 }); hide(s); return s; };
    if (v === 'turn') {
      const band = svgEl('rect', { x: rx - 7, y: G.toPx(0, 17)[1], width: 14, height: 34 * u, fill: POS, 'fill-opacity': 0.35, rx: 4 }, G.layers.grid); hide(band);
      const L1 = lineIn(pn, `${T('-17\\le h\\le17')}: never more than the crank length from the axle.`, 'u3l3-line-ans');
      return [
        { cap: `The crank arm is 17 cm long. At angle ${T('\\theta')} the pedal is ${T('h=17\\sin\\theta')} cm above the axle.`, run: (c) => pulse(c, f0, 1.06) },
        { cap: `Turn it once: ${T('h')} rises to ${T('17')} at ${T('90^\\circ')}, is ${T('0')} at ${T('180^\\circ')} and is ${T('-17')} at ${T('270^\\circ')}.`, run: (c) => tween(c, 3600, (k) => set(t0 + 360 * k), (t) => t) },
        { cap: `So ${T('-17\\le h\\le17')}, because ${T('-1\\le\\sin\\theta\\le1')}.`, run: async (c) => { band.style.opacity = 1; await show(c, band); await show(c, L1); } }
      ];
    }
    if (v === 'e8a') {
      const sol = solveT('sin', -6 / 17), ts = sol.ts, Rs = r2(sol.R), line = hl(-6);
      const lab = hide(G.label(-L + 1.5, -6, T(cL('h=-6')), { pos: 'ne', cls: 'bk-ptlab', gap: 4 }));
      const dots = ts.map((t) => hide(G.point(RC * Math.cos(t * RAD), RC * Math.sin(t * RAD), { color: LN, r: 8 })));
      const ghosts = ts.map((t) => { const [px, py] = G.toPx(RC * Math.cos(t * RAD), RC * Math.sin(t * RAD)); return hide(svgEl('line', { x1: O[0], y1: O[1], x2: px, y2: py, stroke: ARM, 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-dasharray': '10 6' }, G.layers.top)); });
      const tl = ts.map((t) => hide(G.label(20.5 * Math.cos(t * RAD), 20.5 * Math.sin(t * RAD) - 1.5, T(cA(`${r1(t)}^\\circ`)), { cls: 'u3l3-alab' })));
      const L1 = lineIn(pn, T('17\\sin\\theta=-6\\ \\Rightarrow\\ \\sin\\theta=-\\tfrac{6}{17}'), 'u3l3-line-sm'), L2 = lineIn(pn, 'Negative sin: Quadrants <b>III and IV</b>', 'u3l3-line-sm');
      const L3 = lineIn(pn, T(cR(`\\theta_R=\\sin^{-1}\\!\\left(\\tfrac{6}{17}\\right)\\approx${Rs}^\\circ`)), 'u3l3-line-sm');
      const L4 = lineIn(pn, `${T(`\\theta\\approx180^\\circ+${Rs}^\\circ\\approx${r1(ts[0])}^\\circ`)}<br>${T(`\\theta\\approx360^\\circ-${Rs}^\\circ\\approx${r1(ts[1])}^\\circ`)}`, 'u3l3-line-ans u3l3-line-sm');
      return [
        { cap: `6 cm below the axle: ${T('h=-6')}. Draw that line.`, run: async (c) => { line.style.opacity = 1; await drawIn(line, 700, c); await show(c, lab); } },
        { cap: `It crosses the pedal's circle <b>twice</b>: two crank positions put the pedal at that height.`, run: async (c) => { for (const d of dots) { d.style.opacity = 1; await pop(c, d, 300); } for (const g of ghosts) await show(c, g); } },
        { cap: `${T('17\\sin\\theta=-6')}, so ${T('\\sin\\theta=-\\tfrac{6}{17}')}. Negative sine: Quadrants III and IV.`, run: async (c) => { await show(c, L1); await show(c, L2); } },
        { cap: `${T(cR(`\\theta_R=\\sin^{-1}\\!\\left(\\tfrac{6}{17}\\right)\\approx${Rs}^\\circ`))}, so ${T(`\\theta\\approx${r1(ts[0])}^\\circ`)} or ${T(`${r1(ts[1])}^\\circ`)}.`,
          run: async (c) => { await show(c, L3); await tween(c, 1500, (k) => set(t0 + (ts[0] - t0) * k)); await show(c, tl[0]); await tween(c, 1000, (k) => set(ts[0] + (ts[1] - ts[0]) * k)); await show(c, tl[1]); await show(c, L4); } }
      ];
    }
    const line = hl(20), lab = hide(G.label(-L + 1.5, 20, T(cL('h=20')), { pos: 'ne', cls: 'bk-ptlab', gap: 4 }));
    const L1 = lineIn(pn, T('17\\sin\\theta=20\\ \\Rightarrow\\ \\sin\\theta=\\tfrac{20}{17}\\approx1.18>1'), 'u3l3-line-sm');
    const L2 = lineIn(pn, '<b>No solution</b>: the pedal is never more than 17 cm (the crank length) from the axle.', 'u3l3-line-no u3l3-line-sm');
    const st = stamp(stage, 'No solution', { ok: false, x: 6 + 223, y: 372, size: 'lg' }); hide(st);
    return [
      { cap: `20 cm above the axle: the line ${T('h=20')} is above the pedal's whole circle.`, run: async (c) => { line.style.opacity = 1; await drawIn(line, 700, c); await show(c, lab); } },
      { cap: `${T('17\\sin\\theta=20')} gives ${T('\\sin\\theta=\\tfrac{20}{17}\\approx1.18')}, more than 1.`, run: (c) => show(c, L1) },
      { cap: `Sine is never more than 1: <b>no solution</b>. The highest the pedal gets is 17 cm, at ${T('90^\\circ')}.`, run: async (c) => { await tween(c, 900, (k) => set(t0 + (90 - t0) * k)); st.style.opacity = 1; await stampIn(c, st); await show(c, L2); } }
    ];
  }
};

/* =============================== Stand Up Break =============================== */
const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [28, 45, 53], [11, 60, 61], [33, 56, 65]];
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const fr = (n, d) => { const g = gcd(Math.abs(n), Math.abs(d)) || 1, s = n * d < 0 ? '-' : '', N = Math.abs(n) / g, D = Math.abs(d) / g; return D === 1 ? `${s}${N}` : `${s}\\dfrac{${N}}{${D}}`; };
standup('u3l3', {
  intro: 'At your whiteboard: quadrant first (CAST), then the reference angle, then the answer.',
  levels: {
    BEG: (r) => { // sign and reference angle
      const q = r.int(1, 4), R = r.int(11, 79), t = placeQ(R, q), f = r.pick(['sin', 'cos', 'tan']), s = sgnQ(f, q);
      return { text: `Name the quadrant of <b>${t}°</b>, then write ${T(`\\${f}${t}^\\circ`)} as the same ratio of its reference angle, with the correct sign.`, q: '',
        a: [`\\text{Quadrant ${QN[q]}},\\ \\theta_R=${refTexOf(t)}`, `\\${f}${t}^\\circ=${s > 0 ? '' : '-'}\\${f}${R}^\\circ`] };
    },
    PRG: (r) => { // solve f θ = a
      const f = r.pick(['sin', 'cos', 'tan']), a = f === 'tan' ? r.sign() * r.pick([0.35, 0.8, 1.4, 2.2, 3.6, 5.5]) : r.sign() * r.pick([0.15, 0.28, 0.37, 0.52, 0.66, 0.81, 0.93]);
      const s = solveT(f, a);
      return { text: 'Solve for θ, 0° ≤ θ < 360°, to the nearest tenth of a degree.', q: `\\${f}\\theta=${a}`,
        a: [`\\text{${a > 0 ? 'positive' : 'negative'}: Quadrants ${qList(s.qs)}}`, `\\theta_R=\\${f}^{-1}(${Math.abs(a)})\\approx${r2(s.R)}^\\circ`, `\\theta\\approx${r1(s.ts[0])}^\\circ,\\ ${r1(s.ts[1])}^\\circ`] };
    },
    MAS: (r) => {
      if (r.chance(0.5)) { // other two ratios from one
        const [p, qq, h] = r.pick(TRIPLES), q = r.int(1, 4), swap = r.chance(0.5), X = (swap ? qq : p) * SX[q], Y = (swap ? p : qq) * SY[q];
        const given = r.pick(['sin', 'cos', 'tan']), gv = { sin: fr(Y, h), cos: fr(X, h), tan: fr(Y, X) }, others = ['sin', 'cos', 'tan'].filter((f) => f !== given);
        const clueF = r.pick(others), clue = `\\${clueF}\\theta${sgnQ(clueF, q) > 0 ? '>' : '<'}0`;
        return { text: `Given ${T(`\\${given}\\theta=${gv[given]}`)} and ${T(clue)}, find the exact values of the other two ratios.`, q: '',
          a: [`\\text{Quadrant ${QN[q]}}:\\ x=${X},\\ y=${Y},\\ r=${h}`, others.map((f) => `\\${f}\\theta=${gv[f]}`).join(',\\quad ')] };
      }
      const f = r.pick(['sin', 'cos']), none = r.chance(0.2); let k, b, rhs, a;
      for (let i = 0; i < 80; i++) { k = r.pick([2, 3, 4, 5, 6]); b = r.int(1, 9); rhs = r.int(-4, 4); a = (rhs - b) / k; if (none ? Math.abs(a) > 1 : Math.abs(a) > 0.1 && Math.abs(a) < 0.95) break; }
      if (Math.abs(a) > 1) return { text: 'Solve for θ, 0° ≤ θ < 360°.', q: `${k}\\${f}\\theta+${b}=${rhs}`, a: [`\\${f}\\theta=${fr(rhs - b, k)}${a > 0 ? '>1' : '<-1'}`, '\\text{no solution}'] };
      const s = solveT(f, a);
      return { text: 'Solve for θ, 0° ≤ θ < 360°, to the nearest tenth of a degree.', q: `${k}\\${f}\\theta+${b}=${rhs}`,
        a: [`\\${f}\\theta=${fr(rhs - b, k)}`, `\\text{Quadrants ${qList(s.qs)}},\\ \\theta_R\\approx${r2(s.R)}^\\circ`, `\\theta\\approx${r1(s.ts[0])}^\\circ,\\ ${r1(s.ts[1])}^\\circ`] };
    }
  }
});

/* =============================== mount =============================== */
mountKaleidoscope();
export const explainers = mountExplainers({ castSigns, mirror, otherRatios, twoAnswers, placeR, bounds, isolate, pedal });
export const _test = { solveT, refOf, placeQ, quadOf, sgnQ, r1, r2 };
