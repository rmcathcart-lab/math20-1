/* Math 20-1 · Unit 7 · Lesson 3 — Graphing Absolute Value Functions of Quadratic Functions.
 * New lesson format (2026-11-11): the warm-up ("The Skipping Stone") is plain markup on the page (no code). Explainers:
 *   flip      (the procedure, numbered 1–4, for sketching y = |f(x)|: the part below the axis is shaded as a red
 *              "valley" (or two red arms), dashed arrows show y → −y, and it springs up into the W. Example 1 builds
 *              the table of values first; chips replay Example 3 (a)–(c)),
 *   cases     (STAR, hands-on: slide the vertex of y = a(x − p)² + q up and down and flip the opening; the graph of
 *              |f(x)| changes live and the key-idea table fills itself case by case (crosses / above / below);
 *              an Example 4 check chip morphs one parabola into the next and fills the Example 4 table),
 *   pieces    (the procedure, numbered 1–3, for piecewise form: the zeros cut a sign strip under the graph into
 *              subdomains, each painted f(x) or −f(x), then the cases; Example 5 (a) with (d), (b), (c)),
 *   backwards (Example 7: (a) two copies of the W: un-flip the middle arc on one, the two arms on the other, giving
 *              the two possible f; (b)–(c) a slider for k in g(x) = −2(x − 1)² + k with the range of |g| live),
 *   coaster   (Example 8: a coaster car runs along the track into the tunnel while the graph of d = |h| is traced
 *              underneath in step; a distance bar from ground level to the car shows d).
 * Colours: y = f(x) blue (dashed once |f| is drawn); y = |f(x)| purple; the part below the axis red; invariant points
 * amber. */
import {
  h, tex, add, box, Graph, ValueTable, stamp, stampIn, mountExplainers, pop, fadeIn, anim, sleep, tween, svgEl, pulse,
  linear, COLORS, texNum
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const F = COLORS.blue, A = COLORS.purple, NEG = COLORS.red, INV = COLORS.amber, GR = COLORS.green, INK = COLORS.ink;
const show = (c, el) => { unhide(el); return fadeIn(c, el, 320); };
const hide = (el) => { if (el) el.style.opacity = 0; if (el && el.label) el.label.style.opacity = 0; return el; };
const unhide = (el) => { if (el) el.style.opacity = ''; if (el && el.label) el.label.style.opacity = ''; return el; };
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
const absSvg = (stage, w, hh, x = 0, y = 0, cls = '') => { const s = svgEl('svg', { width: w, height: hh, viewBox: `0 0 ${w} ${hh}`, class: cls }, stage); s.style.position = 'absolute'; s.style.left = x + 'px'; s.style.top = y + 'px'; return s; };
const popP = (c, p) => { unhide(p); return Promise.all([pop(c, p), p.label ? fadeIn(c, p.label, 320) : null]); };
const tn = (v) => texNum(v, 2);
const pt2 = (x, y) => `(${tn(x)},\\ ${tn(y)})`;
/* a numbered row for step-by-step procedures (the step number beside each step as it appears) */
const row = (host, n, html) => { const r = h('div', 'u7l3-row', `<span class="u7l3-n">${n}</span><div class="u7l3-rc">${html}</div>`); r.style.opacity = 0; host.appendChild(r); return r; };
const recolor = (g, cc) => { g.style.color = cc; g.path.setAttribute('stroke', cc); if (g.path.getAttribute('fill') !== 'none') g.path.setAttribute('fill', cc); g.querySelectorAll('.bk-ends *').forEach((e) => { if (e.getAttribute('fill') && e.getAttribute('fill') !== '#fff') e.setAttribute('fill', cc); if (e.getAttribute('stroke') && e.getAttribute('stroke') !== '#fff') e.setAttribute('stroke', cc); }); };
const inf = (v) => (Number.isFinite(v) ? v : undefined);
/* a springy ease: overshoots a little past the reflection, then settles (the valley "springs" up) */
const spring = (u) => { const c1 = 1.4, c3 = c1 + 1; return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2); };

/* The flipper: the parts of y = base(x) on the intervals ivs are drawn as y = base(x)·(1 − 2t), so t = 0 → 1 reflects
 * them in the x-axis. A shaded region between those parts and the axis flips with them. Points in `movers` ride along. */
function flipper(G, base, ivs, o = {}) {
  const S = { t: 0 }, k = () => 1 - 2 * S.t, from = o.from || NEG, to = o.to || A;
  const clip = (a, b) => [Math.max(a, G.win.xmin), Math.min(b, G.win.xmax)];
  const shades = o.shade === false ? [] : ivs.map(([a, b]) => G.curve(() => {
    const [a1, b1] = clip(a, b); if (!(b1 > a1)) return { subs: [] };
    const N = 90, pts = [G.toPx(a1, 0)];
    for (let i = 0; i <= N; i++) { const x = a1 + (b1 - a1) * i / N, y = Math.max(G.win.ymin - 2, Math.min(G.win.ymax + 2, base(x) * k())); pts.push(G.toPx(x, y)); }
    pts.push(G.toPx(b1, 0));
    return { subs: [pts], closed: true };
  }, { color: from, width: 0.01, fill: from, fillOpacity: 0.15 }, 'u7l3-shade', G.layers.data));
  const pieces = ivs.map(([a, b]) => G.fn((x) => base(x) * k(), { from: inf(a), to: inf(b), color: from, width: o.width || 4.5 }));
  const movers = [];
  const upd = () => {
    shades.forEach((s) => s._bkDraw()); pieces.forEach((p) => p._bkDraw());
    const cc = S.t >= 0.5 ? to : from; [...shades, ...pieces].forEach((g) => recolor(g, cc));
    movers.forEach((m) => { G.moveTo(m.pt, m.x, m.y * k()); if (m.recolor) m.pt.querySelector('circle').setAttribute('fill', cc); if (m.lab && m.pt.label) { m.pt.label.innerHTML = T(pt2(m.x, Math.abs(m.y * k()) < 1e-9 ? 0 : m.y * (S.t >= 0.5 ? -1 : 1))); m.pt.label.style.color = cc; } });
  };
  const all = [...shades, ...pieces];
  return {
    S, shades, pieces, movers, upd,
    hide: () => all.forEach(hide), show: (c) => Promise.all(all.filter((g) => g.style.opacity === '0').map((g) => show(c, g))),
    go: (c, ms = 1300, t1 = 1) => { const t0 = S.t; return tween(c, ms, (u) => { S.t = u >= 1 ? t1 : t0 + (t1 - t0) * spring(u); upd(); }, linear); }
  };
}
/* dashed arrows from (x, y) to (x, −y): the y-values change sign */
const flipArrows = (G, base, xs) => xs.map((x) => { const y = base(x); return hide(G.segment([x, y], [x, -y], { color: A, width: 2.5, dash: '6 5', ends: [null, 'arrow'] })); });

