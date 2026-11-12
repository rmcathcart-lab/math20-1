/* Math 20-1 · Unit 7 · Lesson 4 — Solving Absolute Value Equations (Linear).
 * New lesson format (2026-11-11): the warm-up ("The Hotel Elevator") is plain markup on the page (no code). Explainers:
 *   howmany (a V and a horizontal line y = c that slides down: two meeting points, one at the vertex, then none; the same
 *            answers as distances on a number line; Example 1(a)–(d)),
 *   methods (STAR: the intersection method and the zero method stacked on one x-axis; gold lines show both give the same
 *            x-values; Examples 2(a), 2(b), 3),
 *   isolate (the |A| = c procedure with step numbers: undo the outside, then c rolls into a sign gate that sends it to
 *            two roads, one road or a STOP sign; the Example 4(f) mistake gets stamped first; Example 4),
 *   cases   (the five case steps with step numbers on a split number line; each answer flies to the number line and is kept
 *            only if it lands in its own subdomain; Examples 5 and 6(a)),
 *   verdict (STAR: a verdict board — each candidate root is substituted into the original equation and stamped "keep" or
 *            "extraneous!" — beside the graph, where every candidate is a crossing with a dashed ghost line y = ±A, and the
 *            extraneous ones lie below the x-axis, where the V never goes; Examples 7(a)–(c), 8(c)),
 *   target  (a cereal line: boxes land on a mass number line and are accepted inside 750 ± 12 g; two runners meet at the
 *            midpoint of −3 and 11; Example 8(a), (b)).
 * Colours: the absolute value side (the V) blue, the other side orange, ghost lines gray, the zero-method graph purple,
 *   subdomain x ≥ … teal, x < … purple, kept roots green, rejected / extraneous red, the shared x-values gold. */
import { h, tex, add, box, mountExplainers, pop, fadeIn, tween, anim, svgEl, pulse, shake, sleep, linear, COLORS,
  Graph, NumberLine, stamp, stampIn, num } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const BL = COLORS.blue, OR = '#d9730d', OK = COLORS.green, NO = COLORS.red, PU = COLORS.purple, TE = '#0e8a9a', GO = '#c99a06', GR = '#8d93a0';
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
/* a work line with its step number (n) beside it, and an optional note on the right */
const wl = (p, n, html, note, cls = '') => {
  const d = h('div', 'u7l4-wl ' + cls, `<b class="u7l4-sn${n ? '' : ' u7l4-sn0'}">${n || ''}</b><span class="u7l4-lt">${html}</span>${note ? `<span class="u7l4-note">${note}</span>` : ''}`);
  p.appendChild(d); return hide(d);
};
const svgBox = (host, x, y, w, hh, cls = '') => { const s = svgEl('svg', { class: 'u7l4-svg ' + cls, width: w, height: hh, viewBox: `0 0 ${w} ${hh}` }); s.style.position = 'absolute'; s.style.left = x + 'px'; s.style.top = y + 'px'; host.appendChild(s); return s; };
const stampOn = (host, text, ok, x, y, size) => hide(stamp(host, text, { ok, x, y, rotate: -8, size }));
const sIn = async (c, el) => { el.style.opacity = 1; await stampIn(c, el); };

