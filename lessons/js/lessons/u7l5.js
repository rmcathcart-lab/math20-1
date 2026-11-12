/* Math 20-1 · Unit 7 · Lesson 5 — Solving Absolute Value Equations (Quadratic).
 * New lesson format (2026-11-11): the warm-up ("The Mountain Monk") is plain markup on the page (no code).
 * Card figures: the grids on the page are drawn here from the real functions ([data-fig]); the answer layer (class
 * u7l5-ans) shows when its part's Answer is revealed.
 * Explainers:
 *   cases  (procedure, numbered: isolate, k > 0?, Case 1 on the line y = k, Case 2 on the line y = −k (or it misses the
 *           parabola), then the part below the x-axis folds up and the Case 2 points ride up to y = k: every solution is
 *           where the W meets y = k; Examples 1(b), 2(a)–(d), 3(a), 3(b), 4(b)),
 *   slide  (STAR, hands-on: the horizontal line y = k slides up through the W while the number of solutions (0, 2, 4, 3, 2)
 *           and the x-values update live, and the column of the key-idea table lights up; the class can drag the line or
 *           the slider; Example 4(a), Examples 1 and 3, Example 2(d) (no crossing: 0, 1, 2)),
 *   sieve  (extraneous: the candidate roots of both cases hover over a number line; the stretch where the right side B is
 *           negative is a trapdoor; the candidates drop, the ones in the red zone fall through as extraneous, and the
 *           graph confirms the two real meeting points; Example 5(a), (b)),
 *   tub    (Example 7: subdomain bands on the graph of y = |x − 3| + |x + 1|, drawn one piece per subdomain in its colour
 *           while the work for that subdomain appears; the flat piece 4 never reaches y = 6),
 *   drone  (Example 8: the two cases on the lines h = 13 and h = 7, then the drone flies while its height graph is
 *           traced and the camera's REC light comes on inside 7 ≤ h ≤ 13).
 * Colours (Unit 7, as in Lesson 2): y = f(x) blue; y = |f(x)| (the W) red; the line y = k purple; the hump top amber;
 *   solutions green; extraneous red stamps; subdomains purple / amber / teal. */
import {
  h, tex, add, box, Graph, NumberLine, mountExplainers, pop, fadeIn, anim, sleep, tween, svgEl, pulse, shake, linear,
  COLORS, texNum, drawIn, stamp, stampIn
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const FC = COLORS.blue, AC = COLORS.red, VC = COLORS.amber, KC = COLORS.purple, OK = COLORS.green, INK = COLORS.slate, GR = '#8d93a0';
const S1 = '#7b4fc4', S2 = '#c27a0e', S3 = '#0e8a9a', OR = '#d9730d';
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; if (el && el.label) el.label.style.opacity = 0; return el; };
const unhide = (el) => { if (el) el.style.opacity = ''; if (el && el.label) el.label.style.opacity = ''; return el; };
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
const popP = (c, p) => Promise.all([pop(c, unhide(p)), p.label ? show(c, unhide(p.label)) : null]);
const n2 = (v) => (Math.abs(v) < 5e-3 ? '0' : v.toFixed(2)).replace('-', '−');
/* a numbered row for step-by-step procedures (the step number beside each step as it appears) */
const row = (host, n, html) => { const r = h('div', 'u7l5-row', `<span class="u7l5-n">${n}</span><div class="u7l5-rc">${html}</div>`); r.style.opacity = 0; host.appendChild(r); return r; };
const quad = ([a, b, c]) => (x) => a * x * x + b * x + c;
/* the real roots of ax² + bx + c = 0 (a double root once), smallest first */
function roots(a, b, c) {
  const d = b * b - 4 * a * c;
  if (d < -1e-9) return [];
  if (Math.abs(d) <= 1e-9) return [-b / (2 * a)];
  const s = Math.sqrt(d); return [(-b - s) / (2 * a), (-b + s) / (2 * a)].sort((p, q) => p - q);
}
/* the solutions of |ax² + bx + c| = k */
function solveAbs([a, b, c], k) {
  if (k < -1e-9) return [];
  if (Math.abs(k) <= 1e-9) return roots(a, b, c);
  const out = [...roots(a, b, c - k), ...roots(a, b, c + k)].sort((p, q) => p - q);
  return out.filter((v, i) => i === 0 || Math.abs(v - out[i - 1]) > 1e-7);
}

