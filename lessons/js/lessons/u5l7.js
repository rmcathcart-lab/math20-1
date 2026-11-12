/* Math 20-1 · Unit 5 · Lesson 7 — The Quadratic Formula.
 * New format (2026-11-11): the warm-up is plain markup on the page (no code). No derivation animation (Ryan: no visual
 * proofs); the booklet's Example 1 stays as a static card. Explainers:
 *   machine (STAR: the formula machine. The equation goes in (rearranged to standard form first), a, b and c drop into
 *     the funnel, the screen shows the substitution, the discriminant (green light, or a red light and a jam: NO REAL
 *     ROOTS), the simplified radical and common factor, and the two roots roll out of two chutes; step numbers 1–5
 *     match the five steps on the page; Example 2(a)–(c), 3(a) and 4(b)),
 *   zeros (the parabola, its axis x = −b/2a, and the ± part reaching √(b² − 4ac)/2a to each side onto the x-intercepts,
 *     with the calculator's zero; no reach for Example 4(b); Example 4(a), 4(b), 2(a)),
 *   verdict (the mistake detector: a scanner compares a student's work with the correct work line by line and stamps the
 *     error: sign error, only one term divided, lost a solution, not in standard form; Example 5 and three demos),
 *   race (choosing a method: square roots, factoring and the formula race line by line; stuck / doesn't apply stamps and
 *     a trophy for the fastest; Example 6(a)–(d)),
 *   flight (Example 8: the ball's flight in step with its graph, the negative root rejected "before the throw"; the
 *     rectangle drawn to scale, the negative width rejected, the perimeter traced).
 * Colours: a blue, b amber, c green, the discriminant purple, the roots brand, errors / rejected red. */
