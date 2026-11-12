/* Math 20-1 · Unit 5 · Lesson 9 — Maximum and Minimum Problems: Graphical Approach.
 * New lesson format (2026-11-11): the warm-up ("The Big Throw") is plain markup on the page (no code). Explainers:
 *   flight  (STAR: Example 1. The ball goes straight up and down beside the building while a point traces h(t) at the
 *            same height; each question lights up its feature: y-intercept, vertex, zero, the line h = 15 and symmetry,
 *            then the domain and range shadows),
 *   rocket  (the calculator procedure, numbered 1–5 (Y=, WINDOW, GRAPH, 2nd CALC, read and round) on a TI-84 style
 *            screen, with the rocket flying in step with the graph; Example 2(b) value, (c) maximum, (e) zero, (f) intersect),
 *   revenue (Example 4: price × tickets as a rectangle whose area is the revenue, the R(x) graph and the TABLE filling in
 *            together; the vertex x = 8.75 is stamped "not a whole step", R(8) vs R(9) decides),
 *   gutter  (Example 6: the metal strip bends up while a point traces A(x) = x(30 − 2x); domain 0 < x < 15 (flat, folded
 *            shut), the maximum 7.5 → 112.5, and the two gutters with area 100).
 * Colours for the unit's ideas: the curve blue, the vertex (max/min) red, the y-intercept (start) green, the zeros
 *   (landing) amber, an intersection with y = k purple, domain and range burgundy. */
import {
  h, tex, fmt, add, box, Graph, ValueTable, stamp, stampIn, mountExplainers, pop, fadeIn, appear, sleep, tween, svgEl, pulse,
  linear, COLORS, extremum, zero, intersect
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const CURVE = COLORS.blue, VX = COLORS.red, YI = COLORS.green, ZR = COLORS.amber, IX = COLORS.purple, DR = COLORS.brand, INK = COLORS.ink;
const fx = (v, d = 2) => { const k = Math.pow(10, d); let s = (Math.round((v + Math.sign(v) * 1e-9) * k) / k).toFixed(d); if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, ''); return s; };
const f2 = (v) => (Math.round(v * 100) / 100).toFixed(2);
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; if (el && el.label) el.label.style.opacity = 0; return el; };
const unhide = (el) => { if (el) el.style.opacity = ''; return el; };
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
const absSvg = (stage, w, hh, x = 0, y = 0, cls = '') => { const s = svgEl('svg', { width: w, height: hh, viewBox: `0 0 ${w} ${hh}`, class: cls }, stage); s.style.position = 'absolute'; s.style.left = x + 'px'; s.style.top = y + 'px'; return s; };
const popP = (c, p) => Promise.all([pop(c, unhide(p)), p.label ? show(c, unhide(p.label)) : null]);
const drawOn = (c, G, el, ms = 700) => { unhide(el); return G.drawIn(el, ms, c); };
const keys = (...ks) => `<span class="keys">${ks.map((k) => `<kbd>${k}</kbd>`).join('')}</span>`;
const easeOut = (t) => 1 - (1 - t) * (1 - t), easeIn = (t) => t * t;

/* a ball drawn in SVG (white with red stitches) */
function ballEl(svg, r = 11) {
  const g = svgEl('g', {}, svg);
  svgEl('circle', { r, fill: '#fffdf6', stroke: '#c93a33', 'stroke-width': 3 }, g);
  svgEl('path', { d: `M${-r * 0.7} ${-r * 0.55} q${r * 0.7} ${r * 0.55} 0 ${r * 1.1} M${r * 0.7} ${-r * 0.55} q${-r * 0.7} ${r * 0.55} 0 ${r * 1.1}`, fill: 'none', stroke: '#c93a33', 'stroke-width': 1.6 }, g);
  g.at = (x, y) => g.setAttribute('transform', `translate(${x} ${y})`);
  return g;
}

