/* Math 20-1 · Unit 4 · Lesson 6 — Solving Radical Equations and Checking for Extraneous Roots (no calculator demos).
 * Warm-up (The Wishing Well: a coin falls d = 5t² m; strobe ghosts at each second; heard the splash after 4 s, how deep?),
 * and the explainers:
 *   restrict (radicand ≥ 0 solved line by line, the sign flip for a negative coefficient, the restriction as the graph's
 *     domain shadow, a test value outside it, the overlap of two restrictions; concept chips and Example 1 checks),
 *   eachTerm (square the SIDES, not the terms: √x + 3 = 5 squared term by term fails; the (√x + 3)² area square shows
 *     the two missing 3√x pieces; (2√A)² = 4A as four little squares),
 *   steps (the five-step rail: restriction, isolate (peel off what's outside the root), square, solve, verify card;
 *     Example 2 checks),
 *   balance (STAR: a two-pan balance. Squaring both pans keeps it balanced, but "un-squaring" 9 can't tell 3 from −3,
 *     so a fake root sneaks in; the check tips the balance and stamps it EXTRANEOUS; √x = −3, √x = 3, Example 3(b)),
 *   noMeet (the graphs: y = √(x + 3) + 5 starts at (−3, 5) and never reaches y = 2; the fake root lives on the mirror
 *     twin y = 5 − √(x + 3); also √x = −3 and √x = 3),
 *   twoRad (a radical on each side: two restrictions on a number line, their overlap, square (the coefficient too), and
 *     where the candidate lands; Example 4 checks),
 *   calcGraph (a calculator-style screen with the key presses shown as keycaps, not a live demo: Y=, WINDOW, GRAPH,
 *     2nd TRACE 5: intersect; Example 5 check, Example 3(b) and 4(c) give ERROR: NO SIGN CHNG),
 *   skid (s = 4√(10d): substitute, isolate, square; the car skids to scale; Example 6 check and a speed comparison),
 *   pendulum (T = 2π√(L/9.8): one real-time swing with a stopwatch; Example 7(a)–(c) checks; 4× the length, 2× the period).
 * Colours: the radical / radicand purple, the other side (a number) blue, squaring amber, allowed / checks green,
 *   extraneous red. */
import {
  h, tex, add, box, Graph, NumberLine, stamp, stampIn, checkCard, mountExplainers, pop, fadeIn, sleep, tween,
  svgEl, pulse, shake, anim, linear, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const RAD = COLORS.purple, NUM = COLORS.blue, SQ = COLORS.amber, OK = COLORS.green, NO = COLORS.red, INK = COLORS.ink, GRAY = COLORS.gray;
const cR = (s) => `\\textcolor{${RAD}}{${s}}`, cN = (s) => `\\textcolor{${NUM}}{${s}}`, cS = (s) => `\\textcolor{${SQ}}{${s}}`;
const cO = (s) => `\\textcolor{${OK}}{${s}}`, cX = (s) => `\\textcolor{${NO}}{${s}}`;
const fx = (v, d = 2) => { const k = Math.pow(10, d); let s = (Math.round((v + Math.sign(v) * 1e-9) * k) / k).toFixed(d); if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, ''); return s; };
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
const panel = (stage, x, y, w, hh, title, cls = '') => div(stage, 'u4l6-panel ' + cls, title ? `<div class="u4l6-ph">${title}</div>` : '', x, y, w, hh);
const lineIn = (p, html, cls = '') => { const d = h('div', 'u4l6-line ' + cls, html); p.appendChild(d); hide(d); return d; };
/* a work line: maths, plus an optional note on the right ("÷ 2 both sides") */
const workLine = (p, t, note, cls = '') => lineIn(p, `<span class="u4l6-lt">${T(t)}</span>${note ? `<span class="u4l6-note">${note}</span>` : ''}`, 'u4l6-wl ' + cls);
const stampAt = (host, text, ok, x, y, o = {}) => hide(stamp(host, text, Object.assign({ ok, x, y }, o)));
/* hidden curves / intervals: drawIn masks the stroke while it draws but does not touch opacity */
const drawOn = (c, B, el, ms = 700) => { el.style.opacity = ''; return B.drawIn(el, ms, c); };
/* a point with its label, both hidden / popped */
const hideP = (p) => { hide(p); if (p.label) hide(p.label); return p; };
const popP = (c, p) => Promise.all([pop(c, p), p.label ? show(c, p.label) : null]);

/* ====================================================================================================
 * Warm-up: The Wishing Well. d = 5t² metres; 4 px per metre, so the 80 m well is 320 px deep.
 * ==================================================================================================== */
function mountWell() {
  const host = document.getElementById('u4l6-well'); if (!host) return;
  const W = 540, H = 408, G0 = 74, PX = 4, SX = 214, SW = 120, CX = SX + SW / 2, BOT = G0 + 80 * PX;
  const svg = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u4l6-wellsvg' }, host);
  // ground and sky
  svgEl('rect', { x: 0, y: 0, width: W, height: G0, fill: '#e9f3fb' }, svg);
  svgEl('rect', { x: 0, y: G0, width: W, height: H - G0, fill: '#b9a27e' }, svg);
  for (let i = 0; i < 46; i++) { const x = (i * 97) % W, y = G0 + 14 + ((i * 53) % (H - G0 - 20)); if (x > SX - 18 && x < SX + SW + 18) continue; svgEl('circle', { cx: x, cy: y, r: 2 + (i % 3), fill: '#a08a66' }, svg); }
  svgEl('rect', { x: 0, y: G0 - 6, width: W, height: 8, fill: '#6aa84f' }, svg);
  // the shaft: stone walls, dark inside, water at the bottom
  svgEl('rect', { x: SX - 16, y: G0, width: SW + 32, height: BOT - G0 + 14, fill: '#8d8a84' }, svg);
  for (let y = G0, r = 0; y < BOT + 10; y += 16, r++) for (const side of [SX - 16, SX + SW]) {
    svgEl('line', { x1: side, x2: side + 16, y1: y, y2: y, stroke: '#6f6c66', 'stroke-width': 1.5 }, svg);
    svgEl('line', { x1: side + (r % 2 ? 5 : 11), x2: side + (r % 2 ? 5 : 11), y1: y, y2: y + 16, stroke: '#6f6c66', 'stroke-width': 1.5 }, svg);
  }
  svgEl('rect', { x: SX, y: G0, width: SW, height: BOT - G0, fill: '#2d3440' }, svg);
  svgEl('rect', { x: SX, y: BOT - 6, width: SW, height: 20, fill: '#3e7fb5' }, svg);
  // the little roof above the well
  svgEl('rect', { x: SX - 22, y: G0 - 28, width: SW + 44, height: 22, rx: 3, fill: '#9b9890', stroke: '#6f6c66', 'stroke-width': 2 }, svg);
  svgEl('line', { x1: SX - 8, x2: SX - 8, y1: G0 - 28, y2: 14, stroke: '#7a5233', 'stroke-width': 8 }, svg);
  svgEl('line', { x1: SX + SW + 8, x2: SX + SW + 8, y1: G0 - 28, y2: 14, stroke: '#7a5233', 'stroke-width': 8 }, svg);
  svgEl('path', { d: `M${SX - 40} 22 L${CX} -4 L${SX + SW + 40} 22 Z`, fill: '#b5523b', stroke: '#7d3324', 'stroke-width': 2.5 }, svg);
  // strobe ghosts (1 s, 2 s, 3 s) and their labels; the bottom's label
  const depthAt = (t) => 5 * t * t, yAt = (t) => G0 + depthAt(t) * PX;
  const ghosts = [1, 2, 3].map((t) => {
    const g = svgEl('g', { class: 'u4l6-ghost' }, svg);
    svgEl('circle', { cx: CX, cy: yAt(t), r: 10, fill: '#e2b84a', 'fill-opacity': 0.5, stroke: '#f5d77a', 'stroke-width': 2 }, g);
    svgEl('line', { x1: SX + SW + 16, x2: SX + SW + 30, y1: yAt(t), y2: yAt(t), stroke: '#2d3440', 'stroke-width': 2 }, g);
    return g;
  });
  const tLabs = [1, 2, 3, 4].map((t) => div(host, 'u4l6-wtl', t === 4 ? '<b>4 s</b> splash!' : `<b>${t} s</b>`, SX + SW + 34, yAt(t) - 13));
  const dLabs = [1, 2, 3, 4].map((t) => div(host, 'u4l6-wdl', `${depthAt(t)} m`, 0, yAt(t) - 13));
  dLabs.forEach((d) => { d.style.right = (W - SX + 22) + 'px'; d.style.left = 'auto'; });
  const qLab = div(host, 'u4l6-wdl u4l6-wq', '? m', 0, BOT - 13); qLab.style.right = (W - SX + 22) + 'px'; qLab.style.left = 'auto';
  const coin = svgEl('g', {}, svg);
  svgEl('circle', { cx: 0, cy: 0, r: 11, fill: '#f0c419', stroke: '#a77d06', 'stroke-width': 2.5 }, coin);
  svgEl('circle', { cx: 0, cy: 0, r: 5.5, fill: 'none', stroke: '#c79a12', 'stroke-width': 1.5 }, coin);
  const splash = svgEl('g', { class: 'u4l6-splash' }, svg);
  [[-30, -26], [-14, -38], [0, -44], [14, -38], [30, -26]].forEach(([dx, dy]) => svgEl('line', { x1: CX + dx * 0.3, y1: BOT - 6, x2: CX + dx, y2: BOT - 6 + dy, stroke: '#8fc6ee', 'stroke-width': 4, 'stroke-linecap': 'round' }, splash));
  const watch = div(host, 'u4l6-watch', '0.0 s', W - 128, 92);
  const bDrop = document.getElementById('u4l6-drop'), bReset = document.getElementById('u4l6-wreset'), bRev = document.getElementById('u4l6-wreveal');
  let raf = 0, shown = 0, revealed = false;
  const paint = (t) => {
    coin.setAttribute('transform', `translate(${CX} ${t < 0 ? G0 - 40 : yAt(Math.min(t, 4))})`);
    shown = Math.max(0, Math.min(4, Math.floor(t + 1e-9)));
    ghosts.forEach((g, i) => g.classList.toggle('on', t >= i + 1));
    tLabs.forEach((d, i) => d.classList.toggle('on', t >= i + 1));
    dLabs.forEach((d, i) => d.classList.toggle('on', revealed && t >= i + 1));
    qLab.classList.toggle('on', !(revealed && t >= 4));
    splash.classList.toggle('on', t >= 4);
    watch.textContent = (t < 0 ? 0 : Math.min(t, 4)).toFixed(1) + ' s';
  };
  const drop = () => {
    cancelAnimationFrame(raf); const t0 = performance.now();
    const fr = (now) => { const t = (now - t0) / 1000; paint(t); if (t < 4) raf = requestAnimationFrame(fr); };
    raf = requestAnimationFrame(fr);
  };
  bDrop.addEventListener('click', drop);
  bReset.addEventListener('click', () => { cancelAnimationFrame(raf); paint(-1); });
  if (bRev) bRev.addEventListener('click', () => { revealed = true; if (shown < 4) { cancelAnimationFrame(raf); paint(4); } else paint(4); });
  // "Show all answers" (••• menu) opens the poll too: show the depths then
  new MutationObserver(() => { const p = bRev && bRev.closest('.poll'); if (p && p.classList.contains('revealed') && !revealed) { revealed = true; paint(4); } })
    .observe(bRev ? bRev.closest('.poll') : host, { attributes: true, attributeFilter: ['class'] });
  paint(-1);
}