/* =============================== explainer: how many solutions? =============================== */
const HM = {
  a: { label: 'Example 1(a)', a: 0, c: 7, inT: 'x', eq: '|x|=7', win: [-10, 10, -4, 10] },
  b: { label: '(b)', a: 3, c: 5, inT: 'x-3', eq: '|x-3|=5', win: [-4, 10, -4, 8] },
  c: { label: '(c)', a: -4, c: 0, inT: 'x+4', eq: '|x+4|=0', win: [-11, 3, -4, 8] },
  d: { label: '(d)', a: 1, c: -2, inT: 'x-1', eq: '|x-1|=-2', win: [-6, 8, -4, 8] }
};
const howmany = {
  title: 'How many solutions?',
  height: 440, minW: 940,
  choices: Object.keys(HM).map((k) => ({ v: k, label: HM[k].label })),
  ask: (v) => `Example 1: solve ${T(HM[v].eq)}.`,
  make(stage, v, ex) {
    const d = HM[v], [x0, x1, y0, y1] = d.win, a = d.a, c0 = d.c, W = ex.W;
    const G = new Graph(stage, { x: 4, y: 4, width: 452, height: 430, xmin: x0, xmax: x1, ymin: y0, ymax: y1, xlabels: 2, ylabels: 2, fontSize: 15, pad: [30, 18, 16, 18] });
    const V = G.fn((x) => Math.abs(x - a), { color: BL, width: 4 }); hide(V);
    const vl = hide(G.label(a + (x1 - a) * 0.55, Math.min(y1 - 1, (x1 - a) * 0.55) , T(`y=|${d.inT}|`), { pos: 'w', color: BL, cls: 'bk-ptlab', dx: -8 }));
    const st = { c: c0 };
    const L = G.hline(c0, { color: OR, width: 4, dash: false }); hide(L);
    const ll = hide(G.label(c0 > 0 ? a : x0 + 0.4, c0, T(`y=${c0}`), { pos: 'ne', color: OR, cls: 'bk-ptlab' }));
    const P1 = G.point(a - Math.max(c0, 0), c0, { color: OK, r: 8 }), P2 = G.point(a + Math.max(c0, 0), c0, { color: OK, r: 8 });
    hide(P1); hide(P2);
    const gd = [];
    const n = c0 > 0 ? 2 : c0 === 0 ? 1 : 0, sols = n === 2 ? [a - c0, a + c0] : n === 1 ? [a] : [];
    sols.forEach((s) => { const g = G.guides(s, c0, { color: OK }); hide(g); gd.push(g); });
    const sl = sols.map((s) => hide(G.label(s, y0 + 0.2, T(`x=${s}`), { pos: 'n', color: OK, cls: 'bk-pill u7l4-xpill' })));
    // right panel: the equation, a count badge, the number line
    const R = div(stage, 'u7l4-panel u7l4-hmR', '', 472, 4, W - 476, 430);
    const eqd = div(R, 'u7l4-hmeq', `${T(`|${d.inT}|=`)}<b class="u7l4-cval">${num(c0)}</b>`);
    const cv = eqd.querySelector('.u7l4-cval');
    const badge = hide(div(R, 'u7l4-badge', ''));
    const setBadge = (k) => { badge.className = 'u7l4-badge u7l4-b' + k; badge.textContent = k === 2 ? '2 solutions' : k === 1 ? '1 solution' : 'no solution'; };
    setBadge(n);
    const nlw = W - 476 - 28;
    const NL = new NumberLine(R, { width: nlw, height: 150, min: x0, max: x1, step: 1, labelStep: 2, axisY: 96, fontSize: 16, pad: 20 });
    NL.el.classList.add('u7l4-hmnl'); hide(NL.el);
    const ctr = NL.point(a, { color: BL, r: 7 });
    const nld = svgEl('g', {}, NL.layers.top);
    const nlDots = [0, 1].map(() => svgEl('circle', { r: 8, fill: OK, stroke: '#fff', 'stroke-width': 2, cy: NL.ay, cx: -50 }, nld));
    const setNL = (cc) => { nlDots[0].setAttribute('cx', cc >= -1e-9 ? NL.toPx(a - cc) : -50); nlDots[1].setAttribute('cx', cc >= -1e-9 ? NL.toPx(a + cc) : -50); };
    setNL(-1);
    const dnote = hide(div(R, 'u7l4-dnote', n === 2 ? `The numbers <b>${c0}</b> units from <b>${a}</b>` : n === 1 ? `Distance <b>0</b> from <b>${a}</b>: only ${T(String(a))} itself` : `A distance can’t be ${T(String(c0))}`));
    const set = (cc) => {
      st.c = cc; L.set(cc); ll.gy = cc; ll._bkDraw();
      const k = Math.abs(cc) < 0.06 ? 1 : cc > 0 ? 2 : 0, ce = k === 1 ? 0 : cc;
      G.moveTo(P1, a - Math.max(ce, 0), k ? ce : y0 - 50); G.moveTo(P2, a + Math.max(ce, 0), k ? ce : y0 - 50);
      cv.textContent = num(Math.round(cc * 10) / 10); setBadge(k); setNL(k ? ce : -1);
    };
    const hopEls = [];
    const capMeet = n === 2 ? `They meet at <b>two</b> points. Drop down to the x-axis: ${T(`x=${a - c0}`)} or ${T(`x=${a + c0}`)}.`
      : n === 1 ? `The line ${T('y=0')} touches the V only at its vertex: ${T(`x=${a}`)}, <b>one</b> solution.`
      : `The V never goes below the x-axis, so the line ${T(`y=${c0}`)} never meets it: <b>no solution</b>.`;
    const capNL = n === 2 ? `As distances: ${T(`|${d.inT}|`)} is the distance from ${T('x')} to ${T(String(a))}. Hop ${c0} left and ${c0} right.`
      : n === 1 ? `As a distance: the only number at distance 0 from ${T(String(a))} is ${T(String(a))}.`
      : `As a distance: ${T(`|${d.inT}|`)} is a distance, and a distance can’t be negative.`;
    return [
      { cap: `Graph the left side, ${T(`y=|${d.inT}|`)}: a V with its vertex on the x-axis at ${T(`(${a},\\ 0)`)}.`, run: async (c) => { V.style.opacity = 1; await G.drawIn(V, 800, c); await show(c, vl); } },
      { cap: `Graph the right side, ${T(`y=${c0}`)}: a horizontal line${c0 < 0 ? ' <b>below</b> the x-axis' : c0 === 0 ? ', the x-axis itself' : ''}.`, run: async (c) => { L.style.opacity = 1; await G.drawIn(L, 700, c); await show(c, ll); } },
      { cap: capMeet, run: async (c) => {
        if (n) { P1.style.opacity = 1; P2.style.opacity = 1; await Promise.all([pop(c, P1), pop(c, P2)]); for (const g of gd) { g.style.opacity = 1; await G.drawIn(g, 400, c); } for (const s of sl) await pop(c, s); }
        else await shake(c, L);
        await pop(c, badge); } },
      { cap: capNL, run: async (c) => {
        await show(c, NL.el);
        if (n === 2) { setNL(-1); hopEls.push(await NL.hop(c, a, a - c0, { label: String(c0), color: OR })); hopEls.push(await NL.hop(c, a, a + c0, { label: String(c0), color: OR })); setNL(c0); await pop(c, nld); }
        else if (n === 1) { setNL(0); await pop(c, nld); }
        await show(c, dnote); } },
      { cap: 'Now slide the line down: <b>two</b> meeting points while the line is above the x-axis, <b>one</b> at the vertex, <b>none</b> below.', run: async (c) => {
        hopEls.forEach((e) => { e.style.opacity = 0; if (e.label) e.label.style.opacity = 0; }); sl.forEach((e) => (e.style.opacity = 0)); gd.forEach((e) => (e.style.opacity = 0)); dnote.style.opacity = 0;
        const go = (from, to, ms) => tween(c, ms, (t) => set(from + (to - from) * t), linear);
        await go(c0, 6, 700); await go(6, 0, 2000); set(0); await sleep(c, 700); await go(0, -3, 1100); await sleep(c, 600); await go(-3, c0, 1000); set(c0); for (const e of [...sl, ...gd]) { e.style.opacity = 1; } await show(c, dnote); } }
    ];
  }
};

