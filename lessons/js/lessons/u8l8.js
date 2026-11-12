/* Math 20-1 · Unit 8 · Lesson 8 — Unit 8 Review.
 * New lesson format (2026-11-11): the warm-up ("What Comes Next?", look-and-say) is plain markup on the page (no code).
 * Static figures: the graphing grids of Examples 4–6 (the answer graph shows with the part's Answer / Graph button).
 * Explainers:
 *   meet    (how many meeting points? the combined equation, numbered steps, beside the graphs with a live b² − 4ac meter:
 *            Example 1(b) the line y = 2x + k slides down until its two points merge at the tangent (3, −2), then past it;
 *            Example 2(b) two parabolas, b² − 4ac = −12, the gap between them; Example 3 break-even points and the
 *            profit region between R and C, dropped onto the x-axis as 5 < x < 20),
 *   signs   (one procedure for one variable, step numbers beside the steps: factor, zeros on the number line, the sign
 *            chart filled cell by cell, the product row, the answer, then the graph check where the parabola lights up
 *            above the axis; Example 7(a), and Example 7(b) read straight from the graph),
 *   region  (STAR, a whole-class round: "Which region?" Six rounds of an inequality (or a system) and four pictures A–D;
 *            the class votes, then the boundary check and a test point knock out the wrong ones and the winner is stamped).
 * Colours (Unit 8): parabolas blue, lines purple, intersection points amber; b² − 4ac > 0 green, = 0 amber, < 0 red;
 * solution sets on a number line and "positive" green; test points amber. Calculator allowed. */
