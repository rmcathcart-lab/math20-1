/* Math 20-1 · Unit 5 · Lesson 8 — The Discriminant.
 * New lesson format (2026-11-11): the warm-up ("The Doughnut Line") is plain markup on the page (no code). Explainers:
 *   slide   (STAR, hands-on: Example 1 as one moving picture. A slider for c moves y = x² − 4x + c up and down while
 *            b² − 4ac = 16 − 4c, a sign meter, the formula's roots and the verdict update live; the two roots slide
 *            together and merge, and the vertex lights up at the tangent moment c = 4),
 *   machine (Example 2: the "b² − 4ac machine" reads a, b, c from standard form, computes, and drops each equation into
 *            the > 0 / = 0 / < 0 bin with a little graph of it showing the x-intercepts),
 *   ratirr  (the procedure, numbered 1–4: discriminant, perfect square? on a ladder of squares, factor with the X
 *            (ac on top, b underneath, factor pairs beside with the right pair circled), solve; Example 3 (a)–(c)),
 *   sweep   (finding k, numbered 1–3: b² − 4ac in terms of k, solve the boundary / inequality (the flip), then sweep k
 *            along a number line that paints itself green / amber / red while the parabola moves; Examples 4 and 5(a)),
 *   ball    (Example 7: the ball flies beside its graph; a target line h = H moves with b² − 4ac = 420 − 20H live:
 *            never (a), twice (b), and the line sliding down until it just touches the top (c), the maximum).
 * Colours: b² − 4ac > 0 green, = 0 amber, < 0 red; the curve blue; roots (zeros) amber dots; a target line purple. */
import {
  h, tex, fmt, add, box, Graph, NumberLine, stamp, stampIn, mountExplainers, pop, fadeIn, anim, sleep, tween, svgEl, pulse,
  linear, COLORS, texNum
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const CURVE = COLORS.blue, IX = COLORS.purple, INK = COLORS.ink;
const VC = { 2: COLORS.green, 1: COLORS.amber, 0: COLORS.red };
const kindOf = (D, tol = 1e-9) => (Math.abs(D) <= tol ? 1 : D > 0 ? 2 : 0);
const KCLS = { 2: 'u5l8-k2', 1: 'u5l8-k1', 0: 'u5l8-k0' };
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; if (el && el.label) el.label.style.opacity = 0; return el; };
const unhide = (el) => { if (el) el.style.opacity = ''; if (el && el.label) el.label.style.opacity = ''; return el; };
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
const absSvg = (stage, w, hh, x = 0, y = 0, cls = '') => { const s = svgEl('svg', { width: w, height: hh, viewBox: `0 0 ${w} ${hh}`, class: cls }, stage); s.style.position = 'absolute'; s.style.left = x + 'px'; s.style.top = y + 'px'; return s; };
const popP = (c, p) => Promise.all([pop(c, unhide(p)), p.label ? show(c, unhide(p.label)) : null]);
const tn = (v) => texNum(v, 2);
const f2 = (v) => (Math.round(v * 100) / 100).toFixed(2);
const par = (v) => (v < 0 ? `(${tn(v)})` : tn(v));
const rel = (D) => (Math.abs(D) < 1e-9 ? '=0' : D > 0 ? '>0' : '<0');
/* a numbered row for step-by-step procedures (the step number beside each step as it appears) */
const row = (host, n, html) => { const r = h('div', 'u5l8-row', `<span class="u5l8-n">${n}</span><div class="u5l8-rc">${html}</div>`); r.style.opacity = 0; host.appendChild(r); return r; };
const VERD = {
  2: `<b>Two distinct real roots</b><span>two ${T('x')}-intercepts</span>`,
  1: `<b>Two equal real roots</b><span>one ${T('x')}-intercept: the vertex touches the axis</span>`,
  0: `<b>No real roots</b><span>no ${T('x')}-intercepts</span>`
};
/* a pulsing ring (the "tangent moment") */
const glowRing = (layer) => { const g = svgEl('circle', { r: 17, class: 'u5l8-glow' }, layer); g.style.display = 'none'; return g; };
const placeRing = (ring, G, x, y, on) => { const [px, py] = G.toPx(x, y); ring.setAttribute('cx', px); ring.setAttribute('cy', py); ring.style.display = on ? '' : 'none'; };

