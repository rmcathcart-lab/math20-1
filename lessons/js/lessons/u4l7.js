/* Math 20-1 · Unit 4 · Lesson 7 — Radical Equations That Lead to Quadratics (no calculator demos; the intersect check is
 * shown only as keycaps on a calculator-style graph).
 * Warm-up (The Patio Builder: a square of x tiles plus one extra row of √x tiles; 42 tiles in all → x + √x = 42),
 * Example 5's graph (the dashed ghost line y = 3 − x and (1, 2) appear with the answer), Example 8(b)'s board,
 * and the explainers:
 *   binSq (square a binomial in a 2 × 2 grid: the corners a², b², the two equal middle cells make 2ab; the x² + 4 trap
 *     tested with x = 5; (3√x)² as one cell; Example 1 checks),
 *   restrict2 (both sides graphed: the radicand gives the curve's domain, the curve never goes below the x-axis so it can
 *     only meet the line where B ≥ 0; the two conditions and their overlap on a number line; Example 2 checks),
 *   solve (the five-step rail: restrictions, isolate, square, factor, check each root with a check card and a stamp;
 *     Example 3 and 4 checks, including 4(c) where both roots are valid),
 *   ghost (STAR: y = √(x + 3) and y = x − 3 cross once; the squared equation's line and parabola cross twice; at x = 1
 *     the original graphs are 4 apart; the line flips over the x-axis to the dashed ghost y = 3 − x, which meets the curve
 *     at (1, 2): that is where the extraneous root comes from. Also Example 3 and Example 4(c) (no ghost root)),
 *   calcCheck (a calculator-style screen with key presses as keycaps only: Y=, WINDOW, GRAPH, 2nd TRACE 5: intersect;
 *     Examples 5, 6, 7(a)),
 *   twoWays (x + √x = 12 by squaring and by u = √x side by side; u = −4 rejected on a u-number line; the ghost x = 16 is
 *     the rejected u squared; also the warm-up patio x + √x = 42 and x + 2√x = 15),
 *   twice (squaring twice with a "radicals left" meter and the (1 + √B)² grid whose middle cell is the radical that
 *     remains; Example 7 checks),
 *   admiss (root, extraneous or inadmissible: three bins; Example 8(a), 8(b) with the board drawn to scale, and a sort of
 *     candidates from Examples 3, 4(c), 7(b), 8).
 * Colours: the radical side purple, the other side blue, squaring / middle terms amber, valid green, extraneous red
 *   (the ghost line red dashed), inadmissible orange. */
