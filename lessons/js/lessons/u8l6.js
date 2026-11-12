/* Math 20-1 · Unit 8 · Lesson 6 — Quadratic Inequalities in One Variable: Roots and Test Points.
 * New lesson format (2026-11-11): the warm-up ("The Painted Cube") is plain markup on the page (no code). Explainers:
 *   shadow  (STAR: the part of the parabola that answers the inequality glows and casts a shadow straight down onto a
 *            number line under the graph, so the solution appears under it with open or closed dots; "flip" the sign and
 *            the outside pieces cast the shadow instead; with a line y = 5, the part above the line; Examples 1, 2),
 *   calc    (the four calculator steps with step numbers on a TI-84 screen: zero at each x-intercept, read above/below,
 *            then the exact roots from the quadratic formula; Example 3(a), (b)),
 *   tests   (the five-step roots-and-test-points procedure with step numbers: the roots split a number line, a pin drops
 *            into each interval, the interval table fills in, the true intervals stay; Examples 4, 5(a), 5(b), 6(a), 6(b)),
 *   oneroot (the shadow again for a double root and for no roots: all but one, one value, nothing, everything; then the
 *            parabola slides up and down and the shadow of the part on or below the axis grows, shrinks to a point and
 *            disappears; Example 7),
 *   apps    (k: the discriminant graphed against k while a little parabola y = x² + kx + 9 changes in step with it, then
 *            the shadows; w: the shadow −7 ≤ w ≤ 3, the negative widths crossed out, and a rectangle that grows until its
 *            area passes 21; Example 8).
 * Colours: the parabola blue, roots orange, a comparison line purple, the solution (glow, shadow, number-line pieces,
 *   true test points) green, false test points red, restrictions red hatching. */
import { h, tex, add, box, mountExplainers, pop, fadeIn, appear, tween, anim, svgEl, sleep, linear, COLORS,
  Graph, NumberLine, stamp, stampIn, num, calcNum } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const BL = COLORS.blue, OR = '#d9730d', GRN = '#12805a', HALO = '#3ddc97', RD = COLORS.red, PU = COLORS.purple, GR = '#9aa0ab';
const R = '\\in\\mathbb{R}';
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const unhide = (el) => { if (el) el.style.opacity = 1; return el; };
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
/* a work line with its step number beside it (n = '' for a plain line, a word for a word badge) */
const wl = (p, n, html, note, cls = '') => {
  const badge = n === '' ? '<b class="u8l6-sn" style="visibility:hidden"></b>' : `<b class="u8l6-sn${/^\d$/.test(String(n)) ? '' : ' u8l6-snx'}">${n}</b>`;
  const d = h('div', 'u8l6-wl ' + cls, `${badge}<span class="u8l6-lt">${html}${note ? `<span class="u8l6-note">${note}</span>` : ''}</span>`);
  p.appendChild(d); return hide(d);
};
const flick = (c, el) => anim(c, el, [{ opacity: 1 }, { opacity: 0.4 }, { opacity: 1 }, { opacity: 0.55 }, { opacity: 1 }], 900);

