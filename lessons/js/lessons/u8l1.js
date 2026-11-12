/* Math 20-1 · Unit 8 · Lesson 1 — Solving Linear–Quadratic Systems.
 * New lesson format (2026-11-11): the warm-up ("The Two Ferries") is plain markup on the page (no code). Explainers:
 *   sub     (the substitution procedure, numbered 1–5, beside a graph where the two points appear when y is found;
 *            factoring uses the X: ac on top, b underneath, the two numbers on the sides, factor pairs beside with the
 *            right pair circled; Example 3 (a)–(c)),
 *   tunnel  (Example 4: the arch and the beam. The algebra sees the WHOLE parabola and line, so a second point turns
 *            up under the ground: stamped "rejected", and the real point stamped ✓),
 *   elim    (the elimination procedure, numbered 1–5: the two equations stacked term under term, the y-terms struck
 *            out as the equations are subtracted (a) or added (b), then solve; Example 5),
 *   tilt    (STAR, hands-on: a line you slide (k) and tilt (m) across a parabola. The intersection points appear,
 *            merge at a tangent and vanish while the combined equation and its discriminant update live, with a sign
 *            meter and the verdict; Example 1's three lines, Example 7(a) y = 2x + k, Example 7(b) y = mx − 1),
 *   circle  (Section 6: x² + y² = 20 from the Pythagorean theorem, the line y = 2x through the centre (Example 8(a)),
 *            then the line x + 2y = c sliding out until its two points merge at (2, 4): tangent (Example 8(b))).
 * Colours: the parabola / circle blue, the line purple, intersection points (solutions) amber;
 * b² − 4ac > 0 green, = 0 amber, < 0 red (as in Unit 5 Lesson 8). */
import {
  h, tex, add, box, Graph, stamp, stampIn, mountExplainers, pop, fadeIn, tween, svgEl, pulse, COLORS, texNum, rightMark
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const PB = COLORS.blue, LN = COLORS.purple, PT = COLORS.amber, INK = COLORS.ink;
const kindOf = (D, tol = 1e-9) => (Math.abs(D) <= tol ? 1 : D > 0 ? 2 : 0);
const KCLS = { 2: 'u8l1-k2', 1: 'u8l1-k1', 0: 'u8l1-k0' };
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; if (el && el.label) el.label.style.opacity = 0; return el; };
const unhide = (el) => { if (el) el.style.opacity = ''; if (el && el.label) el.label.style.opacity = ''; return el; };
const popP = (c, p) => Promise.all([pop(c, unhide(p)), p.label ? show(c, p.label) : null]);
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
const tn = (v) => texNum(v, 2);
const par = (v) => (v < 0 ? `(${tn(v)})` : tn(v));
/* a numbered row for step-by-step procedures (the step number beside each step as it appears); n = '' for no number */
const row = (host, n, html) => { const r = h('div', 'u8l1-row', `<span class="u8l1-n">${n}</span><div class="u8l1-rc">${html}</div>`); r.style.opacity = 0; host.appendChild(r); return r; };
/* polynomial a x² + b x + c in TeX (numbers to 2 decimals) */
const term = (co, v, first) => { if (Math.abs(co) < 1e-12) return ''; const s = co < 0 ? '-' : first ? '' : '+', m = Math.abs(co); return s + (Math.abs(m - 1) < 1e-12 && v ? '' : tn(m)) + v; };
const poly = (a, b, c) => (term(a, 'x^2', true) + term(b, 'x', !a) + term(c, '', !a && !b)) || '0';
const lineTex = (m, k) => { const s = term(m, 'x', true) + term(k, '', !m); return s || '0'; };
const coordTex = (x, y) => {
  const ex = (v) => Math.abs(v - Math.round(v * 100) / 100) < 1e-9;
  return (ex(x) && ex(y) ? '' : '\\approx') + `(${tn(x)},\\ ${tn(y)})`;
};
/* Ryan's X for "find the two numbers": ac on top, b underneath, the two numbers on the sides; the factor pairs of ac
 * listed beside, the right pair circled. pairs: [[p, q]…]; right: index of the right pair. */
const mm = (v) => String(v).replace('-', '−');
function xBox(ac, b, pairs, right) {
  const [p, q] = pairs[right];
  const X = `<svg class="u8l1-x" width="150" height="84" viewBox="0 0 150 84" aria-hidden="true"><line x1="44" y1="8" x2="106" y2="76"/><line x1="106" y1="8" x2="44" y2="76"/>`
    + `<text x="75" y="24" class="u8l1-xt">${mm(ac)}</text><text x="75" y="78" class="u8l1-xt u8l1-xb">${mm(b)}</text>`
    + `<text x="38" y="49" class="u8l1-xs" text-anchor="end">${mm(p)}</text><text x="112" y="49" class="u8l1-xs" text-anchor="start">${mm(q)}</text></svg>`;
  const L = pairs.map(([u, v], i) => `<span class="u8l1-fp${i === right ? ' u8l1-fpok' : ''}">${T(`${u},\\ ${v}`)}</span>`).join('');
  return `<div class="u8l1-xrow">${X}<div class="u8l1-fps"><span class="u8l1-fph">factor pairs of ${T(String(ac))}</span>${L}</div></div>`;
}
/* a pulsing ring (the tangent moment) */
const glowRing = (layer) => { const g = svgEl('circle', { r: 17, class: 'u8l1-glow' }, layer); g.style.display = 'none'; return g; };
const placeRing = (ring, G, x, y, on) => { const [px, py] = G.toPx(x, y); ring.setAttribute('cx', px); ring.setAttribute('cy', py); ring.style.display = on && G.inside(x, y) ? '' : 'none'; };

