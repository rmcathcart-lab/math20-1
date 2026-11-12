/* Math 20-1 · Unit 5 · Lesson 3 — Characteristics of a Quadratic Function in Vertex Form.
 * New lesson format (2026-11-11): the warm-up ("The Gateway Arch") is plain markup on the page (no code). Explainers:
 *   reader (hands-on: Example 1 row by row: the parabola morphs into each function while its vertex, axis, opening and
 *           max/min value light up and the table fills; a second chip has a, p, q sliders to play with),
 *   fold   (Example 4: the y-intercept, its distance to the axis, then the graph FOLDS along the axis of symmetry and
 *           the point lands on its mirror point (2p, c)),
 *   sorter (Example 5: the "how many x-intercepts?" sorter reads the signs of a and q, drops each equation into the
 *           0 / 1 / 2 bin, and the graph confirms),
 *   solve  (the procedure, numbered 1–4, for a(x − p)² + q = 0; on the graph x = p ± √ is two arrows out from the axis;
 *           Example 6 (a)–(f), with the "negative: none" stop and the single root),
 *   arch   (Example 10: a cyclist rides under the footbridge while a tape measures the arch above them and a dot moves
 *           along the graph in step: the top, the width, the height at 3 m, and the domain and range in context).
 * Colours (the unit's): the curve blue, the vertex (max/min) red, the axis of symmetry purple, the y-intercept and its
 *   mirror point green, the x-intercepts (zeros) amber, domain and range burgundy. */
import {
  h, tex, add, box, Graph, stamp, stampIn, mountExplainers, pop, fadeIn, anim, tween, svgEl, pulse, linear, COLORS, texNum
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const CURVE = COLORS.blue, AXC = COLORS.purple;
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; if (el && el.label) el.label.style.opacity = 0; return el; };
const unhide = (el) => { if (el) el.style.opacity = ''; if (el && el.label) el.label.style.opacity = ''; return el; };
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
const popP = (c, p) => Promise.all([pop(c, unhide(p)), p.label ? show(c, unhide(p.label)) : null]);
const tn = (v) => texNum(v, 2);
const pair = (x, y) => `(${tn(x)},\\ ${tn(y)})`;
/* a numbered row for step-by-step procedures (the step number beside each step as it appears) */
const row = (host, n, html) => { const r = h('div', 'u5l3-row', `<span class="u5l3-n">${n}</span><div class="u5l3-rc">${html}</div>`); r.style.opacity = 0; host.appendChild(r); return r; };
/* y = a(x − p)² + q as TeX */
const aTex = (a) => (a === 1 ? '' : a === -1 ? '-' : a === 0.5 ? '\\frac{1}{2}' : a === -0.5 ? '-\\frac{1}{2}' : tn(a));
const brTex = (p) => (p === 0 ? 'x^2' : `(x${p > 0 ? '-' : '+'}${tn(Math.abs(p))})^2`);
const qTex = (q) => (q === 0 ? '' : (q > 0 ? '+' : '-') + tn(Math.abs(q)));
const vform = (a, p, q) => `y=${aTex(a)}${brTex(p)}${qTex(q)}`;
const HEX = { a: CURVE, p: AXC, q: COLORS.red };
const colr = (k, s) => (s === '' ? '' : `\\textcolor{${HEX[k]}}{${s}}`);
const vformC = (a, p, q) => `y=${colr('a', aTex(a))}${p === 0 ? 'x^2' : `(x${colr('p', (p > 0 ? '-' : '+') + tn(Math.abs(p)))})^2`}${q === 0 ? '' : colr('q', qTex(q))}`;
/* arrows from the axis x = p out to the roots, a little above the x-axis (x = p ± √k) */
function pmArrows(G, p, d, lab) {
  const lift = (G.win.ymax - G.win.ymin) * 0.035;
  const L = G.segment([p, lift], [p - d, lift], { color: 'orange', width: 4, ends: [null, 'arrow'] });
  const R = G.segment([p, lift], [p + d, lift], { color: 'orange', width: 4, ends: [null, 'arrow'] });
  const ll = G.label(p - d / 2, lift, T(lab), { pos: 'n', cls: 'bk-ptlab u5l3-pml' }), rl = G.label(p + d / 2, lift, T(lab), { pos: 'n', cls: 'bk-ptlab u5l3-pml' });
  [L, R, ll, rl].forEach(hide);
  return { els: [L, R, ll, rl], run: async (c) => { unhide(L); unhide(R); await Promise.all([G.drawIn(L, 700, c), G.drawIn(R, 700, c)]); unhide(ll); unhide(rl); await Promise.all([show(c, ll), show(c, rl)]); } };
}

