/* Math 20-1 · Unit 1 · Lesson 9 — Unit 1 Review.
 * Warm-up (Two Beanstalks: Steady adds 12 cm a day, Magic doubles; on which day does Magic pass Steady?), and the explainers:
 *   sideBySide (arithmetic vs geometric with the same start: terms with +d / ×r hops, (n, t_n) dots with their steps,
 *     running sums as bars, and whether S∞ exists; Example 1(a)/(c) numbers),
 *   whichFormula (star: the "which formula?" decision flowchart lights its path for each context, the clue words light
 *     up in the question, and the work panel substitutes; Example 1(a)–(d) checks, two review contexts, rows forever),
 *   countTerms (where does the count start: time 0 is t1, so "after 6 years" is t7; Example 1(b), 7(a), 8(a) checks),
 *   twoTerms (count the jumps between two known terms, then step back to t1; Example 2 and 3 checks, means, ± ratio),
 *   threeTerms (equal differences / equal ratios for three terms in a row, number line and b² = ac area picture;
 *     Example 4 checks), sumToTerm (S_n bars: each new bar is the old total plus one term; Example 5 check),
 *   findN (solve for n, then a table of values climbs to the target line; Example 6 and 7(b) checks),
 *   bounce (the ball's path: drops and rises as two geometric series; Example 8 checks).
 * Colours: arithmetic blue, geometric green, d / r amber, t1 teal (the course's #a33357), S∞ purple, mistakes red. */
import {
  h, tex, add, box, Box, Flowchart, NumberLine, stamp, stampIn, mountExplainers, pop, fadeIn, appear, sleep, tween,
  svgEl, liveCtx, pulse, drawIn, arrowHead, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const CA = COLORS.blue, CG = COLORS.green, CD = COLORS.amber, C1 = COLORS.teal, CI = COLORS.purple, RED = COLORS.red, INK = COLORS.ink, GRAY = COLORS.gray;
const cA = (s) => `\\textcolor{${CA}}{${s}}`, cG = (s) => `\\textcolor{${CG}}{${s}}`, cD = (s) => `\\textcolor{${CD}}{${s}}`;
const c1 = (s) => `\\textcolor{${C1}}{${s}}`, cI = (s) => `\\textcolor{${CI}}{${s}}`, cR = (s) => `\\textcolor{${RED}}{${s}}`;
/** a number as TeX: rounded to dp places (trailing zeros dropped unless keep), a thin space from 10 000 up (booklet style) */
function tn(v, dp = 4, keep = false) {
  let s = keep ? v.toFixed(dp) : String(parseFloat(v.toFixed(dp)));
  const neg = s.startsWith('-'); if (neg) s = s.slice(1);
  let [i, f] = s.split('.');
  if (i.length > 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');
  return (neg ? '-' : '') + i + (f ? '.' + f : '');
}
/** the same for HTML text (real minus, narrow no-break space) */
const hn = (v, dp = 4, keep = false) => tn(v, dp, keep).replace(/\\,/g, ' ').replace('-', '−');
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const panel = (stage, x, y, w, hh, title, cls = '') => add(stage, box(h('div', 'u1l9-panel ' + cls, title ? `<div class="u1l9-ph">${title}</div>` : ''), w, hh), x, y);
const line = (p, html, cls = '') => { const d = h('div', 'u1l9-line ' + cls, html); p.appendChild(d); return d; };
const lab = (B, x, y, html, cls = '', pos = 'c') => B.hlabel(x, y, html, { cls: 'u1l9-lab ' + cls, pos, gap: 0 });

/* =============================== warm-up: Two Beanstalks =============================== */
const STEADY = (d) => 30 + 12 * (d - 1), MAGIC = (d) => 2 ** (d - 1), MAXDAY = 9;
function mountGarden() {
  const host = document.getElementById('u1l9-garden'); if (!host) return;
  const W = Math.max(500, Math.min(660, host.clientWidth || 630)), H = 286;
  const B = new Box(host, {}, 'u1l9-gbox', W, H);
  const ground = H - 44, top = 26, maxCm = 140, k = (ground - top) / maxCm, Y = (cm) => ground - cm * k;
  svgEl('rect', { x: 0, y: 0, width: W, height: H, rx: 14, fill: '#eaf4fa' }, B.svg);
  svgEl('rect', { x: 0, y: ground, width: W, height: H - ground, fill: '#b98f5e' }, B.svg);
  svgEl('rect', { x: 0, y: ground, width: W, height: 5, fill: '#8f6a3e' }, B.svg);
  // ruler
  const RX = 58;
  svgEl('rect', { x: RX - 8, y: Y(maxCm) - 6, width: 16, height: ground - Y(maxCm) + 6, rx: 3, fill: '#f6e7b8', stroke: '#b99a4a', 'stroke-width': 1.5 }, B.svg);
  for (let cm = 0; cm <= maxCm; cm += 10) {
    svgEl('line', { x1: RX - 8, y1: Y(cm), x2: RX + (cm % 20 ? -1 : 4), y2: Y(cm), stroke: '#6b5520', 'stroke-width': 1.5 }, B.svg);
    if (cm % 20 === 0) lab(B, RX - 14, Y(cm), String(cm), 'u1l9-rulab', 'w');
  }
  lab(B, RX, Y(maxCm) - 16, 'cm', 'u1l9-rulab');
  const xs = [W * 0.42, W * 0.76], cols = ['#3d8b37', '#7a3fb8'], names = ['Steady', 'Magic'];
  const stalks = xs.map((x, i) => {
    const g = svgEl('g', {}, B.svg);
    const stem = svgEl('rect', { x: x - 5, y: ground, width: 10, height: 0, rx: 5, fill: cols[i] }, g);
    const leaves = svgEl('g', {}, g);
    svgEl('path', { d: `M${x - 34} ${ground - 6} L${x + 34} ${ground - 6} L${x + 26} ${ground + 30} L${x - 26} ${ground + 30} Z`, fill: '#c0643a', stroke: '#8a3f20', 'stroke-width': 2 }, B.svg);
    const nm = lab(B, x, ground + 14, `<b>${names[i]}</b>`, 'u1l9-potlab ' + (i ? 'u1l9-cg' : 'u1l9-ca'));
    const top = svgEl('g', {}, g);
    const hl = lab(B, x, ground, '', 'u1l9-hlab ' + (i ? 'u1l9-cg' : 'u1l9-ca'));
    return { x, stem, leaves, top, hl, nm, i };
  });
  const dayTag = lab(B, W - 14, 22, '', 'u1l9-daytag', 'w');
  const off = lab(B, xs[1] + 16, 96, '', 'u1l9-offlab', 'e');
  // a table of the heights so far, under the picture
  const tb = h('table', 'u1l9-wtab'); host.appendChild(tb);
  const days = Array.from({ length: MAXDAY }, (_, i) => i + 1);
  tb.innerHTML = `<tr><th>Day</th>${days.map((d) => `<td>${d}</td>`).join('')}</tr>` +
    `<tr class="u1l9-ca"><th>Steady</th>${days.map((d) => `<td data-s="${d}">${STEADY(d)}</td>`).join('')}</tr>` +
    `<tr class="u1l9-cg"><th>Magic</th>${days.map((d) => `<td data-m="${d}">${MAGIC(d)}</td>`).join('')}</tr>`;
  let day = 1, cur = [STEADY(1), MAGIC(1)];
  const nodes = (i, hcm) => { const out = []; if (i === 0) { for (let v = 30; v <= hcm + 1e-9; v += 12) out.push(v); } else { for (let v = 1; v <= hcm + 1e-9; v *= 2) out.push(v); } return out; };
  function draw(st, hcm) {
    const shown = Math.min(hcm, maxCm + 4), yTop = Y(shown);
    st.stem.setAttribute('y', yTop); st.stem.setAttribute('height', ground - yTop);
    st.leaves.innerHTML = '';
    nodes(st.i, hcm).forEach((v, j) => {
      if (v > maxCm || v < 4) return; const s = j % 2 ? 1 : -1, yy = Y(v);
      svgEl('path', { d: `M${st.x} ${yy} q ${s * 14} -14 ${s * 30} -6 q ${-s * 14} 12 ${-s * 30} 6 Z`, fill: st.i ? '#9a62d6' : '#5fae4f' }, st.leaves);
    });
    st.top.innerHTML = '';
    if (hcm <= maxCm) {
      if (st.i) svgEl('path', { d: star(st.x, yTop - 4, 11, 5), fill: '#f2c94c', stroke: '#b8860b', 'stroke-width': 1.5 }, st.top);
      else svgEl('circle', { cx: st.x, cy: yTop - 4, r: 7, fill: '#f2a3b3', stroke: '#c0566c', 'stroke-width': 1.5 }, st.top);
    }
    st.hl.innerHTML = `${hn(Math.round(hcm))} cm`; st.hl.style.visibility = hcm > maxCm ? 'hidden' : '';
    st.hl.style.top = Math.max(top + 4, yTop - 24) + 'px';
    st.hl.style.left = (st.x + 44) + 'px';
  }
  function paint() {
    dayTag.innerHTML = `Day <b>${day}</b>`;
    tb.querySelectorAll('td[data-s], td[data-m]').forEach((td) => td.classList.toggle('u1l9-seen', Number(td.dataset.s || td.dataset.m) <= day));
    tb.querySelectorAll('td[data-m]').forEach((td) => td.classList.toggle('u1l9-win', Number(td.dataset.m) <= day && MAGIC(Number(td.dataset.m)) > STEADY(Number(td.dataset.m))));
    off.innerHTML = cur[1] > maxCm ? `↑ <b>${MAGIC(day)} cm</b><br>off the chart!` : '';
  }
  let job = 0;
  async function go(to) {
    to = Math.max(1, Math.min(MAXDAY, to)); if (to === day) return;
    const g = ++job, from = cur.slice(), target = [STEADY(to), MAGIC(to)]; day = to; paint();
    const c = liveCtx();
    await tween(c, 650, (t) => { if (g !== job) return false; cur = from.map((f, i) => f + (target[i] - f) * t); stalks.forEach((s, i) => draw(s, cur[i])); });
    if (g === job) { cur = target; stalks.forEach((s, i) => draw(s, cur[i])); paint(); }
  }
  stalks.forEach((s, i) => draw(s, cur[i])); paint();
  const btn = (id, fn) => { const b = document.getElementById(id); if (b) b.addEventListener('click', fn); };
  btn('u1l9-day', () => go(day + 1));
  btn('u1l9-dayback', () => go(day - 1));
  btn('u1l9-wreset', () => { job++; day = 1; cur = [STEADY(1), MAGIC(1)]; stalks.forEach((s, i) => draw(s, cur[i])); paint(); });
}
function star(cx, cy, R, r) {
  let d = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? r : R; d += (i ? 'L' : 'M') + (cx + q * Math.cos(a)).toFixed(1) + ' ' + (cy + q * Math.sin(a)).toFixed(1); }
  return d + 'Z';
}

/* =============================== explainer: arithmetic vs geometric side by side =============================== */
const SB = {
  grow: { label: T('+3') + ' vs ' + T('\\times2'), a: { t1: 2, d: 3 }, g: { t1: 2, r: 2 } },
  shrink: { label: T('-8') + ' vs ' + T('\\times\\tfrac{1}{2}'), a: { t1: 48, d: -8 }, g: { t1: 48, r: 0.5 } },
  ex1: { label: 'Example 1(a) and 1(c)', a: { t1: 24, d: 3 }, g: { t1: 3, r: 3 } }
};
/** one side: header, term row with hops, a dot chart, a running-sum bar chart and three formula lines */
function seqSide(stage, x, y, w, hh, isA, p) {
  const col = isA ? CA : CG, N = 5;
  const terms = Array.from({ length: N }, (_, i) => (isA ? p.t1 + i * p.d : p.t1 * p.r ** i));
  const sums = terms.map((_, i) => terms.slice(0, i + 1).reduce((a, b) => a + b, 0));
  const P = panel(stage, x, y, w, hh, isA ? `<b class="u1l9-ca">Arithmetic</b>: add ${T(cD('d=' + tn(p.d)))}` : `<b class="u1l9-cg">Geometric</b>: multiply by ${T(cD('r=' + tn(p.r)))}`, 'u1l9-sbp');
  const bh = hh - 40, B = new Box(P, { x: 0, y: 40 }, 'u1l9-sbbox', w, bh);
  // term row
  const bw = 62, gap = (w - 24 - N * bw) / (N - 1), bx = (i) => 12 + i * (bw + gap), BY = 40;
  const boxes = terms.map((v, i) => { const b = add(B.html, box(h('div', 'u1l9-tbox ' + (i ? '' : 'u1l9-tb1'), T(tn(v))), bw, 44), bx(i), BY); hide(b); return b; });
  const hops = terms.slice(1).map((_, i) => {
    const x1 = bx(i) + bw / 2 + 6, x2 = bx(i + 1) + bw / 2 - 6, g = svgEl('g', {}, B.svg);
    const path = svgEl('path', { class: 'bk-stroke', d: `M${x1} ${BY - 2} Q ${(x1 + x2) / 2} ${BY - 26} ${x2} ${BY - 2}`, fill: 'none', stroke: CD, 'stroke-width': 2.5 }, g);
    arrowHead(g, x2, BY - 2, 0.5, 1, { color: CD, width: 2.5 });
    const L = lab(B, (x1 + x2) / 2, BY - 26, T(cD(isA ? (p.d < 0 ? '' : '+') + tn(p.d) : '\\times' + (p.r === 0.5 ? '\\tfrac{1}{2}' : tn(p.r)))), 'u1l9-hoplab');
    g.style.opacity = 0; hide(L); return { g, path, L };
  });
  // charts
  const CY = 104, CH = bh - CY - 100, cw = (w - 30) / 2;
  const chart = (x0, vals, title) => {
    const vmax = Math.max(...vals, 0) * 1.18 || 1, vmin = Math.min(0, ...vals);
    const L = x0 + 10, R = x0 + cw - 4, top = CY + 22, bot = CY + CH - 22;
    const px = (i) => L + (i + 0.5) * (R - L) / N, py = (v) => bot - (v - vmin) / (vmax - vmin) * (bot - top);
    svgEl('rect', { x: x0, y: CY, width: cw, height: CH, rx: 10, fill: '#fbfaf7', stroke: '#e6e1d6' }, B.svg);
    svgEl('line', { x1: L, y1: py(0), x2: R, y2: py(0), stroke: '#8a8f99', 'stroke-width': 1.6 }, B.svg);
    svgEl('line', { x1: L, y1: top - 8, x2: L, y2: bot, stroke: '#8a8f99', 'stroke-width': 1.6 }, B.svg);
    for (let i = 0; i < N; i++) lab(B, px(i), bot + 11, String(i + 1), 'u1l9-nlab');
    lab(B, L + 6, CY + 12, title, 'u1l9-ctitle', 'e');
    return { px, py, L, R, top, bot };
  };
  const D = chart(10, terms, T('(n,\\ t_n)')), S = chart(20 + cw, sums, T('S_n'));
  const dots = terms.map((v, i) => { const c = svgEl('circle', { cx: D.px(i), cy: D.py(v), r: 7, fill: col, stroke: '#fff', 'stroke-width': 2 }, B.svg); c.style.opacity = 0; return c; });
  const fall = terms[1] < terms[0], dlab = terms.map((v, i) => hide(lab(B, D.px(i) + (fall ? 4 : 0), D.py(v) + (fall ? 17 : -16), T(tn(v)), 'u1l9-dlab')));
  const steps = terms.slice(1).map((v, i) => { const s = svgEl('path', { d: `M${D.px(i)} ${D.py(terms[i])} H${D.px(i + 1)} V${D.py(v)}`, fill: 'none', stroke: CD, 'stroke-width': 3, 'stroke-dasharray': '6 4' }, B.svg); s.style.opacity = 0; return s; });
  const bars = sums.map((v, i) => { const y0 = S.py(Math.max(0, v)), y1 = S.py(Math.min(0, v)); const r = svgEl('rect', { x: S.px(i) - 13, y: y0, width: 26, height: Math.max(1, y1 - y0), rx: 3, fill: col, 'fill-opacity': 0.75 }, B.svg); r.style.opacity = 0; return r; });
  const blab = sums.map((v, i) => hide(lab(B, S.px(i), S.py(Math.max(0, v)) - 13, T(tn(v)), 'u1l9-dlab')));
  // S∞ line (geometric, |r| < 1)
  let inf = null;
  if (!isA && Math.abs(p.r) < 1) {
    const s8 = p.t1 / (1 - p.r), yy = S.py(s8);
    inf = svgEl('g', {}, B.svg); inf.style.opacity = 0;
    svgEl('line', { x1: S.L, y1: yy, x2: S.R, y2: yy, stroke: CI, 'stroke-width': 2.5, 'stroke-dasharray': '8 6' }, inf);
    inf.lab = hide(lab(B, S.R - 2, yy - 13, T(cI('S_\\infty=' + tn(s8))), 'u1l9-inflab', 'w'));
  }
  // formulas
  const FX = 12, FY = CY + CH + 8;
  const F = h('div', 'u1l9-sbf'); add(B.html, box(F, w - 24, 92), FX, FY);
  const tnF = isA ? `t_n=${c1(tn(p.t1))}+(n-1)(${cD(tn(p.d))})` : `t_n=${c1(tn(p.t1))}(${cD(p.r === 0.5 ? '0.5' : tn(p.r))})^{n-1}`;
  const s5 = sums[N - 1];
  const sF = isA ? `S_5=\\tfrac{5}{2}(${tn(terms[0])}+${tn(terms[N - 1])})=${tn(s5)}` : `S_5=\\tfrac{${tn(p.t1)}(${tn(p.r)}^5-1)}{${tn(p.r)}-1}=${tn(s5)}`;
  const iF = isA ? `S_\\infty:\\ \\text{none}` : Math.abs(p.r) < 1 ? `S_\\infty=\\tfrac{${tn(p.t1)}}{1-${tn(p.r)}}=${tn(p.t1 / (1 - p.r))}` : `r=${tn(p.r)}>1:\\ \\text{divergent}`;
  const fl = [tnF, sF, iF].map((s) => hide(line(F, T(s), 'u1l9-sbfl')));
  return {
    terms, sums,
    async row(c) { for (let i = 0; i < N; i++) { if (i) { const hp = hops[i - 1]; hp.g.style.opacity = 1; await drawIn(hp.path, 220, c); await appear(c, hp.L, 160); } await pop(c, boxes[i], 260); } await show(c, fl[0]); },
    async dots(c) { for (let i = 0; i < N; i++) { dots[i].style.opacity = 1; await pop(c, dots[i], 220); dlab[i].style.opacity = 1; if (i) { steps[i - 1].style.opacity = 1; await appear(c, steps[i - 1], 200); } } },
    async bars(c) { for (let i = 0; i < N; i++) { bars[i].style.opacity = 1; await appear(c, bars[i], 220); blab[i].style.opacity = 1; } await show(c, fl[1]); },
    async forever(c) { if (inf) { await appear(c, inf, 400); inf.lab.style.opacity = 1; } await show(c, fl[2]); }
  };
}
const sideBySide = {
  title: 'Arithmetic vs geometric',
  height: 450,
  minW: 900,
  choices: Object.keys(SB).map((k) => ({ v: k, label: SB[k].label })),
  intro: 'Same kind of start, two different rules. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = SB[k], W = ex.W, pw = (W - 14) / 2;
    const A = seqSide(stage, 0, 4, pw, 442, true, d.a), G = seqSide(stage, pw + 14, 4, pw, 442, false, d.g);
    const gd = G.terms.slice(1).map((v, i) => v - G.terms[i]);
    const grow = d.g.r > 1, dd = (v) => (v > 0 ? '+' : '') + tn(v);
    return [
      { cap: `Arithmetic starts at ${T(c1('t_1=' + tn(d.a.t1)))} and <b>adds</b> the same number each time: ${T(cD('d=' + tn(d.a.d)))}.`, run: (c) => A.row(c) },
      { cap: `Geometric starts at ${T(c1('t_1=' + tn(d.g.t1)))} and <b>multiplies</b> by the same number each time: ${T(cD('r=' + tn(d.g.r)))}.`, run: (c) => G.row(c) },
      { cap: `Plot the points ${T('(n,\\ t_n)')}. The arithmetic dots move by <b>equal steps</b> of ${T(cD(dd(d.a.d)))}: they lie on a line with slope ${T(cD('d=' + tn(d.a.d)))}.`, run: (c) => A.dots(c) },
      { cap: `The geometric steps ${grow ? '<b>grow</b>' : '<b>shrink</b>'}: ${T(gd.map((v) => cD(dd(v))).join(',\\ '))}. The dots ${grow ? 'curve upward' : 'curve and level off'}: <b>not</b> linear.`, run: (c) => G.dots(c) },
      { cap: `Add as you go: that’s the <b>series</b>. ${T('S_5=' + tn(A.sums[4]))} for the arithmetic one, ${T('S_5=' + tn(G.sums[4]))} for the geometric one.`, run: async (c) => { await A.bars(c); await G.bars(c); } },
      { cap: grow ? `Forever? Arithmetic sums never settle: <b>no</b> ${T('S_\\infty')}. With ${T('r=' + tn(d.g.r) + '>1')} the geometric sums blow up too: <b>divergent</b>.`
        : `Forever? Arithmetic sums never settle: <b>no</b> ${T('S_\\infty')}. With ${T('-1<r<1')} the geometric sums close in on ${T(cI('S_\\infty=' + tn(d.g.t1 / (1 - d.g.r))))}.`,
        run: async (c) => { await A.forever(c); await G.forever(c); } }
    ];
  }
};

