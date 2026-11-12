/* Math 20-1 · Unit 4 · Lesson 2 — Factoring ax² + bx + c.
 * New lesson format (2026-11-11): the warm-up is plain markup on the page (no code), and the explainers are
 *   hunt (STAR, one decomposition procedure: Ryan's X with ac on top and b underneath, the sign rule when ac or b is
 *     negative, the factor pairs listed beside the X and the right one circled, the numbers on the sides; then the middle
 *     term splits in two, the grouping brackets snap on, the common binomial glows and the brackets fly together; a
 *     written check by expanding. Examples 1–4 and a trinomial that does not factor),
 *   guess (guess and check: two binomial slots, outer and inner products arc over and under, a try log; Example 4
 *     check; why it is slow when a and c have many factors: 12 cards),
 *   gcf (GCF first: each term divided by the GCF, or every sign flipping for −1; why: the same trinomial without the
 *     GCF gives a bigger X and an answer stamped "not fully factored"; Example 5 checks),
 *   fracs (take out a fraction: ÷ ½ is × 2; LCD; Example 7 checks),
 *   psTest (the perfect-square test as three checks with stamps; Example 8 and 9 checks, the blanks of 8(b)).
 * Colours: a and c (the product ac) rose; the two split numbers m (blue) and n (amber); b and the common binomial
 * green; wrong rows grey. No calculator in Unit 4. */
import {
  h, tex, add, box, stamp, stampIn, mountExplainers, pop, fadeIn, sleep, svgEl, pulse, shake, anim, drawIn, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const AC = COLORS.teal, MC = COLORS.blue, NC = COLORS.amber, GC = COLORS.green, RED = COLORS.red, INK = COLORS.ink;
const show = (c, el, ms = 320) => fadeIn(c, el, ms);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const sgn = (k) => (k < 0 ? '-' : '+');
/** TeX of k·m (m a monomial like 'x^2', 'xy', '' for a number); sign included */
const mono = (k, m = '') => (m ? (k === 1 ? m : k === -1 ? '-' + m : k + m) : String(k));
/** TeX of a polynomial from [[k, m], …] */
const poly = (ts) => ts.map(([k, m], i) => (i ? ` ${sgn(k)} ${mono(Math.abs(k), m)}` : mono(k, m))).join('');
const bin = (p, m1, q, m2 = '') => `(${poly([[p, m1], [q, m2]])})`;
/** absolute position of el inside the stage (offsets are not affected by the stage's scale transform) */
function posIn(stage, el) { let x = 0, y = 0; while (el && el !== stage) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; } return [x, y]; }
/** a ghost copy of src flies to dst; dst then shows */
async function fly(c, stage, src, dst, ms = 650) {
  const [x0, y0] = posIn(stage, src), [x1, y1] = posIn(stage, dst);
  const g = src.cloneNode(true); g.classList.add('u4l2-ghost'); g.style.opacity = 1; stage.appendChild(g);
  g.style.left = x0 + 'px'; g.style.top = y0 + 'px'; g.style.fontSize = getComputedStyle(src).fontSize; g.style.color = getComputedStyle(src).color;
  try { await anim(c, g, [{ transform: 'translate(0,0)' }, { transform: `translate(${x1 - x0}px, ${y1 - y0}px)` }], ms); } finally { g.remove(); }
  dst.style.opacity = 1;
}

/* A line of maths made of separate tokens so pieces can be coloured, hidden, popped and flown.
 * toks: [{ t: TeX, cls, id, hid }] or strings (TeX). Returns { el, k: { id: element }, all: [elements] }. */
function mline(host, x, y, toks, cls = '') {
  const el = div(host, 'u4l2-ln ' + cls, '', x, y), k = {}, all = [];
  toks.forEach((o) => {
    if (typeof o === 'string') o = { t: o };
    const d = h('div', 'u4l2-tk' + (o.op ? ' u4l2-op' : '') + (o.cls ? ' ' + o.cls : ''), T(o.t));
    if (o.hid) d.style.display = 'none';
    el.appendChild(d); all.push(d); if (o.id) k[o.id] = d;
  });
  return { el, k, all };
}
const opTok = (s, o = {}) => Object.assign({ t: s === '-' ? '-' : '+', op: true }, o);

/* positive factor pairs of n */
function pairsOf(n) { const out = []; for (let p = 1; p * p <= n; p++) if (n % p === 0) out.push([p, n / p]); return out; }
/** the signed pairs to try for product ac and sum b (sign rules applied) */
function signedPairs(ac, b) {
  return pairsOf(Math.abs(ac)).map(([p, q]) => {
    if (ac > 0) return b >= 0 ? [p, q] : [-p, -q];
    return b >= 0 ? [-p, q] : [p, -q];
  });
}
function signRule(ac, b) {
  if (ac > 0) return b > 0 ? `${T('ac>0')} and ${T('b>0')}: <b>both positive</b>` : `${T('ac>0')} and ${T('b<0')}: <b>both negative</b>`;
  return `${T('ac<0')}: <b>opposite signs</b>; the bigger one is ${b > 0 ? '<b>positive</b>' : '<b>negative</b>'} (like ${T('b')})`;
}

/* Ryan's X (2026-11-11): ac on top, b underneath, the two numbers on the sides (the pairs are listed beside it) */
function ryanX(stage, svg, cx, cy, r, top, bot) {
  const g = svgEl('g', {}, svg); g.style.opacity = 0;
  [[cx - r, cy - r, cx + r, cy + r], [cx + r, cy - r, cx - r, cy + r]].forEach(([x1, y1, x2, y2]) => svgEl('line', { x1, y1, x2, y2, stroke: COLORS.blue, 'stroke-width': 5, 'stroke-linecap': 'round' }, g));
  const v = (cls, html, x, y) => { const e = hide(div(stage, 'u4l2-xv ' + cls, html, x, y)); e.style.translate = '-50% -50%'; return e; };
  const X = { g, la: v('u4l2-xlab', T(`\\textcolor{${AC}}{ac}`), cx, cy - r - 16), lb: v('u4l2-xlab', T(`\\textcolor{${GC}}{b}`), cx, cy + r + 18),
    top: v('u4l2-xtop', T(top), cx, cy - r * 0.7), bot: v('u4l2-xbot', T(bot), cx, cy + r * 0.72),
    L: v('u4l2-xside', '', cx - r * 0.84, cy), R: v('u4l2-xside', '', cx + r * 0.84, cy) };
  X.show = async (c) => { g.style.opacity = 1; await appear2(c, g); await show(c, X.la); await pop(c, X.top); await show(c, X.lb); await pop(c, X.bot); };
  X.sides = async (c, m, n) => { X.L.innerHTML = T(String(m)); X.R.innerHTML = T(String(n)); await pop(c, X.L); await pop(c, X.R); };
  return X;
}

