/* Math 20-1 · Unit 4 · Lesson 2 — Factoring ax² + bx + c.
 * Warm-up (The Stained-Glass Window: two lead lines cut a window into four panes; the diagonal products of the pane
 * areas are always equal, so a missing pane can be found from the other three), and the explainers:
 *   areaWhy (the booklet's area model of a binomial product: the two middle cells multiply to the same as the corners,
 *     so the middle numbers have product ac and sum b; Example 1 check, any rectangle),
 *   hunt (STAR: the product–sum hunt. A table of factor pairs of ac lights up row by row until the pair with sum b
 *     appears; the middle term splits in two, the grouping brackets snap on, the common binomial glows and the two
 *     brackets fly together; the area model checks it. Example 1, Example 2 checks and a long hunt),
 *   huntNeg (the same hunt with the sign rules first: ac < 0 → opposite signs; Example 3 checks, Example 4 by
 *     decomposition, a trinomial that does not factor),
 *   guess (guess and check: two binomial slots, outer and inner products arc over and under, a try log; Example 4
 *     check; why it is slow when a and c have many factors: 12 cards),
 *   gcf (GCF first: each term divided by the GCF, or every sign flipping for −1; why: the same trinomial without the
 *     GCF gives a bigger hunt and an answer that is not fully factored; Example 5 checks),
 *   boxMethod (two variables: decomposition read off the area model in reverse; Example 6 checks),
 *   fracs (take out a fraction: ÷ ½ is × 2; LCD; Example 7 checks),
 *   squareModel (a square of side A + B: two equal AB rectangles make 2AB; Example 8 and 9(c) checks),
 *   psTest (the perfect-square test as three checks with stamps; Example 8 and 9 checks, the blanks of 8(b)).
 * Colours: a and c (the corners, the product ac) rose; the two split numbers m (blue) and n (amber); the common
 * binomial green; wrong rows red/grey. No calculator in Unit 4. */
import {
  h, tex, add, box, stamp, stampIn, mountExplainers, pop, fadeIn, sleep, svgEl, pulse, anim, drawIn, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const AC = COLORS.teal, MC = COLORS.blue, NC = COLORS.amber, GC = COLORS.green, RED = COLORS.red, INK = COLORS.ink;
const show = (c, el, ms = 320) => fadeIn(c, el, ms);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const sgn = (k) => (k < 0 ? '-' : '+');
/** TeX of k·m (m a monomial like 'x^2', 'xy', '' for a number); sign included */
const mono = (k, m = '') => (m ? (k === 1 ? m : k === -1 ? '-' + m : k + m) : String(k));
/** TeX of a polynomial from [[k, m], …] */
const poly = (ts) => ts.map(([k, m], i) => (i ? ` ${sgn(k)} ${mono(Math.abs(k), m)}` : mono(k, m))).join('');
const bin = (p, m1, q, m2 = '') => `(${poly([[p, m1], [q, m2]])})`;
/** absolute position of el inside the stage (offsets are not affected by the stage's scale transform) */
function posIn(stage, el) { let x = 0, y = 0; while (el && el !== stage) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; } return [x, y]; }
/** a ghost copy of src flies to dst; dst then shows */
async function fly(c, stage, src, dst, ms = 650) {
  const [x0, y0] = posIn(stage, src), [x1, y1] = posIn(stage, dst);
  const g = src.cloneNode(true); g.classList.add('u4l2-ghost'); g.style.opacity = 1; stage.appendChild(g);
  g.style.left = x0 + 'px'; g.style.top = y0 + 'px'; g.style.fontSize = getComputedStyle(src).fontSize; g.style.color = getComputedStyle(src).color;
  try { await anim(c, g, [{ transform: 'translate(0,0)' }, { transform: `translate(${x1 - x0}px, ${y1 - y0}px)` }], ms); } finally { g.remove(); }
  dst.style.opacity = 1;
}

/* A line of maths made of separate tokens so pieces can be coloured, hidden, popped and flown.
 * toks: [{ t: TeX, cls, id, hid }] or strings (TeX). Returns { el, k: { id: element }, all: [elements] }. */
function mline(host, x, y, toks, cls = '') {
  const el = div(host, 'u4l2-ln ' + cls, '', x, y), k = {}, all = [];
  toks.forEach((o) => {
    if (typeof o === 'string') o = { t: o };
    const d = h('div', 'u4l2-tk' + (o.op ? ' u4l2-op' : '') + (o.cls ? ' ' + o.cls : ''), T(o.t));
    if (o.hid) d.style.display = 'none';
    el.appendChild(d); all.push(d); if (o.id) k[o.id] = d;
  });
  return { el, k, all };
}
const opTok = (s, o = {}) => Object.assign({ t: s === '-' ? '-' : '+', op: true }, o);

/* positive factor pairs of n */
function pairsOf(n) { const out = []; for (let p = 1; p * p <= n; p++) if (n % p === 0) out.push([p, n / p]); return out; }
/** the signed pairs to try for product ac and sum b (sign rules applied) */
function signedPairs(ac, b) {
  return pairsOf(Math.abs(ac)).map(([p, q]) => {
    if (ac > 0) return b >= 0 ? [p, q] : [-p, -q];
    return b >= 0 ? [-p, q] : [p, -q];
  });
}
function signRule(ac, b) {
  if (ac > 0) return b > 0 ? `${T('ac>0')} and ${T('b>0')}: <b>both positive</b>` : `${T('ac>0')} and ${T('b<0')}: <b>both negative</b>`;
  return `${T('ac<0')}: <b>opposite signs</b>; the bigger one is ${b > 0 ? '<b>positive</b>' : '<b>negative</b>'} (like ${T('b')})`;
}

/* The product–sum table. Rows of m | n | m + n with a status mark. */
function pairTable(host, x, y, pairs, o = {}) {
  const rh = o.rh || 36, w = o.w || 300, t = div(host, 'u4l2-tbl' + (o.sm ? ' u4l2-tbl-sm' : ''), '', x, y, w);
  const head = h('div', 'u4l2-tr u4l2-th', `<div>${T('m')}</div><div>${T('n')}</div><div>${T('m+n')}</div><div></div>`);
  head.style.height = rh + 'px'; t.appendChild(head);
  const rows = pairs.map(([m, n]) => {
    const r = h('div', 'u4l2-tr', `<div>${T(String(m))}</div><div>${T(String(n))}</div><div class="u4l2-sum"></div><div class="u4l2-mk"></div>`);
    r.style.height = rh + 'px'; t.appendChild(r); return r;
  });
  return { el: t, rows };
}
async function huntRows(c, tb, pairs, b, found, ms = 380) {
  const last = found >= 0 ? found : pairs.length - 1;
  for (let i = 0; i <= last; i++) {
    const r = tb.rows[i], [m, n] = pairs[i];
    r.classList.add('u4l2-tr-on');
    r.querySelector('.u4l2-sum').innerHTML = T(`${m}+${n < 0 ? `(${n})` : n}=${m + n}`);
    await sleep(c, ms);
    r.classList.remove('u4l2-tr-on');
    if (i === found) { r.classList.add('u4l2-tr-yes'); r.querySelector('.u4l2-mk').textContent = '✓'; await pulse(c, r, 1.06); }
    else { r.classList.add('u4l2-tr-no'); r.querySelector('.u4l2-mk').textContent = '✗'; }
  }
}

/* ====================================================================================================
 * Warm-up: The Stained-Glass Window. Window A is 7 dm by 5 dm; the lead lines can be dragged (whole dm).
 * The mystery window (not to scale) has panes 8, 12, 18 and ?.
 * ==================================================================================================== */