/* =============================== explainer: which formula? (star) =============================== */
const K1 = (s) => `<span class="u1l9-k u1l9-k1">${s}</span>`, K2 = (s) => `<span class="u1l9-k u1l9-k2">${s}</span>`;
const WF = {
  a: { label: 'Example 1(a)', kind: 'A', want: 'S',
    ask: `(a) A theatre has 24 seats in row 1, and each row has ${K1('3 more seats')} than the row in front of it. How many seats are in ${K2('the first 20 rows')}?`,
    c1: '“3 more seats” each row: the same <b>amount</b> is added.', par: 'd=3', c2: '“in the first 20 rows”: a <b>total</b>.',
    f: 'S_n=\\dfrac{n}{2}\\left[2t_1+(n-1)d\\right]', sub: ['t_1=24,\\ \\ d=3,\\ \\ n=20', 'S_{20}=\\dfrac{20}{2}\\left[2(24)+19(3)\\right]', '=10(105)=1050'], ans: '1050 seats' },
  b: { label: '1(b)', kind: 'G', want: 't',
    ask: `(b) A car bought for $32 000 ${K1('loses 15% of its value each year')}. What is it ${K2('worth 6 years after')} it was bought?`,
    c1: '“loses 15%” each year: the same <b>percent</b>, so multiply by ' + T('1-0.15') + '.', par: 'r=0.85', c2: '“worth … 6 years after”: <b>one value</b>.',
    f: 't_n=t_1r^{\\,n-1}', extra: `Count: $32 000 is the value at <b>time 0</b>, so it is ${T('t_1')}, and 6 years later is ${T('t_7')}.`,
    xline: '\\text{time }0=t_1\\ \\Rightarrow\\ 6\\text{ years}=t_7', sub: ['t_1=32\\,000,\\ \\ r=0.85,\\ \\ n=7', 't_7=32\\,000(0.85)^6', '\\approx 12\\,068.78'], ans: '$12 068.78' },
  c: { label: '1(c)', kind: 'G', want: 'S',
    ask: `(c) A message is sent to 3 people in round 1. After that, everyone who just got it ${K1('sends it to 3 new people')}. How many people get it ${K2('in the first 8 rounds')}?`,
    c1: '“sends it to 3 new people”: each round <b>triples</b>, a fixed multiple.', par: 't_1=3,\\ r=3', c2: '“in the first 8 rounds”: a <b>total</b>.',
    f: 'S_n=\\dfrac{t_1(r^n-1)}{r-1}', sub: ['t_1=3,\\ \\ r=3,\\ \\ n=8', 'S_8=\\dfrac{3(3^8-1)}{3-1}', '=\\dfrac{3(6560)}{2}=9840'], ans: '9840 people' },
  d: { label: '1(d)', kind: 'G', want: 'I',
    ask: `(d) A pendulum’s first swing is 50 cm, and each swing is ${K1('90% as long as the one before')}. What ${K2('total distance')} does it travel if it ${K2('swings forever')}?`,
    c1: '“90% as long”: the same <b>percent</b> each swing.', par: 'r=0.9', c2: '“total distance … forever”: a total that <b>never stops</b>.',
    f: 'S_\\infty=\\dfrac{t_1}{1-r}', extra: `${T('S_\\infty')} only exists if ${T('-1<r<1')}: ${T('r=0.9')} ✓, so the series <b>converges</b>.`,
    xline: '-1<0.9<1\\ \\checkmark', sub: ['t_1=50,\\ \\ r=0.9', 'S_\\infty=\\dfrac{50}{1-0.9}', '=500'], ans: '500 cm' },
  sep: { sep: 'Review:' },
  int: { label: 'Simple interest', kind: 'A', want: 't',
    ask: `$4000 is invested at 3.25% ${K1('simple interest: $130 every year')}. What is the ${K2('value at the end of year 3')}?`,
    c1: '“simple interest”: the same <b>$130</b> is added every year.', par: 'd=130', c2: '“the value at the end of year 3”: <b>one value</b>.',
    f: 't_n=t_1+(n-1)d', extra: `Count: the value at the end of year 1 is ${T('t_1=4000+130=4130')}, so year 3 is ${T('t_3')}.`,
    xline: '\\text{end of year }1:\\ t_1=4130', sub: ['t_1=4130,\\ \\ d=130,\\ \\ n=3', 't_3=4130+2(130)', '=4390'], ans: '$4390' },
  bal: { label: 'Balloon', kind: 'G', want: 'S',
    ask: `A balloon rises 300 m in the first minute; each minute after that it rises ${K1('85% as far')} as the minute before. What is its ${K2('height after 10 minutes')}?`,
    c1: '“85% as far”: the same <b>percent</b> each minute.', par: 'r=0.85', c2: '“height after 10 minutes” adds up all 10 climbs: a <b>total</b>.',
    f: 'S_n=\\dfrac{t_1(r^n-1)}{r-1}', sub: ['t_1=300,\\ \\ r=0.85,\\ \\ n=10', 'S_{10}=\\dfrac{300(0.85^{10}-1)}{0.85-1}', '\\approx 1606.25'], ans: 'about 1606.25 m' },
  inf: { label: 'Rows forever?', kind: 'A', want: 'I',
    ask: `What if the theatre in (a) kept going: each row with ${K1('3 more seats')}, and the rows ${K2('went on forever')}? How many seats altogether?`,
    c1: 'Still 3 more seats each row: the same <b>amount</b>.', par: 'd=3', c2: '“went on forever … altogether”: a total <b>forever</b>.',
    f: '\\text{no }S_\\infty', sub: ['S_{20}=1050', 'S_{100}=17\\,250', 'S_{1000}=1\\,522\\,500'], ans: 'no sum to infinity' }
};
const FC_NODES = {
  q1: { x: 310, y: 30, w: 500, h: 54, html: '<b>Clue 1: add or multiply?</b>the same amount, or the same percent / multiple', cls: 'bk-diamond' },
  ar: { x: 150, y: 112, w: 230, h: 54, html: `<b>Arithmetic</b>add ${T('d')} each time`, color: CA },
  ge: { x: 470, y: 112, w: 230, h: 54, html: `<b>Geometric</b>multiply by ${T('r')}`, color: CG },
  q2a: { x: 150, y: 196, w: 286, h: 54, html: '<b>Clue 2</b>one value, a total, or forever?', cls: 'bk-diamond' },
  q2g: { x: 470, y: 196, w: 286, h: 54, html: '<b>Clue 2</b>one value, a total, or forever?', cls: 'bk-diamond' },
  ta: { x: 52, y: 298, w: 96, h: 76, html: `<b>one value</b>${T('t_n')}`, color: CA },
  sa: { x: 152, y: 298, w: 96, h: 76, html: `<b>a total</b>${T('S_n')}`, color: CA },
  na: { x: 252, y: 298, w: 96, h: 76, html: '<b>forever</b>none!', color: GRAY, cls: 'bk-dashed' },
  tg: { x: 368, y: 298, w: 96, h: 76, html: `<b>one value</b>${T('t_n')}`, color: CG },
  sg: { x: 468, y: 298, w: 96, h: 76, html: `<b>a total</b>${T('S_n')}`, color: CG },
  ig: { x: 568, y: 298, w: 96, h: 76, html: `<b>forever</b>${T('S_\\infty')}`, color: CI }
};
const FC_EDGES = [
  { from: 'q1', to: 'ar', label: 'amount' }, { from: 'q1', to: 'ge', label: 'percent / ×' },
  { from: 'ar', to: 'q2a' }, { from: 'ge', to: 'q2g' },
  { from: 'q2a', to: 'ta' }, { from: 'q2a', to: 'sa' }, { from: 'q2a', to: 'na' },
  { from: 'q2g', to: 'tg' }, { from: 'q2g', to: 'sg' }, { from: 'q2g', to: 'ig' }
];
const hlClue = (ex, n) => { const a = ex.askEl; if (a) a.querySelectorAll('.u1l9-k' + n).forEach((s) => s.classList.add('on')); };
const whichFormula = {
  title: 'Which formula?',
  height: 412,
  minW: 940,
  capH: 84,
  choices: Object.keys(WF).map((k) => (WF[k].sep ? WF[k] : { v: k, label: WF[k].label })),
  ask: (k) => WF[k].ask,
  make(stage, k, ex) {
    const d = WF[k], isA = d.kind === 'A', W = ex.W;
    const F = new Flowchart(stage, { x: 0, y: 2, width: 620, height: 342, nodes: FC_NODES, edges: FC_EDGES, cls: 'u1l9-fc' });
    const leaf = (isA ? { t: 'ta', S: 'sa', I: 'na' } : { t: 'tg', S: 'sg', I: 'ig' })[d.want];
    const mid = isA ? 'ar' : 'ge', q2 = isA ? 'q2a' : 'q2g';
    const clue = add(stage, box(h('div', 'u1l9-clues'), 620, 64), 0, 346);
    const cl1 = hide(line(clue, `<b>Clue 1:</b> ${d.c1}`)), cl2 = hide(line(clue, `<b>Clue 2:</b> ${d.c2}`));
    const PX = 636, P = panel(stage, PX, 2, W - PX - 2, 408, 'Work', 'u1l9-work');
    const fl = hide(line(P, T(d.f), 'u1l9-wf ' + (isA ? 'u1l9-wfa' : d.want === 'I' ? 'u1l9-wfi' : 'u1l9-wfg')));
    const xl = d.xline ? hide(line(P, T(d.xline), 'u1l9-wx')) : null;
    const sl = d.sub.map((s) => hide(line(P, T(s), 'u1l9-ws')));
    const al = hide(line(P, `<b>${d.ans}</b>`, 'u1l9-wans'));
    const st = stamp(stage, d.want === 'I' && isA ? 'divergent' : '✓', { ok: d.want === 'I' && isA ? null : true, x: W - 70, y: 380, size: d.want === 'I' && isA ? 'sm' : undefined }); hide(st);
    const kindW = isA ? '<b class="u1l9-ca">arithmetic</b>' : '<b class="u1l9-cg">geometric</b>';
    const wantW = { t: `one value: use ${T('t_n')}`, S: `a total: use ${T('S_n')}`, I: isA ? `forever? An arithmetic total never settles: there is <b>no</b> ${T('S_\\infty')}` : `a total forever: use ${T('S_\\infty')}` }[d.want];
    const steps = [
      { cap: `<b>Clue 1: add or multiply?</b> ${d.c1}`, run: async (c) => { hlClue(ex, 1); await F.visit(c, 'q1'); await show(c, cl1); } },
      { cap: `So it’s ${kindW}, with ${T(cD(d.par))}.`, run: async (c) => { await F.go(c, 'q1', mid); await F.visit(c, mid); } },
      { cap: `<b>Clue 2: one value, a total, or forever?</b> ${d.c2}`, run: async (c) => { hlClue(ex, 2); await F.go(c, mid, q2); await F.visit(c, q2); await show(c, cl2); } },
      { cap: `${isA ? 'Arithmetic' : 'Geometric'}, ${wantW}.`, run: async (c) => { await F.go(c, q2, leaf); await F.visit(c, leaf); await show(c, fl); } }
    ];
    if (d.extra) steps.push({ cap: d.extra, run: (c) => show(c, xl) });
    if (d.want === 'I' && isA) {
      steps.push({ cap: `The running totals just keep growing: ${T('S_{20}=1050')}, ${T('S_{100}=17\\,250')}, ${T('S_{1000}=1\\,522\\,500')}, …`, run: async (c) => { for (const s of sl) await show(c, s); } });
      steps.push({ cap: `<b>No sum to infinity.</b> Only a geometric series with ${T('-1<r<1')} has one.`, run: async (c) => { await show(c, al); st.style.opacity = 1; await stampIn(c, st); } });
    } else {
      steps.push({ cap: `Substitute: ${T(d.sub[0])}.`, run: async (c) => { await show(c, sl[0]); await show(c, sl[1]); } });
      steps.push({ cap: `Work it out: <b>${d.ans}</b>.`, run: async (c) => { for (const s of sl.slice(2)) await show(c, s); await show(c, al); st.style.opacity = 1; await stampIn(c, st); } });
    }
    return steps;
  }
};