/* =============================== explainer: flip the valley (the procedure) =============================== */
const FL = {
  e1: { f: (x) => x * x - 2 * x - 3, win: { xmin: -3, xmax: 5, ymin: -5, ymax: 6 }, negs: [[-1, 3]], keeps: [[-Infinity, -1], [3, Infinity]], zeros: [-1, 3], arrows: [0, 1, 2] },
  a: { eq: 'y=|x^2-6x+5|', f: (x) => x * x - 6 * x + 5, win: { xmin: -1, xmax: 7, ymin: -5, ymax: 8 }, negs: [[1, 5]], keeps: [[-Infinity, 1], [5, Infinity]], zeros: [1, 5], vx: [3, -4], yi: 5, arrows: [2, 3, 4],
    c: [`<b>1</b> Sketch ${T('y=f(x)')} lightly: ${T('x^2-6x+5=(x-1)(x-5)')}, zeros ${T('1')} and ${T('5')}. Axis ${T('x=3')}, ${T('f(3)=9-18+5=-4')}: vertex ${T('(3,\\ -4)')}. ${T('y')}-intercept ${T('5')}.`,
      `<b>2</b> Keep the two arms, ${T('x\\le1')} and ${T('x\\ge5')}: they are on or above the ${T('x')}-axis.`,
      `<b>3</b> It opens up, so the part below the axis is the <b class="u7l3-cn">valley</b> between the zeros. Flip it up: the vertex ${T('(3,\\ -4)')} becomes ${T('(3,\\ 4)')}.`,
      `<b>4</b> Label the invariant points ${T('(1,\\ 0)')} and ${T('(5,\\ 0)')} and the vertex of the graph, ${T('(3,\\ 4)')}. The ${T('y')}-intercept stays ${T('|5|=5')}.`],
    r: [`${T('(x-1)(x-5)')}: zeros ${T('1')}, ${T('5')}<br>vertex ${T('(3,\\ -4)')}, ${T('y')}-int ${T('5')}`, `keep ${T('x\\le1')} and ${T('x\\ge5')}`, `flip the valley ${T('1<x<5')}<br>${T('(3,\\ -4)\\to(3,\\ 4)')}`, `invariant points ${T('(1,\\ 0)')}, ${T('(5,\\ 0)')}<br>vertex of the graph ${T('(3,\\ 4)')}`] },
  b: { eq: 'y=\\left|-\\frac12(x+2)^2+8\\right|', f: (x) => -0.5 * (x + 2) ** 2 + 8, win: { xmin: -8, xmax: 4, ymin: -10, ymax: 10, xlabels: 2, ylabels: 2 }, negs: [[-Infinity, -6], [2, Infinity]], keeps: [[-6, 2]], zeros: [-6, 2], vx: [-2, 8], yi: 6, arrows: [-7.5, 3.5],
    c: [`<b>1</b> Sketch ${T('y=f(x)')}: vertex ${T('(-2,\\ 8)')}, opens down. Zeros: ${T('(x+2)^2=16')}, ${T('x+2=\\pm4')}, ${T('x=2')} or ${T('x=-6')}. ${T('y')}-intercept ${T('-\\frac12(4)+8=6')}.`,
      `<b>2</b> Keep the arch between the zeros, ${T('-6\\le x\\le2')}: it is on or above the axis, so the vertex ${T('(-2,\\ 8)')} stays.`,
      `<b>3</b> It opens down, so the parts below the axis are the two <b class="u7l3-cn">arms</b> outside ${T('-6')} and ${T('2')}. Flip both up.`,
      `<b>4</b> Invariant points ${T('(-6,\\ 0)')} and ${T('(2,\\ 0)')}; the vertex of the graph is still ${T('(-2,\\ 8)')}; ${T('y')}-intercept ${T('|6|=6')}.`],
    r: [`vertex ${T('(-2,\\ 8)')}, opens down<br>zeros ${T('-6')}, ${T('2')}; ${T('y')}-int ${T('6')}`, `keep ${T('-6\\le x\\le2')}`, `flip the arms ${T('x<-6')}, ${T('x>2')}`, `invariant points ${T('(-6,\\ 0)')}, ${T('(2,\\ 0)')}<br>vertex of the graph ${T('(-2,\\ 8)')}`] },
  c: { eq: 'y=|-(x-1)^2-2|', f: (x) => -((x - 1) ** 2) - 2, win: { xmin: -2, xmax: 4, ymin: -8, ymax: 8, ylabels: 2 }, negs: [[-Infinity, Infinity]], keeps: [], zeros: [], vx: [1, -2], yi: -3, arrows: [-0.5, 1, 2.5],
    c: [`<b>1</b> Sketch ${T('y=f(x)')}: vertex ${T('(1,\\ -2)')} and it opens down, so the whole parabola is below the axis. ${T('y')}-intercept ${T('-(1)-2=-3')}.`,
      `<b>2</b> Nothing is on or above the ${T('x')}-axis: there is nothing to keep, and there are no zeros.`,
      `<b>3</b> Flip the <b class="u7l3-cn">whole parabola</b> up: ${T('y=(x-1)^2+2')}, vertex ${T('(1,\\ -2)\\to(1,\\ 2)')}, now opening up.`,
      `<b>4</b> No invariant points. Vertex of the graph ${T('(1,\\ 2)')}; ${T('y')}-intercept ${T('|-3|=3')}.`],
    r: [`vertex ${T('(1,\\ -2)')}, opens down<br>no zeros; ${T('y')}-int ${T('-3')}`, 'nothing to keep', `flip everything:<br>${T('y=(x-1)^2+2')}`, `no invariant points<br>vertex of the graph ${T('(1,\\ 2)')}`] }
};
const flip = {
  title: 'Flip what is below the axis',
  height: 446, minW: 880, capH: 96,
  choices: [{ v: 'e1', label: 'Example 1' }, { sep: 'Example 3:' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }, { v: 'c', label: '(c)' }],
  ask: (v) => v === 'e1' ? `<b>Example 1:</b> ${T('f(x)=x^2-2x-3')}. Complete the table, plot both graphs, and find which part was reflected.` : `<b>Example 3(${v}):</b> sketch ${T(FL[v].eq)}; label the invariant points and the vertex.`,
  make(stage, v, ex) {
    const W = ex.W, d = FL[v], GW = 430, GH = 444, RX = GW + 24, RW = W - RX;
    const G = new Graph(stage, Object.assign({ x: 0, y: 0, width: GW, height: GH, fontSize: 15, pad: [30, 18, 18, 18] }, d.win));
    const fDash = hide(G.fn(d.f, { color: F, width: 2.5, dash: true }));
    const fSolid = hide(G.fn(d.f, { color: F, width: 3.5 }));
    const keeps = d.keeps.map(([a, b]) => hide(G.fn(d.f, { from: inf(a), to: inf(b), color: A, width: 4.5 })));
    const FP = flipper(G, d.f, d.negs); FP.hide();
    const arrows = flipArrows(G, d.f, d.arrows);
    const zs = d.zeros.map((z, i) => hide(G.point(z, 0, { color: INV, r: 7.5, label: T(pt2(z, 0)), pos: i ? 'se' : 'sw' })));
    const steps = [];
    const flipNow = async (c) => {
      fSolid.style.opacity = 0; unhide(fDash);
      await FP.show(c);
      await Promise.all(arrows.map((a) => { unhide(a); return G.drawIn(a, 500, c); }));
      await sleep(c, 250);
      await FP.go(c, 1500);
      await Promise.all(arrows.map((a) => anim(c, a, [{ opacity: 1 }, { opacity: 0 }], 400)));
    };
    if (v === 'e1') {
      const xs = [-2, -1, 0, 1, 2, 3, 4], rows = xs.map((x) => [x, d.f(x), Math.abs(d.f(x))]);
      const cw = 112, tb = new ValueTable(stage, { x: RX + (RW - 3 * cw) / 2, y: 2, headers: ['x', 'y=f(x)', 'y=|f(x)|'], rows, cellW: cw, cellH: 48, hide: (r, cc) => cc > 0, tap: false });
      const fp = xs.map((x) => hide(G.point(x, d.f(x), { color: F, r: 5.5 })));
      xs.forEach((x, i) => { if (d.f(x) < 0) FP.movers.push({ pt: fp[i], x, y: d.f(x), recolor: true }); });
      const vlab = hide(G.label(1, -4, T('(1,\\ -4)'), { pos: 'se', cls: 'bk-ptlab', color: NEG }));
      const tags = [hide(G.label(1.1, 5.3, T('y=|f(x)|'), { pos: 'e', cls: 'bk-ptlab', color: A })), hide(G.label(4.05, 2.2, T('y=f(x)'), { pos: 'w', cls: 'bk-ptlab', color: F }))];
      const negRows = rows.map((r, i) => (r[1] < 0 ? i : -1)).filter((i) => i >= 0);
      steps.push(
        { cap: `<b>(a)</b> Substitute each ${T('x')} into ${T('f(x)=x^2-2x-3')}: for example ${T('f(-2)=4+4-3=5')} and ${T('f(1)=1-2-3=-4')}.`,
          run: (c) => tb.fill(c, { col: 1 }) },
        { cap: `Then take the absolute value of each one. The negatives ${T('-3,\\ -4,\\ -3')} become ${T('3,\\ 4,\\ 3')}; the zeros and the positives stay the same.`,
          run: async (c) => { negRows.forEach((i) => tb.cell(i, 1).classList.add('u7l3-negcell')); await tb.fill(c, { col: 2 }); negRows.forEach((i) => tb.cell(i, 2).classList.add('u7l3-flipcell')); } },
        { cap: `<b>(b)</b> Plot ${T('y=f(x)')}: a parabola with zeros ${T('-1')} and ${T('3')} and vertex ${T('(1,\\ -4)')}. The <b class="u7l3-cn">valley</b> between the zeros is below the ${T('x')}-axis.`,
          run: async (c) => {
            for (const p of fp) { unhide(p); await pop(c, p, 220); }
            unhide(fSolid); await G.drawIn(fSolid, 900, c); await show(c, vlab);
            await Promise.all(FP.shades.map((s) => show(c, s)));
          } },
        { cap: `Flip the valley up: every ${T('y')}-value below the axis changes sign, ${T('(x,\\ y)\\to(x,\\ -y)')}, using the ${T('|f(x)|')} column. The vertex ${T('(1,\\ -4)')} becomes ${T('(1,\\ 4)')}.`,
          run: async (c) => { vlab.style.opacity = 0; await Promise.all(keeps.map((k) => { unhide(k); return G.drawIn(k, 600, c); })); await flipNow(c); await Promise.all(tags.map((t) => show(c, t))); } },
        { cap: `<b>(c)</b> The points with ${T('f(x)\\ge0')} don't move, including the <b class="u7l3-ci">invariant points</b> ${T('(-1,\\ 0)')} and ${T('(3,\\ 0)')}. There is a sharp corner at each one: the graph of ${T('y=|f(x)|')} is a <b>W</b>.`,
          run: async (c) => { await Promise.all(zs.map((z) => popP(c, z))); await Promise.all(zs.map((z) => pulse(c, z, 1.5))); } }
      );
      return steps;
    }
    // Example 3: the four numbered steps, with rows beside the graph
    const rowsEl = div(stage, 'u7l3-rows', '', RX, 4, RW);
    const R = d.r.map((html, i) => row(rowsEl, i + 1, html));
    const [px, py] = d.vx;
    const vp = hide(G.point(px, py, { color: py < 0 ? NEG : A, r: 7, label: T(pt2(px, py)), pos: py < 0 ? 's' : 'n' }));
    if (py < 0) FP.movers.push({ pt: vp, x: px, y: py, recolor: true, lab: true });
    const yp = d.yi !== py && px !== 0 ? hide(G.point(0, d.yi, { color: F, r: 5.5 })) : null;
    if (yp && d.yi < 0) FP.movers.push({ pt: yp, x: 0, y: d.yi, recolor: true });
    steps.push(
      { cap: d.c[0], run: async (c) => { await show(c, R[0]); unhide(fSolid); await G.drawIn(fSolid, 900, c); await Promise.all([...zs.map((z) => { unhide(z); return pop(c, z); }), popP(c, vp), yp ? popP(c, yp) : null]); zs.forEach((z) => { if (z.label) z.label.style.opacity = 0; }); } },
      { cap: d.c[1], run: async (c) => { await show(c, R[1]); await Promise.all(keeps.map((k) => { unhide(k); return G.drawIn(k, 700, c); })); } },
      { cap: d.c[2], run: async (c) => { await show(c, R[2]); await flipNow(c); } },
      { cap: d.c[3], run: async (c) => { await show(c, R[3]); await Promise.all(zs.map((z) => { z.label.style.opacity = ''; return fadeIn(c, z.label, 320); })); await Promise.all([...zs.map((z) => pulse(c, z, 1.5)), pulse(c, vp, 1.5)]); } }
    );
    return steps;
  }
};

