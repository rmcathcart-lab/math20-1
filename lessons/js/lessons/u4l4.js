/* Math 20-1 · Unit 4 · Lesson 4 — Differences of Squares, Including a²(f(x))² − b²(g(y))².
 * Warm-up (The Chocolate Trade: a square bar traded for one k rows shorter and k columns longer; the top rows turn into
 * the new columns and a k by k square is left over: 20² − 3² = 17 × 23), and the explainers:
 *   foilCancel (a 2 by 2 multiplying grid: the middle terms of (A − B)(A + B) cancel; same signs don't),
 *   cutSlide (STAR: a big square, a small square cut from its corner, the L cut in two and the top piece turned and slid
 *     into an (A − B) by (A + B) rectangle; side labels follow the chosen example: 7 and 3, x and 3, Example 1(a),
 *     Example 7 the patio) and cutSlide2 (the same picture, opening on the patio, beside Example 7),
 *   sumNo (the product–sum hunt for x² + 36: no pair has sum 0; x² − 36 has −6 and 6),
 *   dosTest (three checks — two terms, both squares, subtracted — then √ each term for A and B; Example 1 checks),
 *   gcfFirst (coefficients as dot arrays: 12 dots are 3 squares of 4; take out the GCF; Example 2 checks),
 *   banner (factored area → length and width; in the perimeter the ±by cancel; then length = k × width; Example 3),
 *   fracSquares (root the numerator and the denominator separately; decimals as hundredths; two ways for Example 4(a)),
 *   keepGoing (a factor tree: differences keep opening, sums stay shut, odd powers stop; Example 5 checks),
 *   boxSub (A and B in coloured boxes; keep the brackets, the minus reaches every term of B; Example 6 checks),
 *   checklist (the factoring checklist as a flowchart, lit for each part of Example 8),
 *   factorOf (the fully factored form as cards; a candidate is a factor if it is a card or a product of cards; Ex 9).
 * Colours: A rose #a33357, B amber #c27a0e (as in the formula boxes on the page), done/✓ green, "does not factor" red.
 * No calculator in this unit. */
