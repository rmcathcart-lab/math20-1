/* Math 20-1 · Unit 2 · Lesson 7 — Unit 2 Review (no calculator: exact answers).
 * The warm-up is plain markup in the page (tools/newformat/specs/u2l7.py). Explainers:
 *   whichOp (choosing the operation: a flowchart lights the path + / × / ÷ → the right method, the work panel does it;
 *     summary-table and Example 3(a), 4(a), 4(b), 5(a), 5(c), 6(a) checks),
 *   inspector (STAR: the simplest-form inspector — an expression on the bench passes the five checks in working order;
 *     each failed check lights red, then fixes itself, and a fix that makes new radicands sends it back to be re-checked;
 *     a concept chip that fails every check, the summary's 3/√6, and Example 2(b)(i), 3(c), 5(d), 5(e), 6(c), 8(b)),
 *   order (Example 1: every number becomes an entire radical with the same index, then sits on a radicand line),
 *   restrict (Example 2(a): solve radicand ≥ 0 (> 0 in a denominator), shade the number line, test a value),
 *   ratIrr (Example 8(a): simplify, then sort each number into a rational or an irrational bin; surprise products).
 * Colours: perfect-power factor / what comes out amber, like radicals blue, conjugates purple, errors red, fixes green,
 *   radicand rose (the course's #a33357). */
