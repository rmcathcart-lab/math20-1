/* Math 20-1 · Unit 1 · Lesson 6 — Geometric Growth and Decay.
 * Warm-up (The Lily Pond: a patch that doubles daily; step back from the full pond on day 30), and the explainers:
 *   factor (a 100% bar gains, loses, keeps or doubles → the growth factor r; Example 1 check: six mini bars),
 *   buildSeq (terms march out ×r, divide neighbours to check the ratio, count years on a ruler; Example 2 check),
 *   startShift (STAR: a growth table builds row by row beside its dots; a toggle "t1 = time 0" / "t1 = after 1 period"
 *     slides every term name a row and shifts the exponent; both give P r^n; Example 3, 2 and 5 checks),
 *   periods (a timeline cut into doubling / half-life periods: n = total ÷ period, then P r^n; Example 4 checks),
 *   compound (balance bars: interest added each year, interest on interest in gold; monthly periods as a calendar;
 *     Example 5 check), rateRoot (guess the rate on a number line, then the nth root; Example 6 check),
 *   hunt (a table of values with bars against a target line: first n past it, check the one before; Examples 7, 8(c)),
 *   twoRates (a big first-year drop, then a smaller rate; start the sequence after year 1; Example 8 check).
 * Colours: growth factor r amber, first term t1 teal (the course's rose), starting amount P / dots blue,
 * gains green, losses red. */
import {
  h, tex, add, box, Graph, NumberLine, stamp, stampIn, mountExplainers, pop, fadeIn, appear, sleep, tween,
  svgEl, liveCtx, pulse, place, drawIn, anim, arrowHead, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const RC = COLORS.amber, TC = COLORS.teal, PC = COLORS.blue, UP = COLORS.green, DN = COLORS.red, INK = COLORS.ink, GRAY = COLORS.gray, GOLD = '#d9a400';
const cR = (s) => `\\textcolor{${RC}}{${s}}`, cT = (s) => `\\textcolor{${TC}}{${s}}`, cP = (s) => `\\textcolor{${PC}}{${s}}`;
const cU = (s) => `\\textcolor{${UP}}{${s}}`, cD = (s) => `\\textcolor{${DN}}{${s}}`;
/* numbers: rounded to d places (trailing zeros dropped unless keep), thousands grouped (≥ 1000) */
const fx = (v, d = 2, keep = false) => { const k = Math.pow(10, d); let s = (Math.round((v + Math.sign(v) * 1e-9) * k) / k).toFixed(d); if (!keep && s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, ''); return s; };
const grp = (s, sep) => { const neg = s[0] === '-', b = neg ? s.slice(1) : s, [i, f] = b.split('.'); const ii = i.length >= 4 ? i.replace(/\B(?=(\d{3})+(?!\d))/g, sep) : i; return (neg ? '-' : '') + ii + (f != null ? '.' + f : ''); };
const nt = (v, d = 2, keep = false) => grp(fx(v, d, keep), '\\,');      // TeX
const nh = (v, d = 2, keep = false) => grp(fx(v, d, keep), ' ');   // HTML text
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
const panel = (stage, x, y, w, hh, title, cls = '') => div(stage, 'u1l6-panel ' + cls, title ? `<div class="u1l6-ph">${title}</div>` : '', x, y, w, hh);
const lineIn = (p, html, cls = '') => { const d = h('div', 'u1l6-line ' + cls, html); p.appendChild(d); hide(d); return d; };

/* ====================================================================================================
 * Warm-up: The Lily Pond. 64 patches fill the pond on day 30; day d shows 2^(d − 24) of them.
 * ==================================================================================================== */
function mountPond() {
  const host = document.getElementById('u1l6-pond'); if (!host) return;
  const W = 560, H = 370, cx = 280, cy = 182, rx = 258, ry = 166;
  const svg = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u1l6-pondsvg' }, host);
  svgEl('ellipse', { cx, cy: cy + 5, rx: rx + 12, ry: ry + 12, fill: '#a9cf86' }, svg);
  svgEl('ellipse', { cx, cy, rx, ry, fill: '#cfe7f5', stroke: '#86b4cf', 'stroke-width': 3 }, svg);
  [[150, 110, 40], [390, 250, 52], [420, 95, 30]].forEach(([x, y, r]) => svgEl('ellipse', { cx: x, cy: y, rx: r, ry: r * 0.42, fill: 'none', stroke: '#a9cde3', 'stroke-width': 2 }, svg));
  // slots on a hex grid inside the pond: the smallest spacing that still gives 64, spread from a seed point
  let s = 60, pts = [];
  while (s > 20) {
    pts = []; const dy = s * 0.866;
    for (let j = 0, y = cy - ry; y <= cy + ry; j++, y += dy) for (let x = cx - rx + (j % 2) * s / 2; x <= cx + rx; x += s) {
      const ex = (x - cx) / (rx - s * 0.42), ey = (y - cy) / (ry - s * 0.42); if (ex * ex + ey * ey <= 1) pts.push([x, y]);
    }
    if (pts.length >= 64) break; s -= 1;
  }
  const seed = [cx - 95, cy + 25];
  pts.sort((a, b) => Math.hypot(a[0] - seed[0], (a[1] - seed[1]) * 1.4) - Math.hypot(b[0] - seed[0], (b[1] - seed[1]) * 1.4));
  pts = pts.slice(0, 64);
  const rnd = (i) => { const x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); };
  const R = s * 0.64, pads = pts.map(([x, y], i) => {
    const g = svgEl('g', { class: 'u1l6-lily' }, svg), a = rnd(i) * Math.PI * 2, w = 0.42, r = R * (0.88 + rnd(i + 99) * 0.2);
    const p1 = [x + r * Math.cos(a - w), y + r * Math.sin(a - w)], p2 = [x + r * Math.cos(a + w), y + r * Math.sin(a + w)];
    svgEl('path', { d: `M${x} ${y} L${p2[0].toFixed(1)} ${p2[1].toFixed(1)} A${r.toFixed(1)} ${r.toFixed(1)} 0 1 1 ${p1[0].toFixed(1)} ${p1[1].toFixed(1)} Z`, fill: i % 3 ? '#4f9c3f' : '#5aab48', stroke: '#2b5e22', 'stroke-width': 1.3 }, g);
    if (i % 11 === 4) { svgEl('circle', { cx: x - r * 0.25, cy: y + r * 0.1, r: r * 0.3, fill: '#f4a7c4', stroke: '#c9668e', 'stroke-width': 1 }, g); svgEl('circle', { cx: x - r * 0.25, cy: y + r * 0.1, r: r * 0.1, fill: '#f6d24a' }, g); }
    g.style.transformOrigin = `${x}px ${y}px`;
    return g;
  });
  const info = div(host, 'u1l6-pondinfo', '', 10, 8);
  const bBack = document.getElementById('u1l6-dback'), bFwd = document.getElementById('u1l6-dfwd'), bReset = document.getElementById('u1l6-dreset');
  const FR = { 64: '<b>full</b>', 32: '<b>half</b> covered', 16: '<b>a quarter</b> covered', 8: '<b>⅛</b> covered (12.5%)', 4: '<sup>1</sup>⁄<sub>16</sub> covered (about 6%)', 2: '<sup>1</sup>⁄<sub>32</sub> covered (about 3%)', 1: '<sup>1</sup>⁄<sub>64</sub> covered (under 2%)' };
  let day = 30;
  const paint = () => {
    const k = Math.pow(2, day - 24);
    pads.forEach((g, i) => g.classList.toggle('u1l6-lily-on', i < k));
    info.innerHTML = `<b>Day ${day}</b> · ${k} of 64 patches · pond ${FR[k]}`;
    bBack.disabled = day <= 24; bFwd.disabled = day >= 30;
  };
  bBack.addEventListener('click', () => { if (day > 24) { day--; paint(); } });
  bFwd.addEventListener('click', () => { if (day < 30) { day++; paint(); } });
  bReset.addEventListener('click', () => { day = 30; paint(); });
  paint();
}