/* =============================== explainer: read it from the equation (Example 1 + sliders) =============================== */
const EX1 = [
  { id: 'a', a: 3, p: 4, q: 1, tex: 'y=3(x-4)^2+1',
    cap: `(a) ${T('y=3(x-4)^2+1')}: ${T('p=4')}, ${T('q=1')}. Vertex ${T('(4,\\ 1)')}, axis ${T('x=4')}. ${T('a=3>0')}: it opens <b>up</b>, so the <b>minimum value</b> is ${T('1')}.` },
  { id: 'b', a: -1, p: -2, q: 6, tex: 'y=-(x+2)^2+6',
    cap: `(b) ${T('(x+2)=(x-(-2))')}, so ${T('p=-2')}: vertex ${T('(-2,\\ 6)')}, axis ${T('x=-2')}. ${T('a=-1<0')}: it opens <b>down</b>, <b>maximum value</b> ${T('6')}.` },
  { id: 'c', a: 0.5, p: 0, q: -7, tex: 'y=\\frac{1}{2}x^2-7',
    cap: `(c) No bracket: ${T('\\frac{1}{2}x^2-7=\\frac{1}{2}(x-0)^2-7')}, so ${T('p=0')}. Vertex ${T('(0,\\ -7)')}, axis ${T('x=0')} (the ${T('y')}-axis). Opens up: <b>minimum</b> ${T('-7')}.` },
  { id: 'd', a: -2, p: 5, q: 0, tex: 'y=-2(x-5)^2',
    cap: `(d) Nothing is added: ${T('q=0')}. Vertex ${T('(5,\\ 0)')}, on the ${T('x')}-axis; axis ${T('x=5')}. ${T('a=-2<0')}: opens down, <b>maximum</b> ${T('0')}.` },
  { id: 'e', a: 0.4, p: -3, q: -2.5, tex: 'y=0.4(x+3)^2-2.5',
    cap: `(e) ${T('(x+3)')} gives ${T('p=-3')}, and ${T('q=-2.5')}: vertex ${T('(-3,\\ -2.5)')}, axis ${T('x=-3')}. ${T('a=0.4>0')}: opens up, <b>minimum</b> ${T('-2.5')}.` }
];
const reader = {
  title: 'Read it straight from the equation',
  height: 432, minW: 900, capH: 96,
  choices: [{ v: 'ex1', label: 'Example 1' }, { v: 'play', label: 'Try it: a, p and q sliders' }],
  ask: (v) => v === 'ex1' ? `<b>Example 1:</b> complete the table: the vertex, the axis of symmetry, the opening and the maximum or minimum value.`
    : `Move ${T('a')}, ${T('p')} and ${T('q')}. What can you read straight from ${T('y=a(x-p)^2+q')}?`,
  make(stage, v, ex) {
    const W = ex.W, GW = 420, PX = GW + 22, PW = W - PX, play = v === 'play';
    const S = { a: 1, p: 0, q: 0 };
    const G = new Graph(stage, { x: 0, y: 2, width: GW, height: 428, xmin: -8, xmax: 8, ymin: -10, ymax: 10, xlabels: 2, ylabels: 2, fontSize: 15, pad: [30, 18, 18, 18] });
    const axl = G.vline(0, { color: AXC, width: 3 });
    const cv = G.fn((x) => S.a * (x - S.p) ** 2 + S.q, { color: CURVE, width: 4 });
    const vx = G.point(0, 0, { color: 'red', r: 7 });
    const axT = G.label(0, 9, '', { pos: 'e', cls: 'bk-ptlab u5l3-axt' });
    const lUp = G.label(0, 0, '', { pos: 's', cls: 'bk-ptlab u5l3-vl', gap: 10 }), lDn = G.label(0, 0, '', { pos: 'n', cls: 'bk-ptlab u5l3-vl', gap: 10 });
    const P = div(stage, 'u5l3-pn', '', PX, 0, PW);
    const eq = h('div', 'u5l3-eqbig'); P.appendChild(eq);
    const r1 = (x) => Math.round(x * 10) / 10;
    let on = play;
    const feats = [axl, vx, axT, lUp, lDn];
    const upd = () => {
      const a = S.a, p = r1(S.p), q = r1(S.q), up = a > 0;
      cv._bkDraw();
      G.moveTo(vx, S.p, S.q); axl.set(S.p); G.moveTo(axT, S.p, up ? 8.6 : -8.6);
      G.moveTo(lUp, S.p, S.q); G.moveTo(lDn, S.p, S.q);
      axT.innerHTML = T(`x=${tn(p)}`);
      const html = `${T(pair(p, q))}<span class="u5l3-mmt">${up ? 'minimum' : 'maximum'} ${T(tn(q))}</span>`;
      lUp.innerHTML = up ? html : ''; lDn.innerHTML = up ? '' : html;
      eq.innerHTML = T(vformC(Math.round(a * 100) / 100, p, q));
      feats.forEach((e) => { e.style.opacity = on ? '' : 0; });
      if (play) {
        sv.a.textContent = tn(Math.round(a * 100) / 100).replace('-', '−'); sv.p.textContent = tn(p).replace('-', '−'); sv.q.textContent = tn(q).replace('-', '−');
        ins.a.value = a; ins.p.value = S.p; ins.q.value = S.q;
        rd.innerHTML = `<div><i class="u5l3-rdl">Vertex</i>${T(pair(p, q))}</div><div><i class="u5l3-rdl">Axis of symmetry</i>${T(`x=${tn(p)}`)}</div><div><i class="u5l3-rdl">Opens</i><b>${up ? 'up' : 'down'}</b></div><div><i class="u5l3-rdl">${up ? 'Minimum' : 'Maximum'} value</i>${T(tn(q))}</div>`;
      }
    };
    const ins = {}, sv = {}, sls = [];
    let rd = null, rows = [];
    if (play) {
      [['a', -3, 3, 0.25], ['p', -6, 6, 0.5], ['q', -8, 8, 0.5]].forEach(([k, lo, hi, st]) => {
        const sl = h('label', 'u5l3-sl no-ink u5l3-sl-' + k, `<span class="u5l3-sll">${T(k)}</span><input type="range" min="${lo}" max="${hi}" step="${st}" aria-label="the value of ${k}"><span class="u5l3-slv"></span>`);
        sl.setAttribute('data-tap', ''); P.appendChild(sl); sls.push(sl);
        ins[k] = sl.querySelector('input'); sv[k] = sl.querySelector('.u5l3-slv');
        ins[k].addEventListener('input', () => {
          let val = parseFloat(ins[k].value);
          if (k === 'a' && val === 0) val = S.a > 0 ? -0.25 : 0.25; // a = 0 is not a parabola: skip over it
          S[k] = val; upd();
        });
      });
      rd = h('div', 'u5l3-rd'); P.appendChild(rd);
    } else {
      const tb = h('table', 'u5l3-mt'); P.appendChild(tb);
      tb.innerHTML = `<tr><th>Function</th><th>Vertex</th><th>Axis</th><th>Opens</th><th>Max / min</th></tr>`;
      rows = EX1.map((e) => {
        const tr = h('tr', '', `<td>(${e.id}) ${T(e.tex)}</td><td>${T(pair(e.p, e.q))}</td><td>${T(`x=${tn(e.p)}`)}</td><td>${e.a > 0 ? 'up' : 'down'}</td><td>${e.a > 0 ? 'min' : 'max'} ${T(tn(e.q))}</td>`);
        tb.appendChild(tr); [...tr.children].slice(1).forEach((td) => { td.style.opacity = 0; }); return tr;
      });
    }
    upd();
    const go = (c, to, ms) => { const s0 = { ...S }; return tween(c, ms, (u) => { ['a', 'p', 'q'].forEach((k) => { if (to[k] != null) S[k] = u === 1 ? to[k] : s0[k] + (to[k] - s0[k]) * u; }); if (Math.abs(S.a) < 0.02) S.a = to.a > s0.a ? 0.02 : -0.02; upd(); }); };
    if (play) {
      return [
        { cap: `Slide ${T('p')}: the vertex and the axis move left and right. The bracket shows the <b>opposite sign</b>: ${T('(x+3)^2')} means ${T('p=-3')}.`,
          run: async (c) => { await go(c, { p: 3 }, 1200); await go(c, { p: -3 }, 1600); await pulse(c, eq, 1.06); } },
        { cap: `Slide ${T('q')}: the vertex moves up and down, and ${T('q')} is the lowest value of ${T('y')}: the <b>minimum value</b>.`,
          run: async (c) => { await go(c, { q: 4 }, 1100); await go(c, { q: -5 }, 1500); } },
        { cap: `Make ${T('a')} negative: the parabola flips and opens <b>down</b>. The vertex is now the highest point, so ${T('q')} is the <b>maximum value</b>.`,
          run: async (c) => { await go(c, { a: -1.5 }, 1500); await pulse(c, rd, 1.04); } },
        { cap: `<b>Your turn:</b> drag ${T('a')}, ${T('p')} and ${T('q')}, and read the features from the equation before you look at the graph.`,
          run: async (c) => { for (const s of sls) await pulse(c, s, 1.05); } }
      ];
    }
    return EX1.map((e, i) => ({
      cap: e.cap,
      run: async (c) => {
        rows.forEach((r, j) => r.classList.toggle('u5l3-hl', j === i));
        on = false; await go(c, { a: e.a, p: e.p, q: e.q }, 1100);
        on = true; upd();
        await Promise.all([pop(c, vx, 380), show(c, axl), show(c, axT), show(c, lUp), show(c, lDn)]);
        for (const td of [...rows[i].children].slice(1)) { td.style.opacity = ''; await pop(c, td, 240); }
      }
    }));
  }
};