import {
  h, tex, add, box, Box, Flowchart, NumberLine, stamp, stampIn, mountExplainers, pop, fadeIn, appear, sleep,
  svgEl, liveCtx, pulse, drawIn, anim, shake, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const RED = COLORS.red, GRN = COLORS.green, AMB = COLORS.amber, BLU = COLORS.blue, ROSE = COLORS.teal, PUR = COLORS.purple, GRAY = COLORS.gray;
const cR = (s) => `\\textcolor{${RED}}{${s}}`, cG = (s) => `\\textcolor{${GRN}}{${s}}`, cA = (s) => `\\textcolor{${AMB}}{${s}}`;
const cB = (s) => `\\textcolor{${BLU}}{${s}}`, cP = (s) => `\\textcolor{${PUR}}{${s}}`, cT = (s) => `\\textcolor{${ROSE}}{${s}}`;
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const panel = (stage, x, y, w, hh, title, cls = '') => add(stage, box(h('div', 'u2l7-panel ' + cls, title ? `<div class="u2l7-ph">${title}</div>` : ''), w, hh), x, y);
const line = (p, html, cls = '') => { const d = h('div', 'u2l7-line ' + cls, html); p.appendChild(d); return d; };
const lab = (B, x, y, html, cls = '', pos = 'c') => B.hlabel(x, y, html, { cls: 'u2l7-lab ' + cls, pos, gap: 0 });
const div = (stage, cls, html, x, y, w, hh) => add(stage, box(h('div', cls, html), w, hh), x, y);
/** move el to (x, y) with a FLIP animation (instant in a fast replay) */
async function flyTo(c, el, x, y, ms = 520, extra = '') {
  const x0 = parseFloat(el.style.left) || 0, y0 = parseFloat(el.style.top) || 0;
  el.style.left = x + 'px'; el.style.top = y + 'px';
  await anim(c, el, [{ transform: `translate(${x0 - x}px, ${y0 - y}px) ${extra}` }, { transform: 'none' }], ms);
}
/** replace an element's html with a quick cross-fade */
async function swap(c, el, html) {
  await anim(c, el, [{ opacity: 1 }, { opacity: 0 }], 160);
  el.innerHTML = html;
  await anim(c, el, [{ opacity: 0 }, { opacity: 1 }], 240);
}
const putStamp = (stage, text, x, y, o = {}) => hide(stamp(stage, text, Object.assign({ ok: true, x, y }, o)));
const stampOn = async (c, st) => { st.style.opacity = 1; await stampIn(c, st); };

/* =============================== explainer: choosing the operation =============================== */
const WO = {
  tbl: { label: 'Summary: ' + T('2\\sqrt{3}\\cdot5\\sqrt{6}'), q: '2\\sqrt{3}\\cdot5\\sqrt{6}', op: 'mul', leaf: 'mm',
    work: ['=(2\\cdot5)\\sqrt{3\\cdot6}', '=10\\sqrt{18}', '=10(3\\sqrt{2})', '=30\\sqrt{2}'],
    c1: `A <b>times</b> sign, and each factor is a single term.`, c2: `<b>Multiply</b>, term by term.`,
    c3: `Coefficients together, radicands together: ${T('2\\cdot5=10')} and ${T('\\sqrt{3\\cdot6}=\\sqrt{18}')}.`,
    c4: `${T('18=9\\cdot2')} hides a perfect square: ${T('10\\sqrt{18}=10(3\\sqrt{2})')}.`, c5: `Check it’s finished: ${T('30\\sqrt{2}')} is in simplest form.` },
  sep: { sep: 'Example checks:' },
  e3a: { label: '3(a)', q: '2\\sqrt{50}-3\\sqrt{18}+\\sqrt{32}', op: 'add', leaf: 'la',
    work: ['=2(5\\sqrt{2})-3(3\\sqrt{2})+4\\sqrt{2}', '=10\\sqrt{2}-9\\sqrt{2}+4\\sqrt{2}', '=5\\sqrt{2}'],
    c1: `<b>Plus and minus</b> signs between the terms.`, c2: `So we add and subtract. But ${T('\\sqrt{50}')}, ${T('\\sqrt{18}')} and ${T('\\sqrt{32}')} don’t look alike yet…`,
    c3: `Simplify every radical first: ${T('50=25\\cdot2')}, ${T('18=9\\cdot2')}, ${T('32=16\\cdot2')}.`,
    c4: `Now they are all like radicals (${T('\\sqrt{2}')}): ${T('10-9+4=5')}.`, c5: `Finished: ${T('5\\sqrt{2}')}.` },
  e4a: { label: '4(a)', q: '3\\sqrt{2}\\left(4\\sqrt{6}-\\sqrt{10}\\right)', op: 'mul', leaf: 'mb',
    work: ['=12\\sqrt{12}-3\\sqrt{20}', '=12(2\\sqrt{3})-3(2\\sqrt{5})', '=24\\sqrt{3}-6\\sqrt{5}'],
    c1: `A term <b>times</b> a bracket.`, c2: `<b>Multiply</b>: the bracket has two terms.`,
    c3: `Distribute: ${T('3\\sqrt{2}')} times each term. ${T('12\\sqrt{12}')} and ${T('-3\\sqrt{20}')}.`,
    c4: `Simplify each radical: ${T('\\sqrt{12}=2\\sqrt{3}')}, ${T('\\sqrt{20}=2\\sqrt{5}')}.`, c5: `${T('\\sqrt{3}')} and ${T('\\sqrt{5}')} are unlike, so ${T('24\\sqrt{3}-6\\sqrt{5}')} is finished.` },
  e4b: { label: '4(b)', q: '\\left(2\\sqrt{3}-\\sqrt{5}\\right)\\left(\\sqrt{3}+4\\sqrt{5}\\right)', op: 'mul', leaf: 'mb',
    work: ['=2(3)+8\\sqrt{15}-\\sqrt{15}-4(5)', '=6+7\\sqrt{15}-20', '=-14+7\\sqrt{15}'],
    c1: `Two brackets side by side: they are <b>multiplied</b>.`, c2: `<b>Multiply</b>, two terms by two terms.`,
    c3: `Every term times every term (four products): ${T('2\\sqrt{3}\\cdot\\sqrt{3}=2(3)')}, …`,
    c4: `Collect like terms: ${T('8\\sqrt{15}-\\sqrt{15}=7\\sqrt{15}')} and ${T('6-20=-14')}.`, c5: `Finished: ${T('-14+7\\sqrt{15}')}.` },
  e5a: { label: '5(a)', q: '\\dfrac{10\\sqrt{42}}{5\\sqrt{6}}', op: 'div', leaf: 'dm',
    work: ['=\\dfrac{10}{5}\\sqrt{\\dfrac{42}{6}}', '=2\\sqrt{7}'],
    c1: `A fraction bar: <b>divide</b>.`, c2: `<b>Divide</b>: the denominator is one term.`,
    c3: `Coefficients divide, radicands divide: ${T('\\tfrac{10}{5}=2')} and ${T('\\tfrac{42}{6}=7')}.`,
    c4: `No radical is left in the denominator, so there is nothing to rationalize.`, c5: `Finished: ${T('2\\sqrt{7}')}.` },
  e5c: { label: '5(c)', q: '\\dfrac{15}{2\\sqrt{3}}', op: 'div', leaf: 'dm',
    work: ['=\\dfrac{15}{2\\sqrt{3}}\\cdot\\dfrac{\\sqrt{3}}{\\sqrt{3}}', '=\\dfrac{15\\sqrt{3}}{6}', '=\\dfrac{5\\sqrt{3}}{2}'],
    c1: `A fraction with a radical in the denominator.`, c2: `<b>Divide</b>: the denominator is one term.`,
    c3: `15 doesn’t divide by ${T('\\sqrt{3}')}, so rationalize: multiply by ${T('\\dfrac{\\sqrt{3}}{\\sqrt{3}}')}.`,
    c4: `${T('2\\sqrt{3}\\cdot\\sqrt{3}=2(3)=6')}, then reduce ${T('\\tfrac{15}{6}=\\tfrac{5}{2}')}.`, c5: `Finished: ${T('\\dfrac{5\\sqrt{3}}{2}')}.` },
  e6a: { label: '6(a)', q: '\\dfrac{8}{\\sqrt{7}-\\sqrt{3}}', op: 'div', leaf: 'db',
    work: ['=\\dfrac{8}{\\sqrt{7}-\\sqrt{3}}\\cdot\\dfrac{\\sqrt{7}+\\sqrt{3}}{\\sqrt{7}+\\sqrt{3}}', '=\\dfrac{8(\\sqrt{7}+\\sqrt{3})}{7-3}', '=2(\\sqrt{7}+\\sqrt{3})', '=2\\sqrt{7}+2\\sqrt{3}'],
    c1: `A fraction whose denominator has <b>two terms</b> with radicals.`, c2: `<b>Divide</b>: the denominator is a binomial.`,
    c3: `Multiply top and bottom by the <b>conjugate</b> ${T(cP('\\sqrt{7}+\\sqrt{3}'))} (middle sign changed).`,
    c4: `The bottom becomes ${T('7-3=4')}, and ${T('\\tfrac{8}{4}=2')}.`, c5: `Finished: ${T('2\\sqrt{7}+2\\sqrt{3}')}.` }
};
const WO_NODES = {
  q0: { x: 306, y: 30, w: 440, h: 52, html: '<b>What joins the radicals?</b>look at the signs', cls: 'bk-diamond' },
  add: { x: 60, y: 118, w: 116, h: 50, html: `<b>${T('+')} or ${T('-')}</b>`, color: BLU },
  mul: { x: 244, y: 118, w: 180, h: 50, html: `<b>${T('\\times')} multiply</b>`, color: GRN },
  div: { x: 490, y: 118, w: 180, h: 50, html: `<b>${T('\\div')} divide</b>`, color: PUR },
  la: { x: 60, y: 246, w: 116, h: 124, html: '<b>Combine</b>simplify each radical, then add like radicals', color: BLU },
  mm: { x: 183, y: 246, w: 116, h: 124, html: '<b>Term × term</b>coefficients together, radicands together', color: GRN },
  mb: { x: 306, y: 246, w: 116, h: 124, html: '<b>Distribute</b>every term times every term', color: GRN },
  dm: { x: 429, y: 246, w: 116, h: 124, html: '<b>One-term bottom</b>divide; rationalize with its radical', color: PUR },
  db: { x: 552, y: 246, w: 116, h: 124, html: '<b>Two-term bottom</b>multiply by the conjugate', color: PUR },
  fin: { x: 306, y: 384, w: 600, h: 48, html: '<b>Then: simplest-form check</b>', cls: 'bk-round' }
};
const WO_EDGES = [
  { from: 'q0', to: 'add' }, { from: 'q0', to: 'mul' }, { from: 'q0', to: 'div' }, { from: 'add', to: 'la' },
  { from: 'mul', to: 'mm' }, { from: 'mul', to: 'mb' }, { from: 'div', to: 'dm' }, { from: 'div', to: 'db' },
  ...['la', 'mm', 'mb', 'dm', 'db'].map((k) => ({ from: k, to: 'fin', pts: [[WO_NODES[k].x, 311], [WO_NODES[k].x, 357]] }))
];
const whichOp = {
  title: 'Choosing the operation',
  height: 412,
  minW: 960,
  choices: Object.keys(WO).map((k) => (WO[k].sep ? WO[k] : { v: k, label: WO[k].label })),
  ask: (k) => `Simplify ${T(WO[k].q)}`,
  intro: 'Read the signs, follow the chart, then do the work. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = WO[k], W = ex.W, opNode = d.op;
    const F = new Flowchart(stage, { x: 0, y: 2, width: 612, height: 410, nodes: WO_NODES, edges: WO_EDGES, cls: 'u2l7-fc' });
    const PX = 628, P = panel(stage, PX, 2, W - PX - 2, 408, 'Work', 'u2l7-work');
    const q = hide(line(P, T(d.q), 'u2l7-wq'));
    const wl = d.work.map((s) => hide(line(P, T(s), 'u2l7-ws')));
    const st = putStamp(stage, 'simplest form', PX + (W - PX) / 2, 372, { size: 'sm' });
    return [
      { cap: `<b>What joins the radicals?</b> ${d.c1}`, run: async (c) => { await F.visit(c, 'q0'); await show(c, q); } },
      { cap: d.c2, run: async (c) => { await F.go(c, 'q0', opNode); await F.visit(c, opNode); } },
      { cap: d.c3, run: async (c) => { await F.go(c, opNode, d.leaf); await F.visit(c, d.leaf); await show(c, wl[0]); } },
      { cap: d.c4, run: async (c) => { for (const l of wl.slice(1)) await show(c, l); } },
      { cap: d.c5, run: async (c) => { await F.go(c, d.leaf, 'fin'); await F.visit(c, 'fin'); await stampOn(c, st); } }
    ];
  }
};