import {
  h, tex, add, box, Graph, NumberLine, stamp, stampIn, checkCard, mountExplainers, pop, fadeIn, tween, anim,
  svgEl, pulse, shake, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const RAD = COLORS.purple, NUM = COLORS.blue, SQ = COLORS.amber, OK = COLORS.green, NO = COLORS.red, INA = '#d9730d';
const cR = (s) => `\\textcolor{${RAD}}{${s}}`, cN = (s) => `\\textcolor{${NUM}}{${s}}`, cS = (s) => `\\textcolor{${SQ}}{${s}}`;
const cO = (s) => `\\textcolor{${OK}}{${s}}`, cX = (s) => `\\textcolor{${NO}}{${s}}`;
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const fadeOut = (c, el) => anim(c, el, [{ opacity: 1 }, { opacity: 0 }], 260);
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
const panel = (stage, x, y, w, hh, title, cls = '') => div(stage, 'u4l7-panel ' + cls, title ? `<div class="u4l7-ph">${title}</div>` : '', x, y, w, hh);
const lineIn = (p, html, cls = '') => { const d = h('div', 'u4l7-line ' + cls, html); p.appendChild(d); hide(d); return d; };
/* a work line: maths, plus an optional note on the right ("square both sides") */
const workLine = (p, t, note, cls = '') => lineIn(p, `<span class="u4l7-lt">${T(t)}</span>${note ? `<span class="u4l7-note">${note}</span>` : ''}`, 'u4l7-wl ' + cls);
const stampAt = (host, text, ok, x, y, o = {}) => hide(stamp(host, text, Object.assign({ ok, x, y }, o)));
const drawOn = (c, B, el, ms = 700) => { el.style.opacity = ''; return B.drawIn(el, ms, c); };
const hideP = (p) => { hide(p); if (p.label) hide(p.label); return p; };
const popP = (c, p) => Promise.all([pop(c, p), p.label ? show(c, p.label) : null]);
const lab = (G, x, y, t, color, pos = 'c', extra = {}) => hide(G.label(x, y, t, Object.assign({ tex: true, color, cls: 'bk-ptlab', pos }, extra)));
const keys = (...ks) => `<span class="keys">${ks.map((k) => `<kbd>${k}</kbd>`).join('')}</span>`;

/* ====================================================================================================
 * Warm-up: The Patio Builder. A square of n × n tiles plus one extra row of n tiles.
 * ==================================================================================================== */
function mountPatio() {
  const host = document.getElementById('u4l7-patio'); if (!host) return;
  const W = 540, H = 380, S = 40, G = 3, MAX = 7, OX = 18, OY = 18;
  const svg = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u4l7-patiosvg' }, host);
  svgEl('rect', { x: 0, y: 0, width: W, height: H, rx: 14, fill: '#e3edd6' }, svg);
  for (let i = 0; i < 60; i++) { const x = (i * 89) % W, y = (i * 47) % H; svgEl('line', { x1: x, y1: y, x2: x + 3, y2: y - 7, stroke: '#9fbf86', 'stroke-width': 2, 'stroke-linecap': 'round' }, svg); }
  const tiles = svgEl('g', {}, svg);
  const cnt = div(host, 'u4l7-pcount', '', 352, 26, 170);
  let n = 2;
  const paint = () => {
    tiles.innerHTML = '';
    for (let r = 0; r <= n; r++) for (let q = 0; q < n; q++) {
      const row = r === n, x = OX + q * (S + G), y = OY + r * (S + G);
      svgEl('rect', { x, y, width: S, height: S, rx: 4, fill: row ? '#e8c27a' : '#c7643f', stroke: row ? '#a77d2c' : '#8f3f22', 'stroke-width': 2 }, tiles);
    }
    const side = OX + n * (S + G) - G;
    svgEl('line', { x1: side + 10, x2: side + 10, y1: OY, y2: OY + n * (S + G) - G, stroke: '#1c2230', 'stroke-width': 2 }, tiles);
    const t = svgEl('text', { x: side + 18, y: OY + (n * (S + G)) / 2 + 6, 'font-size': 18, 'font-weight': 800, fill: '#1c2230' }, tiles); t.textContent = n;
    cnt.innerHTML = `<div class="u4l7-pc u4l7-pcsq"><b>${n * n}</b> in the square<span>${n} × ${n}</span></div><div class="u4l7-pc u4l7-pcrow"><b>${n}</b> in the row</div><div class="u4l7-pc u4l7-pctot"><b>${n * n + n}</b> tiles in all</div>`;
  };
  const set = (v) => { n = Math.max(1, Math.min(MAX, v)); paint(); };
  document.getElementById('u4l7-pminus').addEventListener('click', () => set(n - 1));
  document.getElementById('u4l7-pplus').addEventListener('click', () => set(n + 1));
  const bRev = document.getElementById('u4l7-preveal');
  if (bRev) {
    bRev.addEventListener('click', () => set(6));
    const poll = bRev.closest('.poll');
    new MutationObserver(() => { if (poll.classList.contains('revealed') && n !== 6) set(6); }).observe(poll, { attributes: true, attributeFilter: ['class'] });
  }
  paint();
}

/* =============================== Example 5's graph and Example 8(b)'s board (static, on the cards) =============================== */
function mountCardFigures() {
  const g = document.getElementById('u4l7-ex5g');
  if (g) {
    const G = new Graph(g, { width: 350, height: 310, xmin: -4, xmax: 8, ymin: -4, ymax: 6, xlabels: 2, ylabels: 2, fontSize: 15 });
    G.fn((x) => 3 - x, { color: NO, width: 3, dash: '8 6', cls: 'u4l7-ga' });
    G.fn((x) => Math.sqrt(x + 3), { from: -3, color: RAD, width: 3.5 });
    G.fn((x) => x - 3, { color: NUM, width: 3.5 });
    G.point(-3, 0, { color: RAD, r: 5 });
    G.point(6, 3, { color: 'ink', r: 6 });
    G.label(5.1, 5.4, 'y=x-3', { tex: true, color: NUM, cls: 'bk-ptlab', pos: 'w' });
    G.label(3.9, 3.2, 'y=\\sqrt{x+3}', { tex: true, color: RAD, cls: 'bk-ptlab', pos: 'n' });
    G.point(1, 2, { color: NO, r: 6, cls: 'u4l7-ga', label: T('(1,\\ 2)'), pos: 'ne', labelCls: 'u4l7-ga' });
    G.label(6.6, 3, T('(6,\\ 3)'), { cls: 'bk-ptlab u4l7-ga', pos: 'se' });
    G.label(4.2, -3, 'y=3-x', { tex: true, color: NO, cls: 'bk-ptlab u4l7-ga', pos: 'e' });
  }
  const b = document.getElementById('u4l7-board');
  if (b) {
    const W = 240, H = 170, x0 = 20, y0 = 20, w = 176, hh = 132;
    const svg = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}` }, b);
    svgEl('rect', { x: x0, y: y0, width: w, height: hh, rx: 10, fill: '#e2c08d', stroke: '#8a6232', 'stroke-width': 3 }, svg);
    svgEl('circle', { cx: x0 + w - 18, cy: y0 + 18, r: 7, fill: '#fff', stroke: '#8a6232', 'stroke-width': 2.5 }, svg);
    svgEl('line', { x1: x0, y1: y0 + hh, x2: x0 + w, y2: y0, stroke: '#1c2230', 'stroke-width': 2.5, 'stroke-dasharray': '7 6' }, svg);
    div(b, 'u4l7-blab', T('x+10'), x0 + w / 2 - 30, y0 + hh + 2);
    div(b, 'u4l7-blab', T('x'), x0 + w + 4, y0 + hh / 2 - 14);
    div(b, 'u4l7-blab u4l7-bdiag', T('x+20'), x0 + w / 2 - 34, y0 + hh / 2 - 34);
  }
}

/* =============================== the 2 × 2 grid for squaring a binomial =============================== */
/* heads: TeX for the column/row headers; cells: TeX per cell (null = 1 × 1 grid). Returns { el, hdr, cells } */
function sqGrid(stage, x, y, heads, cw, ch, hw = 86, hh = 50) {
  const n = heads.length, el = div(stage, 'u4l7-grid', '', x, y, hw + n * cw, hh + n * ch);
  const hdr = [];
  heads.forEach((t, i) => {
    hdr.push(div(el, 'u4l7-gh', T(t), hw + i * cw, 0, cw, hh));
    hdr.push(div(el, 'u4l7-gh u4l7-ghr', T(t), 0, hh + i * ch, hw, ch));
  });
  const cells = heads.map((_, r) => heads.map((__, q) => div(el, 'u4l7-gc' + (r === q ? ' u4l7-gcd' : ' u4l7-gco'), '', hw + q * cw, hh + r * ch, cw, ch)));
  return { el, hdr, cells };
}
const fillCell = (c, cell, t) => { cell.innerHTML = `<span class="u4l7-gct">${T(t)}</span>`; return pop(c, cell.firstChild); };

/* =============================== explainer: squaring a binomial =============================== */
const BS = {
  trap: { label: '(x − 2)²: the trap', expr: '(x-2)^2', a: 'x', b: '2', s: -1, a2: 'x^2', ab: '2x', twoab: '4x', b2: '4', res: ['x^2-4x+4'], trap: true },
  a: { label: 'Example 1(a)', expr: '(x-3)^2', a: 'x', b: '3', s: -1, a2: 'x^2', ab: '3x', twoab: '6x', b2: '9', res: ['x^2-6x+9'] },
  b: { label: '(b)', expr: '(2x+5)^2', a: '2x', b: '5', s: 1, a2: '4x^2', ab: '10x', twoab: '20x', b2: '25', res: ['4x^2+20x+25'] },
  c: { label: '(c)', expr: '(6-x)^2', a: '6', b: 'x', s: -1, a2: '36', ab: '6x', twoab: '12x', b2: 'x^2', res: ['36-12x+x^2', 'x^2-12x+36'], re: 'descending powers of x' },
  d: { label: '(d)', expr: '\\left(2+\\sqrt{x}\\right)^2', a: '2', b: '\\sqrt{x}', s: 1, a2: '4', ab: '2\\sqrt{x}', twoab: '4\\sqrt{x}', b2: 'x', res: ['4+4\\sqrt{x}+x', 'x+4\\sqrt{x}+4'], re: 'the usual order' },
  e: { label: '(e)', expr: '\\left(3\\sqrt{x}\\right)^2', single: true, k: '3', r: '\\sqrt{x}', res: ['9x'] },
  f: { label: '(f)', expr: '\\left(\\sqrt{x+1}-3\\right)^2', a: '\\sqrt{x+1}', b: '3', s: -1, a2: '(x+1)', ab: '3\\sqrt{x+1}', twoab: '6\\sqrt{x+1}', b2: '9', res: ['(x+1)-6\\sqrt{x+1}+9', 'x+10-6\\sqrt{x+1}'], re: 'collect the numbers: 1 + 9 = 10' }
};
const binSq = {
  title: 'Squaring a binomial: don’t lose the middle term',
  height: 410, minW: 900,
  choices: [{ v: 'trap', label: BS.trap.label }, { sep: 'Check:' }, ...['a', 'b', 'c', 'd', 'e', 'f'].map((k) => ({ v: k, label: BS[k].label }))],
  ask: (v) => (v === 'trap' ? `Is ${T('(x-2)^2')} the same as ${T('x^2+4')}?` : `Example 1(${v}): expand and simplify ${T(BS[v].expr)}.`),
  make(stage, v, ex) {
    const d = BS[v], W = ex.W, GX = 14, PX = 500;
    const P = panel(stage, PX, 6, W - PX - 6, 398, '', 'u4l7-big');
    if (d.single) {
      const top = div(stage, 'u4l7-eq u4l7-eqg', T(`${d.expr}=\\left(${d.k}${d.r}\\right)\\left(${d.k}${d.r}\\right)`), GX, 8);
      const g = sqGrid(stage, GX + 60, 90, [`${d.k}${d.r}`], 230, 150, 120, 56); g.hdr.forEach(hide);
      const l1 = workLine(P, `${d.expr}=${cS(`${d.k}^2`)}\\cdot${cR(`\\left(${d.r}\\right)^2`)}`, 'square each factor');
      const l2 = workLine(P, `=${cS('9')}\\cdot${cR('x')}`, '');
      const l3 = workLine(P, `=${d.res[0]}`, '', 'u4l7-xans');
      const note = lineIn(P, `One term, not a binomial: no middle term. ${T('\\left(k\\sqrt{A}\\right)^2=k^2A')}.`, 'u4l7-tipline');
      return [
        { cap: `${T(d.expr)} has only <b>one term</b>: it is ${T(`${d.k}${d.r}`)} times itself.`, run: async (c) => { await show(c, top); for (const e of g.hdr) await show(c, e); } },
        { cap: `Square the ${T(d.k)} and square the root: ${T('3^2=9')} and ${T('\\left(\\sqrt{x}\\right)^2=x')}.`, run: async (c) => { await fillCell(c, g.cells[0][0], `${cS('9')}${cR('x')}`); await show(c, l1); await show(c, l2); } },
        { cap: `${T(`${d.expr}=${d.res[0]}`)}. No middle term, because there is no second term.`, run: async (c) => { await show(c, l3); await show(c, note); } }
      ];
    }
    const bS = (d.s < 0 ? '-' : '+') + d.b, sg = d.s < 0 ? '-' : '+';
    const top = div(stage, 'u4l7-eq u4l7-eqg' + (d.a.length > 5 ? ' u4l7-eqsm' : ''), T(`${d.expr}=\\left(${d.a}${bS}\\right)\\left(${d.a}${bS}\\right)`), GX, 8);
    const g = sqGrid(stage, GX, 70, [d.a, bS], 190, 112); g.hdr.forEach(hide);
    const brace = hide(div(stage, 'u4l7-mid', `two equal cells: ${T(`${sg}${cS(d.twoab)}`)}`, GX + 86, 70 + 50 + 224 + 8, 380));
    const wrong = d.trap ? lineIn(P, `Tempting: ${T('(x-2)^2=x^2+4')} <b class="u4l7-xr">✗?</b>`, 'u4l7-xline') : null;
    const l1 = workLine(P, `(a${sg}b)^2=a^2${sg}${cS('2ab')}+b^2`, 'the pattern');
    const l2 = workLine(P, `=${d.a2}${sg}${cS(`2(${d.a})(${d.b})`)}+${d.b2}`, `${T(`a=${d.a},\\ b=${d.b}`)}`);
    const l3 = workLine(P, `=${d.res[0]}`, '', d.res.length > 1 ? '' : 'u4l7-xans');
    const l4 = d.res.length > 1 ? workLine(P, `=${d.res[1]}`, '', 'u4l7-xans') : null;
    const t1 = d.trap ? lineIn(P, `Test ${T('x=5')}: ${T('(5-2)^2=9')}, but ${T('5^2+4=29')}.`, 'u4l7-xline') : null;
    const t2 = d.trap ? lineIn(P, `${T('5^2-4(5)+4=25-20+4=9')} ✓`, 'u4l7-okline') : null;
    const corners = async (c) => { await fillCell(c, g.cells[0][0], cR(d.a2)); await fillCell(c, g.cells[1][1], `+${d.b2}`); };
    const middles = async (c) => { await fillCell(c, g.cells[0][1], `${sg}${cS(d.ab)}`); await fillCell(c, g.cells[1][0], `${sg}${cS(d.ab)}`); g.cells[0][1].classList.add('on'); g.cells[1][0].classList.add('on'); await show(c, brace); };
    const setup = async (c) => { await show(c, top); for (const e of g.hdr) await show(c, e); };
    if (d.trap) {
      return [
        { cap: `Tempting: square each term and write ${T('x^2+4')}. Let's see if that is right.`, run: (c) => show(c, wrong) },
        { cap: `Squaring means multiplying by itself: ${T('(x-2)(x-2)')}. Every term meets every term: a 2-by-2 grid.`, run: setup },
        { cap: `The corners: ${T('x\\cdot x=x^2')} and ${T('(-2)(-2)=+4')}. These are the only two terms in ${T('x^2+4')}.`, run: corners },
        { cap: `The other two cells: ${T('x(-2)=-2x')}, twice. ${T('x^2+4')} <b>forgot</b> the middle term ${T('-4x')}.`, run: async (c) => { await middles(c); g.cells[0][1].classList.add('miss'); g.cells[1][0].classList.add('miss'); await shake(c, wrong); } },
        { cap: `Add the four cells: ${T('(x-2)^2=x^2-4x+4')}.`, run: async (c) => { await show(c, l1); await show(c, l2); await show(c, l3); } },
        { cap: `Test with a number, ${T('x=5')}: ${T('(5-2)^2=9')}. The pattern gives 9; ${T('x^2+4')} gives 29. <b>Not the same.</b>`, run: async (c) => { await show(c, t1); await show(c, t2); } }
      ];
    }
    const steps = [
      { cap: `Squaring means multiplying by itself: ${T(`\\left(${d.a}${bS}\\right)\\left(${d.a}${bS}\\right)`)}. Every term meets every term.`, run: setup },
      { cap: `The corners: ${T(`a^2=${d.a2}`)} and ${T(`b^2=${d.b2}`)}.`, run: corners },
      { cap: `The other two cells are the same, ${T(`${sg}${d.ab}`)} each. Together they make the <b>middle term</b> ${T(`${sg}2ab=${sg}${d.twoab}`)}.`, run: middles },
      { cap: `Add the four cells: ${T(`${d.expr}=${d.res[0]}`)}.`, run: async (c) => { await show(c, l1); await show(c, l2); await show(c, l3); } }
    ];
    if (l4) steps.push({ cap: `Simplify (${d.re}): ${T(d.res[1])}.`, run: (c) => show(c, l4) });
    return steps;
  }
};