/* =============================== explainer: fold along the axis (Example 4) =============================== */
const EX4 = {
  a: { a: 2, p: 3, q: -5, tex: 'y=2(x-3)^2-5', s1: 'y=2(0-3)^2-5', s2: '=18-5=13', c: 13, win: { xmin: -2, xmax: 8, ymin: -7, ymax: 16, ylabels: 2 } },
  b: { a: -0.5, p: -4, q: 10, tex: 'y=-\\frac{1}{2}(x+4)^2+10', s1: 'y=-\\frac{1}{2}(0+4)^2+10', s2: '=-8+10=2', c: 2, win: { xmin: -10, xmax: 2, ymin: -4, ymax: 12, ylabels: 2 } },
  c: { a: 3, p: 1, q: 2, tex: 'y=3(x-1)^2+2', s1: 'y=3(0-1)^2+2', s2: '=5', c: 5, yPos: 'w', mPos: 'e', win: { xmin: -3, xmax: 5, ymin: -2, ymax: 10, ylabels: 2 } }
};
const fold = {
  title: 'Fold the graph along its axis',
  height: 432, minW: 900, capH: 96,
  choices: [{ sep: 'Example 4:' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }, { v: 'c', label: '(c)' }],
  ask: (v) => `<b>Example 4(${v}):</b> determine the ${T('y')}-intercept of ${T(EX4[v].tex)} and the point that is its mirror image in the axis of symmetry.`,
  make(stage, v, ex) {
    const e = EX4[v], W = ex.W, GW = 500, PX = GW + 24, PW = W - PX;
    const f = (x) => e.a * (x - e.p) ** 2 + e.q, d = Math.abs(e.p), side = e.p > 0 ? 'left' : 'right', m = 2 * e.p, un = d === 1 ? 'unit' : 'units';
    const G = new Graph(stage, Object.assign({ x: 0, y: 2, width: GW, height: 428, fontSize: 15, pad: [30, 18, 18, 18] }, e.win));
    G.vline(e.p, { color: AXC, width: 3 });
    G.label(e.p, e.win.ymax - 0.4, T(`x=${tn(e.p)}`), { pos: e.p > 0 ? 'e' : 'w', cls: 'bk-ptlab u5l3-axt' });
    G.fn(f, { color: CURVE, width: 4 });
    G.point(e.p, e.q, { color: 'red', r: 6 });
    const yi = hide(G.point(0, e.c, { color: 'green', r: 8, label: T(pair(0, e.c)), pos: e.yPos || (e.p > 0 ? 'ne' : 'nw') }));
    const br1 = hide(G.segment([0, e.c], [e.p, e.c], { color: 'green', width: 3, dash: '6 5' }));
    const bl1 = hide(G.label(e.p / 2, e.c, T(tn(d)), { pos: 's', cls: 'bk-ptlab u5l3-dl' }));
    const mp = hide(G.point(m, e.c, { color: 'green', r: 8, label: T(pair(m, e.c)), pos: e.mPos || (e.p > 0 ? 'nw' : 'ne') }));
    const br2 = hide(G.segment([e.p, e.c], [m, e.c], { color: 'green', width: 3, dash: '6 5' }));
    const bl2 = hide(G.label((e.p + m) / 2, e.c, T(tn(d)), { pos: 's', cls: 'bk-ptlab u5l3-dl' }));
    // the flap: the half of the picture on the y-intercept's side of the axis (paper, curve, point), folded over the axis
    const [axPx] = G.toPx(e.p, 0), edge = e.p > 0 ? e.win.xmin : e.win.xmax;
    const flap = svgEl('g', { class: 'u5l3-flap' }, G.layers.top);
    flap.style.transformBox = 'view-box'; flap.style.transformOrigin = '0 0';
    const inner = svgEl('g', { 'clip-path': `url(#${G.clipId})` }, flap);
    const [ex0, ey0] = G.toPx(edge, e.win.ymax), [, ey1] = G.toPx(edge, e.win.ymin);
    const paper = svgEl('rect', { x: Math.min(ex0, axPx), y: ey0, width: Math.abs(axPx - ex0), height: ey1 - ey0, fill: '#ffe9a8', 'fill-opacity': 0.5, stroke: '#e0a11b', 'stroke-width': 2 }, inner);
    let dd = ''; for (let i = 0; i <= 60; i++) { const x = edge + (e.p - edge) * i / 60, y = Math.max(e.win.ymin - 2, Math.min(e.win.ymax + 2, f(x))); const [px, py] = G.toPx(x, y); dd += (i ? 'L' : 'M') + px.toFixed(1) + ' ' + py.toFixed(1); }
    svgEl('path', { d: dd, fill: 'none', stroke: CURVE, 'stroke-width': 5, 'stroke-linecap': 'round' }, inner);
    const [yx, yy] = G.toPx(0, e.c);
    svgEl('circle', { cx: yx, cy: yy, r: 8, fill: COLORS.green, stroke: '#fff', 'stroke-width': 2 }, flap);
    flap.style.display = 'none';
    const setFold = (s) => {
      flap.setAttribute('transform', `translate(${axPx} 0) scale(${s} 1) translate(${-axPx} 0)`);
      paper.setAttribute('fill-opacity', (0.25 + 0.4 * (1 - Math.abs(s))).toFixed(2));
    };
    setFold(1);
    const R = div(stage, 'u5l3-rows', '', PX, 4, PW);
    const ra = row(R, 1, `${T('x=0')}: ${T(e.s1)}<br>${T(e.s2)}: the point ${T(pair(0, e.c))}`);
    const rb = row(R, 2, `Axis ${T(`x=${tn(e.p)}`)}: the point is<br>${T(tn(d))} ${un} to the ${side}`);
    const rc = row(R, 3, `Mirror point ${T('(2p,\\ c)')}<br>${T(`=(2(${tn(e.p)}),\\ ${tn(e.c)})=${pair(m, e.c)}`)}`);
    return [
      { cap: `Substitute ${T('x=0')}: ${T(e.s1 + e.s2)}. The ${T('y')}-intercept is ${T(tn(e.c))}: the point ${T(pair(0, e.c))}.`,
        run: async (c) => { await popP(c, yi); await show(c, ra); } },
      { cap: `The axis of symmetry is ${T(`x=${tn(e.p)}`)}. The point ${T(pair(0, e.c))} is ${T(tn(d))} ${un} to the <b>${side}</b> of it.`,
        run: async (c) => { unhide(br1); await G.drawIn(br1, 600, c); unhide(bl1); await show(c, bl1); await show(c, rb); } },
      { cap: `<b>Fold the graph along the axis.</b> The two halves match, and the point lands ${T(tn(d))} ${un} on the other side: the mirror point is ${T(pair(m, e.c))}.`,
        run: async (c) => {
          flap.style.display = ''; setFold(1);
          await tween(c, 1600, (u) => setFold(1 - 2 * u));
          await popP(c, mp); unhide(br2); await G.drawIn(br2, 500, c); unhide(bl2); await show(c, bl2);
          await anim(c, flap, [{ opacity: 1 }, { opacity: 0 }], 500); flap.style.display = 'none';
          await show(c, rc);
        } }
    ];
  }
};