/* =============================== explainer: substitution, step by step (Example 3) =============================== */
const SUB = {
  a: {
    ask: `Example 3(a): solve the system ${T('y=x^2+2x-5')} and ${T('y=3x+1')}.`,
    f: (x) => x * x + 2 * x - 5, g: (x) => 3 * x + 1, win: { xmin: -5, xmax: 5, ymin: -8, ymax: 12 }, ylabels: 4,
    pts: [[3, 10, '(3,10)', 'w'], [-2, -5, '(-2,-5)', 'se']],
    rows: [
      `The linear equation is already solved for ${T('y')}: ${T('y=3x+1')}`,
      `Substitute ${T('3x+1')} for ${T('y')}: &ensp;${T('x^2+2x-5=3x+1')}`,
      `Standard form: ${T('x^2-x-6=0')}. Two numbers that multiply to ${T('-6')} and add to ${T('-1')}:`
        + xBox(-6, -1, [[1, -6], [-1, 6], [2, -3], [-2, 3]], 2) + `${T('(x-3)(x+2)=0')}, so ${T('x=3')} or ${T('x=-2')}`,
      `Into the <b>linear</b> equation: ${T('y=3(3)+1=10')} and ${T('y=3(-2)+1=-5')}`,
      `Verify ${T('(3,10)')}: ${T('9+6-5=10')} ✓ and ${T('3(3)+1=10')} ✓. &ensp;Solutions: ${T('\\boldsymbol{(3,10)}')} and ${T('\\boldsymbol{(-2,-5)}')}`
    ],
    caps: [
      `<b>Step 1.</b> Get the linear equation as ${T('y=\\dots')}. Here it already is.`,
      `<b>Step 2.</b> Both expressions equal ${T('y')}, so they equal each other. Now there is only ${T('x')}.`,
      `<b>Step 3.</b> Standard form, then factor with the X: ${T('-3')} and ${T('2')}. Two ${T('x')}-values, so two points.`,
      `<b>Step 4.</b> Each ${T('x')} goes into the <b>line</b> to give its ${T('y')}. Those are the two points where the graphs meet.`,
      `<b>Step 5.</b> Verify in <b>both</b> equations. Solutions ${T('(3,10)')} and ${T('(-2,-5)')}.`
    ]
  },
  b: {
    ask: `Example 3(b): solve the system ${T('y=2x^2+x-4')} and ${T('4x-y=2')}.`,
    f: (x) => 2 * x * x + x - 4, g: (x) => 4 * x - 2, win: { xmin: -3, xmax: 4, ymin: -6, ymax: 10 }, ylabels: 2,
    pts: [[2, 6, '(2,6)', 'w'], [-0.5, -4, '\\left(-\\frac12,-4\\right)', 'se']],
    rows: [
      `Solve the linear equation for ${T('y')}: ${T('4x-y=2\\Rightarrow y=4x-2')}`,
      `Substitute ${T('4x-2')} for ${T('y')}: &ensp;${T('2x^2+x-4=4x-2')}`,
      `Standard form: ${T('2x^2-3x-2=0')}. ${T('ac=-4')}, ${T('b=-3')}:`
        + xBox(-4, -3, [[1, -4], [-1, 4], [2, -2]], 0) + `${T('(2x+1)(x-2)=0')}, so ${T('x=-\\frac12')} or ${T('x=2')}`,
      `Into the <b>linear</b> equation: ${T('y=4\\left(-\\tfrac12\\right)-2=-4')} and ${T('y=4(2)-2=6')}`,
      `Verify ${T('(2,6)')}: ${T('2(4)+2-4=6')} ✓ and ${T('4(2)-6=2')} ✓. &ensp;Solutions: ${T('\\boldsymbol{\\left(-\\frac12,-4\\right)}')} and ${T('\\boldsymbol{(2,6)}')}`
    ],
    caps: [
      `<b>Step 1.</b> The line is not in ${T('y=')} form yet: solve ${T('4x-y=2')} for ${T('y')}.`,
      `<b>Step 2.</b> Replace ${T('y')} in the quadratic with ${T('4x-2')}.`,
      `<b>Step 3.</b> Standard form. The X gives ${T('1')} and ${T('-4')}: ${T('2x^2-4x+x-2')} groups to ${T('(2x+1)(x-2)')}.`,
      `<b>Step 4.</b> Each ${T('x')} into the <b>line</b> gives its ${T('y')}: the two meeting points.`,
      `<b>Step 5.</b> Verify, and write ordered pairs: ${T('\\left(-\\frac12,-4\\right)')} and ${T('(2,6)')}.`
    ]
  },
  c: {
    ask: `Example 3(c): solve the system ${T('y=x^2-4x+1')} and ${T('y=2x-3')} exactly (the system of Example 2).`,
    f: (x) => x * x - 4 * x + 1, g: (x) => 2 * x - 3, win: { xmin: -2, xmax: 7, ymin: -4, ymax: 10 }, ylabels: 2,
    pts: [[3 + Math.sqrt(5), 3 + 2 * Math.sqrt(5), '(3+\\sqrt5,\\ 3+2\\sqrt5)', 'w'], [3 - Math.sqrt(5), 3 - 2 * Math.sqrt(5), '(3-\\sqrt5,\\ 3-2\\sqrt5)', 'se']],
    rows: [
      `The linear equation is already solved for ${T('y')}: ${T('y=2x-3')}`,
      `Substitute ${T('2x-3')} for ${T('y')}: &ensp;${T('x^2-4x+1=2x-3')}`,
      `Standard form: ${T('x^2-6x+4=0')} does not factor. Quadratic formula:<br>${T('x=\\dfrac{6\\pm\\sqrt{36-16}}{2}=\\dfrac{6\\pm2\\sqrt5}{2}=3\\pm\\sqrt5')}`,
      `Into the <b>linear</b> equation: ${T('y=2(3\\pm\\sqrt5)-3=3\\pm2\\sqrt5')}`,
      `Solutions: ${T('\\boldsymbol{(3+\\sqrt5,\\ 3+2\\sqrt5)}')} and ${T('\\boldsymbol{(3-\\sqrt5,\\ 3-2\\sqrt5)}')}, about ${T('(5.24,\\ 7.47)')} and ${T('(0.76,\\ -1.47)')}`
    ],
    caps: [
      `<b>Step 1.</b> The line is already ${T('y=2x-3')}.`,
      `<b>Step 2.</b> Set the two expressions for ${T('y')} equal.`,
      `<b>Step 3.</b> No two integers multiply to ${T('4')} and add to ${T('-6')}, so use the quadratic formula: ${T('x=3\\pm\\sqrt5')}.`,
      `<b>Step 4.</b> Into the <b>line</b>: ${T('y=3\\pm2\\sqrt5')}. Keep the ${T('+')} with the ${T('+')} and the ${T('-')} with the ${T('-')}.`,
      `<b>Step 5.</b> Exact answers. They round to Example 2’s calculator answers, ${T('(5.2,\\ 7.5)')} and ${T('(0.8,\\ -1.5)')}.`
    ]
  }
};
const sub = {
  title: 'Substitution, step by step',
  height: 470, minW: 900, capH: 84,
  choices: [{ v: 'a', label: 'Example 3(a)' }, { v: 'b', label: 'Example 3(b)' }, { v: 'c', label: 'Example 3(c)' }],
  ask: (v) => SUB[v].ask,
  make(stage, v, ex) {
    const D = SUB[v], W = ex.W, GW = 350, RW = W - GW - 24;
    const R = div(stage, 'u8l1-rows', '', 0, 0, RW);
    const rows = D.rows.map((html, i) => row(R, i + 1, html));
    const G = new Graph(stage, Object.assign({ x: W - GW, y: 2, width: GW, height: 464, fontSize: 14, ylabels: D.ylabels, pad: [26, 16, 16, 16] }, D.win));
    G.fn(D.f, { color: PB, width: 3.5 });
    G.fn(D.g, { color: LN, width: 3.5 });
    const pts = D.pts.map(([x, y, lab, pos]) => hide(G.point(x, y, { color: PT, r: 8, label: T(lab), pos })));
    return D.caps.map((cap, i) => ({
      cap,
      run: async (c) => {
        await show(c, rows[i]);
        if (i === 3) await Promise.all(pts.map((p) => popP(c, p)));
        if (i === 4) await Promise.all(pts.map((p) => pulse(c, p, 1.4)));
      }
    }));
  }
};