/* =============================== explainer: where does the parabola sit? (hands-on + the range table) =============================== */
const sgn = (v) => (v < 0 ? '-' : '+');
const vform = (a, p, q) => {
  const A2 = Math.abs(a) < 1e-9 ? '0' : a === 1 ? '' : a === -1 ? '-' : tn(a);
  const P = Math.abs(p) < 1e-9 ? 'x^2' : `(x${sgn(-p)}${tn(Math.abs(p))})^2`;
  const Q = Math.abs(q) < 1e-9 ? '' : `${sgn(q)}${tn(Math.abs(q))}`;
  return `${A2}${P}${Q}`;
};
const kase = (a, q) => { if (Math.abs(a) < 1e-9) return q >= 0 ? 2 : 3; if (Math.abs(q) < 1e-9 || -q / a > 0) return 1; return q > 0 ? 2 : 3; };
const zerosOf = (a, p, q) => { if (Math.abs(a) < 1e-9) return []; const r = -q / a; if (Math.abs(q) < 1e-9) return [p]; if (r < 0) return []; const s = Math.sqrt(r); return [p - s, p + s]; };
const zt = (z) => (Math.abs(z - Math.round(z)) < 1e-6 ? tn(Math.round(z)) : '\\approx' + tn(Math.round(z * 100) / 100));
const EX4 = [
  { a: 1, p: -1, q: -9, lab: '(a)', eq: 'y=|x^2+2x-8|', inv: '(-4,\\ 0),\\ (2,\\ 0)', yi: '8', v: '(-1,\\ 9)', rg: '\\{y\\mid y\\ge0,\\ y\\in\\mathbb{R}\\}',
    cap: `(a) ${T('x^2+2x-8=(x+4)(x-2)')}, axis ${T('x=-1')}, ${T('f(-1)=1-2-8=-9')}: opens up with the vertex below the axis, so it <b>crosses</b>. Invariant points ${T('(-4,\\ 0)')}, ${T('(2,\\ 0)')}; ${T('y')}-intercept ${T('|-8|=8')}; vertex ${T('(-1,\\ 9)')}; range ${T('y\\ge0')}.` },
  { a: 2, p: 3, q: 1, lab: '(b)', eq: 'y=|2(x-3)^2+1|', inv: '\\text{none}', yi: '19', v: '(3,\\ 1)', rg: '\\{y\\mid y\\ge1,\\ y\\in\\mathbb{R}\\}',
    cap: `(b) Opens up, vertex ${T('(3,\\ 1)')} <b>above</b> the axis: nothing changes. No invariant points; ${T('y')}-intercept ${T('2(9)+1=19')}; vertex ${T('(3,\\ 1)')}; range ${T('y\\ge1')}.` },
  { a: -3, p: -1, q: -6, lab: '(c)', eq: 'y=|-3(x+1)^2-6|', inv: '\\text{none}', yi: '9', v: '(-1,\\ 6)', rg: '\\{y\\mid y\\ge6,\\ y\\in\\mathbb{R}\\}',
    cap: `(c) Opens down, vertex ${T('(-1,\\ -6)')} <b>below</b> the axis: all of it flips. No invariant points; ${T('y')}-intercept ${T('|-3-6|=9')}; vertex ${T('(-1,\\ 6)')}; range ${T('y\\ge6')}.` },
  { a: -1, p: 2, q: 9, lab: '(d)', eq: 'y=|-(x-2)^2+9|', inv: '(-1,\\ 0),\\ (5,\\ 0)', yi: '5', v: '(2,\\ 9)', rg: '\\{y\\mid y\\ge0,\\ y\\in\\mathbb{R}\\}',
    cap: `(d) Opens down, vertex ${T('(2,\\ 9)')} above the axis, so it <b>crosses</b>: ${T('(x-2)^2=9')}, ${T('x=-1')} or ${T('5')}. The arms flip, the vertex stays; ${T('y')}-intercept ${T('|-4+9|=5')}; range ${T('y\\ge0')}. Every domain: ${T('\\{x\\mid x\\in\\mathbb{R}\\}')}.` }
];
const CASES = [
  { name: `crosses or touches the ${T('x')}-axis`, inv: `the ${T('x')}-intercepts`, rg: T('\\{y\\mid y\\ge0,\\ y\\in\\mathbb{R}\\}') },
  { name: `entirely above (${T('a>0,\\ q>0')})`, inv: 'none', rg: `${T('\\{y\\mid y\\ge q,\\ y\\in\\mathbb{R}\\}')}` },
  { name: `entirely below (${T('a<0,\\ q<0')})`, inv: 'none', rg: `${T('\\{y\\mid y\\ge -q,\\ y\\in\\mathbb{R}\\}')}` }
];
const cases = {
  title: 'Where does the parabola sit?',
  height: 446, minW: 880, capH: 96,
  choices: [{ v: 'demo', label: 'Three cases' }, { sep: 'Example 4 check:' }, { v: 'ex4', label: '(a)–(d)' }],
  ask: (v) => v === 'demo' ? `How does the position of the parabola ${T('y=a(x-p)^2+q')} decide the invariant points and the range of ${T('y=|f(x)|')}?` : `<b>Example 4:</b> the invariant points, ${T('y')}-intercept, vertex of the graph and range, without graphing.`,
  make(stage, v, ex) {
    const W = ex.W, demo = v === 'demo', GW = demo ? 430 : 400, GH = 444, RX = GW + 22, RW = W - RX;
    const S = demo ? { a: 1, p: 1, q: -4 } : Object.assign({}, EX4[0]);
    const win = demo ? { xmin: -4, xmax: 6, ymin: -8, ymax: 8 } : { xmin: -6, xmax: 7, ymin: -10, ymax: 20, ystep: 2, ylabels: 4, xlabels: 2 };
    const G = new Graph(stage, Object.assign({ x: 0, y: 0, width: GW, height: GH, fontSize: 15, pad: [30, 18, 18, 18] }, win));
    const f = (x) => S.a * (x - S.p) ** 2 + S.q;
    const fD = G.fn(f, { color: F, width: 2.5, dash: true });
    const fA = G.fn((x) => Math.abs(f(x)), { color: A, width: 4.5 });
    const z1 = G.point(0, 0, { color: INV, r: 7 }), z2 = G.point(0, 0, { color: INV, r: 7 });
    const vp = G.point(0, 0, { color: A, r: 6.5, label: '', pos: 'n' });
    const yp = demo ? null : G.point(0, 0, { color: GR, r: 6 });
    const P = div(stage, 'u7l3-pn', '', RX, 0, RW);
    const eq = h('div', 'u7l3-eqbig'); P.appendChild(eq);
    let inp = null, slv = null, flipB = null;
    if (demo) {
      const ctl = h('div', 'u7l3-ctl');
      const sl = h('label', 'u7l3-sl no-ink', `<span class="u7l3-sll">${T('q')}</span><input type="range" min="-6" max="6" step="0.5" aria-label="the value of q"><span class="u7l3-slv"></span>`);
      sl.setAttribute('data-tap', ''); ctl.appendChild(sl);
      flipB = h('button', 'pill u7l3-flipb no-ink', ''); flipB.type = 'button'; ctl.appendChild(flipB);
      P.appendChild(ctl);
      inp = sl.querySelector('input'); slv = sl.querySelector('.u7l3-slv');
    }
    let tbl;
    if (demo) {
      tbl = h('table', 'u7l3-ct', `<tr><th>The parabola …</th><th>Invariant points</th><th>Range of ${T('|f(x)|')}</th></tr>` + CASES.map((k, i) => `<tr class="u7l3-ct${i + 1}"><td>${k.name}</td><td></td><td></td></tr>`).join(''));
    } else {
      tbl = h('table', 'u7l3-ct u7l3-ct4', `<tr><th></th><th>Invariant points</th><th>${T('y')}-int</th><th>Vertex</th><th>Range</th></tr>` + EX4.map((e) => `<tr><td>${e.lab}</td><td></td><td></td><td></td><td></td></tr>`).join(''));
    }
    P.appendChild(tbl);
    const trs = [...tbl.querySelectorAll('tr')].slice(1);
    const live = h('div', 'u7l3-live'); if (demo) P.appendChild(live);
    const filled = new Set(); let started = false;
    const fillRow = (i) => { const tr = trs[i], k = CASES[i]; tr.children[1].innerHTML = k.inv; tr.children[2].innerHTML = k.rg; filled.add(i); };
    const upd = () => {
      fD._bkDraw(); fA._bkDraw();
      const zs = zerosOf(S.a, S.p, S.q), kk = kase(S.a, S.q);
      if (zs.length) { G.moveTo(z1, zs[0], 0); unhide(z1); } else hide(z1);
      if (zs.length === 2) { G.moveTo(z2, zs[1], 0); unhide(z2); } else hide(z2);
      G.moveTo(vp, S.p, Math.abs(S.q)); vp.label.innerHTML = T(pt2(S.p, Math.abs(S.q)));
      if (yp) G.moveTo(yp, 0, Math.abs(f(0)));
      eq.innerHTML = T(`y=\\left|${vform(S.a, S.p, S.q)}\\right|`);
      if (demo) {
        trs.forEach((tr, i) => tr.classList.toggle('on', i === kk - 1));
        if (started) fillRow(kk - 1);
        const inv = zs.length ? zs.map((z) => T(`(${zt(z)},\\ 0)`)).join(', ') : 'none';
        const lo = kk === 1 ? 0 : Math.abs(S.q);
        live.innerHTML = `<b>Now:</b> invariant points ${inv}; &nbsp;range ${T(`\\{y\\mid y\\ge${tn(lo)},\\ y\\in\\mathbb{R}\\}`)}`;
        live.className = 'u7l3-live u7l3-lk' + kk;
        inp.value = S.q; slv.textContent = tn(S.q).replace('-', '−');
        flipB.innerHTML = S.a > 0 ? 'Opens up ⇄' : 'Opens down ⇄';
      }
    };
    upd();
    const goTo = (c, to, ms) => { const s0 = Object.assign({}, S); return tween(c, ms, (u) => { ['a', 'p', 'q'].forEach((k) => { if (to[k] != null) S[k] = u >= 1 ? to[k] : s0[k] + (to[k] - s0[k]) * u; }); upd(); }); };
    if (demo) {
      inp.addEventListener('input', () => { started = true; S.q = parseFloat(inp.value); upd(); });
      flipB.addEventListener('click', () => { started = true; goTo(null, { a: -S.a }, 0); });
      const lit = (c, i) => pulse(c, trs[i], 1.03);
      return [
        { cap: `Opens up with the vertex ${T('(1,\\ -4)')} below the axis: the parabola <b>crosses</b> the ${T('x')}-axis. Only the valley flips, there are two invariant points, and ${T('|f(x)|')} comes down to ${T('0')}: range ${T('y\\ge0')}.`,
          run: async (c) => { started = true; await goTo(c, { a: 1, q: -4 }, 400); fillRow(0); await lit(c, 0); } },
        { cap: `Slide the vertex up to ${T('(1,\\ 3)')}: now the parabola is <b>entirely above</b> the axis. Nothing flips, ${T('|f(x)|=f(x)')}: no invariant points, and the range ${T('y\\ge3')} is the same as for ${T('f')}: ${T('y\\ge q')}.`,
          run: async (c) => { await goTo(c, { q: 3 }, 2200); fillRow(1); upd(); await lit(c, 1); } },
        { cap: `Open it downward with the vertex ${T('(1,\\ -3)')}: <b>entirely below</b> the axis. The whole parabola flips, ${T('|f(x)|=-f(x)')}: the vertex lands at ${T('(1,\\ 3)')}, no invariant points, range ${T('y\\ge3')}, that is ${T('y\\ge -q')}.`,
          run: async (c) => { await goTo(c, { a: -1, q: -3 }, 2200); fillRow(2); upd(); await lit(c, 2); } },
        { cap: `Opens down with the vertex ${T('(1,\\ 4)')} above the axis: it <b>crosses</b> again. Now the two arms flip and the vertex stays. Two invariant points, range ${T('y\\ge0')}.`,
          run: async (c) => { await goTo(c, { q: 4 }, 2000); await lit(c, 0); } },
        { cap: `<b>Your turn:</b> drag ${T('q')} and switch the opening. The domain never changes: ${T('\\{x\\mid x\\in\\mathbb{R}\\}')}. Only where the parabola sits changes the invariant points and the range.`,
          run: async (c) => { await pulse(c, P.querySelector('.u7l3-ctl'), 1.04); } }
      ];
    }
    return EX4.map((e, i) => ({
      cap: e.cap,
      run: async (c) => {
        if (i) await goTo(c, e, 1500);
        trs.forEach((tr, j) => tr.classList.toggle('on', j === i));
        const cells = [e.inv, e.yi, e.v, e.rg].map((t, j) => { const td = trs[i].children[j + 1]; td.innerHTML = T(t); td.style.opacity = 0; return td; });
        for (const td of cells) { td.style.opacity = ''; await pop(c, td, 260); }
        await Promise.all([pulse(c, vp, 1.5), yp ? pulse(c, yp, 1.5) : null]);
      }
    }));
  }
};

