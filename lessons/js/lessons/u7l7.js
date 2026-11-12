/* Math 20-1 · Unit 7 · Lesson 7 — Reciprocal Functions of Quadratic Functions.
 * New lesson format (2026-11-11): the warm-up ("The Three Cards") is plain markup on the page (no code).
 * Card figures: every grid on the page is drawn here from the real functions ([data-fig]); the answer layer (class
 * u7l7-ans) shows when its part's Answer is revealed.
 * Explainers:
 *   trace  (Example 1: the f(x) row, then every point (x, y) flies to (x, 1/y) while the 1/f(x) row fills; a tracer
 *           sweeps across with a dot on f and its partner on 1/f (the partner shoots off at the zeros); the asymptotes,
 *           the vertex → local maximum, and the four invariant points where the two dots meet on y = ±1),
 *   slide  (STAR, hands-on: slide the parabola up and down (q) while the reciprocal redraws live; the vertical
 *           asymptotes appear, merge and vanish, and the count 2 / 1 / 0 is stamped with the discriminant;
 *           Example 2(a)–(f) checks; "Your turn": sliders for q and p and an up/down switch),
 *   range  (procedure, numbered: the vertex flies to (p, 1/q) and the turning type switches; the domain with holes at
 *           the zeros; the range of f as a bar on the y-axis, split at 0, and each part turned inside out into its
 *           reciprocal; the booklet's y ≥ −2 demo and Example 3(a)–(e)),
 *   sketch (procedure, numbered, the booklet's four steps: f and y = ±1, the asymptotes, the key points, the branches
 *           one at a time; Example 4(a)–(c) and Example 5 (with the increasing intervals)),
 *   back   (Example 6(a)–(b) backwards: asymptotes drop to zeros, the turning point flies to the vertex, find a, the
 *           parabola draws through the points),
 *   match  (Example 8: spot the mismatch: the zero count narrows the four graphs to the candidates, the sign of the
 *           middle branch decides; a connector line and the letter for each function).
 * Colours (Unit 7): y = f(x) blue; y = 1/f(x) red; asymptotes purple; invariant points amber; turning points green;
 * given graphs on the cards ink. */
import {
  h, tex, add, box, Graph, ValueTable, stamp, stampIn, mountExplainers, pop, fadeIn, sleep, tween, svgEl,
  pulse, COLORS, texNum, drawIn
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const FC = COLORS.blue, AC = COLORS.red, IX = COLORS.purple, VC = COLORS.amber, TP = COLORS.green, INK = COLORS.slate;
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; if (el && el.label) el.label.style.opacity = 0; return el; };
const unhide = (el) => { if (el) el.style.opacity = ''; if (el && el.label) el.label.style.opacity = ''; return el; };
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
const popP = (c, p) => Promise.all([pop(c, unhide(p)), p.label ? show(c, unhide(p.label)) : null]);
const tn = (v) => texNum(v, 3);
/* a numbered row for step-by-step procedures (the step number beside each step as it appears) */
const row = (host, n, html) => { const r = h('div', 'u7l7-row', `<span class="u7l7-n">${n}</span><div class="u7l7-rc">${html}</div>`); r.style.opacity = 0; host.appendChild(r); return r; };
const glowRing = (layer) => { const g = svgEl('circle', { r: 17, class: 'u7l7-glow' }, layer); g.style.display = 'none'; return g; };
const placeRing = (ring, G, x, y, on = true) => { const [px, py] = G.toPx(x, y); ring.setAttribute('cx', px); ring.setAttribute('cy', py); ring.style.display = on ? '' : 'none'; };
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
/* exact fraction n/d as TeX */
const fr = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = gcd(Math.abs(n), d) || 1; n /= g; d /= g; return d === 1 ? String(n) : (n < 0 ? '-' : '') + `\\frac{${Math.abs(n)}}{${d}}`; };
/* 1/v as TeX for a "nice" v (integer, half, quarter …) */
const recT = (v) => { for (const d of [1, 2, 4, 5, 8, 10]) { const n = v * d; if (Math.abs(n - Math.round(n)) < 1e-9) return fr(d, Math.round(n)); } return tn(1 / v); };
const valT = (v) => { for (const d of [1, 2, 3, 4, 5, 8, 9]) { const n = v * d; if (Math.abs(n - Math.round(n)) < 1e-9) return fr(Math.round(n), d); } return tn(v); };

/* a quadratic f(x) = Ax² + Bx + C with its vertex (p, q) and real zeros (sorted) */
function quad(A, B, C) {
  const p = -B / (2 * A), q = C - B * B / (4 * A), D = B * B - 4 * A * C;
  const z = Math.abs(D) < 1e-12 ? [p] : D > 0 ? [(-B - Math.sqrt(D)) / (2 * A), (-B + Math.sqrt(D)) / (2 * A)].sort((a, b) => a - b) : [];
  return { A, B, C, p, q, D, z, f: (x) => A * x * x + B * x + C, r: (x) => 1 / (A * x * x + B * x + C) };
}
const vq = (a, p, q) => quad(a, -2 * a * p, a * p * p + q);
/* the x-values where f = k (sorted) */
const solveK = (Q, k) => quad(Q.A, Q.B, Q.C - k).z;

/* drawing helpers on a Graph */
const fGraph = (G, Q, o = {}) => G.fn(Q.f, Object.assign({ color: FC, width: 3.5 }, o));
const rGraph = (G, Q, o = {}) => G.fn(Q.r, Object.assign({ color: AC, width: 4.5, breaks: Q.z.slice(), samples: 700 }, o));
const asym = (G, x, o = {}) => G.vline(x, Object.assign({ color: IX, width: 2.6, dash: '9 7' }, o));
const pm1 = (G) => [G.hline(1, { color: 'gray', width: 2, dash: '2 6' }), G.hline(-1, { color: 'gray', width: 2, dash: '2 6' })];
/* the branches of 1/f between the asymptotes, left to right (for drawing one at a time) */
function branches(G, Q, o = {}) {
  const w = G.win, cuts = [w.xmin, ...Q.z.filter((x) => x > w.xmin && x < w.xmax), w.xmax], out = [];
  for (let i = 0; i < cuts.length - 1; i++) {
    const a = cuts[i] + (i ? 1e-4 : 0), b = cuts[i + 1] - (i < cuts.length - 2 ? 1e-4 : 0);
    out.push(G.fn(Q.r, Object.assign({ color: AC, width: 4.5, from: a, to: b, samples: 500 }, o)));
  }
  return out;
}
/* a vertical bar beside the y-axis whose ends can move (for the range); st = { lo, hi, loS, hiS } with 'closed'|'open'|'arrow' */
function ybar(G, st, o = {}) {
  return G.curve(() => {
    const w = G.win, off = o.offset || 0, ax = G.toPx(0, 0)[0] + off;
    const lo = Math.max(st.lo, w.ymin), hi = Math.min(st.hi, w.ymax);
    const P = (v) => [ax, G.toPx(0, v)[1]];
    const a = P(Math.min(lo, hi)), b = P(Math.max(lo, hi)), loTop = lo > hi;
    const sLo = st.lo < w.ymin ? 'arrow' : st.loS, sHi = st.hi > w.ymax ? 'arrow' : st.hiS;
    const eA = loTop ? sHi : sLo, eB = loTop ? sLo : sHi;
    return { subs: [[a, b]], ends: [{ p: a, d: [0, 1], s: eA === 'arrow' && !loTop && st.lo >= w.ymin ? st.loS : eA, k: 0, si: 0, last: false }, { p: b, d: [0, -1], s: eB, k: 1, si: 0, last: true }].filter((e) => e.s) };
  }, Object.assign({ width: 9, opacity: 0.75, r: 7.5, cap: 'butt' }, o), 'u7l7-bar', G.layers.data);
}
const buildG = (stage, win, o = {}) => new Graph(stage, Object.assign({ x: 0, y: 2, width: 440, height: 440, fontSize: 15, pad: [30, 18, 18, 18] }, win, o));
const panel = (stage, ex) => div(stage, 'u7l7-pn', '', 466, 0, ex.W - 466);