/* =============================== explainer: the tunnel beam (Example 4) =============================== */
const tunnel = {
  title: 'The tunnel beam: one point is underground',
  height: 420, minW: 900, capH: 84,
  ask: `Example 4: where does the beam ${T('y=0.5x+1')} meet the arch ${T('y=-0.25x^2+4')}? (metres; the ground is the ${T('x')}-axis)`,
  make(stage, v, ex) {
    const W = ex.W, GW = 540, GX = 0, GY = 4;
    const f = (x) => -0.25 * x * x + 4, g = (x) => 0.5 * x + 1;
    const r = Math.sqrt(13), x1 = -1 + r, x2 = -1 - r, y1 = g(x1), y2 = g(x2);
    const G = new Graph(stage, { x: GX, y: GY, width: GW, height: 410, xmin: -6, xmax: 5, ymin: -3, ymax: 5, fontSize: 14, pad: [26, 16, 16, 16] });
    const under = G.polyline([[-6, 0], [5, 0], [5, -3], [-6, -3]], { closed: true, fill: '#8a6a43', fillOpacity: 0.28, color: 'rgba(0,0,0,0)', width: 0.1 });
    under.style.opacity = 0;
    const archPts = []; for (let i = 0; i <= 60; i++) { const x = -4 + 8 * i / 60; archPts.push([x, f(x)]); }
    G.polyline(archPts.concat([[4, 0], [-4, 0]]), { closed: true, fill: '#d9cfb8', fillOpacity: 0.55, color: 'rgba(0,0,0,0)', width: 0.1 });
    const ground = G.segment([-6, 0], [5, 0], { color: '#6b5432', width: 5 });
    G.fn(f, { from: -4, to: 4, color: PB, width: 4.5, arrows: false });
    G.segment([-2, 0], [x1, y1], { color: LN, width: 4, dash: '12 8' });
    G.label(1.7, 3.5, 'arch', { pos: 'ne', cls: 'u8l1-glab' }); G.label(-5.2, 0.05, 'ground', { pos: 'n', cls: 'u8l1-glab' });
    const extL = G.fn(f, { from: -6, to: -4, color: PB, width: 2.5, dash: '6 6', arrows: false }), extR = G.fn(f, { from: 4, to: 5, color: PB, width: 2.5, dash: '6 6', arrows: false });
    const extB = G.fn(g, { from: -6, to: 5, color: LN, width: 2.5, dash: '4 7', arrows: false });
    [extL, extR, extB].forEach((e) => (e.style.opacity = 0));
    const pA = hide(G.point(x1, y1, { color: PT, r: 8, label: T('(2.61,\\ 2.30)'), pos: 'ne' }));
    const pB = hide(G.point(x2, y2, { color: PT, r: 8, label: T('(-4.61,\\ -1.30)'), pos: 'e' }));
    const R = div(stage, 'u8l1-rows', '', GW + 22, 0, W - GW - 22);
    const rw = [
      `${T('-0.25x^2+4=0.5x+1')}`,
      `${T('-0.25x^2-0.5x+3=0')}; multiply by ${T('-4')}:<br>${T('x^2+2x-12=0')}<br>${T('x=\\dfrac{-2\\pm\\sqrt{52}}{2}=-1\\pm\\sqrt{13}')}`,
      `${T('x\\approx2.61')}: ${T('y=0.5(2.606)+1\\approx2.30')}<br>${T('x\\approx-4.61')}: ${T('y\\approx-1.30')}`,
      `Reject ${T('(-4.61,\\ -1.30)')}: below the ground, where there is no arch.`,
      `The beam meets the arch at about ${T('\\boldsymbol{(2.61,\\ 2.30)}')}.`
    ].map((html) => row(R, '', html));
    const [bx, by] = G.toPx(x2, y2), [ax, ay] = G.toPx(x1, y1);
    const sNo = stamp(stage, 'Under ground', { ok: false, x: GX + bx + 70, y: GY + by + 52, size: 'sm', rotate: -6 }); sNo.style.opacity = 0;
    const sOk = stamp(stage, 'On the arch', { ok: true, x: GX + ax + 4, y: GY + ay - 70, size: 'sm', rotate: -6 }); sOk.style.opacity = 0;
    return [
      { cap: `Both equations give ${T('y')}, so set them equal: the beam’s height and the arch’s height are the same where they meet.`,
        run: (c) => show(c, rw[0]) },
      { cap: `Standard form, and multiply by ${T('-4')} to clear the decimals. It does not factor: the quadratic formula gives ${T('x=-1\\pm\\sqrt{13}')}.`,
        run: (c) => show(c, rw[1]) },
      { cap: `The algebra uses the <b>whole</b> parabola and the <b>whole</b> line, even under the ground. So it finds <b>two</b> points.`,
        run: async (c) => { await Promise.all([extL, extR, extB].map((e) => show(c, e))); await show(c, rw[2]); await Promise.all([popP(c, pA), popP(c, pB)]); } },
      { cap: `The arch is real only above the ground (${T('y\\ge0')}). The point ${T('(-4.61,\\ -1.30)')} is underground: <b>reject</b> it.`,
        run: async (c) => { await show(c, under); await show(c, rw[3]); unhide(sNo); await stampIn(c, sNo); } },
      { cap: `The answer: the beam meets the arch at about ${T('(2.61,\\ 2.30)')}, 2.61 m right of the centre and 2.30 m up.`,
        run: async (c) => { await show(c, rw[4]); unhide(sOk); await stampIn(c, sOk); await pulse(c, pA, 1.4); } }
    ];
  }
};

