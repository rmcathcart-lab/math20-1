/* Math 20-1 · Unit 7 · Lesson 6 — Reciprocal Functions of Linear Functions.
 * New lesson format (2026-11-11): the warm-up ("The Gas Upgrade") is plain markup on the page (no code). Explainers:
 *   partner   (STAR, hands-on: a blue dot on the line y = f(x) and its orange partner (x, 1/f(x)) move in step; the partner
 *              draws the reciprocal graph as it goes, a readout and two size bars show big ↔ small and the matching signs,
 *              the table fills itself, the partner shoots off at the vertical asymptote; the class can drag either dot;
 *              Examples 1, 2, 3 (with a zoom-out for x = −98 and 102) and a falling line),
 *   sketch    (the four-step sketching procedure with step numbers: asymptotes, invariant points on y = ±1, more points
 *              that fly from the line to their reciprocal height, then the two branches; Example 4(a), (b) and a demo),
 *   features  (the denominator ax + b set equal to 0, 1 and −1 and evaluated at x = 0, each result drawn on the graph,
 *              then the sign of the denominator; Example 5(a)–(c)),
 *   backwards (from the reciprocal graph back to the line, with step numbers: the asymptote gives the zero, a point flips
 *              to the line, slope and intercept, check with the y-intercept; Example 7 and a demo),
 *   match     (equation cards slide to the graphs A–D as each clue rules graphs out, and get stamped; Example 8).
 * Colours: the line blue, the reciprocal orange, invariant points gold, the vertical asymptote purple (dashed), the guide
 *   lines y = ±1 green (dotted), y > 0 green. */
import { h, tex, add, box, mountExplainers, pop, fadeIn, tween, svgEl, pulse, shake, sleep, linear, COLORS,
  Graph, stamp, stampIn, num, place } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const BL = '#1f5bd6', OR = '#d9730d', GO = '#c99a06', PU = '#7b4fc4', GN = '#12805a', GR = '#8d93a0';
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
/* a work line with its step number beside it */
const wl = (p, n, html) => { const d = h('div', 'u7l6-wl', `<b class="u7l6-sn">${n}</b><span class="u7l6-lt">${html}</span>`); p.appendChild(d); return hide(d); };
const sIn = async (c, el) => { el.style.opacity = 1; await stampIn(c, el); };
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
/* an exact fraction n/d as TeX (integers stay integers) */
const fr = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = gcd(Math.abs(n), d) || 1; n /= g; d /= g; return d === 1 ? String(n) : (n < 0 ? '-' : '') + `\\tfrac{${Math.abs(n)}}{${d}}`; };
const tn = (v) => num(v, 3).replace('−', '-');   // a decimal for TeX
/* a tidy value as TeX: a fraction with a small denominator, else a decimal */
const frT = (q) => { for (let k = 1; k <= 12; k++) { const n = Math.round(q * k); if (Math.abs(n / k - q) < 1e-9) return fr(n, k); } return tn(q); };
/* an x-value as the booklet writes it: halves and quarters as decimals (2.5), thirds as fractions */
const xT = (q) => (Number.isInteger(Math.round(q * 4 * 1e6) / 1e6) ? tn(q) : frT(q));
const pt = (x, y) => `(${x},\\ ${y})`;
const guides = (G, w = 2.5) => [1, -1].map((k) => G.hline(k, { color: GN, width: w, dash: '3 7' }));