/* =============================== explainer: the how-many-x-intercepts sorter (Example 5) =============================== */
const EX5 = [
  { id: 'a', a: 4, p: 2, q: -1, tex: 'y=4(x-2)^2-1' },
  { id: 'b', a: -3, p: -5, q: -6, tex: 'y=-3(x+5)^2-6' },
  { id: 'c', a: 0.5, p: 7, q: 3, tex: 'y=\\frac{1}{2}(x-7)^2+3' },
  { id: 'd', a: -1, p: -1, q: 9, tex: 'y=-(x+1)^2+9' },
  { id: 'e', a: 6, p: 4, q: 0, tex: 'y=6(x-4)^2' }
];
const nOf = (a, q) => (q === 0 ? 1 : a * q < 0 ? 2 : 0);
const sorter = {
  title: 'How many x-intercepts? The sorter',
  height: 440, minW: 900, capH: 96,
  ask: () => `<b>Example 5:</b> without graphing, determine the number of ${T('x')}-intercepts. Then let the graph check.`,
  make(stage, v, ex) {
    const W = ex.W, GW = 400, PX = GW + 22, PW = W - PX;
    const G = new Graph(stage, { x: 0, y: 4, width: GW, height: 432, xmin: -9, xmax: 9, ymin: -10, ymax: 12, xlabels: 2, ylabels: 2, fontSize: 14, pad: [30, 18, 18, 18] });
    const inC = div(stage, 'u5l3-in', `<span class="u5l3-inh">In</span><span class="u5l3-ine"></span>`, PX, 0, PW, 58);
    const ine = inC.querySelector('.u5l3-ine');
    const TW = (PW - 12) / 2;
    const tA = div(stage, 'u5l3-sg', '', PX, 68, TW, 84), tQ = div(stage, 'u5l3-sg', '', PX + TW + 12, 68, TW, 84);
    const rule = div(stage, 'u5l3-rule', '', PX, 160, PW, 44);
    const BY = 214, BW = (PW - 20) / 3;
    const bins = [0, 1, 2].map((n, i) => {
      const b = div(stage, `u5l3-bin u5l3-b${n}`, `<div class="u5l3-binh"><b>${n}</b><span>${T('x')}-intercept${n === 1 ? '' : 's'}</span></div><div class="u5l3-bint"></div>`, PX + i * (BW + 10), BY, BW, 440 - BY - 2);
      b.n = n; b.tray = b.querySelector('.u5l3-bint'); return b;
    });
    [tA, tQ, rule].forEach((e) => { e.style.opacity = 0; });
    let cur = [];
    const steps = [];
    EX5.forEach((e) => {
      const n = nOf(e.a, e.q), up = e.a > 0;
      const qw = e.q > 0 ? 'above' : e.q < 0 ? 'below' : 'on';
      const verdict = e.q === 0 ? `${T('q=0')}: <b>1</b>` : n === 2 ? `opposite signs: <b>2</b>` : `the same sign: <b>0</b>`;
      const rts = n === 2 ? [e.p - Math.sqrt(-e.q / e.a), e.p + Math.sqrt(-e.q / e.a)] : n === 1 ? [e.p] : [];
      steps.push({
        cap: `(${e.id}) ${T(e.tex)}: ${T(`a=${tn(e.a)}${up ? '>' : '<'}0`)}, so it opens <b>${up ? 'up' : 'down'}</b>; ${e.q === 0 ? `${T('q=0')}, so the vertex is <b>on</b> the axis` : `${T(`q=${tn(e.q)}${e.q > 0 ? '>' : '<'}0`)}, so the vertex is <b>${qw}</b> the axis`}. ${e.q === 0 ? 'It just touches: <b>1</b>.' : n === 2 ? '<b>Opposite signs: 2.</b>' : '<b>The same sign: 0.</b>'}`,
        run: async (c) => {
          G.remove(...cur); cur = [];
          ine.innerHTML = T(e.tex); await pop(c, ine, 320);
          tA.className = 'u5l3-sg ' + (up ? 'u5l3-pos' : 'u5l3-neg');
          tA.innerHTML = `<div class="u5l3-sgh">${T(`a=${tn(e.a)}`)}<b>${up ? '+' : '−'}</b></div><div>opens ${up ? 'up ↑' : 'down ↓'}</div>`;
          tQ.className = 'u5l3-sg ' + (e.q > 0 ? 'u5l3-pos' : e.q < 0 ? 'u5l3-neg' : 'u5l3-zer');
          tQ.innerHTML = `<div class="u5l3-sgh">${T(`q=${tn(e.q)}`)}<b>${e.q > 0 ? '+' : e.q < 0 ? '−' : '0'}</b></div><div>vertex ${qw} the axis</div>`;
          await show(c, tA); await show(c, tQ);
          rule.className = 'u5l3-rule u5l3-r' + n; rule.innerHTML = `<div>${verdict}</div>`; await show(c, rule);
          const bin = bins.find((b) => b.n === n), tok = h('div', 'u5l3-tok', `<b class="u5l3-tid">(${e.id})</b>${T(e.tex)}`);
          bin.tray.appendChild(tok);
          const br = tok.getBoundingClientRect(), ir = ine.getBoundingClientRect(), sc = (stage.getBoundingClientRect().width / stage.offsetWidth) || 1;
          const dx = (ir.left - br.left) / sc, dy = (ir.top - br.top) / sc;
          await anim(c, tok, [{ transform: `translate(${dx}px, ${dy}px)`, opacity: 0.4 }, { transform: 'none', opacity: 1 }], 700);
          await pulse(c, bin.querySelector('.u5l3-binh'), 1.08);
        }
      });
      steps.push({
        cap: `The graph agrees: from the vertex ${T(pair(e.p, e.q))} it ${n === 2 ? `opens ${up ? 'up' : 'down'} across the ${T('x')}-axis: <b>two</b> ${T('x')}-intercepts` : n === 1 ? `just touches the ${T('x')}-axis: <b>one</b> ${T('x')}-intercept, the vertex` : `opens ${up ? 'up' : 'down'}, away from the ${T('x')}-axis: <b>no</b> ${T('x')}-intercepts`}.`,
        run: async (c) => {
          const cv = G.fn((x) => e.a * (x - e.p) ** 2 + e.q, { color: CURVE, width: 4 }); cur.push(cv);
          const vx = hide(G.point(e.p, e.q, { color: 'red', r: 6.5 })); cur.push(vx);
          await G.drawIn(cv, 900, c); await pop(c, unhide(vx));
          const zs = rts.map((r, i) => hide(G.point(r, 0, { color: 'amber', r: 8.5, label: T(tn(r)), pos: rts.length === 2 ? (i ? 'se' : 'sw') : 's' })));
          cur.push(...zs);
          for (const z of zs) await popP(c, z);
          const bin = bins.find((b) => b.n === n), ok = h('span', 'u5l3-ok', '✓');
          bin.tray.lastChild.appendChild(ok); await pop(c, ok, 300);
        }
      });
    });
    return steps;
  }
};