import {
  h, tex, add, box, Flowchart, stamp, stampIn, mountExplainers, pop, fadeIn, appear, sleep, tween, pulse, shake,
  svgEl, place, drawIn, anim, liveCtx
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const CA = '#a33357', CB = '#c27a0e', OK = '#12805a', RED = '#c93a33', INK = '#1c2230', BR = '#7a1f3d', GRAY = '#8a8f99';
const tc = (c, s) => `\\textcolor{${c}}{${s}}`;
const cA = (s) => tc(CA, s), cB = (s) => tc(CB, s), cR = (s) => tc(RED, s), cG = (s) => tc(OK, s);
const bxA = (s) => `\\fcolorbox{${CA}}{#fbeef2}{$${s}$}`, bxB = (s) => `\\fcolorbox{${CB}}{#fdf3e2}{$${s}$}`;
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const mkSvg = (stage, W, H) => { const s = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u4l4-svg' }, stage); s.style.left = '0px'; s.style.top = '0px'; return s; };
const lab = (stage, x, y, html, cls = '', pos = 'c', gap = 0) => { const d = h('div', 'u4l4-lab ' + cls, html); stage.appendChild(d); place(d, x, y, pos, gap); return d; };
const panel = (stage, x, y, w, hh, title, cls = '') => add(stage, box(h('div', 'u4l4-panel ' + cls, title ? `<div class="u4l4-ph">${title}</div>` : ''), w, hh), x, y);
const line = (p, html, cls = '') => { const d = h('div', 'u4l4-line ' + cls, html); p.appendChild(d); return d; };
const lineH = (p, html, cls = '') => hide(line(p, html, cls));
const nf = (v) => String(+(+v).toFixed(6));
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const byId = (id) => document.getElementById(id);

/* ====================================================================================================
 * Warm-up: The Chocolate Trade. An n by n bar; the top k rows (minus their k by k corner) turn a quarter turn and become
 * k new columns on the right: an (n − k) by (n + k) bar, with the k by k corner left over.
 * ==================================================================================================== */
function mountChoc() {
  const host = byId('u4l4-choc'); if (!host) return;
  const W = 560, H = 392;
  const svg = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u4l4-chocsvg' }, host);
  const info = h('div', 'u4l4-chocinfo', ''); host.appendChild(info);
  const bS = byId('u4l4-wsmall'), bB = byId('u4l4-wbig'), bT = byId('u4l4-wtrade'), bR = byId('u4l4-wreset');
  let n = 4, k = 1, traded = false, busy = false, cells = [];
  const build = () => {
    svg.innerHTML = ''; traded = false; cells = [];
    const q = Math.min(310 / n, 520 / (n + k)), X0 = (W - (n + k) * q) / 2, Y0 = H - 14 - n * q, ins = Math.max(1.5, q * 0.13);
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      const g = svgEl('g', { class: 'u4l4-pc' }, svg);
      svgEl('rect', { x: 0.6, y: 0.6, width: q - 1.2, height: q - 1.2, rx: Math.min(4, q * 0.12), fill: '#6b3f22', stroke: '#4a2a14', 'stroke-width': 1 }, g);
      svgEl('rect', { x: ins, y: ins, width: q - 2 * ins, height: q - 2 * ins, rx: Math.min(3, q * 0.08), fill: '#85532f' }, g);
      const kind = r < k ? (c < n - k ? 'move' : 'left') : 'stay';
      const x = X0 + c * q, y = Y0 + r * q;
      const tx = kind === 'move' ? X0 + (n + (k - 1 - r)) * q : x, ty = kind === 'move' ? Y0 + (k + c) * q : y;
      g.setAttribute('transform', `translate(${x} ${y})`);
      cells.push({ g, kind, x, y, tx, ty });
    }
    info.innerHTML = `<b>${n} by ${n}</b> bar: <b>${n * n}</b> pieces`;
    bT.disabled = false;
  };
  const trade = async () => {
    if (traded || busy) return; busy = true; bT.disabled = true;
    const c = liveCtx(), mv = cells.filter((o) => o.kind === 'move');
    await tween(c, 1500, (t) => { mv.forEach((o) => { const lift = Math.sin(Math.PI * t) * 34; o.g.setAttribute('transform', `translate(${(o.x + (o.tx - o.x) * t).toFixed(2)} ${(o.y + (o.ty - o.y) * t - lift).toFixed(2)})`); }); });
    cells.filter((o) => o.kind === 'left').forEach((o) => o.g.classList.add('u4l4-pc-left'));
    const m = n - k, p = n + k, left = k * k;
    info.innerHTML = `<b>${m} by ${p}</b> bar: <b>${m * p}</b> pieces · <span class="u4l4-gold">${left === 1 ? '1 piece' : `a ${k} by ${k} square: ${left} pieces`} left over</span>`;
    traded = true; busy = false;
  };
  bS.addEventListener('click', () => { if (busy) return; n = 4; k = 1; build(); });
  bB.addEventListener('click', () => { if (busy) return; n = 20; k = 3; build(); });
  bT.addEventListener('click', trade);
  bR.addEventListener('click', () => { if (!busy) build(); });
  build();
}

/* =============================== explainer: the middle terms cancel =============================== */
const FC = {
  x5: { label: T('(x-5)(x+5)'), A: 'x', B: '5', s: 1, AA: 'x^2', AB: '5x', BB: '25', res: 'x^2-25' },
  key: { label: T('(7x-5y)(7x+5y)'), A: '7x', B: '5y', s: 1, AA: '49x^2', AB: '35xy', BB: '25y^2', res: '49x^2-25y^2' },
  same: { label: T('(x-5)(x-5)'), A: 'x', B: '5', s: -1, AA: 'x^2', AB: '5x', BB: '25', res: 'x^2-10x+25', mid: '-10x' }
};
const foilCancel = {
  title: 'Multiply (A − B)(A + B): the middle terms cancel',
  height: 380, minW: 900,
  choices: [...Object.keys(FC).map((k) => ({ v: k, label: FC[k].label }))],
  ask: (k) => `Expand ${T(`(${FC[k].A}-${FC[k].B})(${FC[k].A}${FC[k].s > 0 ? '+' : '-'}${FC[k].B})`)}.`,
  make(stage, k, ex) {
    const d = FC[k], W = ex.W, sg = d.s > 0 ? '+' : '-', X0 = 40, Y0 = 34, HW = 96, CW = 196, CH = 104;
    const hd = (x, y, html, cls) => hide(add(stage, box(h('div', 'u4l4-gh ' + cls, html), x === X0 ? HW : CW, y === Y0 ? 56 : CH), x, y));
    const cA1 = hd(X0 + HW, Y0, T(cA(d.A)), ''), cB1 = hd(X0 + HW + CW, Y0, T(`${sg}${cB(d.B)}`), '');
    const rA = hd(X0, Y0 + 56, T(cA(d.A)), ''), rB = hd(X0, Y0 + 56 + CH, T(`-${cB(d.B)}`), '');
    const cell = (r, c, html) => hide(add(stage, box(h('div', 'u4l4-gc', html), CW, CH), X0 + HW + c * CW, Y0 + 56 + r * CH));
    const midTop = `${sg}${d.AB}`, lastT = d.s > 0 ? `-${d.BB}` : `+${d.BB}`;
    const c00 = cell(0, 0, T(d.AA)), c01 = cell(0, 1, T(midTop)), c10 = cell(1, 0, T(`-${d.AB}`)), c11 = cell(1, 1, T(lastT));
    const P = panel(stage, W - 400, 30, 384, 300, 'Collect the four products');
    const L1 = lineH(P, T(`(${d.A}-${d.B})(${d.A}${sg}${d.B})`));
    const L2 = lineH(P, T(`=${d.AA}${d.s > 0 ? cR(`+${d.AB}-${d.AB}`) : cR(`-${d.AB}-${d.AB}`)}${lastT}`));
    const L3 = lineH(P, T(`=${d.res}`), 'u4l4-big');
    const L4 = lineH(P, d.s > 0 ? `<span class="u4l4-arr">factor ⟵ ⟶ expand</span>${T(`${d.res}=(${d.A}-${d.B})(${d.A}+${d.B})`)}` : `${T(`(x-5)^2=${d.res}`)}<br><span class="u4l4-no">a perfect square trinomial, not a difference of squares</span>`, 'u4l4-key-line');
    return [
      { cap: `Every term times every term: set up a 2 by 2 grid with ${T(`${cA(d.A)}-${cB(d.B)}`)} down the side and ${T(`${cA(d.A)}${sg}${cB(d.B)}`)} across the top.`,
        run: async (c) => { for (const e of [cA1, cB1, rA, rB]) await pop(c, e, 260); await show(c, L1); } },
      { cap: `Top row: ${T(`${d.A}\\cdot ${d.A}=${d.AA}`)} and ${T(`${d.A}\\cdot(${sg}${d.B})=${midTop}`)}.`,
        run: async (c) => { await pop(c, c00); await pop(c, c01); } },
      { cap: `Bottom row: ${T(`(-${d.B})\\cdot ${d.A}=-${d.AB}`)} and ${T(`(-${d.B})(${sg}${d.B})=${lastT}`)}.`,
        run: async (c) => { await pop(c, c10); await pop(c, c11); await show(c, L2); } },
      d.s > 0
        ? { cap: `The middle terms ${T(`+${d.AB}`)} and ${T(`-${d.AB}`)} are <b>opposites</b>. They add to 0: they cancel.`,
          run: async (c) => { c01.classList.add('u4l4-gc-zero'); c10.classList.add('u4l4-gc-zero'); await Promise.all([pulse(c, c01, 1.06), pulse(c, c10, 1.06)]); c01.classList.add('u4l4-gc-gone'); c10.classList.add('u4l4-gc-gone'); } }
        : { cap: `The middle terms are ${T(`-${d.AB}`)} and ${T(`-${d.AB}`)}: the <b>same</b> sign. They add to ${T(d.mid)}, they don't cancel.`,
          run: async (c) => { c01.classList.add('u4l4-gc-bad'); c10.classList.add('u4l4-gc-bad'); await Promise.all([shake(c, c01), shake(c, c10)]); } },
      { cap: d.s > 0 ? `Only the two squares are left: ${T(d.res)}. Two terms, both perfect squares, <b>subtracted</b>.` : `Three terms: ${T(d.res)}. For the middle terms to cancel, the two brackets need <b>opposite</b> signs.`,
        run: (c) => show(c, L3) },
      { cap: d.s > 0 ? `Read it backwards and it is factoring: ${T(`${d.res}=(${d.A}-${d.B})(${d.A}+${d.B})`)}.` : `${T('(x-5)(x-5)=(x-5)^2')} is a perfect square. Compare: ${T('(x-5)(x+5)=x^2-25')}.`,
        run: (c) => show(c, L4) }
    ];
  }
};

/* =============================== explainer (STAR): cut a square from a square, slide into a rectangle =============================== */
const CS = {
  n73: { label: T('7^2-3^2'), a: 7, b: 3, At: '7', Bt: '3', A2: '49', B2: '9', Dl: '4', Sl: '10', Dd: '7-3=4', Sd: '7+3=10' },
  x3: { label: T('x^2-9'), a: 8, b: 3, draw: 'x=8', At: 'x', Bt: '3', A2: 'x^2', B2: '9', Dl: 'x-3', Sl: 'x+3' },
  e1a: { label: 'Example 1(a) check', a: 15, b: 8, draw: 'x=3', At: '5x', Bt: '8', A2: '25x^2', B2: '64', Dl: '5x-8', Sl: '5x+8' },
  e7: { label: 'Example 7 check: the patio', a: 11, b: 4, draw: 'x=3', At: '2x+5', Bt: 'x+1', A2: '(2x+5)^2', B2: '(x+1)^2', Dl: 'x+4', Sl: '3x+6', Dd: '(2x+5)-(x+1)=x+4', Sd: '(2x+5)+(x+1)=3x+6' }
};
const csChoices = [{ v: 'n73', label: CS.n73.label }, { v: 'x3', label: CS.x3.label }, { sep: 'Check:' }, { v: 'e1a', label: CS.e1a.label }, { v: 'e7', label: CS.e7.label }];
function cutSlideMake(stage, k, ex) {
  const d = CS[k], W = ex.W, PW = W - 390, s = Math.min(300 / d.a, (PW - 140) / (d.a + d.b)), a = d.a * s, b = d.b * s, X0 = 100, Y0 = 72, YB = Y0 + a;
  const pc = (x, y, w, hh, cls) => add(stage, box(h('div', 'u4l4-cs ' + cls, ''), w, hh), x, y);
  const P1 = pc(X0, Y0 + b, a, a - b, 'u4l4-cs-p1'), P2 = pc(X0, Y0, a - b, b, 'u4l4-cs-p2'), Q = pc(X0 + a - b, Y0, b, b, 'u4l4-cs-q');
  const hole = hide(pc(X0 + a - b, Y0, b, b, 'u4l4-cs-hole'));
  const outline = pc(X0, Y0, a, a, 'u4l4-cs-out');
  const cut = hide(pc(X0, Y0 + b - 1.5, a - b, 0, 'u4l4-cs-cut'));
  const sideA = (s0) => T(cA(s0)), sideB = (s0) => T(cB(s0)), sideD = (s0) => T(tc(BR, s0));
  const LAb = lab(stage, X0 + a / 2, YB + 6, sideA(d.At), 'u4l4-side', 's', 0);
  const LAl = lab(stage, X0 - 8, Y0 + a / 2, sideA(d.At), 'u4l4-side', 'w', 0);
  const area = lab(stage, X0 + a / 2, Y0 + a / 2, T(`${d.A2}`), 'u4l4-area');
  // the small square carries its own labels when it is lifted away
  const qTop = h('div', 'u4l4-lab u4l4-side u4l4-qtop', sideB(d.Bt)), qIn = h('div', 'u4l4-lab u4l4-area u4l4-qin', T(d.B2));
  Q.append(qTop, qIn); hide(qTop); hide(qIn);
  const Lleft = hide(lab(stage, X0 + (a - b) / 2 + 4, Y0 + b + (a - b) / 2, T(`${d.A2}-${d.B2}`), 'u4l4-area u4l4-area-l'));
  const P2t = hide(lab(stage, X0 + (a - b) / 2, Y0 - 6, sideD(d.Dl), 'u4l4-side', 'n', 0));
  const P2l = hide(lab(stage, X0 - 8, Y0 + b / 2, sideB(d.Bt), 'u4l4-side', 'w', 0));
  const P1l = hide(lab(stage, X0 - 8, Y0 + b + (a - b) / 2, sideD(d.Dl), 'u4l4-side', 'w', 0));
  const P2b = hide(lab(stage, X0 + a + b / 2, YB + 6, sideB(d.Bt), 'u4l4-side', 's', 0));
  const brace = hide(svgEl('path', { d: `M${X0} ${YB + 42} q0 10 10 10 L${X0 + (a + b) / 2 - 10} ${YB + 52} q10 0 10 10 q0 -10 10 -10 L${X0 + a + b - 10} ${YB + 52} q10 0 10 -10`, fill: 'none', stroke: BR, 'stroke-width': 2.6, 'stroke-linecap': 'round', class: 'bk-stroke' }, mkSvg(stage, W, ex.def.height)));
  const braceL = hide(lab(stage, X0 + (a + b) / 2, YB + 64, `${T(`${cA(d.At.includes('+') ? `(${d.At})` : d.At)}+${cB(d.Bt.includes('+') ? `(${d.Bt})` : d.Bt)}`)}${d.Sd ? ' ' + T('=' + tc(BR, d.Sl)) : ''}`, 'u4l4-side', 's', 0));
  const rectA = hide(lab(stage, X0 + (a + b) / 2, Y0 + b + (a - b) / 2, T(`(${d.Dl})(${d.Sl})`), 'u4l4-area u4l4-area-l'));
  const Pn = panel(stage, W - 372, 22, 356, ex.def.height - 44, 'Area');
  const l1 = lineH(Pn, `<span class="u4l4-pk">square</span>${T(cA(d.A2))}`);
  const l2 = lineH(Pn, `<span class="u4l4-pk">cut out</span>${T('-' + cB(d.B2))}`);
  const l3 = lineH(Pn, `<span class="u4l4-pk">left</span>${T(`${d.A2}-${d.B2}`)}`, 'u4l4-big');
  const l4 = d.Dd ? lineH(Pn, `<span class="u4l4-pk">sides</span>${T(d.Dd)}<br>${T(d.Sd)}`, 'u4l4-sm') : null;
  const l5 = lineH(Pn, `<span class="u4l4-pk">rectangle</span>${T(`(${d.Dl})(${d.Sl})`)}`, 'u4l4-big');
  const fin = k === 'n73' ? lineH(Pn, `${T('49-9=40')}<br>${T('4\\times10=40\\ \\checkmark')}`, 'u4l4-key-line')
    : k === 'e7' ? lineH(Pn, `${T('(x+4)(3x+6)')}<br>${T('=3(x+4)(x+2)')}`, 'u4l4-key-line')
    : lineH(Pn, T(`${d.A2}-${d.B2}=(${d.Dl})(${d.Sl})`), 'u4l4-key-line');
  const at3 = k === 'e7' ? lineH(Pn, `${T('x=3')}: ${T('7\\times15=105')} m²<br><span class="u4l4-sm2">check: ${T('11^2-4^2=121-16=105')}</span>`, 'u4l4-sm') : null;
  const drawn = d.draw ? ` <span class="u4l4-muted">(drawn with ${T(d.draw)})</span>` : '';
  const c0 = [X0 + (a - b) / 2, Y0 + b / 2], c1 = [X0 + a + b / 2, Y0 + b + (a - b) / 2];
  const steps = [
    { cap: `A square with side ${T(cA(d.At))}: its area is ${T(cA(d.A2))}.${drawn}`, run: async (c) => { await pulse(c, outline, 1.03); await show(c, l1); } },
    { cap: `Cut a square with side ${T(cB(d.Bt))} out of the corner. The area left is ${T(`${d.A2}-${d.B2}`)}.`,
      run: async (c) => {
        Q.classList.add('u4l4-cs-qon'); hole.style.opacity = 1; await Promise.all([show(c, qTop), show(c, qIn)]);
        area.style.opacity = 0; outline.style.opacity = 0;
        await anim(c, Q, [{ transform: 'translate(0px, 0px)' }, { transform: `translate(${b + 24}px, -20px)` }], 700);
        await show(c, Lleft); await show(c, l2); await show(c, l3);
      } },
    { cap: `Cut the L shape along the dashed line into two rectangles. The top piece is ${T(tc(BR, d.Dl))} wide${d.Dd ? `, since ${T(d.Dd)}` : ''}, and ${T(cB(d.Bt))} tall.`,
      run: async (c) => {
        cut.style.opacity = 1; await anim(c, cut, [{ width: '0px' }, { width: (a - b) + 'px' }], 600);
        Lleft.style.opacity = 0; P1.classList.add('u4l4-cs-cutp'); P2.classList.add('u4l4-cs-cutp', 'u4l4-cs-mv');
        LAl.style.opacity = 0; await Promise.all([show(c, P2t), show(c, P2l), show(c, P1l)]); if (l4) await show(c, l4);
      } },
    { cap: `Turn the top piece a quarter turn and slide it to the right end. Both pieces are ${T(tc(BR, d.Dl))} tall, so they fit.`,
      run: async (c) => {
        P2t.style.opacity = 0; P2l.style.opacity = 0; cut.style.opacity = 0;
        await anim(c, P2, [{ transform: 'translate(0px, 0px) rotate(0deg)' }, { transform: `translate(${c1[0] - c0[0]}px, ${c1[1] - c0[1]}px) rotate(90deg)` }], 1300);
        await show(c, P2b);
      } },
    { cap: `A rectangle! It is ${T(tc(BR, d.Dl))} tall and ${T(cA(d.At.includes('+') ? `(${d.At})` : d.At) + '+' + cB(d.Bt.includes('+') ? `(${d.Bt})` : d.Bt))}${d.Sd ? ` ${T('=' + tc(BR, d.Sl))}` : ''} long. Same area: ${T(`${d.A2}-${d.B2}=(${d.Dl})(${d.Sl})`)}.`,
      run: async (c) => { brace.style.opacity = 1; await drawIn(brace, 500, c); await pop(c, braceL); await show(c, rectA); await show(c, l5); } },
    { cap: k === 'n73' ? `Check with numbers: ${T('49-9=40')} and ${T('4\\times10=40')}. A square minus a square is a rectangle.`
      : k === 'e7' ? `Simplify: ${T('3x+6=3(x+2)')} has a common factor, so the area is ${T('3(x+4)(x+2)')}.`
      : `That is the pattern: ${T(`${cA('A')}^2-${cB('B')}^2=(${cA('A')}-${cB('B')})(${cA('A')}+${cB('B')})`)} with ${T(`A=${d.At}`)}, ${T(`B=${d.Bt}`)}.`,
      run: (c) => show(c, fin) }
  ];
  if (at3) steps.push({ cap: `When ${T('x=3')} (the picture): the rectangle is ${T('7')} by ${T('15')}, so the area is ${T('3(7)(5)=105')} m². Check: ${T('11^2-4^2=121-16=105')}.`, run: (c) => show(c, at3) });
  return steps;
}
const csAsk = (k) => (k === 'e7' ? `<b>Example 7:</b> the patio, ${T('(2x+5)^2-(x+1)^2')}.` : k === 'e1a' ? `<b>Example 1(a):</b> ${T('25x^2-64')}.` : `Show ${T(`${CS[k].A2}-${CS[k].B2}`)} as a rectangle.`);
const cutSlide = { title: 'A square cut from a square, slid into a rectangle', height: 480, minW: 920, capH: 92, choices: csChoices, ask: csAsk, make: cutSlideMake };
const cutSlide2 = Object.assign({}, cutSlide, { value: 'e7' });

/* =============================== explainer: a sum of squares does not factor =============================== */
const SN = { n36: { label: T('x^2+36'), n: 36 }, n49: { label: T('x^2+49'), n: 49 } };
const sumNo = {
  title: 'Product +n and sum 0: the hunt that always fails',
  height: 410, minW: 900,
  choices: Object.keys(SN).map((k) => ({ v: k, label: SN[k].label + ' vs ' + SN[k].label.replace('+', '−') })),
  ask: (k) => `Can ${T(`x^2+${SN[k].n}`)} be factored? What about ${T(`x^2-${SN[k].n}`)}?`,
  make(stage, k, ex) {
    const n = SN[k].n, W = ex.W, r = Math.round(Math.sqrt(n)), prs = [];
    for (let d = 1; d * d <= n; d++) if (n % d === 0) prs.push([d, n / d]);
    const LW = 540, L = panel(stage, 14, 14, LW, 382, ''), R = panel(stage, LW + 30, 14, W - LW - 44, 382, '');
    L.innerHTML = `<div class="u4l4-ph2">${T(`x^2+${n}`)}</div><div class="u4l4-need">need: product ${T('+' + n)}, sum ${T('0')}</div>`;
    R.innerHTML = `<div class="u4l4-ph2">${T(`x^2-${n}`)}</div><div class="u4l4-need">need: product ${T('-' + n)}, sum ${T('0')}</div>`;
    const cols = h('div', 'u4l4-sncols'); L.appendChild(cols);
    const colP = h('div', 'u4l4-sncol'), colN = h('div', 'u4l4-sncol'); cols.append(colP, colN);
    colP.innerHTML = '<div class="u4l4-snh">both positive</div>'; colN.innerHTML = '<div class="u4l4-snh">both negative</div>';
    const row = (host, p, q) => { const e = h('div', 'u4l4-snr', `${T(`${p}\\times${q < 0 ? `(${q})` : q}`)}<span class="u4l4-snsum">sum ${T(String(p + q))}</span>`); host.appendChild(e); return hide(e); };
    const rp = prs.map(([p, q]) => row(colP, p, q)), rn = prs.map(([p, q]) => row(colN, -p, -q));
    [colP, colN].forEach((cc) => hide(cc.firstChild));
    const verdict = hide(h('div', 'u4l4-snv', `Sum 0 needs opposites: ${T(`(-${r})(${r})=-${n}`)}, never ${T('+' + n)}.`)); L.appendChild(verdict);
    const st = hide(stamp(stage, 'does not factor', { ok: false, x: LW - 200, y: 336, rotate: -8 }));
    const cR2 = h('div', 'u4l4-sncol u4l4-sncol1'); R.appendChild(cR2);
    const rr = prs.map(([p, q]) => { const e = h('div', 'u4l4-snr', `${T(`(-${p})\\times${q}`)}<span class="u4l4-snsum">sum ${T(String(q - p))}</span>`); cR2.appendChild(e); return hide(e); });
    const win = rr[rr.length - 1];
    const res = hide(h('div', 'u4l4-snres', T(`x^2-${n}=(x-${r})(x+${r})`))); R.appendChild(res);
    hide(R);
    return [
      { cap: `Factor ${T(`x^2+${n}`)} like ${T('x^2+bx+c')}. There is no ${T('x')} term, so ${T('b=0')}: we need two numbers with <b>product ${T('+' + n)}</b> and <b>sum 0</b>.`, run: (c) => pulse(c, L.querySelector('.u4l4-need'), 1.05) },
      { cap: `Both positive: every sum is positive.`, run: async (c) => { await show(c, colP.firstChild); for (const e of rp) await show(c, e); } },
      { cap: `Both negative: every sum is negative.`, run: async (c) => { await show(c, colN.firstChild); for (const e of rn) await show(c, e); } },
      { cap: `A sum of 0 needs <b>opposites</b>, like ${T(`-${r}`)} and ${T(String(r))}. But opposites multiply to a <b>negative</b>. Nothing works: ${T(`x^2+${n}`)} <b>does not factor</b>.`,
        run: async (c) => { await show(c, verdict); st.style.opacity = 1; await stampIn(c, st); } },
      { cap: `Now ${T(`x^2-${n}`)}: we need product ${T('-' + n)} and sum 0. One number is negative and one is positive.`,
        run: async (c) => { await show(c, R); for (const e of rr) await show(c, e); } },
      { cap: `${T(`-${r}`)} and ${T(String(r))}: product ${T('-' + n)}, sum 0. So ${T(`x^2-${n}=(x-${r})(x+${r})`)}: the <b>difference</b> of squares factors, the <b>sum</b> does not.`,
        run: async (c) => { win.classList.add('u4l4-snr-win'); await pulse(c, win, 1.06); await show(c, res); } }
    ];
  }
};

/* =============================== explainer: is it a difference of squares? =============================== */
const DT = {
  a: { e: '25x^2-64', t1: '25x^2', t2: '64', op: '-', A: '5x', B: '8', r1: '(5x)^2', r2: '8^2' },
  b: { e: '49a^2-81b^2', t1: '49a^2', t2: '81b^2', op: '-', A: '7a', B: '9b', r1: '(7a)^2', r2: '(9b)^2' },
  c: { e: '100m^2n^2-9p^2', t1: '100m^2n^2', t2: '9p^2', op: '-', A: '10mn', B: '3p', r1: '(10mn)^2', r2: '(3p)^2' },
  d: { e: 'x^2+36', t1: 'x^2', t2: '36', op: '+', A: 'x', B: '6', r1: 'x^2', r2: '6^2' },
  e: { e: '-y^2+4x^2', re: '4x^2-y^2', t1: '4x^2', t2: 'y^2', op: '-', A: '2x', B: 'y', r1: '(2x)^2', r2: 'y^2' },
  f: { e: '1-\\sin^2x', t1: '1', t2: '\\sin^2x', op: '-', A: '1', B: '\\sin x', r1: '1^2', r2: '(\\sin x)^2' }
};
const dosTest = {
  title: 'Three checks, then square-root each term',
  height: 400, minW: 900,
  choices: [{ sep: 'Example 1' }, ...Object.keys(DT).map((k) => ({ v: k, label: `(${k}) ` + T(DT[k].e) }))],
  ask: (k) => `<b>Example 1(${k}):</b> factor ${T(DT[k].e)}, if possible.`,
  make(stage, k, ex) {
    const d = DT[k], W = ex.W, LW = W - 380, x1 = LW * 0.27, x2 = LW * 0.73, xo = LW * 0.5, Y = d.re ? 92 : 50;
    const orig = d.re ? lab(stage, LW / 2, 30, T(d.e), 'u4l4-dt-orig') : null;
    const t1 = lab(stage, x1, Y, T(d.t1), 'u4l4-dt-term u4l4-dt-a'), t2 = lab(stage, x2, Y, T(d.t2), 'u4l4-dt-term u4l4-dt-b'), op = lab(stage, xo, Y, T(d.op === '-' ? '-' : '+'), 'u4l4-dt-op');
    if (d.re) [t1, t2, op].forEach(hide);
    const ar1 = hide(lab(stage, x1, Y + 62, '↓ √', 'u4l4-dt-arr')), ar2 = hide(lab(stage, x2, Y + 62, '↓ √', 'u4l4-dt-arr'));
    const r1 = hide(lab(stage, x1, Y + 118, T(`=${d.r1}`), 'u4l4-dt-root')), r2 = hide(lab(stage, x2, Y + 118, T(`=${d.r2}`), 'u4l4-dt-root'));
    const pA = hide(lab(stage, x1, Y + 178, T(`A=${d.A}`), 'u4l4-pill u4l4-pill-a')), pB = hide(lab(stage, x2, Y + 178, T(`B=${d.B}`), 'u4l4-pill u4l4-pill-b'));
    const ans = hide(lab(stage, LW / 2, Y + 258, T(`${d.re || d.e}=(${cA(d.A)}-${cB(d.B)})(${cA(d.A)}+${cB(d.B)})`), 'u4l4-dt-ans'));
    const P = panel(stage, W - 362, 26, 346, 300, 'Difference of squares?');
    const ck = (txt) => { const r = h('div', 'u4l4-ck-row', `<span class="u4l4-ck-box"></span><span>${txt}</span>`); P.appendChild(r); return r; };
    const k1 = ck('Two terms?'), k2 = ck('Both perfect squares?'), k3 = ck('Subtracted?');
    const mark = async (c, r, ok) => { const bx = r.firstChild; bx.textContent = ok ? '✓' : '✗'; r.classList.add(ok ? 'u4l4-ck-ok' : 'u4l4-ck-no'); await pop(c, bx); };
    const st = d.op === '+' ? hide(stamp(stage, 'does not factor', { ok: false, x: LW / 2 - 110, y: Y + 238, rotate: -6 })) : null;
    const steps = [];
    if (d.re) steps.push({ cap: `The negative term comes first. <b>Reorder</b> so the positive term leads: ${T(`${d.e}=${d.re}`)}.`,
      run: async (c) => { orig.classList.add('u4l4-dt-orig-dim'); for (const e of [t1, op, t2]) await show(c, e); } });
    steps.push({ cap: `Two terms? <b>Yes</b>: ${T(d.t1)} and ${T(d.t2)}.`, run: async (c) => { await Promise.all([pulse(c, t1, 1.08), pulse(c, t2, 1.08)]); await mark(c, k1, true); } });
    steps.push({ cap: `Both perfect squares? Take the square root of each: ${T(`${d.t1}=${d.r1}`)} and ${T(`${d.t2}=${d.r2}`)}. <b>Yes</b>.`,
      run: async (c) => { await Promise.all([show(c, ar1), show(c, ar2)]); await Promise.all([show(c, r1), show(c, r2)]); await Promise.all([pop(c, pA), pop(c, pB)]); await mark(c, k2, true); } });
    if (d.op === '+') {
      steps.push({ cap: `Subtracted? <b>No</b>: there is a plus sign. ${T(d.e)} is a <b>sum</b> of squares, and it <b>does not factor</b>.`,
        run: async (c) => { op.classList.add('u4l4-dt-op-bad'); await shake(c, op); await mark(c, k3, false); st.style.opacity = 1; await stampIn(c, st); } });
    } else {
      steps.push({ cap: `Subtracted? <b>Yes</b>: a minus sign between them. It is a difference of squares.`, run: async (c) => { await pulse(c, op, 1.3); await mark(c, k3, true); } });
      steps.push({ cap: `${T(`A=${d.A}`)} and ${T(`B=${d.B}`)}, so ${T(`${d.re || d.e}=(${d.A}-${d.B})(${d.A}+${d.B})`)}.`, run: (c) => show(c, ans) });
    }
    return steps;
  }
};

/* =============================== explainer: GCF first (coefficients as dot arrays) =============================== */
const GF = {
  a: { e: '12x^2-27y^2', c: [12, 27], g: 3, k: [2, 3], ts: ['12x^2', '-27y^2'], gT: '3', inT: '4x^2-9y^2', inF: '(2x-3y)(2x+3y)', ans: '3(2x-3y)(2x+3y)' },
  b: { e: '5a^3b-45ab^3', c: [5, 45], g: 5, k: [1, 3], ts: ['5a^3b', '-45ab^3'], gT: '5ab', inT: 'a^2-9b^2', inF: '(a-3b)(a+3b)', ans: '5ab(a-3b)(a+3b)', vn: true },
  c: { e: '8x^2+50', c: [8, 50], g: 2, k: [2, 5], ts: ['8x^2', '+50'], gT: '2', inT: '4x^2+25', ans: '2(4x^2+25)', sum: true },
  d: { e: '-18x^2+8', c: [-18, 8], g: -2, k: [3, 2], ts: ['-18x^2', '+8'], gT: '-2', inT: '9x^2-4', inF: '(3x-2)(3x+2)', ans: '-2(3x-2)(3x+2)', alt: '2(2-3x)(2+3x)' }
};
const gcfFirst = {
  title: 'Not squares? Look for a common factor first',
  height: 430, minW: 920, capH: 92,
  choices: [{ sep: 'Example 2' }, ...Object.keys(GF).map((k) => ({ v: k, label: `(${k}) ` + T(GF[k].e) }))],
  ask: (k) => `<b>Example 2(${k}):</b> factor ${T(GF[k].e)} fully.`,
  make(stage, k, ex) {
    const d = GF[k], W = ex.W, LW = W - 380, G = Math.abs(d.g), pt = 15, rad = 5.4, gap = 16, svg = mkSvg(stage, W, ex.def.height);
    const cols = [LW * 0.26, LW * 0.74], DY = 112;
    const groups = d.c.map((cv, i) => {
      const n = Math.abs(cv), neg = cv < 0, kk = d.k[i];
      let rr = 1; for (let q = 1; q * q <= n; q++) if (n % q === 0) rr = q;
      const cc = n / rr, rW = cc * pt, rH = rr * pt, cx = cols[i];
      const gw = kk * pt, totW = G * gw + (G - 1) * gap;
      const dots = [], outl = [];
      for (let j = 0; j < n; j++) {
        const x0 = cx - rW / 2 + (j % cc + 0.5) * pt, y0 = DY + (Math.floor(j / cc) + 0.5) * pt;
        const gi = Math.floor(j / (kk * kk)), m = j % (kk * kk);
        const x1 = cx - totW / 2 + gi * (gw + gap) + (m % kk + 0.5) * pt, y1 = DY + (Math.floor(m / kk) + 0.5) * pt;
        const dot = svgEl('circle', { cx: x0, cy: y0, r: rad, fill: neg ? RED : '#3a4254' }, svg); dots.push({ dot, x0, y0, x1, y1, gi });
      }
      for (let gi = 0; gi < G; gi++) outl.push(hide(svgEl('rect', { x: cx - totW / 2 + gi * (gw + gap) - 4, y: DY - 4, width: gw + 8, height: gw + 8, rx: 6, fill: 'none', stroke: i ? CB : CA, 'stroke-width': 2.5 }, svg)));
      const term = lab(stage, cx, 50, T(d.ts[i]), 'u4l4-gf-term');
      const tag = hide(lab(stage, cx, DY + Math.max(rH, gw) + 14, `${n} is <b>not</b> a perfect square`, 'u4l4-gf-tag u4l4-gf-no', 's', 0));
      const tag2 = hide(lab(stage, cx, DY + Math.max(rH, gw) + 14, `${T(`${n}=${G}\\times${kk * kk}`)}: ${G} squares of ${kk * kk}`, 'u4l4-gf-tag', 's', 0));
      return { dots, outl, term, tag, tag2, n, kk };
    });
    const P = panel(stage, W - 362, 22, 346, ex.def.height - 44, 'Factor fully');
    const L0 = line(P, T(d.e));
    const L1 = lineH(P, T(`=${d.gT}(${d.inT})`), 'u4l4-big');
    const L2 = lineH(P, d.sum ? `<span class="u4l4-no">${T('4x^2+25')}: a sum, it stays</span>` : T(`=${d.ans}`), d.sum ? '' : 'u4l4-big u4l4-key-line');
    const L3 = d.alt ? lineH(P, `<span class="u4l4-pk">or</span>${T('2(4-9x^2)')}<br>${T(`=${d.alt}`)}`) : null;
    const keep = groups.map((gq) => gq.dots.filter((o) => o.gi === 0));
    const regroup = (c) => tween(c, 1100, (t) => groups.forEach((gq) => gq.dots.forEach((o) => { o.dot.setAttribute('cx', (o.x0 + (o.x1 - o.x0) * t).toFixed(2)); o.dot.setAttribute('cy', (o.y0 + (o.y1 - o.y0) * t).toFixed(2)); })));
    const [n1, n2] = groups.map((q) => q.n), [s1, s2] = groups.map((q) => q.kk * q.kk);
    const first = k === 'd' ? `The first term is <b>negative</b>, and ${n1} and ${n2} are not perfect squares.` : `Are ${n1} and ${n2} perfect squares? <b>No</b>: ${n1} dots and ${n2} dots don't make squares.`;
    const steps = [
      { cap: first, run: async (c) => { await Promise.all(groups.map((q) => show(c, q.tag))); } },
      { cap: `But ${T(`${n1}=${G}\\times${s1}`)} and ${T(`${n2}=${G}\\times${s2}`)}: each is <b>${G} squares</b>.${d.vn ? ` The letters share ${T('ab')} too: ${T('a^3b=ab\\cdot a^2')}, ${T('ab^3=ab\\cdot b^2')}.` : ''}`,
        run: async (c) => { groups.forEach((q) => { q.tag.style.opacity = 0; }); await regroup(c); await Promise.all(groups.flatMap((q) => q.outl.map((o) => appear(c, o, 300)))); await Promise.all(groups.map((q) => show(c, q.tag2))); } },
      { cap: k === 'd' ? `Take out ${T('-2')} (<b>negative</b>, because the first term is negative). One copy of each is left: ${T('9x^2')} and ${T('4')}, perfect squares. ${T('-18x^2+8=-2(9x^2-4)')}.`
          : `Take out the GCF ${T(d.gT)}. One copy of each is left: ${T(d.inT.split(/[-+]/)[0])} and ${T(d.inT.split(/[-+]/)[1])}, perfect squares. ${T(`${d.e}=${d.gT}(${d.inT})`)}.`,
        run: async (c) => {
          const rest = groups.flatMap((q) => q.dots.filter((o) => o.gi > 0).map((o) => o.dot).concat(q.outl.slice(1)));
          await Promise.all(rest.map((e) => anim(c, e, [{ opacity: 1 }, { opacity: 0.12 }], 400)));
          keep.flat().forEach((o) => o.dot.setAttribute('fill', '#3a4254'));
          await show(c, L1);
        } },
      d.sum
        ? { cap: `Inside is ${T('4x^2+25')}: a <b>sum</b> of squares. It does not factor, so ${T('2(4x^2+25)')} is fully factored.`, run: (c) => show(c, L2) }
        : { cap: `Inside is a difference of squares: ${T(`${d.inT}=${d.inF}`)}. So ${T(`${d.e}=${d.ans}`)}.`, run: (c) => show(c, L2) }
    ];
    if (d.alt) steps.push({ cap: `Or take out ${T('+2')} and write the positive term first: ${T(`2(4-9x^2)=${d.alt}`)}. Both answers are correct.`, run: (c) => show(c, L3) });
    return steps;
  }
};

/* =============================== explainer: dimensions from a factored area (the banner) =============================== */
const BN = {
  c4: { label: T('4x^2-9y^2'), a: 2, b: 3, P: 40, k: 4, unit: 'm', what: 'rug' },
  e3: { label: 'Example 3 check', a: 6, b: 5, P: 96, k: 3, unit: 'cm', what: 'banner' }
};
const banner = {
  title: 'Area → length and width → perimeter',
  height: 430, minW: 920, capH: 92,
  choices: [{ v: 'c4', label: BN.c4.label }, { sep: 'Check:' }, { v: 'e3', label: BN.e3.label }],
  ask: (k) => { const d = BN[k]; return `${k === 'e3' ? '<b>Example 3:</b> a' : 'A'} rectangle has area ${T(`${d.a * d.a}x^2-${d.b * d.b}y^2`)}, perimeter ${d.P} ${d.unit}, and its length is ${d.k} times its width. Find its dimensions.`; },
  make(stage, k, ex) {
    const d = BN[k], W = ex.W, a = d.a, b = d.b, x0 = d.P / (4 * a), ax = a * x0, y0 = (ax * (d.k - 1)) / (b * (d.k + 1)), by = b * y0, Lv = ax + by, Wv = ax - by;
    const aT = a === 1 ? '' : a, LT = `${aT}x+${b}y`, WT = `${aT}x-${b}y`;
    const RX = 140, RY = 70, w0 = 400, h0 = 190, w1 = 400, h1 = 400 * Wv / Lv;
    const svg = mkSvg(stage, W, ex.def.height);
    const rect = svgEl('rect', { x: RX, y: RY, width: w0, height: h0, fill: '#fbeef2', stroke: CA, 'stroke-width': 3, rx: 4 }, svg);
    const tr = hide(svgEl('path', { d: `M${RX} ${RY} h${w0} v${h0} h${-w0} Z`, fill: 'none', stroke: CB, 'stroke-width': 7, 'stroke-linejoin': 'round', class: 'bk-stroke', opacity: 0.85 }, svg));
    const areaL = lab(stage, RX + w0 / 2, RY + h0 / 2, T(`${a * a}x^2-${b * b}y^2`), 'u4l4-area');
    const Ll = hide(lab(stage, RX + w0 / 2, RY - 8, T(cA(LT)), 'u4l4-side', 'n', 0)), Wl = hide(lab(stage, RX - 8, RY + h0 / 2, T(cB(WT)), 'u4l4-side', 'w', 0));
    const P = panel(stage, W - 392, 18, 376, ex.def.height - 36, '');
    const ln = (s, cls = '') => lineH(P, s, cls);
    const L1 = ln(T(`${a * a}x^2-${b * b}y^2=(${LT})(${WT})`));
    const L2 = ln(`${T(`2(${LT})+2(${WT})`)}<br>${T(`=${2 * a}x${cR(`+${2 * b}y`)}+${2 * a}x${cR(`-${2 * b}y`)}=${4 * a}x`)}`, 'u4l4-sm');
    const L3 = ln(T(`${4 * a}x=${d.P}\\ \\Rightarrow\\ x=${nf(x0)}`), 'u4l4-key-line');
    const L4 = ln(`${T(`${ax}+${b}y=${d.k}(${ax}-${b}y)`)}<br>${T(`${ax}+${b}y=${d.k * ax}-${d.k * b}y`)}<br>${T(`${b * (d.k + 1)}y=${ax * (d.k - 1)}\\ \\Rightarrow\\ y=${nf(y0)}`)}`, 'u4l4-sm');
    const L5 = ln(T(`${ax}+${nf(by)}=${nf(Lv)},\\quad ${ax}-${nf(by)}=${nf(Wv)}`), 'u4l4-key-line');
    const L6 = ln(`<span class="u4l4-pk">check</span>${T(`${nf(Lv)}\\times${nf(Wv)}=${nf(Lv * Wv)}`)}<br>${T(`${a * a}(${nf(x0 * x0)})-${b * b}(${nf(y0 * y0)})=${nf(a * a * x0 * x0)}-${nf(b * b * y0 * y0)}=${nf(Lv * Wv)}`)}`, 'u4l4-sm');
    const toScale = (c) => tween(c, 900, (t) => {
      const w = w0 + (w1 - w0) * t, hh = h0 + (h1 - h0) * t; rect.setAttribute('width', w); rect.setAttribute('height', hh);
      place(Ll, RX + w / 2, RY - 8, 'n', 0); place(Wl, RX - 8, RY + hh / 2, 'w', 0); place(areaL, RX + w / 2, RY + hh / 2, 'c', 0);
    });
    return [
      { cap: `Factor the area: ${T(`(${LT})(${WT})`)}. With ${T('x,y>0')} the <b>longer</b> side is ${T(LT)}: that is the length.`,
        run: async (c) => { await show(c, L1); await Promise.all([pop(c, Ll), pop(c, Wl)]); } },
      { cap: `Perimeter: go all the way round, two lengths and two widths. The ${T(`+${2 * b}y`)} and ${T(`-${2 * b}y`)} <b>cancel</b>, leaving ${T(`${4 * a}x`)}.`,
        run: async (c) => { tr.style.opacity = 0.85; await drawIn(tr, 1200, c); await show(c, L2); } },
      { cap: `${T(`${4 * a}x=${d.P}`)}, so ${T(`x=${nf(x0)}`)}. Now the length is ${T(`${ax}+${b}y`)} and the width is ${T(`${ax}-${b}y`)}.`,
        run: async (c) => { tr.style.opacity = 0; await show(c, L3); Ll.innerHTML = T(cA(`${ax}+${b}y`)); Wl.innerHTML = T(cB(`${ax}-${b}y`)); await Promise.all([pulse(c, Ll, 1.1), pulse(c, Wl, 1.1)]); } },
      { cap: `“The length is ${d.k} times the width”: ${T(`${ax}+${b}y=${d.k}(${ax}-${b}y)`)}. Solve: ${T(`y=${nf(y0)}`)}.`, run: (c) => show(c, L4) },
      { cap: `Length ${T(`${ax}+${nf(by)}=${nf(Lv)}`)} ${d.unit}, width ${T(`${ax}-${nf(by)}=${nf(Wv)}`)} ${d.unit}. Drawn to scale, the length really is ${d.k} times the width.`,
        run: async (c) => { areaL.style.opacity = 0; await toScale(c); Ll.innerHTML = T(cA(`${nf(Lv)}\\text{ ${d.unit}}`)); Wl.innerHTML = T(cB(`${nf(Wv)}\\text{ ${d.unit}}`)); await show(c, L5); } },
      { cap: `Check the area both ways: ${T(`${nf(Lv)}\\times${nf(Wv)}=${nf(Lv * Wv)}`)}, and the original expression with ${T(`x=${nf(x0)}`)}, ${T(`y=${nf(y0)}`)} gives ${T(nf(Lv * Wv))} too.`, run: (c) => show(c, L6) }
    ];
  }
};

/* =============================== explainer: fractions and decimals that are squares =============================== */
const FS = {
  q: { label: T('\\tfrac14x^2'), single: { t: '\\dfrac{1}{4}x^2', parts: [['1', '1'], ['4', '2'], ['x^2', 'x']], root: '\\dfrac{1}{2}x' }, chk: '\\left(\\tfrac12x\\right)^2=\\tfrac12\\cdot\\tfrac12\\cdot x\\cdot x=\\tfrac14x^2' },
  y25: { label: T('\\tfrac{y^2}{25}'), single: { t: '\\dfrac{y^2}{25}', parts: [['y^2', 'y'], ['25', '5']], root: '\\dfrac{y}{5}' }, chk: '\\left(\\dfrac{y}{5}\\right)^2=\\dfrac{y\\cdot y}{5\\cdot5}=\\dfrac{y^2}{25}' },
  dec: { label: T('0.09'), single: { t: '0.09', dec: '\\dfrac{9}{100}', parts: [['9', '3'], ['100', '10']], root: '0.3' }, chk: '0.3\\times0.3=0.09' },
  e4a: { label: '(a)', ex: 'a', terms: [{ t: '\\dfrac{1}{4}x^2', parts: [['1', '1'], ['4', '2'], ['x^2', 'x']], root: '\\dfrac{1}{2}x' }, { t: '9', parts: [['9', '3']], root: '3' }], ans: '\\left(\\tfrac{1}{2}x-3\\right)\\left(\\tfrac{1}{2}x+3\\right)' },
  e4a2: { label: '(a) way 2', ex: 'a', way2: true },
  e4b: { label: '(b)', ex: 'b', terms: [{ t: '\\dfrac{x^2}{16}', parts: [['x^2', 'x'], ['16', '4']], root: '\\dfrac{x}{4}' }, { t: '\\dfrac{y^2}{25}', parts: [['y^2', 'y'], ['25', '5']], root: '\\dfrac{y}{5}' }], ans: '\\left(\\dfrac{x}{4}-\\dfrac{y}{5}\\right)\\left(\\dfrac{x}{4}+\\dfrac{y}{5}\\right)' },
  e4c: { label: '(c)', ex: 'c', terms: [{ t: '0.09a^2', dec: '\\dfrac{9}{100}a^2', parts: [['9', '3'], ['100', '10'], ['a^2', 'a']], root: '0.3a' }, { t: '0.49', dec: '\\dfrac{49}{100}', parts: [['49', '7'], ['100', '10']], root: '0.7' }], ans: '(0.3a-0.7)(0.3a+0.7)' }
};
const FSE = { a: '\\dfrac{1}{4}x^2-9', b: '\\dfrac{x^2}{16}-\\dfrac{y^2}{25}', c: '0.09a^2-0.49' };
const fracSquares = {
  title: 'Square roots of fractions and decimals',
  height: 470, minW: 900,
  choices: [{ v: 'q', label: FS.q.label }, { v: 'y25', label: FS.y25.label }, { v: 'dec', label: FS.dec.label }, { sep: 'Example 4' }, ...['e4a', 'e4a2', 'e4b', 'e4c'].map((k) => ({ v: k, label: FS[k].label }))],
  ask: (k) => (FS[k].ex ? `<b>Example 4(${FS[k].ex}):</b> factor ${T(FSE[FS[k].ex])} fully${FS[k].way2 ? ', taking out a fraction first' : ''}.` : `Is ${T(FS[k].single.t)} a perfect square?`),
  make(stage, k, ex) {
    const d = FS[k], W = ex.W;
    const column = (tm, cx, col, name) => {
      const o = {};
      o.t = lab(stage, cx, 62, T(tm.t), 'u4l4-fs-term');
      o.dec = tm.dec ? hide(lab(stage, cx, 132, T('=' + tm.dec), 'u4l4-fs-dec')) : null;
      const row = h('div', 'u4l4-fs-parts'); tm.parts.forEach(([p, r]) => row.appendChild(h('span', 'u4l4-fs-chip', T(`\\sqrt{${p}}=${r}`)))); stage.appendChild(row); place(row, cx, 198, 'c', 0); o.parts = [...row.children].map(hide);
      o.root = hide(lab(stage, cx, 272, T(`=${tc(col, `\\left(${tm.root}\\right)`)}^2`), 'u4l4-fs-root'));
      o.name = name ? hide(lab(stage, cx, 346, T(`${name}=${tm.root}`), `u4l4-pill ${name === 'A' ? 'u4l4-pill-a' : 'u4l4-pill-b'}`)) : null;
      o.run = async (c) => { if (o.dec) await show(c, o.dec); for (const e of o.parts) await pop(c, e, 300); await show(c, o.root); if (o.name) await pop(c, o.name); };
      return o;
    };
    if (d.single) {
      const o = column(d.single, W * 0.34, CA, null);
      const P = panel(stage, W - 380, 60, 360, 250, 'Check by squaring'), L = lineH(P, T(d.chk), 'u4l4-big');
      return [
        { cap: d.single.dec ? `Write the decimal as a fraction first: ${T(`0.09=${d.single.dec}`)} (nine <b>hundredths</b>).` : `A fraction is a perfect square when its <b>top and bottom</b> are both perfect squares.`, run: async (c) => { if (o.dec) await show(c, o.dec); else await pulse(c, o.t, 1.08); } },
        { cap: `Take the square root of each piece: ${d.single.parts.map(([p, r]) => T(`\\sqrt{${p}}=${r}`)).join(', ')}.`, run: async (c) => { for (const e of o.parts) await pop(c, e, 300); } },
        { cap: `So ${T(`${d.single.t}=\\left(${d.single.root}\\right)^2`)}. It <b>is</b> a perfect square.`, run: (c) => show(c, o.root) },
        { cap: `Check by squaring: ${T(d.chk)} ✓`, run: (c) => show(c, L) }
      ];
    }
    if (d.way2) {
      const X = W / 2, ys = [36, 100, 164, 240, 316];
      const l1 = lab(stage, X, ys[0], T('\\tfrac{1}{4}x^2-9'), 'u4l4-fs-line');
      const l2 = hide(lab(stage, X, ys[1], T('=\\tfrac{1}{4}(x^2-36)'), 'u4l4-fs-line'));
      const q4 = h('span', 'u4l4-fs-q', T('\\tfrac{1}{4}'));
      const l3 = hide(lab(stage, X, ys[2], '', 'u4l4-fs-line')); l3.append(h('span', '', T('=')), q4, h('span', '', T('(x-6)(x+6)')));
      const hA = h('span', 'u4l4-fs-h', T('\\tfrac{1}{2}')), hB = h('span', 'u4l4-fs-h', T('\\tfrac{1}{2}'));
      const l4 = hide(lab(stage, X, ys[3], '', 'u4l4-fs-line')); l4.append(h('span', '', T('=\\Big[')), hA, h('span', '', T('(x-6)\\Big]\\Big[')), hB, h('span', '', T('(x+6)\\Big]')));
      [hA, hB].forEach(hide);
      const l5 = hide(lab(stage, X, ys[4], T('=\\left(\\tfrac{1}{2}x-3\\right)\\left(\\tfrac{1}{2}x+3\\right)'), 'u4l4-fs-line u4l4-fs-fin'));
      const note = hide(lab(stage, X, 382, `the same factors as way 1 ${T('\\checkmark')}`, 'u4l4-fs-note'));
      return [
        { cap: `Way 2: take out the fraction ${T('\\tfrac14')} first. Inside, ${T('9\\div\\tfrac14=36')}: ${T('\\tfrac14x^2-9=\\tfrac14(x^2-36)')}.`, run: async (c) => { await pulse(c, l1, 1.05); await show(c, l2); } },
        { cap: `Inside is a difference of squares: ${T('x^2-36=(x-6)(x+6)')}. So ${T('\\tfrac14(x-6)(x+6)')}.`, run: (c) => show(c, l3) },
        { cap: `Is it the same as way 1? Split ${T('\\tfrac14=\\tfrac12\\cdot\\tfrac12')} and give one half to each bracket.`,
          run: async (c) => { await pulse(c, q4, 1.25); l4.style.opacity = 1; await show(c, l4); await pop(c, hA); await pop(c, hB); } },
        { cap: `${T('\\tfrac12(x-6)=\\tfrac12x-3')} and ${T('\\tfrac12(x+6)=\\tfrac12x+3')}: exactly the factors from way 1.`, run: async (c) => { await show(c, l5); await show(c, note); } }
      ];
    }
    const [o1, o2] = [column(d.terms[0], W * 0.25, CA, 'A'), column(d.terms[1], W * 0.75, CB, 'B')];
    const op = lab(stage, W / 2, 62, T('-'), 'u4l4-fs-term');
    const ans = hide(lab(stage, W / 2, 418, T(`${FSE[d.ex]}=${d.ans}`), 'u4l4-fs-ans'));
    const pc = (tm) => tm.parts.map(([p, r]) => T(`\\sqrt{${p}}=${r}`)).join(', ');
    return [
      { cap: `First term: ${d.terms[0].dec ? `as hundredths, ${T(`${d.terms[0].t}=${d.terms[0].dec}`)}; then ` : ''}root each piece: ${pc(d.terms[0])}. So ${T(`${d.terms[0].t}=\\left(${d.terms[0].root}\\right)^2`)}.`, run: (c) => o1.run(c) },
      { cap: `Second term: ${d.terms[1].dec ? `${T(`${d.terms[1].t}=${d.terms[1].dec}`)}; ` : ''}${pc(d.terms[1])}. So ${T(`${d.terms[1].t}=\\left(${d.terms[1].root}\\right)^2`)}.`, run: (c) => o2.run(c) },
      { cap: `Subtracted, so it is a difference of squares with ${T(`A=${d.terms[0].root}`)}, ${T(`B=${d.terms[1].root}`)}: ${T(d.ans)}.`, run: async (c) => { await pulse(c, op, 1.4); await show(c, ans); } }
    ];
  }
};

/* =============================== explainer: keep going (a factor tree) =============================== */
const LF = (t, kind = 'leaf') => ({ t, kind });
const DN = (t, why, kids, gcf = false) => ({ t, why, kids, gcf });
const KG = {
  a: { e: 'x^4-81', tree: DN('x^4-81', '(x^2)^2-9^2', [DN('x^2-9', 'x^2-3^2', [LF('x-3'), LF('x+3')]), LF('x^2+9', 'sum')]), ans: '(x-3)(x+3)(x^2+9)' },
  b: { e: '16a^4-b^4', tree: DN('16a^4-b^4', '(4a^2)^2-(b^2)^2', [DN('4a^2-b^2', '(2a)^2-b^2', [LF('2a-b'), LF('2a+b')]), LF('4a^2+b^2', 'sum')]), ans: '(2a-b)(2a+b)(4a^2+b^2)' },
  c: { e: '3x^4-48y^4', tree: DN('3x^4-48y^4', '3(x^4-16y^4)', [LF('3', 'num'), DN('x^4-16y^4', '(x^2)^2-(4y^2)^2', [DN('x^2-4y^2', 'x^2-(2y)^2', [LF('x-2y'), LF('x+2y')]), LF('x^2+4y^2', 'sum')])], true), ans: '3(x-2y)(x+2y)(x^2+4y^2)' },
  d: { e: 'm^8-1', tree: DN('m^8-1', '(m^4)^2-1^2', [DN('m^4-1', '(m^2)^2-1^2', [DN('m^2-1', 'm^2-1^2', [LF('m-1'), LF('m+1')]), LF('m^2+1', 'sum')]), LF('m^4+1', 'sum')]), ans: '(m-1)(m+1)(m^2+1)(m^4+1)' },
  e: { e: 'x^6-49', tree: DN('x^6-49', '(x^3)^2-7^2', [LF('x^3-7', 'stop'), LF('x^3+7', 'sum')]), ans: '(x^3-7)(x^3+7)' }
};
const keepGoing = {
  title: 'Keep opening the differences; the sums stay shut',
  height: 456, minW: 900,
  choices: [{ sep: 'Example 5' }, ...Object.keys(KG).map((k) => ({ v: k, label: `(${k}) ` + T(KG[k].e) }))],
  ask: (k) => `<b>Example 5(${k}):</b> factor ${T(KG[k].e)} fully.`,
  make(stage, k, ex) {
    const d = KG[k], W = ex.W, svg = mkSvg(stage, W, ex.def.height), leaves = [], inner = [];
    const walk = (n, depth) => { n.depth = depth; if (n.kids) { inner.push(n); n.kids.forEach((q) => walk(q, depth + 1)); n.x = n.kids.reduce((s, q) => s + q.x, 0) / n.kids.length; } else { n.x = leaves.length; leaves.push(n); } };
    walk(d.tree, 0);
    const sp = Math.min(230, (W - 60) / leaves.length), X0 = (W - sp * leaves.length) / 2 + sp / 2, rowH = 98, Y0 = 14;
    const px = (n) => X0 + n.x * sp, py = (n) => Y0 + n.depth * rowH;
    const all = []; const reg = (n) => { all.push(n); (n.kids || []).forEach(reg); }; reg(d.tree);
    all.forEach((n) => {
      const el = h('div', 'u4l4-tn' + (n.kids ? ' u4l4-tn-in' : ' u4l4-tn-' + n.kind), `<div class="u4l4-tn-t">${T(n.t)}</div>` + (n.kids ? `<div class="u4l4-tn-why">${T('=' + n.why)}</div>` : ''));
      stage.appendChild(el); place(el, px(n), py(n), 's', 0); n.el = el;
      if (n.kids) n.whyEl = hide(el.querySelector('.u4l4-tn-why'));
      if (n !== d.tree) hide(el);
      if (!n.kids && n.kind !== 'leaf' && n.kind !== 'num') { n.tag = h('div', 'u4l4-tn-tag', n.kind === 'sum' ? 'sum: stays' : 'not squares: stop'); el.appendChild(n.tag); hide(n.tag); }
    });
    inner.forEach((n) => { n.edges = n.kids.map((q) => hide(svgEl('path', { d: `M${px(n)} ${py(n) + 70} L${px(q)} ${py(q) - 2}`, stroke: '#9aa0aa', 'stroke-width': 2.4, fill: 'none', class: 'bk-stroke' }, svg))); });
    const ans = hide(lab(stage, W / 2, ex.def.height - 30, T(`${d.e}=${d.ans}`), 'u4l4-tree-ans'));
    const kidsT = (n) => n.kids.map((q) => (q.kind === 'num' ? q.t : `(${q.t})`)).join('');
    const steps = inner.map((n) => {
      const sums = n.kids.filter((q) => q.kind === 'sum'), stops = n.kids.filter((q) => q.kind === 'stop');
      let cap = n.gcf ? `GCF first: ${T(`${n.t}=${n.why}`)}.` : `${T(`${n.t}=${n.why}`)}: a difference of squares. Open it into ${T(kidsT(n))}.`;
      if (sums.length) cap += ` The sum ${T(sums[0].t)} <b>stays</b>.`;
      if (stops.length) cap += ` ${T(stops[0].t)} is not a difference of squares (${T('x^3')} and 7 are not perfect squares): stop.`;
      return { cap, run: async (c) => {
        await show(c, n.whyEl);
        await Promise.all(n.edges.map((e) => { e.style.opacity = 1; return drawIn(e, 450, c); }));
        await Promise.all(n.kids.map((q) => pop(c, q.el)));
        await Promise.all(n.kids.filter((q) => q.tag).map((q) => { q.el.classList.add('u4l4-tn-shut'); return pop(c, q.tag); }));
      } };
    });
    steps.push({ cap: `Nothing else opens. The factors are the ends of the branches: ${T(`${d.e}=${d.ans}`)}.`,
      run: async (c) => { leaves.forEach((q) => q.el.classList.add('u4l4-tn-done')); await Promise.all(leaves.map((q) => pulse(c, q.el, 1.06))); await show(c, ans); } });
    return steps;
  }
};

/* =============================== explainer: binomials in the boxes =============================== */
const BS = {
  a: { e: '(x+3)^2-25', A: '(x+3)', B: '5', sq: `${bxA('(x+3)')}^2-${bxB('5')}^2`, sub: `\\big[${bxA('(x+3)')}-${bxB('5')}\\big]\\big[${bxA('(x+3)')}+${bxB('5')}\\big]`,
    dist: '(x+3-5)(x+3+5)', dcap: `Here the brackets can simply go: ${T('(x+3-5)(x+3+5)')}.`, simp: '(x-2)(x+8)' },
  b: { e: '16-(y-1)^2', A: '4', B: '(y-1)', sq: `${bxA('4')}^2-${bxB('(y-1)')}^2`, sub: `\\big[${bxA('4')}-${bxB('(y-1)')}\\big]\\big[${bxA('4')}+${bxB('(y-1)')}\\big]`,
    dist: `(4${cR('-y+1')})(4+y-1)`, dcap: `The minus reaches <b>both</b> terms of ${T('B')}: ${T('-(y-1)=-y+1')}.`, simp: '(5-y)(y+3)' },
  c: { e: '4(2x-1)^2-9(y+2)^2', A: '2(2x-1)', B: '3(y+2)', sq: `\\big[${bxA('2(2x-1)')}\\big]^2-\\big[${bxB('3(y+2)')}\\big]^2`, sub: `\\big[${bxA('2(2x-1)')}-${bxB('3(y+2)')}\\big]\\big[${bxA('2(2x-1)')}+${bxB('3(y+2)')}\\big]`,
    dist: `(4x-2${cR('-3y-6')})(4x-2+3y+6)`, dcap: `Expand: ${T('2(2x-1)=4x-2')}, and ${T('-3(y+2)=-3y-6')}: the minus reaches both terms.`, simp: '(4x-3y-8)(4x+3y+4)' },
  d: { e: '(3x+1)^2-(x-5)^2', A: '(3x+1)', B: '(x-5)', sq: `${bxA('(3x+1)')}^2-${bxB('(x-5)')}^2`, sub: `\\big[${bxA('(3x+1)')}-${bxB('(x-5)')}\\big]\\big[${bxA('(3x+1)')}+${bxB('(x-5)')}\\big]`,
    dist: `(3x+1${cR('-x+5')})(3x+1+x-5)`, dcap: `${T('-(x-5)=-x+5')}: <b>both</b> signs flip.`, simp: '(2x+6)(4x-4)', gcf: '2(x+3)\\cdot4(x-1)', fin: '8(x+3)(x-1)' }
};
const boxSub = {
  title: 'Put A and B in boxes, keep the brackets',
  height: 440, minW: 920, capH: 92,
  choices: [{ sep: 'Example 6' }, ...Object.keys(BS).map((k) => ({ v: k, label: `(${k}) ` + T(BS[k].e) }))],
  ask: (k) => `<b>Example 6(${k}):</b> factor ${T(BS[k].e)} fully.`,
  make(stage, k, ex) {
    const d = BS[k], X = 40, Y0 = 72, dy = 60;
    const pA = hide(lab(stage, X, 22, T(`A=${d.A}`), 'u4l4-pill u4l4-pill-a', 'e', 0)), pB = hide(lab(stage, X + 250, 22, T(`B=${d.B}`), 'u4l4-pill u4l4-pill-b', 'e', 0));
    const rows = [`${d.e}=${d.sq}`, `=(${bxA('A')}-${bxB('B')})(${bxA('A')}+${bxB('B')})`, `=${d.sub}`, `=${d.dist}`, `=${cG(d.simp)}`];
    if (d.gcf) { rows[4] = `=${d.simp}=${d.gcf}`; rows.push(`=${cG(d.fin)}`); }
    const L = rows.map((r, i) => { const e = lab(stage, X, Y0 + i * dy, T(r), 'u4l4-bs-line', 'e', 0); if (i) hide(e); return e; });
    const fin = d.gcf ? d.fin : d.simp;
    const steps = [
      { cap: `Spot the two squares: ${T(`A=${d.A}`)} and ${T(`B=${d.B}`)}. Put each in a box.`, run: async (c) => { await pop(c, pA); await pop(c, pB); } },
      { cap: `It is ${T('A^2-B^2')}, so use the pattern on the boxes: ${T('(A-B)(A+B)')}.`, run: (c) => show(c, L[1]) },
      { cap: `Unpack the boxes and <b>keep the brackets</b>. The minus in front of ${T('B')} must reach every term inside it.`, run: (c) => show(c, L[2]) },
      { cap: d.dcap, run: (c) => show(c, L[3]) },
      { cap: d.gcf ? `Collect like terms: ${T(d.simp)}. Each factor still has a common factor: ${T('2x+6=2(x+3)')} and ${T('4x-4=4(x-1)')}.` : `Collect like terms in each factor: ${T(fin)}.`, run: (c) => show(c, L[4]) }
    ];
    if (d.gcf) steps.push({ cap: `Multiply the common factors: ${T('2\\cdot4=8')}. Fully factored: ${T(fin)}.`, run: (c) => show(c, L[5]) });
    return steps;
  }
};

/* =============================== explainer: the factoring checklist =============================== */
const CKN = {
  gcf: { x: 300, y: 40, w: 360, h: 66, html: '<b>1. GCF?</b>take it out (negative if the first term is)' },
  count: { x: 300, y: 138, w: 260, h: 50, html: '<b>2. Count the terms</b>' },
  two: { x: 98, y: 262, w: 188, h: 108, html: '<b>Two</b>difference of squares? (a sum: stop)' },
  three: { x: 300, y: 262, w: 188, h: 108, html: '<b>Three</b>trinomial: decomposition, perfect square, substitution' },
  four: { x: 502, y: 262, w: 188, h: 108, html: '<b>Four</b>grouping: two and two, or three and one' },
  again: { x: 300, y: 398, w: 360, h: 56, html: '<b>3. Factor again? 4. Check</b>' }
};
const CKE = [
  { from: 'gcf', to: 'count' },
  { from: 'count', to: 'two', label: '2', route: 'vhv' }, { from: 'count', to: 'three', label: '3' }, { from: 'count', to: 'four', label: '4', route: 'vhv' },
  { from: 'two', to: 'again', pts: [[98, 319], [98, 398], [116, 398]] }, { from: 'three', to: 'again' }, { from: 'four', to: 'again', pts: [[502, 319], [502, 398], [484, 398]] }
];
const S = (n, cap, ln) => ({ n, cap, ln });
const CK = {
  a: { e: '2x^3-18x', s: [S('gcf', `GCF ${T('2x')}: ${T('2x^3-18x=2x(x^2-9)')}.`, ['=2x(x^2-9)']), S('count', 'The bracket has <b>two</b> terms.'),
    S('two', `${T('x^2-9')} is a difference of squares: ${T('(x-3)(x+3)')}.`, ['=2x(x-3)(x+3)']), S('again', `No factor opens again. Fully factored: ${T('2x(x-3)(x+3)')}.`)] },
  b: { e: 'x^3+2x^2-9x-18', s: [S('gcf', 'No common factor for all four terms.'), S('count', '<b>Four</b> terms.'),
    S('four', `Group two and two: ${T('x^2(x+2)-9(x+2)=(x+2)(x^2-9)')}.`, ['=x^2(x+2)-9(x+2)', '=(x+2)(x^2-9)']),
    S('again', `${T('x^2-9')} opens again: ${T('(x+2)(x-3)(x+3)')}.`, ['=(x+2)(x-3)(x+3)'])] },
  c: { e: '4x^4-37x^2+9', s: [S('gcf', 'No common factor.'), S('count', `<b>Three</b> terms, in ${T('x^4')} and ${T('x^2')}: a quadratic form.`),
    S('three', `Product ${T('4\\times9=36')}, sum ${T('-37')}: ${T('-36')} and ${T('-1')}. Decompose and group: ${T('(4x^2-1)(x^2-9)')}.`, ['=4x^4-36x^2-x^2+9', '=4x^2(x^2-9)-1(x^2-9)', '=(4x^2-1)(x^2-9)']),
    S('again', `<b>Both</b> brackets are differences of squares: ${T('(2x-1)(2x+1)(x-3)(x+3)')}.`, ['=(2x-1)(2x+1)(x-3)(x+3)'])] },
  d: { e: '6x^2-7x-20', s: [S('gcf', 'No common factor.'), S('count', '<b>Three</b> terms.'),
    S('three', `Decomposition: product ${T('-120')}, sum ${T('-7')}: ${T('-15')} and 8. ${T('3x(2x-5)+4(2x-5)')}.`, ['=6x^2-15x+8x-20', '=3x(2x-5)+4(2x-5)', '=(3x+4)(2x-5)']),
    S('again', `Neither bracket opens again: ${T('(3x+4)(2x-5)')}.`)] },
  e: { e: 'x^2-6x+9-y^2', s: [S('gcf', 'No common factor.'), S('count', '<b>Four</b> terms.'),
    S('four', `Group <b>three and one</b>: ${T('x^2-6x+9=(x-3)^2')}, a perfect square. Now ${T('(x-3)^2-y^2')} is a difference of squares!`, ['=(x^2-6x+9)-y^2', '=(x-3)^2-y^2']),
    S('again', `${T('A=x-3')}, ${T('B=y')}: ${T('(x-3-y)(x-3+y)')}.`, ['=(x-3-y)(x-3+y)'])] },
  f: { e: '3a^2+12', s: [S('gcf', `GCF 3: ${T('3(a^2+4)')}.`, ['=3(a^2+4)']), S('count', 'The bracket has <b>two</b> terms.'),
    S('two', `${T('a^2+4')} is a <b>sum</b> of squares: it does not factor.`), S('again', `Fully factored: ${T('3(a^2+4)')}.`)] }
};
const checklist = {
  title: 'The factoring checklist',
  height: 440, minW: 960, capH: 92,
  choices: [{ sep: 'Example 8' }, ...Object.keys(CK).map((k) => ({ v: k, label: `(${k}) ` + T(CK[k].e) }))],
  ask: (k) => `<b>Example 8(${k}):</b> factor ${T(CK[k].e)} fully.`,
  make(stage, k, ex) {
    const d = CK[k], W = ex.W, F = new Flowchart(stage, { x: 6, y: 0, width: 610, height: 440, nodes: CKN, edges: CKE, cls: 'u4l4-flow' });
    const P = panel(stage, 632, 14, W - 646, 412, 'Working', 'u4l4-ckp');
    line(P, T(d.e), 'u4l4-big');
    let prev = null;
    return d.s.map((st) => {
      const ls = (st.ln || []).map((s) => lineH(P, T(s), /\(.*\)\(.*\)/.test(s) && st.n === 'again' ? 'u4l4-key-line' : ''));
      const from = prev; prev = st.n;
      return { cap: st.cap, run: async (c) => { if (from) await F.go(c, from, st.n); await F.visit(c, st.n); for (const e of ls) await show(c, e); } };
    });
  }
};

/* =============================== explainer: is it a factor? =============================== */
const FO = {
  e9: { label: 'Example 9 check', tests: [
    { t: 'x-2', hit: [1], cap: `(a) Is ${T('x-2')} a factor? It is one of the pieces: <b>yes</b>.` },
    { t: 'x-4', hit: null, cap: `(b) ${T('x-4')}? It is not one of the pieces, and no product of pieces makes it: <b>no</b>. (The 4 in ${T('x^4-16')} belongs with ${T('x^2')}.)` },
    { t: 'x^2+4', hit: [3], cap: `(c) ${T('x^2+4')}? It is the last piece: <b>yes</b>.` }] },
  prod: { label: 'Products of pieces', tests: [
    { t: 'x^2-4', hit: [1, 2], cap: `${T('x^2-4')}? It is not a piece, but it is ${T('(x-2)(x+2)')}, a product of two pieces: <b>yes</b>.` },
    { t: '3x+6', hit: [0, 2], cap: `${T('3x+6')}? It is ${T('3(x+2)')}: two pieces multiplied, so <b>yes</b>.` },
    { t: 'x+4', hit: null, cap: `${T('x+4')}? No piece, and no product of pieces: <b>no</b>.` }] }
};
const factorOf = {
  title: 'Factor fully, then look for the binomial',
  height: 420, minW: 900,
  choices: [{ v: 'e9', label: FO.e9.label }, { v: 'prod', label: FO.prod.label }],
  ask: (k) => (k === 'e9' ? `<b>Example 9:</b> are ${T('x-2')}, ${T('x-4')} and ${T('x^2+4')} factors of ${T('3x^4-48')}?` : `Which of ${T('x^2-4')}, ${T('3x+6')}, ${T('x+4')} are factors of ${T('3x^4-48')}?`),
  make(stage, k, ex) {
    const d = FO[k], W = ex.W, svg = mkSvg(stage, W, ex.def.height);
    const l1 = hide(lab(stage, W / 2, 30, T('3x^4-48=3(x^4-16)=3(x^2-4)(x^2+4)'), 'u4l4-fo-line'));
    const l2 = hide(lab(stage, W / 2, 80, T('=3(x-2)(x+2)(x^2+4)'), 'u4l4-fo-line'));
    const pcs = ['3', 'x-2', 'x+2', 'x^2+4'], ws = [86, 150, 150, 170], gap = 28, tot = ws.reduce((s, w) => s + w, 0) + gap * 3;
    let xx = (W - tot) / 2;
    const cards = pcs.map((p, i) => { const e = hide(add(stage, box(h('div', 'u4l4-fo-card', T(p)), ws[i], 64), xx, 128)); e.cx = xx + ws[i] / 2; xx += ws[i] + gap; return e; });
    const tests = d.tests.map((t, i) => {
      const cx = W * (0.2 + 0.3 * i), e = hide(add(stage, box(h('div', 'u4l4-fo-cand', T(t.t)), 150, 58), cx - 75, 300));
      const links = (t.hit || []).map((j) => hide(svgEl('path', { d: `M${cx} 298 C${cx} 250 ${cards[j].cx} 250 ${cards[j].cx} 196`, fill: 'none', stroke: OK, 'stroke-width': 3, class: 'bk-stroke' }, svg)));
      const st = hide(stamp(stage, t.hit ? 'factor' : 'not a factor', { ok: !!t.hit, x: cx - 70, y: 366, rotate: -6, size: 'sm' }));
      return { t, e, links, st };
    });
    const steps = [];
    if (k === 'e9') {
      steps.push({ cap: `Factor fully first: ${T('3x^4-48=3(x^4-16)=3(x^2-4)(x^2+4)')}.`, run: (c) => show(c, l1) });
      steps.push({ cap: `${T('x^2-4')} opens again: ${T('3(x-2)(x+2)(x^2+4)')}. These four <b>pieces</b> are the factors.`, run: async (c) => { await show(c, l2); for (const e of cards) await pop(c, e, 260); } });
    } else {
      steps.push({ cap: `The fully factored form from Example 9: ${T('3x^4-48=3(x-2)(x+2)(x^2+4)')}. A product of pieces is a factor too.`, run: async (c) => { await show(c, l2); for (const e of cards) await pop(c, e, 260); } });
    }
    tests.forEach((o) => steps.push({ cap: o.t.cap, run: async (c) => {
      await pop(c, o.e);
      if (o.t.hit) { await Promise.all(o.links.map((p) => { p.style.opacity = 1; return drawIn(p, 500, c); })); o.t.hit.forEach((j) => cards[j].classList.add('u4l4-fo-hit')); await Promise.all(o.t.hit.map((j) => pulse(c, cards[j], 1.06))); }
      else await shake(c, o.e);
      o.st.style.opacity = 1; await stampIn(c, o.st);
    } }));
    return steps;
  }
};

/* =============================== Example 7: the patio figure =============================== */
function mountPatio() {
  const host = byId('u4l4-patio'); if (!host) return;
  const S0 = 220, s = S0 * 4 / 11, X = 62, Y = 10;
  const svg = svgEl('svg', { width: 290, height: 290, viewBox: '0 0 290 290', class: 'u4l4-patiosvg' }, host);
  svgEl('rect', { x: X, y: Y, width: S0, height: S0, fill: '#e5e1d8', stroke: INK, 'stroke-width': 2 }, svg);
  svgEl('rect', { x: X + S0 - s, y: Y, width: s, height: s, fill: '#fff', stroke: INK, 'stroke-width': 2 }, svg);
  const L = (x, y, t, pos) => { const d = h('div', 'u4l4-lab u4l4-plab', T(t)); host.appendChild(d); place(d, x, y, pos, 0); };
  L(X + S0 / 2, Y + S0 + 6, '2x+5', 's'); L(X - 6, Y + S0 / 2, '2x+5', 'w'); L(X + S0 - s / 2, Y + s / 2, 'x+1', 'c');
}

/* =============================== Stand Up Break =============================== */
const lin = (terms) => { let s = ''; for (const [c, v] of terms) { if (!c) continue; const a = Math.abs(c), body = v ? (a === 1 ? v : a + v) : String(a); s += (c < 0 ? '-' : s ? '+' : '') + body; } return s || '0'; };
const mono = (p, v) => (p === 1 ? v : p + v);
const sqT = (t) => (/^([a-z]|\d+)$/.test(t) ? t + '^2' : `(${t})^2`);
standup('u4l4', {
  intro: 'At your whiteboard: GCF first, then look for A² − B². Keep factoring until nothing opens, and check by expanding.',
  levels: {
    BEG: (r) => {
      let p, q; do { p = r.int(1, 9); q = r.int(1, 12); } while (gcd(p, q) !== 1 || (p === 1 && q === 1));
      const v = r.chance(0.4) ? 'y' : '', A = mono(p, 'x'), B = v ? mono(q, v) : String(q), A2 = `${p * p === 1 ? '' : p * p}x^2`, B2 = v ? `${q * q === 1 ? '' : q * q}y^2` : String(q * q);
      if (r.chance(0.2)) return { text: 'Factor, if possible.', q: `${A2}+${B2}`, a: [`\\text{a sum of squares: it does not factor}`] };
      return { text: 'Factor.', q: `${A2}-${B2}`, a: [`${sqT(A)}-${sqT(B)}`, `=(${A}-${B})(${A}+${B})`] };
    },
    PRG: (r) => {
      if (r.chance(0.5)) {
        let p, q; do { p = r.int(1, 5); q = r.int(1, 7); } while (gcd(p, q) !== 1);
        const g = r.pick([2, 3, 5, 6, 7]), neg = r.chance(0.3), A = mono(p, 'x');
        if (neg) return { text: 'Factor fully.', q: `-${g * p * p}x^2+${g * q * q}`, a: [`-${g}(${p * p === 1 ? '' : p * p}x^2-${q * q})`, `=-${g}(${A}-${q})(${A}+${q})`] };
        return { text: 'Factor fully.', q: `${g * p * p}x^2-${g * q * q}`, a: [`${g}(${p * p === 1 ? '' : p * p}x^2-${q * q})`, `=${g}(${A}-${q})(${A}+${q})`] };
      }
      const c = r.pick([1, 1, 16]), kk = c === 16 ? r.pick([1, 3, 5]) : r.int(1, 5), A = c === 16 ? '4x^2' : 'x^2', a1 = c === 16 ? '2x' : 'x';
      return { text: 'Factor fully.', q: `${c === 16 ? 16 : ''}x^4-${kk ** 4}`, a: [`(${A}-${kk * kk})(${A}+${kk * kk})`, `=(${a1}-${kk})(${a1}+${kk})(${A}+${kk * kk})`] };
    },
    MAS: (r) => {
      if (r.chance(0.5)) {
        let p, q, rr, s; do { p = r.int(2, 4); rr = r.int(1, p - 1); q = r.int(-6, 6); s = r.int(-6, 6); } while (!q || !s || q === s || gcd(p, q) !== 1 || gcd(rr, s) !== 1 || q * rr === p * s);
        const f1 = [p - rr, q - s], f2 = [p + rr, q + s], g1 = gcd(f1[0], f1[1]), g2 = gcd(f2[0], f2[1]), G = g1 * g2;
        const P1 = lin([[p, 'x'], [q, '']]), P2 = lin([[rr, 'x'], [s, '']]), F1 = lin([[f1[0], 'x'], [f1[1], '']]), F2 = lin([[f2[0], 'x'], [f2[1], '']]);
        const a = [`\\big[(${P1})-(${P2})\\big]\\big[(${P1})+(${P2})\\big]`, `=(${F1})(${F2})`];
        if (G > 1) {
          const h1 = lin([[f1[0] / g1, 'x'], [f1[1] / g1, '']]), h2 = f2[1] === 0 ? null : lin([[f2[0] / g2, 'x'], [f2[1] / g2, '']]);
          a.push(h2 ? `=${G}(${h1})(${h2})` : `=${G}x(${h1})`);
        }
        return { text: 'Factor fully. Simplify each factor.', q: `(${P1})^2-(${P2})^2`, a };
      }
      let a, b; do { a = r.int(2, 4); b = r.int(2, 5); } while (gcd(a, b) !== 1);
      let p, q; do { p = r.int(-5, 5); q = r.int(-5, 5); } while (!p || !q);
      const X = lin([[1, 'x'], [p, '']]), Y = lin([[1, 'y'], [q, '']]);
      return { text: 'Factor fully. Simplify each factor.', q: `${a * a}(${X})^2-${b * b}(${Y})^2`,
        a: [`\\big[${a}(${X})-${b}(${Y})\\big]\\big[${a}(${X})+${b}(${Y})\\big]`, `=(${lin([[a, 'x'], [a * p, ''], [-b, 'y'], [-b * q, '']])})(${lin([[a, 'x'], [a * p, ''], [b, 'y'], [b * q, '']])})`,
          `=(${lin([[a, 'x'], [-b, 'y'], [a * p - b * q, '']])})(${lin([[a, 'x'], [b, 'y'], [a * p + b * q, '']])})`] };
    }
  }
});

/* =============================== mount =============================== */
mountChoc();
mountPatio();
export const explainers = mountExplainers({ foilCancel, cutSlide, cutSlide2, sumNo, dosTest, gcfFirst, banner, fracSquares, keepGoing, boxSub, checklist, factorOf });
export const _test = { lin, gcd, CS, KG, BS, CK };
