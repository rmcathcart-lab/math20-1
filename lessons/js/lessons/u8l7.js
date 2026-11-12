/* Math 20-1 · Unit 8 · Lesson 7 — Quadratic Inequalities in One Variable: Sign Analysis.
 * New lesson format (2026-11-11): the warm-up ("The Fake Coin") is plain markup on the page (no code).
 * Card figures: the number lines on the page ([data-fig]) are drawn here.
 * Explainers:
 *   cases    (procedure, numbered: the sign rule, then Case 1 and Case 2 as two rays on a number line each; "and" keeps
 *             the overlap (glowing), a case with no overlap is stamped; "or" drops both results onto one line;
 *             Example 1(a)–(b), (b) factored with the X),
 *   scan     (STAR, the sign chart that fills itself, numbered 1–6 as in the key idea: rearrange, factor (the X), the
 *             zeros across the top, then a scanner sweeps left to right: each factor's sign flips at its zero and the
 *             product row is multiplied out cell by cell; the matching intervals light up and drop onto the number
 *             line; then the graph draws above the chart and is checked against it; Examples 2, 3, 4 (a −1 row, or
 *             multiply by −1 and reverse), 6),
 *   onesign  (Example 5: a scanner runs along the parabola and paints a sign tape: a square touches 0 and does not
 *             flip, a quadratic with b² − 4ac < 0 never flips, the formula zeros of (d); the verdict stamped),
 *   back     (procedure, numbered: from a solution on a number line to the inequality: the endpoints fly down into
 *             factors, between / outside and open / closed build the sign, expand, then the parabola is checked
 *             under the number line; Example 7(a)–(d)),
 *   rocket   (scene in step with a graph: the rocket flies at the height the graph shows; at least 60 m, for 4 s, in the
 *             air, never 90 m; and the ticket price sweeping along the profit graph (Example 9)),
 *   kslide   (Example 10, hands-on: slide k and the parabola moves while the k number line is painted by how many
 *             roots there are; then the algebra; "Your turn": a k slider).
 * Colours (this lesson): + green, − red, solutions amber, the graph blue, the scanner orange; factor rows ink. */
import {
  h, tex, add, box, Box, Graph, stamp, stampIn, mountExplainers, pop, fadeIn, sleep, tween, svgEl, pulse, COLORS, texNum,
  drawIn, anim, arrowHead
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const POS = COLORS.green, NEG = COLORS.red, SOL = COLORS.amber, FN = COLORS.blue, SCN = COLORS.orange, INK = COLORS.ink;
const RA = COLORS.purple, RB = '#0f7c8a';
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; if (el && el.label) el.label.style.opacity = 0; return el; };
const unhide = (el) => { if (el) el.style.opacity = ''; if (el && el.label) el.label.style.opacity = ''; return el; };
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
const SG = { '+': T('+'), '-': T('-'), '0': T('0') };
const sgnOf = (v) => (Math.abs(v) < 1e-9 ? '0' : v > 0 ? '+' : '-');
const SETR = (s) => `\\{x\\mid ${s},\\ x\\in\\mathbb{R}\\}`;
/* a numbered row for the step-by-step procedures (the step number beside each step as it appears) */
const row = (host, n, html, cls = '') => { const r = h('div', 'u8l7-row ' + cls, `<span class="u8l7-n">${n}</span><div class="u8l7-rc">${html}</div>`); r.style.opacity = 0; host.appendChild(r); return r; };
const setRow = (r, html) => { r.querySelector('.u8l7-rc').innerHTML = html; };

