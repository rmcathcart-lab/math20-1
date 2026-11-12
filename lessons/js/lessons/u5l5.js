/* Math 20-1 · Unit 5 · Lesson 5 — Writing a Quadratic Equation from Its Vertex and a Point.
 * New lesson format (2026-11-11): the warm-up ("The Rope Around the Earth") is plain markup on the page (no code).
 * Explainers:
 *   pin    (the procedure, numbered 1–4: the vertex goes in, a fan of parabolas with that vertex shows the vertex alone
 *           doesn't fix the shape, the point appears, and one parabola swings through it as a is found; general form
 *           after; Examples 1(a), 1(b), 2(a), 2(b)),
 *   read   (Example 3: a reader slides along the curve and ticks the lattice points; vertex and point → a, a check
 *           with a far lattice point, then the y-intercept, the x-intercepts ±2√3 from the axis, axis, domain, range),
 *   mirror (Example 4: (a) the two equations stacked and subtracted, the q's cancel; (b) the graph folds along the
 *           axis x = 3 and the intercept −2 lands on 8; (c) the y-intercept mirrors to (8, 20), then a = 2),
 *   zeros  (the factored-form procedure, numbered 1–4: two zeros pinned, a fan of parabolas through both, the point
 *           fixes a, the axis midway gives the vertex; (c) the two zeros merge into a touching vertex; Example 5),
 *   arch   (STAR, hands-on: Example 6. A stone arch with axes that slide along the base: origin at the left end, then
 *           under the top; the equation and labels change live, the arch and a = −1/8 never do; a slider lets the
 *           class put the origin anywhere; the 3-m-in pole is 7.875 m in both systems),
 *   toss   (Example 7: the ball flies and traces its path; a from the vertex and the release point; landing: two
 *           roots, the dashed path behind the thrower stamped "reject").
 * Colours (as in the unit): the curve blue, the vertex red, the given point purple, zeros amber, the y-intercept green,
 * the axis of symmetry dashed slate, domain and range burgundy. */
import {
  h, tex, add, box, Graph, stamp, stampIn, mountExplainers, pop, fadeIn, sleep, tween, svgEl, pulse, place,
  linear, COLORS, arrowHead
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const CURVE = COLORS.blue, VX = COLORS.red, PT = COLORS.purple, ZR = COLORS.amber, DR = COLORS.brand, AXC = '#3a4254', FAN = '#8aa4d6';
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; if (el && el.label) el.label.style.opacity = 0; return el; };
const unhide = (el) => { if (el) el.style.opacity = ''; if (el && el.label) el.label.style.opacity = ''; return el; };
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
const absSvg = (stage, w, hh, x = 0, y = 0, cls = '') => { const s = svgEl('svg', { width: w, height: hh, viewBox: `0 0 ${w} ${hh}`, class: cls }, stage); s.style.position = 'absolute'; s.style.left = x + 'px'; s.style.top = y + 'px'; return s; };
const popP = (c, p) => Promise.all([pop(c, unhide(p)), p.label ? show(c, p.label) : null]);
const drawOn = (c, G, el, ms = 700) => { unhide(el); return G.drawIn(el, ms, c); };
const pr = (x, y) => T(`(${x},\\ ${y})`);
/* a numbered row for step-by-step procedures (the step number beside each step as it appears) */
const row = (host, n, html, cls = '') => { const r = h('div', 'u5l5-row' + (cls ? ' ' + cls : ''), `<span class="u5l5-n">${n}</span><div class="u5l5-rc">${html}</div>`); r.style.opacity = 0; host.appendChild(r); return r; };
const panel = (stage, x, w) => div(stage, 'u5l5-pn', '', x, 0, w);
/* a fan of faint parabolas (one per value of a) that all share the fixed points; none of them is the answer */
const PAD = [30, 18, 18, 18];
const FANK = [-2.2, -0.9, -0.4, 0.4, 0.7, 2.2];
async function fanIn(c, G, els) {
  await Promise.all(els.map(async (e, i) => { await sleep(c, i * 110); e.style.opacity = 0.75; await G.drawIn(e, 650, c); }));
}
const fanDim = (c, els) => tween(c, 400, (u) => els.forEach((e) => (e.style.opacity = 0.75 - 0.55 * u)));
/* the live parabola: y = S.a·shape(x) + off; sweep() swings it past the answer and settles on it */
function liveCurve(G, shape, off = 0) {
  const S = { a: 0 }, el = hide(G.fn((x) => S.a * shape(x) + off, { color: CURVE, width: 4.5 }));
  el.sweep = async (c, a) => {
    unhide(el);
    await tween(c, 950, (u) => { S.a = a * (0.1 + 1.65 * u); el._bkDraw(); });
    await tween(c, 650, (u) => { S.a = a * (1.75 - 0.75 * u); el._bkDraw(); });
  };
  el.set = (a) => { S.a = a; el._bkDraw(); unhide(el); };
  return el;
}
/* a hop arrow along the x-axis (graph coordinates), with a label above */
function hop(G, x0, x1, txt, color = PT, yl = 0) {
  const [a, y] = G.toPx(x0, yl), [b] = G.toPx(x1, yl), m = (a + b) / 2, hgt = Math.min(46, Math.abs(b - a) * 0.45);
  const g = svgEl('g', { class: 'u5l5-hop' }, G.layers.top);
  svgEl('path', { d: `M${a} ${y - 6} Q${m} ${y - 6 - hgt * 2} ${b} ${y - 6}`, fill: 'none', stroke: color, 'stroke-width': 3 }, g);
  arrowHead(g, b, y - 6, (b - m) * 0.5, hgt * 1.6, { color, width: 3 });
  const t = svgEl('text', { x: m, y: y - 12 - hgt, 'text-anchor': 'middle', class: 'u5l5-hopt', fill: color }, g); t.textContent = txt;
  g.style.opacity = 0; return g;
}