/* =============================== explainer: intersection vs zero (STAR) =============================== */
const MT = {
  e2a: { label: 'Example 2(a)', eq: '|2x-4|=6', zeq: '|2x-4|-6=0', L: (x) => Math.abs(2 * x - 4), R: () => 6, Z: (x) => Math.abs(2 * x - 4) - 6,
    y1: 'abs(2X−4)', y2: '6', yz: 'abs(2X−4)−6', roots: [-1, 5], win: [-3, 8], top: [-2, 10], bot: [-7, 5],
    meet: `They meet at ${T('(-1,\\ 6)')} and ${T('(5,\\ 6)')}.` },
  e2b: { label: '(b)', eq: '|x+1|=2x-1', zeq: '|x+1|-2x+1=0', L: (x) => Math.abs(x + 1), R: (x) => 2 * x - 1, Z: (x) => Math.abs(x + 1) - 2 * x + 1,
    y1: 'abs(X+1)', y2: '2X−1', yz: 'abs(X+1)−2X+1', roots: [2], win: [-4, 6], top: [-5, 8], bot: [-6, 8],
    meet: `They meet only at ${T('(2,\\ 3)')}: the left arm of the V never meets the line.` },
  e3: { label: 'Example 3', eq: '|3x-6|=x+2', zeq: '|3x-6|-x-2=0', L: (x) => Math.abs(3 * x - 6), R: (x) => x + 2, Z: (x) => Math.abs(3 * x - 6) - x - 2,
    y1: 'abs(3X−6)', y2: 'X+2', yz: 'abs(3X−6)−X−2', roots: [1, 4], win: [-1.5, 6.5], top: [-1, 10], bot: [-5, 6],
    meet: `They meet at ${T('(1,\\ 3)')} and ${T('(4,\\ 6)')}.` }
};
const methods = {
  title: 'Two ways on the graphing calculator',
  height: 500, minW: 940,
  choices: Object.keys(MT).map((k) => ({ v: k, label: MT[k].label })),
  ask: (v) => `Solve ${T(MT[v].eq)} graphically.`,
  make(stage, v, ex) {
    const d = MT[v], W = ex.W, GW = 600, GH = 238, [xa, xb] = d.win;
    const mk = (y, [ya, yb]) => new Graph(stage, { x: 4, y, width: GW, height: GH, xmin: xa, xmax: xb, ymin: ya, ymax: yb, xlabels: 1, ylabels: (yb - ya) > 12 ? 4 : 2, fontSize: 14, pad: [26, 16, 14, 16] });
    const G1 = mk(4, d.top), G2 = mk(4 + GH + 16, d.bot);
    const t1 = div(stage, 'u7l4-gtag', 'Intersection method', 16, 10), t2 = div(stage, 'u7l4-gtag u7l4-gtag2', 'Zero method', 16, 10 + GH + 16);
    hide(t2);
    const fL = G1.fn(d.L, { color: BL, width: 4 }), fR = G1.fn(d.R, { color: OR, width: 4 }), fZ = G2.fn(d.Z, { color: PU, width: 4 });
    [fL, fR, fZ].forEach(hide);
    const pts1 = d.roots.map((r) => hide(G1.point(r, d.R(r), { color: OK, r: 7.5 }))), pts2 = d.roots.map((r) => hide(G2.point(r, 0, { color: OK, r: 7.5 })));
    // the gold lines that join the two graphs at the solutions
    const ov = svgBox(stage, 0, 0, GW + 8, 2 * GH + 24, 'u7l4-ov');
    const golds = d.roots.map((r) => { const px = 4 + G1.toPx(r, 0)[0]; return hide(svgEl('line', { x1: px, x2: px, y1: 8, y2: 2 * GH + 16, stroke: GO, 'stroke-width': 4, 'stroke-dasharray': '10 7', 'stroke-linecap': 'round' }, ov)); });
    const gl = d.roots.map((r) => hide(div(stage, 'u7l4-goldx', T(`x=${r}`), 4 + G1.toPx(r, 0)[0] - 34, GH + 2, 68)));
    // right panel: the Y= screens and the result
    const X = GW + 20, P = div(stage, 'u7l4-panel u7l4-mtR', '', X, 4, W - X - 4, 492);
    const yeq = (lab, txt, colr) => { const e = h('div', 'u7l4-yeq', `<b style="color:${colr}">${lab}</b><code>${txt}</code>`); P.appendChild(e); return hide(e); };
    const h1 = hide(div(P, 'u7l4-ph', 'Intersection method')), a1 = yeq('Y₁=', d.y1, BL), a2 = yeq('Y₂=', d.y2, OR);
    const r1 = hide(div(P, 'u7l4-ro', d.roots.map((r) => `intersect: <b>X=${num(r)}</b>, Y=${num(d.R(r))}`).join('<br>')));
    const h2 = hide(div(P, 'u7l4-ph u7l4-ph2', 'Zero method')), zq = hide(div(P, 'u7l4-zq', T(d.zeq))), a3 = yeq('Y₁=', d.yz, PU);
    const r2 = hide(div(P, 'u7l4-ro', d.roots.map((r) => `zero: <b>X=${num(r)}</b>, Y=0`).join('<br>')));
    const an = hide(div(P, 'u7l4-ansl', d.roots.length > 1 ? `${T(`x=${d.roots[0]}`)} or ${T(`x=${d.roots[1]}`)}` : `${T(`x=${d.roots[0]}`)}`));
    return [
      { cap: `<b>Intersection method:</b> graph each side. ${T('Y_1=')} the left side, ${T('Y_2=')} the right side.`, run: async (c) => { await show(c, h1); await show(c, a1); fL.style.opacity = 1; await G1.drawIn(fL, 700, c); await show(c, a2); fR.style.opacity = 1; await G1.drawIn(fR, 600, c); } },
      { cap: `<b>intersect</b> at each crossing. ${d.meet}`, run: async (c) => {
        for (const [i, p] of pts1.entries()) { p.style.opacity = 1; await pop(c, p); G1.readout('Intersection', { x: d.roots[i], y: d.R(d.roots[i]) }, { pos: 'tr' }); await sleep(c, 600); }
        await show(c, r1); } },
      { cap: `<b>Zero method:</b> move every term to one side, ${T(d.zeq)}, and graph the left side as ${T('Y_1')}.`, run: async (c) => { await show(c, t2); await show(c, h2); await show(c, zq); await show(c, a3); fZ.style.opacity = 1; await G2.drawIn(fZ, 900, c); } },
      { cap: `<b>zero</b> at each x-intercept: ${d.roots.map((r) => T(`x=${r}`)).join(' and ')}.`, run: async (c) => {
        for (const [i, p] of pts2.entries()) { p.style.opacity = 1; await pop(c, p); G2.readout('Zero', { x: d.roots[i], y: 0 }, { pos: 'tr' }); await sleep(c, 600); }
        await show(c, r2); } },
      { cap: `The <b>same x-values</b> both ways: the crossings line up with the zeros. ${d.roots.length > 1 ? 'Two solutions' : 'One solution'}.`, run: async (c) => {
        G1.readout(null); G2.readout(null);
        for (const [i, g] of golds.entries()) { g.style.opacity = 1; await anim(c, g, [{ strokeDashoffset: 300, opacity: 0.2 }, { strokeDashoffset: 0, opacity: 1 }], 700); await pop(c, gl[i]); }
        await pop(c, an); } }
    ];
  }
};