/* =============================== card figures =============================== */
const F1 = quad(1, -2, -3), F4a = quad(1, -4, 3), F4b = vq(-1, -2, 0), F4c = vq(0.5, 1, 2), F5 = quad(-0.5, 0, 2), F6 = quad(-1, 4, 0), FX2 = quad(1, 0, 0);
const MQ = { A: quad(-1, 0, 4), B: vq(1, 1, 0), C: quad(1, 0, -1), D: quad(1, 0, 1) };
const dots = (G, pts, color = 'red', r = 6) => pts.map(([x, y]) => G.point(x, y, { color, r }));
const FIGS = {
  ex1: { w: 360, h: 420, win: { xmin: -3.5, xmax: 5.5, ymin: -5.5, ymax: 5.5 }, given(G) { pm1(G); fGraph(G, F1, { color: INK, width: 3 }); G.label(4.1, 4.6, T('f'), { cls: 'bk-ptlab', pos: 'e' }); },
    ans: (G) => [asym(G, -1), asym(G, 3), rGraph(G, F1), ...dots(G, [[-2, 0.2], [0, -1 / 3], [1, -0.25], [2, -1 / 3], [4, 0.2]]), ...dots(G, [[1 - Math.sqrt(5), 1], [1 + Math.sqrt(5), 1], [1 - Math.sqrt(3), -1], [1 + Math.sqrt(3), -1]], 'amber')] },
  n2: { w: 280, h: 280, win: { xmin: -3.5, xmax: 3.5, ymin: -3.5, ymax: 3.5 }, fs: 13, draw(G) { const Q = quad(0.5, 0, -2); fGraph(G, Q, { dash: '8 6', width: 2.5 }); asym(G, -2); asym(G, 2); rGraph(G, Q); } },
  n1: { w: 280, h: 280, win: { xmin: -3.5, xmax: 3.5, ymin: -3.5, ymax: 3.5 }, fs: 13, draw(G) { const Q = quad(0.5, 0, 0); fGraph(G, Q, { dash: '8 6', width: 2.5 }); asym(G, 0); rGraph(G, Q); } },
  n0: { w: 280, h: 280, win: { xmin: -3.5, xmax: 3.5, ymin: -3.5, ymax: 3.5 }, fs: 13, draw(G) { const Q = quad(0.5, 0, 1); fGraph(G, Q, { dash: '8 6', width: 2.5 }); rGraph(G, Q); } },
  e4a: { w: 290, h: 330, win: { xmin: -1.5, xmax: 5.5, ymin: -3.5, ymax: 4.5 }, fs: 13, given(G) { pm1(G); fGraph(G, F4a, { color: INK, width: 3 }); },
    ans: (G) => [asym(G, 1), asym(G, 3), rGraph(G, F4a), ...dots(G, [[2, -1], [0, 1 / 3], [2 - Math.SQRT2, 1], [2 + Math.SQRT2, 1]])] },
  e4b: { w: 290, h: 330, win: { xmin: -5.5, xmax: 1.5, ymin: -4.5, ymax: 3.5 }, fs: 13, given(G) { pm1(G); fGraph(G, F4b, { color: INK, width: 3 }); },
    ans: (G) => [asym(G, -2), rGraph(G, F4b), ...dots(G, [[-3, -1], [-1, -1], [0, -0.25]])] },
  e4c: { w: 290, h: 330, win: { xmin: -2.5, xmax: 4.5, ymin: -1.5, ymax: 5.5 }, fs: 13, given(G) { pm1(G); fGraph(G, F4c, { color: INK, width: 3 }); },
    ans: (G) => [rGraph(G, F4c), ...dots(G, [[1, 0.5], [0, 0.4]])] },
  e5: { w: 380, h: 380, win: { xmin: -4.5, xmax: 4.5, ymin: -4.5, ymax: 4.5 }, given(G) { pm1(G); },
    ans: (G) => [fGraph(G, F5, { dash: '9 7', width: 3 }), asym(G, -2), asym(G, 2), rGraph(G, F5), ...dots(G, [[0, 0.5], [-Math.SQRT2, 1], [Math.SQRT2, 1], [-Math.sqrt(6), -1], [Math.sqrt(6), -1]])] },
  e6: { w: 360, h: 360, win: { xmin: -2.5, xmax: 6.5, ymin: -4.5, ymax: 4.5 }, given(G) {
    asym(G, 0, { color: INK }); asym(G, 4, { color: INK }); rGraph(G, F6, { color: INK, width: 3.5 }); G.point(2, 0.25, { color: INK, r: 6, label: T('\\left(2,\\ \\frac14\\right)'), pos: 'n' });
  }, ans: (G) => [fGraph(G, F6, { width: 3.5 }), ...dots(G, [[0, 0], [4, 0], [2, 4]], 'blue')] },
  e7: { w: 340, h: 340, win: { xmin: -3.5, xmax: 3.5, ymin: -1.5, ymax: 5.5 }, ans: (G) => [fGraph(G, FX2, { dash: '9 7', width: 3 }), rGraph(G, FX2), ...dots(G, [[-1, 1], [1, 1]], 'amber')] },
  ...Object.fromEntries(Object.entries(MQ).map(([k, Q]) => ['m' + k, { w: 220, h: 220, fs: 12, win: { xmin: -3.5, xmax: 3.5, ymin: -3.5, ymax: 3.5, xlabels: 2, ylabels: 2 }, draw(G) { Q.z.forEach((x) => asym(G, x, { color: COLORS.gray, width: 2 })); rGraph(G, Q, { color: INK, width: 3.5 }); } }]))
};
function buildFigs() {
  document.querySelectorAll('.u7l7 [data-fig]').forEach((el) => {
    const f = FIGS[el.dataset.fig]; if (!f || el.dataset.built) return; el.dataset.built = '1';
    const G = new Graph(el, Object.assign({ width: f.w, height: f.h, fontSize: f.fs || 15, fnArrows: true }, f.win));
    if (f.draw) f.draw(G);
    if (f.given) f.given(G);
    if (f.ans) (f.ans(G) || []).forEach((e) => { if (e) { e.classList.add('u7l7-ans'); if (e.label) e.label.classList.add('u7l7-ans'); } });
  });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', buildFigs); else buildFigs();

/* =============================== explainer: point by point and the tracer (Example 1) =============================== */
const trace = {
  title: 'Every point (x, y) becomes (x, 1/y)',
  height: 444, minW: 880, capH: 96,
  ask: () => `<b>Example 1:</b> ${T('f(x)=x^2-2x-3')}. Complete the table, sketch ${T('y=\\frac{1}{f(x)}')}, state the asymptotes, and find the point matching the vertex and the invariant points.`,
  make(stage, v, ex) {
    const Q = F1, G = buildG(stage, FIGS.ex1.win), P = panel(stage, ex);
    const xs = [-2, -1, 0, 1, 2, 3, 4], RT = { 5: '\\frac15', '-3': '-\\frac13', '-4': '-\\frac14' };
    const und = { html: '<span class="u7l7-und">undef.</span>' };
    const tb = new ValueTable(P, { layout: 'h', headers: ['x', 'f(x)', '\\frac{1}{f(x)}'], rows: xs.map((x) => [x, Q.f(x), Q.f(x) === 0 ? und : RT[Q.f(x)]]), hide: (r, c) => c > 0, tap: false, cellW: 46, cellH: 46, headW: 74, cls: 'u7l7-vt' });
    const read = div(P, 'u7l7-read', `<div class="u7l7-cf">${T('f(x)=')} <b class="u7l7-rf">…</b></div><div class="u7l7-ca">${T('\\frac{1}{f(x)}=')} <b class="u7l7-rr">…</b></div>`);
    hide(read);
    const rows = h('div', 'u7l7-rows u7l7-rows-s'); P.appendChild(rows);
    const [l1, l2] = pm1(G).map(hide);
    const fc = hide(fGraph(G, Q)), rc = hide(rGraph(G, Q)), rcO = rc;
    const fp = xs.map((x) => hide(G.point(x, Q.f(x), { color: FC, r: 7 })));
    const rp = xs.map((x) => hide(G.point(x, Q.f(x), { color: AC, r: 7 })));
    const a1 = hide(asym(G, -1)), a2 = hide(asym(G, 3));
    const vtx = hide(G.point(1, -4, { color: FC, r: 8, label: T('(1,\\ -4)'), pos: 's' }));
    const tpt = hide(G.point(1, -0.25, { color: TP, r: 8.5, label: T('\\left(1,\\ -\\frac14\\right)'), pos: 'n' }));
    const inv = [[1 - Math.sqrt(5), 1], [1 + Math.sqrt(5), 1], [1 - Math.sqrt(3), -1], [1 + Math.sqrt(3), -1]].map(([x, y]) => hide(G.point(x, y, { color: 'amber', r: 8, label: T(`(${x.toFixed(2)},\\ ${y})`), pos: y > 0 ? (x < 0 ? 'nw' : 'ne') : (x < 1 ? 'sw' : 'se') })));
    const ring = glowRing(G.layers.top);
    const tf = hide(G.point(-3.5, Q.f(-3.5), { color: FC, r: 8 })), tr = hide(G.point(-3.5, Q.r(-3.5), { color: AC, r: 8 }));
    const tl = hide(G.vline(-3.5, { color: COLORS.gray, width: 2, dash: '4 5' }));
    const r = [row(rows, '(a)', `${T('f(x)')} row, then ${T('\\left(x,\\ \\frac1y\\right)')}`), row(rows, '(b)', 'sketch: follow the tracer'), row(rows, '(c)', `${T('x=-1')}, ${T('x=3')}; ${T('y=0')}`), row(rows, '(d)', `${T('(1,\\ -4)\\to\\left(1,\\ -\\frac14\\right)')}: max`), row(rows, '(e)', `${T('f(x)=\\pm1')}: four invariant points`)];
    const setT = (x) => {
      tl.set(x); G.moveTo(tf, x, Q.f(x)); const y = Q.r(x), inside = Math.abs(y) <= G.win.ymax;
      G.moveTo(tr, x, inside ? y : Math.sign(y) * G.win.ymax); tr.style.opacity = inside ? '' : 0;
      read.querySelector('.u7l7-rf').textContent = Q.f(x).toFixed(2).replace('-', '−');
      read.querySelector('.u7l7-rr').textContent = Math.abs(y) > 99 ? (y > 0 ? 'huge!' : '−huge!') : y.toFixed(2).replace('-', '−');
    };
    return [
      { cap: `(a) Fill the ${T('f(x)')} row: ${T('f(-2)=4+4-3=5')}, ${T('f(-1)=0')}, ${T('f(0)=-3')}, … Plot the points on ${T('y=f(x)')}, with the lines ${T('y=\\pm1')} dotted.`,
        run: async (c) => { await show(c, r[0]); await tb.fill(c, { col: 1, stagger: 70 }); await Promise.all(fp.map((p) => pop(c, unhide(p), 300))); await drawIn(unhide(fc), 700, c); unhide(l1); unhide(l2); await show(c, l1); } },
      { cap: `Each point ${T('(x,\\ y)')} becomes ${T('\\left(x,\\ \\frac1y\\right)')}: ${T('(-2,\\ 5)\\to\\left(-2,\\ \\frac15\\right)')}, ${T('(0,\\ -3)\\to\\left(0,\\ -\\frac13\\right)')} … At the zeros ${T('\\frac10')} is <b>undefined</b>: no point.`,
        run: async (c) => {
          await tb.fill(c, { col: 2, stagger: 70 });
          await Promise.all(xs.map((x, i) => { const y = Q.f(x); if (y === 0) return null; unhide(rp[i]); return G.move(c, rp[i], x, 1 / y, 1100); }));
        } },
      { cap: `(b) Between the points: a tracer slides across. The <b class="u7l7-ca">red</b> dot is always at ${T('\\frac{1}{f(x)}')}: where ${T('f(x)')} is near ${T('0')}, its reciprocal is <b>huge</b>, and the red dot shoots off the grid.`,
        run: async (c) => {
          await show(c, r[1]); unhide(read); unhide(tl); unhide(tf); unhide(tr);
          const o0 = rcO; o0.style.opacity = ''; const path = o0.path, L = { };
          void L; path.style.clipPath = '';
          const [x0] = G.toPx(G.win.xmin, 0), [x1] = G.toPx(G.win.xmax, 0);
          await tween(c, 5200, (t) => { const x = G.win.xmin + (G.win.xmax - G.win.xmin) * t; setT(Math.min(x, G.win.xmax - 1e-3)); const px = x0 + (x1 - x0) * t; o0.style.clipPath = `inset(0 ${Math.max(0, 100 - 100 * (px) / (G.toPx(G.win.xmax, 0)[0] + 30))}% 0 0)`; });
          o0.style.clipPath = ''; [tf, tr, tl].forEach(hide); hide(read);
        } },
      { cap: `(c) ${T('f(x)=(x+1)(x-3)')}: zeros ${T('-1')} and ${T('3')}. Vertical asymptotes ${T('x=-1')} and ${T('x=3')}; horizontal asymptote ${T('y=0')} (the ${T('x')}-axis).`,
        run: async (c) => { await show(c, r[2]); await Promise.all([drawIn(unhide(a1), 600, c), drawIn(unhide(a2), 600, c)]); } },
      { cap: `(d) The vertex ${T('(1,\\ -4)')} becomes ${T('\\left(1,\\ -\\frac14\\right)')}. There ${T('f(x)')} is <b>farthest</b> from ${T('0')}, so ${T('\\frac{1}{f(x)}')} is <b>closest</b> to ${T('0')}: the highest point of the middle branch, a <b>local maximum</b>.`,
        run: async (c) => { await show(c, r[3]); await popP(c, vtx); G.moveTo(tpt, 1, -4); unhide(tpt); await G.move(c, tpt, 1, -0.25, 1000); placeRing(ring, G, 1, -0.25); } },
      { cap: `(e) Where ${T('f(x)=1')} or ${T('f(x)=-1')}, the reciprocal is the <b>same</b> number: the graphs meet on the dotted lines. ${T('x^2-2x-4=0')}: ${T('x=1\\pm\\sqrt5')}; ${T('x^2-2x-2=0')}: ${T('x=1\\pm\\sqrt3')}.`,
        run: async (c) => { placeRing(ring, G, 0, 0, false); await show(c, r[4]); for (const p of inv) await popP(c, p); } }
    ];
  }
};

/* =============================== explainer: slide the parabola (STAR) =============================== */
const SL = {
  e2a: { Q: quad(1, 3, -10), f: 'x^2+3x-10', ex: '(a)', win: { xmin: -7.5, xmax: 4.5 }, work: [`${T('x^2+3x-10=(x+5)(x-2)')}`, `zeros ${T('-5')} and ${T('2')}`], eqs: 'x=-5,\\ x=2' },
  e2b: { Q: quad(1, -10, 25), f: 'x^2-10x+25', ex: '(b)', win: { xmin: 0.5, xmax: 9.5 }, work: [`${T('x^2-10x+25=(x-5)^2')}`, `one zero: ${T('5')}`], eqs: 'x=5' },
  e2c: { Q: quad(3, 0, 2), f: '3x^2+2', ex: '(c)', win: { xmin: -4.5, xmax: 4.5 }, work: [`${T('3x^2\\ge0')}, so ${T('3x^2+2\\ge2')}`, 'never 0: no zeros'], eqs: null },
  e2d: { Q: quad(2, 5, -3), f: '2x^2+5x-3', ex: '(d)', win: { xmin: -5.5, xmax: 3.5 }, work: [`${T('2x^2+5x-3=(2x-1)(x+3)')}`, `zeros ${T('\\frac12')} and ${T('-3')}`], eqs: 'x=\\frac12,\\ x=-3' },
  e2e: { Q: quad(1, -2, 4), f: 'x^2-2x+4', ex: '(e)', win: { xmin: -3.5, xmax: 5.5 }, work: [`${T('b^2-4ac=4-16=-12<0')}`, 'no zeros'], eqs: null },
  e2f: { Q: quad(1, 0, -7), f: 'x^2-7', ex: '(f)', win: { xmin: -4.5, xmax: 4.5 }, work: [`${T('x^2=7')}`, `${T('x=\\pm\\sqrt7\\approx\\pm2.65')}`], eqs: 'x=-\\sqrt7,\\ x=\\sqrt7' }
};
const COUNT_TXT = ['<b>no zeros</b> → no vertical asymptote', '<b>one zero</b> → one vertical asymptote', '<b>two zeros</b> → two vertical asymptotes'];
const DISC = ['b^2-4ac<0', 'b^2-4ac=0', 'b^2-4ac>0'];
/* the count badge: a big stamped number, what it means, and the asymptotes */
function counter(P) {
  const el = div(P, 'u7l7-count', '<div class="u7l7-num">2</div><div class="u7l7-cl"></div>');
  const num = el.querySelector('.u7l7-num'), cl = el.querySelector('.u7l7-cl');
  let last = null;
  return { el, set(n, extra = '') { num.textContent = n; num.className = 'u7l7-num z' + n; cl.innerHTML = `${COUNT_TXT[n]}<br>${T(DISC[n])}${extra ? '<br>' + extra : ''}`; if (last !== null && last !== n) num.animate([{ transform: 'scale(1.7) rotate(-16deg)', opacity: 0.2 }, { transform: 'scale(1) rotate(-8deg)', opacity: 1 }], { duration: 380, easing: 'cubic-bezier(.2,1.4,.4,1)' }); last = n; } };
}
const slide = {
  title: 'Slide the parabola: 2, 1 or 0 asymptotes',
  height: 444, minW: 880, capH: 96,
  choices: [{ v: 'watch', label: 'Slide it' }, { sep: 'Example 2:' }, ...Object.keys(SL).map((k) => ({ v: k, label: SL[k].ex })), { v: 'play', label: 'Your turn' }],
  ask: (v) => v === 'watch' ? `Slide the parabola ${T('f(x)=\\frac12x^2+q')} up. What happens to the vertical asymptotes of ${T('y=\\frac{1}{f(x)}')}?`
    : v === 'play' ? `<b>Your turn:</b> move the parabola. How many vertical asymptotes does ${T('y=\\frac{1}{f(x)}')} have?`
    : `<b>Example 2${SL[v].ex}:</b> how many vertical asymptotes does the graph of ${T('y=\\frac{1}{f(x)}')} have, for ${T('f(x)=' + SL[v].f)}?`,
  make(stage, v, ex) {
    if (SL[v]) return slideCheck(stage, v, ex);
    const G = buildG(stage, { xmin: -4.5, xmax: 4.5, ymin: -4.5, ymax: 4.5 }), P = panel(stage, ex);
    const S = { a: 0.5, p: 0, q: -2 }, o = {}, br = [];
    let Q = vq(S.a, S.p, S.q);
    const fO = { color: FC, width: 3.5 }, rO = { color: AC, width: 4.5, breaks: br, samples: 900 };
    const fc = G.fn((x) => Q.f(x), fO), rc = G.fn((x) => Q.r(x), rO);
    const A = [asym(G, -2), asym(G, 2)], tp = G.point(0, -0.5, { color: TP, r: 8 });
    const eq = div(P, 'u7l7-eqbig', ''), cnt = counter(P), info = div(P, 'u7l7-out', '');
    const ctl = h('div', 'u7l7-pn'); P.appendChild(ctl);
    const fmtQ = (a, p, q) => `f(x)=${a < 0 ? '-' : ''}\\frac12${p ? `(x${p > 0 ? '-' : '+'}${tn(Math.abs(p))})^2` : 'x^2'}${q ? (q > 0 ? '+' : '-') + tn(Math.abs(q)) : ''}`;
    const upd = () => {
      Q = vq(S.a, S.p, S.q); br.length = 0; Q.z.forEach((z) => br.push(z));
      fc._bkDraw(); rc._bkDraw();
      const n = Q.z.length;
      A.forEach((L, i) => { const x = n === 2 ? Q.z[i] : n === 1 ? Q.z[0] : 0; L.set(x); L.style.opacity = n ? '' : 0; });
      const k = 1 / S.q, inW = S.q !== 0 && Math.abs(k) < G.win.ymax;
      G.moveTo(tp, S.p, inW ? k : 0); tp.style.opacity = inW ? '' : 0;
      eq.innerHTML = T(fmtQ(S.a, S.p, S.q));
      const zs = n === 2 ? `${T(`x=${tn(Q.z[0])}`)}, ${T(`x=${tn(Q.z[1])}`)}` : n === 1 ? T(`x=${tn(Q.z[0])}`) : '';
      cnt.set(n, zs);
      info.innerHTML = `<div><b class="u7l7-cg">turning point</b> ${S.q ? T(`\\left(p,\\ \\frac1q\\right)=\\left(${tn(S.p)},\\ ${recT(S.q)}\\right)`) + (S.a > 0 ? ' max' : ' min') : 'none: the vertex is a zero'}</div><div>${T('b^2-4ac=-4aq=' + tn(-4 * S.a * S.q))}</div>`;
    };
    upd();
    if (v === 'play') {
      const sl = (n, lo, hi, st, key) => { const l = h('label', 'u7l7-sl no-ink', `<span class="u7l7-sll">${T(n)}</span><input type="range" min="${lo}" max="${hi}" step="${st}" value="${S[key]}" aria-label="the value of ${n}"><span class="u7l7-slv"></span>`); l.setAttribute('data-tap', ''); ctl.appendChild(l); const inp = l.querySelector('input'), out = l.querySelector('.u7l7-slv'); const put = () => { out.textContent = String(S[key]).replace('-', '−'); }; inp.addEventListener('input', () => { S[key] = parseFloat(inp.value); put(); upd(); }); put(); return l; };
      const sq = sl('q', -3, 3, 0.25, 'q'), sp = sl('p', -2, 2, 0.5, 'p');
      const tg = h('div', 'u7l7-tog no-ink', '<button type="button" class="on" data-a="0.5">opens up</button><button type="button" data-a="-0.5">opens down</button>'); tg.setAttribute('data-tap', ''); ctl.appendChild(tg);
      tg.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => { S.a = parseFloat(b.dataset.a); tg.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b)); upd(); }));
      return [{ cap: `<b>Your turn:</b> drag ${T('q')} to slide the parabola up and down (and ${T('p')} left and right). The <b class="u7l7-cx">asymptotes</b> sit at the zeros: two, one when the vertex touches the axis, none when the parabola misses it.`,
        run: async (c) => { await pulse(c, sq, 1.04); await pulse(c, sp, 1.03); } }];
    }
    ctl.remove();
    const to = (c, q1, ms) => { const q0 = S.q; return tween(c, ms, (t) => { S.q = q0 + (q1 - q0) * t; if (Math.abs(S.q) < 1e-9) S.q = 0; upd(); }); };
    return [
      { cap: `${T('f(x)=\\frac12x^2-2')} crosses the ${T('x')}-axis twice: <b>two zeros</b>, ${T('\\pm2')}, so <b>two vertical asymptotes</b> and three branches. The middle branch has a turning point at ${T('\\left(0,\\ -\\frac12\\right)')}.`,
        run: async (c) => { await pulse(c, cnt.el, 1.04); } },
      { cap: `Slide the parabola <b>up</b>. The zeros move together, so the asymptotes do too, and the middle branch dives. At ${T('f(x)=\\frac12x^2')} the vertex touches the axis: the asymptotes <b>merge</b> into one, ${T('x=0')}. Two branches, both above the axis.`,
        run: async (c) => { await to(c, 0, 3400); } },
      { cap: `Keep going: ${T('f(x)=\\frac12x^2+1')} misses the axis. <b>No zeros, no vertical asymptote</b>: one unbroken curve above the axis, with a maximum at ${T('(0,\\ 1)')} (an invariant point, since ${T('q=1')}).`,
        run: async (c) => { await to(c, 1, 2200); } },
      { cap: `And back down: as soon as the vertex goes below the axis, there are two zeros again and the asymptotes split apart. The count only depends on how the parabola meets the ${T('x')}-axis: ${T('b^2-4ac')}.`,
        run: async (c) => { await to(c, -2, 3000); } }
    ];
  }
};
/* Example 2 checks: work, zeros, asymptotes, the reciprocal, the count */
function slideCheck(stage, v, ex) {
  const d = SL[v], Q = d.Q, G = buildG(stage, Object.assign({ ymin: -6.5, ymax: 6.5, ylabels: 2 }, d.win)), P = panel(stage, ex);
  div(P, 'u7l7-eqbig', T('f(x)=' + d.f));
  const rows = h('div', 'u7l7-rows'); P.appendChild(rows);
  const cnt = counter(P); hide(cnt.el);
  const fc = hide(fGraph(G, Q)), rc = hide(rGraph(G, Q)), A = Q.z.map((x) => hide(asym(G, x))), zp = Q.z.map((x) => hide(G.point(x, 0, { color: 'amber', r: 8 })));
  const r1 = row(rows, 1, d.work[0]), r2 = row(rows, 2, d.work[1]);
  const n = Q.z.length, word = ['None', 'One', 'Two'][n];
  return [
    { cap: `${T('f(x)=' + d.f)}: ${d.work[0]}. ${n ? `The parabola meets the ${T('x')}-axis ${n === 1 ? 'once, at its vertex' : 'twice'}.` : `The parabola never meets the ${T('x')}-axis.`}`,
      run: async (c) => { await show(c, r1); await drawIn(unhide(fc), 700, c); } },
    { cap: `${n ? `${d.work[1]}: ` : ''}<b>${word}</b>${n ? `: ${T(d.eqs)}` : ': no vertical asymptote'}. The reciprocal ${n === 2 ? 'has three branches' : n === 1 ? 'has two branches on the same side of the axis' : 'is one unbroken curve'}.`,
      run: async (c) => { await show(c, r2); for (const p of zp) await popP(c, p); await Promise.all(A.map((L) => drawIn(unhide(L), 600, c))); await drawIn(unhide(rc), 900, c); cnt.set(n, d.eqs ? T(d.eqs) : ''); await stampIn(c, unhide(cnt.el)); } }
  ];
}

