/* Math 20-1 · Unit 8 · Lesson 3 — Problems Involving Systems.
 * New lesson format (2026-11-11): the warm-up ("The Cat, the Turtle and the Table") is plain markup on the page (no code).
 * Explainers:
 *   dogrun   (the five-step procedure, numbered 1–5 beside each line of working: a fence against a garage wall changes
 *             shape while a point traces the area parabola; the line y = 48 meets it twice (Example 2(b)), the line
 *             y = 60 misses it and the vertex shows the largest area, 50 (Example 2(c))),
 *   hill     (STAR: Example 3. The golf ball flies over the sloped hill until it lands where the parabola meets the hill
 *             line; the distance up the slope as a right triangle; a measuring stick slides between the hill and the
 *             path to find the greatest gap, 11.25 m at x = 15),
 *   radar    (Example 4: the radar range is a circle with a rotating sweep; a plane flies along its route and the screen
 *             lights up only while it is inside; entry and exit points, the distance inside; y = x + 15 never lights up),
 *   twoballs (Example 5: Ava's ball from the balcony and Ben's from the ground fly side by side while both height
 *             parabolas trace; the −5t² terms are struck out; the balls are level at 1.5 s, 18.75 m; landings 3 s, 4 s),
 *   profit   (Example 6: revenue and cost parabolas with a gap bar R − C that slides along, red for a loss and green for
 *             a profit; break-even points, the profit interval, and P = R − C with its vertex at 9, 108),
 *   tangent  (hands-on, Example 7: a slider turns the line y = kx − 3 about (0, −3) (a) or slides y = 2x + n (b) while
 *             b² − 4ac and the number of meeting points update live; tangent at b² − 4ac = 0).
 * Colours: parabola (quadratic) blue, line orange, solutions (meeting points) purple, b² − 4ac > 0 green, = 0 amber,
 *   < 0 red; a gap (profit, height above the hill) green, a loss red, a maximum red. */
import {
  h, tex, add, box, Graph, stamp, stampIn, mountExplainers, pop, fadeIn, appear, sleep, tween, svgEl, pulse, shake,
  linear, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const QU = COLORS.blue, LI = '#d9730d', SOL = COLORS.purple, OK = COLORS.green, NO = COLORS.red, AM = COLORS.amber, INK = COLORS.ink, GR = '#8d93a0';
const AV = '#0e8a9a', BN = COLORS.blue;
const fx = (v, d = 2) => { const k = Math.pow(10, d); let s = (Math.round((v + Math.sign(v) * 1e-9) * k) / k).toFixed(d); if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, ''); return s === '-0' ? '0' : s; };
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; if (el && el.label) el.label.style.opacity = 0; return el; };
const unhide = (el) => { if (el) el.style.opacity = ''; if (el && el.label) el.label.style.opacity = ''; return el; };
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
const absSvg = (stage, w, hh, x = 0, y = 0, cls = '') => { const s = svgEl('svg', { width: w, height: hh, viewBox: `0 0 ${w} ${hh}`, class: cls }, stage); s.style.position = 'absolute'; s.style.left = x + 'px'; s.style.top = y + 'px'; return s; };
const popP = (c, p) => Promise.all([pop(c, unhide(p)), p.label ? show(c, unhide(p.label)) : null]);
const drawOn = (c, G, el, ms = 700) => { unhide(el); return G.drawIn(el, ms, c); };
const easeOut = (t) => 1 - (1 - t) * (1 - t);
/* a work panel and its lines: n = the step number beside the line (0 = a blank number disc), tag = a part label */
const panel = (stage, x, y, w, hh) => div(stage, 'u8l3-pn', '', x, y, w, hh);
const wl = (P, html, o = {}) => {
  const lead = o.n != null ? `<b class="u8l3-sn${o.n ? '' : ' u8l3-sn0'}">${o.n || ''}</b>` : o.tag != null ? `<b class="u8l3-tg${o.tag ? '' : ' u8l3-tg0'}">${o.tag}</b>` : '';
  const d = h('div', 'u8l3-wl' + (o.cls ? ' ' + o.cls : ''), `${lead}<span class="u8l3-lt">${html}</span>`);
  P.appendChild(d); return hide(d);
};
const showAll = async (c, els, gap = 160) => { for (const e of els) { await show(c, e); await sleep(c, gap); } };

/* a ball drawn in SVG; g.at(x, y) places its centre */
function ballEl(svg, r = 9, stroke = '#c93a33') {
  const g = svgEl('g', {}, svg);
  svgEl('circle', { r, fill: '#fffdf6', stroke, 'stroke-width': 3 }, g);
  svgEl('path', { d: `M${-r * 0.7} ${-r * 0.55} q${r * 0.7} ${r * 0.55} 0 ${r * 1.1} M${r * 0.7} ${-r * 0.55} q${-r * 0.7} ${r * 0.55} 0 ${r * 1.1}`, fill: 'none', stroke, 'stroke-width': 1.5 }, g);
  g.at = (x, y) => g.setAttribute('transform', `translate(${x} ${y})`);
  return g;
}

