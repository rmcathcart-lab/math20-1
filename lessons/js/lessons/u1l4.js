/* Math 20-1 · Unit 1 · Lesson 4 — Arithmetic Series.
 * Warm-up (The Chiming Clock: tap an hour to hear it strike, a running tally, "Pair them up" draws the chords k ↔ 13 − k),
 * a Math History box (Gauss's slate: 1 to 100 on a 10 × 10 grid, 50 pairs of 101 through the centre), and the explainers:
 *   partialSums (sequence → series, then the running-total bars S_1, S_2, … over a table; S_4 − S_3 is the new block t_4;
 *     Example 1 check), gaussRows (the series forwards and backwards, every column t_1 + t_n, 2S = n(t_1 + t_n); Example 2
 *     check), staircase (a staircase of blocks and an upside-down copy fit into an n by (t_1 + t_n) rectangle; Example 1's
 *     S_6 = 117), twoFormulas (each column is t_1 plus (k − 1) d's, so t_n = t_1 + (n − 1)d turns the pairing formula
 *     into S_n = n/2[2t_1 + (n − 1)d]), whichFormula (a flowchart: last term known? n known?; Example 3(a)(b)(c) and 4
 *     checks), unknownHunt (what is unknown decides linear or quadratic; Example 6(a)(b) checks), findN (the quadratic
 *     for n next to the dots (n, S_n) reaching the target line; Example 5 check), cans (the can display rows, then left-
 *     aligned with an upside-down copy into a 13 by 36 rectangle; Example 7 check), runner (weekly bars: 7 jumps from
 *     week 4 to 11, back to week 1, then all 16 weeks; Example 8 check), sumToTerms (towers S_n on a graph of (n, S_n):
 *     each new tower's top is the next term; Example 9 check).
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

/* ====================================================================================================
 * Warm-up: The Chiming Clock
 * ==================================================================================================== */