/* =============================== explainer: the ball and its graph (STAR) =============================== */
const H1 = (t) => -5 * t * t + 10 * t + 15;
const flight = {
  title: 'Every question is a feature of the graph',
  height: 424, minW: 720,
  ask: () => `Example 1: a ball is thrown from the top of a building, ${T('h(t)=-5t^2+10t+15')}. Answer each question from the graph.`,
  make(stage, v, ex) {
    const W = ex.W, SW = 196, GY = 4, GH = 416;
    // the scene sits behind, the graph beside it; heights in the scene match the graph's h-axis exactly
    const sc = absSvg(stage, SW, 424, 0, 0, 'u5l9-scene');
    const G = new Graph(stage, { x: SW + 4, y: GY, width: W - SW - 6, height: GH, xmin: 0, xmax: 3.75, ymin: 0, ymax: 24, xstep: 0.5, ystep: 2, xlabels: 1, ylabels: 4,
      arrows: false, fnArrows: false, xtitle: 't\\text{ (s)}', ytitle: 'h\\text{ (m)}', fontSize: 16 });
    const py = (hh) => GY + G.toPx(0, hh)[1], gx = (t) => SW + 4 + G.toPx(t, 0)[0];
    const y0 = py(0), y15 = py(15);
    svgEl('rect', { x: 0, y: 0, width: SW, height: y0, fill: '#eaf3fb', rx: 10 }, sc);
    svgEl('rect', { x: 0, y: y0, width: SW, height: 424 - y0, fill: '#8cc084' }, sc);
    svgEl('rect', { x: 0, y: y0, width: SW, height: 4, fill: '#5f9a57' }, sc);
    svgEl('rect', { x: 18, y: y15, width: 112, height: y0 - y15, fill: '#b9a389', stroke: '#6b5a45', 'stroke-width': 3 }, sc);
    svgEl('rect', { x: 12, y: y15 - 6, width: 124, height: 8, fill: '#6b5a45' }, sc);
    for (let r = 0; r < 6; r++) for (let k = 0; k < 3; k++) {
      const wy = y15 + 14 + r * (y0 - y15 - 24) / 6;
      if (wy + 16 < y0) svgEl('rect', { x: 32 + k * 32, y: wy, width: 18, height: 16, fill: '#eaf3fb', stroke: '#6b5a45', 'stroke-width': 1.5 }, sc);
    }
    const kid = svgEl('text', { x: 116, y: y15 - 4, 'font-size': 30, 'text-anchor': 'middle' }, sc); kid.textContent = '🙋';
    const clock = div(stage, 'u5l9-clock', 't = 0.00 s', 8, 8);
    // the curve traces as the ball flies
    const fo = { from: 0, to: 0, color: CURVE, width: 4 };
    const cv = G.fn(H1, fo);
    const ov = absSvg(stage, W, 424, 0, 0, 'u5l9-over');
    const conn = svgEl('line', { stroke: '#7a8494', 'stroke-width': 2, 'stroke-dasharray': '5 5' }, ov);
    const BX = 156, ball = ballEl(ov), ghost = ballEl(ov); ghost.style.opacity = 0;
    const dot = svgEl('circle', { r: 7, fill: CURVE, stroke: '#fff', 'stroke-width': 2 }, G.layers.data); // under the feature points
    const set = (t, trace = true) => {
      const hh = H1(t), y = py(hh), x = gx(t);
      ball.at(BX, Math.min(y, y0 - 11)); const [dx, dy] = G.toPx(t, hh); dot.setAttribute('cx', dx); dot.setAttribute('cy', dy);
      conn.setAttribute('x1', BX + 12); conn.setAttribute('y1', y); conn.setAttribute('x2', x - 8); conn.setAttribute('y2', y);
      clock.innerHTML = `t = ${t.toFixed(2)} s &nbsp; h = ${fx(Math.max(0, hh), 1)} m`;
      if (trace && t > fo.to) { fo.to = t; cv._bkDraw(); }
    };
    set(0);
    // features
    const pY = hide(G.point(0, 15, { color: 'green', label: T('(0,\\ 15)'), pos: 'se' }));
    const pV = hide(G.point(1, 20, { color: 'red', label: T('(1,\\ 20)'), pos: 'n' }));
    const gV = hide(G.guides(1, 20, { color: VX }));
    const pZ = hide(G.point(3, 0, { color: 'amber', label: T('(3,\\ 0)'), pos: 'ne', gap: 4 }));
    const lK = hide(G.line([0, 15], [3.75, 15], { color: IX, width: 2.5, dash: '8 6', arrows: false }));
    const ax = hide(G.line({ x: 1 }, { color: '#7a8494', width: 2, dash: '4 6', arrows: false }));
    const pK = hide(G.point(2, 15, { color: 'purple', label: T('(2,\\ 15)'), pos: 'ne' }));
    const sym = hide(div(G.html, 'u5l9-sym', `<span>1 s</span><span>1 s</span>`, G.toPx(0, 15)[0], G.toPx(0, 15)[1] - 34, G.toPx(2, 0)[0] - G.toPx(0, 0)[0]));
    const sX = hide(G.shadeX(0, 3, { color: DR })), sY = hide(G.shadeY(0, 20, { color: DR }));
    const dr = hide(div(stage, 'u5l9-drbox', `<div><b>Domain</b><br>${T('\\{t\\mid0\\le t\\le3,\\ t\\in\\mathbb{R}\\}')}</div><div><b>Range</b><br>${T('\\{h\\mid0\\le h\\le20,\\ h\\in\\mathbb{R}\\}')}</div>`, gx(2.15), 12, W - gx(2.15) - 6));
    const tag = (txt, cls, x, y) => hide(div(stage, 'u5l9-tag ' + cls, txt, x, y));
    const tA = tag('launch: <b>15 m</b>', 'u5l9-tgy', 8, y15 - 72), tB = tag('top: <b>20 m</b> at <b>1 s</b>', 'u5l9-tgv', 8, 44), tC = tag('lands at <b>3 s</b>', 'u5l9-tgz', 8, y0 - 40);
    return [
      { cap: '<b>Throw!</b> The ball goes straight up and comes back down past the roof. Its graph shows <b>height against time</b>: a parabola.',
        run: (c) => tween(c, 3000, (u) => set(3 * u), linear) },
      { cap: `(a) At ${T('t=0')} the ball is on the roof: the <b>${T('y')}-intercept</b> ${T('(0,\\ 15)')}. It was thrown from <b>15 m</b>.`,
        run: async (c) => { set(0); await popP(c, pY); await show(c, tA); } },
      { cap: `(b) At the top it stops rising: the <b>vertex</b> ${T('(1,\\ 20)')}. The maximum height is <b>20 m</b> (the ${T('y')}-coordinate), after <b>1 s</b> (the ${T('x')}-coordinate).`,
        run: async (c) => { await tween(c, 900, (u) => set(u), easeOut); await popP(c, pV); await drawOn(c, G, gV, 500); await show(c, tB); } },
      { cap: `(c) It hits the ground when the height is 0: the positive <b>zero</b> ${T('(3,\\ 0)')}, after <b>3 s</b>.`,
        run: async (c) => { await tween(c, 1100, (u) => set(1 + 2 * u), easeIn); await popP(c, pZ); await show(c, tC); } },
      { cap: `(d) The line ${T('h=15')} meets the graph again. The axis of symmetry is ${T('t=1')}: ${T('t=0')} is 1 s before it, so the other time is 1 s after: <b>${T('t=2')} s</b>.`,
        run: async (c) => {
          await drawOn(c, G, lK, 700); await drawOn(c, G, ax, 400); await show(c, sym); await popP(c, pK);
          ghost.at(BX, y15); await appear(c, ghost); ghost.style.opacity = 0.5;
        } },
      { cap: `(e) <b>Domain</b>: launch to landing. <b>Range</b>: from the <b>ground</b> (0, not 15: the ball falls past the roof) up to the top, 20.`,
        run: async (c) => { await drawOn(c, G, sX, 600); await drawOn(c, G, sY, 600); await show(c, dr); } }
    ];
  }
};