/* =============================== explainer: piecewise form (the procedure) =============================== */
const PC = {
  a: { f: (x) => x * x - x - 12, eq: 'y=|x^2-x-12|', win: { xmin: -6, xmax: 7, ymin: -14, ymax: 18, ystep: 2, ylabels: 4, xlabels: 1 }, zeros: [-3, 4],
    segs: [[-Infinity, -3, 1], [-3, 4, -1], [4, Infinity, 1]],
    c: [`<b>1</b> The zeros: ${T('x^2-x-12=(x-4)(x+3)=0')}, so ${T('x=-3')} and ${T('x=4')}. They cut the ${T('x')}-axis into three subdomains.`,
      `<b>2</b> The sign of ${T('f(x)')}: it opens up, so ${T('f(x)<0')} <b>between</b> the zeros (test ${T('x=0')}: ${T('f(0)=-12<0')}) and ${T('f(x)\\ge0')} outside them.`,
      `<b>3</b> Write the pieces: ${T('f(x)')} where ${T('f(x)\\ge0')}, and ${T('-f(x)=-x^2+x+12')} where ${T('f(x)<0')}.`],
    r: [`${T('(x-4)(x+3)=0')}: ${T('x=-3')}, ${T('x=4')}`, `opens up: ${T('f(x)<0')} for ${T('-3<x<4')}`],
    cases: `y=\\begin{cases}\\textcolor{${A}}{x^2-x-12}, & \\text{if } x\\le-3\\text{ or }x\\ge4\\\\ \\textcolor{${NEG}}{-x^2+x+12}, & \\text{if } -3<x<4\\end{cases}` },
  b: { f: (x) => 16 - 4 * x * x, eq: 'y=|16-4x^2|', win: { xmin: -4, xmax: 4, ymin: -20, ymax: 20, ystep: 4, ylabels: 8 }, zeros: [-2, 2],
    segs: [[-Infinity, -2, -1], [-2, 2, 1], [2, Infinity, -1]],
    c: [`<b>1</b> The zeros: ${T('16-4x^2=4(2-x)(2+x)=0')}, so ${T('x=\\pm2')}.`,
      `<b>2</b> The sign: it opens down (${T('a=-4')}), so ${T('f(x)<0')} <b>outside</b> the zeros (test ${T('x=3')}: ${T('16-36=-20<0')}) and ${T('f(x)\\ge0')} between them.`,
      `<b>3</b> Write the pieces: ${T('16-4x^2')} for ${T('-2\\le x\\le2')}, and ${T('-(16-4x^2)=4x^2-16')} for ${T('x<-2')} or ${T('x>2')}.`],
    r: [`${T('4(2-x)(2+x)=0')}: ${T('x=\\pm2')}`, `opens down: ${T('f(x)<0')} for ${T('x<-2')} or ${T('x>2')}`],
    cases: `y=\\begin{cases}\\textcolor{${A}}{16-4x^2}, & \\text{if } -2\\le x\\le2\\\\ \\textcolor{${NEG}}{4x^2-16}, & \\text{if } x<-2\\text{ or }x>2\\end{cases}` },
  c: { f: (x) => x * x + 4 * x + 7, eq: 'y=|x^2+4x+7|', win: { xmin: -6, xmax: 2, ymin: -4, ymax: 12, ylabels: 2 }, zeros: [],
    segs: [[-Infinity, Infinity, 1]],
    c: [`<b>1</b> Look for zeros: ${T('x^2+4x+7=(x+2)^2+3')}. The vertex ${T('(-2,\\ 3)')} is above the axis and it opens up: <b>no zeros</b>.`,
      `<b>2</b> The sign: ${T('(x+2)^2+3\\ge3>0')} for every ${T('x')}. There is nothing to flip.`,
      `<b>3</b> One piece is enough: ${T('y=x^2+4x+7')}, ${T('x\\in\\mathbb{R}')}.`],
    r: [`${T('(x+2)^2+3')}: no zeros`, `${T('f(x)\\ge3>0')} for every ${T('x')}`],
    cases: `y=\\textcolor{${A}}{x^2+4x+7},\\quad x\\in\\mathbb{R}` }
};
const pieces = {
  title: 'Cut at the zeros: piecewise form',
  height: 446, minW: 880, capH: 96,
  choices: [{ sep: 'Example 5:' }, { v: 'a', label: '(a) and (d)' }, { v: 'b', label: '(b)' }, { v: 'c', label: '(c)' }],
  ask: (v) => `<b>Example 5(${v === 'a' ? 'a), (d' : v}):</b> write ${T(PC[v].eq)} in piecewise form${v === 'a' ? `, then evaluate it at ${T('x=1')} and ${T('x=5')}` : ''}.`,
  make(stage, v, ex) {
    const W = ex.W, d = PC[v], GW = 430, GH = 344, RX = GW + 24, RW = W - RX;
    const G = new Graph(stage, Object.assign({ x: 0, y: 0, width: GW, height: GH, fontSize: 14, pad: [30, 18, 18, 18] }, d.win));
    G.fn(d.f, { color: F, width: 2.5, dash: true });
    const fA = G.fn((x) => Math.abs(d.f(x)), { color: A, width: 4.5 });
    const negPieces = d.segs.filter((s) => s[2] < 0).map(([a, b]) => hide(G.fn((x) => -d.f(x), { from: inf(a), to: inf(b), color: NEG, width: 5 })));
    const zp = d.zeros.map((z) => hide(G.point(z, 0, { color: INV, r: 7 })));
    const vl = d.zeros.map((z) => hide(G.vline(z, { color: 'slate', width: 2 })));
    // the sign strip under the graph, on the same x-scale
    const SY = GH + 4, SH = 96, sx = (x) => G.toPx(Math.max(G.win.xmin, Math.min(G.win.xmax, x)), 0)[0];
    const strip = absSvg(stage, GW, SH, 0, SY, 'u7l3-strip');
    svgEl('line', { x1: sx(-Infinity), x2: sx(Infinity), y1: 26, y2: 26, class: 'u7l3-sax' }, strip);
    const bands = d.segs.map(([a, b, s]) => { const r = svgEl('rect', { x: sx(a), y: 12, width: Math.max(0, sx(b) - sx(a)), height: 28, rx: 6, fill: s > 0 ? A : NEG, opacity: 0.85 }, strip); r.style.opacity = 0; return r; });
    const blabs = d.segs.map(([a, b, s]) => { const m = (sx(a) + sx(b)) / 2, w = sx(b) - sx(a); const e = div(stage, 'u7l3-blab', w > 170 ? (s > 0 ? `${T('f(x)\\ge0')}: keep ${T('f(x)')}` : `${T('f(x)<0')}: use ${T('-f(x)')}`) : (s > 0 ? `keep ${T('f(x)')}` : `${T('-f(x)')}`), m, SY + 26); e.style.opacity = 0; return e; });
    const zl = d.zeros.map((z) => { const e = div(stage, 'u7l3-zl', T(tn(z)), sx(z), SY + 50); e.style.opacity = 0; return e; });
    const ticks = d.zeros.map((z) => { const t = svgEl('line', { x1: sx(z), x2: sx(z), y1: 4, y2: 48, class: 'u7l3-stk' }, strip); t.style.opacity = 0; return t; });
    const rowsEl = div(stage, 'u7l3-rows', '', RX, 4, RW);
    const R1 = row(rowsEl, 1, d.r[0]), R2 = row(rowsEl, 2, d.r[1]), R3 = row(rowsEl, 3, `<div class="u7l3-cases">${T(d.cases)}</div>`);
    const steps = [
      { cap: d.c[0], run: async (c) => {
        await show(c, R1);
        if (d.zeros.length) { await Promise.all(zp.map((p) => { unhide(p); return pop(c, p); })); await Promise.all(vl.map((l) => { unhide(l); return G.drawIn(l, 500, c); })); ticks.forEach((t) => { t.style.opacity = ''; }); await Promise.all(zl.map((e) => fadeIn(c, e, 300))); }
      } },
      { cap: d.c[1], run: async (c) => { await show(c, R2); for (let i = 0; i < bands.length; i++) { bands[i].style.opacity = ''; await anim(c, bands[i], [{ opacity: 0 }, { opacity: 1 }], 350); await anim(c, blabs[i], [{ opacity: 0 }, { opacity: 1 }], 250); } } },
      { cap: d.c[2], run: async (c) => { await Promise.all(negPieces.map((p) => { unhide(p); return G.drawIn(p, 800, c); })); await show(c, R3); } }
    ];
    if (v === 'a') {
      const R4 = row(rowsEl, '', `(d) ${T('x=1')}: ${T('-3<1<4')}, so ${T('y=-1+1+12=12')}<br>check ${T('|1-1-12|=12')} ✓`);
      const R5 = row(rowsEl, '', `${T('x=5\\ge4')}: ${T('y=25-5-12=8')}<br>check ${T('|25-5-12|=|8|=8')} ✓`);
      const tr = hide(G.point(1, 12, { color: INK, r: 7, label: T('(1,\\ 12)'), pos: 'ne' }));
      const p5 = hide(G.point(5, 8, { color: INK, r: 7, label: T('(5,\\ 8)'), pos: 'e' }));
      steps.push(
        { cap: `<b>(d)</b> ${T('x=1')} is between ${T('-3')} and ${T('4')}: use the <b class="u7l3-cn">middle piece</b>, ${T('y=-(1)^2+1+12=12')}. Check with the bars: ${T('|1-1-12|=|-12|=12')} ✓`,
          run: async (c) => { await show(c, R4); await popP(c, tr); await pulse(c, tr, 1.5); } },
        { cap: `${T('x=5\\ge4')}: use the <b class="u7l3-ca">first piece</b>, ${T('y=25-5-12=8')}. Check: ${T('|25-5-12|=|8|=8')} ✓`,
          run: async (c) => { await show(c, R5); await popP(c, p5); await pulse(c, p5, 1.5); } }
      );
    }
    void fA;
    return steps;
  }
};

