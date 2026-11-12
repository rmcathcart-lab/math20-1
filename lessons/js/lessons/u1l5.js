/* Math 20-1 · Unit 1 · Lesson 5 — Geometric Sequences.
 * Static Example 3 grids and answer dots, and the explainers (the warm-up is plain markup in the page,
 * tools/newformat/specs/u1l5.py):
 *   buildPower (each step multiplies by r once more: n − 1 copies of r; Example 2 (a)–(c) checks),
 *   notFifteen (5(3)^(n−1) vs 15^(n−1) in a table; Example 2(d): 4(2)^(n−1) = 2^(n+1)),
 *   barsDots (the star: each term is a bar copied, slid right and stretched ×r — flipping for r < 0, shrinking for
 *     0 < r < 1 — beside the curving dot plot; Example 3 checks; +4 vs ×2 comparison),
 *   countTerms (divide by t1, climb a ladder of powers, compare exponents; jumps vs terms; Example 4 checks),
 *   twoTerms (count the jumps between two known terms, divide, walk back to t1; the row splits for ±r; Ex 5, 6),
 *   means (k means make k + 2 terms; Example 7 checks).
 * Colours (Unit 1): common ratio r amber, first term t1 teal (the site's teal token); other terms ink/blue; mistakes red. */
import {
  h, tex, fmt, add, box, Graph, mountExplainers, pop, fadeIn, appear, sleep, tween, anim,
  svgEl, liveCtx, pulse, place, drawIn, arrowHead, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const RC = COLORS.amber, TC = COLORS.teal, INK = COLORS.ink, RED = COLORS.red, GRAY = COLORS.gray, BLUE = COLORS.blue, GREEN = COLORS.green, PURPLE = COLORS.purple;
const cr = (s) => `\\textcolor{${RC}}{${s}}`, ct = (s) => `\\textcolor{${TC}}{${s}}`, cx = (s) => `\\textcolor{${RED}}{${s}}`;
/** integer for TeX with a thin space in thousands: 14336 → 14\,336 */
const tn = (v) => (v < 0 ? '-' : '') + fmt(Math.abs(v)).replace(/ /g, '\\,');

/* ---------- rationals ---------- */
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const Q = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); return { n: n / g, d: d / g }; };
const qm = (a, b) => Q(a.n * b.n, a.d * b.d);
const qdiv = (a, b) => Q(a.n * b.d, a.d * b.n);
const qv = (a) => a.n / a.d;
const qpow = (a, k) => { let r = Q(1); for (let i = 0; i < k; i++) r = qm(r, a); return r; };
/** TeX of a rational: 7, -\frac{2}{125} (f = 'frac' | 'tfrac' | 'dfrac') */
const qt = (a, f = 'frac') => (a.d === 1 ? tn(a.n) : (a.n < 0 ? '-' : '') + `\\${f}{${tn(Math.abs(a.n))}}{${tn(a.d)}}`);
/** r in brackets for t1(r)^(n-1): (2), \left(-\tfrac15\right) */
const rp = (a) => (a.d === 1 ? `(${tn(a.n)})` : `\\left(${qt(a, 'tfrac')}\\right)`);
/** "×r" for a multiplier tag: ×2, ×(−⅕) */
const times = (a) => `\\times${a.d === 1 && a.n > 0 ? tn(a.n) : rp(a)}`;

/* ---------- small drawing helpers ---------- */
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const show = (c, el) => fadeIn(c, el, 320);
/** an absolutely placed label in the stage (place(): pos 'c' centred or the side it sits on) */
const lab = (stage, x, y, html, cls = '', pos = 'c', gap = 6) => { const d = add(stage, h('div', 'u1l5-lab ' + cls, html)); place(d, x, y, pos, gap); return d; };
/** a stack of lines (each hidden until shown) */
function lines(stage, x, y, w, cls = '') {
  const el = add(stage, box(h('div', 'u1l5-lines ' + cls), w), x, y);
  return { el, add(html, c2 = '') { const d = h('div', 'u1l5-ln ' + c2, html); el.appendChild(d); hide(d); return d; } };
}
/** an overlay svg covering the stage */
const overlay = (stage, W, H) => svgEl('svg', { class: 'u1l5-ov', width: W, height: H, viewBox: `0 0 ${W} ${H}` }, stage);
/** a hop arc from x1 to x2 on baseline y (bulging up, or down with o.below) with a label at the peak */
function arc(stage, ov, x1, x2, y, html, o = {}) {
  const s = o.below ? 1 : -1, ht = o.h || 34, mx = (x1 + x2) / 2, cy = y + s * ht * 2;
  const g = svgEl('g', { class: 'u1l5-arc' }, ov);
  svgEl('path', { class: 'bk-stroke', d: `M${x1} ${y} Q${mx} ${cy} ${x2} ${y}`, fill: 'none', stroke: o.color || RC, 'stroke-width': o.w || 3.2, 'stroke-linecap': 'round' }, g);
  arrowHead(g, x2, y, x2 - mx, y - cy, { color: o.color || RC, cls: 'bk-end', width: 3 });
  const l = html ? lab(stage, mx, y + s * ht, html, 'u1l5-hoplab ' + (o.cls || ''), o.below ? 's' : 'n', 2) : null;
  hide(g); hide(l);
  return { g, l, async draw(c) { g.style.opacity = 1; await drawIn(g, o.ms || 380, c); if (l) await pop(c, l, 260); } };
}

/* ====================================================================================================
 * Explainer: buildPower — each step multiplies by r once more.
 * ==================================================================================================== */
