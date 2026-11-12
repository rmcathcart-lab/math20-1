/* Math 20-1 · Unit 5 · Lesson 1 — Zeros, Roots and x-Intercepts.
 * New lesson format (2026-11-11): the warm-up ("The Matchstick Grids") is plain markup on the page (no code). Explainers:
 *   parts   (Example 1's parabolas: opens up/down, the x-intercepts, then the parabola FOLDS along its axis of symmetry so
 *            the two halves (and the two intercepts) land on each other, halfway between; vertex, min/max, y-intercept;
 *            the table fills in beside it),
 *   views   (one number, three names: a dot hops along y = x² + 2x − 8 while three cards (equation, function, graph) test
 *            each x; at −4 and 2 all three light up together: root, zero, x-intercept; then the factors show them),
 *   factor  (the procedure, numbered 1–4, with Ryan's X: ac on top, b underneath, the two numbers on the sides, the factor
 *            pairs beside with the right pair circled; Examples 3(a), 3(d), 4(a); 3(a) ends with the "why make it 0 first?"
 *            stamp),
 *   slide   (STAR, hands-on: slide a parabola up and down (and flip it); its x-intercepts appear, merge and vanish while the
 *            root count is stamped 2 / 1 / 0; Example 5(a) and 5(b)(i)),
 *   family  (y = a(x − r)(x − s): the zeros are pinned while a stretches and flips the parabola; one more point fixes a;
 *            a slider for a; Examples 7(a), 7(b), 7(d)),
 *   flare   (Example 8: the flare flies off the cliff in step with its graph; t = −1 rejected "before it was fired",
 *            t = 6 the sea, h(0) = 30 the cliff).
 * Colours (kept through the unit): the curve blue, zeros / roots / x-intercepts amber, the vertex red, the axis of
 * symmetry purple, the y-intercept green. */
import {
  h, tex, add, box, Graph, stamp, stampIn, mountExplainers, pop, fadeIn, anim, sleep, tween, svgEl, pulse, shake,
  linear, COLORS, texNum
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const CURVE = COLORS.blue, ZC = COLORS.amber, VC = COLORS.red, AC = COLORS.purple, YC = COLORS.green, INK = COLORS.ink;
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; if (el && el.label) el.label.style.opacity = 0; return el; };
const unhide = (el) => { if (el) el.style.opacity = ''; if (el && el.label) el.label.style.opacity = ''; return el; };
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
const absSvg = (stage, w, hh, x = 0, y = 0, cls = '') => { const s = svgEl('svg', { width: w, height: hh, viewBox: `0 0 ${w} ${hh}`, class: cls }, stage); s.style.position = 'absolute'; s.style.left = x + 'px'; s.style.top = y + 'px'; return s; };
const popP = (c, p) => { unhide(p); return Promise.all([pop(c, p), p.label ? show(c, p.label) : null]); };
const tn = (v) => texNum(v, 2);
const f2 = (v) => (Math.round((v + Math.sign(v) * 1e-9) * 100) / 100).toFixed(2);
/* a numbered row for step-by-step procedures (the step number beside each step as it appears) */
const row = (host, n, html, cls = '') => { const r = h('div', 'u5l1-row ' + cls, `<span class="u5l1-n">${n}</span><div class="u5l1-rc">${html}</div>`); r.style.opacity = 0; host.appendChild(r); return r; };
const showRow = (c, r) => { r.style.opacity = ''; return fadeIn(c, r, 320); };
/* (x − r) with the sign done properly */
const fac = (r, v = 'x') => (r === 0 ? v : r < 0 ? `(${v}+${tn(-r)})` : `(${v}-${tn(r)})`);

/* =============================== explainer: the parts of a parabola (Example 1, with the fold) =============================== */
const P1 = {
  a: { eq: 'y=x^2-4x-5', f: (x) => x * x - 4 * x - 5, a: 1, win: { xmin: -3, xmax: 7, ymin: -10, ymax: 6, ylabels: 2 }, from: -2.1, to: 6.1, r: [-1, 5], v: [2, -9], c: -5 },
  b: { eq: 'y=-x^2-2x+3', f: (x) => -x * x - 2 * x + 3, a: -1, win: { xmin: -5, xmax: 3, ymin: -6, ymax: 6, ylabels: 2 }, from: -4.1, to: 2.1, r: [-3, 1], v: [-1, 4], c: 3 }
};
const parts = {
  title: 'The parts of a parabola',
  height: 440, minW: 880, capH: 96,
  choices: [{ sep: 'Example 1:' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }],
  ask: (v) => `<b>Example 1(${v}):</b> ${T(P1[v].eq)}. Read its parts from the graph.`,
  make(stage, v, ex) {
    const W = ex.W, d = P1[v], up = d.a > 0, GW = 450, PX = GW + 26, PW = W - PX;
    const G = new Graph(stage, Object.assign({ x: 0, y: 0, width: GW, height: 440, fontSize: 15, pad: [30, 18, 18, 18] }, d.win));
    const cv = G.fn(d.f, { from: d.from, to: d.to, color: CURVE, width: 4 });
    hide(cv);
    const ax = d.v[0];
    // the fold: a copy of the left half that swings over onto the right half
    const half = G.fn(d.f, { from: d.from, to: ax, color: COLORS.orange, width: 6, arrows: false });
    half.setAttribute('opacity', 0.75); hide(half);
    const axl = G.vline(ax, { color: AC, width: 3 }); hide(axl);
    const axlab = G.label(ax, d.win.ymax, T(`x=${ax}`), { pos: up ? 'se' : 'ne', cls: 'bk-ptlab u5l1-axlab', dy: up ? 4 : 0 });
    if (!up) { axlab.gy = d.win.ymin; axlab._bkDraw(); }
    hide(axlab);
    const r1 = hide(G.point(d.r[0], 0, { color: 'amber', r: 8, label: T(tn(d.r[0])), pos: up ? 'nw' : 'sw' }));
    const r2 = hide(G.point(d.r[1], 0, { color: 'amber', r: 8, label: T(tn(d.r[1])), pos: up ? 'ne' : 'se' }));
    const ghost = hide(G.point(d.r[0], 0, { color: 'orange', r: 7 }));
    const vx = hide(G.point(d.v[0], d.v[1], { color: 'red', r: 8, label: T(`(${tn(d.v[0])},\\ ${tn(d.v[1])})`), pos: up ? 's' : 'n' }));
    const yi = hide(G.point(0, d.c, { color: 'green', r: 7.5, label: T(tn(d.c)), pos: up ? 'nw' : 'ne' }));
    // the table beside the graph
    const P = div(stage, 'u5l1-pt', `<div class="u5l1-pth">${T(d.eq)}</div>`, PX, 0, PW);
    const R = [['Opens', up ? `up (${T('a=1>0')})` : `down (${T('a=-1<0')})`],
      [`${T('x')}-intercepts`, `${T(tn(d.r[0]))} and ${T(tn(d.r[1]))}`],
      ['Axis of symmetry', T(`x=${ax}`)],
      ['Vertex', T(`(${tn(d.v[0])},\\ ${tn(d.v[1])})`)],
      [up ? 'Minimum value' : 'Maximum value', T(tn(d.v[1]))],
      [`${T('y')}-intercept`, T(tn(d.c))]].map(([k, val], i) => {
      const r = h('div', 'u5l1-ptr u5l1-ptr' + i, `<span>${k}</span><b>${val}</b>`); P.appendChild(r); const b = r.querySelector('b'); b.style.opacity = 0; r.val = b; return r;
    });
    const fill = async (c, i) => { const b = R[i].val; b.style.opacity = ''; R[i].classList.add('on'); await pop(c, b, 320); };
    const S = { s: 1 };
    const setFold = (s) => { S.s = s; const [px] = G.toPx(ax, 0); half.setAttribute('transform', `translate(${px} 0) scale(${s} 1) translate(${-px} 0)`); const gx = ax + (d.r[0] - ax) * s; G.moveTo(ghost, gx, 0); };
    setFold(1);
    const [m1, m2] = d.r;
    return [
      { cap: `${T(d.eq)} has ${up ? T('a=1>0') : T('a=-1<0')}: the parabola <b>opens ${up ? 'up' : 'down'}</b>.`,
        run: async (c) => { unhide(cv); await G.drawIn(cv, 1100, c); await fill(c, 0); } },
      { cap: `The <b class="u5l1-cz">${T('x')}-intercepts</b> are where it meets the ${T('x')}-axis: ${T(tn(m1))} and ${T(tn(m2))}.`,
        run: async (c) => { await Promise.all([popP(c, r1), popP(c, r2)]); await fill(c, 1); } },
      { cap: `Fold the parabola in half: the two halves match, and ${T(tn(m1))} lands on ${T(tn(m2))}. The fold is the <b class="u5l1-ca">axis of symmetry</b>, halfway between: ${T(`x=\\frac{${tn(m1)}+${tn(m2)}}{2}=${ax}`)}.`,
        run: async (c) => {
          unhide(half); unhide(ghost); setFold(1); await show(c, half);
          await tween(c, 1600, (u) => setFold(1 - 2 * u));
          await pulse(c, r2, 1.5);
          unhide(axl); await G.drawIn(axl, 600, c); unhide(axlab); await show(c, axlab);
          await anim(c, half, [{ opacity: 0.75 }, { opacity: 0 }], 500); hide(half); hide(ghost);
          await fill(c, 2);
        } },
      { cap: `The <b class="u5l1-cv">vertex</b> is where the axis meets the parabola: ${T(`(${tn(d.v[0])},\\ ${tn(d.v[1])})`)}, its ${up ? 'lowest' : 'highest'} point. The ${up ? '<b>minimum value</b>' : '<b>maximum value</b>'} is ${T(tn(d.v[1]))}.`,
        run: async (c) => { await popP(c, vx); await fill(c, 3); await fill(c, 4); } },
      { cap: `The <b class="u5l1-cy">${T('y')}-intercept</b>: at ${T('x=0')}, ${T('y=c=' + tn(d.c))}.`,
        run: async (c) => { await popP(c, yi); await fill(c, 5); } }
    ];
  }
};

