/* Math 20-1 · Unit 2 · Lesson 2 — Radicals with Variables and Their Restrictions.
 * New lesson format (2026-11-11, tools/newformat/specs/u2l2.py): the page no longer has the old warm-up or the explainers flip, radgraph, abs, allowed7, shapes;
 * their code below is unused (each mount is skipped when its element is missing).
 * Warm-up (The Root Machine: numbered balls dropped into √(x − 6); some jam it. Flip the switch to ∛(x − 6): none do.)
 * and the explainers:
 *   allowed (STAR: solve the radicand's inequality, shade the allowed x-values on a number line, then a probe that turns
 *     red where the radicand is negative (or 0 in a denominator); the probe can be dragged; Example 1 (a)–(f) and 2(d)
 *     checks), allowed7 (the same picture for Example 7),
 *   flip (why dividing by a negative reverses the sign: points mirrored across 0; −3x ≥ −9 tested value by value),
 *   radgraph (graph of the radicand: where it is on or above the x-axis; Example 2 checks),
 *   groups (STAR: x⁷ as seven x-tiles under the root; groups of the index escape as one tile each, the remainder stays;
 *     Example 3 checks),
 *   abs (√(x²) = |x|: x and √(x²) on a number line, mirror images for negative x; ∛(x³) = x always),
 *   split (number and each variable sorted into "comes out" / "stays in"; Example 4 checks),
 *   entire (mixed → entire: the factors in front are raised to the index and move inside; Example 5 checks),
 *   checklist (simplest-form checklist stamps on five candidate answers),
 *   shapes (Example 6: square side, cube edge, hypotenuse).
 * Colours (Unit 2): coefficient / what comes out teal, radicand / what stays in purple, index amber,
 * allowed green, not allowed red. */
