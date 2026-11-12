/* Math 20-1 · Unit 8 · Lesson 2 — Solving Quadratic–Quadratic Systems.
 * New lesson format (2026-11-11): the warm-up ("The Marble Race") is plain markup on the page (no code). Explainers:
 *   meet     (STAR, hands-on: y = x² − 2 stays put while the red parabola slides up and down (a slider) and flips
 *             (a button); the meeting points light up and a counter reads 2, 1, 0 or ∞: two crossings, the
 *             touch, apart, a vertical translation that never meets, and the same parabola (every point glows)),
 *   machine  (the procedure, numbered 1–4, beside the "subtract machine": the two equations go in, y − y cancels,
 *             0 = (difference) comes out and the DIFFERENCE PARABOLA is drawn under the two parabolas on the same
 *             x-scale. Its zeros are the x-coordinates of the solutions: dashed lines rise from them to the meeting
 *             points. Then substitute into an ORIGINAL equation (a ✗ for substituting into the difference) and
 *             verify in the other. Example 3(a), 3(b) and Example 4(b)),
 *   cancel   (Example 5 as a verdict comparison: three columns, the x²-terms cross out, the leftover is linear
 *             (one), false (none) or true (infinitely many), a stamp and a little graph for each),
 *   count    (Examples 6 and 7: the two parabolas over their difference parabola, with the discriminant on a sign
 *             meter. Example 7 is hands-on: a k slider moves y = x² + k; the difference 2x² − 4x + k and
 *             16 − 8k change live, and the tangent moment k = 2 glows),
 *   fountain (Example 8(b): water droplets fly along the two jets; set equal, clear the decimal (× −2), the formula;
 *             the crossing at (0.54, 2.93) lights up, then the window zooms down to show the equations' other
 *             meeting point underground at (7.46, −10.93): rejected).
 * Colours for the lesson: first parabola blue, second red, solutions (meeting points) amber as in Lesson 1, the
 * difference parabola purple (its zeros amber too: they are the solutions' x-coordinates); the verdicts green / amber /
 * red as b² − 4ac > 0, = 0, < 0. Calculator allowed. */
