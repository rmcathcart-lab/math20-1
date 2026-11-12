/* Math 20-1 · Unit 7 · Lesson 2 — Graphing Absolute Value Functions of Linear Functions.
 * New lesson format (2026-11-11): the warm-up ("The Distance Game") is plain markup on the page (no code).
 * Card figures: every grid on the page is drawn here from the real functions ([data-fig]); the answer layer (class
 * u7l2-ans) shows when its part's Answer is revealed.
 * Explainers:
 *   flap   (STAR: the part of y = f(x) below the x-axis is a flap hinged at the invariant point; it swings up over the
 *           x-axis in 3-D (perspective) and lands as the other arm of the V. y = |x|, Example 1 (table points ride on
 *           the flap while the |f(x)| row fills), Example 2(a)–(c), Example 3(b) (the whole line y = −2 flips, no hinge)),
 *   sketch (procedure, numbered: vertex, y-intercept, one more point, mirror points, the V (Example 3(a)); Example 4(a)
 *           compares the line and the V (the range bar shrinks to y ≥ 0, −6 becomes 6); Example 4(b) with slope triangles
 *           and domain/range; "Your turn": sliders for a and b with live vertex, y-intercept, slopes),
 *   piece  (procedure, numbered: the definition, solve ax + b ≥ 0 (flip! for a negative a), the two arms light up in the
 *           colours of their pieces; Example 5(a)–(d)),
 *   tf     (Example 6: both sides graphed, the interval shaded, a test value, and a TRUE / FALSE stamp),
 *   unflap (Example 7(c) backwards: fold one arm of the V down at the vertex, then the other: the two lines),
 *   ride   (Example 8: the cyclist rides past the water station while p and d are traced on the graph; the line d = 2
 *           meets the V twice; domain and range).
 * Colours (Unit 7): y = f(x) blue; y = |f(x)| red (the booklet's answer colour); the flap orange (front) / red (back);
 * invariant points and vertices amber; a second line or a test line purple. */
import {
  h, tex, add, box, Graph, ValueTable, stamp, stampIn, checkCard, mountExplainers, pop, fadeIn, anim, sleep, tween, svgEl,
  pulse, linear, COLORS, texNum, drawIn
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const FC = COLORS.blue, AC = COLORS.red, VC = COLORS.amber, IX = COLORS.purple, OR = COLORS.orange, INK = COLORS.slate;
const FLAP = { front: ['rgba(232,160,30,.30)', OR], back: ['rgba(201,58,51,.18)', AC] };
const U7 = { xmin: -6.5, xmax: 6.5, ymin: -6.5, ymax: 6.5, xlabels: 2, ylabels: 2 };
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; if (el && el.label) el.label.style.opacity = 0; return el; };
const unhide = (el) => { if (el) el.style.opacity = ''; if (el && el.label) el.label.style.opacity = ''; return el; };
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
const popP = (c, p) => Promise.all([pop(c, unhide(p)), p.label ? show(c, unhide(p.label)) : null]);
const tn = (v) => texNum(v, 3);
/* a numbered row for step-by-step procedures (the step number beside each step as it appears) */
const row = (host, n, html) => { const r = h('div', 'u7l2-row', `<span class="u7l2-n">${n}</span><div class="u7l2-rc">${html}</div>`); r.style.opacity = 0; host.appendChild(r); return r; };
const glowRing = (layer) => { const g = svgEl('circle', { r: 17, class: 'u7l2-glow' }, layer); g.style.display = 'none'; return g; };
const placeRing = (ring, G, x, y, on = true) => { const [px, py] = G.toPx(x, y); ring.setAttribute('cx', px); ring.setAttribute('cy', py); ring.style.display = on ? '' : 'none'; };

/* the V of y = |m(x − xv)|: two rays from the vertex; set() moves it (the ray end arrays are read on every redraw) */
function vee(G, xv, m, o = {}) {
  const v = [xv, 0], l = [xv - 1, Math.abs(m)], r = [xv + 1, Math.abs(m)];
  const op = Object.assign({ start: null, color: AC, width: 4.5 }, o);
  const L = G.ray(v, l, op), R = G.ray(v, r, op);
  const set = (x, mm) => { v[0] = x; l[0] = x - 1; r[0] = x + 1; l[1] = r[1] = Math.abs(mm); L._bkDraw(); R._bkDraw(); };
  return { L, R, set, els: [L, R] };
}
const drawV = (c, V, ms = 700) => Promise.all(V.els.map((e) => (unhide(e), drawIn(e, ms, c))));
/* where the line y = mx + b, walked from (x0, 0) in direction dir (±1), leaves the window */
function exitPt(win, m, b, x0, dir) {
  let xe = dir < 0 ? win.xmin : win.xmax, ye = m * xe + b;
  if (ye < win.ymin) { ye = win.ymin; xe = (ye - b) / m; } else if (ye > win.ymax) { ye = win.ymax; xe = (ye - b) / m; }
  return [xe, ye];
}