/* =============================== explainer: partner points (STAR) =============================== */
const PT = {
  e1: { label: 'Example 1: f(x) = x', m: 1, b: 0, fT: 'x', win: [-4.5, 4.5, -4.5, 4.5], x0: 4, lab: [[2.6, 3.9, 'w'], [0.55, 3.4, 'e']],
    rows: [[-4, '-4', '-4', '-\\frac{1}{4}'], [-2, '-2', '-2', '-\\frac{1}{2}'], [-1, '-1', '-1', '-1'], [-0.5, '-\\frac{1}{2}', '-\\frac{1}{2}', '-2'], [-0.25, '-\\frac{1}{4}', '-\\frac{1}{4}', '-4'],
      [0, '0', '0', '\\text{undef.}'], [0.25, '\\frac{1}{4}', '\\frac{1}{4}', '4'], [0.5, '\\frac{1}{2}', '\\frac{1}{2}', '2'], [1, '1', '1', '1'], [2, '2', '2', '\\frac{1}{2}'], [4, '4', '4', '\\frac{1}{4}']] },
  e2: { label: 'Example 2: f(x) = x − 2', m: 1, b: -2, fT: 'x-2', win: [-2.5, 6.5, -4.5, 4.5], x0: 6, lab: [[4.5, 1.9, 'e'], [2.6, 4.2, 'e']],
    rows: [[-2, '-2', '-4', '-\\frac{1}{4}'], [0, '0', '-2', '-\\frac{1}{2}'], [1, '1', '-1', '-1'], [1.5, '1.5', '-0.5', '-2'], [2, '2', '0', '\\text{undef.}'],
      [2.5, '2.5', '0.5', '2'], [3, '3', '1', '1'], [4, '4', '2', '\\frac{1}{2}'], [6, '6', '4', '\\frac{1}{4}']] },
  e3: { label: 'Example 3: close to x = 2', m: 1, b: -2, fT: 'x-2', win: [-2.5, 6.5, -4.5, 4.5], x0: 1.5, lab: [[4.5, 1.9, 'e'], [2.6, 4.2, 'e']],
    rows: [[1.9, '1.9', '-0.1', '-10'], [1.99, '1.99', '-0.01', '-100'], [1.999, '1.999', '-0.001', '-1000'], [2.001, '2.001', '0.001', '1000'], [2.01, '2.01', '0.01', '100'],
      [2.1, '2.1', '0.1', '10'], [-98, '-98', '-100', '-0.01'], [102, '102', '100', '0.01']] },
  e4: { label: 'A falling line: f(x) = 2 − ½x', m: -0.5, b: 2, fT: '2-\\tfrac{1}{2}x', win: [-3.5, 9.5, -4.5, 4.5], x0: -2, lab: [[-2.9, 3.9, 'e'], [4.3, 3.6, 'e']],
    rows: [[-2, '-2', '3', '\\frac{1}{3}'], [0, '0', '2', '\\frac{1}{2}'], [2, '2', '1', '1'], [3, '3', '0.5', '2'], [4, '4', '0', '\\text{undef.}'], [5, '5', '-0.5', '-2'], [6, '6', '-1', '-1'], [8, '8', '-2', '-\\frac{1}{2}']] }
};
const partner = {
  title: 'Partner points: y = f(x) and y = 1/f(x)',
  height: 480, minW: 940,
  choices: Object.keys(PT).map((k) => ({ v: k, label: PT[k].label })),
  ask: (v) => (v === 'e3' ? `Example 3: describe ${T('y=\\dfrac{1}{x-2}')} near its asymptotes.` : `Each point ${T('(x,\\ y)')} on ${T(`y=${PT[v].fT}`)} has a partner ${T('\\left(x,\\ \\tfrac{1}{y}\\right)')}.`),
  make(stage, v, ex) {
    const d = PT[v], W = ex.W, [x0, x1, y0, y1] = d.win, F = (x) => d.m * x + d.b, z = -d.b / d.m;
    const G = new Graph(stage, { x: 4, y: 4, width: 540, height: 472, xmin: x0, xmax: x1, ymin: y0, ymax: y1, xlabels: 1, ylabels: 1, fontSize: 15, pad: [28, 18, 16, 18] });
    const S = { x: d.x0, lo: d.x0, hi: d.x0, partner: false };
    const L = hide(G.line({ m: d.m, b: d.b }, { color: BL, width: 4 }));
    const gl = guides(G); gl.forEach(hide);
    const glab = hide(G.label(x0 + 0.2, 1, T('y=1'), { pos: 'ne', color: GN, cls: 'bk-ptlab', dx: 2 }));
    const VA = hide(G.vline(z, { color: PU, width: 3 })), HA = hide(G.hline(0, { color: PU, width: 3.5, dash: '10 7' }));
    const tr = { from: d.x0, to: d.x0, color: OR, width: 4.5, arrows: false };
    const trail = hide(G.fn((x) => 1 / F(x), tr));
    const l1 = hide(G.label(d.lab[0][0], d.lab[0][1], T(`y=${d.fT}`), { pos: d.lab[0][2], color: BL, cls: 'bk-ptlab' }));
    const l2 = hide(G.label(d.lab[1][0], d.lab[1][1], T('y=\\tfrac{1}{f(x)}'), { pos: d.lab[1][2], color: OR, cls: 'bk-ptlab' }));
    const invX = [(1 - d.b) / d.m, (-1 - d.b) / d.m];
    const invP = invX.map((x, i) => hide(G.point(x, i ? -1 : 1, { color: GO, r: 8, coords: true, pos: i ? (d.m > 0 ? 'nw' : 'ne') : (d.m > 0 ? 'se' : 'sw') })));
    invP.forEach((p) => hide(p.label));
    const Rv = () => { const f = F(S.x); return Math.abs(f) < 1e-12 ? null : 1 / f; };
    const clampY = (y) => Math.max(G.win.ymin, Math.min(G.win.ymax, y));
    const conn = hide(G.curve(() => { const r = Rv(); if (r == null) return { subs: [] }; const a = G.toPx(S.x, clampY(F(S.x))), b = G.toPx(S.x, clampY(r)); return { subs: [[a, b]] }; }, { color: GR, width: 2.5, dash: '4 6' }, '', G.layers.data));
    // the two dots are drag handles (finger and Pencil)
    const mkH = (colr) => { const hd = h('div', 'u7l6-hd', '<i></i>'); hd.style.setProperty('--hc', colr); hd.setAttribute('data-tap', ''); G.html.appendChild(hd); return hd; };
    const hb = mkH(BL), ho = mkH(OR), edge = h('div', 'u7l6-edge', ''); G.html.appendChild(edge);
    G.track(hb, () => { const y = F(S.x); place(hb, ...G.toPx(S.x, clampY(y)), 'c', 0); hb.classList.toggle('u7l6-hoff', !G.inside(S.x, y)); });
    G.track(ho, () => {
      const r = Rv(); const ok = r != null && G.inside(S.x, r) && S.partner;
      if (r != null) place(ho, ...G.toPx(S.x, clampY(r)), 'c', 0); ho.classList.toggle('u7l6-hoff', !ok);
      const off = S.partner && r != null && !G.inside(S.x, r, 1e-9) && S.x >= G.win.xmin && S.x <= G.win.xmax;
      edge.style.display = off ? '' : 'none';
      if (off) { const up = r > G.win.ymax; edge.textContent = `${up ? '↑' : '↓'} ${num(r)}`; place(edge, ...G.toPx(S.x, up ? G.win.ymax : G.win.ymin), up ? 's' : 'n', 8); }
    });
    hide(hb); hide(ho);
    // right panel: readout, size bars, table
    const PW = W - 560, R = div(stage, 'u7l6-panel', '', 556, 4, PW, 472);
    const ro = div(R, 'u7l6-ro', `<div><span>x</span><b class="vx"></b></div><div class="rf"><span>f(x)</span><b class="vf"></b></div><div class="rr"><span>1/f(x)</span><b class="vr"></b></div>`);
    const vx = ro.querySelector('.vx'), vf = ro.querySelector('.vf'), vr = ro.querySelector('.vr');
    const met = div(R, 'u7l6-meter', '<div class="ax"></div><div class="bar bf"></div><div class="bar br"></div>');
    const bf = met.querySelector('.bf'), br = met.querySelector('.br'), MW = PW - 32, mid = MW / 2, unit = (mid - 16) / 5;
    const badge = div(R, 'u7l6-badge', '');
    const tb = h('table', 'u7l6-ptab'); R.appendChild(tb);
    tb.innerHTML = `<tr><th>${T('x')}</th><th>${T('f(x)')}</th><th>${T('\\tfrac{1}{f(x)}')}</th></tr>` + d.rows.map((r) => `<tr><td><span class="v">${T(r[1])}</span></td><td class="f"><span class="v">${T(r[2])}</span></td><td class="r"><span class="v">${T(r[3])}</span></td></tr>`).join('');
    const trs = [...tb.querySelectorAll('tr')].slice(1);
    // the x column is known from the start: only f(x) and 1/f(x) appear as the dot passes
    trs.forEach((t) => t.cells[0].querySelector('.v').style.opacity = 1);
    [ro, met, badge].forEach(hide);
    const bar = (el, v) => { const len = Math.min(Math.abs(v), 5) * unit; el.style.width = len + 'px'; el.style.left = (v < 0 ? mid - len : mid) + 'px'; el.classList.toggle('over', Math.abs(v) > 5); };
    const paint = () => {
      const f = F(S.x), r = Rv();
      vx.textContent = num(S.x); vf.textContent = num(f); vr.textContent = r == null ? 'undefined' : S.partner ? num(r) : '?';
      bar(bf, f); if (r == null || !S.partner) br.style.width = '0px'; else bar(br, r);
      let k = '', t;
      if (r == null) { k = 'asy'; t = 'f(x) = 0: no reciprocal, a vertical asymptote'; }
      else if (Math.abs(Math.abs(f) - 1) < 0.013) { k = 'inv'; t = `invariant point: both are ${f > 0 ? '1' : '−1'}`; }
      else if (Math.abs(f) < 0.26) { k = 'asy'; t = 'f(x) close to 0, so 1/f(x) is huge'; }
      else t = (Math.abs(f) > 1 ? 'f(x) big, so 1/f(x) small' : 'f(x) small, so 1/f(x) big') + ' · same sign';
      badge.className = 'u7l6-badge ' + k; badge.textContent = S.partner ? t : 'a point on the line';
      trs.forEach((tt, i) => tt.classList.toggle('now', Math.abs(d.rows[i][0] - S.x) < 1e-7));
    };
    const light = (a, b) => { if (!S.partner) return; const lo = Math.min(a, b) - 1e-9, hi = Math.max(a, b) + 1e-9; d.rows.forEach((r, i) => { if (r[0] >= lo && r[0] <= hi) trs[i].classList.add('on'); }); };
    const set = (x, quiet) => {
      const p = S.x; S.x = x;
      if (S.partner) { S.lo = Math.min(S.lo, x); S.hi = Math.max(S.hi, x); tr.from = S.lo; tr.to = S.hi; trail._bkDraw(); }
      light(quiet ? x : p, x); hb._bkDraw(); ho._bkDraw(); conn._bkDraw(); paint();
    };
    const go = (c, x, ms = 1200) => { const a = S.x; return tween(c, ms, (t) => set(a + (x - a) * t)).then(() => set(x)); };
    const jump = (c, x) => { set(x, true); return sleep(c, 250); };
    // dragging: the class can move either dot (it snaps to tidy x-values)
    [hb, ho].forEach((hd) => {
      const drag = (e) => { const [x] = G.fromEvent(e), w = G.win, s = w.xmax - w.xmin > 50 ? 1 : 0.05; const nx = Math.max(w.xmin + s, Math.min(w.xmax - s, Math.round(x / s) * s)); if (Math.abs(nx - S.x) > 1e-9) set(parseFloat(nx.toFixed(4))); };
      hd.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); try { hd.setPointerCapture(e.pointerId); } catch (er) { /* */ } hd._drag = true; hd.classList.add('drag'); });
      hd.addEventListener('pointermove', (e) => { if (hd._drag) drag(e); });
      const up = (e) => { hd._drag = false; hd.classList.remove('drag'); try { hd.releasePointerCapture(e.pointerId); } catch (er) { /* */ } };
      hd.addEventListener('pointerup', up); hd.addEventListener('pointercancel', up);
    });
    set(d.x0);
    // building blocks for the steps
    const lineIn = async (c) => { L.style.opacity = 1; await G.drawIn(L, 700, c); await show(c, l1); gl.forEach((g) => (g.style.opacity = 1)); await Promise.all(gl.map((g) => G.drawIn(g, 500, c))); await show(c, glab); hb.style.opacity = 1; await pop(c, hb); await Promise.all([show(c, ro), show(c, met), show(c, badge)]); };
    const partnerIn = async (c) => { S.partner = true; set(S.x); conn.style.opacity = 1; trail.style.opacity = 1; ho.style.opacity = 1; await pop(c, ho); await show(c, l2); };
    const invIn = async (c, i) => { invP[i].style.opacity = 1; await pop(c, invP[i]); await show(c, invP[i].label); };
    const vaIn = async (c) => { VA.style.opacity = 1; await G.drawIn(VA, 600, c); };
    const fullIn = async (c) => { S.lo = Math.min(S.lo, G.win.xmin); S.hi = Math.max(S.hi, G.win.xmax); tr.from = S.lo; tr.to = S.hi; trail._bkDraw(); HA.style.opacity = 1; await G.drawIn(HA, 700, c); };
        const dragCap = 'Now <b>drag</b> either dot: the two heights are always reciprocals, and they always have the same sign.';
    if (v === 'e1') return [
      { cap: `The line ${T('y=x')} and the guide lines ${T('y=\\pm1')}. The <b>blue dot</b> is the point ${T('(4,\\ 4)')} on the line.`, run: lineIn },
      { cap: `Its <b>partner</b> (orange) has the same ${T('x')} and the reciprocal ${T('y')}: ${T('(4,\\ 4)')} becomes ${T('\\left(4,\\ \\tfrac{1}{4}\\right)')}. Big becomes small.`, run: partnerIn },
      { cap: `Slide left: as ${T('f(x)')} gets smaller, ${T('\\tfrac{1}{f(x)}')} gets bigger. At ${T('y=1')} they meet: ${T('(1,\\ 1)')} is an <b>invariant point</b>.`, run: async (c) => { await go(c, 2, 900); await sleep(c, 300); await go(c, 1, 900); await invIn(c, 0); } },
      { cap: `Close to ${T('x=0')}, ${T('f(x)')} is tiny, so ${T('\\tfrac{1}{f(x)}')} is huge: the partner shoots up. The ${T('y')}-axis, ${T('x=0')}, is a <b>vertical asymptote</b>.`, run: async (c) => { await go(c, 0.5, 900); await go(c, 0.25, 800); await go(c, 0.05, 1000); await vaIn(c); } },
      { cap: `Past ${T('0')}, ${T('f(x)')} is negative and so is its reciprocal: <b>same sign</b>. ${T('(-1,\\ -1)')} is the other invariant point.`, run: async (c) => { await jump(c, -0.05); await go(c, -0.25, 900); await go(c, -1, 1200); await invIn(c, 1); await go(c, -4, 1400); } },
      { cap: `Far from ${T('0')}, ${T('f(x)')} is big, so ${T('\\tfrac{1}{f(x)}')} is close to ${T('0')} but never ${T('0')}: the <b>horizontal asymptote</b> ${T('y=0')}.`, run: fullIn },
      { cap: `Domain ${T('\\{x\\mid x\\ne0,\\ x\\in\\mathbb{R}\\}')}, range ${T('\\{y\\mid y\\ne0,\\ y\\in\\mathbb{R}\\}')}. ${dragCap}`, run: async (c) => { await go(c, -2, 900); await go(c, -0.5, 900); await Promise.all([pulse(c, hb, 1.3), pulse(c, ho, 1.3)]); } }
    ];
    if (v === 'e2') return [
      { cap: `The line ${T('y=x-2')} and the guide lines ${T('y=\\pm1')}. The <b>blue dot</b> is ${T('(6,\\ 4)')}.`, run: lineIn },
      { cap: `Its partner: same ${T('x')}, reciprocal ${T('y')}. ${T('(6,\\ 4)')} becomes ${T('\\left(6,\\ \\tfrac{1}{4}\\right)')}.`, run: partnerIn },
      { cap: `Slide left: ${T('f(x)=4,\\ 2,\\ 1')} gives ${T('\\tfrac{1}{f(x)}=\\tfrac{1}{4},\\ \\tfrac{1}{2},\\ 1')}. At ${T('x=3')} both are ${T('1')}: the invariant point ${T('(3,\\ 1)')}.`, run: async (c) => { await go(c, 4, 1000); await sleep(c, 300); await go(c, 3, 900); await invIn(c, 0); } },
      { cap: `At ${T('x=2.5')}: ${T('0.5\\to2')}. At ${T('x=2')}, ${T('f(x)=0')}: no reciprocal. The <b>vertical asymptote</b> is ${T('x=2')}, the line’s ${T('x')}-intercept.`, run: async (c) => { await go(c, 2.5, 900); await sleep(c, 300); await go(c, 2.05, 1000); await vaIn(c); await jump(c, 2); } },
      { cap: `Left of ${T('2')} both are negative: ${T('x=1.5')} gives ${T('-0.5\\to-2')}, and ${T('(1,\\ -1)')} is the other invariant point.`, run: async (c) => { await jump(c, 1.95); await go(c, 1.5, 900); await sleep(c, 300); await go(c, 1, 900); await invIn(c, 1); } },
      { cap: `${T('y')}-intercepts: ${T('f(0)=-2')}, so the reciprocal’s is ${T('-\\tfrac{1}{2}')}. At ${T('x=-2')}: ${T('-4\\to-\\tfrac{1}{4}')}. The horizontal asymptote is ${T('y=0')}.`, run: async (c) => { await go(c, 0, 1000); await sleep(c, 400); await go(c, -2, 900); await fullIn(c); } },
      { cap: dragCap, run: async (c) => { await go(c, 0.5, 900); await Promise.all([pulse(c, hb, 1.3), pulse(c, ho, 1.3)]); } }
    ];
    if (v === 'e3') return [
      { cap: `${T('y=\\dfrac{1}{x-2}')}: start at ${T('x=1.5')}, where ${T('f(x)=-0.5')} and ${T('\\tfrac{1}{f(x)}=-2')}.`, run: async (c) => { await lineIn(c); await vaIn(c); await partnerIn(c); } },
      { cap: `Creep toward ${T('2')} from the <b>left</b>: ${T('x=1.9,\\ 1.99,\\ 1.999')} give ${T('-10,\\ -100,\\ -1000')}. The graph falls along ${T('x=2')}: ${T('y\\to-\\infty')}.`, run: async (c) => { await go(c, 1.9, 1100); await sleep(c, 500); await go(c, 1.99, 700); await sleep(c, 500); await go(c, 1.999, 600); } },
      { cap: `From the <b>right</b>: ${T('x=2.1,\\ 2.01,\\ 2.001')} give ${T('10,\\ 100,\\ 1000')}. The graph rises along ${T('x=2')}: ${T('y\\to+\\infty')}.`, run: async (c) => { await jump(c, 2.1); await sleep(c, 300); await go(c, 2.01, 700); await sleep(c, 500); await go(c, 2.001, 600); } },
      { cap: `Zoom out. At ${T('x=102')}, ${T('f(x)=100')} and ${T('\\tfrac{1}{f(x)}=0.01')}; at ${T('x=-98')}, ${T('-0.01')}. The graph approaches ${T('y=0')} but never reaches it.`, run: async (c) => {
        await G.setWindow({ xmin: -110, xmax: 110, ymin: -1.5, ymax: 1.5, xscl: 10, yscl: 0.5 }, c, 1200); await go(c, 102, 1600); await sleep(c, 600); await jump(c, -98); await fullIn(c); } },
      { cap: `Back to the usual window. Near ${T('x=2')} the graph runs along the vertical asymptote; far away it runs along ${T('y=0')}. ${dragCap}`, run: async (c) => { await G.setWindow({ xmin: x0, xmax: x1, ymin: y0, ymax: y1, xscl: 1, yscl: 1 }, c, 1000); await jump(c, 3); } }
    ];
    return [ // falling line
      { cap: `A <b>falling</b> line: ${T('y=2-\\tfrac{1}{2}x')}. The blue dot is ${T('(-2,\\ 3)')}.`, run: lineIn },
      { cap: `Its partner is ${T('\\left(-2,\\ \\tfrac{1}{3}\\right)')}. Slide right: ${T('f(x)')} <b>falls</b> from ${T('3')} to ${T('1')}, so ${T('\\tfrac{1}{f(x)}')} <b>rises</b> from ${T('\\tfrac{1}{3}')} to ${T('1')}: ${T('(2,\\ 1)')} is invariant.`, run: async (c) => { await partnerIn(c); await go(c, 0, 1000); await sleep(c, 300); await go(c, 2, 1000); await invIn(c, 0); } },
      { cap: `Keep going: ${T('f(x)\\to0')} at ${T('x=4')}, so ${T('\\tfrac{1}{f(x)}')} shoots up. The vertical asymptote is ${T('x=4')}.`, run: async (c) => { await go(c, 3, 900); await sleep(c, 300); await go(c, 3.9, 1000); await vaIn(c); await jump(c, 4); } },
      { cap: `Right of ${T('4')} both are negative. ${T('x=5')}: ${T('-0.5\\to-2')}; ${T('(6,\\ -1)')} is invariant; ${T('x=8')}: ${T('-2\\to-\\tfrac{1}{2}')}.`, run: async (c) => { await jump(c, 4.1); await go(c, 5, 900); await sleep(c, 300); await go(c, 6, 800); await invIn(c, 1); await go(c, 8, 900); } },
      { cap: `The line falls, so <b>each branch rises</b>: where ${T('f')} decreases, ${T('\\tfrac{1}{f}')} increases. ${dragCap}`, run: async (c) => { await fullIn(c); await Promise.all([pulse(c, hb, 1.3), pulse(c, ho, 1.3)]); } }
    ];
  }
};

