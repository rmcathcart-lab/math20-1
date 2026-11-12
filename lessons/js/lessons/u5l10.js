/* Math 20-1 · Unit 5 · Lesson 10 — Maximum and Minimum Problems: Algebraic Approach (new lesson format, 2026-11-11).
 * The warm-up is plain markup on the page (no code). Explainers:
 *   roads (the vertex three ways: one parabola in factored, general and vertex form, each road lands on the same vertex
 *     on the graph, with step numbers; Example 1(a)–(d) chips run the one road that suits each form),
 *   flight (STAR: Example 2. Complete the square, then the ball goes up and down beside the graph while the graph is
 *     traced; (b)–(e) are points on the curve; the negative root is rejected),
 *   shape (STAR, hands-on: Example 4's pen beside the river and Example 5's rectangle in a triangle. A slider changes x,
 *     the shape redraws, the area point traces A(x) and the maximum lights up),
 *   revenue (try everything: Example 6's ticket booth and revenue bars for x = −6 … 8, the zeros from the two factors,
 *     the maximum midway between them),
 *   heightLine (hands-on: Example 7(a). The line h = k slides across h = 18t − 5t²; two crossings, one at the top, or
 *     none, with the discriminant 324 − 20k live).
 * Also the Math History box (Dido's oxhide: the 250 m by 500 m rectangle, then the half circle) and the Stand Up Break.
 * Colours: the function / curve blue, the vertex and the maximum or minimum amber, zeros purple, the chosen length x
 *   green, the other side (in terms of x) burgundy, a given value red. Revenue: price burgundy, number sold green. */