/* =============================== explainer: solve a(x − p)² + q = 0 (procedure, numbered 1–4; Example 6) =============================== */
const EX6 = {
  a: { a: 1, p: 3, q: -16, tex: 'y=(x-3)^2-16', win: { xmin: -4, xmax: 10, ymin: -18, ymax: 10, ystep: 2 }, d: 4, dl: '4', roots: [7, -1],
    r: ['0=(x-3)^2-16', '(x-3)^2=16', `${T('16')} is not negative`, `${T('x-3=\\pm4')}<br>${T('x=7')} or ${T('x=-1')}`],
    c2: `Add ${T('16')}: ${T('(x-3)^2=16')}.`, c4: `${T('x-3=\\pm4')}: go ${T('4')} units each way from the axis ${T('x=3')}. ${T('x=7')} or ${T('x=-1')}.` },
  b: { a: 2, p: -1, q: -18, tex: 'y=2(x+1)^2-18', win: { xmin: -7, xmax: 5, ymin: -22, ymax: 10, ystep: 2 }, d: 3, dl: '3', roots: [2, -4],
    r: ['0=2(x+1)^2-18', `${T('2(x+1)^2=18')}<br>${T('(x+1)^2=9')}`, `${T('9')} is not negative`, `${T('x+1=\\pm3')}<br>${T('x=2')} or ${T('x=-4')}`],
    c2: `Add ${T('18')}, then divide by ${T('2')}: ${T('2(x+1)^2=18')}, so ${T('(x+1)^2=9')}.`, c4: `${T('x+1=\\pm3')}: ${T('3')} units each way from the axis ${T('x=-1')}. ${T('x=2')} or ${T('x=-4')}.` },
  c: { a: -3, p: 2, q: 15, tex: 'y=-3(x-2)^2+15', win: { xmin: -3, xmax: 7, ymin: -6, ymax: 18, ystep: 2 }, d: Math.sqrt(5), dl: '\\sqrt{5}', roots: [2 + Math.sqrt(5), 2 - Math.sqrt(5)],
    r: ['0=-3(x-2)^2+15', `${T('3(x-2)^2=15')}<br>${T('(x-2)^2=5')}`, `${T('5')} is not negative`, `${T('x=2\\pm\\sqrt{5}')}<br>${T('x\\approx4.24')} or ${T('x\\approx-0.24')}`],
    c2: `Move the square across: ${T('3(x-2)^2=15')}, then divide by ${T('3')}: ${T('(x-2)^2=5')}.`, c4: `${T('x-2=\\pm\\sqrt{5}')}, so ${T('x=2\\pm\\sqrt{5}')}: about ${T('2.24')} units each way from ${T('x=2')}. ${T('x\\approx4.24')} or ${T('x\\approx-0.24')}.` },
  d: { a: 0.5, p: -4, q: -6, tex: 'y=\\frac{1}{2}(x+4)^2-6', win: { xmin: -10, xmax: 2, ymin: -8, ymax: 8, ystep: 1 }, d: Math.sqrt(12), dl: '\\sqrt{12}', roots: [-4 + Math.sqrt(12), -4 - Math.sqrt(12)],
    r: ['0=\\frac{1}{2}(x+4)^2-6', `${T('\\frac{1}{2}(x+4)^2=6')}<br>${T('(x+4)^2=12')}`, `${T('12')} is not negative`, `${T('x=-4\\pm\\sqrt{12}=-4\\pm2\\sqrt{3}')}<br>${T('x\\approx-0.54')} or ${T('x\\approx-7.46')}`],
    c2: `Add ${T('6')}, then multiply by ${T('2')}: ${T('(x+4)^2=12')}.`, c4: `${T('x+4=\\pm\\sqrt{12}')}, so ${T('x=-4\\pm\\sqrt{12}=-4\\pm2\\sqrt{3}')} in simplest radical form. ${T('x\\approx-0.54')} or ${T('x\\approx-7.46')}.` },
  e: { a: 4, p: 1, q: 3, tex: 'y=4(x-1)^2+3', win: { xmin: -3, xmax: 5, ymin: -2, ymax: 12, ystep: 1 },
    r: ['0=4(x-1)^2+3', `${T('4(x-1)^2=-3')}<br>${T('(x-1)^2=-\\frac{3}{4}')}`, `A square cannot be negative:<br><b>no ${T('x')}-intercepts</b>`],
    c2: `Subtract ${T('3')}, then divide by ${T('4')}: ${T('(x-1)^2=-\\frac{3}{4}')}.` },
  f: { a: -1, p: -6, q: 0, tex: 'y=-(x+6)^2', win: { xmin: -11, xmax: 1, ymin: -10, ymax: 3, ystep: 1 }, roots: [-6],
    r: ['0=-(x+6)^2', '(x+6)^2=0', `${T('0')} is not negative`, `${T('x+6=0')}<br>${T('x=-6')} only`],
    c2: `Divide by ${T('-1')}: ${T('(x+6)^2=0')}.`, c4: `${T('x+6=0')}, so ${T('x=-6')} only: one ${T('x')}-intercept, the vertex ${T('(-6,\\ 0)')} on the axis.` }
};
const solve = {
  title: 'Solve for the x-intercepts, step by step',
  height: 432, minW: 900, capH: 96,
  choices: [{ sep: 'Example 6:' }, ...'abcdef'.split('').map((k) => ({ v: k, label: `(${k})` }))],
  ask: (v) => `<b>Example 6(${v}):</b> determine the ${T('x')}-intercepts of ${T(EX6[v].tex)}${'cd'.includes(v) ? ' as exact values, then to the nearest hundredth' : ''}.`,
  make(stage, v, ex) {
    const e = EX6[v], W = ex.W, GW = 420, PX = GW + 24, PW = W - PX;
    const k = -e.q / e.a;
    const G = new Graph(stage, Object.assign({ x: 0, y: 2, width: GW, height: 428, fontSize: 14, ylabels: e.win.ystep === 2 ? 4 : 2, xlabels: 2, pad: [30, 18, 18, 18] }, e.win));
    G.vline(e.p, { color: AXC, width: 3 });
    G.fn((x) => e.a * (x - e.p) ** 2 + e.q, { color: CURVE, width: 4 });
    G.point(e.p, e.q, { color: 'red', r: 6.5, label: T(pair(e.p, e.q)), pos: e.a > 0 ? 's' : 'n' });
    const y0 = hide(G.hline(0, { color: 'orange', width: 7, dash: false, opacity: 0.45 }));
    const pm = e.d ? pmArrows(G, e.p, e.d, e.dl) : null;
    const zs = (e.roots || []).map((r, i, A) => hide(G.point(r, 0, { color: 'amber', r: 8.5, label: T((Number.isInteger(r) ? '' : '\\approx') + tn(r)), pos: A.length === 2 ? (r > e.p ? 'se' : 'sw') : 's' })));
    const st = stamp(stage, 'No x-intercepts', { ok: false, x: PX + PW / 2, y: 340 }); st.style.opacity = 0;
    const R = div(stage, 'u5l3-rows', '', PX, 4, PW);
    const rws = e.r.map((html, i) => row(R, i + 1, i < 2 && !html.includes('<') ? T(html) : html));
    const s3 = k < 0 ? `the square equals a negative number, but a square cannot be negative: <b>no</b> ${T('x')}-intercepts. The graph agrees: it opens up from ${T(pair(e.p, e.q))}, above the axis.`
      : k === 0 ? `the square equals ${T('0')}, which is not negative. ${T('\\pm\\sqrt{0}')} is just ${T('0')}, so there is only <b>one</b> answer.`
        : `the square equals ${T(tn(k))}, which is not negative, so keep going: there will be <b>two</b> answers.`;
    const steps = [
      { cap: `<b>Step 1:</b> set ${T('y=0')}: ${T(e.r[0])}. The ${T('x')}-intercepts are on the line ${T('y=0')}.`,
        run: async (c) => { unhide(y0); await G.drawIn(y0, 700, c); await show(c, rws[0]); } },
      { cap: `<b>Step 2:</b> isolate the square. ${e.c2}`, run: (c) => show(c, rws[1]) },
      { cap: `<b>Step 3:</b> ${s3}`,
        run: async (c) => { await show(c, rws[2]); if (k < 0) { st.style.opacity = ''; await stampIn(c, st); } } }
    ];
    if (k >= 0) steps.push({
      cap: `<b>Step 4:</b> ${e.c4}`,
      run: async (c) => { await show(c, rws[3]); if (pm) await pm.run(c); for (const z of zs) await popP(c, z); }
    });
    return steps;
  }
};