/* =============================== explainer: where does the count start? =============================== */
const CT = {
  car: { label: 'Example 1(b) check', r: 0.85, rT: '\\times0.85', money: true, axis: 'years after it was bought',
    ticks: [0, 1, 2, 3, 4, 5, 6].map((k) => ({ name: String(k), v: 32000 * 0.85 ** k })), t1At: 0, target: 6,
    caps: [`The car is worth $32 000 when it is bought: <b>time 0</b>. That first value is ${T(c1('t_1'))}.`,
      `Each year it keeps 85% of its value: multiply by ${T(cD('r=0.85'))}.`,
      `“6 years after” means <b>6 jumps</b> of ${T(cD('\\times0.85'))}. Counting from ${T(c1('t_1'))}, the jumps land on ${T('t_7')}, not ${T('t_6')}.`,
      `${T('t_7=t_1r^6=32\\,000(0.85)^6\\approx12\\,068.78')}: the car is worth about <b>$12 068.78</b>.`,
      `<b>Rule:</b> when ${T('t_1')} is the value at time 0, the value after ${T('n')} years is ${T('t_{n+1}=t_1r^{\\,n}')}.`],
    f: 't_7=32\\,000(0.85)^6\\approx12\\,068.78', rule: 't_{n+1}=t_1r^{\\,n}' },
  y1: { label: 'Start after year 1', r: 0.85, rT: '\\times0.85', money: true, axis: 'years after it was bought',
    ticks: [1, 2, 3, 4, 5, 6].map((k) => ({ name: String(k), v: 32000 * 0.85 ** k })), t1At: 0, target: 5,
    caps: [`Same car, told differently: it is worth $27 200 <b>after year 1</b>. This time that is ${T(c1('t_1'))}.`,
      `Each year after that: multiply by ${T(cD('r=0.85'))}.`,
      `Now the value after 6 years is ${T('t_6')}: only <b>5 jumps</b> from ${T(c1('t_1'))}.`,
      `${T('t_6=27\\,200(0.85)^5\\approx12\\,068.78')}: the <b>same answer</b>, counted a different way.`,
      `<b>Rule:</b> when ${T('t_1')} is the value after year 1, the value after ${T('n')} years is just ${T('t_n')}.`],
    f: 't_6=27\\,200(0.85)^5\\approx12\\,068.78', rule: 't_n=t_1r^{\\,n-1}' },
  town: { label: 'Example 7(a) check', r: 1.035, rT: '\\times1.035', money: false, axis: 'years from now',
    ticks: [0, 1, 2, 3, 4, 5].map((k) => ({ name: String(k), v: 8400 * 1.035 ** k })), t1At: 0, target: 5,
    caps: [`The town has 8400 people <b>now</b>: time 0, so ${T(c1('t_1=8400'))}.`,
      `Growing by 3.5% a year: multiply by ${T(cD('r=1+0.035=1.035'))}.`,
      `“5 years from now” is <b>5 jumps</b>, landing on ${T('t_6')}.`,
      `${T('t_6=8400(1.035)^5\\approx9977')} people.`,
      `<b>Rule:</b> from time 0, after ${T('n')} years is ${T('t_{n+1}=t_1r^{\\,n}')}.`],
    f: 't_6=8400(1.035)^5\\approx9977', rule: 't_{n+1}=t_1r^{\\,n}' },
  ball: { label: 'Example 8(a) check', r: 0.7, rT: '\\times0.7', money: false, axis: '', unit: ' m',
    ticks: [{ name: 'drop', v: 15 }].concat([1, 2, 3, 4].map((k) => ({ name: 'bounce ' + k, v: 15 * 0.7 ** k }))), t1At: 1, target: 4,
    caps: [`The ball is dropped from 15 m. That height is a <b>drop</b>, not a rise: it gets no term.`,
      `Each rise is 70% of the height it fell from: ${T(cD('\\times0.7'))} each bounce.`,
      `The first <b>rise</b> is ${T(c1('t_1=10.5'))}, so the 4th rise is ${T('t_4')}: 4 jumps from the 15 m drop.`,
      `${T('t_n=15(0.7)^n')}, so ${T('t_4=15(0.7)^4\\approx3.60')} m.`,
      `<b>Rule:</b> decide what ${T('t_1')} is <b>before</b> you count. Here ${T('t_1')} is the first rise.`],
    f: 't_4=15(0.7)^4\\approx3.60', rule: 't_n=15(0.7)^n' }
};
const countTerms = {
  title: 'Where does the count start?',
  height: 430,
  minW: 900,
  choices: Object.keys(CT).map((k) => ({ v: k, label: CT[k].label })),
  intro: 'Watch which value gets the name t<sub>1</sub>. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = CT[k], W = ex.W, n = d.ticks.length;
    const B = new Box(stage, { x: 0, y: 0 }, 'u1l9-ctbox', W, 430);
    const L = 70, R = W - 30, colW = (R - L) / n, X = (i) => L + (i + 0.5) * colW, base = 270, maxV = Math.max(...d.ticks.map((t) => t.v)), Hb = 160;
    const Yv = (v) => base - (v / maxV) * Hb;
    svgEl('line', { x1: L - 10, y1: base, x2: R, y2: base, stroke: '#6a7182', 'stroke-width': 2 }, B.svg);
    if (d.axis) lab(B, R, base + 34, d.axis, 'u1l9-axlab', 'w');
    const fmtV = (v) => (d.money ? '$' + hn(v, 2, true) : hn(v, d.unit ? 4 : 0) + (d.unit || ''));
    const bars = d.ticks.map((t, i) => {
      const g = svgEl('g', {}, B.svg); g.style.opacity = 0;
      svgEl('rect', { x: X(i) - 26, y: Yv(t.v), width: 52, height: base - Yv(t.v), rx: 4, fill: i < d.t1At ? '#c9ccd3' : d.money ? '#e9b949' : '#7fb3e6' }, g);
      g.vl = hide(lab(B, X(i), Yv(t.v) - 14, fmtV(t.v), 'u1l9-vlab'));
      return g;
    });
    const ticks = d.ticks.map((t, i) => lab(B, X(i), base + 14, t.name, 'u1l9-ticklab'));
    // hops above the bars
    const HY = 64;
    const hops = d.ticks.slice(1).map((t, i) => {
      const g = svgEl('g', {}, B.svg); g.style.opacity = 0;
      const x1 = X(i) + 8, x2 = X(i + 1) - 8;
      const p = svgEl('path', { class: 'bk-stroke', d: `M${x1} ${HY} Q ${(x1 + x2) / 2} ${HY - 30} ${x2} ${HY}`, fill: 'none', stroke: CD, 'stroke-width': 2.5 }, g);
      arrowHead(g, x2, HY, 0.5, 1, { color: CD, width: 2.5 });
      g.L = hide(lab(B, (x1 + x2) / 2, HY - 34, T(cD(d.rT)), 'u1l9-hoplab'));
      g.p = p; return g;
    });
    // jump counters between the tick labels
    const cnt = d.ticks.slice(1).map((t, i) => hide(lab(B, (X(i) + X(i + 1)) / 2, HY - 4, String(i + 1), 'u1l9-cnt')));
    // term names under the axis
    const TY = base + 66;
    const terms = d.ticks.map((t, i) => (i < d.t1At ? null : hide(add(B.html, box(h('div', 'u1l9-term' + (i === d.t1At ? ' u1l9-term1' : ''), T(`t_{${i - d.t1At + 1}}`)), 58, 38), X(i) - 29, TY))));
    if (d.t1At) lab(B, X(0), TY + 19, 'no term', 'u1l9-noterm');
    const fbox = hide(add(stage, h('div', 'u1l9-ctf', T(d.f)), W / 2, 398)); fbox.style.translate = '-50% -50%';
    const rule = hide(add(stage, h('div', 'u1l9-ctrule', T(d.rule)), W - 34, 398)); rule.style.translate = '-100% -50%';
    const tgt = d.target;
    return [
      { cap: d.caps[0], run: async (c) => {
        for (let i = 0; i <= d.t1At; i++) { bars[i].style.opacity = 1; await appear(c, bars[i], 300); bars[i].vl.style.opacity = 1; }
        if (terms[d.t1At]) await pop(c, terms[d.t1At]);
      } },
      { cap: d.caps[1], run: async (c) => {
        for (let i = d.t1At + 1; i < n; i++) {
          const hp = hops[i - 1]; hp.style.opacity = 1; await drawIn(hp.p, 240, c); hp.L.style.opacity = 1;
          bars[i].style.opacity = 1; await appear(c, bars[i], 240); bars[i].vl.style.opacity = 1; await pop(c, terms[i], 220);
        }
        if (d.t1At) { hops[0].style.opacity = 1; hops[0].L.style.opacity = 1; }
      } },
      { cap: d.caps[2], run: async (c) => {
        for (let i = 0; i < tgt; i++) { await pop(c, cnt[i], 200); cnt[i].style.opacity = 1; }
        terms[tgt].classList.add('u1l9-hit'); await pulse(c, terms[tgt], 1.15);
      } },
      { cap: d.caps[3], run: (c) => show(c, fbox) },
      { cap: d.caps[4], run: (c) => show(c, rule) }
    ];
  }
};

