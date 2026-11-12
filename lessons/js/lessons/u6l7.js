/* Math 20-1 · Unit 6 · Lesson 7 — Solving Rational Equations.
 * New lesson format (2026-11-11): the warm-up is plain markup on the page (no code). Explainers (each numbers its rows
 * with the five steps of the procedure box: 1 NPVs, 2 × LCD, 3 solve, 4 reject?, 5 verify):
 *   clear   (STAR: the LCD clears every denominator at once. Each term is multiplied by the LCD, the matching factors
 *            are struck out together and every fraction collapses into the linear equation; concept 3/x + 1 = 5/(2x),
 *            Example 3 checks),
 *   cross   (cross-multiplying: the butterfly X from each numerator to the other denominator, brackets on binomials,
 *            x² terms cancelling; Example 4 checks and the Example 5 club),
 *   tiles   (factor tiles: each denominator splits into factor tiles, the different factors fly into the LCD tray
 *            (duplicates merge), an opposite 4 − x flips to −(x − 4), and each term is multiplied by the tiles it was
 *            missing; Example 6 checks),
 *   verdict (STAR: the NPV verdict. The algebra finds a candidate; the graph of y = LS and y = RS shows the curves never
 *            meet above the NPV, and the candidate is stamped REJECTED; Example 7 checks and Example 6(a) to compare),
 *   calc    (a calculator-style screen: Y=, ZStandard, GRAPH, 2nd TRACE 5: intersect or 2: zero; Example 8 checks).
 * Colours (Unit 6): NPVs purple, the LCD amber, kept / correct green, rejected red; on graphs LS blue, RS red. */