/* =============================== explainer: slide the parabola (STAR, hands-on) =============================== */
const slide = {
  title: 'Slide the parabola up and down',
  height: 452, minW: 880, tap: false, capH: 96,
  ask: () => `Example 1 as one moving picture: ${T('y=x^2-4x+c')}, with ${T('a=1')}, ${T('b=-4')}. What happens to the roots as ${T('c')} changes?`,
  make(stage, v, ex) {
    const W = ex.W, GW = 420, PX = GW + 22, PW = W - PX;
    const S = { c: 3 };
    const G = new Graph(stage, { x: 0, y: 4, width: GW, height: 444, xmin: -2, xmax: 6, ymin: -6, ymax: 8, ylabels: 2, fontSize: 15, pad: [30, 18, 18, 18] });
    const f = (x) => x * x - 4 * x + S.c;
    const cv = G.fn(f, { color: CURVE, width: 4 });
    const vx = G.point(2, -1, { color: 'red', r: 5 });
    const ring = glowRing(G.layers.top);
    const r1 = G.point(1, 0, { color: 'amber', r: 8.5, label: '', pos: 'nw' }), r2 = G.point(3, 0, { color: 'amber', r: 8.5, label: '', pos: 'ne' });
    // the panel
    const P = div(stage, 'u5l8-pn', '', PX, 0, PW);
    const eq = h('div', 'u5l8-eqbig'); P.appendChild(eq);
    const sl = h('label', 'u5l8-sl no-ink', `<span class="u5l8-sll">${T('c')}</span><input type="range" min="-2" max="9" step="0.25" aria-label="the value of c"><span class="u5l8-slv"></span>`);
    sl.setAttribute('data-tap', ''); P.appendChild(sl);
    const inp = sl.querySelector('input'), slv = sl.querySelector('.u5l8-slv');
    const dbox = h('div', 'u5l8-dbox', `<div class="u5l8-dl1">${T('b^2-4ac=(-4)^2-4(1)(c)')}</div><div class="u5l8-dl2"></div>`); P.appendChild(dbox);
    const dl2 = dbox.querySelector('.u5l8-dl2');
    // the sign meter: negative (red) | 0 (amber) | positive (green)
    const MW = PW, MH = 58, Dlo = -20, Dhi = 24, mx = (D) => 16 + (D - Dlo) / (Dhi - Dlo) * (MW - 32);
    const M = svgEl('svg', { width: MW, height: MH, viewBox: `0 0 ${MW} ${MH}`, class: 'u5l8-meter' }, P);
    svgEl('rect', { x: 16, y: 26, width: mx(0) - 16, height: 14, rx: 7, fill: COLORS.red, opacity: 0.85 }, M);
    svgEl('rect', { x: mx(0), y: 26, width: MW - 16 - mx(0), height: 14, rx: 7, fill: COLORS.green, opacity: 0.85 }, M);
    svgEl('rect', { x: mx(0) - 3, y: 20, width: 6, height: 26, rx: 3, fill: COLORS.amber }, M);
    [['negative', 40, 'start'], ['0', mx(0), 'middle'], ['positive', MW - 40, 'end']].forEach(([t, x, a]) => { const e = svgEl('text', { x, y: 57, 'text-anchor': a, class: 'u5l8-mt' }, M); e.textContent = t; });
    const needle = svgEl('path', { d: 'M0 22 L-9 4 L9 4 Z', fill: INK }, M);
    const form = h('div', 'u5l8-form'); P.appendChild(form);
    const verd = h('div', 'u5l8-verd'); P.appendChild(verd);
    const upd = () => {
      const c = S.c, D = Math.round((16 - 4 * c) * 100) / 100, k = kindOf(D), s = Math.sqrt(Math.max(0, D));
      cv._bkDraw();
      G.moveTo(vx, 2, c - 4);
      if (k === 2) {
        const a = 2 - s / 2, b = 2 + s / 2; G.moveTo(r1, a, 0); G.moveTo(r2, b, 0); unhide(r1); unhide(r2);
        const ex2 = Number.isInteger(s);
        r1.label.innerHTML = T((ex2 ? '' : '\\approx') + tn(a)); r2.label.innerHTML = T((ex2 ? '' : '\\approx') + tn(b));
        form.innerHTML = `${T(`x=\\dfrac{4\\pm\\sqrt{${tn(D)}}}{2}`)}${ex2 ? ` ${T(`=\\dfrac{4\\pm${s}}{2}`)}` : ''}<br>${T(`x${ex2 ? '=' : '\\approx'}${tn(b)}`)} or ${T(`x${ex2 ? '=' : '\\approx'}${tn(a)}`)}`;
      } else if (k === 1) {
        G.moveTo(r1, 2, 0); unhide(r1); hide(r2); r1.label.innerHTML = T('2');
        form.innerHTML = `${T('x=\\dfrac{4\\pm\\sqrt{0}}{2}=2')}<br>the ${T('+')} and the ${T('-')} both give ${T('2')}`;
      } else {
        hide(r1); hide(r2);
        form.innerHTML = `${T(`x=\\dfrac{4\\pm\\sqrt{${tn(D)}}}{2}`)}<br>no real square root of a negative`;
      }
      placeRing(ring, G, 2, 0, k === 1);
      eq.innerHTML = T(`y=x^2-4x${c < 0 ? '-' + tn(-c) : '+' + tn(c)}`);
      inp.value = c; slv.textContent = tn(c).replace('-', '−');
      dl2.innerHTML = `${T(`=16-4(${tn(c)})=`)}<b class="u5l8-dv">${T(tn(D))}</b>`;
      needle.setAttribute('transform', `translate(${mx(Math.max(Dlo, Math.min(Dhi, D)))} 0)`);
      verd.innerHTML = VERD[k];
      stage.classList.remove('u5l8-k0', 'u5l8-k1', 'u5l8-k2'); stage.classList.add(KCLS[k]);
    };
    inp.addEventListener('input', () => { S.c = parseFloat(inp.value); upd(); });
    upd();
    const go = (c, to, ms) => { const c0 = S.c; return tween(c, ms, (u) => { S.c = Math.round((c0 + (to - c0) * u) * 20) / 20; upd(); }); };
    return [
      { cap: `${T('c=3')}: ${T('b^2-4ac=16-12=4')}, positive. The formula gives ${T('\\frac{4\\pm2}{2}')}: <b>two roots</b>, ${T('1')} and ${T('3')}, and the graph crosses the ${T('x')}-axis <b>twice</b>.`,
        run: async (c) => { await go(c, 3, 500); await Promise.all([pulse(c, r1, 1.5), pulse(c, r2, 1.5)]); await pulse(c, form, 1.05); } },
      { cap: `Raise ${T('c')} to ${T('4')}: ${T('b^2-4ac=16-16=0')}. ${T('\\pm\\sqrt0')} gives the same number twice, ${T('x=2')}: the roots merge and the <b>vertex just touches</b> the axis.`,
        run: async (c) => { await go(c, 4, 1400); await pulse(c, verd, 1.05); } },
      { cap: `${T('c=7')}: ${T('b^2-4ac=16-28=-12')}, negative. There is no real square root of a negative: <b>no real roots</b>, and the graph misses the axis.`,
        run: async (c) => { await go(c, 7, 1500); } },
      { cap: `<b>Your turn:</b> drag the slider. The sign of ${T('b^2-4ac')} and the number of ${T('x')}-intercepts always change together.`,
        run: async (c) => { await go(c, 1, 1200); await pulse(c, sl, 1.06); } }
    ];
  }
};