/* =============================== explainer: turning point, domain and range =============================== */
const RG = {
  demo: { a: 1, p: 0, q: -2, f: 'x^2-2', win: { xmin: -4.5, xmax: 4.5, ymin: -4.5, ymax: 4.5 }, label: 'range y ≥ −2' },
  e3a: { a: 1, p: 2, q: 4, f: '(x-2)^2+4', win: { xmin: -2.5, xmax: 6.5, ymin: -2.5, ymax: 7.5 }, ex: '(a)' },
  e3b: { a: -1, p: -1, q: 2, f: '-(x+1)^2+2', win: { xmin: -5.5, xmax: 3.5, ymin: -5.5, ymax: 4.5 }, ex: '(b)', zt: '-1\\pm\\sqrt2', zw: '(x+1)^2=2' },
  e3c: { a: 2, p: 3, q: -8, f: '2(x-3)^2-8', win: { xmin: -1.5, xmax: 7.5, ymin: -9.5, ymax: 4.5, ylabels: 2 }, ex: '(c)', zt: '1,\\ 5', zw: '(x-3)^2=4' },
  e3d: { a: -0.5, p: -4, q: -3, f: '-\\frac12(x+4)^2-3', win: { xmin: -8.5, xmax: 1.5, ymin: -7.5, ymax: 3.5 }, ex: '(d)' },
  e3e: { a: -3, p: 1, q: 0, f: '-3(x-1)^2', win: { xmin: -2.5, xmax: 4.5, ymin: -6.5, ymax: 3.5 }, ex: '(e)' }
};
const setT = (s) => `\\left\\{y\\mid ${s},\\ y\\in\\mathbb{R}\\right\\}`;
/* the parts of the range of f (split at 0, the zero itself left out) and their reciprocals */
function rangeParts(a, q) {
  const I = Infinity;
  if (a > 0) {
    if (q > 0) return { f: `y\\ge${tn(q)}`, parts: [{ lo: q, hi: I, loS: 'closed', hiS: 'arrow', t: `f(x)\\ge${tn(q)}`, rt: `0<\\frac{1}{f(x)}\\le${recT(q)}`, to: { lo: 0, hi: 1 / q, loS: 'open', hiS: 'closed' } }], r: `0<y\\le${recT(q)}` };
    if (q < 0) return { f: `y\\ge${tn(q)}`, parts: [{ lo: q, hi: 0, loS: 'closed', hiS: 'open', t: `${tn(q)}\\le f(x)<0`, rt: `\\frac{1}{f(x)}\\le${recT(q)}`, to: { lo: -I, hi: 1 / q, loS: 'arrow', hiS: 'closed' } }, { lo: 0, hi: I, loS: 'open', hiS: 'arrow', t: 'f(x)>0', rt: '\\frac{1}{f(x)}>0', to: { lo: 0, hi: I, loS: 'open', hiS: 'arrow' } }], r: `y\\le${recT(q)}\\text{ or }y>0` };
    return { f: 'y\\ge0', parts: [{ lo: 0, hi: I, loS: 'open', hiS: 'arrow', t: 'f(x)>0', rt: '\\frac{1}{f(x)}>0', to: { lo: 0, hi: I, loS: 'open', hiS: 'arrow' } }], r: 'y>0' };
  }
  if (q < 0) return { f: `y\\le${tn(q)}`, parts: [{ lo: -I, hi: q, loS: 'arrow', hiS: 'closed', t: `f(x)\\le${tn(q)}`, rt: `${recT(q)}\\le\\frac{1}{f(x)}<0`, to: { lo: 1 / q, hi: 0, loS: 'closed', hiS: 'open' } }], r: `${recT(q)}\\le y<0` };
  if (q > 0) return { f: `y\\le${tn(q)}`, parts: [{ lo: -I, hi: 0, loS: 'arrow', hiS: 'open', t: 'f(x)<0', rt: '\\frac{1}{f(x)}<0', to: { lo: -I, hi: 0, loS: 'arrow', hiS: 'open' } }, { lo: 0, hi: q, loS: 'open', hiS: 'closed', t: `0<f(x)\\le${tn(q)}`, rt: `\\frac{1}{f(x)}\\ge${recT(q)}`, to: { lo: 1 / q, hi: I, loS: 'closed', hiS: 'arrow' } }], r: `y<0\\text{ or }y\\ge${recT(q)}` };
  return { f: 'y\\le0', parts: [{ lo: -I, hi: 0, loS: 'arrow', hiS: 'open', t: 'f(x)<0', rt: '\\frac{1}{f(x)}<0', to: { lo: -I, hi: 0, loS: 'arrow', hiS: 'open' } }], r: 'y<0' };
}
const range = {
  title: 'Turning point, domain and range of y = 1/f(x)',
  height: 444, minW: 880, capH: 104,
  choices: [{ v: 'demo', label: 'Range y ≥ −2' }, { sep: 'Example 3:' }, ...['e3a', 'e3b', 'e3c', 'e3d', 'e3e'].map((k) => ({ v: k, label: RG[k].ex }))],
  ask: (v) => v === 'demo' ? `${T('f(x)=x^2-2')} has range ${T('y\\ge-2')}. What are the turning point, the domain and the range of ${T('y=\\frac{1}{f(x)}')}?`
    : `<b>Example 3${RG[v].ex}:</b> ${T('f(x)=' + RG[v].f)}. State the turning point of ${T('y=\\frac{1}{f(x)}')} (maximum or minimum), its domain and its range.`,
  make(stage, v, ex) {
    const d = RG[v], Q = vq(d.a, d.p, d.q), G = buildG(stage, d.win), P = panel(stage, ex);
    div(P, 'u7l7-eqbig', T('f(x)=' + d.f));
    const rows = h('div', 'u7l7-rows u7l7-rows-s'); P.appendChild(rows);
    const fc = fGraph(G, Q), rc = hide(rGraph(G, Q));
    const A = Q.z.map((x) => hide(asym(G, x)));
    const up = d.a > 0, type = up ? 'maximum' : 'minimum';
    const vx = G.point(d.p, d.q, { color: FC, r: 8, label: T(`(${tn(d.p)},\\ ${tn(d.q)})`), pos: up ? 's' : 'n' });
    const steps = [];
    const ring = glowRing(G.layers.top);
    const RP = rangeParts(d.a, d.q);
    /* 1: the turning point */
    if (d.q) {
      const tp = hide(G.point(d.p, d.q, { color: TP, r: 8.5, label: T(`\\left(${tn(d.p)},\\ ${recT(d.q)}\\right)`), pos: (1 / d.q > 0) === up ? 'n' : 's' }));
      const r1 = row(rows, 1, `${T(up ? 'a>0' : 'a<0')}: ${type} point ${T(`\\left(${tn(d.p)},\\ ${recT(d.q)}\\right)`)}`);
      steps.push({ cap: `<b>1</b> The vertex ${T(`(${tn(d.p)},\\ ${tn(d.q)})`)} becomes ${T(`\\left(${tn(d.p)},\\ \\frac{1}{${tn(d.q)}}\\right)=\\left(${tn(d.p)},\\ ${recT(d.q)}\\right)`)}. ${up ? 'A minimum of the parabola' : 'A maximum of the parabola'} becomes a <b>${type} point</b> of the reciprocal (${T(up ? 'a>0' : 'a<0')}).`,
        run: async (c) => { await show(c, r1); await pulse(c, vx, 1.3); unhide(tp); await G.move(c, tp, d.p, 1 / d.q, 1100); placeRing(ring, G, d.p, 1 / d.q); } });
    } else {
      const r1 = row(rows, 1, `${T('q=0')}: no turning point; ${T(`x=${tn(d.p)}`)}`);
      steps.push({ cap: `<b>1</b> ${T('q=0')}: the vertex ${T(`(${tn(d.p)},\\ 0)`)} is a <b>zero</b>. There is a vertical asymptote ${T(`x=${tn(d.p)}`)} and <b>no turning point</b>.`,
        run: async (c) => { await show(c, r1); await pulse(c, vx, 1.3); await drawIn(unhide(A[0]), 600, c); } });
    }
    /* 2: the domain */
    const zt = d.zt || Q.z.map((z) => tn(z)).join(',\\ ');
    const domT = Q.z.length ? `\\{x\\mid x\\ne${Q.z.length === 2 && !d.zt ? Q.z.map(tn).join(',\\ x\\ne') : d.zt && d.zt.includes(',') ? d.zt.replace(',\\ ', ',\\ x\\ne') : zt},\\ x\\in\\mathbb{R}\\}` : '\\{x\\mid x\\in\\mathbb{R}\\}';
    const cuts = [-Infinity, ...Q.z, Infinity], dom = [];
    for (let i = 0; i < cuts.length - 1; i++) dom.push(hide(G.shadeX(cuts[i], cuts[i + 1], { openA: i > 0, openB: i < cuts.length - 2, color: 'amber' })));
    const r2 = row(rows, 2, `domain ${T(domT)}`);
    steps.push({ cap: `<b>2</b> Domain: every ${T('x')} except the zeros of ${T('f')}. ${Q.z.length ? (d.zw ? `${T(d.zw)}: ${T('x=' + zt)}` : `Zeros ${T(zt)}`) + `, so ${T(domT)}.` : `${T('f')} has no zeros (${up ? 'it opens up from above the axis' : 'it opens down from below the axis'}), so ${T(domT)}.`}`,
      run: async (c) => { placeRing(ring, G, 0, 0, false); await show(c, r2); if (d.q) await Promise.all(A.map((L) => drawIn(unhide(L), 600, c))); await drawIn(unhide(rc), 800, c); for (const s of dom) await drawIn(unhide(s), 400, c); } });
    /* 3: the range of f, split at 0 */
    const fb = RP.parts.map((pt) => hide(ybar(G, { lo: pt.lo, hi: pt.hi, loS: pt.loS, hiS: pt.hiS }, { color: FC, offset: -13 })));
    const r3 = row(rows, 3, `range of ${T('f')}: ${T(RP.f)}<br>${RP.parts.map((pt) => T(pt.t)).join(' &nbsp;and&nbsp; ')}`);
    steps.push({ cap: `<b>3</b> The range of ${T('f')} is ${T(RP.f)}${RP.parts.length > 1 ? `. Split it at ${T('0')} (never ${T('f(x)=0')} on the reciprocal): ${RP.parts.map((pt) => T(pt.t)).join(' and ')}.` : d.q ? `: ${T(RP.parts[0].t)} (it never reaches ${T('0')}).` : `, but ${T('f(x)=0')} only at the asymptote: ${T(RP.parts[0].t)}.`}`,
      run: async (c) => { for (const s of dom) s.style.opacity = 0.35; await show(c, r3); for (const b of fb) await drawIn(unhide(b), 600, c); } });
    /* 4: the reciprocal of each part */
    const rbS = RP.parts.map((pt) => ({ lo: pt.lo, hi: pt.hi, loS: pt.loS, hiS: pt.hiS }));
    const rb = rbS.map((s) => hide(ybar(G, s, { color: AC, offset: 13 })));
    const r4 = row(rows, 4, `${RP.parts.map((pt) => T(pt.rt)).join('; ')}<br>range ${T(setT(RP.r))}`);
    const disp = (v, s) => (v === Infinity ? G.win.ymax + 0.6 : v === -Infinity ? G.win.ymin - 0.6 : v);
    steps.push({ cap: `<b>4</b> Take the reciprocal of each part: ${RP.parts.map((pt) => `${T(pt.t)} gives ${T(pt.rt)}`).join('; ')}. Range of ${T('y=\\frac{1}{f(x)}')}: ${T(setT(RP.r))}.`,
      run: async (c) => {
        await show(c, r4);
        rb.forEach(unhide);
        await Promise.all(RP.parts.map((pt, i) => {
          const s = rbS[i], a0 = disp(pt.lo), b0 = disp(pt.hi), a1 = disp(pt.to.lo), b1 = disp(pt.to.hi);
          // the low end of the f-part lands on the reciprocal's high end (and vice versa): the bar turns inside out
          return tween(c, 1500, (t) => { s.lo = b0 + (a1 - b0) * t; s.hi = a0 + (b1 - a0) * t; if (t >= 1) { s.lo = pt.to.lo; s.hi = pt.to.hi; s.loS = pt.to.loS; s.hiS = pt.to.hiS; } else { s.loS = pt.hiS; s.hiS = pt.loS; } rb[i]._bkDraw(); });
        }));
        await pulse(c, rc, 1.01);
      } });
    return steps;
  }
};

