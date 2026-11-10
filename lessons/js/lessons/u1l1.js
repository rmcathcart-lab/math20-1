/* Math 20-1 · Unit 1 · Lesson 1 — Patterns, Sequences and the General Term.
 * Warm-up (Toothpick Houses: build a row of houses, count the picks; the 100-pick box can't be used up), static
 * Example 5 grids and answer graphs, a Stand Up Break, and the explainers:
 *   machine (the sequence machine: feed n in, t_n drops into a row of terms and onto a dot plot; difference / ratio
 *     hops above the row; ruler test on the dots; Example 3 and Example 4 checks),
 *   twoWays (rule from term to term vs formula for t_n: hop 49 times to t_50 or substitute once),
 *   cups (Example 1 check: nested cups, each adds a 2 cm rim; table with +2 arrows),
 *   hopTest (subtract, then divide: differences above the row, ratios below; Example 2 checks),
 *   shapes (neither: square numbers, triangular numbers (Example 2(c)), Fibonacci as stacked blocks),
 *   finite (4, 7, 10, …, 31 stops at a wall; 4, 7, 10, … rolls on forever),
 *   isTerm (is it a term? set t_n equal and solve; n lands on a position or between two; Example 3(c)(d) checks),
 *   dots (plot (n, t_n), staircase rises, ruler: linear or not; no term at n = 1.5; Example 5 checks).
 * Colours (Unit 1): common difference / ratio amber, first term t_1 teal (#0e7c86), terms and dots burgundy; misses red. */
import {
  h, tex, add, box, Graph, NumberLine, ValueTable, stamp, stampIn, mountExplainers, pop, fadeIn, appear, sleep, tween,
  pairTex, svgEl, liveCtx, pulse, place, drawIn, arrowHead, shake, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const AMB = COLORS.amber, T1 = '#0e7c86', BR = '#7a1f3d', RED = COLORS.red, INK = COLORS.ink, GRAY = COLORS.gray, SLATE = '#5b6475', OK = COLORS.green;
const cD = (s) => `\\textcolor{${AMB}}{${s}}`, cT = (s) => `\\textcolor{${T1}}{${s}}`, cX = (s) => `\\textcolor{${RED}}{${s}}`;
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const show = (c, el) => fadeIn(c, el, 320);
const lab = (stage, html, cls, x, y, pos = 'c', gap = 0) => { const d = h('div', 'u1l1-lab ' + (cls || ''), html); stage.appendChild(d); place(d, x, y, pos, gap); return d; };
const panel = (stage, x, y, w, hh, title, cls = '') => add(stage, box(h('div', 'u1l1-panel ' + cls, title ? `<div class="u1l1-ph">${title}</div>` : ''), w, hh), x, y);
const fmtN = (v) => (Math.abs(v) >= 1000 ? String(v).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : String(v));

/* ---------- exact fractions [n, d] ---------- */
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const Q = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); return [n / g, d / g]; };
const qp = (s) => { const [a, b] = String(s).split('/'); return Q(Number(a), b ? Number(b) : 1); };
const qsub = (a, b) => Q(a[0] * b[1] - b[0] * a[1], a[1] * b[1]);
const qdiv = (a, b) => Q(a[0] * b[1], a[1] * b[0]);
const qeq = (a, b) => a[0] === b[0] && a[1] === b[1];
const qv = (a) => a[0] / a[1];
const qtex = (q, big) => (q[1] === 1 ? String(q[0]) : (q[0] < 0 ? '-' : '') + `\\${big ? 'd' : 't'}frac{${Math.abs(q[0])}}{${q[1]}}`);
const nice = (q) => q[1] <= 9 && Math.abs(q[0]) <= 99;
const dec = (v) => String(parseFloat(v.toFixed(2)));
const diffTex = (q) => (q[0] >= 0 ? '+' : '') + qtex(q, true);
const decQ = (q) => String(Math.round(q[0] * 100 / q[1]) / 100);
const ratioTex = (q, fr = nice(q)) => '\\times' + (fr ? (q[0] < 0 ? `(${qtex(q, true)})` : qtex(q, true)) : decQ(q));
const ratioWord = (q, fr = nice(q)) => (fr ? qtex(q) : decQ(q));

/* ---------- drawing helpers ---------- */
function stageSvg(stage, W, H) {
  const s = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u1l1-svg' });
  stage.appendChild(s); return s;
}
/** a hop arc from x1 to x2 at height y (above, or below with below = true); returns the group (drawIn-able) */
function arc(parent, x1, x2, y, hh, color, below = false, w = 3.4) {
  const s = below ? 1 : -1, mx = (x1 + x2) / 2, cy = y + s * 2 * hh;
  const g = svgEl('g', { class: 'u1l1-arc' }, parent);
  const p = svgEl('path', { class: 'bk-stroke', d: `M${x1} ${y} Q${mx} ${cy} ${x2} ${y}`, fill: 'none', stroke: color, 'stroke-width': w, 'stroke-linecap': 'round' }, g);
  const hd = arrowHead(g, x2, y, x2 - mx, y - cy, { width: w, color, cls: 'bk-end' });
  g.recolor = (c2) => { p.setAttribute('stroke', c2); hd.setAttribute('fill', c2); };
  return g;
}
/** an arc + its label; returns { g, l } with l hidden until shown */
function hopWith(stage, svg, x1, x2, y, hh, html, color, below = false) {
  const g = arc(svg, x1, x2, y, hh, color, below);
  const l = lab(stage, html, 'u1l1-hoplab', (x1 + x2) / 2, y + (below ? 1 : -1) * (hh + 2), below ? 's' : 'n', 0);
  l.style.color = color; hide(l); g.style.opacity = 0;
  return { g, l, recolor: (c2) => { g.recolor(c2); l.style.color = c2; } };
}
async function drawHop(c, hp, ms = 360) { hp.g.style.opacity = 1; await drawIn(hp.g, ms, c); await pop(c, hp.l, 260); }
/** a scrolling row of terms: a clipped viewport whose items slide by `off`; anything not wholly in view is hidden */
class Strip {
  constructor(stage, x, y, w, hh) {
    this.vp = add(stage, box(h('div', 'u1l1-strip'), w, hh), x, y); this.w = w; this.off = 0; this.items = [];
    this.svg = svgEl('svg', { width: w, height: hh, class: 'u1l1-svg' }, this.vp);
    this.g = svgEl('g', {}, this.svg);
  }
  /** register a tile centred at cx (width TW): els move with it; hop (from the previous tile) shows when both ends are in view */
  item(cx, TW, els, hop) {
    const it = { cx, TW, els, hop, on: true };
    els.concat(hop ? [hop.l] : []).forEach((e) => { e._x = parseFloat(e.style.left) || 0; });
    this.items.push(it); this.scroll(this.off); return it;
  }
  scroll(off) {
    this.off = off; this.g.setAttribute('transform', `translate(${-off} 0)`);
    let prev = false;
    for (const it of this.items) {
      const l = it.cx - off - it.TW / 2; it.on = l >= -1 && l + it.TW <= this.w + 1;
      it.els.forEach((e) => { e.style.left = (e._x - off) + 'px'; e.style.visibility = it.on ? '' : 'hidden'; });
      if (it.hop) { const v = it.on && prev ? '' : 'hidden'; it.hop.l.style.left = (it.hop.l._x - off) + 'px'; it.hop.l.style.visibility = v; it.hop.g.style.visibility = v; }
      prev = it.on;
    }
  }
}
/** a term tile (HTML), centred on cx */
function tile(stage, cx, y, w, hh, html, cls = '') { const d = add(stage, box(h('div', 'u1l1-tile ' + cls, html), w, hh), cx - w / 2, y); return d; }

/* ====================================================================================================
 * Warm-up: Toothpick Houses. House k spans x0 + (k−1)U … x0 + kU; first house 5 picks, each next 4: 4n + 1.
 * ==================================================================================================== */