/* =============================== explainer: the calculator, with the rocket (procedure) =============================== */
const H2 = (t) => -4.9 * t * t + 32 * t + 2.5;
const T2a = zero(H2, 6, 7), MX2 = extremum(H2, 2, 5, { max: true });
const I1 = intersect(H2, () => 30, 1), I2 = intersect(H2, () => 30, 5);
const RK = {
  b: { label: '(b) 1:value', menu: 1, ask: 'Example 2(b): how high is the rocket after 2 s?' },
  c: { label: '(c) 4:maximum', menu: 4, ask: 'Example 2(c): what is the maximum height, and when is it reached?', bounds: [2, 5, 3] },
  e: { label: '(e) 2:zero', menu: 2, ask: 'Example 2(e): how long is the rocket in the air?', bounds: [6, 7, 6.5] },
  f: { label: '(f) 5:intersect', menu: 5, ask: 'Example 2(f): when is the rocket 30 m above the ground?', y2: 30 }
};
const MENU = ['value', 'zero', 'minimum', 'maximum', 'intersect'];
const RAIL2 = ['Y=', 'WINDOW', 'GRAPH', '2nd CALC', 'Read and round'];
const WIN2 = { xmin: 0, xmax: 7, ymin: 0, ymax: 60, xscl: 1, yscl: 10 };
const rocket = {
  title: 'The calculator: Y=, WINDOW, GRAPH, CALC',
  height: 444, minW: 760,
  choices: [{ sep: 'Example 2:' }, ...Object.keys(RK).map((k) => ({ v: k, label: RK[k].label }))],
  ask: (v) => `${RK[v].ask.replace(/^(Example 2\([a-z]\))/, '<b>$1</b>')} ${T('h(t)=-4.9t^2+32t+2.5')}`,
  make(stage, v, ex) {
    const d = RK[v], W = ex.W, SW = 112, GX = SW + 14, GW = Math.round((W - SW) * 0.56), GT = 66, GH = 364, PX = GX + GW + 18;
    const rail = div(stage, 'u5l9-rail', '', 0, 2, W, 44);
    const pills = RAIL2.map((t, i) => { const p = h('div', 'u5l9-rstep', `<b>${i + 1}</b>${t}`); rail.appendChild(p); return p; });
    const on = (i) => pills.forEach((p, j) => { p.classList.toggle('on', j === i); p.classList.toggle('done', j < i); });
    const G = new Graph(stage, { x: GX, y: GT, width: GW, height: GH, theme: 'calc', xmin: -10, xmax: 10, ymin: -10, ymax: 10 });
    // the scene: heights match the final window (0 to 60 m)
    const save = Object.assign({}, G.win); Object.assign(G.win, WIN2); const sy0 = GT + G.toPx(0, 0)[1], sy60 = GT + G.toPx(0, 60)[1]; Object.assign(G.win, save);
    const py = (hh) => sy0 + (sy60 - sy0) * hh / 60;
    const sc = absSvg(stage, SW, 444, 0, 0, 'u5l9-scene');
    svgEl('rect', { x: 0, y: 52, width: SW, height: sy0 - 52, fill: '#e3eefa', rx: 10 }, sc);
    svgEl('rect', { x: 0, y: sy0, width: SW, height: 444 - sy0, fill: '#8cc084' }, sc);
    svgEl('rect', { x: 30, y: py(2.5), width: 52, height: sy0 - py(2.5), fill: '#8a6d4b' }, sc);
    [[18, 120], [70, 200], [26, 280]].forEach(([cx, cy]) => { if (cy < sy0 - 30) { svgEl('ellipse', { cx, cy, rx: 16, ry: 7, fill: '#fff' }, sc); svgEl('ellipse', { cx: cx + 12, cy: cy - 5, rx: 11, ry: 7, fill: '#fff' }, sc); } });
    const rk = div(stage, 'u5l9-rk', '<span class="u5l9-rkb">🚀</span>', 56, 0);
    const rkB = rk.firstChild;
    const placeR = (t) => {
      const hh = Math.max(0, H2(t)); rk.style.top = (py(hh) - 44) + 'px';
      rkB.style.transform = t > MX2.x ? 'rotate(135deg)' : 'rotate(-45deg)';
      hlab.innerHTML = `t = ${t.toFixed(2)} s · h = ${hh.toFixed(2)} m`;
    };
    // the screen beside: what the calculator shows on the other screens
    const P = div(stage, 'u5l9-ti', '', PX, GT - 4, W - PX - 2, GH + 8);
    const screen = (html) => { P.innerHTML = html; };
    const hlab = div(stage, 'u5l9-hlab', '', PX + 8, GT + GH - 30, W - PX - 18);
    placeR(0);
    const scrY = `<div class="u5l9-tih">Plot1 Plot2 Plot3</div><div><b class="u5l9-y1">■\\Y1=</b>−4.9X²+32X+2.5</div><div><b class="${d.y2 ? 'u5l9-y2' : ''}">${d.y2 ? '■' : ''}\\Y2=</b>${d.y2 ? d.y2 : ''}</div><div>\\Y3=</div><div>\\Y4=</div>`;
    const scrW = `<div class="u5l9-tih">WINDOW</div><div>Xmin=0</div><div>Xmax=7</div><div>Xscl=1</div><div>Ymin=0</div><div>Ymax=60</div><div>Yscl=10</div><div>Xres=1</div>`;
    const scrM = (k, extra = '') => `<div class="u5l9-tih">CALCULATE</div>${MENU.map((m, i) => `<div class="${i + 1 === k ? 'u5l9-tisel' : ''}">${i + 1}:${m}</div>`).join('')}${extra}`;
    const fo = { from: 0, to: 0, color: CURVE, width: 3 };
    const cv = G.fn(H2, fo); cv.style.opacity = 0;
    const y2 = d.y2 ? hide(G.fn(() => d.y2, { color: COLORS.red, width: 3 })) : null;
    const flyTo = (c, t1, ms, ease = linear) => { const t0 = rk._t || 0; rk._t = t1; return tween(c, ms, (u) => placeR(t0 + (t1 - t0) * u), ease); };
    const steps = [
      { cap: `${keys('Y=')} Enter the model with ${T('X')} for ${T('t')}: ${T('Y_1=-4.9X^2+32X+2.5')}${d.y2 ? `, and the height as ${T(`Y_2=${d.y2}`)}` : ''}.`,
        run: async (c) => { on(0); screen(scrY); await pulse(c, P, 1.03); } },
      { cap: `${keys('WINDOW')} From the context: time and height start at 0. The rocket lands before 7 s and stays below 60 m.`,
        run: async (c) => { on(1); screen(scrW); await G.setWindow(WIN2, c, 900); } },
      { cap: `${keys('GRAPH')} The graph draws from left to right: the rocket's height at each time, in step with its flight.`,
        run: async (c) => {
          on(2); screen(scrY); cv.style.opacity = '';
          rk._t = 0; await tween(c, 3200, (u) => { const t = T2a * u; fo.to = t; cv._bkDraw(); placeR(t); }, linear); rk._t = T2a;
          if (y2) await drawOn(c, G, y2, 600);
        } }
    ];
    const res = div(stage, 'u5l9-res', '', PX + 8, GT + GH - 98, W - PX - 18); hide(res);
    if (v === 'b') {
      const tr = G.traceMarker(H2, 2, { readout: false }); tr.el.style.opacity = 0;
      steps.push(
        { cap: `${keys('2nd', 'TRACE')} (CALC) <b>1:value</b>. Type ${T('X=2')} and press ${keys('ENTER')}.`,
          run: async (c) => { on(3); screen(scrM(1, '<div class="u5l9-tiin">X=2 <i>ENTER</i></div>')); G.readout('', { x: 2, y: H2(2) }); unhide(tr.el); await pop(c, tr.el); await flyTo(c, 2, 900, easeOut); } },
        { cap: `${T('Y=46.9')}: after 2 s the rocket is <b>46.90 m</b> high (to the nearest hundredth).`,
          run: async (c) => { on(4); res.innerHTML = `${T('h(2)=46.90')} m`; await show(c, res); } }
      );
    } else if (v === 'f') {
      const tr = G.traceMarker(H2, 1, { readout: false }); tr.el.style.opacity = 0;
      const q1 = hide(G.point(I1.x, I1.y, { color: 'purple', r: 6 })), q2 = hide(G.point(I2.x, I2.y, { color: 'purple', r: 6 }));
      steps.push(
        { cap: `${keys('2nd', 'TRACE')} <b>5:intersect</b>. First curve? ${keys('ENTER')} Second curve? ${keys('ENTER')} Guess? Move near the first crossing, ${keys('ENTER')}.`,
          run: async (c) => { on(3); screen(scrM(5, '<div class="u5l9-tiin">First curve? <i>ENTER</i></div><div class="u5l9-tiin">Second curve? <i>ENTER</i></div><div class="u5l9-tiin">Guess? <i>ENTER</i></div>')); unhide(tr.el); await pop(c, tr.el); await flyTo(c, I1.x, 900, easeOut); } },
        { cap: `Intersection: X = 1.0180…, so <b>${T('t\\approx1.02')} s</b>, going up.`,
          run: async (c) => { on(4); tr.el.style.opacity = 0; G.readout('Intersection', I1); await popP(c, q1); res.innerHTML = `${T('t\\approx1.02')} s (going up)`; await show(c, res); } },
        { cap: `Do it again with the guess near the second crossing: X = 5.5125…, so <b>${T('t\\approx5.51')} s</b>, coming down.`,
          run: async (c) => { on(3); G.readout(null); await flyTo(c, I2.x, 1300); on(4); G.readout('Intersection', I2); await popP(c, q2); res.innerHTML = `${T('t\\approx1.02')} s (going up)<br>${T('t\\approx5.51')} s (coming down)`; } }
      );
    } else {
      const [L, R, Gs] = d.bounds, kind = v === 'c' ? 'Maximum' : 'Zero', pt = v === 'c' ? MX2 : { x: T2a, y: 0 };
      const mL = hide(G.label(L, 60, '►', { pos: 's', cls: 'u5l9-bnd', gap: 2 })), mR = hide(G.label(R, 60, '◄', { pos: 's', cls: 'u5l9-bnd', gap: 2 }));
      const tr = G.traceMarker(H2, L, { readout: false }); tr.el.style.opacity = 0;
      const fp = hide(G.point(pt.x, pt.y, { color: v === 'c' ? 'red' : 'amber', r: 7 }));
      const menuTxt = (k) => scrM(d.menu, ['Left Bound?', 'Right Bound?', 'Guess?'].slice(0, k).map((s, i) => `<div class="u5l9-tiin">${s} <i>${[L, R, Gs][i]} ENTER</i></div>`).join(''));
      steps.push(
        { cap: `${keys('2nd', 'TRACE')} <b>${d.menu}:${MENU[d.menu - 1]}</b>. Left bound (${T(`X=${L}`)}), right bound (${T(`X=${R}`)}) on either side of the ${v === 'c' ? 'top' : 'landing'}, then a guess: ${keys('ENTER')} each time.`,
          run: async (c) => {
            on(3); screen(menuTxt(0)); unhide(tr.el); tr.set(L); await pop(c, tr.el);
            screen(menuTxt(1)); G.readout('Left Bound?', { x: L, y: H2(L) }); await show(c, mL);
            await tr.move(c, R, 700); screen(menuTxt(2)); G.readout('Right Bound?', { x: R, y: H2(R) }); await show(c, mR);
            await tr.move(c, Gs, 500); screen(menuTxt(3)); G.readout('Guess?', { x: Gs, y: H2(Gs) }); await sleep(c, 300);
          } },
        { cap: v === 'c'
          ? `${kind}: X = 3.2653…, Y = 54.7448…. A maximum height of <b>54.74 m</b> after <b>3.27 s</b>: the vertex ${T('(3.27,\\ 54.74)')}.`
          : `${kind}: X = 6.6078…. The rocket is in the air for about <b>6.61 s</b>: the positive ${T('t')}-intercept.`,
          run: async (c) => {
            on(4); tr.el.style.opacity = 0; mL.style.opacity = 0; mR.style.opacity = 0; G.readout(kind, pt); await popP(c, fp);
            await flyTo(c, pt.x, 900); res.innerHTML = v === 'c' ? `Maximum height ${T('54.74')} m<br>after ${T('3.27')} s` : `In the air for<br>${T('t\\approx6.61')} s`; await show(c, res);
          } }
      );
    }
    return steps;
  }
};

