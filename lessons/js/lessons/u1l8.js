/* Math 20-1 · Unit 1 · Lesson 8 — Infinite Geometric Series.
 * Static figures (Example 1 partial-sum grid, Example 6 ball path) and the explainers (2026-11-11 class format: the old
 * warm-up and the partials / powers / gap / solve / ceiling explainers were removed):
 *   fill (STAR: a unit square shaded half, then half of what is left… beside the partial sums creeping toward S∞ on a
 *     number line; thirds; a divergent 1/2 + 1 + 2 + … that overflows and runs off the line),
 *   gate (the −1 < r < 1 gate on a number line; Example 2 (a)–(f) checks),
 *   decimal (a repeating decimal split into blocks, stacked like column addition; Example 5 checks),
 *   bounce (a ball bouncing, its down and up distances added on a tape; Example 6 check),
 *   xrange (x on one line, r = x/2 on another, the gate pulled back to −2 < x < 2; Example 8 check).
 * Colours (Unit 1): common ratio r amber, first term t1 teal, partial sums blue, S∞ green, divergent red. */
import {
  h, tex, add, box, Graph, NumberLine, stamp, stampIn, mountExplainers, pop, fadeIn, appear, sleep, tween,
  svgEl, liveCtx, pulse, place, drawIn, arrowHead, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const RC = COLORS.amber, TC = '#0f7c80', SC = COLORS.blue, GC = COLORS.green, RED = COLORS.red, INK = COLORS.ink, GRAY = COLORS.gray, PUR = COLORS.purple;
const cR = (s) => `\\textcolor{${RC}}{${s}}`, cT = (s) => `\\textcolor{${TC}}{${s}}`, cS = (s) => `\\textcolor{${SC}}{${s}}`;
const cG = (s) => `\\textcolor{${GC}}{${s}}`, cX = (s) => `\\textcolor{${RED}}{${s}}`, cP = (s) => `\\textcolor{${PUR}}{${s}}`;
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const red = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); return [n / g, d / g]; };
/** TeX of a fraction n/d, reduced; whole numbers plain; big → \dfrac */
const fr = (n, d, big) => { const [a, b] = red(n, d); if (b === 1) return String(a); return (a < 0 ? '-' : '') + `\\${big ? 'd' : 't'}frac{${Math.abs(a)}}{${b}}`; };
const round = (v, dp) => { const p = Math.pow(10, dp); return Math.round(v * p + (v >= 0 ? 1e-9 : -1e-9)) / p; };
/** number as TeX: rounded to dp, trailing zeros dropped (unless fixed), thin space thousands */
function tn(v, dp = 4, fixed = false) {
  let s = fixed ? round(v, dp).toFixed(dp) : String(round(v, dp));
  if (/e/.test(s)) s = round(v, dp).toFixed(dp);
  const neg = s[0] === '-'; if (neg) s = s.slice(1);
  let [i, f] = s.split('.');
  if (i.length >= 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');
  return (neg ? '-' : '') + i + (f != null ? '.' + f : '');
}
/** the same as plain text (thin spaces, real minus) */
const hn = (v, dp = 4, fixed) => tn(v, dp, fixed).replace(/\\,/g, '\u202f').replace('-', '−');
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const panel = (stage, x, y, w, hh, title, cls = '') => add(stage, box(h('div', 'u1l8-panel ' + cls, title ? `<div class="u1l8-ph">${title}</div>` : ''), w, hh), x, y);
const line = (p, html, cls = '') => { const d = h('div', 'u1l8-line ' + cls, html); p.appendChild(d); return d; };
const hidLine = (p, html, cls) => hide(line(p, html, cls));
/** a dot moved along a NumberLine (custom, so it can run off the end) */
function slider(N, v, color = SC, r = 10) {
  const g = svgEl('g', {}, N.layers.top);
  const ci = svgEl('circle', { cx: N.toPx(v), cy: N.ay, r, fill: color, stroke: '#fff', 'stroke-width': 2.5 }, g);
  g.v = v; g.set = (x) => { g.v = x; ci.setAttribute('cx', N.toPx(x)); };
  return g;
}

/* the three friends' colours (fill: the quarters demo is gone with the old warm-up; kept for the quad mode) */
const FRIEND = [{ name: 'Ava', col: '#1f5bd6', soft: '#d5e2fb' }, { name: 'Ben', col: '#c27a0e', soft: '#fbe8c6' }, { name: 'Cy', col: '#12805a', soft: '#cdeedd' }];
/* ====================================================================================================
 * Static figures
 * ==================================================================================================== */
const SA = [6, 8, 26 / 3, 80 / 9, 242 / 27, 728 / 81];
function sGrid(el, w = 360) {
  return new Graph(el, { width: w, height: w * 0.86, xmin: 0, xmax: 7, ymin: 0, ymax: 10, xlabels: 1, ylabels: 2, xtitle: 'n', ytitle: 'S_n', fontSize: 15 });
}
/** the ball path (booklet style) into an SVG: drop dashed, then arcs; returns geometry for the explainer */
function ballGeom(h0, r, W, Hpx, x0, gy, nArcs = 7) {
  const k = (Hpx) / h0, hs = [], ws = [];
  for (let i = 1; i <= nArcs; i++) hs.push(h0 * Math.pow(r, i));
  const sq = hs.map(Math.sqrt), tot = sq.reduce((a, b) => a + b, 0);
  let x = x0; const arcs = [];
  hs.forEach((hh, i) => { const w = (W - 10) * sq[i] / tot; arcs.push({ x1: x, x2: x + w, h: hh, py: gy - hh * k }); x += w; ws.push(w); });
  return { k, arcs, top: gy - h0 * k };
}
function arcD(a, gy) { const mx = (a.x1 + a.x2) / 2, cy = 2 * a.py - gy; return `M${a.x1.toFixed(1)} ${gy} Q${mx.toFixed(1)} ${cy.toFixed(1)} ${a.x2.toFixed(1)} ${gy}`; }
function mountFigures() {
  const f1 = document.getElementById('u1l8-ex1fig'); if (f1) sGrid(f1, 340);
  const a1 = document.getElementById('u1l8-ex1ans');
  if (a1) {
    const G = sGrid(a1, 300); G.hline(9, { color: GC, width: 2.5 });
    G.label(7, 9, T(cG('9')), { pos: 'nw', gap: 4, cls: 'bk-ptlab' });
    SA.forEach((y, i) => G.point(i + 1, y, { color: SC, r: 5.5 }));
  }
  const f6 = document.getElementById('u1l8-ex6fig');
  if (f6) {
    const W = 420, H = 230, gy = 200, x0 = 46;
    const svg = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}` }, f6);
    const g = ballGeom(9, 0.6, W - x0 - 10, 165, x0, gy, 6);
    svgEl('line', { x1: 14, x2: W - 6, y1: gy, y2: gy, stroke: INK, 'stroke-width': 3 }, svg);
    svgEl('line', { x1: x0, x2: x0, y1: g.top, y2: gy - 6, stroke: INK, 'stroke-width': 2, 'stroke-dasharray': '6 5' }, svg);
    arrowHead(svg, x0, gy - 3, 0, 1, { width: 2.2, color: INK });
    svgEl('circle', { cx: x0, cy: g.top - 8, r: 8, fill: '#e05a2a', stroke: INK, 'stroke-width': 1.5 }, svg);
    g.arcs.forEach((a) => svgEl('path', { d: arcD(a, gy), fill: 'none', stroke: INK, 'stroke-width': 2 }, svg));
    const lab = (x, y, s, pos) => { const d = h('div', 'u1l8-flab', s); f6.appendChild(place(d, x, y, pos, 4)); };
    f6.style.position = 'relative';
    lab(x0 - 4, (g.top + gy) / 2, '9 m', 'w');
    lab((g.arcs[0].x1 + g.arcs[0].x2) / 2, g.arcs[0].py, '5.4 m', 'n');
    lab((g.arcs[1].x1 + g.arcs[1].x2) / 2, g.arcs[1].py, '3.24 m', 'n');
  }
}

/* ====================================================================================================
 * explainer: fill — the star. Square pieces (left) and partial sums on a number line (right).
 * ==================================================================================================== */
const FILL = {
  halves: { label: 'Halves', mode: 'strip', k: 2, m: 1, t1: [1, 2], r: [1, 2], n: 8, max: 1, step: 0.25, labs: [[0, '0'], [0.25, '\\tfrac14'], [0.5, '\\tfrac12'], [0.75, '\\tfrac34'], [1, '1']] },
  thirds: { label: 'Thirds', mode: 'strip', k: 3, m: 2, t1: [2, 3], r: [1, 3], n: 6, max: 1, step: 1 / 3, labs: [[0, '0'], [1 / 3, '\\tfrac13'], [2 / 3, '\\tfrac23'], [1, '1']] },
  run: { label: 'Runs away: ½ + 1 + 2 + …', mode: 'grid', t1: [1, 2], r: [2, 1], n: 6, max: 16, step: 1, labs: [0, 4, 8, 12, 16].map((v) => [v, String(v)]) }
};
const PIECE = ['#1f5bd6', '#6f9cf3'];
const fill = {
  title: 'Fill the square',
  height: 470,
  minW: 940,
  choices: Object.keys(FILL).map((k) => ({ v: k, label: FILL[k].label })),
  intro: 'Add the terms one at a time: the square shows how much is shaded, the number line shows the <b>partial sum</b>. Press <b>Next</b>.',
  make(stage, key, ex) {
    const d = FILL[key], W = ex.W;
    // the terms and partial sums as fractions
    const terms = [], sums = []; let sn = 0, sd = 1;
    for (let i = 0; i < d.n; i++) {
      const n = d.t1[0] * Math.pow(d.r[0], i), dd = d.t1[1] * Math.pow(d.r[1], i);
      terms.push([n, dd]); [sn, sd] = red(sn * dd + n * sd, sd * dd); sums.push([sn, sd]);
    }
    const val = (f) => f[0] / f[1];
    const conv = d.mode !== 'grid', Sinf = conv ? d.t1[0] * d.r[1] / (d.t1[1] * (d.r[1] - d.r[0])) : null; // t1/(1 − r)
    const SinfT = conv ? fr(d.t1[0] * d.r[1], d.t1[1] * (d.r[1] - d.r[0])) : '';
    // ---------- left: the square (or the grid of squares) ----------
    const SQ = 370, X0 = 22, Y0 = 32;
    const svg = svgEl('svg', { width: SQ + 40, height: SQ + 60, viewBox: `0 0 ${SQ + 40} ${SQ + 60}`, class: 'u1l8-abs' }, stage);
    svg.style.left = '0px'; svg.style.top = '0px';
    const piecesL = svgEl('g', {}, svg), labL = h('div', 'u1l8-abs u1l8-plabs'); stage.appendChild(labL);
    const pieceEls = []; // per term: [elements]
    const pLab = (x, y, w, hh, s, col = '#fff') => {
      const size = Math.min(w, hh); if (size < 44) return null;
      const dv = h('div', 'u1l8-plab', T(s)); dv.style.color = col; dv.style.fontSize = Math.min(30, size * 0.3) + 'px';
      labL.appendChild(place(dv, X0 + x + w / 2, Y0 + y + hh / 2, 'c')); return dv;
    };
    if (d.mode === 'strip' || d.mode === 'quad') {
      svgEl('rect', { x: X0, y: Y0, width: SQ, height: SQ, fill: '#f4f1ea', stroke: 'none' }, piecesL);
      let rem = { x: 0, y: 0, w: SQ, h: SQ };
      for (let i = 0; i < d.n; i++) {
        const els = [];
        if (d.mode === 'strip') {
          const vert = rem.w >= rem.h - 0.01, part = d.m / d.k;
          const pc = vert ? { x: rem.x, y: rem.y, w: rem.w * part, h: rem.h } : { x: rem.x, y: rem.y, w: rem.w, h: rem.h * part };
          els.push(svgEl('rect', { x: X0 + pc.x, y: Y0 + pc.y, width: pc.w, height: pc.h, fill: PIECE[i % 2], stroke: '#fff', 'stroke-width': Math.max(0.8, 3 - i * 0.4) }, piecesL));
          for (let j = 1; j < d.m; j++) { // strip dividers inside a 2-of-3 piece
            const a = vert ? { x1: X0 + pc.x + pc.w * j / d.m, x2: X0 + pc.x + pc.w * j / d.m, y1: Y0 + pc.y, y2: Y0 + pc.y + pc.h } : { x1: X0 + pc.x, x2: X0 + pc.x + pc.w, y1: Y0 + pc.y + pc.h * j / d.m, y2: Y0 + pc.y + pc.h * j / d.m };
            els.push(svgEl('line', Object.assign(a, { stroke: '#fff', 'stroke-width': 1.5, 'stroke-dasharray': '5 4', opacity: 0.85 }), piecesL));
          }
          const lb = d.m > 1 ? pLab(pc.x, pc.y, vert ? pc.w / d.m : pc.w, vert ? pc.h : pc.h / d.m, fr(terms[i][0], terms[i][1])) : pLab(pc.x, pc.y, pc.w, pc.h, fr(terms[i][0], terms[i][1])); if (lb) els.push(lb);
          rem = vert ? { x: rem.x + rem.w * part, y: rem.y, w: rem.w * (1 - part), h: rem.h } : { x: rem.x, y: rem.y + rem.h * part, w: rem.w, h: rem.h * (1 - part) };
        } else {
          const hs = rem.w / 2, q = [[rem.x, rem.y], [rem.x + hs, rem.y], [rem.x, rem.y + hs]];
          q.forEach(([qx, qy], j) => {
            els.push(svgEl('rect', { x: X0 + qx, y: Y0 + qy, width: hs, height: hs, fill: j === 0 ? FRIEND[0].col : FRIEND[j].soft, stroke: '#fff', 'stroke-width': Math.max(0.8, 3 - i * 0.5) }, piecesL));
            if (j === 0) { const lb = pLab(qx, qy, hs, hs, fr(terms[i][0], terms[i][1])); if (lb) els.push(lb); }
            else if (hs >= 44) { const dv = h('div', 'u1l8-plab u1l8-plab-f', FRIEND[j].name[0]); dv.style.color = FRIEND[j].col; dv.style.fontSize = Math.min(30, hs * 0.3) + 'px'; labL.appendChild(place(dv, X0 + qx + hs / 2, Y0 + qy + hs / 2, 'c')); els.push(dv); }
          });
          rem = { x: rem.x + hs, y: rem.y + hs, w: hs, h: hs };
        }
        els.forEach(hide); pieceEls.push(els);
      }
      svgEl('rect', { x: X0, y: Y0, width: SQ, height: SQ, fill: 'none', stroke: INK, 'stroke-width': 3 }, svg);
      const cap = h('div', 'u1l8-abs u1l8-sqcap', d.mode === 'quad' ? `${T('\\text{whole bar}=1')}: Ava’s pieces in <b style="color:${FRIEND[0].col}">blue</b>` : `${T('\\text{area}=1')}`);
      stage.appendChild(place(cap, X0 + SQ / 2, 4, 's', 0));
    } else {
      // a 6 × 6 grid of unit squares, filled left to right, bottom to top
      const C = 6, cw = SQ / C;
      for (let i = 0; i < C * C; i++) { const cx = i % C, cy = C - 1 - Math.floor(i / C); svgEl('rect', { x: X0 + cx * cw + 2, y: Y0 + cy * cw + 2, width: cw - 4, height: cw - 4, fill: '#f4f1ea', stroke: '#cfc9bb', 'stroke-width': 1.5, rx: 3 }, piecesL); }
      let a = 0;
      for (let i = 0; i < d.n; i++) {
        const b = val(sums[i]), els = [];
        for (let cell = Math.floor(a); cell < Math.ceil(b - 1e-9); cell++) {
          const f0 = Math.max(a, cell) - cell, f1 = Math.min(b, cell + 1) - cell, cx = cell % C, cy = C - 1 - Math.floor(cell / C);
          els.push(svgEl('rect', { x: X0 + cx * cw + 2 + (cw - 4) * f0, y: Y0 + cy * cw + 2, width: (cw - 4) * (f1 - f0), height: cw - 4, fill: i % 2 ? '#e36a5f' : RED, rx: 2 }, piecesL));
        }
        els.forEach(hide); pieceEls.push(els); a = b;
      }
      const cap = h('div', 'u1l8-abs u1l8-sqcap', `each square has ${T('\\text{area}=1')}`);
      stage.appendChild(place(cap, X0 + SQ / 2, 4, 's', 0));
    }
    // ---------- right: readout + number line ----------
    const PX = SQ + 66, PW = W - PX - 14;
    const P = panel(stage, PX, 10, PW, 262, 'Partial sums');
    const rows = h('div', 'u1l8-psr'); P.appendChild(rows);
    const rowEls = sums.map((s, i) => {
      const t = terms[i], tT = fr(t[0], t[1]), sT = fr(s[0], s[1]);
      const r = h('div', 'u1l8-psrow', `${T(cS(`S_{${i + 1}}`) + '=' + (i ? `S_{${i}}+${tT}` : tT) + (sT !== tT || i ? '=' + cS(sT) : ''))}<span class="u1l8-psdec">${(s[1] === 1 ? '' : '≈ ') + hn(val(s), 4)}</span>`);
      return hide(r);
    });
    const shown = [0, 1, 2, d.n - 1];
    shown.forEach((i, j) => { if (j === 3) rows.appendChild(hide(h('div', 'u1l8-psrow u1l8-psdots', '⋮'))); rows.appendChild(rowEls[i]); });
    const dots = rows.querySelector('.u1l8-psdots');
    const N = new NumberLine(stage, { x: PX - 6, y: 300, width: PW + 12, height: 130, min: 0, max: d.max, step: d.step, labels: d.labs.map(([v, s]) => ({ v, html: T(s) })), axisY: 78, pad: 40 });
    const dot = slider(N, 0); hide(dot);
    let limEls = [];
    if (conv) {
      const px = N.toPx(Sinf);
      const ln = svgEl('line', { x1: px, x2: px, y1: N.ay - 64, y2: N.ay + 12, stroke: GC, 'stroke-width': 3, 'stroke-dasharray': '7 5' }, N.layers.data);
      const lb = N.hlabel(px, N.ay - 66, T(cG(`S_\\infty=${SinfT}`)), { pos: 'n', gap: 2, cls: 'u1l8-limlab' });
      limEls = [ln, lb].map(hide);
    }
    const runArrow = h('div', 'u1l8-abs u1l8-runaway', `${T(cX('S_6=31.5'))} <b>→</b>`); hide(runArrow);
    if (!conv) { stage.appendChild(place(runArrow, PX + PW - 2, 300 + 78 - 34, 'nw', 0)); }
    const verdict = h('div', 'u1l8-abs u1l8-verd ' + (conv ? 'u1l8-verd-ok' : 'u1l8-verd-no'),
      conv ? `<b>Convergent</b> ${T(`S_\\infty=\\dfrac{${cT(fr(d.t1[0], d.t1[1]))}}{1-${cR(fr(d.r[0], d.r[1]))}}=${cG(SinfT)}`)}` : `<b>Divergent</b> no ${T('S_\\infty')}`);
    stage.appendChild(conv ? at2(verdict, X0, Y0 + SQ + 4) : at2(verdict, PX, 418)); hide(verdict);
    // ---------- steps ----------
    const addTerm = async (c, i, hopIt) => {
      for (const e of pieceEls[i]) appear(c, e, 360);
      await sleep(c, 200);
      const a = i ? val(sums[i - 1]) : 0, b = val(sums[i]);
      if (!i) await appear(c, dot, 200);
      if (hopIt && N.toPx(Math.min(b, d.max)) - N.toPx(a) >= 40) N.hop(c, a, Math.min(b, d.max), { label: T(cR('+') + fr(terms[i][0], terms[i][1])), color: RC, height: Math.max(26, Math.min(56, (N.toPx(b) - N.toPx(a)) * 0.45)) });
      await tween(c, 520, (t) => dot.set(a + (Math.min(b, d.max * 1.08) - a) * t));
    };
    const rowIn = (c, i) => show(c, rowEls[i]);
    const tT = (i) => fr(terms[i][0], terms[i][1]);
    const last = d.n - 1, Sl = sums[last];
    if (!conv) {
      return [
        { cap: `Start with ${T(tT(0))} of a square: ${T(cS('S_1') + '=' + tT(0))}.`, run: async (c) => { await addTerm(c, 0, true); await rowIn(c, 0); } },
        { cap: `Each term is <b>double</b> the last (${T(cR('r=2'))}). Add ${T('1')}: ${T(cS('S_2') + '=1.5')}.`, run: async (c) => { await addTerm(c, 1, true); await rowIn(c, 1); } },
        { cap: `Add ${T('2')}: ${T(cS('S_3') + '=3.5')}. The pieces are <b>growing</b>, not shrinking.`, run: async (c) => { await addTerm(c, 2, true); await rowIn(c, 2); } },
        { cap: `Add ${T('4')}, then ${T('8')}: ${T(cS('S_5') + '=15.5')}. The dot is nearly off the line…`, run: async (c) => { await addTerm(c, 3, false); await addTerm(c, 4, false); } },
        { cap: `Add ${T('16')}: ${T(cS('S_6') + '=31.5')}, off the end. The partial sums grow <b>without limit</b>: the series is <b>divergent</b>.`,
          run: async (c) => { for (const e of pieceEls[5]) appear(c, e, 360); await tween(c, 500, (t) => dot.set(15.5 + (16.8 - 15.5) * t)); await show(c, runArrow); await show(c, dots); await rowIn(c, 5); await show(c, verdict); } }
      ];
    }
    const name = d.mode === 'quad' ? 'Ava’s share' : 'the shaded part';
    const remT = d.mode === 'quad' ? fr(Sl[1] - 3 * Sl[0], 3 * Sl[1]) : fr(Sl[1] - Sl[0], Sl[1]);
    return [
      { cap: d.mode === 'quad' ? `Round 1: Ava gets ${T(cT(tT(0)))} of the bar. ${T(cS('S_1') + '=' + tT(0))}.` : `Shade ${T(cT(tT(0)))} of the square: ${T(cS('S_1') + '=' + tT(0))}.`,
        run: async (c) => { await addTerm(c, 0, true); await rowIn(c, 0); } },
      { cap: d.mode === 'quad' ? `Round 2: the leftover quarter is cut in 4. Ava adds ${T(tT(1))}: ${T(cS('S_2') + '=' + fr(sums[1][0], sums[1][1]))}.` : `Shade ${d.k === 2 ? 'half' : 'two thirds'} of what is <b>left</b>: add ${T(tT(1))}. ${T(cS('S_2') + '=' + fr(sums[1][0], sums[1][1]))}.`,
        run: async (c) => { await addTerm(c, 1, true); await rowIn(c, 1); } },
      { cap: `Add ${T(tT(2))}: ${T(cS('S_3') + '=' + fr(sums[2][0], sums[2][1]))}. Each term is ${T(cR('r=' + fr(d.r[0], d.r[1])))} of the one before.`,
        run: async (c) => { await addTerm(c, 2, true); await rowIn(c, 2); } },
      { cap: `Keep going: ${T(cS(`S_{${d.n}}`) + '\\approx' + tn(val(Sl), 4))}. The partial sums <b>creep toward</b> ${T(cG(SinfT))}, in smaller and smaller hops.`,
        run: async (c) => { for (let i = 3; i < d.n; i++) { await addTerm(c, i, false); } await show(c, dots); await rowIn(c, last); } },
      { cap: `…but never pass it: ${d.mode === 'quad' ? `Ben and Cy always have as much as Ava, and a sliver is still left` : `a sliver (${T(remT)}) is still unshaded`}. <b>Convergent</b>: ${T(cG('S_\\infty=' + SinfT))}, and the formula agrees.`,
        run: async (c) => { for (const e of limEls) await show(c, e); await show(c, verdict); } }
    ];
  }
};
function at2(el, x, y) { el.style.left = x + 'px'; el.style.top = y + 'px'; return el; }

/* ====================================================================================================
 * explainer: gate — −1 < r < 1 on a number line; Example 2 checks
 * ==================================================================================================== */
const GS = {
  abc: { label: 'Example 2 check: (a)–(c)', items: [
    { p: '(a)', s: '45+15+5+\\dots', rT: '\\tfrac{15}{45}=\\tfrac13', r: 1 / 3, sum: '\\dfrac{45}{1-\\frac13}=\\dfrac{45}{\\frac23}=67.5', sv: '67.5' },
    { p: '(b)', s: '20-16+12.8-\\dots', rT: '\\tfrac{-16}{20}=-0.8', r: -0.8, sum: '\\dfrac{20}{1-(-0.8)}=\\dfrac{20}{1.8}\\approx11.11', sv: '11.11' },
    { p: '(c)', s: '2+5+12.5+\\dots', rT: '\\tfrac52=2.5', r: 2.5, why: `${T('2.5\\ge1')}` }] },
  def: { label: 'Example 2 check: (d)–(f)', items: [
    { p: '(d)', s: '4-4+4-4+\\dots', rT: '\\tfrac{-4}{4}=-1', r: -1, why: `${T('r=-1')}: sums ${T('4,0,4,0,\\dots')}` },
    { p: '(e)', s: '\\tfrac34+\\tfrac12+\\tfrac13+\\dots', rT: '\\tfrac12\\div\\tfrac34=\\tfrac23', r: 2 / 3, sum: '\\dfrac{\\frac34}{1-\\frac23}=\\dfrac{\\frac34}{\\frac13}=\\dfrac94', sv: '\\tfrac94' },
    { p: '(f)', s: '0.006+0.06+0.6+\\dots', rT: '\\tfrac{0.06}{0.006}=10', r: 10, why: 'even though the first terms are tiny' }] }
};
const gate = {
  title: 'Through the gate?',
  height: 470,
  minW: 940,
  choices: Object.keys(GS).map((k) => ({ v: k, label: GS[k].label })),
  intro: 'Find ' + T('r') + ', then see whether it lands <b>inside</b> the gate ' + T('-1<r<1') + '. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = GS[k], W = ex.W;
    const N = new NumberLine(stage, { x: 30, y: 4, width: W - 60, height: 150, min: -3, max: 3, step: 0.5, labelStep: 1, axisY: 104, pad: 46 });
    const ok = N.interval(-1, 1, { openA: true, openB: true, color: GC, width: 9 });
    const no1 = N.interval(-Infinity, -1, { color: RED, width: 9 }), no2 = N.interval(1, Infinity, { color: RED, width: 9 });
    const lab1 = N.mark(0, `<b class="u1l8-cs">converges</b>`, { lift: 46 }), lab2 = N.mark(-2.1, `<b class="u1l8-cx">diverges</b>`, { lift: 46 }), lab3 = N.mark(2.1, `<b class="u1l8-cx">diverges</b>`, { lift: 46 });
    const gateEls = [ok, no1, no2, lab1, lab2, lab3].map(hide);
    const CW = (W - 40 - 2 * 14) / 3;
    const cards = d.items.map((it, i) => {
      const cd = add(stage, box(h('div', 'u1l8-gcard'), CW, 290), 20 + i * (CW + 14), 170);
      cd.innerHTML = `<div class="u1l8-gch"><b>${it.p}</b> ${T(it.s)}</div>`;
      const l1 = hidLine(cd, T(cR('r=' + it.rT)));
      const conv = Math.abs(it.r) < 1;
      const l2 = hidLine(cd, conv ? `<b class="u1l8-cs">Convergent</b>` : `<b class="u1l8-cx">Divergent</b>${it.why ? '<br><span class="u1l8-small">' + it.why + '</span>' : ''}`, 'u1l8-gv');
      const sp = conv ? it.sum.split('=') : [];
      const l3 = conv ? hidLine(cd, T('S_\\infty=' + sp[0]) + '<br>' + T('=' + sp.slice(1).join('=')), 'u1l8-gs') : hidLine(cd, 'No sum to infinity.', 'u1l8-gs');
      // the pin on the gate
      const inside = it.r >= -3 && it.r <= 3, v = inside ? it.r : 3.35;
      const pin = svgEl('g', {}, N.layers.top);
      const px = N.toPx(Math.min(v, 3)) + (inside ? 0 : 30);
      svgEl('line', { x1: px, x2: px, y1: N.ay - 30, y2: N.ay - 2, stroke: conv ? GC : RED, 'stroke-width': 3 }, pin);
      svgEl('circle', { cx: px, cy: N.ay, r: 8, fill: conv ? GC : RED, stroke: '#fff', 'stroke-width': 2 }, pin);
      const pl = N.hlabel(px, N.ay - 30, `<b>${it.p}</b>${inside ? '' : ' ' + T('r=10') + ' →'}`, { pos: inside ? 'n' : 'nw', gap: 2, cls: 'u1l8-pinlab' + (conv ? '' : ' u1l8-pinno') });
      if (!inside) { svgEl('path', { d: `M${px - 26} ${N.ay} L${px + 6} ${N.ay}`, stroke: RED, 'stroke-width': 3, fill: 'none' }, pin); arrowHead(pin, px + 16, N.ay, 1, 0, { color: RED, width: 3 }); }
      hide(pin); hide(pl);
      return { it, cd, l1, l2, l3, pin, pl, conv };
    });
    const steps = [{ cap: `The gate: if ${T(cR('r'))} is strictly between ${T('-1')} and ${T('1')} the series <b>converges</b>; ${T('r\\le-1')} or ${T('r\\ge1')} <b>diverges</b> (the end points ${T('\\pm1')} are <b>out</b>).`,
      run: async (c) => { await Promise.all([G2(c, ok), G2(c, no1), G2(c, no2)]); for (const e of [lab1, lab2, lab3]) await show(c, e); } }];
    cards.forEach((q) => {
      steps.push({ cap: `${q.it.p} ${T(q.it.s)}: divide a term by the one before it. ${T(cR('r=' + q.it.rT))}.`, run: async (c) => { await show(c, q.l1); await appear(c, q.pin, 300); await show(c, q.pl); } });
      steps.push({ cap: q.conv ? `${T('r=' + q.it.rT.split('=').pop())} is <b>inside</b> the gate: convergent. ${T('S_\\infty=' + q.it.sum)}.` : `${T('r=' + q.it.rT.split('=').pop())} is <b>outside</b> the gate: divergent, no sum to infinity.`,
        run: async (c) => { await show(c, q.l2); await show(c, q.l3); } });
    });
    return steps;
  }
};
const G2 = (c, el) => drawIn(el, 600, c).then(() => { el.style.opacity = 1; });

/* ====================================================================================================
 * explainer: decimal — repeating decimal → blocks → S∞
 * ==================================================================================================== */
const DC = {
  a: { label: 'Example 5(a): ' + T('0.\\overline{4}'), show: '0.\\overline{4}', pre: '', lead: 0, block: '4', rT: '0.1', rows: 4, t1T: '0.4', sumT: '\\dfrac{0.4}{1-0.1}=\\dfrac{0.4}{0.9}=\\dfrac49', ans: '\\dfrac49', check: '4 ÷ 9 = 0.4444…' },
  b: { label: '(b): ' + T('0.\\overline{63}'), show: '0.\\overline{63}', pre: '', lead: 0, block: '63', rT: '0.01', rows: 4, t1T: '0.63', sumT: '\\dfrac{0.63}{1-0.01}=\\dfrac{0.63}{0.99}=\\dfrac{63}{99}=\\dfrac{7}{11}', ans: '\\dfrac{7}{11}', check: '7 ÷ 11 = 0.6363…' },
  c: { label: '(c): ' + T('1.2\\overline{7}'), show: '1.2\\overline{7}', pre: '1.2', lead: 1, block: '7', rT: '0.1', rows: 4, t1T: '0.07', sumT: '\\dfrac{0.07}{1-0.1}=\\dfrac{0.07}{0.9}=\\dfrac{7}{90}', ans: '\\dfrac{108}{90}+\\dfrac{7}{90}=\\dfrac{115}{90}=\\dfrac{23}{18}', check: '23 ÷ 18 = 1.2777…' },
  e: { label: T('0.\\overline{5}'), show: '0.\\overline{5}', pre: '', lead: 0, block: '5', rT: '0.1', rows: 4, t1T: '0.5', sumT: '\\dfrac{0.5}{1-0.1}=\\dfrac{0.5}{0.9}=\\dfrac59', ans: '\\dfrac59', check: '5 ÷ 9 = 0.5555…' }
};
const decimal = {
  title: 'A repeating decimal is a series',
  height: 450,
  minW: 940,
  choices: Object.keys(DC).map((k) => ({ v: k, label: DC[k].label })),
  intro: (k) => `Write ${T(DC[k].show)} as a fraction. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = DC[k], W = ex.W, B = d.block.length, CW = 34, X0 = 120, Y0 = 108, RH = 50;
    const big = add(stage, h('div', 'u1l8-dbig', T(d.show + '=' + (d.pre ? d.pre : '0.') + Array(5).fill(d.block).join('').slice(d.pre ? 0 : 0, 10) + '\\dots')), 24, 12);
    // column addition: col 0 = units, col 1 = point, decimals from col 2
    const cx = (col) => X0 + (col === 0 ? 0 : col === 1 ? CW * 0.62 : CW * (col - 0.76));
    const grid = h('div', 'u1l8-abs u1l8-dgrid'); stage.appendChild(grid); at2(grid, 0, 0);
    const rows = [], colors = [TC, RC, SC, PUR];
    const mkRow = (digits, y, colorFn, cls = '') => {
      const r = h('div', 'u1l8-abs u1l8-drow ' + cls); grid.appendChild(at2(r, 0, y));
      digits.forEach(([col, ch], i) => { const e = h('div', 'u1l8-dg', ch); e.style.left = cx(col) + 'px'; const cc = colorFn(i, ch); if (cc) e.style.color = cc; r.appendChild(e); });
      return hide(r);
    };
    let preRow = null;
    if (d.pre) { // the part that does not repeat
      preRow = mkRow([[0, '1'], [1, '.'], [2, '2']], Y0, () => GRAY, 'u1l8-dpre');
    }
    const base = d.pre ? 1 : 0; // the first block starts after the non-repeating decimals
    for (let i = 0; i < d.rows; i++) {
      const start = base + i * B, digs = [[0, '0'], [1, '.']];
      for (let j = 0; j < start; j++) digs.push([2 + j, '0']);
      for (let j = 0; j < B; j++) digs.push([2 + start + j, d.block[j]]);
      rows.push(mkRow(digs, Y0 + (i + (d.pre ? 1 : 0)) * RH, (q, ch) => (q >= 2 + start ? colors[i % 4] : '#a7abb4')));
    }
    const nR = d.rows + (d.pre ? 1 : 0);
    const vdots = hide(add(stage, h('div', 'u1l8-dvd', '⋮'), cx(2 + base) - 4, Y0 + nR * RH - 14));
    const plus = hide(add(stage, h('div', 'u1l8-dplus', '+'), X0 - 56, Y0 + (nR - 1) * RH + 4));
    const RX = cx(2 + base + d.rows * B) + 10;
    const ratios = rows.slice(1).map((r, i) => hide(add(stage, h('div', 'u1l8-drat', `↓ ${T(cR('\\times' + d.rT))}`), RX, Y0 + (i + (d.pre ? 1 : 0)) * RH + 26)));
    const brace = d.pre ? hide(add(stage, h('div', 'u1l8-dnote', 'keep separate'), cx(4) + 6, Y0 + 8)) : null;
    const PX = 530, P = panel(stage, PX, 100, W - PX - 14, 340, 'The series');
    const p1 = hidLine(P, `${T(cT('t_1=' + d.t1T))},&ensp;${T(cR('r=' + d.rT))}`, 'u1l8-mid');
    const sp = d.sumT.split('='), p2 = hidLine(P, T('S_\\infty=' + sp[0]) + '<br>' + T('=' + sp.slice(1).join('=')), 'u1l8-mid');
    const p3 = d.pre ? hidLine(P, T(d.show + '=1.2+\\dfrac{7}{90}') + '<br>' + T('=' + d.ans), 'u1l8-mid') : null;
    const p4 = hidLine(P, `<span class="u1l8-small">Check: ${d.check}</span>`);
    const seriesT = (d.pre ? '1.2+(' : '') + [0, 1, 2].map((i) => '0.' + '0'.repeat(base + i * B) + d.block).join('+') + '+\\dots' + (d.pre ? ')' : '');
    const steps = [];
    if (d.pre) steps.push({ cap: `Only the ${T('7')} repeats. Keep ${T('1.2')} <b>separate</b> and add it at the end.`, run: async (c) => { await show(c, preRow); await show(c, brace); } });
    steps.push({ cap: `Split the repeating part into ${B === 1 ? '1-digit' : B + '-digit'} blocks, one block per row: ${T(seriesT)}`,
      run: async (c) => { await show(c, plus); for (const r of rows) await show(c, r); await show(c, vdots); } });
    steps.push({ cap: `Each block is the one before it moved <b>${B} place${B > 1 ? 's' : ''}</b> right: multiply by ${T(cR(d.rT))}. A geometric series with ${T(cT('t_1=' + d.t1T))} and ${T(cR('r=' + d.rT))}.`,
      run: async (c) => { for (const r of ratios) await show(c, r); await show(c, p1); } });
    steps.push({ cap: `${T(cR('r=' + d.rT))} is between ${T('-1')} and ${T('1')}, so ${T('S_\\infty=' + d.sumT)}.`, run: (c) => show(c, p2) });
    if (d.pre) steps.push({ cap: `Add back the ${T('1.2=\\tfrac{12}{10}=\\tfrac{108}{90}')}: ${T(d.show + '=' + d.ans)}.`, run: (c) => show(c, p3) });
    steps.push({ cap: `Check with division: ${d.check} ✓`, run: (c) => show(c, p4) });
    return steps;
  }
};