/* =============================== explainer: percent change → growth factor =============================== */
const FA = {
  up6: { label: 'Up 6%', kind: 'up', p: 6 },
  down6: { label: 'Down 6%', kind: 'down', p: 6 },
  lose14: { label: 'Loses ¼', kind: 'frac', num: 1, den: 4 },
  reb80: { label: 'Rebounds to 80%', kind: 'keep', p: 80 },
  lose80: { label: 'Loses 80%', kind: 'down', p: 80 },
  dbl: { label: 'Doubles', kind: 'times', k: 2 }
};
const EX1 = [
  { t: '(a) Elk herd grows by 7%', blue: 1, gain: 0.07, r: '1+0.07=1.07', cap: 'It keeps all 100% and <b>gains</b> 7%.' },
  { t: '(b) Laptop loses 28%', blue: 0.72, lost: 0.28, r: '1-0.28=0.72', cap: 'It <b>loses</b> 28%, so it keeps 72%.' },
  { t: '(c) Views triple', blue: 3, seg: 3, r: '3', cap: '<b>Triple</b>: three copies of the whole amount.' },
  { t: '(d) Arc shorter by one-eighth', blue: 7 / 8, lost: 1 / 8, seg: 8, r: '\\tfrac{7}{8}=0.875', cap: 'One-eighth is <b>lost</b>, so it keeps seven-eighths.' },
  { t: '(e) Rebounds to 65%', blue: 0.65, ghost: 0.35, r: '0.65', cap: 'The new height <b>is</b> 65% of the old one. Nothing to subtract.' },
  { t: '(f) Wages rise by 2.75%', blue: 1, gain: 0.0275, r: '1+0.0275=1.0275', cap: 'Keeps 100%, <b>gains</b> 2.75%. Careful with the decimal: 2.75% is 0.0275.' }
];
function bar(host, x, y, w, hh, cls, html = '') { return div(host, 'u1l6-bar ' + cls, html, x, y, w, hh); }
const factor = {
  title: 'Percent change → growth factor',
  height: 384, minW: 900,
  choices: [...Object.keys(FA).map((k) => ({ v: k, label: FA[k].label })), { sep: 'Check:' }, { v: 'ex1', label: 'Example 1 check' }],
  ask: (v) => (v === 'ex1' ? 'Example 1: state the growth factor <i>r</i> in each situation.' : `What does “${FA[v].label.toLowerCase()}” do to the amount each period?`),
  make(stage, v, ex) {
    if (v === 'ex1') return factorEx1(stage, ex);
    const d = FA[v], X0 = 170, S = 320, BH = 66, Y1 = 34, Y2 = 150;
    div(stage, 'u1l6-blab', 'Before', 16, Y1 + 18); const aLab = hide(div(stage, 'u1l6-blab', 'After 1<br>period', 16, Y2 + 6));
    const before = bar(stage, X0, Y1, S, BH, 'u1l6-b-blue', '100%');
    let r, rTex, after = [], keepTxt;
    if (d.kind === 'up') { r = 1 + d.p / 100; rTex = `r=1+\\dfrac{${d.p}}{100}=1+${fx(d.p / 100, 4)}=${cR(fx(r, 4))}`; keepTxt = `${100 + d.p}%`; }
    else if (d.kind === 'down') { r = 1 - d.p / 100; rTex = `r=1-\\dfrac{${d.p}}{100}=1-${fx(d.p / 100, 2, true)}=${cR(fx(r, 4))}`; keepTxt = `${100 - d.p}%`; }
    else if (d.kind === 'frac') { r = 1 - d.num / d.den; rTex = `r=1-\\tfrac{${d.num}}{${d.den}}=${cR(`\\tfrac{${d.den - d.num}}{${d.den}}`)}=${fx(r, 4)}`; keepTxt = '¾'; }
    else if (d.kind === 'keep') { r = d.p / 100; rTex = `r=\\dfrac{${d.p}}{100}=${cR(fx(r, 4))}`; keepTxt = `${d.p}%`; }
    else { r = d.k; rTex = `r=${cR(String(d.k))}`; keepTxt = `${d.k * 100}%`; }
    // the "after" picture
    let fall = null, grow = null;
    if (d.kind === 'up') {
      after = [bar(stage, X0, Y2, S, BH, 'u1l6-b-blue', '100%')]; grow = bar(stage, X0 + S, Y2, S * d.p / 100, BH, 'u1l6-b-green');
      grow.appendChild(h('div', 'u1l6-btag u1l6-tag-up', `+${d.p}%`)); after.push(grow);
    } else if (d.kind === 'down') {
      const keep = S * (1 - d.p / 100);
      after = [bar(stage, X0, Y2, keep, BH, 'u1l6-b-blue', `${100 - d.p}%`)]; fall = bar(stage, X0 + keep, Y2, S - keep, BH, 'u1l6-b-red', d.p >= 20 ? `−${d.p}%` : '');
      if (d.p < 20) fall.appendChild(h('div', 'u1l6-btag u1l6-tag-dn', `−${d.p}%`));
      after.push(fall);
    } else if (d.kind === 'frac') {
      const q = S / d.den;
      for (let i = 0; i < d.den; i++) after.push(bar(stage, X0 + i * q, Y2, q, BH, i < d.den - d.num ? 'u1l6-b-blue u1l6-b-seg' : 'u1l6-b-red u1l6-b-seg', i < d.den - d.num ? '¼' : '−¼'));
      fall = after[after.length - 1];
    } else if (d.kind === 'keep') {
      div(stage, 'u1l6-ghostbar', '', X0, Y2, S, BH);
      after = [bar(stage, X0, Y2, S * r, BH, 'u1l6-b-blue', `${d.p}%`)];
    } else {
      after = [bar(stage, X0, Y2, S, BH, 'u1l6-b-blue', '100%'), bar(stage, X0 + S, Y2, S, BH, 'u1l6-b-blue u1l6-b-copy', '100%')];
      grow = after[1];
    }
    after.forEach(hide);
    const tag = hide(div(stage, 'u1l6-xr', T(`\\times ${cR(fx(r, 4))}`), 22, Y2 - 34));
    const F = hide(panel(stage, X0, 262, ex.W - X0 - 16, 104, '', 'u1l6-fpanel'));
    F.innerHTML = `<div class="u1l6-fbig">${T(rTex)}</div><div class="u1l6-fv ${r > 1 ? 'u1l6-fv-up' : 'u1l6-fv-dn'}">${r > 1 ? T('r>1') + ': it <b>grows</b>' : T('0<r<1') + ': it <b>decays</b>'}</div>`;
    const caps = {
      up: `<b>Up ${d.p}%</b>: it keeps all <b>100%</b> and <b>gains</b> another ${d.p}%. That makes <b>${keepTxt}</b>.`,
      down: d.p === 80 ? '<b>“Loses 80%”</b>: 80% falls away. Only <b>20%</b> is left.' : `<b>Down ${d.p}%</b>: ${d.p}% is <b>taken away</b>, so <b>${keepTxt}</b> is left.`,
      frac: '<b>Loses ¼</b>: cut it into 4 equal parts and one falls off. It <b>keeps ¾</b>.',
      keep: '<b>“Rebounds to 80%”</b>: the new height <b>is</b> 80% of the old one. Nothing to subtract.',
      times: '<b>Doubles</b>: two copies of the whole amount, <b>200%</b>.'
    };
    const last = v === 'lose80' ? `Compare: “rebounds <b>to</b> 80%” keeps 80%, so ${T('r=0.8')}. “<b>Loses</b> 80%” keeps 20%, so ${T('r=0.2')}.`
      : v === 'reb80' ? `Compare: “<b>loses</b> 80%” would keep only 20%: ${T('r=0.2')}. Read the words carefully.`
        : r > 1 ? `${T('r>1')}: the amount <b>grows</b> every period.` : `${T('0<r<1')}: the amount <b>decays</b> (shrinks) every period.`;
    return [
      { cap: 'Start with the amount at the beginning of a period: <b>100%</b> of it.', run: (c) => pulse(c, before, 1.06) },
      { cap: caps[d.kind],
        run: async (c) => {
          await show(c, aLab);
          if (d.kind === 'up' || d.kind === 'times') { await show(c, after[0]); grow.style.opacity = 1; await anim(c, grow, [{ clipPath: 'inset(-40px 100% 0 0)' }, { clipPath: 'inset(-40px 0 0 0)' }], 600); grow.style.clipPath = ''; }
          else { for (const b of after) b.style.opacity = 1; await pop(c, after[0], 300); if (fall) { await sleep(c, 250); await anim(c, fall, [{ transform: 'none', opacity: 1 }, { transform: 'translate(30px, 120px) rotate(14deg)', opacity: 0 }], 800); } }
        } },
      { cap: `Growth factor: ${T(rTex)}. Each period, <b>multiply by ${T(cR(fx(r, 4)))}</b>.`, run: async (c) => { await show(c, tag); await show(c, F); } },
      { cap: last, run: (c) => pulse(c, F.querySelector('.u1l6-fv'), 1.08) }
    ];
  }
};
function factorEx1(stage, ex) {
  const X = 380, S = 100, RH = 58, rows = EX1.map((d, i) => {
    const y = 12 + i * RH;
    const g = hide(div(stage, 'u1l6-e1row', '', 8, y, ex.W - 16, RH - 8));
    div(g, 'u1l6-e1t', d.t, 8, 0);
    const out = div(g, 'u1l6-e1out', '', X - 8, 6, S, RH - 20); // the 100% outline
    void out;
    const blueW = S * Math.min(d.blue, 3);
    if (d.seg) { const n = d.seg, segW = S * (d.blue >= 1 ? 1 : 1 / n); const cnt = d.blue >= 1 ? n : Math.round(d.blue * n); for (let k = 0; k < cnt; k++) div(g, 'u1l6-bar u1l6-b-blue u1l6-b-mini', '', X - 8 + k * segW, 6, segW, RH - 20); }
    else div(g, 'u1l6-bar u1l6-b-blue u1l6-b-mini', '', X - 8, 6, blueW, RH - 20);
    if (d.gain) div(g, 'u1l6-bar u1l6-b-green u1l6-b-mini', '', X - 8 + S, 6, Math.max(4, S * d.gain), RH - 20);
    if (d.lost) div(g, 'u1l6-bar u1l6-b-red u1l6-b-mini u1l6-b-lost', '', X - 8 + blueW, 6, S * d.lost, RH - 20);
    const parts = d.r.split('='), last = parts.pop();
    div(g, 'u1l6-e1r', T(`r=${parts.length ? parts.join('=') + '=' : ''}${cR(last)}`), 700, 6);
    return g;
  });
  return EX1.map((d, i) => ({ cap: `${d.t.slice(0, 3)} ${d.cap} ${T('r=' + d.r)}`, run: (c) => show(c, rows[i]) }));
}