function mountStreet() {
  const host = document.getElementById('u1l1-street'); if (!host) return;
  const W = 600, H = 250, U = 76, R = Math.sqrt(U * U - (U / 2) * (U / 2)), base = 214, x0 = 32, MAX = 7;
  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, class: 'u1l1-street-svg' }, host);
  svgEl('rect', { x: 0, y: 0, width: W, height: base + 4, rx: 14, fill: '#eef5fb' }, svg);
  svgEl('rect', { x: 0, y: base + 4, width: W, height: H - base - 4, rx: 0, fill: '#e7dfcc' }, svg);
  const picksL = svgEl('g', {}, svg), numsL = svgEl('g', {}, svg);
  const note = h('div', 'u1l1-snote'); host.appendChild(note);
  const st = { n: 0, counted: false, busy: false, sticks: [] };
  const sticksOf = (k) => { // [x1, y1, x2, y2] of the new picks for house k
    const L = x0 + (k - 1) * U, Rr = L + U, top = base - U, mid = L + U / 2, peak = top - R;
    const s = [];
    if (k === 1) s.push([L, base, L, top]);
    s.push([L, base, Rr, base], [Rr, base, Rr, top], [L, top, mid, peak], [mid, peak, Rr, top]);
    return s;
  };
  const colOf = (k) => (k === 1 ? T1 : AMB);
  function pick(sx, k) {
    const g = svgEl('g', { class: 'u1l1-pick' }, picksL);
    svgEl('line', { x1: sx[0], y1: sx[1], x2: sx[2], y2: sx[3], stroke: '#8d6532', 'stroke-width': 10, 'stroke-linecap': 'round' }, g);
    const top = svgEl('line', { x1: sx[0], y1: sx[1], x2: sx[2], y2: sx[3], stroke: '#e6c08a', 'stroke-width': 6.5, 'stroke-linecap': 'round' }, g);
    g.paint = (on) => top.setAttribute('stroke', on ? colOf(k) : '#e6c08a');
    g.k = k; g.mid = [(sx[0] + sx[2]) / 2, (sx[1] + sx[3]) / 2];
    return g;
  }
  const total = () => (st.n ? 4 * st.n + 1 : 0);
  function say() {
    note.innerHTML = st.counted
      ? `<b>${st.n}</b> house${st.n === 1 ? '' : 's'} · <b>${total()}</b> toothpicks`
      : `<b>${st.n}</b> house${st.n === 1 ? '' : 's'} · <b>?</b> toothpicks`;
  }
  function numberAll() {
    numsL.innerHTML = '';
    st.sticks.forEach((g, i) => {
      g.paint(st.counted);
      if (!st.counted) return;
      const t = svgEl('text', { x: g.mid[0], y: g.mid[1] + 5, 'text-anchor': 'middle', class: 'u1l1-picknum' }, numsL); t.textContent = i + 1;
    });
  }
  async function addHouse(c) {
    if (st.n >= MAX) return;
    st.n++; const k = st.n;
    for (const sx of sticksOf(k)) {
      const g = pick(sx, k); st.sticks.push(g); g.paint(st.counted);
      if (c) await tween(c, 170, (t) => { g.setAttribute('transform', `translate(0 ${(-60 * (1 - t)).toFixed(1)})`); g.style.opacity = t; });
    }
    numberAll(); say();
  }
  function removeHouse() {
    if (st.n <= 1) return;
    const k = st.n, drop = k === 1 ? 5 : 4;
    st.sticks.splice(-drop).forEach((g) => g.remove()); st.n--; numberAll(); say();
  }
  function reset() { picksL.innerHTML = ''; numsL.innerHTML = ''; st.sticks = []; st.n = 0; st.counted = false; for (let i = 0; i < 3; i++) addHouse(null); say(); }
  const run = (fn) => async () => { if (st.busy) return; st.busy = true; try { await fn(); } finally { st.busy = false; } };
  document.getElementById('u1l1-add').addEventListener('click', run(() => addHouse(liveCtx())));
  document.getElementById('u1l1-sub').addEventListener('click', run(async () => removeHouse()));
  document.getElementById('u1l1-count').addEventListener('click', run(async () => {
    st.counted = true; numsL.innerHTML = ''; const c = liveCtx();
    for (let i = 0; i < st.sticks.length; i++) {
      const g = st.sticks[i]; g.paint(true);
      const t = svgEl('text', { x: g.mid[0], y: g.mid[1] + 5, 'text-anchor': 'middle', class: 'u1l1-picknum' }, numsL); t.textContent = i + 1;
      await pop(c, t, 160); await sleep(c, 60);
    }
    say();
  }));
  document.getElementById('u1l1-wreset').addEventListener('click', run(async () => reset()));
  reset();
}

/* ====================================================================================================
 * Static figures: Example 5 grids and answer graphs (the booklet's 0–6 by 0–16 grid)
 * ==================================================================================================== */
function mountFigures() {
  const mk = (id, w = 300, hh = 330) => {
    const el = document.getElementById(id); if (!el) return null;
    return new Graph(el, { width: w, height: hh, xmin: 0, xmax: 6, ymin: 0, ymax: 16, xstep: 1, ystep: 1, xlabels: 1, ylabels: 2, xtitle: 'n', ytitle: 't_n', origin: true, fontSize: 14, numbers: true });
  };
  mk('u1l1-ex5a'); mk('u1l1-ex5b');
  const A = mk('u1l1-ex5aans', 260, 290), B = mk('u1l1-ex5bans', 260, 290);
  if (A) [2, 5, 8, 11, 14].forEach((v, i) => A.point(i + 1, v, { color: BR, r: 6 }));
  if (B) [1, 2, 4, 8, 16].forEach((v, i) => B.point(i + 1, v, { color: BR, r: 6 }));
}