/* =============================== explainer: restrictions =============================== */
/* each radical: radicand TeX, its inequality lines (the flip line is marked), the bound, ≥ (1) or ≤ (−1), a test value outside */
const RSD = {
  c1: { label: '√(x − 2)', eq: '\\sqrt{x-2}', rads: [{ r: 'x-2', f: (x) => x - 2, lines: ['x-2\\ge0', 'x\\ge2'], b: 2, dir: 1, test: 0 }], win: [-2, 8, -1, 3.5], ans: 'x\\ge2' },
  c2: { label: '√(3 − x)', eq: '\\sqrt{3-x}', rads: [{ r: '3-x', f: (x) => 3 - x, lines: ['3-x\\ge0', '-x\\ge-3', 'x\\le3'], flip: 2, dv: '-1', b: 3, dir: -1, test: 5 }], win: [-5, 6, -1, 3.5], ans: 'x\\le3' },
  a: { label: 'Example 1(a)', eq: '\\sqrt{x+4}=6', rads: [{ r: 'x+4', f: (x) => x + 4, lines: ['x+4\\ge0', 'x\\ge-4'], b: -4, dir: 1, test: -6 }], win: [-7, 6, -1, 4], ans: 'x\\ge-4' },
  b: { label: '(b)', eq: '\\sqrt{2x-5}+1=4', rads: [{ r: '2x-5', f: (x) => 2 * x - 5, lines: ['2x-5\\ge0', '2x\\ge5', 'x\\ge\\tfrac{5}{2}'], b: 2.5, dir: 1, test: 1 }], win: [-2, 8, -1, 3.5], ans: 'x\\ge\\tfrac{5}{2}' },
  c: { label: '(c)', eq: '\\sqrt{6-3x}=9', rads: [{ r: '6-3x', f: (x) => 6 - 3 * x, lines: ['6-3x\\ge0', '-3x\\ge-6', 'x\\le2'], flip: 2, dv: '-3', b: 2, dir: -1, test: 4 }], win: [-4, 5, -1, 4.5], ans: 'x\\le2' },
  d: { label: '(d)', eq: '\\sqrt{x-1}+\\sqrt{5-x}=2', rads: [{ r: 'x-1', f: (x) => x - 1, lines: ['x-1\\ge0', 'x\\ge1'], b: 1, dir: 1 }, { r: '5-x', f: (x) => 5 - x, lines: ['5-x\\ge0', '-x\\ge-5', 'x\\le5'], flip: 2, dv: '-1', b: 5, dir: -1 }], win: [-2, 8, -1, 3], ans: '1\\le x\\le5' },
  e: { label: '(e)', eq: '\\sqrt{x}=\\sqrt{x+3}-1', rads: [{ r: 'x', f: (x) => x, lines: ['x\\ge0'], b: 0, dir: 1 }, { r: 'x+3', f: (x) => x + 3, lines: ['x+3\\ge0', 'x\\ge-3'], b: -3, dir: 1 }], win: [-5, 5, -1, 3.5], ans: 'x\\ge0' }
};
const colourRads = (eq, rads, cols) => { let s = eq; rads.forEach((r, i) => { s = s.replace(`\\sqrt{${r.r}}`, `\\sqrt{\\textcolor{${cols[i]}}{${r.r}}}`); }); return s; };
const restrict = {
  title: 'The restriction: radicand ≥ 0',
  height: 372,
  choices: [{ v: 'c1', label: RSD.c1.label }, { v: 'c2', label: RSD.c2.label }, { sep: 'Check:' }, ...['a', 'b', 'c', 'd', 'e'].map((k) => ({ v: k, label: RSD[k].label }))],
  ask: (v) => (v[0] === 'c' && v.length === 2 ? `For which values of <i>x</i> is ${T(RSD[v].eq)} a real number?` : `Example 1${v === 'a' ? '(a)' : `(${v})`}: state the restriction on the variable in ${T(RSD[v].eq)}.`),
  make(stage, v, ex) {
    const d = RSD[v], two = d.rads.length > 1, cols = [RAD, NUM], W = ex.W, GW = 480, GX = W - GW - 4;
    const P = panel(stage, 8, 6, GX - 22, 358, '', 'u4l6-big');
    lineIn(P, T(colourRads(d.eq, d.rads, cols)), 'u4l6-eq').style.opacity = 1;
    const ineq = d.rads.map((r, i) => {
      const box2 = h('div', 'u4l6-rcol'); P.appendChild(box2);
      return r.lines.map((t, j) => { const l = lineIn(box2, T(j === 0 ? `\\textcolor{${cols[i]}}{${r.r}}${t.slice(r.r.length)}` : t), (r.flip === j ? 'u4l6-flipl ' : '') + (j === r.lines.length - 1 ? 'u4l6-rlast' : '')); if (r.flip === j) l.innerHTML += `<span class="u4l6-note u4l6-flip">÷ (${r.dv.replace('-', '−')}): sign flips!</span>`; return l; });
    });
    const ansL = lineIn(P, `Restriction: ${T(d.ans)}`, 'u4l6-ansbox');
    const [x0, x1, y0, y1] = d.win;
    const G = new Graph(stage, { x: GX, y: 18, width: GW, height: 350, xmin: x0, xmax: x1, ymin: y0, ymax: y1, fontSize: 16 });
    const curves = d.rads.map((r, i) => G.fn((x) => Math.sqrt(r.f(x)), { from: r.dir > 0 ? r.b : undefined, to: r.dir < 0 ? r.b : undefined, color: cols[i], width: 4 }));
    const starts = d.rads.map((r, i) => G.point(r.b, 0, { color: cols[i] }));
    const labs = d.rads.map((r, i) => { const xl = r.dir > 0 ? Math.min(x1 - 1.6, r.b + (x1 - r.b) * 0.55) : Math.max(x0 + 1.6, r.b - (r.b - x0) * 0.55); return G.label(xl, Math.sqrt(r.f(xl)) + 0.42 + (two && i ? 0.25 : 0), `y=\\sqrt{${r.r}}`, { tex: true, color: cols[i], cls: 'bk-ptlab' }); });
    const shades = d.rads.map((r, i) => G.shadeX(r.dir > 0 ? r.b : -Infinity, r.dir > 0 ? Infinity : r.b, { color: cols[i], band: true, offset: 0 }));
    [...curves, ...starts, ...labs, ...shades].forEach(hide);
    let probe = null, plab = null, over = null, overLab = null;
    const r0 = d.rads[0];
    if (!two) {
      const tv = r0.test, val = r0.f(tv);
      probe = hide(G.point(tv, 0, { color: NO, open: true }));
      plab = hide(G.label(tv, 0.75, `x=${tv}:\\ \\sqrt{${fx(val)}}\\ ✗`, { tex: true, color: NO, cls: 'bk-ptlab', pos: tv > (x0 + x1) / 2 ? 'nw' : 'ne', gap: 0 }));
    } else {
      const lo = Math.max(...d.rads.filter((r) => r.dir > 0).map((r) => r.b), -Infinity), hi = Math.min(...d.rads.filter((r) => r.dir < 0).map((r) => r.b), Infinity);
      over = hide(G.shadeX(lo, hi, { color: OK, width: 12, opacity: 0.85 }));
      overLab = hide(G.label(Number.isFinite(hi) ? (lo + hi) / 2 : lo + 2.4, -0.55, 'both', { color: OK, cls: 'bk-ptlab' }));
    }
    const anyFlip = d.rads.some((r) => r.flip != null), flipR = d.rads.find((r) => r.flip != null);
    const steps = [
      { cap: two ? 'Two radicals: <b>each radicand</b> must be ≥ 0. Write both inequalities.' : 'The <b>radicand</b> (the part under the root) must be <b>≥ 0</b>.',
        run: (c) => Promise.all(ineq.map((ls) => show(c, ls[0]))) },
      { cap: anyFlip ? `Solve. Dividing by ${T(flipR.dv)} (a <b>negative</b>) <b>reverses</b> the sign: ≥ becomes ≤.` : 'Solve the inequality like an equation (no negative to divide by here).',
        run: async (c) => { for (const ls of ineq) for (const l of ls.slice(1)) { await show(c, l); if (l.classList.contains('u4l6-flipl')) await shake(c, l); } } },
      { cap: 'On a graph, the restriction is the <b>domain</b>: the curve exists only for those <i>x</i>, starting at the <b>dot</b>.',
        run: async (c) => { for (let i = 0; i < curves.length; i++) { await pop(c, starts[i]); await drawOn(c, G, curves[i], 650); await show(c, labs[i]); await show(c, shades[i]); } } },
      two
        ? { cap: '<i>x</i> must make <b>both</b> radicands ≥ 0 at once: keep only the <b>overlap</b>.', run: async (c) => { await drawOn(c, G, over, 600); await show(c, overLab); } }
        : { cap: `Outside it there is no graph: ${T(`x=${r0.test}`)} makes the radicand ${T(fx(r0.f(r0.test)))}, and ${T(`\\sqrt{${fx(r0.f(r0.test))}}`)} is <b>not a real number</b>.`, run: async (c) => { await pop(c, probe); await show(c, plab); } },
      { cap: () => `The restriction: ${T(d.ans)}.`, run: (c) => pop(c, ansL) }
    ];
    return steps;
  }
};