/** a small X in host with the pair list beside it. play(c) lists the pairs, circles the one with sum b and fills the sides */
function xHunt(host, W, H, cx, cy, r, ac, b, pairs, rowX, rowW, rh) {
  const svg = svgEl('svg', { class: 'u4l2-ov', width: W, height: H }, host); svg.style.position = 'absolute';
  const X = ryanX(host, svg, cx, cy, r, String(ac), String(b)), found = pairs.findIndex(([m, n]) => m + n === b), y0 = cy - (pairs.length * rh) / 2;
  const rows = pairs.map(([p, q], i) => hide(div(host, 'u4l2-xp u4l2-xp-sm', `<span>${T(`${p}\\times${q < 0 ? `(${q})` : q}`)}</span><span class="u4l2-xps">${T(`\\text{sum }${p + q}`)}</span>`, rowX, y0 + i * rh, rowW, rh - 4)));
  X.play = async (c) => {
    await X.show(c); for (const e of rows) await show(c, e, 140);
    rows.forEach((e, i) => e.classList.add(i === found ? 'u4l2-xp-ok' : 'u4l2-xp-no'));
    if (found >= 0) { await pulse(c, rows[found], 1.06); await X.sides(c, pairs[found][0], pairs[found][1]); }
  };
  return X;
}