/* =============================== explainer: the footbridge arch (Example 10) =============================== */
const HB = (x) => -0.08 * (x - 10) ** 2 + 8;
const arch = {
  title: 'Ride under the footbridge',
  height: 440, minW: 900, capH: 96,
  ask: () => `<b>Example 10:</b> the underside of the arch is ${T('h=-0.08(x-10)^2+8')}: ${T('h')} metres above the path, ${T('x')} metres from the left foot.`,
  make(stage, v, ex) {
    const W = ex.W, GW = 520, PX = GW + 22, PW = W - PX;
    const SH = 168, G = new Graph(stage, { x: 0, y: SH + 4, width: GW, height: 440 - SH - 4, xmin: -2, xmax: 22, ymin: -1, ymax: 10, xlabels: 2, ylabels: 2, fontSize: 14, xtitle: 'x', ytitle: 'h' });
    const sx = (x) => G.toPx(x, 0)[0], GR = 146, sy = (hh) => GR - 12.5 * hh;
    // the scene, drawn on the same x-scale as the graph below it
    const sc = svgEl('svg', { width: GW, height: SH, viewBox: `0 0 ${GW} ${SH}`, class: 'u5l3-scene' }, stage);
    sc.style.position = 'absolute'; sc.style.left = '0px'; sc.style.top = '0px';
    svgEl('rect', { x: 0, y: 0, width: GW, height: GR, rx: 10, fill: '#e6f1fb' }, sc);
    let d = `M${sx(-2)} 30 L${sx(22)} 30 L${sx(22)} ${GR} L${sx(20)} ${GR}`;
    for (let i = 0; i <= 50; i++) { const x = 20 - 20 * i / 50; d += ` L${sx(x).toFixed(1)} ${sy(HB(x)).toFixed(1)}`; }
    d += ` L${sx(-2)} ${GR} Z`;
    svgEl('path', { d, fill: '#d7c4a3', stroke: '#8a7658', 'stroke-width': 2.5 }, sc);
    for (let x = -1; x <= 21; x += 2) svgEl('line', { x1: sx(x), x2: sx(x), y1: 14, y2: 30, stroke: '#6b5a44', 'stroke-width': 3 }, sc);
    svgEl('line', { x1: sx(-2), x2: sx(22), y1: 14, y2: 14, stroke: '#6b5a44', 'stroke-width': 4 }, sc);
    svgEl('rect', { x: 0, y: GR, width: GW, height: 9, fill: '#b9b1a3' }, sc);
    svgEl('rect', { x: 0, y: GR + 9, width: GW, height: SH - GR - 9, fill: '#cfe3b8' }, sc);
    const tape = svgEl('line', { stroke: COLORS.orange, 'stroke-width': 4, 'stroke-dasharray': '7 4' }, sc);
    const tlab = div(stage, 'u5l3-tlab', '', 0, 0);
    const wbr = svgEl('g', { class: 'u5l3-wbr' }, sc); wbr.style.opacity = 0;
    svgEl('line', { x1: sx(0), x2: sx(20), y1: GR + 14, y2: GR + 14, stroke: COLORS.amber, 'stroke-width': 4 }, wbr);
    [0, 20].forEach((x) => svgEl('line', { x1: sx(x), x2: sx(x), y1: GR + 6, y2: GR + 22, stroke: COLORS.amber, 'stroke-width': 4 }, wbr));
    const wlab = div(stage, 'u5l3-wlab', '20 m', sx(10) - 40, GR + 2, 80); wlab.style.opacity = 0;
    const bike = div(stage, 'u5l3-bike', '<span>🚴</span>', 0, GR - 40);
    // the graph
    const full = G.fn(HB, { color: CURVE, width: 4 });
    const dot = G.point(0, 0, { color: 'orange', r: 7 });
    const vx = hide(G.point(10, 8, { color: 'red', r: 7, label: T('(10,\\ 8)'), pos: 'n' }));
    const pm = pmArrows(G, 10, 10, '10');
    const z0 = hide(G.point(0, 0, { color: 'amber', r: 8 })), z20 = hide(G.point(20, 0, { color: 'amber', r: 8 }));
    const p3 = hide(G.point(3, HB(3), { color: 'green', r: 7, label: T('(3,\\ 4.08)'), pos: 'se' }));
    const g3 = hide(G.guides(3, HB(3), { color: 'green' }));
    const inside = hide(G.fn(HB, { color: CURVE, width: 5, from: 0, to: 20, ends: ['closed', 'closed'] }));
    const shx = hide(G.shadeX(0, 20, { color: COLORS.brand })), shy = hide(G.shadeY(0, 8, { color: COLORS.brand }));
    const S = { x: -1.2, dir: 1 };
    const place = () => {
      const x = S.x, hh = HB(x), inA = x >= 0 && x <= 20;
      bike.style.left = (sx(x) - 22) + 'px'; bike.firstChild.style.transform = S.dir > 0 ? 'scaleX(-1)' : 'none';
      tape.setAttribute('x1', sx(x)); tape.setAttribute('x2', sx(x)); tape.setAttribute('y1', GR - 34); tape.setAttribute('y2', sy(Math.max(hh, 0)));
      tape.style.display = inA && hh > 2.8 ? '' : 'none';
      tlab.innerHTML = T(`h=${tn(Math.round(hh * 100) / 100)}`); tlab.style.left = (sx(x) + 8) + 'px'; tlab.style.top = (sy(hh) + 4) + 'px';
      tlab.style.display = inA && hh > 2.8 ? '' : 'none';
      G.moveTo(dot, x, Math.max(-1, hh)); dot.style.opacity = inA ? '' : 0;
    };
    place();
    const ride = (c, to, ms) => { const x0 = S.x; S.dir = to >= x0 ? 1 : -1; return tween(c, ms, (u) => { S.x = u === 1 ? to : x0 + (to - x0) * u; place(); }, linear); };
    const R = div(stage, 'u5l3-rows', '', PX, 4, PW);
    const ra = row(R, '(a)', `Vertex ${T('(10,\\ 8)')}, ${T('a<0')}: maximum<br>height ${T('8')} m, ${T('10')} m from the left foot`);
    const rb = row(R, '(b)', `${T('(x-10)^2=100')}, ${T('x-10=\\pm10')}<br>${T('x=0')} or ${T('x=20')}: <b>20 m</b> wide`);
    const rcc = row(R, '(c)', `${T('h=-0.08(3-10)^2+8')}<br>${T('=-0.08(49)+8=4.08')} m`);
    const rd = row(R, '(d)', `D: ${T('\\{x\\mid 0\\le x\\le20,\\ x\\in\\mathbb{R}\\}')}<br>R: ${T('\\{h\\mid 0\\le h\\le8,\\ h\\in\\mathbb{R}\\}')}`);
    return [
      { cap: `(a) Ride to the middle. The vertex is ${T('(10,\\ 8)')} and ${T('a<0')}: the <b>maximum height is 8 m</b>, ${T('10')} m from the left foot.`,
        run: async (c) => { await ride(c, 10, 2000); await popP(c, vx); await show(c, ra); } },
      { cap: `(b) The arch meets the path where ${T('h=0')}: ${T('0=-0.08(x-10)^2+8')}, so ${T('(x-10)^2=100')} and ${T('x-10=\\pm10')}: ${T('10')} m each way from ${T('x=10')}.`,
        run: async (c) => { await pm.run(c); await popP(c, z0); await popP(c, z20); } },
      { cap: `${T('x=0')} or ${T('x=20')}: ride from one foot of the arch to the other. The arch is <b>20 m wide</b> at the path.`,
        run: async (c) => { await ride(c, 0, 900); await ride(c, 20, 2200); wbr.style.opacity = ''; wlab.style.opacity = ''; await Promise.all([show(c, wbr), pop(c, wlab)]); await show(c, rb); } },
      { cap: `(c) Ride back to ${T('x=3')}: ${T('h=-0.08(3-10)^2+8=-0.08(49)+8=4.08')}. The arch is <b>4.08 m</b> high there.`,
        run: async (c) => { await ride(c, 3, 1800); unhide(g3); await G.drawIn(g3, 500, c); await popP(c, p3); await pulse(c, tlab, 1.15); await show(c, rcc); } },
      { cap: `(d) Only the arch itself makes sense: ${T('0\\le x\\le20')} and ${T('0\\le h\\le8')}. The rest of the parabola is not part of the bridge.`,
        run: async (c) => {
          full.path.setAttribute('stroke', COLORS.gray); full.path.setAttribute('stroke-dasharray', '6 6'); full.style.color = COLORS.gray;
          unhide(inside); await G.drawIn(inside, 900, c);
          unhide(shx); unhide(shy); await Promise.all([G.drawIn(shx, 700, c), G.drawIn(shy, 700, c)]); await show(c, rd);
        } }
    ];
  }
};

