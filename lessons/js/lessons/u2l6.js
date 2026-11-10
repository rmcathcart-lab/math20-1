/* Math 20-1 · Unit 2 · Lesson 6 — Rationalizing Binomial Denominators with Conjugates.
 * Warm-up (The Mental Math Trick: a 21 × 19 tile floor whose strip is turned on its side → 20² − 1²) and the explainers:
 *   square   (a big square with a small square cut from its corner; the L-shape re-cut into (A + B)(A − B)),
 *   conj     (the conjugate grid: binomial × conjugate, cross terms cancel; Example 1 checks; a same-sign contrast),
 *   detect   (a "radical detector" scans the denominator after ×√3/√3, after × the conjugate, and for one term),
 *   machine  (STAR, the conjugate machine: denominator × conjugate in a 2×2 grid where the cross terms cancel, the
 *            same factor on the numerator, then a simplest-form checklist that ticks off; Example 2 checks),
 *   machine2 (the same machine with a two-term numerator: a second grid; Example 3 checks),
 *   reduce   (a factor of every term: test the factors of the smallest coefficient; Examples 2(a), 3(c), 4(a), a trap),
 *   machine3 (simplify radicals first vs later; Example 4 checks),
 *   restrict (restrictions on a number line / in the ab-plane; Example 5 checks),
 *   combine  (rationalize each piece, then collect like radicals as tiles in two bins; Example 6 checks),
 *   golden   (the golden ratio's reciprocal and a rectangle's length and perimeter; Example 7 checks).
 * Colours: denominator blue, conjugate amber, numerator purple, rational result green, cancelling terms red. */