/* =============================== explainer: the sequence machine =============================== */
const MS = {
  ar: { label: T('t_n=4n+1'), ft: 't_n=4n+1', f: (n) => 4 * n + 1, sub: (n) => `4(${n})+1`, kind: 'a', d: 4, ymax: 24, ystep: 2, ylab: 4, count: 5 },
  sq: { label: T('t_n=n^2'), ft: 't_n=n^2', f: (n) => n * n, sub: (n) => `${n}^2`, kind: 'n', ymax: 28, ystep: 2, ylab: 4, count: 5 },
  ex3: { label: T('t_n=5n-3'), ft: 't_n=5n-3', f: (n) => 5 * n - 3, sub: (n) => `5(${n})-3`, kind: 'a', d: 5, ymax: 20, ystep: 2, ylab: 4, count: 4, big: 30, ex: 'Example 3' },
  ex4: { label: T('t_n=3(2)^{n-1}'), ft: 't_n=3(2)^{n-1}', f: (n) => 3 * 2 ** (n - 1), sub: (n) => `3(2)^{${n}-1}=3(2)^{${n - 1}}`, kind: 'g', r: 2, ymax: 52, ystep: 4, ylab: 8, count: 5, ex: 'Example 4' }
};
function drawGear(svg, cx, cy, r) {
  const g = svgEl('g', { class: 'u1l1-gear' }, svg);
  g.style.transformBox = 'view-box'; g.style.transformOrigin = '0 0';
  svgEl('circle', { cx, cy, r, fill: 'none', stroke: '#b78a98', 'stroke-width': 9, 'stroke-dasharray': `${(2 * Math.PI * r / 24).toFixed(2)} ${(2 * Math.PI * r / 24).toFixed(2)}` }, g);
  svgEl('circle', { cx, cy, r: r - 6, fill: '#e9d3da', stroke: '#b78a98', 'stroke-width': 2 }, g);
  svgEl('circle', { cx, cy, r: 5, fill: '#b78a98' }, g);
  g.spin = (a) => g.setAttribute('transform', `rotate(${a.toFixed(1)} ${cx} ${cy})`);
  return g;
}
const machine = {
  title: 'The sequence machine',
  height: 500,
  minW: 900,
  choices: [{ v: 'ar', label: MS.ar.label }, { v: 'sq', label: MS.sq.label }, { sep: 'Example 3 check:' }, { v: 'ex3', label: MS.ex3.label }, { sep: 'Example 4 check:' }, { v: 'ex4', label: MS.ex4.label }],
  intro: (k) => `Feed positions into ${T(MS[k].ft)} and watch the terms come out. Press <b>Next</b>.`,
  ask: false,
  make(stage, k, ex) {
    const d = MS[k], W = ex.W, H = 500, svg = stageSvg(stage, W, H);
    /* --- the machine (left) --- */
    const X = 8, Y = 0, cx = X + 135;
    svgEl('path', { d: `M${cx - 78} ${Y + 18} L${cx + 78} ${Y + 18} L${cx + 26} ${Y + 76} L${cx - 26} ${Y + 76} Z`, fill: '#efe2e7', stroke: BR, 'stroke-width': 3, 'stroke-linejoin': 'round' }, svg);
    svgEl('rect', { x: X, y: Y + 76, width: 270, height: 236, rx: 20, fill: '#fbf3f5', stroke: BR, 'stroke-width': 3.5 }, svg);
    svgEl('path', { d: `M${X + 168} ${Y + 312} L${X + 232} ${Y + 312} L${X + 268} ${Y + 362} L${X + 204} ${Y + 362} Z`, fill: '#efe2e7', stroke: BR, 'stroke-width': 3, 'stroke-linejoin': 'round' }, svg);
    const g1 = drawGear(svg, X + 52, Y + 282, 22), g2 = drawGear(svg, X + 96, Y + 290, 15);
    lab(stage, 'SEQUENCE MACHINE', 'u1l1-mname', X + 135, Y + 96);
    add(stage, box(h('div', 'u1l1-mwin u1l1-mform', T(d.ft)), 236, 58), X + 17, Y + 116);
    const work = add(stage, box(h('div', 'u1l1-mwin u1l1-mwork', ''), 236, 62), X + 17, Y + 184);
    lab(stage, `${T('n')} in`, 'u1l1-mio', cx + 92, Y + 30, 'e', 0);
    lab(stage, `${T('t_n')} out`, 'u1l1-mio', X + 150, Y + 350, 'w', 0);
    const bigTag = add(stage, box(h('div', 'u1l1-bigtag', ''), 250, 92), X + 10, Y + 384); hide(bigTag);
    /* --- the graph (right) and the row of terms above it, lined up with n --- */
    const GX = 296, G = new Graph(stage, { x: GX, y: 150, width: W - GX - 6, height: H - 152, xmin: 0, xmax: 5.7, ymin: 0, ymax: d.ymax, xstep: 1, ystep: d.ystep, xlabels: 1, ylabels: d.ylab, xtitle: 'n', ytitle: 't_n', origin: true, fontSize: 15 });
    const ROWY = 62, TW = 80, TH = 50, cxs = [], vals = [];
    for (let n = 1; n <= 5; n++) { cxs[n] = GX + G.toPx(n, 0)[0]; vals[n] = d.f(n); }
    for (let n = 1; n <= d.count; n++) {
      tile(stage, cxs[n], ROWY, TW, TH, '', 'u1l1-slot');
      lab(stage, T(n === 1 ? cT('t_1') : `t_${n}`), 'u1l1-tsub', cxs[n], ROWY + TH + 3, 's', 0);
    }
    const ballIn = add(stage, box(h('div', 'u1l1-ball', ''), 44, 44), cx - 22, Y); hide(ballIn);
    const cards = [], pts = [];
    const feed = async (c, n) => {
      ballIn.innerHTML = T(String(n)); ballIn.style.opacity = 1;
      await tween(c, 420, (t) => { ballIn.style.top = (Y + t * 84) + 'px'; ballIn.style.opacity = t < 0.85 ? 1 : (1 - t) / 0.15; }, (t) => t * t);
      ballIn.style.opacity = 0;
      work.innerHTML = T(`t_{${n}}=${d.sub(n)}=${fmtN(d.f(n))}`);
      await Promise.all([appear(c, work.firstChild || work, 260), tween(c, 520, (t) => { g1.spin(t * 180); g2.spin(-t * 264); })]);
    };
    const drop = async (c, n) => {
      const v = vals[n], card = add(stage, box(h('div', 'u1l1-tile u1l1-term' + (n === 1 ? ' u1l1-t1' : ''), T(String(v))), TW, TH), X + 206, Y + 330);
      cards[n] = card;
      const sx = X + 206, sy = Y + 330, ex2 = cxs[n] - TW / 2, ey = ROWY;
      await tween(c, 640, (t) => { card.style.left = (sx + (ex2 - sx) * t) + 'px'; card.style.top = (sy + (ey - sy) * t - 120 * Math.sin(Math.PI * t)) + 'px'; });
      const p = G.point(n, v, { color: n === 1 ? T1 : BR, r: 7.5, label: T(pairTex(n, v)), pos: 'nw', labelCls: 'u1l1-plab' });
      pts[n] = p; await G.reveal(p, c);
    };
    const one = (n) => ({ cap: `Feed in ${T('n=' + n)}. The machine works out ${T(`${n === 1 ? cT('t_1') : 't_{' + n + '}'}=${d.sub(n)}=${n === 1 ? cT(vals[n]) : vals[n]}`)}${n === 1 ? ': the <b>first term</b>' : ''}. It drops into place ${n === 1 ? 'and onto the graph as ' + T(pairTex(1, vals[1])) : 'as the point ' + T(pairTex(n, vals[n]))}.`,
      run: async (c) => { await feed(c, n); await drop(c, n); } });
    const steps = [one(1), one(2), one(3)];
    const rest = []; for (let n = 4; n <= d.count; n++) rest.push(n);
    steps.push({ cap: `Then ${rest.map((n) => T(`t_{${n}}=${vals[n]}`)).join(' and ')}.${d.ex === 'Example 3' ? ` <b>Example 3(a) check:</b> ${T('2,\\ 7,\\ 12,\\ 17,\\ \\dots')}` : ''}${d.ex === 'Example 4' ? ` <b>Example 4 check:</b> ${T('3,\\ 6,\\ 12,\\ 24,\\ 48')}` : ''}`,
      run: async (c) => { for (const n of rest) { await feed(c, n); await drop(c, n); } } });
    /* hops above the row */
    const N = d.count, diffs = [], rats = [];
    for (let n = 1; n < N; n++) { diffs.push(vals[n + 1] - vals[n]); rats.push(vals[n + 1] / vals[n]); }
    const mkHops = (labels, color) => labels.map((l, i) => hopWith(stage, svg, cxs[i + 1] + 8, cxs[i + 2] - 8, ROWY - 3, 24, T(l), color));
    if (d.kind === 'a') {
      const hs = mkHops(diffs.map((x) => '+' + x), AMB);
      steps.push({ cap: `From each term to the next: ${T(cD('+' + d.d))} every time. The same difference means <b>arithmetic</b>, with common difference ${T(cD('d=' + d.d))}.`,
        run: async (c) => { for (const hp of hs) await drawHop(c, hp, 300); } });
    } else if (d.kind === 'g') {
      const hs = mkHops(rats.map((x) => '\\times' + x), AMB);
      steps.push({ cap: `From each term to the next: ${T(cD('\\times' + d.r))} every time. The same multiplier means <b>geometric</b>, with common ratio ${T(cD('r=' + d.r))}.`,
        run: async (c) => { for (const hp of hs) await drawHop(c, hp, 300); } });
    } else {
      const hd = mkHops(diffs.map((x) => '+' + x), SLATE), hr = mkHops(rats.map((x) => '\\times' + dec(x)), SLATE);
      steps.push({ cap: `Differences ${T(diffs.map((x) => '+' + x).join(',\\ '))}: not the same, so <b>not arithmetic</b>.`,
        run: async (c) => { for (const hp of hd) await drawHop(c, hp, 280); } });
      steps.push({ cap: `Ratios ${T(rats.map((x) => '\\times' + dec(x)).join(',\\ '))} (rounded): not the same either. <b>Neither</b>.`,
        run: async (c) => { hd.forEach((hp) => { hp.g.style.opacity = 0; hp.l.style.opacity = 0; }); for (const hp of hr) await drawHop(c, hp, 280); } });
    }
    /* the ruler on the dots */
    const ruler = G.line([1, vals[1]], [2, vals[2]], { color: '#d9c18e', width: 18, arrows: false }); ruler.classList.add('u1l1-ruler'); hide(ruler);
    if (d.kind === 'a') {
      steps.push({ cap: `Each point ${T('(n,\\ t_n)')} sits right under its term. A ruler lies along every dot: the pattern is <b>linear</b>.`,
        run: async (c) => { ruler.style.opacity = 0.55; await G.drawIn(ruler, 700, c); } });
    } else {
      steps.push({ cap: `Lay a ruler through the first two dots: the others ${d.kind === 'g' ? 'climb faster and faster away from it' : 'curve up away from it'}. The pattern is <b>non-linear</b>.`,
        run: async (c) => { ruler.style.opacity = 0.55; await G.drawIn(ruler, 700, c); for (let n = 3; n <= N; n++) await pulse(c, pts[n], 1.5, 300); } });
    }
    if (d.big) {
      steps.push({ cap: `<b>Example 3(b) check.</b> No need to list 30 terms: feed in ${T('n=30')}. ${T(`t_{30}=5(30)-3=147`)}.`,
        run: async (c) => {
          await feed(c, d.big);
          bigTag.innerHTML = `<div class="u1l1-bigk">straight to the 30th term</div>${T('t_{30}=147')}`;
          await show(c, bigTag);
        } });
    }
    return steps;
  }
};