/* =============================== explainer: two known terms → count the jumps =============================== */
const TT = {
  ex2: { label: 'Example 2 check', kind: 'A', M: 12, p: 5, a: 17, q: 12, b: 45,
    more: [[`S_{30}=\\dfrac{30}{2}\\left[2(1)+29(4)\\right]=1770`, `Then ${T('S_{30}=15(118)=1770')}.`], [`4n-3=205\\Rightarrow n=52`, `Is 205 a term? ${T('4n-3=205')} gives ${T('n=52')}, a whole number: <b>yes</b>, ${T('205=t_{52}')}.`]] },
  ex3: { label: 'Example 3 check', kind: 'G', M: 8, p: 2, a: -12, q: 5, b: 324,
    more: [[`S_8=\\dfrac{4\\left[(-3)^8-1\\right]}{-3-1}=-6560`, `Then ${T('S_8=\\dfrac{4(6560)}{-4}=-6560')}.`]] },
  rev: { label: T('t_6=41,\\ t_{15}=95'), kind: 'A', M: 15, p: 6, a: 41, q: 15, b: 95,
    more: [[`t_{40}=6(40)+5=245`, `And ${T('t_{40}=6(40)+5=245')}.`]] },
  am: { label: '3 means: 5 … 33', kind: 'A', M: 5, p: 1, a: 5, q: 5, b: 33, means: 3 },
  gm: { label: '3 geometric means: 2 … 162', kind: 'G', M: 5, p: 1, a: 2, q: 5, b: 162, means: 3, pm: true }
};
const twoTerms = {
  title: 'Two terms known: count the jumps',
  height: 440,
  minW: 900,
  capH: 84,
  choices: Object.keys(TT).map((k) => ({ v: k, label: TT[k].label })),
  intro: 'Line the terms up and count the jumps. Press <b>Next</b>.',
  make(stage, key, ex) {
    const d = TT[key], W = ex.W, M = d.M, isA = d.kind === 'A', J = d.q - d.p;
    let dv, rv, t1, ratio, rk;
    if (isA) { dv = (d.b - d.a) / J; t1 = d.a - (d.p - 1) * dv; }
    else { ratio = d.b / d.a; rk = Math.round(Math.abs(ratio) ** (1 / J)) * (ratio < 0 ? -1 : 1); rv = rk; t1 = d.a / rv ** (d.p - 1); }
    const val = (i, r = rv) => (isA ? t1 + (i - 1) * dv : t1 * r ** (i - 1));
    const B = new Box(stage, { x: 0, y: 0 }, 'u1l9-ttbox', W, 230);
    const bw = Math.min(76, (W - 30) / M - 10), gap = (W - 30 - M * bw) / (M - 1), bx = (i) => 15 + (i - 1) * (bw + gap), cx = (i) => bx(i) + bw / 2;
    const rows = d.pm ? [58, 184] : [86];
    const mk = (row, ry) => {
      const bs = {};
      for (let i = 1; i <= M; i++) {
        const known = i === d.p || i === d.q, b = add(B.html, box(h('div', 'u1l9-tt' + (known ? ' u1l9-ttk' : ''), known ? T(tn(i === d.p ? d.a : d.b)) : ''), bw, 46), bx(i), ry);
        b.n = lab(B, cx(i), ry + 60, T(`t_{${i}}`), 'u1l9-ttn'); if (row) b.n.style.opacity = 0;
        bs[i] = b;
      }
      return bs;
    };
    const R1 = mk(0, rows[0]), R2 = d.pm ? mk(1, rows[1]) : null;
    if (R2) { Object.values(R2).forEach(hide); }
    const hopRow = (ry, i, txt, back) => {
      const g = svgEl('g', {}, B.svg); g.style.opacity = 0;
      const x1 = cx(i) + (back ? -6 : 6), x2 = cx(back ? i - 1 : i + 1) + (back ? 6 : -6), yy = ry - 2, bend = -26;
      const p = svgEl('path', { class: 'bk-stroke', d: `M${x1} ${yy} Q ${(x1 + x2) / 2} ${yy + bend} ${x2} ${yy}`, fill: 'none', stroke: back ? C1 : CD, 'stroke-width': 2.5 }, g);
      arrowHead(g, x2, yy, back ? -0.4 : 0.4, 1, { color: back ? C1 : CD, width: 2.5 });
      g.L = hide(lab(B, (x1 + x2) / 2, yy + bend * 1.25, txt, 'u1l9-hoplab' + (back ? ' u1l9-hopback' : '')));
      g.p = p; return g;
    };
    const fwd = [], bwd = [];
    for (let i = d.p; i < d.q; i++) fwd.push(hopRow(rows[0], i, `<span class="u1l9-jn">${i - d.p + 1}</span>`));
    for (let i = d.p; i > 1; i--) bwd.push(hopRow(rows[0], i, T(isA ? cD((dv > 0 ? '-' : '+') + tn(Math.abs(dv))) : cD('\\div(' + tn(rv) + ')')), true));
    const neg = d.pm ? Array.from({ length: M - 1 }, (_, j) => hopRow(rows[1], j + 1, T(cD('\\times(-3)')))) : [];
    // algebra
    const P = panel(stage, 0, 242, W, 196, '', 'u1l9-alg');
    const al = (s) => hide(line(P, T(s), 'u1l9-algl'));
    const rT = (r) => (r < 0 ? `(${tn(r)})` : tn(r));
    const tp = `t_{${d.p}}`, tq = `t_{${d.q}}`;
    const steps = [];
    steps.push({ cap: d.means ? `${d.means} ${isA ? 'arithmetic' : 'geometric'} means between ${T(tn(d.a))} and ${T(tn(d.b))}: that makes ${T(String(M))} terms in a row.`
      : `Write the terms in a row. We know ${T(`${tp}=${tn(d.a)}`)} and ${T(`${tq}=${tn(d.b)}`)}.`, run: (c) => pop(c, R1[d.q]) });
    steps.push({ cap: d.means ? `${d.means} means make <b>${J} jumps</b> (one more than the number of means).` : `From ${T(tp)} to ${T(tq)} is ${T(`${d.q}-${d.p}=${J}`)} <b>jumps</b>.`,
      run: async (c) => { for (const g of fwd) { g.style.opacity = 1; await drawIn(g.p, 160, c); g.L.style.opacity = 1; } } });
    const relabel = (txt) => fwd.forEach((g) => { g.L.innerHTML = txt; });
    if (isA) {
      const eq = `${J}d=${tn(d.b)}-${rT(d.a)}=${tn(d.b - d.a)}\\ \\Rightarrow\\ ${cD('d=' + tn(dv))}`;
      const l1 = al(eq);
      steps.push({ cap: `Each jump adds ${T(cD('d'))}: ${T(`${J}d=${tn(d.b)}-${rT(d.a)}=${tn(d.b - d.a)}`)}, so ${T(cD('d=' + tn(dv)))}.`,
        run: async (c) => { await show(c, l1); relabel(T(cD((dv < 0 ? '' : '+') + tn(dv)))); } });
    } else {
      const eq = `${tn(d.a)}r^{${J}}=${tn(d.b)}\\ \\Rightarrow\\ r^{${J}}=${tn(ratio)}\\ \\Rightarrow\\ ${cD('r=' + (d.pm ? '\\pm' + tn(Math.abs(rv)) : tn(rv)))}`;
      const l1 = al(eq);
      steps.push({ cap: `Each jump multiplies by ${T(cD('r'))}: ${T(`${tn(d.a)}r^{${J}}=${tn(d.b)}`)}, so ${T(`r^{${J}}=${tn(ratio)}`)} and ${d.pm ? `${T(cD('r=3'))} <b>or</b> ${T(cD('r=-3'))} (an even power hides the sign).` : T(cD('r=' + tn(rv))) + '.'}`,
        run: async (c) => { await show(c, l1); relabel(T(cD('\\times' + rT(rv)))); } });
    }
    if (d.p > 1) {
      const back = d.p - 1;
      const eq = isA ? `${c1('t_1')}=${tn(d.a)}-${back}(${tn(dv)})=${c1(tn(t1))}` : `${c1('t_1')}=${tn(d.a)}\\div${back > 1 ? rT(rv) + '^{' + back + '}' : rT(rv)}=${c1(tn(t1))}`;
      const l2 = al(eq);
      steps.push({ cap: `Step back ${back} jump${back > 1 ? 's' : ''} from ${T(tp)} to ${T(c1('t_1'))}: ${T(eq)}.`,
        run: async (c) => { for (const g of bwd) { g.style.opacity = 1; await drawIn(g.p, 200, c); g.L.style.opacity = 1; } R1[1].innerHTML = T(tn(t1)); R1[1].classList.add('u1l9-tt1'); await pop(c, R1[1]); await show(c, l2); } });
    }
    const gen = isA ? `t_n=${tn(t1)}+(n-1)(${tn(dv)})=${tn(dv)}n${t1 - dv < 0 ? '-' : '+'}${tn(Math.abs(t1 - dv))}` : `t_n=${tn(t1)}(${tn(rv)})^{n-1}`;
    const fillRow = async (c, Rw, r) => { for (let i = 1; i <= M; i++) if (!Rw[i].innerHTML || Rw === R2) { Rw[i].innerHTML = T(tn(val(i, r))); Rw[i].classList.add('u1l9-ttf'); } for (let i = 1; i <= M; i++) if (Rw[i].classList.contains('u1l9-ttf')) await pop(c, Rw[i], 160); };
    if (d.means) {
      if (d.pm) {
        const l3 = al(`r=3:\\ 6,\\ 18,\\ 54\\qquad r=-3:\\ -6,\\ 18,\\ -54`);
        steps.push({ cap: `${T(cD('r=3'))}: the means are ${T('6,\\ 18,\\ 54')}. ${T(cD('r=-3'))}: the means are ${T('-6,\\ 18,\\ -54')}. <b>Both</b> work.`,
          run: async (c) => {
            await fillRow(c, R1, 3);
            Object.values(R2).forEach((b) => { b.style.opacity = 1; });
            for (const g of neg) { g.style.opacity = 1; await drawIn(g.p, 160, c); g.L.style.opacity = 1; }
            await fillRow(c, R2, -3); await show(c, l3);
          } });
      } else {
        const ms = []; for (let i = 2; i < M; i++) ms.push(tn(val(i)));
        const l3 = al(`\\text{means: }${ms.join(',\\ ')}`);
        steps.push({ cap: `The means are ${T(ms.join(',\\ '))}.`, run: async (c) => { await fillRow(c, R1); await show(c, l3); } });
      }
    } else {
      const l3 = al(gen);
      steps.push({ cap: `General term: ${T(gen)}. Every term now fills in.`, run: async (c) => { await fillRow(c, R1); await show(c, l3); } });
    }
    (d.more || []).forEach(([s, cap]) => { const l = al(s); steps.push({ cap, run: (c) => show(c, l) }); });
    return steps;
  }
};

