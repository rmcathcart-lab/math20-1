/* Math 20-1 · Unit 2 · Lesson 5 — Dividing Radicals and Rationalizing Monomial Denominators.
 * Warm-up (Same Pizza, More Slices: cutting every slice keeps 3/4 the same amount → multiplying by a form of 1;
 * the big one: 1/√2 = √2/2), and the explainers:
 *   divideRule (coefficients ÷ coefficients, radicands ÷ radicands; "why": a rectangle of area √48 and width √3;
 *     Example 1 checks),
 *   twoRoutes (reduce under the radical vs simplest form first and divide out the like radicals; Example 2 checks),
 *   splitBar (the fraction bar groups the numerator; the denominator copies under every term; the 6 + 4 trap; Ex 3),
 *   simplestStamp (the five simplest-form checks stamped on six expressions),
 *   formOfOne (the star: × √b/√b = 1; b unit squares rearranged into a square of side √b show √b·√b = b; Ex 4),
 *   twoTermNum (divide each term vs rationalize first; reduce only by a factor of every term; Example 5 checks),
 *   cubeFill (the star, 3-D: factor slots fill to three of each and a box of unit cubes grows into a perfect cube;
 *     ∛2·∛2 = ∛4 is only a flat slab; a fourth root needs four of each; Example 6 checks),
 *   restrictions (even index: radicand ≥ 0; in a denominator: ≠ 0; shaded on a number line; Example 7 checks),
 *   problems (square diagonal, banner, an equation with a balance; Example 8 checks).
 * Colours: the form of 1 / multiplier amber; coefficients burgundy (the site's teal token); radicands blue;
 * finished answers green; mistakes red. No calculator in Unit 2. */