/* =============================== explainer: one number, three names =============================== */
const fV = (x) => x * x + 2 * x - 8;
const views = {
  title: 'One number, three names',
  height: 440, minW: 880, capH: 96,
  ask: () => `<b>Example 2(b):</b> ${T('f(x)=x^2+2x-8')}. Which values of ${T('x')} are roots, zeros and ${T('x')}-intercepts?`,
  make(stage, v, ex) {
    const W = ex.W, GW = 400, PX = GW + 22, PW = W - PX;
    const G = new Graph(stage, { x: 0, y: 0, width: GW, height: 440, xmin: -6, xmax: 4, ymin: -10, ymax: 18, ystep: 2, ylabels: 4, fontSize: 15, pad: [30, 18, 18, 18] });
    G.fn(fV, { from: -6, to: 4, color: '#9aa0ab', width: 2.5, dash: '7 6', arrows: false });
    const trail = svgEl('g', {}, G.layers.top);
    const dot = G.point(-6, fV(-6), { color: 'blue', r: 8.5 });
    const drop = svgEl('line', { stroke: CURVE, 'stroke-width': 2.5, 'stroke-dasharray': '5 5' }, G.layers.data);
    const zl1 = hide(G.point(-4, 0, { color: 'amber', r: 10, label: T('-4'), pos: 'ne' })), zl2 = hide(G.point(2, 0, { color: 'amber', r: 10, label: T('2'), pos: 'nw' }));
    const yi = hide(G.point(0, -8, { color: 'green', r: 7.5, label: `${T('y')}-int. ${T('-8')}`, pos: 'se' }));
    // the x readout and three cards
    const P = div(stage, 'u5l1-vw', '', PX, 0, PW);
    const xr = h('div', 'u5l1-xr'); P.appendChild(xr);
    const card = (k, head) => { const e = h('div', 'u5l1-vc', `<div class="u5l1-vch"><b>${k}</b>${head}</div><div class="u5l1-vcb"></div><div class="u5l1-vcv"></div>`); P.appendChild(e); e.b = e.querySelector('.u5l1-vcb'); e.v = e.querySelector('.u5l1-vcv'); return e; };
    const cE = card('Equation', T('x^2+2x-8=0')), cF = card('Function', T('f(x)=x^2+2x-8')), cG = card('Graph', `the point ${T('(x,\\ f(x))')}`);
    const fb = div(stage, 'u5l1-fb', `${T('f(x)=')}<span class="u5l1-f1">${T('(x+4)')}</span><span class="u5l1-f2">${T('(x-2)')}</span>`, PX, 340, PW); hide(fb);
    const fnote = div(fb, 'u5l1-fbn', `${T('x=-4')} makes ${T('x+4=0')}; &nbsp;${T('x=2')} makes ${T('x-2=0')}`);
    const S = { x: -6 };
    const set = (x) => {
      S.x = x; const y = fV(x); G.moveTo(dot, x, y);
      const [px, py] = G.toPx(x, y), [, p0] = G.toPx(x, 0); drop.setAttribute('x1', px); drop.setAttribute('x2', px); drop.setAttribute('y1', py); drop.setAttribute('y2', p0);
    };
    const land = (x) => {
      const y = fV(x), ok = y === 0, p = x < 0 ? `(${x})` : `${x}`;
      xr.innerHTML = `${T(`x=${x}`)}`;
      cE.b.innerHTML = T(`${p}^2+2(${x})-8=${y}`); cE.v.innerHTML = ok ? '✓ true: a <b>root</b>' : `${T(`${y}\\ne0`)}: not a root`;
      cF.b.innerHTML = T(`f(${x})=${y}`); cF.v.innerHTML = ok ? '✓ the output is 0: a <b>zero</b>' : 'the output is not 0';
      cG.b.innerHTML = T(`(${x},\\ ${y})`); cG.v.innerHTML = ok ? `✓ on the axis: an <b>${T('x')}-intercept</b>` : (y > 0 ? 'above' : 'below') + ` the ${T('x')}-axis`;
      [cE, cF, cG].forEach((e) => e.classList.toggle('on', ok));
      const [px, py] = G.toPx(x, y);
      svgEl('circle', { cx: px, cy: py, r: ok ? 0 : 4.5, fill: CURVE, opacity: 0.55 }, trail);
    };
    set(-6); land(-6); [cE, cF, cG].forEach(hide);
    const hop = async (c, x1, ms = 520) => {
      const x0 = S.x;
      await tween(c, ms, (u) => set(x0 + (x1 - x0) * u));
      land(x1);
      if (fV(x1) === 0) await Promise.all([cE, cF, cG].map((e) => pulse(c, e, 1.05)).concat(pulse(c, dot, 1.6)));
      else await sleep(c, 160);
    };
    return [
      { cap: `Three questions about one function: does ${T('x')} make the <b>equation</b> true? Is the <b>output</b> ${T('0')}? Is the <b>point</b> on the ${T('x')}-axis? Try ${T('x=-6')}: ${T('f(-6)=16')}. No, no and no.`,
        run: async (c) => { [cE, cF, cG].forEach(unhide); await Promise.all([cE, cF, cG].map((e) => show(c, e))); await pulse(c, dot, 1.4); } },
      { cap: `Hop along: ${T('x=-5')} gives ${T('7')}. Then ${T('x=-4')}: ${T('(-4)^2+2(-4)-8=16-8-8=0')}. <b>All three light up at once:</b> ${T('-4')} is a root, a zero and an ${T('x')}-intercept.`,
        run: async (c) => { await hop(c, -5); await hop(c, -4, 600); await popP(c, zl1); } },
      { cap: `Keep going: ${T('-5,\\ -8,\\ -9,\\ -8,\\ -5')} are not ${T('0')}… until ${T('x=2')}: ${T('4+4-8=0')}. All three light up again.`,
        run: async (c) => { for (const x of [-3, -2, -1, 0, 1]) await hop(c, x, 380); await hop(c, 2, 520); await popP(c, zl2); } },
      { cap: `After ${T('2')} the values grow again. Only ${T('-4')} and ${T('2')} work: the <b class="u5l1-cz">zeros</b> of ${T('f')} = the <b class="u5l1-cz">${T('x')}-intercepts</b> = the <b class="u5l1-cz">roots</b> of ${T('f(x)=0')}. The ${T('y')}-intercept is ${T('f(0)=-8')}.`,
        run: async (c) => { await hop(c, 3, 380); await hop(c, 4, 380); await popP(c, yi); } },
      { cap: `The factors show the zeros: ${T('f(x)=(x+4)(x-2)')}. ${T('x=-4')} makes the first factor ${T('0')}, ${T('x=2')} makes the second one ${T('0')}, and ${T('0')} times anything is ${T('0')} (the zero product property).`,
        run: async (c) => { await anim(c, cG, [{ opacity: 1 }, { opacity: 0 }], 300); cG.style.visibility = 'hidden'; unhide(fb); await show(c, fb); await pulse(c, fb.querySelector('.u5l1-f1'), 1.15); await pulse(c, fb.querySelector('.u5l1-f2'), 1.15); await show(c, fnote); } }
    ];
  }
};