function mountClock() {
  const host = document.getElementById('u1l4-clock'); if (!host) return;
  const C = 200, svg = svgEl('svg', { viewBox: '0 0 400 400', class: 'u1l4-clocksvg', role: 'img', 'aria-label': 'A clock face. Tap an hour to make the clock strike it.' }, host);
  const nowEl = document.getElementById('u1l4-tl-now'), totEl = document.getElementById('u1l4-tl-tot'), logEl = document.getElementById('u1l4-tl-log');
  svgEl('circle', { cx: C, cy: C, r: 190, fill: '#7a4a26' }, svg);
  svgEl('circle', { cx: C, cy: C, r: 180, fill: '#fffaf1', stroke: '#b48a5f', 'stroke-width': 2 }, svg);
  for (let i = 0; i < 60; i++) {
    const a = i * Math.PI / 30, r0 = i % 5 ? 170 : 162;
    svgEl('line', { x1: C + r0 * Math.sin(a), y1: C - r0 * Math.cos(a), x2: C + 176 * Math.sin(a), y2: C - 176 * Math.cos(a), stroke: '#7a4a26', 'stroke-width': i % 5 ? 1.2 : 3 }, svg);
  }
  const chords = svgEl('g', {}, svg);
  const pos = (k, r) => [C + r * Math.sin(k * Math.PI / 6), C - r * Math.cos(k * Math.PI / 6)];
  // the bell (swings when it strikes) and its ring
  const bell = svgEl('g', { class: 'u1l4-bell' }, svg);
  bell.style.transformBox = 'view-box'; bell.style.transformOrigin = '200px 236px';
  svgEl('path', { d: 'M184 272 q0 -26 16 -30 q16 4 16 30 l5 6 h-42 z', fill: '#d9a62e', stroke: '#7a4a26', 'stroke-width': 2 }, bell);
  svgEl('circle', { cx: 200, cy: 282, r: 4, fill: '#7a4a26' }, bell);
  svgEl('circle', { cx: 200, cy: 240, r: 3, fill: '#7a4a26' }, bell);
  const ring = svgEl('circle', { cx: 200, cy: 262, r: 22, fill: 'none', stroke: '#d9a62e', 'stroke-width': 4, opacity: 0 }, svg);
  ring.style.transformBox = 'view-box'; ring.style.transformOrigin = '200px 262px';
  // hands
  const handG = svgEl('g', { class: 'u1l4-hands' }, svg);
  const hourH = svgEl('line', { x1: C, y1: C, x2: C, y2: C - 92, stroke: INK, 'stroke-width': 9, 'stroke-linecap': 'round' }, handG);
  svgEl('line', { x1: C, y1: C, x2: C, y2: C - 136, stroke: INK, 'stroke-width': 5, 'stroke-linecap': 'round' }, handG);
  svgEl('circle', { cx: C, cy: C, r: 8, fill: INK }, handG);
  svg.appendChild(chords);
  const dim = (on) => { handG.style.opacity = bell.style.opacity = on ? 0.12 : 1; };
  const setHour = (k) => { const [x, y] = pos(k, 92); hourH.setAttribute('x2', x); hourH.setAttribute('y2', y); };
  setHour(10);
  const nums = {};
  for (let k = 1; k <= 12; k++) {
    const [x, y] = pos(k, 140), g = svgEl('g', { class: 'u1l4-hr', 'data-tap': '', role: 'button', tabindex: 0, 'aria-label': 'Strike ' + k + ' o’clock' }, svg);
    svgEl('circle', { cx: x, cy: y, r: 23, class: 'u1l4-hr-bg' }, g);
    const t = svgEl('text', { x, y: y + 9, 'text-anchor': 'middle', class: 'u1l4-hr-t' }, g); t.textContent = k;
    g.addEventListener('click', () => strikeOne(k));
    g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); strikeOne(k); } });
    nums[k] = g;
  }
  let busy = false, gen = 0, total = 0, struck = [];
  const wait = (ms, g) => new Promise((res, rej) => setTimeout(() => (g === gen ? res() : rej(new Error('reset'))), ms));
  const paintLog = (extra) => {
    if (!struck.length) { logEl.innerHTML = ''; return; }
    const s = struck.length > 4 ? `${struck[0]}+\\dots+${struck[struck.length - 1]}` : struck.join('+');
    logEl.innerHTML = struck.length > 1 ? T(s + '=' + total) + (extra ? '<br>' + extra : '') : '';
  };
  async function strike(k, g, ms) {
    dim(false); chords.innerHTML = ''; setHour(k); Object.values(nums).forEach((n) => n.classList.remove('on')); nums[k].classList.add('on');
    for (let i = 1; i <= k; i++) {
      nowEl.textContent = i; total++; totEl.textContent = total;
      bell.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(18deg)' }, { transform: 'rotate(-14deg)' }, { transform: 'rotate(0)' }], { duration: ms * 0.9 });
      ring.animate([{ opacity: 0.9, transform: 'scale(.6)' }, { opacity: 0, transform: 'scale(2.4)' }], { duration: ms * 1.4 });
      await wait(ms, g);
    }
    struck.push(k); paintLog();
  }
  async function strikeOne(k) {
    if (busy) return; busy = true; const g = gen;
    try { await strike(k, g, 380); } catch (e) { /* reset */ } finally { if (g === gen) busy = false; }
  }
  document.getElementById('u1l4-run12').addEventListener('click', async () => {
    if (busy) return; busy = true; const g = ++gen; reset(true);
    try { for (let k = 1; k <= 12; k++) { await strike(k, g, 95); await wait(260, g); } } catch (e) { return; }
    busy = false;
  });
  document.getElementById('u1l4-pair').addEventListener('click', () => {
    chords.innerHTML = ''; dim(true);
    const cols = ['#0f7f80', '#1f5bd6', '#7b4fc4', '#c27a0e', '#c93a33', '#12805a'];
    for (let k = 1; k <= 6; k++) {
      const a = pos(k, 118), b = pos(13 - k, 118), m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      const l = svgEl('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: cols[k - 1], 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.85 }, chords);
      const tg = svgEl('g', {}, chords);
      svgEl('rect', { x: m[0] - 17, y: m[1] - 13, width: 34, height: 25, rx: 7, fill: '#fff', stroke: cols[k - 1], 'stroke-width': 2 }, tg);
      const t = svgEl('text', { x: m[0], y: m[1] + 7, 'text-anchor': 'middle', class: 'u1l4-pair-t', fill: cols[k - 1] }, tg); t.textContent = '13';
      l.animate([{ opacity: 0 }, { opacity: 0.85 }], { duration: 300, delay: k * 220, fill: 'backwards' });
      tg.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: k * 220 + 150, fill: 'backwards' });
    }
    logEl.innerHTML = '<b>6 pairs</b> of 13:<br>' + T('6\\times13=78');
  });
  function reset(keepBusy) {
    if (!keepBusy) { gen++; busy = false; }
    total = 0; struck = []; nowEl.textContent = '0'; totEl.textContent = '0'; logEl.innerHTML = ''; chords.innerHTML = ''; dim(false);
    Object.values(nums).forEach((n) => n.classList.remove('on')); setHour(10);
  }
  document.getElementById('u1l4-wreset').addEventListener('click', () => reset(false));
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

