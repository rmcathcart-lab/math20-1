/* Math 20-1 · Unit 2 · Lesson 3 — Adding and Subtracting Radicals.
 * Warm-up (Stepping Stones: square stones by area laid edge to edge; 9 + 16 is a 7 m path but one 25 stone is 5 m;
 * three area-2 stones match one area-18 stone exactly, because the 18 cuts into a 3 by 3 grid of 2s), and the explainers:
 *   likeTiles (radical tiles in bins: √7 tiles behave like x tiles, negative tiles cancel in zero pairs; Example 1 checks),
 *   legsVsHyp (√a + √b is the walk along the legs of a right triangle, √(a + b) the shortcut along the hypotenuse),
 *   squareCut (a square of area 72 cut into 36 squares of area 2: side 6√2; 9 × 8 first is not finished; Example 2(a)),
 *   sortBins (the star: as written the radicands look unlike; simplify each one, then its tiles drop into the bin of its
 *     radicand, so √12 and √27 both land in the √3 bin; Example 2 checks),
 *   cubeCut (a cube of volume 54 cut into 27 cubes of volume 2: edge 3∛2; Example 3(a) lines two cubes up),
 *   indexBins (the same bins keyed by index and radicand; Example 3 checks), fracFront (a fraction in front takes that
 *     fraction of the row of tiles; Example 4 checks), varBins (variable radicands and the restriction on a number line;
 *     Example 5 checks), gridLengths (run/rise triangles under each side on a grid; Example 6 check), missingSide (the
 *     perimeter as a strip of tiles; take away the known sides, both terms of a bracket; Example 7 check), balanceY (take
 *     the same tiles off both pans; Example 8(a) check), radSeq (rational hops above, radical hops below; Example 8(b)).
 * Colours: one colour per radicand (√2 blue, √3 teal, √5 purple, √7 amber, ∛ roots warmer), numbers slate, negative
 * tiles red (dashed); in sequences d is amber as in Unit 1. No calculator in this unit. */
