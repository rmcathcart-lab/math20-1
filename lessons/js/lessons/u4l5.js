/* Math 20-1 · Unit 4 · Lesson 5 — Solving Quadratic Equations by Factoring.
 * Warm-up (Mystery Cards: two face-down cards multiply to 0 or to 12; only the 0 tells you a card), and the explainers:
 *   zpp (either–or switches: factor boxes with live values as a probe slides along x; a factor hits 0 → product 0;
 *     "why 0?" pairs for 12 vs 0; Example 1 checks),
 *   pipeline (the five steps lit one at a time beside the working; Example 2 and 3 checks),
 *   lostRoot (dividing by x vs factoring it out, beside graphs of both sides crossing twice; Examples 2(c), 4(c)),
 *   notZero ((x + 2)(x − 5) = 8: "each factor = 8" fails, the right side must be 0; Example 4(a), 4(b) checks),
 *   rootsGraph (STAR: y = (x − r1)(x − r2) with draggable roots; the parabola's x-intercepts follow and the equation
 *     rewrites in factored and standard form, with integer coefficients for fractional roots; double root touches;
 *     Example 5, 3(c), 6(b) checks and free play),
 *   fromRoots (root → factor → multiply in a grid → standard form; Example 6 checks),
 *   admissible (to-scale garden and frame, consecutive odd integers on a number line; reject the impossible root;
 *     Example 7(a), 8(a), 8(b)),
 *   ball (the height parabola meets the ground and the 40 m line; t = −1 rejected; Example 9).
 * Colours: first factor / root blue, second factor / root amber, zero / admissible green, rejected red, roots rose. */