/* =============================== a strip: number lines and little graphs on one x-scale =============================== */
class Strip extends Box {
  /* o: { x, y, width, height, xmin, xmax, l, r } — l/r: the px where xmin/xmax sit */
  constructor(host, o) {
    super(host, Object.assign({ color: SOL }, o), 'u8l7-strip', o.width, o.height);
    this.layers = { bg: this.layer('bg'), data: this.layer('data'), top: this.layer('top') };
  }
  X(v) { const o = this.o, l = o.l ?? 24, r = o.r ?? this.W - 24; return l + (v - o.xmin) / (o.xmax - o.xmin) * (r - l); }
  get l() { return this.o.l ?? 24; }
  get r() { return this.o.r ?? this.W - 24; }
  /* a number line at height y with ticks (and TeX labels) at the given values */
  axis(y, ticks = [], o = {}) {
    const g = svgEl('g', { class: 'u8l7-axis' }, this.layers.bg), x0 = this.l - 18, x1 = this.r + 18;
    svgEl('line', { x1: x0, x2: x1, y1: y, y2: y, stroke: o.color || INK, 'stroke-width': 2.5 }, g);
    arrowHead(g, x1 + 4, y, 1, 0, { width: 2.5, color: o.color || INK }); arrowHead(g, x0 - 4, y, -1, 0, { width: 2.5, color: o.color || INK });
    const labs = [];
    ticks.forEach((t) => {
      const v = typeof t === 'object' ? t.v : t, s = typeof t === 'object' ? t.t : String(t), px = this.X(v);
      svgEl('line', { x1: px, x2: px, y1: y - 8, y2: y + 8, stroke: o.color || INK, 'stroke-width': 2 }, g);
      if (o.labels !== false) labs.push(this.hlabel(px, y + 10, T(s), { pos: 's', gap: 0, cls: 'u8l7-tl' }));
    });
    g.labs = labs; return g;
  }
  /* an interval at height y from a to b (±Infinity → arrow) */
  interval(y, a, b, o = {}) {
    return this.curve(() => {
      const ext = 18, p1 = [Number.isFinite(a) ? this.X(a) : this.l - ext, y], p2 = [Number.isFinite(b) ? this.X(b) : this.r + ext, y];
      return { subs: [[p1, p2]], ends: [{ p: p1, d: [-1, 0], s: Number.isFinite(a) ? (o.openA ? 'open' : 'closed') : 'arrow', k: 0, si: 0, last: false },
        { p: p2, d: [1, 0], s: Number.isFinite(b) ? (o.openB ? 'open' : 'closed') : 'arrow', k: 1, si: 0, last: true }] };
    }, Object.assign({ color: SOL, width: 7, r: 8 }, o), 'u8l7-int ' + (o.cls || ''), this.layers.data);
  }
  dot(v, y, o = {}) {
    const c = o.color || SOL, open = !!o.open;
    return svgEl('circle', { cx: this.X(v), cy: y, r: o.r || 8, fill: open ? '#fff' : c, stroke: open ? c : '#fff', 'stroke-width': open ? 3.2 : 2, class: 'u8l7-dot' }, o.layer || this.layers.top);
  }
  /* y = f(x) in the band [top, bot] with y-range yr: the curve, optional sign tint */
  yMap(top, bot, yr) { return (v) => top + (yr[1] - v) / (yr[1] - yr[0]) * (bot - top); }
  plot(f, top, bot, yr, o = {}) {
    const Y = this.yMap(top, bot, yr), N = 260, x0 = this.o.xmin, x1 = this.o.xmax, subs = []; let cur = null;
    for (let i = 0; i <= N; i++) {
      const x = x0 + (x1 - x0) * i / N, y = f(x), inside = y >= yr[0] && y <= yr[1];
      if (inside) { if (!cur) cur = []; cur.push([this.X(x), Y(y)]); } else if (cur) { cur.push([this.X(x), Y(Math.max(yr[0], Math.min(yr[1], y)))]); subs.push(cur); cur = null; }
      if (!inside && i < N) { const xn = x0 + (x1 - x0) * (i + 1) / N, yn = f(xn); if (yn >= yr[0] && yn <= yr[1]) { cur = [[this.X(x), Y(Math.max(yr[0], Math.min(yr[1], y)))]]; } }
    }
    if (cur) subs.push(cur);
    const g = svgEl('g', { class: 'bk-curve u8l7-plot' }, this.layers.data);
    svgEl('path', { class: 'bk-stroke', d: subs.map((s) => 'M' + s.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L')).join(''), fill: 'none', stroke: o.color || FN, 'stroke-width': o.width || 3.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    return g;
  }
  tint(f, top, bot, yr, o = {}) {
    const Y = this.yMap(top, bot, yr), y0 = Y(0), N = 300, x0 = this.o.xmin, x1 = this.o.xmax, g = svgEl('g', { class: 'u8l7-tint' }, this.layers.bg);
    let seg = null, sg = null;
    const close = () => { if (seg && seg.length > 1) { seg.push([seg[seg.length - 1][0], y0]); svgEl('path', { d: 'M' + seg.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L') + 'Z', fill: sg > 0 ? POS : NEG, 'fill-opacity': o.op || 0.16 }, g); } seg = null; };
    for (let i = 0; i <= N; i++) {
      const x = x0 + (x1 - x0) * i / N, v = f(x), s = Math.sign(v), px = this.X(x), py = Y(Math.max(yr[0], Math.min(yr[1], v)));
      if (s !== sg) { close(); sg = s; seg = s ? [[px, y0]] : null; }
      if (seg) seg.push([px, py]);
    }
    close(); return g;
  }
}
/* the solution intervals of a list of runs [{a, b, openA, openB}] or dots [{v}] on a strip's line at y */
const drawSol = (S, y, runs, o = {}) => runs.map((r) => (r.dot != null ? S.dot(r.dot, y, { color: o.color || SOL, r: 9 }) : S.interval(y, r.a, r.b, Object.assign({ openA: r.openA, openB: r.openB, color: o.color || SOL, width: 8, r: 8.5 }, o))));

/* =============================== the X (Ryan's factoring diagram) =============================== */
function pairsOf(ac) {
  const out = [], n = Math.abs(ac);
  for (let d = 1; d * d <= n; d++) if (n % d === 0) { const e = n / d; if (ac < 0) { out.push([d, -e]); if (d !== e) out.push([-d, e]); } else { out.push([d, e]); out.push([-d, -e]); } }
  return out;
}
/* ac on top, b underneath, the two numbers on the sides; the factor pairs beside, the right pair circled */
function xDiagram(host, x, y, ac, b) {
  const pairs = pairsOf(ac), right = pairs.findIndex((p) => p[0] + p[1] === b), pr = pairs[right] || [0, 0];
  const el = div(host, 'u8l7-xd', '', x, y);
  el.innerHTML = `<div class="u8l7-xbox"><svg viewBox="0 0 120 120" width="120" height="120"><line x1="14" y1="14" x2="106" y2="106"/><line x1="106" y1="14" x2="14" y2="106"/></svg>
    <span class="u8l7-xt">${T(String(ac))}</span><span class="u8l7-xb">${T(String(b))}</span><span class="u8l7-xl">${T(String(pr[0]))}</span><span class="u8l7-xr">${T(String(pr[1]))}</span></div>
    <div class="u8l7-xp"><div class="u8l7-xph">factor pairs of ${T(String(ac))}</div><div class="u8l7-xpg">${pairs.map((p, i) => `<span class="u8l7-pr${i === right ? ' ok' : ''}">${T(p[0] + ',\\ ' + p[1])}</span>`).join('')}</div></div>`;
  hide(el);
  const side = [...el.querySelectorAll('.u8l7-xl, .u8l7-xr')], prs = [...el.querySelectorAll('.u8l7-pr')];
  side.forEach(hide); prs.forEach(hide);
  el.play = async (c) => {
    unhide(el); await show(c, el);
    for (const p of prs) await fadeIn(c, unhide(p), 140);
    const ok = prs[right]; if (ok) { ok.classList.add('circ'); await pulse(c, ok, 1.15, 420); }
    await Promise.all(side.map((s) => pop(c, unhide(s), 360)));
  };
  return el;
}

/* =============================== card figures =============================== */
const FIGS = {
  e1a: { min: -6, max: 6, ticks: [-2, 0, 3], runs: [{ a: -Infinity, b: -2, openB: true }, { a: 3, b: Infinity, openA: true }] },
  e1b: { min: -9, max: 5, ticks: [-7, 0, 3], runs: [{ a: -7, b: 3 }] },
  e7d: { min: -3, max: 9, ticks: [0, 7], runs: [{ a: -Infinity, b: 0, openB: true }, { a: 7, b: Infinity, openA: true }], given: true }
};
function buildFigs() {
  document.querySelectorAll('.u8l7 [data-fig]').forEach((el) => {
    const f = FIGS[el.dataset.fig]; if (!f || el.dataset.built) return; el.dataset.built = '1';
    const W = f.given ? 420 : 380, S = new Strip(el, { width: W, height: 72, xmin: f.min, xmax: f.max, l: 30, r: W - 30 });
    const ticks = []; for (let v = Math.ceil(f.min); v <= f.max; v++) ticks.push(v);
    S.axis(30, ticks.map((v) => ({ v, t: String(v) })), { labels: false });
    f.ticks.forEach((v) => S.hlabel(S.X(v), 40, T(String(v)), { pos: 's', gap: 0, cls: 'u8l7-tl' }));
    drawSol(S, 30, f.runs, { color: f.given ? INK : SOL });
  });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', buildFigs); else buildFigs();

/* =============================== explainer: case analysis (Example 1) =============================== */
const CA = {
  a: { ex: '(a)', q: '(x-3)(x+2)>0', win: [-6, 6], ticks: [-2, 0, 3], rule: `${T('>0')}: the factors have the <b>same</b> sign. ${T('(+)(+)')} or ${T('(-)(-)')}`,
    c1: { t: 'both positive', A: { s: 'x-3>0', r: 'x>3', a: 3, b: Infinity, open: true }, B: { s: 'x+2>0', r: 'x>-2', a: -2, b: Infinity, open: true }, res: { a: 3, b: Infinity, openA: true }, rt: 'x>3' },
    c2: { t: 'both negative', A: { s: 'x-3<0', r: 'x<3', a: -Infinity, b: 3, open: true }, B: { s: 'x+2<0', r: 'x<-2', a: -Infinity, b: -2, open: true }, res: { a: -Infinity, b: -2, openB: true }, rt: 'x<-2' },
    ans: SETR('x<-2\\text{ or }x>3') },
  b: { ex: '(b)', q: 'x^2+4x-21\\le0', fac: { ac: -21, b: 4, line: '(x+7)(x-3)\\le0' }, win: [-10, 6], ticks: [-7, 0, 3], rule: `${T('\\le0')}: <b>opposite</b> signs (or ${T('0')}). ${T('(+)(-)')} or ${T('(-)(+)')}`,
    c1: { t: 'first ≥ 0, second ≤ 0', A: { s: 'x+7\\ge0', r: 'x\\ge-7', a: -7, b: Infinity }, B: { s: 'x-3\\le0', r: 'x\\le3', a: -Infinity, b: 3 }, res: { a: -7, b: 3 }, rt: '-7\\le x\\le3' },
    c2: { t: 'first ≤ 0, second ≥ 0', A: { s: 'x+7\\le0', r: 'x\\le-7', a: -Infinity, b: -7 }, B: { s: 'x-3\\ge0', r: 'x\\ge3', a: 3, b: Infinity }, res: null, rt: null },
    ans: SETR('-7\\le x\\le3') }
};
const cases = {
  title: 'Case analysis: two rays, keep the overlap',
  height: 452, minW: 900, capH: 96,
  choices: [{ sep: 'Example 1:' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }],
  ask: (v) => `<b>Example 1${CA[v].ex}:</b> solve ${T(CA[v].q)} by case analysis. Show the solution on a number line.`,
  make(stage, v, ex) {
    const D = CA[v], LW = 318, rows = div(stage, 'u8l7-rows u8l7-rows-s', '', 0, 0, LW - 14);
    const S = new Strip(stage, { x: LW, y: 0, width: ex.W - LW, height: 452, xmin: D.win[0], xmax: D.win[1], l: 26, r: ex.W - LW - 30 });
    const AX = [118, 262, 410], ticks = D.ticks.map((t) => ({ v: t, t: String(t) }));
    const ax = AX.map((y) => hide(S.axis(y, ticks)));
    ax.forEach((a) => a.labs.forEach(hide));
    const titles = ['Case 1', 'Case 2', '<b>Case 1 or Case 2</b>'].map((t, i) => hide(S.hlabel(4, AX[i] - (i < 2 ? 22 : 44), t, { pos: 'e', gap: 0, cls: 'u8l7-ctit' })));
    const mkCase = (C, y) => {
      const ra = hide(S.interval(y - 76, C.A.a, C.A.b, { color: RA, width: 6, r: 7, openA: C.A.open, openB: C.A.open })), rb = hide(S.interval(y - 38, C.B.a, C.B.b, { color: RB, width: 6, r: 7, openA: C.B.open, openB: C.B.open }));
      const la = hide(S.hlabel(Number.isFinite(C.A.a) ? S.X(C.A.a) + 14 : S.X(C.A.b) - 14, y - 82, T(C.A.r), { pos: Number.isFinite(C.A.a) ? 'ne' : 'nw', gap: 2, cls: 'u8l7-rl u8l7-ra' }));
      const lb = hide(S.hlabel(Number.isFinite(C.B.a) ? S.X(C.B.a) + 14 : S.X(C.B.b) - 14, y - 44, T(C.B.r), { pos: Number.isFinite(C.B.a) ? 'ne' : 'nw', gap: 2, cls: 'u8l7-rl u8l7-rb' }));
      const res = C.res ? hide(S.interval(y, C.res.a, C.res.b, { color: SOL, width: 9, r: 8.5, openA: C.res.openA, openB: C.res.openB, cls: 'u8l7-glowl' })) : null;
      return { ra, rb, la, lb, res };
    };
    const K1 = mkCase(D.c1, AX[0]), K2 = mkCase(D.c2, AX[1]);
    const none = D.c2.res ? null : hide(stamp(stage, 'no overlap', { ok: false, x: LW + S.X((D.c2.A.b + D.c2.B.a) / 2), y: AX[1] - 46, size: 'sm' }));
    const fin = [D.c1.res, D.c2.res].filter(Boolean).map((r) => hide(S.interval(AX[2], r.a, r.b, { color: SOL, width: 9, r: 8.5, openA: r.openA, openB: r.openB })));
    const X = D.fac ? xDiagram(stage, LW + 120, AX[1] + 14, D.fac.ac, D.fac.b) : null;
    let n = 0; const R = [];
    const steps = [];
    if (D.fac) {
      R.push(row(rows, ++n, `Factor: ${T('x^2+4x-21')}<br>${T(D.fac.line)}`));
      steps.push({ cap: `Factor first. The X: ${T('ac=-21')} on top, ${T('b=4')} underneath. Which factor pair of ${T('-21')} adds to ${T('4')}? ${T('7')} and ${T('-3')}: ${T(D.fac.line)}.`,
        run: async (c) => { await show(c, unhide(R[0])); await X.play(c); } });
    }
    const i0 = R.length;
    R.push(row(rows, ++n, D.rule));
    R.push(row(rows, ++n, `<b>Case 1:</b> ${T(D.c1.A.s)} and ${T(D.c1.B.s)}<br>so ${T(D.c1.rt)}`));
    R.push(row(rows, ++n, `<b>Case 2:</b> ${T(D.c2.A.s)} and ${T(D.c2.B.s)}<br>${D.c2.rt ? 'so ' + T(D.c2.rt) : 'no number does both'}`));
    R.push(row(rows, ++n, `Case 1 <b>or</b> Case 2:<br>${T(D.ans)}`, 'u8l7-rowans'));
    const caseRun = (K, k) => async (c) => {
      await show(c, unhide(R[i0 + 1 + k])); unhide(ax[k]); await show(c, ax[k]); ax[k].labs.forEach(unhide); unhide(titles[k]); await show(c, titles[k]);
      unhide(K.ra); await drawIn(K.ra, 520, c); unhide(K.la); await show(c, K.la);
      unhide(K.rb); await drawIn(K.rb, 520, c); unhide(K.lb); await show(c, K.lb);
      if (K.res) { unhide(K.res); await drawIn(K.res, 600, c); } else { unhide(none); await stampIn(c, none); }
    };
    steps.push({ cap: v === 'a' ? `A product is <b>positive</b> when both factors have the <b>same</b> sign: both positive or both negative. That gives two cases.` : `A product is <b>negative or zero</b> when the factors have <b>opposite</b> signs (or one is ${T('0')}). Two cases again.`,
      run: async (c) => { if (X) { X.style.transition = 'opacity .3s'; hide(X); } await show(c, unhide(R[i0])); } });
    steps.push({ cap: `<b>Case 1:</b> ${T(D.c1.A.s)} gives ${T(D.c1.A.r)} and ${T(D.c1.B.s)} gives ${T(D.c1.B.r)}. Within a case both must hold (<b>and</b>): keep the <b>overlap</b>, ${T(D.c1.rt)}.`, run: caseRun(K1, 0) });
    steps.push({ cap: D.c2.res ? `<b>Case 2:</b> ${T(D.c2.A.r)} and ${T(D.c2.B.r)}. The overlap is ${T(D.c2.rt)}.` : `<b>Case 2:</b> ${T(D.c2.A.r)} and ${T(D.c2.B.r)} point <b>away</b> from each other: no number does both. A case can have <b>no solution</b>.`, run: caseRun(K2, 1) });
    steps.push({ cap: `The solution is Case 1 <b>or</b> Case 2: ${T(D.ans)}. ${v === 'a' ? 'Open dots: ' + T('>') + ' leaves out the zeros.' : 'Closed dots: ' + T('\\le') + ' includes the zeros.'}`,
      run: async (c) => { await show(c, unhide(R[i0 + 3])); unhide(ax[2]); await show(c, ax[2]); ax[2].labs.forEach(unhide); unhide(titles[2]); await show(c, titles[2]); for (const f of fin) { unhide(f); await drawIn(f, 600, c); } } });
    return steps;
  }
};

/* =============================== explainer: the sign chart that fills itself (STAR) =============================== */
const L = (a, b) => (x) => a * x + b;
const SC = {
  e2a: { ex: 'Example 2(a)', q: 'x^2-3x-10>0', ask: 'complete the sign chart and solve', win: [-5, 8], yr: [-14, 14], g: (x) => x * x - 3 * x - 10, gt: 'y=x^2-3x-10',
    r1: `${T('x^2-3x-10>0')}: one side is already ${T('0')}`, X: { ac: -10, b: -3 }, r2: `${T('(x+2)(x-5)>0')}`, rel: '>',
    fac: [{ t: 'x+2', f: L(1, 2) }, { t: 'x-5', f: L(1, -5) }], zeros: [{ v: -2, t: '-2' }, { v: 5, t: '5' }], ans: SETR('x<-2\\text{ or }x>5') },
  e2b: { ex: 'Example 2(b)', q: 'x^2-3x-10\\le0', ask: 'use the same chart to solve', reuse: true, win: [-5, 8], yr: [-14, 14], g: (x) => x * x - 3 * x - 10, gt: 'y=x^2-3x-10',
    r1: `${T('x^2-3x-10\\le0')}`, r2: `${T('(x+2)(x-5)\\le0')}`, rel: '≤',
    fac: [{ t: 'x+2', f: L(1, 2) }, { t: 'x-5', f: L(1, -5) }], zeros: [{ v: -2, t: '-2' }, { v: 5, t: '5' }], ans: SETR('-2\\le x\\le5') },
  e3a: { ex: 'Example 3(a)', q: '6x^2+x\\le2', ask: 'rearrange so one side is 0, then solve with a sign chart', re: true, win: [-1.6, 1.5], yr: [-3, 4.5], g: (x) => 6 * x * x + x - 2, gt: 'y=6x^2+x-2',
    r1: `${T('6x^2+x\\le2')}<br>${T('6x^2+x-2\\le0')}`, X: { ac: -12, b: 1 }, r2: `${T('6x^2+4x-3x-2')}<br>${T('(3x+2)(2x-1)\\le0')}`, rel: '≤',
    fac: [{ t: '3x+2', f: L(3, 2) }, { t: '2x-1', f: L(2, -1) }], zeros: [{ v: -2 / 3, t: '-\\frac23' }, { v: 0.5, t: '\\frac12' }], ans: SETR('-\\frac23\\le x\\le\\frac12') },
  e3b: { ex: 'Example 3(b)', q: 'x(x+6)<16', ask: 'rearrange so one side is 0, then solve with a sign chart', re: true, win: [-11, 5], yr: [-28, 22], g: (x) => x * x + 6 * x - 16, gt: 'y=x^2+6x-16',
    r1: `${T('x(x+6)<16')}<br>${T('x^2+6x-16<0')}`, X: { ac: -16, b: 6 }, r2: `${T('(x+8)(x-2)<0')}`, rel: '<',
    fac: [{ t: 'x+8', f: L(1, 8) }, { t: 'x-2', f: L(1, -2) }], zeros: [{ v: -8, t: '-8' }, { v: 2, t: '2' }], ans: SETR('-8<x<2') },
  e4a: { ex: 'Example 4(a)', q: '-x^2+2x+15\\ge0', ask: 'solve, keeping −1 as a factor', neg: true, win: [-6, 8], yr: [-18, 19], g: (x) => -x * x + 2 * x + 15, gt: 'y=-x^2+2x+15',
    r1: `${T('-x^2+2x+15\\ge0')}<br>${T('-(x^2-2x-15)\\ge0')}`, X: { ac: -15, b: -2 }, r2: `${T('-(x+3)(x-5)\\ge0')}<br><span class="u8l7-mut">the ${T('-1')} gets its own row</span>`, rel: '≥',
    fac: [{ t: '-1', f: () => -1 }, { t: 'x+3', f: L(1, 3) }, { t: 'x-5', f: L(1, -5) }], zeros: [{ v: -3, t: '-3' }, { v: 5, t: '5' }], ans: SETR('-3\\le x\\le5') },
  e4b: { ex: 'Example 4(b)', q: '-x^2+2x+15\\ge0', ask: 'solve, multiplying by −1 first', win: [-6, 8], yr: [-18, 19], g: (x) => -x * x + 2 * x + 15, gt: 'y=-x^2+2x+15',
    r1: `${T('-x^2+2x+15\\ge0')}<br>${T('\\times(-1)')}: ${T('x^2-2x-15\\le0')} <span class="u8l7-flip">sign reversed</span>`, X: { ac: -15, b: -2 }, r2: `${T('(x+3)(x-5)\\le0')}`, rel: '≤', flip: true,
    fac: [{ t: 'x+3', f: L(1, 3) }, { t: 'x-5', f: L(1, -5) }], zeros: [{ v: -3, t: '-3' }, { v: 5, t: '5' }], ans: SETR('-3\\le x\\le5') },
  e6a: { ex: 'Example 6(a)', q: '(x+2)(x-1)(x-4)\\ge0', ask: 'solve with a sign chart', win: [-4, 6], yr: [-16, 16], g: (x) => (x + 2) * (x - 1) * (x - 4), gt: 'y=(x+2)(x-1)(x-4)',
    r1: `${T('(x+2)(x-1)(x-4)\\ge0')}: already ${T('0')}`, r2: 'already factored: three factors', rel: '≥',
    fac: [{ t: 'x+2', f: L(1, 2) }, { t: 'x-1', f: L(1, -1) }, { t: 'x-4', f: L(1, -4) }], zeros: [{ v: -2, t: '-2' }, { v: 1, t: '1' }, { v: 4, t: '4' }], ans: SETR('-2\\le x\\le1\\text{ or }x\\ge4') },
  e6b: { ex: 'Example 6(b)', q: '(x-2)^2(x+1)>0', ask: 'solve with a sign chart', win: [-3, 4.5], yr: [-9, 12], g: (x) => (x - 2) * (x - 2) * (x + 1), gt: 'y=(x-2)^2(x+1)',
    r1: `${T('(x-2)^2(x+1)>0')}: already ${T('0')}`, r2: `a <b>squared</b> factor: ${T('(x-2)^2')}`, rel: '>',
    fac: [{ t: '(x-2)^2', f: (x) => (x - 2) * (x - 2) }, { t: 'x+1', f: L(1, 1) }], zeros: [{ v: -1, t: '-1' }, { v: 2, t: '2' }], ans: '\\{x\\mid x>-1,\\ x\\ne2,\\ x\\in\\mathbb{R}\\}' }
};
const RELT = { '>': '>0', '<': '<0', '≥': '\\ge0', '≤': '\\le0' };
/* the columns of a sign chart: intervals and zeros, with a sample x for each */
function chartCols(D) {
  const zs = D.zeros, cols = [];
  zs.forEach((z, i) => { cols.push({ kind: 'int', a: i ? zs[i - 1] : null, b: z }); cols.push({ kind: 'zero', z }); });
  cols.push({ kind: 'int', a: zs[zs.length - 1], b: null });
  cols.forEach((cl) => {
    cl.x = cl.kind === 'zero' ? cl.z.v : cl.a && cl.b ? (cl.a.v + cl.b.v) / 2 : cl.a ? cl.a.v + 1 : cl.b.v - 1;
    cl.signs = D.fac.map((F) => sgnOf(F.f(cl.x)));
    cl.prod = sgnOf(D.fac.reduce((p, F) => p * F.f(cl.x), 1));
  });
  return cols;
}
/* which columns match the inequality, grouped into runs → intervals / single points */
function solRuns(cols, rel) {
  const want = rel === '>' || rel === '≥' ? '+' : '-', incl = rel === '≥' || rel === '≤';
  const sel = cols.map((cl) => cl.prod === want || (incl && cl.prod === '0'));
  const runs = []; let s = -1;
  for (let i = 0; i <= cols.length; i++) {
    if (i < cols.length && sel[i]) { if (s < 0) s = i; continue; }
    if (s >= 0) {
      const A = cols[s], B = cols[i - 1];
      if (s === i - 1 && A.kind === 'zero') runs.push({ dot: A.z.v });
      else runs.push({ a: A.kind === 'zero' ? A.z.v : A.a ? A.a.v : -Infinity, openA: A.kind !== 'zero', b: B.kind === 'zero' ? B.z.v : B.b ? B.b.v : Infinity, openB: B.kind !== 'zero' });
      s = -1;
    }
  }
  return { sel, runs, want, incl };
}
const scan = {
  title: 'The sign chart that fills itself',
  height: 452, minW: 900, capH: 100,
  choices: [{ sep: 'Example 2:' }, { v: 'e2a', label: '(a)' }, { v: 'e2b', label: '(b)' }, { sep: 'Ex 3:' }, { v: 'e3a', label: '(a)' }, { v: 'e3b', label: '(b)' },
    { sep: 'Ex 4:' }, { v: 'e4a', label: '(a) −1 row' }, { v: 'e4b', label: '(b) × (−1)' }, { sep: 'Ex 6:' }, { v: 'e6a', label: '(a)' }, { v: 'e6b', label: '(b)' }],
  ask: (v) => `<b>${SC[v].ex}:</b> ${SC[v].ask} ${T(SC[v].q)}.`,
  make(stage, v, ex) {
    const D = SC[v], LW = 262, W = ex.W, rows = div(stage, 'u8l7-rows u8l7-rows-s', '', 0, 0, LW - 14);
    const LAB = 96, cx0 = LW + LAB, cx1 = W - 10, ZW = 40;
    const S = new Strip(stage, { x: 0, y: 0, width: W, height: 452, xmin: D.win[0], xmax: D.win[1], l: cx0, r: cx1 });
    const cols = chartCols(D), nF = D.fac.length, top = 160, HH = 40, RH = 42, PH = 46;
    const yRow = (i) => top + HH + i * RH, yProd = top + HH + nF * RH, bot = yProd + PH, nlY = bot + 36;
    const X = (v) => S.X(v);
    cols.forEach((cl, i) => {
      if (cl.kind === 'zero') { cl.px0 = X(cl.z.v) - ZW / 2; cl.px1 = X(cl.z.v) + ZW / 2; }
    });
    cols.forEach((cl, i) => { if (cl.kind === 'int') { cl.px0 = i ? cols[i - 1].px1 : cx0; cl.px1 = i < cols.length - 1 ? cols[i + 1].px0 : cx1; } });
    /* the chart (HTML cells) */
    const chart = div(stage, 'u8l7-chart', '', 0, 0); hide(chart);
    const cell = (x, y, w, hh, html, cls) => div(chart, 'u8l7-cell ' + (cls || ''), html, x, y, w, hh);
    cell(LW, top, LAB, HH, T('x'), 'u8l7-hd u8l7-lab');
    D.fac.forEach((F, r) => cell(LW, yRow(r), LAB, RH, T(F.t), 'u8l7-lab'));
    cell(LW, yProd, LAB, PH, '<b>Product</b>', 'u8l7-lab u8l7-plab');
    cols.forEach((cl) => {
      const w = cl.px1 - cl.px0;
      const lab = cl.kind === 'zero' ? T(cl.z.t) : !cl.a ? T('x<' + cl.b.t) : !cl.b ? T('x>' + cl.a.t) : w >= 150 ? T(cl.a.t + '<x<' + cl.b.t) : 'between';
      cl.hd = cell(cl.px0, top, w, HH, lab, 'u8l7-hd' + (cl.kind === 'zero' ? ' u8l7-zc' : ''));
      cl.fc = D.fac.map((F, r) => cell(cl.px0, yRow(r), w, RH, '', cl.kind === 'zero' ? 'u8l7-zc' : ''));
      cl.pc = cell(cl.px0, yProd, w, PH, '', 'u8l7-pc' + (cl.kind === 'zero' ? ' u8l7-zc' : ''));
    });
    const hds = cols.map((cl) => hide(cl.hd));
    /* zero guides through the chart */
    const guides = cols.filter((cl) => cl.kind === 'zero').map((cl) => hide(svgEl('line', { x1: X(cl.z.v), x2: X(cl.z.v), y1: 8, y2: bot, stroke: COLORS.gray, 'stroke-width': 2, 'stroke-dasharray': '5 5' }, S.layers.top)));
    guides.forEach((g) => (g.style.display = 'none'));
    /* the scanner */
    const scn = div(stage, 'u8l7-scan', '', cx0 - 3, top - 8, 6, bot - top + 16); hide(scn);
    /* the number line under the chart */
    const nl = hide(S.axis(nlY, D.zeros)); nl.labs.forEach(hide);
    const SR = solRuns(cols, D.rel), sol = drawSol(S, nlY, SR.runs).map(hide);
    /* the graph above the chart (for the check) */
    const gTop = 10, gBot = 146, Yg = S.yMap(gTop, gBot, D.yr);
    const gAx = hide(svgEl('line', { x1: cx0 - 8, x2: cx1, y1: Yg(0), y2: Yg(0), stroke: INK, 'stroke-width': 2 }, S.layers.bg));
    const tint = hide(S.tint(D.g, gTop, gBot, D.yr)), curve = hide(S.plot(D.g, gTop, gBot, D.yr));
    const gLab = hide(S.hlabel(cx0 + 6, gTop - 2, T(D.gt), { pos: 'se', gap: 0, cls: 'u8l7-glab' }));
    const ok = hide(stamp(stage, 'matches', { ok: true, x: W - 80, y: 34, size: 'sm' }));
    const Xd = D.X ? xDiagram(stage, LW + 40, 8, D.X.ac, D.X.b) : null;
    /* the numbered rows (as in the key idea) */
    const R = [row(rows, 1, D.r1), row(rows, 2, D.r2), row(rows, 3, `Zeros ${D.zeros.map((z) => T(z.t)).join(' and ')} across the top`),
      row(rows, 4, `A row for each factor: ${T('-')}, ${T('0')} or ${T('+')}`), row(rows, 5, `Product: even number of ${T('-')} → ${T('+')}; odd → ${T('-')}`),
      row(rows, 6, `${T(RELT[D.rel])}: ${SR.want === '+' ? T('+') : T('-')} intervals${SR.incl ? ' and the zeros' : ''}<br>${T(D.ans)}`, 'u8l7-rowans'), row(rows, '✓', 'Check with the graph', 'u8l7-rowck')];
    const fillCol = async (c, i, quick) => {
      const cl = cols[i];
      for (let r = 0; r < nF; r++) {
        const e = cl.fc[r], sg = cl.signs[r], prev = i > 0 ? cols[i - 1].signs[r] : null;
        e.innerHTML = SG[sg]; e.className = 'u8l7-cell' + (cl.kind === 'zero' ? ' u8l7-zc' : '') + (sg === '+' ? ' u8l7-p' : sg === '-' ? ' u8l7-m' : ' u8l7-z');
        if (!quick && !c.fast && prev === '0' && sg !== '0') e.classList.add('u8l7-flipped');
        await pop(c, e, quick ? 160 : 260);
      }
      const p = cl.pc;
      if (cl.kind === 'int' && !quick) { p.innerHTML = `<span class="u8l7-mul">${cl.signs.map((s) => T('(' + s + ')')).join('')}</span>`; await fadeIn(c, p, 200); await sleep(c, 420); }
      p.innerHTML = SG[cl.prod]; p.className = 'u8l7-cell u8l7-pc' + (cl.kind === 'zero' ? ' u8l7-zc' : '') + (cl.prod === '+' ? ' u8l7-p' : cl.prod === '-' ? ' u8l7-m' : ' u8l7-z');
      await pop(c, p, 300);
    };
    const sweep = async (c, quick) => {
      unhide(scn); await show(c, scn); let x = cx0 - 3;
      for (let i = 0; i < cols.length; i++) {
        const to = (cols[i].px0 + cols[i].px1) / 2 - 3, x0 = x;
        await tween(c, quick ? 140 : Math.max(260, Math.abs(to - x0) * 2.2), (t) => { scn.style.left = (x0 + (to - x0) * t) + 'px'; }, (t) => t);
        x = to; await fillCol(c, i, quick);
      }
      const x0 = x; await tween(c, quick ? 100 : 300, (t) => { scn.style.left = (x0 + (cx1 - 3 - x0) * t) + 'px'; }, (t) => t);
      hide(scn);
    };
    const showChart = async (c) => { unhide(chart); await show(c, chart); for (const hd of hds) await fadeIn(c, unhide(hd), 120); guides.forEach((g) => { g.style.display = ''; unhide(g); g.setAttribute('y1', top); }); unhide(nl); nl.labs.forEach(unhide); await show(c, nl); };
    const read = async (c) => {
      await show(c, unhide(R[5]));
      cols.forEach((cl, i) => { if (SR.sel[i]) cl.pc.classList.add('u8l7-hit'); });
      await Promise.all(cols.filter((cl, i) => SR.sel[i]).map((cl) => pulse(c, cl.pc, 1.08, 420)));
      for (const s of sol) { unhide(s); if (s.tagName === 'circle') await pop(c, s, 320); else await drawIn(s, 650, c); }
    };
    const check = async (c) => {
      if (Xd) hide(Xd);
      await show(c, unhide(R[6]));
      guides.forEach((g) => g.setAttribute('y1', gTop));
      unhide(gAx); unhide(gLab); await show(c, gLab); unhide(curve); await drawIn(curve, 900, c); unhide(tint); await fadeIn(c, tint, 400, { from: 'none' });
      unhide(ok); await stampIn(c, ok);
    };
    const rel = RELT[D.rel], wantW = SR.want === '+' ? '<b class="u8l7-cp">positive</b>' : '<b class="u8l7-cm">negative</b>';
    const steps = [];
    if (D.reuse) {
      steps.push({ cap: `The chart from (a): ${T('(x+2)(x-5)')}, zeros ${T('-2')} and ${T('5')}, product row ${T('+,\\ 0,\\ -,\\ 0,\\ +')}. Only the inequality sign has changed.`,
        run: async (c) => { for (const r of R.slice(0, 5)) unhide(r); await Promise.all(R.slice(0, 5).map((r) => show(c, r))); await showChart(c); await sweep(c, true); } });
    } else {
      steps.push({ cap: D.flip ? `<b>1</b> One side is ${T('0')}. Multiply both sides by ${T('-1')} and <b>reverse the inequality sign</b>: ${T('\\ge')} becomes ${T('\\le')}.`
        : D.neg ? `<b>1</b> One side is already ${T('0')}. The leading coefficient is negative: take out ${T('-1')} and keep it as a row of the chart.`
        : D.re ? `<b>1</b> Move every term to one side so the other side is ${T('0')}. Never divide by an expression containing ${T('x')}.` : `<b>1</b> Move every term to one side so the other side is ${T('0')}. Here it already is.`,
      run: async (c) => { await show(c, unhide(R[0])); } });
      steps.push({ cap: D.X ? `<b>2</b> Factor fully. The X: ${T('ac=' + D.X.ac)} on top, ${T('b=' + D.X.b)} underneath; the factor pair that adds to ${T(String(D.X.b))} goes on the sides.${v === 'e3a' ? ` Split ${T('x')} into ${T('4x-3x')} and group: ${T('2x(3x+2)-(3x+2)')}.` : ''}`
        : `<b>2</b> Factor fully. ${v === 'e6b' ? `${T('(x-2)^2')} is a factor too: it is ${T('0')} at ${T('x=2')} and positive everywhere else.` : 'Already done: one linear factor per zero.'}`,
      run: async (c) => { await show(c, unhide(R[1])); if (Xd) await Xd.play(c); } });
      steps.push({ cap: `<b>3</b> The zero of each factor: ${D.zeros.map((z) => T('x=' + z.t)).join(', ')}. Write them in order across the top, with an interval between and around them.`,
        run: async (c) => { await show(c, unhide(R[2])); await showChart(c); } });
      steps.push({ cap: `<b>4, 5</b> The scanner sweeps left to right. Each factor is ${T('-')} left of its zero, ${T('0')} at it, ${T('+')} after it${D.fac.some((F) => F.t === '-1') ? ` (the ${T('-1')} row is ${T('-')} everywhere)` : ''}${v === 'e6b' ? ` (the square never goes ${T('-')})` : ''}. The product: count the ${T('-')} signs.`,
        run: async (c) => { await show(c, unhide(R[3])); await show(c, unhide(R[4])); await sweep(c, false); } });
    }
    steps.push({ cap: `<b>6</b> ${T(rel)} means the product is ${wantW}${SR.incl ? `, <b>or</b> ${T('0')}: include the zeros (closed dots)` : ': leave the zeros out (open dots)'}. ${T(D.ans)}.`, run: read });
    steps.push({ cap: `<b>Check:</b> ${T(D.gt)} is ${D.rel === '>' || D.rel === '≥' || D.flip ? (D.flip ? 'on or above' : D.rel === '>' ? 'above' : 'on or above') : D.rel === '<' ? 'below' : 'on or below'} the ${T('x')}-axis exactly on those intervals.${D.flip ? ' (The graph of the original: it opens down.)' : ''}`, run: check });
    return steps;
  }
};

/* =============================== explainer: one sign everywhere? (Example 5) =============================== */
const OS = {
  a: { q: 'x^2-10x+25>0', f: (x) => (x - 5) * (x - 5), win: { xmin: -0.5, xmax: 10.5, ymin: -4, ymax: 28, ystep: 4, ylabels: 8, xlabels: 1 }, zeros: [5], rel: '>',
    r1: `${T('x^2-10x+25=(x-5)^2')}: a perfect square`, scanCap: `${T('(x-5)^2')} is ${T('0')} at ${T('x=5')} and positive everywhere else: the graph <b>touches</b> the axis and the sign does <b>not flip</b>.`,
    r3: `${T('>0')}: every ${T('+')}<br>${T('\\{x\\mid x\\ne5,\\ x\\in\\mathbb{R}\\}')}`, st: 'every number but 5', runs: [{ a: -Infinity, b: 5, openB: true }, { a: 5, b: Infinity, openA: true }],
    cap3: `${T('>0')}: true for every ${T('x')} except ${T('x=5')}, where it is ${T('0')}. ${T('\\{x\\mid x\\ne5,\\ x\\in\\mathbb{R}\\}')}` },
  b: { q: '4x^2+12x+9\\le0', f: (x) => (2 * x + 3) * (2 * x + 3), win: { xmin: -4, xmax: 1, ymin: -2, ymax: 14, xstep: 0.5, xlabels: 1, ystep: 2, ylabels: 4 }, zeros: [-1.5], rel: '≤',
    r1: `${T('4x^2+12x+9=(2x+3)^2')}`, scanCap: `${T('(2x+3)^2')} is never negative: ${T('0')} at ${T('x=-\\frac32')}, positive everywhere else.`,
    r3: `${T('\\le0')}: only ${T('=0')} works<br>${T('x=-\\frac32')} is the only solution`, st: 'one value only', runs: [{ dot: -1.5 }],
    cap3: `${T('\\le0')}: a square is never negative, so only ${T('(2x+3)^2=0')} works. ${T('x=-\\frac32')} is the only solution.` },
  c: { q: 'x^2-4x+7<0', f: (x) => x * x - 4 * x + 7, win: { xmin: -2, xmax: 6, ymin: -2, ymax: 14, ystep: 2, ylabels: 4 }, zeros: [], rel: '<', test: [0, 7],
    r1: `${T('b^2-4ac=16-28=-12<0')}: no real zeros`, scanCap: `No real zeros: the graph never crosses the ${T('x')}-axis, so the sign <b>never changes</b>. Test any one value: ${T('x=0')} gives ${T('7>0')}. Always positive.`,
    r3: `${T('<0')}: never<br>No solution`, st: 'no solution', runs: [], cap3: `It is never ${T('<0')}: <b>no solution</b>.` },
  d: { q: 'x^2-2x-4\\ge0', f: (x) => x * x - 2 * x - 4, win: { xmin: -3.5, xmax: 5.5, ymin: -7, ymax: 10, ystep: 1, ylabels: 2 }, zeros: [1 - Math.sqrt(5), 1 + Math.sqrt(5)], rel: '≥', formula: true,
    r1: `It doesn't factor: the formula<br>${T('x=\\dfrac{2\\pm\\sqrt{4+16}}{2}=1\\pm\\sqrt5')}`, scanCap: `Positive outside the zeros, negative between them (${T('a>0')}).`,
    r3: `${T('\\ge0')}: outside, zeros in<br>${T('\\{x\\mid x\\le1-\\sqrt5\\text{ or }x\\ge1+\\sqrt5,\\ x\\in\\mathbb{R}\\}')}<br>${T('x\\le-1.24')} or ${T('x\\ge3.24')}`, st: 'outside the zeros',
    runs: [{ a: -Infinity, b: 1 - Math.sqrt(5) }, { a: 1 + Math.sqrt(5), b: Infinity }],
    cap3: `${T('\\ge0')}: outside the zeros, zeros included. ${T('\\{x\\mid x\\le1-\\sqrt5\\text{ or }x\\ge1+\\sqrt5,\\ x\\in\\mathbb{R}\\}')}: ${T('x\\le-1.24')} or ${T('x\\ge3.24')}.` }
};
const onesign = {
  title: 'Does the sign ever change?',
  height: 452, minW: 900, capH: 96,
  choices: [{ sep: 'Example 5:' }, ...['a', 'b', 'c', 'd'].map((k) => ({ v: k, label: '(' + k + ')' }))],
  ask: (v) => `<b>Example 5(${v}):</b> solve ${T(OS[v].q)}.`,
  make(stage, v, ex) {
    const D = OS[v], GW = 480, G = new Graph(stage, Object.assign({ x: 0, y: 0, width: GW, height: 360, fontSize: 15, pad: [26, 16, 16, 16] }, D.win));
    const P = div(stage, 'u8l7-rows', '', GW + 22, 0, ex.W - GW - 26);
    const curve = hide(G.fn(D.f, { color: FN, width: 3.5 }));
    const zs = D.zeros.map((z) => hide(G.point(z, 0, { color: INK, r: 7, label: D.formula ? T(texNum(z, 2)) : null, pos: z < 1 ? 'nw' : 'ne' })));
    /* the sign tape under the graph */
    const tapeY = 392, gx = (x) => G.toPx(x, 0)[0];
    const tape = svgEl('svg', { class: 'u8l7-tape', width: GW, height: 60, viewBox: `0 0 ${GW} 60` }); const tw = div(stage, 'u8l7-tw', '', 0, tapeY - 18, GW, 60); tw.appendChild(tape);
    svgEl('rect', { x: gx(G.win.xmin), y: 10, width: gx(G.win.xmax) - gx(G.win.xmin), height: 22, rx: 6, fill: '#f1efe8', stroke: '#d9d3c4' }, tape);
    const cuts = [G.win.xmin, ...D.zeros, G.win.xmax], regs = [];
    for (let i = 0; i < cuts.length - 1; i++) { const m = (cuts[i] + cuts[i + 1]) / 2, s = sgnOf(D.f(m)); regs.push({ a: cuts[i], b: cuts[i + 1], s, r: svgEl('rect', { x: gx(cuts[i]), y: 10, width: 0, height: 22, fill: s === '+' ? POS : NEG, 'fill-opacity': 0.75 }, tape), t: null }); }
    regs.forEach((rg) => { rg.t = div(tw, 'u8l7-tsg ' + (rg.s === '+' ? 'u8l7-cp' : 'u8l7-cm'), SG[rg.s], (gx(rg.a) + gx(rg.b)) / 2 - 10, 34); hide(rg.t); });
    const zd = D.zeros.map((z) => { const d = svgEl('circle', { cx: gx(z), cy: 21, r: 8, fill: '#fff', stroke: INK, 'stroke-width': 3 }, tape); hide(d); return d; });
    const tlab = div(tw, 'u8l7-tlab', 'sign', gx(G.win.xmin) + 2, -8); hide(tlab);
    /* the solution, drawn on the tape */
    const solS = new Strip(tw, { x: 0, y: 0, width: GW, height: 60, xmin: G.win.xmin, xmax: G.win.xmax, l: gx(G.win.xmin), r: gx(G.win.xmax) });
    const sol = drawSol(solS, 21, D.runs, { width: 10 }).map(hide);
    const scl = hide(G.vline(G.win.xmin, { color: SCN, width: 3, dash: false })), sdot = hide(G.point(G.win.xmin, D.f(G.win.xmin), { color: SCN, r: 8 }));
    const tpt = D.test ? hide(G.point(D.test[0], D.test[1], { color: POS, r: 8, label: T('(0,\\ 7)'), pos: 'e' })) : null;
    const R = [row(P, 1, D.r1), row(P, 2, D.zeros.length === 2 ? 'Scan: the sign flips at each zero' : D.zeros.length === 1 ? 'Scan: it touches 0, but <b>doesn’t flip</b>' : `Scan: <b>never flips</b>${D.test ? ` (${T('x=0')}: ${T('7>0')})` : ''}`), row(P, 3, D.r3, 'u8l7-rowans')];
    const vst = hide(stamp(stage, D.st, { ok: D.runs.length ? true : false, x: GW + 22 + (ex.W - GW - 26) / 2, y: 400 }));
    const scanRun = async (c) => {
      await show(c, unhide(R[1])); if (tpt) await pop(c, unhide(tpt)).then(() => show(c, unhide(tpt.label)));
      unhide(scl); unhide(sdot); unhide(tlab);
      const { xmin, xmax } = G.win, passed = new Set();
      await tween(c, 3600, (t) => {
        const x = xmin + (xmax - xmin) * t; scl.set(x); const y = D.f(x); G.moveTo(sdot, x, Math.min(y, G.win.ymax)); sdot.style.opacity = y > G.win.ymax ? 0 : '';
        regs.forEach((rg) => { const w = Math.max(0, gx(Math.min(x, rg.b)) - gx(rg.a)); rg.r.setAttribute('width', w); if (x > (rg.a + rg.b) / 2 && rg.t.style.opacity === '0') { rg.t.style.opacity = ''; } });
        D.zeros.forEach((z, i) => { if (x >= z && !passed.has(i)) { passed.add(i); zd[i].style.opacity = ''; } });
      }, (t) => t);
      regs.forEach((rg) => { rg.r.setAttribute('width', gx(rg.b) - gx(rg.a)); unhide(rg.t); }); zd.forEach(unhide);
      hide(scl); hide(sdot);
    };
    return [
      { cap: v === 'a' || v === 'b' ? `Factor: ${D.r1}. A square is <b>never negative</b>.` : v === 'c' ? `Check the discriminant first: ${T('b^2-4ac=16-28=-12<0')}. No real zeros: the graph never touches the ${T('x')}-axis.` : `${T('x^2-2x-4')} does not factor. Find the zeros with the quadratic formula: ${T('x=\\dfrac{2\\pm\\sqrt{4+16}}{2}=\\dfrac{2\\pm2\\sqrt5}{2}=1\\pm\\sqrt5')}.`,
        run: async (c) => { await show(c, unhide(R[0])); unhide(curve); await drawIn(curve, 800, c); for (const z of zs) await G.reveal(unhide(z), c); } },
      { cap: `The scanner runs along the graph and paints the sign underneath. ${D.scanCap}`, run: scanRun },
      { cap: D.cap3, run: async (c) => { await show(c, unhide(R[2])); for (const s of sol) { unhide(s); if (s.tagName === 'circle') await pop(c, s, 320); else await drawIn(s, 600, c); } unhide(vst); await stampIn(c, vst); } }
    ];
  }
};

/* =============================== explainer: from the solution back to the inequality (Example 7) =============================== */
const BK = {
  a: { sol: '\\{x\\mid -4<x<3,\\ x\\in\\mathbb{R}\\}', win: [-6.5, 5.5], ends: [{ v: -4, t: '-4', f: 'x+4' }, { v: 3, t: '3', f: 'x-3' }], open: true, between: true,
    ineq: '(x+4)(x-3)<0', exp: 'x^2+x-12<0', g: (x) => (x + 4) * (x - 3), yr: [-14, 10], relC: 'Between, open', runs: [{ a: -4, b: 3, openA: true, openB: true }] },
  b: { sol: '\\{x\\mid x\\le-6\\text{ or }x\\ge-1,\\ x\\in\\mathbb{R}\\}', win: [-9.5, 2.5], ends: [{ v: -6, t: '-6', f: 'x+6' }, { v: -1, t: '-1', f: 'x+1' }], open: false, between: false,
    ineq: '(x+6)(x+1)\\ge0', exp: 'x^2+7x+6\\ge0', g: (x) => (x + 6) * (x + 1), yr: [-8, 12], relC: 'Outside, closed', runs: [{ a: -Infinity, b: -6 }, { a: -1, b: Infinity }] },
  c: { sol: '\\{x\\mid -\\frac12\\le x\\le3,\\ x\\in\\mathbb{R}\\}', win: [-2.5, 4.5], ends: [{ v: -0.5, t: '-\\frac12', f: '2x+1', note: `${T('x=-\\frac12')} → ${T('2x=-1')} → ${T('2x+1=0')}` }, { v: 3, t: '3', f: 'x-3' }], open: false, between: true,
    ineq: '(2x+1)(x-3)\\le0', exp: '2x^2-5x-3\\le0', g: (x) => (2 * x + 1) * (x - 3), yr: [-8, 8], relC: 'Between, closed', runs: [{ a: -0.5, b: 3 }] },
  d: { sol: 'x<0\\text{ or }x>7', given: 'the number line', win: [-3, 10], ends: [{ v: 0, t: '0', f: 'x' }, { v: 7, t: '7', f: 'x-7' }], open: true, between: false,
    ineq: 'x(x-7)>0', exp: 'x^2-7x>0', g: (x) => x * (x - 7), yr: [-14, 14], relC: 'Outside, open', runs: [{ a: -Infinity, b: 0, openB: true }, { a: 7, b: Infinity, openA: true }] }
};
const back = {
  title: 'From the solution back to the inequality',
  height: 452, minW: 900, capH: 96,
  choices: [{ sep: 'Example 7:' }, ...['a', 'b', 'c', 'd'].map((k) => ({ v: k, label: '(' + k + ')' }))],
  ask: (v) => `<b>Example 7(${v}):</b> write a quadratic inequality with integer coefficients and ${T('a>0')} that has the solution ${v === 'd' ? 'shown' : T(BK[v].sol)}.`,
  make(stage, v, ex) {
    const D = BK[v], LW = 300, W = ex.W, rows = div(stage, 'u8l7-rows', '', 0, 0, LW - 14);
    const S = new Strip(stage, { x: LW, y: 0, width: W - LW, height: 452, xmin: D.win[0], xmax: D.win[1], l: 26, r: W - LW - 26 });
    const NY = 40, ticks = []; for (let t = Math.ceil(D.win[0]); t <= D.win[1]; t++) ticks.push(t);
    const nl = S.axis(NY, ticks.map((t) => ({ v: t, t: String(t) })), { labels: false });
    D.ends.forEach((e) => S.hlabel(S.X(e.v), NY + 12, T(e.t), { pos: 's', gap: 0, cls: 'u8l7-tl' }));
    drawSol(S, NY, D.runs, { color: INK });
    /* the factor tiles that the endpoints fly into */
    const line = div(stage, 'u8l7-bline', '', LW, 104, W - LW); const mk = (html, cls) => { const s = h('span', 'u8l7-bt ' + (cls || ''), html); line.appendChild(s); return s; };
    const ft = D.ends.map((e) => hide(mk(T(e.f === 'x' ? 'x' : '(' + e.f + ')'), 'u8l7-bf')));
    const rt = hide(mk(T(D.ineq.replace(/^.*?([<>]|\\le|\\ge)0$/, '$1') + '0'), 'u8l7-brel'));
    const note = D.ends[0].note ? hide(div(stage, 'u8l7-bnote', D.ends[0].note, LW + 12, 152)) : null;
    const exp = hide(div(stage, 'u8l7-bexp', T(D.exp), LW, 166, W - LW));
    /* the parabola check underneath */
    const gTop = 214, gBot = 446, Yg = S.yMap(gTop, gBot, D.yr);
    const gAx = hide(svgEl('line', { x1: 8, x2: W - LW - 8, y1: Yg(0), y2: Yg(0), stroke: INK, 'stroke-width': 2 }, S.layers.bg));
    const tint = hide(S.tint(D.g, gTop, gBot, D.yr)), curve = hide(S.plot(D.g, gTop, gBot, D.yr));
    const gd = D.ends.map((e) => hide(svgEl('line', { x1: S.X(e.v), x2: S.X(e.v), y1: NY, y2: Yg(0), stroke: COLORS.gray, 'stroke-width': 2, 'stroke-dasharray': '5 5' }, S.layers.top)));
    const ok = hide(stamp(stage, 'matches', { ok: true, x: W - 74, y: gTop + 24, size: 'sm' }));
    const R = [row(rows, 1, `Each endpoint gives a factor: ${D.ends.map((e) => T(e.f === 'x' ? 'x' : '(' + e.f + ')')).join(' ')}`), row(rows, 2, `${D.relC}: ${T(D.ineq)}`), row(rows, 3, `Expand: ${T(D.exp)}`, 'u8l7-rowans'), row(rows, '✓', 'Check with the parabola', 'u8l7-rowck')];
    const fly = async (c, e, tile) => {
      const g = div(stage, 'u8l7-bt u8l7-bf u8l7-ghost', T(e.t), LW + S.X(e.v) - 16, NY - 18);
      const tx = line.offsetLeft + tile.offsetLeft, ty = line.offsetTop + tile.offsetTop;
      await anim(c, g, [{ left: g.style.left, top: g.style.top, opacity: 1 }, { left: tx + 'px', top: ty + 'px', opacity: 1 }], 700);
      g.remove(); unhide(tile); await pop(c, tile, 300);
    };
    const sign = D.between ? `<b>between</b> its zeros the parabola is <b>negative</b>: ${T(D.open ? '<0' : '\\le0')}` : `<b>outside</b> its zeros it is <b>positive</b>: ${T(D.open ? '>0' : '\\ge0')}`;
    return [
      { cap: `Each endpoint ${T('r')} gives a factor ${T('(x-r)')}: ${D.ends.map((e) => T(e.t) + ' gives ' + T(e.f === 'x' ? 'x' : '(' + e.f + ')')).join(', ')}${D.ends[0].note ? `; an endpoint ${T('\\frac pq')} gives ${T('(qx-p)')}: ${D.ends[0].note}` : ''}.`,
        run: async (c) => { await show(c, unhide(R[0])); for (let i = 0; i < D.ends.length; i++) await fly(c, D.ends[i], ft[i]); if (note) await show(c, unhide(note)); } },
      { cap: `The shading is ${D.between ? 'between' : 'outside'} the endpoints, and the dots are ${D.open ? '<b>open</b> (not included)' : '<b>closed</b> (included)'}. With ${T('a>0')}: ${sign}.`,
        run: async (c) => { await show(c, unhide(R[1])); unhide(rt); await pop(c, rt, 380); } },
      { cap: `Expand: ${T(D.ineq.replace(/(<|>|\\le|\\ge)0$/, ''))}${T('=' + D.exp.replace(/(<|>|\\le|\\ge)0$/, ''))}. The inequality: ${T(D.exp)}.`,
        run: async (c) => { if (note) hide(note); await show(c, unhide(R[2])); unhide(exp); await fadeIn(c, exp, 420); } },
      { cap: `<b>Check:</b> the parabola ${T('y=' + D.exp.replace(/(<|>|\\le|\\ge)0$/, ''))} is ${D.between ? 'below' : 'above'} the ${T('x')}-axis exactly where the number line is shaded.`,
        run: async (c) => { await show(c, unhide(R[3])); unhide(gAx); gd.forEach(unhide); unhide(curve); await drawIn(curve, 900, c); unhide(tint); await fadeIn(c, tint, 400, { from: 'none' }); unhide(ok); await stampIn(c, ok); } }
    ];
  }
};

/* =============================== explainer: the rocket and the ticket price (Examples 8, 9) =============================== */
const hR = (t) => 40 * t - 5 * t * t;
const pT = (x) => (-20 * x * x + 1000 * x - 8000) / 1000; // profit in thousands
const rocket = {
  title: 'The picture moves with the graph',
  height: 452, minW: 900, capH: 100,
  choices: [{ v: 'r', label: 'Example 8: rocket' }, { v: 'p', label: 'Example 9: ticket price' }],
  ask: (v) => v === 'r' ? `<b>Example 8:</b> a model rocket's height is ${T('h=40t-5t^2')} metres after ${T('t')} seconds. When is it at least ${T('60')} m high? For how long? When is it in the air? Show it never reaches ${T('90')} m.`
    : `<b>Example 9:</b> a theatre group's profit is ${T('P=-20x^2+1000x-8000')} dollars when a ticket costs ${T('x')} dollars. For what prices is there a profit? A profit of at least ${T('\\$3000')}?`,
  make(stage, v, ex) { return v === 'r' ? rocketMake(stage, ex) : ticketMake(stage, ex); }
};
function rocketMake(stage, ex) {
  const SW = 150, GW = 380, W = ex.W;
  const G = new Graph(stage, { x: SW + 10, y: 0, width: GW, height: 452, xmin: 0, xmax: 9, ymin: 0, ymax: 100, xstep: 1, ystep: 10, ylabels: 20, fontSize: 15, xtitle: 't', ytitle: 'h', pad: [30, 18, 36, 44] });
  const P = div(stage, 'u8l7-rows u8l7-rows-s', '', SW + GW + 28, 0, W - SW - GW - 32);
  const yPx = (hh) => G.toPx(0, hh)[1];
  const scene = div(stage, 'u8l7-scene', '', 0, 0, SW, 452);
  div(scene, 'u8l7-ground', '', 0, yPx(0), SW, 452 - yPx(0));
  const ledge = (hh, cls, lab) => { const d = div(scene, 'u8l7-ledge ' + cls, `<span>${lab}</span>`, 0, yPx(hh), SW); hide(d); return d; };
  const L60 = ledge(60, '', '60 m'), L90 = ledge(90, 'red', '90 m');
  const rk = div(scene, 'u8l7-rk', '🚀', SW / 2 - 22, yPx(0) - 46);
  const setR = (t) => { const hh = Math.max(0, hR(t)); rk.style.top = (yPx(hh) - 46) + 'px'; rk.style.transform = `rotate(${t <= 4 ? -45 : 135}deg)`; rk.classList.toggle('hi', hh >= 60 - 1e-9 && t > 0); };
  const fo = { color: FN, width: 3.5, to: 0, from: 0 }, curve = G.fn(hR, fo);
  const tr = hide(G.point(0, 0, { color: SCN, r: 8 })), clock = div(scene, 'u8l7-clock', '', 6, 6); hide(clock);
  const h60 = hide(G.hline(60, { color: SOL, width: 2.5 })), p2 = hide(G.point(2, 60, { color: SOL, r: 7, label: T('(2,\\ 60)'), pos: 'nw' })), p6 = hide(G.point(6, 60, { color: SOL, r: 7, label: T('(6,\\ 60)'), pos: 'ne' }));
  const s26 = hide(G.shadeX(2, 6, { color: SOL, width: 10 })), s08 = hide(G.shadeX(0, 8, { color: FN, width: 8, openA: true, openB: true, offset: -18 }));
  const brk = hide(G.label(4, 4, '4 s', { cls: 'u8l7-br' })), h90 = hide(G.hline(90, { color: NEG, width: 2.5 })), top = hide(G.point(4, 80, { color: FN, r: 7, label: T('(4,\\ 80)'), pos: 'n' }));
  const st = hide(stamp(stage, 'never 90 m', { ok: false, x: SW + 10 + GW / 2 + 20, y: 64, size: 'sm' }));
  const R = [row(P, '(a)', `${T('40t-5t^2\\ge60')}<br>${T('-5t^2+40t-60\\ge0')}<br>${T('\\div(-5)')}, reverse: ${T('t^2-8t+12\\le0')}<br>${T('(t-2)(t-6)\\le0')}: ${T('2\\le t\\le6')}`),
    row(P, '(b)', `${T('6-2=4')} seconds`), row(P, '(c)', `${T('40t-5t^2>0')}<br>${T('5t(8-t)>0')}: ${T('0<t<8')}`),
    row(P, '(d)', `${T('t^2-8t+18\\le0')}<br>${T('b^2-4ac=64-72=-8<0')}<br>${T('t=0')}: ${T('18>0')}, always positive`)];
  const fly = (c, t0, t1, ms) => { unhide(tr); unhide(clock); return tween(c, ms, (u) => { const t = t0 + (t1 - t0) * u; if (t > fo.to) { fo.to = t; curve._bkDraw(); } G.moveTo(tr, t, Math.max(0, hR(t))); setR(t); clock.innerHTML = `${T('t=' + t.toFixed(1))}<br>${T('h=' + Math.max(0, hR(t)).toFixed(0))}`; }, (u) => u); };
  setR(0);
  return [
    { cap: `Launch! The rocket flies at the height the graph shows: up for ${T('4')} s to ${T('80')} m, then down, landing at ${T('t=8')}.`, run: async (c) => { await fly(c, 0, 8, 5200); } },
    { cap: `(a) <b>At least</b> ${T('60')} m: ${T('40t-5t^2\\ge60')}. One side ${T('0')}, divide by ${T('-5')} and <b>reverse</b>: ${T('(t-2)(t-6)\\le0')}, so ${T('2\\le t\\le6')}: from 2 s to 6 s after launch. The rocket glows above the line.`,
      run: async (c) => { await show(c, unhide(R[0])); unhide(L60); await show(c, L60); unhide(h60); await drawIn(h60, 500, c); await G.reveal(unhide(p2), c); await G.reveal(unhide(p6), c); await fly(c, 2, 6, 2600); unhide(s26); await drawIn(s26, 600, c); } },
    { cap: `(b) From ${T('t=2')} to ${T('t=6')}: ${T('6-2=4')} seconds at ${T('60')} m or higher.`, run: async (c) => { await show(c, unhide(R[1])); unhide(brk); await pop(c, brk); } },
    { cap: `(c) In the air: ${T('h>0')}. ${T('40t-5t^2=5t(8-t)>0')}: both factors are positive for ${T('0<t<8')} (for ${T('t>8')} the height would be negative).`, run: async (c) => { await show(c, unhide(R[2])); unhide(s08); await drawIn(s08, 700, c); } },
    { cap: `(d) ${T('40t-5t^2\\ge90')} gives ${T('t^2-8t+18\\le0')}. ${T('b^2-4ac=-8<0')} and ${T('t=0')} gives ${T('18>0')}: always positive, <b>no solution</b>. Its maximum is ${T('80')} m at ${T('t=4')}.`,
      run: async (c) => { await show(c, unhide(R[3])); unhide(L90); await show(c, L90); unhide(h90); await drawIn(h90, 500, c); await G.reveal(unhide(top), c); G.moveTo(tr, 4, 80); setR(4); unhide(st); await stampIn(c, st); } }
  ];
}
function ticketMake(stage, ex) {
  const SW = 150, GW = 400, W = ex.W;
  const G = new Graph(stage, { x: SW + 10, y: 0, width: GW, height: 452, xmin: 0, xmax: 52, ymin: -9, ymax: 6, xstep: 5, xlabels: 10, ystep: 1, ylabels: 3, fontSize: 15, xtitle: 'x', ytitle: 'P', pad: [30, 18, 18, 30] });
  const P = div(stage, 'u8l7-rows u8l7-rows-s', '', SW + GW + 28, 0, W - SW - GW - 32);
  const scene = div(stage, 'u8l7-scene u8l7-scene2', '', 0, 0, SW, 452);
  div(scene, 'u8l7-unit', `${T('P')} in thousands of dollars`, 6, 410, SW - 12);
  const tk = div(scene, 'u8l7-tk', '🎟️', SW / 2 - 30, 120), price = div(scene, 'u8l7-price', '', 6, 70, SW - 12), prof = div(scene, 'u8l7-prof', '', 6, 200, SW - 12);
  const mask = div(scene, 'u8l7-mask', '🎭', SW / 2 - 26, 290);
  const fo = { color: FN, width: 3.5, to: 0 }, curve = G.fn(pT, fo);
  const tr = hide(G.point(0, pT(0), { color: SCN, r: 8 }));
  const set = (x) => { const p = -20 * x * x + 1000 * x - 8000; price.innerHTML = `price<br><b>$${x.toFixed(2)}</b>`; prof.innerHTML = `profit<br><b class="${p > 0 ? 'u8l7-cp' : p < 0 ? 'u8l7-cm' : ''}">${p < 0 ? '−' : ''}$${Math.abs(Math.round(p))}</b>`; mask.style.opacity = p > 0 ? 1 : 0.25; };
  set(0);
  const s1 = hide(G.shadeX(10, 40, { color: SOL, width: 10, openA: true, openB: true })), h3 = hide(G.hline(3, { color: SOL, width: 2.5 }));
  const a = 25 - 5 * Math.sqrt(3), b = 25 + 5 * Math.sqrt(3), s2 = hide(G.shadeX(a, b, { color: POS, width: 10, offset: -18 }));
  const pa = hide(G.point(a, 3, { color: SOL, r: 7, label: T('16.34'), pos: 'nw' })), pb = hide(G.point(b, 3, { color: SOL, r: 7, label: T('33.66'), pos: 'ne' }));
  const R = [row(P, '(a)', `${T('-20x^2+1000x-8000>0')}<br>${T('\\div(-20)')}, reverse:<br>${T('x^2-50x+400<0')}<br>${T('(x-10)(x-40)<0')}: ${T('10<x<40')}`),
    row(P, '(b)', `${T('-20x^2+1000x-11\\,000\\ge0')}<br>${T('x^2-50x+550\\le0')}<br>${T('x=\\dfrac{50\\pm\\sqrt{2500-2200}}{2}=25\\pm5\\sqrt3')}<br>From $16.34 to $33.66`)];
  return [
    { cap: `Slide the ticket price from ${T('\\$0')} to ${T('\\$50')}. Too cheap or too expensive and the group <b class="u8l7-cm">loses</b> money; in between it makes a <b class="u8l7-cp">profit</b>.`,
      run: async (c) => { unhide(tr); await tween(c, 5200, (u) => { const x = 50 * u; if (x > fo.to) { fo.to = x; curve._bkDraw(); } G.moveTo(tr, x, Math.max(G.win.ymin, pT(x))); tr.style.opacity = pT(x) < G.win.ymin ? 0 : ''; set(x); }, (u) => u); fo.to = undefined; curve._bkDraw(); } },
    { cap: `(a) A profit: ${T('P>0')}. Divide by ${T('-20')} and <b>reverse</b>: ${T('(x-10)(x-40)<0')}, negative between the zeros. Any price between ${T('\\$10')} and ${T('\\$40')}.`,
      run: async (c) => { await show(c, unhide(R[0])); unhide(s1); await drawIn(s1, 700, c); } },
    { cap: `(b) ${T('P\\ge3000')}: ${T('x^2-50x+550\\le0')} doesn't factor. The formula: ${T('x=25\\pm5\\sqrt3')}. Prices from ${T('\\$16.34')} to ${T('\\$33.66')} (to the nearest cent).`,
      run: async (c) => { await show(c, unhide(R[1])); unhide(h3); await drawIn(h3, 500, c); await G.reveal(unhide(pa), c); await G.reveal(unhide(pb), c); unhide(s2); await drawIn(s2, 600, c); } }
  ];
}

/* =============================== explainer: slide k (Example 10) =============================== */
const kslide = {
  title: 'Slide k: when are there no real roots?',
  height: 452, minW: 900, capH: 96, tap: true,
  choices: [{ v: 'ex', label: 'Example 10' }, { v: 'play', label: 'Your turn' }],
  ask: (v) => `<b>${v === 'play' ? 'Your turn' : 'Example 10'}:</b> for what values of ${T('k')} does ${T('x^2+(k-2)x+4=0')} have no real roots?`,
  make(stage, v, ex) {
    const GW = 420, W = ex.W, st = { k: -5 };
    const G = new Graph(stage, { x: 0, y: 0, width: GW, height: 452, xmin: -6, xmax: 6, ymin: -9, ymax: 12, xstep: 1, ystep: 1, xlabels: 2, ylabels: 3, fontSize: 15, pad: [26, 16, 16, 16] });
    const f = (x) => x * x + (st.k - 2) * x + 4, Dk = (k) => (k - 2) * (k - 2) - 16;
    const curve = G.fn(f, { color: FN, width: 3.5 });
    const rts = [G.point(0, 0, { color: SOL, r: 7 }), G.point(0, 0, { color: SOL, r: 7 })];
    const RX = GW + 24, S = new Strip(stage, { x: RX, y: 0, width: W - RX, height: 104, xmin: -6, xmax: 10, l: 22, r: W - RX - 22 });
    const ky = 62, ticks = []; for (let t = -6; t <= 10; t++) ticks.push({ v: t, t: String(t) });
    S.axis(ky, ticks.filter((t) => t.v % 2 === 0)); S.hlabel(S.r + 16, ky - 12, T('k'), { pos: 'n', gap: 0, cls: 'u8l7-tl' });
    const paint = svgEl('g', {}, S.layers.data);
    const kdot = svgEl('circle', { cx: S.X(st.k), cy: ky, r: 9, fill: SCN, stroke: '#fff', 'stroke-width': 2 }, S.layers.top);
    const rd = div(stage, 'u8l7-out', '', RX, 100, W - RX - 6);
    const P = div(stage, 'u8l7-rows u8l7-rows-s', '', RX, 196, W - RX - 6);
    let lastK = null;
    const upd = (k) => {
      st.k = k; curve._bkDraw();
      const D = Dk(k), n = Math.abs(D) < 1e-6 ? 1 : D > 0 ? 2 : 0, b = k - 2;
      const z = n === 2 ? [(-b - Math.sqrt(D)) / 2, (-b + Math.sqrt(D)) / 2] : n === 1 ? [-b / 2, -b / 2] : [];
      rts.forEach((p, i) => { if (z[i] != null) { G.moveTo(p, z[i], 0); p.style.opacity = ''; } else p.style.opacity = 0; });
      kdot.setAttribute('cx', S.X(k));
      if (lastK !== null && k > lastK) { const cut = [lastK, ...[-2, 6].filter((q) => q > lastK && q < k), k]; for (let i = 0; i < cut.length - 1; i++) svgEl('line', { x1: S.X(cut[i]), x2: S.X(cut[i + 1]), y1: ky, y2: ky, stroke: Dk((cut[i] + cut[i + 1]) / 2) < 0 ? POS : NEG, 'stroke-width': 9, 'stroke-opacity': .8 }, paint); }
      lastK = k;
      rd.innerHTML = `<div>${T('k=' + texNum(k, 2))}: ${T('x^2' + (b ? (b > 0 ? '+' : '') + texNum(b, 2) + 'x' : '') + '+4')}</div><div>${T('b^2-4ac=' + texNum(D, 2))}</div><div class="${n === 0 ? 'u8l7-cp' : n === 2 ? 'u8l7-cm' : 'u8l7-cv'}"><b>${n === 0 ? 'no real roots' : n === 1 ? 'one real root' : 'two real roots'}</b></div>`;
    };
    upd(st.k); lastK = st.k;
    if (v === 'play') {
      const l = h('label', 'u8l7-sl no-ink', `<span class="u8l7-sll">${T('k')}</span><input type="range" min="-6" max="10" step="0.25" value="${st.k}" aria-label="the value of k"><span class="u8l7-slv"></span>`);
      l.setAttribute('data-tap', ''); P.appendChild(l);
      const inp = l.querySelector('input'), out = l.querySelector('.u8l7-slv'); paint.innerHTML = '';
      const go = () => { lastK = null; upd(parseFloat(inp.value)); out.textContent = String(st.k).replace('-', '−'); };
      inp.addEventListener('input', go); go();
      return [{ cap: `Drag ${T('k')}. The roots are where the parabola meets the ${T('x')}-axis. Which values of ${T('k')} lift it off the axis completely?`, run: async () => {} }];
    }
    const R = [row(P, 1, `No real roots: ${T('b^2-4ac<0')}<br>${T('(k-2)^2-4(1)(4)<0')}`), row(P, 2, `${T('k^2-4k-12<0')}<br>${T('(k-6)(k+2)<0')}`), row(P, 3, `${T('\\{k\\mid -2<k<6,\\ k\\in\\mathbb{R}\\}')}`, 'u8l7-rowans'), row(P, '✓', `${T('k=0')}: ${T('x^2-2x+4')}, ${T('4-16<0')}`, 'u8l7-rowck')];
    const sol = hide(S.interval(ky - 26, -2, 6, { openA: true, openB: true, color: SOL, width: 8 }));
    const ok = hide(stamp(stage, '✓', { ok: true, x: GW - 50, y: 50, size: 'sm' }));
    return [
      { cap: `Slide ${T('k')} from ${T('-5')} to ${T('9')}. The parabola moves; the ${T('k')} line is painted <b class="u8l7-cm">red</b> where there are two real roots and <b class="u8l7-cp">green</b> where there are none.`,
        run: async (c) => { paint.innerHTML = ''; lastK = -5; await tween(c, 6000, (t) => { upd(-5 + 14 * t); }, (t) => t); } },
      { cap: `No real roots means the discriminant is negative: ${T('b^2-4ac<0')} with ${T('a=1')}, ${T('b=k-2')}, ${T('c=4')}: ${T('(k-2)^2-16<0')}.`, run: async (c) => { await show(c, unhide(R[0])); } },
      { cap: `${T('k^2-4k+4-16<0')}, so ${T('k^2-4k-12<0')}: ${T('(k-6)(k+2)<0')}, negative <b>between</b> its zeros: ${T('-2<k<6')}. The green part of the line!`,
        run: async (c) => { await show(c, unhide(R[1])); await show(c, unhide(R[2])); unhide(sol); await drawIn(sol, 600, c); } },
      { cap: `Check ${T('k=0')}: ${T('x^2-2x+4=0')} has ${T('b^2-4ac=4-16<0')}: no real roots.`,
        run: async (c) => { await show(c, unhide(R[3])); const k0 = st.k; await tween(c, 900, (t) => { lastK = null; upd(k0 + (0 - k0) * t); }); unhide(ok); await stampIn(c, ok); } }
    ];
  }
};

/* =============================== Stand Up Break =============================== */
const sgnT = (n) => (n < 0 ? '-' : '+');
const linT = (r) => (r === 0 ? 'x' : `(x${r > 0 ? '-' : '+'}${Math.abs(r)})`);
const polyT = (a, b, c, v = 'x') => {
  let s = a === 1 ? v + '^2' : a === -1 ? '-' + v + '^2' : a + v + '^2';
  if (b) s += (b > 0 ? '+' : '-') + (Math.abs(b) === 1 ? '' : Math.abs(b)) + v;
  if (c) s += (c > 0 ? '+' : '-') + Math.abs(c);
  return s;
};
const RELS = { '>': ['>', '<', '>'], '<': ['<', '>', '<'], '\\ge': ['\\ge', '\\le', '\\ge'], '\\le': ['\\le', '\\ge', '\\le'] };
const solveT = (r1, r2, rel) => (rel === '<' ? `${r1}<x<${r2}` : rel === '\\le' ? `${r1}\\le x\\le${r2}` : rel === '>' ? `x<${r1}\\text{ or }x>${r2}` : `x\\le${r1}\\text{ or }x\\ge${r2}`);
const roots2 = (r) => { for (;;) { const a = r.int(-7, 7), b = r.int(-7, 7); if (a < b && a && b) return [a, b]; } };
standup('u8l7', {
  intro: 'At your whiteboard: one side 0, factor, a sign chart (or cases), then answer in set notation.',
  levels: {
    BEG: (r) => {
      const [p, q] = roots2(r), rel = r.pick(['>', '<', '\\ge', '\\le']);
      return { text: 'Solve with a sign chart or case analysis. Write the solution in set notation.', q: `${linT(p)}${linT(q)}${rel}0`,
        a: [`\\text{zeros } ${p},\\ ${q}`, `\\text{product } +,\\ 0,\\ -,\\ 0,\\ +`, `\\{x\\mid ${solveT(p, q, rel)},\\ x\\in\\mathbb{R}\\}`] };
    },
    PRG: (r) => {
      const [p, q] = roots2(r), rel = r.pick(['>', '<', '\\ge', '\\le']), neg = r.chance(0.5);
      const B = -(p + q), C = p * q;
      if (neg) { const rel2 = RELS[rel][1];
        return { text: 'Solve. Write the solution in set notation.', q: `${polyT(-1, -B, -C)}${rel}0`,
          a: [`\\times(-1):\\ ${polyT(1, B, C)}${rel2}0`, `${linT(p)}${linT(q)}${rel2}0`, `\\{x\\mid ${solveT(p, q, rel2)},\\ x\\in\\mathbb{R}\\}`] }; }
      const K = r.int(2, 9), lhs = polyT(1, B, C + K);
      return { text: 'Rearrange so one side is 0, then solve. Write the solution in set notation.', q: `${lhs}${rel}${K}`,
        a: [`${polyT(1, B, C)}${rel}0`, `${linT(p)}${linT(q)}${rel}0`, `\\{x\\mid ${solveT(p, q, rel)},\\ x\\in\\mathbb{R}\\}`] };
    },
    MAS: (r) => {
      for (;;) {
        const qd = r.pick([2, 3, 4, 5]), pn = r.pick([-5, -3, -1, 1, 3, 5]), s = r.int(-5, 6), between = r.chance(0.5), closed = r.chance(0.5);
        if (pn % qd === 0 || pn / qd >= s) continue;
        const g = (a, b) => (b ? g(b, a % b) : Math.abs(a)); if (g(pn, qd) !== 1) continue;
        const fr = `${pn < 0 ? '-' : ''}\\frac{${Math.abs(pn)}}{${qd}}`;
        const solS = between ? (closed ? `${fr}\\le x\\le${s}` : `${fr}<x<${s}`) : (closed ? `x\\le${fr}\\text{ or }x\\ge${s}` : `x<${fr}\\text{ or }x>${s}`);
        const rel = between ? (closed ? '\\le' : '<') : (closed ? '\\ge' : '>');
        const A = qd, Bc = -(qd * s + pn), Cc = pn * s; // (qd x - pn)(x - s)
        return { text: 'Write a quadratic inequality with integer coefficients and a positive leading coefficient that has this solution.', q: `\\{x\\mid ${solS},\\ x\\in\\mathbb{R}\\}`,
          a: [`(${qd}x${pn > 0 ? '-' : '+'}${Math.abs(pn)})${linT(s)}${rel}0`, `${polyT(A, Bc, Cc)}${rel}0`] };
      }
    }
  }
});

/* =============================== mount =============================== */
export const explainers = mountExplainers({ cases, scan, onesign, back, rocket, kslide });
export const _test = { chartCols, solRuns, SC, OS, BK, pairsOf };