/* =============================== explainer: rule vs formula =============================== */
const twoWays = {
  title: 'Rule or formula?',
  height: 430,
  minW: 860,
  choices: [{ v: 6, label: T('t_6') }, { v: 50, label: T('t_{50}') }, { v: 100, label: T('t_{100}') }],
  intro: (N) => `Find ${T(`t_{${N}}`)} for ${T('5,\\ 9,\\ 13,\\ 17,\\ \\dots')} two ways. Press <b>Next</b>.`,
  ask: false,
  make(stage, N, ex) {
    const W = ex.W, ans = 4 * N + 1;
    const P1 = panel(stage, 10, 6, W - 20, 236, `Rule: <b>start at ${T(cT('5'))}, add ${T(cD('4'))}</b>`, 'u1l1-p-rule');
    const P2 = panel(stage, 10, 256, W - 20, 166, `Formula: <b>${T('t_n=4n+1')}</b>`, 'u1l1-p-form');
    const S = new Strip(stage, 25, 58, W - 50, 150), SP = 92, TW = 70, count = N;
    const tiles = [], hops = [];
    for (let i = 1; i <= count; i++) {
      const cx = 20 + TW / 2 + (i - 1) * SP;
      const t = tile(S.vp, cx, 52, TW, 48, T(String(4 * i + 1)), 'u1l1-term' + (i === 1 ? ' u1l1-t1' : '') + (i === N ? ' u1l1-goal' : ''));
      const s = lab(S.vp, T(i === 1 ? cT('t_1') : `t_{${i}}`), 'u1l1-tsub', cx, 104, 's', 0);
      hide(t); hide(s); tiles.push([t, s]);
      const hp = i > 1 ? hopWith(S.vp, S.g, cx - SP + 8, cx - 8, 50, 20, T(cD('+4')), AMB) : null;
      if (hp) hops.push(hp);
      S.item(cx, TW, [t, s], hp);
    }
    const counter = add(stage, h('div', 'u1l1-counter', 'hops: <b>0</b>'), W - 200, 16);
    const cnt = counter.querySelector('b');
    const scrollTo = (i) => S.scroll(Math.max(0, 20 + (i - 1) * SP + TW - (S.w - 10)));
    const showTile = (i) => { tiles[i - 1][0].style.opacity = 1; tiles[i - 1][1].style.opacity = 1; };
    const showHop = (i) => { const hp = hops[i - 2]; hp.g.style.opacity = 1; hp.l.style.opacity = 1; };
    const fline = add(stage, box(h('div', 'u1l1-fline'), W - 60, 64), 30, 306); hide(fline);
    fline.innerHTML = T(`t_{${N}}=4(${N})+1=${ans}`);
    const fbadge = add(stage, h('div', 'u1l1-badge', '1 step'), W - 150, 270); hide(fbadge);
    const rAns = add(stage, h('div', 'u1l1-rans', ''), W - 330, 196); hide(rAns);
    rAns.innerHTML = `${T(`t_{${N}}=${ans}`)} after <b>${N - 1}</b> hops`;
    const steps = [{ cap: `The rule starts at the first term: ${T(cT('t_1=5'))}.`, run: async (c) => { showTile(1); await pop(c, tiles[0][0]); await fadeIn(c, tiles[0][1], 200); } }];
    const slow = Math.min(N, 6);
    steps.push({ cap: `Each new term needs the one before it: add 4, add 4, … ${slow === N ? `${T(`t_{${N}}`)} takes <b>${N - 1} hops</b>.` : 'one hop at a time.'}`,
      run: async (c) => {
        for (let i = 2; i <= slow; i++) {
          showTile(i); tiles[i - 1][0].style.opacity = 0; scrollTo(i);
          const hp = hops[i - 2]; await drawHop(c, hp, 260); await pop(c, tiles[i - 1][0], 240); tiles[i - 1][1].style.opacity = 1; cnt.textContent = i - 1;
        }
        if (slow === N) { await show(c, rAns); }
      } });
    if (N > slow) {
      steps.push({ cap: `Keep going… and going. Reaching ${T(`t_{${N}}`)} takes <b>${N - 1} hops</b>: ${T(`t_{${N}}=${ans}`)}.`,
        run: async (c) => {
          let last = slow;
          await tween(c, Math.min(3200, 60 * N), (t) => {
            const i = Math.round(slow + (N - slow) * t);
            for (let j = last + 1; j <= i; j++) { showTile(j); showHop(j); }
            last = Math.max(last, i); scrollTo(i); cnt.textContent = i - 1;
          }, (t) => t);
          for (let j = last + 1; j <= N; j++) { showTile(j); showHop(j); }
          scrollTo(N); cnt.textContent = N - 1; await show(c, rAns);
        } });
    }
    steps.push({ cap: `The formula skips the list: put ${T('n=' + N)} straight in. ${T(`t_{${N}}=4(${N})+1=${ans}`)}.`,
      run: async (c) => { await show(c, fline); await pop(c, fbadge); } });
    steps.push({ cap: `Same answer, ${T(String(ans))}. The rule needs <b>every term before</b> it; the formula <b>jumps straight</b> to any position.`,
      run: async (c) => { const s1 = stamp(stage, '✓ same', { ok: true, x: W - 110, y: 386, size: 'sm' }); await stampIn(c, s1); } });
    return steps;
  }
};

/* =============================== explainer: the cup tower (Example 1) =============================== */
const cups = {
  title: 'Nested cups',
  height: 440,
  minW: 860,
  intro: 'Each cup slides inside the one below it. Press <b>Next</b>.',
  ask: 'Example 1: a tower of 1 cup is 11 cm tall, 2 cups 13 cm, 3 cups 15 cm, 4 cups 17 cm.',
  make(stage, v, ex) {
    const W = ex.W, H = 440, svg = stageSvg(stage, W, H);
    const S = 15, BASE = 412, RX = 60, CX = 232, TOPW = 120, BOTW = 82, CH = 11 * S;
    // ruler
    svgEl('rect', { x: RX - 30, y: BASE - 23 * S, width: 34, height: 23 * S + 2, rx: 4, fill: '#fbf3dc', stroke: '#b99a4c', 'stroke-width': 2 }, svg);
    for (let cm = 0; cm <= 22; cm++) {
      const y = BASE - cm * S;
      svgEl('line', { x1: RX + 4, x2: RX + 4 - (cm % 2 ? 9 : 16), y1: y, y2: y, stroke: '#7d6526', 'stroke-width': 1.6 }, svg);
      if (cm % 2 === 0) { const t = svgEl('text', { x: RX - 15, y: y + 5, 'text-anchor': 'end', class: 'u1l1-rnum' }, svg); t.textContent = cm; }
    }
    lab(stage, 'cm', 'u1l1-small', RX - 14, BASE - 23 * S - 4, 'n', 0);
    svgEl('line', { x1: 110, x2: 340, y1: BASE, y2: BASE, stroke: INK, 'stroke-width': 3 }, svg);
    const cupL = svgEl('g', {}, svg), markL = svgEl('g', {}, svg);
    const mkCup = (k) => { // cup k (1 = bottom); bottom at BASE − 2(k−1) cm
      const b = BASE - 2 * S * (k - 1), t = b - CH, g = svgEl('g', { class: 'u1l1-cup' });
      svgEl('path', { d: `M${CX - TOPW / 2} ${t} L${CX + TOPW / 2} ${t} L${CX + BOTW / 2} ${b} L${CX - BOTW / 2} ${b} Z`, fill: '#fffaf1', stroke: '#8a6a3a', 'stroke-width': 2.4, 'stroke-linejoin': 'round' }, g);
      const sl = (y) => [CX - TOPW / 2 + (TOPW - BOTW) / 2 * (y - t) / CH, CX + TOPW / 2 - (TOPW - BOTW) / 2 * (y - t) / CH];
      const [a1, a2] = sl(t + 54), [b1, b2] = sl(t + 112);
      svgEl('path', { d: `M${a1} ${t + 54} L${a2} ${t + 54} L${b2} ${t + 112} L${b1} ${t + 112} Z`, fill: k === 1 ? '#c9e6e6' : '#ead2a8', stroke: 'none' }, g);
      svgEl('rect', { x: CX - TOPW / 2 - 5, y: t - 4, width: TOPW + 10, height: 9, rx: 4.5, fill: '#fff', stroke: '#8a6a3a', 'stroke-width': 2.2 }, g);
      cupL.insertBefore(g, cupL.firstChild); // a higher cup sits inside (behind) the ones below it
      return g;
    };
    const top = (k) => BASE - 2 * S * (k - 1) - CH;
    const mline = svgEl('line', { x1: CX + TOPW / 2 + 8, x2: RX + 6, y1: top(1) - 4, y2: top(1) - 4, stroke: BR, 'stroke-width': 2.4, 'stroke-dasharray': '6 5' }, markL); hide(mline);
    const mread = lab(stage, '', 'u1l1-mread', CX + TOPW / 2 + 14, top(1) - 4, 'e', 0); hide(mread);
    const setH = (k) => { const y = top(k) - 4; mline.setAttribute('y1', y); mline.setAttribute('y2', y); place(mread, CX + TOPW / 2 + 14, y, 'e', 0); mread.innerHTML = `${T(String(11 + 2 * (k - 1)))} cm`; };
    // bracket for the 2 cm rim
    const br = svgEl('path', { d: '', fill: 'none', stroke: AMB, 'stroke-width': 3.2 }, markL); hide(br);
    const brl = lab(stage, `+2 cm`, 'u1l1-brl', 0, 0, 'e', 0); hide(brl);
    const setBr = (k) => { const y1 = top(k) - 4, y2 = top(k - 1) - 4, x = CX - TOPW / 2 - 14; br.setAttribute('d', `M${x + 8} ${y1} L${x} ${y1} L${x} ${y2} L${x + 8} ${y2}`); place(brl, x - 6, (y1 + y2) / 2, 'w', 0); };
    const tb = new ValueTable(stage, { x: 394, y: 14, headers: ['n\\ \\text{(cups)}', 't_n\\ \\text{(cm)}'], rows: [1, 2, 3, 4, 5, 6].map((n) => [n, 9 + 2 * n]), hide: 1, tap: false, cellW: 116, cellH: 54, diffs: true, diffSpace: 90 });
    const rule = panel(stage, 728, 30, W - 738, 250, ''); hide(rule);
    rule.innerHTML = `<div class="u1l1-rbig">${T(cD('+2'))}</div><div>each cup adds its <b>rim</b>, 2 cm</div><div class="u1l1-rsm">${T(cT('t_1=11'))}<br>${T('t_4=17')}<br>${T('t_6=21')}</div>`;
    const cupsUp = []; let n = 0;
    const addCup = async (c) => {
      n++; const k = n, g = mkCup(k); cupsUp.push(g);
      await tween(c, 420, (t) => { g.setAttribute('transform', `translate(0 ${(-90 * (1 - t)).toFixed(1)})`); g.style.opacity = Math.min(1, t * 2); });
      setH(k); mline.style.opacity = 1; mread.style.opacity = 1; await tb.reveal(k - 1, 1, c);
    };
    return [
      { cap: `One cup: the tower is ${T(cT('11'))} cm tall. That is the first term, ${T(cT('t_1=11'))}.`, run: (c) => addCup(c) },
      { cap: `Add a cup. It slides <b>inside</b> the first: only its rim sticks out, ${T(cD('2'))} cm higher. ${T('t_2=13')}.`,
        run: async (c) => { await addCup(c); setBr(2); br.style.opacity = 1; await drawIn(br, 300, c); await pop(c, brl); } },
      { cap: `Third and fourth cups: ${T('t_3=15')} and ${T('t_4=17')}, as the question says.`,
        run: async (c) => { br.style.opacity = 0; brl.style.opacity = 0; await addCup(c); await addCup(c); setBr(4); br.style.opacity = 1; brl.style.opacity = 1; } },
      { cap: `<b>Example 1(b) check.</b> Every cup adds the same 2 cm: <b>add 2</b> to the previous term.`,
        run: async (c) => { await tb.diffs(c, { labels: () => T(cD('+2')) }); await show(c, rule); } },
      { cap: `<b>Example 1(a) check.</b> Keep going: ${T('t_5=17+2=19')} and ${T('t_6=19+2=21')}.`,
        run: async (c) => { br.style.opacity = 0; brl.style.opacity = 0; await addCup(c); await addCup(c); } },
      { cap: `<b>Example 1(c) check.</b> The little number counts cups: ${T(cT('t_1=11'))}, ${T('t_4=17')}, ${T('t_6=21')}.`,
        run: async (c) => { [0, 3, 5].forEach((r) => tb.highlight(r, true)); await pulse(c, rule, 1.04); } }
    ];
  }
};

