/* Math 20-1 · Unit 5 · Lesson 11 — Unit 5 Review (new lesson format, 2026-11-11).
 * The warm-up is plain markup on the page (no code). Explainers:
 *   lab (hands-on, and the whole-class game: a = ±½ … ±3, p and q on buttons, and every characteristic updates live.
 *     "Example 1" turns y = x² into y = −2(x + 3)² + 8 one transformation at a time and draws the step pattern;
 *     "Hit the Target" is five rounds of a dashed target parabola for the class to match; "Challenges" asks for
 *     parabolas with given features),
 *   arch (Example 4: the arch stays put while the origin slides from the left end to below the top; the equation
 *     changes and a does not),
 *   method (Example 5's method sorter: each equation drops into its method's bin, numbered working, then a graph check
 *     of the zeros; Ryan's X for the factoring part),
 *   disc (Example 6(b)–(c): a k slider moves the parabola; the discriminant, the number of roots and a k number line
 *     update live).
 * Also the Stand Up Break.
 * Colours (as in the rest of Unit 5): the function blue, the vertex / maximum or minimum amber, zeros purple, a green,
 *   the target red (dashed), discriminant positive green, zero amber, negative red. */
import {
  h, tex, add, box, Graph, NumberLine, svgEl, stamp, stampIn, mountExplainers, pop, fadeIn, tween, anim, pulse, sleep, linear, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const FN = COLORS.blue, VX = COLORS.amber, ZR = COLORS.purple, AC = COLORS.green, RD = COLORS.red, GR = '#9aa0ab';
const cV = (s) => `\\textcolor{${VX}}{${s}}`, cZ = (s) => `\\textcolor{${ZR}}{${s}}`, cA = (s) => `\\textcolor{${AC}}{${s}}`;
const show = (c, el) => fadeIn(c, el, 320);
const hide = (...els) => { els.forEach((e) => { if (e) { e.style.opacity = 0; if (e.label) e.label.style.opacity = 0; } }); return els[0]; };
const unhide = (el) => { if (el) { el.style.opacity = ''; if (el.label) el.label.style.opacity = ''; } return el; };
const popP = (c, p) => { unhide(p); return Promise.all([pop(c, p), p.label ? show(c, p.label) : null]); };
const drawOn = (c, G, el, ms = 700) => { unhide(el); return G.drawIn(el, ms, c); };
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
/* a numbered working line: the step number in a circle, the maths, an optional note; hidden until shown */
const sline = (p, n, t, note, cls = '') => {
  const d = h('div', 'u5l11-sl ' + cls, `${n ? `<b class="u5l11-n">${n}</b>` : '<i class="u5l11-n0"></i>'}<span class="u5l11-lt">${T(t)}</span>${note ? `<span class="u5l11-note">${note}</span>` : ''}`);
  p.appendChild(d); d.style.opacity = 0; return d;
};
const r2 = (v) => Math.round(v * 100) / 100;
const dec = (v, d = 2) => { const s = (Math.abs(v) < 1e-12 ? 0 : v).toFixed(d); return /^-0\.?0*$/.test(s) ? (0).toFixed(d) : s; };
/* a number as TeX: integers, halves and thirds as fractions, anything else to 2 decimal places */
function fr(v) {
  if (Math.abs(v - Math.round(v)) < 1e-9) return String(Math.round(v));
  for (const d of [2, 3, 4, 6]) { const n = v * d; if (Math.abs(n - Math.round(n)) < 1e-9) { const k = Math.round(n); return `${k < 0 ? '-' : ''}\\tfrac{${Math.abs(k)}}{${d}}`; } }
  return dec(v);
}
const sg = (v) => (v < 0 ? `-${fr(-v)}` : `+${fr(v)}`);                 // signed term
const coefS = (a) => (a === 1 ? '' : a === -1 ? '-' : fr(a));            // a coefficient in front of a variable
function slider(stage, x, y, w, min, max, step, onInput, label) {
  const inp = h('input', 'u5l11-slider'); inp.type = 'range'; inp.min = min; inp.max = max; inp.step = step; inp.setAttribute('aria-label', label);
  box(inp, w, 36); inp.style.position = 'absolute'; add(stage, inp, x, y);
  inp.addEventListener('input', () => onInput(+inp.value));
  return inp;
}

/* ====================================================================================================
 * explainer: the parabola lab (Example 1, Hit the Target, challenges)
 * ==================================================================================================== */
const AV = [-3, -2, -1, -0.5, 0.5, 1, 2, 3];
const vform = (a, p, q, col = true) => {
  const A = coefS(a), inside = p === 0 ? 'x' : `x${sg(-p)}`, sq = p === 0 ? 'x^2' : `(${inside})^2`;
  const qq = q === 0 ? '' : sg(q);
  if (!col) return `y=${A}${sq}${qq}`;
  const Ac = A === '' ? '' : cA(A), sqc = p === 0 ? 'x^2' : `(x${cV(sg(-p))})^2`;
  return `y=${Ac}${sqc}${q === 0 ? '' : cV(qq)}`;
};
const gform = (a, p, q) => {
  const b = -2 * a * p, c = a * p * p + q;
  return `y=${coefS(a)}x^2${b === 0 ? '' : (b < 0 ? '-' : '+') + (Math.abs(b) === 1 ? '' : fr(Math.abs(b))) + 'x'}${c === 0 ? '' : sg(c)}`;
};
function features(a, p, q) {
  const b = -2 * a * p, c = a * p * p + q, D = b * b - 4 * a * c, up = a > 0;
  let xi;
  const k = -q / a;
  if (Math.abs(q) < 1e-12) xi = { n: 1, html: `one: ${T(`x=${fr(p)}`)} <span class="u5l11-mut">(vertex on the axis)</span>` };
  else if (k < 0) xi = { n: 0, html: `none <span class="u5l11-mut">(${T('a')} and ${T('q')} same sign)</span>` };
  else {
    const s = Math.sqrt(k), exact = Math.abs(s * 6 - Math.round(s * 6)) < 1e-9;
    xi = { n: 2, html: exact ? `two: ${T(`x=${fr(p - s)}`)} and ${T(`x=${fr(p + s)}`)}` : `two: ${T(`x\\approx${dec(p - s)}`)} and ${T(`x\\approx${dec(p + s)}`)}` };
  }
  return [
    ['General form', T(gform(a, p, q))],
    ['Vertex', T(cV(`(${fr(p)},\\ ${fr(q)})`))],
    ['Axis of symmetry', T(`x=${fr(p)}`)],
    ['Opening', `${up ? 'up' : 'down'} (${T(up ? 'a>0' : 'a<0')}), <b>${up ? 'minimum' : 'maximum'} value ${T(fr(q))}</b>`],
    ['Domain', T('\\{x\\mid x\\in\\mathbb{R}\\}')],
    ['Range', T(`\\{y\\mid y${up ? '\\ge' : '\\le'}${fr(q)},\\ y\\in\\mathbb{R}\\}`)],
    [`${T('y')}-intercept`, T(fr(c))],
    [`${T('x')}-intercepts`, xi.html],
    [T('b^2-4ac'), `${T(`${fr(D)}`)} <span class="u5l11-dsg ${D > 1e-9 ? 'pos' : D < -1e-9 ? 'neg' : 'zero'}">${D > 1e-9 ? '&gt; 0: two roots' : D < -1e-9 ? '&lt; 0: no real roots' : '= 0: one root'}</span>`]
  ];
}
const TARGETS = [
  { a: 1, p: 2, q: -5, why: `vertex ${T('(2,\\ -5)')}; one step over it goes <b>up 1</b>, so ${T('a=1')}` },
  { a: -1, p: -3, q: 4, why: `vertex ${T('(-3,\\ 4)')}; one step over it goes <b>down 1</b>, so ${T('a=-1')}` },
  { a: 2, p: 1, q: -7, why: `vertex ${T('(1,\\ -7)')}; one step over it goes <b>up 2</b>, so ${T('a=2')}` },
  { a: -0.5, p: 4, q: 6, why: `vertex ${T('(4,\\ 6)')}; <b>two</b> steps over it goes down ${T('2')} (that is ${T('1a+3a=4a')}), so ${T('a=-\\frac{1}{2}')}` },
  { a: 3, p: -4, q: 0, why: `vertex ${T('(-4,\\ 0)')} on the ${T('x')}-axis, so ${T('q=0')}; one step over goes <b>up 3</b>, so ${T('a=3')}` }
];
const CHAL = [
  { ask: 'opens <b>down</b> and has <b>no</b> x-intercepts', ans: `any ${T('a<0')} with ${T('q<0')} (same signs), for example ${T('y=-(x-1)^2-3')}`, set: { a: -1, p: 1, q: -3 }, ok: (a, p, q) => a < 0 && q < 0 },
  { ask: 'has <b>exactly one</b> x-intercept, at x = 3', ans: `the vertex must be on the ${T('x')}-axis: ${T('p=3')}, ${T('q=0')}, any ${T('a')}, for example ${T('y=2(x-3)^2')}`, set: { a: 2, p: 3, q: 0 }, ok: (a, p, q) => p === 3 && q === 0 },
  { ask: 'has range y ≥ −4 and x-intercepts 0 and 4', ans: `axis midway: ${T('p=2')}; minimum ${T('q=-4')}; ${T('0=a(0-2)^2-4')} gives ${T('a=1')}: ${T('y=(x-2)^2-4')}`, set: { a: 1, p: 2, q: -4 }, ok: (a, p, q) => a === 1 && p === 2 && q === -4 }
];
const LABS = {
  ex1: { ask: `Example 1: ${T('y=-2(x+3)^2+8')}. Watch ${T('y=x^2')} turn into it, read every characteristic, then sketch it with the step pattern.` },
  game: { ask: `Hit the Target: a dashed parabola appears. Read its vertex and one step off the vertex, then call out ${T('a')}, ${T('p')} and ${T('q')}.` },
  chal: { ask: `Challenges: set ${T('a')}, ${T('p')} and ${T('q')} to make a parabola with the features asked for.` }
};
const lab = {
  title: 'The parabola lab',
  height: 470, minW: 960,
  choices: [{ v: 'ex1', label: 'Example 1' }, { v: 'game', label: 'Hit the Target' }, { v: 'chal', label: 'Challenges' }],
  ask: (v) => LABS[v].ask,
  make(stage, v, ex) {
    const W = ex.W, GW = 440;
    const G = new Graph(stage, { x: 0, y: 10, width: GW, height: 452, xmin: -8, xmax: 8, ymin: -11, ymax: 11, xlabels: 2, ylabels: 2, fontSize: 15 });
    const S = { a: 1, p: 0, q: 0 };
    let TG = null, busy = false;
    const ghost = G.fn((x) => x * x, { color: GR, width: 2.5, dash: true });
    const tgt = hide(G.fn((x) => (TG ? TG.a * (x - TG.p) ** 2 + TG.q : NaN), { color: RD, width: 4.5, dash: '12 9' }));
    const cur = G.fn((x) => S.a * (x - S.p) ** 2 + S.q, { color: FN, width: 4.5 });
    const vtx = G.point(0, 0, { color: VX, r: 8 });
    const PX = GW + 16, PW = W - PX - 2;
    const eq = div(stage, 'u5l11-eq', '', PX, 4, PW, 52);
    // the three controls
    const ctl = div(stage, 'u5l11-ctl', '', PX, 62, PW, 58);
    const mk = (key, name) => {
      const g = div(ctl, 'u5l11-cg u5l11-cg-' + key, `<span class="u5l11-cn">${T(name)}</span>`);
      const minus = h('button', 'u5l11-sb', '−'), val = h('span', 'u5l11-cvl'), plus = h('button', 'u5l11-sb', '+');
      minus.type = plus.type = 'button'; minus.setAttribute('aria-label', name + ' down'); plus.setAttribute('aria-label', name + ' up');
      g.append(minus, val, plus);
      const stepK = (d) => {
        if (busy) return;
        if (key === 'a') { const i = AV.indexOf(S.a); S.a = AV[Math.max(0, Math.min(AV.length - 1, (i < 0 ? 5 : i) + d))]; }
        else S[key] = Math.max(key === 'p' ? -7 : -10, Math.min(key === 'p' ? 7 : 10, S[key] + d));
        update(); hitCheck();
      };
      minus.addEventListener('click', () => stepK(-1)); plus.addEventListener('click', () => stepK(1));
      return { g, val };
    };
    const C = { a: mk('a', 'a'), p: mk('p', 'p'), q: mk('q', 'q') };
    const tb = div(stage, 'u5l11-ro', '', PX, 128, PW, 336);
    const rows = features(1, 0, 0).map((r) => { const d = h('div', 'u5l11-rr', `<span class="u5l11-rk">${r[0]}</span><span class="u5l11-rv"></span>`); tb.appendChild(d); return d; });
    const banner = div(stage, 'u5l11-ban', '', 14, 16, GW - 40); banner.style.opacity = 0;
    const hit = stamp(stage, 'HIT!', { ok: true, x: GW / 2, y: 120, size: 'lg' }); hit.style.opacity = 0;
    function drawCurve() { cur._bkDraw(); G.moveTo(vtx, S.p, S.q); }
    function update() {
      drawCurve();
      eq.innerHTML = T(vform(S.a, S.p, S.q));
      C.a.val.innerHTML = T(cA(fr(S.a))); C.p.val.innerHTML = T(cV(fr(S.p))); C.q.val.innerHTML = T(cV(fr(S.q)));
      features(S.a, S.p, S.q).forEach((r, i) => { rows[i].lastChild.innerHTML = r[1]; });
    }
    const same = () => TG && TG.a === S.a && TG.p === S.p && TG.q === S.q;
    function hitCheck() {
      if (v === 'game') {
        const yes = same(); hit.style.opacity = yes ? 1 : 0;
        tgt.style.opacity = TG ? (yes ? 0.35 : 1) : 0;
        if (yes && !busy) hit.animate([{ transform: `scale(1.8) rotate(${hit.rot - 9}deg)`, opacity: 0 }, { transform: `scale(1) rotate(${hit.rot}deg)`, opacity: 1 }], { duration: 420, easing: 'cubic-bezier(.2,1.4,.4,1)' });
      }
      if (v === 'chal' && CH) { const yes = CH.ok(S.a, S.p, S.q); hit.textContent = 'YES!'; hit.style.opacity = yes ? 1 : 0; }
    }
    const tw = async (c, key, to, ms = 900) => {
      const from = S[key]; busy = true;
      await tween(c, ms, (k) => { S[key] = from + (to - from) * k; drawCurve(); eq.innerHTML = T(vform(+S.a.toFixed(2), +S.p.toFixed(2), +S.q.toFixed(2))); });
      S[key] = to; busy = false; update();
    };
    const twAll = async (c, to) => { for (const k of ['a', 'p', 'q']) if (S[k] !== to[k]) await tw(c, k, to[k], 700); };
    const lightRow = (c, idx) => { rows.forEach((r, i) => r.classList.toggle('on', idx.includes(i))); return Promise.all(idx.map((i) => pulse(c, rows[i], 1.03))); };
    let CH = null;
    update();

    if (v === 'ex1') {
      hide(cur, vtx);
      const steps = [];
      const sp = [];  // the step-pattern pieces
      const leg = (x0, y0, dx, dy, lab) => {
        const g = hide(G.polyline([[x0, y0], [x0 + dx, y0], [x0 + dx, y0 + dy]], { color: VX, width: 3, dash: '6 5' }));
        const l = hide(G.label(x0 + dx, y0 + dy / 2, T(cV(lab)), { pos: dx < 0 ? 'w' : 'e', cls: 'bk-ptlab u5l11-glab' }));
        const pt = hide(G.point(x0 + dx, y0 + dy, { color: VX, r: 6.5, label: T(`(${x0 + dx},\\ ${y0 + dy})`), pos: dx < 0 && x0 + dx > -6 ? 'w' : 'e' }));
        return [g, l, pt];
      };
      const lv = [[-3, 8, -2, '-2'], [-4, 6, -6, '-6'], [-5, 0, -10, '-10']];  // the bottom-left label goes right (room)
      lv.forEach(([x0, y0, dy, lab]) => { sp.push([...leg(x0, y0, -1, dy, lab), ...leg(-6 - x0, y0, 1, dy, lab)]); });
      steps.push(
        { cap: `<b>(a)</b> Start from ${T('y=x^2')}: ${T('a=1')}, ${T('p=0')}, ${T('q=0')}. Its grey copy stays behind so we can compare.`,
          run: async (c) => { unhide(cur); unhide(vtx); await G.drawIn(cur, 600, c); } },
        { cap: `${T('|a|=2')}: a <b>vertical stretch by a factor of 2</b>. Every height doubles, so the graph looks narrower.`, run: (c) => tw(c, 'a', 2, 1000) },
        { cap: `${T('a=-2<0')}: a <b>reflection in the ${T('x')}-axis</b>. The parabola flips and opens down.`, run: (c) => tw(c, 'a', -2, 1400) },
        { cap: `${T('x+3=x-(-3)')}, so ${T('p=-3')}: a <b>horizontal translation 3 units left</b>.`, run: (c) => tw(c, 'p', -3, 1200) },
        { cap: `${T('q=8')}: a <b>vertical translation 8 units up</b>. That is ${T('y=-2(x+3)^2+8')}.`, run: (c) => tw(c, 'q', 8, 1200) },
        { cap: `<b>(b)</b> Read the characteristics: vertex ${T(cV('(-3,\\ 8)'))}, axis ${T('x=-3')}, opens down, so a <b>maximum value 8</b> and range ${T('\\{y\\mid y\\le8,\\ y\\in\\mathbb{R}\\}')}.`,
          run: (c) => lightRow(c, [1, 2, 3, 4, 5]) },
        { cap: `${T('y')}-intercept: ${T('x=0')} gives ${T('-2(3)^2+8=-10')}. ${T('x')}-intercepts: ${T('(x+3)^2=4')}, so ${T('x=-5')} and ${T('x=-1')}.`,
          run: (c) => lightRow(c, [6, 7]) },
        { cap: `<b>(c) Step 1.</b> Plot the vertex ${T(cV('(-3,\\ 8)'))}. Over 1, the graph moves ${T('1a=-2')}: down 2, to ${T('(-4,\\ 6)')} and ${T('(-2,\\ 6)')}.`,
          run: async (c) => { lightRow(null, []); hide(cur); await pulse(c, vtx, 1.5); await Promise.all(sp[0].map((e) => (e.classList.contains('bk-pt') ? popP(c, e) : e.classList.contains('bk-curve') ? drawOn(c, G, e, 500) : show(c, e)))); } },
        { cap: `<b>Step 2.</b> Over 1 more: ${T('3a=-6')}, down 6 more, to ${T('(-5,\\ 0)')} and ${T('(-1,\\ 0)')}: the ${T('x')}-intercepts.`,
          run: (c) => Promise.all(sp[1].map((e) => (e.classList.contains('bk-pt') ? popP(c, e) : e.classList.contains('bk-curve') ? drawOn(c, G, e, 500) : show(c, e)))) },
        { cap: `<b>Step 3.</b> Over 1 more: ${T('5a=-10')}, down 10 more, to ${T('(-6,\\ -10)')} and ${T('(0,\\ -10)')} (the ${T('y')}-intercept). Join the points with a smooth curve.`,
          run: async (c) => { await Promise.all(sp[2].map((e) => (e.classList.contains('bk-pt') ? popP(c, e) : e.classList.contains('bk-curve') ? drawOn(c, G, e, 500) : show(c, e)))); await drawOn(c, G, cur, 900); } },
        { cap: `<b>Your turn:</b> change ${T('a')}, ${T('p')} or ${T('q')} with the buttons and watch every characteristic change.`,
          run: async (c) => { sp.flat().forEach((e) => (e.style.opacity = 0.35)); await pulse(c, ctl, 1.04); } }
      );
      return steps;
    }

    if (v === 'game') {
      const steps = [];
      TARGETS.forEach((t, i) => {
        steps.push({
          cap: `<b>Round ${i + 1} of ${TARGETS.length}.</b> Call out ${T('a')}, ${T('p')} and ${T('q')} for the <b class="u5l11-cr">dashed</b> parabola. Change one value at a time until it’s a hit.`,
          run: async (c) => {
            hit.style.opacity = 0; await twAll(c, { a: 1, p: 0, q: 0 }); TG = t; tgt._bkDraw(); tgt.style.opacity = 1;
            banner.innerHTML = `<b>Round ${i + 1}</b> · match the dashed parabola`; await show(c, banner); await G.drawIn(tgt, 800, c); hitCheck();
          }
        });
        steps.push({
          cap: `<b>${T(vform(t.a, t.p, t.q, false))}</b>: ${t.why}.`,
          run: async (c) => { await twAll(c, t); tgt.style.opacity = 0.35; await stampIn(c, hit); }
        });
      });
      steps.push({ cap: `<b>Game over.</b> Make your own: one student sets a target on paper, the class calls out ${T('a')}, ${T('p')} and ${T('q')}.`, run: async (c) => { TG = null; hitCheck(); tgt.style.opacity = 0; hit.style.opacity = 0; banner.style.opacity = 0; await pulse(c, ctl, 1.04); } });
      return steps;
    }

    // challenges
    const steps = [];
    CHAL.forEach((ch, i) => {
      steps.push({
        cap: `<b>Challenge ${i + 1}.</b> Make a parabola that ${ch.ask}.`,
        run: async (c) => { CH = ch; hit.style.opacity = 0; await twAll(c, { a: 1, p: 0, q: 0 }); banner.innerHTML = `<b>Challenge ${i + 1}:</b> ${ch.ask}`; await show(c, banner); hitCheck(); }
      });
      steps.push({ cap: `<b>One answer:</b> ${ch.ans}.`, run: async (c) => { await twAll(c, ch.set); hit.textContent = 'YES!'; await stampIn(c, hit); } });
    });
    return steps;
  }
};

/* ====================================================================================================
 * explainer: move the origin under the arch (Example 4)
 * ==================================================================================================== */
const arch = {
  title: 'One arch, two origins',
  height: 360, minW: 960,
  ask: `Example 4: a parabolic arch ${T('24')} m wide at the ground and ${T('9')} m high at its centre. Write its equation with the origin at the left end, then with the origin below the top.`,
  make(stage, v, ex) {
    const W = ex.W, GW = 590;
    const G = new Graph(stage, { x: 0, y: 6, width: GW, height: 350, xmin: -2, xmax: 26, ymin: -1.5, ymax: 11, xlabels: 2, ylabels: 3, fontSize: 15 });
    const st = { s: 0 };
    const fo = { color: FN, width: 5, from: 0, to: 24, arrows: false };
    const f = (x) => -(x + st.s) * (x + st.s - 24) / 16;
    const curve = G.fn(f, fo);
    const z0 = G.point(0, 0, { color: ZR, r: 7.5, label: T(cZ('0')), pos: 'nw' }), z1 = G.point(24, 0, { color: ZR, r: 7.5, label: T(cZ('24')), pos: 'ne' });
    const vt = G.point(12, 9, { color: VX, r: 8.5, label: T(cV('(12,\\ 9)')), pos: 'n' });
    hide(z0, z1, vt);
    const A3 = [3, 0], B3 = [3, 63 / 16];
    const drop = hide(G.segment(A3, B3, { color: AC, width: 3.5, dash: '7 6' }));
    const p3 = hide(G.point(3, 63 / 16, { color: AC, r: 7, label: T('(3,\\ 3.9)'), pos: 'e' }));
    const PX = GW + 16, PW = W - PX - 2;
    const pn = div(stage, 'u5l11-panel', '', PX, 6, PW, 348);
    const L = [
      sline(pn, 1, '\\text{zeros }0,\\ 24;\\ \\text{vertex }(12,\\ 9)', '(a)'),
      sline(pn, 2, '9=a(12)(12-24)', ''),
      sline(pn, 3, 'a=-\\tfrac{9}{144}=-\\tfrac{1}{16}', ''),
      sline(pn, 4, 'y=-\\tfrac{1}{16}x(x-24)', '', 'u5l11-res'),
      sline(pn, 5, 'y=-\\tfrac{1}{16}(3)(-21)=\\tfrac{63}{16}\\approx3.9', '(b)'),
      sline(pn, 6, '\\text{vertex }(0,\\ 9),\\ \\text{zeros }\\pm12', '(c)'),
      sline(pn, 7, 'y=-\\tfrac{1}{16}x^2+9', '', 'u5l11-res'),
      sline(pn, 8, '-\\tfrac{1}{16}(144)+9=0\\ \\checkmark', 'check')];
    const same = stamp(stage, 'SAME a', { ok: null, x: GW / 2 + 140, y: 200, size: 'sm' }); same.style.opacity = 0;
    const setS = (s) => {
      st.s = s; G.win.xmin = -2 - s; G.win.xmax = 26 - s; fo.from = -s; fo.to = 24 - s;
      A3[0] = B3[0] = 3 - s; G.redraw();
      G.moveTo(z0, -s, 0); G.moveTo(z1, 24 - s, 0); G.moveTo(vt, 12 - s, 9); G.moveTo(p3, 3 - s, 63 / 16);
    };
    return [
      { cap: `<b>(a) Step 1.</b> With the origin at the left end, the arch meets the ground at ${T(cZ('0'))} and ${T(cZ('24'))}, and the top is midway: ${T(cV('(12,\\ 9)'))}.`,
        run: async (c) => { await show(c, L[0]); await Promise.all([popP(c, z0), popP(c, z1)]); await popP(c, vt); } },
      { cap: `<b>Step 2.</b> Factored form ${T('y=a(x-0)(x-24)')}. Substitute the vertex ${T('(12,\\ 9)')} and solve for ${T('a')}.`,
        run: async (c) => { await show(c, L[1]); await show(c, L[2]); } },
      { cap: `<b>Step 3.</b> ${T('y=-\\frac{1}{16}x(x-24)')}.`, run: (c) => show(c, L[3]) },
      { cap: `<b>(b)</b> 3 m in from the end is ${T('x=3')}: ${T('y=\\frac{63}{16}=3.9375')}, about <b>3.9 m</b> high.`,
        run: async (c) => { await show(c, L[4]); await drawOn(c, G, drop, 500); await popP(c, p3); } },
      { cap: `<b>(c)</b> Now slide the origin 12 m right, to the ground directly below the top. The arch does not move: only the numbers on the axis change.`,
        run: async (c) => { await tween(c, 2600, (k) => setS(12 * k)); setS(12); vt.label.innerHTML = T(cV('(0,\\ 9)')); z0.label.innerHTML = T(cZ('-12')); z1.label.innerHTML = T(cZ('12')); p3.label.innerHTML = T('(-9,\\ 3.9)'); await show(c, L[5]); } },
      { cap: `Vertex form with vertex ${T('(0,\\ 9)')}: ${T('y=ax^2+9')}. The <b>shape</b> is the same, so ${T('a=-\\frac{1}{16}')} is the same: ${T('y=-\\frac{1}{16}x^2+9')}.`,
        run: async (c) => { await show(c, L[6]); await stampIn(c, same); } },
      { cap: `Check a zero: ${T('x=12')} gives ${T('-\\frac{1}{16}(144)+9=0')} ✓. And 3 m from the left end is now ${T('x=-9')}: the same height, 3.9 m.`,
        run: async (c) => { await show(c, L[7]); await pulse(c, p3, 1.4); } }
    ];
  }
};

/* ====================================================================================================
 * explainer: the method sorter (Example 5)
 * ==================================================================================================== */
const BINS = [['sq', 'Square roots'], ['fac', 'Factoring'], ['for', 'Formula'], ['gr', 'Graphing']];
const MS = {
  a: {
    eq: '3(x-2)^2=27', gf: '3(x-2)^2-27', bin: 'sq', f: (x) => 3 * (x - 2) ** 2 - 27, win: { xmin: -3, xmax: 7, ymin: -30, ymax: 30 }, ys: 10, zs: [-1, 5],
    why: `A squared bracket equal to a number, and no ${T('x')} term on its own: <b>square roots</b>.`,
    lines: [['(x-2)^2=9', 'divide by 3'], ['x-2=\\pm3', 'square root, ±'], ['x=5\\ \\text{ or }\\ x=-1', '', 'res']]
  },
  b: {
    eq: '2x^2+3x=2', gf: '2x^2+3x-2', bin: 'fac', f: (x) => 2 * x * x + 3 * x - 2, win: { xmin: -4, xmax: 3, ymin: -6, ymax: 12 }, ys: 2, zs: [-2, 0.5],
    why: `Integer coefficients and small numbers: try <b>factoring</b> (0 on one side first).`,
    lines: [['2x^2+3x-2=0', '0 on one side'], ['X', ''], ['2x(x+2)-1(x+2)=0', 'split 3x = 4x − x, group'], ['(2x-1)(x+2)=0', ''], ['x=\\tfrac{1}{2}\\ \\text{ or }\\ x=-2', '', 'res']]
  },
  c: {
    eq: 'x^2-6x+4=0', gf: 'x^2-6x+4', bin: 'for', f: (x) => x * x - 6 * x + 4, win: { xmin: -1, xmax: 7, ymin: -6, ymax: 10 }, ys: 2, zs: [3 - Math.sqrt(5), 3 + Math.sqrt(5)],
    why: `No two integers multiply to ${T('4')} and add to ${T('-6')}, and the answer must be exact: the <b>formula</b>.`,
    lines: [['a=1,\\ b=-6,\\ c=4', ''], ['x=\\dfrac{6\\pm\\sqrt{36-16}}{2}=\\dfrac{6\\pm\\sqrt{20}}{2}', ''], ['=\\dfrac{6\\pm2\\sqrt{5}}{2}', '√20 = 2√5'], ['x=3\\pm\\sqrt{5}', 'divide by 2', 'res']]
  },
  d: {
    eq: '3x^2+2x-4=0', gf: '3x^2+2x-4', bin: 'for', f: (x) => 3 * x * x + 2 * x - 4, win: { xmin: -3, xmax: 2, ymin: -6, ymax: 10 }, ys: 2, zs: [(-1 - Math.sqrt(13)) / 3, (-1 + Math.sqrt(13)) / 3],
    why: `${T('ac=-12')}: no pair of integers adds to ${T('2')}. It doesn’t factor: the <b>formula</b>, then round.`,
    lines: [['a=3,\\ b=2,\\ c=-4', ''], ['x=\\dfrac{-2\\pm\\sqrt{4+48}}{6}=\\dfrac{-2\\pm\\sqrt{52}}{6}', ''], ['=\\dfrac{-1\\pm\\sqrt{13}}{3}', '√52 = 2√13'], ['x\\approx0.87\\ \\text{ or }\\ x\\approx-1.54', '', 'res']]
  }
};
/* Ryan's X: ac on top, b underneath, the two numbers on the sides; the factor pairs beside it, the right pair circled */
function ryanX(ac, b, m, n, pairs) {
  return `<div class="u5l11-x"><svg viewBox="0 0 120 96" aria-hidden="true"><line x1="22" y1="12" x2="98" y2="84"/><line x1="98" y1="12" x2="22" y2="84"/></svg>
    <span class="u5l11-xt">${T(String(ac))}</span><span class="u5l11-xb">${T(String(b))}</span><span class="u5l11-xl">${T(String(m))}</span><span class="u5l11-xr">${T(String(n))}</span></div>
    <div class="u5l11-pairs">${pairs.map((p) => `<span class="u5l11-pr${(p[0] === m && p[1] === n) || (p[0] === n && p[1] === m) ? ' u5l11-circ' : ''}">${T(`${p[0]},\\ ${p[1]}`)}</span>`).join('')}</div>`;
}
const method = {
  title: 'The method sorter',
  height: 470, minW: 960,
  choices: [{ sep: 'Example 5:' }, ...['a', 'b', 'c', 'd'].map((k) => ({ v: k, label: `(${k})` }))],
  ask: (v) => `Example 5(${v}): solve ${T(MS[v].eq)}. Which method is the most efficient?`,
  make(stage, v, ex) {
    const d = MS[v], W = ex.W, BW = (W - 30) / 4;
    const bins = {};
    BINS.forEach(([k, name], i) => { bins[k] = div(stage, 'u5l11-bin', `<b>${name}</b>`, i * (BW + 10), 4, BW, 70); });
    const card = div(stage, 'u5l11-card', T(d.eq), W / 2, 112); card.style.translate = '-50% -50%';
    const PW = 556, pn = div(stage, 'u5l11-panel u5l11-mp', '', 0, 150, PW, 316);
    const L = d.lines.map((l, i) => {
      if (l[0] === 'X') { const x = h('div', 'u5l11-sl u5l11-xl2', `<b class="u5l11-n">${i + 1}</b>${ryanX(-4, 3, 4, -1, [[1, -4], [-1, 4], [2, -2]])}<span class="u5l11-note">${T('ac=2(-2)=-4')}, sum ${T('3')}</span>`); pn.appendChild(x); x.style.opacity = 0; return x; }
      return sline(pn, i + 1, l[0], l[1], l[2] ? 'u5l11-res' : '');
    });
    const GX = PW + 16, GWd = W - GX - 2;
    const G = new Graph(stage, Object.assign({ x: GX, y: 182, width: GWd, height: 284, ystep: d.ys, ylabels: d.ys * 2, xlabels: 1, fontSize: 14 }, d.win));
    const curve = hide(G.fn(d.f, { color: FN, width: 4 }));
    const zp = d.zs.map((z, i) => hide(G.point(z, 0, { color: ZR, r: 7, label: T(cZ(Number.isInteger(z) ? String(z) : Math.abs(z - 0.5) < 1e-9 ? '\\tfrac{1}{2}' : dec(z))), pos: i ? 'ne' : 'nw' })));
    const gl = div(stage, 'u5l11-gcap', `Check: graph ${T(`y=${d.gf}`)}`, GX + 8, 150); gl.style.opacity = 0;
    const B = bins[d.bin];
    const steps = [{
      cap: `${d.why}`,
      run: async (c) => {
        const bi = BINS.findIndex((b) => b[0] === d.bin), dx = bi * (BW + 10) + BW / 2 - W / 2, dy = 4 + 70 * 0.66 - 112;
        await anim(c, card, [{ transform: 'none' }, { transform: `translate(${dx}px, ${dy}px) scale(.62)` }], 700);
        B.classList.add('on'); await pulse(c, B, 1.05);
      }
    }];
    d.lines.forEach((l, i) => steps.push({
      cap: l[0] === 'X' ? `<b>Step ${i + 1}.</b> Ryan’s X: ${T('ac=-4')} on top, ${T('b=3')} underneath. List the factor pairs of ${T('-4')}: ${T('4')} and ${T('-1')} add to ${T('3')}.`
        : `<b>Step ${i + 1}.</b> ${T(l[0])}${l[1] ? ` <span class="u5l11-capn">(${l[1]})</span>` : ''}${l[2] ? '.' : ''}`,
      run: (c) => show(c, L[i])
    }));
    steps.push({
      cap: `<b>Check by graphing:</b> the roots are the ${T('x')}-intercepts of the graph (calculator: zero).`,
      run: async (c) => { bins.gr.classList.add('on2'); await show(c, gl); await drawOn(c, G, curve, 800); await Promise.all(zp.map((p) => popP(c, p))); }
    });
    return steps;
  }
};

/* ====================================================================================================
 * explainer: turn the k dial (Example 6(b), (c))
 * ==================================================================================================== */
const DK = {
  b: { label: 'Example 6(b)', ask: `Example 6(b): for what values of ${T('k')} does ${T('x^2+kx+9=0')} have equal roots? two distinct real roots?`,
    f: (k) => (x) => x * x + k * x + 9, D: (k) => k * k - 36, Dt: 'k^2-4(1)(9)=k^2-36', Dk: (k) => `${k < 0 ? `(${fr(k)})` : fr(k)}^2-36`, eqk: (k) => `y=x^2${k === 0 ? '' : (k < 0 ? '-' : '+') + (Math.abs(k) === 1 ? '' : fr(Math.abs(k))) + 'x'}+9`,
    win: { xmin: -8, xmax: 8, ymin: -18, ymax: 22 }, ys: 2, yl: 4, kmin: -10, kmax: 10, kst: 0.5, k0: 0 },
  c: { label: 'Example 6(c)', ask: `Example 6(c): for what values of ${T('k')} does ${T('kx^2-6x+3=0')} have no real roots? Describe the graph for these values.`,
    f: (k) => (x) => k * x * x - 6 * x + 3, D: (k) => 36 - 12 * k, Dt: '(-6)^2-4(k)(3)=36-12k', Dk: (k) => `36-12(${fr(k)})`, eqk: (k) => (k === 0 ? 'y=-6x+3' : `y=${coefS(k)}x^2-6x+3`),
    win: { xmin: -4, xmax: 8, ymin: -12, ymax: 12 }, ys: 2, yl: 4, kmin: -3, kmax: 6, kst: 0.25, k0: 1 }
};
const disc = {
  title: 'Turn the k dial',
  height: 470, minW: 960,
  choices: Object.keys(DK).map((k) => ({ v: k, label: DK[k].label })),
  ask: (v) => DK[v].ask,
  tap: false,
  make(stage, v, ex) {
    const d = DK[v], W = ex.W, GW = 450;
    const G = new Graph(stage, Object.assign({ x: 0, y: 8, width: GW, height: 456, xstep: 1, ystep: d.ys, xlabels: 2, ylabels: d.yl, fontSize: 15 }, d.win));
    const st = { k: d.k0 };
    const curve = G.fn((x) => d.f(st.k)(x), { color: FN, width: 4.5 });
    const PX = GW + 16, PW = W - PX - 2;
    const pn = div(stage, 'u5l11-panel u5l11-dp', '', PX, 8, PW, 220);
    const Ld = sline(pn, 1, `b^2-4ac=${d.Dt}`, '');
    const eqL = div(pn, 'u5l11-dk', ''), dL = div(pn, 'u5l11-dk', ''), vd = div(pn, 'u5l11-vd', '');
    const N = new NumberLine(stage, { x: PX, y: 300, width: PW, height: 96, min: d.kmin, max: d.kmax, step: 1, labelStep: v === 'b' ? 2 : 1, fontSize: 16 });
    const nt = div(stage, 'u5l11-nt', `the number line of ${T('k')}`, PX + 6, 240);
    const mk = div(N.html, 'u5l11-kmk', T(cA('k'))); mk.style.position = 'absolute'; mk.style.top = (N.ay - 50) + 'px';
    const zs = [0, 1].map(() => G.point(0, 0, { color: ZR, r: 7 }));
    const verdict = (k) => {
      if (v === 'c' && Math.abs(k) < 1e-9) return ['line', 'not quadratic: a straight line'];
      const D = d.D(k); return D > 1e-9 ? ['pos', 'two distinct real roots'] : D < -1e-9 ? ['neg', 'no real roots'] : ['zero', 'one real (equal) root'];
    };
    const set = (k) => {
      st.k = k; curve._bkDraw();
      const D = d.D(k), [cls, txt] = verdict(k);
      eqL.innerHTML = `${T(cA(`k=${fr(k)}`))}: ${T(d.eqk(k))}`;
      dL.innerHTML = cls === 'line' ? `${T('a=k=0')}` : T(`${d.Dk(k)}=${fr(D)}`);
      vd.className = 'u5l11-vd ' + cls; vd.innerHTML = `<b>${txt}</b>`;
      mk.style.left = N.toPx(k) + 'px'; mk.className = 'u5l11-kmk ' + cls;
      // the roots on the graph
      let roots = [];
      if (cls === 'line') roots = [0.5];
      else if (D >= -1e-9) { const a = v === 'b' ? 1 : k, b = v === 'b' ? k : -6, s = Math.sqrt(Math.max(0, D)); roots = [(-b - s) / (2 * a), (-b + s) / (2 * a)]; }
      zs.forEach((p, i) => { const r = roots[Math.min(i, roots.length - 1)]; if (r == null) { p.style.display = 'none'; p.gx = 1e9; return; } G.moveTo(p, r, 0); });
      if (+inp.value !== k) inp.value = k;
    };
    const inp = slider(stage, PX + 4, 410, PW - 8, d.kmin, d.kmax, d.kst, (k) => set(k), 'the value of k');
    const lab = div(stage, 'u5l11-sll', `drag ${T('k')}`, PX + PW / 2, 448); lab.style.translate = '-50% 0';
    set(d.k0);
    const go = (c, k1, ms) => { const k0 = st.k; return tween(c, ms ?? 400 + 300 * Math.abs(k1 - k0), (t) => set(Math.round((k0 + (k1 - k0) * t) * 100) / 100), linear).then(() => set(k1)); };
    const ivs = [];
    const ivl = (a, b, o) => { const e = hide(N.interval(a, b, o)); ivs.push(e); return e; };
    if (v === 'b') {
      const i1 = ivl(-Infinity, -6, { openB: true, color: AC }), i2 = ivl(6, Infinity, { openA: true, color: AC });
      const p1 = hide(N.point(-6, { color: VX })), p2 = hide(N.point(6, { color: VX }));
      return [
        { cap: `<b>Step 1.</b> The discriminant with ${T('a=1')}, ${T('b=k')}, ${T('c=9')}: ${T('b^2-4ac=k^2-36')}.`, run: (c) => show(c, Ld) },
        { cap: `${T('k=0')}: ${T('b^2-4ac=-36<0')}. <b>No real roots</b>: the parabola sits above the ${T('x')}-axis.`, run: (c) => pulse(c, vd, 1.05) },
        { cap: `Turn ${T('k')} up. At ${T('k=6')}, ${T('b^2-4ac=36-36=0')}: the vertex <b>touches</b> the ${T('x')}-axis, <b>one real (equal) root</b>.`, run: async (c) => { await go(c, 6); await Promise.all([popP(c, p2), pulse(c, vd, 1.05)]); } },
        { cap: `Past ${T('k=6')}: ${T('k^2>36')}, so the discriminant is positive and the parabola crosses <b>twice</b>.`, run: async (c) => { await go(c, 10); await drawOn(c, N, i2, 500); } },
        { cap: `Negative ${T('k')} works the same way, because ${T('k^2')} is never negative: ${T('k=-6')} touches, and ${T('k<-6')} crosses twice.`, run: async (c) => { await go(c, -6, 3600); await popP(c, p1); await go(c, -10); await drawOn(c, N, i1, 500); } },
        { cap: `Equal roots: ${T('k=\\pm6')}. Two distinct real roots: ${T('k<-6')} or ${T('k>6')}. Between them, no real roots. <b>Your turn:</b> drag ${T('k')}.`, run: async (c) => { await go(c, 0); await pulse(c, inp, 1.04); } }
      ];
    }
    const i1 = ivl(3, Infinity, { openA: true, color: RD });
    const p0 = hide(N.point(0, { open: true, color: GR }));
    return [
      { cap: `<b>Step 1.</b> Here ${T('a=k')}, ${T('b=-6')}, ${T('c=3')}: ${T('b^2-4ac=36-12k')}.`, run: (c) => show(c, Ld) },
      { cap: `<b>Step 2.</b> No real roots: ${T('36-12k<0')}, so ${T('36<12k')} and ${T('k>3')}.`, run: (c) => drawOn(c, N, i1, 600) },
      { cap: `${T('k=1')}: two roots. Turn ${T('k')} up to ${T('3')}: the discriminant shrinks to ${T('0')} and the vertex touches the axis at ${T('x=1')}.`, run: (c) => go(c, 3, 1800) },
      { cap: `${T('k>3')}: the parabola opens up (${T('k>0')}) and its vertex is <b>above</b> the ${T('x')}-axis, so there are no ${T('x')}-intercepts.`, run: (c) => go(c, 6, 1800) },
      { cap: `Careful at ${T('k=0')}: the equation is ${T('-6x+3=0')}, a straight line, not a quadratic. For ${T('k<0')} the parabola opens down and always crosses twice.`, run: async (c) => { await go(c, 0, 2600); await popP(c, p0); await go(c, -2, 900); } },
      { cap: `<b>Your turn:</b> drag ${T('k')} and watch the discriminant.`, run: async (c) => { await go(c, 4, 1000); await pulse(c, inp, 1.04); } }
    ];
  }
};

/* =============================== Stand Up Break! (whiteboard stations; ../standup.js) ===============================
 * BEG: read the characteristics of y = a(x − p)² + q. PRG: write the equation from the vertex and a point (integer a).
 * MAS: the discriminant, then solve exactly with the formula. */
const lin = (p) => (p === 0 ? 'x' : `(x${p > 0 ? '-' : '+'}${Math.abs(p)})`);
standup('u5l11', {
  intro: 'At your whiteboard: one question from the whole unit. Show every step.',
  levels: {
    BEG: (r) => {
      const a = r.pick([1, -1, 2, -2, 3, -3]), p = r.int(-5, 5), q = r.int(-9, 9) || 4, up = a > 0;
      const k = -q / a, xi = q === 0 ? '1' : k < 0 ? '0' : '2';
      return { text: 'State the vertex, the axis of symmetry, the maximum or minimum value, the range and the number of x-intercepts.', q: vform(a, p, q, false),
        a: [`\\text{vertex }(${p},\\ ${q});\\ \\text{axis }x=${p}`, `\\text{${up ? 'minimum' : 'maximum'} value }${q}`, `\\{y\\mid y${up ? '\\ge' : '\\le'}${q},\\ y\\in\\mathbb{R}\\}`, `\\text{${xi} }x\\text{-intercept${xi === '1' ? '' : 's'}}`] };
    },
    PRG: (r) => {
      const a = r.pick([1, -1, 2, -2, 3, -3]), p = r.int(-4, 4), q = r.int(-8, 8), dx = r.pick([1, 2, -1, -2]), x1 = p + dx, y1 = a * dx * dx + q;
      return { text: `The vertex is (${p}, ${q}) and the graph passes through (${x1}, ${y1}). Write the equation in vertex form.`, q: '',
        a: [`y=a${lin(p)}^2${q === 0 ? '' : q > 0 ? '+' + q : q}`, `${y1}=a(${x1}${p > 0 ? '-' + p : p < 0 ? '+' + -p : ''})^2${q === 0 ? '' : q > 0 ? '+' + q : q}`, `${y1 - q}=${dx * dx}a\\Rightarrow a=${a}`, vform(a, p, q, false)] };
    },
    MAS: (r) => {
      for (;;) {
        const a = r.pick([1, 2, 3]), b = r.int(-7, 7), c = r.int(-6, 6);
        const D = b * b - 4 * a * c;
        if (!c || D <= 0 || Number.isInteger(Math.sqrt(D))) continue;
        let m = 1, s = D; for (let k = 2; k * k <= s; k++) while (s % (k * k) === 0) { s /= k * k; m *= k; }
        const g = [b, m, 2 * a].reduce((x, y) => { x = Math.abs(x); y = Math.abs(y); while (y) [x, y] = [y, x % y]; return x; }), B = -b / g, M = m / g, A2 = 2 * a / g;
        const rt = `${M === 1 ? '' : M}\\sqrt{${s}}`, num = B === 0 ? `\\pm${rt}` : `${B}\\pm${rt}`;
        return { text: 'Use the discriminant to state the nature of the roots, then solve exactly (simplest radical form).', q: `${coefS(a)}x^2${b === 0 ? '' : (b < 0 ? '-' : '+') + (Math.abs(b) === 1 ? '' : Math.abs(b)) + 'x'}${c > 0 ? '+' + c : c}=0`,
          a: [`b^2-4ac=${b < 0 ? `(${b})` : b}^2-4(${a})(${c})=${D}>0`, '\\text{two distinct real roots}', `x=\\dfrac{${-b}\\pm\\sqrt{${D}}}{${2 * a}}`, A2 === 1 ? `x=${num}` : `x=\\dfrac{${num}}{${A2}}`] };
      }
    }
  }
});

/* =============================== mount =============================== */
export const explainers = mountExplainers({ lab, arch, method, disc });
export const _test = { features, vform, gform, MS };
void sleep; void r2;