/* =============================== explainer: the two restrictions =============================== */
const RS = {
  a: { label: 'Example 2(a)', eq: '\\sqrt{x+12}=x', A: 'x+12', B: 'x', fA: (x) => Math.sqrt(x + 12), from: -12, fB: (x) => x,
    rA: ['x+12\\ge0', 'x\\ge-12'], rB: ['x\\ge0'], aB: -12, aD: 1, bB: 0, bD: 1, both: 'x\\ge0', oB: 0, oD: 1, win: [-14, 8, -6, 6],
    fl: [-8.5, 3.6, 'n'], gl: [4.6, 2.2, 'e'], bl: 1 },
  b: { label: '(b)', eq: '\\sqrt{3x+4}=x-2', A: '3x+4', B: 'x-2', fA: (x) => Math.sqrt(3 * x + 4), from: -4 / 3, fB: (x) => x - 2,
    rA: ['3x+4\\ge0', 'x\\ge-\\tfrac{4}{3}'], rB: ['x-2\\ge0', 'x\\ge2'], aB: -4 / 3, aD: 1, bB: 2, bD: 1, both: 'x\\ge2', oB: 2, oD: 1, win: [-3, 9, -5, 6],
    fl: [4.6, 5.4, 'w'], gl: [5.4, 1.4, 'e'], bl: 1 },
  c: { label: '(c)', eq: '\\sqrt{10-3x}+2=4-x', iso: '\\sqrt{10-3x}=2-x', A: '10-3x', B: '2-x', fA: (x) => Math.sqrt(10 - 3 * x), to: 10 / 3, fB: (x) => 2 - x,
    rA: ['10-3x\\ge0', 'x\\le\\tfrac{10}{3}'], rB: ['2-x\\ge0', 'x\\le2'], aB: 10 / 3, aD: -1, bB: 2, bD: -1, both: 'x\\le2', oB: 2, oD: -1, win: [-6, 5, -4, 6],
    fl: [-5.6, 2.8, 'e'], gl: [4.4, -2.5, 'sw'], bl: -1 }
};
const restrict2 = {
  title: 'Two restrictions: radicand ≥ 0 and the other side ≥ 0',
  height: 440, minW: 900,
  choices: [{ sep: 'Check:' }, ...Object.keys(RS).map((k) => ({ v: k, label: RS[k].label }))],
  ask: (v) => `Example 2(${v}): state the restrictions on ${T('x')} for ${T(RS[v].eq)}.`,
  make(stage, v, ex) {
    const d = RS[v], W = ex.W, GW = 540, [x0, x1, y0, y1] = d.win;
    const G = new Graph(stage, { x: 4, y: 18, width: GW, height: 286, xmin: x0, xmax: x1, ymin: y0, ymax: y1, xlabels: 2, ylabels: 2, fontSize: 15 });
    const N = new NumberLine(stage, { x: 4, y: 306, width: GW, height: 130, min: x0, max: x1, step: 1, labelStep: 2, axisY: 100, fontSize: 16 });
    const P = panel(stage, GW + 18, 6, W - GW - 24, 428, '', 'u4l7-big2');
    const eqT = d.iso || d.eq;
    const sideT = `\\sqrt{${cR(d.A)}}=${cN(d.B)}`;
    lineIn(P, T(d.iso ? d.eq : sideT), 'u4l7-eq').style.opacity = 1;
    const lIso = d.iso ? workLine(P, sideT, 'isolate first') : null;
    const lA = workLine(P, `${cR(d.rA[0])}${d.rA[1] ? '\\Rightarrow ' + d.rA[1] : ''}`, 'radicand');
    const lB = workLine(P, d.rB.length > 1 ? `${cN(d.rB[0])}\\Rightarrow ${d.rB[1]}` : cN(d.rB[0]), 'other side');
    const lO = lineIn(P, `Together: ${T(`\\boldsymbol{${d.both}}`)}`, 'u4l7-okline u4l7-bigok');
    // the graph
    const below = hide(G.polyline([[x0, 0], [x1, 0], [x1, y0], [x0, y0]], { closed: true, fill: '#c93a33', fillOpacity: 0.07, color: 'rgba(0,0,0,0)', width: 0.1 }));
    const belowL = d.bl > 0 ? lab(G, x1 - 0.3, y0 + 0.4, '\\text{a square root never goes here}', NO, 'nw') : lab(G, x0 + 0.3, y0 + 0.4, '\\text{a square root never goes here}', NO, 'ne');
    const fo = { color: RAD, width: 4 }; if (d.from != null) fo.from = d.from; if (d.to != null) fo.to = d.to;
    const f = hide(G.fn(d.fA, fo)), fp = hideP(G.point(d.from != null ? d.from : d.to, 0, { color: RAD, r: 6 }));
    const g = hide(G.fn(d.fB, { color: NUM, width: 3.5 }));
    const fL = lab(G, d.fl[0], d.fl[1], `y=\\sqrt{${d.A}}`, RAD, d.fl[2]), gL = lab(G, d.gl[0], d.gl[1], `y=${d.B}`, NUM, d.gl[2]);
    // the part of the line below the axis (B < 0)
    const zx = d.bB, neg = d.bD > 0 ? [Math.max(x0, x0), zx] : [zx, x1];
    const gNeg = hide(G.fn(d.fB, { from: neg[0], to: neg[1], color: NO, width: 7, arrows: false }));
    // number line
    const iv = (b, dir, color, lift, w) => hide(dir > 0 ? N.interval(b, Infinity, { color, lift, width: w }) : N.interval(-Infinity, b, { color, lift, width: w }));
    const nA = iv(d.aB, d.aD, RAD, 68, 6), nB = iv(d.bB, d.bD, NUM, 38, 6), nO = iv(d.oB, d.oD, OK, 0, 11);
    const tagAt = (b, dir, lift, html, cls) => { const px = 4 + N.toPx(b); return hide(div(stage, 'u4l7-ivlab ' + (cls || ''), html, dir > 0 ? px + 12 : Math.max(4, px - 170), 306 + 100 - lift - 34)); };
    const tA = tagAt(d.aB, d.aD, 68, T(d.rA[d.rA.length - 1]), 'u4l7-ivr'), tB = tagAt(d.bB, d.bD, 38, T(d.rB[d.rB.length - 1]), 'u4l7-ivb');
    const steps = [];
    if (d.iso) steps.push({ cap: `First <b>isolate</b> the radical: subtract 2 from both sides, ${T(d.iso)}.`, run: (c) => show(c, lIso) });
    steps.push(
      { cap: `Graph both sides of ${T(eqT)}: the radical side ${T(cR(`y=\\sqrt{${d.A}}`))} and the other side ${T(cN(`y=${d.B}`))}.`,
        run: async (c) => { await popP(c, fp); await drawOn(c, G, f, 800); await show(c, fL); await drawOn(c, G, g, 600); await show(c, gL); } },
      { cap: `<b>Radicand ≥ 0:</b> ${T(`${d.rA[0]}`)}, so ${T(d.rA[d.rA.length - 1])}. That is where the curve exists.`,
        run: async (c) => { await show(c, lA); await drawOn(c, N, nA, 600); await show(c, tA); } },
      { cap: `A square root is <b>never negative</b>: the curve stays on or above the ${T('x')}-axis. It can only meet the line where the line is too: ${T(`${d.B}\\ge0`)}.`,
        run: async (c) => { await show(c, below); await show(c, belowL); await drawOn(c, G, gNeg, 500); await show(c, lB); await drawOn(c, N, nB, 600); await show(c, tB); } },
      { cap: `<b>Both</b> must be true: keep the overlap, ${T(d.both)}.`, run: async (c) => { await drawOn(c, N, nO, 600); await show(c, lO); } }
    );
    return steps;
  }
};