import {
  h, tex, add, box, fit, stamp, stampIn, mountExplainers, pop, fadeIn, appear, sleep, tween, svgEl, liveCtx, pulse, shake,
  place, NumberLine, Graph, drawIn
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const DB = '#1f5bd6', CA = '#c27a0e', NP = '#7b4fc4', GR = '#12805a', RD = '#c93a33', INK = '#1c2230';
const cD = (s) => `\\textcolor{${DB}}{${s}}`, cC = (s) => `\\textcolor{${CA}}{${s}}`, cN = (s) => `\\textcolor{${NP}}{${s}}`;
const cG = (s) => `\\textcolor{${GR}}{${s}}`, cX = (s) => `\\textcolor{${RD}}{${s}}`;
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const show = (c, el) => fadeIn(c, el, 320);
const panel = (stage, x, y, w, hh, title, cls = '') => add(stage, box(h('div', 'u2l6-panel ' + cls, title ? `<div class="u2l6-ph">${title}</div>` : ''), w, hh), x, y);
const line = (p, html, cls = '') => { const d = h('div', 'u2l6-line ' + cls, html); p.appendChild(d); return d; };
const hidLine = (p, html, cls) => hide(line(p, html, cls));
/** set an element's HTML, shrink it to maxW, fade it in */
const setHTML = (c, el, html, maxW) => { el.innerHTML = html; el.style.fontSize = ''; if (maxW) fit(el, maxW); return fadeIn(c, el, 300); };

/* ====================================================================================================
 * A tiny radical engine: a term is { c, r } = c√r (r = 1 for a whole number). Used by the machine and the
 * Stand Up Break, so the answers on screen are computed, not typed.
 * ==================================================================================================== */
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
function sqf(r) { let o = 1, i = r; for (let k = 2; k * k <= i; k++) while (i % (k * k) === 0) { i /= k * k; o *= k; } return [o, i]; }
const isSq = (r) => { const s = Math.round(Math.sqrt(r)); return s * s === r; };
const t = (c, r = 1) => ({ c, r });
const simp = (u) => { const [o, i] = sqf(u.r); return t(u.c * o, i); };
const neg = (u) => t(-u.c, u.r);
/** product with perfect squares worked out (√3·√3 = 3) but other radicands left as they come (√6·3√2 = 3√12) */
const mulRaw = (a, b) => { const c = a.c * b.c, r = a.r * b.r; return isSq(r) ? t(c * Math.round(Math.sqrt(r)), 1) : t(c, r); };
function tT(u, lead = true) { const a = Math.abs(u.c), body = u.r === 1 ? String(a) : (a === 1 ? '' : a) + `\\sqrt{${u.r}}`; return (u.c < 0 ? '-' : lead ? '' : '+') + body; }
const eT = (ts) => (ts.length ? ts.map((u, i) => tT(u, i === 0)).join('') : '0');
const par = (ts) => (ts.length > 1 ? `(${eT(ts)})` : eT(ts));
const fracT = (ts, d) => (d === 1 ? eT(ts) : `\\dfrac{${eT(ts)}}{${d}}`);
function collect(ts) { const m = new Map(); ts.forEach((u) => m.set(u.r, (m.get(u.r) || 0) + u.c)); return [...m].filter(([, c]) => c !== 0).map(([r, c]) => t(c, r)); }
/** like-term groups with 2+ members: [{ r, members, tex: "6\sqrt3-2\sqrt3=4\sqrt3" }] */
function groups(ts) {
  const m = new Map(); ts.forEach((u, i) => { if (!m.has(u.r)) m.set(u.r, []); m.get(u.r).push(i); });
  return [...m].filter(([, ix]) => ix.length > 1).map(([r, ix]) => { const g = ix.map((i) => ts[i]), s = g.reduce((a, u) => a + u.c, 0); return { r, ix, tex: `${eT(g)}=${s === 0 ? '0' : tT(t(s, r))}` }; });
}
const sqT = (u) => (u.r === 1 ? `${Math.abs(u.c)}^2` : Math.abs(u.c) === 1 ? `(\\sqrt{${u.r}})^2` : `(${Math.abs(u.c)}\\sqrt{${u.r}})^2`);
const sqV = (u) => u.c * u.c * u.r;
const sqW = (u) => (Math.abs(u.c) > 1 && u.r > 1 ? `${u.c * u.c}(${u.r})` : String(sqV(u)));
/** "(2√5)² − 3² = 4(5) − 9 = 20 − 9 = 11" for first and second terms a, b */
function diffSq(a, b) {
  const v = sqV(a) - sqV(b); let s = `${sqT(a)}-${sqT(b)}`;
  const w = `${sqW(a)}-${sqW(b)}`, n = `${sqV(a)}-${sqV(b)}`;
  if (w !== n) s += '=' + w;
  return s + '=' + n + '=' + v;
}
const convT = (u) => { const a = t(Math.abs(u.c), u.r); return `${tT(a)}=${tT(simp(a))}`; };
function rationalize(num0, den0, first = true) {
  const pre = first ? [...num0, ...den0].filter((u) => sqf(u.r)[0] > 1).map(convT) : [];
  const num = first ? num0.map(simp) : num0, den = first ? den0.map(simp) : den0;
  const conj = [den[0], neg(den[1])];
  const dGrid = den.map((a) => conj.map((b) => mulRaw(a, b)));
  const dVal = sqV(den[0]) - sqV(den[1]);
  const nGrid = num.map((a) => conj.map((b) => mulRaw(a, b)));
  const nRaw = nGrid.flat(), nSimp = nRaw.map(simp), conv = nRaw.filter((u) => sqf(u.r)[0] > 1).map(convT);
  const nCol = collect(nSimp), grp = groups(nSimp);
  const sg = dVal < 0 ? -1 : 1; let g = Math.abs(dVal); nCol.forEach((u) => (g = gcd(g, u.c)));
  const fin = nCol.map((u) => t(u.c * sg / g, u.r)), fd = Math.abs(dVal) / g;
  return { pre, num, den, conj, dGrid, dVal, nGrid, nRaw, nSimp, conv, nCol, grp, g, sg, fin, fd, finT: fracT(fin, fd) };
}

/* ====================================================================================================
 * Warm-up: The Mental Math Trick. (n + k) × (n − k) tiles: the k-wide strip turns on its side → n × n minus k × k.
 * ==================================================================================================== */
function mountTiles() {
  const host = document.getElementById('u2l6-tiles'); if (!host) return;
  const st = { n: 20, k: 1, t: 0, busy: false };
  const H = 300;
  host.style.position = 'relative';
  const svg = svgEl('svg', { class: 'u2l6-tsvg', height: H }, host);
  const labs = h('div', 'u2l6-tlabs'); host.appendChild(labs);
  const board = h('div', 'u2l6-tboard'); host.appendChild(board);
  const lab = (x, y, s, pos, cls = '') => labs.appendChild(place(h('div', 'u2l6-tlab ' + cls, T(s)), x, y, pos, 6));
  const paint = () => {
    const Wd = Math.max(420, host.clientWidth || 600), FW = Wd - 200;
    svg.setAttribute('width', FW); svg.setAttribute('viewBox', `0 0 ${FW} ${H}`); board.style.left = (FW + 12) + 'px';
    svg.innerHTML = ''; labs.innerHTML = '';
    const { n, k } = st, m = n - k, u = Math.min((FW - 50) / (n + k), (H - 46) / n), x0 = 34, yb = H - 6;
    const grid = (g, x, y, w, hh, cols, rows) => {
      for (let i = 1; i < cols; i++) svgEl('line', { x1: x + i * u, x2: x + i * u, y1: y, y2: y + hh, class: 'u2l6-tgl' }, g);
      for (let j = 1; j < rows; j++) svgEl('line', { x1: x, x2: x + w, y1: y + j * u, y2: y + j * u, class: 'u2l6-tgl' }, g);
    };
    const tt = st.t;
    // the missing corner (only once the strip has moved)
    if (tt > 0.999) svgEl('rect', { x: x0 + m * u, y: yb - n * u, width: k * u, height: k * u, class: 'u2l6-tmiss' }, svg);
    const main = svgEl('g', {}, svg);
    svgEl('rect', { x: x0, y: yb - m * u, width: n * u, height: m * u, class: 'u2l6-tmain' }, main);
    grid(main, x0, yb - m * u, n * u, m * u, n, m);
    const sg = svgEl('g', {}, svg);
    const sx = x0 + n * u, sy = yb - m * u, cx = sx + k * u / 2, cy = yb - m * u / 2;
    const tx = x0 + m * u / 2, ty = yb - m * u - k * u / 2;
    svgEl('rect', { x: sx, y: sy, width: k * u, height: m * u, class: 'u2l6-tstrip' }, sg);
    grid(sg, sx, sy, k * u, m * u, k, m);
    sg.setAttribute('transform', `translate(${((tx - cx) * tt).toFixed(2)} ${((ty - cy) * tt).toFixed(2)}) rotate(${(-90 * tt).toFixed(2)} ${cx.toFixed(2)} ${cy.toFixed(2)})`);
    if (tt < 0.001) {
      lab(x0 + (n + k) * u / 2, yb - m * u, String(n + k), 'n');
      lab(x0, yb - m * u / 2, String(m), 'w');
      lab(x0 + n * u + k * u / 2, yb, String(k), 's', 'u2l6-ta');
    } else if (tt > 0.999) {
      lab(x0 + n * u / 2, yb - n * u, String(n), 'n');
      lab(x0, yb - n * u / 2, String(n), 'w');
      lab(x0 + n * u, yb - n * u + k * u / 2, `${k}\\times${k}`, 'e', 'u2l6-tr');
    }
    const big = (v) => (v >= 1000 ? String(v).replace(/(\d)(\d{3})$/, '$1\\,$2') : String(v));
    board.innerHTML = tt > 0.999
      ? `<div class="u2l6-tbl1">${T(`${n + k}\\times${m}`)}</div><div>${T(`=${n}^2-${k}^2`)}</div><div>${T(`=${big(n * n)}-${k * k}`)}</div><div class="u2l6-tbl2">${T('=' + big(n * n - k * k))}</div>`
      : `<div class="u2l6-tbl1">${T(`${n + k}\\times${m}`)}</div><div class="u2l6-muted">tiles = ?</div>`;
  };
  const mv = document.getElementById('u2l6-wmove');
  const go = async () => {
    if (st.busy) return; st.busy = true;
    const c = liveCtx(), from = st.t, to = st.t > 0.5 ? 0 : 1;
    await tween(c, 900, (e) => { st.t = from + (to - from) * e; paint(); });
    st.t = to; paint(); mv.textContent = to ? 'Put it back' : 'Move the strip'; st.busy = false;
  };
  if (mv) mv.addEventListener('click', go);
  document.querySelectorAll('.u2l6-wp').forEach((b) => b.addEventListener('click', () => {
    if (st.busy) return;
    const [n, k] = b.dataset.wp.split(',').map(Number); st.n = n; st.k = k; st.t = 0; if (mv) mv.textContent = 'Move the strip';
    document.querySelectorAll('.u2l6-wp').forEach((x) => x.classList.toggle('on', x === b)); paint();
  }));
  paint();
  if (window.ResizeObserver) { let w0 = host.clientWidth; new ResizeObserver(() => { if (Math.abs(host.clientWidth - w0) > 2) { w0 = host.clientWidth; paint(); } }).observe(host); }
}

/* ====================================================================================================
 * explainer: square — difference of squares as area
 * ==================================================================================================== */
const SQ = {
  w: { label: 'Warm-up: 7 + √5', A: 7, B: Math.sqrt(5), AT: '7', BT: '\\sqrt5', A2T: '7^2=49', B2T: '(\\sqrt5)^2=5', A2: 49, B2: 5 },
  b: { label: 'Example 1(b): √7 − √2', A: Math.sqrt(7), B: Math.sqrt(2), AT: '\\sqrt7', BT: '\\sqrt2', A2T: '(\\sqrt7)^2=7', B2T: '(\\sqrt2)^2=2', A2: 7, B2: 2 },
  c: { label: 'Example 1(c): 2√5 + 3', A: 2 * Math.sqrt(5), B: 3, AT: '2\\sqrt5', BT: '3', A2T: '(2\\sqrt5)^2=20', B2T: '3^2=9', A2: 20, B2: 9 }
};
const square = {
  title: 'Why the radicals disappear',
  height: 440,
  minW: 860,
  choices: Object.keys(SQ).map((k) => ({ v: k, label: SQ[k].label })),
  intro: 'A big square, a small square cut from its corner, and one piece that moves. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = SQ[k], W = ex.W, A = d.A, B = d.B, res = d.A2 - d.B2;
    const s = Math.min(400 / (A + B), 340 / A), x0 = 125, y0 = 40, As = A * s, Bs = B * s, Ms = (A - B) * s;
    const svg = svgEl('svg', { width: 540, height: 440, viewBox: '0 0 540 440', class: 'u2l6-abs' }, stage);
    svg.style.left = '0px'; svg.style.top = '0px';
    const defs = svgEl('defs', {}, svg), pat = svgEl('pattern', { id: 'u2l6-hatch-' + k, width: 10, height: 10, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, defs);
    svgEl('rect', { width: 10, height: 10, fill: '#fff' }, pat); svgEl('line', { x1: 0, x2: 0, y1: 0, y2: 10, stroke: '#eab3ae', 'stroke-width': 4 }, pat);
    const bot = svgEl('rect', { x: x0, y: y0 + Bs, width: As, height: Ms, fill: '#d5e2fb', stroke: 'none' }, svg);
    const topG = svgEl('g', {}, svg);
    const top = svgEl('rect', { x: x0, y: y0, width: Ms, height: Bs, fill: '#d5e2fb', stroke: 'none' }, topG);
    const cut = svgEl('rect', { x: x0 + Ms, y: y0, width: Bs, height: Bs, fill: '#d5e2fb', stroke: 'none' }, svg);
    const outline = svgEl('rect', { x: x0, y: y0, width: As, height: As, fill: 'none', stroke: DB, 'stroke-width': 3 }, svg);
    const labs = add(stage, h('div', 'u2l6-abs u2l6-sqlabs'), 0, 0);
    const L = (x, y, s2, pos, cls = '') => hide(labs.appendChild(place(h('div', 'u2l6-sqlab ' + cls, T(s2)), x, y, pos, 6)));
    const lTop = L(x0 + As / 2, y0, d.AT, 'n'), lLeft = L(x0, y0 + As / 2, d.AT, 'w');
    const lCut = L(x0 + Ms + Bs / 2, y0 + Bs / 2, String(d.B2), 'c', 'u2l6-sqcut'), lCutS = L(x0 + Ms + Bs / 2, y0, d.BT, 'n', 'u2l6-sqred');
    const lPw = L(x0 + Ms / 2, y0 + Bs / 2, `${d.AT}-${d.BT}`, 'c', 'u2l6-sqp'), lPh = L(x0 + Ms, y0 + Bs / 2, d.BT, 'w', 'u2l6-sqp u2l6-sqin');
    const lBot = L(x0 + (As + Bs) / 2, y0 + As, `${d.AT}+${d.BT}`, 's'), lSide = L(x0, y0 + Bs + Ms / 2, `${d.AT}-${d.BT}`, 'w');
    const lArea = L(x0 + (As + Bs) / 2, y0 + Bs + Ms / 2, `\\text{area}=${res}`, 'c', 'u2l6-sqarea');
    // right: the algebra
    const P = panel(stage, 560, 30, W - 572, 380, 'Area');
    const p1 = hidLine(P, `Big square: ${T(d.A2T)}`), p2 = hidLine(P, `Cut out: ${T(cX(d.B2T))}`), p3 = hidLine(P, `Left: ${T(`${d.A2}-${d.B2}=${res}`)}`);
    const p4 = hidLine(P, `Rectangle: ${T(`(${d.AT}+${d.BT})(${d.AT}-${d.BT})`)}`, 'u2l6-sqgap'), p5 = hidLine(P, T(cG(`=${d.A2}-${d.B2}=${res}`)), 'u2l6-big');
    const p6 = hidLine(P, `<b class="u2l6-cg">No radical left!</b>`);
    [bot, topG, cut, outline].forEach(hide);
    const cxT = x0 + Ms / 2, cyT = y0 + Bs / 2, txT = x0 + As + Bs / 2, tyT = y0 + Bs + Ms / 2;
    return [
      { cap: `A square with side ${T(d.AT)}: its area is ${T(d.A2T)}.`, run: async (c) => { for (const e of [bot, topG, cut, outline]) appear(c, e, 300); await sleep(c, 320); await show(c, lTop); await show(c, lLeft); await show(c, p1); } },
      { cap: `Cut a small square with side ${T(d.BT)} from the corner: area ${T(d.B2T)}. What is left: ${T(`${d.A2}-${d.B2}=${res}`)}.`,
        run: async (c) => { cut.setAttribute('fill', `url(#u2l6-hatch-${k})`); cut.setAttribute('stroke', RD); cut.setAttribute('stroke-width', 2.5); cut.setAttribute('stroke-dasharray', '7 5'); outline.style.opacity = 0; await show(c, lCutS); await show(c, lCut); await show(c, p2); await show(c, p3); } },
      { cap: `Slice the L-shape into two rectangles. The <b class="u2l6-cn">top piece</b> is ${T(d.BT)} tall and ${T(`${d.AT}-${d.BT}`)} wide.`,
        run: async (c) => { top.setAttribute('fill', '#e6dcf8'); top.setAttribute('stroke', NP); top.setAttribute('stroke-width', 2.5); bot.setAttribute('stroke', DB); bot.setAttribute('stroke-width', 2.5); lLeft.style.opacity = 0; await show(c, lPw); await show(c, lPh); } },
      { cap: `Turn the top piece on its side and slide it to the right end of the bottom piece.`,
        run: async (c) => {
          [lTop, lPw, lPh, lCut, lCutS].forEach((e) => (e.style.opacity = 0));
          await tween(c, 1100, (e) => topG.setAttribute('transform', `translate(${((txT - cxT) * e).toFixed(2)} ${((tyT - cyT) * e).toFixed(2)}) rotate(${(90 * e).toFixed(2)} ${cxT} ${cyT})`));
          cut.style.opacity = 0.25;
        } },
      { cap: `A rectangle ${T(`${d.AT}+${d.BT}`)} long and ${T(`${d.AT}-${d.BT}`)} wide, with the same area: ${T(`(${d.AT}+${d.BT})(${d.AT}-${d.BT})=${res}`)}. <b>No radical!</b>`,
        run: async (c) => { cut.style.opacity = 0; await show(c, lBot); await show(c, lSide); await pop(c, lArea); await show(c, p4); await show(c, p5); await show(c, p6); } }
    ];
  }
};

/* ====================================================================================================
 * a multiplication grid (rows × cols), HTML cells inside a host
 * ==================================================================================================== */
function mgrid(host, x, y, o) {
  const g = add(host, h('div', 'u2l6-grid'), x, y), Wg = o.hw + o.cols.length * o.cw, Hg = o.hh + o.rows.length * o.ch;
  box(g, Wg, Hg);
  add(g, box(h('div', 'u2l6-gc u2l6-gx', '×'), o.hw, o.hh), 0, 0);
  const cell = (cls, html, w, hh, cx, cy, color) => { const e = add(g, box(h('div', 'u2l6-gc ' + cls, `<div class="u2l6-gv">${html}</div>`), w, hh), cx, cy); if (color) e.style.color = color; return e; };
  const colEls = o.cols.map((s, j) => cell('u2l6-gh', T(s), o.cw, o.hh, o.hw + j * o.cw, 0, o.cc));
  const rowEls = o.rows.map((s, i) => cell('u2l6-gh', T(s), o.hw, o.ch, 0, o.hh + i * o.ch, o.rc));
  const cells = o.rows.map((_, i) => o.cols.map((_, j) => cell('u2l6-gcell', '', o.cw, o.ch, o.hw + j * o.cw, o.hh + i * o.ch)));
  const svg = svgEl('svg', { width: Wg, height: Hg, class: 'u2l6-gsvg' }, g);
  const fill = (i, j, s) => { const v = cells[i][j].firstChild; v.innerHTML = T(s); fit(v, o.cw - 10, 13); };
  const centre = (i, j) => [o.hw + (j + 0.5) * o.cw, o.hh + (i + 0.5) * o.ch];
  /** draw the cancel link between two cells: a red line through a "0" badge */
  const link = (a, b, label = '0', ok = true) => {
    const [x1, y1] = centre(...a), [x2, y2] = centre(...b), gg = svgEl('g', { class: 'u2l6-glink' + (ok ? '' : ' u2l6-gadd') }, svg);
    svgEl('line', { x1, y1, x2, y2 }, gg);
    const bd = add(g, h('div', 'u2l6-gbadge' + (ok ? '' : ' u2l6-gbadd'), label), (x1 + x2) / 2, (y1 + y2) / 2);
    hide(gg); hide(bd); return { gg, bd };
  };
  return { el: g, colEls, rowEls, cells, svg, fill, link, W: Wg, H: Hg };
}
const showGridHead = async (c, G) => { for (const e of [...G.colEls, ...G.rowEls]) appear(c, e, 260); await sleep(c, 280); };
const fillGrid = async (c, G, vals) => { for (let i = 0; i < vals.length; i++) for (let j = 0; j < vals[i].length; j++) { G.fill(i, j, vals[i][j]); await pop(c, G.cells[i][j].firstChild, 300); } };

/* ====================================================================================================
 * explainer: conj — binomial × conjugate in a grid (Example 1), and a same-sign contrast
 * ==================================================================================================== */
const PC = {
  a: { label: 'Example 1 check: (a)', a: [t(4), t(1, 3)] },
  b: { label: '(b)', a: [t(1, 7), t(-1, 2)] },
  c: { label: '(c)', a: [t(2, 5), t(3)] },
  d: { label: '(d)', a: [t(3, 2), t(-2, 6)] },
  same: { label: 'Not conjugates: (4 + √3)(4 + √3)', a: [t(4), t(1, 3)], same: true }
};
const conj = {
  title: 'The conjugate grid',
  height: 420,
  minW: 860,
  choices: Object.keys(PC).map((k) => ({ v: k, label: PC[k].label })),
  intro: 'Multiply a binomial by its conjugate, every term by every term. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = PC[k], W = ex.W, a = d.a, b = d.same ? a : [a[0], neg(a[1])];
    const cells = a.map((x) => b.map((y) => simp(mulRaw(x, y)))), x1 = cells[0][1], x2 = cells[1][0];
    const sum = collect(cells.flat()), aT = eT(a), bT = eT(b);
    const bar = add(stage, box(h('div', 'u2l6-bar'), W - 20, 76), 10, 4);
    const barL = h('div', 'u2l6-barl', T(`(${cD(aT)})(\\ ?\\ )`)); bar.appendChild(barL);
    const gp = panel(stage, 10, 94, 430, 316, `<span class="u2l6-cd">Binomial</span> × <span class="u2l6-ca">${d.same ? 'the same binomial' : 'conjugate'}</span>`);
    const G = mgrid(gp, 6, 40, { rows: a.map((u, i) => tT(u, i === 0)), cols: b.map((u, i) => tT(u, i === 0)), hw: 96, hh: 54, cw: 158, ch: 104, rc: DB, cc: CA });
    G.el.classList.add('u2l6-gbig');
    [...G.colEls, ...G.rowEls].forEach(hide);
    const L = G.link([0, 1], [1, 0], d.same ? T('\\times2') : '0', !d.same);
    const P = panel(stage, 456, 94, W - 466, 316, d.same ? 'Same sign' : 'Difference of squares');
    const q1 = hidLine(P, `First term squared: ${T(sqT(a[0]) + '=' + sqV(a[0]))}`), q2 = hidLine(P, `Second term squared: ${T(sqT(a[1]) + '=' + sqV(a[1]))}`);
    const q3 = d.same ? hidLine(P, `Cross terms: ${T(`${tT(x1)}${tT(x2, false)}=${tT(t(x1.c + x2.c, x1.r))}`)}`) : hidLine(P, `Cross terms: ${T(`${tT(x1)}${tT(x2, false)}=0`)}`);
    const q4 = hidLine(P, T((d.same ? '' : '') + (d.same ? `${sqV(a[0])}+${sqV(a[1])}${tT(t(x1.c + x2.c, x1.r), false)}=${cX(eT(sum))}` : cG(diffSq(a[0], a[1])))), 'u2l6-big u2l6-mc');
    fit(q4, W - 500, 14);
    const verdict = hide(add(P, h('div', 'u2l6-verd ' + (d.same ? 'u2l6-verd-no' : 'u2l6-verd-ok'), d.same ? '<b>Still has a radical</b>' : '<b>Rational!</b>')));
    const sx = (s2) => T(s2);
    return [
      { cap: d.same ? `Multiply ${T(aT)} by <b>itself</b>. The sign between the terms is the <b>same</b>, so these are not conjugates.` : `Keep both terms of ${T(cD(aT))} and flip the sign between them: the conjugate is ${T(cC(bT))}.`,
        run: async (c) => { await setHTML(c, barL, T(`(${cD(aT)})(${cC(bT)})`), W - 60); await showGridHead(c, G); } },
      { cap: 'Multiply every term by every term: four products.', run: (c) => fillGrid(c, G, cells.map((r) => r.map((u) => tT(u, true)))) },
      { cap: d.same ? `The cross terms ${sx(tT(x1))} and ${sx(tT(x2))} have the <b>same</b> sign: they add up to ${sx(tT(t(x1.c + x2.c, x1.r)))}.` : `The cross terms ${sx(cX(tT(x1)))} and ${sx(cX(tT(x2)))} are opposites: they <b>cancel</b>.`,
        run: async (c) => { [G.cells[0][1], G.cells[1][0]].forEach((e) => e.classList.add(d.same ? 'u2l6-same' : 'u2l6-cancel')); await appear(c, L.gg, 300); await pop(c, L.bd); await show(c, q3); } },
      { cap: d.same ? `${T(`${sqV(a[0])}+${sqV(a[1])}${tT(t(x1.c + x2.c, x1.r), false)}=${eT(sum)}`)}: the radical stays. Only a <b>conjugate</b> clears it.` : `What is left is ${T(diffSq(a[0], a[1]))}: <b>rational</b>.`,
        run: async (c) => { await show(c, q1); await show(c, q2); await show(c, q4); await pop(c, verdict); verdict.style.opacity = 1; } }
    ];
  }
};

