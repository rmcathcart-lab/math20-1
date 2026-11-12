/* Math 20-1 · Unit 4 · Lesson 4 — Differences of Squares, Including a²(f(x))² − b²(g(y))².
 * New lesson format (2026-11-11): the warm-up is plain markup on the page (no code), and the explainers are
 *   sumNo (Ryan's X for x² + 36: c on top, 0 underneath, every pair listed and none can be circled; then x² − 36,
 *     where −6 and 6 are circled and go on the sides),
 *   dosTest (three checks — two terms, both squares, subtracted — then √ each term for A and B; Example 1 checks),
 *   fracSquares (root the numerator and the denominator separately; decimals as hundredths; two ways for Example 4(a)),
 *   keepGoing (a factor tree: differences keep opening, sums stay shut, odd powers stop; Example 5 checks),
 *   boxSub (A and B in coloured boxes; keep the brackets, the minus reaches every term of B; Example 6 checks),
 *   checklist (the factoring checklist as a flowchart, lit for each part of Example 8),
 *   factorOf (the fully factored form as cards; a candidate is a factor if it is a card or a product of cards; Ex 9).
 * Example 7 keeps its static patio figure (mountPatio).
 * Colours: A rose #a33357, B amber #c27a0e (as in the formula boxes on the page), done/✓ green, "does not factor" red.
 * No calculator in this unit. */