/* =============================== explainer: isolate, square, factor, check =============================== */
const SV = {
  e3: { label: 'Example 3', eq: '\\sqrt{x+12}=x', R: 'x+12\\ge0,\\ x\\ge0\\ \\Rightarrow\\ x\\ge0', Rshort: 'x\\ge0', iso: [], sq: [['x+12=x^2', 'square both sides']],
    fac: ['x^2-x-12=0', '(x-4)(x+3)=0', 'x=4\\ \\text{or}\\ x=-3'],
    roots: [{ x: '4', L: ['\\sqrt{4+12}', '\\sqrt{16}', '4'], R: ['4'], ok: true }, { x: '-3', L: ['\\sqrt{-3+12}', '\\sqrt{9}', '3'], R: ['-3'], ok: false, why: `${T('x=-3')} also breaks ${T('x\\ge0')}` }], ans: 'x=4' },
  a: { label: 'Example 4(a)', eq: '\\sqrt{2x+7}-x=2', R: '2x+7\\ge0,\\ x+2\\ge0\\ \\Rightarrow\\ x\\ge-2', Rshort: 'x\\ge-2', Rnote: 'with the radical alone, the other side is <i>x</i> + 2',
    iso: [['\\sqrt{2x+7}=x+2', '+ <i>x</i> both sides']], sq: [['2x+7=x^2+4x+4', 'square both sides']],
    fac: ['0=x^2+2x-3', '0=(x+3)(x-1)', 'x=-3\\ \\text{or}\\ x=1'],
    roots: [{ x: '1', L: ['\\sqrt{2(1)+7}-1', '\\sqrt{9}-1', '2'], R: ['2'], ok: true }, { x: '-3', L: ['\\sqrt{2(-3)+7}-(-3)', '\\sqrt{1}+3', '4'], R: ['2'], ok: false, why: `${T('x=-3')} also breaks ${T('x\\ge-2')}` }], ans: 'x=1' },
  b: { label: '(b)', eq: '2\\sqrt{x+1}=x-2', R: 'x+1\\ge0,\\ x-2\\ge0\\ \\Rightarrow\\ x\\ge2', Rshort: 'x\\ge2', iso: [], coef: true,
    sq: [[`${cS('4')}(x+1)=x^2-4x+4`, 'square the 2 as well']], fac: ['0=x^2-8x', '0=x(x-8)', 'x=0\\ \\text{or}\\ x=8'],
    roots: [{ x: '8', L: ['2\\sqrt{8+1}', '2\\sqrt{9}', '6'], R: ['8-2', '6'], ok: true }, { x: '0', L: ['2\\sqrt{0+1}', '2\\sqrt{1}', '2'], R: ['0-2', '-2'], ok: false, why: `${T('x=0')} also breaks ${T('x\\ge2')}` }], ans: 'x=8' },
  c: { label: '(c)', eq: '3+\\sqrt{2x-3}=2x', R: '2x-3\\ge0\\ \\Rightarrow\\ x\\ge\\tfrac{3}{2}', Rshort: 'x\\ge\\tfrac{3}{2}', Rnote: 'both conditions give the same thing',
    iso: [['\\sqrt{2x-3}=2x-3', '− 3 both sides']], sq: [['2x-3=4x^2-12x+9', 'square both sides']],
    fac: ['0=4x^2-14x+12', '0=2(2x-3)(x-2)', 'x=\\tfrac{3}{2}\\ \\text{or}\\ x=2'],
    roots: [{ x: '\\tfrac{3}{2}', L: ['3+\\sqrt{2\\left(\\tfrac{3}{2}\\right)-3}', '3+\\sqrt{0}', '3'], R: ['2\\left(\\tfrac{3}{2}\\right)', '3'], ok: true }, { x: '2', L: ['3+\\sqrt{2(2)-3}', '3+\\sqrt{1}', '4'], R: ['2(2)', '4'], ok: true }], ans: 'x=\\tfrac{3}{2}\\ \\text{or}\\ x=2' }
};
const RAIL = ['Restrictions', 'Isolate', 'Square', 'Factor', 'Check'];
const solve = {
  title: 'Isolate, square, factor, check every root',
  height: 470, minW: 940,
  choices: [{ sep: 'Check:' }, ...Object.keys(SV).map((k) => ({ v: k, label: SV[k].label }))],
  ask: (v) => `${v === 'e3' ? 'Example 3' : `Example 4(${v})`}: solve ${T(SV[v].eq)} and verify.`,
  make(stage, v, ex) {
    const d = SV[v], W = ex.W, CW = 330, CX = W - CW - 4;
    const rail = div(stage, 'u4l7-rail', '', 4, 8, 168, 450);
    const pills = RAIL.map((t, i) => { const p = h('div', 'u4l7-rstep', `<b>${i + 1}</b>${t}`); rail.appendChild(p); return p; });
    const on = (i) => pills.forEach((p, j) => { p.classList.toggle('on', j === i); p.classList.toggle('done', j < i); });
    const P = panel(stage, 182, 6, CX - 182 - 12, 458, '', 'u4l7-big2');
    lineIn(P, T(d.eq), 'u4l7-eq').style.opacity = 1;
    const lR = workLine(P, d.R, d.Rnote ? d.Rnote : 'restrictions', 'u4l7-rline');
    const lI = d.iso.map(([t, n]) => workLine(P, t, n));
    const lS = d.sq.map(([t, n]) => workLine(P, t, n));
    const lF = d.fac.map((t, i) => workLine(P, t, i === 0 ? 'standard form' : i === 1 ? 'factor' : 'zero product property', i === 2 ? 'u4l7-cand' : ''));
    const lA = lineIn(P, `${d.roots.every((r) => r.ok) ? 'Both roots are valid' : 'The root is'}: ${T(`\\boldsymbol{${d.ans}}`)}`, 'u4l7-okline u4l7-bigok');
    const cards = d.roots.map((r, i) => hide(checkCard(stage, { title: 'Check', at: `x=${r.x}`, left: r.L, right: r.R, ok: r.ok, x: CX, y: 8 + i * 232, width: CW, hidden: true, cls: 'u4l7-ck' })));
    const sts = d.roots.map((r, i) => stampAt(stage, r.ok ? '✓ root' : 'EXTRANEOUS', r.ok, CX + CW - 74, 22 + i * 232, { size: 'sm' }));
    const iso = d.iso.length, r0 = d.roots[0], r1 = d.roots[1];
    const ck = (r) => (r.ok ? `left side = right side, so ${T(`x=${r.x}`)} is a root ✓` : `${T(r.L[r.L.length - 1])} ≠ ${T(r.R[r.R.length - 1])}: ${T(`x=${r.x}`)} is <b>extraneous</b>. ${r.why ? `The restriction predicted it: ${r.why}.` : ''}`);
    return [
      { cap: `<b>1. Restrictions:</b> radicand ≥ 0 and the other side ≥ 0${d.Rnote ? ` (${d.Rnote})` : ''}: ${T(d.Rshort)}.`, run: async (c) => { on(0); await show(c, lR); } },
      { cap: iso ? `<b>2. Isolate</b> the radical: ${T(d.iso[0][0])}.` : `<b>2. Isolate.</b> The radical is already alone on its side${d.coef ? ' (with its coefficient 2)' : ''}.`,
        run: async (c) => { on(1); for (const l of lI) await show(c, l); if (!iso) await pulse(c, P.children[0], 1.05); } },
      { cap: `<b>3. Square both sides.</b> The right side is a <b>binomial</b>: use the pattern, middle term and all${d.coef ? `, and ${T('2^2=4')}` : ''}.`, run: async (c) => { on(2); for (const l of lS) await show(c, l); } },
      { cap: `<b>4. Factor:</b> standard form, factor, then the zero product property gives <b>two candidates</b>: ${T(d.fac[2])}.`, run: async (c) => { on(3); for (const l of lF) await show(c, l); } },
      { cap: `<b>5. Check</b> ${T(`x=${r0.x}`)} in the <b>original</b> equation: ${ck(r0)}`, run: async (c) => { on(4); await show(c, cards[0]); await cards[0].play(c); await stampIn(c, sts[0]); } },
      { cap: `Check ${T(`x=${r1.x}`)} too: ${ck(r1)}`, run: async (c) => { await show(c, cards[1]); await cards[1].play(c); await stampIn(c, sts[1]); pills[4].classList.add('done'); } },
      { cap: d.roots.every((r) => r.ok) ? `Both candidates check: ${T(d.ans)}. Squaring does <b>not always</b> create an extraneous root.` : `Reject the extraneous root. The root is ${T(d.ans)}.`, run: (c) => show(c, lA) }
    ];
  }
};