/* =============================== explainer: pin (vertex + a point → a; the procedure) =============================== */
const PIN = {
  '1a': { tag: 'Example 1(a)', p: 3, q: -5, pt: [5, 7], a: 3, win: [-1, 8, -7, 9], vp: 'se', pp: 'e',
    s1: 'y=a(x-3)^2-5', s2: '7=a(5-3)^2-5', s3: ['12=4a', 'a=3'], s4: 'y=3(x-3)^2-5', gf: ['y=3(x^2-6x+9)-5', 'y=3x^2-18x+22'] },
  '1b': { tag: 'Example 1(b)', p: -4, q: 6, pt: [-2, -2], a: -2, win: [-9, 1, -4, 9], vp: 'n', pp: 'e',
    s1: 'y=a(x+4)^2+6', s2: '-2=a(-2+4)^2+6', s3: ['-8=4a', 'a=-2'], s4: 'y=-2(x+4)^2+6', gf: ['y=-2(x^2+8x+16)+6', 'y=-2x^2-16x-26'] },
  '2a': { tag: 'Example 2(a)', p: 6, q: 1, pt: [0, 13], a: 1 / 3, win: [-2, 13, -3, 16], vp: 'n', pp: 'e', yint: 13,
    s1: 'y=a(x-6)^2+1', s2: '13=a(0-6)^2+1', s3: ['12=36a', 'a=\\frac{1}{3}'], s4: 'y=\\frac{1}{3}(x-6)^2+1' },
  '2b': { tag: 'Example 2(b)', p: -1, q: 0, pt: [3, -6], a: -3 / 8, win: [-6, 5, -8, 3], vp: 'n', pp: 'w',
    s1: 'y=a(x+1)^2+0', s2: '-6=a(3+1)^2', s3: ['-6=16a', 'a=-\\frac{3}{8}'], s4: 'y=-\\frac{3}{8}(x+1)^2' }
};
const pin = {
  title: 'One more point fixes a',
  height: 430, minW: 880,
  choices: [{ sep: 'Example 1:' }, { v: '1a', label: '(a)' }, { v: '1b', label: '(b)' }, { sep: 'Example 2:' }, { v: '2a', label: '(a)' }, { v: '2b', label: '(b)' }],
  ask: (v) => { const d = PIN[v]; return `<b>${d.tag}:</b> vertex ${pr(d.p, d.q)}, ${d.yint ? `${T('y')}-intercept ${T(String(d.yint))}` : `point ${pr(...d.pt)}`}. Write the equation in vertex form${d.gf ? ', then in general form' : ''}.`; },
  make(stage, v, ex) {
    const d = PIN[v], W = ex.W, GW = 440, PX = GW + 26;
    const [x0, x1, y0, y1] = d.win;
    const G = new Graph(stage, { x: 0, y: 0, width: GW, height: 430, xmin: x0, xmax: x1, ymin: y0, ymax: y1, ylabels: y1 - y0 > 13 ? 2 : 0, fontSize: 15, pad: PAD });
    const shape = (x) => (x - d.p) * (x - d.p);
    const fanEls = FANK.map((k) => hide(G.fn((x) => k * Math.abs(d.a) * shape(x) + d.q, { color: FAN, width: 2.2, arrows: false })));
    const live = liveCurve(G, shape, d.q);
    const pV = hide(G.point(d.p, d.q, { color: 'red', r: 7.5, label: pr(d.p, d.q), pos: d.vp }));
    const pP = hide(G.point(d.pt[0], d.pt[1], { color: 'purple', r: 7.5, label: pr(...d.pt), pos: d.pp }));
    const P = panel(stage, PX, W - PX);
    const r1 = row(P, 1, T(d.s1)), r2 = row(P, 2, T(d.s2)), r3 = row(P, 3, `${T(d.s3[0])}, so ${T(d.s3[1])}`), r4 = row(P, 4, T(d.s4), 'u5l5-final');
    const r5 = d.gf ? row(P, '→', `${T(d.gf[0])}<br>${T(d.gf[1])}`, 'u5l5-gf') : null;
    const aT = d.s3[1].replace('a=', '');
    const steps = [
      { cap: `<b>Step 1:</b> put the vertex ${pr(d.p, d.q)} into ${T('y=a(x-p)^2+q')}: ${T(d.s1)}. Every value of ${T('a')} gives a parabola with this vertex: the vertex alone doesn't fix the shape.`,
        run: async (c) => { await popP(c, pV); await show(c, r1); await fanIn(c, G, fanEls); } },
      { cap: `<b>Step 2:</b> the parabola must also pass through ${pr(...d.pt)}${d.yint ? ` (the ${T('y')}-intercept ${T(String(d.yint))} is the point ${pr(0, d.yint)})` : ''}. Substitute ${T('x=' + d.pt[0])} and ${T('y=' + d.pt[1])}: ${T(d.s2)}.`,
        run: async (c) => { await popP(c, pP); await fanDim(c, fanEls); await show(c, r2); } },
      { cap: `<b>Step 3:</b> solve: ${T(d.s3[0])}, so ${T(d.s3[1])}. Only <b>one</b> parabola in the family passes through the point.`,
        run: async (c) => { await show(c, r3); await live.sweep(c, d.a); await pulse(c, pP, 1.5); } },
      { cap: `<b>Step 4:</b> write the equation with ${T('a=' + aT)}, ${T('p=' + d.p)} and ${T('q=' + d.q)}, keeping ${T('x')} and ${T('y')} as letters: ${T(d.s4)}.`,
        run: async (c) => { await show(c, r4); await pulse(c, r4, 1.05); } }
    ];
    if (d.gf) steps.push({ cap: `<b>General form:</b> expand the square, multiply by ${T(String(d.a))} and collect like terms: ${T(d.gf[1])}. Same parabola, different form.`,
      run: async (c) => { await show(c, r5); } });
    return steps;
  }
};