/* =============================== the product–sum hunt (STAR) =============================== */
function huntDef(title, data, choices, o = {}) {
  return {
    title, height: 446, capH: 86,
    choices,
    ask: (v) => `Factor ${T(poly([[data[v].a, data[v].v + '^2'], [data[v].b, data[v].v], [data[v].c, '']]))} by decomposition.`,
    make(stage, v, ex) {
      const d = data[v], x = d.v, x2 = x + '^2', { a, b, c } = d, ac = a * c;
      const pairs = signedPairs(ac, b), found = pairs.findIndex(([m, n]) => m + n === b);
      const trin = poly([[a, x2], [b, x], [c, '']]);
      // left: the trinomial, a b c, target pills, sign rule, table
      const top = mline(stage, 18, 14, [{ t: mono(a, x2), cls: 'u4l2-cA', id: 'a' }, opTok(sgn(b)), { t: mono(Math.abs(b), x), cls: 'u4l2-cB', id: 'b' }, opTok(sgn(c)), { t: String(Math.abs(c)), cls: 'u4l2-cA', id: 'c' }], 'u4l2-big');
      const abc = hide(div(stage, 'u4l2-abc', `${T(`\\textcolor{${AC}}{a=${a}}`)} &nbsp; ${T(`\\textcolor{${GC}}{b=${b}}`)} &nbsp; ${T(`\\textcolor{${AC}}{c=${c}}`)}`, 20, 66));
      const pills = hide(div(stage, 'u4l2-pills', `<div class="u4l2-pill u4l2-pill-p">product ${T(`ac=${a}\\times${c < 0 ? `(${c})` : c}=${ac}`)}</div><div class="u4l2-pill u4l2-pill-s">sum ${T(`b=${b}`)}</div>`, 18, 98, 340));
      const rule = hide(div(stage, 'u4l2-rule', signRule(ac, b), 18, 186, 340));
      // Ryan's X: ac on top, b underneath, the two numbers on the sides; the pairs listed beside it, the right one circled
      const sg = o.signs || ac < 0 || b < 0;
      const xsvg = svgEl('svg', { class: 'u4l2-ov', width: ex.W, height: 446 }, stage);
      const X = ryanX(stage, xsvg, 96, 336, 56, String(ac), String(b));
      const RH = pairs.length > 5 ? 30 : 34, PY = 336 - (pairs.length * RH) / 2;
      const prs = pairs.map(([p, q], i) => { const e = hide(div(stage, 'u4l2-xp', `<span>${T(`${p}\\times${q < 0 ? `(${q})` : q}`)}</span><span class="u4l2-xps">${T(`\\text{sum }${p + q}`)}</span>`, 178, PY + i * RH, 196, RH - 4)); return e; });
      // right: the working
      const RX = 400, lab = (y, s) => hide(div(stage, 'u4l2-lab', s, RX, y + 10));
      const [m, n] = d.split || (found >= 0 ? pairs[found] : [0, 0]);
      const steps0 = [
        { cap: `Read off ${T('a')}, ${T('b')} and ${T('c')}.`, run: (c2) => show(c2, abc) },
        { cap: `<b>Step 1: find two numbers</b> with <b>product</b> ${T(`ac=${ac}`)} and <b>sum</b> ${T(`b=${b}`)}.`, run: (c2) => show(c2, pills) }
      ];
      steps0.push({ cap: `Draw the X: ${T(`ac=${ac}`)} goes on <b>top</b>, ${T(`b=${b}`)} goes <b>underneath</b>. The two numbers on the sides multiply to the top and add to the bottom.`, run: (c2) => X.show(c2) });
      if (sg) steps0.push({ cap: `Signs first. ${signRule(ac, b)}.`, run: (c2) => show(c2, rule) });
      steps0.push({ cap: `List the factor pairs of ${T(String(Math.abs(ac)))}${sg ? ', with those signs' : ''}, in order, with their sums.`, run: async (c2) => { for (const r of prs) await show(c2, r, 160); } });
      if (found < 0) {
        const st = hide(stamp(stage, 'does not factor', { x: RX + 300, y: 200, ok: false, size: 'lg' }));
        const why = hide(div(stage, 'u4l2-note', `No pair of integers has product ${T(String(ac))} and sum ${T(String(b))}, so ${T(trin)} <b>does not factor over the integers</b>.`, RX + 40, 270, ex.W - RX - 80));
        return steps0.concat([
          { cap: `No pair adds to ${T(String(b))}, so nothing gets circled. ${T(trin)} <b>does not factor over the integers</b>. That is a correct answer too.`, run: async (c2) => { prs.forEach((e) => e.classList.add('u4l2-xp-no')); await shake(c2, X.bot); await stampIn(c2, st); await show(c2, why); } }
        ]);
      }
      const g1 = gcd(a, m), b0 = a / g1, b1 = m / g1, g2 = n / b0;
      const B = bin(b0, x, b1), F2 = bin(g1, x, g2);
      const y1 = 26, y2 = 100, y3 = 174, y4 = 248;
      const l1lab = lab(y1, '2 · split'), l2lab = lab(y2, '3 · group'), l3lab = lab(y3, 'take out<br>GCFs'), l4lab = lab(y4, 'factor');
      const LX = RX + 90;
      const L1 = mline(stage, LX, y1, [{ t: mono(a, x2) }, opTok(sgn(b), { id: 'opb' }), { t: mono(Math.abs(b), x), id: 'b' },
        opTok(sgn(m), { id: 'opm', hid: true }), { t: mono(Math.abs(m), x), cls: 'u4l2-cM', id: 'm', hid: true }, opTok(sgn(n), { id: 'opn', hid: true }), { t: mono(Math.abs(n), x), cls: 'u4l2-cN', id: 'n', hid: true },
        opTok(sgn(c)), { t: String(Math.abs(c)) }], 'u4l2-work');
      hide(L1.el);
      const L2 = mline(stage, LX, y2, [{ t: '(', cls: 'u4l2-br u4l2-brM', id: 'p1' }, { t: mono(a, x2) }, opTok(sgn(m)), { t: mono(Math.abs(m), x), cls: 'u4l2-cM' }, { t: ')', cls: 'u4l2-br u4l2-brM', id: 'p2' },
        opTok('+'), { t: '(', cls: 'u4l2-br u4l2-brN', id: 'p3' }, { t: mono(n, x), cls: 'u4l2-cN' }, opTok(sgn(c)), { t: String(Math.abs(c)) }, { t: ')', cls: 'u4l2-br u4l2-brN', id: 'p4' }], 'u4l2-work');
      hide(L2.el);
      const L3 = mline(stage, LX, y3, [{ t: mono(g1, x), cls: 'u4l2-cM', id: 'g1' }, { t: B, cls: 'u4l2-cG', id: 'B1' }, opTok(sgn(g2), { id: 'og' }), { t: String(Math.abs(g2)), cls: 'u4l2-cN', id: 'g2' }, { t: B, cls: 'u4l2-cG', id: 'B2' }], 'u4l2-work');
      hide(L3.el);
      const L4 = mline(stage, LX, y4, [{ t: B, cls: 'u4l2-cG u4l2-fin', id: 'B' }, { t: F2, cls: 'u4l2-fin', id: 'F' }], 'u4l2-work');
      L4.all.forEach(hide);
      // a written check: expand the answer
      const y5 = 322, l5lab = lab(y5, '4 · check');
      const K1 = hide(div(stage, 'u4l2-ln u4l2-work u4l2-ok', T(`${B}${F2}=${poly([[a, x2], [n, x], [m, x], [c, '']])}`), LX, y5));
      const K2 = hide(div(stage, 'u4l2-ln u4l2-work u4l2-ok', T(`=${trin}\\ \\checkmark`), LX, y5 + 56));
      const ok = hide(stamp(stage, 'factored', { x: ex.W - 90, y: y5 + 92 }));
      const sameOrder = d.ans && d.ans !== `${B}${F2}` ? ` The booklet writes ${T(d.ans)}: the same factors in the other order.` : '';
      return steps0.concat([
        { cap: `Which pair adds to ${T(String(b))}? ${T(`${pairs[found][0]}+${pairs[found][1] < 0 ? `(${pairs[found][1]})` : pairs[found][1]}=${b}`)} ✓ <b>Circle</b> it, and write the two numbers on the sides of the X.`,
          run: async (c2) => { prs.forEach((e, i) => e.classList.add(i === found ? 'u4l2-xp-ok' : 'u4l2-xp-no')); await pulse(c2, prs[found], 1.06); await X.sides(c2, pairs[found][0], pairs[found][1]); } },
        { cap: `<b>Split</b> the middle term into two: ${T(`${mono(b, x)}=${mono(m, x)}${n < 0 ? '' : '+'}${mono(n, x)}`)}.${d.split && pairs[found][0] !== m ? ' (Either order works.)' : ''}`, run: async (c2) => {
          L1.el.style.opacity = 1; L1.k.b.style.opacity = 1; await show(c2, l1lab); await pulse(c2, L1.k.b, 1.25);
          L1.k.b.style.display = 'none'; L1.k.opb.style.display = 'none';
          ['opm', 'm', 'opn', 'n'].forEach((k) => { L1.k[k].style.display = ''; });
          await Promise.all([pop(c2, L1.k.m, 420), pop(c2, L1.k.n, 420)]);
        } },
        { cap: `<b>Group</b> the four terms in pairs.`, run: async (c2) => {
          L2.el.style.opacity = 1; await show(c2, l2lab);
          await Promise.all([
            anim(c2, L2.k.p1, [{ transform: 'translateX(-26px) scale(1.6)', opacity: 0 }, { transform: 'none', opacity: 1 }], 420),
            anim(c2, L2.k.p2, [{ transform: 'translateX(26px) scale(1.6)', opacity: 0 }, { transform: 'none', opacity: 1 }], 420),
            anim(c2, L2.k.p3, [{ transform: 'translateX(-26px) scale(1.6)', opacity: 0 }, { transform: 'none', opacity: 1 }], 420),
            anim(c2, L2.k.p4, [{ transform: 'translateX(26px) scale(1.6)', opacity: 0 }, { transform: 'none', opacity: 1 }], 420)]);
        } },
        { cap: `Take the <b>GCF</b> out of each pair: ${T(mono(g1, x))} and ${T(String(g2))}.${g2 < 0 ? ` Take out the <b>negative</b> ${T(String(g2))} so the brackets match.` : ''} Both brackets are ${T(B)}.`, run: async (c2) => {
          await show(c2, l3lab); L3.el.style.opacity = 1;
          L3.all.forEach((e) => { e.style.opacity = 0; });
          for (const k of ['g1', 'B1', 'og', 'g2', 'B2']) await pop(c2, L3.k[k], 260);
          await Promise.all([pulse(c2, L3.k.B1, 1.12), pulse(c2, L3.k.B2, 1.12)]);
        } },
        { cap: `<b>Factor out</b> the common bracket ${T(B)}: ${T(`${trin}=${B}${F2}`)}.${sameOrder}`, run: async (c2) => {
          await show(c2, l4lab); L4.el.style.opacity = 1;
          await Promise.all([fly(c2, stage, L3.k.B1, L4.k.B), fly(c2, stage, L3.k.B2, L4.k.B)]);
          await Promise.all([fly(c2, stage, L3.k.g1, L4.k.F), fly(c2, stage, L3.k.g2, L4.k.F)]);
          await pulse(c2, L4.el, 1.06);
        } },
        { cap: `<b>Check</b> by expanding: ${T(B + F2)} gives the four split terms, and they collect back to ${T(trin)}.`, run: async (c2) => {
          await show(c2, l5lab); await show(c2, K1); await show(c2, K2); await stampIn(c2, ok);
        } }
      ]);
    }
  };
}
const appear2 = (c, el) => anim(c, el, [{ opacity: 0 }, { opacity: 1 }], 300);
const HU = {
  long: { a: 12, b: 17, c: 6, v: 'x', split: [8, 9] },
  ex1: { a: 6, b: 19, c: 10, v: 'x', split: [15, 4], ans: '(3x+2)(2x+5)' },
  ex2a: { a: 3, b: 10, c: 8, v: 'x', split: [6, 4] },
  ex2b: { a: 5, b: 17, c: 6, v: 'x', split: [15, 2] },
  ex2c: { a: 4, b: 16, c: 15, v: 'x', split: [6, 10] }
};
const HN = {
  none: { a: 2, b: 3, c: 4, v: 'x' },
  ex3a: { a: 4, b: -4, c: -15, v: 'x', split: [-10, 6] },
  ex3b: { a: 6, b: -13, c: 6, v: 'a', split: [-4, -9] },
  ex3c: { a: 5, b: 13, c: -6, v: 'y', split: [15, -2] },
  ex4: { a: 3, b: -7, c: -6, v: 'x', split: [-9, 2], ans: '(3x+2)(x-3)' }
};
/* one decomposition explainer (2026-11-11): the sign step appears by itself when ac or b is negative */
const hunt = huntDef('Decomposition: find the two numbers, split, group', Object.assign({}, HU, HN), [{ v: 'long', label: 'A long hunt: 12x² + 17x + 6' }, { v: 'none', label: 'No pair? 2x² + 3x + 4' },
  { sep: 'Check:' }, { v: 'ex1', label: 'Example 1' }, { v: 'ex2a', label: 'Ex 2(a)' }, { v: 'ex2b', label: 'Ex 2(b)' }, { v: 'ex2c', label: 'Ex 2(c)' },
  { v: 'ex3a', label: 'Ex 3(a)' }, { v: 'ex3b', label: 'Ex 3(b)' }, { v: 'ex3c', label: 'Ex 3(c)' }, { v: 'ex4', label: 'Ex 4 by decomposition' }]);