/* =============================== explainer: the sketching steps (procedure) =============================== */
const SK = {
  e4a: { Q: F4a, f: 'x^2-4x+3', ex: 'Example 4(a)', win: FIGS.e4a.win, zs: 'x=1,\\ x=3', yi: '\\left(0,\\ \\frac13\\right)', tp: '(2,\\ -1)', tpT: 'maximum', tpNote: 'the vertex is invariant', inv: [[2 - Math.SQRT2, 1, '2-\\sqrt2'], [2 + Math.SQRT2, 1, '2+\\sqrt2'], [2, -1, '2']] },
  e4b: { Q: F4b, f: '-(x+2)^2', ex: 'Example 4(b)', win: FIGS.e4b.win, zs: 'x=-2', yi: '\\left(0,\\ -\\frac14\\right)', tp: null, inv: [[-3, -1, '-3'], [-1, -1, '-1']] },
  e4c: { Q: F4c, f: '\\frac12(x-1)^2+2', ex: 'Example 4(c)', win: FIGS.e4c.win, zs: null, yi: '\\left(0,\\ \\frac{1}{2.5}\\right)=(0,\\ 0.4)', tp: '\\left(1,\\ \\frac12\\right)', tpT: 'maximum', inv: [] },
  e5: { Q: F5, f: '2-\\frac12x^2', ex: 'Example 5', win: FIGS.e5.win, zs: 'x=-2,\\ x=2', yi: '\\left(0,\\ \\frac12\\right)', tp: '\\left(0,\\ \\frac12\\right)', tpT: 'minimum', inv: [[-Math.SQRT2, 1, '-\\sqrt2'], [Math.SQRT2, 1, '\\sqrt2'], [-Math.sqrt(6), -1, '-\\sqrt6'], [Math.sqrt(6), -1, '\\sqrt6']] }
};
const sketch = {
  title: 'Sketch y = 1/f(x) from the parabola',
  height: 444, minW: 880, capH: 104,
  choices: [{ sep: 'Example 4:' }, { v: 'e4a', label: '(a)' }, { v: 'e4b', label: '(b)' }, { v: 'e4c', label: '(c)' }, { v: 'e5', label: 'Example 5' }],
  ask: (v) => v === 'e5' ? `<b>Example 5:</b> ${T('f(x)=2-\\frac12x^2')}. Sketch ${T('y=f(x)')} and ${T('y=\\frac{1}{f(x)}')}, and find where the reciprocal is increasing.`
    : `<b>${SK[v].ex}:</b> the graph of ${T('y=' + SK[v].f)} is shown. Sketch ${T('y=\\frac{1}{f(x)}')} and state the asymptotes and the turning point.`,
  make(stage, v, ex) {
    const d = SK[v], Q = d.Q, G = buildG(stage, d.win), P = panel(stage, ex);
    const rows = h('div', 'u7l7-rows u7l7-rows-s'); P.appendChild(rows);
    const fc = hide(fGraph(G, Q)), L = pm1(G).map(hide);
    const A = Q.z.map((x) => hide(asym(G, x))), hA = hide(G.hline(0, { color: IX, width: 4, dash: '9 7' }));
    const ip = d.inv.map(([x, y, t]) => hide(G.point(x, y, { color: 'amber', r: 7.5, label: T(`(${t},\\ ${y})`), pos: y > 0 ? 'n' : 's' })));
    const yv = 1 / Q.f(0), yi = hide(G.point(0, yv, { color: AC, r: 7.5 }));
    const tp = d.tp ? hide(G.point(Q.p, 1 / Q.q, { color: TP, r: 8.5, label: T(d.tp), pos: 1 / Q.q > 0 ? 'n' : 's' })) : null;
    const B = branches(G, Q).map(hide);
    const n = Q.z.length;
    const r = [row(rows, 1, `${T('y=' + d.f)}; the lines ${T('y=\\pm1')}`),
      row(rows, 2, n ? `${T(d.zs)}; ${T('y=0')}` : `no zeros: only ${T('y=0')}`),
      row(rows, 3, `${d.inv.length ? `invariant ${d.inv.map((p) => T(`(${p[2]},\\ ${p[1]})`)).join(', ')}<br>` : 'no invariant points<br>'}${T('y')}-int ${T(d.yi)}${d.tp ? `; ${d.tpT} ${T(d.tp)}` : '; no turning point'}`),
      row(rows, 4, `${['one curve', 'two branches', 'three branches'][n]}, same side as ${T('f')}`)];
    const steps = [
      { cap: `<b>1</b> Graph ${T('y=' + d.f)} and draw the lines ${T('y=1')} and ${T('y=-1')} (dotted).`,
        run: async (c) => { await show(c, r[0]); await drawIn(unhide(fc), 700, c); for (const l of L) await drawIn(unhide(l), 350, c); } },
      { cap: `<b>2</b> ${n ? `The zeros of ${T('f')} give dashed vertical asymptotes ${T(d.zs)}.` : `${T('f')} has <b>no zeros</b>: no vertical asymptote.`} The horizontal asymptote is ${T('y=0')}.`,
        run: async (c) => { await show(c, r[1]); await Promise.all(A.map((a) => drawIn(unhide(a), 600, c))); await drawIn(unhide(hA), 600, c); hA.style.opacity = 0.45; } },
      { cap: `<b>3</b> Mark the key points: ${d.inv.length ? `the invariant points on ${T('y=\\pm1')}` : `no invariant points (${T('f(x)\\ge2')})`}, the ${T('y')}-intercept ${T(d.yi)}${d.tp ? `, and the turning point ${T(d.tp)}, a <b>${d.tpT}</b>${d.tpNote ? ` (${d.tpNote})` : ''}` : `; no turning point (the vertex is a zero)`}.`,
        run: async (c) => { await show(c, r[2]); for (const p of ip) await popP(c, p); await pop(c, unhide(yi)); if (tp) await popP(c, tp); } },
      { cap: `<b>4</b> Draw each branch on the same side of the ${T('x')}-axis as ${T('f')}: it heads to ${T('\\pm\\infty')} beside an asymptote, and toward ${T('y=0')} where ${T('f(x)')} is large.`,
        run: async (c) => { await show(c, r[3]); for (const b of B) await drawIn(unhide(b), 750, c); } }
    ];
    if (v === 'e5') {
      const s1 = hide(G.shadeX(0, 2, { openA: true, openB: true, color: 'green', band: true })), s2 = hide(G.shadeX(2, Infinity, { openA: true, color: 'green', band: true }));
      const r5 = row(rows, 5, `increasing: ${T('0<x<2')}, ${T('x>2')}`);
      steps.push({ cap: `(c) ${T('f')} increases for ${T('x<0')} and decreases for ${T('x>0')}, so the reciprocal <b>increases</b> for ${T('x>0')}: on ${T('0<x<2')} and on ${T('x>2')} (the asymptote splits it).`,
        run: async (c) => { await show(c, r5); await drawIn(unhide(s1), 500, c); await drawIn(unhide(s2), 500, c); } });
    }
    return steps;
  }
};