/* =============================== explainer: the ghost (STAR) =============================== */
const GH = {
  e5: { label: 'Example 5: √(x + 3) = x − 3', eq: '\\sqrt{x+3}=x-3', sq: 'x+3=(x-3)^2', f: (x) => Math.sqrt(x + 3), from: -3, fT: 'y=\\sqrt{x+3}',
    g: (x) => x - 3, gT: 'y=x-3', ghT: 'y=3-x', ghE: '\\sqrt{x+3}=3-x', A: (x) => x + 3, AT: 'y=x+3', Q: (x) => (x - 3) * (x - 3), QT: 'y=(x-3)^2',
    real: [6], fake: [1], w1: [-4, 8, -4, 6], w2: [-4, 8, -2, 12], l1: { f: [7.9, 3.7, 'n'], g: [5.2, 5.4, 'w'], gh: [-1.6, 5, 'e'] }, l2: { A: [-1.2, 1.4, 'w'], Q: [0.2, 11.7, 'w'] }, stp: [-2.3, -3.2] },
  e3: { label: 'Example 3: √(x + 12) = x', eq: '\\sqrt{x+12}=x', sq: 'x+12=x^2', f: (x) => Math.sqrt(x + 12), from: -12, fT: 'y=\\sqrt{x+12}',
    g: (x) => x, gT: 'y=x', ghT: 'y=-x', ghE: '\\sqrt{x+12}=-x', A: (x) => x + 12, AT: 'y=x+12', Q: (x) => x * x, QT: 'y=x^2',
    real: [4], fake: [-3], w1: [-13, 7, -6, 6], w2: [-6, 6, -2, 18], l1: { f: [-9, 3.4, 'n'], g: [5.6, 5.3, 'w'], gh: [-6.2, 5.6, 'w'] }, l2: { A: [-5.3, 7.8, 'nw'], Q: [3.9, 17.6, 'w'] }, ys2: 2, stp: [-9, -3.6] },
  c4: { label: 'Example 4(c): no ghost', eq: '\\sqrt{2x-3}=2x-3', orig: '3+\\sqrt{2x-3}=2x', sq: '2x-3=(2x-3)^2', f: (x) => Math.sqrt(2 * x - 3), from: 1.5, fT: 'y=\\sqrt{2x-3}',
    g: (x) => 2 * x - 3, gT: 'y=2x-3', ghT: 'y=3-2x', ghE: '\\sqrt{2x-3}=3-2x', A: (x) => 2 * x - 3, AT: 'y=2x-3', Q: (x) => (2 * x - 3) * (2 * x - 3), QT: 'y=(2x-3)^2',
    real: [1.5, 2], fake: [], w1: [-1, 5, -3, 3], w2: [-1, 4, -2, 4], l1: { f: [3.5, 1.85, 'se'], g: [2.7, 2.5, 'w'], gh: [-0.2, 2.6, 'e'] }, l2: { A: [3.1, 3.5, 'w'], Q: [1.05, 3.5, 'w'] }, step: 0.5 }
};
const fr = (v) => (Math.abs(v - 1.5) < 1e-9 ? '\\tfrac{3}{2}' : String(v));
const ghost = {
  title: 'Where the extraneous root comes from: the ghost line',
  height: 486, minW: 960,
  choices: Object.keys(GH).map((k) => ({ v: k, label: GH[k].label })),
  ask: (v) => (v === 'c4' ? `Example 4(c): after isolating, ${T(GH.c4.eq)}. Why are <b>both</b> roots valid?` : `Squaring ${T(GH[v].eq)} gives two candidates. Where does the extra one come from?`),
  make(stage, v, ex) {
    const d = GH[v], W = ex.W, GW = Math.floor((W - 22) / 2), GY = 74, GH2 = 406;
    div(stage, 'u4l7-gtitle', `<span class="u4l7-gtk">Original</span>${T(d.eq)}`, 4, 2, GW, 34);
    const t2 = hide(div(stage, 'u4l7-gtitle', `<span class="u4l7-gtk">Squared</span>${T(d.sq)}`, GW + 18, 2, GW, 34));
    const s1 = hide(div(stage, 'u4l7-gstat', '', 4, 38, GW, 30)), s2 = hide(div(stage, 'u4l7-gstat', '', GW + 18, 38, GW, 30));
    const [a0, a1, b0, b1] = d.w1, [c0, c1, e0, e1] = d.w2, step = d.step || 1;
    const G1 = new Graph(stage, { x: 4, y: GY, width: GW, height: GH2, xmin: a0, xmax: a1, ymin: b0, ymax: b1, xstep: step, ystep: step, xlabels: step < 1 ? 1 : 2, ylabels: step < 1 ? 1 : 2, fontSize: 15 });
    const G2 = new Graph(stage, { x: GW + 18, y: GY, width: GW, height: GH2, xmin: c0, xmax: c1, ymin: e0, ymax: e1, xstep: step, ystep: d.ys2 || step, xlabels: step < 1 ? 1 : 2, ylabels: d.ys2 ? 4 : step < 1 ? 1 : 2, fontSize: 15 });
    hide(G2.el);
    // left: the original two sides
    const f = hide(G1.fn(d.f, { from: d.from, color: RAD, width: 4.5 })), fp = hideP(G1.point(d.from, 0, { color: RAD, r: 5.5 }));
    const g = hide(G1.fn(d.g, { color: NUM, width: 3.5 }));
    const st = { s: 1 }, gh = hide(G1.fn((x) => st.s * d.g(x), { color: NO, width: 3.5, dash: '9 7' }));
    const fL = lab(G1, ...d.l1.f.slice(0, 2), d.fT, RAD, d.l1.f[2]), gL = lab(G1, ...d.l1.g.slice(0, 2), d.gT, NUM, d.l1.g[2]), ghL = lab(G1, ...d.l1.gh.slice(0, 2), d.ghT, NO, d.l1.gh[2]);
    const realP = d.real.map((x) => hideP(G1.point(x, d.f(x), { color: OK, r: 7, label: T(`(${fr(x)},\\ ${fr(d.f(x))})`), pos: x === d.real[0] && d.real.length > 1 ? 'w' : 'nw', gap: x === d.real[0] && d.real.length > 1 ? 14 : 5 })));
    // right: the squared equation's two sides
    const A = hide(G2.fn(d.A, { color: RAD, width: 3.5 })), Q = hide(G2.fn(d.Q, { color: NUM, width: 4 }));
    const AL = lab(G2, ...d.l2.A.slice(0, 2), d.AT, RAD, d.l2.A[2]), QL = lab(G2, ...d.l2.Q.slice(0, 2), d.QT, NUM, d.l2.Q[2]);
    const all = [...d.real.map((x) => ({ x, ok: true })), ...d.fake.map((x) => ({ x, ok: false }))].sort((p, q) => p.x - q.x);
    const sqP = all.map((r) => hideP(G2.point(r.x, d.A(r.x), { color: SQ, r: 7, label: T(`x=${fr(r.x)}`), pos: r.x === all[0].x ? 'e' : 'se' })));
    const candT = all.map((r) => `x=${fr(r.x)}`).join('\\ \\text{and}\\ ');
    const steps = [];
    if (d.fake.length) {
      const x = d.fake[0], fy = d.f(x), gy = d.g(x);
      const pf = hideP(G1.point(x, fy, { color: RAD, r: 6 })), pg = hideP(G1.point(x, gy, { color: NUM, open: true, r: 6 }));
      const gap = hide(G1.segment([x, fy], [x, gy], { color: NO, width: 3, dash: '4 5' }));
      const gapL = lab(G1, x + 0.3, (fy + gy) / 2, `\\text{${Math.abs(fy - gy)} apart}`, NO, 'e');
      const ghP = hideP(G1.point(x, fy, { color: NO, r: 8, label: `<b>ghost</b> ${T(`(${x},\\ ${fy})`)}`, pos: 'e' }));
      const [sx, sy] = G1.toPx(...d.stp), st1 = stampAt(stage, 'EXTRANEOUS', false, 4 + sx, GY + sy, { size: 'sm' });
      steps.push(
        { cap: `Graph both sides of ${T(d.eq)}: the curve ${T(cR(d.fT))} and the line ${T(cN(d.gT))}. They cross <b>once</b>.`,
          run: async (c) => { await popP(c, fp); await drawOn(c, G1, f, 800); await show(c, fL); await drawOn(c, G1, g, 600); await show(c, gL); for (const p of realP) await popP(c, p); s1.innerHTML = `1 meeting → <b>1 root</b>, ${T(`x=${d.real[0]}`)}`; await show(c, s1); } },
        { cap: `Now square: ${T(d.sq)}. Graph <b>its</b> two sides. The line and the parabola cross <b>twice</b>: ${T(candT)}.`,
          run: async (c) => { await show(c, t2); await show(c, G2.el); await drawOn(c, G2, A, 600); await show(c, AL); await drawOn(c, G2, Q, 800); await show(c, QL); for (const p of sqP) await popP(c, p); s2.innerHTML = `2 meetings → <b>2 candidates</b>`; await show(c, s2); } },
        { cap: `${T(`x=${d.real[0]}`)} is the real meeting. But at ${T(`x=${x}`)} the original graphs do <b>not</b> meet: the curve is at ${T(String(fy))}, the line at ${T(String(gy))}.`,
          run: async (c) => { await popP(c, pf); await popP(c, pg); await drawOn(c, G1, gap, 500); await show(c, gapL); } },
        { cap: `Squaring can't tell ${T(d.gT.slice(2))} from its opposite: ${T(`\\left(${d.ghT.slice(2)}\\right)^2=\\left(${d.gT.slice(2)}\\right)^2`)}. Flip the line over the ${T('x')}-axis: the dashed <b>ghost</b> ${T(cX(d.ghT))}.`,
          run: async (c) => { gh.style.opacity = 1; st.s = 1; gh._bkDraw(); await tween(c, 1400, (t) => { st.s = 1 - 2 * t; gh._bkDraw(); }); await show(c, ghL); } },
        { cap: `The ghost meets the curve at ${T(`(${x},\\ ${fy})`)}. The squared equation also solved ${T(d.ghE)}, and that is where ${T(`x=${x}`)} came from: it is <b>extraneous</b>.`,
          run: async (c) => { await fadeOut(c, gapL); await popP(c, ghP); await shake(c, ghP.label); const p = sqP[all.findIndex((r) => !r.ok)]; p.label.innerHTML = `<b>ghost</b> ${T(`x=${x}`)}`; p.label.style.color = NO; await pulse(c, p.label, 1.15); await stampIn(c, st1); } }
      );
      return steps;
    }
    // Example 4(c): both candidates are real meetings; the ghost only touches the curve at its starting point
    const ghP = hideP(G1.point(1.5, 0, { color: NO, r: 9, open: true }));
    const st2 = stampAt(stage, 'both roots ✓', true, 4 + GW / 2 + 60, GY + GH2 - 46, { size: 'sm' });
    steps.push(
      { cap: `Isolated, ${T(d.orig)} is ${T(d.eq)}. Graph both sides: they meet <b>twice</b>, at ${T('\\left(\\tfrac{3}{2},\\ 0\\right)')} and ${T('(2,\\ 1)')}.`,
        run: async (c) => { await popP(c, fp); await drawOn(c, G1, f, 800); await show(c, fL); await drawOn(c, G1, g, 600); await show(c, gL); for (const p of realP) await popP(c, p); s1.innerHTML = `2 meetings → <b>2 roots</b>`; await show(c, s1); } },
      { cap: `Square: ${T(d.sq)}. The squared equation's graphs also meet twice: ${T(candT)}. The same two numbers.`,
        run: async (c) => { await show(c, t2); await show(c, G2.el); await drawOn(c, G2, A, 600); await show(c, AL); await drawOn(c, G2, Q, 800); await show(c, QL); for (const p of sqP) await popP(c, p); s2.innerHTML = `2 meetings → <b>2 candidates</b>`; await show(c, s2); } },
      { cap: `Flip the line to the ghost ${T(cX(d.ghT))}. It touches the curve only at ${T('\\left(\\tfrac{3}{2},\\ 0\\right)')}, where both sides are 0 and ${T('0=-0')}. <b>No new root.</b>`,
        run: async (c) => { gh.style.opacity = 1; st.s = 1; gh._bkDraw(); await tween(c, 1400, (t) => { st.s = 1 - 2 * t; gh._bkDraw(); }); await show(c, ghL); await popP(c, ghP); } },
      { cap: `Both candidates are real meetings of the original graphs: ${T('x=\\tfrac{3}{2}')} or ${T('x=2')}. Squaring does not always create a ghost.`, run: (c) => stampIn(c, st2) }
    );
    return steps;
  }
};