/* =============================== explainer: read (Example 3 from its graph) =============================== */
const F3 = (x) => -0.5 * (x + 3) * (x + 3) + 6;
const Z3 = [-3 - 2 * Math.sqrt(3), -3 + 2 * Math.sqrt(3)];
const read = {
  title: 'Read it off the grid',
  height: 430, minW: 880,
  ask: () => `<b>Example 3:</b> the graph shows the vertex ${pr(-3, 6)} and the point ${pr(-1, 4)}. Find the equation, the intercepts, the axis, the domain and the range.`,
  make(stage, v, ex) {
    const W = ex.W, GW = 450, PX = GW + 24;
    const G = new Graph(stage, { x: 0, y: 0, width: GW, height: 430, xmin: -9, xmax: 3, ymin: -5, ymax: 8, xlabels: 2, ylabels: 2, fontSize: 15, pad: PAD });
    const ax = hide(G.line({ x: -3 }, { color: AXC, width: 2.5, dash: '7 6', arrows: false }));
    const sX = hide(G.shadeX(-Infinity, Infinity, { color: DR })), sY = hide(G.shadeY(-Infinity, 6, { color: DR }));
    G.fn(F3, { color: CURVE, width: 4 });
    // the reader and the lattice ticks
    const ring = svgEl('circle', { r: 13, class: 'u5l5-ring' }, G.layers.top); ring.style.opacity = 0;
    const marks = [];
    for (let x = -7; x <= 1; x++) {
      const y = F3(x), lat = Number.isInteger(y);
      const m = lat ? G.point(x, y, { color: 'purple', r: 6 }) : G.point(x, y, { color: 'gray', r: 5.5, open: true });
      m.lat = lat; m.gx0 = x; hide(m); marks.push(m);
    }
    const pV = hide(G.point(-3, 6, { color: 'red', r: 8, label: pr(-3, 6), pos: 'n' }));
    const pP = hide(G.point(-1, 4, { color: 'purple', r: 8, label: pr(-1, 4), pos: 'ne' }));
    const pF = marks.find((m) => m.gx0 === 1);
    const ok = hide(stamp(stage, '✓', { ok: true, x: G.toPx(1, -2)[0] + 32, y: G.toPx(1, -2)[1] + 26, size: 'sm' }));
    const pY = hide(G.point(0, 1.5, { color: 'green', r: 7.5, label: pr(0, '\\frac{3}{2}'), pos: 'e' }));
    const pZ = Z3.map((z, i) => hide(G.point(z, 0, { color: 'amber', r: 7.5, label: T(i ? '\\approx0.46' : '\\approx-6.46'), pos: i ? 'se' : 'sw' })));
    const h1 = hop(G, -3, Z3[1], '2√3 ≈ 3.46', ZR), h0 = hop(G, -3, Z3[0], '2√3', ZR);
    const P = panel(stage, PX, W - PX);
    const ra = row(P, '(a)', `${T('4=a(-1+3)^2+6')}<br>${T('-2=4a,\\ a=-\\frac{1}{2}')}<br>${T('y=-\\frac{1}{2}(x+3)^2+6')}`, 'u5l5-lt');
    const rb = row(P, '(b)', `${T('y=-\\frac{1}{2}(9)+6=\\frac{3}{2}')}`, 'u5l5-lt');
    const rc = row(P, '(c)', `${T('(x+3)^2=12')}<br>${T('x=-3\\pm2\\sqrt{3}')}<br>${T('\\approx0.46')} and ${T('\\approx-6.46')}`, 'u5l5-lt');
    const rd = row(P, '(d)', `axis ${T('x=-3')}<br>${T('\\{x\\mid x\\in\\mathbb{R}\\}')}<br>${T('\\{y\\mid y\\le6,\\ y\\in\\mathbb{R}\\}')}`, 'u5l5-lt');
    const slide = (c) => {
      const done = new Set();
      return tween(c, 2600, (u) => {
        const x = -7.4 + 8.8 * u, [px, py] = G.toPx(x, F3(x));
        ring.setAttribute('cx', px); ring.setAttribute('cy', py); ring.style.opacity = u < 0.99 ? 1 : 0;
        marks.forEach((m) => { if (!done.has(m) && x >= m.gx0 - 1e-9) { done.add(m); unhide(m); if (c && !c.fast) pop(c, m); } });
      }, linear);
    };
    return [
      { cap: `Slide along the curve and watch each vertical grid line. Only at some of them does the curve cross <b>exactly</b> at a grid point: a <b>lattice point</b> (filled). Those are the points you can read for sure.`,
        run: (c) => slide(c) },
      { cap: `(a) Use the vertex ${pr(-3, 6)} and the marked lattice point ${pr(-1, 4)}: ${T('4=a(-1+3)^2+6')}, ${T('-2=4a')}, so ${T('a=-\\frac{1}{2}')}: ${T('y=-\\frac{1}{2}(x+3)^2+6')}.`,
        run: async (c) => { await popP(c, pV); await popP(c, pP); await show(c, ra); } },
      { cap: `Check with a lattice point far from the vertex, ${pr(1, -2)}: ${T('-\\frac{1}{2}(1+3)^2+6=-8+6=-2')} ✓. A far point is the safest to read: a small reading error matters less.`,
        run: async (c) => { await pulse(c, pF, 1.8); await stampIn(c, unhide(ok)); } },
      { cap: `(b) The ${T('y')}-intercept: set ${T('x=0')}. ${T('y=-\\frac{1}{2}(9)+6=\\frac{3}{2}')}, or ${T('1.5')}. It is not a lattice point, so we calculate it instead of reading it.`,
        run: async (c) => { await popP(c, pY); await show(c, rb); } },
      { cap: `(c) The ${T('x')}-intercepts: set ${T('y=0')}. ${T('(x+3)^2=12')}, so ${T('x+3=\\pm2\\sqrt{3}')}: ${T('x=-3+2\\sqrt{3}\\approx0.46')} and ${T('x=-3-2\\sqrt{3}\\approx-6.46')}, the same distance each side of the axis.`,
        run: async (c) => { await drawOn(c, G, ax, 500); await Promise.all([show(c, h1), show(c, h0)]); await Promise.all(pZ.map((p) => popP(c, p))); await show(c, rc); } },
      { cap: `(d) The axis of symmetry is ${T('x=-3')}. Domain ${T('\\{x\\mid x\\in\\mathbb{R}\\}')}; range ${T('\\{y\\mid y\\le6,\\ y\\in\\mathbb{R}\\}')}: it opens down, so ${T('6')} is the maximum.`,
        run: async (c) => { await pulse(c, ax, 1.02); await drawOn(c, G, sX, 600); await drawOn(c, G, sY, 600); await show(c, rd); } }
    ];
  }
};