/* =============================== explainer: working backwards (Example 6) =============================== */
const back = {
  title: 'From the reciprocal back to the parabola',
  height: 444, minW: 880, capH: 96,
  choices: [{ sep: 'Example 6:' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }],
  ask: (v) => v === 'a' ? `<b>Example 6(a):</b> ${T('y=g(x)=\\frac{1}{f(x)}')} has vertical asymptotes ${T('x=0')}, ${T('x=4')} and a minimum point ${T('\\left(2,\\ \\frac14\\right)')}. Sketch ${T('y=f(x)')} and find ${T('f(x)')}.`
    : `<b>Example 6(b):</b> ${T('y=\\frac{1}{f(x)}')} has a maximum point ${T('\\left(-2,\\ \\frac13\\right)')} and a ${T('y')}-intercept of ${T('\\frac15')}. Find ${T('f(x)')}; why are there no vertical asymptotes?`,
  make(stage, v, ex) {
    const P = panel(stage, ex), rows = h('div', 'u7l7-rows u7l7-rows-s'); P.appendChild(rows);
    const ring = (G) => glowRing(G.layers.top);
    if (v === 'a') {
      const Q = F6, G = buildG(stage, FIGS.e6.win), rg = ring(G);
      const A = [asym(G, 0), asym(G, 4)]; rGraph(G, Q);
      G.point(2, 0.25, { color: AC, r: 7.5, label: T('\\left(2,\\ \\frac14\\right)'), pos: 'n' });
      const z = [0, 4].map((x) => hide(G.point(x, 0, { color: 'amber', r: 8, label: T(`(${x},\\ 0)`), pos: x ? 'se' : 'sw' })));
      const vt = hide(G.point(2, 0.25, { color: FC, r: 8.5, label: T('(2,\\ 4)'), pos: 'ne' }));
      const fc = hide(fGraph(G, Q, { width: 4 }));
      const r = [row(rows, 1, `asymptotes → zeros ${T('0')}, ${T('4')}`), row(rows, 2, `${T('\\left(2,\\ \\frac14\\right)\\to\\left(2,\\ \\frac{1}{1/4}\\right)=(2,\\ 4)')}`), row(rows, 3, `${T('f(x)=a(x-2)^2+4')}<br>${T('f(0)=0')}: ${T('4a+4=0')}, ${T('a=-1')}`), row(rows, 4, `${T('f(x)=-(x-2)^2+4=-x^2+4x')}`)];
      return [
        { cap: `<b>1</b> Each vertical asymptote of the reciprocal is at a <b>zero</b> of ${T('f')}: ${T('x=0')} and ${T('x=4')} give the points ${T('(0,\\ 0)')} and ${T('(4,\\ 0)')} on the parabola.`,
          run: async (c) => { await show(c, r[0]); await Promise.all(A.map((L) => pulse(c, L, 1.02))); for (const p of z) await popP(c, p); } },
        { cap: `<b>2</b> The turning point ${T('\\left(2,\\ \\frac14\\right)')} gives the vertex ${T('\\left(2,\\ \\frac{1}{1/4}\\right)=(2,\\ 4)')}. A <b>minimum</b> of the reciprocal comes from a <b>maximum</b> of ${T('f')}: it opens down.`,
          run: async (c) => { await show(c, r[1]); unhide(vt); await G.move(c, vt, 2, 4, 1100); placeRing(rg, G, 2, 4); } },
        { cap: `<b>3</b> Vertex form: ${T('f(x)=a(x-2)^2+4')}. Use a zero: ${T('f(0)=0')}, so ${T('a(0-2)^2+4=0')}, ${T('4a+4=0')}, ${T('a=-1')}.`,
          run: async (c) => { placeRing(rg, G, 0, 0, false); await show(c, r[2]); } },
        { cap: `<b>4</b> ${T('f(x)=-(x-2)^2+4=-x^2+4x')}: the parabola through ${T('(0,\\ 0)')}, ${T('(2,\\ 4)')} and ${T('(4,\\ 0)')}.`,
          run: async (c) => { await show(c, r[3]); await drawIn(unhide(fc), 900, c); } }
      ];
    }
    const Q = vq(0.5, -2, 3), G = buildG(stage, { xmin: -6.5, xmax: 2.5, ymin: -1.5, ymax: 7.5 }), rg = ring(G);
    rGraph(G, Q);
    G.point(-2, 1 / 3, { color: AC, r: 7.5, label: T('\\left(-2,\\ \\frac13\\right)'), pos: 'nw' }); G.point(0, 0.2, { color: AC, r: 7.5, label: T('\\left(0,\\ \\frac15\\right)'), pos: 'se' });
    const vt = hide(G.point(-2, 1 / 3, { color: FC, r: 8.5, label: T('(-2,\\ 3)'), pos: 'w' })), yp = hide(G.point(0, 0.2, { color: FC, r: 8.5, label: T('(0,\\ 5)'), pos: 'e' }));
    const fc = hide(fGraph(G, Q, { width: 4 }));
    const sp = stamp(P, 'no zeros', { ok: null, size: 'sm' }); hide(sp);
    const r = [row(rows, 1, `max ${T('\\left(-2,\\ \\frac13\\right)\\to')} vertex ${T('(-2,\\ 3)')}, ${T('a>0')}`), row(rows, 2, `${T('y')}-int ${T('\\frac15\\to f(0)=5')}`), row(rows, 3, `${T('f(x)=a(x+2)^2+3')}<br>${T('5=4a+3')}, ${T('a=\\frac12')}`), row(rows, 4, `${T('f(x)=\\frac12(x+2)^2+3=\\frac12x^2+2x+5')}`), row(rows, 5, `${T('f(x)\\ge3')}: no zeros, no vertical asymptotes`)];
    return [
      { cap: `<b>1</b> A <b>maximum</b> of the reciprocal comes from a <b>minimum</b> of ${T('f')}: the vertex is ${T('\\left(-2,\\ \\frac{1}{1/3}\\right)=(-2,\\ 3)')}, and ${T('a>0')}.`,
        run: async (c) => { await show(c, r[0]); unhide(vt); await G.move(c, vt, -2, 3, 1100); placeRing(rg, G, -2, 3); } },
      { cap: `<b>2</b> The ${T('y')}-intercept ${T('\\frac15')} of the reciprocal gives ${T('f(0)=5')}.`,
        run: async (c) => { placeRing(rg, G, 0, 0, false); await show(c, r[1]); unhide(yp); await G.move(c, yp, 0, 5, 1100); } },
      { cap: `<b>3</b> ${T('f(x)=a(x+2)^2+3')} and ${T('f(0)=5')}: ${T('a(0+2)^2+3=5')}, ${T('4a=2')}, ${T('a=\\frac12')}.`,
        run: async (c) => { await show(c, r[2]); } },
      { cap: `<b>4</b> ${T('f(x)=\\frac12(x+2)^2+3=\\frac12x^2+2x+5')}.`,
        run: async (c) => { await show(c, r[3]); await drawIn(unhide(fc), 900, c); } },
      { cap: `<b>5</b> The parabola opens up from a vertex <b>above</b> the ${T('x')}-axis, so ${T('f(x)\\ge3')} is never ${T('0')}: no zeros, so the reciprocal has <b>no vertical asymptotes</b>.`,
        run: async (c) => { await show(c, r[4]); await stampIn(c, unhide(sp)); } }
    ];
  }
};

