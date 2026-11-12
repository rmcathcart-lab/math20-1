/* Math 20-1 · Unit 5 · Lesson 2 — Graphing y = a(x − p)² + q.
 * New lesson format (2026-11-11): the warm-up ("The Daily Gems") is plain markup on the page (no code). Explainers:
 *   steps   (Example 1: the table of y = x² fills, the parabola is drawn, then the step pattern climbs from the vertex:
 *            up 1, 3, 5 to the right and the same to the left, with the axis of symmetry),
 *   slide   (translations: five points of y = x² slide with arrows: q = 2 up; y = (x − 3)² right, with its little
 *            table; the sign trap (x + 3)² = (x − (−3))² left; then (x + 3)² − 1),
 *   stretch (vertical stretches: every y-value is multiplied by a; the points slide along vertical arrows away from or
 *            toward the x-axis, the points on the axis stay put: a = 3, a = 1/3, a = −2 (the reflection)),
 *   play    (STAR, hands-on: y = a(x − p)² + q with three sliders; the step pattern a×1, a×3, a×5 redraws live from the
 *            vertex, with the description, the vertex/axis/max-min and the mapping of (2, 4) → (x + p, ay + q)),
 *   race    (Example 7: Mila and Jonah side by side follow (0, 0) and (1, 1) through their two orders; the real graph is
 *            drawn on both and the points get stamped: on it ✓ / off it ✗),
 *   sketch  (the procedure, numbered 1–4: vertex, the steps (2 across for a fraction), join, state; Example 8 (a), (b)).
 * Colours: y = x² grey (dashed in pictures); the new graph blue; the vertex red; the steps amber; translation arrows
 * purple; stretch arrows green. */
import {
  h, tex, add, box, Graph, ValueTable, stamp, stampIn, mountExplainers, pop, fadeIn, anim, sleep, tween, svgEl, pulse,
  arrowHead, COLORS, texNum
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const CURVE = COLORS.blue, STEP = COLORS.amber, MOVE = COLORS.purple, STR = COLORS.green, BASEC = '#8a909c';
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; if (el && el.label) el.label.style.opacity = 0; return el; };
const unhide = (el) => { if (el) el.style.opacity = ''; if (el && el.label) el.label.style.opacity = ''; return el; };
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
const popP = (c, p) => Promise.all([pop(c, unhide(p)), p.label ? show(c, p.label) : null]);
/* a numbered row for step-by-step procedures (the step number beside each step as it appears) */
const row = (host, n, html) => { const r = h('div', 'u5l2-row', `<span class="u5l2-n">${n}</span><div class="u5l2-rc">${html}</div>`); r.style.opacity = 0; host.appendChild(r); return r; };
/** TeX for a number that may be a fraction with denominator 2, 3 or 4 */
export function fa(v) {
  if (Math.abs(v) < 1e-9) return '0';
  if (Math.abs(v - Math.round(v)) < 1e-9) return String(Math.round(v));
  for (const d of [2, 3, 4]) { const n = v * d; if (Math.abs(n - Math.round(n)) < 1e-9) { const N = Math.round(n); return (N < 0 ? '-' : '') + `\\frac{${Math.abs(N)}}{${d}}`; } }
  return texNum(v, 2);
}
const pair = (x, y) => `(${fa(x)},\\ ${fa(y)})`;
/** y = a(x − p)² + q in the booklet's style */
export function eqTex(a, p, q) {
  const A = Math.abs(a - 1) < 1e-9 ? '' : Math.abs(a + 1) < 1e-9 ? '-' : fa(a);
  const sq = Math.abs(p) < 1e-9 ? 'x^2' : `(x${p > 0 ? '-' + fa(p) : '+' + fa(-p)})^2`;
  const Q = Math.abs(q) < 1e-9 ? '' : q > 0 ? '+' + fa(q) : '-' + fa(-q);
  return `y=${A}${sq}${Q}`;
}
/** "vertical stretch by a factor of 2, reflection in the x-axis, translation 3 right and 5 up" */
export function describe(a, p, q) {
  const parts = [], A = Math.abs(a);
  if (Math.abs(A - 1) > 1e-9) parts.push(`vertical stretch by a factor of ${T(fa(A))}`);
  if (a < 0) parts.push(`reflection in the ${T('x')}-axis`);
  const tr = [];
  if (Math.abs(p) > 1e-9) tr.push(`${T(fa(Math.abs(p)))} ${Math.abs(Math.abs(p) - 1) < 1e-9 ? 'unit' : 'units'} ${p > 0 ? 'right' : 'left'}`);
  if (Math.abs(q) > 1e-9) tr.push(`${T(fa(Math.abs(q)))} ${Math.abs(Math.abs(q) - 1) < 1e-9 ? 'unit' : 'units'} ${q > 0 ? 'up' : 'down'}`);
  if (tr.length) parts.push('translation ' + tr.join(' and '));
  return parts.length ? parts.join(', ') : `no change: this is ${T('y=x^2')} itself`;
}
/* a moving arrow from (x0, y0) to (x1, y1) on a graph (drawn in with G.drawIn) */
const arrowSeg = (G, x0, y0, x1, y1, color, width = 3) => G.segment([x0, y0], [x1, y1], { arrowB: true, color, width });