/* =============================== Stand Up Break =============================== */
/* BEG: vertex, axis, opening, max/min (sometimes solve for y first). PRG: domain and range, the y-intercept and its
 * mirror point. MAS: the x-intercepts, exact (simplest radical form) and to the nearest hundredth, or none. */
const AS = [1, 2, 3, -1, -2, -3, 0.5, -0.5];
const simp = (k) => { let o = 1; for (let s = 2; s * s <= k; s++) while (k % (s * s) === 0) { k /= s * s; o *= s; } return { o, i: k }; };
const xm = (p) => (p === 0 ? 'x' : `x${p > 0 ? '-' : '+'}${Math.abs(p)}`);
standup('u5l3', {
  intro: 'At your whiteboard: read everything you can straight from y = a(x − p)² + q.',
  levels: {
    BEG: (r) => {
      for (;;) {
        const a = r.pick(AS), p = r.int(-7, 7), q = r.int(-9, 9);
        if (p === 0 && q === 0) continue;
        const moved = q !== 0 && r.chance(0.3);
        const qs = moved ? `y${q > 0 ? '-' + q : '+' + (-q)}=${aTex(a)}${brTex(p)}` : vform(a, p, q);
        return { text: 'State the vertex, the axis of symmetry, the direction of opening and the maximum or minimum value.', q: qs,
          a: [moved ? vform(a, p, q) : null, `\\text{vertex }(${p},\\ ${q})`, `\\text{axis of symmetry }x=${p}`, `\\text{opens ${a > 0 ? 'up' : 'down'}; ${a > 0 ? 'minimum' : 'maximum'} value }${q}`].filter(Boolean) };
      }
    },
    PRG: (r) => {
      const a = r.pick(AS), p = r.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]), q = r.int(-9, 9), c = a * p * p + q;
      return { text: 'State the domain and range. Determine the <i>y</i>-intercept and the point that is its mirror image in the axis of symmetry.', q: vform(a, p, q),
        a: ['D:\\ \\{x\\mid x\\in\\mathbb{R}\\}', `R:\\ \\{y\\mid y${a > 0 ? '\\ge' : '\\le'}${q},\\ y\\in\\mathbb{R}\\}`, `y=${aTex(a)}(0${p > 0 ? '-' : '+'}${Math.abs(p)})^2${qTex(q)}=${tn(c)}`, `\\text{mirror point }(${2 * p},\\ ${tn(c)})`] };
    },
    MAS: (r) => {
      for (;;) {
        const a = r.pick([1, 2, 3, -1, -2, -3, 0.5]), p = r.int(-6, 6), none = r.chance(0.2);
        const k = r.pick([1, 4, 9, 16, 25, 2, 3, 5, 6, 7, 8, 10, 12, 18, 20, 27]), q = none ? a * k : -a * k;
        if (!Number.isInteger(q)) continue;
        const A = Math.abs(a), lines = [];
        if (A !== 1) lines.push(`${aTex(A)}${brTex(p)}=${none ? '-' : ''}${Math.abs(q)}`);
        if (none) {
          lines.push(`${brTex(p)}=-${k}`, '\\text{a square cannot be negative: no }x\\text{-intercepts}');
        } else {
          const { o, i } = simp(k), rk = Math.sqrt(k);
          lines.push(`${brTex(p)}=${k}`);
          if (i === 1) lines.push(`${xm(p)}=\\pm${o}`, `x=${p + o}\\text{ or }x=${p - o}`);
          else {
            const pp = p === 0 ? '' : p;
            lines.push(`x=${pp}\\pm\\sqrt{${k}}${o > 1 ? `=${pp}\\pm${o}\\sqrt{${i}}` : ''}`, `x\\approx${(p + rk).toFixed(2)}\\text{ or }x\\approx${(p - rk).toFixed(2)}`);
          }
        }
        return { text: 'Determine the <i>x</i>-intercepts as exact values in simplest radical form, then to the nearest hundredth.', q: vform(a, p, q), a: lines };
      }
    }
  }
});

/* =============================== mount =============================== */
export const explainers = mountExplainers({ reader, fold, sorter, solve, arch });
export const _test = { vform, simp, nOf, HB };
