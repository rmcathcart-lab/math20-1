/* Math 20-1 · Unit 6 · Lesson 10 — Unit 6 Review.
 * New lesson format (2026-11-11): the warm-up is plain markup on the page (no code). Explainers:
 *   npvNet  (the one NPV procedure for division, step numbers beside the steps: factor, the original denominators drop
 *            purple holes on a number line, the divisor's numerator drops teal holes BEFORE the divisor card flips,
 *            matching factors divide out in colour, the answer with every NPV; Example 2(b), 4(a), 4(b) checks),
 *   verdict (keep it or reject it: the five equation steps beside a graph of y = LS and y = RS; a kept root is where the
 *            curves meet, an extraneous one is a hole or a gap; Example 5(a), 5(b), 6(a) checks),
 *   race    (problems: the story scene moves in step with the table and the equation. Example 7: the train and the
 *            bus race 540 km with a clock; Example 8: two snowplows clear the lot from both ends and meet at 60 %),
 *   spot    (STAR, a whole-class round: seven students' work with one wrong line each; the class votes, a test number
 *            exposes the mistake, the line is stamped and the fix appears).
 * Colours (Unit 6): NPVs purple, the divisor's numerator teal, the LCD amber, kept / correct green, errors and
 * rejected roots red; on graphs LS blue, RS red. Calculator allowed. */
