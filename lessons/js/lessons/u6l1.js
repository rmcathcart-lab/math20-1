/* Math 20-1 · Unit 6 · Lesson 1 — Rational Expressions and Non-Permissible Values.
 * New lesson format (2026-11-11): the warm-up is plain markup on the page (no code). Explainers:
 *   machine (STAR: a value machine. x drops in the hopper, the gears turn, the numerator and the denominator are worked
 *     out separately and the screen shows the value; a 0 on top is fine, a 0 underneath shakes the machine and its
 *     screen says ERROR: DIVIDE BY 0. A demo and the Example 2 check),
 *   zero (why ÷ 0 has no value: a try-everything table for k × 0 = 12 and for 0 ÷ 0; then the machine fed values
 *     closer and closer to 3 (Example 3): the outputs blow up on both sides, fly off the graph, and x = 3 stamps ERROR),
 *   punch (the NPV procedure, step numbers beside the steps: factor the denominator fully (Ryan's X for the two
 *     numbers), each factor = 0, solve, and a hole punch knocks a hole in the number line at each NPV.
 *     Example 4, 5 and 6 checks),
 *   twins (same values, different restrictions: two machines fed the same x side by side, a comparator light and a
 *     table; the one mismatch is stamped, then the number lines show the extra hole. A demo and the Example 7 check),
 *   build (work backwards: holes on the number line drop their factors into the denominator, which is then expanded;
 *     Example 8 (a)–(c), and (e): find k, factor with the X, punch the other hole),
 *   boat (Example 9: the boat chugs upstream against the current in step with the graph of t = 36/(v − 3);
 *     at v = 3 it never arrives, below 3 it drifts backwards; v > 3 shades the axis).
 * Colours for the unit: numerator green, denominator blue, NPVs / holes / ERROR red. Calculator allowed. */
import {
  h, tex, add, box, stamp, stampIn, mountExplainers, pop, fadeIn, sleep, svgEl, pulse, shake, anim, COLORS,
  Graph, NumberLine, ValueTable
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const NC = COLORS.green, DC = COLORS.blue, RED = COLORS.red, INK = COLORS.ink, SL = COLORS.slate;
const show = (c, el, ms = 320) => fadeIn(c, el, ms);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const r6 = (v) => { const r = Math.round(v * 1e6) / 1e6; return Object.is(r, -0) ? 0 : r; };
const nt = (v) => String(r6(v));                     // a number as TeX (minus sign from KaTeX)
const sgn = (k) => (k < 0 ? '-' : '+');
const mono = (k, m = '') => (m ? (k === 1 ? m : k === -1 ? '-' + m : k + m) : String(k));
/** TeX of a polynomial from [[k, m], …] (k = 0 terms dropped) */
const poly = (ts) => ts.filter(([k]) => k !== 0).map(([k, m], i) => (i ? ` ${sgn(k)} ${mono(Math.abs(k), m)}` : mono(k, m))).join('');
/** p/q reduced, as TeX (\frac, sign in front) */
function fracT(p, q, d = false) {
  if (q < 0) { p = -p; q = -q; } const g = gcd(p, q) || 1; p /= g; q /= g;
  if (q === 1) return String(p);
  return (p < 0 ? '-' : '') + `\\${d ? 'dfrac' : 'frac'}{${Math.abs(p)}}{${q}}`;
}
const und = () => ({ html: '<span class="u6l1-und">undefined</span>' });
/** absolute position of el inside the stage */
function posIn(stage, el) { let x = 0, y = 0; while (el && el !== stage) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; } return [x, y]; }
async function fly(c, stage, src, dst, ms = 650) {
  const [x0, y0] = posIn(stage, src), [x1, y1] = posIn(stage, dst);
  const g = src.cloneNode(true); g.classList.add('u6l1-ghost'); g.style.opacity = 1; g.style.left = x0 + 'px'; g.style.top = y0 + 'px';
  stage.appendChild(g);
  try { await anim(c, g, [{ transform: 'translate(0,0)' }, { transform: `translate(${x1 - x0}px, ${y1 - y0}px)` }], ms); } finally { g.remove(); }
  dst.style.opacity = 1;
}

/* ============================ evaluating: numerator and denominator separately ============================ */
/* E = { numT, denT, num: [[coef, power], …], den: [[coef, power], …] } */
function evalE(E, xv) {
  const terms = (P) => P.map(([k, p]) => r6(k * Math.pow(xv, p)));
  const join = (vs) => vs.map((v, i) => (i === 0 ? nt(v) : v < 0 ? '-' + nt(-v) : '+' + nt(v))).join('');
  const tn = terms(E.num), td = terms(E.den), N = r6(tn.reduce((a, b) => a + b, 0)), D = r6(td.reduce((a, b) => a + b, 0));
  let work = `\\dfrac{\\textcolor{${NC}}{${join(tn)}}}{\\textcolor{${DC}}{${join(td)}}}`;
  if (tn.length > 1 || td.length > 1) work += `=\\dfrac{\\textcolor{${NC}}{${nt(N)}}}{\\textcolor{${DC}}{${nt(D)}}}`;
  if (D === 0) return { N, D, err: true, work, val: null, outT: null, lcdT: null };
  let outT;
  if (Number.isInteger(N) && Number.isInteger(D)) {
    outT = fracT(N, D, true);
    const g = gcd(N, D) || 1;
    if (D !== 1 && (g !== 1 || D < 0 || N <= 0)) work += '=' + outT;
    else if (D === 1) work += '=' + outT;
  } else { outT = nt(N / D); work += '=' + outT; }
  return { N, D, err: false, work, val: r6(N / D), outT, lcdT: outT.replace(/dfrac/g, 'frac') };
}
const xT = (v) => (Number.isInteger(v) || String(v).length < 7 ? nt(v) : fracT(Math.round(v * 3), 3));