/* =============================== explainer: three terms in a row =============================== */
const TR = {
  a: { label: 'Example 4(a) check', kind: 'A', ex: ['k+4', '3k', '4k+2'], v: 'k' },
  b: { label: 'Example 4(b) check', kind: 'G', ex: ['x-2', 'x+2', 'x+10'], v: 'x' },
  m: { label: 'Between 5 and 20', kind: 'M', ex: ['5', 'b', '20'], v: 'b' }
};
const threeTerms = {
  title: 'Three terms in a row',
  height: 430,
  minW: 900,
  capH: 84,
  choices: Object.keys(TR).map((k) => ({ v: k, label: TR[k].label })),
  intro: 'Equal differences (arithmetic) or equal ratios (geometric). Press <b>Next</b>.',
  make(stage, key, ex) {
    const d = TR[key], W = ex.W, LW = 560;
    const B = new Box(stage, { x: 0, y: 0 }, 'u1l9-trbox', LW, 150);
    const bx = [30, 210, 390], bw = 140, BY = 70, cx = (i) => bx[i] + bw / 2;
    const boxes = d.ex.map((s, i) => add(B.html, box(h('div', 'u1l9-trb', T(s)), bw, 54), bx[i], BY));
    const names = ['a', 'b', 'c'].map((s, i) => lab(B, cx(i), BY + 70, T(s), 'u1l9-ttn'));
    const hop = (i, html) => {
      const g = svgEl('g', {}, B.svg); g.style.opacity = 0; const x1 = cx(i) + 10, x2 = cx(i + 1) - 10;
      g.p = svgEl('path', { class: 'bk-stroke', d: `M${x1} ${BY - 2} Q ${(x1 + x2) / 2} ${BY - 34} ${x2} ${BY - 2}`, fill: 'none', stroke: CD, 'stroke-width': 2.5 }, g);
      arrowHead(g, x2, BY - 2, 0.5, 1, { color: CD, width: 2.5 });
      g.L = hide(lab(B, (x1 + x2) / 2, BY - 40, html, 'u1l9-hoplab u1l9-trhop')); return g;
    };
    const P = panel(stage, 0, 168, LW, 260, '', 'u1l9-alg u1l9-alg1');
    const al = (s, cls = '') => hide(line(P, T(s), 'u1l9-algl ' + cls));
    const RX = LW + 20, RW = W - RX - 2;
    const pic = panel(stage, RX, 0, RW, 428, '', 'u1l9-pic');
    const steps = [];
    const flip = async (c, vals) => { for (let i = 0; i < 3; i++) { boxes[i].innerHTML = T(vals[i]); boxes[i].classList.add('u1l9-trv'); await pop(c, boxes[i], 220); } };
    const relab = (hs, html) => hs.forEach((g) => { g.L.innerHTML = html; });
    // number line picture (arithmetic)
    const nline = (vals, min, max, step, labelStep, y, title) => {
      const t = hide(add(pic, box(h('div', 'u1l9-pict', title), RW - 20), 10, y));
      const N = new NumberLine(pic, { x: 10, y: y + 40, width: RW - 20, height: 120, min, max, step, labelStep });
      N.el.style.opacity = 0; return { N, t, vals };
    };
    const playLine = async (c, o, color) => {
      o.t.style.opacity = 1; o.N.el.style.opacity = 1; await appear(c, o.N.el, 300);
      const pt = (v) => { const g = o.N.point(v, { color }); if (!Number.isInteger(v)) o.N.mark(v, T(tn(v)), { pos: 's', cls: 'u1l9-nlmark' }); return g; };
      await pop(c, pt(o.vals[0]));
      for (let i = 1; i < 3; i++) { await o.N.hop(c, o.vals[i - 1], o.vals[i], { label: T(cD('+' + tn(o.vals[i] - o.vals[i - 1]))), color: CD }); await pop(c, pt(o.vals[i])); }
    };
    // area picture (geometric): b² = ac as a square and a rectangle with the same area
    const area = (a, b, cc, y, title) => {
      const g = h('div', 'u1l9-area'); g.style.opacity = 0; add(pic, box(g, RW - 20, 196), 10, y);
      const s = 200 / Math.max(b, cc), sq = b * s, rw = cc * s, rh = a * s;
      g.innerHTML = `<div class="u1l9-pict">${title}</div>`;
      const sqE = add(g, box(h('div', 'u1l9-sq', `<span class="u1l9-ar">${T(`${tn(b)}^2=${tn(b * b)}`)}</span>`), sq, sq), 10, 34);
      const rE = add(g, box(h('div', 'u1l9-rect', `<span class="u1l9-ar">${T(`${tn(a)}\\times${tn(cc)}=${tn(a * cc)}`)}</span>`), rw, rh), sq + 40, 34 + sq - rh);
      return { g, sqE, rE };
    };
    if (d.kind === 'A') {
      const hs = [hop(0, T(cD('3k-(k+4)'))), hop(1, T(cD('(4k+2)-3k')))];
      const ls = [al('3k-(k+4)=(4k+2)-3k'), al('2k-4=k+2'), al('k=6', 'u1l9-big'), al('\\text{Terms: }10,\\ 18,\\ 26\\quad(d=8)')];
      const NL = nline([10, 18, 26], 8, 28, 2, 2, 30, 'Equal hops on a number line');
      steps.push({ cap: `Arithmetic: the jump from ${T('a')} to ${T('b')} must equal the jump from ${T('b')} to ${T('c')}. Each jump is a <b>difference</b>.`, run: async (c) => { for (const g of hs) { g.style.opacity = 1; await drawIn(g.p, 300, c); g.L.style.opacity = 1; } } });
      steps.push({ cap: `Set the two differences equal: ${T('3k-(k+4)=(4k+2)-3k')}.`, run: (c) => show(c, ls[0]) });
      steps.push({ cap: `Simplify each side: ${T('2k-4=k+2')}, so ${T('k=6')}.`, run: async (c) => { await show(c, ls[1]); await show(c, ls[2]); } });
      steps.push({ cap: `Substitute ${T('k=6')}: ${T('6+4=10')}, ${T('3(6)=18')}, ${T('4(6)+2=26')}. Both jumps are ${T(cD('+8'))} ✓`, run: async (c) => { await flip(c, ['10', '18', '26']); relab(hs, T(cD('+8'))); await show(c, ls[3]); } });
      steps.push({ cap: `On a number line: equal hops of ${T(cD('8'))}. The middle term is halfway between the other two.`, run: (c) => playLine(c, NL, CA) });
    } else if (d.kind === 'G') {
      const hs = [hop(0, T(cD('\\times\\tfrac{x+2}{x-2}'))), hop(1, T(cD('\\times\\tfrac{x+10}{x+2}')))];
      const ls = [al('\\dfrac{x+2}{x-2}=\\dfrac{x+10}{x+2}'), al('(x+2)^2=(x-2)(x+10)'), al('x^2+4x+4=x^2+8x-20'), al('24=4x\\ \\Rightarrow\\ x=6', 'u1l9-big'), al('\\text{Terms: }4,\\ 8,\\ 16\\quad(r=2)')];
      const AR = area(4, 8, 16, 30, `${T('b^2=ac')}: same area`);
      steps.push({ cap: `Geometric: each jump <b>multiplies</b> by the same ${T(cD('r'))}, so the two <b>ratios</b> are equal: ${T('\\dfrac{b}{a}=\\dfrac{c}{b}')}.`, run: async (c) => { for (const g of hs) { g.style.opacity = 1; await drawIn(g.p, 300, c); g.L.style.opacity = 1; } await show(c, ls[0]); } });
      steps.push({ cap: `Cross-multiply: ${T('b^2=ac')}, so ${T('(x+2)^2=(x-2)(x+10)')}.`, run: (c) => show(c, ls[1]) });
      steps.push({ cap: `Expand both sides: ${T('x^2+4x+4=x^2+8x-20')}. The ${T('x^2')} terms cancel: ${T('24=4x')}, so ${T('x=6')}.`, run: async (c) => { await show(c, ls[2]); await show(c, ls[3]); } });
      steps.push({ cap: `Substitute ${T('x=6')}: the terms are ${T('4,\\ 8,\\ 16')}. Both jumps are ${T(cD('\\times2'))} ✓`, run: async (c) => { await flip(c, ['4', '8', '16']); relab(hs, T(cD('\\times2'))); await show(c, ls[4]); } });
      steps.push({ cap: `Why ${T('b^2=ac')}? An ${T('8\\times8')} square and a ${T('4\\times16')} rectangle have the <b>same area</b>, 64.`, run: async (c) => { AR.g.style.opacity = 1; await appear(c, AR.g, 200); await pop(c, AR.sqE); await pop(c, AR.rE); } });
    } else {
      const hs = [hop(0, ''), hop(1, '')];
      const ls = [al('\\text{Arithmetic: }b-5=20-b\\ \\Rightarrow\\ 2b=25\\ \\Rightarrow\\ b=12.5'), al('\\text{Geometric: }b^2=5(20)=100\\ \\Rightarrow\\ b=\\pm10')];
      const NL = nline([5, 12.5, 20], 0, 25, 2.5, 5, 4, 'Arithmetic: equal hops');
      const AR = area(5, 10, 20, 196, `Geometric: ${T('10^2=5\\times20')}`);
      steps.push({ cap: `Find ${T('b')} so that ${T('5,\\ b,\\ 20')} are three terms in a row. Two answers, depending on the kind of sequence.`, run: async (c) => { for (const g of hs) { g.style.opacity = 1; await drawIn(g.p, 300, c); } } });
      steps.push({ cap: `<b class="u1l9-ca">Arithmetic:</b> equal differences, ${T('b-5=20-b')}, so ${T('b=12.5')}: halfway between 5 and 20.`, run: async (c) => { relab(hs, T(cD('+7.5'))); hs.forEach((g) => (g.L.style.opacity = 1)); await show(c, ls[0]); await playLine(c, NL, CA); } });
      steps.push({ cap: `<b class="u1l9-cg">Geometric:</b> equal ratios, ${T('b^2=5(20)=100')}, so ${T('b=10')} or ${T('b=-10')} (${T('r=2')} or ${T('r=-2')}).`, run: async (c) => { relab(hs, T(cD('\\times2'))); await show(c, ls[1]); AR.g.style.opacity = 1; await appear(c, AR.g, 200); await pop(c, AR.sqE); await pop(c, AR.rE); } });
      steps.push({ cap: `So the <b>arithmetic</b> middle is ${T('12.5')} and the <b>geometric</b> middle is ${T('\\pm10')}. Read the question to know which one it wants.`, run: async (c) => { await flip(c, ['5', '12.5\\ \\text{or}\\ \\pm10', '20']); } });
    }
    return steps;
  }
};