/* =============================== explainer: mirror (Example 4) =============================== */
const mirror = {
  title: 'Using the axis of symmetry',
  height: 430, minW: 880,
  choices: [{ sep: 'Example 4:' }, { v: 'a', label: '(a) two points' }, { v: 'b', label: '(b) the other intercept' }, { v: 'c', label: '(c) vertex and y-intercept' }],
  ask: (v) => ({
    a: `<b>Example 4(a):</b> ${T('y=a(x+1)^2+q')} passes through ${pr(1, -2)} and ${pr(3, 10)}. Find ${T('a')} and ${T('q')}, and the minimum or maximum value.`,
    b: `<b>Example 4(b):</b> the axis of symmetry is ${T('x=3')} and one ${T('x')}-intercept is ${T('-2')}. Find the other ${T('x')}-intercept.`,
    c: `<b>Example 4(c):</b> minimum value ${T('-12')}, axis of symmetry ${T('x=4')}, ${T('y')}-intercept ${T('20')}. Find the equation in vertex form.`
  })[v],
  make(stage, v, ex) {
    const W = ex.W, GW = 440, PX = GW + 26, P = panel(stage, PX, W - PX);
    if (v === 'a') {
      const G = new Graph(stage, { x: 0, y: 0, width: GW, height: 430, xmin: -5, xmax: 5, ymin: -8, ymax: 12, ystep: 1, ylabels: 2, fontSize: 15, pad: PAD });
      const ax = hide(G.line({ x: -1 }, { color: AXC, width: 2.5, dash: '7 6', arrows: false }));
      const live = hide(G.fn((x) => (x + 1) * (x + 1) - 6, { color: CURVE, width: 4.5 }));
      const p1 = hide(G.point(1, -2, { color: 'purple', r: 7.5, label: pr(1, -2), pos: 'e' })), p2 = hide(G.point(3, 10, { color: 'purple', r: 7.5, label: pr(3, 10), pos: 'w' }));
      const pV = hide(G.point(-1, -6, { color: 'red', r: 7.5, label: `min ${T('-6')}`, pos: 's' }));
      // the two equations stacked, ready to subtract
      const tb = div(P, 'u5l5-sub', `
        <div class="u5l5-sr u5l5-s2"><span>${T('(3,\\ 10)')}</span><b>${T('10')}</b><i>${T('=')}</i><b>${T('16a')}</b><i>${T('+')}</i><b class="u5l5-q">${T('q')}</b></div>
        <div class="u5l5-sr u5l5-s1"><span class="u5l5-minus">${T('-')}</span><b>${T('-2')}</b><i>${T('=')}</i><b>${T('4a')}</b><i>${T('+')}</i><b class="u5l5-q">${T('q')}</b></div>
        <div class="u5l5-sbar"></div>
        <div class="u5l5-sr u5l5-s3"><span></span><b>${T('12')}</b><i>${T('=')}</i><b>${T('12a')}</b><i></i><b></b></div>`);
      const [sA, sB, , sC] = [...tb.children], minus = tb.querySelector('.u5l5-minus'), bar = tb.querySelector('.u5l5-sbar'), qs = [...tb.querySelectorAll('.u5l5-q')];
      [sA, sB, sC, bar].forEach(hide); minus.style.opacity = 0;
      const ra = row(P, '→', `${T('a=1')}, &nbsp;${T('q=-2-4(1)=-6')}<br>${T('y=(x+1)^2-6')}`, 'u5l5-final');
      return [
        { cap: `${T('y=a(x+1)^2+q')}: ${T('p=-1')} is known (the axis is ${T('x=-1')}), but ${T('a')} and ${T('q')} are not. Substitute each point: <b>two equations</b>, ${T('-2=4a+q')} and ${T('10=16a+q')}.`,
          run: async (c) => { await drawOn(c, G, ax, 500); await popP(c, p1); await popP(c, p2); await show(c, sA); await show(c, sB); } },
        { cap: `<b>Subtract</b> the equations: ${T('q-q=0')}, so ${T('q')} disappears, leaving ${T('12=12a')}: ${T('a=1')}.`,
          run: async (c) => { await show(c, minus); await show(c, bar); qs.forEach((q) => q.classList.add('u5l5-gone')); await sleep(c, 500); await show(c, sC); } },
        { cap: `Then ${T('q=-2-4(1)=-6')}: ${T('y=(x+1)^2-6')}. ${T('a>0')}, so it opens up: a <b>minimum value of ${T('-6')}</b>, at ${T('x=-1')}.`,
          run: async (c) => { await show(c, ra); await drawOn(c, G, live, 900); await popP(c, pV); } }
      ];
    }
    if (v === 'b') {
      const G = new Graph(stage, { x: 0, y: 0, width: GW, height: 430, xmin: -4, xmax: 10, ymin: -5, ymax: 8, fontSize: 15, xlabels: 2, pad: PAD });
      const f = (x) => -0.2 * (x + 2) * (x - 8);
      const ax = hide(G.line({ x: 3 }, { color: AXC, width: 2.5, dash: '7 6', arrows: false }));
      const axl = hide(G.label(3, 7.4, T('x=3'), { pos: 'e', cls: 'bk-ptlab' }));
      const right = hide(G.fn(f, { from: 3, color: CURVE, width: 4, dash: '2 7' }));
      const left = hide(G.fn(f, { to: 3, color: CURVE, width: 4 }));
      const tw = [hide(G.point(0, f(0), { color: 'purple', r: 6.5 })), hide(G.point(6, f(6), { color: 'purple', r: 6.5 }))];
      const zL = hide(G.point(-2, 0, { color: 'amber', r: 8, label: T('-2'), pos: 'sw' })), zR = hide(G.point(8, 0, { color: 'amber', r: 8, label: T('8'), pos: 'se' }));
      const hL = hop(G, -2, 3, '5'), hR = hop(G, 3, 8, '5');
      // the fold: a copy of the left half (with its intercept) flips across the axis
      const fold = svgEl('g', { class: 'u5l5-fold' }, G.layers.top); fold.style.transformBox = 'view-box'; fold.style.transformOrigin = '0 0';
      let dd = ''; for (let i = 0; i <= 60; i++) { const x = -2.8 + 5.8 * i / 60, y = f(x); if (y >= -5) { const [px, py] = G.toPx(x, y); dd += (dd ? 'L' : 'M') + px.toFixed(1) + ' ' + py.toFixed(1); } }
      svgEl('path', { d: dd, fill: 'none', stroke: CURVE, 'stroke-width': 4.5, opacity: 0.7 }, fold);
      const [zx, zy] = G.toPx(-2, 0); svgEl('circle', { cx: zx, cy: zy, r: 8, fill: ZR, stroke: '#fff', 'stroke-width': 2 }, fold);
      const axPx = G.toPx(3, 0)[0], setFold = (s) => fold.setAttribute('transform', `translate(${axPx} 0) scale(${s} 1) translate(${-axPx} 0)`);
      fold.style.opacity = 0; setFold(1);
      const r1 = row(P, '→', `${T('-2')} is ${T('5')} left of ${T('x=3')}`), r2 = row(P, '→', `${T('3+5=8')}<br>or ${T('2p-r=2(3)-(-2)=8')}`, 'u5l5-final');
      const twin = (c) => tween(c, 1800, (u) => { const d = 4.6 * Math.sin(Math.PI * u) + 0.4; G.moveTo(tw[0], 3 - d, f(3 - d)); G.moveTo(tw[1], 3 + d, f(3 + d)); });
      return [
        { cap: `The axis ${T('x=3')} is a <b>mirror</b>: fold the graph along it and the two sides match. Points at the same height are the same distance from the axis.`,
          run: async (c) => { await drawOn(c, G, ax, 500); await show(c, axl); await drawOn(c, G, left, 700); unhide(right); tw.forEach(unhide); await twin(c); } },
        { cap: `The ${T('x')}-intercept ${T('-2')} is <b>5 units left</b> of the axis.`,
          run: async (c) => { tw.forEach(hide); await popP(c, zL); await show(c, hL); await show(c, r1); } },
        { cap: `Fold it across the mirror: it lands <b>5 units right</b> of the axis, at ${T('x=3+5=8')}. (Or ${T('2p-r=2(3)-(-2)=8')}.)`,
          run: async (c) => { fold.style.opacity = 1; await tween(c, 1300, (u) => setFold(1 - 2 * u)); fold.style.opacity = 0; await popP(c, zR); await show(c, hR); await show(c, r2); } }
      ];
    }
    // (c)
    const G = new Graph(stage, { x: 0, y: 0, width: GW, height: 430, xmin: -2, xmax: 10, ymin: -14, ymax: 24, ystep: 2, ylabels: 4, fontSize: 15, pad: PAD });
    const ax = hide(G.line({ x: 4 }, { color: AXC, width: 2.5, dash: '7 6', arrows: false }));
    const live = liveCurve(G, (x) => (x - 4) * (x - 4), -12);
    const pV = hide(G.point(4, -12, { color: 'red', r: 7.5, label: pr(4, -12), pos: 's' }));
    const pY = hide(G.point(0, 20, { color: 'green', r: 7.5, label: pr(0, 20), pos: 'e' }));
    const pM = hide(G.point(8, 20, { color: 'green', r: 7.5, open: true, label: pr(8, 20), pos: 'w' }));
    const hL = hop(G, 0, 4, '4 units', COLORS.green, 20), hR = hop(G, 4, 8, '4 units', COLORS.green, 20);
    const r1 = row(P, 1, `vertex ${pr(4, -12)}, point ${pr(0, 20)}`), r2 = row(P, 2, T('20=a(0-4)^2-12')), r3 = row(P, 3, `${T('32=16a')}, so ${T('a=2')}`), r4 = row(P, 4, T('y=2(x-4)^2-12'), 'u5l5-final');
    return [
      { cap: `A minimum value of ${T('-12')} on the axis ${T('x=4')}: the vertex is ${pr(4, -12)}. The ${T('y')}-intercept ${T('20')} is the point ${pr(0, 20)}.`,
        run: async (c) => { await drawOn(c, G, ax, 500); await popP(c, pV); await popP(c, pY); await show(c, r1); } },
      { cap: `Mirror: ${pr(0, 20)} is 4 units left of the axis, so ${pr(8, 20)} is on the graph too. Handy for the sketch, and for a check at the end.`,
        run: async (c) => { await show(c, hL); await show(c, hR); await popP(c, pM); } },
      { cap: `Substitute ${pr(0, 20)}: ${T('20=a(0-4)^2-12')}, ${T('32=16a')}, so ${T('a=2')}: ${T('y=2(x-4)^2-12')}. It passes through ${pr(8, 20)} too ✓.`,
        run: async (c) => { await show(c, r2); await show(c, r3); await live.sweep(c, 2); await show(c, r4); await pulse(c, pM, 1.5); } }
    ];
  }
};