/* =============================== explainer: square the sides, not the terms =============================== */
const eachTerm = {
  title: 'Square both sides, not each term',
  height: 392,
  choices: [{ v: 'sq', label: '√x + 3 = 5' }, { v: 'co', label: '(2√A)² = 4A' }],
  ask: (v) => (v === 'sq' ? `Solve ${T('\\sqrt{x}+3=5')}. Can we square each term?` : `What is ${T('\\left(2\\sqrt{A}\\right)^2')}? Is it ${T('2A')} or ${T('4A')}?`),
  make(stage, v, ex) { return v === 'sq' ? eachSq(stage, ex) : eachCo(stage, ex); }
};
/* an area square with the side split a | b; regions coloured; returns the region elements */
function areaSquare(stage, x, y, a, b, la, lb, cells) {
  const S = a + b, root = div(stage, 'u4l6-sqbox', '', x, y, S + 40, S + 40);
  const svg = svgEl('svg', { width: S + 40, height: S + 40, viewBox: `0 0 ${S + 40} ${S + 40}` }, root);
  const o = 32, rects = [];
  const R = (rx, ry, w, hh, fill, html) => { const r = svgEl('rect', { x: o + rx, y: o + ry, width: w, height: hh, fill, stroke: '#1c2230', 'stroke-width': 2 }, svg); const l = div(root, 'u4l6-sqlab', html, o + rx, o + ry, w, hh); rects.push({ r, l }); return { r, l }; };
  R(0, 0, a, a, cells[0][0], cells[0][1]); R(a, 0, b, a, cells[1][0], cells[1][1]); R(0, a, a, b, cells[2][0], cells[2][1]); R(a, a, b, b, cells[3][0], cells[3][1]);
  div(root, 'u4l6-sqside', la, o, 2, a, 28); div(root, 'u4l6-sqside', lb, o + a, 2, b, 28);
  div(root, 'u4l6-sqside u4l6-sqv', la, 0, o, 30, a); div(root, 'u4l6-sqside u4l6-sqv', lb, 0, o + a, 30, b);
  return { root, rects };
}
function eachSq(stage, ex) {
  const W = ex.W, CW = Math.min(320, (W - 40) / 3);
  const Pw = panel(stage, 8, 8, CW, 220, 'Square each term?', 'u4l6-bad');
  const w1 = workLine(Pw, `\\left(\\sqrt{x}\\right)^2+${cS('3^2')}=${cS('5^2')}`), w2 = workLine(Pw, 'x+9=25'), w3 = workLine(Pw, 'x=16');
  const w4 = workLine(Pw, '\\text{Check: }\\sqrt{16}+3=7\\ne5', '', 'u4l6-xline');
  const st1 = stampAt(stage, '✗ wrong', false, 8 + CW - 70, 200, { size: 'sm' });
  const sq = areaSquare(stage, (W - 300) / 2 - 10, 0, 110, 150, T('\\sqrt{x}'), T('3'),
    [['#e7defa', T('x')], ['#fde9c4', T('3\\sqrt{x}')], ['#fde9c4', T('3\\sqrt{x}')], ['#dbe6fb', T('9')]]);
  sq.root.style.opacity = 0;
  const eqA = hide(div(stage, 'u4l6-areaeq', T(`\\left(\\sqrt{x}+3\\right)^2=x+${cS('6\\sqrt{x}')}+9`), (W - 360) / 2, 304, 360));
  const miss = hide(div(stage, 'u4l6-miss', `Squaring each term <b>loses</b> the two ${T('3\\sqrt{x}')} pieces!`, (W - 560) / 2, 344, 560));
  const Pr = panel(stage, W - CW - 8, 8, CW, 220, 'Isolate first', 'u4l6-good');
  const r1 = workLine(Pr, `\\sqrt{x}+3=5`), r2 = workLine(Pr, '\\sqrt{x}=2', '− 3 both sides'), r3 = workLine(Pr, 'x=4', 'square'), r4 = workLine(Pr, '\\text{Check: }\\sqrt{4}+3=5', '', 'u4l6-okline');
  const st2 = stampAt(stage, '✓ x = 4', true, W - 80, 200, { size: 'sm' });
  return [
    { cap: 'Tempting: square <b>each term</b>. That gives <b>x = 16</b>…', run: async (c) => { for (const l of [w1, w2, w3]) await show(c, l); } },
    { cap: '…but x = 16 does not check: √16 + 3 = <b>7</b>, not 5. Something went wrong.', run: async (c) => { await show(c, w4); await stampIn(c, st1); } },
    { cap: 'Squaring the left side squares <b>all</b> of √x + 3: a square with side √x + 3 has four pieces.', run: async (c) => { await fadeIn(c, sq.root, 450); await show(c, eqA); } },
    { cap: 'Squaring term by term keeps only x and 9. The two <b>3√x</b> rectangles go missing.', run: async (c) => { await show(c, miss); await Promise.all([1, 2].map((i) => pulse(c, sq.rects[i].l, 1.15, 600))); } },
    { cap: 'The right way: <b>isolate</b> the radical, then square <b>both sides</b>: x = 4, and it checks.', run: async (c) => { for (const l of [r1, r2, r3, r4]) await show(c, l); await stampIn(c, st2); } }
  ];
}
function eachCo(stage, ex) {
  const W = ex.W, a = 120;
  const sq = areaSquare(stage, 40, 0, a, a, T('\\sqrt{A}'), T('\\sqrt{A}'), [['#e7defa', T('A')], ['#e7defa', T('A')], ['#e7defa', T('A')], ['#e7defa', T('A')]]);
  sq.rects.forEach((r) => (r.l.style.opacity = 0));
  const side2 = hide(div(stage, 'u4l6-brace', `side ${T('2\\sqrt{A}')}`, 40 + 32, 2 * a + 40, 2 * a));
  const P = panel(stage, 360, 8, W - 370, 372, '');
  const l1 = workLine(P, `\\left(${cS('2')}\\sqrt{A}\\right)^2=\\left(2\\sqrt{A}\\right)\\left(2\\sqrt{A}\\right)`);
  const l2 = workLine(P, `=${cS('2^2')}\\left(\\sqrt{A}\\right)^2=${cS('4')}A`, '', 'u4l6-keyl');
  const l3 = lineIn(P, `<b>Example 2(b):</b> ${T('2\\sqrt{x-1}=6')} (after taking off the 3). Two ways:`, 'u4l6-line-sm');
  const two = h('div', 'u4l6-tworoutes'); P.appendChild(two); hide(two);
  two.innerHTML = `<div><div class="u4l6-rh">Square it all</div>${T(`${cS('4')}(x-1)=36`)}<br>${T('x-1=9')}<br>${T('x=10')}</div><div><div class="u4l6-rh">Divide by 2 first</div>${T('\\sqrt{x-1}=3')}<br>${T('x-1=9')}<br>${T('x=10')}</div>`;
  const l4 = lineIn(P, `Forgetting to square the 2 gives ${T('2(x-1)=36')}, so ${T('x=19')}: <b>wrong</b>.`, 'u4l6-line-sm u4l6-xline');
  return [
    { cap: `${T('\\left(2\\sqrt{A}\\right)^2')} is the area of a square with side ${T('2\\sqrt{A}')}.`, run: async (c) => { await show(c, l1); await show(c, side2); } },
    { cap: `It holds <b>four</b> small squares of area ${T('\\left(\\sqrt{A}\\right)^2=A')}: the 2 is squared too, so it is <b>4A</b>.`, run: async (c) => { for (const r of sq.rects) await pop(c, r.l, 300); await show(c, l2); } },
    { cap: `Square the 2 as well, ${T('4(x-1)=36')}, or divide by 2 first: both routes give <b>x = 10</b>.`, run: async (c) => { await show(c, l3); await show(c, two); } },
    { cap: 'Leave the 2 unsquared and the answer is wrong (and would fail the check).', run: (c) => show(c, l4) }
  ];
}

/* =============================== explainer: the five steps =============================== */
const ST = {
  a: { label: 'Example 2(a)', eq: '\\sqrt{3x+1}=5', R: ['3x+1\\ge0', 'x\\ge-\\tfrac{1}{3}'], iso: [], sq: ['\\left(\\sqrt{3x+1}\\right)^2=5^2', '3x+1=25'], solve: ['3x=24', 'x=8'], x: '8',
    L: ['\\sqrt{3(8)+1}', '\\sqrt{25}', '5'], Rt: ['5'] },
  b: { label: '(b)', eq: '2\\sqrt{x-1}+3=9', R: ['x-1\\ge0', 'x\\ge1'], iso: [['2\\sqrt{x-1}=6', '− 3 both sides'], ['\\sqrt{x-1}=3', '÷ 2 both sides']], sq: ['\\left(\\sqrt{x-1}\\right)^2=3^2', 'x-1=9'], solve: ['x=10'], x: '10',
    L: ['2\\sqrt{10-1}+3', '2(3)+3', '9'], Rt: ['9'] },
  c: { label: '(c)', eq: '\\sqrt{4x-3}-7=-2', R: ['4x-3\\ge0', 'x\\ge\\tfrac{3}{4}'], iso: [['\\sqrt{4x-3}=5', '+ 7 both sides']], sq: ['\\left(\\sqrt{4x-3}\\right)^2=5^2', '4x-3=25'], solve: ['4x=28', 'x=7'], x: '7',
    L: ['\\sqrt{4(7)-3}-7', '\\sqrt{25}-7', '-2'], Rt: ['-2'] },
  d: { label: '(d)', eq: '\\sqrt{\\dfrac{x+4}{3}}=2', R: ['x+4\\ge0', 'x\\ge-4'], iso: [], sq: ['\\left(\\sqrt{\\dfrac{x+4}{3}}\\right)^2=2^2', '\\dfrac{x+4}{3}=4'], solve: ['x+4=12', 'x=8'], x: '8',
    L: ['\\sqrt{\\dfrac{8+4}{3}}', '\\sqrt{4}', '2'], Rt: ['2'] }
};
const RAIL = ['Restriction', 'Isolate', 'Square', 'Solve', 'Verify'];
const steps = {
  title: 'Restriction → isolate → square → solve → verify',
  height: 420, minW: 900,
  choices: [{ sep: 'Check:' }, ...Object.keys(ST).map((k) => ({ v: k, label: ST[k].label }))],
  ask: (v) => `Example 2${v === 'a' ? '(a)' : `(${v})`}: solve and verify ${T(ST[v].eq)}.`,
  make(stage, v, ex) {
    const d = ST[v], W = ex.W, CW = Math.min(330, W - 600);
    const rail = div(stage, 'u4l6-rail', '', 6, 8, 190, 400);
    const pills = RAIL.map((t, i) => { const p = h('div', 'u4l6-rstep', `<b>${i + 1}</b>${t}`); rail.appendChild(p); return p; });
    const on = (i) => pills.forEach((p, j) => { p.classList.toggle('on', j === i); p.classList.toggle('done', j < i); });
    const P = panel(stage, 208, 6, W - 208 - CW - 18, 408, '', 'u4l6-big2');
    lineIn(P, T(d.eq), 'u4l6-eq').style.opacity = 1;
    const lR = workLine(P, d.R.join('\\ \\Rightarrow\\ '), 'restriction', 'u4l6-rline');
    const lI = d.iso.map(([t, n]) => workLine(P, t, n));
    const lS = d.sq.map((t, i) => workLine(P, t, i === 0 ? 'square both sides' : ''));
    const lV = d.solve.map((t, i) => workLine(P, t, '', i === d.solve.length - 1 ? 'u4l6-xans' : ''));
    const ck = checkCard(stage, { title: 'Verify', at: `x=${d.x}`, left: d.L, right: d.Rt, ok: true, x: W - CW - 6, y: 14, width: CW, hidden: true });
    const okSt = stampAt(stage, `✓ x = ${d.x}`, true, W - CW / 2 - 6, 330);
    const iso = d.iso.length;
    return [
      { cap: `<b>1. Restriction.</b> The radicand must be ≥ 0: ${T(d.R[d.R.length - 1])}.`, run: async (c) => { on(0); await show(c, lR); } },
      { cap: iso ? `<b>2. Isolate</b> the radical: undo what is <b>outside</b> the root, outside in (${d.iso.map((x) => x[1].replace(' both sides', '')).join(', then ')}).` : '<b>2. Isolate.</b> The radical is already alone on its side.',
        run: async (c) => { on(1); for (const l of lI) await show(c, l); if (!iso) await pulse(c, P.children[0], 1.06); } },
      { cap: '<b>3. Square both sides.</b> Squaring undoes the square root.', run: async (c) => { on(2); for (const l of lS) await show(c, l); } },
      { cap: `<b>4. Solve</b>: ${T(`x=${d.x}`)}. It meets the restriction ${T(d.R[d.R.length - 1])}.`, run: async (c) => { on(3); for (const l of lV) await show(c, l); } },
      { cap: `<b>5. Verify</b> in the <b>original</b> equation: left side = right side, so ${T(`x=${d.x}`)} is the solution.`, run: async (c) => { on(4); await ck.play(c); pills[4].classList.add('done'); await stampIn(c, okSt); } }
    ];
  }
};