const BP = {
  e2a: { label: '(a)', t1: Q(7), r: Q(2), n: 12, seq: '7,\\ 14,\\ 28,\\ \\dots' },
  e2b: { label: '(b)', t1: Q(1250), r: Q(-1, 5), n: 8, seq: '1\\,250,\\ -250,\\ 50,\\ \\dots' },
  e2c: { label: '(c)', t1: Q(2, 9), r: Q(3), n: 9, seq: '\\frac29,\\ \\frac23,\\ 2,\\ \\dots' }
};
/** t1 written in front of (r)^(n-1): 7, \tfrac29 */
const t1t = (q) => qt(q, 'tfrac');
function targetTex(d, bold = true) {
  const { t1, r, n } = d, k = n - 1, val = qm(t1, qpow(r, k)), rk = qpow(r, k), B = (x) => (bold ? `\\boldsymbol{${x}}` : x);
  const head = `t_{${n}}=${t1t(t1)}${rp(r)}^{${k}}`;
  if (r.d === 1) return `${head}=${t1t(t1)}(${tn(rk.n)})=${B(qt(val))}`;
  // a fraction r: 1250(-1/5)^7 = -1250/78125 = -2/125 (the middle fraction not reduced)
  return `${head}=${qt({ n: t1.n * rk.n, d: t1.d * rk.d })}=${B(qt(val))}`;
}
const buildPower = {
  title: 'Each step multiplies by r once more',
  height: 440,
  capH: 84,
  choices: [{ sep: 'Example 2 check:' }, ...Object.keys(BP).map((k) => ({ v: k, label: BP[k].label }))],
  ask: (k) => `Example 2${BP[k].label}: ${T(BP[k].seq)}; find the general term and ${T(`t_{${BP[k].n}}`)}.`,
  make(stage, k, ex) {
    const W = ex.W, d = BP[k], { t1, r, n } = d;
    const big = r.d !== 1 || r.n < 0, cw = big ? 92 : 62, chipsW = 3 * (cw + 8);
    const vals = [0, 1, 2, 3].map((j) => qm(t1, qpow(r, j)));
    const rowY = (j) => 8 + j * 60;
    const mkRow = (y, labTex, nChips, formTex, valTex, o = {}) => {
      const row = add(stage, h('div', 'u1l5-prow'), 16, y);
      row.innerHTML = `<div class="u1l5-plab">${T(labTex)}</div><div class="u1l5-pt1">${T(ct(t1t(t1)))}</div><div class="u1l5-pchips" style="width:${chipsW}px"></div><div class="u1l5-pform">${T(formTex)}</div><div class="u1l5-pval">${valTex ? T(valTex) : ''}</div>`;
      const cc = row.querySelector('.u1l5-pchips'), chips = [];
      if (o.dots) {
        ['', '', 'dots', ''].forEach((t) => { const e = h('div', t ? 'u1l5-pdots' : 'u1l5-pchip', t ? T('\\cdots') : T(cr(times(r)))); e.style.width = (t ? 34 : cw) + 'px'; cc.appendChild(e); chips.push(e); });
        const br = h('div', 'u1l5-pbrace', `${T('n-1')} copies of ${T(cr('r'))}`); cc.appendChild(br); chips.push(br);
      } else for (let i = 0; i < nChips; i++) { const e = h('div', 'u1l5-pchip', T(cr(times(r)))); e.style.width = cw + 'px'; cc.appendChild(e); chips.push(e); }
      hide(row); chips.forEach(hide);
      return { row, chips, form: row.querySelector('.u1l5-pform'), val: row.querySelector('.u1l5-pval') };
    };
    const forms = [ct('t_1'), ct('t_1') + cr('r'), ct('t_1') + cr('r^2'), ct('t_1') + cr('r^3')];
    const rows = [0, 1, 2, 3].map((j) => mkRow(rowY(j), `t_${j + 1}=`, j, '=' + forms[j], '=' + qt(vals[j], 'tfrac')));
    const vd = add(stage, h('div', 'u1l5-pvdots', T('\\vdots')), 56, rowY(4) - 16); hide(vd);
    const gen = `t_n=${t1t(t1)}${rp(r)}^{n-1}`;
    const nRow = mkRow(rowY(4) + 8, 't_n=', 0, `=${ct('t_1')}${cr('r')}^{\\,n-1}`, '', { dots: true });
    nRow.val.innerHTML = T(`\\Rightarrow\\ ${gen}`);
    const tgt = add(stage, h('div', 'u1l5-ptgt', T(targetTex(d))), 16, 374); hide(tgt);
    const showRow = async (c, R) => { R.row.style.opacity = 1; await fadeIn(c, R.row.querySelector('.u1l5-plab'), 200); for (const e of R.chips) await pop(c, e, 220); await show(c, R.form); await show(c, R.val); };
    rows.forEach((R) => { R.form.style.opacity = 0; R.val.style.opacity = 0; });
    nRow.form.style.opacity = 0; nRow.val.style.opacity = 0;
    const v = (j) => T(qt(vals[j], 'tfrac'));
    return [
      { cap: `Start with the first term: ${T(ct('t_1=' + t1t(t1)))}. No ${T('r')} yet.`, run: (c) => showRow(c, rows[0]) },
      { cap: `${T('t_2')}: multiply by ${T(cr('r'))} <b>once</b>. ${T(`t_2=t_1r`)} = ${v(1)}.`, run: (c) => showRow(c, rows[1]) },
      { cap: `${T('t_3')}: <b>two</b> copies of ${T(cr('r'))}, so ${T('t_3=t_1r^2')} = ${v(2)}.`, run: (c) => showRow(c, rows[2]) },
      { cap: `${T('t_4=t_1r^3')} = ${v(3)}. The exponent is always <b>one less than the position</b>.`, run: (c) => showRow(c, rows[3]) },
      { cap: `Position ${T('n')} has ${T('n-1')} copies of ${T(cr('r'))}: the general term is ${T(gen)}.`, run: async (c) => { await show(c, vd); await showRow(c, nRow); } },
      { cap: `For ${T(`t_{${n}}`)}, ${T(`n-1=${n - 1}`)}: ${T(targetTex(d, false))}.`, run: (c) => pop(c, tgt) }
    ];
  }
};

/* ====================================================================================================
 * Explainer: notFifteen — why 5(3)^(n−1) is not 15^(n−1); Example 2(d) as a single power.
 * ==================================================================================================== */