/* =============================== explainer: elimination, step by step (Example 5) =============================== */
/* each equation as cells in columns, so like terms sit one under the other; yc = the y column */
const ELIM = {
  a: {
    ask: `Example 5(a): solve the system ${T('y=-x^2+4x+5')} and ${T('y=-2x+10')} by elimination.`,
    cols: 6, yc: 1, op: '-', f: (x) => -x * x + 4 * x + 5, g: (x) => -2 * x + 10, win: { xmin: -1, xmax: 7, ymin: -2, ymax: 10 }, ylabels: 2,
    pts: [[1, 8, '(1,8)', 'w'], [5, 0, '(5,0)', 'ne']],
    r1: ['', 'y', '=', '-x^2', '+4x', '+5'], r2: ['', 'y', '=', '', '-2x', '+10'], res: ['', '0', '=', '-x^2', '+6x', '-5'],
    rows: [
      `Like terms in columns. The ${T('y')}-terms <b>match</b>: subtract.`,
      `Subtract the second equation from the first: ${T('y-y=0')}, so ${T('y')} is gone.`,
      `${T('x^2-6x+5=0')}` + xBox(5, -6, [[1, 5], [-1, -5]], 1) + `${T('(x-1)(x-5)=0')}, so ${T('x=1')} or ${T('x=5')}`,
      `${T('y=-2(1)+10=8')}; &ensp;${T('y=-2(5)+10=0')}`,
      `${T('\\boldsymbol{(1,8)}')} and ${T('\\boldsymbol{(5,0)}')}. Check ${T('(5,0)')}: ${T('-25+20+5=0')} ✓`
    ],
    caps: [
      `<b>Step 1.</b> Write the equations one under the other, like terms in the same column. Both have ${T('+y')} on the left.`,
      `<b>Step 2.</b> Subtract, column by column: ${T('-2x')} taken from ${T('4x')} leaves ${T('6x')}, and ${T('10')} from ${T('5')} leaves ${T('-5')}. The ${T('y')}’s cancel.`,
      `<b>Step 3.</b> A quadratic in ${T('x')} alone: multiply by ${T('-1')}, then factor with the X (${T('-1')} and ${T('-5')}).`,
      `<b>Step 4.</b> Each ${T('x')} into the <b>simpler</b> equation, the line, gives its ${T('y')}.`,
      `<b>Step 5.</b> Verify a solution in the other equation: ${T('(5,0)')} works in ${T('y=-x^2+4x+5')} ✓.`
    ]
  },
  b: {
    ask: `Example 5(b): solve the system ${T('x^2+y=7')} and ${T('3x-y=-3')} by elimination.`,
    cols: 6, yc: 3, op: '+', f: (x) => 7 - x * x, g: (x) => 3 * x + 3, win: { xmin: -6, xmax: 3, ymin: -11, ymax: 9 }, ylabels: 4,
    pts: [[-4, -9, '(-4,-9)', 'e'], [1, 6, '(1,6)', 'ne']],
    r1: ['', 'x^2', '', '+y', '=', '7'], r2: ['', '', '3x', '-y', '=', '-3'], res: ['', 'x^2', '+3x', '', '=', '4'],
    rows: [
      `Like terms in columns. The ${T('y')}-terms are <b>opposites</b>: add.`,
      `Add the equations: ${T('y+(-y)=0')}, so ${T('y')} is gone.`,
      `${T('x^2+3x-4=0')}` + xBox(-4, 3, [[1, -4], [-1, 4], [2, -2]], 1) + `${T('(x+4)(x-1)=0')}, so ${T('x=-4')} or ${T('x=1')}`,
      `${T('y=3x+3')}: ${T('y=3(-4)+3=-9')}; &ensp;${T('y=3(1)+3=6')}`,
      `${T('\\boldsymbol{(-4,-9)}')} and ${T('\\boldsymbol{(1,6)}')}. Check: ${T('16+(-9)=7')} ✓, ${T('1+6=7')} ✓`
    ],
    caps: [
      `<b>Step 1.</b> Stack the equations with like terms in columns. One has ${T('+y')}, the other ${T('-y')}.`,
      `<b>Step 2.</b> Add, column by column: ${T('+y')} and ${T('-y')} cancel, leaving ${T('x^2+3x=4')}.`,
      `<b>Step 3.</b> Standard form, then the X: ${T('-1')} and ${T('4')} multiply to ${T('-4')} and add to ${T('3')}.`,
      `<b>Step 4.</b> ${T('3x-y=-3')} rearranges to ${T('y=3x+3')}: each ${T('x')} gives its ${T('y')}.`,
      `<b>Step 5.</b> Check both points in ${T('x^2+y=7')} ✓.`
    ]
  }
};
const elim = {
  title: 'Elimination, step by step',
  height: 456, minW: 900, capH: 84,
  choices: [{ v: 'a', label: 'Example 5(a): subtract' }, { v: 'b', label: 'Example 5(b): add' }],
  ask: (v) => ELIM[v].ask,
  make(stage, v, ex) {
    const D = ELIM[v], W = ex.W, SW = 370;
    const S = div(stage, 'u8l1-stk', '', 0, 0, SW);
    S.style.gridTemplateColumns = `44px repeat(${D.cols - 1}, auto)`;
    const mk = (cells, cls, op) => cells.map((t, i) => { const d = h('div', 'u8l1-sc ' + cls + (i === D.yc ? ' u8l1-sy' : ''), i === 0 ? (op ? `<span class="u8l1-op">${op === '-' ? '−' : op}</span>` : '') : t ? T(t) : ''); S.appendChild(d); return d; });
    const c1 = mk(D.r1, 'u8l1-s1'), c2 = mk(D.r2, 'u8l1-s2', D.op);
    const bar = h('div', 'u8l1-sbar'); bar.style.gridColumn = `1 / span ${D.cols}`; S.appendChild(bar);
    const c3 = mk(D.res, 'u8l1-s3');
    c3.forEach((d) => (d.style.opacity = 0)); bar.style.opacity = 0; c2[0].style.opacity = 0;
    const R = div(stage, 'u8l1-rows', '', SW + 22, 0, W - SW - 22);
    const rows = D.rows.map((html, i) => row(R, i + 1, html));
    const G = new Graph(stage, Object.assign({ x: 0, y: 206, width: SW, height: 248, fontSize: 13, ylabels: D.ylabels, xlabels: 1, pad: [24, 14, 14, 14] }, D.win));
    G.fn(D.f, { color: PB, width: 3 }); G.fn(D.g, { color: LN, width: 3 });
    const pts = D.pts.map(([x, y, lab, pos]) => hide(G.point(x, y, { color: PT, r: 7, label: T(lab), pos })));
    return D.caps.map((cap, i) => ({
      cap,
      run: async (c) => {
        if (i === 0) { await show(c, rows[0]); await Promise.all([pulse(c, c1[D.yc], 1.25), pulse(c, c2[D.yc], 1.25)]); return; }
        if (i === 1) {
          await show(c, c2[0]); await show(c, bar);
          c1[D.yc].classList.add('u8l1-gone'); c2[D.yc].classList.add('u8l1-gone');
          await pulse(c, c2[D.yc], 1.2);
          for (const d of c3) if (d.innerHTML) await show(c, d); else d.style.opacity = '';
          await show(c, rows[1]); return;
        }
        await show(c, rows[i]);
        if (i === 3) await Promise.all(pts.map((p) => popP(c, p)));
        if (i === 4) await Promise.all(pts.map((p) => pulse(c, p, 1.4)));
      }
    }));
  }
};

