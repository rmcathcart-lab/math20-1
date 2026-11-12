/* Math 20-1 · Unit 8 · Lesson 4 — Linear Inequalities in Two Variables.
 * New lesson format (2026-11-11): the warm-up ("The Nugget Order") is plain markup on the page (no code). Explainers:
 *   onevar    (the one-variable procedure with step numbers: solve, and the sign card flips when we divide by a negative;
 *              test values drop onto the number line ✓/✗; the ray; set notation; Example 1(a), (b)),
 *   dropper   (STAR: test points drop onto the plane, each is substituted and turns green ✓ or red ✗, then hundreds more
 *              until the half-plane "emerges"; the boundary is the edge between the colours; the class can tap the grid
 *              to drop their own points; Examples 2, 3(a), 4(c)),
 *   graph4    (the four graphing steps with step numbers: boundary, solid/dashed, test point, shade (the shading floods
 *              out from the line), then the above/below shortcut as a check; Examples 3, 4, 5(a), 5(b)),
 *   fromgraph (writing the inequality from a graph: the boundary line, then four sign cards are knocked out — dashed or
 *              solid removes two, the test point from the shaded region removes one more; Example 6(a)–(c)),
 *   tickets   (STAR: the school play's box office moves in step with a point on the graph: the cash total and a goal bar
 *              update live; (60, 50) falls short, the point climbs from (40, 0) to (40, 90); then a zoom shows that only
 *              whole-number points are real answers; Example 7),
 *   overlap   (STAR: Jordan's two conditions shade blue and orange, the overlap triangle is what's left; (10, 8) passes one
 *              check and fails the other; a vertical line sweeps right until it first touches the region at (6, 14);
 *              Example 8).
 * Colours: boundary lines and the solution region blue; solutions (✓) green, non-solutions (✗) red; the test point gold;
 *   Jordan's hours condition blue, money condition orange, their overlap purple. Given graphs (Example 6) ink and gray. */
import { h, tex, add, box, mountExplainers, pop, fadeIn, tween, anim, svgEl, pulse, shake, sleep, linear, COLORS,
  Graph, NumberLine, stamp, stampIn, num } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const BL = COLORS.blue, OR = '#d9730d', OK = COLORS.green, NO = COLORS.red, PU = COLORS.purple, GO = '#c99a06', GR = '#8d93a0', INK = '#1c2230';
const show = (c, el) => { el.style.opacity = 1; return fadeIn(c, el, 320); };
const hide = (el) => { if (el) { el.style.opacity = 0; if (el.label) el.label.style.opacity = 0; } return el; };
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
const stampOn = (host, text, ok, x, y, size) => hide(stamp(host, text, { ok, x, y, rotate: -8, size }));
const sIn = async (c, el) => { el.style.opacity = 1; await stampIn(c, el); };
const P = (v) => `(${v})`;   // a substituted value: 2(−3), 2(4)
const pt = (x, y) => `(${x},\\ ${y})`;
const mark = (ok) => `<b class="${ok ? 'u8l4-ok' : 'u8l4-no'}">${ok ? '✓' : '✗'}</b>`;
/* a step heading with its number (n) */
const stepH = (host, n, html) => hide(div(host, 'u8l4-sh', `<b class="u8l4-sn">${n}</b><span>${html}</span>`));

/* =============================== inequalities: A x + B y (op) C =============================== */
const OPF = { '<': (l, r) => l < r - 1e-9, '<=': (l, r) => l <= r + 1e-9, '>': (l, r) => l > r + 1e-9, '>=': (l, r) => l >= r - 1e-9 };
const OPT = { '<': '\\lt', '<=': '\\le', '>': '\\gt', '>=': '\\ge' };
const holds = (q, x, y) => OPF[q.op](q.A * x + q.B * y, q.C);
const onLine = (q, x, y) => Math.abs(q.A * x + q.B * y - q.C) < 1e-9;
const isDashed = (q) => q.op.length === 1;
const keepOf = (q) => (q.op[0] === '<' ? [q.A, q.B, q.C] : [-q.A, -q.B, -q.C]); // the solution side as a x + b y ≤ c
/* keep the part of a polygon where a x + b y ≤ c (Sutherland–Hodgman, one edge) */
function clip(poly, [a, b, c]) {
  const out = [], f = (p) => a * p[0] + b * p[1] - c;
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length], fp = f(p), fq = f(q);
    if (fp <= 0) out.push(p);
    if ((fp < 0 && fq > 0) || (fp > 0 && fq < 0)) { const t = fp / (fp - fq); out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]); }
  }
  return out;
}
/* a shaded region (the intersection of half-planes `qs`), redrawn with the graph; el.set(t) floods it out from the
 * boundary of qs[0] (t = 0: nothing, t = 1: all of it) */
function region(G, qs, o = {}) {
  const el = svgEl('polygon', { class: 'u8l4-reg', fill: o.color || BL, 'fill-opacity': o.op ?? 0.2 });
  if (o.top) G.layers.data.appendChild(el); else G.layers.data.insertBefore(el, G.layers.data.firstChild);
  el.t = o.t ?? 1;
  const cons = qs.map((q) => (Array.isArray(q) ? q : keepOf(q)));
  G.track(el, () => {
    const w = G.win, mx = (w.xmax - w.xmin) * 0.3, my = (w.ymax - w.ymin) * 0.3;
    let poly = [[w.xmin - mx, w.ymin - my], [w.xmax + mx, w.ymin - my], [w.xmax + mx, w.ymax + my], [w.xmin - mx, w.ymax + my]];
    cons.forEach((k) => { poly = clip(poly, k); });
    if (el.t < 1) {
      const [a, b, c] = cons[0], M = Math.max(...[[w.xmin, w.ymin], [w.xmax, w.ymin], [w.xmin, w.ymax], [w.xmax, w.ymax]].map((p) => c - a * p[0] - b * p[1]), 1e-6);
      poly = clip(poly, [-a, -b, el.t * M * 1.02 - c]);
    }
    el.setAttribute('points', poly.map((p) => G.toPx(p[0], p[1]).map((v) => v.toFixed(1)).join(',')).join(' '));
  });
  el.set = (t) => { el.t = t; el._bkDraw(); };
  return el;
}
const flood = (c, el, ms = 1100) => { el.style.opacity = 1; return tween(c, ms, (t) => el.set(t)); };
/* the boundary line of q */
function bline(G, q, o = {}) {
  const L = q.B !== 0 ? { m: -q.A / q.B, b: q.C / q.B } : { x: q.C / q.A };
  return G.line(L, { color: o.color || BL, width: o.width || 4, dash: o.dash ?? isDashed(q), arrows: false });
}