/* =============================== explainer: the calculator check (keycaps only) =============================== */
const CC = {
  e5: { label: 'Example 5 check', y1: '√(X+3)', y2: 'X−3', f: (x) => Math.sqrt(x + 3), g: (x) => x - 3, win: { xmin: -4, xmax: 8, ymin: -4, ymax: 6, xscl: 1, yscl: 1 }, guess: 5,
    eq: '\\sqrt{x+3}=x-3', note: `One intersection, ${T('(6,\\ 3)')}: the root is ${T('x=6')}. There is nothing at ${T('x=1')}, because the graphs don't meet there.` },
  e6: { label: 'Example 6 check', y1: 'X+√(X)', y2: '12', f: (x) => x + Math.sqrt(x), g: () => 12, win: { xmin: 0, xmax: 20, ymin: 0, ymax: 24, xscl: 2, yscl: 2 }, guess: 8,
    eq: 'x+\\sqrt{x}=12', note: `The root is ${T('x=9')}. At ${T('x=16')}, ${T('Y_1=20')}, not 12: no intersection there.` },
  e7: { label: 'Example 7(a) check', y1: '√(X+7)−√(X)', y2: '1', f: (x) => Math.sqrt(x + 7) - Math.sqrt(x), g: () => 1, win: { xmin: -2, xmax: 20, ymin: -1, ymax: 4, xscl: 2, yscl: 1 }, guess: 8,
    eq: '\\sqrt{x+7}-\\sqrt{x}=1', note: `The root is ${T('x=9')}, the same as the algebra.` }
};
const calcCheck = {
  title: 'Checking with a graph',
  height: 432, minW: 900,
  choices: Object.keys(CC).map((k) => ({ v: k, label: CC[k].label })),
  ask: (v) => `Check ${T(CC[v].eq)} on a graphing calculator: where do ${T('Y_1')} and ${T('Y_2')} meet?`,
  make(stage, v, ex) {
    const d = CC[v], W = ex.W, GW = 540;
    const ks = div(stage, 'u4l7-keystrip', '<span class="u4l7-kh">Keys</span>', 6, 4, GW, 46);
    const G = new Graph(stage, { x: 6, y: 56, width: GW, height: 370, theme: 'calc', xmin: -10, xmax: 10, ymin: -10, ymax: 10 });
    const scr = panel(stage, GW + 20, 6, W - GW - 26, 420, '', 'u4l7-calcp');
    const yeq = lineIn(scr, `<div class="u4l7-ti"><div><b class="u4l7-ti1">Y1=</b>${d.y1}</div><div><b class="u4l7-ti2">Y2=</b>${d.y2}</div></div>`);
    const w = d.win, m = (t) => (t < 0 ? '−' + -t : t);
    const win = lineIn(scr, `<div class="u4l7-ti u4l7-tiw"><div>WINDOW</div><div>Xmin=${m(w.xmin)}</div><div>Xmax=${w.xmax}</div><div>Xscl=${w.xscl}</div><div>Ymin=${m(w.ymin)}</div><div>Ymax=${w.ymax}</div><div>Yscl=${w.yscl}</div></div>`);
    const nt = lineIn(scr, d.note, 'u4l7-okline');
    const y1 = hide(G.fn(d.f, { color: '#1f5bd6', width: 3 })), y2 = hide(G.fn(d.g, { color: '#c93a33', width: 3 }));
    const it = G.intersect(d.f, d.g, d.guess);
    const pt = hide(G.point(it.x, it.y, { color: 'ink', r: 6 }));
    const setKeys = (html) => { ks.innerHTML = `<span class="u4l7-kh">Keys</span>${html}`; };
    const X = Math.round(it.x * 1e6) / 1e6, Y = Math.round(it.y * 1e6) / 1e6;
    return [
      { cap: `${keys('Y=')} Enter the left side as ${T('Y_1')} and the right side as ${T('Y_2')}.`, run: async (c) => { setKeys(keys('Y=')); await show(c, yeq); } },
      { cap: `${keys('WINDOW')} Set a window that shows where the graphs meet.`, run: async (c) => { setKeys(keys('WINDOW')); await show(c, win); await G.setWindow(w, c, 800); } },
      { cap: `${keys('GRAPH')} Both sides appear: ${T('Y_1')} in blue, ${T('Y_2')} in red.`, run: async (c) => { setKeys(keys('GRAPH')); await drawOn(c, G, y1, 800); await drawOn(c, G, y2, 600); } },
      { cap: `${keys('2nd', 'TRACE')} (CALC), <b>5: intersect</b>, then ${keys('ENTER')} three times (first curve, second curve, guess).`,
        run: async (c) => { setKeys(`${keys('2nd', 'TRACE')} <b>5</b> ${keys('ENTER', 'ENTER', 'ENTER')}`); await pop(c, pt); G.readout('Intersection', it); } },
      { cap: `Intersection at X = ${X}, Y = ${Y}: the root is <b>x = ${X}</b>.`, run: (c) => show(c, nt) }
    ];
  }
};

/* =============================== explainer: x + k√x = N two ways =============================== */
/* p > 0 and n < 0 are the roots of u² + ku − N = 0 */
const TW = {
  e6: { label: 'Example 6: x + √x = 12', k: 1, N: 12, p: 3, n: -4 },
  wu: { label: 'Warm-up patio: x + √x = 42', k: 1, N: 42, p: 6, n: -7 },
  c2: { label: 'x + 2√x = 15', k: 2, N: 15, p: 3, n: -5 }
};
const twoWays = {
  title: 'Two ways: square, or substitute u = √x',
  height: 470, minW: 940,
  choices: Object.keys(TW).map((k) => ({ v: k, label: TW[k].label })),
  ask: (v) => { const d = TW[v]; return `Solve ${T(`x+${d.k === 1 ? '' : d.k}\\sqrt{x}=${d.N}`)} in two ways.`; },
  make(stage, v, ex) {
    const d = TW[v], { k, N, p, n } = d, W = ex.W, PW = Math.floor((W - 22) / 2), K = k === 1 ? '' : String(k), m = -n;
    const X1 = p * p, X2 = n * n, B = 2 * N + k * k;
    const eq = `x+${K}\\sqrt{x}=${N}`;
    div(stage, 'u4l7-eq u4l7-eqc', T(eq), 0, 0, W, 40);
    const A = panel(stage, 4, 44, PW, 300, '(a) Isolate the radical and square', 'u4l7-big2');
    const Bp = panel(stage, PW + 18, 44, PW, 300, `(b) Substitute ${T('u=\\sqrt{x}')}`, 'u4l7-big2');
    const a1 = workLine(A, `${K}\\sqrt{x}=${N}-x`, `so ${T(`0\\le x\\le${N}`)}`);
    const a2 = workLine(A, `${k * k === 1 ? '' : k * k}x=${N * N}-${2 * N}x+x^2`, 'square');
    const a3 = workLine(A, `0=x^2-${B}x+${N * N}`, '');
    const a4 = workLine(A, `0=(x-${X1})(x-${X2})`, 'factor', 'u4l7-cand');
    const a5 = lineIn(A, `${T(`x=${X1}`)}: ${T(`${X1}+${K ? K + '(' + p + ')' : p}=${N}`)} ✓`, 'u4l7-okline');
    const a6 = lineIn(A, `${T(`x=${X2}`)}: ${T(`${X2}+${K ? K + '(' + m + ')' : m}=${X2 + k * m}\\ne${N}`)} <b class="u4l7-xr">extraneous</b>`, 'u4l7-xline');
    const b1 = workLine(Bp, `u^2+${K}u=${N}`, `${T('x=u^2')}`);
    const b2 = workLine(Bp, `u^2+${K}u-${N}=0`, '');
    const b3 = workLine(Bp, `(u+${m})(u-${p})=0`, 'factor');
    const b4 = workLine(Bp, `u=-${m}\\ \\text{or}\\ u=${p}`, '', 'u4l7-cand');
    const b5 = lineIn(Bp, `${T(`\\sqrt{x}=${p}\\Rightarrow\\boldsymbol{x=${X1}}`)} <span class="muted">(no extraneous root this way)</span>`, 'u4l7-okline');
    // the u-number line under (b)
    const NL = new NumberLine(stage, { x: PW + 18, y: 348, width: PW, height: 92, min: -9, max: 9, step: 1, labelStep: 3, axisY: 58, fontSize: 15 });
    const nlT = hide(div(stage, 'u4l7-nlt', T('u'), PW + 18 + PW - 22, 348 + 24));
    const uOk = hide(NL.interval(0, Infinity, { color: OK, width: 9 }));
    const uOkL = hide(div(stage, 'u4l7-ivlab u4l7-ivok', T('u=\\sqrt{x}\\ge0'), PW + 18 + NL.toPx(0) + 10, 348 + 4));
    const up = hide(NL.point(p, { color: OK })), un = hide(NL.point(n, { color: NO, open: true }));
    const unX = hide(div(stage, 'u4l7-rej', `✗ ${T(`u=-${m}`)}`, PW + 18 + NL.toPx(n) - 40, 348 + 2));
    const sA = stampAt(stage, `x = ${X2} ✗`, false, 4 + PW - 80, 44 + 252, { size: 'sm' });
    const link = hide(div(stage, 'u4l7-link', `The ghost ${T(`x=${X2}`)} is the rejected ${T(`u=-${m}`)}, squared: ${T(`(-${m})^2=${X2}`)}. Squaring the equation let a negative ${T('\\sqrt{x}')} sneak back in.`, 4, 350, PW, 110));
    return [
      { cap: `<b>(a)</b> Isolate the radical: ${T(`${K}\\sqrt{x}=${N}-x`)}. The right side must be ≥ 0, so ${T(`0\\le x\\le${N}`)}.`, run: (c) => show(c, a1) },
      { cap: `Square both sides (the right side is a binomial), then factor: ${T(`x=${X1}`)} or ${T(`x=${X2}`)}.`, run: async (c) => { await show(c, a2); await show(c, a3); await show(c, a4); } },
      { cap: `Check both: ${T(`x=${X1}`)} works; ${T(`x=${X2}`)} gives ${X2 + k * m}, not ${N}. ${T(`x=${X2}`)} is extraneous (it also breaks ${T(`x\\le${N}`)}).`, run: async (c) => { await show(c, a5); await show(c, a6); await stampIn(c, sA); } },
      { cap: `<b>(b)</b> Let ${T('u=\\sqrt{x}')}, so ${T('x=u^2')}. The equation becomes a quadratic in ${T('u')}: ${T(`u^2+${K}u-${N}=0`)}.`, run: async (c) => { await show(c, b1); await show(c, b2); } },
      { cap: `Factor: ${T(`u=-${m}`)} or ${T(`u=${p}`)}.`, run: async (c) => { await show(c, b3); await show(c, b4); await show(c, nlT); await pop(c, up); await pop(c, un); } },
      { cap: `But ${T('u=\\sqrt{x}')} is never negative: <b>reject</b> ${T(`u=-${m}`)}. Then ${T(`\\sqrt{x}=${p}`)}, so ${T(`x=${X1}`)}.`, run: async (c) => { await drawOn(c, NL, uOk, 600); await show(c, uOkL); await show(c, unX); await shake(c, unX); await show(c, b5); } },
      { cap: `Same answer both ways, ${T(`x=${X1}`)}. And the ghost: ${T(`x=${X2}`)} is the rejected ${T(`u=-${m}`)}, squared.`, run: (c) => show(c, link) }
    ];
  }
};