/* =============================== explainer: the b² − 4ac machine (Example 2) =============================== */
const EQ2 = {
  a: { orig: '3x^2-5x-2=0', a: 3, b: -5, c: -2, sub: '(-5)^2-4(3)(-2)=25+24=49', D: 49 },
  b: { orig: '4x^2+25=20x', std: '4x^2-20x+25=0', a: 4, b: -20, c: 25, sub: '(-20)^2-4(4)(25)=400-400=0', D: 0 },
  c: { orig: '2x^2+3x+4=0', a: 2, b: 3, c: 4, sub: '3^2-4(2)(4)=9-32=-23', D: -23 },
  d: { orig: 'y=2x^2-7x+3', a: 2, b: -7, c: 3, sub: '(-7)^2-4(2)(3)=49-24=25', D: 25 },
  e: { orig: 'y=-3x^2+2x-1', a: -3, b: 2, c: -1, sub: '2^2-4(-3)(-1)=4-12=-8', D: -8 },
  f: { orig: 'y=0.25x^2-3x+9', a: 0.25, b: -3, c: 9, sub: '(-3)^2-4(0.25)(9)=9-9=0', D: 0 }
};
const V2 = { 2: ['two distinct real roots', `two ${T('x')}-intercepts`], 1: ['two equal real roots', `one ${T('x')}-intercept`], 0: ['no real roots', `no ${T('x')}-intercepts`] };
/* a little graph of y = ax² + bx + c around its vertex, scaled so the x-intercepts (or the gap) show */
function mini(a, b, c, w = 130, hh = 70) {
  const D = b * b - 4 * a * c, xv = -b / (2 * a), yv = c - b * b / (4 * a), A = Math.abs(a);
  const half = D > 0 ? Math.sqrt(D) / (2 * A) : 0;
  const ww = D > 1e-9 ? half * 1.6 : D < -1e-9 ? Math.sqrt(3 * Math.abs(yv) / A) : Math.sqrt(1.5 / A);
  const f = (x) => a * x * x + b * x + c, ye = f(xv + ww);
  const lo = Math.min(0, yv, ye), hi = Math.max(0, yv, ye), pad = (hi - lo) * 0.14 + 0.05;
  const X = (x) => 8 + (x - (xv - ww)) / (2 * ww) * (w - 16), Y = (y) => 4 + (hi + pad - y) / (hi - lo + 2 * pad) * (hh - 8);
  let d = ''; for (let i = 0; i <= 40; i++) { const x = xv - ww + 2 * ww * i / 40; d += (i ? 'L' : 'M') + X(x).toFixed(1) + ' ' + Y(f(x)).toFixed(1); }
  const roots = D > 1e-9 ? [xv - half, xv + half] : Math.abs(D) <= 1e-9 ? [xv] : [];
  return `<svg class="u5l8-mini" width="${w}" height="${hh}" viewBox="0 0 ${w} ${hh}"><line x1="2" x2="${w - 2}" y1="${Y(0)}" y2="${Y(0)}" stroke="#3a4254" stroke-width="2"/><path d="${d}" fill="none" stroke="${CURVE}" stroke-width="3"/>${roots.map((r) => `<circle cx="${X(r)}" cy="${Y(0)}" r="5" fill="${COLORS.amber}" stroke="#fff" stroke-width="1.5"/>`).join('')}</svg>`;
}
const machine = {
  title: 'The b² − 4ac machine',
  height: 446, minW: 880,
  choices: [{ sep: 'Example 2:' }, { v: 'abc', label: '(a)–(c) the roots' }, { v: 'def', label: '(d)–(f) the graphs' }],
  ask: (v) => v === 'abc' ? `<b>Example 2(a)–(c):</b> without solving, determine the nature of the roots.` : `<b>Example 2(d)–(f):</b> without graphing, determine the number of ${T('x')}-intercepts.`,
  make(stage, v, ex) {
    const W = ex.W, ids = v.split(''), graphs = v === 'def';
    // in-tray (left), the machine (middle), the result (right), three bins (bottom)
    const tray = div(stage, 'u5l8-tray', `<div class="u5l8-trh">In</div><div class="u5l8-tre"></div><div class="u5l8-trs"></div>`, 0, 6, 272, 196);
    const tre = tray.querySelector('.u5l8-tre'), trs = tray.querySelector('.u5l8-trs');
    const MX = 290, MW = 350;
    const mach = div(stage, 'u5l8-mach', `<div class="u5l8-mh"><span class="u5l8-gear">⚙️</span>${T('b^2-4ac')}<span class="u5l8-gear">⚙️</span></div><div class="u5l8-abc"></div><div class="u5l8-scr"></div>`, MX, 0, MW, 206);
    const abc = mach.querySelector('.u5l8-abc'), scr = mach.querySelector('.u5l8-scr'), gears = [...mach.querySelectorAll('.u5l8-gear')];
    const out = div(stage, 'u5l8-out', '', MX + MW + 20, 40, W - MX - MW - 20, 130);
    const BY = 226, BW = (W - 24) / 3;
    const bins = [2, 1, 0].map((k, i) => {
      const b = div(stage, 'u5l8-bin ' + KCLS[k], `<div class="u5l8-binh">${T('b^2-4ac' + (k === 2 ? '>0' : k === 1 ? '=0' : '<0'))}</div><div class="u5l8-bins">${V2[k][graphs ? 1 : 0]}</div>`, i * (BW + 12), BY, BW, 446 - BY - 2);
      b.k = k; return b;
    });
    const binOf = (k) => bins.find((b) => b.k === k);
    const steps = [];
    ids.forEach((id) => {
      const e = EQ2[id], k = kindOf(e.D), std = e.std || e.orig;
      const sgnTxt = e.D > 0 ? 'positive' : e.D < 0 ? 'negative' : 'zero';
      steps.push({
        cap: `(${id}) ${T(e.orig)}${e.std ? `: standard form first, ${T(e.std)}.` : ' is in standard form.'} Read ${T(`a=${tn(e.a)}`)}, ${T(`b=${tn(e.b)}`)}, ${T(`c=${tn(e.c)}`)}.`,
        run: async (c) => {
          tre.innerHTML = T(e.orig); trs.innerHTML = e.std ? `→ ${T(e.std)}` : ''; scr.innerHTML = ''; out.innerHTML = ''; abc.innerHTML = '';
          await show(c, tray.querySelector('.u5l8-tre')); if (e.std) await show(c, trs);
          const ch = ['a', 'b', 'c'].map((n) => { const s = h('span', 'u5l8-chip', T(`${n}=${tn(e[n])}`)); s.style.opacity = 0; abc.appendChild(s); return s; });
          for (const s of ch) { s.style.opacity = ''; await pop(c, s, 300); }
        }
      });
      steps.push({
        cap: `${T('b^2-4ac=' + e.sub)}, ${sgnTxt}: <b>${V2[k][graphs ? 1 : 0]}</b>.`,
        run: async (c) => {
          const spin = Promise.all(gears.map((g) => anim(c, g, [{ transform: 'rotate(0)' }, { transform: 'rotate(360deg)' }], 900)));
          scr.innerHTML = T(e.sub.replace(/=([^=]*)$/, '=\\boxed{$1}')); await show(c, scr); await spin;
          out.innerHTML = `<div class="u5l8-outv ${KCLS[k]}">${T(tn(e.D) + (k === 2 ? '>0' : k === 1 ? '=0' : '<0'))}</div>`; await pop(c, out.firstChild);
          const bin = binOf(k), tok = div(bin, 'u5l8-tok', `<div>${T(std)}</div>${mini(e.a, e.b, e.c)}`);
          const br = bin.getBoundingClientRect(), orr = out.getBoundingClientRect(), sc = (stage.getBoundingClientRect().width / stage.offsetWidth) || 1;
          const dx = (orr.left - br.left) / sc, dy = (orr.top - br.top) / sc - 60;
          await anim(c, tok, [{ transform: `translate(${dx}px, ${dy}px) scale(.7)`, opacity: 0.2 }, { transform: 'none', opacity: 1 }], 700);
          await pulse(c, bin.querySelector('.u5l8-binh'), 1.08);
        }
      });
    });
    return steps;
  }
};