/* =============================== explainer: zeros (factored form; the procedure) =============================== */
const ZD = {
  a: { r: -1, s: 5, pt: [3, 12], a: -1.5, win: [-3, 7, -4, 16], ys: 2, pp: 'e',
    s1: 'y=a(x+1)(x-5)', s2: '12=a(3+1)(3-5)=-8a', s3: ['a=-\\frac{3}{2}', 'y=-\\frac{3}{2}(x+1)(x-5)'],
    s4: ['x=\\frac{-1+5}{2}=2', 'y=-\\frac{3}{2}(3)(-3)=\\frac{27}{2}'], V: [2, 13.5], vl: '\\left(2,\\ \\frac{27}{2}\\right)' },
  b: { r: 2, s: 6, pt: [0, -9], a: -0.75, win: [-2, 8, -10, 5], ys: 1, pp: 'e', yint: true,
    s1: 'y=a(x-2)(x-6)', s2: '-9=a(-2)(-6)=12a', s3: ['a=-\\frac{3}{4}', 'y=-\\frac{3}{4}(x-2)(x-6)'],
    s4: ['x=\\frac{2+6}{2}=4', 'y=-\\frac{3}{4}(2)(-2)=3'], V: [4, 3], vl: '(4,\\ 3)', also: 'y=-\\frac{3}{4}(x-4)^2+3' }
};
const zeros = {
  title: 'Two zeros and a point',
  height: 430, minW: 880,
  choices: [{ sep: 'Example 5:' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }, { v: 'c', label: '(c) touches the axis' }],
  ask: (v) => ({
    a: `<b>Example 5(a):</b> zeros ${T('-1')} and ${T('5')}, passing through ${pr(3, 12)}. Write the equation in factored form, then find the vertex.`,
    b: `<b>Example 5(b):</b> ${T('x')}-intercepts ${T('2')} and ${T('6')}, ${T('y')}-intercept ${T('-9')}. Write the equation in factored form, then find the vertex.`,
    c: `<b>Example 5(c):</b> the graph touches the ${T('x')}-axis only at ${T('x=-3')} and passes through ${pr(-1, 8)}.`
  })[v],
  make(stage, v, ex) {
    const W = ex.W, GW = 440, PX = GW + 26, P = panel(stage, PX, W - PX);
    if (v === 'c') {
      const G = new Graph(stage, { x: 0, y: 0, width: GW, height: 430, xmin: -7, xmax: 1, ymin: -2, ymax: 10, fontSize: 15, pad: PAD });
      const live = liveCurve(G, (x) => (x + 3) * (x + 3));
      const z1 = hide(G.point(-5, 0, { color: 'amber', r: 8 })), z2 = hide(G.point(-1, 0, { color: 'amber', r: 8 }));
      const pV = hide(G.point(-3, 0, { color: 'red', r: 8, label: pr(-3, 0), pos: 's' }));
      const pP = hide(G.point(-1, 8, { color: 'purple', r: 7.5, label: pr(-1, 8), pos: 'e' }));
      const r1 = row(P, 1, `vertex ${pr(-3, 0)}: ${T('y=a(x+3)^2')}`), r2 = row(P, 2, T('8=a(-1+3)^2=4a')), r3 = row(P, 3, `${T('a=2')}: ${T('y=2(x+3)^2')}`, 'u5l5-final');
      return [
        { cap: `The graph only <b>touches</b> the ${T('x')}-axis at ${T('x=-3')}: its two zeros are the <b>same</b> number, so the vertex is ${pr(-3, 0)} and ${T('y=a(x+3)(x+3)=a(x+3)^2')}.`,
          run: async (c) => { await Promise.all([popP(c, z1), popP(c, z2)]); await Promise.all([G.move(c, z1, -3, 0, 1000), G.move(c, z2, -3, 0, 1000)]); hide(z1); hide(z2); await popP(c, pV); await show(c, r1); } },
        { cap: `Substitute ${pr(-1, 8)}: ${T('8=a(2)^2')}, so ${T('a=2')}.`,
          run: async (c) => { await popP(c, pP); await show(c, r2); await live.sweep(c, 2); } },
        { cap: `${T('y=2(x+3)^2')}, vertex ${pr(-3, 0)}.`,
          run: async (c) => { await show(c, r3); await pulse(c, pV, 1.4); } }
      ];
    }
    const d = ZD[v], [x0, x1, y0, y1] = d.win;
    const G = new Graph(stage, { x: 0, y: 0, width: GW, height: 430, xmin: x0, xmax: x1, ymin: y0, ymax: y1, ystep: d.ys, ylabels: d.ys * 2, fontSize: 15, pad: PAD });
    const shape = (x) => (x - d.r) * (x - d.s);
    const fanEls = FANK.map((k) => hide(G.fn((x) => k * Math.abs(d.a) * shape(x), { color: FAN, width: 2.2, arrows: false })));
    const live = liveCurve(G, shape);
    const ax = hide(G.line({ x: d.V[0] }, { color: AXC, width: 2.5, dash: '7 6', arrows: false }));
    const zs = [d.r, d.s].map((z, i) => hide(G.point(z, 0, { color: 'amber', r: 8, label: T(String(z)), pos: i ? 'ne' : 'nw' })));
    const pP = hide(G.point(d.pt[0], d.pt[1], { color: d.yint ? 'green' : 'purple', r: 7.5, label: pr(...d.pt), pos: d.pp }));
    const pV = hide(G.point(d.V[0], d.V[1], { color: 'red', r: 8, label: T(d.vl), pos: 'n' }));
    const r1 = row(P, 1, T(d.s1)), r2 = row(P, 2, T(d.s2)), r3 = row(P, 3, `${T(d.s3[0])}<br>${T(d.s3[1])}`, 'u5l5-final');
    const r4 = row(P, 4, `axis ${T(d.s4[0])}<br>${T(d.s4[1])}<br>vertex ${T(d.vl)}${d.also ? `<br>${T(d.also)}` : ''}`);
    return [
      { cap: `<b>Step 1:</b> the zeros ${T(String(d.r))} and ${T(String(d.s))} go into factored form: ${T(d.s1)}. Every value of ${T('a')} gives a parabola through these two zeros.`,
        run: async (c) => { await Promise.all(zs.map((z) => popP(c, z))); await show(c, r1); await fanIn(c, G, fanEls); } },
      { cap: `<b>Step 2:</b> substitute the point ${pr(...d.pt)} (not a zero)${d.yint ? `: the ${T('y')}-intercept ${T('-9')} is the point ${pr(0, -9)}` : ''}. ${T(d.s2)}.`,
        run: async (c) => { await popP(c, pP); await fanDim(c, fanEls); await show(c, r2); } },
      { cap: `<b>Step 3:</b> solve for ${T('a')}: ${T(d.s3[0])}, so ${T(d.s3[1])}.`,
        run: async (c) => { await show(c, r3); await live.sweep(c, d.a); await pulse(c, pP, 1.5); } },
      { cap: `<b>Step 4:</b> the axis is midway between the zeros, ${T(d.s4[0])}. Substitute it: ${T(d.s4[1])}. The vertex is ${T(d.vl)}${d.also ? `, so also ${T(d.also)}` : ''}.`,
        run: async (c) => { await drawOn(c, G, ax, 500); await popP(c, pV); await show(c, r4); } }
    ];
  }
};