/* =============================== explainer: from S_n to t_n =============================== */
const ST = {
  ex5: { label: 'Example 5 check', S: (n) => 2 * n * n + 3 * n, ST: '2n^2+3n', check: 10, kind: 'A' },
  mc: { label: T('S_n=3n^2-n'), S: (n) => 3 * n * n - n, ST: '3n^2-n', check: 10, kind: 'A' },
  geo: { label: T('S_n=2^n-1'), S: (n) => 2 ** n - 1, ST: '2^n-1', check: 10, kind: 'G' }
};
const sumToTerm = {
  title: 'From the running total back to the terms',
  height: 440,
  minW: 900,
  choices: Object.keys(ST).map((k) => ({ v: k, label: ST[k].label })),
  intro: (k) => `${T('S_n=' + ST[k].ST)}: find the terms. Press <b>Next</b>.`,
  ask: false,
  make(stage, key, ex) {
    const d = ST[key], W = ex.W, N = 5, S = Array.from({ length: N + 1 }, (_, n) => (n ? d.S(n) : 0)), t = S.map((v, n) => (n ? v - S[n - 1] : 0));
    const CW = 520, B = new Box(stage, { x: 0, y: 0 }, 'u1l9-stbox', CW, 440);
    const base = 396, top = 40, maxV = S[N] * 1.1, Y = (v) => base - (v / maxV) * (base - top), X = (n) => 60 + (n - 0.5) * ((CW - 80) / N), bw = 58;
    svgEl('line', { x1: 40, y1: base, x2: CW - 10, y2: base, stroke: '#6a7182', 'stroke-width': 2 }, B.svg);
    for (let n = 1; n <= N; n++) lab(B, X(n), base + 16, T(`S_{${n}}`), 'u1l9-nlab');
    const bars = [];
    for (let n = 1; n <= N; n++) {
      const g = svgEl('g', {}, B.svg); g.style.opacity = 0;
      g.lo = svgEl('rect', { x: X(n) - bw / 2, y: Y(S[n - 1]), width: bw, height: base - Y(S[n - 1]), fill: '#d9c3cc' }, g);
      g.hi = svgEl('rect', { x: X(n) - bw / 2, y: Y(S[n]), width: bw, height: Y(S[n - 1]) - Y(S[n]), fill: '#d9c3cc' }, g);
      g.v = hide(lab(B, X(n), Y(S[n]) - 14, T(tn(S[n])), 'u1l9-vlab'));
      g.tl = hide(lab(B, X(n), (Y(S[n]) + Y(S[n - 1])) / 2, T(cD('t_' + n)), 'u1l9-tseg'));
      if (n > 1) { g.dash = svgEl('line', { x1: X(n - 1) - bw / 2, y1: Y(S[n - 1]), x2: X(n) + bw / 2, y2: Y(S[n - 1]), stroke: '#6a7182', 'stroke-width': 1.6, 'stroke-dasharray': '5 4' }, B.svg); g.dash.style.opacity = 0; }
      bars.push(g);
    }
    const PX = CW + 20, P = panel(stage, PX, 0, W - PX - 2, 438, '', 'u1l9-stp');
    const tbl = h('table', 'u1l9-sttab'); P.appendChild(tbl);
    tbl.innerHTML = `<tr><th>${T('n')}</th><th>${T('S_n')}</th><th>${T('t_n=S_n-S_{n-1}')}</th></tr>` +
      Array.from({ length: N }, (_, i) => `<tr><td>${T(String(i + 1))}</td><td class="u1l9-sv">${T(tn(S[i + 1]))}</td><td class="u1l9-tv">${T(i ? `${tn(S[i + 1])}-${tn(S[i])}=${cD(tn(t[i + 1]))}` : `${cD(tn(t[1]))}`)}</td></tr>`).join('');
    const svC = [...tbl.querySelectorAll('.u1l9-sv')], tvC = [...tbl.querySelectorAll('.u1l9-tv')];
    svC.concat(tvC).forEach(hide);
    const diffs = t.slice(2).map((v, i) => v - t[i + 1]), ratios = t.slice(2).map((v, i) => v / t[i + 1]);
    const isA = d.kind === 'A', dv = diffs[0], rv = ratios[0];
    const gen = isA ? `t_n=${tn(t[1])}+(n-1)(${tn(dv)})=${tn(dv)}n${t[1] - dv < 0 ? '-' : '+'}${tn(Math.abs(t[1] - dv))}` : `t_n=${tn(t[1])}(${tn(rv)})^{n-1}=2^{n-1}`;
    const k = d.check, Sk = d.S(k), Sk1 = d.S(k - 1), tk = Sk - Sk1;
    const l1 = hide(line(P, T(isA ? `\\text{differences: }${diffs.map((v) => cD('{+' + tn(v) + '}')).join(',\\ ')}` : `\\text{ratios: }${ratios.map((v) => cD('\\times' + tn(v))).join(',\\ ')}`), 'u1l9-algl'));
    const l2 = hide(line(P, T(gen), 'u1l9-algl'));
    const l3 = hide(line(P, T(`t_{${k}}=S_{${k}}-S_{${k - 1}}=${tn(Sk)}-${tn(Sk1)}=${tn(tk)}`), 'u1l9-algl'));
    const hot = (n) => { bars[n - 1].hi.setAttribute('fill', CD); bars[n - 1].hi.setAttribute('fill-opacity', 0.85); };
    return [
      { cap: `${T('S_n=' + d.ST)} gives the <b>running totals</b>: ${T(S.slice(1).map((v, i) => `S_{${i + 1}}=${tn(v)}`).join(',\\ '))}.`,
        run: async (c) => { for (let n = 1; n <= N; n++) { bars[n - 1].style.opacity = 1; await appear(c, bars[n - 1], 200); bars[n - 1].v.style.opacity = 1; svC[n - 1].style.opacity = 1; } } },
      { cap: `${T('S_1')} is the total of just one term, so ${T(`t_1=S_1=${cD(tn(t[1]))}`)}.`, run: async (c) => { hot(1); bars[0].tl.style.opacity = 1; await pop(c, bars[0].tl); await show(c, tvC[0]); } },
      { cap: `${T('S_2')} is ${T('S_1')} <b>plus one more term</b>. The part sticking up above ${T('S_1')} is ${T(`t_2=${tn(S[2])}-${tn(S[1])}=${cD(tn(t[2]))}`)}.`,
        run: async (c) => { bars[1].dash.style.opacity = 1; await appear(c, bars[1].dash, 250); hot(2); bars[1].tl.style.opacity = 1; await pop(c, bars[1].tl); await show(c, tvC[1]); } },
      { cap: `The same for each bar: ${T([3, 4, 5].map((n) => `t_${n}=${cD(tn(t[n]))}`).join(',\\ '))}.`,
        run: async (c) => { for (let n = 3; n <= N; n++) { bars[n - 1].dash.style.opacity = 1; await appear(c, bars[n - 1].dash, 160); hot(n); bars[n - 1].tl.style.opacity = 1; await pop(c, bars[n - 1].tl, 200); await show(c, tvC[n - 1]); } } },
      { cap: isA ? `The terms go up by ${T(cD(tn(dv)))} every time: <b>arithmetic</b> with ${T(cD('d=' + tn(dv)))}, so ${T(gen)}.` : `Each term is <b>double</b> the one before: <b>geometric</b> with ${T(cD('r=2'))}, so ${T(gen)}.`,
        run: async (c) => { await show(c, l1); await show(c, l2); } },
      { cap: `Any term works the same way: ${T(`t_{${k}}=S_{${k}}-S_{${k - 1}}=${tn(Sk)}-${tn(Sk1)}=${tn(tk)}`)}${isA ? ` ✓ (${T(`${tn(t[1])}+${k - 1}(${tn(dv)})=${tn(t[1] + (k - 1) * dv)}`)})` : ` ✓ (${T(`2^{${k - 1}}=${tn(2 ** (k - 1))}`)})`}.`,
        run: (c) => show(c, l3) }
    ];
  }
};