function mountWindow() {
  const host = document.getElementById('u4l2-win'); if (!host) return;
  const W = host.clientWidth || 480, H = host.clientHeight || 306;
  const svg = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u4l2-winsvg' }, host);
  const out = document.getElementById('u4l2-wout');
  const bA = document.getElementById('u4l2-wa'), bM = document.getElementById('u4l2-wm'), bD = document.getElementById('u4l2-wd');
  const FILL = ['#f3c9d6', '#c9dafc', '#fbe2b4', '#c8ecd9'], EDGE = ['#a33357', '#1f5bd6', '#c27a0e', '#12805a'];
  let mode = 'A', w1 = 2, h1 = 3, diag = false, drag = null;
  const WT = 7, HT = 5;
  const T2 = (x, y, s, o = {}) => { const t = svgEl('text', Object.assign({ x, y, 'text-anchor': 'middle', 'dominant-baseline': 'central', class: 'u4l2-wt' }, o), svg); t.textContent = s; return t; };
  function draw() {
    svg.innerHTML = '';
    let ox, oy, cw, ch, cws, chs, areas, sides;
    if (mode === 'A') {
      const s = Math.min((W - 110) / WT, (H - 84) / HT); cw = WT * s; ch = HT * s; ox = (W - cw) / 2 + 14; oy = 38;
      cws = [w1 * s, (WT - w1) * s]; chs = [h1 * s, (HT - h1) * s];
      const ws = [w1, WT - w1], hs = [h1, HT - h1];
      areas = [ws[0] * hs[0], ws[1] * hs[0], ws[0] * hs[1], ws[1] * hs[1]].map(String);
      sides = { w: ws, h: hs };
    } else {
      cw = 320; ch = 220; ox = (W - cw) / 2 + 14; oy = 38; cws = [cw * 0.44, cw * 0.56]; chs = [ch * 0.4, ch * 0.6];
      areas = ['8', '12', '18', '?']; sides = null;
    }
    // the frame: a pointed-arch hint above, a wooden frame round the panes
    svgEl('rect', { x: ox - 12, y: oy - 12, width: cw + 24, height: ch + 24, rx: 8, fill: '#7a5a3a' }, svg);
    const cells = [[0, 0], [1, 0], [0, 1], [1, 1]];
    cells.forEach(([i, j], k) => {
      const x = ox + (i ? cws[0] : 0), y = oy + (j ? chs[0] : 0), w = cws[i], hh = chs[j];
      svgEl('rect', { x, y, width: w, height: hh, fill: FILL[k] }, svg);
      // a little "glass" sheen
      svgEl('path', { d: `M${x + 8} ${y + hh - 10} L${x + Math.min(w * 0.45, 60)} ${y + 8}`, stroke: '#fff', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.55 }, svg);
      const t = T2(x + w / 2, y + hh / 2, areas[k] === '?' ? '?' : areas[k] + ' dm²', { class: 'u4l2-wt u4l2-wa' + (areas[k] === '?' ? ' u4l2-wq' : '') });
      t.setAttribute('fill', EDGE[k]);
    });
    // leads
    const vx = ox + cws[0], hy = oy + chs[0];
    svgEl('line', { x1: vx, y1: oy, x2: vx, y2: oy + ch, stroke: '#3b2a1a', 'stroke-width': 7 }, svg);
    svgEl('line', { x1: ox, y1: hy, x2: ox + cw, y2: hy, stroke: '#3b2a1a', 'stroke-width': 7 }, svg);
    svgEl('rect', { x: ox, y: oy, width: cw, height: ch, fill: 'none', stroke: '#3b2a1a', 'stroke-width': 7 }, svg);
    if (sides) {
      T2(ox + cws[0] / 2, oy - 26, sides.w[0] + ' dm', { class: 'u4l2-wt u4l2-ws' }); T2(vx + cws[1] / 2, oy - 26, sides.w[1] + ' dm', { class: 'u4l2-wt u4l2-ws' });
      T2(ox - 44, oy + chs[0] / 2, sides.h[0] + ' dm', { class: 'u4l2-wt u4l2-ws' }); T2(ox - 44, hy + chs[1] / 2, sides.h[1] + ' dm', { class: 'u4l2-wt u4l2-ws' });
      // drag handles at the ends of the leads
      const hv = svgEl('circle', { cx: vx, cy: oy + ch + 22, r: 14, class: 'u4l2-hdl', 'data-tap': '' }, svg);
      const hh2 = svgEl('circle', { cx: ox + cw + 22, cy: hy, r: 14, class: 'u4l2-hdl', 'data-tap': '' }, svg);
      const grab = (el, kind) => el.addEventListener('pointerdown', (e) => { e.preventDefault(); drag = { kind, s: cw / WT, ox, oy }; try { svg.setPointerCapture(e.pointerId); } catch (er) { /* */ } });
      grab(hv, 'v'); grab(hh2, 'h');
    } else T2(ox + cw / 2, oy + ch + 24, 'not to scale', { class: 'u4l2-wt u4l2-wns' });
    // readout
    if (mode === 'A') {
      const [a, b, c2, d] = areas;
      out.innerHTML = diag ? `<span class="u4l2-wo1">${T(`\\textcolor{${EDGE[0]}}{${a}}\\times\\textcolor{${EDGE[3]}}{${d}}=${a * d}`)}</span><span class="u4l2-wo2">${T(`\\textcolor{${EDGE[1]}}{${b}}\\times\\textcolor{${EDGE[2]}}{${c2}}=${b * c2}`)}</span>` : '<span class="muted">Drag a round handle to move a lead line.</span>';
    } else out.innerHTML = diag ? `${T(`\\textcolor{${EDGE[0]}}{8}\\times\\textcolor{${EDGE[3]}}{?}=\\textcolor{${EDGE[1]}}{12}\\times\\textcolor{${EDGE[2]}}{18}=216`)}, so ${T('?=216\\div8=27')} dm²` : '<span class="muted">Three panes are known. What is the fourth?</span>';
    bA.classList.toggle('on', mode === 'A'); bM.classList.toggle('on', mode === 'M'); bD.classList.toggle('on', diag);
  }
  svg.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const r = svg.getBoundingClientRect(), sc = r.width / W, px = (e.clientX - r.left) / sc, py = (e.clientY - r.top) / sc;
    if (drag.kind === 'v') { const v = Math.max(1, Math.min(WT - 1, Math.round((px - drag.ox) / drag.s))); if (v !== w1) { w1 = v; draw(); } }
    else { const v = Math.max(1, Math.min(HT - 1, Math.round((py - drag.oy) / drag.s))); if (v !== h1) { h1 = v; draw(); } }
  });
  const end = () => { drag = null; };
  svg.addEventListener('pointerup', end); svg.addEventListener('pointercancel', end);
  bA.addEventListener('click', () => { mode = 'A'; w1 = 2; h1 = 3; diag = false; draw(); });
  bM.addEventListener('click', () => { mode = 'M'; diag = false; draw(); });
  bD.addEventListener('click', () => { diag = !diag; draw(); });
  draw();
}

/* =============================== explainer: the area model, why ac and b =============================== */
const AW = {
  notes: { label: '(2x + 3)(x + 4)', rows: [[2, 'x'], [3, '']], cols: [[1, 'x'], [4, '']] },
  ex1: { label: 'Example 1 check', rows: [[3, 'x'], [2, '']], cols: [[2, 'x'], [5, '']] },
  any: { label: 'Any rectangle', gen: true }
};
const areaWhy = {
  title: 'The area model: where ac and b come from',
  height: 372,
  choices: [{ v: 'notes', label: AW.notes.label }, { v: 'any', label: AW.any.label }, { sep: 'Check:' }, { v: 'ex1', label: AW.ex1.label }],
  ask: (v) => (AW[v].gen ? `Expand ${T('(px+q)(rx+s)')} with an area model.` : `Expand ${T(bin(AW[v].rows[0][0], 'x', AW[v].rows[1][0]) + bin(AW[v].cols[0][0], 'x', AW[v].cols[1][0]))} with an area model.`),
  make(stage, v, ex) {
    const d = AW[v], G = !!d.gen;
    const L = G ? ['px', 'q'] : d.rows.map(([k, m]) => mono(k, m)), Tp = G ? ['rx', 's'] : d.cols.map(([k, m]) => mono(k, m));
    const cell = G ? ['prx^2', 'psx', 'qrx', 'qs'] : [mono(d.rows[0][0] * d.cols[0][0], 'x^2'), mono(d.rows[0][0] * d.cols[1][0], 'x'), mono(d.rows[1][0] * d.cols[0][0], 'x'), String(d.rows[1][0] * d.cols[1][0])];
    const A = G ? 0 : d.rows[0][0] * d.cols[0][0], M = G ? 0 : d.rows[0][0] * d.cols[1][0], N = G ? 0 : d.rows[1][0] * d.cols[0][0], C = G ? 0 : d.rows[1][0] * d.cols[1][0];
    const X0 = 86, Y0 = 52, cw = [210, 140], ch = [150, 104];
    const svg = svgEl('svg', { class: 'u4l2-ov', width: ex.W, height: 372 }, stage);
    const cx = [X0, X0 + cw[0]], cy = [Y0, Y0 + ch[0]];
    const rects = [[0, 0], [1, 0], [0, 1], [1, 1]].map(([i, j], k) => {
      const r = svgEl('rect', { x: cx[i], y: cy[j], width: cw[i], height: ch[j], class: 'u4l2-cell u4l2-cell' + k }, svg);
      return r;
    });
    const sideT = Tp.map((s, i) => div(stage, 'u4l2-side', T(s), cx[i] + cw[i] / 2, Y0 - 38));
    const sideL = L.map((s, j) => div(stage, 'u4l2-side', T(s), X0 - 46, cy[j] + ch[j] / 2 - 16));
    [...sideT, ...sideL].forEach((e) => { e.style.translate = '-50% 0'; });
    const cls = ['u4l2-cA', 'u4l2-cM', 'u4l2-cN', 'u4l2-cA'];
    const cellT = [[0, 0], [1, 0], [0, 1], [1, 1]].map(([i, j], k) => { const e = hide(div(stage, 'u4l2-cellt ' + cls[k], T(cell[k]), cx[i] + cw[i] / 2, cy[j] + ch[j] / 2)); e.style.translate = '-50% -50%'; return e; });
    // diagonals
    const dg1 = svgEl('line', { x1: cx[0] + 26, y1: cy[0] + 20, x2: cx[1] + cw[1] - 26, y2: cy[1] + ch[1] - 18, class: 'u4l2-diag u4l2-diag1' }, svg);
    const dg2 = svgEl('line', { x1: cx[1] + cw[1] - 26, y1: cy[0] + 20, x2: cx[0] + 26, y2: cy[1] + ch[1] - 18, class: 'u4l2-diag u4l2-diag2' }, svg);
    hide(dg1); hide(dg2);
    const RX = 500, RW = ex.W - RX - 18;
    const p = div(stage, 'u4l2-panel', '', RX, 24, RW, 324);
    const l1 = hide(div(p, 'u4l2-pl', G ? T('=prx^2+psx+qrx+qs') : T(`=${cell[0]}+\\textcolor{${MC}}{${cell[1]}}+\\textcolor{${NC}}{${cell[2]}}+${cell[3]}`)));
    const l2 = hide(div(p, 'u4l2-pl', G ? T('=prx^2+(ps+qr)x+qs') : T(`=${poly([[A, 'x^2'], [M + N, 'x'], [C, '']])}`)));
    const prod = G ? 'pqrs\\,x^2' : `${A * C}x^2`;
    const l3 = hide(div(p, 'u4l2-pl u4l2-pl-d1', T(G ? `(prx^2)(qs)=${prod}` : `(${cell[0]})(${cell[3]})=${prod}`)));
    const l4 = hide(div(p, 'u4l2-pl u4l2-pl-d2', T(G ? `(psx)(qrx)=${prod}` : `(\\textcolor{${MC}}{${cell[1]}})(\\textcolor{${NC}}{${cell[2]}})=${prod}`)));
    const l5 = hide(div(p, 'u4l2-pl u4l2-key', G ? `The middle numbers ${T('ps')} and ${T('qr')}:<br>product ${T('ps\\cdot qr=(pr)(qs)=ac')}<br>sum ${T('ps+qr=b')}`
      : `The middle numbers ${T(`\\textcolor{${MC}}{${M}}`)} and ${T(`\\textcolor{${NC}}{${N}}`)}:<br>product ${T(`${M}\\times${N}=${M * N}=${A}\\times${C}=ac`)}<br>sum ${T(`${M}+${N}=${M + N}=b`)}`));
    const same = hide(stamp(stage, 'same!', { x: cx[1], y: cy[1] + ch[1] + 22, size: 'sm' }));
    const trin = G ? 'prx^2+(ps+qr)x+qs' : poly([[A, 'x^2'], [M + N, 'x'], [C, '']]);
    return [
      { cap: `The rectangle has sides ${T(G ? '(px+q)' : bin(d.cols[0][0], 'x', d.cols[1][0]))} and ${T(G ? '(rx+s)' : bin(d.rows[0][0], 'x', d.rows[1][0]))}. Each part of one side meets each part of the other: <b>four cells</b>.`, run: async (c) => { for (const e of cellT) await pop(c, e, 300); } },
      { cap: `Add the cells. The two <b>middle cells</b> are like terms: they combine into the ${T('x')}-term.`, run: async (c) => { await show(c, l1); await show(c, l2); } },
      { cap: `Multiply the <b>corners</b>: ${T(G ? `(prx^2)(qs)=${prod}` : `(${cell[0]})(${cell[3]})=${prod}`)}.`, run: async (c) => { dg1.style.opacity = 1; await drawIn(dg1, 500, c); await show(c, l3); } },
      { cap: `Now the <b>middle cells</b>: ${T(G ? `(psx)(qrx)=${prod}` : `(${cell[1]})(${cell[2]})=${prod}`)}. The same! The two diagonals always match.`, run: async (c) => { dg2.style.opacity = 1; await drawIn(dg2, 500, c); await show(c, l4); await stampIn(c, same); } },
      { cap: G ? `So in ${T('ax^2+bx+c')} the middle term is made of two numbers with <b>product ${T('ac')}</b> and <b>sum ${T('b')}</b>. Find them, and you can rebuild the rectangle.`
        : `So for ${T(trin)}: look for two numbers with <b>product ${T(`ac=${A * C}`)}</b> and <b>sum ${T(`b=${M + N}`)}</b>. They are ${M} and ${N}.`, run: (c) => show(c, l5) }
    ];
  }
};