const notFifteen = {
  title: 'Leave it as t₁rⁿ⁻¹',
  height: 380,
  capH: 84,
  choices: [{ v: 'w', label: T('5(3)^{n-1}\\ \\text{vs}\\ 15^{n-1}') }, { v: 'e2d', label: 'Example 2(d) check' }],
  ask: (k) => (k === 'e2d' ? `Example 2(d): write the general term of ${T('4,\\ 8,\\ 16,\\ \\dots')} as a single power of 2.` : ''),
  make(stage, k, ex) {
    const W = ex.W;
    if (k === 'w') {
      const top = lab(stage, W / 2, 14, `${T('5,\\ 15,\\ 45,\\ \\dots')}: &nbsp;${T(ct('t_1=5'))}, ${T(cr('r=3'))}, so ${T(`t_n=${ct('5')}${cr('(3)')}^{n-1}`)}`, 'u1l5-ntop', 's', 0);
      const x0 = (W - 830) / 2, xs = [x0, x0 + 130, x0 + 500], ws = [110, 330, 330], y0 = 76, rh = 58;
      const cell = (ci, ri, html, cls = '') => add(stage, box(h('div', 'u1l5-cell ' + cls, html), ws[ci], rh - 6), xs[ci], y0 + ri * rh);
      cell(0, 0, T('n'), 'u1l5-ch'); cell(1, 0, T(`${ct('5')}${cr('(3)')}^{n-1}`), 'u1l5-ch'); const hR = cell(2, 0, T('15^{n-1}'), 'u1l5-ch u1l5-chx');
      const L = [['5(3)^0=5(1)=5', '15^0=1'], ['5(3)^1=15', '15^1=15'], ['5(3)^2=5(9)=45', '15^2=225']];
      [1, 2, 3].forEach((n) => cell(0, n, T(String(n))));
      const left = L.map((p, i) => hide(cell(1, i + 1, T(p[0] + '\\ \\checkmark'), 'u1l5-cok')));
      const right = L.map((p, i) => hide(cell(2, i + 1, T(p[1]) + (i === 1 ? '' : ' ✗'), i === 1 ? '' : 'u1l5-cbad')));
      const order = hide(lab(stage, xs[1] + ws[1] / 2, y0 + 4 * rh + 6, `power <b>first</b>, then ${T('\\times5')}`, 'u1l5-note', 's', 0));
      const verdict = hide(lab(stage, xs[2] + ws[2] / 2, y0 + 4 * rh + 6, `${T('5(3)^{n-1}\\ne15^{n-1}')}`, 'u1l5-verdict u1l5-vbad', 's', 0));
      hide(hR);
      return [
        { cap: `Order of operations: the <b>power comes first</b>, and the exponent belongs only to the 3. Then multiply by 5.`, run: (c) => show(c, order) },
        { cap: `${T('n=1,\\ 2,\\ 3')}: ${T('5(3)^0=5')}, ${T('5(3)^1=15')}, ${T('5(3)^2=45')}. The sequence, exactly. ✓`, run: async (c) => { for (const e of left) await show(c, e); } },
        { cap: `Multiplying first gives ${T('15^{n-1}')}: ${T('15^0=1')}, ${T('15^1=15')}, ${T('15^2=225')}. Wrong from the very first term.`, run: async (c) => { await show(c, hR); for (const e of right) await show(c, e); } },
        { cap: `So ${T('5(3)^{n-1}\\ne15^{n-1}')}. Leave the general term as ${T(`${ct('t_1')}${cr('r')}^{n-1}`)}.`, run: (c) => pop(c, verdict) }
      ];
    }
    const P = lines(stage, 40, 30, 520, 'u1l5-big');
    const l1 = P.add(T(`t_n=${ct('4')}${cr('(2)')}^{n-1}`));
    const l2 = P.add(T(`\\phantom{t_n}=${ct('2^2')}\\cdot${cr('2')}^{n-1}`) + ' <span class="u1l5-why">4 is a power of 2</span>');
    const l3 = P.add(T(`\\phantom{t_n}=2^{2+(n-1)}`) + ' <span class="u1l5-why">same base: add exponents</span>');
    const l4 = P.add(T(`\\phantom{t_n}=\\boldsymbol{2^{n+1}}`));
    const ck = lines(stage, 620, 40, W - 660, 'u1l5-ck');
    ck.add('<b>Check</b>');
    const cks = [[1, 4], [2, 8], [3, 16]].map(([n, v]) => ck.add(T(`n=${n}:\\ 2^{${n + 1}}=${v}\\ \\checkmark`)));
    const head = ck.el.firstChild;
    return [
      { cap: `${T(ct('t_1=4'))} and ${T(cr('r=\\tfrac84=2'))}, so ${T('t_n=4(2)^{n-1}')}.`, run: (c) => show(c, l1) },
      { cap: `${T('t_1')} is a power of ${T('r')}: ${T('4=2^2')}.`, run: (c) => show(c, l2) },
      { cap: `Same base, so the exponent laws add the exponents: ${T('2+(n-1)=n+1')}.`, run: async (c) => { await show(c, l3); await show(c, l4); } },
      { cap: `Check: ${T('n=1')} gives ${T('2^2=4')} ✓, ${T('n=2')} gives ${T('2^3=8')} ✓, ${T('n=3')} gives ${T('2^4=16')} ✓.`, run: async (c) => { await show(c, head); for (const e of cks) await show(c, e); } }
    ];
  }
};

/* ====================================================================================================
 * Explainer: barsDots (the star) — each term is the previous bar copied, slid right and stretched ×r, beside the dots.
 * ==================================================================================================== */