/* ====================================================================================================
 * explainer: detect — a radical detector scans the denominator
 * ==================================================================================================== */
const DT = {
  bad: { label: 'Try ×√3 over √3', start: '\\dfrac{1}{2+\\sqrt3}', mult: '\\cdot\\dfrac{\\sqrt3}{\\sqrt3}', expand: '(2+\\sqrt3)\\sqrt3=2\\sqrt3+3', top: '\\sqrt3', toks: ['2\\sqrt3', '+3'], rad: [true, false] },
  good: { label: 'Try the conjugate', start: '\\dfrac{1}{2+\\sqrt3}', mult: `\\cdot\\dfrac{${cC('2-\\sqrt3')}}{${cC('2-\\sqrt3')}}`, expand: '(2+\\sqrt3)(2-\\sqrt3)=4-2\\sqrt3+2\\sqrt3-3', top: '2-\\sqrt3', toks: ['4', '-2\\sqrt3', '+2\\sqrt3', '-3'], rad: [false, true, true, false], after: '1' },
  one: { label: 'Lesson 5: one term, 5 ÷ √3', start: '\\dfrac{5}{\\sqrt3}', mult: '\\cdot\\dfrac{\\sqrt3}{\\sqrt3}', expand: '\\sqrt3\\cdot\\sqrt3=3', top: '5\\sqrt3', toks: ['3'], rad: [false] }
};
const detect = {
  title: 'The radical detector',
  height: 400,
  minW: 860,
  choices: Object.keys(DT).map((k) => ({ v: k, label: DT[k].label })),
  intro: 'Multiply, then run the detector over the denominator: is there a radical left? Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = DT[k], W = ex.W, FW = 560;
    const l1 = add(stage, box(h('div', 'u2l6-dline'), FW, 80), 10, 10); l1.innerHTML = T(d.start);
    const l1b = hide(add(stage, box(h('div', 'u2l6-dline u2l6-dmult'), FW, 50), 10, 92)); l1b.innerHTML = T(d.expand);
    const fr = hide(add(stage, box(h('div', 'u2l6-dfrac'), FW, 200), 10, 160));
    const topEl = h('div', 'u2l6-dtop', T(d.top)); const barEl = h('div', 'u2l6-dbar'); const row = h('div', 'u2l6-drow');
    fr.append(topEl, barEl, row);
    const toks = d.toks.map((s) => { const e = h('div', 'u2l6-tok', T(s)); row.appendChild(e); return e; });
    const one = d.after ? h('div', 'u2l6-tok', T(d.after)) : null;
    const scan = hide(add(stage, box(h('div', 'u2l6-scan', '<div class="u2l6-scanl">detector</div>'), 34, 96), 240, 252));
    const P = panel(stage, FW + 30, 20, W - FW - 40, 360, 'Radical detector');
    const lamp = h('div', 'u2l6-lamp'); P.appendChild(lamp);
    const read = h('div', 'u2l6-read', 'waiting…'); P.appendChild(read);
    const res = hidLine(P, '', 'u2l6-dres');
    const ok = !d.rad.some((v, i) => v) || !!d.after;
    const stp = stamp(stage, ok ? '✓' : '✗', { ok, x: FW - 50, y: 330, size: 'lg' }); hide(stp);
    const sweep = async (c) => {
      const els = d.after ? [one] : toks, rect0 = fr.getBoundingClientRect(), sc = stage.getBoundingClientRect().width / (stage.offsetWidth || 1) || 1;
      const xs = els.map((e) => { const r = e.getBoundingClientRect(); return { e, x: (r.left - stage.getBoundingClientRect().left) / sc + r.width / sc / 2 }; });
      const x0 = Math.min(...xs.map((q) => q.x)) - 80, x1 = Math.max(...xs.map((q) => q.x)) + 80;
      scan.style.opacity = 1;
      await tween(c, 1400, (e) => {
        const x = x0 + (x1 - x0) * e; scan.style.left = (x - 17) + 'px';
        xs.forEach((q, i) => { if (q.x <= x) q.e.classList.add(!d.after && d.rad[i] ? 'u2l6-tokbad' : 'u2l6-tokok'); });
      });
      scan.style.opacity = 0;
      lamp.classList.add(ok ? 'u2l6-lamp-ok' : 'u2l6-lamp-no');
      read.innerHTML = ok ? '<b class="u2l6-cg">No radical found</b>' : `<b class="u2l6-cx">Radical found:</b> ${T(cX('2\\sqrt3'))}`;
    };
    const steps = [{ cap: k === 'one' ? `One term in the denominator: ${T('\\sqrt3')}.` : `The denominator ${T(cD('2+\\sqrt3'))} has <b>two terms</b>.`, run: (c) => show(c, l1) }];
    if (k === 'bad') {
      steps.push({ cap: `Lesson 5’s trick: multiply the top and bottom by ${T('\\sqrt3')}…`, run: (c) => setHTML(c, l1, T(d.start + d.mult), FW) });
      steps.push({ cap: `Distribute: ${T(d.expand)}.`, run: async (c) => { await show(c, l1b); await show(c, fr); } });
      steps.push({ cap: `Scan the denominator… ${T(cX('2\\sqrt3'))} is still there. <b>Not rationalized.</b>`, run: async (c) => { await sweep(c); res.innerHTML = 'The bottom just changed shape.'; await show(c, res); await stampIn(c, stp); } });
    } else if (k === 'good') {
      steps.push({ cap: `Multiply the top and bottom by the <b class="u2l6-ca">conjugate</b> ${T(cC('2-\\sqrt3'))}.`, run: (c) => setHTML(c, l1, T(d.start + d.mult), FW) });
      steps.push({ cap: `Expand the bottom: ${T('4-2\\sqrt3+2\\sqrt3-3')}.`, run: async (c) => { await show(c, l1b); await show(c, fr); } });
      steps.push({ cap: `The cross terms cancel: ${T('4-3=1')}.`, run: async (c) => { toks.forEach((e, i) => e.classList.add(d.rad[i] ? 'u2l6-tokx' : 'u2l6-tokdim')); await sleep(c, 500); toks.forEach((e) => (e.style.display = 'none')); row.appendChild(one); await pop(c, one); } });
      steps.push({ cap: `Scan: no radical left. ${T('\\dfrac{2-\\sqrt3}{1}=2-\\sqrt3')}.`, run: async (c) => { await sweep(c); res.innerHTML = T(cG('\\dfrac{1}{2+\\sqrt3}=2-\\sqrt3')); await show(c, res); await stampIn(c, stp); } });
    } else {
      steps.push({ cap: `Multiply by ${T('\\tfrac{\\sqrt3}{\\sqrt3}')}: ${T('\\sqrt3\\cdot\\sqrt3=3')}.`, run: async (c) => { await setHTML(c, l1, T(d.start + d.mult), FW); await show(c, l1b); await show(c, fr); } });
      steps.push({ cap: `Scan: no radical. ${T('\\dfrac{5\\sqrt3}{3}')}. This works for <b>one</b> term; <b>two</b> terms need the conjugate.`, run: async (c) => { await sweep(c); res.innerHTML = T(cG('\\dfrac{5}{\\sqrt3}=\\dfrac{5\\sqrt3}{3}')); await show(c, res); await stampIn(c, stp); } });
    }
    return steps;
  }
};