/* =============================== the product–sum hunt (STAR) =============================== */
function huntDef(title, data, choices, o = {}) {
  return {
    title, height: 446, capH: 86,
    choices,
    ask: (v) => `Factor ${T(poly([[data[v].a, data[v].v + '^2'], [data[v].b, data[v].v], [data[v].c, '']]))} by decomposition.`,
    make(stage, v, ex) {
      const d = data[v], x = d.v, x2 = x + '^2', { a, b, c } = d, ac = a * c;
      const pairs = signedPairs(ac, b), found = pairs.findIndex(([m, n]) => m + n === b);
      const trin = poly([[a, x2], [b, x], [c, '']]);
      // left: the trinomial, a b c, target pills, sign rule, table
      const top = mline(stage, 18, 14, [{ t: mono(a, x2), cls: 'u4l2-cA', id: 'a' }, opTok(sgn(b)), { t: mono(Math.abs(b), x), cls: 'u4l2-cB', id: 'b' }, opTok(sgn(c)), { t: String(Math.abs(c)), cls: 'u4l2-cA', id: 'c' }], 'u4l2-big');
      const abc = hide(div(stage, 'u4l2-abc', `${T(`\\textcolor{${AC}}{a=${a}}`)} &nbsp; ${T(`\\textcolor{${GC}}{b=${b}}`)} &nbsp; ${T(`\\textcolor{${AC}}{c=${c}}`)}`, 20, 66));
      const pills = hide(div(stage, 'u4l2-pills', `<div class="u4l2-pill u4l2-pill-p">product ${T(`ac=${a}\\times${c < 0 ? `(${c})` : c}=${ac}`)}</div><div class="u4l2-pill u4l2-pill-s">sum ${T(`b=${b}`)}</div>`, 18, 98, 340));
      const rule = hide(div(stage, 'u4l2-rule', signRule(ac, b), 18, 186, 340));
      const tb = pairTable(stage, 18, o.signs ? 232 : 186, pairs, { rh: pairs.length > 5 ? 30 : 33, w: 330 });
      tb.rows.forEach(hide); hide(tb.el);
      // right: the working
      const RX = 400, lab = (y, s) => hide(div(stage, 'u4l2-lab', s, RX, y + 10));
      const [m, n] = d.split || (found >= 0 ? pairs[found] : [0, 0]);
      const steps0 = [
        { cap: `Read off ${T('a')}, ${T('b')} and ${T('c')}.`, run: (c2) => show(c2, abc) },
        { cap: `We need two numbers with <b>product</b> ${T(`ac=${ac}`)} and <b>sum</b> ${T(`b=${b}`)}.`, run: (c2) => show(c2, pills) }
      ];
      if (o.signs) steps0.push({ cap: `Signs first. ${signRule(ac, b)}.`, run: (c2) => show(c2, rule) });
      steps0.push({ cap: `List the factor pairs of ${T(String(Math.abs(ac)))}${o.signs ? ', with those signs' : ''}.`, run: async (c2) => { tb.el.style.opacity = 1; for (const r of tb.rows) await show(c2, r, 160); } });
      if (found < 0) {
        const st = hide(stamp(stage, 'does not factor', { x: RX + 300, y: 200, ok: false, size: 'lg' }));
        const why = hide(div(stage, 'u4l2-note', `No pair of integers has product ${T(String(ac))} and sum ${T(String(b))}, so ${T(trin)} <b>does not factor over the integers</b>.`, RX + 40, 270, ex.W - RX - 80));
        return steps0.concat([
          { cap: `Hunt: check each sum. ${pairs.map(([p, q]) => T(`${p}+${q}=${p + q}`)).join(', ')}. None is ${T(String(b))}!`, run: (c2) => huntRows(c2, tb, pairs, b, -1) },
          { cap: `No pair works: ${T(trin)} <b>does not factor over the integers</b>. That is a correct answer too.`, run: async (c2) => { await stampIn(c2, st); await show(c2, why); } }
        ]);
      }
      const g1 = gcd(a, m), b0 = a / g1, b1 = m / g1, g2 = n / b0;
      const B = bin(b0, x, b1), F2 = bin(g1, x, g2);
      const y1 = 26, y2 = 100, y3 = 174, y4 = 248;
      const l1lab = lab(y1, 'split'), l2lab = lab(y2, 'group'), l3lab = lab(y3, 'take out<br>GCFs'), l4lab = lab(y4, 'factor');
      const LX = RX + 90;
      const L1 = mline(stage, LX, y1, [{ t: mono(a, x2) }, opTok(sgn(b), { id: 'opb' }), { t: mono(Math.abs(b), x), id: 'b' },
        opTok(sgn(m), { id: 'opm', hid: true }), { t: mono(Math.abs(m), x), cls: 'u4l2-cM', id: 'm', hid: true }, opTok(sgn(n), { id: 'opn', hid: true }), { t: mono(Math.abs(n), x), cls: 'u4l2-cN', id: 'n', hid: true },
        opTok(sgn(c)), { t: String(Math.abs(c)) }], 'u4l2-work');
      hide(L1.el);
      const L2 = mline(stage, LX, y2, [{ t: '(', cls: 'u4l2-br u4l2-brM', id: 'p1' }, { t: mono(a, x2) }, opTok(sgn(m)), { t: mono(Math.abs(m), x), cls: 'u4l2-cM' }, { t: ')', cls: 'u4l2-br u4l2-brM', id: 'p2' },
        opTok('+'), { t: '(', cls: 'u4l2-br u4l2-brN', id: 'p3' }, { t: mono(n, x), cls: 'u4l2-cN' }, opTok(sgn(c)), { t: String(Math.abs(c)) }, { t: ')', cls: 'u4l2-br u4l2-brN', id: 'p4' }], 'u4l2-work');
      hide(L2.el);
      const L3 = mline(stage, LX, y3, [{ t: mono(g1, x), cls: 'u4l2-cM', id: 'g1' }, { t: B, cls: 'u4l2-cG', id: 'B1' }, opTok(sgn(g2), { id: 'og' }), { t: String(Math.abs(g2)), cls: 'u4l2-cN', id: 'g2' }, { t: B, cls: 'u4l2-cG', id: 'B2' }], 'u4l2-work');
      hide(L3.el);
      const L4 = mline(stage, LX, y4, [{ t: B, cls: 'u4l2-cG u4l2-fin', id: 'B' }, { t: F2, cls: 'u4l2-fin', id: 'F' }], 'u4l2-work');
      L4.all.forEach(hide);
      // area-model check
      const AX = ex.W - 270, AY = 318, aw = [118, 96], ah = [52, 46];
      const asvg = svgEl('svg', { class: 'u4l2-ov', width: ex.W, height: 446 }, stage);
      const acx = [AX, AX + aw[0]], acy = [AY, AY + ah[0]], ag = svgEl('g', {}, asvg); ag.style.opacity = 0;
      [[0, 0], [1, 0], [0, 1], [1, 1]].forEach(([i, j], k) => svgEl('rect', { x: acx[i], y: acy[j], width: aw[i], height: ah[j], class: 'u4l2-cell u4l2-cell' + k }, ag));
      const aT = [[0, 0, mono(a, x2), 'u4l2-cA'], [1, 0, mono(m, x), 'u4l2-cM'], [0, 1, mono(n, x), 'u4l2-cN'], [1, 1, String(c), 'u4l2-cA']].map(([i, j, s, cl]) => { const e = hide(div(stage, 'u4l2-cellt u4l2-cellt-sm ' + cl, T(s), acx[i] + aw[i] / 2, acy[j] + ah[j] / 2)); e.style.translate = '-50% -50%'; return e; });
      const aS = [[mono(b0, x), acx[0] + aw[0] / 2, AY - 26], [String(b1), acx[1] + aw[1] / 2, AY - 26], [mono(g1, x), AX - 30, acy[0] + ah[0] / 2 - 13], [String(g2), AX - 30, acy[1] + ah[1] / 2 - 13]]
        .map(([s, px, py], k) => { const e = hide(div(stage, 'u4l2-side u4l2-side-sm' + (k < 2 ? ' u4l2-cG' : ''), T(s), px, py)); e.style.translate = '-50% 0'; return e; });
      const ok = hide(stamp(stage, '✓', { x: AX - 110, y: AY + 50, size: 'lg' }));
      const sameOrder = d.ans && d.ans !== `${B}${F2}` ? ` The booklet writes ${T(d.ans)}: the same factors in the other order.` : '';
      return steps0.concat([
        { cap: `<b>Hunt:</b> check each sum until one is ${T(String(b))}. ${T(`${pairs[found][0]}+${pairs[found][1] < 0 ? `(${pairs[found][1]})` : pairs[found][1]}=${b}`)} ✓`, run: (c2) => huntRows(c2, tb, pairs, b, found) },
        { cap: `<b>Split</b> the middle term into two: ${T(`${mono(b, x)}=${mono(m, x)}${n < 0 ? '' : '+'}${mono(n, x)}`)}.${d.split && pairs[found][0] !== m ? ' (Either order works.)' : ''}`, run: async (c2) => {
          L1.el.style.opacity = 1; L1.k.b.style.opacity = 1; await show(c2, l1lab); await pulse(c2, L1.k.b, 1.25);
          L1.k.b.style.display = 'none'; L1.k.opb.style.display = 'none';
          ['opm', 'm', 'opn', 'n'].forEach((k) => { L1.k[k].style.display = ''; });
          await Promise.all([pop(c2, L1.k.m, 420), pop(c2, L1.k.n, 420)]);
        } },
        { cap: `<b>Group</b> the four terms in pairs.`, run: async (c2) => {
          L2.el.style.opacity = 1; await show(c2, l2lab);
          await Promise.all([
            anim(c2, L2.k.p1, [{ transform: 'translateX(-26px) scale(1.6)', opacity: 0 }, { transform: 'none', opacity: 1 }], 420),
            anim(c2, L2.k.p2, [{ transform: 'translateX(26px) scale(1.6)', opacity: 0 }, { transform: 'none', opacity: 1 }], 420),
            anim(c2, L2.k.p3, [{ transform: 'translateX(-26px) scale(1.6)', opacity: 0 }, { transform: 'none', opacity: 1 }], 420),
            anim(c2, L2.k.p4, [{ transform: 'translateX(26px) scale(1.6)', opacity: 0 }, { transform: 'none', opacity: 1 }], 420)]);
        } },
        { cap: `Take the <b>GCF</b> out of each pair: ${T(mono(g1, x))} and ${T(String(g2))}.${g2 < 0 ? ` Take out the <b>negative</b> ${T(String(g2))} so the brackets match.` : ''} Both brackets are ${T(B)}.`, run: async (c2) => {
          await show(c2, l3lab); L3.el.style.opacity = 1;
          L3.all.forEach((e) => { e.style.opacity = 0; });
          for (const k of ['g1', 'B1', 'og', 'g2', 'B2']) await pop(c2, L3.k[k], 260);
          await Promise.all([pulse(c2, L3.k.B1, 1.12), pulse(c2, L3.k.B2, 1.12)]);
        } },
        { cap: `<b>Factor out</b> the common bracket ${T(B)}: ${T(`${trin}=${B}${F2}`)}.${sameOrder}`, run: async (c2) => {
          await show(c2, l4lab); L4.el.style.opacity = 1;
          await Promise.all([fly(c2, stage, L3.k.B1, L4.k.B), fly(c2, stage, L3.k.B2, L4.k.B)]);
          await Promise.all([fly(c2, stage, L3.k.g1, L4.k.F), fly(c2, stage, L3.k.g2, L4.k.F)]);
          await pulse(c2, L4.el, 1.06);
        } },
        { cap: `<b>Check</b> with the area model: ${T(B)} by ${T(F2)} has exactly the four split terms.`, run: async (c2) => {
          ag.style.opacity = 1; await appear2(c2, ag);
          for (const e of aS) await show(c2, e, 180);
          for (const e of aT) await pop(c2, e, 240);
          await stampIn(c2, ok);
        } }
      ]);
    }
  };
}
const appear2 = (c, el) => anim(c, el, [{ opacity: 0 }, { opacity: 1 }], 300);
const HU = {
  long: { a: 12, b: 17, c: 6, v: 'x', split: [8, 9] },
  ex1: { a: 6, b: 19, c: 10, v: 'x', split: [15, 4], ans: '(3x+2)(2x+5)' },
  ex2a: { a: 3, b: 10, c: 8, v: 'x', split: [6, 4] },
  ex2b: { a: 5, b: 17, c: 6, v: 'x', split: [15, 2] },
  ex2c: { a: 4, b: 16, c: 15, v: 'x', split: [6, 10] }
};
const hunt = huntDef('The product–sum hunt', HU, [{ v: 'long', label: 'A long hunt: 12x² + 17x + 6' }, { sep: 'Check:' }, { v: 'ex1', label: 'Example 1' }, { v: 'ex2a', label: 'Ex 2(a)' }, { v: 'ex2b', label: 'Ex 2(b)' }, { v: 'ex2c', label: 'Ex 2(c)' }]);
const HN = {
  none: { a: 2, b: 3, c: 4, v: 'x' },
  ex3a: { a: 4, b: -4, c: -15, v: 'x', split: [-10, 6] },
  ex3b: { a: 6, b: -13, c: 6, v: 'a', split: [-4, -9] },
  ex3c: { a: 5, b: 13, c: -6, v: 'y', split: [15, -2] },
  ex4: { a: 3, b: -7, c: -6, v: 'x', split: [-9, 2], ans: '(3x+2)(x-3)' }
};
const huntNeg = huntDef('The hunt with negative terms', HN, [{ v: 'none', label: 'No pair? 2x² + 3x + 4' }, { sep: 'Check:' }, { v: 'ex3a', label: 'Ex 3(a)' }, { v: 'ex3b', label: 'Ex 3(b)' }, { v: 'ex3c', label: 'Ex 3(c)' }, { v: 'ex4', label: 'Example 4 by decomposition' }], { signs: true });