/* =============================== explainer: the balance (STAR) =============================== */
/* A two-pan balance. theta > 0 tips the LEFT pan down. Weight blocks are HTML (KaTeX) riding on the pans. */
function makeBalance(stage, o = {}) {
  const BW = o.width || 600, BH = o.height || 430, cx = BW / 2, cy = 92, L = 205, SL = 112;
  const svg = svgEl('svg', { width: BW, height: BH, viewBox: `0 0 ${BW} ${BH}`, class: 'u4l6-bal' }, stage);
  svg.style.position = 'absolute'; svg.style.left = '0px'; svg.style.top = '0px';
  svgEl('path', { d: `M${cx - 120} ${BH - 14} L${cx + 120} ${BH - 14} L${cx + 90} ${BH - 40} L${cx - 90} ${BH - 40} Z`, fill: '#8a6d4b', stroke: '#5b4630', 'stroke-width': 3 }, svg);
  svgEl('path', { d: `M${cx - 16} ${BH - 40} L${cx - 8} ${cy + 6} L${cx + 8} ${cy + 6} L${cx + 16} ${BH - 40} Z`, fill: '#a3845f', stroke: '#5b4630', 'stroke-width': 3 }, svg);
  const mk = (cls) => ({
    s1: svgEl('line', { stroke: '#5b4630', 'stroke-width': 2.5 }, svg), s2: svgEl('line', { stroke: '#5b4630', 'stroke-width': 2.5 }, svg),
    dish: svgEl('path', { fill: '#d9c39a', stroke: '#5b4630', 'stroke-width': 3, class: cls }, svg)
  });
  const P = [mk('l'), mk('r')];
  const beam = svgEl('line', { stroke: '#5b4630', 'stroke-width': 11, 'stroke-linecap': 'round' }, svg);
  const needle = svgEl('line', { stroke: '#c93a33', 'stroke-width': 4, 'stroke-linecap': 'round' }, svg);
  svgEl('circle', { cx, cy, r: 11, fill: '#e8a01e', stroke: '#5b4630', 'stroke-width': 3 }, svg);
  const blocks = [div(stage, 'u4l6-wt u4l6-wt-l', '', 0, 0), div(stage, 'u4l6-wt u4l6-wt-r', '', 0, 0)];
  const sign = div(stage, 'u4l6-bsign', '', cx - 34, BH - 196, 68, 54);
  const B = {
    theta: 0, svg, blocks, sign, cx,
    set(th) {
      B.theta = th; const r = th * Math.PI / 180, dx = L * Math.cos(r), dy = L * Math.sin(r);
      const ends = [[cx - dx, cy + dy], [cx + dx, cy - dy]];
      beam.setAttribute('x1', ends[0][0]); beam.setAttribute('y1', ends[0][1]); beam.setAttribute('x2', ends[1][0]); beam.setAttribute('y2', ends[1][1]);
      needle.setAttribute('x1', cx); needle.setAttribute('y1', cy); needle.setAttribute('x2', cx + 46 * Math.sin(r)); needle.setAttribute('y2', cy + 46 * Math.cos(r));
      ends.forEach(([ex2, ey], i) => {
        const p = P[i], dyb = ey + SL;
        p.s1.setAttribute('x1', ex2); p.s1.setAttribute('y1', ey); p.s1.setAttribute('x2', ex2 - 92); p.s1.setAttribute('y2', dyb);
        p.s2.setAttribute('x1', ex2); p.s2.setAttribute('y1', ey); p.s2.setAttribute('x2', ex2 + 92); p.s2.setAttribute('y2', dyb);
        p.dish.setAttribute('d', `M${ex2 - 100} ${dyb} Q${ex2} ${dyb + 46} ${ex2 + 100} ${dyb} Z`);
        const bl = blocks[i]; bl.style.left = ex2 + 'px'; bl.style.top = dyb + 'px';
      });
    },
    tilt(c, to, ms = 900) { const from = B.theta; return tween(c, ms, (t) => B.set(from + (to - from) * t)); },
    async wobble(c) { await B.tilt(c, 4, 260); await B.tilt(c, -3, 260); await B.tilt(c, 0, 260); },
    text(i, html) { blocks[i].innerHTML = html; },
    setSign(ok) { sign.className = 'u4l6-bsign ' + (ok === true ? 'eq' : ok === false ? 'ne' : ''); sign.innerHTML = ok === false ? '≠' : '='; }
  };
  B.set(0); B.setSign(null);
  return B;
}
const BAL = {
  neg: { label: 'Example 3(a): √x = −3', q: '\\sqrt{x}=-3', L: '\\sqrt{x}', R: '-3', iso: null, sqL: '\\left(\\sqrt{x}\\right)^2', sqR: '(-3)^2', aL: 'x', aR: '9', root: '9', chkL: '\\sqrt{9}', chkLv: '3', chkR: '-3', ok: false, from: '-3' },
  pos: { label: 'Compare: √x = 3', q: '\\sqrt{x}=3', L: '\\sqrt{x}', R: '3', iso: null, sqL: '\\left(\\sqrt{x}\\right)^2', sqR: '3^2', aL: 'x', aR: '9', root: '9', chkL: '\\sqrt{9}', chkLv: '3', chkR: '3', ok: true, from: '3' },
  b: { label: 'Example 3(b): √(x + 3) + 5 = 2', q: '\\sqrt{x+3}+5=2', L: '\\sqrt{x+3}+5', R: '2', iso: ['\\sqrt{x+3}', '-3'], sqL: '\\left(\\sqrt{x+3}\\right)^2', sqR: '(-3)^2', aL: 'x+3', aR: '9', root: '6', solve: 'x=6', chkL: '\\sqrt{6+3}+5', chkLv: '8', chkR: '2', ok: false, from: '-3' }
};
const balance = {
  title: 'Why squaring can sneak in a fake root',
  height: 436, minW: 960,
  choices: [{ v: 'neg', label: BAL.neg.label }, { v: 'pos', label: BAL.pos.label }, { v: 'b', label: BAL.b.label }],
  ask: (v) => `Solve ${T(BAL[v].q)} by squaring, then check the answer in the original equation.`,
  make(stage, v, ex) {
    const d = BAL[v], W = ex.W, BWd = 600;
    const B = makeBalance(stage, { width: BWd, height: 430 });
    const blk = (t, cls = '') => `<div class="u4l6-wtin ${cls}">${T(t)}</div>`;
    B.text(0, blk(cR(d.L))); B.text(1, blk(cN(d.R)));
    const P = panel(stage, BWd + 12, 6, W - BWd - 18, 250, 'The algebra');
    lineIn(P, T(`${cR(d.L)}=${cN(d.R)}`), 'u4l6-eq u4l6-eqsm').style.opacity = 1;
    const lIso = d.iso ? workLine(P, `${cR(d.iso[0])}=${cN(d.iso[1])}`, '− 5 both sides') : null;
    const lSq = workLine(P, `${d.sqL}=${d.sqR}`, 'square both sides');
    const lA = workLine(P, `${d.aL}=${d.aR}`);
    const lRoot = d.solve ? workLine(P, d.solve, '', 'u4l6-xans') : null;
    const lChk = workLine(P, `\\text{Check: }${d.chkL}=${d.chkLv}\\ ${d.ok ? '=' : '\\ne'}\\ ${d.chkR}`, '', d.ok ? 'u4l6-okline' : 'u4l6-xline');
    // the fork: 9 came from 3 or from −3
    const fw = W - BWd - 18, F = hide(panel(stage, BWd + 12, 266, fw, 164, 'Going back from 9', 'u4l6-forkp'));
    const fsvg = svgEl('svg', { width: fw - 4, height: 160, viewBox: `0 0 ${fw - 4} 160` }, F), mid = (fw - 4) / 2;
    svgEl('line', { x1: mid, y1: 62, x2: mid - 90, y2: 128, stroke: OK, 'stroke-width': 3 }, fsvg);
    svgEl('line', { x1: mid, y1: 62, x2: mid + 90, y2: 128, stroke: NO, 'stroke-width': 3 }, fsvg);
    const fl = (html, x, y, cls) => { const e = h('div', 'u4l6-fk ' + (cls || ''), html); e.style.left = x + 'px'; e.style.top = y + 'px'; F.appendChild(e); return e; };
    fl(T('9'), mid, 56, 'u4l6-fk9');
    fl(T('3'), mid - 98, 140, 'u4l6-fkp'); fl(T('-3'), mid + 98, 140, 'u4l6-fkn');
    fl(T('3^2'), mid - 70, 96, 'u4l6-fks'); fl(T('(-3)^2'), mid + 76, 96, 'u4l6-fks');
    const fake = d.ok ? null : hide(div(stage, 'u4l6-fake', `A fake root sneaks in: ${T(`x=${d.root}`)}`, 12, 312, 170));
    const st = d.ok ? stampAt(stage, `✓ x = ${d.root} checks`, true, B.cx, 352) : stampAt(stage, 'EXTRANEOUS', false, B.cx, 352, { size: 'lg' });
    const tip = d.ok ? 0 : 13;
    const out = [{ cap: `The equation says the pans <b>balance</b>: ${T(cR(d.L))} on the left, ${T(cN(d.R))} on the right.`, run: async (c) => { B.setSign(null); await pulse(c, B.sign, 1.2); } }];
    if (d.iso) out.push({ cap: 'Isolate first: take <b>5</b> off both pans. Now √(x + 3) = −3, which is <b>already impossible</b>: a square root is never negative.', run: async (c) => { B.text(0, blk(cR(d.iso[0]))); B.text(1, blk(cN(d.iso[1]))); await Promise.all(B.blocks.map((b) => pulse(c, b, 1.12))); await show(c, lIso); } });
    out.push(
      { cap: '<b>Square both pans.</b> Doing the same thing to both sides keeps a balance balanced.', run: async (c) => {
        B.text(0, blk(cS(d.sqL))); B.text(1, blk(cS(d.sqR))); await Promise.all(B.blocks.map((b) => pulse(c, b, 1.15))); await show(c, lSq);
        await sleep(c, 500); B.text(0, blk(d.aL)); B.text(1, blk(d.aR)); await show(c, lA); if (lRoot) await show(c, lRoot); } },
      { cap: `But squaring <b>hides the sign</b>: ${T('3^2=9')} and ${T('(-3)^2=9')}. Going back, the 9 can't tell which one it came from.`, run: async (c) => { await show(c, F); } },
      { cap: d.ok ? `Check ${T(`x=${d.root}`)} in the <b>original</b>: ${T(`${d.chkL}=${d.chkLv}`)} and the right side is ${T(d.chkR)}.` : `So ${T(`x=${d.root}`)} might be a <b>fake</b>. Check it in the <b>original</b>: the left pan is ${T(`${d.chkL}=${d.chkLv}`)}, the right pan is ${T(d.chkR)}.`,
        run: async (c) => {
          B.text(0, blk(`${d.chkL}=${d.chkLv}`, 'u4l6-wtsm')); B.text(1, blk(d.chkR));
          if (d.ok) { await B.wobble(c); B.setSign(true); } else { await B.tilt(c, tip, 900); B.setSign(false); await shake(c, B.sign); }
          await show(c, lChk);
        } },
      { cap: d.ok ? `The pans balance: ${T(`x=${d.root}`)} is a <b>real root</b>. Here the 9 came from +3, which is what √9 gives.` : `The pans don't balance: ${T(`x=${d.root}`)} is <b>extraneous</b>. Reject it: <b>no solution</b>.`,
        run: async (c) => { if (fake) await show(c, fake); await stampIn(c, st); } }
    );
    return out;
  }
};

