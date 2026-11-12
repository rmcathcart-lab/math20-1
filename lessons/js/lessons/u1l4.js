/* Math 20-1 · Unit 1 · Lesson 4 — Arithmetic Series.
 * A Math History box (Gauss's slate: 1 to 100 on a 10 × 10 grid, 50 pairs of 101 through the centre) and the explainers
 * (the warm-up is plain markup in the page, tools/newformat/specs/u1l4.py):
 *   partialSums (sequence → series, then the running-total bars S_1, S_2, … over a table; S_4 − S_3 is the new block t_4;
 *     Example 1 check), gaussRows (the series forwards and backwards, every column t_1 + t_n, 2S = n(t_1 + t_n); Example 2
 *     check), whichFormula (a flowchart: last term known? n known?; Example 3(a)(b)(c) and 4 checks), findN (the
 *     quadratic for n next to the dots (n, S_n) reaching the target line; Example 5 check), sumToTerms (towers S_n on a
 *     graph of (n, S_n): each new tower's top is the next term; Example 9 check).
 * Colours (kept through Unit 1): first term t_1 teal, common difference d amber, last term t_n blue, sums S_n burgundy,
 * number of terms n purple; mistakes / rejected roots red. */
import {
  h, tex, add, box, Graph, Flowchart, stamp, stampIn, mountExplainers, pop, fadeIn, appear, sleep, tween, pulse,
  svgEl, place, drawIn, texNum
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const T1 = '#0f7f80', DC = '#c27a0e', TN = '#1f5bd6', SC = '#7a1f3d', NC = '#7b4fc4', INK = '#1c2230', RED = '#c93a33';
const colr = (c) => (s) => `\\textcolor{${c}}{${s}}`;
const cT = colr(T1), cD = colr(DC), cL = colr(TN), cS = colr(SC), cN = colr(NC), cX = colr(RED);
/** a number for TeX, thin spaces in numbers of 1000 or more: N(18300) → "18\,300" */
const N = (v) => {
  let s = texNum(v); const neg = s[0] === '-'; if (neg) s = s.slice(1);
  let [a, b] = s.split('.'); if (a.length > 3) a = a.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');
  return (neg ? '-' : '') + a + (b ? '.' + b : '');
};
const P = (v) => (v < 0 ? `(${N(v)})` : N(v)); // negatives in brackets
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const panel = (stage, x, y, w, hh, title, cls = '') => add(stage, box(h('div', 'u1l4-panel ' + cls, title ? `<div class="u1l4-ph">${title}</div>` : ''), w, hh), x, y);
const line = (p, html, cls = '') => { const d = h('div', 'u1l4-line ' + cls, html); p.appendChild(d); return d; };
const mkSvg = (stage, W, H) => { const s = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u1l4-svg' }, stage); s.style.left = '0px'; s.style.top = '0px'; return s; };
/** an HTML label at a stage point */
const lab = (stage, x, y, html, cls = '', pos = 'c', gap = 0) => { const d = h('div', 'u1l4-lab ' + cls, html); stage.appendChild(d); place(d, x, y, pos, gap); return d; };
const sum = (a) => a.reduce((s, v) => s + v, 0);
/** "a + b + c" with brackets round negative terms */
const plusTex = (vals) => vals.map((v, i) => (i && v < 0 ? `(${N(v)})` : N(v))).join('+');
/** grow an SVG rect upward from its bottom: final y / height in r.fy / r.fh */
const growRect = (c, r, ms = 420) => tween(c, ms, (t) => { r.setAttribute('y', r.fy + r.fh * (1 - t)); r.setAttribute('height', r.fh * t); });
const rect = (parent, x, y, w, hh, attrs = {}) => { const r = svgEl('rect', Object.assign({ x, y, width: w, height: hh }, attrs), parent); r.fy = y; r.fh = hh; return r; };
/** a curly brace path along a horizontal span (below: opens upward) or a vertical span (right side) */
function braceH(parent, x0, x1, y, dir = 1, color = INK) {
  const m = (x0 + x1) / 2, q = 10 * dir;
  return svgEl('path', { d: `M${x0} ${y} q0 ${q} ${q < 0 ? 10 : 10} ${q} L${m - 10} ${y + q} q10 0 10 ${q} q0 ${-q} 10 ${-q} L${x1 - 10} ${y + q} q10 0 10 ${-q}`, fill: 'none', stroke: color, 'stroke-width': 2.5, 'stroke-linecap': 'round', class: 'bk-stroke' }, parent);
}
function braceV(parent, x, y0, y1, color = INK) {
  const m = (y0 + y1) / 2;
  return svgEl('path', { d: `M${x} ${y0} q10 0 10 10 L${x + 10} ${m - 10} q0 10 10 10 q-10 0 -10 10 L${x + 10} ${y1 - 10} q0 10 -10 10`, fill: 'none', stroke: color, 'stroke-width': 2.5, 'stroke-linecap': 'round', class: 'bk-stroke' }, parent);
}

/* =============================== explainer: partial sums =============================== */
const PS = {
  ex1: { label: 'Example 1 check', t: [7, 12, 17, 22, 27, 32], ex: true },
  def: { label: T('4+9+14+19'), t: [4, 9, 14, 19] }
};
const PAL = ['#0f7f80', '#3b82c4', '#7b4fc4', '#c27a0e', '#c93a33', '#12805a'];
const partialSums = {
  title: 'Partial sums: keep adding the next term',
  height: 450,
  minW: 900,
  choices: Object.keys(PS).map((k) => ({ v: k, label: PS[k].label })),
  ask: (k) => (PS[k].ex ? `<b>Example 1:</b> the sequence ${T('7,\\ 12,\\ 17,\\ 22,\\ 27,\\ 32,\\ \\dots')}` : `The sequence ${T('4,\\ 9,\\ 14,\\ 19')}`),
  make(stage, k, ex) {
    const t = PS[k].t, n = t.length, S = t.map((_, i) => sum(t.slice(0, i + 1))), W = ex.W;
    const svg = mkSvg(stage, W, ex.def.height);
    const tag = add(stage, h('div', 'u1l4-seqtag', ''), 20, 18), seq = add(stage, h('div', 'u1l4-seqline', ''), 130, 12);
    hide(tag); hide(seq);
    const X0 = 110, colW = Math.min(84, 470 / n), bw = colW * 0.6, base = 318, top = 96, sc = (base - top) / S[n - 1];
    const cx = (i) => X0 + (i + 0.5) * colW;
    // the table under the bars (its columns line up with the bars)
    const tb = add(stage, h('div', 'u1l4-ptab'), X0 - 80, base + 10);
    tb.style.gridTemplateColumns = `80px repeat(${n}, ${colW}px)`;
    tb.innerHTML = `<div class="u1l4-pth">${T('n')}</div>` + t.map((_, i) => `<div>${i + 1}</div>`).join('') +
      `<div class="u1l4-pth">${T(cS('S_n'))}</div>` + t.map(() => '<div class="u1l4-ps"></div>').join('');
    const sCells = [...tb.querySelectorAll('.u1l4-ps')];
    svgEl('line', { x1: X0 - 6, x2: X0 + n * colW + 6, y1: base, y2: base, stroke: INK, 'stroke-width': 2 }, svg);
    const cols = t.map((_, i) => {
      const g = svgEl('g', {}, svg);
      const segs = t.slice(0, i + 1).map((v, j) => rect(g, cx(i) - bw / 2, base - S[j] * sc, bw, v * sc, { fill: PAL[j % PAL.length], 'fill-opacity': 0.85, stroke: '#fff', 'stroke-width': 1.5 }));
      segs.forEach((r) => r.setAttribute('height', 0));
      const top = lab(stage, cx(i), base - S[i] * sc - 6, T(cS(N(S[i]))), 'u1l4-ptop', 'n'); hide(top);
      return { segs, top };
    });
    const PX = X0 + n * colW + 40, pn = panel(stage, PX, 74, W - PX - 14, 362, 'Running totals');
    const sTex = (i) => `S_{${i + 1}}=${i ? plusTex(t.slice(0, i + 1)) + '=' : ''}${N(S[i])}`;
    async function build(c, i, fresh) {
      const { segs, top } = cols[i];
      if (fresh) { for (let j = 0; j < i; j++) { segs[j].setAttribute('y', segs[j].fy); segs[j].setAttribute('height', segs[j].fh); } if (i) await appear(c, segs[0].parentNode, 260); }
      else for (let j = 0; j < i; j++) { segs[j].setAttribute('y', segs[j].fy); segs[j].setAttribute('height', segs[j].fh); }
      await growRect(c, segs[i], 420);
      sCells[i].innerHTML = T(N(S[i])); top.style.opacity = 1;
      await Promise.all([pop(c, sCells[i].firstChild, 300), pop(c, top, 300)]);
    }
    const steps = [
      { cap: `A <b>sequence</b> lists the terms, with <b>commas</b>.`,
        run: async (c) => { tag.textContent = 'sequence'; seq.innerHTML = T(t.map(N).join(',\\ ') + (PS[k].ex ? ',\\ \\dots' : '')); tag.style.opacity = 1; await show(c, seq); } },
      { cap: `A <b>series</b> adds the terms: <b>plus signs</b>.${PS[k].ex ? ' That is Example 1(a).' : ''}`,
        run: async (c) => { tag.textContent = 'series'; tag.classList.add('u1l4-seqtag-s'); seq.innerHTML = T(plusTex(t)); await pulse(c, seq, 1.04); } },
      { cap: `${T(cS('S_1'))} is just the first term: ${T('S_1=t_1=' + N(t[0]))}.`,
        run: async (c) => { await build(c, 0); await show(c, line(pn, T(sTex(0)))); } },
      { cap: `${T(cS('S_2'))} adds the next term on top: ${T(sTex(1))}.`,
        run: async (c) => { await build(c, 1, true); await show(c, line(pn, T(sTex(1)))); } },
      { cap: `${T(cS('S_3'))}: one more block. ${T(sTex(2))}.`,
        run: async (c) => { await build(c, 2, true); await show(c, line(pn, T(sTex(2)))); } }
    ];
    if (n > 3) steps.push({
      cap: n > 4 ? `Keep adding the next term: ${T(`S_4=${N(S[3])},\\ S_5=${N(S[4])},\\ S_6=${N(S[5])}`)}. These are the <b>partial sums</b>.` : `${T(`S_4=${N(S[2])}+${N(t[3])}=${N(S[3])}`)}: the sum of the whole series.`,
      run: async (c) => { for (let i = 3; i < n; i++) { await build(c, i, true); await show(c, line(pn, T(i > 3 ? `S_{${i + 1}}=${N(S[i - 1])}+${N(t[i])}=${N(S[i])}` : `S_{${i + 1}}=${N(S[i - 1])}+${N(t[i])}=${N(S[i])}`))); } }
    });
    let ghost = null;
    steps.push({
      cap: `${T(`S_4-S_3=${N(S[3])}-${N(S[2])}=${N(t[3])}`)}. The only difference is the new block on top: ${T(`t_4=${N(t[3])}`)}.${PS[k].ex ? ' (Example 1(c))' : ''}`,
      run: async (c) => {
        ghost = rect(svg, cx(3) - bw / 2 - 4, base - S[2] * sc, bw + 8, S[2] * sc, { fill: 'none', stroke: INK, 'stroke-width': 2.5, 'stroke-dasharray': '7 5' });
        await appear(c, ghost, 300);
        const tg = lab(stage, cx(3) - bw / 2 - 8, base - S[2] * sc - t[3] * sc / 2, T(`t_4`), 'u1l4-t4tag', 'w');
        await pop(c, tg, 320); await pulse(c, cols[3].segs[3], 1.05);
        await show(c, line(pn, T(`S_4-S_3=${N(S[3])}-${N(S[2])}=${N(t[3])}=t_4`), 'u1l4-key-line'));
      }
    });
    return steps;
  }
};

/* =============================== explainer: Gauss pairing (rows) =============================== */
const GR = {
  ten: { label: T('1+2+\\dots+10'), t1: 1, d: 1, n: 10 },
  eight: { label: T('3+7+11+\\dots+31'), t1: 3, d: 4, n: 8 },
  ex2: { label: 'Example 2 check', t1: 5, d: 5, n: 60, ex: true }
};
const grSeries = (g) => { const tn = g.t1 + (g.n - 1) * g.d; return g.n > 10 ? `${g.t1}+${g.t1 + g.d}+${g.t1 + 2 * g.d}+\\dots+${tn - g.d}+${tn}` : g.n === 10 && g.d === 1 ? '1+2+3+\\dots+10' : `${g.t1}+${g.t1 + g.d}+${g.t1 + 2 * g.d}+\\dots+${tn}`; };
const gaussRows = {
  title: 'Write it forwards, then backwards',
  height: 440,
  minW: 900,
  choices: Object.keys(GR).map((k) => ({ v: k, label: GR[k].label })),
  ask: (k) => (GR[k].ex ? `<b>Example 2:</b> use pairing to find ${T(grSeries(GR[k]))}.` : `Add ${T(grSeries(GR[k]))} by pairing.`),
  make(stage, k, ex) {
    const g = GR[k], n = g.n, term = (i) => g.t1 + i * g.d, tn = term(n - 1), pair = g.t1 + tn, W = ex.W;
    const idx = n > 10 ? [0, 1, 2, null, n - 2, n - 1] : [...Array(n).keys()];
    const cols = idx.length, X0 = 112, colW = Math.min(86, (W - X0 - 24) / cols), bw = colW - 24, R = [34, 112, 206], BH = 50;
    const cx = (i) => X0 + (i + 0.5) * colW;
    const svg = mkSvg(stage, W, ex.def.height);
    const colHi = idx.map((_, i) => { const r = rect(svg, cx(i) - bw / 2 - 6, R[0] - 8, bw + 12, R[2] + BH - R[0] + 16, { rx: 12, fill: '#fff4dd', stroke: '#e8a01e', 'stroke-width': 2 }); r.style.opacity = 0; return r; });
    ['S', 'S', '2S'].forEach((s, r) => lab(stage, 22, R[r] + BH / 2, T(s + '\\ ='), 'u1l4-glab', 'e'));
    const bar = add(stage, box(h('div', 'u1l4-gbar'), cols * colW + 8, 3), X0 - 4, R[2] - 18); hide(bar);
    const mk = (r, i, v, cls) => {
      const e = add(stage, box(h('div', 'u1l4-gbox ' + (cls || ''), v == null ? T('\\cdots') : T(N(v))), bw, BH), cx(i) - bw / 2, R[r]);
      if (v == null) e.classList.add('u1l4-gdots');
      hide(e); return e;
    };
    const plusAt = (r, i) => { const p = add(stage, h('div', 'u1l4-gplus', '+'), cx(i) + colW / 2, R[r] + BH / 2); p.style.translate = '-50% -50%'; hide(p); return p; };
    const row1 = idx.map((j, i) => mk(0, i, j == null ? null : term(j), j === 0 ? 'u1l4-gt1' : j === n - 1 ? 'u1l4-gtn' : ''));
    const row2 = idx.map((j, i) => mk(1, i, j == null ? null : term(n - 1 - j), j === 0 ? 'u1l4-gtn' : j === n - 1 ? 'u1l4-gt1' : ''));
    const row3 = idx.map((j, i) => mk(2, i, j == null ? null : pair, 'u1l4-gsum'));
    const plus = [0, 1, 2].map((r) => idx.slice(0, -1).map((_, i) => plusAt(r, i)));
    const out = add(stage, box(h('div', 'u1l4-gout'), W - X0 - 290, 136), X0, 304);
    const twoS = n * pair, S = twoS / 2;
    const steps = [];
    if (g.ex) steps.push({ cap: `How many terms? They go up by 5 from 5 to 300: ${T('300\\div5=60')} terms.`, run: (c) => show(c, line(out, `${T('300\\div5=' + cN('60'))} terms`)) });
    steps.push(
      { cap: `Write the sum <b>forwards</b>.${g.ex ? ` The ${T('\\cdots')} stands for the ${n - 5} terms in the middle.` : ''}`,
        run: async (c) => { for (let i = 0; i < cols; i++) { await pop(c, row1[i], 220); if (i < cols - 1) plus[0][i].style.opacity = 1; } } },
      { cap: `Now write it <b>backwards</b>, right underneath.`,
        run: async (c) => {
          await Promise.all(row2.map((e, i) => { const dx = cx(cols - 1 - i) - cx(i), dy = R[0] - R[1]; return c.anim(e, [{ opacity: 0.2, transform: `translate(${dx}px, ${dy}px)` }, { opacity: 1, transform: 'none' }], 750, { delay: i * 35 }); }));
          plus[1].forEach((p) => (p.style.opacity = 1));
        } },
      { cap: `Add the first column: ${T(`${cT(N(g.t1))}+${cL(N(tn))}=${N(pair)}`)}.`,
        run: async (c) => { await appear(c, colHi[0], 250); bar.style.opacity = 1; await pop(c, row3[0], 320); } },
      { cap: `Next column: ${T(`${N(term(1))}+${N(term(n - 2))}=${N(pair)}`)} again! The top goes <b>up</b> ${T(cD(N(g.d)))}, the bottom goes <b>down</b> ${T(cD(N(g.d)))}.`,
        run: async (c) => {
          colHi[0].style.opacity = 0; await appear(c, colHi[1], 250);
          const up = lab(stage, (cx(0) + cx(1)) / 2, R[0] - 14, T(cD('+' + N(g.d))), 'u1l4-dtag', 'c'), dn = lab(stage, (cx(0) + cx(1)) / 2, R[1] + BH + 12, T(cD('-' + N(g.d))), 'u1l4-dtag', 'c');
          await Promise.all([pop(c, up, 300), pop(c, dn, 300)]); plus[2][0].style.opacity = 1; await pop(c, row3[1], 320);
        } },
      { cap: `Every column adds to ${T(N(pair))}.`,
        run: async (c) => { colHi[1].style.opacity = 0; for (let i = 2; i < cols; i++) { await pop(c, row3[i], 200); if (i < cols - 1) plus[2][i - 1].style.opacity = 1; } plus[2].forEach((p) => (p.style.opacity = 1)); } },
      { cap: `There are ${T(cN(String(n)))} columns of ${T(N(pair))}: ${T(`2S=${n}(${N(pair)})=${N(twoS)}`)}.`,
        run: async (c) => {
          const b = braceH(svg, cx(0) - bw / 2, cx(cols - 1) + bw / 2, R[2] + BH + 6, 1, NC); await drawIn(b, 500, c);
          const bl = lab(stage, (cx(0) + cx(cols - 1)) / 2, R[2] + BH + 18, `<b>${n} columns</b>`, 'u1l4-ncol', 's'); await pop(c, bl, 300);
          await show(c, line(out, T(`2S=${cN(String(n))}(${N(pair)})=${N(twoS)}`)));
        } },
      { cap: `That is <b>two copies</b> of the sum, so ${T(`S=${N(twoS)}\\div2=${N(S)}`)}.`,
        run: async (c) => {
          const L = line(out, T(`S=\\dfrac{${N(twoS)}}{2}=\\boldsymbol{${N(S)}}`), 'u1l4-big'); await show(c, L);
          const f = add(stage, h('div', 'u1l4-gform', `In general<br>${T(`S_n=\\dfrac{n(${cT('t_1')}+${cL('t_n')})}{2}`)}`), W - 262, 318); await pop(c, f, 380);
        } }
    );
    return steps;
  }
};

/* =============================== explainer: which formula? (flowchart) =============================== */
const WFQ = {
  a: { label: 'Example 3(a)', ask: `<b>Example 3(a):</b> the first 25 terms of ${T('7+11+15+\\dots')}`, steps: [
    { cap: `Read the series: ${T(cT('t_1=7'))}, ${T(cD('d=11-7=4'))}, ${T(cN('n=25'))}.`, line: `${cT('t_1=7')},\\ ${cD('d=4')},\\ ${cN('n=25')}`, visit: 'start' },
    { cap: `Is the last term given? <b>No</b>, but ${T(cD('d'))} is: use the formula with ${T(cD('d'))}.`, go: ['start', 'A'] },
    { cap: `Substitute.`, line: `S_{25}=\\dfrac{25}{2}\\left[2(7)+24(4)\\right]` },
    { cap: `Inside the brackets: ${T('14+96=110')}. So ${T('S_{25}=1\\,375')}.`, line: `=\\dfrac{25}{2}(110)=\\boldsymbol{1\\,375}`, big: true }] },
  b: { label: 'Example 3(b)', ask: `<b>Example 3(b):</b> the first 30 terms of ${T('-20+(-17.5)+(-15)+\\dots')}`, steps: [
    { cap: `Read the series: ${T(cT('t_1=-20'))}, ${T(cD('d=-17.5-(-20)=2.5'))}, ${T(cN('n=30'))}.`, line: `${cT('t_1=-20')},\\ ${cD('d=2.5')},\\ ${cN('n=30')}`, visit: 'start' },
    { cap: `No last term, but ${T(cD('d'))} is known: the formula with ${T(cD('d'))}.`, go: ['start', 'A'] },
    { cap: `Substitute. Keep the negative in brackets.`, line: `S_{30}=\\dfrac{30}{2}\\left[2(-20)+29(2.5)\\right]` },
    { cap: `${T('-40+72.5=32.5')}, so ${T('S_{30}=15(32.5)=487.5')}.`, line: `=15(32.5)=\\boldsymbol{487.5}`, big: true }] },
  c: { label: 'Example 3(c)', ask: `<b>Example 3(c):</b> ${T('S_{18}')} when ${T('t_1=-12')} and ${T('t_{18}=73')}`, steps: [
    { cap: `${T(cT('t_1=-12'))}, and ${T(cL('t_{18}=73'))} is the <b>last term</b>, with ${T(cN('n=18'))}.`, line: `${cT('t_1=-12')},\\ ${cL('t_{18}=73')},\\ ${cN('n=18')}`, visit: 'start' },
    { cap: `Is the last term given? <b>Yes.</b>`, go: ['start', 'B'] },
    { cap: `Is ${T('n')} given? <b>Yes</b>, 18. Use the pairing formula.`, go: ['B', 'F'] },
    { cap: `Substitute.`, line: `S_{18}=\\dfrac{18}{2}(-12+73)` },
    { cap: `${T('S_{18}=9(61)=549')}.`, line: `=9(61)=\\boldsymbol{549}`, big: true }] },
  e4: { label: 'Example 4', ask: `<b>Example 4:</b> ${T('52+45+38+\\dots+(-39)')}`, steps: [
    { cap: `${T(cT('t_1=52'))}, ${T(cD('d=45-52=-7'))}, and the last term is ${T(cL('t_n=-39'))}.`, line: `${cT('t_1=52')},\\ ${cD('d=-7')},\\ ${cL('t_n=-39')}`, visit: 'start' },
    { cap: `Is the last term given? <b>Yes.</b>`, go: ['start', 'B'] },
    { cap: `Is ${T('n')} given? <b>No</b>: find ${T('n')} first.`, go: ['B', 'N'] },
    { cap: `${T('t_n=t_1+(n-1)d')} with the numbers.`, line: `-39=52+(n-1)(-7)` },
    { cap: `Subtract 52, then divide by ${T('-7')}: ${T('n-1=13')}, so ${T(cN('n=14'))}.`, line: `-91=-7(n-1)\\Rightarrow n-1=13\\Rightarrow ${cN('n=14')}` },
    { cap: `Now the pairing formula.`, go: ['N', 'F'], line: `S_{14}=\\dfrac{14}{2}\\left(52+(-39)\\right)` },
    { cap: `${T('S_{14}=7(13)=91')}.`, line: `=7(13)=\\boldsymbol{91}`, big: true }] }
};
const whichFormula = {
  title: 'Follow the questions',
  height: 430,
  minW: 920,
  capH: 96,
  choices: Object.keys(WFQ).map((k) => ({ v: k, label: WFQ[k].label })),
  ask: (k) => WFQ[k].ask,
  make(stage, k, ex) {
    const W = ex.W;
    const F = new Flowchart(stage, { x: 8, y: 6, width: 496, height: 420,
      nodes: {
        start: { x: 236, y: 34, w: 350, h: 50, html: `<b>Is the last term ${T('t_n')} given?</b>`, cls: 'bk-round' },
        A: { x: 104, y: 178, w: 196, h: 116, color: DC, html: `<b>No: use ${T('d')}</b>${T('S_n=\\tfrac{n}{2}\\left[2t_1+(n-1)d\\right]')}` },
        B: { x: 350, y: 136, w: 190, h: 54, html: `<b>Yes. Is ${T('n')} given?</b>` },
        N: { x: 350, y: 252, w: 184, h: 74, color: NC, html: `<b>No: find ${T('n')}</b>${T('t_n=t_1+(n-1)d')}` },
        F: { x: 316, y: 370, w: 262, h: 64, color: TN, html: `<b>Pairing formula</b>${T('S_n=\\tfrac{n}{2}(t_1+t_n)')}` }
      },
      edges: [
        { from: 'start', to: 'A', label: 'no', route: 'vhv' },
        { from: 'start', to: 'B', label: 'yes', route: 'vhv' },
        { from: 'B', to: 'N', label: 'no' },
        { from: 'N', to: 'F', pts: [[350, 292], [350, 335]] },
        { from: 'B', to: 'F', label: 'yes', pts: [[448, 136], [474, 136], [474, 370], [450, 370]], labelAt: [474, 252] }
      ] });
    const PX = 524, pn = panel(stage, PX, 14, W - PX - 14, 400, 'Working');
    return WFQ[k].steps.map((s) => ({ cap: s.cap, run: async (c) => {
      if (s.visit) await F.visit(c, s.visit);
      if (s.go) { await F.go(c, s.go[0], s.go[1]); await F.visit(c, s.go[1]); }
      if (s.line) await show(c, line(pn, T(s.line), s.big ? 'u1l4-big' : ''));
    } }));
  }
};

/* =============================== explainer: finding n (quadratic) beside the dots (n, S_n) =============================== */
const FN = {
  c155: { label: T('2+5+8+\\dots=155'), t1: 2, d: 3, S: 155, ans: 10, xmax: 12.6, ymax: 200, ystep: 25, ylab: 50,
    ask: `How many terms of ${T('2+5+8+\\dots')} give a sum of 155?`, steps: [
      { cap: `Substitute ${T('t_1=2')}, ${T('d=3')} and ${T('S_n=155')}.`, line: `155=\\dfrac{n}{2}\\left[2(2)+(n-1)(3)\\right]` },
      { cap: `Simplify the bracket: ${T('4+3n-3=3n+1')}.`, line: `155=\\dfrac{n}{2}(3n+1)` },
      { cap: `Multiply both sides by 2 to clear the fraction.`, line: `310=3n^2+n` },
      { cap: `Move 310 over, so one side is 0.`, line: `3n^2+n-310=0` },
      { cap: `Factor. (Check: ${T('3n\\cdot n=3n^2')} and ${T('-30n+31n=n')}.)`, line: `(3n+31)(n-10)=0` },
      { cap: `${T('n=10')} or ${T('n=-\\tfrac{31}{3}')}. A negative fraction can’t count terms: <b>reject</b> it.`, roots: true, line: `n=\\boldsymbol{10}\\quad\\text{or}\\quad ${cX('n=-\\tfrac{31}{3}')}` }] },
  ex5: { label: 'Example 5 check', t1: 6, d: 4, S: 336, ans: 12, xmax: 14.6, ymax: 420, ystep: 50, ylab: 100,
    ask: `<b>Example 5:</b> how many terms of ${T('6+10+14+\\dots')} give a sum of 336?`, steps: [
      { cap: `Substitute ${T('t_1=6')}, ${T('d=4')} and ${T('S_n=336')}.`, line: `336=\\dfrac{n}{2}\\left[2(6)+(n-1)(4)\\right]` },
      { cap: `Simplify the bracket: ${T('12+4n-4=4n+8')}. Half of it is ${T('2n+4')}.`, line: `336=\\dfrac{n}{2}(4n+8)=n(2n+4)` },
      { cap: `Expand and move 336 over, so one side is 0.`, line: `2n^2+4n-336=0` },
      { cap: `Divide every term by the common factor 2.`, line: `n^2+2n-168=0` },
      { cap: `Factor: two numbers that multiply to ${T('-168')} and add to ${T('2')} are ${T('14')} and ${T('-12')}.`, line: `(n+14)(n-12)=0` },
      { cap: `${T('n=12')} or ${T('n=-14')}. You can’t add ${T('-14')} terms: <b>reject</b> it.`, roots: true, line: `n=\\boldsymbol{12}\\quad\\text{or}\\quad ${cX('n=-14')}` }] }
};
const findN = {
  title: 'Finding n: a quadratic',
  height: 440,
  minW: 920,
  choices: Object.keys(FN).map((k) => ({ v: k, label: FN[k].label })),
  ask: (k) => FN[k].ask,
  make(stage, k, ex) {
    const d = FN[k], W = ex.W, Sn = (n) => n * (2 * d.t1 + (n - 1) * d.d) / 2;
    const G = new Graph(stage, { x: 8, y: 8, width: 430, height: 424, xmin: 0, xmax: d.xmax, ymin: 0, ymax: d.ymax, xstep: 1, ystep: d.ystep, xlabels: 2, ylabels: d.ylab, xtitle: 'n', ytitle: 'S_n', arrows: false });
    const PX = 460, pn = panel(stage, PX, 10, W - PX - 14, 420, 'Solve for n');
    let target = null;
    const steps = [{ cap: `The goal: the sum ${T(cS('S_n=' + d.S))}. Which ${T(cN('n'))} gets there?`,
      run: async (c) => { target = G.hline(d.S, { color: SC, width: 3 }); await G.reveal(target, c); await G.reveal(G.label(d.xmax - 0.2, d.S, T(cS(String(d.S))), { pos: 'nw', cls: 'bk-ptlab' }), c); } }];
    d.steps.forEach((s) => steps.push({ cap: s.cap, run: async (c) => {
      const L = line(pn, T(s.line)); await show(c, L);
      if (s.roots) { const sp = stamp(L, '✗', { ok: false, size: 'sm', cls: 'u1l4-rej' }); await stampIn(c, sp); }
    } }));
    steps.push({ cap: `Check on the graph of ${T('(n,\\ S_n)')}: dot number ${T(cN(String(d.ans)))} lands right on ${T(cS(String(d.S)))}. <b>${d.ans} terms.</b>`,
      run: async (c) => {
        for (let n = 1; n <= Math.floor(d.xmax); n++) {
          const on = n === d.ans, p = G.point(n, Sn(n), { color: on ? NC : INK, r: on ? 9 : 6, label: on ? T(`(${n},\\ ${Sn(n)})`) : null, pos: 'nw' });
          await G.reveal(p, c, on ? 420 : 160);
        }
      } });
    return steps;
  }
};

/* =============================== explainer: terms from S_n (towers on a graph of (n, S_n)) =============================== */
const STT = {
  ex9: { label: 'Example 9 check', S: (n) => 3 * n * n + 2 * n, sTex: 'S_n=3n^2+2n', ymax: 60, far: 20, ask: `<b>Example 9:</b> ${T('S_n=3n^2+2n')}` },
  g: { label: 'From a graph', S: (n) => 2 * n * n + n, ymax: 40, far: 10, graph: true, sTex: 'S_n=2n^2+n', ask: `A graph shows the points ${T('(n,\\ S_n)')} of an arithmetic series. (Its formula is ${T('S_n=2n^2+n')}.)` }
};
const sumToTerms = {
  title: 'Each new tower adds one term',
  height: 440,
  minW: 920,
  choices: Object.keys(STT).map((k) => ({ v: k, label: STT[k].label })),
  ask: (k) => STT[k].ask,
  make(stage, k, ex) {
    const d = STT[k], W = ex.W, S = [0, 1, 2, 3, 4].map((n) => (n ? d.S(n) : 0)), t = [1, 2, 3, 4].map((n) => S[n] - S[n - 1]), dd = t[1] - t[0];
    const G = new Graph(stage, { x: 8, y: 8, width: 440, height: 424, xmin: 0, xmax: 5.3, ymin: 0, ymax: d.ymax, xstep: 1, ystep: 5, xlabels: 1, ylabels: 10, xtitle: 'n', ytitle: 'S_n', arrows: false });
    const PX = 470, pn = panel(stage, PX, 10, W - PX - 14, 420, '');
    const bar = (n, y0, y1, attrs) => { const [x0p, yb] = G.toPx(n - 0.22, y0), [x1p, yt] = G.toPx(n + 0.22, y1); return rect(G.layers.bg, x0p, yt, x1p - x0p, yb - yt, attrs); };
    const towers = [1, 2, 3, 4].map((n) => { const r = bar(n, 0, S[n], { fill: '#f3e3e9', stroke: SC, 'stroke-width': 1.5 }); r.style.opacity = 0; return r; });
    let pts = [];
    const steps = [
      { cap: d.graph ? `Read the sums off the graph: ${T(`S_1=${S[1]},\\ S_2=${S[2]},\\ S_3=${S[3]},\\ S_4=${S[4]}`)}.` : `Use the formula: ${T(`S_1=3(1)^2+2(1)=5`)}, ${T('S_2=3(4)+4=16')}, ${T('S_3=33')}, ${T('S_4=56')}.`,
        run: async (c) => {
          for (let n = 1; n <= 4; n++) { const p = G.point(n, S[n], { color: SC, r: 7, label: T(cS(String(S[n]))), pos: 'nw' }); pts.push(p); await G.reveal(p, c, 220); }
          await show(c, line(pn, T(`S_1=${S[1]},\\ S_2=${S[2]},\\ S_3=${S[3]},\\ S_4=${S[4]}`)));
        } },
      { cap: `Each ${T(cS('S_n'))} is a tower: the total of the first ${T('n')} terms.`, run: async (c) => { for (const r of towers) await appear(c, r, 200); } },
      { cap: `The first tower is just the first term: ${T(`${cT('t_1')}=S_1=${t[0]}`)}.`,
        run: async (c) => { towers[0].setAttribute('fill', '#bfe3e2'); towers[0].setAttribute('stroke', T1); await pulse(c, towers[0], 1.04); await show(c, line(pn, T(`${cT('t_1')}=S_1=${t[0]}`))); } }
    ];
    const tops = [];
    const topSeg = async (c, n) => {
      const [xa, ya] = G.toPx(n - 1, S[n - 1]), [xb] = G.toPx(n + 0.22, 0);
      const dl = svgEl('line', { x1: xa, y1: ya, x2: xb, y2: ya, stroke: INK, 'stroke-width': 2, 'stroke-dasharray': '6 5', class: 'bk-stroke' }, G.layers.data);
      await drawIn(dl, 300, c);
      const r = bar(n, S[n - 1], S[n], { fill: '#fbe6c2', stroke: DC, 'stroke-width': 2.5 }); tops.push(r); await appear(c, r, 260);
      await pop(c, G.label(n, (S[n - 1] + S[n]) / 2, T(String(t[n - 1])), { pos: 'c', cls: 'u1l4-tlab' }), 260);
    };
    steps.push({ cap: `${T('S_2')} is ${T('S_1')} plus <b>one more term</b> on top: ${T(`t_2=S_2-S_1=${S[2]}-${S[1]}=${t[1]}`)}.`,
      run: async (c) => { await topSeg(c, 2); await show(c, line(pn, T(`t_2=S_2-S_1=${S[2]}-${S[1]}=${t[1]}`))); } });
    steps.push({ cap: `Same again: ${T(`t_3=${S[3]}-${S[2]}=${t[2]}`)} and ${T(`t_4=${S[4]}-${S[3]}=${t[3]}`)}.`,
      run: async (c) => { await topSeg(c, 3); await show(c, line(pn, T(`t_3=${S[3]}-${S[2]}=${t[2]}`))); await topSeg(c, 4); await show(c, line(pn, T(`t_4=${S[4]}-${S[3]}=${t[3]}`))); } });
    steps.push({ cap: `The terms ${T(t.join(',\\ '))}: they go up by ${T(cD('d=' + dd))}. Arithmetic!`,
      run: (c) => show(c, line(pn, T(`${t.join(',\\ ')},\\ \\dots\\quad ${cD('d=' + dd)}`), 'u1l4-big')) });
    const F = d.far, a = d.S(F), b = d.S(F - 1);
    steps.push({ cap: `A far term needs no list: ${T(`t_{${F}}=S_{${F}}-S_{${F - 1}}=${N(a)}-${N(b)}=${a - b}`)}.`,
      run: async (c) => {
        await show(c, line(pn, T(`t_{${F}}=S_{${F}}-S_{${F - 1}}`)));
        await show(c, line(pn, T(`=${N(a)}-${N(b)}=\\boldsymbol{${a - b}}`)));
        await show(c, line(pn, `Check: ${T(`${t[0]}+${F - 1}(${dd})=${t[0] + (F - 1) * dd}\\ \\checkmark`)}`, 'u1l4-small'));
      } });
    return steps;
  }
};

/* ====================================================================================================
 * Math History: Gauss's slate. 1 … 100 in a 10 × 10 grid; k and 101 − k sit opposite through the centre.
 * ==================================================================================================== */
function gaussSlate() {
  const svg = document.getElementById('u1l4-hist'); if (!svg) return;
  const mk = (tag, attrs, parent) => svgEl(tag, attrs, parent || svg);
  const txt = (s, attrs, parent) => { const e = mk('text', attrs, parent); e.textContent = s; return e; };
  mk('rect', { x: 14, y: 14, width: 332, height: 312, rx: 12, fill: '#7a4a26' });
  mk('rect', { x: 26, y: 26, width: 308, height: 288, rx: 6, fill: '#2f3b37' });
  const X0 = 36, Y0 = 34, cw = 28.8, chh = 27.2, CX = X0 + 5 * cw, CY = Y0 + 5 * chh;
  const lines = mk('g', {}), cells = [];
  for (let k = 1; k <= 100; k++) {
    const r = Math.floor((k - 1) / 10), cc = (k - 1) % 10, x = X0 + (cc + 0.5) * cw, y = Y0 + (r + 0.5) * chh;
    cells.push({ x, y, t: txt(String(k), { x, y: y + 5, 'text-anchor': 'middle', class: 'u1l4-chalk' }) });
  }
  txt('pairs', { x: 372, y: 64, class: 'u1l4-hcap' });
  const cnt = txt('0', { x: 372, y: 118, class: 'u1l4-hbig' });
  const pairT = txt('', { x: 372, y: 168, class: 'u1l4-hpair' });
  const each = txt('each pair adds to 101', { x: 372, y: 200, class: 'u1l4-hcap' });
  const fin = txt('50 × 101 = 5\u202f050', { x: 372, y: 262, class: 'u1l4-hfin' });
  const fin2 = txt('“There it lies.”', { x: 372, y: 296, class: 'u1l4-hcap' });
  let timers = [];
  function draw(m, live) {
    lines.innerHTML = '';
    cells.forEach((c, i) => c.t.classList.toggle('on', i < m || i >= 100 - m));
    for (let k = 1; k <= m; k++) {
      const a = cells[k - 1], b = cells[100 - k];
      const l = mk('line', { x1: a.x, y1: a.y, x2: b.x, y2: b.y, class: 'u1l4-hline' + (k === m && live ? ' u1l4-hline-new' : '') }, lines);
      l.style.opacity = k === m && live ? 0.95 : 0.4;
    }
    cnt.textContent = String(m);
    pairT.textContent = m ? `${m} + ${101 - m} = 101` : '';
    each.style.opacity = m ? 1 : 0;
    fin.style.opacity = m >= 50 ? 1 : 0; fin2.style.opacity = m >= 50 ? 1 : 0;
  }
  function play() {
    timers.forEach(clearTimeout); timers = [];
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { draw(50, false); return; }
    draw(0, false);
    let t = 600;
    for (let m = 1; m <= 50; m++) { t += m <= 4 ? 900 : m <= 10 ? 260 : 110; const mm = m; timers.push(setTimeout(() => draw(mm, mm < 50), t)); }
    timers.push(setTimeout(() => draw(50, false), t + 500));
  }
  draw(0, false);
  svg.addEventListener('click', play);
  const btn = svg.closest('.hist-anim') && svg.closest('.hist-anim').querySelector('.hist-play'); if (btn) btn.addEventListener('click', play);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); play(); } }, { threshold: 0.5 });
    io.observe(svg);
  } else play();
}