/* =============================== explainer: working backwards (Example 7) =============================== */
const W7 = (x) => Math.abs((x + 2) * (x - 4));
const backwards = {
  title: 'Which f made this graph?',
  height: 446, minW: 880, capH: 96,
  choices: [{ sep: 'Example 7:' }, { v: 'a', label: '(a) two possible f' }, { v: 'bc', label: '(b)–(c) find k' }],
  ask: (v) => v === 'a' ? `<b>Example 7(a):</b> the graph of ${T('y=|f(x)|')} is shown. Find the two possible quadratic functions ${T('f')}.` : `<b>Example 7(b)–(c):</b> ${T('g(x)=-2(x-1)^2+k')}. When is the range of ${T('y=|g(x)|')} equal to ${T('\\{y\\mid y\\ge4\\}')}? To ${T('\\{y\\mid y\\ge0\\}')}?`,
  make(stage, v, ex) {
    const W = ex.W;
    if (v === 'a') {
      const GW = 420, GH = 318, GX2 = W - GW;
      const win = { xmin: -3, xmax: 5, ymin: -10, ymax: 10, ystep: 2, ylabels: 4, fontSize: 14, pad: [28, 18, 18, 18] };
      const t1 = div(stage, 'u7l3-gt', 'If the <b>middle arc</b> was flipped', 0, 0, GW), t2 = div(stage, 'u7l3-gt', 'If the two <b>arms</b> were flipped', GX2, 0, GW);
      void t1; void t2;
      const G1 = new Graph(stage, Object.assign({ x: 0, y: 30, width: GW, height: GH }, win));
      const G2 = new Graph(stage, Object.assign({ x: GX2, y: 30, width: GW, height: GH }, win));
      const arms1 = [G1.fn(W7, { to: -2, color: INK, width: 4.5 }), G1.fn(W7, { from: 4, color: INK, width: 4.5 })];
      const mid2 = G2.fn(W7, { from: -2, to: 4, color: INK, width: 4.5 });
      const FP1 = flipper(G1, W7, [[-2, 4]], { from: INK, to: F, shade: false });
      const FP2 = flipper(G2, W7, [[-Infinity, -2], [4, Infinity]], { from: INK, to: GR, shade: false });
      FP1.upd(); FP2.upd();
      const inv = [G1, G2].map((G) => [-2, 4].map((z) => G.point(z, 0, { color: INV, r: 7 })));
      const v1 = G1.point(1, 9, { color: INK, r: 7, label: T('(1,\\ 9)'), pos: 'n' }), v2 = G2.point(1, 9, { color: INK, r: 7, label: T('(1,\\ 9)'), pos: 'n' });
      FP1.movers.push({ pt: v1, x: 1, y: 9, recolor: true, lab: true });
      const r1 = div(stage, 'u7l3-row u7l3-rowb', `${T('f(x)=a(x+2)(x-4)')}, ${T('f(1)=a(3)(-3)=-9')}<br>${T('a=1')}: <b class="u7l3-cf">${T('f(x)=(x+2)(x-4)')}</b>`, 0, GH + 36, GW); r1.style.opacity = 0;
      const r2 = div(stage, 'u7l3-row u7l3-rowb', `opens down, vertex ${T('(1,\\ 9)')}<br><b class="u7l3-cg">${T('f(x)=-(x+2)(x-4)')}</b>`, GX2, GH + 36, GW); r2.style.opacity = 0;
      const st = stamp(stage, 'Same |f(x)|!', { ok: true, x: W / 2, y: 150 }); st.style.opacity = 0;
      return [
        { cap: `The graph shows the invariant points ${T('(-2,\\ 0)')} and ${T('(4,\\ 0)')}, and the middle arc's vertex ${T('(1,\\ 9)')}. Either the middle arc or the two arms came from below the axis: <b>two possibilities</b>.`,
          run: async (c) => { await Promise.all(inv.flat().map((p) => pulse(c, p, 1.5))); await Promise.all([pulse(c, v1, 1.5), pulse(c, v2, 1.5)]); } },
        { cap: `If the <b>middle arc</b> was reflected, flip it back down: ${T('f')} opens up with vertex ${T('(1,\\ -9)')}. ${T('f(x)=a(x+2)(x-4)')} and ${T('f(1)=a(3)(-3)=-9')}, so ${T('a=1')}: ${T('f(x)=(x+2)(x-4)')}.`,
          run: async (c) => { await FP1.go(c, 1500); arms1.forEach((g) => recolor(g, F)); await show(c, r1); } },
        { cap: `Otherwise the two <b>arms</b> were reflected: flip them back down. ${T('f')} opens down and keeps the vertex ${T('(1,\\ 9)')}: ${T('f(x)=-(x+2)(x-4)')}.`,
          run: async (c) => { await FP2.go(c, 1500); recolor(mid2, GR); v2.querySelector('circle').setAttribute('fill', GR); v2.label.style.color = GR; await show(c, r2); } },
        { cap: `Both are right: ${T('(x+2)(x-4)')} and ${T('-(x+2)(x-4)')} are opposites, so they have the same absolute value and the same graph of ${T('y=|f(x)|')}.`,
          run: async (c) => { st.style.opacity = ''; await stampIn(c, st); } }
      ];
    }
    // (b)–(c): slide k
    const GW = 430, GH = 444, RX = GW + 24, RW = W - RX, S = { k: 3 };
    const G = new Graph(stage, { x: 0, y: 0, width: GW, height: GH, xmin: -3, xmax: 5, ymin: -8, ymax: 8, ylabels: 2, fontSize: 15, pad: [30, 18, 18, 18] });
    const g = (x) => -2 * (x - 1) ** 2 + S.k;
    const tgt = hide(G.hline(4, { color: INV, width: 3, dash: '10 6' }));
    const tgl = hide(G.label(4.9, 4, T('y=4'), { pos: 'nw', cls: 'bk-ptlab', color: INV }));
    const gD = G.fn(g, { color: F, width: 2.5, dash: true });
    const gA = G.fn((x) => Math.abs(g(x)), { color: A, width: 4.5 });
    const vg = G.point(1, 0, { color: F, r: 6 }), va = G.point(1, 0, { color: A, r: 7, label: '', pos: 'n' });
    const P = div(stage, 'u7l3-pn', '', RX, 0, RW);
    P.appendChild(h('div', 'u7l3-eqbig', T('g(x)=-2(x-1)^2+k')));
    const sl = h('label', 'u7l3-sl no-ink', `<span class="u7l3-sll">${T('k')}</span><input type="range" min="-7" max="6" step="0.5" aria-label="the value of k"><span class="u7l3-slv"></span>`);
    sl.setAttribute('data-tap', ''); P.appendChild(sl);
    const inp = sl.querySelector('input'), slv = sl.querySelector('.u7l3-slv');
    const live = h('div', 'u7l3-live'); P.appendChild(live);
    // a k number line painted by the range it gives
    const KW = RW, KH = 92, kmin = -7, kmax = 6, kx = (k) => 18 + (k - kmin) / (kmax - kmin) * (KW - 36);
    const ksv = svgEl('svg', { width: KW, height: KH, viewBox: `0 0 ${KW} ${KH}`, class: 'u7l3-ksv' }, P);
    svgEl('line', { x1: 10, x2: KW - 10, y1: 40, y2: 40, class: 'u7l3-sax' }, ksv);
    for (let k = kmin; k <= kmax; k++) { svgEl('line', { x1: kx(k), x2: kx(k), y1: 34, y2: 46, class: 'u7l3-stk2' }, ksv); if (k % 2 === 0 || k === -7) { const e = svgEl('text', { x: kx(k), y: 64, 'text-anchor': 'middle', class: 'u7l3-ktx' }, ksv); e.textContent = String(k).replace('-', '−'); } }
    const pNeg = svgEl('rect', { x: kx(kmin), y: 30, width: 0, height: 20, rx: 5, fill: INV, opacity: 0.85 }, ksv);
    const pPos = svgEl('rect', { x: kx(0), y: 30, width: 0, height: 20, rx: 5, fill: A, opacity: 0.85 }, ksv);
    const kmark = svgEl('path', { d: 'M0 28 l-8 -14 h16 z', fill: INK }, ksv);
    const kcap = h('div', 'u7l3-kcap'); P.appendChild(kcap);
    let paint = false;
    const upd = () => {
      gD._bkDraw(); gA._bkDraw(); G.moveTo(vg, 1, S.k); G.moveTo(va, 1, Math.abs(S.k));
      va.label.innerHTML = T(pt2(1, Math.abs(S.k)));
      const lo = S.k >= 0 ? 0 : -S.k;
      live.innerHTML = `${T(`k=${tn(S.k)}`)}: ${S.k >= 0 ? 'touches or crosses the axis' : 'entirely below the axis'}<br>range of ${T('|g|')}: <b>${T(`\\{y\\mid y\\ge${tn(lo)},\\ y\\in\\mathbb{R}\\}`)}</b>`;
      live.className = 'u7l3-live ' + (S.k >= 0 ? 'u7l3-lk1' : 'u7l3-lk3');
      inp.value = S.k; slv.textContent = tn(S.k).replace('-', '−');
      kmark.setAttribute('transform', `translate(${kx(Math.max(kmin, Math.min(kmax, S.k)))} 0)`);
      if (paint) { pNeg.setAttribute('width', Math.max(+pNeg.getAttribute('width'), Math.min(kx(0), kx(S.k)) - kx(kmin))); if (S.k >= 0) pPos.setAttribute('width', Math.max(+pPos.getAttribute('width'), kx(S.k) - kx(0))); }
    };
    upd();
    inp.addEventListener('input', () => { S.k = parseFloat(inp.value); upd(); });
    const go = (c, to, ms) => { const k0 = S.k; return tween(c, ms, (u) => { S.k = u >= 1 ? to : k0 + (to - k0) * u; upd(); }); };
    return [
      { cap: `<b>(b)</b> ${T('g')} opens down with vertex ${T('(1,\\ k)')}. A range of ${T('y\\ge4')} has lowest value ${T('4')}, not ${T('0')}: ${T('|g|')} never reaches the axis, so ${T('g')} must be <b>entirely below</b> it.`,
        run: async (c) => { unhide(tgt); unhide(tgl); await G.drawIn(tgt, 600, c); await fadeIn(c, tgl, 300); } },
      { cap: `Slide ${T('k')} down. Once the vertex ${T('(1,\\ k)')} is below the axis, the whole parabola flips and its vertex lands at ${T('(1,\\ -k)')}. The lowest value is ${T('4')} when ${T('-k=4')}: <b>${T('k=-4')}</b>.`,
        run: async (c) => { await go(c, -4, 2600); await pulse(c, va, 1.6); kcap.innerHTML = `(b) ${T('k=-4')}`; await fadeIn(c, kcap, 300); } },
        { cap: `<b>(c)</b> A range of ${T('y\\ge0')} means ${T('|g|')} reaches ${T('0')}: ${T('g')} must touch or cross the axis. Sliding ${T('k')} up, that starts when the vertex reaches the axis, ${T('k=0')}, and lasts for every <b>${T('k\\ge0')}</b>.`,
        run: async (c) => { await go(c, -7, 700); paint = true; pNeg.setAttribute('width', 0); pPos.setAttribute('width', 0); upd(); await go(c, 0, 2200); await sleep(c, 400); await go(c, 6, 1600); kcap.innerHTML = `<span class="u7l3-cl">${T('k<0')}: range ${T('y\\ge -k')}</span> &nbsp; <span class="u7l3-ca">${T('k\\ge0')}: range ${T('y\\ge0')}</span>`; await fadeIn(c, kcap, 300); } },
      { cap: `<b>Your turn:</b> drag ${T('k')}. Below the axis the lowest point of ${T('|g|')} is ${T('-k')}; on or above it, the graph always comes down to ${T('0')}.`,
        run: async (c) => { await go(c, 2, 900); await pulse(c, sl, 1.05); } }
    ];
  }
};