/* =============================== explainer: guess and check =============================== */
const GU = {
  ex4: { trin: '3x^2-7x-6', P: 3, R: 1, b: -7, tries: [[-2, 3], [2, -3]], notes: ['Right size, wrong sign: <b>switch the signs</b>.', ''] },
  demo: { trin: '2x^2+7x+3', P: 2, R: 1, b: 7, tries: [[3, 1], [1, 3]], notes: ['Too small. <b>Swap</b> the 3 and the 1.', ''] },
  many: { trin: '12x^2+17x+6', many: true }
};
const guess = {
  title: 'Guess and check',
  height: 420,
  choices: [{ v: 'demo', label: '2x² + 7x + 3' }, { v: 'many', label: 'Many factors: 12x² + 17x + 6' }, { sep: 'Check:' }, { v: 'ex4', label: 'Example 4' }],
  ask: (v) => `Factor ${T(GU[v].trin)} by guess and check.`,
  make(stage, v, ex) {
    const d = GU[v];
    if (d.many) return guessMany(stage, ex);
    const xs = (k) => mono(k, 'x'), sNum = (q) => `{}${q < 0 ? '-' : '+'}${Math.abs(q)}`;
    div(stage, 'u4l2-gtgt', `Target ${T(d.trin)} &nbsp;→&nbsp; middle term must be ${T(`\\textcolor{${GC}}{${xs(d.b)}}`)}`, 22, 14);
    const BX = 70, BY = 150;
    const L = mline(stage, BX, BY, [{ t: '(' }, { t: xs(d.P), id: 'P', cls: 'u4l2-cA' }, { t: '\\phantom{+0}', id: 'q1', cls: 'u4l2-slot' }, { t: ')(' }, { t: xs(d.R), id: 'R', cls: 'u4l2-cA' }, { t: '\\phantom{+0}', id: 'q2', cls: 'u4l2-slot' }, { t: ')' }], 'u4l2-gbig');
    const svg = svgEl('svg', { class: 'u4l2-ov', width: ex.W, height: 420 }, stage);
    const oLab = div(stage, 'u4l2-glab u4l2-cM', '', 0, 0), iLab = div(stage, 'u4l2-glab u4l2-cN', '', 0, 0);
    hide(oLab); hide(iLab);
    const sumL = hide(div(stage, 'u4l2-gsum', '', BX, 300));
    const logX = ex.W - 330, log = div(stage, 'u4l2-panel u4l2-glog', '<div class="u4l2-ph">Tries</div>', logX, 70, 310, 240);
    let arcs = [];
    const drawArcs = async (c, q1, q2) => {
      arcs.forEach((a) => a.remove()); arcs = [];
      const ctr = (el) => { const [x, y] = posIn(stage, el); return [x + el.offsetWidth / 2, y, y + el.offsetHeight]; };
      const [pX, pT, pB] = ctr(L.k.P), [q2X, , ] = ctr(L.k.q2), [q1X, , q1B] = ctr(L.k.q1), [rX] = ctr(L.k.R);
      const outer = svgEl('path', { d: `M${pX} ${pT - 4} C${pX} ${pT - 60}, ${q2X} ${pT - 60}, ${q2X} ${pT - 4}`, class: 'u4l2-arc u4l2-arcM' }, svg);
      const inner = svgEl('path', { d: `M${q1X} ${q1B + 4} C${q1X} ${q1B + 50}, ${rX} ${q1B + 50}, ${rX} ${q1B + 4}`, class: 'u4l2-arc u4l2-arcN' }, svg);
      arcs = [outer, inner];
      oLab.innerHTML = `outer ${T(`${xs(d.P)}\\cdot(${q2})=${xs(d.P * q2)}`)}`; oLab.style.left = (pX + q2X) / 2 + 'px'; oLab.style.top = (pT - 84) + 'px'; oLab.style.translate = '-50% 0';
      iLab.innerHTML = `inner ${T(`(${q1})\\cdot ${xs(d.R)}=${xs(q1 * d.R)}`)}`; iLab.style.left = (q1X + rX) / 2 + 'px'; iLab.style.top = (q1B + 50) + 'px'; iLab.style.translate = '-50% 0';
      await drawIn(outer, 400, c); await show(c, oLab, 200); await drawIn(inner, 400, c); await show(c, iLab, 200);
    };
    const steps = [{ cap: `${T(String(d.P))} is prime, so the first terms must be ${T(xs(d.P))} and ${T('x')}. The last terms multiply to ${T(String(d.tries[0][0] * d.tries[0][1]))}.`, run: (c) => pulse(c, L.el, 1.05) }];
    d.tries.forEach(([q1, q2], i) => {
      const mid = d.P * q2 + q1 * d.R, ok = mid === d.b;
      const tryT = `(${xs(d.P)}${sNum(q1)})(${xs(d.R)}${sNum(q2)})`;
      steps.push({ cap: `Try ${T(tryT)}.`, run: async (c) => {
        L.k.q1.innerHTML = T(sNum(q1)); L.k.q2.innerHTML = T(sNum(q2)); sumL.style.opacity = 0; oLab.style.opacity = 0; iLab.style.opacity = 0; arcs.forEach((a) => a.remove()); arcs = [];
        await Promise.all([pop(c, L.k.q1), pop(c, L.k.q2)]);
      } });
      steps.push({ cap: `Middle term = <b>outer</b> + <b>inner</b>: ${T(`${xs(d.P * q2)}${q1 * d.R < 0 ? '' : '+'}${xs(q1 * d.R)}=${xs(mid)}`)}.`, run: async (c) => {
        await drawArcs(c, q1, q2);
        sumL.innerHTML = `${T(`${xs(d.P * q2)}${q1 * d.R < 0 ? '' : '+'}${xs(q1 * d.R)}=${xs(mid)}`)} ${ok ? '<b class="u4l2-yes">✓</b>' : `<b class="u4l2-no">✗</b> need ${T(xs(d.b))}`}`;
        await show(c, sumL);
        const row = h('div', 'u4l2-glrow', `${T(tryT)} → ${T(xs(mid))} ${ok ? '✓' : '✗'}`); row.classList.add(ok ? 'u4l2-yes' : 'u4l2-no'); log.appendChild(row); await show(c, row, 200);
      } });
      if (!ok) steps.push({ cap: d.notes[i], run: (c) => pulse(c, sumL, 1.08) });
      else {
        const st = hide(stamp(stage, '✓', { x: BX + 470, y: BY + 30, size: 'lg' }));
        steps.push({ cap: `It works: ${T(`${d.trin}=${tryT.replace(/\{\}/g, '')}`)}. Quick to check by expanding in your head.`, run: (c) => stampIn(c, st) });
      }
    });
    return steps;
  }
};
function guessMany(stage, ex) {
  const firsts = [[12, 1], [6, 2], [4, 3]], lasts = [[1, 6], [6, 1], [2, 3], [3, 2]];
  const cw = (ex.W - 60) / 4, chh = 72, X0 = 20, Y0 = 92;
  div(stage, 'u4l2-gtgt', `Target ${T('12x^2+17x+6')} &nbsp;→&nbsp; middle term ${T(`\\textcolor{${GC}}{17x}`)}`, 22, 12);
  const info = hide(div(stage, 'u4l2-note', `First terms: ${T('12x\\cdot x')}, ${T('6x\\cdot 2x')}, ${T('4x\\cdot 3x')} (3 ways). Last terms: ${T('1,6')} · ${T('6,1')} · ${T('2,3')} · ${T('3,2')} (4 ways).`, 22, 50, ex.W - 40));
  const cards = [];
  firsts.forEach(([P, R], i) => lasts.forEach(([q, s], j) => {
    const mid = P * s + q * R, e = hide(div(stage, 'u4l2-gcard' + (mid === 17 ? ' u4l2-gcard-ok' : ''), `${T(`(${mono(P, 'x')}+${q})(${mono(R, 'x')}+${s})`)}<div>${T(`${mid}x`)} ${mid === 17 ? '✓' : '✗'}</div>`, X0 + j * (cw + 6), Y0 + i * (chh + 10), cw, chh));
    cards.push({ e, ok: mid === 17 });
  }));
  const panel = hide(div(stage, 'u4l2-note u4l2-key', `${T('3\\times4=12')} possible tries by guessing. The decomposition table for ${T('ac=72')} has only <b>6</b> rows, and the answer is the last one: ${T('8+9=17')}.`, 22, Y0 + 3 * (chh + 10) + 6, ex.W - 40));
  return [
    { cap: `${T('12')} and ${T('6')} both have <b>many</b> factors. Count the choices.`, run: (c) => show(c, info) },
    { cap: `Every combination, with its middle term. Most are wrong.`, run: async (c) => { for (const k of cards) await show(c, k.e, 120); } },
    { cap: `Only one works: ${T('(4x+3)(3x+2)')}. Guessing could take 12 tries.`, run: (c) => pulse(c, cards.find((k) => k.ok).e, 1.1) },
    { cap: `When ${T('a')} and ${T('c')} have many factors, <b>decomposition</b> is more reliable.`, run: (c) => show(c, panel) }
  ];
}