/* =============================== explainer: build the sequence =============================== */
const BS = {
  garden: { label: 'Example 2 check', t1: 450, r: 1.12, y0: 2022, yT: 2032, rate: 'Up 12%', word: 'members', money: false,
    ask: 'Example 2: 450 members in January 2022, growing 12% a year. Membership in January 2032?', end: 'about <b>1398 members</b>' },
  car: { label: 'A car loses 15% a year', t1: 30000, r: 0.85, y0: 2024, yT: 2030, rate: 'Down 15%', word: 'dollars', money: true,
    ask: 'A $30 000 car, bought in January 2024, loses 15% of its value each year. Its value in January 2030?', end: 'worth about <b>$11 314</b>' }
};
const buildSeq = {
  title: 'Multiply by r, again and again',
  height: 450, minW: 900,
  choices: Object.keys(BS).map((k) => ({ v: k, label: BS[k].label })),
  ask: (v) => BS[v].ask,
  make(stage, v, ex) {
    const d = BS[v], vals = [0, 1, 2, 3].map((k) => d.t1 * Math.pow(d.r, k)), N = d.yT - d.y0 + 1, tN = d.t1 * Math.pow(d.r, N - 1);
    const $ = d.money ? '$' : '', BW = 158, GAP = 205, X0 = 26, BY = 74, rS = fx(d.r, 4);
    const svg = svgEl('svg', { class: 'u1l6-ov', width: ex.W, height: 450 }, stage);
    const boxes = vals.map((val, k) => {
      const b = hide(div(stage, 'u1l6-term' + (k === 0 ? ' u1l6-term1' : ''), '', X0 + k * GAP, BY, BW, 82));
      const exact = fx(val, 4), round = nh(val, 0);
      b.innerHTML = `<div class="u1l6-tn">${T(k === 0 ? cT('t_1') : `t_${k + 1}`)}</div><div class="u1l6-tv">${$}${round}</div>${exact !== fx(val, 0) ? `<div class="u1l6-tx">(${nh(val, 4)})</div>` : ''}`;
      div(b, 'u1l6-ty', `Jan ${d.y0 + k}`, 0, 88, BW);
      return b;
    });
    const dots = hide(div(stage, 'u1l6-dots', '…', X0 + 4 * GAP - 20, BY + 18));
    const arcs = [1, 2, 3].map((k) => {
      const x1 = X0 + (k - 1) * GAP + BW * 0.62, x2 = X0 + k * GAP + BW * 0.38, y = BY - 4;
      const g = svgEl('g', { class: 'bk-curve' }, svg); g.style.color = RC;
      svgEl('path', { class: 'bk-stroke', d: `M${x1} ${y} Q${(x1 + x2) / 2} ${y - 56} ${x2} ${y}`, fill: 'none', stroke: RC, 'stroke-width': 3.2, 'stroke-linecap': 'round' }, g);
      arrowHead(g, x2, y, x2 - (x1 + x2) / 2, 56, { width: 3.2, color: RC });
      const lab = hide(div(stage, 'u1l6-hoplab', T(`\\times${cR(rS)}`), (x1 + x2) / 2, y - 50)); lab.style.translate = '-50% -50%';
      hide(g); return { g, lab };
    });
    const ratios = [1, 2, 3].map((k) => {
      const a = vals[k - 1], b = vals[k], x = X0 + (k - 1) * GAP + BW + (GAP - BW) / 2;
      const el = hide(div(stage, 'u1l6-ratio', T(`\\dfrac{${nt(b, 4)}}{${nt(a, 4)}}=${cR(rS)}`), x, 196)); el.style.translate = '-50% 0'; return el;
    });
    const NL = new NumberLine(stage, { x: 14, y: 262, width: ex.W - 28, height: 112, min: d.y0, max: d.yT, step: 1, axisY: 50, arrows: false,
      labels: (y) => `<div class="u1l6-yr">${y}</div><div class="u1l6-yt">${T(y === d.y0 ? cT('t_1') : `t_{${y - d.y0 + 1}}`)}</div>` });
    hide(NL.el);
    const tNs = d.money ? nt(tN, 2, true) : nt(tN, 1);
    const F = hide(div(stage, 'u1l6-fbox', T(`t_{${N}}=${cT(nt(d.t1, 0))}(${cR(rS)})^{${N - 1}}\\approx ${d.money ? '\\$' : ''}${tNs}`), ex.W / 2, 392)); F.style.translate = '-50% 0';
    const hopIn = async (c, k) => { const a = arcs[k - 1]; a.g.style.opacity = 1; await drawIn(a.g, 420, c); await show(c, a.lab); await pop(c, boxes[k], 340); boxes[k].style.opacity = 1; };
    return [
      { cap: `January ${d.y0}: ${$}${nh(d.t1, 0)}${d.money ? '' : ' ' + d.word}. This is the first term, ${T(cT('t_1'))}.`, run: async (c) => { boxes[0].style.opacity = 1; await pop(c, boxes[0], 380); } },
      { cap: `${d.rate} each year: <b>multiply by ${T(cR(rS))}</b> to get the next term.`, run: (c) => hopIn(c, 1) },
      { cap: `Again and again, ×${T(cR(rS))} each year. Keep the <b>unrounded</b> values (in brackets) in your calculator.`, run: async (c) => { await hopIn(c, 2); await hopIn(c, 3); await show(c, dots); } },
      { cap: `<b>Geometric?</b> Divide each term by the one before it: the ratio is always ${T(cR(rS))}.`, run: async (c) => { for (const el of ratios) { await show(c, el); await sleep(c, 150); } } },
      { cap: `${d.yT} is ${d.yT - d.y0} years after ${d.y0}. Count terms: ${d.y0} is ${T(cT('t_1'))}, so ${d.yT} is ${T(`t_{${N}}`)}, ${N - 1} jumps later.`,
        run: async (c) => { await show(c, NL.el); for (let y = d.y0; y < d.yT; y++) await NL.hop(c, y, y + 1, { label: T(`\\times${cR(rS)}`), height: 24, ms: 200 }); } },
      { cap: `${T(`t_{${N}}=t_1r^{${N}-1}=${nt(d.t1, 0)}(${rS})^{${N - 1}}\\approx${tNs}`)}: ${d.end}.`, run: (c) => pop(c, F, 420).then(() => { F.style.opacity = 1; }) }
    ];
  }
};