const BD = {
  g2: { label: T('t_1=4,\\ r=2'), t1: 4, r: 2, rt: '2', N: 5, ymin: 0, ymax: 72, ystep: 8, ylab: 16, cmp: true },
  e3a: { label: 'Example 3(a) check', t1: 64, r: 0.5, rt: '0.5', N: 6, ymin: 0, ymax: 72, ystep: 8, ylab: 16 },
  e3b: { label: 'Example 3(b) check', t1: 1, r: -2, rt: '(-2)', N: 5, ymin: -10, ymax: 18, ystep: 2, ylab: 4 },
  neg: { label: T('t_1=32,\\ r=-\\tfrac12'), t1: 32, r: -0.5, rt: '\\left(-\\tfrac12\\right)', N: 6, ymin: -20, ymax: 36, ystep: 4, ylab: 8 }
};
const barsDots = {
  title: 'Bars that multiply by r, and the dots they make',
  height: 450,
  capH: 84,
  choices: Object.keys(BD).map((k) => ({ v: k, label: BD[k].label })),
  ask: (k) => (k === 'e3a' ? `Example 3(a): ${T('t_n=64(0.5)^{n-1}')}, ${T('n=1')} to 6` : k === 'e3b' ? `Example 3(b): ${T('t_n=(-2)^{n-1}')}, ${T('n=1')} to 5` : ''),
  intro: 'Each new bar is the last bar, copied and multiplied by r. Press <b>Next</b>.',
  make(stage, k, ex) {
    const W = ex.W, d = BD[k], { t1, r, N } = d;
    const vals = Array.from({ length: N }, (_, i) => t1 * r ** i);
    const gw = Math.floor((W - 50) / 2), gh = 414;
    const opts = { width: gw, height: gh, xmin: 0, xmax: N + 0.8, ymin: d.ymin, ymax: d.ymax, xstep: 1, ystep: d.ystep, xlabels: 1, ylabels: d.ylab, xtitle: 'n', ytitle: 't_n', pad: [20, 18, d.ymin >= 0 ? 34 : 18, 46] };
    const Gb = new Graph(stage, Object.assign({ x: 10, y: 32 }, opts)), Gd = new Graph(stage, Object.assign({ x: 30 + gw, y: 32 }, opts));
    lab(stage, 10 + gw / 2, 2, `<b>Bars</b>: each one is the last one ${T(cr('\\times r'))}`, 'u1l5-gtitle', 's', 0);
    lab(stage, 30 + gw + gw / 2, 2, `<b>Dots</b>: the points ${T('(n,\\ t_n)')}`, 'u1l5-gtitle', 's', 0);
    const bw = 0.62;
    const bar = (n, v, cls) => { const e = svgEl('rect', { class: 'u1l5-bar ' + cls }, Gb.layers.data); e.n = n; e.v = v; return Gb.track(e, () => { const [xa, ya] = Gb.toPx(e.n - bw / 2, Math.max(0, e.v)), [xb, yb] = Gb.toPx(e.n + bw / 2, Math.min(0, e.v)); e.setAttribute('x', xa); e.setAttribute('y', ya); e.setAttribute('width', xb - xa); e.setAttribute('height', Math.max(0.5, yb - ya)); }); };
    const vt = (v) => (Number.isInteger(v) ? tn(v) : String(v).replace('-', '-'));
    const vlab = (n, v) => hide(Gb.label(n, v, T(n === 1 ? ct(vt(v)) : vt(v)), { pos: v >= 0 ? 'n' : 's', cls: 'u1l5-blab', gap: 4 }));
    const tag = hide(add(Gb.html, h('div', 'u1l5-rtag', T(cr('\\times' + d.rt)))));
    const bars = [], labs = [], dots = [];
    const flips = r < 0, shrink = Math.abs(r) < 1;
    const how = flips ? (shrink ? 'flips to the other side of the axis and shrinks to half' : `flips to the other side of the axis and grows ${Math.abs(r)} times as long`) : shrink ? 'shrinks to half' : `stretches to ${r} times as tall`;
    const steps = [{
      cap: `The first term ${T(ct('t_1=' + vt(t1)))}: one bar, and its dot at ${T(`(1,\\ ${vt(t1)})`)}.`,
      run: async (c) => {
        const b = bar(1, 0, 'u1l5-bar1'); bars.push(b);
        await tween(c, 500, (t) => { b.v = t1 * t; b._bkDraw(); });
        const l = vlab(1, t1); labs.push(l); await show(c, l);
        const p = Gd.point(1, t1, { color: TC, r: 8 }); dots.push(p); await Gd.reveal(p, c);
      }
    }];
    for (let i = 1; i < N; i++) {
      const v0 = vals[i - 1], v1 = vals[i];
      const cap = i === 1 ? `${T(cr('\\times' + d.rt))}: copy the bar, slide it right, and it ${how}: ${T(`t_2=${vt(v1)}`)}. Its dot goes beside it.`
        : i === 2 ? `Again ${T(cr('\\times' + d.rt))}: ${T(`t_3=${vt(v0)}\\times${d.rt}=${vt(v1)}`)}.`
          : `${T(cr('\\times' + d.rt))} again: ${T(`t_${i + 1}=${vt(v1)}`)}.`;
      steps.push({ cap, run: async (c) => {
        const b = bar(i, v0, 'u1l5-barc'); bars.push(b);
        const posTag = () => { const [px, py] = Gb.toPx(b.n, b.v), [, p0] = Gb.toPx(0, 0), up = b.v >= 0 ? py - 34 : py + 34, y = Math.max(16, Math.min(gh - 52, up)); place(tag, px + 26, y, 'c', 0); };
        posTag(); tag.style.opacity = 1;
        await tween(c, c && c.fast ? 0 : 380, (t) => { b.n = i + t; b._bkDraw(); posTag(); });
        await tween(c, c && c.fast ? 0 : 820, (t) => { b.v = v0 + (v1 - v0) * t; b._bkDraw(); posTag(); });
        b.setAttribute('class', 'u1l5-bar ' + (v1 < 0 ? 'u1l5-barneg' : 'u1l5-barpos'));
        tag.style.opacity = 0;
        const l = vlab(i + 1, v1); labs.push(l); await show(c, l);
        const p = Gd.point(i + 1, v1, { color: v1 < 0 ? RED : BLUE, r: 8 }); dots.push(p); await Gd.reveal(p, c);
      } });
    }
    const descr = flips ? (shrink ? 'alternate sides and close in on 0' : 'alternate sides and move further away') : shrink ? 'curve down and level off toward 0' : 'curve up more and more steeply';
    // the description pill goes in the emptiest spot of the dot plot (farthest from every dot)
    const spot = (() => {
      const pw = 240 / Gd.ux, ph = 60 / Gd.uy, w = Gd.win, all = d.cmp ? vals.map((v, i) => [i + 1, v]).concat([4, 8, 12, 16, 20].map((v, i) => [i + 1, v])) : vals.map((v, i) => [i + 1, v]);
      let best = null;
      for (let i = 0; i <= 12; i++) for (let j = 0; j <= 16; j++) {
        const cxu = 0.7 + pw / 2 + (w.xmax - 0.8 - pw) * i / 12, cyu = w.ymin + ph / 2 + (w.ymax - w.ymin - ph) * j / 16;
        const dist = Math.min(...all.map(([x, y]) => { const dx = Math.max(0, Math.abs(x - cxu) - pw / 2) * Gd.ux, dy = Math.max(0, Math.abs(y - cyu) - ph / 2) * Gd.uy; return Math.hypot(dx, dy); }));
        const axisPen = Math.abs(cyu) < ph / 2 ? 30 : 0;
        if (!best || dist - axisPen > best.s) best = { x: cxu, y: cyu, s: dist - axisPen };
      }
      return best;
    })();
    const pill = hide(Gd.label(spot.x, spot.y, `<b>non-linear</b>:<br>${descr}`, { pos: 'c', cls: 'u1l5-dpill', clip: false }));
    if (d.cmp) {
      const ar = [4, 8, 12, 16, 20];
      steps.push({ cap: `Compare adding: ${T('4,\\ 8,\\ 12,\\ 16,\\ 20')} (${T(cr('+4'))}, gray) makes a <b>straight</b> line of dots. Multiplying by ${T(cr('2'))} curves away: the gap doubles every step.`,
        run: async (c) => {
          for (let i = 0; i < ar.length; i++) { const p = Gd.point(i + 1, ar[i], { color: GRAY, r: 7, open: true }); await Gd.reveal(p, c); }
          const a = Gd.label(4.9, 20, `${T(cr('+4'))}: a line`, { pos: 's', gap: 24, cls: 'u1l5-dpill u1l5-gray', clip: false }); await pop(c, a);
          await pop(c, pill);
        } });
    } else steps.push({ cap: `The dots ${descr}: a <b>non-linear</b> graph. (Separate dots: never join them.)`, run: (c) => pop(c, pill) });
    return steps;
  }
};