/* =============================== explainer: the graphs never meet =============================== */
const NM = {
  b: { label: 'Example 3(c): √(x + 3) + 5 and y = 2', f: (x) => Math.sqrt(x + 3) + 5, tw: (x) => 5 - Math.sqrt(x + 3), g: 2, s: [-3, 5], fk: 6, win: [-5, 10, -2, 10],
    fT: 'y=\\sqrt{x+3}+5', twT: 'y=5-\\sqrt{x+3}', gT: 'y=2', lo: 5, flab: [3.4, 9.2], gl: [-4, 2.75], bl: [1, 3.5], tl: [10, 5 - Math.sqrt(13), 'sw'], fkl: 0.9 },
  a: { label: 'Example 3(a): √x and y = −3', f: (x) => Math.sqrt(x), tw: (x) => -Math.sqrt(x), g: -3, s: [0, 0], fk: 9, win: [-2, 12, -5, 5], fT: 'y=\\sqrt{x}', twT: 'y=-\\sqrt{x}', gT: 'y=-3', lo: 0, flab: [5, 3.2], gl: [3, -3.65], bl: [6.5, -1.5], tl: [12, -Math.sqrt(12), 'sw'], fkl: 0.85 },
  ok: { label: 'Compare: √x and y = 3', f: (x) => Math.sqrt(x), g: 3, s: [0, 0], fk: 9, win: [-2, 12, -5, 5], fT: 'y=\\sqrt{x}', gT: 'y=3', ok: true, flab: [4, 1.2], gl: [10.6, 3.65] }
};
const noMeet = {
  title: 'The graphs show it: no meeting, no solution',
  height: 430,
  choices: Object.keys(NM).map((k) => ({ v: k, label: NM[k].label })),
  ask: (v) => (v === 'b' ? `Example 3(c): how do the graphs of ${T('y=\\sqrt{x+3}+5')} and ${T('y=2')} confirm there is no solution?` : `Graph both sides of ${T(v === 'a' ? '\\sqrt{x}=-3' : '\\sqrt{x}=3')}. Where do they meet?`),
  make(stage, v, ex) {
    const d = NM[v], W = ex.W, GW = 560, [x0, x1, y0, y1] = d.win;
    const G = new Graph(stage, { x: 4, y: 20, width: GW, height: 408, xmin: x0, xmax: x1, ymin: y0, ymax: y1, xlabels: 2, ylabels: 2, fontSize: 16 });
    const P = panel(stage, GW + 16, 6, W - GW - 22, 418, '');
    const gl = hide(G.fn(() => d.g, { color: NUM, width: 3.5, dash: '9 7' })), glab = hide(G.label(d.gl[0], d.gl[1], d.gT, { tex: true, color: NUM, cls: 'bk-ptlab' }));
    const f = hide(G.fn(d.f, { from: d.s[0], color: RAD, width: 4.5 })), sp = hideP(G.point(d.s[0], d.s[1], { color: RAD, coords: true, pos: v === 'b' ? 'nw' : 'se' }));
    const flab = hide(G.label(d.flab[0], d.flab[1], d.fT, { tex: true, color: RAD, cls: 'bk-ptlab' }));
    const n1 = lineIn(P, `Right side: ${T(cN(d.gT))}`), n2 = lineIn(P, `Left side: ${T(cR(d.fT))}, starting at ${T(`(${d.s[0]},\\ ${d.s[1]})`)}`);
    if (d.ok) {
      const meet = hideP(G.point(d.fk, d.g, { color: OK, coords: true, pos: 'nw' }));
      const n3 = lineIn(P, `They meet at ${T(`(${d.fk},\\ ${d.g})`)}: the root is ${T(`x=${d.fk}`)}.`, 'u4l6-okline'), n4 = lineIn(P, `Squaring gave ${T('x=9')} too, and here it is real: ${T('\\sqrt{9}=3')} ✓`);
      return [
        { cap: `The right side is the line ${T(d.gT)}.`, run: async (c) => { await drawOn(c, G, gl, 600); await show(c, glab); await show(c, n1); } },
        { cap: `The left side ${T(d.fT)} starts at the origin and rises.`, run: async (c) => { await popP(c, sp); await drawOn(c, G, f, 800); await show(c, flab); await show(c, n2); } },
        { cap: `They meet at ${T(`(${d.fk},\\ ${d.g})`)}: one intersection, one root, ${T(`x=${d.fk}`)}.`, run: async (c) => { await popP(c, meet); await show(c, n3); await show(c, n4); } }
      ];
    }
    const band = hide(G.polyline([[d.s[0], d.g], [x1, d.g], [x1, d.lo], [d.s[0], d.lo]], { closed: true, fill: '#c27a0e', fillOpacity: 0.14, color: 'rgba(194,122,14,.0)', width: 0.1 }));
    const bandLab = hide(G.label(d.bl[0], d.bl[1], `never below ${d.lo}`, { color: SQ, cls: 'bk-ptlab' }));
    const tw = hide(G.fn(d.tw, { from: d.s[0], color: NO, width: 3, dash: '7 6' })), twlab = hide(G.label(d.tl[0], d.tl[1], d.twT, { tex: true, color: NO, cls: 'bk-ptlab', pos: d.tl[2] }));
    const fkP = hide(G.point(d.fk, d.g, { color: NO, open: true })), fkL = hide(G.label(d.fk, d.g + d.fkl, `x=${d.fk}`, { tex: true, color: NO, cls: 'bk-ptlab' }));
    const realY = d.f(d.fk), realP = hideP(G.point(d.fk, realY, { color: RAD, coords: true, pos: 'nw' }));
    const gap = hide(G.segment([d.fk, d.g], [d.fk, realY], { color: NO, width: 3, dash: '4 5' }));
    const n3 = lineIn(P, `It never gets below ${T(String(d.lo))}, so it never reaches ${T(d.gT)}: <b>no intersection</b>.`, 'u4l6-xline');
    const n4 = lineIn(P, `Squaring can't tell ${T('\\sqrt{\\ }')} from ${T('-\\sqrt{\\ }')}. The mirror twin ${T(cX(d.twT))} <b>does</b> reach ${T(String(d.g))}, at ${T(`x=${d.fk}`)}.`);
    const n5 = lineIn(P, `At ${T(`x=${d.fk}`)} the real graph is at ${T(`y=${fx(realY)}`)}, not ${T(String(d.g))}.`);
    const st = stampAt(P, 'EXTRANEOUS', false, (W - GW - 22) / 2, 384);
    return [
      { cap: `Graph each side. The right side is the line ${T(d.gT)}.`, run: async (c) => { await drawOn(c, G, gl, 600); await show(c, glab); await show(c, n1); } },
      { cap: `The left side starts at ${T(`(${d.s[0]},\\ ${d.s[1]})`)} and <b>only rises</b>.`, run: async (c) => { await popP(c, sp); await drawOn(c, G, f, 800); await show(c, flab); await show(c, n2); } },
      { cap: `It never gets below ${d.lo}, so it can never reach ${T(d.gT)}: <b>no intersection, no solution</b>.`, run: async (c) => { await show(c, band); await show(c, bandLab); await show(c, n3); } },
      { cap: `So where did ${T(`x=${d.fk}`)} come from? Squaring also solves the <b>mirror twin</b> ${T(d.twT)}, which does reach ${T(String(d.g))}.`, run: async (c) => { await drawOn(c, G, tw, 800); await show(c, twlab); await pop(c, fkP); await show(c, fkL); await show(c, n4); } },
      { cap: `At ${T(`x=${d.fk}`)} the real graph is at height ${fx(realY)}, not ${T(String(d.g))}: ${T(`x=${d.fk}`)} is <b>extraneous</b>.`, run: async (c) => { await popP(c, realP); await drawOn(c, G, gap, 500); await show(c, n5); await stampIn(c, st); } }
    ];
  }
};