/* =============================== explainer: sketching from a line (procedure) =============================== */
const SK = {
  demo: { label: 'Demo: f(x) = ½x + 1.5', m: 0.5, b: 1.5, fT: '\\tfrac{1}{2}x+1.5', extra: [1, -4] },
  a: { label: 'Example 4(a)', m: 2, b: -4, fT: '2x-4', extra: [3, 1] },
  b: { label: '(b)', m: -0.5, b: -1, fT: '-\\tfrac{1}{2}x-1', extra: [-6, 2] }
};
const sketch = {
  title: 'Sketching y = 1/f(x) from the line',
  height: 470, minW: 940,
  choices: Object.keys(SK).map((k) => ({ v: k, label: SK[k].label })),
  ask: (v) => `Sketch ${T('y=\\dfrac{1}{f(x)}')} for ${T(`f(x)=${SK[v].fT}`)}.`,
  make(stage, v, ex) {
    const d = SK[v], W = ex.W, F = (x) => d.m * x + d.b, R = (x) => 1 / F(x), z = -d.b / d.m;
    const G = new Graph(stage, { x: 4, y: 4, width: 462, height: 462, xmin: -6.5, xmax: 6.5, ymin: -6.5, ymax: 6.5, xlabels: 2, ylabels: 2, fontSize: 15, pad: [28, 16, 16, 16] });
    G.line({ m: d.m, b: d.b }, { color: BL, width: 4 });
    guides(G);
    G.label(-6.3, 1, T('y=1'), { pos: 'ne', color: GN, cls: 'bk-ptlab' }); G.label(-6.3, -1, T('y=-1'), { pos: 'se', color: GN, cls: 'bk-ptlab' });
    const VA = hide(G.vline(z, { color: PU, width: 3 })), HA = hide(G.hline(0, { color: PU, width: 3.5, dash: '10 7' }));
    const zl = hide(G.label(z, 6.2, T(`x=${tn(z)}`), { pos: 'e', color: PU, cls: 'bk-ptlab', dx: 4 }));
    const ix = [(1 - d.b) / d.m, (-1 - d.b) / d.m];
    const inv = ix.map((x, i) => hide(G.point(x, i ? -1 : 1, { color: GO, r: 8 })));   // their coordinates are in the panel
    const yIsInv = Math.abs(Math.abs(d.b) - 1) < 1e-9;
    const more = [0, ...d.extra].filter((x, i) => !(i === 0 && yIsInv)).map((x) => { const p = hide(G.point(x, F(x), { color: BL, r: 7 })); p._x = x; return p; });
    const left = hide(G.fn(R, { to: z - 1e-6, color: OR, width: 4.5 })), right = hide(G.fn(R, { from: z + 1e-6, color: OR, width: 4.5 }));
    // the steps panel
    const P = div(stage, 'u7l6-panel', '<div class="u7l6-ph">The four steps</div>', 482, 4, W - 486, 462);
    const ftx = (k) => `${d.fT}=${k}`;
    const yInt = frT(1 / d.b);
    const moreTxt = more.map((p) => { const f = F(p._x); return p._x === 0 ? `${T('y')}-intercept ${T(`\\tfrac{1}{${f}}=${yInt}`)}` : `${T(`f(${tn(p._x)})=${frT(f)}`)} ${T('\\to')} ${T(pt(tn(p._x), frT(1 / f)))}`; }).join('; &nbsp;');
    const w1 = wl(P, 1, `${T(ftx(0))} at ${T(`x=${xT(z)}`)}: vertical asymptote ${T(`x=${xT(z)}`)}; horizontal asymptote ${T('y=0')}`);
    const w2 = wl(P, 2, `${T(ftx(1))} at ${T(`x=${xT(ix[0])}`)}; &nbsp;${T(ftx(-1))} at ${T(`x=${xT(ix[1])}`)}: invariant points ${T(pt(xT(ix[0]), 1))}, ${T(pt(xT(ix[1]), -1))}`);
    const w3 = wl(P, 3, `More points: ${moreTxt}${yIsInv ? `; the ${T('y')}-intercept ${T(pt(0, yInt))} is already an invariant point` : ''}`);
    const w4 = wl(P, 4, `Two branches, one on each side of ${T(`x=${xT(z)}`)}, on the <b>same side of the ${T('x')}-axis</b> as the line`);
    const ans = hide(div(P, 'u7l6-ansl', `Vertical asymptote ${T(`x=${xT(z)}`)} · invariant points ${T(pt(xT(ix[0]), 1))}, ${T(pt(xT(ix[1]), -1))} · ${T('y')}-intercept ${T(yInt)}`));
    const fly = async (c, p) => { p.style.opacity = 1; await pop(c, p); await sleep(c, 200); const y1 = R(p._x); p.querySelector('circle').setAttribute('fill', OR); await G.move(c, p, p._x, y1, 700); };
    return [
      { cap: `<b>Step 1.</b> The line crosses the ${T('x')}-axis at ${T(`x=${xT(z)}`)}: draw the dashed vertical asymptote there. The ${T('x')}-axis, ${T('y=0')}, is the horizontal asymptote.`, run: async (c) => { await show(c, w1); VA.style.opacity = 1; await G.drawIn(VA, 600, c); await show(c, zl); HA.style.opacity = 1; await G.drawIn(HA, 600, c); } },
      { cap: `<b>Step 2.</b> Where the line meets the guide lines ${T('y=1')} and ${T('y=-1')}, its reciprocal is the same number: the <b>invariant points</b>.`, run: async (c) => { await show(c, w2); for (const p of inv) { p.style.opacity = 1; await pop(c, p); } } },
      { cap: `<b>Step 3.</b> A few more points: take a point on the line and move it to the reciprocal of its height (${T('2\\to\\tfrac{1}{2}')}, small ${T('\\to')} big).`, run: async (c) => { await show(c, w3); for (const p of more) await fly(c, p); } },
      { cap: `<b>Step 4.</b> Two smooth branches through the points, bending toward both asymptotes, above the ${T('x')}-axis where the line is above it and below where it is below.`, run: async (c) => { await show(c, w4); left.style.opacity = 1; await G.drawIn(left, 900, c); right.style.opacity = 1; await G.drawIn(right, 900, c); await show(c, ans); } }
    ];
  }
};