/* =============================== explainer: guess and check =============================== */
const GU = {
  ex4: { trin: '3x^2-7x-6', P: 3, R: 1, b: -7, tries: [[-2, 3], [2, -3]], notes: ['Right size, wrong sign: <b>switch the signs</b>.', ''] },
  demo: { trin: '2x^2+7x+3', P: 2, R: 1, b: 7, tries: [[3, 1], [1, 3]], notes: ['Too small. <b>Swap</b> the 3 and the 1.', ''] },
  many: { trin: '12x^2+17x+6', many: true }
};
const guess = {
  title: 'Guess and check',
  height: 420,
  choices: [{ v: 'demo', label: '2x² + 7x + 3' }, { v: 'many', label: 'Many factors: 12x² + 17x + 6' }, { sep: 'Check:' }, { v: 'ex4', label: 'Example 4' }],
  ask: (v) => `Factor ${T(GU[v].trin)} by guess and check.`,
  make(stage, v, ex) {
    const d = GU[v];
    if (d.many) return guessMany(stage, ex);
    const xs = (k) => mono(k, 'x'), sNum = (q) => `{}${q < 0 ? '-' : '+'}${Math.abs(q)}`;
    div(stage, 'u4l2-gtgt', `Target ${T(d.trin)} &nbsp;→&nbsp; middle term must be ${T(`\\textcolor{${GC}}{${xs(d.b)}}`)}`, 22, 14);
    const BX = 70, BY = 150;
    const L = mline(stage, BX, BY, [{ t: '(' }, { t: xs(d.P), id: 'P', cls: 'u4l2-cA' }, { t: '\\phantom{+0}', id: 'q1', cls: 'u4l2-slot' }, { t: ')(' }, { t: xs(d.R), id: 'R', cls: 'u4l2-cA' }, { t: '\\phantom{+0}', id: 'q2', cls: 'u4l2-slot' }, { t: ')' }], 'u4l2-gbig');
    const svg = svgEl('svg', { class: 'u4l2-ov', width: ex.W, height: 420 }, stage);
    const oLab = div(stage, 'u4l2-glab u4l2-cM', '', 0, 0), iLab = div(stage, 'u4l2-glab u4l2-cN', '', 0, 0);
    hide(oLab); hide(iLab);
    const sumL = hide(div(stage, 'u4l2-gsum', '', BX, 300));
    const logX = ex.W - 330, log = div(stage, 'u4l2-panel u4l2-glog', '<div class="u4l2-ph">Tries</div>', logX, 70, 310, 240);
    let arcs = [];
    const drawArcs = async (c, q1, q2) => {
      arcs.forEach((a) => a.remove()); arcs = [];
      const ctr = (el) => { const [x, y] = posIn(stage, el); return [x + el.offsetWidth / 2, y, y + el.offsetHeight]; };
      const [pX, pT, pB] = ctr(L.k.P), [q2X, , ] = ctr(L.k.q2), [q1X, , q1B] = ctr(L.k.q1), [rX] = ctr(L.k.R);
      const outer = svgEl('path', { d: `M${pX} ${pT - 4} C${pX} ${pT - 60}, ${q2X} ${pT - 60}, ${q2X} ${pT - 4}`, class: 'u4l2-arc u4l2-arcM' }, svg);
      const inner = svgEl('path', { d: `M${q1X} ${q1B + 4} C${q1X} ${q1B + 50}, ${rX} ${q1B + 50}, ${rX} ${q1B + 4}`, class: 'u4l2-arc u4l2-arcN' }, svg);
      arcs = [outer, inner];
      oLab.innerHTML = `outer ${T(`${xs(d.P)}\\cdot(${q2})=${xs(d.P * q2)}`)}`; oLab.style.left = (pX + q2X) / 2 + 'px'; oLab.style.top = (pT - 84) + 'px'; oLab.style.translate = '-50% 0';
      iLab.innerHTML = `inner ${T(`(${q1})\\cdot ${xs(d.R)}=${xs(q1 * d.R)}`)}`; iLab.style.left = (q1X + rX) / 2 + 'px'; iLab.style.top = (q1B + 50) + 'px'; iLab.style.translate = '-50% 0';
      await drawIn(outer, 400, c); await show(c, oLab, 200); await drawIn(inner, 400, c); await show(c, iLab, 200);
    };
    const steps = [{ cap: `${T(String(d.P))} is prime, so the first terms must be ${T(xs(d.P))} and ${T('x')}. The last terms multiply to ${T(String(d.tries[0][0] * d.tries[0][1]))}.`, run: (c) => pulse(c, L.el, 1.05) }];
    d.tries.forEach(([q1, q2], i) => {
      const mid = d.P * q2 + q1 * d.R, ok = mid === d.b;
      const tryT = `(${xs(d.P)}${sNum(q1)})(${xs(d.R)}${sNum(q2)})`;
      steps.push({ cap: `Try ${T(tryT)}.`, run: async (c) => {
        L.k.q1.innerHTML = T(sNum(q1)); L.k.q2.innerHTML = T(sNum(q2)); sumL.style.opacity = 0; oLab.style.opacity = 0; iLab.style.opacity = 0; arcs.forEach((a) => a.remove()); arcs = [];
        await Promise.all([pop(c, L.k.q1), pop(c, L.k.q2)]);
      } });
      steps.push({ cap: `Middle term = <b>outer</b> + <b>inner</b>: ${T(`${xs(d.P * q2)}${q1 * d.R < 0 ? '' : '+'}${xs(q1 * d.R)}=${xs(mid)}`)}.`, run: async (c) => {
        await drawArcs(c, q1, q2);
        sumL.innerHTML = `${T(`${xs(d.P * q2)}${q1 * d.R < 0 ? '' : '+'}${xs(q1 * d.R)}=${xs(mid)}`)} ${ok ? '<b class="u4l2-yes">✓</b>' : `<b class="u4l2-no">✗</b> need ${T(xs(d.b))}`}`;
        await show(c, sumL);
        const row = h('div', 'u4l2-glrow', `${T(tryT)} → ${T(xs(mid))} ${ok ? '✓' : '✗'}`); row.classList.add(ok ? 'u4l2-yes' : 'u4l2-no'); log.appendChild(row); await show(c, row, 200);
      } });
      if (!ok) steps.push({ cap: d.notes[i], run: (c) => pulse(c, sumL, 1.08) });
      else {
        const st = hide(stamp(stage, '✓', { x: BX + 470, y: BY + 30, size: 'lg' }));
        steps.push({ cap: `It works: ${T(`${d.trin}=${tryT.replace(/\{\}/g, '')}`)}. Quick to check by expanding in your head.`, run: (c) => stampIn(c, st) });
      }
    });
    return steps;
  }
};
function guessMany(stage, ex) {
  const firsts = [[12, 1], [6, 2], [4, 3]], lasts = [[1, 6], [6, 1], [2, 3], [3, 2]];
  const cw = (ex.W - 60) / 4, chh = 72, X0 = 20, Y0 = 92;
  div(stage, 'u4l2-gtgt', `Target ${T('12x^2+17x+6')} &nbsp;→&nbsp; middle term ${T(`\\textcolor{${GC}}{17x}`)}`, 22, 12);
  const info = hide(div(stage, 'u4l2-note', `First terms: ${T('12x\\cdot x')}, ${T('6x\\cdot 2x')}, ${T('4x\\cdot 3x')} (3 ways). Last terms: ${T('1,6')} · ${T('6,1')} · ${T('2,3')} · ${T('3,2')} (4 ways).`, 22, 50, ex.W - 40));
  const cards = [];
  firsts.forEach(([P, R], i) => lasts.forEach(([q, s], j) => {
    const mid = P * s + q * R, e = hide(div(stage, 'u4l2-gcard' + (mid === 17 ? ' u4l2-gcard-ok' : ''), `${T(`(${mono(P, 'x')}+${q})(${mono(R, 'x')}+${s})`)}<div>${T(`${mid}x`)} ${mid === 17 ? '✓' : '✗'}</div>`, X0 + j * (cw + 6), Y0 + i * (chh + 10), cw, chh));
    cards.push({ e, ok: mid === 17 });
  }));
  const panel = hide(div(stage, 'u4l2-note u4l2-key', `${T('3\\times4=12')} possible tries by guessing. The decomposition table for ${T('ac=72')} has only <b>6</b> rows, and the answer is the last one: ${T('8+9=17')}.`, 22, Y0 + 3 * (chh + 10) + 6, ex.W - 40));
  return [
    { cap: `${T('12')} and ${T('6')} both have <b>many</b> factors. Count the choices.`, run: (c) => show(c, info) },
    { cap: `Every combination, with its middle term. Most are wrong.`, run: async (c) => { for (const k of cards) await show(c, k.e, 120); } },
    { cap: `Only one works: ${T('(4x+3)(3x+2)')}. Guessing could take 12 tries.`, run: (c) => pulse(c, cards.find((k) => k.ok).e, 1.1) },
    { cap: `When ${T('a')} and ${T('c')} have many factors, <b>decomposition</b> is more reliable.`, run: (c) => show(c, panel) }
  ];
}

