/* Math 20-1 · Unit 6 · Lesson 2 — Simplifying Rational Expressions by Factoring.
 * New lesson format (2026-11-11): the warm-up is plain markup on the page (no code), and the explainers are
 *   simp (the one procedure: ① factor the numerator and the denominator, with Ryan's X for every trinomial (ac on top,
 *     b underneath, the pairs listed and the right one circled) and the split-and-group lines when a ≠ 1, ② the NPVs
 *     drop out of the ORIGINAL denominator, ③ matching factors light up in the same colour and are struck out,
 *     ④ the answer with its NPVs; 18/24 and Example 1(a), 3(a), 3(b), 3(d), 4(a), 4(b) checks),
 *   verdict (STAR, "cancel factors, not terms": Work A and Work B side by side, a test number in the original and in
 *     both answers, verdict stamps, then number buttons the class can tap to test again; (x + 6)/(x + 2), Example 2),
 *   opp (opposites: a same-or-opposite sorter with a test value and stamps; −1 out of a trinomial with the signs
 *     flipping (Example 5(d)); two flips vs one flip with equivalent / opposite stamps (Example 7(b), (c))),
 *   geo (the garden drawn to scale with an x slider: width = area ÷ length, x > 1/2, the square at x = 6, x = 3 + √2;
 *     the box with SA, V and the ratio SA : V for x = 3 and x = 6).
 * Colours: NPVs red, matching factors blue / purple, finished answers green, the X blue. Calculator allowed. */