/* =============================== explainer: revenue (Example 4) =============================== */
const R4 = (x) => (45 + 2 * x) * (600 - 15 * x);
const money = (v) => fmt(Math.round(v));
const revenue = {
  title: 'Price up, tickets down: the revenue',
  height: 444, minW: 760,
  ask: () => `Example 4: 600 tickets a week at $45. Each $2 increase sells 15 fewer. Which whole number of increases gives the most revenue?`,
  make(stage, v, ex) {
    const W = ex.W, AW = 246, AH = 292, KT = (AW - 40) / 600, KP = (AH - 50) / 125, BX = 44, BY = AH - 22;
    // the rectangle: width = tickets, height = price, area = revenue
    const A = absSvg(stage, AW, AH, 0, 0, 'u5l9-area');
    svgEl('line', { x1: BX, y1: BY, x2: AW - 4, y2: BY, stroke: INK, 'stroke-width': 2 }, A);
    svgEl('line', { x1: BX, y1: BY, x2: BX, y2: 6, stroke: INK, 'stroke-width': 2 }, A);
    const rect = svgEl('rect', { x: BX, fill: '#cfe0fb', stroke: CURVE, 'stroke-width': 3 }, A);
    const ghost = svgEl('rect', { x: BX, fill: 'none', stroke: '#3a4254', 'stroke-width': 2.5, 'stroke-dasharray': '7 6', opacity: 0 }, A);
    const pl = div(stage, 'u5l9-rlab u5l9-rp', '', 0, 0), tl = div(stage, 'u5l9-rlab u5l9-rt', '', 0, BY + 2), al = div(stage, 'u5l9-rlab u5l9-ra', '', 0, 0);
    // the graph
    const GXo = AW + 6, G = new Graph(stage, { x: GXo, y: 2, width: W - GXo - 2, height: AH, xmin: 0, xmax: 40, ymin: 0, ymax: 35000, xstep: 5, ystep: 5000,
      numbers: false, arrows: false, fnArrows: false, pad: [14, 16, 34, 66], xtitle: 'x', ytitle: 'R\\ (\\$)', fontSize: 15 });
    for (let k = 0; k <= 35000; k += 10000) G.label(0, k, fmt(k), { pos: 'w', cls: 'u5l9-num', gap: 6 });
    for (let k = 0; k <= 40; k += 5) G.label(k, 0, String(k), { pos: 's', cls: 'u5l9-num', gap: 5 });
    const fo = { from: 0, to: 0, color: CURVE, width: 3.5 }, cv = G.fn(R4, fo);
    const dot = G.point(0, R4(0), { color: 'blue', r: 6 });
    const vx = hide(G.point(8.75, R4(8.75), { color: 'red', label: T('(8.75,\\ 29\\,296.88)'), pos: 'n' }));
    const p9 = hide(G.point(9, R4(9), { color: 'green', r: 7 }));
    const no = hide(stamp(stage, 'Not a whole step ✗', { ok: false, x: GXo + G.toPx(17, 0)[0], y: 180, size: 'sm' }));
    const yes = hide(stamp(stage, '9 increases ✓', { ok: true, x: GXo + G.toPx(17, 0)[0], y: 226 }));
    // the table (each column is one number of increases)
    const tb = new ValueTable(stage, { x: 0, y: AH + 10, layout: 'h', headers: ['x', '\\text{Price (\\$)}', '\\text{Tickets}', 'R(x)\\ (\\$)'], rows: [], cellW: Math.floor((W - 150) / 7), cellH: 33, headW: 146, tap: false, cls: 'u5l9-tab' });
    const row = (x) => [x, 45 + 2 * x, 600 - 15 * x, money(R4(x)).replace(/ /g, '\\,')];
    const set = (x, trace = true) => {
      const tk = 600 - 15 * x, pr = 45 + 2 * x, w = tk * KT, hh = pr * KP;
      rect.setAttribute('y', BY - hh); rect.setAttribute('width', Math.max(0, w)); rect.setAttribute('height', hh);
      pl.innerHTML = `$${fx(pr)}<br><small>each</small>`; pl.style.left = '2px'; pl.style.top = (BY - hh / 2 - 20) + 'px';
      tl.innerHTML = `${fx(tk)} tickets`; tl.style.left = (BX + Math.max(0, w) / 2) + 'px';
      al.innerHTML = `$${money(R4(x))}`; al.style.left = (BX + 4) + 'px'; al.style.width = Math.max(0, w - 8) + 'px'; al.style.top = (BY - hh / 2 - 13) + 'px'; al.style.opacity = w > 96 ? 1 : 0;
      G.moveTo(dot, x, R4(x));
      if (trace && x > fo.to) { fo.to = x; cv._bkDraw(); }
      set.x = x;
    };
    set.x = 0; set(0);
    const go = (c, x1, ms, ease) => { const x0 = set.x; return tween(c, ms, (u) => set(x0 + (x1 - x0) * u), ease); };
    return [
      { cap: `Now: 600 tickets at $45. Revenue = price × tickets = <b>$27&#8239;000</b> a week: the <b>area</b> of the rectangle.`,
        run: async (c) => { await pulse(c, rect, 1.02); await tb.addRow(row(0), c); } },
      { cap: `One $2 increase: $47 each, but 15 fewer tickets (585). ${T('R(1)=47\\times585')} = <b>$27&#8239;495</b>: more money.`,
        run: async (c) => { await go(c, 1, 800); await tb.addRow(row(1), c); } },
      { cap: 'Two and three increases: the rectangle gets taller but thinner. The revenue still goes up.',
        run: async (c) => { await go(c, 2, 600); await tb.addRow(row(2), c); await go(c, 3, 600); await tb.addRow(row(3), c); } },
      { cap: `Keep going: ${T('R(x)=(45+2x)(600-15x)')} is a parabola that opens <b>down</b>. At ${T('x=40')} nobody buys a ticket: ${T('600-15(40)=0')}.`,
        run: (c) => go(c, 40, 2600, linear) },
      { cap: `4:maximum gives the vertex ${T('(8.75,\\ 29\\,296.88)')}. But ${T('x')} counts whole $2 steps: <b>8.75 increases is not possible</b>.`,
        run: async (c) => { await go(c, 8.75, 1000); await popP(c, vx); await stampIn(c, unhide(no)); } },
      { cap: `Compare the whole numbers on either side (the TABLE): ${T('R(8)=61\\times480')} = $29&#8239;280 and ${T('R(9)=63\\times465')} = <b>$29&#8239;295</b>. 9 wins.`,
        run: async (c) => { await tb.addRow(['\\cdots', '', '', ''], c); await tb.addRow(row(8), c); await tb.addRow(row(9), c); tb.highlight(6, true); await go(c, 9, 500); await popP(c, p9); } },
      { cap: `Best: <b>9 increases</b>, a price of <b>$63</b>, <b>465 tickets</b>, <b>$29&#8239;295</b> a week. That is $29&#8239;295 − $27&#8239;000 = <b>$2295 more</b> than now (dashed).`,
        run: async (c) => { ghost.setAttribute('y', BY - 45 * KP); ghost.setAttribute('width', 600 * KT); ghost.setAttribute('height', 45 * KP); await show(c, ghost); ghost.style.opacity = 1; await stampIn(c, unhide(yes)); } }
    ];
  }
};