/* =============================== explainer: two staircases make a rectangle =============================== */
const ST = {
  six: { label: T('1+2+3+4+5+6'), t: [1, 2, 3, 4, 5, 6] },
  five: { label: T('2+5+8+11+14'), t: [2, 5, 8, 11, 14] },
  ex1: { label: 'Example 1: ' + T('S_6'), t: [7, 12, 17, 22, 27, 32], ex: true }
};
const staircase = {
  title: 'Two staircases make a rectangle',
  height: 440,
  minW: 900,
  choices: Object.keys(ST).map((k) => ({ v: k, label: ST[k].label })),
  ask: (k) => (ST[k].ex ? `<b>Example 1:</b> ${T('S_6=7+12+17+22+27+32')}` : `Find ${T(ST[k].t.join('+'))} with blocks.`),
  make(stage, k, ex) {
    const t = ST[k].t, n = t.length, t1 = t[0], tn = t[n - 1], tall = t1 + tn, W = ex.W;
    const base = 380, u = Math.min(30, Math.floor(318 / tall)), cw = Math.min(56, 340 / n), x0 = 52;
    const svg = mkSvg(stage, W, ex.def.height);
    const stairs = (fill, stroke) => {
      const g = svgEl('g', {});
      t.forEach((v, i) => {
        const cg = svgEl('g', { class: 'u1l4-scol' }, g);
        svgEl('rect', { x: x0 + i * cw, y: base - v * u, width: cw, height: v * u, fill, stroke, 'stroke-width': 2 }, cg);
        if (u >= 6) for (let j = 1; j < v; j++) svgEl('line', { x1: x0 + i * cw, x2: x0 + (i + 1) * cw, y1: base - j * u, y2: base - j * u, stroke, 'stroke-width': u >= 14 ? 1.4 : 0.8, opacity: u >= 14 ? 0.9 : 0.55 }, cg);
      });
      return g;
    };
    svgEl('line', { x1: x0 - 10, x2: x0 + n * cw + 10, y1: base, y2: base, stroke: INK, 'stroke-width': 2 }, svg);
    const g1 = stairs('#cfe9e8', T1); svg.appendChild(g1);
    const g2 = stairs('#fbe6c2', DC); svg.appendChild(g2);
    g2.style.transformBox = 'view-box'; g2.style.transformOrigin = '0 0';
    const ccx = x0 + n * cw / 2, ccy = base - tall * u / 2, DX = n * cw + 64;
    const setT = (tx, th) => g2.setAttribute('transform', `translate(${tx.toFixed(1)} 0) rotate(${th.toFixed(1)} ${ccx} ${ccy.toFixed(1)})`);
    setT(DX, 0); g2.style.opacity = 0;
    [...g1.children].forEach((e) => (e.style.opacity = 0));
    const vals = t.map((v, i) => { const l = lab(stage, x0 + (i + 0.5) * cw, base + 4, T(cT(N(v))), 'u1l4-sval', 's'); hide(l); return l; });
    const R = n * tall, S = R / 2, PX = x0 + n * cw + 190;
    const out = add(stage, box(h('div', 'u1l4-sout'), W - PX - 14, 300), PX, 70);
    return [
      { cap: `Each term is a <b>column of blocks</b>: ${T(t.map((v) => cT(N(v))).join(',\\ '))}.`,
        run: async (c) => { for (let i = 0; i < n; i++) { await pop(c, g1.children[i], 260); vals[i].style.opacity = 1; } } },
      { cap: `${T(cS('S_' + n))} is the number of blocks in the staircase. Make a <b>copy</b> of it.`,
        run: (c) => appear(c, g2, 400) },
      { cap: `Turn the copy <b>upside down</b>.`,
        run: (c) => tween(c, 1000, (p) => setT(DX, 180 * p)) },
      { cap: `Slide it on top of the first staircase. It fits <b>exactly</b>!`,
        run: (c) => tween(c, 1000, (p) => setT(DX * (1 - p), 180)) },
      { cap: `Every column is now ${T(`${cT(N(t1))}+${cL(N(tn))}=${N(tall)}`)} blocks tall, and there are ${T(cN(String(n)))} columns.`,
        run: async (c) => {
          const bh = braceV(svg, x0 + n * cw + 10, base - tall * u, base, INK); await drawIn(bh, 500, c);
          await pop(c, lab(stage, x0 + n * cw + 32, base - tall * u / 2, T(`${cT('t_1')}+${cL('t_n')}=${N(tall)}`), 'u1l4-sdim', 'e'), 300);
          const top = lab(stage, x0 + n * cw / 2, base - tall * u - 6, `${T(cN('n=' + n))} columns`, 'u1l4-sdim', 'n'); await pop(c, top, 300);
        } },
      { cap: `The rectangle holds ${T(`${n}\\times${N(tall)}=${N(R)}`)} blocks: <b>two</b> staircases.`,
        run: (c) => show(c, line(out, T(`2${cS('S_' + n)}=${n}\\times${N(tall)}=${N(R)}`))) },
      { cap: `So one staircase is ${T(`${cS('S_' + n)}=${N(R)}\\div2=${N(S)}`)}.${ST[k].ex ? ' Just like Example 1(b)!' : ''}`,
        run: async (c) => {
          await show(c, line(out, T(`${cS('S_' + n)}=\\dfrac{${N(R)}}{2}=\\boldsymbol{${N(S)}}`), 'u1l4-big'));
          await show(c, line(out, `${T(`S_n=\\dfrac{${cN('n')}(${cT('t_1')}+${cL('t_n')})}{2}`)}`, 'u1l4-formline'));
        } }
    ];
  }
};