/* ====================================================================================================
 * Explainer: countTerms — divide by t1, climb the powers, compare exponents; jumps vs terms.
 * ==================================================================================================== */
const CT = {
  e4a: { label: 'Example 4(a) check', seq: '3,\\ 6,\\ 12,\\ \\dots,\\ 6\\,144', base: 2, k: 11, neg: false,
    L: [`${ct('t_1=3')},\\ ${cr('r=2')}`, `3(2)^{n-1}=6\\,144`, `2^{n-1}=2\\,048`, `2\\,048=2^{11}`, `n-1=11\\ \\Rightarrow\\ n=12`],
    caps: ['Set the general term equal to the last term: ' + T('3(2)^{n-1}=6\\,144') + '.',
      'Divide both sides by ' + T(ct('t_1=3')) + ': ' + T('2^{n-1}=2\\,048') + '.',
      'Write ' + T('2\\,048') + ' as a power of 2: keep doubling until you reach it.'] },
  e4b: { label: 'Example 4(b) check', seq: '1\\,215,\\ -405,\\ 135,\\ \\dots,\\ -\\frac59', base: 3, k: 7, neg: true,
    L: [`${ct('t_1=1\\,215')},\\ ${cr('r=-\\tfrac13')}`, `1\\,215\\left(-\\dfrac13\\right)^{n-1}=-\\dfrac59`, `\\left(-\\dfrac13\\right)^{n-1}=-\\dfrac{5}{9\\cdot1\\,215}=-\\dfrac{1}{2\\,187}`, `-\\dfrac{1}{2\\,187}=\\left(-\\dfrac13\\right)^{7}`, `n-1=7\\ \\Rightarrow\\ n=8`],
    caps: ['Set the general term equal to the last term: ' + T('1\\,215\\left(-\\tfrac13\\right)^{n-1}=-\\tfrac59') + '.',
      'Divide both sides by ' + T(ct('1\\,215')) + ': ' + T('-\\tfrac{5}{9\\cdot1\\,215}=-\\tfrac{5}{10\\,935}=-\\tfrac{1}{2\\,187}') + '.',
      'Write ' + T('2\\,187') + ' as a power of 3: keep multiplying by 3. The minus sign needs an <b>odd</b> power of ' + T('-\\tfrac13') + '.'] }
};
const countTerms = {
  title: 'How many terms?',
  height: 470,
  capH: 84,
  choices: Object.keys(CT).map((k) => ({ v: k, label: CT[k].label })),
  ask: (k) => `Example 4(${k.slice(3)}): how many terms in ${T(CT[k].seq)}?`,
  make(stage, k, ex) {
    const W = ex.W, d = CT[k], ov = overlay(stage, W, 470);
    const P = lines(stage, 24, 8, 560, 'u1l5-big2');
    const L = d.L.map((s, i) => P.add(T(i === 4 ? `\\boldsymbol{${s}}` : s)));
    const lx = 620, lw = W - lx - 20, rows = d.k, rh = Math.min(27, 300 / rows);
    const lad = add(stage, box(h('div', 'u1l5-ladder'), lw), lx, 8);
    const rungs = [];
    for (let j = 1; j <= rows; j++) { const e = h('div', 'u1l5-rung', T(`${d.base}^{${j}}=${tn(d.base ** j)}`)); e.style.height = rh + 'px'; lad.appendChild(e); rungs.push(hide(e)); }
    // the strip of terms: N dots with N−1 jumps
    const N = d.k + 1, sx = 40, ex2 = W - 40, yS = 410, dx = (ex2 - sx) / (N - 1);
    const dotsG = svgEl('g', {}, ov), jumps = [], tdots = [], tl = [];
    for (let i = 0; i < N; i++) {
      const y = yS;
      tdots.push(hide(svgEl('circle', { cx: sx + i * dx, cy: y, r: 8, fill: i === 0 ? TC : d.neg && i % 2 ? RED : INK }, dotsG)));
      if (i === 0 || i === N - 1) tl.push(hide(lab(stage, sx + i * dx, y + 14, T(i === 0 ? 't_1' : `t_{${N}}`), 'u1l5-small', 's', 0)));
      if (i < N - 1) jumps.push(arc(stage, ov, sx + i * dx + 9, sx + (i + 1) * dx - 9, yS - 22, '', { h: 12, w: 2.6 }));
    }
    const cnt = hide(lab(stage, W / 2, yS - 46, `<b>${d.k} jumps</b> of ${T(cr('\\times r'))} join <b>${N} terms</b>`, 'u1l5-note', 'n', 0));
    return [
      { cap: d.caps[0], run: async (c) => { await show(c, L[0]); await show(c, L[1]); } },
      { cap: d.caps[1], run: (c) => show(c, L[2]) },
      { cap: d.caps[2], run: async (c) => { for (const e of rungs) await fadeIn(c, e, 140); rungs[rows - 1].classList.add('u1l5-rhit'); await show(c, L[3]); } },
      { cap: `Same base on both sides, so the exponents are equal: ${T(`n-1=${d.k}`)} and ${T(`n=${N}`)}. <b>${N} terms</b>.`, run: (c) => pop(c, L[4]) },
      { cap: `Picture it: ${d.k} jumps of ${T(cr('\\times r'))} join ${N} terms. The number of terms is <b>one more</b> than the exponent.`,
        run: async (c) => { for (let i = 0; i < N; i++) { await appear(c, tdots[i], 100); if (i < N - 1) { jumps[i].g.style.opacity = 1; await drawIn(jumps[i].g, 120, c); } } for (const e of tl) await show(c, e); await pop(c, cnt); } }
    ];
  }
};