/* =============================== explainer: matching (Example 8) =============================== */
const MF = [
  { n: '(i)', f: 'x^2-1', Q: MQ.C, ans: 'C' },
  { n: '(ii)', f: '(x-1)^2', Q: MQ.B, ans: 'B' },
  { n: '(iii)', f: 'x^2+1', Q: MQ.D, ans: 'D' },
  { n: '(iv)', f: '4-x^2', Q: MQ.A, ans: 'A' }
];
const match = {
  title: 'Match each function with its reciprocal graph',
  height: 444, minW: 880, capH: 104,
  ask: () => `<b>Example 8:</b> match each function with the graph of its reciprocal ${T('y=\\frac{1}{f(x)}')}. Give one reason for each match.`,
  make(stage, v, ex) {
    const W = ex.W, GS = 212, gx0 = W - 2 * GS - 14, cards = {}, gr = {};
    const svg = svgEl('svg', { class: 'u7l7-msvg', width: W, height: 444, style: 'position:absolute;left:0;top:0;pointer-events:none;overflow:visible' }, stage);
    const fW = gx0 - 70;
    MF.forEach((m, i) => {
      const el = div(stage, 'u7l7-mfn', `<span class="u7l7-ml">${m.n}</span>${T('f(x)=' + m.f)}<span class="u7l7-mres"></span>`, 0, 10 + i * 108, fW, 92);
      const why = h('div', 'u7l7-why'); why.style.position = 'absolute'; why.style.left = '0px'; why.style.top = (10 + i * 108 + 94) + 'px'; why.style.width = fW + 'px';
      cards[m.ans] = { el, i, m };
      void why;
    });
    ['A', 'B', 'C', 'D'].forEach((k, j) => {
      const x = gx0 + (j % 2) * (GS + 14), y = Math.floor(j / 2) * (GS + 8) + 4;
      const host = div(stage, 'u7l7-mg', '', x, y, GS, GS);
      div(host, 'u7l7-mgl', k);
      const G = new Graph(host, { width: GS - 6, height: GS - 6, xmin: -3.5, xmax: 3.5, ymin: -3.5, ymax: 3.5, xlabels: 2, ylabels: 2, fontSize: 11 });
      MQ[k].z.forEach((z) => asym(G, z, { color: COLORS.gray, width: 2 })); rGraph(G, MQ[k], { width: 3.5 });
      gr[k] = { host, x, y };
    });
    const mark = (ks, cls) => ['A', 'B', 'C', 'D'].forEach((k) => { gr[k].host.classList.remove('cand', 'pick', 'no'); if (cls && ks.includes(k)) gr[k].host.classList.add(cls); });
    const done = [];
    const keep = () => done.forEach((k) => gr[k].host.classList.add('pick'));
    const link = (m) => {
      const cd = cards[m.ans], g = gr[m.ans], y1 = 10 + cd.i * 108 + 46, x1 = fW + 6, x2 = g.x - 4, y2 = g.y + GS / 2;
      const ln = svgEl('path', { d: `M${x1} ${y1} C ${x1 + 60} ${y1}, ${x2 - 60} ${y2}, ${x2} ${y2}`, fill: 'none', stroke: COLORS.green, 'stroke-width': 4, 'stroke-linecap': 'round', class: 'bk-curve' }, svg);
      return ln;
    };
    const lines = {}; MF.forEach((m) => { lines[m.ans] = hide(link(m)); });
    const on = (m) => { Object.values(cards).forEach((cd) => cd.el.classList.toggle('on', cd.m === m)); };
    const finish = async (c, m) => { const cd = cards[m.ans]; cd.el.querySelector('.u7l7-mres').textContent = m.ans; await pop(c, cd.el.querySelector('.u7l7-mres')); unhide(lines[m.ans]); await drawIn(lines[m.ans], 600, c); done.push(m.ans); mark([], null); keep(); };
    return [
      { cap: `(i) ${T('f(x)=x^2-1')} has zeros ${T('\\pm1')}: <b>two</b> vertical asymptotes. Two graphs have two asymptotes: <b>A</b> and <b>C</b>.`,
        run: async (c) => { on(MF[0]); mark(['A', 'C'], 'cand'); await pulse(c, gr.A.host, 1.03); await pulse(c, gr.C.host, 1.03); } },
      { cap: `Which one? The asymptotes of C are at ${T('x=\\pm1')}, and between them ${T('f(x)<0')}, so the middle branch is <b>below</b> the axis, with a maximum at the invariant point ${T('(0,\\ -1)')}. <b>(i) is C.</b>`,
        run: async (c) => { mark(['C'], 'pick'); gr.A.host.classList.add('no'); await finish(c, MF[0]); } },
      { cap: `(ii) ${T('f(x)=(x-1)^2')} has <b>one</b> zero, ${T('1')}: one asymptote ${T('x=1')}, and ${T('f\\ge0')}, so both branches are above the axis. <b>(ii) is B.</b>`,
        run: async (c) => { on(MF[1]); mark(['B'], 'cand'); await sleep(c, 400); await finish(c, MF[1]); } },
      { cap: `(iii) ${T('f(x)=x^2+1')} has <b>no</b> zeros: no asymptote, one unbroken curve, with a maximum at ${T('(0,\\ 1)')}. <b>(iii) is D.</b>`,
        run: async (c) => { on(MF[2]); mark(['D'], 'cand'); await sleep(c, 400); await finish(c, MF[2]); } },
      { cap: `(iv) ${T('f(x)=4-x^2')}: zeros ${T('\\pm2')}, and it opens down with vertex ${T('(0,\\ 4)')}, so the middle branch is <b>above</b> the axis with a minimum point ${T('\\left(0,\\ \\frac14\\right)')}. <b>(iv) is A.</b>`,
        run: async (c) => { on(MF[3]); mark(['A'], 'cand'); await sleep(c, 400); await finish(c, MF[3]); on(null); } }
    ];
  }
};