/* ====================================================================================================
 * explainer: machine (STAR) — the conjugate machine
 * ==================================================================================================== */
const CHECK = ['No radical in the denominator', 'Radicals in simplest form', 'Like terms collected', 'Reduced by a factor of every term', 'Denominator positive'];
function checklist(stage, x, y, w, hh) {
  const p = panel(stage, x, y, w, hh, 'Simplest form?', 'u2l6-ck');
  const rows = CHECK.map((s) => { const r = h('div', 'u2l6-ckr', `<div class="u2l6-ckb"></div><div class="u2l6-ckt">${s}<div class="u2l6-ckn"></div></div>`); p.appendChild(r); return r; });
  const tick = async (c, i, note) => { const r = rows[i], b = r.querySelector('.u2l6-ckb'); r.classList.add('on'); r.querySelector('.u2l6-ckn').innerHTML = note || ''; b.textContent = '✓'; await pop(c, b, 340); };
  return { p, rows, tick };
}
function ratSteps(stage, d, ex) {
  const W = ex.W, R = rationalize(d.num, d.den, d.first !== false);
  const origT = `\\dfrac{${eT(d.num)}}{${cD(eT(d.den))}}`, nowT = `\\dfrac{${eT(R.num)}}{${cD(eT(R.den))}}`, conjT = eT(R.conj);
  const multT = `${R.pre.length ? nowT : origT}\\cdot\\dfrac{${cC(conjT)}}{${cC(conjT)}}`;
  // ---- the bar: the problem, then × conjugate over conjugate, then the answer
  const bar = add(stage, box(h('div', 'u2l6-bar'), W - 20, 84), 10, 4);
  const barL = h('div', 'u2l6-barl', T(origT)); bar.appendChild(barL);
  const barR = hide(h('div', 'u2l6-barr', T(`=${cG(R.finT)}`))); bar.appendChild(barR);
  // ---- the two grids
  const GW = 292, GH = 206, GY = 98;
  const dp = panel(stage, 10, GY, GW, GH, `<span class="u2l6-cd">Denominator</span> × <span class="u2l6-ca">conjugate</span>`);
  const DG = mgrid(dp, 2, 32, { rows: R.den.map((u, i) => tT(u, i === 0)), cols: R.conj.map((u, i) => tT(u, i === 0)), hw: 76, hh: 40, cw: 104, ch: 62, rc: DB, cc: CA });
  const np = panel(stage, 312, GY, GW, GH, `<span class="u2l6-cn">Numerator</span> × <span class="u2l6-ca">conjugate</span>`);
  const nr = R.num.length;
  const NG = mgrid(np, 2, nr === 1 ? 63 : 32, { rows: R.num.map((u, i) => tT(u, i === 0)), cols: R.conj.map((u, i) => tT(u, i === 0)), hw: 76, hh: 40, cw: 104, ch: 62, rc: NP, cc: CA });
  [...DG.colEls, ...DG.rowEls, ...NG.colEls, ...NG.rowEls].forEach(hide);
  const LK = DG.link([0, 1], [1, 0]);
  // ---- the working, and the checklist
  const wp = panel(stage, 10, GY + GH + 10, 594, 516 - GY - GH - 10 - 4, '', 'u2l6-work');
  const r1 = hidLine(wp, '', 'u2l6-wl'), r2 = hidLine(wp, '', 'u2l6-wl'), r3 = hidLine(wp, '', 'u2l6-wl u2l6-wl3');
  const CK = checklist(stage, 616, GY, W - 626, 418);
  const stp = stamp(stage, 'simplest form ✓', { ok: true, x: 505, y: 478, size: 'sm', rotate: -6 }); hide(stp);
  // ---- captions (computed now)
  const nTerms = R.nRaw.length, x1 = R.dGrid[0][1], x2 = R.dGrid[1][0];
  const nProd = nr === 1 ? (R.num[0].c === 1 && R.num[0].r === 1 ? par(R.conj) : `${tT(R.num[0])}${par(R.conj)}`) : `${par(R.num)}${par(R.conj)}`;
  const numLine = (() => { let s = `${nProd}=${eT(R.nRaw)}`; if (R.conv.length) s += `=${eT(R.nSimp)}`; if (R.grp.length) s += `=${eT(R.nCol)}`; return s; })();
  const red = R.g > 1 || R.sg < 0, div = R.sg * R.g;
  const steps = [];
  if (R.pre.length) steps.push({ cap: `Simplest form first: ${R.pre.map(T).join(', ')}. Smaller numbers from here on.`, run: (c) => setHTML(c, barL, T(`${origT}=${nowT}`), W - 60) });
  steps.push({ cap: `The denominator has <b>two terms</b>. Flip the sign between them for the <b class="u2l6-ca">conjugate</b> ${T(cC(conjT))}, and multiply by ${T(`\\tfrac{${cC(conjT)}}{${cC(conjT)}}`)}, a form of 1.`,
    run: async (c) => { await setHTML(c, barL, T((R.pre.length ? origT + '=' : '') + multT), W - 60); await showGridHead(c, DG); } });
  steps.push({ cap: `<b>Bottom:</b> multiply every term of the denominator by every term of the conjugate.`, run: (c) => fillGrid(c, DG, R.dGrid.map((r) => r.map((u) => tT(u)))) });
  steps.push({ cap: `The cross terms ${T(cX(tT(x1)))} and ${T(cX(tT(x2)))} are opposites: they <b>cancel</b>.`,
    run: async (c) => { [DG.cells[0][1], DG.cells[1][0]].forEach((e) => e.classList.add('u2l6-cancel')); await appear(c, LK.gg, 300); await pop(c, LK.bd); } });
  steps.push({ cap: `Left: ${T(diffSq(R.den[0], R.den[1]))}. <b>No radical in the denominator!</b>`,
    run: async (c) => { [DG.cells[0][0], DG.cells[1][1]].forEach((e) => e.classList.add('u2l6-keep')); await setHTML(c, r1, `<span class="u2l6-wh u2l6-cd">Bottom</span>${T(cG(diffSq(R.den[0], R.den[1])))}`, 570); await CK.tick(c, 0, T(cG(String(R.dVal)))); } });
  steps.push({ cap: nr === 1 ? `<b>Top:</b> the same conjugate multiplies the numerator.` : `<b>Top:</b> the numerator has two terms too, so it gets a grid of its own (FOIL).`,
    run: async (c) => { await showGridHead(c, NG); await fillGrid(c, NG, R.nGrid.map((r) => r.map((u) => tT(u)))); } });
  const s6 = [];
  if (R.conv.length) s6.push(`simplify ${R.conv.map(T).join(', ')}`);
  if (R.grp.length) s6.push(`collect like terms ${R.grp.map((g) => T(g.tex)).join(', ')}`);
  steps.push({ cap: s6.length ? `Now ${s6.join(', then ')}: the top is ${T(eT(R.nCol))}.` : `Nothing to simplify or collect: the top is ${T(eT(R.nCol))}.`,
    run: async (c) => {
      R.grp.forEach((g, gi) => g.ix.forEach((i) => NG.cells[Math.floor(i / 2)][i % 2].classList.add('u2l6-like' + gi)));
      await setHTML(c, r2, `<span class="u2l6-wh u2l6-cn">Top</span>${T(numLine)}`, 570);
      await CK.tick(c, 1, R.conv.length ? T(R.conv[0]) : 'already simplest');
      await CK.tick(c, 2, R.grp.length ? T(R.grp[0].tex) : (nTerms > 1 ? 'no like terms' : 'one term'));
    } });
  const one = R.fd === 1 ? ' A denominator of 1 is not written.' : '';
  const capR = R.g > 1
    ? `Every term and the ${R.sg < 0 ? '<b>negative</b> ' : ''}denominator share the factor ${T(String(R.g))}: divide them all by ${T(String(div))}: ${T(cG(R.finT))}.${one}`
    : R.sg < 0 ? `The denominator is negative: divide every term by ${T('-1')}: ${T(cG(R.finT))}.${one}`
      : `No factor other than 1 divides every term, and the denominator is positive: ${T(cG(R.finT))} is done.`;
  steps.push({ cap: capR,
    run: async (c) => {
      await setHTML(c, r3, `<span class="u2l6-wh">${red ? 'Reduce' : 'Done'}</span>${T(`\\dfrac{${eT(R.nCol)}}{${R.dVal}}${red ? `\\xrightarrow{\\ \\div ${div < 0 ? `(${div})` : div}\\ }` : '='}${cG(R.finT)}`)}`, 570);
      await CK.tick(c, 3, R.g > 1 ? T(`\\div${R.g}`) : 'no common factor');
      await CK.tick(c, 4, R.sg < 0 ? 'made positive' : 'already positive');
      await setHTML(c, barL, T(multT), (W - 60) * 0.58); barR.style.opacity = 1; fit(barR, (W - 60) * 0.4); await pop(c, barR); await stampIn(c, stp);
    } });
  return steps;
}
function machineDef(title, CH, intro) {
  return { title, height: 520, minW: 900, choices: Object.keys(CH).map((k) => ({ v: k, label: CH[k].label })), intro, make: (stage, k, ex) => ratSteps(stage, CH[k], ex) };
}
const M2 = {
  try: { label: 'Try: 1 ÷ (2 + √3)', num: [t(1)], den: [t(2), t(1, 3)] },
  a: { label: 'Example 2 check: (a)', num: [t(6)], den: [t(3), t(-1, 5)] },
  b: { label: '(b)', num: [t(10)], den: [t(1, 7), t(1, 2)] },
  c: { label: '(c)', num: [t(1, 3)], den: [t(2, 3), t(-3)] },
  d: { label: '(d)', num: [t(4)], den: [t(1, 6), t(-2, 2)] }
};
const M3 = {
  try: { label: 'Try: (√2 + 1) ÷ (√2 − 1)', num: [t(1, 2), t(1)], den: [t(1, 2), t(-1)] },
  a: { label: 'Example 3 check: (a)', num: [t(1, 5), t(1)], den: [t(1, 5), t(-1)] },
  b: { label: '(b)', num: [t(2, 3), t(-1, 2)], den: [t(1, 3), t(1, 2)] },
  c: { label: '(c)', num: [t(1, 6), t(3)], den: [t(1, 6), t(-2)] }
};
const M4 = {
  af: { label: 'Example 4(a): simplify first', num: [t(1, 6)], den: [t(1, 18), t(1, 12)] },
  al: { label: 'Example 4(a): simplify at the end', num: [t(1, 6)], den: [t(1, 18), t(1, 12)], first: false },
  b: { label: 'Example 4(b) check', num: [t(6), t(-1, 12)], den: [t(1, 3), t(-1)] }
};
const machine = machineDef('The conjugate machine', M2, 'Feed in a fraction: the machine multiplies by the <b>conjugate</b>, then works through the <b>simplest form</b> checklist. Press <b>Next</b>.');
const machine2 = machineDef('The conjugate machine: two terms on top', M3, 'Two terms on top means a second grid for the numerator. Press <b>Next</b>.');
const machine3 = machineDef('The conjugate machine: simplify first?', M4, 'Compare simplifying the radicals <b>first</b> with simplifying them <b>at the end</b>. Press <b>Next</b>.');