/* =============================== explainer: the step pattern (Example 1) =============================== */
const steps = {
  title: 'The step pattern of y = x²',
  height: 440, minW: 880,
  ask: `<b>Example 1:</b> make a table for ${T('y=x^2')}, graph it, then walk away from the vertex one unit at a time.`,
  make(stage, v, ex) {
    const W = ex.W, xs = [-3, -2, -1, 0, 1, 2, 3];
    const G = new Graph(stage, { x: 0, y: 4, width: 430, height: 432, xmin: -4, xmax: 4, ymin: -1, ymax: 10, fontSize: 15, pad: [30, 18, 18, 18] });
    const tb = new ValueTable(stage, { x: 462, y: 20, headers: ['x', 'y'], rows: xs.map((x) => [x, x * x]), hide: 1, tap: false, cellW: 84, cellH: 44 });
    const NX = 660, note = div(stage, 'u5l2-note', '', NX, 30, W - NX);
    const nR = h('div', 'u5l2-nl', `<b>Right of the vertex</b>${T('0\\to1\\to4\\to9')}<span class="u5l2-big">up ${T('1,\\ 3,\\ 5')}</span>`);
    const nL = h('div', 'u5l2-nl', `<b>Left of the vertex</b>${T('0\\to1\\to4\\to9')}<span class="u5l2-big">up ${T('1,\\ 3,\\ 5')}</span>`);
    const nA = h('div', 'u5l2-nl u5l2-nax', `<b>Axis of symmetry</b>${T('x=0')}`);
    [nR, nL, nA].forEach((e) => { e.style.opacity = 0; note.appendChild(e); });
    const pts = xs.map((x) => hide(G.point(x, x * x, { color: 'blue', r: 6 })));
    const cv = hide(G.fn('x^2', { color: CURVE, width: 4, from: -3.1, to: 3.1 }));
    const vx = hide(G.point(0, 0, { color: 'red', r: 8, label: `vertex ${T('(0,\\ 0)')}`, pos: 'se', labelColor: COLORS.red }));
    const stair = (s) => [1, 2, 3].map((i) => {
      const y0 = (i - 1) ** 2, y1 = i * i;
      const hs = hide(G.segment([s * (i - 1), y0], [s * i, y0], { color: BASEC, width: 2.5, dash: '5 5' }));
      const vs = hide(G.segment([s * i, y0], [s * i, y1], { color: STEP, width: 5 }));
      const lb = G.label(s * i, (y0 + y1) / 2, T('+' + (2 * i - 1)), { pos: s > 0 ? 'e' : 'w', cls: 'u5l2-slab', gap: 6 }); lb.style.opacity = 0;
      return { hs, vs, lb };
    });
    const R = stair(1), L = stair(-1);
    const axis = hide(G.vline(0, { color: COLORS.red, width: 2.5 }));
    const climb = async (c, st) => { for (const s of st) { unhide(s.hs); await G.drawIn(s.hs, 260, c); unhide(s.vs); await G.drawIn(s.vs, 380, c); await show(c, s.lb); } };
    return [
      { cap: `Square each ${T('x')}: ${T('(-3)^2=9')}, ${T('(-2)^2=4')}, ${T('(-1)^2=1')}, ${T('0^2=0')}, … A square is never negative, so no ${T('y')}-value is below ${T('0')}.`,
        run: (c) => tb.fill(c, { col: 1 }) },
      { cap: `Plot the seven points and join them with a smooth U: the <b>parabola</b> ${T('y=x^2')}. Its lowest point is the <b>vertex</b> ${T('(0,\\ 0)')}, so the minimum value is ${T('0')}.`,
        run: async (c) => { for (const p of pts) { unhide(p); await pop(c, p, 200); } unhide(cv); await G.drawIn(cv, 900, c); await popP(c, vx); } },
      { cap: `From the vertex, go <b>1 right</b> at a time: ${T('y')} goes ${T('0\\to1\\to4\\to9')}, up <b>${T('1')}, then ${T('3')}, then ${T('5')}</b>.`,
        run: async (c) => { await climb(c, R); await show(c, nR); } },
      { cap: `Going <b>left</b> is the same, ${T('1,\\ 3,\\ 5')}: the <b>axis of symmetry</b> ${T('x=0')} folds one side onto the other. This is the <b>step pattern</b> of ${T('y=x^2')}.`,
        run: async (c) => { await climb(c, L); await show(c, nL); unhide(axis); await G.drawIn(axis, 600, c); await show(c, nA); } }
    ];
  }
};