/* =============================== STAR explainer: where does the sequence start? =============================== */
const SS = {
  ball: { label: 'Example 3 check: the ball', P: 16, r: 0.75, N: 7, d: 2, pre: '', unit: ' m', per: 'bounce', pers: 'bounces', zero: 'drop',
    head: ['bounces', 'height (m)'], ymax: 18, ystep: 2, ylab: 4, ytitle: '\\text{height (m)}', xtitle: '\\text{bounces}', what: 'the 7th bounce', W: '7th\\ bounce',
    ask: 'Example 3: dropped from 16 m, each bounce 75% of the one before. Height of the 7th bounce?',
    c1: 'Time 0: the ball is <b>dropped</b> from 16 m. No bounces yet.' },
  garden: { label: 'Example 2: the garden', P: 450, r: 1.12, N: 10, d: 0, pre: '', unit: ' members', per: 'year', pers: 'years', zero: '2022',
    head: ['years', 'members'], ymax: 1500, ystep: 100, ylab: 300, ytitle: '\\text{members}', xtitle: '\\text{years}', what: 'January 2032', W: 'Jan\\ 2032',
    ask: 'Example 2 again: 450 members in January 2022, up 12% a year. Which term is January 2032?',
    c1: 'Time 0: January 2022, <b>450 members</b>.' },
  gic: { label: 'Example 5: Lena’s GIC', P: 6500, r: 1.038, N: 9, d: 2, pre: '$', unit: '', per: 'year', pers: 'years', zero: 'invest',
    head: ['years', 'value ($)'], ymax: 10000, ystep: 1000, ylab: 2000, ytitle: '\\text{value (\\$)}', xtitle: '\\text{years}', what: 'the value after 9 years', W: 'after\\ 9\\ years',
    ask: 'Example 5: $6 500 at 3.8% compounded annually. Which term is the value after 9 years?',
    c1: 'Time 0: Lena <b>invests $6 500</b>.' }
};
const startShift = {
  title: 'Where does the sequence start?',
  height: 540, minW: 960,
  choices: Object.keys(SS).map((k) => ({ v: k, label: SS[k].label })),
  ask: (v) => SS[v].ask,
  make(stage, v, ex) {
    const d = SS[v], N = d.N, rS = fx(d.r, 4), val = (k) => d.P * Math.pow(d.r, k), Pr = val(1);
    const vh = (k) => d.pre + nh(val(k), d.d), vt = (k) => (d.pre ? '\\$' : '') + nt(val(k), d.d);
    const st = { mode: null, busy: false, live: false };
    /* toggle */
    const tg = div(stage, 'u1l6-tog no-ink', `<span class="u1l6-tgk">${T(cT('t_1'))} is the value…</span>`, 14, 6);
    const bA = h('button', 'u1l6-tgb', 'at time 0'), bB = h('button', 'u1l6-tgb', 'after 1 ' + d.per);
    bA.type = bB.type = 'button'; tg.append(bA, bB); bA.disabled = bB.disabled = true;
    /* table */
    const TW = 440, rowH = Math.min(40, Math.floor(364 / (N + 2))), TY = 56, cols = [[0, 112], [112, 154], [266, 68], [334, 106]];
    const tb = div(stage, 'u1l6-st', '', 14, TY, TW, rowH * (N + 2)); tb.style.setProperty('--rh', rowH + 'px');
    const cell = (r, ci, html, cls = '') => div(tb, 'u1l6-sc ' + cls, html, cols[ci][0], r * rowH, cols[ci][1], rowH);
    cell(0, 0, d.head[0], 'u1l6-sh'); cell(0, 1, d.head[1], 'u1l6-sh'); cell(0, 2, '', 'u1l6-sh'); cell(0, 3, 'term', 'u1l6-sh');
    const rows = [];
    for (let k = 0; k <= N; k++) {
      const y = k + 1;
      const band = div(tb, 'u1l6-sband' + (k === N ? ' u1l6-sband-t' : ''), '', 0, y * rowH, TW, rowH); hide(band);
      const c0 = cell(y, 0, k === 0 ? `0 <span class="u1l6-s0">(${d.zero})</span>` : String(k), 'u1l6-sn');
      const c1 = cell(y, 1, vh(k), 'u1l6-sv');
      const c3 = cell(y, 3, '', 'u1l6-st3');
      const xr = k ? div(tb, 'u1l6-sxr', T(`\\times${cR(rS)}`), cols[2][0], y * rowH - rowH / 2, cols[2][1], rowH) : null;
      [c0, c1, xr].forEach(hide);
      rows.push({ band, c0, c1, c3, xr });
    }
    /* graph */
    const GX = 470, GW = ex.W - GX - 10;
    const G = new Graph(stage, { x: GX, y: 4, width: GW, height: 530, xmin: 0, xmax: N + 0.7, ymin: 0, ymax: d.ymax, xstep: 1, ystep: d.ystep, xlabels: 1, ylabels: 1e9, origin: true, fontSize: 15, pad: [22, 16, 36, 62], xtitle: d.xtitle, ytitle: d.ytitle });
    for (let y = d.ylab; y <= d.ymax + 1e-9; y += d.ylab) { const [px, py] = G.toPx(0, y); svgEl('text', { class: 'bk-num', x: px - 7, y: py + 5, 'text-anchor': 'end' }, G.layers.axes).textContent = nh(y, 0); }
    const dots = [], dlabs = [];
    for (let k = 0; k <= N; k++) {
      dots.push(hide(G.point(k, val(k), { color: PC, r: 7 })));
      dlabs.push(hide(G.label(k, val(k), '', { pos: k % 2 ? 'ne' : 'n', cls: 'u1l6-dlab', gap: 10 })));
    }
    /* formula panel */
    const F = panel(stage, 14, TY + rowH * (N + 2) + 10, TW, 540 - (TY + rowH * (N + 2) + 10) - 6, '', 'u1l6-spanel');
    const f1 = h('div', 'u1l6-sf'), f2 = h('div', 'u1l6-sf u1l6-sf2'); F.append(f1, f2); f1.innerHTML = `Which term is <b>${d.what}</b>?`;
    const tgtIdx = (m) => (m === 'A' ? N + 1 : N), expo = (m) => (m === 'A' ? N : N - 1);
    const f2Tex = (m) => `\\text{${d.W.replace(/\\ /g, ' ')}}=t_{${tgtIdx(m)}}=${m === 'A' ? cT(nt(d.P, 2)) : cT(nt(Pr, 4))}(${rS})^{${cR(expo(m))}}\\approx${vt(N)}`;
    const f1Tex = (m) => (m === 'A' ? `${cT('t_1')}=${nt(d.P, 2)}\\ \\text{(time 0)}` : `${cT('t_1')}=${nt(d.P, 2)}(${rS})=${nt(Pr, 4)}\\ \\text{(after 1 ${d.per})}`);
    async function setMode(c, m) {
      const prev = st.mode; st.mode = m;
      bA.classList.toggle('on', m === 'A'); bB.classList.toggle('on', m === 'B');
      const dir = prev ? (m === 'B' ? 1 : -1) : 0;
      const jobs = rows.map((R, k) => {
        const idx = m === 'A' ? k + 1 : k;
        R.c3.innerHTML = idx ? T(idx === 1 ? cT('t_1') : `t_{${idx}}`) : '<span class="u1l6-nt">not a term</span>';
        R.c3.classList.toggle('u1l6-st3-1', idx === 1);
        const L = dlabs[k]; L.innerHTML = idx ? T(idx === 1 ? cT('t_1') : `t_{${idx}}`) : ''; L.style.opacity = 1; L._bkDraw();
        dots[k].querySelector('circle').setAttribute('fill', idx === 1 ? TC : PC); dots[k].querySelector('circle').setAttribute('r', idx === 1 ? 9.5 : 7);
        return dir ? anim(c, R.c3, [{ transform: `translateY(${dir * rowH}px)`, opacity: 0.2 }, { transform: 'none', opacity: 1 }], 520) : pop(c, R.c3, 300);
      });
      f1.innerHTML = T(f1Tex(m)); f2.innerHTML = T(f2Tex(m));
      await Promise.all(jobs);
      await pulse(c, f2, 1.05);
    }
    const flip = async (m) => { if (!st.live || st.busy || st.mode === m) return; st.busy = true; try { await setMode(liveCtx(), m); } finally { st.busy = false; } };
    bA.addEventListener('click', () => flip('A')); bB.addEventListener('click', () => flip('B'));
    const rowIn = async (c, k, ms = 300) => {
      const R = rows[k];
      if (R.xr) await fadeIn(c, R.xr, ms * 0.7);
      await Promise.all([fadeIn(c, R.c0, ms), fadeIn(c, R.c1, ms), G.reveal(dots[k], c, ms)]);
      dots[k].style.opacity = 1;
    };
    const curve = G.fn((x) => d.P * Math.pow(d.r, x), { from: 0, to: N + 0.7, color: PC, width: 2.4, dash: '7 7', arrows: false }); hide(curve);
    const cLab = hide(d.r > 1 ? G.label(0.4, d.ymax * 0.93, `the dots sit on ${T(`y=${nt(d.P, 2)}(${rS})^x`)}`, { pos: 'e', cls: 'u1l6-clab', gap: 0 })
      : G.label(N * 0.4, d.ymax * 0.86, `the dots sit on ${T(`y=${nt(d.P, 2)}(${rS})^x`)}`, { pos: 'e', cls: 'u1l6-clab', gap: 0 }));
    return [
      { cap: `${d.c1}`, run: (c) => rowIn(c, 0, 380) },
      { cap: `After 1 ${d.per}: ×${T(cR(rS))} gives <b>${vh(1)}</b>.`, run: (c) => rowIn(c, 1) },
      { cap: `After 2 ${d.pers}: ×${T(cR(rS))} again gives <b>${vh(2)}</b>.`, run: (c) => rowIn(c, 2) },
      { cap: `Keep multiplying by ${T(cR(rS))}: one row, and one dot, for each ${d.per}. The dots are <b>not</b> joined.`, run: async (c) => { for (let k = 3; k <= N; k++) await rowIn(c, k, 200); } },
      { cap: `<b>Start at time 0:</b> ${T(cT('t_1') + '=' + nt(d.P, 2))}. Each term is <b>one ahead</b> of the ${d.pers}, so ${d.what} is ${T(`t_{${N + 1}}`)}.`,
        run: async (c) => { rows[N].band.style.opacity = 1; await setMode(c, 'A'); st.live = true; bA.disabled = bB.disabled = false; } },
      { cap: `<b>Start after 1 ${d.per}:</b> ${T(cT('t_1') + '=' + nt(Pr, 4))}. Every term name moves <b>up a row</b>, so ${d.what} is ${T(`t_{${N}}`)}: the exponent drops by 1.`,
        run: (c) => setMode(c, 'B') },
      { cap: `Same value both ways: ${T(`${nt(d.P, 2)}(${rS})^{${N}}=${nt(Pr, 4)}(${rS})^{${N - 1}}\\approx${vt(N)}`)}. After ${T('n')} ${d.pers}: ${T(`${cP('P')}${cR('r')}^{\\,n}`)}. Tap the toggle to compare.`,
        run: async (c) => {
          curve.style.opacity = 1; await G.drawIn(curve, 900, c); await show(c, cLab);
          const f3 = h('div', 'u1l6-sf u1l6-sf3', T(`\\text{either way}=${cP(nt(d.P, 2))}(${cR(rS)})^{${N}}=${cP('P')}${cR('r')}^{\\,n}`)); F.appendChild(f3); await show(c, f3);
        } }
    ];
  }
};