/* ====================================================================================================
 * explainer: reduce — a factor of every term
 * ==================================================================================================== */
const RDC = {
  a: { label: 'Example 2(a) check', top: [t(18), t(6, 5)], d: 4 },
  c3: { label: 'Example 3(c) check', top: [t(12), t(5, 6)], d: 2 },
  e4: { label: 'Example 4(a) check', top: [t(6, 3), t(-6, 2)], d: 6 },
  trap: { label: 'The trap: (6 + 2√5) ÷ 4', top: [t(6), t(2, 5)], d: 4, trap: true }
};
const coefT = (u, lead) => { const a = Math.abs(u.c), s = u.c < 0 ? '-' : lead ? '' : '+'; return `${s}${cC(String(a))}${u.r > 1 ? `\\sqrt{${u.r}}` : ''}`; };
const reduce = {
  title: 'A factor of every term',
  height: 420,
  minW: 860,
  choices: Object.keys(RDC).map((k) => ({ v: k, label: RDC[k].label })),
  intro: 'To reduce, a factor must divide <b>every</b> term on top <b>and</b> the denominator. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = RDC[k], W = ex.W, all = [...d.top.map((u) => Math.abs(u.c)), d.d];
    const mn = Math.min(...all), cands = []; for (let f = 2; f <= mn; f++) if (mn % f === 0) cands.push(f);
    const g = all.reduce(gcd), fin = d.top.map((u) => t(u.c / g, u.r)), fd = d.d / g, finT = fracT(fin, fd);
    const FX = 30, TW = 430;
    // the tiles
    const topRow = add(stage, box(h('div', 'u2l6-rrow'), TW, 74), FX, 40);
    const tiles = d.top.map((u, i) => { const e = h('div', 'u2l6-rtile', T(coefT(u, i === 0))); topRow.appendChild(e); return e; });
    add(stage, box(h('div', 'u2l6-rbar'), TW - 60, 4), FX + 30, 126);
    const botRow = add(stage, box(h('div', 'u2l6-rrow'), TW, 74), FX, 140);
    const dt = h('div', 'u2l6-rtile', T(cC(String(d.d)))); botRow.appendChild(dt);
    const out = hide(add(stage, box(h('div', 'u2l6-rout'), TW + 20, 90), FX - 10, 240));
    const wrong = d.trap ? hide(add(stage, box(h('div', 'u2l6-rwrong'), TW + 20, 80), FX - 10, 320)) : null;
    if (wrong) wrong.innerHTML = `Not: ${T(cX('\\dfrac{6+\\sqrt5}{2}'))}`;
    const wst = d.trap ? hide(stamp(stage, '✗', { ok: false, x: FX + 360, y: 360, size: 'sm' })) : null;
    // the factor test table
    const P = panel(stage, 490, 20, W - 500, 380, 'Does it divide?');
    const tb = h('table', 'u2l6-rtab'); P.appendChild(tb);
    tb.innerHTML = `<tr><th>factor</th>${d.top.map((u, i) => `<th>${T(tT(u, i === 0))}</th>`).join('')}<th>${T(String(d.d))}</th></tr>`;
    const rowsE = cands.map((f) => { const tr = h('tr', ''); tr.innerHTML = `<td>${T(String(f))}</td>` + all.map((v) => `<td class="${v % f === 0 ? 'u2l6-yes' : 'u2l6-no'}">${v % f === 0 ? '✓' : '✗'}</td>`).join(''); tb.appendChild(tr); return hide(tr); });
    const best = cands.filter((f) => all.every((v) => v % f === 0)).pop();
    const note = hidLine(P, best ? `Biggest factor of every term: <b>${best}</b>` : '<b>No factor of every term.</b>', 'u2l6-rnote');
    const ok = hide(stamp(stage, g > 1 ? `÷ ${g}` : 'simplest ✓', { ok: g > 1 ? null : true, x: FX + TW - 50, y: 285, size: 'sm' }));
    const listT = all.map((v) => T(cC(String(v)))).join(', ');
    const steps = [];
    if (d.trap) {
      steps.push({ cap: `Tempting: divide ${T('2\\sqrt5')} and the ${T('4')} by 2 and stop…`, run: async (c) => { await show(c, wrong); } });
      steps.push({ cap: `…but the ${T('6')} was not divided. Split the fraction: ${T('\\tfrac64+\\tfrac{2\\sqrt5}{4}')}. <b>Both</b> pieces must be divided.`, run: async (c) => { await stampIn(c, wst); } });
    }
    steps.push({ cap: `Look at the number in front of every term, top and bottom: ${listT}. (The radical is not a factor to cancel.)`,
      run: async (c) => { for (const e of [...tiles, dt]) { e.classList.add('u2l6-rhi'); await pulse(c, e, 1.08, 300); } } });
    steps.push({ cap: `Only a factor of the smallest number, ${T(String(mn))}, can divide them all.${cands.length ? ` Test ${cands.map((f) => T(String(f))).join(' and ')}.` : ''}`,
      run: async (c) => { for (const r of rowsE) await show(c, r); } });
    if (g > 1) {
      steps.push({ cap: `${T(String(g))} divides every term, so it is the factor to use.`, run: async (c) => { rowsE[cands.indexOf(best)].classList.add('u2l6-rbest'); await show(c, note); } });
      steps.push({ cap: `Divide every term, top and bottom, by ${T(String(g))}: ${T(cG(finT))}.${fd === 1 ? ' A denominator of 1 is not written.' : ''}`,
        run: async (c) => {
          await stampIn(c, ok);
          tiles.forEach((e, i) => { e.innerHTML = T(tT(fin[i], i === 0)); e.classList.remove('u2l6-rhi'); }); dt.innerHTML = T(String(fd)); dt.classList.remove('u2l6-rhi');
          for (const e of [...tiles, dt]) await pop(c, e, 300);
          out.innerHTML = T(`\\dfrac{${eT(d.top)}}{${d.d}}=${cG(finT)}`); await show(c, out);
        } });
    } else {
      steps.push({ cap: `${T('2')} divides ${T('12')} and ${T('2')}, but <b>not</b> ${T('5')}. No factor divides every term: ${T(cG(finT))} is already reduced.`,
        run: async (c) => { await show(c, note); out.innerHTML = T(cG(finT)); await show(c, out); await stampIn(c, ok); } });
    }
    return steps;
  }
};