import {
  h, tex, add, box, Flowchart, stamp, stampIn, mountExplainers, pop, fadeIn, appear, sleep, tween, pulse, shake,
  svgEl, place, drawIn, anim, liveCtx
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const CA = '#a33357', CB = '#c27a0e', OK = '#12805a', RED = '#c93a33', INK = '#1c2230', BR = '#7a1f3d', GRAY = '#8a8f99';
const tc = (c, s) => `\\textcolor{${c}}{${s}}`;
const cA = (s) => tc(CA, s), cB = (s) => tc(CB, s), cR = (s) => tc(RED, s), cG = (s) => tc(OK, s);
const bxA = (s) => `\\fcolorbox{${CA}}{#fbeef2}{$${s}$}`, bxB = (s) => `\\fcolorbox{${CB}}{#fdf3e2}{$${s}$}`;
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const mkSvg = (stage, W, H) => { const s = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u4l4-svg' }, stage); s.style.left = '0px'; s.style.top = '0px'; return s; };
const lab = (stage, x, y, html, cls = '', pos = 'c', gap = 0) => { const d = h('div', 'u4l4-lab ' + cls, html); stage.appendChild(d); place(d, x, y, pos, gap); return d; };
const panel = (stage, x, y, w, hh, title, cls = '') => add(stage, box(h('div', 'u4l4-panel ' + cls, title ? `<div class="u4l4-ph">${title}</div>` : ''), w, hh), x, y);
const line = (p, html, cls = '') => { const d = h('div', 'u4l4-line ' + cls, html); p.appendChild(d); return d; };
const lineH = (p, html, cls = '') => hide(line(p, html, cls));
const nf = (v) => String(+(+v).toFixed(6));
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const byId = (id) => document.getElementById(id);

/* =============================== explainer: a sum of squares does not factor (Ryan's X) =============================== */
/* Ryan's X (2026-11-11): c on top (it is ac, with a = 1), b underneath, the two numbers on the sides; the factor pairs
 * are listed beside the X and the right pair is circled. For x² + n nothing can be circled. */
function ryanX(stage, svg, cx, cy, r, top, bot) {
  const g = svgEl('g', {}, svg); g.style.opacity = 0;
  [[cx - r, cy - r, cx + r, cy + r], [cx + r, cy - r, cx - r, cy + r]].forEach(([x1, y1, x2, y2]) => svgEl('line', { x1, y1, x2, y2, stroke: '#2b55a0', 'stroke-width': 5, 'stroke-linecap': 'round' }, g));
  const X = { g, la: hide(lab(stage, cx, cy - r - 16, T('c'), 'u4l4-xv u4l4-xlab')), lb: hide(lab(stage, cx, cy + r + 18, T('b'), 'u4l4-xv u4l4-xlab')),
    top: hide(lab(stage, cx, cy - r * 0.7, T(top), 'u4l4-xv u4l4-xtop')), bot: hide(lab(stage, cx, cy + r * 0.72, T(bot), 'u4l4-xv u4l4-xbot')),
    L: hide(lab(stage, cx - r * 0.84, cy, '', 'u4l4-xv u4l4-xside')), R: hide(lab(stage, cx + r * 0.84, cy, '', 'u4l4-xv u4l4-xside')) };
  X.show = async (c) => { g.style.opacity = 1; await appear(c, g, 300); await show(c, X.la); await pop(c, X.top); await show(c, X.lb); await pop(c, X.bot); };
  return X;
}
const SN = { n36: { label: T('x^2+36'), n: 36 }, n49: { label: T('x^2+49'), n: 49 } };
const sumNo = {
  title: 'Product +n and sum 0: the X that never works',
  height: 450, minW: 900,
  choices: Object.keys(SN).map((k) => ({ v: k, label: SN[k].label + ' vs ' + T(`x^2-${SN[k].n}`) })),
  ask: (k) => `Can ${T(`x^2+${SN[k].n}`)} be factored? What about ${T(`x^2-${SN[k].n}`)}?`,
  make(stage, k, ex) {
    const n = SN[k].n, W = ex.W, H = 450, r = Math.round(Math.sqrt(n)), prs = [];
    for (let d = 1; d * d <= n; d++) if (n % d === 0) prs.push([d, n / d]);
    const svg = mkSvg(stage, W, H), M = Math.round(W * 0.585);
    svgEl('line', { x1: M, y1: 12, x2: M, y2: H - 12, stroke: '#e4ddcf', 'stroke-width': 2 }, svg);
    // left: x² + n
    lab(stage, M / 2, 26, T(`x^2+${n}`), 'u4l4-ph2');
    lab(stage, M / 2, 64, `${T('b=0')}: need product ${T('+' + n)}, sum ${T('0')}`, 'u4l4-need');
    const XL = ryanX(stage, svg, 96, 222, 56, String(n), '0');
    const RH = 32, y0 = 222 - (prs.length * RH) / 2 + RH / 2;
    const colH = (x, t) => hide(lab(stage, x, y0 - 34, t, 'u4l4-snh'));
    const hP = colH(264, 'both positive'), hN = colH(M - 102, 'both negative');
    const row = (x, html, y) => hide(lab(stage, x, y, html, 'u4l4-xp'));
    const rp = prs.map(([p, q], i) => row(264, `${T(`${p}\\times${q}`)}<span class="u4l4-snsum">${T(`\\text{sum }${p + q}`)}</span>`, y0 + i * RH));
    const rn = prs.map(([p, q], i) => row(M - 102, `${T(`(-${p})(-${q})`)}<span class="u4l4-snsum">${T(`\\text{sum }-${p + q}`)}</span>`, y0 + i * RH));
    const verdict = hide(lab(stage, M / 2, 346, `Sum 0 needs opposites: ${T(`(-${r})(${r})=-${n}`)}, never ${T('+' + n)}.`, 'u4l4-snv'));
    const st = hide(stamp(stage, 'does not factor', { ok: false, x: M / 2, y: 404, rotate: -6 }));
    // right: x² − n
    const RX = M + (W - M) / 2;
    const tR = hide(lab(stage, RX, 26, T(`x^2-${n}`), 'u4l4-ph2')), nR = hide(lab(stage, RX, 64, `need: product ${T('-' + n)}, sum ${T('0')}`, 'u4l4-need'));
    const XR = ryanX(stage, svg, M + 82, 222, 50, String(-n), '0');
    const rr = prs.map(([p, q], i) => row(M + 240, `${T(`(-${p})\\times${q}`)}<span class="u4l4-snsum">${T(`\\text{sum }${q - p}`)}</span>`, y0 + i * RH));
    const win = rr[rr.length - 1];
    const res = hide(lab(stage, RX, 392, T(`x^2-${n}=(x-${r})(x+${r})`), 'u4l4-snres'));
    return [
      { cap: `Factor ${T(`x^2+${n}`)} like ${T('x^2+bx+c')}. There is no ${T('x')} term, so ${T('b=0')}. Draw the X: ${T('+' + n)} on top, ${T('0')} underneath.`, run: (c) => XL.show(c) },
      { cap: `List the pairs. Both positive: every sum is positive.`, run: async (c) => { await show(c, hP); for (const e of rp) await show(c, e); } },
      { cap: `Both negative: every sum is negative.`, run: async (c) => { await show(c, hN); for (const e of rn) await show(c, e); } },
      { cap: `A sum of 0 needs <b>opposites</b>, like ${T(`-${r}`)} and ${T(String(r))}. But opposites multiply to a <b>negative</b>. Nothing can be circled: ${T(`x^2+${n}`)} <b>does not factor</b>.`,
        run: async (c) => { [...rp, ...rn].forEach((e) => e.classList.add('u4l4-xp-no')); await show(c, verdict); st.style.opacity = 1; await stampIn(c, st); } },
      { cap: `Now ${T(`x^2-${n}`)}: ${T(`-${n}`)} on top, ${T('0')} underneath. One number is negative and one is positive.`,
        run: async (c) => { await show(c, tR); await show(c, nR); await XR.show(c); for (const e of rr) await show(c, e); } },
      { cap: `${T(`-${r}`)} and ${T(String(r))}: product ${T('-' + n)}, sum 0. Circle it. So ${T(`x^2-${n}=(x-${r})(x+${r})`)}: the <b>difference</b> of squares factors, the <b>sum</b> does not.`,
        run: async (c) => { rr.forEach((e) => e.classList.add(e === win ? 'u4l4-xp-ok' : 'u4l4-xp-no')); await pulse(c, win, 1.06);
          XR.L.innerHTML = T(`-${r}`); XR.R.innerHTML = T(String(r)); await pop(c, XR.L); await pop(c, XR.R); await show(c, res); } }
    ];
  }
};

/* =============================== explainer: is it a difference of squares? =============================== */
const DT = {
  a: { e: '25x^2-64', t1: '25x^2', t2: '64', op: '-', A: '5x', B: '8', r1: '(5x)^2', r2: '8^2' },
  b: { e: '49a^2-81b^2', t1: '49a^2', t2: '81b^2', op: '-', A: '7a', B: '9b', r1: '(7a)^2', r2: '(9b)^2' },
  c: { e: '100m^2n^2-9p^2', t1: '100m^2n^2', t2: '9p^2', op: '-', A: '10mn', B: '3p', r1: '(10mn)^2', r2: '(3p)^2' },
  d: { e: 'x^2+36', t1: 'x^2', t2: '36', op: '+', A: 'x', B: '6', r1: 'x^2', r2: '6^2' },
  e: { e: '-y^2+4x^2', re: '4x^2-y^2', t1: '4x^2', t2: 'y^2', op: '-', A: '2x', B: 'y', r1: '(2x)^2', r2: 'y^2' },
  f: { e: '1-\\sin^2x', t1: '1', t2: '\\sin^2x', op: '-', A: '1', B: '\\sin x', r1: '1^2', r2: '(\\sin x)^2' }
};
const dosTest = {
  title: 'Three checks, then square-root each term',
  height: 400, minW: 900,
  choices: [{ sep: 'Example 1' }, ...Object.keys(DT).map((k) => ({ v: k, label: `(${k}) ` + T(DT[k].e) }))],
  ask: (k) => `<b>Example 1(${k}):</b> factor ${T(DT[k].e)}, if possible.`,
  make(stage, k, ex) {
    const d = DT[k], W = ex.W, LW = W - 380, x1 = LW * 0.27, x2 = LW * 0.73, xo = LW * 0.5, Y = d.re ? 92 : 50;
    const orig = d.re ? lab(stage, LW / 2, 30, T(d.e), 'u4l4-dt-orig') : null;
    const t1 = lab(stage, x1, Y, T(d.t1), 'u4l4-dt-term u4l4-dt-a'), t2 = lab(stage, x2, Y, T(d.t2), 'u4l4-dt-term u4l4-dt-b'), op = lab(stage, xo, Y, T(d.op === '-' ? '-' : '+'), 'u4l4-dt-op');
    if (d.re) [t1, t2, op].forEach(hide);
    const ar1 = hide(lab(stage, x1, Y + 62, '↓ √', 'u4l4-dt-arr')), ar2 = hide(lab(stage, x2, Y + 62, '↓ √', 'u4l4-dt-arr'));
    const r1 = hide(lab(stage, x1, Y + 118, T(`=${d.r1}`), 'u4l4-dt-root')), r2 = hide(lab(stage, x2, Y + 118, T(`=${d.r2}`), 'u4l4-dt-root'));
    const pA = hide(lab(stage, x1, Y + 178, T(`A=${d.A}`), 'u4l4-pill u4l4-pill-a')), pB = hide(lab(stage, x2, Y + 178, T(`B=${d.B}`), 'u4l4-pill u4l4-pill-b'));
    const ans = hide(lab(stage, LW / 2, Y + 258, T(`${d.re || d.e}=(${cA(d.A)}-${cB(d.B)})(${cA(d.A)}+${cB(d.B)})`), 'u4l4-dt-ans'));
    const P = panel(stage, W - 362, 26, 346, 300, 'Difference of squares?');
    const ck = (txt) => { const r = h('div', 'u4l4-ck-row', `<span class="u4l4-ck-box"></span><span>${txt}</span>`); P.appendChild(r); return r; };
    const k1 = ck('Two terms?'), k2 = ck('Both perfect squares?'), k3 = ck('Subtracted?');
    const mark = async (c, r, ok) => { const bx = r.firstChild; bx.textContent = ok ? '✓' : '✗'; r.classList.add(ok ? 'u4l4-ck-ok' : 'u4l4-ck-no'); await pop(c, bx); };
    const st = d.op === '+' ? hide(stamp(stage, 'does not factor', { ok: false, x: LW / 2 - 110, y: Y + 238, rotate: -6 })) : null;
    const steps = [];
    if (d.re) steps.push({ cap: `The negative term comes first. <b>Reorder</b> so the positive term leads: ${T(`${d.e}=${d.re}`)}.`,
      run: async (c) => { orig.classList.add('u4l4-dt-orig-dim'); for (const e of [t1, op, t2]) await show(c, e); } });
    steps.push({ cap: `Two terms? <b>Yes</b>: ${T(d.t1)} and ${T(d.t2)}.`, run: async (c) => { await Promise.all([pulse(c, t1, 1.08), pulse(c, t2, 1.08)]); await mark(c, k1, true); } });
    steps.push({ cap: `Both perfect squares? Take the square root of each: ${T(`${d.t1}=${d.r1}`)} and ${T(`${d.t2}=${d.r2}`)}. <b>Yes</b>.`,
      run: async (c) => { await Promise.all([show(c, ar1), show(c, ar2)]); await Promise.all([show(c, r1), show(c, r2)]); await Promise.all([pop(c, pA), pop(c, pB)]); await mark(c, k2, true); } });
    if (d.op === '+') {
      steps.push({ cap: `Subtracted? <b>No</b>: there is a plus sign. ${T(d.e)} is a <b>sum</b> of squares, and it <b>does not factor</b>.`,
        run: async (c) => { op.classList.add('u4l4-dt-op-bad'); await shake(c, op); await mark(c, k3, false); st.style.opacity = 1; await stampIn(c, st); } });
    } else {
      steps.push({ cap: `Subtracted? <b>Yes</b>: a minus sign between them. It is a difference of squares.`, run: async (c) => { await pulse(c, op, 1.3); await mark(c, k3, true); } });
      steps.push({ cap: `${T(`A=${d.A}`)} and ${T(`B=${d.B}`)}, so ${T(`${d.re || d.e}=(${d.A}-${d.B})(${d.A}+${d.B})`)}.`, run: (c) => show(c, ans) });
    }
    return steps;
  }
};

/* =============================== explainer: fractions and decimals that are squares =============================== */
const FS = {
  q: { label: T('\\tfrac14x^2'), single: { t: '\\dfrac{1}{4}x^2', parts: [['1', '1'], ['4', '2'], ['x^2', 'x']], root: '\\dfrac{1}{2}x' }, chk: '\\left(\\tfrac12x\\right)^2=\\tfrac12\\cdot\\tfrac12\\cdot x\\cdot x=\\tfrac14x^2' },
  y25: { label: T('\\tfrac{y^2}{25}'), single: { t: '\\dfrac{y^2}{25}', parts: [['y^2', 'y'], ['25', '5']], root: '\\dfrac{y}{5}' }, chk: '\\left(\\dfrac{y}{5}\\right)^2=\\dfrac{y\\cdot y}{5\\cdot5}=\\dfrac{y^2}{25}' },
  dec: { label: T('0.09'), single: { t: '0.09', dec: '\\dfrac{9}{100}', parts: [['9', '3'], ['100', '10']], root: '0.3' }, chk: '0.3\\times0.3=0.09' },
  e4a: { label: '(a)', ex: 'a', terms: [{ t: '\\dfrac{1}{4}x^2', parts: [['1', '1'], ['4', '2'], ['x^2', 'x']], root: '\\dfrac{1}{2}x' }, { t: '9', parts: [['9', '3']], root: '3' }], ans: '\\left(\\tfrac{1}{2}x-3\\right)\\left(\\tfrac{1}{2}x+3\\right)' },
  e4a2: { label: '(a) way 2', ex: 'a', way2: true },
  e4b: { label: '(b)', ex: 'b', terms: [{ t: '\\dfrac{x^2}{16}', parts: [['x^2', 'x'], ['16', '4']], root: '\\dfrac{x}{4}' }, { t: '\\dfrac{y^2}{25}', parts: [['y^2', 'y'], ['25', '5']], root: '\\dfrac{y}{5}' }], ans: '\\left(\\dfrac{x}{4}-\\dfrac{y}{5}\\right)\\left(\\dfrac{x}{4}+\\dfrac{y}{5}\\right)' },
  e4c: { label: '(c)', ex: 'c', terms: [{ t: '0.09a^2', dec: '\\dfrac{9}{100}a^2', parts: [['9', '3'], ['100', '10'], ['a^2', 'a']], root: '0.3a' }, { t: '0.49', dec: '\\dfrac{49}{100}', parts: [['49', '7'], ['100', '10']], root: '0.7' }], ans: '(0.3a-0.7)(0.3a+0.7)' }
};
const FSE = { a: '\\dfrac{1}{4}x^2-9', b: '\\dfrac{x^2}{16}-\\dfrac{y^2}{25}', c: '0.09a^2-0.49' };
const fracSquares = {
  title: 'Square roots of fractions and decimals',
  height: 470, minW: 900,
  choices: [{ v: 'q', label: FS.q.label }, { v: 'y25', label: FS.y25.label }, { v: 'dec', label: FS.dec.label }, { sep: 'Example 4' }, ...['e4a', 'e4a2', 'e4b', 'e4c'].map((k) => ({ v: k, label: FS[k].label }))],
  ask: (k) => (FS[k].ex ? `<b>Example 4(${FS[k].ex}):</b> factor ${T(FSE[FS[k].ex])} fully${FS[k].way2 ? ', taking out a fraction first' : ''}.` : `Is ${T(FS[k].single.t)} a perfect square?`),
  make(stage, k, ex) {
    const d = FS[k], W = ex.W;
    const column = (tm, cx, col, name) => {
      const o = {};
      o.t = lab(stage, cx, 62, T(tm.t), 'u4l4-fs-term');
      o.dec = tm.dec ? hide(lab(stage, cx, 132, T('=' + tm.dec), 'u4l4-fs-dec')) : null;
      const row = h('div', 'u4l4-fs-parts'); tm.parts.forEach(([p, r]) => row.appendChild(h('span', 'u4l4-fs-chip', T(`\\sqrt{${p}}=${r}`)))); stage.appendChild(row); place(row, cx, 198, 'c', 0); o.parts = [...row.children].map(hide);
      o.root = hide(lab(stage, cx, 272, T(`=${tc(col, `\\left(${tm.root}\\right)`)}^2`), 'u4l4-fs-root'));
      o.name = name ? hide(lab(stage, cx, 346, T(`${name}=${tm.root}`), `u4l4-pill ${name === 'A' ? 'u4l4-pill-a' : 'u4l4-pill-b'}`)) : null;
      o.run = async (c) => { if (o.dec) await show(c, o.dec); for (const e of o.parts) await pop(c, e, 300); await show(c, o.root); if (o.name) await pop(c, o.name); };
      return o;
    };
    if (d.single) {
      const o = column(d.single, W * 0.34, CA, null);
      const P = panel(stage, W - 380, 60, 360, 250, 'Check by squaring'), L = lineH(P, T(d.chk), 'u4l4-big');
      return [
        { cap: d.single.dec ? `Write the decimal as a fraction first: ${T(`0.09=${d.single.dec}`)} (nine <b>hundredths</b>).` : `A fraction is a perfect square when its <b>top and bottom</b> are both perfect squares.`, run: async (c) => { if (o.dec) await show(c, o.dec); else await pulse(c, o.t, 1.08); } },
        { cap: `Take the square root of each piece: ${d.single.parts.map(([p, r]) => T(`\\sqrt{${p}}=${r}`)).join(', ')}.`, run: async (c) => { for (const e of o.parts) await pop(c, e, 300); } },
        { cap: `So ${T(`${d.single.t}=\\left(${d.single.root}\\right)^2`)}. It <b>is</b> a perfect square.`, run: (c) => show(c, o.root) },
        { cap: `Check by squaring: ${T(d.chk)} ✓`, run: (c) => show(c, L) }
      ];
    }
    if (d.way2) {
      const X = W / 2, ys = [36, 100, 164, 240, 316];
      const l1 = lab(stage, X, ys[0], T('\\tfrac{1}{4}x^2-9'), 'u4l4-fs-line');
      const l2 = hide(lab(stage, X, ys[1], T('=\\tfrac{1}{4}(x^2-36)'), 'u4l4-fs-line'));
      const q4 = h('span', 'u4l4-fs-q', T('\\tfrac{1}{4}'));
      const l3 = hide(lab(stage, X, ys[2], '', 'u4l4-fs-line')); l3.append(h('span', '', T('=')), q4, h('span', '', T('(x-6)(x+6)')));
      const hA = h('span', 'u4l4-fs-h', T('\\tfrac{1}{2}')), hB = h('span', 'u4l4-fs-h', T('\\tfrac{1}{2}'));
      const l4 = hide(lab(stage, X, ys[3], '', 'u4l4-fs-line')); l4.append(h('span', '', T('=\\Big[')), hA, h('span', '', T('(x-6)\\Big]\\Big[')), hB, h('span', '', T('(x+6)\\Big]')));
      [hA, hB].forEach(hide);
      const l5 = hide(lab(stage, X, ys[4], T('=\\left(\\tfrac{1}{2}x-3\\right)\\left(\\tfrac{1}{2}x+3\\right)'), 'u4l4-fs-line u4l4-fs-fin'));
      const note = hide(lab(stage, X, 382, `the same factors as way 1 ${T('\\checkmark')}`, 'u4l4-fs-note'));
      return [
        { cap: `Way 2: take out the fraction ${T('\\tfrac14')} first. Inside, ${T('9\\div\\tfrac14=36')}: ${T('\\tfrac14x^2-9=\\tfrac14(x^2-36)')}.`, run: async (c) => { await pulse(c, l1, 1.05); await show(c, l2); } },
        { cap: `Inside is a difference of squares: ${T('x^2-36=(x-6)(x+6)')}. So ${T('\\tfrac14(x-6)(x+6)')}.`, run: (c) => show(c, l3) },
        { cap: `Is it the same as way 1? Split ${T('\\tfrac14=\\tfrac12\\cdot\\tfrac12')} and give one half to each bracket.`,
          run: async (c) => { await pulse(c, q4, 1.25); l4.style.opacity = 1; await show(c, l4); await pop(c, hA); await pop(c, hB); } },
        { cap: `${T('\\tfrac12(x-6)=\\tfrac12x-3')} and ${T('\\tfrac12(x+6)=\\tfrac12x+3')}: exactly the factors from way 1.`, run: async (c) => { await show(c, l5); await show(c, note); } }
      ];
    }
    const [o1, o2] = [column(d.terms[0], W * 0.25, CA, 'A'), column(d.terms[1], W * 0.75, CB, 'B')];
    const op = lab(stage, W / 2, 62, T('-'), 'u4l4-fs-term');
    const ans = hide(lab(stage, W / 2, 418, T(`${FSE[d.ex]}=${d.ans}`), 'u4l4-fs-ans'));
    const pc = (tm) => tm.parts.map(([p, r]) => T(`\\sqrt{${p}}=${r}`)).join(', ');
    return [
      { cap: `First term: ${d.terms[0].dec ? `as hundredths, ${T(`${d.terms[0].t}=${d.terms[0].dec}`)}; then ` : ''}root each piece: ${pc(d.terms[0])}. So ${T(`${d.terms[0].t}=\\left(${d.terms[0].root}\\right)^2`)}.`, run: (c) => o1.run(c) },
      { cap: `Second term: ${d.terms[1].dec ? `${T(`${d.terms[1].t}=${d.terms[1].dec}`)}; ` : ''}${pc(d.terms[1])}. So ${T(`${d.terms[1].t}=\\left(${d.terms[1].root}\\right)^2`)}.`, run: (c) => o2.run(c) },
      { cap: `Subtracted, so it is a difference of squares with ${T(`A=${d.terms[0].root}`)}, ${T(`B=${d.terms[1].root}`)}: ${T(d.ans)}.`, run: async (c) => { await pulse(c, op, 1.4); await show(c, ans); } }
    ];
  }
};

/* =============================== explainer: keep going (a factor tree) =============================== */
const LF = (t, kind = 'leaf') => ({ t, kind });
const DN = (t, why, kids, gcf = false) => ({ t, why, kids, gcf });
const KG = {
  a: { e: 'x^4-81', tree: DN('x^4-81', '(x^2)^2-9^2', [DN('x^2-9', 'x^2-3^2', [LF('x-3'), LF('x+3')]), LF('x^2+9', 'sum')]), ans: '(x-3)(x+3)(x^2+9)' },
  b: { e: '16a^4-b^4', tree: DN('16a^4-b^4', '(4a^2)^2-(b^2)^2', [DN('4a^2-b^2', '(2a)^2-b^2', [LF('2a-b'), LF('2a+b')]), LF('4a^2+b^2', 'sum')]), ans: '(2a-b)(2a+b)(4a^2+b^2)' },
  c: { e: '3x^4-48y^4', tree: DN('3x^4-48y^4', '3(x^4-16y^4)', [LF('3', 'num'), DN('x^4-16y^4', '(x^2)^2-(4y^2)^2', [DN('x^2-4y^2', 'x^2-(2y)^2', [LF('x-2y'), LF('x+2y')]), LF('x^2+4y^2', 'sum')])], true), ans: '3(x-2y)(x+2y)(x^2+4y^2)' },
  d: { e: 'm^8-1', tree: DN('m^8-1', '(m^4)^2-1^2', [DN('m^4-1', '(m^2)^2-1^2', [DN('m^2-1', 'm^2-1^2', [LF('m-1'), LF('m+1')]), LF('m^2+1', 'sum')]), LF('m^4+1', 'sum')]), ans: '(m-1)(m+1)(m^2+1)(m^4+1)' },
  e: { e: 'x^6-49', tree: DN('x^6-49', '(x^3)^2-7^2', [LF('x^3-7', 'stop'), LF('x^3+7', 'sum')]), ans: '(x^3-7)(x^3+7)' }
};
const keepGoing = {
  title: 'Keep opening the differences; the sums stay shut',
  height: 456, minW: 900,
  choices: [{ sep: 'Example 5' }, ...Object.keys(KG).map((k) => ({ v: k, label: `(${k}) ` + T(KG[k].e) }))],
  ask: (k) => `<b>Example 5(${k}):</b> factor ${T(KG[k].e)} fully.`,
  make(stage, k, ex) {
    const d = KG[k], W = ex.W, svg = mkSvg(stage, W, ex.def.height), leaves = [], inner = [];
    const walk = (n, depth) => { n.depth = depth; if (n.kids) { inner.push(n); n.kids.forEach((q) => walk(q, depth + 1)); n.x = n.kids.reduce((s, q) => s + q.x, 0) / n.kids.length; } else { n.x = leaves.length; leaves.push(n); } };
    walk(d.tree, 0);
    const sp = Math.min(230, (W - 60) / leaves.length), X0 = (W - sp * leaves.length) / 2 + sp / 2, rowH = 98, Y0 = 14;
    const px = (n) => X0 + n.x * sp, py = (n) => Y0 + n.depth * rowH;
    const all = []; const reg = (n) => { all.push(n); (n.kids || []).forEach(reg); }; reg(d.tree);
    all.forEach((n) => {
      const el = h('div', 'u4l4-tn' + (n.kids ? ' u4l4-tn-in' : ' u4l4-tn-' + n.kind), `<div class="u4l4-tn-t">${T(n.t)}</div>` + (n.kids ? `<div class="u4l4-tn-why">${T('=' + n.why)}</div>` : ''));
      stage.appendChild(el); place(el, px(n), py(n), 's', 0); n.el = el;
      if (n.kids) n.whyEl = hide(el.querySelector('.u4l4-tn-why'));
      if (n !== d.tree) hide(el);
      if (!n.kids && n.kind !== 'leaf' && n.kind !== 'num') { n.tag = h('div', 'u4l4-tn-tag', n.kind === 'sum' ? 'sum: stays' : 'not squares: stop'); el.appendChild(n.tag); hide(n.tag); }
    });
    inner.forEach((n) => { n.edges = n.kids.map((q) => hide(svgEl('path', { d: `M${px(n)} ${py(n) + 70} L${px(q)} ${py(q) - 2}`, stroke: '#9aa0aa', 'stroke-width': 2.4, fill: 'none', class: 'bk-stroke' }, svg))); });
    const ans = hide(lab(stage, W / 2, ex.def.height - 30, T(`${d.e}=${d.ans}`), 'u4l4-tree-ans'));
    const kidsT = (n) => n.kids.map((q) => (q.kind === 'num' ? q.t : `(${q.t})`)).join('');
    const steps = inner.map((n) => {
      const sums = n.kids.filter((q) => q.kind === 'sum'), stops = n.kids.filter((q) => q.kind === 'stop');
      let cap = n.gcf ? `GCF first: ${T(`${n.t}=${n.why}`)}.` : `${T(`${n.t}=${n.why}`)}: a difference of squares. Open it into ${T(kidsT(n))}.`;
      if (sums.length) cap += ` The sum ${T(sums[0].t)} <b>stays</b>.`;
      if (stops.length) cap += ` ${T(stops[0].t)} is not a difference of squares (${T('x^3')} and 7 are not perfect squares): stop.`;
      return { cap, run: async (c) => {
        await show(c, n.whyEl);
        await Promise.all(n.edges.map((e) => { e.style.opacity = 1; return drawIn(e, 450, c); }));
        await Promise.all(n.kids.map((q) => pop(c, q.el)));
        await Promise.all(n.kids.filter((q) => q.tag).map((q) => { q.el.classList.add('u4l4-tn-shut'); return pop(c, q.tag); }));
      } };
    });
    steps.push({ cap: `Nothing else opens. The factors are the ends of the branches: ${T(`${d.e}=${d.ans}`)}.`,
      run: async (c) => { leaves.forEach((q) => q.el.classList.add('u4l4-tn-done')); await Promise.all(leaves.map((q) => pulse(c, q.el, 1.06))); await show(c, ans); } });
    return steps;
  }
};

/* =============================== explainer: binomials in the boxes =============================== */
const BS = {
  a: { e: '(x+3)^2-25', A: '(x+3)', B: '5', sq: `${bxA('(x+3)')}^2-${bxB('5')}^2`, sub: `\\big[${bxA('(x+3)')}-${bxB('5')}\\big]\\big[${bxA('(x+3)')}+${bxB('5')}\\big]`,
    dist: '(x+3-5)(x+3+5)', dcap: `Here the brackets can simply go: ${T('(x+3-5)(x+3+5)')}.`, simp: '(x-2)(x+8)' },
  b: { e: '16-(y-1)^2', A: '4', B: '(y-1)', sq: `${bxA('4')}^2-${bxB('(y-1)')}^2`, sub: `\\big[${bxA('4')}-${bxB('(y-1)')}\\big]\\big[${bxA('4')}+${bxB('(y-1)')}\\big]`,
    dist: `(4${cR('-y+1')})(4+y-1)`, dcap: `The minus reaches <b>both</b> terms of ${T('B')}: ${T('-(y-1)=-y+1')}.`, simp: '(5-y)(y+3)' },
  c: { e: '4(2x-1)^2-9(y+2)^2', A: '2(2x-1)', B: '3(y+2)', sq: `\\big[${bxA('2(2x-1)')}\\big]^2-\\big[${bxB('3(y+2)')}\\big]^2`, sub: `\\big[${bxA('2(2x-1)')}-${bxB('3(y+2)')}\\big]\\big[${bxA('2(2x-1)')}+${bxB('3(y+2)')}\\big]`,
    dist: `(4x-2${cR('-3y-6')})(4x-2+3y+6)`, dcap: `Expand: ${T('2(2x-1)=4x-2')}, and ${T('-3(y+2)=-3y-6')}: the minus reaches both terms.`, simp: '(4x-3y-8)(4x+3y+4)' },
  d: { e: '(3x+1)^2-(x-5)^2', A: '(3x+1)', B: '(x-5)', sq: `${bxA('(3x+1)')}^2-${bxB('(x-5)')}^2`, sub: `\\big[${bxA('(3x+1)')}-${bxB('(x-5)')}\\big]\\big[${bxA('(3x+1)')}+${bxB('(x-5)')}\\big]`,
    dist: `(3x+1${cR('-x+5')})(3x+1+x-5)`, dcap: `${T('-(x-5)=-x+5')}: <b>both</b> signs flip.`, simp: '(2x+6)(4x-4)', gcf: '2(x+3)\\cdot4(x-1)', fin: '8(x+3)(x-1)' }
};
const boxSub = {
  title: 'Put A and B in boxes, keep the brackets',
  height: 440, minW: 920, capH: 92,
  choices: [{ sep: 'Example 6' }, ...Object.keys(BS).map((k) => ({ v: k, label: `(${k}) ` + T(BS[k].e) }))],
  ask: (k) => `<b>Example 6(${k}):</b> factor ${T(BS[k].e)} fully.`,
  make(stage, k, ex) {
    const d = BS[k], X = 40, Y0 = 72, dy = 60;
    const pA = hide(lab(stage, X, 22, T(`A=${d.A}`), 'u4l4-pill u4l4-pill-a', 'e', 0)), pB = hide(lab(stage, X + 250, 22, T(`B=${d.B}`), 'u4l4-pill u4l4-pill-b', 'e', 0));
    const rows = [`${d.e}=${d.sq}`, `=(${bxA('A')}-${bxB('B')})(${bxA('A')}+${bxB('B')})`, `=${d.sub}`, `=${d.dist}`, `=${cG(d.simp)}`];
    if (d.gcf) { rows[4] = `=${d.simp}=${d.gcf}`; rows.push(`=${cG(d.fin)}`); }
    const L = rows.map((r, i) => { const e = lab(stage, X, Y0 + i * dy, T(r), 'u4l4-bs-line', 'e', 0); if (i) hide(e); return e; });
    const fin = d.gcf ? d.fin : d.simp;
    const steps = [
      { cap: `Spot the two squares: ${T(`A=${d.A}`)} and ${T(`B=${d.B}`)}. Put each in a box.`, run: async (c) => { await pop(c, pA); await pop(c, pB); } },
      { cap: `It is ${T('A^2-B^2')}, so use the pattern on the boxes: ${T('(A-B)(A+B)')}.`, run: (c) => show(c, L[1]) },
      { cap: `Unpack the boxes and <b>keep the brackets</b>. The minus in front of ${T('B')} must reach every term inside it.`, run: (c) => show(c, L[2]) },
      { cap: d.dcap, run: (c) => show(c, L[3]) },
      { cap: d.gcf ? `Collect like terms: ${T(d.simp)}. Each factor still has a common factor: ${T('2x+6=2(x+3)')} and ${T('4x-4=4(x-1)')}.` : `Collect like terms in each factor: ${T(fin)}.`, run: (c) => show(c, L[4]) }
    ];
    if (d.gcf) steps.push({ cap: `Multiply the common factors: ${T('2\\cdot4=8')}. Fully factored: ${T(fin)}.`, run: (c) => show(c, L[5]) });
    return steps;
  }
};

/* =============================== explainer: the factoring checklist =============================== */
const CKN = {
  gcf: { x: 300, y: 40, w: 360, h: 66, html: '<b>1. GCF?</b>take it out (negative if the first term is)' },
  count: { x: 300, y: 138, w: 260, h: 50, html: '<b>2. Count the terms</b>' },
  two: { x: 98, y: 262, w: 188, h: 108, html: '<b>Two</b>difference of squares? (a sum: stop)' },
  three: { x: 300, y: 262, w: 188, h: 108, html: '<b>Three</b>trinomial: decomposition, perfect square, substitution' },
  four: { x: 502, y: 262, w: 188, h: 108, html: '<b>Four</b>grouping: two and two, or three and one' },
  again: { x: 300, y: 398, w: 360, h: 56, html: '<b>3. Factor again? 4. Check</b>' }
};
const CKE = [
  { from: 'gcf', to: 'count' },
  { from: 'count', to: 'two', label: '2', route: 'vhv' }, { from: 'count', to: 'three', label: '3' }, { from: 'count', to: 'four', label: '4', route: 'vhv' },
  { from: 'two', to: 'again', pts: [[98, 319], [98, 398], [116, 398]] }, { from: 'three', to: 'again' }, { from: 'four', to: 'again', pts: [[502, 319], [502, 398], [484, 398]] }
];
const S = (n, cap, ln) => ({ n, cap, ln });
const CK = {
  a: { e: '2x^3-18x', s: [S('gcf', `GCF ${T('2x')}: ${T('2x^3-18x=2x(x^2-9)')}.`, ['=2x(x^2-9)']), S('count', 'The bracket has <b>two</b> terms.'),
    S('two', `${T('x^2-9')} is a difference of squares: ${T('(x-3)(x+3)')}.`, ['=2x(x-3)(x+3)']), S('again', `No factor opens again. Fully factored: ${T('2x(x-3)(x+3)')}.`)] },
  b: { e: 'x^3+2x^2-9x-18', s: [S('gcf', 'No common factor for all four terms.'), S('count', '<b>Four</b> terms.'),
    S('four', `Group two and two: ${T('x^2(x+2)-9(x+2)=(x+2)(x^2-9)')}.`, ['=x^2(x+2)-9(x+2)', '=(x+2)(x^2-9)']),
    S('again', `${T('x^2-9')} opens again: ${T('(x+2)(x-3)(x+3)')}.`, ['=(x+2)(x-3)(x+3)'])] },
  c: { e: '4x^4-37x^2+9', s: [S('gcf', 'No common factor.'), S('count', `<b>Three</b> terms, in ${T('x^4')} and ${T('x^2')}: a quadratic form.`),
    S('three', `Product ${T('4\\times9=36')}, sum ${T('-37')}: ${T('-36')} and ${T('-1')}. Decompose and group: ${T('(4x^2-1)(x^2-9)')}.`, ['=4x^4-36x^2-x^2+9', '=4x^2(x^2-9)-1(x^2-9)', '=(4x^2-1)(x^2-9)']),
    S('again', `<b>Both</b> brackets are differences of squares: ${T('(2x-1)(2x+1)(x-3)(x+3)')}.`, ['=(2x-1)(2x+1)(x-3)(x+3)'])] },
  d: { e: '6x^2-7x-20', s: [S('gcf', 'No common factor.'), S('count', '<b>Three</b> terms.'),
    S('three', `Decomposition: product ${T('-120')}, sum ${T('-7')}: ${T('-15')} and 8. ${T('3x(2x-5)+4(2x-5)')}.`, ['=6x^2-15x+8x-20', '=3x(2x-5)+4(2x-5)', '=(3x+4)(2x-5)']),
    S('again', `Neither bracket opens again: ${T('(3x+4)(2x-5)')}.`)] },
  e: { e: 'x^2-6x+9-y^2', s: [S('gcf', 'No common factor.'), S('count', '<b>Four</b> terms.'),
    S('four', `Group <b>three and one</b>: ${T('x^2-6x+9=(x-3)^2')}, a perfect square. Now ${T('(x-3)^2-y^2')} is a difference of squares!`, ['=(x^2-6x+9)-y^2', '=(x-3)^2-y^2']),
    S('again', `${T('A=x-3')}, ${T('B=y')}: ${T('(x-3-y)(x-3+y)')}.`, ['=(x-3-y)(x-3+y)'])] },
  f: { e: '3a^2+12', s: [S('gcf', `GCF 3: ${T('3(a^2+4)')}.`, ['=3(a^2+4)']), S('count', 'The bracket has <b>two</b> terms.'),
    S('two', `${T('a^2+4')} is a <b>sum</b> of squares: it does not factor.`), S('again', `Fully factored: ${T('3(a^2+4)')}.`)] }
};
const checklist = {
  title: 'The factoring checklist',
  height: 440, minW: 960, capH: 92,
  choices: [{ sep: 'Example 8' }, ...Object.keys(CK).map((k) => ({ v: k, label: `(${k}) ` + T(CK[k].e) }))],
  ask: (k) => `<b>Example 8(${k}):</b> factor ${T(CK[k].e)} fully.`,
  make(stage, k, ex) {
    const d = CK[k], W = ex.W, F = new Flowchart(stage, { x: 6, y: 0, width: 610, height: 440, nodes: CKN, edges: CKE, cls: 'u4l4-flow' });
    const P = panel(stage, 632, 14, W - 646, 412, 'Working', 'u4l4-ckp');
    line(P, T(d.e), 'u4l4-big');
    let prev = null;
    return d.s.map((st) => {
      const ls = (st.ln || []).map((s) => lineH(P, T(s), /\(.*\)\(.*\)/.test(s) && st.n === 'again' ? 'u4l4-key-line' : ''));
      const from = prev; prev = st.n;
      return { cap: st.cap, run: async (c) => { if (from) await F.go(c, from, st.n); await F.visit(c, st.n); for (const e of ls) await show(c, e); } };
    });
  }
};

/* =============================== explainer: is it a factor? =============================== */
const FO = {
  e9: { label: 'Example 9 check', tests: [
    { t: 'x-2', hit: [1], cap: `(a) Is ${T('x-2')} a factor? It is one of the pieces: <b>yes</b>.` },
    { t: 'x-4', hit: null, cap: `(b) ${T('x-4')}? It is not one of the pieces, and no product of pieces makes it: <b>no</b>. (The 4 in ${T('x^4-16')} belongs with ${T('x^2')}.)` },
    { t: 'x^2+4', hit: [3], cap: `(c) ${T('x^2+4')}? It is the last piece: <b>yes</b>.` }] },
  prod: { label: 'Products of pieces', tests: [
    { t: 'x^2-4', hit: [1, 2], cap: `${T('x^2-4')}? It is not a piece, but it is ${T('(x-2)(x+2)')}, a product of two pieces: <b>yes</b>.` },
    { t: '3x+6', hit: [0, 2], cap: `${T('3x+6')}? It is ${T('3(x+2)')}: two pieces multiplied, so <b>yes</b>.` },
    { t: 'x+4', hit: null, cap: `${T('x+4')}? No piece, and no product of pieces: <b>no</b>.` }] }
};
const factorOf = {
  title: 'Factor fully, then look for the binomial',
  height: 420, minW: 900,
  choices: [{ v: 'e9', label: FO.e9.label }, { v: 'prod', label: FO.prod.label }],
  ask: (k) => (k === 'e9' ? `<b>Example 9:</b> are ${T('x-2')}, ${T('x-4')} and ${T('x^2+4')} factors of ${T('3x^4-48')}?` : `Which of ${T('x^2-4')}, ${T('3x+6')}, ${T('x+4')} are factors of ${T('3x^4-48')}?`),
  make(stage, k, ex) {
    const d = FO[k], W = ex.W, svg = mkSvg(stage, W, ex.def.height);
    const l1 = hide(lab(stage, W / 2, 30, T('3x^4-48=3(x^4-16)=3(x^2-4)(x^2+4)'), 'u4l4-fo-line'));
    const l2 = hide(lab(stage, W / 2, 80, T('=3(x-2)(x+2)(x^2+4)'), 'u4l4-fo-line'));
    const pcs = ['3', 'x-2', 'x+2', 'x^2+4'], ws = [86, 150, 150, 170], gap = 28, tot = ws.reduce((s, w) => s + w, 0) + gap * 3;
    let xx = (W - tot) / 2;
    const cards = pcs.map((p, i) => { const e = hide(add(stage, box(h('div', 'u4l4-fo-card', T(p)), ws[i], 64), xx, 128)); e.cx = xx + ws[i] / 2; xx += ws[i] + gap; return e; });
    const tests = d.tests.map((t, i) => {
      const cx = W * (0.2 + 0.3 * i), e = hide(add(stage, box(h('div', 'u4l4-fo-cand', T(t.t)), 150, 58), cx - 75, 300));
      const links = (t.hit || []).map((j) => hide(svgEl('path', { d: `M${cx} 298 C${cx} 250 ${cards[j].cx} 250 ${cards[j].cx} 196`, fill: 'none', stroke: OK, 'stroke-width': 3, class: 'bk-stroke' }, svg)));
      const st = hide(stamp(stage, t.hit ? 'factor' : 'not a factor', { ok: !!t.hit, x: cx - 70, y: 366, rotate: -6, size: 'sm' }));
      return { t, e, links, st };
    });
    const steps = [];
    if (k === 'e9') {
      steps.push({ cap: `Factor fully first: ${T('3x^4-48=3(x^4-16)=3(x^2-4)(x^2+4)')}.`, run: (c) => show(c, l1) });
      steps.push({ cap: `${T('x^2-4')} opens again: ${T('3(x-2)(x+2)(x^2+4)')}. These four <b>pieces</b> are the factors.`, run: async (c) => { await show(c, l2); for (const e of cards) await pop(c, e, 260); } });
    } else {
      steps.push({ cap: `The fully factored form from Example 9: ${T('3x^4-48=3(x-2)(x+2)(x^2+4)')}. A product of pieces is a factor too.`, run: async (c) => { await show(c, l2); for (const e of cards) await pop(c, e, 260); } });
    }
    tests.forEach((o) => steps.push({ cap: o.t.cap, run: async (c) => {
      await pop(c, o.e);
      if (o.t.hit) { await Promise.all(o.links.map((p) => { p.style.opacity = 1; return drawIn(p, 500, c); })); o.t.hit.forEach((j) => cards[j].classList.add('u4l4-fo-hit')); await Promise.all(o.t.hit.map((j) => pulse(c, cards[j], 1.06))); }
      else await shake(c, o.e);
      o.st.style.opacity = 1; await stampIn(c, o.st);
    } }));
    return steps;
  }
};

/* =============================== Example 7: the patio figure =============================== */
function mountPatio() {
  const host = byId('u4l4-patio'); if (!host) return;
  const S0 = 220, s = S0 * 4 / 11, X = 62, Y = 10;
  const svg = svgEl('svg', { width: 290, height: 290, viewBox: '0 0 290 290', class: 'u4l4-patiosvg' }, host);
  svgEl('rect', { x: X, y: Y, width: S0, height: S0, fill: '#e5e1d8', stroke: INK, 'stroke-width': 2 }, svg);
  svgEl('rect', { x: X + S0 - s, y: Y, width: s, height: s, fill: '#fff', stroke: INK, 'stroke-width': 2 }, svg);
  const L = (x, y, t, pos) => { const d = h('div', 'u4l4-lab u4l4-plab', T(t)); host.appendChild(d); place(d, x, y, pos, 0); };
  L(X + S0 / 2, Y + S0 + 6, '2x+5', 's'); L(X - 6, Y + S0 / 2, '2x+5', 'w'); L(X + S0 - s / 2, Y + s / 2, 'x+1', 'c');
}

/* =============================== Stand Up Break =============================== */
const lin = (terms) => { let s = ''; for (const [c, v] of terms) { if (!c) continue; const a = Math.abs(c), body = v ? (a === 1 ? v : a + v) : String(a); s += (c < 0 ? '-' : s ? '+' : '') + body; } return s || '0'; };
const mono = (p, v) => (p === 1 ? v : p + v);
const sqT = (t) => (/^([a-z]|\d+)$/.test(t) ? t + '^2' : `(${t})^2`);
standup('u4l4', {
  intro: 'At your whiteboard: GCF first, then look for A² − B². Keep factoring until nothing opens, and check by expanding.',
  levels: {
    BEG: (r) => {
      let p, q; do { p = r.int(1, 9); q = r.int(1, 12); } while (gcd(p, q) !== 1 || (p === 1 && q === 1));
      const v = r.chance(0.4) ? 'y' : '', A = mono(p, 'x'), B = v ? mono(q, v) : String(q), A2 = `${p * p === 1 ? '' : p * p}x^2`, B2 = v ? `${q * q === 1 ? '' : q * q}y^2` : String(q * q);
      if (r.chance(0.2)) return { text: 'Factor, if possible.', q: `${A2}+${B2}`, a: [`\\text{a sum of squares: it does not factor}`] };
      return { text: 'Factor.', q: `${A2}-${B2}`, a: [`${sqT(A)}-${sqT(B)}`, `=(${A}-${B})(${A}+${B})`] };
    },
    PRG: (r) => {
      if (r.chance(0.5)) {
        let p, q; do { p = r.int(1, 5); q = r.int(1, 7); } while (gcd(p, q) !== 1);
        const g = r.pick([2, 3, 5, 6, 7]), neg = r.chance(0.3), A = mono(p, 'x');
        if (neg) return { text: 'Factor fully.', q: `-${g * p * p}x^2+${g * q * q}`, a: [`-${g}(${p * p === 1 ? '' : p * p}x^2-${q * q})`, `=-${g}(${A}-${q})(${A}+${q})`] };
        return { text: 'Factor fully.', q: `${g * p * p}x^2-${g * q * q}`, a: [`${g}(${p * p === 1 ? '' : p * p}x^2-${q * q})`, `=${g}(${A}-${q})(${A}+${q})`] };
      }
      const c = r.pick([1, 1, 16]), kk = c === 16 ? r.pick([1, 3, 5]) : r.int(1, 5), A = c === 16 ? '4x^2' : 'x^2', a1 = c === 16 ? '2x' : 'x';
      return { text: 'Factor fully.', q: `${c === 16 ? 16 : ''}x^4-${kk ** 4}`, a: [`(${A}-${kk * kk})(${A}+${kk * kk})`, `=(${a1}-${kk})(${a1}+${kk})(${A}+${kk * kk})`] };
    },
    MAS: (r) => {
      if (r.chance(0.5)) {
        let p, q, rr, s; do { p = r.int(2, 4); rr = r.int(1, p - 1); q = r.int(-6, 6); s = r.int(-6, 6); } while (!q || !s || q === s || gcd(p, q) !== 1 || gcd(rr, s) !== 1 || q * rr === p * s);
        const f1 = [p - rr, q - s], f2 = [p + rr, q + s], g1 = gcd(f1[0], f1[1]), g2 = gcd(f2[0], f2[1]), G = g1 * g2;
        const P1 = lin([[p, 'x'], [q, '']]), P2 = lin([[rr, 'x'], [s, '']]), F1 = lin([[f1[0], 'x'], [f1[1], '']]), F2 = lin([[f2[0], 'x'], [f2[1], '']]);
        const a = [`\\big[(${P1})-(${P2})\\big]\\big[(${P1})+(${P2})\\big]`, `=(${F1})(${F2})`];
        if (G > 1) {
          const h1 = lin([[f1[0] / g1, 'x'], [f1[1] / g1, '']]), h2 = f2[1] === 0 ? null : lin([[f2[0] / g2, 'x'], [f2[1] / g2, '']]);
          a.push(h2 ? `=${G}(${h1})(${h2})` : `=${G}x(${h1})`);
        }
        return { text: 'Factor fully. Simplify each factor.', q: `(${P1})^2-(${P2})^2`, a };
      }
      let a, b; do { a = r.int(2, 4); b = r.int(2, 5); } while (gcd(a, b) !== 1);
      let p, q; do { p = r.int(-5, 5); q = r.int(-5, 5); } while (!p || !q);
      const X = lin([[1, 'x'], [p, '']]), Y = lin([[1, 'y'], [q, '']]);
      return { text: 'Factor fully. Simplify each factor.', q: `${a * a}(${X})^2-${b * b}(${Y})^2`,
        a: [`\\big[${a}(${X})-${b}(${Y})\\big]\\big[${a}(${X})+${b}(${Y})\\big]`, `=(${lin([[a, 'x'], [a * p, ''], [-b, 'y'], [-b * q, '']])})(${lin([[a, 'x'], [a * p, ''], [b, 'y'], [b * q, '']])})`,
          `=(${lin([[a, 'x'], [-b, 'y'], [a * p - b * q, '']])})(${lin([[a, 'x'], [b, 'y'], [a * p + b * q, '']])})`] };
    }
  }
});

/* =============================== mount =============================== */
mountPatio();
export const explainers = mountExplainers({ sumNo, dosTest, fracSquares, keepGoing, boxSub, checklist, factorOf });
export const _test = { lin, gcd, KG, BS, CK };