/* =============================== explainer: count the periods =============================== */
const PD = {
  bact: { label: 'Example 4(a) check', P: 300, r: 2, per: 20, total: 240, u: 'min', conv: '4\\text{ h}=240\\text{ min}', what: 'bacteria', word: 'doubling', fac: '2', d: 0,
    ask: 'Example 4(a): 300 bacteria, doubling every 20 minutes. How many after 4 hours?' },
  iso: { label: 'Example 4(b) check', P: 96, r: 0.5, per: 6, total: 48, u: 'h', conv: '2\\text{ days}=48\\text{ h}', what: 'mg', word: 'half-life', fac: '\\tfrac{1}{2}', d: 3,
    ask: 'Example 4(b): 96 mg, half-life 6 hours. How much is left after 2 days?' },
  town: { label: 'Doubles every 15 years', P: 5000, r: 2, per: 15, total: 60, u: 'years', conv: '60\\text{ years}', what: 'people', word: 'doubling', fac: '2', d: 0,
    ask: 'A town of 5 000 people doubles every 15 years. How many people after 60 years?' }
};
const periods = {
  title: 'How many periods fit in the time?',
  height: 400, minW: 900,
  choices: Object.keys(PD).map((k) => ({ v: k, label: PD[k].label })),
  ask: (v) => PD[v].ask,
  make(stage, v, ex) {
    const d = PD[v], n = d.total / d.per, A = d.P * Math.pow(d.r, n), rp = Math.pow(d.r, n), half = d.r < 1;
    const NL = new NumberLine(stage, { x: 14, y: 96, width: ex.W - 28, height: 130, min: 0, max: d.total, step: d.per, axisY: 78, arrows: false, fontSize: 17,
      labels: (t) => `<span class="u1l6-tl">${t}</span>` });
    div(stage, 'u1l6-unit', d.u, ex.W - 60, 206);
    const nBox = div(stage, 'u1l6-cnt', `<div class="u1l6-ck">periods</div><div class="u1l6-cv">${T('n=0')}</div>`, 24, 8, 190, 76);
    const vBox = div(stage, 'u1l6-cnt u1l6-cnt-v', `<div class="u1l6-ck">${half ? 'amount left' : 'amount'}</div><div class="u1l6-cv">${nh(d.P, d.d)}</div>`, 236, 8, 280, 76);
    const conv = hide(div(stage, 'u1l6-conv', T(`\\text{total: }${d.conv}`), ex.W - 340, 18, 320));
    const nCv = nBox.querySelector('.u1l6-cv'), vCv = vBox.querySelector('.u1l6-cv');
    const setN = (k) => { nCv.innerHTML = T(`n=${k}`); vCv.innerHTML = nh(d.P * Math.pow(d.r, k), d.d); };
    const prod = hide(div(stage, 'u1l6-prod', '', 24, 252, ex.W - 48));
    prod.innerHTML = `<span class="u1l6-pt">${T(nt(d.P, 0))}</span>` + Array.from({ length: n }, () => `<span class="u1l6-ptok">${T('\\times' + cR(d.fac))}</span>`).join('');
    const toks = [...prod.querySelectorAll('.u1l6-ptok')];
    const res = hide(div(stage, 'u1l6-fbox', T(`${nt(d.P, 0)}(${cR(d.fac)})^{${n}}=${nt(d.P, 0)}${half ? `\\left(\\tfrac{1}{${nt(1 / rp, 0)}}\\right)=\\dfrac{${d.P}}{${nt(1 / rp, 0)}}` : `(${nt(rp, 0)})`}=${nt(A, d.d)}\\text{ ${d.what}}`), ex.W / 2, 322)); res.style.translate = '-50% 0';
    const hop = (c, k, ms) => NL.hop(c, k * d.per, (k + 1) * d.per, { label: T('\\times' + cR(d.fac)), height: 26, ms, color: half ? DN : UP });
    return [
      { cap: `One period is <b>${d.per} ${d.u}</b>: one ${d.word} every ${d.per} ${d.u}.`, run: async (c) => { await hop(c, 0, 600); setN(1); await pulse(c, vBox, 1.06); } },
      { cap: `Write the total time in the <b>same units</b>: ${T(d.conv)}.`, run: async (c) => { await show(c, conv); await pulse(c, NL.el.querySelector('.bk-nl-lab:last-child') || conv, 1.15); } },
      { cap: `Count the periods: ${T(`n=\\dfrac{\\text{total time}}{\\text{one period}}=\\dfrac{${d.total}}{${d.per}}=${n}`)} ${d.word === 'half-life' ? 'half-lives' : d.word + 's'}.`,
        run: async (c) => { for (let k = 1; k < n; k++) { await hop(c, k, 160); setN(k + 1); } } },
      { cap: `Each ${d.word} multiplies by ${T(cR(d.fac))}: ${n} factors of ${T(d.fac)}, so ${T(`${nt(d.P, 0)}(${d.fac})^{${n}}`)}.`,
        run: async (c) => { prod.style.opacity = 1; for (const t of toks) { await pop(c, t, 160); } } },
      { cap: `${T(`${nt(d.P, 0)}(${d.fac})^{${n}}=${nt(A, d.d)}`)} ${d.what}.`, run: async (c) => { await pop(c, res, 420); res.style.opacity = 1; } }
    ];
  }
};

