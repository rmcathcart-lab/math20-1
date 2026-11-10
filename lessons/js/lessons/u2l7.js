/* Math 20-1 · Unit 2 · Lesson 7 — Unit 2 Review (no calculator: exact answers).
 * Warm-up (Radical Dominoes: tap loose dominoes to build a chain whose touching ends are equal once simplified; decoys
 *   for √12 = 4√3 and √2 + √8 = √10; which END domino fits √2 + √8?), and the explainers:
 *   whichOp (choosing the operation: a flowchart lights the path + / × / ÷ → the right method, the work panel does it;
 *     summary-table and Example 3(a), 4(a), 4(b), 5(a), 5(c), 6(a) checks),
 *   inspector (STAR: the simplest-form inspector — an expression on the bench passes the five checks in working order;
 *     each failed check lights red, then fixes itself, and a fix that makes new radicands sends it back to be re-checked;
 *     a concept chip that fails every check, the summary's 3/√6, and Example 2(b)(i), 3(c), 5(d), 5(e), 6(c), 8(b)),
 *   whyWrong (spot the error, the booklet's three common errors with a picture each: √(a+b) as the legs vs the
 *     hypotenuse of a right triangle, (√a+√b)² as a square with the two missing rectangles, √2+√3 vs √5),
 *   order (Example 1: every number becomes an entire radical with the same index, then sits on a radicand line),
 *   restrict (Example 2(a): solve radicand ≥ 0 (> 0 in a denominator), shade the number line, test a value),
 *   varRad (Example 2(b): factor tiles inside a radical sign leave in groups of the index; and going back in),
 *   collect (Example 3: simplify every radical, then like-radical tiles cancel and count; unlike tiles stay apart),
 *   areaModel (Example 4: one box per pair of terms; like boxes collect, conjugate middle boxes cancel),
 *   rationalize (Example 5(c), 5(d), 6(a)–(c), summary 4/∛2: multiply by a form of 1; the square, the missing cube
 *     factor, or the conjugate grid shows why the bottom becomes rational),
 *   rectangle (Example 7: perimeter (the √3s cancel), area as a square minus a square rearranged into the rectangle,
 *     diagonal by Pythagoras (the 4√15s cancel)),
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

/* =============================== warm-up: Radical Dominoes =============================== */
/* each domino: l = left end (TeX) and its value key, r = right end (TeX); END dominoes have r = null.
 * the chain's open ends and their simplified forms: √12 = 2√3, √50 = 5√2, √3·√15 = 3√5, 10/√5 = 2√5, √2+√8 = 3√2 */
const DOMS = {
  X: { l: '4\\sqrt{3}', k: '4r3', r: '\\sqrt{45}' },
  C: { l: '3\\sqrt{5}', k: '3r5', r: '\\dfrac{10}{\\sqrt{5}}', kr: '2r5' },
  E1: { l: '\\sqrt{10}', k: 'r10', r: null },
  A: { l: '2\\sqrt{3}', k: '2r3', r: '\\sqrt{50}', kr: '5r2' },
  D: { l: '2\\sqrt{5}', k: '2r5', r: '\\sqrt{2}+\\sqrt{8}', kr: '3r2' },
  E2: { l: '\\sqrt{18}', k: '3r2', r: null },
  B: { l: '5\\sqrt{2}', k: '5r2', r: '\\sqrt{3}\\cdot\\sqrt{15}', kr: '3r5' }
};
const DEND = { '2r3': ['\\sqrt{12}', '2\\sqrt{3}'], '5r2': ['\\sqrt{50}', '5\\sqrt{2}'], '3r5': ['\\sqrt{3}\\cdot\\sqrt{15}', '\\sqrt{45}=3\\sqrt{5}'],
  '2r5': ['\\dfrac{10}{\\sqrt{5}}', '\\dfrac{10\\sqrt{5}}{5}=2\\sqrt{5}'], '3r2': ['\\sqrt{2}+\\sqrt{8}', '\\sqrt{2}+2\\sqrt{2}=3\\sqrt{2}'] };
const DWHY = { 'r10': `${T('\\sqrt{2}+\\sqrt{8}\\ne\\sqrt{2+8}')}: you can’t add under the root!`, '4r3': `${T('\\sqrt{12}=\\sqrt{4}\\cdot\\sqrt{3}=2\\sqrt{3}')}, not ${T('4\\sqrt{3}')} (that is ${T('\\sqrt{48}')}).` };
function mountDominoes() {
  const host = document.getElementById('u2l7-dom'), msg = document.getElementById('u2l7-dmsg'); if (!host) return;
  const W = Math.max(520, Math.min(640, host.clientWidth || 600)), DW = Math.min(184, (W - 40) / 3), DH = 58, GX = (W - 3 * DW) / 4;
  box(host, W, 352);
  const half = (tex_, cls = '') => `<span class="u2l7-dh ${cls}">${tex_}</span>`;
  const slotXY = (i) => [GX + (i % 3) * (DW + GX), 8 + Math.floor(i / 3) * 76];
  for (let i = 0; i < 6; i++) { const [x, y] = slotXY(i); add(host, box(h('div', 'u2l7-dslot'), DW, DH), x, y); }
  const lk = h('div', 'u2l7-dlink', '↩'); add(host, lk, W - 26, 40);
  add(host, h('div', 'u2l7-dtray', 'Loose dominoes'), 0, 160);
  const start = add(host, box(h('div', 'u2l7-domino u2l7-dstart', half('<b>START</b>', 'u2l7-dword') + half(T('\\sqrt{12}'))), DW, DH), ...slotXY(0));
  const keys = Object.keys(DOMS), tiles = {};
  const trayXY = (j) => [GX + (j % 3) * (DW + GX), 186 + Math.floor(j / 3) * 56];
  keys.forEach((k, j) => {
    const d = DOMS[k], b = h('button', 'u2l7-domino', half(T(d.l)) + (d.r ? half(T(d.r)) : half('<b>END</b>', 'u2l7-dword')));
    b.type = 'button'; box(b, DW, DH - 10); b.home = trayXY(j); add(host, b, ...b.home); tiles[k] = b;
    b.addEventListener('click', () => tryTile(k));
  });
  void start;
  let end = '2r3', n = 1, busy = false;
  const say = (html, cls = '') => { msg.className = 'u2l7-dmsg ' + cls; msg.innerHTML = html; };
  async function tryTile(k) {
    const d = DOMS[k], b = tiles[k], c = liveCtx(); if (busy || b.classList.contains('u2l7-placed') || !end) return;
    if (d.k !== end) {
      b.classList.add('u2l7-dno'); await shake(c, b); b.classList.remove('u2l7-dno');
      say(DWHY[d.k] && ((d.k === 'r10' && end === '3r2') || (d.k === '4r3' && end === '2r3')) ? `No match. ${DWHY[d.k]}` : `No match: the chain ends in ${T(DEND[end][0])}, and that simplifies to ${T(DEND[end][1].split('=').pop())}, not ${T(d.l)}.`, 'u2l7-dbad');
      return;
    }
    busy = true; b.classList.add('u2l7-placed'); box(b, DW, DH);
    const [x, y] = slotXY(n); await flyTo(c, b, x, y, 520);
    say(`Match! ${T(DEND[end][0] + '=' + DEND[end][1].split('=').pop())}` + (d.r ? ` Now the chain ends in ${T(d.r)}.` : ''), 'u2l7-dok');
    n++; end = d.kr || null; busy = false;
    if (!end) { say(`<b>Chain complete!</b> Every join is equal once it is in <b>simplest form</b>.`, 'u2l7-dok'); host.classList.add('u2l7-ddone'); }
  }
  document.getElementById('u2l7-dreset').addEventListener('click', () => {
    keys.forEach((k) => { const b = tiles[k]; b.classList.remove('u2l7-placed'); box(b, DW, DH - 10); b.style.left = b.home[0] + 'px'; b.style.top = b.home[1] + 'px'; });
    end = '2r3'; n = 1; host.classList.remove('u2l7-ddone'); say(`The chain ends in ${T('\\sqrt{12}')}. Which domino comes next?`);
  });
}

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