/* =============================== explainer: arch (STAR, hands-on: move the origin) =============================== */
const arch = {
  title: 'Move the origin: a new equation, the same arch',
  height: 440, minW: 900, tap: false, capH: 96,
  ask: () => `<b>Example 6:</b> a stone arch is a parabola ${T('24')} m wide at its base and ${T('18')} m high at its centre. Where should the axes go?`,
  make(stage, v, ex) {
    const W = ex.W, SW = 560, K = SW / 32, G0 = 372;
    const X = (u) => (u + 4) * K, Y = (vv) => G0 - vv * K, fA = (u) => -((u - 12) ** 2) / 8 + 18;
    const S = { s: 0 };
    const sc = absSvg(stage, SW, 440, 0, 0, 'u5l5-scene');
    const sky = svgEl('linearGradient', { id: 'u5l5sky', x1: 0, y1: 0, x2: 0, y2: 1 }, svgEl('defs', {}, sc));
    svgEl('stop', { offset: 0, 'stop-color': '#cfe4f7' }, sky); svgEl('stop', { offset: 1, 'stop-color': '#f4f8fc' }, sky);
    svgEl('rect', { x: 0, y: 0, width: SW, height: G0, fill: 'url(#u5l5sky)', rx: 12 }, sc);
    let d = ''; for (let i = 0; i <= 96; i++) { const u = i / 4; d += (i ? 'L' : 'M') + X(u).toFixed(1) + ' ' + Y(fA(u)).toFixed(1); }
    const stone = svgEl('path', { d, fill: 'none', stroke: '#b9a389', 'stroke-width': 20, 'stroke-linejoin': 'round' }, sc);
    const joints = svgEl('path', { d, fill: 'none', stroke: '#6b5a45', 'stroke-width': 20, 'stroke-dasharray': '2.5 24' }, sc);
    const edge = svgEl('path', { d, fill: 'none', stroke: CURVE, 'stroke-width': 3.5 }, sc);
    svgEl('rect', { x: 0, y: G0, width: SW, height: 440 - G0, fill: '#8cc084' }, sc);
    svgEl('polygon', { points: `${X(9.6)},${G0} ${X(14.4)},${G0} ${X(16.5)},440 ${X(7.5)},440`, fill: '#e3cfa3' }, sc);
    [[2.6, '🌷'], [21.4, '🌼'], [26.4, '🌷'], [-2.6, '🌼']].forEach(([u, e]) => { const t = svgEl('text', { x: X(u), y: G0 + 2, 'font-size': 24, 'text-anchor': 'middle' }, sc); t.textContent = e; });
    // dimensions
    const dims = svgEl('g', { class: 'u5l5-dims' }, sc);
    svgEl('line', { x1: X(12), y1: G0, x2: X(12), y2: Y(18), stroke: AXC, 'stroke-width': 2, 'stroke-dasharray': '6 5' }, dims);
    const t18 = svgEl('text', { x: X(12) + 8, y: Y(10.5), class: 'u5l5-dim' }, dims); t18.textContent = '18 m';
    const DY = 428; svgEl('line', { x1: X(0), y1: DY, x2: X(24), y2: DY, stroke: AXC, 'stroke-width': 2 }, dims);
    arrowHead(dims, X(0), DY, -1, 0, { color: AXC, width: 2 }); arrowHead(dims, X(24), DY, 1, 0, { color: AXC, width: 2 });
    const t24 = svgEl('text', { x: X(12), y: DY - 6, 'text-anchor': 'middle', class: 'u5l5-dim' }, dims); t24.textContent = '24 m';
    dims.style.opacity = 0; edge.style.opacity = 0;
    // the axes (they move with the origin; the arch never does)
    const axes = svgEl('g', { class: 'u5l5-axes' }, sc); axes.style.opacity = 0;
    const lab = (cls) => { const e = div(stage, 'u5l5-alab ' + cls, ''); e.style.opacity = 0; return e; };
    const lL = lab('u5l5-cz'), lR = lab('u5l5-cz'), lT = lab('u5l5-cv');
    const pole = svgEl('g', {}, sc); pole.style.opacity = 0;
    const pl = svgEl('line', { y1: G0, y2: Y(7.875), stroke: PT, 'stroke-width': 5, 'stroke-linecap': 'round' }, pole);
    const pd = svgEl('circle', { cy: Y(7.875), r: 7, fill: PT, stroke: '#fff', 'stroke-width': 2 }, pole);
    const pole2 = svgEl('g', {}, sc); pole2.style.opacity = 0;
    svgEl('line', { x1: X(21), x2: X(21), y1: G0, y2: Y(7.875), stroke: PT, 'stroke-width': 4, 'stroke-dasharray': '6 6' }, pole2);
    svgEl('circle', { cx: X(21), cy: Y(7.875), r: 6, fill: '#fff', stroke: PT, 'stroke-width': 3 }, pole2);
    const poleLab = div(stage, 'u5l5-plab', ''); poleLab.style.opacity = 0;
    const ok = stamp(stage, 'same answer ✓', { ok: true, x: X(3) + 30, y: Y(7.875) - 80, size: 'sm' }); ok.style.opacity = 0;
    // the panel
    const PX = SW + 18, P = panel(stage, PX, W - PX);
    const where = h('div', 'u5l5-where'); P.appendChild(where);
    const eq = h('div', 'u5l5-eqbig'); P.appendChild(eq);
    const info = h('div', 'u5l5-info'); P.appendChild(info);
    const aBox = h('div', 'u5l5-abox', `${T('a=-\\frac{1}{8}')} <b class="u5l5-every">every time</b>`); P.appendChild(aBox);
    const pBox = h('div', 'u5l5-pbox'); P.appendChild(pBox);
    const sl = h('label', 'u5l5-sl no-ink', `<span class="u5l5-sll">origin</span><input type="range" min="0" max="24" step="1" value="0" aria-label="where the origin is, in metres from the left end of the base"><span class="u5l5-slv"></span>`);
    sl.setAttribute('data-tap', ''); P.appendChild(sl);
    const inp = sl.querySelector('input'), slv = sl.querySelector('.u5l5-slv');
    [where, eq, info, aBox, pBox, sl].forEach((e) => (e.style.opacity = 0));
    const n = (x) => String(x).replace('-', '−');
    const eqTex = (s) => { const hh = 12 - s; return `y=-\\frac{1}{8}${hh === 0 ? 'x^2' : `(x${hh > 0 ? '-' : '+'}${Math.abs(hh)})^2`}+18`; };
    const upd = () => {
      const s = Math.round(S.s * 100) / 100, si = Math.round(s);
      axes.innerHTML = '';
      const o = X(s);
      svgEl('line', { x1: 0, y1: G0, x2: SW - 4, y2: G0, stroke: '#1c2230', 'stroke-width': 2.6 }, axes);
      arrowHead(axes, SW - 2, G0, 1, 0, { color: '#1c2230', width: 2.6 });
      svgEl('line', { x1: o, y1: G0 + 14, x2: o, y2: 16, stroke: '#1c2230', 'stroke-width': 2.6 }, axes);
      arrowHead(axes, o, 12, 0, -1, { color: '#1c2230', width: 2.6 });
      for (let j = -9; j <= 9; j++) {
        const u = s + 3 * j; if (u < -3.6 || u > 27.6) continue; const px = X(u);
        svgEl('line', { x1: px, x2: px, y1: G0 - 5, y2: G0 + 5, stroke: '#1c2230', 'stroke-width': 2 }, axes);
        const t = svgEl('text', { x: px, y: G0 + 22, 'text-anchor': 'middle', class: 'u5l5-tick' }, axes); t.textContent = n(3 * j);
      }
      for (let j = 1; j <= 6; j++) {
        const py = Y(3 * j); svgEl('line', { x1: o - 5, x2: o + 5, y1: py, y2: py, stroke: '#1c2230', 'stroke-width': 2 }, axes);
        if (j % 2 === 0) { const t = svgEl('text', { x: o - 9, y: py + 5, 'text-anchor': 'end', class: 'u5l5-tick' }, axes); t.textContent = String(3 * j); }
      }
      const tx = svgEl('text', { x: SW - 18, y: G0 - 10, class: 'u5l5-axt' }, axes); tx.textContent = 'x';
      const ty = svgEl('text', { x: o + 10, y: 24, class: 'u5l5-axt' }, axes); ty.textContent = 'y';
      lL.innerHTML = pr(-si, 0); place(lL, X(0) - 24, G0 - 4, 'n', 6);
      lR.innerHTML = pr(24 - si, 0); place(lR, X(24) + 24, G0 - 4, 'n', 6);
      lT.innerHTML = pr(12 - si, 18); place(lT, X(12), Y(18) - 8, 'n', 6);
      pl.setAttribute('x1', X(3)); pl.setAttribute('x2', X(3)); pd.setAttribute('cx', X(3));
      poleLab.innerHTML = `${T('x=' + (3 - si))}<br>${T('y=7.875')}`; place(poleLab, X(3) + 10, Y(4), 'e', 4);
      where.innerHTML = `<b>Origin:</b> ${si === 0 ? 'the left end of the base' : si === 12 ? 'on the ground under the top' : si === 24 ? 'the right end of the base' : `${si} m from the left end`}`;
      eq.innerHTML = T(eqTex(si));
      info.innerHTML = `vertex ${pr(12 - si, 18)}<br>zeros ${T('x=' + (-si))} and ${T('x=' + (24 - si))}`;
      pBox.innerHTML = `3 m in from the left end: ${T('x=' + (3 - si))}, height ${T('7.875')} m`;
      inp.value = si; slv.textContent = si + ' m';
    };
    inp.addEventListener('input', () => { S.s = parseFloat(inp.value); upd(); });
    upd();
    const go = (c, to, ms) => { const s0 = S.s; return tween(c, ms, (u) => { S.s = s0 + (to - s0) * u; upd(); }); };
    const showAll = (c, els) => Promise.all(els.map((e) => show(c, e)));
    void stone; void joints;
    return [
      { cap: `A stone arch: <b>24 m</b> wide at its base, <b>18 m</b> high at its centre. Its inner edge is a parabola. Where should the axes go? <b>We</b> choose!`,
        run: async (c) => { edge.style.opacity = 1; await drawIn(c, edge); await show(c, dims); } },
      { cap: `(a) Origin at the <b>left end</b> of the base. The zeros are ${T('0')} and ${T('24')}; the vertex is midway, ${pr(12, 18)}. ${T('y=a(x-12)^2+18')}, and ${pr(0, 0)}: ${T('0=144a+18')}, so ${T('a=-\\frac{1}{8}')}.`,
        run: async (c) => { await go(c, 0, 10); await appearEl(c, axes); await showAll(c, [lL, lR, lT]); await showAll(c, [where, eq, info]); await show(c, aBox); } },
      { cap: `(b) <b>3 m</b> in from the left end is ${T('x=3')}: ${T('y=-\\frac{1}{8}(3-12)^2+18=-\\frac{81}{8}+18=7.875')}. The arch is about <b>7.9 m</b> high there.`,
        run: async (c) => { pole.style.opacity = 1; await tween(c, 700, (u) => { pl.setAttribute('y2', G0 - (G0 - Y(7.875)) * u); pd.setAttribute('cy', G0 - (G0 - Y(7.875)) * u); }); await showAll(c, [poleLab, pBox]); } },
      { cap: `(c) Slide the origin to the ground <b>under the top</b>. Now the vertex is ${pr(0, 18)} and the zeros are ${T('\\pm12')}: ${T('0=144a+18')} again, ${T('a=-\\frac{1}{8}')}, and ${T('y=-\\frac{1}{8}x^2+18')}.`,
        run: async (c) => { await go(c, 12, 2200); await pulse(c, eq, 1.06); } },
      { cap: `Check (b): 3 m in from an end is now ${T('x=-9')} (or ${T('9')}): ${T('y=-\\frac{81}{8}+18=7.875')} ✓. <b>Same arch, same answer</b>: only the equation changed.`,
        run: async (c) => { await show(c, pole2); await stampIn(c, unhide(ok)); } },
      { cap: `<b>Your turn:</b> drag the slider to put the origin anywhere on the base. The labels and the equation change; the arch, ${T('a=-\\frac{1}{8}')} and the height 7.875 m never do.`,
        run: async (c) => { hide(ok); await go(c, 4, 1200); await pulse(c, sl, 1.06); } }
    ];
  }
};
const drawIn = (c, el) => { const L = el.getTotalLength ? el.getTotalLength() : 1000; return tween(c, 1100, (u) => { el.style.strokeDasharray = `${L * u} ${L}`; if (u >= 1) el.style.strokeDasharray = ''; }); };
const appearEl = (c, el) => tween(c, 350, (u) => (el.style.opacity = u));