/* =============================== explainer: translations =============================== */
const slide = {
  title: 'Slide the points of y = x²',
  height: 440, minW: 880, capH: 90,
  ask: `Every point of ${T('y=x^2')} (grey) moves the same way. Where does ${T('q')} move it? Where does ${T('p')} move it?`,
  make(stage, v, ex) {
    const W = ex.W, xs = [-2, -1, 0, 1, 2], GW = 560;
    const G = new Graph(stage, { x: 0, y: 4, width: GW, height: 432, xmin: -7, xmax: 7, ymin: -3, ymax: 9, fontSize: 15, pad: [30, 18, 18, 18] });
    G.fn('x^2', { color: BASEC, width: 3, dash: '7 6' });
    xs.forEach((x) => G.point(x, x * x, { color: 'gray', r: 5 }));
    const P = div(stage, 'u5l2-pn', '', GW + 22, 6, W - GW - 22);
    const eq = h('div', 'u5l2-eqbig', T('y=x^2')); P.appendChild(eq);
    const info = h('div', 'u5l2-info'); P.appendChild(info);
    const mt = h('div', 'u5l2-mt'); P.appendChild(mt);
    const dots = xs.map((x) => hide(G.point(x, x * x, { color: 'blue', r: 7 })));
    let junk = [];
    const clear = () => { junk.forEach((e) => e.remove()); junk = []; };
    /* move every blue dot from (x, x²) + (fx, fy) to + (tx, ty), with arrows */
    const slideAll = async (c, from, to) => {
      dots.forEach((d, i) => { unhide(d); G.moveTo(d, xs[i] + from[0], xs[i] ** 2 + from[1]); });
      const ar = dots.map((d, i) => { const x0 = xs[i] + from[0], y0 = xs[i] ** 2 + from[1]; return arrowSeg(G, x0, y0, xs[i] + to[0], xs[i] ** 2 + to[1], MOVE); });
      junk.push(...ar);
      await Promise.all(ar.map((a) => G.drawIn(a, 600, c)));
      await Promise.all(dots.map((d, i) => G.move(c, d, xs[i] + to[0], xs[i] ** 2 + to[1], 800)));
    };
    const curve = async (c, f, o = {}) => { const cv = G.fn(f, Object.assign({ color: CURVE, width: 4 }, o)); junk.push(cv); await G.drawIn(cv, 700, c); return cv; };
    const vtx = (x, y) => { const p = G.point(x, y, { color: 'red', r: 8, label: `vertex ${T(pair(x, y))}`, pos: y > 3 ? 'se' : 'ne', labelColor: COLORS.red }); junk.push(p, p.label); return p; };
    const set = (e, html) => { e.innerHTML = html; };
    return [
      { cap: `${T('y=x^2+q')} adds ${T('q')} to every ${T('y')}-value. With ${T('q=2')}, every point moves <b>${T('2')} up</b>: the vertex goes to ${T('(0,\\ 2)')}.`,
        run: async (c) => {
          set(eq, T('y=x^2+2')); set(info, `every point: ${T('(x,\\ y)\\to(x,\\ y+2)')}`);
          await slideAll(c, [0, 0], [0, 2]); await curve(c, 'x^2+2'); await popP(c, vtx(0, 2));
        } },
      { cap: `${T('y=(x-3)^2')}: ${T('y=0')} when ${T('x=3')}, ${T('y=1')} when ${T('x=2')} or ${T('4')}, … Every ${T('y')}-value of ${T('y=x^2')} now happens <b>${T('3')} units right</b>.`,
        run: async (c) => {
          clear(); set(eq, T('y=(x-3)^2')); set(info, `every point: ${T('(x,\\ y)\\to(x+3,\\ y)')}`);
          set(mt, `<table class="u5l2-mtab"><tr><th>${T('x')}</th>${[1, 2, 3, 4, 5].map((x) => `<td>${T(String(x))}</td>`).join('')}</tr><tr><th>${T('y')}</th>${[1, 2, 3, 4, 5].map((x) => `<td>${T(String((x - 3) ** 2))}</td>`).join('')}</tr></table>`);
          await show(c, mt); await slideAll(c, [0, 0], [3, 0]); await curve(c, '(x-3)^2'); await popP(c, vtx(3, 0));
        } },
      { cap: `Watch the sign: ${T('y=(x+3)^2=(x-(-3))^2')} has ${T('p=-3')}, so it moves <b>${T('3')} units left</b>. The number in the bracket has the <b>opposite</b> sign of the move.`,
        run: async (c) => {
          clear(); mt.innerHTML = ''; set(eq, T('y=(x+3)^2=(x-(-3))^2')); set(info, `${T('p=-3')}: every point ${T('(x,\\ y)\\to(x-3,\\ y)')}`);
          await slideAll(c, [0, 0], [-3, 0]); await curve(c, '(x+3)^2'); await popP(c, vtx(-3, 0));
        } },
      { cap: `Both at once: ${T('y=(x+3)^2-1')} is ${T('3')} left and ${T('1')} down. Vertex ${T('(p,\\ q)=(-3,\\ -1)')}, axis of symmetry ${T('x=-3')}. The shape, and the steps ${T('1,\\ 3,\\ 5')}, never change.`,
        run: async (c) => {
          clear(); set(eq, T('y=(x+3)^2-1')); set(info, `${T('p=-3')}, ${T('q=-1')}: vertex ${T('(-3,\\ -1)')}, axis ${T('x=-3')}`);
          dots.forEach((d, i) => G.moveTo(d, xs[i] - 3, xs[i] ** 2));
          const ghost = G.fn('(x+3)^2', { color: CURVE, width: 2.5, dash: '3 6' }); junk.push(ghost);
          await slideAll(c, [-3, 0], [-3, -1]); await curve(c, '(x+3)^2-1');
          const ax = G.vline(-3, { color: COLORS.red, width: 2.5 }); junk.push(ax); await G.drawIn(ax, 500, c); await popP(c, vtx(-3, -1));
        } }
    ];
  }
};