/* =============================== explainer: GCF first and negative leading coefficients =============================== */
const GF = {
  ex5a: { terms: [[12, 'x^2'], [2, 'x'], [-4, '']], g: '2', div: '\\div 2', inner: [[6, 'x^2'], [1, 'x'], [-2, '']], pill: 'ac=-12,\\ \\text{sum }1:\\ 4,\\ -3',
    lines: ['=2(6x^2+4x-3x-2)', '=2[2x(3x+2)-1(3x+2)]'], fin: '=2(3x+2)(2x-1)' },
  ex5b: { terms: [[-6, 'x^2'], [7, 'x'], [3, '']], g: '-1', neg: true, inner: [[6, 'x^2'], [-7, 'x'], [-3, '']], pill: 'ac=-18,\\ \\text{sum }-7:\\ -9,\\ 2',
    lines: ['=-(6x^2-9x+2x-3)', '=-[3x(2x-3)+1(2x-3)]'], fin: '=-(2x-3)(3x+1)' },
  ex5c: { given: [[8, ''], [2, 'x'], [-3, 'x^2']], terms: [[-3, 'x^2'], [2, 'x'], [8, '']], g: '-1', neg: true, inner: [[3, 'x^2'], [-2, 'x'], [-8, '']], pill: 'ac=-24,\\ \\text{sum }-2:\\ -6,\\ 4',
    lines: ['=-(3x^2-6x+4x-8)', '=-[3x(x-2)+4(x-2)]'], fin: '=-(x-2)(3x+4)', alt: '\\text{or, in ascending order, }(2-x)(4+3x)' },
  ex5d: { terms: [[18, 'x^3'], [-33, 'x^2'], [-30, 'x']], g: '3x', div: '\\div 3x', inner: [[6, 'x^2'], [-11, 'x'], [-10, '']], pill: 'ac=-60,\\ \\text{sum }-11:\\ -15,\\ 4',
    lines: ['=3x(6x^2-15x+4x-10)', '=3x[3x(2x-5)+2(2x-5)]'], fin: '=3x(2x-5)(3x+2)' }
};
const termTex = (k, m, i) => (i ? `${sgn(k)}${mono(Math.abs(k), m)}` : mono(k, m));
const gcf = {
  title: 'GCF first',
  height: 446, capH: 86,
  choices: [{ v: 'why', label: 'Why GCF first?' }, { sep: 'Check:' }, { v: 'ex5a', label: 'Ex 5(a)' }, { v: 'ex5b', label: 'Ex 5(b)' }, { v: 'ex5c', label: 'Ex 5(c)' }, { v: 'ex5d', label: 'Ex 5(d)' }],
  ask: (v) => (v === 'why' ? `Factor ${T('12x^2+2x-4')} with and without taking out the GCF first.` : `Factor fully: ${T(poly(GF[v].given || GF[v].terms))}`),
  make(stage, v, ex) {
    if (v === 'why') return gcfWhy(stage, ex);
    const d = GF[v], TW = 128, TG = 26, TX = 30, TY = 18;
    const tiles = (d.given || d.terms).map(([k, m], i) => div(stage, 'u4l2-tile', T(termTex(k, m, i)), TX + i * (TW + TG), TY, TW, 54));
    const steps = [];
    if (d.given) {
      // reorder: the tile with x^2 moves first
      const order = d.terms.map(([k, m]) => d.given.findIndex(([k2, m2]) => k2 === k && m2 === m));
      steps.push({ cap: `First write it in <b>descending order</b>: ${T(poly(d.terms))}.`, run: async (c) => {
        await Promise.all(order.map((gi, ni) => anim(c, tiles[gi], [{ transform: 'none' }, { transform: `translateX(${(ni - gi) * (TW + TG)}px)` }], 650)));
        order.forEach((gi, ni) => { tiles[gi].innerHTML = T(termTex(d.terms[ni][0], d.terms[ni][1], ni)); });
      } });
    }
    const qs = d.inner.map(([k, m], i) => hide(div(stage, 'u4l2-tile u4l2-tile-q' + (d.neg ? ' u4l2-tile-flip' : ''), T(termTex(k, m, i)), TX + i * (TW + TG), TY + 104, TW, 54)));
    const arr = d.inner.map((x, i) => hide(div(stage, 'u4l2-tarr', d.neg ? T('\\div(-1)') : T(d.div), TX + i * (TW + TG), TY + 64, TW)));
    const gB = hide(div(stage, 'u4l2-gbadge', d.neg ? `${T('a<0')}: take out ${T('-1')}` : `GCF ${T('=' + d.g)}`, TX + 3 * (TW + TG) + 10, TY + 10));
    const pre = d.neg ? '-' : d.g;
    const LX = 40, LY = 196, LS = 50;
    const l0 = hide(div(stage, 'u4l2-wl', T(`=${pre}(${poly(d.inner)})`), LX, LY));
    const pill = hide(div(stage, 'u4l2-pill u4l2-pill-p', T(d.pill), 480, LY + 4));
    const ls = d.lines.map((s, i) => hide(div(stage, 'u4l2-wl', T(s), LX, LY + LS * (i + 1))));
    const fin = hide(div(stage, 'u4l2-wl u4l2-wfin', T(d.fin), LX, LY + LS * 3));
    const alt = d.alt ? hide(div(stage, 'u4l2-wl u4l2-walt', T(d.alt), LX + 360, LY + LS * 3 + 4)) : null;
    steps.push({ cap: d.neg ? `The leading coefficient is <b>negative</b>, so take out ${T('-1')}: <b>every sign flips</b>.` : `Every term has the factor ${T(d.g)}: that is the <b>GCF</b>. Take it out first.`, run: (c) => show(c, gB) });
    steps.push({ cap: d.neg ? `Divide each term by ${T('-1')}: ${d.inner.map(([k, m], i) => T(termTex(k, m, 0))).join(', ')}.` : `Divide each term by ${T(d.g)}.`, run: async (c) => {
      for (let i = 0; i < qs.length; i++) {
        await show(c, arr[i], 200);
        if (d.neg) await anim(c, qs[i], [{ opacity: 0, transform: 'rotateX(90deg)' }, { opacity: 1, transform: 'none' }], 420);
        else await pop(c, qs[i], 300);
      }
    } });
    steps.push({ cap: `So ${T(`${poly(d.terms)}=${pre}(${poly(d.inner)})`)}. The trinomial left is smaller.`, run: (c) => show(c, l0) });
    steps.push({ cap: `Decompose the trinomial in the brackets: ${T(d.pill.replace(/\\ /g, ' '))}.`, run: async (c) => { await show(c, pill); await show(c, ls[0]); } });
    steps.push({ cap: `Group and take out the common factors. Keep the ${d.neg ? T('-') : T(d.g)} in front.`, run: (c) => show(c, ls[1]) });
    steps.push({ cap: `Fully factored: ${T(d.fin.slice(1))}.`, run: async (c) => { await show(c, fin); await pulse(c, fin, 1.06); } });
    if (alt) steps.push({ cap: `In ascending order, put the ${T('-')} into the first bracket: ${T('-(x-2)=(2-x)')}, so ${T('(2-x)(4+3x)')} is also right.`, run: (c) => show(c, alt) });
    return steps;
  }
};
function gcfWhy(stage, ex) {
  const half = (ex.W - 30) / 2, LX = 14, RX = 14 + half + 10;
  const pa = div(stage, 'u4l2-panel u4l2-pbad', '<div class="u4l2-ph">Without the GCF</div>', LX, 10, half, 424);
  const pb = div(stage, 'u4l2-panel u4l2-pgood', '<div class="u4l2-ph">GCF first</div>', RX, 10, half, 424);
  const P1 = signedPairs(-48, 2), P2 = signedPairs(-12, 1), f1 = P1.findIndex(([m, n]) => m + n === 2), f2 = P2.findIndex(([m, n]) => m + n === 1);
  const a0 = div(pa, 'u4l2-wl u4l2-wl-sm', T('12x^2+2x-4,\\quad ac=-48'), 14, 40);
  const t1 = pairTable(pa, 14, 72, P1, { rh: 30, w: 250, sm: true }); hide(t1.el);
  const a1 = hide(div(pa, 'u4l2-wl u4l2-wl-sm', T('12x^2-6x+8x-4'), 14, 266));
  const a2 = hide(div(pa, 'u4l2-wl u4l2-wl-sm', T('=6x(2x-1)+4(2x-1)'), 14, 304));
  const a3 = hide(div(pa, 'u4l2-wl u4l2-wl-sm', T('=(2x-1)(6x+4)'), 14, 342));
  const bad = hide(stamp(pa, 'not fully factored', { x: half / 2 + 60, y: 392, ok: false, size: 'sm' }));
  const b0 = hide(div(pb, 'u4l2-wl u4l2-wl-sm', T('=2(6x^2+x-2),\\quad ac=-12'), 14, 40));
  const t2 = pairTable(pb, 14, 72, P2, { rh: 30, w: 250, sm: true }); hide(t2.el);
  const b1 = hide(div(pb, 'u4l2-wl u4l2-wl-sm', T('=2(6x^2+4x-3x-2)'), 14, 266));
  const b2 = hide(div(pb, 'u4l2-wl u4l2-wl-sm', T('=2[2x(3x+2)-1(3x+2)]'), 14, 304));
  const b3 = hide(div(pb, 'u4l2-wl u4l2-wl-sm u4l2-wfin', T('=2(3x+2)(2x-1)'), 14, 342));
  const good = hide(stamp(pb, 'fully factored', { x: half / 2 + 60, y: 392, size: 'sm' }));
  return [
    { cap: `Without the GCF, ${T('ac=12\\times(-4)=-48')}: five factor pairs to check.`, run: async (c) => { await show(c, t1.el); await huntRows(c, t1, P1, 2, f1, 260); } },
    { cap: `${T('-6+8=2')}. Split, group, factor: ${T('(2x-1)(6x+4)')}.`, run: async (c) => { await show(c, a1); await show(c, a2); await show(c, a3); } },
    { cap: `<b>Not finished!</b> ${T('6x+4')} still has a common factor: ${T('6x+4=2(3x+2)')}.`, run: (c) => stampIn(c, bad) },
    { cap: `GCF first: ${T('12x^2+2x-4=2(6x^2+x-2)')}. Now ${T('ac=-12')}.`, run: (c) => show(c, b0) },
    { cap: `Smaller numbers, fewer pairs: ${T('-3+4=1')} ✓`, run: async (c) => { await show(c, t2.el); await huntRows(c, t2, P2, 1, f2, 260); } },
    { cap: `${T('=2(3x+2)(2x-1)')}: <b>fully factored</b>, and the same as ${T('(2x-1)(6x+4)')} once the 2 is taken out.`, run: async (c) => { await show(c, b1); await show(c, b2); await show(c, b3); await stampIn(c, good); } }
  ];
}