/* ====================================================================================================
 * twoTerms and means: a row of term boxes; count the jumps between the known terms, divide, (split for ±r), fill.
 * ==================================================================================================== */
class TermRow {
  constructor(stage, ov, o) {
    Object.assign(this, o); this.stage = stage; this.ov = ov; this.boxes = []; this.tags = [];
    for (let i = 1; i <= o.N; i++) {
      const known = o.known[i] != null;
      const b = add(stage, box(h('div', 'u1l5-tb u1l5-tbs' + (known ? ' u1l5-tbk' : ' u1l5-tbq'), T(known ? (i === 1 ? ct(tn(o.known[i])) : tn(o.known[i])) : '?')), o.bw, o.bh), this.X(i), o.y);
      this.boxes[i] = b;
      this.tags[i] = lab(stage, this.CX(i), o.y + o.bh + 4, T(`t_{${i}}`), 'u1l5-small', 's', 0);
    }
    if (o.rtag) this.rtag = hide(lab(stage, o.x0 - 12, o.y + o.bh / 2, '', 'u1l5-rowtag', 'w', 0));
    this.arcs = {};
  }
  X(i) { return this.x0 + (i - 1) * (this.bw + this.gap); }
  CX(i) { return this.X(i) + this.bw / 2; }
  arc(i, html) { const a = arc(this.stage, this.ov, this.CX(i) + 14, this.CX(i + 1) - 14, this.y - 4, html, { h: 26 }); this.arcs[i] = a; return a; }
  async jumps(c, a, b, html) { for (let i = a; i < b; i++) await (this.arcs[i] || this.arc(i, html)).draw(c); }
  relabel(html) { Object.values(this.arcs).forEach((a) => { if (a.l) a.l.innerHTML = html; }); }
  async set(c, i, v, cls = 'u1l5-tbnew') { const b = this.boxes[i]; b.innerHTML = T(i === 1 ? ct(tn(v)) : tn(v)); b.classList.remove('u1l5-tbq'); b.classList.add(cls); await pop(c, b, 300); }
}
function gapLayout(W, N, rtag) { const left = rtag ? 120 : 30, gap = 30, bw = Math.min(128, (W - left - 30 - (N - 1) * gap) / N); return { x0: left + Math.max(0, (W - left - 30 - (N * bw + (N - 1) * gap)) / 2), bw, gap, bh: 62 }; }
const rT = (r) => cr(r < 0 ? `\\times(${r})` : `\\times${r}`);
const TT = {
  e5: { label: 'Example 5 check', N: 6, a: 3, b: 6, va: 12, vb: -96, rs: [-2] },
  e6: { label: 'Example 6 check', N: 5, a: 2, b: 4, va: 12, vb: 108, rs: [3, -3] }
};
function gapMake(stage, d, ex, mode) {
  const W = ex.W, H = 470, ov = overlay(stage, W, H), two = d.rs.length === 2, L = gapLayout(W, d.N, true);
  const known = { [d.a]: d.va, [d.b]: d.vb };
  const R1 = new TermRow(stage, ov, Object.assign({ N: d.N, known, y: 86, rtag: true }, L));
  const R2 = two ? new TermRow(stage, ov, Object.assign({ N: d.N, known, y: 236, rtag: true }, L)) : null;
  if (R2) { R2.boxes.forEach((b) => b && hide(b)); R2.tags.forEach((t) => t && hide(t)); }
  const P = lines(stage, 30, two ? 340 : 230, W - 60, 'u1l5-big2');
  const gapN = d.b - d.a, pw = (n) => (n === 1 ? '' : `^{${n}}`);
  const seqOf = (r) => Array.from({ length: d.N }, (_, i) => d.va * r ** (i + 1 - d.a));
  return { W, R1, R2, P, gapN, pw, seqOf, two, known };
}
const twoTerms = {
  title: 'Two terms known: count the jumps, then divide',
  height: 470,
  capH: 84,
  choices: Object.keys(TT).map((k) => ({ v: k, label: TT[k].label })),
  ask: (k) => (k === 'e5' ? `Example 5: ${T('t_3=12')} and ${T('t_6=-96')}. Find ${T('r')}, ${T('t_1')} and the general term.` : `Example 6: ${T('t_2=12')} and ${T('t_4=108')}. Find ${T('t_1')} and ${T('t_5')} for each sequence.`),
  make(stage, k, ex) {
    const d = TT[k], g = gapMake(stage, d, ex), { R1, R2, P, gapN, pw } = g;
    const div = `\\dfrac{t_1r^{${d.b - 1}}}{t_1r${pw(d.a - 1)}}=\\dfrac{${tn(d.vb)}}{${tn(d.va)}}\\ \\Rightarrow\\ r^{${gapN}}=${tn(d.vb / d.va)}`;
    const l1 = P.add(T(div));
    const steps = [
      { cap: `${T(`t_{${d.a}}=${d.va}`)} and ${T(`t_{${d.b}}=${tn(d.vb)}`)}. From ${T(`t_{${d.a}}`)} to ${T(`t_{${d.b}}`)} is <b>${gapN} jumps</b> of ${T(cr('\\times r'))}, so ${T(`t_{${d.b}}=t_{${d.a}}r^{${gapN}}`)}.`,
        run: (c) => R1.jumps(c, d.a, d.b, T(cr('\\times r'))) },
      { cap: `Divide the two terms: ${T(`t_1`)} cancels and ${T(`r^{${gapN}}=${tn(d.vb / d.va)}`)} is left.`, run: (c) => show(c, l1) }
    ];
    if (!g.two) {
      const r = d.rs[0], t1 = d.va / r ** (d.a - 1), seq = g.seqOf(r);
      const l2 = P.add(T(`r=${r}\\qquad t_1(${r})^{${d.a - 1}}=${d.va}\\ \\Rightarrow\\ ${r ** (d.a - 1)}t_1=${d.va}\\ \\Rightarrow\\ ${ct(`t_1=${t1}`)}`));
      const l3 = P.add(T(`\\boldsymbol{t_n=${t1}(${r})^{n-1}}`));
      steps.push({ cap: `An <b>odd</b> power has one root: ${T(cr(`r=${r}`))}. Then ${T(`t_1(${r})^${d.a - 1}=${d.va}`)}, so ${T(`${r ** (d.a - 1)}t_1=${d.va}`)} and ${T(ct(`t_1=${t1}`))}.`,
        run: async (c) => { R1.relabel(T(rT(r))); R1.rtag.innerHTML = T(cr(`r=${r}`)); await show(c, R1.rtag); await show(c, l2); for (let i = d.a - 1; i >= 1; i--) await R1.set(c, i, seq[i - 1]); } });
      steps.push({ cap: `Fill in the rest: ${T(seq.map(tn).join(',\\ '))}. The general term is ${T(`t_n=${t1}(${r})^{n-1}`)}.`,
        run: async (c) => { for (let i = d.a + 1; i < d.b; i++) await R1.set(c, i, seq[i - 1]); await pop(c, l3); } });
      return steps;
    }
    const [ra, rb] = d.rs, sa = g.seqOf(ra), sb = g.seqOf(rb);
    steps.push({ cap: `An <b>even</b> power has two roots: ${T(cr('r=3'))} <b>or</b> ${T(cr('r=-3'))}. Both work, so the row splits into <b>two sequences</b>.`,
      run: async (c) => {
        R1.relabel(T(rT(ra))); R1.rtag.innerHTML = T(cr(`r=${ra}`)); await show(c, R1.rtag);
        R2.boxes.forEach((b) => b && (b.style.opacity = 1)); R2.tags.forEach((t) => t && (t.style.opacity = 1));
        await Promise.all(R2.boxes.filter(Boolean).map((b) => anim(c, b, [{ transform: 'translateY(-150px)', opacity: 0.3 }, { transform: 'none', opacity: 1 }], 600)));
        R2.rtag.innerHTML = T(cr(`r=${rb}`)); await show(c, R2.rtag); await R2.jumps(c, d.a, d.b, T(rT(rb)));
      } });
    steps.push({ cap: `${T('r=3')}: ${T(`t_1=12\\div3=${ct('4')}`)}, and ${T('t_5=108\\times3=324')}: ${T(sa.map(tn).join(',\\ '))}.`,
      run: async (c) => { await R1.set(c, 1, sa[0]); await R1.set(c, 3, sa[2]); await R1.set(c, 5, sa[4]); } });
    steps.push({ cap: `${T('r=-3')}: ${T(`t_1=12\\div(-3)=${ct('-4')}`)}, and ${T('t_5=108\\times(-3)=-324')}: ${T(sb.map(tn).join(',\\ '))}.`,
      run: async (c) => { await R2.set(c, 1, sb[0]); await R2.set(c, 3, sb[2]); await R2.set(c, 5, sb[4]); } });
    return steps;
  }
};
const ME = {
  e7a: { label: 'Example 7(a) check', N: 5, a: 1, b: 5, va: 5, vb: 405, rs: [3, -3], k: 3 },
  e7b: { label: 'Example 7(b) check', N: 4, a: 1, b: 4, va: 4, vb: -500, rs: [-5], k: 2 }
};
const means = {
  title: 'k means make k + 2 terms',
  height: 470,
  capH: 84,
  choices: Object.keys(ME).map((k) => ({ v: k, label: ME[k].label })),
  ask: (k) => (k === 'e7a' ? 'Example 7(a): insert three geometric means between 5 and 405.' : `Example 7(b): insert two geometric means between 4 and ${T('-500')}.`),
  make(stage, k, ex) {
    const d = ME[k], g = gapMake(stage, d, ex), { R1, R2, P, gapN } = g;
    const pow = tn(d.vb / d.va);
    const l1 = P.add(T(`${d.k}\\text{ means}+2=${d.N}\\text{ terms:}\\quad ${ct(`t_1=${d.va}`)},\\ \\ t_{${d.N}}=${tn(d.vb)}\\quad\\Rightarrow\\quad ${d.va}r^{${gapN}}=${tn(d.vb)}\\ \\Rightarrow\\ r^{${gapN}}=${pow}`));
    const steps = [
      { cap: `${d.k} means between the two numbers make <b>${d.k} + 2 = ${d.N} terms</b>: ${T(ct(`t_1=${d.va}`))} and ${T(`t_{${d.N}}=${tn(d.vb)}`)}.`, run: async (c) => { for (let i = 2; i < d.N; i++) await pulse(c, R1.boxes[i], 1.08); } },
      { cap: `From ${T('t_1')} to ${T(`t_{${d.N}}`)} is ${gapN} jumps: ${T(`${d.va}r^{${gapN}}=${tn(d.vb)}`)}, so ${T(`r^{${gapN}}=${pow}`)}.`, run: async (c) => { await R1.jumps(c, 1, d.N, T(cr('\\times r'))); await show(c, l1); } }
    ];
    if (!g.two) {
      const r = d.rs[0], s = g.seqOf(r);
      const l2 = P.add(T(`r=${r}:\\quad ${s.map((v, i) => (i > 0 && i < d.N - 1 ? `\\underline{${tn(v)}}` : tn(v))).join(',\\ ')}`));
      steps.push({ cap: `An <b>odd</b> power: one root, ${T(cr(`r=${r}`))}.`, run: async (c) => { R1.relabel(T(rT(r))); R1.rtag.innerHTML = T(cr(`r=${r}`)); await show(c, R1.rtag); } });
      steps.push({ cap: `Multiply: ${T(`4\\times(-5)=-20`)}, ${T('-20\\times(-5)=100')}. Check: ${T('100\\times(-5)=-500')} ✓. The means are ${T('-20')} and ${T('100')}.`,
        run: async (c) => { for (let i = 2; i < d.N; i++) await R1.set(c, i, s[i - 1], 'u1l5-tbmean'); await show(c, l2); } });
      return steps;
    }
    const [ra, rb] = d.rs, sa = g.seqOf(ra), sb = g.seqOf(rb);
    const ul = (s) => s.map((v, i) => (i > 0 && i < d.N - 1 ? `\\underline{${tn(v)}}` : tn(v))).join(',\\ ');
    const l2 = P.add(T(`r=3:\\ \\ ${ul(sa)}\\qquad\\quad r=-3:\\ \\ ${ul(sb)}`));
    steps.push({ cap: `An <b>even</b> power: ${T(cr('r=3'))} or ${T(cr('r=-3'))}. Two answers, two rows.`,
      run: async (c) => {
        R1.relabel(T(rT(ra))); R1.rtag.innerHTML = T(cr(`r=${ra}`)); await show(c, R1.rtag);
        R2.boxes.forEach((b) => b && (b.style.opacity = 1)); R2.tags.forEach((t) => t && (t.style.opacity = 1));
        await Promise.all(R2.boxes.filter(Boolean).map((b) => anim(c, b, [{ transform: 'translateY(-150px)', opacity: 0.3 }, { transform: 'none', opacity: 1 }], 600)));
        R2.rtag.innerHTML = T(cr(`r=${rb}`)); await show(c, R2.rtag); await R2.jumps(c, 1, d.N, T(rT(rb)));
      } });
    steps.push({ cap: `${T('r=3')}: the means are ${T('15,\\ 45,\\ 135')}. Check: ${T('135\\times3=405')} ✓.`, run: async (c) => { for (let i = 2; i < d.N; i++) await R1.set(c, i, sa[i - 1], 'u1l5-tbmean'); } });
    steps.push({ cap: `${T('r=-3')}: the means are ${T('-15,\\ 45,\\ -135')}. Check: ${T('-135\\times(-3)=405')} ✓. Both are answers.`,
      run: async (c) => { for (let i = 2; i < d.N; i++) await R2.set(c, i, sb[i - 1], 'u1l5-tbmean'); await show(c, l2); } });
    return steps;
  }
};