/* =============================== explainer: the roller coaster (Example 8) =============================== */
const HC = (x) => 0.1 * x * x - 2 * x + 7.5, HCd = (x) => 0.2 * x - 2;
const coaster = {
  title: 'Into the tunnel',
  height: 446, minW: 880, capH: 96,
  ask: `<b>Example 8:</b> ${T('h(x)=0.1x^2-2x+7.5')}, ${T('0\\le x\\le20')}, and the distance to ground level is ${T('d(x)=|h(x)|')}.`,
  make(stage, v, ex) {
    const W = ex.W, SH = 168, GY = SH + 6, GH = 446 - GY;
    const G = new Graph(stage, { x: 0, y: GY, width: W, height: GH, xmin: -1, xmax: 21, ymin: -3, ymax: 8, xlabels: 5, ylabels: 2, fontSize: 14, xtitle: 'x\\text{ (m)}', ytitle: 'y\\text{ (m)}', pad: [16, 30, 18, 18] });
    const sx = (x) => G.toPx(x, 0)[0], gy = 98, sc = 10.5, sy = (hh) => gy - sc * hh;
    // the scene: sky, the ground, the track, the tunnel
    const sv = absSvg(stage, W, SH, 0, 0, 'u7l3-scene');
    svgEl('rect', { x: 0, y: 0, width: W, height: gy, fill: '#eaf4fb', rx: 10 }, sv);
    svgEl('rect', { x: 0, y: gy, width: W, height: SH - gy, fill: '#b48a5e' }, sv);
    svgEl('rect', { x: 0, y: gy - 3, width: W, height: 6, fill: '#7dbb6a' }, sv);
    let tun = ''; for (let i = 0; i <= 60; i++) { const x = 5 + 10 * i / 60; tun += (i ? 'L' : 'M') + sx(x).toFixed(1) + ' ' + (sy(HC(x)) - 16).toFixed(1); }
    for (let i = 60; i >= 0; i--) { const x = 5 + 10 * i / 60; tun += 'L' + sx(x).toFixed(1) + ' ' + (sy(HC(x)) + 6).toFixed(1); }
    svgEl('path', { d: tun + 'Z', fill: '#4b3826' }, sv);
    [5, 15].forEach((x) => svgEl('path', { d: `M${sx(x) - 14} ${gy + 2} q14 -26 28 0`, fill: 'none', stroke: '#6b6b6b', 'stroke-width': 5, class: 'u7l3-portal' }, sv));
    for (let x = 0.5; x <= 20; x += 1) if (x < 5 || x > 15) svgEl('line', { x1: sx(x), x2: sx(x), y1: sy(HC(x)), y2: gy, stroke: '#8a8f99', 'stroke-width': 2 }, sv);
    let tr = ''; for (let i = 0; i <= 120; i++) { const x = 20 * i / 120; tr += (i ? 'L' : 'M') + sx(x).toFixed(1) + ' ' + sy(HC(x)).toFixed(1); }
    svgEl('path', { d: tr, fill: 'none', stroke: '#3a4254', 'stroke-width': 5, 'stroke-linecap': 'round' }, sv);
    svgEl('text', { x: sx(20.4), y: gy + 4, class: 'u7l3-gl', 'text-anchor': 'start' }, sv).textContent = 'ground';
    const bar = svgEl('line', { x1: 0, x2: 0, y1: gy, y2: gy, stroke: INV, 'stroke-width': 4, 'stroke-dasharray': '7 4' }, sv);
    const car = svgEl('g', {}, sv);
    svgEl('rect', { x: -17, y: -22, width: 34, height: 16, rx: 5, fill: NEG, stroke: '#7a1f1f', 'stroke-width': 2 }, car);
    svgEl('circle', { cx: -9, cy: -4, r: 4, fill: '#2e3442' }, car); svgEl('circle', { cx: 9, cy: -4, r: 4, fill: '#2e3442' }, car);
    svgEl('text', { x: 0, y: -24, 'font-size': 18, 'text-anchor': 'middle' }, car).textContent = '🙌';
    const dl = div(stage, 'u7l3-dlab', '', 0, 0);
    const g10 = svgEl('g', {}, sv); g10.style.opacity = 0;
    svgEl('line', { x1: sx(10), x2: sx(10), y1: gy, y2: sy(HC(10)), stroke: A, 'stroke-width': 3, 'stroke-dasharray': '5 4' }, g10);
    const l10 = div(stage, 'u7l3-dlab u7l3-dl10', `${T('2.5')} m below ground`, sx(10) + 10, sy(-1.4) - 12); l10.style.opacity = 0;
    // the graph of d, traced in step with the car
    G.fn(HC, { from: 0, to: 20, color: F, width: 2.5, dash: true });
    const fo = { from: 0, to: 0, color: A, width: 4.5 };
    const cv = G.fn((x) => Math.abs(HC(x)), fo);
    const dot = svgEl('circle', { r: 7, fill: A, stroke: '#fff', 'stroke-width': 2 }, G.layers.top);
    const S = { x: 0 };
    const setX = (x) => {
      S.x = x; const hh = HC(x), px = sx(x), py = sy(hh), ang = Math.atan2(-sc * HCd(x), G.ux) * 180 / Math.PI;
      car.setAttribute('transform', `translate(${px} ${py}) rotate(${ang})`);
      bar.setAttribute('x1', px); bar.setAttribute('x2', px); bar.setAttribute('y2', py);
      const dd = Math.abs(hh);
      dl.innerHTML = T(`d=${tn(Math.round(dd * 10) / 10)}`) + ' m'; dl.style.left = (x > 16 ? px - 12 - (dl.offsetWidth || 90) : px + 12) + 'px'; dl.style.top = (hh >= 0 ? (py + gy) / 2 - 14 : gy + 6 + (py - gy) / 2) + 'px';
      if (x > fo.to) { fo.to = x; cv._bkDraw(); }
      const [qx, qy] = G.toPx(x, dd); dot.setAttribute('cx', qx); dot.setAttribute('cy', qy);
    };
    setX(0);
    const drive = (c, x1, ms) => { const x0 = S.x; return tween(c, ms, (u) => setX(x0 + (x1 - x0) * u), linear); };
    const z5 = hide(G.point(5, 0, { color: INV, r: 7, label: T('(5,\\ 0)'), pos: 'ne' })), z15 = hide(G.point(15, 0, { color: INV, r: 7, label: T('(15,\\ 0)'), pos: 'nw' }));
    const hv = hide(G.point(10, -2.5, { color: F, r: 6, label: T('(10,\\ -2.5)'), pos: 'e' })), dv = hide(G.point(10, 2.5, { color: A, r: 7, label: T('(10,\\ 2.5)'), pos: 'n' }));
    const e0 = hide(G.point(0, 7.5, { color: A, r: 6, label: T('7.5'), pos: 'e' })), e20 = hide(G.point(20, 7.5, { color: A, r: 6, label: T('7.5'), pos: 'w' }));
    const rng = hide(G.shadeY(0, 7.5, { color: A }));
    return [
      { cap: `<b>(a)</b> Ground level is where ${T('h(x)=0')}: ${T('0.1x^2-2x+7.5=0')}. Multiply by ${T('10')}: ${T('x^2-20x+75=0')}, ${T('(x-5)(x-15)=0')}. The track is at ground level at ${T('x=5')} m and ${T('x=15')} m.`,
        run: async (c) => { await drive(c, 5, 1700); await popP(c, z5); await popP(c, z15); await Promise.all([...sv.querySelectorAll('.u7l3-portal')].map((p) => pulse(c, p, 1.15))); } },
      { cap: `<b>(b)</b> In the tunnel ${T('h(x)')} is negative, but a distance can't be: ${T('d(x)=|h(x)|')}. The dip of ${T('h')} below ground flips up into the graph of ${T('d')}.`,
        run: async (c) => { await drive(c, 15, 3200); await drive(c, 20, 1500); } },
      { cap: `<b>(c)</b> Axis ${T('x=10')}: ${T('h(10)=10-20+7.5=-2.5')}. The track is ${T('2.5')} m below ground at ${T('x=10')} m; the point ${T('(10,\\ -2.5)')} on ${T('h')} is the point ${T('(10,\\ 2.5)')} on ${T('d')}.`,
        run: async (c) => { g10.style.opacity = ''; await fadeIn(c, g10, 300); await fadeIn(c, l10, 300); await popP(c, hv); await popP(c, dv); await pulse(c, dv, 1.5); } },
      { cap: `<b>(d)</b> The greatest distance is at the ends, ${T('d(0)=d(20)=7.5')}, and the least is ${T('0')} at the invariant points: the range is ${T('\\{d\\mid 0\\le d\\le7.5,\\ d\\in\\mathbb{R}\\}')}.`,
        run: async (c) => { await popP(c, e0); await popP(c, e20); unhide(rng); await G.reveal(rng, c, 700); } }
    ];
  }
};