/* =============================== explainer: rational or irrational? (procedure, numbered) =============================== */
const EQ3 = {
  a: { eq: '6x^2+7x-20=0', sub: '7^2-4(6)(-20)=49+480=529', D: 529, ac: -120, b: 7, pairs: [[-1, 120], [-2, 60], [-3, 40], [-4, 30], [-5, 24], [-6, 20], [-8, 15], [-10, 12]], pick: 6,
    split: '6x^2+15x-8x-20', group: '3x(2x+5)-4(2x+5)', fac: '(3x-4)(2x+5)=0', sol: 'x=\\frac43\\ \\text{ or }\\ x=-\\frac52' },
  b: { eq: '2x^2+5x-4=0', sub: '5^2-4(2)(-4)=25+32=57', D: 57 },
  c: { eq: '9x^2+30x+25=0', sub: '30^2-4(9)(25)=900-900=0', D: 0, ac: 225, b: 30, pairs: [[1, 225], [3, 75], [5, 45], [9, 25], [15, 15]], pick: 4,
    split: '9x^2+15x+15x+25', group: '3x(3x+5)+5(3x+5)', fac: '(3x+5)^2=0', sol: 'x=-\\frac53' }
};
const ratirr = {
  title: 'Rational or irrational? Then factor',
  height: 446, minW: 880, capH: 96,
  choices: [{ sep: 'Example 3:' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }, { v: 'c', label: '(c)' }],
  ask: (v) => `<b>Example 3(${v}):</b> ${T(EQ3[v].eq)}. Are the roots rational or irrational? If rational, solve by factoring.`,
  make(stage, v, ex) {
    const W = ex.W, e = EQ3[v], LW = 470, RX = LW + 20, RW = W - RX;
    const rows = div(stage, 'u5l8-rows', '', 0, 4, LW, 438);
    // the ladder of perfect squares near D
    const r = Math.floor(Math.sqrt(e.D) + 1e-9), perfect = r * r === e.D;
    const ns = []; for (let n = Math.max(0, r - (perfect ? 2 : 1)); ns.length < (perfect ? 5 : 4); n++) ns.push(n);
    const lad = div(stage, 'u5l8-lad', `<div class="u5l8-ladh">Perfect squares</div><div class="u5l8-ladr"></div>`, RX, 4, RW);
    const lr = lad.querySelector('.u5l8-ladr');
    const sqEls = {}; let dEl = null;
    ns.forEach((n) => {
      if (!perfect && n === r + 1) { dEl = h('span', 'u5l8-sq u5l8-sqd', `<i>${T('D')}</i>${T(fmt(e.D))}`); lr.appendChild(dEl); }
      const s = h('span', 'u5l8-sq', `<i>${T(n + '^2')}</i>${T(fmt(n * n))}`); lr.appendChild(s); sqEls[n] = s;
    });
    if (dEl) dEl.style.opacity = 0;
    lad.style.opacity = 0;
    const st = !perfect ? stamp(stage, 'Irrational: does not factor', { ok: false, x: RX + RW / 2, y: 250 }) : null;
    if (st) st.style.opacity = 0;
    const steps = [];
    const r1 = row(rows, 1, `${T('b^2-4ac=' + e.sub)}`);
    steps.push({ cap: `<b>1</b> The discriminant: ${T('b^2-4ac=' + e.sub)}.`, run: (c) => show(c, r1) });
    if (perfect) {
      const r2 = row(rows, 2, `${T(`${fmt(e.D)}=${r}^2`)}: a perfect square, so the roots are <b class="u5l8-c2">rational</b>${e.D === 0 ? ' (one double root)' : ''}.`);
      steps.push({ cap: `<b>2</b> Is ${T(fmt(e.D))} a perfect square? ${T(`${r}^2=${fmt(e.D)}`)}: <b>yes</b>, so the roots are rational${e.D === 0 ? ' (one rational double root)' : ''} and the trinomial factors.`,
        run: async (c) => { await show(c, lad); lad.style.opacity = ''; const s = sqEls[r]; s.classList.add('u5l8-sqok'); await pulse(c, s, 1.2); await show(c, r2); } });
      // the X: ac on top, b underneath, the two numbers on the sides; factor pairs beside, the right pair circled
      const XS = 190, XX = RX + 6, XY = 150;
      const xsv = absSvg(stage, XS, XS, XX, XY, 'u5l8-x');
      svgEl('line', { x1: 22, y1: 22, x2: XS - 22, y2: XS - 22 }, xsv); svgEl('line', { x1: XS - 22, y1: 22, x2: 22, y2: XS - 22 }, xsv);
      const xl = (html, x, y, cls = '') => div(stage, 'u5l8-xl ' + cls, html, XX + x, XY + y);
      const [p, q] = e.pairs[e.pick];
      const xt = xl(T(fmt(e.ac).replace('-', '-')), XS / 2, 0, 'u5l8-xt'), xb = xl(T(String(e.b)), XS / 2, XS - 2, 'u5l8-xb');
      const xa = xl(T(String(p)), 4, XS / 2, 'u5l8-xs'), xc = xl(T(String(q)), XS - 4, XS / 2, 'u5l8-xs');
      const pl = div(stage, 'u5l8-pairs', e.pairs.map(([m, n], i) => `<div class="${i === e.pick ? 'u5l8-pk' : ''}">${T(`${m}\\cdot${n}`)}<i>${T('\\to' + (m + n))}</i></div>`).join(''), XX + XS + 14, XY - 8, RW - XS - 20);
      [xsv, xt, xb, xa, xc, pl].forEach(hide);
      const r3 = row(rows, 3, `${T(e.split)}<br>${T('=' + e.group)}<br>${T(e.fac)}`);
      const r4 = row(rows, 4, `${T(e.sol)}`);
      steps.push({ cap: `<b>3</b> Factor with the X: ${T('ac=' + fmt(e.ac))} on top, ${T('b=' + e.b)} underneath. List the factor pairs: ${T(`${p}`)} and ${T(`${q}`)} multiply to ${T(fmt(e.ac))} and add to ${T(String(e.b))}.`,
        run: async (c) => {
          unhide(xsv); await show(c, xsv); unhide(xt); await pop(c, xt); unhide(xb); await pop(c, xb);
          unhide(pl); await show(c, pl); const pk = pl.querySelector('.u5l8-pk'); pk.classList.add('on'); await pulse(c, pk, 1.12);
          unhide(xa); unhide(xc); await Promise.all([pop(c, xa), pop(c, xc)]);
        } });
      steps.push({ cap: `Split the middle term into ${T(`${q}x`)} and ${T(`${p < 0 ? '-' : '+'}${Math.abs(p)}x`)}, and group: ${T(e.fac.replace('=0', ''))}.`, run: (c) => show(c, r3) });
      steps.push({ cap: `<b>4</b> Solve: ${T(e.sol)}${e.D === 0 ? ' (the double root)' : ''}. Rational roots, as the perfect square promised.`, run: (c) => show(c, r4) });
    } else {
      const r2 = row(rows, 2, `${T(`${r}^2=${r * r}<${e.D}<${(r + 1) * (r + 1)}=${r + 1}^2`)}: not a perfect square, so the roots are <b class="u5l8-c0">irrational</b>. The trinomial does not factor over the integers.`);
      steps.push({ cap: `<b>2</b> Is ${T(String(e.D))} a perfect square? It lands between ${T(`${r}^2=${r * r}`)} and ${T(`${r + 1}^2=${(r + 1) * (r + 1)}`)} (${T(`\\sqrt{${e.D}}\\approx${f2(Math.sqrt(e.D))}`)}): <b>no</b>. Two irrational roots.`,
        run: async (c) => { await show(c, lad); lad.style.opacity = ''; dEl.style.opacity = ''; await anim(c, dEl, [{ transform: 'translateY(-46px)', opacity: 0 }, { transform: 'none', opacity: 1 }], 600); await show(c, r2); } });
      steps.push({ cap: `Stop here: an irrational answer means there is <b>no</b> pair of integers for the X. The booklet only asks whether the roots are rational, so we are done.`,
        run: async (c) => { st.style.opacity = ''; await stampIn(c, st); } });
    }
    return steps;
  }
};