/* =============================== explainer: where n/2[2t1 + (n − 1)d] comes from =============================== */
const TF = {
  a: { label: T('3+5+7+9+11'), t1: 3, d: 2, n: 5 },
  b: { label: T('4+7+10+13+16+19'), t1: 4, d: 3, n: 6 }
};
const twoFormulas = {
  title: 'Swap the last term for t₁ + (n − 1)d',
  height: 430,
  minW: 900,
  choices: Object.keys(TF).map((k) => ({ v: k, label: TF[k].label })),
  ask: false,
  intro: 'Each term is the first term plus some copies of <b>d</b>. Press <b>Next</b>.',
  make(stage, k, ex) {
    const { t1, d, n } = TF[k], tn = t1 + (n - 1) * d, S = n * (t1 + tn) / 2, W = ex.W;
    const base = 370, cw = 58, u = Math.min(26, Math.floor(300 / tn)), x0 = 44;
    const svg = mkSvg(stage, W, ex.def.height);
    svgEl('line', { x1: x0 - 10, x2: x0 + n * cw + 10, y1: base, y2: base, stroke: INK, 'stroke-width': 2 }, svg);
    const tealR = [], ambR = [];
    for (let i = 0; i < n; i++) {
      tealR.push(rect(svg, x0 + i * cw + 4, base - t1 * u, cw - 8, t1 * u, { fill: '#cfe9e8', stroke: T1, 'stroke-width': 2 }));
      ambR.push([...Array(i).keys()].map((j) => { const r = rect(svg, x0 + i * cw + 4, base - (t1 + (j + 1) * d) * u, cw - 8, d * u, { fill: '#fbe6c2', stroke: DC, 'stroke-width': 2 }); r.style.opacity = 0; return r; }));
      lab(stage, x0 + (i + 0.5) * cw, base + 4, T(`t_${i + 1}`), 'u1l4-sval', 's');
    }
    tealR.forEach((r) => r.setAttribute('height', 0));
    const vtop = [...Array(n).keys()].map((i) => { const l = lab(stage, x0 + (i + 0.5) * cw, base - (t1 + i * d) * u - 4, T(N(t1 + i * d)), 'u1l4-ptop', 'n'); hide(l); return l; });
    const PX = 470, pn = panel(stage, PX, 14, W - PX - 14, 400, '');
    return [
      { cap: `Every term starts with the first term, ${T(cT('t_1=' + t1))}.`,
        run: async (c) => { await Promise.all(tealR.map((r, i) => sleep(c, i * 60).then(() => growRect(c, r, 380)))); } },
      { cap: `Then add ${T(cD('d=' + d))} once for each step along: ${T('0,\\ 1,\\ 2,\\ \\dots,\\ ' + (n - 1))} times.`,
        run: async (c) => { for (let i = 1; i < n; i++) { for (const r of ambR[i]) await pop(c, r, 160); vtop[i].style.opacity = 1; } vtop[0].style.opacity = 1; } },
      { cap: `The last column has ${T(cT('t_1'))} and ${T(`n-1=${n - 1}`)} copies of ${T(cD('d'))}: ${T(`${cL('t_n')}=${cT('t_1')}+(n-1)${cD('d')}=${t1}+${n - 1}(${d})=${tn}`)}.`,
        run: async (c) => {
          const b = braceV(svg, x0 + n * cw + 4, base - tn * u, base, TN); await drawIn(b, 450, c);
          await show(c, line(pn, T(`${cL('t_n')}=${cT('t_1')}+(n-1)${cD('d')}`), 'u1l4-tnline'));
        } },
      { cap: `Start with the pairing formula.`, run: (c) => show(c, line(pn, T(`S_n=\\dfrac{n}{2}(${cT('t_1')}+${cL('t_n')})`))) },
      { cap: `Replace ${T(cL('t_n'))} with ${T(`${cT('t_1')}+(n-1)${cD('d')}`)}.`,
        run: (c) => show(c, line(pn, T(`S_n=\\dfrac{n}{2}\\left(${cT('t_1')}+\\underbrace{${cT('t_1')}+(n-1)${cD('d')}}_{${cL('t_n')}}\\right)`))) },
      { cap: `Two ${T(cT('t_1'))}’s make ${T(cT('2t_1'))}. This is the formula to use when you know ${T(cD('d'))} but not the last term.`,
        run: (c) => show(c, line(pn, T(`S_n=\\dfrac{n}{2}\\left[2${cT('t_1')}+(n-1)${cD('d')}\\right]`), 'u1l4-boxed')) },
      { cap: `Check: both formulas give ${T(`S_${n}=${S}`)}.`,
        run: async (c) => {
          await show(c, line(pn, T(`\\tfrac{${n}}{2}\\left[2(${t1})+${n - 1}(${d})\\right]=\\tfrac{${n}}{2}(${2 * t1 + (n - 1) * d})=${S}`), 'u1l4-small'));
          await show(c, line(pn, T(`\\tfrac{${n}}{2}(${t1}+${tn})=\\tfrac{${n}}{2}(${t1 + tn})=${S}\\ \\checkmark`), 'u1l4-small'));
        } }
    ];
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

/* =============================== explainer: what is unknown? linear or quadratic =============================== */
const UH = {
  quad: { label: 'Why does n give n²?', ask: `How many terms of ${T('4+10+16+\\dots')} give a sum of 200?`,
    known: [['t_1', '4', T1], ['d', '6', DC], ['S_n', '200', SC]], unknown: ['n', NC],
    f0: `${cS('S_n')}=\\dfrac{${cN('n')}}{2}\\left[2${cT('t_1')}+(${cN('n')}-1)${cD('d')}\\right]`,
    f1: `${cS('200')}=\\dfrac{\\boxed{${cN('n')}}}{2}\\left[2(${cT('4')})+(\\boxed{${cN('n')}}-1)(${cD('6')})\\right]`,
    steps: [
      { cap: `${T('n')} is in <b>two places</b>: in ${T('\\frac{n}{2}')} and inside the bracket.`, kind: 'mark' },
      { cap: `Simplify the bracket: ${T('8+6n-6=6n+2')}.`, line: `200=\\dfrac{n}{2}(6n+2)=n(3n+1)` },
      { cap: `Multiply out: ${T('n')} times ${T('n')} makes ${T(cN('n^2'))}.`, line: `200=3${cN('n^2')}+n\\ \\Rightarrow\\ 3n^2+n-200=0` },
      { cap: `An ${T('n^2')} term: a <b>quadratic</b>. Factor it: ${T('(3n+25)(n-8)=0')}.`, stamp: 'quadratic', line: `(3n+25)(n-8)=0` },
      { cap: `${T('n=8')}, or ${T('n=-\\tfrac{25}{3}')} (not a natural number: reject it). So <b>8 terms</b>.`, line: `n=\\boldsymbol{8}\\quad ${cX('\\text{reject }n=-\\tfrac{25}{3}')}` }] },
  a: { label: 'Example 6(a) check', ask: `<b>Example 6(a):</b> ${T('S_{20}=650')} and ${T('d=3')}. Determine ${T('t_1')}.`,
    known: [['S_{20}', '650', SC], ['n', '20', NC], ['d', '3', DC]], unknown: ['t_1', T1],
    f0: `${cS('S_n')}=\\dfrac{${cN('n')}}{2}\\left[2${cT('t_1')}+(${cN('n')}-1)${cD('d')}\\right]`,
    f1: `${cS('650')}=\\dfrac{${cN('20')}}{2}\\left[2\\boxed{${cT('t_1')}}+(${cN('20')}-1)(${cD('3')})\\right]`,
    steps: [
      { cap: `${T('t_1')} appears <b>once</b>, not squared: a <b>linear</b> equation.`, stamp: 'linear', kind: 'mark' },
      { cap: `${T('\\frac{20}{2}=10')} and ${T('19(3)=57')}.`, line: `650=10(2t_1+57)` },
      { cap: `Divide both sides by 10.`, line: `65=2t_1+57` },
      { cap: `Subtract 57, then divide by 2: ${T('t_1=4')}.`, line: `8=2t_1\\ \\Rightarrow\\ ${cT('t_1')}=\\boldsymbol{4}` },
      { cap: `Check: ${T('\\frac{20}{2}\\left[2(4)+19(3)\\right]=10(65)=650')} ✓`, line: `\\tfrac{20}{2}\\left[8+57\\right]=650\\ \\checkmark`, cls: 'u1l4-small' }] },
  b: { label: 'Example 6(b) check', ask: `<b>Example 6(b):</b> 15 terms, first term 8, sum 645. Determine the last term and ${T('d')}.`,
    known: [['n', '15', NC], ['t_1', '8', T1], ['S_{15}', '645', SC]], unknown: ['t_{15},\\ d', TN],
    f0: `${cS('S_n')}=\\dfrac{${cN('n')}}{2}(${cT('t_1')}+${cL('t_n')})`,
    f1: `${cS('645')}=\\dfrac{${cN('15')}}{2}(${cT('8')}+\\boxed{${cL('t_{15}')}})`,
    pre: `The last term is wanted, so use the formula with ${T(cL('t_n'))}.`,
    steps: [
      { cap: `One unknown, ${T(cL('t_{15}'))}, not squared: <b>linear</b>.`, stamp: 'linear', kind: 'mark' },
      { cap: `Multiply both sides by ${T('\\frac{2}{15}')}: ${T('645\\times\\frac{2}{15}=86')}.`, line: `86=8+t_{15}\\ \\Rightarrow\\ ${cL('t_{15}')}=\\boldsymbol{78}` },
      { cap: `Now ${T('d')}: use ${T('t_n=t_1+(n-1)d')} with ${T('n=15')}.`, line: `78=8+14d` },
      { cap: `${T('70=14d')}, so ${T('d=5')}. Linear again.`, line: `70=14d\\ \\Rightarrow\\ ${cD('d')}=\\boldsymbol{5}` }] }
};
const unknownHunt = {
  title: 'What is unknown?',
  height: 440,
  minW: 900,
  choices: Object.keys(UH).map((k) => ({ v: k, label: UH[k].label })),
  ask: (k) => UH[k].ask,
  make(stage, k, ex) {
    const d = UH[k], W = ex.W;
    const tiles = add(stage, box(h('div', 'u1l4-tiles'), W - 28, 58), 14, 12);
    const tEls = d.known.map(([s, v, c]) => { const e = h('div', 'u1l4-tile', `<span class="u1l4-tk">know</span>${T(`\\textcolor{${c}}{${s}=${v}}`)}`); e.style.borderColor = c; tiles.appendChild(e); hide(e); return e; });
    const uEl = h('div', 'u1l4-tile u1l4-tile-q', `<span class="u1l4-tk">find</span>${T(`\\textcolor{${d.unknown[1]}}{${d.unknown[0]}}=\\ ?`)}`); tiles.appendChild(uEl); hide(uEl);
    const fb = add(stage, box(h('div', 'u1l4-fbox'), W - 28, 96), 14, 84); hide(fb);
    const pn = add(stage, box(h('div', 'u1l4-ulines'), W - 300, 240), 40, 194);
    let st = null;
    const steps = [
      { cap: `List what you know, and what you want.`, run: async (c) => { for (const e of tEls) await pop(c, e, 260); await pop(c, uEl, 300); } },
      { cap: d.pre || `${T('d')} is known, so use ${T('S_n=\\frac{n}{2}\\left[2t_1+(n-1)d\\right]')}.`, run: async (c) => { fb.innerHTML = T(d.f0); await show(c, fb); } },
      { cap: `Substitute every known value. The unknown is boxed.`, run: async (c) => { fb.innerHTML = T(d.f1); await pulse(c, fb, 1.03); } }
    ];
    d.steps.forEach((s) => steps.push({ cap: s.cap, run: async (c) => {
      if (s.kind === 'mark') fb.classList.add('u1l4-fbox-on');
      if (s.stamp) { if (st) st.remove(); st = stamp(stage, s.stamp, { ok: s.stamp === 'linear' ? true : null, x: W - 140, y: 290, size: 'lg', cls: 'u1l4-stamp' }); await stampIn(c, st); }
      if (s.line) await show(c, line(pn, T(s.line), s.cls || ''));
    } }));
    return steps;
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

/* =============================== explainer: the can display =============================== */
const cans = {
  title: 'Two displays make a rectangle',
  height: 440,
  minW: 920,
  ask: `<b>Example 7:</b> 30 cans in the bottom row, 2 fewer in each row above, 6 in the top row.`,
  make(stage, k, ex) {
    const W = ex.W, s = 15, ch = 25, R = 13, rows = [...Array(R).keys()].map((i) => 30 - 2 * i), X0 = 60, base = 404, mid = X0 + 15 * s;
    const svg = mkSvg(stage, W, ex.def.height);
    svgEl('line', { x1: X0 - 6, x2: X0 + 36 * s + 6, y1: base + ch / 2 + 2, y2: base + ch / 2 + 2, stroke: '#7a4a26', 'stroke-width': 4 }, svg);
    const can = (g, x, fill, rim) => { svgEl('rect', { x: x - s / 2 + 0.8, y: -ch / 2 + 1, width: s - 1.6, height: ch - 2, rx: 3, fill, stroke: rim, 'stroke-width': 1.2 }, g); svgEl('rect', { x: x - s / 2 + 0.8, y: -3, width: s - 1.6, height: 7, fill: '#fff', opacity: 0.8 }, g); };
    const rowG = rows.map((r, i) => {
      const g = svgEl('g', {}, svg); g.r = r; g.y = base - i * ch;
      for (let j = 0; j < r; j++) can(g, j * s + s / 2, '#c93a33', '#7d1f1a');
      g.cx = mid - r * s / 2; g.setAttribute('transform', `translate(${g.cx} ${g.y})`); g.style.opacity = 0; return g;
    });
    const copyG = rows.map((r, i) => {
      const cnt = 36 - r, g = svgEl('g', {}, svg); g.y = base - i * ch;
      for (let j = 0; j < cnt; j++) can(g, j * s + s / 2, '#2f6fd0', '#173a73');
      g.fx = X0 + r * s; g.setAttribute('transform', `translate(${g.fx + 300} ${g.y})`); g.style.opacity = 0; return g;
    });
    const PX = X0 + 36 * s + 40, pn = panel(stage, PX, 10, W - PX - 12, 420, 'Example 7');
    const bl = lab(stage, mid, base + ch / 2 + 3, T(cT('t_1=30')) + ' cans', 'u1l4-canl', 's'); hide(bl);
    const tl = lab(stage, mid, base - (R - 1) * ch - ch / 2 - 2, T(cL('t_n=6')), 'u1l4-canl', 'n'); hide(tl);
    const nums = rowG.map((g, i) => { const l = lab(stage, X0 - 12, g.y, String(i + 1), 'u1l4-rown', 'w'); hide(l); return l; });
    return [
      { cap: `Bottom row: ${T(cT('t_1=30'))} cans.`, run: async (c) => { await appear(c, rowG[0], 350); bl.style.opacity = 1; } },
      { cap: `Each row up has 2 fewer: ${T(cD('d=-2'))}. The top row is ${T(cL('t_n=6'))}.`,
        run: async (c) => { for (let i = 1; i < R; i++) await appear(c, rowG[i], 110); tl.style.opacity = 1; } },
      { cap: `(a) How many rows? ${T('6=30+(n-1)(-2)')} gives ${T('n-1=12')}, so ${T(cN('n=13'))} rows.`,
        run: async (c) => {
          await show(c, line(pn, T(`6=30+(n-1)(-2)`))); await show(c, line(pn, T(`-24=-2(n-1)`))); await show(c, line(pn, T(`n-1=12`)));
          for (const l of nums) l.style.opacity = 1; await show(c, line(pn, T(`${cN('n=13')}`) + ' rows', 'u1l4-big'));
        } },
      { cap: `(b) How many cans altogether? That is ${T('S_{13}')}. First, slide every row to the left.`,
        run: async (c) => { tl.style.opacity = 0; await tween(c, 800, (p) => rowG.forEach((g) => g.setAttribute('transform', `translate(${(g.cx + (X0 - g.cx) * p).toFixed(1)} ${g.y})`))); } },
      { cap: `Bring in an <b>upside-down copy</b> (blue): 6 on the bottom row, up to 30 on top. Each row now holds ${T('30+6=36')} cans.`,
        run: async (c) => {
          copyG.forEach((g) => (g.style.opacity = 1));
          await tween(c, 1000, (p) => copyG.forEach((g) => g.setAttribute('transform', `translate(${(g.fx + 300 * (1 - p)).toFixed(1)} ${g.y})`)));
          const bh = braceV(svg, X0 + 36 * s + 2, base - (R - 1) * ch - ch / 2, base + ch / 2, INK); bh.style.opacity = 0.9;
        } },
      { cap: `${T('13')} rows of ${T('36')} is ${T('468')} cans: <b>two</b> displays. One display is ${T('468\\div2=234')}.`,
        run: async (c) => {
          await show(c, line(pn, T(`2S_{13}=13(36)=468`)));
          await show(c, line(pn, T(`S_{13}=\\dfrac{13}{2}(30+6)`)));
          await show(c, line(pn, T(`=13(18)=\\boldsymbol{234}`) + ' cans', 'u1l4-big'));
        } }
    ];
  }
};

/* =============================== explainer: the runner's weeks =============================== */
const runner = {
  title: 'Example 8 check: the training weeks',
  height: 470,
  minW: 920,
  ask: `<b>Example 8:</b> 18 km in week 4 and 39 km in week 11.`,
  make(stage, k, ex) {
    const W = ex.W, X0 = 66, slot = (W - X0 - 20) / 16, bw = slot * 0.62, base = 380, kpx = 4.2, wk = (i) => 6 + 3 * i; // week i (1-based): 9 + 3(i − 1)
    const svg = mkSvg(stage, W, ex.def.height), cx = (i) => X0 + (i - 0.5) * slot;
    svgEl('line', { x1: X0 - 8, x2: W - 14, y1: base, y2: base, stroke: INK, 'stroke-width': 2 }, svg);
    const bars = [], vals = [];
    for (let i = 1; i <= 16; i++) {
      const v = wk(i), r = rect(svg, cx(i) - bw / 2, base - v * kpx, bw, v * kpx, { rx: 4, fill: i === 1 ? '#bfe3e2' : '#c9d9f4', stroke: i === 1 ? T1 : TN, 'stroke-width': 2 });
      r.setAttribute('height', 0); bars.push(r);
      const gq = rect(svg, cx(i) - bw / 2, base - 40, bw, 40, { rx: 4, fill: 'none', stroke: '#c9c3b5', 'stroke-width': 1.5, 'stroke-dasharray': '4 4' }); gq.cls = 'ghost';
      bars[i - 1].ghost = gq;
      lab(stage, cx(i), base + 4, String(i), 'u1l4-wk', 's');
      const vl = lab(stage, cx(i), base - v * kpx - 3, T(N(v)), 'u1l4-wv', 'n'); hide(vl); vals.push(vl);
    }
    lab(stage, X0 - 10, base + 16, 'week', 'u1l4-wkh', 'w');
    const pn = add(stage, box(h('div', 'u1l4-rpanel'), 470, 190), X0, 6);
    const grow = (c, i) => { bars[i - 1].ghost.style.opacity = 0; vals[i - 1].style.opacity = 1; return growRect(c, bars[i - 1], 380); };
    const hop = async (c, a, b, txt, y = 432) => {
      const x1 = cx(a), x2 = cx(b), m = (x1 + x2) / 2, up = b > a;
      const p = svgEl('path', { d: `M${x1} ${y} Q${m} ${y + (up ? 30 : 30)} ${x2} ${y}`, fill: 'none', stroke: up ? DC : T1, 'stroke-width': 3, class: 'bk-stroke' }, svg);
      await drawIn(p, 260, c);
      if (txt) await pop(c, lab(stage, m, y + 20, T(txt), 'u1l4-hoptag', 's'), 160);
    };
    return [
      { cap: `Week 4: ${T('t_4=18')} km. Week 11: ${T('t_{11}=39')} km. The other weeks are unknown.`,
        run: async (c) => { await grow(c, 4); await grow(c, 11); } },
      { cap: `From week 4 to week 11 is ${T('11-4=7')} <b>steps</b> of ${T(cD('d'))}.`,
        run: async (c) => { for (let i = 4; i < 11; i++) await hop(c, i, i + 1, cD('+d'), 418); } },
      { cap: `${T(`7${cD('d')}=39-18=21`)}, so ${T(cD('d=3'))} km more each week.`,
        run: (c) => show(c, line(pn, T(`7${cD('d')}=39-18=21\\Rightarrow ${cD('d=3')}`))) },
      { cap: `Step back 3 weeks to week 1: ${T(`${cT('t_1')}=18-3(3)=9`)} km.`,
        run: async (c) => { for (let i = 4; i > 1; i--) await hop(c, i, i - 1, null, 446); await grow(c, 1); await show(c, line(pn, T(`${cT('t_1')}=18-3(3)=9`))); } },
      { cap: `Fill in every week. Week 16: ${T(`${cL('t_{16}')}=9+15(3)=54`)} km.`,
        run: async (c) => { for (let i = 2; i <= 16; i++) if (i !== 4 && i !== 11) await grow(c, i); bars[15].setAttribute('stroke-width', 3.5); await show(c, line(pn, T(`${cL('t_{16}')}=9+15(3)=54`))); } },
      { cap: `Total distance = all 16 bars: ${T('S_{16}=\\tfrac{16}{2}(9+54)=8(63)=504')} km.`,
        run: async (c) => { await show(c, line(pn, T(`S_{16}=\\tfrac{16}{2}(9+54)=8(63)=\\boldsymbol{504}`) + ' km', 'u1l4-big')); } }
    ];
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
mountClock();
gaussSlate();
export const explainers = mountExplainers({ partialSums, gaussRows, staircase, twoFormulas, whichFormula, unknownHunt, findN, cans, runner, sumToTerms });
export const _test = { N, PS, GR, ST, TF, WFQ, UH, FN, STT, suS };