/* =============================== Stand Up Break =============================== */
/* BEG: the number of vertical asymptotes and their equations. PRG: the turning point, its type, the domain and the range
 * from vertex form. MAS: work backwards from the reciprocal's turning point and y-intercept to f. */
const polyT = (A, B, C) => {
  const term = (k, s, first) => { if (!k) return ''; const sg = k < 0 ? '-' : first ? '' : '+', m = Math.abs(k); return sg + (m === 1 && s ? '' : String(m)) + s; };
  const out = term(A, 'x^2', true) + term(B, 'x', !A) + term(C, '', !A && !B);
  return out || '0';
};
const vertT = (a, p, q) => `${a === 1 ? '' : a === -1 ? '-' : a}${p ? `(x${p > 0 ? '-' : '+'}${Math.abs(p)})^2` : 'x^2'}${q ? (q > 0 ? '+' : '-') + Math.abs(q) : ''}`;
standup('u7l7', {
  intro: 'At your whiteboard: zeros give asymptotes, and the vertex (p, q) gives the turning point (p, 1/q).',
  levels: {
    BEG: (r) => {
      const kind = r.pick([2, 2, 1, 0]);
      if (kind === 2) { const s = r.int(-6, 6), t = r.int(-6, 6); if (s === t) return standupBEG(r); const lo = Math.min(s, t), hi = Math.max(s, t);
        return { text: 'State the number of vertical asymptotes of the graph of y = 1/f(x) and their equations.', q: `f(x)=${polyT(1, -(s + t), s * t)}`, a: [`${polyT(1, -(s + t), s * t)}=(x${-lo >= 0 ? '+' : '-'}${Math.abs(lo)})(x${-hi >= 0 ? '+' : '-'}${Math.abs(hi)})`.replace(/\(x\+0\)/g, 'x').replace(/\(x-0\)/g, 'x'), `\\text{Two: }x=${lo}\\text{ and }x=${hi}`] }; }
      if (kind === 1) { const s = r.int(-5, 5) || 3; return { text: 'State the number of vertical asymptotes of the graph of y = 1/f(x) and their equations.', q: `f(x)=${polyT(1, -2 * s, s * s)}`, a: [`${polyT(1, -2 * s, s * s)}=(x${s > 0 ? '-' : '+'}${Math.abs(s)})^2`, `\\text{One: }x=${s}`] }; }
      const b = r.pick([-4, -2, 2, 4, 6]), c = b * b / 4 + r.int(1, 5);
      return { text: 'State the number of vertical asymptotes of the graph of y = 1/f(x) and their equations.', q: `f(x)=${polyT(1, b, c)}`, a: [`b^2-4ac=${b * b}-${4 * c}=${b * b - 4 * c}<0`, '\\text{None: no zeros}'] };
    },
    PRG: (r) => {
      const a = r.pick([1, -1, 2, -2]), p = r.int(-4, 4), zeros = r.chance(0.5), dd = r.pick([1, 2, 3]);
      const q = zeros ? -a * dd * dd : a * r.pick([1, 2, 3, 4, 5]) * (a > 0 ? 1 : 1) / Math.abs(a) * Math.abs(a);
      const qq = zeros ? q : (a > 0 ? 1 : -1) * r.pick([1, 2, 3, 4, 5]);
      const up = a > 0, tpY = fr(1, qq), type = up ? '\\text{maximum}' : '\\text{minimum}';
      const dom = zeros ? `\\{x\\mid x\\ne${p - dd},\\ x\\ne${p + dd},\\ x\\in\\mathbb{R}\\}` : '\\{x\\mid x\\in\\mathbb{R}\\}';
      const rng = up ? (qq > 0 ? `0<y\\le${tpY}` : `y\\le${tpY}\\text{ or }y>0`) : (qq < 0 ? `${tpY}\\le y<0` : `y<0\\text{ or }y\\ge${tpY}`);
      return { text: 'State the turning point of y = 1/f(x) (maximum or minimum), its domain and its range.', q: `f(x)=${vertT(a, p, qq)}`,
        a: [`${type}\\ \\left(${p},\\ ${tpY}\\right)`, `\\text{domain }${dom}`, `\\text{range }\\left\\{y\\mid ${rng},\\ y\\in\\mathbb{R}\\right\\}`] };
    },
    MAS: (r) => {
      for (;;) {
        const p = r.pick([-3, -2, -1, 1, 2, 3]), a = r.pick([1, 2, 3, -1, -2]), q = (a > 0 ? 1 : -1) * r.pick([1, 2, 3, 4, 5]), c = a * p * p + q;
        if (!c) continue;
        const type = a > 0 ? 'maximum' : 'minimum';
        return { text: `The graph of y = 1/f(x), where f is quadratic, has a ${type} point and a y-intercept as shown. Determine f(x) in vertex form and in general form.`, q: `\\left(${p},\\ ${fr(1, q)}\\right),\\quad y\\text{-intercept } ${fr(1, c)}`,
          a: [`\\text{vertex }(${p},\\ ${q}),\\ f(0)=${c}`, `${c}=a(${-p})^2${q > 0 ? '+' : '-'}${Math.abs(q)}\\Rightarrow a=${a}`, `f(x)=${vertT(a, p, q)}=${polyT(a, -2 * a * p, c)}`] };
      }
    }
  }
});
function standupBEG(r) { const s = r.int(1, 5); return { text: 'State the number of vertical asymptotes of the graph of y = 1/f(x) and their equations.', q: `f(x)=${polyT(1, 0, -s * s)}`, a: [`x^2=${s * s}`, `\\text{Two: }x=-${s}\\text{ and }x=${s}`] }; }

/* =============================== mount =============================== */
export const explainers = mountExplainers({ trace, slide, range, sketch, back, match });
export const _test = { quad, vq, rangeParts, recT, valT, solveK, SL, RG, SK };