/* =============================== explainer: the simplest-form inspector (star) =============================== */
const GATES = [
  { t: 'Fraction under a root?', s: `split it: ${T('\\sqrt{\\tfrac{a}{b}}=\\tfrac{\\sqrt{a}}{\\sqrt{b}}')}` },
  { t: 'Perfect-power factor?', s: 'take it out of the radicand' },
  { t: 'Radical in a denominator?', s: 'rationalize it' },
  { t: 'Like radicals? Fraction to reduce?', s: 'combine them, reduce it' },
  { t: 'Restrictions stated?', s: 'for every variable' }
];
/* visits: { g: gate (0–4), ok, bad (the expression with the problem in red), work: [extra trail lines], to (the fixed
 * expression), cap }; an expression can come back to a gate (re: true) when a fix made something new. */
const INS = {
  all: { label: 'Every check fails', q: '\\sqrt{\\dfrac{50}{x}}+\\dfrac{\\sqrt{2x}}{x}', final: '\\dfrac{6\\sqrt{2x}}{x},\\ \\ x>0',
    visits: [
      { g: 0, bad: `${cR('\\sqrt{\\dfrac{50}{x}}')}+\\dfrac{\\sqrt{2x}}{x}`, to: '\\dfrac{\\sqrt{50}}{\\sqrt{x}}+\\dfrac{\\sqrt{2x}}{x}',
        cap: `<b>Check 1 fails:</b> a fraction under a root. Split it into two roots: ${T('\\sqrt{\\tfrac{50}{x}}=\\tfrac{\\sqrt{50}}{\\sqrt{x}}')}.` },
      { g: 1, bad: `\\dfrac{${cR('\\sqrt{50}')}}{\\sqrt{x}}+\\dfrac{\\sqrt{2x}}{x}`, to: '\\dfrac{5\\sqrt{2}}{\\sqrt{x}}+\\dfrac{\\sqrt{2x}}{x}',
        cap: `<b>Check 2 fails:</b> ${T('50=' + cA('25') + '\\cdot2')} has a perfect square. Take it out: ${T('\\sqrt{50}=5\\sqrt{2}')}.` },
      { g: 2, bad: `\\dfrac{5\\sqrt{2}}{${cR('\\sqrt{x}')}}+\\dfrac{\\sqrt{2x}}{x}`, work: ['\\dfrac{5\\sqrt{2}}{\\sqrt{x}}\\cdot\\dfrac{\\sqrt{x}}{\\sqrt{x}}=\\dfrac{5\\sqrt{2x}}{x}'], to: '\\dfrac{5\\sqrt{2x}}{x}+\\dfrac{\\sqrt{2x}}{x}',
        cap: `<b>Check 3 fails:</b> ${T('\\sqrt{x}')} in a denominator. Multiply by ${T('\\tfrac{\\sqrt{x}}{\\sqrt{x}}')}: ${T('\\sqrt{x}\\cdot\\sqrt{x}=x')}.` },
      { g: 3, bad: `${cR('\\dfrac{5\\sqrt{2x}}{x}+\\dfrac{\\sqrt{2x}}{x}')}`, to: '\\dfrac{6\\sqrt{2x}}{x}',
        cap: `<b>Check 4 fails:</b> two like radicals over the same denominator. Combine: ${T('5+1=6')}.` },
      { g: 4, bad: `\\dfrac{6\\sqrt{2${cR('x')}}}{${cR('x')}}`, to: '\\dfrac{6\\sqrt{2x}}{x},\\ \\ x>0',
        cap: `<b>Check 5 fails:</b> no restriction yet. ${T('x')} is under a square root (${T('x\\ge0')}) and in a denominator (${T('x\\ne0')}): ${T('x>0')}.` }
    ] },
  tbl: { label: 'Summary: ' + T('\\tfrac{3}{\\sqrt{6}}'), q: '\\dfrac{3}{\\sqrt{6}}', final: '\\dfrac{\\sqrt{6}}{2}',
    visits: [
      { g: 0, ok: true, cap: `<b>Check 1 passes:</b> there is no fraction <b>under</b> the root (the root is in the denominator, which is check 3).` },
      { g: 1, ok: true, cap: `<b>Check 2 passes:</b> ${T('6=2\\cdot3')} has no perfect-square factor.` },
      { g: 2, bad: `\\dfrac{3}{${cR('\\sqrt{6}')}}`, work: ['\\dfrac{3}{\\sqrt{6}}\\cdot\\dfrac{\\sqrt{6}}{\\sqrt{6}}'], to: '\\dfrac{3\\sqrt{6}}{6}',
        cap: `<b>Check 3 fails:</b> ${T('\\sqrt{6}')} in the denominator. Multiply by ${T('\\tfrac{\\sqrt{6}}{\\sqrt{6}}')}: ${T('\\sqrt{6}\\cdot\\sqrt{6}=6')}.` },
      { g: 3, bad: `\\dfrac{${cR('3')}\\sqrt{6}}{${cR('6')}}`, to: '\\dfrac{\\sqrt{6}}{2}',
        cap: `<b>Check 4 fails:</b> ${T('\\tfrac{3}{6}')} reduces to ${T('\\tfrac{1}{2}')}. Students often stop one step early here!` },
      { g: 4, ok: true, cap: `<b>Check 5 passes:</b> no variables, so no restrictions.` }
    ] },
  sep: { sep: 'Example checks:' },
  e2b: { label: '2(b)(i)', q: '\\sqrt{75x^4y^7}', final: '5x^2y^3\\sqrt{3y}',
    visits: [
      { g: 0, ok: true, cap: `<b>Check 1 passes:</b> no fraction under the root.` },
      { g: 1, bad: `\\sqrt{${cR('75x^4y^7')}}`, work: ['\\sqrt{25x^4y^6}\\cdot\\sqrt{3y}'], to: '5x^2y^3\\sqrt{3y}',
        cap: `<b>Check 2 fails:</b> ${T(cA('25') + '\\cdot3')}, ${T(cA('x^4'))} and ${T(cA('y^6') + '\\cdot y')} are perfect squares. Take them out: ${T('5x^2y^3')}.` },
      { g: 2, ok: true, cap: `<b>Check 3 passes:</b> no denominator at all.` },
      { g: 3, ok: true, cap: `<b>Check 4 passes:</b> one term, nothing to combine.` },
      { g: 4, ok: true, cap: `<b>Check 5 passes:</b> the question already says ${T('x,\\ y\\ge0')}.` }
    ] },
  e3c: { label: '3(c)', q: '\\sqrt{12x^3}-x\\sqrt{27x}+5\\sqrt{3x^3}', final: '4x\\sqrt{3x}',
    visits: [
      { g: 0, ok: true, cap: `<b>Check 1 passes:</b> no fractions under the roots.` },
      { g: 1, bad: `${cR('\\sqrt{12x^3}')}-x${cR('\\sqrt{27x}')}+5${cR('\\sqrt{3x^3}')}`, to: '2x\\sqrt{3x}-3x\\sqrt{3x}+5x\\sqrt{3x}',
        cap: `<b>Check 2 fails:</b> ${T('12x^3=' + cA('4x^2') + '\\cdot3x')}, ${T('27x=' + cA('9') + '\\cdot3x')}, ${T('3x^3=' + cA('x^2') + '\\cdot3x')}. Take the squares out.` },
      { g: 2, ok: true, cap: `<b>Check 3 passes:</b> no denominators.` },
      { g: 3, bad: `${cR('2x\\sqrt{3x}-3x\\sqrt{3x}+5x\\sqrt{3x}')}`, to: '4x\\sqrt{3x}',
        cap: `<b>Check 4 fails:</b> three like radicals, all ${T('x\\sqrt{3x}')}. Combine: ${T('2-3+5=4')}.` },
      { g: 4, ok: true, cap: `<b>Check 5 passes:</b> the question says ${T('x\\ge0')}.` }
    ] },
  e5d: { label: '5(d)', q: '\\dfrac{6}{\\sqrt[3]{9}}', final: '2\\sqrt[3]{3}',
    visits: [
      { g: 0, ok: true, cap: `<b>Check 1 passes:</b> no fraction under the root.` },
      { g: 1, ok: true, cap: `<b>Check 2 passes:</b> ${T('9=3\\cdot3')} has no perfect <b>cube</b> factor (index 3 needs three equal factors).` },
      { g: 2, bad: `\\dfrac{6}{${cR('\\sqrt[3]{9}')}}`, work: ['\\dfrac{6}{\\sqrt[3]{9}}\\cdot\\dfrac{\\sqrt[3]{3}}{\\sqrt[3]{3}}=\\dfrac{6\\sqrt[3]{3}}{\\sqrt[3]{27}}'], to: '\\dfrac{6\\sqrt[3]{3}}{3}',
        cap: `<b>Check 3 fails:</b> ${T('9=3^2')}, so one more 3 makes a perfect cube: multiply by ${T('\\tfrac{\\sqrt[3]{3}}{\\sqrt[3]{3}}')}, and ${T('\\sqrt[3]{27}=3')}.` },
      { g: 3, bad: `\\dfrac{${cR('6')}\\sqrt[3]{3}}{${cR('3')}}`, to: '2\\sqrt[3]{3}', cap: `<b>Check 4 fails:</b> ${T('\\tfrac{6}{3}=2')}. Reduce.` },
      { g: 4, ok: true, cap: `<b>Check 5 passes:</b> no variables.` }
    ] },
  e5e: { label: '5(e)', q: '\\sqrt{\\dfrac{5}{8}}', final: '\\dfrac{\\sqrt{10}}{4}',
    visits: [
      { g: 0, bad: cR('\\sqrt{\\dfrac{5}{8}}'), to: '\\dfrac{\\sqrt{5}}{\\sqrt{8}}', cap: `<b>Check 1 fails:</b> a fraction under the root. Split it: ${T('\\tfrac{\\sqrt{5}}{\\sqrt{8}}')}.` },
      { g: 1, bad: `\\dfrac{\\sqrt{5}}{${cR('\\sqrt{8}')}}`, to: '\\dfrac{\\sqrt{5}}{2\\sqrt{2}}', cap: `<b>Check 2 fails:</b> ${T('8=' + cA('4') + '\\cdot2')}, so ${T('\\sqrt{8}=2\\sqrt{2}')}.` },
      { g: 2, bad: `\\dfrac{\\sqrt{5}}{2${cR('\\sqrt{2}')}}`, work: ['\\dfrac{\\sqrt{5}}{2\\sqrt{2}}\\cdot\\dfrac{\\sqrt{2}}{\\sqrt{2}}=\\dfrac{\\sqrt{10}}{2(2)}'], to: '\\dfrac{\\sqrt{10}}{4}',
        cap: `<b>Check 3 fails:</b> ${T('\\sqrt{2}')} in the denominator. Multiply by ${T('\\tfrac{\\sqrt{2}}{\\sqrt{2}}')}.` },
      { g: 3, ok: true, cap: `<b>Check 4 passes:</b> ${T('10=2\\cdot5')} has no square factor, and ${T('\\sqrt{10}')} over 4 can’t be reduced.` },
      { g: 4, ok: true, cap: `<b>Check 5 passes:</b> no variables.` }
    ] },
  e6c: { label: '6(c)', q: '\\dfrac{\\sqrt{6}}{2\\sqrt{3}+\\sqrt{2}}', final: '\\dfrac{3\\sqrt{2}-\\sqrt{3}}{5}',
    visits: [
      { g: 0, ok: true, cap: `<b>Check 1 passes:</b> no fraction under a root.` },
      { g: 1, ok: true, cap: `<b>Check 2 passes:</b> ${T('\\sqrt{6}')}, ${T('\\sqrt{3}')} and ${T('\\sqrt{2}')} have no perfect-square factors.` },
      { g: 2, bad: `\\dfrac{\\sqrt{6}}{${cR('2\\sqrt{3}+\\sqrt{2}')}}`, work: ['\\dfrac{\\sqrt{6}(2\\sqrt{3}-\\sqrt{2})}{(2\\sqrt{3})^2-(\\sqrt{2})^2}'], to: '\\dfrac{2\\sqrt{18}-\\sqrt{12}}{10}',
        cap: `<b>Check 3 fails:</b> a two-term denominator. Multiply by the conjugate ${T(cP('2\\sqrt{3}-\\sqrt{2}'))}: the bottom is ${T('12-2=10')}.` },
      { g: 1, re: true, bad: `\\dfrac{2${cR('\\sqrt{18}')}-${cR('\\sqrt{12}')}}{10}`, to: '\\dfrac{6\\sqrt{2}-2\\sqrt{3}}{10}',
        cap: `<b>Back to check 2!</b> The fix made <b>new</b> radicands: ${T('\\sqrt{18}=3\\sqrt{2}')} and ${T('\\sqrt{12}=2\\sqrt{3}')}.` },
      { g: 2, ok: true, re: true, cap: `<b>Check 3 passes now:</b> the denominator is 10.` },
      { g: 3, bad: `\\dfrac{${cR('6')}\\sqrt{2}-${cR('2')}\\sqrt{3}}{${cR('10')}}`, to: '\\dfrac{3\\sqrt{2}-\\sqrt{3}}{5}',
        cap: `<b>Check 4 fails:</b> 6, 2 and 10 share a factor of 2. Divide <b>every</b> term by 2.` },
      { g: 4, ok: true, cap: `<b>Check 5 passes:</b> no variables.` }
    ] },
  e8b: { label: '8(b)', q: '\\dfrac{4}{\\sqrt{5}-1}-\\sqrt{20}', final: '1-\\sqrt{5}',
    visits: [
      { g: 0, ok: true, cap: `<b>Check 1 passes:</b> no fraction under a root.` },
      { g: 1, bad: `\\dfrac{4}{\\sqrt{5}-1}-${cR('\\sqrt{20}')}`, to: '\\dfrac{4}{\\sqrt{5}-1}-2\\sqrt{5}', cap: `<b>Check 2 fails:</b> ${T('20=' + cA('4') + '\\cdot5')}, so ${T('\\sqrt{20}=2\\sqrt{5}')}.` },
      { g: 2, bad: `\\dfrac{4}{${cR('\\sqrt{5}-1')}}-2\\sqrt{5}`, work: ['\\dfrac{4(\\sqrt{5}+1)}{5-1}=\\sqrt{5}+1'], to: '\\sqrt{5}+1-2\\sqrt{5}',
        cap: `<b>Check 3 fails:</b> multiply by the conjugate ${T(cP('\\sqrt{5}+1'))}: the bottom is ${T('5-1=4')}, and ${T('\\tfrac{4}{4}=1')}.` },
      { g: 3, bad: `${cR('\\sqrt{5}')}+1-${cR('2\\sqrt{5}')}`, to: '1-\\sqrt{5}', cap: `<b>Check 4 fails:</b> ${T('\\sqrt{5}-2\\sqrt{5}=-\\sqrt{5}')}. In the form ${T('a+b\\sqrt{5}')}: ${T('a=1')}, ${T('b=-1')}.` },
      { g: 4, ok: true, cap: `<b>Check 5 passes:</b> no variables.` }
    ] }
};
const inspector = {
  title: 'The simplest-form inspector',
  height: 440,
  minW: 960,
  capH: 84,
  choices: Object.keys(INS).map((k) => (INS[k].sep ? INS[k] : { v: k, label: INS[k].label })),
  ask: (k) => `Is ${T(INS[k].q)} in simplest form?`,
  intro: 'The expression goes through every check. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = INS[k], W = ex.W, GW = 318, BX = GW + 18, BW = W - BX - 2;
    const gates = GATES.map((g, i) => {
      const el = div(stage, 'u2l7-gate', `<span class="u2l7-gn">${i + 1}</span><span class="u2l7-gt"><b>${g.t}</b><span class="u2l7-gs">${g.s}</span></span><span class="u2l7-gst"></span>`, 0, 4 + i * 87, GW, 78);
      el.st = el.querySelector('.u2l7-gst'); return el;
    });
    const bench = div(stage, 'u2l7-bench', '<div class="u2l7-bh">On the bench</div>', BX, 4, BW, 132);
    const bx = h('div', 'u2l7-bx', T(d.q)); bench.appendChild(bx);
    const beam = h('div', 'u2l7-beam'); bench.appendChild(beam); beam.style.opacity = 0;
    const trail = panel(stage, BX, 148, BW, 290, 'Fixes', 'u2l7-trail');
    const st = putStamp(stage, 'simplest form', BX + BW - 110, 30, { size: 'sm', rotate: -6 });
    const setOn = (g) => gates.forEach((el, i) => el.classList.toggle('u2l7-gon', i === g));
    const scan = async (c) => { beam.style.opacity = 1; await anim(c, beam, [{ left: '0%' }, { left: 'calc(100% - 46px)' }], 620); beam.style.opacity = 0; };
    const steps = d.visits.map((v) => ({
      cap: v.cap,
      run: async (c) => {
        const gt = gates[v.g];
        setOn(v.g);
        if (v.re) { gt.classList.remove('u2l7-gpass', 'u2l7-gfix'); gt.st.textContent = '↻'; }
        bench.classList.remove('u2l7-bad');
        await scan(c);
        if (v.ok) { gt.classList.add('u2l7-gpass'); gt.st.textContent = '✓'; await pop(c, gt.st); return; }
        gt.classList.add('u2l7-gfail'); gt.st.textContent = '✗';
        bench.classList.add('u2l7-bad'); bx.innerHTML = T(v.bad);
        await shake(c, gt); await sleep(c, 450);
        const room = () => { const ls = trail.querySelectorAll('.u2l7-tl'); if (ls.length >= 4) ls[0].remove(); };
        for (const w of v.work || []) { room(); await show(c, line(trail, `<span class="u2l7-tg">${v.g + 1}</span>${T(w)}`, 'u2l7-tl u2l7-tlw')); }
        room(); await show(c, line(trail, `<span class="u2l7-tg">${v.g + 1}</span>${T('=' + v.to)}`, 'u2l7-tl'));
        bench.classList.remove('u2l7-bad');
        await swap(c, bx, T(v.to));
        gt.classList.remove('u2l7-gfail'); gt.classList.add('u2l7-gfix'); gt.st.textContent = '✓';
        await pop(c, gt.st);
      }
    }));
    steps.push({ cap: `Every check passes: <b>simplest form</b> is ${T(d.final)}.`, run: async (c) => { setOn(-1); bench.classList.add('u2l7-good'); await pulse(c, bx, 1.08); await stampOn(c, st); } });
    return steps;
  }
};

