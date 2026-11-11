/* Math 20-1 · Unit 4 · Lesson 3 — Factoring by Substitution: a(f(x))² + b(f(x)) + c.
 * Warm-up (The Mystery Gift: every gift on a line holds the same number; unwrap one to find x² inside; try values of x;
 * the big one: x⁴ − 5x² + 4 = 0 has four solutions), and the explainers:
 *   spot (six trinomials: square the middle term's variable part, does it give the first term? quadratic form or not),
 *   boxIt (STAR: the substitution box. The repeated chunk is boxed, the boxes wrap to a gift-wrapped A, the trinomial
 *     factors in A, the boxes unwrap back and each factor is written out; concept x⁴ − 7x² + 12, x⁶ + 2x³ − 8;
 *     Example 1 checks),
 *   dos (difference of squares: two tests, then the split with the middle terms cancelling; a sum and x² − 7 don't split),
 *   tree (factor fully as a factor tree: GCF, the box, differences of squares, leaves checked; warm-up and Example 2),
 *   decomp (Example 3 both ways side by side: with A and directly, row by row the same work),
 *   acHunt (the box with a product–sum hunt table for a ≠ 1; Example 4 checks),
 *   boxBin (STAR, binomial: (x + 2) in the box, unwrap IN BRACKETS, simplify each factor, common factor; Example 5),
 *   race (substitute vs expand first, two lanes with stage tags and the product to hunt; Example 6 and 3(x + 4)²…),
 *   perfectSq (A² ± 2kA + k² as a square area grid → (A ± k)²; Example 7 checks),
 *   twoBox (any chunk: A = sin x; two boxes A and B; Example 8 checks).
 * Colours: box A amber, box B blue, finished answers green, mistakes red. No calculator in Unit 4. */