/* =============================== explainer: finding n =============================== */
const FN = {
  a: { label: 'Example 6(a) check', f: (n) => n * (n + 2), n0: 1, n1: 15, target: 255, mode: 'eq', ylab: 'S_n',
    alg: ['\\dfrac{n}{2}\\left[2(3)+(n-1)(2)\\right]=255', '\\dfrac{n}{2}(2n+4)=255', 'n(n+2)=255', 'n^2+2n-255=0', '(n+17)(n-15)=0', 'n=15\\quad(\\text{not }n=-17)'], groups: [[0], [1, 2, 3], [4, 5]],
    caps: [`Set the sum formula equal to 255: ${T('\\dfrac{n}{2}\\left[2(3)+(n-1)(2)\\right]=255')}.`,
      `Simplify: ${T('\\dfrac{n}{2}(2n+4)=n(n+2)')}, so ${T('n(n+2)=255')}. That is a <b>quadratic</b>: ${T('n^2+2n-255=0')}.`,
      `Factor: ${T('(n+17)(n-15)=0')}. ${T('n=-17')} is impossible for a number of terms, so ${T('n=15')}.`,
      `Check with the running totals ${T('S_1,\\ S_2,\\ \\dots')}: they reach <b>255</b> exactly at ${T('n=15')} ✓`] },
  b: { label: 'Example 6(b) check', f: (n) => 5 * (2 ** n - 1), n0: 1, n1: 10, target: 5115, mode: 'eq', ylab: 'S_n',
    alg: ['\\dfrac{5(2^n-1)}{2-1}=5115', '2^n-1=1023', '2^n=1024', '2^9=512,\\ \\ 2^{10}=1024', 'n=10'], groups: [[0], [1, 2], [3, 4]],
    caps: [`Set the geometric sum formula equal to 5115: ${T('\\dfrac{5(2^n-1)}{2-1}=5115')}.`,
      `Divide by 5 and add 1: ${T('2^n=1024')}. Now ${T('n')} is an <b>exponent</b>.`,
      `Try powers of 2: ${T('2^9=512')}, ${T('2^{10}=1024')} ✓. So ${T('n=10')}.`,
      `The running totals ${T('5,\\ 15,\\ 35,\\ \\dots')} hit 5115 exactly at ${T('n=10')} ✓`] },
  c: { label: 'Example 7(b) check', f: (n) => 8400 * 1.035 ** n, n0: 0, n1: 11, target: 12000, mode: 'over', base: 7000, ylab: '8400(1.035)^n',
    alg: ['8400(1.035)^n>12\\,000', 'n=10:\\ \\approx11\\,849', 'n=11:\\ \\approx12\\,264', '\\text{after 11 years}'],
    caps: [`We want the first ${T('n')} with ${T('8400(1.035)^n>12\\,000')}. ${T('n')} is an exponent, so make a <b>table</b>.`,
      `Grow the population one year at a time (each bar is ${T('\\times1.035')}).`,
      `${T('n=10')} gives about ${T('11\\,849')}: <b>not yet</b> over 12 000.`,
      `${T('n=11')} gives about ${T('12\\,264')}: the first one over. <b>After 11 years.</b>`] },
  d: { label: 'Balloon: under 30 m', f: (n) => 300 * 0.85 ** (n - 1), n0: 1, n1: 16, target: 30, mode: 'under', ylab: 't_n',
    alg: ['300(0.85)^{n-1}<30', '0.85^{n-1}<0.1', 'n=15:\\ \\approx30.83', 'n=16:\\ \\approx26.21', '\\text{the 16th minute}'],
    caps: [`The climb in minute ${T('n')} is ${T('t_n=300(0.85)^{n-1}')}. When is it first <b>under 30 m</b>? ${T('300(0.85)^{n-1}<30')}.`,
      `Make a table: each minute’s climb is ${T('\\times0.85')} of the one before.`,
      `${T('n=15')}: about ${T('30.83')} m, still not under 30.`,
      `${T('n=16')}: about ${T('26.21')} m, the first under 30. The <b>16th minute</b>.`] }
};
const findN = {
  title: 'Finding n',
  height: 440,
  minW: 900,
  capH: 84,
  choices: Object.keys(FN).map((k) => ({ v: k, label: FN[k].label })),
  intro: 'Solve for n, then check with a table of values. Press <b>Next</b>.',
  make(stage, key, ex) {
    const d = FN[key], W = ex.W, ns = []; for (let n = d.n0; n <= d.n1; n++) ns.push(n);
    const vals = ns.map(d.f), CW = 600, B = new Box(stage, { x: 0, y: 0 }, 'u1l9-fnbox', CW, 440);
    const L = 64, R = CW - 12, base = 392, top = 30, lo = d.base || 0, hi = Math.max(...vals, d.target) * 1.06;
    const Y = (v) => base - ((v - lo) / (hi - lo)) * (base - top), slot = (R - L) / ns.length, X = (i) => L + (i + 0.5) * slot, bw = Math.min(30, slot - 6);
    svgEl('line', { x1: L - 6, y1: base, x2: R, y2: base, stroke: '#6a7182', 'stroke-width': 2 }, B.svg);
    svgEl('line', { x1: L - 6, y1: top - 10, x2: L - 6, y2: base, stroke: '#6a7182', 'stroke-width': 2 }, B.svg);
    if (lo) { svgEl('path', { d: `M${L - 14} ${base - 18} l8 -6 l8 6`, fill: 'none', stroke: '#6a7182', 'stroke-width': 2 }, B.svg); lab(B, L - 12, base, T(tn(lo)), 'u1l9-nlab', 'w'); }
    ns.forEach((n, i) => { if (ns.length <= 12 || n % 2 === 1 || i === ns.length - 1) lab(B, X(i), base + 14, String(n), 'u1l9-nlab'); });
    lab(B, R, base + 34, T('n'), 'u1l9-nlab', 'w');
    lab(B, L + 4, top - 14, T(d.ylab), 'u1l9-ctitle', 'e');
    const ty = Y(d.target);
    svgEl('line', { x1: L - 6, y1: ty, x2: R, y2: ty, stroke: RED, 'stroke-width': 2.5, 'stroke-dasharray': '9 6' }, B.svg);
    lab(B, L - 10, ty, T(cR(tn(d.target))), 'u1l9-tgtlab', 'w');
    const bars = vals.map((v, i) => { const r = svgEl('rect', { x: X(i) - bw / 2, y: Y(v), width: bw, height: base - Y(v), rx: 3, fill: '#8fb6e4' }, B.svg); r.style.opacity = 0; return r; });
    const hitI = d.mode === 'eq' ? vals.findIndex((v) => Math.abs(v - d.target) < 1e-9) : d.mode === 'over' ? vals.findIndex((v) => v > d.target) : vals.findIndex((v) => v < d.target);
    const vlab = (i, left) => lab(B, left ? X(i) - bw / 2 - 2 : X(i), Y(vals[i]) - (left ? 2 : 14), T(tn(vals[i], d.mode === 'under' ? 2 : 0)), 'u1l9-vlab', left ? 'w' : 'c');
    const PX = CW + 20, P = panel(stage, PX, 0, W - PX - 2, 438, '', 'u1l9-alg u1l9-fnp');
    const ls = d.alg.map((s, i) => hide(line(P, T(s), 'u1l9-algl' + (i === d.alg.length - 1 ? ' u1l9-big' : ''))));
    const st = stamp(stage, '✓', { x: Math.min(CW - 30, X(hitI) + 6), y: Math.max(36, Math.min(Y(vals[hitI]), ty) - 50) }); hide(st);
    const growTo = async (c, upto, ms = 90) => { for (let i = 0; i <= upto; i++) if (bars[i].style.opacity !== '1') { bars[i].style.opacity = 1; await appear(c, bars[i], ms); } };
    const mark = (i, color) => { bars[i].setAttribute('fill', color); };
    if (d.mode === 'eq') {
      return [
        ...d.groups.map((gp, j) => ({ cap: d.caps[j], run: async (c) => { for (const i of gp) await show(c, ls[i]); } })),
        { cap: d.caps[3], run: async (c) => { await growTo(c, hitI); mark(hitI, CD); vlab(hitI); st.style.opacity = 1; await stampIn(c, st); } }
      ];
    }
    return [
      { cap: d.caps[0], run: (c) => show(c, ls[0]) },
      { cap: d.caps[1], run: async (c) => { if (ls.length > 4) await show(c, ls[1]); await growTo(c, hitI - 1); } },
      { cap: d.caps[2], run: async (c) => { mark(hitI - 1, '#b9bfc9'); vlab(hitI - 1, true); await show(c, ls[ls.length - 3]); } },
      { cap: d.caps[3], run: async (c) => { await growTo(c, hitI); mark(hitI, CD); vlab(hitI); await show(c, ls[ls.length - 2]); await show(c, ls[ls.length - 1]); st.style.opacity = 1; await stampIn(c, st); } }
    ];
  }
};