/* =============================== explainer: the hop test (Example 2) =============================== */
const HT = {
  ar: { label: T('5,\\ 9,\\ 13,\\ 17'), s: ['5', '9', '13', '17'] },
  ge: { label: T('3,\\ 6,\\ 12,\\ 24'), s: ['3', '6', '12', '24'] },
  a: { label: '(a)', s: ['40', '33', '26', '19'], ex: 'Example 2(a)' },
  b: { label: '(b)', s: ['2', '-6', '18', '-54'], ex: 'Example 2(b)' },
  c: { label: '(c)', s: ['1', '3', '6', '10', '15'], ex: 'Example 2(c)' },
  d: { label: '(d)', s: ['64', '16', '4', '1'], ex: 'Example 2(d)' },
  e: { label: '(e)', s: ['1/2', '5/4', '2', '11/4'], ex: 'Example 2(e)' },
  f: { label: '(f)', s: ['7', '7', '7', '7'], ex: 'Example 2(f)' }
};
const seqTex = (q) => q.map(qtex).join(',\\ ') + ',\\ \\dots';
const hopTest = {
  title: 'Subtract, then divide',
  height: 450,
  minW: 900,
  choices: [{ v: 'ar', label: HT.ar.label }, { v: 'ge', label: HT.ge.label }, { sep: 'Example 2 check:' }, ...['a', 'b', 'c', 'd', 'e', 'f'].map((k) => ({ v: k, label: HT[k].label }))],
  intro: (k) => `Test ${T(seqTex(HT[k].s.map(qp)))}. Press <b>Next</b>.`,
  ask: (k) => (HT[k].ex ? `<b>${HT[k].ex}.</b> ` : '') + `Classify ${T(seqTex(HT[k].s.map(qp)))}`,
  make(stage, k, ex) {
    const d = HT[k], W = ex.W, svg = stageSvg(stage, W, 450), q = d.s.map(qp), n = q.length;
    const ds = q.slice(1).map((v, i) => qsub(v, q[i])), rs = q.slice(1).map((v, i) => (q[i][0] === 0 ? null : qdiv(v, q[i])));
    const dEq = ds.every((x) => qeq(x, ds[0])), rEq = rs.every((x) => x && qeq(x, rs[0])), allNice = rs.every((x) => x && nice(x));
    const SP = 132, TW = 96, TH = 62, LEFT = 190, rowW = (n - 1) * SP, x0 = LEFT + Math.max(0, (W - LEFT - 20 - rowW - TW) / 2) + TW / 2, ROWY = 176;
    const cxs = q.map((_, i) => x0 + i * SP);
    q.forEach((v, i) => { tile(stage, cxs[i], ROWY, TW, TH, T(qtex(v).replace('tfrac', 'dfrac')), 'u1l1-term u1l1-big' + (i === 0 ? ' u1l1-t1' : '')); });
    lab(stage, T('\\dots'), 'u1l1-dots', cxs[n - 1] + TW / 2 + 16, ROWY + TH / 2, 'e', 0);
    const hd = ds.map((x, i) => hopWith(stage, svg, cxs[i] + 10, cxs[i + 1] - 10, ROWY - 4, 40, T(diffTex(x)), SLATE));
    const hr = rs.map((x, i) => hopWith(stage, svg, cxs[i] + 10, cxs[i + 1] - 10, ROWY + TH + 4, 40, x ? T(ratioTex(x, allNice)) : '—', SLATE, true));
    lab(stage, '<b>Subtract</b><br>next − previous', 'u1l1-side', 14, 92, 'e', 0);
    lab(stage, '<b>Divide</b><br>next ÷ previous', 'u1l1-side', 14, 300, 'e', 0);
    const vD = lab(stage, '', 'u1l1-verd', 14, 150, 'e', 0), vR = lab(stage, '', 'u1l1-verd', 14, 358, 'e', 0); hide(vD); hide(vR);
    vD.innerHTML = dEq ? `all equal ✓<br>${T(cD('d=' + qtex(ds[0])))}` : 'not equal ✗'; vD.classList.add(dEq ? 'u1l1-yes' : 'u1l1-no');
    vR.innerHTML = rEq ? `all equal ✓<br>${T(cD('r=' + qtex(rs[0])))}` : 'not equal ✗'; vR.classList.add(rEq ? 'u1l1-yes' : 'u1l1-no');
    const verdict = dEq && rEq ? 'Both' : dEq ? 'Arithmetic' : rEq ? 'Geometric' : 'Neither';
    const fin = add(stage, h('div', 'u1l1-final u1l1-f-' + verdict.toLowerCase(), ''), W - 280, 392); hide(fin);
    fin.innerHTML = `<b>${verdict}</b>${dEq ? ' ' + T(cD('d=' + qtex(ds[0]))) : ''}${dEq && rEq ? ' and' : ''}${rEq ? ' ' + T(cD('r=' + qtex(rs[0]))) : ''}`;
    const dList = ds.map((x) => qtex(x)).join(',\\ '), rList = rs.map((x) => (x ? ratioWord(x, allNice) : '—')).join(',\\ ');
    const anyDec = !allNice && rs.some((x) => x && x[1] !== 1 && Math.round(x[0] * 100 / x[1]) !== x[0] * 100 / x[1]);
    return [
      { cap: `<b>Subtract:</b> each term minus the one before. Differences: ${T(dList)}.`, run: async (c) => { for (const hp of hd) await drawHop(c, hp, 300); } },
      { cap: dEq ? `The differences are <b>all equal</b>: the common difference is ${T(cD('d=' + qtex(ds[0])))}.` : `The differences are <b>not all equal</b>: it is not arithmetic.`,
        run: async (c) => { if (dEq) hd.forEach((hp) => hp.recolor(AMB)); else hd.forEach((hp) => hp.recolor(RED)); await pop(c, vD); } },
      { cap: `<b>Divide:</b> each term by the one before. Ratios: ${T(rList)}${anyDec ? ' (rounded)' : ''}.`, run: async (c) => { for (const hp of hr) await drawHop(c, hp, 300); } },
      { cap: rEq ? `The ratios are <b>all equal</b>: the common ratio is ${T(cD('r=' + qtex(rs[0])))}.` : `The ratios are <b>not all equal</b>: it is not geometric.`,
        run: async (c) => { if (rEq) hr.forEach((hp) => hp.recolor(AMB)); else hr.forEach((hp) => hp.recolor(RED)); await pop(c, vR); } },
      { cap: verdict === 'Both' ? `<b>Both!</b> A constant sequence adds 0 and multiplies by 1: arithmetic <b>and</b> geometric.`
        : verdict === 'Neither' ? `Neither test works: the sequence is <b>neither</b> arithmetic nor geometric.`
          : `<b>${verdict}</b>, with ${verdict === 'Arithmetic' ? T(cD('d=' + qtex(ds[0]))) : T(cD('r=' + qtex(rs[0])))}.`,
        run: (c) => pop(c, fin) }
    ];
  }
};