/* =============================== explainer: features from the equation =============================== */
const FT = {
  a: { label: 'Example 5(a)', a: 1, b: 4, den: 'x+4', win: [-9.5, 1.5, -3.5, 3.5] },
  b: { label: '(b)', a: 3, b: -6, den: '3x-6', win: [-2.5, 5.5, -3.5, 3.5] },
  c: { label: '(c)', a: -2, b: 5, den: '5-2x', win: [-2.5, 6.5, -3.5, 3.5] }
};
const features = {
  title: 'Features straight from the equation',
  height: 500, minW: 940,
  choices: Object.keys(FT).map((k) => ({ v: k, label: FT[k].label })),
  ask: (v) => `Find the features of ${T(`y=\\dfrac{1}{${FT[v].den}}`)} without graphing.`,
  make(stage, v, ex) {
    const d = FT[v], W = ex.W, [x0, x1, y0, y1] = d.win, F = (x) => d.a * x + d.b, R = (x) => 1 / F(x), z = -d.b / d.a;
    const zT = fr(-d.b, d.a), i1 = fr(1 - d.b, d.a), i2 = fr(-1 - d.b, d.a), yT = fr(1, d.b);
    const PW = W - 470;
    const P = div(stage, 'u7l6-panel', '', 4, 4, PW, 492);
    div(P, 'u7l6-feq', T(`y=\\dfrac{1}{\\color{${BL}}{${d.den}}}`));
    const slot = (tag, colr, html) => { const s = div(P, 'u7l6-slot', `<b style="--sc:${colr}">${tag}</b><span>${html}</span>`); return hide(s); };
    const s1 = slot('denominator = 0', PU, `${T(`${d.den}=0\\Rightarrow x=${zT}`)}: vertical asymptote ${T(`x=${zT}`)}`);
    const s2 = slot('denominator = 1', GO, `${T(`${d.den}=1\\Rightarrow x=${i1}`)}: invariant point ${T(pt(i1, 1))}`);
    const s3 = slot('denominator = −1', GO, `${T(`${d.den}=-1\\Rightarrow x=${i2}`)}: invariant point ${T(pt(i2, -1))}`);
    const s4 = slot('x = 0', OR, `${T(`y=\\dfrac{1}{${d.b}}=${yT}`)}: the ${T('y')}-intercept`);
    const s5 = slot('domain, range', '#3a4254', `${T(`\\{x\\mid x\\ne${zT},\\ x\\in\\mathbb{R}\\}`)}, &nbsp;${T('\\{y\\mid y\\ne0,\\ y\\in\\mathbb{R}\\}')}`);
    const pos = d.a > 0 ? `x>${zT}` : `x<${zT}`;
    const s6 = slot('y > 0 when', GN, `${T(`${d.den}>0`)}: ${T(pos)}; the line ${d.a > 0 ? 'rises' : 'falls'}, so each branch ${d.a > 0 ? 'falls' : 'rises'}`);
    const G = new Graph(stage, { x: PW + 12, y: 4, width: W - PW - 16, height: 492, xmin: x0, xmax: x1, ymin: y0, ymax: y1, xlabels: 1, ylabels: 1, fontSize: 14, pad: [28, 16, 16, 16] });
    guides(G, 2);
    const VA = hide(G.vline(z, { color: PU, width: 3 }));
    const p1 = hide(G.point((1 - d.b) / d.a, 1, { color: GO, r: 7.5 })), p2 = hide(G.point((-1 - d.b) / d.a, -1, { color: GO, r: 7.5 }));
    const p3 = hide(G.point(0, 1 / d.b, { color: OR, r: 7.5 }));
    const sh = hide(G.shadeX(z, d.a > 0 ? Infinity : -Infinity, { openA: true, color: GN }));
    const left = hide(G.fn(R, { to: z - 1e-6, color: OR, width: 4.5 })), right = hide(G.fn(R, { from: z + 1e-6, color: OR, width: 4.5 }));
    const ptIn = async (c, p) => { p.style.opacity = 1; await pop(c, p); };
    return [
      { cap: `A fraction can’t have denominator ${T('0')}: solve ${T(`${d.den}=0`)}. That ${T('x')}-value is the <b>vertical asymptote</b>.`, run: async (c) => { await show(c, s1); VA.style.opacity = 1; await G.drawIn(VA, 600, c); } },
      { cap: `When the denominator is ${T('1')}, ${T('y=\\tfrac{1}{1}=1')}: solve ${T(`${d.den}=1`)} for the invariant point on ${T('y=1')}.`, run: async (c) => { await show(c, s2); await ptIn(c, p1); } },
      { cap: `When the denominator is ${T('-1')}, ${T('y=-1')}: solve ${T(`${d.den}=-1`)} for the other invariant point.`, run: async (c) => { await show(c, s3); await ptIn(c, p2); } },
      { cap: `${T('y')}-intercept: put ${T('x=0')}. The denominator becomes ${T(String(d.b))}, so ${T(`y=${yT}`)}.`, run: async (c) => { await show(c, s4); await ptIn(c, p3); } },
      { cap: `Every ${T('x')} works except the asymptote, and ${T('y')} is never ${T('0')}: the domain and range.`, run: (c) => show(c, s5) },
      { cap: `${T('y>0')} exactly where the denominator is positive: ${T(pos)}. The graph agrees.`, run: async (c) => { await show(c, s6); sh.style.opacity = 1; await G.drawIn(sh, 600, c); left.style.opacity = 1; await G.drawIn(left, 800, c); right.style.opacity = 1; await G.drawIn(right, 800, c); } }
    ];
  }
};