/* =============================== explainer: slide and tilt the line (STAR, hands-on) =============================== */
/* the parabola y = A x² + B0 x + C0 and the line y = m x + k; the combined equation A x² + (B0 − m) x + (C0 − k) = 0 */
const TILT = {
  e1: {
    ask: `Example 1 as one moving picture: the parabola ${T('y=x^2-2x-3')} and the line ${T('y=-2x+k')}. Then tilt it.`,
    A: 1, B0: -2, C0: -3, m: -2, k: 1, win: { xmin: -4, xmax: 6, ymin: -8, ymax: 10 }, ylabels: 2,
    steps: [
      [{ m: -2, k: 1 }, `${T('y=-2x+1')}: ${T('x^2-2x-3=-2x+1')} gives ${T('x^2-4=0')}. ${T('b^2-4ac=0^2-4(1)(-4)=16')}, positive: <b>two</b> points, ${T('(-2,5)')} and ${T('(2,-3)')}.`],
      [{ m: -2, k: -3 }, `Slide down to ${T('y=-2x-3')}: ${T('x^2=0')} and ${T('b^2-4ac=0')}. The two points <b>merge</b> into one, ${T('(0,-3)')}: the line is <b>tangent</b>.`],
      [{ m: -2, k: -6 }, `Further down, ${T('y=-2x-6')}: ${T('x^2+3=0')} and ${T('b^2-4ac=-12')}, negative. The line <b>misses</b>: no solution.`],
      [{ m: 1, k: -3 }, `Now <b>tilt</b> instead: keep ${T('k=-3')} and change the slope. Only the slope ${T('-2')} just touches; at ${T('m=1')} the line cuts through twice, at ${T('(0,-3)')} and ${T('(3,0)')}.`]
    ]
  },
  e7a: {
    ask: `Example 7(a): the line ${T('y=2x+k')} and the parabola ${T('y=x^2-4x+3')}. Two points, one or none?`,
    A: 1, B0: -4, C0: 3, m: 2, k: 0, win: { xmin: -3, xmax: 8, ymin: -10, ymax: 12 }, ylabels: 2,
    steps: [
      [{ m: 2, k: 0 }, `The combined equation is ${T('x^2-6x+(3-k)=0')}, so ${T('b^2-4ac=36-4(3-k)=24+4k')}. At ${T('k=0')} it is ${T('24')}: <b>two</b> points.`],
      [{ m: 2, k: -6 }, `Slide down to ${T('k=-6')}: ${T('24+4(-6)=0')}. One point, ${T('(3,0)')}: the <b>tangent</b> line.`],
      [{ m: 2, k: -9 }, `${T('k=-9')}: ${T('24+4(-9)=-12<0')}, no points. Below ${T('k=-6')} the line always misses; above it, it always cuts twice.`]
    ]
  },
  e7b: {
    ask: `Example 7(b): which slopes make the line ${T('y=mx-1')} tangent to the parabola ${T('y=x^2+3')}?`,
    A: 1, B0: 0, C0: 3, m: 0, k: -1, win: { xmin: -5, xmax: 5, ymin: -4, ymax: 22 }, ylabels: 4,
    steps: [
      [{ m: 0, k: -1 }, `The line always passes through ${T('(0,-1)')}. Flat, ${T('m=0')}: ${T('x^2+4=0')}, ${T('b^2-4ac=-16')}. It misses.`],
      [{ m: 4, k: -1 }, `Tilt up to ${T('m=4')}: ${T('x^2-4x+4=0')}, ${T('b^2-4ac=16-16=0')}. <b>Tangent</b> at ${T('(2,7)')}.`],
      [{ m: 5, k: -1 }, `Steeper, ${T('m=5')}: ${T('b^2-4ac=25-16=9')}, positive. It cuts through twice.`],
      [{ m: -4, k: -1 }, `Tilt the other way to ${T('m=-4')}: tangent again, at ${T('(-2,7)')}. Two tangent slopes, because ${T('m^2-16=0')} gives ${T('m=\\pm4')}.`]
    ]
  }
};
const VERD = {
  2: `<b>Two solutions</b><span>the line crosses the parabola twice</span>`,
  1: `<b>One solution</b><span>the line is tangent</span>`,
  0: `<b>No solution</b><span>the line misses the parabola</span>`
};
const tilt = {
  title: 'Slide and tilt the line',
  height: 470, minW: 900, tap: false, capH: 96,
  choices: [{ v: 'e1', label: 'Example 1: slide' }, { v: 'e7a', label: 'Example 7(a): y = 2x + k' }, { v: 'e7b', label: 'Example 7(b): tilt' }],
  ask: (v) => TILT[v].ask,
  make(stage, v, ex) {
    const C = TILT[v], W = ex.W, GW = 430, PX = GW + 22, PW = W - PX;
    const S = { m: C.m, k: C.k };
    const G = new Graph(stage, Object.assign({ x: 0, y: 4, width: GW, height: 462, fontSize: 14, ylabels: C.ylabels, pad: [28, 16, 16, 16] }, C.win));
    const f = (x) => C.A * x * x + C.B0 * x + C.C0;
    G.fn(f, { color: PB, width: 4 });
    const ln = G.fn((x) => S.m * x + S.k, { color: LN, width: 4 });
    const ring = glowRing(G.layers.top);
    const p1 = G.point(0, 0, { color: PT, r: 8.5, label: '', pos: 'nw' }), p2 = G.point(0, 0, { color: PT, r: 8.5, label: '', pos: 'se' });
    const P = div(stage, 'u8l1-pn', '', PX, 0, PW);
    const eqs = h('div', 'u8l1-eqs', `<div><span class="u8l1-pb">parabola</span>&ensp;${T(`y=${poly(C.A, C.B0, C.C0)}`)}</div><div><span class="u8l1-ln">line</span>&ensp;<span class="u8l1-leq"></span></div>`);
    P.appendChild(eqs);
    const leq = eqs.querySelector('.u8l1-leq');
    const mkSl = (name, lo, hi, lab) => {
      const sl = h('label', 'u8l1-sl no-ink', `<span class="u8l1-sll">${lab}</span><input type="range" min="${lo}" max="${hi}" step="0.25" aria-label="${name}"><span class="u8l1-slv"></span>`);
      sl.setAttribute('data-tap', ''); return sl;
    };
    const sls = h('div', 'u8l1-sls'); P.appendChild(sls);
    const slM = mkSl('the slope m', -6, 6, `slope ${T('m')}`), slK = mkSl('the y-intercept k', -10, 8, `${T('y')}-intercept ${T('k')}`);
    sls.append(slM, slK);
    const inM = slM.querySelector('input'), inK = slK.querySelector('input'), vM = slM.querySelector('.u8l1-slv'), vK = slK.querySelector('.u8l1-slv');
    const dbox = h('div', 'u8l1-dbox', '<div class="u8l1-dl1"></div><div class="u8l1-dl2"></div><div class="u8l1-dl3"></div>'); P.appendChild(dbox);
    const [dl1, dl2, dl3] = dbox.children;
    const MW = PW, MH = 50, Dlo = -30, Dhi = 30, mx = (D) => 16 + (D - Dlo) / (Dhi - Dlo) * (MW - 32);
    const M = svgEl('svg', { width: MW, height: MH, viewBox: `0 0 ${MW} ${MH}`, class: 'u8l1-meter' }, P);
    svgEl('rect', { x: 16, y: 22, width: mx(0) - 16, height: 12, rx: 6, fill: COLORS.red, opacity: 0.85 }, M);
    svgEl('rect', { x: mx(0), y: 22, width: MW - 16 - mx(0), height: 12, rx: 6, fill: COLORS.green, opacity: 0.85 }, M);
    svgEl('rect', { x: mx(0) - 3, y: 16, width: 6, height: 24, rx: 3, fill: COLORS.amber }, M);
    [['b² − 4ac < 0', 16, 'start'], ['0', mx(0), 'middle'], ['b² − 4ac > 0', MW - 16, 'end']].forEach(([t, x, a]) => { const e = svgEl('text', { x, y: 49, 'text-anchor': a, class: 'u8l1-mt' }, M); e.textContent = t; });
    const needle = svgEl('path', { d: 'M0 19 L-8 3 L8 3 Z', fill: INK }, M);
    const verd = h('div', 'u8l1-verd'); P.appendChild(verd);
    const upd = () => {
      const m = S.m, k = S.k, A = C.A, B = C.B0 - m, Cc = C.C0 - k;
      const D = Math.round((B * B - 4 * A * Cc) * 10000) / 10000, kd = kindOf(D);
      ln._bkDraw();
      if (kd === 2) {
        const s = Math.sqrt(D), xa = (-B - s) / (2 * A), xb = (-B + s) / (2 * A);
        G.moveTo(p1, xa, m * xa + k); G.moveTo(p2, xb, m * xb + k); unhide(p1); unhide(p2);
        p1.label.innerHTML = T(coordTex(xa, m * xa + k)); p2.label.innerHTML = T(coordTex(xb, m * xb + k));
      } else if (kd === 1) {
        const x0 = -B / (2 * A); G.moveTo(p1, x0, m * x0 + k); unhide(p1); hide(p2); p1.label.innerHTML = T(coordTex(x0, m * x0 + k));
      } else { hide(p1); hide(p2); }
      placeRing(ring, G, p1.gx, p1.gy, kd === 1);
      leq.innerHTML = T(`y=${lineTex(m, k)}`);
      inM.value = m; inK.value = k; vM.textContent = tn(m).replace('-', '−'); vK.textContent = tn(k).replace('-', '−');
      dl1.innerHTML = T(`${poly(C.A, C.B0, C.C0)}=${lineTex(m, k)}`);
      dl2.innerHTML = T(`${poly(A, B, Cc)}=0`);
      dl3.innerHTML = `${T(`b^2-4ac=${par(B)}^2-4(${tn(A)})(${tn(Cc)})=`)}<b class="u8l1-dv">${T(tn(D))}</b>`;
      needle.setAttribute('transform', `translate(${mx(Math.max(Dlo, Math.min(Dhi, D)))} 0)`);
      verd.innerHTML = VERD[kd];
      stage.classList.remove('u8l1-k0', 'u8l1-k1', 'u8l1-k2'); stage.classList.add(KCLS[kd]);
    };
    inM.addEventListener('input', () => { S.m = parseFloat(inM.value); upd(); });
    inK.addEventListener('input', () => { S.k = parseFloat(inK.value); upd(); });
    upd();
    const snap = (v) => Math.round(v * 20) / 20;
    const go = (c, to, ms) => { const m0 = S.m, k0 = S.k; return tween(c, ms, (u) => { S.m = u >= 1 ? to.m : snap(m0 + (to.m - m0) * u); S.k = u >= 1 ? to.k : snap(k0 + (to.k - k0) * u); upd(); }); };
    const steps = C.steps.map(([to, cap], i) => ({ cap, run: async (c) => { await go(c, to, i ? 1500 : 500); await pulse(c, verd, 1.05); } }));
    steps.push({ cap: `<b>Your turn:</b> drag the sliders. The sign of ${T('b^2-4ac')} and the number of meeting points always change together; at ${T('0')} the line is tangent.`,
      run: async (c) => { await Promise.all([pulse(c, slM, 1.05), pulse(c, slK, 1.05)]); } });
    return steps;
  }
};