/* =============================== explainer: a radical on each side =============================== */
const TR = {
  a: { label: 'Example 4(a)', eq: '\\sqrt{5x-2}=\\sqrt{2x+7}', rads: [{ r: '5x-2', t: 'x\\ge\\tfrac{2}{5}', b: 0.4 }, { r: '2x+7', t: 'x\\ge-\\tfrac{7}{2}', b: -3.5 }], lo: 0.4, loT: 'x\\ge\\tfrac{2}{5}', nl: [-5, 6],
    sq: [['5x-2=2x+7', 'square both sides'], ['3x=9', ''], ['x=3', '']], x: 3, chk: ['\\sqrt{5(3)-2}=\\sqrt{13}', '\\sqrt{2(3)+7}=\\sqrt{13}'], ok: true },
  b: { label: '(b)', eq: '3\\sqrt{x-2}=\\sqrt{5x+6}', rads: [{ r: 'x-2', t: 'x\\ge2', b: 2 }, { r: '5x+6', t: 'x\\ge-\\tfrac{6}{5}', b: -1.2 }], lo: 2, loT: 'x\\ge2', nl: [-3, 8], coef: true,
    sq: [[`${cS('9')}(x-2)=5x+6`, `${'square: '}${T('3^2=9')}`], ['9x-18=5x+6', ''], ['4x=24\\Rightarrow x=6', '']], x: 6, chk: ['3\\sqrt{6-2}=3\\sqrt{4}=6', '\\sqrt{5(6)+6}=\\sqrt{36}=6'], ok: true },
  c: { label: '(c)', eq: '\\sqrt{2x-9}=\\sqrt{x-7}', rads: [{ r: '2x-9', t: 'x\\ge\\tfrac{9}{2}', b: 4.5 }, { r: 'x-7', t: 'x\\ge7', b: 7 }], lo: 7, loT: 'x\\ge7', nl: [0, 10],
    sq: [['2x-9=x-7', 'square both sides'], ['x=2', '']], x: 2, chk: ['\\sqrt{2(2)-9}=\\sqrt{-5}', '\\text{not a real number}'], ok: false }
};
const twoRad = {
  title: 'A radical on each side',
  height: 432, minW: 900,
  choices: [{ sep: 'Check:' }, ...Object.keys(TR).map((k) => ({ v: k, label: TR[k].label }))],
  ask: (v) => `Example 4${v === 'a' ? '(a)' : `(${v})`}: solve and verify ${T(TR[v].eq)}.`,
  make(stage, v, ex) {
    const d = TR[v], W = ex.W, cols = [RAD, NUM];
    let eqc = d.eq; d.rads.forEach((r, i) => { eqc = eqc.replace(`\\sqrt{${r.r}}`, `\\sqrt{\\textcolor{${cols[i]}}{${r.r}}}`); });
    div(stage, 'u4l6-eq u4l6-eqc', T(eqc), 0, 2, W, 44);
    const N = new NumberLine(stage, { x: 4, y: 46, width: W - 8, height: 168, min: d.nl[0], max: d.nl[1], step: 1, axisY: 124, fontSize: 18 });
    const ivs = d.rads.map((r, i) => hide(N.interval(r.b, Infinity, { color: cols[i], lift: 74 - i * 34, width: 6 })));
    const ivL = d.rads.map((r, i) => hide(div(stage, 'u4l6-ivlab', `${T(`\\textcolor{${cols[i]}}{${r.r}}\\ge0`)}: ${T(r.t)}`, 4 + N.toPx(r.b) - 12, 46 + 124 - (74 - i * 34) - 38)));
    const over = hide(N.interval(d.lo, Infinity, { color: OK, width: 11 }));
    const overL = hide(div(stage, 'u4l6-ivlab u4l6-ivok', `both: ${T(d.loT)}`, 4 + Math.min(N.toPx(d.lo) + 40, W - 200), 46 + 124 - 30));
    const cand = hide(N.point(d.x, { color: d.ok ? OK : NO, label: T(`x=${d.x}`), lift: 0 }));
    if (cand.label) hide(cand.label);
    const PW = (W - 26) / 2;
    const A = panel(stage, 6, 222, PW, 204, 'Square and solve', 'u4l6-big2');
    const ls = d.sq.map(([t, n]) => workLine(A, t, n));
    const C = panel(stage, PW + 20, 222, PW, 204, `Verify ${T(`x=${d.x}`)}`, 'u4l6-big2');
    const c1 = workLine(C, d.chk[0], 'left'), c2 = workLine(C, d.chk[1], d.ok ? 'right' : '', d.ok ? 'u4l6-okline' : 'u4l6-xline');
    const st = d.ok ? stampAt(stage, `✓ x = ${d.x}`, true, PW + 20 + PW - 80, 396, { size: 'sm' }) : stampAt(stage, 'EXTRANEOUS: no solution', false, PW + 20 + PW / 2, 372);
    const where = d.ok ? `It lands in the green zone: allowed.` : `It lands <b>outside</b> the green zone: ${T('x=2')} breaks ${T('x\\ge7')}.`;
    return [
      { cap: '<b>Each</b> radicand must be ≥ 0: two restrictions.', run: async (c) => { for (let i = 0; i < 2; i++) { await drawOn(c, N, ivs[i], 500); await show(c, ivL[i]); } } },
      { cap: `Both at once: keep the <b>overlap</b>, ${T(d.loT)}.`, run: async (c) => { await drawOn(c, N, over, 600); await show(c, overL); } },
      { cap: d.coef ? `Square both sides. The <b>3</b> is squared too: ${T('\\left(3\\sqrt{x-2}\\right)^2=9(x-2)')}.` : `Square both sides: ${T('\\left(\\sqrt{A}\\right)^2=\\left(\\sqrt{B}\\right)^2')} gives ${T('A=B')}.`, run: (c) => show(c, ls[0]) },
      { cap: `Solve: ${T(`x=${d.x}`)}.`, run: async (c) => { for (const l of ls.slice(1)) await show(c, l); } },
      { cap: `Where does ${T(`x=${d.x}`)} land? ${where}`, run: async (c) => { await pop(c, cand); await show(c, cand.label); if (!d.ok) await shake(c, cand.label); } },
      { cap: d.ok ? `Verify in both radicals: both sides are equal, so ${T(`x=${d.x}`)} is the solution.` : `Verify: ${T('\\sqrt{2(2)-9}=\\sqrt{-5}')} is not real. ${T('x=2')} is <b>extraneous</b>: <b>no solution</b>.`,
        run: async (c) => { await show(c, c1); await show(c, c2); await stampIn(c, st); } }
    ];
  }
};

/* =============================== explainer: checking with a graph (calculator style, keycaps only) =============================== */
const CG = {
  ex5: { label: 'Example 5(b) check', y1: '√(2X−4)', y2: '4', f: (x) => Math.sqrt(2 * x - 4), g: () => 4, win: { xmin: -2, xmax: 14, ymin: -2, ymax: 6, xscl: 2, yscl: 1 }, guess: 9, meet: true,
    eq: '\\sqrt{2x-4}=4', note: `The root is ${T('x=10')}, the same as the algebra. ${T('Y_1')} starts at ${T('(2,\\ 0)')}: no graph for ${T('x<2')}.` },
  b3: { label: 'Example 3(b) graph', y1: '√(X+3)+5', y2: '2', f: (x) => Math.sqrt(x + 3) + 5, g: () => 2, win: { xmin: -5, xmax: 10, ymin: -2, ymax: 10, xscl: 1, yscl: 1 }, guess: 6, meet: false,
    eq: '\\sqrt{x+3}+5=2', note: `The graphs never meet: <b>no solution</b>. ${T('x=6')} is extraneous: no intersection there.` },
  c4: { label: 'Example 4(c) graph', y1: '√(2X−9)', y2: '√(X−7)', f: (x) => Math.sqrt(2 * x - 9), g: (x) => Math.sqrt(x - 7), win: { xmin: 0, xmax: 14, ymin: -1, ymax: 5, xscl: 1, yscl: 1 }, guess: 8, meet: false, mark: 2,
    eq: '\\sqrt{2x-9}=\\sqrt{x-7}', note: `No meeting: <b>no solution</b>. At ${T('x=2')} neither graph even exists.` }
};
const keys = (...ks) => `<span class="keys">${ks.map((k) => `<kbd>${k}</kbd>`).join('')}</span>`;
const calcGraph = {
  title: 'Checking with a graph',
  height: 432, minW: 900,
  choices: Object.keys(CG).map((k) => ({ v: k, label: CG[k].label })),
  ask: (v) => `Check ${T(CG[v].eq)} on a graphing calculator: where do ${T('Y_1')} and ${T('Y_2')} meet?`,
  make(stage, v, ex) {
    const d = CG[v], W = ex.W, GW = 540;
    const ks = div(stage, 'u4l6-keystrip', '<span class="u4l6-kh">Keys</span>', 6, 4, GW, 46);
    const G = new Graph(stage, { x: 6, y: 56, width: GW, height: 370, theme: 'calc', xmin: -10, xmax: 10, ymin: -10, ymax: 10 });
    const scr = panel(stage, GW + 20, 6, W - GW - 26, 420, '', 'u4l6-calcp');
    const yeq = lineIn(scr, `<div class="u4l6-ti"><div><b class="u4l6-ti1">Y1=</b>${d.y1}</div><div><b class="u4l6-ti2">Y2=</b>${d.y2}</div></div>`);
    const w = d.win, win = lineIn(scr, `<div class="u4l6-ti u4l6-tiw"><div>WINDOW</div><div>Xmin=${w.xmin < 0 ? '−' + -w.xmin : w.xmin}</div><div>Xmax=${w.xmax}</div><div>Xscl=${w.xscl}</div><div>Ymin=${w.ymin < 0 ? '−' + -w.ymin : w.ymin}</div><div>Ymax=${w.ymax}</div><div>Yscl=${w.yscl}</div></div>`);
    const nt = lineIn(scr, d.note, d.meet ? 'u4l6-okline' : 'u4l6-xline');
    const y1 = hide(G.fn(d.f, { color: '#1f5bd6', width: 3 })), y2 = hide(G.fn(d.g, { color: '#c93a33', width: 3 }));
    const it = d.meet ? G.intersect(d.f, d.g, d.guess) : null;
    const pt = it ? hide(G.point(it.x, it.y, { color: 'ink', r: 6 })) : null;
    const mk = d.mark != null ? hide(G.vline(d.mark, { color: '#7b4fc4', width: 2.5 })) : null;
    const setKeys = (html) => { ks.innerHTML = `<span class="u4l6-kh">Keys</span>${html}`; };
    return [
      { cap: `${keys('Y=')} Enter the left side as ${T('Y_1')} and the right side as ${T('Y_2')}.`, run: async (c) => { setKeys(keys('Y=')); await show(c, yeq); } },
      { cap: `${keys('WINDOW')} Set the window so the important part of both graphs shows.`, run: async (c) => { setKeys(keys('WINDOW')); await show(c, win); await G.setWindow(w, c, 800); } },
      { cap: `${keys('GRAPH')} Both sides appear: ${T('Y_1')} in blue, ${T('Y_2')} in red.`, run: async (c) => { setKeys(keys('GRAPH')); await drawOn(c, G, y1, 800); await drawOn(c, G, y2, 600); if (mk) await show(c, mk); } },
      { cap: `${keys('2nd', 'TRACE')} (CALC), <b>5: intersect</b>, then ${keys('ENTER')} three times (first curve, second curve, guess).`,
        run: async (c) => { setKeys(`${keys('2nd', 'TRACE')} <b>5</b> ${keys('ENTER', 'ENTER', 'ENTER')}`); if (pt) { await pop(c, pt); G.readout('Intersection', it); } else { G.readout('ERROR: NO SIGN CHNG', null); await shake(c, G.ro); } } },
      { cap: d.meet ? `Intersection at X = 10, Y = 4: the root is <b>x = 10</b>.` : 'The calculator finds <b>no intersection</b>: the graphs never meet, so there is no solution.', run: (c) => show(c, nt) }
    ];
  }
};