/* =============================== explainer: patterns that are neither =============================== */
const SH = {
  sq: { label: 'Square numbers', vals: [1, 4, 9, 16], name: 'square numbers' },
  tri: { label: `Example 2(c): ${T('1,\\ 3,\\ 6,\\ 10,\\ 15')}`, vals: [1, 3, 6, 10, 15], name: 'triangular numbers' },
  fib: { label: 'Fibonacci', vals: [1, 1, 2, 3, 5, 8], name: 'Fibonacci sequence' }
};
const shapes = {
  title: 'Patterns that are neither',
  height: 450,
  minW: 900,
  choices: Object.keys(SH).map((k) => ({ v: k, label: SH[k].label })),
  intro: (k) => `Build the ${SH[k].name} as pictures. Press <b>Next</b>.`,
  ask: false,
  make(stage, k, ex) {
    const d = SH[k], W = ex.W, H = 450, svg = stageSvg(stage, W, H), N = d.vals.length;
    const SP = (W - 60) / N, cxs = d.vals.map((_, i) => 30 + SP * (i + 0.5)), FB = 290; // figures sit on y = FB
    const figs = d.vals.map(() => { const g = svgEl('g', {}, svg); g.style.opacity = 0; return g; });
    const R = 12, GAP = 34;
    const dot = (g, x, y, color) => svgEl('circle', { cx: x, cy: y, r: R, fill: color, stroke: '#fff', 'stroke-width': 1.5 }, g);
    d.vals.forEach((v, i) => {
      const g = figs[i], n = i + 1, cx = cxs[i];
      if (k === 'sq') {
        for (let r = 0; r < n; r++) for (let cc = 0; cc < n; cc++) { const isNew = n > 1 && (r === n - 1 || cc === n - 1); dot(g, cx - (n - 1) * GAP / 2 + cc * GAP, FB - 14 - r * GAP, isNew ? AMB : n === 1 ? T1 : BR); }
      } else if (k === 'tri') {
        for (let r = 1; r <= n; r++) for (let cc = 0; cc < r; cc++) { const isNew = n > 1 && r === n; dot(g, cx - (r - 1) * GAP / 2 + cc * GAP, FB - 14 - (n - r) * GAP, isNew ? AMB : n === 1 ? T1 : BR); }
      } else {
        const U = 28, bw = 54;
        const seg = (y0, cnt, color) => { for (let j = 0; j < cnt; j++) svgEl('rect', { x: cx - bw / 2, y: FB - (y0 + j + 1) * U, width: bw, height: U - 2, rx: 3, fill: color, stroke: '#fff', 'stroke-width': 1 }, g); };
        if (i < 2) seg(0, v, i === 0 ? T1 : BR);
        else { seg(0, d.vals[i - 2], '#c9a3b1'); seg(d.vals[i - 2], d.vals[i - 1], AMB); }
      }
    });
    const tiles = d.vals.map((v, i) => { const t = tile(stage, cxs[i], FB + 14, 64, 44, T(String(v)), 'u1l1-term' + (i === 0 ? ' u1l1-t1' : '')); hide(t); return t; });
    const subs = d.vals.map((_, i) => { const s = lab(stage, T(i === 0 ? cT('t_1') : `t_${i + 1}`), 'u1l1-tsub', cxs[i], FB + 60, 's', 0); hide(s); return s; });
    const diffs = d.vals.slice(1).map((v, i) => v - d.vals[i]), rats = d.vals.slice(1).map((v, i) => v / d.vals[i]);
    const hops = diffs.map((x, i) => hopWith(stage, svg, cxs[i] + 34, cxs[i + 1] - 34, FB + 98, 20, T('+' + x), SLATE, true));
    const showFig = async (c, i) => { await appear(c, figs[i], 320); tiles[i].style.opacity = 1; subs[i].style.opacity = 1; await pop(c, tiles[i], 260); };
    const note = add(stage, box(h('div', 'u1l1-snote2'), W - 40, 46), 20, 6); hide(note);
    const steps = [];
    if (k === 'sq') {
      steps.push({ cap: `The square numbers are squares of dots: ${T(cT('t_1=1'))}, then ${T('2\\times2=4')}.`, run: async (c) => { await showFig(c, 0); await showFig(c, 1); } });
      steps.push({ cap: `To grow the next square, add an L-shaped border: ${T(cD('+3'))}, then ${T(cD('+5'))}, then ${T(cD('+7'))}.`, run: async (c) => { await showFig(c, 2); await showFig(c, 3); } });
    } else if (k === 'tri') {
      steps.push({ cap: `${T('1,\\ 3,\\ 6,\\ 10,\\ 15')} are triangles of dots: each figure adds a new <b>bottom row</b>.`, run: async (c) => { await showFig(c, 0); await showFig(c, 1); await showFig(c, 2); } });
      steps.push({ cap: `The new row is one dot longer every time: ${T(cD('+2'))}, ${T(cD('+3'))}, ${T(cD('+4'))}, ${T(cD('+5'))}.`, run: async (c) => { await showFig(c, 3); await showFig(c, 4); } });
    } else {
      steps.push({ cap: `Fibonacci starts ${T(cT('1') + ',\\ 1')}. Every term after that is the <b>two before it stacked together</b>.`, run: async (c) => { await showFig(c, 0); await showFig(c, 1); } });
      steps.push({ cap: `${T('1+1=2')}, ${T('1+2=3')}, ${T('2+3=5')}, ${T('3+5=8')}: the newest block (amber) sits on the one before (pink).`, run: async (c) => { for (let i = 2; i < N; i++) await showFig(c, i); } });
    }
    steps.push({ cap: `Differences ${T(diffs.join(',\\ '))}: not all equal, so <b>not arithmetic</b>.`, run: async (c) => { for (const hp of hops) await drawHop(c, hp, 260); } });
    steps.push({ cap: `Ratios ${T(rats.map(dec).join(',\\ '))}${rats.some((x) => !Number.isInteger(x * 100)) ? ' (rounded)' : ''}: not all equal, so <b>not geometric</b>. <b>Neither</b>, but still a pattern.`,
      run: async (c) => {
        note.innerHTML = `<b>Neither</b>: ${k === 'sq' ? `the rule is ${T('t_n=n^2')}` : k === 'tri' ? 'each figure adds a row one dot longer' : 'each term is the sum of the two before it'}`;
        hops.forEach((hp) => hp.recolor(RED)); await show(c, note);
      } });
    return steps;
  }
};

/* =============================== explainer: finite and infinite =============================== */
const finite = {
  title: 'Finite or infinite?',
  height: 340,
  minW: 900,
  choices: [{ v: 'fin', label: T('4,\\ 7,\\ 10,\\ \\dots,\\ 31') }, { v: 'inf', label: T('4,\\ 7,\\ 10,\\ \\dots') }],
  intro: 'Where are the three dots? Press <b>Next</b>.',
  ask: false,
  make(stage, k, ex) {
    const W = ex.W, H = 340, fin = k === 'fin', svg = stageSvg(stage, W, H), SY = 112;
    // the written form, piece by piece
    const parts = fin ? ['4,', '7,', '10,', '\\dots,', '31'] : ['4,', '7,', '10,', '\\dots'];
    const wr = add(stage, h('div', 'u1l1-written'), 0, 10);
    const pe = parts.map((p) => { const s = h('div', 'u1l1-wp' + (p.startsWith('\\dots') ? ' u1l1-wdots' : ''), T(p)); wr.appendChild(s); return s; });
    hide(wr);
    const VPX = 20, S = new Strip(stage, VPX, SY, W - 40, 150);
    const SP = fin ? 82 : 86, TW = 68, NT = fin ? 10 : 26, x0 = 14 + TW / 2, tiles = [];
    for (let i = 1; i <= NT; i++) {
      const cx = x0 + (i - 1) * SP, t = tile(S.vp, cx, 50, TW, 48, T(String(3 * i + 1)), 'u1l1-term' + (i === 1 ? ' u1l1-t1' : '') + (i >= 4 && (!fin || i <= 9) ? ' u1l1-ghost' : ''));
      const s = lab(S.vp, T(i === 1 ? cT('t_1') : `t_{${i}}`), 'u1l1-tsub', cx, 102, 's', 0);
      const hp = i > 1 ? hopWith(S.vp, S.g, cx - SP + 8, cx - 8, 48, 18, T(cD('+3')), AMB) : null;
      hide(t); hide(s); tiles.push({ t, s, hp }); S.item(cx, TW, [t, s], hp);
    }
    const showT = (i) => { const o = tiles[i - 1]; o.t.style.opacity = 1; o.s.style.opacity = 1; if (o.hp) { o.hp.g.style.opacity = 1; o.hp.l.style.opacity = 1; } };
    const steps = [{ cap: fin ? `Read it: ${T('4,\\ 7,\\ 10,\\ \\dots,\\ 31')}. The three dots are in the <b>middle</b>.` : `Read it: ${T('4,\\ 7,\\ 10,\\ \\dots')}. The three dots are at the <b>end</b>.`,
      run: async (c) => { wr.style.left = ((W - wr.offsetWidth) / 2) + 'px'; await show(c, wr); await pulse(c, pe[3], 1.25, 500); } }];
    steps.push({ cap: `The first three terms: start at ${T(cT('4'))} and add ${T(cD('3'))} each time.`,
      run: async (c) => { for (let i = 1; i <= 3; i++) { showT(i); await pop(c, tiles[i - 1].t, 220); } } });
    if (fin) {
      const a = VPX + x0 + 3 * SP - TW / 2, b = VPX + x0 + 8 * SP + TW / 2, y = SY + 132;
      const brace = svgEl('path', { class: 'bk-stroke', d: `M${a} ${y} L${a} ${y + 10} L${b} ${y + 10} L${b} ${y}`, fill: 'none', stroke: AMB, 'stroke-width': 3 }, svg); hide(brace);
      const bl = lab(stage, `the ${T(cD('\\dots'))} stands for these`, 'u1l1-blab', (a + b) / 2, y + 14, 's', 0); hide(bl);
      steps.push({ cap: `The dots in the middle stand for the terms nobody wrote out: ${T('13,\\ 16,\\ 19,\\ 22,\\ 25,\\ 28')}.`,
        run: async (c) => {
          for (let i = 4; i <= 9; i++) { showT(i); await pop(c, tiles[i - 1].t, 160); }
          brace.style.opacity = 1; await drawIn(brace, 400, c); await fadeIn(c, bl, 260);
        } });
      const wallX = VPX + x0 + 9 * SP + TW / 2 + 14;
      const wall = svgEl('rect', { x: wallX, y: SY + 26, width: 12, height: 110, rx: 3, fill: BR }, svg); hide(wall);
      const flag = lab(stage, '<b>last term</b>', 'u1l1-flag', wallX + 12, SY + 160, 'sw', 0); hide(flag);
      steps.push({ cap: `Then ${T('31')}, and it <b>stops</b>. A last term means the sequence is <b>finite</b> (this one has 10 terms).`,
        run: async (c) => { showT(10); await pop(c, tiles[9].t, 260); wall.style.opacity = 1; await appear(c, wall, 260); await pop(c, flag); } });
    } else {
      const offOf = (i) => Math.max(0, x0 + (i - 1) * SP + TW / 2 - (S.w - 10));
      steps.push({ cap: `The dots at the end mean <b>keep going</b>: ${T('13,\\ 16,\\ 19,\\ \\dots')} and on, and on.`,
        run: async (c) => {
          let last = 3;
          await tween(c, 3000, (t) => {
            const i = Math.round(3 + (NT - 3) * t);
            for (let j = last + 1; j <= i; j++) showT(j);
            last = Math.max(last, i); S.scroll(offOf(i));
          }, (t) => t);
          for (let j = last + 1; j <= NT; j++) showT(j);
          S.scroll(offOf(NT));
        } });
      const fe = lab(stage, 'no last term → forever', 'u1l1-flag u1l1-forever', W - 26, SY + 164, 'w', 0); hide(fe);
      steps.push({ cap: `However far you go there is always a next term. <b>No last term</b>: the sequence is <b>infinite</b>.`, run: (c) => pop(c, fe) });
    }
    return steps;
  }
};