/* ====================================================================================================
 * Example 3 figures: empty grids to plot on, and the answer dots.
 * ==================================================================================================== */
function mountFigures() {
  const F = [
    { id: 'u1l5-ex3a', vals: [64, 32, 16, 8, 4, 2], ymin: 0, ymax: 68, ystep: 8, ylab: 16 },
    { id: 'u1l5-ex3b', vals: [1, -2, 4, -8, 16], ymin: -10, ymax: 18, ystep: 2, ylab: 4 }
  ];
  F.forEach((f) => {
    const host = document.getElementById(f.id); if (!host) return;
    const G = new Graph(host, { width: 330, height: 300, xmin: 0, xmax: f.vals.length + 0.8, ymin: f.ymin, ymax: f.ymax, xstep: 1, ystep: f.ystep, xlabels: 1, ylabels: f.ylab, xtitle: 'n', ytitle: 't_n', fontSize: 15 });
    // the answer dots sit on the same grid and show with the part's answer (.part.shown)
    f.vals.forEach((v, i) => G.point(i + 1, v, { color: v < 0 ? RED : i === 0 ? TC : BLUE, r: 6.5, cls: 'u1l5-adot' }));
  });
}

/* ====================================================================================================
 * Stand Up Break
 * ==================================================================================================== */