/* ====================================================================================================
 * explainer: restrict — restrictions with variables (Example 5)
 * ==================================================================================================== */
const RS = {
  a: { label: 'Example 5(a) check' }, b: { label: '(b)' }, c: { label: '(c)' }
};
const restrict = {
  title: 'Restrictions on the variable',
  height: 440,
  minW: 860,
  choices: Object.keys(RS).map((k) => ({ v: k, label: RS[k].label })),
  intro: 'Radicands must be ≥ 0, and no denominator can be 0. Press <b>Next</b>.',
  make(stage, k, ex) {
    const W = ex.W;
    if (k === 'c') return restrictAB(stage, W);
    const A = k === 'a';
    const N = new NumberLine(stage, { x: 10, y: 66, width: W - 20, height: 130, min: -2, max: 12, step: 1, labelStep: 1, axisY: 80, pad: 40 });
    const head = add(stage, box(h('div', 'u2l6-rshead'), W - 20, 66), 10, 2);
    head.innerHTML = T(A ? `\\dfrac{3}{${cD('\\sqrt x+2')}}` : `\\dfrac{2\\sqrt x}{${cD('\\sqrt x-3')}}`);
    const ok = N.interval(0, Infinity, { color: GR, width: 9 }); hide(ok);
    const hole = A ? N.point(4, { open: true, color: CA, r: 10 }) : N.point(9, { open: true, color: RD, r: 10 }); hide(hole);
    const hl = A ? N.mark(4, `<b class="u2l6-ca">x ≠ 4</b> for the new form`, { lift: 18 }) : N.mark(9, `<b class="u2l6-cx">x ≠ 9</b>`, { lift: 18 }); hide(hl);
    const zl = N.mark(0, '<b class="u2l6-cg">x ≥ 0</b>', { lift: 18 }); hide(zl);
    const L = panel(stage, 10, 204, (W - 30) / 2, 230, 'Restrictions'), Rp = panel(stage, 20 + (W - 30) / 2, 204, (W - 30) / 2, 230, 'Rationalize');
    const a1 = hidLine(L, `Radicand: ${T('x\\ge0')}`);
    const a2 = hidLine(L, A ? `${T('\\sqrt x+2=0')} needs ${T('\\sqrt x=-2')}: <b>impossible</b>, ${T('\\sqrt x')} is never negative.` : `${T('\\sqrt x-3=0')} when ${T('\\sqrt x=3')}, so ${T('x=9')}.`, 'u2l6-small');
    const a3 = hidLine(L, T(cG(A ? 'x\\ge0' : 'x\\ge0,\\ x\\ne9')), 'u2l6-big');
    const b1 = hidLine(Rp, `Bottom: ${T(A ? `(\\sqrt x+2)(${cC('\\sqrt x-2')})=x-4` : `(\\sqrt x-3)(${cC('\\sqrt x+3')})=x-9`)}`, 'u2l6-small');
    const b2 = hidLine(Rp, `Top: ${T(A ? `3(${cC('\\sqrt x-2')})=3\\sqrt x-6` : `2\\sqrt x(${cC('\\sqrt x+3')})=2x+6\\sqrt x`)}`, 'u2l6-small');
    const b3 = hidLine(Rp, T(cG(A ? '\\dfrac{3\\sqrt x-6}{x-4}' : '\\dfrac{2x+6\\sqrt x}{x-9}')), 'u2l6-big');
    const b4 = A ? hidLine(Rp, `<span class="u2l6-ca">(${T('x\\ne4')} is needed for this form)</span>`, 'u2l6-small') : null;
    const steps = [
      { cap: `The radicand of ${T('\\sqrt x')} must not be negative: ${T('x\\ge0')}.`, run: async (c) => { await drawIn(ok, 700, c); ok.style.opacity = 1; await show(c, zl); await show(c, a1); } },
      { cap: A ? `Can the denominator be 0? ${T('\\sqrt x+2=0')} needs ${T('\\sqrt x=-2')}, which never happens. No other restriction.` : `The denominator is 0 when ${T('\\sqrt x=3')}, that is ${T('x=9')}: punch a hole at 9.`,
        run: async (c) => { await show(c, a2); if (!A) { await pop(c, hole); hole.style.opacity = 1; await show(c, hl); } await show(c, a3); } },
      { cap: `Multiply by the conjugate ${T(cC(A ? '\\sqrt x-2' : '\\sqrt x+3'))}. With ${T('x\\ge0')}, ${T('\\sqrt x\\cdot\\sqrt x=x')}, so the bottom is ${T(A ? 'x-4' : 'x-9')}.`, run: async (c) => { await show(c, b1); await show(c, b2); } },
      { cap: A ? `${T('\\dfrac{3\\sqrt x-6}{x-4}')}. Careful: this new form divides by ${T('x-4')}, so it needs ${T('x\\ne4')}.` : `${T('\\dfrac{2x+6\\sqrt x}{x-9}')} with ${T('x\\ge0,\\ x\\ne9')}.`,
        run: async (c) => { await show(c, b3); if (A) { await pop(c, hole); hole.style.opacity = 1; await show(c, hl); await show(c, b4); } } }
    ];
    return steps;
  }
};
function restrictAB(stage, W) {
  const G = new Graph(stage, { x: 10, y: 10, width: 380, height: 420, xmin: -1, xmax: 8, ymin: -1, ymax: 8, xtitle: 'a', ytitle: 'b', xlabels: 2, ylabels: 2, fontSize: 16 });
  const reg = G.polyline([[0, 0], [9, 0], [9, 9], [0, 9]], { closed: true, fill: '#cdeedd', fillOpacity: 0.75, color: GR, width: 2.5 }); hide(reg);
  const diag = G.segment([0, 0], [9, 9], { color: RD, width: 4, dash: '9 7' }); hide(diag);
  const dl = G.label(5.6, 6.5, `<b class="u2l6-cx">a = b</b> removed`, { pos: 'nw', cls: 'bk-ptlab' }); hide(dl);
  const o0 = G.point(0, 0, { open: true, color: RD, r: 8 }); hide(o0);
  const P = panel(stage, 410, 10, W - 420, 420, T(`\\dfrac{\\sqrt a-\\sqrt b}{${cD('\\sqrt a+\\sqrt b')}}`));
  const a1 = hidLine(P, `Two radicands: ${T('a\\ge0')} and ${T('b\\ge0')}.`);
  const a2 = hidLine(P, `${T('\\sqrt a+\\sqrt b=0')} only when ${T('a=b=0')}.`, 'u2l6-small');
  const b1 = hidLine(P, `Bottom: ${T(`(\\sqrt a+\\sqrt b)(${cC('\\sqrt a-\\sqrt b')})=a-b`)}`, 'u2l6-small');
  const b2 = hidLine(P, `Top: ${T(`(\\sqrt a-\\sqrt b)(${cC('\\sqrt a-\\sqrt b')})=a-2\\sqrt{ab}+b`)}`, 'u2l6-small');
  const b3 = hidLine(P, T(cG('\\dfrac{a-2\\sqrt{ab}+b}{a-b}')) + '&ensp;' + T(cG('a\\ge0,\\ b\\ge0,\\ a\\ne b')), 'u2l6-big');
  return [
    { cap: `Two radicands, so two restrictions: ${T('a\\ge0')} and ${T('b\\ge0')}. Every allowed pair ${T('(a,\\ b)')} is in the shaded corner.`, run: async (c) => { await appear(c, reg, 500); await show(c, a1); } },
    { cap: `${T('\\sqrt a+\\sqrt b')} is 0 only at ${T('a=b=0')}, the corner point.`, run: async (c) => { await pop(c, o0); o0.style.opacity = 1; await show(c, a2); } },
    { cap: `Multiply by the conjugate ${T(cC('\\sqrt a-\\sqrt b'))}. The top becomes a perfect square: ${T('(\\sqrt a-\\sqrt b)^2=a-2\\sqrt{ab}+b')}.`, run: async (c) => { await show(c, b1); await show(c, b2); } },
    { cap: `The new denominator ${T('a-b')} is 0 whenever ${T('a=b')}: remove that whole line. Answer: ${T('a\\ge0,\\ b\\ge0,\\ a\\ne b')}.`,
      run: async (c) => { await drawIn(diag, 700, c); diag.style.opacity = 1; await show(c, dl); await show(c, b3); } }
  ];
}

/* ====================================================================================================
 * explainer: combine — rationalize each piece, then collect like radicals in two bins (Example 6)
 * ==================================================================================================== */