import {
  h, tex, add, box, Graph, NumberLine, stamp, stampIn, mountExplainers, pop, fadeIn, sleep, anim, pulse, shake, tween,
  linear, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const BL = COLORS.blue, PU = COLORS.purple, AM = COLORS.amber, GR = COLORS.green, RD = COLORS.red, INK = COLORS.ink;
const GRAY = '#6b7385';
/** captions and asks may hold $…$ TeX */
const md = (s) => (typeof s === 'string' ? s.replace(/\$([^$]+)\$/g, (_, t) => T(t)) : s);
function mdDef(def) {
  const mk = def.make, a = def.ask;
  def.make = function (stage, v, ex) { return (mk.call(this, stage, v, ex) || []).map((st) => Object.assign(st, { cap: typeof st.cap === 'string' ? md(st.cap) : st.cap })); };
  if (typeof a === 'function') def.ask = (v) => md(a(v)); else if (typeof a === 'string') def.ask = md(a);
  return def;
}
const hide = (el) => { if (el) { el.style.opacity = 0; if (el.label) el.label.style.opacity = 0; } return el; };
const show = (c, el) => { el.style.opacity = ''; return fadeIn(c, el, 320); };
const popIn = async (c, el) => { el.style.opacity = ''; await pop(c, el); if (el.label) { el.label.style.opacity = ''; await fadeIn(c, el.label, 260); } };
const drawShow = (c, G, el, ms = 700) => { el.style.opacity = ''; return G.drawIn(el, ms, c); };
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
/** a numbered step row (the step number beside the step) */
const row = (stage, n, html, x, y, w, cls = '') => hide(div(stage, 'u8l8-row ' + cls, `<span class="u8l8-num">${n}</span><span class="u8l8-rt">${md(html)}</span>`, x, y, w));
const stampAt = (stage, text, ok, x, y, rot) => hide(stamp(stage, text, { ok, x, y, rotate: rot ?? (ok ? -5 : -8) }));
const stampShow = async (c, st, ok) => { st.style.opacity = ''; await stampIn(c, st); if (ok === false) await shake(c, st); };

/** a shaded region between lo(x) and hi(x) (null = the window edge), clamped to the window. o: { from, to, color, op } */
function region(G, lo, hi, o = {}) {
  const color = o.color || BL;
  return G.curve(() => {
    const w = G.win, a = Math.max(o.from ?? w.xmin, w.xmin), b = Math.min(o.to ?? w.xmax, w.xmax), N = 180;
    const cl = (v) => Math.max(w.ymin, Math.min(w.ymax, v)), top = [], bot = [];
    for (let i = 0; i <= N; i++) {
      const x = a + (b - a) * i / N, yl = lo ? cl(lo(x)) : w.ymin; let yh = hi ? cl(hi(x)) : w.ymax;
      if (yh < yl) yh = yl;
      top.push(G.toPx(x, yh)); bot.push(G.toPx(x, yl));
    }
    return { subs: [top.concat(bot.reverse())], closed: true };
  }, { color, fill: color, fillOpacity: o.op ?? 0.2, opacity: 0, width: 1 }, 'u8l8-reg', G.layers.data);
}

/* =============================== static figures (Examples 4–6) =============================== */
const solOnly = (...els) => els.forEach((e) => { e.classList.add('u8l8-sol'); if (e.label) e.label.classList.add('u8l8-sol'); });
const FIGS = {
  e4a: { win: { xmin: -5, xmax: 5, ymin: -5, ymax: 5 }, draw: (G) => {
    const f = (x) => 1.5 * x - 3;
    solOnly(region(G, f, null, { color: PU }), G.fn(f, { color: PU, width: 3, dash: true }),
      G.point(2, 0, { color: PU, r: 5.5 }), G.point(0, -3, { color: PU, r: 5.5 }));
  } },
  e4b: { win: { xmin: -5, xmax: 5, ymin: -5, ymax: 5 }, draw: (G) => {
    const f = (x) => -0.5 * x + 2;
    region(G, null, f, { color: GRAY, op: 0.24 }); G.fn(f, { color: INK, width: 3 });
  } },
  e5: { win: { xmin: -5, xmax: 3, ymin: -5, ymax: 6 }, draw: (G) => {
    const f = (x) => x * x + 2 * x - 3;
    solOnly(region(G, f, null, { color: BL }), G.fn(f, { color: BL, width: 3 }), G.point(-1, -4, { color: BL, r: 5.5 }),
      G.point(-2, 1, { color: GR, r: 6.5, label: T('(-2,\\ 1)'), pos: 'nw' }), G.point(1, -1, { color: RD, r: 6.5, label: T('(1,\\ -1)'), pos: 'se' }));
  } },
  e6: { win: { xmin: 0, xmax: 60, ymin: 0, ymax: 80, xstep: 5, ystep: 10, xlabels: 10, ylabels: 20, xtitle: 'x', ytitle: 'y' }, draw: (G) => {
    const f = (x) => 60 - 1.5 * x;
    solOnly(region(G, (x) => Math.max(0, f(x)), null, { color: PU }), G.fn(f, { color: PU, width: 3, from: 0, to: 40 }),
      G.point(20, 25, { color: RD, r: 6, label: T('(20,\\ 25)'), pos: 'sw' }), G.point(24, 24, { color: GR, r: 6, label: T('(24,\\ 24)'), pos: 'ne' }));
  } }
};
document.querySelectorAll('.u8l8 [data-fig]').forEach((el) => {
  const d = FIGS[el.dataset.fig]; if (!d) return;
  const G = new Graph(el, Object.assign({ width: 330, height: 330, fontSize: 15, fnArrows: false }, d.win));
  d.draw(G);
});

/* =============================== explainer: how many meeting points? =============================== */
const kindOf = (D) => (Math.abs(D) < 1e-9 ? 1 : D > 0 ? 2 : 0);
const KIND = { 2: ['two solutions', 'u8l8-k2'], 1: ['one (tangent)', 'u8l8-k1'], 0: ['no solution', 'u8l8-k0'] };
const f1 = (x) => x * x - 4 * x + 1;
const MT = {
  e1b: { label: 'Example 1(b): slide the line', ask: 'Example 1(b): determine $k$ so that $y=2x+k$ is tangent to $y=x^2-4x+1$, and find the point of tangency.',
    win: { xmin: -2, xmax: 7, ymin: -7, ymax: 9, ylabels: 2 },
    rows: ['<b>Set equal</b> $x^2-4x+1=2x+k$', '<b>One side 0</b> $x^2-6x+(1-k)=0$', '<b>Tangent</b> $36-4(1-k)=0\\ \\Rightarrow\\ k=-8$',
      '<b>Point</b> $(x-3)^2=0$: $(3,\\ -2)$', '<b>Count</b> $b^2-4ac=32+4k$'] },
  e2b: { label: 'Example 2(b): two parabolas', ask: 'Example 2(b): how many solutions does $y=x^2+2$, $y=-x^2+2x$ have? Explain.',
    win: { xmin: -3, xmax: 4, ymin: -4, ymax: 8, ylabels: 2 },
    rows: ['<b>Set equal</b> $x^2+2=-x^2+2x$', '<b>One side 0</b> $2x^2-2x+2=0$', '<b>Discriminant</b> $(-2)^2-4(2)(2)=-12$', '<b>Answer</b> no real roots: <b class="u8l8-k0">no solution</b>'] },
  e3: { label: 'Example 3: break-even and profit', ask: 'Example 3: $R=-2x^2+60x$ and $C=10x+200$. Find the break-even points and the production levels that make a profit.',
    win: { xmin: 0, xmax: 30, ymin: 0, ymax: 500, xstep: 5, ystep: 50, xlabels: 5, ylabels: 100 },
    rows: ['<b>R = C</b> $-2x^2+60x=10x+200$', '<b>One side 0</b> $-2x^2+50x-200=0$, $\\div(-2)$: $x^2-25x+100=0$', '<b>Factor</b> $(x-5)(x-20)=0$',
      '<b>Break even</b> $(5,\\ 250)$ and $(20,\\ 400)$', '<b>Profit</b> $R\\gt C$: $x^2-25x+100\\lt0$, $5\\lt x\\lt20$'] }
};
const meet = mdDef({
  title: 'How many meeting points?',
  height: 440, minW: 940, capH: 84,
  choices: Object.keys(MT).map((k) => ({ v: k, label: MT[k].label })),
  ask: (v) => MT[v].ask,
  make(stage, v, ex) {
    const d = MT[v], W = ex.W, GW = 440, GX = W - GW - 6, RW = GX - 22;
    const G = new Graph(stage, Object.assign({ x: GX, y: 6, width: GW, height: 428, fontSize: 15 }, d.win));
    const ys = [8, 70, 132, 194, 256];
    const rs = d.rows.map((t, i) => row(stage, i + 1, t, 8, ys[i], RW, 'u8l8-sm'));
    const meter = hide(div(stage, 'u8l8-meter', '', 8, 330, RW));
    const setMeter = (D, k) => {
      const kd = kindOf(D), [word, cls] = KIND[kd];
      meter.className = 'u8l8-meter ' + cls;
      meter.innerHTML = (k != null ? `<span class="u8l8-mk">${T('k=' + (Math.round(k * 10) / 10).toFixed(1))}</span>` : '') +
        `<span class="u8l8-md">${T('b^2-4ac=' + (Math.round(D * 10) / 10).toFixed(Number.isInteger(Math.round(D * 10) / 10) ? 0 : 1))}</span><span class="u8l8-mv">${word}</span>`;
    };
    if (v === 'e1b') {
      const st = { k: -4 };
      const P = hide(G.fn(f1, { color: BL, width: 3.2 }));
      const L = hide(G.fn((x) => 2 * x + st.k, { color: PU, width: 3.2 }));
      const pts = [G.point(1, -2, { color: AM, r: 7.5 }), G.point(5, 6, { color: AM, r: 7.5 })]; pts.forEach(hide);
      const lab = hide(G.label(6.6, 9, `<span class="u8l8-gl u8l8-pu">${T('y=2x+k')}</span>`, { pos: 'sw' }));
      const tLab = hide(G.label(3, -2, `<span class="u8l8-gl u8l8-am">${T('(3,\\ -2)')}</span>`, { pos: 's', dy: 10 }));
      const stp = stampAt(stage, 'Tangent!', true, RW / 2 + 40, 410, -5);
      let lastK = null;
      const setK = (k) => {
        st.k = k; L._bkDraw();
        const q = 8 + k, D = 32 + 4 * k;
        if (q >= -1e-9) { const r = Math.sqrt(Math.max(0, q)); G.moveTo(pts[0], 3 - r, 2 * (3 - r) + k); G.moveTo(pts[1], 3 + r, 2 * (3 + r) + k); pts.forEach((p) => { p.style.opacity = ''; }); }
        else pts.forEach((p) => { p.style.opacity = 0; });
        const kr = Math.round(k * 10) / 10; if (kr !== lastK) { lastK = kr; setMeter(D, k); }
      };
      setMeter(16, -4);
      return [
        { cap: '<b>Step 1.</b> The line from part (a), $y=2x-4$, meets the parabola <b>twice</b>. Changing $k$ slides the line up and down. Set the right sides equal.',
          run: async (c) => { await show(c, rs[0]); await drawShow(c, G, P, 700); await drawShow(c, G, L, 500); await show(c, lab); for (const p of pts) await popIn(c, p); } },
        { cap: '<b>Step 2.</b> Collect on one side: $x^2-6x+(1-k)=0$, so $a=1$, $b=-6$ and $c=1-k$.', run: (c) => show(c, rs[1]) },
        { cap: '<b>Step 3.</b> Tangent means <b>one</b> solution, so $b^2-4ac=0$: $36-4(1-k)=0$, $32+4k=0$, $k=-8$. Watch the two points merge.',
          run: async (c) => { await show(c, rs[2]); await show(c, meter); await tween(c, 2200, (t) => setK(-4 - 4 * t)); setK(-8); } },
        { cap: '<b>Step 4.</b> With $k=-8$: $x^2-6x+9=0$, $(x-3)^2=0$, $x=3$ and $y=2(3)-8=-2$. The point of tangency is $(3,\\ -2)$.',
          run: async (c) => { await show(c, rs[3]); await show(c, tLab); await stampShow(c, stp, true); } },
        { cap: '<b>Step 5.</b> $b^2-4ac=32+4k$. Lower the line ($k\\lt-8$): negative, <b>no</b> meeting points. Raise it ($k\\gt-8$): positive, <b>two</b>.',
          run: async (c) => {
            await show(c, rs[4]); tLab.style.opacity = 0;
            await tween(c, 4200, (t) => { const k = t < 0.3 ? -8 - 10 * t : t < 0.75 ? -11 + 20 * (t - 0.3) : -2 - 24 * (t - 0.75); setK(k); }, linear);
            setK(-8); tLab.style.opacity = '';
          } }
      ];
    }
    if (v === 'e2b') {
      const fA = (x) => x * x + 2, fB = (x) => -x * x + 2 * x;
      const A = hide(G.fn(fA, { color: BL, width: 3.2 })), B = hide(G.fn(fB, { color: PU, width: 3.2 }));
      const la = hide(G.label(-2.1, fA(-2.1), `<span class="u8l8-gl u8l8-bl">${T('y=x^2+2')}</span>`, { pos: 'e', dx: 8 }));
      const lb = hide(G.label(2.6, fB(2.6), `<span class="u8l8-gl u8l8-pu">${T('y=-x^2+2x')}</span>`, { pos: 'e', dx: 6 }));
      const gap = hide(G.segment([0.5, 0.75], [0.5, 2.25], { color: RD, width: 3, ends: ['arrow', 'arrow'] }));
      const gl = hide(G.label(0.5, 1.5, `<span class="u8l8-nope">gap ${T('1.5')}</span>`, { pos: 'e', dx: 10 }));
      const stp = stampAt(stage, 'No solution', false, RW / 2 + 30, 410, -6);
      return [
        { cap: '<b>Step 1.</b> Two parabolas: one opens up, one opens down. Set the right sides equal.',
          run: async (c) => { await show(c, rs[0]); await drawShow(c, G, A, 700); await show(c, la); await drawShow(c, G, B, 700); await show(c, lb); } },
        { cap: '<b>Step 2.</b> Collect on one side: $2x^2-2x+2=0$, so $a=2$, $b=-2$, $c=2$.', run: (c) => show(c, rs[1]) },
        { cap: '<b>Step 3.</b> $b^2-4ac=(-2)^2-4(2)(2)=4-16=-12$. Negative: <b>no</b> real roots.',
          run: async (c) => { await show(c, rs[2]); setMeter(-12, null); await show(c, meter); await pulse(c, meter, 1.05); } },
        { cap: '<b>Step 4.</b> No real roots, so the parabolas <b>never meet</b>: no solution. The closest they get is a gap of $1.5$ above $x=\\tfrac12$.',
          run: async (c) => { await show(c, rs[3]); await drawShow(c, G, gap, 500); await show(c, gl); await stampShow(c, stp, false); } }
      ];
    }
    // e3: break-even and profit
    const R = (x) => -2 * x * x + 60 * x, C = (x) => 10 * x + 200;
    const reg = hide(region(G, C, R, { from: 5, to: 20, color: GR, op: 0.22 }));
    const gR = hide(G.fn(R, { color: BL, width: 3.2 })), gC = hide(G.fn(C, { color: PU, width: 3.2 }));
    const lR = hide(G.label(26.5, R(26.5), `<span class="u8l8-gl u8l8-bl">${T('R')}</span>`, { pos: 'ne' }));
    const lC = hide(G.label(27, C(27), `<span class="u8l8-gl u8l8-pu">${T('C')}</span>`, { pos: 'nw', dy: -4 }));
    const pA = hide(G.point(5, 250, { color: AM, r: 7.5, label: T('(5,\\ 250)'), pos: 'nw' })), pB = hide(G.point(20, 400, { color: AM, r: 7.5, label: T('(20,\\ 400)'), pos: 'se' }));
    const sh = hide(G.shadeX(5, 20, { openA: true, openB: true, color: GR }));
    const pl = hide(G.label(12.5, 330, `<span class="u8l8-gl u8l8-gr">profit</span>`, { pos: 'c' }));
    const stp = stampAt(stage, '500 to 2000 items', true, RW / 2 + 20, 410, -4);
    return [
      { cap: '<b>Step 1.</b> Revenue (blue) and cost (purple), both in hundreds of dollars. Break even where $R=C$.',
        run: async (c) => { await show(c, rs[0]); await drawShow(c, G, gR, 800); await show(c, lR); await drawShow(c, G, gC, 600); await show(c, lC); } },
      { cap: '<b>Step 2.</b> One side $0$: $-2x^2+50x-200=0$. Divide every term by $-2$: $x^2-25x+100=0$.', run: (c) => show(c, rs[1]) },
      { cap: '<b>Step 3.</b> Factor: $(x-5)(x-20)=0$. (The discriminant $625-400=225$ is positive: two break-even points.)',
        run: async (c) => { await show(c, rs[2]); setMeter(225, null); await show(c, meter); } },
      { cap: '<b>Step 4.</b> $x=5$: $C=250$; $x=20$: $C=400$. Break even at <b>500 items ($\\$25\\,000$)</b> and <b>2000 items ($\\$40\\,000$)</b>.',
        run: async (c) => { await show(c, rs[3]); await popIn(c, pA); await popIn(c, pB); } },
      { cap: '<b>Step 5.</b> Profit where $R\\gt C$: the revenue curve is <b>above</b> the cost line between the break-even points. Dividing by $-2$ reversed the sign: $x^2-25x+100\\lt0$, so $5\\lt x\\lt20$.',
        run: async (c) => { await show(c, rs[4]); reg.style.opacity = ''; await fadeIn(c, reg, 500); await show(c, pl); await drawShow(c, G, sh, 700); await stampShow(c, stp, true); } }
    ];
  }
});

/* =============================== explainer: signs from the chart and the graph =============================== */
const SG = {
  e7a: { label: 'Example 7(a): sign chart', ask: 'Example 7(a): solve $2x^2-x-15\\ge0$ with a sign chart.',
    f: (x) => 2 * x * x - x - 15, win: { xmin: -5, xmax: 5, ymin: -18, ymax: 15, ystep: 3, ylabels: 6 },
    rows: ['<b>Factor</b> $ac=-30$: $-6+5$, $(x-3)(2x+5)\\ge0$', '<b>Zeros</b> $x=-\\tfrac52,\\ 3$ (included: $\\ge$)', '<b>Factor signs</b> test $x=-3,\\ 0,\\ 4$',
      '<b>Product</b> $+,\\ 0,\\ -,\\ 0,\\ +$', '<b>Answer</b> $\\{x\\mid x\\le-\\tfrac52\\text{ or }x\\ge3,\\ x\\in\\mathbb{R}\\}$', '<b>Graph check</b> on or above the $x$-axis'],
    zeros: [[-2.5, '-\\tfrac52'], [3, '3']], open: false, ivs: [[-Infinity, -2.5], [3, Infinity]],
    head: ['x', 'x\\lt-\\tfrac52', '-\\tfrac52', 'between', '3', 'x\\gt3'],
    chart: [['2x+5', ['-', '0', '+', '+', '+']], ['x-3', ['-', '-', '-', '0', '+']], ['\\text{Product}', ['+', '0', '-', '0', '+']]] },
  e7b: { label: 'Example 7(b): from the graph', ask: 'Example 7(b): use the graph of $y=x^2+2x-3$ (Example 5) to solve $x^2+2x-3\\lt0$.',
    f: (x) => x * x + 2 * x - 3, win: { xmin: -5, xmax: 3, ymin: -5, ymax: 6 },
    rows: ['<b>Meaning</b> where is $y=x^2+2x-3$ <b>below</b> the $x$-axis?', '<b>Intercepts</b> $x=-3,\\ 1$ (not included: $\\lt$)', '<b>Below</b> between the intercepts', '<b>Answer</b> $\\{x\\mid -3\\lt x\\lt1,\\ x\\in\\mathbb{R}\\}$'],
    zeros: [[-3, '-3'], [1, '1']], open: true, ivs: [[-3, 1]] }
};
const signs = mdDef({
  title: 'Signs from the chart and the graph',
  height: 440, minW: 940, capH: 84,
  choices: Object.keys(SG).map((k) => ({ v: k, label: SG[k].label })),
  ask: (v) => SG[v].ask,
  make(stage, v, ex) {
    const d = SG[v], W = ex.W, GW = 430, GX = W - GW - 6, RW = GX - 22, w = d.win;
    const G = new Graph(stage, Object.assign({ x: GX, y: 4, width: GW, height: 300, fontSize: 14 }, w));
    const N = new NumberLine(stage, { x: GX, y: 318, width: GW, height: 110, min: w.xmin, max: w.xmax, step: 1, pad: 18, axisY: 52, fontSize: 16 });
    const nlT = div(stage, 'u8l8-nlt', 'solution', GX + 4, 312);
    const ys = d.chart ? [4, 42, 80, 118, 156, 194] : [8, 64, 120, 176];
    const rs = d.rows.map((t, i) => row(stage, i + 1, t, 8, ys[i], RW, d.chart ? 'u8l8-xs' : 'u8l8-sm'));
    const curve = hide(G.fn(d.f, { color: BL, width: 3 }));
    const zG = d.zeros.map(([z]) => hide(G.point(z, 0, { color: GR, r: 7, open: d.open })));
    const zN = d.zeros.map(([z, lab]) => { const p = N.point(z, { color: GR, open: d.open, r: 8, label: T(lab) }); hide(p); return p; });
    const ivN = d.ivs.map(([a, b]) => hide(N.interval(a, b, { color: GR, openA: d.open, openB: d.open, width: 7 })));
    const glow = d.chart
      ? [hide(G.fn(d.f, { color: GR, width: 7, from: w.xmin, to: -2.5 })), hide(G.fn(d.f, { color: GR, width: 7, from: 3, to: w.xmax }))]
      : [hide(G.fn(d.f, { color: GR, width: 7, from: -3, to: 1 }))];
    const band = d.chart ? null : hide(G.shadeX(-3, 1, { openA: true, openB: true, color: GR }));
    let cells = null, tbw = null;
    if (d.chart) {
      const tb = h('table', 'u8l8-tb');
      tb.innerHTML = `<tr>${d.head.map((x) => `<th>${/^[a-z]+$/.test(x) && x !== 'x' ? x : T(x)}</th>`).join('')}</tr>` +
        d.chart.map((r) => `<tr><th>${T(r[0])}</th>${r[1].map(() => '<td></td>').join('')}</tr>`).join('');
      cells = d.chart.map((r, i) => [...tb.rows[i + 1].cells].slice(1));
      tbw = hide(div(stage, 'u8l8-tbw', '', 8, 238, RW)); tbw.appendChild(tb);
    }
    const ans = d.chart ? null : hide(div(stage, 'u8l8-ans', T('\\{x\\mid -3\\lt x\\lt1,\\ x\\in\\mathbb{R}\\}'), 8, 262, RW));
    const fill = async (c, i) => {
      for (let j = 0; j < 5; j++) {
        const s = d.chart[i][1][j], cell = cells[i][j];
        cell.textContent = s === '-' ? '−' : s; cell.className = i === 2 ? (s === '+' ? 'p' : s === '-' ? 'n' : 'z') : '';
        await pop(c, cell, 260);
      }
    };
    const popZeros = async (c) => { for (let i = 0; i < zN.length; i++) { await popIn(c, zN[i]); } };
    if (d.chart) return [
      { cap: '<b>Step 1.</b> One side is already $0$. Factor with $ac=-30$: the numbers $-6$ and $5$ give $2x(x-3)+5(x-3)=(x-3)(2x+5)$.', run: (c) => show(c, rs[0]) },
      { cap: '<b>Step 2.</b> The zeros $-\\tfrac52$ and $3$ split the number line into three intervals. $\\ge$ includes them: closed dots.',
        run: async (c) => { await show(c, rs[1]); await popZeros(c); } },
      { cap: '<b>Step 3.</b> The sign of each factor in each interval: test $x=-3$, $0$ and $4$. At its zero a factor is $0$.',
        run: async (c) => { await show(c, rs[2]); await show(c, tbw); await fill(c, 0); await fill(c, 1); } },
      { cap: '<b>Step 4.</b> Multiply the signs down each column: $(-)(-)=+$, $(+)(-)=-$, $(+)(+)=+$.', run: async (c) => { await show(c, rs[3]); await fill(c, 2); } },
      { cap: '<b>Step 5.</b> $\\ge0$: the <b>positive</b> intervals and the zeros. $\\{x\\mid x\\le-\\tfrac52\\text{ or }x\\ge3,\\ x\\in\\mathbb{R}\\}$',
        run: async (c) => { await show(c, rs[4]); for (const iv of ivN) await drawShow(c, N, iv, 600); } },
      { cap: '<b>Step 6.</b> Check with the graph of $y=2x^2-x-15$: it is on or <b>above</b> the $x$-axis exactly where the product is $+$ or $0$.',
        run: async (c) => { await show(c, rs[5]); await drawShow(c, G, curve, 800); for (const p of zG) await popIn(c, p); for (const g of glow) await drawShow(c, G, g, 500); } }
    ];
    return [
      { cap: '<b>Step 1.</b> $x^2+2x-3\\lt0$ asks: where is $y=x^2+2x-3$ <b>negative</b>? On the graph, that is <b>below</b> the $x$-axis.',
        run: async (c) => { await show(c, rs[0]); await drawShow(c, G, curve, 800); } },
      { cap: '<b>Step 2.</b> The $x$-intercepts $-3$ and $1$ (from $(x+3)(x-1)$). $\\lt$ does not include them: open dots.',
        run: async (c) => { await show(c, rs[1]); for (const p of zG) await popIn(c, p); await popZeros(c); } },
      { cap: '<b>Step 3.</b> Between the intercepts the parabola is below the axis. Drop that part straight down onto the $x$-axis.',
        run: async (c) => { await show(c, rs[2]); await drawShow(c, G, glow[0], 600); await drawShow(c, G, band, 600); } },
      { cap: '<b>Step 4.</b> So $\\{x\\mid -3\\lt x\\lt1,\\ x\\in\\mathbb{R}\\}$. No sign chart needed: the graph shows every sign at once.',
        run: async (c) => { await show(c, rs[3]); await drawShow(c, N, ivN[0], 600); await show(c, ans); } }
    ];
  }
});

/* =============================== explainer (STAR): which region? a whole-class round =============================== */
const P1 = (x) => x / 2 - 2, P2 = (x) => -x * x + 4, P2w = (x) => x * x - 4, P3 = (x) => x * x - 2 * x - 3, P3w = (x) => x * x + 2 * x - 3, P5 = (x) => x * x - 2;
const RG = {
  r1: { label: 'Round 1', ask: 'Round 1: which graph shows $x-2y\\gt4$?', hd: ['Boundary', 'Test point'], ans: 2,
    opts: [{ reg: [P1, null], b: [[P1, false, PU]], out: 't', tag: '$(0,\\ 0)$ shaded ✗' }, { reg: [null, P1], b: [[P1, true, PU]], out: 'b', tag: 'solid ✗' },
      { reg: [null, P1], b: [[P1, false, PU]] }, { reg: [P1, null], b: [[P1, true, PU]], out: 'b', tag: 'solid ✗' }],
    b: '$y\\lt\\tfrac12x-2$: dashed', t: '$(0,\\ 0)$: $0-0\\gt4$ false',
    c2: 'Solve for $y$: $-2y\\gt-x+4$, and dividing by $-2$ <b>reverses</b> the sign: $y\\lt\\tfrac12x-2$. No “or equal”, so the boundary is <b>dashed</b>: B and D are out.',
    c3: 'Test $(0,\\ 0)$ in the original: $0-2(0)\\gt4$ is <b>false</b>, so $(0,\\ 0)$ must <b>not</b> be shaded. A shades it: out.',
    c4: '<b>C.</b> A dashed line, shaded below. Forgetting to reverse the sign gives A.' },
  r2: { label: 'Round 2', ask: 'Round 2: which graph shows $y\\le-x^2+4$?', hd: ['Boundary', 'Test point'], ans: 0,
    opts: [{ reg: [null, P2], b: [[P2, true]] }, { reg: [null, P2], b: [[P2, false]], out: 'b', tag: 'dashed ✗' },
      { reg: [P2, null], b: [[P2, true]], out: 't', tag: '$(0,\\ 0)$ not shaded ✗' }, { reg: [null, P2w], b: [[P2w, true]], out: 'b', tag: 'opens up ✗' }],
    b: 'vertex $(0,\\ 4)$, opens down, solid', t: '$(0,\\ 0)$: $0\\le4$ true',
    c2: 'The boundary $y=-x^2+4$ opens <b>down</b> from its vertex $(0,\\ 4)$, through $(\\pm2,\\ 0)$. $\\le$ includes it: <b>solid</b>. B (dashed) and D (opens up) are out.',
    c3: 'Test $(0,\\ 0)$: $0\\le-0^2+4$ is <b>true</b>, so $(0,\\ 0)$ must be shaded. C shades the outside: out.',
    c4: '<b>A.</b> A solid parabola, shaded below (inside): $y\\le\\dots$ is below the boundary.' },
  r3: { label: 'Round 3', ask: 'Round 3: which graph shows $y\\gt x^2-2x-3$?', hd: ['Boundary', 'Test point'], ans: 3,
    opts: [{ reg: [P3w, null], b: [[P3w, false]], out: 'b', tag: 'wrong intercepts ✗' }, { reg: [P3, null], b: [[P3, true]], out: 'b', tag: 'solid ✗' },
      { reg: [null, P3], b: [[P3, false]], out: 't', tag: '$(0,\\ 0)$ not shaded ✗' }, { reg: [P3, null], b: [[P3, false]] }],
    b: '$(x-3)(x+1)$, vertex $(1,\\ -4)$, dashed', t: '$(0,\\ 0)$: $0\\gt-3$ true',
    c2: '$x^2-2x-3=(x-3)(x+1)$: $x$-intercepts $-1$ and $3$, vertex $(1,\\ -4)$. $\\gt$: <b>dashed</b>. A has the wrong intercepts and B is solid: out.',
    c3: 'Test $(0,\\ 0)$: $0\\gt0-0-3$ is <b>true</b>, so $(0,\\ 0)$ is shaded. C shades the outside, away from it: out.',
    c4: '<b>D.</b> A dashed parabola, shaded above (inside).' },
  r4: { label: 'Round 4', ask: 'Round 4: which number line shows the solution of $x^2+x-12\\ge0$?', hd: ['Endpoints', 'Test value'], ans: 1, nl: true,
    opts: [{ iv: [[-4, 3, false, false]], out: 't', tag: '$0$ is in it ✗' }, { iv: [[-Infinity, -4, false, false], [3, Infinity, false, false]] },
      { iv: [[-Infinity, -4, true, true], [3, Infinity, true, true]], out: 'b', tag: 'open dots ✗' }, { iv: [[-Infinity, -3, false, false], [4, Infinity, false, false]], out: 'b', tag: 'wrong roots ✗' }],
    b: '$(x+4)(x-3)\\ge0$: $-4$, $3$ included', t: '$x=0$: $-12\\ge0$ false',
    c2: 'Factor: $(x+4)(x-3)\\ge0$, roots $-4$ and $3$. $\\ge$ <b>includes</b> them: closed dots. C (open dots) and D (roots $-3$ and $4$) are out.',
    c3: 'Test $x=0$: $0+0-12\\ge0$ is <b>false</b>, so $0$ is <b>not</b> in the solution. A contains $0$: out.',
    c4: '<b>B.</b> $\\{x\\mid x\\le-4\\text{ or }x\\ge3,\\ x\\in\\mathbb{R}\\}$: outside the roots, as for any $a\\gt0$ with $\\ge$.' },
  r5: { label: 'Round 5', ask: 'Round 5: how many solutions does the system $y=x^2-2$, $y=2x-3$ have?', hd: ['Substitute', 'Discriminant'], ans: 1, count: true,
    opts: [{ b: [[P5, true], [(x) => 2 * x - 6, true, PU]], sub: '0 solutions', out: 't', tag: '✗' },
      { b: [[P5, true], [(x) => 2 * x - 3, true, PU]], pts: [[1, -1]], sub: '1 solution' },
      { b: [[P5, true], [(x) => 2 * x - 1, true, PU]], pts: [[1 - Math.SQRT2, -1 - 2 * Math.SQRT2], [1 + Math.SQRT2, 1 + 2 * Math.SQRT2]], sub: '2 solutions', out: 't', tag: '✗' },
      { b: [[P5, true], [P5, true, PU, true]], sub: 'infinitely many', out: 'b', tag: 'never for a line ✗' }],
    b: '$x^2-2=2x-3$: $x^2-2x+1=0$', t: '$b^2-4ac=4-4=0$: one',
    c2: 'Substitute: $x^2-2=2x-3$, so $x^2-2x+1=0$. A line and a parabola are never the same graph: D is out.',
    c3: '$b^2-4ac=(-2)^2-4(1)(1)=0$: exactly <b>one</b> solution. A and C are out.',
    c4: '<b>B.</b> $(x-1)^2=0$: $x=1$, $y=-1$. The line is <b>tangent</b> to the parabola at $(1,\\ -1)$.' },
  r6: { label: 'Round 6: boss', ask: 'Boss round: which graph shows <b>both</b> $y\\ge x^2-4$ and $y\\le2$?', hd: ['Boundaries', 'Test point'], ans: 2,
    opts: [{ reg: [P2w, () => 2], b: [[P2w, false], [() => 2, false, PU]], out: 'b', tag: 'dashed ✗' },
      { reg: [(x) => Math.max(2, P2w(x)), null], b: [[P2w, true], [() => 2, true, PU]], out: 't', tag: '$(0,\\ 0)$ not shaded ✗' },
      { reg: [P2w, () => 2], b: [[P2w, true], [() => 2, true, PU]] },
      { reg: [null, (x) => Math.min(2, P2w(x))], b: [[P2w, true], [() => 2, true, PU]], out: 't', tag: '$(0,\\ 0)$ not shaded ✗' }],
    b: 'both solid: $y=x^2-4$ and $y=2$', t: '$(0,\\ 0)$: $0\\ge-4$ ✓ and $0\\le2$ ✓',
    c2: 'Both signs include “or equal”, so <b>both</b> boundaries are solid. A is dashed: out.',
    c3: 'Test $(0,\\ 0)$ in <b>both</b>: $0\\ge-4$ is true and $0\\le2$ is true, so $(0,\\ 0)$ is in the region. B and D leave it out.',
    c4: '<b>C.</b> The solution is where the two shadings <b>overlap</b>: above the parabola and below the line $y=2$.' }
};
const LET = ['A', 'B', 'C', 'D'];
const regionRound = mdDef({
  title: 'Which region?',
  height: 400, minW: 940, capH: 84,
  choices: Object.keys(RG).map((k) => ({ v: k, label: RG[k].label })),
  ask: (v) => RG[v].ask,
  make(stage, v, ex) {
    const d = RG[v], W = ex.W, n = 4;
    const pans = [], tags = [], tps = [];
    if (d.nl) {
      d.opts.forEach((o, i) => {
        const y = 6 + i * 62, p = div(stage, 'u8l8-pan u8l8-nlp', `<span class="u8l8-let">${LET[i]}</span>`, 8, y, W - 16, 56); hide(p);
        const N = new NumberLine(p, { x: 56, y: -4, width: 620, height: 62, min: -6, max: 6, step: 1, axisY: 26, fontSize: 15 });
        o.iv.forEach(([a, b, oa, ob]) => { N.interval(a, b, { color: BL, openA: oa, openB: ob, width: 6 }); });
        const tp = N.point(0, { color: AM, r: 7 }); hide(tp); tps.push(tp);
        tags.push(hide(div(p, 'u8l8-tag', md(o.tag || ''), 700, 12)));
        pans.push(p);
      });
    } else {
      const PW = 222, gap = Math.min(16, (W - 16 - n * PW) / (n - 1)), x0 = (W - (n * PW + (n - 1) * gap)) / 2;
      d.opts.forEach((o, i) => {
        const p = div(stage, 'u8l8-pan', '', x0 + i * (PW + gap), 4, PW, d.count ? 252 : 236); hide(p);
        const G = new Graph(p, { x: 0, y: 0, width: PW, height: PW, xmin: -5, xmax: 5, ymin: -5, ymax: 5, xlabels: 2, ylabels: 2, fontSize: 12, fnArrows: false, xtitle: '', ytitle: '' });
        if (o.reg) region(G, o.reg[0], o.reg[1], { color: BL, op: 0.24 });
        o.b.forEach(([f, solid, color, over]) => G.fn(f, { color: color || BL, width: over ? 3 : 2.8, dash: solid ? (over ? '6 6' : false) : true }));
        (o.pts || []).forEach(([x, y]) => G.point(x, y, { color: AM, r: 6 }));
        add(p, h('span', 'u8l8-let', LET[i]));
        if (o.sub) add(p, h('div', 'u8l8-psub', o.sub));
        const tp = d.count ? null : hide(G.point(0, 0, { color: AM, r: 7 })); tps.push(tp);
        tags.push(hide(div(p, 'u8l8-tag', md(o.tag || ''), 0, d.count ? 196 : 182, PW)));
        pans.push(p);
      });
    }
    const BW = (W - 28) / 2;
    const b1 = hide(div(stage, 'u8l8-chk', `<div class="u8l8-chh"><span class="u8l8-cn">1</span>${d.hd[0]}</div><div class="u8l8-chb">${md(d.b)}</div>`, 8, 266, BW));
    const b2 = hide(div(stage, 'u8l8-chk', `<div class="u8l8-chh"><span class="u8l8-cn">2</span>${d.hd[1]}</div><div class="u8l8-chb">${md(d.t)}</div>`, 20 + BW, 266, BW));
    const pa = pans[d.ans], st = stampAt(stage, 'Answer ✓', true, 0, 0, -6);
    if (d.nl) { st.style.left = (W - 150) + 'px'; st.style.top = (6 + d.ans * 62 + 28) + 'px'; }
    else { st.style.left = (parseFloat(pa.style.left) + 111) + 'px'; st.style.top = '120px'; }
    const knock = async (c, kind) => {
      const outs = d.opts.map((o, i) => (o.out === kind ? i : -1)).filter((i) => i >= 0);
      for (const i of outs) { pans[i].classList.add('out'); await show(c, tags[i]); await shake(c, tags[i]); }
    };
    return [
      { cap: `<b>${d.label.replace(': boss', '')}.</b> ${d.count ? 'How many solutions?' : 'Which picture is right?'} Vote: hold up 1, 2, 3 or 4 fingers for A, B, C or D.`,
        run: async (c) => { for (const p of pans) { p.style.opacity = ''; await pop(c, p); await sleep(c, 120); } } },
      { cap: d.c2, run: async (c) => { await show(c, b1); await knock(c, 'b'); } },
      { cap: d.c3, run: async (c) => {
        await show(c, b2);
        if (!d.count) for (let i = 0; i < n; i++) if (d.opts[i].out !== 'b' && tps[i]) { tps[i].style.opacity = ''; await pop(c, tps[i]); }
        await knock(c, 't');
      } },
      { cap: d.c4, run: async (c) => { pa.classList.add('win'); await pulse(c, pa, 1.04); await stampShow(c, st, true); } }
    ];
  }
});

/* =============================== Stand Up Break ===============================
 * BEG solve a linear–quadratic system (integer points), PRG a quadratic inequality in one variable (set notation),
 * MAS find k for a tangent line and the point of tangency. */
const sg = (n) => (n < 0 ? '-' + -n : '+' + n);
const poly = (cs, vs) => { let out = ''; cs.forEach((k, i) => { if (!k) return; const m = Math.abs(k), vv = vs[i]; out += (k < 0 ? '-' : out ? '+' : '') + (vv ? (m === 1 ? '' : m) + vv : m); }); return out || '0'; };
const quad = (a, b, c) => poly([a, b, c], ['x^2', 'x', '']);
const lin = (m, d) => poly([m, d], ['x', '']);
const fac = (r) => (r === 0 ? 'x' : `(x${sg(-r)})`);
standup('u8l8', {
  intro: 'At your whiteboard: one side 0, factor, and every answer checked (points in both equations, intervals with a test value).',
  levels: {
    BEG: (r) => {
      for (let t = 0; t < 300; t++) {
        let r1 = r.int(-5, 5), r2 = r.int(-5, 5); const m = r.int(-3, 3), d = r.int(-6, 6);
        if (r1 === r2 || !m) continue;
        if (r2 === 0) [r1, r2] = [r2, r1]; else if (r1 !== 0 && r1 > r2) [r1, r2] = [r2, r1];
        const b = m - r1 - r2, c = r1 * r2 + d;
        if (Math.abs(b) > 9 || Math.abs(c) > 20) continue;
        const pt = (x) => `(${x},\\ ${m * x + d})`;
        return { text: 'Solve the system algebraically, and verify.', q: `y=${quad(1, b, c)},\\qquad y=${lin(m, d)}`,
          a: [`${quad(1, b, c)}=${lin(m, d)}`, `${quad(1, -(r1 + r2), r1 * r2)}=0`, `${fac(r1)}${fac(r2)}=0`, `${pt(Math.min(r1, r2))}\\ \\text{and}\\ ${pt(Math.max(r1, r2))}`] };
      }
      return { text: 'Solve the system algebraically, and verify.', q: 'y=x^2-4x+1,\\qquad y=2x-4', a: ['x^2-4x+1=2x-4', 'x^2-6x+5=0', '(x-1)(x-5)=0', '(1,\\ -2)\\ \\text{and}\\ (5,\\ 6)'] };
    },
    PRG: (r) => {
      for (let t = 0; t < 300; t++) {
        const p = r.int(-7, 6), q = r.int(p + 1, 8), sgn = r.pick(['\\lt', '\\le', '\\gt', '\\ge']);
        if (q > 8) continue;
        const b = -(p + q), c = p * q, moved = c !== 0 && r.chance(0.4);
        const qq = moved ? `${quad(1, b, 0)}${sgn}${-c}` : `${quad(1, b, c)}${sgn}0`;
        const incl = sgn === '\\le' || sgn === '\\ge', inside = sgn === '\\lt' || sgn === '\\le', op = incl ? '\\le' : '\\lt';
        const set = inside ? `\\{x\\mid ${p}${op}x${op}${q},\\ x\\in\\mathbb{R}\\}` : `\\{x\\mid x${op}${p}\\text{ or }x${incl ? '\\ge' : '\\gt'}${q},\\ x\\in\\mathbb{R}\\}`;
        const fp = p === 0 ? 'x' : fac(p), fq = q === 0 ? 'x' : fac(q), f2 = p === 0 ? `${fp}${fq}` : q === 0 ? `${fq}${fp}` : `${fp}${fq}`;
        return { text: 'Solve. Write the solution in set notation.', q: qq,
          a: [...(moved ? [`${quad(1, b, c)}${sgn}0`] : []), `${f2}${sgn}0`, `\\text{roots } ${p},\\ ${q}`, set] };
      }
      return { text: 'Solve. Write the solution in set notation.', q: 'x^2-x-6\\le0', a: ['(x+2)(x-3)\\le0', '\\text{roots } -2,\\ 3', '\\{x\\mid -2\\le x\\le3,\\ x\\in\\mathbb{R}\\}'] };
    },
    MAS: (r) => {
      for (let t = 0; t < 300; t++) {
        const b = r.int(-4, 4), c = r.int(-3, 6), s = r.int(-3, 3);
        if (!s) continue;
        const m = b + 2 * s, k = c - s * s;
        if (!m || Math.abs(m) > 8) continue;
        const mx = m === 1 ? 'x' : m === -1 ? '-x' : m + 'x', bm = b - m;
        return { text: 'Determine <i>k</i> so that the line is tangent to the parabola, and find the point of tangency.', q: `y=${quad(1, b, c)},\\qquad y=${mx}+k`,
          a: [`${quad(1, b, c)}=${mx}+k`, `${poly([1, bm], ['x^2', 'x'])}+(${c}-k)=0`, `(${bm})^2-4(1)(${c}-k)=0`, `${bm * bm}-${4 * c < 0 ? '(' + 4 * c + ')' : 4 * c}+4k=0\\ \\Rightarrow\\ k=${k}`,
            `${fac(s)}^2=0:\\ x=${s},\\ y=${m * s + k}`, `\\text{point of tangency }(${s},\\ ${m * s + k})`] };
      }
      return { text: 'Determine <i>k</i> so that the line is tangent to the parabola, and find the point of tangency.', q: 'y=x^2-4x+1,\\qquad y=2x+k', a: ['x^2-6x+(1-k)=0', '36-4(1-k)=0\\ \\Rightarrow\\ k=-8', '(x-3)^2=0:\\ x=3,\\ y=-2', '\\text{point of tangency }(3,\\ -2)'] };
    }
  }
});

/* =============================== mount =============================== */
export const explainers = mountExplainers({ meet, signs, region: regionRound });
export const _test = { MT, SG, RG };