/* =============================== explainer: two variables with the area model in reverse =============================== */
const BM = {
  demo: { a: 4, b: 8, c: 3, v: 'x', w: 'y', split: [2, 6] },
  ex6a: { a: 3, b: 7, c: -6, v: 'x', w: 'y', split: [9, -2] },
  ex6b: { a: 10, b: -23, c: 12, v: 'a', w: 'b', split: [-8, -15] }
};
const boxMethod = {
  title: 'Two variables: the area model in reverse',
  height: 410,
  choices: [{ v: 'demo', label: '4x² + 8xy + 3y²' }, { sep: 'Check:' }, { v: 'ex6a', label: 'Ex 6(a)' }, { v: 'ex6b', label: 'Ex 6(b)' }],
  ask: (v) => { const d = BM[v]; return `Factor ${T(poly([[d.a, d.v + '^2'], [d.b, d.v + d.w], [d.c, d.w + '^2']]))}.`; },
  make(stage, v, ex) {
    const d = BM[v], { a, b, c } = d, X = d.v, Y = d.w, XY = X + Y, X2 = X + '^2', Y2 = Y + '^2', [m, n] = d.split;
    const g1 = gcd(a, m), t0 = a / g1, t1 = m / g1, g2 = n / t0;
    const trin = poly([[a, X2], [b, XY], [c, Y2]]);
    const pill = hide(div(stage, 'u4l2-pill u4l2-pill-p', T(`ac=${a * c},\\ \\text{sum }${b}:\\ ${m},\\ ${n}`), 22, 16));
    const BX = 130, BY = 104, cw = [170, 170], ch = [100, 100];
    const svg = svgEl('svg', { class: 'u4l2-ov', width: ex.W, height: 410 }, stage);
    const cx = [BX, BX + cw[0]], cy = [BY, BY + ch[0]];
    [[0, 0], [1, 0], [0, 1], [1, 1]].forEach(([i, j], k) => svgEl('rect', { x: cx[i], y: cy[j], width: cw[i], height: ch[j], class: 'u4l2-cell u4l2-cell' + k }, svg));
    const ct = (i, j, s, cl) => { const e = hide(div(stage, 'u4l2-cellt ' + cl, T(s), cx[i] + cw[i] / 2, cy[j] + ch[j] / 2)); e.style.translate = '-50% -50%'; return e; };
    const cA = ct(0, 0, mono(a, X2), 'u4l2-cA'), cD = ct(1, 1, mono(c, Y2), 'u4l2-cA'), cM = ct(1, 0, mono(m, XY), 'u4l2-cM'), cN = ct(0, 1, mono(n, XY), 'u4l2-cN');
    const sd = (s, px, py, cl = '') => { const e = hide(div(stage, 'u4l2-side ' + cl, T(s), px, py)); e.style.translate = '-50% 0'; return e; };
    const sL1 = sd(mono(g1, X), BX - 50, cy[0] + ch[0] / 2 - 16, 'u4l2-cM'), sL2 = sd(mono(g2, Y), BX - 50, cy[1] + ch[1] / 2 - 16, 'u4l2-cN');
    const sT1 = sd(mono(t0, X), cx[0] + cw[0] / 2, BY - 40, 'u4l2-cG'), sT2 = sd(mono(t1, Y), cx[1] + cw[1] / 2, BY - 40, 'u4l2-cG');
    const fin = hide(div(stage, 'u4l2-wl u4l2-wfin', T(`${trin}=${bin(t0, X, t1, Y)}${bin(g1, X, g2, Y)}`), 22, BY + 2 * ch[0] + 30));
    const RX = BX + 2 * cw[0] + 60, RW = ex.W - RX - 16;
    const p = div(stage, 'u4l2-panel', '<div class="u4l2-ph">The same by grouping</div>', RX, 70, RW, 236);
    const g1l = hide(div(p, 'u4l2-pl', T(poly([[a, X2], [m, XY], [n, XY], [c, Y2]]))));
    const g2l = hide(div(p, 'u4l2-pl', T(`=${mono(g1, X)}${bin(t0, X, t1, Y)}${g2 < 0 ? '-' : '+'}${mono(Math.abs(g2), Y)}${bin(t0, X, t1, Y)}`)));
    const g3l = hide(div(p, 'u4l2-pl', T(`=${bin(t0, X, t1, Y)}${bin(g1, X, g2, Y)}`)));
    return [
      { cap: `Decompose exactly as before: product ${T(`ac=${a * c}`)}, sum ${T(`${b}`)}: ${T(`${m}`)} and ${T(`${n}`)}. The middle term splits into ${T(mono(m, XY))} and ${T(mono(n, XY))}.`, run: (c2) => show(c2, pill) },
      { cap: `The <b>corners</b> of the area model are the first and last terms: ${T(mono(a, X2))} and ${T(mono(c, Y2))}.`, run: async (c2) => { await pop(c2, cA); await pop(c2, cD); } },
      { cap: `The two split terms go in the other two cells.`, run: async (c2) => { await pop(c2, cM); await pop(c2, cN); await show(c2, g1l); } },
      { cap: `Top row: the GCF of ${T(mono(a, X2))} and ${T(mono(m, XY))} is ${T(mono(g1, X))}. Divide to get the top sides ${T(mono(t0, X))} and ${T(mono(t1, Y))}.`, run: async (c2) => { await pop(c2, sL1); await show(c2, sT1); await show(c2, sT2); } },
      { cap: `Bottom row: ${T(`${mono(n, XY)}\\div ${mono(t0, X)}=${mono(g2, Y)}`)}. Check the corner: ${T(`(${mono(g2, Y)})(${mono(t1, Y)})=${mono(c, Y2)}`)} ✓`, run: async (c2) => { await pop(c2, sL2); await pulse(c2, cD, 1.15); await show(c2, g2l); } },
      { cap: `Read the sides: ${T(`${bin(t0, X, t1, Y)}${bin(g1, X, g2, Y)}`)}. Each binomial has an ${T(X)}-term and a ${T(Y)}-term.`, run: async (c2) => { await show(c2, fin); await show(c2, g3l); } }
    ];
  }
};