/* =============================== explainer: toss (Example 7) =============================== */
const F7 = (x) => -0.12 * (x - 10) * (x - 10) + 14;
const L7 = 10 + Math.sqrt(14 / 0.12), B7 = 10 - Math.sqrt(14 / 0.12);
const toss = {
  title: 'Two roots, one landing',
  height: 430, minW: 900,
  ask: () => `<b>Example 7:</b> thrown from ${T('2')} m, greatest height ${T('14')} m at ${T('10')} m away. The origin is on the ground below the release point.`,
  make(stage, v, ex) {
    const W = ex.W, GW = 600, PX = GW + 18;
    const G = new Graph(stage, { x: 0, y: 0, width: GW, height: 430, xmin: -3, xmax: 24, ymin: -1.5, ymax: 16, xlabels: 4, ylabels: 2, fontSize: 15, arrows: false, fnArrows: false });
    const [gx0, gy0] = G.toPx(-3, 0), [gx1, gyT] = G.toPx(24, 16), [, gyB] = G.toPx(0, -1.5);
    svgEl('rect', { x: gx0, y: gyT, width: gx1 - gx0, height: gy0 - gyT, fill: '#eaf3fb' }, G.layers.bg);
    svgEl('rect', { x: gx0, y: gy0, width: gx1 - gx0, height: gyB - gy0, fill: '#bfe0b4' }, G.layers.bg);
    const kid = svgEl('text', { x: G.toPx(-0.55, 0)[0], y: gy0 - 2, 'font-size': 2.25 * G.uy, 'text-anchor': 'middle' }, G.layers.top); kid.textContent = '🧍';
    const fo = { from: 0, to: 0, color: CURVE, width: 4 };
    const cv = G.fn(F7, fo);
    const ghost = hide(G.fn(F7, { from: -1.4, to: 0, color: COLORS.red, width: 3.5, dash: '6 6' }));
    const ball = svgEl('g', {}, G.layers.top);
    svgEl('circle', { r: 8, fill: '#fffdf6', stroke: COLORS.red, 'stroke-width': 3 }, ball);
    const setBall = (x) => { const [px, py] = G.toPx(x, Math.max(0, F7(x))); ball.setAttribute('transform', `translate(${px} ${py - (x >= L7 - 1e-6 ? 8 : 0)})`); if (x > fo.to) { fo.to = x; cv._bkDraw(); } };
    setBall(0);
    const pR = hide(G.point(0, 2, { color: 'green', r: 7.5, label: pr(0, 2), pos: 'nw' }));
    const pV = hide(G.point(10, 14, { color: 'red', r: 7.5, label: pr(10, 14), pos: 'n' }));
    const zG = hide(G.point(L7, 0, { color: 'amber', r: 8, label: T('x\\approx20.8'), pos: 'n' }));
    const zB = hide(G.point(B7, 0, { color: 'red', r: 7.5, open: true, label: T('x\\approx-0.8'), pos: 's' }));
    const sB = hide(stamp(stage, '✗ reject', { ok: false, x: G.toPx(-0.1, 9.5)[0], y: G.toPx(-0.1, 9.5)[1], size: 'sm' }));
    const sG = hide(stamp(stage, 'lands ≈ 20.8 m', { ok: true, x: G.toPx(L7, 0)[0] - 46, y: G.toPx(0, 3.6)[1], size: 'sm' }));
    const P = panel(stage, PX, W - PX);
    const ra = row(P, '(a)', `${T('2=a(0-10)^2+14')}<br>${T('-12=100a')}, ${T('a=-0.12')}<br>${T('y=-0.12(x-10)^2+14')}`, 'u5l5-lt');
    const rb = row(P, '(b)', `${T('(x-10)^2=\\frac{14}{0.12}\\approx116.67')}<br>${T('x-10\\approx\\pm10.80')}<br>${T('x\\approx20.8')} or ${T('x\\approx-0.8')}`, 'u5l5-lt');
    return [
      { cap: `<b>Throw!</b> The ball leaves the hand <b>2 m</b> up, is highest (<b>14 m</b>) when it is <b>10 m</b> away, and comes down. The origin is on the ground below the release point.`,
        run: async (c) => { await tween(c, 2600, (u) => setBall(L7 * u), linear); await popP(c, pR); await popP(c, pV); } },
      { cap: `(a) Vertex ${pr(10, 14)}, release point ${pr(0, 2)}: ${T('2=a(0-10)^2+14')}, ${T('-12=100a')}, so ${T('a=-0.12')} and ${T('y=-0.12(x-10)^2+14')}.`,
        run: async (c) => { await show(c, ra); } },
      { cap: `(b) It lands when ${T('y=0')}: ${T('(x-10)^2=\\frac{14}{0.12}\\approx116.67')}, so ${T('x-10\\approx\\pm10.80')}. <b>Two</b> answers: ${T('x\\approx20.8')} and ${T('x\\approx-0.8')}.`,
        run: async (c) => { await show(c, rb); await drawOn(c, G, ghost, 700); await Promise.all([popP(c, zG), popP(c, zB)]); } },
      { cap: `${T('x\\approx-0.8')} is <b>behind the thrower</b>: the parabola goes there, but the ball never did. Reject it. The ball lands about <b>20.8 m</b> away.`,
        run: async (c) => { await stampIn(c, unhide(sB)); await stampIn(c, unhide(sG)); } }
    ];
  }
};