const sp = (r) => `(${r})`;
const seqT = (t1, r, k) => Array.from({ length: k }, (_, i) => tn(t1 * r ** i)).join(',\\ ');
standup('u1l5', {
  intro: 'At your whiteboard: find r first, then use the general term.',
  levels: {
    BEG: (R) => { // general term and one term
      const t1 = R.pick([2, 3, 4, 5]), r = R.pick([2, 3, -2, -3]), k = R.int(5, 7), v = t1 * r ** (k - 1);
      return { text: `Write the general term, then find <b>t<sub>${k}</sub></b>.`, q: `${seqT(t1, r, 3)},\\ \\dots`,
        a: [`r=\\dfrac{${tn(t1 * r)}}{${t1}}=${r}`, `t_n=${t1}${sp(r)}^{n-1}`, `t_{${k}}=${t1}${sp(r)}^{${k - 1}}=${t1}(${tn(r ** (k - 1))})=${tn(v)}`] };
    },
    PRG: (R) => { // number of terms
      const t1 = R.pick([2, 3, 5]), r = R.pick([2, 3, -2]), n = R.int(6, 9), last = t1 * r ** (n - 1);
      return { text: 'How many terms are in the sequence?', q: `${seqT(t1, r, 3)},\\ \\dots,\\ ${tn(last)}`,
        a: [`${t1}${sp(r)}^{n-1}=${tn(last)}`, `${sp(r)}^{n-1}=${tn(last / t1)}=${sp(r)}^{${n - 1}}`, `n-1=${n - 1}\\ \\Rightarrow\\ n=${n}\\text{ terms}`] };
    },
    MAS: (R) => { // two terms known
      const t1 = R.pick([2, 3, 4, 5]) * R.sign(), r = R.pick([2, 3, -2, -3]), a = R.pick([2, 3]), gap = R.pick([2, 3]), b = a + gap;
      const ta = t1 * r ** (a - 1), tb = t1 * r ** (b - 1), q = tb / ta;
      const even = gap % 2 === 0, rr = Math.abs(r);
      const lines = [`r^{${gap}}=\\dfrac{${tn(tb)}}{${tn(ta)}}=${tn(q)}`];
      if (!even) lines.push(`r=${r}`, `t_1${sp(r)}^{${a - 1}}=${tn(ta)}\\ \\Rightarrow\\ t_1=${tn(t1)}`, `t_n=${tn(t1)}${sp(r)}^{n-1}`);
      else [rr, -rr].forEach((s) => { const u1 = ta / s ** (a - 1); lines.push(`r=${s}:\\ \\ t_1=${tn(u1)},\\ \\ t_n=${tn(u1)}${sp(s)}^{n-1}`); });
      return { text: even ? 'Find <i>r</i>, <i>t</i><sub>1</sub> and the general term. (Careful: how many answers?)' : 'Find <i>r</i>, <i>t</i><sub>1</sub> and the general term.', q: `t_{${a}}=${tn(ta)},\\qquad t_{${b}}=${tn(tb)}`, a: lines };
    }
  }
});

/* =============================== mount =============================== */
mountFigures();
export const explainers = mountExplainers({ buildPower, notFifteen, barsDots, countTerms, twoTerms, means });
export const _test = { Q, qt, rp, times, targetTex, BP, BD, CT, TT, ME };