/* =============================== explainer: GCF first and negative leading coefficients =============================== */
const GF = {
  ex5a: { terms: [[12, 'x^2'], [2, 'x'], [-4, '']], g: '2', div: '\\div 2', inner: [[6, 'x^2'], [1, 'x'], [-2, '']], pill: 'ac=-12,\\ \\text{sum }1:\\ 4,\\ -3',
    lines: ['=2(6x^2+4x-3x-2)', '=2[2x(3x+2)-1(3x+2)]'], fin: '=2(3x+2)(2x-1)' },
  ex5b: { terms: [[-6, 'x^2'], [7, 'x'], [3, '']], g: '-1', neg: true, inner: [[6, 'x^2'], [-7, 'x'], [-3, '']], pill: 'ac=-18,\\ \\text{sum }-7:\\ -9,\\ 2',
    lines: ['=-(6x^2-9x+2x-3)', '=-[3x(2x-3)+1(2x-3)]'], fin: '=-(2x-3)(3x+1)' },
  ex5c: { given: [[8, ''], [2, 'x'], [-3, 'x^2']], terms: [[-3, 'x^2'], [2, 'x'], [8, '']], g: '-1', neg: true, inner: [[3, 'x^2'], [-2, 'x'], [-8, '']], pill: 'ac=-24,\\ \\text{sum }-2:\\ -6,\\ 4',
    lines: ['=-(3x^2-6x+4x-8)', '=-[3x(x-2)+4(x-2)]'], fin: '=-(x-2)(3x+4)', alt: '\\text{or, in ascending order, }(2-x)(4+3x)' },
  ex5d: { terms: [[18, 'x^3'], [-33, 'x^2'], [-30, 'x']], g: '3x', div: '\\div 3x', inner: [[6, 'x^2'], [-11, 'x'], [-10, '']], pill: 'ac=-60,\\ \\text{sum }-11:\\ -15,\\ 4',
    lines: ['=3x(6x^2-15x+4x-10)', '=3x[3x(2x-5)+2(2x-5)]'], fin: '=3x(2x-5)(3x+2)' }
};
const termTex = (k, m, i) => (i ? `${sgn(k)}${mono(Math.abs(k), m)}` : mono(k, m));
const gcf = {
  title: 'GCF first',
  height: 446, capH: 86,
  choices: [{ v: 'why', label: 'Why GCF first?' }, { sep: 'Check:' }, { v: 'ex5a', label: 'Ex 5(a)' }, { v: 'ex5b', label: 'Ex 5(b)' }, { v: 'ex5c', label: 'Ex 5(c)' }, { v: 'ex5d', label: 'Ex 5(d)' }],
  ask: (v) => (v === 'why' ? `Factor ${T('12x^2+2x-4')} with and without taking out the GCF first.` : `Factor fully: ${T(poly(GF[v].given || GF[v].terms))}`),
  make(stage, v, ex) {
    if (v === 'why') return gcfWhy(stage, ex);
    const d = GF[v], TW = 128, TG = 26, TX = 30, TY = 18;
    const tiles = (d.given || d.terms).map(([k, m], i) => div(stage, 'u4l2-tile', T(termTex(k, m, i)), TX + i * (TW + TG), TY, TW, 54));
    const steps = [];
    if (d.given) {
      // reorder: the tile with x^2 moves first
      const order = d.terms.map(([k, m]) => d.given.findIndex(([k2, m2]) => k2 === k && m2 === m));
      steps.push({ cap: `First write it in <b>descending order</b>: ${T(poly(d.terms))}.`, run: async (c) => {
        await Promise.all(order.map((gi, ni) => anim(c, tiles[gi], [{ transform: 'none' }, { transform: `translateX(${(ni - gi) * (TW + TG)}px)` }], 650)));
        order.forEach((gi, ni) => { tiles[gi].innerHTML = T(termTex(d.terms[ni][0], d.terms[ni][1], ni)); });
      } });
    }
    const qs = d.inner.map(([k, m], i) => hide(div(stage, 'u4l2-tile u4l2-tile-q' + (d.neg ? ' u4l2-tile-flip' : ''), T(termTex(k, m, i)), TX + i * (TW + TG), TY + 104, TW, 54)));
    const arr = d.inner.map((x, i) => hide(div(stage, 'u4l2-tarr', d.neg ? T('\\div(-1)') : T(d.div), TX + i * (TW + TG), TY + 64, TW)));
    const gB = hide(div(stage, 'u4l2-gbadge', d.neg ? `${T('a<0')}: take out ${T('-1')}` : `GCF ${T('=' + d.g)}`, TX + 3 * (TW + TG) + 10, TY + 10));
    const pre = d.neg ? '-' : d.g;
    const LX = 40, LY = 196, LS = 50;
    const l0 = hide(div(stage, 'u4l2-wl', T(`=${pre}(${poly(d.inner)})`), LX, LY));
    const pill = hide(div(stage, 'u4l2-pill u4l2-pill-p', T(d.pill), 480, LY + 4));
    const ls = d.lines.map((s, i) => hide(div(stage, 'u4l2-wl', T(s), LX, LY + LS * (i + 1))));
    const fin = hide(div(stage, 'u4l2-wl u4l2-wfin', T(d.fin), LX, LY + LS * 3));
    const alt = d.alt ? hide(div(stage, 'u4l2-wl u4l2-walt', T(d.alt), LX + 360, LY + LS * 3 + 4)) : null;
    steps.push({ cap: d.neg ? `The leading coefficient is <b>negative</b>, so take out ${T('-1')}: <b>every sign flips</b>.` : `Every term has the factor ${T(d.g)}: that is the <b>GCF</b>. Take it out first.`, run: (c) => show(c, gB) });
    steps.push({ cap: d.neg ? `Divide each term by ${T('-1')}: ${d.inner.map(([k, m], i) => T(termTex(k, m, 0))).join(', ')}.` : `Divide each term by ${T(d.g)}.`, run: async (c) => {
      for (let i = 0; i < qs.length; i++) {
        await show(c, arr[i], 200);
        if (d.neg) await anim(c, qs[i], [{ opacity: 0, transform: 'rotateX(90deg)' }, { opacity: 1, transform: 'none' }], 420);
        else await pop(c, qs[i], 300);
      }
    } });
    steps.push({ cap: `So ${T(`${poly(d.terms)}=${pre}(${poly(d.inner)})`)}. The trinomial left is smaller.`, run: (c) => show(c, l0) });
    steps.push({ cap: `Decompose the trinomial in the brackets: ${T(d.pill.replace(/\\ /g, ' '))}.`, run: async (c) => { await show(c, pill); await show(c, ls[0]); } });
    steps.push({ cap: `Group and take out the common factors. Keep the ${d.neg ? T('-') : T(d.g)} in front.`, run: (c) => show(c, ls[1]) });
    steps.push({ cap: `Fully factored: ${T(d.fin.slice(1))}.`, run: async (c) => { await show(c, fin); await pulse(c, fin, 1.06); } });
    if (alt) steps.push({ cap: `In ascending order, put the ${T('-')} into the first bracket: ${T('-(x-2)=(2-x)')}, so ${T('(2-x)(4+3x)')} is also right.`, run: (c) => show(c, alt) });
    return steps;
  }
};
function gcfWhy(stage, ex) {
  const half = (ex.W - 30) / 2, LX = 14, RX = 14 + half + 10;
  const pa = div(stage, 'u4l2-panel u4l2-pbad', '<div class="u4l2-ph">Without the GCF</div>', LX, 10, half, 424);
  const pb = div(stage, 'u4l2-panel u4l2-pgood', '<div class="u4l2-ph">GCF first</div>', RX, 10, half, 424);
  const P1 = signedPairs(-48, 2), P2 = signedPairs(-12, 1);
  const a0 = div(pa, 'u4l2-wl u4l2-wl-sm', T('12x^2+2x-4,\\quad ac=-48'), 14, 40);
  const x1 = xHunt(pa, half, 424, 70, 160, 48, -48, 2, P1, 144, 200, 30);
  const a1 = hide(div(pa, 'u4l2-wl u4l2-wl-sm', T('12x^2-6x+8x-4'), 14, 266));
  const a2 = hide(div(pa, 'u4l2-wl u4l2-wl-sm', T('=6x(2x-1)+4(2x-1)'), 14, 304));
  const a3 = hide(div(pa, 'u4l2-wl u4l2-wl-sm', T('=(2x-1)(6x+4)'), 14, 342));
  const bad = hide(stamp(pa, 'not fully factored', { x: half / 2 + 60, y: 392, ok: false, size: 'sm' }));
  const b0 = hide(div(pb, 'u4l2-wl u4l2-wl-sm', T('=2(6x^2+x-2),\\quad ac=-12'), 14, 40));
  const x2 = xHunt(pb, half, 424, 70, 160, 48, -12, 1, P2, 144, 200, 30);
  const b1 = hide(div(pb, 'u4l2-wl u4l2-wl-sm', T('=2(6x^2+4x-3x-2)'), 14, 266));
  const b2 = hide(div(pb, 'u4l2-wl u4l2-wl-sm', T('=2[2x(3x+2)-1(3x+2)]'), 14, 304));
  const b3 = hide(div(pb, 'u4l2-wl u4l2-wl-sm u4l2-wfin', T('=2(3x+2)(2x-1)'), 14, 342));
  const good = hide(stamp(pb, 'fully factored', { x: half / 2 + 60, y: 392, size: 'sm' }));
  return [
    { cap: `Without the GCF, ${T('ac=12\\times(-4)=-48')} goes on top of the X: five factor pairs to check before ${T('-6+8=2')}.`, run: (c) => x1.play(c) },
    { cap: `${T('-6+8=2')}. Split, group, factor: ${T('(2x-1)(6x+4)')}.`, run: async (c) => { await show(c, a1); await show(c, a2); await show(c, a3); } },
    { cap: `<b>Not finished!</b> ${T('6x+4')} still has a common factor: ${T('6x+4=2(3x+2)')}.`, run: (c) => stampIn(c, bad) },
    { cap: `GCF first: ${T('12x^2+2x-4=2(6x^2+x-2)')}. Now ${T('ac=-12')}.`, run: (c) => show(c, b0) },
    { cap: `Smaller numbers on the X, fewer pairs: ${T('-3+4=1')} ✓`, run: (c) => x2.play(c) },
    { cap: `${T('=2(3x+2)(2x-1)')}: <b>fully factored</b>, and the same as ${T('(2x-1)(6x+4)')} once the 2 is taken out.`, run: async (c) => { await show(c, b1); await show(c, b2); await show(c, b3); await stampIn(c, good); } }
  ];
}