/* ====================================================================================================
 * explainer: bounce — the ball's down and up trips, added on a tape
 * ==================================================================================================== */
const BB = {
  ex6: { label: 'Example 6 check: 9 m, 60%', h0: 9, r: 0.6, rT: '0.6', pct: '60\\%', tapeMax: 40, tick: 5, dn: 22.5, up: 13.5, tot: 36 },
  ten: { label: '10 m, 50%', h0: 10, r: 0.5, rT: '0.5', pct: '50\\%', tapeMax: 40, tick: 5, dn: 20, up: 10, tot: 30 }
};
const DNC = '#1f5bd6', UPC = '#7b4fc4';
const bounce = {
  title: 'Down and up, forever',
  height: 470,
  minW: 940,
  choices: Object.keys(BB).map((k) => ({ v: k, label: BB[k].label })),
  intro: (k) => `Dropped from ${T(BB[k].h0 + '\\text{ m}')}, rising to ${T(BB[k].pct)} of each fall. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = BB[k], W = ex.W, gy = 290, x0 = 70, PX = 600;
    const svg = svgEl('svg', { width: PX, height: 470, viewBox: `0 0 ${PX} 470`, class: 'u1l8-abs' }, stage); svg.style.left = svg.style.top = '0px';
    const g = ballGeom(d.h0, d.r, PX - x0 - 20, 230, x0, gy, 7);
    svgEl('rect', { x: 10, y: gy, width: PX - 20, height: 12, fill: '#d9d3c4' }, svg);
    svgEl('line', { x1: 10, x2: PX - 10, y1: gy, y2: gy, stroke: INK, 'stroke-width': 3 }, svg);
    const trail = svgEl('g', {}, svg);
    const ball = svgEl('circle', { cx: x0, cy: g.top - 11, r: 11, fill: '#e05a2a', stroke: INK, 'stroke-width': 1.6 }, svg);
    const setBall = (x, y) => { ball.setAttribute('cx', x); ball.setAttribute('cy', y - 11); };
    const hl = (x, y, s, col, pos) => { const dv = hide(h('div', 'u1l8-abs u1l8-blab', s)); dv.style.color = col; stage.appendChild(place(dv, x, y, pos, 4)); return dv; };
    const dropL = hl(x0 - 8, (g.top + gy) / 2, `${hn(d.h0)} m`, DNC, 'w');
    const arcL = g.arcs.slice(0, 2).map((a) => hl((a.x1 + a.x2) / 2, a.py - 6, `${hn(a.h, 3)} m`, UPC, 'n'));
    // the tape: running total distance
    const TY = 370, TX0 = 30, TX1 = W - 30, sc = (v) => TX0 + (TX1 - TX0) * v / d.tapeMax;
    const tape = svgEl('svg', { width: W, height: 100, viewBox: `0 0 ${W} 100`, class: 'u1l8-abs' }, stage); tape.style.left = '0px'; tape.style.top = TY + 'px';
    svgEl('rect', { x: TX0, y: 10, width: TX1 - TX0, height: 30, fill: '#f1eee6', stroke: '#c9c3b4', rx: 4 }, tape);
    for (let v = 0; v <= d.tapeMax; v += d.tick) { svgEl('line', { x1: sc(v), x2: sc(v), y1: 40, y2: 48, stroke: INK, 'stroke-width': 1.5 }, tape); const t = svgEl('text', { x: sc(v), y: 66, 'text-anchor': 'middle', class: 'u1l8-tapen' }, tape); t.textContent = v; }
    const tapeT = add(stage, h('div', 'u1l8-tapet', 'total distance (m)'), TX0, TY - 22);
    const totLine = svgEl('line', { x1: sc(d.tot), x2: sc(d.tot), y1: 0, y2: 50, stroke: GC, 'stroke-width': 3, 'stroke-dasharray': '6 4' }, tape); hide(totLine);
    const totLab = hide(add(stage, h('div', 'u1l8-tapetot', T(cG(d.tot + '\\text{ m}'))), sc(d.tot) - 34, TY - 28));
    let tx = 0; const segs = [];
    const seg = (len, col) => { const r = svgEl('rect', { x: sc(tx), y: 12, width: Math.max(0.5, sc(tx + len) - sc(tx)), height: 26, fill: col, stroke: '#fff', 'stroke-width': 1 }, tape); tx += len; return hide(r); };
    // segments: drop h0, then up/down pairs
    const plan = [seg(d.h0, DNC)];
    for (let i = 0; i < 7; i++) { plan.push(seg(g.arcs[i].h, UPC)); plan.push(seg(g.arcs[i].h, DNC)); }
    const PP = panel(stage, PX + 6, 6, W - PX - 18, 340, 'Two series');
    const l1 = hidLine(PP, `<b style="color:${DNC}">Down:</b> ${T(`${cT(tn(d.h0))}+${tn(d.h0 * d.r, 3)}+${tn(d.h0 * d.r * d.r, 3)}+\\dots`)}`);
    const l1b = hidLine(PP, T(`S_\\infty=\\dfrac{${cT(tn(d.h0))}}{1-${cR(d.rT)}}=${tn(d.dn)}\\text{ m}`), 'u1l8-mid');
    const l2 = hidLine(PP, `<b style="color:${UPC}">Up:</b> ${T(`${cT(tn(d.h0 * d.r, 3))}+${tn(d.h0 * d.r * d.r, 3)}+\\dots`)}`);
    const l2b = hidLine(PP, T(`S_\\infty=\\dfrac{${cT(tn(d.h0 * d.r, 3))}}{1-${cR(d.rT)}}=${tn(d.up)}\\text{ m}`), 'u1l8-mid');
    const l3 = hidLine(PP, T(`\\text{Total}=${tn(d.dn)}+${tn(d.up)}=${cG(d.tot + '\\text{ m}')}`), 'u1l8-big');
    const fall = (c, x, y0) => tween(c, 520, (t) => setBall(x, y0 + (gy - y0) * t * t), (t) => t);
    const arc = (c, a) => tween(c, 760, (t) => { const x = a.x1 + (a.x2 - a.x1) * t, y = gy - (gy - a.py) * 4 * t * (1 - t); setBall(x, y); }, (t) => t);
    const drawArc = (a, part) => { const p = svgEl('path', { d: arcD(a, gy), fill: 'none', stroke: part ? UPC : INK, 'stroke-width': 2.2, opacity: 0.6 }, trail); return p; };
    const dropLine = svgEl('line', { x1: x0, x2: x0, y1: g.top, y2: gy, stroke: DNC, 'stroke-width': 2.4, 'stroke-dasharray': '6 5' }, trail); hide(dropLine);
    const h1 = tn(d.h0 * d.r, 3), h2 = tn(d.h0 * d.r * d.r, 3);
    return [
      { cap: `The ball falls ${T(cT(tn(d.h0)) + '\\text{ m}')}: the first <b style="color:${DNC}">down</b> trip.`, run: async (c) => { await appear(c, dropLine, 200); await fall(c, x0, g.top); await show(c, dropL); await appear(c, plan[0], 300); } },
      { cap: `It rises to ${T(cR(d.pct))} of that: ${T(`${tn(d.h0)}(${d.rT})=${h1}\\text{ m}`)} <b style="color:${UPC}">up</b>, then ${T(h1 + '\\text{ m}')} <b style="color:${DNC}">down</b> again.`,
        run: async (c) => { drawArc(g.arcs[0], 1); await arc(c, g.arcs[0]); await show(c, arcL[0]); await appear(c, plan[1], 250); await appear(c, plan[2], 250); } },
      { cap: `Then ${T(h2 + '\\text{ m}')} up and down, and so on: every rebound height is travelled <b>twice</b>.`,
        run: async (c) => { for (let i = 1; i < 7; i++) { drawArc(g.arcs[i], 1); await arc(c, g.arcs[i]); if (arcL[i]) await show(c, arcL[i]); await appear(c, plan[2 * i + 1], 120); await appear(c, plan[2 * i + 2], 120); } } },
      { cap: `<b style="color:${DNC}">Down</b> trips: ${T(`${tn(d.h0)}+${h1}+${h2}+\\dots`)} with ${T(cT('t_1=' + tn(d.h0)))}, ${T(cR('r=' + d.rT))}: ${T('S_\\infty=' + tn(d.dn) + '\\text{ m}')}.`, run: async (c) => { await show(c, l1); await show(c, l1b); } },
      { cap: `<b style="color:${UPC}">Up</b> trips start at the first rebound: ${T(cT('t_1=' + h1))}, same ${T(cR('r'))}: ${T('S_\\infty=' + tn(d.up) + '\\text{ m}')}.`, run: async (c) => { await show(c, l2); await show(c, l2b); } },
      { cap: `Total: ${T(`${tn(d.dn)}+${tn(d.up)}=${cG(d.tot + '\\text{ m}')}`)}. The tape creeps toward it but never passes.`, run: async (c) => { await show(c, l3); await appear(c, totLine, 300); await show(c, totLab); } }
    ];
  }
};

/* ====================================================================================================
 * explainer: xrange — x on one line, r on another; pull the gate back to x
 * ==================================================================================================== */
const XR = {
  ex8: { label: 'Example 8 check', s: '3+\\dfrac{3x}{2}+\\dfrac{3x^2}{4}+\\dots', rFind: 'r=\\dfrac{3x}{2}\\div3=\\dfrac{x}{2}', rx: (x) => x / 2, rT: '\\dfrac{x}{2}', xmin: -4, xmax: 4, lo: -2, hi: 2,
    tries: [1, 3, -1.5], solve: ['-1<\\dfrac{x}{2}<1', '-2<x<2'], solveCap: 'Multiply <b>all three parts</b> by 2', sinf: 'S_\\infty=\\dfrac{3}{1-\\frac{x}{2}}=\\dfrac{6}{2-x}', at: 'x=1:\\ S_\\infty=\\dfrac{6}{2-1}=6', inv: '\\dfrac{6}{2-x}=4\\Rightarrow 2-x=1.5\\Rightarrow x=0.5', inv1: '\\dfrac{6}{2-x}=4', inv2: '2-x=1.5\\ \\Rightarrow\\ x=0.5', invX: 0.5 },
  t3: { label: T('1+3x+9x^2+\\dots'), s: '1+3x+9x^2+\\dots', rFind: 'r=\\dfrac{3x}{1}=3x', rx: (x) => 3 * x, rT: '3x', xmin: -1, xmax: 1, lo: -1 / 3, hi: 1 / 3,
    tries: [0.2, 0.5, -0.3], solve: ['-1<3x<1', '-\\tfrac13<x<\\tfrac13'], solveCap: 'Divide <b>all three parts</b> by 3', sinf: 'S_\\infty=\\dfrac{1}{1-3x}', at: 'x=0.2:\\ S_\\infty=\\dfrac{1}{1-0.6}=2.5', inv: null }
};
const xrange = {
  title: 'Which values of x make it converge?',
  height: 470,
  minW: 940,
  choices: Object.keys(XR).map((k) => ({ v: k, label: XR[k].label })),
  intro: (k) => `${T(XR[k].s)}: the ratio depends on ${T('x')}. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = XR[k], W = ex.W, NW = 600;
    const tick = (d.xmax - d.xmin) / 8;
    const NX = new NumberLine(stage, { x: 10, y: 20, width: NW, height: 110, min: d.xmin, max: d.xmax, step: tick, labelStep: tick * 2, axisY: 62, pad: 40 });
    const NR = new NumberLine(stage, { x: 10, y: 250, width: NW, height: 110, min: -2, max: 2, step: 0.25, labelStep: 1, axisY: 62, pad: 40 });
    const tX = add(stage, h('div', 'u1l8-nlt', T('x')), 22, 24), tR = add(stage, h('div', 'u1l8-nlt', T(cR('r=' + d.rT))), 22, 252);
    const gOk = NR.interval(-1, 1, { openA: true, openB: true, color: GC, width: 8 }), gN1 = NR.interval(-Infinity, -1, { color: RED, width: 8 }), gN2 = NR.interval(1, Infinity, { color: RED, width: 8 });
    [gOk, gN1, gN2].forEach(hide);
    const conn = svgEl('svg', { width: NW + 20, height: 470, viewBox: `0 0 ${NW + 20} 470`, class: 'u1l8-abs u1l8-conn' }, stage); conn.style.left = '0px'; conn.style.top = '0px';
    const tryEls = d.tries.map((x) => {
      const r = d.rx(x), ok = Math.abs(r) < 1, col = ok ? GC : RED, px1 = 10 + NX.toPx(x), py1 = 20 + NX.ay, rClamp = Math.max(-2.2, Math.min(2.2, r)), px2 = 10 + NR.toPx(rClamp), py2 = 250 + NR.ay;
      const g = svgEl('g', {}, conn);
      svgEl('path', { d: `M${px1} ${py1 + 10} C${px1} ${py1 + 90} ${px2} ${py2 - 90} ${px2} ${py2 - 10}`, fill: 'none', stroke: col, 'stroke-width': 2.5, 'stroke-dasharray': '6 5' }, g);
      svgEl('circle', { cx: px1, cy: py1, r: 8, fill: col, stroke: '#fff', 'stroke-width': 2 }, g);
      svgEl('circle', { cx: px2, cy: py2, r: 8, fill: col, stroke: '#fff', 'stroke-width': 2 }, g);
      const l1 = NX.hlabel(NX.toPx(x), NX.ay - 12, T(`x=${tn(x)}`), { pos: 'n', gap: 2, cls: 'u1l8-pinlab' + (ok ? '' : ' u1l8-pinno') });
      const l2 = NR.hlabel(NR.toPx(rClamp), NR.ay + 36, T(`r=${tn(r)}`), { pos: 's', gap: 2, cls: 'u1l8-pinlab' + (ok ? '' : ' u1l8-pinno') });
      return { g: hide(g), l1: hide(l1), l2: hide(l2), x, r, ok };
    });
    const xInt = NX.interval(d.lo, d.hi, { openA: true, openB: true, color: GC, width: 9 }); hide(xInt);
    const PX = NW + 30, P = panel(stage, PX, 8, W - PX - 12, 454, T(d.s));
    const p1 = hidLine(P, T(cR(d.rFind)), 'u1l8-mid');
    const p2 = hidLine(P, T(d.solve[0]), 'u1l8-mid'), p3 = hidLine(P, T(cG(d.solve[1])), 'u1l8-big');
    const p4 = hidLine(P, T(d.sinf), 'u1l8-mid'), p5 = hidLine(P, T(d.at), 'u1l8-mid');
    const p6 = d.inv ? hidLine(P, T(d.inv1) + '<br>' + T(d.inv2), 'u1l8-mid') : null;
    const tryCap = d.tries.map((x, i) => { const t = tryEls[i]; return `${T(`x=${tn(x)}`)} gives ${T(cR(`r=${tn(t.r)}`))}: ${t.ok ? '<b class="u1l8-cs">converges</b>' : '<b class="u1l8-cx">diverges</b>'}`; });
    const steps = [
      { cap: `Divide the second term by the first: ${T(cR(d.rFind))}.`, run: async (c) => { await show(c, p1); for (const e of [gOk, gN1, gN2]) await G2(c, e); } },
      { cap: `Try some values. ${tryCap.join('; ')}.`, run: async (c) => { for (const t of tryEls) { await appear(c, t.g, 300); await show(c, t.l1); await show(c, t.l2); } } },
      { cap: `It converges when ${T(cR('r'))} is in the gate: ${T(d.solve[0])}. ${d.solveCap}: ${T(cG(d.solve[1]))}.`, run: async (c) => { await show(c, p2); await show(c, p3); await G2(c, xInt); } },
      { cap: `For those ${T('x')}: ${T(d.sinf)}. ${T(d.at)}${k === 'ex8' ? ' (Example 8(b))' : ''}.`, run: async (c) => { await show(c, p4); await show(c, p5); } }
    ];
    if (d.inv) {
      const px = 10 + NX.toPx(d.invX);
      const star = svgEl('g', {}, conn); svgEl('circle', { cx: px, cy: 20 + NX.ay, r: 11, fill: '#fff', stroke: SC, 'stroke-width': 4 }, star); hide(star);
      const sl = hide(NX.hlabel(NX.toPx(d.invX), NX.ay + 46, T(cS('x=0.5')), { pos: 's', gap: 2, cls: 'u1l8-pinlab' }));
      steps.push({ cap: `Example 8(c): ${T(d.inv)}. Check: ${T('-2<0.5<2')} ✓, so it converges (${T(cR('r=0.25'))}).`, run: async (c) => { await show(c, p6); await appear(c, star, 300); await show(c, sl); } });
    }
    return steps;
  }
};