/* =============================== the shadow scene: a graph with a number line under it =============================== */
let SID = 0;
class Scene {
  constructor(stage, o) {
    const { x = 4, y = 4, w = 560, gh = 350, gap = 4, win, xl = 1, yl = 2, fs = 15, xtitle = 'x', ytitle = 'y', P = 24, xstep = 1, ystep = 1, nlStep } = o;
    this.win = win; this.w = w;
    this.G = new Graph(stage, { x, y, width: w, height: gh, xmin: win[0], xmax: win[1], ymin: win[2], ymax: win[3], xstep, ystep, xlabels: xl, ylabels: yl, fontSize: fs, pad: [28, P, 14, P], xtitle, ytitle });
    this.NL = new NumberLine(stage, { x, y: y + gh + gap, width: w, height: 66, min: win[0], max: win[1], step: xstep, labelStep: nlStep || xl, pad: P, axisY: 24, fontSize: fs });
    this.ay = gh + gap + 24;
    this.H = this.ay + 30;
    const ov = this.ov = svgEl('svg', { class: 'u8l6-ov', width: w, height: this.H, viewBox: `0 0 ${w} ${this.H}` });
    ov.style.left = x + 'px'; ov.style.top = y + 'px'; stage.appendChild(ov);
    const id = 'u8l6g' + (++SID), cid = 'u8l6c' + SID, pid = 'u8l6p' + SID, defs = svgEl('defs', {}, ov);
    const gr = svgEl('linearGradient', { id, x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    svgEl('stop', { offset: 0, 'stop-color': HALO, 'stop-opacity': 0.5 }, gr); svgEl('stop', { offset: 1, 'stop-color': GRN, 'stop-opacity': 0.17 }, gr);
    const pat = svgEl('pattern', { id: pid, width: 12, height: 12, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, defs);
    svgEl('rect', { width: 12, height: 12, fill: RD, 'fill-opacity': 0.07 }, pat);
    svgEl('line', { x1: 0, y1: 0, x2: 0, y2: 12, stroke: RD, 'stroke-width': 3, 'stroke-opacity': 0.45 }, pat);
    this.grad = `url(#${id})`; this.hatchFill = `url(#${pid})`;
    this.clip = svgEl('rect', { x: -40, y: 0, width: w + 80, height: this.H }, svgEl('clipPath', { id: cid }, defs));
    this.gHatch = svgEl('g', {}, ov);
    this.gSh = svgEl('g', { 'clip-path': `url(#${cid})` }, ov);
    this.gGl = svgEl('g', {}, ov); this.gBar = svgEl('g', {}, ov);
  }
  X(v) { return this.G.toPx(v, 0)[0]; }
  Yc(y) { const w = this.win; return this.G.toPx(0, Math.max(w[2], Math.min(w[3], y)))[1]; }
  samples(f, a, b, N = 150) { const lo = Math.max(a, this.win[0]), hi = Math.min(b, this.win[1]), out = []; for (let i = 0; i <= N; i++) { const x = lo + (hi - lo) * i / N; out.push([x, f(x)]); } return out; }
  glowPiece(f, p) {
    const g = svgEl('g', {}, this.gGl);
    if (p.a === p.b) { const [px, py] = this.G.toPx(p.a, f(p.a)); svgEl('circle', { cx: px, cy: py, r: 18, fill: HALO, 'fill-opacity': 0.45 }, g); svgEl('circle', { cx: px, cy: py, r: 8, fill: GRN, stroke: '#fff', 'stroke-width': 2 }, g); return g; }
    const [, , y0, y1] = this.win, runs = []; let cur = null;
    for (const [x, y] of this.samples(f, p.a, p.b)) { if (y >= y0 - 1e-9 && y <= y1 + 1e-9) { if (!cur) runs.push(cur = []); cur.push(this.G.toPx(x, y)); } else cur = null; }
    const d = runs.filter((r) => r.length > 1).map((r) => 'M' + r.map((q) => q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join('L')).join('');
    if (!d) return g;
    svgEl('path', { d, fill: 'none', stroke: HALO, 'stroke-width': 20, 'stroke-opacity': 0.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    svgEl('path', { d, fill: 'none', stroke: GRN, 'stroke-width': 6.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    return g;
  }
  shadowPiece(f, p) {
    if (p.a === p.b) { const px = this.X(p.a), py = this.Yc(f(p.a)); return svgEl('rect', { x: px - 7, y: py, width: 14, height: Math.max(0, this.ay - py), fill: this.grad }, this.gSh); }
    const pts = this.samples(f, p.a, p.b).map(([x, y]) => [this.X(x), this.Yc(y)]), l = pts[pts.length - 1];
    const d = 'M' + pts.map((q) => q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join('L') + `L${l[0].toFixed(1)} ${this.ay}L${pts[0][0].toFixed(1)} ${this.ay}Z`;
    return svgEl('path', { d, fill: this.grad }, this.gSh);
  }
  topOf(f, p) { return Math.min(...this.samples(f, p.a === p.b ? p.a : p.a, p.b, 60).map(([, y]) => this.Yc(y))); }
  dot(g, v, open) { svgEl('circle', { cx: this.X(v), cy: this.ay, r: 9, fill: open ? '#fff' : GRN, stroke: open ? GRN : '#fff', 'stroke-width': open ? 3.5 : 2 }, g); }
  bar(p) {
    const g = svgEl('g', {}, this.gBar), ay = this.ay, [x0, x1] = this.win, ext = 16;
    if (p.a === p.b) { this.dot(g, p.a, false); return g; }
    const fa = Number.isFinite(p.a) && p.a >= x0, fb = Number.isFinite(p.b) && p.b <= x1;
    const A = fa ? this.X(p.a) : this.X(x0) - ext, B = fb ? this.X(p.b) : this.X(x1) + ext;
    svgEl('line', { x1: fa ? A : A + 4, x2: fb ? B : B - 4, y1: ay, y2: ay, stroke: GRN, 'stroke-width': 8 }, g);
    if (!fa) svgEl('polygon', { points: `${A - 12},${ay} ${A + 5},${ay - 10} ${A + 5},${ay + 10}`, fill: GRN }, g);
    if (!fb) svgEl('polygon', { points: `${B + 12},${ay} ${B - 5},${ay - 10} ${B - 5},${ay + 10}`, fill: GRN }, g);
    if (fa) this.dot(g, p.a, p.oa); if (fb) this.dot(g, p.b, p.ob);
    return g;
  }
  async light(c, f, pieces) {
    const gs = pieces.map((p) => hide(this.glowPiece(f, p)));
    await Promise.all(gs.map((g) => appear(c, g, 450)));
    await Promise.all(gs.map((g) => flick(c, g)));
  }
  async drop(c, f, pieces, ms = 1000) {
    const top = Math.min(...pieces.map((p) => this.topOf(f, p)));
    this.clip.setAttribute('height', 0);
    pieces.forEach((p) => this.shadowPiece(f, p));
    const bars = pieces.map((p) => hide(this.bar(p)));
    await tween(c, ms, (t) => { this.clip.setAttribute('y', top - 4); this.clip.setAttribute('height', (this.ay + 14 - top) * t + 4); }, linear);
    this.clip.setAttribute('y', 0); this.clip.setAttribute('height', this.H);
    await Promise.all(bars.map((b) => appear(c, b, 380)));
  }
  set(f, pieces) { this.clear(); this.clip.setAttribute('y', 0); this.clip.setAttribute('height', this.H); pieces.forEach((p) => { this.glowPiece(f, p); this.shadowPiece(f, p); this.bar(p); }); }
  clear() { this.gSh.innerHTML = ''; this.gGl.innerHTML = ''; this.gBar.innerHTML = ''; }
  hatch(a, b) {
    const [x0, y0] = this.G.toPx(Math.max(a, this.win[0]), this.win[3]), x1 = this.X(Math.min(b, this.win[1]));
    return svgEl('rect', { x: x0 - (a <= this.win[0] ? 20 : 0), y: y0, width: x1 - x0 + (a <= this.win[0] ? 20 : 0), height: this.ay + 16 - y0, fill: this.hatchFill }, this.gHatch);
  }
}
const ruleBox = (host) => div(host, 'u8l6-rules', '<span><i></i>open dot: <b>&lt;</b> or <b>&gt;</b></span><span><i class="f"></i>closed dot: <b>≤</b> or <b>≥</b></span>');
/* a panel block: the inequality, where to look, and (later) the set */
const block = (host, tag, ineq, where, set) => {
  const b = hide(div(host, 'u8l6-blk', ''));
  b.innerHTML = `<div class="u8l6-ineq"><b>${tag}</b>${T(ineq)}</div>`;
  const wh = hide(div(b, 'u8l6-where', where)), st = hide(div(b, 'u8l6-set', T(set)));
  return { b, wh, st };
};

/* =============================== explainer: the shadow on the number line (STAR) =============================== */
const OUT = (lo, hi, closed) => [{ a: -Infinity, b: lo, ob: !closed }, { a: hi, b: Infinity, oa: !closed }];
const IN = (lo, hi, closed) => [{ a: lo, b: hi, oa: !closed, ob: !closed }];
const f1 = (x) => x * x - x - 12, f2 = (x) => -x * x + 2 * x + 8;
const SH = {
  e1: { label: 'Example 1', f: f1, ft: 'x^2-x-12', win: [-5.5, 6.5, -14, 9], ystep: 2, yl: 4, roots: [-3, 4], flab: [4.55, 7.2],
    ask: `Example 1: use the graph of ${T('y=x^2-x-12')} to solve (b) ${T('x^2-x-12<0')} and (c) ${T('x^2-x-12\\ge0')}.`,
    cap0: `Graph ${T('y=x^2-x-12')}. Its x-intercepts, ${T('-3')} and ${T('4')}, are the roots of ${T('x^2-x-12=0')}: that answers (a).`,
    parts: [
      { tag: '(b)', ineq: 'x^2-x-12<0', where: 'below the x-axis', pieces: IN(-3, 4, false), set: `\\{x\\mid -3<x<4,\\ x${R}\\}`,
        capL: `(b) ${T('x^2-x-12<0')}: where is the graph <b>below</b> the x-axis? That part lights up.`,
        capD: `It casts a shadow straight down onto the number line: every x between ${T('-3')} and ${T('4')}. <b>Open dots</b>: at a root the value is 0, and ${T('0<0')} is false.` },
      { tag: '(c)', ineq: 'x^2-x-12\\ge0', where: 'on or above the x-axis', pieces: OUT(-3, 4, true), set: `\\{x\\mid x\\le-3\\ \\text{or}\\ x\\ge4,\\ x${R}\\}`,
        capL: `(c) Flip the sign: ${T('x^2-x-12\\ge0')} is the part <b>on or above</b> the axis, the two outside pieces.`,
        capD: `Two shadows, joined by <b>or</b>. <b>Closed dots</b>: ${T('\\ge')} includes the roots, where the value is 0.` }] },
  e2: { label: 'Example 2(a), (b)', f: f2, ft: '-x^2+2x+8', win: [-3.5, 5.5, -7, 11], ystep: 1, yl: 2, roots: [-2, 4], flab: [4.45, -6.1],
    ask: `Example 2: use the graph of ${T('y=-x^2+2x+8')} to solve (a) ${T('-x^2+2x+8>0')} and (b) ${T('-x^2+2x+8\\le0')}.`,
    cap0: `Graph ${T('y=-x^2+2x+8')}. It opens <b>down</b>, and its x-intercepts are ${T('-2')} and ${T('4')}.`,
    parts: [
      { tag: '(a)', ineq: '-x^2+2x+8>0', where: 'above the x-axis', pieces: IN(-2, 4, false), set: `\\{x\\mid -2<x<4,\\ x${R}\\}`,
        capL: `(a) ${T('-x^2+2x+8>0')}: the part <b>above</b> the axis. This parabola opens down, so that is the middle.`,
        capD: `Its shadow: every x between ${T('-2')} and ${T('4')}, with <b>open dots</b> (${T('>')} leaves out the roots).` },
      { tag: '(b)', ineq: '-x^2+2x+8\\le0', where: 'on or below the x-axis', pieces: OUT(-2, 4, true), set: `\\{x\\mid x\\le-2\\ \\text{or}\\ x\\ge4,\\ x${R}\\}`,
        capL: `(b) ${T('-x^2+2x+8\\le0')}: the part <b>on or below</b> the axis, the two outside pieces.`,
        capD: `Two shadows joined by <b>or</b>, with <b>closed dots</b> (${T('\\le')} includes the roots).` }] },
  e2c: { label: '(c)', f: f2, ft: '-x^2+2x+8', win: [-3.5, 5.5, -7, 11], ystep: 1, yl: 2, roots: [-2, 4], flab: [4.45, -6.1], line: 5, meet: [-1, 3],
    ask: `Example 2(c): use the graph of ${T('y=-x^2+2x+8')} to solve ${T('-x^2+2x+8>5')}.`,
    cap0: `Graph ${T('y=-x^2+2x+8')} again, and draw the line ${T('y=5')}.`,
    capM: `The line meets the graph where ${T('-x^2+2x+8=5')}: at ${T('x=-1')} and ${T('x=3')}. Check: ${T('-1-2+8=5')} and ${T('-9+6+8=5')}.`,
    parts: [
      { tag: '(c)', ineq: '-x^2+2x+8>5', where: 'above the line y = 5', pieces: IN(-1, 3, false), set: `\\{x\\mid -1<x<3,\\ x${R}\\}`,
        capL: `${T('-x^2+2x+8>5')}: where is the graph <b>above the line</b>? That part lights up.`,
        capD: `Its shadow: every x between ${T('-1')} and ${T('3')}, open dots. Here we compare with the line, not the x-axis.` }] }
};
const shadow = {
  title: 'The shadow on the number line',
  height: 476, minW: 940,
  choices: Object.keys(SH).map((k) => ({ v: k, label: SH[k].label })),
  ask: (v) => SH[v].ask,
  make(stage, v, ex) {
    const d = SH[v], W = ex.W, f = d.f;
    const S = new Scene(stage, { x: 4, y: 4, w: 560, gh: 362, win: d.win, ystep: d.ystep, yl: d.yl, fs: 15 }), G = S.G;
    const cv = hide(G.fn(f, { color: BL, width: 4 }));
    const cl = hide(G.label(d.flab[0], d.flab[1], T('y=' + d.ft), { pos: 'w', color: BL, cls: 'bk-ptlab' }));
    const rts = d.roots.map((r) => hide(G.point(r, 0, { color: OR, r: 7 })));
    const P = div(stage, 'u8l6-panel', '', 580, 4, W - 584, 468);
    div(P, 'u8l6-ph', 'Solve from the graph');
    const blks = d.parts.map((p) => block(P, p.tag, p.ineq, p.where, p.set));
    ruleBox(P);
    let ln = null, mp = [], gd = [];
    if (d.line != null) {
      ln = hide(G.hline(d.line, { color: PU, width: 3.5, dash: true }));
      mp = d.meet.map((m) => hide(G.point(m, d.line, { color: PU, r: 7 })));
      gd = d.meet.map((m) => hide(G.segment([m, d.line], [m, d.win[2]], { color: PU, width: 2, dash: '5 6' })));
      hide(G.label(d.win[0] + 0.15, d.line + 0.25, T('y=5'), { pos: 'ne', color: PU, cls: 'bk-ptlab' })).classList.add('u8l6-l5');
    }
    const lab5 = stage.querySelector('.u8l6-l5');
    const steps = [{ cap: d.cap0, run: async (c) => {
      unhide(cv); await G.drawIn(cv, 900, c); await show(c, cl);
      if (ln) { unhide(ln); await G.drawIn(ln, 600, c); await show(c, lab5); }
      else for (const p of rts) { unhide(p); await pop(c, p); } } }];
    if (d.line != null) steps.push({ cap: d.capM, run: async (c) => { for (const p of mp) { unhide(p); await pop(c, p); } for (const g of gd) { unhide(g); await G.drawIn(g, 450, c); } } });
    d.parts.forEach((p, i) => {
      steps.push({ cap: p.capL, run: async (c) => {
        if (i) { S.clear(); blks[i - 1].b.classList.add('u8l6-old'); }
        await show(c, blks[i].b); await show(c, blks[i].wh); await S.light(c, f, p.pieces); } });
      steps.push({ cap: p.capD, run: async (c) => { await S.drop(c, f, p.pieces); await show(c, blks[i].st); } });
    });
    return steps;
  }
};

/* =============================== explainer: on the graphing calculator =============================== */
const CL = {
  a: { label: 'Example 3(a)', f: (x) => x * x - 4 * x - 3, s1: 'x^2-4x-3>0', s1n: 'already done', y1: 'X²−4X−3', y1t: 'X^2-4X-3',
    z: [2 - Math.sqrt(7), 2 + Math.sqrt(7)], zr: ['-0.6', '4.6'], pieces: 'out',
    cap4: `The parabola opens up and we want ${T('>0')}: it is <b>above</b> the axis <b>outside</b> the zeros.`,
    where: 'above the axis, outside the zeros', approx: `\\{x\\mid x<-0.6\\ \\text{or}\\ x>4.6,\\ x${R}\\}`,
    qf: 'x=\\frac{4\\pm\\sqrt{16+12}}{2}=2\\pm\\sqrt7', qfs: '2\\pm\\sqrt7', exact: `\\{x\\mid x<2-\\sqrt7\\ \\text{or}\\ x>2+\\sqrt7,\\ x${R}\\}`,
    ask: `Example 3(a): solve ${T('x^2-4x-3>0')} with a graphing calculator, to the nearest tenth. Then give the exact solution.` },
  b: { label: '(b)', f: (x) => 2 * x * x - 5 * x - 4, s1: '2x^2-5x-4\\le0', s1n: 'subtract 5x and 4', y1: '2X²−5X−4', y1t: '2X^2-5X-4',
    z: [(5 - Math.sqrt(57)) / 4, (5 + Math.sqrt(57)) / 4], zr: ['-0.6', '3.1'], pieces: 'in',
    cap4: `The parabola opens up and we want ${T('\\le0')}: it is <b>on or below</b> the axis <b>between</b> the zeros.`,
    where: 'on or below the axis, between the zeros', approx: `\\{x\\mid -0.6\\le x\\le3.1,\\ x${R}\\}`,
    qf: 'x=\\frac{5\\pm\\sqrt{25+32}}{4}=\\frac{5\\pm\\sqrt{57}}{4}', qfs: '\\frac{5\\pm\\sqrt{57}}{4}', exact: `\\left\\{x\\;\\middle|\\;\\tfrac{5-\\sqrt{57}}{4}\\le x\\le\\tfrac{5+\\sqrt{57}}{4},\\ x${R}\\right\\}`,
    ask: `Example 3(b): solve ${T('2x^2\\le5x+4')} with a graphing calculator, to the nearest tenth. Then give the exact solution.` }
};
const calc = {
  title: 'On the graphing calculator',
  height: 470, minW: 940,
  choices: Object.keys(CL).map((k) => ({ v: k, label: CL[k].label })),
  ask: (v) => CL[v].ask,
  make(stage, v, ex) {
    const d = CL[v], W = ex.W;
    const G = new Graph(stage, { x: 4, y: 30, width: 470, height: 380, xmin: -10, xmax: 10, ymin: -10, ymax: 10, theme: 'calc' });
    div(stage, 'u8l6-ph', 'ZStandard window: −10 to 10', 8, 6);
    const cv = hide(G.fn(d.f, { width: 3 }));
    const zp = d.z.map((z) => hide(G.point(z, 0, { color: OR, r: 6.5 })));
    const sh = d.pieces === 'out'
      ? [G.shadeX(-Infinity, d.z[0], { openB: true, color: GRN, width: 8, opacity: 0.85 }), G.shadeX(d.z[1], Infinity, { openA: true, color: GRN, width: 8, opacity: 0.85 })]
      : [G.shadeX(d.z[0], d.z[1], { color: GRN, width: 8, opacity: 0.85 })];
    sh.forEach(hide);
    const P = div(stage, 'u8l6-panel', '', 490, 4, W - 494, 462);
    div(P, 'u8l6-ph', 'Calculator steps');
    const L1 = wl(P, 1, T(d.s1), d.s1n), L2 = wl(P, 2, `<span class="u8l6-y1"><b>Y₁=</b>${d.y1}</span>`);
    const L3 = wl(P, 3, `zero: ${T('x\\approx' + d.zr[0])} and ${T('x\\approx' + d.zr[1])}`);
    const L4 = wl(P, 4, `${d.where}:<br>${T(d.approx)} <span class="muted">(approx.)</span>`);
    const L5 = wl(P, 'exact', `Quadratic formula: ${T(d.qf)}<br><span class="u8l6-ans">${T(d.exact)}</span>`);
    return [
      { cap: `<b>(1)</b> Move every term to one side: ${T(d.s1)}.`, run: (c) => show(c, L1) },
      { cap: `<b>(2)</b> Graph ${T('Y_1=' + d.y1t)} in the standard window.`, run: async (c) => { await show(c, L2); unhide(cv); await G.drawIn(cv, 900, c); } },
      { cap: `<b>(3)</b> 2nd CALC <b>zero</b>, once for each x-intercept: ${T('x\\approx' + d.zr[0])} and ${T('x\\approx' + d.zr[1])} to the nearest tenth.`, run: async (c) => {
        for (const [i, p] of zp.entries()) { unhide(p); await pop(c, p); G.readout('Zero', { x: d.z[i], y: 0 }, { pos: 'tr' }); await sleep(c, 900); }
        await show(c, L3); } },
      { cap: `<b>(4)</b> ${d.cap4}`, run: async (c) => { G.readout(null); for (const s of sh) { unhide(s); await G.drawIn(s, 600, c); } await show(c, L4); } },
      { cap: `<b>Exact:</b> the quadratic formula gives the same roots exactly, ${T('x=' + d.qfs)}. The calculator’s ${calcNum(d.z[0])} is only a rounded ${T(d.qfs.replace('\\pm', '-'))}.`, run: (c) => show(c, L5) }
    ];
  }
};

/* =============================== explainer: roots and test points (the procedure) =============================== */
const TP = {
  e4: { label: 'Example 4', ask: `Example 4: solve ${T('x^2-3x-10>0')} using roots and test points.`,
    c1: `${T('x^2-3x-10>0')} already has 0 on one side.`, s1: 'x^2-3x-10>0', s1n: 'already done',
    s2: ['(x-5)(x+2)=0'], roots: [-2, 5], rl: ['-2', '5'], nl: [-4, 7], tests: [-3, 0, 6],
    sub: ['9+9-10=8', '-10', '36-18-10=8'], ct: ['9+9-10=8>0', '-10>0', '36-18-10=8>0'], ok: [1, 0, 1],
    vh: `Value of ${T('x^2-3x-10')}`, qh: `Is it ${T('>0')}?`, op: '>', closed: false, set: `\\{x\\mid x<-2\\ \\text{or}\\ x>5,\\ x${R}\\}` },
  e5a: { label: 'Example 5(a)', ask: `Example 5(a): solve ${T('2x^2+5x\\le3')} using roots and test points.`,
    c1: `Get 0 on one side: subtract 3, so ${T('2x^2+5x-3\\le0')}.`, s1: '2x^2+5x-3\\le0', s1n: 'subtract 3',
    s2: ['(2x-1)(x+3)=0'], roots: [-3, 0.5], rl: ['-3', '\\tfrac12'], nl: [-5, 3], tests: [-4, 0, 1],
    sub: ['32-20-3=9', '-3', '2+5-3=4'], ct: ['32-20-3=9\\le0', '-3\\le0', '2+5-3=4\\le0'], ok: [0, 1, 0],
    vh: `Value of ${T('2x^2+5x-3')}`, qh: `Is it ${T('\\le0')}?`, op: '\\le', closed: true, set: `\\left\\{x\\;\\middle|\\;-3\\le x\\le\\tfrac12,\\ x${R}\\right\\}` },
  e5b: { label: '(b)', ask: `Example 5(b): solve ${T('15+2x-x^2<0')} using roots and test points.`,
    c1: `${T('15+2x-x^2<0')} already has 0 on one side.`, s1: '15+2x-x^2<0', s1n: 'already done',
    s2: ['15+2x-x^2=0', '\\Rightarrow x^2-2x-15=0', '(x-5)(x+3)=0'], roots: [-3, 5], rl: ['-3', '5'], nl: [-5, 7], tests: [-4, 0, 6],
    sub: ['15-8-16=-9', '15', '15+12-36=-9'], ct: ['15-8-16=-9<0', '15<0', '15+12-36=-9<0'], ok: [1, 0, 1],
    vh: `Value of ${T('15+2x-x^2')}`, qh: `Is it ${T('<0')}?`, op: '<', closed: false, set: `\\{x\\mid x<-3\\ \\text{or}\\ x>5,\\ x${R}\\}`,
    note: 'The test points go into the original inequality.' },
  e6a: { label: 'Example 6(a)', ask: `Example 6(a): solve ${T('x(x+4)\\ge5')}.`,
    c1: `Expand and subtract 5: ${T('x^2+4x-5\\ge0')}.`, s1: 'x^2+4x-5\\ge0', s1n: 'expand, subtract 5',
    s2: ['(x+5)(x-1)=0'], roots: [-5, 1], rl: ['-5', '1'], nl: [-7, 3], tests: [-6, 0, 2],
    sub: ['-6(-2)=12', '0', '2(6)=12'], ct: ['-6(-2)=12\\ge5', '0\\ge5', '2(6)=12\\ge5'], ok: [1, 0, 1],
    vh: `Value of ${T('x(x+4)')}`, qh: `Is it ${T('\\ge5')}?`, op: '\\ge', closed: true, set: `\\{x\\mid x\\le-5\\ \\text{or}\\ x\\ge1,\\ x${R}\\}` },
  e6b: { label: '(b)', ask: `Example 6(b): solve ${T('(x-2)^2<3x-2')}.`,
    c1: `Expand and collect: ${T('x^2-4x+4-3x+2<0')}, so ${T('x^2-7x+6<0')}.`, s1: 'x^2-7x+6<0', s1n: 'expand, collect',
    s2: ['(x-1)(x-6)=0'], roots: [1, 6], rl: ['1', '6'], nl: [-1, 8], tests: [0, 2, 7],
    sub: ['4<-2', '0<4', '25<19'], ct: ['(0-2)^2=4<-2', '(2-2)^2=0<4', '(7-2)^2=25<19'], ok: [0, 1, 0],
    vh: `${T('(x-2)^2')} and ${T('3x-2')}`, qh: 'Is it true?', op: '<', closed: false, set: `\\{x\\mid 1<x<6,\\ x${R}\\}` }
};
const tests = {
  title: 'Roots and test points',
  height: 470, minW: 940,
  choices: Object.keys(TP).map((k) => ({ v: k, label: TP[k].label })),
  ask: (v) => TP[v].ask,
  make(stage, v, ex) {
    const d = TP[v], W = ex.W, RX = 392, RW = W - RX - 4, [r1, r2] = d.roots;
    // left: the procedure, one numbered line per step
    const P = div(stage, 'u8l6-panel', '', 4, 4, RX - 16, 462);
    div(P, 'u8l6-ph', 'Roots and test points');
    const L1 = wl(P, 1, `0 on one side: ${T(d.s1)}`, d.s1n);
    const L2 = wl(P, 2, `Roots: ${d.s2.map((s) => T(s)).join('<br>')}<br>${T(`x=${d.rl[0]}`)} or ${T(`x=${d.rl[1]}`)}`);
    const L3 = wl(P, 3, 'Mark the roots: <b>three intervals</b>.');
    const L4 = wl(P, 4, `Test a point in each interval${d.note ? `<br><span class="muted">${d.note}</span>` : ''}.`);
    const L5 = wl(P, 5, `Keep the true intervals; ${d.closed ? '<b>include</b>' : '<b>exclude</b>'} the roots.<br><span class="u8l6-ans">${T(d.set)}</span>`);
    // right: the number line
    const NL = new NumberLine(stage, { x: RX, y: 4, width: RW, height: 118, min: d.nl[0], max: d.nl[1], step: 1, pad: 30, axisY: 78, fontSize: 17 });
    const ay = NL.ay, Xp = (v2) => NL.toPx(v2), E0 = Xp(d.nl[0]) - 18, E1 = Xp(d.nl[1]) + 18;
    const segs = [[E0, Xp(r1) - 11], [Xp(r1) + 11, Xp(r2) - 11], [Xp(r2) + 11, E1]].map(([a, b]) => hide(svgEl('line', { x1: a, x2: b, y1: ay, y2: ay, stroke: GR, 'stroke-width': 10, 'stroke-opacity': 0.55, 'stroke-linecap': 'round' }, NL.layers.data)));
    const rdots = d.roots.map((r) => hide(NL.point(r, { color: OR, r: 9 })));
    const rlabs = d.roots.map((r, i) => hide(NL.mark(r, d.rl[i], { pos: 'n', tex: true, lift: 12, cls: 'u8l6-rl' })));
    const pins = d.tests.map((t) => hide(div(stage, 'u8l6-pin', num(t), RX + Xp(t) - 22, 4 + ay - 50, 44)));
    // the interval table
    const ivT = [`x<${d.rl[0]}`, `${d.rl[0]}<x<${d.rl[1]}`, `x>${d.rl[1]}`];
    const tb = div(stage, 'u8l6-tt', '', RX, 134, RW);
    const cells = [];
    [['Interval', ivT.map((s) => T(s))], ['Test point', d.tests.map((t) => T(`x=${t}`))], [d.vh, d.sub.map((s) => T(s))],
      [d.qh, d.ok.map((o) => (o ? '<span class="u8l6-yes">yes</span>' : '<span class="u8l6-nope">no</span>'))]].forEach(([head, vals]) => {
      tb.appendChild(h('div', 'u8l6-th', head)); cells.push(vals.map((x) => { const e = h('div', '', `<span>${x}</span>`); tb.appendChild(e); hide(e.firstChild); return e; }));
    });
    const sol = hide(div(stage, 'u8l6-panel u8l6-big', `Solution: ${T(d.set)}`, RX, 376, RW));
    // the final pieces on the number line
    const fin = svgEl('g', {}, NL.layers.top); hide(fin);
    const okSeg = d.ok.map((o, i) => o ? i : -1).filter((i) => i >= 0);
    okSeg.forEach((i) => {
      const a = i === 0 ? E0 : Xp(d.roots[i - 1]), b = i === 2 ? E1 : Xp(d.roots[i]);
      svgEl('line', { x1: i === 0 ? a + 6 : a, x2: i === 2 ? b - 6 : b, y1: ay, y2: ay, stroke: GRN, 'stroke-width': 9 }, fin);
      if (i === 0) svgEl('polygon', { points: `${a - 10},${ay} ${a + 7},${ay - 11} ${a + 7},${ay + 11}`, fill: GRN }, fin);
      if (i === 2) svgEl('polygon', { points: `${b + 10},${ay} ${b - 7},${ay - 11} ${b - 7},${ay + 11}`, fill: GRN }, fin);
    });
    d.roots.forEach((r) => svgEl('circle', { cx: Xp(r), cy: ay, r: 9.5, fill: d.closed ? GRN : '#fff', stroke: d.closed ? '#fff' : GRN, 'stroke-width': d.closed ? 2 : 3.5 }, fin));
    const side = ['left', 'middle', 'right'];
    const steps = [
      { cap: `<b>Step 1.</b> ${d.c1}`, run: (c) => show(c, L1) },
      { cap: `<b>Step 2.</b> Solve the related equation: ${T(d.s2[d.s2.length - 1])}, so the roots are ${T(d.rl[0])} and ${T(d.rl[1])}. These are the boundary points.`, run: async (c) => {
        await show(c, L2); for (const [i, p] of rdots.entries()) { unhide(p); await pop(c, p); await show(c, rlabs[i]); } } },
      { cap: '<b>Step 3.</b> The roots split the number line into <b>three intervals</b>. On each one the expression keeps one sign.', run: async (c) => {
        await show(c, L3); for (const s of segs) { unhide(s); await anim(c, s, [{ opacity: 0 }, { opacity: 1 }], 300); }
        for (const e of cells[0]) await show(c, e.firstChild); } }
    ];
    d.tests.forEach((t, i) => steps.push({
      cap: `<b>Step 4.</b> Test ${T(`x=${t}`)} in the ${side[i]} interval: ${T(d.ct[i])}? <b>${d.ok[i] ? 'Yes' : 'No'}</b>.`,
      run: async (c) => {
        if (!i) await show(c, L4);
        const pin = pins[i]; unhide(pin); await anim(c, pin, [{ opacity: 0, transform: 'translateY(-34px)' }, { opacity: 1, transform: 'none' }], 450);
        for (const r of [1, 2]) await show(c, cells[r][i].firstChild);
        pin.classList.add(d.ok[i] ? 'ok' : 'no');
        segs[i].setAttribute('stroke', d.ok[i] ? GRN : RD); segs[i].setAttribute('stroke-opacity', d.ok[i] ? 0.8 : 0.35);
        cells[3][i].classList.add(d.ok[i] ? 'u8l6-cy' : 'u8l6-cn'); await pop(c, cells[3][i].firstChild);
      } }));
    steps.push({ cap: `<b>Step 5.</b> Keep the intervals whose test point is true. ${d.closed ? `${T(d.op)} includes the roots: <b>closed dots</b>.` : `${T(d.op)} leaves out the roots: <b>open dots</b>.`}`, run: async (c) => {
      await show(c, L5);
      segs.forEach((s, i) => { if (!d.ok[i]) anim(c, s, [{ opacity: 1 }, { opacity: 0 }], 400); else s.style.opacity = 0; });
      rdots.forEach((p) => (p.style.opacity = 0));
      unhide(fin); await appear(c, fin, 450); await show(c, sol); } });
    return steps;
  }
};

/* =============================== explainer: one or no roots (the shadow again, then the slide) =============================== */
const ON = {
  a: { label: 'Example 7(a), (b)', vx: 4, vy: 0, ft: 'x^2-8x+16', win: [-1.5, 8.5, -4, 12], slide: [0, -3, 0, 3, 0],
    ask: `Example 7: solve (a) ${T('x^2-8x+16>0')} and (b) ${T('x^2-8x+16\\le0')}.` },
  c: { label: '(c), (d)', vx: -1, vy: 4, ft: 'x^2+2x+5', win: [-5.5, 3.5, -4, 12], slide: [0, -6, 0, 2, 0],
    ask: `Example 7: solve (c) ${T('x^2+2x+5<0')} and (d) ${T('x^2+2x+5>0')}.` }
};
const oneroot = {
  title: 'One root or none',
  height: 476, minW: 940,
  choices: Object.keys(ON).map((k) => ({ v: k, label: ON[k].label })),
  ask: (v) => ON[v].ask,
  make(stage, v, ex) {
    const d = ON[v], W = ex.W, st = { s: 0 };
    const f = (x) => (x - d.vx) * (x - d.vx) + d.vy + st.s, f0 = (x) => (x - d.vx) * (x - d.vx) + d.vy;
    const S = new Scene(stage, { x: 4, y: 4, w: 560, gh: 362, win: d.win, yl: 2, fs: 15 }), G = S.G;
    const cv = hide(G.fn(f, { color: BL, width: 4 }));
    const vp = hide(G.point(d.vx, d.vy, { color: OR, r: 7 }));
    const lx = d.vx + 2.6;
    const cl = hide(G.label(lx, f0(lx), T('y=' + d.ft), { pos: 'e', color: BL, cls: 'bk-ptlab' }));
    const P = div(stage, 'u8l6-panel', '', 580, 4, W - 584, 468);
    const disc = v === 'a' ? 'b^2-4ac=64-64=0' : 'b^2-4ac=4-20=-16';
    const top = hide(div(P, 'u8l6-wl', `<span class="u8l6-lt">${T(disc)} &nbsp;<span class="u8l6-badge"></span></span>`));
    const badge = top.querySelector('.u8l6-badge');
    const nroots = (s) => { const k = d.vy + s; return Math.abs(k) < 0.05 ? 1 : k < 0 ? 2 : 0; };
    const setBadge = (n) => { badge.className = 'u8l6-badge u8l6-b' + n; badge.textContent = n === 2 ? '2 roots' : n === 1 ? '1 double root' : 'no roots'; };
    setBadge(nroots(0));
    const below = (s) => { const k = d.vy + s; if (Math.abs(k) < 0.05) return [{ a: d.vx, b: d.vx }]; if (k > 0) return []; const r = Math.sqrt(-k); return [{ a: d.vx - r, b: d.vx + r }]; };
    let steps;
    const slideStep = { cap: 'Slide the parabola: down, it crosses the axis twice and a piece dips below; up, nothing is below. The shadow shows the part <b>on or below</b> the axis.', run: async (c) => {
      S.clear(); P.querySelectorAll('.u8l6-blk').forEach((b) => b.classList.add('u8l6-old')); if (stp) stp.style.opacity = 0;
      const setS = (s) => { st.s = s; G.redraw(); G.moveTo(vp, d.vx, d.vy + s); S.set(f, below(s)); setBadge(nroots(s)); };
      for (let i = 1; i < d.slide.length; i++) { const a = d.slide[i - 1], b = d.slide[i]; await tween(c, 1500, (t) => setS(a + (b - a) * t)); await sleep(c, 450); }
      setS(0); } };
    let stp = null;
    if (v === 'a') {
      const bA = block(P, '(a)', '(x-4)^2>0', 'above the x-axis', `\\{x\\mid x\\ne4,\\ x${R}\\}`);
      const bB = block(P, '(b)', '(x-4)^2\\le0', 'on or below the x-axis', '\\{x\\mid x=4\\}');
      const pA = [{ a: -Infinity, b: 4, ob: true }, { a: 4, b: Infinity, oa: true }], pB = [{ a: 4, b: 4 }];
      steps = [
        { cap: `Graph ${T('y=x^2-8x+16=(x-4)^2')}. ${T('b^2-4ac=0')}: one <b>double root</b>, ${T('x=4')}. The graph only touches the x-axis.`, run: async (c) => {
          unhide(cv); await G.drawIn(cv, 900, c); await show(c, cl); unhide(vp); await pop(c, vp); await show(c, top); } },
        { cap: `(a) ${T('(x-4)^2>0')}: the part <b>above</b> the axis lights up, which is all of it except the vertex.`, run: async (c) => { await show(c, bA.b); await show(c, bA.wh); await S.light(c, f, pA); } },
        { cap: `Its shadow is the whole number line with a <b>hole</b> at 4: ${T(`\\{x\\mid x\\ne4,\\ x${R}\\}`)}.`, run: async (c) => { await S.drop(c, f, pA); await show(c, bA.st); } },
        { cap: `(b) ${T('(x-4)^2\\le0')}: <b>on or below</b> the axis. A square is never negative, so only the vertex counts: ${T('x=4')}, one value.`, run: async (c) => {
          S.clear(); bA.b.classList.add('u8l6-old'); await show(c, bB.b); await show(c, bB.wh); await S.light(c, f, pB); await S.drop(c, f, pB, 600); await show(c, bB.st); } },
        slideStep
      ];
    } else {
      const bC = block(P, '(c)', 'x^2+2x+5<0', 'below the x-axis: nothing', '\\text{No solution}');
      const bD = block(P, '(d)', 'x^2+2x+5>0', 'above the x-axis: all of it', `\\{x\\mid x${R}\\}`);
      const tp = hide(G.point(0, 5, { color: GRN, r: 7, label: T('(0,\\ 5)'), pos: 'e' }));
      stp = hide(stamp(stage, 'No solution', { ok: false, x: 4 + 280, y: 4 + S.ay - 6, rotate: -6 }));
      const pD = [{ a: -Infinity, b: Infinity }];
      steps = [
        { cap: `Graph ${T('y=x^2+2x+5')}. ${T('b^2-4ac=4-20=-16<0')}: <b>no roots</b>. The graph never meets the x-axis.`, run: async (c) => {
          unhide(cv); await G.drawIn(cv, 900, c); await show(c, cl); await show(c, top); } },
        { cap: `So the expression has <b>one sign everywhere</b>, and one test point decides: ${T('x=0')} gives ${T('5')}, which is positive.`, run: async (c) => { unhide(tp); await pop(c, tp); await show(c, tp.label); } },
        { cap: `(c) ${T('x^2+2x+5<0')}: nothing is below the axis, so nothing casts a shadow: <b>no solution</b>.`, run: async (c) => { await show(c, bC.b); await show(c, bC.wh); await show(c, bC.st); stp.style.opacity = 1; await stampIn(c, stp); } },
        { cap: `(d) ${T('x^2+2x+5>0')}: the whole parabola is above, so its shadow covers the whole number line: ${T(`\\{x\\mid x${R}\\}`)}, all real numbers.`, run: async (c) => {
          stp.style.opacity = 0; bC.b.classList.add('u8l6-old'); await show(c, bD.b); await show(c, bD.wh); await S.light(c, f, pD); await S.drop(c, f, pD); await show(c, bD.st); } },
        slideStep
      ];
    }
    return steps;
  }
};

/* =============================== explainer: applications =============================== */
const apps = {
  title: 'For which values?',
  height: 476, minW: 940,
  choices: [{ v: 'k', label: 'Example 8(a)' }, { v: 'w', label: '(b)' }],
  ask: (v) => (v === 'k' ? `Example 8(a): for what values of ${T('k')} does ${T('x^2+kx+9=0')} have two distinct real roots? No real roots?`
    : `Example 8(b): the length of a rectangle is 4 cm more than its width. For what widths is the area at most ${T('21\\text{ cm}^2')}?`),
  make(stage, v, ex) { return v === 'k' ? appsK(stage, ex) : appsW(stage, ex); }
};
function appsK(stage, ex) {
  const W = ex.W, f = (k) => k * k - 36, st = { k: -10 };
  const S = new Scene(stage, { x: 4, y: 4, w: 560, gh: 362, win: [-10.5, 10.5, -45, 75], xl: 2, ystep: 5, yl: 20, fs: 14, xtitle: 'k', ytitle: 'D' }), G = S.G;
  const cv = hide(G.fn(f, { color: BL, width: 4 }));
  const cl = hide(G.label(-9.6, 64, T('D=k^2-36'), { pos: 'e', color: BL, cls: 'bk-ptlab' }));
  const rts = [-6, 6].map((r) => hide(G.point(r, 0, { color: OR, r: 7 })));
  const mk = hide(G.point(-10, f(-10), { color: PU, r: 8 }));
  const P = div(stage, 'u8l6-panel', '', 580, 4, W - 584, 160);
  const L1 = wl(P, '', `Two distinct real roots: ${T('b^2-4ac>0')}`), L2 = wl(P, '', `${T('k^2-4(1)(9)>0\\Rightarrow k^2-36>0')}`);
  const L3 = wl(P, '', `Two: <span class="u8l6-ans">${T(`\\{k\\mid k<-6\\ \\text{or}\\ k>6,\\ k${R}\\}`)}</span>`);
  const L4 = wl(P, '', `None: <span class="u8l6-ans">${T(`\\{k\\mid -6<k<6,\\ k${R}\\}`)}</span>`);
  // the little parabola y = x² + kx + 9, in step with k
  const M = new Graph(stage, { x: 580, y: 172, width: W - 584, height: 236, xmin: -10, xmax: 10, ymin: -18, ymax: 14, xstep: 1, ystep: 2, xlabels: 5, ylabels: 10, fontSize: 12, pad: [22, 14, 12, 14] });
  hide(M.el);
  const mc = M.fn((x) => x * x + st.k * x + 9, { color: PU, width: 3.5 });
  const mlab = div(stage, 'u8l6-ph', `${T('y=x^2+kx+9')}`, 594, 178);
  hide(mlab);
  const rd = hide(div(stage, '', '', 580, 416, W - 584, 54)); rd.style.display = 'flex'; rd.style.alignItems = 'center'; rd.style.gap = '16px';
  rd.innerHTML = '<span class="u8l6-kread"></span><span class="u8l6-badge"></span>';
  const kr = rd.firstChild, bd = rd.lastChild;
  const setK = (k) => {
    st.k = k; M.redraw(); G.moveTo(mk, k, f(k)); kr.textContent = 'k = ' + num(Math.round(k * 10) / 10);
    const D = f(k), n = Math.abs(D) < 0.6 ? 1 : D > 0 ? 2 : 0; bd.className = 'u8l6-badge u8l6-b' + n; bd.textContent = n === 2 ? '2 x-intercepts' : n === 1 ? '1 x-intercept' : 'no x-intercepts';
  };
  setK(-10);
  const pOut = OUT(-6, 6, false), pIn = IN(-6, 6, false);
  return [
    { cap: `Two distinct real roots when ${T('b^2-4ac>0')}. Here ${T('a=1')}, ${T('b=k')}, ${T('c=9')}, so ${T('k^2-36>0')}.`, run: async (c) => { await show(c, L1); await show(c, L2); } },
    { cap: `Graph ${T('D=k^2-36')} against ${T('k')}. Its roots: ${T('k^2-36=0')}, so ${T('k=\\pm6')}.`, run: async (c) => {
      unhide(cv); await G.drawIn(cv, 900, c); await show(c, cl); for (const p of rts) { unhide(p); await pop(c, p); } } },
    { cap: `Slide ${T('k')} and watch ${T('y=x^2+kx+9')}: two x-intercepts while ${T('D')} is above the axis, one at ${T('k=\\pm6')}, none while ${T('D')} is below.`, run: async (c) => {
      await show(c, M.el); await show(c, mlab); await show(c, rd); unhide(mk); await pop(c, mk);
      await tween(c, 1800, (t) => setK(-10 + 4 * t), linear); await sleep(c, 700);
      await tween(c, 3600, (t) => setK(-6 + 12 * t), linear); await sleep(c, 700);
      await tween(c, 1800, (t) => setK(6 + 4 * t), linear); } },
    { cap: `Test ${T('k=0')}: ${T('-36>0')} is false; test ${T('k=\\pm7')}: ${T('13>0')} is true. Two distinct real roots: the shadow of the part <b>above</b> the axis.`, run: async (c) => {
      await S.light(c, f, pOut); await S.drop(c, f, pOut); await show(c, L3); } },
    { cap: `No real roots: ${T('k^2-36<0')}, the part <b>below</b> the axis. At ${T('k=\\pm6')} there is one double root.`, run: async (c) => {
      S.clear(); L3.style.opacity = 0.5; await S.light(c, f, pIn); await S.drop(c, f, pIn); await show(c, L4); } }
  ];
}
function appsW(stage, ex) {
  const W = ex.W, f = (w) => w * w + 4 * w - 21, st = { w: 2 };
  const S = new Scene(stage, { x: 4, y: 4, w: 560, gh: 362, win: [-8.5, 4.5, -27, 12], xl: 1, ystep: 3, yl: 6, fs: 14, xtitle: 'w', ytitle: 'y' }), G = S.G;
  const cv = hide(G.fn(f, { color: BL, width: 4 }));
  const cl = hide(G.label(-8.2, 9.5, T('y=w^2+4w-21'), { pos: 'e', color: BL, cls: 'bk-ptlab' }));
  const rts = [-7, 3].map((r) => hide(G.point(r, 0, { color: OR, r: 7 })));
  const mk = hide(G.point(2, f(2), { color: PU, r: 8 }));
  const P = div(stage, 'u8l6-panel', '', 580, 4, W - 584, 196);
  const L1 = wl(P, '', `${T('w(w+4)\\le21\\Rightarrow w^2+4w-21\\le0')}`);
  const L2 = wl(P, '', `${T('(w+7)(w-3)=0')}: ${T('w=-7')} or ${T('w=3')}`);
  const L3 = wl(P, '', `Test ${T('w=0')}: ${T('-21\\le0')} true: ${T('-7\\le w\\le3')}`);
  const L4 = wl(P, '', `A width is positive: <span class="u8l6-ans">${T('0<w\\le3')}</span>`);
  // the rectangle (20 px per cm)
  const RB = div(stage, 'u8l6-panel u8l6-rbox', '', 580, 210, W - 584, 262);
  const rs = svgEl('svg', { width: W - 588, height: 214, viewBox: `0 0 ${W - 588} 214` }, RB); rs.style.position = 'absolute'; rs.style.left = '0'; rs.style.top = '0';
  const U = 20, X0 = 24, Y0 = 196;
  const rect = svgEl('rect', { x: X0, fill: '#eef3ff', stroke: BL, 'stroke-width': 3 }, rs);
  const tW = svgEl('text', { 'font-size': 16, 'font-weight': 700, fill: BL, 'text-anchor': 'end' }, rs), tL = svgEl('text', { 'font-size': 16, 'font-weight': 700, fill: BL, 'text-anchor': 'middle' }, rs);
  const ar = div(RB, 'u8l6-area', '', 14, 214, W - 620);
  const setW = (w) => {
    st.w = w; const L = (w + 4) * U, Hh = w * U;
    rect.setAttribute('y', Y0 - Hh); rect.setAttribute('width', L); rect.setAttribute('height', Hh);
    tW.setAttribute('x', X0 - 4); tW.setAttribute('y', Y0 - Hh / 2 + 6); tW.textContent = num(Math.round(w * 10) / 10);
    tL.setAttribute('x', X0 + L / 2); tL.setAttribute('y', Y0 - Hh - 6); tL.textContent = num(Math.round((w + 4) * 10) / 10) + ' cm';
    const A = w * (w + 4), over = A > 21 + 1e-6;
    rect.setAttribute('stroke', over ? RD : BL); rect.setAttribute('fill', over ? '#fdecea' : '#eef3ff');
    ar.className = 'u8l6-area' + (over ? ' u8l6-over' : '');
    ar.innerHTML = `Area ${T(`=${num(Math.round(A * 100) / 100)}\\text{ cm}^2`)} ${over ? '— too big' : '✓ at most 21'}`;
    G.moveTo(mk, w, f(w));
  };
  setW(2);
  const pIn = IN(-7, 3, true), pPos = [{ a: 0, b: 3, oa: true, ob: false }];
  let hz = null;
  return [
    { cap: `Width ${T('w')}, length ${T('w+4')}. The area is at most 21: ${T('w(w+4)\\le21')}, so ${T('w^2+4w-21\\le0')}.`, run: (c) => show(c, L1) },
    { cap: `Solve ${T('w^2+4w-21=0')}: ${T('(w+7)(w-3)=0')}, so ${T('w=-7')} or ${T('w=3')}.`, run: async (c) => {
      await show(c, L2); unhide(cv); await G.drawIn(cv, 900, c); await show(c, cl); for (const p of rts) { unhide(p); await pop(c, p); } } },
    { cap: `Test ${T('w=0')}: ${T('-21\\le0')} is true, so the solution is between the roots, closed dots: ${T('-7\\le w\\le3')}.`, run: async (c) => {
      await S.light(c, f, pIn); await S.drop(c, f, pIn); await show(c, L3); } },
    { cap: `But a width is <b>positive</b>: cross out ${T('w\\le0')}. The width is more than 0 cm and at most 3 cm: ${T('0<w\\le3')}.`, run: async (c) => {
      hz = hide(S.hatch(-Infinity, 0)); await appear(c, hz, 500); await sleep(c, 400);
      S.set(f, pPos); await appear(c, S.gBar, 300); await show(c, L4); } },
    { cap: `Grow the rectangle: at ${T('w=3')} its area is ${T('3\\times7=21')}, the largest allowed. Any wider and the area is too big.`, run: async (c) => {
      unhide(mk); await pop(c, mk); await tween(c, 600, (t) => setW(2 - 1.7 * t));
      await tween(c, 2600, (t) => setW(0.3 + 2.7 * t), linear); await sleep(c, 800);
      await tween(c, 1300, (t) => setW(3 + 1.2 * t), linear); } }
  ];
}

/* =============================== Stand Up Break =============================== */
const sg = (n) => (n < 0 ? `-${-n}` : `+${n}`);
const fr = (p, q) => { const g = (a, b) => (b ? g(b, a % b) : Math.abs(a)); const k = g(p, q) || 1; p /= k; q /= k; if (q < 0) { p = -p; q = -q; } return q === 1 ? String(p) : `${p < 0 ? '-' : ''}\\tfrac{${Math.abs(p)}}{${q}}`; };
const poly = (a, b, c, v = 'x') => {
  let s = (a === 1 ? '' : a === -1 ? '-' : a) + v + '^2';
  if (b) s += (b < 0 ? '-' : '+') + (Math.abs(b) === 1 ? '' : Math.abs(b)) + v;
  if (c) s += sg(c);
  return s;
};
const lin = (m, n, v = 'x') => { let s = m ? (m === 1 ? '' : m === -1 ? '-' : m) + v : ''; if (n) s += s ? sg(n) : String(n); return s || '0'; };
const fx = (r) => (r === 0 ? 'x' : `(x${sg(-r)})`);
const OPS = ['<', '>', '\\le', '\\ge'];
const setT = (lo, hi, op) => {
  const cl = op === '\\le' || op === '\\ge', inside = op === '<' || op === '\\le', a = cl ? '\\le' : '<', b = cl ? '\\ge' : '>';
  return inside ? `\\{x\\mid ${lo}${a}x${a}${hi},\\ x${R}\\}` : `\\{x\\mid x${a}${lo}\\ \\text{or}\\ x${b}${hi},\\ x${R}\\}`;
};
/* the test line: a point between the roots, its value, true or false */
const testLine = (lo, hi, val, op) => {
  const t = Math.floor((lo + hi) / 2) > lo && Math.floor((lo + hi) / 2) < hi ? Math.floor((lo + hi) / 2) : (lo + hi) / 2;
  const v = val(t), ok = op === '<' ? v < 0 : op === '>' ? v > 0 : op === '\\le' ? v <= 0 : v >= 0;
  return [`\\text{Test } x=${num(t).replace('−', '-')}:\\ ${num(v).replace('−', '-')}${op}0\\ \\text{is ${ok ? 'true' : 'false'}, so ${ok ? 'between' : 'outside'}}`, ok];
};
standup('u8l6', {
  intro: 'At your whiteboard: get 0 on one side, find the roots, test one point between them, and write the solution in set notation.',
  levels: {
    BEG: (r) => { // (x − p)(x − q) □ 0, expanded, integer roots
      let p = r.int(-7, 6), q = r.int(-6, 8); if (p === q) q = p + 3; if (p > q) [p, q] = [q, p];
      const op = r.pick(OPS), b = -(p + q), c = p * q, val = (x) => (x - p) * (x - q);
      const [tl] = testLine(p, q, val, op);
      return { q: `${poly(1, b, c)}${op}0`, a: [`${fx(p)}${fx(q)}=0:\\ x=${p}\\ \\text{or}\\ x=${q}`, tl, setT(p, q, op)] };
    },
    PRG: (r) => { // x² □ mx + n: rearrange first
      let p = r.int(-6, 5), q = r.int(-5, 7); if (p === q) q = p + 2; if (p > q) [p, q] = [q, p];
      const op = r.pick(OPS), m = p + q, n = -p * q, val = (x) => (x - p) * (x - q);
      const [tl] = testLine(p, q, val, op);
      return { q: `x^2${op}${lin(m, n)}`, a: [`${poly(1, -m, -n)}${op}0`, `${fx(p)}${fx(q)}=0:\\ x=${p}\\ \\text{or}\\ x=${q}`, tl, setT(p, q, op)] };
    },
    MAS: (r) => {
      const op = r.pick(OPS);
      if (r.chance(0.6)) { // (kx − p)(x − q) □ 0 with a fraction root
        const k = r.pick([2, 3]); let p = r.pick([-5, -4, -2, -1, 1, 2, 4, 5].filter((t) => t % k)); const q = r.int(-5, 5) || 3;
        const a = k, b = -(k * q + p), c = p * q, rp = p / k;
        const lo = Math.min(rp, q), hi = Math.max(rp, q), loT = rp < q ? fr(p, k) : String(q), hiT = rp < q ? String(q) : fr(p, k);
        const val = (x) => (k * x - p) * (x - q), [tl] = testLine(lo, hi, val, op);
        return { q: `${poly(a, b, c)}${op}0`, a: [`(${k}x${sg(-p)})${fx(q)}=0:\\ x=${fr(p, k)}\\ \\text{or}\\ x=${q}`, tl, setT(loT, hiT, op)] };
      }
      if (r.chance(0.5)) { // (x − p)² □ 0
        const p = r.int(-6, 6) || 2, sol = op === '>' ? `\\{x\\mid x\\ne${p},\\ x${R}\\}` : op === '\\ge' ? `\\{x\\mid x${R}\\}` : op === '<' ? '\\text{No solution}' : `\\{x\\mid x=${p}\\}`;
        return { q: `${poly(1, -2 * p, p * p)}${op}0`, a: [`${fx(p)}^2${op}0\\ \\ \\text{(a double root at } x=${p})`, '\\text{A square is never negative.}', sol] };
      }
      const b = r.pick([-4, -2, 2, 4, 6]), c = b * b / 4 + r.int(1, 6), D = b * b - 4 * c, pos = op === '>' || op === '\\ge';
      return { q: `${poly(1, b, c)}${op}0`, a: [`b^2-4ac=${b * b}-${4 * c}=${D}<0:\\ \\text{no roots}`, `\\text{Test } x=0:\\ ${c}${op}0\\ \\text{is ${pos ? 'true' : 'false'}}`, pos ? `\\{x\\mid x${R}\\}\\ \\text{(all real numbers)}` : '\\text{No solution}'] };
    }
  }
});

/* =============================== mount =============================== */
export const explainers = mountExplainers({ shadow, calc, tests, oneroot, apps });
export const _test = { SH, CL, TP, ON };