import {
  h, tex, add, box, Graph, NumberLine, stamp, stampIn, mountExplainers, pop, fadeIn, sleep, tween,
  svgEl, pulse, shake, anim, linear, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const CA = COLORS.blue, CB = COLORS.amber, CC = COLORS.green, CD = COLORS.purple, CR = COLORS.brand, OK = COLORS.green, NO = COLORS.red;
const cA = (s) => `\\textcolor{${CA}}{${s}}`, cB = (s) => `\\textcolor{${CB}}{${s}}`, cC = (s) => `\\textcolor{${CC}}{${s}}`;
const cD = (s) => `\\textcolor{${CD}}{${s}}`, cR = (s) => `\\textcolor{${CR}}{${s}}`, cX = (s) => `\\textcolor{${NO}}{${s}}`;
const fx = (v, d = 2) => { const k = Math.pow(10, d); return (Math.round((v + Math.sign(v) * 1e-9) * k) / k).toFixed(d); };
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
const panel = (stage, x, y, w, hh, title, cls = '') => div(stage, 'u5l7-panel ' + cls, title ? `<div class="u5l7-ph">${title}</div>` : '', x, y, w, hh);
const lineIn = (p, html, cls = '') => { const d = h('div', 'u5l7-line ' + cls, html); p.appendChild(d); hide(d); return d; };
const stampAt = (host, text, ok, x, y, o = {}) => hide(stamp(host, text, Object.assign({ ok, x, y }, o)));
const sn = (n) => `<span class="u5l7-sn">${n}</span>`;

/* =============================== quadratic-formula arithmetic =============================== */
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const simpRoot = (n) => { for (let d = Math.floor(Math.sqrt(n)); d > 1; d--) if (n % (d * d) === 0) return [d, n / (d * d)]; return [1, n]; };
const bk = (v) => (v < 0 ? `(${v})` : `${v}`);
const fracTex = (n, d) => { const g = gcd(n, d) || 1; let N = n / g, D = d / g; if (D < 0) { N = -N; D = -D; } return D === 1 ? `${N}` : `${N < 0 ? '-' : ''}\\tfrac{${Math.abs(N)}}{${D}}`; };
const radTerm = (Q, m) => `${Q === 1 ? '' : Q}\\sqrt{${m}}`;
const pmTex = (P, Q, m, s = '\\pm') => (P === 0 ? (s === '\\pm' ? '\\pm' : s === '-' ? '-' : '') + radTerm(Q, m) : `${P}${s}${radTerm(Q, m)}`);
/** a polynomial ax² + bx + c as TeX (v = the variable) */
const poly = (a, b, c, v = 'x') => {
  const t = []; const co = (k, s) => (k === 1 ? s : k === -1 ? '-' + s : k + s);
  if (a) t.push(co(a, v + '^2')); if (b) t.push(co(b, v)); if (c) t.push(String(c));
  return t.join('+').replace(/\+-/g, '-') || '0';
};
/** every line of the quadratic formula for ax² + bx + c = 0 (integers) */
function qf(a, b, c, o = {}) {
  const D = b * b - 4 * a * c, m4 = -4 * a * c, nb = -b, den = 2 * a, col = o.color !== false;
  const A = col ? cA(bk(a)) : bk(a), Bv = col ? cB(bk(b)) : bk(b), Cv = col ? cC(bk(c)) : bk(c);
  const q = { a, b, c, D, nb, den };
  q.abc = `a=${col ? cA(a) : a},\\ b=${col ? cB(b) : b},\\ c=${col ? cC(c) : c}`;
  q.sub = `x=\\dfrac{-${Bv}\\pm\\sqrt{${Bv}^2-4(${col ? cA(a) : a})(${col ? cC(c) : c})}}{2(${col ? cA(a) : a})}`;
  q.discv = `${b * b}${m4 >= 0 ? '+' : '-'}${Math.abs(m4)}`;
  q.disc = `b^2-4ac=${bk(b)}^2-4(${a})(${c})=${q.discv}=${col ? cD(D) : D}`;
  q.short = `x=\\dfrac{${nb}\\pm\\sqrt{${q.discv}}}{${den}}`;   // the booklet's compact substitution
  if (D < 0) { q.kind = 'none'; return q; }
  const r = Math.sqrt(D), nbs = nb === 0 ? '' : String(nb);
  q.l1 = `x=\\dfrac{${nbs}\\pm\\sqrt{${col ? cD(D) : D}}}{${den}}`;
  if (Number.isInteger(r)) {
    q.kind = 'rat'; q.r = r; q.l1 += `=\\dfrac{${nbs}\\pm${r}}{${den}}`;
    const one = (n) => { const raw = `\\dfrac{${n}}{${den}}`, red = fracTex(n, den).replace('\\tfrac', '\\dfrac'); return raw === red ? raw : `${raw}=${red}`; };
    q.l2 = `x=${one(nb + r)}\\ \\text{or}\\ x=${one(nb - r)}`;
    q.roots = [fracTex(nb + r, den), fracTex(nb - r, den)];
  } else {
    const [k, m] = simpRoot(D), g = gcd(gcd(nb, k), den); let P = nb / g, R = den / g; const Q = k / g;
    if (R < 0) { P = -P; R = -R; }
    q.kind = 'irr'; q.k = k; q.m = m; q.g = g;
    if (k > 1) q.l2 = `=\\dfrac{${nbs}\\pm${k}\\sqrt{${m}}}{${den}}`;
    const wrap = (s) => (R === 1 ? s : `\\dfrac{${s}}{${R}}`);
    if (g > 1) q.fin = '=' + wrap(pmTex(P, Q, m));
    q.exact = wrap(pmTex(P, Q, m));
    q.roots = [wrap(pmTex(P, Q, m, '+')), wrap(pmTex(P, Q, m, '-'))];
  }
  q.dec = [(nb + r) / den, (nb - r) / den];
  return q;
}

/* =============================== explainer: the formula machine (STAR) =============================== */
const MC = {
  e2a: { label: 'Example 2(a)', eq: 'x^2+4x-3=0', a: 1, b: 4, c: -3, dp: 1 },
  e2b: { label: '(b)', eq: '9x^2-6x-4=0', a: 9, b: -6, c: -4, dp: 1 },
  e2c: { label: '(c)', eq: 'x(x+6)=2(2x+7)', prep: [['x^2+6x=4x+14', 'expand'], ['x^2+2x-14=0', 'collect']], a: 1, b: 2, c: -14, dp: 1 },
  e3: { label: 'Example 3(a)', eq: '6x^2+x-15=0', a: 6, b: 1, c: -15 },
  e4b: { label: 'Example 4(b)', eq: 'x^2-2x+6=0', a: 1, b: -2, c: 6 }
};
function gearPath(cx, cy, r, n) {
  let d = ''; const ri = r * 0.78;
  for (let i = 0; i < n * 2; i++) {
    const a0 = (i / (n * 2)) * Math.PI * 2, a1 = ((i + 1) / (n * 2)) * Math.PI * 2, R = i % 2 ? ri : r;
    const p = (a, rr) => `${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)}`;
    d += (i ? 'L' : 'M') + p(a0, R) + 'L' + p(a1, R);
  }
  return d + 'Z';
}
const machine = {
  title: 'The formula machine',
  height: 440, minW: 960, capH: 84,
  choices: Object.keys(MC).map((k) => ({ v: k, label: MC[k].label })),
  ask: (v) => `Solve ${T(MC[v].eq)} with the quadratic formula.`,
  make(stage, v, ex) {
    const d = MC[v], q = qf(d.a, d.b, d.c), W = ex.W, H = 440;
    const LW = 232, RW = 200, MX = LW + 18, MW = W - LW - RW - 36, RX = MX + MW + 22, cx = MX + MW / 2;
    /* input: the equation, rearranged to standard form */
    const inP = panel(stage, 8, 8, LW, 226, `${sn(1)}Standard form`);
    lineIn(inP, T(d.eq), 'u5l7-eqin').style.opacity = 1;
    const prep = (d.prep || []).map(([t, n]) => lineIn(inP, `${T(t)} <span class="u5l7-note">${n}</span>`, 'u5l7-wl'));
    const std = d.prep ? null : lineIn(inP, '<span class="u5l7-note">already in standard form</span>', 'u5l7-wl');
    const balls = [['a', d.a, CA], ['b', d.b, CB], ['c', d.c, CC]].map(([L, val, colr], i) => {
      const el = div(stage, 'u5l7-ball', `<i>${L}</i>${T(String(val))}`, 10 + i * 70, 250, 64, 64); el.style.borderColor = colr; el.style.color = colr; return hide(el);
    });
    /* the machine */
    const svg = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u5l7-msvg' }, stage);
    svg.style.position = 'absolute'; svg.style.left = '0px'; svg.style.top = '0px';
    svgEl('path', { d: `M${cx - 70} 6 L${cx + 70} 6 L${cx + 24} 48 L${cx - 24} 48 Z`, fill: '#d9d3c4', stroke: '#5b5470', 'stroke-width': 3 }, svg);
    svgEl('rect', { x: MX, y: 46, width: MW, height: H - 52, rx: 20, fill: '#efeaf7', stroke: '#5b5470', 'stroke-width': 3.5 }, svg);
    [[MX + 14, 60], [MX + MW - 14, 60], [MX + 14, H - 20], [MX + MW - 14, H - 20]].forEach(([x, y]) => svgEl('circle', { cx: x, cy: y, r: 4, fill: '#9a92b5' }, svg));
    const gy = H - 40;
    const g1 = svgEl('path', { d: gearPath(MX + 46, gy, 24, 10), fill: '#c9c1dd', stroke: '#5b5470', 'stroke-width': 2.5 }, svg);
    const g2 = svgEl('path', { d: gearPath(MX + 92, gy + 6, 17, 8), fill: '#d9d3c4', stroke: '#5b5470', 'stroke-width': 2.5 }, svg);
    svgEl('circle', { cx: MX + 46, cy: gy, r: 6, fill: '#5b5470' }, svg); svgEl('circle', { cx: MX + 92, cy: gy + 6, r: 4.5, fill: '#5b5470' }, svg);
    const tx = svgEl('text', { x: cx + 30, y: gy + 8, 'text-anchor': 'middle', class: 'u5l7-mname' }, svg); tx.textContent = 'FORMULA MACHINE';
    const light = svgEl('circle', { cx: MX + MW - 40, cy: gy, r: 13, fill: '#d6d3cc', stroke: '#5b5470', 'stroke-width': 3 }, svg);
    /* two chutes to the output trays */
    const chY = [150, 286];
    chY.forEach((y) => { svgEl('rect', { x: MX + MW - 4, y: y + 22, width: RX - MX - MW + 10, height: 30, fill: '#d9d3c4', stroke: '#5b5470', 'stroke-width': 3 }, svg); });
    const spin = (c, ms = 900) => tween(c, ms, (t) => { g1.setAttribute('transform', `rotate(${t * 360} ${MX + 46} ${gy})`); g2.setAttribute('transform', `rotate(${-t * 450} ${MX + 92} ${gy + 6})`); }, linear);
    /* the screen */
    const scr = div(stage, 'u5l7-scr', '', MX + 16, 62, MW - 32, H - 62 - 80);
    const row = (n, t, cls = '') => lineIn(scr, `${n ? sn(n) : '<span class="u5l7-sn u5l7-sn0"></span>'}<span class="u5l7-lt">${T(t)}</span>`, 'u5l7-srow ' + cls);
    const rA = row(2, q.sub, 'u5l7-big');
    const rB = row(3, q.disc);
    let rC1 = null, rC2 = null, rX = null;
    if (q.kind === 'none') rX = row(0, `\\sqrt{${cX(q.D)}}\\ \\text{is not a real number}`, 'u5l7-big u5l7-bad');
    else {
      rC1 = row(4, q.l1, 'u5l7-big');
      const l2 = q.kind === 'rat' ? q.l2 : (q.l2 || '') + (q.fin || '');
      if (l2) rC2 = row(0, l2, 'u5l7-big');
    }
    /* output trays */
    const trays = chY.map((y, i) => div(stage, 'u5l7-tray', `<div class="u5l7-th">${i ? '−' : '+'} root</div>`, RX, y - 20, RW - 8, 128));
    const head5 = div(stage, 'u5l7-t5', `${sn(5)}Two roots`, RX, 92, RW - 8, 36); hide(head5);
    const caps = [];
    if (q.kind !== 'none') q.roots.forEach((r, i) => {
      const dec = d.dp ? `<div class="u5l7-dec">${T(`x\\approx${fx(q.dec[i], d.dp)}`)}</div>` : '';
      caps.push(hide(div(trays[i], 'u5l7-capsule', `${T(`x=${cR(r.replace(/\\tfrac/g, '\\dfrac'))}`)}${dec}`)));
    });
    const jam = stampAt(stage, 'NO REAL ROOTS', false, W - 140, 236);
    const okSt = q.kind === 'rat' ? stampAt(stage, `${q.D} = ${q.r}²`, null, 8 + LW / 2, 300, { rotate: -5, size: 'lg' }) : null;

    const capPrep = d.prep ? `Expand and collect terms first: ${T(d.prep[d.prep.length - 1][0])}. ` : '';
    const steps = [
      { cap: `<b>1. Standard form.</b> ${capPrep}Read ${T(q.abc)} <b>with their signs</b>.`,
        run: async (c) => { for (const l of prep) await show(c, l); if (std) await show(c, std); for (const b of balls) await pop(c, b, 300); } },
      { cap: '<b>2. Substitute.</b> The values drop into the machine, with <b>brackets</b> around every value.',
        run: async (c) => {
          for (const b of balls) { const L = parseFloat(b.style.left), Tp = parseFloat(b.style.top); await anim(c, b, [{ transform: 'none', opacity: 1 }, { transform: `translate(${cx - L - 37}px, ${4 - Tp}px) scale(.45)`, opacity: 0 }], 520); }
          await Promise.all([spin(c, 800), show(c, rA)]);
        } },
      q.kind === 'none'
        ? { cap: `<b>3. The discriminant first:</b> ${T(`b^2-4ac=${cX(q.D)}`)} is <b>negative</b>. A negative number has no real square root, so there are <b>no real roots</b>.`,
          run: async (c) => { await Promise.all([spin(c, 700), show(c, rB)]); light.setAttribute('fill', NO); await shake(c, svg); await show(c, rX); await stampIn(c, jam); } }
        : { cap: `<b>3. The discriminant first:</b> ${T(`b^2-4ac=${cD(q.D)}`)}. ${q.kind === 'rat' ? 'It is positive (green light) and a <b>perfect square</b>, so the roots are rational.' : 'It is positive, so the green light is on: two real roots.'}`,
          run: async (c) => { await Promise.all([spin(c, 700), show(c, rB)]); light.setAttribute('fill', OK); await pulse(c, rB, 1.04); } }
    ];
    if (q.kind === 'none') return steps;
    const cap4 = q.kind === 'rat' ? `<b>4. Simplify:</b> ${T(`\\sqrt{${q.D}}=${q.r}`)}, so the ${T('\\pm')} splits into two fractions. Reduce each one.`
      : q.k > 1 && q.g > 1 ? `<b>4. Simplify</b> the radical: ${T(`\\sqrt{${q.D}}=${q.k}\\sqrt{${q.m}}`)}. Then divide <b>every</b> term by the common factor ${T(String(q.g))}.`
      : q.k > 1 ? `<b>4. Simplify</b> the radical: ${T(`\\sqrt{${q.D}}=${q.k}\\sqrt{${q.m}}`)}. No factor is common to every term.`
      : `<b>4. Simplify:</b> ${T(`\\sqrt{${q.D}}`)} has no square factor, and no factor is common to every term.`;
    steps.push({ cap: cap4, run: async (c) => { await Promise.all([spin(c, 900), show(c, rC1)]); if (rC2) await show(c, rC2); if (okSt) await stampIn(c, okSt); } });
    const r5 = q.roots.map((r, i) => T(`x=${r}${d.dp ? `\\approx${fx(q.dec[i], d.dp)}` : ''}`));
    steps.push({ cap: `<b>5. Two roots</b> roll out: ${r5[0]} and ${r5[1]}.${d.dp ? ' Each decimal is worked out separately and rounded at the end.' : ''}`,
      run: async (c) => { await show(c, head5); for (const k of caps) { await anim(c, k, [{ opacity: 0, transform: 'translateX(-70px)' }, { opacity: 1, transform: 'none' }], 520); } } });
    return steps;
  }
};

/* =============================== explainer: zeros on the graph =============================== */
const ZR = {
  e4a: { label: 'Example 4(a)', a: 2, b: 6, c: -3, win: { xmin: -5, xmax: 2, ymin: -8, ymax: 4 }, dp: 2 },
  e4b: { label: 'Example 4(b)', a: 1, b: -2, c: 6, win: { xmin: -2, xmax: 4, ymin: -2, ymax: 10 } },
  e2a: { label: 'Example 2(a)', a: 1, b: 4, c: -3, win: { xmin: -6, xmax: 2, ymin: -8, ymax: 4 }, dp: 1 }
};
const zeros = {
  title: 'The formula on the graph',
  height: 430, minW: 940,
  choices: Object.keys(ZR).map((k) => ({ v: k, label: ZR[k].label })),
  ask: (v) => `Find the zeros of ${T(`y=${poly(ZR[v].a, ZR[v].b, ZR[v].c)}`)}.`,
  make(stage, v, ex) {
    const d = ZR[v], W = ex.W, f = (x) => d.a * x * x + d.b * x + d.c, D = d.b * d.b - 4 * d.a * d.c, ax = -d.b / (2 * d.a);
    const GW = 520, G = new Graph(stage, Object.assign({ x: 6, y: 20, width: GW, height: 406, xlabels: 1, ylabels: 2, fontSize: 15 }, d.win));
    const cur = hide(G.fn(f, { color: CR }));
    const axis = hide(G.vline(ax, { color: 'slate' }));
    const axl = hide(G.label(ax, d.win.ymax - 0.6, `x=${+ax.toFixed(3)}`, { tex: true, cls: 'bk-ptlab', pos: 'e', color: COLORS.slate }));
    const P = panel(stage, GW + 22, 8, W - GW - 30, 414, 'The formula in two parts');
    lineIn(P, T(`x=\\dfrac{-${cB('b')}}{2${cA('a')}}\\pm\\dfrac{\\sqrt{${cD('b^2-4ac')}}}{2${cA('a')}}`), 'u5l7-big').style.opacity = 1;
    const l1 = lineIn(P, `<span class="u5l7-tag0">axis</span>${T(`\\dfrac{-${cB(bk(d.b))}}{2(${cA(d.a)})}=${+ax.toFixed(3)}`)}`, 'u5l7-wl');
    const steps = [{ cap: `Graph ${T(`y=${poly(d.a, d.b, d.c)}`)}. Its zeros are the roots of ${T(`${poly(d.a, d.b, d.c)}=0`)}.`, run: (c) => G.drawIn((cur.style.opacity = '', cur), 900, c) },
      { cap: `The first part, ${T('-\\tfrac{b}{2a}')}, is the <b>axis of symmetry</b>: ${T(`x=${+ax.toFixed(3)}`)}. The zeros sit the same distance on each side of it.`,
        run: async (c) => { axis.style.opacity = ''; await G.drawIn(axis, 600, c); await show(c, axl); await show(c, l1); } }];
    if (D < 0) {
      const l2 = lineIn(P, `<span class="u5l7-tag0 u5l7-tagx">reach</span>${T(`\\dfrac{\\sqrt{${cX(D)}}}{${2 * d.a}}`)} &nbsp;not real`, 'u5l7-wl');
      const vx = G.point(ax, f(ax), { color: CR, label: T(`(${+ax.toFixed(3)},\\ ${+f(ax).toFixed(3)})`), pos: 'e' }); hide(vx); hide(vx.label);
      const st = stampAt(stage, 'NO x-INTERCEPTS', false, GW / 2 + 10, G.toPx(0, 0)[1] + 4, { size: 'lg' });
      steps.push({ cap: `The second part needs ${T(`\\sqrt{b^2-4ac}=\\sqrt{${D}}`)}: <b>not a real number</b>. There is nothing to reach with, so there are no zeros.`, run: (c) => show(c, l2) });
      steps.push({ cap: `The parabola opens up and its vertex ${T(`(${+ax.toFixed(3)},\\ ${+f(ax).toFixed(3)})`)} is above the axis: it <b>never meets the ${T('x')}-axis</b>.`, run: async (c) => { await Promise.all([pop(c, vx), show(c, vx.label)]); await stampIn(c, st); } });
      return steps;
    }
    const reach = Math.sqrt(D) / (2 * d.a), z1 = ax - reach, z2 = ax + reach;
    const l2 = lineIn(P, `<span class="u5l7-tag0">reach</span>${T(`\\dfrac{\\sqrt{${cD(D)}}}{2(${cA(d.a)})}\\approx${fx(reach, 2)}`)}`, 'u5l7-wl');
    const arL = hide(G.segment([ax, 0], [z1, 0], { color: CD, width: 5, ends: [null, 'arrow'] }));
    const arR = hide(G.segment([ax, 0], [z2, 0], { color: CD, width: 5, ends: [null, 'arrow'] }));
    const dp = d.dp || 2;
    const p1 = G.point(z1, 0, { color: CR, label: T(`(${fx(z1, dp)},\\ 0)`), pos: 'nw' }), p2 = G.point(z2, 0, { color: CR, label: T(`(${fx(z2, dp)},\\ 0)`), pos: 'ne' });
    [p1, p2].forEach((p) => { hide(p); hide(p.label); });
    const l3 = lineIn(P, `<span class="u5l7-tag0 u5l7-tagr">zeros</span>${T(`x\\approx${fx(z2, dp)}\\ \\text{and}\\ x\\approx${fx(z1, dp)}`)}`, 'u5l7-wl');
    const ti = lineIn(P, `<div class="u5l7-ti"><div>CALC 2: zero</div><div>Zero</div><div>X=${String(+z2.toPrecision(8)).replace(/^0\./, '.').replace(/^-0\./, '-.')} &nbsp;Y=0</div></div>`, '');
    steps.push({ cap: `The ${T('\\pm')} part reaches ${T(`\\tfrac{\\sqrt{${D}}}{${2 * d.a}}\\approx${fx(reach, 2)}`)} <b>both ways</b> from the axis.`,
      run: async (c) => { await show(c, l2); arL.style.opacity = arR.style.opacity = ''; await Promise.all([G.drawIn(arL, 700, c), G.drawIn(arR, 700, c)]); } });
    steps.push({ cap: `It lands exactly on the <b>${T('x')}-intercepts</b>: ${T(`(${fx(z1, dp)},\\ 0)`)} and ${T(`(${fx(z2, dp)},\\ 0)`)}.`,
      run: async (c) => { await Promise.all([pop(c, p1), show(c, p1.label), pop(c, p2), show(c, p2.label)]); await show(c, l3); } });
    steps.push({ cap: `Check with the calculator's <b>zero</b> (2nd TRACE, 2): it agrees, ${T(`x\\approx${String(+z2.toFixed(3))}`)}.`, run: (c) => show(c, ti) });
    return steps;
  }
};

/* =============================== explainer: the mistake detector (verdict stamps) =============================== */
/* rows: [student TeX, correct TeX, status ('ok' | 'err' | 'carry'), tag (short, for an error), caption] */
const VD = {
  ex5: { label: 'Example 5', eq: '2x^2-4x-3=0', verdict: '2 ERRORS',
    rows: [
      ['x=\\dfrac{-(-4)\\pm\\sqrt{-4^2-4(2)(-3)}}{2(2)}', 'x=\\dfrac{-(-4)\\pm\\sqrt{(-4)^2-4(2)(-3)}}{2(2)}', 'err', '(−4)² = 16', '<b>Line 1: error.</b> ' + T('-4^2') + ' means ' + T('-(4^2)=-16') + '. Squaring a negative ' + T('b') + ' needs <b>brackets</b>: ' + T('(-4)^2=16') + '.'],
      ['x=\\dfrac{4\\pm\\sqrt{-16+24}}{4}=\\dfrac{4\\pm\\sqrt8}{4}', 'x=\\dfrac{4\\pm\\sqrt{16+24}}{4}=\\dfrac{4\\pm\\sqrt{40}}{4}', 'carry', 'from Line 1', '<b>Line 2</b> carries the error: the discriminant should be ' + T('16+24=40') + ', not ' + T('8') + '.'],
      ['x=\\dfrac{4\\pm2\\sqrt2}{4}', 'x=\\dfrac{4\\pm2\\sqrt{10}}{4}', 'carry', 'from Line 1', '<b>Line 3:</b> ' + T('\\sqrt8=2\\sqrt2') + ' is right, but it is the wrong radical. The correct line uses ' + T('\\sqrt{40}=2\\sqrt{10}') + '.'],
      ['x=1\\pm2\\sqrt2', 'x=\\dfrac{2\\pm\\sqrt{10}}{2}', 'err', 'divide EVERY term', '<b>Line 4: error.</b> Only the ' + T('4') + ' was divided by ' + T('4') + '. Every term of the numerator must be divided (here by the common factor ' + T('2') + ').']],
    final: 'x=\\dfrac{2\\pm\\sqrt{10}}{2}\\approx2.58,\\ -0.58', vcap: 'Two errors: a <b>sign error</b> in Line 1 and <b>only one term divided</b> in Line 4. The correct roots: ' },
  pm: { label: 'Lost the ±', eq: 'x^2+2x-4=0', verdict: 'LOST A SOLUTION',
    rows: [
      ['x=\\dfrac{-2+\\sqrt{2^2-4(1)(-4)}}{2(1)}', 'x=\\dfrac{-2\\pm\\sqrt{2^2-4(1)(-4)}}{2(1)}', 'err', 'where is the ±?', '<b>Line 1: error.</b> The student wrote only <b>+</b>. The formula has ' + T('\\pm') + ': one root with + and one with −.'],
      ['x=\\dfrac{-2+\\sqrt{20}}{2}', 'x=\\dfrac{-2\\pm\\sqrt{20}}{2}', 'carry', 'still only +', '<b>Line 2:</b> the arithmetic is right (' + T('4+16=20') + '), but still only the + root.'],
      ['x=\\dfrac{-2+2\\sqrt5}{2}=-1+\\sqrt5', 'x=\\dfrac{-2\\pm2\\sqrt5}{2}=-1\\pm\\sqrt5', 'carry', 'still only +', '<b>Line 3:</b> simplified correctly, every term divided by ' + T('2') + '. But one root is missing.']],
    final: 'x=-1\\pm\\sqrt5\\approx1.24,\\ -3.24', vcap: 'Without the ' + T('\\pm') + ' the root ' + T('x=-1-\\sqrt5\\approx-3.24') + ' is <b>lost</b>. The correct roots: ' },
  negb: { label: 'Used b, not −b', eq: '2x^2-5x+1=0', verdict: 'SIGN ERROR',
    rows: [
      ['x=\\dfrac{-5\\pm\\sqrt{(-5)^2-4(2)(1)}}{2(2)}', 'x=\\dfrac{-(-5)\\pm\\sqrt{(-5)^2-4(2)(1)}}{2(2)}', 'err', '−b = −(−5) = 5', '<b>Line 1: error.</b> The formula starts with ' + T('-b') + '. With ' + T('b=-5') + ', that is ' + T('-(-5)=5') + ', not ' + T('-5') + '. (The radical part is right.)'],
      ['x=\\dfrac{-5\\pm\\sqrt{17}}{4}', 'x=\\dfrac{5\\pm\\sqrt{17}}{4}', 'carry', 'from Line 1', '<b>Line 2:</b> ' + T('25-8=17') + ' is right, but the front sign is wrong, so both roots come out negative.']],
    final: 'x=\\dfrac{5\\pm\\sqrt{17}}{4}\\approx2.28,\\ 0.22', vcap: 'A <b>sign error</b> in ' + T('-b') + ' flips both roots: the student gets ' + T('-2.28') + ' and ' + T('-0.22') + '. The correct roots: ' },
  std: { label: 'Not standard form', eq: 'x^2=3x+2', verdict: 'NOT STANDARD FORM',
    rows: [
      ['a=1,\\ b=3,\\ c=2', 'x^2-3x-2=0:\\ a=1,\\ b=-3,\\ c=-2', 'err', 'standard form first!', '<b>Line 1: error.</b> The student read the numbers straight off ' + T('x^2=3x+2') + '. Standard form first: ' + T('x^2-3x-2=0') + ', so ' + T('b=-3') + ' and ' + T('c=-2') + '.'],
      ['x=\\dfrac{-3\\pm\\sqrt{9-8}}{2}=\\dfrac{-3\\pm1}{2}', 'x=\\dfrac{3\\pm\\sqrt{9+8}}{2}=\\dfrac{3\\pm\\sqrt{17}}{2}', 'carry', 'from Line 1', '<b>Line 2:</b> right formula, wrong ' + T('b') + ' and ' + T('c') + '.'],
      ['x=-1\\ \\text{or}\\ x=-2', 'x\\approx3.56\\ \\text{or}\\ x\\approx-0.56', 'carry', 'check: 1 ≠ −1', '<b>Line 3:</b> a check catches it: ' + T('x=-1') + ' gives ' + T('(-1)^2=1') + ' on the left but ' + T('3(-1)+2=-1') + ' on the right.']],
    final: 'x=\\dfrac{3\\pm\\sqrt{17}}{2}\\approx3.56,\\ -0.56', vcap: 'The equation was <b>not in standard form</b>, so ' + T('b') + ' and ' + T('c') + ' had the wrong signs. The correct roots: ' }
};
const verdict = {
  title: 'The mistake detector',
  height: 436, minW: 960, capH: 84,
  choices: [{ v: 'ex5', label: 'Example 5' }, { sep: 'Other mistakes:' }, ...['pm', 'negb', 'std'].map((k) => ({ v: k, label: VD[k].label }))],
  ask: (v) => `A student solved ${T(VD[v].eq)}. Check each line against the correct work.`,
  make(stage, v, ex) {
    const d = VD[v], W = ex.W, PW = (W - 28) / 2, y0 = 52, RH = 78;
    const L = div(stage, 'u5l7-paper u5l7-stu', '<div class="u5l7-ph">The student’s work</div>', 8, 6, PW, 424);
    const R = div(stage, 'u5l7-paper u5l7-cor', '<div class="u5l7-ph">The correct work</div>', 20 + PW, 6, PW, 424);
    const scan = hide(div(stage, 'u5l7-scan', '', 4, y0, W - 8, RH - 6));
    const rows = d.rows.map(([s, c2, st, tag], i) => {
      const y = y0 + i * RH;
      const a = div(stage, 'u5l7-vrow', `<span class="u5l7-vn">${i + 1}</span>${T(s)}`, 16, y, PW - 64, RH - 8);
      const b = hide(div(stage, 'u5l7-vrow u5l7-vok', `<span class="u5l7-vn">${i + 1}</span>${T(c2)}`, 28 + PW, y, PW - 24, RH - 8));
      const mk = hide(div(stage, 'u5l7-vmk u5l7-vmk-' + st, st === 'ok' ? '✓' : st === 'err' ? '✗' : '≈', PW - 42, y + 12, 40, 40));
      const tg = st === 'ok' ? null : hide(div(stage, 'u5l7-vtag u5l7-vtag-' + st, tag, 0, y + RH - 26));
      if (tg) { tg.style.right = (W - PW + 2) + 'px'; tg.style.left = 'auto'; }
      return { a, b, mk, tg, st };
    });
    const fy = y0 + d.rows.length * RH + 6;
    const fin = hide(div(stage, 'u5l7-vfin', `${T(d.final)}`, 28 + PW, fy, PW - 24, 60));
    const vst = stampAt(stage, d.verdict, false, 8 + PW / 2, 392);
    const steps = d.rows.map((r, i) => ({ cap: r[4], run: async (c) => {
      const o = rows[i];
      scan.style.opacity = 1; await anim(c, scan, [{ top: scan.style.top }, { top: (y0 + i * RH - 4) + 'px' }], 420);
      await show(c, o.b);
      if (o.st === 'err') { o.a.classList.add('u5l7-vbad'); await shake(c, o.a); } else if (o.st === 'carry') o.a.classList.add('u5l7-vcarry');
      await pop(c, o.mk, 300); if (o.tg) await pop(c, o.tg, 300);
    } }));
    steps.push({ cap: d.vcap + T(d.final.replace(/\\approx.*/, '')) + '.', run: async (c) => { scan.style.opacity = 0; await stampIn(c, vst); await pop(c, fin, 420); } });
    return steps;
  }
};

/* =============================== explainer: the method race =============================== */
/* lanes: square roots, factoring, formula. Each: { lines: [TeX…], stuck: 'why' (at the end of its lines) } */
const RC = {
  a: { label: 'Example 6(a)', eq: '5x^2-45=0', win: 0, why: 'There is <b>no ' + T('x') + ' term</b>: square roots win.',
    lanes: [{ lines: ['x^2=9', 'x=\\pm3'] }, { lines: ['5(x^2-9)=0', '5(x-3)(x+3)=0', 'x=3\\ \\text{or}\\ x=-3'] }, { lines: ['a=5,\\ b=0,\\ c=-45', 'x=\\dfrac{0\\pm\\sqrt{0+900}}{10}', 'x=\\pm\\dfrac{30}{10}=\\pm3'] }] },
  b: { label: '(b)', eq: '(x-3)^2=12', win: 0, why: 'It is already <b>a square = a number</b>: square roots win.',
    lanes: [{ lines: ['x-3=\\pm\\sqrt{12}=\\pm2\\sqrt3', 'x=3\\pm2\\sqrt3'] }, { lines: ['x^2-6x-3=0'], stuck: 'no factors of −3 add to −6' }, { lines: ['x^2-6x-3=0', 'x=\\dfrac{6\\pm\\sqrt{36+12}}{2}', '=\\dfrac{6\\pm4\\sqrt3}{2}=3\\pm2\\sqrt3'] }] },
  c: { label: '(c)', eq: 'x^2-x-20=0', win: 1, why: 'The trinomial <b>factors easily</b>: factoring wins.',
    lanes: [{ lines: [], stuck: 'there is an x term' }, { lines: ['(x-5)(x+4)=0', 'x=5\\ \\text{or}\\ x=-4'] }, { lines: ['a=1,\\ b=-1,\\ c=-20', 'x=\\dfrac{1\\pm\\sqrt{1+80}}{2}=\\dfrac{1\\pm9}{2}', 'x=5\\ \\text{or}\\ x=-4'] }] },
  d: { label: '(d)', eq: '3x^2+5x-1=0', win: 2, why: 'It <b>does not factor</b>: the formula is the only finisher.',
    lanes: [{ lines: [], stuck: 'there is an x term' }, { lines: ['ac=-3:\\ 1,-3\\ \\text{or}\\ -1,3'], stuck: 'no pair adds to 5' }, { lines: ['a=3,\\ b=5,\\ c=-1', 'x=\\dfrac{-5\\pm\\sqrt{25+12}}{6}', 'x=\\dfrac{-5\\pm\\sqrt{37}}{6}'] }] }
};
const LANES = [['Square roots', COLORS.blue], ['Factoring', COLORS.green], ['Quadratic formula', COLORS.brand]];
const race = {
  title: 'Choosing a method: the race',
  height: 436, minW: 960,
  choices: Object.keys(RC).map((k) => ({ v: k, label: RC[k].label })),
  ask: (v) => `Which method solves ${T(RC[v].eq)} fastest?`,
  make(stage, v, ex) {
    const d = RC[v], W = ex.W, CW = (W - 36) / 3;
    const L = d.lanes.map((ln, i) => {
      const x = 8 + i * (CW + 10);
      const col = div(stage, 'u5l7-lane', `<div class="u5l7-lh" style="color:${LANES[i][1]}">${LANES[i][0]}</div>`, x, 6, CW, 424);
      const track = div(stage, 'u5l7-track', '<span class="u5l7-flag">🏁</span>', x + 12, 46, CW - 24, 40);
      const run = div(track, 'u5l7-runner', '🏃'); run.style.left = '0px';
      const lines = ln.lines.map((t, k) => hide(div(stage, 'u5l7-rl', `<span>${T(t)}</span>`, x + 12, 100 + k * 76, CW - 24, 66)));
      const stuck = ln.stuck ? hide(div(stage, 'u5l7-rl u5l7-rstuck', `<span>${ln.stuck.replace(/x term/, `${T('x')} term`)}</span>`, x + 12, 100 + ln.lines.length * 76, CW - 24, 66)) : null;
      const st = ln.stuck ? stampAt(stage, ln.lines.length ? 'STUCK' : "DOESN'T APPLY", false, x + CW / 2, 392) : i === d.win ? stampAt(stage, '🏆 FASTEST', true, x + CW / 2, 392) : stampAt(stage, 'works, but slower', null, x + CW / 2, 392, { rotate: -4 });
      return { ln, track, run, lines, stuck, st, done: false };
    });
    const steps = [{ cap: `Three methods race to solve ${T(d.eq)}. Each tick, every method writes <b>one line</b>.`, run: async (c) => { for (const l of L) await pulse(c, l.run, 1.25); } }];
    const ticks = Math.max(...d.lanes.map((l) => l.lines.length + (l.stuck ? 1 : 0)));
    for (let k = 0; k < ticks; k++) {
      const notes = [];
      L.forEach((l, i) => { const n = l.ln.lines.length; if (k < n) { if (k === n - 1 && !l.ln.stuck) notes.push(`${LANES[i][0].toLowerCase()} finishes`); } else if (k === n && l.ln.stuck) notes.push(`${LANES[i][0].toLowerCase()} is stuck: ${l.ln.stuck.replace(/x term/, `${T('x')} term`)}`); });
      steps.push({ cap: `Line ${k + 1}.` + (notes.length ? ' ' + notes.map((s) => s[0].toUpperCase() + s.slice(1)).join('. ') + '.' : ''),
        run: async (c) => {
          await Promise.all(L.map(async (l) => {
            const n = l.ln.lines.length, tw = parseFloat(l.track.style.width) - 52;
            if (k < n) { await Promise.all([show(c, l.lines[k]), tween(c, 500, (t) => { l.run.style.left = (tw * (k + t) / Math.max(n, 3)) + 'px'; })]); if (k === n - 1 && !l.ln.stuck) { l.run.textContent = '🙌'; if (l === L[d.win]) await stampIn(c, l.st); } }
            else if (k === n && l.stuck) { l.run.textContent = '🛑'; await show(c, l.stuck); await stampIn(c, l.st); }
          }));
        } });
    }
    steps.push({ cap: d.why + ' Every method that finishes gets the same roots.', run: async (c) => { for (const l of L) if (!l.ln.stuck && l !== L[d.win]) await stampIn(c, l.st); } });
    return steps;
  }
};

/* =============================== explainer: problems in context =============================== */
const FL = { ball: { label: 'Example 8(a): the ball' }, rect: { label: '(b): the rectangle' } };
const hB = (t) => -4.9 * t * t + 15 * t + 2;
const T1 = (-15 - Math.sqrt(264.2)) / -9.8, T0 = (-15 + Math.sqrt(264.2)) / -9.8;
const flight = {
  title: 'Solve, then reject what makes no sense',
  height: 436, minW: 960, capH: 84,
  choices: Object.keys(FL).map((k) => ({ v: k, label: FL[k].label })),
  ask: (v) => (v === 'ball' ? `A ball's height is ${T('h=-4.9t^2+15t+2')} metres. When does it hit the ground?` : `A rectangle is 6 cm longer than it is wide, with area ${T('24\\text{ cm}^2')}. Find its dimensions and perimeter.`),
  make(stage, v, ex) { return v === 'ball' ? ballSteps(stage, ex) : rectSteps(stage, ex); }
};
function ballSteps(stage, ex) {
  const W = ex.W, H = 436, SW = 170, PW = 300, GX = SW + 18, GW = W - GX - PW - 18;
  /* the scene: a tall strip with a ruler, the thrower and the ball */
  const sc = div(stage, 'u5l7-sky', '', 6, 6, SW, H - 12);
  const gy = H - 12 - 40, ppm = (gy - 30) / 15, yOf = (hm) => gy - hm * ppm;
  for (let m = 0; m <= 14; m += 2) { const tk = div(sc, 'u5l7-tick', `${m}`, 4, yOf(m) - 10); tk.style.position = 'absolute'; }
  div(sc, 'u5l7-ground', '', 0, gy, SW, 40);
  div(sc, 'u5l7-thrower', '🧍', 62, gy - 46);
  const ball = div(sc, 'u5l7-bball', '', 100, yOf(2) - 11, 22, 22);
  const clock = div(stage, 'u5l7-clock', T('t=0.00\\text{ s}'), 30, 14, 130, 36);
  const G = new Graph(stage, { x: GX, y: 20, width: GW, height: H - 24, xmin: -0.6, xmax: 3.6, ymin: -2, ymax: 15, xstep: 0.5, xlabels: 1, ylabels: 2, xtitle: 't', ytitle: 'h', fontSize: 15 });
  const o = { from: 0, to: 0.0001, color: CR }, cur = G.fn(hB, o);
  const back = hide(G.fn(hB, { from: T0 - 0.02, to: 0, color: NO, dash: true }));
  const dot = G.point(0, 2, { color: CR });
  const P = panel(stage, W - PW - 6, 6, PW, H - 12, 'Ground: h = 0');
  const pl = [
    lineIn(P, T('-4.9t^2+15t+2=0')), lineIn(P, T(`${cA('a')}=-4.9,\\ ${cB('b')}=15,\\ ${cC('c')}=2`)),
    lineIn(P, T('t=\\dfrac{-15\\pm\\sqrt{225-4(-4.9)(2)}}{2(-4.9)}')), lineIn(P, T(`t=\\dfrac{-15\\pm\\sqrt{${cD('264.2')}}}{-9.8}`)),
    lineIn(P, T(`t\\approx${fx(T1, 2)}\\ \\text{or}\\ t\\approx${fx(T0, 2)}`), 'u5l7-strong')];
  const pR = G.point(T1, 0, { color: OK, label: T(`${fx(T1, 2)}`), pos: 'n' }), pN = G.point(T0, 0, { color: NO, label: T(`${fx(T0, 2)}`), pos: 'nw' });
  [pR, pN].forEach((p) => { hide(p); hide(p.label); });
  const stN = stampAt(stage, 'REJECT t < 0', false, W - PW / 2 - 6, 296, { rotate: -5 });
  const stY = stampAt(stage, 'LANDS AT 3.2 s', true, W - PW / 2 - 6, 370, { rotate: -3 });
  const setT = (t) => { o.to = Math.max(0.0001, t); cur._bkDraw(); G.moveTo(dot, t, hB(t)); ball.style.top = (yOf(Math.max(0, hB(t))) - 11) + 'px'; clock.innerHTML = T(`t=${t.toFixed(2)}\\text{ s}`); };
  return [
    { cap: `The ball starts ${T('2')} m up (${T('t=0')}). Watch the ball and its graph together.`, run: (c) => pulse(c, ball, 1.4) },
    { cap: 'Throw! The graph records the height at every moment. The ball lands when the height is <b>0</b>.', run: (c) => tween(c, 3200, (t) => setT(T1 * t), linear) },
    { cap: `Ground means ${T('h=0')}: solve ${T('-4.9t^2+15t+2=0')}. It does not factor, so use the formula, with ${T('a=-4.9')}.`, run: async (c) => { for (const l of pl.slice(0, 4)) await show(c, l); } },
    { cap: `Two roots: ${T(`t\\approx${fx(T1, 2)}`)} and ${T(`t\\approx${fx(T0, 2)}`)}. The second one is where the curve, run backwards, would meet the ground.`,
      run: async (c) => { await show(c, pl[4]); back.style.opacity = ''; await G.drawIn(back, 600, c); await Promise.all([pop(c, pR), show(c, pR.label), pop(c, pN), show(c, pN.label)]); } },
    { cap: `Reject ${T(`t\\approx${fx(T0, 2)}`)}: a negative time is <b>before the throw</b>. The ball hits the ground after about <b>3.2 s</b>.`, run: async (c) => { await stampIn(c, stN); await stampIn(c, stY); } }
  ];
}
function rectSteps(stage, ex) {
  const W = ex.W, H = 436, PW = 360, k = 54, w0 = -3 + Math.sqrt(33), L0 = w0 + 6;
  const fig = div(stage, 'u5l7-rfig', '', 6, 6, W - PW - 18, 300);
  const FW = W - PW - 18, rx = (FW - L0 * k) / 2, ry = 60, rw = L0 * k, rh = w0 * k;
  const svg = svgEl('svg', { width: FW, height: 300, viewBox: `0 0 ${FW} 300` }, fig); svg.style.position = 'absolute'; svg.style.left = '0px'; svg.style.top = '0px';
  svgEl('rect', { x: rx, y: ry, width: rw, height: rh, fill: '#f6e9ef', stroke: '#1c2230', 'stroke-width': 3 }, svg);
  const per = svgEl('rect', { x: rx, y: ry, width: rw, height: rh, fill: 'none', stroke: CR, 'stroke-width': 7, 'stroke-linejoin': 'round' }, svg);
  const len = 2 * (rw + rh); per.setAttribute('stroke-dasharray', `${len} ${len}`); per.setAttribute('stroke-dashoffset', len);
  const lw = div(fig, 'u5l7-rlab', T('w'), rx - 52, ry + rh / 2 - 16), ll = div(fig, 'u5l7-rlab', T('w+6'), rx + rw / 2 - 30, ry + rh + 10);
  const area = div(fig, 'u5l7-rlab u5l7-rarea', T('24\\text{ cm}^2'), rx + rw / 2 - 50, ry + rh / 2 - 18);
  const nl = new NumberLine(stage, { x: 10, y: 316, width: W - PW - 26, height: 110, min: -10, max: 4, step: 1, labelStep: 2 });
  const pN = hide(nl.point(-3 - Math.sqrt(33), { color: 'red', label: T('-8.74') })), pY = hide(nl.point(w0, { color: 'green', label: T('2.74') }));
  const stN = stampAt(stage, "REJECT: width can't be negative", false, 300, 334, { rotate: -4 });
  const P = panel(stage, W - PW - 6, 6, PW, H - 12, 'Width w, length w + 6');
  const pl = [lineIn(P, T('w(w+6)=24')), lineIn(P, T('w^2+6w-24=0')),
    lineIn(P, T(`w=\\dfrac{-6\\pm\\sqrt{36+96}}{2}=\\dfrac{-6\\pm2\\sqrt{33}}{2}`)), lineIn(P, T('w=-3\\pm\\sqrt{33}'), 'u5l7-strong'),
    lineIn(P, `Width ${T('-3+\\sqrt{33}\\approx2.74')} cm<br>Length ${T('3+\\sqrt{33}\\approx8.74')} cm`, 'u5l7-strong'),
    lineIn(P, `Perimeter ${T('=2(-3+\\sqrt{33}+3+\\sqrt{33})')}<br>${T('=4\\sqrt{33}\\approx22.98')} cm`, 'u5l7-strong')];
  return [
    { cap: `Let the width be ${T('w')}. The length is ${T('w+6')}, and length × width = area: ${T('w(w+6)=24')}.`, run: (c) => show(c, pl[0]) },
    { cap: `Standard form: ${T('w^2+6w-24=0')}. It does not factor, so use the formula.`, run: async (c) => { await show(c, pl[1]); await show(c, pl[2]); await show(c, pl[3]); } },
    { cap: `Two roots: ${T('w\\approx2.74')} and ${T('w\\approx-8.74')}. Reject the negative one: a width can't be negative.`, run: async (c) => { await pop(c, pY); await pop(c, pN); await stampIn(c, stN); } },
    { cap: `Width ${T('-3+\\sqrt{33}\\approx2.74')} cm, length ${T('3+\\sqrt{33}\\approx8.74')} cm. The rectangle is drawn to scale.`, run: async (c) => { await show(c, pl[4]); lw.innerHTML = T('2.74'); ll.innerHTML = T('8.74'); await pulse(c, area, 1.1); } },
    { cap: `Perimeter: the two ${T('\\pm3')} parts cancel, leaving ${T('4\\sqrt{33}\\approx22.98')} cm.`, run: async (c) => { await tween(c, 1400, (t) => per.setAttribute('stroke-dashoffset', len * (1 - t)), linear); await show(c, pl[5]); } }
  ];
}

/* =============================== Math History: Brahmagupta's rule (SMIL, replayable) =============================== */
(function history() {
  const svg = document.getElementById('u5l7-hist'); if (!svg) return;
  const lines = [
    ['the number × 4 × the square', '39 × 4 × 1 = 156'],
    ['add the square of the middle term', '156 + 10² = 256'],
    ['the square root of the same', '√256 = 16'],
    ['less the middle term', '16 − 10 = 6'],
    ['divided by twice the square', '6 ÷ 2 = 3']];
  const t0 = 1.2, dt = 1.5;
  let s = '<rect x="10" y="10" width="580" height="280" rx="26" fill="#e8c98f" stroke="#8a6440" stroke-width="4"/>'
    + '<rect x="24" y="24" width="552" height="252" rx="18" fill="#f3dfb1" stroke="#c9a77d" stroke-width="2"/>'
    + '<circle cx="44" cy="150" r="9" fill="#8a6440"/><circle cx="556" cy="150" r="9" fill="#8a6440"/>'
    + '<text x="300" y="62" text-anchor="middle" font-family="Georgia, serif" font-size="30" font-weight="700" fill="#4a2c14">x² + 10x = 39</text>';
  lines.forEach(([w, n], i) => {
    const y = 104 + i * 36, b = (t0 + i * dt).toFixed(2);
    s += `<g opacity="0"><animate attributeName="opacity" from="0" to="1" begin="${b}s" dur=".6s" fill="freeze"/>`
      + `<text x="70" y="${y}" font-family="Georgia, serif" font-size="19" font-style="italic" fill="#6b4a2c">${w}</text>`
      + `<text x="540" y="${y}" text-anchor="end" font-family="Georgia, serif" font-size="23" font-weight="700" fill="#7a1f3d">${n}</text></g>`;
  });
  const bf = (t0 + lines.length * dt).toFixed(2);
  s += `<g opacity="0"><animate attributeName="opacity" from="0" to="1" begin="${bf}s" dur=".6s" fill="freeze"/><rect x="232" y="266" width="136" height="10" rx="5" fill="#7a1f3d" opacity=".25"/></g>`;
  s += `<g opacity="0"><animate attributeName="opacity" from="0" to="1" begin="${bf}s" dur=".6s" fill="freeze"/><circle cx="520" cy="62" r="30" fill="#fffaf1" stroke="#7a1f3d" stroke-width="4"/><text x="520" y="72" text-anchor="middle" font-family="Georgia, serif" font-size="28" font-weight="700" fill="#7a1f3d">3</text></g>`;
  const keys = lines.map((_, i) => `0 ${i * 36}`).join(';');
  s += `<g><animateTransform attributeName="transform" type="translate" values="${keys}" keyTimes="${lines.map((_, i) => (i / (lines.length - 1)).toFixed(3)).join(';')}" calcMode="discrete" begin="${t0}s" dur="${(lines.length * dt).toFixed(2)}s" fill="freeze"/><text x="44" y="108" font-size="26">🪶</text></g>`;
  svg.innerHTML = s;
  const play = () => { try { svg.setCurrentTime(0); svg.unpauseAnimations(); } catch (e) { /* no SMIL */ } };
  svg.addEventListener('click', play);
  const btn = svg.closest('.hist-anim') && svg.closest('.hist-anim').querySelector('.hist-play'); if (btn) btn.addEventListener('click', play);
})();

/* =============================== Stand Up Break =============================== */
const coef = (k) => (k < 0 ? `(${k})` : `${k}`);
const solveLines = (a, b, c) => {
  const q = qf(a, b, c, { color: false });
  const out = [`a=${a},\\ b=${b},\\ c=${c}`, `x=\\dfrac{${-b}\\pm\\sqrt{${q.discv}}}{${2 * a}}`];
  out.push(q.l1);
  if (q.l2) out.push(q.l2);
  if (q.fin) out.push(q.fin);
  return { q, out };
};
const goodD = (a, b, c) => { const D = b * b - 4 * a * c; return D > 0 && !Number.isInteger(Math.sqrt(D)); };
standup('u5l7', {
  intro: 'At your whiteboard: standard form, read a, b and c with their signs, and simplify all the way.',
  levels: {
    BEG: (r) => { // x² + bx + c = 0 with roots p ± √m
      const p = r.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]), m = r.pick([2, 3, 5, 6, 7, 10, 11, 13]), b = -2 * p, c = p * p - m;
      const { out } = solveLines(1, b, c);
      return { text: 'Solve with the quadratic formula. Give exact roots in simplest form.', q: `${poly(1, b, c)}=0`, a: out };
    },
    PRG: (r) => {
      let a, b, c, n = 0;
      do { a = r.pick([2, 3, 4, 5]); b = r.int(-9, 9); c = r.int(-9, 9); n++; } while ((!b || !c || !goodD(a, b, c) || gcd(gcd(a, b), c) > 1) && n < 400);
      const { q, out } = solveLines(a, b, c);
      out.push(`x\\approx${fx(q.dec[0], 1)}\\ \\text{or}\\ x\\approx${fx(q.dec[1], 1)}`);
      return { text: 'Solve. Give exact roots in simplest form and roots to the nearest tenth.', q: `${poly(a, b, c)}=0`, a: out };
    },
    MAS: (r) => {
      if (r.chance(0.5)) { // x(x + p) = qx + s  →  x² + (p − q)x − s = 0
        let p, q, s, n = 0;
        do { p = r.int(-6, 6); q = r.int(-6, 6); s = r.int(1, 12); n++; } while ((p === 0 || p === q || !goodD(1, p - q, -s)) && n < 400);
        const { out } = solveLines(1, p - q, -s);
        const rhs = `${q === 0 ? '' : q === 1 ? 'x' : q === -1 ? '-x' : q + 'x'}${q === 0 ? s : '+' + s}`;
        return { text: 'Write in standard form, then solve. Give exact roots in simplest form.', q: `x(${poly(0, 1, p)})=${rhs}`, a: [`${poly(1, p, 0)}=${rhs}`, `${poly(1, p - q, -s)}=0`, ...out.slice(1)] };
      }
      let a, b, c, k, n = 0; // k(ax² + bx) = −kc: a common factor to divide out first
      do { a = r.pick([1, 2]); b = r.int(-8, 8); c = r.int(-8, -1); k = r.pick([2, 3, 4, 5]); n++; } while ((!b || !goodD(a, b, c) || gcd(gcd(a, b), c) > 1) && n < 400);
      const { out } = solveLines(a, b, c);
      return { text: 'Write in standard form, then solve. Give exact roots in simplest form.', q: `${poly(k * a, k * b, 0)}=${-k * c}`,
        a: [`${poly(k * a, k * b, k * c)}=0`, `\\text{divide by }${k}:\\ ${poly(a, b, c)}=0`, ...out.slice(1)] };
    }
  }
});

/* =============================== mount =============================== */
export const explainers = mountExplainers({ machine, zeros, verdict, race, flight });
export const _test = { qf, MC, VD, RC, ZR, poly };