import {
  h, tex, add, box, Graph, stamp, stampIn, mountExplainers, pop, fadeIn, sleep, anim, svgEl, pulse, shake, arrowHead, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const AM = COLORS.amber, PU = COLORS.purple, GR = COLORS.green, RD = COLORS.red, BL = COLORS.blue, INK = COLORS.ink, RA = COLORS.teal;
const cl = (s) => `\\textcolor{${AM}}{${s}}`, cn = (s) => `\\textcolor{${PU}}{${s}}`;
const cg = (s) => `\\textcolor{${GR}}{${s}}`, cr = (s) => `\\textcolor{${RD}}{${s}}`;
const cb = (s) => `\\textcolor{${BL}}{${s}}`, ck = (s) => `\\textcolor{${RA}}{${s}}`;
/** a cancelled piece: red strike, the content in its own colour */
const X = (s, col = INK) => `\\textcolor{${RD}}{\\cancel{\\textcolor{${col}}{${s}}}}`;
/** captions and asks may hold $…$ TeX */
const md = (s) => (typeof s === 'string' ? s.replace(/\$([^$]+)\$/g, (_, t) => T(t)) : s);
function mdDef(def) {
  const mk = def.make, a = def.ask;
  def.make = function (stage, v, ex) { return (mk.call(this, stage, v, ex) || []).map((st) => Object.assign(st, { cap: typeof st.cap === 'string' ? md(st.cap) : st.cap })); };
  if (typeof a === 'function') def.ask = (v) => md(a(v)); else if (typeof a === 'string') def.ask = md(a);
  return def;
}
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const show = (c, el) => { el.style.opacity = ''; return fadeIn(c, el, 320); };
const popIn = (c, el) => { el.style.opacity = ''; return pop(c, el); };
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
/** a div centred on (cx, cy): centring uses the separate translate property, so animations can use transform */
const cdiv = (host, cls, html, cx, cy) => { const d = div(host, cls, html, cx, cy); d.style.translate = '-50% -50%'; return d; };
const keys = (...ks) => `<span class="keys">${ks.map((k) => `<kbd>${k}</kbd>`).join('')}</span>`;

/* the numbered step rail: each row has the procedure's step number beside it */
function rail(stage, x, ys, w) {
  const rows = [];
  return {
    rows,
    row(n, html, cls = '') {
      const r = div(stage, 'u6l7-row ' + cls, `<span class="u6l7-num">${n}</span><span class="u6l7-rt">${html}</span>`, x, ys[rows.length], w);
      r.body = r.lastChild; hide(r); rows.push(r); return r;
    }
  };
}
async function swapTo(c, el, t) {
  await anim(c, el, [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(.86)' }], 160);
  el.innerHTML = T(t);
  await anim(c, el, [{ opacity: 0, transform: 'scale(.86)' }, { opacity: 1, transform: 'scale(1)' }], 260);
}
async function collapse(c, el, t) {
  await anim(c, el, [{ opacity: 1, transform: 'scale(1, 1)' }, { opacity: .25, transform: 'scale(.45, .06)' }], 420);
  el.innerHTML = T(t); el.classList.add('u6l7-done');
  await anim(c, el, [{ opacity: 0, transform: 'scale(.3)' }, { opacity: 1, transform: 'scale(1.16)', offset: .7 }, { opacity: 1, transform: 'scale(1)' }], 380);
}
const lsrs = (t) => t.replace(/(LS|RS)=/g, '\\text{$1}=');
const verdictStamp = (stage, ok, x, y, text) => hide(stamp(stage, text || (ok ? 'Keep it ✓' : 'Rejected: NPV'), { ok, x, y, rotate: ok ? -5 : -8 }));
const stampShow = async (c, st, ok) => { st.style.opacity = ''; await stampIn(c, st); if (!ok) await shake(c, st); };

/* =============================== explainer: the LCD clears every denominator =============================== */
/* terms: [original, cancelled form, result] or an operator string. The multiplied form is built from the LCD. */
const CL = {
  con: {
    label: 'Concept: 3/x + 1 = 5/(2x)', ask: 'Solve $\\dfrac{3}{x}+1=\\dfrac{5}{2x}$.', L: '2x', dens: '$x$ and $2x$', npv: 'x\\ne0',
    terms: [['\\dfrac{3}{x}', `${cl('2' + X('x', AM))}\\left(\\dfrac{3}{${X('x')}}\\right)`, '6'], '+', ['1', `${cl('2x')}(1)`, '2x', 'whole'], '=',
      ['\\dfrac{5}{2x}', `${cl(X('2x', AM))}\\left(\\dfrac{5}{${X('2x')}}\\right)`, '5']],
    poly: '6+2x=5', solve: '2x=-1\\ \\Rightarrow\\ x=-\\tfrac{1}{2}', root: '-\\tfrac{1}{2}',
    verify: 'LS=\\tfrac{3}{-1/2}+1=-5,\\ \\ RS=\\tfrac{5}{2(-1/2)}=-5', note: 'even the $1$, which has no denominator'
  },
  e3a: {
    label: 'Example 3(a) check', ask: 'Example 3(a): solve $\\dfrac{2}{x}+\\dfrac{1}{3}=\\dfrac{7}{3x}$.', L: '3x', dens: '$x$ and $3x$', npv: 'x\\ne0',
    terms: [['\\dfrac{2}{x}', `${cl('3' + X('x', AM))}\\left(\\dfrac{2}{${X('x')}}\\right)`, '6'], '+', ['\\dfrac{1}{3}', `${cl(X('3', AM) + 'x')}\\left(\\dfrac{1}{${X('3')}}\\right)`, 'x'], '=',
      ['\\dfrac{7}{3x}', `${cl(X('3x', AM))}\\left(\\dfrac{7}{${X('3x')}}\\right)`, '7']],
    poly: '6+x=7', solve: 'x=1', root: '1', verify: 'LS=2+\\tfrac{1}{3}=\\tfrac{7}{3},\\ \\ RS=\\tfrac{7}{3}'
  },
  e3b: {
    label: 'Example 3(b) check', ask: 'Example 3(b): solve $\\dfrac{x+1}{2x}-\\dfrac{3}{4}=\\dfrac{1}{x}$.', L: '4x', dens: '$2x$ and $x$', npv: 'x\\ne0',
    terms: [['\\dfrac{x+1}{2x}', `${cl('\\overset{2}{' + X('4x', AM) + '}')}\\left(\\dfrac{x+1}{${X('2x')}}\\right)`, '2(x+1)'], '-', ['\\dfrac{3}{4}', `${cl(X('4', AM) + 'x')}\\left(\\dfrac{3}{${X('4')}}\\right)`, '3x'], '=',
      ['\\dfrac{1}{x}', `${cl('4' + X('x', AM))}\\left(\\dfrac{1}{${X('x')}}\\right)`, '4']],
    poly: '2(x+1)-3x=4', solve: '2x+2-3x=4\\ \\Rightarrow\\ -x=2\\ \\Rightarrow\\ x=-2', root: '-2',
    verify: 'LS=\\tfrac{-1}{-4}-\\tfrac{3}{4}=-\\tfrac{1}{2},\\ \\ RS=\\tfrac{1}{-2}=-\\tfrac{1}{2}'
  },
  e3c: {
    label: 'Example 3(c) check', ask: 'Example 3(c): solve $\\dfrac{4}{3x}+\\dfrac{x-2}{x}=\\dfrac{5}{6}$.', L: '6x', dens: '$3x$ and $x$', npv: 'x\\ne0',
    terms: [['\\dfrac{4}{3x}', `${cl('\\overset{2}{' + X('6x', AM) + '}')}\\left(\\dfrac{4}{${X('3x')}}\\right)`, '8'], '+', ['\\dfrac{x-2}{x}', `${cl('6' + X('x', AM))}\\left(\\dfrac{x-2}{${X('x')}}\\right)`, '6(x-2)'], '=',
      ['\\dfrac{5}{6}', `${cl(X('6', AM) + 'x')}\\left(\\dfrac{5}{${X('6')}}\\right)`, '5x']],
    poly: '8+6(x-2)=5x', solve: '8+6x-12=5x\\ \\Rightarrow\\ x=4', root: '4',
    verify: 'LS=\\tfrac{4}{12}+\\tfrac{2}{4}=\\tfrac{5}{6},\\ \\ RS=\\tfrac{5}{6}'
  }
};
const clear = {
  title: 'The LCD clears every fraction at once',
  height: 470, minW: 940, capH: 84,
  choices: Object.keys(CL).map((k) => ({ v: k, label: CL[k].label })),
  ask: (v) => CL[v].ask,
  make(stage, v, ex) {
    const d = CL[v], W = ex.W;
    const band = div(stage, 'u6l7-band', '', 0, 4, W, 128);
    const els = d.terms.map((t) => {
      const e = h('span', typeof t === 'string' ? 'u6l7-op' : 'u6l7-term', T(typeof t === 'string' ? t : t[0]));
      band.appendChild(e); return e;
    });
    const terms = d.terms.map((t, i) => (typeof t === 'string' ? null : { el: els[i], t })).filter(Boolean);
    const R = rail(stage, 24, [150, 210, 270, 330, 390], W - 48);
    const r1 = R.row(1, `<b>NPV</b> ${T(cn(d.npv))}`);
    const r2 = R.row(2, `<b>× LCD</b> ${T(cl(d.L))} <span class="u6l7-poly">${T('\\Rightarrow\\ ' + d.poly)}</span>`);
    const poly = hide(r2.querySelector('.u6l7-poly'));
    const r3 = R.row(3, `<b>Solve</b> ${T(d.solve)}`);
    const r4 = R.row(4, `<b>NPV?</b> ${T(d.root + '\\ne0')}`);
    const r5 = R.row(5, `<b>Verify</b> ${T(lsrs(d.verify))} <span class="u6l7-okc">✓</span>`);
    const st = verdictStamp(stage, true, 470, 352);
    return [
      { cap: `<b>Step 1.</b> The denominators with a variable are ${d.dens}. Each is $0$ only when $x=0$, so the NPV is $${d.npv}$.`,
        run: async (c) => { await show(c, r1); await Promise.all(terms.filter((q) => q.t[3] !== 'whole').map((q) => pulse(c, q.el, 1.08))); } },
      { cap: `<b>Step 2.</b> Multiply <b>every</b> term by the LCD, $${cl(d.L)}$${d.note ? ', ' + d.note : ''}.`,
        run: async (c) => {
          await show(c, r2);
          for (const q of terms) await swapTo(c, q.el, `${cl(d.L)}${q.t[3] === 'whole' ? `(${q.t[0]})` : `\\left(${q.t[0]}\\right)`}`);
        } },
      { cap: `Each denominator cancels with part of the LCD, and <b>every fraction collapses</b> at once: $${d.poly}$. No fractions left!`,
        run: async (c) => {
          await Promise.all(terms.map((q) => swapTo(c, q.el, q.t[1])));
          await sleep(c, 650);
          await Promise.all(terms.map((q) => collapse(c, q.el, q.t[2])));
          await show(c, poly);
        } },
      { cap: `<b>Step 3.</b> Solve the equation that is left: $${d.solve}$.`, run: (c) => show(c, r3) },
      { cap: `<b>Step 4.</b> Is $x=${d.root}$ an NPV? No, it is not $0$, so we <b>keep it</b>.`, run: async (c) => { await show(c, r4); await stampShow(c, st, true); } },
      { cap: `<b>Step 5.</b> Verify in the <b>original</b> equation: both sides match.`, run: async (c) => { await show(c, r5); await pulse(c, r5, 1.04); } }
    ];
  }
};

/* =============================== explainer: cross-multiplying =============================== */
const CR = {
  e4a: { label: 'Example 4(a) check', ask: 'Example 4(a): solve $\\dfrac{4}{x-1}=\\dfrac{3}{x+2}$.', a: '4', b: 'x-1', c: '3', d: 'x+2', npv: 'x\\ne1,\\ -2',
    L: '4(x+2)', R: '3(x-1)', lines: ['4x+8=3x-3'], sol: 'x=-11', root: '-11', ans: 'x=-11' },
  e4b: { label: 'Example 4(b) check', ask: 'Example 4(b): solve $\\dfrac{2x+1}{x-3}=\\dfrac{4x-5}{2x+1}$.', a: '2x+1', b: 'x-3', c: '4x-5', d: '2x+1', npv: 'x\\ne3,\\ -\\tfrac{1}{2}',
    L: '(2x+1)^2', R: '(4x-5)(x-3)', lines: ['4x^2+4x+1=4x^2-17x+15'], cancel: `${X('4x^2')}+4x+1=${X('4x^2')}-17x+15`, sol: '21x=14\\ \\Rightarrow\\ x=\\tfrac{2}{3}', root: '\\tfrac{2}{3}', ans: 'x=\\tfrac{2}{3}',
    note: '$(2x+1)(2x+1)=(2x+1)^2$.' },
  e4c: { label: 'Example 4(c) check', ask: 'Example 4(c): solve $\\dfrac{5}{3-y}=2$.', v: 'y', a: '5', b: '3-y', c: '2', d: '1', whole: true, npv: 'y\\ne3',
    L: '5', R: '2(3-y)', lines: ['5=6-2y'], sol: 'y=\\tfrac{1}{2}', root: '\\tfrac{1}{2}', ans: 'y=\\tfrac{1}{2}' },
  e5: { label: 'Example 5 check: the club', ask: 'Example 5: 7 more girls than boys, ratio of boys to girls $4:5$. Solve $\\dfrac{b}{b+7}=\\dfrac{4}{5}$.', v: 'b', a: 'b', b: 'b+7', c: '4', d: '5', npv: 'b\\ne-7',
    L: '5b', R: '4(b+7)', lines: ['5b=4b+28'], sol: 'b=28', root: '28', ans: '28\\text{ boys and }35\\text{ girls}', check: '\\tfrac{28}{35}=\\tfrac{4}{5}' }
};
const cross = {
  title: 'Cross-multiplying: one fraction on each side',
  height: 440, minW: 940, capH: 84,
  choices: Object.keys(CR).map((k) => ({ v: k, label: CR[k].label })),
  ask: (v) => CR[v].ask,
  make(stage, v, ex) {
    const d = CR[v], W = ex.W, v0 = d.v || 'x';
    const P = div(stage, 'u6l7-crossp', '', 0, 0, 440, 300);
    const xL = 104, xR = 344, yN = 88, yB = 140, yD = 194;
    const svg = svgEl('svg', { width: 440, height: 300, viewBox: '0 0 440 300', class: 'u6l7-xsvg' }, P);
    const ov = svgEl('svg', { width: 440, height: 300, viewBox: '0 0 440 300', class: 'u6l7-xsvg u6l7-xov' });
    const bar = (x) => svgEl('line', { x1: x - 78, y1: yB, x2: x + 78, y2: yB, stroke: INK, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, svg);
    bar(xL); const barR = bar(xR);
    const nL = cdiv(P, 'u6l7-fp', T(d.a), xL, yN), dL = cdiv(P, 'u6l7-fp', T(d.b), xL, yD);
    const nR = cdiv(P, 'u6l7-fp', T(d.c), xR, d.whole ? yB : yN), dR = cdiv(P, 'u6l7-fp', T(d.d), xR, yD);
    const eq = cdiv(P, 'u6l7-fp u6l7-eqs', T('='), (xL + xR) / 2, yB);
    if (d.whole) { barR.style.opacity = 0; hide(dR); }
    // the butterfly: numerator → the other denominator
    const arrow = (x1, y1, x2, y2, color) => {
      const g = svgEl('g', { class: 'u6l7-arr' }, ov);
      const ln = svgEl('line', { x1, y1, x2, y2, stroke: color, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
      arrowHead(g, x2, y2, x2 - x1, y2 - y1, { color, width: 4 });
      g.style.opacity = 0; g.ln = ln; return g;
    };
    const A1 = arrow(xL + 30, yN + 16, xR - 44, yD - 20, BL), A2 = arrow(xR - 30, yN + 16, xL + 44, yD - 20, RA);
    P.appendChild(ov); // the arrows over the = sign
    const R = rail(stage, 470, [14, 86, 158, 266, 338], W - 480);
    const r1 = R.row(1, `<b>NPVs</b> ${T(cn(d.npv))}`);
    const r2 = R.row(2, `<b>Cross</b> <span class="u6l7-p1">${T(cb(d.L))}</span> ${T('=')} <span class="u6l7-p2">${T(ck(d.R))}</span>`);
    const p1 = hide(r2.querySelector('.u6l7-p1')), p2 = hide(r2.querySelector('.u6l7-p2'));
    const r3 = R.row(3, `<b>Solve</b> <span class="u6l7-l1">${T(d.lines[0])}</span><br><span class="u6l7-l2">${T(d.sol)}</span>`, 'u6l7-two');
    const l1 = r3.querySelector('.u6l7-l1'), l2 = hide(r3.querySelector('.u6l7-l2'));
    const r4 = R.row(4, `<b>NPV?</b> ${T(`${d.root}\\text{ is not an NPV}`)}`);
    const r5 = R.row(5, `<b>Answer</b> ${T('\\boldsymbol{' + d.ans + '}')}${d.check ? ` &nbsp; ${T(d.check)} <span class="u6l7-okc">✓</span>` : ''}`);
    const st = verdictStamp(stage, true, W - 92, 290);
    const steps = [];
    if (d.whole) steps.push({ cap: `There is only one fraction on the left. Write $2$ as $\\dfrac{2}{1}$: now it is a proportion.`,
      run: async (c) => { await anim(c, nR, [{ transform: 'none' }, { transform: `translateY(${yN - yB}px)` }], 420); barR.style.opacity = ''; dR.style.opacity = ''; await pop(c, dR); } });
    steps.push(
      { cap: `<b>Step 1.</b> NPVs from the denominators: $${d.npv}$.`, run: async (c) => { await show(c, r1); dL.classList.add('u6l7-pu'); if (!d.whole) dR.classList.add('u6l7-pu'); await Promise.all([pulse(c, dL, 1.12), d.whole ? null : pulse(c, dR, 1.12)]); } },
      { cap: `<b>Step 2. Cross-multiply:</b> each numerator times the <b>other</b> denominator, with brackets around binomials: $${d.L}=${d.R}$.${d.note ? ' ' + d.note : ''}`,
        run: async (c) => {
          await show(c, r2);
          A1.style.opacity = ''; await anim(c, A1, [{ opacity: 0 }, { opacity: 1 }], 200); await pulse(c, nL, 1.15); await popIn(c, p1);
          A2.style.opacity = ''; await anim(c, A2, [{ opacity: 0 }, { opacity: 1 }], 200); await pulse(c, nR, 1.15); await popIn(c, p2);
        } },
      { cap: `<b>Step 3.</b> Expand both sides: $${d.lines[0]}$.`, run: (c) => show(c, r3) });
    if (d.cancel) steps.push({ cap: `The $4x^2$ terms are on <b>both</b> sides: they cancel and leave a linear equation.`, run: (c) => swapTo(c, l1, d.cancel) });
    steps.push(
      { cap: `Solve: $${d.sol}$.`, run: async (c) => { await show(c, l2); } },
      { cap: `<b>Step 4.</b> Is $${d.root}$ an NPV? No: <b>keep it</b>.`, run: async (c) => { await show(c, r4); await stampShow(c, st, true); } },
      { cap: d.check ? `There are <b>28 boys and 35 girls</b>, and $\\tfrac{28}{35}$ really is $\\tfrac{4}{5}$.` : `The solution is $${d.ans}$.`, run: async (c) => { await show(c, r5); await pulse(c, r5, 1.04); } });
    return steps;
  }
};

/* =============================== explainer: factor tiles and the LCD =============================== */
/* a term: { n, d: [factors], tri (the unfactored denominator), flip (the opposite factor) } or an operator */
const TL = {
  e6a: { label: 'Example 6(a) check', ask: 'Example 6(a): solve $\\dfrac{3}{x+2}+\\dfrac{1}{x-2}=\\dfrac{8}{x^2-4}$.',
    terms: [{ n: '3', d: ['x+2'] }, '+', { n: '1', d: ['x-2'] }, '=', { n: '8', d: ['x-2', 'x+2'], tri: 'x^2-4' }],
    fact: '$x^2-4=(x-2)(x+2)$', npv: 'x\\ne-2,\\ 2', lcd: ['x-2', 'x+2'], left: [`3${cl('(x-2)')}`, `1${cl('(x+2)')}`, '8'],
    poly: '3(x-2)+1(x+2)=8', solve: '4x-4=8\\ \\Rightarrow\\ x=3', root: '3', verify: 'LS=\\tfrac{3}{5}+1=\\tfrac{8}{5},\\ RS=\\tfrac{8}{5}' },
  e6b: { label: 'Example 6(b) check', ask: 'Example 6(b): solve $\\dfrac{2}{x-1}-\\dfrac{1}{x+3}=\\dfrac{6}{x^2+2x-3}$.',
    terms: [{ n: '2', d: ['x-1'] }, '-', { n: '1', d: ['x+3'] }, '=', { n: '6', d: ['x+3', 'x-1'], tri: 'x^2+2x-3' }],
    fact: '$x^2+2x-3=(x+3)(x-1)$', npv: 'x\\ne1,\\ -3', lcd: ['x-1', 'x+3'], left: [`2${cl('(x+3)')}`, `1${cl('(x-1)')}`, '6'],
    poly: '2(x+3)-1(x-1)=6', solve: '2x+6-x+1=6\\ \\Rightarrow\\ x=-1', root: '-1', verify: 'LS=\\tfrac{2}{-2}-\\tfrac{1}{2}=-\\tfrac{3}{2},\\ RS=\\tfrac{6}{-4}=-\\tfrac{3}{2}' },
  e6c: { label: 'Example 6(c) check: opposites', ask: 'Example 6(c): solve $\\dfrac{7}{x-4}+\\dfrac{3}{4-x}=2$.',
    terms: [{ n: '7', d: ['x-4'] }, '+', { n: '3', d: ['x-4'], flip: '4-x' }, '=', { n: '2', d: [] }],
    fact: '$x-4$ and $4-x$ are <b>opposites</b>', npv: 'x\\ne4', lcd: ['x-4'], left: ['7', '3', `2${cl('(x-4)')}`],
    poly: '7-3=2(x-4)', solve: '4=2x-8\\ \\Rightarrow\\ x=6', root: '6', verify: 'LS=\\tfrac{7}{2}+\\tfrac{3}{-2}=2,\\ RS=2' },
  e6d: { label: 'Example 6(d) check', ask: 'Example 6(d): solve $\\dfrac{3}{x}+\\dfrac{x}{x+2}=1$.',
    terms: [{ n: '3', d: ['x'] }, '+', { n: 'x', d: ['x+2'] }, '=', { n: '1', d: [] }],
    fact: 'both denominators are already factored', npv: 'x\\ne0,\\ -2', lcd: ['x', 'x+2'], left: [`3${cl('(x+2)')}`, `x\\cdot${cl('x')}`, cl('x(x+2)')],
    poly: '3(x+2)+x^2=x(x+2)', solve: `${X('x^2')}+3x+6=${X('x^2')}+2x\\ \\Rightarrow\\ x=-6`, root: '-6', verify: 'LS=-\\tfrac{1}{2}+\\tfrac{-6}{-4}=1,\\ RS=1', sq: true }
};
const SLOTS = [76, 168, 262, 372, 496]; // term, op, term, op, term (x centres)
const tileHTML = (f) => T('(' + f + ')');
const tiles = {
  title: 'Factor tiles: finding the LCD',
  height: 460, minW: 940, capH: 84,
  choices: Object.keys(TL).map((k) => ({ v: k, label: TL[k].label })),
  ask: (v) => TL[v].ask,
  make(stage, v, ex) {
    const d = TL[v], W = ex.W, yT = 62, yTile = 152, yTray = 246, yRes = 340;
    const kind = (f) => Math.max(0, d.lcd.indexOf(f));
    const lcdT = d.lcd.map((f) => (/[+-]/.test(f) && d.lcd.length > 1 ? `(${f})` : f)).join('');
    // terms and operators
    const items = d.terms.map((t, i) => {
      if (typeof t === 'string') return { op: true, el: cdiv(stage, 'u6l7-op u6l7-op2', T(t), SLOTS[i], yT) };
      const den = t.flip || t.tri || (t.d.length ? t.d[0] : null);
      return { t, x: SLOTS[i], el: cdiv(stage, 'u6l7-term u6l7-term2', T(den ? `\\dfrac{${t.n}}{${den}}` : t.n), SLOTS[i], yT) };
    });
    const terms = items.filter((q) => !q.op);
    // tiles under each term
    terms.forEach((q) => {
      const fs = q.t.d, n = fs.length, w = 92;
      q.tiles = fs.map((f, j) => hide(cdiv(stage, q.t.flip ? 'u6l7-tile u6l7-kt' : `u6l7-tile u6l7-k${kind(f)}`, tileHTML(q.t.flip ? q.t.flip : f), q.x + (j - (n - 1) / 2) * (w + 6), yTile)));
      q.tiles.forEach((tl, j) => { tl.f = fs[j]; tl.cx = q.x + (j - (n - 1) / 2) * (w + 6); });
      if (q.t.tri) q.tri = hide(cdiv(stage, 'u6l7-tile u6l7-kt', tileHTML(q.t.tri), q.x, yTile));
    });
    // the LCD tray
    const nL = d.lcd.length, trayX = 280, tw = 100;
    const tray = hide(div(stage, 'u6l7-tray', '<span class="u6l7-trl">LCD</span>', trayX - (nL * tw) / 2 - 70, yTray - 32, nL * tw + 90, 64));
    const slotX = (k) => trayX + 10 + (k - (nL - 1) / 2) * tw;
    const trayTiles = d.lcd.map((f, k) => hide(cdiv(stage, `u6l7-tile u6l7-k${k}`, tileHTML(f), slotX(k), yTray)));
    // what each term becomes
    const res = items.map((q, i) => hide(cdiv(stage, q.op ? 'u6l7-op u6l7-res' : 'u6l7-res', T(q.op ? (d.terms[i]) : d.left[terms.indexOf(q)]), SLOTS[i], yRes)));
    const flipT = terms.find((q) => q.t.flip), flipOp = flipT ? items[items.indexOf(flipT) - 1] : null;
    if (flipT) { res[items.indexOf(flipOp)].innerHTML = T('-'); }
    // the rail
    const R = rail(stage, 590, [16, 86, 156, 248, 330], W - 596);
    const r1 = R.row(1, `<b>NPVs</b> ${T(cn(d.npv))}`);
    const r2 = R.row(2, `<b>LCD</b> ${T(cl(lcdT))}`);
    const r3 = R.row(3, `<b>Solve</b> ${T(d.poly)}<br>${T(d.solve)}`, 'u6l7-two');
    const r4 = R.row(4, `<b>NPV?</b> ${T(d.root + '\\text{ is not an NPV}')}`);
    const r5 = R.row(5, `<b>Verify</b> ${lsrs(d.verify).split(',\\ ').map(T).join(', ')} <span class="u6l7-okc">✓</span>`, 'u6l7-two');
    const st = verdictStamp(stage, true, 505, 250);
    const steps = [];
    steps.push({ cap: `<b>Step 1.</b> Factor every denominator into tiles: ${d.fact}.`,
      run: async (c) => {
        for (const q of terms) {
          if (q.tri) { q.tri.style.opacity = ''; await pop(c, q.tri); await sleep(c, 350); await anim(c, q.tri, [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(1.3, .4)' }], 300); }
          for (const tl of q.tiles) { tl.style.opacity = ''; await pop(c, tl, 300); }
        }
      } });
    if (flipT) steps.push({ cap: `$4-x=-(x-4)$: flip the tile and the minus sign moves out front, so $\\dfrac{3}{4-x}=-\\dfrac{3}{x-4}$.`,
      run: async (c) => {
        const tl = flipT.tiles[0];
        await anim(c, tl, [{ transform: 'rotateY(0deg)' }, { transform: 'rotateY(90deg)' }], 260);
        tl.innerHTML = tileHTML('x-4'); tl.className = 'u6l7-tile u6l7-k0';
        await anim(c, tl, [{ transform: 'rotateY(90deg)' }, { transform: 'rotateY(0deg)' }], 260);
        await swapTo(c, flipOp.el, cr('-'));
        await swapTo(c, flipT.el, '\\dfrac{3}{x-4}');
      } });
    steps.push({ cap: `NPVs: set each different factor equal to $0$: $${d.npv}$.`, run: (c) => show(c, r1) });
    steps.push({ cap: `<b>Step 2.</b> The LCD uses each <b>different</b> factor once. Matching tiles land on the same spot: LCD $=${lcdT}$.`,
      run: async (c) => {
        tray.style.opacity = ''; await fadeIn(c, tray, 260);
        const all = terms.flatMap((q) => q.tiles), landed = new Set();
        for (const tl of all) {
          const k = d.lcd.indexOf(tl.f), ghost = cdiv(stage, tl.className, tl.innerHTML, tl.cx, yTile);
          await anim(c, ghost, [{ transform: 'none' }, { transform: `translate(${slotX(k) - tl.cx}px, ${yTray - yTile}px)` }], 420);
          ghost.remove();
          if (!landed.has(k)) { landed.add(k); trayTiles[k].style.opacity = ''; await pop(c, trayTiles[k], 240); } else await pulse(c, trayTiles[k], 1.15, 300);
        }
        await show(c, r2);
      } });
    steps.push({ cap: `Multiply each term by the LCD. Its own tiles cancel, and the term is multiplied by the tiles it was <b>missing</b>${d.sq ? ' ($x\\cdot x=x^2$)' : ''}.`,
      run: async (c) => {
        terms.forEach((q) => q.tiles.forEach((tl) => tl.classList.add('u6l7-gone')));
        await Promise.all(terms.map((q) => anim(c, q.el, [{ opacity: 1 }, { opacity: .45 }], 300)));
        for (let i = 0; i < res.length; i++) { res[i].style.opacity = ''; await pop(c, res[i], 300); }
      } });
    steps.push({ cap: `<b>Step 3.</b> No fractions left. Solve $${d.poly}$${d.sq ? ': the $x^2$ terms cancel' : ''}, so $x=${d.root}$.`, run: (c) => show(c, r3) });
    steps.push({ cap: `<b>Step 4.</b> Is $${d.root}$ an NPV ($${d.npv}$)? No: <b>keep it</b>.`, run: async (c) => { await show(c, r4); await stampShow(c, st, true); } });
    steps.push({ cap: `<b>Step 5.</b> Verify in the original equation: LS $=$ RS.`, run: (c) => show(c, r5) });
    return steps;
  }
};

/* =============================== explainer: the NPV verdict (with the graph) =============================== */
const VD = {
  e7a: { label: 'Example 7(a) check', ask: 'Example 7(a): solve $\\dfrac{3x}{x-2}=1+\\dfrac{6}{x-2}$.', npv: 'x\\ne2', npvs: [2], lcd: 'x-2',
    poly: '3x=(x-2)+6', solve: '2x=4\\ \\Rightarrow\\ x=2', root: 2, f: (x) => 3 * x / (x - 2), g: (x) => 1 + 6 / (x - 2),
    win: { xmin: -6, xmax: 10, ymin: -8, ymax: 12 }, ok: false,
    why: 'The blue curve is always exactly $2$ above the red one: the curves <b>never meet</b>. The equation has <b>no solution</b>.' },
  e7b: { label: 'Example 7(b) check', ask: 'Example 7(b): solve $\\dfrac{2}{x+3}+\\dfrac{1}{x-3}=\\dfrac{6}{x^2-9}$.', npv: 'x\\ne-3,\\ 3', npvs: [-3, 3], lcd: '(x+3)(x-3)',
    poly: '2(x-3)+1(x+3)=6', solve: '3x-3=6\\ \\Rightarrow\\ x=3', root: 3, f: (x) => 2 / (x + 3) + 1 / (x - 3), g: (x) => 6 / (x * x - 9),
    win: { xmin: -8, xmax: 8, ymin: -6, ymax: 6 }, ok: false,
    why: 'Near $x=3$ both curves shoot off along the asymptote side by side, but they <b>never touch</b>: <b>no solution</b>.' },
  e6a: { label: 'Compare: Example 6(a)', ask: 'Example 6(a): solve $\\dfrac{3}{x+2}+\\dfrac{1}{x-2}=\\dfrac{8}{x^2-4}$.', npv: 'x\\ne-2,\\ 2', npvs: [-2, 2], lcd: '(x-2)(x+2)',
    poly: '3(x-2)+1(x+2)=8', solve: '4x-4=8\\ \\Rightarrow\\ x=3', root: 3, f: (x) => 3 / (x + 2) + 1 / (x - 2), g: (x) => 8 / (x * x - 4),
    win: { xmin: -6, xmax: 6, ymin: -5, ymax: 5 }, ok: true,
    why: 'Here the candidate is <b>not</b> an NPV, and the curves really do meet at $(3,\\ 1.6)$: $x=3$ is the solution.' }
};
const verdict = {
  title: 'The NPV verdict: keep it or reject it?',
  height: 450, minW: 940, capH: 84,
  choices: Object.keys(VD).map((k) => ({ v: k, label: VD[k].label })),
  ask: (v) => VD[v].ask,
  make(stage, v, ex) {
    const d = VD[v], W = ex.W, GW = 450, GX = W - GW - 6;
    const R = rail(stage, 8, [14, 82, 150, 218, 336], GX - 22);
    const r1 = R.row(1, `<b>NPVs</b> ${T(cn(d.npv))}`);
    const r2 = R.row(2, `<b>× LCD</b> ${T(cl(d.lcd))}: ${T(d.poly)}`, 'u6l7-sm');
    const r3 = R.row(3, `<b>Solve</b> ${T(d.solve)}`);
    const r4 = R.row(4, `<b>NPV?</b> ${T(d.ok ? `${d.root}\\text{ is not an NPV}` : `${d.root}\\text{ is an NPV!}`)}`);
    const r5 = R.row(5, d.ok ? `<b>Solution</b> ${T('\\boldsymbol{x=' + d.root + '}')}` : `<b class="u6l7-no">No solution</b>`, 'u6l7-big');
    const st = verdictStamp(stage, d.ok, (GX - 22) / 2 + 30, 290, d.ok ? 'Keep it ✓' : 'Rejected: NPV ✗');
    const G = new Graph(stage, Object.assign({ x: GX, y: 22, width: GW, height: 424, xlabels: 2, ylabels: 2, fontSize: 14 }, d.win));
    const npvL = d.npvs.map((a) => hide(G.vline(a, { color: PU, width: 2.5 })));
    const npvT = d.npvs.map((a) => hide(G.label(a, d.win.ymax, `<span class="u6l7-gl u6l7-pu">x = ${String(a).replace('-', '−')}</span>`, { pos: 'se', dx: 4, dy: 4 })));
    const fL = hide(G.fn(d.f, { color: BL, width: 3.2, breaks: d.npvs })), gR = hide(G.fn(d.g, { color: RD, width: 3.2, breaks: d.npvs }));
    const legend = hide(div(stage, 'u6l7-legend', `<span class="u6l7-lb">— y = LS</span><span class="u6l7-lr">— y = RS</span>`, GX + 30, 34));
    const cand = hide(G.point(d.root, 0, { color: AM, r: 7, label: `<span class="u6l7-gl u6l7-am">x = ${d.root}?</span>`, pos: 'se' }));
    if (cand.label) hide(cand.label);
    const scan = hide(G.vline(d.root, { color: AM, width: 3 }));
    const it = d.ok ? G.intersect(d.f, d.g, d.root) : null;
    const meet = it ? hide(G.point(it.x, it.y, { color: GR, r: 8, label: `<span class="u6l7-gl u6l7-gr">(3, 1.6)</span>`, pos: 'ne' })) : null;
    if (meet && meet.label) hide(meet.label);
    const nope = d.ok ? null : hide(G.label(d.root, d.win.ymin + (d.win.ymax - d.win.ymin) * 0.28, '<span class="u6l7-nope">no point here</span>', { pos: 'e', dx: 6 }));
    return [
      { cap: `<b>Step 1.</b> NPVs first: $${d.npv}$. On the graph, a dashed line marks each NPV.`,
        run: async (c) => { await show(c, r1); for (let i = 0; i < npvL.length; i++) { npvL[i].style.opacity = ''; await G.drawIn(npvL[i], 450, c); await show(c, npvT[i]); } } },
      { cap: `<b>Step 2.</b> Multiply every term by the LCD, $${d.lcd}$: $${d.poly}$.`, run: (c) => show(c, r2) },
      { cap: `<b>Step 3.</b> Solve: $${d.solve}$. This is only a <b>candidate</b> until we check it.`,
        run: async (c) => { await show(c, r3); cand.style.opacity = ''; await pop(c, cand); if (cand.label) await show(c, cand.label); } },
      { cap: `Graph $y=$ LS (blue) and $y=$ RS (red). A solution is where the curves <b>meet</b>. Look above $x=${d.root}$.`,
        run: async (c) => {
          await show(c, legend);
          fL.style.opacity = ''; await G.drawIn(fL, 800, c); gR.style.opacity = ''; await G.drawIn(gR, 800, c);
          scan.style.opacity = ''; await G.drawIn(scan, 500, c);
          if (meet) { meet.style.opacity = ''; await pop(c, meet); if (meet.label) await show(c, meet.label); } else await show(c, nope);
        } },
      { cap: d.ok ? `<b>Step 4.</b> $x=${d.root}$ is not an NPV, and the curves meet there: <b>keep it</b>.` : `<b>Step 4.</b> $x=${d.root}$ is an NPV: it makes a denominator $0$. <b>Reject it!</b>`,
        run: async (c) => { await show(c, r4); await stampShow(c, st, d.ok); if (!d.ok) { cand.querySelector('circle').setAttribute('fill', RD); await shake(c, cand.label || cand); } } },
      { cap: d.why, run: async (c) => { await show(c, r5); await pulse(c, r5, 1.05); } }
    ];
  }
};

/* =============================== explainer: the graphing calculator =============================== */
const CG = {
  e8a: { label: 'Example 8(a): intersect', ask: 'Example 8(a): confirm $\\dfrac{5}{x+1}=\\dfrac{2}{x-3}$ on a graphing calculator.', y1: '5/(X+1)', y2: '2/(X−3)',
    f: (x) => 5 / (x + 1), g: (x) => 2 / (x - 3), npvs: [-1, 3], guesses: [6], npvT: 'NPVs $x=-1$ and $x=3$ (vertical asymptotes)',
    end: 'One intersection: $x\\approx5.67$, which is $\\tfrac{17}{3}$ ✓' },
  e8b: { label: 'Example 8(b): intersect', ask: 'Example 8(b): solve $\\dfrac{2}{x}+1=\\dfrac{x}{3}$ to the nearest hundredth.', y1: '2/X+1', y2: 'X/3',
    f: (x) => 2 / x + 1, g: (x) => x / 3, npvs: [0], guesses: [-1, 4], npvT: 'NPV $x=0$ (a vertical asymptote)',
    end: 'Two solutions: $x\\approx-1.37$ or $x\\approx4.37$ (neither is the NPV $0$).' },
  e8z: { label: 'Example 8(b): zero method', ask: 'Example 8(b) with the zero method: $Y_1=$ LS $-$ RS $=\\dfrac{2}{x}+1-\\dfrac{x}{3}$.', y1: '2/X+1−X/3', zero: true,
    f: (x) => 2 / x + 1 - x / 3, npvs: [0], bounds: [[-3, -0.5, -1], [1, 6, 4]], npvT: 'NPV $x=0$ (a vertical asymptote)',
    end: 'The zeros are the same two solutions: $x\\approx-1.37$ or $x\\approx4.37$.' }
};
const rnd2 = (v) => (Math.round(v * 100) / 100).toFixed(2);
const calc = {
  title: 'Solving on the graphing calculator',
  height: 430, minW: 940, capH: 84,
  choices: Object.keys(CG).map((k) => ({ v: k, label: CG[k].label })),
  ask: (v) => CG[v].ask,
  make(stage, v, ex) {
    const d = CG[v], W = ex.W, GW = 520;
    const G = new Graph(stage, { x: 6, y: 8, width: GW, height: 410, theme: 'calc', xmin: -10, xmax: 10, ymin: -10, ymax: 10 });
    const scr = div(stage, 'u6l7-calcp', '', GW + 22, 8, W - GW - 28, 410);
    const ks = h('div', 'u6l7-ks', '<span class="u6l7-kh">Keys</span>'); scr.appendChild(ks);
    const line = (html, cls = '') => { const e = h('div', 'u6l7-cl ' + cls, html); scr.appendChild(e); return hide(e); };
    const yeq = line(`<div class="u6l7-ti"><div><b class="u6l7-ti1">Y1=</b>${d.y1}</div>${d.zero ? '' : `<div><b class="u6l7-ti2">Y2=</b>${d.y2}</div>`}</div>`);
    const win = line('<div class="u6l7-ti u6l7-tiw"><div>ZStandard</div><div>Xmin=−10</div><div>Xmax=10</div><div>Ymin=−10</div><div>Ymax=10</div></div>');
    const res = line('', 'u6l7-res2');
    const y1 = hide(G.fn(d.f, { color: BL, width: 3, breaks: d.npvs })), y2 = d.zero ? null : hide(G.fn(d.g, { color: RD, width: 3, breaks: d.npvs }));
    const pts = (d.zero ? d.bounds.map((b) => { const x = G.zero(d.f, b[0], b[1]); return { x, y: 0 }; }) : d.guesses.map((gs) => G.intersect(d.f, d.g, gs)));
    const dots = pts.map((p) => hide(G.point(p.x, p.y, { color: 'ink', r: 6 })));
    const setKeys = (html) => { ks.innerHTML = `<span class="u6l7-kh">Keys</span>${html}`; };
    const steps = [
      { cap: d.zero ? `${keys('Y=')} Enter <b>one</b> function: $Y_1=$ left side $-$ right side. Brackets around any denominator with more than one term.`
        : `${keys('Y=')} Enter $Y_1=$ left side and $Y_2=$ right side. <b>Brackets</b> around each denominator: ${d.y1.includes('(') ? `<code class="u6l7-code">${d.y1}</code>, not <code class="u6l7-code">${d.y1.replace(/[()]/g, '')}</code>` : `<code class="u6l7-code">${d.y1}</code> needs none, since its denominator is just X`}.`,
        run: async (c) => { setKeys(keys('Y=')); await show(c, yeq); } },
      { cap: `${keys('ZOOM', '6')} ZStandard: $x$ and $y$ from $-10$ to $10$. This window shows every crossing.`, run: async (c) => { setKeys(keys('ZOOM', '6')); await show(c, win); } },
      { cap: `${keys('GRAPH')} The graph breaks at the ${d.npvT}. A near-vertical line there is <b>not</b> part of the graph.`,
        run: async (c) => { setKeys(keys('GRAPH')); y1.style.opacity = ''; await G.drawIn(y1, 900, c); if (y2) { y2.style.opacity = ''; await G.drawIn(y2, 700, c); } } }
    ];
    pts.forEach((p, i) => {
      const nth = pts.length > 1 ? (i === 0 ? 'the left ' : 'the right ') : 'the ';
      steps.push({ cap: d.zero
        ? `${keys('2nd', 'TRACE')} <b>2: zero</b>. Left bound, right bound, guess around ${nth}$x$-intercept: X $=${G.zero(d.f, d.bounds[i][0], d.bounds[i][1]).toFixed(4)}\\ldots$`
        : `${keys('2nd', 'TRACE')} <b>5: intersect</b>, then ${keys('ENTER')} for the first curve, the second curve and a guess near ${nth}crossing: X $\\approx${rnd2(p.x)}$.`,
      run: async (c) => {
        setKeys(d.zero ? `${keys('2nd', 'TRACE')} <b>2</b> ${keys('ENTER', 'ENTER', 'ENTER')}` : `${keys('2nd', 'TRACE')} <b>5</b> ${keys('ENTER', 'ENTER', 'ENTER')}`);
        dots[i].style.opacity = ''; await pop(c, dots[i]); G.readout(d.zero ? 'Zero' : 'Intersection', p);
      } });
    });
    steps.push({ cap: md(d.end), run: async (c) => { res.innerHTML = md(d.end); await show(c, res); } });
    return steps;
  }
};

/* =============================== Stand Up Break =============================== */
const sg = (n) => (n < 0 ? '-' + -n : '+' + n);           // "+3" / "-3"
const lin = (v, k) => (k === 0 ? v : v + sg(k));            // x+3, x-2
const npvOf = (k) => -k;
standup('u6l7', {
  intro: 'At your whiteboard: NPVs first, multiply every term by the LCD, solve, then check your answer against the NPVs.',
  levels: {
    BEG: (r) => {
      for (let t = 0; t < 200; t++) {
        const x0 = r.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8]);
        if (r.chance(0.5)) { // p/x + q = s/x  →  × x: p + qx = s
          const q = r.pick([1, 2, 3, 4]) * r.sign(), p = r.int(1, 9), s = p + q * x0;
          if (s === 0) continue;
          return { text: 'State the NPV, then solve.', q: `\\dfrac{${p}}{x}${sg(q)}=\\dfrac{${s}}{x}`,
            a: ['x\\ne0', `\\text{Multiply by }x:\\ ${p}${q === 1 ? '+' : q === -1 ? '-' : sg(q)}x=${s}`, `${q === 1 ? '' : q === -1 ? '-' : q}x=${s - p}`, `x=${x0}`] };
        }
        // p/(2x) - 1/2 = s/x  →  LCD 2x: p - x = 2s
        const s = r.int(1, 6), p = x0 + 2 * s;
        if (p <= 0) continue;
        return { text: 'State the NPV, then solve.', q: `\\dfrac{${p}}{2x}-\\dfrac{1}{2}=\\dfrac{${s}}{x}`, a: ['x\\ne0', `\\text{LCD }2x:\\ ${p}-x=${2 * s}`, `x=${x0}`] };
      }
      return { text: 'State the NPV, then solve.', q: '\\dfrac{6}{x}-1=\\dfrac{2}{x}', a: ['x\\ne0', '6-x=2', 'x=4'] };
    },
    PRG: (r) => { // a/(x+m) = b/(x+n): a(x+n) = b(x+m)
      for (let t = 0; t < 200; t++) {
        const a = r.int(2, 7), b = r.int(1, 6), n = r.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]), x0 = r.pick([-8, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 9, 10, 11]);
        if (a === b) continue;
        const num = a * (x0 + n); if (num % b) continue;
        const m = num / b - x0;
        if (m === 0 || m === n || Math.abs(m) > 9 || x0 + m === 0 || x0 + n === 0) continue;
        const lo = Math.min(npvOf(m), npvOf(n)), hi = Math.max(npvOf(m), npvOf(n));
        return { text: 'State the NPVs and solve.', q: `\\dfrac{${a}}{${lin('x', m)}}=\\dfrac{${b}}{${lin('x', n)}}`,
          a: [`x\\ne${lo},\\ ${hi}`, `${a}(${lin('x', n)})=${b === 1 ? lin('x', m) : `${b}(${lin('x', m)})`}`, `${a}x${sg(a * n)}=${b === 1 ? '' : b}x${sg(b * m)}`, `x=${x0}`] };
      }
      return { text: 'State the NPVs and solve.', q: '\\dfrac{4}{x-1}=\\dfrac{3}{x+2}', a: ['x\\ne1,\\ -2', '4(x+2)=3(x-1)', '4x+8=3x-3', 'x=-11'] };
    },
    MAS: (r) => { // p/(x+k) + q/(x-k) = s/(x^2-k^2), sometimes with no solution
      for (let t = 0; t < 200; t++) {
        const k = r.int(1, 5), p = r.int(1, 5), q = r.int(1, 5), bad = r.chance(0.35);
        const x0 = bad ? r.pick([k, -k]) : r.pick([-7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7].filter((z) => Math.abs(z) !== k));
        const s = (p + q) * x0 + (p - q) * -k; // p(x-k) + q(x+k) = (p+q)x + (q-p)k
        if (s === 0) continue;
        const cst = (q - p) * k, a = [`x\\ne-${k},\\ ${k}.\\ \\ \\text{LCD }(x+${k})(x-${k})`, `${p}(x-${k})+${q}(x+${k})=${s}`, `${p + q}x${cst ? sg(cst) : ''}=${s}`, `x=${x0}`];
        a.push(bad ? `${x0}\\text{ is an NPV: reject it. No solution.}` : `${x0}\\text{ is permissible: the solution is }x=${x0}`);
        return { text: 'Solve. Check your answer against the NPVs.', q: `\\dfrac{${p}}{x+${k}}+\\dfrac{${q}}{x-${k}}=\\dfrac{${s}}{x^2-${k * k}}`, a };
      }
      return { text: 'Solve.', q: '\\dfrac{2}{x+3}+\\dfrac{1}{x-3}=\\dfrac{6}{x^2-9}', a: ['x\\ne-3,\\ 3', '2(x-3)+1(x+3)=6', '3x-3=6', 'x=3\\text{ is an NPV: no solution.}'] };
    }
  }
});

/* =============================== mount =============================== */
const DEFS = { clear, cross, tiles, verdict, calc };
Object.values(DEFS).forEach(mdDef);
export const explainers = mountExplainers(DEFS);
export const _test = { CL, CR, TL, VD, CG };