import {
  h, tex, add, box, Graph, svgEl, stamp, stampIn, mountExplainers, pop, fadeIn, tween, anim, pulse, sleep, linear, COLORS, fmt
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const FN = COLORS.blue, VX = COLORS.amber, ZR = COLORS.purple, XC = COLORS.green, OC = COLORS.teal, RD = COLORS.red;
const cV = (s) => `\\textcolor{${VX}}{${s}}`, cZ = (s) => `\\textcolor{${ZR}}{${s}}`, cX = (s) => `\\textcolor{${XC}}{${s}}`;
const cO = (s) => `\\textcolor{${OC}}{${s}}`, cR = (s) => `\\textcolor{${RD}}{${s}}`, cF = (s) => `\\textcolor{${FN}}{${s}}`;
const show = (c, el) => fadeIn(c, el, 320);
const hide = (...els) => { els.forEach((e) => { if (e) { e.style.opacity = 0; if (e.label) e.label.style.opacity = 0; } }); return els[0]; };
const unhide = (el) => { if (el) { el.style.opacity = ''; if (el.label) el.label.style.opacity = ''; } return el; };
const flash = (c, el) => anim(c, el, [{ opacity: 1 }, { opacity: .3 }, { opacity: 1 }, { opacity: .3 }, { opacity: 1 }], 900);
const popP = (c, p) => { unhide(p); return Promise.all([pop(c, p), p.label ? show(c, p.label) : null]); };
const drawOn = (c, G, el, ms = 700) => { unhide(el); return G.drawIn(el, ms, c); };
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
const panel = (stage, x, y, w, hh, title, cls = '') => div(stage, 'u5l10-panel ' + cls, title ? `<div class="u5l10-ph">${title}</div>` : '', x, y, w, hh);
/* a numbered working line: the step number in a circle, the maths, an optional note; hidden until shown */
const sline = (p, n, t, note, cls = '') => {
  const d = h('div', 'u5l10-sl ' + cls, `${n ? `<b class="u5l10-n">${n}</b>` : '<i class="u5l10-n0"></i>'}<span class="u5l10-lt">${T(t)}</span>${note ? `<span class="u5l10-note">${note}</span>` : ''}`);
  p.appendChild(d); d.style.opacity = 0; return d;
};
const fk = (k) => (Math.abs(k - Math.round(k)) < 1e-6 ? String(Math.round(k)) : dec(k, 1));
const r1 = (v) => Math.round(v * 10) / 10, r2 = (v) => Math.round(v * 100) / 100;
const dec = (v, d = 1) => { const s = v.toFixed(d); return s === '-0' || /^-0\.0*$/.test(s) ? (0).toFixed(d) : s; };
const big = (v) => fmt(Math.round(v)).replace(/ /g, '\\,');   // 4 800 → '4\,800' for TeX
/* y-axis numbers with a thin space (the graph's own numbers are turned off on y) */
function yNums(G, from, to, step, f = (v) => fmt(v)) {
  for (let v = from; v <= to + 1e-9; v += step) G.label(G.win.xmin, v, f(v), { pos: 'w', cls: 'u5l10-yn', gap: 7 });
}

/* ====================================================================================================
 * explainer: the vertex three ways (roads)
 * ==================================================================================================== */
const RDS = {
  demo: {
    label: 'One parabola, three forms', f: (x) => 2 * (x - 1) * (x - 5), win: { xmin: -1, xmax: 7, ymin: -10, ymax: 12 }, yl: 2, p: 3, q: -8, a: 2,
    vlab: '(3,\\ -8)', zeros: [1, 5],
    ask: `Find the vertex of ${T('y=2(x-1)(x-5)')} three ways. The same parabola is ${T('y=2x^2-12x+10')} and ${T('y=2(x-3)^2-8')}.`,
    roads: [
      { name: 'Factored form', fx: 'y=2(x-1)(x-5)', lines: [
        ['\\text{zeros: }x=1,\\ x=5', 'each factor = 0', 'zeros', `<b>Factored form:</b> each factor gives a ${'<b class="u5l10-cz">zero</b>'}: ${T('x=1')} and ${T('x=5')}.`],
        ['x=\\dfrac{1+5}{2}=3', 'midway', 'axis', `The axis of symmetry is <b>midway</b> between the zeros: ${T('x=3')}.`],
        ['y=2(3-1)(3-5)=-8', 'substitute', 'vertex', `Substitute ${T('x=3')} for the ${T('y')}-coordinate: the vertex is ${T(cV('(3,\\ -8)'))}.`]] },
      { name: 'General form', fx: 'y=2x^2-12x+10', lines: [
        ['x=-\\dfrac{b}{2a}=-\\dfrac{-12}{2(2)}=3', '', 'axis', `<b>General form:</b> ${T('x=-\\frac{b}{2a}')} lands on the <b>same axis</b>, ${T('x=3')}.`],
        ['y=2(9)-12(3)+10=-8', 'substitute', 'vertex', `Substitute again: ${T('y=-8')}. The same vertex.`]] },
      { name: 'Vertex form', fx: 'y=2(x-3)^2-8', lines: [
        ['(p,\\ q)=(3,\\ -8)', 'read it off', 'vertex', `<b>Vertex form:</b> just read ${T('p')} and ${T('q')}. The same vertex, with no work at all.`]] }],
    verdict: `${T('a=2>0')}: the parabola opens <b>up</b>, so the vertex is a <b>minimum</b>. Minimum value ${T('-8')}, at ${T('x=3')}.`, st: 'MIN = −8'
  },
  a: {
    label: 'Example 1(a)', f: (x) => 3 * (x + 2) ** 2 - 5, win: { xmin: -6, xmax: 2, ymin: -8, ymax: 12 }, yl: 2, p: -2, q: -5, a: 3, vlab: '(-2,\\ -5)',
    ask: `Example 1(a): determine the vertex of ${T('y=3(x+2)^2-5')} and state the maximum or minimum value.`,
    roads: [{ name: 'Vertex form', fx: 'y=3(x+2)^2-5', lines: [
      ['y=3(x-(-2))^2+(-5)', 'match a(x − p)² + q', null, `<b>Vertex form.</b> Match ${T('a(x-p)^2+q')}: ${T('x+2')} is ${T('x-(-2)')}, so ${T('p=-2')}, not 2.`],
      ['(p,\\ q)=(-2,\\ -5)', 'read it off', 'vertex', `Read off the vertex: ${T(cV('(-2,\\ -5)'))}.`]] }],
    verdict: `${T('a=3>0')}: opens up, so a <b>minimum</b>. Minimum value ${T('-5')} (at ${T('x=-2')}).`, st: 'MIN = −5'
  },
  b: {
    label: 'Example 1(b)', f: (x) => -2 * x * x + 12 * x - 7, win: { xmin: -1, xmax: 7, ymin: -10, ymax: 14 }, yl: 2, p: 3, q: 11, a: -2, vlab: '(3,\\ 11)',
    ask: `Example 1(b): determine the vertex of ${T('y=-2x^2+12x-7')} and state the maximum or minimum value.`,
    roads: [{ name: 'General form', fx: 'y=-2x^2+12x-7', lines: [
      ['a=-2,\\ b=12,\\ c=-7', 'read a, b and c', null, `<b>General form.</b> Read ${T('a=-2')}, ${T('b=12')} and ${T('c=-7')}.`],
      ['x=-\\dfrac{12}{2(-2)}=3', 'the axis', 'axis', `The axis: ${T('x=-\\frac{b}{2a}=-\\frac{12}{-4}=3')}.`],
      ['y=-2(9)+36-7=11', 'substitute', 'vertex', `Substitute ${T('x=3')}: ${T('y=11')}. The vertex is ${T(cV('(3,\\ 11)'))}.`]] }],
    verdict: `${T('a=-2<0')}: opens down, so a <b>maximum</b>. Maximum value ${T('11')}.`, st: 'MAX = 11'
  },
  c: {
    label: 'Example 1(c)', f: (x) => (x - 3) * (x + 7), win: { xmin: -9, xmax: 5, ymin: -28, ymax: 8 }, yl: 4, xl: 2, ys: 2, p: -2, q: -25, a: 1, vlab: '(-2,\\ -25)', zeros: [3, -7],
    ask: `Example 1(c): determine the vertex of ${T('y=(x-3)(x+7)')} and state the maximum or minimum value.`,
    roads: [{ name: 'Factored form', fx: 'y=(x-3)(x+7)', lines: [
      ['\\text{zeros: }x=3,\\ x=-7', 'each factor = 0', 'zeros', `<b>Factored form.</b> The zeros are ${T('x=3')} and ${T('x=-7')} (watch the signs).`],
      ['x=\\dfrac{3+(-7)}{2}=-2', 'midway', 'axis', `Midway between them: ${T('x=\\frac{3+(-7)}{2}=-2')}.`],
      ['y=(-5)(5)=-25', 'substitute', 'vertex', `Substitute: ${T('y=(-2-3)(-2+7)=(-5)(5)=-25')}. The vertex is ${T(cV('(-2,\\ -25)'))}.`]] }],
    verdict: `${T('a=1>0')}: opens up, so a <b>minimum</b>. Minimum value ${T('-25')}.`, st: 'MIN = −25'
  },
  d: {
    label: 'Example 1(d)', f: (x) => 2 * x * x + 5 * x - 1, win: { xmin: -4, xmax: 2, ymin: -6, ymax: 8 }, yl: 2, p: -1.25, q: -4.125, a: 2,
    vlab: '\\left(-\\dfrac{5}{4},\\ -\\dfrac{33}{8}\\right)',
    ask: `Example 1(d): determine the vertex of ${T('y=2x^2+5x-1')} and state the maximum or minimum value.`,
    roads: [{ name: 'General form', fx: 'y=2x^2+5x-1', lines: [
      ['a=2,\\ b=5,\\ c=-1', 'read a, b and c', null, `<b>General form.</b> ${T('a=2')}, ${T('b=5')}, ${T('c=-1')}.`],
      ['x=-\\dfrac{5}{2(2)}=-\\dfrac{5}{4}', 'the axis', 'axis', `The axis: ${T('x=-\\frac{5}{4}')}, a fraction.`],
      ['y=\\dfrac{4ac-b^2}{4a}=\\dfrac{4(2)(-1)-25}{8}=-\\dfrac{33}{8}', '', 'vertex', `Substituting ${T('-\\frac{5}{4}')} means squaring a fraction. The <b>vertex formula</b> is quicker: ${T('y=-\\frac{33}{8}')}.`]] }],
    verdict: `${T('a=2>0')}: opens up, so a <b>minimum</b>. Minimum value ${T('-\\frac{33}{8}')}.`, st: 'MIN = −33/8'
  }
};
const roads = {
  title: 'The vertex three ways',
  height: 450, minW: 960,
  choices: [{ v: 'demo', label: 'One parabola, three forms' }, { sep: 'Example 1:' }, ...['a', 'b', 'c', 'd'].map((k) => ({ v: k, label: `(${k})` }))],
  ask: (v) => RDS[v].ask,
  make(stage, v, ex) {
    const d = RDS[v], W = ex.W, GW = 420;
    const G = new Graph(stage, Object.assign({ x: 2, y: 14, width: GW, height: 430, xstep: 1, ystep: d.ys || 1, ylabels: d.yl, xlabels: d.xl || 1, fontSize: 16 }, d.win));
    const curve = G.fn(d.f, { color: FN, width: 4 });
    const zs = (d.zeros || []).map((z) => hide(G.point(z, 0, { color: ZR, r: 7, label: T(cZ(`${z}`)), pos: d.a > 0 ? 'n' : 's' })));
    const axis = hide(G.vline(d.p, { color: VX, width: 2.5 }));
    const vtx = hide(G.point(d.p, d.q, { color: VX, r: 8.5, label: T(cV(d.vlab)), pos: d.a > 0 ? 's' : 'n' }));
    const PX = GW + 14, PW = W - PX - 2, single = d.roads.length === 1;
    const col = div(stage, 'u5l10-roads' + (single ? ' u5l10-one' : ''), '', PX, 4, PW, 440);
    let n = 0;
    const cards = d.roads.map((r) => {
      const cd = div(col, 'u5l10-road', `<div class="u5l10-rh"><b>${r.name}</b>${T(r.fx)}</div>`);
      cd.style.opacity = 0;
      cd.lines = r.lines.map((l) => sline(cd, ++n, l[0], l[1]));
      return cd;
    });
    const st = stamp(stage, d.st, { ok: null, x: PX + PW / 2, y: single ? 330 : 428, size: single ? 'lg' : 'sm' }); st.style.opacity = 0;
    const done = { zeros: false, axis: false, vertex: false };
    const act = async (c, a) => {
      if (!a) return;
      if (a === 'zeros') { done.zeros = true; await Promise.all(zs.map((p) => popP(c, p))); return; }
      if (a === 'axis') { if (done.axis) return flash(c, axis); done.axis = true; return drawOn(c, G, axis, 600); }
      if (a === 'vertex') { if (done.vertex) return pulse(c, vtx.label, 1.25); done.vertex = true; if (!done.axis) { done.axis = true; unhide(axis); } return popP(c, vtx); }
    };
    const steps = [];
    d.roads.forEach((r, i) => r.lines.forEach((l, j) => steps.push({
      cap: l[3],
      run: async (c) => {
        if (j === 0) { cards.forEach((cd, k) => cd.classList.toggle('on', k === i)); await show(c, cards[i]); }
        await show(c, cards[i].lines[j]); await act(c, l[2]);
      }
    })));
    steps.push({ cap: d.verdict, run: async (c) => { cards.forEach((cd) => cd.classList.remove('on')); await flash(c, curve); await stampIn(c, st); } });
    return steps;
  }
};

/* ====================================================================================================
 * explainer: the ball's flight (Example 2)
 * ==================================================================================================== */
const flight = {
  title: 'The ball and its graph',
  height: 446, minW: 960,
  ask: `Example 2: a ball's height is ${T('h(t)=-5t^2+30t+2')} metres after ${T('t')} seconds.`,
  make(stage, v, ex) {
    const W = ex.W, f = (t) => -5 * t * t + 30 * t + 2, tEnd = 3 + Math.sqrt(9.4), SX = 150, GW = 480;
    const G = new Graph(stage, { x: SX, y: 14, width: GW, height: 426, xmin: -0.6, xmax: 7, ymin: -4, ymax: 52, xstep: 1, ystep: 5, xlabels: 1, ylabels: 10, xtitle: 't', ytitle: 'h', fontSize: 16 });
    const py = (hh) => 14 + G.toPx(0, hh)[1];
    // the scene: sky, ground, a batter, the ball and a "laser" from the ball to its point on the graph
    const sc = svgEl('svg', { width: SX, height: 446, viewBox: `0 0 ${SX} 446`, class: 'u5l10-scene' }, stage); sc.style.position = 'absolute'; sc.style.left = '0px'; sc.style.top = '0px';
    svgEl('rect', { x: 6, y: 4, width: SX - 12, height: py(0) - 4, rx: 10, fill: '#eef5fd' }, sc);
    svgEl('rect', { x: 6, y: py(0), width: SX - 12, height: 446 - py(0) - 2, rx: 4, fill: '#7cb36b' }, sc);
    for (let m = 10; m <= 50; m += 10) { svgEl('line', { x1: 8, x2: 20, y1: py(m), y2: py(m), stroke: '#9aa0ab', 'stroke-width': 2 }, sc); const t = svgEl('text', { x: 24, y: py(m) + 5, class: 'u5l10-rul' }, sc); t.textContent = m + ' m'; }
    const bx = 98;
    const man = svgEl('g', { stroke: '#1c2230', 'stroke-width': 3.5, 'stroke-linecap': 'round', fill: 'none' }, sc);
    svgEl('circle', { cx: 60, cy: py(0) - 56, r: 8, fill: '#1c2230' }, man);
    svgEl('path', { d: `M60 ${py(0) - 48} L60 ${py(0) - 22} M60 ${py(0) - 22} L50 ${py(0)} M60 ${py(0) - 22} L70 ${py(0)} M60 ${py(0) - 40} L76 ${py(0) - 34}` }, man);
    svgEl('line', { x1: 74, y1: py(0) - 33, x2: 96, y2: py(0) - 52, stroke: '#a8741f', 'stroke-width': 6 }, man);
    const laser = svgEl('line', { x1: bx, x2: bx, y1: py(2), y2: py(2), stroke: FN, 'stroke-width': 2, 'stroke-dasharray': '4 5', opacity: 0.55 }, stage.appendChild(svgEl('svg', { width: W, height: 446, class: 'u5l10-laser' })));
    laser.ownerSVGElement.style.position = 'absolute'; laser.ownerSVGElement.style.left = '0px'; laser.ownerSVGElement.style.top = '0px'; laser.ownerSVGElement.style.pointerEvents = 'none';
    const ball = svgEl('g', {}, sc);
    svgEl('circle', { cx: 0, cy: 0, r: 10, fill: '#fff', stroke: '#c93a33', 'stroke-width': 2.5 }, ball);
    svgEl('path', { d: 'M-5 -8 Q0 0 -5 8 M5 -8 Q0 0 5 8', stroke: '#c93a33', 'stroke-width': 1.6, fill: 'none' }, ball);
    const tro = { from: 0, to: 0.0001, color: FN, width: 4, arrows: false };
    const trace = G.fn(f, tro);
    const P = G.point(0, 2, { color: FN, r: 7 });
    const ro = div(stage, 'u5l10-ro', '', SX + GW - 232, 20, 222);
    let tNow = 0;
    const setT = (t) => {
      tNow = t; const hh = Math.max(0, f(t));
      tro.to = Math.max(tro.to, Math.min(t, tEnd)); trace._bkDraw();
      ball.setAttribute('transform', `translate(${bx} ${py(hh) - 10})`);
      G.moveTo(P, t, hh);
      const [gx, gy] = G.toPx(t, hh); laser.setAttribute('x1', bx + 12); laser.setAttribute('y1', py(hh) - 10 + 10); laser.setAttribute('x2', SX + gx); laser.setAttribute('y2', 14 + gy);
      ro.innerHTML = `${T(`t=${dec(t, 2)}`)} s &nbsp; ${T(`h=${dec(hh, 1)}`)} m`;
    };
    setT(0);
    const go = (c, t1, ms) => { const t0 = tNow; return tween(c, ms ?? 400 + 500 * Math.abs(t1 - t0), (k) => setT(t0 + (t1 - t0) * k), linear); };
    // the working, right
    const PX = SX + GW + 10, PW = W - PX - 2;
    const pn = panel(stage, PX, 4, PW, 436, '');
    const L = [
      sline(pn, 1, 'h(t)=-5(t^2-6t)+2', ''),
      sline(pn, 2, '=-5(t^2-6t+9-9)+2', ''),
      sline(pn, 3, '=-5(t-3)^2+45+2', ''),
      sline(pn, 4, 'h(t)=-5(t-3)^2+47', '', 'u5l10-res')];
    const A = [
      sline(pn, 0, '\\text{(b) }h(1)=27\\text{ m}', '', 'u5l10-an'),
      sline(pn, 0, `\\text{(c) }${cV('47\\text{ m at }3\\text{ s}')}`, '', 'u5l10-an'),
      sline(pn, 0, '\\text{(d) }h(0)=2\\text{ m}', '', 'u5l10-an'),
      sline(pn, 0, `\\text{(e) }t\\approx${cZ('6.07')}\\text{ s}`, '', 'u5l10-an')];
    const pB = hide(G.point(1, 27, { color: FN, r: 7, label: T('(1,\\ 27)'), pos: 'se' })), gB = hide(G.guides(1, 27));
    const pV = hide(G.point(3, 47, { color: VX, r: 8.5, label: T(cV('(3,\\ 47)')), pos: 'e' }));
    const pD = hide(G.point(0, 2, { color: FN, r: 7, label: T('(0,\\ 2)'), pos: 'ne' }));
    const pE = hide(G.point(tEnd, 0, { color: ZR, r: 7.5, label: T(cZ('6.07')), pos: 'n' }));
    const pX = hide(G.point(3 - Math.sqrt(9.4), 0, { color: COLORS.gray, r: 6, open: true, label: '<span class="u5l10-rej">−0.07 ✗</span>', pos: 's' }));
    const st = stamp(stage, 'MAXIMUM', { ok: null, x: SX + GW / 2 + 130, y: 140, size: 'sm' }); st.style.opacity = 0;
    return [
      { cap: `<b>(a)</b> Complete the square. Take ${T('-5')} out of the ${T('t')} terms only: ${T('-5t^2+30t=-5(t^2-6t)')}.`, run: (c) => show(c, L[0]) },
      { cap: `Half of ${T('-6')} is ${T('-3')}, and ${T('(-3)^2=9')}: add and subtract ${T('9')} inside the bracket.`, run: (c) => show(c, L[1]) },
      { cap: `The ${T('-9')} comes out of the bracket <b>multiplied by</b> ${T('-5')}: ${T('+45')}. Vertex form: ${T('h(t)=-5(t-3)^2+47')}.`, run: async (c) => { await show(c, L[2]); await show(c, L[3]); } },
      { cap: `Now hit it! The ball goes up and comes down while its graph is drawn: the height on the left is the height of the point on the graph.`, run: (c) => go(c, tEnd, 3400) },
      { cap: `<b>(b)</b> After ${T('1')} s: ${T('h(1)=-5(1-3)^2+47=-20+47=27')} m.`, run: async (c) => { await go(c, 1, 900); await Promise.all([drawOn(c, G, gB, 500), popP(c, pB)]); await show(c, A[0]); } },
      { cap: `<b>(c)</b> The vertex ${T(cV('(3,\\ 47)'))}, with ${T('a<0')}: a <b>maximum height of 47 m after 3 s</b>.`, run: async (c) => { await go(c, 3, 700); await popP(c, pV); await stampIn(c, st); await show(c, A[1]); } },
      { cap: `<b>(d)</b> When it was hit, ${T('t=0')}: ${T('h(0)=2')} m. It starts 2 m up, not on the ground.`, run: async (c) => { await go(c, 0, 800); await popP(c, pD); await show(c, A[2]); } },
      { cap: `<b>(e)</b> On the ground, ${T('h=0')}: ${T('(t-3)^2=9.4')}, ${T('t=3\\pm3.066')}. It lands at ${T('t\\approx6.07')} s; ${T('t\\approx-0.07')} is rejected (before the hit).`, run: async (c) => { await go(c, tEnd, 1600); await popP(c, pE); await popP(c, pX); await show(c, A[3]); } }
    ];
  }
};

/* ====================================================================================================
 * explainer: shape (the pen beside the river, the rectangle in the triangle) with a slider
 * ==================================================================================================== */
function slider(stage, x, y, w, min, max, step, onInput, label) {
  const inp = h('input', 'u5l10-slider'); inp.type = 'range'; inp.min = min; inp.max = max; inp.step = step; inp.setAttribute('aria-label', label);
  box(inp, w, 36); inp.style.position = 'absolute'; add(stage, inp, x, y);
  inp.addEventListener('input', () => onInput(+inp.value));
  return inp;
}
const SH = {
  pen: { label: 'Example 4: the pen by the river', ask: `Example 4: ${T('240')} m of fence, a river along one side and a fence dividing the pen in two. Which pen has the greatest area?` },
  tri: { label: 'Example 5: rectangle in a triangle', ask: `Example 5: a rectangle in a right triangle with legs ${T('12')} cm and ${T('8')} cm, its corner on the hypotenuse. Which one has the greatest area?` }
};
const shape = {
  title: 'Change x and watch the area',
  height: 446, minW: 960,
  choices: Object.keys(SH).map((k) => ({ v: k, label: SH[k].label })),
  ask: (v) => SH[v].ask,
  make(stage, v, ex) {
    const W = ex.W, GW = 470, GX = W - GW - 2, SW = GX - 18;
    const pen = v === 'pen';
    const A = pen ? (x) => x * (240 - 3 * x) : (x) => x * (8 - 2 * x / 3);
    const X0 = pen ? 20 : 3, XMAX = pen ? 80 : 12, XV = pen ? 40 : 6, AV = A(XV);
    const G = new Graph(stage, pen
      ? { x: GX, y: 14, width: GW, height: 290, xmin: 0, xmax: 80, ymin: 0, ymax: 5400, xstep: 10, ystep: 600, xlabels: 10, ylabels: 1e9, pad: [16, 16, 32, 66], xtitle: 'x', ytitle: 'A', fontSize: 16 }
      : { x: GX, y: 14, width: GW, height: 290, xmin: 0, xmax: 12, ymin: 0, ymax: 30, xstep: 1, ystep: 5, xlabels: 2, ylabels: 1e9, pad: [16, 16, 32, 50], xtitle: 'x', ytitle: 'A', fontSize: 16 });
    if (pen) yNums(G, 1000, 5000, 1000); else yNums(G, 5, 30, 5);
    const tro = { from: X0, to: X0, color: FN, width: 4, arrows: false }, trail = hide(G.fn(A, tro));
    const Pt = hide(G.point(X0, A(X0), { color: FN, r: 7.5 }));
    const vtx = hide(G.point(XV, AV, { color: VX, r: 9, label: T(cV(pen ? '(40,\\ 4\\,800)' : '(6,\\ 24)')), pos: 'n' }));
    const zs = pen ? [] : [0, 12].map((z) => hide(G.point(z, 0, { color: ZR, r: 7, label: T(cZ(String(z))), pos: z ? 'nw' : 'ne' })));
    const ax = pen ? null : hide(G.vline(6, { color: VX, width: 2.5 }));
    const pn = panel(stage, GX, 312, GW, 132, '', 'u5l10-shp');
    const S = pen ? [
      sline(pn, 1, `${cX('x')}=\\text{each fence}\\perp\\text{river}`, ''),
      sline(pn, 2, `\\text{side}=${cO('240-3x')}`, 'no fence on the river'),
      sline(pn, 3, `A(x)=x(240-3x)=240x-3x^2`, ''),
      sline(pn, 4, `A(x)=-3(x-40)^2+4\\,800`, 'complete the square')]
      : [
        sline(pn, 1, `\\text{width}=${cX('x')}`, ''),
        sline(pn, 2, `\\dfrac{y}{12-x}=\\dfrac{8}{12}\\Rightarrow ${cO('y=8-\\tfrac{2}{3}x')}`, 'similar triangles'),
        sline(pn, 3, `A(x)=x\\left(8-\\tfrac{2}{3}x\\right)=-\\tfrac{2}{3}x^2+8x`, ''),
        sline(pn, 4, `\\text{zeros }0,\\ 12\\Rightarrow x=6`, 'midway')];
    // the scene (an SVG drawn at true scale) + an HTML layer for the labels
    const sc = svgEl('svg', { width: SW, height: 360, viewBox: `0 0 ${SW} 360`, class: 'u5l10-scene' }, stage); sc.style.position = 'absolute'; sc.style.left = '0px'; sc.style.top = '0px';
    const lay = div(stage, 'u5l10-lay', '', 0, 0, SW, 360);
    const lab = (html, cls) => div(lay, 'u5l10-slab ' + (cls || ''), html, 0, 0);
    const place = (el, x, y, ax = 0.5, ay = 0.5) => { el.style.left = x + 'px'; el.style.top = y + 'px'; el.style.translate = `${-ax * 100}% ${-ay * 100}%`; };
    let draw;
    const els = {};
    if (pen) {
      const s = (SW - 40) / 240, top = 40, cx = SW / 2;
      svgEl('rect', { x: 4, y: 6, width: SW - 8, height: 32, rx: 8, fill: '#cfe2fb' }, sc);
      const wave = svgEl('path', { d: `M10 31 ${Array.from({ length: Math.ceil(SW / 28) }, () => 'q7 -5 14 0 t14 0').join(' ')}`, fill: 'none', stroke: '#5b8fd9', 'stroke-width': 2.5 }, sc);
      wave.innerHTML = '<animateTransform attributeName="transform" type="translate" values="0 0;-28 0" dur="1.6s" repeatCount="indefinite"/>';
      const rv = svgEl('text', { x: 16, y: 22, class: 'u5l10-rv' }, sc); rv.textContent = 'river';
      els.field = svgEl('rect', { fill: '#e8f3e9' }, sc);
      els.f = [0, 1, 2].map(() => svgEl('line', { stroke: XC, 'stroke-width': 6, 'stroke-linecap': 'round' }, sc));
      els.bot = svgEl('line', { stroke: OC, 'stroke-width': 6, 'stroke-linecap': 'round' }, sc);
      els.lx = [lab(T(cX('x')), 'u5l10-big'), lab(T(cX('x')), 'u5l10-big'), lab(T(cX('x')), 'u5l10-big')];
      els.lb = lab('', '');
      // the fence budget: 240 m shared between three x's and the long side
      const BY = 236, BX = 20, BW = 240 * s;
      const bt = lab('<b>240 m of fence</b>', 'u5l10-bt'); place(bt, BX, BY - 16, 0, 1);
      els.bg = [0, 1, 2].map(() => svgEl('rect', { y: BY, height: 22, rx: 3, fill: XC }, sc));
      els.bo = svgEl('rect', { y: BY, height: 22, rx: 3, fill: OC }, sc);
      els.bl = [lab(T('3x'), 'u5l10-bl'), lab('', 'u5l10-bl')];
      els.budget = [bt, ...els.bg, els.bo, ...els.bl];
      draw = (x) => {
        const L = 240 - 3 * x, w = L * s, d = x * s, x0 = cx - w / 2, y1 = top + d;
        Object.entries({ x: x0, y: top, width: w, height: d }).forEach(([k, val]) => els.field.setAttribute(k, val));
        [x0, cx, x0 + w].forEach((fx, i) => { const l = els.f[i]; l.setAttribute('x1', fx); l.setAttribute('x2', fx); l.setAttribute('y1', top); l.setAttribute('y2', y1); });
        Object.entries({ x1: x0, x2: x0 + w, y1, y2: y1 }).forEach(([k, val]) => els.bot.setAttribute(k, val));
        place(els.lx[0], x0 - 8, top + d / 2, 1, 0.5); place(els.lx[1], cx + 8, top + d / 2, 0, 0.5); place(els.lx[2], x0 + w + 8, top + d / 2, 0, 0.5);
        els.lx.forEach((e) => (e.style.visibility = d > 18 ? '' : 'hidden'));
        els.lb.innerHTML = T(`${cO(`240-3x=${dec(L, L % 1 ? 1 : 0)}`)}\\text{ m}`); place(els.lb, cx, y1 + 8, 0.5, 0);
        let bx = BX; els.bg.forEach((r) => { r.setAttribute('x', bx); r.setAttribute('width', Math.max(0, d - 1.5)); bx += d; });
        els.bo.setAttribute('x', bx); els.bo.setAttribute('width', Math.max(0, w));
        place(els.bl[0], BX + 1.5 * d, BY + 26, 0.5, 0); els.bl[0].style.visibility = d > 12 ? '' : 'hidden';
        els.bl[1].innerHTML = T(cO('240-3x')); place(els.bl[1], bx + w / 2, BY + 26, 0.5, 0); els.bl[1].style.visibility = w > 80 ? '' : 'hidden';
        void BW;
      };
    } else {
      const s = Math.min((SW - 90) / 12, 250 / 8), O = [56, 22 + 8 * s];
      const P = (gx, gy) => [O[0] + gx * s, O[1] - gy * s];
      els.small = svgEl('path', { fill: '#fde9cf' }, sc); els.small.style.opacity = 0;
      const tri = svgEl('path', { d: `M${P(0, 0)} L${P(12, 0)} L${P(0, 8)} Z`, fill: 'none', stroke: '#1c2230', 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, sc);
      els.tri = tri;
      els.rect = svgEl('rect', { fill: '#dbe7fb', stroke: FN, 'stroke-width': 3 }, sc);
      const rm = svgEl('path', { d: `M${O[0]} ${O[1] - 14} h14 v14`, fill: 'none', stroke: '#1c2230', 'stroke-width': 2 }, sc);
      els.dot = svgEl('circle', { r: 8, fill: FN, stroke: '#fff', 'stroke-width': 2.5 }, sc);
      void rm;
      els.lx = lab('', 'u5l10-big'); els.lr = lab('', ''); els.ly = lab('', 'u5l10-big');
      const l8 = lab(T('8'), 'u5l10-big'); place(l8, O[0] - 10, O[1] - 6.5 * s, 1, 0.5);
      draw = (x) => {
        const y = 8 - 2 * x / 3, [x1, y1] = P(x, y);
        Object.entries({ x: O[0], y: y1, width: x1 - O[0], height: O[1] - y1 }).forEach(([k, val]) => els.rect.setAttribute(k, val));
        els.dot.setAttribute('cx', x1); els.dot.setAttribute('cy', y1);
        els.small.setAttribute('d', `M${x1} ${O[1]} L${P(12, 0)} L${x1} ${y1} Z`);
        els.lx.innerHTML = T(`${cX(`x=${dec(x, 1)}`)}`); place(els.lx, (O[0] + x1) / 2, O[1] + 8, 0.5, 0); els.lx.style.visibility = x1 - O[0] > 30 ? '' : 'hidden';
        els.lr.innerHTML = T('12-x'); place(els.lr, (x1 + P(12, 0)[0]) / 2, O[1] + 8, 0.5, 0); els.lr.style.visibility = P(12, 0)[0] - x1 > 50 ? '' : 'hidden';
        els.ly.innerHTML = T(cO(`y=${dec(y, 1)}`)); place(els.ly, x1 + 10, (y1 + O[1]) / 2, 0, 0.5); els.ly.style.visibility = O[1] - y1 > 24 ? '' : 'hidden';
      };
    }
    // readout and slider
    const ro = div(stage, 'u5l10-shro', '', 10, 382, SW - 10);
    let xNow = X0, lit = false;
    const set = (x) => {
      x = Math.max(pen ? 0.5 : 0.1, Math.min(XMAX - (pen ? 0.5 : 0.1), x)); xNow = x;
      draw(x);
      tro.from = Math.min(tro.from, x); tro.to = Math.max(tro.to, x); trail._bkDraw();
      G.moveTo(Pt, x, A(x));
      const near = Math.abs(x - XV) < (pen ? 0.6 : 0.12);
      Pt.querySelector('circle').setAttribute('fill', near ? VX : FN);
      (pen ? els.field : els.rect).setAttribute('fill', near && lit ? '#fbe3a6' : pen ? '#e8f3e9' : '#dbe7fb');
      const a = A(x);
      ro.innerHTML = pen
        ? `${T(`${cX(`x=${dec(x, 1)}`)}\\text{ m}`)} &nbsp; ${T(`\\text{side}=${cO(dec(240 - 3 * x, 1))}\\text{ m}`)} &nbsp; <b class="u5l10-area${near ? ' on' : ''}">${T(`A=${big(a)}\\text{ m}^2`)}</b>`
        : `${T(`${cX(`x=${dec(x, 1)}`)}`)} &nbsp; ${T(`${cO(`y=${dec(8 - 2 * x / 3, 2)}`)}`)} &nbsp; <b class="u5l10-area${near ? ' on' : ''}">${T(`A=${dec(a, 2)}\\text{ cm}^2`)}</b>`;
      if (+inp.value !== x) inp.value = x;
    };
    const inp = slider(stage, 14, 336, SW - 28, 0, XMAX, pen ? 0.5 : 0.1, (x) => { unhide(Pt); unhide(trail); set(Math.abs(x - XV) < (pen ? 1.2 : 0.25) ? XV : x); }, pen ? 'length x of each fence perpendicular to the river' : 'width x of the rectangle');
    set(X0);
    const go = (c, x1, ms) => { const x0 = xNow; return tween(c, ms ?? 500 + 2200 * Math.abs(x1 - x0) / XMAX, (k) => set(x0 + (x1 - x0) * k), linear); };
    const stp = stamp(stage, 'MAXIMUM', { ok: null, x: GX + GW / 2 + 30, y: 210, size: 'sm' }); stp.style.opacity = 0;
    if (pen) {
      els.budget.forEach((e) => (e.style.opacity = 0));
      return [
        { cap: `<b>Step 1.</b> Let ${T(cX('x'))} be the length of each fence perpendicular to the river. There are <b>three</b> of them: ${T('3x')} m of fence.`,
          run: async (c) => { await show(c, S[0]); await Promise.all([...els.f.map((l) => pulse(c, l, 1.0)), show(c, els.budget[0]), ...els.bg.map((r) => show(c, r)), show(c, els.bl[0])]); } },
        { cap: `<b>Step 2.</b> The rest of the ${T('240')} m is the side along the river: ${T(cO('240-3x'))}. No fence along the river itself.`,
          run: async (c) => { await show(c, S[1]); await Promise.all([show(c, els.bo), show(c, els.bl[1]), pulse(c, els.lb, 1.2)]); } },
        { cap: `<b>Step 3.</b> Area = length × width: ${T('A(x)=x(240-3x)=240x-3x^2')}. Each pen is a point on its graph.`,
          run: async (c) => { await show(c, S[2]); unhide(trail); await popP(c, Pt); } },
        { cap: `Slide ${T('x')} from ${T('5')} m to ${T('75')} m: a long thin pen, then a deep narrow one. The area goes <b>up, then down</b>: a parabola.`,
          run: async (c) => { await go(c, 5, 700); await go(c, 75, 3200); } },
        { cap: `<b>Step 4.</b> Complete the square: ${T('A(x)=-3(x-40)^2+4\\,800')}. The vertex is ${T(cV('(40,\\ 4\\,800)'))}.`,
          run: async (c) => { await show(c, S[3]); lit = true; await go(c, 40, 1400); await popP(c, vtx); } },
        { cap: `<b>Steps 5–6.</b> ${T('x=40')} makes sense: the long side is ${T('240-120=120')} m, and ${T('3(40)+120=240')} ✓. The pen is <b>40 m by 120 m</b>, with the maximum area <b>4 800 m²</b>.`,
          run: (c) => stampIn(c, stp) },
        { cap: `<b>Your turn:</b> drag the slider. Every other ${T('x')} gives a smaller pen.`, run: (c) => pulse(c, inp, 1.04) }
      ];
    }
    hide(Pt);
    return [
      { cap: `<b>Step 1.</b> Let the width be ${T(cX('x'))}. As ${T('x')} changes, the rectangle's top corner must stay <b>on the hypotenuse</b>.`,
        run: async (c) => { await show(c, S[0]); await go(c, 9, 1400); await go(c, 4, 1000); } },
      { cap: `<b>Step 2.</b> The small triangle beside the rectangle has the <b>same shape</b> as the whole triangle (similar): ${T('\\frac{y}{12-x}=\\frac{8}{12}')}, so ${T(cO('y=8-\\frac{2}{3}x'))}.`,
        run: async (c) => { await show(c, S[1]); await show(c, els.small); await flash(c, els.tri); } },
      { cap: `<b>Step 3.</b> ${T('A(x)=x\\left(8-\\frac{2}{3}x\\right)=-\\frac{2}{3}x^2+8x')}. Each rectangle is a point on its graph.`,
        run: async (c) => { await show(c, S[2]); unhide(trail); await popP(c, Pt); } },
      { cap: `Slide ${T('x')} from ${T('0.5')} to ${T('11.5')}: tall and thin, then wide and flat. The area rises, then falls.`,
        run: async (c) => { await go(c, 0.5, 700); await go(c, 11.5, 3200); } },
      { cap: `<b>Step 4.</b> The zeros are ${T(cZ('0'))} and ${T(cZ('12'))} (no rectangle at all), so the maximum is <b>midway</b>: ${T('x=6')}.`,
        run: async (c) => { await show(c, S[3]); await Promise.all(zs.map((p) => popP(c, p))); await drawOn(c, G, ax, 600); lit = true; await go(c, 6, 1200); await popP(c, vtx); } },
      { cap: `${T('x=6')}, ${T('y=8-4=4')}: the rectangle is <b>6 cm by 4 cm</b>, ${T('A=24\\text{ cm}^2')}.`, run: (c) => stampIn(c, stp) },
      { cap: `<b>(c)</b> The triangle is ${T('\\frac{1}{2}(12)(8)=48\\text{ cm}^2')}: the largest rectangle fills <b>exactly half</b> of it, each side half a leg. Drag the slider to try others.`,
        run: async (c) => { await flash(c, els.rect); await pulse(c, inp, 1.04); } }
    ];
  }
};

/* ====================================================================================================
 * explainer: revenue (Example 6): try every number of $5 decreases
 * ==================================================================================================== */
const revenue = {
  title: 'Try every price',
  height: 446, minW: 960,
  ask: `Example 6: ${T('900')} tickets at ${T('\\$40')}; each ${T('\\$5')} decrease sells ${T('150')} more. Which price gives the most revenue?`,
  make(stage, v, ex) {
    const W = ex.W, BW = 330, GX = BW + 14, GW = W - GX - 2;
    const R = (x) => (40 - 5 * x) * (900 + 150 * x);
    const G = new Graph(stage, { x: GX, y: 14, width: GW, height: 430, xmin: -7, xmax: 9, ymin: 0, ymax: 40000, xstep: 1, ystep: 5000, xlabels: 1, ylabels: 1e9, pad: [18, 18, 34, 84], xtitle: 'x', ytitle: 'R', fontSize: 16 });
    yNums(G, 10000, 40000, 10000, (v) => '$' + fmt(v));
    const bars = {};
    for (let x = -6; x <= 8; x++) {
      const [x0, y0] = G.toPx(x - 0.3, R(x)), [x1, y1] = G.toPx(x + 0.3, 0);
      const r = svgEl('rect', { x: x0, y: y0, width: x1 - x0, height: Math.max(0, y1 - y0), rx: 3, class: 'u5l10-bar' + (x === 0 ? ' now' : '') }, G.layers.data);
      r.style.opacity = 0; bars[x] = r;
    }
    const zs = [8, -6].map((z) => hide(G.point(z, 0, { color: ZR, r: 8, label: T(cZ(`x=${z}`)), pos: 'n' })));
    const axis = hide(G.vline(1, { color: VX, width: 2.5 }));
    const curve = hide(G.fn(R, { from: -6, to: 8, color: FN, width: 3.5, arrows: false }));
    const vt = hide(G.point(1, 36750, { color: VX, r: 8.5, label: T(cV('(1,\\ 36\\,750)')), pos: 'n' }));
    // the ticket booth
    const bo = div(stage, 'u5l10-booth', `<div class="u5l10-bf">${T(`R(x)=(${cO('40-5x')})(${cX('900+150x')})`)}</div>
      <div class="u5l10-bx"></div>
      <div class="u5l10-tag"><span class="u5l10-tagk">price</span><b class="u5l10-tp"></b><span class="u5l10-tf">${T(cO('40-5x'))}</span></div>
      <div class="u5l10-crowd"><span class="u5l10-tagk">tickets</span><b class="u5l10-tn"></b><span class="u5l10-tf">${T(cX('900+150x'))}</span><svg class="u5l10-ppl" viewBox="0 0 300 64"></svg></div>
      <div class="u5l10-rev"></div><div class="u5l10-bd"></div>`, 2, 4, BW, 440);
    const q = (s) => bo.querySelector(s), ppl = q('.u5l10-ppl');
    const people = [];
    for (let i = 0; i < 14; i++) {
      const g = svgEl('g', { transform: `translate(${12 + (i % 7) * 40} ${i < 7 ? 2 : 34})` }, ppl);
      svgEl('circle', { cx: 10, cy: 7, r: 6, fill: XC }, g); svgEl('path', { d: 'M0 30 Q0 15 10 15 Q20 15 20 30 Z', fill: XC }, g);
      people.push(g);
    }
    const bd = q('.u5l10-bd'); bd.innerHTML = T('=-750x^2+1\\,500x+36\\,000'); bd.style.opacity = 0;
    const setX = (x) => {
      const p = 40 - 5 * x, n = 900 + 150 * x;
      q('.u5l10-bx').innerHTML = `${T(`x=${x}`)} <span class="muted">${x > 0 ? `(${x} decrease${x > 1 ? 's' : ''} of $5)` : x < 0 ? `(${-x} increase${x < -1 ? 's' : ''} of $5)` : '(no change)'}</span>`;
      q('.u5l10-tp').textContent = '$' + p;
      q('.u5l10-tn').textContent = fmt(n);
      people.forEach((g, i) => (g.style.opacity = i < n / 150 ? 1 : 0.12));
      q('.u5l10-rev').innerHTML = `${T(`R=${cO(`\\$${p}`)}\\times${cX(big(n))}=${cF(`\\$${big(p * n)}`)}`)}`;
    };
    setX(0);
    const barIn = (c, x) => { setX(x); return show(c, bars[x]); };
    const st = stamp(stage, '+$750', { ok: true, x: GX + GW - 110, y: 70, size: 'lg' }); st.style.opacity = 0;
    return [
      { cap: `<b>Now</b> (${T('x=0')}): ${T('\\$40\\times900')} tickets ${T('=\\$36\\,000')}. That is the revenue today.`, run: (c) => barIn(c, 0) },
      { cap: `Try ${T('1, 2, 3, \\dots')} decreases of ${T('\\$5')}: each one brings ${T('150')} more people. The revenue rises, then falls. At ${T('x=8')} the tickets are free: ${T('\\$0')}.`,
        run: async (c) => { for (let x = 1; x <= 8; x++) { await barIn(c, x); await sleep(c, 220); } } },
      { cap: `A negative ${T('x')} is a price <b>increase</b>. At ${T('x=-6')} the price is ${T('\\$70')} and nobody buys: ${T('\\$0')}.`,
        run: async (c) => { for (let x = -1; x >= -6; x--) { await barIn(c, x); await sleep(c, 220); } } },
      { cap: `The two <b class="u5l10-cz">zeros</b> come from the two factors: ${T(`${cO('40-5x')}=0`)} gives ${T('x=8')}; ${T(`${cX('900+150x')}=0`)} gives ${T('x=-6')}.`,
        run: (c) => Promise.all(zs.map((p) => popP(c, p))) },
      { cap: `The maximum is <b>midway</b> between the zeros: ${T('x=\\frac{8+(-6)}{2}=1')}. One decrease: the price is ${T('\\$35')}.`,
        run: async (c) => { await drawOn(c, G, axis, 600); await drawOn(c, G, curve, 900); bars[1].classList.add('max'); setX(1); await popP(c, vt); } },
      { cap: `<b>(c)</b> ${T('1\\,050')} tickets at ${T('\\$35')}: ${T('\\$36\\,750')}, which is ${T('\\$750')} more than the ${T('\\$36\\,000')} now.`, run: (c) => stampIn(c, st) },
      { cap: `<b>(d)</b> Expanded, ${T('R(x)=-750x^2+1\\,500x+36\\,000')}, and ${T('x=-\\frac{1\\,500}{2(-750)}=1')} ✓. The same answer.`, run: (c) => show(c, bd) }
    ];
  }
};

/* ====================================================================================================
 * explainer: the height line (Example 7(a)): h = k across h = 18t − 5t²
 * ==================================================================================================== */
const heightLine = {
  title: 'Slide the height line',
  height: 446, minW: 960,
  ask: `Example 7(a): a stone's height is ${T('h(t)=18t-5t^2')} metres. When is it ${T('12')} m high? Can it reach ${T('20')} m?`,
  make(stage, v, ex) {
    const W = ex.W, GW = 560, f = (t) => 18 * t - 5 * t * t;
    const G = new Graph(stage, { x: 2, y: 14, width: GW, height: 430, xmin: -0.3, xmax: 4, ymin: -1, ymax: 22, xstep: 0.5, ystep: 2, xlabels: 1, ylabels: 4, xtitle: 't', ytitle: 'h', fontSize: 16 });
    G.fn(f, { from: 0, to: 3.6, color: FN, width: 4, closedA: true, closedB: true });
    const line = G.hline(0, { color: RD, dash: false, width: 3.5 });
    const lineLab = G.label(3.92, 0, '', { pos: 'nw', cls: 'bk-ptlab u5l10-hl' });
    const xs = [0, 1].map(() => G.point(0, 0, { color: RD, r: 8 }));
    const tl = [0, 1].map(() => G.label(0, 0, '', { pos: 's', cls: 'bk-ptlab u5l10-tl', gap: 12 }));
    const vtx = hide(G.point(1.8, 16.2, { color: VX, r: 8.5, label: T(cV('(1.8,\\ 16.2)')), pos: 'n' }));
    const stone = hide(G.point(0, 0, { color: '#6b6f7a', r: 10 }));
    const up = hide(G.label(0.6, 14.5, '<b>going up</b>', { cls: 'bk-ptlab u5l10-ud' })), dn = hide(G.label(3.15, 14.5, '<b>coming down</b>', { cls: 'bk-ptlab u5l10-ud' }));
    const PX = GW + 16, PW = W - PX - 2;
    const pn = panel(stage, PX, 4, PW, 440, '', 'u5l10-hpan');
    const row = (cls) => { const d = h('div', 'u5l10-hr ' + cls); pn.appendChild(d); return d; };
    const R0 = row('r0'), R1 = row('r1'), R2 = row('r2'), R3 = row('r3');
    const inp = slider(stage, PX + 14, 396, PW - 28, 0, 20, 0.1, (k) => { [R0, R1, R2, R3].forEach(unhide); set(Math.abs(k - 16.2) < 0.25 ? 16.2 : k); }, 'height of the line');
    div(stage, 'u5l10-hsl', 'height of the line', PX + 14, 372);
    let kNow = 0;
    function set(k) {
      kNow = k; line.set(k); G.moveTo(lineLab, 3.92, k); lineLab.innerHTML = T(cR(`h=${fk(k)}`));
      const D = 324 - 20 * k, Dr = Math.abs(D) < 1e-9 ? 0 : D, n = Dr > 0 ? 2 : Dr === 0 ? 1 : 0;
      const ts = n === 2 ? [(18 - Math.sqrt(D)) / 10, (18 + Math.sqrt(D)) / 10] : n === 1 ? [1.8] : [];
      xs.forEach((p, i) => { p.style.opacity = i < ts.length ? 1 : 0; if (i < ts.length) G.moveTo(p, ts[i], k); });
      tl.forEach((l, i) => { l.style.display = i < ts.length && k > 0.5 ? '' : 'none'; if (i < ts.length) { G.moveTo(l, ts[i], k); l.innerHTML = T(cR(`t\\approx${dec(ts[i], 1)}`)); } });
      R0.innerHTML = `<span class="u5l10-hk">set ${T('h(t)')} equal to it</span>${T(`18t-5t^2=${fk(k)}`)}`;
      R1.innerHTML = `<span class="u5l10-hk">standard form</span>${T(`5t^2-18t+${fk(k)}=0`)}`;
      R2.innerHTML = `<span class="u5l10-hk">discriminant</span>${T(`b^2-4ac=324-20(${fk(k)})=${fk(Dr)}`)}`;
      R2.className = 'u5l10-hr r2 ' + (n === 2 ? 'pos' : n === 1 ? 'zero' : 'neg');
      R3.innerHTML = n === 2 ? `<b>2 answers:</b> ${T(`t\\approx${dec(ts[0], 1)}\\text{ s and }${dec(ts[1], 1)}\\text{ s}`)}` : n === 1 ? `<b>1 answer:</b> ${T('t=1.8')} s (the top)` : '<b>No answer:</b> it never gets that high';
      R3.className = 'u5l10-hr r3 ' + (n === 2 ? 'pos' : n === 1 ? 'zero' : 'neg');
      if (+inp.value !== k) inp.value = k;
    }
    set(0);
    const go = (c, k1, ms) => { const k0 = kNow; return tween(c, ms ?? 400 + 120 * Math.abs(k1 - k0), (s) => set(k0 + (k1 - k0) * s), linear); };
    const st = stamp(stage, 'NO REAL ROOTS', { ok: false, x: GW / 2 + 70, y: 110, size: 'sm' }); st.style.opacity = 0;
    hide(R0, R1, R2, R3);
    return [
      { cap: `When is the stone ${T('12')} m high? Draw the line ${T(cR('h=12'))} across the graph: it crosses the parabola <b>twice</b>.`, run: async (c) => { await show(c, R0); await go(c, 12, 1500); } },
      { cap: `Set ${T('h(t)=12')} and write the equation in standard form: ${T('5t^2-18t+12=0')}.`, run: (c) => show(c, R1) },
      { cap: `Quadratic formula: ${T('b^2-4ac=324-240=84>0')}, so two roots: ${T('t=\\frac{18\\pm\\sqrt{84}}{10}')}, ${T('t\\approx0.9')} s and ${T('t\\approx2.7')} s.`, run: async (c) => { await show(c, R2); await show(c, R3); } },
      { cap: `Two answers that both make sense: ${T('0.9')} s on the way <b>up</b>, ${T('2.7')} s on the way <b>down</b>.`,
        run: async (c) => { unhide(stone); await tween(c, 3000, (s) => { const t = 3.6 * s; G.moveTo(stone, t, f(t)); if (t > 0.88) up.style.opacity = 1; if (t > 2.72) dn.style.opacity = 1; }, linear); unhide(up); unhide(dn); } },
      { cap: `Can it reach ${T('20')} m? Slide the line up. The two crossings move together, meet at the top, then there are none.`, run: (c) => go(c, 20, 2600) },
      { cap: `At ${T('20')} m: ${T('b^2-4ac=324-400<0')}, <b>no real roots</b>. No: the highest it gets is the vertex, ${T(cV('h(1.8)=16.2'))} m.`, run: async (c) => { await popP(c, vtx); await stampIn(c, st); } },
      { cap: `<b>Your turn:</b> drag the slider. Below ${T('16.2')} m: two answers. At ${T('16.2')} m: one (the top). Above: none.`, run: (c) => pulse(c, inp, 1.04) }
    ];
  }
};

/* ====================================================================================================
 * Math History: Dido's oxhide. The cord as a rectangle against the sea, then as a half circle.
 * ==================================================================================================== */
function didoCoast() {
  const svg = document.getElementById('u5l10-hist'); if (!svg) return;
  const mk = (tag, attrs, parent) => svgEl(tag, attrs, parent || svg);
  const txt = (s, attrs, parent) => { const e = mk('text', attrs, parent); e.textContent = s; return e; };
  mk('rect', { x: 0, y: 0, width: 600, height: 300, rx: 14, fill: '#fffaf1' });
  mk('path', { d: 'M0 0 H600 V58 Q450 66 300 58 T0 58 Z', fill: '#bcd6ee' });
  txt('the sea', { x: 300, y: 34, class: 'u5l10-hsea', 'text-anchor': 'middle' });
  mk('rect', { x: 0, y: 58, width: 600, height: 242, fill: '#efe2c4', opacity: 0.55 });
  const sc = 0.45, Y = 62;
  // the hide (a rough oxhide shape) and the cord
  const hideG = mk('g', {});
  mk('path', { d: 'M80 150 q-30 -40 10 -60 q30 10 60 0 q40 20 10 60 q30 30 -10 60 q-30 -10 -60 0 q-40 -20 -10 -60 Z', fill: '#b07a4a', stroke: '#7a4a26', 'stroke-width': 3 }, hideG);
  txt('one oxhide', { x: 110, y: 250, class: 'u5l10-hcap', 'text-anchor': 'middle' }, hideG);
  // the rectangle 250 by 500 (m) against the sea
  const rx0 = 34, rW = 500 * sc, rD = 250 * sc;
  const rect = mk('path', { d: `M${rx0} ${Y} V${Y + rD} H${rx0 + rW} V${Y}`, fill: 'rgba(176,122,18,.16)', stroke: '#7a4a26', 'stroke-width': 4, 'stroke-linejoin': 'round' });
  const rL = mk('g', {});
  txt('250 m', { x: rx0 + 6, y: Y + rD / 2 + 5, class: 'u5l10-hcap' }, rL);
  txt('500 m', { x: rx0 + rW / 2, y: Y + rD + 24, class: 'u5l10-hcap', 'text-anchor': 'middle' }, rL);
  txt('125 000 m²', { x: rx0 + rW / 2, y: Y + rD / 2 + 8, class: 'u5l10-hbig', 'text-anchor': 'middle' }, rL);
  // the half circle: radius 1000/π m
  const r = 1000 / Math.PI * sc, cx = 448;
  const semi = mk('path', { d: `M${cx - r} ${Y} A${r} ${r} 0 0 0 ${cx + r} ${Y}`, fill: 'rgba(176,122,18,.22)', stroke: '#b07a12', 'stroke-width': 4.5 });
  const sL = mk('g', {});
  txt('≈ 159 000 m²', { x: cx, y: Y + r / 2 + 6, class: 'u5l10-hbig u5l10-hgold', 'text-anchor': 'middle' }, sL);
  txt('a half circle', { x: cx, y: Y + r + 26, class: 'u5l10-hcap', 'text-anchor': 'middle' }, sL);
  const cord = txt('the same 1 000 m cord', { x: 300, y: 288, class: 'u5l10-hcap', 'text-anchor': 'middle' });
  const len = (p) => p.getTotalLength ? p.getTotalLength() : 1000;
  let timers = [];
  function state(k) { // 0 hide, 1 rectangle, 2 half circle
    hideG.style.opacity = k === 0 ? 1 : 0.18;
    [rect, rL].forEach((e) => (e.style.opacity = k >= 1 ? 1 : 0));
    [semi, sL].forEach((e) => (e.style.opacity = k >= 2 ? 1 : 0));
    cord.style.opacity = k >= 1 ? 1 : 0;
    [rect, semi].forEach((p) => { p.style.transition = 'none'; p.style.strokeDasharray = ''; p.style.strokeDashoffset = ''; });
  }
  function drawPath(p) {
    const L = len(p); p.style.transition = 'none'; p.style.strokeDasharray = L; p.style.strokeDashoffset = L; p.style.opacity = 1;
    p.getBoundingClientRect(); p.style.transition = 'stroke-dashoffset 2.2s ease-in-out'; p.style.strokeDashoffset = 0;
  }
  function play() {
    timers.forEach(clearTimeout); timers = [];
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { state(2); return; }
    state(0);
    timers.push(setTimeout(() => { hideG.style.transition = 'opacity .8s'; hideG.style.opacity = 0.18; cord.style.opacity = 1; drawPath(rect); }, 1400));
    timers.push(setTimeout(() => { rL.style.transition = 'opacity .6s'; rL.style.opacity = 1; }, 3800));
    timers.push(setTimeout(() => drawPath(semi), 6800));
    timers.push(setTimeout(() => { sL.style.transition = 'opacity .6s'; sL.style.opacity = 1; }, 9200));
  }
  state(2);
  svg.addEventListener('click', play);
  const btn = svg.closest('.hist-anim') && svg.closest('.hist-anim').querySelector('.hist-play'); if (btn) btn.addEventListener('click', play);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); play(); } }, { threshold: 0.5 });
    io.observe(svg);
  } else play();
}