/* =============================== explainer: squaring twice =============================== */
const TT = {
  a: { label: 'Example 7(a)', eq: '\\sqrt{x+7}-\\sqrt{x}=1', R: 'x\\ge-7,\\ x\\ge0\\ \\Rightarrow\\ x\\ge0', Rshort: 'x\\ge0', iso1: '\\sqrt{x+7}=1+\\sqrt{x}', b: '\\sqrt{x}', bb: 'x',
    sq1: `x+7=1+${cS('2\\sqrt{x}')}+x`, iso2: [['6=2\\sqrt{x}', '− <i>x</i> − 1 both sides'], ['\\sqrt{x}=3', '÷ 2']], sq2: [['x=9', 'square again']],
    roots: [{ x: '9', L: ['\\sqrt{9+7}-\\sqrt{9}', '4-3', '1'], R: ['1'], ok: true }], ans: 'x=9' },
  b: { label: '(b)', eq: '\\sqrt{x-1}-\\sqrt{2x-4}=1', R: 'x\\ge1,\\ x\\ge2\\ \\Rightarrow\\ x\\ge2', Rshort: 'x\\ge2', iso1: '\\sqrt{x-1}=1+\\sqrt{2x-4}', b: '\\sqrt{2x-4}', bb: '2x-4',
    sq1: `x-1=1+${cS('2\\sqrt{2x-4}')}+2x-4`, iso2: [['-x+2=2\\sqrt{2x-4}', 'isolate']], warn: true,
    sq2: [['x^2-4x+4=4(2x-4)', 'square again'], ['x^2-12x+20=0', ''], ['(x-2)(x-10)=0', '']],
    roots: [{ x: '2', L: ['\\sqrt{1}-\\sqrt{0}', '1'], R: ['1'], ok: true }, { x: '10', L: ['\\sqrt{9}-\\sqrt{16}', '-1'], R: ['1'], ok: false }], ans: 'x=2' }
};
const twice = {
  title: 'Two radicals: square, isolate, square again',
  height: 470, minW: 940,
  choices: [{ sep: 'Check:' }, ...Object.keys(TT).map((k) => ({ v: k, label: TT[k].label }))],
  ask: (v) => `Example 7(${v}): solve ${T(TT[v].eq)} and verify.`,
  make(stage, v, ex) {
    const d = TT[v], W = ex.W, RW = 360, RX = W - RW - 4;
    const P = panel(stage, 4, 6, RX - 16, 458, '', 'u4l7-big2 u4l7-tight');
    lineIn(P, T(d.eq), 'u4l7-eq').style.opacity = 1;
    const lR = workLine(P, d.R, 'restrictions', 'u4l7-rline');
    const l1 = workLine(P, d.iso1, 'isolate one radical');
    const l2 = workLine(P, d.sq1, 'square');
    const l3 = d.iso2.map(([t, n]) => workLine(P, t, n));
    const lw = d.warn ? lineIn(P, `The left side must be ≥ 0: ${T('2-x\\ge0')}, so ${T('x\\le2')}. With ${T('x\\ge2')}, only ${T('x=2')} can work!`, 'u4l7-tipline') : null;
    const l4 = d.sq2.map(([t, n]) => workLine(P, t, n, ''));
    const lA = lineIn(P, `The root is ${T(`\\boldsymbol{${d.ans}}`)}`, 'u4l7-okline u4l7-bigok');
    // radicals-left meter
    const meter = div(stage, 'u4l7-meter', '', RX, 6, RW, 58);
    const setM = (k) => { meter.innerHTML = `<span class="u4l7-mh">Radicals left</span>${[0, 1].map((i) => `<span class="u4l7-mr${i < k ? ' on' : ''}">${T('\\sqrt{\\ }')}</span>`).join('')}<b>${k}</b>`; };
    setM(2);
    // the (1 + √B)² grid
    const g = sqGrid(stage, RX + 4, 84, ['1', `+${d.b}`], 132, 86, 92, 46); hide(g.el);
    const gcap = hide(div(stage, 'u4l7-mid', `${T(`\\left(1+${d.b}\\right)^2=1+${cS(`2${d.b}`)}+${d.bb}`)}`, RX, 84 + 46 + 172 + 6, RW));
    const cards = d.roots.map((r, i) => hide(checkCard(stage, { title: 'Check', at: `x=${r.x}`, left: r.L, right: r.R, ok: r.ok, x: RX, y: 74 + i * 196, width: RW, hidden: true, cls: 'u4l7-ck u4l7-cksm' })));
    const sts = d.roots.map((r, i) => stampAt(stage, r.ok ? '✓ root' : 'EXTRANEOUS', r.ok, RX + RW - 76, 88 + i * 196, { size: 'sm' }));
    const steps = [
      { cap: `<b>Restrictions</b> from both radicands: ${T(d.Rshort)}. Two radicals to get rid of.`, run: (c) => show(c, lR) },
      { cap: `<b>Isolate one radical</b> (the more complicated one): ${T(d.iso1)}.`, run: (c) => show(c, l1) },
      { cap: `<b>Square.</b> The right side is a binomial: ${T(`\\left(1+${d.b}\\right)^2`)}. Its middle term ${T(cS(`2${d.b}`))} is the radical that <b>remains</b>.`,
        run: async (c) => { await show(c, g.el); await fillCell(c, g.cells[0][0], '1'); await fillCell(c, g.cells[1][1], `+${d.bb}`); await fillCell(c, g.cells[0][1], cS(`+${d.b}`)); await fillCell(c, g.cells[1][0], cS(`+${d.b}`)); g.cells[0][1].classList.add('on'); g.cells[1][0].classList.add('on'); await show(c, gcap); await show(c, l2); setM(1); await pulse(c, meter, 1.05); } },
      { cap: `<b>Isolate</b> the remaining radical.${d.warn ? ` Look: the left side ${T('-x+2')} must be ≥ 0.` : ''}`, run: async (c) => { for (const l of l3) await show(c, l); if (lw) await show(c, lw); } },
      { cap: `<b>Square again.</b> No radicals left${d.sq2.length > 1 ? ': factor the quadratic, two candidates' : `: ${T(d.ans)}`}.`, run: async (c) => { for (const l of l4) await show(c, l); setM(0); await pulse(c, meter, 1.05); } },
      { cap: d.roots.length > 1 ? `<b>Check both</b> in the original: ${T('x=2')} works; ${T('x=10')} gives ${T('3-4=-1')}, not 1: <b>extraneous</b>.` : `<b>Check</b> in the original: ${T('\\sqrt{16}-\\sqrt{9}=4-3=1')} ✓`,
        run: async (c) => { await fadeOut(c, g.el); await fadeOut(c, gcap); for (let i = 0; i < cards.length; i++) { await show(c, cards[i]); await cards[i].play(c); await stampIn(c, sts[i]); } } },
      { cap: `The root is ${T(d.ans)}.`, run: (c) => show(c, lA) }
    ];
    return steps;
  }
};

