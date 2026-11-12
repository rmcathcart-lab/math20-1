/* Math 20-1 · Unit 6 · Lesson 8 — Rational Equations That Lead to Quadratics.
 * New lesson format (2026-11-11): the warm-up is plain markup on the page (no code). Example 7's circuit (static), and
 * the explainers:
 *   solve (the one procedure animation: the six steps, each line with its step number; NPVs pinned top right, Ryan's X
 *     for the two numbers (ac on top, b underneath, the pairs listed beside it, the right one circled), each root
 *     compared with the NPVs, then verified; Examples 1(a)–(c), 3(a), 3(b)),
 *   verdict (STAR, the verdict board: the NPV list, the quadratic's two candidates, each root carried to the scanner,
 *     every denominator evaluated, stamped KEEP or REJECT and dropped in its bin; Examples 2, 3(a), 3(b) (both kept)
 *     and 4 (both rejected: no solution)),
 *   hole (STAR: the original two sides graphed beside the two sides after multiplying by the LCD; the gap between the
 *     sides at the NPV is multiplied by 0, so the new graphs meet where the original has a hole / an asymptote;
 *     Examples 2 and 4),
 *   formula (the procedure for the quadratic formula: standard form, a b c, the discriminant gauge, exact roots in
 *     simplest radical form, rounded roots, then the graphs of both sides meeting at those decimals; Examples 5, 6,
 *     including 6(b) where b² − 4ac < 0 and the graphs never meet),
 *   resist (STAR, hands-on: a parallel circuit with a slider for R and a live combined-resistance meter; the slider
 *     sweeps to 6 Ω, then the algebra with the X, R = −3 rejected as not reasonable, and the check; Example 7).
 * Colours (as in Unit 6): NPVs / rejected red, the LCD amber, kept / valid green, rejected for the context orange;
 *   a purple, b blue, c amber in the formula; the left side purple and the right side blue on graphs. */