/* =============================== Stand Up Break! (whiteboard stations; ../standup.js) ===============================
 * BEG: factored form a(x − r)(x − s): midway between the zeros. PRG: general form with x = −b/2a an integer.
 * MAS: a ball's height −5t² + bt + c: complete the square for the maximum height and when it happens. */
const sg = (n) => (n < 0 ? `-${-n}` : `+${n}`);
const coef = (a, v = 'x') => (a === 1 ? v : a === -1 ? `-${v}` : `${a}${v}`);
const sub = (p, r) => (r === 0 ? `(${p})` : `(${p}${sg(-r)})`);
const lin = (r) => (r === 0 ? 'x' : `(x${sg(-r)})`);
standup('u5l10', {
  intro: 'At your whiteboard: find the vertex the quickest way, and say whether it is a maximum or a minimum.',
  levels: {
    BEG: (r) => {
      const a = r.pick([1, 1, -1, 2, -2, 3]), m = r.int(-5, 5), d = r.int(1, 6), p = m;
      let rr = m - d, ss = m + d; if (ss === 0) [rr, ss] = [ss, rr];   // a factor x goes first: 3x(x + 10)
      const q = a * (p - rr) * (p - ss), kind = a > 0 ? 'minimum' : 'maximum';
      const A = a === 1 ? '' : a === -1 ? '-' : String(a);
      return { text: 'Find the vertex and the maximum or minimum value.', q: `y=${A}${lin(rr)}${lin(ss)}`,
        a: [`\\text{zeros: }x=${rr},\\ x=${ss}`, `\\text{axis: }x=\\frac{${rr}${ss < 0 ? `+(${ss})` : `+${ss}`}}{2}=${p}`, `y=${A}${sub(p, rr)}${sub(p, ss)}=${q}`, `\\text{vertex }(${p},\\ ${q});\\ \\text{${kind} value }{${q}}`] };
    },
    PRG: (r) => {
      const a = r.pick([1, -1, 2, -2, 3, -3]), p = r.int(-4, 4) || 2, b = -2 * a * p, c = r.int(-9, 9);
      const q = a * p * p + b * p + c, kind = a > 0 ? 'minimum' : 'maximum';
      return { text: 'Find the vertex with x = −b/(2a), and the maximum or minimum value.', q: `y=${coef(a, 'x^2')}${b ? sg(b) + 'x' : ''}${c ? sg(c) : ''}`,
        a: [`x=-\\frac{${b}}{2(${a})}=${p}`, `y=${a}(${p})^2${sg(b)}(${p})${c ? sg(c) : ''}=${q}`, `\\text{vertex }(${p},\\ ${q});\\ \\text{${kind} value }{${q}}`] };
    },
    MAS: (r) => {
      const m = r.int(1, 4), b = 10 * m, c = r.int(1, 9), mx = 5 * m * m + c;
      return { text: `A ball’s height in metres after <i>t</i> seconds is given. Complete the square to find its maximum height and when it is reached.`, q: `h(t)=-5t^2+${b}t+${c}`,
        a: [`h(t)=-5(t^2-${2 * m}t)+${c}`, `=-5(t^2-${2 * m}t+${m * m}-${m * m})+${c}`, `=-5(t-${m})^2+${5 * m * m}+${c}`, `h(t)=-5(t-${m})^2+${mx}`, `\\text{maximum height }${mx}\\text{ m after }${m}\\text{ s}`] };
    }
  }
});

/* =============================== mount =============================== */
didoCoast();
export const explainers = mountExplainers({ roads, flight, shape, revenue, heightLine });
export const _test = { RDS };