/* =============================== explainer: the bouncing ball =============================== */
const BB = {
  a: { label: 'Example 8(a) check', rises: 4, mode: 'a' },
  b: { label: 'Example 8(b) check', rises: 4, mode: 'b' },
  c: { label: 'Example 8(c) check', rises: 9, mode: 'c' }
};
const bounce = {
  title: 'The bouncing ball',
  height: 440,
  minW: 900,
  capH: 84,
  choices: Object.keys(BB).map((k) => ({ v: k, label: BB[k].label })),
  intro: 'Dropped from 15 m; each bounce rises to 70% of the fall. Press <b>Next</b>.',
  make(stage, key, ex) {
    const d = BB[key], W = ex.W, CW = 560, B = new Box(stage, { x: 0, y: 0 }, 'u1l9-bbbox', CW, 440);
    const ground = 392, Y = (m) => ground - m * 21.5, x0 = 70, hs = [15]; for (let k = 1; k <= d.rises; k++) hs.push(15 * 0.7 ** k);
    const wsc = d.mode === 'c' ? 92 : 122, widths = hs.slice(1).map((v) => wsc * Math.sqrt(v / 10.5));
    svgEl('rect', { x: 0, y: ground, width: CW, height: 48, fill: '#e8e2d6' }, B.svg);
    svgEl('line', { x1: 0, y1: ground, x2: CW, y2: ground, stroke: '#6a7182', 'stroke-width': 2.5 }, B.svg);
    for (let m = 0; m <= 15; m += 5) { svgEl('line', { x1: 30, y1: Y(m), x2: 38, y2: Y(m), stroke: '#6a7182', 'stroke-width': 1.6 }, B.svg); lab(B, 26, Y(m), String(m), 'u1l9-rulab', 'w'); }
    svgEl('line', { x1: 34, y1: Y(15), x2: 34, y2: ground, stroke: '#6a7182', 'stroke-width': 1.6 }, B.svg);
    lab(B, 34, Y(15) - 18, 'm', 'u1l9-rulab');
    // the path: a drop, then for each bounce a rise half (green) and a fall half (blue)
    const segs = [], hits = [x0];
    segs.push({ kind: 'down', pts: [[x0, Y(15)], [x0, ground]], h: 15 });
    let xs = x0;
    widths.forEach((w, i) => {
      const hgt = hs[i + 1], up = [], dn = [];
      for (let j = 0; j <= 14; j++) { const t = j / 14, x = xs + t * w / 2, yy = ground - (ground - Y(hgt)) * (1 - (1 - t) ** 2); up.push([x, yy]); }
      for (let j = 0; j <= 14; j++) { const t = j / 14, x = xs + w / 2 + t * w / 2, yy = Y(hgt) + (ground - Y(hgt)) * t * t; dn.push([x, yy]); }
      segs.push({ kind: 'up', pts: up, h: hgt, k: i + 1 }); segs.push({ kind: 'down', pts: dn, h: hgt, k: i + 1 });
      xs += w; hits.push(xs);
    });
    const pd = (pts) => 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L');
    const segEls = segs.map((s) => { const p = svgEl('path', { class: 'bk-stroke', d: pd(s.pts), fill: 'none', stroke: '#9aa0ab', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, B.svg); p.style.opacity = 0; return p; });
    const dropLab = hide(lab(B, x0 - 12, Y(7.5), T('15'), 'u1l9-hgt u1l9-hdown', 'w'));
    const peakLab = hs.slice(1).map((v, i) => { const s = segs[1 + 2 * i], pk = s.pts[s.pts.length - 1]; return hide(lab(B, pk[0], pk[1] - 16, i < 4 ? T(tn(v)) : '', 'u1l9-hgt')); });
    const hitLab = hits.map((x, i) => hide(lab(B, x, ground + 20, String(i + 1), 'u1l9-hitn' + (d.mode === 'c' ? ' u1l9-none' : ''))));
    const ball = svgEl('circle', { cx: x0, cy: Y(15) - 11, r: 11, fill: '#e2574c', stroke: '#9b2c24', 'stroke-width': 2 }, B.svg);
    const roll = async (c, from, to, ms) => { // move the ball along segments [from, to)
      for (let i = from; i < to; i++) {
        const s = segs[i], el = segEls[i]; el.style.opacity = 1;
        if (!c.fast) await drawIn(el, ms, c);
        const p = s.pts[s.pts.length - 1]; ball.setAttribute('cx', p[0]); ball.setAttribute('cy', p[1] - 11);
        if (s.kind === 'down') { const hi = s.k == null ? 0 : s.k; hitLab[hi].style.opacity = 1; }
        else if (peakLab[s.k - 1]) peakLab[s.k - 1].style.opacity = 1;
      }
      if (from === 0) dropLab.style.opacity = 1;
    };
    const colour = () => segs.forEach((s, i) => { segEls[i].setAttribute('stroke', s.kind === 'up' ? CG : CA); });
    const PX = CW + 16, P = panel(stage, PX, 0, W - PX - 2, 438, '', 'u1l9-alg u1l9-bbp');
    const L = (s, cls = '') => hide(line(P, s, 'u1l9-algl ' + cls));
    const leg = add(stage, h('div', 'u1l9-bbleg', `<span class="u1l9-ca">━ down</span> <span class="u1l9-cg">━ up</span>`), CW - 10, 14); leg.style.translate = '-100% 0'; hide(leg);
    const allSegs = segs.length;
    if (d.mode === 'a') {
      const l1 = L(T('\\text{rises: }' + cG('10.5,\\ 7.35,\\ 5.145,\\ 3.6015'))), l2 = L(T('t_n=15(0.7)^n')), l3 = L(T('t_4=15(0.7)^4\\approx3.60\\text{ m}'), 'u1l9-big');
      return [
        { cap: `The ball falls 15 m to the ground. That first <b>drop</b> is not a rise.`, run: (c) => roll(c, 0, 1, 500) },
        { cap: `Each bounce rises to 70% of the fall before it: ${T(cG('15(0.7)=10.5'))}, then ${T(cG('7.35'))}, ${T(cG('5.145'))}, ${T(cG('3.6015'))}.`, run: async (c) => { await roll(c, 1, allSegs, 260); await show(c, l1); } },
        { cap: `The rises are ${T('15(0.7)^1,\\ 15(0.7)^2,\\ \\dots')}, so ${T('t_n=15(0.7)^n')}.`, run: (c) => show(c, l2) },
        { cap: `After the 4th bounce: ${T('t_4=15(0.7)^4\\approx3.60')} m (to the nearest hundredth).`, run: async (c) => { peakLab[3].classList.add('u1l9-hgton'); await pulse(c, peakLab[3], 1.25); await show(c, l3); } }
      ];
    }
    if (d.mode === 'b') {
      const l1 = L(`<b class="u1l9-ca">Down:</b> ${T(cA('15+10.5+7.35+5.145+3.6015'))}`, 'u1l9-small'), l2 = L(T('S_5=\\dfrac{15(1-0.7^5)}{0.3}\\approx41.5965'));
      const l3 = L(`<b class="u1l9-cg">Up:</b> ${T(cG('10.5+7.35+5.145+3.6015'))}`, 'u1l9-small'), l4 = L(T('S_4=\\dfrac{10.5(1-0.7^4)}{0.3}\\approx26.5965'));
      const l5 = L(T('\\text{Total}\\approx68.19\\text{ m}'), 'u1l9-big');
      return [
        { cap: `Follow the ball until it hits the ground for the <b>5th</b> time.`, run: (c) => roll(c, 0, allSegs, 230) },
        { cap: `Count: 5 hits means <b>5 drops</b> (blue) but only <b>4 rises</b> (green). The 5th hit ends with a drop.`, run: async (c) => { colour(); leg.style.opacity = 1; for (const hl of hitLab) await pulse(c, hl, 1.3, 220); } },
        { cap: `Drops: a geometric series with ${T(c1('t_1=15'))}, ${T(cD('r=0.7'))}, ${T('n=5')}. ${T('S_5\\approx41.5965')} m.`, run: async (c) => { await show(c, l1); await show(c, l2); } },
        { cap: `Rises: it starts with the <b>first rebound</b>, ${T(c1('t_1=10.5'))}, ${T(cD('r=0.7'))}, ${T('n=4')}. ${T('S_4\\approx26.5965')} m.`, run: async (c) => { await show(c, l3); await show(c, l4); } },
        { cap: `Add the two series: ${T('41.5965+26.5965\\approx68.19')}, so about <b>68.19 m</b>. Round only at the end.`, run: (c) => show(c, l5) }
      ];
    }
    const l1 = L(`${T('-1<0.7<1')}: both series converge`), l2 = L(`<b class="u1l9-ca">Down:</b> ${T('\\dfrac{15}{1-0.7}=\\dfrac{15}{0.3}=50')}`);
    const l3 = L(`<b class="u1l9-cg">Up:</b> ${T('\\dfrac{10.5}{1-0.7}=\\dfrac{10.5}{0.3}=35')}`), l4 = L(T('\\text{Total}=50+35=85\\text{ m}'), 'u1l9-big');
    const l5 = L(`<span class="muted">Check: every rise is matched by an equal fall, plus the first 15 m drop: ${T('2(35)+15=85')} ✓</span>`, 'u1l9-small');
    return [
      { cap: `Let it bounce forever. The bounces get smaller and smaller…`, run: async (c) => { await roll(c, 0, allSegs, 150); colour(); leg.style.opacity = 1; } },
      { cap: `Forever means an <b>infinite</b> series, and ${T(cD('r=0.7'))} is between ${T('-1')} and ${T('1')}, so ${T(cI('S_\\infty'))} exists for the drops and for the rises.`, run: (c) => show(c, l1) },
      { cap: `Drops: ${T(cI('S_\\infty=\\dfrac{15}{1-0.7}=50'))} m.`, run: (c) => show(c, l2) },
      { cap: `Rises (starting at 10.5): ${T(cI('S_\\infty=\\dfrac{10.5}{0.3}=35'))} m.`, run: (c) => show(c, l3) },
      { cap: `Total: ${T('50+35=85')} m. A ball that bounces forever still travels a <b>finite</b> distance.`, run: async (c) => { await show(c, l4); await show(c, l5); } }
    ];
  }
};

/* =============================== Stand Up Break =============================== */
const money = (v) => '\\$' + tn(v, 2, true);
const SU_CTX = [
  (r) => { const a = r.int(14, 30), k = r.int(2, 5), n = r.int(15, 30); return { text: `A theatre has <b>${a}</b> seats in row 1, and each row has <b>${k} more</b> seats than the row in front of it. How many seats are in <b>row ${n}</b>?`,
    a: [`\\text{Arithmetic }(d=${k})\\text{, one value: }t_{${n}}`, `t_{${n}}=${a}+${n - 1}(${k})=${a + (n - 1) * k}\\text{ seats}`] }; },
  (r) => { const a = r.int(5, 15), k = r.int(2, 4), n = r.int(10, 20); const S = n / 2 * (2 * a + (n - 1) * k); return { text: `Maya saves <b>$${a}</b> in week 1, and each week she saves <b>$${k} more</b> than the week before. How much has she saved <b>altogether</b> after ${n} weeks?`,
    a: [`\\text{Arithmetic }(d=${k})\\text{, a total: }S_{${n}}`, `S_{${n}}=\\tfrac{${n}}{2}\\left[2(${a})+${n - 1}(${k})\\right]=${money(S)}`] }; },
  (r) => { const a = r.pick([50, 100, 200, 250]), n = r.int(6, 10); return { text: `A culture has <b>${a}</b> bacteria in hour 1, and the number <b>doubles</b> every hour. How many bacteria are there in <b>hour ${n}</b>?`,
    a: [`\\text{Geometric }(r=2)\\text{, one value: }t_{${n}}`, `t_{${n}}=${a}(2)^{${n - 1}}=${tn(a * 2 ** (n - 1))}`] }; },
  (r) => { const a = r.int(2, 5), m = r.pick([2, 3, 4]), n = r.int(5, 8); const S = a * (m ** n - 1) / (m - 1); return { text: `A post is shared with <b>${a}</b> people in round 1. After that, each person who just got it shares it with <b>${m} new people</b>. How many people get it <b>in the first ${n} rounds</b>?`,
    a: [`\\text{Geometric }(r=${m})\\text{, a total: }S_{${n}}`, `S_{${n}}=\\dfrac{${a}(${m}^{${n}}-1)}{${m}-1}=${tn(S)}`] }; },
  (r) => { const a = r.pick([40, 60, 80, 120]), p = r.pick([75, 80, 90]); return { text: `A swing’s first arc is <b>${a} cm</b>, and each arc is <b>${p}%</b> as long as the one before. What <b>total</b> distance does it swing if it goes on <b>forever</b>?`,
    a: [`\\text{Geometric }(r=${p / 100})\\text{, forever: }S_\\infty`, `S_\\infty=\\dfrac{${a}}{1-${p / 100}}=${tn(a / (1 - p / 100), 2)}\\text{ cm}`] }; },
  (r) => { const a = r.pick([800, 1200, 1500]), p = r.pick([10, 20, 25]), n = r.int(3, 5); const v = a * (1 - p / 100) ** n; return { text: `A <b>$${a}</b> phone loses <b>${p}%</b> of its value each year. What is it worth <b>${n} years after</b> it was bought?`,
    a: [`\\text{Geometric }(r=${1 - p / 100})\\text{, one value: time 0 is }t_1\\text{, so }t_{${n + 1}}`, `t_{${n + 1}}=${a}(${1 - p / 100})^{${n}}\\approx${money(v)}`] }; }
];
standup('u1l9', {
  intro: 'At your whiteboard: decide arithmetic or geometric, and term, sum or sum to infinity. Then solve it.',
  levels: {
    BEG: (r) => { const q = r.pick(SU_CTX)(r); return { text: '<b>Arithmetic or geometric? Term, sum or sum to infinity?</b> Then answer it.<br>' + q.text, q: '', a: q.a }; },
    PRG: (r) => { // two terms known
      if (r.chance(0.5)) {
        const d = r.int(2, 7) * r.sign(), t1 = r.int(-10, 20), p = r.int(2, 5), q = p + r.int(3, 7), n = r.int(20, 40);
        const tp = t1 + (p - 1) * d, tq = t1 + (q - 1) * d;
        return { text: `In an <b>arithmetic</b> sequence, two terms are given. Determine ${'<i>d</i>'}, ${'<i>t</i><sub>1</sub>'}, the general term and ${`<i>t</i><sub>${n}</sub>`}.`,
          q: `t_{${p}}=${tp},\\qquad t_{${q}}=${tq}`,
          a: [`${q - p}d=${tq}-(${tp})=${tq - tp}\\Rightarrow d=${d}`, `t_1=${tp}-${p - 1}(${d})=${t1}`, `t_n=${t1}+(n-1)(${d})=${d}n${t1 - d < 0 ? '-' : '+'}${Math.abs(t1 - d)}`, `t_{${n}}=${t1 + (n - 1) * d}`] };
      }
      const rr = r.pick([2, 3, -2, -3]), t1 = r.int(1, 5) * r.sign(), p = r.int(2, 3), q = p + 3;
      const tp = t1 * rr ** (p - 1), tq = t1 * rr ** (q - 1), S = t1 * (rr ** 6 - 1) / (rr - 1);
      return { text: 'In a <b>geometric</b> sequence, two terms are given. Determine <i>r</i>, <i>t</i><sub>1</sub>, the general term and <i>S</i><sub>6</sub>.',
        q: `t_{${p}}=${tp},\\qquad t_{${q}}=${tq}`,
        a: [`${tp < 0 ? '(' + tp + ')' : tp}r^{${q - p}}=${tq}\\Rightarrow r^{${q - p}}=${tq / tp}\\Rightarrow r=${rr}`, `t_1=${t1}`, `t_n=${t1}(${rr})^{n-1}`, `S_6=\\dfrac{${t1}\\left[(${rr})^6-1\\right]}{${rr}-1}=${S}`] };
    },
    MAS: (r) => {
      const kind = r.int(0, 2);
      if (kind === 0) { // arithmetic: how many terms
        const a = r.int(1, 6), d = r.int(2, 4), n = r.int(8, 16), S = n / 2 * (2 * a + (n - 1) * d);
        return { text: `How many terms of the arithmetic series must be added to get a sum of <b>${S}</b>?`, q: `${a}+${a + d}+${a + 2 * d}+\\dots`,
          a: [`\\dfrac{n}{2}\\left[2(${a})+(n-1)(${d})\\right]=${S}`, `${d}n^2${2 * a - d < 0 ? '-' : '+'}${Math.abs(2 * a - d)}n-${2 * S}=0`, `n=${n}\\ (\\text{the other root is negative})`] };
      }
      if (kind === 1) { // geometric: how many terms
        const a = r.int(2, 5), m = r.pick([2, 3]), n = r.int(5, 8), S = a * (m ** n - 1) / (m - 1);
        return { text: `How many terms of the geometric series add to <b>${S}</b>?`, q: `${a}+${a * m}+${a * m * m}+\\dots`,
          a: [`\\dfrac{${a}(${m}^n-1)}{${m}-1}=${S}`, `${m}^n=${m ** n}`, `n=${n}`] };
      }
      const hgt = r.pick([8, 10, 12, 16, 20]), p = r.pick([50, 60, 75, 80]), rr = p / 100, up = hgt * rr / (1 - rr), dn = hgt / (1 - rr);
      return { text: `A ball is dropped from <b>${hgt} m</b>. Each bounce rises to <b>${p}%</b> of the height it fell from. What total vertical distance does it travel if it bounces <b>forever</b>?`, q: '',
        a: [`\\text{Down: }\\dfrac{${hgt}}{1-${rr}}=${tn(dn, 2)}`, `\\text{Up: }\\dfrac{${tn(hgt * rr)}}{1-${rr}}=${tn(up, 2)}`, `\\text{Total}=${tn(dn + up, 2)}\\text{ m}`] };
    }
  }
});

/* =============================== mount =============================== */
mountGarden();
export const explainers = mountExplainers({ sideBySide, whichFormula, countTerms, twoTerms, threeTerms, sumToTerm, findN, bounce });
export const _test = { tn, SB, WF, CT, TT, TR, ST, FN, BB };