/* =============================== explainer: vertical stretches and reflections =============================== */
const stretch = {
  title: 'Multiply every y-value by a',
  height: 440, minW: 880, capH: 90,
  ask: `${T('y=ax^2')}: every point of ${T('y=x^2')} (grey) keeps its ${T('x')} and gets its ${T('y')} multiplied by ${T('a')}.`,
  make(stage, v, ex) {
    const W = ex.W, GW = 420, xs = [-3, -2, -1, 0, 1, 2, 3];
    const G = new Graph(stage, { x: 0, y: 4, width: GW, height: 432, xmin: -4, xmax: 4, ymin: -9, ymax: 13, ylabels: 2, fontSize: 14, pad: [30, 18, 18, 18] });
    G.fn('x^2', { color: BASEC, width: 3, dash: '7 6' });
    xs.forEach((x) => G.point(x, x * x, { color: 'gray', r: 5 }));
    const P = div(stage, 'u5l2-pn', '', GW + 24, 6, W - GW - 24);
    const eq = h('div', 'u5l2-eqbig', T('y=x^2')); P.appendChild(eq);
    const maps = h('div', 'u5l2-maps'); P.appendChild(maps);
    const verdict = h('div', 'u5l2-verd'); P.appendChild(verdict);
    let junk = [];
    const run = async (c, a, use, words) => {
      junk.forEach((e) => e.remove()); junk = [];
      eq.innerHTML = T(`y=${fa(a)}x^2`).replace('y=1x', 'y=x');
      maps.innerHTML = use.filter((x) => x >= 0).map((x) => `<div>${T(`${pair(x, x * x)}\\to${pair(x, a * x * x)}`)}</div>`).join('');
      verdict.innerHTML = words; verdict.style.opacity = 0;
      await show(c, maps);
      const ar = use.filter((x) => x !== 0).map((x) => arrowSeg(G, x, x * x, x, a * x * x, STR, 3.5)); junk.push(...ar);
      const dots = use.map((x) => G.point(x, x * x, { color: 'blue', r: 7 })); junk.push(...dots);
      await Promise.all(ar.map((e) => G.drawIn(e, 650, c)));
      await Promise.all(dots.map((d) => G.move(c, d, d.gx, a * d.gx * d.gx, 800)));
      const cv = G.fn((x) => a * x * x, { color: CURVE, width: 4 }); junk.push(cv); await G.drawIn(cv, 700, c);
      await show(c, verdict);
    };
    return [
      { cap: `${T('a=3')}: every ${T('y')}-value is tripled, ${T('(1,\\ 1)\\to(1,\\ 3)')}, ${T('(2,\\ 4)\\to(2,\\ 12)')}. ${T('(0,\\ 0)')} is on the ${T('x')}-axis and does not move. The others move <b>away</b> from the axis: <b>narrower</b>.`,
        run: (c) => run(c, 3, [-2, -1, 0, 1, 2], '<b>Narrower</b><span>a vertical stretch by a factor of 3 (an expansion)</span>') },
      { cap: `${T('a=\\frac13')}: every ${T('y')}-value is divided by ${T('3')}, ${T('(3,\\ 9)\\to(3,\\ 3)')}. The points move <b>toward</b> the ${T('x')}-axis: <b>wider</b>, a stretch by a factor of ${T('\\frac13')} (a compression).`,
        run: (c) => run(c, 1 / 3, [-3, -2, -1, 0, 1, 2, 3], '<b>Wider</b><span>a vertical stretch by a factor of ⅓ (a compression)</span>') },
      { cap: `${T('a=-2')}: ${T('(1,\\ 1)\\to(1,\\ -2)')}, ${T('(2,\\ 4)\\to(2,\\ -8)')}. Stretched by ${T('2')} <b>and flipped</b> to the other side of the ${T('x')}-axis: a <b>reflection</b>. It opens down, so the vertex is a <b>maximum</b>.`,
        run: (c) => run(c, -2, [-2, -1, 0, 1, 2], '<b>Reflected</b><span>a stretch by a factor of 2 and a reflection in the x-axis: opens down</span>') }
    ];
  }
};