import {
  h, tex, add, box, Graph, stamp, stampIn, mountExplainers, pop, fadeIn, tween, anim, svgEl, pulse, shake, appear, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const NPV = COLORS.red, LCD = COLORS.amber, OK = COLORS.green, CTX = '#d9730d', LS = COLORS.purple, RS = COLORS.blue;
const cN = (s) => `\\textcolor{${NPV}}{${s}}`, cL = (s) => `\\textcolor{${LCD}}{${s}}`, cO = (s) => `\\textcolor{${OK}}{${s}}`;
const cA = (s) => `\\textcolor{${COLORS.purple}}{${s}}`, cB = (s) => `\\textcolor{${COLORS.blue}}{${s}}`, cC = (s) => `\\textcolor{${COLORS.amber}}{${s}}`;
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const fadeOut = (c, el) => anim(c, el, [{ opacity: 1 }, { opacity: 0 }], 260);
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
const panel = (stage, x, y, w, hh, title, cls = '') => div(stage, 'u6l8-panel ' + cls, title ? `<div class="u6l8-ph">${title}</div>` : '', x, y, w, hh);
const lineIn = (p, html, cls = '') => { const d = h('div', 'u6l8-line ' + cls, html); p.appendChild(d); hide(d); return d; };
/* a work line with its step number on the left (n = null: a second line of the same step) and an optional note */
const stepLine = (p, n, t, note, cls = '') => lineIn(p, `<span class="u6l8-sn">${n ?? ''}</span><span class="u6l8-lt">${T(t)}</span>${note ? `<span class="u6l8-note">${note}</span>` : ''}`, 'u6l8-wl ' + (n == null ? 'u6l8-cont ' : '') + cls);
const textLine = (p, n, html, cls = '') => lineIn(p, `<span class="u6l8-sn">${n ?? ''}</span><span class="u6l8-lt">${html}</span>`, 'u6l8-wl ' + (n == null ? 'u6l8-cont ' : '') + cls);
const stampAt = (host, text, ok, x, y, o = {}) => hide(stamp(host, text, Object.assign({ ok, x, y }, o)));
const drawOn = (c, G, el, ms = 700) => { el.style.opacity = ''; return G.drawIn(el, ms, c); };
const hideP = (p) => { hide(p); if (p.label) hide(p.label); return p; };
const popP = (c, p) => Promise.all([pop(c, p), p.label ? show(c, p.label) : null]);
const lab = (G, x, y, t, color, pos = 'c', extra = {}) => hide(G.label(x, y, t, Object.assign({ tex: true, color, cls: 'bk-ptlab', pos }, extra)));
const pn = (v) => (v < 0 ? `(${v})` : String(v));
const r2 = (v) => (Math.round(v * 100) / 100).toFixed(2);

/* =============================== Ryan's X =============================== */
/* Ryan's X (2026-11-11): ac on top, b underneath, the two numbers on the sides; the factor pairs listed beside it and the
 * right pair circled. In this lesson a = 1 every time, so ac = c. Pairs in the order a student lists them (c > 0: small
 * first, both with the sign of b; c < 0: the larger size takes the sign of b), stopping at the right one. */
function xPairs(b, c) {
  const out = [], s = b < 0 ? -1 : 1, A = Math.abs(c);
  for (let k = 1; k * k <= A; k++) if (A % k === 0) {
    const pr = c > 0 ? [s * k, s * (A / k)] : [s * (A / k), -s * k];
    out.push(pr); if (pr[0] + pr[1] === b) break;
  }
  return out;
}
function xBox(host, x, y, w, hh, b, c) {
  const el = hide(div(host, 'u6l8-panel u6l8-xbox', '', x, y, w, hh));
  const pairs = xPairs(b, c), hit = pairs.findIndex(([p, q]) => p + q === b), [m, n] = pairs[hit];
  const cx = 82, cy = hh / 2 + 2, r = Math.min(54, hh / 2 - 36);
  const svg = svgEl('svg', { width: 164, height: hh, class: 'u6l8-xsvg' }, el);
  const ln = (x1, y1, x2, y2) => svgEl('line', { x1, y1, x2, y2, stroke: COLORS.brand, 'stroke-width': 5, 'stroke-linecap': 'round' }, svg);
  ln(cx - r, cy - r, cx + r, cy + r); ln(cx + r, cy - r, cx - r, cy + r);
  const v = (cls, html, px, py) => { const d = hide(div(el, 'u6l8-xv ' + cls, html, px, py)); d.style.translate = '-50% -50%'; return d; };
  const la = v('u6l8-xlab', 'ac', cx, cy - r - 17), lb = v('u6l8-xlab', 'b', cx, cy + r + 17);
  const top = v('u6l8-xtop', T(String(c)), cx, cy - r * 0.62), bot = v('u6l8-xbot', T(String(b)), cx, cy + r * 0.64);
  const L = v('u6l8-xside', T(String(m)), cx - r * 0.92, cy), R = v('u6l8-xside', T(String(n)), cx + r * 0.92, cy);
  const RH = pairs.length > 3 ? 34 : 40, LX = 170, LY = cy - (pairs.length * RH) / 2;
  const rows = pairs.map(([p, q], i) => {
    const e = hide(div(el, 'u6l8-xp', `<span>${T(`${p}\\times${pn(q)}`)}</span><span class="u6l8-xps">${T(`\\text{sum }{${p + q}}`)}</span>`, LX, LY + i * RH, w - LX - 12, RH - 6));
    e.ok = i === hit; return e;
  });
  return {
    el, m, n, pairs,
    show: async (cx2) => { el.style.opacity = 1; await appear(cx2, svg, 300); await show(cx2, la); await pop(cx2, top); await show(cx2, lb); await pop(cx2, bot); },
    list: async (cx2) => { for (const e of rows) await show(cx2, e); },
    pick: async (cx2) => { rows.forEach((e) => e.classList.add(e.ok ? 'u6l8-xp-ok' : 'u6l8-xp-no')); await pulse(cx2, rows[hit], 1.06); await pop(cx2, L); await pop(cx2, R); }
  };
}

/* =============================== explainer: the six steps (the one procedure animation) =============================== */
const SV = {
  a: { label: 'Example 1(a)', eq: 'x+\\dfrac{6}{x}=5', npv: ['0'], s1: [['x\\ne0', 'denominator ≠ 0']], lcd: 'x',
    s2: [['x^2+6=5x', 'every term × <i>x</i>']], s3: [['x^2-5x+6=0', 'standard form']], b: -5, c: 6, fac: '(x-2)(x-3)=0', roots: ['2', '3'], bad: [],
    ver: ['x=2:\\ 2+\\tfrac{6}{2}=2+3=5', 'x=3:\\ 3+\\tfrac{6}{3}=3+2=5'], ans: 'x=2\\ \\text{or}\\ x=3' },
  b: { label: '1(b)', eq: '\\dfrac{x}{x-2}=\\dfrac{8}{x}', npv: ['2', '0'], s1: [['x\\ne2,\\ 0', 'denominators ≠ 0']], lcd: 'x(x-2)',
    s2: [['x^2=8(x-2)', '× LCD <i>x</i>(<i>x</i> − 2)']], s3: [['x^2-8x+16=0', 'standard form']], b: -8, c: 16, fac: '(x-4)^2=0', roots: ['4'], dbl: true, bad: [],
    ver: ['x=4:\\ \\text{LS}=\\tfrac{4}{2}=2,\\ \\text{RS}=\\tfrac{8}{4}=2'], ans: 'x=4' },
  c: { label: '1(c)', eq: '\\dfrac{3}{x}+\\dfrac{x}{x+2}=2', npv: ['0', '-2'], s1: [['x\\ne0,\\ -2', 'denominators ≠ 0']], lcd: 'x(x+2)',
    s2: [['3(x+2)+x^2=2x(x+2)', '× LCD <i>x</i>(<i>x</i> + 2)']], s3: [['x^2+3x+6=2x^2+4x', 'expand'], ['0=x^2+x-6', 'standard form']], b: 1, c: -6, fac: '0=(x+3)(x-2)', roots: ['-3', '2'], bad: [],
    ver: ['x=-3:\\ -1+\\tfrac{-3}{-1}=2', 'x=2:\\ \\tfrac{3}{2}+\\tfrac{2}{4}=2'], ans: 'x=-3\\ \\text{or}\\ x=2' },
  d: { label: 'Example 3(a)', eq: '\\dfrac{x}{x-3}-\\dfrac{2}{x+1}=\\dfrac{8}{x^2-2x-3}', npv: ['3', '-1'], s1: [['x^2-2x-3=(x-3)(x+1)', 'factor'], ['x\\ne3,\\ -1', 'denominators ≠ 0']], lcd: '(x-3)(x+1)',
    s2: [['x(x+1)-2(x-3)=8', '× LCD']], s3: [['x^2+x-2x+6=8', 'expand'], ['x^2-x-2=0', 'standard form']], b: -1, c: -2, fac: '(x-2)(x+1)=0', roots: ['2', '-1'], bad: ['-1'],
    ver: ['x=2:\\ \\text{LS}=-2-\\tfrac{2}{3}=-\\tfrac{8}{3},\\ \\text{RS}=\\tfrac{8}{-3}=-\\tfrac{8}{3}'], ans: 'x=2' },
  e: { label: '3(b)', eq: '\\dfrac{x+1}{x-4}=\\dfrac{5}{4-x}+x', npv: ['4'], s1: [['x\\ne4', 'denominators ≠ 0'], ['\\tfrac{5}{4-x}=-\\tfrac{5}{x-4}', 'so the LCD is <i>x</i> − 4']], lcd: 'x-4',
    s2: [['x+1=-5+x(x-4)', '× LCD <i>x</i> − 4']], s3: [['x+1=-5+x^2-4x', 'expand'], ['0=x^2-5x-6', 'standard form']], b: -5, c: -6, fac: '0=(x-6)(x+1)', roots: ['6', '-1'], bad: [],
    ver: ['x=6:\\ \\text{LS}=\\tfrac{7}{2},\\ \\text{RS}=-\\tfrac{5}{2}+6=\\tfrac{7}{2}', 'x=-1:\\ \\text{LS}=0,\\ \\text{RS}=1-1=0'], ans: 'x=6\\ \\text{or}\\ x=-1' }
};
const solve = {
  title: 'LCD, quadratic, factor, then a verdict for every root',
  height: 470, minW: 940,
  choices: [{ sep: 'Check:' }, ...Object.keys(SV).map((k) => ({ v: k, label: SV[k].label }))],
  ask: (v) => `${v <= 'c' ? `Example 1(${v})` : `Example 3(${v === 'd' ? 'a' : 'b'})`}: state the NPVs and solve ${T(SV[v].eq)}.`,
  make(stage, v, ex) {
    const d = SV[v], W = ex.W, RX = 586, RW = W - RX - 4;
    const P = panel(stage, 4, 4, RX - 18, 462, '', 'u6l8-work');
    const l1 = d.s1.map(([t, n], i) => stepLine(P, i ? null : 1, t, n, t.includes('\\ne') ? 'u6l8-npvline' : ''));
    const l2 = d.s2.map(([t, n], i) => stepLine(P, i ? null : 2, t, n));
    const l3 = d.s3.map(([t, n], i) => stepLine(P, i ? null : 3, t, n, i === d.s3.length - 1 ? 'u6l8-std' : ''));
    const l4 = [stepLine(P, 4, d.fac, d.dbl ? 'a perfect square' : 'factor'), stepLine(P, null, d.dbl ? 'x=4\\ \\text{(a double root)}' : `x=${d.roots[0]}\\ \\text{or}\\ x=${d.roots[1]}`, 'zero product property')];
    const l5 = textLine(P, 5, d.bad.length ? `${T(`x=${d.bad[0]}`)} is an NPV: <b class="u6l8-no">reject</b> it.` : d.roots.length > 1 ? 'Neither root is an NPV: keep both.' : `${T('x=4')} is not an NPV: keep it.`);
    const l6 = d.ver.map((t, i) => stepLine(P, i ? null : 6, `${t}\\ \\checkmark`, i || t.length > 60 ? '' : 'verify in the original'));
    const lA = textLine(P, null, `${d.roots.length - d.bad.length > 1 ? 'The solutions are' : 'The solution is'} ${T(`\\boldsymbol{${d.ans}}`)}`, 'u6l8-okline');
    // right: the NPV board, Ryan's X, the verdicts
    const NB = hide(panel(stage, RX, 4, RW, 76, 'NPVs', 'u6l8-npvb'));
    const chips = h('div', 'u6l8-chips'); NB.appendChild(chips);
    d.npv.forEach((t) => chips.appendChild(h('span', 'u6l8-npv', T(`x\\ne${t}`))));
    const X = xBox(stage, RX, 90, RW, 230, d.b, d.c);
    const VB = hide(panel(stage, RX, 330, RW, 136, 'Compare with the NPVs', 'u6l8-vb'));
    const vrows = d.roots.map((t) => { const bad = d.bad.includes(t), e = h('div', 'u6l8-vrow', `<span>${T(`x=${t}`)}</span><span class="u6l8-tag ${bad ? 'u6l8-tag-no' : 'u6l8-tag-ok'}">${bad ? 'REJECT · NPV' : 'KEEP'}</span>`); hide(e); VB.appendChild(e); return e; });
    const kept = d.roots.filter((t) => !d.bad.includes(t));
    const one = d.roots.length === 1;
    return [
      { cap: `<b>1. NPVs first.</b> ${d.s1.length > 1 ? (v === 'd' ? 'Factor the trinomial denominator. ' : `Write ${T('\\tfrac{5}{4-x}')} as ${T('-\\tfrac{5}{x-4}')}. `) : ''}No denominator can be 0: ${T(d.s1[d.s1[0][0].includes('ne') ? 0 : 1][0])}. Pin them on the board.`,
        run: async (c) => { for (const l of l1) await show(c, l); await show(c, NB); for (const e of chips.children) await pop(c, e); } },
      { cap: `<b>2. Multiply every term by the LCD</b>, ${T(cL(d.lcd))}. Every denominator cancels.`, run: async (c) => { for (const l of l2) await show(c, l); } },
      { cap: `<b>3. Standard form:</b> ${d.s3.length > 1 ? 'expand, then ' : ''}move everything to one side: ${T(d.s3[d.s3.length - 1][0])}. The ${T('x^2')} did not cancel: it's a quadratic.`, run: async (c) => { for (const l of l3) await show(c, l); } },
      { cap: `<b>4. Factor.</b> Find the two numbers with the X: ${T(String(d.c))} on <b>top</b>, ${T(String(d.b))} <b>underneath</b>. List the pairs: ${T(String(X.m))} and ${T(String(X.n))} multiply to ${T(String(d.c))} and add to ${T(String(d.b))}.`,
        run: async (c) => { await X.show(c); await X.list(c); await X.pick(c); } },
      { cap: one ? `So ${T(d.fac)}: both brackets are the same, ${T('x=4')} (a <b>double root</b>). One root this time.` : `So ${T(d.fac)}, and the zero product property gives <b>two roots</b>: ${T(`x=${d.roots[0]}`)} or ${T(`x=${d.roots[1]}`)}.`,
        run: async (c) => { for (const l of l4) await show(c, l); } },
      { cap: `<b>5. Compare every root with the NPVs.</b> ${d.bad.length ? `${T(`x=${d.bad[0]}`)} is on the list: it makes a denominator 0, so <b>reject</b> it.` : `${one ? `${T('x=4')} is not` : 'Neither root is'} on the list: ${one ? 'keep it' : 'keep both'}.`}`,
        run: async (c) => { await show(c, VB); for (const e of vrows) { await show(c, e); const tg = e.lastChild; await (tg.classList.contains('u6l8-tag-no') ? shake(c, tg) : pulse(c, tg, 1.1)); } await show(c, l5); } },
      { cap: `<b>6. Verify</b> ${kept.length > 1 ? 'both roots' : `${T(`x=${kept[0]}`)}`} in the <b>original</b> equation: left side = right side ✓`, run: async (c) => { for (const l of l6) await show(c, l); await show(c, lA); } }
    ];
  }
};

/* =============================== explainer: the verdict board (STAR) =============================== */
const VD = {
  e2: { label: 'Example 2', eq: '\\dfrac{x^2-2x-15}{x-5}=2x', npv: [5], dens: [['x-5', (x) => x - 5]],
    work: ['x^2-2x-15=2x(x-5)', '0=(x-3)(x-5)'], roots: [3, 5] },
  e3a: { label: 'Example 3(a)', eq: '\\dfrac{x}{x-3}-\\dfrac{2}{x+1}=\\dfrac{8}{x^2-2x-3}', npv: [3, -1], dens: [['x-3', (x) => x - 3], ['x+1', (x) => x + 1], ['x^2-2x-3', (x) => x * x - 2 * x - 3]],
    work: ['x(x+1)-2(x-3)=8', '(x-2)(x+1)=0'], roots: [2, -1] },
  e3b: { label: '3(b): both kept', eq: '\\dfrac{x+1}{x-4}=\\dfrac{5}{4-x}+x', npv: [4], dens: [['x-4', (x) => x - 4], ['4-x', (x) => 4 - x]],
    work: ['x+1=-5+x(x-4)', '0=(x-6)(x+1)'], roots: [6, -1] },
  e4: { label: 'Example 4: both rejected', eq: '\\dfrac{x}{x-3}-\\dfrac{3}{x}=\\dfrac{9}{x^2-3x}', npv: [0, 3], dens: [['x-3', (x) => x - 3], ['x', (x) => x], ['x^2-3x', (x) => x * x - 3 * x]],
    work: ['x^2-3(x-3)=9', 'x(x-3)=0'], roots: [0, 3] }
};
/* substitute r into a denominator's TeX: x-5 at 3 → 3-5; x^2-3x at 0 → 0^2-3(0) */
const subIn = (t, r) => t.replace(/x\^2/g, r < 0 ? `(${r})^2` : `${r}^2`).replace(/(\d)x/g, `$1(${r})`).replace(/x/g, r < 0 ? `(${r})` : String(r));
const verdict = {
  title: 'The verdict board: keep it or reject it?',
  height: 470, minW: 940,
  choices: Object.keys(VD).map((k) => ({ v: k, label: VD[k].label })),
  ask: (v) => `${VD[v].label.split(':')[0].replace(/^3\(b\)/, 'Example 3(b)')}: solve ${T(VD[v].eq)}. Which roots survive?`,
  make(stage, v, ex) {
    const d = VD[v], W = ex.W, BX = W - 262, BW = 258;
    // left: the NPV board and the working
    const NB = panel(stage, 4, 4, 300, 222, 'NPV list', 'u6l8-npvb u6l8-board'); hide(NB);
    const chips = h('div', 'u6l8-chips u6l8-chips-lg'); NB.appendChild(chips);
    const chipEls = d.npv.map((t) => { const e = h('span', 'u6l8-npv', T(`x\\ne${t}`)); chips.appendChild(e); return e; });
    const dl = h('div', 'u6l8-dens', `<div class="u6l8-ph">Denominators</div>${d.dens.map(([t]) => `<span>${T(t)}</span>`).join('')}`); NB.appendChild(dl);
    const WK = hide(panel(stage, 4, 236, 300, 230, 'Solve', 'u6l8-wk'));
    const wl = d.work.map((t) => { const e = h('div', 'u6l8-line', T(t)); WK.appendChild(e); hide(e); return e; });
    const cl = h('div', 'u6l8-line u6l8-candl', 'Candidates:'); WK.appendChild(cl); hide(cl);
    // centre: the scanner; right: the two bins
    const SX = 320, SW = BX - SX - 14;
    const SC = hide(panel(stage, SX, 4, SW, 462, 'Check the denominators', 'u6l8-scan'));
    const binK = hide(panel(stage, BX, 4, BW, 224, '', 'u6l8-bin u6l8-bin-ok')), binR = hide(panel(stage, BX, 242, BW, 224, '', 'u6l8-bin u6l8-bin-no'));
    binK.innerHTML = '<div class="u6l8-binh">KEEP</div>'; binR.innerHTML = '<div class="u6l8-binh">REJECT</div>';
    const CW = 130, CH = 60, slot = { k: 0, r: 0 };
    const cards = d.roots.map((r, i) => {
      const bad = d.npv.includes(r), e = hide(div(stage, 'u6l8-cand' + (bad ? ' u6l8-cand-no' : ' u6l8-cand-ok'), T(`x=${r}`), 0, 0, CW, CH));
      e.home = [16 + i * (CW + 12), 392]; e.bad = bad;
      e.scan = [SX + (SW - CW) / 2 - 30, 52];
      const k = bad ? slot.r++ : slot.k++;
      e.bin = [BX + 14, (bad ? 242 : 4) + 48 + k * 82];
      e.style.left = e.home[0] + 'px'; e.style.top = e.home[1] + 'px';
      e.st = stampAt(e, bad ? 'REJECT' : 'KEEP', !bad, CW + 52, CH / 2, { size: 'sm' });
      return e;
    });
    const fly = (c, e, from, to) => anim(c, e, [{ left: from[0] + 'px', top: from[1] + 'px' }, { left: to[0] + 'px', top: to[1] + 'px' }], 650);
    // one substitution table per root, in the scanner (under the card)
    const tabs = d.roots.map((r) => {
      const t = h('div', 'u6l8-subs');
      d.dens.forEach(([dt, f]) => { const val = f(r), z = val === 0; t.appendChild(h('div', 'u6l8-sub' + (z ? ' u6l8-sub-z' : ''), `${T(dt)}<span class="u6l8-arr">→</span>${T(`${subIn(dt, r)}=${val}`)}<span class="u6l8-mk">${z ? '÷ 0 ✗' : '✓'}</span>`)); });
      const bad = d.npv.includes(r);
      t.appendChild(h('div', 'u6l8-subv ' + (bad ? 'u6l8-no' : 'u6l8-ok'), bad ? `A denominator is 0: ${T(`x=${r}`)} is an NPV.` : 'No denominator is 0.'));
      t.style.position = 'absolute'; add(SC, t, 14, 130); hide(t); [...t.children].forEach(hide); return t;
    });
    const kept = d.roots.filter((r) => !d.npv.includes(r));
    const banner = hide(div(stage, 'u6l8-banner ' + (kept.length ? 'u6l8-banner-ok' : 'u6l8-banner-no'),
      '<div>' + (kept.length === 0 ? '<b>No solution.</b><br>Both roots are rejected.' : kept.length === 2 ? `Both roots are solutions:<br>${T(`\\boldsymbol{x=${kept[0]}}`)} or ${T(`\\boldsymbol{x=${kept[1]}}`)}` : `The solution is<br>${T(`\\boldsymbol{x=${kept[0]}}`)}`) + '</div>', SX + 10, 380, SW - 20, 76));
    const big = kept.length ? null : stampAt(stage, 'NO SOLUTION', false, SX + SW / 2, 300, { size: 'lg' });
    const npvT = d.npv.map((t) => T(`x\\ne${t}`)).join(' and ');
    const rootStep = (i) => {
      const r = d.roots[i], e = cards[i], t = tabs[i], other = i ? tabs[0] : null;
      const vals = d.dens.map(([dt, f]) => f(r)), zi = vals.findIndex((q) => q === 0);
      return {
        cap: e.bad ? `${T(`x=${r}`)}: substitute into every denominator. ${T(d.dens[zi][0])} becomes ${T('0')}: dividing by 0! It is on the NPV list. <b>REJECT.</b>`
          : `${T(`x=${r}`)}: substitute into every denominator. None of them is 0, and ${T(`x=${r}`)} is not on the NPV list. <b>KEEP.</b>`,
        run: async (c) => {
          if (other) await fadeOut(c, other);
          await fly(c, e, e.home, e.scan);
          t.style.opacity = 1; for (const row of t.children) await show(c, row);
          if (e.bad) { const ch = chipEls[d.npv.indexOf(r)]; ch.classList.add('u6l8-npv-hit'); await shake(c, ch); }
          await stampIn(c, e.st);
          await fly(c, e, e.scan, e.bin);
        }
      };
    };
    const steps = [
      { cap: `<b>First the NPVs:</b> no denominator may be 0, so ${npvT}. They go on the board before any solving.`, run: async (c) => { await show(c, NB); for (const e of chipEls) await pop(c, e); await show(c, binK); await show(c, binR); await show(c, SC); } },
      { cap: `Solve: multiply by the LCD and factor, ${T(d.work[1])}. The quadratic gives <b>two candidates</b>, ${T(`x=${d.roots[0]}`)} and ${T(`x=${d.roots[1]}`)}. Each one faces the board.`,
        run: async (c) => { await show(c, WK); for (const l of wl) await show(c, l); await show(c, cl); for (const e of cards) await pop(c, e); } },
      rootStep(0), rootStep(1)
    ];
    steps.push({
      cap: kept.length === 0 ? `Both candidates are NPVs, so both are rejected: the equation has <b>no solution</b>.` : kept.length === 2 ? `Both candidates are permissible. Verify them in the original (both check): ${T(`x=${kept[0]}`)} or ${T(`x=${kept[1]}`)}.`
        : `Reject ${T(`x=${d.roots.find((r) => d.npv.includes(r))}`)}, keep the other root. The solution is ${T(`x=${kept[0]}`)}.`,
      run: async (c) => { await fadeOut(c, tabs[1]); await show(c, banner); if (big) await stampIn(c, big); }
    });
    return steps;
  }
};

/* =============================== explainer: where the extra root comes from (STAR) =============================== */
const HO = {
  e2: { label: 'Example 2', eq: '\\dfrac{x^2-2x-15}{x-5}=2x', mult: '\\times(x-5)', npv: [5],
    f: (x) => (x * x - 2 * x - 15) / (x - 5), fT: 'y=x+3', g: (x) => 2 * x, gT: 'y=2x',
    F: (x) => x * x - 2 * x - 15, FT: 'y=x^2-2x-15', G: (x) => 2 * x * x - 10 * x, GT: 'y=2x^2-10x',
    w1: [-2, 8, -4, 16], s1: [1, 2], w2: [-2, 8, -20, 40], s2: [1, 5], yl2: 10, real: [[3, 6]], real2: [[3, -12]], fake2: [[5, 0]],
    hole: [5, 8], l1: { f: [6.6, 9.6, 'se'], g: [6.7, 13.4, 'e'] }, l2: { F: [7.4, 29, 'w'], G: [5.6, 38, 'w'] } },
  e4: { label: 'Example 4: both rejected', eq: '\\dfrac{x}{x-3}-\\dfrac{3}{x}=\\dfrac{9}{x^2-3x}', mult: '\\times x(x-3)', npv: [0, 3],
    f: (x) => x / (x - 3) - 3 / x, fT: '\\text{LS}', g: (x) => 9 / (x * x - 3 * x), gT: '\\text{RS}',
    F: (x) => x * x - 3 * x + 9, FT: 'y=x^2-3x+9', G: () => 9, GT: 'y=9',
    w1: [-4, 7, -8, 8], s1: [1, 2], w2: [-2, 5, 0, 20], s2: [1, 2], yl2: 4, real: [], real2: [], fake2: [[0, 9], [3, 9]],
    gaps: [-2, 1.5, 5.5], l1: { f: [5.6, 4.2, 'n'], g: [5.9, -0.3, 's'] }, l2: { F: [4.2, 15.6, 'w'], G: [-1.9, 9, 'n'] } }
};
const hole = {
  title: 'Where the extra root comes from: the graphs',
  height: 480, minW: 960,
  choices: Object.keys(HO).map((k) => ({ v: k, label: HO[k].label })),
  ask: (v) => `${v === 'e2' ? 'Example 2' : 'Example 4'}: ${T(HO[v].eq)}. Why does multiplying by the LCD give ${v === 'e2' ? 'an extra root' : 'roots that do not work'}?`,
  make(stage, v, ex) {
    const d = HO[v], W = ex.W, GW = Math.floor((W - 22) / 2), GY = 86, GHt = 392;
    div(stage, 'u6l8-gtitle', `<span class="u6l8-gtk">Original</span>${T(d.eq)}`, 4, 0, GW, 50);
    const t2 = hide(div(stage, 'u6l8-gtitle', `<span class="u6l8-gtk">After ${T(cL(d.mult))}</span>${T(v === 'e2' ? 'x^2-2x-15=2x^2-10x' : 'x^2-3x+9=9')}`, GW + 18, 0, GW, 50));
    const s1 = hide(div(stage, 'u6l8-gstat', '', 4, 54, GW, 28)), s2 = hide(div(stage, 'u6l8-gstat', '', GW + 18, 54, GW, 28));
    const [a0, a1, b0, b1] = d.w1, [c0, c1, e0, e1] = d.w2;
    const G1 = new Graph(stage, { x: 4, y: GY, width: GW, height: GHt, xmin: a0, xmax: a1, ymin: b0, ymax: b1, xstep: d.s1[0], ystep: d.s1[1], xlabels: 2, ylabels: 4, fontSize: 15 });
    const G2 = new Graph(stage, { x: GW + 18, y: GY, width: GW, height: GHt, xmin: c0, xmax: c1, ymin: e0, ymax: e1, xstep: d.s2[0], ystep: d.s2[1], xlabels: 2, ylabels: d.yl2, fontSize: 15 });
    hide(G2.el);
    const nv1 = d.npv.map((x) => hide(G1.vline(x, { color: NPV, width: 2.5, dash: '7 6' }))), nv2 = d.npv.map((x) => hide(G2.vline(x, { color: NPV, width: 2.5, dash: '7 6' })));
    const nl1 = d.npv.map((x) => lab(G1, x, b1 - (b1 - b0) * 0.04, `x=${x}`, NPV, x === 0 ? 'w' : x === 3 && d.npv.includes(0) ? 'e' : 'w', { dx: x === 0 ? -4 : x === 3 && d.npv.includes(0) ? 4 : -4 }));
    const f = hide(G1.fn(d.f, { color: LS, width: 4, breaks: d.npv })), g = hide(G1.fn(d.g, { color: RS, width: 3.5, breaks: d.npv }));
    const fL = lab(G1, ...d.l1.f.slice(0, 2), d.fT, LS, d.l1.f[2]), gL = lab(G1, ...d.l1.g.slice(0, 2), d.gT, RS, d.l1.g[2]);
    const F = hide(G2.fn(d.F, { color: LS, width: 3.5 })), Gc = hide(G2.fn(d.G, { color: RS, width: 3.5 }));
    const FL = lab(G2, ...d.l2.F.slice(0, 2), d.FT, LS, d.l2.F[2]), GL = lab(G2, ...d.l2.G.slice(0, 2), d.GT, RS, d.l2.G[2]);
    const realP = d.real.map(([x, y]) => hideP(G1.point(x, y, { color: OK, r: 7, label: T(`(${x},\\ ${y})`), pos: 'nw' })));
    const real2 = d.real2.map(([x, y]) => hideP(G2.point(x, y, { color: OK, r: 7, label: T(`x=${x}`), pos: 'se' })));
    const fake2 = d.fake2.map(([x, y], i) => hideP(G2.point(x, y, { color: CTX, r: 7.5, label: T(`x=${x}`), pos: v === 'e2' ? 'se' : i ? 'ne' : 'nw' })));
    if (v === 'e2') {
      const [hx, hy] = d.hole;
      const holeP = hideP(G1.point(hx, hy, { color: LS, open: true, r: 7, label: '<b>hole</b>', pos: 'se' }));
      const gap = hide(G1.segment([hx, hy], [hx, 2 * hx], { color: NPV, width: 3.5 }));
      const gapL = lab(G1, hx + 0.25, 9, '\\text{2 apart}', NPV, 'e');
      const zL = lab(G2, 5.2, 7, '2\\times0=0', CTX, 'e');
      const st1 = stampAt(stage, 'REJECT x = 5', false, 4 + G1.toPx(5, 0)[0] + 10, GY + G1.toPx(0, 1.2)[1], { size: 'sm' });
      return [
        { cap: `Graph both sides of the original. For ${T('x\\ne5')} the left side simplifies to ${T(`\\textcolor{${LS}}{x+3}`)}: a line with a <b>hole</b> at ${T('x=5')}. The right side is ${T(`\\textcolor{${RS}}{y=2x}`)}. They meet <b>once</b>.`,
          run: async (c) => { await drawOn(c, G1, nv1[0], 400); await show(c, nl1[0]); await drawOn(c, G1, f, 700); await show(c, fL); await popP(c, holeP); await drawOn(c, G1, g, 600); await show(c, gL); for (const p of realP) await popP(c, p); s1.innerHTML = `1 meeting → <b>1 solution</b>, ${T('x=3')}`; await show(c, s1); } },
        { cap: `Now cross-multiply (both sides ${T(cL('\\times(x-5)'))}) and graph the <b>new</b> sides. These parabolas meet <b>twice</b>: at ${T('x=3')} and at ${T('x=5')}.`,
          run: async (c) => { await show(c, t2); await show(c, G2.el); await drawOn(c, G2, F, 700); await show(c, FL); await drawOn(c, G2, Gc, 700); await show(c, GL); for (const p of real2) await popP(c, p); for (const p of fake2) await popP(c, p); s2.innerHTML = '2 meetings → <b>2 candidates</b>'; await show(c, s2); } },
        { cap: `At ${T('x=5')} the original sides are <b>2 apart</b> (the hole at 8, the line at 10). Multiplying by ${T('x-5')}, which is <b>0</b> there, makes the gap ${T('2\\times0=0')}: the new sides both equal 0.`,
          run: async (c) => { await drawOn(c, G1, gap, 500); await show(c, gapL); await drawOn(c, G2, nv2[0], 400); await show(c, zL); await pulse(c, fake2[0].label, 1.2); } },
        { cap: `So ${T('x=5')} is a meeting <b>made by multiplying by 0</b>. In the original it is the hole, where the left side is ${T('\\tfrac{0}{0}')}, undefined. <b>Reject it</b>: the solution is ${T('x=3')}.`,
          run: async (c) => { await shake(c, holeP.label); await stampIn(c, st1); } }
      ];
    }
    // Example 4: the left side is always exactly 1 above the right side
    const gaps = d.gaps.map((x) => { const y1 = d.f(x), y0 = d.g(x); return [hide(G1.segment([x, y0], [x, y1], { color: NPV, width: 3.5 })), lab(G1, x + 0.18, (y0 + y1) / 2, '1', NPV, 'e')]; });
    const zL = lab(G2, 1.5, 3.2, '1\\times x(x-3)=0\\ \\text{at}\\ x=0,\\ 3', CTX, 'c');
    const st2 = stampAt(stage, 'NO SOLUTION', false, 4 + G1.toPx(1.5, 0)[0], GY + G1.toPx(0, 2)[1], { size: 'sm' });
    return [
      { cap: `Graph both sides of the original. Each has asymptotes at the NPVs, ${T('x=0')} and ${T('x=3')} (dashed). The graphs <b>never meet</b>: the left side is always exactly <b>1 above</b> the right side.`,
        run: async (c) => { for (let i = 0; i < 2; i++) { await drawOn(c, G1, nv1[i], 350); await show(c, nl1[i]); } await drawOn(c, G1, f, 800); await show(c, fL); await drawOn(c, G1, g, 800); await show(c, gL); for (const [s, l] of gaps) { await drawOn(c, G1, s, 300); await show(c, l); } s1.innerHTML = '0 meetings → <b>no solution</b>'; await show(c, s1); } },
      { cap: `Multiply both sides by the LCD ${T(cL('x(x-3)'))} and graph the new sides: ${T(`\\textcolor{${LS}}{y=x^2-3x+9}`)} and ${T(`\\textcolor{${RS}}{y=9}`)} meet <b>twice</b>, at ${T('x=0')} and ${T('x=3')}.`,
        run: async (c) => { await show(c, t2); await show(c, G2.el); await drawOn(c, G2, F, 700); await show(c, FL); await drawOn(c, G2, Gc, 500); await show(c, GL); for (const p of fake2) await popP(c, p); s2.innerHTML = '2 meetings → <b>2 candidates</b>'; await show(c, s2); } },
      { cap: `The gap of 1 was multiplied by ${T('x(x-3)')}, which is <b>0</b> at ${T('x=0')} and at ${T('x=3')}. Both new meetings sit exactly on the NPV lines.`,
        run: async (c) => { for (const l of nv2) await drawOn(c, G2, l, 400); await show(c, zL); for (const p of fake2) await pulse(c, p.label, 1.2); } },
      { cap: `Both candidates are NPVs, where the original equation is not even defined. Reject both: <b>no solution</b>.`, run: (c) => stampIn(c, st2) }
    ];
  }
};

/* =============================== explainer: the quadratic formula (procedure) =============================== */
const FM = {
  a5: { label: 'Example 5(a)', eq: '\\dfrac{2}{x}+1=\\dfrac{x}{3}', s1: [['x\\ne0', 'NPV'], ['6+3x=x^2', '× LCD 3<i>x</i>']], std: 'x^2-3x-6=0', a: 1, b: -3, c: -6,
    disc: '(-3)^2-4(1)(-6)=9+24=33', D: 33, form: ['x=\\dfrac{3\\pm\\sqrt{33}}{2}'], exact: '\\dfrac{3\\pm\\sqrt{33}}{2}',
    f: (x) => 2 / x + 1, g: (x) => x / 3, br: [0], fT: 'y=\\tfrac{2}{x}+1', gT: 'y=\\tfrac{x}{3}', win: [-5, 7, -4, 4], lf: [1.2, 3.8, 'e'], lg: [3.2, 0.2, 'se'] },
  b5: { label: '5(b)', eq: '\\dfrac{1}{x-1}+\\dfrac{1}{x+1}=1', s1: [['x\\ne1,\\ -1', 'NPVs'], ['(x+1)+(x-1)=x^2-1', '× LCD (<i>x</i> − 1)(<i>x</i> + 1)']], std: 'x^2-2x-1=0', a: 1, b: -2, c: -1,
    disc: '(-2)^2-4(1)(-1)=4+4=8', D: 8, form: ['x=\\dfrac{2\\pm\\sqrt{8}}{2}=\\dfrac{2\\pm2\\sqrt{2}}{2}', 'x=1\\pm\\sqrt{2}'], exact: '1\\pm\\sqrt{2}',
    f: (x) => 1 / (x - 1) + 1 / (x + 1), g: () => 1, br: [1, -1], fT: 'y=\\text{LS}', gT: 'y=1', win: [-4, 5, -4, 4], lf: [2.2, 3.4, 'e'], lg: [-3.8, 1, 'n'] },
  a6: { label: 'Example 6(a)', eq: '\\dfrac{x+2}{x-1}=\\dfrac{2x+1}{x+1}', s1: [['x\\ne1,\\ -1', 'NPVs'], ['(x+2)(x+1)=(2x+1)(x-1)', 'cross-multiply'], ['x^2+3x+2=2x^2-x-1', 'expand']], std: '0=x^2-4x-3', a: 1, b: -4, c: -3,
    disc: '(-4)^2-4(1)(-3)=16+12=28', D: 28, form: ['x=\\dfrac{4\\pm\\sqrt{28}}{2}=\\dfrac{4\\pm2\\sqrt{7}}{2}', 'x=2\\pm\\sqrt{7}'], exact: '2\\pm\\sqrt{7}',
    f: (x) => (x + 2) / (x - 1), g: (x) => (2 * x + 1) / (x + 1), br: [1, -1], fT: 'y=\\tfrac{x+2}{x-1}', gT: 'y=\\tfrac{2x+1}{x+1}', win: [-4, 7, -4, 6], lf: [1.6, 5.2, 'e'], lg: [-3.8, 3.6, 'e'] },
  b6: { label: '6(b): no real roots', eq: '\\dfrac{x+4}{2x-1}=\\dfrac{x+1}{x-1}', s1: [['x\\ne\\tfrac{1}{2},\\ 1', 'NPVs'], ['(x+4)(x-1)=(x+1)(2x-1)', 'cross-multiply'], ['x^2+3x-4=2x^2+x-1', 'expand']], std: '0=x^2-2x+3', a: 1, b: -2, c: 3,
    disc: '(-2)^2-4(1)(3)=4-12=-8', D: -8,
    f: (x) => (x + 4) / (2 * x - 1), g: (x) => (x + 1) / (x - 1), br: [0.5, 1], fT: 'y=\\tfrac{x+4}{2x-1}', gT: 'y=\\tfrac{x+1}{x-1}', win: [-5, 6, -5, 5], lf: [-4.8, -1.3, 'e'], lg: [2.6, 3.6, 'e'] }
};
const formula = {
  title: 'When it won’t factor: the quadratic formula',
  height: 470, minW: 940,
  choices: Object.keys(FM).map((k) => ({ v: k, label: FM[k].label })),
  ask: (v) => `${v[1] === '5' ? 'Example 5' : 'Example 6'}(${v[0]}): solve ${T(FM[v].eq)}${v[1] === '5' ? '. Exact, then rounded to the nearest hundredth.' : '.'}`,
  make(stage, v, ex) {
    const d = FM[v], W = ex.W, RX = 586, RW = W - RX - 4, real = d.D >= 0;
    const P = panel(stage, 4, 4, RX - 18, 462, '', 'u6l8-work');
    const l1 = d.s1.map(([t, n], i) => stepLine(P, i ? null : 1, t, n));
    const l2 = [stepLine(P, 2, d.std, 'standard form'), stepLine(P, null, `${cA(`a=${d.a}`)},\\ \\ ${cB(`b=${d.b}`)},\\ \\ ${cC(`c=${d.c}`)}`, '')];
    const l3 = stepLine(P, 3, `b^2-4ac=${d.disc}`, '', real ? '' : 'u6l8-xline');
    const roots = real ? [(-d.b + Math.sqrt(d.D)) / (2 * d.a), (-d.b - Math.sqrt(d.D)) / (2 * d.a)] : [];
    const l4 = real ? d.form.map((t, i) => stepLine(P, i ? null : 4, t, i === d.form.length - 1 ? '<b>exact</b>' : i ? '' : 'the formula', i === d.form.length - 1 ? 'u6l8-std' : '')) : [];
    const l5 = real ? stepLine(P, 5, `x\\approx${r2(roots[0])}\\ \\text{or}\\ x\\approx${r2(roots[1])}`, '<b>rounded</b>') : null;
    const l5b = real ? textLine(P, null, 'Neither is an NPV: keep both.') : null;
    const lA = textLine(P, null, real ? `Exact: ${T(`\\boldsymbol{x=${d.exact}}`)}` : '<b>No real solution.</b> The graphs of the two sides never meet.', real ? 'u6l8-okline' : 'u6l8-xline');
    // right: the discriminant gauge and the graph
    const GA = hide(panel(stage, RX, 4, RW, 104, `${T('b^2-4ac')}`, 'u6l8-gauge'));
    const zones = [['neg', '< 0', 'no real roots'], ['zero', '= 0', 'one root'], ['pos', '> 0', 'two real roots']].map(([k, a, b]) => { const z = h('div', 'u6l8-zone u6l8-z-' + k, `<b>${a}</b>${b}`); GA.appendChild(z); return z; });
    const hitZ = zones[d.D < 0 ? 0 : d.D === 0 ? 1 : 2];
    const [x0, x1, y0, y1] = d.win;
    const G = new Graph(stage, { x: RX, y: 118, width: RW, height: 348, xmin: x0, xmax: x1, ymin: y0, ymax: y1, xlabels: 2, ylabels: 2, fontSize: 15 });
    hide(G.el);
    const nv = d.br.map((x) => hide(G.vline(x, { color: NPV, width: 2, dash: '6 6' })));
    const f = hide(G.fn(d.f, { color: LS, width: 3.5, breaks: d.br })), g = hide(G.fn(d.g, { color: RS, width: 3.5, breaks: d.br }));
    const fL = lab(G, ...d.lf.slice(0, 2), d.fT, LS, d.lf[2]), gL = lab(G, ...d.lg.slice(0, 2), d.gT, RS, d.lg[2]);
    const pts = roots.map((x, i) => hideP(G.point(x, d.f(x), { color: 'ink', r: 6.5, label: T(`x\\approx${r2(x)}`), pos: i ? (v === 'a6' ? 'sw' : 'nw') : 'se' })));
    const st = real ? null : stampAt(stage, 'NO REAL ROOTS', false, 300, 410, { size: 'lg' });
    const graphIn = async (c) => { await show(c, G.el); for (const l of nv) await drawOn(c, G, l, 300); await drawOn(c, G, f, 800); await show(c, fL); await drawOn(c, G, g, 700); await show(c, gL); };
    const steps = [
      { cap: `<b>1.</b> NPVs, then clear the denominators: ${d.s1.length > 2 ? 'cross-multiply and expand' : 'multiply every term by the LCD'}.`, run: async (c) => { for (const l of l1) await show(c, l); } },
      { cap: `<b>2. Standard form</b>, then read ${T(cA('a'))}, ${T(cB('b'))} and ${T(cC('c'))}. ${T(d.std.replace(/^0=/, ''))} does not factor over the integers.`, run: async (c) => { for (const l of l2) await show(c, l); } },
      { cap: `<b>3. The discriminant</b> ${T('b^2-4ac')} decides: ${T(`${d.D}`)} is ${real ? 'positive, so there are <b>two real roots</b>' : '<b>negative</b>: no real roots'}.`,
        run: async (c) => { await show(c, l3); await show(c, GA); hitZ.classList.add('on'); await pulse(c, hitZ, 1.08); if (st) await stampIn(c, st); } }
    ];
    if (!real) {
      steps.push({ cap: `The quadratic has no real roots, so the rational equation has <b>no real solution</b>. On a graph, the two sides <b>never meet</b>.`, run: async (c) => { await graphIn(c); await show(c, lA); } });
      return steps;
    }
    steps.push(
      { cap: `<b>4. The formula</b> ${T('x=\\tfrac{-b\\pm\\sqrt{b^2-4ac}}{2a}')}${d.form.length > 1 ? `, then simplify the radical and divide <b>every</b> term by 2` : ` (${T(`\\sqrt{${d.D}}`)} does not simplify)`}: ${T(`x=${d.exact}`)} is the <b>exact</b> answer.`, run: async (c) => { for (const l of l4) await show(c, l); } },
      { cap: `<b>5. Round</b> to the nearest hundredth with a calculator: ${T(`x\\approx${r2(roots[0])}`)} or ${T(`x\\approx${r2(roots[1])}`)}. Neither is an NPV.`, run: async (c) => { await show(c, l5); await show(c, l5b); } },
      { cap: `Graph both sides: they meet at ${T(`x\\approx${r2(roots[0])}`)} and ${T(`x\\approx${r2(roots[1])}`)}, the same decimals. The exact answer is ${T(`x=${d.exact}`)}.`, run: async (c) => { await graphIn(c); for (const p of pts) await popP(c, p); await show(c, lA); } }
    );
    return steps;
  }
};

/* =============================== the parallel circuit (explainer and Example 7's card) =============================== */
function circuit(host, x, y, o = {}) {
  const W = 430, H = 214, k = o.s || 1, el = div(host, 'u6l8-circuit', '', x, y, Math.round(W * k), Math.round(H * k));
  if (x == null) el.style.position = 'relative';
  const inn = div(el, 'u6l8-cin', '', 0, 0, W, H); // scaled inside, so fading the outer box can't undo the scale
  if (k !== 1) { inn.style.transform = `scale(${k})`; inn.style.transformOrigin = '0 0'; }
  const svg = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}` }, inn);
  const wire = { stroke: '#4a4436', 'stroke-width': 4, fill: 'none', 'stroke-linejoin': 'round', 'stroke-linecap': 'round' };
  const zig = (y0) => `M100 ${y0} H190 l7 -12 l14 24 l14 -24 l14 24 l14 -24 l14 24 l7 -12 H380`;
  svgEl('path', Object.assign({ d: `${zig(52)} M100 52 V150 M380 52 V150 ${zig(150)} M100 150 V192 H222 M240 192 H380 V150` }, wire), svg);
  svgEl('line', { x1: 224, y1: 176, x2: 224, y2: 208, stroke: '#4a4436', 'stroke-width': 4 }, svg);
  svgEl('line', { x1: 238, y1: 183, x2: 238, y2: 201, stroke: '#4a4436', 'stroke-width': 7 }, svg);
  // current: dots moving along the loop
  if (o.flow !== false) svgEl('path', { d: `M222 192 H100 V52 H380 V192 H240 M100 150 H380`, class: 'u6l8-flow', fill: 'none' }, svg);
  [[100, 52], [380, 52], [100, 150], [380, 150]].forEach(([cx, cy]) => svgEl('circle', { cx, cy, r: 5.5, fill: '#4a4436' }, svg));
  const l1 = div(inn, 'u6l8-rlab', o.l1 || T('R'), 140, 6, 200, 28), l2 = div(inn, 'u6l8-rlab', o.l2 || T('R+5'), 140, 104, 200, 28);
  return { el, l1, l2 };
}
const parallel = (R) => (R * (R + 5)) / (2 * R + 5);

/* =============================== explainer: resistors in parallel (STAR, hands-on) =============================== */
const resist = {
  title: 'Two resistors in parallel: try it, then solve it',
  height: 480, minW: 940,
  choices: [{ v: 'e7', label: 'Example 7' }],
  ask: () => `Example 7: one resistor is ${T('5\\ \\Omega')} more than the other, and together (in parallel) they give ${T('6\\ \\Omega')}. Determine each resistance.`,
  make(stage, v, ex) {
    const W = ex.W, RX = 456;
    const C = circuit(stage, 4, 0, { s: 0.84 });
    const lab1 = (R) => T(`R=${R}\\ \\Omega`), lab2 = (R) => T(`R+5=${R + 5}\\ \\Omega`);
    // the slider and the meter
    const M = panel(stage, 4, 186, 432, 88, '', 'u6l8-meter no-ink');
    const row = h('div', 'u6l8-mrow'); M.appendChild(row);
    const sl = h('input', 'u6l8-slider'); sl.type = 'range'; sl.min = 1; sl.max = 20; sl.step = 1; sl.value = 2; sl.setAttribute('aria-label', 'Resistance R in ohms'); sl.setAttribute('data-tap', '');
    const rv = h('span', 'u6l8-rv'); row.append(h('span', 'u6l8-ml', T('R')), sl, rv);
    const out = h('div', 'u6l8-mout'); M.appendChild(out);
    const set = (R) => {
      sl.value = R; rv.innerHTML = T(`${R}\\ \\Omega`); C.l1.innerHTML = lab1(R); C.l2.innerHTML = lab2(R);
      const t = parallel(R), hit = Math.abs(t - 6) < 1e-9;
      out.innerHTML = `combined ${T(`${hit ? '6' : r2(t)}\\ \\Omega`)} <span class="u6l8-want">${hit ? '✓ that is the 6 Ω we want' : `want ${T('6\\ \\Omega')}`}</span>`;
      M.classList.toggle('u6l8-meter-ok', hit);
    };
    sl.addEventListener('input', () => set(Number(sl.value)));
    set(2);
    const X = xBox(stage, 4, 284, 432, 192, -7, -30);
    // right: the algebra, numbered by step
    const P = panel(stage, RX, 4, W - RX - 4, 472, '', 'u6l8-work');
    const lA = stepLine(P, 1, '\\dfrac{1}{6}=\\dfrac{1}{R}+\\dfrac{1}{R+5}', `${T('R\\ne0,\\ -5')}`);
    const lB = [stepLine(P, 2, 'R(R+5)=6(R+5)+6R', '× LCD 6<i>R</i>(<i>R</i> + 5)'), stepLine(P, 3, 'R^2+5R=12R+30', 'expand'), stepLine(P, null, 'R^2-7R-30=0', 'standard form', 'u6l8-std')];
    const lC = [stepLine(P, 4, '(R-10)(R+3)=0', 'factor'), stepLine(P, null, 'R=10\\ \\text{or}\\ R=-3', 'zero product property')];
    const lD = textLine(P, 5, `${T('R=-3')}: not an NPV, but a resistance is positive: <b class="u6l8-ctx">reject</b> (not reasonable).`);
    const lE = textLine(P, null, `The resistances are ${T('\\boldsymbol{10\\ \\Omega}')} and ${T('\\boldsymbol{15\\ \\Omega}')}.`, 'u6l8-okline');
    const lF = stepLine(P, 6, '\\dfrac{1}{10}+\\dfrac{1}{15}=\\dfrac{3+2}{30}=\\dfrac{1}{6}\\ \\checkmark', 'check');
    const st = stampAt(stage, 'REJECT: not reasonable', null, W - 150, 440, { size: 'sm', cls: 'u6l8-st-ctx' });
    hide(C.el); hide(M);
    return [
      { cap: `Two resistors in parallel: one is ${T('R')}, the other ${T('R+5')}. Together they must give ${T('6\\ \\Omega')}, and ${T('\\tfrac{1}{R_T}=\\tfrac{1}{R_1}+\\tfrac{1}{R_2}')}.`, run: async (c) => { await show(c, C.el); await show(c, M); } },
      { cap: `Try values (drag the slider too). ${T('R=4')} gives about ${T('2.77\\ \\Omega')}, ${T('R=8')} about ${T('4.95\\ \\Omega')}, and ${T('R=10')} gives <b>exactly</b> ${T('6\\ \\Omega')}. Now prove it with algebra.`,
        run: async (c) => { let last = -1; await tween(c, 2600, (t) => { const R = Math.round(2 + 8 * t); if (R !== last) { last = R; set(R); } }); set(10); await pulse(c, M, 1.04); } },
      { cap: `<b>1.</b> Substitute ${T('R_T=6')}, ${T('R_1=R')} and ${T('R_2=R+5')}. NPVs: ${T('R\\ne0,\\ -5')}. The LCD is ${T(cL('6R(R+5)'))}.`, run: (c) => show(c, lA) },
      { cap: `<b>2–3.</b> Multiply every term by the LCD, expand, and write the quadratic in standard form: ${T('R^2-7R-30=0')}.`, run: async (c) => { for (const l of lB) await show(c, l); } },
      { cap: `<b>4.</b> The two numbers, with the X: ${T('-30')} on top, ${T('-7')} underneath. ${T('-10')} and ${T('3')}: product ${T('-30')}, sum ${T('-7')}.`, run: async (c) => { await X.show(c); await X.list(c); await X.pick(c); } },
      { cap: `So ${T('(R-10)(R+3)=0')}: ${T('R=10')} or ${T('R=-3')}.`, run: async (c) => { for (const l of lC) await show(c, l); } },
      { cap: `<b>5.</b> ${T('R=-3')} is not an NPV, but a resistance can't be negative: <b>reject it</b>, it is not reasonable. ${T('R=10\\ \\Omega')} and ${T('R+5=15\\ \\Omega')}.`, run: async (c) => { await show(c, lD); await stampIn(c, st); await show(c, lE); } },
      { cap: `<b>6. Check:</b> ${T('\\tfrac{1}{10}+\\tfrac{1}{15}=\\tfrac{1}{6}')} ✓. The circuit agrees: ${T('10\\ \\Omega')} and ${T('15\\ \\Omega')} in parallel give ${T('6\\ \\Omega')}.`, run: async (c) => { await show(c, lF); set(10); await pulse(c, M, 1.04); } }
    ];
  }
};