/* =============================== explainer: the rain gutter (Example 6) =============================== */
const A6 = (x) => x * (30 - 2 * x);
const gutter = {
  title: 'Bend the strip, trace the area',
  height: 424, minW: 740,
  ask: () => `Example 6: a strip 30 cm wide is bent up ${T('x')} cm on each side. The cross-section area is ${T('A(x)=x(30-2x)')}.`,
  make(stage, v, ex) {
    const W = ex.W, DW = 330, K = 10, CX = DW / 2, BY = 300;
    const D = absSvg(stage, DW, 424, 0, 0, 'u5l9-gutsvg');
    svgEl('rect', { x: 0, y: 0, width: DW, height: 424, rx: 12, fill: '#f6f3ea' }, D);
    const water = svgEl('polygon', { fill: '#bcd9f5', opacity: 0.9 }, D);
    const strip = svgEl('polyline', { fill: 'none', stroke: '#5f6773', 'stroke-width': 7, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, D);
    const ghosts = [5, 10].map(() => svgEl('polyline', { fill: 'none', stroke: IX, 'stroke-width': 4, 'stroke-dasharray': '8 6', 'stroke-linejoin': 'round', opacity: 0 }, D));
    const lx = div(stage, 'u5l9-glab', '', 0, 0), lb = div(stage, 'u5l9-glab', '', 0, BY + 10), la = div(stage, 'u5l9-gread', '', 10, 10, DW - 20);
    const shape = (x, cx = CX) => { const hb = (30 - 2 * x) * K / 2, hh = x * K; return [[cx - hb, BY - hh], [cx - hb, BY], [cx + hb, BY], [cx + hb, BY - hh]]; };
    const ptsS = (p) => p.map((q) => q.join(',')).join(' ');
    const GX = DW + 6, G = new Graph(stage, { x: GX, y: 4, width: W - GX - 2, height: 416, xmin: 0, xmax: 17.5, ymin: 0, ymax: 130, xstep: 1, ystep: 10, xlabels: 5, ylabels: 20,
      arrows: false, fnArrows: false, xtitle: 'x\\text{ (cm)}', ytitle: 'A\\text{ (cm}^2)', fontSize: 15 });
    const fo = { from: 0, to: 0, color: CURVE, width: 4 }, cv = G.fn(A6, fo);
    const dot = G.point(0, 0, { color: 'blue', r: 6 });
    const set = (x, trace = true) => {
      const p = shape(x); strip.setAttribute('points', ptsS(p)); water.setAttribute('points', ptsS(p));
      lx.innerHTML = T(`x=${fx(x, 1)}`); lx.style.left = Math.max(2, p[0][0] - 76) + 'px'; lx.style.top = (BY - x * K / 2 - 14) + 'px';
      lb.innerHTML = T(`30-2x=${fx(30 - 2 * x, 1)}`); lb.style.left = (CX - 70) + 'px';
      la.innerHTML = `Area ${T(`A=${fx(A6(x), 1)}`)} cm²`;
      G.moveTo(dot, x, A6(x)); if (trace && x > fo.to) { fo.to = x; cv._bkDraw(); }
      set.x = x;
    };
    set.x = 0; set(0);
    const go = (c, x1, ms, ease) => { const x0 = set.x; return tween(c, ms, (u) => set(x0 + (x1 - x0) * u), ease); };
    const o0 = hide(G.point(0, 0, { color: DR, open: true, r: 7 })), o15 = hide(G.point(15, 0, { color: DR, open: true, r: 7 }));
    const sX = hide(G.shadeX(0, 15, { color: DR, openA: true, openB: true }));
    const dom = hide(div(stage, 'u5l9-drbox', `<b>Domain</b><br>${T('\\{x\\mid0<x<15,\\ x\\in\\mathbb{R}\\}')}`, GX + G.toPx(10.4, 0)[0], 14, W - GX - G.toPx(10.4, 0)[0] - 6));
    const pV = hide(G.point(7.5, 112.5, { color: 'red', label: T('(7.5,\\ 112.5)'), pos: 'n' }));
    const lK = hide(G.line([0, 100], [17.5, 100], { color: IX, width: 2.5, dash: '8 6', arrows: false }));
    const k5 = hide(G.point(5, 100, { color: 'purple', label: T('(5,\\ 100)'), pos: 'sw' })), k10 = hide(G.point(10, 100, { color: 'purple', label: T('(10,\\ 100)'), pos: 'se' }));
    const gl = [hide(div(stage, 'u5l9-gtag', `${T('5\\times20=100')}`, 46, BY + 14)), hide(div(stage, 'u5l9-gtag', `${T('10\\times10=100')}`, 196, BY + 58))];
    return [
      { cap: `A flat strip, 30 cm wide. With no sides (${T('x=0')}) it holds nothing: the area is 0.`,
        run: (c) => pulse(c, strip, 1.02) },
      { cap: `Bend up ${T('x')} cm on each side. The base is what's left: ${T('30-2x')}. The area is base × height: ${T('A(x)=x(30-2x)')}.`,
        run: (c) => go(c, 15, 3600, linear) },
      { cap: `(a) At ${T('x=15')} the base is ${T('30-2(15)=0')}: the sides meet and nothing fits. Neither end is a gutter, so ${T('0<x<15')}.`,
        run: async (c) => { await popP(c, o0); await popP(c, o15); await drawOn(c, G, sX, 600); await show(c, dom); } },
      { cap: `(b) 4:maximum gives the vertex ${T('(7.5,\\ 112.5)')}. Bend up <b>7.5 cm</b>: the base is 15 cm and the area is <b>112.5 cm²</b>.`,
        run: async (c) => { await go(c, 7.5, 1200); await popP(c, pV); } },
      { cap: `(c) The line ${T('A=100')} meets the graph twice: <b>${T('x=5')}</b> (shallow and wide) and <b>${T('x=10')}</b> (deep and narrow).`,
        run: async (c) => {
          await drawOn(c, G, lK, 700); await popP(c, k5); await popP(c, k10);
          [[5, 106], [10, 274]].forEach(([x, gc], i) => ghosts[i].setAttribute('points', ptsS(shape(x, gc))));
          strip.style.opacity = 0; water.style.opacity = 0; lx.style.opacity = 0; lb.style.opacity = 0; la.style.opacity = 0;
          for (let i = 0; i < 2; i++) { await show(c, ghosts[i]); ghosts[i].style.opacity = 1; await show(c, unhide(gl[i])); }
        } }
    ];
  }
};

/* =============================== Stand Up Break =============================== */
/* BEG: a ball's model with whole-number vertex: launch height, maximum and when. PRG: −4.9t² model: landing time and
 * the two times at a given height (nearest hundredth). MAS: a revenue problem with whole price steps. */
const sgn = (v) => (v < 0 ? `-${-v}` : `+${v}`);
const mny = (v) => `\\$${fmt(Math.round(v)).replace(/ /g, '\\,')}`;
standup('u5l9', {
  intro: 'At your whiteboard, with a graphing calculator: match each question to a feature of the graph, then find it.',
  levels: {
    BEG: (r) => {
      const p = r.pick([1, 2, 3]), c = r.int(0, 30), b = 10 * p, q = 5 * p * p + c;
      return { text: 'A ball is thrown upward. Its height in metres after <i>t</i> seconds is given below. From what height was it thrown? What is its maximum height, and when is it reached?',
        q: `h(t)=-5t^2+${b}t${c ? '+' + c : ''}`,
        a: [`\\text{Launch: }h(0)=${c}\\text{ m}`, `\\text{4:maximum: }(${p},\\ ${q})`, `\\text{Maximum height }${q}\\text{ m after }${p}\\text{ s}`] };
    },
    PRG: (r) => {
      for (;;) {
        const b = r.int(14, 30), c = r.int(1, 12), tv = b / 9.8, mx = H(b, c)(tv), k = 5 * r.int(Math.ceil((c + 2) / 5), Math.floor((mx - 3) / 5));
        if (!(k > c + 1 && k < mx - 2)) continue;
        const land = (b + Math.sqrt(b * b + 19.6 * c)) / 9.8, dd = Math.sqrt(b * b - 19.6 * (k - c)), t1 = (b - dd) / 9.8, t2 = (b + dd) / 9.8;
        return { text: `A ball is kicked from ${c} m above the ground. Its height in metres after <i>t</i> seconds is given below. When does it hit the ground? When is it ${k} m high? (nearest hundredth)`,
          q: `h(t)=-4.9t^2+${b}t+${c}`,
          a: [`\\text{2:zero: }t\\approx${f2(land)}\\text{ s}`, `Y_2=${k}\\text{, intersect twice: }t\\approx${f2(t1)}\\text{ s and }t\\approx${f2(t2)}\\text{ s}`] };
      }
    },
    MAS: (r) => {
      for (;;) {
        const P = r.pick([20, 24, 30, 36, 40, 50]), N = 20 * r.int(15, 40), d = r.pick([1, 2, 5]), m = r.pick([5, 10, 15, 20]);
        const xs = (d * N - m * P) / (2 * d * m);
        if (!(xs > 1.2 && xs < 18) || Math.abs((xs % 1) - 0.5) < 1e-9) continue;
        const R = (x) => (P + d * x) * (N - m * x), whole = Number.isInteger(xs);
        const lo = Math.floor(xs), hi = Math.ceil(xs), best = whole ? xs : (R(lo) >= R(hi) ? lo : hi);
        if (!whole && R(lo) === R(hi)) continue;
        const a = [`R(x)=(${P}+${d === 1 ? '' : d}x)(${N}-${m}x)`, `\\text{4:maximum: }x=${fx(xs)}`];
        if (!whole) a.push(`\\text{TABLE: }R(${lo})=${mny(R(lo))},\\ R(${hi})=${mny(R(hi))}`);
        a.push(`${best}\\text{ increases: price }\\$${P + d * best}\\text{, }${N - m * best}\\text{ sold, revenue }${mny(R(best))}`);
        return { text: `A store sells ${N} items a week at $${P} each. For every $${d} increase in the price, ${m} fewer items are sold. The price changes in whole $${d} steps. Find the price that gives the maximum revenue, and that revenue.`, q: '', a };
      }
    }
  }
});
function H(b, c) { return (t) => -4.9 * t * t + b * t + c; }

/* =============================== mount =============================== */
export const explainers = mountExplainers({ flight, rocket, revenue, gutter });
export const _test = { H1, H2, R4, A6, MX2, T2a, I1, I2 };