/* =============================== explainer: play with a, p and q (STAR, hands-on) =============================== */
const A_VALS = [-4, -3, -2, -1.5, -1, -0.5, -0.25, 0.25, 0.5, 1, 1.5, 2, 3, 4];
const nearestA = (a) => A_VALS.reduce((b, v, i) => (Math.abs(v - a) < Math.abs(A_VALS[b] - a) ? i : b), 0);
const play = {
  title: 'Play with a, p and q',
  height: 460, minW: 900, tap: false, capH: 92,
  ask: `${T('y=a(x-p)^2+q')}: move the sliders and watch ${T('y=x^2')} (grey) stretch, flip and slide. The amber steps show ${T('a\\times1')}, ${T('a\\times3')}, ${T('a\\times5')}.`,
  make(stage, v, ex) {
    const W = ex.W, GW = 460, PX = GW + 20, PW = W - PX;
    const S = { a: 1, p: 0, q: 0, track: false };
    const G = new Graph(stage, { x: 0, y: 0, width: GW, height: 460, xmin: -8, xmax: 8, ymin: -10, ymax: 10, xlabels: 2, ylabels: 2, fontSize: 14, pad: [30, 18, 18, 18] });
    G.fn('x^2', { color: BASEC, width: 2.5, dash: '7 6' });
    const cv = G.fn((x) => S.a * (x - S.p) ** 2 + S.q, { color: CURVE, width: 4 });
    const stH = svgEl('path', { fill: 'none', stroke: BASEC, 'stroke-width': 2.5, 'stroke-dasharray': '5 5' }, G.layers.data);
    const stV = svgEl('path', { fill: 'none', stroke: STEP, 'stroke-width': 5, 'stroke-linecap': 'round' }, G.layers.data);
    const sd = []; for (let i = 0; i < 6; i++) sd.push(G.point(0, 0, { color: 'amber', r: 5 }));
    const slab = [1, 2, 3].map(() => G.label(0, 0, '', { pos: 'e', cls: 'u5l2-slab', gap: 6 }));
    const vx = G.point(0, 0, { color: 'red', r: 7.5, label: '', pos: 'ne', labelColor: COLORS.red });
    const mapG = svgEl('g', {}, G.layers.data);
    const tp0 = G.point(2, 4, { color: 'slate', r: 6 }), tp1 = G.point(2, 4, { color: 'purple', r: 7.5 });
    // the panel
    const P = div(stage, 'u5l2-pn u5l2-pn-play', '', PX, 0, PW);
    const eq = h('div', 'u5l2-eqbig'); P.appendChild(eq);
    const mk = (name, min, max, label) => {
      const sl = h('label', 'u5l2-sl no-ink', `<span class="u5l2-sll">${T(name)}</span><input type="range" min="${min}" max="${max}" step="1" aria-label="${label}"><span class="u5l2-slv"></span>`);
      sl.setAttribute('data-tap', ''); P.appendChild(sl); return { sl, inp: sl.querySelector('input'), out: sl.querySelector('.u5l2-slv') };
    };
    const sA = mk('a', 0, A_VALS.length - 1, 'the value of a'), sP = mk('p', -6, 6, 'the value of p'), sQ = mk('q', -8, 8, 'the value of q');
    const info = h('div', 'u5l2-pinfo'); P.appendChild(info);
    const desc = h('div', 'u5l2-desc'); P.appendChild(desc);
    const upd = () => {
      const { a, p, q } = S;
      cv._bkDraw();
      let dH = '', dV = '';
      for (const s of [1, -1]) for (let i = 1; i <= 3; i++) {
        const y0 = q + a * (i - 1) ** 2, y1 = q + a * i * i, [ax, ay] = G.toPx(p + s * (i - 1), y0), [bx] = G.toPx(p + s * i, y0), by = G.toPx(0, y1)[1];
        dH += `M${ax.toFixed(1)} ${ay.toFixed(1)}H${bx.toFixed(1)}`; dV += `M${bx.toFixed(1)} ${ay.toFixed(1)}V${by.toFixed(1)}`;
      }
      stH.setAttribute('d', dH); stV.setAttribute('d', dV);
      [1, 2, 3].forEach((i, k) => {
        G.moveTo(sd[2 * k], p + i, q + a * i * i); G.moveTo(sd[2 * k + 1], p - i, q + a * i * i);
        slab[k].innerHTML = T(fa(a * (2 * i - 1))); G.moveTo(slab[k], p + i, q + a * ((i - 1) ** 2 + i * i) / 2);
      });
      G.moveTo(vx, p, q); vx.label.innerHTML = T(pair(p, q));
      const up = a > 0;
      eq.innerHTML = T(eqTex(a, p, q));
      sA.inp.value = nearestA(a); sA.out.innerHTML = T(fa(a)); sP.inp.value = Math.round(p); sP.out.innerHTML = T(fa(p)); sQ.inp.value = Math.round(q); sQ.out.innerHTML = T(fa(q));
      info.innerHTML = `<div><i>Vertex</i>${T(pair(p, q))}</div><div><i>Axis</i>${T('x=' + fa(p))}</div><div><i>Opens</i>${up ? 'up' : 'down'}</div><div><i>${up ? 'Minimum' : 'Maximum'} value</i>${T(fa(q))}</div>`
        + `<div class="u5l2-pwide"><i>Steps from the vertex</i><b class="u5l2-amb">${T(`${fa(a)},\\ ${fa(3 * a)},\\ ${fa(5 * a)}`)}</b></div>`
        + (S.track ? `<div class="u5l2-pwide u5l2-pmap"><i>The point</i>${T(`(2,\\ 4)\\to${pair(2 + p, 4 * a + q)}`)}</div>` : '');
      desc.innerHTML = `<i>Compared with ${T('y=x^2')}:</i> ${describe(a, p, q)}`;
      // the mapping of (2, 4)
      mapG.innerHTML = '';
      [tp0, tp1].forEach((e) => (e.style.display = S.track ? '' : 'none'));
      if (S.track) {
        const x1 = 2 + p, y1 = 4 * a + q; G.moveTo(tp1, x1, y1); tp1._bkDraw(); tp0._bkDraw();
        const [ax, ay] = G.toPx(2, 4), [bx, by] = G.toPx(x1, y1), L = Math.hypot(bx - ax, by - ay);
        if (L > 20) {
          const ux = (bx - ax) / L, uy = (by - ay) / L, ex2 = bx - ux * 9, ey2 = by - uy * 9;
          svgEl('line', { x1: ax + ux * 8, y1: ay + uy * 8, x2: ex2, y2: ey2, stroke: MOVE, 'stroke-width': 3, 'stroke-dasharray': '2 6', 'stroke-linecap': 'round' }, mapG);
          arrowHead(mapG, ex2 + ux * 2, ey2 + uy * 2, ux, uy, { color: MOVE, width: 3 });
        }
      }
    };
    sA.inp.addEventListener('input', () => { S.a = A_VALS[+sA.inp.value]; upd(); });
    sP.inp.addEventListener('input', () => { S.p = +sP.inp.value; upd(); });
    sQ.inp.addEventListener('input', () => { S.q = +sQ.inp.value; upd(); });
    upd();
    const go = (c, key, to, ms = 900) => { const v0 = S[key]; return tween(c, ms, (u) => { S[key] = u >= 1 ? to : v0 + (to - v0) * u; upd(); }); };
    return [
      { cap: `Start with ${T('a=1')}, ${T('p=0')}, ${T('q=0')}: that is ${T('y=x^2')} itself. From the vertex, 1 across and up ${T('1')}, ${T('3')}, ${T('5')}: the step pattern.`,
        run: async (c) => { await Promise.all(slab.map((l) => pulse(c, l, 1.4))); } },
      { cap: `<b>Stretch first.</b> ${T('a=2')} doubles every step: ${T('2,\\ 6,\\ 10')}. The parabola is narrower: a vertical stretch by a factor of ${T('2')}.`,
        run: (c) => go(c, 'a', 2, 900) },
      { cap: `${T('a=-2')}: the steps are ${T('-2,\\ -6,\\ -10')}, so they go <b>down</b>. The graph is reflected in the ${T('x')}-axis: it opens down and the vertex is a maximum.`,
        run: (c) => go(c, 'a', -2, 1600) },
      { cap: `<b>Then translate.</b> ${T('p=3')} slides it ${T('3')} right and ${T('q=5')} slides it ${T('5')} up: ${T('y=-2(x-3)^2+5')}, vertex ${T('(3,\\ 5)')}. The steps travel with the vertex, unchanged.`,
        run: async (c) => { await go(c, 'p', 3, 900); await go(c, 'q', 5, 900); } },
      { cap: `Follow one point: ${T('(2,\\ 4)')} on ${T('y=x^2')} maps to ${T('(x+p,\\ ay+q)=(2+3,\\ -2(4)+5)=(5,\\ -3)')}. Check: ${T('-2(5-3)^2+5=-3')} ✓`,
        run: async (c) => { S.track = true; upd(); await pop(c, tp0); await pop(c, tp1); await pulse(c, info.querySelector('.u5l2-pmap'), 1.06); } },
      { cap: `<b>Your turn:</b> drag the sliders. Try ${T('a=\\frac12')} (wider), or ${T('p=-4')} (the bracket then shows ${T('x+4')}).`,
        run: async (c) => { await Promise.all([sA.sl, sP.sl, sQ.sl].map((s) => pulse(c, s, 1.04))); } }
    ];
  }
};