/* =============================== Example 7's circuit (static, on the card) =============================== */
function mountCardFigures() {
  const host = document.getElementById('u6l8-circ');
  if (host) { const C = circuit(host, null, null, { flow: true }); C.el.classList.add('u6l8-circ-card'); }
}

/* =============================== Stand Up Break =============================== */
const sgnT = (v, t = 'x') => (v === 0 ? '' : `${v > 0 ? '+' : '-'}${Math.abs(v) === 1 ? '' : Math.abs(v)}${t}`);
function sqrtSimp(D) { let s = 1; for (let k = 2; k * k <= D; k++) while (D % (k * k) === 0) { D /= k * k; s *= k; } return [s, D]; }
standup('u6l8', {
  intro: 'At your whiteboard: NPVs first, clear the denominators, solve the quadratic, then give every root its verdict.',
  levels: {
    BEG: (r) => { // x + mn/x = m + n, roots m and n
      const m = r.int(1, 5), n = r.int(m + 1, 9), s = m + n, p = m * n;
      return { text: 'State the NPV, solve and verify.', q: `x+\\frac{${p}}{x}=${s}`,
        a: ['x\\ne0', `x^2+${p}=${s}x`, `x^2-${s}x+${p}=0`, `(x-${m})(x-${n})=0`, `x=${m}\\ \\text{or}\\ x=${n}`, `\\text{Check: }${m}+\\tfrac{${p}}{${m}}=${s}\\ \\checkmark,\\ \\ ${n}+\\tfrac{${p}}{${n}}=${s}\\ \\checkmark`] };
    },
    PRG: (r) => { // x/(x − p) − k/(x + q) = k(p + q)/((x − p)(x + q)): roots k (keep) and −q (an NPV)
      const p = r.int(1, 6), q = r.int(1, 5); let k = r.int(2, 7); if (k === p) k = p === 7 ? 2 : p + 1;
      const N = k * (p + q), tri = `x^2${sgnT(q - p)}-${p * q}`;
      return { text: 'State the NPVs and solve. Reject any extraneous root.', q: `\\frac{x}{x-${p}}-\\frac{${k}}{x+${q}}=\\frac{${N}}{${tri}}`,
        a: [`${tri}=(x-${p})(x+${q}):\\ x\\ne${p},\\ -${q}`, `x(x+${q})-${k}(x-${p})=${N}`, `x^2${sgnT(q - k)}-${k * q}=0`, `(x-${k})(x+${q})=0`, `x=${k};\\ \\text{reject }x=-${q}\\ \\text{(NPV)}`] };
    },
    MAS: (r) => { // x/(x + m) = k/x → x² − kx − km = 0, by the formula
      const k = r.int(3, 8), m = r.int(1, 4), D = k * k + 4 * k * m, [s, t] = sqrtSimp(D);
      const x1 = (k + Math.sqrt(D)) / 2, x2 = (k - Math.sqrt(D)) / 2;
      let ex;
      if (t === 1) ex = `x=${(k + s) / 2}\\ \\text{or}\\ x=${(k - s) / 2}`;
      else if (k % 2 === 0 && s % 2 === 0) ex = `x=${k / 2}\\pm${s / 2 === 1 ? '' : s / 2}\\sqrt{${t}}`;
      else ex = `x=\\dfrac{${k}\\pm${s === 1 ? '' : s}\\sqrt{${t}}}{2}`;
      return { text: 'State the NPVs and solve. Give exact roots, then round to the nearest hundredth.', q: `\\frac{x}{x+${m}}=\\frac{${k}}{x}`,
        a: [`x\\ne-${m},\\ 0`, `x^2=${k}(x+${m})`, `x^2-${k}x-${k * m}=0`, `x=\\dfrac{${k}\\pm\\sqrt{${k * k}+${4 * k * m}}}{2}=\\dfrac{${k}\\pm\\sqrt{${D}}}{2}`, ex, `x\\approx${r2(x1)}\\ \\text{or}\\ x\\approx${r2(x2)}`] };
    }
  }
});

/* =============================== mount =============================== */
mountCardFigures();
export const explainers = mountExplainers({ solve, verdict, hole, formula, resist });
export const _test = { SV, VD, HO, FM, xPairs, subIn, parallel };