/* =============================== explainer: rational coefficients =============================== */
const FMS = ['x^2', 'x', ''];
const coT = (n, dd, i) => { const sg = n < 0 ? '-' : i ? '+' : '', a = Math.abs(n); return sg + (dd === 1 ? (a === 1 && FMS[i] ? '' : String(a)) : `\\tfrac{${a}}{${dd}}`) + FMS[i]; };
const fr = (n, d) => (d === 1 ? String(n) : `${n < 0 ? '-' : ''}\\tfrac{${Math.abs(n)}}{${d}}`);
const FR = {
  key: { co: [[1, 2], [-1, 1], [-4, 1]], out: [1, 2], by: '\\times 2', why: `${T('\\div\\tfrac12')} is ${T('\\times 2')}`, inner: [1, -2, -8], pill: '\\text{product }-8,\\ \\text{sum }-2:\\ -4,\\ 2', fin: '\\tfrac{1}{2}(x-4)(x+2)' },
  ex7a: { co: [[1, 2], [1, 1], [-12, 1]], out: [1, 2], by: '\\times 2', why: `${T('\\div\\tfrac12')} is ${T('\\times 2')}`, inner: [1, 2, -24], pill: '\\text{product }-24,\\ \\text{sum }2:\\ 6,\\ -4', fin: '\\tfrac{1}{2}(x+6)(x-4)' },
  ex7b: { co: [[3, 4], [-3, 1], [-24, 1]], out: [3, 4], by: '\\times\\tfrac43', why: `${T('\\div\\tfrac34')} is ${T('\\times\\tfrac43')}: ${T('3\\div\\tfrac34=4')}, ${T('24\\div\\tfrac34=32')}`, inner: [1, -4, -32], pill: '\\text{product }-32,\\ \\text{sum }-4:\\ -8,\\ 4', fin: '\\tfrac{3}{4}(x-8)(x+4)' },
  ex7c: { co: [[1, 2], [5, 4], [1, 2]], out: [1, 4], lcd: true, by: '\\times 4', why: `denominators 2, 4, 2: LCD 4, take out ${T('\\tfrac14')}`, inner: [2, 5, 2], pill: 'ac=4,\\ \\text{sum }5:\\ 4,\\ 1', fin: '\\tfrac{1}{4}(2x+1)(x+2)' }
};
const fracs = {
  title: 'Taking out a fraction',
  height: 420,
  choices: [{ v: 'key', label: '½x² − x − 4' }, { sep: 'Check:' }, { v: 'ex7a', label: 'Ex 7(a)' }, { v: 'ex7b', label: 'Ex 7(b)' }, { v: 'ex7c', label: 'Ex 7(c)' }],
  ask: (v) => `Factor fully: ${T(FR[v].co.map(([n, dd], i) => coT(n, dd, i)).join(''))}`,
  make(stage, v, ex) {
    const d = FR[v], ms = ['x^2', 'x', ''], TW = 150, TG = 34, TX = 40, TY = 20;
    const outT = fr(d.out[0], d.out[1]);
    const tiles = d.co.map(([n, dd], i) => div(stage, 'u4l2-tile', T(coT(n, dd, i)), TX + i * (TW + TG), TY, TW, 60));
    const arr = d.co.map((x, i) => hide(div(stage, 'u4l2-tarr', T(d.by), TX + i * (TW + TG), TY + 70, TW)));
    const qs = d.inner.map((k, i) => hide(div(stage, 'u4l2-tile u4l2-tile-q', T(termTex(k, ms[i], i)), TX + i * (TW + TG), TY + 106, TW, 56)));
    const whyB = hide(div(stage, 'u4l2-gbadge u4l2-gbadge-w', `take out ${T(outT)}: ${d.why}`, TX + 3 * (TW + TG) - 6, TY + 10, ex.W - (TX + 3 * (TW + TG)) - 14));
    const inner = poly(d.inner.map((k, i) => [k, ms[i]]));
    const LX = 40, LY = 214;
    const l0 = hide(div(stage, 'u4l2-wl', T(`=${outT}(${inner})`), LX, LY));
    const pill = hide(div(stage, 'u4l2-pill u4l2-pill-p', T(d.pill), 420, LY + 4));
    const fin = hide(div(stage, 'u4l2-wl u4l2-wfin', T(`=${d.fin}`), LX, LY + 58));
    const par = (k, m) => (k < 0 ? `(${mono(k, m)})` : mono(k, m));
    const chk = hide(div(stage, 'u4l2-note', `<b>Check:</b> ${d.inner.map((k, i) => T(`${outT}\\times ${par(k, ms[i])}=${coT(d.co[i][0], d.co[i][1], 0)}`)).join(', &nbsp;')}: the original terms ✓`, LX, LY + 128, ex.W - 2 * LX));
    const steps = [];
    steps.push({ cap: d.lcd ? `The denominators are 2, 4 and 2. Their LCD is 4, so take out ${T('\\tfrac14')}: integers will be left in the brackets.` : `Take out ${T(outT)}, the fraction in front of ${T('x^2')}, so integers are left in the brackets.`, run: (c) => show(c, whyB) });
    steps.push({ cap: `Divide each term by ${T(outT)}: that is the same as ${T(d.by)}.`, run: async (c) => { for (let i = 0; i < 3; i++) { await show(c, arr[i], 200); await pop(c, qs[i], 300); } } });
    steps.push({ cap: `${T(`${coT(d.co[0][0], d.co[0][1], 0)}${d.co.slice(1).map(([n, dd], i) => coT(n, dd, i + 1)).join('')}=${outT}(${inner})`)}.`, run: (c) => show(c, l0) });
    steps.push({ cap: `Factor the trinomial in the brackets: ${T(d.pill)}.`, run: async (c) => { await show(c, pill); await show(c, fin); await pulse(c, fin, 1.05); } });
    steps.push({ cap: `Check: multiply each term in the brackets by ${T(outT)} to get the original terms back.`, run: (c) => show(c, chk) });
    return steps;
  }
};

/* =============================== explainer: perfect squares as a square =============================== */
const SQ = {
  gen: { A: 'A', B: 'B', cells: ['A^2', 'AB', 'AB', 'B^2'], sum: 'A^2+2AB+B^2' },
  ex8i: { A: '3x', B: '2', cells: ['9x^2', '6x', '6x', '4'], sum: '9x^2+12x+4', tA: '(3x)^2', mid: '2(3x)(2)=12x' },
  ex8iii: { A: '5x', B: '-2y', cells: ['25x^2', '-10xy', '-10xy', '4y^2'], sum: '25x^2-20xy+4y^2', tA: '(5x)^2', mid: '2(5x)(-2y)=-20xy', neg: true },
  ex9c: { A: '2x', B: '7', cells: ['4x^2', '14x', '14x', '49'], sum: '4x^2+28x+49', tile: true, mid: '2(2x)(7)=28x' }
};
const squareModel = {
  title: 'A perfect square is a square',
  height: 410,
  choices: [{ v: 'gen', label: '(A + B)²' }, { sep: 'Check:' }, { v: 'ex8i', label: 'Ex 8(a)(i)' }, { v: 'ex8iii', label: 'Ex 8(a)(iii)' }, { v: 'ex9c', label: 'Ex 9(c) floor tile' }],
  ask: (v) => (v === 'gen' ? `Draw ${T('(A+B)^2')} as a square.` : v === 'ex9c' ? `A square tile has area ${T('(4x^2+28x+49)')} cm². Find its side, then its side and perimeter when ${T('x=3')}.` : `Draw ${T(`(${SQ[v].A}${SQ[v].neg ? '' : '+'}${SQ[v].B})^2`)} as a square.`),
  make(stage, v, ex) {
    const d = SQ[v], X0 = 70, Y0 = 50, a = 206, b = 126;
    const svg = svgEl('svg', { class: 'u4l2-ov', width: ex.W, height: 410 }, stage);
    const cx = [X0, X0 + a], cy = [Y0, Y0 + a], sz = [a, b];
    const cl = ['u4l2-sqA', 'u4l2-sqAB', 'u4l2-sqAB', 'u4l2-sqB'];
    const rects = [[0, 0], [1, 0], [0, 1], [1, 1]].map(([i, j], k) => { const r = svgEl('rect', { x: cx[i], y: cy[j], width: sz[i], height: sz[j], class: 'u4l2-sq ' + cl[k] }, svg); r.style.opacity = 0; return r; });
    svgEl('rect', { x: X0, y: Y0, width: a + b, height: a + b, class: 'u4l2-sqframe' }, svg);
    const sd = (s, px, py) => { const e = div(stage, 'u4l2-side', T(s), px, py); e.style.translate = '-50% 0'; return e; };
    const sides = [sd(d.A, X0 + a / 2, Y0 - 40), sd(d.B, X0 + a + b / 2, Y0 - 40), sd(d.A, X0 - 40, Y0 + a / 2 - 16), sd(d.B, X0 - 40, Y0 + a + b / 2 - 16)];
    const ct = [[0, 0], [1, 0], [0, 1], [1, 1]].map(([i, j], k) => { const e = hide(div(stage, 'u4l2-cellt ' + ['u4l2-cA', 'u4l2-cP', 'u4l2-cP', 'u4l2-cA'][k], T(d.cells[k]), cx[i] + sz[i] / 2, cy[j] + sz[j] / 2)); e.style.translate = '-50% -50%'; return e; });
    const RX = X0 + a + b + 70, RW = ex.W - RX - 16;
    const p = div(stage, 'u4l2-panel', '', RX, 34, RW, 340);
    const sq = `(${d.A}${d.neg ? '' : '+'}${d.B})^2`;
    const p1 = hide(div(p, 'u4l2-pl', T(`${sq}=${d.cells[0]}${d.neg ? '' : '+'}${d.cells[1]}${d.neg ? '' : '+'}${d.cells[2]}+${d.cells[3]}`)));
    const p2 = hide(div(p, 'u4l2-pl u4l2-pl-big', T(`=${d.sum}`)));
    const p3 = hide(div(p, 'u4l2-pl u4l2-key', d.tile ? `${T('4x^2+28x+49=(2x+7)^2')}: the side is ${T('(2x+7)')} cm.` : `First and last: squares ${T(`(${d.A})^2`)} and ${T(`(${d.B})^2`)}. Middle: ${T(`2(${d.A})(${d.B})`)}.`));
    const p4 = d.tile ? hide(div(p, 'u4l2-pl', `When ${T('x=3')}: side ${T('2(3)+7=13')} cm<br>perimeter ${T('4(13)=52')} cm<br>area ${T('13^2=169')} cm² <span class="muted">(${T('36+42+42+49=169')} ✓)</span>`)) : null;
    const steps = [
      { cap: `A square with side ${T(`${d.A}${d.neg ? '' : '+'}${d.B}`)}, cut the same way both ways.`, run: (c) => pulse(c, sides[0], 1.15) },
      { cap: `The big corner is ${T(`(${d.A})^2=${d.cells[0]}`)}; the small corner is ${T(`(${d.B})^2=${d.cells[3]}`)}${d.neg ? ` (a negative squared is <b>positive</b>)` : ''}.`, run: async (c) => { rects[0].style.opacity = 1; rects[3].style.opacity = 1; await pop(c, ct[0]); await pop(c, ct[3]); } },
      { cap: `The other two cells are <b>twins</b>: both ${T(`(${d.A})(${d.B})=${d.cells[1]}`)}. Together they make ${T('2AB')}.`, run: async (c) => { rects[1].style.opacity = 1; rects[2].style.opacity = 1; await Promise.all([pop(c, ct[1]), pop(c, ct[2])]); await show(c, p1); } },
      { cap: `Add them: ${T(`${sq}=${d.sum}`)}.`, run: async (c) => { await show(c, p2); } },
      { cap: d.tile ? `Backwards: ${T('4x^2=(2x)^2')}, ${T('49=7^2')}, ${T(d.mid)} ✓. The tile is a square of side ${T('(2x+7)')} cm.` : `The test for a perfect square: first and last terms are squares, and the middle term is ${T('\\pm2AB')}.`, run: (c) => show(c, p3) }
    ];
    if (d.tile) steps.push({ cap: `When ${T('x=3')}: side ${T('13')} cm, perimeter ${T('52')} cm (area ${T('169')} cm²).`, run: async (c) => {
      sides[0].innerHTML = T('6'); sides[2].innerHTML = T('6'); sides[1].innerHTML = T('7'); sides[3].innerHTML = T('7');
      ['36', '42', '42', '49'].forEach((s, k) => { ct[k].innerHTML = T(s); });
      await Promise.all(ct.map((e) => pulse(c, e, 1.12))); await show(c, p4);
    } });
    return steps;
  }
};