/* =============================== explainer: is it a term? (Example 3) =============================== */
const IT = { 47: {}, '-8': {}, 92: { ex: 'Example 3(c)' }, 100: { ex: 'Example 3(d)' } };
const isTerm = {
  title: 'Is it a term?',
  height: 440,
  minW: 900,
  choices: [{ v: 47, label: 'Is 47?' }, { v: -8, label: 'Is −8?' }, { sep: 'Example 3 check:' }, { v: 92, label: 'Is 92?' }, { v: 100, label: 'Is 100?' }],
  intro: (v) => `Is ${T(String(v))} a term of ${T('t_n=5n-3')}? Press <b>Next</b>.`,
  ask: (v) => (IT[v] && IT[v].ex ? `<b>${IT[v].ex}.</b> ` : '') + `Is ${T(String(v))} a term of ${T('t_n=5n-3')}?`,
  make(stage, v, ex) {
    const W = ex.W, nv = (v + 3) / 5, isNat = Number.isInteger(nv) && nv >= 1, nTex = Number.isInteger(nv) ? String(nv) : String(parseFloat(nv.toFixed(3)));
    const L = new NumberLine(stage, { x: 10, y: 4, width: W - 20, height: 112, min: -15, max: 110, step: 5, labelStep: 10, fontSize: 15, axisY: 70 });
    const dots = []; for (let n = 1; n <= 22; n++) { const g = L.point(5 * n - 3, { color: n === 1 ? T1 : BR, r: 6 }); g.style.opacity = 0; dots.push(g); }
    const lab1 = L.mark(2, T(cT('t_1')), { lift: 8 }); hide(lab1);
    const flag = L.point(v, { color: AMB, r: 9, label: `<b>${T(String(v))}?</b>`, lift: 0 }); hide(flag); if (flag.label) hide(flag.label);
    const P = panel(stage, 10, 128, 400, 228, 'Solve for the position'), lines = [];
    [`5n-3=${v}`, `5n=${v + 3}`, `n=\\dfrac{${v + 3}}{5}=${isNat || Number.isInteger(nv) ? cD(nTex) : cX(nTex)}`].forEach((s) => { const d = h('div', 'u1l1-aline', T(s)); P.appendChild(d); hide(d); lines.push(d); });
    // zoom: positions near n (term values above the dots, positions below)
    const n0 = Math.floor(nv), lo = Math.max(-2, n0 - 2), hi = lo + 4;
    const ZP = panel(stage, 430, 128, W - 440, 228, `Positions near ${T('n=' + nTex)}`); hide(ZP);
    const Z = new NumberLine(stage, { x: 440, y: 150, width: W - 460, height: 200, min: lo - 0.6, max: hi + 0.6, step: 1, fontSize: 17, axisY: 130, labels: (k) => T(`n=${k}`) });
    hide(Z.el);
    if (lo < 1) { const a = Z.toPx(lo - 0.6), b = Z.toPx(0.5); svgEl('rect', { x: a, y: 96, width: b - a, height: 70, rx: 6, fill: '#e9e6df', opacity: 0.85 }, Z.layers.data); Z.mark((lo - 0.6 + 0.5) / 2, '<i>no positions</i>', { pos: 'n', lift: 20, cls: 'u1l1-nopos' }); }
    for (let k = Math.ceil(lo); k <= hi; k++) if (k >= 1) Z.point(k, { color: BR, r: 8, label: T(String(5 * k - 3)) });
    const zf = Z.point(nv, { color: isNat ? OK : RED, r: 9 }); hide(zf);
    const zfl = Z.mark(nv, `<b>${T(String(v))}</b> at ${T('n=' + nTex)}`, { pos: 'n', lift: 58, cls: isNat ? 'u1l1-zyes' : 'u1l1-zno' }); hide(zfl);
    const st = stamp(stage, isNat ? `✓ ${v} is a term` : `✗ not a term`, { ok: isNat, x: W / 2 + 200, y: 398 }); hide(st);
    const res = add(stage, h('div', 'u1l1-res'), 26, 380); hide(res);
    res.innerHTML = isNat ? `${T(`${v}=t_{${nv}}`)}` : nv < 1 ? `no position ${T(nTex)}` : `between ${T(`t_{${n0}}=${5 * n0 - 3}`)} and ${T(`t_{${n0 + 1}}=${5 * n0 + 2}`)}`;
    const verdictCap = isNat ? `${T('n=' + nTex)} is a natural number, so ${T(String(v))} <b>is a term</b>: ${T(`${v}=t_{${nv}}`)}.`
      : nv < 1 ? `${T('n=' + nTex)}, but positions start at ${T('n=1')}: there is no term in position ${T(nTex)}. ${T(String(v))} is <b>not a term</b>.`
        : `${T('n=' + nTex)} lands <b>between</b> positions ${n0} and ${n0 + 1}: there is no term there. ${T(String(v))} is <b>not a term</b>.`;
    return [
      { cap: `The terms of ${T('t_n=5n-3')} land every 5 on the number line: ${T(cT('2') + ',\\ 7,\\ 12,\\ 17,\\ \\dots')} Is ${T(String(v))} one of them?`,
        run: async (c) => {
          for (const g of dots) { g.style.opacity = 1; if (c && !c.fast) await sleep(c, 30); }
          lab1.style.opacity = 1; flag.style.opacity = 1; if (flag.label) flag.label.style.opacity = 1; await pop(c, flag);
        } },
      { cap: `Set the formula <b>equal to</b> ${T(String(v))}: ${T(`5n-3=${v}`)}.`, run: (c) => show(c, lines[0]) },
      { cap: `Solve for the position: add 3, then divide by 5. ${T(`n=${nTex}`)}.`, run: async (c) => { await show(c, lines[1]); await show(c, lines[2]); } },
      { cap: verdictCap, run: async (c) => { ZP.style.opacity = 1; await appear(c, ZP, 200); Z.el.style.opacity = 1; await appear(c, Z.el, 300); zf.style.opacity = 1; await pop(c, zf); zfl.style.opacity = 1; if (!isNat) await shake(c, zf); await show(c, res); await stampIn(c, st); } }
    ];
  }
};

