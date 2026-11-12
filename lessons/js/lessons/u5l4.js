/* Math 20-1 · Unit 5 · Lesson 4 — General Form and Factored Form: Intercepts, Axis and Vertex.
 * New lesson format (2026-11-11): the warm-up ("The Three Switches") is plain markup on the page (no code). Explainers:
 *   forms (STAR, hands-on: one parabola in all three forms. Each form's "free" features light up on the graph:
 *          vertex form the vertex and axis, general form the y-intercept, factored form the zeros. Then a slider for a
 *          changes all three equations together while the zeros stay put; tap a form to light it again),
 *   midpt (factored form, numbered 1–5: zeros, the two zeros walk to meet at the midpoint (the axis), drop to the
 *          vertex, y-intercept (and the mirror point), max/min and the curve; Examples 2(a)–(d) and 3),
 *   genf  (general form, numbered 1–4: c, the axis x = −b/2a (the negative sign), substitute for the vertex,
 *          max/min and the mirror point of the y-intercept; Example 4(a)–(d)),
 *   xfac  (Example 5(b): factor out −1, factor with Ryan's X (ac on top, b underneath, the factor pairs beside with the
 *          right pair circled), the zeros land on the graph, their midpoint matches the axis from (a): a ✓ stamp),
 *   pen   (Example 9: the pen against the barn changes shape as x slides and its area runs along A = −2x(x − 20):
 *          the zeros (no pen), the maximum at the midpoint, the domain and range; a slider to play with).
 * Colours (as in the hero): the vertex and the axis red (vertex form), the y-intercept green (general form), the zeros
 * amber (factored form), the curve blue. */
import {
  h, tex, add, box, Graph, stamp, stampIn, mountExplainers, pop, fadeIn, anim, tween, svgEl, pulse, linear, COLORS, texNum
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const CURVE = COLORS.blue;
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; if (el && el.label) el.label.style.opacity = 0; return el; };
const unhide = (el) => { if (el) el.style.opacity = ''; if (el && el.label) el.label.style.opacity = ''; return el; };
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
const absSvg = (stage, w, hh, x = 0, y = 0, cls = '') => { const s = svgEl('svg', { width: w, height: hh, viewBox: `0 0 ${w} ${hh}`, class: cls }, stage); s.style.position = 'absolute'; s.style.left = x + 'px'; s.style.top = y + 'px'; return s; };
const popP = (c, p) => { unhide(p); return Promise.all([pop(c, p), p.label ? fadeIn(c, p.label, 320) : null]); };
const tn = (v) => texNum(v, 3);
/* a numbered row for step-by-step procedures (the step number beside each step as it appears) */
const row = (host, n, html) => { const r = h('div', 'u5l4-row', `<span class="u5l4-n">${n}</span><div class="u5l4-rc">${html}</div>`); r.style.opacity = 0; host.appendChild(r); return r; };
const pt = (G, x, y, color, label, pos, o = {}) => { const p = G.point(x, y, Object.assign({ color, r: 7.5, label: label == null ? null : T(label), pos }, o)); hide(p); return p; };
const drawCurve = async (c, G, cv, ms = 900) => { unhide(cv); await G.drawIn(cv, ms, c); };
/* polynomial text */
const coef = (a) => (a === 1 ? '' : a === -1 ? '-' : tn(a));
const term = (co, v, first) => { if (Math.abs(co) < 1e-12) return ''; const s = co < 0 ? '-' : first ? '' : '+', m = Math.abs(co); return s + (m === 1 && v ? '' : tn(m)) + v; };
const poly = (a, b, c) => (term(a, 'x^2', true) + term(b, 'x') + term(c, '')) || '0';
const signed = (n) => (Math.abs(n) < 1e-12 ? '' : n < 0 ? '-' + tn(-n) : '+' + tn(n));