import {
  h, tex, add, box, Graph, NumberLine, stamp, stampIn, mountExplainers, pop, fadeIn, appear, sleep, tween, pulse,
  svgEl, place, drawIn
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const C2 = '#1f5bd6', C3 = '#0f7f80', C5 = '#7b4fc4', C7 = '#c27a0e', CG = '#12805a', CB2 = '#c2531a', CB3 = '#a33357', CQ = '#0b6e99';
const NUMC = '#3a4254', XC = '#8a6440', INK = '#1c2230', RED = '#c93a33', DC = '#c27a0e', BR = '#7a1f3d';
const hexA = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
const mix = (hex, t) => { const n = parseInt(hex.slice(1), 16), f = (v) => Math.round(v + (255 - v) * t); return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`; };
const tc = (c, s) => `\\textcolor{${c}}{${s}}`;
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const mkSvg = (stage, W, H) => { const s = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u2l3-svg' }, stage); s.style.left = '0px'; s.style.top = '0px'; return s; };
const lab = (stage, x, y, html, cls = '', pos = 'c', gap = 0) => { const d = h('div', 'u2l3-lab ' + cls, html); stage.appendChild(d); place(d, x, y, pos, gap); return d; };
const panel = (stage, x, y, w, hh, title, cls = '') => add(stage, box(h('div', 'u2l3-panel ' + cls, title ? `<div class="u2l3-ph">${title}</div>` : ''), w, hh), x, y);
const line = (p, html, cls = '') => { const d = h('div', 'u2l3-line ' + cls, html); p.appendChild(d); return d; };
/** a number for TeX: integers, or a fraction with a small denominator (2.5 → \tfrac{5}{2}) */
function frTex(v) {
  if (Number.isInteger(v)) return String(v);
  for (let q = 2; q <= 12; q++) { const p = v * q; if (Math.abs(p - Math.round(p)) < 1e-9) return `${p < 0 ? '-' : ''}\\tfrac{${Math.abs(Math.round(p))}}{${q}}`; }
  return String(v);
}
/** n copies of a unit: 1 → √3, −1 → −√3, 5 → 5√3; a unit of '1' is a plain number */
const cTex = (n, u) => (u === '1' ? frTex(n) : n === 0 ? '0' : n === 1 ? u : n === -1 ? '-' + u : frTex(n) + u);
/** √n in simplest form → [outside, inside] */
function simpRoot(n) { let k = 1; for (let d = 2; d * d <= n; d++) if (n % (d * d) === 0) k = d; return [k, n / (k * k)]; }
const rootTex = (n) => { const [k, m] = simpRoot(n); return m === 1 ? String(k) : (k === 1 ? '' : k) + `\\sqrt{${m}}`; };
const listAnd = (a) => (a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]);
/** a curly brace under a horizontal span (opens upward) */
function braceH(parent, x0, x1, y, color = INK) {
  const m = (x0 + x1) / 2, q = 10;
  return svgEl('path', { d: `M${x0} ${y} q0 ${q} 10 ${q} L${m - 10} ${y + q} q10 0 10 ${q} q0 ${-q} 10 ${-q} L${x1 - 10} ${y + q} q10 0 10 ${-q}`, fill: 'none', stroke: color, 'stroke-width': 2.6, 'stroke-linecap': 'round', class: 'bk-stroke' }, parent);
}
/** one radical tile: unit TeX, colour, negative?, size, fraction of a full tile */
function tileEl(u, color, neg, w, hh, frac = 1) {
  const cc = neg ? RED : color, el = h('div', 'u2l3-tile' + (neg ? ' u2l3-neg-t' : '') + (frac < 1 ? ' u2l3-part' : ''), T((neg ? '-' : '') + (u === '1' ? '1' : u)));
  el.style.setProperty('--c', cc); el.style.setProperty('--cs', hexA(cc, neg ? 0.08 : 0.14));
  return box(el, Math.max(18, w * frac), hh);
}

/* ====================================================================================================
 * Warm-up: Stepping Stones
 * ==================================================================================================== */
function mountYard() {
  const host = document.getElementById('u2l3-yard'); if (!host) return;
  const svg = svgEl('svg', { viewBox: '0 0 600 400', class: 'u2l3-yardsvg', role: 'img', 'aria-label': 'Square stepping stones laid edge to edge on a lawn, with a measuring tape under the path.' }, host);
  svgEl('rect', { x: 0, y: 0, width: 600, height: 400, rx: 14, fill: '#e9f1df' }, svg);
  for (let i = 0; i < 26; i++) { const x = (i * 97) % 590 + 5, y = (i * 53) % 300 + 10; svgEl('path', { d: `M${x} ${y + 8} l3 -8 l3 8 M${x + 6} ${y + 8} l3 -6`, stroke: '#b9cfa3', 'stroke-width': 1.6, fill: 'none' }, svg); }
  const G = svgEl('g', {}, svg), BASE = 322;
  let gen = 0, mode = '';
  const stone = (x, side, area, o = {}) => {
    const g = svgEl('g', {}, G);
    svgEl('rect', { x, y: BASE - side, width: side, height: side, rx: 5, fill: o.ghost ? hexA(BR, 0.08) : '#cfc8b8', stroke: o.ghost ? BR : '#8f887a', 'stroke-width': o.ghost ? 3 : 2.2, 'stroke-dasharray': o.ghost ? '9 6' : null }, g);
    if (!o.ghost) for (let k = 0; k < 3; k++) svgEl('circle', { cx: x + side * (0.22 + 0.27 * k), cy: BASE - side * (0.3 + 0.2 * (k % 2)), r: Math.max(2, side * 0.025), fill: '#bdb5a3' }, g);
    const t = svgEl('text', { x: x + side / 2, y: (o.ty || BASE - side / 2 + 8), 'text-anchor': 'middle', class: 'u2l3-ytxt' + (o.ghost ? ' u2l3-ytxt-g' : '') }, g); t.textContent = area + ' m²';
    return g;
  };
  const tape = (s, metres) => {
    const g = svgEl('g', {}, G);
    svgEl('rect', { x: 14, y: BASE + 8, width: 572, height: 28, rx: 4, fill: '#f2c94c', stroke: '#b78f1d', 'stroke-width': 1.5 }, g);
    for (let m = 0; m <= metres; m++) {
      const x = 20 + m * s; if (x > 580) break;
      svgEl('line', { x1: x, x2: x, y1: BASE + 8, y2: BASE + 20, stroke: '#5a4410', 'stroke-width': 2 }, g);
      const t = svgEl('text', { x, y: BASE + 33, 'text-anchor': 'middle', class: 'u2l3-ttxt' }, g); t.textContent = m;
    }
    return g;
  };
  const bracket = (x0, x1, y, txt, color = INK) => {
    const g = svgEl('g', {}, G);
    svgEl('path', { d: `M${x0} ${y + 8} v-8 H${x1} v8`, fill: 'none', stroke: color, 'stroke-width': 2.4 }, g);
    const t = svgEl('text', { x: (x0 + x1) / 2, y: y - 8, 'text-anchor': 'middle', class: 'u2l3-btxt', fill: color }, g); t.textContent = txt;
    return g;
  };
  const fade = (el, d = 0) => el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 450, delay: d, fill: 'backwards' });
  const S1 = 52;
  function draw916() { G.innerHTML = ''; mode = '916'; tape(S1, 10); fade(stone(20, 3 * S1, 9)); fade(stone(20 + 3 * S1, 4 * S1, 16), 300); fade(bracket(20, 20 + 7 * S1, BASE - 4 * S1 - 14, '3 + 4 = 7 m'), 700); }
  document.getElementById('u2l3-w916').addEventListener('click', draw916);
  document.getElementById('u2l3-w25').addEventListener('click', () => {
    if (mode !== '916') draw916();
    const g = stone(20, 5 * S1, 25, { ghost: true, ty: BASE - 5 * S1 + 30 }); fade(g, 200);
    fade(bracket(20, 20 + 5 * S1, BASE - 5 * S1 - 12, '5 m', BR), 600);
  });
  const S2 = 60, r2 = Math.SQRT2 * S2, s18 = 3 * r2;
  let bG = null;
  document.getElementById('u2l3-w218').addEventListener('click', () => {
    G.innerHTML = ''; mode = '218';
    for (let k = 0; k < 3; k++) fade(stone(24 + k * r2, r2, 2), k * 200);
    const t = svgEl('text', { x: 24 + 1.5 * r2, y: BASE + 30, 'text-anchor': 'middle', class: 'u2l3-btxt' }, G); t.textContent = 'Path A'; fade(t, 600);
    bG = stone(320, s18, 18, { ty: BASE - s18 / 2 + 8 }); fade(bG, 700);
    const t2 = svgEl('text', { x: 320 + s18 / 2, y: BASE + 30, 'text-anchor': 'middle', class: 'u2l3-btxt' }, G); t2.textContent = 'Stone B'; fade(t2, 900);
  });
  document.getElementById('u2l3-wtile').addEventListener('click', () => {
    if (mode !== '218') document.getElementById('u2l3-w218').click();
    if (mode === '218t') return; mode = '218t';
    const grid = svgEl('g', {}, G);
    for (let i = 1; i < 3; i++) {
      svgEl('line', { x1: 320 + i * r2, x2: 320 + i * r2, y1: BASE - s18, y2: BASE, stroke: '#6b6455', 'stroke-width': 2.4 }, grid);
      svgEl('line', { x1: 320, x2: 320 + s18, y1: BASE - i * r2, y2: BASE - i * r2, stroke: '#6b6455', 'stroke-width': 2.4 }, grid);
    }
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { const t = svgEl('text', { x: 320 + (i + 0.5) * r2, y: BASE - (j + 0.5) * r2 + 7, 'text-anchor': 'middle', class: 'u2l3-ytxt u2l3-ytxt-s' }, grid); t.textContent = '2'; }
    bG.querySelector('text').style.opacity = 0;
    grid.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600, fill: 'backwards' });
    const b = bracket(320, 320 + s18, BASE - s18 - 14, '3 small sides = 3√2', BR); fade(b, 600);
    const b2 = bracket(24, 24 + 3 * r2, BASE - r2 - 14, '√2 + √2 + √2 = 3√2', C2); fade(b2, 1000);
  });
  document.getElementById('u2l3-wreset').addEventListener('click', () => { gen++; G.innerHTML = ''; mode = ''; });
}

/* ====================================================================================================
 * The tile bins (likeTiles, sortBins, indexBins, varBins)
 *   chip data: { label, ask, bins: [{k, t (unit TeX), c, tw?}], terms: [{o, sg, s?, out?, k, n (signed coefficient)}],
 *                grp?, ans, c0?, cDrop?, cCount?, capAns?, restrict? {v, min} | {v, all: true}, rcap? }
 * ==================================================================================================== */
const radOf = (o) => { const m = o.match(/\\sqrt(?:\[\d\])?\{(.*)\}/); return m ? m[1] : null; };
function binsDef(title, data, choices) {
  return {
    title, height: 470, minW: 940, capH: 84,
    choices,
    ask: (k) => data[k].ask,
    make(stage, key, ex) {
      const d = data[key], W = ex.W, H = ex.def.height, B = {};
      d.bins.forEach((b) => (B[b.k] = b));
      const expr = d.terms.map((t, i) => (i || t.sg < 0 ? (t.sg < 0 ? '-' : '+') : '') + t.o).join('');
      // the expression as cards
      const row = add(stage, box(h('div', 'u2l3-trow'), W, null), 0, 12);
      const cards = d.terms.map((t, i) => {
        if (i || t.sg < 0) row.appendChild(h('div', 'u2l3-op', t.sg < 0 ? '−' : '+'));
        const cd = h('div', 'u2l3-tcard', `<div class="u2l3-to">${T(t.o)}</div><div class="u2l3-ts">${t.s ? T('=' + t.out) : '&nbsp;'}</div>`);
        row.appendChild(cd); return cd;
      });
      const paint = (i) => { const b = B[d.terms[i].k]; cards[i].classList.remove('u2l3-unlike'); cards[i].style.setProperty('--c', b.c); cards[i].classList.add('on'); };
      // bins (narrower when a restriction number line sits on the right)
      const rW = d.restrict ? 430 : 0, nb = d.bins.length, gap = 16, by = 140, bh = H - by - 84;
      const bw = (W - 40 - rW - gap * (nb - 1)) / nb;
      const bins = d.bins.map((b, j) => {
        const el = add(stage, box(h('div', 'u2l3-bin'), bw, bh), 20 + j * (bw + gap), by);
        el.style.setProperty('--c', b.c); el.style.setProperty('--cs', hexA(b.c, 0.06));
        el.innerHTML = `<div class="u2l3-bin-h"><span class="u2l3-bin-u">${b.k === 'num' ? 'numbers' : T(b.t) + ' tiles'}</span><span class="u2l3-bin-tot"></span></div>`;
        hide(el);
        const ts = d.terms.filter((t) => t.k === b.k), P = ts.filter((t) => t.n > 0).reduce((s, t) => s + Math.ceil(t.n), 0), N = ts.filter((t) => t.n < 0).reduce((s, t) => s + Math.ceil(-t.n), 0);
        let w = (b.tw || 60) * 1.25, th = 50, per = 1;
        for (let it = 0; it < 14; it++) { per = Math.max(1, Math.floor((bw - 10) / (w + 6))); const need = (Math.ceil(P / per) + Math.ceil(N / per)) * (th + 6) + (P && N ? 10 : 0); if (need <= bh - 52) break; w *= 0.9; th *= 0.93; }
        const rowsP = Math.ceil(P / per);
        return { b, el, w, th, per, rowsP, pos: [], neg: [], ip: 0, iN: 0, total: ts.reduce((s, t) => s + t.n, 0) };
      });
      const binOf = (k) => bins.find((x) => x.b.k === k);
      const termTiles = d.terms.map((t) => {
        const bn = binOf(t.k), a = Math.abs(t.n), full = Math.floor(a + 1e-9), fr = a - full, neg = t.n < 0, out = [];
        for (let i = 0; i < full + (fr > 1e-9 ? 1 : 0); i++) {
          const f = i < full ? 1 : fr, idx = neg ? bn.iN++ : bn.ip++, r = Math.floor(idx / bn.per) + (neg ? bn.rowsP : 0), col = idx % bn.per;
          const el = add(bn.el, tileEl(bn.b.t, bn.b.c, neg, bn.w, bn.th, f), 8 + col * (bn.w + 6), 46 + r * (bn.th + 6) + (neg && bn.rowsP ? 10 : 0));
          hide(el); (neg ? bn.neg : bn.pos).push(el); out.push(el);
        }
        return out;
      });
      const res = add(stage, box(h('div', 'u2l3-res'), W - 40, 60), 20, H - 72); hide(res);
      let NL = null, rbox = null;
      if (d.restrict) {
        const rx = W - rW + 4, R = d.restrict;
        rbox = add(stage, box(h('div', 'u2l3-rbox', `<div class="u2l3-ph">Restriction</div><div class="u2l3-rtxt">${T(R.all ? `${R.v}\\in\\mathbb{R}` : `${R.v}\\ge${R.min}`)}</div><div class="u2l3-rsub">${R.all ? 'odd index: no restriction' : 'even index: radicand ≥ 0'}</div>`), rW - 24, 104), rx, by);
        NL = new NumberLine(stage, { x: rx - 6, y: by + 122, width: rW - 12, height: 96, min: R.all ? -4 : R.min - 3, max: R.all ? 4 : R.min + 4 });
        hide(rbox); hide(NL.el);
      }
      const needS = d.terms.some((t) => t.s);
      const steps = [];
      const rads = [...new Set(d.terms.map((t) => radOf(t.o)).filter(Boolean))].map((r) => T(r));
      steps.push({
        cap: d.c0 || (needS ? `As written, the radicands are ${listAnd(rads)}: they look <b>unlike</b>. Nothing combines yet.`
          : nb === 1 ? `Same index, same radicand: all the terms are ${T(d.bins[0].t)} terms. <b>Like radicals.</b>` : `Each kind of term gets its <b>own bin</b>: ${listAnd(d.bins.map((b) => (b.k === 'num' ? 'numbers' : T(b.t))))}.`),
        run: async (c) => {
          if (needS) { cards.forEach((cd, i) => { if (d.terms[i].s) cd.classList.add('u2l3-unlike'); else paint(i); }); await Promise.all(cards.map((cd) => pulse(c, cd, 1.05))); }
          else { cards.forEach((_, i) => paint(i)); await Promise.all(cards.map((cd) => pulse(c, cd, 1.06))); }
        }
      });
      d.terms.forEach((t, i) => {
        if (!t.s) return;
        steps.push({
          cap: (t.pre || 'Simplify: ') + T(t.s) + (t.why ? ' ' + t.why : '') + '.',
          run: async (c) => { paint(i); const s = cards[i].querySelector('.u2l3-ts'); s.classList.add('on'); await fadeIn(c, s, 360); }
        });
      });
      steps.push({
        cap: d.cDrop || (nb === 1 ? `${needS ? 'Now all' : 'All'} the terms are ${T(d.bins[0].t)} terms: the tiles go in <b>one bin</b>.` : `Drop each term’s tiles into its bin.`),
        run: async (c) => {
          await Promise.all(bins.map((bn) => show(c, bn.el)));
          for (let i = 0; i < d.terms.length; i++) {
            paint(i);
            const cd = cards[i], cx = row.offsetLeft + cd.offsetLeft + cd.offsetWidth / 2, cy = row.offsetTop + cd.offsetTop + cd.offsetHeight / 2;
            const tl = termTiles[i];
            const jobs = tl.map((el, j) => {
              const bel = el.parentNode, tx = bel.offsetLeft + el.offsetLeft + el.offsetWidth / 2, ty = bel.offsetTop + el.offsetTop + el.offsetHeight / 2;
              return c.anim(el, [{ opacity: 1, transform: `translate(${cx - tx}px, ${cy - ty}px) scale(.7)` }, { opacity: 1, transform: 'none' }], 520, { delay: j * 55 });
            });
            jobs.push(pulse(c, cd, 1.06));
            await Promise.all(jobs);
          }
        }
      });
      const zb = bins.filter((bn) => bn.pos.length && bn.neg.length);
      if (zb.length) {
        const zn = zb.map((bn) => Math.min(bn.pos.length, bn.neg.length));
        steps.push({
          cap: d.cZero || `A <b class="u2l3-neg">negative</b> tile cancels a positive one: <b>zero pairs</b>. ${zb.length === 1 ? `${zn[0]} pair${zn[0] > 1 ? 's' : ''} cancel${zn[0] > 1 ? '' : 's'}.` : ''}`,
          run: async (c) => {
            const jobs = [];
            zb.forEach((bn, q) => { for (let i = 0; i < zn[q]; i++) [bn.pos[bn.pos.length - 1 - i], bn.neg[i]].forEach((el) => { el.classList.add('u2l3-zero'); jobs.push(c.anim(el, [{ opacity: 1 }, { opacity: 0.16 }], 420, { delay: i * 70 })); }); });
            await Promise.all(jobs);
          }
        });
      }
      const totT = bins.map((bn) => cTex(bn.total, bn.b.k === 'num' ? '1' : bn.b.t));
      steps.push({
        cap: d.cCount || (nb === 1 ? `Count what is left: ${T(totT[0])}.` : `Count what is left in each bin: ${listAnd(totT.map((s) => T(s)))}.`),
        run: async (c) => {
          const jobs = [];
          bins.forEach((bn, j) => {
            const tot = bn.el.querySelector('.u2l3-bin-tot'); tot.innerHTML = T('=' + totT[j]); jobs.push(pop(c, tot, 360));
            [...bn.pos, ...bn.neg].filter((el) => !el.classList.contains('u2l3-zero')).forEach((el) => jobs.push(pulse(c, el, 1.08)));
          });
          await Promise.all(jobs);
        }
      });
      steps.push({
        cap: d.capAns || `So ${T(expr + '=' + d.ans)}.`,
        run: async (c) => { res.innerHTML = T(expr + '=' + (d.grp ? d.grp + '=' : '') + '\\boxed{' + d.ans + '}'); await show(c, res); }
      });
      if (d.restrict) {
        const R = d.restrict;
        steps.push({
          cap: d.rcap,
          run: async (c) => {
            await show(c, rbox); NL.el.style.opacity = 1;
            const iv = R.all ? NL.interval(-Infinity, Infinity, { color: 'green' }) : NL.interval(R.min, Infinity, { color: 'green' });
            await drawIn(iv, 700, c);
            if (!R.all) { const p = NL.point(R.min, { color: 'green' }); await pop(c, p, 300); }
          }
        });
      }
      return steps;
    }
  };
}
const B = {
  x: { k: 'x', t: 'x', c: XC }, num: { k: 'num', t: '1', c: NUMC },
  s2: { k: 's2', t: '\\sqrt{2}', c: C2 }, s3: { k: 's3', t: '\\sqrt{3}', c: C3 }, s5: { k: 's5', t: '\\sqrt{5}', c: C5 },
  s7: { k: 's7', t: '\\sqrt{7}', c: C7 }, s13: { k: 's13', t: '\\sqrt{13}', c: CG },
  c2: { k: 'c2', t: '\\sqrt[3]{2}', c: CB2 }, c3: { k: 'c3', t: '\\sqrt[3]{3}', c: CB3 }, c5: { k: 'c5', t: '\\sqrt[3]{5}', c: C5 }, c6: { k: 'c6', t: '\\sqrt[3]{6}', c: CG },
  q3: { k: 'q3', t: '\\sqrt[4]{3}', c: CQ }
};
const tm = (o, n, k, sg = 1, extra = {}) => Object.assign({ o, n, k, sg }, extra);

/* ---- section 1: like radicals ---- */
const LT = {
  x: { label: T('4x+3x'), ask: `Like terms: ${T('4x+3x')}`, bins: [B.x], terms: [tm('4x', 4, 'x'), tm('3x', 3, 'x')], grp: '(4+3)x', ans: '7x',
    c0: `Two ${T('x')} terms: <b>like terms</b>. Each ${T('x')} is one tile.`, cDrop: `Both are ${T('x')} terms: the tiles go in <b>one bin</b>.` },
  r7: { label: T('4\\sqrt{7}+3\\sqrt{7}'), ask: `Like radicals: ${T('4\\sqrt{7}+3\\sqrt{7}')}`, bins: [B.s7], terms: [tm('4\\sqrt{7}', 4, 's7'), tm('3\\sqrt{7}', 3, 's7')], grp: '(4+3)\\sqrt{7}', ans: '7\\sqrt{7}',
    c0: `Two ${T('\\sqrt{7}')} terms: <b>like radicals</b>. Each ${T('\\sqrt{7}')} is one tile, just like an ${T('x')}.`,
    capAns: `${T('4\\sqrt{7}+3\\sqrt{7}=7\\sqrt{7}')}, exactly like ${T('4x+3x=7x')}. The radical part stays ${T('\\sqrt{7}')}.` },
  e1a: { label: 'Example 1(a) check', ask: `<b>Example 1(a):</b> ${T('6\\sqrt{5}+3\\sqrt{5}')}`, bins: [B.s5], terms: [tm('6\\sqrt{5}', 6, 's5'), tm('3\\sqrt{5}', 3, 's5')], grp: '(6+3)\\sqrt{5}', ans: '9\\sqrt{5}' },
  e1b: { label: 'Example 1(b) check', ask: `<b>Example 1(b):</b> ${T('2\\sqrt{13}-8\\sqrt{13}+\\sqrt{13}')}`, bins: [B.s13], terms: [tm('2\\sqrt{13}', 2, 's13'), tm('8\\sqrt{13}', -8, 's13', -1), tm('\\sqrt{13}', 1, 's13')], grp: '(2-8+1)\\sqrt{13}', ans: '-5\\sqrt{13}',
    cCount: `Five <b class="u2l3-neg">negative</b> tiles are left: ${T('-5\\sqrt{13}')}.` },
  e1c: { label: 'Example 1(c) check', ask: `<b>Example 1(c):</b> ${T('7\\sqrt[3]{6}-10\\sqrt[3]{6}')}`, bins: [B.c6], terms: [tm('7\\sqrt[3]{6}', 7, 'c6'), tm('10\\sqrt[3]{6}', -10, 'c6', -1)], grp: '(7-10)\\sqrt[3]{6}', ans: '-3\\sqrt[3]{6}',
    c0: `Both are cube roots of 6: same index, same radicand. ${T('\\sqrt[3]{6}')} is the tile.` },
  e1d: { label: 'Example 1(d) check', ask: `<b>Example 1(d):</b> ${T('5\\sqrt{3}+2\\sqrt{7}-\\sqrt{3}+4\\sqrt{7}')}`, bins: [B.s3, B.s7], terms: [tm('5\\sqrt{3}', 5, 's3'), tm('2\\sqrt{7}', 2, 's7'), tm('\\sqrt{3}', -1, 's3', -1), tm('4\\sqrt{7}', 4, 's7')], grp: '(5-1)\\sqrt{3}+(2+4)\\sqrt{7}', ans: '4\\sqrt{3}+6\\sqrt{7}',
    capAns: `Unlike radicals stay as <b>separate terms</b>: ${T('4\\sqrt{3}+6\\sqrt{7}')}.` },
  e1e: { label: 'Example 1(e) check', ask: `<b>Example 1(e):</b> ${T('9-4\\sqrt{2}+3\\sqrt{2}-5')}`, bins: [B.num, B.s2], terms: [tm('9', 9, 'num'), tm('4\\sqrt{2}', -4, 's2', -1), tm('3\\sqrt{2}', 3, 's2'), tm('5', -5, 'num', -1)], grp: '(9-5)+(-4+3)\\sqrt{2}', ans: '4-\\sqrt{2}',
    c0: `<b>Rational terms</b> (plain numbers) get their own bin. They combine only with other numbers.`, capAns: `Numbers ${T('9-5=4')}, radicals ${T('-4\\sqrt{2}+3\\sqrt{2}=-\\sqrt{2}')}: the answer is ${T('4-\\sqrt{2}')}.` },
  e1f: { label: 'Example 1(f) check', ask: `<b>Example 1(f):</b> ${T('3\\sqrt{2}+2\\sqrt[3]{2}')}`, bins: [B.s2, B.c2], terms: [tm('3\\sqrt{2}', 3, 's2'), tm('2\\sqrt[3]{2}', 2, 'c2')], ans: '3\\sqrt{2}+2\\sqrt[3]{2}',
    c0: `Same radicand 2, but <b>different indices</b>: ${T('\\sqrt{2}')} and ${T('\\sqrt[3]{2}')} are not like radicals. Two bins.`,
    cCount: `Different bins: nothing combines.`, capAns: `${T('3\\sqrt{2}+2\\sqrt[3]{2}')} <b>cannot be simplified</b>.` }
};
const likeTiles = binsDef('Radical tiles: like radicals share a bin', LT, [
  { v: 'x', label: LT.x.label }, { v: 'r7', label: LT.r7.label }, { sep: 'Example 1' },
  ...['e1a', 'e1b', 'e1c', 'e1d', 'e1e', 'e1f'].map((k) => ({ v: k, label: LT[k].label.replace('Example 1', '') .replace(' check', '') }))
]);

/* ---- section 2: simplify first ---- */
const SB = {
  demo: { label: T('\\sqrt{12}+\\sqrt{75}+\\sqrt{8}'), ask: `Simplify ${T('\\sqrt{12}+\\sqrt{75}+\\sqrt{8}')}.`, bins: [B.s3, B.s2],
    terms: [tm('\\sqrt{12}', 2, 's3', 1, { s: '\\sqrt{12}=\\sqrt{4}\\sqrt{3}=2\\sqrt{3}', out: '2\\sqrt{3}' }), tm('\\sqrt{75}', 5, 's3', 1, { s: '\\sqrt{75}=\\sqrt{25}\\sqrt{3}=5\\sqrt{3}', out: '5\\sqrt{3}' }), tm('\\sqrt{8}', 2, 's2', 1, { s: '\\sqrt{8}=\\sqrt{4}\\sqrt{2}=2\\sqrt{2}', out: '2\\sqrt{2}' })],
    grp: '2\\sqrt{3}+5\\sqrt{3}+2\\sqrt{2}', ans: '7\\sqrt{3}+2\\sqrt{2}', cDrop: `${T('\\sqrt{12}')} and ${T('\\sqrt{75}')} both drop into the ${T('\\sqrt{3}')} bin; ${T('\\sqrt{8}')} goes in the ${T('\\sqrt{2}')} bin.` },
  e2a: { label: '2(a)', ask: `<b>Example 2(a):</b> ${T('\\sqrt{48}+\\sqrt{75}')}`, bins: [B.s3],
    terms: [tm('\\sqrt{48}', 4, 's3', 1, { s: '\\sqrt{48}=\\sqrt{16}\\sqrt{3}=4\\sqrt{3}', out: '4\\sqrt{3}' }), tm('\\sqrt{75}', 5, 's3', 1, { s: '\\sqrt{75}=\\sqrt{25}\\sqrt{3}=5\\sqrt{3}', out: '5\\sqrt{3}' })],
    grp: '4\\sqrt{3}+5\\sqrt{3}', ans: '9\\sqrt{3}' },
  e2b: { label: '2(b)', ask: `<b>Example 2(b):</b> ${T('3\\sqrt{8}-\\sqrt{50}+\\sqrt{18}')}`, bins: [B.s2],
    terms: [tm('3\\sqrt{8}', 6, 's2', 1, { s: '3\\sqrt{8}=3(2\\sqrt{2})=6\\sqrt{2}', out: '6\\sqrt{2}', why: '(the 3 multiplies what comes out)' }), tm('\\sqrt{50}', -5, 's2', -1, { s: '\\sqrt{50}=\\sqrt{25}\\sqrt{2}=5\\sqrt{2}', out: '5\\sqrt{2}', why: '(subtracted, so its tiles are negative)' }), tm('\\sqrt{18}', 3, 's2', 1, { s: '\\sqrt{18}=\\sqrt{9}\\sqrt{2}=3\\sqrt{2}', out: '3\\sqrt{2}' })],
    grp: '6\\sqrt{2}-5\\sqrt{2}+3\\sqrt{2}', ans: '4\\sqrt{2}' },
  e2c: { label: '2(c)', ask: `<b>Example 2(c):</b> ${T('\\sqrt{20}+\\sqrt{27}+\\sqrt{45}-\\sqrt{12}')}`, bins: [B.s5, B.s3],
    terms: [tm('\\sqrt{20}', 2, 's5', 1, { s: '\\sqrt{20}=\\sqrt{4}\\sqrt{5}=2\\sqrt{5}', out: '2\\sqrt{5}' }), tm('\\sqrt{27}', 3, 's3', 1, { s: '\\sqrt{27}=\\sqrt{9}\\sqrt{3}=3\\sqrt{3}', out: '3\\sqrt{3}' }), tm('\\sqrt{45}', 3, 's5', 1, { s: '\\sqrt{45}=\\sqrt{9}\\sqrt{5}=3\\sqrt{5}', out: '3\\sqrt{5}' }), tm('\\sqrt{12}', -2, 's3', -1, { s: '\\sqrt{12}=\\sqrt{4}\\sqrt{3}=2\\sqrt{3}', out: '2\\sqrt{3}' })],
    grp: '2\\sqrt{5}+3\\sqrt{3}+3\\sqrt{5}-2\\sqrt{3}', ans: '5\\sqrt{5}+\\sqrt{3}',
    cDrop: `${T('\\sqrt{20}')} and ${T('\\sqrt{45}')} drop into the ${T('\\sqrt{5}')} bin; ${T('\\sqrt{27}')} and ${T('\\sqrt{12}')} into the ${T('\\sqrt{3}')} bin.` },
  e2d: { label: '2(d)', ask: `<b>Example 2(d):</b> ${T('2\\sqrt{72}-3\\sqrt{32}+\\sqrt{98}')}`, bins: [B.s2],
    terms: [tm('2\\sqrt{72}', 12, 's2', 1, { s: '2\\sqrt{72}=2(6\\sqrt{2})=12\\sqrt{2}', out: '12\\sqrt{2}', why: '(36 is the largest perfect square in 72)' }), tm('3\\sqrt{32}', -12, 's2', -1, { s: '3\\sqrt{32}=3(4\\sqrt{2})=12\\sqrt{2}', out: '12\\sqrt{2}' }), tm('\\sqrt{98}', 7, 's2', 1, { s: '\\sqrt{98}=\\sqrt{49}\\sqrt{2}=7\\sqrt{2}', out: '7\\sqrt{2}' })],
    grp: '12\\sqrt{2}-12\\sqrt{2}+7\\sqrt{2}', ans: '7\\sqrt{2}', cZero: `All 12 <b class="u2l3-neg">negative</b> tiles cancel 12 positive ones: ${T('12\\sqrt{2}-12\\sqrt{2}=0')}.` }
};
const sortBins = binsDef('Simplify each radical, then sort the tiles into bins', SB, [
  { v: 'demo', label: SB.demo.label }, { sep: 'Example 2' }, ...['e2a', 'e2b', 'e2c', 'e2d'].map((k) => ({ v: k, label: SB[k].label }))
]);

/* ---- cube roots and fourth roots ---- */
const IB = {
  e3a: { label: '3(a)', ask: `<b>Example 3(a):</b> ${T('\\sqrt[3]{54}+\\sqrt[3]{16}')}`, bins: [B.c2],
    terms: [tm('\\sqrt[3]{54}', 3, 'c2', 1, { s: '\\sqrt[3]{54}=\\sqrt[3]{27}\\sqrt[3]{2}=3\\sqrt[3]{2}', out: '3\\sqrt[3]{2}' }), tm('\\sqrt[3]{16}', 2, 'c2', 1, { s: '\\sqrt[3]{16}=\\sqrt[3]{8}\\sqrt[3]{2}=2\\sqrt[3]{2}', out: '2\\sqrt[3]{2}' })],
    grp: '3\\sqrt[3]{2}+2\\sqrt[3]{2}', ans: '5\\sqrt[3]{2}' },
  e3b: { label: '3(b)', ask: `<b>Example 3(b):</b> ${T('2\\sqrt[3]{81}-\\sqrt[3]{24}+\\sqrt[3]{375}')}`, bins: [B.c3],
    terms: [tm('2\\sqrt[3]{81}', 6, 'c3', 1, { s: '2\\sqrt[3]{81}=2(3\\sqrt[3]{3})=6\\sqrt[3]{3}', out: '6\\sqrt[3]{3}', why: '(27 is a perfect cube)' }), tm('\\sqrt[3]{24}', -2, 'c3', -1, { s: '\\sqrt[3]{24}=\\sqrt[3]{8}\\sqrt[3]{3}=2\\sqrt[3]{3}', out: '2\\sqrt[3]{3}' }), tm('\\sqrt[3]{375}', 5, 'c3', 1, { s: '\\sqrt[3]{375}=\\sqrt[3]{125}\\sqrt[3]{3}=5\\sqrt[3]{3}', out: '5\\sqrt[3]{3}' })],
    grp: '6\\sqrt[3]{3}-2\\sqrt[3]{3}+5\\sqrt[3]{3}', ans: '9\\sqrt[3]{3}' },
  e3c: { label: '3(c)', ask: `<b>Example 3(c):</b> ${T('\\sqrt[3]{-40}+3\\sqrt[3]{135}')}`, bins: [B.c5],
    terms: [tm('\\sqrt[3]{-40}', -2, 'c5', 1, { s: '\\sqrt[3]{-40}=\\sqrt[3]{-8}\\sqrt[3]{5}=-2\\sqrt[3]{5}', out: '-2\\sqrt[3]{5}', why: '(odd index: the minus sign comes out, so these tiles are negative)' }), tm('3\\sqrt[3]{135}', 9, 'c5', 1, { s: '3\\sqrt[3]{135}=3(3\\sqrt[3]{5})=9\\sqrt[3]{5}', out: '9\\sqrt[3]{5}' })],
    grp: '-2\\sqrt[3]{5}+9\\sqrt[3]{5}', ans: '7\\sqrt[3]{5}' },
  e3d: { label: '3(d)', ask: `<b>Example 3(d):</b> ${T('\\sqrt[4]{48}+\\sqrt[4]{243}')}`, bins: [B.q3],
    terms: [tm('\\sqrt[4]{48}', 2, 'q3', 1, { s: '\\sqrt[4]{48}=\\sqrt[4]{16}\\sqrt[4]{3}=2\\sqrt[4]{3}', out: '2\\sqrt[4]{3}', why: '(16 = 2⁴)' }), tm('\\sqrt[4]{243}', 3, 'q3', 1, { s: '\\sqrt[4]{243}=\\sqrt[4]{81}\\sqrt[4]{3}=3\\sqrt[4]{3}', out: '3\\sqrt[4]{3}', why: '(81 = 3⁴)' })],
    grp: '2\\sqrt[4]{3}+3\\sqrt[4]{3}', ans: '5\\sqrt[4]{3}' },
  e3e: { label: '3(e)', ask: `<b>Example 3(e):</b> ${T('\\sqrt{12}+\\sqrt[3]{24}')}`, bins: [B.s3, B.c3],
    terms: [tm('\\sqrt{12}', 2, 's3', 1, { s: '\\sqrt{12}=\\sqrt{4}\\sqrt{3}=2\\sqrt{3}', out: '2\\sqrt{3}' }), tm('\\sqrt[3]{24}', 2, 'c3', 1, { s: '\\sqrt[3]{24}=\\sqrt[3]{8}\\sqrt[3]{3}=2\\sqrt[3]{3}', out: '2\\sqrt[3]{3}' })],
    ans: '2\\sqrt{3}+2\\sqrt[3]{3}', cDrop: `Same radicand 3, but <b>different indices</b>: ${T('\\sqrt{3}')} and ${T('\\sqrt[3]{3}')} go in different bins.`,
    cCount: `Nothing can combine: one ${T('2\\sqrt{3}')}, one ${T('2\\sqrt[3]{3}')}.`, capAns: `${T('2\\sqrt{3}+2\\sqrt[3]{3}')}: different indices, so this is the <b>simplest form</b>.` },
  e3f: { label: '3(f)', ask: `<b>Example 3(f):</b> ${T('\\sqrt{50}+\\sqrt[3]{16}-\\sqrt{8}')}`, bins: [B.s2, B.c2],
    terms: [tm('\\sqrt{50}', 5, 's2', 1, { s: '\\sqrt{50}=\\sqrt{25}\\sqrt{2}=5\\sqrt{2}', out: '5\\sqrt{2}' }), tm('\\sqrt[3]{16}', 2, 'c2', 1, { s: '\\sqrt[3]{16}=\\sqrt[3]{8}\\sqrt[3]{2}=2\\sqrt[3]{2}', out: '2\\sqrt[3]{2}' }), tm('\\sqrt{8}', -2, 's2', -1, { s: '\\sqrt{8}=\\sqrt{4}\\sqrt{2}=2\\sqrt{2}', out: '2\\sqrt{2}' })],
    grp: '5\\sqrt{2}-2\\sqrt{2}+2\\sqrt[3]{2}', ans: '3\\sqrt{2}+2\\sqrt[3]{2}', cDrop: `Square roots of 2 in one bin, cube roots of 2 in another.` }
};
const indexBins = binsDef('Bins by index and radicand', IB, [{ sep: 'Example 3' }, ...Object.keys(IB).map((k) => ({ v: k, label: IB[k].label }))]);

/* ---- section 3: variables ---- */
const VB = {
  v0: { label: T('3x\\sqrt{2x}+5x\\sqrt{2x}'), ask: `${T('3x\\sqrt{2x}+5x\\sqrt{2x}')}`, bins: [{ k: 'u', t: 'x\\sqrt{2x}', c: C5, tw: 92 }],
    terms: [tm('3x\\sqrt{2x}', 3, 'u'), tm('5x\\sqrt{2x}', 5, 'u')], grp: '(3+5)x\\sqrt{2x}', ans: '8x\\sqrt{2x}',
    c0: `Same index, same radicand ${T('2x')}, same variable part ${T('x')} in front: <b>like terms</b>. One tile is ${T('x\\sqrt{2x}')}.`,
    restrict: { v: 'x', min: 0 }, rcap: `Restriction: the radicand ${T('2x\\ge0')}, so ${T('x\\ge0')}.` },
  e5a: { label: '5(a)', ask: `<b>Example 5(a):</b> ${T('\\sqrt{9a}+\\sqrt{25a}-\\sqrt{4a}')}`, bins: [{ k: 'u', t: '\\sqrt{a}', c: C5 }],
    terms: [tm('\\sqrt{9a}', 3, 'u', 1, { s: '\\sqrt{9a}=\\sqrt{9}\\sqrt{a}=3\\sqrt{a}', out: '3\\sqrt{a}' }), tm('\\sqrt{25a}', 5, 'u', 1, { s: '\\sqrt{25a}=5\\sqrt{a}', out: '5\\sqrt{a}' }), tm('\\sqrt{4a}', -2, 'u', -1, { s: '\\sqrt{4a}=2\\sqrt{a}', out: '2\\sqrt{a}' })],
    grp: '3\\sqrt{a}+5\\sqrt{a}-2\\sqrt{a}', ans: '6\\sqrt{a}', restrict: { v: 'a', min: 0 }, rcap: `Restriction: each radicand (${T('9a')}, ${T('25a')}, ${T('4a')}) must be ${T('\\ge0')}, so ${T('a\\ge0')}.` },
  e5b: { label: '5(b)', ask: `<b>Example 5(b):</b> ${T('\\sqrt{12x^3}+x\\sqrt{27x}')}`, bins: [{ k: 'u', t: 'x\\sqrt{3x}', c: C3, tw: 92 }],
    terms: [tm('\\sqrt{12x^3}', 2, 'u', 1, { s: '\\sqrt{12x^3}=\\sqrt{4x^2}\\sqrt{3x}=2x\\sqrt{3x}', out: '2x\\sqrt{3x}' }), tm('x\\sqrt{27x}', 3, 'u', 1, { s: 'x\\sqrt{27x}=x\\sqrt{9}\\sqrt{3x}=3x\\sqrt{3x}', out: '3x\\sqrt{3x}' })],
    grp: '2x\\sqrt{3x}+3x\\sqrt{3x}', ans: '5x\\sqrt{3x}', cDrop: `Both are ${T('x\\sqrt{3x}')} terms: one tile is ${T('x\\sqrt{3x}')}.`,
    restrict: { v: 'x', min: 0 }, rcap: `Restriction: ${T('12x^3\\ge0')} and ${T('27x\\ge0')}, so ${T('x\\ge0')}.` },
  e5c: { label: '5(c)', ask: `<b>Example 5(c):</b> ${T('\\sqrt[3]{16y^4}-y\\sqrt[3]{54y}')}`, bins: [{ k: 'u', t: 'y\\sqrt[3]{2y}', c: CB2, tw: 96 }],
    terms: [tm('\\sqrt[3]{16y^4}', 2, 'u', 1, { s: '\\sqrt[3]{16y^4}=\\sqrt[3]{8y^3}\\sqrt[3]{2y}=2y\\sqrt[3]{2y}', out: '2y\\sqrt[3]{2y}' }), tm('y\\sqrt[3]{54y}', -3, 'u', -1, { s: 'y\\sqrt[3]{54y}=y\\sqrt[3]{27}\\sqrt[3]{2y}=3y\\sqrt[3]{2y}', out: '3y\\sqrt[3]{2y}' })],
    grp: '2y\\sqrt[3]{2y}-3y\\sqrt[3]{2y}', ans: '-y\\sqrt[3]{2y}', cCount: `One <b class="u2l3-neg">negative</b> tile is left: ${T('-y\\sqrt[3]{2y}')}.`,
    restrict: { v: 'y', all: true }, rcap: `A <b>cube root</b> takes any radicand: <b>no restriction</b>, ${T('y\\in\\mathbb{R}')}.` },
  e5d: { label: '5(d)', ask: `<b>Example 5(d):</b> ${T('\\sqrt{4x-8}+\\sqrt{x-2}')}`, bins: [{ k: 'u', t: '\\sqrt{x-2}', c: CG, tw: 84 }],
    terms: [tm('\\sqrt{4x-8}', 2, 'u', 1, { pre: 'Factor first: ', s: '\\sqrt{4x-8}=\\sqrt{4(x-2)}=2\\sqrt{x-2}', out: '2\\sqrt{x-2}' }), tm('\\sqrt{x-2}', 1, 'u')],
    grp: '2\\sqrt{x-2}+\\sqrt{x-2}', ans: '3\\sqrt{x-2}', cDrop: `Now both are ${T('\\sqrt{x-2}')} terms: one bin.`,
    restrict: { v: 'x', min: 2 }, rcap: `Restriction: ${T('x-2\\ge0')}, so ${T('x\\ge2')}.` }
};
const varBins = binsDef('Variable radicands: simplify, combine, restrict', VB, [{ v: 'v0', label: VB.v0.label }, { sep: 'Example 5' }, ...['e5a', 'e5b', 'e5c', 'e5d'].map((k) => ({ v: k, label: VB[k].label }))]);

/* =============================== explainer: legs vs hypotenuse =============================== */
const LH = {
  a916: { label: T('\\sqrt{9}+\\sqrt{16}'), a: 9, b: 16, sa: '3', sb: '4', walk: '3+4=7', hyp: '\\sqrt{25}=5', cmp: '7\\ne5' },
  a22: { label: T('\\sqrt{2}+\\sqrt{2}'), a: 2, b: 2, sa: '\\sqrt{2}', sb: '\\sqrt{2}', walk: '2\\sqrt{2}', hyp: '\\sqrt{4}=2', cmp: '2\\sqrt{2}\\ne2' },
  a18: { label: T('\\sqrt{1}+\\sqrt{8}'), a: 1, b: 8, sa: '1', sb: '2\\sqrt{2}', walk: '1+2\\sqrt{2}', hyp: '\\sqrt{9}=3', cmp: '1+2\\sqrt{2}\\ne3' }
};
const legsVsHyp = {
  title: 'The walk along the legs vs the shortcut',
  height: 460, minW: 900,
  choices: Object.keys(LH).map((k) => ({ v: k, label: LH[k].label })),
  ask: (k) => `Is ${T(`\\sqrt{${LH[k].a}}+\\sqrt{${LH[k].b}}`)} the same as ${T(`\\sqrt{${LH[k].a}+${LH[k].b}}`)}?`,
  make(stage, k, ex) {
    const d = LH[k], W = ex.W, H = ex.def.height, la = Math.sqrt(d.a), lb = Math.sqrt(d.b);
    const svg = mkSvg(stage, W, H);
    const wU = la + 2 * lb, hU = lb + 2 * la, u = Math.min(560 / wU, (H - 40) / hU);
    const ox = 24 + (580 - wU * u) / 2 + lb * u, oy = 20 + (H - 40 - hU * u) / 2 + (lb + la) * u; // A = (ox, oy)
    const A = [ox, oy], R = [ox + la * u, oy], Bv = [ox + la * u, oy - lb * u], n = [-lb * u, -la * u];
    const poly = (pts, fill, stroke) => svgEl('polygon', { points: pts.map((p) => p.join(',')).join(' '), fill, stroke, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, svg);
    const sqA = poly([A, R, [R[0], R[1] + la * u], [A[0], A[1] + la * u]], hexA(C3, 0.13), C3);
    const sqB = poly([R, Bv, [Bv[0] + lb * u, Bv[1]], [R[0] + lb * u, R[1]]], hexA(C2, 0.13), C2);
    const sqC = poly([A, Bv, [Bv[0] + n[0], Bv[1] + n[1]], [A[0] + n[0], A[1] + n[1]]], hexA(BR, 0.1), BR);
    [sqA, sqB, sqC].forEach(hide);
    poly([A, R, Bv], '#fff', INK);
    svgEl('path', { d: `M${R[0] - 16} ${R[1]} v-16 h16`, fill: 'none', stroke: INK, 'stroke-width': 2 }, svg);
    const sl = (n2, s) => (s === `\\sqrt{${n2}}` ? s : `\\sqrt{${n2}}=${s}`);
    const aA = lab(stage, (A[0] + R[0]) / 2, A[1] + la * u / 2, T(String(d.a)), 'u2l3-area', 'c'), aB = lab(stage, R[0] + lb * u / 2, R[1] - lb * u / 2, T(String(d.b)), 'u2l3-area', 'c');
    const cC = [(A[0] + Bv[0] + n[0]) / 2, (A[1] + Bv[1] + n[1]) / 2], aC = lab(stage, cC[0], cC[1], T(`${d.a}+${d.b}=${d.a + d.b}`), 'u2l3-area', 'c');
    const sA = lab(stage, (A[0] + R[0]) / 2, A[1] - 4, T(sl(d.a, d.sa)), 'u2l3-slab u2l3-c3', 'n', 2), sB = lab(stage, R[0] - 8, (R[1] + Bv[1]) / 2, T(sl(d.b, d.sb)), 'u2l3-slab u2l3-c2', 'w', 2);
    [aA, aB, aC, sA, sB].forEach(hide);
    const walk = svgEl('path', { d: `M${A.join(' ')} L${R.join(' ')} L${Bv.join(' ')}`, fill: 'none', stroke: DC, 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'bk-stroke', opacity: 0.85 }, svg);
    const cut = svgEl('path', { d: `M${A.join(' ')} L${Bv.join(' ')}`, fill: 'none', stroke: BR, 'stroke-width': 7, 'stroke-linecap': 'round', class: 'bk-stroke', opacity: 0.85 }, svg);
    hide(walk); hide(cut);
    const pn = panel(stage, W - 330, 30, 310, 300, 'Compare');
    const steps = [
      { cap: `Squares of area ${d.a} and ${d.b} sit on the two short sides. Their sides are ${T(sl(d.a, d.sa))} and ${T(sl(d.b, d.sb))}.`,
        run: async (c) => { await Promise.all([appear(c, sqA, 400), appear(c, sqB, 400)]); await Promise.all([pop(c, aA), pop(c, aB), show(c, sA), show(c, sB)]); } },
      { cap: `Walk along both short sides: ${T(`\\sqrt{${d.a}}+\\sqrt{${d.b}}=${d.walk}`)}.`,
        run: async (c) => { walk.style.opacity = 0.85; await drawIn(walk, 900, c); await show(c, line(pn, `<span class="u2l3-wk">walk</span> ${T(`\\sqrt{${d.a}}+\\sqrt{${d.b}}=${d.walk}`)}`)); } },
      { cap: `By Pythagoras, the square on the slanted side has area ${T(`${d.a}+${d.b}=${d.a + d.b}`)}.`,
        run: async (c) => { await appear(c, sqC, 450); await pop(c, aC); } },
      { cap: `Its side is the shortcut: ${T(`\\sqrt{${d.a}+${d.b}}=${d.hyp}`)}.`,
        run: async (c) => { cut.style.opacity = 0.85; await drawIn(cut, 700, c); await show(c, line(pn, `<span class="u2l3-wk u2l3-wk2">shortcut</span> ${T(`\\sqrt{${d.a}+${d.b}}=${d.hyp}`)}`)); } },
      { cap: `The shortcut is always <b>shorter</b>. So ${T(`\\sqrt{${d.a}}+\\sqrt{${d.b}}\\ne\\sqrt{${d.a}+${d.b}}`)}: never add the radicands.`,
        run: async (c) => {
          await show(c, line(pn, T(d.cmp), 'u2l3-big'));
          const l2 = line(pn, T(`\\sqrt{${d.a}}+\\sqrt{${d.b}}\\ne\\sqrt{${d.a}+${d.b}}`), 'u2l3-key-line'); await show(c, l2);
        } }
    ];
    return steps;
  }
};

/* =============================== explainer: cut the square =============================== */
const SQ = {
  s18: { label: T('\\sqrt{18}'), sq: [{ A: 18, n: 3, m: 2 }] },
  s72: { label: T('\\sqrt{72}'), sq: [{ A: 72, n: 6, m: 2, mid: { n: 3, m: 8 } }] },
  e2a: { label: 'Example 2(a) check', ex: true, sq: [{ A: 48, n: 4, m: 3 }, { A: 75, n: 5, m: 3 }] }
};
const squareCut = {
  title: 'Cut the square into small squares',
  height: 460, minW: 900,
  choices: Object.keys(SQ).map((k) => ({ v: k, label: SQ[k].label })),
  ask: (k) => (SQ[k].ex ? `<b>Example 2(a):</b> ${T('\\sqrt{48}+\\sqrt{75}')}` : `Simplify ${T(`\\sqrt{${SQ[k].sq[0].A}}`)}.`),
  make(stage, k, ex) {
    const d = SQ[k], W = ex.W, H = ex.def.height, two = d.sq.length > 1, m = d.sq[0].m, col = m === 2 ? C2 : C3;
    const svg = mkSvg(stage, W, H), base = H - 104, nT = d.sq.reduce((s, q) => s + q.n, 0), nM = Math.max(...d.sq.map((q) => q.n));
    const q = Math.min(100, (base - 26) / nM, (two ? 520 : 560) / nT), X0 = 40 + (580 - nT * q) / 2;
    let x = X0;
    const S = d.sq.map((s, si) => {
      const side = s.n * q, y0 = base - side, g = svgEl('g', {}, svg);
      svgEl('rect', { x, y: y0, width: side, height: side, fill: hexA(col, 0.07), stroke: col, 'stroke-width': 3 }, g);
      const area = lab(stage, x + side / 2, y0 + side / 2, `area <b>${s.A}</b>`, 'u2l3-sqarea', 'c');
      const sideL = si > 0 ? lab(stage, x + side + 8, y0 + side / 2, T(`\\sqrt{${s.A}}`), 'u2l3-slab', 'e', 0) : lab(stage, x - 8, y0 + side / 2, T(`\\sqrt{${s.A}}`), 'u2l3-slab', 'w', 0);
      const grid = svgEl('g', { opacity: 0 }, svg), cells = svgEl('g', { opacity: 0 }, svg);
      for (let i = 1; i < s.n; i++) {
        svgEl('line', { x1: x + i * q, x2: x + i * q, y1: y0, y2: base, stroke: col, 'stroke-width': 1.6, class: 'bk-stroke' }, grid);
        svgEl('line', { x1: x, x2: x + side, y1: y0 + i * q, y2: y0 + i * q, stroke: col, 'stroke-width': 1.6, class: 'bk-stroke' }, grid);
      }
      for (let i = 0; i < s.n; i++) for (let j = 0; j < s.n; j++) { const t = svgEl('text', { x: x + (i + 0.5) * q, y: y0 + (j + 0.5) * q + 6, 'text-anchor': 'middle', class: 'u2l3-cellt' }, cells); t.textContent = s.m; }
      let mid = null;
      if (s.mid) {
        mid = { grid: svgEl('g', { opacity: 0 }, svg), cells: svgEl('g', { opacity: 0 }, svg) }; const Q = side / s.mid.n;
        for (let i = 1; i < s.mid.n; i++) {
          svgEl('line', { x1: x + i * Q, x2: x + i * Q, y1: y0, y2: base, stroke: INK, 'stroke-width': 3, 'stroke-dasharray': '10 6', class: 'bk-stroke' }, mid.grid);
          svgEl('line', { x1: x, x2: x + side, y1: y0 + i * Q, y2: y0 + i * Q, stroke: INK, 'stroke-width': 3, 'stroke-dasharray': '10 6', class: 'bk-stroke' }, mid.grid);
        }
        for (let i = 0; i < s.mid.n; i++) for (let j = 0; j < s.mid.n; j++) { const t = svgEl('text', { x: x + (i + 0.5) * Q, y: y0 + (j + 0.5) * Q + 9, 'text-anchor': 'middle', class: 'u2l3-cellt u2l3-cellt-b' }, mid.cells); t.textContent = s.mid.m; }
      }
      const o = { s, x, y0, side, area, sideL, grid, cells, mid };
      x += side; return o;
    });
    const hl = svgEl('rect', { x: S[0].x, y: base - q, width: q, height: q, fill: hexA(col, 0.4), stroke: col, 'stroke-width': 3 }, svg); hide(hl);
    const hlL = lab(stage, S[0].x + q / 2, base + 6, T(`\\sqrt{${m}}`), 'u2l3-cellside', 's', 0); hide(hlL);
    const unitL = []; let ux = X0;
    for (let i = 0; i < nT; i++) { const e = lab(stage, ux + (i + 0.5) * q, base + 6, T(`\\sqrt{${m}}`), 'u2l3-cellside', 's', 0); hide(e); unitL.push(e); }
    const br = braceH(svg, X0, X0 + nT * q, base + 40, BR); hide(br);
    const brL = lab(stage, X0 + nT * q / 2, base + 60, T(`${nT}\\sqrt{${m}}`), 'u2l3-brl', 's', 0); hide(brL);
    const pn = panel(stage, W - 350, 24, 330, H - 48, two ? 'Example 2(a)' : 'Simplify');
    const steps = [];
    const sq0 = S[0];
    if (sq0.s.mid) {
      const M = sq0.s.mid;
      steps.push({ cap: `Try ${T(`${sq0.s.A}=${M.n * M.n}\\times${M.m}`)} first: a ${M.n} by ${M.n} grid of squares of area ${M.m}. The side is ${T(`${M.n}\\sqrt{${M.m}}`)}.`,
        run: async (c) => { sq0.area.style.opacity = 0; sq0.mid.grid.setAttribute('opacity', 1); await drawIn(sq0.mid.grid, 700, c); await appear(c, sq0.mid.cells, 300); await show(c, line(pn, T(`\\sqrt{72}=\\sqrt{9}\\sqrt{8}=3\\sqrt{8}`))); } });
      steps.push({ cap: `Not finished: each area-8 square cuts again into 4 squares of area 2, since ${T('\\sqrt{8}=2\\sqrt{2}')}.`,
        run: async (c) => { await c.anim(sq0.mid.cells, [{ opacity: 1 }, { opacity: 0 }], 300); sq0.grid.setAttribute('opacity', 1); await drawIn(sq0.grid, 800, c); await appear(c, sq0.cells, 300); await show(c, line(pn, T(`=3(2\\sqrt{2})=6\\sqrt{2}`))); } });
    }
    S.forEach((o, i) => {
      if (o.s.mid) return;
      steps.push({ cap: `${T(`${o.s.A}=${o.s.n * o.s.n}\\times${o.s.m}`)}: cut it into a ${o.s.n} by ${o.s.n} grid of ${o.s.n * o.s.n} small squares, each of area ${o.s.m}.${two ? ` So ${T(`\\sqrt{${o.s.A}}=${o.s.n}\\sqrt{${o.s.m}}`)}.` : ''}`,
        run: async (c) => { o.area.style.opacity = 0; o.grid.setAttribute('opacity', 1); await drawIn(o.grid, 800, c); await appear(c, o.cells, 300); await show(c, line(pn, T(`\\sqrt{${o.s.A}}=\\sqrt{${o.s.n * o.s.n}}\\sqrt{${o.s.m}}=${o.s.n}\\sqrt{${o.s.m}}`))); } });
    });
    steps.push({ cap: `Each small square has area ${m}, so its side is ${T(`\\sqrt{${m}}`)}.`,
      run: async (c) => { await appear(c, hl, 300); await pop(c, hlL); } });
    steps.push({ cap: two ? `Lay them side by side: the bottom edge is ${T('4+5=9')} small sides. ${T('\\sqrt{48}+\\sqrt{75}=4\\sqrt{3}+5\\sqrt{3}=9\\sqrt{3}')}.` : `Count the small sides along the bottom: ${nT}. So ${T(`\\sqrt{${sq0.s.A}}=${nT}\\sqrt{${m}}`)}.`,
      run: async (c) => {
        hlL.style.opacity = 0; hl.style.opacity = 0;
        for (const e of unitL) await pop(c, e, 200);
        br.style.opacity = 1; await drawIn(br, 500, c); await pop(c, brL);
        if (two) await show(c, line(pn, T('\\sqrt{48}+\\sqrt{75}=4\\sqrt{3}+5\\sqrt{3}'))).then(() => show(c, line(pn, T('=\\boldsymbol{9\\sqrt{3}}'), 'u2l3-big')));
        else if (!sq0.s.mid) await show(c, line(pn, T(`\\sqrt{${sq0.s.A}}=\\boldsymbol{${nT}\\sqrt{${m}}}`), 'u2l3-big'));
      } });
    if (sq0.s.mid) steps.push({ cap: `Faster: 36 is the <b>largest perfect square</b> factor of 72, so go straight to ${T('\\sqrt{36}\\sqrt{2}=6\\sqrt{2}')}.`,
      run: async (c) => { await show(c, line(pn, T('\\sqrt{72}=\\sqrt{36}\\sqrt{2}=\\boldsymbol{6\\sqrt{2}}'), 'u2l3-key-line')); } });
    if (k === 's18') steps.push({ cap: `That is the warm-up: one stone of area 18 is exactly as long as three stones of area 2. ${T('\\sqrt{18}=\\sqrt{2}+\\sqrt{2}+\\sqrt{2}')}.`,
      run: async (c) => { await show(c, line(pn, T('\\sqrt{2}+\\sqrt{2}+\\sqrt{2}=3\\sqrt{2}'), 'u2l3-key-line')); } });
    return steps;
  }
};

/* =============================== explainer: cut the cube =============================== */
const CU = {
  c54: { label: T('\\sqrt[3]{54}'), cubes: [{ V: 54, n: 3, m: 2, at: [0, 0] }] },
  c375: { label: T('\\sqrt[3]{375}'), cubes: [{ V: 375, n: 5, m: 3, at: [0, 0] }], four: true },
  e3a: { label: 'Example 3(a) check', ex: true, cubes: [{ V: 54, n: 3, m: 2, at: [0, 0] }, { V: 16, n: 2, m: 2, at: [3, 1] }] }
};
const cubeCut = {
  title: 'Cut the cube into small cubes',
  height: 460, minW: 900,
  choices: Object.keys(CU).map((k) => ({ v: k, label: CU[k].label })),
  ask: (k) => (CU[k].ex ? `<b>Example 3(a):</b> ${T('\\sqrt[3]{54}+\\sqrt[3]{16}')}` : `Simplify ${T(`\\sqrt[3]{${CU[k].cubes[0].V}}`)}.`),
  make(stage, k, ex) {
    const d = CU[k], W = ex.W, H = ex.def.height, m = d.cubes[0].m, col = m === 2 ? CB2 : CB3, cx = Math.cos(Math.PI / 6);
    const svg = mkSvg(stage, W, H);
    // bounding box in units
    const pts = []; d.cubes.forEach((q) => { const [x0, y0] = q.at; [0, q.n].forEach((a) => [0, q.n].forEach((b) => [0, q.n].forEach((z) => pts.push([x0 + a, y0 + b, z])))); });
    const sx = (p) => (p[0] - p[1]) * cx, sy = (p) => (p[0] + p[1]) * 0.5 - p[2];
    const minX = Math.min(...pts.map(sx)), maxX = Math.max(...pts.map(sx)), minY = Math.min(...pts.map(sy)), maxY = Math.max(...pts.map(sy));
    const s = Math.min(560 / (maxX - minX), (H - 120) / (maxY - minY)), ox = 40 + (560 - (maxX - minX) * s) / 2 - minX * s, oy = 30 + (H - 120 - (maxY - minY) * s) / 2 - minY * s;
    const P = (x, y, z) => [ox + (x - y) * cx * s, oy + ((x + y) * 0.5 - z) * s];
    const poly = (g, ps, fill, sw = 2.4) => svgEl('polygon', { points: ps.map((p) => P(...p).map((v) => v.toFixed(1)).join(',')).join(' '), fill, stroke: INK, 'stroke-width': sw, 'stroke-linejoin': 'round' }, g);
    const seg = (g, a, b, o = {}) => { const [x1, y1] = P(...a), [x2, y2] = P(...b); return svgEl('line', { x1, y1, x2, y2, stroke: o.color || INK, 'stroke-width': o.w || 1.5, class: 'bk-stroke', opacity: o.op ?? 0.75 }, g); };
    const C = d.cubes.map((q) => {
      const [x0, y0] = q.at, E = q.n, g = svgEl('g', {}, svg);
      poly(g, [[x0, y0, E], [x0 + E, y0, E], [x0 + E, y0 + E, E], [x0, y0 + E, E]], mix(col, 0.8));
      poly(g, [[x0 + E, y0, 0], [x0 + E, y0 + E, 0], [x0 + E, y0 + E, E], [x0 + E, y0, E]], mix(col, 0.55));
      poly(g, [[x0, y0 + E, 0], [x0 + E, y0 + E, 0], [x0 + E, y0 + E, E], [x0, y0 + E, E]], mix(col, 0.68));
      const grid = svgEl('g', { opacity: 0 }, g);
      for (let i = 1; i < E; i++) {
        seg(grid, [x0 + i, y0, E], [x0 + i, y0 + E, E]); seg(grid, [x0, y0 + i, E], [x0 + E, y0 + i, E]);
        seg(grid, [x0 + E, y0 + i, 0], [x0 + E, y0 + i, E]); seg(grid, [x0 + E, y0, i], [x0 + E, y0 + E, i]);
        seg(grid, [x0 + i, y0 + E, 0], [x0 + i, y0 + E, E]); seg(grid, [x0, y0 + E, i], [x0 + E, y0 + E, i]);
      }
      const top = P(x0 + E / 2, y0 + E / 2, E), vol = lab(stage, top[0], top[1], `volume <b>${q.V}</b>`, 'u2l3-sqarea', 'c');
      return { q, g, grid, vol };
    });
    // the small corner cube of the first cube, at the front bottom
    const q0 = d.cubes[0], qL = d.cubes[d.cubes.length - 1], [a0, b0] = qL.at, E0 = qL.n, hl = svgEl('g', { opacity: 0 }, svg);
    const xs = a0 + E0 - 1, ys = b0 + E0 - 1;
    poly(hl, [[xs, ys, 1], [xs + 1, ys, 1], [xs + 1, ys + 1, 1], [xs, ys + 1, 1]], mix(col, 0.25), 3);
    poly(hl, [[xs + 1, ys, 0], [xs + 1, ys + 1, 0], [xs + 1, ys + 1, 1], [xs + 1, ys, 1]], mix(col, 0.05), 3);
    poly(hl, [[xs, ys + 1, 0], [xs + 1, ys + 1, 0], [xs + 1, ys + 1, 1], [xs, ys + 1, 1]], mix(col, 0.15), 3);
    // the front bottom edge (y = front face) runs along x
    const yF = Math.max(...d.cubes.map((q) => q.at[1] + q.n)), nT = d.cubes.reduce((t, q) => t + q.n, 0), xF0 = Math.min(...d.cubes.map((q) => q.at[0]));
    const edgeL = []; for (let i = 0; i < nT; i++) { const p = P(xF0 + i + 0.5, yF, 0); const e = lab(stage, p[0] - 6, p[1] + 6, T(`\\sqrt[3]{${m}}`), 'u2l3-cellside', 'sw', 0); hide(e); edgeL.push(e); }
    const hlP = P(xs + 0.5, ys + 1, 0), hlL = lab(stage, hlP[0] - 6, hlP[1] + 6, T(`\\sqrt[3]{${m}}`), 'u2l3-cellside', 'sw', 0); hide(hlL);
    const eStart = P(xF0, yF, 0), eEnd = P(xF0 + nT, yF, 0);
    const edgeLine = svgEl('line', { x1: eStart[0], y1: eStart[1], x2: eEnd[0], y2: eEnd[1], stroke: BR, 'stroke-width': 6, 'stroke-linecap': 'round', class: 'bk-stroke', opacity: 0 }, svg);
    const edgeName = lab(stage, (eStart[0] + eEnd[0]) / 2 - 30, (eStart[1] + eEnd[1]) / 2 + 62, d.cubes.length > 1 ? 'edge' : 'edge ' + T(`\\sqrt[3]{${q0.V}}`), 'u2l3-brl', 'sw', 0);
    const pn = panel(stage, W - 350, 24, 330, H - 48, d.ex ? 'Example 3(a)' : 'Simplify');
    const steps = [];
    C.forEach((o) => {
      const q = o.q, kk = q.n * q.n * q.n;
      steps.push({ cap: `${T(`${q.V}=${kk}\\times${q.m}`)}: cut it into ${T(`${q.n}\\times${q.n}\\times${q.n}=${kk}`)} small cubes, each of volume ${q.m}.${d.cubes.length > 1 ? ` ${T(`\\sqrt[3]{${q.V}}=${q.n}\\sqrt[3]{${q.m}}`)}.` : ''}`,
        run: async (c) => { o.vol.style.opacity = 0; o.grid.setAttribute('opacity', 1); await drawIn(o.grid, 800, c); await show(c, line(pn, T(`\\sqrt[3]{${q.V}}=\\sqrt[3]{${kk}}\\sqrt[3]{${q.m}}=${q.n}\\sqrt[3]{${q.m}}`))); } });
    });
    steps.push({ cap: `Each small cube has volume ${m}, so its edge is ${T(`\\sqrt[3]{${m}}`)}.`, run: async (c) => { await appear(c, hl, 350); await pop(c, hlL); } });
    steps.push({ cap: d.ex ? `Line the cubes up: the front edge is ${T('3+2=5')} small edges. ${T('\\sqrt[3]{54}+\\sqrt[3]{16}=3\\sqrt[3]{2}+2\\sqrt[3]{2}=5\\sqrt[3]{2}')}.` : `Count the small edges along one edge: ${q0.n}. So ${T(`\\sqrt[3]{${q0.V}}=${q0.n}\\sqrt[3]{${m}}`)}.`,
      run: async (c) => {
        hlL.style.opacity = 0; edgeLine.style.opacity = 0.75; await drawIn(edgeLine, 600, c);
        for (const e of edgeL) await pop(c, e, 200);
        edgeName.innerHTML = 'edge ' + T(d.ex ? '5\\sqrt[3]{2}' : `\\sqrt[3]{${q0.V}}=${q0.n}\\sqrt[3]{${m}}`); await pulse(c, edgeName, 1.1);
        if (d.ex) await show(c, line(pn, T('3\\sqrt[3]{2}+2\\sqrt[3]{2}=\\boldsymbol{5\\sqrt[3]{2}}'), 'u2l3-big'));
        else await show(c, line(pn, T(`\\sqrt[3]{${q0.V}}=\\boldsymbol{${q0.n}\\sqrt[3]{${m}}}`), 'u2l3-big'));
      } });
    if (d.four) steps.push({ cap: `A fourth root works the same way with perfect fourth powers (a 4-D cube we can’t draw!): ${T('\\sqrt[4]{112}=\\sqrt[4]{16}\\sqrt[4]{7}=2\\sqrt[4]{7}')}.`,
      run: async (c) => { await show(c, line(pn, `<span class="muted">fourth root:</span><br>${T('\\sqrt[4]{112}=\\sqrt[4]{16}\\sqrt[4]{7}=2\\sqrt[4]{7}')}`, 'u2l3-key-line')); } });
    return steps;
  }
};

/* =============================== explainer: fractions in front =============================== */
const FR = {
  e4a: { label: 'Example 4(a) check', ask: `<b>Example 4(a):</b> ${T('\\tfrac{1}{2}\\sqrt{48}+\\tfrac{2}{3}\\sqrt{27}')}`, u: '\\sqrt{3}', c: C3, ans: '4\\sqrt{3}', grp: '2\\sqrt{3}+2\\sqrt{3}',
    terms: [{ p: 1, q: 2, A: '\\sqrt{48}', k: 4, sg: 1, s: '\\sqrt{48}=\\sqrt{16}\\sqrt{3}=4\\sqrt{3}' }, { p: 2, q: 3, A: '\\sqrt{27}', k: 3, sg: 1, s: '\\sqrt{27}=\\sqrt{9}\\sqrt{3}=3\\sqrt{3}' }] },
  e4b: { label: 'Example 4(b) check', ask: `<b>Example 4(b):</b> ${T('\\tfrac{3}{4}\\sqrt{32}-\\tfrac{1}{5}\\sqrt{50}')}`, u: '\\sqrt{2}', c: C2, ans: '2\\sqrt{2}', grp: '3\\sqrt{2}-\\sqrt{2}',
    terms: [{ p: 3, q: 4, A: '\\sqrt{32}', k: 4, sg: 1, s: '\\sqrt{32}=\\sqrt{16}\\sqrt{2}=4\\sqrt{2}' }, { p: 1, q: 5, A: '\\sqrt{50}', k: 5, sg: -1, s: '\\sqrt{50}=\\sqrt{25}\\sqrt{2}=5\\sqrt{2}' }] },
  e4c: { label: 'Example 4(c) check', ask: `<b>Example 4(c):</b> ${T('\\tfrac{2}{3}\\sqrt{18}+\\tfrac{1}{4}\\sqrt{8}')}`, u: '\\sqrt{2}', c: C2, ans: '\\tfrac{5}{2}\\sqrt{2}', grp: '2\\sqrt{2}+\\tfrac{1}{2}\\sqrt{2}',
    terms: [{ p: 2, q: 3, A: '\\sqrt{18}', k: 3, sg: 1, s: '\\sqrt{18}=\\sqrt{9}\\sqrt{2}=3\\sqrt{2}' }, { p: 1, q: 4, A: '\\sqrt{8}', k: 2, sg: 1, s: '\\sqrt{8}=\\sqrt{4}\\sqrt{2}=2\\sqrt{2}' }] }
};
const fracFront = {
  title: 'A fraction in front takes that fraction of the tiles',
  height: 440, minW: 900, capH: 84,
  choices: Object.keys(FR).map((k) => ({ v: k, label: FR[k].label })),
  ask: (k) => FR[k].ask,
  make(stage, key, ex) {
    const d = FR[key], W = ex.W, X0 = 250, tw = 74, th = 50, RY = [26, 140], RES = 262;
    const pn = panel(stage, W - 300, 16, 284, 356, 'Working');
    const rowTiles = d.terms.map((t, r) => { const out = []; for (let i = 0; i < t.k; i++) { const e = add(stage, tileEl(d.u, d.c, false, tw, th), X0 + i * tw, RY[r]); e.classList.add('u2l3-joined'); hide(e); out.push(e); } return out; });
    const svg = mkSvg(stage, W, ex.def.height); // above the tiles: dividers and the kept outline
    const rows = d.terms.map((t, r) => {
      const fT = `\\tfrac{${t.p}}{${t.q}}`, y = RY[r], tiles = rowTiles[r];
      const tl = lab(stage, 20, y + th / 2, T((t.sg < 0 ? '-' : r ? '+' : '') + fT + t.A), 'u2l3-flab', 'e', 0);
      const segW = t.k * tw / t.q, divs = svgEl('g', { opacity: 0 }, svg);
      for (let j = 1; j < t.q; j++) svgEl('line', { x1: X0 + j * segW, x2: X0 + j * segW, y1: y - 10, y2: y + th + 10, stroke: INK, 'stroke-width': 3, 'stroke-dasharray': '6 5', class: 'bk-stroke' }, divs);
      const keepW = t.p * segW, keep = svgEl('rect', { x: X0 - 4, y: y - 6, width: keepW + 8, height: th + 12, rx: 9, fill: 'none', stroke: BR, 'stroke-width': 3.5, opacity: 0 }, svg);
      const drop = add(stage, box(h('div', 'u2l3-dropmask'), t.k * tw - keepW, th + 4), X0 + keepW, y - 2); drop.style.opacity = 0;
      const kt = t.p * t.k / t.q, kl = lab(stage, X0 + keepW / 2, y + th + 10, `keep ${t.p} of ${t.q} part${t.q > 1 ? 's' : ''}`, 'u2l3-keep', 's', 0); hide(kl);
      return { t, fT, y, tl, tiles, divs, keep, drop, kt, kl };
    });
    const resL = lab(stage, 20, RES + th / 2, 'Total', 'u2l3-flab u2l3-tot', 'e', 0); hide(resL);
    const steps = [];
    rows.forEach((o) => {
      const t = o.t;
      steps.push({ cap: `${T(t.s)}: ${t.k} ${T(d.u)} tiles.`, run: async (c) => { for (const e of o.tiles) await pop(c, e, 220); await show(c, line(pn, T(t.s))); } });
      steps.push({ cap: `${T(o.fT)} of them: cut the row into ${t.q} equal parts and keep ${t.p}. ${T(`${o.fT}(${t.k}${d.u})=${cTex(o.kt, d.u)}`)}.`,
        run: async (c) => {
          o.divs.setAttribute('opacity', 1); await drawIn(o.divs, 500, c);
          await Promise.all([c.anim(o.drop, [{ opacity: 0 }, { opacity: 0.78 }], 450), c.anim(o.keep, [{ opacity: 0 }, { opacity: 1 }], 450), show(c, o.kl)]);
          await show(c, line(pn, T(`${t.sg < 0 ? '-' : ''}${o.fT}(${t.k}${d.u})=${t.sg < 0 ? '-' : ''}${cTex(o.kt, d.u)}`)));
        } });
    });
    // the total: kept amounts as tiles, the subtracted one in red
    const pieces = []; let x = X0;
    rows.forEach((o) => {
      let left = o.kt; const neg = o.t.sg < 0;
      while (left > 1e-9) { const f = Math.min(1, left); const e = add(stage, tileEl(d.u, d.c, neg, tw, th, f), x, RES); e.classList.add('u2l3-joined'); hide(e); pieces.push({ e, neg }); x += tw * f; left -= f; }
      x += neg ? 0 : 0;
    });
    const anyNeg = pieces.some((p) => p.neg);
    const ansL = lab(stage, X0, RES + th + 34, '', 'u2l3-fans', 'e', 0); hide(ansL);
    steps.push({ cap: anyNeg ? `Take away: ${T(d.grp)}. The <b class="u2l3-neg">negative</b> tile cancels one positive tile.` : `Add the kept tiles: ${T(d.grp + '=' + d.ans)}.${key === 'e4c' ? ' Two whole tiles and a half tile.' : ''}`,
      run: async (c) => {
        await show(c, resL);
        for (const p of pieces) await pop(c, p.e, 240);
        if (anyNeg) { const ng = pieces.filter((p) => p.neg), ps = pieces.filter((p) => !p.neg); await sleep(c, 250); await Promise.all(ng.map((p, i) => Promise.all([c.anim(p.e, [{ opacity: 1 }, { opacity: 0.16 }], 420), c.anim(ps[ps.length - 1 - i].e, [{ opacity: 1 }, { opacity: 0.16 }], 420)]))); }
        ansL.innerHTML = T(`=${d.ans}`); await show(c, ansL);
        await show(c, line(pn, T(`${d.grp}=\\boldsymbol{${d.ans}}`), 'u2l3-big'));
      } });
    return steps;
  }
};

/* =============================== explainer: lengths on a grid =============================== */
const GL = {
  e6: { label: 'Example 6 check', ex: true, win: { xmin: -4, xmax: 4, ymin: -5, ymax: 2 }, pts: { A: [-3, -2], B: [1, 0], C: [3, -4] }, pos: { A: 'w', B: 'n', C: 'e' },
    sides: [{ a: 'A', b: 'B', corner: [1, -2] }, { a: 'B', b: 'C', corner: [1, -4] }, { a: 'A', b: 'C', corner: [-3, -4] }], P: '2\\sqrt{5}+2\\sqrt{5}+2\\sqrt{10}=4\\sqrt{5}+2\\sqrt{10}', units: 'units' },
  sq: { label: 'A tilted square', ask: `A square has vertices ${T('P(0,0)')}, ${T('Q(3,1)')}, ${T('R(2,4)')} and ${T('S(-1,3)')}. Determine its perimeter.`, win: { xmin: -2, xmax: 4, ymin: -1, ymax: 5 },
    pts: { P: [0, 0], Q: [3, 1], R: [2, 4], S: [-1, 3] }, pos: { P: 'sw', Q: 'e', R: 'ne', S: 'w' },
    sides: [{ a: 'P', b: 'Q', corner: [3, 0] }, { a: 'Q', b: 'R', corner: [3, 4] }, { a: 'R', b: 'S', corner: [-1, 4] }, { a: 'S', b: 'P', corner: [-1, 0] }], same: true, inside: true, P: '4\\sqrt{10}', units: 'units' }
};
const gridLengths = {
  title: 'Slanted lengths: the right triangle underneath',
  height: 470, minW: 900,
  choices: Object.keys(GL).map((k) => ({ v: k, label: GL[k].label })),
  ask: (k) => (GL[k].ex ? `<b>Example 6:</b> triangle ${T('ABC')} with ${T('A(-3,-2)')}, ${T('B(1,0)')} and ${T('C(3,-4)')}. Find each side and the perimeter.` : GL[k].ask),
  make(stage, key, ex) {
    const d = GL[key], W = ex.W, w = d.win, gw = 460, gh = Math.round(gw * (w.ymax - w.ymin) / (w.xmax - w.xmin));
    const G = new Graph(stage, Object.assign({ x: 14, y: Math.max(6, (ex.def.height - gh) / 2), width: gw, height: Math.min(gh, ex.def.height - 12) }, w));
    const names = Object.keys(d.pts), poly = names.map((n) => d.pts[n]);
    G.polyline(poly, { closed: true, color: INK, width: 3.2 });
    names.forEach((n) => G.point(...d.pts[n], { label: T(n), pos: d.pos[n], color: INK }));
    const cen = [poly.reduce((s, p) => s + p[0], 0) / poly.length, poly.reduce((s, p) => s + p[1], 0) / poly.length];
    const pn = panel(stage, gw + 40, 20, W - gw - 60, ex.def.height - 40, d.ex ? 'Example 6' : 'Side lengths');
    const S = d.sides.map((s) => {
      const A = d.pts[s.a], Bp = d.pts[s.b], run = Math.abs(Bp[0] - A[0]), rise = Math.abs(Bp[1] - A[1]), sum = run * run + rise * rise, L = rootTex(sum);
      const runEnd = s.corner[1] === A[1] ? A : Bp, riseEnd = runEnd === A ? Bp : A;
      const r1 = G.segment(runEnd, s.corner, { color: DC, width: 3, dash: true }), r2 = G.segment(s.corner, riseEnd, { color: C5, width: 3, dash: true });
      const rl = G.label((runEnd[0] + s.corner[0]) / 2, s.corner[1], T(String(run)), { cls: 'bk-ptlab', color: DC, pos: s.corner[1] < cen[1] ? 's' : 'n' });
      const ql = G.label(s.corner[0], (riseEnd[1] + s.corner[1]) / 2, T(String(rise)), { cls: 'bk-ptlab', color: C5, pos: s.corner[0] < cen[0] ? 'w' : 'e' });
      const mx = (A[0] + Bp[0]) / 2, my = (A[1] + Bp[1]) / 2; let nx = -(Bp[1] - A[1]), ny = Bp[0] - A[0]; const nl = Math.hypot(nx, ny); nx /= nl; ny /= nl;
      if ((mx - cen[0]) * nx + (my - cen[1]) * ny < 0) { nx = -nx; ny = -ny; }
      const io = d.inside ? -0.75 : 0.6, sl = G.label(mx + nx * io, my + ny * io, T(L), { cls: 'bk-pill', color: BR });
      [r1, r2, rl, ql, sl].forEach(hide);
      return { s, run, rise, sum, L, r1, r2, rl, ql, sl, nm: s.a + s.b };
    });
    const stepSide = (o) => ({
      cap: `${T(o.nm)}: run ${o.run}, rise ${o.rise}. ${T(`\\sqrt{${o.run}^2+${o.rise}^2}=\\sqrt{${o.sum}}${o.L === `\\sqrt{${o.sum}}` ? '' : '=' + o.L}`)}.`,
      run: async (c) => {
        o.r1.style.opacity = 1; await drawIn(o.r1, 450, c); await show(c, o.rl); o.r2.style.opacity = 1; await drawIn(o.r2, 450, c); await show(c, o.ql);
        await pop(c, o.sl); await show(c, line(pn, T(`${o.nm}=\\sqrt{${o.run * o.run}+${o.rise * o.rise}}=\\sqrt{${o.sum}}${o.L === `\\sqrt{${o.sum}}` ? '' : '=' + o.L}`)));
      }
    });
    const steps = [];
    if (d.same) {
      steps.push(stepSide(S[0]));
      steps.push({ cap: `The other three sides also have run and rise 3 and 1: each is ${T('\\sqrt{10}')}.`,
        run: async (c) => { for (const o of S.slice(1)) { o.r1.style.opacity = o.r2.style.opacity = 1; o.rl.style.opacity = o.ql.style.opacity = 1; await pop(c, o.sl, 260); } await show(c, line(pn, T('QR=RS=SP=\\sqrt{10}'))); } });
    } else S.forEach((o) => steps.push(stepSide(o)));
    steps.push({ cap: `Perimeter: add the sides and collect like radicals. ${T('P=' + d.P)} ${d.units}.`,
      run: async (c) => { const [p1, p2] = d.P.split('='); await show(c, line(pn, T('P=' + p1), p2 ? '' : 'u2l3-big')); if (p2) await show(c, line(pn, T('\\phantom{P}=\\boldsymbol{' + p2 + '}'), 'u2l3-big')); } });
    return steps;
  }
};

/* =============================== triangle figure (to scale from the side lengths) =============================== */
/** draw a triangle with base b (horizontal), left side l and right side r into a w × h box at (x, y) of `host`;
 *  returns the label elements { base, left, right } */
function triangleFig(host, x, y, w, hh, len, labs, o = {}) {
  const px = (len.b * len.b + len.l * len.l - len.r * len.r) / (2 * len.b), py = Math.sqrt(Math.max(0, len.l * len.l - px * px));
  const minX = Math.min(0, px), maxX = Math.max(len.b, px), sc = Math.min((w - 120) / (maxX - minX), (hh - 70) / py);
  const ox = x + 60 + ((w - 120) - (maxX - minX) * sc) / 2 - minX * sc, oy = y + 22 + py * sc + ((hh - 70) - py * sc) / 2;
  const P0 = [ox, oy], P1 = [ox + len.b * sc, oy], P2 = [ox + px * sc, oy - py * sc];
  const svg = svgEl('svg', { width: x + w, height: y + hh, class: 'u2l3-svg' }, host); svg.style.position = 'absolute'; svg.style.left = '0px'; svg.style.top = '0px';
  svgEl('polygon', { points: [P0, P1, P2].map((p) => p.join(',')).join(' '), fill: o.fill || '#fff', stroke: INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, svg);
  const mk = (A, Bp, html, pos) => { const d = h('div', 'u2l3-trilab ' + (o.cls || ''), html); d.style.position = 'absolute'; host.appendChild(d); place(d, (A[0] + Bp[0]) / 2, (A[1] + Bp[1]) / 2, pos, 8); return d; };
  return { base: mk(P0, P1, labs.base, 's'), left: mk(P0, P2, labs.left, 'w'), right: mk(P1, P2, labs.right, 'e'), svg };
}

/* =============================== explainer: the missing side =============================== */
const MS = {
  e7: { label: 'Example 7 check', ex: true, ask: `<b>Example 7:</b> the perimeter is ${T('7\\sqrt{5}+3\\sqrt{2}')} cm. Determine side ${T('x')}.`, unit: 'cm',
    P: [{ k: 's5', n: 7 }, { k: 's2', n: 3 }], Pt: '7\\sqrt{5}+3\\sqrt{2}',
    len: { b: Math.sqrt(8) + Math.sqrt(20), l: Math.sqrt(45), r: 2 * Math.sqrt(5) + Math.SQRT2 },
    labs: { base: '\\sqrt{8}+\\sqrt{20}', left: '\\sqrt{45}', right: 'x' }, xs: 'right',
    known: [{ side: 'left', t: '\\sqrt{45}', s: '3\\sqrt{5}', parts: [{ k: 's5', n: 3 }] }, { side: 'base', t: '\\sqrt{8}+\\sqrt{20}', s: '2\\sqrt{2}+2\\sqrt{5}', parts: [{ k: 's2', n: 2 }, { k: 's5', n: 2 }], two: true }],
    lines: ['x=7\\sqrt{5}+3\\sqrt{2}-3\\sqrt{5}-(2\\sqrt{2}+2\\sqrt{5})', '\\phantom{x}=7\\sqrt{5}-3\\sqrt{5}-2\\sqrt{5}+3\\sqrt{2}-2\\sqrt{2}'], x: '2\\sqrt{5}+\\sqrt{2}' },
  iso: { label: 'An isosceles triangle', ask: `An isosceles triangle has perimeter ${T('10\\sqrt{3}')} m. Its two equal sides are ${T('\\sqrt{27}')} m each. Determine the base ${T('x')}.`, unit: 'm',
    P: [{ k: 's3', n: 10 }], Pt: '10\\sqrt{3}', len: { b: 4 * Math.sqrt(3), l: Math.sqrt(27), r: Math.sqrt(27) },
    labs: { base: 'x', left: '\\sqrt{27}', right: '\\sqrt{27}' }, xs: 'base',
    known: [{ side: 'left', t: '\\sqrt{27}', s: '3\\sqrt{3}', parts: [{ k: 's3', n: 3 }] }, { side: 'right', t: '\\sqrt{27}', s: '3\\sqrt{3}', parts: [{ k: 's3', n: 3 }] }],
    lines: ['x=10\\sqrt{3}-3\\sqrt{3}-3\\sqrt{3}'], x: '4\\sqrt{3}' }
};
const missingSide = {
  title: 'Perimeter minus the known sides',
  height: 460, minW: 900, capH: 84,
  choices: Object.keys(MS).map((k) => ({ v: k, label: MS[k].label })),
  ask: (k) => MS[k].ask,
  make(stage, key, ex) {
    const d = MS[key], W = ex.W, H = ex.def.height, BIN = { s2: B.s2, s3: B.s3, s5: B.s5 };
    const tri = triangleFig(stage, 0, 0, 360, 290, d.len, { base: T(d.labs.base), left: T(d.labs.left), right: T(d.labs.right) });
    const pn = panel(stage, 450, 14, W - 470, 270, 'Working');
    const tw = 60, th = 42, SY = H - 124, tiles = [];
    let x = 70;
    lab(stage, 20, SY - 8, 'Perimeter tiles', 'u2l3-striph', 'ne', 0); lab(stage, 22, SY + th / 2, T('P'), 'u2l3-rowlab', 'e', 0);
    const xRow = lab(stage, 22, SY + 56 + th / 2, T('x'), 'u2l3-rowlab u2l3-c-x', 'e', 0); hide(xRow);
    d.P.forEach((g) => { for (let i = 0; i < g.n; i++) { const e = add(stage, tileEl(BIN[g.k].t, BIN[g.k].c, false, tw, th), x, SY); hide(e); tiles.push({ e, k: g.k, x, gone: false }); x += tw + 6; } x += 14; });
    const take = (parts) => { const out = []; parts.forEach((p) => { let n = p.n; for (const t of tiles) { if (!n) break; if (!t.gone && t.k === p.k) { t.gone = true; out.push(t.e); n--; } } }); return out; };
    const steps = [];
    steps.push({ cap: `The perimeter is all three sides together: ${T(d.Pt)}. Lay it out as tiles.`,
      run: async (c) => { for (const t of tiles) await pop(c, t.e, 160); await show(c, line(pn, T(`P=${d.Pt}`))); } });
    const kn = d.known, uniq = key === 'iso' ? [kn[0]] : kn;
    steps.push({ cap: `Simplify the known sides: ${listAnd(uniq.map((s) => T(`${s.t}=${s.s}`)))}.`,
      run: async (c) => { for (const s of kn) { tri[s.side].innerHTML = T(`${s.t}=${s.s}`); await pulse(c, tri[s.side], 1.08); } } });
    kn.forEach((s, i) => {
      const nm = s.parts.map((p) => `${p.n === 2 ? 'two' : p.n === 3 ? 'three' : p.n} ${T(BIN[p.k].t)} tiles`);
      steps.push({ cap: s.two ? `Take away the base <b>in brackets</b>: ${T(`-(${s.s})`)} removes ${listAnd(nm).replace(' and ', ' <b>and</b> ')}.` : `Take away ${key === 'iso' ? (i ? 'the other' : 'one') + ' side, ' + T(s.s) : T(s.t + '=' + s.s)}: ${nm[0]}.`,
        run: async (c) => {
          const gone = take(s.parts);
          await Promise.all(gone.map((e, j) => c.anim(e, [{ opacity: 1, transform: 'none' }, { opacity: 0.14, transform: 'translateY(-24px)' }], 450, { delay: j * 60 })));
          if (d.lines[i]) await show(c, line(pn, T(d.lines[i])));
        } });
    });
    steps.push({ cap: `What is left is ${T('x')}: ${T(`x=${d.x}`)} ${d.unit}.`,
      run: async (c) => {
        const left = tiles.filter((t) => !t.gone); let nx = 70;
        await show(c, xRow);
        await Promise.all(left.map((t, j) => { const dx = nx - t.x; nx += tw + 6 + (left[j + 1] && left[j + 1].k !== t.k ? 14 : 0); return c.anim(t.e, [{ left: t.x + 'px', top: SY + 'px' }, { left: (t.x + dx) + 'px', top: (SY + 56) + 'px' }], 600, { delay: j * 60 }); }));
        await Promise.all(left.map((t) => pulse(c, t.e, 1.1)));
        tri[d.xs].innerHTML = T(`x=${d.x}`); tri[d.xs].classList.add('u2l3-xon'); await pop(c, tri[d.xs]);
        await show(c, line(pn, T(`${d.lines.length > 1 ? '\\phantom{x}' : 'x'}=\\boldsymbol{${d.x}}\\text{ ${d.unit}}`), 'u2l3-big'));
      } });
    if (d.ex) steps.push({ cap: `Why the brackets? Without them, ${T('-2\\sqrt{2}+2\\sqrt{5}')} would <b>add</b> the ${T('2\\sqrt{5}')} instead of taking it away.`,
      run: async (c) => {
        const l = line(pn, T('7\\sqrt{5}+3\\sqrt{2}-3\\sqrt{5}-2\\sqrt{2}+2\\sqrt{5}=6\\sqrt{5}+\\sqrt{2}'), 'u2l3-bad'); await show(c, l);
        const st = stamp(l, '✗', { ok: false, size: 'sm' }); await stampIn(c, st);
      } });
    return steps;
  }
};

/* =============================== explainer: balance =============================== */
const BY = {
  e8a: { label: 'Example 8(a) check', ex: true, ask: `<b>Example 8(a):</b> ${T('y+\\sqrt{27}=2\\sqrt{75}')}. Determine ${T('y')}, then ${T('y-\\sqrt{12}')}.`, L: 'y+\\sqrt{27}', R: '2\\sqrt{75}', u: '\\sqrt{3}', c: C3, lk: 3, rk: 10,
    sL: '\\sqrt{27}=3\\sqrt{3}', sR: '2\\sqrt{75}=2(5\\sqrt{3})=10\\sqrt{3}', Ls: 'y+3\\sqrt{3}', Rs: '10\\sqrt{3}', y: '7\\sqrt{3}', yl: 'y=2\\sqrt{75}-\\sqrt{27}=10\\sqrt{3}-3\\sqrt{3}=7\\sqrt{3}',
    part2: { k: 2, s: '\\sqrt{12}=2\\sqrt{3}', line: 'y-\\sqrt{12}=7\\sqrt{3}-2\\sqrt{3}=5\\sqrt{3}' } },
  d50: { label: T('y+\\sqrt{8}=\\sqrt{50}'), ask: `Solve ${T('y+\\sqrt{8}=\\sqrt{50}')} for ${T('y')}.`, L: 'y+\\sqrt{8}', R: '\\sqrt{50}', u: '\\sqrt{2}', c: C2, lk: 2, rk: 5,
    sL: '\\sqrt{8}=2\\sqrt{2}', sR: '\\sqrt{50}=5\\sqrt{2}', Ls: 'y+2\\sqrt{2}', Rs: '5\\sqrt{2}', y: '3\\sqrt{2}', yl: 'y=\\sqrt{50}-\\sqrt{8}=5\\sqrt{2}-2\\sqrt{2}=3\\sqrt{2}' }
};
const balanceY = {
  title: 'Keep the balance: same tiles off both sides',
  height: 460, minW: 900, capH: 84,
  choices: Object.keys(BY).map((k) => ({ v: k, label: BY[k].label })),
  ask: (k) => BY[k].ask,
  make(stage, key, ex) {
    const d = BY[key], W = ex.W, H = ex.def.height, svg = mkSvg(stage, W, H), beamY = 262, cxm = W / 2, tw = 50, th = 40;
    svgEl('polygon', { points: `${cxm},${beamY + 8} ${cxm - 34},${beamY + 70} ${cxm + 34},${beamY + 70}`, fill: '#8a6440' }, svg);
    svgEl('rect', { x: 50, y: beamY, width: W - 100, height: 10, rx: 5, fill: '#5b4632' }, svg);
    const panL = [70, cxm - 30], panR = [cxm + 30, W - 70];
    [panL, panR].forEach(([a, b]) => svgEl('path', { d: `M${a} ${beamY - 2} h${b - a} l-14 -12 h${-(b - a) + 28} z`, fill: '#d9cbb6', stroke: '#8a6440', 'stroke-width': 2 }, svg));
    const eq = lab(stage, cxm, 40, T('='), 'u2l3-beq', 'c');
    const Lh = lab(stage, (panL[0] + panL[1]) / 2, 40, T(d.L), 'u2l3-bside', 'c'), Rh = lab(stage, (panR[0] + panR[1]) / 2, 40, T(d.R), 'u2l3-bside', 'c');
    const Ls = lab(stage, (panL[0] + panL[1]) / 2, 84, T('=' + d.Ls), 'u2l3-bside2', 'c'), Rs = lab(stage, (panR[0] + panR[1]) / 2, 84, T('=' + d.Rs), 'u2l3-bside2', 'c'); hide(Ls); hide(Rs);
    const per = 7, slot = (p, i, off = 0) => { const j = i + off, r = Math.floor(j / per), cI = j % per, w0 = per * (tw + 6) - 6, x0 = (p[0] + p[1]) / 2 - w0 / 2; return [x0 + cI * (tw + 6), beamY - 16 - th - r * (th + 6)]; };
    const yb = add(stage, box(h('div', 'u2l3-ybox', T('y')), tw * 1.6, th), ...slot(panL, 0)); hide(yb);
    const LT2 = [], RT2 = [];
    for (let i = 0; i < d.lk; i++) { const e = add(stage, tileEl(d.u, d.c, false, tw, th), ...slot(panL, i, 2)); hide(e); LT2.push(e); }
    for (let i = 0; i < d.rk; i++) { const e = add(stage, tileEl(d.u, d.c, false, tw, th), ...slot(panR, i)); hide(e); RT2.push(e); }
    const res = add(stage, box(h('div', 'u2l3-res u2l3-res-s'), W - 40, 44), 20, H - 104); hide(res);
    const res2 = add(stage, box(h('div', 'u2l3-res u2l3-res-s'), W - 40, 44), 20, H - 56); hide(res2);
    const steps = [
      { cap: `Simplify both sides first: ${T(d.sL)} and ${T(d.sR)}.`,
        run: async (c) => { await Promise.all([show(c, Ls), show(c, Rs)]); await pop(c, yb); for (const e of LT2) await pop(c, e, 160); for (const e of RT2) await pop(c, e, 130); } },
      { cap: `Take ${T(`${d.lk}${d.u}`)} away from <b>both</b> sides. The scale stays balanced.`,
        run: async (c) => { await Promise.all([...LT2, ...RT2.slice(d.rk - d.lk)].map((e, j) => c.anim(e, [{ opacity: 1, transform: 'none' }, { opacity: 0.12, transform: 'translateY(-26px)' }], 480, { delay: (j % d.lk) * 80 }))); } },
      { cap: `${T(d.yl)}.`,
        run: async (c) => { yb.innerHTML = T('y=' + d.y); yb.classList.add('u2l3-yon'); box(yb, tw * 2.6, th); await pop(c, yb); await Promise.all(RT2.slice(0, d.rk - d.lk).map((e) => pulse(c, e, 1.1))); res.innerHTML = T(d.yl.replace(/=([^=]*)$/, '=\\boxed{$1}')); await show(c, res); } }
    ];
    if (d.part2) steps.push({ cap: `Then ${T('y-\\sqrt{12}')}: ${T(d.part2.s)}, so take two more tiles away. ${T(d.part2.line)}.`,
      run: async (c) => { await Promise.all(RT2.slice(d.rk - d.lk - d.part2.k, d.rk - d.lk).map((e) => c.anim(e, [{ opacity: 1 }, { opacity: 0.12 }], 450))); res2.innerHTML = T(d.part2.line.replace(/=5/, '=\\boxed{5') + '}'); await show(c, res2); } });
    return steps;
  }
};

/* =============================== explainer: arithmetic sequence of radical terms =============================== */
const RS = {
  e8b: { label: 'Example 8(b) check', ex: true, a: [3, 1], d: [2, 3], u: '\\sqrt{2}', c: C2, ask: `<b>Example 8(b):</b> ${T('3+\\sqrt{2},\\ 5+4\\sqrt{2},\\ 7+7\\sqrt{2},\\ \\dots')} Determine ${T('d')}, the next two terms and ${T('t_{10}')}.` },
  d5: { label: T('1+\\sqrt{5},\\ 4+3\\sqrt{5},\\ \\dots'), a: [1, 1], d: [3, 2], u: '\\sqrt{5}', c: C5, ask: `The arithmetic sequence ${T('1+\\sqrt{5},\\ 4+3\\sqrt{5},\\ 7+5\\sqrt{5},\\ \\dots')} Determine ${T('d')}, the next two terms and ${T('t_{10}')}.` }
};
const radSeq = {
  title: 'Rational parts hop together, radical parts hop together',
  height: 470, minW: 900, capH: 84,
  choices: Object.keys(RS).map((k) => ({ v: k, label: RS[k].label })),
  ask: (k) => RS[k].ask,
  make(stage, key, ex) {
    const d = RS[key], W = ex.W, u = d.u, r = (k) => d.a[0] + (k - 1) * d.d[0], s = (k) => d.a[1] + (k - 1) * d.d[1];
    const term = (k, col = true) => (col ? `${tc(NUMC, r(k))}+${tc(d.c, cTex(s(k), u))}` : `${r(k)}+${cTex(s(k), u)}`);
    const dT = `${d.d[0]}+${cTex(d.d[1], u)}`;
    const svg = mkSvg(stage, W, ex.def.height), cw = 170, gap = (W - 40 - 5 * cw) / 4, CY = 142, CH = 58, cx = (i) => 20 + i * (cw + gap) + cw / 2;
    const cards = [1, 2, 3, 4, 5].map((k, i) => { const e = add(stage, box(h('div', 'u2l3-scard', T(term(k))), cw, CH), 20 + i * (cw + gap), CY); if (k > 3) hide(e); return e; });
    const tl = [1, 2, 3, 4, 5].map((k, i) => { const e = lab(stage, cx(i), CY - 8, T(`t_${k}`), 'u2l3-tl', 'n', 0); if (k > 3) hide(e); return e; });
    const arc = (i, below, txt, color) => {
      const x1 = cx(i) + 34, x2 = cx(i + 1) - 34, y = below ? CY + CH + 6 : CY - 34, hh = below ? 34 : -30;
      const p = svgEl('path', { d: `M${x1} ${y} Q${(x1 + x2) / 2} ${y + 2 * hh} ${x2} ${y}`, fill: 'none', stroke: color, 'stroke-width': 3, class: 'bk-stroke', 'marker-end': '' }, svg);
      const ah = svgEl('polygon', { points: below ? `${x2},${y} ${x2 - 11},${y + 9} ${x2 - 2},${y + 13}` : `${x2},${y} ${x2 - 11},${y - 9} ${x2 - 2},${y - 13}`, fill: color }, svg);
      const g = svgEl('g', {}, svg); g.appendChild(p); g.appendChild(ah); hide(g);
      const l = lab(stage, (x1 + x2) / 2, y + hh + (below ? 4 : -4), T(txt), 'u2l3-hlab', below ? 's' : 'n', 0); l.style.color = color; hide(l);
      return { g, p, l };
    };
    const hops = [0, 1, 2, 3].map((i) => ({ top: arc(i, false, '+' + d.d[0], NUMC), bot: arc(i, true, '+' + cTex(d.d[1], u), d.c) }));
    const pnL = panel(stage, 20, 300, (W - 56) / 2, 156, 'Common difference'), pnR = panel(stage, 36 + (W - 56) / 2, 300, (W - 56) / 2, 156, T('t_{10}'));
    const showHop = async (c, i) => { const o = hops[i]; o.top.g.style.opacity = 1; o.bot.g.style.opacity = 1; await Promise.all([drawIn(o.top.p, 450, c), drawIn(o.bot.p, 450, c)]); await Promise.all([pop(c, o.top.l), pop(c, o.bot.l)]); };
    const t10 = `${r(1)}+${cTex(s(1), u)}+9(${dT})`, t10b = `${r(1)}+${cTex(s(1), u)}+${9 * d.d[0]}+${cTex(9 * d.d[1], u)}`;
    const steps = [
      { cap: `Subtract the first term from the second: ${T(`d=(${term(2, false)})-(${term(1, false)})`)}.`,
        run: async (c) => { await Promise.all([pulse(c, cards[0], 1.06), pulse(c, cards[1], 1.06)]); await show(c, line(pnL, T(`d=(${term(2, false)})-(${term(1, false)})`))); } },
      { cap: `Rational parts: ${T(`${r(2)}-${r(1)}=${d.d[0]}`)}. Radical parts: ${T(`${cTex(s(2), u)}-${cTex(s(1), u)}=${cTex(d.d[1], u)}`)}. So ${T(`d=${dT}`)}.`,
        run: async (c) => { await showHop(c, 0); await show(c, line(pnL, T(`d=${tc(DC, dT)}`), 'u2l3-big')); } },
      { cap: `Check the next gap: ${T(`${r(3)}-${r(2)}=${d.d[0]}`)} and ${T(`${cTex(s(3), u)}-${cTex(s(2), u)}=${cTex(d.d[1], u)}`)}. Same ${T('d')} ✓`,
        run: async (c) => { await showHop(c, 1); } },
      { cap: `Keep adding ${T('d')}: ${T(`t_4=${term(4, false)}`)} and ${T(`t_5=${term(5, false)}`)}.`,
        run: async (c) => { for (const i of [2, 3]) { await showHop(c, i); await Promise.all([pop(c, cards[i + 1]), show(c, tl[i + 1])]); } await show(c, line(pnL, T(`t_4=${term(4, false)},\\ \\ t_5=${term(5, false)}`))); } },
      { cap: `${T('t_{10}=t_1+9d')}: nine hops of ${T('d')} from ${T('t_1')}. ${T(`t_{10}=${t10}`)}.`,
        run: async (c) => { await show(c, line(pnR, T(`t_{10}=t_1+9d=${t10}`))); } },
      { cap: `Rational parts: ${T(`${r(1)}+${9 * d.d[0]}=${r(10)}`)}. Radical parts: ${T(`${cTex(s(1), u)}+${cTex(9 * d.d[1], u)}=${cTex(s(10), u)}`)}. So ${T(`t_{10}=${term(10, false)}`)}.`,
        run: async (c) => { await show(c, line(pnR, T(`\\phantom{t_{10}}=${t10b}`))); await show(c, line(pnR, T(`\\phantom{t_{10}}=\\boldsymbol{${term(10, false)}}`), 'u2l3-big')); } }
    ];
    return steps;
  }
};

/* =============================== static figures on the example cards =============================== */
function exFigures() {
  const mk6 = (id, ans) => {
    const host = document.getElementById(id); if (!host) return;
    const G = new Graph(host, { width: ans ? 300 : 340, height: ans ? 268 : 302, xmin: -4, xmax: 4, ymin: -5, ymax: 2 });
    if (ans) {
      [[[-3, -2], [1, -2], [1, 0]], [[1, 0], [1, -4], [3, -4]], [[-3, -2], [-3, -4], [3, -4]]].forEach((p, i) => G.polyline(p, { color: [DC, C5, CG][i], width: 2.6, dash: true }));
    }
    G.polyline([[-3, -2], [1, 0], [3, -4]], { closed: true, color: INK, width: 3 });
    [['A', -3, -2, 'w'], ['B', 1, 0, 'n'], ['C', 3, -4, 'e']].forEach(([n, x, y, p]) => G.point(x, y, { label: T(n), pos: p, color: INK }));
  };
  mk6('u2l3-ex6fig', false); mk6('u2l3-ex6ans', true);
  const h7 = document.getElementById('u2l3-ex7fig');
  if (h7) triangleFig(h7, 0, 0, 380, 300, { b: Math.sqrt(8) + Math.sqrt(20), l: Math.sqrt(45), r: 2 * Math.sqrt(5) + Math.SQRT2 }, { base: T('\\sqrt{8}+\\sqrt{20}'), left: T('\\sqrt{45}'), right: T('x') }, { cls: 'u2l3-trilab-c' });
}

/* =============================== Stand Up Break! (whiteboard stations; ../standup.js) =============================== */
const rt = (k, m) => `\\sqrt{${k * k * m}}`;
const co = (n) => (n === 1 ? '' : String(n));
const sgn = (n, first) => (n < 0 ? '-' : first ? '' : '+');
standup('u2l3', {
  intro: 'At your whiteboard: simplify every radical first, then collect the like ones.',
  levels: {
    BEG: (r) => {
      const m = r.pick([2, 3, 5, 6, 7, 10, 11, 13]), a = r.int(2, 9), b = r.int(1, 9) * r.sign(), c = r.int(1, 8) * -1;
      const tot = a + b + c === 0 ? null : a + b + c; if (tot == null) return { text: 'Simplify.', q: `${a}\\sqrt{${m}}+${b}\\sqrt{${m}}`, a: [`(${a}+${b})\\sqrt{${m}}=${cTex(a + b, `\\sqrt{${m}}`)}`] };
      return { text: 'Simplify.', q: `${a}\\sqrt{${m}}${sgn(b)}${co(Math.abs(b))}\\sqrt{${m}}${sgn(c)}${co(Math.abs(c))}\\sqrt{${m}}`, a: [`(${a}${b < 0 ? '' : '+'}${b}${c})\\sqrt{${m}}`, `=${cTex(tot, `\\sqrt{${m}}`)}`] };
    },
    PRG: (r) => {
      const m = r.pick([2, 3, 5, 6]), ks = r.shuffle([1, 2, 3, 4, 5, 6]).slice(0, 3), sg = [1, r.sign(), r.sign()];
      let tot = ks.reduce((s, k, i) => s + sg[i] * k, 0); if (tot === 0) { sg[2] = -sg[2]; tot = ks.reduce((s, k, i) => s + sg[i] * k, 0); }
      return { text: 'Simplify.', q: ks.map((k, i) => sgn(sg[i], !i) + rt(k, m)).join(''),
        a: [ks.map((k, i) => sgn(sg[i], !i) + cTex(k, `\\sqrt{${m}}`)).join(''), `=${cTex(tot, `\\sqrt{${m}}`)}`] };
    },
    MAS: (r) => {
      if (r.chance(0.35)) {
        const m = r.pick([2, 3, 5]), k1 = r.pick([2, 3, 4]), k2 = r.pick([2, 3, 5].filter((x) => x !== k1)), c1 = r.int(1, 3), s2 = r.sign();
        const tot = c1 * k1 + s2 * k2; if (!tot) return { text: 'Simplify.', q: `\\sqrt[3]{${k1 ** 3 * m}}+\\sqrt[3]{${k2 ** 3 * m}}`, a: [`${k1}\\sqrt[3]{${m}}+${k2}\\sqrt[3]{${m}}=${k1 + k2}\\sqrt[3]{${m}}`] };
        return { text: 'Simplify.', q: `${co(c1)}\\sqrt[3]{${k1 ** 3 * m}}${s2 < 0 ? '-' : '+'}\\sqrt[3]{${k2 ** 3 * m}}`, a: [`${c1 > 1 ? `${c1}(${k1}\\sqrt[3]{${m}})` : `${k1}\\sqrt[3]{${m}}`}${s2 < 0 ? '-' : '+'}${k2}\\sqrt[3]{${m}}`, `=${cTex(tot, `\\sqrt[3]{${m}}`)}`] };
      }
      const [m1, m2] = r.shuffle([2, 3, 5]).slice(0, 2), a = r.pick([2, 3, 4, 5]), b = r.pick([2, 3, 4]), c = r.pick([1, 2, 3, 5].filter((x) => x !== a)), e = r.pick([1, 2, 3]);
      const T1 = a - c, T2 = b * e;
      const ansT = [T1 ? cTex(T1, `\\sqrt{${m1}}`) : '', cTex(T2, `\\sqrt{${m2}}`)].filter(Boolean).join('+').replace('+-', '-');
      return { text: 'Simplify.', q: `${rt(a, m1)}+${co(e)}${rt(b, m2)}-${rt(c, m1)}`,
        a: [`${cTex(a, `\\sqrt{${m1}}`)}+${e > 1 ? `${e}(${cTex(b, `\\sqrt{${m2}}`)})` : cTex(b, `\\sqrt{${m2}}`)}-${cTex(c, `\\sqrt{${m1}}`)}`, `=${ansT}`] };
    }
  }
});

mountYard();
exFigures();
export const explainers = mountExplainers({ likeTiles, legsVsHyp, squareCut, sortBins, cubeCut, indexBins, fracFront, varBins, gridLengths, missingSide, balanceY, radSeq });