/* =============================== explainer: ordering (Example 1) =============================== */
const OR = {
  a: { label: 'Example 1(a)', idx: 2, min: 44, max: 53, order: '3\\sqrt{5},\\ 4\\sqrt{3},\\ 7,\\ 5\\sqrt{2},\\ 2\\sqrt{13}',
    items: [{ m: '4\\sqrt{3}', e: '\\sqrt{4^2\\cdot3}', r: 48 }, { m: '3\\sqrt{5}', e: '\\sqrt{3^2\\cdot5}', r: 45 }, { m: '2\\sqrt{13}', e: '\\sqrt{2^2\\cdot13}', r: 52 }, { m: '7', e: '\\sqrt{7^2}', r: 49 }, { m: '5\\sqrt{2}', e: '\\sqrt{5^2\\cdot2}', r: 50 }] },
  b: { label: '1(b)', idx: 3, min: 52, max: 66, order: '3\\sqrt[3]{2},\\ 2\\sqrt[3]{7},\\ \\sqrt[3]{60},\\ 4',
    items: [{ m: '2\\sqrt[3]{7}', e: '\\sqrt[3]{2^3\\cdot7}', r: 56 }, { m: '3\\sqrt[3]{2}', e: '\\sqrt[3]{3^3\\cdot2}', r: 54 }, { m: '\\sqrt[3]{60}', e: null, r: 60 }, { m: '4', e: '\\sqrt[3]{4^3}', r: 64 }] },
  tbl: { label: 'Summary: ' + T('4\\sqrt{3}') + ' vs ' + T('3\\sqrt{5}'), idx: 2, min: 43, max: 50, order: '3\\sqrt{5}<4\\sqrt{3}',
    items: [{ m: '4\\sqrt{3}', e: '\\sqrt{4^2\\cdot3}', r: 48 }, { m: '3\\sqrt{5}', e: '\\sqrt{3^2\\cdot5}', r: 45 }] }
};
const rt = (idx, r) => (idx === 2 ? `\\sqrt{${r}}` : `\\sqrt[3]{${r}}`);
const order = {
  title: 'Order radicals without a calculator',
  height: 420,
  minW: 900,
  choices: Object.keys(OR).map((k) => ({ v: k, label: OR[k].label })),
  intro: 'Make them all entire radicals, then compare. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = OR[k], W = ex.W, n = d.items.length, cw = Math.min(176, (W - 20) / n - 14), gap = (W - n * cw) / (n + 1);
    const pow = d.idx === 2 ? 'squared' : 'cubed'; const whole = d.items.find((it) => /^\d+$/.test(it.m));
    const cards = d.items.map((it, i) => {
      const el = div(stage, 'u2l7-ocard', `<div class="u2l7-om">${T(it.m)}</div>`, gap + i * (cw + gap), 6, cw, 146);
      el.e = hide(line(el, it.e ? T('=' + it.e) : '<span class="muted">already entire</span>', 'u2l7-oe'));
      el.r = hide(line(el, T('=' + rt(d.idx, it.r)), 'u2l7-or'));
      return el;
    });
    const N = new NumberLine(stage, { x: 10, y: 190, width: W - 20, height: 120, min: d.min, max: d.max, step: 1, arrows: true, labels: d.items.map((it) => ({ v: it.r, html: T(rt(d.idx, it.r)) })) });
    const pts = d.items.map((it) => { const p = N.point(it.r, { label: T(it.m), color: ROSE }); hide(p); hide(p.label); return p; });
    const ord = hide(div(stage, 'u2l7-oord', `<b>Least to greatest:</b> ${T(d.order)}`, 0, 346, W, 60));
    const sorted = d.items.map((it, i) => [it.r, i]).sort((a, b) => a[0] - b[0]).map((p) => p[1]);
    return [
      { cap: `Which is biggest? Mixed radicals are hard to compare by eye${d.idx === 3 ? ', and these are cube roots' : ''}.`, run: async (c) => { for (const cd of cards) await pulse(c, cd, 1.04, 300); } },
      { cap: `Write each one as an <b>entire radical</b>: the coefficient goes in <b>${pow}</b> (the index is ${d.idx}). ${whole ? `A whole number counts too: ${T(whole.m + '=' + whole.e)}.` : `For example ${T(d.items[0].m + '=' + d.items[0].e)}.`}`, run: async (c) => { for (const cd of cards) await show(c, cd.e); } },
      { cap: `Multiply out: now every number is ${d.idx === 2 ? 'a square root' : 'a cube root'} of a whole number.`, run: async (c) => { for (const cd of cards) await show(c, cd.r); } },
      { cap: `Same index: the <b>larger radicand</b> is the larger number. Place them on the line.`, run: async (c) => { for (const i of sorted) { pts[i].style.opacity = 1; pts[i].label.style.opacity = 1; await pop(c, pts[i]); } } },
      { cap: `Read them left to right: ${T(d.order)}.`, run: (c) => show(c, ord) }
    ];
  }
};