/* =============================== explainer: the perfect-square test =============================== */
const PS = {
  i: { trin: '9x^2+12x+4', rows: [['First term a square?', '9x^2=(3x)^2', true, 'A=3x'], ['Last term a square (and positive)?', '4=2^2', true, 'B=2'], ['Middle term', '2(3x)(2)=12x', true, '']], res: '(3x+2)^2' },
  ii: { trin: 'x^2-10x+16', rows: [['First term a square?', 'x^2=(x)^2', true, 'A=x'], ['Last term a square (and positive)?', '16=4^2', true, 'B=4'], ['Middle term', '2(x)(4)=8x\\ne10x', false, '']], res: null, note: `It still factors, ${T('(x-2)(x-8)')}, just not as a square.` },
  iii: { trin: '25x^2-20xy+4y^2', rows: [['First term a square?', '25x^2=(5x)^2', true, 'A=5x'], ['Last term a square (and positive)?', '4y^2=(2y)^2', true, 'B=2y'], ['Middle term', '2(5x)(2y)=20xy', true, '\\text{minus}']], res: '(5x-2y)^2' },
  iv: { trin: '4x^2+6x+9', rows: [['First term a square?', '4x^2=(2x)^2', true, 'A=2x'], ['Last term a square (and positive)?', '9=3^2', true, 'B=3'], ['Middle term', '2(2x)(3)=12x\\ne6x', false, '']], res: null },
  neg: { trin: 'x^2+6x-9', rows: [['First term a square?', 'x^2=(x)^2', true, 'A=x'], ['Last term a square (and positive)?', '-9\\text{ is negative}', false, '']], res: null, note: `A square is never negative, so the last term of a perfect square is <b>positive</b>.` },
  ex9a: { trin: '64x^2-48x+9', rows: [['First term a square?', '64x^2=(8x)^2', true, 'A=8x'], ['Last term a square (and positive)?', '9=3^2', true, 'B=3'], ['Middle term', '2(8x)(3)=48x', true, '\\text{minus}']], res: '(8x-3)^2' },
  ex9b: { trin: '2x^3+20x^2+50x', gcf: '2x(x^2+10x+25)', rows: [['First term a square?', 'x^2=(x)^2', true, 'A=x'], ['Last term a square (and positive)?', '25=5^2', true, 'B=5'], ['Middle term', '2(x)(5)=10x', true, '']], res: '2x(x+5)^2' }
};
const psTest = {
  title: 'Is it a perfect square?',
  height: 380,
  choices: [{ v: 'neg', label: 'x² + 6x − 9' }, { sep: 'Check:' }, { v: 'i', label: '8(a)(i)' }, { v: 'ii', label: '(ii)' }, { v: 'iii', label: '(iii)' }, { v: 'iv', label: '(iv)' }, { v: 'blank', label: '8(b) blanks' }, { v: 'ex9a', label: '9(a)' }, { v: 'ex9b', label: '9(b)' }],
  ask: (v) => (v === 'blank' ? 'Fill in the blank so that each trinomial is a perfect square.' : v === 'ex9b' ? `Factor fully: ${T(PS[v].trin)}` : `Is ${T(PS[v].trin)} a perfect-square trinomial?`),
  make(stage, v, ex) {
    if (v === 'blank') return psBlanks(stage, ex);
    const d = PS[v], steps = [];
    const top = div(stage, 'u4l2-wl u4l2-big', T(d.trin), 26, 14);
    const gl = d.gcf ? hide(div(stage, 'u4l2-wl', T('=' + d.gcf), 360, 20)) : null;
    if (gl) steps.push({ cap: `GCF first: ${T(`${d.trin}=${d.gcf}`)}. Test the trinomial in the brackets.`, run: (c) => show(c, gl) });
    const RY = 82, RH = 64;
    d.rows.forEach(([q, w, ok, note], i) => {
      const r = hide(div(stage, 'u4l2-psrow', `<div class="u4l2-psq">${q}</div><div class="u4l2-psw">${T(w)}</div><div class="u4l2-psn">${note ? T(note) : ''}</div><div class="u4l2-psm ${ok ? 'u4l2-yes' : 'u4l2-no'}">${ok ? '✓' : '✗'}</div>`, 26, RY + i * RH, ex.W - 52, RH - 10));
      steps.push({ cap: i === 2 ? `Is the middle term ${T('2AB')}? ${T(w)}${ok ? (note ? ` ✓, and it is <b>negative</b>, so the bracket has a minus.` : ' ✓') : ': <b>no</b>.'}` : `${q} ${T(w)}${ok ? ` ✓ &nbsp; ${T(note)}` : ': <b>no</b>.'}`, run: (c) => show(c, r) });
    });
    const yes = !!d.res, st = hide(stamp(stage, yes ? 'perfect square' : 'not a perfect square', { x: 180, y: RY + 3 * RH + 40, ok: yes }));
    const res = yes ? hide(div(stage, 'u4l2-wl u4l2-wfin', T(`${d.trin}=${d.res}`), 380, RY + 3 * RH + 20)) : (d.note ? hide(div(stage, 'u4l2-note', d.note, 380, RY + 3 * RH + 10, ex.W - 410)) : null);
    steps.push({ cap: yes ? `<b>Yes:</b> ${T(`${d.trin}=${d.res}`)}.` : `<b>No</b>, it is not a perfect square.${d.note ? ' ' + d.note : ''}`, run: async (c) => { await stampIn(c, st); if (res) await show(c, res); } });
    return steps;
  }
};
function psBlanks(stage, ex) {
  const rows = [
    { q: 'x^2-\\boxed{\\phantom{18x}}+81', w: 'A=x,\\ B=9:\\ 2AB=2(x)(9)=18x', a: 'x^2-\\boxed{18x}+81' },
    { q: '16x^2+40x+\\boxed{\\phantom{25}}', w: 'A=4x:\\ 40x=2(4x)B\\Rightarrow B=5,\\ B^2=25', a: '16x^2+40x+\\boxed{25}' },
    { q: '\\boxed{\\phantom{9x^2}}+42x+49', w: 'B=7:\\ 42x=2A(7)\\Rightarrow A=3x,\\ A^2=9x^2', a: '\\boxed{9x^2}+42x+49' }
  ];
  const steps = [];
  rows.forEach((r, i) => {
    const y = 26 + i * 112;
    const q = div(stage, 'u4l2-wl', T(r.q), 30, y);
    const w = hide(div(stage, 'u4l2-pill u4l2-pill-p', T(r.w), 360, y + 4));
    steps.push({ cap: `${T(r.w)}.`, run: async (c) => { await show(c, w); q.innerHTML = T(r.a); await pop(c, q, 360); } });
  });
  return steps;
}

/* =============================== Stand Up Break =============================== */
const lin = (p, q, X = 'x') => bin(p, X, q);
function makeTri(r, signed) {
  for (let tries = 0; tries < 200; tries++) {
    const p = r.pick([1, 2, 3, 5]), rr = r.pick([1, 2, 3, 4, 5]);
    if (p * rr === 1 || p * rr > 20) continue;
    const q = signed ? r.int(1, 7) * r.sign() : r.int(1, 7), s = signed ? r.int(1, 7) * r.sign() : r.int(1, 7);
    if (gcd(p, q) !== 1 || gcd(rr, s) !== 1) continue;
    const a = p * rr, b = p * s + q * rr, c = q * s;
    if (b === 0) continue;
    return { p, q, rr, s, a, b, c, m: p * s, n: q * rr };
  }
  return { p: 2, q: 1, rr: 1, s: 3, a: 2, b: 7, c: 3, m: 6, n: 1 };
}
const triSteps = (t, X = 'x') => {
  const X2 = X + '^2', { a, b, c, m, n, p, q, rr, s } = t;
  return [
    `ac=${a * c},\\ \\text{sum }${b}:\\ ${m},\\ ${n}`,
    `${poly([[a, X2], [m, X], [n, X], [c, '']])}`,
    `=${mono(p, X)}${lin(rr, s, X)}${q < 0 ? '-' : '+'}${Math.abs(q)}${lin(rr, s, X)}`,
    `=${lin(rr, s, X)}${lin(p, q, X)}`
  ];
};
standup('u4l2', {
  intro: 'At your whiteboard: find two numbers with product ac and sum b, split the middle term, group, and check by expanding.',
  levels: {
    BEG: (r) => { const t = makeTri(r, false), X = r.pick(['x', 'x', 'm', 'n']); return { q: `\\text{Factor: }${poly([[t.a, X + '^2'], [t.b, X], [t.c, '']])}`, a: triSteps(t, X) }; },
    PRG: (r) => { const t = makeTri(r, true), X = r.pick(['x', 'x', 'a', 'y']); return { q: `\\text{Factor: }${poly([[t.a, X + '^2'], [t.b, X], [t.c, '']])}`, a: triSteps(t, X) }; },
    MAS: (r) => {
      const t = makeTri(r, true), k = r.pick([2, 3, 5, -1, -2, -3]), X = 'x';
      const full = poly([[k * t.a, X + '^2'], [k * t.b, X], [k * t.c, '']]), pre = k === -1 ? '-' : String(k);
      const st = triSteps(t, X);
      return { q: `\\text{Factor fully: }${full}`,
        a: [`=${pre}(${poly([[t.a, X + '^2'], [t.b, X], [t.c, '']])})`, st[0], `=${pre}${lin(t.rr, t.s, X)}${lin(t.p, t.q, X)}`] };
    }
  }
});

/* =============================== mount =============================== */
mountWindow();
export const explainers = mountExplainers({ areaWhy, hunt, huntNeg, guess, gcf, boxMethod, fracs, squareModel, psTest });
export const _test = { poly, mono, bin, signedPairs, HU, HN, GF, BM, FR, PS };