import {
  h, tex, add, box, Graph, stamp, stampIn, mountExplainers, pop, fadeIn, anim, sleep, tween, svgEl, pulse, shake,
  linear, COLORS, texNum, liveCtx
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const P1 = COLORS.blue, P2 = COLORS.red, SOL = COLORS.amber, DIF = COLORS.purple, ZER = COLORS.amber, INK = COLORS.ink;
const show = (c, el, ms = 320) => fadeIn(c, el, ms);
const hide = (el) => { if (el) el.style.opacity = 0; if (el && el.label) el.label.style.opacity = 0; return el; };
const unhide = (el) => { if (el) el.style.opacity = ''; if (el && el.label) el.label.style.opacity = ''; return el; };
const popP = (c, p) => Promise.all([pop(c, unhide(p)), p.label ? show(c, p.label) : null]);
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
const absSvg = (stage, w, hh, x = 0, y = 0, cls = '') => { const s = svgEl('svg', { width: w, height: hh, viewBox: `0 0 ${w} ${hh}`, class: cls }, stage); s.style.position = 'absolute'; s.style.left = x + 'px'; s.style.top = y + 'px'; s.style.pointerEvents = 'none'; return s; };
const tn = (v) => texNum(v, 2);
const near = (a, b, e = 1e-9) => Math.abs(a - b) < e;
const isInt = (v) => near(v, Math.round(v), 1e-9);
/** TeX of ax² + bx + c */
export function poly(co) {
  const [a, b, c] = co; let s = '';
  const term = (k, v) => { if (near(k, 0)) return; const sg = k < 0 ? '-' : s ? '+' : ''; const ak = Math.abs(k); s += sg + (v && near(ak, 1) ? '' : tn(ak)) + v; };
  term(a, 'x^2'); term(b, 'x'); term(c, ''); return s || '0';
}
const ev = (co) => (x) => co[0] * x * x + co[1] * x + co[2];
const sub3 = (p, q) => [p[0] - q[0], p[1] - q[1], p[2] - q[2]];
const pairT = (x, y, approx) => (approx ? `(${tn(x)},\\ ${tn(y)})` : `(${tn(x)},\\ ${tn(y)})`);
/* a pulsing ring (a touching point) */
const glowRing = (layer) => { const g = svgEl('circle', { r: 17, class: 'u8l2-glow' }, layer); g.style.display = 'none'; return g; };
const placeRing = (ring, G, x, y, on) => { const [px, py] = G.toPx(x, y); ring.setAttribute('cx', px); ring.setAttribute('cy', py); ring.style.display = on ? '' : 'none'; };
/* a numbered row for step-by-step procedures (the step number beside each step as it appears) */
const row = (host, n, html, cls = '') => { const r = h('div', 'u8l2-row' + (cls ? ' ' + cls : ''), `<span class="u8l2-n">${n}</span><div class="u8l2-rc">${html}</div>`); r.style.opacity = 0; host.appendChild(r); return r; };
const WORD = { 0: 'no solution', 1: 'one solution', 2: 'two solutions', Infinity: 'infinitely many solutions' };
const KCLS = { 0: 'u8l2-k0', 1: 'u8l2-k1', 2: 'u8l2-k2', Infinity: 'u8l2-ki' };
const setKind = (el, k) => { Object.values(KCLS).forEach((c) => el.classList.remove(c)); if (k != null) el.classList.add(KCLS[k]); };
/** a slider in a pill: { el, inp, val } */
function slider(lab, min, max, step, aria) {
  const el = h('label', 'u8l2-sl no-ink', `<span class="u8l2-sll">${lab}</span><input type="range" min="${min}" max="${max}" step="${step}" aria-label="${aria}"><span class="u8l2-slv"></span>`);
  el.setAttribute('data-tap', '');
  return { el, inp: el.querySelector('input'), val: el.querySelector('.u8l2-slv') };
}

/* ======================= explainer: two parabolas, slide one (STAR, hands-on) ======================= */
const meet = {
  title: 'Slide one parabola: where do they meet?',
  height: 440, minW: 880, tap: false, capH: 92,
  ask: () => `${T('y=x^2-2')} stays put. Move the red parabola: how many points can the two parabolas share?`,
  make(stage, v, ex) {
    const W = ex.W, GW = 450, PX = GW + 28, PW = W - PX;
    const S = { a: -1, c: 6 };
    const G = new Graph(stage, { x: 0, y: 0, width: GW, height: 440, xmin: -5, xmax: 5, ymin: -6, ymax: 9, ylabels: 2, fontSize: 15, pad: [28, 18, 18, 18] });
    const glow = G.fn('x^2-2', { color: SOL, width: 16, opacity: 0.32 }); glow.style.display = 'none';
    G.fn('x^2-2', { color: P1, width: 4.5 });
    const c2 = G.fn((x) => S.a * x * x + S.c, { color: P2, width: 4.5 });
    const pts = [0, 1].map((i) => G.point(0, 0, { color: SOL, r: 9, label: '', pos: i ? 'ne' : 'nw' }));
    const ring = glowRing(G.layers.top);
    const P = div(stage, 'u8l2-pn', '', PX, 0, PW);
    const e1 = h('div', 'u8l2-eq u8l2-cb', T('y=x^2-2')), e2 = h('div', 'u8l2-eq u8l2-cr', ''); P.append(e1, e2);
    const sl = slider('move', -6, 8, 0.5, 'move the red parabola up or down');
    const flip = h('button', 'pill u8l2-flip', 'Flip ⇅'); flip.type = 'button';
    const cr = h('div', 'u8l2-ctlrow'); cr.append(sl.el, flip); P.appendChild(cr);
    const cnt = h('div', 'u8l2-cnt', '<div class="u8l2-cnt-h">meeting points</div><div class="u8l2-cnt-v"></div><div class="u8l2-cnt-s"></div>'); P.appendChild(cnt);
    const cv = cnt.querySelector('.u8l2-cnt-v'), cs = cnt.querySelector('.u8l2-cnt-s');
    const list = h('div', 'u8l2-list'); P.appendChild(list);
    const upd = () => {
      const A = 1 - S.a, K = 2 + S.c; let n, xs = [];
      if (Math.abs(A) < 1e-9) n = Math.abs(K) < 1e-9 ? Infinity : 0;
      else { const r = K / A; if (r > 1e-9) { n = 2; xs = [-Math.sqrt(r), Math.sqrt(r)]; } else if (Math.abs(r) <= 1e-9) { n = 1; xs = [0]; } else n = 0; }
      c2._bkDraw();
      c2.path.setAttribute('stroke-dasharray', n === Infinity ? '12 12' : '');
      glow.style.display = n === Infinity ? '' : 'none';
      const lines = [];
      pts.forEach((p, i) => {
        if (i < xs.length) {
          const x = xs[i], y = x * x - 2, ex2 = isInt(x);
          G.moveTo(p, x, y); unhide(p);
          const t = ex2 ? pairT(x, y) : `\\approx${pairT(x, y)}`; p.label.innerHTML = T(t); lines.push(t);
        } else hide(p);
      });
      placeRing(ring, G, 0, -2, n === 1);
      const aT = Math.abs(S.a) < 0.04 ? null : near(S.a, -1) ? '-' : near(S.a, 1) ? '' : tn(S.a);
      const cT = near(S.c, 0) ? '' : S.c > 0 ? '+' + tn(S.c) : tn(S.c);
      e2.innerHTML = T(aT === null ? `y=${tn(S.c)}` : `y=${aT}x^2${cT}`);
      sl.inp.value = S.c; sl.val.textContent = tn(S.c).replace('-', '−');
      cv.textContent = n === Infinity ? '∞' : String(n); cs.textContent = WORD[n];
      list.innerHTML = n === Infinity ? 'every point of the parabola' : n === 0 ? 'the parabolas never meet' : lines.map((t) => T(t)).join('<br>');
      setKind(cnt, n);
    };
    sl.inp.addEventListener('input', () => { S.c = parseFloat(sl.inp.value); upd(); });
    const goTo = (c, a, cc, ms) => { const a0 = S.a, c0 = S.c; return tween(c, ms, (u) => { S.a = a0 + (a - a0) * u; S.c = Math.round((c0 + (cc - c0) * u) * 20) / 20; upd(); }).then(() => { S.a = a; S.c = cc; upd(); }); };
    flip.addEventListener('click', () => goTo(liveCtx(), near(S.a, 1) ? -1 : 1, S.c, 900));
    upd();
    return [
      { cap: `The red parabola ${T('y=-x^2+6')} crosses ${T('y=x^2-2')} at <b>two points</b>, ${T('(-2,\\ 2)')} and ${T('(2,\\ 2)')}: the system has <b>two solutions</b>.`,
        run: async (c) => { await goTo(c, -1, 6, 400); await Promise.all(pts.map((p) => pulse(c, p, 1.5))); } },
      { cap: `Slide it down: the two meeting points slide together. At ${T('y=-x^2-2')} the parabolas just <b>touch</b> at ${T('(0,\\ -2)')}: <b>one solution</b>.`,
        run: async (c) => { await goTo(c, -1, -2, 1800); await pulse(c, cnt, 1.06); } },
      { cap: `Keep going: the parabolas pull apart and share <b>no points</b>. The system has <b>no solution</b>.`,
        run: (c) => goTo(c, -1, -5, 1200) },
      { cap: `Flip it to open up: ${T('y=x^2+4')}. It is ${T('y=x^2-2')} moved <b>6 up</b> (a vertical translation): the two never meet. <b>No solution.</b>`,
        run: (c) => goTo(c, 1, 4, 1800) },
      { cap: `Slide ${T('y=x^2+4')} down to ${T('y=x^2-2')}: it lands <b>exactly on</b> the blue parabola. Every point is shared: <b>infinitely many solutions</b>.`,
        run: async (c) => { await goTo(c, 1, -2, 1600); await pulse(c, cnt, 1.08); } },
      { cap: `<b>Your turn:</b> drag the slider and press Flip. Two, one, none or infinitely many: there is no other possibility.`,
        run: async (c) => { await goTo(c, -1, 2, 1000); await pulse(c, cr, 1.04); } }
    ];
  }
};

/* ================= the two parabolas over their difference parabola (shared by machine and count) ================= */
function twin(stage, x, y, w, h1, h2, gap, w1, w2) {
  const G1 = new Graph(stage, Object.assign({ x, y, width: w, height: h1, fontSize: 14, pad: [24, 16, 12, 16] }, w1));
  const G2 = new Graph(stage, Object.assign({ x, y: y + h1 + gap, width: w, height: h2, fontSize: 14, ytitle: '', pad: [12, 16, 12, 16] }, w2));
  const ov = absSvg(stage, w, h1 + gap + h2, x, y, 'u8l2-ov');
  const dl = div(stage, 'u8l2-dlab', 'the difference', x + 24, y + h1 + gap + 6);
  const links = [];
  const link = (xv, yv, color = ZER) => {
    const [px, p1] = G1.toPx(xv, yv), p2 = G2.toPx(xv, 0)[1] + h1 + gap;
    const l = svgEl('line', { x1: px, x2: px, y1: p2, y2: p2, stroke: color, 'stroke-width': 3, 'stroke-dasharray': '7 6' }, ov);
    l.to = p1; l.from = p2; links.push(l); return l;
  };
  const rise = (c, l, ms = 700) => tween(c, ms, (u) => l.setAttribute('y2', l.from + (l.to - l.from) * u));
  const clearLinks = () => { links.forEach((l) => l.remove()); links.length = 0; };
  return { G1, G2, ov, dl, link, rise, clearLinks, links };
}

/* ======================= explainer: the subtract machine and the procedure (Examples 3, 4(b)) ======================= */
const S3 = Math.sqrt(21);
const MCH = {
  a: { f: [1, -2, -4], g: [-1, 4, 4], w1: { xmin: -3, xmax: 6, ymin: -6, ymax: 10, ylabels: 2 }, w2: { xmin: -3, xmax: 6, ymin: -14, ymax: 10, ylabels: 5 },
    q: `${T('y=x^2-2x-4')} and ${T('y=-x^2+4x+4')}`,
    solve: ['2x^2-6x-8=0', 'x^2-3x-4=0', '(x-4)(x+1)=0'], xs: [4, -1], xT: ['4', '-1'], sol2: `${T('x=4')} or ${T('x=-1')}`,
    subEq: 'y=x^2-2x-4', subFrom: 'f', subs: ['x=4:\\ y=16-8-4=4', 'x=-1:\\ y=1+2-4=-1'],
    wrong: '2(4)^2-6(4)-8=0', chk: '(4,\\ 4):\\ -16+16+4=4\\ \\checkmark', chkIn: 'y=-x^2+4x+4',
    ans: `${T('(4,\\ 4)')} and ${T('(-1,\\ -1)')}`, pos: ['e', 'se'] },
  b: { f: [3, 2, -1], g: [1, -3, 2], w1: { xmin: -4, xmax: 2, ymin: -4, ymax: 22, ylabels: 4, ystep: 2 }, w2: { xmin: -4, xmax: 2, ymin: -8, ymax: 16, ylabels: 4, ystep: 2 },
    q: `${T('y=3x^2+2x-1')} and ${T('y=x^2-3x+2')}`,
    solve: ['2x^2+5x-3=0', '(2x-1)(x+3)=0'], xs: [0.5, -3], xT: ['\\tfrac{1}{2}', '-3'], sol2: `${T('x=\\tfrac{1}{2}')} or ${T('x=-3')}`,
    subEq: 'y=x^2-3x+2', subFrom: 'g', subs: ['x=\\tfrac{1}{2}:\\ y=\\tfrac{1}{4}-\\tfrac{3}{2}+2=\\tfrac{3}{4}', 'x=-3:\\ y=9+9+2=20'],
    chk: '(-3,\\ 20):\\ 27-6-1=20\\ \\checkmark', chkIn: 'y=3x^2+2x-1',
    ans: `${T('\\left(\\tfrac{1}{2},\\ \\tfrac{3}{4}\\right)')} and ${T('(-3,\\ 20)')}`, pos: ['se', 'e'] },
  c: { f: [1, 0, -3], g: [-2, 6, 1], w1: { xmin: -4, xmax: 5, ymin: -6, ymax: 8, ylabels: 2 }, w2: { xmin: -4, xmax: 5, ymin: -8, ymax: 10, ylabels: 4, ystep: 2 },
    q: `${T('y=x^2-3')} and ${T('y=-2x^2+6x+1')}, exactly`,
    solve: ['3x^2-6x-4=0', 'x=\\tfrac{6\\pm\\sqrt{36+48}}{6}=\\tfrac{3\\pm\\sqrt{21}}{3}'], xs: [(3 + S3) / 3, (3 - S3) / 3], xT: ['2.53', '-0.53'], approx: true,
    sol2: `${T('x=\\frac{3\\pm\\sqrt{21}}{3}')}, about ${T('2.53')} and ${T('-0.53')}`,
    subEq: 'y=x^2-3', subFrom: 'f', subs: ['y=\\tfrac{9\\pm6\\sqrt{21}+21}{9}-3=\\tfrac{1\\pm2\\sqrt{21}}{3}'],
    chk: '\\left(\\tfrac{3+\\sqrt{21}}{3},\\ \\tfrac{1+2\\sqrt{21}}{3}\\right),\\ \\left(\\tfrac{3-\\sqrt{21}}{3},\\ \\tfrac{1-2\\sqrt{21}}{3}\\right)',
    ans: `${T('\\approx(2.5,\\ 3.4)')} and ${T('\\approx(-0.5,\\ -2.7)')}`, pos: ['e', 'nw'] }
};
const machine = {
  title: 'The subtract machine', height: 520, minW: 920, capH: 96,
  choices: [{ sep: 'Example 3' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }, { sep: 'Example 4' }, { v: 'c', label: '(b) exact' }],
  ask: (v) => `Solve the system ${MCH[v].q}.`,
  make(stage, v, ex) {
    const D = MCH[v], W = ex.W, LW = 420, H1 = 300, H2 = 210, GAP = 10, PX = LW + 26, PW = W - PX;
    const d = sub3(D.f, D.g), fF = ev(D.f), gF = ev(D.g), dF = ev(d), dT = poly(d);
    const Z = twin(stage, 0, 0, LW, H1, H2, GAP, D.w1, D.w2), { G1, G2 } = Z;
    G1.fn(fF, { color: P1, width: 4 }); G1.fn(gF, { color: P2, width: 4 });
    const dc = G2.fn(dF, { color: DIF, width: 4 }); hide(dc); hide(Z.dl);
    const pts = D.xs.map((x, i) => G1.point(x, fF(x), { color: SOL, r: 8.5, label: T(D.approx ? `\\approx${pairT(x, fF(x))}` : pairT(D.xs[i], fF(x)).replace(tn(0.5), '\\tfrac{1}{2}').replace(tn(0.75), '\\tfrac{3}{4}')), pos: D.pos[i] }));
    const rings = D.xs.map((x) => { const r = svgEl('circle', { r: 11, fill: 'none', stroke: SOL, 'stroke-width': 3, 'stroke-dasharray': '4 4' }, G1.layers.top); const [px, py] = G1.toPx(x, fF(x)); r.setAttribute('cx', px); r.setAttribute('cy', py); r.style.opacity = 0; return r; });
    const zs = D.xs.map((x, i) => G2.point(x, 0, { color: ZER, r: 8, label: T(`x=${D.xT[i]}`), pos: x === Math.max(...D.xs) ? 'ne' : 'nw' }));
    pts.forEach(hide); zs.forEach(hide);
    // the machine and the steps
    const P = div(stage, 'u8l2-pn u8l2-pn2', '', PX, 0, PW);
    const M = h('div', 'u8l2-mach', `<div class="u8l2-mh"><span class="u8l2-n">1</span><b>Subtract</b><span class="u8l2-gear">⚙</span></div>
      <div class="u8l2-mr u8l2-cb"><span class="u8l2-mi"></span><span class="u8l2-yy">${T('y')}</span>${T('=' + poly(D.f))}</div>
      <div class="u8l2-mr u8l2-cr"><span class="u8l2-mi">−</span><span class="u8l2-yy">${T('y')}</span>${T('=' + poly(D.g))}</div>
      <div class="u8l2-mline"></div>
      <div class="u8l2-mr u8l2-cp u8l2-mout"><span class="u8l2-mi"></span><span class="u8l2-zero">${T('0')}</span>${T('=' + dT)}</div>`);
    P.appendChild(M);
    const gear = M.querySelector('.u8l2-gear'), yy = [...M.querySelectorAll('.u8l2-yy')], mout = M.querySelector('.u8l2-mout'), minus = M.querySelectorAll('.u8l2-mi')[1], mline = M.querySelector('.u8l2-mline');
    hide(mout); hide(minus); hide(mline);
    const rows = h('div', 'u8l2-rows'); P.appendChild(rows);
    const r2 = row(rows, 2, `<b>Solve</b> &nbsp;${D.solve.map((s) => T(s)).join(', &ensp;')}<br>${D.sol2}`);
    const r3 = row(rows, 3, `<b>Substitute</b> into an original: ${T(D.subEq)}<br>${D.subs.map((s) => T(s)).join('<br>')}${D.wrong ? `<div class="u8l2-wrong">${T('y=' + D.wrong)} <b>✗</b> <span>that is the difference, not ${T('y')}</span></div>` : ''}`);
    const wrong = r3.querySelector('.u8l2-wrong'); if (wrong) hide(wrong);
    const r4 = row(rows, 4, D.chkIn ? `<b>Verify</b> in ${T(D.chkIn)}: ${T(D.chk)}<br>Solutions: <b>${D.ans}</b>` : `<b>Write the pairs:</b> ${T(D.chk)}<br>${D.ans}, as on the calculator`);
    const steps = [
      { cap: `<b>Step 1: subtract</b> the equations. ${T('y-y=0')}, so ${T('y')} is eliminated: ${T(`0=${dT}`)}.`,
        run: async (c) => {
          await anim(c, gear, [{ transform: 'rotate(0)' }, { transform: 'rotate(360deg)' }], 900);
          await pop(c, unhide(minus)); await show(c, unhide(mline));
          yy.forEach((e) => e.classList.add('u8l2-x')); await Promise.all(yy.map((e) => pulse(c, e, 1.25)));
          await show(c, unhide(mout)); await pulse(c, mout, 1.06);
        } },
      { cap: `Graph it: the <b>difference parabola</b> ${T(`y=${dT}`)} (blue minus red). Where the parabolas meet, their difference is ${T('0')}.`,
        run: async (c) => { await show(c, unhide(Z.dl)); unhide(dc); await G2.drawIn(dc, 1000, c); } },
      { cap: `<b>Step 2: solve</b> ${T(`${dT}=0`)}: ${D.sol2}. These <b>zeros</b> of the difference are the ${T('x')}-coordinates of the solutions.`,
        run: async (c) => {
          await show(c, unhide(r2));
          await Promise.all(zs.map((z) => popP(c, z)));
          Z.clearLinks(); const ls = D.xs.map((x) => Z.link(x, fF(x)));
          await Promise.all(ls.map((l) => Z.rise(c, l, 800)));
          await Promise.all(rings.map((r) => pop(c, unhide(r))));
        } },
      { cap: `<b>Step 3: substitute</b> each ${T('x')} into an <b>original</b> equation (the simpler one) to get ${T('y')}.`,
        run: async (c) => { await show(c, unhide(r3)); rings.forEach(hide); await Promise.all(pts.map((p) => popP(c, p))); } }
    ];
    if (wrong) steps.push({ cap: `Not into ${T(`0=${dT}`)}: it gives ${T('0')} for every solution. That is the <b>difference</b> of the heights, not the height ${T('y')}.`,
      run: async (c) => { await show(c, unhide(wrong)); await shake(c, wrong); } });
    steps.push(D.chkIn
      ? { cap: `<b>Step 4: verify</b> in the <b>other</b> equation: ${T(D.chk)}. The solutions are ${D.ans}.`, run: async (c) => { await show(c, unhide(r4)); await Promise.all(pts.map((p) => pulse(c, p, 1.5))); } }
      : { cap: `<b>Step 4:</b> write the ordered pairs. Rounded, they are ${D.ans}: the same points the calculator found in (a).`, run: async (c) => { await show(c, unhide(r4)); await Promise.all(pts.map((p) => pulse(c, p, 1.5))); } });
    return steps;
  }
};

/* ======================= explainer: when the x²-terms cancel (Example 5, a verdict comparison) ======================= */
const CN = [
  { k: '(a)', f: 'y=x^2+4x+1', g: 'y=x^2-2x+7', fF: (x) => x * x + 4 * x + 1, gF: (x) => x * x - 2 * x + 7,
    l1: '0=\\cancel{x^2}+4x+1\\ \\cancel{-\\,x^2}+2x-7', l2: '0=6x-6', l3: 'x=1,\\ \\ y=1+4+1=6', st: 'One solution', ok: true, under: T('(1,\\ 6)'),
    win: { xmin: -3, xmax: 4, ymin: -2, ymax: 13, ylabels: 4, ystep: 2 }, pt: [1, 6] },
  { k: '(b)', f: 'y=2x^2-3x+1', g: 'y=2x^2-3x-4', fF: (x) => 2 * x * x - 3 * x + 1, gF: (x) => 2 * x * x - 3 * x - 4,
    l1: '0=\\cancel{2x^2}\\ \\cancel{-\\,3x}\\ +1\\ \\cancel{-\\,2x^2}\\ \\cancel{+\\,3x}\\ +4', l2: '0=5\\quad\\text{false}', st: 'No solution', ok: false, under: '5 units down: a vertical translation',
    win: { xmin: -2, xmax: 3.5, ymin: -7, ymax: 7, ylabels: 2 }, shift: true },
  { k: '(c)', f: 'y=2(x-1)^2+3', g: 'y=2x^2-4x+5', fF: (x) => 2 * (x - 1) * (x - 1) + 3, gF: (x) => 2 * x * x - 4 * x + 5,
    l1: '2(x-1)^2+3=2(x^2-2x+1)+3', l2: '=2x^2-4x+5\\ \\ \\text{(identical)}', l3: '0=0\\quad\\text{true}', st: 'Infinitely many', ok: null, under: 'the same parabola',
    win: { xmin: -1.5, xmax: 3.5, ymin: -1, ymax: 13, ylabels: 4, ystep: 2 }, same: true }
];
const cancel = {
  title: 'When the x²-terms cancel', height: 480, minW: 920, capH: 92,
  ask: () => `Example 5: solve each system, or explain why it has no solution or infinitely many.`,
  make(stage, v, ex) {
    const W = ex.W, GAPC = 14, CW = (W - 2 * GAPC) / 3;
    const cols = CN.map((D, i) => {
      const X = i * (CW + GAPC);
      const col = div(stage, 'u8l2-ccol', '', X, 0, CW, 480);
      col.innerHTML = `<div class="u8l2-ch">${D.k}</div><div class="u8l2-ce u8l2-cb">${T(D.f)}</div><div class="u8l2-ce u8l2-cr">${T(D.g)}</div>`;
      const l1 = h('div', 'u8l2-cl', T(D.l1)), l2 = h('div', 'u8l2-cl', T(D.l2)), l3 = h('div', 'u8l2-cl', D.l3 ? T(D.l3) : '');
      col.append(l1, l2, l3); [l1, l2, l3].forEach(hide);
      const sh = h('div', 'u8l2-csh'); col.appendChild(sh);
      const st = stamp(sh, D.st, { ok: D.ok, size: 'sm', rotate: -5 }); hide(st);
      const un = h('div', 'u8l2-cun', D.under); sh.appendChild(un); hide(un);
      const G = new Graph(stage, Object.assign({ x: X + 6, y: 300, width: CW - 12, height: 176, fontSize: 13, pad: [20, 14, 10, 14] }, D.win));
      let glow = null;
      if (D.same) { glow = G.fn(D.fF, { color: SOL, width: 14, opacity: 0.32 }); hide(glow); }
      const cf = G.fn(D.fF, { color: P1, width: 3.5 }), cg = G.fn(D.gF, { color: P2, width: 3.5, dash: D.same ? '9 9' : null });
      hide(cf); hide(cg);
      let pt = null, arr = null;
      if (D.pt) { pt = G.point(D.pt[0], D.pt[1], { color: SOL, r: 7.5 }); hide(pt); }
      if (D.shift) {
        const [ax, ay] = G.toPx(0.75, -0.125), [, by] = G.toPx(0.75, -5.125);
        arr = svgEl('g', {}, G.layers.top);
        svgEl('line', { x1: ax, x2: ax, y1: ay + 6, y2: by - 10, stroke: INK, 'stroke-width': 3 }, arr);
        svgEl('path', { d: `M${ax - 7} ${by - 14} L${ax} ${by - 2} L${ax + 7} ${by - 14} Z`, fill: INK }, arr);
        hide(arr);
      }
      return { D, l1, l2, l3, st, un, G, cf, cg, pt, arr, glow };
    });
    const graph = async (c, o) => { unhide(o.cf); unhide(o.cg); await Promise.all([o.G.drawIn(o.cf, 700, c), o.G.drawIn(o.cg, 700, c)]); };
    const [A, B, C] = cols;
    return [
      { cap: `(a) Subtract. The ${T('x^2')}-terms <b>cancel</b>, and what is left is <b>linear</b>: ${T('6x-6=0')}.`,
        run: async (c) => { await show(c, unhide(A.l1)); await show(c, unhide(A.l2)); } },
      { cap: `${T('x=1')}, and ${T('y=1+4+1=6')}. A linear equation has exactly one root: <b>one solution</b>, ${T('(1,\\ 6)')}. The parabolas cross once.`,
        run: async (c) => { await show(c, unhide(A.l3)); await stampIn(c, unhide(A.st)); await show(c, unhide(A.un)); await graph(c, A); await pop(c, unhide(A.pt)); } },
      { cap: `(b) Subtract: <b>every</b> ${T('x')}-term cancels and ${T('0=5')} is left. That is false for every ${T('x')}: <b>no solution</b>. The red parabola is the blue one moved ${T('5')} units down.`,
        run: async (c) => { await show(c, unhide(B.l1)); await show(c, unhide(B.l2)); await stampIn(c, unhide(B.st)); await show(c, unhide(B.un)); await graph(c, B); await show(c, unhide(B.arr)); } },
      { cap: `(c) Expand first: ${T('2(x-1)^2+3=2x^2-4x+5')}, the same equation. Subtracting leaves ${T('0=0')}, true for every ${T('x')}: <b>infinitely many solutions</b>.`,
        run: async (c) => { await show(c, unhide(C.l1)); await show(c, unhide(C.l2)); await show(c, unhide(C.l3)); await stampIn(c, unhide(C.st)); await show(c, unhide(C.un)); unhide(C.glow); await graph(c, C); } },
      { cap: `Same ${T('x^2')}-coefficient: the leftover is linear. ${T('mx=n')} gives <b>one</b> solution, a false ${T('0=n')} <b>none</b>, a true ${T('0=0')} <b>infinitely many</b>.`,
        run: async (c) => { await Promise.all(cols.map((o) => pulse(c, o.st, 1.12))); } }
    ];
  }
};

/* ======================= explainer: count the solutions (Examples 6 and 7) ======================= */
const CT = {
  a: { f: [1, 2, 3], g: [-1, -2, 1], fT: 'y=x^2+2x+3', gT: 'y=-x^2-2x+1', discT: '4^2-4(2)(2)=16-16', w1: { xmin: -4, xmax: 2, ymin: -4, ymax: 8, ylabels: 2 }, w2: { xmin: -4, xmax: 2, ymin: -2, ymax: 8, ylabels: 2 } },
  b: { f: [1, 0, 1], g: [-1, 2, -2], fT: 'y=x^2+1', gT: 'y=-x^2+2x-2', discT: '(-2)^2-4(2)(3)=4-24', w1: { xmin: -2, xmax: 3, ymin: -6, ymax: 8, ylabels: 2 }, w2: { xmin: -2, xmax: 3, ymin: -2, ymax: 12, ylabels: 4, ystep: 2 } },
  c: { f: [2, 0, -5], g: [1, 1, 1], fT: 'y=2x^2-5', gT: 'y=x^2+x+1', discT: '(-1)^2-4(1)(-6)=1+24', w1: { xmin: -3, xmax: 4, ymin: -6, ymax: 16, ylabels: 4, ystep: 2 }, w2: { xmin: -3, xmax: 4, ymin: -8, ymax: 8, ylabels: 4, ystep: 2 } },
  d: { f: [-1, 5, 0], g: [-1, 5, 2], fT: 'y=-x^2+5x', gT: 'y=-x^2+5x+2', flip: true, w1: { xmin: -1, xmax: 6, ymin: -4, ymax: 10, ylabels: 2 }, w2: { xmin: -1, xmax: 6, ymin: -3, ymax: 5, ylabels: 2 } },
  k: { k: true, g: [-1, 4, 0], gT: 'y=-x^2+4x', w1: { xmin: -2, xmax: 4, ymin: -5, ymax: 8, ylabels: 2 }, w2: { xmin: -2, xmax: 4, ymin: -7, ymax: 8, ylabels: 2 } }
};
const count = {
  title: 'Count the solutions', height: 480, minW: 920, capH: 96,
  choices: [{ sep: 'Example 6' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }, { v: 'c', label: '(c)' }, { v: 'd', label: '(d)' }, { sep: 'Example 7' }, { v: 'k', label: `Slide ${T('k')}` }],
  ask: (v) => (v === 'k' ? `${T('y=x^2+k')} and ${T('y=-x^2+4x')}: for which ${T('k')} is there one solution? two? none?` : `Without solving, how many solutions? ${T(CT[v].fT)} and ${T(CT[v].gT)}`),
  make(stage, v, ex) {
    const D = CT[v], W = ex.W, LW = 420, H1 = 280, H2 = 190, GAP = 10, PX = LW + 26, PW = W - PX;
    const S = { k: 0 };
    const fco = () => (D.k ? [1, 0, S.k] : D.f);
    const Z = twin(stage, 0, 0, LW, H1, H2, GAP, D.w1, D.w2), { G1, G2 } = Z;
    Z.dl.innerHTML = D.flip ? 'the difference (red − blue)' : 'the difference';
    const cf = G1.fn((x) => ev(fco())(x), { color: P1, width: 4 }), cg = G1.fn(ev(D.g), { color: P2, width: 4 });
    const dco = () => (D.flip ? sub3(D.g, fco()) : sub3(fco(), D.g));
    const dc = G2.fn((x) => ev(dco())(x), { color: DIF, width: 4 });
    const pts = [0, 1].map((i) => G1.point(0, 0, { color: SOL, r: 8.5, label: D.k ? '' : null, pos: i ? 'se' : 'nw' }));
    const zs = [0, 1].map(() => G2.point(0, 0, { color: ZER, r: 7.5 }));
    const ring = glowRing(G1.layers.top);
    // panel
    const P = div(stage, 'u8l2-pn u8l2-pn2', '', PX, 0, PW);
    const eqs = h('div', 'u8l2-eqs', `<div class="u8l2-eq2 u8l2-cb"></div><div class="u8l2-eq2 u8l2-cr">${T(D.gT)}</div>`); P.appendChild(eqs);
    const ef = eqs.firstChild;
    let sl = null;
    if (D.k) { sl = slider(T('k'), -4, 5, 0.25, 'the value of k'); sl.el.classList.add('u8l2-slb'); P.appendChild(sl.el); }
    const r1 = row(P, 1, ''), r2 = row(P, 2, '');
    const MW = PW, MH = 54, Dlo = -30, Dhi = 50, mx = (x) => 16 + (x - Dlo) / (Dhi - Dlo) * (MW - 32);
    const M = svgEl('svg', { width: MW, height: MH, viewBox: `0 0 ${MW} ${MH}`, class: 'u8l2-meter' }, P);
    svgEl('rect', { x: 16, y: 24, width: mx(0) - 16, height: 13, rx: 6.5, fill: COLORS.red, opacity: 0.85 }, M);
    svgEl('rect', { x: mx(0), y: 24, width: MW - 16 - mx(0), height: 13, rx: 6.5, fill: COLORS.green, opacity: 0.85 }, M);
    svgEl('rect', { x: mx(0) - 3, y: 18, width: 6, height: 25, rx: 3, fill: COLORS.amber }, M);
    [['negative', 40, 'start'], ['0', mx(0), 'middle'], ['positive', MW - 40, 'end']].forEach(([t, x, a]) => { const e = svgEl('text', { x, y: 53, 'text-anchor': a, class: 'u8l2-mt' }, M); e.textContent = t; });
    const needle = svgEl('path', { d: 'M0 20 L-9 3 L9 3 Z', fill: INK }, M);
    const verd = h('div', 'u8l2-verd'); P.appendChild(verd);
    const sumK = D.k ? h('div', 'u8l2-sumk', `<span class="u8l2-c2">two: ${T('k<2')}</span><span class="u8l2-c1">one: ${T('k=2')}</span><span class="u8l2-c0">none: ${T('k>2')}</span>`) : null;
    if (sumK) { P.appendChild(sumK); hide(sumK); }
    let st = {};
    const upd = () => {
      const f = fco(), d = dco(), dT = poly(d);
      cf._bkDraw(); dc._bkDraw();
      ef.innerHTML = T(D.k ? `y=x^2${near(S.k, 0) ? '' : S.k > 0 ? '+' + tn(S.k) : tn(S.k)}` : D.fT);
      if (sl) { sl.inp.value = S.k; sl.val.textContent = tn(S.k).replace('-', '−'); }
      let n, xs = [], disc = null;
      if (near(d[0], 0)) { n = near(d[1], 0) ? (near(d[2], 0) ? Infinity : 0) : 1; if (n === 1) xs = [-d[2] / d[1]]; }
      else {
        disc = d[1] * d[1] - 4 * d[0] * d[2]; disc = Math.round(disc * 1e6) / 1e6;
        if (disc > 1e-9) { const s = Math.sqrt(disc); xs = [(-d[1] - s) / (2 * d[0]), (-d[1] + s) / (2 * d[0])].sort((p, q) => p - q); n = 2; }
        else if (Math.abs(disc) <= 1e-9) { xs = [-d[1] / (2 * d[0])]; n = 1; } else n = 0;
      }
      const fF = ev(f);
      [0, 1].forEach((i) => {
        if (i < xs.length) { G1.moveTo(pts[i], xs[i], fF(xs[i])); G2.moveTo(zs[i], xs[i], 0); if (pts[i].label) pts[i].label.innerHTML = T((isInt(xs[i]) ? '' : '\\approx') + pairT(xs[i], fF(xs[i]))); }
      });
      st = { n, xs, disc, d, dT };
      r1.querySelector('.u8l2-rc').innerHTML = `<b>Subtract</b> &nbsp;${T(`0=${dT}`)}`;
      r2.querySelector('.u8l2-rc').innerHTML = disc == null
        ? (near(d[0], 0) && near(d[1], 0) ? `No ${T('x')} left: ${T(`0=${tn(d[2])}`)} is <b>false</b>` : `<b>Linear</b>: one root`)
        : `${T('b^2-4ac=')}${T(D.k ? `(-4)^2-4(2)(${tn(S.k)})=16-8(${tn(S.k)})=` : D.discT + '=')}<b class="u8l2-dv">${T(tn(disc))}</b>`;
      M.style.visibility = disc == null ? 'hidden' : '';
      if (disc != null) needle.setAttribute('transform', `translate(${mx(Math.max(Dlo, Math.min(Dhi, disc)))} 0)`);
      verd.innerHTML = `<b>${WORD[n]}</b><span>${n === 2 ? 'the parabolas cross twice' : n === 1 ? 'the parabolas touch' : D.flip ? 'a vertical translation: they never meet' : 'the parabolas do not meet'}</span>`;
      setKind(stage, n);
      return st;
    };
    const showPts = (on) => {
      [0, 1].forEach((i) => { const ok = on && i < st.xs.length; (ok ? unhide : hide)(pts[i]); (ok ? unhide : hide)(zs[i]); });
      placeRing(ring, G1, st.xs[0] || 0, st.xs.length ? ev(fco())(st.xs[0]) : 0, on && st.n === 1);
      Z.clearLinks();
      if (on) st.xs.forEach((x) => { const l = Z.link(x, ev(fco())(x)); l.setAttribute('y2', l.to); });
    };
    upd();
    if (D.k) {
      const live = { on: false };
      sl.inp.addEventListener('input', () => { S.k = parseFloat(sl.inp.value); upd(); showPts(true); });
      const go = (c, to, ms) => { const k0 = S.k; return tween(c, ms, (u) => { S.k = Math.round((k0 + (to - k0) * u) * 20) / 20; upd(); showPts(true); }).then(() => { S.k = to; upd(); showPts(true); }); };
      [dc, Z.dl, r1, r2, M, verd].forEach(hide); showPts(false);
      return [
        { cap: `${T('k=0')}. Subtract: ${T('0=2x^2-4x+k')}, so ${T('b^2-4ac=16-8k=16')}, positive: <b>two solutions</b>. The difference parabola crosses its axis twice.`,
          run: async (c) => { live.on = true; await go(c, 0, 300); [Z.dl, r1, r2, M, verd].forEach(unhide); unhide(dc); await G2.drawIn(dc, 800, c); await pulse(c, verd, 1.05); } },
        { cap: `Raise ${T('k')} to ${T('2')}: ${T('16-8(2)=0')}. The parabolas <b>touch</b>: one solution. ${T('2x^2-4x+2=0')} gives ${T('x=1')}, ${T('y=1+2=3')}: the point ${T('(1,\\ 3)')}.`,
          run: async (c) => { await go(c, 2, 1600); await pulse(c, verd, 1.06); } },
        { cap: `${T('k=3.5')}: ${T('16-8(3.5)=-12')}, negative: <b>no solution</b>. The difference parabola never reaches ${T('0')}.`,
          run: (c) => go(c, 3.5, 1200) },
        { cap: `${T('16-8k')} is positive when ${T('k<2')} (<b>two</b>), zero when ${T('k=2')} (<b>one</b>), negative when ${T('k>2')} (<b>none</b>). <b>Your turn:</b> drag the slider.`,
          run: async (c) => { await go(c, 0.5, 900); await show(c, unhide(sumK)); await pulse(c, sl.el, 1.04); } }
      ];
    }
    [dc, Z.dl, r1, r2, M, verd].forEach(hide); showPts(false);
    const n = st.n, dT = st.dT;
    const cap2 = st.disc == null ? `${T('x')} cancels too: ${T(`0=${tn(st.d[2])}`)} is <b>false</b> for every ${T('x')}. The difference is always ${T(tn(st.d[2]))}, never ${T('0')}.`
      : `The discriminant of ${T(`${dT}=0`)}: ${T(`${CT[v].discT}=${tn(st.disc)}`)}, ${st.disc > 0 ? '<b>positive</b>' : st.disc < 0 ? '<b>negative</b>' : '<b>zero</b>'}.`;
    const cap3 = n === 2 ? `<b>Two solutions.</b> The difference parabola crosses its axis twice, and the parabolas cross twice.`
      : n === 1 ? `<b>One solution.</b> The difference parabola just touches its axis, and the parabolas touch.`
        : st.disc == null ? `<b>No solution.</b> The red parabola is the blue one moved ${T(tn(st.d[2]))} units up: a vertical translation.`
          : `<b>No solution.</b> The difference parabola never reaches ${T('0')}: the parabolas do not meet.`;
    return [
      { cap: st.disc == null ? `Subtract the equations: ${T(`0=${dT}`)}. The difference is drawn underneath: a horizontal line, not a parabola.` : `Subtract the equations: ${T(`0=${dT}`)}. Its graph, the difference parabola, is drawn underneath.`,
        run: async (c) => { await show(c, unhide(r1)); await show(c, unhide(Z.dl)); unhide(dc); await G2.drawIn(dc, 900, c); } },
      { cap: cap2, run: async (c) => { await show(c, unhide(r2)); if (st.disc != null) await show(c, unhide(M)); } },
      { cap: cap3, run: async (c) => { await show(c, unhide(verd)); showPts(true); await Promise.all(pts.concat(zs).slice(0).filter((p) => p.style.opacity !== '0').map((p) => pulse(c, p, 1.4))); } }
    ];
  }
};

/* ======================= explainer: the fountain (Example 8(b)) ======================= */
const fountain = {
  title: 'Where do the jets cross?', height: 470, minW: 920, capH: 96,
  ask: () => `Two jets: ${T('h=-x^2+6x')} and ${T('h=-0.5x^2+2x+2')}, with ${T('h\\ge0')}. Where do they cross, to the nearest hundredth?`,
  make(stage, v, ex) {
    const W = ex.W, GW = 520, PX = GW + 24, PW = W - PX;
    const f1 = (x) => -x * x + 6 * x, f2 = (x) => -0.5 * x * x + 2 * x + 2, L2 = 2 + 2 * Math.sqrt(2);
    const xa = 4 - 2 * Math.sqrt(3), xb = 4 + 2 * Math.sqrt(3), ha = f1(xa), hb = f1(xb);
    const G = new Graph(stage, { x: 0, y: 0, width: GW, height: 470, xmin: -0.5, xmax: 8.5, ymin: -1, ymax: 10, ylabels: 2, fontSize: 15, fnArrows: false, ytitle: 'h', pad: [30, 18, 18, 18] });
    // the ground (h < 0) and the pedestal under the second jet
    const ground = svgEl('rect', { class: 'u8l2-ground' }); G.layers.data.insertBefore(ground, G.layers.data.firstChild);
    G.track(ground, () => { const [x0, y0] = G.toPx(G.win.xmin, 0), [x1, y1] = G.toPx(G.win.xmax, G.win.ymin); ground.setAttribute('x', x0); ground.setAttribute('y', y0); ground.setAttribute('width', x1 - x0); ground.setAttribute('height', Math.max(0, y1 - y0)); });
    const ped = svgEl('rect', { class: 'u8l2-ped' }, G.layers.data);
    G.track(ped, () => { const [x0, y0] = G.toPx(-0.16, 2), [x1, y1] = G.toPx(0.16, 0); ped.setAttribute('x', x0); ped.setAttribute('y', y0); ped.setAttribute('width', x1 - x0); ped.setAttribute('height', y1 - y0); });
    const j1 = G.fn(f1, { from: 0, to: 6, color: P1, width: 5 }), j2 = G.fn(f2, { from: 0, to: L2, color: P2, width: 5 });
    const x1 = G.fn(f1, { from: 6, to: 8.5, color: P1, width: 3, dash: '8 8' }), x2 = G.fn(f2, { from: L2, to: 8.5, color: P2, width: 3, dash: '8 8' });
    hide(x1); hide(x2);
    // droplets flying along the jets (SMIL: decorative, loops)
    const drops = svgEl('g', {}, G.layers.top);
    const dropPath = (f, a, b) => { let d = ''; for (let i = 0; i <= 40; i++) { const x = a + (b - a) * i / 40, [px, py] = G.toPx(x, f(x)); d += (i ? 'L' : 'M') + px.toFixed(1) + ' ' + py.toFixed(1); } return d; };
    const mk = (f, a, b, col, dur) => [0, 1, 2, 3].map((i) => {
      const cc = svgEl('circle', { r: 4.5, fill: col, opacity: 0.85 }, drops);
      const am = svgEl('animateMotion', { dur: dur + 's', begin: (i * dur / 4).toFixed(2) + 's', repeatCount: 'indefinite' }, cc);
      G.track(cc, () => am.setAttribute('path', dropPath(f, a, b)));
      return cc;
    });
    mk(f1, 0, 6, '#6fa0ff', 2.4); mk(f2, 0, L2, '#ff8f84', 2.0);
    const va = G.vline(xa, { color: ZER }), vb = G.vline(xb, { color: ZER }); hide(va); hide(vb);
    const pa = G.point(xa, ha, { color: SOL, r: 9, label: T('\\approx(0.54,\\ 2.93)'), pos: 'ne' }); hide(pa);
    const pb = G.point(xb, hb, { color: COLORS.red, r: 9, label: T('\\approx(7.46,\\ -10.93)'), pos: 'w' }); hide(pb);
    const ug = div(stage, 'u8l2-ug', `underground: ${T('h<0')}`, 0, 0); hide(ug);
    const P = div(stage, 'u8l2-pn u8l2-pn2', '', PX, 0, PW);
    const rows = h('div', 'u8l2-rows'); P.appendChild(rows);
    const r1 = row(rows, 1, `<b>Set equal</b> ${T('-x^2+6x=-0.5x^2+2x+2')}<br>${T('-0.5x^2+4x-2=0')}`);
    const r2 = row(rows, 2, `<b>Clear the decimal</b> <span class="u8l2-x2">${T('\\times(-2)')}</span><br>${T('x^2-8x+4=0')}`);
    const r3 = row(rows, 3, `<b>Formula</b> ${T('x=\\tfrac{8\\pm\\sqrt{64-16}}{2}=4\\pm2\\sqrt{3}')}<br>${T('x\\approx0.54')} or ${T('x\\approx7.46')}`);
    const r4 = row(rows, 4, `<b>Heights</b> ${T('x\\approx0.54:\\ h\\approx2.93')} <b class="u8l2-ok">✓</b><br>${T('x\\approx7.46:\\ h\\approx-10.93')} <b class="u8l2-no">✗</b>`);
    const res = h('div', 'u8l2-res', `The jets cross at about ${T('(0.54,\\ 2.93)')}:<br><b>0.54 m out and 2.93 m up.</b>`); P.appendChild(res); hide(res);
    const r4b = r4.querySelector('.u8l2-no'); hide(r4b);
    const rej = stamp(stage, 'Rejected', { ok: false, x: 0, y: 0, rotate: -8 }); hide(rej);
    const placeUnder = () => { const [px, py] = G.toPx(0.4, -1.4); ug.style.left = px + 'px'; ug.style.top = py + 'px'; const [qx, qy] = G.toPx(xb, hb); rej.style.left = (qx - 150) + 'px'; rej.style.top = (qy - 70) + 'px'; };
    return [
      { cap: `Both heights are ${T('h')}: set them equal and collect every term on one side: ${T('-0.5x^2+4x-2=0')}.`, run: (c) => show(c, unhide(r1)) },
      { cap: `<b>Clear the decimal:</b> multiply by ${T('-2')} so every coefficient is an integer (and ${T('a')} is positive): ${T('x^2-8x+4=0')}.`,
        run: async (c) => { await show(c, unhide(r2)); await pulse(c, r2.querySelector('.u8l2-x2'), 1.3); } },
      { cap: `It doesn't factor: the formula gives ${T('x=4\\pm2\\sqrt3')}, about ${T('0.54')} and ${T('7.46')}.`,
        run: async (c) => { await show(c, unhide(r3)); unhide(va); unhide(vb); await Promise.all([G.drawIn(va, 600, c), G.drawIn(vb, 600, c)]); } },
      { cap: `${T('x\\approx0.54')}: ${T('h=-x^2+6x\\approx2.93')}. Both jets are in the air there: they <b>cross</b> about ${T('0.54')} m out and ${T('2.93')} m up.`,
        run: async (c) => { await show(c, unhide(r4)); await popP(c, pa); await pulse(c, pa, 1.5); } },
      { cap: `${T('x\\approx7.46')}: ${T('h\\approx-10.93')}, <b>underground</b>. The parabolas meet there, but the jets don't (the first lands at ${T('x=6')}). <b>Reject it.</b>`,
        run: async (c) => {
          await G.setWindow({ ymin: -13, ymax: 10 }, c, 1100); placeUnder();
          unhide(x1); unhide(x2); await Promise.all([G.drawIn(x1, 800, c), G.drawIn(x2, 800, c)]);
          await show(c, unhide(ug)); await popP(c, pb); await stampIn(c, unhide(rej)); await show(c, unhide(r4b));
        } },
      { cap: `In a context, check that each solution makes sense: the jets cross at about ${T('(0.54,\\ 2.93)')}.`,
        run: async (c) => { await show(c, unhide(res)); await pulse(c, res, 1.05); } }
    ];
  }
};

/* ================================ Stand Up Break ================================ */
const sg = (m) => (m === 0 ? '' : m > 0 ? '+' + m : String(m));
const fx = (r1) => (r1 === 0 ? 'x' : `(x${sg(-r1)})`);
standup('u8l2', {
  intro: 'At your whiteboard: subtract the equations, solve for x, then substitute into an original equation.',
  levels: {
    BEG: (r) => {
      const p = r.int(1, 5), m = r.int(-6, 6), n = m + 2 * p * p, yv = p * p + m;
      return { q: `y=x^2${sg(m)},\\quad y=-x^2${sg(n)}`, a: [`2x^2${sg(m - n)}=0`, `x^2=${p * p},\\ \\ x=\\pm${p}`, `(${p},\\ ${yv})\\ \\text{and}\\ (${-p},\\ ${yv})`] };
    },
    PRG: (r) => {
      const r1 = r.int(-5, 5); let r2 = r.int(-5, 5); while (r2 === r1) r2 = r.int(-5, 5);
      const k = r.pick([1, 1, 2]), a2 = r.pick([-2, -1, 1, 2].filter((a) => a + k !== 0)), b2 = r.int(-5, 5), c2 = r.int(-6, 6);
      const g = [a2, b2, c2], d = [k, -k * (r1 + r2), k * r1 * r2], f = [a2 + k, b2 + d[1], c2 + d[2]];
      const lo = Math.min(r1, r2), hi = Math.max(r1, r2), G = ev(g);
      const a = [`${poly(d)}=0`];
      if (k === 2) a.push(`${poly([1, -(r1 + r2), r1 * r2])}=0`);
      a.push(`${fx(lo)}${fx(hi)}=0,\\ \\ x=${lo}\\ \\text{or}\\ x=${hi}`, `(${lo},\\ ${G(lo)})\\ \\text{and}\\ (${hi},\\ ${G(hi)})`);
      return { q: `y=${poly(f)},\\quad y=${poly(g)}`, a };
    },
    MAS: (r) => {
      const g = [r.pick([-2, -1, 1, 2]), r.int(-5, 5), r.int(-6, 6)], t = r.int(1, 5);
      let d;
      if (t === 1) { const p = r.int(-4, 3), q = p + r.int(1, 5), k = r.pick([1, 2]); d = [k, -k * (p + q), k * p * q]; }
      else if (t === 2) { const p = r.int(-4, 4), k = r.pick([1, 2]); d = [k, -2 * k * p, k * p * p]; }
      else if (t === 3) { const p = r.int(-3, 3), k = r.pick([1, 2]), q = r.int(1, 5); d = [k, -2 * k * p, k * (p * p + q)]; }
      else if (t === 4) { d = [0, r.pick([-6, -4, -3, -2, 2, 3, 4, 6]), r.int(-6, 6)]; }
      else d = [0, 0, r.pick([-5, -3, -2, 2, 3, 5])];
      if (d[0] !== 0 && g[0] + d[0] === 0) g[0] = g[0] + (g[0] > 0 ? 1 : -1);
      const f = [g[0] + d[0], g[1] + d[1], g[2] + d[2]];
      const D = d[1] * d[1] - 4 * d[0] * d[2];
      const a = [`0=${poly(d)}`];
      if (d[0] !== 0) a.push(`b^2-4ac=${D}`, `\\text{${D > 0 ? 'two solutions' : D === 0 ? 'one solution' : 'no solution'}}`);
      else if (d[1] !== 0) a.push('\\text{linear: one solution}');
      else a.push('\\text{false: no solution}');
      return { q: `\\text{How many solutions? }\\ y=${poly(f)},\\ \\ y=${poly(g)}`, a };
    }
  }
});

/* ================================ mount ================================ */
export const explainers = mountExplainers({ meet, machine, cancel, count, fountain });
export const _test = { MCH, CN, CT, poly };