import {
  h, tex, add, box, Graph, NumberLine, stamp, stampIn, checkCard, mountExplainers, pop, fadeIn, appear, sleep, tween,
  svgEl, liveCtx, pulse, place, anim, shake, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const F1 = COLORS.blue, F2 = COLORS.amber, OK = COLORS.green, NO = COLORS.red, RT = COLORS.teal, BR = COLORS.brand, INK = COLORS.ink, GRAY = COLORS.gray;
const tc = (c, s) => `\\textcolor{${c}}{${s}}`;
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
const panel = (stage, x, y, w, hh, title, cls = '') => div(stage, 'u4l5-panel ' + cls, title ? `<div class="u4l5-ph">${title}</div>` : '', x, y, w, hh);
const lineIn = (p, html, cls = '') => { const d = h('div', 'u4l5-line ' + cls, html); p.appendChild(d); hide(d); return d; };
const CHK = '\\ \\checkmark';

/* ---------------- exact numbers ---------------- */
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
/** v → [p, q] with q > 0 (small denominators) */
function rat(v) { for (let q = 1; q <= 60; q++) { const p = v * q; if (Math.abs(p - Math.round(p)) < 1e-7) return [Math.round(p), q]; } return [v, 1]; }
/** a number in TeX: integer, or \tfrac */
const frT = (v) => { const [p, q] = rat(v); return q === 1 ? String(p) : `${p < 0 ? '-' : ''}\\tfrac{${Math.abs(p)}}{${q}}`; };
/** a polynomial from its coefficients (highest power first), fractions allowed */
function polyTex(cs, v = 'x') {
  const deg = cs.length - 1; let s = '';
  cs.forEach((c, i) => {
    const pw = deg - i; if (Math.abs(c) < 1e-12) return;
    const a = Math.abs(c), body = pw === 0 ? frT(a) : (Math.abs(a - 1) < 1e-12 ? '' : frT(a)) + v + (pw > 1 ? '^' + pw : '');
    s += (c < 0 ? '-' : s ? '+' : '') + body;
  });
  return s || '0';
}
/** the factor with integer coefficients that is 0 at x = r: 5 → x − 5, −1/2 → 2x + 1, 0 → x */
function facInt(r, v = 'x') { const [p, q] = rat(r); if (p === 0) return v; return `${q === 1 ? '' : q}${v}${p > 0 ? '-' : '+'}${Math.abs(p)}`; }
/** the monic factor: x − r */
const facMon = (r, v = 'x') => (Math.abs(r) < 1e-12 ? v : `${v}${r > 0 ? '-' : '+'}${frT(Math.abs(r))}`);
/** integer coefficients [q, −p] of the factor for root r */
const facCo = (r) => { const [p, q] = rat(r); return [q, -p]; };
/** a product of two factors in TeX (a bare x goes first, a repeated factor is squared) */
function prodTex(a, b, ca = null, cb = null) {
  const wrap = (f, c) => { const s = f === 'x' ? 'x' : `(${f})`; return c ? tc(c, s) : s; };
  if (a === b) return (ca ? tc(ca, `(${a})^2`) : `(${a})^2`);
  if (b === 'x') return wrap(b, cb) + wrap(a, ca);
  return wrap(a, ca) + wrap(b, cb);
}

/* ====================================================================================================
 * Warm-up: Mystery Cards — pair A multiplies to 0, pair B to 12; flip them, deal again.
 * ==================================================================================================== */
const POOL0 = [[0, 7], [-3, 0], [0, 0], [0, -5], [9, 0], [0, 0.5], [-8, 0]];
const POOL12 = [[3, 4], [2, 6], [-1, -12], [0.5, 24], [-4, -3], [1, 12], [-2, -6], [1.5, 8], [6, 2]];
const cardTxt = (v) => (v === 0.5 ? '½' : v === 1.5 ? '1.5' : String(v).replace('-', '−'));
function mountCards() {
  const host = document.getElementById('u4l5-table'); if (!host) return;
  host.innerHTML = '';
  const mkPair = (name, prod, x) => {
    const g = div(host, 'u4l5-pair', '', x, 18, 250, 300);
    div(g, 'u4l5-pname', `Pair ${name}`, 0, 0, 250);
    const cards = [0, 1].map((k) => {
      const c = div(g, 'u4l5-card', '<div class="u4l5-cin"><div class="u4l5-cback"><span>?</span></div><div class="u4l5-cface"></div></div>', 8 + k * 132, 40, 102, 142);
      c.setAttribute('data-tap', ''); return c;
    });
    div(g, 'u4l5-ctimes', '×', 110, 92, 30);
    div(g, 'u4l5-csign', `<span class="u4l5-cs-eq">product</span> = <b>${prod}</b>`, 0, 202, 250);
    return { g, cards, up: false, i: 0 };
  };
  const A = mkPair('A', 0, 18), B = mkPair('B', 12, 290);
  const paint = (P, pool) => { const pr = pool[P.i % pool.length]; P.cards.forEach((c, k) => { c.querySelector('.u4l5-cface').textContent = cardTxt(pr[k]); c.classList.toggle('u4l5-up', P.up); c.classList.toggle('u4l5-zero', P.up && pr[k] === 0); }); };
  const flip = (P, pool) => { P.up = !P.up; paint(P, pool); };
  A.cards.forEach((c) => c.addEventListener('click', () => flip(A, POOL0)));
  B.cards.forEach((c) => c.addEventListener('click', () => flip(B, POOL12)));
  document.getElementById('u4l5-flipA').addEventListener('click', () => flip(A, POOL0));
  document.getElementById('u4l5-flipB').addEventListener('click', () => flip(B, POOL12));
  document.getElementById('u4l5-deal').addEventListener('click', () => {
    [[A, POOL0], [B, POOL12]].forEach(([P, pool]) => { P.up = false; paint(P, pool); });
    setTimeout(() => { A.i++; B.i++; [[A, POOL0], [B, POOL12]].forEach(([P, pool]) => { P.up = true; paint(P, pool); }); }, 420);
  });
  paint(A, POOL0); paint(B, POOL12);
}

/* =============================== explainer: the zero product property =============================== */
const ZP = {
  why: { label: 'Why must it be 0?', ask: 'Two numbers multiply to 12. Two numbers multiply to 0. What can you say about them?' },
  e1a: { label: 'Example 1(a) check', ask: 'Example 1(a): solve (x + 6)(x − 4) = 0.', min: -8, max: 8, x0: 1,
    fs: [{ t: 'x+6', f: (x) => x + 6, r: -6, sol: ['x+6=0', 'x=-6'] }, { t: 'x-4', f: (x) => x - 4, r: 4, sol: ['x-4=0', 'x=4'] }] },
  e1b: { label: 'Example 1(b) check', ask: 'Example 1(b): solve 4x(x − 9) = 0.', min: -3, max: 11, x0: 3,
    fs: [{ t: '4x', f: (x) => 4 * x, r: 0, sol: ['4x=0', 'x=0'], bare: true }, { t: 'x-9', f: (x) => x - 9, r: 9, sol: ['x-9=0', 'x=9'] }] },
  e1c: { label: 'Example 1(c) check', ask: 'Example 1(c): solve (2x − 7)(3x + 4) = 0.', min: -3, max: 5, x0: 1,
    fs: [{ t: '2x-7', f: (x) => 2 * x - 7, r: 7 / 2, sol: ['2x-7=0', '2x=7', 'x=\\tfrac{7}{2}'] }, { t: '3x+4', f: (x) => 3 * x + 4, r: -4 / 3, sol: ['3x+4=0', '3x=-4', 'x=-\\tfrac{4}{3}'] }] },
  e1d: { label: 'Example 1(d) check', ask: 'Example 1(d): solve −5(x + 1)(x − 8) = 0.', min: -3, max: 10, x0: 3, k: -5,
    fs: [{ t: 'x+1', f: (x) => x + 1, r: -1, sol: ['x+1=0', 'x=-1'] }, { t: 'x-8', f: (x) => x - 8, r: 8, sol: ['x-8=0', 'x=8'] }] }
};
const zpp = {
  title: 'Zero product: either–or switches',
  height: 430, minW: 920,
  choices: Object.keys(ZP).map((k) => ({ v: k, label: ZP[k].label })),
  ask: (v) => ZP[v].ask,
  make(stage, v, ex) {
    if (v === 'why') return zppWhy(stage, ex);
    const d = ZP[v], W = ex.W, cols = [F1, F2];
    const facs = d.fs.map((f, i) => Object.assign({ col: cols[i] }, f));
    const eqT = (d.k ? String(d.k) : '') + facs.map((f) => (f.bare ? tc(f.col, f.t) : tc(f.col, `(${f.t})`))).join('') + '=0';
    const eq = div(stage, 'u4l5-zeq', T(eqT), 0, 6, W);
    // boxes: [constant] factor × factor = product
    const BW = 200, BH = 112, XW = 40, PW = 170, items = (d.k ? 1 : 0) + facs.length;
    const total = items * BW + (items - 1) * XW + XW + PW; let x = Math.round((W - total) / 2);
    const Y = 76, boxes = [];
    let kBox = null;
    const mkBox = (html, cls) => { const b = div(stage, 'u4l5-zbox ' + cls, html, x, Y, BW, BH); x += BW; return b; };
    const times = () => { div(stage, 'u4l5-zop', '×', x, Y + 30, XW); x += XW; };
    if (d.k) { kBox = mkBox(`<div class="u4l5-zt">${T(String(d.k))}</div><div class="u4l5-zv">${T('=' + d.k)}</div>`, 'u4l5-zk'); times(); }
    facs.forEach((f, i) => { const b = mkBox(`<div class="u4l5-zt">${T(tc(f.col, f.t))}</div><div class="u4l5-zv"></div>`, ''); b.style.borderColor = f.col; boxes.push(b); if (i < facs.length - 1) times(); });
    div(stage, 'u4l5-zop', '=', x, Y + 30, XW); x += XW;
    const pBox = div(stage, 'u4l5-zbox u4l5-zprod', '<div class="u4l5-zt">product</div><div class="u4l5-zv"></div>', x, Y, PW, BH);
    const kTag = d.k ? hide(div(kBox, 'u4l5-ztag', 'never 0', 0, BH + 6, BW)) : null;
    // solving lines under each factor box
    const sols = facs.map((f, i) => { const s = hide(div(stage, 'u4l5-zsol', f.sol.map((l, j) => `<div>${T(j === f.sol.length - 1 ? tc(f.col, l) : l)}</div>`).join(''), parseFloat(boxes[i].style.left), Y + BH + 12, BW)); return s; });
    // number line with a probe
    const NLY = 268, N = new NumberLine(stage, { x: 14, y: NLY, width: W - 28, height: 112, min: d.min, max: d.max, step: 1, axisY: 54, fontSize: 18 });
    const probe = div(stage, 'u4l5-probe', '', 0, 0); probe.innerHTML = '<div class="u4l5-pbub"></div><div class="u4l5-pstem"></div>';
    const bub = probe.querySelector('.u4l5-pbub');
    const st = { x: d.x0 };
    const val = (xx) => facs.reduce((p, f) => p * f.f(xx), d.k || 1);
    const setProbe = (xx, exact) => {
      st.x = xx; const px = 14 + N.toPx(xx); probe.style.left = px + 'px'; probe.style.top = (NLY + 54) + 'px';
      bub.innerHTML = T('x=' + (exact ? frT(xx) : (Math.round(xx * 10) / 10).toString()));
      facs.forEach((f, i) => {
        const fv = f.f(xx), z = exact && Math.abs(fv) < 1e-9;
        boxes[i].querySelector('.u4l5-zv').innerHTML = exact ? T('=' + frT(fv)) : '…';
        boxes[i].classList.toggle('u4l5-zon', z);
      });
      const pv = val(xx), pz = exact && Math.abs(pv) < 1e-9;
      pBox.querySelector('.u4l5-zv').innerHTML = exact ? T(frT(pv)) : '…';
      pBox.classList.toggle('u4l5-zon', pz);
    };
    hide(probe); setProbe(d.x0, true);
    const moveTo = async (c, x1) => { const x0 = st.x; await tween(c, 900, (t) => setProbe(x0 + (x1 - x0) * t, t >= 1)); setProbe(x1, true); };
    const marks = facs.map((f) => { const m = N.point(f.r, { color: OK, label: T(tc(OK, frT(f.r))), r: 9 }); hide(m); hide(m.label); return m; });
    const prodAt = (xx) => `${d.k ? `(${d.k})` : ''}${facs.map((f) => `(${frT(f.f(xx))})`).join('')}=${frT(val(xx))}`;
    const ansT = `x=${frT(facs[0].r)}\\ \\text{or}\\ x=${frT(facs[1].r)}`;
    const steps = [
      { cap: `${['', '', 'Two', 'Three'][facs.length + (d.k ? 1 : 0)]} factors multiply to give <b>0</b>. Slide ${T('x')} along and watch each factor’s value.`, run: async (c) => { await show(c, probe); await pulse(c, eq, 1.05); } },
      { cap: `Try ${T('x=' + d.x0)}: ${T(prodAt(d.x0))}. Not 0.`, run: (c) => pulse(c, pBox, 1.08) }
    ];
    if (d.k) steps.push({ cap: `${T(String(d.k))} is a constant: it is <b>never 0</b>, so it gives no root. The roots must come from the other factors.`, run: async (c) => { await show(c, kTag); await shake(c, kBox); } });
    facs.forEach((f, i) => steps.push({
      cap: `${T('x=' + frT(f.r))} makes ${T(tc(f.col, f.t) + '=0')}, so the product is <b>0</b>, ${i ? 'again' : 'whatever the other factor is'}. ✓`,
      run: async (c) => { await moveTo(c, f.r); await pop(c, boxes[i], 360); marks[i].style.opacity = 1; await Promise.all([pop(c, marks[i], 360), show(c, marks[i].label)]); }
    }));
    steps.push({ cap: `So set <b>each factor with a variable equal to 0</b> and solve: ${T(ansT)}.`,
      run: async (c) => { await anim(c, probe, [{ opacity: 1 }, { opacity: 0 }], 300); for (const s of sols) await show(c, s); eq.innerHTML = T(eqT + '\\quad\\Rightarrow\\quad ' + tc(RT, ansT)); await pop(c, eq, 380); } });
    return steps;
  }
};
function zppWhy(stage, ex) {
  const W = ex.W, BW = 170, BH = 120, Y = 70, x0 = Math.round((W - (2 * BW + 40 + 40 + 170)) / 2);
  const bA = div(stage, 'u4l5-zbox', '<div class="u4l5-zt">' + T(tc(F1, 'a')) + '</div><div class="u4l5-zv u4l5-zbig">?</div>', x0, Y, BW, BH); bA.style.borderColor = F1;
  div(stage, 'u4l5-zop', '×', x0 + BW, Y + 34, 40);
  const bB = div(stage, 'u4l5-zbox', '<div class="u4l5-zt">' + T(tc(F2, 'b')) + '</div><div class="u4l5-zv u4l5-zbig">?</div>', x0 + BW + 40, Y, BW, BH); bB.style.borderColor = F2;
  div(stage, 'u4l5-zop', '=', x0 + 2 * BW + 40, Y + 34, 40);
  const bP = div(stage, 'u4l5-zbox u4l5-zprod', '<div class="u4l5-zt">product</div><div class="u4l5-zv u4l5-zbig">12</div>', x0 + 2 * BW + 80, Y, 170, BH);
  const vA = bA.querySelector('.u4l5-zv'), vB = bB.querySelector('.u4l5-zv'), vP = bP.querySelector('.u4l5-zv');
  const tray = div(stage, 'u4l5-tray', '', 20, 222, W - 40, 60);
  const tray0 = div(stage, 'u4l5-tray', '', 20, 290, W - 40, 60);
  const key = hide(div(stage, 'u4l5-keybox', `<b>Zero product property:</b> if ${T('ab=0')}, then ${T('a=0')} or ${T('b=0')}.`, W / 2, 366)); key.style.translate = '-50% 0';
  const P12 = [[3, 4], [2, 6], [-1, -12], [0.5, 24], [-4, -3]], P0 = [[0, 7], [-3, 0], [0, 0], [0, -5]];
  const chip = (host, a, b, zero) => { const nb = b < 0 ? `(${frT(b)})` : frT(b), s = h('span', 'u4l5-pchip' + (zero ? ' u4l5-pchip0' : ''), T(`${zero && a === 0 ? tc(OK, '0') : frT(a)}\\times${zero && b === 0 ? tc(OK, '0') : nb}`)); host.appendChild(s); hide(s); return s; };
  const setPair = (a, b) => { vA.innerHTML = T(a === 0 ? tc(OK, '0') : frT(a)); vB.innerHTML = T(b === 0 ? tc(OK, '0') : frT(b)); bA.classList.toggle('u4l5-zon', a === 0); bB.classList.toggle('u4l5-zon', b === 0); };
  const c12 = P12.map(([a, b]) => chip(tray, a, b, false)), c0 = P0.map(([a, b]) => chip(tray0, a, b, true));
  const lab12 = hide(div(tray, 'u4l5-trayl', 'product 12:', 0, 0)), lab0 = hide(div(tray0, 'u4l5-trayl', 'product 0:', 0, 0));
  lab12.style.position = lab0.style.position = 'static'; tray.prepend(lab12); tray0.prepend(lab0);
  const run = async (c, pairs, chips) => { for (let i = 0; i < pairs.length; i++) { setPair(...pairs[i]); await Promise.all([pop(c, bA, 300), pop(c, bB, 300), show(c, chips[i])]); await sleep(c, 260); } };
  return [
    { cap: `${T('ab=12')}. What are ${T('a')} and ${T('b')}?`, run: (c) => pulse(c, bP, 1.08) },
    { cap: `${T('3\\times4')}? ${T('2\\times6')}? ${T('(-1)(-12)')}? ${T('\\tfrac12\\times24')}? <b>Endless</b> pairs: we can’t name either number.`, run: async (c) => { await show(c, lab12); await run(c, P12, c12); } },
    { cap: `Now ${T('ab=0')}. Every pair that works has a <b>0</b> in it: one of the numbers <b>must</b> be 0.`, run: async (c) => { vP.innerHTML = T(tc(OK, '0')); bP.classList.add('u4l5-zon'); await pop(c, bP, 360); await show(c, lab0); await run(c, P0, c0); } },
    { cap: `That’s the <b>zero product property</b>. It only works with <b>0</b> on one side.`, run: (c) => show(c, key) }
  ];
}

/* =============================== explainer: the five steps =============================== */
const STEPN = ['One side = 0', 'Common factor / LCD', 'Factor fully', 'Each factor = 0', 'Check'];
const PL = {
  e2a: { label: 'Example 2(a)', q: 'x² + 3x − 28 = 0', eq: 'x^2+3x-28=0', s: [
    { n: 'The right side is already 0.', cap: 'The right side is already <b>0</b>: nothing to move.' },
    { n: 'No common factor.', cap: 'No common factor, no fractions.' },
    { l: ['(x+7)(x-4)=0'], n: `product ${T('-28')}, sum ${T('3')}: ${T('7')} and ${T('-4')}`, cap: `Product ${T('-28')}, sum ${T('3')}: ${T('7')} and ${T('-4')}. ${T('(x+7)(x-4)=0')}.` },
    { l: ['x+7=0\\ \\text{or}\\ x-4=0', 'x=-7\\ \\text{or}\\ x=4'], cap: `${T('x+7=0')} or ${T('x-4=0')}: ${T('x=-7')} or ${T('x=4')}.` },
    { l: ['x=4:\\ 16+12-28=0' + CHK, 'x=-7:\\ 49-21-28=0' + CHK], cap: 'Check both in the original equation: both give 0. ✓' }] },
  e2b: { label: 'Example 2(b)', q: '16x² − 25 = 0', eq: '16x^2-25=0', s: [
    { n: 'Already 0 on the right.', cap: 'Already <b>0</b> on the right.' },
    { n: 'No common factor.', cap: '16 and 25 have no common factor.' },
    { l: ['(4x-5)(4x+5)=0'], n: `difference of squares: ${T('(4x)^2-5^2')}`, cap: `A <b>difference of squares</b>: ${T('(4x)^2-5^2=(4x-5)(4x+5)')}.` },
    { l: ['4x-5=0\\ \\text{or}\\ 4x+5=0', 'x=\\tfrac{5}{4}\\ \\text{or}\\ x=-\\tfrac{5}{4}\\quad\\left(x=\\pm\\tfrac{5}{4}\\right)'], cap: `${T('x=\\tfrac54')} or ${T('x=-\\tfrac54')}, written ${T('x=\\pm\\tfrac54')}.` },
    { l: ['x=\\tfrac54:\\ 16\\left(\\tfrac{25}{16}\\right)-25=0' + CHK], cap: `Check: ${T('16\\left(\\tfrac{25}{16}\\right)-25=25-25=0')} ✓ (and the same for ${T('-\\tfrac54')}).` }] },
  e2d: { label: 'Example 2(d)', q: '3x² − 48 = 0', eq: '3x^2-48=0', s: [
    { n: 'Already 0 on the right.', cap: 'Already <b>0</b> on the right.' },
    { l: ['3(x^2-16)=0'], cap: `Common factor ${T('3')}: ${T('3(x^2-16)=0')}.` },
    { l: ['3(x-4)(x+4)=0'], cap: `${T('x^2-16')} is a difference of squares: ${T('3(x-4)(x+4)=0')}.` },
    { l: ['3\\ne0', 'x=4\\ \\text{or}\\ x=-4\\quad(x=\\pm4)'], cap: `${T('3\\ne0')}, so ${T('x-4=0')} or ${T('x+4=0')}: ${T('x=\\pm4')}.` },
    { l: ['x=\\pm4:\\ 3(16)-48=0' + CHK], cap: `Check: ${T('3(16)-48=0')} ✓ for both, since ${T('(-4)^2=4^2')}.` }] },
  e3a: { label: 'Example 3(a)', q: '4x² − 4x − 15 = 0', eq: '4x^2-4x-15=0', s: [
    { n: 'Already 0 on the right.', cap: 'Already <b>0</b> on the right.' },
    { n: 'No common factor.', cap: '4, −4 and −15 have no common factor.' },
    { l: ['4x^2-10x+6x-15=0', '2x(2x-5)+3(2x-5)=0', '(2x-5)(2x+3)=0'], n: `${T('ac=-60')}, sum ${T('-4')}: ${T('-10')} and ${T('6')}`, cap: `Decomposition: ${T('ac=-60')}, sum ${T('-4')}: ${T('-10')} and ${T('6')}. Group: ${T('(2x-5)(2x+3)=0')}.` },
    { l: ['x=\\tfrac{5}{2}\\ \\text{or}\\ x=-\\tfrac{3}{2}'], cap: `${T('2x-5=0')} or ${T('2x+3=0')}: ${T('x=\\tfrac52')} or ${T('x=-\\tfrac32')}.` },
    { l: ['x=\\tfrac52:\\ 4\\left(\\tfrac{25}{4}\\right)-10-15=0' + CHK], cap: `Check ${T('x=\\tfrac52')}: ${T('25-10-15=0')} ✓` }] },
  e3b: { label: 'Example 3(b)', q: '−2x² + 10x = 12', eq: '-2x^2+10x=12', s: [
    { l: ['-2x^2+10x-12=0'], cap: `Subtract 12 from both sides: ${T('-2x^2+10x-12=0')}.` },
    { l: ['x^2-5x+6=0'], n: `divide by ${T('-2')}`, cap: `Divide both sides by the common factor ${T('-2')} (a constant, so that’s safe): ${T('x^2-5x+6=0')}.` },
    { l: ['(x-2)(x-3)=0'], cap: `Product 6, sum −5: ${T('(x-2)(x-3)=0')}.` },
    { l: ['x=2\\ \\text{or}\\ x=3'], cap: `${T('x=2')} or ${T('x=3')}.` },
    { l: ['x=2:\\ -8+20=12' + CHK, 'x=3:\\ -18+30=12' + CHK], cap: 'Check in the <b>original</b>: both give 12. ✓' }] },
  e3d: { label: 'Example 3(d)', q: '¼x² − x − 3 = 0', eq: '\\tfrac{1}{4}x^2-x-3=0', s: [
    { n: 'Already 0 on the right.', cap: 'Already <b>0</b> on the right.' },
    { l: ['x^2-4x-12=0'], n: 'multiply by 4 (the LCD)', cap: `Clear the fraction: multiply every term by the LCD, 4. (${T('4\\times0=0')}.)` },
    { l: ['(x-6)(x+2)=0'], cap: `Product −12, sum −4: ${T('(x-6)(x+2)=0')}.` },
    { l: ['x=6\\ \\text{or}\\ x=-2'], cap: `${T('x=6')} or ${T('x=-2')}.` },
    { l: ['x=6:\\ \\tfrac{36}{4}-6-3=0' + CHK], cap: `Check ${T('x=6')}: ${T('9-6-3=0')} ✓` }] }
};
const pipeline = {
  title: 'Solving by factoring, step by step',
  height: 410, minW: 920,
  choices: Object.keys(PL).map((k) => ({ v: k, label: PL[k].label + ' check' })),
  ask: (v) => `${PL[v].label}: solve ${PL[v].q}.`,
  make(stage, v, ex) {
    const d = PL[v], W = ex.W, PX = 14, PW = 286;
    const pills = STEPN.map((s, i) => div(stage, 'u4l5-spill', `<span class="u4l5-stn">${i + 1}</span>${s}`, PX, 12 + i * 76, PW, 62));
    const P = panel(stage, PX + PW + 18, 8, W - PX - PW - 32, 394, '', 'u4l5-work');
    const head = h('div', 'u4l5-wline u4l5-whead', T(d.eq)); P.appendChild(head);
    const groups = d.s.map((s, i) => {
      const els = [];
      if (s.n) els.push(lineIn(P, `<span class="u4l5-wb">${i + 1}</span><span class="u4l5-wnote">${s.n}</span>`, 'u4l5-wline'));
      (s.l || []).forEach((l, j) => els.push(lineIn(P, `<span class="u4l5-wb ${s.n || j ? 'u4l5-wb0' : ''}">${i + 1}</span>${T(i === 3 && j === s.l.length - 1 ? tc(RT, l) : l)}`, 'u4l5-wline' + (i === 4 ? ' u4l5-wcheck' : ''))));
      return els;
    });
    const light = async (c, i) => {
      pills.forEach((p, k) => { p.classList.toggle('u4l5-on', k === i); p.classList.toggle('u4l5-done', k < i); });
      await pop(c, pills[i], 320);
      for (const e of groups[i]) await show(c, e);
    };
    return d.s.map((s, i) => ({ cap: `<b>${i + 1}. ${STEPN[i]}.</b> ${s.cap}`, run: async (c) => { await light(c, i); if (i === 4) pills[4].classList.add('u4l5-done'); } }));
  }
};

/* =============================== explainer: never divide by x =============================== */
const LR = {
  e2c: { label: 'Example 2(c) check', ask: 'Example 2(c): solve 6x² = 21x.', eq: '6x^2=21x', by: 'x',
    L: (x) => 6 * x * x, R: (x) => 21 * x, lt: 'y=6x^2', rt: 'y=21x',
    win: { xmin: -1, xmax: 4.5, ymin: -12, ymax: 90, xstep: 1, ystep: 10, xlabels: 1, ylabels: 20 }, roots: [0, 3.5], lost: 0,
    A: ['\\div x\\text{ on both sides}', '6x=21', 'x=\\tfrac{7}{2}'], B: ['6x^2-21x=0', '3x(2x-7)=0', 'x=0\\ \\text{or}\\ x=\\tfrac{7}{2}'],
    chk: `x=0:\\quad 6(0)^2=0\\ \\text{and}\\ 21(0)=0` + CHK, capB: `Move everything to one side and <b>factor out</b> ${T('3x')}: ${T('3x(2x-7)=0')}, so ${T('x=0')} or ${T('x=\\tfrac72')}.` },
  e4c: { label: 'Example 4(c) check', ask: 'Example 4(c): solve (x − 4)(x + 1) = 2(x − 4).', eq: '(x-4)(x+1)=2(x-4)', by: '(x-4)',
    L: (x) => (x - 4) * (x + 1), R: (x) => 2 * (x - 4), lt: 'y=(x-4)(x+1)', rt: 'y=2(x-4)',
    win: { xmin: -2, xmax: 6, ymin: -10, ymax: 10, xstep: 1, ystep: 2, xlabels: 1, ylabels: 4 }, roots: [1, 4], lost: 4,
    A: ['\\div(x-4)\\text{ on both sides}', 'x+1=2', 'x=1'], B: ['x^2-3x-4-2x+8=0', 'x^2-5x+4=0', '(x-1)(x-4)=0', 'x=1\\ \\text{or}\\ x=4'],
    chk: `x=4:\\quad (0)(5)=0\\ \\text{and}\\ 2(0)=0` + CHK, capB: `Expand, move everything to one side, factor: ${T('(x-1)(x-4)=0')}, so ${T('x=1')} or ${T('x=4')}.` }
};
const lostRoot = {
  title: 'Dividing by x loses a root',
  height: 440, minW: 960,
  choices: Object.keys(LR).map((k) => ({ v: k, label: LR[k].label })),
  ask: (v) => LR[v].ask,
  make(stage, v, ex) {
    const d = LR[v], W = ex.W, GW = Math.max(360, W - 620), GX = W - GW - 6, LW = GX - 24;
    const eq = div(stage, 'u4l5-leq', T(d.eq), 14, 6, LW);
    const pw = Math.floor((LW - 12) / 2);
    const PA = panel(stage, 14, 60, pw, 260, `✗ Divide by ${T(d.by)}`, 'u4l5-pa');
    const PB = panel(stage, 14 + pw + 12, 60, pw, 260, '✓ Factor it out', 'u4l5-pb');
    const A = d.A.map((l, i) => lineIn(PA, T(i === d.A.length - 1 ? tc(NO, l) : l))), B = d.B.map((l, i) => lineIn(PB, T(i === d.B.length - 1 ? tc(OK, l) : l)));
    const sA = hide(stamp(stage, 'only 1 root?', { ok: false, x: 14 + pw / 2 + 40, y: 290, size: 'sm' })), sB = hide(stamp(stage, '2 roots ✓', { ok: true, x: 14 + pw + 12 + pw / 2 + 40, y: 290, size: 'sm' }));
    const ck = hide(div(stage, 'u4l5-lchk', T(d.chk) + `<div class="u4l5-lnote">${T(d.by)} can be 0. Dividing by it divides by 0, and that root is lost. <b>Factor it out instead.</b></div>`, 14, 330, LW, 100));
    const G = new Graph(stage, Object.assign({ x: GX, y: 4, width: GW, height: 432, fontSize: 15, pad: [30, 18, 18, 18] }, d.win));
    const cl = hide(G.fn(d.L, { color: F1, width: 3 })), cr = hide(G.fn(d.R, { color: F2, width: 3 }));
    const ll = hide(G.label(d.win.xmin + 0.15, d.win.ymax * 0.93, T(tc(F1, d.lt)), { pos: 'e', cls: 'u4l5-glab' })), lr = hide(G.label(d.win.xmin + 0.15, d.win.ymax * 0.78, T(tc(F2, d.rt)), { pos: 'e', cls: 'u4l5-glab' }));
    const pts = d.roots.map((r) => { const p = G.point(r, d.L(r), { color: r === d.lost ? NO : OK, r: 8, label: T('x=' + frT(r)), pos: r === d.lost ? 'se' : 'nw' }); hide(p); hide(p.label); return p; });
    const ptIn = async (c, p) => { p.style.opacity = 1; await Promise.all([pop(c, p, 360), show(c, p.label)]); };
    return [
      { cap: `Solve ${T(d.eq)}. Graph each side: the solutions are where the two graphs <b>cross</b>.`, run: async (c) => { cl.style.opacity = 1; cr.style.opacity = 1; await Promise.all([G.drawIn(cl, 800, c), G.drawIn(cr, 800, c)]); await Promise.all([show(c, ll), show(c, lr)]); } },
      { cap: `They cross <b>twice</b>: at ${T('x=' + frT(d.roots[0]))} and ${T('x=' + frT(d.roots[1]))}. Two solutions.`, run: async (c) => { await ptIn(c, pts[0]); await ptIn(c, pts[1]); } },
      { cap: `Tempting: divide both sides by ${T(d.by)}. That leaves ${T(d.A[d.A.length - 2])}, so ${T(d.A[d.A.length - 1])}.`, run: async (c) => { for (const e of A) await show(c, e); } },
      { cap: `Only <b>one</b> answer. Where did ${T('x=' + frT(d.lost))} go?`, run: async (c) => { await stampIn(c, sA); const p = pts[d.roots.indexOf(d.lost)]; await pulse(c, p.label, 1.3); } },
      { cap: d.capB, run: async (c) => { for (const e of B) await show(c, e); await stampIn(c, sB); } },
      { cap: `Check ${T('x=' + frT(d.lost))} in the original: both sides are 0 ✓. It <b>is</b> a root. Never divide by ${T(d.by)}: factor it out.`, run: (c) => show(c, ck) }
    ];
  }
};

/* =============================== explainer: the right side must be 0 =============================== */
const notZero = {
  title: 'Get 0 on one side first',
  height: 440, minW: 960,
  choices: [{ v: 'e4a', label: 'Example 4(a) check' }, { v: 'e4b', label: 'Example 4(b) check' }],
  ask: (v) => (v === 'e4a' ? 'Example 4(a): solve (x + 2)(x − 5) = 8.' : 'Example 4(b): solve 2x(x + 3) = (x + 1)² + 11.'),
  make(stage, v, ex) { return v === 'e4a' ? nz4a(stage, ex) : nz4b(stage, ex); }
};
function nz4a(stage, ex) {
  const W = ex.W, CW = Math.floor((W - 56) / 3);
  div(stage, 'u4l5-leq', T(`${tc(F1, '(x+2)')}${tc(F2, '(x-5)')}=8`), 14, 4, W - 28);
  const PA = panel(stage, 14, 58, CW, 376, '✗ Set each factor = 8', 'u4l5-pa');
  const PM = panel(stage, 14 + CW + 14, 58, CW, 376, 'Why it fails', 'u4l5-pm');
  const PB = panel(stage, 14 + 2 * (CW + 14), 58, CW, 376, '✓ Make one side 0', 'u4l5-pb');
  const A = [lineIn(PA, T(`${tc(F1, 'x+2')}=8\\ \\Rightarrow\\ x=6`)), lineIn(PA, T(`${tc(F2, 'x-5')}=8\\ \\Rightarrow\\ x=13`))];
  const Ack = [lineIn(PA, T(`x=6:\\ (8)(1)=8` + CHK) + ' <span class="u4l5-lucky">lucky!</span>', 'u4l5-wsm'), lineIn(PA, T(`x=13:\\ (15)(8)=${tc(NO, '120\\ne8')}`) + ' ✗', 'u4l5-wsm')];
  const miss = lineIn(PA, `It also <b>misses</b> a root: ${T(`x=-3:\\ (-1)(-8)=8` + CHK)}`, 'u4l5-wsm u4l5-miss');
  const why = lineIn(PM, 'Lots of pairs multiply to <b>8</b>:', 'u4l5-wsm');
  const chips = h('div', 'u4l5-chips8'); PM.appendChild(chips);
  const pairs = ['8\\times1', '1\\times8', '4\\times2', '2\\times4', '(-1)(-8)', '(-2)(-4)', '\\tfrac12\\times16', '16\\times\\tfrac12'];
  const pc = pairs.map((p) => { const s = h('span', 'u4l5-pchip', T(p)); chips.appendChild(s); hide(s); return s; });
  const why2 = lineIn(PM, `Knowing the product is 8 tells you nothing about either factor. Only <b>0</b> forces a factor to be 0.`, 'u4l5-wsm');
  const B = ['x^2-3x-10=8', 'x^2-3x-18=0', '(x-6)(x+3)=0', tc(OK, 'x=6\\ \\text{or}\\ x=-3')].map((l) => lineIn(PB, T(l)));
  const sA = hide(stamp(stage, '✗', { ok: false, x: 14 + CW - 40, y: 92 })), sB = hide(stamp(stage, '✓', { ok: true, x: W - 54, y: 92 }));
  return [
    { cap: `Tempting: set each factor equal to 8. That gives ${T('x=6')} and ${T('x=13')}.`, run: async (c) => { for (const e of A) await show(c, e); } },
    { cap: `Check them. ${T('x=6')} works, but only by luck (${T('8\\times1=8')}). ${T('x=13')} gives ${T('15\\times8=120')} ✗.`, run: async (c) => { for (const e of Ack) await show(c, e); await stampIn(c, sA); } },
    { cap: `And it misses ${T('x=-3')}: ${T('(-1)(-8)=8')} ✓.`, run: (c) => show(c, miss) },
    { cap: `Why? Many pairs multiply to 8: ${T('8\\times1')}, ${T('2\\times4')}, ${T('(-1)(-8)')}, ${T('\\tfrac12\\times16')}, … The zero product property needs <b>0</b>.`, run: async (c) => { await show(c, why); for (const s of pc) { s.style.opacity = 1; await pop(c, s, 200); } await show(c, why2); } },
    { cap: `The right way: expand, then subtract 8 so the right side is 0: ${T('x^2-3x-18=0')}.`, run: async (c) => { await show(c, B[0]); await show(c, B[1]); } },
    { cap: `Factor: ${T('(x-6)(x+3)=0')}, so ${T('x=6')} or ${T('x=-3')}.`, run: async (c) => { await show(c, B[2]); await show(c, B[3]); await stampIn(c, sB); } }
  ];
}
function nz4b(stage, ex) {
  const W = ex.W, TW = W - 430;
  const tb = div(stage, 'u4l5-two', '', 14, 8, TW, 420);
  const rows = [
    ['2x(x+3)', '(x+1)^2+11', 'start'],
    ['2x^2+6x', 'x^2+2x+1+11', 'expand both sides'],
    ['2x^2+6x', 'x^2+2x+12', 'simplify'],
    ['2x^2+6x-x^2-2x-12', '0', 'move all to the left'],
    ['x^2+4x-12', '0', 'collect like terms'],
    ['(x+6)(x-2)', '0', 'factor']
  ].map(([l, r, n], i) => {
    const row = h('div', 'u4l5-trow', `<div class="u4l5-tl">${T(l)}</div><div class="u4l5-tm">${T('=')}</div><div class="u4l5-tr">${T(r)}</div><div class="u4l5-tn">${n}</div>`);
    tb.appendChild(row); if (i) hide(row); return row;
  });
  const ans = lineIn(tb, T(tc(OK, 'x=-6\\ \\text{or}\\ x=2')), 'u4l5-tans');
  const k1 = checkCard(stage, { at: 'x=2', left: { tex: '2x(x+3)', sub: '2(2)(5)', f: ({ x }) => 2 * x * (x + 3) }, right: { tex: '(x+1)^2+11', sub: '3^2+11', f: ({ x }) => (x + 1) ** 2 + 11 }, values: { x: 2 }, x: TW + 30, y: 4, width: 380, hidden: true, cls: 'u4l5-ck' });
  const k2 = checkCard(stage, { at: 'x=-6', left: { tex: '2x(x+3)', sub: '2(-6)(-3)', f: ({ x }) => 2 * x * (x + 3) }, right: { tex: '(x+1)^2+11', sub: '(-5)^2+11', f: ({ x }) => (x + 1) ** 2 + 11 }, values: { x: -6 }, x: TW + 30, y: 222, width: 380, hidden: true, cls: 'u4l5-ck' });
  k1.querySelector('.bk-ck-h').style.opacity = 0; k2.querySelector('.bk-ck-h').style.opacity = 0;
  return [
    { cap: `Brackets on <b>both</b> sides, and neither side is 0. Not ready yet.`, run: (c) => pulse(c, rows[0], 1.04) },
    { cap: `Expand both sides: ${T('2x(x+3)=2x^2+6x')} and ${T('(x+1)^2=x^2+2x+1')}.`, run: (c) => show(c, rows[1]) },
    { cap: `Simplify the right side: ${T('1+11=12')}.`, run: (c) => show(c, rows[2]) },
    { cap: `Subtract every term on the right from both sides: the right side becomes <b>0</b>.`, run: (c) => show(c, rows[3]) },
    { cap: `Collect like terms: ${T('x^2+4x-12=0')}. Standard form!`, run: (c) => show(c, rows[4]) },
    { cap: `Product −12, sum 4: ${T('(x+6)(x-2)=0')}, so ${T('x=-6')} or ${T('x=2')}.`, run: async (c) => { await show(c, rows[5]); await show(c, ans); } },
    { cap: `Check ${T('x=2')} in the original: ${T('2(2)(5)=20')} and ${T('3^2+11=20')} ✓`, run: async (c) => { await show(c, k1.querySelector('.bk-ck-h')); await k1.play(c); } },
    { cap: `Check ${T('x=-6')}: ${T('2(-6)(-3)=36')} and ${T('(-5)^2+11=36')} ✓`, run: async (c) => { await show(c, k2.querySelector('.bk-ck-h')); await k2.play(c); } }
  ];
}

/* =============================== STAR explainer: drag the roots =============================== */
const RG = {
  ex5: { label: 'Example 5 check', r: [-2, 4], ask: 'Example 5: the graph of y = x² − 2x − 8. Read the x-intercepts, then solve x² − 2x − 8 = 0.' },
  dbl: { label: 'Double root: Example 3(c)', r: [-1, 3], ask: 'What happens to the graph when the two roots are the same number? Example 3(c): 9x² − 12x + 4 = 0.' },
  frac: { label: 'Fraction root: Example 6(b)', r: [-0.5, 4], ask: 'Example 6(b): roots −½ and 4. Which equation, with integer coefficients?' },
  free: { label: 'Drag the roots', r: [1, 5], ask: 'Drag either root along the x-axis. Watch the parabola and the equation.' }
};
const rootsGraph = {
  title: 'Drag the roots: y = (x − r₁)(x − r₂)',
  height: 470, minW: 960, capH: 92,
  choices: Object.keys(RG).map((k) => ({ v: k, label: RG[k].label })),
  ask: (v) => RG[v].ask,
  make(stage, v, ex) {
    const d = RG[v], W = ex.W, GW = 520;
    const S = { r: d.r.slice(), live: v === 'free' };
    const G = new Graph(stage, { x: 6, y: 4, width: GW, height: 462, xmin: -7, xmax: 7, ymin: -16, ymax: 12, xstep: 1, ystep: 2, xlabels: 1, ylabels: 4, fontSize: 15, pad: [30, 18, 18, 18] });
    const curve = G.fn((x) => (x - S.r[0]) * (x - S.r[1]), { color: BR, width: 3.4 });
    const cols = [F1, F2];
    // intercept dots + labels
    const dots = [0, 1].map((i) => { const p = G.point(S.r[i], 0, { color: cols[i], r: 9 }); return p; });
    // each root has a label for either side; the left root's shows on the left
    const labs = [0, 1].map((i) => { const L = G.label(S.r[i], 0, '', { pos: 'sw', cls: 'u4l5-ilab', gap: 20 }), R = G.label(S.r[i], 0, '', { pos: 'se', cls: 'u4l5-ilab', gap: 20 }), w = h('div'); w._p = [L, R]; return w; });
    const dblLab = G.label(S.r[0], 0, '', { pos: 'n', cls: 'u4l5-ilab u4l5-dbl', gap: 34 });
    // drag handles
    const handles = [0, 1].map((i) => {
      const hd = h('div', 'u4l5-handle', `<span>${T(`r_${i + 1}`)}</span>`); hd.style.setProperty('--hc', cols[i]); hd.setAttribute('data-tap', ''); G.html.appendChild(hd); return hd;
    });
    // the equation panel
    const PX = GW + 20, P = panel(stage, PX, 6, W - PX - 8, 458, '', 'u4l5-rpanel');
    const row = (k, cls = '') => { const r = h('div', 'u4l5-rrow ' + cls, `<div class="u4l5-rk">${k}</div><div class="u4l5-rv"></div>`); P.appendChild(r); return r; };
    const same = h('div', 'u4l5-same'); P.appendChild(same);
    const rRoots = row('roots of the equation'), rZeros = row('zeros of the function'), rInt = row('<i>x</i>-intercepts');
    same.append(rRoots, rZeros, rInt);
    const sameTag = h('div', 'u4l5-sametag', 'same numbers'); same.appendChild(sameTag);
    const rFac = row('factored'), rStd = row('standard form'), rInt2 = row('integer coefficients', 'u4l5-rint'), rNote = h('div', 'u4l5-rnote'); P.appendChild(rNote);
    const set = (r, html) => { r.querySelector('.u4l5-rv').innerHTML = html; };
    const paint = () => {
      const [a, b] = S.r, dbl = Math.abs(a - b) < 1e-9;
      curve._bkDraw();
      [0, 1].forEach((i) => {
        G.moveTo(dots[i], S.r[i], 0); place(handles[i], ...G.toPx(S.r[i], 0), 'c', 0);
        const left = S.r[i] < S.r[1 - i] || (S.r[i] === S.r[1 - i] && i === 0), html = dbl ? '' : T(tc(cols[i], `(${frT(S.r[i])},0)`));
        labs[i]._p.forEach((L, k) => { L.gx = S.r[i]; L._bkDraw(); L.innerHTML = (k === 0) === left ? html : ''; });
      });
      dblLab.gx = a; dblLab._bkDraw(); dblLab.innerHTML = dbl ? `double root ${T(`(${frT(a)},0)`)}` : '';
      dblLab.style.display = dbl ? '' : 'none';
      const ra = tc(F1, frT(a)), rb = tc(F2, frT(b));
      set(rRoots, dbl ? T(`x=${ra}`) + ' <span class="u4l5-rs">(double root)</span>' : T(`x=${ra},\\ x=${rb}`));
      set(rZeros, dbl ? T(ra) : T(`${ra}\\ \\text{and}\\ ${rb}`));
      set(rInt, dbl ? T(`(${ra},0)`) + ' <span class="u4l5-rs">touches</span>' : T(`(${ra},0),\\ (${rb},0)`));
      const fa = facMon(a), fb = facMon(b);
      set(rFac, T('y=' + (dbl ? tc(F1, `(${fa})^2`) : prodTex(fa, fb, F1, F2))));
      set(rStd, T('y=' + polyTex([1, -(a + b), a * b])));
      const [p1, q1] = facCo(a), [p2, q2] = facCo(b), frac = rat(a)[1] > 1 || rat(b)[1] > 1;
      rInt2.style.display = frac ? '' : 'none';
      if (frac) set(rInt2, T(prodTex(facInt(a), facInt(b), F1, F2) + '=0') + ' &nbsp;' + T('\\Rightarrow') + ' &nbsp;' + T(polyTex([p1 * p2, p1 * q2 + q1 * p2, q1 * q2]) + '=0'));
      rNote.innerHTML = dbl ? 'One root, used twice: the parabola just <b>touches</b> the <i>x</i>-axis.' : frac ? 'Multiply by the denominators: same roots, integer coefficients.' : '';
    };
    paint();
    // dragging (snaps to halves)
    handles.forEach((hd, i) => {
      const drag = (e) => { const [x] = G.fromEvent(e); const nx = Math.max(-6.5, Math.min(6.5, Math.round(x * 2) / 2)); if (nx !== S.r[i]) { S.r[i] = nx; paint(); } };
      hd.addEventListener('pointerdown', (e) => { if (!S.live) return; e.preventDefault(); e.stopPropagation(); try { hd.setPointerCapture(e.pointerId); } catch (er) { /* */ } hd._drag = true; hd.classList.add('u4l5-hdrag'); drag(e); });
      hd.addEventListener('pointermove', (e) => { if (hd._drag) drag(e); });
      const up = (e) => { hd._drag = false; hd.classList.remove('u4l5-hdrag'); try { hd.releasePointerCapture(e.pointerId); } catch (er) { /* */ } };
      hd.addEventListener('pointerup', up); hd.addEventListener('pointercancel', up);
    });
    const liveOn = () => { S.live = true; handles.forEach((hd) => hd.classList.add('u4l5-hlive')); };
    if (S.live) liveOn();
    const slide = (c, to, ms = 1100) => { const from = S.r.slice(); return tween(c, ms, (t) => { S.r = [0, 1].map((i) => from[i] + (to[i] - from[i]) * t); paint(); }).then(() => { S.r = to.slice(); paint(); }); };
    // what is hidden at the start
    const rowsAll = [same, rFac, rStd, rInt2, rNote];
    const hideG = () => { hide(curve); dots.forEach(hide); labs.forEach((w) => w._p.forEach(hide)); hide(dblLab); handles.forEach(hide); rowsAll.forEach(hide); };
    const showAll = async (c, which) => { for (const e of which) await show(c, e); };
    const graphIn = async (c) => { curve.style.opacity = 1; await G.drawIn(curve, 900, c); };
    const dotsIn = async (c) => { for (let i = 0; i < 2; i++) { dots[i].style.opacity = 1; await pop(c, dots[i], 340); await Promise.all(labs[i]._p.map((L) => show(c, L))); } dblLab.style.opacity = 1; };
    const handlesIn = async (c) => { liveOn(); for (const hd of handles) { hd.style.opacity = 1; await pop(c, hd, 300); } };
    if (v === 'free') return [
      { cap: `Roots ${T('1')} and ${T('5')}: ${T('y=(x-1)(x-5)=x^2-6x+5')}. <b>Drag</b> a coloured root along the <i>x</i>-axis.`, run: (c) => pulse(c, handles[1], 1.25) },
      { cap: `Drag them apart: the parabola dips deeper. Drag them together: it rises until it just <b>touches</b>.`, run: (c) => slide(c, [-2, 2]) },
      { cap: `Try a half: ${T('r=\\tfrac32')} gives the factor ${T('(2x-3)')} once the fraction is cleared.`, run: (c) => slide(c, [1.5, -2]) }
    ];
    hideG();
    if (v === 'ex5') return [
      { cap: `The graph of ${T('y=x^2-2x-8')}.`, run: async (c) => { await graphIn(c); await show(c, rStd); } },
      { cap: `(a) The <i>x</i>-intercepts: where the parabola meets the <i>x</i>-axis (${T('y=0')}): ${T('(-2,0)')} and ${T('(4,0)')}.`, run: (c) => dotsIn(c) },
      { cap: `(b) Solve ${T('x^2-2x-8=0')}: ${T('(x+2)(x-4)=0')}, so ${T('x=-2')} or ${T('x=4')}. The <b>same numbers</b>.`, run: (c) => showAll(c, [rFac, same]) },
      { cap: `Roots of the equation = zeros of the function = <i>x</i>-intercepts of the graph: ${T('-2')} and ${T('4')}.`, run: (c) => pulse(c, same, 1.04) },
      { cap: `Now <b>drag</b> a root: the parabola follows, and the equation rewrites itself.`, run: async (c) => { await handlesIn(c); await slide(c, [-2, 1], 900); await slide(c, [-2, 4], 900); } }
    ];
    if (v === 'dbl') return [
      { cap: `${T('y=(x+1)(x-3)')}: two roots, two <i>x</i>-intercepts.`, run: async (c) => { await graphIn(c); await dotsIn(c); await showAll(c, [same, rFac, rStd]); } },
      { cap: `Slide the roots <b>together</b>…`, run: (c) => slide(c, [0.5, 1], 1200) },
      { cap: `…until they meet at ${T('\\tfrac23')}: one root, used twice. The parabola just <b>touches</b> the <i>x</i>-axis: a <b>double root</b>.`, run: async (c) => { await slide(c, [2 / 3, 2 / 3], 900); await showAll(c, [rInt2, rNote]); } },
      { cap: `Example 3(c): ${T('9x^2-12x+4=0')} is ${T('(3x-2)^2=0')}. Its only root is ${T('x=\\tfrac23')}, a double root.`, run: (c) => pulse(c, rInt2, 1.06) },
      { cap: `Drag the roots apart again and watch the one intercept split into two.`, run: (c) => handlesIn(c) }
    ];
    return [ // frac
      { cap: `Roots ${T('-\\tfrac12')} and ${T('4')}: the parabola crosses at ${T('\\left(-\\tfrac12,0\\right)')} and ${T('(4,0)')}.`, run: async (c) => { await graphIn(c); await dotsIn(c); await show(c, same); } },
      { cap: `Factored: ${T('y=\\left(x+\\tfrac12\\right)(x-4)')}. Expanded: ${T('y=x^2-\\tfrac72x-2')}. Fractions!`, run: (c) => showAll(c, [rFac, rStd]) },
      { cap: `Multiply by 2: ${T('x+\\tfrac12')} becomes ${T('2x+1')}. ${T('(2x+1)(x-4)=0')}, or ${T('2x^2-7x-4=0')}: same roots, integer coefficients.`, run: (c) => showAll(c, [rInt2, rNote]) },
      { cap: `Drag a root to another half and read the new equation.`, run: (c) => handlesIn(c) }
    ];
  }
};

/* =============================== explainer: equation from roots =============================== */
const FR = {
  e6a: { label: 'Example 6(a) check', r: [5, -3], ask: 'Example 6(a): roots 5 and −3.' },
  e6b: { label: 'Example 6(b) check', r: [-0.5, 4], ask: 'Example 6(b): roots −½ and 4.' },
  e6c: { label: 'Example 6(c) check', r: [0, -7 / 3], ask: 'Example 6(c): roots 0 and −7⁄3.' },
  e6d: { label: 'Example 6(d) check', r: [0.6, 0.6], ask: 'Example 6(d): a double root of 3⁄5.' }
};
/** the lines that turn a root into its factor */
function rootLines(r) {
  const [p, q] = rat(r);
  if (p === 0) return ['x=0', `\\text{factor }x`];
  if (q === 1) return [`x=${p}`, `x${p > 0 ? '-' : '+'}${Math.abs(p)}=0`];
  return [`x=${frT(r)}`, `${q}x=${p}`, `${q}x${p > 0 ? '-' : '+'}${Math.abs(p)}=0`];
}
const mono = (c, pw) => { if (pw === 0) return frT(c); const a = Math.abs(c); return (c < 0 ? '-' : '') + (a === 1 ? '' : frT(a)) + 'x' + (pw > 1 ? '^' + pw : ''); };
const fromRoots = {
  title: 'Work backwards: root → factor → equation',
  height: 430, minW: 940,
  choices: Object.keys(FR).map((k) => ({ v: k, label: FR[k].label })),
  ask: (v) => FR[v].ask,
  make(stage, v, ex) {
    const d = FR[v], W = ex.W, [r1, r2] = d.r, dbl = r1 === r2, cols = [F1, F2];
    const f = [facInt(r1), facInt(r2)], co = [facCo(r1), facCo(r2)];
    // two transform columns
    const CWd = 230, cols2 = [0, 1].map((i) => {
      const P = panel(stage, 14 + i * (CWd + 12), 8, CWd, 250, `${dbl ? 'root' : 'root ' + (i + 1)}`, 'u4l5-rootcol');
      P.style.borderColor = cols[i];
      const ls = rootLines(d.r[i]).map((l, j) => lineIn(P, (j ? '<span class="u4l5-dn">↓</span>' : '') + T(j === 0 ? tc(cols[i], l) : l), 'u4l5-rl'));
      const fbox = lineIn(P, '<span class="u4l5-dn">↓</span>' + `<span class="u4l5-fbox" style="border-color:${cols[i]}">${T(tc(cols[i], f[i] === 'x' ? 'x' : `(${f[i]})`))}</span>`, 'u4l5-rl');
      return { P, ls, fbox };
    });
    const eqT = prodTex(f[0], f[1], F1, dbl ? F1 : F2) + '=0';
    const eq = hide(div(stage, 'u4l5-feq', T(eqT), 14, 272, 2 * CWd + 12));
    // multiplication grid
    const terms = (c) => [[c[0], 1], [c[1], 0]].filter(([k]) => k !== 0);
    const tA = terms(co[0]), tB = terms(co[1]), GX = 14 + 2 * (CWd + 12) + 20, CW = 120, CH = 54;
    const grid = div(stage, 'u4l5-grid', '', GX, 14, CW * (tA.length + 1), CH * (tB.length + 1));
    const cell = (r, c, html, cls) => div(grid, 'u4l5-gc ' + cls, html, c * CW, r * CH, CW, CH);
    cell(0, 0, T('\\times'), 'u4l5-gh0');
    tA.forEach(([k, pw], j) => cell(0, j + 1, T(tc(F1, mono(k, pw))), 'u4l5-gh'));
    tB.forEach(([k, pw], i) => cell(i + 1, 0, T(tc(dbl ? F1 : F2, mono(k, pw))), 'u4l5-gh'));
    const prods = [];
    tB.forEach(([kb, pb], i) => tA.forEach(([ka, pa], j) => { const pw = pa + pb, el = cell(i + 1, j + 1, T(mono(ka * kb, pw)), 'u4l5-gp' + (pw === 1 ? ' u4l5-gx' : '')); hide(el); prods.push({ el, k: ka * kb, pw }); }));
    hide(grid);
    const A = co[0][0] * co[1][0], B = co[0][0] * co[1][1] + co[0][1] * co[1][0], C = co[0][1] * co[1][1];
    const raw = prods.map((p, i) => { const m = mono(p.k, p.pw); return (i && p.k >= 0 ? '+' : '') + (p.pw === 1 ? tc(F2, m) : m); }).join('');
    const coll = hide(div(stage, 'u4l5-coll', T(raw + '=0'), GX, 14 + CH * (tB.length + 1) + 18, W - GX - 14));
    const std = polyTex([A, B, C]) + '=0';
    const res = hide(div(stage, 'u4l5-fres', T(tc(RT, std)), GX, 14 + CH * (tB.length + 1) + 78));
    const note = hide(div(stage, 'u4l5-fnote', '', 14, 346, W - 28, 76));
    const nTxt = {
      e6a: `Any non-zero multiple has the same roots: ${T('2x^2-4x-30=0')} works too. Give the smallest integer coefficients: ${T('x^2-2x-15=0')}.`,
      e6b: `Why not ${T('\\left(x+\\tfrac12\\right)')}? It is 0 at ${T('-\\tfrac12')} too, but ${T('(2x+1)')} keeps the coefficients integers.`,
      e6c: `The root 0 gives the factor ${T('x')} (that is, ${T('x-0')}). No constant term: ${T('3x^2+7x=0')}.`,
      e6d: `A double root: the same factor <b>twice</b>, ${T('(5x-3)^2=0')}. Its graph would just touch the <i>x</i>-axis at ${T('\\tfrac35')}.`
    }[v];
    note.innerHTML = nTxt;
    const colIn = async (c, i) => { for (const e of cols2[i].ls) await show(c, e); await show(c, cols2[i].fbox); await pop(c, cols2[i].fbox, 300); };
    const fx = (i) => (f[i] === 'x' ? 'x' : `(${f[i]})`);
    const steps = [];
    const rl = (i) => rootLines(d.r[i]);
    const undo = (i) => (d.r[i] === 0 ? `the factor is ${T('x')} (that is, ${T('x-0')})` : `undo it: ${T(rl(i).slice(1).join(',\\ '))}, so the factor is ${T(fx(i))}`);
    steps.push({ cap: `Root ${T(frT(r1))}: which factor is 0 when ${T('x=' + frT(r1))}? ${undo(0).replace(/^./, (m) => m.toUpperCase())}.`, run: (c) => colIn(c, 0) });
    if (dbl) steps.push({ cap: `A <b>double</b> root: the same factor comes twice. Factor ${T(fx(1))} again.`, run: (c) => colIn(c, 1) });
    else steps.push({ cap: `Root ${T(frT(r2))}: ${undo(1)}.`, run: (c) => colIn(c, 1) });
    steps.push({ cap: `The equation: ${T(prodTex(f[0], f[1]) + '=0')}. ${dbl ? `Its only root is ${T(frT(r1))} (a double root).` : `Its roots are exactly ${T(frT(r1))} and ${T(frT(r2))}.`}`, run: async (c) => { eq.style.opacity = 1; await pop(c, eq, 380); } });
    steps.push({ cap: `Multiply: <b>every term by every term</b>.`, run: async (c) => { await show(c, grid); for (const p of prods) { p.el.style.opacity = 1; await pop(c, p.el, 260); } } });
    steps.push({ cap: `Collect like terms: ${T(std)}. Standard form, integer coefficients.`, run: async (c) => { await show(c, coll); res.style.opacity = 1; await pop(c, res, 420); } });
    steps.push({ cap: nTxt, run: (c) => show(c, note) });
    return steps;
  }
};

/* =============================== explainer: reject the impossible root =============================== */
const AD = {
  e7a: { label: 'Example 7(a) check', ask: 'Example 7(a): the product of two consecutive odd integers is 143. Determine the integers.' },
  e8a: { label: 'Example 8(a) check', ask: 'Example 8(a): a garden is 3 m longer than twice its width. Area 65 m². Dimensions and perimeter?' },
  e8b: { label: 'Example 8(b) check', ask: 'Example 8(b): a 20 cm by 14 cm photo, a frame of uniform width x. Together 432 cm². Determine x.' }
};
const admissible = {
  title: 'Solve, then ask: does it make sense?',
  height: 440, minW: 960,
  choices: Object.keys(AD).map((k) => ({ v: k, label: AD[k].label })),
  ask: (v) => AD[v].ask,
  make(stage, v, ex) {
    const W = ex.W, LW = 380, P = panel(stage, 14, 8, LW, 424, '', 'u4l5-alg');
    const VX = LW + 34, VW = W - VX - 10;
    const L = (s, cls) => lineIn(P, s, cls);
    if (v === 'e7a') {
      const ls = [L(`Let the integers be ${T('n')} and ${T('n+2')}.`), L(T('n(n+2)=143')), L(T('n^2+2n-143=0')), L(T('(n+13)(n-11)=0')), L(T(`n=${tc(F1, '-13')}\\ \\text{or}\\ n=${tc(F2, '11')}`)),
        L(`<b>11 and 13</b>, or <b>${T('-13')} and ${T('-11')}</b>: both work.`, 'u4l5-aok')];
      const N = new NumberLine(stage, { x: VX, y: 120, width: VW, height: 150, min: -15, max: 15, step: 1, labelStep: 5, axisY: 90, fontSize: 17, numbers: false }); hide(N.el);
      const odd = []; for (let k = -15; k <= 15; k += 2) odd.push(k);
      odd.forEach((k) => { const t = N.mark(k, String(k).replace('-', '−'), { pos: 's', cls: 'u4l5-oddm' }); hide(t); t.classList.add('u4l5-odd'); });
      const oddMarks = [...N.html.querySelectorAll('.u4l5-odd')];
      const oddTag = hide(div(stage, 'u4l5-vnote', 'the odd integers: 2 apart', VX + VW / 2, 70)); oddTag.style.translate = '-50% 0';
      const pr = (a, col, lab) => { const p1 = N.point(a, { color: col, r: 9 }), p2 = N.point(a + 2, { color: col, r: 9 }); hide(p1); hide(p2); return { p1, p2, a, col, lab }; };
      const A = pr(11, F2), B = pr(-13, F1);
      const tagA = hide(div(stage, 'u4l5-vtag', T(`11\\times13=143`) + ' ✓', VX + N.toPx(12), 300)), tagB = hide(div(stage, 'u4l5-vtag', T(`(-13)(-11)=143`) + ' ✓', VX + N.toPx(-12), 300));
      tagA.style.translate = '-50% 0'; tagB.style.translate = '-50% 0';
      const why = hide(div(stage, 'u4l5-vnote', 'Integers can be negative: <b>nothing to reject</b>.', VX + VW / 2, 372)); why.style.translate = '-50% 0';
      const pairIn = async (c, p) => { p.p1.style.opacity = 1; await pop(c, p.p1, 300); await N.hop(c, p.a, p.a + 2, { label: '+2', color: p.col, height: 26 }); p.p2.style.opacity = 1; await pop(c, p.p2, 300); };
      return [
        { cap: `Consecutive odd integers are 2 apart: let them be ${T('n')} and ${T('n+2')}.`, run: async (c) => { await show(c, ls[0]); await show(c, oddTag); for (const m of oddMarks) m.style.opacity = 1; await appear(c, N.el, 300); } },
        { cap: `Their product is 143: ${T('n(n+2)=143')}. Standard form: ${T('n^2+2n-143=0')}.`, run: async (c) => { await show(c, ls[1]); await show(c, ls[2]); } },
        { cap: `Product −143, sum 2: 13 and −11. ${T('(n+13)(n-11)=0')}, so ${T('n=-13')} or ${T('n=11')}.`, run: async (c) => { await show(c, ls[3]); await show(c, ls[4]); } },
        { cap: `${T('n=11')}: the integers are 11 and 13, and ${T('11\\times13=143')} ✓`, run: async (c) => { await pairIn(c, A); await show(c, tagA); } },
        { cap: `${T('n=-13')}: the integers are ${T('-13')} and ${T('-11')}, and ${T('(-13)(-11)=143')} ✓. Integers can be negative: <b>both pairs work</b>.`, run: async (c) => { await pairIn(c, B); await show(c, tagB); await show(c, why); await show(c, ls[5]); } }
      ];
    }
    if (v === 'e8a') {
      const ls = [L(`Width ${T('w')}, length ${T('2w+3')}.`), L(T('w(2w+3)=65')), L(T('2w^2+3w-65=0')), L(T('(2w+13)(w-5)=0')),
        L(`${T(tc(NO, 'w=-\\tfrac{13}{2}'))} <b class="u4l5-rej">reject</b> &nbsp; or &nbsp; ${T(tc(OK, 'w=5'))}`), L(`<b>5 m by 13 m</b>`, 'u4l5-aok'), L(`Perimeter ${T('=2(5+13)=36')} m`, 'u4l5-aok')];
      const s = 22, X0 = VX + 40, Y0 = 70;
      const rect = div(stage, 'u4l5-garden', '', X0, Y0, 0, 0);
      const wl = div(stage, 'u4l5-dim', '', 0, 0), ll = div(stage, 'u4l5-dim', '', 0, 0), area = div(stage, 'u4l5-area', '', 0, 0);
      const st = { w: 2 };
      const draw = (w) => {
        st.w = w; const L2 = 2 * w + 3, ww = Math.max(0, w) * s, lw = Math.max(0, L2) * s; box(rect, lw, ww);
        place(wl, X0 - 8, Y0 + ww / 2, 'w', 0); place(ll, X0 + lw / 2, Y0 - 8, 'n', 0); place(area, X0 + lw / 2, Y0 + ww / 2, 'c', 0);
        const k = Math.round(w * 10) / 10;
        wl.innerHTML = T(`w=${k}`); ll.innerHTML = T(`2w+3=${Math.round((2 * k + 3) * 10) / 10}`);
        area.innerHTML = w >= 1 ? T(`\\text{area}=${Math.round(w * L2 * 10) / 10}`) : '';
      };
      hide(rect); hide(wl); hide(ll); hide(area); draw(2);
      const ghost = hide(div(stage, 'u4l5-ghost', `width ${T('-6.5')} m?<br>length ${T('2(-6.5)+3=-10')} m?`, VX + VW / 2, 300)); ghost.style.translate = '-50% 0';
      const sR = hide(stamp(stage, 'reject', { ok: false, x: VX + VW / 2 + 150, y: 300 }));
      const per = hide(div(stage, 'u4l5-vnote', `perimeter ${T('=2(5+13)=36')} m`, VX + VW / 2, 392)); per.style.translate = '-50% 0';
      return [
        { cap: `Let the width be ${T('w')}. The length is 3 more than twice the width: ${T('2w+3')}.`, run: async (c) => { await show(c, ls[0]); await Promise.all([show(c, rect), show(c, wl), show(c, ll), show(c, area)]); } },
        { cap: `Area: ${T('w(2w+3)=65')}. Standard form: ${T('2w^2+3w-65=0')}.`, run: async (c) => { await show(c, ls[1]); await show(c, ls[2]); } },
        { cap: `Factor: ${T('(2w+13)(w-5)=0')}, so ${T('w=-\\tfrac{13}{2}')} or ${T('w=5')}.`, run: async (c) => { await show(c, ls[3]); await show(c, ls[4]); } },
        { cap: `${T('w=-\\tfrac{13}{2}=-6.5')}? A width can’t be negative: <b>reject</b> it.`, run: async (c) => { await show(c, ghost); await stampIn(c, sR); } },
        { cap: `${T('w=5')}: the garden is 5 m by ${T('2(5)+3=13')} m. Area ${T('5\\times13=65')} ✓`, run: async (c) => { await tween(c, 1000, (t) => draw(2 + 3 * t)); draw(5); rect.classList.add('u4l5-gok'); await show(c, ls[5]); } },
        { cap: `Perimeter ${T('=2(5+13)=36')} m. Answer the question asked, with units.`, run: async (c) => { await show(c, per); await show(c, ls[6]); } }
      ];
    }
    // e8b: frame
    const ls = [L(`Outside: ${T('(20+2x)')} by ${T('(14+2x)')}`), L(T('(20+2x)(14+2x)=432')), L(T('280+68x+4x^2=432')), L(T('4x^2+68x-152=0')), L(T('x^2+17x-38=0')), L(T('(x+19)(x-2)=0')),
      L(`${T(tc(NO, 'x=-19'))} <b class="u4l5-rej">reject</b> &nbsp; or &nbsp; ${T(tc(OK, 'x=2'))}`), L(`The frame is <b>2 cm</b> wide.`, 'u4l5-aok')];
    const s = 10, CX = VX + VW / 2, CY = 190;
    const frame = div(stage, 'u4l5-frame', '', 0, 0), photo = div(stage, 'u4l5-photo', 'photo', CX - 100, CY - 70, 200, 140);
    const ow = div(stage, 'u4l5-dim', '', 0, 0), oh = div(stage, 'u4l5-dim', '', 0, 0), xl = div(stage, 'u4l5-dim u4l5-dimx', T('x'), 0, 0);
    div(photo, 'u4l5-pdim', T('20'), 0, 4, 200); const ph = div(photo, 'u4l5-pdim', T('14'), 166, 58, 30);
    void ph;
    const draw = (x) => {
      const w = (20 + 2 * x) * s, hh = (14 + 2 * x) * s; box(frame, w, hh); at2(frame, CX - w / 2, CY - hh / 2);
      place(ow, CX, CY - hh / 2 - 6, 'n', 0);
      place(oh, CX + w / 2 + 8, CY, 'e', 0); place(xl, CX - w / 2 + x * s / 2, CY + hh / 2 + 4, 's', 0);
      const k = Math.round(x * 10) / 10;
      ow.innerHTML = T(`20+2x=${Math.round((20 + 2 * k) * 10) / 10}`); oh.innerHTML = T(`14+2x=${Math.round((14 + 2 * k) * 10) / 10}`);
    };
    [frame, ow, oh, xl].forEach(hide); hide(photo); draw(3);
    const ghost = hide(div(stage, 'u4l5-ghost', `outside: ${T('20+2(-19)=-18')} cm?`, CX, 352)); ghost.style.translate = '-50% 0';
    const sR = hide(stamp(stage, 'reject', { ok: false, x: CX + 175, y: 330 }));
    const ok = hide(div(stage, 'u4l5-vnote', `${T('24\\times18=432')} ✓`, CX, 392)); ok.style.translate = '-50% 0';
    return [
      { cap: `The frame adds ${T('x')} on <b>both</b> sides: the outside is ${T('(20+2x)')} by ${T('(14+2x)')}.`, run: async (c) => { await show(c, photo); await Promise.all([show(c, frame), show(c, ow), show(c, oh), show(c, xl)]); await show(c, ls[0]); } },
      { cap: `Photo and frame together: ${T('(20+2x)(14+2x)=432')}. Expand: ${T('280+68x+4x^2=432')}.`, run: async (c) => { await show(c, ls[1]); await show(c, ls[2]); } },
      { cap: `Standard form: ${T('4x^2+68x-152=0')}. Divide by the common factor 4: ${T('x^2+17x-38=0')}.`, run: async (c) => { await show(c, ls[3]); await show(c, ls[4]); } },
      { cap: `Product −38, sum 17: ${T('(x+19)(x-2)=0')}, so ${T('x=-19')} or ${T('x=2')}.`, run: async (c) => { await show(c, ls[5]); await show(c, ls[6]); } },
      { cap: `${T('x=-19')}: the outside would be ${T('20+2(-19)=-18')} cm long. <b>Reject</b> it.`, run: async (c) => { await show(c, ghost); await stampIn(c, sR); } },
      { cap: `${T('x=2')}: the outside is 24 cm by 18 cm, and ${T('24\\times18=432')} ✓. The frame is <b>2 cm</b> wide.`, run: async (c) => { await tween(c, 900, (t) => draw(3 - t)); draw(2); frame.classList.add('u4l5-gok'); await show(c, ok); await show(c, ls[7]); } }
    ];
  }
};
function at2(el, x, y) { el.style.left = x + 'px'; el.style.top = y + 'px'; }

/* =============================== explainer: the ball =============================== */
const BL = {
  e9a: { label: 'Example 9(a) check', ask: 'Example 9(a): h = −5t² + 20t + 25. When does the ball hit the ground?' },
  e9b: { label: 'Example 9(b) check', ask: 'Example 9(b): h = −5t² + 20t + 25. When is the ball 40 m above the ground?' }
};
const ball = {
  title: 'Height and time: read the parabola',
  height: 440, minW: 960,
  choices: Object.keys(BL).map((k) => ({ v: k, label: BL[k].label })),
  ask: (v) => BL[v].ask,
  make(stage, v, ex) {
    const W = ex.W, GW = 560, hf = (t) => -5 * t * t + 20 * t + 25;
    const G = new Graph(stage, { x: 6, y: 4, width: GW, height: 432, xmin: -2, xmax: 6.5, ymin: -10, ymax: 50, xstep: 1, ystep: 5, xlabels: 1, ylabels: 10, fontSize: 15, xtitle: 't', ytitle: 'h', pad: [30, 18, 18, 18] });
    // the ground strip
    const [gx0, gy] = G.toPx(-2, 0), [gx1, gy1] = G.toPx(6.5, -10);
    svgEl('rect', { x: gx0, y: gy, width: gx1 - gx0, height: gy1 - gy, fill: '#8a6440', 'fill-opacity': 0.12 }, G.layers.bg);
    const pre = hide(G.fn(hf, { from: -1.15, to: 0, color: GRAY, width: 2.6, dash: '7 7', arrows: false }));
    const real = hide(G.fn(hf, { from: 0, to: 5, color: F1, width: 3.6, arrows: false }));
    const start = G.point(0, 25, { color: F1, r: 8, label: 'balcony, 25 m', pos: 'e' }); hide(start); hide(start.label);
    const preLab = hide(G.label(-1.05, 30, 'before the throw', { pos: 'n', cls: 'u4l5-glab u4l5-gray' }));
    const P = panel(stage, GW + 20, 8, W - GW - 28, 424, '', 'u4l5-alg');
    const L = (s, cls) => lineIn(P, s, cls);
    const ptIn = async (c, p) => { p.style.opacity = 1; await Promise.all([pop(c, p, 340), show(c, p.label)]); };
    const base = [
      { cap: `${T('t=0')}: the ball leaves the balcony at ${T('h=25')} m. It rises, then falls.`, run: async (c) => { real.style.opacity = 1; await G.drawIn(real, 1000, c); await ptIn(c, start); } }
    ];
    if (v === 'e9a') {
      const ls = [L(`The ground is ${T('h=0')}.`), L(T('-5t^2+20t+25=0')), L(`Divide by ${T('-5')}: ${T('t^2-4t-5=0')}`), L(T('(t-5)(t+1)=0')), L(`${T(tc(OK, 't=5'))} or ${T(tc(NO, 't=-1'))} <b class="u4l5-rej">reject</b>`), L('It lands after <b>5 s</b>.', 'u4l5-aok')];
      const p5 = G.point(5, 0, { color: OK, r: 9, label: T('t=5'), pos: 'ne' }), pm = G.point(-1, 0, { color: NO, r: 9, label: T('t=-1'), pos: 'nw' });
      [p5, pm].forEach((p) => { hide(p); hide(p.label); });
      const sR = hide(stamp(stage, 'reject', { ok: false, x: G.toPx(-1, 0)[0] + 16, y: G.toPx(-1, 0)[1] + 44, size: 'sm' }));
      return base.concat([
        { cap: `The ground is ${T('h=0')}: solve ${T('-5t^2+20t+25=0')}.`, run: async (c) => { await show(c, ls[0]); await show(c, ls[1]); } },
        { cap: `Divide by the common factor ${T('-5')}: ${T('t^2-4t-5=0')}, so ${T('(t-5)(t+1)=0')}.`, run: async (c) => { await show(c, ls[2]); await show(c, ls[3]); } },
        { cap: `${T('t=5')} or ${T('t=-1')}. The parabola meets ${T('h=0')} at both, but…`, run: async (c) => { pre.style.opacity = 1; await G.drawIn(pre, 600, c); await show(c, preLab); await ptIn(c, pm); await ptIn(c, p5); } },
        { cap: `${T('t=-1')} is a second <b>before</b> the throw. Time after the throw can’t be negative: <b>reject</b> it. It lands after <b>5 s</b>.`, run: async (c) => { await stampIn(c, sR); await show(c, ls[4]); await show(c, ls[5]); } }
      ]);
    }
    const ls = [L(T('-5t^2+20t+25=40')), L(T('-5t^2+20t-15=0')), L(T('t^2-4t+3=0')), L(T('(t-1)(t-3)=0')), L(`${T(tc(OK, 't=1'))} s (up) and ${T(tc(OK, 't=3'))} s (down)`), L('Both are admissible.', 'u4l5-aok')];
    const hl = hide(G.hline(40, { color: F2, width: 2.6 }));
    const hlab = hide(G.label(-1.95, 40, T(tc(F2, 'h=40')), { pos: 'ne', cls: 'u4l5-glab' }));
    const p1 = G.point(1, 40, { color: OK, r: 9, label: 'on the way up', pos: 'nw' }), p3 = G.point(3, 40, { color: OK, r: 9, label: 'on the way down', pos: 'ne' });
    [p1, p3].forEach((p) => { hide(p); hide(p.label); });
    return base.concat([
      { cap: `40 m above the ground: the horizontal line ${T('h=40')}. Set ${T('-5t^2+20t+25=40')}.`, run: async (c) => { hl.style.opacity = 1; await G.drawIn(hl, 600, c); await show(c, hlab); await show(c, ls[0]); } },
      { cap: `Subtract 40: ${T('-5t^2+20t-15=0')}. Divide by ${T('-5')}: ${T('t^2-4t+3=0')}.`, run: async (c) => { await show(c, ls[1]); await show(c, ls[2]); } },
      { cap: `${T('(t-1)(t-3)=0')}, so ${T('t=1')} or ${T('t=3')}.`, run: async (c) => { await show(c, ls[3]); await show(c, ls[4]); } },
      { cap: `The line crosses the parabola <b>twice</b>: at 1 s on the way up and at 3 s on the way down. Both times are positive: <b>both are admissible</b>.`, run: async (c) => { await ptIn(c, p1); await ptIn(c, p3); await show(c, ls[5]); } }
    ]);
  }
};

/* =============================== Example 5 figure =============================== */
function mountEx5() {
  const host = document.getElementById('u4l5-ex5fig'); if (!host) return;
  const G = new Graph(host, { width: 380, height: 420, xmin: -4, xmax: 6, ymin: -10, ymax: 8, xstep: 1, ystep: 1, xlabels: 2, ylabels: 2, fontSize: 15, major: 0 });
  G.fn((x) => x * x - 2 * x - 8, { color: BR, width: 3 });
  G.label(-3.8, -9.2, T('y=x^2-2x-8'), { pos: 'ne', cls: 'u4l5-glab' });
}

/* =============================== Stand Up Break =============================== */
const sx = (n) => (n < 0 ? `+${-n}` : `-${n}`); // x − n
standup('u4l5', {
  intro: 'At your whiteboard: get 0 on one side, factor fully, then set each factor equal to 0.',
  levels: {
    BEG: (r) => {
      let a = r.int(-9, 9), b = r.int(-9, 9); while (a === 0 || b === 0 || a === b || a === -b) { a = r.int(-9, 9); b = r.int(-9, 9); }
      return { text: 'Solve by factoring.', q: polyTex([1, -(a + b), a * b]) + '=0', a: [`(x${sx(a)})(x${sx(b)})=0`, `x=${a}\\ \\text{or}\\ x=${b}`] };
    },
    PRG: (r) => {
      if (r.chance(0.5)) { // ax² + bx + c with one fractional root, written with the constant on the right
        const q = r.pick([2, 3]), p = r.pick([1, 2, 4, 5, 7].filter((k) => gcd(k, q) === 1)) * r.sign(), s = r.int(-6, 6) || 3;
        const A = q, B = -(q * s + p), C = p * s;
        return { text: 'Write the equation in standard form, then solve.', q: `${polyTex([A, B, 0])}=${frT(-C)}`,
          a: [polyTex([A, B, C]) + '=0', `(${q}x${p > 0 ? '-' : '+'}${Math.abs(p)})(x${sx(s)})=0`, `x=${frT(p / q)}\\ \\text{or}\\ x=${s}`] };
      }
      const k = r.pick([2, 3, 4, 5]), m = r.int(2, 9); // kx² = kmx
      return { text: 'Solve. (Don’t divide by x!)', q: `${k}x^2=${k * m}x`, a: [`${k}x^2-${k * m}x=0`, `${k}x(x-${m})=0`, `x=0\\ \\text{or}\\ x=${m}`] };
    },
    MAS: (r) => {
      if (r.chance(0.5)) { // rectangle
        const w = r.int(4, 12), k = r.pick([2, 3]), dd = r.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]), L2 = k * w + dd, A = w * L2, m = A / w;
        const desc = `${Math.abs(dd)} cm ${dd > 0 ? 'more' : 'less'} than ${k === 2 ? 'twice' : 'three times'} its width`;
        return { text: `The length of a rectangle is ${desc}. Its area is <b>${A} cm²</b>. Determine its dimensions.`, q: '',
          a: [`w(${k}w${dd > 0 ? '+' : '-'}${Math.abs(dd)})=${A}`, `${k}w^2${dd > 0 ? '+' : '-'}${Math.abs(dd) === 1 ? '' : Math.abs(dd)}w-${A}=0`, `(${k}w+${m})(w-${w})=0`, `w=${frT(-m / k)}\\ (\\text{reject})\\ \\text{or}\\ w=${w}`, `\\text{${w} cm by ${L2} cm}`] };
      }
      const q = r.pick([2, 3, 4, 5]), p = r.pick([1, 3, 7].filter((k2) => gcd(k2, q) === 1)) * r.sign(), s = r.int(-5, 5) || -2;
      const A = q, B = -(q * s + p), C = p * s;
      return { text: `Write a quadratic equation in standard form, with integer coefficients, with roots ${T(frT(p / q))} and ${T(String(s))}.`, q: '',
        a: [`(${q}x${p > 0 ? '-' : '+'}${Math.abs(p)})(${facInt(s)})=0`, polyTex([A, B, C]) + '=0'] };
    }
  }
});

/* =============================== mount =============================== */
mountCards();
mountEx5();
export const explainers = mountExplainers({ zpp, pipeline, lostRoot, notZero, rootsGraph, fromRoots, admissible, ball });
export const _test = { rat, frT, polyTex, facInt, facMon, prodTex, ZP, PL, LR, RG, FR, AD, BL };