import {
  h, tex, add, box, mountExplainers, pop, fadeIn, sleep, anim, svgEl, pulse, stamp, stampIn, shake, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const AM = COLORS.amber, BL = COLORS.blue, GR = COLORS.green, RD = COLORS.red, GY = COLORS.gray;
const ca = (s) => `\\textcolor{${AM}}{${s}}`, cb = (s) => `\\textcolor{${BL}}{${s}}`;
const cg = (s) => `\\textcolor{${GR}}{${s}}`, cr = (s) => `\\textcolor{${RD}}{${s}}`;
/** captions and asks may hold $…$ TeX */
const md = (s) => (typeof s === 'string' ? s.replace(/\$([^$]+)\$/g, (_, t) => T(t)) : s);
function mdDef(def) {
  const mk = def.make, a = def.ask;
  def.make = function (stage, v, ex) { return (mk.call(this, stage, v, ex) || []).map((st) => Object.assign(st, { cap: typeof st.cap === 'string' ? md(st.cap) : st.cap })); };
  if (typeof a === 'function') def.ask = (v) => md(a(v)); else if (typeof a === 'string') def.ask = md(a);
  return def;
}
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const show = (c, el) => fadeIn(c, el, 320);
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
/* signed pieces of TeX: cst(3) "+3", cst(-3) "-3"; co(1,'A') "+A", co(-2,'A') "-2A" */
const cst = (n) => (n > 0 ? '+' + n : n < 0 ? String(n) : '');
const co = (n, v) => (n === 1 ? '+' + v : n === -1 ? '-' + v : n > 0 ? '+' + n + v : n < 0 ? n + v : '');
const lead = (n, v) => (n === 1 ? v : n === -1 ? '-' + v : n + v);

/* ====================================================================================================
 * The substitution box engine.
 * A line of working is a TeX string with boxes in it: ⟦A⟧ (wrapped: shows the letter), ⟦A:ub⟧ (unwrapped, with
 * brackets: shows (x + 2)), ⟦A:u⟧ (unwrapped, no brackets), and ⟦A:ub>w⟧ (appears unwrapped, then wraps).
 * A box may be followed by a power (⟦A:ub⟧^2): the power sits outside the box.
 * ==================================================================================================== */
const BOXRE = /⟦([AB])(?::(\w+)(?:>(\w+))?)?⟧(?:\^(\{[^}]*\}|\d))?/g;
function parseLine(s) {
  const out = []; let i = 0, m; BOXRE.lastIndex = 0;
  while ((m = BOXRE.exec(s))) {
    if (m.index > i) out.push({ t: 'tex', s: s.slice(i, m.index) });
    out.push({ t: 'box', k: m[1], from: m[2] || 'w', to: m[3] || null, sup: m[4] ? m[4].replace(/^\{|\}$/g, '') : null });
    i = BOXRE.lastIndex;
  }
  if (i < s.length) out.push({ t: 'tex', s: s.slice(i) });
  return out;
}
function boxContent(K, st) {
  return `<span class="u4l3-bxc">${T(st === 'w' ? K.name : st === 'ub' ? `(${K.inner})` : K.inner)}</span>`;
}
function setBox(el, K, st) { el.className = `u4l3-bx u4l3-bx-${K.col} u4l3-${st}` + (el.dataset.hid === '1' ? ' u4l3-hid' : ''); el.innerHTML = boxContent(K, st); }
/** HTML for a line; returns { el, boxes: [{ el, K, to }] } */
function lineEl(s, keys, cls = '') {
  const el = h('span', 'u4l3-m ' + cls), boxes = [];
  for (const p of parseLine(s)) {
    if (p.t === 'tex') { const sp = h('span', 'u4l3-tk', T('{}' + p.s + '{}')); el.appendChild(sp); continue; }
    const K = keys[p.k], b = h('span', ''); setBox(b, K, p.from); el.appendChild(b);
    boxes.push({ el: b, K, to: p.to });
    if (p.sup) el.appendChild(h('span', 'u4l3-sup', T(p.sup)));
  }
  return { el, boxes };
}
async function morph(c, b) {
  await anim(c, b.el.firstChild, [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(.3)' }], 200);
  setBox(b.el, b.K, b.to);
  await anim(c, b.el.firstChild, [{ opacity: 0, transform: 'scale(.3)' }, { opacity: 1, transform: 'scale(1)' }], 280);
}
const KEYS = (a, b) => {
  const k = { A: { name: 'A', inner: a, col: 'a' } };
  if (b) k.B = { name: 'B', inner: b, col: 'b' };
  return k;
};

/** a column of working lines, each with an optional step label and note */
class Deriv {
  constructor(stage, ex, keys, o = {}) {
    this.stage = stage; this.ex = ex; this.keys = keys; this.rows = []; this.tags = {};
    this.o = Object.assign({ x: 6, y: 10, gap: 54, labW: 96, size: 25, keyX: ex.W - 214, keyY: 6, cls: '' }, o);
  }
  row(it) {
    const o = this.o, i = this.rows.length;
    const r = div(this.stage, 'u4l3-row ' + o.cls + (it.cls ? ' u4l3-r-' + it.cls : ''), '', o.x, o.y + i * o.gap);
    r.style.fontSize = (it.size || o.size) + 'px';
    if (o.labW) { const l = h('span', 'u4l3-lab', it.lab || ''); l.style.width = (o.labW - 10) + 'px'; if (!it.lab) l.style.visibility = 'hidden'; r.appendChild(l); }
    const L = lineEl(it.m, this.keys);
    r.appendChild(L.el);
    if (it.hid) L.boxes.forEach((b) => { b.el.dataset.hid = '1'; b.el.classList.add('u4l3-hid'); });
    let note = null;
    if (it.note) { note = h('span', 'u4l3-note', it.note); r.appendChild(note); }
    hide(r);
    const R = { el: r, boxes: L.boxes, note, it };
    this.rows.push(R); return R;
  }
  tag(k) {
    if (this.tags[k]) return this.tags[k];
    const K = this.keys[k], n = Object.keys(this.tags).length;
    const t = div(this.stage, 'u4l3-key', `<span class="u4l3-kl">Let</span> <span class="u4l3-bx u4l3-bx-${K.col} u4l3-w"><span class="u4l3-bxc">${T(K.name)}</span></span> ${T('=' + K.inner)}`, this.o.keyX, this.o.keyY + n * 52);
    hide(t); this.tags[k] = t; return t;
  }
  async showTags(c, ks) { for (const k of ks || []) { const t = this.tag(k); if (t.style.opacity !== '1') { t.style.opacity = 1; await pop(c, t, 380); } } }
  async showRow(c, R) {
    R.el.style.opacity = 1; await fadeIn(c, R.el, 320);
    for (const b of R.boxes) if (b.to) { await morph(c, b); await sleep(c, 40); }
  }
  async spot(c, R) {
    R.boxes.forEach((b) => { b.el.dataset.hid = ''; b.el.classList.remove('u4l3-hid'); });
    for (const b of R.boxes) await pulse(c, b.el, 1.14, 380);
  }
}
/** steps for a spec: { keys, o, items: [row | { spot: i } | { glow: i }], chk: { x, f, g, v } } */
function derivSteps(stage, ex, spec) {
  const D = new Deriv(stage, ex, spec.keys, spec.o), steps = [];
  for (const it of spec.items) {
    if (it.spot != null) { steps.push({ cap: it.cap, run: async (c) => { await D.showTags(c, it.key); await D.spot(c, D.rows[it.spot]); } }); continue; }
    const R = D.row(it);
    steps.push({ cap: it.cap, run: async (c) => { await D.showTags(c, it.key); await D.showRow(c, R); if (it.cls === 'ans') await pulse(c, R.el, 1.04); } });
  }
  if (spec.chk) {
    const { x, f, g, v = 'x' } = spec.chk, a = f(x), b = g(x), ok = Math.abs(a - b) < 1e-9;
    const k = div(stage, 'u4l3-chk', `<b>Check</b> ${T(`${v}=${x}`)}: original ${T('=' + a)}, factored ${T('=' + b)} ${ok ? '✓' : '✗'}`, null, null);
    k.style.position = 'absolute'; k.style.right = '10px'; k.style.bottom = '8px'; hide(k);
    steps.push({ cap: `<b>Check</b> with a number: put ${T(`${v}=${x}`)} into the question and into the answer. Both give ${T(String(a))}.`, run: (c) => pop(c, k, 380).then(() => { k.style.opacity = 1; }) });
  }
  return { D, steps };
}

/* ====================================================================================================
 * Warm-up: The Mystery Gift
 * ==================================================================================================== */
function giftSVG(host) {
  const svg = svgEl('svg', { viewBox: '0 0 220 200', width: 220, height: 200, class: 'u4l3-gsvg' }, host);
  const inside = svgEl('g', { class: 'u4l3-gin' }, svg);
  svgEl('rect', { x: 30, y: 82, width: 160, height: 108, rx: 8, fill: '#fff4dd', stroke: '#c27a0e', 'stroke-width': 3 }, inside);
  const body = svgEl('g', { class: 'u4l3-gbody' }, svg);
  svgEl('rect', { x: 30, y: 82, width: 160, height: 108, rx: 8, fill: '#c27a0e' }, body);
  svgEl('rect', { x: 98, y: 82, width: 24, height: 108, fill: '#7a1f3d' }, body);
  svgEl('rect', { x: 30, y: 124, width: 160, height: 22, fill: '#7a1f3d', opacity: 0.85 }, body);
  const lid = svgEl('g', { class: 'u4l3-glid' }, svg);
  svgEl('rect', { x: 20, y: 56, width: 180, height: 32, rx: 6, fill: '#e8a01e', stroke: '#b9700c', 'stroke-width': 2 }, lid);
  svgEl('rect', { x: 97, y: 56, width: 26, height: 32, fill: '#7a1f3d' }, lid);
  svgEl('path', { d: 'M110 56 C 86 14, 52 22, 66 44 C 74 56, 98 56, 110 56 C 122 56, 146 56, 154 44 C 168 22, 134 14, 110 56 Z', fill: '#a33357', stroke: '#7a1f3d', 'stroke-width': 3 }, lid);
  const tag = svgEl('g', { class: 'u4l3-gtag' }, svg);
  svgEl('path', { d: 'M150 150 l40 -14 l14 20 l-40 14 z', fill: '#fff', stroke: '#7a1f3d', 'stroke-width': 2 }, tag);
  const tt = svgEl('text', { x: 178, y: 162, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 800, fill: '#7a1f3d', transform: 'rotate(-19 178 158)' }, tag); tt.textContent = '?';
  return { svg, lid, body };
}
function mountGift() {
  const host = document.getElementById('u4l3-gift'); if (!host) return;
  const g = giftSVG(h('div', 'u4l3-gpic')); host.appendChild(g.svg.parentNode);
  const xin = add(g.svg.parentNode, h('div', 'u4l3-gx', T('x^2')));
  const eqs = add(host, h('div', 'u4l3-geqs'));
  const GI = '<span class="u4l3-gi"></span>';
  const e1 = add(eqs, h('div', 'u4l3-geq', `${GI}<sup class="u4l3-sq">2</sup>${T('{}-5')}${GI}${T('{}+4=0')}`));
  const e2 = add(eqs, h('div', 'u4l3-geq u4l3-geq2', T(`(${ca('x^2')})^2-5(${ca('x^2')})+4=0`)));
  const e3 = add(eqs, h('div', 'u4l3-geq u4l3-geq2', T('x^4-5x^2+4=0')));
  const tb = add(host, h('table', 'u4l3-gtab'));
  const XS = [-3, -2, -1, 0, 1, 2, 3];
  tb.innerHTML = `<tr><th>${T('x')}</th>${XS.map((x) => `<td>${T(String(x))}</td>`).join('')}</tr>`
    + `<tr><th>${GI} ${T('=x^2')}</th>${XS.map((x, i) => `<td data-c="${i}" class="u4l3-gq">?</td>`).join('')}</tr>`
    + `<tr><th>${GI}<sup class="u4l3-sq">2</sup>${T('-5')}${GI}${T('+4')}</th>${XS.map((x, i) => `<td data-v="${i}" class="u4l3-gq">?</td>`).join('')}</tr>`;
  const bU = document.getElementById('u4l3-unwrap'), tries = document.getElementById('u4l3-tries');
  const btns = XS.map((x, i) => {
    const b = h('button', 'pill small u4l3-try', T(String(x))); b.type = 'button'; b.disabled = true; tries.appendChild(b);
    b.addEventListener('click', () => {
      const s = x * x, v = s * s - 5 * s + 4;
      const c1 = tb.querySelector(`[data-c="${i}"]`), c2 = tb.querySelector(`[data-v="${i}"]`);
      c1.innerHTML = T(String(s)); c2.innerHTML = T(String(v)); c1.classList.remove('u4l3-gq'); c2.classList.remove('u4l3-gq');
      c2.classList.toggle('u4l3-gzero', v === 0); b.classList.add('u4l3-tried');
    });
    return b;
  });
  let open = false;
  const paint = () => {
    host.classList.toggle('u4l3-open', open);
    bU.textContent = open ? 'Wrap it again' : 'Unwrap the gift';
    [e2, e3, xin].forEach((el) => { el.style.visibility = open ? 'visible' : 'hidden'; });
    btns.forEach((b) => { b.disabled = !open; });
  };
  bU.addEventListener('click', () => { open = !open; paint(); });
  void e1; paint();
}

/* =============================== explainer: spot quadratic form =============================== */
const SP = [
  { e: `x^4-7${ca('x^2')}+12`, mid: 'x^2', sq: 'x^4', first: 'x^4', ok: true, st: 'A = x²', cap: 'The middle term has $x^2$. Square it: $(x^2)^2=x^4$, the first term. <b>Quadratic form</b>, with $A=x^2$.' },
  { e: `x^6+2${ca('x^3')}-8`, mid: 'x^3', sq: 'x^6', first: 'x^6', ok: true, st: 'A = x³', cap: 'Middle: $x^3$. Squared: $x^6$, the first term. Quadratic form with $A=x^3$.' },
  { e: `x^4+5${ca('x')}-6`, mid: 'x', sq: 'x^2', first: 'x^4', ok: false, st: 'not quadratic form', cap: 'Middle: just $x$. Squared: $x^2$, but the first term is $x^4$. The powers don’t match: <b>not</b> quadratic form.' },
  { e: `x^6-3${ca('x^2')}+2`, mid: 'x^2', sq: 'x^4', first: 'x^6', ok: false, st: 'not quadratic form', cap: 'Middle: $x^2$. Squared: $x^4$, not $x^6$. The first power must be <b>double</b> the middle power: <b>not</b> quadratic form.' },
  { e: `x^8+4${ca('x^4')}+3`, mid: 'x^4', sq: 'x^8', first: 'x^8', ok: true, st: 'A = x⁴', cap: 'Middle: $x^4$. Squared: $x^8$ ✓. Any even power works when the middle has <b>half</b> of it: $A=x^4$.' },
  { e: `(x+2)^2-3${ca('(x+2)')}-10`, mid: '(x+2)', sq: '(x+2)^2', first: '(x+2)^2', ok: true, st: 'A = x + 2', cap: 'The chunk does not have to be a power of $x$: $(x+2)$ appears squared and on its own. $A=x+2$ (Section 4).' }
];
const spot = {
  title: 'Is it in quadratic form?',
  height: 420, minW: 880,
  ask: 'Square the variable part of the middle term. Does it give the variable part of the first term?',
  make(stage, v, ex) {
    const CW = (ex.W - 30) / 2, CH = 126;
    const cards = SP.map((d, i) => {
      const x = 10 + (i % 2) * (CW + 10), y = 8 + Math.floor(i / 2) * (CH + 10);
      const k = div(stage, 'u4l3-spc', '', x, y, CW, CH);
      div(k, 'u4l3-spe', T(d.e), 14, 10);
      const chk = hide(div(k, 'u4l3-spl', T(`\\text{middle: }${ca(d.mid)}\\ \\to\\ (${ca(d.mid)})^2=${d.ok ? cg(d.sq) : cr(d.sq)}` + (d.ok ? '' : `\\ne ${d.first}`)), 14, 58));
      const st = stamp(k, d.st, { ok: d.ok, x: CW - (d.ok ? 90 : 128), y: 104, rotate: d.ok ? -4 : 3, size: 'sm', cls: 'u4l3-stl' }); hide(st);
      return { k, chk, st };
    });
    const steps = cards.map((cd, i) => ({
      cap: SP[i].cap,
      run: async (c) => { cd.k.classList.add('u4l3-spon'); await show(c, cd.chk); await stampIn(c, cd.st); }
    }));
    steps.push({ cap: '<b>Quadratic form:</b> the first term’s variable part is the <b>square</b> of the middle term’s, and the last term is a constant. Then one box does the job.',
      run: async (c) => { for (const i of [0, 1, 4, 5]) await pulse(c, cards[i].k, 1.03, 300); } });
    return steps;
  }
};

/* =============================== explainer: the substitution box (monomial chunks) =============================== */
function mono(o) {
  // o: { v, A, start, b, c, r: [r1, r2], f, g, x }
  const K = KEYS(o.A);
  return {
    keys: K,
    items: [
      { lab: 'Start', m: o.start, cap: `Look for a repeated chunk: ${T(o.lead)} is ${T(`(${o.A})^2`)}, and the middle term has ${T(o.A)}.` },
      { lab: 'Rewrite', m: `⟦A:ub⟧^2${co(o.b, '⟦A:ub⟧')}${cst(o.c)}`, cap: `Write it with ${T(ca(o.A))} in <b>boxes</b>: ${T(`(${o.A})^2${co(o.b, `(${o.A})`)}${cst(o.c)}`)}. The same box twice.` },
      { lab: 'Wrap', m: `⟦A:ub>w⟧^2${co(o.b, '⟦A:ub>w⟧')}${cst(o.c)}`, key: ['A'], cap: `Let ${T(ca('A') + '=' + o.A)}. <b>Wrap</b> each box: ${T(`A^2${co(o.b, 'A')}${cst(o.c)}`)}, a trinomial we already know how to factor.` },
      { lab: 'Factor', m: `(⟦A⟧${cst(o.r[0])})(⟦A⟧${cst(o.r[1])})`, note: `product ${T(String(o.c))}, sum ${T(String(o.b))}: ${T(o.r[0] + ',\\ ' + o.r[1])}`,
        cap: `Two numbers with product ${T(String(o.c))} and sum ${T(String(o.b))}: ${T(String(o.r[0]))} and ${T(String(o.r[1]))}. So ${T(`(A${cst(o.r[0])})(A${cst(o.r[1])})`)}.` },
      { lab: 'Unwrap', m: `(⟦A:w>u⟧${cst(o.r[0])})(⟦A:w>u⟧${cst(o.r[1])})`, cls: 'ans', cap: `<b>Unwrap:</b> put ${T(o.A)} back where each ${T('A')} was: ${T(`\\boldsymbol{(${o.A}${cst(o.r[0])})(${o.A}${cst(o.r[1])})}`)}.${o.more || ''}` }
    ],
    chk: { x: o.x, v: o.v, f: o.f, g: o.g }
  };
}
const BX = {
  x4: { label: 'x⁴ − 7x² + 12', ask: 'Factor $x^4-7x^2+12$.', s: mono({ v: 'x', A: 'x^2', lead: 'x^4', start: 'x^4-7x^2+12', b: -7, c: 12, r: [-3, -4], x: 1, f: (x) => x ** 4 - 7 * x * x + 12, g: (x) => (x * x - 3) * (x * x - 4), more: ' (In Section 2, $x^2-4$ splits again.)' }) },
  x6: { label: 'x⁶ + 2x³ − 8', ask: 'Factor $x^6+2x^3-8$.', s: mono({ v: 'x', A: 'x^3', lead: 'x^6', start: 'x^6+2x^3-8', b: 2, c: -8, r: [4, -2], x: 1, f: (x) => x ** 6 + 2 * x ** 3 - 8, g: (x) => (x ** 3 + 4) * (x ** 3 - 2) }) },
  e1a: { label: 'Example 1(a) check', ask: 'Example 1(a): factor $x^4+9x^2+14$.', s: mono({ v: 'x', A: 'x^2', lead: 'x^4', start: 'x^4+9x^2+14', b: 9, c: 14, r: [2, 7], x: 1, f: (x) => x ** 4 + 9 * x * x + 14, g: (x) => (x * x + 2) * (x * x + 7) }) },
  e1b: { label: 'Example 1(b) check', ask: 'Example 1(b): factor $y^4-3y^2-28$.', s: mono({ v: 'y', A: 'y^2', lead: 'y^4', start: 'y^4-3y^2-28', b: -3, c: -28, r: [-7, 4], x: 1, f: (x) => x ** 4 - 3 * x * x - 28, g: (x) => (x * x - 7) * (x * x + 4) }) },
  e1c: { label: 'Example 1(c) check', ask: 'Example 1(c): factor $x^6+4x^3-21$.', s: mono({ v: 'x', A: 'x^3', lead: 'x^6', start: 'x^6+4x^3-21', b: 4, c: -21, r: [7, -3], x: 1, f: (x) => x ** 6 + 4 * x ** 3 - 21, g: (x) => (x ** 3 + 7) * (x ** 3 - 3) }) }
};
const boxIt = {
  title: 'The substitution box',
  height: 330,
  choices: [{ v: 'x4', label: BX.x4.label }, { v: 'x6', label: BX.x6.label }, { sep: 'Check:' }, ...['e1a', 'e1b', 'e1c'].map((k) => ({ v: k, label: BX[k].label }))],
  ask: (v) => BX[v].ask,
  make(stage, v, ex) { return derivSteps(stage, ex, Object.assign({ o: { gap: 58 } }, BX[v].s)).steps; }
};

/* =============================== explainer: difference of squares =============================== */
const DS = {
  x9: { label: 'x² − 9', e: 'x^2-9', minus: true, sq: true, a: 'x', b: '3', aa: 'x^2', bb: '9' },
  f1: { label: '4x² − 1', e: '4x^2-1', minus: true, sq: true, a: '2x', b: '1', aa: '4x^2', bb: '1' },
  p9: { label: 'x² + 9', e: 'x^2+9', minus: false, sq: true },
  x7: { label: 'x² − 7', e: 'x^2-7', minus: true, sq: false }
};
const dos = {
  title: 'Can it split? Difference of squares',
  height: 360, minW: 860,
  choices: Object.keys(DS).map((k) => ({ v: k, label: DS[k].label })),
  ask: (v) => `Does $${DS[v].e}$ factor?`,
  make(stage, v, ex) {
    const d = DS[v], W = ex.W;
    const big = div(stage, 'u4l3-dbig', T(d.e), 30, 16);
    const P = div(stage, 'u4l3-dpanel', '<div class="u4l3-ph">Two tests</div>', W - 330, 12, 316, 150);
    const t1 = div(P, 'u4l3-dt', `<span class="u4l3-dn">1</span> Two terms with a <b>minus</b> between them?`, null, null);
    const t2 = div(P, 'u4l3-dt', `<span class="u4l3-dn">2</span> Both terms <b>perfect squares</b>?`, null, null);
    const mark = (t, ok) => { const m = h('span', 'u4l3-dm ' + (ok ? 'u4l3-ok' : 'u4l3-no'), ok ? '✓' : '✗'); t.appendChild(m); hide(m); return m; };
    const m1 = mark(t1, d.minus), m2 = mark(t2, d.sq);
    const steps = [{ cap: 'A difference of squares has exactly <b>two</b> terms, a <b>minus</b> between them, and <b>both</b> terms perfect squares.', run: (c) => pulse(c, P, 1.03) }];
    if (d.minus && d.sq) {
      const sqs = hide(div(stage, 'u4l3-dl', T(`${d.aa}=(${ca(d.a)})^2,\\qquad ${d.bb}=(${cb(d.b)})^2`), 30, 96));
      const split = hide(div(stage, 'u4l3-dbig u4l3-dsplit', T(`${d.e}=(${ca(d.a)}-${cb(d.b)})(${ca(d.a)}+${cb(d.b)})`), 30, 170));
      const chk = hide(div(stage, 'u4l3-dl u4l3-dchk', T(`(${d.a}-${d.b})(${d.a}+${d.b})=${d.aa}+\\cancel{${d.b === '1' ? '' : d.b}${d.a === 'x' ? 'x' : d.a}}-\\cancel{${d.b === '1' ? '' : d.b}${d.a === 'x' ? 'x' : d.a}}-${d.bb}=${d.e}`), 30, 262));
      steps.push(
        { cap: 'Test 1: two terms, minus between them ✓', run: async (c) => { m1.style.opacity = 1; await pop(c, m1); } },
        { cap: `Test 2: ${T(d.aa)} is ${T(`(${d.a})^2`)} and ${T(d.bb)} is ${T(`(${d.b})^2`)} ✓`, run: async (c) => { m2.style.opacity = 1; await pop(c, m2); await show(c, sqs); } },
        { cap: `So it splits: ${T(`A^2-B^2=(A-B)(A+B)`)} with ${T(ca('A') + '=' + d.a)} and ${T(cb('B') + '=' + d.b)}.`, run: (c) => show(c, split) },
        { cap: `Why it works: expanding gives two <b>middle terms that cancel</b>, ${T(`-${d.b === '1' ? '' : d.b}${d.a}+${d.b === '1' ? '' : d.b}${d.a}=0`)}.`, run: (c) => show(c, chk) }
      );
    } else if (!d.minus) {
      const tries = ['(x+3)(x+3)=x^2+6x+9', '(x-3)(x-3)=x^2-6x+9', '(x-3)(x+3)=x^2-9'].map((s, i) => hide(div(stage, 'u4l3-dl', T(s) + ' <span class="u4l3-dm u4l3-no">✗</span>', 30, 104 + i * 54)));
      const lk = stamp(stage, 'does not factor', { ok: false, x: 190, y: 300, rotate: -4 }); hide(lk);
      steps.push(
        { cap: 'Test 1: it is a <b>sum</b> (plus), not a difference ✗', run: async (c) => { m1.style.opacity = 1; await pop(c, m1); await shake(c, big); } },
        { cap: 'Try anyway. Every pair of brackets gives the wrong middle term or the wrong sign on 9.', run: async (c) => { for (const t of tries) { await show(c, t); await sleep(c, 200); } } },
        { cap: `A <b>sum of squares</b> such as ${T('x^2+9')} does <b>not</b> factor. It is finished as it is.`, run: (c) => stampIn(c, lk) }
      );
    } else {
      const nt = hide(div(stage, 'u4l3-dl', `${T('x^2=(x)^2')} ✓ &nbsp; but 7 is not a perfect square: ${T('2^2=4,\\ 3^2=9')}`, 30, 104));
      const lk = stamp(stage, 'not over the integers', { ok: false, x: 220, y: 200, rotate: -4 }); hide(lk);
      steps.push(
        { cap: 'Test 1: two terms with a minus ✓', run: async (c) => { m1.style.opacity = 1; await pop(c, m1); } },
        { cap: 'Test 2: 7 is <b>not</b> a perfect square ✗ (it sits between 4 and 9).', run: async (c) => { m2.style.opacity = 1; await pop(c, m2); await show(c, nt); } },
        { cap: `${T('x^2-7')} does not factor <b>over the integers</b>. Leave it as it is.`, run: (c) => stampIn(c, lk) }
      );
    }
    return steps;
  }
};

/* =============================== explainer: factor tree (factor fully) =============================== */
const n = (t, why, kids, done) => ({ t, why, kids: kids || [], done });
const TR = {
  warm: { label: 'Warm-up: x⁴ − 5x² + 4', ask: 'Factor fully: $x^4-5x^2+4$ (the warm-up’s gift line).',
    tree: n('x^4-5x^2+4', 'A=x^2', [n('x^2-1', 'diff. of squares', [n('x-1'), n('x+1')]), n('x^2-4', 'diff. of squares', [n('x-2'), n('x+2')])]),
    ans: '(x-1)(x+1)(x-2)(x+2)', cap1: 'With $A=x^2$: $A^2-5A+4=(A-1)(A-4)$, so $(x^2-1)(x^2-4)$.' },
  e2a: { label: 'Example 2(a) check', ask: 'Example 2(a): factor $x^4-13x^2+36$ fully.',
    tree: n('x^4-13x^2+36', 'A=x^2', [n('x^2-4', 'diff. of squares', [n('x-2'), n('x+2')]), n('x^2-9', 'diff. of squares', [n('x-3'), n('x+3')])]),
    ans: '(x-2)(x+2)(x-3)(x+3)', cap1: '$A=x^2$: product 36, sum $-13$ gives $-4$ and $-9$: $(x^2-4)(x^2-9)$.' },
  e2b: { label: 'Example 2(b) check', ask: 'Example 2(b): factor $m^4-5m^2-36$ fully.',
    tree: n('m^4-5m^2-36', 'A=m^2', [n('m^2-9', 'diff. of squares', [n('m-3'), n('m+3')]), n('m^2+4', null, [], 'sum')]),
    ans: '(m-3)(m+3)(m^2+4)', cap1: '$A=m^2$: product $-36$, sum $-5$ gives $-9$ and $4$: $(m^2-9)(m^2+4)$.' },
  e2c: { label: 'Example 2(c) check', ask: 'Example 2(c): factor $3y^5-54y^3+243y$ fully.',
    tree: n('3y^5-54y^3+243y', 'GCF', [n('3y'), n('y^4-18y^2+81', 'A=y^2', [n('y^2-9', 'diff. of squares', [n('y-3'), n('y+3')]), n('y^2-9', 'diff. of squares', [n('y-3'), n('y+3')])])]),
    ans: '3y(y-3)^2(y+3)^2', cap1: '<b>GCF first:</b> every term has $3y$. $3y^5-54y^3+243y=3y(y^4-18y^2+81)$.', gcf: true }
};
const tree = {
  title: 'Factor fully: keep splitting',
  height: 440, minW: 880,
  choices: [{ v: 'warm', label: TR.warm.label }, { sep: 'Check:' }, ...['e2a', 'e2b', 'e2c'].map((k) => ({ v: k, label: TR[k].label }))],
  ask: (v) => TR[v].ask,
  make(stage, v, ex) {
    const d = TR[v], W = ex.W, LY = [14, 118, 222, 326];
    const svg = svgEl('svg', { class: 'u4l3-ov', width: W, height: 440 }, stage);
    // leaves left to right, parents centred over their children
    const all = []; let leafN = 0;
    const walk = (nd, dep) => { nd.dep = dep; all.push(nd); if (nd.kids.length) nd.kids.forEach((k) => walk(k, dep + 1)); else nd.li = leafN++; };
    walk(d.tree, 0);
    const sp = (W - 40) / leafN;
    const place = (nd) => { if (!nd.kids.length) nd.x = 20 + sp * (nd.li + 0.5); else { nd.kids.forEach(place); nd.x = nd.kids.reduce((s, k) => s + k.x, 0) / nd.kids.length; } };
    place(d.tree);
    all.forEach((nd) => {
      nd.el = hide(div(stage, 'u4l3-tn' + (nd.kids.length ? '' : ' u4l3-tleaf'), T(nd.t), nd.x, LY[nd.dep])); nd.el.style.translate = '-50% 0';
      if (nd.why) { nd.wl = hide(div(stage, 'u4l3-twhy', nd.why === 'A=x^2' || nd.why === 'A=m^2' || nd.why === 'A=y^2' ? T(nd.why.replace('A', ca('A'))) : nd.why, nd.x, LY[nd.dep] + 52)); nd.wl.style.translate = '-50% 0'; }
      nd.edges = nd.kids.map((k) => { const ln = svgEl('line', { x1: nd.x, y1: LY[nd.dep] + 46, x2: k.x, y2: LY[k.dep] - 2, stroke: '#9aa0ab', 'stroke-width': 2.5 }, svg); hide(ln); return ln; });
    });
    const leaves = all.filter((nd) => !nd.kids.length);
    const ansY = 392;
    const A = hide(div(stage, 'u4l3-tans', T(`${d.tree.t}=${cg('\\boldsymbol{' + d.ans + '}')}`), W / 2, ansY)); A.style.translate = '-50% 0';
    const grow = async (c, nds) => {
      for (const nd of nds) { if (nd.wl) await show(c, nd.wl); for (const e of nd.edges) { e.style.opacity = 1; await anim(c, e, [{ opacity: 0 }, { opacity: 1 }], 200); } for (const k of nd.kids) { k.el.style.opacity = 1; await pop(c, k.el, 320); } }
    };
    const lev = (k) => all.filter((nd) => nd.dep === k && nd.kids.length);
    const steps = [{ cap: 'Start at the top. Is there a <b>GCF</b>? Then is it in quadratic form?', run: async (c) => { d.tree.el.style.opacity = 1; await pop(c, d.tree.el); } }];
    steps.push({ cap: d.cap1, run: (c) => grow(c, lev(0)) });
    if (d.gcf) steps.push({ cap: 'Now the trinomial in the bracket: $A=y^2$, product 81, sum $-18$ gives $-9$ and $-9$: $(y^2-9)(y^2-9)$.', run: (c) => grow(c, lev(1)) });
    const dosNodes = all.filter((nd) => nd.why === 'diff. of squares');
    const sumLeaf = all.find((nd) => nd.done === 'sum');
    steps.push({ cap: `Check every factor. ${dosNodes.length === 4 ? 'Both are' : dosNodes.length > 1 ? 'Each is' : 'One is'} a <b>difference of squares</b>: split ${dosNodes.length > 1 ? 'them' : 'it'}.${sumLeaf ? ` ${T(sumLeaf.t)} is a <b>sum</b>: it stays.` : ''}`,
      run: async (c) => { await grow(c, dosNodes); if (sumLeaf) { sumLeaf.el.classList.add('u4l3-tsum'); await shake(c, sumLeaf.el); } } });
    steps.push({ cap: 'No leaf can split again: every factor is <b>done</b>. ✓', run: async (c) => { for (const lf of leaves) { lf.el.classList.add('u4l3-tdone'); await pulse(c, lf.el, 1.12, 260); } } });
    steps.push({ cap: `The answer is the product of the leaves${d.gcf ? ' (equal factors written with powers)' : ''}: ${T('\\boldsymbol{' + d.ans + '}')}.`, run: (c) => show(c, A) });
    return steps;
  }
};

/* =============================== explainer: Example 3 two ways =============================== */
const decomp = {
  title: 'With A, or directly: the same work',
  height: 450, minW: 900,
  ask: 'Example 3: factor $3x^4-10x^2-8$ fully two ways.',
  make(stage, v, ex) {
    const W = ex.W, cw = (W - 30) / 2, K = KEYS('x^2');
    const hd = (x, t) => div(stage, 'u4l3-lhead', t, x, 52, cw);
    const hunt = hide(div(stage, 'u4l3-hunt', `${T('ac=3(-8)=-24')}, &nbsp; ${T('b=-10')}: &nbsp; ${T('-12')} and ${T('2')}`, W / 2, 6)); hunt.style.translate = '-50% 0';
    hd(10, `(a) Substitute ${T('A=x^2')} first`); hd(20 + cw, `(b) Split ${T('-10x^2')} directly`);
    const o = { labW: 0, gap: 52, size: 23, y: 96 };
    const L = new Deriv(stage, ex, K, Object.assign({ x: 14 }, o)), R = new Deriv(stage, ex, K, Object.assign({ x: 24 + cw }, o));
    const X2 = ca('x^2');
    const rows = [
      ['3⟦A:ub>w⟧^2-10⟦A:ub>w⟧-8', `3x^4-10${X2}-8`, `Both start the same way. On the left the ${T('x^2')}’s are wrapped into ${T(ca('A'))}; on the right they stay, but play the same role.`],
      ['3⟦A⟧^2-12⟦A⟧+2⟦A⟧-8', `3x^4-12${X2}+2${X2}-8`, `Split the middle term into ${T('-12')} and ${T('+2')} (product ${T('-24')}, sum ${T('-10')}).`],
      ['3⟦A⟧(⟦A⟧-4)+2(⟦A⟧-4)', `3${X2}(x^2-4)+2(x^2-4)`, 'Group in pairs and take out the common factor of each pair.'],
      ['(3⟦A⟧+2)(⟦A⟧-4)', '(x^2-4)(3x^2+2)', `Take out the common bracket. On the left it is ${T('(A-4)')}, on the right ${T('(x^2-4)')}.`],
      ['(3⟦A:w>u⟧+2)(⟦A:w>u⟧-4)', null, `Only the left side has to <b>unwrap</b>: ${T('(3x^2+2)(x^2-4)')}.`],
      ['(3x^2+2)(x-2)(x+2)', '(x-2)(x+2)(3x^2+2)', `${T('x^2-4')} is a difference of squares. <b>Same answer</b> both ways (the order of factors doesn’t matter).`]
    ];
    const LR = rows.map((r) => L.row({ m: r[0], cls: r === rows[5] ? 'ans' : '' }));
    const RR = rows.map((r) => R.row({ m: r[1] || '\\phantom{x}', cls: r === rows[5] ? 'ans' : '' }));
    const st = stamp(stage, 'same answer', { ok: true, x: W / 2 - 80, y: 404, rotate: -4, size: 'sm' }); hide(st);
    const steps = [{ cap: `Both ways need the pair: product ${T('ac=-24')}, sum ${T('-10')}: ${T('-12')} and ${T('2')}.`, run: (c) => pop(c, hunt).then(() => { hunt.style.opacity = 1; }) }];
    rows.forEach((r, i) => steps.push({ cap: r[2], run: async (c) => { await L.showRow(c, LR[i]); if (r[1]) await R.showRow(c, RR[i]); if (i === 5) await stampIn(c, st); } }));
    return steps;
  }
};

/* =============================== explainer: product–sum hunt with the box (a ≠ 1) =============================== */
const AH = {
  e4a: { label: 'Example 4(a) check', ask: 'Example 4(a): factor $9x^4-37x^2+4$ fully.', A: 'x^2', a: 9, b: -37, c: 4, pair: [-36, -1],
    tries: [[-1, -36]], rows: [
      ['Wrap', '9⟦A:ub>w⟧^2-37⟦A:ub>w⟧+4', 'Let $A=x^2$. Wrap: $9A^2-37A+4$. Now $a=9$, so we need <b>decomposition</b>.'],
      ['Split', '9⟦A⟧^2-36⟦A⟧-⟦A⟧+4', 'Split $-37A$ into $-36A-A$.'],
      ['Group', '9⟦A⟧(⟦A⟧-4)-1(⟦A⟧-4)', 'Group in pairs: $9A(A-4)-1(A-4)$.'],
      ['Factor', '(9⟦A⟧-1)(⟦A⟧-4)', 'Common bracket $(A-4)$: $(9A-1)(A-4)$.'],
      ['Unwrap', '(9⟦A:w>u⟧-1)(⟦A:w>u⟧-4)', 'Unwrap $A=x^2$: $(9x^2-1)(x^2-4)$.'],
      ['Fully', '(3x-1)(3x+1)(x-2)(x+2)', '<b>Both</b> factors are differences of squares: $9x^2-1=(3x)^2-1^2$ and $x^2-4=x^2-2^2$. $\\boldsymbol{(3x-1)(3x+1)(x-2)(x+2)}$', 'ans']
    ], f: (x) => 9 * x ** 4 - 37 * x * x + 4, g: (x) => (3 * x - 1) * (3 * x + 1) * (x - 2) * (x + 2), x: 1 },
  e4b: { label: 'Example 4(b) check', ask: 'Example 4(b): factor $6a^2b^2-5ab-6$ fully.', A: 'ab', a: 6, b: -5, c: -6, pair: [-9, 4], v: 'a',
    tries: [[1, -36], [2, -18], [3, -12], [4, -9]], rows: [
      ['Wrap', '6⟦A:ub>w⟧^2-5⟦A:ub>w⟧-6', '$a^2b^2$ is $(ab)^2$, so let $A=ab$: $6A^2-5A-6$.'],
      ['Split', '6⟦A⟧^2-9⟦A⟧+4⟦A⟧-6', 'Split $-5A$ into $-9A+4A$.'],
      ['Group', '3⟦A⟧(2⟦A⟧-3)+2(2⟦A⟧-3)', 'Group: $3A(2A-3)+2(2A-3)$.'],
      ['Factor', '(3⟦A⟧+2)(2⟦A⟧-3)', 'Common bracket $(2A-3)$: $(3A+2)(2A-3)$.'],
      ['Unwrap', '(3⟦A:w>u⟧+2)(2⟦A:w>u⟧-3)', 'Unwrap $A=ab$: $\\boldsymbol{(3ab+2)(2ab-3)}$. Neither factor splits again.', 'ans']
    ], f: (x) => 6 * x * x - 5 * x - 6, g: (x) => (3 * x + 2) * (2 * x - 3), x: 1, chkNote: 'a = 1, b = 1' },
  e4c: { label: 'Example 4(c) check', ask: 'Example 4(c): factor $2p^6+5p^3-12$ fully.', A: 'p^3', a: 2, b: 5, c: -12, pair: [8, -3], v: 'p',
    tries: [[-1, 24], [-2, 12], [-3, 8]], rows: [
      ['Wrap', '2⟦A:ub>w⟧^2+5⟦A:ub>w⟧-12', '$p^6$ is $(p^3)^2$, so let $A=p^3$: $2A^2+5A-12$.'],
      ['Split', '2⟦A⟧^2+8⟦A⟧-3⟦A⟧-12', 'Split $5A$ into $8A-3A$.'],
      ['Group', '2⟦A⟧(⟦A⟧+4)-3(⟦A⟧+4)', 'Group: $2A(A+4)-3(A+4)$.'],
      ['Factor', '(2⟦A⟧-3)(⟦A⟧+4)', 'Common bracket $(A+4)$: $(2A-3)(A+4)$.'],
      ['Unwrap', '(2⟦A:w>u⟧-3)(⟦A:w>u⟧+4)', 'Unwrap $A=p^3$: $\\boldsymbol{(2p^3-3)(p^3+4)}$.', 'ans']
    ], f: (x) => 2 * x ** 6 + 5 * x ** 3 - 12, g: (x) => (2 * x ** 3 - 3) * (x ** 3 + 4), x: 1 }
};
const acHunt = {
  title: 'Hunt for the pair, then box it',
  height: 400, minW: 900,
  choices: Object.keys(AH).map((k) => ({ v: k, label: AH[k].label })),
  ask: (v) => AH[v].ask,
  make(stage, v, ex) {
    const d = AH[v], W = ex.W, K = KEYS(d.A), TW = 236, ac = d.a * d.c;
    const D = new Deriv(stage, ex, K, { gap: 58, keyX: W - TW - 4, keyY: 4, size: 24 });
    const tb = div(stage, 'u4l3-htab', '', W - TW - 4, 62, TW);
    tb.innerHTML = `<div class="u4l3-hh">product ${T(`ac=${d.a}(${d.c})=${ac}`)}<br>sum ${T(`b=${d.b}`)}</div>`;
    const trs = d.tries.map(([p, q]) => { const r = h('div', 'u4l3-hr', `${T(`${p},\\ ${q}`)}<span class="u4l3-hs">${T(`\\text{sum }${p + q}`)}</span>`); tb.appendChild(r); hide(r); return { r, ok: p + q === d.b }; });
    hide(tb);
    const R = d.rows.map((r) => D.row({ lab: r[0], m: r[1], cls: r[3] || '' }));
    const steps = [];
    steps.push({ cap: d.rows[0][2], run: async (c) => { await D.showTags(c, ['A']); await D.showRow(c, R[0]); } });
    steps.push({ cap: `Hunt: list factor pairs of ${T(String(ac))} until the sum is ${T(String(d.b))}. ${ac < 0 ? 'A negative product: one positive, one negative.' : 'A positive product with a negative sum: both negative.'}`,
      run: async (c) => { tb.style.opacity = 1; await show(c, tb); for (const t of trs) { t.r.style.opacity = 1; await fadeIn(c, t.r, 220); if (t.ok) { t.r.classList.add('u4l3-hok'); await pulse(c, t.r, 1.06); } else { t.r.classList.add('u4l3-hno'); } await sleep(c, 120); } } });
    d.rows.slice(1).forEach((r, i) => steps.push({ cap: r[2], run: (c) => D.showRow(c, R[i + 1]) }));
    if (d.f) {
      const v2 = d.v || 'x', a = d.f(d.x), b = d.g(d.x);
      const k = hide(div(stage, 'u4l3-chk', `<b>Check</b> ${d.chkNote ? T('a=1,\\ b=1') : T(`${v2}=${d.x}`)}: ${T(String(a))} both ways ✓`, null, null));
      k.style.position = 'absolute'; k.style.right = '8px'; k.style.bottom = '8px';
      steps.push({ cap: `<b>Check</b> with ${d.chkNote ? T('a=1,\\ b=1') : T(`${v2}=${d.x}`)}: the question and the answer both give ${T(String(a))}.`, run: (c) => pop(c, k).then(() => { k.style.opacity = 1; }) });
    }
    return steps;
  }
};

/* =============================== explainer: STAR, a binomial in the box =============================== */
const BB = {
  demo: { label: '(x − 1)² + 5(x − 1) + 6', ask: 'Factor $(x-1)^2+5(x-1)+6$.', s: {
    keys: KEYS('x-1'), items: [
      { lab: 'Start', m: '⟦A:ub⟧^2+5⟦A:ub⟧+6', hid: true, cap: 'Look closely: the same bracket $(x-1)$ appears twice, once squared.' },
      { spot: 0, key: ['A'], cap: `Box the repeated chunk and let ${T(ca('A') + '=x-1')}.` },
      { lab: 'Wrap', m: '⟦A:ub>w⟧^2+5⟦A:ub>w⟧+6', cap: `<b>Wrap</b> the boxes: ${T('A^2+5A+6')}. Much friendlier!` },
      { lab: 'Factor', m: '(⟦A⟧+2)(⟦A⟧+3)', note: `product ${T('6')}, sum ${T('5')}`, cap: `Product 6, sum 5: $2$ and $3$. ${T('(A+2)(A+3)')}.` },
      { lab: 'Unwrap', m: '\\big[⟦A:w>ub⟧+2\\big]\\big[⟦A:w>ub⟧+3\\big]', cap: '<b>Unwrap</b>: each $A$ becomes $(x-1)$, <b>in brackets</b>.' },
      { lab: 'Simplify', m: '(x+1)(x+2)', cls: 'ans', cap: `Simplify inside each bracket: ${T('x-1+2=x+1')} and ${T('x-1+3=x+2')}. ${T('\\boldsymbol{(x+1)(x+2)}')}.` }
    ], chk: { x: 2, f: (x) => (x - 1) ** 2 + 5 * (x - 1) + 6, g: (x) => (x + 1) * (x + 2) } } },
  e5a: { label: 'Example 5(a) check', ask: 'Example 5(a): factor $(x+2)^2-3(x+2)-10$ fully.', s: {
    keys: KEYS('x+2'), items: [
      { lab: 'Start', m: '⟦A:ub⟧^2-3⟦A:ub⟧-10', hid: true, cap: 'The bracket $(x+2)$ appears twice: squared, and times $-3$.' },
      { spot: 0, key: ['A'], cap: `Box it: let ${T(ca('A') + '=x+2')}.` },
      { lab: 'Wrap', m: '⟦A:ub>w⟧^2-3⟦A:ub>w⟧-10', cap: `<b>Wrap</b>: ${T('A^2-3A-10')}.` },
      { lab: 'Factor', m: '(⟦A⟧-5)(⟦A⟧+2)', note: `product ${T('-10')}, sum ${T('-3')}`, cap: `Product $-10$, sum $-3$: $-5$ and $2$. ${T('(A-5)(A+2)')}.` },
      { lab: 'Unwrap', m: '\\big[⟦A:w>ub⟧-5\\big]\\big[⟦A:w>ub⟧+2\\big]', cap: `<b>Unwrap in brackets:</b> ${T('\\big[(x+2)-5\\big]\\big[(x+2)+2\\big]')}.` },
      { lab: 'Simplify', m: '(x-3)(x+4)', cls: 'ans', cap: `Simplify each factor: ${T('x+2-5=x-3')}, ${T('x+2+2=x+4')}. ${T('\\boldsymbol{(x-3)(x+4)}')}.` }
    ], chk: { x: 0, f: (x) => (x + 2) ** 2 - 3 * (x + 2) - 10, g: (x) => (x - 3) * (x + 4) } } },
  e5b: { label: 'Example 5(b) check', ask: 'Example 5(b): factor $2(3x-1)^2+5(3x-1)-3$ fully.', s: {
    keys: KEYS('3x-1'), items: [
      { lab: 'Start', m: '2⟦A:ub⟧^2+5⟦A:ub⟧-3', hid: true, cap: 'The repeated chunk is $(3x-1)$.' },
      { spot: 0, key: ['A'], cap: `Let ${T(ca('A') + '=3x-1')}.` },
      { lab: 'Wrap', m: '2⟦A:ub>w⟧^2+5⟦A:ub>w⟧-3', cap: `<b>Wrap</b>: ${T('2A^2+5A-3')}.` },
      { lab: 'Factor', m: '(2⟦A⟧-1)(⟦A⟧+3)', note: `product ${T('-6')}, sum ${T('5')}`, cap: `Decomposition: product $-6$, sum 5: $6$ and $-1$. ${T('2A^2+6A-A-3=2A(A+3)-1(A+3)=(2A-1)(A+3)')}.` },
      { lab: 'Unwrap', m: '\\big[2⟦A:w>ub⟧-1\\big]\\big[⟦A:w>ub⟧+3\\big]', cap: `<b>Unwrap in brackets:</b> ${T('2A')} becomes ${T('2(3x-1)')}, the whole box times 2.` },
      { lab: 'Simplify', m: '(6x-3)(3x+2)', cap: `Simplify: ${T('2(3x-1)-1=6x-2-1=6x-3')} and ${T('3x-1+3=3x+2')}.` },
      { lab: 'Fully', m: '3(2x-1)(3x+2)', cls: 'ans', cap: `Check each factor: ${T('6x-3')} has a <b>common factor 3</b>, hidden in the box until now. ${T('\\boldsymbol{3(2x-1)(3x+2)}')}.` }
    ], chk: { x: 1, f: (x) => 2 * (3 * x - 1) ** 2 + 5 * (3 * x - 1) - 3, g: (x) => 3 * (2 * x - 1) * (3 * x + 2) } } }
};
const boxBin = {
  title: 'The substitution box: a binomial',
  height: 400,
  choices: [{ v: 'demo', label: BB.demo.label }, { sep: 'Check:' }, { v: 'e5a', label: BB.e5a.label }, { v: 'e5b', label: BB.e5b.label }],
  ask: (v) => BB[v].ask,
  make(stage, v, ex) { return derivSteps(stage, ex, Object.assign({ o: { gap: 56, size: 24 } }, BB[v].s)).steps; }
};

/* =============================== explainer: substitute vs expand first =============================== */
const RC = {
  e6: { label: 'Example 6 check', ask: 'Example 6: factor $4(x-1)^2-4(x-1)-3$ two ways.', A: 'x-1', pS: -12, pE: 20,
    sub: [['4⟦A:ub>w⟧^2-4⟦A:ub>w⟧-3', 'factor'], ['4⟦A⟧^2-6⟦A⟧+2⟦A⟧-3', 'factor'], ['2⟦A⟧(2⟦A⟧-3)+1(2⟦A⟧-3)', 'factor'], ['(2⟦A⟧+1)(2⟦A⟧-3)', 'factor'], ['\\big[2⟦A:w>ub⟧+1\\big]\\big[2⟦A:w>ub⟧-3\\big]', 'unwrap'], ['(2x-1)(2x-5)', 'simplify']],
    exp: [['4(x^2-2x+1)-4x+4-3', 'expand'], ['4x^2-8x+4-4x+4-3', 'expand'], ['4x^2-12x+5', 'collect'], ['4x^2-10x-2x+5', 'factor'], ['2x(2x-5)-1(2x-5)', 'factor'], ['(2x-1)(2x-5)', 'factor']],
    caps: ['Left: let $A=x-1$, so $4A^2-4A-3$, ready to factor. Right: start expanding, $(x-1)^2=x^2-2x+1$.',
      'Left: product $-12$, sum $-4$: split into $-6A+2A$. Right: still expanding.',
      'Left: group. Right: collect like terms: only <b>now</b> is there a trinomial to factor, with product $20$.',
      'Left: common bracket. Right: product 20, sum $-12$: $-10$ and $-2$.',
      'Left: unwrap in brackets. Right: group.',
      '<b>Same answer</b>, $(2x-1)(2x-5)$. The left side never expanded anything and hunted with smaller numbers.'] },
  big: { label: '3(x + 4)² − 5(x + 4) − 2', ask: 'Factor $3(x+4)^2-5(x+4)-2$ two ways.', A: 'x+4', pS: -6, pE: 78,
    sub: [['3⟦A:ub>w⟧^2-5⟦A:ub>w⟧-2', 'factor'], ['3⟦A⟧^2-6⟦A⟧+⟦A⟧-2', 'factor'], ['3⟦A⟧(⟦A⟧-2)+1(⟦A⟧-2)', 'factor'], ['(3⟦A⟧+1)(⟦A⟧-2)', 'factor'], ['\\big[3⟦A:w>ub⟧+1\\big]\\big[⟦A:w>ub⟧-2\\big]', 'unwrap'], ['(3x+13)(x+2)', 'simplify']],
    exp: [['3(x^2+8x+16)-5x-20-2', 'expand'], ['3x^2+24x+48-5x-22', 'expand'], ['3x^2+19x+26', 'collect'], ['3x^2+6x+13x+26', 'factor'], ['3x(x+2)+13(x+2)', 'factor'], ['(3x+13)(x+2)', 'factor']],
    caps: ['Left: $A=x+4$ gives $3A^2-5A-2$. Right: expand $(x+4)^2=x^2+8x+16$ and distribute.',
      'Left: product $-6$, sum $-5$: $-6$ and $1$. Right: multiply out.',
      'Right: collect: $3x^2+19x+26$. Now hunt for product <b>78</b>, sum 19! Left: group.',
      'Right: $78=6\\times13$, sum 19. Left: common bracket.',
      'Left: unwrap, $\\big[3(x+4)+1\\big]\\big[(x+4)-2\\big]$. Right: group.',
      '<b>Same answer</b>, $(3x+13)(x+2)$. Product $-6$ against product $78$: substitution keeps the numbers small.'] }
};
const race = {
  title: 'Substitute, or expand first?',
  height: 470, minW: 920,
  choices: [{ v: 'e6', label: RC.e6.label }, { v: 'big', label: RC.big.label }],
  ask: (v) => RC[v].ask,
  make(stage, v, ex) {
    const d = RC[v], W = ex.W, cw = (W - 30) / 2, K = KEYS(d.A);
    const lane = (x, t, cls) => { const l = div(stage, 'u4l3-lane ' + cls, `<div class="u4l3-lh">${t}</div>`, x, 4, cw, 462); return l; };
    lane(10, '(a) By substitution', 'u4l3-lane-s'); lane(20 + cw, '(b) By expanding first', 'u4l3-lane-e');
    const meter = (x, p, cls) => { const m = hide(div(stage, 'u4l3-meter ' + cls, `product to hunt: ${T(String(p))}`, x + cw - 14, 10)); m.style.translate = '-100% 0'; return m; };
    const mS = meter(10, d.pS, ''), mE = meter(20 + cw, d.pE, 'u4l3-meter-big');
    const o = { labW: 0, gap: 64, size: 22, y: 64 };
    const L = new Deriv(stage, ex, K, Object.assign({ x: 22 }, o)), R = new Deriv(stage, ex, K, Object.assign({ x: 32 + cw }, o));
    const pill = (D, R2, t) => { const p = h('span', 'u4l3-stg u4l3-stg-' + t, t); R2.el.appendChild(p); return p; };
    const LR = d.sub.map((r, i) => { const x = L.row({ m: r[0], cls: i === 5 ? 'ans' : '' }); pill(L, x, r[1]); return x; });
    const RR = d.exp.map((r, i) => { const x = R.row({ m: r[0], cls: i === 5 ? 'ans' : '' }); pill(R, x, r[1]); return x; });
    const st = stamp(stage, 'same answer', { ok: true, x: W / 2 - 78, y: 430, rotate: -5, size: 'sm' }); hide(st);
    return d.caps.map((cap, i) => ({ cap, run: async (c) => {
      await Promise.all([L.showRow(c, LR[i]), R.showRow(c, RR[i])]);
      if (i === 1) { mS.style.opacity = 1; await pop(c, mS); }
      if (i === 2) { mE.style.opacity = 1; await pop(c, mE); }
      if (i === 5) await stampIn(c, st);
    } }));
  }
};

/* =============================== explainer: perfect squares as a square area =============================== */
const PS = {
  e7b: { label: 'Example 7(b) check', ask: 'Example 7(b): factor $x^4+10x^2+25$ fully.', A: 'x^2', k: 5,
    rows: [['Wrap', '⟦A:ub>w⟧^2+10⟦A:ub>w⟧+25', '$x^4=(x^2)^2$, so let $A=x^2$: $A^2+10A+25$.'],
      ['Factor', '(⟦A⟧+5)^2', '$(A+5)^2$: a perfect square.'],
      ['Unwrap', '(⟦A:w>u⟧+5)^2', 'Unwrap $A=x^2$: $\\boldsymbol{(x^2+5)^2}$. And $x^2+5$ is a sum: it does not factor. Done.', 'ans']],
    f: (x) => x ** 4 + 10 * x * x + 25, g: (x) => (x * x + 5) ** 2, x: 1 },
  e7a: { label: 'Example 7(a) check', ask: 'Example 7(a): factor $(2x+1)^2-6(2x+1)+9$ fully.', A: '2x+1', k: -3,
    rows: [['Wrap', '⟦A:ub>w⟧^2-6⟦A:ub>w⟧+9', 'Let $A=2x+1$: $A^2-6A+9$.'],
      ['Factor', '(⟦A⟧-3)^2', '$(A-3)^2$: a perfect square.'],
      ['Unwrap', '(⟦A:w>u⟧-3)^2', 'Unwrap: $(2x+1-3)^2$. With coefficient 1 in front of $A$, no extra brackets are needed.'],
      ['Simplify', '(2x-2)^2', 'Simplify inside: $2x+1-3=2x-2$.'],
      ['Fully', '\\big[2(x-1)\\big]^2=4(x-1)^2', '$2x-2$ has a common factor 2: $\\big[2(x-1)\\big]^2$. The 2 is squared too: $\\boldsymbol{4(x-1)^2}$.', 'ans']],
    f: (x) => (2 * x + 1) ** 2 - 6 * (2 * x + 1) + 9, g: (x) => 4 * (x - 1) ** 2, x: 3 }
};
const perfectSq = {
  title: 'A perfect square makes a square',
  height: 380, minW: 900,
  choices: [{ v: 'e7a', label: PS.e7a.label }, { v: 'e7b', label: PS.e7b.label }],
  ask: (v) => PS[v].ask,
  make(stage, v, ex) {
    const d = PS[v], W = ex.W, K = KEYS(d.A), k = d.k, ak = Math.abs(k), sg = k > 0 ? '+' : '-';
    const D = new Deriv(stage, ex, K, { gap: 58, size: 24, keyX: W - 300, keyY: 4 });
    // the area grid: A by A, then |k| strips
    const GX = W - 300, GY = 58, SA = 170, SK = 74;
    const g = hide(div(stage, 'u4l3-grid', '', GX, GY, SA + SK + 40, SA + SK + 40));
    const cell = (x, y, w, hh, html, cls) => div(g, 'u4l3-gc ' + cls, html, 34 + x, 34 + y, w, hh);
    const c1 = cell(0, 0, SA, SA, T('A^2'), 'u4l3-gA');
    const c2 = cell(SA, 0, SK, SA, T(`${k}A`), k < 0 ? 'u4l3-gneg' : 'u4l3-gpos');
    const c3 = cell(0, SA, SA, SK, T(`${k}A`), k < 0 ? 'u4l3-gneg' : 'u4l3-gpos');
    const c4 = cell(SA, SA, SK, SK, T(String(k * k)), 'u4l3-gpos');
    div(g, 'u4l3-gs', T(ca('A')), 34 + SA / 2 - 8, 4); div(g, 'u4l3-gs', T(String(k)), 34 + SA + SK / 2 - 12, 4);
    div(g, 'u4l3-gs', T(ca('A')), 6, 34 + SA / 2 - 14); div(g, 'u4l3-gs', T(String(k)), 2, 34 + SA + SK / 2 - 14);
    [c1, c2, c3, c4].forEach(hide);
    const R = d.rows.map((r) => D.row({ lab: r[0], m: r[1], cls: r[3] || '' }));
    const side = hide(div(stage, 'u4l3-gside', `side ${T(`A${sg}${ak}`)}, area ${T(`(A${sg}${ak})^2`)}`, GX + 30, GY + 34 + SA + SK + 8));
    const steps = [
      { cap: d.rows[0][2], run: async (c) => { await D.showTags(c, ['A']); await D.showRow(c, R[0]); } },
      { cap: `First and last terms are squares: ${T('A^2=(A)^2')} and ${T(`${k * k}=(${k})^2`)}. They are the two <b>square</b> corners.`,
        run: async (c) => { g.style.opacity = 1; await show(c, g); for (const e of [c1, c4]) { e.style.opacity = 1; await pop(c, e, 340); } } },
      { cap: `The middle term must be <b>twice</b> their product: ${T(`2(A)(${k})=${2 * k}A`)} ✓. It splits into the two strips ${T(`${k}A+(${k}A)`)}.`,
        run: async (c) => { for (const e of [c2, c3]) { e.style.opacity = 1; await pop(c, e, 340); } } },
      { cap: `The four pieces make a <b>square</b> with side ${T(`A${sg}${ak}`)}. So ${T(`A^2${sg}${2 * ak}A+${k * k}=(A${sg}${ak})^2`)}.`, run: async (c) => { await show(c, side); await D.showRow(c, R[1]); } }
    ];
    d.rows.slice(2).forEach((r, i) => steps.push({ cap: r[2], run: (c) => D.showRow(c, R[i + 2]) }));
    const a = d.f(d.x), b = d.g(d.x), kk = hide(div(stage, 'u4l3-chk', `<b>Check</b> ${T(`x=${d.x}`)}: ${T(String(a))} both ways ✓`, null, null));
    kk.style.position = 'absolute'; kk.style.left = '8px'; kk.style.bottom = '6px';
    steps.push({ cap: `<b>Check</b> with ${T(`x=${d.x}`)}: the question gives ${T(String(a))} and the answer gives ${T(String(b))}.`, run: (c) => pop(c, kk).then(() => { kk.style.opacity = 1; }) });
    return steps;
  }
};

/* =============================== explainer: any chunk; two boxes =============================== */
const TB = {
  e8a: { label: 'Example 8(a) check', ask: 'Example 8(a): factor $2\\sin^2x+\\sin x-1$ fully.', s: {
    keys: KEYS('\\sin x'), o: { gap: 54 }, items: [
      { lab: 'Start', m: '2\\sin^2x+\\sin x-1', cap: `${T('\\sin^2x')} means ${T('(\\sin x)^2')}: the sine of x, squared.` },
      { lab: 'Rewrite', m: '2⟦A:ub⟧^2+⟦A:ub⟧-1', cap: `So the expression is ${T('2(\\sin x)^2+(\\sin x)-1')}: the chunk ${T('\\sin x')} appears twice.` },
      { lab: 'Wrap', m: '2⟦A:ub>w⟧^2+⟦A:ub>w⟧-1', key: ['A'], cap: `Let ${T(ca('A') + '=\\sin x')}: ${T('2A^2+A-1')}.` },
      { lab: 'Split', m: '2⟦A⟧^2+2⟦A⟧-⟦A⟧-1', note: `product ${T('-2')}, sum ${T('1')}`, cap: 'Product $-2$, sum 1: $2$ and $-1$. Split: $2A^2+2A-A-1$.' },
      { lab: 'Group', m: '2⟦A⟧(⟦A⟧+1)-1(⟦A⟧+1)', cap: 'Group: $2A(A+1)-1(A+1)$.' },
      { lab: 'Factor', m: '(2⟦A⟧-1)(⟦A⟧+1)', cap: 'Common bracket: $(2A-1)(A+1)$.' },
      { lab: 'Unwrap', m: '(2⟦A:w>u⟧-1)(⟦A:w>u⟧+1)', cls: 'ans', cap: `Unwrap ${T('A=\\sin x')}: ${T('\\boldsymbol{(2\\sin x-1)(\\sin x+1)}')}.` }
    ] } },
  e8b: { label: 'Example 8(b) check', ask: 'Example 8(b): factor $2(x+2)^2-3(x+2)(2x-1)-2(2x-1)^2$ fully.', s: {
    keys: KEYS('x+2', '2x-1'), o: { gap: 50, size: 23, keyX: null }, items: [
      { lab: 'Start', m: '2⟦A:ub⟧^2-3⟦A:ub⟧⟦B:ub⟧-2⟦B:ub⟧^2', hid: true, cap: 'Two different brackets repeat: $(x+2)$ and $(2x-1)$.' },
      { spot: 0, key: ['A', 'B'], cap: `Two boxes: ${T(ca('A') + '=x+2')} and ${T(cb('B') + '=2x-1')}.` },
      { lab: 'Wrap', m: '2⟦A:ub>w⟧^2-3⟦A:ub>w⟧⟦B:ub>w⟧-2⟦B:ub>w⟧^2', cap: `Wrap: ${T('2A^2-3AB-2B^2')}. Factor it like ${T('6x^2+xy-2y^2')}.` },
      { lab: 'Split', m: '2⟦A⟧^2-4⟦A⟧⟦B⟧+⟦A⟧⟦B⟧-2⟦B⟧^2', note: `product ${T('-4')}, sum ${T('-3')}`, cap: 'Product $2(-2)=-4$, sum $-3$: $-4$ and $1$. Split $-3AB$ into $-4AB+AB$.' },
      { lab: 'Group', m: '2⟦A⟧(⟦A⟧-2⟦B⟧)+⟦B⟧(⟦A⟧-2⟦B⟧)', cap: 'Group: $2A(A-2B)+B(A-2B)$.' },
      { lab: 'Factor', m: '(⟦A⟧-2⟦B⟧)(2⟦A⟧+⟦B⟧)', cap: 'Common bracket: $(A-2B)(2A+B)$.' },
      { lab: 'Unwrap', m: '\\big[⟦A:w>ub⟧-2⟦B:w>ub⟧\\big]\\big[2⟦A:w>ub⟧+⟦B:w>ub⟧\\big]', cap: '<b>Unwrap both boxes, in brackets.</b> Careful: $-2B$ is $-2(2x-1)$.' },
      { lab: 'Expand', m: '(x+2-4x+2)(2x+4+2x-1)', cap: `Expand inside: ${T('-2(2x-1)=-4x+2')} and ${T('2(x+2)=2x+4')}.` },
      { lab: 'Simplify', m: '(-3x+4)(4x+3)=-(3x-4)(4x+3)', cls: 'ans', cap: `Collect: ${T('(-3x+4)(4x+3)')}. Taking out $-1$ gives a positive leading coefficient: ${T('\\boldsymbol{-(3x-4)(4x+3)}')}.` }
    ], chk: { x: 0, f: (x) => 2 * (x + 2) ** 2 - 3 * (x + 2) * (2 * x - 1) - 2 * (2 * x - 1) ** 2, g: (x) => -(3 * x - 4) * (4 * x + 3) } } }
};
const twoBox = {
  title: 'Any expression can be the box',
  height: 470, minW: 920,
  choices: Object.keys(TB).map((k) => ({ v: k, label: TB[k].label })),
  ask: (v) => TB[v].ask,
  make(stage, v, ex) {
    const s = TB[v].s, o = Object.assign({}, s.o);
    if (o.keyX === null) { o.keyX = ex.W - 214; o.keyY = 110; }
    return derivSteps(stage, ex, Object.assign({}, s, { o })).steps;
  }
};

/* =============================== Stand Up Break =============================== */
const lin = (v, k) => (k === 0 ? v : v + cst(k));
standup('u4l3', {
  intro: 'At your whiteboard: find the repeated chunk, box it, factor, unwrap, simplify. Factor fully!',
  levels: {
    BEG: (r) => { // x^4 + bx^2 + c or x^6 + bx^3 + c, no further factoring
      const V = r.pick(['x', 'y', 'n']), e = r.pick([2, 2, 3]), pool = e === 2 ? [-7, -6, -5, -3, -2, 1, 2, 3, 4, 5, 6, 7, 8] : [-7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6];
      let p = r.pick(pool), q = r.pick(pool); while (q === -p || q === p) q = r.pick(pool);
      const b = p + q, c = p * q, A = `${V}^{${e}}`;
      return { text: 'Factor.', q: `${V}^{${2 * e}}${co(b, A)}${cst(c)}`,
        a: [`A=${A}:\\ A^2${co(b, 'A')}${cst(c)}`, `=(A${cst(p)})(A${cst(q)})`, `=(${A}${cst(p)})(${A}${cst(q)})`] };
    },
    PRG: (r) => {
      if (r.chance(0.5)) { // binomial chunk
        const k = r.pick([-4, -3, -2, -1, 1, 2, 3, 4, 5]), pool = [-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6];
        let p = r.pick(pool), q = r.pick(pool); while (q === -p) q = r.pick(pool);
        const b = p + q, c = p * q, B = `(${lin('x', k)})`;
        return { text: 'Factor fully. Simplify each factor.', q: `${B}^2${co(b, B)}${cst(c)}`,
          a: [`A=${lin('x', k)}:\\ A^2${co(b, 'A')}${cst(c)}=(A${cst(p)})(A${cst(q)})`, `=\\big[${B}${cst(p)}\\big]\\big[${B}${cst(q)}\\big]`, `=(${lin('x', k + p)})(${lin('x', k + q)})`] };
      }
      // finishing with a difference of squares
      const s = r.pick([1, 2, 3, 4, 5]), q = r.pick([1, 2, 3, 5, 6, 7, -4, -9, -16, -25].filter((t) => t !== -s * s && t !== s * s));
      const b = q - s * s, c = -s * s * q, a = [`=(x^2-${s * s})(x^2${cst(q)})`];
      let last = `(x-${s})(x+${s})`;
      if (q < 0) { const t = Math.round(Math.sqrt(-q)); last += `(x-${t})(x+${t})`; } else last += `(x^2+${q})`;
      a.push('=' + last);
      return { text: 'Factor fully.', q: `x^4${co(b, 'x^2')}${cst(c)}`, a };
    },
    MAS: (r) => {
      if (r.chance(0.5)) { // a ≠ 1 with a binomial in the box: (mA + p)(A + q)
        const m = r.pick([2, 3]), p = r.pick([-5, -1, 1, 5, m === 2 ? 3 : 2, m === 2 ? -3 : -2]), q = r.pick([-4, -3, -2, -1, 1, 2, 3, 4]), k = r.pick([-3, -2, -1, 1, 2, 3]);
        const a2 = m, b = m * q + p, c = p * q, B = `(${lin('x', k)})`;
        return { text: 'Factor fully. Simplify each factor.', q: `${a2}${B}^2${co(b, B)}${cst(c)}`,
          a: [`A=${lin('x', k)}:\\ ${a2}A^2${co(b, 'A')}${cst(c)}=(${m}A${cst(p)})(A${cst(q)})`, `=\\big[${m}${B}${cst(p)}\\big]\\big[${B}${cst(q)}\\big]`, `=(${m}x${cst(m * k + p)})(${lin('x', k + q)})`] };
      }
      // (p²x² − 1)(x² − q²) expanded
      const p = r.pick([2, 3]), q = r.pick([1, 2, 3]), a2 = p * p, b = -(p * p * q * q + 1), c = q * q;
      return { text: 'Factor fully.', q: `${a2}x^4${co(b, 'x^2')}${cst(c)}`,
        a: [`A=x^2:\\ ${a2}A^2${co(b, 'A')}${cst(c)}`, `=(${a2}x^2-1)(x^2-${c})`, `=(${p}x-1)(${p}x+1)(x-${q})(x+${q})`] };
    }
  }
});

/* =============================== mount =============================== */
mountGift();
const DEFS = { spot, boxIt, dos, tree, decomp, acHunt, boxBin, race, perfectSq, twoBox };
Object.values(DEFS).forEach(mdDef);
export const explainers = mountExplainers(DEFS);
export const _test = { parseLine, cst, co, lead, BX, AH, BB, RC, PS, TB, TR };