/* =============================== explainer: working backwards (procedure) =============================== */
const BW = {
  e7: { label: 'Example 7', m: 2, b: -3, z: 1.5, pt: [2, 1], win: [-2.5, 4.5, -4.5, 4.5] },
  demo: { label: 'Demo: asymptote x = 1, through (3, ½)', m: 1, b: -1, z: 1, pt: [3, 0.5], win: [-3.5, 5.5, -4.5, 4.5] }
};
const backwards = {
  title: 'From the reciprocal back to the line',
  height: 470, minW: 940,
  choices: Object.keys(BW).map((k) => ({ v: k, label: BW[k].label })),
  ask: (v) => (v === 'e7' ? `Example 7: asymptote ${T('x=1.5')}, invariant point ${T('(2,\\ 1)')}. Find ${T('f(x)')}.` : `The graph of ${T('y=\\tfrac{1}{f(x)}')} has asymptote ${T('x=1')} and passes through ${T('\\left(3,\\ \\tfrac{1}{2}\\right)')}. Find ${T('f(x)')}.`),
  make(stage, v, ex) {
    const d = BW[v], W = ex.W, [x0, x1, y0, y1] = d.win, F = (x) => d.m * x + d.b, R = (x) => 1 / F(x);
    const G = new Graph(stage, { x: 4, y: 4, width: 420, height: 462, xmin: x0, xmax: x1, ymin: y0, ymax: y1, xlabels: 1, ylabels: 1, fontSize: 15, pad: [28, 16, 16, 16] });
    G.vline(d.z, { color: PU, width: 3 });
    G.fn(R, { to: d.z - 1e-6, color: OR, width: 4.5 }); G.fn(R, { from: d.z + 1e-6, color: OR, width: 4.5 });
    const inv = v === 'e7';
    const [px, py] = d.pt, fy = 1 / py;   // the given point and its partner on the line
    const gp = G.point(px, py, { color: inv ? GO : OR, r: 8, label: inv ? T('(2,\\ 1)') : T('\\left(3,\\ \\tfrac{1}{2}\\right)'), pos: 'e' });
    const zp = hide(G.point(d.z, y1 - 0.3, { color: PU, r: 8 }));
    const zl = hide(G.label(d.z, 0, T(pt(tn(d.z), 0)), { pos: 'nw', color: PU, cls: 'bk-ptlab' }));
    const lp = inv ? null : hide(G.point(px, py, { color: BL, r: 8 }));
    const lpl = inv ? null : hide(G.label(px, fy, T(pt(px, tn(fy))), { pos: 'e', color: BL, cls: 'bk-ptlab', dx: 6 }));
    const L = hide(G.line({ m: d.m, b: d.b }, { color: BL, width: 4 }));
    const extra = inv ? hide(G.point(1, -1, { color: GO, r: 8 })) : null;
    const [ax, ay] = [d.z, 0], [bx, by] = [px, fy];
    const run_ = hide(G.segment([ax, ay], [bx, ay], { color: '#3a4254', width: 3 })), rise = hide(G.segment([bx, ay], [bx, by], { color: '#3a4254', width: 3 }));
    const runL = hide(G.label((ax + bx) / 2, ay, T(`\\text{run } ${tn(bx - ax)}`), { pos: 'n', cls: 'bk-ptlab' })), riseL = hide(G.label(bx, by / 2, T(`\\text{rise } ${tn(by)}`), { pos: 'e', cls: 'bk-ptlab', dx: 6 }));
    const yp = hide(G.point(0, 1 / d.b, { color: OR, r: 8, coords: false }));
    const yl = hide(G.label(0, 1 / d.b, T(pt(0, fr(1, d.b))), { pos: 'w', color: OR, cls: 'bk-ptlab', dx: -6 }));
    const P = div(stage, 'u7l6-panel', '<div class="u7l6-ph">Working backwards</div>', 440, 4, W - 444, 462);
    const bT = d.b < 0 ? `-${-d.b}` : `+${d.b}`, fT = `${d.m === 1 ? '' : d.m}x${d.b < 0 ? `-${-d.b}` : `+${d.b}`}`;
    const w1 = wl(P, 1, `Asymptote ${T(`x=${tn(d.z)}`)}: ${T(`f(${tn(d.z)})=0`)}, so ${T(pt(tn(d.z), 0))} is on the line.`);
    const w2 = wl(P, 2, inv ? `${T('(2,\\ 1)')} is an invariant point: it is on <b>both</b> graphs.` : `${T('\\left(3,\\ \\tfrac{1}{2}\\right)')} on the reciprocal: ${T('f(3)=\\tfrac{1}{1/2}=2')}, so ${T('(3,\\ 2)')} is on the line.`);
    const w3 = wl(P, 3, `Draw the line through the two points${inv ? ` (it also passes through the other invariant point ${T('(1,\\ -1)')})` : ''}.`);
    const w4 = wl(P, 4, `Slope ${T(`a=\\dfrac{${tn(by)}-0}{${tn(bx)}-${tn(ax)}}=${d.m}`)}; &nbsp;${T(`0=${d.m}(${tn(d.z)})+b\\Rightarrow b=${d.b}`)}. &nbsp;${T(`f(x)=${fT}`)}`);
    const w5 = wl(P, 5, `Check: the reciprocal’s ${T('y')}-intercept is ${T(`\\tfrac{1}{${d.b}}=${fr(1, d.b)}`)}, and the graph passes through ${T(pt(0, fr(1, d.b)))} ✓`);
    void bT;
    const ok = hide(stamp(G.html, '✓ matches', { ok: true, x: 236, y: 330, rotate: -8, size: 'sm' }));
    return [
      { cap: `<b>1.</b> The vertical asymptote is where ${T('f(x)=0')}: the zero of the line. Drop it onto the ${T('x')}-axis: ${T(pt(tn(d.z), 0))}.`, run: async (c) => { await show(c, w1); zp.style.opacity = 1; await pop(c, zp); await G.move(c, zp, d.z, 0, 700); await show(c, zl); } },
      { cap: inv ? `<b>2.</b> An invariant point has ${T('y=\\pm1')}, so it is on both graphs: ${T('(2,\\ 1)')} is on the line too.` : `<b>2.</b> Flip the point: height ${T('\\tfrac{1}{2}')} on the reciprocal means height ${T('2')} on the line. ${T('(3,\\ 2)')} is on the line.`,
        run: async (c) => { await show(c, w2); if (inv) await pulse(c, gp, 1.5); else { lp.style.opacity = 1; await pop(c, lp); await G.move(c, lp, px, fy, 800); await show(c, lpl); } } },
      { cap: `<b>3.</b> Two points determine the line: draw ${T('y=f(x)')} through them.`, run: async (c) => { await show(c, w3); L.style.opacity = 1; await G.drawIn(L, 800, c); if (extra) { extra.style.opacity = 1; await pop(c, extra); } } },
      { cap: `<b>4.</b> Slope from rise over run, then ${T('b')} from the zero: ${T(`f(x)=${fT}`)}.`, run: async (c) => { await show(c, w4); for (const e of [run_, rise]) { e.style.opacity = 1; await G.drawIn(e, 500, c); } await show(c, runL); await show(c, riseL); } },
      { cap: `<b>5.</b> Check with a feature you can see: the reciprocal of the line’s ${T('y')}-intercept ${T(String(d.b))} is ${T(fr(1, d.b))}, right where the graph crosses the ${T('y')}-axis.`, run: async (c) => { await show(c, w5); yp.style.opacity = 1; await pop(c, yp); await show(c, yl); await sIn(c, ok); } }
    ];
  }
};