/* =============================== explainer: zeros by factoring, with the X =============================== */
const FX = {
  e3a: { label: '3(a)', ask: `<b>Example 3(a):</b> find the roots of ${T('x^2-5x=14')}.`,
    r1: ['x^2-5x=14', 'x^2-5x-14=0'], r1cap: `<b>1</b> Move every term to one side: subtract ${T('14')}, so ${T('x^2-5x-14=0')}.`,
    ac: -14, b: -5, pairs: [[1, -14], [-1, 14], [2, -7], [-2, 7]], pick: 2, pre: '', inner: 'x^2-5x-14',
    facCap: `With ${T('a=1')} the two numbers go straight into the brackets: ${T('(x-7)(x+2)=0')}.`, facRow: '(x-7)(x+2)=0',
    r3t: `${T('x-7=0')} or ${T('x+2=0')}`, r4: `${T('x=7')} or ${T('x=-2')}`, r4cap: `<b>4</b> Solve each: the roots are ${T('x=7')} and ${T('x=-2')}.` },
  e3d: { label: '3(d)', ask: `<b>Example 3(d):</b> find the roots of ${T('6x^2+x=2')}.`,
    r1: ['6x^2+x=2', '6x^2+x-2=0'], r1cap: `<b>1</b> Move every term to one side: subtract ${T('2')}, so ${T('6x^2+x-2=0')}.`,
    ac: -12, b: 1, pairs: [[1, -12], [-1, 12], [2, -6], [-2, 6], [3, -4], [-3, 4]], pick: 5, pre: '', inner: '6x^2+x-2',
    split: ['6x^2+4x-3x-2', '=2x(3x+2)-1(3x+2)'], facRow: '(3x+2)(2x-1)=0',
    facCap: `Split the middle term into ${T('4x-3x')} and group: ${T('2x(3x+2)-1(3x+2)=(3x+2)(2x-1)')}.`,
    r3t: `${T('3x+2=0')} or ${T('2x-1=0')}`, r4: `${T('x=-\\frac{2}{3}')} or ${T('x=\\frac{1}{2}')}`, r4cap: `<b>4</b> Solve each: ${T('x=-\\frac{2}{3}')} or ${T('x=\\frac{1}{2}')}.` },
  e4a: { label: '4(a)', ask: `<b>Example 4(a):</b> determine the zeros and the ${T('y')}-intercept of ${T('f(x)=2x^2-6x-20')}.`,
    r1: ['f(x)=0', '2x^2-6x-20=0'], r1cap: `<b>1</b> Set ${T('f(x)=0')}: ${T('2x^2-6x-20=0')}. Every term is already on one side.`,
    common: '2(x^2-3x-10)=0', ac: -10, b: -3, pairs: [[1, -10], [-1, 10], [2, -5], [-2, 5]], pick: 2, pre: '2', inner: 'x^2-3x-10',
    facCap: `With ${T('a=1')} inside the bracket, the two numbers go straight in: ${T('2(x-5)(x+2)=0')}.`, facRow: '2(x-5)(x+2)=0',
    r3t: `${T('2\\ne0')}, so ${T('x-5=0')} or ${T('x+2=0')}`, r4: `Zeros: ${T('5')} and ${T('-2')}`, r4cap: `<b>4</b> Solve each: the zeros are ${T('5')} and ${T('-2')}.`,
    yint: `${T('y')}-intercept: ${T('f(0)=-20')}` }
};
const factor = {
  title: 'Zeros by factoring: four steps',
  height: 446, minW: 880, capH: 96,
  choices: [{ sep: 'Example' }, ...Object.keys(FX).map((k) => ({ v: k, label: FX[k].label }))],
  ask: (v) => FX[v].ask,
  make(stage, v, ex) {
    const W = ex.W, e = FX[v], LW = 470, RX = LW + 24, RW = W - RX;
    const rows = div(stage, 'u5l1-rows', '', 0, 4, LW, 438);
    const steps = [];
    const r1 = row(rows, 1, `${T(e.r1[0])}<br>${T(e.r1[1])}`);
    steps.push({ cap: e.r1cap, run: (c) => showRow(c, r1) });
    // the X: ac on top, b underneath, the two numbers on the sides; factor pairs beside, the right pair circled
    const XS = 200, XX = RX + 4, XY = 34;
    const xh = div(stage, 'u5l1-xh', `Find two numbers: product ${T('ac')}, sum ${T('b')}`, RX, 0, RW); hide(xh);
    const xsv = absSvg(stage, XS, XS, XX, XY, 'u5l1-x');
    svgEl('line', { x1: 24, y1: 24, x2: XS - 24, y2: XS - 24 }, xsv); svgEl('line', { x1: XS - 24, y1: 24, x2: 24, y2: XS - 24 }, xsv);
    const xl = (html, x, y, cls = '') => div(stage, 'u5l1-xl ' + cls, html, XX + x, XY + y);
    const [p, q] = e.pairs[e.pick];
    const xt = xl(T(String(e.ac)), XS / 2, 2, 'u5l1-xt'), xb = xl(T(String(e.b)), XS / 2, XS - 2, 'u5l1-xb');
    const xa = xl(T(String(p)), 6, XS / 2, 'u5l1-xs'), xc = xl(T(String(q)), XS - 6, XS / 2, 'u5l1-xs');
    const pl = div(stage, 'u5l1-pairs', `<div class="u5l1-pairh">pairs → sum</div>` + e.pairs.map(([m, n], i) => `<div class="${i === e.pick ? 'u5l1-pk' : ''}">${T(`${m}\\cdot${n < 0 ? `(${n})` : n}`)}<i>${T('\\to' + (m + n))}</i></div>`).join(''), XX + XS + 30, XY - 6, RW - XS - 34);
    [xsv, xt, xb, xa, xc, pl].forEach(hide);
    const xinfo = div(stage, 'u5l1-xinfo', `${e.pre ? `${T(e.pre)} out first, then ` : ''}${T(e.inner)}: ${T(`ac=${e.ac}`)}, ${T(`b=${e.b}`)}`, RX, XY + XS + 22, RW); hide(xinfo);
    const facHtml = (e.common ? `${T(e.common)}<br>` : '') + (e.split ? `${T(e.split[0])}<br>${T(e.split[1])}<br>` : '') + T(e.facRow);
    const r2 = row(rows, 2, facHtml);
    const r2parts = [];
    steps.push({ cap: `<b>2</b> Factor fully${e.common ? `, the common factor first: ${T(e.common)}` : ''}. The X: ${T(`ac=${e.ac}`)} on top, ${T(`b=${e.b}`)} underneath. List the factor pairs of ${T(String(e.ac))}: ${T(String(p))} and ${T(String(q))} multiply to ${T(String(e.ac))} and add to ${T(String(e.b))}.`,
      run: async (c) => {
        unhide(xh); await show(c, xh); unhide(xinfo); await show(c, xinfo);
        unhide(xsv); await show(c, xsv); unhide(xt); await pop(c, xt); unhide(xb); await pop(c, xb);
        unhide(pl); await show(c, pl); const pk = pl.querySelector('.u5l1-pk'); pk.classList.add('on'); await pulse(c, pk, 1.12);
        unhide(xa); unhide(xc); await Promise.all([pop(c, xa), pop(c, xc)]);
      } });
    steps.push({ cap: e.facCap, run: (c) => showRow(c, r2) });
    const r3 = row(rows, 3, e.r3t);
    steps.push({ cap: `<b>3</b> Set each factor that contains ${T('x')} equal to ${T('0')}: ${e.r3t}.`, run: (c) => showRow(c, r3) });
    const r4 = row(rows, 4, e.r4);
    steps.push({ cap: e.r4cap, run: (c) => showRow(c, r4) });
    if (e.yint) {
      const yb = div(stage, 'u5l1-ybox', `${T('f(0)=2(0)^2-6(0)-20=-20')}`, RX, 330, RW); hide(yb);
      steps.push({ cap: `And the ${T('y')}-intercept: substitute ${T('x=0')}: ${T('f(0)=-20')}.`, run: async (c) => { unhide(yb); await show(c, yb); } });
    }
    if (v === 'e3a') {
      const wbox = div(stage, 'u5l1-why', `<div class="u5l1-whyh">Why make one side ${T('0')} first?</div>${T('x(x-5)=14')} does <b>not</b> mean ${T('x=14')} or ${T('x-5=14')}.<br>Try ${T('x=14')}: ${T('14(14-5)=14\\cdot9=126\\ne14')}`, RX, 318, RW); hide(wbox);
      const st = stamp(stage, 'Only 0 works!', { ok: false, x: RX + RW - 100, y: 410 }); st.style.opacity = 0;
      steps.push({ cap: `Why move the ${T('14')} first? ${T('x(x-5)=14')} has no shortcut: ${T('x=14')} gives ${T('126')}, not ${T('14')}. Only a product equal to <b>${T('0')}</b> tells us a factor is ${T('0')}.`,
        run: async (c) => { unhide(wbox); await show(c, wbox); st.style.opacity = ''; await stampIn(c, st); } });
    }
    return steps;
  }
};