import {
  h, tex, add, box, Graph, NumberLine, stamp, stampIn, mountExplainers, pop, fadeIn, sleep, anim, pulse, shake, tween,
  linear, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const AM = COLORS.amber, PU = COLORS.purple, GR = COLORS.green, RD = COLORS.red, BL = COLORS.blue, INK = COLORS.ink, TE = '#0e7c86';
const cn = (s) => `\\textcolor{${PU}}{${s}}`, ct = (s) => `\\textcolor{${TE}}{${s}}`, cl = (s) => `\\textcolor{${AM}}{${s}}`;
const cg = (s) => `\\textcolor{${GR}}{${s}}`;
const PAIR = ['#1f5bd6', '#c27a0e', '#a33357'];
/** a divided-out factor: red strike, the factor in its pair colour */
const X = (s, k) => `\\textcolor{${RD}}{\\cancel{\\textcolor{${PAIR[k]}}{${s}}}}`;
/** captions and asks may hold $…$ TeX */
const md = (s) => (typeof s === 'string' ? s.replace(/\$([^$]+)\$/g, (_, t) => T(t)) : s);
function mdDef(def) {
  const mk = def.make, a = def.ask;
  def.make = function (stage, v, ex) { return (mk.call(this, stage, v, ex) || []).map((st) => Object.assign(st, { cap: typeof st.cap === 'string' ? md(st.cap) : st.cap })); };
  if (typeof a === 'function') def.ask = (v) => md(a(v)); else if (typeof a === 'string') def.ask = md(a);
  return def;
}
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const show = (c, el) => { el.style.opacity = ''; return fadeIn(c, el, 320); };
const popIn = (c, el) => { el.style.opacity = ''; return pop(c, el); };
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
/** a div centred on (cx, cy): centring uses the separate translate property, so animations can use transform */
const cdiv = (host, cls, html, cx, cy) => { const d = div(host, cls, html, cx, cy); d.style.translate = '-50% -50%'; return d; };
/** a numbered step row (the step number beside the step) */
const row = (stage, n, html, x, y, w, cls = '') => hide(div(stage, 'u6l10-row ' + cls, `<span class="u6l10-num">${n}</span><span class="u6l10-rt">${html}</span>`, x, y, w));
async function swapTo(c, el, t) {
  await anim(c, el, [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(.86)' }], 160);
  el.innerHTML = T(t);
  await anim(c, el, [{ opacity: 0, transform: 'scale(.86)' }, { opacity: 1, transform: 'scale(1)' }], 260);
}
const stampAt = (stage, text, ok, x, y, rot) => hide(stamp(stage, text, { ok, x, y, rotate: rot ?? (ok ? -5 : -8) }));
const stampShow = async (c, st, ok) => { st.style.opacity = ''; await stampIn(c, st); if (ok === false) await shake(c, st); };

/* =============================== explainer: every denominator, even after the flip =============================== */
const NV = {
  e2b: { label: 'Example 2(b) check', ask: 'Example 2(b): simplify $\\dfrac{2x^2+5x-3}{x^2-9}\\div\\dfrac{4x^2-1}{x^2-3x}$ and state the NPVs.',
    A0: '\\dfrac{2x^2+5x-3}{x^2-9}', B0: '\\dfrac{4x^2-1}{x^2-3x}',
    A1: '\\dfrac{(2x-1)(x+3)}{(x-3)(x+3)}', B1: '\\dfrac{(2x-1)(2x+1)}{x(x-3)}',
    f1: 'Two trinomials, two differences of squares, and a common factor $x$.',
    dens: [[-3, '-3'], [0, '0'], [3, '3']], denNote: 'x\\ne\\pm3,\\ 0', denFrom: '$(x-3)(x+3)$ and $x(x-3)$',
    nums: [[-0.5, '-\\tfrac12'], [0.5, '\\tfrac12']], numNote: 'x\\ne\\pm\\tfrac12', numTex: '(2x-1)(2x+1)',
    Bf: '\\dfrac{x(x-3)}{(2x-1)(2x+1)}',
    Ac: `\\dfrac{${X('(2x-1)', 0)}${X('(x+3)', 1)}}{${X('(x-3)', 2)}${X('(x+3)', 1)}}`, Bc: `\\dfrac{x${X('(x-3)', 2)}}{${X('(2x-1)', 0)}(2x+1)}`,
    res: '\\dfrac{x}{2x+1}', npv: 'x\\ne-3,\\ -\\tfrac12,\\ 0,\\ \\tfrac12,\\ 3' },
  e4a: { label: 'Example 4(a) check', ask: 'Example 4(a): simplify $\\left(\\dfrac{1}{x}+\\dfrac{1}{2}\\right)\\div\\dfrac{x+2}{x^2}$ and state the NPVs.',
    A0: '\\left(\\dfrac{1}{x}+\\dfrac{1}{2}\\right)', B0: '\\dfrac{x+2}{x^2}',
    A1: '\\dfrac{2+x}{2x}', B1: '\\dfrac{x+2}{x\\cdot x}',
    f1: 'Make the bracket one fraction first (LCD $2x$). $x+2$ and $x^2=x\\cdot x$ are already factored.',
    dens: [[0, '0']], denNote: 'x\\ne0', denFrom: '$x$, $2$ and $x^2$',
    nums: [[-2, '-2']], numNote: 'x\\ne-2', numTex: 'x+2',
    Bf: '\\dfrac{x\\cdot x}{x+2}',
    Ac: `\\dfrac{${X('(2+x)', 0)}}{2${X('x', 1)}}`, Bc: `\\dfrac{${X('x', 1)}\\cdot x}{${X('(x+2)', 0)}}`,
    res: '\\dfrac{x}{2}', npv: 'x\\ne-2,\\ 0' },
  e4b: { label: 'Example 4(b) check', ask: 'Example 4(b): width $=$ area $\\div$ length $=\\dfrac{3x^2+10x-8}{x^2-4}\\div\\dfrac{3x-2}{x-2}$.',
    A0: '\\dfrac{3x^2+10x-8}{x^2-4}', B0: '\\dfrac{3x-2}{x-2}',
    A1: '\\dfrac{(3x-2)(x+4)}{(x-2)(x+2)}', B1: '\\dfrac{3x-2}{x-2}',
    f1: 'Decomposition on top, a difference of squares underneath; the length is already factored.',
    dens: [[-2, '-2'], [2, '2']], denNote: 'x\\ne\\pm2', denFrom: '$(x-2)(x+2)$ and $x-2$',
    nums: [[2 / 3, '\\tfrac23']], numNote: 'x\\ne\\tfrac23', numTex: '3x-2',
    Bf: '\\dfrac{x-2}{3x-2}',
    Ac: `\\dfrac{${X('(3x-2)', 0)}(x+4)}{${X('(x-2)', 1)}(x+2)}`, Bc: `\\dfrac{${X('(x-2)', 1)}}{${X('(3x-2)', 0)}}`,
    res: '\\dfrac{x+4}{x+2}', npv: 'x\\ne-2,\\ \\tfrac23,\\ 2' }
};
const npvNet = mdDef({
  title: 'Collect the NPVs before anything divides out',
  height: 400, minW: 940, capH: 84,
  choices: Object.keys(NV).map((k) => ({ v: k, label: NV[k].label })),
  ask: (v) => NV[v].ask,
  make(stage, v, ex) {
    const d = NV[v], W = ex.W, RX = 640, RW = W - RX - 6;
    const A = cdiv(stage, 'u6l10-fc', T(d.A0), 160, 72), op = cdiv(stage, 'u6l10-op', T('\\div'), 318, 72), B = cdiv(stage, 'u6l10-fc', T(d.B0), 476, 72);
    const N = new NumberLine(stage, { x: 4, y: 150, width: 620, height: 120, min: -4, max: 4, step: 1, axisY: 76 });
    const holes = (list, color) => list.map(([val, lab]) => { const p = N.point(val, { open: true, color, r: 9, label: T(lab) }); hide(p); if (p.label) { p.label.classList.add('u6l10-hl'); p.label.style.color = color; hide(p.label); } return p; });
    const hD = holes(d.dens, PU), hN = holes(d.nums, TE);
    const ans = hide(div(stage, 'u6l10-ans', `${T('=' + d.res)}<span class="u6l10-ansn">${T(cn(d.npv))}</span>`, 20, 300, 600));
    const ys = [8, 70, 132, 194, 256, 318];
    const r = [
      row(stage, 1, '<b>Factor</b> every top and bottom', RX, ys[0], RW),
      row(stage, 2, `<b>Denominators</b> ${T(cn(d.denNote))}`, RX, ys[1], RW),
      row(stage, 3, `<b>Divisor’s top</b> ${T(ct(d.numNote))}`, RX, ys[2], RW),
      row(stage, 4, `<b>Flip</b> the divisor: ${T('\\div')} becomes ${T('\\times')}`, RX, ys[3], RW),
      row(stage, 5, '<b>Divide out</b> matching factors', RX, ys[4], RW),
      row(stage, 6, '<b>Answer</b> with every NPV', RX, ys[5], RW)
    ];
    const popHoles = async (c, hs) => { for (const p of hs) { p.style.opacity = ''; await pop(c, p); if (p.label) await show(c, p.label); } };
    return [
      { cap: `<b>Step 1.</b> Factor every numerator and denominator. ${d.f1}`,
        run: async (c) => { await show(c, r[0]); await Promise.all([swapTo(c, A, d.A1), swapTo(c, B, d.B1)]); } },
      { cap: `<b>Step 2.</b> Every <b>original</b> denominator, ${d.denFrom}: each factor $=0$ gives an NPV, $${cn(d.denNote)}$.`,
        run: async (c) => { await show(c, r[1]); await Promise.all([pulse(c, A, 1.06), pulse(c, B, 1.06)]); await popHoles(c, hD); } },
      { cap: `<b>Step 3.</b> The divisor’s <b>numerator</b> $${d.numTex}$ is about to become a denominator, so $${ct(d.numNote)}$ too. Catch it <b>now</b>, before it flips.`,
        run: async (c) => { await show(c, r[2]); await pulse(c, B, 1.08); await popHoles(c, hN); } },
      { cap: '<b>Step 4.</b> Multiply by the reciprocal: the divisor flips over and $\\div$ becomes $\\times$.',
        run: async (c) => {
          await show(c, r[3]);
          await anim(c, B, [{ transform: 'rotateY(0deg)' }, { transform: 'rotateY(90deg)' }], 240);
          B.innerHTML = T(d.Bf); op.innerHTML = T('\\times');
          await anim(c, B, [{ transform: 'rotateY(90deg)' }, { transform: 'rotateY(0deg)' }], 280);
        } },
      { cap: '<b>Step 5.</b> Divide out each factor that is in a numerator <b>and</b> a denominator (same colour, same factor).',
        run: async (c) => { await show(c, r[4]); await Promise.all([swapTo(c, A, d.Ac), swapTo(c, B, d.Bc)]); } },
      { cap: `<b>Step 6.</b> What is left is the answer. Its NPVs are <b>all</b> the holes, even the ones whose factors divided out: $${d.npv}$.`,
        run: async (c) => { await show(c, r[5]); await show(c, ans); await pulse(c, ans, 1.04); } }
    ];
  }
});

/* =============================== explainer: keep it or reject it? (with the graph) =============================== */
const VD = {
  e5a: { label: 'Example 5(a) check', ask: 'Example 5(a): solve $\\dfrac{3}{x+2}=\\dfrac{5}{2x-1}$ and verify.',
    npv: 'x\\ne-2,\\ \\tfrac12', npvs: [[-2, '-2'], [0.5, '\\tfrac12']], lcd: '(x+2)(2x-1)', how: 'one fraction on each side: cross-multiply',
    poly: '3(2x-1)=5(x+2)', solve: '6x-3=5x+10\\ \\Rightarrow\\ x=13',
    cands: [{ x: 13, ok: true, y: 0.2, lab: '\\left(13,\\ \\tfrac15\\right)', pos: 'n' }],
    f: (x) => 3 / (x + 2), g: (x) => 5 / (2 * x - 1),
    win: { xmin: -6, xmax: 16, ymin: -1, ymax: 1.5, ystep: 0.5, xlabels: 2, ylabels: 0.5 },
    check: '13\\text{ is not an NPV: keep it}', sol: '\\boldsymbol{x=13}', st: ['Keep it ✓', true],
    why: 'The curves meet above $x=13$, at $\\left(13,\\ \\tfrac15\\right)$: both sides equal $\\tfrac15$, as the verify line says.' },
  e5b: { label: 'Example 5(b) check', ask: 'Example 5(b): solve $\\dfrac{x}{x-3}-\\dfrac{18}{x^2-9}=\\dfrac{4}{x+3}$ and verify.',
    npv: 'x\\ne\\pm3', npvs: [[-3, '-3'], [3, '3']], lcd: '(x-3)(x+3)', how: 'multiply every term by it',
    poly: 'x(x+3)-18=4(x-3)', solve: 'x^2-x-6=0\\ \\Rightarrow\\ (x-3)(x+2)=0',
    cands: [{ x: 3, ok: false, hole: [3, 1.5] }, { x: -2, ok: true, y: 4, lab: '(-2,\\ 4)', pos: 'nw' }],
    f: (x) => x / (x - 3) - 18 / (x * x - 9), g: (x) => 4 / (x + 3),
    win: { xmin: -9, xmax: 7, ymin: -6, ymax: 10, xlabels: 2, ylabels: 2 },
    check: '3\\text{ is an NPV: extraneous};\\ -2\\text{: keep}', sol: '\\boldsymbol{x=-2}', st: ['x = 3: extraneous ✗', false],
    why: 'Above $x=3$ the blue curve has a <b>hole</b> (the left side is undefined there), so the curves can’t meet. They do meet at $(-2,\\ 4)$: the only solution is $x=-2$.' },
  e6a: { label: 'Example 6(a) check', ask: 'Example 6(a): show that $\\dfrac{2x}{x-4}=3+\\dfrac{8}{x-4}$ has no solution.',
    npv: 'x\\ne4', npvs: [[4, '4']], lcd: 'x-4', how: 'every term, the $3$ too',
    poly: '2x=3(x-4)+8', solve: '2x=3x-4\\ \\Rightarrow\\ x=4',
    cands: [{ x: 4, ok: false }],
    f: (x) => 2 * x / (x - 4), g: (x) => 3 + 8 / (x - 4),
    win: { xmin: -6, xmax: 12, ymin: -8, ymax: 10, xlabels: 2, ylabels: 2 },
    check: '4\\text{ is an NPV: extraneous}', sol: null, st: ['No solution ✗', false],
    why: 'The red curve is the blue curve moved <b>up exactly 1</b> ($3+\\tfrac{8}{x-4}-\\tfrac{2x}{x-4}=1$ for every $x\\ne4$): they <b>never meet</b>. No solution.' }
};
const verdict = mdDef({
  title: 'Keep it or reject it?',
  height: 450, minW: 940, capH: 84,
  choices: Object.keys(VD).map((k) => ({ v: k, label: VD[k].label })),
  ask: (v) => VD[v].ask,
  make(stage, v, ex) {
    const d = VD[v], W = ex.W, GW = 450, GX = W - GW - 6, RW = GX - 24, w = d.win, span = w.ymax - w.ymin;
    const ys = [12, 84, 156, 228, 330];
    const r1 = row(stage, 1, `<b>NPVs</b> ${T(cn(d.npv))}`, 8, ys[0], RW);
    const r2 = row(stage, 2, `<b>× LCD</b> ${T(cl(d.lcd))}: ${T(d.poly)}`, 8, ys[1], RW, 'u6l10-sm');
    const r3 = row(stage, 3, `<b>Solve</b> ${T(d.solve)}`, 8, ys[2], RW, 'u6l10-sm');
    const r4 = row(stage, 4, `<b>NPV?</b> ${T(d.check)}`, 8, ys[3], RW, 'u6l10-sm');
    const r5 = row(stage, 5, d.sol ? `<b>Solution</b> ${T(d.sol)}` : '<b class="u6l10-no">No solution</b>', 8, ys[4], RW, 'u6l10-big');
    const st = stampAt(stage, d.st[0], d.st[1], RW / 2 + 60, 300);
    const G = new Graph(stage, Object.assign({ x: GX, y: 18, width: GW, height: 428, fontSize: 14 }, w));
    const brk = d.npvs.map((p) => p[0]);
    const npvL = d.npvs.map((p) => hide(G.vline(p[0], { color: PU, width: 2.5 })));
    const npvT = d.npvs.map((p, i) => hide(G.label(p[0], w.ymax - span * 0.07 * i, `<span class="u6l10-gl u6l10-pu">${T('x=' + p[1])}</span>`, { pos: 'se', dx: 4, dy: 4 })));
    const fL = hide(G.fn(d.f, { color: BL, width: 3.2, breaks: brk })), gR = hide(G.fn(d.g, { color: RD, width: 3.2, breaks: brk }));
    const legend = hide(div(stage, 'u6l10-legend', '<span class="u6l10-lb">— y = left side</span><span class="u6l10-lr">— y = right side</span>', 8, 404));
    const scans = d.cands.map((k) => hide(G.vline(k.x, { color: AM, width: 3 })));
    const scanT = d.cands.map((k, i) => hide(G.label(k.x, w.ymin + span * (0.1 + 0.08 * i), `<span class="u6l10-gl u6l10-am">${T('x=' + k.x + '?')}</span>`, { pos: 'e', dx: 6 })));
    const marks = d.cands.map((k) => {
      if (k.ok) { const p = hide(G.point(k.x, k.y, { color: GR, r: 8, label: `<span class="u6l10-gl u6l10-gr">${T(k.lab)}</span>`, pos: k.pos })); if (p.label) hide(p.label); return p; }
      if (k.hole) { const p = hide(G.point(k.hole[0], k.hole[1], { open: true, color: BL, r: 8, label: '<span class="u6l10-nope">hole</span>', pos: 'e' })); if (p.label) hide(p.label); return p; }
      return hide(G.label(k.x, w.ymin + span * 0.42, '<span class="u6l10-nope">no meeting point</span>', { pos: 'e', dx: 6 }));
    });
    const anyBad = d.cands.some((k) => !k.ok);
    return [
      { cap: `<b>Step 1.</b> NPVs first: $${d.npv}$. On the graph, a dashed line marks each NPV.`,
        run: async (c) => { await show(c, r1); for (let i = 0; i < npvL.length; i++) { npvL[i].style.opacity = ''; await G.drawIn(npvL[i], 420, c); await show(c, npvT[i]); } } },
      { cap: `<b>Step 2.</b> The LCD is $${d.lcd}$: ${d.how}. $${d.poly}$`, run: (c) => show(c, r2) },
      { cap: `<b>Step 3.</b> Solve: $${d.solve}$. ${d.cands.length > 1 ? 'Two candidates' : 'A candidate'}, until we check.`,
        run: async (c) => { await show(c, r3); for (let i = 0; i < scans.length; i++) { scans[i].style.opacity = ''; await G.drawIn(scans[i], 420, c); await show(c, scanT[i]); } } },
      { cap: 'Graph $y=$ left side (blue) and $y=$ right side (red). A solution is an $x$ where the curves <b>meet</b>.',
        run: async (c) => { await show(c, legend); fL.style.opacity = ''; await G.drawIn(fL, 800, c); gR.style.opacity = ''; await G.drawIn(gR, 800, c); } },
      { cap: anyBad ? `<b>Step 4.</b> Check each candidate against the NPVs: $${d.check}$.` : `<b>Step 4.</b> $${d.check}$, and the curves meet there.`,
        run: async (c) => {
          await show(c, r4);
          for (const m of marks) { m.style.opacity = ''; await pop(c, m); if (m.label) await show(c, m.label); }
          await stampShow(c, st, d.st[1]);
        } },
      { cap: d.why, run: async (c) => { await show(c, r5); await pulse(c, r5, 1.05); } }
    ];
  }
});

/* =============================== explainer: problems, the scene moves with the table =============================== */
const RC = {
  e7: { label: 'Example 7: the train and the bus', ask: 'Example 7: a train travels $540$ km. A bus that is $30$ km/h slower takes $1.5$ h longer. Find both speeds and both times.',
    head: ['', 'Distance (km)', 'Speed (km/h)', 'Time (h)'],
    rows: [['Train 🚄', '540', 's', '\\dfrac{540}{s}'], ['Bus 🚌', '540', 's-30', '\\dfrac{540}{s-30}']],
    fin: [[null, null, 's=120', '\\dfrac{540}{120}=4.5'], [null, null, 's-30=90', '\\dfrac{540}{90}=6']],
    eqs: [['Equation', '\\dfrac{540}{s-30}-\\dfrac{540}{s}=\\dfrac{3}{2},\\ \\ s\\ne0,\\ 30'],
      ['× LCD', '2s(s-30):\\ 1080s-1080(s-30)=3s(s-30)'],
      ['Solve', '3s^2-90s-32\\,400=0\\ \\Rightarrow\\ s^2-30s-10\\,800=0'],
      ['Factor', '(s-120)(s+90)=0:\\ s=120\\ \\ (\\cancel{-90})']],
    caps: ['Example 7. Both make the same <b>540 km</b> trip. The bus is <b>30 km/h slower</b> and takes <b>1.5 h longer</b>. What we don’t know: the speeds.',
      '<b>Step 1.</b> A table, with $t=\\dfrac{d}{s}$. Call the train’s speed $s$; the bus is $30$ slower, $s-30$.',
      '<b>Step 2.</b> The bus takes $1.5$ h longer: <b>bus time $-$ train time $=\\tfrac32$</b>. A speed can’t be $0$ here: $s\\ne0,\\ 30$.',
      '<b>Step 3.</b> Multiply every term by the LCD, $2s(s-30)$.',
      '<b>Step 4.</b> Expand and collect: $1080s-1080s+32\\,400=3s^2-90s$. Divide by $3$.',
      '<b>Step 5.</b> Factor: $s=120$ or $s=-90$. A speed can’t be negative: reject $-90$ (<b>inadmissible</b>).',
      'Race them! Train $120$ km/h, bus $90$ km/h. The train arrives at $4.5$ h, the bus at $6$ h: <b>1.5 h longer</b> ✓'] },
  e8: { label: 'Example 8: two snowplows', ask: 'Example 8: one plow takes $4$ h longer than the other. Together they clear the lot in $4$ h $48$ min. How long does each take alone?',
    head: ['', 'Time alone (h)', 'Part per hour', 'Part in 4.8 h'],
    rows: [['Faster 🚜', 'x', '\\dfrac{1}{x}', '\\dfrac{4.8}{x}'], ['Slower 🚜', 'x+4', '\\dfrac{1}{x+4}', '\\dfrac{4.8}{x+4}']],
    fin: [[null, 'x=8', '\\tfrac18', '\\tfrac{4.8}{8}=0.6'], [null, 'x+4=12', '\\tfrac1{12}', '\\tfrac{4.8}{12}=0.4']],
    eqs: [['Equation', '\\dfrac{4.8}{x}+\\dfrac{4.8}{x+4}=1,\\ \\ x\\ne0,\\ -4'],
      ['× LCD', 'x(x+4):\\ 4.8(x+4)+4.8x=x(x+4)'],
      ['Solve', 'x^2-5.6x-19.2=0\\ \\xrightarrow{\\times5}\\ 5x^2-28x-96=0'],
      ['Factor', '(x-8)(5x+12)=0:\\ x=8\\ \\ (\\cancel{-\\tfrac{12}{5}})']],
    caps: ['Example 8. Two plows clear one lot from both ends. Together: <b>4 h 48 min $=4.8$ h</b>. One plow alone takes <b>4 h longer</b> than the other.',
      '<b>Step 1.</b> A table. A plow that takes $x$ hours does $\\tfrac1x$ of the lot each hour, so $\\tfrac{4.8}{x}$ of it in $4.8$ h.',
      '<b>Step 2.</b> The two parts make <b>one whole lot</b>: they add up to $1$. NPVs: $x\\ne0,\\ -4$.',
      '<b>Step 3.</b> Multiply every term, the $1$ too, by the LCD, $x(x+4)$.',
      '<b>Step 4.</b> Collect: $x^2-5.6x-19.2=0$. Multiply by $5$ to clear the decimals.',
      '<b>Step 5.</b> Factor: $x=8$ or $x=-\\tfrac{12}{5}$. A time can’t be negative: reject $-\\tfrac{12}{5}$.',
      'Run the plows for $4.8$ h: the faster clears $0.6$ of the lot, the slower $0.4$. They meet: $0.6+0.4=1$ ✓ (8 h and 12 h alone).'] }
};
const fmtH = (t) => { const m = Math.round(t * 60); return `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, '0')} min`; };
const race = mdDef({
  title: 'The story moves with the table',
  height: 430, minW: 940, capH: 84,
  choices: Object.keys(RC).map((k) => ({ v: k, label: RC[k].label })),
  ask: (v) => RC[v].ask,
  make(stage, v, ex) {
    const d = RC[v], W = ex.W, SW = W - 16;
    const scene = div(stage, 'u6l10-scene', '', 8, 4, SW, 150);
    const clock = div(scene, 'u6l10-clock', v === 'e7' ? '0.0 h' : fmtH(0), SW - 148, 52, 136);
    let draw, tags = [];
    if (v === 'e7') {
      const x0 = 70, x1 = SW - 190, len = x1 - x0;
      div(scene, 'u6l10-rail', '', x0 - 10, 52, len + 20); div(scene, 'u6l10-road', '', x0 - 10, 114, len + 20);
      div(scene, 'u6l10-line', '', x0, 18, 3, 128); div(scene, 'u6l10-line u6l10-fin', '', x1, 18, 3, 128);
      div(scene, 'u6l10-flag', '🏁', x1 - 12, -8);
      div(scene, 'u6l10-dist', '540 km', x0 + len / 2 - 40, 78);
      const tr = div(scene, 'u6l10-veh u6l10-flip', '🚄', x0 - 52, 18), bu = div(scene, 'u6l10-veh u6l10-flip', '🚌', x0 - 52, 80);
      const t1 = hide(div(scene, 'u6l10-tag', '4.5 h', x1 + 10, 26)), t2 = hide(div(scene, 'u6l10-tag', '6 h', x1 + 10, 90));
      const t3 = hide(div(scene, 'u6l10-tag u6l10-okt', '+1.5 h ✓', x1 - 120, 58));
      tags = [t1, t2, t3];
      draw = (t) => { const H = 6 * t; tr.style.left = (x0 - 52 + len * Math.min(1, 120 * H / 540)) + 'px'; bu.style.left = (x0 - 52 + len * Math.min(1, 90 * H / 540)) + 'px';
        clock.textContent = H.toFixed(1) + ' h'; t1.style.opacity = H >= 4.5 ? 1 : 0; t2.style.opacity = H >= 6 - 1e-9 ? 1 : 0; t3.style.opacity = H >= 6 - 1e-9 ? 1 : 0; };
    } else {
      const x0 = 70, x1 = SW - 190, len = x1 - x0;
      div(scene, 'u6l10-lot', '❄️ ❄️ ❄️ ❄️ ❄️ ❄️ ❄️ ❄️', x0, 28, len, 96);
      const cA = div(scene, 'u6l10-clr', '', x0, 28, 0, 96), cB = div(scene, 'u6l10-clr', '', x1, 28, 0, 96);
      const pA = div(scene, 'u6l10-veh u6l10-flip', '🚜', x0 - 52, 50), pB = div(scene, 'u6l10-veh', '🚜', x1 + 4, 50);
      const t1 = hide(div(scene, 'u6l10-tag', '0.6', x0 + len * 0.3 - 18, 126)), t2 = hide(div(scene, 'u6l10-tag', '0.4', x0 + len * 0.8 - 18, 126));
      const t3 = hide(div(scene, 'u6l10-tag u6l10-okt', '0.6 + 0.4 = 1 ✓', x0 + len * 0.6 - 70, 2));
      tags = [t1, t2, t3];
      draw = (t) => { const H = 4.8 * t, a = len * H / 8, b = len * H / 12;
        cA.style.width = a + 'px'; cB.style.width = b + 'px'; cB.style.left = (x1 - b) + 'px';
        pA.style.left = (x0 - 52 + a) + 'px'; pB.style.left = (x1 + 4 - b) + 'px'; clock.textContent = fmtH(H);
        const done = t >= 1 - 1e-9; tags.forEach((g) => { g.style.opacity = done ? 1 : 0; }); };
    }
    draw(0);
    // the table (step 1) and the equation rows (steps 2–5)
    const tLab = row(stage, 1, '<b>Table</b>', 8, 166, 200);
    const cells = [];
    const tb = h('table', 'u6l10-tb');
    tb.innerHTML = `<tr>${d.head.map((x) => `<th>${x}</th>`).join('')}</tr>` + d.rows.map((r) => `<tr>${r.map((x, j) => (j ? '<td></td>' : `<th>${x}</th>`)).join('')}</tr>`).join('');
    d.rows.forEach((r, i) => { cells.push([...tb.rows[i + 1].cells]); });
    const tbw = div(stage, 'u6l10-tbw', '', 8, 212, 420); tbw.appendChild(tb); hide(tbw);
    const RX = 444, RW = W - RX - 6;
    const er = d.eqs.map((e, i) => row(stage, i + 2, T(e[1]), RX, 166 + i * 62, RW, 'u6l10-sm'));
    const st = stampAt(stage, 'Inadmissible ✗', false, 214, 382, -6);
    return [
      { cap: d.caps[0], run: async (c) => { await pulse(c, scene, 1.02); } },
      { cap: d.caps[1], run: async (c) => { await show(c, tLab); await show(c, tbw);
        for (let i = 0; i < d.rows.length; i++) for (let j = 1; j < 4; j++) { cells[i][j].innerHTML = T(d.rows[i][j]); await sleep(c, 120); } } },
      { cap: d.caps[2], run: (c) => show(c, er[0]) },
      { cap: d.caps[3], run: (c) => show(c, er[1]) },
      { cap: d.caps[4], run: (c) => show(c, er[2]) },
      { cap: d.caps[5], run: async (c) => { await show(c, er[3]); await stampShow(c, st, false); } },
      { cap: d.caps[6], run: async (c) => {
        await tween(c, 3600, (t) => { draw(t); }, linear);
        for (let i = 0; i < d.rows.length; i++) for (let j = 1; j < 4; j++) { const f = d.fin[i][j]; if (f) { cells[i][j].innerHTML = T(cg(f)); cells[i][j].classList.add('u6l10-fin2'); } }
        await pulse(c, tags[2], 1.12);
      } }
    ];
  }
});

/* =============================== explainer (STAR): spot the error, a whole-class round =============================== */
const SP = {
  r1: { who: 'Ava', label: 'Round 1: Ava', ask: 'Round 1. Ava simplified $\\dfrac{x^2+6x+8}{x^2+4x}$ and stated the NPVs.',
    lines: ['=\\dfrac{(x+2)(x+4)}{x(x+4)}', '=\\dfrac{x+2}{x},\\quad x\\ne0,\\ -4', '=\\dfrac{\\cancel{x}+2}{\\cancel{x}}=2'], bad: 2,
    at: 'x=1', tr: [['Question', '\\dfrac{1+6+8}{1+4}=\\dfrac{15}{5}=3'], ['Ava’s answer', '2']], vd: ['3\\ne2', false],
    testCap: 'Test a number that is not an NPV, $x=1$, in the question and in Ava’s answer. Equivalent expressions give the <b>same</b> value.',
    why: '<b>Line 3.</b> $3\\ne2$. Ava divided out the $x$’s, but $x$ is a <b>term</b> of $x+2$, not a factor of it.',
    fix: ['\\dfrac{x+2}{x},\\quad x\\ne0,\\ -4'], fixNote: 'Stop at line 2: it is in simplest form.',
    rule: 'Line 2 at $x=1$ gives $3$ ✓. <b>Factors divide out; terms never do.</b>' },
  r2: { who: 'Ben', label: 'Round 2: Ben', ask: 'Round 2. Ben simplified $\\dfrac{x^2-4}{x^2-5x+6}$ and stated the NPVs.',
    lines: ['=\\dfrac{(x-2)(x+2)}{(x-2)(x-3)}', '=\\dfrac{x+2}{x-3}', 'x\\ne3'], bad: 2,
    at: 'x=2', tr: [['Question', '\\dfrac{4-4}{4-10+6}=\\dfrac{0}{0}'], ['Ben’s answer', '\\dfrac{2+2}{2-3}=-4']], vd: ['\\text{undefined}\\ne-4', false],
    testCap: 'Ben’s list allows $x=2$. Test it: put $x=2$ into the question and into his answer.',
    why: '<b>Line 3.</b> The question is undefined at $x=2$. Ben took his NPVs from the <b>simplified</b> answer and lost the factor $x-2$ that divided out.',
    fix: ['\\dfrac{x+2}{x-3},\\quad x\\ne2,\\ 3'], fixNote: 'NPVs from the original denominator $(x-2)(x-3)$.',
    rule: '<b>NPVs come from the original</b> denominator, before anything divides out.' },
  r3: { who: 'Chloe', label: 'Round 3: Chloe', ask: 'Round 3. Chloe simplified $\\dfrac{x-1}{x+3}\\div\\dfrac{x-1}{x-4}$ and stated the NPVs.',
    lines: ['=\\dfrac{x-1}{x+3}\\cdot\\dfrac{x-4}{x-1}', '=\\dfrac{x-4}{x+3}', 'x\\ne-3,\\ 4'], bad: 2,
    at: 'x=1', tr: [['Question', '\\dfrac{0}{4}\\div\\dfrac{0}{-3}=0\\div0'], ['Chloe’s answer', '\\dfrac{1-4}{1+3}=-\\dfrac{3}{4}']], vd: ['\\text{undefined}\\ne-\\tfrac34', false],
    testCap: 'Chloe’s list allows $x=1$. Test it in the question and in her answer.',
    why: '<b>Line 3.</b> At $x=1$ the divisor is $0$, and you can’t divide by $0$. The divisor’s <b>numerator</b> $x-1$ became a denominator when it flipped.',
    fix: ['\\dfrac{x-4}{x+3},\\quad x\\ne-3,\\ 1,\\ 4'], fixNote: 'The divisor’s numerator adds $x\\ne1$.',
    rule: '<b>Dividing:</b> NPVs from every denominator <b>and</b> from the divisor’s numerator.' },
  r4: { who: 'Dev', label: 'Round 4: Dev', ask: 'Round 4. Dev simplified $\\dfrac{3x}{x-2}-\\dfrac{x+4}{x-2}$ and stated the NPVs.',
    lines: ['=\\dfrac{3x-x+4}{x-2}', '=\\dfrac{2x+4}{x-2}', 'x\\ne2'], bad: 0,
    at: 'x=3', tr: [['Question', '\\dfrac{9}{1}-\\dfrac{7}{1}=2'], ['Dev’s answer', '\\dfrac{6+4}{1}=10']], vd: ['2\\ne10', false],
    testCap: 'Test $x=3$ (not an NPV) in the question and in Dev’s answer.',
    why: '<b>Line 1.</b> The minus belongs to the <b>whole</b> numerator: $3x-(x+4)=3x-x-4$. Dev subtracted only the $x$.',
    fix: ['=\\dfrac{3x-(x+4)}{x-2}=\\dfrac{2x-4}{x-2}', '=\\dfrac{2(x-2)}{x-2}=2,\\quad x\\ne2'], fixNote: '',
    rule: 'The answer is just $2$ (with $x\\ne2$), and $x=3$ gives $2$ ✓. <b>Brackets when subtracting.</b>' },
  r5: { who: 'Eli', label: 'Round 5: Eli', ask: 'Round 5. Eli simplified $\\dfrac{2}{x}+\\dfrac{3}{x+1}$ and stated the NPVs.',
    lines: ['\\text{LCD }x(x+1),\\quad x\\ne0,\\ -1', '=2(x+1)+3x', '=5x+2'], bad: 1,
    at: 'x=1', tr: [['Question', '\\dfrac{2}{1}+\\dfrac{3}{2}=\\dfrac{7}{2}'], ['Eli’s answer', '5+2=7']], vd: ['\\tfrac72\\ne7', false],
    testCap: 'Test $x=1$ in the question and in Eli’s answer.',
    why: '<b>Line 2.</b> There is <b>no equals sign</b>: an expression, not an equation. Eli multiplied by the LCD and threw it away, which changes the value.',
    fix: ['=\\dfrac{2(x+1)+3x}{x(x+1)}=\\dfrac{5x+2}{x(x+1)}', 'x\\ne0,\\ -1'], fixNote: '',
    rule: 'At $x=1$ the fix gives $\\tfrac72$ ✓. <b>An expression keeps its LCD</b> in the denominator; only an equation loses it.' },
  r6: { who: 'Fatima', label: 'Round 6: Fatima', ask: 'Round 6. Fatima solved $\\dfrac{3}{x}+2=\\dfrac{7}{x}$.',
    lines: ['x\\ne0', '\\times x:\\ \\ 3+2=7', '5=7,\\ \\text{so no solution}'], bad: 1,
    at: 'x=2', tr: [['Left side', '\\dfrac{3}{2}+2=\\dfrac{7}{2}'], ['Right side', '\\dfrac{7}{2}']], vd: ['\\text{equal! }x=2\\text{ works}', true],
    testCap: 'Fatima says there is no solution. Try $x=2$ in the original equation.',
    why: '<b>Line 2.</b> $x=2$ works, so there <b>is</b> a solution. Fatima didn’t multiply the $2$ by the LCD: $2\\cdot x=2x$.',
    fix: ['3+2x=7', 'x=2'], fixNote: '',
    rule: '$x=2$ is not an NPV: it is the solution. <b>Multiply every term by the LCD</b>, including terms with no denominator.' },
  r7: { who: 'Gus', label: 'Round 7: Gus', ask: 'Round 7. Gus solved $\\dfrac{x^2+x}{x-1}=\\dfrac{2}{x-1}$.',
    lines: ['x\\ne1', 'x^2+x=2', '(x+2)(x-1)=0', 'x=-2\\ \\text{or}\\ x=1'], bad: 3,
    at: 'x=1', tr: [['Left side', '\\dfrac{1+1}{0}'], ['Right side', '\\dfrac{2}{0}']], vd: ['\\text{both undefined}', false],
    testCap: 'Gus kept $x=1$. Test it in the original equation.',
    why: '<b>Line 4.</b> $x=1$ makes the denominators $0$ (Gus even wrote $x\\ne1$ in line 1!). It is <b>extraneous</b>: reject it.',
    fix: ['x=-2\\quad(x=1\\text{ is extraneous})', '\\text{Check: }\\dfrac{4-2}{-3}=\\dfrac{2}{-3}\\ \\checkmark'], fixNote: '',
    rule: '<b>Every root gets checked against the NPVs.</b>' }
};
const spot = mdDef({
  title: 'Spot the error: one wrong line each',
  height: 420, minW: 940, capH: 84,
  choices: Object.keys(SP).map((k) => ({ v: k, label: SP[k].label })),
  ask: (v) => SP[v].ask,
  make(stage, v, ex) {
    const d = SP[v], W = ex.W, n = d.lines.length, CW = 520, LH = n > 3 ? 74 : 92;
    const card = div(stage, 'u6l10-work', `<div class="u6l10-who">✏️ ${d.who}’s work</div>`, 8, 6, CW, 408);
    const ls = d.lines.map((t, i) => hide(div(card, 'u6l10-wl', `<span class="u6l10-wn">${i + 1}</span><span class="u6l10-wt">${T(t)}</span>`, 14, 62 + i * LH, CW - 32)));
    const TX = CW + 26, TW = W - TX - 6;
    const test = hide(div(stage, 'u6l10-test', `<div class="u6l10-th">Test ${T(d.at)}</div>` +
      d.tr.map((r) => `<div class="u6l10-tr"><span class="u6l10-tl">${r[0]}</span>${T(r[1])}</div>`).join('') +
      `<div class="u6l10-tv ${d.vd[1] ? 'ok' : 'no'}">${T(d.vd[0])}</div>`, TX, 6, TW));
    const trs = [...test.querySelectorAll('.u6l10-tr, .u6l10-tv')]; trs.forEach(hide);
    const fix = hide(div(stage, 'u6l10-fix', `<div class="u6l10-fh">Fix line ${d.bad + 1}</div>` + d.fix.map((t) => `<div class="u6l10-fl">${T(t)}</div>`).join('') +
      (d.fixNote ? `<div class="u6l10-fn">${md(d.fixNote)}</div>` : ''), TX, 236, TW));
    const st = stampAt(stage, 'Caught it!', false, CW - 70, 62 + d.bad * LH + 30, -8);
    const st2 = stampAt(stage, 'Fixed ✓', true, TX + TW - 74, 250, -6);
    return [
      { cap: `<b>${d.who}’s work.</b> One line has a mistake. Which one? Hold up ${n === 4 ? '1, 2, 3 or 4' : '1, 2 or 3'} fingers.`,
        run: async (c) => { for (const l of ls) { await show(c, l); await sleep(c, 160); } } },
      { cap: d.testCap, run: async (c) => { await show(c, test); for (const r of trs) { await show(c, r); await sleep(c, 200); } } },
      { cap: d.why, run: async (c) => { const b = ls[d.bad]; b.classList.add('bad'); await shake(c, b); await stampShow(c, st, false); } },
      { cap: d.rule, run: async (c) => { await show(c, fix); await stampShow(c, st2, true); } }
    ];
  }
});

/* =============================== Stand Up Break ===============================
 * BEG simplify (one common factor, NPVs from the original), PRG add or subtract two binomial denominators,
 * MAS solve: one family with an extraneous root, one where both roots are kept. */
const sg = (n) => (n < 0 ? '-' + -n : '+' + n);
const lin = (v, k) => (k === 0 ? v : v + sg(k));
const poly = (cs, vs) => { let out = ''; cs.forEach((k, i) => { if (!k) return; const m = Math.abs(k), vv = vs[i]; out += (k < 0 ? '-' : out ? '+' : '') + (vv ? (m === 1 ? '' : m) + vv : m); }); return out || '0'; };
const quad = (a, b, c) => poly([a, b, c], ['x^2', 'x', '']);
const npvList = (vals) => [...new Set(vals)].sort((p, q) => p - q).join(',\\ ');
standup('u6l10', {
  intro: 'At your whiteboard: factor first, NPVs from the original, and every root checked against the NPVs.',
  levels: {
    BEG: (r) => { // (x + s p)(x + q) / ((x - p)(x + p))
      for (let t = 0; t < 200; t++) {
        const p = r.int(1, 6), s = r.sign(), q = r.int(-7, 7);
        if (!q || Math.abs(q) === p) continue;
        const num = quad(1, s * p + q, s * p * q), keep = s === 1 ? `x-${p}` : `x+${p}`;
        return { text: 'Simplify and state the non-permissible values.', q: `\\dfrac{${num}}{x^2-${p * p}}`,
          a: [`=\\dfrac{(${lin('x', s * p)})(${lin('x', q)})}{(x-${p})(x+${p})}`, `=\\dfrac{${lin('x', q)}}{${keep}},\\quad x\\ne\\pm${p}`] };
      }
      return { text: 'Simplify and state the non-permissible values.', q: '\\dfrac{x^2+5x+6}{x^2-4}', a: ['=\\dfrac{(x+2)(x+3)}{(x-2)(x+2)}', '=\\dfrac{x+3}{x-2},\\quad x\\ne\\pm2'] };
    },
    PRG: (r) => { // a/(x+m) ± b/(x+n)
      for (let t = 0; t < 300; t++) {
        const a = r.int(2, 6), b = r.int(1, 5), m = r.int(-6, 6), n = r.int(-6, 6), minus = r.chance(0.5);
        if (!m || !n || m === n) continue;
        const A = minus ? a - b : a + b, B = minus ? a * n - b * m : a * n + b * m;
        if (!A) continue;
        if ([-m, -n].some((z) => A * z + B === 0)) continue; // the numerator would share a factor with the LCD
        const D = `(${lin('x', m)})(${lin('x', n)})`, bt = (b === 1 ? '' : b) + `(${lin('x', m)})`;
        return { text: 'Simplify and state the non-permissible values.', q: `\\dfrac{${a}}{${lin('x', m)}}${minus ? '-' : '+'}\\dfrac{${b}}{${lin('x', n)}}`,
          a: [`\\text{LCD }${D},\\quad x\\ne${npvList([-m, -n])}`, `=\\dfrac{${a}(${lin('x', n)})${minus ? '-' : '+'}${bt}}{${D}}`, `=\\dfrac{${poly([A, B], ['x', ''])}}{${D}}`] };
      }
      return { text: 'Simplify and state the non-permissible values.', q: '\\dfrac{4}{x-2}+\\dfrac{3}{x+5}', a: ['\\text{LCD }(x-2)(x+5),\\quad x\\ne-5,\\ 2', '=\\dfrac{4(x+5)+3(x-2)}{(x-2)(x+5)}', '=\\dfrac{7x+14}{(x-2)(x+5)}'] };
    },
    MAS: (r) => {
      for (let t = 0; t < 300; t++) {
        if (r.chance(0.55)) { // (x² + s x)/(x − k) = t/(x − k): roots k (extraneous) and q
          const k = r.int(-5, 5), q = r.int(-6, 6);
          if (!k || !q || q === k) continue;
          const s = -(k + q), tt = -k * q, D = lin('x', -k);
          return { text: 'State the NPV, solve, and reject any extraneous root.', q: `\\dfrac{${quad(1, s, 0)}}{${D}}=\\dfrac{${tt}}{${D}}`,
            a: [`x\\ne${k}`, `${quad(1, s, 0)}=${tt}`, `${quad(1, s, -tt)}=0`, `(${lin('x', -k)})(${lin('x', -q)})=0`, `x=${k}\\text{ is an NPV (extraneous)};\\ \\ x=${q}`] };
        }
        // x − P/x = Q: both roots kept
        const r1 = r.int(-6, 6), r2 = r.int(-6, 6);
        if (!r1 || !r2 || r1 === r2) continue;
        const Q = r1 + r2, P = -r1 * r2, lo = Math.min(r1, r2), hi = Math.max(r1, r2);
        return { text: 'State the NPV, solve and verify.', q: `x${P > 0 ? '-' : '+'}\\dfrac{${Math.abs(P)}}{x}=${Q}`,
          a: ['x\\ne0', `x^2${P > 0 ? '-' : '+'}${Math.abs(P)}=${Q === 0 ? '0' : poly([Q], ['x'])}`, `${quad(1, -Q, -P)}=0`, `(${lin('x', -lo)})(${lin('x', -hi)})=0`, `x=${lo}\\ \\text{or}\\ x=${hi}\\ \\ \\text{(neither is an NPV)}`] };
      }
      return { text: 'State the NPV, solve and verify.', q: 'x-\\dfrac{12}{x}=1', a: ['x\\ne0', 'x^2-12=x', 'x^2-x-12=0', '(x-4)(x+3)=0', 'x=-3\\ \\text{or}\\ x=4'] };
    }
  }
});

/* =============================== mount =============================== */
export const explainers = mountExplainers({ npvNet, verdict, race, spot });
export const _test = { NV, VD, RC, SP };