import {
  h, tex, add, box, mountExplainers, pop, fadeIn, sleep, anim, svgEl, pulse, stamp, stampIn, shake, tween, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const RD = COLORS.red, GR = COLORS.green, BL = COLORS.blue, PU = COLORS.purple, AM = COLORS.amber;
const cr = (s) => `\\textcolor{${RD}}{${s}}`, cg = (s) => `\\textcolor{${GR}}{${s}}`;
const X_ = (s) => `\\textcolor{${RD}}{\\cancel{${s}}}`;
/** captions and asks may hold $…$ TeX */
const md = (s) => (typeof s === 'string' ? s.replace(/\$([^$]+)\$/g, (_, t) => T(t)) : s);
function mdDef(def) {
  const mk = def.make, a = def.ask;
  def.make = function (stage, v, ex) { return (mk.call(this, stage, v, ex) || []).map((st) => Object.assign(st, { cap: typeof st.cap === 'string' ? md(st.cap) : st.cap })); };
  if (typeof a === 'function') def.ask = (v) => md(a(v)); else if (typeof a === 'string') def.ask = md(a);
  return def;
}
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const show = (c, el, ms = 320) => fadeIn(c, el, ms);
const appear = (c, el, ms = 300) => anim(c, el, [{ opacity: 0 }, { opacity: 1 }], ms);
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
/** a reduced fraction as TeX ("3", "-\frac{3}{2}") */
function frac(n, d) {
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(n, d); n /= g; d /= g;
  return d === 1 ? String(n) : n < 0 ? `-\\frac{${-n}}{${d}}` : `\\frac{${n}}{${d}}`;
}
const badge = (stage, n, x, y) => hide(div(stage, 'u6l2-n', String(n), x, y));

/* ============================== Ryan's X (2026-11-11) ==============================
 * ac on top, b underneath, the two numbers on the sides; the factor pairs listed beside it, the right one circled. */
function xBlock(stage, svg, x0, y0, w, d) {
  const r = 52, cx = x0 + 60, cy = y0 + 82, RH = 31;
  const g = svgEl('g', {}, svg); g.style.opacity = 0;
  [[cx - r, cy - r, cx + r, cy + r], [cx + r, cy - r, cx - r, cy + r]].forEach(([x1, y1, x2, y2]) => svgEl('line', { x1, y1, x2, y2, stroke: BL, 'stroke-width': 5, 'stroke-linecap': 'round' }, g));
  const v = (cls, html, x, y) => { const e = hide(div(stage, 'u6l2-xv ' + cls, html, x, y)); e.style.translate = '-50% -50%'; return e; };
  const la = v('u6l2-xlab', T('ac'), cx, cy - r - 15), lb = v('u6l2-xlab', T('b'), cx, cy + r + 16);
  const top = v('u6l2-xtop', T(String(d.top)), cx, cy - r * 0.6), bot = v('u6l2-xbot', T(String(d.bot)), cx, cy + r * 0.62);
  const found = d.pairs.findIndex(([p, q]) => p + q === d.bot), [m, n] = d.pairs[found];
  const L = v('u6l2-xside', T(String(m)), cx - r * 0.7, cy), R = v('u6l2-xside', T(String(n)), cx + r * 0.7, cy);
  const ry = cy - (d.pairs.length * RH) / 2;
  const rows = d.pairs.map(([p, q], i) => hide(div(stage, 'u6l2-xp', `<span>${T(`${p}\\times${q < 0 ? `(${q})` : q}`)}</span><span class="u6l2-xps">${T(`\\text{sum }${p + q}`)}</span>`, x0 + 126, ry + i * RH, w - 130, RH - 4)));
  const els = [g, la, lb, top, bot, L, R, ...rows];
  return {
    els, m, n, H: Math.max(2 * r + 64, d.pairs.length * RH + 16),
    async play(c) {
      await appear(c, g); await show(c, la); await pop(c, top); await show(c, lb); await pop(c, bot);
      for (const e of rows) await show(c, e, 160);
      rows.forEach((e, i) => e.classList.add(i === found ? 'u6l2-ok' : 'u6l2-no'));
      await pulse(c, rows[found], 1.06); await pop(c, L); await pop(c, R);
    }
  };
}

/* =============================== explainer: simp (the procedure) =============================== */
const tl = (t, k, z) => ({ t, k, z });
const SIMP = {
  n1824: { label: 'The fraction 18/24', ask: 'Simplify $\\dfrac{18}{24}$.',
    num: [tl('3'), '·', tl('6', 'A')], den: [tl('4'), '·', tl('6', 'A')],
    fac: [{ tiles: 'both', head: 'Factor the top and the bottom', parts: [{ cap: '<b>Factor</b> the top and the bottom: $18=3\\cdot6$ and $24=4\\cdot6$.', items: [{ l: '18=3\\cdot6' }, { l: '24=4\\cdot6' }] }] }],
    npvCap: 'NPVs come from the denominator. A number fraction has no variable, so there are <b>no NPVs</b>.', npv: '',
    divCap: '<b>Divide out</b> the common factor: $\\dfrac{6}{6}=1$.', dv: '\\dfrac{6}{6}=1',
    ans: '\\dfrac{3}{4}', end: '$\\dfrac{18}{24}=\\dfrac{3}{4}$. A rational expression is simplified <b>the same way</b>.' },
  e1a: { label: 'Example 1(a) check', ask: 'Example 1(a): simplify $\\dfrac{18x^5}{24x^2}$. State the NPVs.',
    num: [tl('6x^2', 'A'), '·', tl('3x^3')], den: [tl('6x^2', 'A', 'x\\ne0'), '·', tl('4')],
    fac: [{ tiles: 'both', head: 'Common factor (GCF)', parts: [{ cap: '<b>Factor</b>: the GCF of the top and the bottom is $6x^2$. $18x^5=6x^2\\cdot3x^3$ and $24x^2=6x^2\\cdot4$.', items: [{ l: '18x^5=6x^2\\cdot3x^3' }, { l: '24x^2=6x^2\\cdot4' }] }] }],
    npvCap: '<b>NPVs</b> from the original denominator: $24x^2=0$ when $x=0$, so $x\\ne0$.', npv: 'x\\ne0',
    divCap: '<b>Divide out</b> the common factor: $\\dfrac{6x^2}{6x^2}=1$.', dv: '\\dfrac{6x^2}{6x^2}=1',
    ans: '\\dfrac{3x^3}{4}', end: 'Answer: $\\dfrac{3x^3}{4}$, $x\\ne0$. The NPV stays, even though $x$ is gone from the bottom.' },
  e3a: { label: 'Example 3(a) check', ask: 'Example 3(a): simplify $\\dfrac{4x-20}{x^2-25}$. State the NPVs.',
    num: [tl('4'), tl('(x-5)', 'A')], den: [tl('(x-5)', 'A', 'x\\ne5'), tl('(x+5)', null, 'x\\ne-5')],
    fac: [{ tiles: 'num', head: 'Numerator: common factor', parts: [{ cap: '<b>Factor</b> the numerator: the common factor is $4$. $4x-20=4(x-5)$.', items: [{ l: '4x-20=4(x-5)' }] }] },
      { tiles: 'den', head: 'Denominator: difference of squares', parts: [{ cap: 'The denominator is a <b>difference of squares</b>: $x^2-5^2=(x-5)(x+5)$.', items: [{ l: 'x^2-25=x^2-5^2' }, { l: '=(x-5)(x+5)' }] }] }],
    npvCap: '<b>NPVs</b> from the original denominator: $x-5=0$ and $x+5=0$ give $x\\ne\\pm5$.', npv: 'x\\ne\\pm5',
    divCap: '<b>Divide out</b> the common factor: $\\dfrac{x-5}{x-5}=1$.', dv: '\\dfrac{x-5}{x-5}=1',
    ans: '\\dfrac{4}{x+5}', end: 'Answer: $\\dfrac{4}{x+5}$, $x\\ne\\pm5$. The NPV $x\\ne5$ stays, even though $(x-5)$ is gone.' },
  e3b: { label: 'Example 3(b) check', ask: 'Example 3(b): simplify $\\dfrac{x^2+2x-24}{x^2-7x+12}$. State the NPVs.',
    num: [tl('(x+6)'), tl('(x-4)', 'A')], den: [tl('(x-3)', null, 'x\\ne3'), tl('(x-4)', 'A', 'x\\ne4')],
    fac: [{ tiles: 'num', head: 'Numerator: the X', parts: [{ cap: 'Numerator: the X. $ac=-24$ on top, $b=2$ underneath. The pair with sum $2$ is $-4$ and $6$: $(x+6)(x-4)$.', items: [{ x: { top: -24, bot: 2, pairs: [[-1, 24], [-2, 12], [-3, 8], [-4, 6]] } }, { l: 'x^2+2x-24=(x+6)(x-4)' }] }] },
      { tiles: 'den', head: 'Denominator: the X', parts: [{ cap: 'Denominator: $ac=12$ on top, $b=-7$ underneath. Both numbers are negative: $-3$ and $-4$, so $(x-3)(x-4)$.', items: [{ x: { top: 12, bot: -7, pairs: [[-1, -12], [-2, -6], [-3, -4]] } }, { l: 'x^2-7x+12=(x-3)(x-4)' }] }] }],
    npvCap: '<b>NPVs</b> from the original denominator: $x-3=0$ and $x-4=0$ give $x\\ne3,\\ 4$.', npv: 'x\\ne3,\\ 4',
    divCap: '<b>Divide out</b> the common factor: $\\dfrac{x-4}{x-4}=1$.', dv: '\\dfrac{x-4}{x-4}=1',
    ans: '\\dfrac{x+6}{x-3}', end: 'Answer: $\\dfrac{x+6}{x-3}$, $x\\ne3,\\ 4$. Both NPVs stay.' },
  e3d: { label: 'Example 3(d) check', ask: 'Example 3(d): simplify $\\dfrac{2x^2+7x-15}{4x^2-9}$. State the NPVs.',
    num: [tl('(2x-3)', 'A'), tl('(x+5)')], den: [tl('(2x-3)', 'A', 'x\\ne\\frac{3}{2}'), tl('(2x+3)', null, 'x\\ne-\\frac{3}{2}')],
    fac: [{ tiles: 'num', head: 'Numerator: decomposition', parts: [
      { cap: 'Numerator: $a=2$, so <b>decomposition</b>. The X: $ac=2(-15)=-30$ on top, $b=7$ underneath. The pair is $10$ and $-3$.', items: [{ x: { top: -30, bot: 7, pairs: [[-1, 30], [-2, 15], [-3, 10], [-5, 6]] } }] },
      { cap: 'Split $7x$ into $10x-3x$, group, and take out the common bracket: $(2x-3)(x+5)$.', items: [{ l: '2x^2+10x-3x-15' }, { l: '=2x(x+5)-3(x+5)' }, { l: '=(2x-3)(x+5)' }] }] },
    { tiles: 'den', head: 'Denominator: difference of squares', parts: [{ cap: 'The denominator is a <b>difference of squares</b>: $(2x)^2-3^2=(2x-3)(2x+3)$.', items: [{ l: '4x^2-9=(2x)^2-3^2' }, { l: '=(2x-3)(2x+3)' }] }] }],
    npvCap: '<b>NPVs</b> from the original denominator: $2x-3=0$ gives $x=\\frac{3}{2}$, and $2x+3=0$ gives $x=-\\frac{3}{2}$.', npv: 'x\\ne\\pm\\frac{3}{2}',
    divCap: '<b>Divide out</b> the common factor: $\\dfrac{2x-3}{2x-3}=1$.', dv: '\\dfrac{2x-3}{2x-3}=1',
    ans: '\\dfrac{x+5}{2x+3}', end: 'Answer: $\\dfrac{x+5}{2x+3}$, $x\\ne\\pm\\frac{3}{2}$.' },
  e4a: { label: 'Example 4(a) check', ask: 'Example 4(a): simplify $\\dfrac{6a^2+13a+6}{3a^2-4a-4}$. State the NPVs.',
    num: [tl('(2a+3)'), tl('(3a+2)', 'A')], den: [tl('(3a+2)', 'A', 'a\\ne-\\frac{2}{3}'), tl('(a-2)', null, 'a\\ne2')],
    fac: [{ tiles: 'num', head: 'Numerator: decomposition', parts: [
      { cap: 'Numerator: the X. $ac=6(6)=36$ on top, $b=13$ underneath. Both positive: $4$ and $9$.', items: [{ x: { top: 36, bot: 13, pairs: [[1, 36], [2, 18], [3, 12], [4, 9], [6, 6]] } }] },
      { cap: 'Split $13a$ into $9a+4a$ and group: $(2a+3)(3a+2)$.', items: [{ l: '6a^2+9a+4a+6' }, { l: '=3a(2a+3)+2(2a+3)' }, { l: '=(2a+3)(3a+2)' }] }] },
    { tiles: 'den', head: 'Denominator: decomposition', parts: [
      { cap: 'Denominator: $ac=3(-4)=-12$ on top, $b=-4$ underneath. One of each sign: $2$ and $-6$.', items: [{ x: { top: -12, bot: -4, pairs: [[1, -12], [2, -6], [3, -4]] } }] },
      { cap: 'Split $-4a$ into $-6a+2a$ and group: $(3a+2)(a-2)$.', items: [{ l: '3a^2-6a+2a-4' }, { l: '=3a(a-2)+2(a-2)' }, { l: '=(3a+2)(a-2)' }] }] }],
    npvCap: '<b>NPVs</b> from the original denominator: $3a+2=0$ gives $a=-\\frac{2}{3}$, and $a-2=0$ gives $a=2$.', npv: 'a\\ne-\\frac{2}{3},\\ 2',
    divCap: '<b>Divide out</b> the common factor: $\\dfrac{3a+2}{3a+2}=1$.', dv: '\\dfrac{3a+2}{3a+2}=1',
    ans: '\\dfrac{2a+3}{a-2}', end: 'Answer: $\\dfrac{2a+3}{a-2}$, $a\\ne-\\frac{2}{3},\\ 2$.' },
  e4b: { label: 'Example 4(b) check', ask: 'Example 4(b): simplify $\\dfrac{x^3-4x}{x^3+x^2-6x}$. State the NPVs.',
    num: [tl('x', 'A'), tl('(x-2)', 'B'), tl('(x+2)')], den: [tl('x', 'A', 'x\\ne0'), tl('(x+3)', null, 'x\\ne-3'), tl('(x-2)', 'B', 'x\\ne2')],
    fac: [{ tiles: 'num', head: 'Numerator: common factor first', parts: [{ cap: 'Numerator: <b>common factor first</b>, $x$. Then $x^2-4$ is a difference of squares: $x(x-2)(x+2)$.', items: [{ l: 'x^3-4x=x(x^2-4)' }, { l: '=x(x-2)(x+2)' }] }] },
      { tiles: 'den', head: 'Denominator: GCF, then the X', parts: [{ cap: 'Denominator: common factor $x$, then the X for $x^2+x-6$: $-6$ on top, $1$ underneath. The pair is $-2$ and $3$.', items: [{ l: 'x^3+x^2-6x=x(x^2+x-6)' }, { x: { top: -6, bot: 1, pairs: [[-1, 6], [-2, 3]] } }, { l: '=x(x+3)(x-2)' }] }] }],
    npvCap: '<b>NPVs</b> from the original denominator: $x=0$, $x+3=0$ and $x-2=0$ give $x\\ne0,\\ 2,\\ -3$.', npv: 'x\\ne0,\\ 2,\\ -3',
    divCap: '<b>Divide out</b> both common factors: $\\dfrac{x}{x}=1$ and $\\dfrac{x-2}{x-2}=1$.', dv: '\\dfrac{x}{x}=1,\\quad\\dfrac{x-2}{x-2}=1',
    ans: '\\dfrac{x+2}{x+3}', end: 'Answer: $\\dfrac{x+2}{x+3}$, $x\\ne0,\\ 2,\\ -3$. All three NPVs stay.' }
};
function tileRow(row, items, cls) {
  const tiles = [];
  items.forEach((it) => {
    if (typeof it === 'string') { row.appendChild(h('div', 'u6l2-dot', it)); return; }
    const t = h('div', 'u6l2-ft', `<div class="u6l2-ftc">${T(it.t)}</div>`);
    const sl = h('div', 'u6l2-sl'); t.appendChild(sl); t.sl = sl; t.key = it.k;
    if (it.z) { t.tag = hide(h('div', 'u6l2-z', T(it.z))); t.appendChild(t.tag); }
    row.appendChild(t); tiles.push(t);
  });
  row.classList.add(cls);
  return tiles;
}
const simp = {
  title: 'Factor, NPVs, divide out',
  height: 430, minW: 960,
  choices: Object.keys(SIMP).map((k) => ({ v: k, label: SIMP[k].label })),
  ask: (v) => SIMP[v].ask,
  make(stage, v, ex) {
    const d = SIMP[v], W = ex.W, PW = 340, PX = W - PW - 8, FX = 66;
    const pan = div(stage, 'u6l2-pan', '', PX, 6, PW, 418);
    const svg = svgEl('svg', { width: W, height: 430 }, stage); svg.style.cssText = 'position:absolute;left:0;top:0;pointer-events:none;overflow:visible';
    // the factored fraction: numerator tiles over denominator tiles
    const fr = div(stage, 'u6l2-fr', '', FX, 10);
    const rn = h('div', 'u6l2-row'), rd = h('div', 'u6l2-row'); fr.append(rn, rd);
    const nt = tileRow(rn, d.num, 'u6l2-num'), dt = tileRow(rd, d.den, 'u6l2-den');
    hide(rn); hide(rd);
    const b1 = badge(stage, 1, 16, 44), b2 = badge(stage, 2, 16, 172), b3 = badge(stage, 3, 16, 254), b4 = badge(stage, 4, 16, 344);
    const npvEl = hide(div(stage, 'u6l2-npv', d.npv ? `NPVs from the original denominator: ${T(cr(d.npv))}` : 'No variable: no NPVs', FX, 164));
    const dvEl = hide(div(stage, 'u6l2-dv', `Divide out: ${T(d.dv)}`, FX, 236));
    const ansEl = hide(div(stage, 'u6l2-ans', T(`=${cg(d.ans)}`) + (d.npv ? `<span class="u6l2-ansn">${T(cr(d.npv))}</span>` : ''), FX, 324));
    // the panel: one group of working per polynomial, each laid out from the top of the panel
    const groups = d.fac.map((g) => {
      let y = 16; const head = hide(div(stage, 'u6l2-ph', g.head, PX + 14, y)); y += 40;
      const parts = g.parts.map((p) => p.items.map((it) => {
        if (it.l) { const e = hide(div(stage, 'u6l2-pl', T(it.l), PX + 14, y)); y += 40; return { els: [e], play: (c) => show(c, e) }; }
        const X = xBlock(stage, svg, PX + 8, y - 6, PW - 16, it.x); y += X.H; return { els: X.els, play: (c) => X.play(c) };
      }));
      return { g, head, parts, all: [head, ...parts.flat().flatMap((i) => i.els)] };
    });
    const steps = [];
    groups.forEach((G, gi) => G.parts.forEach((items, pi) => steps.push({
      cap: G.g.parts[pi].cap,
      run: async (c) => {
        if (pi === 0) {
          if (gi > 0) groups[gi - 1].all.forEach((e) => { e.style.opacity = 0; });
          if (gi === 0) await pop(c, b1);
          await show(c, G.head);
        }
        for (const it of items) await it.play(c);
        if (pi === G.parts.length - 1) {
          const rows = G.g.tiles === 'both' ? [rn, rd] : G.g.tiles === 'num' ? [rn] : [rd];
          for (const r of rows) await show(c, r, 380);
        }
      }
    })));
    steps.push({ cap: d.npvCap, run: async (c) => {
      await pop(c, b2);
      for (const t of dt) if (t.tag) await pop(c, t.tag);
      await show(c, npvEl);
    } });
    const pairs = nt.filter((t) => t.key).map((t) => [t, dt.find((u) => u.key === t.key)]);
    steps.push({ cap: d.divCap, run: async (c) => {
      await pop(c, b3);
      for (const [a, b] of pairs) {
        a.classList.add('u6l2-k' + a.key); b.classList.add('u6l2-k' + b.key);
        await Promise.all([pulse(c, a, 1.12), pulse(c, b, 1.12)]);
        for (const t of [a, b]) { await anim(c, t.sl, [{ transform: 'rotate(-24deg) scaleX(0)' }, { transform: 'rotate(-24deg) scaleX(1)' }], 260); t.classList.add('u6l2-gone'); }
      }
      await show(c, dvEl);
    } });
    steps.push({ cap: d.end, run: async (c) => { await pop(c, b4); await show(c, ansEl, 420); } });
    return steps;
  }
};

/* =============================== explainer: verdict (STAR) =============================== */
/* f: [numerator, denominator] as functions of x; z: values the work says are not allowed */
const VD = {
  c1: { label: '(x + 6)/(x + 2)', ask: 'Simplify $\\dfrac{x+6}{x+2}$. Which work is right?', o: [(x) => x + 6, (x) => x + 2], ot: '\\dfrac{x+6}{x+2}',
    A: { lines: [`\\dfrac{${X_('x')}+6}{${X_('x')}+2}`, '=\\dfrac{6}{2}=3'], note: 'crossed out the $x$ on top and the $x$ on the bottom', f: [() => 3, () => 1] },
    B: { lines: ['\\dfrac{x+6}{x+2}'], note: 'no common factor: already in simplest form, $x\\ne-2$', f: [(x) => x + 6, (x) => x + 2], z: [-2] },
    capA: '<b>Work A</b> crosses out the $x$ on top and the $x$ on the bottom, and gets $3$.',
    capB: '<b>Work B</b> looks for a common <b>factor</b> of the whole top and the whole bottom. There is none, so it stays.',
    t: 2, sA: ['✗ not equal', false], sB: ['✓ equal', true],
    end: 'Only B agrees with the original. A divided out <b>terms</b> (parts joined by $+$ or $-$). Only <b>factors</b> can be divided out.' },
  e2a: { label: 'Example 2(a) check', ask: 'Example 2(a): is $\\dfrac{x+8}{4}=x+2$?', o: [(x) => x + 8, () => 4], ot: '\\dfrac{x+8}{4}',
    A: { lines: ['\\dfrac{x+8}{4}=x+2'], note: 'divided only the term $8$ by $4$', f: [(x) => x + 2, () => 1] },
    B: { lines: ['\\dfrac{x+8}{4}'], note: '$4$ is not a factor of $x+8$: already in simplest form (no NPVs)', f: [(x) => x + 8, () => 4] },
    capA: '<b>Work A</b> divides the $8$ by $4$ and leaves the $x$ alone: $x+2$.',
    capB: '<b>Work B</b>: $x+8$ and $4$ have no common factor, so $\\dfrac{x+8}{4}$ is already in simplest form.',
    t: 4, sA: ['✗ not equal', false], sB: ['✓ equal', true],
    end: '$4$ is not a factor of the <b>whole</b> numerator, so nothing can be divided out. B is right.' },
  e2b: { label: 'Example 2(b) check', ask: 'Example 2(b): is $\\dfrac{3x+12}{3}=x+12$?', o: [(x) => 3 * x + 12, () => 3], ot: '\\dfrac{3x+12}{3}',
    A: { lines: ['\\dfrac{3x+12}{3}=x+12'], note: 'divided the $3$ out of only one term', f: [(x) => x + 12, () => 1] },
    B: { lines: ['\\dfrac{3(x+4)}{3}', '=x+4'], note: 'factored first, then divided out the $3$ (no NPVs)', f: [(x) => x + 4, () => 1] },
    capA: '<b>Work A</b> divides $3x$ by $3$ but not the $12$: $x+12$.',
    capB: '<b>Work B</b> factors first: $3x+12=3(x+4)$. Now $3$ is a factor of the whole top: $x+4$.',
    t: 1, sA: ['✗ not equal', false], sB: ['✓ equal', true],
    end: 'Factor <b>first</b>, then divide out. A divided the $3$ out of only one term.' },
  e2c: { label: 'Example 2(c) check', ask: 'Example 2(c): is $\\dfrac{x^2-25}{x-5}=x-5$?', o: [(x) => x * x - 25, (x) => x - 5], ot: '\\dfrac{x^2-25}{x-5}',
    A: { lines: ['\\dfrac{x^2-25}{x-5}=x-5'], note: '“cancelled” the squares: $x^2$ with $x$, and $25$ with $5$', f: [(x) => x - 5, () => 1] },
    B: { lines: ['\\dfrac{(x-5)(x+5)}{x-5}', '=x+5,\\ x\\ne5'], note: 'difference of squares, then divided out $(x-5)$', f: [(x) => x + 5, () => 1], z: [5] },
    capA: '<b>Work A</b> “cancels” the squares: $x^2$ with $x$ and $25$ with $5$, and gets $x-5$.',
    capB: '<b>Work B</b> factors the difference of squares first: $(x-5)(x+5)$, then divides out $(x-5)$.',
    t: 3, sA: ['✗ not equal', false], sB: ['✓ equal', true],
    end: '$x^2$ and $25$ are <b>terms</b>, not factors. B is right: $x+5$, $x\\ne5$.' },
  e2d: { label: 'Example 2(d) check', ask: 'Example 2(d): is $\\dfrac{x^2+4x}{x}=x+4$?', o: [(x) => x * x + 4 * x, (x) => x], ot: '\\dfrac{x^2+4x}{x}',
    A: { lines: ['\\dfrac{x(x+4)}{x}=x+4'], note: 'right working, no NPV', f: [(x) => x + 4, () => 1] },
    B: { lines: ['\\dfrac{x(x+4)}{x}', '=x+4,\\ x\\ne0'], note: 'right working, with the NPV from the original denominator', f: [(x) => x + 4, () => 1], z: [0] },
    capA: '<b>Work A</b> factors and divides out $x$: $x+4$.',
    capB: '<b>Work B</b> does the same, and states the NPV $x\\ne0$ from the original denominator.',
    t: 0, sA: ['! NPV missing', null], sB: ['✓ right', true],
    end: 'The working is right, but $x=0$ makes the original denominator $0$. A says $4$, so A is missing the NPV $x\\ne0$.' }
};
function valOf(f, x, z) {
  if (z && z.includes(x)) return { s: '\\text{not allowed}', v: null, na: true };
  const n = f[0](x), dd = f[1](x);
  if (dd === 0) return { s: `\\dfrac{${n}}{0}`, v: null, und: true };
  return { s: frac(n, dd), v: n / dd };
}
function origTex(d, x) {
  const n = d.o[0](x), dd = d.o[1](x);
  if (dd === 0) return `\\dfrac{${n}}{0}\\ \\text{is undefined}`;
  return dd === 1 ? String(n) : `\\dfrac{${n}}{${dd}}=${frac(n, dd)}`;
}
function mark(o, r) {
  if (o.v == null) return r.na ? ['✓ not allowed either', 'ok'] : ['✗ but the original is undefined', 'no'];
  if (r.na || r.v == null) return ['✗ different', 'no'];
  return Math.abs(o.v - r.v) < 1e-12 ? ['✓ same', 'ok'] : ['✗ different', 'no'];
}
const verdict = {
  title: 'Cancel factors, not terms',
  height: 430, minW: 960, capH: 92,
  choices: Object.keys(VD).map((k) => ({ v: k, label: VD[k].label })),
  ask: (v) => VD[v].ask,
  make(stage, v, ex) {
    const d = VD[v], W = ex.W, PW = Math.floor((W - 44) / 2), PY = 78, PH = 262;
    const ban = hide(div(stage, 'u6l2-vb', '', 16, 6, W - 32, 62));
    const mkPanel = (x, lab, w) => {
      const p = div(stage, 'u6l2-vp', `<div class="u6l2-vh">${lab}</div>`, x, PY, PW, PH);
      const lines = w.lines.map((l) => hide(div(p, 'u6l2-vl', T(l))));
      const note = hide(div(p, 'u6l2-vn', md(w.note)));
      const val = hide(div(p, 'u6l2-vv', ''));
      return { p, lines, note, val };
    };
    const A = mkPanel(16, 'Work A', d.A), B = mkPanel(28 + PW, 'Work B', d.B);
    const stA = hide(stamp(stage, d.sA[0], { ok: d.sA[1], x: 16 + PW - 96, y: PY + 34 })), stB = hide(stamp(stage, d.sB[0], { ok: d.sB[1], x: 28 + PW * 2 - 96, y: PY + 34 }));
    const tryRow = hide(div(stage, 'u6l2-try no-ink', '<span>Tap a number to test it:</span>', 16, 356, W - 32));
    const setX = (x) => {
      const o = valOf(d.o, x), a = valOf(d.A.f, x, d.A.z), b = valOf(d.B.f, x, d.B.z);
      ban.innerHTML = `Test ${T(`x=${x}`)} in the original: ${T(`${d.ot}=${origTex(d, x)}`)}`;
      [[A, a], [B, b]].forEach(([P, r]) => {
        const [m, k] = mark(o, r);
        P.val.innerHTML = `${T(`x=${x}`)} gives ${T(r.s)} <span class="u6l2-vm u6l2-vm-${k}">${m}</span>`;
      });
      tryRow.querySelectorAll('button').forEach((bt) => bt.classList.toggle('on', Number(bt.dataset.x) === x));
    };
    [-3, -2, -1, 0, 1, 2, 3, 4, 5, 10].forEach((x) => { const bt = h('button', 'u6l2-tb', T(String(x))); bt.type = 'button'; bt.dataset.x = x; bt.onclick = () => setX(x); tryRow.appendChild(bt); });
    setX(d.t);
    const o0 = valOf(d.o, d.t), a0 = valOf(d.A.f, d.t, d.A.z), b0 = valOf(d.B.f, d.t, d.B.z);
    const said = (r) => (r.na ? 'says it is <b>not allowed</b>' : `gives $${r.s}$`);
    return [
      { cap: d.capA, run: async (c) => { for (const e of A.lines) await show(c, e); await show(c, A.note); } },
      { cap: d.capB, run: async (c) => { for (const e of B.lines) await show(c, e); await show(c, B.note); } },
      { cap: o0.v == null ? `Test a number in the <b>original</b>: $x=${d.t}$ makes its denominator $0$. The original is <b>undefined</b> there.`
        : `Test a number in the <b>original</b>: $x=${d.t}$ gives $${frac(d.o[0](d.t), d.o[1](d.t))}$.`, run: (c) => show(c, ban) },
      { cap: `Work A ${said(a0)}; Work B ${said(b0)}.`, run: async (c) => { await show(c, A.val); await show(c, B.val); } },
      { cap: d.end, run: async (c) => { await stampIn(c, stA); await stampIn(c, stB); } },
      { cap: 'Tap other numbers to test them. A right simplification agrees with the original for <b>every</b> permissible value.', run: (c) => show(c, tryRow) }
    ];
  }
};

/* =============================== explainer: opp (opposite binomials) =============================== */
const SO = [
  { t: '\\dfrac{x-7}{7-x}', flip: '7-x=-(x-7)', tv: 'x=10', tr: '\\dfrac{3}{-3}=-1', res: -1, cap: '$7-x$ is $x-7$ with <b>every sign flipped</b>: $7-x=-(x-7)$. Opposites divide to $-1$ ($x\\ne7$).' },
  { t: '\\dfrac{3+x}{x+3}', flip: '3+x=x+3', tv: 'x=10', tr: '\\dfrac{13}{13}=1', res: 1, cap: '$3+x$ and $x+3$ are the <b>same</b>: you can add in any order. They divide to $1$, not $-1$.' },
  { t: '\\dfrac{x-5}{x+5}', flip: '', tv: 'x=10', tr: '\\dfrac{5}{15}=\\dfrac{1}{3}', res: 0, cap: '$x-5$ and $x+5$: only <b>one</b> sign differs. Not the same, not opposites. This one does <b>not</b> simplify.' },
  { t: '\\dfrac{-x-2}{x+2}', flip: '-x-2=-(x+2)', tv: 'x=10', tr: '\\dfrac{-12}{12}=-1', res: -1, cap: 'Every sign of $x+2$ is flipped in $-x-2$: $-x-2=-(x+2)$. Opposites: $-1$ ($x\\ne-2$).' },
  { t: '\\dfrac{y-x}{x-y}', flip: 'y-x=-(x-y)', tv: 'x=10,\\ y=4', tr: '\\dfrac{-6}{6}=-1', res: -1, cap: 'Two variables work the same way: $y-x=-(x-y)$. Opposites: $-1$ ($x\\ne y$).' }
];
function sorter(stage, ex) {
  const W = ex.W, n = SO.length, gap = 12, CW = Math.floor((W - 32 - gap * (n - 1)) / n);
  const cards = SO.map((s, i) => {
    const cd = div(stage, 'u6l2-sc', `<div class="u6l2-scf">${T(s.t)}</div>`, 16 + i * (CW + gap), 14, CW, 340);
    const fl = hide(div(cd, 'u6l2-scl', s.flip ? T(s.flip) : 'not the same,<br>not opposites'));
    const tv = hide(div(cd, 'u6l2-sct', `${T(s.tv)}<br>${T(s.tr)}`));
    const st = hide(stamp(cd, s.res === -1 ? 'opposites: −1' : s.res === 1 ? 'same: 1' : 'neither', { ok: s.res === -1 ? null : s.res === 1, x: CW / 2, y: 292, size: 'sm' }));
    return { cd, fl, tv, st };
  });
  const sum = hide(div(stage, 'u6l2-ssum', `To spot opposites: <b>every</b> sign is flipped. Factor ${T('-1')} out of one of them, then divide out.`, 16, 372, W - 32));
  const steps = SO.map((s, i) => ({ cap: s.cap, run: async (c) => {
    cards.forEach((k, j) => k.cd.classList.toggle('u6l2-cur', j === i));
    const k = cards[i]; await show(c, k.fl); await show(c, k.tv); await stampIn(c, k.st);
  } }));
  steps.push({ cap: 'A quotient of <b>opposites</b> is $-1$. The <b>same</b> binomial in a new order gives $1$. Anything else does not divide out.', run: async (c) => { cards.forEach((k) => k.cd.classList.remove('u6l2-cur')); await show(c, sum); } });
  return steps;
}
/** a line of tokens; returns { el, k: {id: span} } */
function tokLine(host, x, y, toks, cls = '') {
  const el = div(host, 'u6l2-tl ' + cls, '', x, y), k = {};
  toks.forEach((t) => { const s = h('span', 'u6l2-tk' + (t.c ? ' ' + t.c : ''), T(t.t)); if (t.id) k[t.id] = s; if (t.hid) s.style.opacity = 0; el.appendChild(s); });
  return { el, k };
}
async function flipSign(c, el, to) {
  await anim(c, el, [{ transform: 'rotateX(0deg)' }, { transform: 'rotateX(90deg)' }], 180);
  el.innerHTML = to ? T(to) : ''; el.classList.add('u6l2-flipped');
  await anim(c, el, [{ transform: 'rotateX(90deg)' }, { transform: 'rotateX(0deg)' }], 180);
}
function trinFlip(stage, ex) {
  const W = ex.W, LX = 330;
  const q = div(stage, 'u6l2-big2', T('\\dfrac{12+x-x^2}{2x^2-7x-4}'), 20, 120);
  const lab = div(stage, 'u6l2-olab', 'numerator', LX + 44, 2);
  const r1 = tokLine(stage, LX + 44, 26, [{ t: '12', c: 'u6l2-c3' }, { t: '+x', c: 'u6l2-c2' }, { t: '-x^2', c: 'u6l2-c1' }]);
  const r2 = tokLine(stage, LX + 44, 84, [{ t: '=' }, { t: '-x^2', c: 'u6l2-c1' }, { t: '+x', c: 'u6l2-c2' }, { t: '+12', c: 'u6l2-c3' }]);
  const r3 = tokLine(stage, LX + 44, 142, [{ t: '=' }, { t: '-\\big(', id: 'open', hid: true, c: 'u6l2-red' }, { t: '-', id: 's1' }, { t: 'x^2', c: 'u6l2-c1' }, { t: '+', id: 's2' }, { t: 'x', c: 'u6l2-c2' }, { t: '+', id: 's3' }, { t: '12', c: 'u6l2-c3' }, { t: '\\big)', id: 'close', hid: true, c: 'u6l2-red' }]);
  const r4 = hide(div(stage, 'u6l2-tl', T('=-(x-4)(x+3)'), LX + 44, 200));
  const r5 = hide(div(stage, 'u6l2-tl', `<span class="u6l2-olab2">denominator</span> ${T('2x^2-7x-4=(2x+1)(x-4)')}`, LX + 44, 258));
  const r6 = hide(div(stage, 'u6l2-tl u6l2-fin', T(`\\dfrac{-${X_('(x-4)')}(x+3)}{(2x+1)${X_('(x-4)')}}=${cg('-\\dfrac{x+3}{2x+1}')},\\ ${cr('x\\ne-\\frac{1}{2},\\ 4')}`), LX + 44, 320));
  [r2.el, r3.el].forEach(hide);
  const bs = [84, 142, 200, 258, 330].map((y, i) => badge(stage, i + 1, LX, y + 4));
  return [
    { cap: 'The numerator has a <b>negative</b> $x^2$ term. First write it in descending order: $-x^2+x+12$.', run: async (c) => { await pop(c, bs[0]); await show(c, r2.el); } },
    { cap: '<b>Take out $-1$</b>: every sign inside the bracket flips. $-x^2+x+12=-(x^2-x-12)$.', run: async (c) => {
      await pop(c, bs[1]); await show(c, r3.el);
      await pop(c, r3.k.open); await flipSign(c, r3.k.s1, ''); await flipSign(c, r3.k.s2, '-'); await flipSign(c, r3.k.s3, '-'); await pop(c, r3.k.close);
    } },
    { cap: 'Now factor the trinomial inside the bracket as usual: $x^2-x-12=(x-4)(x+3)$.', run: async (c) => { await pop(c, bs[2]); await show(c, r4); } },
    { cap: 'Factor the denominator (decomposition): $(2x+1)(x-4)$. NPVs from it: $x\\ne-\\frac{1}{2},\\ 4$.', run: async (c) => { await pop(c, bs[3]); await show(c, r5); } },
    { cap: 'Divide out $(x-4)$. The $-1$ stays in front: $-\\dfrac{x+3}{2x+1}$, $x\\ne-\\frac{1}{2},\\ 4$.', run: async (c) => { await pop(c, bs[4]); await show(c, r6, 420); } }
  ];
}
function twoFlips(stage, ex) {
  const W = ex.W, CW = Math.floor((W - 44) / 2);
  const col = (x, lab, t) => div(stage, 'u6l2-vp u6l2-ep', `<div class="u6l2-vh">${lab}</div><div class="u6l2-vl">${T(t)}</div>`, x, 8, CW, 300);
  const Pb = col(16, '(b)', '\\dfrac{3-x}{-x-2}'), Pc = col(28 + CW, '(c)', '\\dfrac{3-x}{x+2}');
  const b2 = hide(div(Pb, 'u6l2-vl', T(`=\\dfrac{${cr('-')}(x-3)}{${cr('-')}(x+2)}`)));
  const b3 = hide(div(Pb, 'u6l2-vl', T(`=${cg('\\dfrac{x-3}{x+2}')}`) + ' <span class="u6l2-vn2">two flips divide to 1</span>'));
  const c2 = hide(div(Pc, 'u6l2-vl', T(`=\\dfrac{${cr('-')}(x-3)}{x+2}`)));
  const c3 = hide(div(Pc, 'u6l2-vl', T(`=${cr('-\\dfrac{x-3}{x+2}')}`) + ' <span class="u6l2-vn2">one flip: the opposite</span>'));
  const sb = hide(stamp(stage, '✓ equivalent', { ok: true, x: 16 + CW - 100, y: 46 })), sc = hide(stamp(stage, '✗ opposite', { ok: false, x: 28 + 2 * CW - 100, y: 46 }));
  const tr = hide(div(stage, 'u6l2-vb', `Check ${T('x=0')}: &nbsp;${T('\\dfrac{x-3}{x+2}=-\\frac{3}{2}')}, &nbsp; (b) ${T('\\dfrac{3}{-2}=-\\frac{3}{2}')} ✓, &nbsp; (c) ${T('\\dfrac{3}{2}')} ✗`, 16, 328, W - 32, 70));
  return [
    { cap: '(b): the top $3-x=-(x-3)$ and the bottom $-x-2=-(x+2)$. <b>Both</b> are flipped.', run: (c) => show(c, b2) },
    { cap: 'The two $-1$s divide to $1$: $\\dfrac{x-3}{x+2}$. <b>Equivalent</b> (for $x\\ne-2$).', run: async (c) => { await show(c, b3); await stampIn(c, sb); } },
    { cap: '(c): only the top is flipped, so it is $-\\dfrac{x-3}{x+2}$: the <b>opposite</b> of $\\dfrac{x-3}{x+2}$, not the same.', run: async (c) => { await show(c, c2); await show(c, c3); await stampIn(c, sc); } },
    { cap: 'Check with $x=0$: $\\dfrac{x-3}{x+2}=-\\frac{3}{2}$. (b) gives $\\dfrac{3}{-2}=-\\frac{3}{2}$ ✓ and (c) gives $\\dfrac{3}{2}$ ✗.', run: (c) => show(c, tr) }
  ];
}
const OPP = {
  sort: { label: 'Same or opposite?', ask: 'Each fraction: are the top and the bottom the <b>same</b>, <b>opposites</b>, or neither?', make: sorter },
  e5d: { label: 'Example 5(d) check', ask: 'Example 5(d): simplify $\\dfrac{12+x-x^2}{2x^2-7x-4}$. State the NPVs.', make: trinFlip },
  e7: { label: 'Example 7(b), (c) check', ask: 'Example 7: is each expression equivalent to $\\dfrac{x-3}{x+2}$?', make: twoFlips }
};
const opp = {
  title: 'Opposites hide a −1',
  height: 430, minW: 960,
  choices: Object.keys(OPP).map((k) => ({ v: k, label: OPP[k].label })),
  ask: (v) => OPP[v].ask,
  make(stage, v, ex) { return OPP[v].make(stage, ex); }
};

/* =============================== explainer: geo (the garden and the box) =============================== */
const nm = (v, k = 2) => String(parseFloat(v.toFixed(k))).replace('-', '−');
function slider(stage, x, y, w, lo, hi, x0, onX) {
  const wrap = div(stage, 'u6l2-sld no-ink', '', x, y, w);
  const lab = h('div', 'u6l2-sldv', ''), inp = h('input'); inp.type = 'range'; inp.min = lo; inp.max = hi; inp.step = 0.25; inp.value = x0;
  inp.setAttribute('aria-label', 'x'); wrap.append(lab, inp);
  inp.oninput = () => onX(Number(inp.value));
  return { lab, inp };
}
function garden(stage, ex) {
  const W = ex.W, S = 26, X0 = 124, Y0 = 380, PX = 500;
  const svg = svgEl('svg', { width: 470, height: 430 }, stage); svg.style.cssText = 'position:absolute;left:0;top:0;overflow:visible';
  const rect = svgEl('rect', { x: X0, fill: '#e9f6ef', stroke: GR, 'stroke-width': 4, rx: 3 }, svg), gridG = svgEl('g', {}, svg);
  const lenL = div(stage, 'u6l2-glab', '', X0, Y0 + 8), widL = div(stage, 'u6l2-glab u6l2-glabw', '', 6, 0, 112);
  const areaL = div(stage, 'u6l2-garea', '', 0, 0); areaL.style.translate = '-50% -50%';
  const sq = hide(stamp(stage, 'a square!', { ok: true, x: 330, y: 70 }));
  let X = 2, widthKnown = false;
  const draw = (x) => {
    X = x; const L = (x + 5) * S, Wd = Math.max(0, (2 * x - 1) * S);
    rect.setAttribute('y', Y0 - Wd); rect.setAttribute('width', L); rect.setAttribute('height', Wd);
    gridG.innerHTML = '';
    for (let i = 1; i < x + 5; i++) svgEl('line', { x1: X0 + i * S, y1: Y0 - Wd, x2: X0 + i * S, y2: Y0, stroke: '#bfe2cf', 'stroke-width': 1 }, gridG);
    for (let j = 1; j < 2 * x - 1; j++) svgEl('line', { x1: X0, y1: Y0 - j * S, x2: X0 + L, y2: Y0 - j * S, stroke: '#bfe2cf', 'stroke-width': 1 }, gridG);
    lenL.style.width = L + 'px';
    lenL.innerHTML = `length ${T('(x+5)')} = ${T(nm(x + 5) + '\\text{ m}')}`;
    widL.style.top = (Y0 - Wd / 2 - 24) + 'px';
    widL.innerHTML = widthKnown ? `width<br>${T(nm(2 * x - 1) + '\\text{ m}')}` : 'width<br>?';
    const A = (x + 5) * (2 * x - 1);
    areaL.style.left = (X0 + L / 2) + 'px'; areaL.style.top = (Y0 - Wd / 2) + 'px';
    areaL.innerHTML = Wd > 34 ? `area ${T(nm(A) + '\\text{ m}^2')}` : '';
    sq.style.visibility = Math.abs(x - 6) < 1e-9 ? 'visible' : 'hidden';
    sl.lab.innerHTML = `${T('x=' + (Math.abs(x - 3 - Math.SQRT2) < 1e-9 ? '3+\\sqrt2\\approx' + nm(x) : nm(x)))}`;
    sl.inp.value = x;
  };
  const sl = slider(stage, PX, 8, W - PX - 16, 0.5, 7, 2, (x) => draw(x));
  const ln = (y, s) => hide(div(stage, 'u6l2-pl', s, PX, y));
  const g1 = ln(74, T('\\text{width}=\\dfrac{\\text{area}}{\\text{length}}=\\dfrac{2x^2+9x-5}{x+5}'));
  const g2 = ln(140, T(`=\\dfrac{(2x-1)${X_('(x+5)')}}{${X_('(x+5)')}}=${cg('2x-1')},\\ x\\ne-5`));
  const g3 = ln(206, T(`\\text{width}>0:\\ 2x-1>0,\\ ${cr('x>\\tfrac{1}{2}')}`));
  const g4 = ln(254, T('x+5=2x-1\\ \\Rightarrow\\ x=6:\\ 11\\text{ m by }11\\text{ m}'));
  const g5 = ln(302, T('x=3+\\sqrt2:\\ P=26+6\\sqrt2\\approx34.49\\text{ m}'));
  const g6 = ln(346, T('A=44+21\\sqrt2\\approx73.70\\text{ m}^2'));
  draw(2);
  const go = (c, to, ms = 1100) => { const a = X; return tween(c, ms, (t) => draw(a + (to - a) * t)); };
  return [
    { cap: 'The garden is drawn to scale, $1$ square = $1$ m². The width is unknown: <b>width = area ÷ length</b>.', run: (c) => show(c, g1) },
    { cap: 'Factor the area (decomposition, as in Example 3) and divide out $(x+5)$: the width is $2x-1$ m, $x\\ne-5$.', run: async (c) => { await show(c, g2); widthKnown = true; draw(X); await pulse(c, widL, 1.15); } },
    { cap: 'Slide $x$ down. At $x=\\frac{1}{2}$ the width $2x-1$ is $0$: no garden at all! In context, $x>\\frac{1}{2}$.', run: async (c) => { await go(c, 0.5); await show(c, g3); } },
    { cap: 'A square when length = width: $x+5=2x-1$, so $x=6$. Each side is $11$ m (check: $2(36)+54-5=121=11^2$).', run: async (c) => { await go(c, 6, 1500); await show(c, g4); if (sq.style.visibility === 'visible') await stampIn(c, sq); } },
    { cap: 'Exact values at $x=3+\\sqrt2$: length $8+\\sqrt2$, width $5+2\\sqrt2$. Perimeter $2(13+3\\sqrt2)=26+6\\sqrt2$ m, area $(8+\\sqrt2)(5+2\\sqrt2)=44+21\\sqrt2$ m².', run: async (c) => { await go(c, 3 + Math.SQRT2); await show(c, g5); await show(c, g6); } },
    { cap: 'Drag the slider: the width is always $2x-1$, and the area always equals length × width.', run: (c) => pulse(c, sl.inp, 1.05) }
  ];
}
function prism(stage, ex) {
  const W = ex.W, S = 24, BX = 150, BY = 396, PX = 500;
  const svg = svgEl('svg', { width: 470, height: 430 }, stage); svg.style.cssText = 'position:absolute;left:0;top:0;overflow:visible';
  const fTop = svgEl('polygon', { fill: '#dfe8fb', stroke: BL, 'stroke-width': 3, 'stroke-linejoin': 'round' }, svg);
  const fSide = svgEl('polygon', { fill: '#c9d7f5', stroke: BL, 'stroke-width': 3, 'stroke-linejoin': 'round' }, svg);
  const fFront = svgEl('polygon', { fill: '#eef3fd', stroke: BL, 'stroke-width': 3, 'stroke-linejoin': 'round' }, svg);
  const lb = div(stage, 'u6l2-glab', '', 0, 0), lh = div(stage, 'u6l2-glab u6l2-glabw', '', 0, 0, 110), ld = div(stage, 'u6l2-glab', '', 0, 0);
  const rd = hide(div(stage, 'u6l2-rd', '', PX, 330, W - PX - 16));
  let X = 2;
  const draw = (x) => {
    X = x; const w = x * S, ht = (x + 3) * S, dp = 0.5 * x * S * 0.707;
    const P = (pts) => pts.map((p) => p.join(',')).join(' ');
    fFront.setAttribute('points', P([[BX, BY], [BX + w, BY], [BX + w, BY - ht], [BX, BY - ht]]));
    fSide.setAttribute('points', P([[BX + w, BY], [BX + w + dp, BY - dp], [BX + w + dp, BY - ht - dp], [BX + w, BY - ht]]));
    fTop.setAttribute('points', P([[BX, BY - ht], [BX + w, BY - ht], [BX + w + dp, BY - ht - dp], [BX + dp, BY - ht - dp]]));
    lb.style.left = BX + 'px'; lb.style.top = (BY + 4) + 'px'; lb.style.width = w + 'px'; lb.innerHTML = T(`x=${nm(x)}`);
    lh.style.left = (BX - 116) + 'px'; lh.style.top = (BY - ht / 2 - 24) + 'px'; lh.innerHTML = `${T('x+3')}<br>${T('=' + nm(x + 3))}`;
    ld.style.left = (BX + w + dp / 2 + 8) + 'px'; ld.style.top = (BY - ht - dp / 2 - 30) + 'px'; ld.innerHTML = T('x');
    const SA = 6 * x * (x + 2), V = x * x * (x + 3), r = SA / V;
    rd.innerHTML = `<div>${T(`SA=${nm(SA)}\\text{ cm}^2`)} &nbsp; ${T(`V=${nm(V)}\\text{ cm}^3`)}</div><div class="u6l2-rrow"><span class="u6l2-rlab">${T(`SA\\div V\\approx${nm(r, 3)}`)}</span><div class="u6l2-rbar"><i style="width:${Math.min(100, r / 4.5 * 100)}%"></i></div></div>`;
    sl.lab.innerHTML = T('x=' + nm(x)); sl.inp.value = x;
  };
  const sl = slider(stage, PX, 8, W - PX - 16, 0.5, 8, 2, (x) => draw(x));
  const ln = (y, s) => hide(div(stage, 'u6l2-pl', s, PX, y));
  const p1 = ln(70, T('SA=2x^2+4x(x+3)=6x^2+12x=6x(x+2)'));
  const p2 = ln(112, T('V=x^2(x+3)'));
  const p3 = ln(152, T(`\\dfrac{SA}{V}=\\dfrac{6${X_('x')}(x+2)}{x\\cdot${X_('x')}(x+3)}=${cg('\\dfrac{6(x+2)}{x(x+3)}')}`));
  const p4 = ln(224, T(`${cr('x\\ne0,\\ -3')}\\ \\ (\\text{in context } x>0)`));
  const p5 = hide(div(stage, 'u6l2-pl', '', PX, 266));
  draw(2);
  const go = (c, to, ms = 1100) => { const a = X; return tween(c, ms, (t) => draw(a + (to - a) * t)); };
  return [
    { cap: 'Surface area: two square ends, $2x^2$, and four sides, $4x(x+3)$. Factored: $6x(x+2)$ cm².', run: (c) => show(c, p1) },
    { cap: 'Volume: base × height $=x^2(x+3)$ cm³.', run: (c) => show(c, p2) },
    { cap: 'The ratio: divide out the common factor $x$. $\\dfrac{SA}{V}=\\dfrac{6(x+2)}{x(x+3)}$, $x\\ne0,\\ -3$ (in context $x>0$).', run: async (c) => { await show(c, p3); await show(c, p4); } },
    { cap: '$x=3$: $\\dfrac{6(5)}{3(6)}=\\dfrac{5}{3}$. The box has $90$ cm² of surface for $54$ cm³ of volume.', run: async (c) => { await go(c, 3); await show(c, rd); p5.innerHTML = T('x=3:\\ \\dfrac{SA}{V}=\\dfrac{5}{3}'); await show(c, p5); } },
    { cap: '$x=6$: $\\dfrac{6(8)}{6(9)}=\\dfrac{8}{9}$. The larger box has <b>less surface area per unit of volume</b>.', run: async (c) => { await go(c, 6); p5.innerHTML = T('x=3:\\ \\dfrac{5}{3}\\qquad x=6:\\ \\dfrac{8}{9}'); await pulse(c, p5, 1.08); } },
    { cap: 'Drag the slider: the bigger the box, the smaller the ratio.', run: (c) => pulse(c, sl.inp, 1.05) }
  ];
}
const GEO = {
  e8: { label: 'Example 8: the garden', ask: 'Example 8: area $(2x^2+9x-5)$ m², length $(x+5)$ m. The width? A square? $x=3+\\sqrt2$?', make: garden },
  e9: { label: 'Example 9: the box', ask: 'Example 9: square base $x$ cm, height $(x+3)$ cm. $SA$, $V$ and $\\dfrac{SA}{V}$.', make: prism }
};
const geo = {
  title: 'Rational expressions you can see',
  height: 430, minW: 960,
  choices: Object.keys(GEO).map((k) => ({ v: k, label: GEO[k].label })),
  ask: (v) => GEO[v].ask,
  make(stage, v, ex) { return GEO[v].make(stage, ex); }
};

/* =============================== Stand Up Break =============================== */
const lin = (v, k) => (k === 0 ? v : v + (k > 0 ? '+' + k : String(k)));        // x+3, x-2
const trin = (v, b, c) => `${v}^2${b === 0 ? '' : b === 1 ? '+' + v : b === -1 ? '-' + v : (b > 0 ? '+' : '') + b + v}${c === 0 ? '' : (c > 0 ? '+' : '') + c}`;
const npvs = (v, vals) => `${v}\\ne ${vals.join(',\\ ')}`;
const fr2 = (n, d) => (d === 1 ? String(n) : frac(n, d));
standup('u6l2', {
  intro: 'At your whiteboard: factor the top and the bottom, state the NPVs from the original denominator, then divide out.',
  levels: {
    BEG: (r) => { // (x + p)(x + q) / ((x + p)(x + s))
      const V = r.pick(['x', 'x', 'a', 'm']), pool = [-7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7];
      const p = r.pick(pool); let q = r.pick(pool), s = r.pick(pool);
      while (s === p || s === q || q === p) { q = r.pick(pool); s = r.pick(pool); }
      return { text: 'Simplify. State the non-permissible values.', q: `\\dfrac{${trin(V, p + q, p * q)}}{${trin(V, p + s, p * s)}}`,
        a: [`\\dfrac{(${lin(V, p)})(${lin(V, q)})}{(${lin(V, p)})(${lin(V, s)})}`, `\\text{NPVs: }${npvs(V, [-p, -s])}`, `=\\dfrac{${lin(V, q)}}{${lin(V, s)}},\\ ${npvs(V, [-p, -s])}`] };
    },
    PRG: (r) => {
      if (r.chance(0.5)) { // k(x − p) / (x² − p²)
        const k = r.pick([2, 3, 4, 5, 6]), p = r.pick([1, 2, 3, 4, 5, 6, 7, 8, 9]), sg = r.pick([1, -1]);
        const top = `${k}x${sg > 0 ? '+' : '-'}${k * p}`, f = `(x${sg > 0 ? '+' : '-'}${p})`, other = `(x${sg > 0 ? '-' : '+'}${p})`;
        return { text: 'Simplify. State the non-permissible values.', q: `\\dfrac{${top}}{x^2-${p * p}}`,
          a: [`\\dfrac{${k}${f}}{(x-${p})(x+${p})}`, `\\text{NPVs: }x\\ne\\pm${p}`, `=\\dfrac{${k}}{${other.slice(1, -1)}},\\ x\\ne\\pm${p}`] };
      }
      // (ax + b)(x + c) / (a²x² − b²): decomposition on top, difference of squares below
      const a = r.pick([2, 3]), b = r.pick([1, 2, 4, 5].filter((t) => gcd(t, a) === 1)), sb = r.pick([1, -1]), cc = r.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
      const B = sb * b, A2 = a, B1 = a * cc + B, C = B * cc;
      const fac = `(${a}x${B > 0 ? '+' : '-'}${b})`, oth = `${a}x${B > 0 ? '-' : '+'}${b}`;
      return { text: 'Simplify. State the non-permissible values.', q: `\\dfrac{${A2}x^2${B1 === 0 ? '' : B1 === 1 ? '+x' : B1 === -1 ? '-x' : (B1 > 0 ? '+' : '') + B1 + 'x'}${C > 0 ? '+' : ''}${C}}{${a * a}x^2-${b * b}}`,
        a: [`\\dfrac{${fac}(${lin('x', cc)})}{(${a}x-${b})(${a}x+${b})}`, `\\text{NPVs: }x\\ne\\pm\\frac{${b}}{${a}}`, `=\\dfrac{${lin('x', cc)}}{${oth}},\\ x\\ne\\pm\\frac{${b}}{${a}}`] };
    },
    MAS: (r) => {
      if (r.chance(0.5)) { // (p² − x²) / ((x − p)(x + q)) = −(x + p)/(x + q)
        const p = r.pick([1, 2, 3, 4, 5, 6, 7]); let q = r.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
        while (q === p || q === -p) q = r.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
        return { text: 'Simplify. State the non-permissible values.', q: `\\dfrac{${p * p}-x^2}{${trin('x', q - p, -p * q)}}`,
          a: [`\\dfrac{(${p}-x)(${p}+x)}{(x-${p})(${lin('x', q)})}=\\dfrac{-(x-${p})(x+${p})}{(x-${p})(${lin('x', q)})}`, `\\text{NPVs: }x\\ne${p},\\ ${-q}`, `=-\\dfrac{x+${p}}{${lin('x', q)}},\\ x\\ne${p},\\ ${-q}`] };
      }
      // (k·p − k·x) / (x² + (s − p)x − ps) = −k/(x + s)
      const k = r.pick([2, 3, 4, 5]), p = r.pick([1, 2, 3, 4, 5, 6]); let s = r.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
      while (s === -p || s === p) s = r.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
      return { text: 'Simplify. State the non-permissible values.', q: `\\dfrac{${k * p}-${k}x}{${trin('x', s - p, -p * s)}}`,
        a: [`\\dfrac{${k}(${p}-x)}{(x-${p})(${lin('x', s)})}=\\dfrac{-${k}(x-${p})}{(x-${p})(${lin('x', s)})}`, `\\text{NPVs: }x\\ne${p},\\ ${-s}`, `=-\\dfrac{${k}}{${lin('x', s)}},\\ x\\ne${p},\\ ${-s}`] };
    }
  }
});

/* =============================== mount =============================== */
const DEFS = { simp, verdict, opp, geo };
Object.values(DEFS).forEach(mdDef);
export const explainers = mountExplainers(DEFS);
export const _test = { SIMP, VD, frac, valOf, trin, lin };