/* =============================== explainer: restrictions (Example 2(a)) =============================== */
const RS = {
  i: { label: 'Example 2(a)(i)', q: '\\sqrt{3x+12}', lines: ['3x+12\\ge0', '3x\\ge-12', 'x\\ge-4'], iv: [-4, Infinity], open: false, min: -8, max: 4, b: -4,
    test: { x: -5, t: '3(-5)+12=-3', ok: false, msg: `${T('\\sqrt{-3}')} is not a real number` },
    caps: [`<b>Even index</b> (a square root): the radicand can’t be negative, so ${T('3x+12\\ge0')}.`, `Solve: subtract 12, then divide by 3: ${T('x\\ge-4')}.`, `Shade it: ${T('-4')} and everything to its right (closed dot: ${T('-4')} itself works, ${T('\\sqrt{0}=0')}).`, `Test a value outside: ${T('x=-5')} gives ${T('\\sqrt{-3}')}, not a real number. ✗`] },
  ii: { label: '(ii)', q: '\\sqrt{10-4x}', lines: ['10-4x\\ge0', '-4x\\ge-10', 'x\\le\\tfrac{5}{2}'], flip: true, iv: [-Infinity, 2.5], open: false, min: -2, max: 6, b: 2.5, bl: '\\tfrac{5}{2}',
    test: { x: 3, t: '10-4(3)=-2', ok: false, msg: `${T('\\sqrt{-2}')} is not a real number` },
    caps: [`<b>Even index:</b> ${T('10-4x\\ge0')}.`, `Subtract 10: ${T('-4x\\ge-10')}. Now divide by ${T('-4')}: dividing by a negative <b>flips</b> the sign! ${T('x\\le\\tfrac{5}{2}')}.`, `Shade ${T('\\tfrac{5}{2}')} and everything to its <b>left</b>.`, `Test: ${T('x=3')} gives ${T('10-12=-2')} under the root. ✗ (Without the flip you would have shaded the wrong side.)`] },
  iii: { label: '(iii)', q: '\\sqrt[3]{x-9}', lines: ['\\text{odd index (3)}', '\\text{any real } x'], iv: [-Infinity, Infinity], min: -4, max: 12, b: 9, odd: true,
    test: { x: 1, t: '\\sqrt[3]{1-9}=\\sqrt[3]{-8}=-2', ok: true, msg: 'a real number' },
    caps: [`<b>Odd index</b> (a cube root): a negative radicand is fine, because ${T('(-2)^3=-8')}.`, `So there is <b>no restriction</b>: ${T('x')} can be any real number.`, `Shade the whole number line.`, `Test: ${T('x=1')} gives ${T('\\sqrt[3]{-8}=-2')}, a real number. ✓`] },
  iv: { label: '(iv)', q: '\\dfrac{5}{\\sqrt{x-1}}', lines: ['x-1\\ge0\\ \\text{and}\\ \\sqrt{x-1}\\ne0', 'x-1>0', 'x>1'], iv: [1, Infinity], open: true, min: -3, max: 5, b: 1,
    test: { x: 1, t: '\\dfrac{5}{\\sqrt{1-1}}=\\dfrac{5}{0}', ok: false, msg: 'dividing by 0 is undefined' },
    caps: [`<b>Even index:</b> ${T('x-1\\ge0')}. But the root is in a <b>denominator</b>, so it also can’t be 0.`, `Together: ${T('x-1>0')}, so ${T('x>1')}.`, `Shade to the right of 1 with an <b>open</b> dot: 1 itself is not allowed.`, `Test the boundary: ${T('x=1')} gives ${T('\\tfrac{5}{0}')}, undefined. ✗`] },
  tbl: { label: 'Summary: ' + T('\\sqrt{2x-6}'), q: '\\sqrt{2x-6}', lines: ['2x-6\\ge0', '2x\\ge6', 'x\\ge3'], iv: [3, Infinity], open: false, min: -1, max: 7, b: 3,
    test: { x: 2, t: '2(2)-6=-2', ok: false, msg: `${T('\\sqrt{-2}')} is not a real number` },
    caps: [`<b>Even index:</b> ${T('2x-6\\ge0')}.`, `Add 6, divide by 2: ${T('x\\ge3')}.`, `Shade 3 and everything to its right.`, `Test: ${T('x=2')} gives ${T('\\sqrt{-2}')}. ✗`] }
};
const restrict = {
  title: 'Restrictions on a radical',
  height: 380,
  minW: 900,
  choices: Object.keys(RS).map((k) => ({ v: k, label: RS[k].label })),
  ask: (k) => `For what values of ${T('x')} is ${T(RS[k].q)} a real number?`,
  make(stage, k, ex) {
    const d = RS[k], W = ex.W, LW = 340;
    const P = panel(stage, 0, 4, LW, 370, '', 'u2l7-rsp');
    const big = line(P, T(d.q), 'u2l7-rsq');
    const ls = d.lines.map((s, i) => hide(line(P, T(s), 'u2l7-rsl' + (i === d.lines.length - 1 ? ' u2l7-rsans' : ''))));
    if (d.flip) ls[2].innerHTML = T('x' + cR('\\le') + '\\tfrac{5}{2}') + ' <span class="u2l7-flip">sign flips</span>';
    const N = new NumberLine(stage, { x: LW + 20, y: 40, width: W - LW - 24, height: 130, min: d.min, max: d.max, step: 1, labelStep: d.max - d.min > 10 ? 2 : 1 });
    if (d.bl) N.mark(d.b, T(d.bl), { pos: 's', cls: 'u2l7-nlb' });
    const iv = N.interval(d.iv[0], d.iv[1], { color: d.odd ? 'green' : 'teal', openA: d.open, width: 8 }); hide(iv);
    const tp = N.point(d.test.x, { color: d.test.ok ? 'green' : 'red', label: T('x=' + d.test.x), lift: 34 }); hide(tp); hide(tp.label);
    const tc = hide(div(stage, 'u2l7-test ' + (d.test.ok ? 'u2l7-tok' : 'u2l7-tno'), `<b>Test ${T('x=' + d.test.x)}:</b> ${T(d.test.t)}<br>${d.test.msg} ${d.test.ok ? '✓' : '✗'}`, LW + 30, 210, W - LW - 50, 100));
    void big;
    return [
      { cap: d.caps[0], run: (c) => show(c, ls[0]) },
      { cap: d.caps[1], run: async (c) => { for (const l of ls.slice(1)) await show(c, l); if (d.flip) await pulse(c, ls[2], 1.08); } },
      { cap: d.caps[2], run: async (c) => { iv.style.opacity = 1; await drawIn(iv, 800, c); } },
      { cap: d.caps[3], run: async (c) => { tp.style.opacity = 1; tp.label.style.opacity = 1; await pop(c, tp); await show(c, tc); } }
    ];
  }
};

