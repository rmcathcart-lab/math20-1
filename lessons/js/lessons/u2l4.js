/* Math 20-1 · Unit 2 · Lesson 4 — Multiplying Radicals.
 * New lesson format (2026-11-11, tools/newformat/specs/u2l4.py): the page no longer has the old warm-up or the explainers twoWays, squareTiles, splitBack, squareGrid, stretchSquash, areaFigs;
 * their code below is unused (each mount is skipped when its element is missing).
 * Warm-up (Stretch and Squash: a 6 × 6 patio rebuilt as 7 × 5, 8 × 4, 9 × 3; the top strip turns into the new column and a
 * k × k corner is left over, leading to (√10 + 1)(√10 − 1) = 9), and the explainers:
 *   multRule (factor cards; coefficients fly to one bin, radicands to the other under one root; then the perfect-square or
 *     perfect-cube factor comes out; Example 1(a)(b)(c)(e)(f) checks), twoWays (multiply first vs simplify first, side by
 *     side; Example 1(d) check), squareTiles ((k√a)² as a k × k square of tiles of area a, (k∛a)³ as a cube of small cubes;
 *     Example 2(a)–(d) checks), splitBack (6√15 run backwards: split the coefficient and the radicand; Example 2(e) check),
 *     varRadicals (the radicand broken into factor chips; pairs (triples for a cube root) jump out of the root; the
 *     restriction on a number line; Example 3 checks), distribute (arcs from the outside radical to each term; Example 4
 *     checks), foilGrid (the star: an area model whose four cells fill in, then like terms are collected; Example 5
 *     checks), squareGrid (the same model for a square: two equal middle cells, and the a² + b² trap; Example 6 checks),
 *     conjugateGrid (the middle cells are + and − tiles that cancel, leaving a rational total; Example 7 checks),
 *     stretchSquash (to scale: a square a², a b² corner cut away, the strip turned to make (a + b)(a − b)), areaFigs
 *     (Example 8's rectangle, square and triangle). Example 8's three figures are drawn on the card too.
 * Colours (kept through Unit 2): coefficients amber, radicands teal, what comes out of a root (perfect squares) burgundy;
 * cancelling tiles + green / − red; mistakes red. */