/* =============================== explainer: slide the parabola (STAR, hands-on) =============================== */
const KTXT = {
  2: ['2 real roots', 'two distinct real roots: two ' + T('x') + '-intercepts'],
  1: ['1 real root', 'one real root, a <b>double root</b>: the vertex is on the axis'],
  0: ['no real roots', 'no real roots: no ' + T('x') + '-intercepts']
};
const slide = {
  title: 'Slide the parabola: two, one or none',
  height: 440, minW: 880, tap: false, capH: 96,
  ask: () => `<b>Example 5:</b> how many times does the parabola meet the ${T('x')}-axis? Slide it up and down, and flip it.`,
  make(stage, v, ex) {
    const W = ex.W, GW = 430, PX = GW + 22, PW = W - PX;
    const S = { q: -1, A: 1 };
    const G = new Graph(stage, { x: 0, y: 2, width: GW, height: 436, xmin: -1, xmax: 5, ymin: -6, ymax: 7, fontSize: 15, pad: [30, 18, 18, 18] });
    const f = (x) => S.A * (x - 2) * (x - 2) + S.q;
    const cv = G.fn(f, { color: CURVE, width: 4 });
    const vx = G.point(2, -1, { color: 'red', r: 7 });
    const r1 = G.point(1, 0, { color: 'amber', r: 9, label: '', pos: 'sw' }), r2 = G.point(3, 0, { color: 'amber', r: 9, label: '', pos: 'se' });
    const ring = svgEl('circle', { r: 17, class: 'u5l1-glow' }, G.layers.top); ring.style.display = 'none';
    const sts = { 2: stamp(stage, KTXT[2][0], { ok: true, x: 215, y: 54 }), 1: stamp(stage, KTXT[1][0], { ok: null, x: 215, y: 54 }), 0: stamp(stage, KTXT[0][0], { ok: false, x: 215, y: 54 }) };
    // the panel
    const P = div(stage, 'u5l1-pn', '', PX, 0, PW);
    const eq = h('div', 'u5l1-eqbig'); P.appendChild(eq);
    const ctl = h('div', 'u5l1-ctl no-ink');
    ctl.innerHTML = `<label class="u5l1-sl" data-tap><span class="u5l1-sll">↕</span><input type="range" min="-5" max="5" step="0.25" aria-label="the height of the vertex"><span class="u5l1-slv"></span></label><button class="pill u5l1-flip" type="button">Flip ⇅</button>`;
    P.appendChild(ctl);
    const inp = ctl.querySelector('input'), slv = ctl.querySelector('.u5l1-slv'), flipB = ctl.querySelector('.u5l1-flip');
    const facts = h('div', 'u5l1-facts'); P.appendChild(facts);
    const meter = h('div', 'u5l1-meter', [2, 1, 0].map((k) => `<span class="u5l1-m${k}"><b>${k}</b>${k === 1 ? 'real root' : 'real roots'}</span>`).join('')); P.appendChild(meter);
    const verd = h('div', 'u5l1-verd'); P.appendChild(verd);
    let last = null;
    const upd = () => {
      const q = S.q, A = S.A, up = A > 0;
      cv._bkDraw(); G.moveTo(vx, 2, q);
      const t = Math.abs(A) < 1e-6 ? -1 : -q / A, k = Math.abs(q) < 1e-9 ? 1 : t > 0 ? 2 : 0;
      if (k === 2) {
        const s = Math.sqrt(t), a = 2 - s, b = 2 + s, ex2 = Math.abs(s - Math.round(s)) < 1e-9;
        G.moveTo(r1, a, 0); G.moveTo(r2, b, 0); unhide(r1); unhide(r2);
        r1.label.innerHTML = T((ex2 ? '' : '\\approx') + (ex2 ? tn(a) : f2(a))); r2.label.innerHTML = T((ex2 ? '' : '\\approx') + (ex2 ? tn(b) : f2(b)));
      } else if (k === 1) { G.moveTo(r1, 2, 0); unhide(r1); hide(r2); r1.label.innerHTML = T('2'); }
      else { hide(r1); hide(r2); }
      const [px, py] = G.toPx(2, 0); ring.setAttribute('cx', px); ring.setAttribute('cy', py); ring.style.display = k === 1 ? '' : 'none';
      if (Math.abs(Math.abs(A) - 1) < 1e-9) {
        const cc = 4 * A + q;
        eq.innerHTML = T(`y=${up ? '' : '-'}x^2${up ? '-' : '+'}4x${Math.abs(cc) < 1e-9 ? '' : cc < 0 ? '-' + tn(-cc) : '+' + tn(cc)}`);
        facts.innerHTML = `Opens <b>${up ? 'up' : 'down'}</b> · vertex ${T(`(2,\\ ${tn(q)})`)} <b>${Math.abs(q) < 1e-9 ? 'on' : q > 0 ? 'above' : 'below'}</b> the axis`;
      }
      inp.value = q; slv.textContent = tn(q).replace('-', '−');
      meter.querySelectorAll('span').forEach((s) => s.classList.toggle('on', s.classList.contains('u5l1-m' + k)));
      verd.innerHTML = KTXT[k][1]; verd.className = 'u5l1-verd u5l1-k' + k;
      [0, 1, 2].forEach((j) => { sts[j].style.display = j === k ? '' : 'none'; });
      if (last !== null && last !== k && sts[k].animate) sts[k].animate([{ transform: `scale(1.7) rotate(${sts[k].rot - 9}deg)`, opacity: 0 }, { transform: `scale(1) rotate(${sts[k].rot}deg)`, opacity: 1 }], { duration: 380, easing: 'cubic-bezier(.2,1.4,.4,1)' });
      last = k;
    };
    inp.addEventListener('input', () => { S.q = parseFloat(inp.value); upd(); });
    const goA = (c, to, ms) => { const a0 = S.A; return tween(c, ms, (u) => { S.A = u >= 1 ? to : a0 + (to - a0) * u; upd(); }); };
    flipB.addEventListener('click', () => { const to = S.A > 0 ? -1 : 1, a0 = S.A, t0 = performance.now(); const tick = (now) => { const u = Math.min(1, (now - t0) / 700); S.A = u >= 1 ? to : a0 + (to - a0) * u; upd(); if (u < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); });
    upd();
    const go = (c, to, ms) => { const q0 = S.q; return tween(c, ms, (u) => { S.q = u >= 1 ? to : Math.round((q0 + (to - q0) * u) * 40) / 40; upd(); }); };
    return [
      { cap: `${T('y=x^2-4x+3')}: it opens <b>up</b> and its vertex ${T('(2,\\ -1)')} is <b>below</b> the axis, so it crosses <b>twice</b>: two real roots, ${T('x=1')} and ${T('x=3')}.`,
        run: async (c) => { await go(c, -1, 400); await Promise.all([pulse(c, r1, 1.5), pulse(c, r2, 1.5)]); } },
      { cap: `Slide it up. The ${T('x')}-intercepts slide together and <b>merge</b> at ${T('2')}: ${T('y=x^2-4x+4')} just touches the axis at its vertex ${T('(2,\\ 0)')}. One real root, a <b>double root</b>.`,
        run: async (c) => { await go(c, 0, 1600); await pulse(c, verd, 1.05); } },
      { cap: `Keep going to ${T('y=x^2-4x+6')}: it opens up with its vertex ${T('(2,\\ 2)')} <b>above</b> the axis, so it never meets it. <b>No real roots.</b>`,
        run: async (c) => { await go(c, 2, 1500); } },
      { cap: `Now <b>flip</b> it to open down, vertex still ${T('(2,\\ 2)')}: the highest point is above the axis and it falls on both sides, so it crosses <b>twice</b> again.`,
        run: async (c) => { await goA(c, -1, 1300); await Promise.all([pulse(c, r1, 1.5), pulse(c, r2, 1.5)]); } },
      { cap: `Slide it down to vertex ${T('(2,\\ -3)')}, like Example 5(b)(i): it opens down and its highest point is <b>below</b> the axis. No ${T('x')}-intercepts.`,
        run: async (c) => { await go(c, -3, 1800); } },
      { cap: `<b>Your turn:</b> drag the slider and press Flip. Watch the stamp: two, one or no real roots, decided by the direction of opening and where the vertex is.`,
        run: async (c) => { await pulse(c, ctl, 1.06); } }
    ];
  }
};

/* =============================== explainer: same zeros, a family (factored form) =============================== */
const FM = {
  a: { label: '7(a)', ask: `<b>Example 7(a):</b> zeros ${T('-2')} and ${T('4')}; the graph passes through ${T('(0,\\ -16)')}. Write the function.`,
    z: [-2, 4], pt: [0, -16], aF: 2, demo: [3, -1, 0.5, 1], win: { xmin: -4, xmax: 6, ymin: -20, ymax: 12, ystep: 2, ylabels: 4 },
    form: 'y=a(x+2)(x-4)', sub: '-16=a(0+2)(0-4)=-8a', aEq: 'a=2', fac: 'y=2(x+2)(x-4)', gen: 'y=2(x^2-2x-8)=2x^2-4x-16' },
  b: { label: '7(b)', ask: `<b>Example 7(b):</b> zeros ${T('1')} and ${T('5')}; the graph passes through ${T('(3,\\ 6)')}. Write the function.`,
    z: [1, 5], pt: [3, 6], aF: -1.5, demo: [2, -1, 0.5, 1], win: { xmin: -1, xmax: 7, ymin: -8, ymax: 10, ystep: 1, ylabels: 2 },
    form: 'y=a(x-1)(x-5)', sub: '6=a(3-1)(3-5)=-4a', aEq: 'a=-\\frac{3}{2}', fac: 'y=-\\frac{3}{2}(x-1)(x-5)', gen: 'y=-\\frac{3}{2}(x^2-6x+5)=-\\frac{3}{2}x^2+9x-\\frac{15}{2}' },
  d: { label: '7(d)', ask: `<b>Example 7(d):</b> the graph touches the ${T('x')}-axis only at ${T('x=3')} and passes through ${T('(1,\\ 8)')}. Write the function.`,
    z: [3, 3], pt: [1, 8], aF: 2, demo: [3, -1, 0.5, 1], win: { xmin: -1, xmax: 7, ymin: -6, ymax: 12, ystep: 1, ylabels: 2 },
    form: 'y=a(x-3)^2', sub: '8=a(1-3)^2=4a', aEq: 'a=2', fac: 'y=2(x-3)^2', gen: 'y=2(x^2-6x+9)=2x^2-12x+18' }
};
const family = {
  title: 'Same zeros, a whole family',
  height: 446, minW: 880, tap: false, capH: 96,
  choices: [{ sep: 'Example' }, ...Object.keys(FM).map((k) => ({ v: k, label: FM[k].label }))],
  ask: (v) => FM[v].ask,
  make(stage, v, ex) {
    const W = ex.W, d = FM[v], dbl = d.z[0] === d.z[1], GW = 430, PX = GW + 22, PW = W - PX;
    const S = { a: 1 };
    const [r, s] = d.z;
    const G = new Graph(stage, Object.assign({ x: 0, y: 2, width: GW, height: 440, fontSize: 15, pad: [30, 18, 18, 18] }, d.win));
    const f = (x) => S.a * (x - r) * (x - s);
    const cv = G.fn(f, { color: CURVE, width: 4 }); hide(cv);
    const pins = (dbl ? [r] : [r, s]).map((z) => hide(G.point(z, 0, { color: 'amber', r: 9, label: '<span class="u5l1-pin">📌</span>', pos: 'n', gap: 2 })));
    const pt = hide(G.point(d.pt[0], d.pt[1], { color: 'ink', r: 7.5, label: T(`(${d.pt[0]},\\ ${d.pt[1]})`), pos: d.pt[1] < 0 ? 'se' : 'ne' }));
    const flat = div(stage, 'u5l1-flat', `${T('a=0')}: ${T('y=0')}, not a parabola!`, 40, 10); hide(flat);
    const st = stamp(stage, '✓ passes through', { ok: true, x: PX + PW / 2, y: 404 }); st.style.opacity = 0;
    const P = div(stage, 'u5l1-pn', '', PX, 0, PW);
    const live = h('div', 'u5l1-live'); P.appendChild(live);
    const sl = h('label', 'u5l1-sl no-ink', `<span class="u5l1-sll">${T('a')}</span><input type="range" min="-4" max="4" step="0.25" aria-label="the value of a"><span class="u5l1-slv"></span>`);
    sl.setAttribute('data-tap', ''); P.appendChild(sl);
    const inp = sl.querySelector('input'), slv = sl.querySelector('.u5l1-slv');
    const rowsEl = h('div', 'u5l1-rows u5l1-rows-s'); P.appendChild(rowsEl);
    const r1 = row(rowsEl, 1, T(d.form)), r2 = row(rowsEl, 2, `${T(d.sub)}<br>so ${T(d.aEq)}`), r3 = row(rowsEl, 3, T(d.fac)), r4 = row(rowsEl, 4, T(d.gen));
    const upd = () => {
      cv._bkDraw();
      const a = S.a, at = Math.round(a * 100) / 100;
      live.innerHTML = T(`a=${tn(at)}`) + ': &nbsp;' + T(`y=${tn(at)}${dbl ? fac(r) + '^2' : fac(r) + fac(s)}`.replace('y=1(', 'y=(').replace('y=-1(', 'y=-('));
      flat.style.opacity = Math.abs(a) < 1e-9 ? 1 : 0;
      inp.value = a; slv.textContent = tn(at).replace('-', '−');
    };
    inp.addEventListener('input', () => { S.a = parseFloat(inp.value); upd(); });
    upd();
    const go = (c, to, ms) => { const a0 = S.a; return tween(c, ms, (u) => { S.a = u >= 1 ? to : a0 + (to - a0) * u; upd(); }); };
    const zt = dbl ? `a double zero at ${T(String(r))}` : `zeros ${T(String(r))} and ${T(String(s))}`;
    return [
      { cap: dbl ? `The graph only touches the axis at ${T('3')}: a <b>double zero</b>, so the factor ${T('(x-3)')} appears twice: ${T(d.form)}. Pin the zero.`
        : `Zeros ${T(String(r))} and ${T(String(s))} give the factors ${T(fac(r))} and ${T(fac(s))}: ${T(d.form)}. Pin the zeros on the axis.`,
        run: async (c) => { for (const p of pins) await popP(c, p); unhide(cv); await G.drawIn(cv, 900, c); await showRow(c, r1); } },
      { cap: `Change ${T('a')}: the parabola stretches, flattens and flips, but the pins never move. Every ${T('a\\ne0')} gives a function with ${zt}.`,
        run: async (c) => { for (const a of d.demo) { await go(c, a, 900); await sleep(c, 250); } } },
      { cap: `One more point fixes ${T('a')}: the graph passes through ${T(`(${d.pt[0]},\\ ${d.pt[1]})`)}. Substitute: ${T(d.sub)}, so ${T(d.aEq)}.`,
        run: async (c) => { await popP(c, pt); await showRow(c, r2); } },
      { cap: `Set ${T(d.aEq)}: now the curve goes through the point ✓. In factored form, ${T(d.fac)}.`,
        run: async (c) => { await go(c, d.aF, 1300); st.style.opacity = ''; await stampIn(c, st); await showRow(c, r3); } },
      { cap: `For general form, expand: ${T(d.gen)}. (Drag the slider for ${T('a')} to try other members of the family.)`,
        run: async (c) => { await showRow(c, r4); await pulse(c, sl, 1.05); } }
    ];
  }
};

/* =============================== explainer: the signal flare (Example 8) =============================== */
const H8 = (t) => -5 * t * t + 25 * t + 30;
const flare = {
  title: 'The signal flare',
  height: 440, minW: 880, capH: 96,
  ask: () => `<b>Example 8:</b> ${T('h(t)=-5t^2+25t+30')}. (a) The zeros: when does the flare reach the sea? (b) What does ${T('h(0)')} mean?`,
  make(stage, v, ex) {
    const W = ex.W, SW = 170, GX = SW + 10, GW = 420, GH = 436, PX = GX + GW + 16, PW = W - PX;
    const G = new Graph(stage, { x: GX, y: 2, width: GW, height: GH, xmin: -2, xmax: 7, ymin: -16, ymax: 70, xstep: 1, ystep: 10, ylabels: 10, xtitle: 't', ytitle: 'h', fontSize: 15, fnArrows: false, pad: [30, 18, 18, 18] });
    const py = (hh) => 2 + G.toPx(0, hh)[1];
    const y0 = py(0), yc = py(30);
    // the scene: heights match the graph's h-axis
    const sc = absSvg(stage, SW, 440, 0, 0, 'u5l1-scene');
    svgEl('rect', { x: 0, y: 0, width: SW, height: y0, fill: '#eaf3fb', rx: 10 }, sc);
    svgEl('rect', { x: 0, y: y0, width: SW, height: 440 - y0, fill: '#5c9bd6' }, sc);
    const wave = svgEl('path', { d: `M0 ${y0} q 10 -6 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0`, fill: 'none', stroke: '#fff', 'stroke-width': 2.5, opacity: 0.8 }, sc);
    svgEl('path', { d: `M0 ${yc} L58 ${yc} L66 ${yc + 30} L60 ${y0 - 40} L70 ${y0} L0 ${y0} Z`, fill: '#8d6e4f', stroke: '#5f4630', 'stroke-width': 2.5 }, sc);
    svgEl('rect', { x: 0, y: yc - 6, width: 60, height: 7, fill: '#6aa84f' }, sc);
    const kid = svgEl('text', { x: 24, y: yc - 4, 'font-size': 30, 'text-anchor': 'middle' }, sc); kid.textContent = '🧍';
    const cl = svgEl('line', { x1: 0, x2: SW, y1: yc, y2: yc, stroke: YC, 'stroke-width': 2.5, 'stroke-dasharray': '7 5' }, sc); cl.style.opacity = 0;
    const fl = svgEl('g', {}, sc);
    svgEl('circle', { r: 8, fill: '#ff6a3d', stroke: '#c93a33', 'stroke-width': 2.5 }, fl);
    svgEl('circle', { r: 3.5, fill: '#ffe08a' }, fl);
    const splash = svgEl('text', { x: 0, y: y0 + 4, 'font-size': 28, 'text-anchor': 'middle' }, sc); splash.textContent = '💦'; splash.style.opacity = 0;
    const FX0 = 62, FXs = (156 - FX0) / 6;
    G.fn(H8, { from: -1.25, to: 6.25, color: '#9aa0ab', width: 2.5, dash: '7 6' });
    const fo = { from: 0, to: 0, color: CURVE, width: 4 };
    const cv = G.fn(H8, fo);
    const dot = svgEl('circle', { r: 7, fill: '#ff6a3d', stroke: '#fff', 'stroke-width': 2 }, G.layers.top);
    const z1 = hide(G.point(-1, 0, { color: 'amber', r: 8.5, label: T('t=-1'), pos: 'nw' })), z2 = hide(G.point(6, 0, { color: 'amber', r: 8.5, label: T('t=6'), pos: 'ne' }));
    const yi = hide(G.point(0, 30, { color: 'green', r: 7.5, label: T('(0,\\ 30)'), pos: 'e' }));
    const stN = stamp(stage, 'Before it was fired', { ok: false, size: 'sm', x: GX + 96, y: py(-9) }); stN.style.opacity = 0;
    const stY = stamp(stage, 'The sea, at 6 s', { ok: true, size: 'sm', x: GX + GW - 64, y: py(-9) }); stY.style.opacity = 0;
    const P = div(stage, 'u5l1-pn', '', PX, 0, PW);
    const rowsEl = h('div', 'u5l1-rows u5l1-rows-s'); P.appendChild(rowsEl);
    const ra = row(rowsEl, 1, `${T('-5t^2+25t+30=0')}<br>${T('-5(t^2-5t-6)=0')}<br>${T('-5(t-6)(t+1)=0')}`);
    const rb = row(rowsEl, 2, `Zeros: ${T('6')} and ${T('-1')}`);
    const rc = row(rowsEl, 3, `Reject ${T('t=-1')}. The flare reaches the sea after <b>6 s</b>.`);
    const rd = row(rowsEl, 4, `(b) ${T('h(0)=30')}: fired from <b>30 m</b> up (the cliff).`);
    const setT = (t) => {
      const hh = H8(t), y = py(Math.max(hh, -2));
      fl.setAttribute('transform', `translate(${FX0 + FXs * t} ${y})`);
      const [px, pyy] = G.toPx(t, hh); dot.setAttribute('cx', px); dot.setAttribute('cy', pyy);
      if (t > fo.to) { fo.to = t; cv._bkDraw(); }
    };
    setT(0);
    return [
      { cap: `(a) The flare is at sea level when ${T('h(t)=0')}. Factor: ${T('-5t^2+25t+30=-5(t^2-5t-6)=-5(t-6)(t+1)')}.`,
        run: (c) => showRow(c, ra) },
      { cap: `Each factor gives a zero: ${T('t=6')} and ${T('t=-1')}. The graph (the whole parabola, dashed) meets the ${T('t')}-axis at both.`,
        run: async (c) => { await Promise.all([popP(c, z1), popP(c, z2)]); await showRow(c, rb); } },
      { cap: `${T('t=-1')} would be one second <b>before</b> the flare was fired: that part of the parabola never happens. Reject it.`,
        run: async (c) => { stN.style.opacity = ''; await stampIn(c, stN); await shake(c, z1); } },
      { cap: `Fire! The flare leaves the cliff at ${T('t=0')}, rises, falls past the cliff and hits the sea at ${T('t=6')} s.`,
        run: async (c) => {
          await tween(c, 3200, (u) => setT(6 * u), linear);
          splash.setAttribute('x', FX0 + FXs * 6); splash.style.opacity = ''; await pop(c, splash);
          stY.style.opacity = ''; await stampIn(c, stY); await showRow(c, rc);
        } },
      { cap: `(b) ${T('h(0)=-5(0)^2+25(0)+30=30')}: the ${T('y')}-intercept (here the ${T('h')}-intercept) is the starting height. The flare is fired from <b>30 m</b> above the sea: the cliff is 30 m high.`,
        run: async (c) => { await popP(c, yi); cl.style.opacity = ''; await fadeIn(c, cl, 400); await showRow(c, rd); } }
    ];
  }
};

/* =============================== Math History: why "root"? (SMIL, replayable) =============================== */
(function history() {
  const svg = document.getElementById('u5l1-hist'); if (!svg) return;
  const fade = (b, d = 0.7) => `<animate attributeName="opacity" from="0" to="1" begin="${b}s" dur="${d}s" fill="freeze"/>`;
  const grow = (len, b, d) => `<animate attributeName="stroke-dashoffset" from="${len}" to="0" begin="${b}s" dur="${d}s" fill="freeze"/>`;
  const GY = 196;
  let s = '<rect x="0" y="0" width="600" height="300" rx="18" fill="#fffaf1"/>'
    + `<rect x="0" y="${GY}" width="600" height="${300 - GY}" fill="#c9a77d"/><rect x="0" y="${GY}" width="600" height="6" fill="#8a6440"/>`;
  // the plant: a stem and leaves grow up, the roots grow down
  const stem = `M300 ${GY} C 298 170, 304 150, 300 118`;
  s += `<path d="${stem}" fill="none" stroke="#4f8a3a" stroke-width="6" stroke-linecap="round" stroke-dasharray="90" stroke-dashoffset="90">${grow(90, 0.3, 1.2)}</path>`;
  s += `<g opacity="0">${fade(1.3)}<path d="M300 150 q -34 -18 -46 -2 q 24 14 46 2 z" fill="#6aa84f"/><path d="M300 132 q 32 -20 46 -6 q -22 16 -46 6 z" fill="#6aa84f"/><circle cx="300" cy="112" r="9" fill="#e0a11b"/></g>`;
  const roots = [`M300 ${GY + 2} C 296 222, 270 236, 244 262`, `M300 ${GY + 2} C 304 226, 330 240, 360 268`, `M300 ${GY + 2} C 300 236, 296 256, 300 286`, `M276 228 C 262 232, 250 228, 236 236`, `M326 232 C 340 236, 352 232, 366 242`];
  roots.forEach((d, i) => { s += `<path d="${d}" fill="none" stroke="#7a4a26" stroke-width="${i < 3 ? 4.5 : 3}" stroke-linecap="round" stroke-dasharray="120" stroke-dashoffset="120">${grow(120, 1.6 + i * 0.25, 1.4)}</path>`; });
  // the words: jidhr (Arabic, about 820) → radix (Latin, 1145) → root (English)
  const W3 = [[100, 'جذر', 'jidhr', 'Arabic · about 820', 3.2], [300, 'radix', '', 'Latin · 1145', 4.9], [500, 'root', '', 'English · 1728', 6.6]];
  W3.forEach(([x, w, tr, lab, b], i) => {
    s += `<g opacity="0">${fade(b)}<rect x="${x - 82}" y="22" width="164" height="${tr ? 84 : 70}" rx="12" fill="#f3dfb1" stroke="#b07a12" stroke-width="2.5"/>`
      + `<text x="${x}" y="62" text-anchor="middle" font-family="Georgia, serif" font-size="${i ? 30 : 32}" font-weight="700" fill="#4a2c14">${w}</text>`
      + (tr ? `<text x="${x}" y="84" text-anchor="middle" font-family="Georgia, serif" font-size="16" font-style="italic" fill="#7a4a26">${tr}</text>` : '')
      + `<text x="${x}" y="${tr ? 100 : 84}" text-anchor="middle" font-family="Georgia, serif" font-size="14" fill="#7a4a26">${lab}</text></g>`;
    if (i) s += `<g opacity="0">${fade(b - 0.5, 0.5)}<path d="M${x - 118} 56 L${x - 90} 56" stroke="#b07a12" stroke-width="4" stroke-linecap="round"/><path d="M${x - 96} 49 L${x - 87} 56 L${x - 96} 63" fill="none" stroke="#b07a12" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></g>`;
  });
  s += `<g opacity="0">${fade(8.2)}<text x="300" y="${GY - 18}" text-anchor="middle" font-family="Georgia, serif" font-size="17" fill="#4a2c14" dx="120">the hidden part that holds it up</text></g>`;
  svg.innerHTML = s;
  const play = () => { try { svg.setCurrentTime(0); svg.unpauseAnimations(); } catch (e) { /* no SMIL */ } };
  svg.addEventListener('click', play);
  const btn = svg.closest('.hist-anim') && svg.closest('.hist-anim').querySelector('.hist-play'); if (btn) btn.addEventListener('click', play);
})();

/* =============================== Stand Up Break =============================== */
/* BEG: the roots of x² + bx + c = 0 (a = 1). PRG: ax² + bx = d (standard form first, then the X; fraction roots).
 * MAS: write a quadratic function from its zeros and one more point, in factored and general form. */
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const frac = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = gcd(Math.abs(n), d) || 1; n /= g; d /= g; return d === 1 ? String(n) : (n < 0 ? '-' : '') + `\\frac{${Math.abs(n)}}{${d}}`; };
const term = (co, v, first) => { if (co === 0) return ''; const s = co < 0 ? '-' : first ? '' : '+', m = Math.abs(co); return s + (m === 1 && v ? '' : m) + v; };
const poly = (a, b, c) => (term(a, 'x^2', true) + term(b, 'x') + term(c, '')) || '0';
const lin = (m, n) => `(${m === 1 ? '' : m}x${n < 0 ? '-' + -n : '+' + n})`;
standup('u5l1', {
  intro: 'At your whiteboard: one side equal to 0, factor fully, then each factor equal to 0.',
  levels: {
    BEG: (r) => {
      let p, q; do { p = r.int(-9, 9); q = r.int(-9, 9); } while (!p || !q || p === -q || p === q);
      return { text: 'Find the roots of the equation.', q: `${poly(1, -(p + q), p * q)}=0`,
        a: [`${fac(p)}${fac(q)}=0`, `x=${p}\\ \\text{or}\\ x=${q}`] };
    },
    PRG: (r) => {
      for (;;) {
        const m = r.pick([2, 3, 4]), n = r.pick([-5, -3, -1, 1, 3, 5]), k = r.int(-6, 6);
        if (!k || gcd(m, n) !== 1) continue;
        // (mx + n)(x + k) = m x² + (mk + n) x + nk ; move the constant to the right side
        const A = m, B = m * k + n, C = n * k;
        if (!B) continue;
        return { text: 'Find the roots of the equation.', q: `${poly(A, B, 0)}=${-C}`,
          a: [`${poly(A, B, C)}=0`, `${lin(m, n)}${fac(-k)}=0`, `x=${frac(-n, m)}\\ \\text{or}\\ x=${-k}`] };
      }
    },
    MAS: (r) => {
      for (;;) {
        const z1 = r.int(-6, 5), z2 = r.int(z1 + 1, 7), a = r.pick([-3, -2, -1, 2, 3]), x0 = r.int(-3, 6);
        if (x0 === z1 || x0 === z2) continue;
        const y0 = a * (x0 - z1) * (x0 - z2), k = (x0 - z1) * (x0 - z2);
        const aa = a === 1 ? '' : a === -1 ? '-' : a;
        return { text: `Write the quadratic function with zeros ${tex(String(z1))} and ${tex(String(z2))} whose graph passes through ${tex(`(${x0},\\ ${y0})`)}, in factored form and in general form.`, q: '',
          a: [`y=a${fac(z1)}${fac(z2)}`, `${y0}=a(${x0}${-z1 < 0 ? -z1 : '+' + -z1})(${x0}${-z2 < 0 ? -z2 : '+' + -z2})=${k}a`, `a=${a}`, `y=${aa}${fac(z1)}${fac(z2)}`, `y=${poly(a, -a * (z1 + z2), a * z1 * z2)}`] };
      }
    }
  }
});

/* =============================== mount =============================== */
export const explainers = mountExplainers({ parts, views, factor, slide, family, flare });
export const _test = { fV, H8, poly, fac };