/* =============================== explainer: Mila or Jonah? (Example 7) =============================== */
const race = {
  title: 'Mila or Jonah?',
  height: 446, minW: 900, capH: 92,
  ask: `<b>Example 7:</b> graph ${T('y=2(x+4)^2-3')} from ${T('y=x^2')}. Follow ${T('(0,\\ 0)')} and ${T('(1,\\ 1)')} through each order.`,
  make(stage, v, ex) {
    const W = ex.W, LW = (W - 24) / 2;
    const lane = (i, name, how) => {
      const x0 = i * (LW + 24);
      div(stage, 'u5l2-lh', `<b>${name}</b> ${how}`, x0, 0, LW);
      const G = new Graph(stage, { x: x0, y: 40, width: LW, height: 300, xmin: -6, xmax: 2, ymin: -7, ymax: 3, fontSize: 13 });
      G.fn('x^2', { color: BASEC, width: 2.5, dash: '7 6' });
      const p0 = G.point(0, 0, { color: 'red', r: 7, label: '', pos: 'ne' }), p1 = G.point(1, 1, { color: 'blue', r: 7, label: '', pos: 'ne' });
      [p0, p1].forEach((p) => { p.label.innerHTML = T(pair(p.gx, p.gy)); p.label.style.color = p.color; });
      const rows = div(stage, 'u5l2-lrows', '', x0, 350, LW);
      const r0 = h('div', 'u5l2-lr', T('(0,\\ 0)')), r1 = h('div', 'u5l2-lr', T('(1,\\ 1)')); rows.append(r0, r1);
      return { G, p0, p1, r0, r1, x0 };
    };
    const M = lane(0, 'Mila:', `stretch by ${T('2')}, then ${T('4')} left and ${T('3')} down`);
    const J = lane(1, 'Jonah:', `${T('4')} left and ${T('3')} down, then stretch by ${T('2')}`);
    const color = { stretch: STR, move: MOVE };
    const step = async (c, L, kind, t0, t1) => {
      const { G } = L, arr = [];
      [[L.p0, t0], [L.p1, t1]].forEach(([p, t]) => { if (Math.hypot(p.gx - t[0], p.gy - t[1]) > 1e-9) arr.push(arrowSeg(G, p.gx, p.gy, t[0], t[1], color[kind], 3)); });
      await Promise.all(arr.map((a) => G.drawIn(a, 550, c)));
      await Promise.all([G.move(c, L.p0, t0[0], t0[1], 700), G.move(c, L.p1, t1[0], t1[1], 700)]);
      L.p0.label.innerHTML = T(pair(...t0)); L.p1.label.innerHTML = T(pair(...t1));
      const a0 = h('span', 'u5l2-lra', T('\\to' + pair(...t0))), a1 = h('span', 'u5l2-lra', T('\\to' + pair(...t1)));
      L.r0.appendChild(a0); L.r1.appendChild(a1); await Promise.all([show(c, a0), show(c, a1)]);
    };
    const f = (x) => 2 * (x + 4) ** 2 - 3;
    const at = (L, x, y) => { const [px, py] = L.G.toPx(x, y); return { x: L.x0 + px, y: 40 + py }; };
    const stM = stamp(stage, 'Correct ✓', Object.assign({ ok: true }, at(M, 0.2, -5.3))), stJ = stamp(stage, 'Not on it ✗', Object.assign({ ok: false }, at(J, 0.2, -5.3)));
    stM.style.opacity = 0; stJ.style.opacity = 0;
    return [
      { cap: `<b>Mila</b> stretches first: every ${T('y')} doubles. ${T('(0,\\ 0)')} stays, ${T('(1,\\ 1)\\to(1,\\ 2)')}.`,
        run: (c) => step(c, M, 'stretch', [0, 0], [1, 2]) },
      { cap: `Then <b>Mila</b> moves ${T('4')} left and ${T('3')} down: ${T('(0,\\ 0)\\to(-4,\\ -3)')} and ${T('(1,\\ 2)\\to(-3,\\ -1)')}.`,
        run: (c) => step(c, M, 'move', [-4, -3], [-3, -1]) },
      { cap: `<b>Jonah</b> translates first: ${T('(0,\\ 0)\\to(-4,\\ -3)')} and ${T('(1,\\ 1)\\to(-3,\\ -2)')}.`,
        run: (c) => step(c, J, 'move', [-4, -3], [-3, -2]) },
      { cap: `Then <b>Jonah</b> stretches about the ${T('x')}-axis: every ${T('y')} doubles, the ${T('-3')} too! ${T('(-4,\\ -3)\\to(-4,\\ -6)')} and ${T('(-3,\\ -2)\\to(-3,\\ -4)')}.`,
        run: (c) => step(c, J, 'stretch', [-4, -6], [-3, -4]) },
      { cap: `The real graph ${T('y=2(x+4)^2-3')} has vertex ${T('(-4,\\ -3)')} and passes through ${T('(-3,\\ -1)')}: <b>Mila</b> is correct. Stretch and reflect <b>first</b>, then translate.`,
        run: async (c) => {
          const cs = [M, J].map((L) => L.G.fn(f, { color: CURVE, width: 4 }));
          await Promise.all(cs.map((cv, i) => [M, J][i].G.drawIn(cv, 800, c)));
          stM.style.opacity = ''; await stampIn(c, stM); stJ.style.opacity = ''; await stampIn(c, stJ);
        } }
    ];
  }
};