/* =============================== explainer: spot the error (why it's wrong) =============================== */
const WW = {
  sum: { label: T('\\sqrt{36+64}'), lines: ['\\sqrt{36+64}=\\sqrt{36}+\\sqrt{64}', '=6+8', '=14'], bad: 0, fix: '\\sqrt{36+64}=\\sqrt{100}=10', rule: '\\sqrt{a+b}\\ne\\sqrt{a}+\\sqrt{b}' },
  sq: { label: T('(\\sqrt{5}+\\sqrt{3})^2'), lines: ['(\\sqrt{5}+\\sqrt{3})^2=5+3', '=8'], bad: 0, fix: '(\\sqrt{5}+\\sqrt{3})^2=8+2\\sqrt{15}', rule: '(\\sqrt{a}+\\sqrt{b})^2=a+2\\sqrt{ab}+b' },
  un: { label: T('\\sqrt{2}+\\sqrt{3}'), lines: ['\\sqrt{2}+\\sqrt{3}=\\sqrt{5}'], bad: 0, fix: '\\sqrt{2}+\\sqrt{3}\\ \\text{is already simplest}', rule: '\\text{only like radicals combine}' }
};
const whyWrong = {
  title: 'Spot the error: why it’s wrong',
  height: 420,
  minW: 920,
  choices: Object.keys(WW).map((k) => ({ v: k, label: WW[k].label })),
  intro: 'A student’s work, and a picture that shows the mistake. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = WW[k], W = ex.W;
    const card = div(stage, 'u2l7-paper', '<div class="u2l7-pph">A student wrote:</div>', 0, 6, 380, 250);
    const ls = d.lines.map((s) => line(card, T(s), 'u2l7-ppl'));
    const st = putStamp(card, '✗', 340, 70, { ok: false });
    const fix = hide(div(stage, 'u2l7-fix', `<b>Correct:</b> ${T(d.fix)}`, 0, 270, 380, 70));
    const rule = hide(div(stage, 'u2l7-rule', T(d.rule), 0, 352, 380, 60));
    const PX = 400, PW = W - PX, B = new Box(stage, { x: PX, y: 0 }, 'u2l7-wwbox', PW, 420);
    const wrongLine = async (c) => { ls[d.bad].classList.add('u2l7-wrong'); await stampOn(c, st); };
    if (k === 'sq') {
      const s5 = Math.sqrt(5), s3 = Math.sqrt(3), u = 64, X0 = 150, Y0 = 50, A = s5 * u, Bq = s3 * u, S = A + Bq;
      const g = svgEl('g', {}, B.svg); g.style.opacity = 0;
      svgEl('rect', { x: X0, y: Y0, width: S, height: S, fill: '#fff', stroke: '#1c2230', 'stroke-width': 3 }, g);
      const topL = hide(lab(B, X0 + S / 2, Y0 - 18, T('\\sqrt{5}+\\sqrt{3}'), 'u2l7-sidel'));
      const leftL = hide(lab(B, X0 - 12, Y0 + S / 2, T('\\sqrt{5}+\\sqrt{3}'), 'u2l7-sidel', 'w'));
      const pieces = [
        { x: X0, y: Y0, w: A, h: A, f: '#e9f0fd', t: '5', sq: true }, { x: X0 + A, y: Y0 + A, w: Bq, h: Bq, f: '#e9f0fd', t: '3', sq: true },
        { x: X0 + A, y: Y0, w: Bq, h: A, f: '#fde2df', t: '\\sqrt{15}' }, { x: X0, y: Y0 + A, w: A, h: Bq, f: '#fde2df', t: '\\sqrt{15}' }
      ].map((p) => {
        const r = svgEl('rect', { x: p.x, y: p.y, width: p.w, height: p.h, fill: p.f, stroke: '#1c2230', 'stroke-width': 2 }, B.svg); r.style.opacity = 0;
        r.l = hide(lab(B, p.x + p.w / 2, p.y + p.h / 2, T(p.t), 'u2l7-piece' + (p.sq ? '' : ' u2l7-piecer'))); r.p = p; return r;
      });
      const sideLabs = [[X0 + A / 2, Y0 + S + 16, '\\sqrt{5}'], [X0 + A + Bq / 2, Y0 + S + 16, '\\sqrt{3}'], [X0 + S + 14, Y0 + A / 2, '\\sqrt{5}'], [X0 + S + 14, Y0 + A + Bq / 2, '\\sqrt{3}']]
        .map(([x, y, t], i) => hide(lab(B, x, y, T(t), 'u2l7-sidel', i < 2 ? 'c' : 'e')));
      return [
        { cap: `A student wrote this. Where is the mistake?`, run: (c) => pulse(c, card, 1.03) },
        { cap: `${T('(\\sqrt{5}+\\sqrt{3})^2')} means ${T('(\\sqrt{5}+\\sqrt{3})(\\sqrt{5}+\\sqrt{3})')}: the area of a square with side ${T('\\sqrt{5}+\\sqrt{3}')}.`, run: async (c) => { g.style.opacity = 1; await appear(c, g); await show(c, topL); await show(c, leftL); } },
        { cap: `Split each side into ${T('\\sqrt{5}')} and ${T('\\sqrt{3}')}. The two squares are ${T('5')} and ${T('3')}: the student only counted these.`, run: async (c) => { for (const sl of sideLabs) sl.style.opacity = 1; for (const r of pieces.slice(0, 2)) { r.style.opacity = 1; await appear(c, r); await pop(c, r.l); } } },
        { cap: `They <b>forgot the two rectangles</b>, each ${T('\\sqrt{5}\\cdot\\sqrt{3}=\\sqrt{15}')}: the middle term.`, run: async (c) => { await wrongLine(c); for (const r of pieces.slice(2)) { r.style.opacity = 1; await appear(c, r); await pop(c, r.l); } } },
        { cap: `All four pieces: ${T('5+2\\sqrt{15}+3=8+2\\sqrt{15}')}.`, run: async (c) => { await show(c, fix); await show(c, rule); } }
      ];
    }
    // the two triangle chips
    const tri = k === 'sum' ? { a: 8, b: 6, u: 30, la: '\\sqrt{64}=8', lb: '\\sqrt{36}=6', lc: '\\sqrt{36+64}=10', walk: '6+8=14' }
      : { a: Math.sqrt(3), b: Math.sqrt(2), u: 140, la: '\\sqrt{3}', lb: '\\sqrt{2}', lc: '\\sqrt{2+3}=\\sqrt{5}', walk: '\\sqrt{2}+\\sqrt{3}' };
    const X0 = 70, Y0 = 330, ax = X0 + tri.a * tri.u, by = Y0 - tri.b * tri.u;
    const legs = svgEl('path', { class: 'bk-stroke', d: `M${X0} ${by} L${X0} ${Y0} L${ax} ${Y0}`, fill: 'none', stroke: AMB, 'stroke-width': 5, 'stroke-linejoin': 'round' }, B.svg);
    const rm = svgEl('path', { d: `M${X0} ${Y0 - 18} L${X0 + 18} ${Y0 - 18} L${X0 + 18} ${Y0}`, fill: 'none', stroke: '#1c2230', 'stroke-width': 2 }, B.svg);
    const hyp = svgEl('path', { class: 'bk-stroke', d: `M${X0} ${by} L${ax} ${Y0}`, fill: 'none', stroke: GRN, 'stroke-width': 5 }, B.svg);
    [legs, rm, hyp].forEach(hide);
    const la = hide(lab(B, (X0 + ax) / 2, Y0 + 22, T(cA(tri.la)), 'u2l7-sidel'));
    const lb = hide(lab(B, X0 - 12, (Y0 + by) / 2, T(cA(tri.lb)), 'u2l7-sidel', 'w'));
    const lc = hide(lab(B, (X0 + ax) / 2 + 16, (Y0 + by) / 2 - 12, T(cG(tri.lc)), 'u2l7-sidel', 'ne'));
    const walk = hide(lab(B, PW - 20, 40, `<b>Walk the legs:</b> ${T(cA(tri.walk))}<br><b>Shortcut:</b> ${T(cG(tri.lc.split('=').pop()))}`, 'u2l7-walk', 'w'));
    if (k === 'sum') return [
      { cap: `A student wrote this. Where is the mistake?`, run: (c) => pulse(c, card, 1.03) },
      { cap: `Test it: work inside the root first. ${T('36+64=100')}, and ${T('\\sqrt{100}=10')}, not 14.`, run: async (c) => { await wrongLine(c); await show(c, fix); } },
      { cap: `Picture it: a right triangle with legs ${T('\\sqrt{36}=6')} and ${T('\\sqrt{64}=8')}.`, run: async (c) => { legs.style.opacity = 1; rm.style.opacity = 1; await drawIn(legs, 700, c); await show(c, lb); await show(c, la); } },
      { cap: `The hypotenuse is ${T('\\sqrt{6^2+8^2}=\\sqrt{36+64}=10')}: the <b>shortcut</b>. Adding the roots, ${T('6+8=14')}, walks along both legs.`, run: async (c) => { hyp.style.opacity = 1; await drawIn(hyp, 700, c); await show(c, lc); await show(c, walk); } },
      { cap: `${T('\\sqrt{a+b}\\ne\\sqrt{a}+\\sqrt{b}')}. <b>Add first, then take the root.</b>`, run: (c) => show(c, rule) }
    ];
    const like = hide(div(stage, 'u2l7-like', `Like radicals do combine: ${T(cB('\\sqrt{2}') + '+' + cB('\\sqrt{2}') + '=2\\sqrt{2}')}`, PX + 20, 360, PW - 40, 50));
    return [
      { cap: `A student wrote this. Where is the mistake?`, run: (c) => pulse(c, card, 1.03) },
      { cap: `${T('\\sqrt{2}')} and ${T('\\sqrt{3}')} have <b>different radicands</b>: they are unlike radicals, like ${T('x')} and ${T('y')}.`, run: (c) => wrongLine(c) },
      { cap: `Picture it: a right triangle with legs ${T('\\sqrt{2}')} and ${T('\\sqrt{3}')}.`, run: async (c) => { legs.style.opacity = 1; rm.style.opacity = 1; await drawIn(legs, 700, c); await show(c, lb); await show(c, la); } },
      { cap: `The hypotenuse is ${T('\\sqrt{2+3}=\\sqrt{5}')}, the shortcut. ${T('\\sqrt{2}+\\sqrt{3}')} walks both legs: it is <b>longer</b> than ${T('\\sqrt{5}')}.`, run: async (c) => { hyp.style.opacity = 1; await drawIn(hyp, 700, c); await show(c, lc); await show(c, walk); } },
      { cap: `So ${T('\\sqrt{2}+\\sqrt{3}')} stays as it is: it is already in simplest form. Only <b>like</b> radicals combine.`, run: async (c) => { await show(c, fix); await show(c, like); await show(c, rule); } }
    ];
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

/* =============================== explainer: variable radicands (Example 2(b)) =============================== */
const VR = {
  i: { label: 'Example 2(b)(i)', idx: 2, q: '\\sqrt{75x^4y^7}', num: { n: 75, inT: '75=' + cA('25') + '\\cdot3', out: '5', stay: '3', why: `${T('75=25\\cdot3')}, and ${T('25=5^2')}: the 5 comes out, the 3 stays in.` },
    vars: [{ v: 'x', e: 4 }, { v: 'y', e: 7 }], res: '5x^2y^3\\sqrt{3y}' },
  ii: { label: '2(b)(ii)', idx: 3, q: '\\sqrt[3]{-40a^7b^3}', num: { n: -40, inT: '-40=' + cA('-8') + '\\cdot5', out: '-2', stay: '5', why: `${T('-40=-8\\cdot5')}, and ${T('-8=(-2)^3')}: the ${T('-2')} comes out, the 5 stays in.` },
    vars: [{ v: 'a', e: 7 }, { v: 'b', e: 3 }], res: '-2a^2b\\sqrt[3]{5a}' },
  iii: { label: '2(b)(iii)', idx: 2, into: true, q: '3x\\sqrt{2x}', res: '\\sqrt{18x^3}' },
  tbl: { label: 'Summary: ' + T('\\sqrt{20x^5}'), idx: 2, q: '\\sqrt{20x^5}', num: { n: 20, inT: '20=' + cA('4') + '\\cdot5', out: '2', stay: '5', why: `${T('20=4\\cdot5')}, and ${T('4=2^2')}: the 2 comes out, the 5 stays in.` },
    vars: [{ v: 'x', e: 5 }], res: '2x^2\\sqrt{5x}' }
};
const supT = (v, e) => (e === 1 ? v : `${v}^{${e}}`);
const varRad = {
  title: 'Divide the exponent by the index',
  height: 430,
  minW: 920,
  choices: Object.keys(VR).map((k) => ({ v: k, label: VR[k].label })),
  ask: (k) => (VR[k].into ? `Write ${T(VR[k].q)} as an entire radical.` : `Simplify ${T(VR[k].q)}.`),
  make(stage, k, ex) {
    const d = VR[k], W = ex.W, idx = d.idx, TS = 46, TG = 8;
    const B = new Box(stage, { x: 0, y: 0 }, 'u2l7-vrbox', W, 430);
    const RX = 300, TOP = 26, BOT = 336, IN0 = RX + 64;
    // the radical sign: a little tick, down stroke, long up stroke, then the roof
    svgEl('path', { d: `M${RX - 34} ${BOT - 80} L${RX - 16} ${BOT - 92} L${RX + 10} ${BOT} L${RX + 46} ${TOP} L${W - 14} ${TOP}`, fill: 'none', stroke: '#1c2230', 'stroke-width': 5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, B.svg);
    if (idx === 3) lab(B, RX - 30, BOT - 122, T('3'), 'u2l7-vridx');
    lab(B, 150, TOP - 4, '<b>outside</b>', 'u2l7-vrhd');
    const rowsY = d.into ? [70, 170] : [70, ...d.vars.map((_, i) => 160 + i * 92)];
    const res = hide(div(stage, 'u2l7-vrres', '', 0, 360, W, 60));
    const slot = (y, html) => { const s = div(stage, 'u2l7-vtok u2l7-vslot', html, 150 - TS / 2 - 10, y - TS / 2, TS + 20, TS); hide(s); return s; };
    const tileAt = (j) => IN0 + j * (TS + TG);
    if (d.into) {
      // 3x√(2x): 3 and x go in squared
      const numIn = div(stage, 'u2l7-vnum', T('2'), IN0, rowsY[0] - 24, 400, 48);
      const out3 = div(stage, 'u2l7-vtok u2l7-vout', T('3'), 130, rowsY[0] - TS / 2, TS, TS);
      const outx = div(stage, 'u2l7-vtok u2l7-vout', T('x'), 130, rowsY[1] - TS / 2, TS, TS);
      const xs = [div(stage, 'u2l7-vtok', T('x'), tileAt(0), rowsY[1] - TS / 2, TS, TS)];
      return [
        { cap: `Going <b>in</b>: each factor outside goes in raised to the index, so here <b>squared</b> (index 2).`, run: async (c) => { await pulse(c, out3, 1.15); await pulse(c, outx, 1.15); } },
        { cap: `${T('3')} goes in as ${T('3^2=9')}.`, run: async (c) => { await flyTo(c, out3, IN0 - 4, rowsY[0] - TS / 2); out3.remove(); await swap(c, numIn, T(cA('9') + '\\cdot2=18')); } },
        { cap: `${T('x')} goes in as ${T('x^2')}: two more ${T('x')} tiles join the one inside, so ${T('x^2\\cdot x=x^3')}.`, run: async (c) => {
          for (let j = 1; j <= 2; j++) { const t = div(stage, 'u2l7-vtok u2l7-vin', T('x'), 130, rowsY[1] - TS / 2, TS, TS); await flyTo(c, t, tileAt(j), rowsY[1] - TS / 2, 420); xs.push(t); }
          outx.remove();
        } },
        { cap: `Multiply what is inside: ${T('9\\cdot2=18')} and ${T('x^2\\cdot x=x^3')}. So ${T('3x\\sqrt{2x}=\\sqrt{18x^3}')}.`, run: async (c) => { res.innerHTML = T('3x\\sqrt{2x}=\\sqrt{(3x)^2\\cdot2x}=\\sqrt{9x^2\\cdot2x}=\\sqrt{18x^3}'); await show(c, res); } }
      ];
    }
    const numIn = div(stage, 'u2l7-vnum', T(String(d.num.n)), IN0, rowsY[0] - 24, 420, 48);
    const nslot = slot(rowsY[0], T(d.num.out));
    const rows = d.vars.map((vv, i) => {
      const y = rowsY[i + 1], tiles = [];
      for (let j = 0; j < vv.e; j++) tiles.push(div(stage, 'u2l7-vtok', T(vv.v), tileAt(j), y - TS / 2, TS, TS));
      return { vv, y, tiles, s: slot(y, T(vv.v)), q: Math.floor(vv.e / idx), r: vv.e % idx };
    });
    const grp = idx === 2 ? 'pairs' : 'groups of 3';
    const steps = [
      { cap: `Index ${idx}: a factor can leave the root only as a <b>perfect ${idx === 2 ? 'square' : 'cube'}</b>, so the tiles leave in <b>${grp}</b>.`, run: async (c) => { for (const r of rows) await pulse(c, r.tiles[0], 1.12, 300); } },
      { cap: d.num.why, run: async (c) => {
        await swap(c, numIn, T(d.num.inT));
        const t = div(stage, 'u2l7-vtok u2l7-vfly', T(d.num.out), IN0 + 40, rowsY[0] - TS / 2, TS + 20, TS);
        await flyTo(c, t, 150 - TS / 2 - 10, rowsY[0] - TS / 2); t.remove(); nslot.style.opacity = 1; await pop(c, nslot);
        await swap(c, numIn, T(d.num.stay));
      } }
    ];
    rows.forEach((r) => {
      const { v, e } = r.vv;
      steps.push({
        cap: `${T(supT(v, e))}: ${T(`${e}\\div${idx}=${r.q}`)} remainder ${r.r}. ${T(supT(v, r.q))} comes out${r.r ? `, ${T(supT(v, r.r))} stays in` : ', nothing stays in'}.`,
        run: async (c) => {
          for (let g = 0; g < r.q; g++) {
            const grpT = r.tiles.slice(g * idx, g * idx + idx);
            grpT.forEach((t) => t.classList.add('u2l7-vgrp'));
            await pulse(c, grpT[0], 1.1, 260);
            const tok = div(stage, 'u2l7-vtok u2l7-vfly', T(v), parseFloat(grpT[0].style.left), r.y - TS / 2, TS, TS);
            grpT.forEach((t) => t.classList.add('u2l7-vgone'));
            await flyTo(c, tok, 150 - TS / 2 - 10, r.y - TS / 2, 460); tok.remove();
            r.s.innerHTML = T(supT(v, g + 1)); r.s.style.opacity = 1; await pop(c, r.s, 300);
          }
          r.tiles.slice(r.q * idx).forEach((t) => t.classList.add('u2l7-vstay'));
        }
      });
    });
    steps.push({ cap: `Outside times outside, inside stays inside: ${T(d.q + '=' + d.res)}.`, run: async (c) => { res.innerHTML = T(d.q + '=' + d.res); await show(c, res); } });
    return steps;
  }
};

/* =============================== explainer: like radicals as tiles (Example 3) =============================== */
const CL = {
  a: { label: 'Example 3(a)', unit: '\\sqrt{2}', terms: [{ raw: '2\\sqrt{50}', simp: '2(5\\sqrt{2})=10\\sqrt{2}', k: 10 }, { raw: '-3\\sqrt{18}', simp: '-3(3\\sqrt{2})=-9\\sqrt{2}', k: -9 }, { raw: '+\\sqrt{32}', simp: '+4\\sqrt{2}', k: 4 }], res: '5\\sqrt{2}', sum: '10-9+4=5' },
  b: { label: '3(b)', unit: '\\sqrt[3]{2}', terms: [{ raw: '\\sqrt[3]{54}', simp: '3\\sqrt[3]{2}', k: 3 }, { raw: '+4\\sqrt[3]{16}', simp: '+4(2\\sqrt[3]{2})=8\\sqrt[3]{2}', k: 8 }, { raw: '-\\sqrt[3]{250}', simp: '-5\\sqrt[3]{2}', k: -5 }], res: '6\\sqrt[3]{2}', sum: '3+8-5=6' },
  c: { label: '3(c)', unit: 'x\\sqrt{3x}', terms: [{ raw: '\\sqrt{12x^3}', simp: '2x\\sqrt{3x}', k: 2 }, { raw: '-x\\sqrt{27x}', simp: '-3x\\sqrt{3x}', k: -3 }, { raw: '+5\\sqrt{3x^3}', simp: '+5x\\sqrt{3x}', k: 5 }], res: '4x\\sqrt{3x}', sum: '2-3+5=4' },
  tbl: { label: 'Summary: ' + T('\\sqrt{12}+\\sqrt{27}'), unit: '\\sqrt{3}', terms: [{ raw: '\\sqrt{12}', simp: '2\\sqrt{3}', k: 2 }, { raw: '+\\sqrt{27}', simp: '+3\\sqrt{3}', k: 3 }], res: '5\\sqrt{3}', sum: '2+3=5' },
  un: { label: 'Unlike radicals', units: ['\\sqrt{2}', '\\sqrt{3}'], terms: [{ raw: '\\sqrt{8}', simp: '2\\sqrt{2}', k: 2, u: 0 }, { raw: '+\\sqrt{27}', simp: '+3\\sqrt{3}', k: 3, u: 1 }, { raw: '+\\sqrt{2}', simp: '+\\sqrt{2}', k: 1, u: 0 }], res: '3\\sqrt{2}+3\\sqrt{3}' }
};
const collect = {
  title: 'Like radicals: count them like x’s',
  height: 430,
  minW: 920,
  choices: Object.keys(CL).map((k) => ({ v: k, label: CL[k].label })),
  ask: (k) => `Simplify ${T(CL[k].terms.map((t) => t.raw).join(''))}`,
  make(stage, k, ex) {
    const d = CL[k], W = ex.W, n = d.terms.length, cw = Math.min(290, (W - 20) / n - 14), gap = (W - n * cw) / (n + 1);
    const cards = d.terms.map((t, i) => {
      const el = div(stage, 'u2l7-ccard', `<div class="u2l7-craw">${T(t.raw)}</div>`, gap + i * (cw + gap), 4, cw, 104);
      el.s = hide(line(el, T('=' + t.simp.replace(/^=/, '')), 'u2l7-csimp')); return el;
    });
    const units = d.units || [d.unit], TW = d.unit === 'x\\sqrt{3x}' ? 86 : d.unit === '\\sqrt[3]{2}' ? 64 : 56, TH = 44, TG = 6;
    const rowY = (i) => 128 + i * 62, X0 = 120;
    const rowLab = d.terms.map((t, i) => hide(div(stage, 'u2l7-crl ' + (t.k < 0 ? 'u2l7-neg' : ''), T((t.k < 0 ? '' : '+') + t.k), 10, rowY(i), 96, TH)));
    const tiles = [];
    d.terms.forEach((t, i) => {
      for (let j = 0; j < Math.abs(t.k); j++) {
        const u = t.u || 0, el = div(stage, 'u2l7-tile ' + (t.k < 0 ? 'u2l7-tneg' : u ? 'u2l7-tu1' : 'u2l7-tpos'), T((t.k < 0 ? '-' : '') + units[u]), X0 + j * (TW + TG), rowY(i), TW, TH);
        el.neg = t.k < 0; el.u = u; hide(el); tiles.push(el);
      }
    });
    const res = hide(div(stage, 'u2l7-cres', '', 0, 376, W, 50));
    const st = putStamp(stage, '✓', W - 50, 400);
    const steps = [
      { cap: `<b>Simplify every radical first.</b> Take out each perfect ${d.unit === '\\sqrt[3]{2}' ? 'cube' : 'square'}.`, run: async (c) => { for (const cd of cards) await show(c, cd.s); } }
    ];
    if (d.units) {
      steps.push({ cap: `Two <b>different</b> radicals: ${T(cB('\\sqrt{2}'))} tiles and ${T(cG('\\sqrt{3}'))} tiles. They are as different as ${T('x')} and ${T('y')}.`, run: async (c) => { for (const r of rowLab) r.style.opacity = 1; for (const t of tiles) { t.style.opacity = 1; await pop(c, t, 200); } } });
      steps.push({ cap: `Collect each kind: ${T('\\sqrt{2}')} with ${T('\\sqrt{2}')}, ${T('\\sqrt{3}')} with ${T('\\sqrt{3}')}.`, run: async (c) => {
        rowLab.forEach((r) => (r.style.opacity = 0));
        const cnt = [0, 0]; const jobs = [];
        for (const t of tiles) { const j = cnt[t.u]++; jobs.push(flyTo(c, t, X0 + j * (TW + TG) + (t.u ? 330 : 0), 300, 520)); }
        await Promise.all(jobs);
      } });
      steps.push({ cap: `${T('3\\sqrt{2}+3\\sqrt{3}')}: the radicands are different, so it <b>stops here</b>. It is not ${T('6\\sqrt{5}')}!`, run: async (c) => { res.innerHTML = T(d.terms.map((t) => t.raw).join('') + '=' + d.terms.map((t) => t.simp).join('') + '=' + d.res); await show(c, res); await stampOn(c, st); } });
      return steps;
    }
    steps.push({ cap: `Every term is now a multiple of ${T(cB(d.unit))}: <b>like radicals</b>. Treat ${T(d.unit)} as one unit, like ${T('x')}.`, run: async (c) => { for (const r of rowLab) r.style.opacity = 1; for (const t of tiles) { t.style.opacity = 1; await pop(c, t, 160); } } });
    const negs = tiles.filter((t) => t.neg), poss = tiles.filter((t) => !t.neg);
    if (negs.length) steps.push({ cap: `Each ${T('-' + d.unit)} cancels a ${T('+' + d.unit)}: a zero pair.`, run: async (c) => {
      for (let i = 0; i < negs.length; i++) { negs[i].classList.add('u2l7-zero'); poss[i].classList.add('u2l7-zero'); }
      await Promise.all(negs.concat(poss.slice(0, negs.length)).map((t) => anim(c, t, [{ opacity: 1 }, { opacity: 0.18 }], 600)));
    } });
    steps.push({ cap: `Count what is left: ${T(d.sum)}. So the sum is ${T(d.res)}.`, run: async (c) => {
      const left = poss.slice(negs.length); rowLab.forEach((r) => (r.style.opacity = 0));
      await Promise.all(left.map((t, j) => flyTo(c, t, X0 + j * (TW + TG), 316, 520)));
      res.innerHTML = `<span>${T(d.sum)} &nbsp;⟹&nbsp; ${T(d.res)}</span>`; await show(c, res); await stampOn(c, st);
    } });
    return steps;
  }
};

/* =============================== explainer: area model for multiplying (Example 4) =============================== */
const AM = {
  a: { label: 'Example 4(a)', rows: ['3\\sqrt{2}'], cols: ['4\\sqrt{6}', '-\\sqrt{10}'],
    cells: [[{ p: '3\\sqrt{2}\\cdot4\\sqrt{6}', v: '12\\sqrt{12}=24\\sqrt{3}', g: 'a' }, { p: '3\\sqrt{2}\\cdot(-\\sqrt{10})', v: '-3\\sqrt{20}=-6\\sqrt{5}', g: 'b' }]],
    sum: ['=24\\sqrt{3}-6\\sqrt{5}'], c4: `${T('\\sqrt{3}')} and ${T('\\sqrt{5}')} are unlike: nothing to collect.`, res: '24\\sqrt{3}-6\\sqrt{5}' },
  b: { label: '4(b)', rows: ['2\\sqrt{3}', '-\\sqrt{5}'], cols: ['\\sqrt{3}', '4\\sqrt{5}'],
    cells: [[{ p: '2\\sqrt{3}\\cdot\\sqrt{3}', v: '2(3)=6', g: 'r' }, { p: '2\\sqrt{3}\\cdot4\\sqrt{5}', v: '8\\sqrt{15}', g: 'm' }], [{ p: '-\\sqrt{5}\\cdot\\sqrt{3}', v: '-\\sqrt{15}', g: 'm' }, { p: '-\\sqrt{5}\\cdot4\\sqrt{5}', v: '-4(5)=-20', g: 'r' }]],
    sum: ['=6+8\\sqrt{15}-\\sqrt{15}-20', '=-14+7\\sqrt{15}'], c4: `Collect: the two ${T('\\sqrt{15}')} boxes make ${T('7\\sqrt{15}')}; the whole numbers make ${T('6-20=-14')}.`, res: '-14+7\\sqrt{15}' },
  c: { label: '4(c)', rows: ['3\\sqrt{2}', '-2'], cols: ['3\\sqrt{2}', '-2'],
    cells: [[{ p: '(3\\sqrt{2})^2', v: '9(2)=18', g: 'r' }, { p: '3\\sqrt{2}\\cdot(-2)', v: '-6\\sqrt{2}', g: 'm' }], [{ p: '-2\\cdot3\\sqrt{2}', v: '-6\\sqrt{2}', g: 'm' }, { p: '(-2)^2', v: '4', g: 'r' }]],
    sum: ['=18-6\\sqrt{2}-6\\sqrt{2}+4', '=22-12\\sqrt{2}'], c4: `A square: the middle box appears <b>twice</b>, ${T('-6\\sqrt{2}-6\\sqrt{2}=-12\\sqrt{2}')}; and ${T('18+4=22')}.`, res: '22-12\\sqrt{2}' },
  d: { label: '4(d)', rows: ['5', '2\\sqrt{6}'], cols: ['5', '-2\\sqrt{6}'], cancel: true,
    cells: [[{ p: '5\\cdot5', v: '25', g: 'r' }, { p: '5\\cdot(-2\\sqrt{6})', v: '-10\\sqrt{6}', g: 'm' }], [{ p: '2\\sqrt{6}\\cdot5', v: '10\\sqrt{6}', g: 'm' }, { p: '2\\sqrt{6}\\cdot(-2\\sqrt{6})', v: '-4(6)=-24', g: 'r' }]],
    sum: ['=25-10\\sqrt{6}+10\\sqrt{6}-24', '=1'], c4: `<b>Conjugates:</b> the middle boxes are opposites, ${T('-10\\sqrt{6}+10\\sqrt{6}=0')}. They cancel!`, res: '1' }
};
const areaModel = {
  title: 'The area model',
  height: 420,
  minW: 940,
  choices: Object.keys(AM).map((k) => ({ v: k, label: AM[k].label })),
  ask: (k) => { const d = AM[k]; const br = (a) => (a.length > 1 ? `\\left(${a.join('+').replace(/\+-/g, '-')}\\right)` : a[0]); return `Expand and simplify ${T(k === 'c' ? '\\left(3\\sqrt{2}-2\\right)^2' : br(d.rows) + br(d.cols))}`; },
  make(stage, k, ex) {
    const d = AM[k], W = ex.W, PW = 300, GX = 128, GY = 58, gw = W - PW - GX - 24, nc = d.cols.length, nr = d.rows.length;
    const CW = gw / nc, RH = nr === 1 ? 140 : 140;
    const hdr = (html, x, y, w, hh, cls) => div(stage, 'u2l7-amh ' + cls, T(html), x, y, w, hh);
    const colH = d.cols.map((s, j) => hide(hdr(s, GX + j * CW, GY - 50, CW, 44, 'u2l7-amc')));
    const rowH = d.rows.map((s, i) => hide(hdr(s, GX - 120, GY + i * RH, 112, RH, 'u2l7-amr')));
    const cells = d.cells.map((row, i) => row.map((cl, j) => {
      const el = hide(div(stage, 'u2l7-amcell', `<div class="u2l7-amp">${T(cl.p)}</div><div class="u2l7-amv">${T('=' + cl.v)}</div>`, GX + j * CW, GY + i * RH, CW, RH));
      el.cl = cl; return el;
    }));
    const frame = hide(div(stage, 'u2l7-amframe', '', GX, GY, gw, nr * RH));
    const P = panel(stage, W - PW, 4, PW, 410, 'Collect', 'u2l7-ampan');
    const sl = d.sum.map((s) => hide(line(P, T(s), 'u2l7-ws')));
    const st = putStamp(stage, d.cancel ? 'rational!' : '✓', W - PW / 2, 360, { size: d.cancel ? 'sm' : undefined });
    const fill = (i) => async (c) => { for (const el of cells[i]) { el.style.opacity = 1; await fadeIn(c, el, 340); } };
    const steps = [
      { cap: `One row for each term of the first factor, one column for each term of the second: <b>${nr * nc} boxes</b>, one for each product.`, run: async (c) => { frame.style.opacity = 1; await appear(c, frame); for (const e of colH.concat(rowH)) await show(c, e); } },
      { cap: nr === 1 ? `Fill each box: coefficients times coefficients, radicands times radicands, then simplify.` : `Top row: multiply ${T(d.rows[0])} by each column.`, run: fill(0) }
    ];
    if (nr > 1) steps.push({ cap: `Bottom row: multiply ${T(d.rows[1])} by each column. Remember ${T('\\left(\\sqrt{a}\\right)^2=a')}.`, run: fill(1) });
    steps.push({ cap: d.c4, run: async (c) => {
      cells.flat().forEach((el) => el.classList.add('u2l7-g' + el.cl.g));
      if (d.cancel) { const mids = cells.flat().filter((el) => el.cl.g === 'm'); mids.forEach((el) => el.classList.add('u2l7-cancel')); await Promise.all(mids.map((el) => shake(c, el))); }
      await show(c, sl[0]);
    } });
    steps.push({ cap: d.cancel ? `${T('25-24=1')}: a binomial times its <b>conjugate</b> is always rational.` : `So the product is ${T(d.res)}.`, run: async (c) => { for (const l of sl.slice(1)) await show(c, l); await stampOn(c, st); } });
    return steps;
  }
};

/* =============================== explainer: rationalizing (Examples 5 and 6) =============================== */
const RZ = {
  e5c: { label: 'Example 5(c)', f: '\\dfrac{15}{2\\sqrt{3}}', one: '\\dfrac{\\sqrt{3}}{\\sqrt{3}}', kind: 'sq', r: '3', why: `${T('2\\sqrt{3}\\cdot\\sqrt{3}=2(3)=6')}`,
    lines: ['=\\dfrac{15\\sqrt{3}}{2(3)}', '=\\dfrac{15\\sqrt{3}}{6}', '=\\dfrac{5\\sqrt{3}}{2}'], c3: `Why ${T('\\sqrt{3}')}? A square with side ${T('\\sqrt{3}')} has area 3: ${T('\\sqrt{3}\\cdot\\sqrt{3}=3')}, a whole number.` },
  e5d: { label: '5(d)', f: '\\dfrac{6}{\\sqrt[3]{9}}', one: '\\dfrac{\\sqrt[3]{3}}{\\sqrt[3]{3}}', kind: 'cube', have: ['3', '3'], need: ['3'], cube: '27=3^3',
    lines: ['=\\dfrac{6\\sqrt[3]{3}}{\\sqrt[3]{27}}', '=\\dfrac{6\\sqrt[3]{3}}{3}', '=2\\sqrt[3]{3}'], c3: `Why ${T('\\sqrt[3]{3}')}? ${T('9=3\\cdot3')}: a perfect <b>cube</b> needs three equal factors, so one more 3 makes ${T('27=3^3')}.` },
  tbl: { label: 'Summary: ' + T('\\tfrac{4}{\\sqrt[3]{2}}'), f: '\\dfrac{4}{\\sqrt[3]{2}}', one: '\\dfrac{\\sqrt[3]{4}}{\\sqrt[3]{4}}', kind: 'cube', have: ['2'], need: ['2', '2'], cube: '8=2^3',
    lines: ['=\\dfrac{4\\sqrt[3]{4}}{\\sqrt[3]{8}}', '=\\dfrac{4\\sqrt[3]{4}}{2}', '=2\\sqrt[3]{4}'], c3: `Why ${T('\\sqrt[3]{4}')}? ${T('2')} is one factor of 2; two more (${T('2\\cdot2=4')}) make ${T('8=2^3')}, a perfect cube.` },
  sep: { sep: 'Conjugates:' },
  e6a: { label: '6(a)', f: '\\dfrac{8}{\\sqrt{7}-\\sqrt{3}}', one: '\\dfrac{\\sqrt{7}+\\sqrt{3}}{\\sqrt{7}+\\sqrt{3}}', kind: 'conj', conj: '\\sqrt{7}+\\sqrt{3}', A: '\\sqrt{7}', B: '\\sqrt{3}', s: -1, AA: '7', BB: '3', AB: '\\sqrt{21}', den: '7-3=4',
    lines: ['=\\dfrac{8(\\sqrt{7}+\\sqrt{3})}{7-3}', '=2(\\sqrt{7}+\\sqrt{3})', '=2\\sqrt{7}+2\\sqrt{3}'] },
  e6b: { label: '6(b)', f: '\\dfrac{3+\\sqrt{5}}{3-\\sqrt{5}}', one: '\\dfrac{3+\\sqrt{5}}{3+\\sqrt{5}}', kind: 'conj', conj: '3+\\sqrt{5}', A: '3', B: '\\sqrt{5}', s: -1, AA: '9', BB: '5', AB: '3\\sqrt{5}', den: '9-5=4',
    lines: ['=\\dfrac{(3+\\sqrt{5})(3+\\sqrt{5})}{9-5}', '=\\dfrac{9+6\\sqrt{5}+5}{4}=\\dfrac{14+6\\sqrt{5}}{4}', '=\\dfrac{7+3\\sqrt{5}}{2}'] },
  e6c: { label: '6(c)', f: '\\dfrac{\\sqrt{6}}{2\\sqrt{3}+\\sqrt{2}}', one: '\\dfrac{2\\sqrt{3}-\\sqrt{2}}{2\\sqrt{3}-\\sqrt{2}}', kind: 'conj', conj: '2\\sqrt{3}-\\sqrt{2}', A: '2\\sqrt{3}', B: '\\sqrt{2}', s: 1, AA: '12', BB: '2', AB: '2\\sqrt{6}', den: '12-2=10',
    lines: ['=\\dfrac{2\\sqrt{18}-\\sqrt{12}}{12-2}', '=\\dfrac{6\\sqrt{2}-2\\sqrt{3}}{10}', '=\\dfrac{3\\sqrt{2}-\\sqrt{3}}{5}'] }
};
const rationalize = {
  title: 'Rationalize: multiply by a form of 1',
  height: 430,
  minW: 940,
  choices: Object.keys(RZ).map((k) => (RZ[k].sep ? RZ[k] : { v: k, label: RZ[k].label })),
  ask: (k) => `Rationalize the denominator: ${T(RZ[k].f)}`,
  make(stage, k, ex) {
    const d = RZ[k], W = ex.W;
    const eq = div(stage, 'u2l7-rzeq', '', 0, 4, W, 110);
    const fEl = h('span', 'u2l7-rzf', T(d.f)), dot = h('span', 'u2l7-rzdot', T('\\times')), oneEl = h('span', 'u2l7-rzone', T(d.one) + '<span class="u2l7-rzbadge">= 1</span>');
    eq.append(fEl, dot, oneEl); hide(dot); hide(oneEl);
    const PicW = 440, pic = div(stage, 'u2l7-rzpic', '', 0, 128, PicW, 300);
    const P = panel(stage, PicW + 16, 128, W - PicW - 18, 300, 'Simplify', 'u2l7-rzpan');
    const ls = d.lines.map((s) => hide(line(P, T(s), 'u2l7-ws')));
    const st = putStamp(stage, 'rational denominator', PicW + 16 + (W - PicW - 18) / 2, 400, { size: 'sm' });
    let picSteps;
    if (d.kind === 'sq') {
      const sq = hide(div(pic, 'u2l7-rzsq', T('3'), 150, 70, 170, 170));
      const t1 = hide(div(pic, 'u2l7-rzsl', T('\\sqrt{3}'), 150, 30, 170, 36)), t2 = hide(div(pic, 'u2l7-rzsl', T('\\sqrt{3}'), 60, 136, 84, 36));
      const cap = hide(div(pic, 'u2l7-rzcap', T('\\sqrt{3}\\cdot\\sqrt{3}=3'), 0, 254, PicW, 40));
      picSteps = async (c) => { sq.style.opacity = 1; await pop(c, sq); await show(c, t1); await show(c, t2); await show(c, cap); };
    } else if (d.kind === 'cube') {
      const all = d.have.map((v) => ({ v, cls: 'u2l7-cbh' })).concat(d.need.map((v) => ({ v, cls: 'u2l7-cbn' })));
      const bw = 86, x0 = (PicW - all.length * (bw + 16) + 16) / 2;
      const blocks = all.map((b, i) => hide(div(pic, 'u2l7-cb ' + b.cls, T(b.v), x0 + i * (bw + 16), 70, bw, bw)));
      const hv = hide(div(pic, 'u2l7-rzcap u2l7-small', `${T(cB(d.have.join('\\cdot')))} under the root now`, 0, 22, PicW, 36));
      const cap = hide(div(pic, 'u2l7-rzcap', `${T(cB(d.have.join('\\cdot')) + '\\cdot' + cA(d.need.join('\\cdot')) + '=' + d.cube)}`, 0, 190, PicW, 44));
      const cap2 = hide(div(pic, 'u2l7-rzcap', T(`\\sqrt[3]{${d.cube.split('=')[0]}}=${d.cube.split('=')[1].split('^')[0]}`), 0, 240, PicW, 44));
      picSteps = async (c) => { await show(c, hv); for (let i = 0; i < blocks.length; i++) { blocks[i].style.opacity = 1; await pop(c, blocks[i]); } await show(c, cap); await show(c, cap2); };
    } else {
      const sg = d.s < 0 ? ['-', '+'] : ['+', '-'];
      const rowsT = [d.A, sg[0] + d.B], colsT = [d.A, sg[1] + d.B], GX = 120, GY = 52, CW = 150, RH = 74;
      colsT.forEach((s, j) => div(pic, 'u2l7-amh u2l7-amc u2l7-sm', T(s), GX + j * CW, GY - 40, CW, 36));
      rowsT.forEach((s, i) => div(pic, 'u2l7-amh u2l7-amr u2l7-sm', T(s), GX - 106, GY + i * RH, 100, RH));
      const vals = [[d.AA, sg[1] + d.AB], [sg[0] + d.AB, '-' + d.BB]];
      const cells = vals.map((r, i) => r.map((v, j) => hide(div(pic, 'u2l7-amcell u2l7-sm' + (i !== j ? ' u2l7-gm' : ' u2l7-gr'), T(v), GX + j * CW, GY + i * RH, CW, RH))));
      const cap = hide(div(pic, 'u2l7-rzcap', `${T('\\text{bottom}=' + d.den)}`, 0, 222, PicW, 44));
      picSteps = async (c) => {
        for (const el of cells.flat()) { el.style.opacity = 1; await fadeIn(c, el, 260); }
        const mids = [cells[0][1], cells[1][0]]; mids.forEach((el) => el.classList.add('u2l7-cancel')); await Promise.all(mids.map((el) => shake(c, el)));
        await show(c, cap);
      };
    }
    const c2 = d.kind === 'conj' ? `Multiply top and bottom by the <b>conjugate</b> ${T(cP(d.conj))}: same two terms, middle sign changed. The fraction equals 1.`
      : `Multiply by ${T(d.one)}. It equals 1, so the value doesn’t change.`;
    const c3 = d.kind === 'conj' ? `The bottom times its conjugate: the two middle boxes are opposites and <b>cancel</b>. ${T(d.den)}: rational!` : d.c3;
    return [
      { cap: `A radical in the denominator: not simplest form yet.`, run: (c) => pulse(c, fEl, 1.06) },
      { cap: c2, run: async (c) => { dot.style.opacity = 1; oneEl.style.opacity = 1; await pop(c, oneEl); } },
      { cap: c3, run: picSteps },
      { cap: `Multiply out: the denominator is now a whole number.`, run: (c) => show(c, ls[0]) },
      { cap: `Simplify and reduce: ${T(d.lines[d.lines.length - 1].replace(/^=/, ''))}.`, run: async (c) => { for (const l of ls.slice(1)) await show(c, l); await stampOn(c, st); } }
    ];
  }
};

/* =============================== explainer: the exact rectangle (Example 7) =============================== */
const RC = { a: { label: 'Example 7(a) perimeter' }, b: { label: '7(b) area' }, c: { label: '7(c) diagonal' } };
const rectangle = {
  title: 'An exact rectangle',
  height: 430,
  minW: 940,
  choices: Object.keys(RC).map((k) => ({ v: k, label: RC[k].label })),
  ask: () => `Length ${T('(2\\sqrt{5}+\\sqrt{3})')} m, width ${T('(2\\sqrt{5}-\\sqrt{3})')} m.`,
  make(stage, k, ex) {
    const W = ex.W, u = 50, a = 2 * Math.sqrt(5) * u, b = Math.sqrt(3) * u, Lp = a + b, Wp = a - b, PX = 480;
    const P = panel(stage, PX, 4, W - PX - 2, 420, 'Work', 'u2l7-rcpan');
    const L = (s, cls = 'u2l7-ws') => hide(line(P, T(s), cls));
    const st = putStamp(stage, '✓', W - 50, 392);
    const X0 = 30, Y0 = 110;
    if (k === 'b') {
      const SX = 20, SY = 70;
      const p1 = hide(div(stage, 'u2l7-rcp u2l7-rcp1', '', SX, SY, a, Wp));
      const p2 = hide(div(stage, 'u2l7-rcp u2l7-rcp2', '', SX, SY + Wp, Wp, b));
      const cut = hide(div(stage, 'u2l7-rcp u2l7-rcp3', T('3'), SX + Wp, SY + Wp, b, b));
      const big = hide(div(stage, 'u2l7-rcbig', T('20'), SX, SY, a, a));
      const sa = hide(div(stage, 'u2l7-rcl', T('2\\sqrt{5}'), SX, SY - 36, a, 32));
      const sb = hide(div(stage, 'u2l7-rcl u2l7-rclr', T(cR('\\sqrt{3}')), SX + Wp, SY + a + 4, b, 32));
      const topL = hide(div(stage, 'u2l7-rcl', T('2\\sqrt{5}+\\sqrt{3}'), SX, SY - 36, a + b, 32));
      const rightL = hide(div(stage, 'u2l7-rcl u2l7-rclv', T('2\\sqrt{5}-\\sqrt{3}'), SX + a + b + 8, SY + Wp / 2 - 16, 124, 32));
      const l1 = L('A=(2\\sqrt{5}+\\sqrt{3})(2\\sqrt{5}-\\sqrt{3})'), l2 = L('=20-2\\sqrt{15}+2\\sqrt{15}-3'), l3 = L('=20-3=17\\text{ m}^2', 'u2l7-ws u2l7-big');
      return [
        { cap: `Area = length × width: ${T('(2\\sqrt{5}+\\sqrt{3})(2\\sqrt{5}-\\sqrt{3})')}. These are <b>conjugates</b>.`, run: (c) => show(c, l1) },
        { cap: `Picture ${T('a^2-b^2')}: start with a square of side ${T('2\\sqrt{5}')}. Its area is ${T('(2\\sqrt{5})^2=4(5)=20')}.`, run: async (c) => { big.style.opacity = 1; await appear(c, big); await show(c, sa); } },
        { cap: `Cut out a ${T('\\sqrt{3}')} by ${T('\\sqrt{3}')} corner: area ${T('(\\sqrt{3})^2=3')}. What is left has area ${T('20-3=17')}.`, run: async (c) => {
          big.style.opacity = 0; p1.style.opacity = 1; p2.style.opacity = 1; cut.style.opacity = 1; sb.style.opacity = 1;
          await anim(c, cut, [{ opacity: 1, transform: 'none' }, { opacity: 0.9, transform: 'translate(40px, 30px) rotate(12deg)' }], 600);
          await anim(c, cut, [{ opacity: 0.9 }, { opacity: 0 }], 400);
        } },
        { cap: `Slide the bottom strip around to the right side: the pieces make a rectangle ${T('(2\\sqrt{5}+\\sqrt{3})')} by ${T('(2\\sqrt{5}-\\sqrt{3})')}: our rectangle!`, run: async (c) => {
          sa.style.opacity = 0; sb.style.opacity = 0;
          const ox = SX + Wp / 2, oy = SY + Wp + b / 2, nx = SX + a + b / 2, ny = SY + Wp / 2;
          box(p2, b, Wp); p2.style.left = (SX + a) + 'px'; p2.style.top = SY + 'px';
          await anim(c, p2, [{ transform: `translate(${ox - nx}px, ${oy - ny}px) rotate(-90deg)` }, { transform: 'none' }], 900);
          await show(c, topL); await show(c, rightL);
        } },
        { cap: `So the area is ${T('20-3=17')} m². In the algebra, the middle terms ${T('\\pm2\\sqrt{15}')} cancel: conjugates give a <b>rational</b> answer.`, run: async (c) => { await show(c, l2); await show(c, l3); await stampOn(c, st); } }
      ];
    }
    const rect = div(stage, 'u2l7-rcrect', '', X0, Y0, Lp, Wp);
    const Lt = div(stage, 'u2l7-rcl', T(cB('2\\sqrt{5}') + '+' + cR('\\sqrt{3}')), X0, Y0 - 38, Lp, 32);
    const Lb = div(stage, 'u2l7-rcl', T(cB('2\\sqrt{5}') + '+' + cR('\\sqrt{3}')), X0, Y0 + Wp + 6, Lp, 32);
    const Wl = div(stage, 'u2l7-rcl u2l7-rclv', T(cB('2\\sqrt{5}') + '-' + cR('\\sqrt{3}')), X0 + Lp + 8, Y0 + Wp / 2 - 16, 124, 32);
    void rect; void Lt; void Lb; void Wl;
    if (k === 'a') {
      const l1 = L('P=2\\left[(2\\sqrt{5}+\\sqrt{3})+(2\\sqrt{5}-\\sqrt{3})\\right]'), l2 = L('=2\\left[4\\sqrt{5}+\\cancel{\\sqrt{3}}-\\cancel{\\sqrt{3}}\\right]'), l3 = L('=2(4\\sqrt{5})=8\\sqrt{5}\\text{ m}', 'u2l7-ws u2l7-big');
      return [
        { cap: `Perimeter: <b>add</b> the four sides. Two lengths and two widths: ${T('P=2(\\ell+w)')}.`, run: async (c) => { for (const e of [Lt, Lb, Wl]) await pulse(c, e, 1.08, 300); await show(c, l1); } },
        { cap: `Adding: collect like radicals. ${T(cB('2\\sqrt{5}+2\\sqrt{5}=4\\sqrt{5}'))}, and ${T(cR('+\\sqrt{3}-\\sqrt{3}=0'))}: the ${T('\\sqrt{3}')}s cancel.`, run: (c) => show(c, l2) },
        { cap: `${T('P=2(4\\sqrt{5})=8\\sqrt{5}')} m.`, run: async (c) => { await show(c, l3); await stampOn(c, st); } }
      ];
    }
    const B = new Box(stage, { x: X0, y: Y0 }, 'u2l7-rcdiag', Lp, Wp);
    const dg = svgEl('path', { class: 'bk-stroke', d: `M0 ${Wp} L${Lp} 0`, stroke: PUR, 'stroke-width': 4, 'stroke-dasharray': '10 7', fill: 'none' }, B.svg); hide(dg);
    const dl = hide(lab(B, Lp / 2 - 10, Wp / 2 - 18, T(cP('d')), 'u2l7-sidel'));
    const l1 = L('d^2=\\ell^2+w^2'), l2 = L('\\ell^2=(2\\sqrt{5}+\\sqrt{3})^2=20+4\\sqrt{15}+3'), l3 = L('w^2=(2\\sqrt{5}-\\sqrt{3})^2=20-4\\sqrt{15}+3');
    const l4 = L('d^2=23+\\cancel{4\\sqrt{15}}+23-\\cancel{4\\sqrt{15}}=46'), l5 = L('d=\\sqrt{46}\\text{ m}', 'u2l7-ws u2l7-big');
    return [
      { cap: `The diagonal makes a right triangle with the length and the width: <b>Pythagoras</b>, ${T('d^2=\\ell^2+w^2')}.`, run: async (c) => { dg.style.opacity = 1; await drawIn(dg, 700, c); await show(c, dl); await show(c, l1); } },
      { cap: `Square the length: ${T('(2\\sqrt{5})^2+2(2\\sqrt{5})(\\sqrt{3})+(\\sqrt{3})^2=20+4\\sqrt{15}+3')}.`, run: (c) => show(c, l2) },
      { cap: `Square the width: the same, but the middle term is ${T('-4\\sqrt{15}')}.`, run: (c) => show(c, l3) },
      { cap: `Add them: the ${T('4\\sqrt{15}')}s cancel, and ${T('23+23=46')}.`, run: (c) => show(c, l4) },
      { cap: `${T('d=\\sqrt{46}')} m. ${T('46=2\\cdot23')} has no perfect-square factor, so this is simplest form.`, run: async (c) => { await show(c, l5); await stampOn(c, st); } }
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
  intro: 'At your whiteboard: decide the operation first, then finish in simplest form. No calculators!',
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
mountDominoes();
export const explainers = mountExplainers({ whichOp, inspector, whyWrong, order, restrict, varRad, collect, areaModel, rationalize, rectangle, ratIrr });
export const _test = { WO, INS, WW, OR, RS, VR, CL, AM, RZ, RI };