/* =============================== explainer: matching (Example 8) =============================== */
const MG = [{ k: 'A', f: (x) => 1 / (2 * x - 6), z: 3 }, { k: 'B', f: (x) => 1 / (x + 3), z: -3 }, { k: 'C', f: (x) => 1 / (3 - x), z: 3 }, { k: 'D', f: (x) => 1 / (x - 3), z: 3 }];
const EQ = [{ n: '(i)', t: 'y=\\dfrac{1}{x+3}', to: 1 }, { n: '(ii)', t: 'y=\\dfrac{1}{2x-6}', to: 0 }, { n: '(iii)', t: 'y=\\dfrac{1}{x-3}', to: 3 }, { n: '(iv)', t: 'y=\\dfrac{1}{3-x}', to: 2 }];
const match = {
  title: 'Match each equation with its graph',
  height: 400, minW: 940,
  ask: () => `Example 8: match ${T('\\tfrac{1}{x+3}')}, ${T('\\tfrac{1}{2x-6}')}, ${T('\\tfrac{1}{x-3}')}, ${T('\\tfrac{1}{3-x}')} with graphs A–D.`,
  make(stage, v, ex) {
    const W = ex.W, gap = 12, gw = Math.floor((W - 8 - 3 * gap) / 4), gh = 214;
    const Gs = MG.map((m, i) => {
      const box_ = div(stage, 'u7l6-mg', `<b>${m.k}</b>`, 4 + i * (gw + gap), 4, gw, gh);
      const G = new Graph(box_, { width: gw - 4, height: gh - 4, xmin: -6.5, xmax: 6.5, ymin: -3.5, ymax: 3.5, xlabels: 3, ylabels: 1, fontSize: 12, pad: [22, 12, 10, 12] });
      guides(G, 2); G.fn(m.f, { to: m.z - 1e-6, color: OR, width: 3.5 }); G.fn(m.f, { from: m.z + 1e-6, color: OR, width: 3.5 });
      G.va = hide(G.vline(m.z, { color: PU, width: 2.5 }));
      G.left = hide(G.point(0, m.f(0), { color: m.f(0) > 0 ? GN : '#c93a33', r: 6.5 }));
      G.inv = hide(G.point(m.z + (m.k === 'A' ? 0.5 : 1), 1, { color: GO, r: 6.5 }));
      return G;
    });
    const slotX = (i) => 4 + i * (gw + gap) + gw / 2;
    const cards = EQ.map((e, i) => { const cd = div(stage, 'u7l6-card', `<b>${e.n}</b> ${T(e.t)}`); cd.style.position = 'absolute'; cd._home = [40 + i * ((W - 80) / 4), gh + 74]; return cd; });
    const placeCard = (cd, x, y) => { cd.style.left = (x - cd.offsetWidth / 2) + 'px'; cd.style.top = y + 'px'; };
    cards.forEach((cd) => { cd.style.left = cd._home[0] + 'px'; cd.style.top = cd._home[1] + 'px'; });
    const slide = (c, cd, i) => { const x0 = parseFloat(cd.style.left), y0 = parseFloat(cd.style.top), x1 = slotX(i) - cd.offsetWidth / 2, y1 = gh + 16; return tween(c, 700, (t) => { cd.style.left = (x0 + (x1 - x0) * t) + 'px'; cd.style.top = (y0 + (y1 - y0) * t) + 'px'; }).then(() => placeCard(cd, slotX(i), gh + 16)); };
    const note = div(stage, 'u7l6-ansl', '', 4, gh + 138, W - 8); hide(note);
    const st = MG.map((m, i) => hide(stamp(stage, '✓', { ok: true, x: 4 + i * (gw + gap) + gw - 46, y: 26, rotate: -8, size: 'sm' })));
    const done = async (c, k) => { const e = EQ[k]; await slide(c, cards[k], e.to); cards[k].classList.add('ok'); await sIn(c, st[e.to]); };
    return [
      { cap: `Clue 1, the <b>vertical asymptote</b>: ${T('x+3=0')} at ${T('x=-3')}. Only graph <b>B</b> has its asymptote there; the other three have ${T('x=3')}.`, run: async (c) => { for (const G of Gs) { G.va.style.opacity = 1; await G.drawIn(G.va, 350, c); } await done(c, 0); } },
      { cap: `Clue 2, the <b>sign</b>: for (iv), at ${T('x=0')} the denominator ${T('3-x')} is ${T('3>0')}, so the left branch is <b>above</b> the ${T('x')}-axis. Only <b>C</b>.`, run: async (c) => { for (const k of [0, 2, 3]) { const p = Gs[k].left; p.style.opacity = 1; await pop(c, p); } await done(c, 3); } },
      { cap: `Clue 3, the <b>invariant point</b> on ${T('y=1')}: (iii) ${T('x-3=1')} at ${T('x=4')}, so <b>D</b>; (ii) ${T('2x-6=1')} at ${T('x=3.5')}, so <b>A</b>.`, run: async (c) => { for (const k of [3, 0]) { const p = Gs[k].inv; p.style.opacity = 1; await pop(c, p); } await done(c, 2); await done(c, 1); } },
      { cap: `(ii) reaches ${T('y=1')} closer to its asymptote, so it hugs the axes more closely. All four matched.`, run: async (c) => { note.innerHTML = `(i) ${T('\\to')} <b>B</b> &nbsp;·&nbsp; (ii) ${T('\\to')} <b>A</b> &nbsp;·&nbsp; (iii) ${T('\\to')} <b>D</b> &nbsp;·&nbsp; (iv) ${T('\\to')} <b>C</b>`; await show(c, note); await pulse(c, Gs[0].inv, 1.6); } }
    ];
  }
};