const CB = {
  a: { label: 'Example 6 check: (a)', expr: `${cN('(2\\sqrt3-1)(\\sqrt3+4)')}-${cD('\\dfrac{6}{\\sqrt3}')}`, rad: '\\sqrt3',
    p1: ['\\text{FOIL: }(2\\sqrt3-1)(\\sqrt3+4)', '=6+8\\sqrt3-\\sqrt3-4'], p2: ['-\\dfrac{6}{\\sqrt3}\\cdot\\dfrac{\\sqrt3}{\\sqrt3}', '=-\\dfrac{6\\sqrt3}{3}=-2\\sqrt3'],
    nums: ['+6', '-4'], rads: ['+8\\sqrt3', '-\\sqrt3', '-2\\sqrt3'], nsum: '2', rsum: '5\\sqrt3', ans: '2+5\\sqrt3',
    cap1: 'Order of operations: the <b class="u2l6-cn">product</b> and the <b class="u2l6-cd">division</b> first, then subtract.' },
  b: { label: '(b)', expr: `${cN('\\dfrac{1}{2+\\sqrt3}')}+${cD('\\dfrac{1}{2-\\sqrt3}')}`, rad: '\\sqrt3',
    p1: [`\\dfrac{1}{2+\\sqrt3}\\cdot\\dfrac{${cC('2-\\sqrt3')}}{${cC('2-\\sqrt3')}}`, '=\\dfrac{2-\\sqrt3}{4-3}=2-\\sqrt3'], p2: [`\\dfrac{1}{2-\\sqrt3}\\cdot\\dfrac{${cC('2+\\sqrt3')}}{${cC('2+\\sqrt3')}}`, '=\\dfrac{2+\\sqrt3}{4-3}=2+\\sqrt3'],
    nums: ['+2', '+2'], rads: ['-\\sqrt3', '+\\sqrt3'], nsum: '4', rsum: '0', ans: '4', cancel: true,
    cap1: 'Two fractions with binomial denominators: rationalize <b>each one first</b>, each with its own conjugate.' },
  c: { label: '(c)', expr: `${cN('\\dfrac{3}{\\sqrt5}')}-${cD('\\dfrac{2}{\\sqrt5+1}')}`, rad: '\\sqrt5', over: 10,
    p1: ['\\dfrac{3}{\\sqrt5}\\cdot\\dfrac{\\sqrt5}{\\sqrt5}', '=\\dfrac{3\\sqrt5}{5}=\\dfrac{6\\sqrt5}{10}'], p2: [`-\\dfrac{2}{\\sqrt5+1}\\cdot\\dfrac{${cC('\\sqrt5-1')}}{${cC('\\sqrt5-1')}}`, '=-\\dfrac{2(\\sqrt5-1)}{4}=-\\dfrac{\\sqrt5-1}{2}', '=-\\dfrac{5\\sqrt5-5}{10}'],
    nums: ['+5'], rads: ['+6\\sqrt5', '-5\\sqrt5'], nsum: '5', rsum: '\\sqrt5', ans: '\\dfrac{\\sqrt5+5}{10}',
    cap1: 'A one-term denominator and a two-term one: rationalize each, then use a <b>common denominator</b>.' }
};
const combine = {
  title: 'Rationalize, then collect',
  height: 492,
  minW: 880,
  choices: Object.keys(CB).map((k) => ({ v: k, label: CB[k].label })),
  intro: 'Each piece gets rationalized on its own; then like radicals are collected, just like like terms. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = CB[k], W = ex.W, CW = (W - 30) / 2;
    const bar = add(stage, box(h('div', 'u2l6-bar u2l6-cbar'), W - 20, 70), 10, 4); bar.innerHTML = `<div class="u2l6-barl">${T(d.expr)}</div>`;
    const c1 = panel(stage, 10, 84, CW, 186, '', 'u2l6-cpiece u2l6-cp1'), c2 = panel(stage, 20 + CW, 84, CW, 186, '', 'u2l6-cpiece u2l6-cp2');
    const p1 = d.p1.map((s) => hidLine(c1, T(s), 'u2l6-cl')), p2 = d.p2.map((s) => hidLine(c2, T(s), 'u2l6-cl'));
    [...p1, ...p2].forEach((e) => fit(e, CW - 30, 13));
    const tray = panel(stage, 10, 280, W - 20, 204, d.over ? `Collect (everything over ${d.over})` : 'Collect like terms', 'u2l6-tray');
    const binW = (W - 220) / 2;
    const bN = add(tray, box(h('div', 'u2l6-bin'), binW, 150), 12, 40), bR = add(tray, box(h('div', 'u2l6-bin u2l6-binr'), binW, 150), 24 + binW, 40);
    bN.innerHTML = '<div class="u2l6-binh">numbers</div>'; bR.innerHTML = `<div class="u2l6-binh">${T(d.rad)}’s</div>`;
    const tn = d.nums.map((s) => hide(bN.appendChild(h('div', 'u2l6-tile', T(s))))), tr = d.rads.map((s) => hide(bR.appendChild(h('div', 'u2l6-tile u2l6-tiler', T(s)))));
    const sN = hide(bN.appendChild(h('div', 'u2l6-binsum', T('=' + d.nsum)))), sR = hide(bR.appendChild(h('div', 'u2l6-binsum', T('=' + d.rsum))));
    const ans = hide(add(tray, box(h('div', 'u2l6-cans'), 150, 150), W - 20 - 176, 40)); ans.innerHTML = `<div class="u2l6-binh">answer</div>${T(cG(d.ans))}`;
    const st = d.cancel ? hide(stamp(stage, 'rational!', { ok: true, x: W - 100, y: 456, size: 'sm' })) : null;
    const steps = [{ cap: d.cap1, run: (c) => pulse(c, bar, 1.03) }];
    steps.push({ cap: k === 'a' ? `First piece: FOIL gives ${T('6+8\\sqrt3-\\sqrt3-4')}.` : k === 'b' ? `First fraction × ${T(cC('\\tfrac{2-\\sqrt3}{2-\\sqrt3}'))}: the bottom is ${T('4-3=1')}.` : `First fraction, one term: × ${T('\\tfrac{\\sqrt5}{\\sqrt5}')} gives ${T('\\tfrac{3\\sqrt5}{5}')}.`,
      run: async (c) => { for (const e of p1) await show(c, e); } });
    steps.push({ cap: k === 'a' ? `Second piece, one term (Lesson 5): ${T('\\tfrac{6}{\\sqrt3}=\\tfrac{6\\sqrt3}{3}=2\\sqrt3')}.` : k === 'b' ? `Second fraction × ${T(cC('\\tfrac{2+\\sqrt3}{2+\\sqrt3}'))}: the bottom is 1 again.` : `Second fraction × ${T(cC('\\tfrac{\\sqrt5-1}{\\sqrt5-1}'))}: the bottom is ${T('5-1=4')}, then reduce by 2.`,
      run: async (c) => { for (const e of p2.slice(0, 2)) await show(c, e); } });
    if (d.over) steps.push({ cap: `Common denominator ${T('10')}: ${T('\\tfrac{3\\sqrt5}{5}=\\tfrac{6\\sqrt5}{10}')} and ${T('\\tfrac{\\sqrt5-1}{2}=\\tfrac{5\\sqrt5-5}{10}')}.`, run: (c) => show(c, p2[2]) });
    steps.push({ cap: `Sort the terms${d.over ? ' on top' : ''}: numbers in one bin, ${T(d.rad)}’s in the other. ${T(d.rad)} works like a variable.`, run: async (c) => { for (const e of [...tn, ...tr]) await pop(c, e, 280); } });
    steps.push({ cap: d.cancel ? `${T('-\\sqrt3+\\sqrt3=0')}: the radicals <b>cancel</b>, and ${T('2+2=4')}.` : `Collect: ${T(d.nums.join('').replace(/^\+/, '') + '=' + d.nsum)} and ${T(d.rads.join('').replace(/^\+/, '') + '=' + d.rsum)}.`,
      run: async (c) => { if (d.cancel) { tr.forEach((e) => e.classList.add('u2l6-tilex')); await shake(c, bR); } await show(c, sN); await show(c, sR); } });
    steps.push({ cap: d.cancel ? `The answer is ${T(cG('4'))}: a <b>rational</b> number, even though both fractions had radicals.` : `Answer: ${T(cG(d.ans))}.`,
      run: async (c) => { await pop(c, ans); ans.style.opacity = 1; if (st) await stampIn(c, st); } });
    return steps;
  }
};

/* ====================================================================================================
 * explainer: golden — Example 7
 * ==================================================================================================== */
