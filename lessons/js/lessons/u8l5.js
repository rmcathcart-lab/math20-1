/* Math 20-1 · Unit 8 · Lesson 5 — Quadratic Inequalities in Two Variables.
 * New lesson format (2026-11-11): the warm-up ("The Birthday Bet") is plain markup on the page (no code). Explainers:
 *   regions (above or below? each Example 1 point gets a vertical "ruler" up or down to the parabola: its y beats the
 *            parabola's height or it doesn't; then the region fills in and a rain of random points lights green / red;
 *            chips: Example 1(a) with ≥, (c) with > (the boundary points drop out), and a tap-your-own-points tool),
 *   graph3  (the ONE numbered procedure: boundary, one test point, shade, with the step number beside each line;
 *            Examples 2(a), 2(b), 3(a), 3(b) and 5(b), where (0, 0) is on the parabola),
 *   flip    (rearranging: the inequality sign flips over like a card when both sides are multiplied or divided by a
 *            negative; the region is checked in the original inequality, and the "forgot to reverse" side is stamped
 *            wrong; Example 4(a)–(c)),
 *   dial    (writing the inequality from a graph: every value of a gives a parabola with the same vertex / zeros; dial a
 *            until the curve passes through the point, then the sign from the shading; Example 6(a), (b)),
 *   tunnel  (STAR: a truck drives up to the tunnel arch; the region inside the arch lights up and the truck's top
 *            corners are tested as points: fits ✓, just fits, or scrapes ✗; Example 8).
 * Colours: the boundary parabola blue, the solution region green, a given (textbook) graph ink/gray, test points and
 *   rulers amber, solutions green, not solutions red, the dial family purple, the tunnel's lit region gold. */