import {
  h, tex, add, box, NumberLine, stamp, stampIn, mountExplainers, pop, fadeIn, appear, sleep, tween, pulse, shake, anim,
  svgEl, place, drawIn
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const CO = '#c27a0e', RA = '#0f7f80', SQ = '#7a1f3d', RED = '#c93a33', GRN = '#12805a', BLUE = '#1f5bd6', PUR = '#7b4fc4', INK = '#1c2230', GRAY = '#9aa0ab';
const COL = { co: CO, ra: RA };
const colr = (c) => (s) => `\\textcolor{${c}}{${s}}`;
const cC = colr(CO), cR = colr(RA), cQ = colr(SQ), cX = colr(RED), cG = colr(GRN);

/* ---------- a tiny radical algebra: a term is c · (outside variables) · ᵏ√(n · inside variables) ---------- */
const VARS = (s) => { const o = {}; String(s || '').replace(/([a-z])(?:\^(\d+))?/g, (_, v, e) => { o[v] = (o[v] || 0) + (e ? +e : 1); }); return o; };
/** R(c, n, 'x^3y', k): c·ᵏ√(n x³ y); R(4) is the integer 4 */
const R = (c, n = 1, v = '', k = 2, o = '') => ({ c, n, v: VARS(v), o: VARS(o), k });
const addV = (a, b) => { const r = { ...a }; for (const x in b) r[x] = (r[x] || 0) + b[x]; return r; };
const vTex = (v) => Object.keys(v).sort().filter((x) => v[x]).map((x) => x + (v[x] > 1 ? `^{${v[x]}}` : '')).join('');
const isRad = (t) => t.n !== 1 || !!vTex(t.v);
const mul = (...ts) => ts.reduce((p, t) => ({ c: p.c * t.c, n: p.n * t.n, v: addV(p.v, t.v), o: addV(p.o, t.o), k: isRad(t) ? t.k : p.k }));
/** largest p with p^k dividing n */
const bigPow = (n, k = 2) => { let p = 1; for (let q = 2; q ** k <= n; q++) if (n % q ** k === 0) p = q; return p; };
function simp(t) {
  const p = bigPow(t.n, t.k), v = {}, o = { ...t.o };
  for (const x in t.v) { const e = t.v[x], q = Math.floor(e / t.k); if (q) o[x] = (o[x] || 0) + q; if (e % t.k) v[x] = e % t.k; }
  return { c: t.c * p, n: t.n / p ** t.k, v, o, k: t.k };
}
const rootTex = (k, inner) => (k === 2 ? `\\sqrt{${inner}}` : `\\sqrt[${k}]{${inner}}`);
const radTex = (t, col) => {
  const inner = (t.n !== 1 ? t.n : '') + vTex(t.v); if (!inner) return '';
  return rootTex(t.k, col ? `\\textcolor{${col}}{${inner}}` : inner);
};
/** coefficient text (no sign; '' for an implied 1), radical text, sign */
function tParts(t, col) {
  const r = radTex(t, col && col.ra), ov = vTex(t.o), a = Math.abs(t.c);
  const co = (a === 1 && (r || ov) ? '' : String(a)) + ov;
  return { neg: t.c < 0, co, rad: r };
}
/** a term in TeX; lead = first in a sum (no "+"); col = { co, ra } colours */
function tTex(t, lead = true, col) {
  const p = tParts(t, col);
  const body = (col && col.co && p.co ? `\\textcolor{${col.co}}{${p.co}}` : p.co) + p.rad || '1';
  return (p.neg ? '-' : lead ? '' : '+') + body;
}
const sumTex = (ts, col) => (ts.length ? ts.map((t, i) => tTex(t, i === 0, col)).join('') : '0');
const fTex = (t, col) => `\\left(${tTex(t, true, col)}\\right)`;
const binTex = (ts, col) => `\\left(${sumTex(ts, col)}\\right)`;
const key = (t) => vTex(t.o) + '|' + (isRad(t) ? t.k + ':' + t.n + vTex(t.v) : '');
function collect(ts) {
  const m = new Map();
  ts.forEach((t) => { const k = key(t); if (m.has(k)) m.get(k).c += t.c; else m.set(k, { ...t, v: { ...t.v }, o: { ...t.o } }); });
  return [...m.values()].filter((t) => t.c !== 0);
}
const same = (a, b) => tTex(a) === tTex(b);
const primes = (n) => { const f = []; for (let p = 2; p * p <= n; p++) while (n % p === 0) { f.push(p); n /= p; } if (n > 1) f.push(n); return f; };
/** the "peel" line for a raw term: co√(p²)√m → co(p)√m → simplest (null when there is nothing to take out) */
function peel(t) {
  const s = simp(t); if (same(s, t)) return null;
  const p = bigPow(t.n, t.k), m = t.n / p ** t.k, co = (Math.abs(t.c) === 1 ? '' : String(Math.abs(t.c))) + vTex(t.o), sg = t.c < 0 ? '-' : '';
  const vin = vTex(t.v);
  if (vin) return null; // variable radicands use the chip picture instead
  const sq = rootTex(t.k, p ** t.k), rest = m > 1 ? rootTex(t.k, m) : '';
  const c1 = co ? `${sg}${co}` : sg;
  const step1 = `${c1}${sq}${rest}`, step1c = `${c1}${cQ(sq)}${rest}`;
  const step2 = (co ? `${c1}(${p})` : `${sg}${p}`) + rest, step2c = (co ? `${c1}(${cQ(p)})` : `${sg}${cQ(p)}`) + rest;
  return { s, p, m, step1, step2, step1c, step2c, fin: tTex(s) };
}
/** the chain raw = step1 = step2 = simplest, without repeats (plain, or with the perfect power coloured) */
function peelChain(t, col) {
  const pe = peel(t); if (!pe) return [];
  const out = [], seen = new Set([tTex(t)]);
  [[pe.step1, pe.step1c], [pe.step2, pe.step2c], [pe.fin, pe.fin]].forEach(([a, b]) => { if (!seen.has(a)) { seen.add(a); out.push(col ? b : a); } });
  return out;
}

/* ---------- drawing helpers ---------- */
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const mkSvg = (stage, W, H) => { const s = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u2l4-svg' }, stage); s.style.left = '0px'; s.style.top = '0px'; return s; };
/** an HTML label centred (or on side pos) at a stage point */
const lab = (stage, x, y, html, cls = '', pos = 'c', gap = 0) => { const d = h('div', 'u2l4-lab ' + cls, html); stage.appendChild(d); place(d, x, y, pos, gap); return d; };
const panel = (stage, x, y, w, hh, title, cls = '') => add(stage, box(h('div', 'u2l4-panel ' + cls, title ? `<div class="u2l4-ph">${title}</div>` : ''), w, hh), x, y);
const line = (p, html, cls = '') => { const d = h('div', 'u2l4-line ' + cls, html); p.appendChild(d); return d; };
/** move an element in from (dx, dy) px away */
const flyIn = (c, el, dx, dy, ms = 650) => anim(c, el, [{ opacity: 0.4, transform: `translate(${dx}px, ${dy}px) scale(1.15)` }, { opacity: 1, transform: 'none' }], ms);
/** a ghost copy that flies from (x0, y0) to (x1, y1) and fades */
async function ghost(c, stage, x0, y0, x1, y1, html, cls = '', ms = 650) {
  const g = lab(stage, x0, y0, html, 'u2l4-ghost ' + cls);
  await anim(c, g, [{ opacity: 1, transform: 'none' }, { opacity: 0.9, transform: `translate(${(x1 - x0) * 0.85}px, ${(y1 - y0) * 0.85}px)`, offset: 0.8 }, { opacity: 0, transform: `translate(${x1 - x0}px, ${y1 - y0}px)` }], ms);
  g.remove();
}
const rect = (parent, x, y, w, hh, attrs = {}) => svgEl('rect', Object.assign({ x, y, width: w, height: hh }, attrs), parent);
const poly = (parent, pts, attrs = {}) => svgEl('polygon', Object.assign({ points: pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ') }, attrs), parent);
const ln = (parent, x1, y1, x2, y2, attrs = {}) => svgEl('line', Object.assign({ x1, y1, x2, y2, stroke: INK, 'stroke-width': 2 }, attrs), parent);
/** a big radical sign: tick at x0, bar from x1 to x2 at height y (top), bottom at yb */
function rootSign(parent, x0, x1, x2, y, yb, color = INK, idx) {
  const d = `M${x0} ${(y + yb) / 2 + 8} l8 -5 L${x0 + (x1 - x0) * 0.55} ${yb} L${x1} ${y} L${x2} ${y}`;
  const p = svgEl('path', { d, fill: 'none', stroke: color, 'stroke-width': 3.2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', class: 'bk-stroke' }, parent);
  return p;
}

/* ====================================================================================================
 * Warm-up: Stretch and Squash. A 6 × 6 patio; for k = 1, 2, 3 the top k rows turn into k new columns on the right,
 * except a k × k corner that has no room: (6 + k)(6 − k) = 36 − k².
 * ==================================================================================================== */
function mountPatio() {
  const host = document.getElementById('u2l4-patio'); if (!host) return;
  const n = 6, KMAX = 3, cs = 44, pad = 8, Wd = (n + KMAX) * cs + 2 * pad + 60, Hd = n * cs + 2 * pad;
  const svg = svgEl('svg', { viewBox: `0 0 ${Wd} ${Hd}`, class: 'u2l4-patiosvg', role: 'img', 'aria-label': 'A 6 by 6 square patio of tiles. Pick a size to rebuild it longer and narrower.' }, host);
  const X0 = pad, Y0 = pad;
  // the original outline
  rect(svg, X0, Y0, n * cs, n * cs, { fill: 'none', stroke: '#b9ad97', 'stroke-width': 2, 'stroke-dasharray': '6 5' });
  const cells = [];
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    const g = svgEl('g', { class: 'u2l4-tile' }, svg);
    rect(g, X0 + c * cs + 2, Y0 + r * cs + 2, cs - 4, cs - 4, { rx: 5 });
    cells.push({ r, c, g });
  }
  const note = svgEl('text', { x: X0 + n * cs + 14, y: Y0 + 26, class: 'u2l4-ptnote' }, svg);
  const rd = document.getElementById('u2l4-wread'), btns = [...document.querySelectorAll('#u2l4-wbtns [data-k]')];
  function set(k) {
    btns.forEach((b) => b.classList.toggle('on', +b.dataset.k === k));
    let left = 0;
    cells.forEach(({ r, c, g }) => {
      g.classList.remove('moved', 'left');
      let dx = 0, dy = 0;
      if (r < k) {
        if (c < n - k) { // the strip turns: (r, c) → column n + r, row k + c
          dx = (n + r - c) * cs; dy = (k + c - r) * cs; g.classList.add('moved');
        } else { left++; g.classList.add('left'); } // the k × k corner has no room: it stays, in red
      }
      g.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    note.textContent = '';
    note.setAttribute('x', X0 + n * cs + 10);
    note.setAttribute('y', Y0 + k * cs / 2 + 7);
    if (k) setTimeout(() => { note.textContent = `${k * k} left over`; }, 700);
    rd.innerHTML = k ? `<b>${n + k} × ${n - k} = ${(n + k) * (n - k)}</b> tiles <span class="u2l4-wleft">(${k * k} left over)</span>` : '<b>6 × 6 = 36</b> tiles';
  }
  btns.forEach((b) => b.addEventListener('click', () => set(+b.dataset.k)));
  set(0);
}

/* ====================================================================================================
 * multRule: coefficients with coefficients, radicands with radicands
 * ==================================================================================================== */
const MR = {
  demo: { f: [R(2, 6), R(5, 3)], label: T('\\left(2\\sqrt{6}\\right)\\left(5\\sqrt{3}\\right)') },
  e1a: { f: [R(1, 6), R(1, 10)], ex: '1(a)' },
  e1b: { f: [R(3, 2), R(5, 7)], ex: '1(b)' },
  e1c: { f: [R(-2, 6), R(4, 15)], ex: '1(c)' },
  e1e: { f: [R(2, 4, '', 3), R(3, 6, '', 3)], ex: '1(e)' },
  e1f: { f: [R(1, 5), R(-2, 3), R(1, 15)], ex: '1(f)' }
};
const prodTex = (fs, col) => fs.map((f) => fTex(f, col)).join('');
const multRule = {
  title: 'Coefficients together, radicands together',
  height: 440,
  choices: Object.keys(MR).map((k) => ({ v: k, label: MR[k].ex ? `Example ${MR[k].ex} check` : MR[k].label })),
  ask: (k) => `${MR[k].ex ? `<b>Example ${MR[k].ex}:</b> ` : ''}multiply and simplify ${T(prodTex(MR[k].f))}`,
  make(stage, key, ex) {
    const d = MR[key], fs = d.f, W = ex.W, kx = fs[0].k, P = mul(...fs), pe = peel(P), fin = simp(P);
    const svg = mkSvg(stage, W, ex.def.height);
    const gap = Math.min(250, (W - 120) / fs.length), cx = (i) => W / 2 + (i - (fs.length - 1) / 2) * gap, CY = 52;
    const cards = fs.map((f, i) => lab(stage, cx(i), CY, T(fTex(f, COL)), 'u2l4-fcard'));
    fs.slice(1).forEach((_, i) => lab(stage, (cx(i) + cx(i + 1)) / 2, CY, T('\\cdot'), 'u2l4-dot'));
    const BX = [W * 0.28, W * 0.72], BY = 186;
    const binL = lab(stage, BX[0], BY - 58, 'coefficients', 'u2l4-binh u2l4-binh-co'), binR = lab(stage, BX[1], BY - 58, 'radicands', 'u2l4-binh u2l4-binh-ra');
    hide(binL); hide(binR);
    rect(svg, BX[0] - 190, BY - 38, 380, 78, { rx: 14, fill: '#fff8ea', stroke: '#ecd3a6', 'stroke-width': 2, class: 'u2l4-bin', opacity: 0 });
    rect(svg, BX[1] - 190, BY - 38, 380, 78, { rx: 14, fill: '#eaf6f5', stroke: '#b6dcd9', 'stroke-width': 2, class: 'u2l4-bin', opacity: 0 });
    const bins = [...svg.querySelectorAll('.u2l4-bin')];
    const coT = fs.map((f) => (Math.abs(f.c) === 1 && f.c > 0 ? `(\\textcolor{${GRAY}}{1})` : `(${f.c})`)).join('');
    const coProd = fs.reduce((p, f) => p * f.c, 1);
    const inT = fs.map((f) => f.n).join('\\cdot');
    const radRaw = rootTex(kx, P.n);
    const coLine = lab(stage, BX[0], BY, T(cC(`${coT}=${coProd}`)), 'u2l4-binv'); hide(coLine);
    const raLine = lab(stage, BX[1], BY, T(`${rootTex(kx, cR(inT))}=${rootTex(kx, cR(P.n))}`), 'u2l4-binv'); hide(raLine);
    const together = lab(stage, W / 2, 292, T(`=${tTex(P, true, COL)}`), 'u2l4-big'); hide(together);
    const chain = peelChain(P, true); if (chain.length) chain[chain.length - 1] = `\\boldsymbol{${chain[chain.length - 1]}}`;
    const pl = pe ? lab(stage, W / 2, 360, T('=' + chain.join('=')), 'u2l4-big') : null;
    hide(pl);
    const finSt = stamp(stage, '✓', { x: W / 2 + 290, y: pe ? 360 : 292 }); hide(finSt);
    const rootWord = kx === 2 ? 'square roots' : 'cube roots';
    const sqWord = kx === 2 ? 'perfect-square' : 'perfect-cube';
    const steps = [
      { cap: `All ${rootWord}: the <b>same index</b>, so they can be multiplied.`,
        run: async (c) => { await Promise.all(cards.map((cd) => pulse(c, cd, 1.08))); } },
      { cap: `<b>Coefficients</b> together: ${T(cC(`${coT}=${coProd}`))}.${fs.some((f) => f.c === 1) ? ` A radical with no number in front has coefficient ${T('1')}.` : ''}`,
        run: async (c) => {
          await Promise.all([appear(c, bins[0], 250), show(c, binL)]);
          await Promise.all(fs.map((f, i) => ghost(c, stage, cx(i) - 30, CY, BX[0], BY, T(cC(f.c === 1 ? '1' : String(f.c))), '', 700)));
          await pop(c, coLine);
        } },
      { cap: `<b>Radicands</b> together, under one root: ${T(`${rootTex(kx, inT)}=${radRaw}`)}.`,
        run: async (c) => {
          await Promise.all([appear(c, bins[1], 250), show(c, binR)]);
          await Promise.all(fs.map((f, i) => ghost(c, stage, cx(i) + 26, CY, BX[1], BY, T(cR(String(f.n))), '', 700)));
          await pop(c, raLine);
        } },
      { cap: `Put them back together: ${T(tTex(P))}.`,
        run: async (c) => { await pop(c, together); } }
    ];
    if (pe) {
      const what = pe.m === 1 ? `${T(String(P.n))} is a perfect ${kx === 2 ? 'square' : 'cube'}: ${T(`${rootTex(kx, P.n)}=${pe.p}`)}` : `${T(String(P.n))} has the ${sqWord} factor ${T(cQ(String(pe.p ** kx)))}, and ${T(`${rootTex(kx, pe.p ** kx)}=${pe.p}`)} comes out`;
      steps.push({ cap: `Simplest form: ${what}. Answer ${T(`\\boldsymbol{${pe.fin}}`)}.`,
        run: async (c) => { await show(c, pl); await stampIn(c, finSt); } });
    } else {
      steps.push({ cap: `${T(String(P.n))}${P.n > 3 ? ` ${T('=' + primes(P.n).join('\\times'))}` : ''} has no ${sqWord} factor, so ${T(`\\boldsymbol{${tTex(P)}}`)} is already in simplest form.`,
        run: async (c) => { await stampIn(c, finSt); } });
    }
    return steps;
  }
};

/* ====================================================================================================
 * twoWays: multiply first, or simplify first
 * ==================================================================================================== */
const TW = { e1d: { a: 12, b: 27, ex: '1(d)' }, d1: { a: 24, b: 54 }, d2: { a: 8, b: 12 } };
const twoWays = {
  title: 'Two roads to the same answer',
  height: 430,
  choices: Object.keys(TW).map((k) => ({ v: k, label: TW[k].ex ? `Example ${TW[k].ex} check` : T(`\\sqrt{${TW[k].a}}\\cdot\\sqrt{${TW[k].b}}`) })),
  ask: (k) => `${TW[k].ex ? `<b>Example ${TW[k].ex}:</b> ` : ''}${T(`\\sqrt{${TW[k].a}}\\cdot\\sqrt{${TW[k].b}}`)}, two ways`,
  make(stage, k, ex) {
    const { a, b } = TW[k], W = ex.W, P = a * b, sP = simp(R(1, P)), sa = simp(R(1, a)), sb = simp(R(1, b));
    const svg = mkSvg(stage, W, ex.def.height);
    const XL = W * 0.26, XR = W * 0.74;
    ln(svg, W / 2, 20, W / 2, 330, { stroke: '#e2ddd1', 'stroke-width': 2, 'stroke-dasharray': '6 6' });
    const hL = lab(stage, XL, 30, 'Multiply first', 'u2l4-road u2l4-road-a'), hR = lab(stage, XR, 30, 'Simplify first', 'u2l4-road u2l4-road-b');
    hide(hL); hide(hR);
    const L1 = lab(stage, XL, 100, T(`\\sqrt{${a}\\cdot${b}}=\\sqrt{${P}}`), 'u2l4-mid');
    const big = lab(stage, XL, 152, `a big number to take apart`, 'u2l4-note');
    const L2 = sP.n === 1
      ? lab(stage, XL, 210, T(`${P}=${sP.c}^2,\\ \\text{so}\\ \\sqrt{${P}}=\\boldsymbol{${sP.c}}`), 'u2l4-mid')
      : lab(stage, XL, 210, T(`\\sqrt{${P}}=\\sqrt{${cQ(sP.c ** 2)}}\\sqrt{${sP.n}}=\\boldsymbol{${tTex(sP)}}`), 'u2l4-mid');
    const R1 = lab(stage, XR, 100, T(`\\sqrt{${a}}=\\sqrt{${cQ(String(sa.c ** 2))}}\\sqrt{${sa.n}}=${tTex(sa)}`), 'u2l4-mid');
    const R2 = lab(stage, XR, 152, T(`\\sqrt{${b}}=\\sqrt{${cQ(String(sb.c ** 2))}}\\sqrt{${sb.n}}=${tTex(sb)}`), 'u2l4-mid');
    const pr = mul(sa, sb), prS = simp(pr);
    const r3p = [`${tTex(sa)}\\cdot${tTex(sb)}`].concat(sa.n === sb.n ? [`${sa.c * sb.c}\\cdot${sa.n}`] : same(pr, prS) ? [] : [tTex(pr)]);
    const r3 = r3p.concat([tTex(prS)]).join('='), r3b = r3p.concat([`\\boldsymbol{${tTex(prS)}}`]).join('=');
    const R3 = lab(stage, XR, 210, T(r3b), 'u2l4-mid');
    const small = lab(stage, XR, 258, sa.n === sb.n ? T(`\\left(\\sqrt{${sa.n}}\\right)^2=${sa.n}`) + ': the radicals disappear' : 'small numbers all the way', 'u2l4-note');
    [L1, big, L2, R1, R2, R3, small].forEach(hide);
    const both = lab(stage, W / 2, 330, '', 'u2l4-both'); hide(both);
    both.innerHTML = `Same answer: ${T(`\\boldsymbol{${tTex(sP)}}`)}`;
    const st = stamp(stage, '✓', { x: W / 2 + 170, y: 330 }); hide(st);
    return [
      { cap: `<b>Multiply first:</b> one root, ${T(`\\sqrt{${a}\\cdot${b}}=\\sqrt{${P}}`)}.`, run: async (c) => { await show(c, hL); await show(c, L1); await show(c, big); } },
      { cap: sP.n === 1 ? `Is ${T(String(P))} a perfect square? Yes: ${T(`${sP.c}^2=${P}`)}. So the product is ${T(String(sP.c))}.` : `${T(String(P))} has the perfect-square factor ${T(cQ(String(sP.c ** 2)))}: ${T(`\\sqrt{${P}}=${tTex(sP)}`)}.`,
        run: (c) => show(c, L2) },
      { cap: `<b>Simplify first:</b> ${T(`\\sqrt{${a}}=${tTex(sa)}`)} and ${T(`\\sqrt{${b}}=${tTex(sb)}`)}.`, run: async (c) => { await show(c, hR); await show(c, R1); await show(c, R2); } },
      { cap: `Then multiply: ${T(r3)}.`, run: async (c) => { await show(c, R3); await show(c, small); } },
      { cap: `Both roads give ${T(tTex(sP))}. Simplifying first keeps the numbers <b>small</b>.`, run: async (c) => { await pop(c, both); await stampIn(c, st); } }
    ];
  }
};

/* ====================================================================================================
 * squareTiles: (k√a)² = k²·a as a square of tiles; (k∛a)³ = k³·a as a block of cubes
 * ==================================================================================================== */
const STL = {
  e2a: { k: 1, a: 7, idx: 2, ex: '2(a)' },
  e2b: { k: 5, a: 3, idx: 2, ex: '2(b)' },
  e2c: { k: 2, a: 6, idx: 2, neg: true, ex: '2(c)' },
  e2d: { k: 2, a: 3, idx: 3, ex: '2(d)' },
  demo: { k: 3, a: 5, idx: 2 }
};
const stlTex = (d) => `${d.neg ? '-' : ''}\\left(${d.k > 1 ? d.k : ''}${rootTex(d.idx, d.a)}\\right)^${d.idx}`;
const squareTiles = {
  title: 'A power undoes the root',
  height: 440,
  choices: Object.keys(STL).map((k) => ({ v: k, label: STL[k].ex ? `Example ${STL[k].ex} check` : T(stlTex(STL[k])) })),
  ask: (k) => `${STL[k].ex ? `<b>Example ${STL[k].ex}:</b> ` : ''}simplify ${T(stlTex(STL[k]))}`,
  make(stage, key, ex) {
    const d = STL[key], { k, a, idx } = d, W = ex.W, svg = mkSvg(stage, W, ex.def.height), tot = k ** idx * a, val = d.neg ? -tot : tot;
    const pn = panel(stage, W - 380, 40, 360, 330, 'Working');
    const side = `${k > 1 ? k : ''}${rootTex(idx, a)}`, one = rootTex(idx, a);
    const steps = [];
    if (idx === 2) {
      const S = 300, X = 70, Y = 50, s = S / k;
      const outline = rect(svg, X, Y, S, S, { fill: 'none', stroke: INK, 'stroke-width': 3, opacity: 0 });
      const tiles = [];
      for (let r = 0; r < k; r++) for (let q = 0; q < k; q++) {
        const g = svgEl('g', { opacity: 0 }, svg);
        rect(g, X + q * s + 2, Y + r * s + 2, s - 4, s - 4, { rx: 6, fill: '#d9efed', stroke: RA, 'stroke-width': 2 });
        tiles.push(g);
      }
      const tlabs = tiles.map((_, i) => { const r = Math.floor(i / k), q = i % k; return hide(lab(stage, X + (q + 0.5) * s, Y + (r + 0.5) * s, T(cR(String(a))), k > 3 ? 'u2l4-tl-s' : 'u2l4-tl')); });
      const oneS = hide(lab(stage, X + s / 2, Y + s + 8, T(one), 'u2l4-side', 's')), oneL = hide(lab(stage, X - 8, Y + s / 2, T(one), 'u2l4-side', 'w'));
      const bot = hide(lab(stage, X + S / 2, Y + S + 10, T(side), 'u2l4-side u2l4-side-b', 's')), lef = hide(lab(stage, X - 10, Y + S / 2, T(side), 'u2l4-side u2l4-side-b', 'w'));
      const count = hide(lab(stage, X + S + 18, Y + 20, '', 'u2l4-count', 'e'));
      steps.push({ cap: `One tile: a square with side ${T(one)} has area ${T(cR(String(a)))}. So ${T(`\\left(${one}\\right)^2=${a}`)}.`,
        run: async (c) => { await appear(c, tiles[0], 350); await Promise.all([pop(c, tlabs[0]), show(c, oneS), show(c, oneL)]); await show(c, line(pn, T(`\\left(${one}\\right)^2=${a}`))); } });
      if (k > 1) {
        steps.push({ cap: `A side of ${T(side)} is <b>${k} tiles</b> long: ${T(`${k}\\times${one}`)}.`,
          run: async (c) => { oneS.style.opacity = 0; oneL.style.opacity = 0; await appear(c, outline, 300); await Promise.all([show(c, bot), show(c, lef)]); } });
        steps.push({ cap: `${T(`${k}\\times${k}=${cC(k * k)}`)} tiles. That is the coefficient squared: ${T(`${cC(k)}^2=${cC(k * k)}`)}.`,
          run: async (c) => {
            for (let i = 1; i < tiles.length; i++) { appear(c, tiles[i], 220); pop(c, tlabs[i], 220); if (!c.fast) await sleep(c, Math.max(30, 300 / tiles.length * 3)); }
            await sleep(c, 250); count.innerHTML = `${k * k} tiles`; await pop(c, count);
            await show(c, line(pn, T(`${stlTex({ ...d, neg: false })}=${cC(k)}^2\\left(${one}\\right)^2`)));
          } });
        steps.push({ cap: `Each tile has area ${T(cR(a))}: ${T(`${cC(k * k)}\\times${cR(a)}=${tot}`)}.`,
          run: async (c) => { count.innerHTML = `${k * k} × ${a} = ${tot}`; await pulse(c, count, 1.1); await show(c, line(pn, T(`=${k * k}(${a})=${d.neg ? tot : '\\boldsymbol{' + tot + '}'}`))); } });
      }
    } else {
      // isometric block of k³ small cubes
      const e = 84, X0 = 230, Y0 = 50, cx = e * 0.866, sy = e * 0.5;
      const P = (x, y, z) => [X0 + (x - y) * cx, Y0 + (x + y) * sy - z * e + 2 * e];
      const cubes = [];
      const order = []; for (let x = 0; x < k; x++) for (let y = 0; y < k; y++) for (let z = 0; z < k; z++) order.push([x, y, z]);
      order.sort((p, q) => (p[0] + p[1]) - (q[0] + q[1]) || p[2] - q[2]);
      order.forEach(([x, y, z]) => {
        const g = svgEl('g', { opacity: 0 }, svg), st = { stroke: '#0b5e5f', 'stroke-width': 2, 'stroke-linejoin': 'round' };
        poly(g, [P(x, y, z + 1), P(x + 1, y, z + 1), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)], { fill: '#d9efed', ...st });
        poly(g, [P(x + 1, y, z), P(x + 1, y + 1, z), P(x + 1, y + 1, z + 1), P(x + 1, y, z + 1)], { fill: '#9fd3cf', ...st });
        poly(g, [P(x, y + 1, z), P(x + 1, y + 1, z), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)], { fill: '#6fb9b4', ...st });
        cubes.push({ g, x, y, z });
      });
      // the front-top cube is drawn last; label it
      const first = cubes.find((q) => q.x === k - 1 && q.y === k - 1 && q.z === k - 1) || cubes[cubes.length - 1];
      const [fx, fy] = P(first.x + 0.5, first.y + 0.5, first.z + 1);
      const cl = hide(lab(stage, fx, fy, T(cR(a)), 'u2l4-tl'));
      const [ex1, ey1] = P(k, k * 0.5, 0);
      const edge = hide(lab(stage, ex1 + 14, ey1 + 8, T(side), 'u2l4-side u2l4-side-b', 'e'));
      const [sx1, sy1] = P(first.x + 1, first.y + 0.5, first.z + 0.5);
      const edge1 = hide(lab(stage, sx1 + 10, sy1, T(one), 'u2l4-side', 'e'));
      const count = hide(lab(stage, 24, 30, '', 'u2l4-count', 'e'));
      steps.push({ cap: `One small cube: edge ${T(one)} has volume ${T(cR(a))}. So ${T(`\\left(${one}\\right)^3=${a}`)}.`,
        run: async (c) => {
          // show just the front-top-right cube
          await appear(c, first.g, 350); await Promise.all([pop(c, cl), show(c, edge1)]);
          await show(c, line(pn, T(`\\left(${one}\\right)^3=${a}`)));
        } });
      steps.push({ cap: `An edge of ${T(side)} is <b>${k} cubes</b> long, so the block holds ${T(`${k}\\times${k}\\times${k}=${cC(k ** 3)}`)} cubes.`,
        run: async (c) => {
          edge1.style.opacity = 0;
          for (const q of cubes) if (q !== first) { appear(c, q.g, 240); if (!c.fast) await sleep(c, 110); }
          await sleep(c, 250); await show(c, edge); count.innerHTML = `${k ** 3} cubes`; await pop(c, count);
          await show(c, line(pn, T(`${stlTex(d)}=${cC(k)}^3\\left(${one}\\right)^3`)));
        } });
      steps.push({ cap: `Each cube has volume ${T(cR(a))}: ${T(`${cC(k ** 3)}\\times${cR(a)}=${tot}`)}.`,
        run: async (c) => { count.innerHTML = `${k ** 3} × ${a} = ${tot}`; await pulse(c, count, 1.1); await show(c, line(pn, T(`=${k ** 3}(${a})=\\boldsymbol{${tot}}`))); } });
    }
    if (d.neg) {
      steps.push({ cap: `The minus sign is <b>outside</b> the bracket, so it is not squared: ${T(`${stlTex(d)}=-${tot}`)}.`,
        run: async (c) => { const l = line(pn, T(`${stlTex(d)}=\\boldsymbol{-${tot}}`), 'u2l4-key-line'); await show(c, l); } });
    }
    if (k === 1) steps[0].cap = `A square with side ${T(one)} has area ${T(cR(String(a)))}: squaring undoes the square root. ${T(`\\left(${one}\\right)^2=\\boldsymbol{${a}}`)}.`;
    return steps;
  }
};

/* ====================================================================================================
 * splitBack: write c√r as a product of two mixed radicals
 * ==================================================================================================== */
const SB = { e2e: { c: 6, r: 15, ex: '2(e)' }, demo: { c: 12, r: 10 } };
const splitBack = {
  title: 'Run it backwards: split the coefficient and the radicand',
  height: 410,
  choices: Object.keys(SB).map((k) => ({ v: k, label: SB[k].ex ? `Example ${SB[k].ex} check` : T(`${SB[k].c}\\sqrt{${SB[k].r}}`) })),
  ask: (k) => `${SB[k].ex ? `<b>Example ${SB[k].ex}:</b> ` : ''}write ${T(`${SB[k].c}\\sqrt{${SB[k].r}}`)} as a product of two mixed radicals`,
  make(stage, key, ex) {
    const { c: C, r: Rr } = SB[key], W = ex.W;
    const divs = []; for (let p = 2; p < C; p++) if (C % p === 0) divs.push([p, C / p]);
    const q = primes(Rr)[0], q2 = Rr / q;
    const combos = divs.map(([p1, p2]) => [R(p1, q), R(p2, q2)]).slice(0, 2);
    combos.push([R(C, q2), R(1, q)]);
    const top = lab(stage, W / 2, 40, T(`${cC(C)}\\sqrt{${cR(Rr)}}`), 'u2l4-big');
    const t1 = hide(lab(stage, W * 0.3, 118, T(`${cC(C)}=${divs.filter(([a, b]) => a <= b).map(([a, b]) => `${a}\\times${b}`).join('=')}`), 'u2l4-mid'));
    const t2 = hide(lab(stage, W * 0.7, 118, T(`${cR(Rr)}=${q}\\times${q2}`), 'u2l4-mid'));
    const hdL = hide(lab(stage, W * 0.3, 84, 'split the coefficient', 'u2l4-binh u2l4-binh-co')), hdR = hide(lab(stage, W * 0.7, 84, 'split the radicand', 'u2l4-binh u2l4-binh-ra'));
    const rows = combos.map((cb, i) => hide(lab(stage, W / 2, 196 + i * 58, T(`${cC(C)}\\sqrt{${cR(Rr)}}=${cb.map((t) => fTex(t, COL)).join('')}`), 'u2l4-mid u2l4-combo')));
    const chk = hide(lab(stage, W / 2, 380, '', 'u2l4-note'));
    const cb0 = combos[0];
    chk.innerHTML = `Check: ${T(`${cC(cb0[0].c)}\\cdot${cC(cb0[1].c)}=${cC(C)}`)} and ${T(`${cR(cb0[0].n)}\\cdot${cR(cb0[1].n)}=${cR(Rr)}`)}`;
    const st = stamp(stage, '✓', { x: W / 2 + 270, y: 380 }); hide(st);
    return [
      { cap: `Multiplying puts coefficients together and radicands together, so <b>undo</b> it: split each one.`, run: (c) => pulse(c, top, 1.08) },
      { cap: `Split the coefficient: ${T(`${C}=${divs[0][0]}\\times${divs[0][1]}`)}.${divs.length > 1 ? ' (Other splits work too.)' : ''}`, run: async (c) => { await show(c, hdL); await show(c, t1); } },
      { cap: `Split the radicand: ${T(`${Rr}=${q}\\times${q2}`)}.`, run: async (c) => { await show(c, hdR); await show(c, t2); } },
      { cap: `Give each radical one of each: ${T(cb0.map((t) => fTex(t)).join(''))}.`, run: (c) => pop(c, rows[0]) },
      { cap: `Split the coefficient another way: ${T(combos[1].map((t) => fTex(t)).join(''))}.`, run: (c) => pop(c, rows[1]) },
      { cap: `Or split ${T(`${C}=${C}\\times1`)}: ${T(combos[2].map((t) => fTex(t)).join(''))}.`, run: (c) => pop(c, rows[2]) },
      { cap: `Check by multiplying back: coefficients give ${T(String(C))}, radicands give ${T(String(Rr))}.`, run: async (c) => { await show(c, chk); await stampIn(c, st); } }
    ];
  }
};

/* ====================================================================================================
 * varRadicals: the radicand as factor chips; pairs (or triples) jump out of the root; restrictions
 * ==================================================================================================== */
const VR = {
  e3a: { f: [R(3, 1, 'x'), R(5, 1, 'y')], ex: '3(a)' },
  e3b: { f: [R(2, 6, 'a'), R(1, 10, 'a')], ex: '3(b)' },
  e3c: { f: [R(1, 4, 'm^2', 3), R(1, 6, 'm^2', 3)], ex: '3(c)' },
  e3d: { f: [R(1, 2, 'x^3'), R(3, 8, 'x')], ex: '3(d)' }
};
const varRadicals = {
  title: 'Pairs escape the square root',
  height: 450,
  choices: Object.keys(VR).map((k) => ({ v: k, label: `Example ${VR[k].ex} check` })),
  ask: (k) => `<b>Example ${VR[k].ex}:</b> multiply and simplify ${T(prodTex(VR[k].f))}; state the restrictions`,
  make(stage, key, ex) {
    const d = VR[key], fs = d.f, W = ex.W, kx = fs[0].k, P = mul(...fs), S = simp(P), svg = mkSvg(stage, W, ex.def.height);
    const vars = Object.keys(P.v).sort();
    const chips = [...primes(P.n).map(String), ...vars.flatMap((v) => Array(P.v[v]).fill(v))];
    const groups = []; // [{ base, idx: [chip indices] }]
    const seen = {};
    chips.forEach((ch, i) => { (seen[ch] = seen[ch] || []).push(i); });
    Object.keys(seen).forEach((b) => { const ids = seen[b]; for (let j = 0; j + kx <= ids.length; j += kx) groups.push({ base: b, ids: ids.slice(j, j + kx) }); });
    groups.sort((g1, g2) => g1.ids[0] - g2.ids[0]);
    const top = lab(stage, W / 2, 34, T(`${prodTex(fs, COL)}=${tTex(P, true, COL)}`), 'u2l4-big');
    const cw = 54, n = chips.length, RX1 = W / 2 - (n * cw) / 2 + 40, chipX = (i) => RX1 + 14 + (i + 0.5) * cw, CY = 190;
    const rs = rootSign(svg, RX1 - 46, RX1 - 6, RX1 + n * cw + 34, CY - 44, CY + 36, INK); rs.style.opacity = 0;
    const idxL = kx === 3 ? hide(lab(stage, RX1 - 40, CY - 16, T('3'), 'u2l4-idx')) : null;
    const chipEls = chips.map((ch, i) => hide(lab(stage, chipX(i), CY, T(/[a-z]/.test(ch) ? ch : cR(ch)), 'u2l4-chip' + (/[a-z]/.test(ch) ? ' u2l4-chip-v' : ''))));
    // brackets under each group
    const brk = groups.map((g) => { const x0 = chipX(g.ids[0]) - 22, x1 = chipX(g.ids[g.ids.length - 1]) + 22, y = CY + 30; const p = svgEl('path', { d: `M${x0} ${y} q0 10 10 10 L${x1 - 10} ${y + 10} q10 0 10 -10`, fill: 'none', stroke: SQ, 'stroke-width': 3, 'stroke-linecap': 'round', class: 'bk-stroke' }, svg); p.style.opacity = 0; return p; });
    // outside slots, right to left before the root sign
    const outs = []; if (Math.abs(P.c) !== 1 || !groups.length) outs.push({ tex: cC(String(P.c)), co: true });
    groups.forEach((g) => outs.push({ tex: cQ(g.base) }));
    const outX = (j) => RX1 - 64 - (outs.length - 1 - j) * 50;
    const outEls = outs.map((o, j) => (o.co ? lab(stage, outX(j), CY, T(o.tex), 'u2l4-chip u2l4-chip-co') : hide(lab(stage, outX(j), CY, T(o.tex), 'u2l4-chip u2l4-chip-out'))));
    if (outs[0] && outs[0].co) hide(outEls[0]);
    const res = hide(lab(stage, W / 2, 290, T(`=\\boldsymbol{${tTex(S)}}`), 'u2l4-big'));
    const restr = vars.length && kx === 2;
    const restrTex = vars.map((v) => `${v}\\ge0`).join(',\\ ');
    const nls = [];
    const nlW = Math.min(360, (W - 80) / Math.max(1, vars.length) - 30);
    (vars.length ? vars : ['x']).forEach((v, i) => {
      const N = new NumberLine(stage, { x: W / 2 - (vars.length * (nlW + 30)) / 2 + i * (nlW + 30), y: 330, width: nlW, height: 90, min: -4, max: 4, step: 1, labelStep: 2 });
      N.el.style.opacity = 0; nls.push({ N, v });
    });
    const rLab = hide(lab(stage, W / 2, 438, '', 'u2l4-note'));
    const groupWord = kx === 2 ? 'pair' : 'group of three';
    const steps = [
      { cap: `Multiply: coefficients together, radicands together: ${T(tTex(P))}.`, run: (c) => pulse(c, top, 1.05) },
      { cap: `Break the radicand into factors: ${T(`${(P.n !== 1 ? P.n : '') + vTex(P.v)}=${chips.join('\\cdot')}`)}.`,
        run: async (c) => { await drawIn(rs, 450, c); rs.style.opacity = 1; if (idxL) await show(c, idxL); if (outs[0] && outs[0].co) await show(c, outEls[0]); for (const e of chipEls) { pop(c, e, 260); if (!c.fast) await sleep(c, 70); } await sleep(c, 200); } }
    ];
    if (groups.length) {
      steps.push({ cap: `Each ${groupWord} of equal factors is a perfect ${kx === 2 ? 'square' : 'cube'}: ${groups.map((g) => T(`${rootTex(kx, Array(kx).fill(g.base).join('\\cdot'))}=${g.base}`)).slice(0, 3).join(', ')}${groups.length > 3 ? ', …' : ''}.`,
        run: async (c) => { for (const b of brk) { b.style.opacity = 1; await drawIn(b, 300, c); } } });
      steps.push({ cap: `One factor from each ${groupWord} comes <b>out</b> of the root.`,
        run: async (c) => {
          const off = outs[0] && outs[0].co ? 1 : 0;
          await Promise.all(groups.map(async (g, j) => {
            const el = outEls[j + off], gx = (chipX(g.ids[0]) + chipX(g.ids[g.ids.length - 1])) / 2;
            await Promise.all(g.ids.map((i) => anim(c, chipEls[i], [{ opacity: 1 }, { opacity: 0.18 }], 420)));
            await flyIn(c, el, gx - outX(j + off), 0, 700);
          }));
          brk.forEach((b) => (b.style.opacity = 0.25));
        } });
    } else {
      steps.push({ cap: `No two factors are the same: nothing comes out. ${T(tTex(P))} is in simplest form.`, run: (c) => Promise.all(chipEls.map((e) => pulse(c, e, 1.1))) });
    }
    steps.push({ cap: `Outside: ${T(outs.map((o) => o.tex).join('\\cdot'))}${S.n !== 1 || vTex(S.v) ? `; inside: ${T(radTex(S))}` : '; nothing is left inside'}. So ${T(`\\boldsymbol{${tTex(S)}}`)}.`,
      run: (c) => pop(c, res) });
    if (restr) {
      steps.push({ cap: `Even index: every radicand in the question must be ${T('\\ge0')}, so ${T(restrTex)}.`,
        run: async (c) => {
          for (const { N, v } of nls) {
            N.el.style.opacity = 1; await appear(c, N.el, 250);
            const iv = N.interval(0, Infinity, { color: RA }); await drawIn(iv, 600, c);
            N.mark(0, T(`${v}\\ge0`), { pos: 'n', lift: 10 });
          }
          rLab.innerHTML = `A negative ${vars.length > 1 ? 'value' : T(vars[0])} would put a negative under the square root.`; await show(c, rLab);
        } });
    } else if (kx === 3) {
      steps.push({ cap: `Cube roots of negatives exist (${T('\\sqrt[3]{-8}=-2')}), so there is <b>no restriction</b>.`,
        run: async (c) => {
          const { N, v } = nls[0]; N.el.style.opacity = 1; await appear(c, N.el, 250);
          const iv = N.interval(-Infinity, Infinity, { color: PUR }); await drawIn(iv, 600, c);
          N.mark(0, T(`\\text{any } ${v}`), { pos: 'n', lift: 10 });
        } });
    }
    return steps;
  }
};

/* ====================================================================================================
 * distribute: arcs from the outside radical to every term
 * ==================================================================================================== */
const DS = {
  demo: { o: R(1, 5), t: [R(1, 10), R(2)] },
  e4a: { o: R(1, 3), t: [R(1, 6), R(4)], ex: '4(a)' },
  e4b: { o: R(2, 5), t: [R(3, 10), R(-1, 5), R(1, 15)], ex: '4(b)' },
  e4c: { o: R(1, 1, 'x'), t: [R(1, 1, 'x'), R(3, 1, 'xy')], ex: '4(c)' }
};
const dsTex = (d) => `${tTex(d.o)}${binTex(d.t)}`;
const distribute = {
  title: 'Multiply the outside radical by every term',
  height: 440,
  choices: Object.keys(DS).map((k) => ({ v: k, label: DS[k].ex ? `Example ${DS[k].ex} check` : T(dsTex(DS[k])) })),
  ask: (k) => `${DS[k].ex ? `<b>Example ${DS[k].ex}:</b> ` : ''}expand and simplify ${T(dsTex(DS[k]))}`,
  make(stage, key, ex) {
    const d = DS[key], W = ex.W, n = d.t.length, svg = mkSvg(stage, W, ex.def.height);
    const gap = Math.min(230, (W - 260) / n), X0 = W / 2 - ((n - 1) * gap) / 2 - 60, tx = (i) => X0 + 150 + i * gap, Y = 110;
    const oEl = lab(stage, X0, Y, T(cX(tTex(d.o))), 'u2l4-big u2l4-outer');
    lab(stage, tx(0) - 72, Y, '(', 'u2l4-paren'); lab(stage, tx(n - 1) + 72, Y, ')', 'u2l4-paren');
    const tEls = d.t.map((t, i) => lab(stage, tx(i), Y, T(tTex(t, i === 0)), 'u2l4-big'));
    const raws = d.t.map((t) => mul(d.o, t)), sims = raws.map(simp), fin = collect(sims);
    const COLS = [BLUE, PUR, GRN];
    const arcs = d.t.map((_, i) => {
      const x1 = X0 + 4, x2 = tx(i), yA = Y - 30, hgt = 26 + i * 16;
      const p = svgEl('path', { d: `M${x1} ${yA} C${x1 + 20} ${yA - hgt * 1.6} ${x2 - 20} ${yA - hgt * 1.6} ${x2} ${yA}`, fill: 'none', stroke: COLS[i], 'stroke-width': 3, 'stroke-linecap': 'round', class: 'bk-stroke' }, svg);
      p.style.opacity = 0; return p;
    });
    const rawEls = raws.map((r, i) => hide(lab(stage, tx(i), Y + 80, T(tTex(r, i === 0)), 'u2l4-mid', 'c')));
    const simEls = sims.map((s, i) => hide(lab(stage, tx(i), Y + 150, T(tTex(s, i === 0)), 'u2l4-mid u2l4-simp', 'c')));
    const eqs = [hide(lab(stage, X0 + 40, Y + 80, T('='), 'u2l4-mid')), hide(lab(stage, X0 + 40, Y + 150, T('='), 'u2l4-mid'))];
    const finEl = hide(lab(stage, W / 2, Y + 230, T(`=\\boldsymbol{${sumTex(fin)}}`), 'u2l4-big'));
    const anyLike = fin.length < sims.length;
    const steps = d.t.map((t, i) => ({
      cap: `${i === 0 ? 'Multiply' : i === n - 1 ? 'And' : 'Then'} ${T(tTex(d.o))} by the ${['first', 'second', 'third'][i]} term: ${T(`${tTex(d.o)}\\cdot${t.c < 0 ? fTex(t) : tTex(t)}=${tTex(raws[i])}`)}.`,
      run: async (c) => {
        arcs[i].style.opacity = 1; await drawIn(arcs[i], 500, c);
        if (i === 0) await show(c, eqs[0]);
        await Promise.all([pulse(c, tEls[i], 1.1), pop(c, rawEls[i])]);
      }
    }));
    const changed = sims.some((s, i) => !same(s, raws[i]));
    if (changed) steps.push({
      cap: `Simplify each product: ${sims.map((s, i) => (same(s, raws[i]) ? null : T(`${tTex(raws[i])}=${tTex(s)}`))).filter(Boolean).join(', ')}.`,
      run: async (c) => { await show(c, eqs[1]); for (const e of simEls) await pop(c, e, 280); }
    });
    steps.push({
      cap: anyLike ? `Combine like radicals: ${T(`\\boldsymbol{${sumTex(fin)}}`)}.` : `No like radicals to combine, so the answer is ${T(`\\boldsymbol{${sumTex(fin)}}`)}.`,
      run: (c) => pop(c, finEl)
    });
    if (key === 'e4c') steps.push({
      cap: `Restrictions: every radicand must be ${T('\\ge0')}. ${T('\\sqrt{x}')} needs ${T('x\\ge0')}, then ${T('\\sqrt{xy}')} needs ${T('y\\ge0')}.`,
      run: async (c) => { const r = lab(stage, W / 2, Y + 290, T('x\\ge0,\\ y\\ge0'), 'u2l4-mid u2l4-restr'); await pop(c, r); }
    });
    return steps;
  }
};

/* ====================================================================================================
 * the area model (the star): foilGrid, squareGrid, conjugateGrid share one engine
 * ==================================================================================================== */
const FG = {
  demo: { a: [R(2), R(1, 3)], b: [R(1), R(1, 3)] },
  e5a: { a: [R(3), R(1, 2)], b: [R(5), R(-2, 2)], ex: '5(a)' },
  e5b: { a: [R(2, 3), R(1, 5)], b: [R(1, 3), R(-4, 5)], ex: '5(b)' },
  e5c: { a: [R(1, 6), R(-1, 2)], b: [R(1, 3), R(2, 2)], ex: '5(c)' }
};
const SQG = {
  demo: { a: [R(1), R(1, 2)] },
  e6a: { a: [R(1, 5), R(3)], ex: '6(a)' },
  e6b: { a: [R(2, 7), R(-1, 3)], ex: '6(b)' },
  e6c: { a: [R(1, 1, 'x'), R(-2, 1, 'y')], ex: '6(c)' }
};
const CJG = {
  e7a: { a: [R(1, 7), R(2)], ex: '7(a)' },
  e7b: { a: [R(3, 2), R(-1, 5)], ex: '7(b)' },
  e7c: { a: [R(4), R(2, 6)], ex: '7(c)' },
  e7d: { a: [R(1, 1, 'a'), R(3, 1, 'b')], ex: '7(d)' },
  demo: { a: [R(1, 6), R(1)] }
};
Object.values(SQG).forEach((d) => { d.b = d.a; });
Object.values(CJG).forEach((d) => { d.b = [d.a[0], { ...d.a[1], c: -d.a[1].c }]; });
const neg = (t) => ({ ...t, c: -t.c });
/** a term ready for ^2: brackets round radicals, negatives and variables */
const pw = (t) => (isRad(t) || t.c < 0 || vTex(t.o) ? fTex(t) : tTex(t));
const approx = (t) => (vTex(t.v) || vTex(t.o) ? 1 : Math.abs(t.c) * Math.pow(t.n, 1 / t.k));
const gridQ = (d, mode) => (mode === 'square' ? `${binTex(d.a)}^2` : `${binTex(d.a)}${binTex(d.b)}`);
const LIKE = ['#fde7c2', '#d8ecfb', '#e6dcf7', '#d7f0e3'];
function gridDef(DATA, mode, title) {
  return {
    title,
    height: 450,
    choices: Object.keys(DATA).map((k) => ({ v: k, label: DATA[k].ex ? `Example ${DATA[k].ex} check` : T(gridQ(DATA[k], mode)) })),
    ask: (k) => `${DATA[k].ex ? `<b>Example ${DATA[k].ex}:</b> ` : ''}${mode === 'conj' ? `multiply ${T(sumTex(DATA[k].a))} by its conjugate` : `expand and simplify ${T(gridQ(DATA[k], mode))}`}`,
    make(stage, kk, ex) {
      const d = DATA[kk], { a, b } = d, W = ex.W, svg = mkSvg(stage, W, ex.def.height);
      // a across the top (columns), b down the side (rows); cell (r, q) = a[q] · b[r]
      const GW = Math.min(470, W - 420), GH = 236, X = 170, Y = 64;
      const fr = (ts) => { const v0 = approx(ts[0]), v1 = approx(ts[1]); return Math.max(0.32, Math.min(0.68, v0 / (v0 + v1))); };
      const cw = [GW * fr(a), GW * (1 - fr(a))], chh = [GH * fr(b), GH * (1 - fr(b))];
      const cxs = [X, X + cw[0]], cys = [Y, Y + chh[0]];
      const order = [[0, 0], [1, 0], [0, 1], [1, 1]]; // [r, q]: F (a0 b0), O (a0 b1), I (a1 b0), L (a1 b1)
      const raw = order.map(([r, q]) => mul(a[q], b[r])), sim = raw.map(simp), fin = collect(sim);
      const cellsG = svgEl('g', { opacity: 0 }, svg);
      const cellBg = order.map(([r, q]) => rect(cellsG, cxs[q], cys[r], cw[q], chh[r], { fill: '#fff', stroke: 'none' }));
      const frame = svgEl('g', { opacity: 0 }, svg);
      rect(frame, X, Y, GW, GH, { fill: 'none', stroke: INK, 'stroke-width': 3, rx: 2 });
      ln(frame, X + cw[0], Y, X + cw[0], Y + GH, { 'stroke-width': 2.5 }); ln(frame, X, Y + chh[0], X + GW, Y + chh[0], { 'stroke-width': 2.5 });
      const topL = a.map((t, q) => hide(lab(stage, cxs[q] + cw[q] / 2, Y - 10, T(cR(tTex(t, true))), 'u2l4-hdr', 'n')));
      const sideL = b.map((t, r) => hide(lab(stage, X - 12, cys[r] + chh[r] / 2, T(cR(tTex(t, true))), 'u2l4-hdr', 'w')));
      const cellRaw = order.map(([r, q], i) => hide(lab(stage, cxs[q] + cw[q] / 2, cys[r] + chh[r] / 2 - (same(raw[i], sim[i]) ? 0 : 18), T(tTex(raw[i])), same(raw[i], sim[i]) ? 'u2l4-cell' : 'u2l4-cell-raw')));
      const cellSim = order.map(([r, q], i) => (same(raw[i], sim[i]) ? null : hide(lab(stage, cxs[q] + cw[q] / 2, cys[r] + chh[r] / 2 + 16, T('=' + tTex(sim[i])), 'u2l4-cell'))));
      const cellMain = (i) => cellSim[i] || cellRaw[i];
      const L1 = hide(lab(stage, X - 40, Y + GH + 46, T(`=${sumTex(sim)}`), 'u2l4-mid', 'e'));
      const L2 = hide(lab(stage, X - 40, Y + GH + 100, T(`=\\boldsymbol{${sumTex(fin)}}`), 'u2l4-big', 'e'));
      const RX = X + GW + 30, RW = W - RX - 16;
      const steps = [];
      const qTex = gridQ(d, mode);
      steps.push({
        cap: mode === 'square' ? `${T(qTex)} means ${T(`${binTex(a)}${binTex(a)}`)}. One copy across the top, one down the side.`
          : mode === 'conj' ? `The conjugate of ${T(sumTex(a))} is ${T(sumTex(b))}: same terms, opposite sign. One across the top, one down the side.`
            : `First binomial across the top, second down the side. Each cell is a <b>term × term</b> product.`,
        run: async (c) => { await Promise.all([appear(c, cellsG, 300), appear(c, frame, 300)]); await Promise.all([...topL, ...sideL].map((e) => show(c, e))); }
      });
      const names = ['First', 'Outer', 'Inner', 'Last'];
      const cellCap = (i) => { const [r, q] = order[i]; return `${T(`${fTex(a[q])}${fTex(b[r])}=${tTex(raw[i])}${same(raw[i], sim[i]) ? '' : '=' + tTex(sim[i])}`)}`; };
      const fillCell = async (c, i) => {
        await anim(c, cellBg[i], [{ fill: '#fff' }, { fill: '#f6f5f1' }], 250);
        await pop(c, cellRaw[i], 320); if (cellSim[i]) await fadeIn(c, cellSim[i], 300);
      };
      if (mode === 'foil') {
        order.forEach((_, i) => steps.push({ cap: `<b>${names[i]}:</b> ${cellCap(i)}.`, run: (c) => fillCell(c, i) }));
      } else if (mode === 'square') {
        steps.push({ cap: `The corner cells are <b>squares</b>: ${cellCap(0)} and ${cellCap(3)}.`, run: async (c) => { await fillCell(c, 0); await fillCell(c, 3); } });
        steps.push({ cap: `The two middle cells are the <b>same</b>: ${cellCap(1)} twice. That is the ${T('2ab')}.`, run: async (c) => { await fillCell(c, 1); await fillCell(c, 2); } });
        // the trap
        const trapG = svgEl('g', { opacity: 0 }, svg);
        [1, 2].forEach((i) => { const [r, q] = order[i]; rect(trapG, cxs[q] + 5, cys[r] + 5, cw[q] - 10, chh[r] - 10, { fill: 'none', stroke: RED, 'stroke-width': 3, 'stroke-dasharray': '8 6', rx: 6 }); });
        const wrong = sumTex(collect([sim[0], sim[3]]));
        const trap = hide(lab(stage, RX + RW / 2, Y + 70, `${T(`${pw(a[0])}^2+${pw(a[1])}^2`)}<br>only gives ${T(wrong)}`, 'u2l4-trap'));
        const trapSt = stamp(stage, '✗', { ok: false, x: RX + RW / 2, y: Y + 160 }); hide(trapSt);
        steps.push({ cap: `The trap: ${T(`(a+b)^2\\ne a^2+b^2`)}. Squaring each term alone gives ${T(wrong)}: it <b>forgets</b> the two middle cells.`,
          run: async (c) => { await appear(c, trapG, 300); await show(c, trap); await stampIn(c, trapSt); } });
        steps.push({ cap: `Add all four cells: ${T(`${sumTex(sim)}`)}.`, run: async (c) => { trapG.style.opacity = 0.35; await show(c, L1); } });
      } else {
        steps.push({ cap: `Fill the four cells: ${T(sumTex(sim))}.`, run: async (c) => { for (let i = 0; i < 4; i++) await fillCell(c, i); } });
      }
      if (mode === 'conj') {
        const mids = [1, 2];
        const plusI = sim[1].c > 0 ? 1 : 2, minusI = 3 - plusI;
        const midT = tTex({ ...sim[plusI], c: Math.abs(sim[plusI].c) });
        steps.push({
          cap: `The middle cells are <b>opposites</b>: ${T(cG('+' + midT))} and ${T(cX('-' + midT))}.`,
          run: async (c) => {
            await Promise.all([anim(c, cellBg[plusI], [{ fill: '#f6f5f1' }, { fill: '#d7f0e3' }], 350), anim(c, cellBg[minusI], [{ fill: '#f6f5f1' }, { fill: '#fbdcd9' }], 350)]);
            await Promise.all(mids.map((i) => pulse(c, cellMain(i), 1.15)));
          }
        });
        const zero = hide(lab(stage, RX + RW / 2, Y + GH / 2 - 10, '', 'u2l4-zero'));
        zero.innerHTML = `${T(`${cG('+' + midT)}${cX('-' + midT)}`)}<div class="u2l4-zero-n">${T('=0')}</div>`;
        steps.push({
          cap: `Opposites add to zero: ${T(`${'+' + midT}+\\left(-${midT}\\right)=0`)}. The radicals <b>cancel</b>.`,
          run: async (c) => {
            await Promise.all(mids.map((i) => { const [r, q] = order[i]; return ghost(c, stage, cxs[q] + cw[q] / 2, cys[r] + chh[r] / 2, RX + RW / 2, Y + GH / 2 - 10, T(i === plusI ? cG('+' + midT) : cX('-' + midT)), 'u2l4-cell', 700); }));
            await pop(c, zero);
            await Promise.all(mids.map((i) => anim(c, cellMain(i), [{ opacity: 1 }, { opacity: 0.25 }], 300)));
            if (cellSim[1]) { cellRaw[1].style.opacity = 0.25; cellRaw[2].style.opacity = 0.25; }
          }
        });
        const rat = stamp(stage, 'rational', { ok: true, x: X + GW - 60, y: Y + GH + 100 }); hide(rat);
        const corners = `${tTex(sim[0])}${tTex(sim[3], false)}`;
        steps.push({
          cap: `Only the corners are left: ${T(corners === sumTex(fin) ? `\\boldsymbol{${corners}}` : `${corners}=\\boldsymbol{${sumTex(fin)}}`)}. No radical: the product is <b>rational</b>.`,
          run: async (c) => { await show(c, L1); await pop(c, L2); await stampIn(c, rat); }
        });
        const sq = (t) => pw({ ...t, c: Math.abs(t.c) });
        steps.push({
          cap: `Shortcut: (first)² − (second)²: ${T(`${sq(a[0])}^2-${sq(a[1])}^2=${corners === sumTex(fin) ? corners : `${corners}=${sumTex(fin)}`}`)}.`,
          run: async (c) => { const s = lab(stage, RX + RW / 2, Y + GH + 40, `Shortcut<br>${T(`${sq(a[0])}^2-${sq(a[1])}^2=${sumTex(fin)}`)}`, 'u2l4-short'); await fadeIn(c, s, 350); }
        });
        return steps;
      }
      // collect like terms (foil and square)
      const groups = new Map(); sim.forEach((t, i) => { const k = key(t); if (!groups.has(k)) groups.set(k, []); groups.get(k).push(i); });
      const likeG = [...groups.values()].filter((g) => g.length > 1);
      if (mode === 'foil') steps.push({ cap: `Write the four cells as one line: ${T(sumTex(sim))}.`, run: (c) => show(c, L1) });
      steps.push({
        cap: likeG.length ? `Same colour = <b>like terms</b>. Combine them: ${T(`\\boldsymbol{${sumTex(fin)}}`)}.` : `No two cells are like terms, so nothing combines: ${T(`\\boldsymbol{${sumTex(fin)}}`)}.`,
        run: async (c) => {
          await Promise.all(likeG.map((g, j) => Promise.all(g.map((i) => anim(c, cellBg[i], [{ fill: '#f6f5f1' }, { fill: LIKE[j % LIKE.length] }], 400)))));
          await pop(c, L2);
        }
      });
      return steps;
    }
  };
}
const foilGrid = gridDef(FG, 'foil', 'The area model: every term times every term');
const squareGrid = gridDef(SQG, 'square', 'Squaring a binomial: four cells, not two');
const conjugateGrid = gridDef(CJG, 'conj', 'Conjugates: the middle cells cancel');

/* ====================================================================================================
 * stretchSquash: (a + b)(a − b) = a² − b², drawn to scale
 * ==================================================================================================== */
const SS = {
  e7a: { a: '\\sqrt{7}', A: 7, b: '2', B: 4, ex: '7(a)' },
  wu: { a: '\\sqrt{10}', A: 10, b: '1', B: 1 },
  demo: { a: '3', A: 9, b: '\\sqrt{5}', B: 5 }
};
const stretchSquash = {
  title: 'Cut the corner, slide the strip',
  height: 440,
  choices: Object.keys(SS).map((k) => ({ v: k, label: SS[k].ex ? `Example ${SS[k].ex} check` : T(`\\left(${SS[k].a}+${SS[k].b}\\right)\\left(${SS[k].a}-${SS[k].b}\\right)`) })),
  ask: (k) => `${SS[k].ex ? `<b>Example ${SS[k].ex}:</b> ` : k === 'wu' ? 'The warm-up photo: ' : ''}${T(`\\left(${SS[k].a}+${SS[k].b}\\right)\\left(${SS[k].a}-${SS[k].b}\\right)`)}`,
  make(stage, key, ex) {
    const d0 = SS[key], W = ex.W, av = Math.sqrt(d0.A), bv = Math.sqrt(d0.B), svg = mkSvg(stage, W, ex.def.height);
    const br = (x) => (x.includes('sqrt') ? `\\left(${x}\\right)` : x);
    const d = { ...d0, aP: br(d0.a), bP: br(d0.b) };
    const u = Math.min(300 / av, (W - 560) / (av + bv)), S = av * u, B = bv * u, X = 70, Y = 40;
    const sq = svgEl('g', {}, svg);
    const pc = { fill: '#d9efed', stroke: '#d9efed', 'stroke-width': 2.5 };
    const R1 = rect(sq, X, Y + B, S, S - B, pc);
    const g2 = svgEl('g', {}, svg);
    const R2 = rect(g2, X, Y, S - B, B, pc);
    const corner = rect(svg, X + S - B, Y, B, B, pc);
    const outline = rect(svg, X, Y, S, S, { fill: 'none', stroke: INK, 'stroke-width': 3.5 });
    const sB = lab(stage, X + S / 2, Y + S + 10, T(d.a), 'u2l4-side u2l4-side-b', 's'), sL = lab(stage, X - 10, Y + S / 2, T(d.a), 'u2l4-side u2l4-side-b', 'w');
    const area = lab(stage, X + S / 2, Y + S / 2 + B / 2, T(`${d.aP}^2=${d.A}`), 'u2l4-mid u2l4-arealab');
    const cT = hide(lab(stage, X + S - B / 2, Y - 8, T(cX(d.b)), 'u2l4-side', 'n')), cR2 = hide(lab(stage, X + S + 8, Y + B / 2, T(cX(d.b)), 'u2l4-side', 'e'));
    const pn = panel(stage, W - 330, 40, 310, 300, 'Area');
    const fBot = hide(lab(stage, X + (S + B) / 2, Y + S + 10, T(`${d.a}+${d.b}`), 'u2l4-side u2l4-side-b', 's'));
    const fRt = hide(lab(stage, X + S + B + 10, Y + B + (S - B) / 2, T(`${d.a}-${d.b}`), 'u2l4-side u2l4-side-b', 'e'));
    const cx0 = X + (S - B) / 2, cy0 = Y + B / 2, dx = X + S + B / 2 - cx0, dy = Y + B + (S - B) / 2 - cy0;
    const rst = stamp(stage, 'rational', { x: W - 175, y: 380 }); hide(rst);
    return [
      { cap: `A square with side ${T(d.a)} has area ${T(`${d.aP}^2=${d.A}`)}.`, run: (c) => pulse(c, area, 1.1) },
      { cap: `Cut a square of side ${T(d.b)} from the corner: area ${T(`${d.bP}^2=${d.B}`)} is gone.`,
        run: async (c) => {
          R1.setAttribute('stroke', RA); R2.setAttribute('stroke', RA);
          await anim(c, corner, [{ fill: '#d9efed' }, { fill: '#fbdcd9' }], 300); corner.setAttribute('stroke', RED); await Promise.all([show(c, cT), show(c, cR2)]);
          await anim(c, corner, [{ opacity: 1 }, { opacity: 0.25 }], 450); corner.setAttribute('stroke-dasharray', '6 5');
          await show(c, line(pn, T(`${d.aP}^2=${d.A}`))); await show(c, line(pn, T(cX(`-\\ ${d.bP}^2=-${d.B}`))));
        } },
      { cap: `What is left has area ${T(`${d.A}-${d.B}=${d.A - d.B}`)}.`,
        run: async (c) => { area.innerHTML = T(`${d.A}-${d.B}=${d.A - d.B}`); await pulse(c, area, 1.1); await show(c, line(pn, T(`=${d.A - d.B}`), 'u2l4-big')); } },
      { cap: `Slide the top strip round to the right side…`,
        run: async (c) => {
          outline.style.opacity = 0; corner.style.opacity = 0; cT.style.opacity = 0; cR2.style.opacity = 0; sB.style.opacity = 0; sL.style.opacity = 0;
          await tween(c, 1100, (t) => { g2.setAttribute('transform', `translate(${dx * t} ${dy * t}) rotate(${90 * t} ${cx0} ${cy0})`); });
          area.style.translate = '-50% -50%'; place(area, X + (S + B) / 2, Y + B + (S - B) / 2);
        } },
      { cap: `…and it makes a rectangle ${T(`\\left(${d.a}+${d.b}\\right)`)} by ${T(`\\left(${d.a}-${d.b}\\right)`)}, with the same area ${T(String(d.A - d.B))}.`,
        run: async (c) => { await Promise.all([show(c, fBot), show(c, fRt)]); await pulse(c, area, 1.1); } },
      { cap: `So ${T(`\\left(${d.a}+${d.b}\\right)\\left(${d.a}-${d.b}\\right)=${d.aP}^2-${d.bP}^2=${d.A - d.B}`)}: a whole number from two irrational sides.`,
        run: async (c) => { await show(c, line(pn, T(`\\left(${d.a}+${d.b}\\right)\\left(${d.a}-${d.b}\\right)`), 'u2l4-small')); await show(c, line(pn, T(`=\\boldsymbol{${d.A - d.B}}`))); await stampIn(c, rst); } }
    ];
  }
};

/* ====================================================================================================
 * areaFigs: Example 8's figures (also drawn statically on the example card)
 * ==================================================================================================== */
/** draws one of Example 8's figures into svg at (X, Y) fitting w × hgt; returns { parts, labels } (labels are HTML via add) */
function drawFig(which, host, svg, X, Y, w, hgt, big) {
  const L = (x, y, s, pos) => lab(host, x, y, T(s), big ? 'u2l4-side u2l4-side-b' : 'u2l4-flab', pos);
  const o = { parts: [] };
  if (which === 'a') {
    const lv = 3 * Math.sqrt(6) + Math.sqrt(2), wv = Math.sqrt(3), u = Math.min(w / lv, hgt / wv), lw = lv * u, wh = wv * u, x0 = X + (w - lw) / 2;
    const p1 = rect(svg, x0, Y, 3 * Math.sqrt(6) * u, wh, { fill: '#fff', stroke: 'none' }), p2 = rect(svg, x0 + 3 * Math.sqrt(6) * u, Y, Math.sqrt(2) * u, wh, { fill: '#fff', stroke: 'none' });
    rect(svg, x0, Y, lw, wh, { fill: 'none', stroke: INK, 'stroke-width': big ? 3 : 2.2 });
    o.div = ln(svg, x0 + 3 * Math.sqrt(6) * u, Y, x0 + 3 * Math.sqrt(6) * u, Y + wh, { 'stroke-dasharray': '6 5', stroke: GRAY, 'stroke-width': 2 });
    o.div.style.opacity = big ? 0 : 0;
    o.parts = [p1, p2];
    o.labels = [L(x0 + lw / 2, Y + wh + 6, '3\\sqrt{6}+\\sqrt{2}', 's'), L(x0 + lw + 6, Y + wh / 2, '\\sqrt{3}', 'e')];
    o.geo = { x0, lw, wh, u };
  } else if (which === 'b') {
    const s = Math.min(w, hgt), x0 = X + (w - s) / 2;
    o.sq = rect(svg, x0, Y, s, s, { fill: '#fff', stroke: INK, 'stroke-width': big ? 3 : 2.2 });
    o.labels = [L(x0 + s / 2, Y + s + 6, '2\\sqrt{5}-1', 's')];
    o.geo = { x0, s };
  } else {
    const bv = 4 * Math.sqrt(3) + 2, hv = 4 * Math.sqrt(3) - 2, off = 0.16 * bv, u = Math.min(w / (bv + off), hgt / hv);
    const x0 = X + (w - (bv + off) * u) / 2 + off * u, yb = Y + hv * u, xa = x0 - off * u;
    o.tri = poly(svg, [[x0, yb], [x0 + bv * u, yb], [xa, Y]], { fill: '#fff', stroke: INK, 'stroke-width': big ? 3 : 2.2, 'stroke-linejoin': 'round' });
    ln(svg, xa, Y, xa, yb, { 'stroke-dasharray': '6 5', 'stroke-width': 2 }); ln(svg, xa, yb, x0, yb, { 'stroke-dasharray': '6 5', 'stroke-width': 2 });
    rect(svg, xa, yb - 10, 10, 10, { fill: 'none', stroke: INK, 'stroke-width': 1.6 });
    o.labels = [L(x0 + bv * u / 2, yb + 6, '4\\sqrt{3}+2', 's'), L(xa - 6, Y + hv * u / 2, '4\\sqrt{3}-2', 'w')];
    o.geo = { x0, xa, yb, u, bv, hv };
  }
  return o;
}
function staticFigs() {
  [['a', 'u2l4-fig-a'], ['b', 'u2l4-fig-b'], ['c', 'u2l4-fig-c']].forEach(([w, id]) => {
    const host = document.getElementById(id); if (!host) return;
    const Wd = 270, Hd = 150, fh = w === 'a' ? 70 : w === 'b' ? 106 : 100;
    host.style.height = Hd + 'px';
    const svg = svgEl('svg', { width: Wd, height: Hd, viewBox: `0 0 ${Wd} ${Hd}`, class: 'u2l4-figsvg' }, host);
    const y0 = w === 'a' ? 30 : 8;
    if (w === 'c') drawFig(w, host, svg, 96, y0, Wd - 112, fh, false); else drawFig(w, host, svg, 30, y0, Wd - 80, fh, false);
  });
}
const AF = { e8a: { ex: '8(a)', name: 'rectangle' }, e8b: { ex: '8(b)', name: 'square' }, e8c: { ex: '8(c)', name: 'triangle' } };
const areaFigs = {
  title: 'Exact areas',
  height: 440,
  choices: Object.keys(AF).map((k) => ({ v: k, label: `Example ${AF[k].ex} check` })),
  ask: (k) => `<b>Example ${AF[k].ex}:</b> the area of the ${AF[k].name}, in simplest form`,
  make(stage, key, ex) {
    const W = ex.W, svg = mkSvg(stage, W, ex.def.height), which = key.slice(-1);
    const FX = 50, FY = 50, FW = Math.min(460, W - 520), FH = which === 'a' ? 150 : 300;
    const f = which === 'b' ? null : which === 'c' ? drawFig('c', stage, svg, FX + 90, FY, FW - 90, FH, true) : drawFig('a', stage, svg, FX, FY, FW, FH, true);
    const pn = panel(stage, W - 400, 30, 380, 380, which === 'c' ? 'A = ½ bh' : which === 'b' ? 'A = s²' : 'A = lw');
    const steps = [];
    if (which === 'a') {
      const { x0, wh, u } = f.geo, w1 = 3 * Math.sqrt(6) * u, w2 = Math.sqrt(2) * u;
      const a1 = hide(lab(stage, x0 + w1 / 2, FY + wh / 2, T('3\\sqrt{18}=9\\sqrt{2}'), 'u2l4-cell')), a2 = hide(lab(stage, x0 + w1 + w2 / 2, FY + wh + 74, T('\\sqrt{6}'), 'u2l4-cell'));
      const tie = svgEl('path', { d: `M${x0 + w1 + w2 / 2} ${FY + wh / 2} L${x0 + w1 + w2 / 2} ${FY + wh + 56}`, stroke: BLUE, 'stroke-width': 2.5, fill: 'none', class: 'bk-stroke' }, svg); tie.style.opacity = 0;
      steps.push({ cap: `Rectangle: ${T('A=lw=\\sqrt{3}\\left(3\\sqrt{6}+\\sqrt{2}\\right)')}.`, run: (c) => show(c, line(pn, T('A=\\sqrt{3}\\left(3\\sqrt{6}+\\sqrt{2}\\right)'))) });
      steps.push({ cap: `Split the length: the big part is ${T('\\sqrt{3}\\cdot3\\sqrt{6}=3\\sqrt{18}=9\\sqrt{2}')}.`,
        run: async (c) => { f.div.style.opacity = 1; await drawIn(f.div, 400, c); await anim(c, f.parts[0], [{ fill: '#fff' }, { fill: '#fde7c2' }], 300); await pop(c, a1); await show(c, line(pn, T('=3\\sqrt{18}+\\sqrt{6}'))); } });
      steps.push({ cap: `The thin part is ${T('\\sqrt{3}\\cdot\\sqrt{2}=\\sqrt{6}')}.`,
        run: async (c) => { await anim(c, f.parts[1], [{ fill: '#fff' }, { fill: '#d8ecfb' }], 300); tie.style.opacity = 1; await drawIn(tie, 300, c); await pop(c, a2); } });
      steps.push({ cap: `${T('9\\sqrt{2}')} and ${T('\\sqrt{6}')} are not like radicals: ${T('A=\\boldsymbol{9\\sqrt{2}+\\sqrt{6}}')} cm².`, run: (c) => show(c, line(pn, T('=\\boldsymbol{9\\sqrt{2}+\\sqrt{6}}\\text{ cm}^2'), 'u2l4-big')) });
    } else if (which === 'b') {
      // to scale: the square of side 2√5 − 1 sits in a square of side 2√5; take away two 1-wide strips, add the corner back
      const G = 2 * Math.sqrt(5), u = 300 / G, x0 = FX + 60, sd = (G - 1) * u, Gp = G * u;
      const big = rect(svg, x0, FY, Gp, Gp, { fill: 'none', stroke: GRAY, 'stroke-width': 2.5, 'stroke-dasharray': '8 6' }); big.style.opacity = 0;
      const sqr = rect(svg, x0, FY + u, sd, sd, { fill: '#fff', stroke: INK, 'stroke-width': 3 });
      const sLab = lab(stage, x0 + sd / 2, FY + Gp + 6, T('2\\sqrt{5}-1'), 'u2l4-side u2l4-side-b', 's');
      const gLab = hide(lab(stage, x0 + Gp + 8, FY + Gp / 2, T('2\\sqrt{5}'), 'u2l4-side', 'e'));
      const top = rect(svg, x0, FY, Gp, u, { fill: '#fbdcd9', stroke: RED, 'stroke-width': 2, opacity: 0 });
      const rgt = rect(svg, x0 + sd, FY, u, Gp, { fill: '#fbdcd9', stroke: RED, 'stroke-width': 2, opacity: 0 });
      const cor = rect(svg, x0 + sd, FY, u, u, { fill: '#e6dcf7', stroke: PUR, 'stroke-width': 2.5, opacity: 0 });
      const one = hide(lab(stage, x0 + sd + u / 2, FY - 6, T('1'), 'u2l4-side', 'n'));
      const tA = hide(lab(stage, x0 + sd / 2, FY + u / 2, T(cX('-2\\sqrt{5}')), 'u2l4-cell'));
      const rA = hide(lab(stage, x0 + sd + u / 2, FY + u + sd / 2, T(cX('-2\\sqrt{5}')), 'u2l4-cell u2l4-rot'));
      const cA = hide(lab(stage, x0 + sd + u / 2, FY + u / 2, T(colr(PUR)('+1')), 'u2l4-cell'));
      const bigA = hide(lab(stage, x0 + sd / 2, FY + u + sd / 2, T('20'), 'u2l4-big u2l4-ghostnum'));
      void sLab;
      steps.push({ cap: `Square: ${T('A=s^2=\\left(2\\sqrt{5}-1\\right)^2')}.`, run: (c) => show(c, line(pn, T('A=\\left(2\\sqrt{5}-1\\right)^2'))) });
      steps.push({ cap: `Start from a square of side ${T('2\\sqrt{5}')}: area ${T('\\left(2\\sqrt{5}\\right)^2=20')}. Ours is ${T('1')} shorter each way.`,
        run: async (c) => { await appear(c, big, 300); await Promise.all([show(c, gLab), show(c, one), pop(c, bigA)]); await show(c, line(pn, T('\\left(2\\sqrt{5}\\right)^2=20'))); } });
      steps.push({ cap: `Take away a strip ${T('1')} by ${T('2\\sqrt{5}')} along the top and another down the side: ${T('-2\\sqrt{5}')} twice.`,
        run: async (c) => { await appear(c, top, 300); await pop(c, tA); await appear(c, rgt, 300); await pop(c, rA); await show(c, line(pn, T(cX('-2(2\\sqrt{5})(1)=-4\\sqrt{5}')))); } });
      steps.push({ cap: `The ${T('1')} by ${T('1')} corner was taken away <b>twice</b>, so add it back once: ${T('+1^2=+1')}.`,
        run: async (c) => { await appear(c, cor, 300); await pop(c, cA); await show(c, line(pn, T(colr(PUR)('+1^2=+1')))); } });
      steps.push({ cap: `${T('A=20-4\\sqrt{5}+1=\\boldsymbol{21-4\\sqrt{5}}')} cm². That is ${T('a^2-2ab+b^2')}.`,
        run: (c) => show(c, line(pn, T('A=\\boldsymbol{21-4\\sqrt{5}}\\text{ cm}^2'), 'u2l4-big')) });
      void sqr;
    } else {
      const { x0, xa, yb, u, bv, hv } = f.geo;
      const box2 = svgEl('rect', { x: xa, y: yb - hv * u, width: x0 + bv * u - xa, height: hv * u, fill: 'none', stroke: BLUE, 'stroke-width': 2.5, 'stroke-dasharray': '8 6' }, svg); box2.style.opacity = 0;
      steps.push({ cap: `Triangle: ${T('A=\\tfrac{1}{2}bh=\\tfrac{1}{2}\\left(4\\sqrt{3}+2\\right)\\left(4\\sqrt{3}-2\\right)')}.`, run: (c) => show(c, line(pn, T('A=\\tfrac{1}{2}\\left(4\\sqrt{3}+2\\right)\\left(4\\sqrt{3}-2\\right)'), 'u2l4-small')) });
      steps.push({ cap: `The base and height are <b>conjugates</b>: ${T('\\left(4\\sqrt{3}\\right)^2-2^2=48-4=44')}.`,
        run: async (c) => { await pulse(c, f.labels[0], 1.12); await pulse(c, f.labels[1], 1.12); await show(c, line(pn, T('=\\tfrac{1}{2}(48-4)'))); } });
      steps.push({ cap: `Half of ${T('44')}: ${T('A=\\boldsymbol{22}')} cm². A whole number!`,
        run: async (c) => { await anim(c, f.tri, [{ fill: '#fff' }, { fill: '#d9efed' }], 400); await show(c, line(pn, T('=\\tfrac{1}{2}(44)=\\boldsymbol{22}\\text{ cm}^2'), 'u2l4-big')); } });
      steps.push({ cap: `Sense check: ${T('4\\sqrt{3}')} is about ${T('6.9')}, so ${T('A\\approx\\tfrac{1}{2}(8.9)(4.9)\\approx22')}. ✓`,
        run: async (c) => { box2.style.opacity = 1; await drawIn(box2, 500, c); await show(c, line(pn, `Half of the dashed box: ${T('\\tfrac{1}{2}(8.9)(4.9)\\approx22')}`, 'u2l4-small')); } });
    }
    return steps;
  }
};

/* =============================== Stand Up Break! (whiteboard stations; ../standup.js) ===============================
 * BEG: multiply two mixed radicals and simplify. PRG: (p + q√r)(s + t√r) → a + b√r. MAS: a binomial with two radicals
 * squared, or multiplied by its conjugate. */
standup('u2l4', {
  intro: 'At your whiteboard: coefficients together, radicands together, then simplify. Exact answers!',
  levels: {
    BEG: (r) => {
      const pairs = [[6, 10], [3, 15], [2, 14], [6, 15], [10, 14], [5, 15], [2, 18], [3, 21], [7, 14], [6, 21], [10, 15], [2, 22]];
      const [b, dd] = r.pick(pairs), a = r.pick([2, 3, 4, 5, -2, -3]), c2 = r.pick([2, 3, 4, 5, 6]);
      const f = [R(a, b), R(c2, dd)], P = mul(...f);
      return { text: 'Multiply and simplify.', q: prodTex(f), a: [`=${tTex(P)}`].concat(peelChain(P).map((x) => '=' + x)) };
    },
    PRG: (r) => {
      const rr = r.pick([2, 3, 5, 6, 7]), p = r.pick([1, 2, 3, 4, 5, 6]), s = r.pick([1, 2, 3, 4, 5, -2, -3, -4]);
      const q = r.pick([1, 2, 3, -1, -2]), t = r.pick([1, 2, 3, 4, -1, -2, -3]);
      const A = [R(p), R(q, rr)], B = [R(s), R(t, rr)];
      const cells = [mul(A[0], B[0]), mul(A[0], B[1]), mul(A[1], B[0]), mul(A[1], B[1])].map(simp);
      return { text: 'Expand and simplify.', q: `${binTex(A)}${binTex(B)}`, a: [`=${sumTex(cells)}`, `=${sumTex(collect(cells))}`] };
    },
    MAS: (r) => {
      const pairs = [[2, 3], [2, 5], [3, 5], [2, 7], [3, 7], [5, 7], [2, 6], [3, 6], [6, 10], [2, 10], [5, 10], [3, 15]];
      const [b, dd] = r.pick(pairs), m = r.pick([1, 2, 3]), n = r.pick([1, 2, 3]) * r.sign();
      const X = [R(m, b), R(n, dd)];
      if (r.chance(0.5)) {
        const cells = [mul(X[0], X[0]), mul(X[0], X[1]), mul(X[1], X[0]), mul(X[1], X[1])].map(simp);
        return { text: 'Expand and simplify.', q: `${binTex(X)}^2`, a: [`=${sumTex(cells)}`, `=${sumTex(collect(cells))}`] };
      }
      const Y2 = [X[0], neg(X[1])], cells = [mul(X[0], Y2[0]), mul(X[0], Y2[1]), mul(X[1], Y2[0]), mul(X[1], Y2[1])].map(simp);
      return { text: 'Write the conjugate, then multiply the expression by its conjugate.', q: sumTex(X),
        a: [`\\text{conjugate: }${sumTex(Y2)}`, `${binTex(X)}${binTex(Y2)}=${sumTex(cells)}`, `=${sumTex(collect(cells))}`] };
    }
  }
});

/* =============================== mount =============================== */
mountPatio();
staticFigs();
export const explainers = mountExplainers({ multRule, twoWays, squareTiles, splitBack, varRadicals, distribute, foilGrid, squareGrid, conjugateGrid, stretchSquash, areaFigs });
export const _test = { R, mul, simp, tTex, sumTex, collect, peel, MR, FG, SQG, CJG };