/* =============================== explainer: rational or irrational (Example 8(a)) =============================== */
const RI = {
  a1: { label: 'Example 8(a) (i)–(iii)', items: [
    { q: '\\sqrt{196}', s: '=14', rat: true, why: `${T('196=14^2')}, a perfect square: <b>rational</b>.` },
    { q: '\\sqrt[3]{-27}', s: '=-3', rat: true, why: `${T('-27=(-3)^3')}, a perfect cube: <b>rational</b>.` },
    { q: '\\sqrt{40}', s: '=2\\sqrt{10}', rat: false, why: `${T('40=4\\cdot10')}: a radical is left over, ${T('2\\sqrt{10}')}. <b>Irrational.</b>` }],
    end: `Simplify first: only a root of a perfect power is rational.` },
  a2: { label: '8(a) (iv)–(vi)', items: [
    { q: '(\\sqrt{7}-\\sqrt{2})(\\sqrt{7}+\\sqrt{2})', s: '=7-2=5', rat: true, why: `Conjugates: the middle terms cancel, ${T('7-2=5')}. <b>Rational.</b>` },
    { q: '\\dfrac{\\sqrt{50}}{\\sqrt{2}}', s: '=\\sqrt{25}=5', rat: true, why: `${T('\\sqrt{\\tfrac{50}{2}}=\\sqrt{25}=5')}: two irrationals, a rational quotient!` },
    { q: '2+\\sqrt{3}', s: '\\text{rational}+\\text{irrational}', rat: false, why: `A rational number plus an irrational one is <b>irrational</b>.` }],
    end: `Two irrational numbers can combine to a rational one; a rational plus an irrational never does.` },
  sur: { label: 'Surprise products', items: [
    { q: '\\sqrt{2}\\cdot\\sqrt{8}', s: '=\\sqrt{16}=4', rat: true, why: `${T('\\sqrt{2\\cdot8}=\\sqrt{16}=4')}: irrational times irrational, <b>rational</b>.` },
    { q: '\\sqrt{3}+\\sqrt{3}', s: '=2\\sqrt{3}', rat: false, why: `Like radicals add: ${T('2\\sqrt{3}')}, still <b>irrational</b>.` },
    { q: '(4+\\sqrt{3})(4-\\sqrt{3})', s: '=16-3=13', rat: true, why: `Conjugates: ${T('16-3=13')}. <b>Rational</b>, always.` }],
    end: `A product of conjugates is always rational: that is exactly why conjugates rationalize denominators.` }
};
const ratIrr = {
  title: 'Rational or irrational?',
  height: 430,
  minW: 920,
  choices: Object.keys(RI).map((k) => ({ v: k, label: RI[k].label })),
  intro: 'Simplify each number, then sort it. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = RI[k], W = ex.W, n = d.items.length, cw = (W - 40) / n - 10;
    const cards = d.items.map((it, i) => {
      const el = div(stage, 'u2l7-ricard', `<div class="u2l7-riq">${T(it.q)}</div>`, 20 + i * (cw + 15), 6, cw, 120);
      el.s = hide(line(el, T(it.s), 'u2l7-ris')); return el;
    });
    const BW = (W - 30) / 2;
    const binR = div(stage, 'u2l7-bin u2l7-binr', '<div class="u2l7-binh">Rational <span>ends or repeats · a fraction of integers</span></div>', 0, 150, BW, 276);
    const binI = div(stage, 'u2l7-bin u2l7-bini', '<div class="u2l7-binh">Irrational <span>never ends or repeats</span></div>', BW + 30, 150, BW, 276);
    const cnt = [0, 0];
    const steps = [{ cap: `Simplify first, then sort: <b>rational</b> (a fraction of integers) or <b>irrational</b> (a radical is left over).`, run: async (c) => { await pulse(c, binR, 1.02); await pulse(c, binI, 1.02); } }];
    d.items.forEach((it, i) => {
      const bin = it.rat ? binR : binI, j = cnt[it.rat ? 0 : 1]++;
      const chip = hide(div(bin, 'u2l7-richip', T(it.q + (it.s.startsWith('=') ? it.s : '')), 16, 62 + j * 66, BW - 32, 56));
      steps.push({ cap: it.why, run: async (c) => { await show(c, cards[i].s); cards[i].classList.add('u2l7-ridone'); chip.style.opacity = 1; await fadeIn(c, chip, 420, { from: 'translateY(-60px)' }); } });
    });
    steps.push({ cap: d.end, run: async (c) => { await pulse(c, binR, 1.02); } });
    return steps;
  }
};