/* =============================== explainer: root, extraneous or inadmissible =============================== */
const BINS = [['ok', 'Root', 'checks, and makes sense'], ['xr', 'Extraneous', 'fails the original equation'], ['in', 'Inadmissible', 'checks, but impossible in the story']];
function bins(stage, W, y, hh) {
  const bw = Math.floor((W - 28) / 3);
  return BINS.map(([k, t, s], i) => { const b = div(stage, 'u4l7-bin u4l7-bin-' + k, `<div class="u4l7-binh"><b>${t}</b>${s}</div><div class="u4l7-binc"></div>`, 4 + i * (bw + 10), y, bw, hh); return b.lastChild; });
}
const token = (bin, html, cls) => { const t = h('div', 'u4l7-tok u4l7-tok-' + cls, html); bin.appendChild(t); hide(t); return t; };
const AD = { a: { label: 'Example 8(a)' }, b: { label: 'Example 8(b)' }, sort: { label: 'Sort the candidates' } };
const SORT = [
  { ex: 'Ex. 3', x: '-3', bin: 1, why: `${T('\\sqrt{9}=3\\ne-3')}: fails the equation` },
  { ex: 'Ex. 4(c)', x: '\\tfrac{3}{2}', bin: 0, why: `${T('3+\\sqrt{0}=3=2\\left(\\tfrac{3}{2}\\right)')} ✓` },
  { ex: 'Ex. 7(b)', x: '10', bin: 1, why: `${T('\\sqrt{9}-\\sqrt{16}=-1\\ne1')}: fails the equation` },
  { ex: 'Ex. 8(a)', x: '25', bin: 1, why: `${T('25-5=20\\ne30')}: fails the equation` },
  { ex: 'Ex. 8(b)', x: '-10', bin: 2, why: `${T('\\sqrt{100}=10=-10+20')} checks, but a width of −10 cm is impossible` },
  { ex: 'Ex. 8(b)', x: '30', bin: 0, why: `checks, and a 30 cm by 40 cm board is real` }
];
const admiss = {
  title: 'Root, extraneous or inadmissible?',
  height: 470, minW: 940,
  choices: Object.keys(AD).map((k) => ({ v: k, label: AD[k].label })),
  ask: (v) => (v === 'a' ? 'Example 8(a): a positive number decreased by its square root is 30. Determine the number.'
    : v === 'b' ? 'Example 8(b): a cutting board is <i>x</i> cm wide, <i>x</i> + 10 cm long, and its diagonal is <i>x</i> + 20 cm. Determine its dimensions.'
      : 'Six candidates from today’s examples. Which bin does each one go in?'),
  make(stage, v, ex) {
    const W = ex.W, BY = 316, B = bins(stage, W, BY, 150);
    if (v === 'sort') {
      const toks = SORT.map((s) => token(B[s.bin], `<span class="u4l7-tokex">${s.ex}</span> ${T(`x=${s.x}`)}`, ['ok', 'xr', 'in'][s.bin]));
      const row = div(stage, 'u4l7-sortrow', SORT.map((s) => `<span class="u4l7-stok">${s.ex}: ${T(`x=${s.x}`)}</span>`).join(''), 4, 10, W - 8);
      const why = div(stage, 'u4l7-why', '', 4, 66, W - 8, 240);
      const whys = SORT.map((s) => lineIn(why, `<b>${s.ex}</b>, ${T(`x=${s.x}`)}: ${s.why}.`, ['u4l7-okline', 'u4l7-xline', 'u4l7-inline'][s.bin] + ' u4l7-whyl'));
      return [
        { cap: 'Six candidates from today’s examples. For each one, ask: does it satisfy the <b>original equation</b>? Does it make sense in the <b>problem</b>?', run: (c) => pulse(c, row, 1.03) },
        ...SORT.map((s, i) => ({ cap: `<b>${s.ex}</b>, ${T(`x=${s.x}`)}: ${s.why}. → <b>${BINS[s.bin][1]}</b>.`, run: async (c) => { row.children[i].classList.add('done'); await show(c, whys[i]); await pop(c, toks[i]); } }))
      ];
    }
    if (v === 'a') {
      const P = panel(stage, 4, 6, W - 8, 300, '', 'u4l7-big2');
      const l1 = workLine(P, 'x-\\sqrt{x}=30', 'let the number be <i>x</i>');
      const l2 = workLine(P, '\\sqrt{x}=x-30', `isolate: so ${T('x\\ge30')}`);
      const l3 = workLine(P, 'x=x^2-60x+900\\ \\Rightarrow\\ 0=x^2-61x+900=(x-25)(x-36)', 'square, factor');
      const l4 = lineIn(P, `${T('x=36')}: ${T('36-6=30')} ✓`, 'u4l7-okline');
      const l5 = lineIn(P, `${T('x=25')}: ${T('25-5=20\\ne30')} (it also breaks ${T('x\\ge30')})`, 'u4l7-xline');
      const l6 = lineIn(P, '<b>The number is 36.</b>', 'u4l7-okline u4l7-bigok');
      const t1 = token(B[0], T('x=36'), 'ok'), t2 = token(B[1], T('x=25'), 'xr');
      return [
        { cap: `Let the number be ${T('x')}. “Decreased by its square root is 30”: ${T('x-\\sqrt{x}=30')}.`, run: (c) => show(c, l1) },
        { cap: `Isolate the radical: ${T('\\sqrt{x}=x-30')}, so ${T('x\\ge30')}. Square and factor.`, run: async (c) => { await show(c, l2); await show(c, l3); } },
        { cap: `Check ${T('x=36')}: ${T('36-6=30')} ✓. A root.`, run: async (c) => { await show(c, l4); await pop(c, t1); } },
        { cap: `Check ${T('x=25')}: ${T('25-5=20')}, not 30. It fails the <b>equation</b>: <b>extraneous</b>.`, run: async (c) => { await show(c, l5); await pop(c, t2); } },
        { cap: 'Answer in a sentence: the number is 36.', run: (c) => show(c, l6) }
      ];
    }
    // 8(b): the cutting board
    const FW = 330, P = panel(stage, 4, 6, W - FW - 22, 300, '', 'u4l7-big2 u4l7-tight');
    const fig = div(stage, 'u4l7-bfig', '', W - FW - 4, 6, FW, 300);
    const svg = svgEl('svg', { width: FW, height: 300, viewBox: `0 0 ${FW} 300` }, fig);
    const bx = 40, by = 40, s = 6.2; // px per cm for the to-scale board: 40 × 30 cm → 248 × 186 px
    const board = svgEl('rect', { x: bx, y: by, width: 40 * s, height: 30 * s, rx: 10, fill: '#e2c08d', stroke: '#8a6232', 'stroke-width': 3 }, svg);
    const diag = svgEl('line', { x1: bx, y1: by + 30 * s, x2: bx + 40 * s, y2: by, stroke: '#1c2230', 'stroke-width': 2.5, 'stroke-dasharray': '7 6' }, svg);
    hide(board); hide(diag);
    const gL = [div(fig, 'u4l7-blab', T('x+10'), bx + 20 * s - 30, by + 30 * s + 4), div(fig, 'u4l7-blab', T('x'), bx + 40 * s + 6, by + 15 * s - 14), div(fig, 'u4l7-blab u4l7-bdiag', T('x+20'), bx + 20 * s - 38, by + 15 * s - 40)].map(hide);
    const nL = [div(fig, 'u4l7-blab u4l7-bok', '40 cm', bx + 20 * s - 30, by + 30 * s + 4), div(fig, 'u4l7-blab u4l7-bok', '30 cm', bx + 40 * s - 66, by + 15 * s - 14), div(fig, 'u4l7-blab u4l7-bok u4l7-bdiag', '50 cm', bx + 20 * s - 34, by + 15 * s - 42)].map(hide);
    const bad = hide(div(fig, 'u4l7-bbad', `width ${T('-10')} cm, length ${T('0')} cm?!`, 10, 256, FW - 20));
    const l1 = workLine(P, '\\sqrt{x^2+(x+10)^2}=x+20', 'Pythagoras');
    const l2 = workLine(P, 'x^2+x^2+20x+100=x^2+40x+400', 'square');
    const l3 = workLine(P, 'x^2-20x-300=0\\ \\Rightarrow\\ (x-30)(x+10)=0', 'factor');
    const l4 = lineIn(P, `${T('x=30')}: ${T('\\sqrt{900+1600}=50=30+20')} ✓`, 'u4l7-okline');
    const l5 = lineIn(P, `${T('x=-10')}: ${T('\\sqrt{100+0}=10=-10+20')} ✓ in the equation, but a width can't be negative`, 'u4l7-inline');
    const l6 = lineIn(P, '<b>The board is 30 cm by 40 cm</b> (diagonal 50 cm).', 'u4l7-okline u4l7-bigok');
    const t1 = token(B[0], T('x=30'), 'ok'), t2 = token(B[2], T('x=-10'), 'in');
    return [
      { cap: `Draw it: width ${T('x')}, length ${T('x+10')}, diagonal ${T('x+20')}. The diagonal is the hypotenuse of a right triangle.`, run: async (c) => { await show(c, board); await show(c, diag); for (const e of gL) await show(c, e); } },
      { cap: `Pythagoras: ${T('d=\\sqrt{x^2+(x+10)^2}')}, so ${T('\\sqrt{x^2+(x+10)^2}=x+20')}.`, run: (c) => show(c, l1) },
      { cap: `Square both sides (expand both binomials) and factor: ${T('x=30')} or ${T('x=-10')}.`, run: async (c) => { await show(c, l2); await show(c, l3); } },
      { cap: `${T('x=30')}: the diagonal is ${T('\\sqrt{900+1600}=50')} and ${T('30+20=50')} ✓. The board, drawn to scale: 30 by 40.`, run: async (c) => { await show(c, l4); for (const e of gL) await fadeOut(c, e); for (const e of nL) await show(c, e); await pop(c, t1); } },
      { cap: `${T('x=-10')} <b>satisfies the equation</b>: ${T('\\sqrt{100}=10')} and ${T('-10+20=10')}. So it is not extraneous. But a width of −10 cm is impossible: <b>inadmissible</b>.`, run: async (c) => { await show(c, l5); await show(c, bad); await pop(c, t2); } },
      { cap: 'Answer in a sentence: the board is 30 cm by 40 cm.', run: (c) => show(c, l6) }
    ];
  }
};

/* =============================== Stand Up Break =============================== */
const sgn = (v) => (v === 0 ? '' : v > 0 ? '+' + v : String(v));
standup('u4l7', {
  intro: 'At your whiteboard: restrictions, isolate, square, factor, and check every root. Hunt the ghosts!',
  levels: {
    BEG: (r) => { // √(px + q) = x with roots n (valid) and −m (extraneous): p = n − m, q = nm
      const n = r.int(3, 9), m = r.int(1, Math.min(4, n - 1)), p = n - m, q = n * m, P = p === 1 ? '' : p;
      return { text: 'Solve and verify.', q: `\\sqrt{${P}x+${q}}=x`,
        a: [`\\text{Restriction: }x\\ge0`, `${P}x+${q}=x^2\\Rightarrow x^2-${P}x-${q}=0`, `(x-${n})(x+${m})=0`, `x=${n}:\\ \\sqrt{${n * n}}=${n}\\ \\checkmark`, `x=${-m}:\\ \\sqrt{${m * m}}=${m}\\ne${-m}\\ \\text{(extraneous)}`, `x=${n}`] };
    },
    PRG: (r) => { // √(x + b) = x − c with roots c + k (valid) and c + 1 − k (extraneous when k ≥ 2, valid when k = 1)
      const c = r.int(1, 5), k = r.chance(0.25) ? 1 : r.int(2, 4), r1 = c + k, r2 = c + 1 - k, b = c * c - r1 * r2, S = r1 + r2, Pd = r1 * r2;
      const fac = (t) => `(x${sgn(-t)})`;
      const chk = (t) => (t - c >= 0 ? `x=${t}:\\ \\sqrt{${t + b}}=${t - c}\\ \\checkmark` : `x=${t}:\\ \\sqrt{${t + b}}=${Math.abs(t - c)}\\ne${t - c}\\ \\text{(extraneous)}`);
      const ans = r2 - c >= 0 ? `x=${r2}\\ \\text{or}\\ x=${r1}` : `x=${r1}`;
      return { text: 'Solve and verify. How many roots are real?', q: `\\sqrt{x${sgn(b)}}=x-${c}`,
        a: [`\\text{Restrictions: }x\\ge${c}`, `x${sgn(b)}=x^2-${2 * c}x+${c * c}`, `0=x^2-${S}x${sgn(Pd)}`, `0=${fac(r1)}${fac(r2)}`, chk(r1), chk(r2), ans] };
    },
    MAS: (r) => {
      if (r.chance(0.5)) { // x + √x = N by either method
        const p = r.int(2, 8), N = p * p + p, m = p + 1;
        return { text: 'Solve. Use either method.', q: `x+\\sqrt{x}=${N}`,
          a: [`u=\\sqrt{x}\\ge0:\\ u^2+u-${N}=0`, `(u+${m})(u-${p})=0`, `u=${p}\\ (u=-${m}\\text{ rejected})`, `x=${p * p}`, `\\text{Check: }${p * p}+${p}=${N}\\ \\checkmark`] };
      }
      // √(x + a) − √x = 1 with a = 2m + 1 → √x = m
      const m = r.int(2, 7), a = 2 * m + 1;
      return { text: 'Solve by squaring twice, and verify.', q: `\\sqrt{x+${a}}-\\sqrt{x}=1`,
        a: [`\\sqrt{x+${a}}=1+\\sqrt{x}`, `x+${a}=1+2\\sqrt{x}+x`, `${a - 1}=2\\sqrt{x}\\Rightarrow\\sqrt{x}=${m}`, `x=${m * m}`, `\\text{Check: }\\sqrt{${m * m + a}}-\\sqrt{${m * m}}=${m + 1}-${m}=1\\ \\checkmark`] };
    }
  }
});

/* =============================== mount =============================== */
mountPatio();
mountCardFigures();
export const explainers = mountExplainers({ binSq, restrict2, solve, ghost, calcCheck, twoWays, twice, admiss });
export const _test = { BS, RS, SV, GH, CC, TW, TT, SORT };
