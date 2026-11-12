/* Math 20-1 · Unit 1 · Lesson 1 — Patterns, Sequences and the General Term.
 * Static Example 5 grids and answer graphs, a Stand Up Break, and the explainers (the warm-up is plain markup in the
 * page, tools/newformat/specs/u1l1.py):
 *   machine (the sequence machine: feed n in, t_n drops into a row of terms and onto a dot plot; difference / ratio
 *     hops above the row; ruler test on the dots; Example 3 and Example 4 checks),
 *   hopTest (subtract, then divide: differences above the row, ratios below; Example 2 checks),
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
mountFigures();
export const explainers = mountExplainers({ machine, hopTest, isTerm, dots });
export const _test = { MS, HT, IT, DT, Q, qsub, qdiv };