/* =============================== Stand Up Break =============================== */
const NONSQ = [2, 3, 5, 6, 7, 10];
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const co = (k, rad) => (k === 1 ? rad : k === -1 ? '-' + rad : k === 0 ? '0' : k + rad);
const sg = (k) => (k < 0 ? '-' : '+');
standup('u2l7', {
  intro: 'At your whiteboard: decide the operation first, then finish in simplest form. Exact answers!',
  levels: {
    BEG: (r) => { // simplify, then combine like radicals
      const m = r.pick(NONSQ), k = r.int(2, 6); let j = r.int(2, 6); while (j === k) j = r.int(2, 6);
      const s = r.chance(0.5) ? 1 : -1, tot = k + s * j;
      return { text: '<b>Simplify.</b> Simplify each radical first, then combine like radicals.', q: `\\sqrt{${k * k * m}}${s > 0 ? '+' : '-'}\\sqrt{${j * j * m}}`,
        a: [`=${k}\\sqrt{${m}}${s > 0 ? '+' : '-'}${j}\\sqrt{${m}}`, `=${co(tot, `\\sqrt{${m}}`)}`] };
    },
    PRG: (r) => {
      if (r.chance(0.5)) { // rationalize a monomial denominator
        const m = r.pick([2, 3, 5, 6, 7]), k = r.int(2, 5), t = r.int(1, 6), n = m * t, g = gcd(t, k), num = t / g, den = k / g;
        return { text: '<b>Rationalize the denominator</b> and simplify.', q: `\\dfrac{${n}}{${k}\\sqrt{${m}}}`,
          a: [`=\\dfrac{${n}}{${k}\\sqrt{${m}}}\\cdot\\dfrac{\\sqrt{${m}}}{\\sqrt{${m}}}=\\dfrac{${n}\\sqrt{${m}}}{${k * m}}`, den === 1 ? `=${co(num, `\\sqrt{${m}}`)}` : `=\\dfrac{${co(num, `\\sqrt{${m}}`)}}{${den}}`] };
      }
      const m = r.pick([2, 3, 5, 6, 7]), a = r.int(1, 6), b = r.int(1, 6), cst = a * b - m, rc = b - a;
      const tail = rc === 0 ? '' : `${sg(rc)}${co(Math.abs(rc), `\\sqrt{${m}}`)}`;
      return { text: '<b>Expand and simplify.</b>', q: `\\left(${a}+\\sqrt{${m}}\\right)\\left(${b}-\\sqrt{${m}}\\right)`,
        a: [`=${a * b}-${co(a, `\\sqrt{${m}}`)}+${co(b, `\\sqrt{${m}}`)}-${m}`, `=${cst}${tail}`] };
    },
    MAS: (r) => { // rationalize a binomial denominator with the conjugate
      let a, m, D;
      do { a = r.int(2, 5); m = r.int(2, a * a - 1); D = a * a - m; } while (Number.isInteger(Math.sqrt(m)) || D < 1 || D > 6);
      const t = r.int(1, 4) * r.sign(), n = D * t, minus = r.chance(0.5);
      const conj = minus ? `${a}+\\sqrt{${m}}` : `${a}-\\sqrt{${m}}`, den = minus ? `${a}-\\sqrt{${m}}` : `${a}+\\sqrt{${m}}`;
      const res = `${t * a}${minus ? sg(t) : sg(-t)}${co(Math.abs(t), `\\sqrt{${m}}`)}`;
      return { text: '<b>Rationalize the denominator</b> and simplify. Choose the operation, then check simplest form.', q: `\\dfrac{${n}}{${den}}`,
        a: [`=\\dfrac{${n}}{${den}}\\cdot\\dfrac{${conj}}{${conj}}`, `=\\dfrac{${n}\\left(${conj}\\right)}{${a * a}-${m}}=\\dfrac{${n}\\left(${conj}\\right)}{${D}}`, `=${t === 1 ? '' : t === -1 ? '-' : t}\\left(${conj}\\right)=${res}`] };
    }
  }
});

/* =============================== mount =============================== */
export const explainers = mountExplainers({ whichOp, inspector, order, restrict, ratIrr });
export const _test = { WO, INS, OR, RS, RI };