/* =============================== Stand Up Break =============================== */
/* BEG: invariant points and the vertex of the graph of |x² + bx + c| (or its opposite), integer zeros.
 * PRG: invariant points, y-intercept, vertex of the graph and range of |a(x − p)² + q| (crosses / above / below).
 * MAS: piecewise form of |f(x)| with integer zeros, opening up or down. */
const term = (co, v, first) => { if (co === 0) return ''; const s = co < 0 ? '-' : first ? '' : '+', m = Math.abs(co); return s + (m === 1 && v ? '' : m) + v; };
const poly = (a, b, c) => (term(a, 'x^2', true) + term(b, 'x') + term(c, '')) || '0';
const fac = (r) => (r === 0 ? 'x' : `(x${r < 0 ? '+' : '-'}${Math.abs(r)})`);
standup('u7l3', {
  intro: 'At your whiteboard: sketch y = f(x) first, then flip up whatever is below the x-axis.',
  levels: {
    BEG: (r) => {
      const a = r.pick([1, 1, -1]), rr = r.int(-6, 3), s = rr + 2 * r.int(1, 4), m = (rr + s) / 2, dd = ((s - rr) / 2) ** 2;
      const b = -a * (rr + s), c = a * rr * s;
      return { text: 'State the invariant points and the vertex of the graph of the function.', q: `y=\\left|${poly(a, b, c)}\\right|`,
        a: [`${a < 0 ? '-' : ''}${fac(rr)}${fac(s)}\\text{: zeros }${rr},\\ ${s}`, `\\text{invariant points }(${rr},\\ 0),\\ (${s},\\ 0)`,
          a > 0 ? `f(${m})=-${dd}\\text{, so the vertex }(${m},\\ -${dd})\\to(${m},\\ ${dd})` : `f(${m})=${dd}\\text{: the vertex }(${m},\\ ${dd})\\text{ stays}`] };
    },
    PRG: (r) => {
      const kind = r.pick(['x', 'up', 'down']), p = r.int(-4, 4);
      let a, q;
      if (kind === 'x') { a = r.pick([1, -1, 2, -2]); const d = r.int(1, 3); q = -a * d * d; }
      else if (kind === 'up') { a = r.pick([1, 2, 3]); q = r.int(1, 6); }
      else { a = r.pick([-1, -2, -3]); q = -r.int(1, 6); }
      const yi = Math.abs(a * p * p + q), Q = Math.abs(q);
      const inv = kind === 'x' ? (() => { const d = Math.sqrt(-q / a); return `(${p - d},\\ 0),\\ (${p + d},\\ 0)`; })() : '\\text{none}';
      return { text: 'State the invariant points (if any), the y-intercept, the vertex of the graph and the range.', q: `y=\\left|${vform(a, p, q)}\\right|`,
        a: [`\\text{invariant points: }${inv}`, `y\\text{-intercept }${yi}`, `\\text{vertex }(${p},\\ ${Q})`, `\\{y\\mid y\\ge${kind === 'x' ? 0 : Q},\\ y\\in\\mathbb{R}\\}`] };
    },
    MAS: (r) => {
      const a = r.pick([1, -1]), rr = r.int(-6, 2), s = rr + r.int(2, 7), b = -a * (rr + s), c = a * rr * s;
      const P = poly(a, b, c), N = poly(-a, -b, -c);
      const lines = a > 0
        ? [`${P},\\ \\text{if } x\\le${rr}\\text{ or }x\\ge${s}`, `${N},\\ \\text{if } ${rr}<x<${s}`]
        : [`${P},\\ \\text{if } ${rr}\\le x\\le${s}`, `${N},\\ \\text{if } x<${rr}\\text{ or }x>${s}`];
      return { text: 'Write the function in piecewise form, without absolute value symbols.', q: `y=\\left|${P}\\right|`,
        a: [`${a < 0 ? '-' : ''}${fac(rr)}${fac(s)}=0\\text{: zeros }${rr},\\ ${s}\\text{; opens ${a > 0 ? 'up' : 'down'}}`, `y=\\begin{cases}${lines[0]}\\\\ ${lines[1]}\\end{cases}`] };
    }
  }
});

/* =============================== mount =============================== */
export const explainers = mountExplainers({ flip, cases, pieces, backwards, coaster });
export const _test = { kase, zerosOf, vform, HC };