/* =============================== explainer: finding k (procedure + sweep) =============================== */
const SW = {
  e4: { label: 'Example 4', ask: `<b>Example 4:</b> for what values of ${T('k')} does ${T('2x^2-6x+k=0')} have two distinct, two equal or no real roots? (d) the equal root?`,
    f: (k) => (x) => 2 * x * x - 6 * x + k, D: (k) => 36 - 8 * k, vx: () => 1.5, ab: () => [2, -6],
    win: { xmin: -1, xmax: 4, ymin: -7, ymax: 9, ylabels: 2 }, nl: { min: -2, max: 9, labelStep: 1 }, from: -2, to: 9, start: 1,
    zones: [[-2, 4.5, 2], [4.5, 9, 0]], marks: [4.5] },
  e5: { label: 'Example 5(a)', ask: `<b>Example 5(a):</b> for what values of ${T('k')} does ${T('x^2+kx+9=0')} have equal roots (and what are they)? Two distinct real roots? No real roots?`,
    f: (k) => (x) => x * x + k * x + 9, D: (k) => k * k - 36, vx: (k) => -k / 2, ab: (k) => [1, k],
    win: { xmin: -8, xmax: 8, ymin: -12, ymax: 12, ystep: 2, ylabels: 4, xlabels: 2 }, nl: { min: -10, max: 10, labelStep: 2 }, from: -9, to: 9, start: -9,
    zones: [[-9, -6, 2], [-6, 6, 0], [6, 9, 2]], marks: [-6, 6] }
};
const sweep = {
  title: 'Finding k: solve, then sweep',
  height: 452, minW: 880, capH: 96,
  choices: [{ v: 'e4', label: 'Example 4' }, { v: 'e5', label: 'Example 5(a)' }],
  ask: (v) => SW[v].ask,
  make(stage, v, ex) {
    const W = ex.W, d = SW[v], GW = 380, GH = 312, RX = GW + 22, RW = W - RX;
    const S = { k: d.start };
    const G = new Graph(stage, Object.assign({ x: 0, y: 0, width: GW, height: GH, fontSize: 14, pad: [30, 18, 18, 18] }, d.win));
    const cv = G.fn((x) => d.f(S.k)(x), { color: CURVE, width: 3.5 });
    const ring = glowRing(G.layers.top);
    const q1 = G.point(0, 0, { color: 'amber', r: 7 }), q2 = G.point(0, 0, { color: 'amber', r: 7 });
    const rows = div(stage, 'u5l8-rows u5l8-rows-s', '', RX, 0, RW, GH);
    const NL = new NumberLine(stage, { x: 0, y: GH + 8, width: W, height: 132, min: d.nl.min, max: d.nl.max, step: 1, labelStep: d.nl.labelStep, axisY: 80, fontSize: 16 });
    const ay = NL.ay;
    const paint = d.zones.map(([lo, hi, k]) => { const rc = svgEl('rect', { x: NL.toPx(lo), y: ay - 8, width: 0, height: 16, rx: 3, fill: VC[k], opacity: 0.85 }, NL.layers.data); rc.lo = lo; rc.hi = hi; return rc; });
    const mk = d.marks.map((m) => { const g = svgEl('circle', { cx: NL.toPx(m), cy: ay, r: 9, fill: VC[1], stroke: '#fff', 'stroke-width': 2.5 }, NL.layers.top); g.style.opacity = 0; return g; });
    const kd = svgEl('g', {}, NL.layers.top);
    svgEl('line', { x1: 0, x2: 0, y1: ay - 30, y2: ay + 2, stroke: INK, 'stroke-width': 3 }, kd);
    svgEl('path', { d: `M0 ${ay - 2} l-8 -12 h16 z`, fill: INK }, kd);
    const kr = div(stage, 'u5l8-kro', '', 0, GH + 4, W);
    const zlab = div(stage, 'u5l8-zl', '', 0, GH + 36, W);
    let painting = false;
    const upd = () => {
      const k = S.k, D = d.D(k), kk = kindOf(D, 1e-6), f = d.f(k), xv = d.vx(k);
      cv._bkDraw();
      if (kk === 2) { const [a, b] = d.ab(k), s = Math.sqrt(D); G.moveTo(q1, (-b - s) / (2 * a), 0); G.moveTo(q2, (-b + s) / (2 * a), 0); unhide(q1); unhide(q2); }
      else if (kk === 1) { G.moveTo(q1, xv, 0); unhide(q1); hide(q2); }
      else { hide(q1); hide(q2); }
      placeRing(ring, G, xv, f(xv), kk === 1);
      kd.setAttribute('transform', `translate(${NL.toPx(k)} 0)`);
      kr.innerHTML = `<span class="${KCLS[kk]}">${T(`k=${tn(k)}`)}: &nbsp;${T(`b^2-4ac=${tn(D)}`)} &nbsp;<b>${kk === 2 ? 'two distinct real roots' : kk === 1 ? 'two equal roots' : 'no real roots'}</b></span>`;
      if (painting) paint.forEach((rc) => { const x0 = NL.toPx(rc.lo), x1 = NL.toPx(Math.min(rc.hi, k)); rc.setAttribute('width', Math.max(0, x1 - x0)); });
      if (painting) d.marks.forEach((m, i) => { if (k >= m - 1e-9) mk[i].style.opacity = 1; });
    };
    upd();
    const go = (c, to, ms, ease) => { const k0 = S.k; return tween(c, ms, (u) => { S.k = u >= 1 ? to : k0 + (to - k0) * u; upd(); }, ease); };
    const steps = [];
    if (v === 'e4') {
      const r1 = row(rows, 1, `${T('a=2,\\ b=-6,\\ c=k')}<br>${T('b^2-4ac=(-6)^2-4(2)(k)=36-8k')}`);
      const r2 = row(rows, 2, `(a) ${T('36-8k>0')}<br>${T('-8k>-36')} <span class="u5l8-flip">÷ (−8): flip!</span><br>${T('k<\\frac92')}`);
      const r2b = row(rows, '', `(b) ${T('36-8k=0,\\ k=\\frac92')} &nbsp; (c) ${T('36-8k<0,\\ k>\\frac92')}`);
      const r3 = row(rows, 3, `(d) ${T('k=\\frac92')}: ${T('x=\\frac{-b}{2a}=\\frac64=\\frac32')}`);
      steps.push(
        { cap: `<b>1</b> Read ${T('a=2')}, ${T('b=-6')}, ${T('c=k')}: the discriminant in terms of ${T('k')} is ${T('36-8k')}.`, run: (c) => show(c, r1) },
        { cap: `<b>2</b> (a) Two distinct real roots: ${T('36-8k>0')}, so ${T('-8k>-36')}. Divide by ${T('-8')} and <b>flip the sign</b>: ${T('k<\\frac92')}.`,
          run: async (c) => { await show(c, r2); await pulse(c, r2.querySelector('.u5l8-flip'), 1.2); } },
        { cap: `(b) Equal roots: ${T('36-8k=0')}, ${T('k=\\frac92')}. (c) No real roots: ${T('36-8k<0')}, so ${T('k>\\frac92')}.`, run: (c) => show(c, r2b) },
        { cap: `<b>3</b> Check by sweeping ${T('k')} from ${T('-2')} to ${T('9')}: the parabola rises. <b class="u5l8-c2">Two</b> ${T('x')}-intercepts while ${T('k<\\frac92')}, a <b class="u5l8-c1">touch</b> at ${T('k=\\frac92')}, <b class="u5l8-c0">none</b> after.`,
          run: async (c) => { await go(c, d.from, 500); painting = true; await go(c, d.to, 4200, linear); zlab.innerHTML = `<span class="u5l8-c2">${T('k<\\frac92')}: two</span><span class="u5l8-c1">${T('k=\\frac92')}: equal</span><span class="u5l8-c0">${T('k>\\frac92')}: none</span>`; await show(c, zlab); } },
        { cap: `(d) At ${T('k=\\frac92')} the vertex sits on the axis. The radical is ${T('0')}, so the equal root is ${T('x=\\frac{-b}{2a}=\\frac64=\\frac32')}.`,
          run: async (c) => { await go(c, 4.5, 1200); await show(c, r3); } }
      );
    } else {
      const r1 = row(rows, 1, `${T('a=1,\\ b=k,\\ c=9')}<br>${T('b^2-4ac=k^2-4(1)(9)=k^2-36')}`);
      const r2 = row(rows, 2, `Equal: ${T('k^2-36=0')}, ${T('k^2=36')}<br>${T('k=6')} or ${T('k=-6')}`);
      const r2b = row(rows, '', `${T('k=6')}: ${T('(x+3)^2')}, root ${T('x=-3')}<br>${T('k=-6')}: ${T('(x-3)^2')}, root ${T('x=3')}`);
      const r3 = row(rows, 3, `Two distinct: ${T('k<-6')} or ${T('k>6')}<br>None: ${T('-6<k<6')}`);
      steps.push(
        { cap: `<b>1</b> Read ${T('a=1')}, ${T('b=k')}, ${T('c=9')}: the discriminant is ${T('k^2-36')}.`, run: (c) => show(c, r1) },
        { cap: `<b>2</b> Equal roots: ${T('k^2-36=0')}, so ${T('k^2=36')} and ${T('k=6')} <b>or</b> ${T('k=-6')}. Two values: don't lose the negative one!`, run: (c) => show(c, r2) },
        { cap: `${T('k=6')}: ${T('x^2+6x+9=(x+3)^2')}, root ${T('x=-3')}. ${T('k=-6')}: ${T('x^2-6x+9=(x-3)^2')}, root ${T('x=3')}. Both touch the axis.`,
          run: async (c) => { await go(c, 6, 1400); await sleep(c, 500); await go(c, -6, 1600); await show(c, r2b); } },
        { cap: `<b>3</b> Sweep ${T('k')} from ${T('-9')} to ${T('9')}: <b class="u5l8-c2">two</b> ${T('x')}-intercepts while ${T('k^2>36')} (outside ${T('\\pm6')}), a <b class="u5l8-c1">touch</b> at ${T('\\pm6')}, <b class="u5l8-c0">none</b> while ${T('k^2<36')} (between).`,
          run: async (c) => { await go(c, d.from, 600); painting = true; await go(c, d.to, 5200, linear); zlab.innerHTML = `<span class="u5l8-c2">${T('k<-6')}: two</span><span class="u5l8-c1">${T('k=\\pm6')}: equal</span><span class="u5l8-c0">${T('-6<k<6')}: none</span><span class="u5l8-c2">${T('k>6')}: two</span>`; await show(c, zlab); } },
        { cap: `So: two distinct real roots when ${T('k<-6')} or ${T('k>6')}; no real roots when ${T('-6<k<6')}.`, run: (c) => show(c, r3) }
      );
    }
    return steps;
  }
};