/* =============================== explainer: isolate, then the sign gate =============================== */
const IS = {
  a: { label: 'Example 4(a)', start: '|2x-5|=9', iso: [], A: '2x-5', c: 9, br: [['2x-5=9', '2x=14', 'x=7'], ['2x-5=-9', '2x=-4', 'x=-2']] },
  b: { label: '(b)', start: '3|x+2|-4=11', iso: [['3|x+2|=15', 'add 4'], ['|x+2|=5', 'divide by 3']], A: 'x+2', c: 5, br: [['x+2=5', 'x=3'], ['x+2=-5', 'x=-7']] },
  c: { label: '(c)', start: '|4-3x|+8=2', iso: [['|4-3x|=-6', 'subtract 8']], A: '4-3x', c: -6, br: [] },
  d: { label: '(d)', start: '-2|x-6|+1=1', iso: [['-2|x-6|=0', 'subtract 1'], ['|x-6|=0', 'divide by −2']], A: 'x-6', c: 0, br: [['x-6=0', 'x=6']] },
  e: { label: '(e)', start: '\\tfrac{1}{2}|x+3|=4', iso: [['|x+3|=8', 'multiply by 2']], A: 'x+3', c: 8, br: [['x+3=8', 'x=5'], ['x+3=-8', 'x=-11']] },
  f: { label: '(f)', start: '|x+2|+4=1', iso: [['|x+2|=-3', 'subtract 4']], A: 'x+2', c: -3, br: [],
    wrong: ['x+2+4=1', 'x+2+4=-1'], wx: ['x=-5', 'x=-7'], chk: ['|-5+2|+4=7\\ne1', '|-7+2|+4=9\\ne1'] }
};
const isolate = {
  title: 'Isolate, then split',
  height: 470, minW: 940,
  choices: Object.keys(IS).map((k) => ({ v: k, label: IS[k].label })),
  ask: (v) => (v === 'f' ? `Example 4(f): a student solved ${T(IS.f.start)} without isolating first. Find the error.` : `Example 4: solve ${T(IS[v].start)}.`),
  make(stage, v, ex) {
    const d = IS[v], W = ex.W, k = d.c > 0 ? 2 : d.c === 0 ? 1 : 0, GX = W - 384;
    const P = div(stage, 'u7l4-panel', '', 4, 4, GX - 16, 462);
    let wrongEls = null;
    if (d.wrong) {
      const box1 = hide(div(P, 'u7l4-wrong', `<div class="u7l4-ph">The student’s work</div><div>${T(d.wrong[0])} or ${T(d.wrong[1])}</div><div>${T(d.wx[0])} or ${T(d.wx[1])}</div><div class="u7l4-wck">${T(d.chk[0])}</div><div class="u7l4-wck">${T(d.chk[1])}</div>`));
      const sts = [stampOn(box1, '✗ fails', false, 300, 128, 'sm'), stampOn(box1, '✗ fails', false, 300, 160, 'sm')];
      wrongEls = { box1, sts };
    }
    const st0 = wl(P, '', T(d.start), '', 'u7l4-eqline');
    const isoEls = d.iso.length ? d.iso.map(([t, n]) => wl(P, 1, T(t), n)) : [wl(P, 1, 'The absolute value is already alone.')];
    const kept = d.iso.length ? d.iso[d.iso.length - 1][0] : d.start;
    const sgn = wl(P, 2, `${T(`c=${d.c}`)} ${k === 2 ? 'is <b>positive</b>' : k === 1 ? 'is <b>zero</b>' : 'is <b>negative</b>'}`, k === 2 ? 'two solutions' : k === 1 ? 'one solution' : 'no solution');
    const brEls = [];
    if (k === 2) {
      const row = h('div', 'u7l4-brrow'); P.appendChild(row); hide(row);
      row.appendChild(h('b', 'u7l4-sn', '3'));
      d.br.forEach((b) => { const col = h('div', 'u7l4-brcol'); row.appendChild(col); b.forEach((t, i) => col.appendChild(h('div', 'u7l4-brl' + (i === b.length - 1 ? ' u7l4-brx' : ''), T(t)))); });
      brEls.push(row);
    } else if (k === 1) d.br[0].forEach((t, i) => brEls.push(wl(P, i ? '' : 3, T(t), i ? '' : '', i === d.br[0].length - 1 ? 'u7l4-xline' : '')));
    const ans = hide(div(P, 'u7l4-ansl', k === 2 ? `${T(d.br[0][d.br[0].length - 1])} or ${T(d.br[1][d.br[1].length - 1])}` : k === 1 ? `${T(d.br[0][d.br[0].length - 1])} (one solution)` : '<b>No solution</b>: an absolute value is never negative.'));
    // the sign gate
    const S = svgBox(stage, GX, 4, 380, 462, 'u7l4-gate');
    const road = (dd) => svgEl('path', { d: dd, fill: 'none', stroke: '#d8d2c4', 'stroke-width': 26, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, S);
    road('M190 40 V150');
    const paths = { 2: [road('M190 150 L70 290 V340')], 1: [road('M190 150 V286')], 0: [road('M190 150 L310 290 V316')] };
    svgEl('rect', { x: 120, y: 128, width: 140, height: 48, rx: 12, fill: '#1c2230' }, S);
    svgEl('text', { x: 190, y: 160, 'text-anchor': 'middle', fill: '#ffcf4a', 'font-size': 20, 'font-weight': 800 }, S).textContent = 'sign of c?';
    const lab = (x, y, t, colr) => { const e = svgEl('text', { x, y, 'text-anchor': 'middle', fill: colr, 'font-size': 18, 'font-weight': 800 }, S); e.textContent = t; return e; };
    lab(96, 214, 'c > 0', OK); lab(232, 250, 'c = 0', GO); lab(294, 206, 'c < 0', NO);
    // STOP sign
    const stop = svgEl('g', {}, S); svgEl('polygon', { points: '296,318 324,318 344,338 344,366 324,386 296,386 276,366 276,338', fill: NO, stroke: '#fff', 'stroke-width': 3 }, stop);
    svgEl('text', { x: 310, y: 359, 'text-anchor': 'middle', fill: '#fff', 'font-size': 17, 'font-weight': 900 }, stop).textContent = 'STOP';
    const outs = {
      2: [div(stage, 'u7l4-gout', `${T(`${d.A}=${d.c}`)}<br>or<br>${T(`${d.A}=${-d.c}`)}`, GX - 10, 350, 160)],
      1: [div(stage, 'u7l4-gout', T(`${d.A}=0`), GX + 120, 296, 140)],
      0: [div(stage, 'u7l4-gout u7l4-goutno', 'no solution', GX + 240, 398, 140)]
    };
    Object.values(outs).flat().forEach(hide);
    const tok = div(stage, 'u7l4-tok', `${T(`c=${d.c}`)}`, GX + 190 - 52, 14, 104, 40); hide(tok);
    const lit = (els) => els.forEach((e) => { e.setAttribute('stroke', k === 2 ? '#bfe6d0' : k === 1 ? '#f6e3a3' : '#f4c7c3'); });
    const route = k === 2 ? [[0, 0], [0, 116], [-120, 256]] : k === 1 ? [[0, 0], [0, 116], [0, 240]] : [[0, 0], [0, 116], [120, 256]];
    const steps = [];
    if (d.wrong) steps.push({ cap: 'The student split the equation <b>before</b> isolating the absolute value. Check the two answers in the original equation …', run: async (c) => { await show(c, wrongEls.box1); for (const s of wrongEls.sts) await sIn(c, s); } });
    steps.push({ cap: d.iso.length ? `<b>Step 1: isolate the absolute value.</b> Undo what is outside the bars: ${d.iso.map((x) => x[1]).join(', then ')}.` : '<b>Step 1:</b> the absolute value is already alone on one side.',
      run: async (c) => { if (wrongEls) wrongEls.box1.style.opacity = 0.35; await show(c, st0); for (const e of isoEls) await show(c, e); } });
    steps.push({ cap: `<b>Step 2:</b> now ${T(kept)}. What does it equal? ${T(`c=${d.c}`)}: ${k === 2 ? '<b>positive</b>, so two roads' : k === 1 ? '<b>zero</b>, so one road' : '<b>negative</b>: STOP, no solution'}.`,
      run: async (c) => {
        await show(c, sgn); await show(c, tok);
        await anim(c, tok, route.map(([dx, dy]) => ({ transform: `translate(${dx}px, ${dy}px)` })), 1400);
        tok.style.transform = `translate(${route[2][0]}px, ${route[2][1]}px)`;
        lit(paths[k]);
        if (k === 0) await shake(c, stop); else await pulse(c, tok, 1.12);
        tok.style.opacity = 0;
        for (const o of outs[k]) await pop(c, o);
        if (k === 0) await pop(c, ans);
      } });
    if (k) steps.push({ cap: k === 2 ? `<b>Step 3:</b> ${T(`${d.A}=${d.c}`)} or ${T(`${d.A}=${-d.c}`)}. Solve each.` : `<b>Step 3:</b> ${T(`${d.A}=0`)}. Solve it.`,
      run: async (c) => { for (const e of brEls) await show(c, e); await pop(c, ans); } });
    return steps;
  }
};

/* =============================== explainer: solving by cases =============================== */
const CS = {
  e5: { label: 'Example 5', eq: '|x-4|=3x', A: 'x-4', z: 4, zT: '4', zline: 'x-4=0\\ \\Rightarrow\\ x=4', min: -4, max: 6,
    c1: { dom: 'x\\ge4', rep: '|x-4|=x-4', lines: ['x-4=3x', '-4=2x', 'x=-2'], x: -2, ok: false, why: '-2\\ge4?\\ \\text{No}' },
    c2: { dom: 'x<4', rep: '|x-4|=-(x-4)', lines: ['-(x-4)=3x', '-x+4=3x', '4=4x', 'x=1'], x: 1, ok: true, why: '1<4?\\ \\text{Yes}' },
    sol: 'x=1', chk: '|1-4|=3\\ \\text{and}\\ 3(1)=3\\ \\checkmark' },
  e6: { label: 'Example 6(a)', eq: '|2x+3|=x+6', A: '2x+3', z: -1.5, zT: '-\\tfrac{3}{2}', zline: '2x+3=0\\ \\Rightarrow\\ x=-\\tfrac{3}{2}', min: -6, max: 5,
    c1: { dom: 'x\\ge-\\tfrac{3}{2}', rep: '|2x+3|=2x+3', lines: ['2x+3=x+6', 'x=3'], x: 3, ok: true, why: '3\\ge-\\tfrac{3}{2}?\\ \\text{Yes}' },
    c2: { dom: 'x<-\\tfrac{3}{2}', rep: '|2x+3|=-(2x+3)', lines: ['-(2x+3)=x+6', '-2x-3=x+6', '-3x=9', 'x=-3'], x: -3, ok: true, why: '-3<-\\tfrac{3}{2}?\\ \\text{Yes}' },
    sol: 'x=-3\\ \\text{or}\\ x=3', chk: '|-3|=3=-3+6,\\ \\ |9|=9=3+6\\ \\checkmark' }
};
const cases = {
  title: 'Solving by cases',
  height: 524, minW: 940,
  choices: Object.keys(CS).map((k) => ({ v: k, label: CS[k].label })),
  ask: (v) => `Solve ${T(CS[v].eq)} by cases.`,
  make(stage, v, ex) {
    const d = CS[v], W = ex.W, NW = W - 8;
    const NL = new NumberLine(stage, { x: 4, y: 0, width: NW, height: 150, min: d.min, max: d.max, step: 1, axisY: 104, fontSize: 17, pad: 30 });
    const zx = NL.toPx(d.z);
    const shR = NL.interval(d.z, Infinity, { color: TE, width: 12 }), shL = NL.interval(-Infinity, d.z, { color: PU, width: 12, openB: true });
    [shR, shL].forEach(hide);
    const zp = hide(NL.point(d.z, { open: true, color: 'ink', r: 9 }));
    const tagR = hide(div(stage, 'u7l4-rtag u7l4-tagR', `${T(d.c1.dom)}: ${T(d.c1.rep)}`, 4 + zx + 12, 4));
    const tagL = hide(div(stage, 'u7l4-rtag u7l4-tagL', `${T(d.c2.dom)}: ${T(d.c2.rep)}`, 4 + zx - 12, 4)); tagL.style.translate = '-100% 0';
    const Z = div(stage, 'u7l4-zrow', '', 4, 158, NW, 40);
    const zline = wl(Z, 1, T(d.zline), 'the inside is 0');
    const PW = (NW - 14) / 2;
    const mkCase = (cs, x, cls, n) => {
      const p = div(stage, 'u7l4-panel u7l4-case ' + cls, '', x, 204, PW, 272);
      const hd = hide(div(p, 'u7l4-caseh', `Case ${n}: ${T(cs.dom)}`));
      const rp = wl(p, 3, T(cs.rep), 'replace the bars');
      const ls = cs.lines.map((t, i) => wl(p, i ? '' : 4, T(t), '', i === cs.lines.length - 1 ? 'u7l4-xline' : ''));
      const vd = wl(p, 5, `${T(cs.why)}`, cs.ok ? '<b class="u7l4-ok">keep</b>' : '<b class="u7l4-no">reject</b>');
      return { p, hd, rp, ls, vd };
    };
    // Case 1 is the right-hand subdomain, so it sits on the right
    const K2 = mkCase(d.c2, 4, 'u7l4-caseL', 2), K1 = mkCase(d.c1, 4 + PW + 14, 'u7l4-caseR', 1);
    const sol = hide(div(stage, 'u7l4-ansl u7l4-csol', `Solution: ${T(d.sol)} &nbsp;·&nbsp; Check: ${T(d.chk)}`, 4, 482));
    const cand = (cs, K) => { const e = div(stage, 'u7l4-cdot ' + (cs.ok ? 'ok' : 'no'), T(`x=${cs.x}`), 0, 0); hide(e); e.K = K; e.cs = cs; return e; };
    const D1 = cand(d.c1, K1), D2 = cand(d.c2, K2);
    const fly = async (c, D) => {
      const el = D.K.ls[D.K.ls.length - 1], r0 = el.getBoundingClientRect(), rs = stage.getBoundingClientRect(), sc = rs.width / stage.offsetWidth || 1;
      const fx = (r0.left - rs.left) / sc + 30, fy = (r0.top - rs.top) / sc, tx = 4 + NL.toPx(D.cs.x) - 38, ty = 50;
      D.style.left = tx + 'px'; D.style.top = ty + 'px'; D.style.opacity = 1;
      await anim(c, D, [{ transform: `translate(${fx - tx}px, ${fy - ty}px)` }, { transform: 'translate(0px, 0px)' }], 900);
      const dot = NL.point(D.cs.x, { color: D.cs.ok ? OK : NO, r: 9 }); await pop(c, dot);
      if (!D.cs.ok) { await shake(c, D); D.classList.add('out'); }
      await show(c, D.K.vd);
    };
    return [
      { cap: `<b>Step 1:</b> find where the inside is zero: ${T(d.zline)}.`, run: async (c) => { await show(c, zline); zp.style.opacity = 1; await pop(c, zp); } },
      { cap: `<b>Step 2:</b> split the number line at ${T(d.zT)} into two subdomains: ${T(d.c2.dom)} and ${T(d.c1.dom)}.`, run: async (c) => { shR.style.opacity = 1; shL.style.opacity = 1; await Promise.all([NL.drawIn(shR, 700, c), NL.drawIn(shL, 700, c)]); await show(c, K2.hd); await show(c, K1.hd); } },
      { cap: `<b>Step 3:</b> replace the bars. Where ${T(`${d.A}\\ge0`)}, ${T(`|${d.A}|=${d.A}`)}; where ${T(`${d.A}<0`)}, ${T(`|${d.A}|=-(${d.A})`)}.`, run: async (c) => { await show(c, tagR); await show(c, K1.rp); await show(c, tagL); await show(c, K2.rp); } },
      { cap: `<b>Step 4:</b> solve each case: ${T(`x=${d.c1.x}`)} and ${T(`x=${d.c2.x}`)}.`, run: async (c) => { for (const l of K1.ls) await show(c, l); for (const l of K2.ls) await show(c, l); } },
      { cap: `<b>Step 5:</b> keep an answer only if it lands in <b>its own</b> subdomain. ${d.c1.ok ? '' : `${T(`x=${d.c1.x}`)} is not in ${T(d.c1.dom)}: reject it. `}${d.c2.ok ? '' : `${T(`x=${d.c2.x}`)} is not in ${T(d.c2.dom)}: reject it. `}${d.c1.ok && d.c2.ok ? 'Both land at home: keep both.' : ''}`,
        run: async (c) => { await fly(c, D1); await fly(c, D2); } },
      { cap: `Combine the answers that are kept: ${T(d.sol)}.`, run: (c) => pop(c, sol) }
    ];
  }
};

/* =============================== explainer: the verdict board (STAR) =============================== */
const VD = {
  a: { label: 'Example 7(a)', eq: '|3x+1|=x-5', m: 1, A: (x) => 3 * x + 1, B: (x) => x - 5, AT: '3x+1', BT: 'x-5', win: [-6, 4, -10, 10], bl: [2.6, 'se'],
    rows: [{ lab: 'A=B', solve: ['3x+1=x-5', 'x=-3'], x: -3, L: '|3(-3)+1|=|-8|=8', R: '-3-5=-8', ok: false },
      { lab: 'A=-B', solve: ['3x+1=-(x-5)', '4x=4', 'x=1'], x: 1, L: '|3(1)+1|=|4|=4', R: '1-5=-4', ok: false }],
    end: `Both are extraneous: <b>no solution</b>. The line ${T('y=x-5')} stays below the V.` },
  b: { label: '(b)', eq: '2|x-3|=x+3', m: 2, A: (x) => x - 3, B: (x) => x + 3, AT: 'x-3', BT: 'x+3', win: [-2, 11, -4, 14], bl: [5.5, 'nw'],
    rows: [{ lab: 'A=B', solve: ['2(x-3)=x+3', 'x=9'], x: 9, L: '2|9-3|=2|6|=12', R: '9+3=12', ok: true },
      { lab: 'A=-B', solve: ['-2(x-3)=x+3', '-2x+6=x+3', 'x=1'], x: 1, L: '2|1-3|=2|-2|=4', R: '1+3=4', ok: true }],
    end: `Both check: ${T('x=1')} or ${T('x=9')}.` },
  c: { label: '(c)', eq: '|x+5|-2x=1', iso: '|x+5|=2x+1', m: 1, A: (x) => x + 5, B: (x) => 2 * x + 1, AT: 'x+5', BT: '2x+1', win: [-7, 6, -6, 12], bl: [0.6, 'se'],
    rows: [{ lab: 'A=B', solve: ['x+5=2x+1', 'x=4'], x: 4, L: '|4+5|=|9|=9', R: '2(4)+1=9', ok: true },
      { lab: 'A=-B', solve: ['-(x+5)=2x+1', '-3x=6', 'x=-2'], x: -2, L: '|-2+5|=|3|=3', R: '2(-2)+1=-3', ok: false }],
    end: `${T('x=4')} (${T('x=-2')} is extraneous).` },
  e8c: { label: 'Example 8(c)', eq: '|x-2|=2x', m: 1, A: (x) => x - 2, B: (x) => 2 * x, AT: 'x-2', BT: '2x', win: [-4, 4, -6, 6], bl: [2.3, 'nw'],
    rows: [{ lab: 'A=B', solve: ['x-2=2x', 'x=-2'], x: -2, L: '|-2-2|=|-4|=4', R: '2(-2)=-4', ok: false },
      { lab: 'A=-B', solve: ['-(x-2)=2x', '2=3x', 'x=\\tfrac{2}{3}'], x: 2 / 3, xT: '\\tfrac{2}{3}', L: '\\left|\\tfrac{2}{3}-2\\right|=\\tfrac{4}{3}', R: '2\\left(\\tfrac{2}{3}\\right)=\\tfrac{4}{3}', ok: true }],
    end: `The number is ${T('\\tfrac{2}{3}')}.` }
};
const verdict = {
  title: 'The verdict board: keep or extraneous?',
  height: 500, minW: 940,
  choices: Object.keys(VD).map((k) => ({ v: k, label: VD[k].label })),
  ask: (v) => (v === 'e8c' ? `Example 8(c): the distance between a number and 2 is twice the number: ${T(VD[v].eq)}.` : `Example 7: solve and verify ${T(VD[v].eq)}.`),
  make(stage, v, ex) {
    const d = VD[v], W = ex.W, GW = 420, BX = 4, BW = W - GW - 20, [x0, x1, y0, y1] = d.win;
    const lhsT = d.iso ? d.iso.split('=')[0] : d.eq.split('=')[0];
    const Lf = (x) => d.m * Math.abs(d.A(x));
    const G = new Graph(stage, { x: W - GW - 4, y: 4, width: GW, height: 492, xmin: x0, xmax: x1, ymin: y0, ymax: y1, xlabels: 2, ylabels: 2, fontSize: 14, pad: [28, 16, 16, 16] });
    const g1 = G.fn((x) => d.m * d.A(x), { color: GR, width: 2.6, dash: '8 7' }), g2 = G.fn((x) => -d.m * d.A(x), { color: GR, width: 2.6, dash: '8 7' });
    hide(g1); hide(g2);
    G.fn(Lf, { color: BL, width: 4.5 }); G.fn(d.B, { color: OR, width: 4 });
    const xr = x1 - (x1 - x0) * 0.04;
    G.label(xr, Math.min(y1 - 0.6, Lf(xr)), T(`y=${lhsT}`), { pos: 'w', color: BL, cls: 'bk-ptlab', dx: -6 });
    G.label(d.bl[0], d.B(d.bl[0]), T(`y=${d.BT}`), { pos: d.bl[1], color: OR, cls: 'bk-ptlab', gap: 6 });
    const ghostLab = hide(G.label(x0 + (x1 - x0) * 0.5, y0 + 0.4, 'ghost lines: the arms before the flip', { pos: 'n', cls: 'bk-ptlab u7l4-ghostlab' }));
    const B = div(stage, 'u7l4-panel u7l4-board', '', BX, 4, BW, 492);
    const top = hide(div(B, 'u7l4-bhead', d.iso ? `Isolate: ${T(d.eq)} &nbsp;→&nbsp; ${T(d.iso)}` : `${T(d.eq)}: the absolute value is already alone.`));
    const rows = d.rows.map((r, i) => {
      const card = hide(div(B, 'u7l4-vrow', ''));
      card.insertAdjacentHTML('beforeend', `<div class="u7l4-vlab">${T(r.lab)}</div>`);
      const sv = div(card, 'u7l4-vsol', r.solve.map((t) => T(t)).join(' &nbsp;→&nbsp; '));
      const ck = hide(div(card, 'u7l4-vck', `<div>Left side: ${T(r.L)}</div><div>Right side: ${T(r.R)}</div>`));
      const sp = stampOn(card, r.ok ? 'keep ✓' : 'extraneous!', r.ok, BW - 150, 92);
      const xv = r.x, yA = d.B(xv);
      const ghost = hide(G.point(xv, yA, { color: GR, r: 7.5, open: true }));
      const vline = hide(G.vline(xv, { color: r.ok ? OK : NO, width: 2.4 }));
      const onV = hide(G.point(xv, Lf(xv), { color: r.ok ? OK : BL, r: 8 }));
      const gap = r.ok ? null : hide(G.segment([xv, yA], [xv, Lf(xv)], { color: NO, width: 5 }));
      const xl = hide(G.label(xv, r.ok ? Lf(xv) : yA, T(`x=${r.xT || r.x}`), { pos: r.ok ? (xv > (x0 + x1) / 2 ? 'w' : 'e') : 's', color: r.ok ? OK : NO, cls: 'bk-pill u7l4-xpill', gap: 12 }));
      return { r, card, sv, ck, sp, ghost, vline, onV, gap, xl, gl: i ? g2 : g1 };
    });
    const end = hide(div(B, 'u7l4-ansl u7l4-vend', d.end));
    const steps = [];
    if (d.iso) steps.push({ cap: `<b>Step 1: isolate the absolute value.</b> Add ${T('2x')} to both sides: ${T(d.iso)}.`, run: (c) => show(c, top) });
    else steps.push({ cap: `${T(d.eq)}: the absolute value is already isolated. The V and the line are graphed on the right.`, run: (c) => show(c, top) });
    rows.forEach((R, i) => steps.push({
      cap: `<b>Step 2:</b> solve ${T(R.r.lab)}: ${T(R.r.solve[R.r.solve.length - 1])}. On the graph it is where the line meets the dashed ${i ? 'reflected ' : ''}line ${T(`y=${i ? '-' : ''}${d.m === 1 ? '' : d.m}${i || d.m !== 1 ? `(${d.AT})` : d.AT}`)}.`,
      run: async (c) => { await show(c, R.card); R.gl.style.opacity = 1; await G.drawIn(R.gl, 600, c); if (!i) await show(c, ghostLab); R.ghost.style.opacity = 1; await pop(c, R.ghost); } }));
    rows.forEach((R) => steps.push({
      cap: R.r.ok ? `<b>Step 3:</b> substitute ${T(`x=${R.r.xT || R.r.x}`)} into the original: both sides are ${T(R.r.R.split('=').pop())}. The point is on the V: <b>keep</b>.`
        : `<b>Step 3:</b> substitute ${T(`x=${R.r.xT || R.r.x}`)}: the left side is ${T(R.r.L.split('=').pop())} but the right side is ${T(R.r.R.split('=').pop())}. The crossing is <b>below the x-axis</b>, where the V never goes: <b>extraneous!</b>`,
      run: async (c) => {
        await show(c, R.ck); R.vline.style.opacity = 1; await G.drawIn(R.vline, 500, c);
        R.onV.style.opacity = 1; await pop(c, R.onV);
        if (R.gap) { R.gap.style.opacity = 1; await G.drawIn(R.gap, 500, c); R.ghost.querySelector('circle').setAttribute('stroke', NO); }
        else R.ghost.style.opacity = 0;
        await pop(c, R.xl); await sIn(c, R.sp); } }));
    steps.push({ cap: d.rows.every((r) => !r.ok) ? 'Every candidate failed the check, so the equation has <b>no solution</b>: always verify!' : 'Only the candidates that pass the check are solutions: the points where the line really meets the V.', run: (c) => pop(c, end) });
    return steps;
  }
};

/* =============================== explainer: tolerance and distance =============================== */
const target = {
  title: 'Distance from a target',
  height: 430, minW: 940,
  choices: [{ v: 'a', label: 'Example 8(a)' }, { v: 'b', label: '(b)' }],
  ask: (v) => (v === 'a' ? 'Example 8(a): cereal boxes have a target mass of 750 g and are rejected if they are off by more than 12 g.' : `Example 8(b): write an equation ${T('|x-a|=d')} whose solutions are ${T('-3')} and ${T('11')}.`),
  make(stage, v, ex) {
    const W = ex.W;
    if (v === 'a') {
      const NL = new NumberLine(stage, { x: 4, y: 170, width: W - 8, height: 130, min: 725, max: 775, step: 5, minor: 1, axisY: 70, fontSize: 16, pad: 30 });
      const band = hide(NL.interval(738, 762, { color: OK, width: 14 }));
      const tg = hide(NL.point(750, { color: BL, r: 9, label: 'target 750', pos: 'n' }));
      const hops = [];
      const belt = div(stage, 'u7l4-belt', '', 4, 8, W - 8, 120);
      const masses = [744, 767, 738, 753, 731, 760];
      const boxes = masses.map((m, i) => { const b = div(stage, 'u7l4-box', `<span class="u7l4-bx">📦</span><b>${m} g</b>`, 40 + i * 10, 30, 84); hide(b); b.m = m; return b; });
      const eq = hide(div(stage, 'u7l4-teq', `${T('|m-750|=12')}`, W / 2 - 160, 316, 320));
      const sv = hide(div(stage, 'u7l4-tsol', `${T('m-750=12')} or ${T('m-750=-12')}: &nbsp;${T('m=762')} or ${T('m=738')}`, 4, 372, W - 8));
      return [
        { cap: 'The target is <b>750 g</b>. A box is rejected if it differs from 750 g by <b>more than 12 g</b>.', run: async (c) => { await show(c, belt); tg.style.opacity = 1; await pop(c, tg); hops.push(await NL.hop(c, 750, 738, { label: '12', color: OR }), await NL.hop(c, 750, 762, { label: '12', color: OR })); } },
        { cap: 'Boxes come off the line and land on the scale. Within 12 g of 750: <b>accepted</b>. Farther: <b>rejected</b>.', run: async (c) => {
          hops.forEach((e) => { e.style.opacity = 0; if (e.label) e.label.style.opacity = 0; }); tg.style.opacity = 0.3; band.style.opacity = 1; await NL.drawIn(band, 600, c);
          for (const b of boxes) {
            const ok = Math.abs(b.m - 750) <= 12, x0b = parseFloat(b.style.left), tx = 4 + NL.toPx(b.m) - 42 - x0b;
            b.style.left = x0b + tx + 'px'; b.style.top = '180px'; b.style.opacity = 1;
            await anim(c, b, [{ transform: `translate(${-tx}px, -180px)`, opacity: 0 }, { transform: `translate(${-tx}px, -150px)`, opacity: 1 }], 300);
            await anim(c, b, [{ transform: `translate(${-tx}px, -150px)` }, { transform: 'translate(0px, 0px)' }], 650);
            b.classList.add(ok ? 'ok' : 'no');
            if (!ok) await shake(c, b); else await pulse(c, b, 1.08);
          } } },
        { cap: `The least and greatest accepted masses are exactly 12 g from 750 g: ${T('|m-750|=12')}.`, run: async (c) => { boxes.forEach((b) => (b.style.opacity = 0.35)); await pop(c, eq); } },
        { cap: `${T('m-750=12')} or ${T('m-750=-12')}: ${T('m=762')} or ${T('m=738')}. Accepted boxes are from <b>738 g to 762 g</b>.`, run: async (c) => { await show(c, sv); await pulse(c, eq, 1.06); } }
      ];
    }
    const NL = new NumberLine(stage, { x: 4, y: 60, width: W - 8, height: 170, min: -6, max: 14, step: 1, labelStep: 1, axisY: 120, fontSize: 17, pad: 30 });
    const pA = hide(NL.point(-3, { color: OK, r: 10 })), pB = hide(NL.point(11, { color: OK, r: 10 }));
    const rn = svgEl('g', {}, NL.layers.top);
    const runA = svgEl('text', { x: NL.toPx(-3), y: NL.ay - 18, 'text-anchor': 'middle', 'font-size': 34 }, rn), runB = svgEl('text', { x: NL.toPx(11), y: NL.ay - 18, 'text-anchor': 'middle', 'font-size': 34 }, rn);
    runA.textContent = '🏃'; runB.textContent = '🏃'; runA.setAttribute('transform', `scale(-1 1) translate(${-2 * NL.toPx(-3)} 0)`); hide(rn);
    const mid = hide(NL.point(4, { color: BL, r: 10 }));
    const ml = hide(div(stage, 'u7l4-tsol', `Midpoint: ${T('a=\\dfrac{-3+11}{2}=4')}`, 4, 250, W - 8));
    const dl = hide(div(stage, 'u7l4-tsol', `Half the distance: ${T('d=\\dfrac{11-(-3)}{2}=7')}`, 4, 300, W - 8));
    const eq = hide(div(stage, 'u7l4-teq', `${T('|x-4|=7')}`, W / 2 - 160, 352, 320));
    const hops = [];
    return [
      { cap: `The two solutions, ${T('-3')} and ${T('11')}, on the number line.`, run: async (c) => { pA.style.opacity = 1; pB.style.opacity = 1; await pop(c, pA); await pop(c, pB); } },
      { cap: 'Two runners start at the solutions and run toward each other at the same speed. They meet in the <b>middle</b> …', run: async (c) => {
        rn.style.opacity = 1;
        await tween(c, 2000, (t) => { const xa = NL.toPx(-3 + 7 * t), xb = NL.toPx(11 - 7 * t); runA.setAttribute('x', xa); runA.setAttribute('transform', `scale(-1 1) translate(${-2 * xa} 0)`); runB.setAttribute('x', xb); });
        mid.style.opacity = 1; await pop(c, mid); await show(c, ml); } },
      { cap: `… after running 7 each: half the distance between the solutions. Both solutions are <b>7 units from 4</b>.`, run: async (c) => { rn.style.opacity = 0.25; hops.push(await NL.hop(c, 4, -3, { label: '7', color: OR }), await NL.hop(c, 4, 11, { label: '7', color: OR })); await show(c, dl); } },
      { cap: `“${T('x')} is 7 units from 4”: ${T('|x-4|=7')}. Check: ${T('|-3-4|=7')} ✓ and ${T('|11-4|=7')} ✓`, run: (c) => pop(c, eq) }
    ];
  }
};

/* =============================== the number line on Example 5 (static) =============================== */
function ex5Line() {
  const host = document.getElementById('u7l4-ex5nl'); if (!host || host.firstChild) return;
  const NL = new NumberLine(host, { width: 700, height: 100, min: -4, max: 6, step: 1, axisY: 62, fontSize: 16, pad: 26 });
  NL.point(4, { open: true, color: 'ink', r: 8 });
  NL.mark(0, 'x<4:\\ \\ x-4<0', { pos: 'n', tex: true, lift: 8 });
  NL.mark(5.3, 'x\\ge4', { pos: 'n', tex: true, lift: 8 });
}
ex5Line();

/* =============================== Stand Up Break =============================== */
const sgnT = (n) => (n < 0 ? `-${-n}` : `+${n}`);
standup('u7l4', {
  intro: 'At your whiteboard: isolate the absolute value, split into two equations, and check every answer in the original equation.',
  levels: {
    BEG: (r) => { // |x − a| = d
      const a = r.int(-7, 7) || 2, dd = r.int(2, 9);
      return { q: `|x${sgnT(-a)}|=${dd}`, a: [`x${sgnT(-a)}=${dd}\\ \\text{or}\\ x${sgnT(-a)}=-${dd}`, `x=${a + dd}\\ \\text{or}\\ x=${a - dd}`] };
    },
    PRG: (r) => { // k|x + p| + q = s, isolate first (sometimes no solution)
      const k = r.int(2, 5), p = r.int(-6, 6) || 3, q = r.int(-9, 9) || -4, dd = r.int(1, 6), none = r.chance(0.25);
      const s = none ? q - k * dd : q + k * dd, inT = `x${sgnT(p)}`;
      if (none) return { q: `${k}|${inT}|${sgnT(q)}=${s}`, a: [`${k}|${inT}|=${s - q}`, `|${inT}|=${(s - q) / k}`, '\\text{No solution: an absolute value is never negative.}'] };
      return { q: `${k}|${inT}|${sgnT(q)}=${s}`, a: [`${k}|${inT}|=${s - q}`, `|${inT}|=${dd}`, `${inT}=${dd}\\ \\text{or}\\ ${inT}=-${dd}`, `x=${dd - p}\\ \\text{or}\\ x=${-dd - p}`] };
    },
    MAS: (r) => { // |ax + b| = rx + e: solve both, verify, reject extraneous
      let a = 3, b = 1, m = 1, e = -5, x1 = -3, x2 = 1;
      for (let i = 0; i < 400; i++) {
        const a1 = r.pick([2, 3, 4]), b1 = r.int(-8, 8), m1 = r.pick([1, 2, -1]), e1 = r.int(-9, 9);
        if (!b1 || !e1 || a1 === m1 || a1 === -m1) continue;
        const u = (e1 - b1) / (a1 - m1), w = (-e1 - b1) / (a1 + m1);
        if (u % 1 || w % 1 || u === w) continue;
        a = a1; b = b1; m = m1; e = e1; x1 = u; x2 = w; break;
      }
      const AT = `${a}x${sgnT(b)}`, BT = `${m === 1 ? '' : m === -1 ? '-' : m}x${sgnT(e)}`, Bv = (x) => m * x + e;
      const line = (x, k) => { const L = Math.abs(a * x + b), R = Bv(x); return `x=${x}:\\ \\ |${a * x + b}|=${L},\\ \\ ${k}=${R}\\ \\ ${L === R ? '\\checkmark' : '\\times\\ \\text{extraneous}'}`; };
      const keep = [x1, x2].filter((x) => Bv(x) >= 0);
      return { q: `|${AT}|=${BT}`, a: [`${AT}=${BT}\\ \\Rightarrow\\ x=${x1}`, `${AT}=-(${BT})\\ \\Rightarrow\\ x=${x2}`, line(x1, '\\text{right}'), line(x2, '\\text{right}'),
        keep.length ? `x=${keep.join('\\ \\text{or}\\ x=')}` : '\\text{No solution}'] };
    }
  }
});

/* =============================== mount =============================== */
export const explainers = mountExplainers({ howmany, methods, isolate, cases, verdict, target });
export const _test = { HM, MT, IS, CS, VD };