/* =============================== explainer: rational coefficients =============================== */
const FMS = ['x^2', 'x', ''];
const coT = (n, dd, i) => { const sg = n < 0 ? '-' : i ? '+' : '', a = Math.abs(n); return sg + (dd === 1 ? (a === 1 && FMS[i] ? '' : String(a)) : `\\tfrac{${a}}{${dd}}`) + FMS[i]; };
const fr = (n, d) => (d === 1 ? String(n) : `${n < 0 ? '-' : ''}\\tfrac{${Math.abs(n)}}{${d}}`);
const FR = {
  key: { co: [[1, 2], [-1, 1], [-4, 1]], out: [1, 2], by: '\\times 2', why: `${T('\\div\\tfrac12')} is ${T('\\times 2')}`, inner: [1, -2, -8], pill: '\\text{product }-8,\\ \\text{sum }-2:\\ -4,\\ 2', fin: '\\tfrac{1}{2}(x-4)(x+2)' },
  ex7a: { co: [[1, 2], [1, 1], [-12, 1]], out: [1, 2], by: '\\times 2', why: `${T('\\div\\tfrac12')} is ${T('\\times 2')}`, inner: [1, 2, -24], pill: '\\text{product }-24,\\ \\text{sum }2:\\ 6,\\ -4', fin: '\\tfrac{1}{2}(x+6)(x-4)' },
  ex7b: { co: [[3, 4], [-3, 1], [-24, 1]], out: [3, 4], by: '\\times\\tfrac43', why: `${T('\\div\\tfrac34')} is ${T('\\times\\tfrac43')}: ${T('3\\div\\tfrac34=4')}, ${T('24\\div\\tfrac34=32')}`, inner: [1, -4, -32], pill: '\\text{product }-32,\\ \\text{sum }-4:\\ -8,\\ 4', fin: '\\tfrac{3}{4}(x-8)(x+4)' },
  ex7c: { co: [[1, 2], [5, 4], [1, 2]], out: [1, 4], lcd: true, by: '\\times 4', why: `denominators 2, 4, 2: LCD 4, take out ${T('\\tfrac14')}`, inner: [2, 5, 2], pill: 'ac=4,\\ \\text{sum }5:\\ 4,\\ 1', fin: '\\tfrac{1}{4}(2x+1)(x+2)' }
};
const fracs = {
  title: 'Taking out a fraction',
  height: 420,
  choices: [{ v: 'key', label: '½x² − x − 4' }, { sep: 'Check:' }, { v: 'ex7a', label: 'Ex 7(a)' }, { v: 'ex7b', label: 'Ex 7(b)' }, { v: 'ex7c', label: 'Ex 7(c)' }],
  ask: (v) => `Factor fully: ${T(FR[v].co.map(([n, dd], i) => coT(n, dd, i)).join(''))}`,
  make(stage, v, ex) {
    const d = FR[v], ms = ['x^2', 'x', ''], TW = 150, TG = 34, TX = 40, TY = 20;
    const outT = fr(d.out[0], d.out[1]);
    const tiles = d.co.map(([n, dd], i) => div(stage, 'u4l2-tile', T(coT(n, dd, i)), TX + i * (TW + TG), TY, TW, 60));
    const arr = d.co.map((x, i) => hide(div(stage, 'u4l2-tarr', T(d.by), TX + i * (TW + TG), TY + 70, TW)));
    const qs = d.inner.map((k, i) => hide(div(stage, 'u4l2-tile u4l2-tile-q', T(termTex(k, ms[i], i)), TX + i * (TW + TG), TY + 106, TW, 56)));
    const whyB = hide(div(stage, 'u4l2-gbadge u4l2-gbadge-w', `take out ${T(outT)}: ${d.why}`, TX + 3 * (TW + TG) - 6, TY + 10, ex.W - (TX + 3 * (TW + TG)) - 14));
    const inner = poly(d.inner.map((k, i) => [k, ms[i]]));
    const LX = 40, LY = 214;
    const l0 = hide(div(stage, 'u4l2-wl', T(`=${outT}(${inner})`), LX, LY));
    const pill = hide(div(stage, 'u4l2-pill u4l2-pill-p', T(d.pill), 420, LY + 4));
    const fin = hide(div(stage, 'u4l2-wl u4l2-wfin', T(`=${d.fin}`), LX, LY + 58));
    const par = (k, m) => (k < 0 ? `(${mono(k, m)})` : mono(k, m));
    const chk = hide(div(stage, 'u4l2-note', `<b>Check:</b> ${d.inner.map((k, i) => T(`${outT}\\times ${par(k, ms[i])}=${coT(d.co[i][0], d.co[i][1], 0)}`)).join(', &nbsp;')}: the original terms ✓`, LX, LY + 128, ex.W - 2 * LX));
    const steps = [];
    steps.push({ cap: d.lcd ? `The denominators are 2, 4 and 2. Their LCD is 4, so take out ${T('\\tfrac14')}: integers will be left in the brackets.` : `Take out ${T(outT)}, the fraction in front of ${T('x^2')}, so integers are left in the brackets.`, run: (c) => show(c, whyB) });
    steps.push({ cap: `Divide each term by ${T(outT)}: that is the same as ${T(d.by)}.`, run: async (c) => { for (let i = 0; i < 3; i++) { await show(c, arr[i], 200); await pop(c, qs[i], 300); } } });
    steps.push({ cap: `${T(`${coT(d.co[0][0], d.co[0][1], 0)}${d.co.slice(1).map(([n, dd], i) => coT(n, dd, i + 1)).join('')}=${outT}(${inner})`)}.`, run: (c) => show(c, l0) });
    steps.push({ cap: `Factor the trinomial in the brackets: ${T(d.pill)}.`, run: async (c) => { await show(c, pill); await show(c, fin); await pulse(c, fin, 1.05); } });
    steps.push({ cap: `Check: multiply each term in the brackets by ${T(outT)} to get the original terms back.`, run: (c) => show(c, chk) });
    return steps;
  }
};