import {
  h, tex, add, box, Graph, NumberLine, stamp, stampIn, mountExplainers, pop, fadeIn, appear, sleep, tween,
  svgEl, liveCtx, pulse, shake, place, anim, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const CC = '#0f7c80', CR = COLORS.purple, CI = COLORS.amber, OK = COLORS.green, NO = COLORS.red, INK = COLORS.ink, GRAY = COLORS.gray;
const cC = (s) => `\\textcolor{${CC}}{${s}}`, cR = (s) => `\\textcolor{${CR}}{${s}}`, cI = (s) => `\\textcolor{${CI}}{${s}}`;
const cG = (s) => `\\textcolor{${OK}}{${s}}`, cX = (s) => `\\textcolor{${NO}}{${s}}`;
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const hideP = (p) => { hide(p); hide(p.label); return p; };
const panel = (stage, x, y, w, hh, title, cls = '') => add(stage, box(h('div', 'u2l2-panel ' + cls, title ? `<div class="u2l2-ph">${title}</div>` : ''), w, hh), x, y);
const line = (p, html, cls = '') => { const d = h('div', 'u2l2-line ' + cls, html); p.appendChild(d); return d; };
const hidLine = (p, html, cls) => hide(line(p, html, cls));
const absEl = (stage, cls, html, x, y, pos = 'c', gap = 0) => { const d = h('div', 'u2l2-abs ' + cls, html); stage.appendChild(d); return place(d, x, y, pos, gap); };
/** move an absolutely placed element to (x, y) */
const mv = (c, el, x, y, ms = 600) => anim(c, el, [{ left: el.style.left, top: el.style.top }, { left: x + 'px', top: y + 'px' }], ms);

/* ---------------- radical maths ---------------- */
const rt = (body, k) => (k === 2 ? `\\sqrt{${body}}` : `\\sqrt[${k}]{${body}}`);
const rtI = (body, k) => (k === 2 ? `\\sqrt{${body}}` : `\\sqrt[${cI(k)}]{${body}}`); // index in amber
const powT = (v, e) => (e === 0 ? '' : e === 1 ? v : `${v}^{${e}}`);
const P = (x) => `(${x})`;
/** k-th root of an integer → [out, in] with out^k · in = n; null for a negative under an even index */
function rootSplit(n, k) {
  if (n === 0) return [0, 1];
  let s = 1; if (n < 0) { if (k % 2 === 0) return null; s = -1; n = -n; }
  let out = 1, inn = n;
  for (let p = 2; Math.pow(p, k) <= inn; p++) { const pk = Math.pow(p, k); while (inn % pk === 0) { inn /= pk; out *= p; } }
  return [s * out, inn];
}
/** TeX of the simplified k-th root of an integer */
function rootT(n, k) {
  const r = rootSplit(n, k); if (!r) return null;
  const [o, i] = r; if (i === 1) return String(o);
  return (o === 1 ? '' : o === -1 ? '-' : String(o)) + rt(i, k);
}
/** a monomial radical rt(n·x^e·…, k) simplified. vars: [[v, e], …] */
function simp(n, vars, k) {
  const [o, i] = rootSplit(n, k), perf = Math.round(Math.sign(n) * Math.pow(Math.abs(o), k));
  const vs = vars.map(([v, e]) => ({ v, e, q: Math.floor(e / k), r: e % k }));
  const coefStr = (num, parts) => { const p = parts.join(''); if (!p) return String(num); return (num === 1 ? '' : num === -1 ? '-' : String(num)) + p; };
  const outT = coefStr(o, vs.map((x) => powT(x.v, x.q)));
  const inParts = vs.map((x) => powT(x.v, x.r)).join('');
  const inT = i === 1 ? inParts : String(i) + inParts;
  const resT = inT === '' ? outT : (outT === '1' ? '' : outT === '-1' ? '-' : outT) + rt(inT, k);
  // the booklet's split: 9·2·x²·x
  const fac = [];
  if (Math.abs(n) !== 1) { if (perf !== 1) fac.push(String(perf)); if (i !== 1) fac.push(String(i)); if (perf === 1 && i === 1) fac.push(String(n)); }
  vs.forEach((x) => { if (x.q) fac.push(powT(x.v, x.q * k)); if (x.r) fac.push(powT(x.v, x.r)); });
  const radT = (n === 1 ? '' : n === -1 ? '-' : String(n)) + vars.map(([v, e]) => powT(v, e)).join('');
  return { o, i, perf, vs, outT, inT, resT, facT: fac.join('\\cdot '), radT, even: k % 2 === 0 };
}
const restrT = (vars) => { const vs = vars.map((x) => x[0]); return vs.length === 1 ? `${vs[0]}\\ge0` : `${vs.join(',')}\\ge0`; };

/* ---------------- the radical sign (SVG path) ---------------- */
function radPath(x, y, w, hgt) { // tick at x, vinculum at y from x + 0.5·hgt to … + w
  const a = [x, y + hgt * 0.62], b = [x + hgt * 0.13, y + hgt * 0.53], c = [x + hgt * 0.3, y + hgt], d = [x + hgt * 0.5, y], e = [x + hgt * 0.5 + w, y];
  return `M${a} L${b} L${c} L${d} L${e}`.replace(/,/g, ' ');
}
function radSign(svg, x, y, w, hgt, o = {}) {
  const p = svgEl('path', { d: radPath(x, y, w, hgt), fill: 'none', stroke: o.color || INK, 'stroke-width': o.width || 4, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, svg);
  p.setW = (w2) => p.setAttribute('d', radPath(x, y, w2, hgt));
  return p;
}
const stageSvg = (stage, W, H) => { const s = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u2l2-abs u2l2-ssvg' }, stage); s.style.left = '0px'; s.style.top = '0px'; return s; };

/* ====================================================================================================
 * Warm-up: The Root Machine
 * ==================================================================================================== */
const BALLS = [-2, 5, 6, 7, 10, 14, 15, 22, 33];
function mountMachine() {
  const host = document.getElementById('u2l2-mach'); if (!host) return;
  const W = Math.max(480, Math.min(560, host.clientWidth || 540)), MH = 236;
  host.style.position = 'relative'; host.style.height = (MH + 78) + 'px';
  const svg = svgEl('svg', { width: W, height: MH, viewBox: `0 0 ${W} ${MH}`, class: 'u2l2-msvg' }, host);
  const bx = 70, bw = W - 230, by = 58, bh = 160, cx = bx + bw / 2;
  svgEl('polygon', { points: `${cx - 70},4 ${cx + 70},4 ${cx + 26},${by} ${cx - 26},${by}`, fill: '#d9d4c7', stroke: '#6e6a60', 'stroke-width': 2.5 }, svg);
  const body = svgEl('g', {}, svg);
  svgEl('rect', { x: bx, y: by, width: bw, height: bh, rx: 16, fill: '#2e3c4f', stroke: '#1c2230', 'stroke-width': 3 }, body);
  svgEl('rect', { x: bx + bw, y: by + bh - 64, width: 46, height: 26, fill: '#4a5870', stroke: '#1c2230', 'stroke-width': 2.5 }, body); // output chute
  svgEl('rect', { x: bx + 22, y: by + 62, width: bw - 44, height: 84, rx: 8, fill: '#dfe9d0', stroke: '#9fb08a', 'stroke-width': 2 }, body);
  const lamp = svgEl('circle', { cx: bx + bw - 22, cy: by + 22, r: 10, fill: '#5b6b52', stroke: '#1c2230', 'stroke-width': 2 }, body);
  const plate = h('div', 'u2l2-mplate'); host.appendChild(place(plate, cx, by + 30, 'c'));
  const scr = h('div', 'u2l2-mscr'); host.appendChild(scr); scr.style.left = (bx + 32) + 'px'; scr.style.top = (by + 66) + 'px'; scr.style.width = (bw - 64) + 'px';
  const outB = h('div', 'u2l2-mout'); host.appendChild(outB); outB.style.left = (bx + bw + 52) + 'px'; outB.style.top = (by + bh - 92) + 'px';
  const jam = h('div', 'u2l2-mjam', 'JAM!'); host.appendChild(place(jam, cx, by + 26, 'c')); jam.style.opacity = 0;
  const rack = h('div', 'u2l2-rack'); host.appendChild(rack); rack.style.top = (MH + 8) + 'px';
  const st = { mode: 2, busy: false, used: { 2: {}, 3: {} } };
  const btns = BALLS.map((v) => {
    const b = h('button', 'u2l2-ball', String(v).replace('-', '−')); b.type = 'button'; b.dataset.v = v; rack.appendChild(b);
    b.addEventListener('click', () => drop(v, b)); return b;
  });
  const sw = document.getElementById('u2l2-switch'), rs = document.getElementById('u2l2-wreset');
  const paint = () => {
    plate.innerHTML = T(st.mode === 2 ? '\\sqrt{x-6}' : '\\sqrt[3]{x-6}');
    btns.forEach((b) => { const u = st.used[st.mode][b.dataset.v]; b.classList.toggle('u2l2-bok', u === 'ok'); b.classList.toggle('u2l2-bno', u === 'no'); });
    if (sw) sw.innerHTML = 'Flip the switch: ' + T(st.mode === 2 ? '\\sqrt[3]{\\ }' : '\\sqrt{\\ }');
  };
  const clearOut = () => { scr.innerHTML = '<div class="u2l2-mhint">Tap a ball to drop it in.</div>'; outB.innerHTML = ''; outB.style.opacity = 0; jam.style.opacity = 0; lamp.setAttribute('fill', '#5b6b52'); };
  async function drop(v, b) {
    if (st.busy) return; st.busy = true; const c = liveCtx();
    clearOut();
    const hb = host.getBoundingClientRect(), bb = b.getBoundingClientRect();
    const ball = h('div', 'u2l2-ball u2l2-fly', b.textContent); host.appendChild(ball);
    ball.style.left = (bb.left - hb.left) + 'px'; ball.style.top = (bb.top - hb.top) + 'px';
    await mv(c, ball, cx - 25, -6, 520); await mv(c, ball, cx - 25, by - 30, 260); ball.remove();
    const r = v - 6, k = st.mode, val = rootT(r, k);
    scr.innerHTML = `<div>${T(`x=${v}`)}</div>`; await sleep(c, 250);
    scr.innerHTML += `<div>${T(`x-6=${r}`)}</div>`; await sleep(c, 300);
    if (val == null) {
      scr.innerHTML += `<div>${T(`\\sqrt{${r}}=\\ ?`)}</div>`;
      lamp.setAttribute('fill', NO); jam.style.opacity = 1; await shake(c, body); await pop(c, jam, 300);
      st.used[k][v] = 'no';
    } else {
      scr.innerHTML += `<div>${T(val === rt(r, k) ? val : `${rt(r, k)}=${val}`)}</div>`;
      lamp.setAttribute('fill', '#7fd36b'); outB.innerHTML = T(val); await pop(c, outB, 340);
      st.used[k][v] = 'ok';
    }
    paint(); st.busy = false;
  }
  if (sw) sw.addEventListener('click', () => { if (st.busy) return; st.mode = st.mode === 2 ? 3 : 2; clearOut(); paint(); });
  if (rs) rs.addEventListener('click', () => { if (st.busy) return; st.mode = 2; st.used = { 2: {}, 3: {} }; clearOut(); paint(); });
  clearOut(); paint();
}

/* ====================================================================================================
 * explainer: allowed — the star. Inequality → shaded number line → probe.
 * ==================================================================================================== */
const AL = {
  a: { label: '(a)', k: 2, expr: '\\sqrt{x-6}', f: (x) => x - 6, sub: (x) => `${x}-6`,
    lines: [['x-6\\ge0'], ['x\\ge6', 'Add 6 to both sides.']], b: 6, bT: '6', dir: 'ge', solT: 'x\\ge6', min: -2, max: 12, probes: [10, 4] },
  b: { label: '(b)', k: 2, expr: '\\sqrt{2x+5}', f: (x) => 2 * x + 5, sub: (x) => `2${P(x)}+5`,
    lines: [['2x+5\\ge0'], ['2x\\ge-5', 'Subtract 5.'], ['x\\ge-\\dfrac52', 'Divide by 2: positive, so the sign stays.']], b: -2.5, bT: '-\\tfrac52', dir: 'ge', solT: 'x\\ge-\\dfrac52', min: -6, max: 6, probes: [2, -3] },
  c: { label: '(c)', k: 2, expr: '\\sqrt{9-3x}', f: (x) => 9 - 3 * x, sub: (x) => `9-3${P(x)}`,
    lines: [['9-3x\\ge0'], ['-3x\\ge-9', 'Subtract 9.'], ['x\\le3', 'Divide by −3: the sign <b>reverses</b>.']], b: 3, bT: '3', dir: 'le', solT: 'x\\le3', min: -4, max: 8, probes: [0, 5] },
  d: { label: '(d)', k: 3, expr: '\\sqrt[3]{x-4}', f: (x) => x - 4, sub: (x) => `${x}-4`, odd: true, solT: 'x\\in\\mathbb{R}', min: -6, max: 14, labelStep: 2, probes: [-4, 12] },
  e: { label: '(e)', k: 4, expr: '\\sqrt[4]{-x}', f: (x) => -x, sub: (x) => `-${P(x)}`,
    lines: [['-x\\ge0'], ['x\\le0', 'Multiply by −1: the sign <b>reverses</b>.']], b: 0, bT: '0', dir: 'le', solT: 'x\\le0', min: -6, max: 6, probes: [-1, 3] },
  f: { label: '(f)', k: 2, expr: '\\sqrt{12x}', f: (x) => 12 * x, sub: (x) => `12${P(x)}`,
    lines: [['12x\\ge0'], ['x\\ge0', 'Divide by 12.']], b: 0, bT: '0', dir: 'ge', solT: 'x\\ge0', min: -5, max: 6, probes: [3, -1] },
  den: { label: '2(d)', k: 2, expr: '\\dfrac{8}{\\sqrt{x+2}}', f: (x) => x + 2, sub: (x) => `${x}+2`, den: 8,
    lines: [['x+2\\ge0\\ \\text{and}\\ \\sqrt{x+2}\\ne0'], ['x+2>0', 'So the radicand must be <b>greater than</b> 0.'], ['x>-2', 'Subtract 2.']], b: -2, bT: '-2', dir: 'gt', solT: 'x>-2', min: -6, max: 6, probes: [2, -2] },
  ex7: { label: 'Example 7 check', k: 2, expr: '\\sqrt{20-4x}', f: (x) => 20 - 4 * x, sub: (x) => `20-4${P(x)}`,
    lines: [['20-4x\\ge0'], ['-4x\\ge-20', 'Subtract 20.'], ['x\\le5', 'Divide by −4: the sign <b>reverses</b>.']], b: 5, bT: '5', dir: 'le', solT: 'x\\le5', min: -8, max: 8, probes: [-5, 2, 6] }
};
/** what the probe shows at x: { ok, short (bubble TeX), full (caption TeX) } */
function probeRead(d, x) {
  const r = d.f(x), rr = Math.round(r * 1000) / 1000, k = d.k, isInt = Number.isInteger(rr);
  const rootOf = (body) => rt(body, k);
  if (k % 2 === 0 && rr < 0) return { ok: false, short: rootOf(cX(rr)), full: `${rootOf(d.sub(x))}=${rootOf(rr)}`, why: 'not a real number' };
  if (d.den && rr === 0) return { ok: false, short: `\\dfrac{${d.den}}{${cX(0)}}`, full: `\\dfrac{${d.den}}{\\sqrt{${d.sub(x)}}}=\\dfrac{${d.den}}{\\sqrt0}=\\dfrac{${d.den}}{0}`, why: 'you cannot divide by 0' };
  if (!isInt) return { ok: true, short: rootOf(cG(rr)), full: rootOf(rr), why: '' };
  const v = rootT(rr, k);
  if (d.den) {
    const [o, i] = rootSplit(rr, k), q = i === 1 && d.den % o === 0 ? String(d.den / o) : null;
    return { ok: true, short: `\\dfrac{${d.den}}{${rootOf(cG(rr))}}`, full: `\\dfrac{${d.den}}{\\sqrt{${d.sub(x)}}}=\\dfrac{${d.den}}{${rootOf(rr)}}` + (q ? `=\\dfrac{${d.den}}{${o}}=${q}` : ''), why: '' };
  }
  const full = `${rootOf(d.sub(x))}=${rootOf(rr)}` + (v !== rootOf(rr) ? `=${v}` : '');
  return { ok: true, short: rootOf(cG(rr)) + (v !== rootOf(rr) ? `=${v}` : ''), full, why: '' };
}
function allowedDef(keys, title) {
  return {
    title,
    height: 410,
    minW: 860,
    tap: true,
    choices: keys.length > 1 ? [{ sep: 'Example 1 check:' }].concat(keys.map((k) => ({ v: k, label: AL[k].label }))) : keys.map((k) => ({ v: k, label: AL[k].label })),
    intro: (k) => `State the restriction on ${T(AL[k].expr)}, then test it with the probe. Press <b>Next</b>.`,
    make(stage, key, ex) {
      const d = AL[key], W = ex.W, k = d.k, even = k % 2 === 0;
      // expression card
      const exprT = d.expr.replace(/\\sqrt(\[\d\])?\{([^{}]*)\}/, (m, idx, body) => (idx ? `\\sqrt[${cI(k)}]{${cR(body)}}` : `\\sqrt{${cR(body)}}`));
      const E = panel(stage, 14, 10, 250, 132, '', 'u2l2-exprc');
      E.innerHTML = `<div class="u2l2-exprbig">${T(exprT)}</div><div class="u2l2-idx">index ${T(cI(k))}: <b style="color:${CI}">${even ? 'even' : 'odd'}</b>${d.den ? ', in a denominator' : ''}</div>`;
      const S = panel(stage, 282, 10, W - 296, 132, '', 'u2l2-solvep');
      const L = (d.odd ? [[`\\text{odd index: no restriction}`]] : d.lines).map(([t, note]) => hidLine(S, T(t) + (note ? `<span class="u2l2-note">${note}</span>` : ''), 'u2l2-sline'));
      // number line
      const N = new NumberLine(stage, { x: 0, y: 150, width: W, height: 176, min: d.min, max: d.max, step: 1, labelStep: d.labelStep || 1, axisY: 124, pad: 34, fontSize: 18 });
      let shade;
      if (d.odd) shade = N.interval(-Infinity, Infinity, { color: OK, width: 10 });
      else if (d.dir === 'ge' || d.dir === 'gt') shade = N.interval(d.b, Infinity, { color: OK, width: 10, openA: d.dir === 'gt' });
      else shade = N.interval(-Infinity, d.b, { color: OK, width: 10, openB: d.dir === 'lt' });
      shade.style.opacity = 0;
      const bLab = d.odd ? null : hide(N.mark(d.b, T(cG(d.bT)), { pos: 's', cls: 'u2l2-blab' }));
      if (bLab) bLab.style.top = (N.ay + 40) + 'px';
      // the probe
      const pg = svgEl('g', {}, N.layers.top); hide(pg);
      const stem = svgEl('line', { x1: 0, x2: 0, y1: N.ay - 12, y2: N.ay - 36, stroke: INK, 'stroke-width': 2.5 }, pg);
      const dot = svgEl('circle', { cx: 0, cy: N.ay, r: 11, fill: OK, stroke: '#fff', 'stroke-width': 3 }, pg);
      const bub = h('div', 'u2l2-pbub', ''); N.html.appendChild(bub); hide(bub);
      const handle = h('div', 'u2l2-phandle'); handle.setAttribute('data-tap', ''); N.html.appendChild(handle); handle.style.display = 'none';
      const pr = { x: d.probes[0] };
      const setP = (x) => {
        pr.x = x; const px = N.toPx(x), R = probeRead(d, x);
        dot.setAttribute('cx', px); stem.setAttribute('x1', px); stem.setAttribute('x2', px);
        dot.setAttribute('fill', R.ok ? OK : NO); bub.classList.toggle('u2l2-pbad', !R.ok);
        bub.innerHTML = `<div class="u2l2-pbx">${T('x=' + (Math.round(x * 10) / 10))}</div><div>${T(R.short)} ${R.ok ? '<b class="u2l2-cok">✓</b>' : '<b class="u2l2-cno">✗</b>'}</div>`;
        place(bub, Math.max(96, Math.min(W - 96, px)), N.ay - 34, 'n', 0);
        place(handle, px, N.ay, 'c', 0);
      };
      setP(pr.x);
      const drag = (e) => { const [px] = N.pxOf(e); let x = Math.round(N.fromPx(px) * 2) / 2; x = Math.max(d.min, Math.min(d.max, x)); setP(x); };
      [handle, bub].forEach((el) => {
        el.addEventListener('pointerdown', (e) => { if (handle.style.display === 'none') return; e.preventDefault(); e.stopPropagation(); el.setPointerCapture(e.pointerId); el._drag = true; drag(e); });
        el.addEventListener('pointermove', (e) => { if (el._drag) drag(e); });
        const up = (e) => { el._drag = false; try { el.releasePointerCapture(e.pointerId); } catch (er) { /* */ } };
        el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
      });
      const verdict = hide(absEl(stage, 'u2l2-verdict', `Restriction: ${T(cG(d.solT))}`, W / 2, 392, 'n'));
      const moveP = async (c, x) => {
        if (pg.style.opacity === '0') { setP(x); await appear(c, pg, 260); await show(c, bub); return; }
        const x0 = pr.x; await tween(c, 650, (t) => setP(x0 + (x - x0) * t)); setP(x);
      };
      const steps = [];
      if (d.odd) {
        steps.push({ cap: `Odd index (${k}): <b>any</b> radicand works. ${T('\\sqrt[3]{-8}=-2')}, because ${T('(-2)^3=-8')}.`, run: (c) => show(c, L[0]) });
        steps.push({ cap: `So <b>every</b> ${T('x')} is allowed: shade the whole number line.`, run: (c) => appear(c, shade, 500) });
      } else {
        steps.push({ cap: d.den ? `In a denominator: the radicand must be ${T('\\ge0')} <b>and</b> the root cannot be 0.` : `Even index (${k}): the radicand must be ${T('\\ge0')}. Set ${T(cR(d.lines[0][0].replace('\\ge0', '')))} ${T('\\ge0')}.`,
          run: (c) => show(c, L[0]) });
        d.lines.slice(1).forEach(([t, note], i) => steps.push({ cap: `${note || 'Solve.'} So ${T(t)}.`, run: (c) => show(c, L[i + 1]) }));
        const dirW = d.dir === 'le' ? 'left' : 'right';
        steps.push({ cap: d.den ? `Shade the allowed values: an <b>open</b> dot at ${T(d.bT)} (there ${T('\\tfrac{8}{\\sqrt0}')} would divide by 0), arrow to the right.`
          : `Shade the allowed values: a <b>closed</b> dot at ${T(d.bT)} (the radicand is 0 there, and ${T(rt(0, k) + '=0')} is fine), arrow to the ${dirW}.`,
        run: async (c) => { await appear(c, shade, 600); await show(c, bLab); } });
      }
      d.probes.forEach((x) => {
        const R = probeRead(d, x);
        steps.push({ cap: R.ok ? `Test ${T('x=' + x)}: ${T(R.full)} ✓ It is in the shading.` : `Test ${T('x=' + x)}: ${T(R.full)}: <b class="u2l2-cno">${R.why}</b> ✗ It is outside the shading.`,
          run: (c) => moveP(c, x) });
      });
      steps.push({ cap: `Restriction: ${T(cG(d.solT))}. <b>Drag the probe</b>: it turns <b class="u2l2-cno">red</b> ${d.odd ? 'nowhere: an odd root is real for every x' : 'everywhere outside the shading'}.`,
        run: async (c) => { await show(c, verdict); handle.style.display = ''; bub.classList.add('u2l2-pdrag'); await pulse(c, verdict, 1.06); } });
      return steps;
    }
  };
}
const allowed = allowedDef(['a', 'b', 'c', 'd', 'e', 'f', 'den'], 'Which x-values are allowed?');
allowed.choices = [{ sep: 'Example 1 check:' }, ...['a', 'b', 'c', 'd', 'e', 'f'].map((k) => ({ v: k, label: AL[k].label })), { sep: 'Example 2:' }, { v: 'den', label: '(d)' }];
const allowed7 = allowedDef(['ex7'], 'Example 7: allowed, or not real?');

/* ====================================================================================================
 * explainer: flip — why the inequality sign reverses
 * ==================================================================================================== */
const flip = {
  title: 'Why does the sign reverse?',
  height: 400,
  minW: 860,
  choices: [{ v: 'mirror', label: 'Multiply by −1' }, { v: 'test', label: 'Example 1(c): ' + T('-3x\\ge-9') }],
  intro: (k) => (k === 'mirror' ? `Start with ${T('2<5')} and multiply both sides by ${T('-1')}. Press <b>Next</b>.` : `Which ${T('x')}-values make ${T('-3x\\ge-9')} true? Test them one by one. Press <b>Next</b>.`),
  make(stage, key, ex) {
    const W = ex.W;
    if (key === 'mirror') {
      const N = new NumberLine(stage, { x: 0, y: 30, width: W, height: 190, min: -7, max: 7, step: 1, axisY: 120, fontSize: 18 });
      const A = N.point(2, { color: 'blue', r: 11 }), B = N.point(5, { color: CI, r: 11 });
      const la = N.hlabel(N.toPx(2), N.ay - 16, T('\\textcolor{#1f5bd6}{2}'), { pos: 'n', gap: 0, cls: 'u2l2-nlab' }), lb = N.hlabel(N.toPx(5), N.ay - 16, T(cI('5')), { pos: 'n', gap: 0, cls: 'u2l2-nlab' });
      [A, B, la, lb].forEach(hide);
      const zero = svgEl('line', { x1: N.toPx(0), x2: N.toPx(0), y1: N.ay - 80, y2: N.ay + 10, stroke: GRAY, 'stroke-width': 2, 'stroke-dasharray': '6 5' }, N.layers.data); hide(zero);
      const arcs = svgEl('g', {}, N.layers.data); hide(arcs);
      [[2, -2, '#1f5bd6'], [5, -5, CI]].forEach(([a, b, col]) => {
        const p1 = N.toPx(a), p2 = N.toPx(b), mx = (p1 + p2) / 2, hh = Math.abs(p2 - p1) * 0.32;
        svgEl('path', { d: `M${p1} ${N.ay - 14} Q${mx} ${N.ay - 14 - hh * 2} ${p2} ${N.ay - 14}`, fill: 'none', stroke: col, 'stroke-width': 2.5, 'stroke-dasharray': '7 6' }, arcs);
      });
      const Pn = panel(stage, W / 2 - 230, 250, 460, 120, '', 'u2l2-cpanel');
      const l1 = hidLine(Pn, T('\\textcolor{#1f5bd6}{2}<' + cI('5')), 'u2l2-big'), l2 = hidLine(Pn, T('\\textcolor{#1f5bd6}{-2}\\ ' + cX('>') + '\\ ' + cI('-5')), 'u2l2-big');
      const slide = async (c, pt, lab, from, to) => {
        await tween(c, 900, (t) => { const v = from + (to - from) * t, px = N.toPx(v); pt.querySelector('circle').setAttribute('cx', px); place(lab, px, N.ay - 16 - Math.sin(Math.PI * t) * 60, 'n', 0); });
      };
      return [
        { cap: `${T('2')} is to the <b>left</b> of ${T('5')}, so ${T('2<5')}.`, run: async (c) => { for (const e of [A, B]) await pop(c, e, 300); await show(c, la); await show(c, lb); await show(c, l1); } },
        { cap: `Multiply both by ${T('-1')}: every point <b>flips to the other side of 0</b>. ${T('2\\to-2')} and ${T('5\\to-5')}.`,
          run: async (c) => { await appear(c, zero, 200); await appear(c, arcs, 300); await Promise.all([slide(c, A, la, 2, -2), slide(c, B, lb, 5, -5)]); la.innerHTML = T('\\textcolor{#1f5bd6}{-2}'); lb.innerHTML = T(cI('-5')); } },
        { cap: `Now ${T('-2')} is to the <b>right</b> of ${T('-5')}: ${T('-2>-5')}. The order flipped, so the sign must flip.`, run: (c) => show(c, l2) },
        { cap: `Multiplying or dividing both sides by a <b>negative</b> number <b>reverses</b> the inequality sign.`, run: (c) => pulse(c, l2, 1.08) }
      ];
    }
    // test −3x ≥ −9 value by value
    const xs = [-1, 0, 1, 2, 3, 4, 5, 6], cw = 82, x0 = (W - 150 - xs.length * cw) / 2;
    const grid = h('div', 'u2l2-abs u2l2-tgrid'); stage.appendChild(grid); grid.style.left = x0 + 'px'; grid.style.top = '8px';
    grid.style.gridTemplateColumns = `150px repeat(${xs.length}, ${cw}px)`;
    const cell = (html, cls = '') => { const d = h('div', 'u2l2-tc ' + cls, html); grid.appendChild(d); return d; };
    cell(T('x'), 'u2l2-th'); xs.forEach((x) => cell(T(String(x))));
    cell(T('-3x'), 'u2l2-th'); const mid = xs.map((x) => hide(cell(T(String(-3 * x)))));
    cell(T('-3x\\ge-9\\,?'), 'u2l2-th'); const chk = xs.map((x) => hide(cell(-3 * x >= -9 ? '<b class="u2l2-cok">✓</b>' : '<b class="u2l2-cno">✗</b>', -3 * x >= -9 ? 'u2l2-tcok' : 'u2l2-tcno')));
    const N = new NumberLine(stage, { x: 0, y: 186, width: W, height: 120, min: -2, max: 7, step: 1, axisY: 64, fontSize: 18 });
    const sh = N.interval(-Infinity, 3, { color: OK, width: 10 }); sh.style.opacity = 0;
    const Pn = hide(absEl(stage, 'u2l2-verdict', `${T('-3x\\ge-9')}&ensp;means&ensp;${T(cG('x\\le3'))}`, W / 2, 300, 's'));
    const wrong = hide(absEl(stage, 'u2l2-wrong', `Not ${T('x\\ge3')}: try ${T('x=4')} → ${T('-12\\ge-9')} ✗`, W / 2, 352, 's'));
    return [
      { cap: `Work out ${T('-3x')} for each ${T('x')}.`, run: async (c) => { for (const e of mid) await appear(c, e, 120); } },
      { cap: `Is it ${T('\\ge-9')}? ${T('x=3')} gives ${T('-9\\ge-9')} ✓, but ${T('x=4')} gives ${T('-12\\ge-9')} ✗: ${T('-12')} is <b>further left</b> than ${T('-9')}.`, run: async (c) => { for (const e of chk) await appear(c, e, 120); } },
      { cap: `The ✓s are the ${T('x')}-values <b>3 and below</b>: ${T('x\\le3')}.`, run: (c) => appear(c, sh, 600) },
      { cap: `Dividing ${T('-3x\\ge-9')} by ${T('-3')} gives ${T('x\\le3')}: the sign <b>reversed</b>. Forgetting gives ${T('x\\ge3')}, which is wrong.`, run: async (c) => { await show(c, Pn); await show(c, wrong); } }
    ];
  }
};

/* ====================================================================================================
 * explainer: radgraph — graph the radicand (Example 2)
 * ==================================================================================================== */
const RG = {
  a: { label: '(a) ' + T('\\sqrt{x^2+4}'), f: (x) => x * x + 4, fT: 'x^2+4', expr: '\\sqrt{x^2+4}' },
  b: { label: '(b) ' + T('\\sqrt{x^2}'), f: (x) => x * x, fT: 'x^2', expr: '\\sqrt{x^2}' },
  c: { label: '(c) ' + T('\\sqrt{x^3}'), f: (x) => x * x * x, fT: 'x^3', expr: '\\sqrt{x^3}' },
  d: { label: '(d) ' + T('\\tfrac{8}{\\sqrt{x+2}}'), f: (x) => x + 2, fT: 'x+2', expr: '\\dfrac{8}{\\sqrt{x+2}}' }
};
const radgraph = {
  title: 'Where is the radicand above zero?',
  height: 430,
  minW: 860,
  choices: [{ sep: 'Example 2 check:' }].concat(Object.keys(RG).map((k) => ({ v: k, label: RG[k].label }))),
  intro: (k) => `For which ${T('x')} is ${T(RG[k].expr)} defined? Graph the radicand ${T('y=' + RG[k].fT)}. Press <b>Next</b>.`,
  make(stage, key, ex) {
    const d = RG[key], W = ex.W;
    const G = new Graph(stage, { x: 8, y: 6, width: 440, height: 418, xmin: -4, xmax: 4, ymin: -6, ymax: 10, ylabels: 2, fontSize: 16 });
    const main = G.fn(d.f, { color: CR, width: 4 }); main.style.opacity = 0;
    const Pn = panel(stage, 470, 10, W - 484, 410, T('y=' + cR(d.fT)), 'u2l2-cpanel');
    const lines = [], add2 = (t, cls) => { const l = hidLine(Pn, t, cls); lines.push(l); return l; };
    const draw = (c, el, ms) => { el.style.opacity = 1; return G.drawIn(el, ms, c); };
    const steps = [{ cap: `Graph the radicand ${T('y=' + cR(d.fT))}. Allowed ${T('x')}-values: where it is <b>on or above</b> the ${T('x')}-axis${key === 'd' ? ' (strictly above: it is in a denominator)' : ''}.`, run: (c) => draw(c, main, 800) }];
    if (key === 'a') {
      const p = hideP(G.point(0, 4, { color: CR, label: T('(0,\\ 4)'), pos: 'e' }));
      const l1 = add2(T('x^2\\ge0') + ' always', 'u2l2-mid'), l2 = add2(T('x^2+4\\ge4>0'), 'u2l2-mid'), l3 = add2(T(cG('x\\in\\mathbb{R}')), 'u2l2-big');
      const sh = hide(G.shadeX(-Infinity, Infinity, { color: OK }));
      steps.push({ cap: `${T('x^2')} is never negative, so the lowest the radicand can be is ${T('0+4=4')}.`, run: async (c) => { await G.reveal(p, c); await show(c, l1); await show(c, l2); } });
      steps.push({ cap: `The graph is <b>above</b> the axis for every ${T('x')}: ${T(cG('x\\in\\mathbb{R}'))}.`, run: async (c) => { await appear(c, sh, 500); await show(c, l3); } });
    } else if (key === 'b') {
      const p = hideP(G.point(0, 0, { color: CR, label: T('(0,\\ 0)'), pos: 'se' }));
      const l1 = add2(`touches 0 at ${T('x=0')}: ${T('\\sqrt0=0')} ✓`, 'u2l2-mid'), l2 = add2(T(cG('x\\in\\mathbb{R}')), 'u2l2-big');
      const sh = hide(G.shadeX(-Infinity, Infinity, { color: OK }));
      steps.push({ cap: `It only <b>touches</b> the axis, at ${T('x=0')}, where ${T('\\sqrt0=0')} is fine.`, run: async (c) => { await G.reveal(p, c); await show(c, l1); } });
      steps.push({ cap: `${T('x^2\\ge0')} for every ${T('x')}: ${T(cG('x\\in\\mathbb{R}'))}.`, run: async (c) => { await appear(c, sh, 500); await show(c, l2); } });
    } else if (key === 'c') {
      const bad = G.fn(d.f, { from: -4, to: 0, color: NO, width: 5.5 }); bad.style.opacity = 0;
      const l1 = add2(`${T('x=-1')}: ${T('\\sqrt{(-1)^3}=\\sqrt{-1}')} ✗`, 'u2l2-mid'), l2 = add2(`${T('x=2')}: ${T('\\sqrt{2^3}=\\sqrt8=2\\sqrt2')} ✓`, 'u2l2-mid'), l3 = add2(T(cG('x\\ge0')), 'u2l2-big');
      const sh = hide(G.shadeX(0, Infinity, { color: OK }));
      steps.push({ cap: `For negative ${T('x')}, ${T('x^3')} is <b>negative</b>: the graph is below the axis. ${T('x=-1')} gives ${T('\\sqrt{-1}')} ✗`, run: async (c) => { await draw(c, bad, 600); await show(c, l1); } });
      steps.push({ cap: `For ${T('x\\ge0')} it is on or above the axis: ${T('x=2')} gives ${T('\\sqrt8=2\\sqrt2')} ✓`, run: (c) => show(c, l2) });
      steps.push({ cap: `Restriction: ${T(cG('x\\ge0'))}.`, run: async (c) => { await appear(c, sh, 500); await show(c, l3); } });
    } else {
      const bad = G.fn(d.f, { from: -4, to: -2, color: NO, width: 5.5 }); bad.style.opacity = 0;
      const p = hideP(G.point(-2, 0, { color: NO, open: true, r: 9, label: T(cX('(-2,\\ 0)')), pos: 'nw' }));
      const l1 = add2(`${T('x<-2')}: radicand negative ✗`, 'u2l2-mid'), l2 = add2(`${T('x=-2')}: ${T('\\dfrac{8}{\\sqrt0}=\\dfrac80')} ✗`, 'u2l2-mid'), l3 = add2(T(cG('x>-2')), 'u2l2-big');
      const sh = hide(G.shadeX(-2, Infinity, { color: OK, openA: true }));
      steps.push({ cap: `Left of ${T('x=-2')} the graph is below the axis: the radicand is negative ✗`, run: async (c) => { await draw(c, bad, 600); await show(c, l1); } });
      steps.push({ cap: `At ${T('x=-2')} the radicand is <b>0</b>. That is fine for a root, but here it is in a <b>denominator</b>: ${T('\\tfrac{8}{0}')} ✗`, run: async (c) => { await G.reveal(p, c); await show(c, l2); } });
      steps.push({ cap: `Only <b>strictly above</b> the axis: ${T(cG('x>-2'))}, an <b>open</b> dot at ${T('-2')}.`, run: async (c) => { await appear(c, sh, 500); await show(c, l3); } });
    }
    return steps;
  }
};

/* ====================================================================================================
 * explainer: groups — the star. Factors under the root; groups of the index escape.
 * ==================================================================================================== */
const GR = {
  demo: { label: T('\\sqrt{x^7}'), k: 2, vars: [['x', 7]] },
  a: { label: '(a)', k: 2, vars: [['x', 8]] },
  b: { label: '(b)', k: 2, vars: [['a', 7]] },
  c: { label: '(c)', k: 3, vars: [['y', 9]] },
  d: { label: '(d)', k: 3, vars: [['m', 11]] },
  e: { label: '(e)', k: 4, vars: [['x', 9]] },
  f: { label: '(f)', k: 2, vars: [['x', 4], ['y', 5]] }
};
const kWord = { 2: 'pairs', 3: 'groups of 3', 4: 'groups of 4' };
const groups = {
  title: 'Groups of the index escape',
  height: 420,
  minW: 860,
  choices: [{ v: 'demo', label: GR.demo.label }, { sep: 'Example 3 check:' }].concat(['a', 'b', 'c', 'd', 'e', 'f'].map((k) => ({ v: k, label: GR[k].label }))),
  intro: (k) => { const d = GR[k]; return `Simplify ${T(rt(d.vars.map(([v, e]) => powT(v, e)).join(''), d.k))}. Press <b>Next</b>.`; },
  make(stage, key, ex) {
    const d = GR[key], W = ex.W, k = d.k, S = simp(1, d.vars, k);
    const radT = d.vars.map(([v, e]) => powT(v, e)).join('');
    const svg = stageSvg(stage, W, 420);
    // layout of the tiles inside the radical
    const RX = 250, RY = 40, RH = 120, inL = RX + RH * 0.5 + 18, inR = W - 24;
    const tiles = []; // { v, g (group index within var), el, x }
    const n = d.vars.reduce((s, [, e]) => s + e, 0), ngr = d.vars.reduce((s, [, e]) => s + Math.ceil(e / k), 0);
    const gapIn = 5, gapG = 16, gapV = 26;
    const tw = Math.min(48, Math.floor((inR - inL - (n - ngr) * gapIn - (ngr - 1) * gapG - (d.vars.length - 1) * (gapV - gapG)) / n));
    let x = inL; const groupsL = [];
    d.vars.forEach(([v, e], vi) => {
      if (vi) x += gapV - gapG;
      for (let i = 0; i < e; i++) {
        const gi = Math.floor(i / k), full = (gi + 1) * k <= e;
        if (i % k === 0 && i) x += gapG - gapIn;
        const el = h('div', 'u2l2-abs u2l2-tile', T(v)); el.style.width = tw + 'px'; stage.appendChild(el);
        el.style.left = x + 'px'; el.style.top = (RY + 30) + 'px'; hide(el);
        const t = { v, gi, full, el, x }; tiles.push(t);
        if (full) { let G = groupsL.find((g) => g.v === v && g.gi === gi); if (!G) { G = { v, gi, tiles: [] }; groupsL.push(G); } G.tiles.push(t); }
        x += tw + gapIn;
      }
    });
    const tilesW = x - gapIn - inL;
    const rad = radSign(svg, RX, RY, Math.max(tilesW + 36, 160), RH, { width: 4.5 });
    const idx = d.k === 2 ? null : absEl(stage, 'u2l2-ridx', T(cI(k)), RX + RH * 0.1, RY + RH * 0.42, 'n', 0);
    const idx2 = d.k === 2 ? absEl(stage, 'u2l2-ridx u2l2-ridx2', T(cI('2')), RX + RH * 0.1, RY + RH * 0.42, 'n', 0) : null; // the hidden 2, shown faintly
    void idx; void idx2;
    // group rings
    groupsL.forEach((G) => {
      const a = G.tiles[0].x - 5, b = G.tiles[G.tiles.length - 1].x + tw + 5;
      G.ring = svgEl('rect', { x: a, y: RY + 22, width: b - a, height: 70, rx: 14, fill: 'rgba(194,122,14,.10)', stroke: CI, 'stroke-width': 3 }, svg); hide(G.ring);
    });
    // where the escapees land: one tile per group, outside, left of the radical
    const outN = groupsL.length, ow = Math.min(46, Math.floor(200 / Math.max(1, outN)) - 6);
    const outX = (i) => RX - 18 - (outN - i) * (ow + 6);
    const outTop = RY + 30;
    const lab = hide(absEl(stage, 'u2l2-explab', T(radT + '=' + d.vars.map(([v, e]) => Array(e).fill(v).join('\\cdot ')).join('\\cdot ')), W / 2, 178, 's'));
    const divs = d.vars.map(([v, e]) => {
      const q = Math.floor(e / k), r = e % k;
      return `${T(`${e}\\div${cI(k)}=${cC(q)}\\text{ R }${cR(r)}`)}`;
    });
    const divEl = hide(absEl(stage, 'u2l2-divl', divs.join('&emsp;&emsp;'), W / 2, 228, 's'));
    const keyEl = hide(absEl(stage, 'u2l2-divk', `<b class="u2l2-cc">quotient</b> = exponent outside&emsp;<b class="u2l2-cr">remainder</b> = exponent inside`, W / 2, 282, 's'));
    const restr = S.even ? `,\\ \\ ${restrT(d.vars)}` : '';
    const res = hide(absEl(stage, 'u2l2-res', T(`${rt(radT, k)}=` + (S.inT ? `${cC(S.outT)}${rt(cR(S.inT), k)}` : cC(S.outT)) + restr), W / 2, 330, 's'));
    const word = kWord[k];
    const steps = [
      { cap: `${T(radT)} means ${d.vars.map(([v, e]) => `${e} factors of ${T(v)}`).join(' and ')}, all multiplied together.`, run: async (c) => { for (const t of tiles) await pop(c, t.el, 160); await show(c, lab); } },
      { cap: `Index ${T(cI(k))}: circle equal factors in <b>${word}</b>${d.vars.length > 1 ? ' (each letter on its own)' : ''}.`, run: async (c) => { for (const G of groupsL) await appear(c, G.ring, 220); } },
      { cap: `Each group comes out as <b>one</b> factor, because ${T(rt(Array(k).fill('x').join('\\cdot '), k) + '=x')}.`,
        run: async (c) => {
          for (let i = 0; i < groupsL.length; i++) {
            const G = groupsL[i];
            anim(c, G.ring, [{ opacity: 1 }, { opacity: 0 }], 300);
            await Promise.all(G.tiles.map((t, j) => mv(c, t.el, outX(i) + j * 2, outTop, 520)));
            G.tiles.forEach((t, j) => { if (j) t.el.style.opacity = 0; else { t.el.classList.add('u2l2-tout'); t.el.style.width = ow + 'px'; } });
          }
          if (!S.inT) { await anim(c, rad, [{ opacity: 1 }, { opacity: 0.18 }], 400); return; }
          const left = tiles.filter((t) => !t.full), w0 = Math.max(tilesW + 36, 160), w1 = Math.max(left.length * (tw + gapIn) + 30, 90);
          await Promise.all(left.map((t, j) => mv(c, t.el, inL + j * (tw + gapIn), RY + 30, 500)).concat([tween(c, 500, (u) => rad.setW(w0 + (w1 - w0) * u))]));
        } },
      { cap: `${groupsL.length} group${groupsL.length === 1 ? '' : 's'} came out; ${S.inT ? `${T(cR(S.inT))} is left inside` : '<b>nothing</b> is left inside, so the radical disappears'}. ${d.vars.length > 1 ? 'For each letter' : 'In numbers'}: divide the exponent by the index.`,
        run: async (c) => { tiles.filter((t) => !t.full).forEach((t) => t.el.classList.add('u2l2-tin')); await show(c, divEl); await show(c, keyEl); } },
      { cap: `${T(rt(radT, k) + '=' + S.resT + restr)}${S.even ? ' (even index: the variables are ' + T('\\ge0') + ')' : ' (odd index: no restriction)'}.`, run: (c) => show(c, res) }
    ];
    return steps;
  }
};

/* ====================================================================================================
 * explainer: abs — √(x²) = |x|
 * ==================================================================================================== */
const absX = {
  title: 'Is √(x²) always x?',
  height: 400,
  minW: 860,
  choices: [{ v: 2, label: 'Square root: ' + T('\\sqrt{x^2}') }, { v: 3, label: 'Cube root: ' + T('\\sqrt[3]{x^3}') }],
  intro: (k) => (k === 2 ? `Does ${T('\\sqrt{x^2}')} always give back ${T('x')}? Press <b>Next</b>.` : `Does ${T('\\sqrt[3]{x^3}')} always give back ${T('x')}? Press <b>Next</b>.`),
  make(stage, k, ex) {
    const W = ex.W, sq = k === 2;
    const N = new NumberLine(stage, { x: 0, y: 6, width: W, height: 150, min: -6, max: 6, step: 1, axisY: 96, fontSize: 18 });
    const BL = COLORS.blue;
    const mk = (col, r, ring) => { const g = svgEl('g', {}, N.layers.top); const ci = svgEl('circle', { cx: N.toPx(0), cy: N.ay, r, fill: ring ? 'none' : col, stroke: col, 'stroke-width': ring ? 4.5 : 2 }, g); g.ci = ci; return g; };
    const mX = mk(BL, 9, false), mR = mk(CC, 17, true);
    const lX = N.hlabel(N.toPx(0), N.ay + 22, T('\\textcolor{#1f5bd6}{x}'), { pos: 's', gap: 0, cls: 'u2l2-nlab' });
    const resT = sq ? '\\sqrt{x^2}' : '\\sqrt[3]{x^3}';
    const lR = N.hlabel(N.toPx(0), N.ay - 24, T(cC(resT)), { pos: 'n', gap: 0, cls: 'u2l2-nlab' });
    [mX, mR, lX, lR].forEach(hide);
    const set = (x) => {
      const r = sq ? Math.abs(x) : x, bad = sq && x < -1e-9;
      mX.ci.setAttribute('cx', N.toPx(x)); mR.ci.setAttribute('cx', N.toPx(r)); mR.ci.setAttribute('stroke', bad ? NO : CC);
      place(lX, N.toPx(x), N.ay + 22, 's', 0); place(lR, N.toPx(r), N.ay - 24, 'n', 0);
      lR.innerHTML = T(bad ? cX(resT) : cC(resT));
    };
    const tbl = h('div', 'u2l2-abs u2l2-atab'); stage.appendChild(tbl); tbl.style.left = '40px'; tbl.style.top = '176px'; tbl.style.width = (W - 80) + 'px';
    const row = (x) => {
      const p = sq ? x * x : x * x * x, r = sq ? Math.abs(x) : x, okk = r === x;
      const d = h('div', 'u2l2-arow', `<span class="u2l2-ac">${T('x=' + x)}</span><span class="u2l2-ac">${T((sq ? 'x^2=' : 'x^3=') + p)}</span><span class="u2l2-ac">${T(cC((sq ? `\\sqrt{${p}}` : `\\sqrt[3]{${p}}`) + '=' + r))}</span><span class="u2l2-ac">${okk ? '<b class="u2l2-cok">= x ✓</b>' : `<b class="u2l2-cno">${T('\\ne x')} ✗</b>`}</span>`);
      tbl.appendChild(d); return hide(d);
    };
    const xs = sq ? [5, -5] : [2, -2], r1 = row(xs[0]), r2 = row(xs[1]);
    const sh = N.interval(0, Infinity, { color: OK, width: 9 }); sh.style.opacity = 0;
    const fin = hide(absEl(stage, 'u2l2-res', sq ? T(`\\sqrt{x^2}=|x|`) + '&emsp;so we state&emsp;' + T(cG('x\\ge0')) + ':&ensp;' + T('\\sqrt{x^2}=x') : T('\\sqrt[3]{x^3}=x') + '&ensp;for every&ensp;' + T('x') + ': no restriction', W / 2, 330, 'n'));
    const go = async (c, a, b, ms = 900) => tween(c, ms, (t) => set(a + (b - a) * t));
    if (sq) return [
      { cap: `Try ${T('x=5')}: ${T('x^2=25')} and ${T('\\sqrt{25}=5')}. Same as ${T('x')} ✓`, run: async (c) => { set(5); for (const e of [mX, mR, lX, lR]) await appear(c, e, 200); await show(c, r1); } },
      { cap: `Try ${T('x=-5')}: ${T('x^2=25')} again, so ${T('\\sqrt{25}=5')}. <b>Not</b> ${T('x')}: a square root is never negative ✗`, run: async (c) => { await go(c, 5, -5, 1000); await show(c, r2); } },
      { cap: `Slide ${T('x')} from ${T('-5')} to ${T('5')}: for negative ${T('x')}, ${T('\\sqrt{x^2}')} lands on the <b>mirror image</b>. It is the distance from 0: ${T('|x|')}.`, run: (c) => go(c, -5, 5, 2600) },
      { cap: `So ${T('\\sqrt{x^2}=|x|')}. For an even index we state ${T(cG('x\\ge0'))}; then ${T('\\sqrt{x^2}=x')} is true.`, run: async (c) => { await appear(c, sh, 500); await show(c, fin); } }
    ];
    return [
      { cap: `Try ${T('x=2')}: ${T('x^3=8')} and ${T('\\sqrt[3]{8}=2')} ✓`, run: async (c) => { set(2); for (const e of [mX, mR, lX, lR]) await appear(c, e, 200); await show(c, r1); } },
      { cap: `Try ${T('x=-2')}: ${T('x^3=-8')} and ${T('\\sqrt[3]{-8}=-2')} ✓ A cube <b>keeps the sign</b>, and so does a cube root.`, run: async (c) => { await go(c, 2, -2, 1000); await show(c, r2); } },
      { cap: `Slide ${T('x')} across: ${T('\\sqrt[3]{x^3}')} sits right on ${T('x')} the whole way.`, run: (c) => go(c, -2, 5, 2400) },
      { cap: `${T('\\sqrt[3]{x^3}=x')} for every ${T('x')}: an odd index needs <b>no restriction</b>.`, run: (c) => show(c, fin) }
    ];
  }
};

/* ====================================================================================================
 * explainer: split — number and each variable, sorted into "comes out" and "stays in"
 * ==================================================================================================== */
const SP = {
  d1: { label: T('\\sqrt{18x^3}'), n: 18, vars: [['x', 3]], k: 2 },
  d2: { label: T('\\sqrt[3]{-8x^4}'), n: -8, vars: [['x', 4]], k: 3 },
  a: { label: '(a)', n: 45, vars: [['a', 5]], k: 2 },
  b: { label: '(b)', n: 72, vars: [['x', 4], ['y', 7]], k: 2 },
  c: { label: '(c)', n: -54, vars: [['m', 7]], k: 3 },
  d: { label: '(d)', n: 98, vars: [['x', 2], ['y', 3]], k: 2 },
  e: { label: '(e)', n: 40, vars: [['a', 4], ['b', 9]], k: 3 },
  f: { label: '(f)', n: 48, vars: [['x', 9]], k: 4 }
};
const powName = { 2: 'square', 3: 'cube', 4: 'fourth power' };
const split = {
  title: 'Sort it: out or in?',
  height: 430,
  minW: 860,
  choices: [{ v: 'd1', label: SP.d1.label }, { v: 'd2', label: SP.d2.label }, { sep: 'Example 4 check:' }].concat(['a', 'b', 'c', 'd', 'e', 'f'].map((k) => ({ v: k, label: SP[k].label }))),
  intro: (k) => { const d = SP[k], S = simp(d.n, d.vars, d.k); return `Write ${T(rt(S.radT, d.k))} in simplest form. Press <b>Next</b>.`; },
  make(stage, key, ex) {
    const d = SP[key], W = ex.W, k = d.k, S = simp(d.n, d.vars, k);
    const top = absEl(stage, 'u2l2-sexpr', T(rtI(cR(S.radT), k)), W / 2, 6, 's');
    const cols = 1 + d.vars.length, cw = 220, gap = 30, x0 = (W - cols * cw - (cols - 1) * gap) / 2;
    const cx = (i) => x0 + i * (cw + gap) + cw / 2;
    const svg = stageSvg(stage, W, 430);
    // trays
    const trayL = x0 - 70, trayW = cols * cw + (cols - 1) * gap + 90;
    const outTray = add(stage, box(h('div', 'u2l2-abs u2l2-tray u2l2-tout2', '<span class="u2l2-trl">comes<br>out</span>'), trayW, 58), trayL, 228);
    const inTray = add(stage, box(h('div', 'u2l2-abs u2l2-tray u2l2-tin2', '<span class="u2l2-trl">stays<br>in</span>'), trayW, 58), trayL, 296);
    [outTray, inTray].forEach(hide);
    // cards
    const absN = Math.abs(d.n), o = S.o, perf = S.perf, i0 = S.i;
    const cards = [], outs = [], ins = [], capsSplit = [];
    const card = (i, head, l1) => { const el = add(stage, box(h('div', 'u2l2-abs u2l2-scard', `<div class="u2l2-sch">${head}</div><div class="u2l2-scl">${l1}</div>`), cw, 140), cx(i) - cw / 2, 72); hide(el); cards.push(el); return el; };
    const numCard = card(0, 'number', T(String(d.n)));
    const numSplit = hide(h('div', 'u2l2-scs', T(`${cC(perf)}\\cdot${cR(i0)}`) + `<div class="u2l2-scn">${T(`${perf}=${o < 0 ? '(' + o + ')' : o}^{${k}}`)}</div>`)); numCard.appendChild(numSplit);
    capsSplit.push(i0 === 1 ? `The number: ${T(String(d.n))} is a perfect ${powName[k]}: ${T(`${d.n}=${o < 0 ? '(' + o + ')' : o}^{${k}}`)}, so ${T(cC(o))} comes out.`
      : `The number: the largest perfect ${powName[k]} factor of ${T(String(absN))} is ${T(String(Math.abs(perf)))}${d.n < 0 ? ` (and the sign: ${T(`-${Math.abs(perf)}=(${o})^{${k}}`)})` : ` = ${T(`${o}^{${k}}`)}`}. ${T(`${d.n}=${cC(perf)}\\cdot${cR(i0)}`)}.`);
    outs.push(String(o)); ins.push(i0 === 1 ? '' : String(i0));
    S.vs.forEach((v, j) => {
      const c2 = card(j + 1, `${T(v.v)} part`, T(powT(v.v, v.e)));
      const parts = [v.q ? cC(powT(v.v, v.q * k)) : null, v.r ? cR(powT(v.v, v.r)) : null].filter(Boolean).join('\\cdot ');
      c2.appendChild(hide(h('div', 'u2l2-scs', T(parts) + `<div class="u2l2-scn">${T(`${v.e}\\div${cI(k)}=${cC(v.q)}\\text{ R }${cR(v.r)}`)}</div>`)));
      capsSplit.push(`${T(powT(v.v, v.e))}: ${T(`${v.e}\\div${k}=${v.q}\\text{ R }${v.r}`)}. ${v.q ? `${T(cC(powT(v.v, v.q)))} comes out` : 'nothing comes out'}${v.r ? `, ${T(cR(powT(v.v, v.r)))} stays in` : ', nothing stays in'}.`);
      outs.push(powT(v.v, v.q)); ins.push(powT(v.v, v.r));
    });
    const outEls = outs.map((t, i) => hide(absEl(stage, 'u2l2-titem u2l2-cc', t ? T(cC(t)) : '', cx(i), 257, 'c')));
    const inEls = ins.map((t, i) => hide(absEl(stage, 'u2l2-titem u2l2-cr', t ? T(cR(t)) : '<span class="u2l2-none">—</span>', cx(i), 325, 'c')));
    const arrows = svgEl('g', {}, svg); hide(arrows);
    for (let i = 0; i < cols; i++) svgEl('line', { x1: cx(i), x2: cx(i), y1: 214, y2: 232, stroke: GRAY, 'stroke-width': 2, 'stroke-dasharray': '4 4' }, arrows);
    const restr = S.even ? `,\\ \\ ${restrT(d.vars)}` : '';
    const resInT = S.inT ? rt(cR(S.inT), k) : '';
    const res = hide(absEl(stage, 'u2l2-res', T(`${rt(S.radT, k)}=${cC(S.outT)}${resInT}${restr}`) + (S.even ? '' : '&ensp;<span class="u2l2-muted">(no restriction)</span>'), W / 2, 364, 's'));
    const splitEls = cards.map((cd) => cd.querySelector('.u2l2-scs'));
    const steps = [
      { cap: `Split the radicand into the <b>number</b> and ${d.vars.length > 1 ? '<b>each variable</b>' : 'the <b>variable</b>'}: ${[String(d.n)].concat(d.vars.map(([v, e]) => powT(v, e))).map((t) => T(t)).join(', ')}.`, run: async (c) => { await show(c, top); for (const e of cards) await show(c, e); } }
    ];
    splitEls.forEach((el, i) => steps.push({ cap: capsSplit[i], run: (c) => show(c, el) }));
    steps.push({ cap: `Sort: everything that <b class="u2l2-cc">comes out</b> goes in front; everything that <b class="u2l2-cr">stays in</b> stays under the root.`,
      run: async (c) => { await appear(c, arrows, 200); await show(c, outTray); await show(c, inTray); for (let i = 0; i < cols; i++) { await show(c, outEls[i]); await show(c, inEls[i]); } } });
    steps.push({ cap: `Multiply each row: ${T(`${rt(S.radT, k)}=${S.resT}${restr}`)}${S.even ? '' : ' (odd index: no restriction)'}.`, run: (c) => show(c, res) });
    return steps;
  }
};

/* ====================================================================================================
 * explainer: entire — mixed → entire with variables
 * ==================================================================================================== */
const EN = {
  demo: { label: T('3x\\sqrt{2x}'), k: 2, sign: 1, f: ['3', 'x'], p: ['9', 'x^2'], inn: '2x', prod: '18x^3', mix: '3x\\sqrt{2x}', restr: 'x\\ge0' },
  a: { label: '(a)', k: 2, sign: 1, f: ['4', 'a'], p: ['16', 'a^2'], inn: 'a', prod: '16a^3', mix: '4a\\sqrt{a}' },
  b: { label: '(b)', k: 2, sign: 1, f: ['2', 'x^2'], p: ['4', 'x^4'], inn: '5y', prod: '20x^4y', mix: '2x^2\\sqrt{5y}' },
  c: { label: '(c)', k: 3, sign: 1, f: ['-3', 'm'], p: ['-27', 'm^3'], inn: '2m^2', prod: '-54m^5', mix: '-3m\\sqrt[3]{2m^2}', neg: 'in' },
  d: { label: '(d)', k: 3, sign: 1, f: ['a', 'b^2'], p: ['a^3', 'b^6'], inn: '4a', prod: '4a^4b^6', mix: 'ab^2\\sqrt[3]{4a}' },
  e: { label: '(e)', k: 2, sign: -1, f: ['2', 'y'], p: ['4', 'y^2'], inn: 'y', prod: '4y^3', mix: '-2y\\sqrt{y}', neg: 'out' },
  f: { label: '(f)', k: 2, sign: 1, f: ['5', 'x'], p: ['25', 'x^2'], inn: '3', prod: '75x^2', mix: '5x\\sqrt{3}' }
};
const entire = {
  title: 'Everything in front goes inside',
  height: 440,
  minW: 860,
  choices: [{ v: 'demo', label: EN.demo.label }, { sep: 'Example 5 check:' }].concat(['a', 'b', 'c', 'd', 'e', 'f'].map((k) => ({ v: k, label: EN[k].label }))),
  intro: (k) => `Write ${T(EN[k].mix)} as an entire radical. Press <b>Next</b>.`,
  make(stage, key, ex) {
    const d = EN[key], W = ex.W, k = d.k;
    const svg = stageSvg(stage, W, 440);
    const RX = 330, RY = 60, RH = 110;
    const rad = radSign(svg, RX, RY, W - RX - 90, RH, { width: 4.5 });
    if (k !== 2) absEl(stage, 'u2l2-ridx', T(cI(k)), RX + RH * 0.1, RY + RH * 0.42, 'n', 0);
    void rad;
    const midY = RY + RH * 0.56;
    const slotsOut = [150, 250], slotsIn = [470, 580], innX = 720;
    const sign = d.sign < 0 ? absEl(stage, 'u2l2-tok u2l2-tsign', T('-'), 70, midY, 'c') : null;
    const toks = d.f.map((t, i) => absEl(stage, 'u2l2-tok u2l2-cc', T(cC(t)), slotsOut[i], midY, 'c'));
    const inn = absEl(stage, 'u2l2-tok u2l2-cr', T(cR(d.inn)), innX, midY, 'c');
    const powS = (t, i, kk) => (/^[a-z]$/.test(t) ? `${t}\\to ${d.p[i]}` : `${/^-|\^/.test(t) ? '(' + t + ')' : t}^{${kk}}=${d.p[i]}`);
    const pows = d.f.map((t, i) => hide(absEl(stage, 'u2l2-pow', T(powS(t, i, cI(k))), slotsOut[i], midY - 62, 'c')));
    const dots = [hide(absEl(stage, 'u2l2-tok', T('\\cdot'), (slotsIn[0] + slotsIn[1]) / 2, midY, 'c')), hide(absEl(stage, 'u2l2-tok', T('\\cdot'), (slotsIn[1] + innX) / 2 - 8, midY, 'c'))];
    const prod = hide(absEl(stage, 'u2l2-tok u2l2-tprod', T(d.prod), (slotsIn[0] + innX) / 2, midY, 'c'));
    const lock = sign && d.neg === 'out' ? hide(absEl(stage, 'u2l2-lock', 'even index:<br>stays out', 70, midY + 44, 's')) : null;
    const work = panel(stage, 60, 238, W - 120, 192, '', 'u2l2-cpanel');
    const s = d.sign < 0 ? '-' : '';
    const coefT = d.f.join('');
    const wl1 = hidLine(work, T(`${d.mix}=${s}${rt(`(${coefT})^{${k}}\\cdot ${d.inn}`, k)}`), 'u2l2-mid');
    const wl2 = hidLine(work, T(`=${s}${rt(`${d.p.join('')}\\cdot ${d.inn}`, k)}=${s}${rt(d.prod, k)}`), 'u2l2-mid');
    const restr = d.restr ? `,\\ \\ ${d.restr}` : '';
    const wl3 = hidLine(work, `${T(`${d.mix}=${cG(s + rt(d.prod, k))}${restr}`)}`, 'u2l2-big');
    const negCap = d.neg === 'in' ? ` The ${T('-')} goes in with the 3: odd index.` : '';
    const steps = [];
    if (d.neg === 'out') steps.push({ cap: `Even index: the ${T('-')} sign <b>stays out</b> (a square root is never negative, so ${T('-')} can't come from inside).`, run: async (c) => { await show(c, lock); await pulse(c, sign, 1.2); } });
    steps.push({ cap: `Raise everything in front to the index ${T(cI(k))}: ${d.f.map((t, i) => T(powS(t, i, k))).join(' and ')}.${negCap}`,
      run: async (c) => { for (let i = 0; i < toks.length; i++) { await show(c, pows[i]); toks[i].innerHTML = T(cC(d.p[i])); await pulse(c, toks[i], 1.15); } } });
    steps.push({ cap: `Move them <b>inside</b> the radical, next to the radicand ${T(cR(d.inn))}.`,
      run: async (c) => { pows.forEach((p) => anim(c, p, [{ opacity: 1 }, { opacity: 0 }], 250)); await Promise.all(toks.map((t, i) => mv(c, t, slotsIn[i], midY, 650))); for (const e of dots) await appear(c, e, 150); await show(c, wl1); } });
    steps.push({ cap: `Multiply: ${T(`${d.p.join('\\cdot ')}\\cdot ${d.inn}=${d.prod}`)}.`,
      run: async (c) => { [...toks, inn, ...dots].forEach((e) => anim(c, e, [{ opacity: 1 }, { opacity: 0 }], 300)); await sleep(c, 250); await pop(c, prod, 380); await show(c, wl2); } });
    steps.push({ cap: `${T(`${d.mix}=${s}${rt(d.prod, k)}`)}${d.restr ? ', ' + T(d.restr) : ''}. Check by simplifying it back: you get ${T(d.mix)} again.`, run: (c) => show(c, wl3) });
    return steps;
  }
};

/* ====================================================================================================
 * explainer: checklist — simplest form
 * ==================================================================================================== */
const CK = {
  c1: { label: T('3x\\sqrt{2x}'), T: '3x\\sqrt{2x},\\ \\ x\\ge0', ok: [true, true, true], notes: ['2 has no square factor', 'inside: ' + T('x^1') + ', and 1 < 2', T('x\\ge0') + ' is stated'], fix: null },
  c2: { label: T('x\\sqrt{18x}'), T: 'x\\sqrt{18x},\\ \\ x\\ge0', ok: [false, true, true], notes: [T('18=9\\cdot2') + ', and 9 is a perfect square', 'inside: just ' + T('x^1'), T('x\\ge0') + ' is stated'], fix: 'x\\sqrt{9\\cdot2x}=3x\\sqrt{2x},\\ \\ x\\ge0' },
  c3: { label: T('2a\\sqrt{a^3}'), T: '2a\\sqrt{a^3},\\ \\ a\\ge0', ok: [true, false, true], notes: ['no number inside to simplify', 'inside: ' + T('a^3') + ', and 3 is not less than 2', T('a\\ge0') + ' is stated'], fix: '2a\\sqrt{a^2\\cdot a}=2a\\cdot a\\sqrt a=2a^2\\sqrt a,\\ \\ a\\ge0' },
  c4: { label: T('\\sqrt[3]{24y^4}'), T: '\\sqrt[3]{24y^4}', ok: [false, false, true], notes: [T('24=8\\cdot3') + ', and 8 is a perfect cube', 'inside: ' + T('y^4') + ', and 4 is not less than 3', 'odd index: none needed'], fix: '\\sqrt[3]{8\\cdot3\\cdot y^3\\cdot y}=2y\\sqrt[3]{3y}' },
  c5: { label: T('5m^2\\sqrt{3m}'), T: '5m^2\\sqrt{3m}', ok: [true, true, false], notes: ['3 has no square factor', 'inside: just ' + T('m^1'), 'even index, but no restriction is stated'], fix: '5m^2\\sqrt{3m},\\ \\ m\\ge0' }
};
const CKROWS = ['<b>Number:</b> no factor inside is a perfect square (cube, … for the index)', '<b>Variables:</b> every exponent inside is <b>less than</b> the index', '<b>Restriction:</b> stated for an even index'];
const checklist = {
  title: 'The simplest-form checklist',
  height: 400,
  minW: 860,
  choices: Object.keys(CK).map((k) => ({ v: k, label: CK[k].label })),
  intro: (k) => `Is ${T(CK[k].T)} finished? Run it through the checklist. Press <b>Next</b>.`,
  make(stage, key, ex) {
    const d = CK[key], W = ex.W;
    absEl(stage, 'u2l2-sexpr', T(d.T), W / 2, 8, 's');
    const rows = CKROWS.map((r, i) => {
      const el = add(stage, box(h('div', 'u2l2-abs u2l2-ckrow', `<div class="u2l2-ckt">${r}</div><div class="u2l2-ckn"></div>`), W - 200, 66), 30, 82 + i * 76);
      el.querySelector('.u2l2-ckn').innerHTML = d.notes[i]; hide(el.querySelector('.u2l2-ckn'));
      const st = hide(stamp(stage, null, { ok: d.ok[i], x: W - 110, y: 115 + i * 76, rotate: -6 }));
      return { el, st, n: el.querySelector('.u2l2-ckn') };
    });
    const all = d.ok.every(Boolean);
    const fin = hide(absEl(stage, all ? 'u2l2-verdict' : 'u2l2-fix', all ? '<b>Simplest form</b> ✓' : `Fix: ${T(d.fix)}`, W / 2, 318, 's'));
    const steps = rows.map((r, i) => ({
      cap: `<b>${['Number', 'Variables', 'Restriction'][i]}:</b> ${d.notes[i]} ${d.ok[i] ? '✓' : '✗'}`,
      run: async (c) => { await show(c, r.n); await stampIn(c, r.st); }
    }));
    steps.push({ cap: all ? `Every box is ticked: ${T(d.T)} is in <b>simplest form</b>.` : `Not finished. ${T(d.fix)}`, run: (c) => show(c, fin) });
    return steps;
  }
};

/* ====================================================================================================
 * explainer: shapes — Example 6
 * ==================================================================================================== */
const shapes = {
  title: 'Side, edge, hypotenuse',
  height: 410,
  minW: 860,
  choices: [{ sep: 'Example 6 check:' }, { v: 'a', label: '(a) square' }, { v: 'b', label: '(b) cube' }, { v: 'c', label: '(c) triangle' }],
  intro: (k) => ({ a: `A square has an area of ${T('48x^6\\ \\text{cm}^2')}. Find its side. Press <b>Next</b>.`, b: `A cube has a volume of ${T('54a^4\\ \\text{m}^3')}. Find its edge. Press <b>Next</b>.`, c: `A right triangle has legs ${T('3x')} and ${T('6x')}. Find the hypotenuse. Press <b>Next</b>.` }[k]),
  make(stage, key, ex) {
    const W = ex.W, svg = stageSvg(stage, W, 410);
    const Pn = panel(stage, 400, 14, W - 414, 384, '', 'u2l2-cpanel');
    let unk, L = [];
    if (key === 'a') {
      svgEl('rect', { x: 50, y: 50, width: 290, height: 290, fill: 'rgba(123,79,196,.10)', stroke: INK, 'stroke-width': 3.5 }, svg);
      absEl(stage, 'u2l2-flab', T(`A=${cR('48x^6')}\\ \\text{cm}^2`), 195, 195, 'c');
      unk = absEl(stage, 'u2l2-flab u2l2-unk', T('s=\\ ?'), 195, 346, 's');
      L = [`${T('s=\\sqrt{A}=\\sqrt{48x^6}')}`, T('=\\sqrt{16\\cdot3\\cdot x^6}'), T(`=${cC('4x^3')}\\sqrt{${cR('3')}}\\ \\text{cm},\\ \\ x>0`)];
      return mkShapeSteps(Pn, L, unk, '4x^3\\sqrt3', [
        `The side of a square is the <b>square root</b> of its area: ${T('s=\\sqrt{48x^6}')}.`,
        `Split: ${T('48=16\\cdot3')} (16 is a perfect square) and ${T('x^6=(x^3)^2')}.`,
        `${T('16\\to4')} and ${T('x^6\\to x^3')} come out; ${T('3')} stays in: ${T('s=4x^3\\sqrt3')} cm, ${T('x\\ge0')}.`]);
    }
    if (key === 'b') {
      const s = 200, dx = 80, dy = 60, x0 = 60, y0 = 130;
      svgEl('polygon', { points: `${x0},${y0} ${x0 + dx},${y0 - dy} ${x0 + dx + s},${y0 - dy} ${x0 + s},${y0}`, fill: '#e9e2f7', stroke: INK, 'stroke-width': 3 }, svg);
      svgEl('polygon', { points: `${x0 + s},${y0} ${x0 + s + dx},${y0 - dy} ${x0 + s + dx},${y0 - dy + s} ${x0 + s},${y0 + s}`, fill: '#d6cbef', stroke: INK, 'stroke-width': 3 }, svg);
      svgEl('rect', { x: x0, y: y0, width: s, height: s, fill: 'rgba(123,79,196,.10)', stroke: INK, 'stroke-width': 3.5 }, svg);
      absEl(stage, 'u2l2-flab', T(`V=${cR('54a^4')}\\ \\text{m}^3`), x0 + s / 2, y0 + s / 2, 'c');
      unk = absEl(stage, 'u2l2-flab u2l2-unk', T('e=\\ ?'), x0 + s / 2, y0 + s + 4, 's');
      L = [T('e=\\sqrt[3]{V}=\\sqrt[3]{54a^4}'), T('=\\sqrt[3]{27\\cdot2\\cdot a^3\\cdot a}'), T(`=${cC('3a')}\\sqrt[3]{${cR('2a')}}\\ \\text{m}`) + '<div class="u2l2-small">a length, so ' + T('a>0') + '</div>'];
      return mkShapeSteps(Pn, L, unk, '3a\\sqrt[3]{2a}', [
        `The edge of a cube is the <b>cube root</b> of its volume: ${T('e=\\sqrt[3]{54a^4}')}.`,
        `Split: ${T('54=27\\cdot2')} (27 is a perfect cube) and ${T('a^4=a^3\\cdot a')} (${T('4\\div3=1\\text{ R }1')}).`,
        `${T('27\\to3')} and ${T('a^3\\to a')} come out; ${T('2a')} stays in: ${T('e=3a\\sqrt[3]{2a}')} m (a length, so ${T('a>0')}).`]);
    }
    const ax = 70, ay = 330, bw = 280, bh = 140;
    svgEl('polygon', { points: `${ax},${ay} ${ax + bw},${ay} ${ax},${ay - bh}`, fill: 'rgba(123,79,196,.10)', stroke: INK, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, svg);
    svgEl('path', { d: `M${ax} ${ay - 22} H${ax + 22} V${ay}`, fill: 'none', stroke: INK, 'stroke-width': 2.5 }, svg);
    absEl(stage, 'u2l2-flab', T('3x'), ax - 8, ay - bh / 2, 'w', 0);
    absEl(stage, 'u2l2-flab', T('6x'), ax + bw / 2, ay + 6, 's', 0);
    unk = absEl(stage, 'u2l2-flab u2l2-unk', T('c=\\ ?'), ax + bw / 2 + 14, ay - bh / 2 - 12, 'ne', 0);
    L = [T('c^2=(3x)^2+(6x)^2'), T('c^2=9x^2+36x^2=45x^2'), T(`c=\\sqrt{45x^2}=\\sqrt{9\\cdot5\\cdot x^2}`), T(`c=${cC('3x')}\\sqrt{${cR('5')}},\\ \\ x>0`)];
    return mkShapeSteps(Pn, L, unk, '3x\\sqrt5', [
      `Pythagoras: ${T('c^2=(3x)^2+(6x)^2')}. Square <b>both</b> the number and the ${T('x')}.`,
      `${T('9x^2+36x^2=45x^2')}: like terms, so add the coefficients.`,
      `${T('c=\\sqrt{45x^2}')}: ${T('45=9\\cdot5')} and ${T('x^2')} is a perfect square.`,
      `${T('9\\to3')} and ${T('x^2\\to x')} come out: ${T('c=3x\\sqrt5')}, ${T('x>0')}.`]);
  }
};
function mkShapeSteps(Pn, L, unk, ansT, caps) {
  const els = L.map((t, i) => hidLine(Pn, t, i === L.length - 1 ? 'u2l2-big' : 'u2l2-mid'));
  return caps.map((cap, i) => ({ cap, run: async (c) => { await show(c, els[i]); if (i === caps.length - 1) { unk.innerHTML = T(ansT); unk.classList.add('u2l2-known'); await pulse(c, unk, 1.15); } } }));
}

/* =============================== Stand Up Break! (whiteboard stations; ../standup.js) ===============================
 * Sits after Example 4. BEG: the restriction on √(ax + b) (or an odd root). PRG: simplify a square root of a number and
 * one or two variables. MAS: a cube or fourth root (negatives under a cube root), or mixed → entire with variables. */
const frT = (num, den) => { const g = (a, b) => (b ? g(b, a % b) : Math.abs(a)); const gg = g(num, den) || 1; let n = num / gg, d = den / gg; if (d < 0) { n = -n; d = -d; } return d === 1 ? String(n) : (n < 0 ? '-' : '') + `\\dfrac{${Math.abs(n)}}{${d}}`; };
const linT = (a, b) => { const ax = a === 1 ? 'x' : a === -1 ? '-x' : `${a}x`; return b === 0 ? ax : `${ax}${b > 0 ? '+' : '-'}${Math.abs(b)}`; };
const linT2 = (a, b) => { // b + ax with the constant first when a < 0 (like 9 − 3x)
  if (a > 0) return linT(a, b);
  const ax = a === -1 ? 'x' : `${-a}x`; return b === 0 ? `-${ax}` : `${b}-${ax}`;
};
standup('u2l2', {
  intro: 'At your whiteboard: even index → radicand ≥ 0; to simplify, divide each exponent by the index.',
  levels: {
    BEG: (r) => {
      if (r.chance(0.2)) { const k = r.pick([3, 5]), a = r.pick([1, 2, 3, -1, -2]), b = r.int(-9, 9); return { text: 'State the restriction on the variable.', q: rt(linT2(a, b), k), a: [`\\text{odd index: } x\\in\\mathbb{R}`] }; }
      let a, b; do { a = r.pick([1, 2, 3, 4, 5, -1, -2, -3, -4, -5]); b = r.int(-12, 12); } while (b === 0 && Math.abs(a) === 1);
      const k = r.chance(0.8) ? 2 : 4, rad = linT2(a, b), sol = frT(-b, a), rel = a > 0 ? '\\ge' : '\\le';
      const steps = [`${rad}\\ge0`];
      if (b !== 0 && a !== 1) steps.push(`${a === -1 ? '-x' : a + 'x'}\\ge${-b}`);
      steps.push(`x${rel}${sol}` + (a < 0 ? `\\quad(\\div${a}:\\ \\text{sign reverses})` : ''));
      return { text: 'State the restriction on the variable.', q: rt(rad, k), a: steps };
    },
    PRG: (r) => {
      const n = r.pick([4, 9, 16, 25, 36, 49]) * r.pick([2, 3, 5, 6, 7]);
      const vars = [['x', r.int(2, 9)]]; if (r.chance(0.6)) vars.push(['y', r.int(1, 8)]);
      const S = simp(n, vars, 2);
      return { text: 'Write in simplest form. State the restriction.', q: rt(S.radT, 2), a: [`=${rt(S.facT, 2)}`, `=${S.resT},\\ \\ ${restrT(vars)}`] };
    },
    MAS: (r) => {
      if (r.chance(0.35)) { // mixed → entire
        const k = r.pick([2, 3]), c = r.pick([2, 3, 4, 5]), e = r.int(1, 3), ie = r.int(1, k - 1 + (k === 2 ? 0 : 0)), m = r.pick([2, 3, 5, 7]);
        const sgn = k === 3 && r.chance(0.4) ? -1 : 1, cc = sgn * c, pc = Math.pow(cc, k);
        const mixT = `${cc}${powT('x', e)}${rt(m + powT('x', ie), k)}`;
        return { text: 'Write as an entire radical. Assume variables under an even index are ≥ 0.', q: mixT,
          a: [rt(`(${cc}${powT('x', e)})^{${k}}\\cdot ${m}${powT('x', ie)}`, k), `=${rt(`${pc}${powT('x', e * k)}\\cdot ${m}${powT('x', ie)}`, k)}`, `=${rt(`${pc * m}${powT('x', e * k + ie)}`, k)}`] };
      }
      const k = r.pick([3, 3, 4]);
      const n = k === 3 ? r.pick([8, 27, 64]) * r.pick([2, 3, 5]) * (r.chance(0.4) ? -1 : 1) : r.pick([16, 81]) * r.pick([2, 3, 5]);
      const vars = [['a', r.int(k + 1, 3 * k + 2)]]; if (r.chance(0.5)) vars.push(['b', r.int(1, 2 * k + 1)]);
      const S = simp(n, vars, k);
      return { text: 'Write in simplest form. State the restriction where needed.', q: rt(S.radT, k), a: [`=${rt(S.facT, k)}`, `=${S.resT}` + (S.even ? `,\\ \\ ${restrT(vars)}` : '\\quad(\\text{no restriction})')] };
    }
  }
});

/* =============================== mount =============================== */
mountMachine();
export const explainers = mountExplainers({ allowed, allowed7, flip, radgraph, groups, abs: absX, split, entire, checklist, shapes });
export const _test = { rootSplit, rootT, simp, probeRead, AL, GR, SP, EN, CK };