/* =============================== explainer: compound interest =============================== */
const CI = {
  k1000: { label: '$1 000 at 10%', P: 1000, i: 0.1, nEnd: 10, ask: '$1 000 is invested at 10% per year, compounded annually. Watch the interest grow.' },
  lena: { label: 'Example 5 check', P: 6500, i: 0.038, nEnd: 9, lena: true, ask: 'Example 5: Lena invests $6 500 at 3.8% per year, compounded annually.' },
  monthly: { label: 'Monthly: 6% for 3 years', P: 1000, i: 0.005, nEnd: 36, monthly: true, ask: '$1 000 at 6% per year, compounded monthly, for 3 years.' }
};
const compound = {
  title: 'Interest on interest',
  height: 460, minW: 900,
  choices: Object.keys(CI).map((k) => ({ v: k, label: CI[k].label })),
  ask: (v) => CI[v].ask,
  make(stage, v, ex) {
    const d = CI[v], r = 1 + d.i, rS = fx(r, 4), A = d.P * Math.pow(r, d.nEnd);
    if (d.monthly) return compoundMonthly(stage, ex, d, A);
    // a broken baseline (zigzag): the bars start at 70% of P, so the interest slices are big enough to see
    const B = [0, 1, 2, 3].map((k) => d.P * Math.pow(r, k)), base = 372, F0 = 0.7 * d.P, sc = 280 / (B[3] - F0), BW = 92, GAP = 124, X0 = 34;
    const hb = (b) => 36 + (b - F0) * sc;
    const zig = (w) => { let pts = ''; for (let x = 0, k = 0; x <= w; x += 8, k++) pts += `${x},${k % 2 ? 2 : 10} `; return `<svg width="${w}" height="12" viewBox="0 0 ${w} 12"><polyline points="${pts}" fill="none" stroke="#fbfaf6" stroke-width="4"/></svg>`; };
    div(stage, 'u1l6-cleg', '<i class="u1l6-sw u1l6-sw-b"></i> balance <i class="u1l6-sw u1l6-sw-g"></i> interest <i class="u1l6-sw u1l6-sw-o"></i> interest on interest', X0, 6);
    const ioiOf = (k) => (k >= 2 ? (B[k] - B[k - 1]) - d.i * d.P : 0);
    const bars = B.map((b, k) => {
      const x = X0 + k * GAP, g = hide(div(stage, 'u1l6-cg', '', x, 0, BW, base));
      const prevB = k ? B[k - 1] : b, intr = b - prevB, ioi = ioiOf(k);
      div(g, 'u1l6-cbar', '', 0, base - hb(prevB), BW, hb(prevB));
      div(g, 'u1l6-zig', zig(BW), 0, base - 22, BW, 12);
      if (k) {
        const hI = intr * sc, top = base - hb(b);
        const sl = div(g, 'u1l6-cint', '', 0, top, BW, hI);
        if (ioi > 0) div(sl, 'u1l6-cioi', '', 0, 0, BW, Math.max(3, ioi * sc));
        div(g, 'u1l6-cil', `+$${nh(intr, 2, true)}`, -10, base + 30, BW + 20);
      }
      div(g, 'u1l6-cv2', `$${nh(b, 2, true)}`, -16, base - hb(b) - 28, BW + 32);
      div(g, 'u1l6-cyr', `Year ${k}`, 0, base + 6, BW);
      return g;
    });
    const PX = X0 + 4 * GAP + 20, P = panel(stage, PX, 14, ex.W - PX - 14, 430, 'Value after…', 'u1l6-cpanel');
    const Pt = nt(d.P, 0);
    const L = [
      lineIn(P, `<span class="u1l6-lk">1 year</span>${T(`${Pt}+${fx(d.i, 4)}(${Pt})=${Pt}(${cR(rS)})`)}`),
      lineIn(P, `<span class="u1l6-lk">2 years</span>${T(`${Pt}(${cR(rS)})(${cR(rS)})=${Pt}(${cR(rS)})^2`)}`),
      lineIn(P, `<span class="u1l6-lk">3 years</span>${T(`${Pt}(${cR(rS)})^3`)}`),
      lineIn(P, `<span class="u1l6-lk">n years</span>${T(`A=P(1+i)^n,\\quad ${cR('r=1+i')}`)}`, 'u1l6-line-key')
    ];
    const extra = d.lena
      ? [lineIn(P, `<span class="u1l6-lk">(c)</span>${T('t_n=6\\,500(1.038)(1.038)^{n-1}')}<br><span class="u1l6-lk"></span>${T('=6\\,500(1.038)^n')}`, 'u1l6-line-sm'),
        lineIn(P, `<span class="u1l6-lk">(d)</span>${T(`t_9=6\\,500(1.038)^9\\approx\\$9\\,092.63`)}`, 'u1l6-line-ans')]
      : [lineIn(P, `<span class="u1l6-lk">10 years</span>${T(`1\\,000(1.1)^{10}\\approx\\$${nt(A, 2, true)}`)}`, 'u1l6-line-ans')];
    const yr = (k) => async (c) => { await show(c, bars[k]); await show(c, L[k - 1]); };
    const steps = [
      { cap: `Year 0: invest <b>$${nh(d.P, 0)}</b>.`, run: (c) => show(c, bars[0]) },
      { cap: `Year 1: interest of ${fx(d.i * 100, 2)}% (${T(`${fx(d.i, 4)}\\times${Pt}=${nt(d.i * d.P, 2)}`)}) is <b>added</b>. ${T(`P+iP=P(1+i)`)}: multiply by ${T(cR(rS))}.`, run: yr(1) },
      { cap: `Year 2: interest on the <b>new</b> balance: ${T(`${fx(d.i, 4)}\\times${nt(B[1], 2)}=${nt(B[2] - B[1], 2)}`)}. The extra $${nh(ioiOf(2), 2, true)} (gold) is <b>interest on interest</b>.`, run: yr(2) },
      { cap: `Year 3: ×${T(cR(rS))} again. The interest is bigger every year.`, run: yr(3) },
      { cap: `After ${T('n')} years: ${T('A=P(1+i)^n')}. The values form a geometric sequence with ${T(cR('r=1+i'))}.`, run: (c) => show(c, L[3]) }
    ];
    if (d.lena) steps.push(
      { cap: `(c) If ${T('t_1')} is the value <b>after 1 year</b>: ${T('t_n=t_1r^{n-1}=6\\,500(1.038)(1.038)^{n-1}=6\\,500(1.038)^n')}.`, run: (c) => show(c, extra[0]) },
      { cap: `(d) After 9 years: ${T('6\\,500(1.038)^9\\approx9\\,092.63')}. The GIC is worth <b>$9 092.63</b>.`, run: (c) => show(c, extra[1]) });
    else steps.push({ cap: `After 10 years: ${T(`1\\,000(1.1)^{10}\\approx${nt(A, 2, true)}`)}. More than double, from interest on interest.`, run: (c) => show(c, extra[0]) });
    return steps;
  }
};
function compoundMonthly(stage, ex, d, A) {
  const yearly = d.P * Math.pow(1.06, 3);
  const top = div(stage, 'u1l6-mconv', '', 20, 10, ex.W - 40);
  const l1 = lineIn(top, `<span class="u1l6-lk">rate per period</span>${T(`i=\\dfrac{0.06}{12}=${cR('0.005')}\\ \\text{per month}`)}`);
  const l2 = lineIn(top, `<span class="u1l6-lk">number of periods</span>${T('n=3\\times12=36\\ \\text{months}')}`);
  const cal = div(stage, 'u1l6-cal', '', 20, 150, ex.W - 40, 180), cells = [];
  ['Year 1', 'Year 2', 'Year 3'].forEach((y, j) => {
    div(cal, 'u1l6-calY', y, 0, j * 58 + 14);
    for (let m = 0; m < 12; m++) cells.push(hide(div(cal, 'u1l6-calc', String(j * 12 + m + 1), 100 + m * ((ex.W - 160) / 12), j * 58 + 6, (ex.W - 160) / 12 - 6, 46)));
  });
  const res = hide(div(stage, 'u1l6-fbox', T(`A=1\\,000(${cR('1.005')})^{36}\\approx\\$${nt(A, 2, true)}`), ex.W / 2, 346)); res.style.translate = '-50% 0';
  const cmp = hide(div(stage, 'u1l6-cmp', `Yearly instead: ${T(`1\\,000(1.06)^3\\approx\\$${nt(yearly, 2, true)}`)}`, ex.W / 2, 408)); cmp.style.translate = '-50% 0';
  return [
    { cap: `Compounded <b>monthly</b>: 12 periods a year. Rate per period: ${T('i=\\tfrac{0.06}{12}=0.005')}.`, run: (c) => show(c, l1) },
    { cap: `Count the periods: ${T('3\\times12=36')} months. Each square is one period.`, run: async (c) => { await show(c, l2); for (const q of cells) { await pop(c, q, 90); q.style.opacity = 1; } } },
    { cap: `Each month: ×${T(cR('1.005'))}. ${T(`A=1\\,000(1.005)^{36}\\approx${nt(A, 2, true)}`)}.`, run: async (c) => { await pop(c, res, 400); res.style.opacity = 1; } },
    { cap: `Compare yearly: ${T(`1\\,000(1.06)^3\\approx${nt(yearly, 2, true)}`)}. Compounding more often earns a little more.`, run: (c) => show(c, cmp) }
  ];
}

/* =============================== explainer: find the rate =============================== */
const RR = {
  ex6: { label: 'Example 6 check', P: 2500, A: 3400, n: 7, tries: [0.04, 0.05], lo: 1.25, hi: 1.5, step: 0.05, ask: 'Example 6: $2 500 grows to $3 400 in 7 years, compounded annually. The rate?' },
  dbl: { label: 'Doubles in 10 years', P: 1000, A: 2000, n: 10, tries: [0.07, 0.08], lo: 1.85, hi: 2.25, step: 0.05, ask: '$1 000 doubles to $2 000 in 10 years, compounded annually. The rate?' }
};
const rateRoot = {
  title: 'Undo the power with a root',
  height: 410, minW: 900,
  choices: Object.keys(RR).map((k) => ({ v: k, label: RR[k].label })),
  ask: (v) => RR[v].ask,
  make(stage, v, ex) {
    const d = RR[v], q = d.A / d.P, g = Math.pow(q, 1 / d.n), i = g - 1, pct = fx(i * 100, 1), qS = fx(q, 4), chk = d.P * Math.pow(1 + Number(pct) / 100, d.n);
    const tv = d.tries.map((t) => Math.pow(1 + t, d.n));
    const E = div(stage, 'u1l6-eqs', '', 20, 10, ex.W - 470);
    const e1 = lineIn(E, T(`${nt(d.P, 0)}(1+i)^{${d.n}}=${nt(d.A, 0)}`));
    const e2 = lineIn(E, T(`(1+i)^{${d.n}}=\\dfrac{${nt(d.A, 0)}}{${nt(d.P, 0)}}=${qS}`));
    /* the power machine: 1 + i → (^n) → q, and back with the nth root */
    const MX = ex.W - 430, mIn = hide(div(stage, 'u1l6-mbox', T('1+i'), MX, 28, 124, 58)), mOut = hide(div(stage, 'u1l6-mbox u1l6-mbox-o', T(qS), MX + 286, 28, 124, 58));
    const msvg = svgEl('svg', { class: 'u1l6-ov', width: ex.W, height: 140 }, stage);
    const fw = svgEl('g', { class: 'bk-curve' }, msvg); fw.style.color = RC;
    svgEl('path', { class: 'bk-stroke', d: `M${MX + 132} 57 L${MX + 276} 57`, stroke: RC, 'stroke-width': 3.5, fill: 'none' }, fw); arrowHead(fw, MX + 280, 57, 1, 0, { width: 3.5, color: RC });
    const fwL = hide(div(stage, 'u1l6-mlab', T(`(\\ )^{${d.n}}`), MX + 204, 20)); fwL.style.translate = '-50% 0'; hide(fw);
    const bk = svgEl('g', { class: 'bk-curve' }, msvg); bk.style.color = UP;
    svgEl('path', { class: 'bk-stroke', d: `M${MX + 348} 92 Q${MX + 204} 150 ${MX + 66} 94`, stroke: UP, 'stroke-width': 3.5, fill: 'none' }, bk); arrowHead(bk, MX + 62, 92, -1, -0.4, { width: 3.5, color: UP });
    const bkL = hide(div(stage, 'u1l6-mlab u1l6-mlab-g', `${T(`\\sqrt[${d.n}]{\\ }`)} undoes it`, MX + 204, 128)); bkL.style.translate = '-50% 0'; hide(bk);
    const NL = new NumberLine(stage, { x: 14, y: 150, width: ex.W - 28, height: 120, min: d.lo, max: d.hi, step: d.step, minor: d.step / 5, axisY: 76, arrows: false, fontSize: 17 });
    hide(NL.el);
    const tgt = NL.point(q, { color: PC, r: 9, label: `<b>target ${qS}</b>` }); hide(tgt); hide(tgt.label);
    const tp = d.tries.map((t, k) => { const p = NL.point(tv[k], { color: k ? DN : RC, r: 8, label: T(`${fx(1 + t, 2, true)}^{${d.n}}\\approx${fx(tv[k], 3)}`), pos: 'n' }); place(p.label, NL.toPx(tv[k]), NL.ay - 10, 'n', 40); hide(p); hide(p.label); return p; });
    const R = div(stage, 'u1l6-eqs u1l6-eqs2', '', 20, 290, ex.W - 40);
    const e3 = lineIn(R, T(`1+i=\\sqrt[${d.n}]{${qS}}\\approx${fx(g, 4)}`));
    const e4 = lineIn(R, `${T(`i\\approx${fx(i, 4)}`)}: about <b>${pct}% per year</b>. &nbsp; <span class="u1l6-chk">Check: ${T(`${nt(d.P, 0)}(${fx(1 + Number(pct) / 100, 4)})^{${d.n}}\\approx${nt(chk, 0)}`)} ✓</span>`);
    const showP = async (c, p) => { p.style.opacity = 1; await pop(c, p, 320); await show(c, p.label); };
    return [
      { cap: `Set up the equation: ${T(`P(1+i)^n=A`)} with ${T(`P=${nt(d.P, 0)}`)}, ${T(`A=${nt(d.A, 0)}`)}, ${T(`n=${d.n}`)}.`, run: (c) => show(c, e1) },
      { cap: `Divide both sides by ${nh(d.P, 0)}: the growth factor, to the power ${d.n}, gives ${T(qS)}.`,
        run: async (c) => { await show(c, e2); await show(c, mIn); fw.style.opacity = 1; await drawIn(fw, 400, c); await show(c, fwL); await show(c, mOut); await show(c, NL.el); await showP(c, tgt); } },
      { cap: `Guess ${fx(d.tries[0] * 100, 0)}%: ${T(`${fx(1 + d.tries[0], 2, true)}^{${d.n}}\\approx${fx(tv[0], 3)}`)}. <b>Too small.</b>`, run: (c) => showP(c, tp[0]) },
      { cap: `Guess ${fx(d.tries[1] * 100, 0)}%: ${T(`${fx(1 + d.tries[1], 2, true)}^{${d.n}}\\approx${fx(tv[1], 3)}`)}. <b>Too big.</b> The rate is between ${fx(d.tries[0] * 100, 0)}% and ${fx(d.tries[1] * 100, 0)}%.`, run: (c) => showP(c, tp[1]) },
      { cap: `No more guessing: the <b>${d.n}th root</b> undoes the power ${d.n}. ${T(`1+i=\\sqrt[${d.n}]{${qS}}\\approx${fx(g, 4)}`)}.`,
        run: async (c) => { bk.style.opacity = 1; await drawIn(bk, 600, c); await show(c, bkL); mIn.innerHTML = T(fx(g, 4)); await pulse(c, mIn, 1.1); await show(c, e3); } },
      { cap: `${T(`i\\approx${fx(i, 4)}`)}: about <b>${pct}% per year</b>. Check: ${T(`${nt(d.P, 0)}(${fx(1 + Number(pct) / 100, 4)})^{${d.n}}\\approx${nt(chk, 0)}`)}, close to ${nh(d.A, 0)} ✓`, run: (c) => show(c, e4) }
    ];
  }
};