/* ---------- the hinged flap: a polygon (and its edge, and dots) that swings over the x-axis in perspective ---------- */
function makeFlap(G, poly, seg, dots = [], cols = FLAP) {
  const g = svgEl('g', { class: 'u7l2-flap' }, G.layers.data);
  const fp = svgEl('polygon', { stroke: 'none' }, g);
  const fs = svgEl('polyline', { fill: 'none', 'stroke-width': 5.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
  const ds = dots.map(() => svgEl('circle', { r: 7.5, stroke: '#fff', 'stroke-width': 2.2 }, g));
  const P = (pts) => pts.map(([x, y]) => G.toPx(x, y));
  const B = { poly: P(poly), seg: P(seg), dots: P(dots) };
  const y0 = G.toPx(0, 0)[1], cx = G.toPx((G.win.xmin + G.win.xmax) / 2, 0)[0], D = 1250;
  const map = ([px, py], th) => { const dy = py - y0, z = Math.abs(dy) * Math.sin(th), k = D / (D - z); return [cx + (px - cx) * k, y0 + dy * Math.cos(th) * k]; };
  const str = (pts) => pts.map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  const S = { u: 0 };
  const set = (u) => {
    S.u = u; const th = Math.PI * u, back = Math.cos(th) < 0, [fill, stroke] = back ? cols.back : cols.front;
    fp.setAttribute('points', str(B.poly.map((p) => map(p, th)))); fp.setAttribute('fill', fill);
    fs.setAttribute('points', str(B.seg.map((p) => map(p, th)))); fs.setAttribute('stroke', stroke);
    ds.forEach((d, i) => { const [x, y] = map(B.dots[i], th); d.setAttribute('cx', x); d.setAttribute('cy', y); d.setAttribute('fill', back ? (cols.dotB || AC) : (cols.dotF || FC)); });
  };
  set(0);
  return { g, fp, fs, ds, set, S, flip: (c, ms = 1800, rev = false) => { const u0 = S.u, u1 = rev ? 0 : 1; return tween(c, ms, (t) => set(u0 + (u1 - u0) * t)); } };
}

/* =============================== card figures =============================== */
const FIGS = {
  absx: { w: 330, h: 330, win: { xmin: -4.5, xmax: 4.5, ymin: -4.5, ymax: 4.5 }, draw(G) {
    G.ray([0, 0], [-1, -1], { start: null, color: COLORS.gray, width: 3, dash: '8 7' }); vee(G, 0, 1, { color: INK });
    G.label(2.6, 3.4, T('y=|x|'), { cls: 'bk-ptlab', pos: 'e' }); G.label(-3.2, -2.2, T('y=x'), { cls: 'bk-ptlab', pos: 'w', color: COLORS.gray });
    G.point(0, 0, { color: 'amber', label: 'vertex', pos: 's' });
  } },
  ex1: { w: 360, h: 420, win: { xmin: -2.5, xmax: 6.5, ymin: -8.5, ymax: 8.5, ylabels: 2 }, ans(G) {
    return [G.line([0, -4], [1, -2], { color: FC, width: 3, dash: '9 7' }), ...vee(G, 2, 2).els, G.label(4.2, 3, T('y=f(x)'), { cls: 'bk-ptlab', pos: 'e', color: FC }), G.label(-1.9, 7.4, T('y=|f(x)|'), { cls: 'bk-ptlab', pos: 'e', color: AC })];
  } },
  e2a: { w: 300, h: 300, win: U7, fs: 14, given: (G) => G.line([0, 3], [1, 4], { color: INK, width: 3 }), ans: (G) => vee(G, -3, 1).els },
  e2b: { w: 300, h: 300, win: U7, fs: 14, given: (G) => G.line([0, 6], [1, 4], { color: INK, width: 3 }), ans: (G) => vee(G, 3, 2).els },
  e2c: { w: 300, h: 300, win: U7, fs: 14, given: (G) => G.line([0, -2], [2, -1], { color: INK, width: 3 }), ans: (G) => vee(G, 4, 0.5).els },
  e3a: { w: 340, h: 340, win: U7, ans(G) {
    return [G.line([0, 4], [1, 2], { color: FC, width: 3, dash: '9 7' }), ...vee(G, 2, 2).els, ...[[2, 0], [0, 4], [5, 6]].map(([x, y]) => G.point(x, y, { color: 'red', coords: true, pos: x === 0 ? 'w' : x === 5 ? 'w' : 'se' }))];
  } },
  e4a: { w: 340, h: 360, win: { xmin: -2.5, xmax: 6.5, ymin: -7.5, ymax: 7.5, ylabels: 2 }, ans: (G) => [G.line([0, -6], [1, -3], { color: FC, width: 3, dash: '9 7' }), ...vee(G, 2, 3).els] },
  e4b: { w: 360, h: 300, win: { xmin: -10.5, xmax: 2.5, ymin: -3.5, ymax: 6.5, xlabels: 2 }, ans: (G) => [...vee(G, -4, 0.5).els, G.point(-4, 0, { color: 'red', coords: true, pos: 's' }), G.point(0, 2, { color: 'red', coords: true, pos: 'ne' })] },
  e7: { w: 340, h: 340, win: U7, given(G) {
    vee(G, 2, 1.5, { color: INK }); [[2, 0], [0, 3], [4, 3]].forEach(([x, y]) => G.point(x, y, { color: INK, r: 6 }));
  }, ans: (G) => [G.line([0, -3], [2, 0], { color: FC, width: 3 }), G.line([0, 3], [2, 0], { color: IX, width: 3, dash: '9 7' })] },
  e8: { w: 440, h: 340, win: { xmin: 0, xmax: 42, ymin: -6.5, ymax: 6.5, xstep: 5, ystep: 1, ylabels: 2, xtitle: 't', ytitle: '\\text{km}' }, ans(G) {
    return [G.segment([0, 5], [40, -5], { color: FC, width: 3, dash: '9 7' }), G.polyline([[0, 5], [20, 0], [40, 5]], { color: AC, width: 4.5 }), G.segment([0, 2], [40, 2], { color: IX, width: 2 }),
      G.label(31, -3.4, T('p'), { cls: 'bk-ptlab', color: FC }), G.label(35, 4.6, T('d'), { cls: 'bk-ptlab', color: AC })];
  } }
};
function buildFigs() {
  document.querySelectorAll('.u7l2 [data-fig]').forEach((el) => {
    const f = FIGS[el.dataset.fig]; if (!f || el.dataset.built) return; el.dataset.built = '1';
    const G = new Graph(el, Object.assign({ width: f.w, height: f.h, fontSize: f.fs || 15, fnArrows: true }, f.win));
    if (f.draw) f.draw(G);
    if (f.given) f.given(G);
    if (f.ans) (f.ans(G) || []).forEach((e) => { if (e) { e.classList.add('u7l2-ans'); if (e.label) e.label.classList.add('u7l2-ans'); } });
  });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', buildFigs); else buildFigs();

/* =============================== explainer: the hinged flap (STAR) =============================== */
const FL = {
  absx: { m: 1, b: 0, f: 'y=x', a: 'y=|x|', neg: 'x<0', win: { xmin: -5.5, xmax: 5.5, ymin: -5.5, ymax: 5.5 },
    ask: `The graph of ${T('y=|x|')} from the graph of ${T('y=x')}: keep what is above the ${T('x')}-axis, flip up what is below.` },
  e1: { m: 2, b: -4, f: 'f(x)=2x-4', a: 'y=|2x-4|', neg: 'f(x)<0', win: { xmin: -2.5, xmax: 6.5, ymin: -8.5, ymax: 8.5, ylabels: 2 }, table: [-1, 0, 1, 2, 3, 4, 5],
    ask: `<b>Example 1:</b> ${T('f(x)=2x-4')}. (a) Complete the table. (b) Graph ${T('y=f(x)')} and ${T('y=|f(x)|')}. (c) Where are the graphs the same?` },
  e2a: { m: 1, b: 3, f: 'f(x)=x+3', a: 'y=|x+3|', neg: 'f(x)<0', win: U7, ex: '2(a)' },
  e2b: { m: -2, b: 6, f: 'f(x)=-2x+6', a: 'y=|-2x+6|', neg: 'f(x)<0', win: U7, ex: '2(b)' },
  e2c: { m: 0.5, b: -2, f: 'f(x)=\\frac12x-2', a: 'y=\\left|\\frac12x-2\\right|', neg: 'f(x)<0', win: U7, ex: '2(c)' },
  e3b: { horiz: true, win: U7, ask: `<b>Example 3(b):</b> ${T('g(x)=-2')} and ${T('h(x)=3')} (horizontal lines). Describe the graphs of ${T('y=|g(x)|')} and ${T('y=|h(x)|')}.` }
};
const flap = {
  title: 'Flip up the part below the x-axis',
  height: 444, minW: 880, capH: 96,
  choices: [{ v: 'absx', label: 'y = |x|' }, { v: 'e1', label: 'Example 1' }, { sep: 'Example 2:' }, { v: 'e2a', label: '(a)' }, { v: 'e2b', label: '(b)' }, { v: 'e2c', label: '(c)' }, { v: 'e3b', label: 'Example 3(b)' }],
  ask: (v) => FL[v].ask || `<b>Example ${FL[v].ex}:</b> the graph of ${T('y=' + FL[v].f.replace('f(x)=', ''))} is shown. Sketch ${T('y=|f(x)|')} and state the invariant point.`,
  make(stage, v, ex) {
    const d = FL[v], W = ex.W, GW = 440, PX = GW + 26, PW = W - PX;
    const G = new Graph(stage, Object.assign({ x: 0, y: 2, width: GW, height: 440, fontSize: 15 }, d.win));
    const P = div(stage, 'u7l2-pn', '', PX, 0, PW);
    const head = h('div', 'u7l2-eqbig'); P.appendChild(head);
    const rows = h('div', 'u7l2-rows'); P.appendChild(rows);
    if (d.horiz) return flapHoriz(G, P, head, rows, d);
    const { m, b } = d, x0 = -b / m, dir = m > 0 ? -1 : 1, side = dir < 0 ? 'left' : 'right';
    const inv = `(${tn(x0)},\\ 0)`, xe = exitPt(G.win, m, b, x0, dir);
    head.innerHTML = T(d.f);
    const up = G.ray([x0, 0], [x0 - dir, m * (x0 - dir) + b], { start: null, color: FC, width: 4 });
    const down = G.ray([x0, 0], [x0 + dir, m * (x0 + dir) + b], { start: null, color: FC, width: 4 });
    const ghost = hide(G.ray([x0, 0], [x0 + dir, m * (x0 + dir) + b], { start: null, color: FC, width: 3, dash: '9 7' }));
    const flabX = dir < 0 ? Math.min(G.win.xmax - 1.2, x0 + 2.2) : Math.max(G.win.xmin + 1.2, x0 - 2.2);
    const flab = G.label(flabX, Math.min(G.win.ymax - 0.6, m * flabX + b), T(d.f.startsWith('y') ? d.f : 'y=f(x)'), { cls: 'bk-ptlab', pos: dir < 0 ? 'se' : 'sw', color: FC, dx: dir < 0 ? 8 : -8 });
    const xs = d.table || [], negs = xs.filter((x) => m * x + b < 0), pos = xs.filter((x) => m * x + b >= 0);
    const F = makeFlap(G, [[x0, 0], xe, [xe[0], 0]], [[x0, 0], xe], negs.map((x) => [x, m * x + b]));
    hide(F.fp); hide(F.fs); F.ds.forEach(hide);
    const ring = glowRing(G.layers.top);
    const ip = hide(G.point(x0, 0, { color: 'amber', r: 8, label: T(inv), pos: dir < 0 ? 'se' : 'sw' }));
    const V = vee(G, x0, m); V.els.forEach(hide);
    const ax = dir < 0 ? Math.max(G.win.xmin + 0.5, x0 - (G.win.ymax - 0.8) / Math.abs(m)) : Math.min(G.win.xmax - 0.5, x0 + (G.win.ymax - 0.8) / Math.abs(m));
    const alab = hide(G.label(ax, Math.abs(m) * Math.abs(ax - x0) - 0.2, T(d.a), { cls: 'bk-ptlab', pos: dir < 0 ? 'e' : 'w', color: AC, dx: dir < 0 ? 10 : -10 }));
    const steps = [];
    let tb = null, pts = [];
    if (d.table) {
      [up, down, flab].forEach(hide);
      tb = new ValueTable(P, { layout: 'h', headers: ['x', 'y=f(x)', 'y=|f(x)|'], rows: xs.map((x) => [x, m * x + b, Math.abs(m * x + b)]), hide: (r, c) => c > 0, tap: false, cellW: 56, cellH: 48, headW: 112, cls: 'u7l2-vt' });
      P.insertBefore(tb.el, rows);
      pts = pos.map((x) => hide(G.point(x, m * x + b, { color: FC, r: 7.5 })));
      const r1 = row(rows, 1, `${T('f(x)')} row, then plot the points`), r2 = row(rows, 2, `below the axis: ${T('x<2')}`), r3 = row(rows, 3, `${T('|f(x)|')}: ${T('(x,\\ y)\\to(x,\\ -y)')}`);
      steps.push(
        { cap: `(a) Fill the ${T('f(x)')} row: ${T('f(-1)=2(-1)-4=-6')}, ${T('f(0)=-4')}, and so on. Plot the points and join them: the line ${T('y=f(x)')}.`,
          run: async (c) => { await show(c, r1); await tb.fill(c, { col: 1, stagger: 90 }); await Promise.all([...pts, ...F.ds].map((p) => pop(c, unhide(p), 300))); await Promise.all([up, down].map((e) => (unhide(e), drawIn(e, 700, c)))); unhide(flab); } },
        { cap: `For ${T('x<2')} the ${T('y')}-values are <b>negative</b>: those points are below the ${T('x')}-axis. The point ${T('(2,\\ 0)')} is on the axis.`,
          run: async (c) => { await show(c, r2); negs.forEach((x) => { const i = xs.indexOf(x); tb.cell(i, 1).classList.add('u7l2-negc'); }); unhide(F.fp); unhide(F.fs); await show(c, F.g); await popP(c, ip); placeRing(ring, G, x0, 0); } },
        { cap: `(b) The absolute value makes every negative ${T('y')}-value positive: the points below the axis <b>flip up</b> over the ${T('x')}-axis, and the ${T('|f(x)|')} row fills.`,
          run: async (c) => { await show(c, r3); hide(down); unhide(ghost); await F.flip(c, 1900); await tb.fill(c, { col: 2, stagger: 90 }); } },
        { cap: `(c) The graphs are the same for ${T('x\\ge2')}, where ${T('f(x)\\ge0')}. For ${T('x<2')} the points are reflected in the ${T('x')}-axis. ${T('(2,\\ 0)')} is on both graphs.`,
          run: async (c) => { await drawV(c, V); F.fp.style.opacity = 0.35; await show(c, unhide(alab)); const sh = G.shadeX(2, Infinity, { band: true, color: 'green' }); await drawIn(sh, 600, c); } }
      );
      return steps;
    }
    const r1 = row(rows, 1, `below the axis: ${T(d.neg.replace('f(x)<0', `x${dir < 0 ? '<' : '>'}${tn(x0)}`))}`);
    const r2 = row(rows, 2, `invariant point ${T(inv)}`), r3 = row(rows, 3, `flip: ${T('(x,\\ y)\\to(x,\\ -y)')}`);
    const r4 = row(rows, 4, `${T(d.a)}: vertex ${T(inv)}`);
    steps.push(
      { cap: `<b>1</b> Where is the line <b>below</b> the ${T('x')}-axis? ${side === 'left' ? 'Left' : 'Right'} of ${T('x=' + tn(x0))}, where ${T(d.neg)}. That part is the <b>flap</b>.`,
        run: async (c) => { await show(c, r1); unhide(F.fp); unhide(F.fs); await show(c, F.g); await pulse(c, F.fs, 1.02); } },
      { cap: `<b>2</b> ${T(inv)} is on the ${T('x')}-axis, so it does not move: the <b>invariant point</b>, the hinge of the flap.`,
        run: async (c) => { await show(c, r2); await popP(c, ip); placeRing(ring, G, x0, 0); } },
      { cap: `<b>3</b> Flip the flap up over the ${T('x')}-axis: every point ${T('(x,\\ y)')} goes to ${T('(x,\\ -y)')}.`,
        run: async (c) => { await show(c, r3); hide(down); unhide(ghost); await F.flip(c, 1900); } },
      { cap: `<b>4</b> ${T(d.a)}: a <b>V</b> with its vertex at the invariant point ${T(inv)}. The part ${side} of ${T('x=' + tn(x0))} was reflected; the rest stayed where it was.`,
        run: async (c) => { await drawV(c, V); F.fp.style.opacity = 0.35; await show(c, unhide(alab)); await show(c, r4); } }
    );
    if (v === 'absx') {
      const r5 = row(rows, 5, `domain ${T('\\{x\\mid x\\in\\mathbb{R}\\}')}<br>range ${T('\\{y\\mid y\\ge0,\\ y\\in\\mathbb{R}\\}')}`);
      steps.push({ cap: `Domain ${T('\\{x\\mid x\\in\\mathbb{R}\\}')}: every ${T('x')} has a value. Range ${T('\\{y\\mid y\\ge0,\\ y\\in\\mathbb{R}\\}')}: the V never goes below the ${T('x')}-axis.`,
        run: async (c) => { await show(c, r5); await drawIn(G.shadeX(-Infinity, Infinity), 600, c); await drawIn(G.shadeY(0, Infinity), 600, c); } });
    }
    return steps;
  }
};
/* Example 3(b): the whole line y = −2 is the flap (no hinge point); y = 3 does not move */
function flapHoriz(G, P, head, rows, d) {
  const w = G.win;
  head.innerHTML = `${T('g(x)=-2')} &nbsp; ${T('h(x)=3')}`;
  const gl = G.line({ m: 0, b: -2 }, { color: FC, width: 4 }), hl = G.line({ m: 0, b: 3 }, { color: FC, width: 4 });
  const ghost = hide(G.line({ m: 0, b: -2 }, { color: FC, width: 3, dash: '9 7' }));
  G.label(-4.6, -2, T('y=g(x)'), { cls: 'bk-ptlab', pos: 's', color: FC }); G.label(-4.6, 3, T('y=h(x)'), { cls: 'bk-ptlab', pos: 'n', color: FC });
  const F = makeFlap(G, [[w.xmin, 0], [w.xmin, -2], [w.xmax, -2], [w.xmax, 0]], [[w.xmin, -2], [w.xmax, -2]]);
  hide(F.g);
  const g2 = hide(G.line({ m: 0, b: 2 }, { color: AC, width: 4.5 })), g2l = hide(G.label(3.6, 2, T('y=|g(x)|=2'), { cls: 'bk-ptlab', pos: 's', color: AC }));
  const h3 = hide(G.line({ m: 0, b: 3 }, { color: AC, width: 4.5 })), h3l = hide(G.label(3.6, 3, T('y=|h(x)|=3'), { cls: 'bk-ptlab', pos: 'n', color: AC }));
  const r1 = row(rows, 1, `${T('g(x)=-2<0')} for every ${T('x')}: no invariant points`), r2 = row(rows, 2, `${T('|g(x)|=|-2|=2')}`), r3 = row(rows, 3, `${T('|h(x)|=|3|=3')}: no change`);
  return [
    { cap: `${T('y=g(x)=-2')} is below the ${T('x')}-axis <b>everywhere</b>: the whole line is the flap. It never meets the axis, so there are <b>no invariant points</b>.`,
      run: async (c) => { await show(c, r1); await show(c, unhide(F.g)); } },
    { cap: `Flip it up: ${T('|g(x)|=|-2|=2')}. The graph of ${T('y=|g(x)|')} is the line ${T('y=2')}.`,
      run: async (c) => { await show(c, r2); hide(gl); unhide(ghost); await F.flip(c, 1900); F.fp.style.opacity = 0.35; await drawIn(unhide(g2), 600, c); await show(c, unhide(g2l)); } },
    { cap: `${T('y=h(x)=3')} is above the axis: ${T('|h(x)|=|3|=3')}, so <b>nothing changes</b>.`,
      run: async (c) => { await show(c, r3); await pulse(c, hl, 1.02); await drawIn(unhide(h3), 600, c); await show(c, unhide(h3l)); } }
  ];
}

/* =============================== explainer: sketching y = |ax + b| and its characteristics =============================== */
const SK = {
  e3a: { ask: `<b>Example 3(a):</b> sketch ${T('y=|4-2x|')} without a table: find the vertex, the ${T('y')}-intercept and one more point.` },
  e4a: { ask: `<b>Example 4(a):</b> ${T('f(x)=3x-6')}. Compare ${T('y=f(x)')} and ${T('y=|f(x)|')}: domain, range, ${T('x')}-intercept, ${T('y')}-intercept.` },
  e4b: { ask: `<b>Example 4(b):</b> for ${T('y=\\left|-\\frac12x-2\\right|')}, state the vertex, the ${T('y')}-intercept, the domain and the range, and the slopes of the arms.` },
  play: { ask: `<b>Your turn:</b> any ${T('y=|ax+b|')}. Where are the vertex and the ${T('y')}-intercept?` }
};
const sketch = {
  title: 'Sketch y = |ax + b| from its features',
  height: 444, minW: 880, capH: 96,
  choices: [{ sep: 'Example 3:' }, { v: 'e3a', label: '(a)' }, { sep: 'Example 4:' }, { v: 'e4a', label: '(a)' }, { v: 'e4b', label: '(b)' }, { v: 'play', label: 'Your turn' }],
  ask: (v) => SK[v].ask,
  make(stage, v, ex) {
    const W = ex.W, GW = 440, PX = GW + 26, PW = W - PX;
    const win = v === 'e4a' ? { xmin: -2.5, xmax: 6.5, ymin: -7.5, ymax: 7.5, ylabels: 2 } : v === 'e4b' ? { xmin: -10.5, xmax: 2.5, ymin: -3.5, ymax: 6.5, xlabels: 2 } : U7;
    const G = new Graph(stage, Object.assign({ x: 0, y: 2, width: GW, height: 440, fontSize: 15 }, win));
    const P = div(stage, 'u7l2-pn', '', PX, 0, PW);
    const rows = h('div', 'u7l2-rows'); P.appendChild(rows);
    const ring = glowRing(G.layers.top);
    if (v === 'e3a') {
      const pts = { v: [2, 0], y: [0, 4], o: [5, 6], m1: [4, 4], m2: [-1, 6] };
      const el = {}; Object.entries(pts).forEach(([k, [x, y]]) => { el[k] = hide(G.point(x, y, { color: k === 'v' ? 'amber' : 'red', r: k === 'v' ? 8 : 7, coords: true, pos: k === 'v' ? 's' : k === 'm2' ? 'w' : k === 'y' ? 'w' : 'e' })); });
      const axis = hide(G.vline(2, { color: VC, width: 2.5 }));
      const ghost = hide(G.line([0, 4], [1, 2], { color: FC, width: 3, dash: '9 7' }));
      const V = vee(G, 2, 2); V.els.forEach(hide);
      const r = [row(rows, 1, `vertex: ${T('4-2x=0\\Rightarrow x=2')}`), row(rows, 2, `${T('y')}-intercept: ${T('|4-0|=4')}`), row(rows, 3, `${T('x=5')}: ${T('|4-10|=|-6|=6')}`), row(rows, 4, `mirror points: ${T('(4,\\ 4)')}, ${T('(-1,\\ 6)')}`), row(rows, 5, `draw the V`)];
      return [
        { cap: `<b>1</b> Vertex: ${T('4-2x=0\\Rightarrow x=2')}, so ${T('(2,\\ 0)')}. It is on the ${T('x')}-axis.`, run: async (c) => { await show(c, r[0]); await popP(c, el.v); placeRing(ring, G, 2, 0); } },
        { cap: `<b>2</b> ${T('y')}-intercept: ${T('x=0')} gives ${T('y=|4-0|=4')}, so ${T('(0,\\ 4)')}.`, run: async (c) => { await show(c, r[1]); await popP(c, el.y); } },
        { cap: `<b>3</b> One more point: ${T('x=5')} gives ${T('y=|4-10|=|-6|=6')}, so ${T('(5,\\ 6)')}.`, run: async (c) => { await show(c, r[2]); await popP(c, el.o); } },
        { cap: `<b>4</b> The V is symmetric about ${T('x=2')}: ${T('(0,\\ 4)')} and ${T('(5,\\ 6)')} have mirror points ${T('(4,\\ 4)')} and ${T('(-1,\\ 6)')}.`,
          run: async (c) => { await show(c, r[3]); await drawIn(unhide(axis), 500, c); for (const [k, from] of [['m1', pts.y], ['m2', pts.o]]) { const p = el[k], to = pts[k]; G.moveTo(p, ...from); unhide(p); await G.move(c, p, ...to, 800); } } },
        { cap: `<b>5</b> Join them: the V. It is the line ${T('y=4-2x')} with the part right of ${T('x=2')} reflected.`, run: async (c) => { await show(c, r[4]); await drawIn(unhide(ghost), 600, c); await drawV(c, V); } }
      ];
    }
    if (v === 'e4a') {
      const line = G.ray([2, 0], [3, 3], { start: null, color: FC, width: 4 }), down = G.ray([2, 0], [1, -3], { start: null, color: FC, width: 4 });
      const ghost = hide(G.ray([2, 0], [1, -3], { start: null, color: FC, width: 3, dash: '9 7' }));
      G.label(3.9, 5.7, T('y=3x-6'), { cls: 'bk-ptlab', pos: 'e', color: FC, dx: 6 });
      const dom = hide(G.shadeX(-Infinity, Infinity)), ran = hide(G.shadeY(-Infinity, Infinity)), ran2 = hide(G.shadeY(0, Infinity));
      const xi = hide(G.point(2, 0, { color: 'amber', r: 8, label: T('x=2'), pos: 'se' }));
      const yi = hide(G.point(0, -6, { color: FC, r: 7.5, label: T('-6'), pos: 'e' }));
      const xe = exitPt(G.win, 3, -6, 2, -1), F = makeFlap(G, [[2, 0], xe, [xe[0], 0]], [[2, 0], xe], [[0, -6]]);
      hide(F.g);
      const yi2 = hide(G.point(0, 6, { color: AC, r: 7.5, label: T('6'), pos: 'e' }));
      const V = vee(G, 2, 3); V.els.forEach(hide);
      const sl = hide(G.label(4, 5.4, `slope ${T('3')}`, { cls: 'bk-ptlab', pos: 'e', color: AC })), sl2 = hide(G.label(0.2, 6.4, `slope ${T('-3')}`, { cls: 'bk-ptlab', pos: 'w', color: AC }));
      const tab = div(P, 'u7l2-cmp', `<table><tr><th></th><th>${T('y=f(x)')}</th><th>${T('y=|f(x)|')}</th></tr>
        <tr><th>Domain</th><td>${T('\\{x\\mid x\\in\\mathbb{R}\\}')}</td><td class="u7l2-c2"><span>${T('\\{x\\mid x\\in\\mathbb{R}\\}')}</span></td></tr>
        <tr><th>Range</th><td>${T('\\{y\\mid y\\in\\mathbb{R}\\}')}</td><td class="u7l2-c2 u7l2-chg"><span>${T('\\{y\\mid y\\ge0,\\ y\\in\\mathbb{R}\\}')}</span></td></tr>
        <tr><th>${T('x')}-int</th><td>${T('2')}</td><td class="u7l2-c2"><span>${T('2')}</span></td></tr>
        <tr><th>${T('y')}-int</th><td>${T('-6')}</td><td class="u7l2-c2 u7l2-chg"><span>${T('6')}</span></td></tr></table>`);
      rows.remove();
      const c2 = [...tab.querySelectorAll('.u7l2-c2 > span')]; c2.forEach(hide);
      const f1 = [...tab.querySelectorAll('td:nth-child(2)')]; f1.forEach(hide);
      return [
        { cap: `${T('y=f(x)=3x-6')}: a line. Domain: all real numbers (on the ${T('x')}-axis). Range: all real numbers too (on the ${T('y')}-axis).`,
          run: async (c) => { await drawIn(unhide(dom), 500, c); await drawIn(unhide(ran), 500, c); await show(c, unhide(f1[0])); await show(c, unhide(f1[1])); } },
        { cap: `${T('x')}-intercept: ${T('3x-6=0\\Rightarrow x=2')}. ${T('y')}-intercept: ${T('f(0)=-6')}.`,
          run: async (c) => { await popP(c, xi); await popP(c, yi); await show(c, unhide(f1[2])); await show(c, unhide(f1[3])); } },
        { cap: `Now ${T('y=|f(x)|')}: flip up the part below the axis. The ${T('x')}-intercept is the hinge, so it stays at ${T('2')}; the domain stays the same.`,
          run: async (c) => { hide(yi); unhide(F.g); await show(c, F.g); hide(down); unhide(ghost); await F.flip(c, 1700); F.fp.style.opacity = 0.35; await show(c, unhide(c2[0])); await show(c, unhide(c2[2])); } },
        { cap: `The range shrinks to ${T('y\\ge0')} and the ${T('y')}-intercept ${T('-6')} becomes ${T('|-6|=6')}. Vertex ${T('(2,\\ 0)')}; the arms have slopes ${T('3')} and ${T('-3')}.`,
          run: async (c) => { await drawV(c, V); hide(ran); await drawIn(unhide(ran2), 600, c); await popP(c, yi2); await show(c, unhide(c2[1])); await show(c, unhide(c2[3])); await show(c, unhide(sl)); await show(c, unhide(sl2)); } }
      ];
    }
    if (v === 'e4b') {
      const vp = hide(G.point(-4, 0, { color: 'amber', r: 8, coords: true, pos: 's' })), yp = hide(G.point(0, 2, { color: 'red', r: 7, coords: true, pos: 'e' }));
      const V = vee(G, -4, 0.5); V.els.forEach(hide);
      const tri = (pts, cl) => hide(G.polyline(pts, { color: cl, width: 2.5, dash: '6 5' }));
      const t1 = tri([[-4, 0], [0, 0], [0, 2]], AC), t2 = tri([[-8, 2], [-8, 0], [-4, 0]], AC);
      const l1 = hide(G.label(-2, 2.6, `slope ${T('\\frac{2}{4}=\\frac12')}`, { cls: 'bk-ptlab', pos: 'n', color: AC })), l2 = hide(G.label(-7.6, 3.6, `slope ${T('-\\frac12')}`, { cls: 'bk-ptlab', pos: 'n', color: AC }));
      const dom = hide(G.shadeX(-Infinity, Infinity)), ran = hide(G.shadeY(0, Infinity));
      const r = [row(rows, 1, `vertex: ${T('-\\frac12x-2=0')}<br>${T('-\\frac12x=2\\Rightarrow x=-4')}`), row(rows, 2, `${T('y')}-intercept: ${T('|-2|=2')}`), row(rows, 3, `slopes ${T('-\\frac12')} (left, ${T('x\\le-4')}), ${T('\\frac12')} (right, ${T('x>-4')})`), row(rows, 4, `domain ${T('\\{x\\mid x\\in\\mathbb{R}\\}')}<br>range ${T('\\{y\\mid y\\ge0,\\ y\\in\\mathbb{R}\\}')}`)];
      return [
        { cap: `<b>1</b> Vertex: ${T('-\\frac12x-2=0\\Rightarrow-\\frac12x=2\\Rightarrow x=-4')}, so ${T('(-4,\\ 0)')}.`, run: async (c) => { await show(c, r[0]); await popP(c, vp); placeRing(ring, G, -4, 0); } },
        { cap: `<b>2</b> ${T('y')}-intercept: ${T('|-2|=2')}, so ${T('(0,\\ 2)')}.`, run: async (c) => { await show(c, r[1]); await popP(c, yp); } },
        { cap: `<b>3</b> The arms: from the vertex to ${T('(0,\\ 2)')} is up ${T('2')}, right ${T('4')}: slope ${T('\\frac12')}. The left arm has slope ${T('-\\frac12')}. Draw the V.`,
          run: async (c) => { await show(c, r[2]); await drawIn(unhide(t1), 500, c); await show(c, unhide(l1)); await drawV(c, V); await drawIn(unhide(t2), 500, c); await show(c, unhide(l2)); } },
        { cap: `<b>4</b> Domain ${T('\\{x\\mid x\\in\\mathbb{R}\\}')}; range ${T('\\{y\\mid y\\ge0,\\ y\\in\\mathbb{R}\\}')}.`, run: async (c) => { await show(c, r[3]); await drawIn(unhide(dom), 500, c); await drawIn(unhide(ran), 500, c); } }
      ];
    }
    /* Your turn: sliders for a and b */
    rows.remove();
    const S = { a: 2, b: -4 };
    const lp = [0, -4], lq = [1, -2];
    const ln = G.line(lp, lq, { color: FC, width: 3, dash: '9 7' });
    const V = vee(G, 2, 2);
    const vp = G.point(2, 0, { color: 'amber', r: 8 }), yp = G.point(0, 4, { color: 'red', r: 7 });
    const sl = (n, lo, hi, st) => { const l = h('label', 'u7l2-sl no-ink', `<span class="u7l2-sll">${T(n)}</span><input type="range" min="${lo}" max="${hi}" step="${st}" aria-label="the value of ${n}"><span class="u7l2-slv"></span>`); l.setAttribute('data-tap', ''); P.appendChild(l); return l; };
    const eq = h('div', 'u7l2-eqbig'); P.appendChild(eq);
    const sa = sl('a', -3, 3, 0.5), sb = sl('b', -6, 6, 1);
    const out = h('div', 'u7l2-out'); P.appendChild(out);
    const frac = (n, d) => fr(Math.round(2 * n), Math.round(2 * d));
    const lin = (a, b) => `${a === 1 ? '' : a === -1 ? '-' : tn(a)}x${b ? (b > 0 ? '+' : '-') + Math.abs(b) : ''}`;
    const upd = () => {
      const { a, b } = S, xv = -b / a;
      lp[0] = 0; lp[1] = b; lq[0] = 1; lq[1] = a + b; ln._bkDraw(); V.set(xv, a); G.moveTo(vp, xv, 0); G.moveTo(yp, 0, Math.abs(b));
      sa.querySelector('input').value = a; sa.querySelector('.u7l2-slv').textContent = String(a).replace('-', '−');
      sb.querySelector('input').value = b; sb.querySelector('.u7l2-slv').textContent = String(b).replace('-', '−');
      eq.innerHTML = T(`y=|${lin(a, b)}|`);
      out.innerHTML = `<div><b class="u7l2-cv">vertex</b> ${T(`\\left(-\\frac ba,\\ 0\\right)=(${frac(-b, a)},\\ 0)`)}</div><div><b class="u7l2-ca">${T('y')}-intercept</b> ${T(`(0,\\ |b|)=(0,\\ ${Math.abs(b)})`)}</div><div><b>slopes</b> ${T(`${tn(a)}`)} and ${T(`${tn(-a)}`)}</div><div><b>range</b> ${T('\\{y\\mid y\\ge0,\\ y\\in\\mathbb{R}\\}')}</div>`;
    };
    sa.querySelector('input').addEventListener('input', (e) => { let a = parseFloat(e.target.value); if (a === 0) a = S.a > 0 ? -0.5 : 0.5; S.a = a; upd(); });
    sb.querySelector('input').addEventListener('input', (e) => { S.b = parseFloat(e.target.value); upd(); });
    upd();
    return [
      { cap: `<b>Your turn:</b> drag ${T('a')} and ${T('b')}. The vertex is always on the ${T('x')}-axis at ${T('x=-\\frac ba')}, the ${T('y')}-intercept is ${T('|b|')}, and the range is always ${T('y\\ge0')}.`,
        run: async (c) => { await pulse(c, sa, 1.04); await pulse(c, sb, 1.04); } }
    ];
  }
};
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));

/* =============================== explainer: piecewise form (procedure, numbered) =============================== */
const PW = {
  a: { e: 'x+5', m: 1, b: 5, win: { xmin: -11, xmax: 3, ymin: -2, ymax: 9, xlabels: 2, ylabels: 2 }, solve: ['x+5\\ge0', 'x\\ge-5'], flip: false, bx: '-5', c1: 'x\\ge-5', p2: '-x-5', c2: 'x<-5' },
  b: { e: '2x-7', m: 2, b: -7, win: { xmin: -1, xmax: 8, ymin: -2, ymax: 9, ylabels: 2 }, solve: ['2x-7\\ge0', '2x\\ge7', 'x\\ge\\frac72'], flip: false, bx: '\\frac72', c1: 'x\\ge\\frac72', p2: '-2x+7', c2: 'x<\\frac72' },
  c: { e: '6-3x', m: -3, b: 6, win: { xmin: -2, xmax: 6, ymin: -2, ymax: 9, ylabels: 2 }, solve: ['6-3x\\ge0', '-3x\\ge-6', 'x\\le2'], flip: true, div: '-3', bx: '2', c1: 'x\\le2', p2: '3x-6', c2: 'x>2' },
  d: { e: '-\\frac12x+1', m: -0.5, b: 1, win: { xmin: -6, xmax: 10, ymin: -2, ymax: 6, xlabels: 2 }, solve: ['-\\frac12x+1\\ge0', '-\\frac12x\\ge-1', 'x\\le2'], flip: true, div: '-\\frac12', bx: '2', c1: 'x\\le2', p2: '\\frac12x-1', c2: 'x>2' }
};
const piece = {
  title: 'Piecewise form, piece by piece',
  height: 444, minW: 880, capH: 96,
  choices: [{ sep: 'Example 5:' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }, { v: 'c', label: '(c)' }, { v: 'd', label: '(d)' }],
  ask: (v) => `<b>Example 5(${v}):</b> write ${T(`y=\\left|${PW[v].e}\\right|`)} in piecewise form.`,
  make(stage, v, ex) {
    const d = PW[v], W = ex.W, GW = 420, PX = GW + 26, PWd = W - PX, xv = -d.b / d.m, first = d.m > 0 ? 1 : -1; // first piece: right arm if m > 0
    const G = new Graph(stage, Object.assign({ x: 0, y: 2, width: GW, height: 440, fontSize: 15 }, d.win));
    const P = div(stage, 'u7l2-pn', '', PX, 0, PWd);
    const rows = h('div', 'u7l2-rows'); P.appendChild(rows);
    const bl = hide(G.vline(xv, { color: VC, width: 2.5 }));
    const vp = hide(G.point(xv, 0, { color: 'amber', r: 8, label: T(`x=${d.bx}`), pos: first > 0 ? 'sw' : 'se' }));
    const arm = (s, cl) => hide(G.ray([xv, 0], [xv + s, Math.abs(d.m)], { start: null, color: cl, width: 5 }));
    const A1 = arm(first, FC), A2 = arm(-first, AC);
    const s1 = hide(G.shadeX(first > 0 ? xv : -Infinity, first > 0 ? Infinity : xv, { color: FC, band: true, offset: 0 }));
    const s2 = hide(G.shadeX(first > 0 ? -Infinity : xv, first > 0 ? xv : Infinity, { color: AC, band: true, openA: first < 0, openB: first > 0 }));
    const lx1 = xv + first * (d.win.xmax - d.win.xmin) * 0.22, lx2 = xv - first * (d.win.xmax - d.win.xmin) * 0.22;
    const L1 = hide(G.label(lx1, Math.abs(d.m) * Math.abs(lx1 - xv), T(`y=${d.e}`), { cls: 'bk-ptlab', pos: first > 0 ? 'se' : 'sw', color: FC, dx: first * 6 }));
    const L2 = hide(G.label(lx2, Math.abs(d.m) * Math.abs(lx2 - xv), T(`y=${d.p2}`), { cls: 'bk-ptlab', pos: first > 0 ? 'sw' : 'se', color: AC, dx: -first * 6 }));
    const def = `${T(`\\left|${d.e}\\right|=\\begin{cases}\\ \\ ${d.e}, & \\text{if } ${d.e}\\ge0\\\\ -(${d.e}), & \\text{if } ${d.e}<0\\end{cases}`)}`;
    const r1 = row(rows, 1, def);
    const sol = d.solve.map((s, i) => T(s) + (d.flip && i === d.solve.length - 1 ? ` <span class="u7l2-flip">÷ (${'−' + d.div.replace('-', '').replace('\\frac12', '½')}): flip!</span>` : '')).join('<br>');
    const r2 = row(rows, 2, sol);
    const r3 = row(rows, 3, `${T(`y=\\begin{cases}\\textcolor{${FC}}{${d.e}}, & \\text{if } ${d.c1}\\\\ \\textcolor{${AC}}{${d.p2}}, & \\text{if } ${d.c2}\\end{cases}`)}`);
    const flipEl = r2.querySelector('.u7l2-flip');
    return [
      { cap: `<b>1</b> Use the definition on the <b>whole</b> expression: ${T(`|${d.e}|`)} is ${T(d.e)} where ${T(`${d.e}\\ge0`)}, and ${T(`-(${d.e})`)} where ${T(`${d.e}<0`)}.`, run: (c) => show(c, r1) },
      { cap: d.flip ? `<b>2</b> Where is ${T(`${d.e}\\ge0`)}? ${T(d.solve[1])}. Divide by ${T(d.div)} and <b>reverse the sign</b>: ${T(d.c1)}. The boundary ${T(`x=${d.bx}`)} is the vertex.`
        : `<b>2</b> Where is ${T(`${d.e}\\ge0`)}? Solve: ${T(d.c1)}. The boundary ${T(`x=${d.bx}`)} is the ${T('x')}-coordinate of the vertex.`,
        run: async (c) => { await show(c, r2); if (flipEl) await pulse(c, flipEl, 1.25); await popP(c, vp); await drawIn(unhide(bl), 500, c); } },
      { cap: `<b>3</b> For ${T(d.c1)} the graph is the line ${T(`y=${d.e}`)} itself, on or above the axis: the <b>first piece</b> (the equal sign goes here).`,
        run: async (c) => { await drawIn(unhide(s1), 500, c); await drawIn(unhide(A1), 600, c); await show(c, unhide(L1)); } },
      { cap: `<b>4</b> For ${T(d.c2)} it is the <b>reflected arm</b>: ${T(`-(${d.e})=${d.p2}`)}. Write both pieces.`,
        run: async (c) => { await drawIn(unhide(s2), 500, c); await drawIn(unhide(A2), 600, c); await show(c, unhide(L2)); await show(c, r3); } }
    ];
  }
};

/* =============================== explainer: true or false? (Example 6) =============================== */
const TF = {
  a: { l: '|x-4|', r: 'x-4', cond: 'x\\ge4', f: (x) => Math.abs(x - 4), g: (x) => x - 4, lo: 4, hi: Infinity, openA: false, t: 6, lsub: '|6-4|', rsub: '6-4', ok: true, win: { xmin: -2, xmax: 10, ymin: -6, ymax: 8, xlabels: 2, ylabels: 2 },
    why: `for ${T('x\\ge4')}, ${T('x-4\\ge0')}, so the bars change nothing.` },
  b: { l: '|3x+6|', r: '3x+6', cond: 'x<-2', f: (x) => Math.abs(3 * x + 6), g: (x) => 3 * x + 6, lo: -Infinity, hi: -2, openB: true, t: -3, lsub: '|3(-3)+6|', rsub: '3(-3)+6', ok: false, win: { xmin: -7, xmax: 3, ymin: -8, ymax: 10, ylabels: 2 },
    why: `for ${T('x<-2')}, ${T('3x+6<0')}, so ${T('|3x+6|=-3x-6')}.` },
  c: { l: '|5-x|', r: 'x-5', cond: 'x>5', f: (x) => Math.abs(5 - x), g: (x) => x - 5, lo: 5, hi: Infinity, openA: true, t: 7, lsub: '|5-7|', rsub: '7-5', ok: true, win: { xmin: -1, xmax: 11, ymin: -6, ymax: 8, xlabels: 2, ylabels: 2 },
    why: `for ${T('x>5')}, ${T('5-x<0')}, so ${T('|5-x|=-(5-x)=x-5')}.` },
  d: { l: '|2x-3|', r: '-2x+3', cond: 'x\\le\\frac32', f: (x) => Math.abs(2 * x - 3), g: (x) => -2 * x + 3, lo: -Infinity, hi: 1.5, openB: false, t: 0, lsub: '|2(0)-3|', rsub: '-2(0)+3', ok: true, win: { xmin: -4, xmax: 6, ymin: -4, ymax: 8, ylabels: 2 },
    why: `for ${T('x\\le\\frac32')}, ${T('2x-3\\le0')}, so ${T('|2x-3|=-(2x-3)=-2x+3')}.` }
};
const tf = {
  title: 'True or false? Graph both sides',
  height: 444, minW: 880, capH: 96,
  choices: [{ sep: 'Example 6:' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }, { v: 'c', label: '(c)' }, { v: 'd', label: '(d)' }],
  ask: (v) => `<b>Example 6(${v}):</b> true or false? ${T(`${TF[v].l}=${TF[v].r}`)} if ${T(TF[v].cond)}.`,
  make(stage, v, ex) {
    const d = TF[v], W = ex.W, GW = 420, PX = GW + 26, PWd = W - PX;
    const G = new Graph(stage, Object.assign({ x: 0, y: 2, width: GW, height: 440, fontSize: 15 }, d.win));
    const xv = [4, -2, 5, 1.5][['a', 'b', 'c', 'd'].indexOf(v)], m = Math.abs(d.f(xv + 1) - d.f(xv));
    const V = vee(G, xv, m); V.els.forEach(hide);
    const ln = hide(G.fn(d.g, { color: IX, width: 3.5, dash: '10 7' }));
    const lab1 = hide(G.label(d.win.xmin + 0.6, d.win.ymax - 0.6, `${T('y=' + d.l)}`, { cls: 'bk-ptlab', pos: 'se', color: AC }));
    const lab2 = hide(G.label(d.win.xmin + 0.6, d.win.ymax - 2.2, `${T('y=' + d.r)}`, { cls: 'bk-ptlab', pos: 'se', color: IX }));
    const band = hide(G.shadeX(d.lo, d.hi, { band: true, color: 'amber', openA: d.openA, openB: d.openB }));
    const a = Math.max(d.lo, d.win.xmin), b = Math.min(d.hi, d.win.xmax);
    const hl = hide(G.fn(d.g, { from: a, to: b, color: d.ok ? COLORS.green : AC, width: 7, arrows: false }));
    const tl = hide(G.vline(d.t, { color: INK, width: 2 }));
    const p1 = hide(G.point(d.t, d.f(d.t), { color: 'red', r: 7 })), p2 = hide(G.point(d.t, d.g(d.t), { color: 'purple', r: 7 }));
    const P = div(stage, 'u7l2-pn', '', PX, 0, PWd);
    const claim = h('div', 'u7l2-claim', `${T(`${d.l}=${d.r}`)}<span>if ${T(d.cond)}</span>`); P.appendChild(claim);
    const ck = checkCard(P, { at: `x=${d.t}`, left: { tex: d.l, sub: d.lsub, f: ({ x }) => d.f(x) }, right: { tex: d.r, sub: d.rsub, f: ({ x }) => d.g(x) }, values: { x: d.t }, hidden: true, width: PWd });
    const st = stamp(stage, d.ok ? 'TRUE' : 'FALSE', { ok: d.ok, x: PX + PWd / 2, y: 400, size: 'lg' }); st.style.opacity = 0;
    return [
      { cap: `Graph both sides: the V ${T('y=' + d.l)} and the line ${T('y=' + d.r)}. The claim is only about ${T(d.cond)} (shaded).`,
        run: async (c) => { await drawV(c, V); await show(c, unhide(lab1)); await drawIn(unhide(ln), 600, c); await show(c, unhide(lab2)); await drawIn(unhide(band), 500, c); } },
      { cap: `Test a value in the interval: ${T(`x=${d.t}`)}. Left side ${T(`${d.lsub}=${tn(d.f(d.t))}`)}, right side ${T(`${d.rsub}=${tn(d.g(d.t))}`)}.`,
        run: async (c) => { await drawIn(unhide(tl), 400, c); await popP(c, p1); await popP(c, p2); await ck.play(c); } },
      { cap: d.ok ? `On the whole shaded part the line lies <b>on</b> the V: <b>true</b>, ${d.why}` : `On the shaded part the line is <b>below</b> the axis and the V above it: <b>false</b>, ${d.why}`,
        run: async (c) => { await drawIn(unhide(hl), 700, c); st.style.opacity = ''; await stampIn(c, st); } }
    ];
  }
};

/* =============================== explainer: unfold the V (Example 7(c)) =============================== */
const unflap = {
  title: 'Two lines, one V',
  height: 444, minW: 880, capH: 96,
  ask: `<b>Example 7(c):</b> the graph of ${T('y=|f(x)|')}, where ${T('f')} is linear, is shown. Find the two possible lines ${T('y=f(x)')}, then write ${T('y=|f(x)|')} as ${T('y=|ax+b|')}.`,
  make(stage, v, ex) {
    const W = ex.W, GW = 440, PX = GW + 26, PWd = W - PX;
    const G = new Graph(stage, Object.assign({ x: 0, y: 2, width: GW, height: 440, fontSize: 15 }, U7));
    const xl = (3 - 6.5) / 1.5, xr = (6.5 + 3) / 1.5;
    const Lg = G.segment([2, 0], [xl, 6.5], { color: INK, width: 4.5 }), Rg = G.segment([2, 0], [xr, 6.5], { color: INK, width: 4.5 });
    [[2, 0], [0, 3], [4, 3]].forEach(([x, y]) => G.point(x, y, { color: INK, r: 6.5, coords: true, pos: x === 0 ? 'w' : x === 4 ? 'e' : 's' }));
    const cols = (cl) => ({ front: ['rgba(58,66,84,.10)', INK], back: [cl === FC ? 'rgba(31,91,214,.13)' : 'rgba(123,79,196,.13)', cl], dotF: INK, dotB: cl });
    const FL1 = makeFlap(G, [[2, 0], [xl, 6.5], [xl, 0]], [[2, 0], [xl, 6.5]], [], cols(FC));
    const FL2 = makeFlap(G, [[2, 0], [xr, 6.5], [xr, 0]], [[2, 0], [xr, 6.5]], [], cols(IX));
    hide(FL1.g); hide(FL2.g);
    const tri = hide(G.polyline([[2, 0], [4, 0], [4, 3]], { color: AC, width: 2.5, dash: '6 5' }));
    const tl = hide(G.label(3, 0, `run ${T('2')}`, { cls: 'bk-ptlab', pos: 's', color: AC })), tr = hide(G.label(4, 1.5, `rise ${T('3')}`, { cls: 'bk-ptlab', pos: 'e', color: AC }));
    const l1 = hide(G.line([0, -3], [2, 0], { color: FC, width: 3.5 })), l2 = hide(G.line([0, 3], [2, 0], { color: IX, width: 3.5, dash: '10 7' }));
    const n1 = hide(G.label(-3.2, -6.0, T('y=\\frac32x-3'), { cls: 'bk-ptlab', pos: 'e', color: FC })), n2 = hide(G.label(4.9, -6.0, T('y=-\\frac32x+3'), { cls: 'bk-ptlab', pos: 'w', color: IX }));
    const P = div(stage, 'u7l2-pn', '', PX, 0, PWd);
    const rows = h('div', 'u7l2-rows'); P.appendChild(rows);
    const r = [row(rows, 1, `slope of the right arm: ${T('\\frac{3}{2}')}`), row(rows, 2, `${T('y=\\frac32x-3')}`), row(rows, 3, `${T('y=-\\frac32x+3')}`), row(rows, 4, `${T('y=\\left|\\frac32x-3\\right|')}<br>(the same as ${T('y=\\left|-\\frac32x+3\\right|')})`)];
    return [
      { cap: `<b>1</b> The right arm goes through ${T('(2,\\ 0)')} and ${T('(4,\\ 3)')}: rise ${T('3')}, run ${T('2')}, slope ${T('\\frac32')}.`,
        run: async (c) => { await show(c, r[0]); await drawIn(unhide(tri), 600, c); await show(c, unhide(tl)); await show(c, unhide(tr)); } },
      { cap: `<b>2</b> Keep the right arm and <b>fold the left arm down</b> under the axis: one line is ${T('y=\\frac32x-3')}, through ${T('(0,\\ -3)')}.`,
        run: async (c) => { hide(Lg); unhide(FL1.g); await FL1.flip(c, 1700); await drawIn(unhide(l1), 600, c); await show(c, unhide(n1)); await show(c, r[1]); } },
      { cap: `<b>3</b> Or keep the left arm and fold the <b>right</b> arm down: the reflection ${T('y=-\\frac32x+3')}, through ${T('(0,\\ 3)')} and ${T('(2,\\ 0)')}.`,
        run: async (c) => { await FL1.flip(c, 900, true); hide(FL1.g); unhide(Lg); hide(Rg); unhide(FL2.g); await FL2.flip(c, 1700); await drawIn(unhide(l2), 600, c); await show(c, unhide(n2)); await show(c, r[2]); } },
      { cap: `<b>4</b> Both lines give the same V: ${T('y=\\left|\\frac32x-3\\right|')} (or, the same function, ${T('y=\\left|-\\frac32x+3\\right|')}).`,
        run: async (c) => { await FL2.flip(c, 900, true); hide(FL2.g); unhide(Rg); await show(c, r[3]); await Promise.all([pulse(c, Lg, 1.02), pulse(c, Rg, 1.02)]); } }
    ];
  }
};

/* =============================== explainer: the water station (Example 8) =============================== */
const pE = (t) => 5 - 0.25 * t, dE = (t) => Math.abs(5 - 0.25 * t);
const ride = {
  title: 'Ride past the water station',
  height: 450, minW: 880, capH: 96,
  ask: `<b>Example 8:</b> ${T('p=5-0.25t')} (position) and ${T('d=|5-0.25t|')} (distance from the station), ${T('0\\le t\\le40')}. Table, graph, the station, ${T('2')} km away, domain and range.`,
  make(stage, v, ex) {
    const W = ex.W, SH = 124, GW = 520, GH = 320, PX = GW + 24, PWd = W - PX;
    /* the trail */
    const sc = svgEl('svg', { width: W, height: SH, viewBox: `0 0 ${W} ${SH}`, class: 'u7l2-scene' }, stage); sc.style.position = 'absolute'; sc.style.left = '0px'; sc.style.top = '0px';
    svgEl('rect', { x: 0, y: 0, width: W, height: SH, rx: 12, fill: '#eef6ea' }, sc);
    const TX0 = 50, TX1 = W - 50, TY = 96, kmx = (s) => TX0 + s / 10 * (TX1 - TX0); // s = km travelled (0 … 10)
    svgEl('line', { x1: TX0 - 20, x2: TX1 + 20, y1: TY, y2: TY, stroke: '#b9a77e', 'stroke-width': 10, 'stroke-linecap': 'round' }, sc);
    for (let s = 0; s <= 10; s++) { svgEl('line', { x1: kmx(s), x2: kmx(s), y1: TY + 6, y2: TY + 11, stroke: INK, 'stroke-width': 2 }, sc); const t = svgEl('text', { x: kmx(s), y: TY + 24, 'text-anchor': 'middle', class: 'u7l2-km' }, sc); t.textContent = String(5 - s).replace('-', '−'); }
    const stn = svgEl('text', { x: kmx(5), y: TY - 10, 'text-anchor': 'middle', 'font-size': 34 }, sc); stn.textContent = '🚰';
    const brk = svgEl('line', { x1: 0, x2: 0, y1: 30, y2: 30, stroke: AC, 'stroke-width': 4, 'stroke-linecap': 'round' }, sc);
    const blab = h('div', 'u7l2-blab'); add(stage, blab, 0, 0); blab.style.position = 'absolute';
    const flags = [12, 28].map((t) => { const f = svgEl('text', { x: kmx(0.25 * t) + 8, y: 60, 'text-anchor': 'middle', 'font-size': 24 }, sc); f.textContent = '🚩'; f.style.opacity = 0; return f; });
    const bike = svgEl('g', {}, sc); const be = svgEl('text', { x: 0, y: TY - 8, 'font-size': 40, 'text-anchor': 'middle', transform: 'scale(-1 1)' }, bike); be.textContent = '🚴';
    /* the graph */
    const G = new Graph(stage, { x: 0, y: SH + 6, width: GW, height: GH, xmin: 0, xmax: 42, ymin: -6.5, ymax: 6.5, xstep: 5, ystep: 1, ylabels: 2, xtitle: 't', ytitle: '\\text{km}', fontSize: 14 });
    const pp = [[0, 5], [0, 5]], dp = [[0, 5], [0, 5], [0, 5]];
    const pc = G.polyline(pp, { color: FC, width: 3, dash: '9 7' }), dc = G.polyline(dp, { color: AC, width: 4.5 });
    const dot = svgEl('circle', { r: 7, fill: AC, stroke: '#fff', 'stroke-width': 2 }, G.layers.top), pdot = svgEl('circle', { r: 6, fill: FC, stroke: '#fff', 'stroke-width': 2 }, G.layers.top);
    const tb = new ValueTable(null, { layout: 'h', headers: ['t', 'p', 'd'], rows: [0, 10, 20, 30, 40].map((t) => [t, pE(t), dE(t)]), hide: (r, c) => c > 0, tap: false, cellW: 60, cellH: 44, headW: 50, cls: 'u7l2-vt' });
    const P = div(stage, 'u7l2-pn', '', PX, SH + 6, PWd); P.appendChild(tb.el);
    const rows = h('div', 'u7l2-rows'); P.appendChild(rows);
    const S = { t: 0, max: 0 };
    const setT = (t) => {
      S.t = t; const s = 0.25 * t, bx = kmx(s);
      bike.setAttribute('transform', `translate(${bx} 0)`);
      const x1 = Math.min(bx, kmx(5)), x2 = Math.max(bx, kmx(5));
      brk.setAttribute('x1', x1); brk.setAttribute('x2', x2); brk.style.opacity = x2 - x1 > 4 ? 1 : 0;
      blab.innerHTML = T(`d=${tn(dE(t))}`); blab.style.left = ((x1 + x2) / 2 - 40) + 'px'; blab.style.top = '0px';
      if (t > S.max) { S.max = t; pp[1] = [t, pE(t)]; dp[1] = [Math.min(t, 20), dE(Math.min(t, 20))]; dp[2] = [t, dE(t)]; pc._bkDraw(); dc._bkDraw(); }
      const [dx, dy] = G.toPx(t, dE(t)), [px, py] = G.toPx(t, pE(t)); dot.setAttribute('cx', dx); dot.setAttribute('cy', dy); pdot.setAttribute('cx', px); pdot.setAttribute('cy', py);
      [0, 10, 20, 30, 40].forEach((tt, i) => { if (S.max >= tt - 1e-9) { tb.reveal(i, 1, null); tb.reveal(i, 2, null); } });
    };
    setT(0);
    const go = (c, to, ms) => { const t0 = S.t; return tween(c, ms, (u) => setT(t0 + (to - t0) * u), linear); };
    const ring = glowRing(G.layers.top);
    const vp = hide(G.point(20, 0, { color: 'amber', r: 8, label: T('(20,\\ 0)'), pos: 'se' }));
    const two = hide(G.hline(2, { color: IX, width: 2.5, dash: false }));
    const q1 = hide(G.point(12, 2, { color: 'purple', r: 7, label: T('t=12'), pos: 'nw' })), q2 = hide(G.point(28, 2, { color: 'purple', r: 7, label: T('t=28'), pos: 'ne' }));
    const dom = hide(G.shadeX(0, 40)), ran = hide(G.shadeY(0, 5));
    const r = [row(rows, 'c', `${T('5-0.25t=0')}: ${T('t=20')} min`), row(rows, 'd', `${T('d=2')}: ${T('t=12')}, ${T('t=28')} min<br>${T('|5-3|=2')}, ${T('|5-7|=2')}`), row(rows, 'e', `${T('\\{t\\mid 0\\le t\\le40,\\ t\\in\\mathbb{R}\\}')}<br>${T('\\{d\\mid 0\\le d\\le5,\\ d\\in\\mathbb{R}\\}')}`)];
    return [
      { cap: `(a), (b) Ride! Her position ${T('p=5-0.25t')} (dashed) goes from ${T('5')} down to ${T('-5')}; her distance ${T('d=|5-0.25t|')} (solid) can't go below ${T('0')}. The table fills every 10 minutes.`,
        run: async (c) => { await go(c, 40, 6000); } },
      { cap: `(c) She reaches the station when ${T('d=0')}: ${T('5-0.25t=0')}, so ${T('t=20')} min. That is the <b>vertex</b> of the V.`,
        run: async (c) => { await go(c, 20, 1600); await show(c, r[0]); await popP(c, vp); placeRing(ring, G, 20, 0); } },
      { cap: `(d) Draw the line ${T('d=2')}. It meets the V twice: ${T('t=12')} min (2 km before the station) and ${T('t=28')} min (2 km after it).`,
        run: async (c) => { ring.style.display = 'none'; await drawIn(unhide(two), 600, c); await go(c, 12, 1000); flags[0].style.opacity = 1; await popP(c, q1); await go(c, 28, 1700); flags[1].style.opacity = 1; await popP(c, q2); await show(c, r[1]); } },
      { cap: `(e) In this context the domain is ${T('\\{t\\mid 0\\le t\\le40,\\ t\\in\\mathbb{R}\\}')} and the range is ${T('\\{d\\mid 0\\le d\\le5,\\ d\\in\\mathbb{R}\\}')}.`,
        run: async (c) => { await go(c, 40, 1200); await drawIn(unhide(dom), 500, c); await drawIn(unhide(ran), 500, c); await show(c, r[2]); } }
    ];
  }
};

/* =============================== Stand Up Break =============================== */
/* BEG: the invariant point and which side is reflected for y = |f(x)|. PRG: vertex, y-intercept, domain and range of
 * y = |ax + b|. MAS: the piecewise form (a negative a sometimes: reverse the sign). */
const fr = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = gcd(Math.abs(n), d) || 1; n /= g; d /= g; return d === 1 ? String(n) : (n < 0 ? '-' : '') + `\\frac{${Math.abs(n)}}{${d}}`; };
const linT = (a, b) => `${a === 1 ? '' : a === -1 ? '-' : a}x${b ? (b > 0 ? '+' : '-') + Math.abs(b) : ''}`;
const negLin = (a, b) => linT(-a, -b);
standup('u7l2', {
  intro: 'At your whiteboard: keep what is above the x-axis, flip up what is below it.',
  levels: {
    BEG: (r) => {
      const a = r.pick([1, 2, 3, -1, -2, -3]), x0 = r.int(-5, 5), b = -a * x0;
      const side = a > 0 ? 'left' : 'right';
      return { text: 'Sketch the graph of y = f(x) and of y = |f(x)|. State the invariant point and which part of the line is reflected.', q: `f(x)=${linT(a, b)}`,
        a: [`${linT(a, b)}=0\\Rightarrow x=${x0}`, `\\text{invariant point }(${x0},\\ 0)`, `\\text{the part ${side} of }x=${x0}\\text{ is reflected}`] };
    },
    PRG: (r) => {
      for (;;) {
        const a = r.pick([2, 3, 4, 5, -2, -3, -4]), b = r.int(-12, 12);
        if (!b) continue;
        return { text: 'State the vertex, the y-intercept, the domain and the range.', q: `y=|${linT(a, b)}|`,
          a: [`${linT(a, b)}=0\\Rightarrow x=${fr(-b, a)}:\\ \\text{vertex }\\left(${fr(-b, a)},\\ 0\\right)`, `y\\text{-intercept }(0,\\ ${Math.abs(b)})`, `\\{x\\mid x\\in\\mathbb{R}\\},\\ \\{y\\mid y\\ge0,\\ y\\in\\mathbb{R}\\}`] };
      }
    },
    MAS: (r) => {
      for (;;) {
        const a = r.pick([2, 3, 4, -1, -2, -3, -5]), b = r.int(-9, 9);
        if (!b) continue;
        const bd = fr(-b, a), up = a > 0, c1 = `x${up ? '\\ge' : '\\le'}${bd}`, c2 = `x${up ? '<' : '>'}${bd}`;
        const work = a < 0 ? [`${linT(a, b)}\\ge0\\Rightarrow ${linT(a, 0)}\\ge${-b}\\Rightarrow ${c1}\\ (\\text{sign reversed})`] : [`${linT(a, b)}\\ge0\\Rightarrow ${c1}`];
        return { text: 'Write the function in piecewise form.', q: `y=|${linT(a, b)}|`,
          a: [...work, `y=\\begin{cases}${linT(a, b)}, & ${c1}\\\\ ${negLin(a, b)}, & ${c2}\\end{cases}`] };
      }
    }
  }
});

/* =============================== mount =============================== */
export const explainers = mountExplainers({ flap, sketch, piece, tf, unflap, ride });
export const _test = { exitPt, pE, dE, FL, PW, TF };