/* =============================== explainer: a line and a circle (Example 8) =============================== */
const circle = {
  title: 'A line and a circle',
  height: 452, minW: 900, capH: 90,
  ask: `Example 8: the circle ${T('x^2+y^2=20')}, the line ${T('y=2x')} and the line ${T('x+2y=10')}.`,
  make(stage, v, ex) {
    const W = ex.W, GW = 448, R2 = 20, r = Math.sqrt(R2);
    const S = { c: 0, on: false };
    const G = new Graph(stage, { x: 0, y: 2, width: GW, height: 448, xmin: -6, xmax: 6, ymin: -6, ymax: 6, fontSize: 14, xlabels: 2, ylabels: 2, pad: [26, 16, 16, 16] });
    const cpts = []; for (let i = 0; i <= 160; i++) { const t = 2 * Math.PI * i / 160; cpts.push([r * Math.cos(t), r * Math.sin(t)]); }
    const circ = G.polyline(cpts, { closed: true, color: PB, width: 4 });
    const O = G.point(0, 0, { color: INK, r: 5 });
    const rad = G.segment([0, 0], [2, 4], { color: COLORS.red, width: 3.5 }), legs = G.polyline([[0, 0], [2, 0], [2, 4]], { color: COLORS.slate, width: 2.5, dash: '6 5' });
    const l2 = G.label(1, 0, T('2'), { pos: 's', cls: 'u8l1-glab' }), l4 = G.label(2, 2, T('4'), { pos: 'e', cls: 'u8l1-glab' }), lr = G.label(0.9, 2.1, T('\\sqrt{20}'), { pos: 'nw', cls: 'u8l1-glab u8l1-rlab' });
    const P0 = G.point(2, 4, { color: PT, r: 8, label: T('(2,4)'), pos: 'ne' });
    const la = G.fn((x) => 2 * x, { color: LN, width: 4 });
    const P1 = G.point(-2, -4, { color: PT, r: 8, label: T('(-2,-4)'), pos: 'se' });
    const lb = G.fn((x) => (S.c - x) / 2, { color: LN, width: 4 });
    const q1 = G.point(0, 0, { color: PT, r: 8 }), q2 = G.point(0, 0, { color: PT, r: 8 });
    const ring = glowRing(G.layers.top);
    const rm = svgEl('g', {}, G.layers.top);
    [circ, rad, legs, l2, l4, lr, la, lb, rm].forEach((e) => (e.style.opacity = 0)); [O, P0, P1, q1, q2].forEach(hide);
    const P = div(stage, 'u8l1-pn', '', GW + 24, 0, W - GW - 24);
    const pnl = [
      `${T('x^2+y^2=20')}: centre ${T('(0,0)')}, radius ${T('r=\\sqrt{20}\\approx4.47')}<br>${T('(2,4)')}: ${T('2^2+4^2=4+16=20')} ✓`,
      `<b>(a)</b> ${T('y=2x')}: ${T('x^2+(2x)^2=20')}<br>${T('5x^2=20,\\ x^2=4,\\ x=\\pm2')}<br>${T('y=2x')}: ${T('(2,4)')} and ${T('(-2,-4)')}`,
      `<b>(b)</b> <span class="u8l1-live"></span>`,
      `${T('x=10-2y')}: ${T('(10-2y)^2+y^2=20')}<br>${T('5y^2-40y+80=0\\Rightarrow y^2-8y+16=0')}<br>discriminant ${T('64-64=0')}: tangent at ${T('(2,4)')}`
    ].map((html) => { const d = h('div', 'u8l1-cbox', html); d.style.opacity = 0; P.appendChild(d); return d; });
    const live = pnl[2].querySelector('.u8l1-live');
    const upd = () => {
      const c = S.c, D = 400 - 4 * c * c, kd = kindOf(Math.round(D * 1e6) / 1e6);
      lb._bkDraw();
      if (!S.on) { hide(q1); hide(q2); }
      else if (kd === 2) { const s = Math.sqrt(D), ya = (4 * c + s) / 10, yb = (4 * c - s) / 10; G.moveTo(q1, c - 2 * ya, ya); G.moveTo(q2, c - 2 * yb, yb); unhide(q1); unhide(q2); }
      else if (kd === 1) { const y0 = 0.4 * c; G.moveTo(q1, c - 2 * y0, y0); unhide(q1); hide(q2); }
      else { hide(q1); hide(q2); }
      placeRing(ring, G, q1.gx, q1.gy, kd === 1 && lb.style.opacity !== '0');
      live.innerHTML = `${T(`x+2y=${tn(c)}`)}: <b class="${KCLS[kd]}">${kd === 2 ? 'two points' : kd === 1 ? 'one point (tangent)' : 'no points'}</b>`;
    };
    upd();
    const go = (c, to, ms) => { const c0 = S.c; return tween(c, ms, (u) => { S.c = u >= 1 ? to : Math.round((c0 + (to - c0) * u) * 20) / 20; upd(); }); };
    const drawRM = () => { rm.innerHTML = ''; const V = G.toPx(2, 4), Pp = G.toPx(1.2, 2.4), Q = G.toPx(4, 3); rightMark(rm, V, Pp, Q, 16, { color: COLORS.slate }); };
    drawRM();
    return [
      { cap: `By the Pythagorean theorem, ${T('x^2+y^2=20')} says the point ${T('(x,y)')} is ${T('\\sqrt{20}')} from the origin: a <b>circle</b>. For ${T('(2,4)')}, ${T('2^2+4^2=20')}.`,
        run: async (c) => { await show(c, circ); await pop(c, unhide(O)); await Promise.all([show(c, legs), show(c, rad), show(c, l2), show(c, l4), show(c, lr)]); await popP(c, P0); await show(c, pnl[0]); } },
      { cap: `<b>(a)</b> Substitute ${T('y=2x')} into the circle: ${T('5x^2=20')}, so ${T('x=\\pm2')}. A line through the centre always meets the circle <b>twice</b>.`,
        run: async (c) => { await Promise.all([show(c, la), show(c, pnl[1])]); [legs, l2, l4, lr].forEach((e) => (e.style.opacity = 0)); await popP(c, P1); } },
      { cap: `<b>(b)</b> The line ${T('x+2y=c')} starts through the centre at ${T('c=0')} and slides out. Its two points move together…`,
        run: async (c) => { la.style.opacity = 0.25; hide(P1); S.on = true; upd(); await Promise.all([show(c, lb), show(c, pnl[2])]); await go(c, 7, 1400); } },
      { cap: `…and <b>merge</b> at ${T('c=10')}: ${T('x+2y=10')} touches the circle only at ${T('(2,4)')}. The resulting equation has discriminant ${T('0')}, so the line is <b>tangent</b>.`,
        run: async (c) => { await go(c, 10, 1300); await show(c, pnl[3]); await pulse(c, P0, 1.3); } },
      { cap: `A nice extra: the tangent at ${T('(2,4)')} is <b>perpendicular</b> to the radius there. Slide past ${T('c=10')} and the line misses (no points), then back to the tangent.`,
        run: async (c) => { await show(c, rm); await go(c, 12.5, 1100); await go(c, 10, 900); } }
    ];
  }
};