/* =============================== explainer: sketch with the step pattern (procedure, numbered) =============================== */
const SK = {
  a: { a: 2, p: 3, q: -5, eq: 'y=2(x-3)^2-5', win: { xmin: -2, xmax: 8, ymin: -6, ymax: 6 }, from: 0.85, to: 5.15 },
  b: { a: -0.5, p: -2, q: 4, eq: 'y=-\\frac{1}{2}(x+2)^2+4', win: { xmin: -7, xmax: 3, ymin: -5, ymax: 6 }, from: -6.2, to: 2.2 }
};
const sketch = {
  title: 'Sketch from the vertex',
  height: 440, minW: 900, capH: 92,
  choices: [{ sep: 'Example 8:' }, { v: 'a', label: `(a) ${T('y=2(x-3)^2-5')}` }, { v: 'b', label: `(b) ${T('y=-\\frac{1}{2}(x+2)^2+4')}` }],
  ask: (v) => `<b>Example 8(${v}):</b> sketch ${T(SK[v].eq)} by hand. State the vertex, the axis of symmetry, and the maximum or minimum value.`,
  make(stage, v, ex) {
    const W = ex.W, GW = 440, s = SK[v], { a, p, q } = s;
    const G = new Graph(stage, Object.assign({ x: 0, y: 4, width: GW, height: 432, ylabels: 2, fontSize: 14, pad: [30, 18, 18, 18] }, s.win));
    const rows = div(stage, 'u5l2-rows', '', GW + 24, 6, W - GW - 24);
    const f = (x) => a * (x - p) ** 2 + q;
    const vx = hide(G.point(p, q, { color: 'red', r: 8, label: T(pair(p, q)), pos: a > 0 ? 's' : 'n', labelColor: COLORS.red }));
    const P = (x, pos) => hide(G.point(x, f(x), { color: 'blue', r: 6.5, label: T(pair(x, f(x))), pos }));
    const seg = (A, B, o) => hide(G.segment(A, B, o));
    const lab = (x, y, t, pos) => { const l = G.label(x, y, T(t), { pos, cls: 'u5l2-slab', gap: 6 }); l.style.opacity = 0; return l; };
    const drawAll = async (c, els) => { for (const e of els) { if (e.tagName === 'DIV') await show(c, e); else { unhide(e); await G.drawIn(e, 350, c); } } };
    const cv = hide(G.fn(f, { color: CURVE, width: 4, from: s.from, to: s.to }));
    const axis = hide(G.vline(p, { color: COLORS.red, width: 2.5 }));
    let r;
    if (v === 'a') {
      const H = { color: BASEC, width: 2.5, dash: '5 5' }, V = { color: STEP, width: 5 };
      const s1 = [seg([3, -5], [4, -5], H), seg([4, -5], [4, -3], V), lab(4, -4, '2', 'e'), seg([3, -5], [2, -5], H), seg([2, -5], [2, -3], V), lab(2, -4, '2', 'w')];
      const s2 = [seg([4, -3], [5, -3], H), seg([5, -3], [5, 3], V), lab(5, 1.2, '6', 'e'), seg([2, -3], [1, -3], H), seg([1, -3], [1, 3], V), lab(1, 1.2, '6', 'w')];
      const p1 = [P(4, 'se'), P(2, 'sw')], p2 = [P(5, 'e'), P(1, 'w')];
      r = [
        [`Plot the vertex ${T('(p,\\ q)=(3,\\ -5)')}.`, `The vertex is ${T('(p,\\ q)=(3,\\ -5)')}: the opposite of the ${T('-3')} in the bracket, and the ${T('-5')} at the end. Plot it first.`, async (c) => popP(c, vx)],
        [`${T('1')} across, ${T('a\\times1=2')} up: ${T('(2,\\ -3)')}, ${T('(4,\\ -3)')}`, `${T('a=2')}: go ${T('1')} across each way and ${T('a\\times1=2')} up, to ${T('(4,\\ -3)')} and ${T('(2,\\ -3)')}.`, async (c) => { await drawAll(c, s1); await Promise.all(p1.map((e) => popP(c, e))); }],
        [`${T('1')} more, ${T('a\\times3=6')} up: ${T('(1,\\ 3)')}, ${T('(5,\\ 3)')}`, `${T('1')} more across and ${T('a\\times3=6')} up, to ${T('(5,\\ 3)')} and ${T('(1,\\ 3)')}.`, async (c) => { await drawAll(c, s2); await Promise.all(p2.map((e) => popP(c, e))); }],
        [`Join: axis ${T('x=3')}; opens up; minimum value ${T('-5')}`, `Join the points with a smooth U. Axis of symmetry ${T('x=3')}; ${T('a>0')}, so it opens up and the minimum value is ${T('-5')}.`, async (c) => { unhide(cv); await G.drawIn(cv, 900, c); unhide(axis); await G.drawIn(axis, 500, c); }]
      ];
    } else {
      const H = { color: BASEC, width: 2.5, dash: '5 5' }, V = { color: STEP, width: 5 };
      const s1 = [seg([-2, 4], [0, 4], H), seg([0, 4], [0, 2], V), lab(0, 3, '2', 'e'), seg([-2, 4], [-4, 4], H), seg([-4, 4], [-4, 2], V), lab(-4, 3, '2', 'w')];
      const s2 = [seg([0, 4], [2, 4], H), seg([2, 4], [2, -4], V), lab(2, -2, '8', 'e'), seg([-4, 4], [-6, 4], H), seg([-6, 4], [-6, -4], V), lab(-6, -2, '8', 'w')];
      const p1 = [P(0, 'ne'), P(-4, 'nw')], p2 = [P(2, 'w'), P(-6, 'e')];
      r = [
        [`Plot the vertex ${T('(p,\\ q)=(-2,\\ 4)')}; ${T('a<0')}: down`, `The vertex is ${T('(p,\\ q)=(-2,\\ 4)')}. ${T('a=-\\frac12')} is negative, so every step goes <b>down</b>.`, async (c) => popP(c, vx)],
        [`${T('2')} across, ${T('a\\times4=-2')}: ${T('(0,\\ 2)')}, ${T('(-4,\\ 2)')}`, `${T('a')} is a fraction: go ${T('2')} across each way and ${T('a\\times4=-\\frac12\\times4=-2')}, down ${T('2')}, to ${T('(0,\\ 2)')} and ${T('(-4,\\ 2)')}.`, async (c) => { await drawAll(c, s1); await Promise.all(p1.map((e) => popP(c, e))); }],
        [`${T('4')} across, ${T('a\\times16=-8')}: ${T('(2,\\ -4)')}, ${T('(-6,\\ -4)')}`, `${T('4')} across from the vertex: ${T('a\\times16=-8')}, down ${T('8')} from the vertex, to ${T('(2,\\ -4)')} and ${T('(-6,\\ -4)')}.`, async (c) => { await drawAll(c, s2); await Promise.all(p2.map((e) => popP(c, e))); }],
        [`Join: axis ${T('x=-2')}; opens down; maximum value ${T('4')}`, `Join with a smooth curve that opens down. Axis of symmetry ${T('x=-2')}; the maximum value is ${T('4')}.`, async (c) => { unhide(cv); await G.drawIn(cv, 900, c); unhide(axis); await G.drawIn(axis, 500, c); }]
      ];
    }
    const head = h('div', 'u5l2-rhead', T(s.eq)); rows.appendChild(head);
    const els = r.map(([html], i) => row(rows, i + 1, html));
    return r.map(([, cap, fn], i) => ({ cap, run: async (c) => { els[i].style.opacity = ''; await fadeIn(c, els[i], 300); await fn(c); } }));
  }
};