/* =============================== figures on the example cards =============================== */
const W6 = { xmin: -6.5, xmax: 6.5, ymin: -6.5, ymax: 6.5, xlabels: 2, ylabels: 2, fontSize: 13 };
const FIGS = {
  e2: { g: { width: 360, height: 360 }, ans: { shade: [{ A: 2, B: -1, C: 4, op: '<' }], lines: [{ q: { A: 2, B: -1, C: 4, op: '<' } }],
    pts: [[0, 0, '\\text{(i)}', 'nw'], [3, 1, '\\text{(ii)}', 'e'], [1, -3, '\\text{(iii)}', 'e'], [2, 0, '\\text{(iv)}', 'se'], [-2, 3, '\\text{(v)}', 'ne']] } },
  e3a: { g: { width: 330, height: 330 }, ans: { shade: [{ A: -2, B: 1, C: -1, op: '<' }], lines: [{ q: { A: -2, B: 1, C: -1, op: '<' } }] } },
  e3b: { g: { width: 330, height: 330 }, ans: { shade: [{ A: 2 / 3, B: 1, C: 3, op: '>=' }], lines: [{ q: { A: 2 / 3, B: 1, C: 3, op: '>=' } }] } },
  e4a: { ans: { shade: [{ A: 4, B: -3, C: 12, op: '>=' }], lines: [{ q: { A: 4, B: -3, C: 12, op: '>=' } }] } },
  e4b: { ans: { shade: [{ A: 2, B: 5, C: 0, op: '<' }], lines: [{ q: { A: 2, B: 5, C: 0, op: '<' } }] } },
  e4c: { ans: { shade: [{ A: 5, B: 2, C: 10, op: '<=' }], lines: [{ q: { A: 5, B: 2, C: 10, op: '<=' } }] } },
  e5a: { ans: { shade: [{ A: 1, B: 0, C: -2, op: '>' }], lines: [{ q: { A: 1, B: 0, C: -2, op: '>' } }] } },
  e5b: { ans: { shade: [{ A: 0, B: 1, C: -1, op: '<=' }], lines: [{ q: { A: 0, B: 1, C: -1, op: '<=' } }] } },
  e5c: { ans: { shade: [{ A: 0, B: 1, C: -3, op: '>=' }, { A: 0, B: 1, C: 2, op: '<' }], lines: [{ q: { A: 0, B: 1, C: -3, op: '>=' } }, { q: { A: 0, B: 1, C: 2, op: '<' } }] } },
  e6a: { given: { shade: [{ A: -2 / 3, B: 1, C: -1, op: '>' }], lines: [{ q: { A: -2 / 3, B: 1, C: -1, op: '>' } }], pts: [[0, -1], [3, 1]] } },
  e6b: { given: { shade: [{ A: 3, B: 4, C: 12, op: '<=' }], lines: [{ q: { A: 3, B: 4, C: 12, op: '<=' } }], pts: [[4, 0], [0, 3]] } },
  e6c: { given: { shade: [{ A: 1, B: 0, C: 3, op: '<' }], lines: [{ q: { A: 1, B: 0, C: 3, op: '<' } }] } },
  e7: { g: { width: 400, height: 460, xmin: 0, xmax: 135, ymin: 0, ymax: 175, xstep: 10, ystep: 10, xlabels: 20, ylabels: 20, xtitle: 'a', ytitle: 's', fontSize: 13 },
    ans: { shade: [{ A: 15, B: 10, C: 1500, op: '>=' }, { A: 1, B: 0, C: 0, op: '>=' }, { A: 0, B: 1, C: 0, op: '>=' }], lines: [{ q: { A: 15, B: 10, C: 1500, op: '>=' } }],
      pts: [[60, 50, '(60,\\ 50)', 's'], [40, 90, '(40,\\ 90)', 'e']] } },
  e8: { g: { width: 400, height: 420, xmin: 0, xmax: 23, ymin: 0, ymax: 23, xstep: 1, ystep: 1, xlabels: 4, ylabels: 4, fontSize: 13 },
    ans: { shade: [{ A: 1, B: 1, C: 20, op: '<=' }, { A: 20, B: 15, C: 330, op: '>=' }, { A: 1, B: 0, C: 0, op: '>=' }, { A: 0, B: 1, C: 0, op: '>=' }], op: 0.28, color: PU,
      lines: [{ q: { A: 1, B: 1, C: 20, op: '<=' } }, { q: { A: 20, B: 15, C: 330, op: '>=' } }], pts: [[6, 14, '(6,\\ 14)', 'ne']] } }
};
function drawFig(G, d, given) {
  if (d.shade) region(G, d.shade, { color: given ? GR : d.color || BL, op: d.op ?? (given ? 0.28 : 0.2) });
  (d.lines || []).forEach((L) => bline(G, L.q, { color: given ? INK : BL, width: 3 }));
  (d.pts || []).forEach(([x, y, lab, pos]) => G.point(x, y, { color: given ? INK : BL, r: 5.5, label: lab, tex: true, pos: pos || 'ne' }));
}
function mountFigs() {
  document.querySelectorAll('.u8l4 [data-fig]').forEach((el) => {
    const d = FIGS[el.dataset.fig]; if (!d || el.dataset.done) return; el.dataset.done = '1';
    const o = Object.assign({ width: 300, height: 300 }, W6, d.g || {});
    const G = new Graph(el, o);
    if (d.given) drawFig(G, d.given, true);
    if (d.ans) { const ov = h('div', 'u8l4-ska'); el.appendChild(ov); drawFig(new Graph(ov, o), d.ans, false); }
  });
  const NLS = { e1a: { min: -10, max: -2, a: -Infinity, b: -6, openB: false }, e1b: { min: -12, max: -4, a: -9.5, b: Infinity, openA: true } };
  document.querySelectorAll('.u8l4 [data-nl]').forEach((el) => {
    const d = NLS[el.dataset.nl]; if (!d || el.dataset.done) return; el.dataset.done = '1';
    const o = { width: 440, height: 74, min: d.min, max: d.max, step: 1, fontSize: 15, pad: 26, axisY: 30 };
    new NumberLine(el, o);
    const ov = h('div', 'u8l4-ska'); el.appendChild(ov);
    const N = new NumberLine(ov, o); N.interval(d.a, d.b, { color: BL, openA: d.openA, openB: d.openB, width: 6 });
  });
}
mountFigs();