/* =============================== explainer: does the ball reach it? (Example 7) =============================== */
const H7 = (t) => -5 * t * t + 20 * t + 1, TL = (20 + Math.sqrt(420)) / 10;
const D7 = (H) => 420 - 20 * H;
const BALL = {
  a: { label: '(a) 25 m', H: 25, ask: 'does the ball reach a height of 25 m?' },
  b: { label: '(b) 16 m', H: 16, ask: 'does it reach 16 m? How many times?' },
  c: { label: '(c) the maximum', H: 21, ask: 'determine its maximum height.' }
};
const ball = {
  title: 'Does the ball reach it?',
  height: 440, minW: 880, capH: 96,
  choices: [{ sep: 'Example 7:' }, ...Object.keys(BALL).map((k) => ({ v: k, label: BALL[k].label }))],
  ask: (v) => `<b>Example 7${BALL[v].label.slice(0, 3)}</b> ${T('h=-5t^2+20t+1')}: ${BALL[v].ask}`,
  make(stage, v, ex) {
    const W = ex.W, d = BALL[v], SW = 140, GX = SW + 8, GW = 420, GH = 436, PX = GX + GW + 16, PW = W - PX;
    const G = new Graph(stage, { x: GX, y: 2, width: GW, height: GH, xmin: 0, xmax: 4.4, ymin: 0, ymax: 28, xstep: 0.5, ystep: 2, xlabels: 1, ylabels: 4, arrows: false, fnArrows: false, xtitle: 't\\text{ (s)}', ytitle: 'h\\text{ (m)}', fontSize: 15 });
    const py = (hh) => 2 + G.toPx(0, hh)[1], gx = (t) => GX + G.toPx(t, 0)[0];
    const y0 = py(0);
    // the scene: heights match the graph's h-axis
    const sc = absSvg(stage, SW, 440, 0, 0, 'u5l8-scene');
    svgEl('rect', { x: 0, y: 0, width: SW, height: y0, fill: '#eaf3fb', rx: 10 }, sc);
    svgEl('rect', { x: 0, y: y0, width: SW, height: 440 - y0, fill: '#8cc084' }, sc);
    const kid = svgEl('text', { x: 52, y: y0 - 2, 'font-size': 40, 'text-anchor': 'middle' }, sc); kid.textContent = '🙋';
    const tl = svgEl('line', { x1: 0, x2: SW, y1: 0, y2: 0, stroke: IX, 'stroke-width': 3, 'stroke-dasharray': '10 6' }, sc);
    const bl = svgEl('g', {}, sc);
    svgEl('circle', { r: 10, fill: '#fffdf6', stroke: '#c93a33', 'stroke-width': 3 }, bl);
    const BX = 92;
    G.fn(H7, { from: 0, to: TL, color: '#9aa0ab', width: 2, dash: '6 6' });
    const fo = { from: 0, to: 0, color: CURVE, width: 4 };
    const cv = G.fn(H7, fo);
    const dot = svgEl('circle', { r: 7, fill: CURVE, stroke: '#fff', 'stroke-width': 2 }, G.layers.top);
    const S = { H: v === 'c' ? 25 : 0 };
    const line = G.hline(S.H, { color: IX, width: 3, dash: '10 6' });
    const ring = glowRing(G.layers.top);
    const Hlab = div(stage, 'u5l8-hlab', '', GX + GW - 150, 0);
    const P = div(stage, 'u5l8-pn u5l8-pn7', '', PX, 0, PW);
    const live = h('div', 'u5l8-live'); P.appendChild(live);
    const rowsEl = h('div', 'u5l8-rows u5l8-rows-7'); P.appendChild(rowsEl);
    const setT = (t) => {
      const hh = Math.max(0, H7(t)), y = py(hh);
      bl.setAttribute('transform', `translate(${BX} ${Math.min(y, y0 - 10)})`);
      const [px, pyy] = G.toPx(t, hh); dot.setAttribute('cx', px); dot.setAttribute('cy', pyy);
      if (t > fo.to) { fo.to = t; cv._bkDraw(); }
    };
    const setH = (H) => {
      S.H = H; line.set(H); tl.setAttribute('y1', py(H)); tl.setAttribute('y2', py(H));
      const D = Math.round(D7(H) * 100) / 100, k = kindOf(D, 1e-6);
      Hlab.innerHTML = T(`h=${tn(Math.round(H * 10) / 10)}`); Hlab.style.top = (py(H) - 34) + 'px';
      live.className = 'u5l8-live ' + KCLS[k];
      live.innerHTML = `${T(`H=${tn(Math.round(H * 10) / 10)}`)}: ${T(`b^2-4ac=420-20H=${tn(Math.round(D))}`)}`;
      placeRing(ring, G, 2, 21, k === 1);
    };
    setT(0); setH(S.H);
    const moveH = (c, to, ms) => { const a = S.H; return tween(c, ms, (u) => setH(u === 1 ? to : a + (to - a) * u)); };
    const fly = (c, t1, ms) => { const t0 = fo.to; return tween(c, ms, (u) => setT(t0 + (t1 - t0) * u), linear); };
    const steps = [];
    if (v !== 'c') {
      const H = d.H, cc = 1 - H, D = D7(H);
      const ra = row(rowsEl, 1, `${T(`-5t^2+20t+1=${H}`)}<br>${T(`-5t^2+20t${cc < 0 ? cc : '+' + cc}=0`)}`);
      const rb = row(rowsEl, 2, `${T(`400-4(-5)(${cc})`)}<br>${T(`=400${4 * 5 * cc < 0 ? '' : '+'}${20 * cc}=${D}`)}`);
      const rc = row(rowsEl, 3, H === 25 ? `${T('-80<0')}: no real roots.<br><b class="u5l8-c0">It never reaches 25 m.</b>` : `${T('100>0')}: two real roots.<br><b class="u5l8-c2">Yes, twice:</b> ${T('t=1')} s and ${T('t=3')} s.`);
      const st = stamp(stage, H === 25 ? 'Never reaches 25 m' : 'Twice!', { ok: H !== 25, x: GX + GW / 2 + 40, y: H === 25 ? 60 : 300 }); st.style.opacity = 0;
      const p1 = hide(G.point(1, 16, { color: 'purple', label: T('t=1'), pos: 'nw' })), p3 = hide(G.point(3, 16, { color: 'purple', label: T('t=3'), pos: 'ne' }));
      steps.push(
        { cap: `(${v}) Set the height to ${H}: ${T(`-5t^2+20t+1=${H}`)}, so ${T(`-5t^2+20t${cc}=0`)}.`, run: async (c) => { await moveH(c, H, 1300); await show(c, ra); } },
        { cap: `${T(`b^2-4ac=20^2-4(-5)(${cc})=400${20 * cc}=${D}`)}${D < 0 ? ', negative' : ', positive'}.`, run: (c) => show(c, rb) },
        { cap: H === 25 ? `No real roots: the ball <b>never reaches 25 m</b>. Its whole path stays under the line.` : `Two real roots: <b>yes, twice</b>, going up at ${T('t=1')} s and coming down at ${T('t=3')} s.`,
          run: async (c) => {
            await show(c, rc);
            if (H === 25) { await fly(c, TL, 2600); }
            else { await fly(c, 1, 900); await popP(c, p1); await fly(c, 3, 1300); await popP(c, p3); await fly(c, TL, 700); }
            st.style.opacity = ''; await stampIn(c, st);
          } }
      );
    } else {
      const ra = row(rowsEl, 1, `${T('-5t^2+20t+1=H')}<br>${T('-5t^2+20t+(1-H)=0')}`);
      const rb = row(rowsEl, 2, `Real roots: ${T('400+20(1-H)\\ge0')}<br>${T('420\\ge20H')}, so ${T('H\\le21')}`);
      const rc = row(rowsEl, 3, `Equal roots at ${T('H=21')}:<br><b class="u5l8-c1">maximum height 21 m</b>, at ${T('t=2')} s`);
      const pv = hide(G.point(2, 21, { color: 'amber', label: T('(2,\\ 21)'), pos: 'n' }));
      steps.push(
        { cap: `(c) For any height ${T('H')}: ${T('-5t^2+20t+1=H')}, so ${T('-5t^2+20t+(1-H)=0')}, with ${T('c=1-H')}.`, run: (c) => show(c, ra) },
        { cap: `${T('H')} is reached when there are real roots: ${T('400-4(-5)(1-H)=400+20(1-H)\\ge0')}, so ${T('420\\ge20H')} and ${T('H\\le21')}. Slide the line down until ${T('b^2-4ac')} reaches ${T('0')}.`,
          run: async (c) => { await show(c, rb); await moveH(c, 21, 2600); } },
        { cap: `At ${T('H=21')} the roots are equal: the line <b>just touches</b> the top of the path. The maximum height is <b>21 m</b>, at ${T('t=2')} s.`,
          run: async (c) => { await fly(c, 2, 1400); await popP(c, pv); await fly(c, TL, 1300); await show(c, rc); } }
      );
    }
    return steps;
  }
};