/* =============================== Stand Up Break! (whiteboard stations; ../standup.js) ===============================
 * Sits after Section 3. BEG: convergent or divergent, and S∞ if it exists (three terms shown). PRG: find t1 or r from S∞
 * (sometimes no such series). MAS: a repeating decimal as a fraction, or a bouncing ball's total distance. */
const fT = (n, d) => fr(n, d, true);
const termT = (n, d) => fr(n, d, false);
const seriesTex = (a) => a.map((t, i) => { const s = termT(t[0], t[1]); return i === 0 ? s : (s.startsWith('-') ? s : '+' + s); }).join('') + '+\\dots';
standup('u1l8', {
  intro: 'At your whiteboard: check r against the gate first, then use S∞ = t₁ ÷ (1 − r).',
  levels: {
    BEG: (r) => {
      const R = r.pick([[1, 2], [1, 3], [1, 4], [2, 3], [3, 4], [-1, 2], [-1, 3], [-2, 3], [3, 2], [2, 1], [-2, 1], [5, 4], [-1, 1]]);
      const m = r.int(1, 4), t1 = [m * R[1] * R[1], 1];
      const terms = [0, 1, 2].map((i) => red(t1[0] * Math.pow(R[0], i), Math.pow(R[1], i)));
      const rT = fr(R[0], R[1]), conv = Math.abs(R[0]) < R[1];
      const a = [`r=\\dfrac{t_2}{t_1}=${rT}`];
      if (conv) a.push(`-1<${rT}<1:\\ \\text{convergent}`, `S_\\infty=\\dfrac{${t1[0]}}{1-(${rT})}=${fT(t1[0] * R[1], R[1] - R[0])}`);
      else a.push(`${rT}${R[0] / R[1] >= 1 ? '\\ge1' : '\\le-1'}:\\ \\text{divergent, no }S_\\infty`);
      return { text: 'Is the infinite geometric series <b>convergent</b> or <b>divergent</b>? Give <i>S</i><sub>∞</sub> if it exists.', q: seriesTex(terms), a };
    },
    PRG: (r) => {
      if (r.chance(0.5)) { // find t1
        const R = r.pick([0.2, 0.25, 0.4, 0.5, 0.6, 0.75, 0.8, -0.2, -0.25, -0.5, -0.6]), S = r.pick([20, 30, 40, 60, 80, 100, 120]);
        const t1 = round(S * (1 - R), 4);
        return { text: `An infinite geometric series has <i>S</i><sub>∞</sub> = ${S} and <i>r</i> = ${hn(R)}. Determine <i>t</i><sub>1</sub>.`, q: '',
          a: [`${S}=\\dfrac{t_1}{1-(${tn(R)})}=\\dfrac{t_1}{${tn(1 - R)}}`, `t_1=${S}(${tn(1 - R)})=${tn(t1)}`] };
      }
      const pairs = [[12, 16], [15, 20], [18, 24], [35, 28], [24, 16], [10, 8], [21, 14], [40, 16], [6, 10], [27, 12], [45, 18]];
      const [t1, S] = r.pick(pairs), one = t1 / S, R = round(1 - one, 4), ok = R > -1 && R < 1;
      return { text: `An infinite geometric series has <i>t</i><sub>1</sub> = ${t1} and <i>S</i><sub>∞</sub> = ${S}. Determine <i>r</i>${ok ? '' : ', if possible'}.`, q: '',
        a: [`${S}=\\dfrac{${t1}}{1-r}\\Rightarrow 1-r=\\dfrac{${t1}}{${S}}=${tn(one)}`, `r=${tn(R)}`, ok ? `-1<${tn(R)}<1\\ \\checkmark` : `${tn(R)}\\le-1:\\ \\text{no such series}`] };
    },
    MAS: (r) => {
      const kind = r.int(0, 2);
      if (kind === 0) { // 0.\overline{ab}
        let ab; do { ab = r.int(10, 98); } while (ab % 11 === 0 || [45, 24, 63].includes(ab));
        const [n, d] = red(ab, 99), b = String(ab);
        return { text: 'Use an infinite geometric series to write the repeating decimal as a fraction in lowest terms.', q: `0.\\overline{${b}}`,
          a: [`0.${b}+0.00${b}+\\dots,\\ \\ t_1=0.${b},\\ r=0.01`, `S_\\infty=\\dfrac{0.${b}}{0.99}=\\dfrac{${ab}}{99}${d === 99 ? '' : '=' + fT(n, d)}`] };
      }
      if (kind === 1) { // 0.a\overline{b}
        let a, b; do { a = r.int(1, 8); b = r.int(1, 9); } while (a === b || (a === 4 && b === 6) || (a === 2 && b === 7));
        const [n, d] = red(9 * a + b, 90);
        return { text: 'Use an infinite geometric series to write the repeating decimal as a fraction in lowest terms.', q: `0.${a}\\overline{${b}}`,
          a: [`0.${a}+(0.0${b}+0.00${b}+\\dots)`, `\\dfrac{${a}}{10}+\\dfrac{0.0${b}}{0.9}=\\dfrac{${9 * a}}{90}+\\dfrac{${b}}{90}=${fT(n, d)}`] };
      }
      const H = r.pick([5, 6, 8, 10, 12, 15]), R = r.pick([[1, 2], [3, 5], [3, 4], [4, 5], [2, 3]]);
      const rv = R[0] / R[1], dn = H / (1 - rv), up = H * rv / (1 - rv);
      return { text: `A ball is dropped from ${H} m. After each bounce it rises to ${T(fr(R[0], R[1]))} of the height it fell from. If it bounces forever, what total vertical distance does it travel?`, q: '',
        a: [`\\text{Down: }\\dfrac{${H}}{1-${fr(R[0], R[1])}}=${tn(dn, 2)}\\text{ m}`, `\\text{Up: }\\dfrac{${tn(H * rv, 3)}}{1-${fr(R[0], R[1])}}=${tn(up, 2)}\\text{ m}`, `\\text{Total}=${tn(dn + up, 2)}\\text{ m}`] };
    }
  }
});

/* =============================== mount =============================== */
mountFigures();
export const explainers = mountExplainers({ fill, gate, decimal, bounce, xrange });
export const _test = { tn, fr, FILL, GS, DC, BB, XR };