import {
  h, tex, add, box, NumberLine, mountExplainers, pop, fadeIn, appear, sleep, tween, anim,
  svgEl, pulse, place, drawIn, arrowHead, stamp, stampIn, shake, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const AM = COLORS.amber, TL = COLORS.teal, BL = COLORS.blue, GR = COLORS.green, RD = COLORS.red, INK = COLORS.ink, GY = COLORS.gray;
const ca = (s) => `\\textcolor{${AM}}{${s}}`, cb = (s) => `\\textcolor{${BL}}{${s}}`, ct = (s) => `\\textcolor{${TL}}{${s}}`;
const cg = (s) => `\\textcolor{${GR}}{${s}}`, cx = (s) => `\\textcolor{${RD}}{${s}}`;
/** the form of 1, in amber: \dfrac{√b}{√b} */
const ONE = (r) => ca(`\\dfrac{${r}}{${r}}`);
const rt = (x, n = 2) => (n === 2 ? `\\sqrt{${x}}` : `\\sqrt[${n}]{${x}}`);

/* ---------- small drawing helpers ---------- */
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const show = (c, el) => fadeIn(c, el, 320);
/** an absolutely placed label (place(): pos 'c' centred, or the side of (x, y) it sits on) */
const lab = (stage, x, y, html, cls = '', pos = 'c', gap = 6) => { const d = add(stage, h('div', 'u2l5-lab ' + cls, html)); place(d, x, y, pos, gap); return d; };
/** a stack of lines (each hidden until shown) */
function lines(stage, x, y, w, cls = '') {
  const el = add(stage, box(h('div', 'u2l5-lines ' + cls), w), x, y);
  return { el, add(html, c2 = '') { const d = h('div', 'u2l5-ln ' + c2, html); el.appendChild(d); hide(d); return d; } };
}
const overlay = (stage, W, H) => svgEl('svg', { class: 'u2l5-ov', width: W, height: H, viewBox: `0 0 ${W} ${H}` }, stage);
/** a straight arrow (drawn in by drawIn) */
function arrow(ov, x1, y1, x2, y2, color = GY, w = 3) {
  const g = svgEl('g', {}, ov);
  svgEl('path', { class: 'bk-stroke', d: `M${x1} ${y1} L${x2} ${y2}`, stroke: color, 'stroke-width': w, fill: 'none', 'stroke-linecap': 'round' }, g);
  arrowHead(g, x2, y2, x2 - x1, y2 - y1, { color, cls: 'bk-end', width: w });
  hide(g);
  return { g, async draw(c) { g.style.opacity = 1; await drawIn(g, 360, c); } };
}
const stampAt = (stage, x, y, text, ok = true, size) => hide(stamp(stage, text, { ok, x, y, size }));
const sIn = async (c, el) => { el.style.opacity = 1; await stampIn(c, el); };
/** mark the last line as the finished answer */
const done = (el) => el && el.classList.add('u2l5-done');

/* ---------- integer helpers (stand-up questions) ---------- */
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
/** n = out^k · in with the largest possible out */
function sqf(n, k = 2) { let out = 1, inn = n; for (let p = 2; p ** k <= inn; p++) while (inn % p ** k === 0) { inn /= p ** k; out *= p; } return [out, inn]; }
/** TeX for (n/d)·ᵏ√r with the sign in front: 3√7, \dfrac{2\sqrt7}{3}, -\dfrac{3\sqrt6}{4}, 5 */
function radQ(n, d, r, k = 2) {
  const g = gcd(n, d); n /= g; d /= g; if (d < 0) { n = -n; d = -d; }
  const s = n < 0 ? '-' : '', a = Math.abs(n), R = r === 1 ? '' : rt(r, k);
  const top = R ? (a === 1 ? R : a + R) : String(a);
  return d === 1 ? s + top : `${s}\\dfrac{${top}}{${d}}`;
}

/* ====================================================================================================
 * Warm-up: Same Pizza, More Slices. 3/4 of the pizza has pepperoni; cutting every slice keeps the amount.
 * ==================================================================================================== */
function mountPizza() {
  const host = document.getElementById('u2l5-pizza'); if (!host) return;
  const S = 400, C = S / 2, R = 182;
  const svg = svgEl('svg', { viewBox: `0 0 ${S} ${S}`, class: 'u2l5-pzsvg', role: 'img', 'aria-label': 'A pizza cut into equal slices; three quarters has pepperoni' }, host);
  svgEl('circle', { cx: C, cy: C, r: R + 8, class: 'u2l5-crust' }, svg);
  svgEl('circle', { cx: C, cy: C, r: R, class: 'u2l5-cheese' }, svg);
  const P = (deg, r = R) => { const a = (deg - 90) * Math.PI / 180; return [C + r * Math.cos(a), C + r * Math.sin(a)]; };
  // the pepperoni quarter-circle region: from 12 o'clock clockwise to 9 o'clock (3/4 of the turn)
  const [sx, sy] = P(0), [ex, ey] = P(270);
  svgEl('path', { d: `M${C} ${C} L${sx} ${sy} A${R} ${R} 0 1 1 ${ex} ${ey} Z`, class: 'u2l5-sauce' }, svg);
  const pep = [[30, 120], [62, 70], [95, 140], [130, 95], [160, 150], [195, 60], [215, 125], [250, 80], [20, 50], [110, 40], [175, 105], [240, 150], [140, 165], [75, 160], [205, 165], [265, 130]];
  pep.forEach(([deg, r]) => { const [x, y] = P(deg, r); svgEl('circle', { cx: x, cy: y, r: 15, class: 'u2l5-pep' }, svg); });
  const gCuts = svgEl('g', {}, svg);
  const labEl = document.getElementById('u2l5-wlab');
  let n = 4, hist = [];
  const render = (fresh = []) => {
    gCuts.innerHTML = '';
    for (let i = 0; i < n; i++) {
      const [x, y] = P(360 * i / n, R + 4);
      svgEl('line', { x1: C, y1: C, x2: x, y2: y, class: 'u2l5-cut' + (fresh.includes(i) ? ' u2l5-cutnew' : '') }, gCuts);
    }
    const k = 3 * n / 4, f = n / 4;
    const chain = ['\\dfrac34'].concat(hist.map((_, j) => { const nn = 4 * hist.slice(0, j + 1).reduce((a, b) => a * b, 1); return `\\dfrac{${3 * nn / 4}}{${nn}}`; })).join('=');
    labEl.innerHTML = `<b>${n} slices</b>, ${k} with pepperoni: ${T(chain)}` + (f > 1 ? ` <span class="u2l5-wnote">${T(`\\dfrac34\\cdot${ca(`\\dfrac{${f}}{${f}}`)}`)}, and ${T(`\\dfrac{${f}}{${f}}=1`)}</span>` : '');
    document.getElementById('u2l5-cut2').disabled = n * 2 > 48;
    document.getElementById('u2l5-cut3').disabled = n * 3 > 48;
  };
  const cut = (m) => {
    if (n * m > 48) return;
    const old = new Set(Array.from({ length: n }, (_, i) => i * m));
    hist.push(m); n *= m;
    render(Array.from({ length: n }, (_, i) => i).filter((i) => !old.has(i)));
  };
  document.getElementById('u2l5-cut2').addEventListener('click', () => cut(2));
  document.getElementById('u2l5-cut3').addEventListener('click', () => cut(3));
  document.getElementById('u2l5-wreset').addEventListener('click', () => { n = 4; hist = []; render(); });
  render();
}

/* ====================================================================================================
 * Explainer: divideRule — coefficients by coefficients, radicands by radicands.
 * ==================================================================================================== */
const DR = {
  e1a: { m: '', k: '', a: 48, b: 3, n: 2, coef: null, q: 16, tog: '\\sqrt{16}', simp: { cap: `${T('16=4^2')} is a perfect square: ${T('\\sqrt{16}=4')}.`, tex: '=4' }, ans: '4' },
  e1b: { m: '12', k: '4', a: 42, b: 6, n: 2, coef: '12\\div4=3', q: 7, tog: '3\\sqrt{7}', simp: { cap: `7 has no perfect-square factor, so ${T('3\\sqrt7')} is in simplest form.`, tex: null }, ans: '3\\sqrt7' },
  e1c: { m: '10', k: '5', a: 54, b: 3, n: 2, coef: '10\\div5=2', q: 18, tog: '2\\sqrt{18}', simp: { cap: `${T('18=9\\cdot2')} holds the perfect square 9: ${T('\\sqrt{18}=3\\sqrt2')}, so ${T('2(3\\sqrt2)=6\\sqrt2')}.`, tex: '=2(3\\sqrt2)=6\\sqrt2' }, ans: '6\\sqrt2' },
  e1d: { m: '', k: '', a: 250, b: 2, n: 3, coef: null, q: 125, tog: '\\sqrt[3]{125}', simp: { cap: `${T('125=5^3')} is a perfect cube: ${T('\\sqrt[3]{125}=5')}.`, tex: '=5' }, ans: '5' },
  e1e: { m: '-18', k: '6', a: 80, b: 5, n: 3, coef: '-18\\div6=-3', q: 16, tog: '-3\\sqrt[3]{16}', simp: { cap: `${T('16=8\\cdot2')} holds the perfect cube 8: ${T('\\sqrt[3]{16}=2\\sqrt[3]2')}, so ${T('-3(2\\sqrt[3]2)=-6\\sqrt[3]2')}.`, tex: '=-3(2\\sqrt[3]{2})=-6\\sqrt[3]{2}' }, ans: '-6\\sqrt[3]2' },
  e1f: { m: '6', k: '9', a: 35, b: 5, n: 2, coef: '\\dfrac{6}{9}=\\dfrac{2}{3}', coefCap: `${T('6\\div9')} is not a whole number: reduce the fraction, ${T('\\frac69=\\frac23')}.`, q: 7, tog: '\\dfrac{2}{3}\\sqrt{7}', simp: { cap: `Write it as one fraction: ${T('\\frac23\\sqrt7=\\frac{2\\sqrt7}{3}')}.`, tex: '=\\dfrac{2\\sqrt7}{3}' }, ans: '\\dfrac{2\\sqrt7}{3}' }
};
const frac = (d, colored = true) => {
  const C = colored ? ct : (s) => s, B = colored ? cb : (s) => s;
  return `\\dfrac{${d.m ? C(d.m) : ''}${rt(B(d.a), d.n)}}{${d.k ? C(d.k) : ''}${rt(B(d.b), d.n)}}`;
};
const divideRule = {
  title: 'Divide coefficients by coefficients, radicands by radicands',
  height: 400,
  capH: 84,
  choices: [{ v: 'why', label: 'Why it works' }, { sep: 'Example 1 check:' }, ...['a', 'b', 'c', 'd', 'e', 'f'].map((k) => ({ v: 'e1' + k, label: `(${k})` }))],
  ask: (k) => (k === 'why' ? '' : `Example 1(${k.slice(2)}): divide ${T(frac(DR[k], false))} and write it in simplest form.`),
  intro: 'Press <b>Next</b>.',
  make(stage, k, ex) {
    const W = ex.W, ov = overlay(stage, W, 400);
    if (k === 'why') {
      const u = 82, rw = 4 * u, rh = Math.sqrt(3) * u, x0 = 60, y0 = 70;
      const g = svgEl('g', {}, ov);
      svgEl('rect', { x: x0, y: y0, width: rw, height: rh, rx: 4, class: 'u2l5-rect' }, g);
      hide(g);
      const aL = hide(lab(stage, x0 + rw / 2, y0 + rh / 2, `area ${T(cb('\\sqrt{48}'))}`, 'u2l5-in'));
      const wL = hide(lab(stage, x0, y0 + rh / 2, T('\\sqrt3'), 'u2l5-side', 'w', 10));
      const lQ = lab(stage, x0 + rw / 2, y0 + rh, `length ${T('?')}`, 'u2l5-side', 's', 10); hide(lQ);
      const lA = hide(lab(stage, x0 + rw / 2, y0 + rh, `length ${T(cg('4'))}`, 'u2l5-side', 's', 10));
      const L = lines(stage, 470, 30, W - 490, 'u2l5-big2');
      const l1 = L.add(T('\\text{length}=\\dfrac{\\text{area}}{\\text{width}}=\\dfrac{\\sqrt{48}}{\\sqrt3}'));
      const l2 = L.add(T('\\text{Try }\\sqrt{16}:\\ \\ \\sqrt{16}\\cdot\\sqrt3=\\sqrt{16\\cdot3}=\\sqrt{48}\\ \\checkmark'));
      const l3 = L.add(T('\\dfrac{\\sqrt{48}}{\\sqrt3}=\\sqrt{\\dfrac{48}{3}}=\\sqrt{16}=4'));
      const l4 = L.add(T('\\dfrac{\\sqrt a}{\\sqrt b}=\\sqrt{\\dfrac ab}'), 'u2l5-rule');
      return [
        { cap: `A rectangle has area ${T('\\sqrt{48}')} and width ${T('\\sqrt3')}. How long is it?`, run: async (c) => { await show(c, g); await show(c, aL); await show(c, wL); await show(c, lQ); } },
        { cap: `Length = area ÷ width: ${T('\\frac{\\sqrt{48}}{\\sqrt3}')}.`, run: (c) => show(c, l1) },
        { cap: `Division undoes multiplication. Lesson 4: ${T('\\sqrt{16}\\cdot\\sqrt3=\\sqrt{48}')}, so the length is ${T('\\sqrt{16}')}.`, run: (c) => show(c, l2) },
        { cap: `That is ${T('\\sqrt{\\frac{48}{3}}')}: divide the radicands. The length is ${T('\\sqrt{16}=4')}.`, run: async (c) => { await show(c, l3); lQ.style.opacity = 0; await pop(c, lA); } },
        { cap: `The multiplication rule run <b>backward</b>: ${T('\\frac{\\sqrt a}{\\sqrt b}=\\sqrt{\\frac ab}')} (same index).`, run: (c) => pop(c, l4) }
      ];
    }
    const d = DR[k];
    const fb = add(stage, box(h('div', 'u2l5-bigfrac', T(frac(d))), 330, 190), 20, 24);
    const split = (d.m ? `\\dfrac{${ct(d.m)}}{${ct(d.k)}}` : '') + rt(`\\dfrac{${cb(d.a)}}{${cb(d.b)}}`, d.n);
    const sp = hide(add(stage, box(h('div', 'u2l5-split', T('=' + split)), 330), 20, 236));
    const cx0 = 400, cw = W - cx0 - 20;
    const card = (y, head, html, cls) => hide(add(stage, box(h('div', 'u2l5-card ' + cls, `<div class="u2l5-card-h">${head}</div><div class="u2l5-card-b">${html}</div>`), cw, 80), cx0, y));
    const c1 = card(20, 'Coefficients', d.coef ? T(ct(d.coef)) : '<span class="u2l5-muted">none: each is 1</span>', 'u2l5-cardT');
    const c2 = card(112, `Radicands <span class="u2l5-muted">(same index)</span>`, T(cb(`${d.a}\\div${d.b}=${d.q}`)), 'u2l5-cardB');
    const a1 = arrow(ov, 352, 96, cx0 - 8, 62), a2 = arrow(ov, 352, 150, cx0 - 8, 152);
    const L = lines(stage, cx0, 214, cw, 'u2l5-big');
    const tg = L.add(T('=' + d.tog));
    const sm = d.simp.tex ? L.add(T(d.simp.tex)) : null;
    const idx = d.n === 2 ? 'square roots' : 'cube roots';
    return [
      { cap: `Both are ${idx} (the same index), so the quotient fits under <b>one</b> radical: ${T(split)}.`, run: async (c) => { await pulse(c, fb, 1.04); await show(c, sp); } },
      { cap: d.coefCap || (d.coef ? `Divide the coefficients: ${T(d.coef)}.` : 'No coefficients in front (each is 1): nothing to divide.'), run: async (c) => { await a1.draw(c); await show(c, c1); } },
      { cap: `Divide the radicands: ${T(`${d.a}\\div${d.b}=${d.q}`)}.`, run: async (c) => { await a2.draw(c); await show(c, c2); } },
      { cap: `Together: ${T(d.tog)}.`, run: (c) => show(c, tg) },
      { cap: d.simp.cap, run: async (c) => { if (sm) await show(c, sm); done(sm || tg); await pulse(c, sm || tg, 1.05); } }
    ];
  }
};

/* ====================================================================================================
 * Explainer: twoRoutes — reduce under the radical, or simplest form first (Example 2).
 * ==================================================================================================== */
const TR = {
  e2a: {
    f: '\\dfrac{\\sqrt{98}}{\\sqrt{18}}', ans: '\\dfrac73',
    A: [['\\sqrt{\\dfrac{98}{18}}', `<b>Route A:</b> put it under one radical: ${T('\\sqrt{\\frac{98}{18}}')}.`],
      ['=\\sqrt{\\dfrac{49}{9}}', `Reduce the fraction inside (divide by 2): ${T('\\frac{49}{9}')}, two perfect squares.`],
      ['=\\dfrac{7}{3}', `${T('\\sqrt{49}=7')} and ${T('\\sqrt9=3')}: ${T('\\frac73')}.`]],
    B: [['\\dfrac{7\\sqrt2}{3\\sqrt2}', `<b>Route B:</b> simplest form first: ${T('\\sqrt{98}=7\\sqrt2')} and ${T('\\sqrt{18}=3\\sqrt2')}.`],
      ['=\\dfrac{7\\cancel{\\sqrt2}}{3\\cancel{\\sqrt2}}', `${T('\\sqrt2')} is in the top and the bottom: it divides out, just like ${T('\\frac{7x}{3x}=\\frac73')}.`],
      ['=\\dfrac{7}{3}', `${T('\\frac73')} again: both routes give the same answer.`]]
  },
  e2b: {
    f: '\\dfrac{4\\sqrt{90}}{3\\sqrt{40}}', ans: '2',
    A: [['\\dfrac{4}{3}\\sqrt{\\dfrac{90}{40}}', `<b>Route A:</b> coefficients over coefficients, radicands under one radical: ${T('\\frac43\\sqrt{\\frac{90}{40}}')}.`],
      ['=\\dfrac{4}{3}\\sqrt{\\dfrac{9}{4}}', `Reduce inside (divide by 10): ${T('\\frac94')}, two perfect squares.`],
      ['=\\dfrac{4}{3}\\cdot\\dfrac{3}{2}=2', `${T('\\sqrt{\\frac94}=\\frac32')}, and ${T('\\frac43\\cdot\\frac32=2')}.`]],
    B: [['\\dfrac{4(3\\sqrt{10})}{3(2\\sqrt{10})}', `<b>Route B:</b> simplest form first: ${T('\\sqrt{90}=3\\sqrt{10}')} and ${T('\\sqrt{40}=2\\sqrt{10}')}.`],
      ['=\\dfrac{12\\cancel{\\sqrt{10}}}{6\\cancel{\\sqrt{10}}}', `Multiply out: ${T('\\frac{12\\sqrt{10}}{6\\sqrt{10}}')}. The like radicals ${T('\\sqrt{10}')} divide out.`],
      ['=2', `${T('12\\div6=2')}: the same answer both ways.`]]
  },
  e2c: {
    f: '\\dfrac{15\\sqrt{72}}{10\\sqrt{50}}', ans: '\\dfrac95',
    A: [['\\dfrac{15}{10}\\sqrt{\\dfrac{72}{50}}', `<b>Route A:</b> ${T('\\frac{15}{10}\\sqrt{\\frac{72}{50}}')}.`],
      ['=\\dfrac{3}{2}\\sqrt{\\dfrac{36}{25}}', `Reduce both fractions: ${T('\\frac{15}{10}=\\frac32')} and ${T('\\frac{72}{50}=\\frac{36}{25}')}.`],
      ['=\\dfrac{3}{2}\\cdot\\dfrac{6}{5}=\\dfrac{9}{5}', `${T('\\sqrt{\\frac{36}{25}}=\\frac65')}, and ${T('\\frac32\\cdot\\frac65=\\frac{18}{10}=\\frac95')}.`]],
    B: [['\\dfrac{15(6\\sqrt2)}{10(5\\sqrt2)}', `<b>Route B:</b> ${T('\\sqrt{72}=6\\sqrt2')} and ${T('\\sqrt{50}=5\\sqrt2')}.`],
      ['=\\dfrac{90\\cancel{\\sqrt2}}{50\\cancel{\\sqrt2}}', `${T('\\frac{90\\sqrt2}{50\\sqrt2}')}: the ${T('\\sqrt2')} divides out.`],
      ['=\\dfrac{90}{50}=\\dfrac{9}{5}', `Reduce: ${T('\\frac{90}{50}=\\frac95')}. The same answer.`]]
  },
  e2d: {
    f: '\\dfrac{6\\sqrt[3]{54}}{\\sqrt[3]{16}}', ans: '9',
    A: [['6\\sqrt[3]{\\dfrac{54}{16}}', `<b>Route A:</b> one cube root: ${T('6\\sqrt[3]{\\frac{54}{16}}')}.`],
      ['=6\\sqrt[3]{\\dfrac{27}{8}}', `Reduce inside (divide by 2): ${T('\\frac{27}{8}')}, two perfect cubes.`],
      ['=6\\cdot\\dfrac{3}{2}=9', `${T('\\sqrt[3]{\\frac{27}{8}}=\\frac32')}, and ${T('6\\cdot\\frac32=9')}.`]],
    B: [['\\dfrac{6(3\\sqrt[3]{2})}{2\\sqrt[3]{2}}', `<b>Route B:</b> ${T('\\sqrt[3]{54}=3\\sqrt[3]2')} and ${T('\\sqrt[3]{16}=2\\sqrt[3]2')}.`],
      ['=\\dfrac{18\\cancel{\\sqrt[3]{2}}}{2\\cancel{\\sqrt[3]{2}}}', `Multiply out: ${T('\\frac{18\\sqrt[3]2}{2\\sqrt[3]2}')}. The ${T('\\sqrt[3]2')} divides out.`],
      ['=\\dfrac{18}{2}=9', `${T('18\\div2=9')}: the same answer.`]]
  }
};
const twoRoutes = {
  title: 'Two routes, one answer',
  height: 440,
  capH: 84,
  choices: [{ sep: 'Example 2 check:' }, ...['a', 'b', 'c', 'd'].map((k) => ({ v: 'e2' + k, label: `(${k})` }))],
  ask: (k) => `Example 2(${k.slice(2)}): simplify ${T(TR[k].f)}.`,
  make(stage, k, ex) {
    const W = ex.W, d = TR[k];
    add(stage, box(h('div', 'u2l5-head', T(d.f)), W), 0, 6);
    const lw = (W - 60) / 2, xs = [20, 40 + lw];
    const heads = [['Route A', 'reduce under the radical', 'u2l5-laneT'], ['Route B', 'simplest form first', 'u2l5-laneB']]
      .map(([a, b, cls], i) => hide(add(stage, box(h('div', 'u2l5-lane ' + cls, `<b>${a}:</b> ${b}`), lw), xs[i], 92)));
    const mk = (i, arr) => { const L = lines(stage, xs[i] + 14, 146, lw - 28, 'u2l5-big2 u2l5-lanel'); return arr.map(([t]) => L.add(T(t))); };
    const la = mk(0, d.A), lb = mk(1, d.B);
    const st = stampAt(stage, W / 2, 392, `Same answer: ${T(d.ans)}`, true);
    const steps = [];
    d.A.forEach(([, cap], i) => steps.push({ cap, run: async (c) => { if (i === 0) await show(c, heads[0]); await show(c, la[i]); if (i === 2) done(la[i]); } }));
    d.B.forEach(([, cap], i) => steps.push({ cap, run: async (c) => { if (i === 0) await show(c, heads[1]); await show(c, lb[i]); if (i === 2) { done(lb[i]); await sIn(c, st); } } }));
    return steps;
  }
};

/* ====================================================================================================
 * Explainer: splitBar — a monomial denominator divides every term (Example 3; the 6 + 4 trap).
 * ==================================================================================================== */
const SB = {
  trap: { t: ['6', '4'], op: '+', den: '2' },
  e3a: { t: ['\\sqrt{70}', '\\sqrt{42}'], op: '-', den: '\\sqrt{7}', r: ['\\sqrt{10}', '\\sqrt{6}'],
    caps: [`${T('\\frac{\\sqrt{70}}{\\sqrt7}=\\sqrt{10}')}, because ${T('70\\div7=10')}.`, `${T('\\frac{\\sqrt{42}}{\\sqrt7}=\\sqrt6')}. The answer: ${T('\\sqrt{10}-\\sqrt6')}.`] },
  e3b: { t: ['12\\sqrt{15}', '8\\sqrt{6}'], op: '+', den: '4\\sqrt{3}', r: ['3\\sqrt{5}', '2\\sqrt{2}'],
    caps: [`${T('\\frac{12\\sqrt{15}}{4\\sqrt3}=3\\sqrt5')}: ${T('12\\div4=3')} and ${T('15\\div3=5')}.`, `${T('\\frac{8\\sqrt6}{4\\sqrt3}=2\\sqrt2')}: ${T('8\\div4=2')} and ${T('6\\div3=2')}. The answer: ${T('3\\sqrt5+2\\sqrt2')}.`] },
  e3c: { t: ['6\\sqrt{40}', '9\\sqrt{24}'], op: '-', den: '3\\sqrt{2}', r: ['2\\sqrt{20}', '3\\sqrt{12}'],
    caps: [`${T('\\frac{6\\sqrt{40}}{3\\sqrt2}=2\\sqrt{20}')}: ${T('6\\div3=2')} and ${T('40\\div2=20')}.`, `${T('\\frac{9\\sqrt{24}}{3\\sqrt2}=3\\sqrt{12}')}: ${T('9\\div3=3')} and ${T('24\\div2=12')}.`],
    extra: ['=2(2\\sqrt{5})-3(2\\sqrt{3})=4\\sqrt{5}-6\\sqrt{3}', `Not done yet: simplest form. ${T('\\sqrt{20}=2\\sqrt5')} and ${T('\\sqrt{12}=2\\sqrt3')}, so ${T('4\\sqrt5-6\\sqrt3')}.`] }
};
const splitBar = {
  title: 'The fraction bar groups the whole numerator',
  height: 440,
  capH: 84,
  choices: [{ v: 'trap', label: T('\\frac{6+4}{2}') }, { sep: 'Example 3 check:' }, ...['a', 'b', 'c'].map((k) => ({ v: 'e3' + k, label: `(${k})` }))],
  ask: (k) => (k === 'trap' ? '' : `Example 3(${k.slice(2)}): divide each term of ${T(`\\dfrac{${SB[k].t[0]}${SB[k].op}${SB[k].t[1]}}{${SB[k].den}}`)} by the denominator.`),
  make(stage, k, ex) {
    const W = ex.W, d = SB[k], ov = overlay(stage, W, 440), cx0 = W / 2, tw = 210, gap = 150;
    const grp = hide(add(stage, box(h('div', 'u2l5-grp'), 2 * gap + tw + 20, 84), cx0 - gap - tw / 2 - 10, 24));
    const tile = (x, y, html, cls = '') => add(stage, box(h('div', 'u2l5-tile ' + cls, html), tw, 64), x - tw / 2, y);
    tile(cx0 - gap, 34, T(d.t[0])); tile(cx0 + gap, 34, T(d.t[1]));
    lab(stage, cx0, 66, T(d.op), 'u2l5-op');
    svgEl('line', { x1: cx0 - gap - tw / 2 - 10, x2: cx0 + gap + tw / 2 + 10, y1: 118, y2: 118, stroke: INK, 'stroke-width': 4, 'stroke-linecap': 'round' }, ov);
    const den = tile(cx0, 128, T(ct(d.den)), 'u2l5-tileD');
    // the split: one fraction per term
    const px = [cx0 - 200, cx0 + 200], py = 262;
    const piece = (i) => hide(lab(stage, px[i], py, T(`\\dfrac{${d.t[i]}}{${ct(d.den)}}`), 'u2l5-piece'));
    const pc = [piece(0), piece(1)], pop2 = hide(lab(stage, cx0, py, T(d.op), 'u2l5-op'));
    const fly = [0, 1].map(() => hide(tile(cx0, 128, T(ct(d.den)), 'u2l5-tileD')));
    const flyTo = async (c) => {
      await Promise.all(fly.map((f, i) => { f.style.opacity = 1; return anim(c, f, [{ translate: '0 0', opacity: 1 }, { translate: `${px[i] - cx0}px ${py - 128 - 8}px`, opacity: 0 }], 650); }));
    };
    if (k === 'trap') {
      const tot = hide(lab(stage, cx0 + gap + tw / 2 + 24, 118, T('=\\dfrac{10}{2}=5'), 'u2l5-piece', 'e', 0));
      const bad = hide(lab(stage, cx0, py, T(`\\dfrac{6}{2}+4=3+4=${cx('7')}\\ \\ ${cx('\\times')}`), 'u2l5-bad'));
      const r = [hide(lab(stage, px[0], 352, T(cg('=3')), 'u2l5-res')), hide(lab(stage, px[1], 352, T(cg('=2')), 'u2l5-res'))];
      const fin = hide(lab(stage, cx0, 410, T('3+2=5\\ \\checkmark'), 'u2l5-res u2l5-xt'));
      return [
        { cap: `Do the top first: ${T('6+4=10')}, and ${T('\\frac{10}{2}=5')}. The bar groups the <b>whole</b> top.`, run: async (c) => { await show(c, grp); await show(c, tot); } },
        { cap: `A common error: divide only the first term. ${T('\\frac62+4=7')}: wrong, the answer is 5.`, run: async (c) => { await show(c, bad); await shake(c, bad); } },
        { cap: `Divide <b>every</b> term: the 2 goes under the 6 <b>and</b> under the 4.`, run: async (c) => { bad.style.opacity = 0; await flyTo(c); await show(c, pc[0]); await show(c, pop2); await show(c, pc[1]); } },
        { cap: `${T('\\frac62+\\frac42=3+2=5')}. The same as ${T('\\frac{10}{2}')}. Radicals follow the same rule.`, run: async (c) => { await show(c, r[0]); await show(c, r[1]); await pop(c, fin); done(fin); } }
      ];
    }
    const r = [hide(lab(stage, px[0], 352, T(cg('=' + d.r[0])), 'u2l5-res')), hide(lab(stage, px[1], 352, T(cg('=' + d.r[1])), 'u2l5-res'))];
    const rop = hide(lab(stage, cx0, 352, T(cg(d.op)), 'u2l5-res'));
    const xt = hide(lab(stage, cx0, 410, T(d.extra ? d.extra[0] : `=${d.r[0]}${d.op}${d.r[1]}`), 'u2l5-res u2l5-xt'));
    const steps = [
      { cap: `The fraction bar groups the <b>whole</b> numerator: ${T(ct(d.den))} divides all of it.`, run: async (c) => { await show(c, grp); await pulse(c, den, 1.06); } },
      { cap: `So ${T(ct(d.den))} divides <b>every</b> term: split it into two fractions.`, run: async (c) => { await flyTo(c); await show(c, pc[0]); await show(c, pop2); await show(c, pc[1]); } },
      { cap: d.caps[0], run: (c) => show(c, r[0]) },
      { cap: d.caps[1], run: async (c) => { await show(c, rop); await show(c, r[1]); if (!d.extra) { await show(c, xt); done(xt); } } }
    ];
    if (d.extra) steps.push({ cap: d.extra[1], run: async (c) => { await show(c, xt); done(xt); } });
    return steps;
  }
};

/* ====================================================================================================
 * Explainer: simplestStamp — the five checks for simplest form.
 * ==================================================================================================== */
const SS_RULES = ['No perfect-square (or cube) factor in a radicand', 'No radical in a denominator', 'No fraction under a radical', 'Like radicals combined', 'The fraction is reduced'];
const SS = [
  { e: '\\sqrt{12}', r: 0, fix: '2\\sqrt3', cap: `${T('\\sqrt{12}')}: ${T('12=4\\cdot3')} has a perfect-square factor. Not simplest: ${T('\\sqrt{12}=2\\sqrt3')}.` },
  { e: '\\dfrac{4}{\\sqrt7}', r: 1, fix: '\\dfrac{4\\sqrt7}{7}', cap: `${T('\\frac{4}{\\sqrt7}')}: a radical in the <b>denominator</b>. Today we learn to clear it: ${T('\\frac{4\\sqrt7}{7}')}.` },
  { e: '\\sqrt{\\dfrac35}', r: 2, fix: '\\dfrac{\\sqrt{15}}{5}', cap: `${T('\\sqrt{\\frac35}')}: a <b>fraction under a radical</b>. Today it becomes ${T('\\frac{\\sqrt{15}}{5}')}.` },
  { e: '2\\sqrt3+\\sqrt3', r: 3, fix: '3\\sqrt3', cap: `${T('2\\sqrt3+\\sqrt3')}: <b>like radicals</b> not combined. Collect them: ${T('3\\sqrt3')}.` },
  { e: '\\dfrac{6\\sqrt5}{4}', r: 4, fix: '\\dfrac{3\\sqrt5}{2}', cap: `${T('\\frac{6\\sqrt5}{4}')}: the fraction is <b>not reduced</b> (6 and 4 share 2): ${T('\\frac{3\\sqrt5}{2}')}.` },
  { e: '\\dfrac{3\\sqrt5}{5}', r: -1, fix: null, cap: `${T('\\frac{3\\sqrt5}{5}')} passes all five checks: <b>simplest form</b>. (The 5s do not cancel: one is inside a radical.)` }
];
const simplestStamp = {
  title: 'Simplest form: five checks',
  height: 400,
  capH: 84,
  choices: null,
  ask: false,
  intro: 'Six answers. Which are in simplest form? Press <b>Next</b>.',
  make(stage, k, ex) {
    const W = ex.W;
    const list = add(stage, box(h('div', 'u2l5-rules'), 350), 16, 14);
    const rows = SS_RULES.map((t, i) => { const r = h('div', 'u2l5-rule-r', `<span class="u2l5-rn">${i + 1}</span><span class="u2l5-rt">${t}</span>`); list.appendChild(r); return r; });
    const x0 = 390, cw = (W - x0 - 16 - 2 * 12) / 3, chH = 178;
    const cards = SS.map((s, i) => {
      const x = x0 + (i % 3) * (cw + 12), y = 14 + Math.floor(i / 3) * (chH + 14);
      const cd = add(stage, box(h('div', 'u2l5-sc', `<div class="u2l5-sc-e">${T(s.e)}</div>`), cw, chH), x, y);
      const fx = h('div', 'u2l5-sc-f', s.fix ? `${T('\\to\\ ' + cg(s.fix))}` : '<b>simplest form</b>'); cd.appendChild(fx); hide(fx);
      const st = stampAt(stage, x + cw - 30, y + 30, s.r < 0 ? '✓' : `✗ ${s.r + 1}`, s.r < 0, 'sm');
      return { cd, fx, st };
    });
    return SS.map((s, i) => ({
      cap: s.cap,
      run: async (c) => {
        cards.forEach((q) => q.cd.classList.remove('u2l5-on')); rows.forEach((r) => r.classList.remove('u2l5-on'));
        cards[i].cd.classList.add('u2l5-on');
        if (s.r >= 0) { rows[s.r].classList.add('u2l5-on'); await pulse(c, rows[s.r], 1.03); }
        else rows.forEach((r) => r.classList.add('u2l5-okr'));
        await sIn(c, cards[i].st); await show(c, cards[i].fx);
      }
    }));
  }
};

/* ====================================================================================================
 * Explainer: formOfOne (the star) — multiply by √b/√b = 1; a square of side √b has area b (Example 4).
 * ==================================================================================================== */
const FO = {
  w: { start: '\\dfrac{1}{\\sqrt{2}}', b: 2, top: '1\\cdot\\sqrt2=\\sqrt2', bot: '\\sqrt2\\cdot\\sqrt2=2', res: '=\\dfrac{\\sqrt{2}}{2}', endCap: `${T('\\frac{1}{\\sqrt2}=\\frac{\\sqrt2}{2}')}: the warm-up's big one. Same value, whole-number denominator.` },
  e4a: { start: '\\dfrac{5}{\\sqrt{3}}', b: 3, top: '5\\cdot\\sqrt3=5\\sqrt3', bot: '\\sqrt3\\cdot\\sqrt3=3', res: '=\\dfrac{5\\sqrt{3}}{3}', endCap: `3 does not divide 5 (and the 3s can't cancel: one is under a radical). Answer: ${T('\\frac{5\\sqrt3}{3}')}.` },
  e4b: { start: '\\dfrac{\\sqrt{2}}{\\sqrt{7}}', b: 7, top: '\\sqrt2\\cdot\\sqrt7=\\sqrt{14}', bot: '\\sqrt7\\cdot\\sqrt7=7', res: '=\\dfrac{\\sqrt{14}}{7}', endCap: `Nothing to reduce: ${T('\\frac{\\sqrt{14}}{7}')}.` },
  e4c: { start: '\\dfrac{14}{3\\sqrt{7}}', b: 7, m: '3', top: '14\\cdot\\sqrt7=14\\sqrt7', bot: '3\\sqrt7\\cdot\\sqrt7=3(7)', res: '=\\dfrac{14\\sqrt{7}}{3(7)}=\\dfrac{14\\sqrt{7}}{21}', red: [['=\\dfrac{2\\sqrt{7}}{3}', `Reduce: 14 and 21 share 7. Answer: ${T('\\frac{2\\sqrt7}{3}')}.`]] },
  e4d: { start: '\\dfrac{10}{\\sqrt{20}}', pre: [['=\\dfrac{10}{2\\sqrt{5}}=\\dfrac{5}{\\sqrt{5}}', `Simplify the denominator <b>first</b>: ${T('\\sqrt{20}=2\\sqrt5')}, and ${T('\\frac{10}{2}=5')}. Smaller numbers!`]], from: '\\dfrac{5}{\\sqrt{5}}', b: 5, top: '5\\cdot\\sqrt5=5\\sqrt5', bot: '\\sqrt5\\cdot\\sqrt5=5', res: '=\\dfrac{5\\sqrt{5}}{5}', red: [['=\\sqrt{5}', `${T('5\\div5=1')}: the answer is ${T('\\sqrt5')}.`]] },
  e4e: { start: '\\dfrac{-9}{2\\sqrt{6}}', b: 6, m: '2', top: '-9\\cdot\\sqrt6=-9\\sqrt6', bot: '2\\sqrt6\\cdot\\sqrt6=2(6)', res: '=\\dfrac{-9\\sqrt{6}}{2(6)}=\\dfrac{-9\\sqrt{6}}{12}', red: [['=-\\dfrac{3\\sqrt{6}}{4}', `Reduce: 9 and 12 share 3. Put the negative sign in front: ${T('-\\frac{3\\sqrt6}{4}')}.`]] },
  e4f: { start: '\\sqrt{\\dfrac{5}{8}}', pre: [['=\\dfrac{\\sqrt{5}}{\\sqrt{8}}=\\dfrac{\\sqrt{5}}{2\\sqrt{2}}', `A fraction under a radical: split it, ${T('\\sqrt{\\frac58}=\\frac{\\sqrt5}{\\sqrt8}')}, then simplify ${T('\\sqrt8=2\\sqrt2')}.`]], from: '\\dfrac{\\sqrt{5}}{2\\sqrt{2}}', b: 2, m: '2', top: '\\sqrt5\\cdot\\sqrt2=\\sqrt{10}', bot: '2\\sqrt2\\cdot\\sqrt2=2(2)', res: '=\\dfrac{\\sqrt{10}}{2(2)}=\\dfrac{\\sqrt{10}}{4}', endCap: `Nothing to reduce: ${T('\\frac{\\sqrt{10}}{4}')}.` }
};
const formOfOne = {
  title: 'Multiply by a form of 1',
  height: 450,
  capH: 84,
  choices: [{ v: 'w', label: T('\\tfrac{1}{\\sqrt2}') }, { sep: 'Example 4 check:' }, ...['a', 'b', 'c', 'd', 'e', 'f'].map((k) => ({ v: 'e4' + k, label: `(${k})` }))],
  ask: (k) => (k === 'w' ? '' : `Example 4(${k.slice(2)}): rationalize the denominator of ${T(FO[k].start)} and simplify.`),
  make(stage, k, ex) {
    const W = ex.W, d = FO[k], b = d.b, rb = `\\sqrt{${b}}`, from = d.from || d.start;
    const ov = overlay(stage, W, 450);
    // ---- left: the working
    const L = lines(stage, 22, 16, 530, 'u2l5-big');
    L.add(T(d.start)).style.opacity = 1;
    const pre = (d.pre || []).map(([t]) => L.add(T(t)));
    const mul = L.add(`${T(`${from}\\cdot${ONE(rb)}`)} <span class="u2l5-one">${T(ca(`\\dfrac{${rb}}{${rb}}=1`))}</span>`);
    const res = L.add(T(d.res));
    const red = (d.red || []).map(([t]) => L.add(T(t)));
    // ---- right: b unit squares rearranged into a square of side √b
    const PX = 580, PW = W - PX - 16, yB = 398, u = Math.min(88, (PW - 40) / b), s = u * Math.sqrt(b);
    const xs0 = PX + (PW - b * u) / 2, xs1 = PX + (PW - s) / 2;
    lab(stage, PX + PW / 2, 16, `the denominator's ${T(cb(rb))}`, 'u2l5-ptitle', 's', 0);
    const gP = svgEl('g', {}, ov); hide(gP);
    const rect = svgEl('rect', { x: xs0, y: yB - u, width: b * u, height: u, class: 'u2l5-sq' }, gP);
    const gGrid = svgEl('g', {}, gP);
    for (let i = 1; i < b; i++) svgEl('line', { x1: xs0 + i * u, x2: xs0 + i * u, y1: yB - u, y2: yB, class: 'u2l5-sqgrid' }, gGrid);
    const ones = [];
    for (let i = 0; i < b; i++) ones.push(lab(stage, xs0 + (i + 0.5) * u, yB - u / 2, '1', 'u2l5-unit'));
    ones.forEach(hide);
    const stripL = hide(lab(stage, PX + PW / 2, yB - u - 10, `${b} unit squares: area ${b}`, 'u2l5-plab', 'n', 0));
    const sB = hide(lab(stage, xs1 + s / 2, yB, T(cb(rb)), 'u2l5-side', 's', 6));
    const sL = hide(lab(stage, xs1, yB - s / 2, T(cb(rb)), 'u2l5-side', 'w', 8));
    const aIn = hide(lab(stage, xs1 + s / 2, yB - s / 2, `area ${b}`, 'u2l5-in'));
    const eq = hide(lab(stage, PX + PW / 2, yB - s - 16, T(`${cb(rb)}\\cdot${cb(rb)}=${b}`), 'u2l5-eq', 'n', 0));
    const morph = (c) => tween(c, 900, (t) => {
      const w = b * u + (s - b * u) * t, hh = u + (s - u) * t, x = xs0 + (xs1 - xs0) * t;
      rect.setAttribute('x', x); rect.setAttribute('y', yB - hh); rect.setAttribute('width', w); rect.setAttribute('height', hh);
    });
    const steps = (d.pre || []).map(([, cap], i) => ({ cap, run: (c) => show(c, pre[i]) }));
    steps.push(
      { cap: `The denominator holds ${T(rb)}. Picture ${b} unit squares: their area is ${b}.`, run: async (c) => { await show(c, gP); for (const o of ones) await appear(c, o, 120); await show(c, stripL); } },
      { cap: `Rearrange them into a <b>square</b> of area ${b}: its side is ${T(rb)}. So ${T(`${rb}\\cdot${rb}=${b}`)}, a whole number!`,
        run: async (c) => { stripL.style.opacity = 0; ones.forEach((o) => (o.style.opacity = 0)); gGrid.style.opacity = 0; await morph(c); await show(c, sB); await show(c, sL); await show(c, aIn); await pop(c, eq); } },
      { cap: `Multiply by ${T(`\\frac{${rb}}{${rb}}`)}. It equals <b>1</b>, so the value does not change.${d.m ? ` The ${T(d.m)} is already rational: multiply by ${T(rb)} <b>only</b>.` : ''}`, run: async (c) => { await show(c, mul); } },
      { cap: `Top: ${T(d.top)}. Bottom: ${T(d.bot)}, the square's area. No radical left in the denominator.`, run: async (c) => { await pulse(c, eq, 1.08); await show(c, res); if (!red.length) done(res); } }
    );
    (d.red || []).forEach(([, cap], i) => steps.push({ cap, run: async (c) => { await show(c, red[i]); if (i === red.length - 1) done(red[i]); } }));
    if (d.endCap) steps.push({ cap: d.endCap, run: (c) => pulse(c, res, 1.05) });
    return steps;
  }
};

/* ====================================================================================================
 * Explainer: twoTermNum — two-term numerators (Example 5): divide each term or rationalize first; reduce only by a
 * factor of every term.
 * ==================================================================================================== */
const TT = {
  e5ab: {
    A: [['\\dfrac{8\\sqrt{15}}{2\\sqrt{3}}-\\dfrac{4\\sqrt{6}}{2\\sqrt{3}}', `<b>(a) Divide each term</b> by ${T('2\\sqrt3')}.`],
      ['=4\\sqrt{5}-2\\sqrt{2}', `${T('8\\div2=4')}, ${T('15\\div3=5')}; ${T('4\\div2=2')}, ${T('6\\div3=2')}: ${T('4\\sqrt5-2\\sqrt2')}.`]],
    B: [[`\\dfrac{(8\\sqrt{15}-4\\sqrt{6})${ca('\\sqrt3')}}{2\\sqrt{3}\\cdot${ca('\\sqrt3')}}`, `<b>(b) Rationalize first:</b> multiply by ${T('\\frac{\\sqrt3}{\\sqrt3}')}. <b>Every</b> term of the top gets the ${T('\\sqrt3')}.`],
      ['=\\dfrac{8\\sqrt{45}-4\\sqrt{18}}{2(3)}', `${T('\\sqrt{15}\\cdot\\sqrt3=\\sqrt{45}')}, ${T('\\sqrt6\\cdot\\sqrt3=\\sqrt{18}')}, and ${T('2\\sqrt3\\cdot\\sqrt3=2(3)')}.`],
      ['=\\dfrac{24\\sqrt{5}-12\\sqrt{2}}{6}', `Simplest form inside: ${T('8\\sqrt{45}=8(3\\sqrt5)')} and ${T('4\\sqrt{18}=4(3\\sqrt2)')}.`],
      ['=4\\sqrt{5}-2\\sqrt{2}', `6 divides <b>every</b> term (24, 12 and 6): ${T('4\\sqrt5-2\\sqrt2')}. The same answer!`]]
  },
  e5c: {
    L: [[`\\dfrac{4+\\sqrt{6}}{\\sqrt{2}}\\cdot${ONE('\\sqrt2')}`, `Multiply by ${T('\\frac{\\sqrt2}{\\sqrt2}')}: <b>both</b> terms of the top get a ${T('\\sqrt2')}.`],
      ['=\\dfrac{(4+\\sqrt{6})\\sqrt{2}}{2}=\\dfrac{4\\sqrt{2}+\\sqrt{12}}{2}', `${T('4\\cdot\\sqrt2=4\\sqrt2')}, ${T('\\sqrt6\\cdot\\sqrt2=\\sqrt{12}')}, and ${T('\\sqrt2\\cdot\\sqrt2=2')}.`],
      ['=\\dfrac{4\\sqrt{2}+2\\sqrt{3}}{2}', `Simplest form: ${T('\\sqrt{12}=2\\sqrt3')}.`],
      ['=2\\sqrt{2}+\\sqrt{3}', `2 divides <b>every</b> term (4, 2 and the 2 below): ${T('2\\sqrt2+\\sqrt3')}.`]],
    chk: [{ q: 'Does 2 divide every term?', t: [['4\\sqrt2', true], ['2\\sqrt3', true], ['2', true]], ok: true }]
  },
  e5d: {
    L: [[`\\dfrac{3\\sqrt{5}-10}{2\\sqrt{5}}\\cdot${ONE('\\sqrt5')}`, `Multiply by ${T('\\frac{\\sqrt5}{\\sqrt5}')}: both terms of the top get a ${T('\\sqrt5')}.`],
      ['=\\dfrac{(3\\sqrt{5}-10)\\sqrt{5}}{2(5)}', `${T('3\\sqrt5\\cdot\\sqrt5=3(5)')}, ${T('10\\cdot\\sqrt5=10\\sqrt5')}, ${T('2\\sqrt5\\cdot\\sqrt5=2(5)')}.`],
      ['=\\dfrac{15-10\\sqrt{5}}{10}', `So ${T('\\frac{15-10\\sqrt5}{10}')}. Can it be reduced?`],
      ['=\\dfrac{3-2\\sqrt{5}}{2}', `10 does not divide 15, but <b>5 divides every term</b>: ${T('\\frac{3-2\\sqrt5}{2}')}.`]],
    chk: [{ q: 'Does 10 divide every term?', t: [['15', false]], ok: false }, { q: 'Does 5?', t: [['15', true], ['10\\sqrt5', true], ['10', true]], ok: true }]
  },
  trap: {
    L: [['\\dfrac{15-10\\sqrt{5}}{10}', 'Reduce this. Watch out for a trap.'],
      [`\\dfrac{15-\\cancel{10}\\sqrt{5}}{\\cancel{10}}=15-\\sqrt{5}\\ \\ ${cx('\\times')}`, `Cancelling the 10s divides only <b>one</b> term: the 15 was never divided. ${T('15-\\sqrt5')} is wrong.`],
      ['=\\dfrac{15}{10}-\\dfrac{10\\sqrt{5}}{10}=\\dfrac{3}{2}-\\sqrt{5}', `Divide <b>every</b> term by 10: ${T('\\frac32-\\sqrt5')}. Correct, as two fractions.`],
      ['=\\dfrac{3-2\\sqrt{5}}{2}', `Or divide every term by their common factor 5: ${T('\\frac{3-2\\sqrt5}{2}')}. The same number, one fraction.`]],
    bad: 1
  }
};
const twoTermNum = {
  title: 'Two-term numerators: every term counts',
  height: 450,
  capH: 84,
  choices: [{ sep: 'Example 5 check:' }, { v: 'e5ab', label: '(a) and (b)' }, { v: 'e5c', label: '(c)' }, { v: 'e5d', label: '(d)' }, { v: 'trap', label: 'A reducing trap' }],
  ask: (k) => ({ e5ab: `Example 5(a) and (b): simplify ${T('\\dfrac{8\\sqrt{15}-4\\sqrt6}{2\\sqrt3}')} two ways.`, e5c: `Example 5(c): rationalize ${T('\\dfrac{4+\\sqrt6}{\\sqrt2}')}.`, e5d: `Example 5(d): rationalize ${T('\\dfrac{3\\sqrt5-10}{2\\sqrt5}')}.`, trap: '' }[k]),
  make(stage, k, ex) {
    const W = ex.W, d = TT[k];
    if (k === 'e5ab') {
      const lw = (W - 60) / 2, xs = [20, 40 + lw];
      const heads = [['(a)', 'divide each term', 'u2l5-laneT'], ['(b)', 'rationalize first', 'u2l5-laneB']]
        .map(([a, b, cls], i) => hide(add(stage, box(h('div', 'u2l5-lane ' + cls, `<b>${a}</b> ${b}`), lw), xs[i], 12)));
      const mk = (i, arr) => { const L = lines(stage, xs[i] + 14, 70, lw - 28, 'u2l5-big u2l5-lanel'); return arr.map(([t]) => L.add(T(t))); };
      const la = mk(0, d.A), lb = mk(1, d.B);
      const st = stampAt(stage, xs[0] + lw / 2, 300, `Same answer ${T('4\\sqrt5-2\\sqrt2')}`, true);
      const steps = [];
      d.A.forEach(([, cap], i) => steps.push({ cap, run: async (c) => { if (i === 0) await show(c, heads[0]); await show(c, la[i]); if (i === 1) done(la[i]); } }));
      d.B.forEach(([, cap], i) => steps.push({ cap, run: async (c) => { if (i === 0) await show(c, heads[1]); await show(c, lb[i]); if (i === 3) { done(lb[i]); await sIn(c, st); } } }));
      return steps;
    }
    const L = lines(stage, 22, 18, 600, 'u2l5-big');
    const ln = d.L.map(([t], i) => { const e = L.add(T(t), d.bad === i ? 'u2l5-badln' : ''); return e; });
    ln[0].style.opacity = k === 'trap' ? 1 : 0;
    const panel = d.chk ? hide(add(stage, box(h('div', 'u2l5-chk'), W - 680), 660, 40)) : null;
    const rowsEl = [];
    if (panel) d.chk.forEach((r) => {
      const row = h('div', 'u2l5-chk-r', `<div class="u2l5-chk-q">${r.q}</div><div class="u2l5-chk-t">${r.t.map(([t, ok]) => `<span class="u2l5-chip ${ok ? 'u2l5-cok' : 'u2l5-cno'}">${T(t)} ${ok ? '✓' : '✗'}</span>`).join('')}</div>`);
      panel.appendChild(row); rowsEl.push(row); hide(row);
    });
    const steps = d.L.map(([, cap], i) => ({
      cap,
      run: async (c) => {
        if (i === 0 && k === 'trap') { await pulse(c, ln[0], 1.05); return; }
        if (i === d.L.length - 1 && panel) { panel.style.opacity = 1; for (const r of rowsEl) await show(c, r); }
        await show(c, ln[i]);
        if (d.bad === i) await shake(c, ln[i]);
        if (i === d.L.length - 1) done(ln[i]);
      }
    }));
    return steps;
  }
};

/* ====================================================================================================
 * Explainer: cubeFill (the star, 3-D) — fill the factor slots and grow the box of unit cubes into a perfect cube.
 * ==================================================================================================== */
const CF = {
  w: { idx: 3, start: '\\dfrac{5}{\\sqrt[3]{2}}', b: 2, fac: [[2, 1]], mult: 4, pw: 8, k: 2, box: [2, 1, 1], mid: [2, 2, 1], tgt: [2, 2, 2],
    res: '=\\dfrac{5\\sqrt[3]{4}}{\\sqrt[3]{8}}=\\dfrac{5\\sqrt[3]{4}}{2}' },
  e6a: { idx: 3, start: '\\dfrac{4}{\\sqrt[3]{3}}', b: 3, fac: [[3, 1]], mult: 9, pw: 27, k: 3, box: [3, 1, 1], tgt: [3, 3, 3],
    res: '=\\dfrac{4\\sqrt[3]{9}}{\\sqrt[3]{27}}=\\dfrac{4\\sqrt[3]{9}}{3}', end: `3 does not divide 4: the answer is ${T('\\frac{4\\sqrt[3]9}{3}')}.` },
  e6b: { idx: 3, start: '\\dfrac{10}{\\sqrt[3]{25}}', b: 25, fac: [[5, 2]], mult: 5, pw: 125, k: 5, box: [5, 5, 1], tgt: [5, 5, 5],
    res: '=\\dfrac{10\\sqrt[3]{5}}{\\sqrt[3]{125}}=\\dfrac{10\\sqrt[3]{5}}{5}', red: ['=2\\sqrt[3]{5}', `${T('10\\div5=2')}: the answer is ${T('2\\sqrt[3]5')}.`] },
  e6c: { idx: 3, start: '\\dfrac{9}{2\\sqrt[3]{6}}', m: '2', b: 6, fac: [[2, 1], [3, 1]], mult: 36, pw: 216, k: 6, box: [3, 2, 1], tgt: [6, 6, 6],
    res: '=\\dfrac{9\\sqrt[3]{36}}{2\\sqrt[3]{216}}=\\dfrac{9\\sqrt[3]{36}}{12}', red: ['=\\dfrac{3\\sqrt[3]{36}}{4}', `${T('2\\sqrt[3]{216}=2(6)=12')}. Reduce: 9 and 12 share 3, so ${T('\\frac{3\\sqrt[3]{36}}{4}')}.`] },
  e6d: { idx: 3, start: '\\sqrt[3]{\\dfrac{3}{4}}', pre: ['=\\dfrac{\\sqrt[3]{3}}{\\sqrt[3]{4}}', `A fraction under a radical: split it first, ${T('\\sqrt[3]{\\frac34}=\\frac{\\sqrt[3]3}{\\sqrt[3]4}')}.`], from: '\\dfrac{\\sqrt[3]{3}}{\\sqrt[3]{4}}',
    b: 4, fac: [[2, 2]], mult: 2, pw: 8, k: 2, box: [2, 2, 1], tgt: [2, 2, 2], res: '=\\dfrac{\\sqrt[3]{6}}{\\sqrt[3]{8}}=\\dfrac{\\sqrt[3]{6}}{2}', end: `Nothing to reduce: ${T('\\frac{\\sqrt[3]6}{2}')}.` },
  e6e: { idx: 3, start: '\\dfrac{12}{\\sqrt[3]{18}}', b: 18, fac: [[2, 1], [3, 2]], mult: 12, pw: 216, k: 6, box: [3, 3, 2], tgt: [6, 6, 6],
    res: '=\\dfrac{12\\sqrt[3]{12}}{\\sqrt[3]{216}}=\\dfrac{12\\sqrt[3]{12}}{6}', red: ['=2\\sqrt[3]{12}', `${T('12\\div6=2')}: the answer is ${T('2\\sqrt[3]{12}')}.`] },
  e6f: { idx: 4, start: '\\dfrac{6}{\\sqrt[4]{27}}', b: 27, fac: [[3, 3]], mult: 3, pw: 81, k: 3, box: [3, 3, 3], tgt: [9, 3, 3],
    res: '=\\dfrac{6\\sqrt[4]{3}}{\\sqrt[4]{81}}=\\dfrac{6\\sqrt[4]{3}}{3}', red: ['=2\\sqrt[4]{3}', `${T('6\\div3=2')}: the answer is ${T('2\\sqrt[4]3')}.`] }
};
const facTex = (fac) => fac.flatMap(([p, n]) => Array(n).fill(p)).join('\\cdot');
const WORD = ['', 'one', 'two', 'three', 'four'];
const missText = (d) => d.fac.map(([p, n]) => `${WORD[d.idx - n]} more ${p}${d.idx - n > 1 ? 's' : ''}`).join(' and ');
/** isometric boxes of unit cubes: P(x, y, z) → px; visible faces x = max (right), y = max (left), z = max (top) */
function iso(ov, cx0, top, u, X, Y, Z) {
  const c30 = Math.cos(Math.PI / 6), ox = cx0 - (X - Y) * u * c30 / 2, oy = top + Z * u;
  const P = (x, y, z) => [ox + (x - y) * u * c30, oy + (x + y) * u / 2 - z * u];
  const quad = (g, pts, cls) => svgEl('polygon', { points: pts.map((p) => P(...p).map((v) => v.toFixed(1)).join(',')).join(' '), class: cls }, g);
  const seg = (g, a, b2) => { const [x1, y1] = P(...a), [x2, y2] = P(...b2); svgEl('line', { x1, y1, x2, y2, class: 'u2l5-isogrid' }, g); };
  /** draw the box [x0,x1]×[y0,y1]×[z0,z1]; faces: which of 'top','right','left' */
  function boxG(parent, [x0, x1], [y0, y1], [z0, z1], cls, faces = ['top', 'right', 'left']) {
    const g = svgEl('g', { class: cls }, parent);
    if (faces.includes('left')) { quad(g, [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], 'u2l5-fL'); for (let i = x0 + 1; i < x1; i++) seg(g, [i, y1, z0], [i, y1, z1]); for (let j = z0 + 1; j < z1; j++) seg(g, [x0, y1, j], [x1, y1, j]); }
    if (faces.includes('right')) { quad(g, [[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], 'u2l5-fR'); for (let i = y0 + 1; i < y1; i++) seg(g, [x1, i, z0], [x1, i, z1]); for (let j = z0 + 1; j < z1; j++) seg(g, [x1, y0, j], [x1, y1, j]); }
    if (faces.includes('top')) { quad(g, [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], 'u2l5-fT'); for (let i = x0 + 1; i < x1; i++) seg(g, [i, y0, z1], [i, y1, z1]); for (let j = y0 + 1; j < y1; j++) seg(g, [x0, j, z1], [x1, j, z1]); }
    return g;
  }
  /** a box of size (a, b, c) sitting on the floor in the front corner of the X × Y × Z frame */
  const corner = (parent, [a, b2, c], cls, faces) => boxG(parent, [X - a, X], [Y - b2, Y], [0, c], cls, faces);
  return { P, boxG, corner, H: (X + Y) * u / 2 + Z * u };
}
const cubeFill = {
  title: 'Build a perfect cube',
  height: 480,
  capH: 84,
  choices: [{ v: 'w', label: T('\\tfrac{5}{\\sqrt[3]{2}}') }, { sep: 'Example 6 check:' }, ...['a', 'b', 'c', 'd', 'e', 'f'].map((k) => ({ v: 'e6' + k, label: `(${k})` }))],
  ask: (k) => (k === 'w' ? '' : `Example 6(${k.slice(2)}): rationalize the denominator of ${T(CF[k].start)} and simplify.`),
  make(stage, k, ex) {
    const W = ex.W, d = CF[k], n = d.idx, ov = overlay(stage, W, 470);
    const rB = rt(d.b, n), rM = rt(d.mult, n), from = d.from || d.start, power = n === 3 ? 'cube' : 'fourth power';
    // ---- left: the working
    const L = lines(stage, 22, 12, 500, 'u2l5-big2 u2l5-cfl');
    L.add(T(d.start)).style.opacity = 1;
    const pre = d.pre ? L.add(T(d.pre[0])) : null;
    const mul = L.add(T(`${from}\\cdot${ONE(rM)}`));
    const res = L.add(T(d.res));
    const red = d.red ? L.add(T(d.red[0])) : null;
    // ---- left, below: the factor slots (n of each prime make a perfect cube / fourth power)
    const tal = add(stage, box(h('div', 'u2l5-tally'), 500), 22, 326);
    const fx = facTex(d.fac), bEq = fx === String(d.b) ? T(String(d.b)) : T(`${d.b}=${fx}`);
    tal.innerHTML = `<div class="u2l5-tal-h">${bEq}: a perfect ${power} needs <b>${WORD[n] || n}</b> of each factor</div>`;
    hide(tal);
    const fills = [];
    d.fac.forEach(([p, have]) => {
      const row = h('div', 'u2l5-tal-r', `<span class="u2l5-tal-p">${T(String(p))}</span>`);
      for (let i = 0; i < n; i++) {
        const sl = h('span', 'u2l5-slot' + (i < have ? ' u2l5-have' : ''), i < have ? T(String(p)) : '');
        row.appendChild(sl);
        if (i >= have) fills.push({ sl, p });
      }
      tal.appendChild(row);
    });
    const fillSlot = async (c, f) => { f.sl.classList.add('u2l5-add'); f.sl.innerHTML = T(ca(String(f.p))); await pop(c, f.sl, 300); };
    // ---- right: the 3-D picture
    const PX = 540, PW = W - PX - 12, [X, Y, Z] = d.tgt;
    const c30 = Math.cos(Math.PI / 6);
    const u = Math.min(84, (PW - 30) / ((X + Y) * c30), (470 - 92) / ((X + Y) / 2 + Z));
    const I = iso(ov, PX + PW / 2, 66 + Math.max(0, (470 - 92 - ((X + Y) / 2 + Z) * u) / 2), u, X, Y, Z);
    const gNew = hide(I.corner(ov, d.tgt, 'u2l5-isoN'));
    const gMid = d.mid ? hide(I.corner(ov, d.mid, 'u2l5-isoM')) : null;
    const gOld = hide(I.corner(ov, d.box, 'u2l5-isoO'));
    const gOldSides = hide(I.corner(ov, d.box, 'u2l5-isoO', d.box[2] === Z ? ['top', 'right', 'left'] : ['right', 'left']));
    const dims = (a) => a.join('\\times');
    const capOld = hide(lab(stage, PX + PW / 2, 10, `${T(cb(String(d.b)))} small cubes: ${T(dims(d.box))}`, 'u2l5-ptitle', 's', 0));
    const capMid = d.mid ? hide(lab(stage, PX + PW / 2, 10, `${T('2\\cdot2=4')}: a flat ${T('2\\times2\\times1')} slab ${T(cx('\\times'))}`, 'u2l5-ptitle u2l5-ptbad', 's', 0)) : null;
    const capNew = hide(lab(stage, PX + PW / 2, 10, n === 3 ? `${T(`${d.b}\\cdot${ca(d.mult)}=${d.pw}=${d.k}^3`)}: a ${T(dims(d.tgt))} cube ✓` : `${T(`${d.b}\\cdot${ca(d.mult)}=${d.pw}=3^4`)}: three ${T('3\\times3\\times3')} cubes ✓`, 'u2l5-ptitle u2l5-ptok', 's', 0));
    const swap = async (c, outs, ins) => { outs.forEach((e) => e && (e.style.opacity = 0)); for (const e of ins) await show(c, e); };
    const steps = [];
    if (pre) steps.push({ cap: d.pre[1], run: (c) => show(c, pre) });
    steps.push({
      cap: n === 3 ? `A cube root wants a perfect <b>cube</b>: three equal factors. ${fx === String(d.b) ? `${T(String(d.b))} has only <b>one</b> factor ${T(String(d.b))}` : `${T(`${d.b}=${fx}`)} is ${d.b} small cubes`}: not a cube.`
        : `A <b>fourth</b> root wants a perfect fourth power: <b>four</b> equal factors. ${T('27=3\\cdot3\\cdot3')} is a cube, but only three 3s.`,
      run: async (c) => { await show(c, tal); await show(c, gOld); await show(c, capOld); }
    });
    if (k === 'w') {
      steps.push({ cap: `Multiplying by ${T('\\sqrt[3]2')} is not enough: ${T('\\sqrt[3]2\\cdot\\sqrt[3]2=\\sqrt[3]4')}. Two 2s make a flat slab, not a cube, so ${T('\\sqrt[3]4')} is still irrational.`,
        run: async (c) => { await fillSlot(c, fills[0]); await swap(c, [gOld, capOld], [gMid, capMid]); } });
      steps.push({ cap: `Use ${T('\\sqrt[3]4')} instead: ${T('\\sqrt[3]2\\cdot\\sqrt[3]4=\\sqrt[3]8=2')}. Three 2s: a ${T('2\\times2\\times2')} cube!`,
        run: async (c) => { await fillSlot(c, fills[1]); await swap(c, [gMid, capMid], [gNew, gOldSides, capNew]); } });
    } else {
      steps.push({ cap: `Missing: ${missText(d)}. Multiply by ${T(ca(String(d.mult)))}: ${T(`${d.b}\\cdot${d.mult}=${d.pw}=${d.k}^${n}`)}, a perfect ${power}.`,
        run: async (c) => { for (const f of fills) await fillSlot(c, f); await swap(c, [gOld, capOld], [gNew, gOldSides, capNew]); } });
    }
    steps.push({ cap: `Multiply top and bottom by ${T(`\\frac{${rM}}{${rM}}`)}, a form of 1.${d.m ? ` The ${T(d.m)} is already rational.` : ''}`, run: (c) => show(c, mul) });
    steps.push({ cap: `${T(`${rt(d.pw, n)}=${d.k}`)}: the denominator is rational now.`, run: async (c) => { await show(c, res); if (!red) done(res); } });
    if (red) steps.push({ cap: d.red[1], run: async (c) => { await show(c, red); done(red); } });
    else if (d.end) steps.push({ cap: d.end, run: (c) => pulse(c, res, 1.05) });
    return steps;
  }
};

/* ====================================================================================================
 * Explainer: restrictions — even index: radicand ≥ 0; in a denominator: ≠ 0 (Example 7).
 * ==================================================================================================== */
const RS = {
  e7a: { e: '\\dfrac{\\sqrt{45x^5}}{\\sqrt{5x}}', v: 'x',
    c: [['45x^5\\ge0,\\ 5x\\ge0\\ \\Rightarrow\\ x\\ge0', `Square roots: every radicand must be ${T('\\ge0')}. ${T('45x^5\\ge0')} and ${T('5x\\ge0')} mean ${T('x\\ge0')}.`],
      ['\\sqrt{5x}\\ne0\\ \\Rightarrow\\ x\\ne0', `${T('\\sqrt{5x}')} is in the <b>denominator</b>, so it can't be 0: ${T('x\\ne0')}. Together: ${T('x>0')}.`]],
    L: [['=\\sqrt{\\dfrac{45x^5}{5x}}=\\sqrt{9x^4}', `Divide under one radical: ${T('\\frac{45x^5}{5x}=9x^4')}.`], ['=3x^2', `${T('\\sqrt{9x^4}=3x^2')}, because ${T('(3x^2)^2=9x^4')}.`]] },
  e7b: { e: '\\dfrac{\\sqrt{14a^3}+\\sqrt{21a}}{\\sqrt{7a}}', v: 'a',
    c: [['14a^3,\\ 21a,\\ 7a\\ge0\\ \\Rightarrow\\ a\\ge0', `Every radicand must be ${T('\\ge0')}: ${T('14a^3')}, ${T('21a')} and ${T('7a')} all need ${T('a\\ge0')}.`],
      ['\\sqrt{7a}\\ne0\\ \\Rightarrow\\ a\\ne0', `${T('\\sqrt{7a}')} is in the denominator: ${T('a\\ne0')}. Together: ${T('a>0')}.`]],
    L: [['=\\dfrac{\\sqrt{14a^3}}{\\sqrt{7a}}+\\dfrac{\\sqrt{21a}}{\\sqrt{7a}}', `Divide <b>each</b> term by ${T('\\sqrt{7a}')}.`], ['=\\sqrt{2a^2}+\\sqrt{3}', `${T('\\frac{14a^3}{7a}=2a^2')} and ${T('\\frac{21a}{7a}=3')}.`], ['=a\\sqrt{2}+\\sqrt{3}', `${T('\\sqrt{a^2}=a')}, because ${T('a>0')}.`]] },
  e7c: { e: '\\dfrac{6}{\\sqrt{x}}', v: 'x',
    c: [['x\\ge0', `${T('\\sqrt x')} needs ${T('x\\ge0')}.`], ['\\sqrt{x}\\ne0\\ \\Rightarrow\\ x\\ne0', `It is in the denominator: ${T('x\\ne0')}. So ${T('x>0')}.`]],
    L: [[`=\\dfrac{6}{\\sqrt{x}}\\cdot${ONE('\\sqrt x')}`, `Rationalize: multiply by ${T('\\frac{\\sqrt x}{\\sqrt x}')}, a form of 1.`], ['=\\dfrac{6\\sqrt{x}}{x}', `${T('\\sqrt x\\cdot\\sqrt x=x')}: ${T('\\frac{6\\sqrt x}{x}')}.`]] },
  e7d: { e: '\\dfrac{3x}{\\sqrt{6x}}', v: 'x',
    c: [['6x\\ge0\\ \\Rightarrow\\ x\\ge0', `${T('6x\\ge0')} means ${T('x\\ge0')}.`], ['\\sqrt{6x}\\ne0\\ \\Rightarrow\\ x\\ne0', `In the denominator: ${T('x\\ne0')}. So ${T('x>0')}.`]],
    L: [[`=\\dfrac{3x}{\\sqrt{6x}}\\cdot${ONE('\\sqrt{6x}')}`, `Multiply by ${T('\\frac{\\sqrt{6x}}{\\sqrt{6x}}')}.`], ['=\\dfrac{3x\\sqrt{6x}}{6x}', `${T('\\sqrt{6x}\\cdot\\sqrt{6x}=6x')}.`], ['=\\dfrac{\\sqrt{6x}}{2}', `Reduce: ${T('\\frac{3x}{6x}=\\frac12')} (allowed, since ${T('x\\ne0')}).`]] },
  e7e: { e: '\\sqrt{\\dfrac{5}{8y}}', v: 'y',
    c: [['\\dfrac{5}{8y}\\ge0\\ \\Rightarrow\\ y\\ge0', `The radicand ${T('\\frac{5}{8y}')} must be ${T('\\ge0')}. The 5 is positive, so ${T('8y')} can't be negative: ${T('y\\ge0')}.`],
      ['8y\\ne0\\ \\Rightarrow\\ y\\ne0', `${T('8y')} is a denominator: ${T('y\\ne0')}. So ${T('y>0')}.`]],
    L: [['=\\dfrac{\\sqrt{5}}{\\sqrt{8y}}=\\dfrac{\\sqrt{5}}{2\\sqrt{2y}}', `Split the fraction, then simplify ${T('\\sqrt{8y}=2\\sqrt{2y}')}.`],
      [`=\\dfrac{\\sqrt{5}}{2\\sqrt{2y}}\\cdot${ONE('\\sqrt{2y}')}`, `Multiply by ${T('\\frac{\\sqrt{2y}}{\\sqrt{2y}}')} only (the 2 is rational).`],
      ['=\\dfrac{\\sqrt{10y}}{2(2y)}=\\dfrac{\\sqrt{10y}}{4y}', `${T('\\sqrt5\\cdot\\sqrt{2y}=\\sqrt{10y}')} and ${T('2\\sqrt{2y}\\cdot\\sqrt{2y}=2(2y)')}.`]] },
  e7f: { e: '\\dfrac{4}{\\sqrt[3]{2m}}', v: 'm', odd: true,
    c: [['\\sqrt[3]{2m}:\\ \\text{any real }m', `A <b>cube</b> root can hold any real number, negatives too: no ${T('\\ge0')} condition.`],
      ['\\sqrt[3]{2m}\\ne0\\ \\Rightarrow\\ m\\ne0', `But it is in the denominator: ${T('m\\ne0')}. That is the only restriction.`]],
    L: [[`=\\dfrac{4}{\\sqrt[3]{2m}}\\cdot${ONE('\\sqrt[3]{4m^2}')}`, `A perfect cube: ${T('2m\\cdot4m^2=8m^3=(2m)^3')}. Multiply by ${T('\\frac{\\sqrt[3]{4m^2}}{\\sqrt[3]{4m^2}}')}.`],
      ['=\\dfrac{4\\sqrt[3]{4m^2}}{\\sqrt[3]{8m^3}}=\\dfrac{4\\sqrt[3]{4m^2}}{2m}', `${T('\\sqrt[3]{8m^3}=2m')}.`], ['=\\dfrac{2\\sqrt[3]{4m^2}}{m}', `Reduce: ${T('\\frac42=2')}.`]] }
};
const restrictions = {
  title: 'Restrictions first, then simplify',
  height: 420,
  capH: 84,
  choices: [{ sep: 'Example 7 check:' }, ...['a', 'b', 'c', 'd', 'e', 'f'].map((k) => ({ v: 'e7' + k, label: `(${k})` }))],
  ask: (k) => `Example 7(${k.slice(2)}): simplify ${T(RS[k].e)} and state the restrictions.`,
  make(stage, k, ex) {
    const W = ex.W, d = RS[k], v = d.v;
    add(stage, box(h('div', 'u2l5-rexp', T(d.e)), 460), 16, 10);
    const C = lines(stage, 22, 118, 460, 'u2l5-big2 u2l5-rsl');
    const cl = d.c.map(([t]) => C.add(T(t)));
    const fin = hide(lab(stage, 22 + 230, 330, T(cg(d.odd ? `${v}\\ne0` : `${v}>0`)), 'u2l5-restr'));
    const NL = new NumberLine(stage, { x: 500, y: 4, width: W - 516, height: 110, min: -3, max: 3, fontSize: 18 });
    lab(stage, W - 24, 52, T(v), 'u2l5-nlv', 'w', 0);
    const i1 = d.odd ? NL.interval(-Infinity, Infinity, { color: TL }) : NL.interval(0, Infinity, { color: TL });
    hide(i1);
    const hole = hide(NL.point(0, { open: true, color: TL }));
    const R = lines(stage, 500, 136, W - 516, 'u2l5-big2 u2l5-rsl');
    const rl = d.L.map(([t]) => R.add(T(t)));
    const steps = [
      { cap: d.c[0][1], run: async (c) => { await show(c, cl[0]); i1.style.opacity = 1; await drawIn(i1, 700, c); } },
      { cap: d.c[1][1], run: async (c) => { await show(c, cl[1]); await pop(c, hole); await pop(c, fin); } }
    ];
    d.L.forEach(([, cap], i) => steps.push({ cap, run: async (c) => { await show(c, rl[i]); if (i === d.L.length - 1) done(rl[i]); } }));
    return steps;
  }
};

/* ====================================================================================================
 * Explainer: problems — Example 8: square diagonal, banner, an equation.
 * ==================================================================================================== */
const problems = {
  title: 'Exact answers in problems',
  height: 440,
  capH: 84,
  choices: [{ sep: 'Example 8 check:' }, { v: 'a', label: '(a) square' }, { v: 'b', label: '(b) banner' }, { v: 'c', label: '(c) equation' }],
  ask: (k) => ({ a: 'Example 8(a): a square has a diagonal of 12 cm. Find the exact side length and the area.', b: `Example 8(b): a banner has area ${T('(6\\sqrt{30}+9\\sqrt{10})')} m² and height ${T('3\\sqrt5')} m. Find its length and perimeter.`, c: `Example 8(c): solve ${T('x\\sqrt6+\\sqrt8=\\sqrt{50}')}.` }[k]),
  make(stage, k, ex) {
    const W = ex.W, ov = overlay(stage, W, 440);
    if (k === 'a') {
      const S = 250, x0 = 90, y0 = 90;
      svgEl('rect', { x: x0, y: y0, width: S, height: S, class: 'u2l5-rect' }, ov);
      const dg = svgEl('g', {}, ov);
      svgEl('path', { class: 'bk-stroke', d: `M${x0} ${y0 + S} L${x0 + S} ${y0}`, stroke: AM, 'stroke-width': 4, fill: 'none' }, dg);
      lab(stage, x0 + S * 0.42, y0 + S * 0.42, T(ca('12\\text{ cm}')), 'u2l5-side u2l5-dlab', 'c');
      const sb = lab(stage, x0 + S / 2, y0 + S, T('s'), 'u2l5-side', 's', 8), sl = lab(stage, x0, y0 + S / 2, T('s'), 'u2l5-side', 'w', 8);
      const sb2 = hide(lab(stage, x0 + S / 2, y0 + S, T(cg('6\\sqrt2\\text{ cm}')), 'u2l5-side', 's', 8)), sl2 = hide(lab(stage, x0, y0 + S / 2, T(cg('6\\sqrt2')), 'u2l5-side', 'w', 8));
      const ar = hide(lab(stage, x0 + S * 0.7, y0 + S * 0.74, T(cg('72\\text{ cm}^2')), 'u2l5-in'));
      const L = lines(stage, 470, 30, W - 490, 'u2l5-big');
      const l = [L.add(T('\\sqrt2\\,s=12')), L.add(T(`s=\\dfrac{12}{\\sqrt2}\\cdot${ONE('\\sqrt2')}`)), L.add(T('=\\dfrac{12\\sqrt2}{2}=6\\sqrt2\\text{ cm}')), L.add(T('A=(6\\sqrt2)^2=36(2)=72\\text{ cm}^2'))];
      return [
        { cap: `The diagonal is ${T('\\sqrt2')} times the side: ${T('\\sqrt2\\,s=12')}.`, run: async (c) => { await drawIn(dg, 600, c); await show(c, l[0]); } },
        { cap: `Divide by ${T('\\sqrt2')}: ${T('s=\\frac{12}{\\sqrt2}')}. A radical in the denominator: multiply by ${T('\\frac{\\sqrt2}{\\sqrt2}')}.`, run: (c) => show(c, l[1]) },
        { cap: `${T('\\frac{12\\sqrt2}{2}=6\\sqrt2')}: the side is ${T('6\\sqrt2')} cm.`, run: async (c) => { await show(c, l[2]); sb.style.opacity = 0; sl.style.opacity = 0; await show(c, sb2); await show(c, sl2); } },
        { cap: `Area: square the side. ${T('(6\\sqrt2)^2=36\\cdot2=72')} cm², a whole number.`, run: async (c) => { await show(c, l[3]); done(l[3]); await pop(c, ar); } }
      ];
    }
    if (k === 'b') {
      const rw = 360, rh = 150, x0 = 70, y0 = 120;
      svgEl('rect', { x: x0, y: y0, width: rw, height: rh, class: 'u2l5-rect u2l5-banner' }, ov);
      lab(stage, x0 + rw / 2, y0 + rh / 2, `area<br>${T('(6\\sqrt{30}+9\\sqrt{10})\\text{ m}^2')}`, 'u2l5-in u2l5-inC');
      lab(stage, x0, y0 + rh / 2, T(ct('3\\sqrt5')), 'u2l5-side', 'w', 8);
      const lq = lab(stage, x0 + rw / 2, y0 + rh, `${T('\\ell=\\ ?')}`, 'u2l5-side', 's', 8);
      const la = hide(lab(stage, x0 + rw / 2, y0 + rh, T(cg('\\ell=2\\sqrt6+3\\sqrt2')), 'u2l5-side', 's', 8));
      const L = lines(stage, 470, 14, W - 486, 'u2l5-big2');
      const l = [L.add(T(`\\ell=\\dfrac{A}{h}=\\dfrac{6\\sqrt{30}+9\\sqrt{10}}{${ct('3\\sqrt5')}}`)), L.add(T(`=\\dfrac{6\\sqrt{30}}{${ct('3\\sqrt5')}}+\\dfrac{9\\sqrt{10}}{${ct('3\\sqrt5')}}`)), L.add(T('=2\\sqrt6+3\\sqrt2\\text{ m}')),
        L.add(T('P=2(2\\sqrt6+3\\sqrt2)+2(3\\sqrt5)')), L.add(T('=4\\sqrt6+6\\sqrt2+6\\sqrt5\\text{ m}'))];
      return [
        { cap: `Area = length × height, so the length is area ÷ height.`, run: (c) => show(c, l[0]) },
        { cap: `A one-term denominator: divide <b>each</b> term by ${T('3\\sqrt5')}.`, run: (c) => show(c, l[1]) },
        { cap: `${T('6\\div3=2')}, ${T('30\\div5=6')}; ${T('9\\div3=3')}, ${T('10\\div5=2')}. The length is ${T('2\\sqrt6+3\\sqrt2')} m.`, run: async (c) => { await show(c, l[2]); lq.style.opacity = 0; await pop(c, la); } },
        { cap: `Perimeter: two lengths and two heights.`, run: (c) => show(c, l[3]) },
        { cap: `${T('4\\sqrt6+6\\sqrt2+6\\sqrt5')} m. No like radicals, so it is in simplest form.`, run: async (c) => { await show(c, l[4]); done(l[4]); } }
      ];
    }
    // (c) the equation, with a balance and a check
    const L = lines(stage, 22, 14, 560, 'u2l5-big2');
    const l = [L.add(T('x\\sqrt6+\\sqrt8=\\sqrt{50}')), L.add(T('x\\sqrt6=\\sqrt{50}-\\sqrt8=5\\sqrt2-2\\sqrt2=3\\sqrt2')), L.add(T('x=\\dfrac{3\\sqrt2}{\\sqrt6}=3\\sqrt{\\dfrac26}=\\dfrac{3}{\\sqrt3}')), L.add(T(`=\\dfrac{3}{\\sqrt3}\\cdot${ONE('\\sqrt3')}=\\dfrac{3\\sqrt3}{3}=\\sqrt3`))];
    l[0].style.opacity = 1;
    const bx = 620, bw = W - bx - 24, bcx = bx + bw / 2;
    const gb = svgEl('g', {}, ov);
    svgEl('polygon', { points: `${bcx},120 ${bcx - 26},170 ${bcx + 26},170`, fill: '#c6cad3' }, gb);
    svgEl('line', { x1: bx + 10, x2: bx + bw - 10, y1: 118, y2: 118, stroke: INK, 'stroke-width': 5, 'stroke-linecap': 'round' }, gb);
    lab(stage, bx + bw * 0.22, 112, T('x\\sqrt6+\\sqrt8'), 'u2l5-pan', 'n', 0);
    lab(stage, bx + bw * 0.78, 112, T('\\sqrt{50}'), 'u2l5-pan', 'n', 0);
    const ck = hide(add(stage, box(h('div', 'u2l5-ckbox', `<div><b>Check</b> ${T('x=\\sqrt3')}:</div><div>${T('\\sqrt3\\cdot\\sqrt6+\\sqrt8=\\sqrt{18}+\\sqrt8')}</div><div>${T('=3\\sqrt2+2\\sqrt2=5\\sqrt2=\\sqrt{50}\\ \\checkmark')}</div>`), bw), bx, 210));
    return [
      { cap: `Get the ${T('x')}-term alone: subtract ${T('\\sqrt8')}. Simplify both radicals: ${T('5\\sqrt2-2\\sqrt2=3\\sqrt2')} (like radicals).`, run: (c) => show(c, l[1]) },
      { cap: `Divide by ${T('\\sqrt6')}: ${T('\\frac{3\\sqrt2}{\\sqrt6}=3\\sqrt{\\frac26}=\\frac{3}{\\sqrt3}')}.`, run: (c) => show(c, l[2]) },
      { cap: `Rationalize: ${T('\\frac{3\\sqrt3}{3}=\\sqrt3')}. So ${T('x=\\sqrt3')}.`, run: async (c) => { await show(c, l[3]); done(l[3]); } },
      { cap: `Check in the original equation: both sides are ${T('5\\sqrt2')}, so the scale balances.`, run: (c) => show(c, ck) }
    ];
  }
};

/* ====================================================================================================
 * Stand Up Break
 * ==================================================================================================== */
const coefT = (v) => (v === 1 ? '' : v === -1 ? '-' : String(v));
standup('u2l5', {
  intro: 'At your whiteboard: exact answers, simplest form, no calculator.',
  levels: {
    BEG: (R) => { // divide radicals
      const b = R.pick([2, 3, 5, 6, 7]), q = R.pick([4, 5, 7, 8, 9, 10, 12, 18, 20, 25]), kk = R.pick([1, 2, 3, 4]), t = R.pick([1, 2, 3, 5]) * R.sign(), m = kk * t;
      const [o, i] = sqf(q), q1 = `\\dfrac{${coefT(m)}\\sqrt{${b * q}}}{${kk === 1 ? '' : kk}\\sqrt{${b}}}`;
      const a = [`=${coefT(t)}\\sqrt{${q}}`];
      if (o > 1) a.push(i === 1 ? `=${t * o}` : `=${coefT(t)}(${o}\\sqrt{${i}})=${coefT(t * o)}\\sqrt{${i}}`);
      return { text: 'Divide and write in simplest form.', q: q1, a };
    },
    PRG: (R) => { // rationalize a / (m√b)
      const m = R.pick([1, 1, 2, 3]), b = R.pick([2, 3, 5, 6, 7, 8, 12, 18, 20, 27]), A = R.pick([2, 3, 4, 5, 6, 8, 9, 10, 12, 15]) * R.sign();
      const [o, i] = sqf(b), D = m * o, a = [];
      if (o > 1) a.push(`=\\dfrac{${A}}{${D}\\sqrt{${i}}}`);
      a.push(`=\\dfrac{${A}\\sqrt{${i}}}{${D === 1 ? i : `${D}(${i})`}}`);
      if (D !== 1 || gcd(A, i) > 1) a.push('=' + radQ(A, D * i, i));
      return { text: 'Rationalize the denominator and simplify.', q: `\\dfrac{${A}}{${m === 1 ? '' : m}\\sqrt{${b}}}`, a };
    },
    MAS: (R) => { // cube-root denominator
      const opt = R.pick([[2, 4, 2], [3, 9, 3], [4, 2, 2], [5, 25, 5], [9, 3, 3], [25, 5, 5], [6, 36, 6], [12, 18, 6], [18, 12, 6], [36, 6, 6]]);
      const [b, mu, kk] = opt, A = R.pick([1, 2, 3, 4, 5, 6, 8, 9, 10, 12]);
      const a = [`\\dfrac{${A}}{\\sqrt[3]{${b}}}\\cdot\\dfrac{\\sqrt[3]{${mu}}}{\\sqrt[3]{${mu}}}=\\dfrac{${coefT(A)}\\sqrt[3]{${mu}}}{\\sqrt[3]{${b * mu}}}`, `=\\dfrac{${coefT(A)}\\sqrt[3]{${mu}}}{${kk}}`];
      if (gcd(A, kk) > 1) a.push('=' + radQ(A, kk, mu, 3));
      return { text: 'Rationalize the denominator. (What times the radicand makes a perfect cube?)', q: `\\dfrac{${A}}{\\sqrt[3]{${b}}}`, a };
    }
  }
});

/* =============================== mount =============================== */
mountPizza();
export const explainers = mountExplainers({ divideRule, twoRoutes, splitBar, simplestStamp, formOfOne, twoTermNum, cubeFill, restrictions, problems });
export const _test = { sqf, radQ, DR, TR, SB, FO, TT, CF, RS };