/* =============================== explainer: skid marks =============================== */
const SK = { ex6: { label: 'Example 6 check: 80 km/h', s: 80 }, s40: { label: '40 km/h', s: 40 }, s120: { label: '120 km/h', s: 120 }, cmp: { label: 'Compare speeds', cmp: true } };
function road(stage, x, y, w, hh, k) {
  const R = div(stage, 'u4l6-road', '', x, y, w, hh);
  const svg = svgEl('svg', { width: w, height: hh, viewBox: `0 0 ${w} ${hh}` }, R);
  svgEl('rect', { x: 0, y: 0, width: w, height: hh, fill: '#5d636e', rx: 6 }, svg);
  for (let i = 0; i < w; i += 46) svgEl('rect', { x: i + 6, y: hh / 2 - 2, width: 24, height: 4, fill: '#f4e9b8' }, svg);
  const skid = svgEl('g', {}, svg);
  const s1 = svgEl('rect', { x: 0, y: hh * 0.24, width: 0, height: 5, fill: '#1c1f24' }, skid), s2 = svgEl('rect', { x: 0, y: hh * 0.62, width: 0, height: 5, fill: '#1c1f24' }, skid);
  const car = svgEl('g', {}, svg);
  svgEl('rect', { x: -66, y: hh * 0.16, width: 66, height: hh * 0.62, rx: 10, fill: '#c93a33', stroke: '#7a1f1a', 'stroke-width': 2 }, car);
  svgEl('rect', { x: -36, y: hh * 0.24, width: 20, height: hh * 0.46, rx: 4, fill: '#cfe3f3' }, car);
  [[-58, hh * 0.1], [-16, hh * 0.1], [-58, hh * 0.72], [-16, hh * 0.72]].forEach(([cx, cy]) => svgEl('rect', { x: cx, y: cy, width: 14, height: 8, rx: 2, fill: '#1c1f24' }, car));
  const X0 = 80;
  const set = (m) => { const px = X0 + m * k; s1.setAttribute('x', X0 - 30); s1.setAttribute('width', Math.max(0, px - X0)); s2.setAttribute('x', X0 - 30); s2.setAttribute('width', Math.max(0, px - X0)); car.setAttribute('transform', `translate(${px + 36} 0)`); };
  set(0);
  return { R, set, X0 };
}
const skid = {
  title: 'Skid marks: s = 4√(10d)',
  height: 412, minW: 900,
  choices: [{ v: 'ex6', label: SK.ex6.label }, { v: 's40', label: SK.s40.label }, { v: 's120', label: SK.s120.label }, { v: 'cmp', label: SK.cmp.label }],
  ask: (v) => (v === 'cmp' ? 'How do the skid marks change when the speed doubles or triples?' : `How long are the skid marks of a car travelling at ${SK[v].s} km/h?`),
  make(stage, v, ex) {
    const W = ex.W, k = (W - 200) / 100;
    const ruler = (y) => { const r = div(stage, 'u4l6-ruler', '', 4, y, W - 8, 26); for (let m = 0; m <= 100; m += 10) { const t = h('div', 'u4l6-rt', m === 0 ? '0 m' : String(m)); t.style.left = (50 + m * k) + 'px'; r.appendChild(t); } return r; };
    if (SK[v].cmp) {
      const rows = [40, 80, 120].map((s, i) => { const d = Math.pow(s / 4, 2) / 10; const y = 10 + i * 118; const rd = road(stage, 4, y, W - 8, 62, k); const lab = hide(div(stage, 'u4l6-sklab', `<b>${s} km/h</b> → ${T(`d=${fx(d)}`)} m`, 14, y + 66)); return { rd, d, lab, s }; });
      ruler(364);
      return [
        { cap: '40 km/h: skid marks of 10 m.', run: async (c) => { await tween(c, 900, (t) => rows[0].rd.set(rows[0].d * t)); await show(c, rows[0].lab); } },
        { cap: 'Twice the speed, 80 km/h: 40 m, <b>four times</b> as long.', run: async (c) => { await tween(c, 1100, (t) => rows[1].rd.set(rows[1].d * t)); await show(c, rows[1].lab); } },
        { cap: 'Three times the speed, 120 km/h: 90 m, <b>nine times</b> as long. The length grows with the <b>square</b> of the speed: d = s² ÷ 160.', run: async (c) => { await tween(c, 1300, (t) => rows[2].rd.set(rows[2].d * t)); await show(c, rows[2].lab); } }
      ];
    }
    const s = SK[v].s, q = s / 4, sq = q * q, d = sq / 10;
    const rd = road(stage, 4, 8, W - 8, 92, k); ruler(104);
    const badge = div(stage, 'u4l6-spd', `${s} km/h`, 14, 136);
    const P = panel(stage, 150, 136, W - 160, 270, '', 'u4l6-big2');
    lineIn(P, T('s=4\\sqrt{10d}'), 'u4l6-eq u4l6-eqsm').style.opacity = 1;
    const l1 = workLine(P, `${cN(String(s))}=4\\sqrt{${cR('10d')}}`, `substitute ${T(`s=${s}`)}`);
    const l2 = workLine(P, `${q}=\\sqrt{10d}`, '÷ 4 both sides');
    const l3 = workLine(P, `${sq}=10d`, 'square both sides');
    const l4 = workLine(P, `d=${fx(d)}`, '÷ 10', 'u4l6-xans');
    const l5 = workLine(P, `\\text{Verify: }4\\sqrt{10(${fx(d)})}=4\\sqrt{${sq}}=4(${q})=${s}\\ ✓`, '', 'u4l6-okline');
    const dl = hide(div(stage, 'u4l6-sklen', `${fx(d)} m`, 4 + 50 + (d * k) / 2 - 40, 34, 80));
    return [
      { cap: `Substitute the speed ${T(`s=${s}`)}. The unknown, ${T('d')}, is <b>under</b> the root.`, run: (c) => show(c, l1) },
      { cap: '<b>Isolate</b> the radical: divide both sides by 4.', run: (c) => show(c, l2) },
      { cap: '<b>Square</b> both sides to undo the root.', run: (c) => show(c, l3) },
      { cap: `Divide by 10: the skid marks are <b>${fx(d)} m</b> long.`, run: async (c) => { await show(c, l4); await tween(c, 1200, (t) => rd.set(d * t), (t) => 1 - Math.pow(1 - t, 2)); await show(c, dl); } },
      { cap: `Verify: ${s} km/h ✓.${s === 80 ? '' : ' Compare with Example 6 (80 km/h → 40 m).'}`, run: (c) => show(c, l5) }
    ];
  }
};