import { h, tex, add, box, mountExplainers, pop, fadeIn, tween, anim, svgEl, pulse, shake, sleep, linear, COLORS,
  Graph, stamp, stampIn, num } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const BL = COLORS.blue, OK = COLORS.green, NO = COLORS.red, TP = '#c27a0e', RG = '#1a9a64', GG = '#8d93a0', INK = '#1c2230', PU = COLORS.purple, GOLD = '#f2c230';
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) { el.style.opacity = 0; if (el.label) el.label.style.opacity = 0; } return el; };
const unhide = (...els) => els.flat().forEach((e) => { if (e) { e.style.opacity = 1; if (e.label) e.label.style.opacity = 1; } });
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
const pt = (x, y) => `(${num(x)},\\ ${num(y)})`.replace(/−/g, '-');
/* a work line with its step number (n) beside it, and an optional note on the right */
const wl = (p, n, html, note, cls = '') => {
  const d = h('div', 'u8l5-wl ' + cls, `<b class="u8l5-sn${n ? '' : ' u8l5-sn0'}">${n || ''}</b><span class="u8l5-lt">${html}</span>${note ? `<span class="u8l5-note">${note}</span>` : ''}`);
  p.appendChild(d); return hide(d);
};
const stampOn = (host, text, ok, x, y, size) => hide(stamp(host, text, { ok, x, y, rotate: -8, size }));
const sIn = async (c, el) => { el.style.opacity = 1; await stampIn(c, el); };
/* a little seeded random, so a replayed step (Back) draws the same "random" points */
const seeded = (s) => () => { s |= 0; s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

/* ---------- drawing helpers on a Graph ---------- */
/* the region between y = f(x) and the top (side 'above') or bottom ('below') of the window, or o.edge; st.t (0…1)
 * sweeps it out from the boundary (paint rolling away from the parabola). o: { from, to, edge, floor, color, op } */
function region(G, f, side, o = {}) {
  const st = { t: o.t ?? 1 };
  const g = G.curve(() => {
    const w = G.win, lo = w.ymin - 1, hi = w.ymax + 1, a = Math.max(o.from ?? -Infinity, w.xmin), b = Math.min(o.to ?? Infinity, w.xmax), N = 160;
    const E = o.edge != null ? o.edge : side === 'above' ? hi : lo, A = [], B = [];
    for (let i = 0; i <= N; i++) {
      const x = a + (b - a) * i / N; let y = Math.max(lo, Math.min(hi, f(x)));
      if (o.floor != null) y = Math.max(o.floor, y);
      A.push(G.toPx(x, y)); B.push(G.toPx(x, y + st.t * (E - y)));
    }
    return { subs: [A.concat(B.reverse())], closed: true };
  }, { color: o.color || RG, width: 1, fill: o.color || RG, fillOpacity: o.op ?? 0.22 }, 'u8l5-reg', G.layers.data);
  g.path.setAttribute('stroke', 'none');
  G.layers.data.insertBefore(g, G.layers.data.firstChild);
  g.set = (t) => { st.t = t; g._bkDraw(); };
  return g;
}
const sweep = (c, R, ms = 900) => { R.style.opacity = 1; R.set(0); return tween(c, ms, (t) => R.set(t)); };
/* an × mark at a graph point */
function cross(G, x, y, color = NO, s = 7) {
  const g = svgEl('g', { class: 'u8l5-x' }, G.layers.top), a = svgEl('line', { stroke: color, 'stroke-width': 3.6, 'stroke-linecap': 'round' }, g), b = svgEl('line', { stroke: color, 'stroke-width': 3.6, 'stroke-linecap': 'round' }, g);
  g.gx = x; g.gy = y;
  return G.track(g, () => { const [px, py] = G.toPx(g.gx, g.gy); a.setAttribute('x1', px - s); a.setAttribute('y1', py - s); a.setAttribute('x2', px + s); a.setAttribute('y2', py + s); b.setAttribute('x1', px - s); b.setAttribute('y1', py + s); b.setAttribute('x2', px + s); b.setAttribute('y2', py - s); });
}
const setPt = (p, color, open) => { const ci = p.querySelector('circle'); ci.setAttribute('fill', open ? '#fff' : color); ci.setAttribute('stroke', open ? color : '#fff'); ci.setAttribute('stroke-width', open ? 3.5 : 2); };

/* ---------- static figures on the example cards ---------- */
function sketch(id, o) {
  const host = document.getElementById(id); if (!host) return null;
  const [x0, x1, y0, y1] = o.win;
  const G = new Graph(host, { width: o.w || 300, height: o.h || 300, xmin: x0, xmax: x1, ymin: y0, ymax: y1, xlabels: o.xl || 2, ylabels: o.yl || 2, fontSize: 13 });
  if (o.side) region(G, o.f, o.side, { color: o.given ? GG : RG, op: o.given ? 0.3 : 0.22, from: o.rfrom, to: o.rto, edge: o.edge });
  if (o.f && o.curve !== false) G.fn(o.f, { color: o.given || o.plain ? INK : BL, width: 3, dash: o.dash, from: o.from, to: o.to });
  (o.pts || []).forEach(([x, y, lab, pos]) => G.point(x, y, { color: o.given || o.plain ? INK : BL, r: 5, label: lab != null ? T(lab) : undefined, pos }));
  (o.yes || []).forEach(([x, y]) => G.point(x, y, { color: OK, r: 6 }));
  (o.no || []).forEach(([x, y]) => cross(G, x, y, NO, 6));
  if (o.extra) o.extra(G);
  return G;
}

/* =============================== explainer: above or below? =============================== */
const F1 = (x) => x * x - 2 * x - 3;
const P1 = [[0, 0], [4, 1], [1, -5], [-2, 5], [2, 1], [0, -4], [3, 0]];
const regions = {
  title: 'Above or below the parabola?',
  height: 470, minW: 940,
  choices: [{ v: 'ge', label: 'Example 1(a)' }, { v: 'gt', label: '(c)' }, { v: 'tap', label: 'Tap your own points' }],
  ask: (v) => v === 'gt' ? `Example 1(c): which points are solutions of ${T('y>x^2-2x-3')}?`
    : v === 'tap' ? `Is your point a solution of ${T('y\\ge x^2-2x-3')}?` : `Example 1(a): which points are solutions of ${T('y\\ge x^2-2x-3')}?`,
  make(stage, v, ex) {
    const W = ex.W, strict = v === 'gt', rel = strict ? '>' : '\\ge ';
    const G = new Graph(stage, { x: 4, y: 4, width: 440, height: 462, xmin: -3.5, xmax: 5.5, ymin: -5.5, ymax: 6.5, xlabels: 1, ylabels: 2, fontSize: 15, pad: [24, 16, 16, 16] });
    const R = region(G, F1, 'above'); hide(R);
    const P = G.fn(F1, { color: BL, width: 4, dash: strict }); hide(P);
    const pl = hide(G.label(5.4, -2.4, T('y=x^2-2x-3'), { pos: 'w', color: BL, cls: 'bk-ptlab' }));
    const inL = hide(G.label(1, 4.6, 'inside', { cls: 'bk-pill u8l5-inl' })), outL = hide(G.label(-2.2, -3.6, 'outside', { cls: 'bk-pill u8l5-outl' }));
    const Rp = div(stage, 'u8l5-panel', '', 460, 4, W - 464, 462);
    // the table of the seven points
    const rows = P1.map(([x, y]) => { const fv = F1(x), yes = strict ? y > fv : y >= fv, on = y === fv; return { x, y, fv, yes, on, verdict: `${yes ? 'yes' : 'no'}: ${T(`${num(y)}${on ? '=' : y > fv ? rel : '<'}${num(fv)}`.replace(/−/g, '-'))}` }; });
    const tb = h('table', 'u8l5-etbl', `<tr><th>Point</th><th>${T('x^2-2x-3')}</th><th>Is ${T(`y${rel}x^2-2x-3`)}?</th></tr>` + rows.map((r) => `<tr><td>${T(pt(r.x, r.y))}</td><td class="u8l5-c1">${T(num(r.fv).replace('−', '-'))}</td><td class="u8l5-c2 ${r.yes ? 'u8l5-ok' : 'u8l5-no'}">${r.verdict}</td></tr>`).join(''));
    if (v !== 'tap') Rp.appendChild(tb);
    const cells = [...tb.querySelectorAll('tr')].slice(1).map((tr) => [tr.children[1], tr.children[2]]);
    cells.flat().forEach(hide);
    // the points, their rulers to the parabola and the marks where the rulers meet it
    const dots = rows.map((r) => hide(G.point(r.x, r.y, { color: TP, r: 8 })));
    const xs = rows.map((r) => hide(cross(G, r.x, r.y, NO, 8)));
    const rul = rows.map((r) => (r.on ? null : hide(G.segment([r.x, r.y], [r.x, r.fv], { color: TP, width: 3, dash: '6 6' }))));
    const mk = rows.map((r) => (r.on ? null : hide(G.point(r.x, r.fv, { color: BL, r: 5.5, label: T(num(r.fv).replace('−', '-')), pos: r.x < 1 ? 'w' : 'e' }))));
    const test = async (c, i, quick) => {
      const r = rows[i], d = dots[i];
      d.style.opacity = 1; await pop(c, d, quick ? 200 : 380);
      if (rul[i]) { rul[i].style.opacity = 1; await G.drawIn(rul[i], quick ? 250 : 600, c); mk[i].style.opacity = 1; if (mk[i].label) mk[i].label.style.opacity = 1; await pop(c, mk[i], 250); }
      else await pulse(c, d, 1.4);
      unhide(cells[i][0]); await pop(c, cells[i][0], 200);
      if (r.yes) setPt(d, OK); else { d.style.opacity = 0; xs[i].style.opacity = 1; await pop(c, xs[i], 250); }
      unhide(cells[i][1]); await pop(c, cells[i][1], 200);
      await sleep(c, quick ? 120 : 350);
      if (rul[i]) { rul[i].style.opacity = 0; mk[i].style.opacity = 0; if (mk[i].label) mk[i].label.style.opacity = 0; }
    };
    const drawP = async (c) => { P.style.opacity = 1; await G.drawIn(P, 900, c); await show(c, pl); };
    const shade = async (c) => { await sweep(c, R, 1000); unhide(inL, outL); await Promise.all([pop(c, inL), pop(c, outL)]); };
    if (v === 'tap') {
      const chk = div(Rp, 'u8l5-chk', `<div class="u8l5-ph">Your point</div><div class="u8l5-chkq">Tap the grid to drop a point.</div><div class="u8l5-chkv"></div><div class="u8l5-chkf">Green: a solution · red: not a solution<br>Drag a point to move it; tap it again to remove it.</div>`);
      hide(chk);
      const q = chk.querySelector('.u8l5-chkq'), vv = chk.querySelector('.u8l5-chkv');
      const onChange = (pts) => {
        (G.userPts || []).forEach((p) => setPt(p, p.gy >= F1(p.gx) - 1e-9 ? OK : NO));
        if (!pts.length) { q.innerHTML = 'Tap the grid to drop a point.'; vv.innerHTML = ''; return; }
        const [x, y] = pts[pts.length - 1], fv = F1(x), yes = y >= fv - 1e-9;
        q.innerHTML = `${T(pt(x, y))}: &nbsp;${T(`x^2-2x-3=${num(fv).replace('−', '-')}`)}`;
        vv.innerHTML = `${T(`${num(y).replace('−', '-')}\\ ${yes ? (Math.abs(y - fv) < 1e-9 ? '=' : '\\ge') : '<'}\\ ${num(fv).replace('−', '-')}`)} <b class="${yes ? 'u8l5-ok' : 'u8l5-no'}">${yes ? '✓ a solution' : '✗ not a solution'}</b>`;
      };
      return [
        { cap: `The boundary ${T('y=x^2-2x-3')} is <b>solid</b> (the sign is ${T('\\ge')}), and the solutions are on or <b>above</b> it, inside the parabola.`, run: async (c) => { await drawP(c); await shade(c); } },
        { cap: '<b>Tap the grid</b> anywhere to drop a point: it turns <b>green</b> if it is a solution and <b>red</b> if it is not. Try points near the parabola!', run: async (c) => {
          G.interactive({ snap: 0.5, color: TP, onChange }); await show(c, chk); } }
      ];
    }
    // the rain of random points (computed now, so Back replays the same picture)
    const rnd = seeded(85), rain = [];
    for (let i = 0; i < 70; i++) { const x = -3.3 + rnd() * 8.6, y = -5.3 + rnd() * 11.6, fv = F1(x); if (Math.abs(y - fv) < 0.25) continue; rain.push([x, y, strict ? y > fv : y >= fv]); }
    const rainG = svgEl('g', { class: 'u8l5-rain' }, G.layers.top);
    const rainDots = rain.map(([x, y, ok]) => { const [px, py] = G.toPx(x, y); return hide(svgEl('circle', { cx: px, cy: py, r: 5, fill: ok ? OK : NO, stroke: '#fff', 'stroke-width': 1.5 }, rainG)); });
    if (strict) {
      return [
        { cap: `For ${T('y>x^2-2x-3')} the boundary is drawn <b>dashed</b>: the sign ${T('>')} has no “=” in it.`, run: drawP },
        { cap: 'Test the seven points the same way: compare each point’s height with the parabola’s height at that x.', run: async (c) => { for (let i = 0; i < rows.length; i++) await test(c, i, true); } },
        { cap: `${T('(-2,\\ 5)')} and ${T('(3,\\ 0)')} are <b>on</b> the parabola: ${T('5>5')} and ${T('0>0')} are false. On a dashed boundary they are <b>not</b> solutions.`, run: async (c) => {
          for (const i of [3, 6]) { xs[i].style.opacity = 0; dots[i].style.opacity = 1; setPt(dots[i], NO, true); await shake(c, dots[i]); } } },
        { cap: `Only ${T('(0,\\ 0)')} and ${T('(2,\\ 1)')} are solutions. Shade above the parabola (inside), but leave the boundary out.`, run: shade },
        { cap: '70 random points: every one in the shaded region is a solution, every one outside is not.', run: async (c) => { for (const d of rainDots) { d.style.opacity = 1; if (!c.fast) await sleep(c, 22); } } }
      ];
    }
    return [
      { cap: `The boundary is ${T('y=x^2-2x-3')}. At every ${T('x')}, the parabola’s height is the value of ${T('x^2-2x-3')}.`, run: drawP },
      { cap: `Test ${T('(0,\\ 0)')}: at ${T('x=0')} the parabola is at ${T('-3')}. Is ${T('0\\ge-3')}? Yes: the point is above it, a <b>solution</b>.`, run: (c) => test(c, 0) },
      { cap: `${T('(4,\\ 1)')}: at ${T('x=4')} the parabola is at ${T('5')}, and ${T('1<5')}. The point is below it: <b>not</b> a solution.`, run: (c) => test(c, 1) },
      { cap: 'The other points the same way: is the point’s y at least the parabola’s height?', run: async (c) => { for (let i = 2; i < rows.length; i++) await test(c, i, true); } },
      { cap: `${T('(-2,\\ 5)')} and ${T('(3,\\ 0)')} are <b>on</b> the parabola (${T('5=5')}, ${T('0=0')}). The sign ${T('\\ge')} includes “=”, so they are solutions.`, run: async (c) => { await Promise.all([pulse(c, dots[3], 1.5), pulse(c, dots[6], 1.5)]); } },
      { cap: 'All the solutions are on or <b>above</b> the parabola, which is <b>inside</b> it. Shade that whole region: the solution region.', run: shade },
      { cap: '70 random points: every one in the shaded region is a solution (green), every one outside is not (red).', run: async (c) => { for (const d of rainDots) { d.style.opacity = 1; if (!c.fast) await sleep(c, 22); } } }
    ];
  }
};

/* =============================== explainer: graph the region in 3 steps (the procedure) =============================== */
const G3 = {
  e2a: { label: 'Example 2(a)', eq: 'y\\le x^2-6x+5', f: (x) => x * x - 6 * x + 5, win: [-1.5, 7.5, -5.5, 8.5], strict: false,
    b: ['y=(x-1)(x-5)', '\\text{vertex }(3,\\ -4),\\ \\ y\\text{-int }5'], pts: [[1, 0], [5, 0], [3, -4], [0, 5], [6, 5]],
    capB: `Factor: ${T('y=(x-1)(x-5)')}, so the x-intercepts are ${T('1')} and ${T('5')}. The axis ${T('x=3')} gives the vertex ${T('(3,\\ -4)')}; the y-intercept is ${T('5')}.`,
    sub: '0\\le5', ok: true, side: 'below', where: 'below (outside)' },
  e2b: { label: '(b)', eq: 'y>-x^2-2x+8', f: (x) => -x * x - 2 * x + 8, win: [-6.5, 4.5, -4.5, 10.5], strict: true,
    b: ['y=-(x+4)(x-2)', '\\text{vertex }(-1,\\ 9),\\ \\ y\\text{-int }8'], pts: [[-4, 0], [2, 0], [-1, 9], [0, 8], [-2, 8]],
    capB: `Factor: ${T('y=-(x^2+2x-8)=-(x+4)(x-2)')}: x-intercepts ${T('-4')} and ${T('2')}. The axis ${T('x=-1')} gives the vertex ${T('(-1,\\ 9)')}; the y-intercept is ${T('8')}.`,
    sub: '0>8', ok: false, side: 'above', where: 'above (outside)' },
  e3a: { label: 'Example 3(a)', eq: 'y\\ge2(x-1)^2-8', f: (x) => 2 * (x - 1) ** 2 - 8, win: [-3.5, 5.5, -9.5, 6.5], strict: false,
    b: ['\\text{vertex }(1,\\ -8),\\ \\text{opens up}', 'x\\text{-int }-1,\\ 3;\\ \\ y\\text{-int }-6'], pts: [[1, -8], [-1, 0], [3, 0], [0, -6], [2, -6]],
    capB: `Vertex ${T('(1,\\ -8)')}, opens up, step pattern ${T('2,\\ 6,\\ \\dots')} The x-intercepts: ${T('(x-1)^2=4')}, so ${T('x=-1')} or ${T('3')}; the y-intercept is ${T('-6')}.`,
    sub: '0\\ge-6', ok: true, side: 'above', where: 'above (inside)' },
  e3b: { label: '(b)', eq: 'y<-\\frac{1}{2}(x+2)(x-4)', f: (x) => -0.5 * (x + 2) * (x - 4), win: [-3.5, 5.5, -5.5, 6.5], strict: true,
    b: ['x\\text{-int }-2,\\ 4;\\ \\ \\text{axis }x=1', '\\text{vertex }(1,\\ 4.5),\\ \\ y\\text{-int }4'], pts: [[-2, 0], [4, 0], [1, 4.5], [0, 4], [2, 4]],
    capB: `The x-intercepts are ${T('-2')} and ${T('4')}, so the axis is ${T('x=1')}. Vertex: ${T('y=-\\frac{1}{2}(3)(-3)=4.5')}, so ${T('(1,\\ 4.5)')}; the y-intercept is ${T('4')}.`,
    sub: '0<4', ok: true, side: 'below', where: 'below (outside)' },
  e5b: { label: 'Example 5(b)', eq: 'y\\le x^2-4x', f: (x) => x * x - 4 * x, win: [-2.5, 6.5, -5.5, 6.5], strict: false,
    b: ['y=x(x-4)', '\\text{vertex }(2,\\ -4)'], pts: [[0, 0], [4, 0], [2, -4]],
    capB: `Factor: ${T('y=x(x-4)')}, so the x-intercepts are ${T('0')} and ${T('4')}. The axis ${T('x=2')} gives the vertex ${T('(2,\\ -4)')}.`,
    tp: [2, 0], sub: '0\\le2^2-4(2)=-4', ok: false, side: 'below', where: 'below (outside)', origin: true }
};
const graph3 = {
  title: 'Graph the region: boundary, test point, shade',
  height: 470, minW: 940,
  choices: Object.keys(G3).map((k) => ({ v: k, label: G3[k].label })),
  ask: (v) => `Example ${v[1]}(${v[2]}): graph the solution region of ${T(G3[v].eq)}.`,
  make(stage, v, ex) {
    const d = G3[v], W = ex.W, [x0, x1, y0, y1] = d.win, tp = d.tp || [0, 0], sg = d.eq.match(/\\le|\\ge|<|>/)[0];
    const G = new Graph(stage, { x: 4, y: 4, width: 440, height: 462, xmin: x0, xmax: x1, ymin: y0, ymax: y1, xlabels: 1, ylabels: 2, fontSize: 15, pad: [24, 16, 16, 16] });
    const R = region(G, d.f, d.side); hide(R);
    const P = G.fn(d.f, { color: BL, width: 4, dash: d.strict }); hide(P);
    const kp = d.pts.map(([x, y]) => hide(G.point(x, y, { color: BL, r: 6.5 })));
    const Rp = div(stage, 'u8l5-panel u8l5-steps3', '', 460, 4, W - 464, 462);
    const L1 = wl(Rp, 1, T(d.b[0]), 'boundary'), L2 = wl(Rp, 0, T(d.b[1])), L3 = wl(Rp, 0, `<span class="${d.strict ? 'u8l5-dash' : 'u8l5-solid'}"></span><b>${d.strict ? 'Dashed' : 'Solid'}</b>: the sign is ${T(sg)}`);
    const L0 = d.origin ? wl(Rp, 2, `Try ${T('(0,\\ 0)')}: ${T('0\\le0')}, it is <b>on</b> the parabola`, 'no help', 'u8l5-grayl') : null;
    const L4 = wl(Rp, d.origin ? 0 : 2, `Test ${T(pt(...tp))}: &nbsp;${T(d.sub)} &nbsp;<b class="${d.ok ? 'u8l5-ok' : 'u8l5-no'}">${d.ok ? 'true' : 'false'}</b>`, 'test point');
    const L5 = wl(Rp, 3, `${d.ok ? 'True' : 'False'}: shade the side ${d.ok ? 'with' : 'without'} ${T(pt(...tp))}: <b>${d.where}</b>`, 'shade');
    const T0 = d.origin ? hide(G.point(0, 0, { color: GG, r: 8 })) : null;
    const TPt = hide(G.point(tp[0], tp[1], { color: TP, r: 8.5, label: 'test', pos: 'se' }));
    const [mpx, mpy] = G.toPx(tp[0], tp[1]);
    const mark = hide(div(G.html, 'u8l5-vm ' + (d.ok ? 'u8l5-vok' : 'u8l5-vno'), d.ok ? '✓' : '✗', mpx - 17, mpy - 60));
    const where = d.side === 'above' ? 'above' : 'below';
    const steps = [
      { cap: `<b>Step 1:</b> the boundary ${T(d.eq.replace(/\\le|\\ge|<|>/, '='))}. ${d.capB}`, run: async (c) => { unhide(L1); await show(c, L1); unhide(L2); await show(c, L2); for (const p of kp) { p.style.opacity = 1; await pop(c, p, 260); } } },
      { cap: `Draw the parabola through the points, <b>${d.strict ? 'dashed' : 'solid'}</b>: the sign ${T(sg)} ${d.strict ? 'has no' : 'includes'} “=”.`, run: async (c) => { unhide(L3); await show(c, L3); P.style.opacity = 1; await G.drawIn(P, 1000, c); } }
    ];
    if (d.origin) steps.push({ cap: `<b>Step 2:</b> a test point. Not ${T('(0,\\ 0)')} this time: ${T('0^2-4(0)=0')}, so it is <b>on</b> the parabola and tells us nothing.`, run: async (c) => { T0.style.opacity = 1; await pop(c, T0); await shake(c, T0); unhide(L0); await show(c, L0); } });
    steps.push(
      { cap: d.origin ? `Use ${T('(2,\\ 0)')}, straight above the vertex: is ${T('0\\le2^2-4(2)')}? ${T('0\\le-4')} is <b>false</b>.` : `<b>Step 2:</b> test ${T('(0,\\ 0)')}, which is not on the parabola: ${T(d.sub)} is <b>${d.ok ? 'true' : 'false'}</b>.`,
        run: async (c) => { if (T0) T0.style.opacity = 0.35; TPt.style.opacity = 1; if (TPt.label) TPt.label.style.opacity = 1; await pop(c, TPt); unhide(L4); await show(c, L4); unhide(mark); await pop(c, mark); } },
      { cap: `<b>Step 3:</b> ${d.ok ? 'true' : 'false'}, so shade the side ${d.ok ? 'that contains' : 'that does not contain'} the test point: <b>${where}</b> the parabola (${d.where.split('(')[1].replace(')', '')}).`,
        run: async (c) => { unhide(L5); await show(c, L5); await sweep(c, R, 1000); } }
    );
    return steps;
  }
};

/* =============================== explainer: rearranging, the sign flips =============================== */
const FL = {
  a: { label: 'Example 4(a)', orig: 'y-3>x^2-4x',
    lines: [{ L: 'y-3', s: '>', R: 'x^2-4x' }, { L: 'y', s: '>', R: 'x^2-4x+3', note: 'add 3' }],
    capM: `Add ${T('3')} to both sides. Adding or subtracting never changes the sign: it stays ${T('>')}.`,
    f: (x) => x * x - 4 * x + 3, win: [-1.5, 5.5, -2.5, 6.5], strict: true, side: 'above',
    chk: { p: [2, 0], o: '0-3>2^2-4(2)', v: '-3>-4' } },
  b: { label: '(b)', orig: 'x^2-y\\ge4x',
    lines: [{ L: 'x^2-y', s: '\\ge', R: '4x' }, { L: '-y', s: '\\ge', R: '-x^2+4x', note: 'subtract x²' }, { L: 'y', s: '\\le', R: 'x^2-4x', note: '× (−1): reverse!', flip: '\\ge' }],
    capM: `Subtract ${T('x^2')} from both sides. Adding or subtracting keeps the sign.`,
    capF: `Multiply both sides by ${T('-1')}: the sign <b>reverses</b>, ${T('\\ge')} becomes ${T('\\le')}.`,
    f: (x) => x * x - 4 * x, win: [-1.5, 5.5, -5.5, 6.5], strict: false, side: 'below',
    chk: { p: [0, -2], o: '0^2-(-2)\\ge4(0)', v: '2\\ge0' }, wrong: { p: [2, 0], ineq: 'y\\ge x^2-4x', o: '2^2-0\\ge4(2)', v: '4\\ge8' } },
  c: { label: '(c)', orig: '4-2y<2x^2+6x',
    lines: [{ L: '4-2y', s: '<', R: '2x^2+6x' }, { L: '-2y', s: '<', R: '2x^2+6x-4', note: 'subtract 4' }, { L: 'y', s: '>', R: '-x^2-3x+2', note: '÷ (−2): reverse!', flip: '<' }],
    capM: `Subtract ${T('4')} from both sides. The sign stays ${T('<')}.`,
    capF: `Divide both sides by ${T('-2')}: the sign <b>reverses</b>, ${T('<')} becomes ${T('>')}. (Every term is divided: ${T('\\frac{-4}{-2}=2')}.)`,
    f: (x) => -x * x - 3 * x + 2, win: [-5.5, 2.5, -4.5, 6.5], strict: true, side: 'above',
    chk: { p: [0, 3], o: '4-2(3)<2(0)^2+6(0)', v: '-2<0' }, wrong: { p: [0, 0], ineq: 'y<-x^2-3x+2', o: '4-2(0)<0', v: '4<0' } }
};
const flip = {
  title: 'Rearranging: watch the sign',
  height: 470, minW: 940,
  choices: Object.keys(FL).map((k) => ({ v: k, label: FL[k].label })),
  ask: (v) => `Example 4${v === 'a' ? '(a)' : FL[v].label}: write ${T(FL[v].orig)} with ${T('y')} alone on the left.`,
  make(stage, v, ex) {
    const d = FL[v], W = ex.W, GW = 400, [x0, x1, y0, y1] = d.win, last = d.lines[d.lines.length - 1];
    const Lp = div(stage, 'u8l5-panel u8l5-flp', '', 4, 4, W - GW - 20, 462);
    const lineEls = d.lines.map((ln, i) => {
      const e = h('div', 'u8l5-fline' + (i === 0 ? ' u8l5-forig' : ''), `<span class="u8l5-fL">${T(ln.L)}</span><span class="u8l5-sg${ln.flip ? ' u8l5-sgf' : ''}">${T(ln.flip || ln.s)}</span><span class="u8l5-fR">${T(ln.R)}</span>${ln.note ? `<span class="u8l5-note${ln.flip ? ' u8l5-noter' : ''}">${ln.note}</span>` : ''}`);
      Lp.appendChild(e); return hide(e);
    });
    const badges = hide(div(Lp, 'u8l5-badges', `<span class="u8l5-bdg">${d.strict ? '<span class="u8l5-dash"></span>dashed' : '<span class="u8l5-solid"></span>solid'}</span><span class="u8l5-bdg">${d.side}</span>`));
    const chkL = hide(div(Lp, 'u8l5-chkl u8l5-okl', `Check ${T(pt(...d.chk.p))} in the original: ${T(d.chk.o)}, &nbsp;${T(d.chk.v)} ✓`));
    const wrL = d.wrong ? hide(div(Lp, 'u8l5-chkl u8l5-nol', `Not reversed: ${T(d.wrong.ineq)}. Its point ${T(pt(...d.wrong.p))}: ${T(d.wrong.o)}, &nbsp;${T(d.wrong.v)} ✗`)) : null;
    const G = new Graph(stage, { x: W - GW - 4, y: 4, width: GW, height: 462, xmin: x0, xmax: x1, ymin: y0, ymax: y1, xlabels: 1, ylabels: 2, fontSize: 14, pad: [24, 14, 14, 14] });
    hide(G.el);
    const Rr = region(G, d.f, d.side); hide(Rr);
    const Rw = d.wrong ? hide(region(G, d.f, d.side === 'above' ? 'below' : 'above', { color: NO, op: 0.16 })) : null;
    const P = G.fn(d.f, { color: BL, width: 4, dash: d.strict });
    const fl = hide(G.label(x1 - 0.1, y0 + 0.9, T('y=' + last.R), { pos: 'w', color: BL, cls: 'bk-ptlab' }));
    const cp = hide(G.point(d.chk.p[0], d.chk.p[1], { color: OK, r: 8 }));
    const wp = d.wrong ? hide(cross(G, d.wrong.p[0], d.wrong.p[1], NO, 8)) : null;
    const st = d.wrong ? stampOn(stage, 'wrong side', false, W - GW / 2 - 4, 120, 'sm') : null;
    const showLine = async (c, i) => {
      const e = lineEls[i], ln = d.lines[i]; e.style.opacity = 1; await fadeIn(c, e, 350);
      if (ln.flip) {
        const sgE = e.querySelector('.u8l5-sg');
        await anim(c, sgE, [{ transform: 'rotateY(0deg) scale(1)' }, { transform: 'rotateY(90deg) scale(1.5)' }], 380);
        sgE.innerHTML = T(ln.s); sgE.classList.add('u8l5-sgr');
        await anim(c, sgE, [{ transform: 'rotateY(90deg) scale(1.5)' }, { transform: 'rotateY(0deg) scale(1)' }], 380);
        await pulse(c, sgE, 1.3);
      }
    };
    const n = d.lines.length;
    const steps = [{ cap: `${T('y')} is not alone on the left. Solve for ${T('y')}, as you would solve an equation.`, run: (c) => showLine(c, 0) },
      { cap: d.capM, run: (c) => showLine(c, 1) }];
    if (n > 2) steps.push({ cap: d.capF, run: (c) => showLine(c, 2) });
    steps.push(
      { cap: `Read it: ${T(last.s)} means a <b>${d.strict ? 'dashed' : 'solid'}</b> boundary and the region <b>${d.side}</b> the parabola.`, run: async (c) => { unhide(badges); await pop(c, badges); } },
      { cap: `Graph it, then check a point of the shaded region in the <b>original</b> inequality: ${T(pt(...d.chk.p))} gives ${T(d.chk.v)} ✓.`, run: async (c) => {
        G.el.style.opacity = 1; await show(c, G.el); await sweep(c, Rr, 800); unhide(fl); unhide(cp); await pop(c, cp); unhide(chkL); await show(c, chkL); } }
    );
    if (d.wrong) steps.push({ cap: `Forgot to reverse? ${T(d.wrong.ineq)} would shade the <b>other</b> side, and its point ${T(pt(...d.wrong.p))} fails the original: ${T(d.wrong.v)} ✗.`, run: async (c) => {
      await sweep(c, Rw, 700); unhide(wp); await pop(c, wp); unhide(wrL); await show(c, wrL); await sIn(c, st); } });
    return steps;
  }
};

/* =============================== explainer: dial a, then the sign =============================== */
const DL = {
  a: { label: 'Example 6(a)', win: [-1.5, 5.5, -4.5, 6.5], fa: (a) => (x) => a * (x - 2) ** 2 - 3, a: 1, sweep: [0.25, 2.6, 0.45], strict: true, side: 'above',
    known: [[2, -3, '(2,\\ -3)', 'se'], [0, 1, '(0,\\ 1)', 'w']], pt: [0, 1], form: 'y=a(x-2)^2-3',
    cap1: `The vertex is ${T('(2,\\ -3)')}, so the boundary is ${T('y=a(x-2)^2-3')}.`,
    sub: ['1=a(0-2)^2-3', '1=4a-3', 'a=1'], exp: 'y=(x-2)^2-3=x^2-4x+1', sign: '>', fin: 'y>x^2-4x+1', chk: [2, 0], chkT: '0>4-8+1=-3' },
  b: { label: '(b)', win: [-4.5, 2.5, -4.5, 9.5], fa: (a) => (x) => a * (x + 3) * (x - 1), a: -2, sweep: [-0.4, -3.6, -1.1], strict: false, side: 'below',
    known: [[-3, 0, '-3', 'nw'], [1, 0, '1', 'ne'], [0, 6, '(0,\\ 6)', 'e']], pt: [0, 6], form: 'y=a(x+3)(x-1)',
    cap1: `The x-intercepts are ${T('-3')} and ${T('1')}, so the boundary is ${T('y=a(x+3)(x-1)')}.`,
    sub: ['6=a(0+3)(0-1)', '6=-3a', 'a=-2'], exp: 'y=-2(x^2+2x-3)=-2x^2-4x+6', sign: '\\le', fin: 'y\\le-2x^2-4x+6', chk: [0, 0], chkT: '0\\le6' }
};
const dial = {
  title: 'Find a, then choose the sign',
  height: 470, minW: 940,
  choices: Object.keys(DL).map((k) => ({ v: k, label: DL[k].label })),
  ask: (v) => `Example 6${v === 'a' ? '(a)' : '(b)'}: write the inequality whose solution region is shown, in general form.`,
  make(stage, v, ex) {
    const d = DL[v], W = ex.W, [x0, x1, y0, y1] = d.win, F = d.fa(d.a);
    const G = new Graph(stage, { x: 4, y: 4, width: 440, height: 462, xmin: x0, xmax: x1, ymin: y0, ymax: y1, xlabels: 1, ylabels: 2, fontSize: 15, pad: [24, 16, 16, 16] });
    const R = region(G, F, d.side, { color: GG, op: 0.32 }); hide(R);
    const B = G.fn(F, { color: INK, width: 3.5, dash: d.strict }); hide(B);
    const kp = d.known.map(([x, y, lab, pos]) => hide(G.point(x, y, { color: INK, r: 6.5, label: T(lab), pos })));
    const st = { a: d.sweep[0] };
    const fam = G.fn((x) => d.fa(st.a)(x), { color: PU, width: 4 }); hide(fam);
    const Rp = div(stage, 'u8l5-panel u8l5-steps3', '', 460, 4, W - 464, 462);
    const aR = hide(div(Rp, 'u8l5-aread', `${T('a=')}<b>${num(st.a)}</b>`)), aV = aR.querySelector('b');
    const setA = (a) => { st.a = a; fam._bkDraw(); aV.textContent = num(Math.round(a * 100) / 100); };
    const L1 = wl(Rp, 1, T(d.form), 'boundary'), Ls = d.sub.map((s, i) => wl(Rp, 0, T(s), i === 2 ? 'substitute' : '')), Le = wl(Rp, 0, T(d.exp), 'expand');
    const L2 = wl(Rp, 2, `${d.strict ? '<span class="u8l5-dash"></span>dashed' : '<span class="u8l5-solid"></span>solid'}, shaded ${d.side}: ${T(d.sign)}`, 'sign');
    const Lf = wl(Rp, 0, T(d.fin), '', 'u8l5-finl');
    const L3 = wl(Rp, 3, `Check ${T(pt(...d.chk))}: ${T(d.chkT)} ✓`, 'check');
    const hit = hide(G.point(d.pt[0], d.pt[1], { color: OK, r: 9 }));
    const cp = hide(G.point(d.chk[0], d.chk[1], { color: OK, r: 8 }));
    const [s0, s1, s2] = d.sweep;
    return [
      { cap: `The shaded region and its <b>${d.strict ? 'dashed' : 'solid'}</b> boundary are given, with ${v === 'a' ? `the vertex ${T('(2,\\ -3)')} and the point ${T('(0,\\ 1)')}` : `the x-intercepts ${T('-3')}, ${T('1')} and the y-intercept ${T('6')}`}.`, run: async (c) => {
        R.style.opacity = 1; await appearIn(c, R); B.style.opacity = 1; await G.drawIn(B, 700, c); for (const p of kp) { unhide(p, p.label); await pop(c, p, 260); } } },
      { cap: `<b>Step 1:</b> ${d.cap1} But which ${T('a')}? Every value of ${T('a')} gives a parabola like that.`, run: async (c) => {
        unhide(L1); await show(c, L1); unhide(fam, aR); await show(c, aR); setA(s0); await G.drawIn(fam, 500, c);
        await tween(c, 1500, (t) => setA(s0 + (s1 - s0) * t)); await tween(c, 1300, (t) => setA(s1 + (s2 - s1) * t)); } },
      { cap: `Substitute the point ${T(pt(...d.pt))}: ${T(d.sub[1])}, so ${T(d.sub[2])}. Now the curve passes through the point.`, run: async (c) => {
        for (const e of Ls) { unhide(e); await show(c, e); }
        const from = st.a; await tween(c, 900, (t) => setA(from + (d.a - from) * t)); setA(d.a); unhide(hit); await pop(c, hit); await pulse(c, hit, 1.4); } },
      { cap: `Expand to general form: ${T(d.exp)}.`, run: async (c) => { unhide(Le); await show(c, Le); } },
      { cap: `<b>Step 2:</b> ${d.strict ? '<b>dashed</b>, so no “=”' : '<b>solid</b>, so include “=”'}; shaded <b>${d.side}</b>, so ${T(d.sign)}. The inequality is ${T(d.fin)}.`, run: async (c) => {
        fam.style.opacity = 0.25; unhide(L2); await show(c, L2); unhide(Lf); await pop(c, Lf); await pulse(c, R, 1.02); } },
      { cap: `<b>Step 3:</b> check ${T(pt(...d.chk))}, a point in the shaded region: ${T(d.chkT)} ✓.`, run: async (c) => { unhide(cp); await pop(c, cp); unhide(L3); await show(c, L3); } }
    ];
  }
};
const appearIn = (c, el) => anim(c, el, [{ opacity: 0 }, { opacity: 1 }], 450);

/* =============================== explainer: the truck and the tunnel (STAR) =============================== */
const ARCH = (x) => -0.375 * x * x + 6;
const TN = {
  b: { label: 'Example 8(b)', w: 3.2, h: 4.5, cap: 'A truck 3.2 m wide and 4.5 m tall' },
  c: { label: '(c)', w: 4, h: 3, grow: 4.5, cap: 'A truck 4 m wide' },
  t: { label: 'A taller truck', w: 3.2, h: 5.3, cap: 'A truck 3.2 m wide and 5.3 m tall' }
};
const tunnel = {
  title: 'Will the truck fit through the tunnel?',
  height: 470, minW: 940,
  choices: Object.keys(TN).map((k) => ({ v: k, label: TN[k].label })),
  ask: (v) => v === 'b' ? `Example 8(b): will a truck ${T('3.2')} m wide and ${T('4.5')} m tall fit under the arch ${T('y=-0.375x^2+6')}?`
    : v === 'c' ? `Example 8(c): how tall can a ${T('4')} m wide truck in the centre be?` : `Will a truck ${T('3.2')} m wide and ${T('5.3')} m tall fit under the arch ${T('y=-0.375x^2+6')}?`,
  make(stage, v, ex) {
    const d = TN[v], W = ex.W, GW = 600, hx = d.w / 2;
    const G = new Graph(stage, { x: 4, y: 4, width: GW, height: 462, xmin: -5.5, xmax: 5.5, ymin: -0.6, ymax: 7.6, xlabels: 1, ylabels: 1, fontSize: 15, pad: [24, 16, 16, 16] });
    // the scene: rock around the opening, the road, the lit inside of the tunnel
    const rock = region(G, ARCH, 'above', { color: '#9c8f78', op: 0.5, floor: 0 });
    const road = G.polyline([[-5.6, 0], [5.6, 0], [5.6, -0.7], [-5.6, -0.7]], { closed: true, fill: '#4a4f5a', fillOpacity: 0.85, color: '#4a4f5a', width: 1 });
    const lit = region(G, ARCH, 'below', { from: -4, to: 4, edge: 0, color: GOLD, op: 0.42 }); hide(lit);
    const A = G.fn(ARCH, { from: -4, to: 4, color: BL, width: 4.5, arrows: false }); hide(A);
    const al = hide(G.label(-5.4, 7.0, T('y=-0.375x^2+6'), { pos: 'e', color: BL, cls: 'bk-ptlab' }));
    hide(rock); hide(road);
    const ends = [-4, 4].map((x) => hide(G.point(x, 0, { color: BL, r: 6.5, label: T(x < 0 ? '-4' : '4'), pos: x < 0 ? 'nw' : 'ne' })));
    const dim = hide(G.segment([-4, 0.45], [4, 0.45], { color: INK, width: 2.5, ends: ['arrow', 'arrow'] }));
    const dimL = hide(G.label(0, 0.45, '8 m', { cls: 'bk-pill u8l5-dim' }));
    // the truck, seen from the front; drawn in metres, scaled about the road centre as it drives toward us
    const tg = svgEl('g', { class: 'u8l5-truck' }); G.layers.data.insertBefore(tg, A); hide(tg);
    tg.style.transformBox = 'view-box'; tg.style.transformOrigin = '0 0';
    const ts = { w: d.w, h: d.h, s: 0.3 };
    const drawTruck = () => {
      const { w, h: hh } = ts, x = w / 2; tg.innerHTML = '';
      const rect = (xa, ya, xb, yb, attrs) => { const [p, q] = G.toPx(xa, yb), [r, s] = G.toPx(xb, ya); return svgEl('rect', Object.assign({ x: p, y: q, width: r - p, height: s - q }, attrs), tg); };
      const boxTop = hh, boxBot = Math.min(2.1, hh - 0.5);
      rect(-x + 0.12, 0, -x + 0.72, 0.75, { rx: 4, fill: '#222' }); rect(x - 0.72, 0, x - 0.12, 0.75, { rx: 4, fill: '#222' });
      rect(-x, boxBot, x, boxTop, { rx: 3, fill: '#f4f1ea', stroke: INK, 'stroke-width': 2.5 });
      rect(-x, boxTop - 0.42, x, boxTop - 0.22, { fill: '#c93a33' });
      rect(-x + 0.18, 0.4, x - 0.18, boxBot + 0.15, { rx: 5, fill: '#2b55a0', stroke: INK, 'stroke-width': 2.5 });
      rect(-x + 0.42, boxBot - 0.75, x - 0.42, boxBot - 0.12, { rx: 4, fill: '#cfe2f5', stroke: INK, 'stroke-width': 1.5 });
      rect(-0.5, 0.62, 0.5, 1.05, { rx: 2, fill: '#9aa3b0' });
      [-1, 1].forEach((k) => { const [cx, cy] = G.toPx(k * (x - 0.48), 0.85); svgEl('circle', { cx, cy, r: 7, fill: '#ffe27a', stroke: INK, 'stroke-width': 1.5 }, tg); });
      const [ox, oy] = G.toPx(0, 0);
      tg.setAttribute('transform', `translate(${ox} ${oy}) scale(${ts.s}) translate(${-ox} ${-oy})`);
    };
    drawTruck();
    const corners = [-1, 1].map((k) => hide(G.point(k * hx, d.h, { color: TP, r: 7.5 })));
    const topH = d.grow || d.h, archAt = ARCH(hx);
    const rul = [-1, 1].map((k) => hide(G.segment([k * hx, d.h], [k * hx, archAt], { color: TP, width: 3, dash: '6 5' })));
    const am = [-1, 1].map((k) => hide(G.point(k * hx, archAt, { color: BL, r: 5.5, label: k > 0 ? T(num(archAt)) : undefined, pos: 'ne' })));
    const fits = !(d.h > archAt + 1e-9), stp = stampOn(stage, v === 'c' ? 'just fits' : fits ? 'fits' : 'scrapes', v === 'c' ? true : fits, GW - 96, 92);
    const spare = hide(G.label(hx + 0.12, (d.h + archAt) / 2, `${num(Math.round((archAt - d.h) * 100) / 100)} m`, { pos: 'e', cls: 'bk-pill u8l5-dim' }));
    const sparks = [-1, 1].map((k) => { const [px, py] = G.toPx(k * hx, Math.min(d.h, 7.4)); return hide(div(G.html, 'u8l5-spark', '💥', px - 18, py - 22)); });
    // the work panel
    const Rp = div(stage, 'u8l5-panel u8l5-tnp', '', GW + 14, 4, W - GW - 18, 462);
    const w1 = hide(div(Rp, 'u8l5-tl', `<div class="u8l5-ph">Inside the tunnel</div>${T('y\\le-0.375x^2+6')}<br>${T('y\\ge0')}`));
    const w2 = hide(div(Rp, 'u8l5-tl', `<div class="u8l5-ph">The road</div>${T('-0.375x^2+6=0')}<br>${T('x^2=16,\\ \\ x=\\pm4')}: <b>8 m</b> wide`));
    const w3 = hide(div(Rp, 'u8l5-tl', `<div class="u8l5-ph">Top corners</div>${T(`(\\pm${num(hx)},\\ ${v === 'c' ? 'y' : num(d.h)})`)}`));
    const w4 = hide(div(Rp, 'u8l5-tl', `<div class="u8l5-ph">Test ${T(`x=${num(hx)}`)}</div>${T(`-0.375(${num(hx)})^2+6=${num(archAt)}`)}<br>${v === 'c' ? `${T('y\\le4.5')}: at most <b>4.5 m</b> tall` : `${T(`${num(d.h)}\\le${num(archAt)}`)} <b class="${fits ? 'u8l5-ok' : 'u8l5-no'}">${fits ? 'true ✓' : 'false ✗'}</b>`}`));
    const scene = async (c) => {
      unhide(rock, road); await Promise.all([appearIn(c, rock), appearIn(c, road)]); A.style.opacity = 1; await G.drawIn(A, 900, c); unhide(al);
      lit.style.opacity = 1; await appearIn(c, lit); await pulse(c, lit, 1.02); unhide(w1); await show(c, w1);
    };
    const roadW = async (c) => { for (const e of ends) { unhide(e, e.label); await pop(c, e, 260); } unhide(dim, dimL); await G.drawIn(dim, 500, c); unhide(w2); await show(c, w2); };
    const drive = async (c, final = 1) => {
      unhide(dim); dim.style.opacity = 0; dimL.style.opacity = 0;
      tg.style.opacity = 1; ts.s = 0.3; drawTruck();
      await tween(c, 1700, (t) => { ts.s = 0.3 + (final - 0.3) * t; drawTruck(); }, linear);
      ts.s = final; drawTruck();
    };
    const test = async (c) => {
      unhide(w3); await show(c, w3);
      for (const p of corners) { unhide(p); await pop(c, p, 260); }
      for (let i = 0; i < 2; i++) { if (Math.abs(archAt - d.h) > 1e-9) { unhide(rul[i]); await G.drawIn(rul[i], 450, c); } unhide(am[i], am[i].label); await pop(c, am[i], 220); }
      unhide(w4); await show(c, w4);
    };
    const capArch = `The tunnel opening: the arch is ${T('y=-0.375x^2+6')}. Inside the tunnel, ${T('y\\le-0.375x^2+6')} and ${T('y\\ge0')}: that region lights up.`;
    const capRoad = `The arch meets the road where ${T('-0.375x^2+6=0')}: ${T('x^2=16')}, ${T('x=\\pm4')}. The road is 8 m wide.`;
    if (v === 'c') {
      return [
        { cap: capArch, run: scene },
        { cap: capRoad, run: roadW },
        { cap: `A truck ${T('4')} m wide drives down the centre of the road. Its top corners are at ${T('x=\\pm2')}.`, run: (c) => drive(c) },
        { cap: `At ${T('x=2')} the arch is at ${T('-0.375(4)+6=4.5')}. A corner ${T('(2,\\ y)')} is inside the region when ${T('y\\le4.5')}.`, run: test },
        { cap: `Raise the roof until the corners touch the arch: the truck can be at most <b>4.5 m</b> tall.`, run: async (c) => {
          rul.forEach((r) => (r.style.opacity = 0)); const h0 = ts.h;
          await tween(c, 1400, (t) => { ts.h = h0 + (topH - h0) * t; drawTruck(); corners.forEach((p) => G.moveTo(p, p.gx, ts.h)); });
          ts.h = topH; drawTruck(); corners.forEach((p) => { G.moveTo(p, p.gx, topH); setPt(p, OK); }); await sIn(c, stp); } }
      ];
    }
    const steps = [
      { cap: capArch, run: scene },
      { cap: capRoad, run: roadW },
      { cap: `${d.cap} drives down the centre of the road toward the tunnel.`, run: async (c) => { await drive(c); if (!fits) await shake(c, tg); } },
      { cap: `Test its top corners, ${T(`(\\pm${num(hx)},\\ ${num(d.h)})`)}, as points. At ${T(`x=${num(hx)}`)} the arch is at ${T(`-0.375(${num(hx)})^2+6=${num(archAt)}`)}.`, run: test }
    ];
    steps.push(fits
      ? { cap: `${T(`${num(d.h)}\\le${num(archAt)}`)} is true, and the other corner is the same by symmetry: both corners are inside the region. It <b>fits</b>, with about ${T('0.5')} m to spare.`, run: async (c) => {
        corners.forEach((p) => setPt(p, OK)); unhide(spare); await pop(c, spare); await sIn(c, stp); } }
      : { cap: `${T(`${num(d.h)}\\le${num(archAt)}`)} is <b>false</b>: the corners are outside the region, above the arch. This truck <b>scrapes</b> the tunnel.`, run: async (c) => {
        corners.forEach((p) => setPt(p, NO)); for (const s of sparks) { unhide(s); await pop(c, s, 260); } await sIn(c, stp); } });
    return steps;
  }
};

/* =============================== the static figures on the cards =============================== */
const W1 = [-3.5, 5.5, -5.5, 6.5];
sketch('u8l5-e1', { win: W1, f: F1, plain: true, w: 330, h: 410 });
sketch('u8l5-e1A', { win: W1, f: F1, side: 'above', w: 330, h: 410, yes: [[0, 0], [-2, 5], [2, 1], [3, 0]], no: [[4, 1], [1, -5], [0, -4]] });
const ans = (id, k) => { const d = G3[k]; sketch(id, { win: d.win, f: d.f, side: d.side, dash: d.strict, pts: d.pts }); };
[['e2a', 'e2a'], ['e2b', 'e2b'], ['e3a', 'e3a'], ['e3b', 'e3b']].forEach(([id, k]) => { sketch('u8l5-' + id, { win: G3[k].win }); ans('u8l5-' + id + 'A', k); });
sketch('u8l5-e5', { win: G3.e5b.win, w: 330, h: 400 });
sketch('u8l5-e5A', { win: G3.e5b.win, f: G3.e5b.f, side: 'below', pts: G3.e5b.pts, no: [[2, 0]], w: 330, h: 400 });
sketch('u8l5-e6a', { win: DL.a.win, f: DL.a.fa(1), side: 'above', dash: true, given: true, pts: [[2, -3], [0, 1]] });
sketch('u8l5-e6b', { win: DL.b.win, f: DL.b.fa(-2), side: 'below', given: true, pts: [[-3, 0], [1, 0], [0, 6]] });
const W7 = [-3.5, 5.5, -4.5, 8.5], F7 = (x) => -x * x + 2 * x + 6, r7 = Math.sqrt(7);
sketch('u8l5-e7', { win: W7, w: 330, h: 400 });
sketch('u8l5-e7A', { win: W7, f: F7, side: 'below', dash: true, w: 330, h: 400, pts: [[1 - r7, 0, '-1.6', 'nw'], [1 + r7, 0, '3.6', 'ne'], [0, 6], [1, 7, '(1,\\ 7)', 'e']] });
const W8 = [-5.5, 5.5, -0.5, 7.5];
const S8 = { win: W8, f: ARCH, from: -4.3, to: 4.3, side: 'below', rfrom: -4, rto: 4, edge: 0, given: true, w: 330, h: 270 };
sketch('u8l5-e8', S8);
sketch('u8l5-e8A', { ...S8, extra: (G) => {
  G.polyline([[-1.6, 0], [1.6, 0], [1.6, 4.5], [-1.6, 4.5]], { closed: true, color: BL, width: 3, fill: BL, fillOpacity: 0.08 });
  [-1.6, 1.6].forEach((x) => G.point(x, 4.5, { color: OK, r: 6, label: x > 0 ? T('(1.6,\\ 4.5)') : undefined, pos: 'e' }));
} });

/* =============================== Stand Up Break =============================== */
const sgn = (n) => (n < 0 ? `-${-n}` : `+${n}`);
const poly = (a, b, c) => { // a x² + b x + c as TeX
  let s = a === 1 ? 'x^2' : a === -1 ? '-x^2' : `${a}x^2`;
  if (b) s += (b === 1 ? '+x' : b === -1 ? '-x' : `${sgn(b)}x`);
  if (c) s += sgn(c);
  return s;
};
const REL = ['<', '\\le ', '>', '\\ge '], FLIP = { '<': '>', '\\le ': '\\ge ', '>': '<', '\\ge ': '\\le ' };
const holds = (rel, l, r) => (rel === '<' ? l < r : rel === '\\le ' ? l <= r : rel === '>' ? l > r : l >= r);
const relWord = (rel) => `${rel === '<' || rel === '>' ? '\\text{dashed}' : '\\text{solid}'};\\ ${rel === '>' || rel === '\\ge ' ? '\\text{above}' : '\\text{below}'}`;
standup('u8l5', {
  intro: 'At your whiteboard: substitute carefully, get y alone (reverse the sign when you multiply or divide by a negative), and say solid or dashed, above or below.',
  levels: {
    BEG: (r) => { // is (p, q) a solution?
      const a = r.pick([1, 2, -1, 3]), b = r.int(-6, 6), c = r.int(-8, 8), rel = r.pick(REL), x = r.int(-3, 3), v = a * x * x + b * x + c;
      const y = r.chance(0.25) ? v : v + r.pick([-3, -2, -1, 1, 2, 4]), ok = holds(rel, y, v);
      return { text: 'Is the point a solution of the inequality? Show the substitution.', q: `(${x},\\ ${y});\\qquad y${rel}${poly(a, b, c)}`,
        a: [`${a === 1 ? '' : a === -1 ? '-' : a}(${x})^2${b ? (b < 0 ? '-' : '+') + Math.abs(b) + `(${x})` : ''}${c ? sgn(c) : ''}=${v}`,
          `${y}${rel}${v}\\ \\text{ is ${ok ? 'true: a solution' : 'false: not a solution'}}`, ...(y === v ? ['\\text{(the point is on the boundary)}'] : [])] };
    },
    PRG: (r) => { // get y alone (often a negative coefficient), then solid/dashed, above/below
      const A = r.pick([1, -1, 2, -2, 3]), B = r.int(-5, 5), C = r.int(-6, 6), rel = r.pick(REL);
      if (r.chance(0.3)) { // y + k on the left: no reversal
        const k = r.int(-7, 7) || 4;
        return { text: 'Write the inequality with y alone on the left. Solid or dashed? Above or below?', q: `y${sgn(k)}${rel}${poly(A, B, C + k)}`,
          a: [`y${rel}${poly(A, B, C)}\\quad(\\text{${k > 0 ? 'subtract' : 'add'} ${Math.abs(k)}})`, relWord(rel)] };
      }
      const m = r.pick([1, 2, 3, 4]), K = m * C, n = -m * A, p = -m * B, r1 = FLIP[rel];
      const lhs = K > 0 ? `${K}-${m === 1 ? '' : m}y` : K < 0 ? `-${m === 1 ? '' : m}y-${-K}` : `-${m === 1 ? '' : m}y`;
      const mid = `-${m === 1 ? '' : m}y${r1}${poly(n, p, -K)}`;
      return { text: 'Write the inequality with y alone on the left. Solid or dashed? Above or below?', q: `${lhs}${r1}${poly(n, p, 0)}`,
        a: [...(K ? [mid] : []), `\\text{${m === 1 ? 'multiply by' : 'divide by'} }-${m}\\ (\\text{reverse}):\\ \\ y${rel}${poly(A, B, C)}`, relWord(rel)] };
    },
    MAS: (r) => { // write the inequality from the vertex, a point and the picture
      const p = r.int(-4, 4), q = r.int(-6, 6), a = r.pick([1, -1, 2, -2, 3, -3]), dx = r.pick([-2, -1, 1, 2]), x1 = p + dx, y1 = a * dx * dx + q;
      const rel = r.pick(REL), above = rel === '>' || rel === '\\ge ', solid = rel === '\\le ' || rel === '\\ge ';
      const xp = p > 0 ? `(x-${p})` : p < 0 ? `(x+${-p})` : 'x', B = -2 * a * p, C = a * p * p + q;
      return { text: `A boundary parabola has vertex (${num(p)}, ${num(q)}) and passes through (${num(x1)}, ${num(y1)}). The region is shaded <b>${above ? 'above' : 'below'}</b> it, and the boundary is <b>${solid ? 'solid' : 'dashed'}</b>. Write the inequality in general form.`,
        q: '', a: [`y=a${xp}^2${q ? sgn(q) : ''}`, `${y1}=a(${x1}${p > 0 ? `-${p}` : p < 0 ? `+${-p}` : ''})^2${q ? sgn(q) : ''}\\ \\Rightarrow\\ ${dx * dx === 1 ? '' : dx * dx}a=${y1 - q}\\ \\Rightarrow\\ a=${a}`,
          `y=${poly(a, B, C)}`, `y${rel}${poly(a, B, C)}`] };
    }
  }
});

/* =============================== mount =============================== */
export const explainers = mountExplainers({ regions, graph3, flip, dial, tunnel });
export const _test = { G3, FL, DL, TN, P1 };