/* =============================== Stand Up Break =============================== */
/* BEG: the nature of the roots (sometimes standard form first). PRG: find k (c-position) for two distinct / equal /
 * no real roots, with a negative a sometimes (flip). MAS: k in the b-position: equal roots and their values, and none. */
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const frac = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = gcd(Math.abs(n), d) || 1; n /= g; d /= g; return d === 1 ? String(n) : (n < 0 ? '-' : '') + `\\frac{${Math.abs(n)}}{${d}}`; };
const term = (co, v, first) => { if (co === 0) return ''; const s = co < 0 ? '-' : first ? '' : '+', m = Math.abs(co); return s + (m === 1 && v ? '' : m) + v; };
const poly = (a, b, c) => (term(a, 'x^2', true) + term(b, 'x') + term(c, '')) || '0';
standup('u5l8', {
  intro: 'At your whiteboard: standard form first, then b² − 4ac. Its sign tells the story.',
  levels: {
    BEG: (r) => {
      for (;;) {
        const a = r.pick([1, 2, 3, 4, -1, -2]), b = r.int(-9, 9), c = r.int(-9, 9);
        if (!b || !c) continue;
        const D = b * b - 4 * a * c, k = D > 0 ? 2 : D === 0 ? 1 : 0;
        if (r.chance(0.25) && k !== 1) continue;
        const words = ['no real roots', 'two equal real roots', 'two distinct real roots'][k];
        return { text: 'Without solving, determine the nature of the roots.', q: `${poly(a, b, c)}=0`,
          a: [`b^2-4ac=${b < 0 ? `(${b})` : b}^2-4(${a})(${c})=${D}`, `${D}${D > 0 ? '>0' : D < 0 ? '<0' : '=0'}\\text{: ${words}}`] };
      }
    },
    PRG: (r) => {
      for (;;) {
        const a = r.pick([1, 2, 3, -1, -2]), b = r.pick([-8, -6, -5, -4, -3, 2, 4, 5, 6, 8, 10]);
        const n = b * b, dd = 4 * a; // b² − 4ak, boundary k = b²/(4a)
        const kb = frac(n, dd), lt = a > 0;
        return { text: `For what values of <i>k</i> does the equation have (a) two distinct real roots, (b) two equal real roots, (c) no real roots?`,
          q: `${term(a, 'x^2', true)}${term(b, 'x')}+k=0`,
          a: [`b^2-4ac=${n}${a < 0 ? '+' + (-4 * a) : '-' + 4 * a}k`, `\\text{(a) }${n}${a < 0 ? '+' + (-4 * a) : '-' + 4 * a}k>0\\Rightarrow k${lt ? '<' : '>'}${kb}`, `\\text{(b) }k=${kb}`, `\\text{(c) }k${lt ? '>' : '<'}${kb}`] };
      }
    },
    MAS: (r) => {
      let p, q; do { p = r.pick([1, 2, 3, 4]); q = r.pick([1, 2, 3, 5]); } while (gcd(p, q) !== 1 || p * q === 1);
      const A = p * p, C = q * q, K = 2 * p * q;
      return { text: 'Determine every value of <i>k</i> for which the equation has two equal real roots, and the root for each value. For what values of <i>k</i> are there no real roots?',
        q: `${A === 1 ? '' : A}x^2+kx+${C}=0`,
        a: [`b^2-4ac=k^2-${4 * A * C}=0\\Rightarrow k=\\pm${K}`, `k=${K}:\\ (${p === 1 ? '' : p}x+${q})^2,\\ x=${frac(-q, p)}`, `k=-${K}:\\ (${p === 1 ? '' : p}x-${q})^2,\\ x=${frac(q, p)}`, `\\text{none: }-${K}<k<${K}`] };
    }
  }
});

/* =============================== mount =============================== */
export const explainers = mountExplainers({ slide, machine, ratirr, sweep, ball });
export const _test = { mini, kindOf, D7, H7 };