/* =============================== Stand Up Break =============================== */
/* BEG: vertex and a point, whole-number a. PRG: vertex and a y-intercept, fractional a (exact). MAS: zeros and a point:
 * factored form and the vertex. */
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const frac = (n, d) => { const g = gcd(n, d), N = n / g, D = d / g; return D === 1 ? String(N) : `${N < 0 ? '-' : ''}\\frac{${Math.abs(N)}}{${D}}`; };
const co = (t) => (t === '1' ? '' : t === '-1' ? '-' : t);
const xp = (p) => (p === 0 ? 'x' : `(x${p > 0 ? '-' : '+'}${Math.abs(p)})`);
const sq = (p) => (p === 0 ? 'x^2' : `${xp(p)}^2`);
const kq = (q) => (q === 0 ? '' : q > 0 ? `+${q}` : `${q}`);
const inner = (x, p) => (p === 0 ? `${x}` : `${x}${p > 0 ? '-' : '+'}${Math.abs(p)}`);
const pp = (x, y) => `(${x},\\ ${y})`;
standup('u5l5', {
  intro: 'At your whiteboard: write the equation, then check it with the point you were given.',
  levels: {
    BEG: (r) => {
      for (;;) {
        const p = r.int(-6, 6), q = r.int(-8, 8), a = r.pick([-3, -2, -1, 1, 2, 3]), dd = r.pick([-3, -2, -1, 1, 2, 3]);
        const x1 = p + dd, y1 = q + a * dd * dd; if (Math.abs(y1) > 30) continue;
        return { text: 'Write the equation in vertex form of the parabola with this vertex that passes through this point.',
          q: `\\text{vertex }${pp(p, q)},\\ \\text{point }${pp(x1, y1)}`,
          a: [`${y1}=a(${inner(x1, p)})^2${kq(q)}`, `${y1 - q}=${dd * dd}a,\\ a=${a}`, `y=${co(String(a))}${sq(p)}${kq(q)}`] };
      }
    },
    PRG: (r) => {
      for (;;) {
        const D = r.pick([2, 3, 4]), N = r.sign() * r.pick([1, 2, 3, 5, 7]), p = r.sign() * D, q = r.int(-9, 9);
        if (N % (D * D) === 0) continue;
        const k = q + N, A = frac(N, D * D);
        return { text: 'Write the equation in vertex form. Leave <i>a</i> as an exact fraction.',
          q: `\\text{vertex }${pp(p, q)},\\ y\\text{-intercept }${k}`,
          a: [`(0,\\ ${k}):\\ ${k}=a(${inner(0, p)})^2${kq(q)}`, `${k - q}=${D * D}a,\\ a=${A}`, `y=${co(A)}${sq(p)}${kq(q)}`] };
      }
    },
    MAS: (r) => {
      for (;;) {
        const rr = r.int(-7, 3), w = 2 * r.int(1, 4), s = rr + w, x0 = r.int(rr - 2, s + 2);
        if (x0 === rr || x0 === s) continue;
        const m = (x0 - rr) * (x0 - s), a = r.pick([-2, -1, -0.5, 0.5, 1, 2]), y0 = a * m;
        if (!Number.isInteger(y0) || y0 === 0 || Math.abs(y0) > 40) continue;
        const A = a === 0.5 ? '\\frac{1}{2}' : a === -0.5 ? '-\\frac{1}{2}' : String(a), xv = rr + w / 2, yv = a * (xv - rr) * (xv - s);
        const yvT = Number.isInteger(yv) ? String(yv) : frac(Math.round(yv * 2), 2);
        return { text: 'Write the equation in factored form, then determine the vertex.',
          q: `\\text{zeros }${rr}\\text{ and }${s},\\ \\text{through }${pp(x0, y0)}`,
          a: [`y=a${xp(rr)}${xp(s)}`, `${y0}=a(${inner(x0, rr)})(${inner(x0, s)})=${m}a,\\ a=${A}`, `y=${co(A)}${xp(rr)}${xp(s)}`, `\\text{axis }x=${xv}:\\ \\text{vertex }${pp(xv, yvT)}`] };
      }
    }
  }
});

/* =============================== mount =============================== */
export const explainers = mountExplainers({ pin, read, mirror, zeros, arch, toss });
export const _test = { F3, F7, L7, B7, frac };