/* =============================== explainer: the dog run (the five steps, numbered) =============================== */
const AREA = (x) => 20 * x - 2 * x * x;
const dogrun = {
  title: 'The five steps: the dog run',
  height: 440, minW: 820, capH: 92,
  choices: [{ sep: 'Example 2:' }, { v: 'b', label: `(b) area ${T('48\\text{ m}^2')}` }, { v: 'c', label: `(c) area ${T('60\\text{ m}^2')}` }],
  ask: (v) => (v === 'b'
    ? `<b>Example 2(b)</b>: 20 m of fence on three sides, against a garage wall. The area must be ${T('48\\text{ m}^2')}: what are the possible dimensions?`
    : `<b>Example 2(c)</b>: the same 20 m of fence. Could the run have an area of ${T('60\\text{ m}^2')}?`),
  make(stage, v, ex) {
    const W = ex.W, K = v === 'b' ? 48 : 60, SW = 290, SH = 250, KX = 13, WY = 32, CX = SW / 2;
    // the yard, seen from above: the wall along the top, the fence hanging down from it
    const sc = absSvg(stage, SW, SH, 0, 0, 'u8l3-yard');
    svgEl('rect', { x: 0, y: 0, width: SW, height: SH, rx: 12, fill: '#e4f1d6' }, sc);
    svgEl('rect', { x: 6, y: 8, width: SW - 12, height: WY - 8, fill: '#c9c4bb' }, sc);
    const wt = svgEl('text', { x: CX, y: 25, 'font-size': 14, 'text-anchor': 'middle', fill: '#3a4254' }, sc); wt.textContent = 'garage wall';
    const pen = svgEl('polygon', { fill: '#f7f1dc' }, sc);
    const fence = svgEl('polyline', { fill: 'none', stroke: '#8a5a2b', 'stroke-width': 5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, sc);
    const dog = svgEl('text', { 'font-size': 30, 'text-anchor': 'middle' }, sc); dog.textContent = '🐕';
    const lx = div(stage, 'u8l3-flab', '', 0, 0), lL = div(stage, 'u8l3-flab', '', 0, 0);
    const rd = div(stage, 'u8l3-read', '', 6, SH + 10, SW - 12);
    const chk = div(stage, 'u8l3-chk', '', 6, SH + 62, SW - 12);
    // the graph of the area
    const GX = SW + 10, GW = 350, G = new Graph(stage, { x: GX, y: 18, width: GW, height: 420, xmin: 0, xmax: 11, ymin: 0, ymax: 70, xstep: 1, ystep: 10, xlabels: 2, ylabels: 10,
      arrows: false, fnArrows: false, xtitle: 'x\\text{ (m)}', ytitle: 'y\\text{ (m}^2)', fontSize: 15 });
    const fo = { from: 0, to: 0, color: QU, width: 4 }, cv = G.fn(AREA, fo);
    const dot = hide(G.point(3, AREA(3), { color: 'blue', r: 6 }));
    const line = hide(G.line([0, K], [11, K], { color: LI, width: 3.5, arrows: false }));
    const lineLab = hide(G.label(10.9, K, T(`y=${K}`), { pos: 'nw', cls: 'bk-ptlab', color: LI }));
    const p4 = hide(G.point(4, 48, { color: 'purple', label: T('(4,\\ 48)'), pos: 'nw' })), p6 = hide(G.point(6, 48, { color: 'purple', label: T('(6,\\ 48)'), pos: 'ne' }));
    const pV = hide(G.point(5, 50, { color: 'red', label: T('(5,\\ 50)'), pos: 's', gap: 10 }));
    const miss = hide(stamp(stage, 'No solution ✗', { ok: false, x: GX + G.toPx(5.5, 0)[0], y: 18 + G.toPx(0, 30)[1], size: 'sm' }));
    const set = (x, trace = true) => {
      const L = (20 - 2 * x) * KX, D = x * KX, x0 = CX - L / 2, x1 = CX + L / 2, yb = WY + D;
      const pts = [[x0, WY], [x0, yb], [x1, yb], [x1, WY]].map((p) => p.join(',')).join(' ');
      fence.setAttribute('points', pts); pen.setAttribute('points', pts);
      dog.setAttribute('x', CX); dog.setAttribute('y', WY + D / 2 + 11); dog.style.opacity = D > 34 && L > 40 ? 1 : 0;
      lx.innerHTML = T(`x=${fx(x, 1)}`); lx.style.left = Math.max(2, x0 - 72) + 'px'; lx.style.top = (WY + D / 2 - 14) + 'px';
      lL.innerHTML = T(`20-2x=${fx(20 - 2 * x, 1)}`); lL.style.left = (CX - 66) + 'px'; lL.style.top = (yb + 4) + 'px';
      rd.innerHTML = `area ${T(`y=${fx(x, 1)}(${fx(20 - 2 * x, 1)})=${fx(AREA(x), 1)}`)} m²`;
      G.moveTo(dot, x, AREA(x)); if (trace && x > fo.to) { fo.to = x; cv._bkDraw(); }
      set.x = x;
    };
    set(3, false);
    const go = (c, x1, ms, ease = linear) => { const x0 = set.x; return tween(c, ms, (u) => set(x0 + (x1 - x0) * u), ease); };
    // the working, with step numbers
    const PX = GX + GW + 14, P = panel(stage, PX, 0, W - PX);
    const L1 = [wl(P, `${T('x')} = width out from the wall (m)`, { n: 1 }), wl(P, `${T('y')} = area (m²)`, { n: 0 })];
    const L2 = [wl(P, T('y=x(20-2x)=20x-2x^2'), { n: 2 }), wl(P, T(`y=${K}`), { n: 0 })];
    const L3 = v === 'b'
      ? [wl(P, T('20x-2x^2=48'), { n: 3 }), wl(P, T('x^2-10x+24=0'), { n: 0 }), wl(P, T('(x-4)(x-6)=0'), { n: 0 }), wl(P, `${T('x=4')} or ${T('x=6')}`, { n: 0 })]
      : [wl(P, T('20x-2x^2=60'), { n: 3 }), wl(P, T('x^2-10x+30=0'), { n: 0 }), wl(P, T('b^2-4ac=100-120=-20'), { n: 0 }), wl(P, '<b>no real solution</b>', { n: 0 })];
    const L4 = v === 'b'
      ? [wl(P, `${T('4+12+4=20')}, ${T('4\\times12=48')} ✓`, { n: 4 }), wl(P, `${T('6+8+6=20')}, ${T('6\\times8=48')} ✓`, { n: 0 })]
      : [wl(P, `vertex ${T('x=5')}: ${T('5\\times10=50')}`, { n: 4 }), wl(P, `${T('50<60')}: out of reach ✗`, { n: 0 })];
    const L5 = [wl(P, v === 'b' ? '<b>4 m by 12 m</b> or <b>6 m by 8 m</b>' : '<b>No</b>: at most 50 m²', { n: 5, cls: 'u8l3-wans' })];
    const steps = [
      { cap: `<b>1 · Define the variables</b>, with units: ${T('x')} = the width out from the wall, in metres; ${T('y')} = the area, in square metres.`,
        run: async (c) => { await showAll(c, L1); await Promise.all([pulse(c, lx, 1.15), pulse(c, rd, 1.04)]); } },
      { cap: `<b>2 · One equation per condition.</b> The side along the wall is ${T('20-2x')}, so ${T('y=x(20-2x)=20x-2x^2')}. Change ${T('x')}: the point traces a <b>parabola</b>.`,
        run: async (c) => { await show(c, L2[0]); unhide(dot); await go(c, 0, 500); await go(c, 10, 3400); } },
      { cap: `<b>2 ·</b> The other condition, the area: ${T(`y=${K}`)}, a horizontal <b>line</b>.`,
        run: async (c) => { await show(c, L2[1]); await drawOn(c, G, line, 700); await show(c, unhide(lineLab)); } }
    ];
    if (v === 'b') {
      steps.push(
        { cap: `<b>3 · Solve</b> by substitution: ${T('20x-2x^2=48')}, so ${T('x^2-10x+24=0')} and ${T('(x-4)(x-6)=0')}: ${T('x=4')} or ${T('x=6')}. The line meets the parabola <b>twice</b>.`,
          run: async (c) => { await showAll(c, L3); await popP(c, p4); await popP(c, p6); } },
        { cap: `<b>4 · Check</b> in the original conditions. ${T('x=4')}: the long side is 12, ${T('4+12+4=20')} m of fence and ${T('4\\times12=48')} ✓. ${T('x=6')}: ${T('6+8+6=20')} and ${T('6\\times8=48')} ✓.`,
          run: async (c) => { await go(c, 4, 1200, easeOut); chk.innerHTML = `${T('x=4')}: 4 m by 12 m ✓`; await show(c, L4[0]); await show(c, chk); await go(c, 6, 900, easeOut); chk.innerHTML += `<br>${T('x=6')}: 6 m by 8 m ✓`; await show(c, L4[1]); } },
        { cap: `<b>5 · Answer</b> in a sentence, with units: the dog run is <b>4 m by 12 m</b> or <b>6 m by 8 m</b>.`,
          run: async (c) => { await show(c, L5[0]); await pulse(c, L5[0], 1.06); } }
      );
    } else {
      steps.push(
        { cap: `<b>3 · Solve:</b> ${T('20x-2x^2=60')} gives ${T('x^2-10x+30=0')}, and ${T('b^2-4ac=100-120=-20<0')}: <b>no real solution</b>. The line misses the parabola.`,
          run: async (c) => { await showAll(c, L3); await stampIn(c, unhide(miss)); } },
        { cap: `<b>4 · Check</b> with the picture: the largest area is at the <b>vertex</b>, ${T('x=5')}: a 5 m by 10 m run, ${T('50\\text{ m}^2')}. Even that is less than 60.`,
          run: async (c) => { await go(c, 5, 1300, easeOut); await popP(c, pV); chk.innerHTML = `largest: ${T('5\\times10=50')} m²`; await showAll(c, L4); await show(c, chk); } },
        { cap: `<b>5 · Answer:</b> <b>no</b>. With 20 m of fence the largest area is ${T('50\\text{ m}^2')}, so ${T('60\\text{ m}^2')} is impossible.`,
          run: async (c) => { await show(c, L5[0]); await pulse(c, L5[0], 1.06); } }
      );
    }
    hide(chk);
    return steps;
  }
};

/* =============================== explainer: the golf ball and the hillside (STAR) =============================== */
const BALL = (x) => -0.05 * x * x + 2 * x, HILL = (x) => 0.5 * x, GAP = (x) => BALL(x) - HILL(x);
const hill = {
  title: 'The golf ball and the hillside',
  height: 440, minW: 840, capH: 92,
  ask: () => `<b>Example 3</b>: the ball's path is ${T('y=-0.05x^2+2x')} and the hillside is ${T('y=0.5x')}. Where does it land, how far up the slope is that, and how high above the hill does it get?`,
  make(stage, v, ex) {
    const W = ex.W, GW = 600, GH = 436;
    const G = new Graph(stage, { x: 0, y: 2, width: GW, height: GH, xmin: -2, xmax: 36, ymin: -2, ymax: 24, xstep: 2, ystep: 2, xlabels: 10, ylabels: 10,
      arrows: false, fnArrows: false, fontSize: 15, xtitle: 'x\\text{ (m)}', ytitle: 'y\\text{ (m)}' });
    // sky and hill, drawn from the actual line
    const P2 = (pts) => pts.map(([x, y]) => G.toPx(x, y).join(',')).join(' ');
    svgEl('polygon', { points: P2([[-2, 24], [36, 24], [36, -2], [-2, -2]]), fill: '#eaf3fb' }, G.layers.bg);
    svgEl('polygon', { points: P2([[-2, 0], [0, 0], [36, 18], [36, -2], [-2, -2]]), fill: '#bfe0a8' }, G.layers.bg);
    G.label(-1.2, 0, '<span class="u8l3-emo">🏌️</span>', { pos: 'n', gap: 0 });
    const hl = hide(G.fn(HILL, { from: 0, to: 36, color: LI, width: 4 }));
    const hlLab = hide(G.label(34, 17, T('y=0.5x'), { pos: 'se', cls: 'bk-ptlab', color: LI }));
    const fo = { from: 0, to: 0, color: QU, width: 3.5 }, cv = G.fn(BALL, fo);
    const ball = ballEl(G.layers.top, 8);
    const set = (x) => { const [px, py] = G.toPx(x, BALL(x)); ball.at(px, py - 8); if (x > fo.to) { fo.to = x; cv._bkDraw(); } };
    set(0);
    const pT = hide(G.point(0, 0, { color: GR, label: 'tee', pos: 'se' }));
    const pL = hide(G.point(30, 15, { color: 'purple', label: T('(30,\\ 15)'), pos: 'se', gap: 8 }));
    // (b) the right triangle under the slope
    const run = hide(G.segment([0, 0], [30, 0], { color: '#3a4254', width: 2.5, dash: '7 5' })), rise = hide(G.segment([30, 0], [30, 15], { color: '#3a4254', width: 2.5, dash: '7 5' }));
    const slope = hide(G.segment([0, 0], [30, 15], { color: SOL, width: 7 }));
    const runL = hide(G.label(15, 0, T('30'), { pos: 's', cls: 'bk-ptlab' })), riseL = hide(G.label(30, 7.5, T('15'), { pos: 'e', cls: 'bk-ptlab' }));
    const slL = hide(G.label(17, 8.5, T('\\approx33.5\\text{ m}'), { pos: 'nw', cls: 'bk-ptlab', color: SOL, gap: 10 }));
    // (c) the measuring stick between the hill and the path
    const stick = svgEl('line', { stroke: OK, 'stroke-width': 6, 'stroke-linecap': 'round' }, G.layers.top); stick.style.opacity = 0;
    const stL = div(G.html, 'u8l3-stick', '', 0, 0); hide(stL);
    const setS = (x) => {
      const [a, b] = G.toPx(x, HILL(x)), [, d] = G.toPx(x, BALL(x));
      stick.setAttribute('x1', a); stick.setAttribute('x2', a); stick.setAttribute('y1', b); stick.setAttribute('y2', d);
      stL.innerHTML = `${fx(GAP(x), 2)} m`; stL.style.left = (a + 8) + 'px'; stL.style.top = ((b + d) / 2 - 14) + 'px'; setS.x = x;
    };
    setS(0);
    const goS = (c, x1, ms) => { const x0 = setS.x; return tween(c, ms, (u) => setS(x0 + (x1 - x0) * u)); };
    const top = hide(G.point(20, 20, { color: GR, label: 'top of the flight', pos: 'n', r: 5 }));
    // the working
    const PX = GW + 14, P = panel(stage, PX, 0, W - PX);
    const La = [wl(P, T('-0.05x^2+2x=0.5x'), { tag: '(a)' }), wl(P, T('-0.05x^2+1.5x=0'), { tag: '' }), wl(P, T('-0.05x(x-30)=0'), { tag: '' }),
      wl(P, `${T('x=0')} (tee) or ${T('x=30')}`, { tag: '' }), wl(P, `${T('y=0.5(30)=15')}: ${T('(30,\\ 15)')}`, { tag: '' })];
    const Lb = [wl(P, `${T('d=\\sqrt{30^2+15^2}=\\sqrt{1125}')}`, { tag: '(b)' }), wl(P, `${T('d\\approx33.5')} m`, { tag: '' })];
    const Lc = [wl(P, `gap ${T('=(-0.05x^2+2x)-0.5x')}`, { tag: '(c)' }), wl(P, `${T('=-0.05x^2+1.5x')}`, { tag: '' }),
      wl(P, T('x=-\\frac{1.5}{2(-0.05)}=15'), { tag: '' }), wl(P, `${T('-0.05(225)+1.5(15)=11.25')} m`, { tag: '' })];
    return [
      { cap: `The hillside is a <b>line</b>, ${T('y=0.5x')}: it rises 0.5 m for every metre across.`,
        run: async (c) => { await drawOn(c, G, hl, 900); await show(c, unhide(hlLab)); } },
      { cap: `<b>Fore!</b> The ball follows the <b>parabola</b> ${T('y=-0.05x^2+2x')} until it comes down on the hillside.`,
        run: async (c) => { await tween(c, 2800, (u) => set(30 * u), linear); await shake(c, ball); } },
      { cap: `(a) Where they meet, the heights are equal. Factor: ${T('x=0')} is the tee, and ${T('x=30')} gives ${T('y=0.5(30)=15')}. The ball lands at <b>${T('(30,\\ 15)')}</b>.`,
        run: async (c) => { await showAll(c, La); await popP(c, pT); await popP(c, pL); } },
      { cap: `(b) Up the slope is the <b>distance</b> from ${T('(0,\\ 0)')} to ${T('(30,\\ 15)')}: a right triangle with legs 30 and 15, so ${T('d=\\sqrt{1125}\\approx33.5')} m.`,
        run: async (c) => { await drawOn(c, G, run, 500); await show(c, unhide(runL)); await drawOn(c, G, rise, 400); await show(c, unhide(riseL)); await drawOn(c, G, slope, 700); await show(c, unhide(slL)); await showAll(c, Lb); } },
      { cap: `(c) The height <b>above the hillside</b> is the vertical gap: the ball's height minus the hill's, ${T('-0.05x^2+1.5x')}. Slide the stick along: the gap grows, then shrinks.`,
        run: async (c) => {
          [run, rise, slope, runL, riseL, slL].forEach((e) => { e.style.opacity = 0.18; });
          stick.style.opacity = 1; await appear(c, stick); unhide(stL); await showAll(c, Lc.slice(0, 2)); await goS(c, 30, 2600); await goS(c, 8, 1200);
        } },
      { cap: `The gap is a parabola too: its vertex is at ${T('x=-\\frac{1.5}{2(-0.05)}=15')}, where the gap is <b>11.25 m</b>. (Not where the ball is highest: that is at ${T('x=20')}.)`,
        run: async (c) => { await goS(c, 15, 1000); await showAll(c, Lc.slice(2)); await pulse(c, stL, 1.25); await popP(c, top); } }
    ];
  }
};

/* =============================== explainer: the radar and the plane =============================== */
const radar = {
  title: 'The radar and the plane',
  height: 440, minW: 820, capH: 92,
  choices: [{ sep: 'Example 4:' }, { v: 'ab', label: `(a)–(b) ${T('y=x+2')}` }, { v: 'c', label: `(c) ${T('y=x+15')}` }],
  ask: (v) => (v === 'ab'
    ? `<b>Example 4(a)–(b)</b>: the radar range is ${T('x^2+y^2=100')} (km). Where does a plane on ${T('y=x+2')} enter and leave the range, and how far does it fly inside?`
    : `<b>Example 4(c)</b>: would a plane flying along ${T('y=x+15')} be detected by the radar ${T('x^2+y^2=100')}?`),
  make(stage, v, ex) {
    const W = ex.W, GS = 436, B = v === 'ab' ? 2 : 15;
    const G = new Graph(stage, { x: 0, y: 2, width: GS, height: GS, xmin: -14, xmax: 14, ymin: -14, ymax: 14, xstep: 1, ystep: 1, xlabels: 5, ylabels: 5, major: 5,
      arrows: false, fnArrows: false, fontSize: 14 });
    const [ox, oy] = G.toPx(0, 0), R = 10 * G.ux;
    const disc = svgEl('circle', { cx: ox, cy: oy, r: R, fill: 'rgba(18,128,90,.09)' }, G.layers.bg);
    const sweep = svgEl('g', { class: 'u8l3-sweep' }, G.layers.data);
    svgEl('path', { d: `M${ox} ${oy} L${ox + R} ${oy} A${R} ${R} 0 0 0 ${ox + R * Math.cos(0.5)} ${oy - R * Math.sin(0.5)} Z`, fill: 'rgba(18,128,90,.22)' }, sweep);
    svgEl('line', { x1: ox, y1: oy, x2: ox + R, y2: oy, stroke: OK, 'stroke-width': 2 }, sweep);
    sweep.style.transformBox = 'view-box'; sweep.style.transformOrigin = `${ox}px ${oy}px`;
    const N = 120, ring = G.polyline(Array.from({ length: N + 1 }, (_, i) => [10 * Math.cos(2 * Math.PI * i / N), 10 * Math.sin(2 * Math.PI * i / N)]), { color: OK, width: 3.5 });
    [disc, sweep, ring].forEach(hide);
    const cLab = hide(G.label(-7.1, -7.1, T('x^2+y^2=100'), { pos: 'sw', cls: 'bk-ptlab', color: OK }));
    G.label(0, 0, '<span class="u8l3-emo">📡</span>', { pos: 'c' });
    // the route and the plane
    const route = hide(G.line([0, B], [1, B + 1], { color: GR, width: 2.5, dash: '8 6', arrows: false }));
    const rLab = hide(G.label(v === 'ab' ? 11 : -12, (v === 'ab' ? 11 : -12) + B, T(`y=x+${B}`), { pos: v === 'ab' ? 'nw' : 'se', cls: 'bk-ptlab', color: '#3a4254', gap: 10 }));
    const fi = { from: -8, to: -8, color: SOL, width: 6 }, inside = G.fn((x) => x + B, fi);
    const plane = svgEl('g', {}, G.layers.top), pg = svgEl('g', { transform: 'rotate(-45)' }, plane);
    const blip = svgEl('circle', { r: 20, fill: 'none', stroke: OK, 'stroke-width': 3, class: 'u8l3-blip' }, pg);
    svgEl('path', { d: 'M17 0 L8 -2.6 L-11 -2.6 L-16 -8.5 L-19 -8.5 L-16.5 0 L-19 8.5 L-16 8.5 L-11 2.6 L8 2.6 Z', fill: '#3a4254' }, pg);
    svgEl('path', { d: 'M5 -2 L-4 -15 L-9 -15 L-5 -2 Z M5 2 L-4 15 L-9 15 L-5 2 Z', fill: '#3a4254' }, pg);
    const det = div(stage, 'u8l3-det', '● DETECTED', 10, 10);
    const X0 = v === 'ab' ? -14 : -14, X1 = v === 'ab' ? 12 : -1;
    const set = (x) => {
      const [px, py] = G.toPx(x, x + B); plane.setAttribute('transform', `translate(${px} ${py})`);
      const isIn = x * x + (x + B) * (x + B) < 100; det.classList.toggle('on', isIn); blip.style.display = isIn ? '' : 'none';
      if (isIn && x > fi.to) { fi.to = x; inside._bkDraw(); }
      set.x = x;
    };
    set(X0); hide(plane);
    const steps = [
      { cap: `The radar sees everything within <b>10 km</b> of the station: the circle ${T('x^2+y^2=100')}, every point 10 km from ${T('(0,\\ 0)')}.`,
        run: async (c) => { unhide(disc); await appear(c, disc); await drawOn(c, G, ring, 1100); unhide(sweep); await show(c, unhide(cLab)); } }
    ];
    const PX = GS + 18, P = panel(stage, PX, 0, W - PX);
    if (v === 'ab') {
      const pE = hide(G.point(-8, -6, { color: 'purple', label: `enters ${T('(-8,\\ -6)')}`, pos: 'se', gap: 8 })), pX = hide(G.point(6, 8, { color: 'purple', label: `leaves ${T('(6,\\ 8)')}`, pos: 'nw', gap: 8 }));
      const lg1 = hide(G.segment([-8, -6], [6, -6], { color: '#3a4254', width: 2.5, dash: '7 5' })), lg2 = hide(G.segment([6, -6], [6, 8], { color: '#3a4254', width: 2.5, dash: '7 5' }));
      const l1 = hide(G.label(-1, -6, T('14'), { pos: 's', cls: 'bk-ptlab' })), l2 = hide(G.label(6, 1, T('14'), { pos: 'e', cls: 'bk-ptlab' }));
      const La = [wl(P, T('x^2+(x+2)^2=100'), { tag: '(a)' }), wl(P, T('2x^2+4x+4=100'), { tag: '' }), wl(P, T('x^2+2x-48=0'), { tag: '' }), wl(P, T('(x+8)(x-6)=0'), { tag: '' }),
        wl(P, `${T('x=-8')}: ${T('y=-6')}; &nbsp;${T('x=6')}: ${T('y=8')}`, { tag: '' })];
      const Lb = [wl(P, T('d=\\sqrt{14^2+14^2}'), { tag: '(b)' }), wl(P, `${T('=\\sqrt{392}\\approx19.8')} km`, { tag: '' })];
      steps.push(
        { cap: `A plane flies along the line ${T('y=x+2')}. Watch the screen: it <b>lights up</b> while the plane is inside the circle.`,
          run: async (c) => { await drawOn(c, G, route, 600); await show(c, unhide(rLab)); unhide(plane); await appear(c, plane); await tween(c, 4200, (u) => set(X0 + (X1 - X0) * u), linear); } },
        { cap: `(a) Substitute ${T('y=x+2')} into ${T('x^2+y^2=100')}, expand and factor. The plane enters at <b>${T('(-8,\\ -6)')}</b> and leaves at <b>${T('(6,\\ 8)')}</b>.`,
          run: async (c) => { await showAll(c, La); await popP(c, pE); await popP(c, pX); } },
        { cap: `(b) The distance between the two points: 14 across and 14 up, so ${T('d=\\sqrt{14^2+14^2}=\\sqrt{392}\\approx19.8')} km inside the range.`,
          run: async (c) => { await drawOn(c, G, lg1, 500); await show(c, unhide(l1)); await drawOn(c, G, lg2, 500); await show(c, unhide(l2)); await showAll(c, Lb); } }
      );
    } else {
      const near = hide(G.segment([0, 0], [-7.5, 7.5], { color: '#3a4254', width: 2.5, dash: '5 5' }));
      const nL = hide(G.label(-3.75, 3.75, T('\\approx10.6'), { pos: 'sw', cls: 'bk-ptlab', gap: 6 }));
      const no = hide(stamp(stage, 'Not detected ✗', { ok: false, x: G.toPx(5.5, 0)[0], y: G.toPx(0, -11)[1], size: 'sm' }));
      const Lc = [wl(P, T('x^2+(x+15)^2=100'), { tag: '(c)' }), wl(P, T('x^2+x^2+30x+225=100'), { tag: '' }), wl(P, T('2x^2+30x+125=0'), { tag: '' }),
        wl(P, T('b^2-4ac=30^2-4(2)(125)'), { tag: '' }), wl(P, T('=900-1000=-100'), { tag: '' }), wl(P, `${T('-100<0')}: <b>no solution</b>`, { tag: '' })];
      steps.push(
        { cap: `A plane flies along ${T('y=x+15')}. It passes close to the circle, but the screen never lights up.`,
          run: async (c) => { await drawOn(c, G, route, 600); await show(c, unhide(rLab)); unhide(plane); await appear(c, plane); await tween(c, 3000, (u) => set(X0 + (X1 - X0) * u), linear); } },
        { cap: `(c) Substitute ${T('y=x+15')} into the circle and collect the terms: ${T('2x^2+30x+125=0')}.`,
          run: async (c) => { await showAll(c, Lc.slice(0, 3)); } },
        { cap: `${T('b^2-4ac=900-1000=-100<0')}: <b>no solution</b>. The line misses the circle, so the plane is <b>not detected</b> (its closest point is about 10.6 km away).`,
          run: async (c) => { await showAll(c, Lc.slice(3)); await drawOn(c, G, near, 500); await show(c, unhide(nL)); await stampIn(c, unhide(no)); } }
      );
    }
    return steps;
  }
};

/* =============================== explainer: two balls, one moment (Example 5) =============================== */
const AVA = (t) => -5 * t * t + 10 * t + 15, BEN = (t) => -5 * t * t + 20 * t;
const twoballs = {
  title: 'Two balls, one moment',
  height: 436, minW: 820, capH: 92,
  ask: () => `<b>Example 5</b>: at the same moment, Ava throws from a balcony, ${T('h=-5t^2+10t+15')}, and Ben from the ground, ${T('h=-5t^2+20t')}. When are they level, and who lands first?`,
  make(stage, v, ex) {
    const W = ex.W, SW = 200, GY = 4, GX = SW + 6, GW = 410;
    const G = new Graph(stage, { x: GX, y: GY, width: GW, height: 428, xmin: 0, xmax: 4.5, ymin: 0, ymax: 24, xstep: 0.5, ystep: 2, xlabels: 1, ylabels: 4,
      arrows: false, fnArrows: false, xtitle: 't\\text{ (s)}', ytitle: 'h\\text{ (m)}', fontSize: 15 });
    const py = (hh) => GY + G.toPx(0, hh)[1], gx = (t) => GX + G.toPx(t, 0)[0];
    const y0 = py(0), y15 = py(15);
    const sc = absSvg(stage, SW, 436, 0, 0, 'u8l3-scene');
    svgEl('rect', { x: 0, y: 0, width: SW, height: y0, fill: '#eaf3fb', rx: 10 }, sc);
    svgEl('rect', { x: 0, y: y0, width: SW, height: 436 - y0, fill: '#8cc084' }, sc);
    svgEl('rect', { x: 8, y: y15, width: 74, height: y0 - y15, fill: '#c9b79c', stroke: '#6b5a45', 'stroke-width': 3 }, sc);
    svgEl('rect', { x: 4, y: y15 - 5, width: 92, height: 7, fill: '#6b5a45' }, sc);
    for (let r = 0; r < 4; r++) for (let k = 0; k < 2; k++) svgEl('rect', { x: 20 + k * 30, y: y15 + 16 + r * (y0 - y15 - 30) / 4, width: 18, height: 18, fill: '#eaf3fb', stroke: '#6b5a45', 'stroke-width': 1.5 }, sc);
    const t1 = svgEl('text', { x: 78, y: y15 - 6, 'font-size': 28, 'text-anchor': 'middle' }, sc); t1.textContent = '🙋';
    const t2 = svgEl('text', { x: 158, y: y0 - 2, 'font-size': 30, 'text-anchor': 'middle' }, sc); t2.textContent = '🙋';
    const n1 = svgEl('text', { x: 44, y: y0 + 22, 'font-size': 16, 'font-weight': 800, fill: AV, 'text-anchor': 'middle' }, sc); n1.textContent = 'Ava';
    const n2 = svgEl('text', { x: 158, y: y0 + 22, 'font-size': 16, 'font-weight': 800, fill: '#1546a8', 'text-anchor': 'middle' }, sc); n2.textContent = 'Ben';
    const clock = div(stage, 'u8l3-clock', '', 8, 8);
    const ov = absSvg(stage, W, 436, 0, 0, 'u8l3-over');
    const level = svgEl('line', { stroke: SOL, 'stroke-width': 2.5, 'stroke-dasharray': '7 6' }, ov); level.style.opacity = 0;
    const AX = 104, BX = 182, ba = ballEl(ov, 9, AV), bb = ballEl(ov, 9, BN);
    const fa = { from: 0, to: 0, color: AV, width: 4 }, fb = { from: 0, to: 0, color: BN, width: 4 };
    const ca = G.fn(AVA, fa), cb = G.fn(BEN, fb);
    const da = G.point(0, 15, { color: AV, r: 6 }), db = G.point(0, 0, { color: 'blue', r: 6 });
    const set = (t, trace = true) => {
      const ta = Math.min(t, 3), tb = Math.min(t, 4), ha = AVA(ta), hb = BEN(tb);
      ba.at(AX, Math.min(py(ha), y0 - 9)); bb.at(BX, Math.min(py(hb), y0 - 9));
      G.moveTo(da, ta, ha); G.moveTo(db, tb, hb);
      if (trace) { if (ta > fa.to) { fa.to = ta; ca._bkDraw(); } if (tb > fb.to) { fb.to = tb; cb._bkDraw(); } }
      clock.innerHTML = `t = ${t.toFixed(2)} s`;
      set.t = t;
    };
    set(0);
    const go = (c, t1, ms, trace = false) => { const t0 = set.t; return tween(c, ms, (u) => set(t0 + (t1 - t0) * u, trace), linear); };
    const pM = hide(G.point(1.5, 18.75, { color: 'purple', label: T('(1.5,\\ 18.75)'), pos: 'n', gap: 10 }));
    const zA = hide(G.point(3, 0, { color: AV, label: T('3'), pos: 'n' })), zB = hide(G.point(4, 0, { color: 'blue', label: T('4'), pos: 'n' }));
    const br = hide(div(G.html, 'u8l3-br', '<span>1 s</span>', G.toPx(3, 0)[0], G.toPx(0, 0)[1] - 64, G.toPx(4, 0)[0] - G.toPx(3, 0)[0]));
    const PX = GX + GW + 14, P = panel(stage, PX, 0, W - PX);
    const La = [wl(P, T('-5t^2+10t+15=-5t^2+20t'), { tag: '(a)' }), wl(P, T('\\cancel{-5t^2}+10t+15=\\cancel{-5t^2}+20t'), { tag: '', cls: 'u8l3-cx' }),
      wl(P, `${T('15=10t')}, ${T('t=1.5')} s`, { tag: '' }), wl(P, T('h=-5(1.5)^2+20(1.5)'), { tag: '' }), wl(P, `${T('h=18.75')} m`, { tag: '' })];
    const Lb = [wl(P, `Ava: ${T('t^2-2t-3=0')}`, { tag: '(b)' }), wl(P, `${T('(t-3)(t+1)=0')}, ${T('t=3')}`, { tag: '' }), wl(P, `Ben: ${T('-5t(t-4)=0')}, ${T('t=4')}`, { tag: '' }),
      wl(P, '<b>Ava\'s lands 1 s sooner</b>', { tag: '' })];
    return [
      { cap: `<b>Throw!</b> Ava throws from the balcony, 15 m up, and Ben from the ground, at the same moment. Each height is a <b>parabola</b> in time.`,
        run: (c) => go(c, 4, 4200, true) },
      { cap: `(a) Level means the same height: set the two expressions equal. Both sides have ${T('-5t^2')}: the squared terms <b>cancel</b>, and a linear equation is left.`,
        run: async (c) => { await showAll(c, La.slice(0, 2), 400); } },
      { cap: `${T('15=10t')}, so ${T('t=1.5')} s, and ${T('h=-5(1.5)^2+20(1.5)=18.75')} m (Ava's equation gives the same). Back to 1.5 s: the balls are <b>level</b>.`,
        run: async (c) => {
          await showAll(c, La.slice(2)); await go(c, 1.5, 1400);
          const yy = py(18.75); level.setAttribute('x1', AX); level.setAttribute('x2', gx(1.5)); level.setAttribute('y1', yy); level.setAttribute('y2', yy);
          level.style.opacity = 1; await appear(c, level); await popP(c, pM);
        } },
      { cap: `(b) Landing means a height of 0. Ava: ${T('t^2-2t-3=0')}, ${T('(t-3)(t+1)=0')}, ${T('t=3')} s (${T('-1')} is before the throw). Ben: ${T('-5t(t-4)=0')}, ${T('t=4')} s (${T('t=0')} is the throw).`,
        run: async (c) => { level.style.opacity = 0.35; await showAll(c, Lb.slice(0, 3)); await go(c, 3, 1100); await popP(c, zA); await go(c, 4, 700); await popP(c, zB); } },
      { cap: `<b>Ava's ball lands first, 1 s sooner</b>, even though both balls reach the same greatest height, 20 m.`,
        run: async (c) => { await show(c, unhide(br)); await show(c, Lb[3]); } }
    ];
  }
};

/* =============================== explainer: revenue, cost and the profit gap (Example 6) =============================== */
const REV = (x) => -2 * x * x + 60 * x, COST = (x) => x * x + 6 * x + 135, PROF = (x) => REV(x) - COST(x);
const profit = {
  title: 'Revenue, cost and the profit gap',
  height: 436, minW: 820, capH: 92,
  ask: () => `<b>Example 6</b>: ${T('R=-2x^2+60x')} and ${T('C=x^2+6x+135')} (${T('x')} hundred cases; hundreds of dollars). Break-even, the profit interval, the greatest profit.`,
  make(stage, v, ex) {
    const W = ex.W, GW = 560;
    const G = new Graph(stage, { x: 0, y: 4, width: GW, height: 428, xmin: 0, xmax: 20, ymin: 0, ymax: 700, xstep: 1, ystep: 50, xlabels: 5, ylabels: 100,
      arrows: false, fnArrows: false, xtitle: 'x', ytitle: '\\text{\\$ (hundreds)}', fontSize: 15 });
    const shade = svgEl('polygon', { fill: OK, 'fill-opacity': 0.16 }, G.layers.bg);
    const pts = []; for (let i = 0; i <= 48; i++) { const x = 3 + 12 * i / 48; pts.push(G.toPx(x, REV(x))); } for (let i = 48; i >= 0; i--) { const x = 3 + 12 * i / 48; pts.push(G.toPx(x, COST(x))); }
    shade.setAttribute('points', pts.map((p) => p.join(',')).join(' ')); hide(shade);
    const cR = hide(G.fn(REV, { from: 0, to: 20, color: QU, width: 4 })), cC = hide(G.fn(COST, { from: 0, to: 20, color: LI, width: 4 }));
    const lR = hide(G.label(19.6, REV(19.6), T('R'), { pos: 'sw', cls: 'bk-ptlab', color: QU, gap: 8 })), lC = hide(G.label(19, COST(19), T('C'), { pos: 'nw', cls: 'bk-ptlab', color: LI, gap: 8 }));
    const bar = svgEl('line', { 'stroke-width': 11, 'stroke-linecap': 'butt', opacity: 0.85 }, G.layers.top); bar.style.opacity = 0;
    const bL = div(G.html, 'u8l3-bar', '', 0, 0); hide(bL);
    const setB = (x) => {
      const r = REV(x), cc = COST(x), [px, a] = G.toPx(x, r), [, b] = G.toPx(x, cc), p = r - cc, k = Math.abs(p) < 0.5 ? 1 : p > 0 ? 2 : 0;
      bar.setAttribute('x1', px); bar.setAttribute('x2', px); bar.setAttribute('y1', a); bar.setAttribute('y2', b); bar.setAttribute('stroke', k === 2 ? OK : k === 0 ? NO : AM);
      bL.className = 'u8l3-bar ' + (k === 2 ? 'u8l3-bp' : k === 0 ? 'u8l3-bl' : 'u8l3-b0');
      bL.innerHTML = k === 1 ? 'break even' : `${k === 2 ? 'profit' : 'loss'} ${fx(Math.abs(p), 0)}`;
      bL.style.left = (px + 10) + 'px'; bL.style.top = (Math.min(a, b) - 30) + 'px'; setB.x = x;
    };
    setB(0);
    const goB = (c, x1, ms) => { const x0 = setB.x; return tween(c, ms, (u) => setB(x0 + (x1 - x0) * u), linear); };
    const b3 = hide(G.point(3, 162, { color: 'purple', label: T('(3,\\ 162)'), pos: 'nw' })), b15 = hide(G.point(15, 450, { color: 'purple', label: T('(15,\\ 450)'), pos: 'n', gap: 9 }));
    const cP = hide(G.fn(PROF, { from: 3, to: 15, color: OK, width: 3, dash: '8 6' })), lP = hide(G.label(13.6, PROF(13.6), T('P=R-C'), { pos: 'ne', cls: 'bk-ptlab', color: OK }));
    const pV = hide(G.point(9, 108, { color: 'red', label: T('(9,\\ 108)'), pos: 'n', gap: 9 }));
    const PX = GW + 14, P = panel(stage, PX, 0, W - PX);
    const La = [wl(P, T('-2x^2+60x=x^2+6x+135'), { tag: '(a)' }), wl(P, T('0=3x^2-54x+135'), { tag: '' }), wl(P, T('0=x^2-18x+45'), { tag: '' }), wl(P, T('(x-3)(x-15)=0'), { tag: '' }),
      wl(P, `${T('x=3')} or ${T('x=15')}: 300, 1500 cases`, { tag: '' })];
    const Lb = [wl(P, `test ${T('x=9')}: ${T('R=378>C=270')}`, { tag: '(b)' }), wl(P, `profit for ${T('3<x<15')}`, { tag: '' })];
    const Lc = [wl(P, T('P=-3x^2+54x-135'), { tag: '(c)' }), wl(P, `${T('x=-\\frac{54}{2(-3)}=9')}, ${T('P=108')}`, { tag: '' }), wl(P, '<b>$10&#8239;800</b> from <b>900 cases</b>', { tag: '' })];
    return [
      { cap: `<b>Revenue</b> ${T('R')} (blue) is the money that comes in; <b>cost</b> ${T('C')} (orange) is the money that goes out. Both are parabolas.`,
        run: async (c) => { await drawOn(c, G, cR, 900); await show(c, unhide(lR)); await drawOn(c, G, cC, 900); await show(c, unhide(lC)); } },
      { cap: `The bar is the gap ${T('R-C')}. Slide it along: <b class="u8l3-cn">red</b> is a loss (cost above revenue), <b class="u8l3-cp">green</b> is a profit.`,
        run: async (c) => { bar.style.opacity = 0.85; unhide(bL); await appear(c, bar); await goB(c, 20, 4000); } },
      { cap: `(a) <b>Break even</b>: ${T('R=C')}. Collect everything on one side, divide by 3 and factor: ${T('x=3')} or ${T('x=15')}, so <b>300</b> and <b>1500</b> cases.`,
        run: async (c) => { await showAll(c, La); await goB(c, 15, 900); await popP(c, b15); await goB(c, 3, 1100); await popP(c, b3); } },
      { cap: `(b) A profit where revenue is above cost: <b>between</b> the break-even points. Test ${T('x=9')}: ${T('R=378')} and ${T('C=270')}, so ${T('R>C')}. More than 300 and fewer than 1500 cases.`,
        run: async (c) => { unhide(shade); await appear(c, shade); await goB(c, 9, 900); await showAll(c, Lb); } },
      { cap: `(c) The profit ${T('P=R-C=-3x^2+54x-135')} is a parabola too (dashed). Its vertex: ${T('x=9')}, ${T('P=108')}, the tallest green bar. <b>$10&#8239;800</b> from <b>900 cases</b>.`,
        run: async (c) => { await drawOn(c, G, cP, 900); await show(c, unhide(lP)); await popP(c, pV); await showAll(c, Lc); await pulse(c, bL, 1.2); } }
    ];
  }
};

/* =============================== explainer: turn the line (hands-on; Example 7) =============================== */
const VC = { 2: OK, 1: AM, 0: NO };
const kindOf = (D) => (Math.abs(D) < 1e-9 ? 1 : D > 0 ? 2 : 0);
const VERD = { 2: '<b>2 solutions</b>: the line crosses twice', 1: '<b>1 solution</b>: the line is <b>tangent</b>', 0: '<b>no solution</b>: the line misses' };
const tn = (v) => fx(v, 2);
const coefX = (k) => (k === 1 ? 'x' : k === -1 ? '-x' : k === 0 ? '' : `${tn(k)}x`);
const TG = {
  a: { lo: -6, hi: 6, start: 1, name: 'k', win: { xmin: -5, xmax: 5, ymin: -5, ymax: 13 }, par: (x) => x * x + 1, parT: 'y=x^2+1',
    ln: (s) => (x) => s * x - 3, lnT: (s) => `y=${coefX(s) || '0x'}-3`, sub: 'x^2+1=kx-3\\Rightarrow x^2-kx+4=0', D: (s) => s * s - 16, DT: (s) => `b^2-4ac=k^2-16=(${tn(s)})^2-16`,
    roots: (s, sq) => [(s - sq) / 2, (s + sq) / 2] },
  b: { lo: -6, hi: 5, start: -5, name: 'n', win: { xmin: -2, xmax: 7, ymin: -6, ymax: 14 }, par: (x) => x * x - 4 * x + 7, parT: 'y=x^2-4x+7',
    ln: (s) => (x) => 2 * x + s, lnT: (s) => `y=2x${s < 0 ? '-' + tn(-s) : s > 0 ? '+' + tn(s) : ''}`, sub: 'x^2-4x+7=2x+n\\Rightarrow x^2-6x+(7-n)=0', D: (s) => 8 + 4 * s, DT: (s) => `b^2-4ac=36-4(7-n)=8+4(${tn(s)})`,
    roots: (s, sq) => [(6 - sq) / 2, (6 + sq) / 2] }
};
const tangent = {
  title: 'Turn the line: how many meeting points?',
  height: 440, minW: 800, capH: 92,
  choices: [{ sep: 'Example 7:' }, { v: 'a', label: `(a) turn ${T('y=kx-3')}` }, { v: 'b', label: `(b) slide ${T('y=2x+n')}` }],
  ask: (v) => (v === 'a'
    ? `<b>Example 7(a)</b>: for which values of ${T('k')} is the line ${T('y=kx-3')} tangent to the parabola ${T('y=x^2+1')}? Where does it touch?`
    : `<b>Example 7(b)</b>: for which values of ${T('n')} does the system ${T('y=x^2-4x+7')}, ${T('y=2x+n')} have two solutions?`),
  make(stage, v, ex) {
    const d = TG[v], W = ex.W, GW = 430, S = { s: d.start };
    const G = new Graph(stage, Object.assign({ x: 0, y: 2, width: GW, height: 436, xstep: 1, ystep: 1, xlabels: v === 'a' ? 1 : 1, ylabels: 2, fontSize: 14, arrows: false, fnArrows: false }, d.win));
    G.fn(d.par, { color: QU, width: 4 });
    G.label(v === 'a' ? -3.1 : 5.9, v === 'a' ? 10.6 : d.par(5.9), T(d.parT), { pos: v === 'a' ? 'w' : 'e', cls: 'bk-ptlab', color: QU, gap: 10 });
    const ghosts = [], ln = G.fn((x) => d.ln(S.s)(x), { color: LI, width: 4 });
    if (v === 'a') G.point(0, -3, { color: 'ink', r: 5, label: T('(0,\\ -3)'), pos: 'e', gap: 8 });
    const q1 = G.point(0, 0, { color: 'purple', r: 7.5 }), q2 = G.point(0, 0, { color: 'purple', r: 7.5 });
    const glow = svgEl('circle', { r: 17, fill: 'none', stroke: AM, 'stroke-width': 4, class: 'u8l3-glow' }, G.layers.top);
    const P = div(stage, 'u8l3-tp', '', GW + 18, 0, W - GW - 18);
    const eq = h('div', 'u8l3-eqbig'); P.appendChild(eq);
    const sl = h('label', 'u8l3-sl no-ink', `<span class="u8l3-sll">${T(d.name)}</span><input type="range" min="${d.lo}" max="${d.hi}" step="0.25" aria-label="the value of ${d.name}"><span class="u8l3-slv"></span>`);
    sl.setAttribute('data-tap', ''); P.appendChild(sl);
    const inp = sl.querySelector('input'), slv = sl.querySelector('.u8l3-slv');
    P.appendChild(h('div', 'u8l3-sub', T(d.sub)));
    const dbox = h('div', 'u8l3-dbox'); P.appendChild(dbox);
    const verd = h('div', 'u8l3-verd'); P.appendChild(verd);
    const note = h('div', 'u8l3-tnote'); P.appendChild(note); hide(note);
    const upd = () => {
      const s = S.s, D = Math.round(d.D(s) * 10000) / 10000, k = kindOf(D), sq = Math.sqrt(Math.max(0, D)), f = d.ln(s);
      ln._bkDraw();
      const [r1, r2] = d.roots(s, sq);
      if (k === 0) { hide(q1); hide(q2); } else { G.moveTo(q1, r1, f(r1)); G.moveTo(q2, r2, f(r2)); unhide(q1); if (k === 2) unhide(q2); else hide(q2); }
      q1.querySelector('circle').setAttribute('fill', k === 1 ? AM : SOL);
      const [gx, gy] = G.toPx(r1, f(r1)); glow.setAttribute('cx', gx); glow.setAttribute('cy', gy); glow.style.display = k === 1 && G.inside(r1, f(r1)) ? '' : 'none';
      eq.innerHTML = T(d.lnT(s));
      inp.value = s; slv.textContent = tn(s).replace('-', '−');
      dbox.innerHTML = `${T(d.DT(s))}<br>${T('=')} <b class="u8l3-dv">${T(tn(D))}</b> ${T(k === 2 ? '>0' : k === 1 ? '=0' : '<0')}`;
      verd.innerHTML = VERD[k];
      P.classList.remove('u8l3-k0', 'u8l3-k1', 'u8l3-k2'); P.classList.add('u8l3-k' + k);
    };
    inp.addEventListener('input', () => { S.s = parseFloat(inp.value); upd(); });
    upd();
    const go = (c, to, ms) => { const s0 = S.s; return tween(c, ms, (u) => { S.s = Math.round((s0 + (to - s0) * u) * 100) / 100; upd(); }); };
    const ghost = (s, x) => { const f = d.ln(s), g = G.fn(f, { color: AM, width: 2.5, dash: '8 6' }), p = G.point(x, f(x), { color: 'amber', r: 6.5, label: T(`(${tn(x)},\\ ${tn(f(x))})`), pos: x < 0 ? 'nw' : 'ne', gap: 8 }); ghosts.push(g, p); return [g, p]; };
    if (v === 'a') {
      return [
        { cap: `Substitute the line into the parabola: ${T('x^2+1=kx-3')}, so ${T('x^2-kx+4=0')} and ${T('b^2-4ac=k^2-16')}. With ${T('k=1')}: ${T('1-16=-15<0')}, <b>no solution</b>.`,
          run: async (c) => { await pulse(c, dbox, 1.05); } },
        { cap: `Turn the line steeper. At ${T('k=6')}: ${T('36-16=20>0')}, <b>two solutions</b>: the line crosses the parabola twice.`,
          run: (c) => go(c, 6, 1800) },
        { cap: `<b>Tangent</b> means exactly one solution: ${T('b^2-4ac=0')}, so ${T('k^2=16')} and ${T('k=\\pm4')}. At ${T('k=4')}: ${T('x^2-4x+4=0')}, ${T('x=2')}, ${T('y=5')}: it just touches at <b>${T('(2,\\ 5)')}</b>.`,
          run: async (c) => { await go(c, 4, 1200); const [g, p] = ghost(4, 2); hide(g); hide(p); await drawOn(c, G, g, 400); await popP(c, p); } },
        { cap: `At ${T('k=-4')}: ${T('x^2+4x+4=0')}, ${T('x=-2')}, ${T('y=5')}: tangent at <b>${T('(-2,\\ 5)')}</b>. Two tangent lines pass through ${T('(0,\\ -3)')}.`,
          run: async (c) => { await go(c, -4, 2600); const [g, p] = ghost(-4, -2); hide(g); hide(p); await drawOn(c, G, g, 400); await popP(c, p); } },
        { cap: `<b>Your turn:</b> drag the slider. The sign of ${T('b^2-4ac')} and the number of meeting points always change together.`,
          run: async (c) => { await go(c, 2, 1200); await pulse(c, sl, 1.06); } }
      ];
    }
    return [
      { cap: `Substitute: ${T('x^2-4x+7=2x+n')}, so ${T('x^2-6x+(7-n)=0')} and ${T('b^2-4ac=36-4(7-n)=8+4n')}. With ${T('n=-5')}: ${T('8-20=-12<0')}, <b>no solution</b>.`,
        run: async (c) => { await pulse(c, dbox, 1.05); } },
      { cap: `Slide the line up. At ${T('n=-2')}: ${T('8+4(-2)=0')}, <b>one solution</b>: the line is tangent, at ${T('(3,\\ 4)')}.`,
        run: async (c) => { await go(c, -2, 1500); const [g, p] = ghost(-2, 3); hide(g); hide(p); await drawOn(c, G, g, 400); await popP(c, p); } },
      { cap: `Two solutions: ${T('8+4n>0')}, so ${T('4n>-8')} and <b>${T('n>-2')}</b>. Every line above the tangent line crosses the parabola twice.`,
        run: async (c) => { await go(c, 3, 1800); note.innerHTML = `two solutions: ${T('n>-2')}`; await show(c, note); } },
      { cap: `<b>Your turn:</b> drag the slider. The sign of ${T('b^2-4ac')} and the number of meeting points always change together.`,
        run: async (c) => { await go(c, 0, 1000); await pulse(c, sl, 1.06); } }
    ];
  }
};

/* =============================== Stand Up Break =============================== */
/* BEG: a sum and a product → two numbers. PRG: revenue R = −x² + Bx and a linear cost: break-even and maximum profit.
 * MAS: the value of k for which y = mx + k is tangent to a parabola, and the point of tangency. */
const sg = (v) => (v < 0 ? `-${-v}` : `+${v}`);
standup('u8l3', {
  intro: 'At your whiteboard: define the variables, write the system, solve it, check, and answer in a sentence.',
  levels: {
    BEG: (r) => {
      for (;;) {
        const a = r.int(2, 12), b = r.int(2, 15); if (a === b) continue;
        const s = a + b, p = a * b, lo = Math.min(a, b), hi = Math.max(a, b);
        return { text: `Two positive numbers have a sum of ${s} and a product of ${p}. Write a system of equations and determine the numbers.`, q: '',
          a: [`x+y=${s},\\ xy=${p}`, `x(${s}-x)=${p}\\Rightarrow x^2-${s}x+${p}=0`, `(x-${lo})(x-${hi})=0`, `\\text{The numbers are }${lo}\\text{ and }${hi}.`] };
      }
    },
    PRG: (r) => {
      for (;;) {
        const r1 = r.int(2, 8), r2 = r.int(12, 24), m = r.int(2, 12); if ((r1 + r2) % 2) continue;
        const B = r1 + r2 + m, c = r1 * r2, xv = (r1 + r2) / 2, pm = xv * xv - r1 * r2;
        return { text: `A small business sells <i>x</i> items a week. Its revenue and its cost, in dollars, are below. Determine the break-even quantities and the maximum profit.`,
          q: `R=-x^2+${B}x,\\qquad C=${m}x+${c}`,
          a: [`-x^2+${B}x=${m}x+${c}\\Rightarrow x^2-${r1 + r2}x+${c}=0`, `(x-${r1})(x-${r2})=0:\\ \\text{break even at }${r1}\\text{ and }${r2}\\text{ items}`,
            `P=-x^2+${r1 + r2}x-${c},\\ x=${xv}`, `\\text{Maximum profit }\\$${pm}\\text{ from }${xv}\\text{ items}`] };
      }
    },
    MAS: (r) => {
      for (;;) {
        const b = r.int(-6, 6), m = r.pick([-3, -2, -1, 1, 2, 3, 4]), c = r.int(-4, 9), dd = b - m; if (dd % 2 || dd === 0) continue;
        const k = c - dd * dd / 4, x = -dd / 2, y = m * x + k;
        const par = `y=x^2${b ? sg(b) + 'x' : ''}${c ? sg(c) : ''}`;
        return { text: 'Determine the value of <i>k</i> for which the line is tangent to the parabola, and state the point of tangency.',
          q: `y=${m === 1 ? '' : m === -1 ? '-' : m}x+k,\\qquad ${par}`,
          a: [`x^2${sg(dd)}x+(${c}-k)=0`, `\\text{Tangent: }(${dd})^2-4(${c}-k)=0\\Rightarrow k=${k}`, `x=${x},\\ y=${y}:\\ (${x},\\ ${y})`] };
      }
    }
  }
});

/* =============================== mount =============================== */
export const explainers = mountExplainers({ dogrun, hill, radar, twoballs, profit, tangent });
export const _test = { AREA, BALL, HILL, AVA, BEN, REV, COST };