/* =============================== explainer: one parabola, three forms (STAR, hands-on) =============================== */
const forms = {
  title: 'One parabola, three forms',
  height: 440, minW: 880, tap: false, capH: 96,
  ask: () => `Three equations for <b>one</b> parabola. What does each form show <b>for free</b> on the graph?`,
  make(stage, v, ex) {
    const W = ex.W, GW = 400, PX = GW + 22, PW = W - PX;
    const S = { a: 1 };
    const G = new Graph(stage, { x: 0, y: 4, width: GW, height: 432, xmin: -3, xmax: 5, ymin: -9, ymax: 9, ylabels: 3, fontSize: 15, pad: [26, 18, 18, 18] });
    const cv = G.fn((x) => S.a * (x + 1) * (x - 3), { color: CURVE, width: 4 });
    hide(cv);
    const axis = G.vline(1, { color: 'red', width: 3 }); hide(axis);
    const V = pt(G, 1, -4, 'red', '(1,\\ -4)', 'e', { r: 8.5 });
    const Y = pt(G, 0, -3, 'green', '(0,\\ -3)', 'w', { r: 8.5 });
    const Z1 = pt(G, -1, 0, 'amber', '-1', 'nw', { r: 8.5 }), Z2 = pt(G, 3, 0, 'amber', '3', 'ne', { r: 8.5 });
    const P = div(stage, 'u5l4-pn', '', PX, 0, PW);
    const mk = (k, name) => { const b = h('button', 'u5l4-fc u5l4-fc' + k, `<span class="u5l4-fn">${name}</span><span class="u5l4-fa"></span><span class="u5l4-fe"></span><span class="u5l4-ff"></span>`); b.type = 'button'; b.style.opacity = 0; P.appendChild(b); return b; };
    const cV = mk('v', 'Vertex form'), cG = mk('g', 'General form'), cZ = mk('z', 'Factored form');
    const sl = h('label', 'u5l4-sl no-ink', `<span class="u5l4-sll">${T('a')}</span><input type="range" min="-2" max="2" step="0.25" aria-label="the value of a"><span class="u5l4-slv"></span>`);
    sl.setAttribute('data-tap', ''); sl.style.opacity = 0; P.appendChild(sl);
    const inp = sl.querySelector('input'), slv = sl.querySelector('.u5l4-slv');
    const lit = { v: false, g: false, z: false };
    let showA = false;
    const upd = () => {
      const a = S.a, q = -4 * a, c0 = -3 * a;
      cv._bkDraw();
      G.moveTo(V, 1, q); G.moveTo(Y, 0, c0);
      V.label.innerHTML = T(`(1,\\ ${tn(q)})`); Y.label.innerHTML = T(`(0,\\ ${tn(c0)})`);
      cV.querySelector('.u5l4-fe').innerHTML = T(`y=${coef(a)}(x-1)^2${signed(q)}`);
      cG.querySelector('.u5l4-fe').innerHTML = T(`y=${poly(a, -2 * a, c0)}`);
      cZ.querySelector('.u5l4-fe').innerHTML = T(`y=${coef(a)}(x+1)(x-3)`);
      cV.querySelector('.u5l4-ff').innerHTML = `vertex ${T(`(1,\\ ${tn(q)})`)}, axis ${T('x=1')}, ${a > 0 ? 'min' : 'max'} value ${T(tn(q))}`;
      cG.querySelector('.u5l4-ff').innerHTML = `${T('y')}-intercept ${T(tn(c0))}`;
      cZ.querySelector('.u5l4-ff').innerHTML = `zeros ${T('-1')} and ${T('3')}`;
      [cV, cG, cZ].forEach((b) => { const s = b.querySelector('.u5l4-fa'); s.innerHTML = showA ? T(`a=${tn(a)}`) : ''; });
      inp.value = a; slv.textContent = tn(a).replace('-', '−');
    };
    upd();
    const light = async (c, k) => {
      lit[k] = true;
      const card = { v: cV, g: cG, z: cZ }[k]; card.classList.add('on');
      if (k === 'v') { unhide(axis); await Promise.all([G.drawIn(axis, 500, c), popP(c, V)]); await pulse(c, V, 1.5); }
      if (k === 'g') { await popP(c, Y); await pulse(c, Y, 1.5); }
      if (k === 'z') { await Promise.all([popP(c, Z1), popP(c, Z2)]); await Promise.all([pulse(c, Z1, 1.5), pulse(c, Z2, 1.5)]); }
      await pulse(c, card, 1.04);
    };
    [['v', cV], ['g', cG], ['z', cZ]].forEach(([k, b]) => { b.onclick = () => { if (b.style.opacity !== '0') light(null, k).catch(() => {}); const els = k === 'v' ? [V] : k === 'g' ? [Y] : [Z1, Z2]; els.forEach((e) => e.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.7)' }, { transform: 'scale(1)' }], { duration: 600, transformBox: 'fill-box' })); }; });
    inp.addEventListener('input', () => { let a = parseFloat(inp.value); if (a === 0) a = S.a > 0 ? -0.25 : 0.25; S.a = a; upd(); });
    const go = (c, to, ms) => { const a0 = S.a; return tween(c, ms, (u) => { S.a = u >= 1 ? to : Math.round((a0 + (to - a0) * u) * 20) / 20; upd(); }); };
    return [
      { cap: `${T('y=(x-1)^2-4')}, ${T('y=x^2-2x-3')} and ${T('y=(x+1)(x-3)')}: expand any of them and you get ${T('x^2-2x-3')}. <b>One parabola, three equations.</b>`,
        run: async (c) => { await drawCurve(c, G, cv); for (const b of [cV, cG, cZ]) { b.style.opacity = ''; await fadeIn(c, b, 260); } } },
      { cap: `<b class="u5l4-cv">Vertex form</b> ${T('y=(x-1)^2-4')}: the vertex ${T('(1,\\ -4)')}, the axis ${T('x=1')} and the minimum value ${T('-4')} are right there in the equation.`,
        run: (c) => light(c, 'v') },
      { cap: `<b class="u5l4-cg">General form</b> ${T('y=x^2-2x-3')}: the constant term ${T('c=-3')} is the ${T('y')}-intercept, the point ${T('(0,\\ -3)')}.`,
        run: (c) => light(c, 'g') },
      { cap: `<b class="u5l4-cz">Factored form</b> ${T('y=(x+1)(x-3)')}: the zeros ${T('-1')} and ${T('3')}. The axis ${T('x=1')} sits exactly <b>halfway between</b> them.`,
        run: async (c) => { await light(c, 'z'); await pulse(c, axis, 1.02); } },
      { cap: `${T('a')} is the <b>same number</b> in all three forms. Change it and all three equations change together: the graph stretches or flips, but the zeros stay at ${T('-1')} and ${T('3')} and the axis stays at ${T('x=1')}.`,
        run: async (c) => { showA = true; upd(); sl.style.opacity = ''; await fadeIn(c, sl, 300); await go(c, 2, 1300); await go(c, 0.5, 1300); S.a = -0.5; upd(); await go(c, -1, 900); } },
      { cap: `<b>Your turn:</b> drag ${T('a')}, or tap a form to see what it shows for free.`,
        run: async (c) => { await go(c, 1, 900); await pulse(c, sl, 1.05); } }
    ];
  }
};

/* =============================== explainer: factored form → zeros, axis, vertex (procedure, numbered) =============================== */
const M2 = {
  a: { lab: 'Example 2(a)', eq: 'y=(x-2)(x+6)', f: (x) => (x - 2) * (x + 6), r: -6, s: 2, p: -2, q: -16, c: -12, a: 1,
    z: `${T('x-2=0')} or ${T('x+6=0')}: zeros ${T('2')} and ${T('-6')}`, ax: 'x=\\frac{2+(-6)}{2}=-2',
    sub: 'y=(-2-2)(-2+6)=(-4)(4)=-16', vt: '(-2,\\ -16)', yi: 'y=(0-2)(0+6)=(-2)(6)=-12', mm: `${T('a=1>0')}: opens up, <b>minimum</b> value ${T('-16')}`,
    win: { xmin: -8, xmax: 4, ymin: -18, ymax: 6, ystep: 2, ylabels: 4, xlabels: 2 } },
  b: { lab: 'Example 2(b)', eq: 'y=-3(x+1)(x-7)', f: (x) => -3 * (x + 1) * (x - 7), r: -1, s: 7, p: 3, q: 48, c: 21, a: -3,
    z: `${T('x+1=0')} or ${T('x-7=0')}: zeros ${T('-1')} and ${T('7')}`, ax: 'x=\\frac{-1+7}{2}=3',
    sub: 'y=-3(3+1)(3-7)=-3(4)(-4)=48', vt: '(3,\\ 48)', yi: 'y=-3(0+1)(0-7)=-3(1)(-7)=21', mm: `${T('a=-3<0')}: opens down, <b>maximum</b> value ${T('48')}`,
    win: { xmin: -3, xmax: 9, ymin: -12, ymax: 54, ystep: 6, ylabels: 12, xlabels: 2 } },
  c: { lab: 'Example 2(c)', eq: 'y=2x(x-5)', f: (x) => 2 * x * (x - 5), r: 0, s: 5, p: 2.5, q: -12.5, c: 0, a: 2,
    z: `${T('2x=0')} or ${T('x-5=0')}: zeros ${T('0')} and ${T('5')}`, ax: 'x=\\frac{0+5}{2}=2.5',
    sub: 'y=2(2.5)(2.5-5)=2(2.5)(-2.5)=-12.5', vt: '(2.5,\\ -12.5)', yi: 'y=2(0)(0-5)=0', mm: `${T('a=2>0')}: opens up, <b>minimum</b> value ${T('-12.5')}`,
    win: { xmin: -2, xmax: 7, ymin: -14, ymax: 6, ystep: 2, ylabels: 4, xlabels: 1 } },
  d: { lab: 'Example 2(d)', eq: 'y=(2x+3)(x-2)', f: (x) => (2 * x + 3) * (x - 2), r: -1.5, s: 2, p: 0.25, q: -6.125, c: -6, a: 2,
    z: `${T('2x+3=0\\Rightarrow x=-\\frac32')} or ${T('x-2=0')}: zeros ${T('-\\frac32')} and ${T('2')}`, ax: 'x=\\frac{-1.5+2}{2}=\\frac14',
    sub: 'y=(3.5)(-1.75)=-6.125=-\\frac{49}{8}', vt: '\\left(\\frac14,\\ -\\frac{49}{8}\\right)', yi: 'y=(3)(-2)=-6', mm: `${T('a=2>0')} (from ${T('2x\\cdot x')}): opens up, <b>minimum</b> value ${T('-\\frac{49}{8}')}`,
    win: { xmin: -3, xmax: 4, ymin: -8, ymax: 6, ystep: 1, ylabels: 2, xlabels: 1 }, rl: '-\\frac32' },
  e3: { lab: 'Example 3', eq: 'y=-\\frac12(x+1)(x-5)', f: (x) => -0.5 * (x + 1) * (x - 5), r: -1, s: 5, p: 2, q: 4.5, c: 2.5, a: -0.5, mirror: 4,
    z: `${T('x+1=0')} or ${T('x-5=0')}: zeros ${T('-1')} and ${T('5')}`, ax: 'x=\\frac{-1+5}{2}=2',
    sub: 'y=-\\frac12(3)(-3)=4.5', vt: '(2,\\ 4.5)', yi: 'y=-\\frac12(1)(-5)=2.5', mm: `${T('a<0')}: <b>maximum</b> ${T('4.5')}. D: ${T('\\{x\\mid x\\in\\mathbb{R}\\}')}, R: ${T('\\{y\\mid y\\le4.5,\\ y\\in\\mathbb{R}\\}')}`,
    win: { xmin: -3, xmax: 7, ymin: -4, ymax: 6, ystep: 1, ylabels: 2, xlabels: 1 } }
};
const midpt = {
  title: 'Factored form: zeros → axis → vertex',
  height: 440, minW: 880, capH: 96,
  choices: [{ sep: 'Example 2:' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }, { v: 'c', label: '(c)' }, { v: 'd', label: '(d)' }, { v: 'e3', label: 'Example 3' }],
  ask: (v) => `<b>${M2[v].lab}:</b> ${T(M2[v].eq)}. State the zeros, the axis of symmetry, the vertex, the ${T('y')}-intercept and the max or min value.`,
  make(stage, v, ex) {
    const W = ex.W, d = M2[v], LW = 440, GX = LW + 20, GW = W - GX;
    const rows = div(stage, 'u5l4-rows', '', 0, 2, LW, 436);
    const G = new Graph(stage, Object.assign({ x: GX, y: 2, width: GW, height: 436, fontSize: 14, pad: [22, 16, 16, 16] }, d.win));
    const cv = G.fn(d.f, { color: CURVE, width: 4 }); hide(cv);
    const up = d.q > 0;
    const rl = d.rl || tn(d.r), zl = (val, txt) => pt(G, val, 0, 'amber', txt, up ? (val < d.p ? 'se' : 'sw') : (val < d.p ? 'nw' : 'ne'));
    const Z1 = zl(d.r, rl), Z2 = zl(d.s, tn(d.s));
    const w1 = G.point(d.r, 0, { color: 'amber', r: 5.5, open: true }), w2 = G.point(d.s, 0, { color: 'amber', r: 5.5, open: true }); hide(w1); hide(w2);
    const axis = G.vline(d.p, { color: 'red', width: 3 }); hide(axis);
    const V = pt(G, d.p, 0, 'red', d.vt, up ? 'e' : 'e', { r: 8.5 });
    const Y = pt(G, 0, d.c, 'green', `(0,\\ ${tn(d.c)})`, d.c === 0 ? 'nw' : 'w');
    const Mi = d.mirror != null ? pt(G, 0, d.c, 'green', `(${d.mirror},\\ ${tn(d.c)})`, 'e', { open: true }) : null;
    const r1 = row(rows, 1, d.z);
    const r2 = row(rows, 2, `axis ${T(d.ax)}`);
    const r3 = row(rows, 3, `${T(d.sub)}<br>vertex ${T(d.vt)}`);
    const r4 = row(rows, 4, `${T('y')}-int: ${T(d.yi)}${Mi ? `<br>mirror point ${T(`(${d.mirror},\\ ${tn(d.c)})`)}` : ''}`);
    const r5 = row(rows, 5, d.mm);
    return [
      { cap: `<b>1</b> The zeros: set each factor equal to ${T('0')}. ${d.z}.`,
        run: async (c) => { await show(c, r1); await Promise.all([popP(c, Z1), popP(c, Z2)]); } },
      { cap: `<b>2</b> The zeros are mirror images, so the axis is <b>halfway between</b> them: ${T(d.ax)}.`,
        run: async (c) => {
          await show(c, r2); unhide(w1); unhide(w2);
          await Promise.all([G.move(c, w1, d.p, 0, 1100), G.move(c, w2, d.p, 0, 1100)]);
          unhide(axis); await G.drawIn(axis, 600, c); hide(w1); hide(w2);
        } },
      { cap: `<b>3</b> The vertex is on the axis: substitute ${T('x=' + tn(d.p).replace('0.25', '\\frac14'))}. ${T(d.sub)}, so the vertex is ${T(d.vt)}.`,
        run: async (c) => { await show(c, r3); await popP(c, V); await G.move(c, V, d.p, d.q, 900); await pulse(c, V, 1.5); } },
      { cap: `<b>4</b> The ${T('y')}-intercept: substitute ${T('x=0')}. ${T(d.yi)}.${Mi ? ` Its mirror image across the axis is ${T(`(${d.mirror},\\ ${tn(d.c)})`)}.` : ''}`,
        run: async (c) => { await show(c, r4); await popP(c, Y); if (Mi) { await popP(c, Mi); await G.move(c, Mi, d.mirror, d.c, 800); } } },
      { cap: `<b>5</b> ${d.mm}. Sketch through the points.`,
        run: async (c) => { await show(c, r5); await drawCurve(c, G, cv, 1000); } }
    ];
  }
};

/* =============================== explainer: general form → c, x = −b/2a, vertex (procedure, numbered) =============================== */
const M4 = {
  a: { eq: 'y=x^2-8x+10', a: 1, b: -8, c: 10, p: 4, q: -6, ax: 'x=-\\frac{-8}{2(1)}=4', sub: 'y=4^2-8(4)+10', s2: '=16-32+10=-6', vt: '(4,\\ -6)', mx: 8,
    win: { xmin: -1, xmax: 9, ymin: -8, ymax: 12, ystep: 2, ylabels: 4 } },
  b: { eq: 'y=2x^2+12x+7', a: 2, b: 12, c: 7, p: -3, q: -11, ax: 'x=-\\frac{12}{2(2)}=-3', sub: 'y=2(-3)^2+12(-3)+7', s2: '=18-36+7=-11', vt: '(-3,\\ -11)', mx: -6,
    win: { xmin: -8, xmax: 2, ymin: -14, ymax: 10, ystep: 2, ylabels: 4 } },
  c: { eq: 'y=-3x^2+12x+1', a: -3, b: 12, c: 1, p: 2, q: 13, ax: 'x=-\\frac{12}{2(-3)}=2', sub: 'y=-3(2)^2+12(2)+1', s2: '=-12+24+1=13', vt: '(2,\\ 13)', mx: 4,
    win: { xmin: -1, xmax: 5, ymin: -4, ymax: 16, ystep: 2, ylabels: 4 } },
  d: { eq: 'y=-x^2-5x', a: -1, b: -5, c: 0, p: -2.5, q: 6.25, ax: 'x=-\\frac{-5}{2(-1)}=-\\frac52', sub: 'y=-\\left(-\\frac52\\right)^2-5\\left(-\\frac52\\right)', s2: '=-\\frac{25}{4}+\\frac{25}{2}=\\frac{25}{4}', vt: '\\left(-\\frac52,\\ \\frac{25}{4}\\right)', mx: -5, qt: '\\frac{25}{4}',
    win: { xmin: -7, xmax: 2, ymin: -3, ymax: 8, ystep: 1, ylabels: 2 } }
};
const genf = {
  title: 'General form: c, then x = −b/2a',
  height: 440, minW: 880, capH: 96,
  choices: [{ sep: 'Example 4:' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }, { v: 'c', label: '(c)' }, { v: 'd', label: '(d)' }],
  ask: (v) => `<b>Example 4(${v}):</b> ${T(M4[v].eq)}. Find the axis of symmetry, the vertex, the max or min value and the ${T('y')}-intercept.`,
  make(stage, v, ex) {
    const W = ex.W, d = M4[v], LW = 440, GX = LW + 20, GW = W - GX;
    const rows = div(stage, 'u5l4-rows', '', 0, 2, LW, 436);
    const G = new Graph(stage, Object.assign({ x: GX, y: 2, width: GW, height: 436, fontSize: 14, pad: [22, 16, 16, 16] }, d.win));
    const f = (x) => d.a * x * x + d.b * x + d.c;
    const cv = G.fn(f, { color: CURVE, width: 4 }); hide(cv);
    const up = d.a > 0, qt = d.qt || tn(d.q);
    const axis = G.vline(d.p, { color: 'red', width: 3 }); hide(axis);
    const V = pt(G, d.p, d.c, 'red', d.vt, 'e', { r: 8.5 });
    const Y = pt(G, 0, d.c, 'green', `(0,\\ ${tn(d.c)})`, d.p < 0 ? 'nw' : 'ne');
    const Mi = pt(G, 0, d.c, 'green', `(${tn(d.mx)},\\ ${tn(d.c)})`, d.p < 0 ? 'ne' : 'nw', { open: true });
    const r1 = row(rows, 1, `${T(`a=${tn(d.a)},\\ b=${tn(d.b)},\\ c=${tn(d.c)}`)}<br>${T('y')}-intercept ${T(tn(d.c))}`);
    const r2 = row(rows, 2, `${T('x=-\\frac{b}{2a}')} <span class="u5l4-neg">− first!</span><br>${T(d.ax)}`);
    const r3 = row(rows, 3, `${T(d.sub)}<br>${T(d.s2)}<br>vertex ${T(d.vt)}`);
    const r4 = row(rows, 4, `${T(`a${up ? '>' : '<'}0`)}: <b>${up ? 'minimum' : 'maximum'}</b> value ${T(qt)}<br>mirror of ${T(`(0,\\ ${tn(d.c)})`)}: ${T(`(${tn(d.mx)},\\ ${tn(d.c)})`)}`);
    return [
      { cap: `<b>1</b> Read ${T(`a=${tn(d.a)}`)}, ${T(`b=${tn(d.b)}`)}, ${T(`c=${tn(d.c)}`)}. The ${T('y')}-intercept is ${T('c')}: the point ${T(`(0,\\ ${tn(d.c)})`)}.`,
        run: async (c) => { await show(c, r1); await popP(c, Y); await pulse(c, Y, 1.5); } },
      { cap: `<b>2</b> The axis: ${T('x=-\\frac{b}{2a}')}. Keep the <b>negative sign</b> in front: ${T(d.ax)}.`,
        run: async (c) => { await show(c, r2); await pulse(c, r2.querySelector('.u5l4-neg'), 1.25); unhide(axis); await G.drawIn(axis, 600, c); } },
      { cap: `<b>3</b> Substitute ${T('x=' + (d.p === -2.5 ? '-\\frac52' : tn(d.p)))} into the equation: ${T(d.sub + d.s2)}. The vertex is ${T(d.vt)}.`,
        run: async (c) => { await show(c, r3); await popP(c, V); await G.move(c, V, d.p, d.q, 900); await pulse(c, V, 1.5); } },
      { cap: `<b>4</b> ${T(`a${up ? '>0' : '<0'}`)}: the parabola opens ${up ? 'up' : 'down'}, so the ${up ? '<b>minimum</b>' : '<b>maximum</b>'} value is ${T(qt)}. The mirror of the ${T('y')}-intercept, ${T(`(${tn(d.mx)},\\ ${tn(d.c)})`)}, helps the sketch.`,
        run: async (c) => { await show(c, r4); await popP(c, Mi); await G.move(c, Mi, d.mx, d.c, 800); await drawCurve(c, G, cv, 1000); } }
    ];
  }
};

/* =============================== explainer: Example 5(b) with the X =============================== */
const xfac = {
  title: 'Factor with the X, then check the axis',
  height: 440, minW: 880, capH: 96,
  ask: () => `<b>Example 5(b):</b> write ${T('y=-x^2+2x+8')} in factored form and state its zeros.`,
  make(stage, v, ex) {
    const W = ex.W, GW = 400, RX = GW + 22, RW = W - RX;
    const G = new Graph(stage, { x: 0, y: 2, width: GW, height: 436, xmin: -4, xmax: 6, ymin: -2, ymax: 10, ylabels: 2, fontSize: 14, pad: [22, 16, 16, 16] });
    const cv = G.fn((x) => -x * x + 2 * x + 8, { color: CURVE, width: 4 }); hide(cv);
    const axis = G.vline(1, { color: 'red', width: 3 }); hide(axis);
    const V = pt(G, 1, 9, 'red', '(1,\\ 9)', 'e', { r: 8.5 });
    const Y = pt(G, 0, 8, 'green', '(0,\\ 8)', 'w');
    const Mi = pt(G, 0, 8, 'green', '(2,\\ 8)', 'e', { open: true });
    const Z1 = pt(G, -2, 0, 'amber', '-2', 'sw', { r: 8.5 }), Z2 = pt(G, 4, 0, 'amber', '4', 'se', { r: 8.5 });
    const w1 = G.point(-2, 0, { color: 'amber', r: 5.5, open: true }), w2 = G.point(4, 0, { color: 'amber', r: 5.5, open: true }); hide(w1); hide(w2);
    // the X: ac on top, b underneath, the two numbers on the sides; factor pairs beside, the right pair circled
    const XS = 176, XX = RX + 4, XY = 6;
    const xsv = absSvg(stage, XS, XS, XX, XY, 'u5l4-x');
    svgEl('line', { x1: 24, y1: 24, x2: XS - 24, y2: XS - 24 }, xsv); svgEl('line', { x1: XS - 24, y1: 24, x2: 24, y2: XS - 24 }, xsv);
    const xl = (html, x, y, cls) => div(stage, 'u5l4-xl ' + cls, html, XX + x, XY + y);
    const xt = xl(T('-8'), XS / 2, 10, 'u5l4-xt'), xb = xl(T('-2'), XS / 2, XS - 10, 'u5l4-xb');
    const xa = xl(T('2'), 10, XS / 2, 'u5l4-xs'), xc = xl(T('-4'), XS - 10, XS / 2, 'u5l4-xs');
    const PAIRS = [[1, -8], [-1, 8], [2, -4], [-2, 4]], PICK = 2;
    const pl = div(stage, 'u5l4-pairs', `<div class="u5l4-ph">pairs for ${T('-8')}</div>` + PAIRS.map(([m, n], i) => `<div class="${i === PICK ? 'u5l4-pk' : ''}">${T(`${m}\\cdot${n < 0 ? '(' + n + ')' : n}`)}<i>${T('\\to' + (m + n))}</i></div>`).join(''), XX + XS + 16, XY, RW - XS - 22);
    [xsv, xt, xb, xa, xc, pl].forEach(hide);
    const rows = div(stage, 'u5l4-rows u5l4-rows-s', '', RX, XY + XS + 10, RW, 440 - XS - 18);
    const r1 = row(rows, 1, `${T('a=-1')}: ${T('y=-(x^2-2x-8)')}`);
    const r2 = row(rows, 2, `the X: ${T('2')} and ${T('-4')} (product ${T('-8')}, sum ${T('-2')})`);
    const r3 = row(rows, 3, `${T('y=-(x-4)(x+2)')}: zeros ${T('4')} and ${T('-2')}`);
    const r4 = row(rows, 4, `midpoint ${T('\\frac{4+(-2)}{2}=1')} ✓`);
    const st = stamp(stage, '✓ same axis as (a)', { ok: true, x: RX + RW / 2, y: 412, size: 'sm' }); st.style.opacity = 0;
    return [
      { cap: `From (a): the ${T('y')}-intercept ${T('(0,\\ 8)')}, the axis ${T('x=1')} and the vertex ${T('(1,\\ 9)')}. Now the zeros.`,
        run: async (c) => { await popP(c, Y); unhide(axis); await G.drawIn(axis, 500, c); await popP(c, V); } },
      { cap: `<b>1</b> ${T('a=-1')}: take out the ${T('-1')} first, so the trinomial inside starts with ${T('x^2')}: ${T('y=-(x^2-2x-8)')}.`,
        run: (c) => show(c, r1) },
      { cap: `<b>2</b> The X: ${T('ac=-8')} on top, ${T('b=-2')} underneath. List the factor pairs of ${T('-8')}: ${T('2')} and ${T('-4')} multiply to ${T('-8')} and add to ${T('-2')}.`,
        run: async (c) => {
          unhide(xsv); await fadeIn(c, xsv, 300); unhide(xt); await pop(c, xt); unhide(xb); await pop(c, xb);
          unhide(pl); await fadeIn(c, pl, 300); const pk = pl.querySelector('.u5l4-pk'); pk.classList.add('on'); await pulse(c, pk, 1.12);
          unhide(xa); unhide(xc); await Promise.all([pop(c, xa), pop(c, xc)]); await show(c, r2);
        } },
      { cap: `<b>3</b> The two numbers go into the factors: ${T('y=-(x-4)(x+2)')}. Set each factor to ${T('0')}: the zeros are ${T('4')} and ${T('-2')}.`,
        run: async (c) => { await show(c, r3); await Promise.all([popP(c, Z1), popP(c, Z2)]); } },
      { cap: `<b>4</b> Check: halfway between the zeros is ${T('\\frac{4+(-2)}{2}=1')}, the <b>same axis</b> we found in (a). ✓`,
        run: async (c) => {
          await show(c, r4); unhide(w1); unhide(w2);
          await Promise.all([G.move(c, w1, 1, 0, 1000), G.move(c, w2, 1, 0, 1000)]); hide(w1); hide(w2);
          st.style.opacity = ''; await stampIn(c, st);
        } },
      { cap: `(c) ${T('a<0')}: the vertex is a maximum, so the range is ${T('\\{y\\mid y\\le9,\\ y\\in\\mathbb{R}\\}')}. The mirror of ${T('(0,\\ 8)')} is ${T('(2,\\ 8)')}: sketch through the five points.`,
        run: async (c) => { await popP(c, Mi); await G.move(c, Mi, 2, 8, 700); await drawCurve(c, G, cv, 1000); } }
    ];
  }
};

/* =============================== explainer: the pen against the barn (Example 9, hands-on) =============================== */
const pen = {
  title: 'The pen against the barn',
  height: 440, minW: 880, tap: false, capH: 96,
  ask: () => `<b>Example 9:</b> ${T('40')} m of fence, a pen against a barn wall, ${T('A=x(40-2x)')}. Where are the zeros, and what is the largest pen?`,
  make(stage, v, ex) {
    const W = ex.W, SW = 400, GX = SW + 22, GW = W - GX;
    const S = { x: 6 };
    const A = (x) => x * (40 - 2 * x);
    const G = new Graph(stage, { x: GX, y: 2, width: GW, height: 436, xmin: 0, xmax: 22, ymin: 0, ymax: 230, xstep: 2, ystep: 20, xlabels: 4, ylabels: 40, arrows: false, fnArrows: false, xtitle: 'x', ytitle: 'A', fontSize: 14 });
    G.fn(A, { from: 0, to: 20, color: CURVE, width: 4 });
    const axis = G.vline(10, { color: 'red', width: 3 }); hide(axis);
    const V = pt(G, 10, 200, 'red', '(10,\\ 200)', 'e', { r: 8.5 });
    const Z1 = pt(G, 0, 0, 'amber', '0', 'ne', { r: 8.5 }), Z2 = pt(G, 20, 0, 'amber', '20', 'n', { r: 8.5 });
    const dot = G.point(S.x, A(S.x), { color: 'purple', r: 8 });
    const sx = G.shadeX(0, 20, { openA: true, openB: true, color: 'amber' }); hide(sx);
    const sy = G.shadeY(0, 200, { openA: true, color: 'purple' }); hide(sy);
    // the scene: barn wall on top, the pen hangs below it (1 m = K px)
    const K = 8.4, CX = SW / 2, WY = 54;
    const sc = absSvg(stage, SW, 252, 0, 0, 'u5l4-scene');
    svgEl('rect', { x: 0, y: 0, width: SW, height: 252, rx: 12, fill: '#e9f4df' }, sc);
    svgEl('rect', { x: 8, y: 8, width: SW - 16, height: WY - 8, rx: 4, fill: '#a4452c', stroke: '#5a2416', 'stroke-width': 2.5 }, sc);
    for (let i = 1; i < 12; i++) svgEl('line', { x1: 8 + i * (SW - 16) / 12, y1: 8, x2: 8 + i * (SW - 16) / 12, y2: WY, stroke: '#7c2f1c', 'stroke-width': 1.5 }, sc);
    const wl = svgEl('text', { x: CX, y: 37, 'text-anchor': 'middle', class: 'u5l4-wall' }, sc); wl.textContent = 'BARN WALL';
    const yard = svgEl('rect', { fill: '#f6e7b8', stroke: 'none' }, sc);
    const fence = svgEl('path', { fill: 'none', stroke: '#6b4a2b', 'stroke-width': 5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, sc);
    const posts = svgEl('g', { fill: '#6b4a2b' }, sc);
    const sheep = svgEl('text', { 'font-size': 34, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, sc); sheep.textContent = '🐑';
    const lx = div(stage, 'u5l4-plab', '', 0, 0), lw = div(stage, 'u5l4-plab', '', 0, 0);
    const live = div(stage, 'u5l4-live', '', 0, 262, SW);
    const sl = h('label', 'u5l4-sl no-ink', `<span class="u5l4-sll">${T('x')}</span><input type="range" min="0" max="20" step="0.5" aria-label="the side x in metres"><span class="u5l4-slv"></span>`);
    sl.setAttribute('data-tap', ''); add(stage, box(sl, SW), 0, 372); sl.style.position = 'absolute';
    const inp = sl.querySelector('input'), slv = sl.querySelector('.u5l4-slv');
    const upd = () => {
      const x = S.x, L = 40 - 2 * x, a = A(x), wpx = L * K, hpx = x * K, x0 = CX - wpx / 2, x1 = CX + wpx / 2, y1 = WY + hpx;
      yard.setAttribute('x', x0); yard.setAttribute('y', WY); yard.setAttribute('width', Math.max(0, wpx)); yard.setAttribute('height', Math.max(0, hpx));
      fence.setAttribute('d', `M${x0} ${WY} L${x0} ${y1} L${x1} ${y1} L${x1} ${WY}`);
      posts.innerHTML = [[x0, WY], [x0, y1], [x1, y1], [x1, WY]].map(([px, py]) => `<circle cx="${px}" cy="${py}" r="5"/>`).join('');
      sheep.setAttribute('x', CX); sheep.setAttribute('y', WY + hpx / 2); sheep.style.opacity = a > 40 ? 1 : 0;
      lx.innerHTML = T(`x=${tn(x)}`); lx.style.left = Math.max(2, x0 - 74) + 'px'; lx.style.top = (WY + Math.max(hpx / 2 - 14, 2)) + 'px';
      lw.innerHTML = T(`40-2x=${tn(L)}`); lw.style.left = (CX - 70) + 'px'; lw.style.top = Math.min(y1 + 6, 222) + 'px';
      G.moveTo(dot, x, a);
      live.innerHTML = `${T('A=-2x(x-20)')}<br>${T(`x=${tn(x)}`)} m, &nbsp;${T(`40-2x=${tn(L)}`)} m<br><b>${T(`A=${tn(x)}(${tn(L)})=${tn(a)}`)}</b> ${T('\\text{m}^2')}${a === 0 ? ' &nbsp;<span class="u5l4-nop">no pen!</span>' : ''}`;
      inp.value = x; slv.textContent = tn(x);
    };
    inp.addEventListener('input', () => { S.x = parseFloat(inp.value); upd(); });
    upd();
    const go = (c, to, ms, ease) => { const x0 = S.x; return tween(c, ms, (u) => { S.x = u >= 1 ? to : Math.round((x0 + (to - x0) * u) * 10) / 10; upd(); }, ease); };
    return [
      { cap: `(a) Take ${T('-2')} out of the second factor: ${T('40-2x=-2(x-20)')}, so ${T('A=x(-2)(x-20)=-2x(x-20)')}. Watch the pen as ${T('x')} changes.`,
        run: async (c) => { await go(c, 14, 1400); await go(c, 6, 1200); } },
      { cap: `Zeros ${T('0')} and ${T('20')}. At ${T('x=0')} the pen is squashed flat against the wall; at ${T('x=20')} the two sides use all ${T('40')} m and the far side is ${T('0')} m: <b>no pen</b> either way.`,
        run: async (c) => { await go(c, 0, 1000); await popP(c, Z1); await pulse(c, Z1, 1.5); await go(c, 20, 2200, linear); await popP(c, Z2); await pulse(c, Z2, 1.5); } },
      { cap: `(b) The axis is halfway between the zeros: ${T('x=\\frac{0+20}{2}=10')}. ${T('A=10(40-20)=200')}: the <b>maximum area</b> is ${T('200\\text{ m}^2')}, ${T('10')} m by ${T('20')} m (the ${T('20')} m side along the wall).`,
        run: async (c) => { unhide(axis); await G.drawIn(axis, 500, c); await go(c, 10, 1300); await popP(c, V); await pulse(c, V, 1.5); } },
      { cap: `(c) A real pen needs ${T('0<x<20')} (open dots: the zeros give no pen), and then ${T('0<A\\le200')}. D: ${T('\\{x\\mid0<x<20,\\ x\\in\\mathbb{R}\\}')}, R: ${T('\\{A\\mid0<A\\le200,\\ A\\in\\mathbb{R}\\}')}.`,
        run: async (c) => { unhide(sx); await G.drawIn(sx, 700, c); unhide(sy); await G.drawIn(sy, 700, c); } },
      { cap: `<b>Your turn:</b> drag ${T('x')}. Every pen's area is a point on the parabola; none beats ${T('x=10')}.`,
        run: async (c) => { await go(c, 4, 900); await pulse(c, sl, 1.05); } }
    ];
  }
};

/* =============================== Stand Up Break! =============================== */
const lin = (r) => (r === 0 ? 'x' : `(x${r < 0 ? '+' : '-'}${Math.abs(r)})`);
const facT = (a, r, s) => { const [u, w] = r === 0 ? [r, s] : s === 0 ? [s, r] : [r, s]; return `${coef(a)}${lin(u)}${lin(w)}`; };
const par = (n) => (n < 0 ? `(${n})` : String(n));
standup('u5l4', {
  intro: 'At your whiteboard: factored form → zeros first, then the midpoint. General form → c, then x = −b/2a.',
  levels: {
    BEG: (r) => {
      for (;;) {
        const a = r.pick([1, 1, -1, 2, -2, 3]), p = r.int(-5, 5), d = r.int(1, 6), u = p - d, w = p + d;
        if (u === 0 && w === 0) continue;
        const [z1, z2] = r.chance(0.5) ? [u, w] : [w, u];
        const q = a * (p - z1) * (p - z2), c = a * z1 * z2;
        return { text: 'State the zeros, the axis of symmetry, the vertex and the <i>y</i>-intercept.', q: `y=${facT(a, z1, z2)}`,
          a: [`\\text{zeros } {${z1}} \\text{ and } {${z2}}`, `\\text{axis } x=\\frac{${z1}+${par(z2)}}{2}=${p}`,
            `y=${coef(a)}(${p}${z1 < 0 ? '+' + (-z1) : z1 === 0 ? '' : '-' + z1})(${p}${z2 < 0 ? '+' + (-z2) : z2 === 0 ? '' : '-' + z2})=${q}`, `\\text{vertex }(${p},\\ ${q})`,
            `y\\text{-intercept } {${c}}`] };
      }
    },
    PRG: (r) => {
      for (;;) {
        const a = r.pick([1, -1, 2, -2, 3, -3]), p = r.int(-5, 5), c = r.int(-9, 9);
        if (p === 0) continue;
        const b = -2 * a * p, q = c - a * p * p;
        return { text: 'State the <i>y</i>-intercept, the axis of symmetry, the vertex, and the maximum or minimum value.', q: `y=${poly(a, b, c)}`,
          a: [`y\\text{-intercept } {${c}}`, `x=-\\frac{${b}}{2(${a})}=${p}`, `y=${a === 1 ? '' : a === -1 ? '-' : a}(${p})^2${b < 0 ? '-' : '+'}${Math.abs(b)}(${p})${c < 0 ? '-' + (-c) : c ? '+' + c : ''}=${q}`,
            `\\text{vertex }(${p},\\ ${q}),\\ \\text{${a > 0 ? 'minimum' : 'maximum'} value } {${q}}`] };
      }
    },
    MAS: (r) => {
      for (;;) {
        const a = r.pick([1, -1, 2, -2, 3]), p = r.int(-4, 4), d = r.int(1, 5), z1 = p - d, z2 = p + d;
        if (z1 === 0 || z2 === 0) continue;
        const b = -a * (z1 + z2), c = a * z1 * z2, q = a * (p - z1) * (p - z2);
        const inner = poly(1, -(z1 + z2), z1 * z2);
        return { text: 'Factor (use the X). Then state the zeros, the axis of symmetry and the vertex.', q: `y=${poly(a, b, c)}`,
          a: [a === 1 ? `y=${facT(1, z1, z2)}` : `y=${coef(a)}(${inner})=${facT(a, z1, z2)}`, `\\text{zeros } {${z1}} \\text{ and } {${z2}};\\ \\text{axis } x=${p}`, `\\text{vertex }(${p},\\ ${q})`] };
      }
    }
  }
});

/* =============================== mount =============================== */
export const explainers = mountExplainers({ forms, midpt, genf, xfac, pen });