/* =============================== explainer: dots, linear or not (Example 5) =============================== */
const DT = {
  a: { label: 'Example 5(a)', vals: [2, 5, 8, 11, 14], ymax: 16, ystep: 1, ylab: 2, kind: 'a', ex: 'Example 5(a)' },
  b: { label: 'Example 5(b)', vals: [1, 2, 4, 8, 16], ymax: 16, ystep: 1, ylab: 2, kind: 'g', ex: 'Example 5(b)' },
  c: { label: T('20,\\ 17,\\ 14,\\ 11,\\ 8'), vals: [20, 17, 14, 11, 8], ymax: 22, ystep: 1, ylab: 2, kind: 'a' },
  d: { label: T('48,\\ 24,\\ 12,\\ 6,\\ 3'), vals: [48, 24, 12, 6, 3], ymax: 52, ystep: 4, ylab: 8, kind: 'g' }
};
const dots = {
  title: 'Dots on a graph: linear or not?',
  height: 470,
  minW: 900,
  choices: [{ v: 'a', label: DT.a.label }, { v: 'b', label: DT.b.label }, { sep: 'More:' }, { v: 'c', label: DT.c.label }, { v: 'd', label: DT.d.label }],
  intro: (k) => `Plot ${T(DT[k].vals.join(',\\ '))} as points ${T('(n,\\ t_n)')}. Press <b>Next</b>.`,
  ask: (k) => (DT[k].ex ? `<b>${DT[k].ex}.</b> ` : '') + `Plot ${T(DT[k].vals.join(',\\ '))}. Linear or non-linear?`,
  make(stage, k, ex) {
    const d = DT[k], W = ex.W, v = d.vals, N = v.length;
    const G = new Graph(stage, { x: 10, y: 26, width: 520, height: 440, xmin: 0, xmax: 6, ymin: 0, ymax: d.ymax, xstep: 1, ystep: d.ystep, xlabels: 1, ylabels: d.ylab, xtitle: 'n', ytitle: 't_n', origin: true, fontSize: 15 });
    const P = panel(stage, 560, 6, W - 570, 456, `${T('(n,\\ t_n)')}`);
    const rows = v.map((y, i) => { const r = h('div', 'u1l1-prow', `${T(pairTex(i + 1, y))}`); P.appendChild(r); hide(r); return r; });
    const stepsEl = h('div', 'u1l1-prise'); P.appendChild(stepsEl); hide(stepsEl);
    const ver = h('div', 'u1l1-pver'); P.appendChild(ver); hide(ver);
    const pts = v.map((y, i) => { const p = G.point(i + 1, y, { color: i === 0 ? T1 : BR, r: 8 }); hide(p); return p; });
    const rises = v.slice(1).map((y, i) => y - v[i]);
    const tris = rises.map((r, i) => {
      const a = G.toPx(i + 1, v[i]), b = G.toPx(i + 2, v[i]), cc = G.toPx(i + 2, v[i + 1]);
      const g = svgEl('g', {}, G.layers.data);
      svgEl('path', { class: 'bk-stroke', d: `M${a[0]} ${a[1]} L${b[0]} ${b[1]}`, stroke: GRAY, 'stroke-width': 3, fill: 'none', 'stroke-dasharray': '5 4' }, g);
      svgEl('path', { class: 'bk-stroke', d: `M${b[0]} ${b[1]} L${cc[0]} ${cc[1]}`, stroke: AMB, 'stroke-width': 4.5, fill: 'none', 'stroke-linecap': 'round' }, g);
      g.style.opacity = 0;
      const l = h('div', 'bk-lab u1l1-rlab', T((r > 0 ? '+' : '') + r)); G.html.appendChild(l); place(l, b[0] + 6, (b[1] + cc[1]) / 2, 'e', 2); hide(l);
      return { g, l };
    });
    const lin = d.kind === 'a';
    const ruler = lin ? G.line([1, v[0]], [2, v[1]], { color: '#d9c18e', width: 18, arrows: false }) : G.line([1, v[0]], [2, v[1]], { color: '#d9c18e', width: 18, arrows: false });
    hide(ruler);
    const probe = G.vline(1.5); hide(probe);
    const ghost = G.point(1.5, (v[0] + v[1]) / 2, { color: RED, r: 9, open: true, label: `${T('t_{1.5}')}?`, pos: 'nw', labelCls: 'u1l1-ghostlab' }); hide(ghost); if (ghost.label) hide(ghost.label);
    stepsEl.innerHTML = `rises: ${T(rises.map((r) => cD((r > 0 ? '+' : '') + r)).join(',\\ '))}`;
    ver.innerHTML = lin ? `<b>Linear</b><br>arithmetic, ${T(cD('d=' + rises[0]))}` : `<b>Non-linear</b><br>geometric, ${T(cD('r=' + (v[1] / v[0] === 0.5 ? '\\tfrac{1}{2}' : v[1] / v[0])))}`;
    ver.classList.add(lin ? 'u1l1-pv-lin' : 'u1l1-pv-non');
    const rWord = rises.map((r) => (r > 0 ? '+' : '') + r).join(',\\ ');
    return [
      { cap: `Each term is a point ${T('(n,\\ t_n)')}: position across, term up. ${T(pairTex(1, v[0]))}, ${T(pairTex(2, v[1]))}, …`,
        run: async (c) => { for (let i = 0; i < N; i++) { await G.reveal(pts[i], c); rows[i].style.opacity = 1; } } },
      { cap: `Step from dot to dot: right 1, then ${v[1] > v[0] ? 'up' : 'down'} by the change. ${lin ? `Every step is the same, ${T(cD(rWord.split(',')[0]))}.` : `The steps ${T(cD(rWord))} keep ${v[1] > v[0] ? 'growing' : 'shrinking'}.`}`,
        run: async (c) => { for (const t of tris) { t.g.style.opacity = 1; await drawIn(t.g, 300, c); await pop(c, t.l, 200); } await show(c, stepsEl); } },
      { cap: lin ? `A ruler lies along every dot: the points are on a line. <b>Linear</b> (arithmetic).` : `A ruler through the first two dots misses the rest: the points <b>curve</b>. <b>Non-linear</b> (geometric).`,
        run: async (c) => { ruler.style.opacity = 0.55; await G.drawIn(ruler, 700, c); await show(c, ver); } },
      { cap: `Why not join the dots? Try ${T('n=1.5')}: there is no “1.5th term”. The domain is ${T('1,\\ 2,\\ 3,\\ \\dots')}, so the graph is <b>separate dots</b>.`,
        run: async (c) => { probe.style.opacity = 1; await G.drawIn(probe, 400, c); ghost.style.opacity = 1; if (ghost.label) ghost.label.style.opacity = 1; await pop(c, ghost); await shake(c, ghost); } }
    ];
  }
};

/* =============================== Stand Up Break =============================== */
const suSeq = (a) => a.join(',\\ ') + ',\\ \\dots';
const su = (s) => String(s);
function suLin(a, b) { return `t_n=${a === 1 ? '' : a === -1 ? '-' : a}n${b === 0 ? '' : b > 0 ? '+' + b : b}`; }
standup('u1l1', {
  intro: 'Whiteboards: subtract, then divide, then decide. Then use a formula for t_n.',
  levels: {
    BEG: (r) => { // classify + d or r + next term
      const kind = r.pick(['a', 'a', 'g', 'g', 'n']);
      let s, a;
      if (kind === 'a') { const t1 = r.int(-12, 30), d = r.pick([-9, -8, -7, -6, -5, -4, -3, 3, 4, 5, 6, 7, 8, 9, 11]); s = [0, 1, 2, 3].map((i) => t1 + i * d); a = [`\\text{differences all }${d}`, `\\text{arithmetic, }d=${d}`, `\\text{next term: }${t1 + 4 * d}`]; }
      else if (kind === 'g') { const t1 = r.pick([1, 2, 3, 4, 5, -2, -3]), q = r.pick([2, 3, -2]); s = [0, 1, 2, 3].map((i) => t1 * q ** i); a = [`\\text{ratios all }${q}`, `\\text{geometric, }r=${q}`, `\\text{next term: }${t1 * q ** 4}`]; }
      else { const p = r.pick(['sq', 'tri', 'odd']); if (p === 'sq') { const k = r.int(1, 5); s = [0, 1, 2, 3].map((i) => (i + 1) ** 2 + k); a = [`\\text{differences }3,\\ 5,\\ 7\\text{: not equal}`, `\\text{ratios not equal: neither}`, `\\text{next term: }${25 + k}`]; } else if (p === 'tri') { s = [3, 6, 10, 15]; a = ['\\text{differences }3,\\ 4,\\ 5\\text{: not equal}', '\\text{ratios not equal: neither}', '\\text{next term: }21']; } else { s = [2, 3, 5, 9]; a = ['\\text{differences }1,\\ 2,\\ 4\\text{: not equal}', '\\text{ratios }1.5,\\ 1.67,\\ 1.8\\text{: not equal}', '\\text{neither; next term: }17']; } }
      return { text: 'Arithmetic, geometric or neither? State <i>d</i> or <i>r</i> if there is one, then give the next term.', q: suSeq(s), a };
    },
    PRG: (r) => { // first four terms + t_k from t_n = an + b
      const A = r.pick([2, 3, 4, 6, 7, 8, -2, -3, -5]), B = r.pick([-9, -7, -4, -1, 1, 3, 5, 10, 20]), k = r.int(12, 45);
      const terms = [1, 2, 3, 4].map((n) => A * n + B);
      return { text: `Write the first four terms, then find <i>t</i><sub>${k}</sub>.`, q: suLin(A, B),
        a: [`t_1=${A}(1)${B >= 0 ? '+' : ''}${B}=${terms[0]}`, `${terms.join(',\\ ')},\\ \\dots`, `t_{${k}}=${A}(${k})${B >= 0 ? '+' : ''}${B}=${A * k + B}`] };
    },
    MAS: (r) => { // is V a term?
      const A = r.pick([3, 4, 6, 7, 8]), B = r.pick([-5, -2, 1, 2, 5, 9]), yes = r.chance(0.5), n = r.int(15, 40);
      const V = yes ? A * n + B : A * n + B + r.int(1, A - 1), nv = (V - B) / A, nT = Number.isInteger(nv) ? su(nv) : su(parseFloat(nv.toFixed(3)));
      return { text: `Is ${V} a term of this sequence? If so, which term?`, q: suLin(A, B),
        a: [`${suLin(A, B).slice(4)}=${V}`, `${A}n=${V - B}`, `n=${nT}`, yes ? `\\text{Yes: }${V}=t_{${nv}}` : `\\text{not a natural number, so }${V}\\text{ is not a term}`] };
    }
  }
});

/* =============================== mount =============================== */
mountStreet();
mountFigures();
export const explainers = mountExplainers({ machine, twoWays, cups, hopTest, shapes, finite, isTerm, dots });
export const _test = { MS, HT, SH, IT, DT, Q, qsub, qdiv };