/* a gear (for the machines) */
function gear(svg, cx, cy, r, n = 9) {
  const g = svgEl('g', { class: 'u6l1-gear' }, svg), pts = [];
  for (let i = 0; i < n * 4; i++) { const a = (i / (n * 4)) * 2 * Math.PI, rr = i % 4 < 2 ? r + 6 : r; pts.push(`${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)}`); }
  svgEl('polygon', { points: pts.join(' '), fill: '#c9c1ae', stroke: SL, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
  svgEl('circle', { cx, cy, r: r * 0.36, fill: '#f4efe5', stroke: SL, 'stroke-width': 2.5 }, g);
  return g;
}
const spin = (c, g, rev, ms = 900) => anim(c, g, [{ transform: 'rotate(0deg)' }, { transform: `rotate(${rev ? -360 : 360}deg)` }], ms);

/* The value machine. A box with a hopper; feed(c, x) drops "x = …" in, turns the gears, shows the numerator and
 * denominator worked out, then the value on its screen (or ERROR: DIVIDE BY 0, with a shake and a stamp). */
function machine(stage, x, y, w, H, E, o = {}) {
  const sm = !!o.sm, top = sm ? 34 : 46;
  const el = div(stage, 'u6l1-mach' + (sm ? ' u6l1-mach-sm' : ''), '', x, y, w, H);
  const sv = svgEl('svg', { class: 'u6l1-msvg', width: w, height: H }, el);
  const hw = sm ? 110 : 140;
  svgEl('path', { d: `M${w / 2 - hw / 2} 3 L${w / 2 + hw / 2} 3 L${w / 2 + 24} ${top} L${w / 2 - 24} ${top} Z`, fill: '#ddd5c4', stroke: SL, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, sv);
  const body = svgEl('rect', { x: 2, y: top, width: w - 4, height: H - top - 2, rx: 20, fill: '#f4efe5', stroke: SL, 'stroke-width': 4, class: 'u6l1-mbody' }, sv);
  const gr = sm ? 13 : 17, g1 = gear(sv, 30, top + 30, gr), g2 = gear(sv, w - 30, top + 30, gr, 8);
  [[16, H - 16], [w - 16, H - 16]].forEach(([cx, cy]) => svgEl('circle', { cx, cy, r: 4, fill: SL }, sv));
  const ex = div(el, 'u6l1-mx', T(`\\dfrac{\\textcolor{${NC}}{${E.numT}}}{\\textcolor{${DC}}{${E.denT}}}`)); ex.style.top = (top + (sm ? 6 : 12)) + 'px';
  const work = hide(div(el, 'u6l1-mw', '')); work.style.top = (top + (sm ? 70 : 102)) + 'px';
  const lcd = div(el, 'u6l1-lcd', ''); lcd.style.height = (sm ? 42 : 58) + 'px';
  const inp = hide(div(el, 'u6l1-in', ''));
  const st = hide(stamp(el, 'undefined', { ok: false, x: w - (sm ? 74 : 92), y: H - (sm ? 74 : 104), size: sm ? 'sm' : undefined }));
  const M = { el, ex, work, lcd, inp, st, body, H, w };
  M.reset = () => { hide(work); hide(st); lcd.innerHTML = ''; lcd.classList.remove('u6l1-lcd-err'); body.classList.remove('u6l1-err'); };
  /** r = evalE(E, xv) worked out in make() */
  M.feed = async (c, xv, r) => {
    M.reset();
    inp.innerHTML = T(`x=${xT(xv)}`);
    await anim(c, inp, [{ transform: 'translate(-50%, -54px)', opacity: 0 }, { transform: 'translate(-50%, -10px)', opacity: 1, offset: 0.6 }, { transform: 'translate(-50%, 0)', opacity: 1 }], 520);
    work.innerHTML = T(r.work);
    await Promise.all([spin(c, g1), spin(c, g2, true), anim(c, work, [{ opacity: 0 }, { opacity: 1 }], 600)]);
    if (r.err) {
      body.classList.add('u6l1-err'); lcd.classList.add('u6l1-lcd-err'); lcd.innerHTML = '<span>ERROR: DIVIDE BY 0</span>';
      await shake(c, el); await stampIn(c, st);
    } else { lcd.innerHTML = `<span>${T('=' + r.lcdT)}</span>`; await pop(c, lcd.firstChild, 360); }
  };
  return M;
}

/* ================================ 1. the value machine ================================ */
const MA = {
  demo: { numT: 'x-1', denT: 'x+2', num: [[1, 1], [-1, 0]], den: [[1, 1], [2, 0]], xs: [4, 0, 1, -2] },
  ex2: { numT: 'x^2-4x', denT: '2x+6', num: [[1, 2], [-4, 1]], den: [[2, 1], [6, 0]], xs: [5, -1, 4, -3] }
};
const machineDef = {
  title: 'The value machine', height: 420, capH: 86,
  choices: [{ v: 'demo', label: `Try it: ${T('\\frac{x-1}{x+2}')}` }, { v: 'ex2', label: 'Example 2 check' }],
  ask: (v) => `Evaluate ${T(`\\dfrac{${MA[v].numT}}{${MA[v].denT}}`)} for ${T('x=' + MA[v].xs.map(nt).join(',\\ '))}.`,
  make(stage, v, ex) {
    const E = MA[v], W = ex.W, M = machine(stage, 20, 10, 500, 404, E);
    const rs = E.xs.map((xv) => evalE(E, xv));
    const tb = new ValueTable(stage, { x: 580, y: 30, headers: ['x', `\\dfrac{${E.numT}}{${E.denT}}`], rows: E.xs.map((xv) => [xv, '']), hide: 1, tap: false, cellW: Math.min(170, (W - 610) / 2), cellH: 70 });
    tb.heads[1].classList.add('u6l1-thd');
    const steps = E.xs.map((xv, i) => {
      const r = rs[i];
      let cap;
      if (r.err) cap = `${T(`x=${nt(xv)}`)}: the <b>denominator</b> is ${T(`\\textcolor{${DC}}{${nt(r.D)}}`)}. ${T(`\\frac{${nt(r.N)}}{0}`)} has no value: the expression is <b>undefined</b>.`;
      else if (r.N === 0) cap = `${T(`x=${nt(xv)}`)}: the <b>numerator</b> is ${T(`\\textcolor{${NC}}{0}`)}. That is fine: ${T(`\\frac{0}{${nt(r.D)}}=0`)}.`;
      else cap = `${T(`x=${nt(xv)}`)}: work out the <b>numerator</b> ${T(`\\textcolor{${NC}}{${nt(r.N)}}`)} and the <b>denominator</b> ${T(`\\textcolor{${DC}}{${nt(r.D)}}`)} separately. The value is ${T(r.outT)}.`;
      return { cap, run: async (c) => { tb.highlight(i, true); await M.feed(c, xv, r); await tb.set(i, 1, r.err ? und() : r.outT, c); tb.highlight(i, false); } };
    });
    return steps;
  }
};

/* ================================ 2. why ÷ 0 has no value ================================ */
const ZK = [1, 12, -5, 1000, 1000000];
function zeroK(stage, ex) {
  const W = ex.W;
  const l1 = hide(div(stage, 'u6l1-zl', `${T('12\\div3=4')}<span class="u6l1-zb">because</span>${T('4\\times3=12')}&ensp;<span class="u6l1-ok">✓</span>`, 30, 20));
  const l2 = hide(div(stage, 'u6l1-zl', `${T('12\\div0=k\\ ?')}<span class="u6l1-zb">would need</span>${T('k\\times0=12')}`, 30, 104));
  const l3 = hide(div(stage, 'u6l1-zl', `${T('0\\div0=k\\ ?')}<span class="u6l1-zb">would need</span>${T('k\\times0=0')}`, 30, 270));
  const head = hide(div(stage, 'u6l1-zh', 'Try any k you like', W - 400, 14, 370));
  const rows = ZK.map((k, i) => {
    const kk = k >= 1000 ? k.toLocaleString('en-CA').replace(/,/g, '\\,') : String(k);
    const r = hide(div(stage, 'u6l1-zr', `<span>${T(`${k < 0 ? `(${kk})` : kk}\\times0=0`)}</span><span class="u6l1-zm"></span>`, W - 400, 56 + i * 58, 370, 50));
    return r;
  });
  const st1 = hide(stamp(stage, 'no value', { ok: false, x: 240, y: 200, size: 'lg' }));
  const st2 = hide(stamp(stage, 'no single value', { ok: false, x: 250, y: 370, size: 'lg' }));
  const mark = (txt, cls) => rows.forEach((r) => { const m = r.querySelector('.u6l1-zm'); m.innerHTML = txt; m.className = 'u6l1-zm ' + cls; });
  return [
    { cap: `Division <b>undoes</b> multiplication: ${T('12\\div3=4')} because ${T('4\\times3=12')}.`, run: (c) => show(c, l1) },
    { cap: `If ${T('12\\div0')} had a value ${T('k')}, then ${T('k\\times0')} would have to be ${T('12')}.`, run: (c) => show(c, l2) },
    { cap: `Try every ${T('k')} you like: small, negative, huge. ${T('k\\times0')} is <b>always 0</b>, never ${T('12')}.`, run: async (c) => {
      await show(c, head); mark(T('\\ne12') + ' ✗', 'u6l1-no');
      for (const r of rows) { await show(c, r, 220); await sleep(c, 120); }
    } },
    { cap: `No ${T('k')} works, so ${T('12\\div0')} has <b>no value</b>: it is <b>undefined</b>.`, run: (c) => stampIn(c, st1) },
    { cap: `What about ${T('0\\div0')}? Now ${T('k\\times0=0')} works for <b>every</b> ${T('k')}, so there is no single value. ${T('0\\div0')} is undefined too.`, run: async (c) => {
      await show(c, l3); mark(T('=0') + ' ✓', 'u6l1-yes'); await Promise.all(rows.map((r) => pulse(c, r, 1.04))); await stampIn(c, st2);
    } }
  ];
}
const EX3 = { numT: 'x+1', denT: 'x-3', num: [[1, 1], [1, 0]], den: [[1, 1], [-3, 0]] };
const EX3X = [2.9, 2.99, 3, 3.01, 3.1, 4];
const EX3ORDER = [5, 4, 3, 0, 1, 2]; // feed 4, 3.1, 3.01 (from the right), 2.9, 2.99 (from the left), then 3
function zeroEx3(stage, ex) {
  const W = ex.W, M = machine(stage, 8, 12, 372, 422, EX3);
  const rs = EX3X.map((xv) => evalE(EX3, xv));
  const cw = Math.floor((W - 400 - 120) / 6);
  const tb = new ValueTable(stage, { x: 396, y: 6, layout: 'h', headers: ['x', '\\dfrac{x+1}{x-3}'], rows: EX3X.map((xv) => [xv, '']), hide: 1, tap: false, cellW: cw, headW: 116, cellH: 56 });
  const G = new Graph(stage, { x: 396, y: 128, width: W - 404, height: 306, xmin: -1, xmax: 7, ymin: -60, ymax: 60, xstep: 1, ystep: 10, ylabels: 20, fontSize: 15 });
  const pts = {};
  const steps = [];
  const plot = (i) => async (c) => {
    const xv = EX3X[i], r = rs[i];
    if (Math.abs(r.val) <= 60) { const p = G.point(xv, r.val, { color: 'blue', label: `(${nt(xv)},\\ ${nt(r.val)})`, tex: true, pos: xv > 3 ? 'e' : 'w' }); pts[i] = p; await G.reveal(p, c); }
    else {
      const up = r.val > 0, lab = G.label(xv, up ? 57 : -57, `${up ? '↑' : '↓'} ${nt(r.val).replace('-', '−')}`, { pos: up ? 'e' : 'w', cls: 'u6l1-off', dx: up ? 4 : -4 });
      pts[i] = lab; await pop(c, lab, 380);
    }
  };
  EX3ORDER.forEach((i, k) => {
    const xv = EX3X[i], r = rs[i];
    let cap;
    if (r.err) cap = `${T('x=3')}: the denominator is ${T('0')}. ${T('\\frac{4}{0}')} has no value: <b>ERROR</b>. From the left the values are huge and negative, from the right huge and positive: no number fits at ${T('x=3')}.`;
    else if (k === 0) cap = `Start at ${T('x=4')}: ${T(`\\frac{5}{1}=5`)}.`;
    else if (k === 2) cap = `${T(`x=${nt(xv)}`)}: ${T(`\\frac{${nt(r.N)}}{${nt(r.D)}}=${nt(r.val)}`)}. Closer to 3 from the <b>right</b>: the values get <b>huge and positive</b>, off the graph.`;
    else if (k === 4) cap = `${T(`x=${nt(xv)}`)}: ${T(`\\frac{${nt(r.N)}}{${nt(r.D)}}=${nt(r.val)}`)}. Closer to 3 from the <b>left</b>: <b>huge and negative</b>.`;
    else cap = `${T(`x=${nt(xv)}`)}: the denominator is small, ${T(`\\frac{${nt(r.N)}}{${nt(r.D)}}=${nt(r.val)}`)}.`;
    steps.push({ cap, run: async (c) => { tb.highlight(i, true); await M.feed(c, xv, r); await tb.set(i, 1, r.err ? { html: '<span class="u6l1-und">undef.</span>' } : r.val, c); tb.highlight(i, false); if (!r.err) await plot(i)(c); } });
  });
  steps.push({ cap: `The graph of ${T('y=\\dfrac{x+1}{x-3}')} shoots up and down beside ${T('x=3')} and has <b>no point</b> at ${T('x=3')}.`, run: async (c) => {
    const f = G.fn('(x+1)/(x-3)', { color: 'blue', width: 3 }), vl = G.vline(3, { color: 'red' });
    await Promise.all([G.drawIn(f, 900, c), G.reveal(vl, c)]);
  } });
  return steps;
}
const zeroDef = {
  title: 'Why ÷ 0 has no value', height: 440, capH: 86,
  choices: [{ v: 'k', label: `${T('12\\div0')} and ${T('0\\div0')}` }, { v: 'ex3', label: 'Example 3: close to 3' }],
  ask: (v) => (v === 'k' ? `Does ${T('12\\div0')} have a value? Does ${T('0\\div0')}?` : `Evaluate ${T('\\dfrac{x+1}{x-3}')} for ${T('x')} close to ${T('3')}.`),
  make(stage, v, ex) { return v === 'k' ? zeroK(stage, ex) : zeroEx3(stage, ex); }
};

/* ================================ Ryan's X (two numbers) ================================ */
function pairsOf(n) { const out = []; for (let p = 1; p * p <= n; p++) if (n % p === 0) out.push([p, n / p]); return out; }
function signedPairs(ac, b) { return pairsOf(Math.abs(ac)).map(([p, q]) => (ac > 0 ? (b >= 0 ? [p, q] : [-p, -q]) : (b >= 0 ? [-p, q] : [p, -q]))); }
/* Ryan's X: ac on top, b underneath, the two numbers on the sides; the factor pairs listed beside it, the right one circled */
function ryanX(stage, cx, cy, r, ac, b, rowX, rowW) {
  const svg = svgEl('svg', { class: 'u6l1-ov', width: rowX + rowW, height: cy + r + 30 }, stage);
  const g = svgEl('g', {}, svg); g.style.opacity = 0;
  [[cx - r, cy - r, cx + r, cy + r], [cx + r, cy - r, cx - r, cy + r]].forEach(([x1, y1, x2, y2]) => svgEl('line', { x1, y1, x2, y2, stroke: COLORS.blue, 'stroke-width': 5, 'stroke-linecap': 'round' }, g));
  const v = (cls, html, x, y) => { const e = hide(div(stage, 'u6l1-xv ' + cls, html, x, y)); e.style.translate = '-50% -50%'; return e; };
  const top = v('u6l1-xtop', T(String(ac)), cx, cy - r * 0.6), bot = v('u6l1-xbot', T(String(b)), cx, cy + r * 0.62);
  const L = v('u6l1-xside', '', cx - r * 0.7, cy), R = v('u6l1-xside', '', cx + r * 0.7, cy);
  const pairs = signedPairs(ac, b), found = pairs.findIndex(([m, n]) => m + n === b), RH = 34, y0 = cy - (pairs.length * RH) / 2;
  const rows = pairs.map(([p, q], i) => hide(div(stage, 'u6l1-xp', `<span>${T(`${p}\\times${q < 0 ? `(${q})` : q}`)}</span><span class="u6l1-xps">${T(`\\text{sum }${p + q}`)}</span>`, rowX, y0 + i * RH, rowW, RH - 4)));
  return {
    pairs, found,
    async play(c) {
      g.style.opacity = 1; await anim(c, g, [{ opacity: 0 }, { opacity: 1 }], 300); await pop(c, top); await pop(c, bot);
      for (const e of rows) await show(c, e, 130);
      rows.forEach((e, i) => e.classList.add(i === found ? 'u6l1-xp-ok' : 'u6l1-xp-no'));
      if (found >= 0) { L.innerHTML = T(String(pairs[found][0])); R.innerHTML = T(String(pairs[found][1])); await pulse(c, rows[found], 1.06); await pop(c, L); await pop(c, R); }
    }
  };
}

/* ================================ hole punch on a number line ================================ */
function holeLine(stage, x, y, w, hh, min, max, o = {}) {
  const N = new NumberLine(stage, { x, y, width: w, height: hh, min, max, step: 1, axisY: o.axisY || hh - 50, fontSize: 18 });
  if (o.vname) div(stage, 'u6l1-nlv', T(o.vname), x + w - 16, y + (o.axisY || hh - 50) - 40);
  const ay = y + (o.axisY || hh - 50), X = (v) => x + N.toPx(v);
  const svg = svgEl('svg', { class: 'u6l1-ov', width: x + w, height: y + hh }, stage);
  const P = svgEl('g', { class: 'u6l1-punch' }, svg);
  svgEl('rect', { x: -30, y: -78, width: 60, height: 22, rx: 9, fill: COLORS.brand }, P);
  svgEl('rect', { x: -6, y: -56, width: 12, height: 34, fill: '#c9c1ae', stroke: SL, 'stroke-width': 2.5 }, P);
  svgEl('rect', { x: -16, y: -24, width: 32, height: 22, rx: 4, fill: SL }, P);
  const up = ay - (o.lift || 40), down = ay - 6, x0 = x + w - 60;
  let px = x0;
  const put = (a, b) => { P.style.transform = `translate(${a}px, ${b}px)`; };
  put(x0, up); P.style.opacity = 0;
  const holes = [];
  const L = {
    N, X, ay,
    async enter(c) { P.style.opacity = 1; await anim(c, P, [{ opacity: 0 }, { opacity: 1 }], 250); },
    async punch(c, v, label) {
      const tx = X(v);
      await anim(c, P, [{ transform: `translate(${px}px, ${up}px)` }, { transform: `translate(${tx}px, ${up}px)` }], 520); px = tx;
      await anim(c, P, [{ transform: `translate(${tx}px, ${up}px)` }, { transform: `translate(${tx}px, ${down}px)` }], 200);
      const hole = N.point(v, { open: true, color: RED, r: 11, label, tex: true, pos: 'n' });
      if (hole.label) hole.label.classList.add('u6l1-holelab');
      holes.push(hole);
      const chip = svgEl('circle', { cx: tx, cy: ay, r: 9, fill: '#e9e2d2', stroke: SL, 'stroke-width': 1.5 }, svg);
      await Promise.all([
        anim(c, P, [{ transform: `translate(${tx}px, ${down}px)` }, { transform: `translate(${tx}px, ${up}px)` }], 260),
        pop(c, hole, 300),
        anim(c, chip, [{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(60px)', opacity: 0 }], 600)
      ]);
      chip.remove();
    },
    async miss(c) { await shake(c, P); },
    hole: (v, label) => { const p = N.point(v, { open: true, color: RED, r: 11, label, tex: true, pos: 'n' }); if (p.label) p.label.classList.add('u6l1-holelab'); return p; },
    async leave(c) { await anim(c, P, [{ opacity: 1 }, { opacity: 0 }], 250); }
  };
  return L;
}

/* ================================ 4. NPV procedure (punch) ================================ */
const PU = {
  '4c': { ex: '\\dfrac{m^2+4}{12-3m}', v: 'm', min: -2, max: 8,
    rows: [{ t: '12-3m=0', cap: `<b>Step 1:</b> only the <b>denominator</b> matters. Set it equal to ${T('0')}.` },
      { t: '12=3m\\ \\Rightarrow\\ m=4', cap: `<b>Step 2:</b> solve: ${T('m=4')}.` },
      { t: 'm\\ne4', ans: true, holes: [[4, '4']], cap: `<b>Step 3:</b> punch a hole at ${T('m=4')}: the expression has no value there. <b>NPV:</b> ${T('m\\ne4')}.` }] },
  '4d': { ex: '\\dfrac{x}{7x+2}', min: -2, max: 2,
    rows: [{ t: '7x+2=0', cap: `<b>Step 1:</b> set the denominator equal to ${T('0')}.` },
      { t: '7x=-2\\ \\Rightarrow\\ x=-\\frac{2}{7}', cap: `<b>Step 2:</b> solve: ${T('x=-\\frac{2}{7}')}. A fraction is fine.` },
      { t: 'x\\ne-\\frac{2}{7}', ans: true, holes: [[-2 / 7, '-\\tfrac{2}{7}']], cap: `<b>Step 3:</b> punch the hole just left of ${T('0')}. <b>NPV:</b> ${T('x\\ne-\\frac{2}{7}')}.` }] },
  '4f': { ex: '\\dfrac{3x}{x^2+16}', min: -6, max: 6,
    rows: [{ t: 'x^2+16=0\\ ?', cap: `<b>Step 1:</b> set the denominator equal to ${T('0')}. Can it ever be ${T('0')}?` },
      { t: 'x^2\\ge0,\\ \\text{so}\\ x^2+16\\ge16', cap: `<b>Step 2:</b> a square is never negative, so ${T('x^2+16')} is always at least ${T('16')}: <b>never</b> ${T('0')}.` },
      { t: '\\text{no NPVs}', ans: true, holes: [], cap: `<b>Step 3:</b> nothing to punch. ${T('\\dfrac{3x}{x^2+16}')} has <b>no NPVs</b>.` }] },
  '5a': { ex: '\\dfrac{x-4}{x^2+2x-15}', min: -7, max: 5, X: [-15, 2],
    rows: [{ t: 'x^2+2x-15=(x+5)(x-3)', x: true, cap: `<b>Step 1:</b> factor the denominator fully. Two numbers with product ${T('-15')} and sum ${T('2')}: ${T('5')} and ${T('-3')}.` },
      { t: 'x+5=0\\qquad x-3=0', cap: `<b>Step 2:</b> set <b>each factor</b> equal to ${T('0')}.` },
      { t: 'x=-5\\qquad x=3', cap: `<b>Step 3:</b> solve each one.` },
      { t: 'x\\ne-5,\\ 3', ans: true, holes: [[-5, '-5'], [3, '3']], cap: `<b>Step 4:</b> punch the holes. <b>NPVs:</b> ${T('x\\ne-5,\\ 3')}.` }],
    extra: { at: 4, cap: `The numerator ${T('x-4')} is ignored: at ${T('x=4')} the value is ${T('\\frac{0}{9}=0')}, which is allowed.` } },
  '5d': { ex: '\\dfrac{1}{2x^2+7x-4}', min: -6, max: 3, X: [-8, 7],
    rows: [{ t: '2x^2+8x-x-4=(2x-1)(x+4)', x: true, cap: `<b>Step 1:</b> factor fully. ${T('ac=-8')}: two numbers with product ${T('-8')} and sum ${T('7')} are ${T('8')} and ${T('-1')}. Split and group.` },
      { t: '2x-1=0\\qquad x+4=0', cap: `<b>Step 2:</b> set each factor equal to ${T('0')}.` },
      { t: 'x=\\frac{1}{2}\\qquad x=-4', cap: `<b>Step 3:</b> solve each one.` },
      { t: 'x\\ne\\frac{1}{2},\\ -4', ans: true, holes: [[0.5, '\\tfrac{1}{2}'], [-4, '-4']], cap: `<b>Step 4:</b> punch the holes. <b>NPVs:</b> ${T('x\\ne\\frac{1}{2},\\ -4')}.` }] },
  '5f': { ex: '\\dfrac{5}{x^3-9x}', min: -5, max: 5,
    rows: [{ t: 'x^3-9x=x(x^2-9)=x(x-3)(x+3)', cap: `<b>Step 1:</b> factor fully: the common factor ${T('x')} first, then ${T('x^2-9')} is a difference of squares.` },
      { t: 'x=0\\qquad x-3=0\\qquad x+3=0', cap: `<b>Step 2:</b> set each factor equal to ${T('0')}. The factor ${T('x')} counts too.` },
      { t: 'x=0\\qquad x=3\\qquad x=-3', cap: `<b>Step 3:</b> solve each one.` },
      { t: 'x\\ne0,\\ \\pm3', ans: true, holes: [[0, '0'], [3, '3'], [-3, '-3']], cap: `<b>Step 4:</b> three holes. <b>NPVs:</b> ${T('x\\ne0,\\ \\pm3')}.` }] },
  '6c': { ex: '\\dfrac{x}{x-1}+\\dfrac{2}{x^2+4x}', min: -6, max: 3,
    rows: [{ t: 'x-1\\quad\\text{and}\\quad x^2+4x=x(x+4)', cap: `<b>Step 1:</b> two fractions, so <b>every</b> denominator counts. Factor each one.` },
      { t: 'x-1=0\\qquad x=0\\qquad x+4=0', cap: `<b>Step 2:</b> set each factor equal to ${T('0')}.` },
      { t: 'x=1\\qquad x=0\\qquad x=-4', cap: `<b>Step 3:</b> solve each one.` },
      { t: 'x\\ne1,\\ 0,\\ -4', ans: true, holes: [[1, '1'], [0, '0'], [-4, '-4']], cap: `<b>Step 4:</b> punch all the holes. <b>NPVs:</b> ${T('x\\ne1,\\ 0,\\ -4')}.` }] }
};
const punchDef = {
  title: 'Find the NPVs: punch the holes', height: 440, capH: 86,
  choices: [{ sep: 'Example 4' }, { v: '4c', label: '(c)' }, { v: '4d', label: '(d)' }, { v: '4f', label: '(f)' },
    { sep: 'Example 5' }, { v: '5a', label: '(a)' }, { v: '5d', label: '(d)' }, { v: '5f', label: '(f)' }, { sep: 'Example 6' }, { v: '6c', label: '(c)' }],
  ask: (v) => `Determine the non-permissible values of ${T(PU[v].ex)}.`,
  make(stage, v, ex) {
    const d = PU[v], W = ex.W, RY = (i) => 12 + i * 62;
    const L = holeLine(stage, 20, 290, W - 40, 146, d.min, d.max, { axisY: 92, vname: d.v || 'x' });
    const X = d.X ? ryanX(stage, W - 262, 120, 56, d.X[0], d.X[1], W - 186, 172) : null;
    const rows = d.rows.map((r, i) => {
      const e = hide(div(stage, 'u6l1-row', `<span class="u6l1-sn">${i + 1}</span><span class="u6l1-rt${r.ans ? ' u6l1-ans' : ''}">${T(r.t)}</span>`, 18, RY(i)));
      return e;
    });
    const none = d.rows.some((r) => r.holes && !r.holes.length) ? hide(stamp(stage, 'no NPVs', { ok: true, x: W / 2, y: 318, size: 'lg' })) : null;
    const steps = d.rows.map((r, i) => ({
      cap: r.cap,
      run: async (c) => {
        if (r.x && X) await X.play(c);
        await show(c, rows[i]);
        if (r.holes) {
          await L.enter(c);
          if (!r.holes.length) { await L.miss(c); await L.leave(c); await stampIn(c, none); return; }
          for (const [hv, lab] of r.holes) await L.punch(c, hv, lab);
          await L.leave(c);
        }
      }
    }));
    if (d.extra) steps.push({ cap: d.extra.cap, run: async (c) => { const p = L.N.point(d.extra.at, { color: NC, r: 9, label: '\\tfrac{0}{9}=0\\ \\checkmark', tex: true, pos: 'n' }); await L.N.reveal(p, c); } });
    return steps;
  }
};

/* ================================ 5. same values, different restrictions ================================ */
const TW = {
  demo: { L: { numT: '2x-2', denT: 'x^2-1', num: [[2, 1], [-2, 0]], den: [[1, 2], [-1, 0]] }, R: { numT: '2', denT: 'x+1', num: [[2, 0]], den: [[1, 1], [1, 0]] },
    xs: [-3, -1, 0, 1, 2], fac: 'x^2-1=(x-1)(x+1)', Ln: [[-1, '-1'], [1, '1']], Rn: [[-1, '-1']], LnT: 'x\\ne\\pm1', RnT: 'x\\ne-1', min: -4, max: 3 },
  ex7: { L: { numT: '3x+6', denT: 'x^2+5x+6', num: [[3, 1], [6, 0]], den: [[1, 2], [5, 1], [6, 0]] }, R: { numT: '3', denT: 'x+3', num: [[3, 0]], den: [[1, 1], [3, 0]] },
    xs: [-4, -3, -2, 0, 1, 2], fac: 'x^2+5x+6=(x+2)(x+3)', Ln: [[-3, '-3'], [-2, '-2']], Rn: [[-3, '-3']], LnT: 'x\\ne-2,\\ -3', RnT: 'x\\ne-3', min: -5, max: 3 }
};
const twinsDef = {
  title: 'Twin machines', height: 440, capH: 86,
  choices: [{ v: 'demo', label: `Try it: ${T('\\frac{2x-2}{x^2-1}')} and ${T('\\frac{2}{x+1}')}` }, { v: 'ex7', label: 'Example 7 check' }],
  ask: (v) => `Compare ${T(`\\dfrac{${TW[v].L.numT}}{${TW[v].L.denT}}`)} and ${T(`\\dfrac{${TW[v].R.numT}}{${TW[v].R.denT}}`)} for the same values of ${T('x')}.`,
  make(stage, v, ex) {
    const d = TW[v], W = ex.W, MW = Math.min(410, (W - 120) / 2);
    const A = machine(stage, 14, 10, MW, 232, d.L, { sm: true }), B = machine(stage, W - 14 - MW, 10, MW, 232, d.R, { sm: true });
    const cmp = div(stage, 'u6l1-cmp', '=', W / 2 - 32, 120, 64, 64);
    const rl = d.xs.map((xv) => evalE(d.L, xv)), rr = d.xs.map((xv) => evalE(d.R, xv));
    const cw = 92, hw = 176, tw = hw + cw * d.xs.length;
    const tb = new ValueTable(stage, { x: (W - tw) / 2, y: 254, layout: 'h', headers: ['x', `\\dfrac{${d.L.numT}}{${d.L.denT}}`, `\\dfrac{${d.R.numT}}{${d.R.denT}}`], rows: d.xs.map((xv) => [xv, '', '']), hide: (r, c) => c > 0, tap: false, cellW: cw, headW: hw, cellH: 58 });
    const same = (a, b) => (a.err && b.err) || (!a.err && !b.err && a.val === b.val);
    const di = d.xs.findIndex((xv, i) => !same(rl[i], rr[i]));
    const dst = hide(stamp(stage, 'different!', { ok: false, x: (W - tw) / 2 + hw + cw * di + cw / 2, y: 248, size: 'sm' }));
    // the number lines (shown at the end, where the machines were)
    const nl = hide(div(stage, 'u6l1-twnl', '', 0, 0, W, 246));
    const tagA = div(nl, 'u6l1-twtag', `${T(`\\dfrac{${d.L.numT}}{${d.L.denT}}`)}`, 16, 18), tagB = div(nl, 'u6l1-twtag', `${T(`\\dfrac{${d.R.numT}}{${d.R.denT}}`)}`, 16, 136);
    void tagA; void tagB;
    const NA = new NumberLine(nl, { x: 190, y: 0, width: W - 220, height: 116, min: d.min, max: d.max, axisY: 72, fontSize: 17 });
    const NB = new NumberLine(nl, { x: 190, y: 118, width: W - 220, height: 116, min: d.min, max: d.max, axisY: 72, fontSize: 17 });
    const ansA = hide(div(nl, 'u6l1-twans', T(d.LnT), W - 200, 10)), ansB = hide(div(nl, 'u6l1-twans', T(d.RnT), W - 200, 128));
    const lab = (r) => (r.err ? 'undefined' : T(r.outT));
    const steps = d.xs.map((xv, i) => {
      const ok = same(rl[i], rr[i]);
      const cap = `${T(`x=${nt(xv)}`)}: ${lab(rl[i])} and ${lab(rr[i])}. ${ok ? (rl[i].err ? 'Both undefined: <b>same</b>.' : '<b>Same</b> value.') : `<b>Different!</b> The first is ${T(`\\frac{0}{0}`)}, undefined; the second is ${T(rr[i].outT)}.`}`;
      return { cap, run: async (c) => {
        tb.highlight(i, true); cmp.className = 'u6l1-cmp'; cmp.innerHTML = '=';
        await Promise.all([A.feed(c, xv, rl[i]), B.feed(c, xv, rr[i])]);
        await Promise.all([tb.set(i, 1, rl[i].err ? und() : rl[i].outT, c), tb.set(i, 2, rr[i].err ? und() : rr[i].outT, c)]);
        cmp.className = 'u6l1-cmp ' + (ok ? 'u6l1-cmp-ok' : 'u6l1-cmp-no'); cmp.innerHTML = ok ? '✓' : '✗';
        await pop(c, cmp, 320);
        if (!ok) { await shake(c, cmp); await stampIn(c, dst); }
        tb.highlight(i, false);
      } };
    });
    steps.push({ cap: `Why? Factor: ${T(d.fac)}. The first has the NPVs ${T(d.LnT)}; the second only ${T(d.RnT)}.`, run: async (c) => {
      await Promise.all([anim(c, A.el, [{ opacity: 1 }, { opacity: 0 }], 300), anim(c, B.el, [{ opacity: 1 }, { opacity: 0 }], 300), anim(c, cmp, [{ opacity: 1 }, { opacity: 0 }], 300)]);
      await show(c, nl);
      for (const [hv, l] of d.Ln) { const p = NA.point(hv, { open: true, color: RED, r: 11, label: l, tex: true }); await pop(c, p, 300); }
      await show(c, ansA);
      for (const [hv, l] of d.Rn) { const p = NB.point(hv, { open: true, color: RED, r: 11, label: l, tex: true }); await pop(c, p, 300); }
      await show(c, ansB);
    } });
    steps.push({ cap: `Same values everywhere except one ${T('x')}: different restrictions. When we simplify (Lesson 2), the <b>original</b> NPVs must be kept.`, run: (c) => pulse(c, ansA, 1.12) });
    return steps;
  }
};

/* ================================ 6. build an expression backwards ================================ */
const BU = {
  a: { npvT: 'x\\ne-1,\\ 6', holes: [{ v: -1, t: '-1', f: '(x+1)' }, { v: 6, t: '6', f: '(x-6)' }], exp: 'x^2-5x-6', min: -3, max: 8,
    capF: `${T('x=-1')} comes from ${T('(x+1)')}, and ${T('x=6')} from ${T('(x-6)')}.`, chk: 'x=-1:\\ 1+5-6=0\\ \\checkmark\\qquad x=6:\\ 36-30-6=0\\ \\checkmark' },
  b: { npvT: 'x\\ne0,\\ \\frac{2}{3}', holes: [{ v: 0, t: '0', f: 'x' }, { v: 2 / 3, t: '\\tfrac{2}{3}', f: '(3x-2)' }], exp: '3x^2-2x', min: -2, max: 3,
    capF: `${T('x=0')} comes from the factor ${T('x')}. ${T('x=\\frac{2}{3}')} means ${T('3x=2')}, so it comes from ${T('(3x-2)')}.`, chk: 'x=\\tfrac{2}{3}:\\ 3\\cdot\\tfrac{4}{9}-\\tfrac{4}{3}=0\\ \\checkmark' },
  c: { npvT: 'x\\ne\\pm4', holes: [{ v: 4, t: '4', f: '(x-4)' }, { v: -4, t: '-4', f: '(x+4)' }], exp: 'x^2-16', min: -6, max: 6,
    capF: `${T('x=4')} comes from ${T('(x-4)')}, and ${T('x=-4')} from ${T('(x+4)')}.`, chk: 'x=\\pm4:\\ 16-16=0\\ \\checkmark' }
};
function buildE(stage, ex) {
  const W = ex.W, L = holeLine(stage, 20, 4, W - 40, 150, -8, 4, { axisY: 112, lift: 34 });
  const r1 = hide(div(stage, 'u6l1-row', `<span class="u6l1-sn">1</span><span class="u6l1-rt">${T('2^2+k(2)-12=0')}</span>`, 18, 166));
  const r2 = hide(div(stage, 'u6l1-row', `<span class="u6l1-sn">2</span><span class="u6l1-rt">${T('4+2k-12=0\\ \\Rightarrow\\ 2k=8\\ \\Rightarrow\\ k=4')}</span>`, 18, 226));
  const r3 = hide(div(stage, 'u6l1-row', `<span class="u6l1-sn">3</span><span class="u6l1-rt">${T('x^2+4x-12=(x+6)(x-2)')}</span>`, 18, 286));
  const r4 = hide(div(stage, 'u6l1-row', `<span class="u6l1-sn">4</span><span class="u6l1-rt u6l1-ans">${T('x+6=0:\\ \\text{the other NPV is }x=-6')}</span>`, 18, 346));
  const X = ryanX(stage, W - 262, 296, 54, -12, 4, W - 186, 172);
  let h2;
  return [
    { cap: `${T('x=2')} is an NPV, so the denominator is ${T('0')} when ${T('x=2')}. Substitute ${T('x=2')}.`, run: async (c) => { h2 = L.hole(2, '2'); await pop(c, h2, 300); await show(c, r1); } },
    { cap: `Solve for ${T('k')}: ${T('4+2k-12=0')}, so ${T('k=4')}.`, run: (c) => show(c, r2) },
    { cap: `The denominator is ${T('x^2+4x-12')}. Two numbers with product ${T('-12')} and sum ${T('4')}: ${T('6')} and ${T('-2')}.`, run: async (c) => { await X.play(c); await show(c, r3); } },
    { cap: `${T('x-2')} gives the NPV we knew; ${T('x+6=0')} gives the <b>other NPV</b>, ${T('x=-6')}.`, run: async (c) => { await L.enter(c); await L.punch(c, -6, '-6'); await L.leave(c); await show(c, r4); } }
  ];
}
function buildABC(stage, ex, d) {
  const W = ex.W, L = holeLine(stage, 20, 4, W - 40, 150, d.min, d.max, { axisY: 112, lift: 34 });
  const tiles = d.holes.map((o) => { const t = hide(div(stage, 'u6l1-tile', T(o.f), 0, 162)); t.style.left = (L.X(o.v) - t.offsetWidth / 2) + 'px'; return t; });
  const b1 = hide(div(stage, 'u6l1-sn u6l1-snb', '1', 18, 166));
  const fr = hide(div(stage, 'u6l1-fr', `<div class="u6l1-frn">${T('1')}</div><div class="u6l1-frd">${d.holes.map((o) => `<span class="u6l1-slot">${T(o.f)}</span>`).join('')}</div>`, 120, 236));
  const b2 = hide(div(stage, 'u6l1-sn u6l1-snb', '2', 66, 262));
  const slots = [...fr.querySelectorAll('.u6l1-slot')];
  const b3 = hide(div(stage, 'u6l1-sn u6l1-snb', '3', 470, 262));
  const exT = hide(div(stage, 'u6l1-rt u6l1-ans u6l1-exp', T(`=\\dfrac{1}{${d.exp}}`), 520, 240));
  const chk = hide(div(stage, 'u6l1-chk', `Check: ${T(d.chk)}`, 120, 368));
  return [
    { cap: `The NPVs ${T(d.npvT)} are the holes.`, run: async (c) => { for (const o of d.holes) await pop(c, L.hole(o.v, o.t), 300); } },
    { cap: `<b>Step 1:</b> each hole comes from a factor of the denominator. ${d.capF}`, run: async (c) => { await show(c, b1); for (const t of tiles) await pop(c, t, 340); } },
    { cap: `<b>Step 2:</b> put the factors in the denominator, with a numerator of ${T('1')}.`, run: async (c) => {
      fr.style.opacity = 1; slots.forEach(hide); await show(c, b2);
      for (let i = 0; i < tiles.length; i++) await fly(c, stage, tiles[i], slots[i], 600);
    } },
    { cap: `<b>Step 3:</b> expand the denominator: ${T(`\\dfrac{1}{${d.exp}}`)}.`, run: async (c) => { await show(c, b3); await show(c, exT); } },
    { cap: `Check: each NPV makes the expanded denominator ${T('0')}.`, run: (c) => show(c, chk) }
  ];
}
const buildDef = {
  title: 'Build it backwards', height: 420, capH: 86,
  choices: [{ sep: 'Example 8' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }, { v: 'c', label: '(c)' }, { v: 'e', label: '(e)' }],
  ask: (v) => (v === 'e' ? `${T('\\dfrac{1}{x^2+kx-12}')} has an NPV of ${T('x=2')}. Determine ${T('k')} and the other NPV.` : `Write a rational expression with a numerator of ${T('1')} and the denominator expanded that has ${T(BU[v].npvT)}.`),
  make(stage, v, ex) { return v === 'e' ? buildE(stage, ex) : buildABC(stage, ex, BU[v]); }
};

/* ================================ Example 9: up the river ================================ */
const BV = [15, 12, 6, 4, 3, 2];
const boatDef = {
  title: 'Up the river', height: 430, capH: 86,
  ask: `${T('t=\\dfrac{36}{v-3}')}: the time for ${T('36')} km upstream against a ${T('3')} km/h current.`,
  make(stage, v, ex) {
    const W = ex.W, SW = 590;
    const sv = svgEl('svg', { class: 'u6l1-ov', width: SW, height: 256 }, stage);
    svgEl('rect', { x: 0, y: 70, width: SW, height: 44, fill: '#dcebc8' }, sv);
    svgEl('rect', { x: 0, y: 114, width: SW, height: 92, fill: '#cfe3f6' }, sv);
    svgEl('rect', { x: 0, y: 206, width: SW, height: 44, fill: '#dcebc8' }, sv);
    for (let i = 0; i < 3; i++) {
      const ln = svgEl('line', { x1: 0, y1: 134 + i * 28, x2: SW, y2: 134 + i * 28, stroke: '#ffffff', 'stroke-width': 3, 'stroke-dasharray': '22 30', 'stroke-linecap': 'round' }, sv);
      svgEl('animate', { attributeName: 'stroke-dashoffset', values: '0;-52', dur: (1.4 + i * 0.3) + 's', repeatCount: 'indefinite' }, ln);
    }
    const dock = (x) => { svgEl('rect', { x: x - 14, y: 104, width: 28, height: 22, fill: '#a37b4f', stroke: SL, 'stroke-width': 2 }, sv); };
    const AX = 70, BX = 520; dock(AX); dock(BX);
    svgEl('line', { x1: AX, y1: 44, x2: BX, y2: 44, stroke: SL, 'stroke-width': 2.5 }, sv);
    [[AX, 1], [BX, -1]].forEach(([x, s]) => svgEl('path', { d: `M${x} 44 l${12 * s} -7 l0 14 z`, fill: SL }, sv));
    div(stage, 'u6l1-blab', `${T('36')} km`, (AX + BX) / 2 - 36, 12);
    div(stage, 'u6l1-blab u6l1-cur', `current ${T('3')} km/h →`, 360, 214);
    div(stage, 'u6l1-blab u6l1-sm', 'finish', AX - 26, 76); div(stage, 'u6l1-blab u6l1-sm', 'start', BX - 20, 76);
    const boat = svgEl('g', { class: 'u6l1-boat' }, sv);
    svgEl('path', { d: 'M-46 -8 L40 -8 L30 12 L-34 12 Z', fill: COLORS.brand, stroke: SL, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, boat);
    svgEl('rect', { x: -10, y: -28, width: 34, height: 20, rx: 4, fill: '#fff', stroke: SL, 'stroke-width': 2.5 }, boat);
    svgEl('rect', { x: -4, y: -23, width: 9, height: 9, fill: '#bcd7f3' }, boat);
    const by = 160, place = (x) => { boat.style.transform = `translate(${x}px, ${by}px)`; };
    place(BX - 10);
    const info = div(stage, 'u6l1-binfo', T('\\text{speed upstream}=v-3\\ \\text{km/h}'), 14, 262, SW - 20);
    const line2 = hide(div(stage, 'u6l1-binfo u6l1-b2', '', 14, 318, SW - 20));
    const st = hide(stamp(stage, 'never arrives', { ok: false, x: 300, y: 98 }));
    const st2 = hide(stamp(stage, 'makes no sense', { ok: false, x: 300, y: 98 }));
    const G = new Graph(stage, { x: SW + 14, y: 22, width: W - SW - 22, height: 404, xmin: 0, xmax: 18, ymin: -40, ymax: 40, xstep: 1, ystep: 5, xlabels: 2, ylabels: 10, xtitle: 'v', ytitle: 't', fontSize: 15 });
    const data = BV.map((vv) => { const s = vv - 3; return { v: vv, s, t: s === 0 ? null : 36 / s }; });
    const go = (d) => async (c) => {
      hide(st); hide(st2); place(BX - 10);
      line2.innerHTML = T(d.t == null ? `v=3:\\ \\ 3-3=0\\ \\text{km/h},\\quad t=\\dfrac{36}{0}\\ \\text{(no value)}` : `v=${d.v}:\\ \\ ${d.v}-3=${d.s}\\ \\text{km/h},\\quad t=\\dfrac{36}{${d.s}}=${nt(d.t)}\\ \\text{h}`);
      await show(c, line2);
      if (d.t == null) {
        await anim(c, boat, [0, -6, 0, -6, 0, -6, 0].map((dy) => ({ transform: `translate(${BX - 10}px, ${by + dy}px)` })), 1500);
        await stampIn(c, st); const vl = G.vline(3, { color: 'red' }); await G.reveal(vl, c); return;
      }
      if (d.t < 0) {
        await anim(c, boat, [{ transform: `translate(${BX - 10}px, ${by}px)` }, { transform: `translate(${BX + 40}px, ${by}px)` }], 1400); await stampIn(c, st2);
        const p = G.point(d.v, d.t, { color: RED, label: `(${d.v},\\ ${nt(d.t)})`, tex: true, pos: 'e' }); await G.reveal(p, c); return;
      }
      const ms = Math.min(2800, 700 + d.t * 120);
      await anim(c, boat, [{ transform: `translate(${BX - 10}px, ${by}px)` }, { transform: `translate(${AX + 20}px, ${by}px)` }], ms, { easing: 'linear' });
      const p = G.point(d.v, d.t, { color: 'blue', label: `(${d.v},\\ ${nt(d.t)})`, tex: true, pos: d.v === 4 || d.v === 15 ? 'ne' : d.v === 12 ? 'nw' : 'n' }); await G.reveal(p, c);
    };
    const caps = {
      15: `${T('v=15')}: the boat goes ${T('15-3=12')} km/h upstream, so ${T('t=\\frac{36}{12}=3')} h.`,
      12: `${T('v=12')}: ${T('9')} km/h upstream, ${T('t=\\frac{36}{9}=4')} h.`,
      6: `A slower boat, ${T('v=6')}: only ${T('3')} km/h upstream, ${T('t=12')} h.`,
      4: `${T('v=4')}: ${T('1')} km/h, ${T('t=36')} h. The closer ${T('v')} gets to ${T('3')}, the longer the trip.`,
      3: `${T('v=3')}: the boat moves upstream at ${T('0')} km/h. It <b>never arrives</b>, and ${T('\\frac{36}{0}')} has no value. <b>NPV:</b> ${T('v\\ne3')}.`,
      2: `${T('v=2')}: ${T('-1')} km/h, the current carries the boat <b>backwards</b>. ${T('t=-36')} h: a negative time makes no sense.`
    };
    const steps = data.map((d) => ({ cap: caps[d.v], run: go(d) }));
    steps.push({ cap: `So ${T('v\\ne3')}, and in this context only ${T('v>3')} makes sense.`, run: async (c) => {
      const f = G.fn((x) => 36 / (x - 3), { from: 3.05, to: 18, color: 'blue', width: 3 }); const sh = G.shadeX(3, Infinity, { openA: true, color: 'green' });
      await G.drawIn(f, 900, c); await G.reveal(sh, c);
    } });
    return steps;
  }
};

/* ================================ Stand Up Break ================================ */
const VARS = ['x', 'x', 'a', 'm', 'y', 't'];
const npvList = (v, rs) => {
  const u = [...new Map(rs.map((r) => [r[0] / r[1], r])).values()];
  if (u.length === 2 && u[0][0] * u[1][1] === -u[1][0] * u[0][1] && u[0][0] !== 0) return `${v}\\ne\\pm${fracT(Math.abs(u[0][0]), Math.abs(u[0][1]))}`;
  return `${v}\\ne` + u.map(([p, q]) => fracT(p, q)).join(',\\ ');
};
const lin = (p, q, v) => `(${poly([[p, v], [q, '']])})`;
standup('u6l1', {
  intro: 'At your whiteboard: factor the denominator fully, set each factor equal to 0, and write the NPVs.',
  levels: {
    BEG: (r) => {
      const v = r.pick(VARS), top = r.pick([String(r.int(2, 9)), `${v}+${r.int(1, 9)}`, `${r.int(2, 5)}${v}`]);
      if (r.chance(0.2)) { const k = r.int(2, 9); return { q: `\\text{NPVs of }\\dfrac{${top}}{${k}${v}}`, a: [`${k}${v}=0`, `${v}\\ne0`] }; }
      const p = r.pick([1, 1, 2, 3, 4, 5, 6]), q = r.int(1, 9) * r.sign(), lead = r.chance(0.25);
      const den = lead ? poly([[q, ''], [-p, v]]) : poly([[p, v], [q, '']]);
      const root = lead ? fracT(q, p) : fracT(-q, p);
      return { q: `\\text{NPVs of }\\dfrac{${top}}{${den}}`, a: [`${den}=0`, `${v}=${root}`, `${v}\\ne${root}`] };
    },
    PRG: (r) => {
      const v = r.pick(['x', 'x', 'a', 'n', 'y']), top = r.pick([String(r.int(2, 9)), `${v}-${r.int(1, 9)}`, `${v}+${r.int(1, 9)}`]);
      const t = r.int(1, 3);
      if (t === 1) {
        let a = r.int(1, 8) * r.sign(), b = r.int(1, 8) * r.sign(); if (a === b) b = -a;
        const den = poly([[1, v + '^2'], [-(a + b), v], [a * b, '']]);
        return { q: `\\text{NPVs of }\\dfrac{${top}}{${den}}`, a: [`${den}=${lin(1, -a, v)}${lin(1, -b, v)}`, `${v}\\ne${a},\\ ${b}`] };
      }
      if (t === 2) { let s = r.int(2, 10); const k = r.pick([1, 1, 4, 9]), m = Math.sqrt(k); while (gcd(s, m) !== 1) s++; const den = poly([[k, v + '^2'], [-s * s, '']]); return { q: `\\text{NPVs of }\\dfrac{${top}}{${den}}`, a: [`${den}=${lin(m, -s, v)}${lin(m, s, v)}`, npvList(v, [[s, m], [-s, m]])] }; }
      const k = r.int(2, 5), n = r.int(1, 7) * r.sign(), den = poly([[k, v + '^2'], [-k * n, v]]);
      return { q: `\\text{NPVs of }\\dfrac{${top}}{${den}}`, a: [`${den}=${k}${v}${lin(1, -n, v)}`, `${v}\\ne0,\\ ${n}`] };
    },
    MAS: (r) => {
      for (let tries = 0; tries < 100; tries++) {
        const p = r.pick([2, 3, 5]), q = r.int(1, 7) * r.sign(), s = r.int(1, 6) * r.sign();
        if (gcd(p, q) !== 1) continue;
        const a = p, b = p * s + q, c0 = q * s; if (b === 0) continue;
        const den = poly([[a, 'x^2'], [b, 'x'], [c0, '']]);
        return { q: `\\text{NPVs of }\\dfrac{x+${r.int(1, 9)}}{${den}}`,
          a: [`ac=${a * c0}:\\ ${p * s},\\ ${q}`, `${lin(p, q, 'x')}${lin(1, s, 'x')}=0`, `x\\ne${fracT(-q, p)},\\ ${-s}`] };
      }
      return { q: '\\text{NPVs of }\\dfrac{1}{2x^2+7x-4}', a: ['(2x-1)(x+4)=0', 'x\\ne\\tfrac{1}{2},\\ -4'] };
    }
  }
});

/* ================================ mount ================================ */
export const explainers = mountExplainers({ machine: machineDef, zero: zeroDef, punch: punchDef, twins: twinsDef, build: buildDef, boat: boatDef });
export const _test = { evalE, fracT, PU, TW, BU, MA };