/* =============================== explainer: one variable (procedure) =============================== */
const OV = {
  a: { label: 'Example 1(a)', q: '3-2(x+4)\\ge7',
    lines: [['3-2x-8\\ge7', 'expand'], ['-2x-5\\ge7', 'collect'], ['-2x\\ge12', '+5 both sides']],
    s0: '\\ge', s1: '\\le', post: '-6', div: '-2',
    tests: [{ x: -7, sub: '3-2(-7+4)=9', cmp: '9\\ge7', ok: true }, { x: 0, sub: '3-2(0+4)=-5', cmp: '-5\\ge7', ok: false }],
    nl: [-10, 1], end: -6, open: false, dir: -1, solT: 'x\\le-6', setT: '\\{x\\mid x\\le-6,\\ x\\in\\mathbb{R}\\}' },
  b: { label: '(b)', q: '\\dfrac{x-1}{3}\\lt\\dfrac{2x+5}{4}',
    lines: [['4(x-1)\\lt3(2x+5)', '×12 (positive)'], ['4x-4\\lt6x+15', 'expand'], ['-2x\\lt19', '−6x, +4']],
    s0: '\\lt', s1: '\\gt', post: '-\\tfrac{19}{2}', div: '-2',
    tests: [{ x: 0, sub: '\\tfrac{0-1}{3}=-\\tfrac{1}{3},\\ \\ \\tfrac{0+5}{4}=\\tfrac{5}{4}', cmp: '-\\tfrac{1}{3}\\lt\\tfrac{5}{4}', ok: true },
      { x: -10, sub: '\\tfrac{-11}{3}\\approx-3.67,\\ \\ \\tfrac{-15}{4}=-3.75', cmp: '-3.67\\lt-3.75', ok: false }],
    nl: [-12, 1], end: -9.5, open: true, dir: 1, solT: 'x\\gt-9.5', setT: '\\{x\\mid x\\gt-9.5,\\ x\\in\\mathbb{R}\\}' }
};
const onevar = {
  title: 'Solve, test, graph, set notation',
  height: 450, minW: 940,
  choices: Object.keys(OV).map((k) => ({ v: k, label: OV[k].label })),
  ask: (v) => `Example 1: solve ${T(OV[v].q)}.`,
  make(stage, v, ex) {
    const d = OV[v], W = ex.W, LW = 430;
    const L = div(stage, 'u8l4-panel', '', 0, 0, LW, 450);
    const h1 = stepH(L, 1, '<b>Solve</b> like an equation');
    const rows = d.lines.map(([t, n]) => hide(div(L, 'u8l4-wl', `<span class="u8l4-lt">${T(t)}</span><span class="u8l4-note">${n}</span>`)));
    const last = hide(div(L, 'u8l4-wl u8l4-wlx', `<span class="u8l4-lt">${T('x')}<span class="u8l4-flip">${T(d.s0)}</span>${T(d.post)}</span><span class="u8l4-note u8l4-noteR">÷ ${T(d.div)}: reverse!</span>`));
    const flip = last.querySelector('.u8l4-flip'), noteR = last.querySelector('.u8l4-noteR'); hide(noteR);
    const R = div(stage, 'u8l4-panel', '', LW + 14, 0, W - LW - 14, 450);
    const h2 = stepH(R, 2, '<b>Test values</b> in the original inequality');
    const trows = d.tests.map((t) => hide(div(R, 'u8l4-trow', `${T(`x=${t.x}:`)}&ensp;${T(t.sub)}<br>→&ensp;${T(t.cmp)} ${mark(t.ok)}<span class="u8l4-tw">${t.ok ? 'true' : 'false'}</span>`)));
    const h3 = stepH(R, 3, '<b>Graph</b> on the number line');
    const NL = new NumberLine(R, { width: W - LW - 14 - 28, height: 96, min: d.nl[0], max: d.nl[1], step: 1, fontSize: 16, pad: 24, axisY: 52 });
    NL.el.classList.add('u8l4-nl');
    const tdots = d.tests.map((t) => { const p = NL.point(t.x, { color: t.ok ? OK : NO, r: 7 }); hide(p); return p; });
    const tlabs = d.tests.map((t) => hide(NL.mark(t.x, `x=${t.x}`, { pos: 'n', tex: true, lift: 10 })));
    const ray = NL.interval(d.dir < 0 ? -Infinity : d.end, d.dir < 0 ? d.end : Infinity, { color: BL, width: 7, openA: d.open && d.dir > 0, openB: d.open && d.dir < 0 });
    hide(ray);
    const h4 = stepH(R, 4, '<b>Set notation</b>');
    const setp = hide(div(R, 'u8l4-setp', T(d.setT)));
    const flipIt = async (c) => {
      noteR.style.opacity = 1;
      await anim(c, flip, [{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }], 260);
      flip.innerHTML = T(d.s1); flip.classList.add('u8l4-flipped');
      await anim(c, flip, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1.25)', offset: 0.7 }, { transform: 'scaleX(1)' }], 380);
      await pop(c, noteR);
    };
    const endWord = d.open ? `an <b>open circle</b> at ${T(num(d.end).replace('−', '-'))} (${T(d.s1)}: not included)` : `a <b>closed dot</b> at ${T(String(d.end))} (${T(d.s1)}: included)`;
    return [
      { cap: `<b>Step 1.</b> Solve it like an equation: ${v === 'b' ? 'multiply by 12 to clear the fractions, then expand and collect' : 'expand, collect, isolate the x-term'}.`, run: async (c) => { await show(c, h1); for (const r of rows) { await show(c, r); await sleep(c, 250); } } },
      { cap: `Divide both sides by ${T(d.div)}. It is <b>negative</b>, so the sign <b>reverses</b>: ${T(d.s0)} becomes ${T(d.s1)}. &nbsp;${T(d.solT)}`, run: async (c) => { await show(c, last); await sleep(c, 300); await flipIt(c); } },
      { cap: `<b>Step 2.</b> Test a value <b>inside</b> the solution, ${T(`x=${d.tests[0].x}`)}, in the <b>original</b> inequality: ${T(d.tests[0].cmp)} is true ✓.`, run: async (c) => { await show(c, h2); await show(c, trows[0]); tdots[0].style.opacity = 1; tlabs[0].style.opacity = 1; await anim(c, tdots[0], [{ opacity: 0, transform: 'translateY(-40px)' }, { opacity: 1, transform: 'none' }], 420); } },
      { cap: `And one <b>outside</b> it, ${T(`x=${d.tests[1].x}`)}: ${T(d.tests[1].cmp)} is false ✓. So the solution is right.`, run: async (c) => { await show(c, trows[1]); tdots[1].style.opacity = 1; tlabs[1].style.opacity = 1; await anim(c, tdots[1], [{ opacity: 0, transform: 'translateY(-40px)' }, { opacity: 1, transform: 'none' }], 420); } },
      { cap: `<b>Step 3.</b> Graph ${T(d.solT)}: ${endWord}, and an arrow to the ${d.dir < 0 ? 'left' : 'right'}.`, run: async (c) => { await show(c, h3); tdots.concat(tlabs).forEach((e) => (e.style.opacity = 0.35)); ray.style.opacity = 1; await NL.drawIn(ray, 900, c); } },
      { cap: `<b>Step 4.</b> In set notation: ${T(d.setT)}.`, run: async (c) => { await show(c, h4); await pop(c, setp); } }
    ];
  }
};