/* =============================== Stand Up Break =============================== */
const sgnT = (n) => (n < 0 ? `-${-n}` : `+${n}`);
const linT = (a, b) => `${a === 1 ? '' : a === -1 ? '-' : a}x${b ? sgnT(b) : ''}`;
standup('u7l6', {
  intro: 'At your whiteboard: find the features of each reciprocal straight from the equation, or work backwards to the line.',
  levels: {
    BEG: (r) => { // 1/(x + p): asymptotes and y-intercept
      const p = r.pick([-9, -8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      return { text: 'State the vertical asymptote, the horizontal asymptote and the y-intercept.', q: `y=\\dfrac{1}{x${sgnT(p)}}`,
        a: [`x${sgnT(p)}=0\\Rightarrow\\text{vertical asymptote } x=${-p}`, '\\text{horizontal asymptote } y=0', `y\\text{-intercept } \\dfrac{1}{${p}}=${fr(1, p)}`] };
    },
    PRG: (r) => { // 1/(ax + b): asymptote, invariant points, domain
      const a = r.pick([2, 3, 4, 5, -2, -3]), b = r.pick([-9, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 9]);
      return { text: 'State the vertical asymptote, the invariant points and the domain.', q: `y=\\dfrac{1}{${linT(a, b)}}`,
        a: [`${linT(a, b)}=0\\Rightarrow x=${fr(-b, a)}`, `${linT(a, b)}=1\\Rightarrow x=${fr(1 - b, a)}:\\ \\left(${fr(1 - b, a)},\\ 1\\right)`, `${linT(a, b)}=-1\\Rightarrow x=${fr(-1 - b, a)}:\\ \\left(${fr(-1 - b, a)},\\ -1\\right)`,
          `\\left\\{x\\mid x\\ne${fr(-b, a)},\\ x\\in\\mathbb{R}\\right\\}`] };
    },
    MAS: (r) => { // working backwards: asymptote x = h and one point → f(x)
      const m = r.pick([1, 2, 3, -1, -2]), hh = r.int(-5, 5), dd = r.pick([1, 2, -1, -2].filter((k) => Math.abs(m * k) <= 6)), x1 = hh + dd, fv = m * dd;
      const yT = fr(1, fv), c0 = -m * hh, wrap = (n) => (n < 0 ? `(${n})` : String(n));
      return { text: 'The graph of y = 1/f(x), where f is linear, has this vertical asymptote and passes through this point. Determine f(x).',
        q: `x=${hh},\\qquad \\left(${x1},\\ ${yT}\\right)`,
        a: [`f(${hh})=0,\\qquad f(${x1})=\\dfrac{1}{${yT}}=${fv}`, `\\text{slope}=\\dfrac{${fv}-0}{${x1}-${wrap(hh)}}=${m}`, `0=${m}${wrap(hh)}+b\\Rightarrow b=${c0}`, `f(x)=${linT(m, c0)}`] };
    }
  }
});

/* =============================== mount =============================== */
export const explainers = mountExplainers({ partner, sketch, features, backwards, match });
export const _test = { PT, SK, FT, BW };
void [shake, linear, svgEl, COLORS];