/* =============================== Stand Up Break =============================== */
const lin = (m, n) => { const s = (m === 0 ? '' : m === 1 ? 'x' : m === -1 ? '-x' : m + 'x') + (n === 0 ? '' : (n > 0 && m !== 0 ? '+' : '') + n); return s || '0'; };
const quad = (a, b, c) => poly(a, b, c);
const fac = (v) => (v > 0 ? `(x-${v})` : v < 0 ? `(x+${-v})` : 'x');
standup('u8l1', {
  intro: 'At your whiteboard: substitute the line into the parabola, standard form first, then solve or use b² − 4ac.',
  levels: {
    BEG: (r) => {
      for (;;) {
        const r1 = r.int(-5, 5), r2 = r.int(-5, 5), m = r.int(-4, 4), n = r.int(-6, 6);
        if (r1 >= r2) continue;
        const p = m - (r1 + r2), q = n + r1 * r2;
        return { text: 'Solve the system by substitution.', q: `y=${quad(1, p, q)}\\qquad y=${lin(m, n)}`,
          a: [`${quad(1, p, q)}=${lin(m, n)}`, `${quad(1, p - m, q - n)}=0`, `${fac(r1)}${fac(r2)}=0`,
            `x=${r1}:\\ y=${m * r1 + n},\\quad x=${r2}:\\ y=${m * r2 + n}`,
            `(${r1},\\ ${m * r1 + n})\\text{ and }(${r2},\\ ${m * r2 + n})`] };
      }
    },
    PRG: (r) => {
      const a = r.pick([1, 2, 3, -1, -2]), m = r.int(-5, 5), n = r.int(-6, 6), want = r.pick([0, 1, 2, 2]);
      let b, c;
      if (want === 1) { const t = r.int(-3, 3); b = m - 2 * a * t; c = n + a * t * t; }
      else { b = r.int(-6, 6); c = r.int(-6, 6); }
      const B = b - m, C = c - n, D = B * B - 4 * a * C, kd = D > 0 ? 2 : D === 0 ? 1 : 0;
      return { text: 'Without solving, determine the number of solutions of the system.', q: `y=${quad(a, b, c)}\\qquad y=${lin(m, n)}`,
        a: [`${quad(a, B, C)}=0`, `b^2-4ac=${B < 0 ? `(${B})` : B}^2-4(${a})(${C})=${D}`, `\\text{${['no solution', 'one solution (tangent)', 'two solutions'][kd]}}`] };
    },
    MAS: (r) => {
      for (;;) {
        const b = r.int(-6, 6), c = r.int(-4, 8), m = r.int(-5, 5), d = b - m;
        if (d % 2 || d === 0) continue;
        const k = c - d * d / 4, x0 = -d / 2, y0 = m * x0 + k;
        return { text: 'Determine the value of <i>k</i> for which the line is tangent to the parabola, and the point of tangency. For which values of <i>k</i> are there two solutions?',
          q: `y=${quad(1, b, c)}\\qquad y=${m === 0 ? '' : m === 1 ? 'x' : m === -1 ? '-x' : m + 'x'}+k`,
          a: [`x^2${term(d, 'x')}+(${c}-k)=0`, `b^2-4ac=${d * d}-4(${c}-k)=0\\Rightarrow k=${k}`,
            `x=${x0},\\ y=${y0}:\\ (${x0},\\ ${y0})`, `\\text{two solutions: }${d * d}-4(${c}-k)>0\\Rightarrow k>${k}`] };
      }
    }
  }
});

/* =============================== mount =============================== */
export const explainers = mountExplainers({ sub, tunnel, elim, tilt, circle });
export const _test = { poly, lineTex, coordTex, TILT };