const GD = { a: { label: 'Example 7(a): golden ratio' }, b: { label: 'Example 7(b): rectangle' } };
const golden = {
  title: 'Problems with conjugates',
  height: 450,
  minW: 880,
  choices: Object.keys(GD).map((k) => ({ v: k, label: GD[k].label })),
  intro: 'A picture first, then the conjugate does the algebra. Press <b>Next</b>.',
  make(stage, k, ex) { return k === 'a' ? goldenA(stage, ex.W) : goldenB(stage, ex.W); }
};
function goldenA(stage, W) {
  const phi = (1 + Math.sqrt(5)) / 2, s = 240, x0 = 40, y0 = 60;
  const svg = svgEl('svg', { width: 470, height: 440, viewBox: '0 0 470 440', class: 'u2l6-abs' }, stage); svg.style.left = '0px'; svg.style.top = '0px';
  const rect = svgEl('rect', { x: x0, y: y0, width: phi * s, height: s, fill: '#fbe8c6', stroke: CA, 'stroke-width': 3 }, svg);
  const sq = svgEl('rect', { x: x0, y: y0, width: s, height: s, fill: '#f4ead6', stroke: CA, 'stroke-width': 2.5, 'stroke-dasharray': '8 6' }, svg); hide(sq);
  const strip = svgEl('rect', { x: x0 + s, y: y0, width: (phi - 1) * s, height: s, fill: '#cdeedd', stroke: GR, 'stroke-width': 3 }, svg); hide(strip);
  const labs = add(stage, h('div', 'u2l6-abs u2l6-sqlabs'), 0, 0);
  const L = (x, y, s2, pos, cls = '') => labs.appendChild(place(h('div', 'u2l6-sqlab ' + cls, T(s2)), x, y, pos, 6));
  const lw = L(x0 + phi * s / 2, y0, '\\varphi=\\dfrac{1+\\sqrt5}{2}', 'n'), lh = L(x0, y0 + s / 2, '1', 'w');
  const l1 = hide(L(x0 + s / 2, y0 + s / 2, '1\\times1', 'c', 'u2l6-sqp')), l2 = hide(L(x0 + s + (phi - 1) * s / 2, y0 + s, '\\varphi-1', 's', 'u2l6-sqg'));
  const P = panel(stage, 480, 10, W - 490, 430, 'Show that ' + T('\\tfrac{1}{\\varphi}=\\varphi-1'));
  const L1 = hidLine(P, T('\\dfrac{1}{\\varphi}=1\\div\\dfrac{1+\\sqrt5}{2}=\\dfrac{2}{1+\\sqrt5}'), 'u2l6-gl');
  const L2 = hidLine(P, T(`=\\dfrac{2}{1+\\sqrt5}\\cdot\\dfrac{${cC('1-\\sqrt5')}}{${cC('1-\\sqrt5')}}=\\dfrac{2-2\\sqrt5}{1-5}`), 'u2l6-gl');
  const L3 = hidLine(P, T(`=\\dfrac{2-2\\sqrt5}{-4}=${cG('\\dfrac{\\sqrt5-1}{2}')}`), 'u2l6-gl');
  const L4 = hidLine(P, T(`\\varphi-1=\\dfrac{1+\\sqrt5}{2}-\\dfrac{2}{2}=${cG('\\dfrac{\\sqrt5-1}{2}')}`), 'u2l6-gl u2l6-gsep');
  [L1, L2, L3, L4].forEach((e) => fit(e, W - 520, 13));
  const st = hide(stamp(stage, 'equal ✓', { ok: true, x: W - 110, y: 400, size: 'sm' }));
  hide(lw); hide(lh); hide(rect);
  return [
    { cap: `A <b>golden rectangle</b>: ${T('\\varphi')} long and 1 wide, where ${T('\\varphi=\\tfrac{1+\\sqrt5}{2}')}.`, run: async (c) => { await appear(c, rect, 400); await show(c, lw); await show(c, lh); } },
    { cap: `Cut a ${T('1\\times1')} square off one end. The strip left over is ${T('\\varphi-1')} wide. The claim: that is exactly ${T('\\tfrac1\\varphi')}.`, run: async (c) => { await appear(c, sq, 400); await show(c, l1); await appear(c, strip, 400); await show(c, l2); } },
    { cap: `Dividing by a fraction: flip it. ${T('\\tfrac{1}{\\varphi}=\\tfrac{2}{1+\\sqrt5}')}, a binomial denominator.`, run: (c) => show(c, L1) },
    { cap: `Multiply by the conjugate ${T(cC('1-\\sqrt5'))}: the bottom is ${T('1-5=-4')}.`, run: (c) => show(c, L2) },
    { cap: `Divide every term by ${T('-2')}, so the denominator is positive: ${T('\\tfrac{\\sqrt5-1}{2}')}.`, run: (c) => show(c, L3) },
    { cap: `And ${T('\\varphi-1=\\tfrac{\\sqrt5-1}{2}')} too. <b>They are equal.</b>`, run: async (c) => { await show(c, L4); await stampIn(c, st); } }
  ];
}
function goldenB(stage, W) {
  const len = Math.sqrt(15) + 2, wid = Math.sqrt(15) - 2, s = 58, x0 = 125, y0 = 110;
  const svg = svgEl('svg', { width: 480, height: 440, viewBox: '0 0 480 440', class: 'u2l6-abs' }, stage); svg.style.left = '0px'; svg.style.top = '0px';
  const rect = svgEl('rect', { x: x0, y: y0, width: len * s, height: wid * s, fill: '#d5e2fb', stroke: DB, 'stroke-width': 3 }, svg);
  const sides = [
    svgEl('line', { x1: x0, y1: y0, x2: x0 + len * s, y2: y0, class: 'u2l6-pside' }, svg), svgEl('line', { x1: x0 + len * s, y1: y0, x2: x0 + len * s, y2: y0 + wid * s, class: 'u2l6-pside' }, svg),
    svgEl('line', { x1: x0 + len * s, y1: y0 + wid * s, x2: x0, y2: y0 + wid * s, class: 'u2l6-pside' }, svg), svgEl('line', { x1: x0, y1: y0 + wid * s, x2: x0, y2: y0, class: 'u2l6-pside' }, svg)];
  sides.forEach(hide);
  const labs = add(stage, h('div', 'u2l6-abs u2l6-sqlabs'), 0, 0);
  const L = (x, y, s2, pos, cls = '') => labs.appendChild(place(h('div', 'u2l6-sqlab ' + cls, T(s2)), x, y, pos, 6));
  L(x0 + len * s / 2, y0 + wid * s / 2, '11\\ \\text{cm}^2', 'c', 'u2l6-sqarea');
  L(x0, y0 + wid * s / 2, '\\sqrt{15}-2', 'w', 'u2l6-small');
  const lq = L(x0 + len * s / 2, y0, '\\ell=\\ ?', 'n'), ll = hide(L(x0 + len * s / 2, y0, cG('\\ell=\\sqrt{15}+2'), 'n'));
  const P = panel(stage, 490, 10, W - 500, 430, 'Length and perimeter');
  const L1 = hidLine(P, T('\\ell=\\dfrac{A}{w}=\\dfrac{11}{\\sqrt{15}-2}'), 'u2l6-gl');
  const L2 = hidLine(P, T(`=\\dfrac{11}{\\sqrt{15}-2}\\cdot\\dfrac{${cC('\\sqrt{15}+2')}}{${cC('\\sqrt{15}+2')}}=\\dfrac{11(\\sqrt{15}+2)}{15-4}`), 'u2l6-gl');
  const L3 = hidLine(P, T(`=${cG('\\sqrt{15}+2')}\\ \\text{cm}`), 'u2l6-gl');
  const L4 = hidLine(P, T('P=2(\\sqrt{15}+2)+2(\\sqrt{15}-2)'), 'u2l6-gl u2l6-gsep');
  const L5 = hidLine(P, T(`=2\\sqrt{15}${cX('+4')}+2\\sqrt{15}${cX('-4')}=${cG('4\\sqrt{15}')}\\ \\text{cm}`), 'u2l6-gl');
  [L1, L2, L3, L4, L5].forEach((e) => fit(e, W - 530, 13));
  return [
    { cap: `Area ${T('11\\ \\text{cm}^2')}, width ${T('(\\sqrt{15}-2)')} cm. Length = area ÷ width.`, run: (c) => show(c, L1) },
    { cap: `Multiply by the conjugate ${T(cC('\\sqrt{15}+2'))}: the bottom is ${T('15-4=11')}.`, run: (c) => show(c, L2) },
    { cap: `The 11s divide out: ${T('\\ell=\\sqrt{15}+2')} cm.`, run: async (c) => { await show(c, L3); lq.style.opacity = 0; await show(c, ll); } },
    { cap: `Perimeter: walk around all four sides, two lengths and two widths.`, run: async (c) => { for (const e of sides) { e.style.opacity = 1; await drawIn(e, 380, c); } await show(c, L4); } },
    { cap: `Expand: the ${T(cX('+4'))} and ${T(cX('-4'))} cancel. ${T('P=4\\sqrt{15}')} cm.`, run: (c) => show(c, L5) }
  ];
}

/* =============================== Stand Up Break! (whiteboard stations; ../standup.js) ===============================
 * Sits after Section 3. BEG: conjugate and product. PRG: rationalize k ÷ (a ± √b). MAS: a two-term numerator. */
const NONSQ = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15];
const bin = (a, b) => eT([a, b]);
standup('u2l6', {
  intro: 'At your whiteboard: multiply by the conjugate of the denominator, then check simplest form.',
  levels: {
    BEG: (r) => {
      const kind = r.int(0, 2); let a, b;
      if (kind === 0) { a = t(r.int(2, 9)); b = t(r.sign(), r.pick(NONSQ)); }
      else if (kind === 1) { const p = r.shuffle(NONSQ).slice(0, 2); a = t(1, p[0]); b = t(r.sign(), p[1]); }
      else { a = t(r.int(2, 4), r.pick([2, 3, 5])); b = t(r.sign() * r.int(1, 7)); }
      const cj = [a, neg(b)];
      return { text: 'Write the <b>conjugate</b>, then find the product of the binomial and its conjugate.', q: bin(a, b), a: [`\\text{Conjugate: }${bin(...cj)}`, `(${bin(a, b)})(${bin(...cj)})=${diffSq(a, b)}`] };
    },
    PRG: (r) => {
      let a, b, d; do { a = r.int(1, 6); b = r.pick(NONSQ); d = a * a - b; } while (d === 0 || Math.abs(d) > 12);
      const k = r.chance(0.6) ? Math.abs(d) * r.int(1, 3) : r.int(1, 9), sg = r.sign();
      const R = rationalize([t(k)], [t(a), t(sg, b)]);
      const top = k === 1 ? par(R.conj) : `${k}${par(R.conj)}`;
      return { text: 'Rationalize the denominator and simplify.', q: `\\dfrac{${k}}{${bin(t(a), t(sg, b))}}`,
        a: [`\\dfrac{${k}}{${bin(t(a), t(sg, b))}}\\cdot\\dfrac{${eT(R.conj)}}{${eT(R.conj)}}`, `\\text{bottom: }${diffSq(R.den[0], R.den[1])}`, `=\\dfrac{${top}}{${R.dVal}}=\\dfrac{${eT(R.nRaw)}}{${R.dVal}}`, `=${R.finT}`] };
    },
    MAS: (r) => {
      let num, den;
      if (r.chance(0.5)) { const p = r.pick(NONSQ); let q, s; do { q = r.int(1, 5); s = r.int(1, 5); } while (s * s === p); num = [t(1, p), t(r.sign() * q)]; den = [t(1, p), t(-r.sign() * s)]; }
      else { const p = r.shuffle(NONSQ).slice(0, 2).sort((x, y) => y - x); num = [t(r.int(1, 2), p[0]), t(r.sign(), p[1])]; den = [t(1, p[0]), t(r.sign(), p[1])]; }
      const R = rationalize(num, den);
      return { text: 'Rationalize the denominator and simplify.', q: `\\dfrac{${eT(num)}}{${eT(den)}}`,
        a: [`\\dfrac{${eT(num)}}{${eT(den)}}\\cdot\\dfrac{${eT(R.conj)}}{${eT(R.conj)}}`, `\\text{bottom: }${diffSq(R.den[0], R.den[1])}`, `\\text{top: }${par(num)}${par(R.conj)}=${eT(R.nRaw)}${R.grp.length ? '=' + eT(R.nCol) : ''}`, `=\\dfrac{${eT(R.nCol)}}{${R.dVal}}=${R.finT}`] };
    }
  }
});

/* =============================== mount =============================== */
mountTiles();
export const explainers = mountExplainers({ square, conj, detect, machine, machine2, reduce, machine3, restrict, combine, golden });
export const _test = { rationalize, eT, diffSq, sqf, M2, M3, M4 };
