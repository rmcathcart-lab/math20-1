/* Math 20-1 · Unit 3 · Lesson 7 — The Ambiguous Case.
 * The warm-up (Which One Doesn't Belong?) is plain markup with SVG triangles (tools/newformat/specs/u3l7.py). Explainers:
 *   swing (STAR: ∠A and b fixed, a slider sets a; side a swings from C and lands 0, 1 or 2 times on the arm, with h and b
 *     marked on the slider's ruler and the count live; acute and obtuse A; Example 4 checks),
 *   solve2 (both triangles solved side by side: count, sine law, B1 and B2 = 180° − B1, keep or reject, finish each;
 *     Example 5 and 6 checks),
 *   ferry (word problems with two positions: the ferry entering and leaving the beacon's range, the roof strut swinging
 *     onto the beam; Example 7 and 8 checks).
 * The six SSA sketches on Example 3's card are static (mountStatics).
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
 * explainer: which measurements fix a triangle?
 * ==================================================================================================== */
function plane(stage, x, y, w, hh) {
  const el = div(stage, 'u3l7-fig', '', x, y, w, hh);
  const svg = svgEl('svg', { width: w, height: hh, viewBox: `0 0 ${w} ${hh}`, class: 'u3l7-svg' }, el);
  const ov = add(el, h('div', 'u3l7-ov'));
  return { el, svg, ov };
}
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
mountStatics();
export const explainers = mountExplainers({ swing, solve2, ferry });
export const _test = { fx, fz, caseRow, SSAFig, SW, SV, WP, SIX };