/* =============================== Stand Up Break =============================== */
const sgn = (v) => (v < 0 ? '-' : '+');
const unit = (n, w) => `${n}\\text{ ${n === 1 ? 'unit' : 'units'} ${w}}`;
standup('u5l2', {
  intro: 'At your whiteboard: stretch and reflect first, then translate. The vertex is (p, q).',
  levels: {
    BEG: (r) => {
      const p = r.pick([-7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7]), q = r.pick([-9, -8, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 7, 8]);
      let shown = eqTex(1, p, q), extra = [];
      if (r.chance(0.35)) { const k = r.pick([-6, -4, -3, -2, 2, 3, 5]), m = q + k; shown = `y${k > 0 ? '-' + k : '+' + -k}=${eqTex(1, p, m).slice(2)}`; extra = [`y=${eqTex(1, p, q).slice(2)}`]; }
      return { text: `Describe how the graph is related to the graph of <span class="tex">y=x^2</span>, and state its vertex and axis of symmetry.`, q: shown,
        a: [...extra, `${unit(Math.abs(p), p > 0 ? 'right' : 'left')}\\text{ and }${unit(Math.abs(q), q > 0 ? 'up' : 'down')}`, `\\text{vertex }${pair(p, q)},\\ \\text{axis }x=${p}`] };
    },
    PRG: (r) => {
      const A = r.pick([2, 3, 4, 5, 0.5, 0.25, 1 / 3]), neg = r.chance(0.5), a = neg ? -A : A;
      const p = r.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]), q = r.pick([-8, -6, -5, -3, -2, -1, 1, 2, 4, 5, 7, 9]);
      const words = `a vertical stretch by a factor of <span class="tex">${fa(A)}</span> about the <span class="tex">x</span>-axis${neg ? ', a reflection in the <span class="tex">x</span>-axis' : ''}, and a translation of <span class="tex">${Math.abs(p)}</span> ${Math.abs(p) === 1 ? 'unit' : 'units'} ${p > 0 ? 'right' : 'left'} and <span class="tex">${Math.abs(q)}</span> ${Math.abs(q) === 1 ? 'unit' : 'units'} ${q > 0 ? 'up' : 'down'}`;
      return { text: `Write the equation of the image of <span class="tex">y=x^2</span> after ${words}. State the vertex and whether it is a maximum or a minimum.`, q: '',
        a: [`a=${fa(a)},\\ p=${p},\\ q=${q}`, eqTex(a, p, q), `\\text{vertex }${pair(p, q)}\\text{, a ${neg ? 'maximum' : 'minimum'}}`] };
    },
    MAS: (r) => {
      const a = r.pick([-3, -2, -1, 2, 3, 4]), p = r.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]), q = r.pick([-7, -5, -4, -2, -1, 1, 3, 4, 6, 8]);
      const x = r.pick([-3, -2, -1, 1, 2, 3]), y = x * x, X = x + p, Y = a * y + q;
      return { text: `The point <span class="tex">${pair(x, y)}</span> is on <span class="tex">y=x^2</span>. Find its image on the graph below, and check it.`, q: eqTex(a, p, q),
        a: [`(x,\\ y)\\to(x+p,\\ ay+q)`, `${pair(x, y)}\\to(${x}${sgn(p)}${Math.abs(p)},\\ ${a}(${y})${sgn(q)}${Math.abs(q)})=${pair(X, Y)}`, `\\text{Check: }${a}(${X}${p > 0 ? '-' + p : '+' + -p})^2${sgn(q)}${Math.abs(q)}=${Y}\\ \\checkmark`] };
    }
  }
});

/* =============================== mount =============================== */
export const explainers = mountExplainers({ steps, slide, stretch, play, race, sketch });
export const _test = { fa, eqTex, describe };