/* =============================== explainer: the test-point dropper (STAR) =============================== */
function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const DR = {
  e2: { label: 'Example 2', q: { A: 2, B: -1, C: 4, op: '<' }, tx: '2x-y\\lt4', eqT: '2x-y=4',
    sub: (x, y) => { const v = 2 * x - y; return `2${P(x)}-${P(y)}=${v},\\ \\ ${v}\\lt4`; }, pts: [[0, 0], [3, 1], [1, -3], [2, 0], [-2, 3]], on: [2, 0] },
  e3a: { label: 'Example 3(a)', q: { A: -2, B: 1, C: -1, op: '<' }, tx: 'y\\lt2x-1', eqT: 'y=2x-1',
    sub: (x, y) => { const v = 2 * x - 1; return `${y}\\lt2${P(x)}-1=${v}`; }, pts: [[0, 0], [3, 1], [-2, 3], [4, -2], [1, 1]], on: [1, 1] },
  e4c: { label: 'Example 4(c)', q: { A: 5, B: 2, C: 10, op: '<=' }, tx: '5x+2y-10\\le0', eqT: '5x+2y-10=0',
    sub: (x, y) => { const v = 5 * x + 2 * y - 10; return `5${P(x)}+2${P(y)}-10=${v},\\ \\ ${v}\\le0`; }, pts: [[0, 0], [1, 4], [-3, 2], [4, -3], [2, 0]], on: [2, 0] }
};
const dropper = {
  title: 'Drop test points',
  height: 470, minW: 940,
  choices: Object.keys(DR).map((k) => ({ v: k, label: DR[k].label })),
  ask: (v) => `Which points are solutions of ${T(DR[v].tx)}?`,
  make(stage, v, ex) {
    const d = DR[v], q = d.q, W = ex.W, GS = 466;
    const G = new Graph(stage, { x: 2, y: 2, width: GS, height: GS, xmin: -7, xmax: 7, ymin: -7, ymax: 7, xlabels: 2, ylabels: 2, fontSize: 14, pad: [30, 18, 18, 18] });
    G.el.setAttribute('data-tap', ''); G.el.classList.add('u8l4-tapg');
    const reg = region(G, [q], { color: BL, op: 0.2, t: 0 }); hide(reg);
    const line = bline(G, q, { width: 4 }); hide(line);
    const dots = svgEl('g', { class: 'u8l4-dots' }, G.layers.data), big = svgEl('g', {}, G.layers.top);
    const R = div(stage, 'u8l4-panel u8l4-drR', '', GS + 16, 2, W - GS - 18, GS);
    div(R, 'u8l4-drq', T(d.tx));
    const tick = div(R, 'u8l4-tick', '');
    const cnt = div(R, 'u8l4-cnt', '');
    const hint = hide(div(R, 'u8l4-hint', '👆 Tap the grid to drop your own point'));
    const st = { ok: 0, no: 0 };
    const setCnt = () => { cnt.innerHTML = `<span class="u8l4-ok">✓ ${st.ok} solutions</span><span class="u8l4-no">✗ ${st.no} not</span>`; };
    setCnt();
    const addRow = (x, y) => {
      const ok = holds(q, x, y), r = h('div', 'u8l4-trow u8l4-trow-s', `${T(pt(x, y))}&ensp;${T(d.sub(x, y))} ${mark(ok)}${onLine(q, x, y) ? '<span class="u8l4-tw">on the line</span>' : ''}`);
      tick.appendChild(r); while (tick.children.length > 6) tick.removeChild(tick.firstChild);
      return r;
    };
    const bigDot = (x, y) => {
      const ok = holds(q, x, y), [px, py] = G.toPx(x, y), g = svgEl('g', { class: 'u8l4-bd' }, big);
      svgEl('circle', { cx: px, cy: py, r: 9, fill: ok ? OK : NO, stroke: '#fff', 'stroke-width': 2.5 }, g);
      const t = svgEl('text', { x: px, y: py + 5, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#fff' }, g); t.textContent = ok ? '✓' : '✗';
      if (ok) st.ok++; else st.no++;
      return g;
    };
    const smallDot = (x, y, r) => { const ok = holds(q, x, y), [px, py] = G.toPx(x, y); if (ok) st.ok++; else st.no++; return svgEl('circle', { cx: px, cy: py, r, fill: ok ? OK : NO, 'fill-opacity': 0.85 }, dots); };
    const drop = (c, g, ms = 380) => anim(c, g, [{ opacity: 0, transform: 'translateY(-46px)' }, { opacity: 1, transform: 'translateY(4px)', offset: 0.75 }, { opacity: 1, transform: 'none' }], ms);
    // the class taps to drop their own points (whole-number coordinates)
    G.svg.addEventListener('pointerdown', (e) => {
      if (e.button > 0) return; e.preventDefault();
      const [x0, y0] = G.fromEvent(e), x = Math.round(x0), y = Math.round(y0);
      if (!G.inside(x, y)) return;
      const g = bigDot(x, y); addRow(x, y); setCnt(); g.animate([{ opacity: 0, transform: 'translateY(-46px)' }, { opacity: 1, transform: 'none' }], { duration: 380, easing: 'cubic-bezier(.25,.75,.3,1)' });
    });
    const R1 = rng(81 + v.length), rain = [], dust = [];
    for (let i = 0; i < 40; i++) rain.push([Math.round((R1() * 13.6 - 6.8) * 10) / 10, Math.round((R1() * 13.6 - 6.8) * 10) / 10]);
    for (let i = 0; i < 1100; i++) dust.push([R1() * 14 - 7, R1() * 14 - 7]);
    const [ox, oy] = d.on, onOk = holds(q, ox, oy);
    return [
      { cap: `Substitute each point into ${T(d.tx)}. True: a <b class="u8l4-ok">solution ✓</b>. False: <b class="u8l4-no">not a solution ✗</b>.`, run: async (c) => {
        for (const [x, y] of d.pts) { const g = bigDot(x, y); addRow(x, y); setCnt(); await drop(c, g); await sleep(c, 380); } } },
      { cap: 'Keep dropping points. Watch where the green ones land.', run: async (c) => {
        for (const [x, y] of rain) { const g = smallDot(x, y, 6); setCnt(); if (!c.fast) { await drop(c, g, 240); } } } },
      { cap: 'Hundreds more… The solutions all land on <b>one side</b>: a <b>half-plane</b> appears.', run: async (c) => {
        let k = 0; await tween(c, 2600, (t) => { while (k < t * dust.length) { const [x, y] = dust[k++]; smallDot(x, y, 3.4); } setCnt(); }, linear); } },
      { cap: `The edge between green and red is the <b>boundary line</b> ${T(d.eqT)}. ${T(pt(ox, oy))} is on it, and ${onOk ? `it <b>is</b> a solution, so the line is <b>solid</b>` : `it is <b>not</b> a solution, so the line is <b>dashed</b>`}.`, run: async (c) => {
        line.style.opacity = 1; await G.drawIn(line, 900, c);
        const g = [...big.children].find((e) => { const ci = e.firstChild, [px, py] = G.toPx(ox, oy); return Math.abs(ci.getAttribute('cx') - px) < 1 && Math.abs(ci.getAttribute('cy') - py) < 1; });
        if (g) { big.appendChild(g); await pulse(c, g, 1.6, 600); await pulse(c, g, 1.6, 600); } } },
      { cap: 'Shade the side with the solutions: that half-plane is the <b>solution region</b>.', run: async (c) => {
        await anim(c, dots, [{ opacity: 1 }, { opacity: 0.18 }], 600); reg.style.opacity = 1; await flood(c, reg, 1000); } },
      { cap: 'Your turn: <b>tap anywhere on the grid</b> to drop a point and check it. Does it land on the side you expect?', run: async (c) => {
        await show(c, hint); await pulse(c, hint, 1.06, 500); } }
    ];
  }
};

/* =============================== explainer: graphing in four steps (procedure) =============================== */
const G4 = {
  e3a: { label: 'Example 3(a)', tx: 'y\\lt2x-1', q: { A: -2, B: 1, C: -1, op: '<' }, how: 'si', b: -1, rise: 2, run: 1, eqT: 'y=2x-1',
    s1: `Slope ${T('2')}, ${T('y')}-intercept ${T('-1')}: start at ${T('(0,\\ -1)')}, up 2, right 1.`,
    test: [0, 0], testT: '0\\lt2(0)-1', testV: '0\\lt-1', side: 'below', short: `${T('y\\lt2x-1')} is solved for ${T('y')} with ${T('\\lt')}: <b>below</b> the line ✓` },
  e3b: { label: '(b)', tx: 'y\\ge-\\tfrac{2}{3}x+3', q: { A: 2 / 3, B: 1, C: 3, op: '>=' }, how: 'si', b: 3, rise: -2, run: 3, eqT: 'y=-\\tfrac{2}{3}x+3',
    s1: `Slope ${T('-\\tfrac{2}{3}')}, ${T('y')}-intercept ${T('3')}: start at ${T('(0,\\ 3)')}, down 2, right 3.`,
    test: [0, 0], testT: '0\\ge-\\tfrac{2}{3}(0)+3', testV: '0\\ge3', side: 'above', short: `${T('y\\ge-\\tfrac{2}{3}x+3')} is solved for ${T('y')} with ${T('\\ge')}: <b>above</b> the line ✓` },
  e4a: { label: 'Example 4(a)', tx: '4x-3y\\ge12', q: { A: 4, B: -3, C: 12, op: '>=' }, how: 'int', ints: [[3, 0], [0, -4]], eqT: '4x-3y=12',
    s1: `Intercepts: ${T('y=0')} gives ${T('x=3')}; ${T('x=0')} gives ${T('y=-4')}.`,
    test: [0, 0], testT: '4(0)-3(0)\\ge12', testV: '0\\ge12', side: 'below', short: `Solve for ${T('y')}: ${T('-3y\\ge-4x+12\\Rightarrow y\\le\\tfrac{4}{3}x-4')} (÷ −3 reverses): <b>below</b> ✓` },
  e4b: { label: '(b)', tx: '2x+5y\\lt0', q: { A: 2, B: 5, C: 0, op: '<' }, how: 'si', b: 0, rise: -2, run: 5, eqT: 'y=-\\tfrac{2}{5}x',
    s1: `${T('5y=-2x')}, so ${T('y=-\\tfrac{2}{5}x')}: through the origin, down 2, right 5.`,
    test: [0, 1], onO: true, testT: '2(0)+5(1)\\lt0', testV: '5\\lt0', side: 'below', short: `${T('y\\lt-\\tfrac{2}{5}x')}: <b>below</b> ✓` },
  e4c: { label: '(c)', tx: '5x+2y-10\\le0', q: { A: 5, B: 2, C: 10, op: '<=' }, how: 'int', ints: [[2, 0], [0, 5]], eqT: '5x+2y-10=0',
    s1: `Intercepts: ${T('y=0')} gives ${T('x=2')}; ${T('x=0')} gives ${T('y=5')}.`,
    test: [0, 0], testT: '5(0)+2(0)-10\\le0', testV: '-10\\le0', side: 'below', short: `Solve for ${T('y')}: ${T('2y\\le-5x+10\\Rightarrow y\\le-\\tfrac{5}{2}x+5')}: <b>below</b> ✓` },
  e5a: { label: 'Example 5(a)', tx: 'x\\gt-2', q: { A: 1, B: 0, C: -2, op: '>' }, how: 'v', eqT: 'x=-2',
    s1: `${T('x=-2')} is a <b>vertical</b> line through ${T('(-2,\\ 0)')}.`,
    test: [0, 0], testT: '0\\gt-2', testV: '0\\gt-2', side: 'right', short: `${T('x\\gt-2')}: every point with ${T('x')} more than ${T('-2')}, to the <b>right</b> ✓` },
  e5b: { label: '(b)', tx: 'y+1\\le0', q: { A: 0, B: 1, C: -1, op: '<=' }, how: 'h', eqT: 'y=-1',
    s1: `${T('y+1=0')}, so ${T('y=-1')}: a <b>horizontal</b> line through ${T('(0,\\ -1)')}.`,
    test: [0, 0], testT: '0+1\\le0', testV: '1\\le0', side: 'below', short: `${T('y\\le-1')}: <b>below</b> the line ✓` }
};
const graph4 = {
  title: 'Graphing a linear inequality',
  height: 456, minW: 940,
  choices: Object.keys(G4).map((k) => ({ v: k, label: G4[k].label })),
  ask: (v) => `Graph ${T(G4[v].tx)}.`,
  make(stage, v, ex) {
    const d = G4[v], q = d.q, W = ex.W, GS = 452, dash = isDashed(q), [tx, ty] = d.test, ok = holds(q, tx, ty);
    const G = new Graph(stage, { x: 2, y: 2, width: GS, height: GS, xmin: -7, xmax: 7, ymin: -7, ymax: 7, xlabels: 2, ylabels: 2, fontSize: 14, pad: [30, 18, 18, 18] });
    const reg = region(G, [q], { color: BL, op: 0.22, t: 0 }); hide(reg);
    const pencil = bline(G, q, { color: GR, width: 2.5, dash: false }); hide(pencil);
    const line = bline(G, q, { width: 4.5 }); hide(line);
    // step 1 helpers: intercepts, or the y-intercept and the slope staircase
    const s1els = [];
    if (d.how === 'int') d.ints.forEach(([x, y]) => s1els.push(hide(G.point(x, y, { color: BL, r: 7, coords: true, pos: x ? 'ne' : 'w' }))));
    if (d.how === 'si') {
      const p0 = hide(G.point(0, d.b, { color: BL, r: 7 })), x1 = d.run, y1 = d.b + d.rise;
      const up = hide(G.segment([0, d.b], [0, y1], { color: GO, width: 3.5 })), rt = hide(G.segment([0, y1], [x1, y1], { color: GO, width: 3.5 }));
      const p1 = hide(G.point(x1, y1, { color: BL, r: 7 }));
      s1els.push(p0, up, rt, p1);
    }
    if (d.how === 'v') s1els.push(hide(G.point(-2, 0, { color: BL, r: 7 })));
    if (d.how === 'h') s1els.push(hide(G.point(0, -1, { color: BL, r: 7 })));
    const tp = hide(G.point(tx, ty, { color: GO, r: 8.5 })), tpl = hide(G.label(tx, ty, T(pt(tx, ty)), { pos: ty > 0 ? 'nw' : 'sw', color: '#8a6a00', cls: 'bk-ptlab' }));
    // the steps panel
    const R = div(stage, 'u8l4-panel u8l4-g4R', '', GS + 16, 2, W - GS - 18, GS);
    const s = [], s1n = (s.push(stepH(R, 1, `<b>Boundary:</b> ${T(d.eqT)}`)), hide(div(R, 'u8l4-sub', d.s1)));
    s.push(stepH(R, 2, `${T(OPT[q.op])} &nbsp;→&nbsp; <b>${dash ? 'dashed' : 'solid'}</b> line`));
    s.push(stepH(R, 3, `<b>Test</b> ${T(pt(tx, ty))}: &nbsp;${T(d.testT)}`));
    const onO = d.onO ? hide(div(R, 'u8l4-sub', `${T('(0,\\ 0)')} is <b>on</b> the line, so use ${T('(0,\\ 1)')}.`)) : null;
    const tv = hide(div(R, 'u8l4-sub u8l4-tv', `${T(d.testV)} &nbsp;is <b class="${ok ? 'u8l4-ok' : 'u8l4-no'}">${ok ? 'true ✓' : 'false ✗'}</b>`));
    s.push(stepH(R, 4, `<b>Shade</b> ${ok ? 'the side with' : 'the side without'} the test point`));
    const sc = hide(div(R, 'u8l4-short', `<b>Shortcut check.</b> ${d.short}`));
    const shadeCap = ok ? `True, so shade the side <b>with</b> ${T(pt(tx, ty))}: ${d.side}.` : `False, so shade the <b>other</b> side, away from ${T(pt(tx, ty))}: ${d.side}.`;
    return [
      { cap: `<b>Step 1.</b> Replace the sign with ${T('=')}: graph the boundary line ${T(d.eqT)} lightly in pencil.`, run: async (c) => {
        await show(c, s[0]); await show(c, s1n);
        for (const e of s1els) { e.style.opacity = 1; await G.reveal(e, c, 450); }
        pencil.style.opacity = 1; await G.drawIn(pencil, 800, c); } },
      { cap: `<b>Step 2.</b> The sign is ${T(OPT[q.op])}, so the line is <b>${dash ? 'dashed' : 'solid'}</b>${dash ? ': points on it are not solutions' : ': points on it are solutions'}.`, run: async (c) => {
        await show(c, s[1]); line.style.opacity = 1; await G.drawIn(line, 900, c); pencil.style.opacity = 0; s1els.forEach((e) => { if (e.classList.contains('bk-seg')) e.style.opacity = 0; }); } },
      { cap: d.onO ? `<b>Step 3.</b> ${T('(0,\\ 0)')} is on the line, so test ${T('(0,\\ 1)')}: substitute it into the inequality.` : `<b>Step 3.</b> Choose a test point not on the line: ${T('(0,\\ 0)')}. Substitute it into the inequality.`, run: async (c) => {
        await show(c, s[2]); if (onO) await show(c, onO); tp.style.opacity = 1; tpl.style.opacity = 1; await pop(c, tp); await show(c, tpl); await show(c, tv); } },
      { cap: `<b>Step 4.</b> ${shadeCap}`, run: async (c) => { await show(c, s[3]); await flood(c, reg, 1200); } },
      { cap: `<b>Shortcut check:</b> ${d.short}`, run: async (c) => { await show(c, sc); await pulse(c, sc, 1.04, 420); } }
    ];
  }
};

/* =============================== explainer: writing the inequality from a graph =============================== */
const FG = {
  a: { label: 'Example 6(a)', q: { A: -2 / 3, B: 1, C: -1, op: '>' }, pts: [[0, -1, 'nw'], [3, 1, 'nw']], how: 'slope', eqT: 'y=\\tfrac{2}{3}x-1',
    s1: `Through ${T('(0,\\ -1)')} and ${T('(3,\\ 1)')}: rise 2, run 3, so ${T('m=\\tfrac{2}{3}')}, and ${T('b=-1')}.`,
    test: [0, 2], lhs: '2', rhs: '\\tfrac{2}{3}(0)-1=-1', L: 2, Rv: -1, fin: 'y\\gt\\tfrac{2}{3}x-1', var: 'y', rest: '\\tfrac{2}{3}x-1' },
  b: { label: '(b)', q: { A: 3, B: 4, C: 12, op: '<=' }, pts: [[4, 0, 'ne'], [0, 3, 'ne']], how: 'int', eqT: '3x+4y=12',
    s1: `Intercepts ${T('(4,\\ 0)')} and ${T('(0,\\ 3)')}: ${T('\\tfrac{x}{4}+\\tfrac{y}{3}=1')}, times 12: ${T('3x+4y=12')}.`,
    test: [0, 0], lhs: '3(0)+4(0)=0', rhs: '12', L: 0, Rv: 12, fin: '3x+4y\\le12', alt: 'y\\le-\\tfrac{3}{4}x+3', var: '3x+4y', rest: '12' },
  c: { label: '(c)', q: { A: 1, B: 0, C: 3, op: '<' }, pts: [], how: 'v', eqT: 'x=3',
    s1: `A vertical line through ${T('(3,\\ 0)')}: ${T('x=3')}.`,
    test: [0, 0], lhs: '0', rhs: '3', L: 0, Rv: 3, fin: 'x\\lt3', var: 'x', rest: '3' }
};
const fromgraph = {
  title: 'Read the graph, find the sign',
  height: 456, minW: 940,
  choices: Object.keys(FG).map((k) => ({ v: k, label: FG[k].label })),
  ask: (v) => `Example 6${v === 'a' ? '(a)' : FG[v].label}: write the inequality whose solution region is shown.`,
  make(stage, v, ex) {
    const d = FG[v], q = d.q, W = ex.W, GS = 452, dash = isDashed(q), [tx, ty] = d.test;
    const G = new Graph(stage, { x: 2, y: 2, width: GS, height: GS, xmin: -7, xmax: 7, ymin: -7, ymax: 7, xlabels: 2, ylabels: 2, fontSize: 14, pad: [30, 18, 18, 18] });
    region(G, [q], { color: GR, op: 0.3 }); bline(G, q, { color: INK, width: 4 });
    d.pts.forEach(([x, y, pos]) => G.point(x, y, { color: INK, r: 6.5, coords: true, pos }));
    const tri = [];
    if (d.how === 'slope') { const [[x0, y0], [x1, y1]] = d.pts; tri.push(hide(G.segment([x0, y0], [x1, y0], { color: GO, width: 3.5 })), hide(G.segment([x1, y0], [x1, y1], { color: GO, width: 3.5 })));
      tri.push(hide(G.label((x0 + x1) / 2, y0, 'run 3', { pos: 's', color: '#8a6a00', cls: 'bk-ptlab' })), hide(G.label(x1, (y0 + y1) / 2, 'rise 2', { pos: 'e', color: '#8a6a00', cls: 'bk-ptlab', dx: 4 }))); }
    const tp = hide(G.point(tx, ty, { color: GO, r: 8.5 })), tpl = hide(G.label(tx, ty, T(pt(tx, ty)), { pos: 'ne', color: '#8a6a00', cls: 'bk-ptlab' }));
    const R = div(stage, 'u8l4-panel u8l4-fgR', '', GS + 16, 2, W - GS - 18, GS);
    const s = [stepH(R, 1, `<b>Boundary line:</b> ${T(d.eqT)}`), stepH(R, 2, `<b>${dash ? 'Dashed' : 'Solid'}</b> line`), stepH(R, 3, `<b>Test</b> a shaded point, ${T(pt(tx, ty))}`)];
    const s1n = hide(div(R, 'u8l4-sub', d.s1));
    R.insertBefore(s1n, s[1]);
    const cards = h('div', 'u8l4-signs'); R.insertBefore(cards, s[2]);
    const ops = ['<', '<=', '>', '>='], ce = {};
    ops.forEach((o) => { ce[o] = h('div', 'u8l4-sign', T(OPT[o])); cards.appendChild(ce[o]); });
    hide(cards);
    const out1 = ops.filter((o) => isDashed({ op: o }) !== dash), keep2 = ops.filter((o) => isDashed({ op: o }) === dash);
    const right = keep2.find((o) => OPF[o](d.L, d.Rv)), wrong = keep2.find((o) => o !== right);
    const cmp = hide(div(R, 'u8l4-sub u8l4-tv', `${T(`${d.lhs}\\ \\ \\square\\ \\ ${d.rhs}`)}<br>${T(`${d.L}\\ ${OPT[right]}\\ ${d.Rv}`)} is true, ${T(`${d.L}\\ ${OPT[wrong]}\\ ${d.Rv}`)} is false`));
    const fin = hide(div(R, 'u8l4-fin', T(d.fin) + (d.alt ? ` <span class="u8l4-alt">(or ${T(d.alt)})</span>` : '')));
    const strike = async (c, o) => { ce[o].classList.add('out'); await shake(c, ce[o]); };
    return [
      { cap: `<b>Step 1.</b> Write the equation of the boundary line. ${d.s1}`, run: async (c) => {
        await show(c, s[0]); for (const e of tri) { e.style.opacity = 1; await G.reveal(e, c, 450); } await show(c, s1n); } },
      { cap: `<b>Step 2.</b> The line is <b>${dash ? 'dashed' : 'solid'}</b>, so the sign is ${dash ? `${T('\\lt')} or ${T('\\gt')}` : `${T('\\le')} or ${T('\\ge')}`}. Knock out the other two.`, run: async (c) => {
        await show(c, s[1]); await show(c, cards); for (const o of out1) await strike(c, o); } },
      { cap: `<b>Step 3.</b> Substitute a point from the <b>shaded</b> region, ${T(pt(tx, ty))}. Which sign makes it true? ${T(OPT[right])}.`, run: async (c) => {
        await show(c, s[2]); tp.style.opacity = 1; tpl.style.opacity = 1; await pop(c, tp); await show(c, tpl); await show(c, cmp); await strike(c, wrong); ce[right].classList.add('win'); await pulse(c, ce[right], 1.15, 500); } },
      { cap: `The inequality: ${T(d.fin)}${d.alt ? ` (or ${T(d.alt)})` : ''}.`, run: async (c) => { await pop(c, fin); } }
    ];
  }
};

/* =============================== explainer: the school play box office (STAR) =============================== */
const tickets = {
  title: 'The school play box office',
  height: 470, minW: 940,
  choices: [{ v: 'e7', label: 'Example 7' }],
  ask: 'Adult tickets $15, student tickets $10, and the play needs at least $1500.',
  make(stage, v, ex) {
    const W = ex.W, GS = 470, q = { A: 15, B: 10, C: 1500, op: '>=' };
    const G = new Graph(stage, { x: 2, y: 2, width: GS, height: 466, xmin: 0, xmax: 135, ymin: 0, ymax: 175, xstep: 10, ystep: 10, xlabels: 20, ylabels: 20, xtitle: 'a', ytitle: 's', fontSize: 14, pad: [30, 22, 34, 46] });
    const reg = region(G, [q, { A: 1, B: 0, C: 0, op: '>=' }, { A: 0, B: 1, C: 0, op: '>=' }], { color: BL, op: 0.2, t: 0 }); hide(reg);
    const line = bline(G, q, { width: 4.5 }); hide(line);
    const ip = [hide(G.point(100, 0, { color: BL, r: 7, coords: true, pos: 'n' })), hide(G.point(0, 150, { color: BL, r: 7, coords: true, pos: 'e' }))];
    const P0 = G.point(0, 0, { color: GO, r: 10 }); hide(P0);
    const pl = hide(G.label(0, 0, '', { pos: 'ne', cls: 'bk-ptlab u8l4-plab', tex: false }));
    const R = div(stage, 'u8l4-panel u8l4-box', '', GS + 16, 2, W - GS - 18, 466);
    div(R, 'u8l4-boxh', '🎭 Box office');
    const ineq = hide(div(R, 'u8l4-boxi', `${T('15a+10s\\ge1500')}<br><span>${T('a\\ge0,\\ s\\ge0')}, whole numbers</span>`));
    const rowA = div(R, 'u8l4-brow', '<span>🎟 Adult</span><b class="u8l4-ba">0</b><span>× $15</span>');
    const rowS = div(R, 'u8l4-brow', '<span>🎟 Student</span><b class="u8l4-bs">0</b><span>× $10</span>');
    const tot = div(R, 'u8l4-btot', 'Total <b>$0</b>');
    const bar = div(R, 'u8l4-bar', '<i></i><span>goal $1500</span>');
    const verdict = div(R, 'u8l4-bv', '');
    const fill = bar.querySelector('i'), bA = rowA.querySelector('b'), bS = rowS.querySelector('b'), bT = tot.querySelector('b');
    const st = { a: 0, s: 0 };
    const set = (a, s, lab = true) => {
      st.a = a; st.s = s; G.moveTo(P0, a, s);
      const m = 15 * Math.round(a) + 10 * Math.round(s), okv = m >= 1500;
      bA.textContent = Math.round(a); bS.textContent = Math.round(s); bT.textContent = '$' + m;
      fill.style.width = Math.min(100, m / 1500 * 100) + '%'; fill.style.background = okv ? OK : '#e0a11b';
      tot.classList.toggle('ok', okv);
      pl.gx = a; pl.gy = s; pl.innerHTML = `(${Math.round(a)}, ${Math.round(s)})`; pl._bkDraw(); pl.style.opacity = lab ? 1 : 0;
    };
    const go = (c, a1, s1, ms) => { const a0 = st.a, s0 = st.s; return tween(c, ms, (t) => set(a0 + (a1 - a0) * t, s0 + (s1 - s0) * t)); };
    const say = (html, ok) => { verdict.innerHTML = html; verdict.className = 'u8l4-bv ' + (ok == null ? '' : ok ? 'ok' : 'no'); };
    set(0, 0);
    const lat = svgEl('g', { class: 'u8l4-lat' }, G.layers.top);
    return [
      { cap: `Let ${T('a')} = adult tickets and ${T('s')} = student tickets. The money is ${T('15a+10s')}, and it must be <b>at least</b> $1500. Tickets can’t be negative, and they come in whole numbers.`, run: async (c) => {
        P0.style.opacity = 1; await pop(c, P0); await pop(c, ineq); } },
      { cap: `Boundary ${T('15a+10s=1500')}. Only adults: ${T('15a=1500')}, ${T('a=100')}. Only students: ${T('s=150')}. ${T('\\ge')}: <b>solid</b> (exactly $1500 is enough).`, run: async (c) => {
        await go(c, 100, 0, 1300); set(100, 0, false); ip[0].style.opacity = 1; await G.reveal(ip[0], c); say('Exactly $1500 ✓', true); await go(c, 0, 150, 1500); set(0, 150, false); ip[1].style.opacity = 1; await G.reveal(ip[1], c);
        line.style.opacity = 1; await G.drawIn(line, 800, c); say(''); } },
      { cap: `Test ${T('(0,\\ 0)')}: ${T('0\\ge1500')} is false, so shade <b>away</b> from the origin, and only in the <b>first quadrant</b>.`, run: async (c) => {
        await go(c, 0, 0, 1000); say('$0 ≥ $1500? false ✗', false); await flood(c, reg, 1100); } },
      { cap: `(c) 60 adults and 50 students: ${T('15(60)+10(50)=1400\\lt1500')}. <b>Not enough</b>: the point is below the line.`, run: async (c) => {
        await go(c, 60, 50, 1100); say('$1400: short by $100 ✗', false); await shake(c, verdict); } },
      { cap: `(d) Sell 40 adult tickets, then add student tickets until the goal is met: ${T('600+10s\\ge1500')}, ${T('s\\ge90')}. At least <b>90</b> student tickets.`, run: async (c) => {
        await go(c, 40, 0, 700); say(''); await go(c, 40, 90, 2200); say('$1500 reached at 90 ✓', true); await pulse(c, tot, 1.08, 450); } },
      { cap: 'Whole numbers only: zoom in. The real answers are the <b>grid points</b> (whole numbers of tickets) in the region, including those on the solid line.', run: async (c) => {
        G.o.xlabels = 4; G.o.ylabels = 4; P0.style.opacity = 0; pl.style.opacity = 0; say('');
        await G.setWindow({ xmin: 30.5, xmax: 49.5, ymin: 78.5, ymax: 101.5, xscl: 1, yscl: 1 }, c, 1400);
        for (let a = 31; a <= 49; a++) for (let s = 79; s <= 101; s++) { const ok = 15 * a + 10 * s >= 1500, [px, py] = G.toPx(a, s); svgEl('circle', { cx: px, cy: py, r: ok ? 5 : 3.2, fill: ok ? OK : '#b9bec8' }, lat); }
        await fadeIn(c, lat, 700);
        set(40, 90); P0.style.opacity = 1; pl.style.opacity = 1; await pop(c, P0); say('(40, 90) is on the line: exactly $1500 ✓', true); } }
    ];
  }
};

/* =============================== explainer: two conditions at once (STAR) =============================== */
const overlap = {
  title: 'Two conditions at once',
  height: 470, minW: 940,
  choices: [{ v: 'e8', label: 'Example 8' }],
  ask: 'Jordan: $20/h tutoring (x h), $15/h lifeguarding (y h), at most 20 h, at least $330.',
  make(stage, v, ex) {
    const W = ex.W, GS = 466;
    const qH = { A: 1, B: 1, C: 20, op: '<=' }, qM = { A: 20, B: 15, C: 330, op: '>=' }, X0 = { A: 1, B: 0, C: 0, op: '>=' }, Y0 = { A: 0, B: 1, C: 0, op: '>=' };
    const G = new Graph(stage, { x: 2, y: 2, width: GS, height: GS, xmin: 0, xmax: 23, ymin: 0, ymax: 23, xstep: 1, ystep: 1, xlabels: 4, ylabels: 4, fontSize: 14, pad: [30, 22, 34, 42] });
    const rH = region(G, [qH, X0, Y0], { color: BL, op: 0.2, t: 0 }), rM = region(G, [qM, X0, Y0], { color: OR, op: 0.2, t: 0 });
    hide(rH); hide(rM);
    const rB = region(G, [qH, qM, X0, Y0], { color: PU, op: 0.42, top: true }); hide(rB);
    const lH = bline(G, qH, { color: BL, width: 4.5 }), lM = bline(G, qM, { color: OR, width: 4.5 }); hide(lH); hide(lM);
    const iH = [hide(G.point(20, 0, { color: BL, r: 6.5, coords: true, pos: 'ne' })), hide(G.point(0, 20, { color: BL, r: 6.5, coords: true, pos: 'e' }))];
    const iM = [hide(G.point(16.5, 0, { color: OR, r: 6.5, label: '(16.5,\\ 0)', tex: true, pos: 'nw' })), hide(G.point(0, 22, { color: OR, r: 6.5, coords: true, pos: 'e' }))];
    const corner = hide(G.point(6, 14, { color: PU, r: 8.5 })), cl = hide(G.label(6, 14, '?', { pos: 'ne', color: PU, cls: 'bk-ptlab u8l4-big' }));
    const tst = hide(G.point(10, 8, { color: NO, r: 8.5, coords: true, pos: 'sw' }));
    const sweep = G.vline(0, { color: PU, width: 3.5, dash: true }); hide(sweep);
    const R = div(stage, 'u8l4-panel u8l4-ovR', '', GS + 16, 2, W - GS - 18, GS);
    const cH = hide(div(R, 'u8l4-cond u8l4-cH', `<span class="u8l4-ch">⏱ Hours</span>${T('x+y\\le20')}<b class="u8l4-cm"></b>`));
    const cM = hide(div(R, 'u8l4-cond u8l4-cM', `<span class="u8l4-ch">💵 Money</span>${T('20x+15y\\ge330')}<b class="u8l4-cm"></b>`));
    const cR = hide(div(R, 'u8l4-sub', `and ${T('x\\ge0,\\ y\\ge0')}`));
    const mH = cH.querySelector('.u8l4-cm'), mM = cM.querySelector('.u8l4-cm');
    const out = hide(div(R, 'u8l4-sub u8l4-tv', ''));
    const sol = hide(div(R, 'u8l4-solve', `${T('y=20-x')}<br>${T('20x+15(20-x)=330')}<br>${T('5x+300=330,\\ \\ x=6')}<br>${T('y=20-6=14')}`));
    return [
      { cap: `Two conditions: <b>hours</b> ${T('x+y\\le20')} (at most 20) and <b>money</b> ${T('20x+15y\\ge330')} (at least $330), with ${T('x\\ge0,\\ y\\ge0')}.`, run: async (c) => {
        await show(c, cH); await show(c, cM); await show(c, cR); } },
      { cap: `Hours: ${T('x+y=20')}, intercepts ${T('(20,\\ 0)')} and ${T('(0,\\ 20)')}, solid. Test ${T('(0,\\ 0)')}: ${T('0\\le20')} true, so shade <b>toward</b> the origin.`, run: async (c) => {
        for (const p of iH) { p.style.opacity = 1; await G.reveal(p, c); } lH.style.opacity = 1; await G.drawIn(lH, 800, c); await flood(c, rH, 1000); } },
      { cap: `Money: ${T('20x+15y=330')}, intercepts ${T('(16.5,\\ 0)')} and ${T('(0,\\ 22)')}, solid. Test ${T('(0,\\ 0)')}: ${T('0\\ge330')} false, so shade <b>away</b> from the origin.`, run: async (c) => {
        for (const p of iM) { p.style.opacity = 1; await G.reveal(p, c); } lM.style.opacity = 1; await G.drawIn(lM, 800, c); await flood(c, rM, 1000); } },
      { cap: 'Both conditions hold only where the shadings <b>overlap</b>: a triangle with corners at the two intercepts on the x-axis and one where the lines cross.', run: async (c) => {
        await Promise.all([anim(c, rH, [{ opacity: 1 }, { opacity: 0.35 }], 600), anim(c, rM, [{ opacity: 1 }, { opacity: 0.35 }], 600)]);
        rB.style.opacity = 1; await fadeIn(c, rB, 600); corner.style.opacity = 1; cl.style.opacity = 1; await pop(c, corner); await show(c, cl); } },
      { cap: `(c) 10 h tutoring and 8 h lifeguarding: hours ${T('18\\le20')} ✓, but money ${T('200+120=320\\lt330')} ✗. It is in the blue region only: <b>No</b>.`, run: async (c) => {
        tst.style.opacity = 1; tst.label.style.opacity = 1; await anim(c, tst, [{ opacity: 0, transform: 'translateY(-50px)' }, { opacity: 1, transform: 'none' }], 450);
        mH.innerHTML = '18 ✓'; mH.className = 'u8l4-cm u8l4-ok'; await pop(c, mH); mM.innerHTML = '$320 ✗'; mM.className = 'u8l4-cm u8l4-no'; await pop(c, mM);
        out.innerHTML = `${T('(10,\\ 8)')}: one condition fails <b class="u8l4-no">✗</b>`; await show(c, out); } },
      { cap: '(d) The least tutoring hours: slide a vertical line from the left until it first touches the region. It touches at the <b>corner</b> where the boundary lines cross.', run: async (c) => {
        [tst, tst.label, out].forEach((e) => (e.style.opacity = 0)); mH.innerHTML = mM.innerHTML = '';
        sweep.style.opacity = 1; await tween(c, 1800, (t) => sweep.set(6 * t)); await pulse(c, corner, 1.5, 500); } },
      { cap: `Solve the boundary lines as a system: ${T('20x+15(20-x)=330')}, ${T('x=6')}, ${T('y=14')}. At least <b>6 hours</b> tutoring (with 14 hours lifeguarding).`, run: async (c) => {
        await show(c, sol); cl.innerHTML = T('(6,\\ 14)'); await pop(c, cl); } }
    ];
  }
};

/* =============================== Stand Up Break =============================== */
const sg = (n) => (n < 0 ? `-${-n}` : `+${n}`);
const term = (k, v, first) => (k === 0 ? '' : (k === 1 ? (first ? '' : '+') : k === -1 ? '-' : first ? String(k) : sg(k)) + v);
standup('u8l4', {
  intro: 'At your whiteboard: draw axes, graph the boundary line (solid or dashed?), test a point, and shade.',
  levels: {
    BEG: (r) => { // is the point a solution?
      const A = r.pick([1, 2, 3, -2]), B = r.pick([1, -1, 2, 3]), op = r.pick(['<', '<=', '>', '>=']), x = r.int(-4, 4), y = r.int(-4, 4);
      const L = A * x + B * y, C = L + r.pick([-2, -1, 0, 1, 2]), ok = OPF[op](L, C);
      const lhs = `${term(A, 'x', true)}${term(B, 'y', false)}`;
      return { text: `Is ${T(pt(x, y))} a solution of this inequality?`, q: `${lhs}${OPT[op]}${C}`,
        a: [`${A}${P(x)}${B < 0 ? '-' : '+'}${Math.abs(B)}${P(y)}=${L}`, `${L}${OPT[op]}${C}\\ \\text{is ${ok ? 'true' : 'false'}}`], atext: ok ? `<b>Yes</b>, it is a solution${L === C ? ' (it is on the solid line)' : ''}.` : `<b>No</b>, it is not a solution${L === C ? ' (it is on the dashed line)' : ''}.` };
    },
    PRG: (r) => { // graph y (op) mx + b
      const m = r.pick([1, 2, 3, -1, -2, -3]), b = r.int(-4, 4) || 2, op = r.pick(['<', '<=', '>', '>=']);
      const rhs = `${term(m, 'x', true)}${b ? sg(b) : ''}`, ok0 = OPF[op](0, b), above = op[0] === '>';
      return { text: 'Graph the inequality.', q: `y${OPT[op]}${rhs}`,
        atext: `Boundary ${T(`y=${rhs}`)}: slope ${T(String(m))}, ${T('y')}-intercept ${T(String(b))}; <b>${op.length === 1 ? 'dashed' : 'solid'}</b>.<br>Test ${T('(0,\\ 0)')}: ${T(`0${OPT[op]}${b}`)} is ${ok0 ? 'true' : 'false'}, so shade <b>${above ? 'above' : 'below'}</b> the line.`, a: [] };
    },
    MAS: (r) => { // standard form, with a negative y-coefficient (the sign reverses)
      const A = r.pick([2, 3, 4, 6]), B = -r.pick([2, 3]), C = r.pick([6, 12, -6, -12]), op = r.pick(['<', '<=', '>', '>=']);
      const rev = { '<': '>', '<=': '>=', '>': '<', '>=': '<=' }[op];
      const m = A / -B, bb = C / B, fr = (v) => (Number.isInteger(v) ? String(v) : `${v < 0 ? '-' : ''}\\tfrac{${Math.abs(A)}}{${Math.abs(B)}}`);
      const bT = Number.isInteger(bb) ? (bb ? sg(bb) : '') : (bb < 0 ? '-' : '+') + `\\tfrac{${Math.abs(C)}}{${Math.abs(B)}}`;
      const ok0 = OPF[op](0, C);
      return { text: 'Graph the inequality. Solve for y first.', q: `${A}x${B < 0 ? '-' : '+'}${Math.abs(B)}y${OPT[op]}${C}`,
        a: [`${B}y${OPT[op]}${-A}x${sg(C)}`, `y${OPT[rev]}${m === 1 ? '' : fr(m)}x${bT}\\quad(\\div${P(B)}\\text{: reverse})`],
        atext: `<b>${op.length === 1 ? 'Dashed' : 'Solid'}</b> line; shade <b>${rev[0] === '>' ? 'above' : 'below'}</b>. Check with ${T('(0,\\ 0)')}: ${T(`0${OPT[op]}${C}`)} is ${ok0 ? 'true' : 'false'}.` };
    }
  }
});

/* =============================== mount =============================== */
export const explainers = mountExplainers({ onevar, dropper, graph4, fromgraph, tickets, overlap });
export const _test = { OV, DR, G4, FG, holds, clip };