/* =============================== explainer: hunt for n with a table =============================== */
const HN = {
  filt: { label: 'Example 7 check', f: (n) => 500 * Math.pow(0.7, n), n0: 0, n1: 9, tgt: 40, below: true, rule: '500(0.7)^n', nw: 'passes', pre: '', u: ' mg', d: 2,
    ask: 'Example 7: 500 mg, each pass removes 30%. How many passes to get below 40 mg?', tl: '40 mg' },
  tractor: { label: 'Example 8(c) check', f: (n) => 140400 * Math.pow(0.91, n - 1), n0: 1, n1: 9, tgt: 80000, below: true, rule: '140\\,400(0.91)^{n-1}', nw: 'years', pre: '$', u: '', d: 0,
    ask: 'Example 8(c): after how many years is the tractor first worth less than $80 000?', tl: '$80 000' },
  dbl: { label: '$1 000 at 7%: double?', f: (n) => 1000 * Math.pow(1.07, n), n0: 0, n1: 12, tgt: 2000, below: false, rule: '1\\,000(1.07)^n', nw: 'years', pre: '$', u: '', d: 2,
    ask: '$1 000 at 7% compounded annually. After how many full years has it doubled?', tl: '$2 000' }
};
const hunt = {
  title: 'Try values of n until it passes the target',
  height: 480, minW: 900,
  choices: Object.keys(HN).map((k) => ({ v: k, label: HN[k].label })),
  ask: (v) => HN[v].ask,
  make(stage, v, ex) {
    const d = HN[v], ns = []; for (let n = d.n0; n <= d.n1; n++) ns.push(n);
    const vals = ns.map(d.f), pass = (y) => (d.below ? y < d.tgt : y >= d.tgt), ansN = ns.find((n, k) => pass(vals[k])), ai = ns.indexOf(ansN);
    const rowH = Math.min(38, Math.floor(420 / (ns.length + 1))), BX = 280, BWmax = ex.W - BX - 180, mx = Math.max(...vals, d.tgt) * 1.04, sc = BWmax / mx;
    div(stage, 'u1l6-hh', T('n'), 20, 6, 60); div(stage, 'u1l6-hh', T(d.rule), 84, 6, 180);
    const tx = BX + d.tgt * sc, tline = hide(div(stage, 'u1l6-tline', `<span>target ${d.tl}</span>`, tx, 4, 0, 40 + rowH * ns.length));
    const rows = ns.map((n, k) => {
      const y = 40 + k * rowH, r = hide(div(stage, 'u1l6-hr', '', 10, y, ex.W - 20, rowH - 4));
      div(r, 'u1l6-hn', String(n), 10, 0, 60, rowH - 4);
      div(r, 'u1l6-hv', d.pre + nh(vals[k], d.d, true) + d.u, 74, 0, 180, rowH - 4);
      div(r, 'u1l6-hb', '', BX - 10, 4, vals[k] * sc, rowH - 12);
      return r;
    });
    const sp = stamp(stage, `${ansN} ${d.nw}`, { x: ex.W - 88, y: 40 + ai * rowH + rowH / 2 }); hide(sp);
    const before = vals[ai - 1], at = vals[ai], side = d.below ? 'above' : 'below';
    return [
      { cap: `Rule: after ${T('n')} ${d.nw}, the value is ${T(d.rule)}. Target: <b>${d.below ? 'below' : 'at least'} ${d.tl}</b>.`, run: (c) => show(c, tline) },
      { cap: `Try values of ${T('n')} one at a time, starting at ${T(String(d.n0))}.`, run: async (c) => { for (let k = 0; k < ai - 1; k++) { await show(c, rows[k]); } } },
      { cap: `${T(`n=${ansN - 1}`)}: ${d.pre}${nh(before, d.d, true)}${d.u}. Still ${side} the target.`, run: async (c) => { rows[ai - 1].classList.add('u1l6-hr-near'); await show(c, rows[ai - 1]); } },
      { cap: `${T(`n=${ansN}`)}: ${d.pre}${nh(at, d.d, true)}${d.u}. The <b>first</b> one ${d.below ? 'below' : 'past'} the target!`, run: async (c) => { rows[ai].classList.add('u1l6-hr-hit'); await show(c, rows[ai]); } },
      { cap: `Check the one just before: ${T(`n=${ansN - 1}`)} is not enough. Answer: <b>${ansN} ${d.nw}</b>.`, run: async (c) => { for (let k = ai + 1; k < rows.length; k++) { rows[k].classList.add('u1l6-hr-after'); rows[k].style.opacity = 1; } sp.style.opacity = 1; await stampIn(c, sp); } }
    ];
  }
};