/* =============================== card figures =============================== */
const W1 = quad([1, -2, -3]);
const FIGS = {
  ex1: { w: 330, h: 440, win: { xmin: -3.5, xmax: 5.5, ymin: -4.5, ymax: 8.5 }, draw(G) {
    G.fn(W1, { from: -1, to: 3, color: GR, width: 2.5, dash: '8 7', arrows: false });
    G.fn((x) => Math.abs(W1(x)), { color: INK, width: 4 });
    G.label(1, 7, T('y=|x^2-2x-3|'), { cls: 'bk-ptlab' });
  }, ans: (G) => [G.hline(5, { color: KC, width: 3, dash: false }), G.point(-2, 5, { color: 'red', r: 7 }), G.point(4, 5, { color: 'red', r: 7 })] },
  ex3: { w: 330, h: 300, win: { xmin: -3.5, xmax: 5.5, ymin: -1.5, ymax: 6.5 }, draw(G) {
    G.fn((x) => Math.abs(W1(x)), { color: INK, width: 4 });
  }, ans: (G) => [G.hline(2, { color: KC, width: 3, dash: false }), G.hline(4, { color: KC, width: 3, dash: false }),
    G.label(-3.3, 2, T('y=2'), { cls: 'bk-ptlab', pos: 'ne', color: KC }), G.label(-3.3, 4, T('y=4'), { cls: 'bk-ptlab', pos: 'ne', color: KC })] }
};
function buildFigs() {
  document.querySelectorAll('.u7l5 [data-fig]').forEach((el) => {
    if (el.dataset.built) return; el.dataset.built = '1';
    if (el.dataset.fig === 'ex7') {
      const N = new NumberLine(el, { width: 620, height: 104, min: -4, max: 6, step: 1, numbers: false, labels: [{ v: -1, html: T('-1') }, { v: 3, html: T('3') }] });
      N.point(-1, { color: INK }); N.point(3, { color: INK });
      N.mark(-2.6, T('x<-1'), { lift: 4 }); N.mark(1, T('-1\\le x<3'), { lift: 4 }); N.mark(4.6, T('x\\ge3'), { lift: 4 });
      return;
    }
    const f = FIGS[el.dataset.fig]; if (!f) return;
    const G = new Graph(el, Object.assign({ width: f.w, height: f.h, fontSize: 15, fnArrows: true }, f.win));
    if (f.draw) f.draw(G);
    if (f.ans) (f.ans(G) || []).forEach((e) => { if (e) { e.classList.add('u7l5-ans'); if (e.label) e.label.classList.add('u7l5-ans'); } });
  });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', buildFigs); else buildFigs();

/* =============================== explainer: the two cases (procedure, numbered) =============================== */
const CS = {
  e1b: { q: [1, -2, -3], k: 5, eq: '|x^2-2x-3|=5', win: { xmin: -3.5, xmax: 5.5, ymin: -6.5, ymax: 8.5, ylabels: 2 }, ex: '1(b)',
    c1: 'x^2-2x-3=5\\Rightarrow x^2-2x-8=0', c1b: '(x-4)(x+2)=0\\Rightarrow x=4,\\ -2', L1: ['-2', '4'],
    c2: 'x^2-2x-3=-5\\Rightarrow x^2-2x+2=0', c2b: 'b^2-4ac=4-8=-4<0', sol: 'x=-2\\text{ or }x=4' },
  e2a: { q: [1, 0, -10], k: 6, eq: '|x^2-10|=6', win: { xmin: -5.5, xmax: 5.5, ymin: -10.5, ymax: 8.5, ylabels: 2 }, ex: '2(a)',
    c1: 'x^2-10=6\\Rightarrow x^2=16', c1b: 'x=\\pm4', L1: ['-4', '4'], c2: 'x^2-10=-6\\Rightarrow x^2=4', c2b: 'x=\\pm2', L2: ['-2', '2'], sol: 'x=-4,\\ -2,\\ 2,\\ 4' },
  e2b: { q: [1, 2, -4], k: 4, eq: '|x^2+2x-4|=4', win: { xmin: -5.5, xmax: 3.5, ymin: -6.5, ymax: 6.5 }, ex: '2(b)',
    c1: 'x^2+2x-4=4\\Rightarrow x^2+2x-8=0', c1b: '(x+4)(x-2)=0\\Rightarrow x=-4,\\ 2', L1: ['-4', '2'],
    c2: 'x^2+2x-4=-4\\Rightarrow x^2+2x=0', c2b: 'x(x+2)=0\\Rightarrow x=0,\\ -2', L2: ['-2', '0'], sol: 'x=-4,\\ -2,\\ 0,\\ 2' },
  e2c: { q: [1, -5, 0], k: 6, eq: '2|x^2-5x|-3=9', iso: '2|x^2-5x|=12\\Rightarrow|x^2-5x|=6', win: { xmin: -2.5, xmax: 7.5, ymin: -7.5, ymax: 8.5, ylabels: 2 }, ex: '2(c)',
    c1: 'x^2-5x=6\\Rightarrow x^2-5x-6=0', c1b: '(x-6)(x+1)=0\\Rightarrow x=6,\\ -1', L1: ['-1', '6'],
    c2: 'x^2-5x=-6\\Rightarrow x^2-5x+6=0', c2b: '(x-2)(x-3)=0\\Rightarrow x=2,\\ 3', L2: ['2', '3'], sol: 'x=-1,\\ 2,\\ 3,\\ 6' },
  e2d: { q: [1, 0, 4], k: 2, eq: '|x^2+4|=2', win: { xmin: -4.5, xmax: 4.5, ymin: -4.5, ymax: 8.5 }, ex: '2(d)',
    c1: 'x^2+4=2\\Rightarrow x^2=-2', c1b: '\\text{no real roots}', c2: 'x^2+4=-2\\Rightarrow x^2=-6', c2b: '\\text{no real roots}', sol: '\\text{no solution}' },
  e3a: { q: [1, -2, -3], k: 2, eq: '|x^2-2x-3|=2', win: { xmin: -3.5, xmax: 5.5, ymin: -4.5, ymax: 6.5 }, ex: '3(a)',
    c1: 'x^2-2x-3=2\\Rightarrow x^2-2x-5=0', c1b: 'x=\\frac{2\\pm\\sqrt{24}}{2}=\\frac{2\\pm2\\sqrt6}{2}=1\\pm\\sqrt6', L1: ['1-\\sqrt6', '1+\\sqrt6'],
    c2: 'x^2-2x-3=-2\\Rightarrow x^2-2x-1=0', c2b: 'x=\\frac{2\\pm\\sqrt8}{2}=\\frac{2\\pm2\\sqrt2}{2}=1\\pm\\sqrt2', L2: ['1-\\sqrt2', '1+\\sqrt2'],
    sol: 'x=1\\pm\\sqrt6\\text{ or }x=1\\pm\\sqrt2', dec: 'x\\approx-1.45,\\ -0.41,\\ 2.41,\\ 3.45' },
  e3b: { q: [1, -2, -3], k: 4, eq: '|x^2-2x-3|=4', win: { xmin: -3.5, xmax: 5.5, ymin: -4.5, ymax: 6.5 }, ex: '3(b)',
    c1: 'x^2-2x-3=4\\Rightarrow x^2-2x-7=0', c1b: 'x=\\frac{2\\pm\\sqrt{32}}{2}=1\\pm2\\sqrt2', L1: ['1-2\\sqrt2', '1+2\\sqrt2'],
    c2: 'x^2-2x-3=-4\\Rightarrow x^2-2x+1=0', c2b: '(x-1)^2=0\\Rightarrow x=1\\ (\\text{double root})', L2: ['1'], sol: 'x=1-2\\sqrt2,\\ 1,\\ 1+2\\sqrt2' },
  e4b: { q: [1, -6, 5], k: 7, eq: '|x^2-6x+5|=7', win: { xmin: -1.5, xmax: 7.5, ymin: -8.5, ymax: 9.5, ylabels: 2 }, ex: '4(b)',
    c1: 'x^2-6x+5=7\\Rightarrow x^2-6x-2=0', c1b: 'x=\\frac{6\\pm\\sqrt{44}}{2}=\\frac{6\\pm2\\sqrt{11}}{2}=3\\pm\\sqrt{11}', L1: ['3-\\sqrt{11}', '3+\\sqrt{11}'],
    c2: 'x^2-6x+5=-7\\Rightarrow x^2-6x+12=0', c2b: 'b^2-4ac=36-48<0', sol: 'x=3\\pm\\sqrt{11}', dec: 'x\\approx-0.32,\\ 6.32' }
};
const CS_ASK = {
  e1b: `<b>Example 1(b):</b> solve ${T('|x^2-2x-3|=5')} algebraically.`,
  e3a: `<b>Example 3(a):</b> solve ${T('|x^2-2x-3|=2')}. Exact answers and answers to the nearest hundredth.`,
  e3b: `<b>Example 3(b):</b> solve ${T('|x^2-2x-3|=4')} exactly. Why are there only three solutions?`,
  e4b: `<b>Example 4(b):</b> solve ${T('|x^2-6x+5|=7')} and confirm the number of solutions.`
};
const cases = {
  title: 'Two cases: f(x) = k and f(x) = −k',
  height: 444, minW: 880, capH: 96,
  choices: [{ v: 'e1b', label: 'Example 1(b)' }, { sep: 'Example 2:' }, { v: 'e2a', label: '(a)' }, { v: 'e2b', label: '(b)' }, { v: 'e2c', label: '(c)' }, { v: 'e2d', label: '(d)' },
    { sep: 'Example 3:' }, { v: 'e3a', label: '(a)' }, { v: 'e3b', label: '(b)' }, { v: 'e4b', label: 'Example 4(b)' }],
  ask: (v) => CS_ASK[v] || `<b>Example ${CS[v].ex}:</b> solve ${T(CS[v].eq)} algebraically.`,
  make(stage, v, ex) {
    const d = CS[v], W = ex.W, GW = 430, PX = GW + 22, PW = W - PX, f = quad(d.q), k = d.k;
    const G = new Graph(stage, Object.assign({ x: 0, y: 20, width: GW, height: 422, fontSize: 15 }, d.win));
    const P = div(stage, 'u7l5-pn', '', PX, 0, PW), rows = h('div', 'u7l5-rows'); P.appendChild(rows);
    const fT = d.eq.replace(/^2\|/, '|').replace(/\|=.*$/, '').replace(/^\|/, '');
    const fTex = v === 'e2c' ? 'x^2-5x' : fT;
    const r1 = roots(d.q[0], d.q[1], d.q[2] - k), r2 = roots(d.q[0], d.q[1], d.q[2] + k);
    const below = roots(...d.q).length === 2;
    /* the parabola (blue), its dashed ghost, and the folding curve (red) */
    const S = { u: 0 };
    const par = G.fn(f, { color: FC, width: 4 });
    const ghost = hide(G.fn(f, { color: FC, width: 2.5, dash: '8 7', arrows: false }));
    const mv = hide(G.fn((x) => { const y = f(x); return y >= 0 ? y : y * (1 - 2 * S.u); }, { color: AC, width: 4.5 }));
    const xr = d.win.xmax - 0.2, xm = (d.win.xmin + d.win.xmax) / 2, ym = d.win.ymax - 0.4;
    const fl = G.label(xm, ym, T('y=' + fTex), { cls: 'bk-ptlab', pos: 's', color: FC });
    const lk = hide(G.hline(k, { color: KC, width: 3, dash: false })), lnk = hide(G.hline(-k, { color: KC, width: 3, dash: '9 7' }));
    const lkL = hide(G.label(xr, k, T('y=' + k), { cls: 'bk-ptlab', pos: 'sw', color: KC })), lnkL = hide(G.label(xr, -k, T('y=-' + k), { cls: 'bk-ptlab', pos: 'nw', color: KC }));
    const wl = hide(G.label(xm, ym, T('y=|' + fTex + '|'), { cls: 'bk-ptlab', pos: 's', color: AC }));
    const mk = (x, y, lab, pos) => hide(G.point(x, y, { color: 'green', r: 7.5, label: T(lab), pos }));
    const p1 = r1.map((x, i) => mk(x, k, (d.L1 || [])[i] || texNum(x), 'n'));
    const p2 = r2.map((x, i) => mk(x, -k, (d.L2 || [])[i] || texNum(x), r2.length === 1 ? 'n' : 's'));
    const drops = [...r1.map((x) => [x, k]), ...r2.map((x) => [x, -k])].map(([x, y]) => hide(G.segment([x, 0], [x, y], { color: OK, width: 2, dash: '5 5' })));
    const R = [];
    R.push(row(rows, 1, d.iso ? `isolate: ${T(d.iso)}` : `${T(d.eq)}: already isolated`));
    R.push(row(rows, 2, `${T('k=' + k + '>0')}: solve ${T(fTex + '=' + k)} <b>and</b> ${T(fTex + '=-' + k)}`));
    R.push(row(rows, 3, `<b>Case 1:</b> ${T(d.c1)}<br>${T(d.c1b)}`));
    R.push(row(rows, 4, `<b>Case 2:</b> ${T(d.c2)}<br>${T(d.c2b)}${r2.length ? '' : `: ${v === 'e2d' ? '' : 'no real roots'}`}`.replace(/: $/, '')));
    R.push(row(rows, 5, `<b>Solutions:</b> ${T(d.sol)}${d.dec ? `<br>${T(d.dec)}` : ''}`));
    const n1 = r1.length, n2_ = r2.length, tot = n1 + n2_;
    const word = (n) => (n === 0 ? 'no real roots' : n === 1 ? 'one root (a double root)' : 'two roots');
    return [
      { cap: d.iso ? `<b>1</b> Isolate the absolute value first: subtract ${T('3')}, then divide by ${T('2')}. Now it is ${T('|x^2-5x|=6')}.`
        : `<b>1</b> The absolute value is already on its own: ${T(d.eq)}. The blue curve is the parabola ${T('y=' + fTex)}.`,
        run: (c) => show(c, R[0]) },
      { cap: `<b>2</b> ${T('k=' + k)} is positive, so there are <b>two cases</b>: the inside equals ${T(String(k))} or ${T('-' + k)}. On the graph: the lines ${T('y=' + k)} and ${T('y=-' + k)}.`,
        run: async (c) => { await show(c, R[1]); await Promise.all([drawIn(unhide(lk), 600, c), drawIn(unhide(lnk), 600, c)]); await Promise.all([show(c, unhide(lkL)), show(c, unhide(lnkL))]); } },
      { cap: n1 ? `<b>3</b> Case 1, ${T(fTex + '=' + k)}: standard form, then ${/sqrt/.test(d.c1b) ? 'the quadratic formula' : 'solve'}. ${n1 === 2 ? 'Two roots' : 'One root'}: where the parabola meets ${T('y=' + k)}.`
        : `<b>3</b> Case 1, ${T(fTex + '=' + k)}: ${T(d.c1.split('\\Rightarrow')[1])} has <b>no real roots</b>. The parabola never comes down to ${T('y=' + k)}.`,
        run: async (c) => { await show(c, R[2]); if (!n1) { await shake(c, lk); return; } await Promise.all(p1.map((p) => popP(c, p))); await Promise.all(drops.slice(0, n1).map((s) => drawIn(unhide(s), 400, c))); } },
      { cap: n2_ ? `<b>4</b> Case 2, ${T(fTex + '=-' + k)}: ${word(n2_)}, where the parabola meets ${T('y=-' + k)}${n2_ === 1 ? ' at its vertex' : ''}.`
        : `<b>4</b> Case 2, ${T(fTex + '=-' + k)}: <b>no real roots</b>. The line ${T('y=-' + k)} misses the parabola${below ? ': it is below the vertex' : ''}.`,
        run: async (c) => { await show(c, R[3]); if (!n2_) { await shake(c, lnk); return; } await Promise.all(p2.map((p) => popP(c, p))); await Promise.all(drops.slice(n1).map((s) => drawIn(unhide(s), 400, c))); } },
      { cap: below ? `<b>5</b> Fold the part below the ${T('x')}-axis up to get ${T('y=|' + fTex + '|')}: the Case 2 points ride up to ${T('y=' + k)}. Every solution is where the W meets ${T('y=' + k)}: <b>${tot}</b> in all.`
        : `<b>5</b> Nothing is below the ${T('x')}-axis, so ${T('|' + fTex + '|=' + fTex)}: the graph does not change, and it never comes down to ${T('y=' + k)}. <b>No solution.</b>`,
        run: async (c) => {
          await show(c, R[4]);
          hide(par); hide(fl); unhide(ghost); unhide(mv); await show(c, unhide(wl));
          if (!below) { S.u = 1; mv._bkDraw(); return; }
          drops.slice(n1).forEach(hide);
          await Promise.all([tween(c, 1600, (t) => { S.u = t; mv._bkDraw(); }), ...p2.map((p) => G.move(c, p, p.gx, k, 1600))]);
          p2.forEach((p) => { if (p.label) { p.label.style.opacity = 1; } });
          lnk.style.opacity = 0.25; lnkL.style.opacity = 0.25;
          await Promise.all([...p1, ...p2].map((p) => pulse(c, p, 1.3)));
        } }
    ];
  }
};

/* =============================== explainer: slide the line y = k (STAR, hands-on) =============================== */
const SL = {
  e4: { q: [1, -6, 5], fT: 'x^2-6x+5', pre: true, top: [3, 4], zeros: '1 and 5', win: { xmin: -1.5, xmax: 7.5, ymin: -3.5, ymax: 9.5 }, k0: 8.5,
    ks: [[-2, '<b>0</b> solutions: the line is <b>below</b> the x-axis, and the W never goes below the axis.'],
      [0, `<b>2</b> solutions: ${T('k=0')} gives the zeros ${T('x=1')} and ${T('x=5')}.`],
      [2, `<b>4</b> solutions: ${T('0<2<4')}, so the line crosses both outer arms and both sides of the hump.`],
      [4, `<b>3</b> solutions: ${T('k=4')} just touches the top of the hump at ${T('(3,\\ 4)')}.`],
      [7, `<b>2</b> solutions: ${T('7>4')}, so the line is above the hump and meets only the outer arms.`]],
    ask: `<b>Example 4(a):</b> ${T('|x^2-6x+5|=k')}, with ${T('x^2-6x+5=(x-3)^2-4')}. How many solutions for ${T('k=-2,\\ 0,\\ 2,\\ 4,\\ 7')}?` },
  e13: { q: [1, -2, -3], fT: 'x^2-2x-3', top: [1, 4], zeros: '−1 and 3', win: { xmin: -3.5, xmax: 5.5, ymin: -3.5, ymax: 9.5 }, k0: 8.5,
    ks: [[5, `Example 1: ${T('k=5')} is above the hump (top ${T('y=4')}): <b>2</b> solutions, ${T('x=-2')} and ${T('x=4')}.`],
      [2, `Example 3(a): ${T('k=2')} is below the top of the hump: <b>4</b> solutions, ${T('1\\pm\\sqrt6')} and ${T('1\\pm\\sqrt2')}.`],
      [4, `Example 3(b): ${T('k=4')} just touches the hump’s top ${T('(1,\\ 4)')}: <b>3</b> solutions, ${T('1\\pm2\\sqrt2')} and ${T('1')}.`]],
    ask: `<b>Examples 1 and 3:</b> how many solutions does ${T('|x^2-2x-3|=k')} have for ${T('k=5')}, ${T('k=2')} and ${T('k=4')}?` },
  e2d: { q: [1, 0, 4], fT: 'x^2+4', above: true, top: [0, 4], win: { xmin: -4.5, xmax: 4.5, ymin: -3.5, ymax: 9.5 }, k0: -1.5,
    ks: [[2, `Example 2(d): ${T('k=2')} is below the lowest point ${T('(0,\\ 4)')}: <b>0</b> solutions.`],
      [4, `${T('k=4')} touches the vertex: <b>1</b> solution, ${T('x=0')}.`],
      [6, `${T('k=6')} is above the vertex: <b>2</b> solutions, ${T('x=\\pm\\sqrt2')}.`]],
    ask: `<b>Example 2(d):</b> ${T('x^2+4')} is never below the ${T('x')}-axis. How many solutions can ${T('|x^2+4|=k')} have?` }
};
const slide = {
  title: 'Slide the line y = k through the W',
  height: 444, minW: 900, capH: 96,
  choices: [{ v: 'e4', label: 'Example 4' }, { v: 'e13', label: 'Examples 1 and 3' }, { v: 'e2d', label: 'Example 2(d)' }],
  ask: (v) => SL[v].ask,
  make(stage, v, ex) {
    const d = SL[v], W = ex.W, GW = 500, PX = GW + 22, PW = W - PX, f = quad(d.q), F = (x) => Math.abs(f(x)), win = d.win;
    const G = new Graph(stage, Object.assign({ x: 0, y: 20, width: GW, height: 422, fontSize: 15 }, win));
    G.svg.setAttribute('data-tap', ''); G.el.classList.add('u7l5-drag');
    if (!d.above) G.fn(f, { from: roots(...d.q)[0], to: roots(...d.q)[1], color: FC, width: 2.5, dash: '8 7', arrows: false });
    G.fn(F, { color: AC, width: 4.5 });
    const top = G.point(d.top[0], d.top[1], { color: 'amber', r: 8, label: T(`(${d.top[0]},\\ ${d.top[1]})`), pos: d.above ? 'se' : 'n' });
    G.label(d.top[0], win.ymax - 0.3, T('y=|' + d.fT + '|'), { cls: 'bk-ptlab', pos: 's', color: AC });
    const S = { k: d.k0 };
    const line = G.curve(() => { const py = G.toPx(0, S.k)[1], x0 = G.toPx(win.xmin, 0)[0], x1 = G.toPx(win.xmax, 0)[0]; return { subs: [[[x0, py], [x1, py]]] }; }, { color: KC, width: 4 }, 'u7l5-kline', G.layers.data);
    const hndW = svgEl('g', {}, G.layers.top), hnd = svgEl('g', { class: 'u7l5-hnd' }, hndW);
    svgEl('rect', { x: -26, y: -17, width: 52, height: 34, rx: 17, fill: KC }, hnd);
    const ht = svgEl('text', { x: 0, y: 6, 'text-anchor': 'middle', fill: '#fff', 'font-size': 17, 'font-weight': 800 }, hnd); ht.textContent = 'k';
    const dots = [0, 1, 2, 3].map(() => G.point(0, 0, { color: 'green', r: 8 }));
    /* panel: equation, live count, x-values, the key-idea table, the slider */
    const P = div(stage, 'u7l5-pn', '', PX, 0, PW);
    const eq = h('div', 'u7l5-eqbig'); P.appendChild(eq);
    const cnt = h('div', 'u7l5-cnt', '<b>0</b><span>solutions</span>'); P.appendChild(cnt);
    const xs = h('div', 'u7l5-xs'); P.appendChild(xs);
    const cols = d.above ? [['k<4', '0'], ['k=4', '1'], ['k>4', '2']] : [['k<0', '0'], ['k=0', '2'], ['0<k<4', '4'], ['k=4', '3'], ['k>4', '2']];
    const tb = h('table', 'u7l5-lt', `<tr><th>${T('k')}</th>${cols.map((c) => `<td>${T(c[0])}</td>`).join('')}</tr><tr><th>#</th>${cols.map((c) => `<td><b>${c[1]}</b></td>`).join('')}</tr>`); P.appendChild(tb);
    const sl = h('label', 'u7l5-sl no-ink', `<span class="u7l5-sll">${T('k')}</span><input type="range" min="${win.ymin + 0.5}" max="${win.ymax - 0.5}" step="0.5" aria-label="the value of k"><span class="u7l5-slv"></span>`);
    sl.setAttribute('data-tap', ''); P.appendChild(sl);
    const inp = sl.querySelector('input'), slv = sl.querySelector('.u7l5-slv'), cb = cnt.querySelector('b'), cw = cnt.querySelector('span');
    const colOf = (k) => { const e = 1e-9, q = d.top[1]; if (d.above) return k < q - e ? 0 : k <= q + e ? 1 : 2; return k < -e ? 0 : k <= e ? 1 : k < q - e ? 2 : k <= q + e ? 3 : 4; };
    let lastEq = null;
    const upd = (k) => {
      S.k = k; line._bkDraw();
      const [hx, hy] = G.toPx(win.xmax - 0.55, k); hndW.setAttribute('transform', `translate(${hx} ${hy})`);
      const sol = solveAbs(d.q, k);
      dots.forEach((p, i) => { if (i < sol.length) { G.moveTo(p, sol[i], k); p.style.opacity = ''; } else p.style.opacity = 0; });
      cb.textContent = sol.length; cw.textContent = sol.length === 1 ? 'solution' : 'solutions'; cnt.dataset.n = sol.length;
      const kr = Math.round(k * 100) / 100, ks = String(kr).replace('-', '−');
      const eqS = `|${d.fT}|=${texNum(kr, 2)}`; if (eqS !== lastEq) { eq.innerHTML = T(eqS); lastEq = eqS; }
      xs.textContent = sol.length ? 'x ≈ ' + sol.map(n2).join(',  ') : 'no x-values';
      [...tb.querySelectorAll('tr')].forEach((tr) => [...tr.querySelectorAll('td')].forEach((td, i) => td.classList.toggle('on', i === colOf(k))));
      inp.value = k; slv.textContent = ks;
    };
    const snap = (y) => { let k = Math.round(y * 2) / 2; if (Math.abs(y - d.top[1]) < 0.3) k = d.top[1]; if (Math.abs(y) < 0.3) k = 0; return Math.max(win.ymin + 0.5, Math.min(win.ymax - 0.5, k)); };
    let drag = false;
    G.svg.addEventListener('pointerdown', (e) => { if (e.button > 0) return; e.preventDefault(); drag = true; try { G.svg.setPointerCapture(e.pointerId); } catch (er) { /* ignore */ } upd(snap(G.fromEvent(e)[1])); });
    G.svg.addEventListener('pointermove', (e) => { if (drag) upd(snap(G.fromEvent(e)[1])); });
    const up = () => { drag = false; }; G.svg.addEventListener('pointerup', up); G.svg.addEventListener('pointercancel', up);
    inp.addEventListener('input', () => upd(parseFloat(inp.value)));
    upd(S.k);
    const go = (c, k, ms = 1300) => { const k0 = S.k; return tween(c, ms, (t) => upd(t >= 1 ? k : k0 + (k - k0) * t)); };
    const steps = [];
    steps.push(d.above
      ? { cap: `${T('x^2+4')} is never below the ${T('x')}-axis, so there is nothing to reflect: ${T('|x^2+4|=x^2+4')}. Its lowest point is the vertex ${T('(0,\\ 4)')}.`, run: (c) => pulse(c, top, 1.4) }
      : { cap: `The W: zeros ${d.zeros}, and the reflected hump has its top at ${T(`(${d.top[0]},\\ ${d.top[1]})`)}. The purple line is ${T('y=k')}: count where it meets the W.`, run: (c) => pulse(c, top, 1.4) });
    d.ks.forEach(([k, cap]) => steps.push({ cap: d.pre ? `${T('k=' + k)}: ${cap}` : cap, run: (c) => go(c, k) }));
    steps.push({ cap: `<b>Your turn:</b> drag the line (or the slider). Where does the count change? ${d.above ? `Only at ${T('k=4')}, the height of the vertex.` : `It jumps exactly at the ${T('x')}-axis and at the top of the hump.`}`, run: async (c) => { await pulse(c, sl, 1.04); await pulse(c, hnd, 1.3); } });
    return steps;
  }
};

/* =============================== explainer: the extraneous-root trapdoor =============================== */
const SV = {
  a: { eq: '|x^2-4|=3x', min: -5, max: 5, zone: [-Infinity, 0], zoneT: '3x<0', A: (x) => Math.abs(x * x - 4), B: (x) => 3 * x,
    c1: ['x^2-4=3x\\Rightarrow x^2-3x-4=0', '(x-4)(x+1)=0\\Rightarrow x=4,\\ -1'], c2: ['x^2-4=-3x\\Rightarrow x^2+3x-4=0', '(x+4)(x-1)=0\\Rightarrow x=-4,\\ 1'],
    cand: [[4, '4', 1], [-1, '-1', 1], [-4, '-4', 2], [1, '1', 2]], gate: '3x\\ge0\\Rightarrow x\\ge0',
    keep: `${T('x=4')}: ${T('|12|=12\\ \\checkmark')} &nbsp; ${T('x=1')}: ${T('\\lvert -3\\rvert =3\\ \\checkmark')}`,
    rej: `${T('x=-1')}: ${T('\\lvert -3\\rvert =3\\ne-3')}<br>${T('x=-4')}: ${T('|12|=12\\ne-12')}`, sol: 'x=1\\text{ or }x=4',
    gwin: { xmin: -5, xmax: 5, ymin: -5, ymax: 15, xlabels: 2, ylabels: 5 }, aT: 'y=|x^2-4|', bT: 'y=3x', meet: [[1, 3], [4, 12]] },
  b: { eq: '|2x+1|=x^2-2', min: -4, max: 4, zone: [-Math.SQRT2, Math.SQRT2], zoneT: 'x^2-2<0', A: (x) => Math.abs(2 * x + 1), B: (x) => x * x - 2,
    c1: ['2x+1=x^2-2\\Rightarrow x^2-2x-3=0', '(x-3)(x+1)=0\\Rightarrow x=3,\\ -1'], c2: ['-(2x+1)=x^2-2\\Rightarrow x^2+2x-1=0', 'x=\\frac{-2\\pm\\sqrt8}{2}=-1\\pm\\sqrt2'],
    cand: [[3, '3', 1], [-1, '-1', 1], [-1 + Math.SQRT2, '-1+\\sqrt2', 2], [-1 - Math.SQRT2, '-1-\\sqrt2', 2]], gate: 'x^2-2\\ge0\\Rightarrow x\\le-\\sqrt2\\text{ or }x\\ge\\sqrt2',
    keep: `${T('x=3')}: ${T('|7|=7=9-2\\ \\checkmark')}<br>${T('x=-1-\\sqrt2')}: both sides ${T('1+2\\sqrt2\\ \\checkmark')}`,
    rej: `${T('x=-1')}: ${T('x^2-2=-1<0')}<br>${T('x=-1+\\sqrt2\\approx0.41')}: ${T('x^2-2\\approx-1.83<0')}`, sol: 'x=3\\text{ or }x=-1-\\sqrt2',
    gwin: { xmin: -4, xmax: 4, ymin: -3, ymax: 9, ylabels: 3 }, aT: 'y=|2x+1|', bT: 'y=x^2-2', meet: [[3, 7], [-1 - Math.SQRT2, 1 + 2 * Math.SQRT2]] }
};
const sieve = {
  title: 'Extraneous roots fall through the trapdoor',
  height: 470, minW: 900, capH: 96,
  choices: [{ sep: 'Example 5:' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }],
  ask: (v) => `<b>Example 5(${v}):</b> solve and check: ${T(SV[v].eq)}.`,
  make(stage, v, ex) {
    const d = SV[v], W = ex.W, LW = 440, RX = LW + 20, RW = W - RX;
    const P = div(stage, 'u7l5-pn u7l5-pn-s', '', 0, 0, LW), rows = h('div', 'u7l5-rows'); P.appendChild(rows);
    const R = [row(rows, 1, `<b>Case 1:</b> ${T(d.c1[0])}<br>${T(d.c1[1])}`), row(rows, 2, `<b>Case 2:</b> ${T(d.c2[0])}<br>${T(d.c2[1])}`),
      row(rows, 3, `the right side must be ${T('\\ge0')}: ${T(d.gate)}`), row(rows, 4, `<b class="u7l5-ok">keep</b> ${d.keep}`),
      row(rows, 5, `<b class="u7l5-no">extraneous</b> ${d.rej}`), row(rows, 6, `<b>Solutions:</b> ${T(d.sol)}`)];
    /* the number line with the trapdoor zone */
    const NY = 50, N = new NumberLine(stage, { x: RX, y: NY, width: RW, height: 96, min: d.min, max: d.max, step: 1, labelStep: 1 });
    const ay = N.ay, za = Math.max(d.zone[0], d.min - 0.4), zb = Math.min(d.zone[1], d.max + 0.4);
    const zx0 = N.toPx(za), zx1 = N.toPx(zb);
    const zg = svgEl('g', { class: 'u7l5-zone' }, N.layers.data); zg.style.opacity = 0;
    svgEl('rect', { x: zx0, y: ay - 9, width: zx1 - zx0, height: 18, fill: 'rgba(201,58,51,.18)', stroke: AC, 'stroke-width': 2.5, 'stroke-dasharray': '7 5' }, zg);
    const flapL = svgEl('line', { x1: zx0, y1: ay, x2: (zx0 + zx1) / 2, y2: ay, stroke: AC, 'stroke-width': 4, 'stroke-linecap': 'round' }, zg);
    const flapR = svgEl('line', { x1: zx1, y1: ay, x2: (zx0 + zx1) / 2, y2: ay, stroke: AC, 'stroke-width': 4, 'stroke-linecap': 'round' }, zg);
    const zlab = div(stage, 'u7l5-zlab', `${T(d.zoneT)}: trapdoor`, RX + (Math.max(zx0, N.toPx(d.min)) + Math.min(zx1, N.toPx(d.max))) / 2, NY + ay + 28); zlab.style.transform = 'translateX(-50%)'; hide(zlab);
    /* the candidate balls */
    const balls = d.cand.map(([x, lab, cs]) => {
      const b = div(stage, 'u7l5-ball c' + cs, T(lab), RX + N.toPx(x), 4); b.style.opacity = 0; b.x = x; b.bad = d.B(x) < 0; return b;
    });
    let nb = 0;
    const tags = balls.map((b) => { const t = div(stage, 'u7l5-tag ' + (b.bad ? 'no' : 'ok'), b.bad ? '✗ extraneous' : '✓ keep', RX + N.toPx(b.x), NY + ay + 54 + (b.bad ? 26 * nb++ : 0)); t.style.opacity = 0; return t; });
    const drop = NY + ay - 24; // drop - 18: the move that rests a ball (top at y = 4, 36 px tall) on the line
    /* the graph that confirms it */
    const G = new Graph(stage, Object.assign({ x: RX + 40, y: 236, width: RW - 80, height: 232, fontSize: 13 }, d.gwin));
    const ga = hide(G.fn(d.A, { color: AC, width: 4 })), gb = hide(G.fn(d.B, { color: KC, width: 3.5 }));
    const gaL = hide(G.label(d.gwin.xmin + 0.2, d.gwin.ymax - 0.4, T(d.aT), { cls: 'bk-ptlab', pos: 'se', color: AC }));
    const gbL = hide(G.label(d.gwin.xmax - 0.2, d.gwin.ymax - 0.4, T(d.bT), { cls: 'bk-ptlab', pos: 'sw', color: KC }));
    const gm = d.meet.map(([x, y]) => hide(G.point(x, y, { color: 'green', r: 7 })));
    G.el.style.opacity = 0.25;
    const fall = (c, b) => anim(c, b, [{ transform: 'translate(-50%, 0)' }, { transform: `translate(-50%, ${drop - 18}px)` }], 650, { easing: 'cubic-bezier(.5,0,.9,.6)' });
    const through = (c, b) => anim(c, b, [{ transform: `translate(-50%, ${drop - 18}px)`, opacity: 1 }, { transform: `translate(-50%, ${drop + 90}px)`, opacity: 0 }], 700, { easing: 'ease-in' });
    const mid = (zx0 + zx1) / 2;
    const openDoor = (c, t) => tween(c, 350, (u) => { const a = t ? u : 1 - u, L = (mid - zx0) * Math.cos(a * 1.2), Y = (mid - zx0) * Math.sin(a * 1.2);
      flapL.setAttribute('x2', zx0 + L); flapL.setAttribute('y2', ay + Y); flapR.setAttribute('x2', zx1 - L); flapR.setAttribute('y2', ay + Y); });
    const good = balls.filter((b) => !b.bad), bad = balls.filter((b) => b.bad);
    return [
      { cap: `<b>1</b> Case 1: ${T(d.c1[0].split('\\Rightarrow')[0])}. Its two roots are only <b>candidates</b> for now.`,
        run: async (c) => { await show(c, R[0]); await Promise.all(balls.slice(0, 2).map((b) => pop(c, unhide(b)))); } },
      { cap: `<b>2</b> Case 2: ${T(d.c2[0].split('\\Rightarrow')[0])}. Two more candidates.`,
        run: async (c) => { await show(c, R[1]); await Promise.all(balls.slice(2).map((b) => pop(c, unhide(b)))); } },
      { cap: `<b>3</b> An absolute value is never negative, so the right side must be ${T('\\ge0')}. Where ${T(d.zoneT)}, the equation can’t be true: that stretch of the number line is a <b>trapdoor</b>.`,
        run: async (c) => { await show(c, R[2]); await show(c, zg); await show(c, unhide(zlab)); } },
      { cap: `<b>4</b> Drop the candidates. These land: check them in the original equation, and they work.`,
        run: async (c) => { await show(c, R[3]); await Promise.all(good.map((b) => fall(c, b))); await Promise.all(good.map((b, i) => pop(c, unhide(tags[balls.indexOf(b)])))); } },
      { cap: `<b>5</b> These two land on the trapdoor: there the right side is negative, so they fall through. They solve a case, but not the original equation: <b>extraneous</b>.`,
        run: async (c) => { await show(c, R[4]); await Promise.all(bad.map((b) => fall(c, b))); await openDoor(c, true); await Promise.all(bad.map((b) => through(c, b))); await Promise.all(bad.map((b) => pop(c, unhide(tags[balls.indexOf(b)])))); await openDoor(c, false); } },
      { cap: `<b>6</b> ${T(d.sol)}. The graph agrees: ${T(d.aT)} and ${T(d.bT)} meet only <b>twice</b>, at the two solutions.`,
        run: async (c) => { await show(c, R[5]); G.el.style.opacity = 1; await drawIn(unhide(ga), 600, c); await drawIn(unhide(gb), 600, c); await Promise.all([show(c, unhide(gaL)), show(c, unhide(gbL))]); await Promise.all(gm.map((p) => pop(c, unhide(p)))); } }
    ];
  }
};

/* =============================== explainer: subdomains on the graph (Example 7) =============================== */
const tub = {
  title: 'Subdomains: one piece of the graph at a time',
  height: 444, minW: 900, capH: 96,
  ask: `<b>Example 7:</b> solve ${T('|x-3|+|x+1|=6')} using subdomains.`,
  make(stage, v, ex) {
    const W = ex.W, LW = 440, RX = LW + 22, RW = W - RX;
    const P = div(stage, 'u7l5-pn', '', 0, 0, LW), rows = h('div', 'u7l5-rows'); P.appendChild(rows);
    const R = [row(rows, 1, `zeros of the insides: ${T('x=3')}, ${T('x=-1')}`),
      row(rows, 2, `<b class="u7l5-s1">${T('x<-1')}</b> ${T('-(x-3)-(x+1)=6')}<br>${T('-2x+2=6\\Rightarrow x=-2')} ${T('\\checkmark')}`),
      row(rows, 3, `<b class="u7l5-s2">${T('-1\\le x<3')}</b> ${T('-(x-3)+(x+1)=6')}<br>${T('4=6')}: false, no solution here`),
      row(rows, 4, `<b class="u7l5-s3">${T('x\\ge3')}</b> ${T('(x-3)+(x+1)=6')}<br>${T('2x-2=6\\Rightarrow x=4')} ${T('\\checkmark')}`),
      row(rows, 5, `<b>Solutions:</b> ${T('x=-2')} or ${T('x=4')}<br>check: ${T('\\lvert -5\\rvert +\\lvert -1\\rvert =6')}, ${T('|1|+|5|=6')}`)];
    const G = new Graph(stage, { x: RX, y: 20, width: RW, height: 422, xmin: -5, xmax: 7, ymin: -1, ymax: 13, ylabels: 2, fontSize: 15 });
    const bands = [[-Infinity, -1, S1], [-1, 3, S2], [3, Infinity, S3]].map(([a, b, cl]) => hide(G.shadeX(a, b, { band: true, color: cl, openB: true })));
    const blab = [[-3, 'x<-1', S1], [1.5, '-1\\le x<3', S2], [5, 'x\\ge3', S3]].map(([x, t, cl]) => hide(G.label(x, 12.2, T(t), { cls: 'bk-ptlab', color: cl })));
    const zs = [-1, 3].map((x) => hide(G.point(x, 0, { color: 'amber', r: 7.5, label: T(String(x)), pos: 's' })));
    const six = hide(G.hline(6, { color: OR, width: 3, dash: false })), sixL = hide(G.label(6.8, 6, T('y=6'), { cls: 'bk-ptlab', pos: 'sw', color: OR }));
    const S = { t: [-5, -5, -1, 3] };
    const g = (x) => Math.abs(x - 3) + Math.abs(x + 1);
    const pieces = [[-5, -1, S1, '-2x+2', -3, 'sw'], [-1, 3, S2, '4', 1, 'n'], [3, 7, S3, '2x-2', 5.6, 'w']].map(([a, b, cl, lab, lx, pos], i) => {
      const o = { from: a, to: a, color: cl, width: 5, arrows: i !== 1 };
      const el = hide(G.fn(g, o)); el.o = o; el.a = a; el.b = b;
      el.lab = hide(G.label(lx, g(lx), T('y=' + lab), { cls: 'bk-ptlab', pos: pos === 'n' ? 'n' : pos === 'sw' ? 'sw' : 'nw', color: cl, dy: pos === 'n' ? -4 : 0 }));
      return el;
    });
    const tr = hide(G.point(-5, g(-5), { color: INK, r: 6 }));
    const grow = (c, p) => { unhide(tr); unhide(p); return tween(c, 1300, (t) => { const x = p.a + (p.b - p.a) * t; p.o.to = x; p._bkDraw(); G.moveTo(tr, x, g(x)); }, linear); };
    const sol = [[-2, 6], [4, 6]].map(([x, y]) => hide(G.point(x, y, { color: 'green', r: 8.5, label: T(`(${x},\\ 6)`), pos: x < 0 ? 'nw' : 'ne' })));
    return [
      { cap: `<b>1</b> The insides are ${T('0')} at ${T('x=3')} and ${T('x=-1')}. They split the number line into three <b>subdomains</b>. We want where the graph of ${T('y=|x-3|+|x+1|')} meets ${T('y=6')}.`,
        run: async (c) => { await show(c, R[0]); await Promise.all(zs.map((p) => popP(c, p))); await Promise.all(bands.map((b) => drawIn(unhide(b), 400, c))); await Promise.all(blab.map((l) => show(c, unhide(l)))); await drawIn(unhide(six), 500, c); await show(c, unhide(sixL)); } },
      { cap: `<b>2</b> ${T('x<-1')}: both insides are negative, so ${T('-(x-3)-(x+1)=-2x+2')}. ${T('-2x+2=6')} gives ${T('x=-2')}, and ${T('-2<-1')}: it is in the subdomain ${T('\\checkmark')}`,
        run: async (c) => { await show(c, R[1]); await grow(c, pieces[0]); await show(c, unhide(pieces[0].lab)); await popP(c, sol[0]); } },
      { cap: `<b>3</b> ${T('-1\\le x<3')}: ${T('-(x-3)+(x+1)=4')}. The graph is flat at height ${T('4')}, under the line ${T('y=6')}: ${T('4=6')} is false, so <b>no solution</b> here.`,
        run: async (c) => { await show(c, R[2]); await grow(c, pieces[1]); await show(c, unhide(pieces[1].lab)); await shake(c, pieces[1]); } },
      { cap: `<b>4</b> ${T('x\\ge3')}: both insides are ${T('\\ge0')}: ${T('(x-3)+(x+1)=2x-2')}. ${T('2x-2=6')} gives ${T('x=4')}, and ${T('4\\ge3')} ${T('\\checkmark')}`,
        run: async (c) => { await show(c, R[3]); await grow(c, pieces[2]); await show(c, unhide(pieces[2].lab)); await popP(c, sol[1]); hide(tr); } },
      { cap: `<b>5</b> Solutions: ${T('x=-2')} or ${T('x=4')}. Check: ${T('\\lvert -5\\rvert +\\lvert -1\\rvert =6\\ \\checkmark')} and ${T('|1|+|5|=6\\ \\checkmark')}`,
        run: async (c) => { await show(c, R[4]); await Promise.all(sol.map((p) => pulse(c, p, 1.35))); } }
    ];
  }
};

/* =============================== explainer: the drone and the camera (Example 8) =============================== */
const drone = {
  title: 'The drone and the camera',
  height: 444, minW: 940, capH: 96,
  ask: `<b>Example 8:</b> ${T('h=-t^2+8t')}, ${T('0\\le t\\le8')}. The camera records within ${T('3')} m of ${T('10')} m. Solve ${T('\\lvert -t^2+8t-10\\rvert =3')}; when does it record?`,
  make(stage, v, ex) {
    const W = ex.W, SW = 230, GX = SW + 14, GW = 430, PX = GX + GW + 16, PW = W - PX, H = 440;
    const hf = (t) => -t * t + 8 * t;
    /* the scene: a height scale from 0 to 17 m, the camera's zone 7–13 m, the drone */
    const sc = svgEl('svg', { class: 'u7l5-scene', width: SW, height: H, viewBox: `0 0 ${SW} ${H}` }); sc.style.position = 'absolute'; sc.style.left = '0px'; sc.style.top = '2px'; stage.appendChild(sc);
    const Y0 = 400, Y1 = 30, yOf = (m) => Y0 - (Y0 - Y1) * m / 17;
    svgEl('rect', { x: 0, y: 0, width: SW, height: H, rx: 14, fill: '#eaf3fc' }, sc);
    svgEl('rect', { x: 0, y: Y0, width: SW, height: H - Y0, fill: '#cfe3c4' }, sc);
    for (let m = 0; m <= 16; m += 2) { svgEl('line', { x1: 34, x2: 44, y1: yOf(m), y2: yOf(m), stroke: INK, 'stroke-width': 2 }, sc); const t = svgEl('text', { x: 30, y: yOf(m) + 5, 'text-anchor': 'end', 'font-size': 14, fill: INK, 'font-weight': 700 }, sc); t.textContent = m; }
    svgEl('line', { x1: 44, x2: 44, y1: yOf(0), y2: yOf(17), stroke: INK, 'stroke-width': 2.5 }, sc);
    const zone = svgEl('g', {}, sc); zone.style.opacity = 0;
    svgEl('rect', { x: 46, y: yOf(13), width: SW - 52, height: yOf(7) - yOf(13), fill: 'rgba(18,128,90,.16)', stroke: OK, 'stroke-width': 2, 'stroke-dasharray': '6 5' }, zone);
    svgEl('line', { x1: 46, x2: SW - 6, y1: yOf(10), y2: yOf(10), stroke: GR, 'stroke-width': 2, 'stroke-dasharray': '4 5' }, zone);
    const zt = svgEl('text', { x: SW - 10, y: yOf(13) - 6, 'text-anchor': 'end', 'font-size': 14, 'font-weight': 800, fill: OK }, zone); zt.textContent = '7 m to 13 m';
    const cam = svgEl('text', { x: 168, y: Y0 + 30, 'font-size': 30, 'text-anchor': 'middle' }, sc); cam.textContent = '🎥';
    const rec = svgEl('g', { class: 'u7l5-rec' }, sc); rec.style.opacity = 0.2;
    svgEl('rect', { x: 150, y: 10, width: 66, height: 28, rx: 8, fill: '#1c2230' }, rec);
    svgEl('circle', { cx: 166, cy: 24, r: 7, fill: '#ff3b30' }, rec);
    const rt = svgEl('text', { x: 178, y: 30, 'font-size': 15, 'font-weight': 800, fill: '#fff' }, rec); rt.textContent = 'REC';
    const dr = svgEl('g', {}, sc), DX = 120;
    svgEl('line', { x1: -26, y1: 0, x2: 26, y2: 0, stroke: INK, 'stroke-width': 4, 'stroke-linecap': 'round' }, dr);
    svgEl('rect', { x: -12, y: -2, width: 24, height: 13, rx: 5, fill: '#7a1f3d' }, dr);
    [-26, 26].forEach((x) => { svgEl('ellipse', { cx: x, cy: -5, rx: 16, ry: 3.5, fill: 'rgba(58,66,84,.55)', class: 'u7l5-rotor' }, dr); svgEl('line', { x1: x, y1: 0, x2: x, y2: -5, stroke: INK, 'stroke-width': 3 }, dr); });
    const clock = svgEl('text', { x: 54, y: 26, 'font-size': 15, 'font-weight': 800, fill: INK }, sc), clock2 = svgEl('text', { x: 54, y: 46, 'font-size': 15, 'font-weight': 800, fill: INK }, sc);
    const setDrone = (t) => { const hh = hf(t); dr.setAttribute('transform', `translate(${DX} ${yOf(hh) - 6})`); clock.textContent = `t = ${t.toFixed(1)} s`; clock2.textContent = `h = ${hh.toFixed(1)} m`; rec.style.opacity = hh >= 7 - 1e-9 && hh <= 13 + 1e-9 && t > 0 ? 1 : 0.2; };
    setDrone(0);
    /* the graph */
    const G = new Graph(stage, { x: GX, y: 20, width: GW, height: H - 18, xmin: 0, xmax: 8.5, ymin: 0, ymax: 17, ylabels: 2, xtitle: 't', ytitle: 'h', fontSize: 15 });
    const band = hide(G.polyline([[0, 7], [8.5, 7], [8.5, 13], [0, 13]], { closed: true, fill: OK, fillOpacity: 0.12, color: OK, width: 1 }));
    const l13 = hide(G.hline(13, { color: KC, width: 2.5, dash: '8 6' })), l7 = hide(G.hline(7, { color: KC, width: 2.5, dash: '8 6' })), l10 = hide(G.hline(10, { color: GR, width: 2, dash: '4 5' }));
    const L13 = hide(G.label(8.4, 13, T('h=13'), { cls: 'bk-ptlab', pos: 'nw', color: KC })), L7 = hide(G.label(8.4, 7, T('h=7'), { cls: 'bk-ptlab', pos: 'nw', color: KC }));
    const co = { from: 0, to: 0, color: FC, width: 4, arrows: false }, cur = G.fn(hf, co);
    const s3 = Math.sqrt(3);
    const pts = [[4 - s3, 13, '2.27'], [4 + s3, 13, '5.73'], [1, 7, '1'], [7, 7, '7']].map(([t, y, l]) => hide(G.point(t, y, { color: 'green', r: 7.5, label: T(l), pos: y === 13 ? 'n' : 's' })));
    const recs = [[1, 4 - s3], [4 + s3, 7]].map(([a, b]) => hide(G.shadeX(a, b, { color: OK, width: 10 })));
    /* the work */
    const Pn = div(stage, 'u7l5-pn u7l5-pn-s', '', PX, 0, PW), rows = h('div', 'u7l5-rows'); Pn.appendChild(rows);
    const R = [row(rows, 1, `distance from ${T('10')}:<br>${T('|h-10|=\\lvert -t^2+8t-10\\rvert =3')}`),
      row(rows, 2, `${T('h=13')}: ${T('t^2-8t+13=0')}<br>${T('t=4\\pm\\sqrt3')}`), row(rows, 3, `${T('h=7')}: ${T('t^2-8t+7=0')}<br>${T('(t-1)(t-7)=0')}`),
      row(rows, 4, `records: ${T('1\\le t\\le2.27')}<br>and ${T('5.73\\le t\\le7')}`)];
    const tick = (t) => { co.to = t; cur._bkDraw(); setDrone(t); recs.forEach((r, i) => { const [a, b] = [[1, 4 - s3], [4 + s3, 7]][i]; if (t >= a) unhide(r); }); };
    return [
      { cap: `(a) The camera’s zone is ${T('10\\pm3')}: from ${T('7')} m to ${T('13')} m. The drone’s distance from ${T('10')} m is ${T('|h-10|=\\lvert -t^2+8t-10\\rvert ')}, so “exactly ${T('3')} m from ${T('10')} m” is ${T('\\lvert -t^2+8t-10\\rvert =3')}.`,
        run: async (c) => { await show(c, R[0]); await show(c, zone); await show(c, unhide(band)); await Promise.all([l10, l13, l7].map((l) => drawIn(unhide(l), 500, c))); } },
      { cap: `Case 1, ${T('-t^2+8t-10=3')}: ${T('t^2-8t+13=0')}, so ${T('t=\\frac{8\\pm\\sqrt{12}}{2}=4\\pm\\sqrt3\\approx2.27,\\ 5.73')} s. That is where ${T('h=13')}.`,
        run: async (c) => { await show(c, R[1]); await show(c, unhide(L13)); await Promise.all(pts.slice(0, 2).map((p) => popP(c, p))); } },
      { cap: `Case 2, ${T('-t^2+8t-10=-3')}: ${T('t^2-8t+7=0')}, ${T('(t-1)(t-7)=0')}, so ${T('t=1')} or ${T('t=7')} s, where ${T('h=7')}. Four times, all in ${T('0\\le t\\le8')}.`,
        run: async (c) => { await show(c, R[2]); await show(c, unhide(L7)); await Promise.all(pts.slice(2).map((p) => popP(c, p))); } },
      { cap: `(b) Fly it! The camera records while ${T('7\\le h\\le13')}: from ${T('1')} s to about ${T('2.27')} s, and from about ${T('5.73')} s to ${T('7')} s. (The top is ${T('16')} m at ${T('4')} s, too high for the camera.)`,
        run: async (c) => { await show(c, R[3]); await tween(c, 6500, (t) => tick(8 * t), linear); tick(8); } }
    ];
  }
};

/* =============================== Stand Up Break =============================== */
/* BEG: |x² − c| = k (perfect squares, sometimes one case has no roots). PRG: |x² + bx + c| = k, both cases factor
 * (four solutions, sometimes three). MAS: |x² − c| = mx: four candidates, two extraneous. */
const sg = (n, first = false) => (n < 0 ? '-' : first ? '' : '+');
const lin = (b, c, v = 'x') => `${b ? `${sg(b)}${Math.abs(b) === 1 ? '' : Math.abs(b)}${v}` : ''}${c ? `${sg(c)}${Math.abs(c)}` : ''}`;
const qT = (b, c) => `x^2${lin(b, c)}`;
const fac = (r) => (r === 0 ? 'x' : `(x${r < 0 ? '+' : '-'}${Math.abs(r)})`);
const list = (arr) => [...new Set(arr)].sort((p, q) => p - q).join(',\\ ');
standup('u7l5', {
  intro: 'At your whiteboard: isolate, then solve both cases. How many solutions did you expect?',
  levels: {
    BEG: (r) => {
      for (;;) {
        const p = r.int(2, 7), q = r.int(0, 6);
        if (r.chance(0.3)) { // the second case has no real roots
          const c = r.int(1, p * p - 1), k = p * p - c; if (k <= c) continue;
          return { text: 'Solve algebraically.', q: `|x^2-${c}|=${k}`, a: [`x^2-${c}=${k}\\Rightarrow x^2=${p * p}\\Rightarrow x=\\pm${p}`, `x^2-${c}=-${k}\\Rightarrow x^2=${c - k}:\\ \\text{no real roots}`, `x=\\pm${p}`] };
        }
        if (q >= p || (p - q) % 2) continue;
        const c = (p * p + q * q) / 2, k = (p * p - q * q) / 2;
        return { text: 'Solve algebraically.', q: `|x^2-${c}|=${k}`,
          a: [`x^2-${c}=${k}\\Rightarrow x^2=${p * p}\\Rightarrow x=\\pm${p}`, `x^2-${c}=-${k}\\Rightarrow x^2=${q * q}\\Rightarrow x=${q ? '\\pm' + q : '0'}`, `x=${q ? list([-p, -q, q, p]) : list([-p, 0, p])}`] };
      }
    },
    PRG: (r) => {
      for (;;) {
        const s = r.int(-6, 6), r1 = r.int(-7, 7), r2 = s - r1, r3 = r.int(-6, 6), r4 = s - r3;
        const P1 = r1 * r2, P2 = r3 * r4; if (P2 <= P1 || (P2 - P1) % 2) continue;
        const k = (P2 - P1) / 2, c = P1 + k; if (k > 12 || Math.abs(c) > 20 || !c) continue;
        const b = -s, sol = [...new Set([r1, r2, r3, r4])];
        return { text: 'Solve algebraically.', q: `|${qT(b, c)}|=${k}`,
          a: [`${qT(b, c)}=${k}\\Rightarrow ${qT(b, c - k)}=0\\Rightarrow ${fac(r1)}${fac(r2)}=0\\Rightarrow x=${list([r1, r2])}`,
            `${qT(b, c)}=-${k}\\Rightarrow ${qT(b, c + k)}=0\\Rightarrow ${r3 === r4 ? fac(r3) + '^2' : fac(r3) + fac(r4)}=0\\Rightarrow x=${list([r3, r4])}`,
            `x=${list(sol)}\\ (${sol.length}\\ \\text{solutions})`] };
      }
    },
    MAS: (r) => {
      for (;;) {
        const p = r.int(3, 8), q = r.int(1, p - 1), m = p - q, c = p * q; if (c > 40) continue;
        const mx = `${m === 1 ? '' : m}x`;
        return { text: 'Solve and check. Reject any extraneous solutions.', q: `|x^2-${c}|=${mx}`,
          a: [`x^2-${c}=${mx}\\Rightarrow x^2-${mx}-${c}=0\\Rightarrow(x-${p})(x+${q})=0\\Rightarrow x=${p},\\ -${q}`,
            `x^2-${c}=-${mx}\\Rightarrow x^2+${mx}-${c}=0\\Rightarrow(x+${p})(x-${q})=0\\Rightarrow x=-${p},\\ ${q}`,
            `${mx}\\ge0\\Rightarrow x\\ge0:\\ \\text{reject }-${p},\\ -${q}\\ (\\text{extraneous})`, `x=${q}\\text{ or }x=${p}`] };
      }
    }
  }
});

/* =============================== mount =============================== */
export const explainers = mountExplainers({ cases, slide, sieve, tub, drone });
export const _test = { roots, solveAbs, CS, SL, SV };