/* =============================== explainer: the pendulum =============================== */
const per = (L) => 2 * Math.PI * Math.sqrt(L / 9.8);
const PD = { a: { label: 'Example 7(a): L = 1.5 m' }, b: { label: '(b): T = 2.5 s' }, c: { label: '(c): solve for L' }, cmp: { label: '4× the length' } };
function pendulum1(stage, px, py, Lm, scale, o = {}) {
  const Lp = Lm * scale, g = svgEl('g', {}, o.svg);
  const rod = svgEl('line', { x1: px, y1: py, x2: px, y2: py + Lp, stroke: '#3a4254', 'stroke-width': 3 }, g);
  const bob = svgEl('circle', { cx: px, cy: py + Lp, r: o.r || 17, fill: o.color || '#7b4fc4', stroke: '#1c2230', 'stroke-width': 2.5 }, g);
  svgEl('circle', { cx: px, cy: py, r: 5, fill: '#1c2230' }, g);
  const P = { g, Lp, set(th, L2) { if (L2 != null) P.Lp = L2 * scale; const r = th * Math.PI / 180, x = px + P.Lp * Math.sin(r), y = py + P.Lp * Math.cos(r); rod.setAttribute('x2', x); rod.setAttribute('y2', y); bob.setAttribute('cx', x); bob.setAttribute('cy', y); } };
  return P;
}
const pendulum = {
  title: 'The pendulum: T = 2π√(L ÷ 9.8)',
  height: 420, minW: 900,
  choices: Object.keys(PD).map((k) => ({ v: k, label: PD[k].label })),
  ask: (v) => ({ a: 'Example 7(a): the period of a 1.5 m pendulum, to the nearest hundredth of a second.', b: 'Example 7(b): the length that gives a period of 2.5 s, to the nearest centimetre.', c: 'Example 7(c): solve the formula for <i>L</i>.', cmp: 'What happens to the period when the pendulum is 4 times as long?' })[v],
  make(stage, v, ex) {
    const W = ex.W, LW = 360, SC = 150, PY = 30;
    const svg = svgEl('svg', { width: LW, height: 420, viewBox: `0 0 ${LW} 420` }, stage); svg.style.position = 'absolute'; svg.style.left = '0px'; svg.style.top = '0px';
    svgEl('rect', { x: 20, y: 14, width: LW - 40, height: 14, fill: '#8a6d4b', rx: 3 }, svg);
    for (let i = 26; i < LW - 30; i += 18) svgEl('line', { x1: i, y1: 14, x2: i - 10, y2: 4, stroke: '#8a6d4b', 'stroke-width': 2 }, svg);
    const watch = div(stage, 'u4l6-watch u4l6-pw', '0.00 s', LW - 124, 372);
    const swing = async (c, pens, Tmax) => {
      const ms = Tmax * 1000, A = 16;
      await tween(c, ms, (t) => { const s = t * Tmax; pens.forEach(([P, Tp]) => P.set(A * Math.cos(2 * Math.PI * s / Tp))); watch.textContent = s.toFixed(2) + ' s'; }, linear);
    };
    const P = panel(stage, LW + 10, 6, W - LW - 16, 408, '', 'u4l6-big2');
    lineIn(P, T('T=2\\pi\\sqrt{\\dfrac{L}{9.8}}'), 'u4l6-eq u4l6-eqsm').style.opacity = 1;
    if (v === 'cmp') {
      const p1 = pendulum1(stage, 110, PY, 0.5, SC, { svg, color: '#1f5bd6', r: 14 }), p2 = pendulum1(stage, 250, PY, 2, SC, { svg, color: '#7b4fc4' });
      [p1, p2].forEach((p) => p.set(16));
      const t1 = per(0.5), t2 = per(2);
      const l1 = workLine(P, `L=0.5:\\ T=2\\pi\\sqrt{\\tfrac{0.5}{9.8}}\\approx${fx(t1)}\\text{ s}`);
      const l2 = workLine(P, `L=2:\\ \\ \\ T=2\\pi\\sqrt{\\tfrac{2}{9.8}}\\approx${fx(t2)}\\text{ s}`);
      const l3 = lineIn(P, `4 times the length gives only <b>2 times</b> the period: ${T('\\sqrt{4}=2')}, because <i>L</i> is under the square root.`, 'u4l6-keyl');
      return [
        { cap: 'Two pendulums: 0.5 m and 2 m (4 times as long).', run: async (c) => { await show(c, l1); await show(c, l2); } },
        { cap: `Let them swing for ${fx(t2)} s: the short one swings <b>twice</b> while the long one swings once.`, run: (c) => swing(c, [[p1, t1], [p2, t2]], t2) },
        { cap: '4 times the length → only <b>twice</b> the period. Square roots grow slowly.', run: (c) => show(c, l3) }
      ];
    }
    const Ld = v === 'a' ? 1.5 : 1.2;
    const pen = pendulum1(stage, LW / 2, PY, v === 'b' ? 0.4 : Ld, SC, { svg }); pen.set(16, v === 'b' ? 0.4 : Ld);
    const lab = div(stage, 'u4l6-plab', v === 'c' ? T('L') : v === 'a' ? '1.5 m' : T('L=\\ ?'), LW / 2 - 96, PY + (v === 'b' ? 0.4 : Ld) * SC / 2 - 14, 80); lab.style.textAlign = 'right';
    if (v === 'a') {
      const r = 1.5 / 9.8, s = Math.sqrt(r), Tm = per(1.5);
      const l1 = workLine(P, `T=2\\pi\\sqrt{\\dfrac{${cR('1.5')}}{9.8}}`, `substitute ${T('L=1.5')}`);
      const l2 = workLine(P, `=2\\pi\\sqrt{${fx(r, 5)}\\ldots}`, 'inside first');
      const l3 = workLine(P, `=2\\pi(${fx(s, 5)}\\ldots)`, 'then the root');
      const l4 = workLine(P, `T\\approx${fx(Tm, 2)}\\text{ s}`, 'nearest hundredth', 'u4l6-xans');
      return [
        { cap: `Substitute ${T('L=1.5')}. Here the unknown <i>T</i> is already alone: just evaluate.`, run: (c) => show(c, l1) },
        { cap: `Work inside out: ${T('1.5\\div9.8')}, then the square root, then times ${T('2\\pi')}.`, run: async (c) => { await show(c, l2); await show(c, l3); } },
        { cap: `${T(`T\\approx${fx(Tm, 2)}`)} s. Watch one full swing (there and back) in real time.`, run: async (c) => { await show(c, l4); await swing(c, [[pen, Tm]], Tm); } }
      ];
    }
    if (v === 'b') {
      const q = 2.5 / (2 * Math.PI), q2 = q * q, L = 9.8 * q2;
      const l1 = workLine(P, `${cN('2.5')}=2\\pi\\sqrt{\\dfrac{${cR('L')}}{9.8}}`, `substitute ${T('T=2.5')}`);
      const l2 = workLine(P, `\\sqrt{\\dfrac{L}{9.8}}=\\dfrac{2.5}{2\\pi}=${fx(q, 5)}\\ldots`, `÷ ${T('2\\pi')}`);
      const l3 = workLine(P, `\\dfrac{L}{9.8}=${fx(q2, 5)}\\ldots`, 'square both sides');
      const l4 = workLine(P, `L\\approx${fx(L, 3)}\\text{ m}\\approx${Math.round(L * 100)}\\text{ cm}`, '× 9.8', 'u4l6-xans');
      return [
        { cap: `Substitute ${T('T=2.5')}. Now the unknown <i>L</i> is <b>under</b> the root.`, run: (c) => show(c, l1) },
        { cap: `<b>Isolate</b> the radical: divide both sides by ${T('2\\pi')}.`, run: (c) => show(c, l2) },
        { cap: '<b>Square</b> both sides (keep all the digits: round only at the end).', run: (c) => show(c, l3) },
        { cap: `Multiply by 9.8: ${T(`L\\approx${fx(L, 3)}`)} m, about <b>${Math.round(L * 100)} cm</b>.`, run: async (c) => { await show(c, l4); await tween(c, 700, (t) => pen.set(16, 0.4 + (L - 0.4) * t)); lab.innerHTML = `${fx(L, 2)} m`; lab.style.top = (PY + L * SC / 2 - 14) + 'px'; lab.style.left = (LW / 2 - 116) + 'px'; lab.style.width = '100px'; } },
        { cap: `Check: a ${fx(L, 2)} m pendulum takes 2.5 s for one full swing.`, run: (c) => swing(c, [[pen, 2.5]], 2.5) }
      ];
    }
    const l1 = workLine(P, `\\dfrac{T}{2\\pi}=\\sqrt{\\dfrac{L}{9.8}}`, `÷ ${T('2\\pi')} both sides`);
    const l2 = workLine(P, `\\dfrac{T^2}{4\\pi^2}=\\dfrac{L}{9.8}`, `square: ${T('(2\\pi)^2=4\\pi^2')}`);
    const l3 = workLine(P, `L=\\dfrac{9.8T^2}{4\\pi^2}`, '× 9.8 both sides', 'u4l6-xans');
    const l4 = workLine(P, `T=2.5:\\ L=\\dfrac{9.8(2.5)^2}{4\\pi^2}\\approx1.551\\text{ m}`, 'same as (b)', 'u4l6-okline');
    return [
      { cap: `Peel from the outside in. First divide both sides by ${T('2\\pi')}.`, run: (c) => show(c, l1) },
      { cap: `Square both sides. The ${T('2\\pi')} is squared too: ${T('4\\pi^2')}.`, run: (c) => show(c, l2) },
      { cap: 'Multiply both sides by 9.8: the formula for <i>L</i>.', run: (c) => show(c, l3) },
      { cap: `It agrees with (b): ${T('T=2.5')} gives ${T('L\\approx1.551')} m.`, run: (c) => show(c, l4) }
    ];
  }
};

/* =============================== Stand Up Break =============================== */
const lin = (a, b, v = 'x') => `${a === 1 ? '' : a === -1 ? '-' : a}${v}${b === 0 ? '' : b > 0 ? '+' + b : String(b)}`;
standup('u4l6', {
  intro: 'At your whiteboard: restriction, isolate, square, solve, and verify. Watch for fakes!',
  levels: {
    BEG: (r) => { // √(ax + b) = c
      const a = r.pick([1, 2, 3, 4]), x = r.int(-3, 9), c = r.int(2, 7), b = c * c - a * x;
      return { text: 'Solve and verify.', q: `\\sqrt{${lin(a, b)}}=${c}`,
        a: [`${lin(a, b)}=${c * c}`, `x=${x}`, `\\text{Verify: }\\sqrt{${a * x + b}}=${c}\\ \\checkmark`] };
    },
    PRG: (r) => { // k√(x + b) + d = e
      const k = r.pick([2, 3, 4, 5]), c = r.int(1, 6), b = r.int(-6, 6), d = r.int(-8, 8) || 3, e = k * c + d, x = c * c - b;
      return { text: 'Isolate the radical, then solve and verify.', q: `${k}\\sqrt{${lin(1, b)}}${d > 0 ? '+' + d : d}=${e}`,
        a: [`${k}\\sqrt{${lin(1, b)}}=${e - d}`, `\\sqrt{${lin(1, b)}}=${c}`, `${lin(1, b)}=${c * c}\\Rightarrow x=${x}`, `\\text{Verify: }${k}(${c})${d > 0 ? '+' + d : d}=${e}\\ \\checkmark`] };
    },
    MAS: (r) => {
      if (r.chance(0.5)) { // a fake: √(x + b) + d = e with e < d
        const b = r.int(-5, 6), d = r.int(5, 9), e = d - r.int(2, 4), m = e - d, x = m * m - b;
        return { text: 'Solve and verify. Is there a solution?', q: `\\sqrt{${lin(1, b)}}+${d}=${e}`,
          a: [`\\sqrt{${lin(1, b)}}=${m}\\ \\text{(a square root is never negative)}`, `\\text{Squaring anyway: }${lin(1, b)}=${m * m}\\Rightarrow x=${x}`, `\\text{Verify: }\\sqrt{${m * m}}+${d}=${-m + d}\\ne${e}`, `x=${x}\\text{ is extraneous: no solution}`] };
      }
      // m√(x + b) = √(px + q), integer root
      const m = r.pick([2, 3]), x0 = r.int(2, 8), b = r.int(-1, 4), v = m * m * (x0 + b), p = r.pick([1, 2, 3, 5].filter((t) => t !== m * m)), q = v - p * x0;
      return { text: 'Solve and verify.', q: `${m}\\sqrt{${lin(1, b)}}=\\sqrt{${lin(p, q)}}`,
        a: [`${m * m}(${lin(1, b)})=${lin(p, q)}`, `${lin(m * m, m * m * b)}=${lin(p, q)}`, `x=${x0}`, `\\text{Verify: }${m}\\sqrt{${x0 + b}}=\\sqrt{${v}}\\ \\checkmark`] };
    }
  }
});

/* =============================== mount =============================== */
mountWell();
export const explainers = mountExplainers({ restrict, eachTerm, steps, balance, noMeet, twoRad, calcGraph, skid, pendulum });
export const _test = { RSD, ST, BAL, NM, TR, CG, SK, per };