/* =============================== explainer: two rates =============================== */
const TR = {
  tractor: { label: 'Example 8 check', P: 180000, r1: 0.78, r: 0.91, p1: 22, p: 9, N: 7, ask: 6, thing: 'tractor', d: 0,
    q: 'Example 8: a $180 000 tractor loses 22% in year 1, then 9% a year. Value after 6 years?' },
  phone: { label: 'A phone: −35%, then −12%', P: 1200, r1: 0.65, r: 0.88, p1: 35, p: 12, N: 6, ask: 4, thing: 'phone', d: 2,
    q: 'A $1 200 phone loses 35% of its value in year 1, then 12% a year. Value after 4 years?' }
};
const twoRates = {
  title: 'A big first drop, then a smaller rate',
  height: 450, minW: 900,
  choices: Object.keys(TR).map((k) => ({ v: k, label: TR[k].label })),
  ask: (v) => TR[v].q,
  make(stage, v, ex) {
    const d = TR[v], vals = [d.P]; for (let k = 1; k <= d.N; k++) vals.push(k === 1 ? d.P * d.r1 : vals[k - 1] * d.r);
    const wrong = d.P * Math.pow(d.r, d.ask), base = 360, sc = 270 / d.P, sp = (ex.W - 60) / (d.N + 1), bw = sp * 0.56, X0 = 30 + (sp - bw) / 2;
    const bx = (k) => X0 + k * sp, svg = svgEl('svg', { class: 'u1l6-ov', width: ex.W, height: 450 }, stage);
    const bars = vals.map((val, k) => {
      const g = hide(div(stage, 'u1l6-tg', '', bx(k), 0, bw, 450));
      div(g, 'u1l6-tbar' + (k === d.ask ? ' u1l6-tbar-ask' : ''), '', 0, base - val * sc, bw, val * sc);
      div(g, 'u1l6-tval', `$${nh(val, d.d, d.d > 0)}`, -24, base - val * sc - 28, bw + 48);
      div(g, 'u1l6-tyr', k ? `${k} yr` : 'new', 0, base + 6, bw);
      return g;
    });
    const tl = vals.map((x, k) => (k ? hide(div(stage, 'u1l6-tt', T(k === 1 ? cT('t_1') : `t_{${k}}`), bx(k), base + 36, bw)) : null));
    const hops = vals.slice(1).map((x, j) => {
      const k = j + 1, x1 = bx(k - 1) + bw * 0.5, x2 = bx(k) + bw * 0.5, y1 = base - vals[k - 1] * sc - 40, y2 = base - vals[k] * sc - 40, color = k === 1 ? DN : RC;
      const g = svgEl('g', { class: 'bk-curve' }, svg); g.style.color = color;
      svgEl('path', { class: 'bk-stroke', d: `M${x1 + 12} ${y1} Q${(x1 + x2) / 2} ${Math.min(y1, y2) - 30} ${x2 - 6} ${y2 - 4}`, fill: 'none', stroke: color, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
      const lab = div(stage, 'u1l6-hoplab u1l6-hl-sm', T(`\\times${k === 1 ? cD(fx(d.r1, 2)) : cR(fx(d.r, 2))}`), (x1 + x2) / 2, Math.min(y1, y2) - 34); lab.style.translate = '-50% -50%';
      hide(g); hide(lab); return { g, lab };
    });
    const ghost = hide(div(stage, 'u1l6-ghost', `<span class="u1l6-ghl">$${nh(wrong, d.d, d.d > 0)} ✗</span>`, bx(d.ask) - 4, base - wrong * sc, bw + 8, wrong * sc));
    const hopIn = async (c, k) => { const H = hops[k - 1]; H.g.style.opacity = 1; await drawIn(H.g, 300, c); await show(c, H.lab); await show(c, bars[k]); };
    const v1 = vals[1], vA = vals[d.ask], keep1 = 100 - d.p1, keep = 100 - d.p;
    return [
      { cap: `Bought for <b>$${nh(d.P, 0)}</b>: year 0.`, run: (c) => show(c, bars[0]) },
      { cap: `First year: loses ${d.p1}%, keeps ${keep1}%. ${T(`${nt(d.P, 0)}(${cD(fx(d.r1, 2))})=${nt(v1, d.d)}`)}.`, run: (c) => hopIn(c, 1) },
      { cap: `After that it loses only ${d.p}% a year: keeps ${keep}%, so ×${T(cR(fx(d.r, 2)))} each year.`, run: async (c) => { for (let k = 2; k <= d.N; k++) await hopIn(c, k); } },
      { cap: `The steady part starts <b>after year 1</b>: ${T(`${cT('t_1')}=${nt(v1, d.d)}`)}, ${T(cR(`r=${fx(d.r, 2)}`))}. Now “after ${T('n')} years” is ${T('t_n')}.`, run: async (c) => { for (const e of tl) if (e) await fadeIn(c, e, 160); } },
      { cap: `After ${d.ask} years: ${T(`t_{${d.ask}}=${nt(v1, d.d)}(${fx(d.r, 2)})^{${d.ask - 1}}\\approx${nt(vA, d.d, d.d > 0)}`)}.`, run: (c) => pulse(c, bars[d.ask].firstChild, 1.04) },
      { cap: `<b>Watch out:</b> ${T(`${nt(d.P, 0)}(${fx(d.r, 2)})^{${d.ask}}\\approx${nt(wrong, d.d, d.d > 0)}`)} uses ${d.p}% in the first year too. Too high!`, run: async (c) => { hops.forEach((H) => { H.g.style.opacity = 0.18; H.lab.style.opacity = 0.18; }); await show(c, ghost); } }
    ];
  }
};

/* =============================== Stand Up Break =============================== */
const t$ = (v, d = 2) => '\\$' + nt(v, d, d > 0);
standup('u1l6', {
  intro: 'At your whiteboard: find the growth factor, decide where the sequence starts, then multiply.',
  levels: {
    BEG: (r) => { // growth factor, then one and two periods
      const up = r.chance(0.5), p = r.pick(up ? [3, 4, 5, 8, 12, 15] : [5, 10, 15, 20, 25, 30]), P = r.pick([800, 1200, 2400, 5000, 640]);
      const rr = up ? 1 + p / 100 : 1 - p / 100, thing = up ? r.pick(['A town of', 'A fish population of', 'A collection of']) : r.pick(['A herd of', 'A stock of', 'A pile of']);
      return { text: `${thing} <b>${nh(P, 0)}</b> ${up ? 'grows' : 'shrinks'} by <b>${p}%</b> each year. State the growth factor, then find the amount after 1 year and after 2 years.`, q: '',
        a: [`r=1${up ? '+' : '-'}${fx(p / 100, 2)}=${fx(rr, 2)}`, `\\text{after 1 year: }${nt(P, 0)}(${fx(rr, 2)})=${nt(P * rr, 2)}`, `\\text{after 2 years: }${nt(P, 0)}(${fx(rr, 2)})^2=${nt(P * rr * rr, 2)}`] };
    },
    PRG: (r) => {
      if (r.chance(0.5)) { // ball: where does it start?
        const H = r.pick([10, 12, 20, 24, 30]), p = r.pick([50, 70, 75, 80]), k = r.int(3, 6), rr = p / 100, v = H * Math.pow(rr, k);
        return { text: `A ball is dropped from <b>${H} m</b>. Each bounce reaches <b>${p}%</b> of the one before. Find the height of bounce number <b>${k}</b>, to the nearest centimetre. Which term is it if ${T(`t_1=${H}`)}?`, q: '',
          a: [`t_1=${H}\\text{ is the drop, so bounce }${k}\\text{ is }t_{${k + 1}}`, `t_{${k + 1}}=${H}(${fx(rr, 2)})^{${k}}\\approx${fx(v, 2, true)}\\text{ m}`] };
      }
      const P = r.pick([2000, 3500, 4800, 7500]), i = r.pick([2.5, 3.2, 4, 4.5, 5.25]), n = r.int(4, 10), A = P * Math.pow(1 + i / 100, n);
      return { text: `<b>$${nh(P, 0)}</b> is invested at <b>${i}%</b> per year, compounded annually. Find its value after <b>${n} years</b>.`, q: '',
        a: [`r=1+${fx(i / 100, 4)}=${fx(1 + i / 100, 4)}`, `A=${nt(P, 0)}(${fx(1 + i / 100, 4)})^{${n}}\\approx${t$(A)}`] };
    },
    MAS: (r) => {
      if (r.chance(0.5)) { // half-life with a unit change
        const hl = r.pick([3, 4, 6, 8, 12]), D = r.pick([1, 2, 3].filter((x) => (24 * x) / hl <= 12)), A = r.pick([80, 160, 200, 320, 640]), n = (24 * D) / hl, left = A * Math.pow(0.5, n);
        return { text: `A sample of <b>${A} mg</b> has a half-life of <b>${hl} hours</b>. How much is left after <b>${D} day${D > 1 ? 's' : ''}</b>?`, q: '',
          a: [`${D}\\text{ day${D > 1 ? 's' : ''}}=${24 * D}\\text{ h},\\quad n=\\dfrac{${24 * D}}{${hl}}=${n}`, `${A}\\left(\\tfrac{1}{2}\\right)^{${n}}=${fx(left, 4)}\\text{ mg}`] };
      }
      const P = r.pick([1500, 2500, 4000]), i = r.pick([3, 4, 6, 8, 9]), T2 = r.pick([1.5, 2]) * P; let n = 0; while (P * Math.pow(1 + i / 100, n) < T2) n++;
      return { text: `<b>$${nh(P, 0)}</b> is invested at <b>${i}%</b> per year, compounded annually. After how many full years is it first worth at least <b>$${nh(T2, 0)}</b>? Use a table of values.`, q: '',
        a: [`${nt(P, 0)}(${fx(1 + i / 100, 2)})^{${n - 1}}\\approx${t$(P * Math.pow(1 + i / 100, n - 1))}\\ \\text{(not yet)}`, `${nt(P, 0)}(${fx(1 + i / 100, 2)})^{${n}}\\approx${t$(P * Math.pow(1 + i / 100, n))}`, `\\text{${n} years}`] };
    }
  }
});

/* =============================== mount =============================== */
mountPond();
export const explainers = mountExplainers({ factor, buildSeq, startShift, periods, compound, rateRoot, hunt, twoRates });
export const _test = { fx, nt, nh, FA, BS, SS, PD, CI, RR, HN, TR };