/* =============================== Stand Up Break! (whiteboard stations; ../standup.js) ===============================
 * BEG: the sum of the first n terms (formula with d). PRG: the last term given, so find n first, then pair.
 * MAS: how many terms give a sum (a factorable quadratic; reject the other root). */
const suS = (t1, d, n) => n * (2 * t1 + (n - 1) * d) / 2;
const suSer = (t1, d) => `${t1}+${P(t1 + d)}+${P(t1 + 2 * d)}+\\dots`;
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const suTerm = (c, v, first) => (c === 0 ? '' : (c < 0 ? '-' : first ? '' : '+') + (Math.abs(c) === 1 && v ? '' : Math.abs(c)) + v);
standup('u1l4', {
  intro: 'At your whiteboard: find t₁, d and n first, then pick the formula.',
  levels: {
    BEG: (r) => {
      const t1 = r.pick([-9, -8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]), d = r.pick([2, 3, 4, 5, 6, 7, -2, -3, -4]), n = r.pick([12, 15, 16, 18, 20, 24, 25, 30]), S = suS(t1, d, n);
      return { text: `Determine the sum of the first <b>${n}</b> terms.`, q: suSer(t1, d),
        a: [`t_1=${t1},\\quad d=${d},\\quad n=${n}`, `S_{${n}}=\\tfrac{${n}}{2}\\left[2(${t1})+${n - 1}(${d})\\right]`, `=\\tfrac{${n}}{2}(${2 * t1 + (n - 1) * d})=${N(S)}`] };
    },
    PRG: (r) => {
      const t1 = r.pick([-12, -10, -8, -7, -5, -4, -3, -1, 1, 2, 3, 5, 6, 7, 9, 11, 12, 14, 15, 17, 20]), d = r.pick([2, 3, 4, 5, 6, 8, -3, -4, -5]), n = r.int(11, 26), tn = t1 + (n - 1) * d, S = suS(t1, d, n);
      return { text: 'Determine the sum.', q: `${suSer(t1, d)}+${P(tn)}`,
        a: [`t_1=${t1},\\ d=${d}:\\quad ${tn}=${t1}+(n-1)(${d})`, `n-1=${n - 1}\\ \\Rightarrow\\ n=${n}`, `S_{${n}}=\\tfrac{${n}}{2}\\left(${t1}+${P(tn)}\\right)=${N(S)}`] };
    },
    MAS: (r) => {
      const t1 = r.int(1, 12), d = r.pick([2, 3, 4, 5, 6]), n0 = r.int(6, 18), S = suS(t1, d, n0), q = 2 * t1 + (n0 - 1) * d;
      const A = d, B = 2 * t1 - d, Cc = 2 * S, g = gcd(gcd(A, B), Cc), a = A / g, b = B / g, cc = Cc / g, qa = q / g;
      const f = gcd(qa, a), rej = a / f === 1 ? `-${qa / f}` : `-\\tfrac{${qa / f}}{${a / f}}`;
      return { text: 'How many terms must be added to give this sum?', q: `${suSer(t1, d)}=${N(S)}`,
        a: [`${N(S)}=\\tfrac{n}{2}\\left[2(${t1})+(n-1)(${d})\\right]`, `${suTerm(a, 'n^2', true)}${suTerm(b, 'n', false)}-${N(cc)}=0` + (g > 1 ? `\\quad(\\div${g})` : ''),
          `(n-${n0})(${a === 1 ? '' : a}n+${qa})=0`, `n=${n0}\\quad(\\text{reject } n=${rej})`] };
    }
  }
});

/* =============================== mount =============================== */
gaussSlate();
export const explainers = mountExplainers({ partialSums, gaussRows, whichFormula, findN, sumToTerms });
export const _test = { N, PS, GR, WFQ, FN, STT, suS };