/* =============================== explainer: the perfect-square test =============================== */
const PS = {
  i: { trin: '9x^2+12x+4', rows: [['First term a square?', '9x^2=(3x)^2', true, 'A=3x'], ['Last term a square (and positive)?', '4=2^2', true, 'B=2'], ['Middle term', '2(3x)(2)=12x', true, '']], res: '(3x+2)^2' },
  ii: { trin: 'x^2-10x+16', rows: [['First term a square?', 'x^2=(x)^2', true, 'A=x'], ['Last term a square (and positive)?', '16=4^2', true, 'B=4'], ['Middle term', '2(x)(4)=8x\\ne10x', false, '']], res: null, note: `It still factors, ${T('(x-2)(x-8)')}, just not as a square.` },
  iii: { trin: '25x^2-20xy+4y^2', rows: [['First term a square?', '25x^2=(5x)^2', true, 'A=5x'], ['Last term a square (and positive)?', '4y^2=(2y)^2', true, 'B=2y'], ['Middle term', '2(5x)(2y)=20xy', true, '\\text{minus}']], res: '(5x-2y)^2' },
  iv: { trin: '4x^2+6x+9', rows: [['First term a square?', '4x^2=(2x)^2', true, 'A=2x'], ['Last term a square (and positive)?', '9=3^2', true, 'B=3'], ['Middle term', '2(2x)(3)=12x\\ne6x', false, '']], res: null },
  neg: { trin: 'x^2+6x-9', rows: [['First term a square?', 'x^2=(x)^2', true, 'A=x'], ['Last term a square (and positive)?', '-9\\text{ is negative}', false, '']], res: null, note: `A square is never negative, so the last term of a perfect square is <b>positive</b>.` },
  ex9a: { trin: '64x^2-48x+9', rows: [['First term a square?', '64x^2=(8x)^2', true, 'A=8x'], ['Last term a square (and positive)?', '9=3^2', true, 'B=3'], ['Middle term', '2(8x)(3)=48x', true, '\\text{minus}']], res: '(8x-3)^2' },
  ex9b: { trin: '2x^3+20x^2+50x', gcf: '2x(x^2+10x+25)', rows: [['First term a square?', 'x^2=(x)^2', true, 'A=x'], ['Last term a square (and positive)?', '25=5^2', true, 'B=5'], ['Middle term', '2(x)(5)=10x', true, '']], res: '2x(x+5)^2' }
};
const psTest = {
  title: 'Is it a perfect square?',
  height: 380,
  choices: [{ v: 'neg', label: 'x² + 6x − 9' }, { sep: 'Check:' }, { v: 'i', label: '8(a)(i)' }, { v: 'ii', label: '(ii)' }, { v: 'iii', label: '(iii)' }, { v: 'iv', label: '(iv)' }, { v: 'blank', label: '8(b) blanks' }, { v: 'ex9a', label: '9(a)' }, { v: 'ex9b', label: '9(b)' }],
  ask: (v) => (v === 'blank' ? 'Fill in the blank so that each trinomial is a perfect square.' : v === 'ex9b' ? `Factor fully: ${T(PS[v].trin)}` : `Is ${T(PS[v].trin)} a perfect-square trinomial?`),
  make(stage, v, ex) {
    if (v === 'blank') return psBlanks(stage, ex);
    const d = PS[v], steps = [];
    const top = div(stage, 'u4l2-wl u4l2-big', T(d.trin), 26, 14);
    const gl = d.gcf ? hide(div(stage, 'u4l2-wl', T('=' + d.gcf), 360, 20)) : null;
    if (gl) steps.push({ cap: `GCF first: ${T(`${d.trin}=${d.gcf}`)}. Test the trinomial in the brackets.`, run: (c) => show(c, gl) });
    const RY = 82, RH = 64;
    d.rows.forEach(([q, w, ok, note], i) => {
      const r = hide(div(stage, 'u4l2-psrow', `<div class="u4l2-psq">${q}</div><div class="u4l2-psw">${T(w)}</div><div class="u4l2-psn">${note ? T(note) : ''}</div><div class="u4l2-psm ${ok ? 'u4l2-yes' : 'u4l2-no'}">${ok ? '✓' : '✗'}</div>`, 26, RY + i * RH, ex.W - 52, RH - 10));
      steps.push({ cap: i === 2 ? `Is the middle term ${T('2AB')}? ${T(w)}${ok ? (note ? ` ✓, and it is <b>negative</b>, so the bracket has a minus.` : ' ✓') : ': <b>no</b>.'}` : `${q} ${T(w)}${ok ? ` ✓ &nbsp; ${T(note)}` : ': <b>no</b>.'}`, run: (c) => show(c, r) });
    });
    const yes = !!d.res, st = hide(stamp(stage, yes ? 'perfect square' : 'not a perfect square', { x: 180, y: RY + 3 * RH + 40, ok: yes }));
    const res = yes ? hide(div(stage, 'u4l2-wl u4l2-wfin', T(`${d.trin}=${d.res}`), 380, RY + 3 * RH + 20)) : (d.note ? hide(div(stage, 'u4l2-note', d.note, 380, RY + 3 * RH + 10, ex.W - 410)) : null);
    steps.push({ cap: yes ? `<b>Yes:</b> ${T(`${d.trin}=${d.res}`)}.` : `<b>No</b>, it is not a perfect square.${d.note ? ' ' + d.note : ''}`, run: async (c) => { await stampIn(c, st); if (res) await show(c, res); } });
    return steps;
  }
};
function psBlanks(stage, ex) {
  const rows = [
    { q: 'x^2-\\boxed{\\phantom{18x}}+81', w: 'A=x,\\ B=9:\\ 2AB=2(x)(9)=18x', a: 'x^2-\\boxed{18x}+81' },
    { q: '16x^2+40x+\\boxed{\\phantom{25}}', w: 'A=4x:\\ 40x=2(4x)B\\Rightarrow B=5,\\ B^2=25', a: '16x^2+40x+\\boxed{25}' },
    { q: '\\boxed{\\phantom{9x^2}}+42x+49', w: 'B=7:\\ 42x=2A(7)\\Rightarrow A=3x,\\ A^2=9x^2', a: '\\boxed{9x^2}+42x+49' }
  ];
  const steps = [];
  rows.forEach((r, i) => {
    const y = 26 + i * 112;
    const q = div(stage, 'u4l2-wl', T(r.q), 30, y);
    const w = hide(div(stage, 'u4l2-pill u4l2-pill-p', T(r.w), 360, y + 4));
    steps.push({ cap: `${T(r.w)}.`, run: async (c) => { await show(c, w); q.innerHTML = T(r.a); await pop(c, q, 360); } });
  });
  return steps;
}

/* =============================== Stand Up Break =============================== */
const lin = (p, q, X = 'x') => bin(p, X, q);
function makeTri(r, signed) {
  for (let tries = 0; tries < 200; tries++) {
    const p = r.pick([1, 2, 3, 5]), rr = r.pick([1, 2, 3, 4, 5]);
    if (p * rr === 1 || p * rr > 20) continue;
    const q = signed ? r.int(1, 7) * r.sign() : r.int(1, 7), s = signed ? r.int(1, 7) * r.sign() : r.int(1, 7);
    if (gcd(p, q) !== 1 || gcd(rr, s) !== 1) continue;
    const a = p * rr, b = p * s + q * rr, c = q * s;
    if (b === 0) continue;
    return { p, q, rr, s, a, b, c, m: p * s, n: q * rr };
  }
  return { p: 2, q: 1, rr: 1, s: 3, a: 2, b: 7, c: 3, m: 6, n: 1 };
}
const triSteps = (t, X = 'x') => {
  const X2 = X + '^2', { a, b, c, m, n, p, q, rr, s } = t;
  return [
    `ac=${a * c},\\ \\text{sum }${b}:\\ ${m},\\ ${n}`,
    `${poly([[a, X2], [m, X], [n, X], [c, '']])}`,
    `=${mono(p, X)}${lin(rr, s, X)}${q < 0 ? '-' : '+'}${Math.abs(q)}${lin(rr, s, X)}`,
    `=${lin(rr, s, X)}${lin(p, q, X)}`
  ];
};
standup('u4l2', {
  intro: 'At your whiteboard: find two numbers with product ac and sum b, split the middle term, group, and check by expanding.',
  levels: {
    BEG: (r) => { const t = makeTri(r, false), X = r.pick(['x', 'x', 'm', 'n']); return { q: `\\text{Factor: }${poly([[t.a, X + '^2'], [t.b, X], [t.c, '']])}`, a: triSteps(t, X) }; },
    PRG: (r) => { const t = makeTri(r, true), X = r.pick(['x', 'x', 'a', 'y']); return { q: `\\text{Factor: }${poly([[t.a, X + '^2'], [t.b, X], [t.c, '']])}`, a: triSteps(t, X) }; },
    MAS: (r) => {
      const t = makeTri(r, true), k = r.pick([2, 3, 5, -1, -2, -3]), X = 'x';
      const full = poly([[k * t.a, X + '^2'], [k * t.b, X], [k * t.c, '']]), pre = k === -1 ? '-' : String(k);
      const st = triSteps(t, X);
      return { q: `\\text{Factor fully: }${full}`,
        a: [`=${pre}(${poly([[t.a, X + '^2'], [t.b, X], [t.c, '']])})`, st[0], `=${pre}${lin(t.rr, t.s, X)}${lin(t.p, t.q, X)}`] };
    }
  }
});

/* =============================== mount =============================== */
export const explainers = mountExplainers({ hunt, guess, gcf, fracs, psTest });
export const _test = { poly, mono, bin, signedPairs, HU, HN, GF, FR, PS };
