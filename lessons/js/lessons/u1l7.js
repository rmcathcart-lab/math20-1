/* Math 20-1 · Unit 1 · Lesson 7 — Geometric Series.
 * Warm-up (The Penny Jar: a 30-day calendar of doubling drops and the running jar total), and the explainers:
 *   shift (STAR: S_n and rS_n as two rows one place apart, matching terms cancel, rS_n − S_n = t_1r^n − t_1, factor, divide;
 *     general 6-term row, Example 1 check, 2 + 6 + 18 + 54, the penny jar),
 *   ghost (the second form: one more hop past the last term is rt_n = t_1r^n; Example 1 and Example 3 checks),
 *   whichOne (flowchart: r = 1? know n? know the last term? Example 2(a), Example 3(b), a constant series),
 *   findSum (terms → t_1 and r → substitute → a calculator screen; Example 2 checks, brackets for a negative r),
 *   findN (isolate the power, then climb a table of powers; Example 4 checks),
 *   findR (hop back to t_1; S_3 → a quadratic with two r's; a table of r values; Example 5 checks),
 *   stairs (t_n = S_n − S_(n−1): stacked bars, each sum is the one before plus one new block; Example 6 check),
 *   ball (bounce path, falls and rises counted separately; Example 7 check and a demo),
 *   phone (a phone tree level by level with a running total; Example 8 check and a demo).
 * Colours (Unit 1): first term t_1 teal, common ratio r amber; sums blue, rS_n purple, last term purple ring, falls blue,
 * rises green, cancelled terms grey. */
import {
  h, tex, add, box, ValueTable, Flowchart, stamp, stampIn, mountExplainers, pop, fadeIn, appear, sleep, tween,
  svgEl, liveCtx, pulse, drawIn, arrowHead, place, COLORS, fmt
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const TEAL = '#0f7a80', AMB = COLORS.amber, BLUE = COLORS.blue, PUR = COLORS.purple, GRN = COLORS.green, RED = COLORS.red, GRAY = COLORS.gray, INK = COLORS.ink;
const cT = (s) => `\\textcolor{${TEAL}}{${s}}`, cA = (s) => `\\textcolor{${AMB}}{${s}}`, cB = (s) => `\\textcolor{${BLUE}}{${s}}`;
const cP = (s) => `\\textcolor{${PUR}}{${s}}`, cG = (s) => `\\textcolor{${GRN}}{${s}}`, cX = (s) => `\\textcolor{${RED}}{${s}}`;
/** a number as TeX: thin spaces in thousands, real minus */
const nt = (v) => {
  if (typeof v === 'string') return v;
  if (!Number.isInteger(v)) return String(parseFloat(v.toFixed(6)));
  const s = String(Math.abs(v)), g = s.length >= 5 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : s;
  return (v < 0 ? '-' : '') + g;
};
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const show = (c, el, ms = 320) => fadeIn(c, el, ms);
/** an absolutely placed div on the stage */
const put = (host, cls, html, x, y, w, hh) => { const d = h('div', 'u1l7-abs ' + (cls || ''), html); box(d, w, hh); return add(host, d, x, y); };
/** centred text in a box of width w whose centre is cx */
const putC = (host, cls, html, cx, y, w) => put(host, 'u1l7-c ' + (cls || ''), html, cx - w / 2, y, w);
const svgLayer = (stage, ex, hh) => { const s = svgEl('svg', { class: 'u1l7-svg', width: ex.W, height: hh, viewBox: `0 0 ${ex.W} ${hh}` }); s.style.width = ex.W + 'px'; s.style.height = hh + 'px'; add(stage, s, 0, 0); return s; };
const ftxt = (v) => (Math.abs(v) >= 10000 ? fmt(v) : String(v));
const geoS = (t1, r, n) => (r === 1 ? n * t1 : (t1 * (Math.pow(r, n) - 1)) / (r - 1));

/* ---------------------------------------------------------------------------------------------------------------
 * A row of term tiles with ×r hops above (used by ghost, findSum, findR)
 * ------------------------------------------------------------------------------------------------------------- */
class TermRow {
  /** terms: TeX strings ('\\cdots' for a gap); o: { x, y, w (total width), tw (tile width), th, svg, gap } */
  constructor(stage, svg, terms, o) {
    this.stage = stage; this.svg = svg; this.terms = terms; this.o = o;
    const n = terms.length, step = o.step || Math.min(150, o.w / n), tw = o.tw || Math.min(122, step - 18), th = o.th || 58;
    this.step = step; this.tw = tw; this.th = th;
    this.x0 = o.x + (o.w - step * n) / 2 + step / 2;
    this.cx = terms.map((_, i) => this.x0 + i * step);
    this.tiles = terms.map((s, i) => {
      const gap = s === '\\cdots';
      const d = put(stage, 'u1l7-tile' + (gap ? ' u1l7-gap' : '') + (o.cls ? ' ' + o.cls : ''), T(s), this.cx[i] - tw / 2, o.y, tw, th);
      return d;
    });
    this.hops = [];
  }
  /** the hop arc from tile i to tile j (above the row) with a label; returns { path, lab } (hidden) */
  hop(i, j, label, o = {}) {
    const a = this.cx[i], b = this.cx[j], y = this.o.y - 4, hgt = o.hgt || 34, col = o.color || AMB, sg = b > a ? 1 : -1;
    const attrs = { d: `M${a + 10 * sg} ${y} Q${(a + b) / 2} ${y - hgt * 1.6} ${b - 10 * sg} ${y}`, fill: 'none', stroke: col, 'stroke-width': 3, class: 'bk-stroke' };
    if (o.dash) attrs['stroke-dasharray'] = '6 6';
    const p = svgEl('path', attrs, this.svg);
    const head = arrowHead(this.svg, b - 10 * sg, y, 0.45 * sg, 1, { color: col, width: 3 });
    const lab = putC(this.stage, 'u1l7-hoplab' + (o.cls ? ' ' + o.cls : ''), T(label), (a + b) / 2, y - hgt * 0.8 - 40, 150);
    const g = { path: p, head, lab };
    hide(p); hide(head); hide(lab);
    this.hops.push(g); return g;
  }
  async drawHop(c, g, ms = 380) { g.path.style.opacity = 1; await drawIn(g.path, ms, c); g.head.style.opacity = 1; await pop(c, g.lab, 260); }
}

/* ====================================================================================================
 * Warm-up: The Penny Jar (30 days of doubling)
 * ==================================================================================================== */
const money = (cents, full) => {
  if (cents < 100) return cents + '¢';
  const d = cents / 100;
  if (full) return '$' + d.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, '\u202f');
  if (d < 1000) return '$' + d.toFixed(2);
  if (d < 1e6) return '$' + Math.round(d).toLocaleString('en-CA').replace(/,/g, '\u202f');
  return '$' + (d / 1e6).toFixed(2) + ' M';
};
function mountJar() {
  const cal = document.getElementById('u1l7-cal'); if (!cal) return;
  const cells = [];
  for (let d = 1; d <= 30; d++) {
    const cell = h('div', 'u1l7-day', `<div class="u1l7-dn">Day ${d}</div><div class="u1l7-dv"></div>`);
    cal.appendChild(cell); cells.push(cell);
  }
  const jv = document.getElementById('u1l7-jarv'), jar = document.getElementById('u1l7-jar');
  const bN = document.getElementById('u1l7-next'), b30 = document.getElementById('u1l7-d30');
  let day = 0, busy = false;
  const total = () => Math.pow(2, day) - 1;
  const paint = () => {
    cells.forEach((c, i) => {
      const on = i < day; c.classList.toggle('u1l7-on', on); c.classList.toggle('u1l7-new', i === day - 1);
      c.querySelector('.u1l7-dv').textContent = on ? money(Math.pow(2, i)) : '';
    });
    jv.textContent = money(total(), true);
    bN.disabled = b30.disabled = day >= 30;
  };
  bN.addEventListener('click', async () => {
    if (busy || day >= 30) return; busy = true; day++; paint();
    const c = liveCtx(); await pop(c, cells[day - 1].querySelector('.u1l7-dv'), 320); pulse(c, jar, 1.12, 380); busy = false;
  });
  b30.addEventListener('click', async () => {
    if (busy) return; busy = true; const c = liveCtx();
    while (day < 30) { day++; paint(); await sleep(c, 70); }
    await pulse(c, jar, 1.18, 460); busy = false;
  });
  document.getElementById('u1l7-wreset').addEventListener('click', () => { if (!busy) { day = 0; paint(); } });
  paint();
}

/* =============================== explainer: shift and subtract (STAR) =============================== */
const SH = {
  gen: { label: `Any ${T('t_1,\\ r')} (6 terms)`, sym: true, n: 6 },
  ex1: { label: 'Example 1 check', t1: 5, r: 2, n: 5 },
  two: { label: T('2+6+18+54'), t1: 2, r: 3, n: 4 },
  jar: { label: 'Warm-up: the penny jar', t1: 1, r: 2, n: 5 }
};
/** TeX of t_1 r^k (symbolic) */
const symT = (k) => cT('t_1') + (k === 0 ? '' : cA(k === 1 ? 'r' : `r^{${k}}`));
const shift = {
  title: 'Multiply by r, shift, subtract: where the formula comes from',
  height: 470,
  capH: 92,
  choices: Object.keys(SH).map((k) => ({ v: k, label: SH[k].label })),
  ask: (k) => {
    const d = SH[k];
    if (d.sym) return `Add ${T('S_6=t_1+t_1r+t_1r^2+t_1r^3+t_1r^4+t_1r^5')} without adding term by term.`;
    const terms = Array.from({ length: d.n }, (_, i) => d.t1 * Math.pow(d.r, i));
    return `Find ${T(`S_${d.n}=${terms.map(nt).join('+')}`)} by shifting and subtracting.`;
  },
  make(stage, k, ex) {
    const d = SH[k], n = d.n, sym = !!d.sym, W = ex.W;
    const svg = svgLayer(stage, ex, 470);
    const labW = 200, cols = n + 1, colW = Math.min(118, (W - labW - 30) / cols), x0 = labW + 14 + (W - labW - 30 - colW * cols) / 2;
    const cxOf = (i) => x0 + colW * (i + 0.5), tw = colW - 30, th = 54;
    const R1 = 26, R2 = 112, LY = 184, R3 = 200;
    const rr = sym ? 'r' : String(d.r);
    const Sn = `S_${n}`;
    const top = sym ? Array.from({ length: n }, (_, i) => symT(i)) : Array.from({ length: n }, (_, i) => nt(d.t1 * Math.pow(d.r, i)));
    const bot = sym ? Array.from({ length: n }, (_, i) => symT(i + 1)) : Array.from({ length: n }, (_, i) => nt(d.t1 * Math.pow(d.r, i + 1)));
    const lastV = sym ? symT(n) : nt(d.t1 * Math.pow(d.r, n)), firstV = sym ? cT('t_1') : nt(d.t1);
    const diff = sym ? null : d.t1 * Math.pow(d.r, n) - d.t1, S = sym ? null : geoS(d.t1, d.r, n);
    // labels
    const L1 = put(stage, 'u1l7-rowlab', T(`${cB(Sn)}=`), 0, R1 + 6, labW);
    const L2 = put(stage, 'u1l7-rowlab', T(`${cP((sym ? cA('r') : cA(rr)) + Sn)}=`), 0, R2 + 6, labW); hide(L2);
    // row 1
    const t1s = top.map((s, i) => put(stage, 'u1l7-tile u1l7-t-top' + (i === 0 ? ' u1l7-first' : ''), T(s), cxOf(i) - tw / 2, R1, tw, th));
    const p1 = top.slice(1).map((_, i) => putC(stage, 'u1l7-plus', '+', x0 + colW * (i + 1), R1 + 10, 30));
    // row 2 (in its own layer so it can slide one place right)
    const row2 = put(stage, 'u1l7-row2', '', 0, 0, W - colW - 4, 300);
    const t2s = bot.map((s, i) => put(row2, 'u1l7-tile u1l7-t-bot' + (i === n - 1 ? ' u1l7-lastb' : ''), T(s), cxOf(i) - tw / 2, R2, tw, th));
    const p2 = bot.slice(1).map((_, i) => putC(row2, 'u1l7-plus', '+', x0 + colW * (i + 1), R2 + 10, 30));
    t2s.forEach(hide); p2.forEach(hide);
    const arrows = top.map((_, i) => { const a = putC(stage, 'u1l7-timesr', T(`\\times ${cA(rr)}`), cxOf(i), R1 + th + 2, 80); hide(a); return a; });
    // column boxes for the matching pairs (columns 1 … n−1)
    const pairs = [];
    for (let i = 1; i < n; i++) { const b = put(stage, 'u1l7-pairbox', '', cxOf(i) - tw / 2 - 7, R1 - 7, tw + 14, R2 + th - R1 + 14); hide(b); pairs.push(b); }
    const svgTop = svgLayer(stage, ex, 470), slashes = [];
    for (let i = 1; i < n; i++) {
      const g = svgEl('g', {}, svgTop);
      for (const yy of [R1, R2]) svgEl('line', { x1: cxOf(i) - tw / 2 + 6, y1: yy + th - 8, x2: cxOf(i) + tw / 2 - 6, y2: yy + 8, stroke: RED, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
      hide(g); slashes.push(g);
    }
    // subtraction line + result row
    const line = svgEl('line', { x1: 24, y1: LY, x2: W - 20, y2: LY, stroke: INK, 'stroke-width': 3, class: 'bk-stroke' }, svg); hide(line);
    const L3 = put(stage, 'u1l7-rowlab', T(`${cP((sym ? cA('r') : cA(rr)) + Sn)}-${cB(Sn)}=`), 0, R3 + 6, labW); hide(L3);
    const res0 = put(stage, 'u1l7-tile u1l7-res u1l7-first', T('-' + firstV), cxOf(0) - tw / 2, R3, tw, th); hide(res0);
    const res1 = put(stage, 'u1l7-tile u1l7-res u1l7-lastb', T('+' + lastV), cxOf(n) - tw / 2, R3, tw, th); hide(res1);
    const zeroes = [];
    for (let i = 1; i < n; i++) { const z = putC(stage, 'u1l7-zero', T('0'), cxOf(i), R3 + 12, 50); hide(z); zeroes.push(z); }
    // algebra
    const A1 = putC(stage, 'u1l7-alg', '', W / 2, 286, W - 40); hide(A1);
    const A2 = putC(stage, 'u1l7-alg u1l7-alg-big', '', W / 2, 344, W - 40); hide(A2);
    const A3 = putC(stage, 'u1l7-alg u1l7-alg-soft', '', W / 2, 434, W - 40); hide(A3);
    const steps = [];
    steps.push({
      cap: sym ? `Multiply <b>every term</b> by ${T(cA('r'))}. Each term becomes the <b>next</b> term: ${T(`${cT('t_1')}\\to ${cT('t_1')}${cA('r')}`)}, ${T(`${cT('t_1')}${cA('r')}\\to ${cT('t_1')}${cA('r^2')}`)}, …`
        : `Multiply <b>every term</b> by ${T(cA(rr))}. Each term becomes the <b>next</b> term: ${T(`${top[0]}\\to ${bot[0]}`)}, ${T(`${top[1]}\\to ${bot[1]}`)}, …`,
      run: async (c) => {
        await show(c, L2);
        for (let i = 0; i < n; i++) { await show(c, arrows[i], 160); await pop(c, t2s[i], 220); if (i) await appear(c, p2[i - 1], 120); }
      }
    });
    steps.push({
      cap: `The new row is the old row with the first term gone and one new term at the end. <b>Slide it one place right</b> so equal terms line up.`,
      run: async (c) => {
        arrows.forEach(hide);
        await tween(c, 700, (t) => { row2.style.transform = `translateX(${(colW * t).toFixed(1)}px)`; });
        row2.style.transform = `translateX(${colW}px)`;
      }
    });
    steps.push({
      cap: `Now every column has the <b>same term twice</b>, except the first term ${T(firstV)} on top and the last term ${T(lastV)} on the bottom.`,
      run: async (c) => { for (const b of pairs) await appear(c, b, 160); }
    });
    steps.push({
      cap: `<b>Subtract</b> the top row from the bottom row: ${T(`${cP((sym ? cA('r') : cA(rr)) + Sn)}-${cB(Sn)}`)}. Each matching pair cancels to ${T('0')}.`,
      run: async (c) => {
        await show(c, L3); line.style.opacity = 1; await drawIn(line, 500, c);
        for (let i = 0; i < n - 1; i++) { await appear(c, slashes[i], 150); t1s[i + 1].classList.add('u1l7-gone'); t2s[i].classList.add('u1l7-gone'); await show(c, zeroes[i], 140); }
        p1.forEach((p) => p.classList.add('u1l7-gone')); p2.forEach((p) => p.classList.add('u1l7-gone')); pairs.forEach(hide);
      }
    });
    steps.push({
      cap: sym ? `Only two terms survive: ${T(cT('t_1') + cA('r^6'))} from the bottom and ${T('-' + cT('t_1'))} from the top. With ${T('n')} terms the bottom row ends at ${T(cT('t_1') + cA('r^n'))}: ${T(`rS_n-S_n=t_1r^n-t_1`)}.`
        : `Only two terms survive: ${T(lastV)} from the bottom and ${T('-' + firstV)} from the top. ${T(`${rr}${Sn}-${Sn}=${lastV}-${firstV}=${nt(diff)}`)}.`,
      run: async (c) => {
        zeroes.forEach((z) => z.classList.add('u1l7-gone'));
        await pop(c, res0, 300); await pop(c, res1, 300);
        if (!sym) { A1.innerHTML = T(`${rr}${Sn}-${Sn}=${lastV}-${firstV}=${nt(diff)}`); await show(c, A1); }
      }
    });
    if (sym) {
      steps.push({
        cap: `<b>Factor</b> both sides: ${T('S_n')} on the left, ${T(cT('t_1'))} on the right.`,
        run: async (c) => { A1.innerHTML = T(`rS_n-S_n=t_1r^n-t_1\\quad\\Longrightarrow\\quad S_n(r-1)=t_1(r^n-1)`); await show(c, A1); }
      });
      steps.push({
        cap: `<b>Divide</b> by ${T('r-1')} (so ${T('r\\ne 1')}). That is the sum formula.`,
        run: async (c) => { A2.innerHTML = `<span class="u1l7-boxed">${T(`S_n=\\dfrac{${cT('t_1')}(${cA('r')}^n-1)}{${cA('r')}-1}`)}</span>`; await pop(c, A2, 420); }
      });
      steps.push({
        cap: `And ${T(`t_1r^n=r(t_1r^{n-1})=r\\,t_n`)}: the survivor is ${T('r')} times the <b>last term</b>. Swap it in for the second form.`,
        run: async (c) => {
          A2.innerHTML = `<span class="u1l7-boxed">${T(`S_n=\\dfrac{${cT('t_1')}(${cA('r')}^n-1)}{${cA('r')}-1}`)}</span><span class="u1l7-ortxt">or</span><span class="u1l7-boxed">${T(`S_n=\\dfrac{${cA('r')}${cP('t_n')}-${cT('t_1')}}{${cA('r')}-1}`)}</span>`;
          await pulse(c, A2, 1.04, 400);
          A3.innerHTML = `${T(cP('t_n'))} is the last term, ${T(`t_1r^{n-1}`)}.`; await show(c, A3);
        }
      });
    } else {
      const rm1 = d.r - 1;
      steps.push({
        cap: rm1 === 1 ? `The left side is ${T(`${rr}${Sn}-${Sn}=${Sn}(${rr}-1)=1\\cdot ${Sn}`)}. So the sum is just ${T(nt(S))}.`
          : `The left side is ${T(`${rr}${Sn}-${Sn}=${Sn}(${rr}-1)=${rm1}${Sn}`)}. Divide by ${T(String(rm1))}: ${T(`${Sn}=${nt(S)}`)}.`,
        run: async (c) => { A2.innerHTML = `${T(`${Sn}(${rr}-1)=${nt(diff)}`)}<span class="u1l7-ortxt">so</span><span class="u1l7-boxed">${T(`${Sn}=${rm1 === 1 ? '' : `\\dfrac{${nt(diff)}}{${rm1}}=`}${nt(S)}`)}</span>`; await pop(c, A2, 420); }
      });
      if (k === 'jar') {
        steps.push({
          cap: `That is the warm-up pattern: the jar is <b>1¢ less than the next drop</b>. After 30 days: ${T('2S-S=2^{30}-1')}, about <b>$10.7 million</b>.`,
          run: async (c) => { A3.innerHTML = `30 days: ${T(`S_{30}=2^{30}-1=1\\,073\\,741\\,823`)}¢ ${T('\\approx')} $10.7 million`; await show(c, A3); }
        });
      } else {
        steps.push({
          cap: `Check with the formula: ${T(`\\dfrac{${nt(d.t1)}(${rr}^{${n}}-1)}{${rr}-1}=${nt(S)}`)} ✓`,
          run: async (c) => { A3.innerHTML = `Formula: ${T(`\\tfrac{${nt(d.t1)}(${rr}^{${n}}-1)}{${rr}-1}=${nt(S)}`)} ✓ &nbsp; Adding: ${T(`${top.join('+')}=${nt(S)}`)} ✓`; await show(c, A3); }
        });
      }
    }
    return steps;
  }
};

/* =============================== explainer: the second form (one hop past the end) =============================== */
const GH = {
  ex1: { label: 'Example 1 check', terms: ['5', '10', '20', '40', '80'], r: '2', rDiv: '10\\div 5=2', t1: '5', tn: '80', ghost: '160', ghostCalc: '2(80)=160',
    sub: '\\dfrac{2(80)-5}{2-1}', mid: '\\dfrac{155}{1}', ans: '155', all: '5+10+20+40+80', n: 5 },
  ex3a: { label: 'Example 3(a) check', terms: ['3', '12', '48', '\\cdots', '12\\,288'], r: '4', rDiv: '12\\div 3=4', t1: '3', tn: '12\\,288', ghost: '49\\,152', ghostCalc: '4(12\\,288)=49\\,152',
    sub: '\\dfrac{4(12\\,288)-3}{4-1}', mid: '\\dfrac{49\\,149}{3}', ans: '16\\,383', all: '3+12+48+192+768+3072+12\\,288', n: 7 },
  ex3b: { label: 'Example 3(b) check', terms: ['1458', '-486', '162', '\\cdots', '2'], r: '-\\tfrac{1}{3}', rDiv: '-486\\div 1458=-\\tfrac{1}{3}', t1: '1458', tn: '2', ghost: '-\\tfrac{2}{3}', ghostCalc: '-\\tfrac{1}{3}(2)=-\\tfrac{2}{3}',
    sub: '\\dfrac{-\\frac{1}{3}(2)-1458}{-\\frac{1}{3}-1}', mid: '\\dfrac{-\\frac{4376}{3}}{-\\frac{4}{3}}', ans: '1094', all: '1458-486+162-54+18-6+2', n: 7 }
};
const ghost = {
  title: 'The second form: one more hop past the last term',
  height: 450,
  capH: 92,
  choices: Object.keys(GH).map((k) => ({ v: k, label: GH[k].label })),
  ask: (k) => `Find the sum ${T(GH[k].terms.join('+').replace(/\+-/g, '-'))} using the last term.`,
  make(stage, k, ex) {
    const d = GH[k], W = ex.W, svg = svgLayer(stage, ex, 450);
    const R = new TermRow(stage, svg, d.terms.concat([d.ghost]), { x: 20, y: 120, w: W - 40, th: 58 });
    const gi = d.terms.length, gt = R.tiles[gi];
    gt.classList.add('u1l7-ghost'); hide(gt);
    R.tiles[0].classList.add('u1l7-first'); R.tiles[gi - 1].classList.add('u1l7-lastt');
    const hops = [];
    const hl = /^\d+$/.test(d.r) ? `\\times ${d.r}` : `\\times\\left(${d.r}\\right)`;
    for (let i = 0; i < gi - 1; i++) { const gap = d.terms[i] === '\\cdots' || d.terms[i + 1] === '\\cdots'; hops.push(R.hop(i, i + 1, gap ? '\\cdots' : hl, { dash: gap })); }
    const gh = R.hop(gi - 1, gi, hl, { color: PUR, cls: 'u1l7-hopP' });
    const tags = [
      putC(stage, 'u1l7-tag u1l7-tag-t', T(cT('t_1')), R.cx[0], 186, 80),
      putC(stage, 'u1l7-tag u1l7-tag-p', T(cP('t_n')) + ' last', R.cx[gi - 1], 186, 100),
      putC(stage, 'u1l7-tag u1l7-tag-g', T(`${cA('r')}${cP('t_n')}=${cT('t_1')}${cA('r')}^n`), R.cx[gi], 186, 160)
    ];
    tags.forEach(hide);
    const A1 = putC(stage, 'u1l7-alg u1l7-alg-big', '', W / 2, 238, W - 40); hide(A1);
    const A2 = putC(stage, 'u1l7-alg', '', W / 2, 330, W - 40); hide(A2);
    const A3 = putC(stage, 'u1l7-alg u1l7-alg-soft', '', W / 2, 394, W - 40); hide(A3);
    let sAns = null;
    return [
      { cap: `Find ${T(cA('r'))}: divide a term by the one before. ${T(d.rDiv)}, so ${T(`${cA('r')}=${d.r}`)}.`,
        run: async (c) => { for (const g of hops) await R.drawHop(c, g, 300); } },
      { cap: `The first term is ${T(`${cT('t_1')}=${d.t1}`)} and the <b>last term</b> is ${T(`${cP('t_n')}=${d.tn}`)}.`,
        run: async (c) => { await show(c, tags[0]); await show(c, tags[1]); } },
      { cap: `One more hop past the end: ${T(`${cA('r')}${cP('t_n')}=${d.ghostCalc}`)}. That “next” term is ${T('t_1r^n')}, the term that survived the cancelling.`,
        run: async (c) => { await R.drawHop(c, gh, 420); await pop(c, gt, 360); await show(c, tags[2]); } },
      { cap: `So ${T('S_n=\\dfrac{rt_n-t_1}{r-1}')}: (the ghost term minus the first term) over ${T('r-1')}. Substitute.`,
        run: async (c) => { A1.innerHTML = T(`S_n=\\dfrac{${cA('r')}${cP('t_n')}-${cT('t_1')}}{${cA('r')}-1}=${d.sub}`); await show(c, A1); } },
      { cap: `${T(`S_n=${d.mid}=${d.ans}`)}. We never needed ${T('n')}.`,
        run: async (c) => { A2.innerHTML = `${T(`=${d.mid}=`)}<span class="u1l7-boxed">${T(d.ans)}</span>`; await show(c, A2); sAns = stamp(stage, '✓', { ok: true, x: W - 120, y: 318, size: 'sm' }); await stampIn(c, sAns); } },
      { cap: `Check by adding all ${d.n} terms: ${T(`${d.all}=${d.ans}`)} ✓`,
        run: async (c) => { A3.innerHTML = `Adding all ${d.n} terms: ${T(`${d.all}=${d.ans}`)} ✓`; await show(c, A3); } }
    ];
  }
};

/* =============================== explainer: which formula? (flowchart) =============================== */
const WO = {
  ex2a: { label: 'Example 2(a)', q: `The first 12 terms of ${T('7+21+63+\\cdots')}`, t1: '7', r: '3', path: ['start', 'r1', 'kn', 'f1'],
    know: `${T('n=12')} is given.`, work: 'S_{12}=\\dfrac{7(3^{12}-1)}{3-1}', ans: '1\\,860\\,040' },
  ex3b: { label: 'Example 3(b)', q: `${T('1458-486+162-\\cdots+2')}`, t1: '1458', r: '-\\tfrac{1}{3}', path: ['start', 'r1', 'kn', 'f2'],
    know: `${T('n')} is not given, but the last term ${T('t_n=2')} is.`, work: 'S_n=\\dfrac{-\\frac{1}{3}(2)-1458}{-\\frac{1}{3}-1}', ans: '1094' },
  one: { label: T('4+4+4+\\cdots'), q: `The first 15 terms of ${T('4+4+4+\\cdots')}`, t1: '4', r: '1', path: ['start', 'r1', 'nt'],
    know: '', work: 'S_{15}=15(4)', ans: '60' }
};
const WN = {
  start: { x: 330, y: 42, w: 330, h: 62, html: `<b>Find ${T(cT('t_1'))} and ${T(cA('r'))}</b>divide a term by the one before`, cls: 'bk-round' },
  r1: { x: 330, y: 150, w: 210, h: 56, html: `<b>Is ${T('r=1')}?</b>`, cls: 'bk-diamond' },
  nt: { x: 100, y: 268, w: 190, h: 70, html: `<b>Every term is ${T('t_1')}</b>${T('S_n=nt_1')}`, color: GRN },
  kn: { x: 470, y: 268, w: 240, h: 56, html: `<b>Do you know ${T('n')}?</b>`, cls: 'bk-diamond' },
  f1: { x: 330, y: 392, w: 230, h: 82, html: `<b>yes: ${T('n')}</b>${T('\\dfrac{t_1(r^n-1)}{r-1}')}`, color: BLUE },
  f2: { x: 585, y: 392, w: 230, h: 82, html: `<b>last term ${T('t_n')}</b>${T('\\dfrac{rt_n-t_1}{r-1}')}`, color: PUR }
};
const WE = [
  { from: 'start', to: 'r1' },
  { from: 'r1', to: 'nt', label: 'yes', route: 'hv' },
  { from: 'r1', to: 'kn', label: 'no', route: 'hv' },
  { from: 'kn', to: 'f1', label: 'yes', route: 'hv' },
  { from: 'kn', to: 'f2', label: 'no', route: 'hv' }
];
const whichOne = {
  title: 'Which formula? A decision chart',
  height: 446,
  choices: Object.keys(WO).map((k) => ({ v: k, label: WO[k].label })),
  ask: (k) => `${WO[k].q}: which formula, and what is the sum?`,
  make(stage, k, ex) {
    const d = WO[k], W = ex.W, FW = 700;
    const F = new Flowchart(stage, { x: 4, y: 2, width: FW, height: 440, nodes: WN, edges: WE });
    const PX = FW + 18, P = put(stage, 'u1l7-panel', '<div class="u1l7-ph">Working</div>', PX, 10, W - PX - 8, 420);
    const ln = (html, cls = '') => { const e = h('div', 'u1l7-pline ' + cls, html); P.appendChild(e); hide(e); return e; };
    const l1 = ln(`${T(`${cT('t_1')}=${d.t1}`)}<br>${T(`${cA('r')}=${d.r}`)}`), l2 = ln(''), l3 = ln(''), l4 = ln('', 'u1l7-pans');
    const steps = [
      { cap: `Start at the top: read ${T(cT('t_1'))} and find ${T(cA('r'))}.`, run: async (c) => { await F.visit(c, 'start'); await show(c, l1); } }
    ];
    if (k === 'one') {
      steps.push({ cap: `${T('r=4\\div 4=1')}: <b>yes</b>. Every term is ${T('4')}.`, run: async (c) => { await F.go(c, 'start', 'r1'); await F.visit(c, 'r1'); await F.go(c, 'r1', 'nt'); await F.visit(c, 'nt'); } });
      steps.push({ cap: `The formula would give ${T('\\dfrac{4(1^{15}-1)}{1-1}=\\dfrac{0}{0}')}: you can’t divide by zero. Count instead: 15 terms of 4.`,
        run: async (c) => { l2.innerHTML = `${T('\\dfrac{4(1^{15}-1)}{1-1}=\\dfrac{0}{0}')}<div class="u1l7-x">✗ ÷ 0</div>`; await show(c, l2); } });
      steps.push({ cap: `${T('S_{15}=15(4)=60')}.`, run: async (c) => { l3.innerHTML = T(d.work); await show(c, l3); l4.innerHTML = T('=' + d.ans); await pop(c, l4, 380); } });
    } else {
      steps.push({ cap: `${T(`r=${d.r}`)}, not 1. Next question: do you know how many terms?`, run: async (c) => { await F.go(c, 'start', 'r1'); await F.visit(c, 'r1'); await F.go(c, 'r1', 'kn'); await F.visit(c, 'kn'); } });
      const last = d.path[3];
      steps.push({ cap: `${d.know} Use ${last === 'f1' ? `the <b>first form</b>, with ${T('n')}` : `the <b>second form</b>, with the last term`}.`,
        run: async (c) => { await F.go(c, 'kn', last); await F.visit(c, last); l2.innerHTML = d.know; await show(c, l2); } });
      steps.push({ cap: `Substitute: ${T(`${d.work}=${d.ans}`)}.`, run: async (c) => { l3.innerHTML = T(d.work); await show(c, l3); l4.innerHTML = T('=' + d.ans); await pop(c, l4, 380); } });
    }
    return steps;
  }
};

/* =============================== explainer: find the sum (Example 2), calculator screen =============================== */
const FSm = {
  a: { label: 'Example 2(a) check', terms: ['7', '21', '63', '\\cdots'], r: '3', rDiv: '21\\div 7=3', t1: '7', n: 12, hop: '\\times 3',
    sub: 'S_{12}=\\dfrac{7(3^{12}-1)}{3-1}', entry: '7(3^{12}-1)\\div(3-1)', screen: '1860040', steps: ['3^{12}=531\\,441', '531\\,441-1=531\\,440', '\\dfrac{7(531\\,440)}{2}=1\\,860\\,040'], ans: '1\\,860\\,040' },
  b: { label: 'Example 2(b) check', terms: ['2', '-6', '18', '\\cdots'], r: '-3', rDiv: '-6\\div 2=-3', t1: '2', n: 8, hop: '\\times(-3)',
    sub: 'S_8=\\dfrac{2\\left((-3)^8-1\\right)}{-3-1}', entry: '2((-3)^8-1)\\div(-3-1)', screen: '-3280', steps: ['(-3)^8=6561\\quad(\\text{not }-3^8=-6561)', '6561-1=6560', '\\dfrac{2(6560)}{-4}=-3280'], ans: '-3280', neg: true },
  c: { label: 'Example 2(c) check', terms: ['128', '32', '8', '\\cdots'], r: '\\tfrac{1}{4}', rDiv: '32\\div 128=\\tfrac{1}{4}', t1: '128', n: 7, hop: '\\times\\tfrac{1}{4}',
    sub: 'S_7=\\dfrac{128\\left(\\left(\\frac{1}{4}\\right)^7-1\\right)}{\\frac{1}{4}-1}', entry: '128((1\\div 4)^7-1)\\div(1\\div 4-1)', screen: '170.65625', steps: ['\\left(\\tfrac{1}{4}\\right)^7=\\tfrac{1}{16\\,384}', '\\text{calculator: }170.656\\,25', '\\text{exact: }\\dfrac{5461}{32}'], ans: '\\dfrac{5461}{32}' }
};
const findSum = {
  title: 'Find the sum: t₁ and r, substitute, evaluate',
  height: 450,
  capH: 92,
  choices: Object.keys(FSm).map((k) => ({ v: k, label: FSm[k].label })),
  ask: (k) => { const d = FSm[k]; return `Find the sum of the first ${d.n} terms of ${T(d.terms.join('+').replace(/\+-/g, '-'))}.`; },
  make(stage, k, ex) {
    const d = FSm[k], W = ex.W, svg = svgLayer(stage, ex, 450), LW = 470;
    const R = new TermRow(stage, svg, d.terms, { x: 10, y: 92, w: LW, step: 112, tw: 92, th: 54 });
    R.tiles[0].classList.add('u1l7-first');
    const hops = [R.hop(0, 1, d.hop), R.hop(1, 2, d.hop)];
    const tg = putC(stage, 'u1l7-tag u1l7-tag-t', T(`${cT('t_1')}=${d.t1}`), R.cx[0], 152, 120); hide(tg);
    const nTag = putC(stage, 'u1l7-tag', T(`n=${d.n}`), R.cx[3], 152, 100); hide(nTag);
    const A1 = put(stage, 'u1l7-alg u1l7-alg-l', '', 16, 214, LW); hide(A1);
    const lines = d.steps.map((s, i) => { const e = put(stage, 'u1l7-alg u1l7-alg-l u1l7-alg-sm', T(s), 16, 296 + i * 46, LW); hide(e); return e; });
    // a TI-84 Plus CE style home screen: the entry on the left, the answer on the right
    const CX = LW + 50, CW = W - CX - 14;
    const calc = put(stage, 'u1l7-calc', `<div class="u1l7-calc-h">TI-84 <span>Plus CE</span></div><div class="u1l7-scr"><div class="u1l7-scr1"></div><div class="u1l7-scr2"></div></div><div class="u1l7-calc-note"></div>`, CX, 40, CW, 210);
    const s1 = calc.querySelector('.u1l7-scr1'), s2 = calc.querySelector('.u1l7-scr2'), note = calc.querySelector('.u1l7-calc-note');
    const ansEl = putC(stage, 'u1l7-bigans', '', CX + CW / 2, 290, CW); hide(ansEl);
    const steps = [
      { cap: `Find ${T(cA('r'))}: ${T(d.rDiv)}. The first term is ${T(`${cT('t_1')}=${d.t1}`)}.`,
        run: async (c) => { for (const g of hops) await R.drawHop(c, g, 300); await show(c, tg); } },
      { cap: `${T(`n=${d.n}`)} is given, so use ${T('S_n=\\dfrac{t_1(r^n-1)}{r-1}')}. Substitute${d.neg ? ', with <b>brackets</b> around the negative ratio' : ''}.`,
        run: async (c) => { await show(c, nTag); A1.innerHTML = T(d.sub); await show(c, A1); } }
    ];
    if (d.neg) {
      steps.push({ cap: `Watch the brackets: ${T('(-3)^8=6561')}, but ${T('-3^8=-6561')}. Eight negatives multiply to a positive.`,
        run: async (c) => {
          s1.innerHTML = T('(-3)^8'); s2.textContent = '6561'; note.innerHTML = `${T('-3^8')} would give <b class="u1l7-red">−6561</b> ✗`;
          await show(c, calc.querySelector('.u1l7-scr')); await show(c, note); await show(c, lines[0]);
        } });
    }
    steps.push({ cap: `On the calculator, bracket the top and the bottom: ${T('\\text{top}\\div(\\text{bottom})')}.`,
      run: async (c) => {
        note.innerHTML = ''; s2.textContent = ''; s1.innerHTML = T(d.entry);
        await tween(c, 900, (t) => { s1.style.clipPath = `inset(0 ${(100 - 100 * t).toFixed(1)}% 0 0)`; });
        s1.style.clipPath = 'none';
        for (const e of lines.slice(d.neg ? 1 : 0, 2)) await show(c, e, 260);
      } });
    steps.push({ cap: `${T(`${d.sub.split('=')[0]}=${d.ans}`)}${k === 'c' ? ` (the calculator shows 170.65625: exact is ${T('\\tfrac{5461}{32}')})` : ''}.`,
      run: async (c) => { s2.textContent = d.screen.replace('-', '−'); await pop(c, s2, 300); await show(c, lines[2], 260); ansEl.innerHTML = T(`${d.sub.split('=')[0]}=${d.ans}`); await pop(c, ansEl, 400); } });
    return steps;
  }
};

/* =============================== explainer: find n (Example 4) =============================== */
const FN_ = {
  a: { label: 'Example 4(a) check', ask: `How many terms of ${T('4+20+100+\\cdots')} add to ${T('15\\,624')}?`,
    alg: [['\\dfrac{4(5^n-1)}{5-1}=15\\,624', `Set the sum formula (${T('t_1=4,\\ r=5')}) equal to ${T('15\\,624')}.`],
      ['5^n-1=15\\,624', `${T('5-1=4')}, and ${T('\\tfrac{4}{4}=1')}: the 4s cancel.`],
      ['5^n=15\\,625', `Add 1. The power is on its own.`]],
    head: ['n', '5^n'], rows: [[1, 5], [2, 25], [3, 125], [4, 625], [5, '3125'], [6, '15\\,625']], hit: 5, target: '15\\,625',
    ladderCap: `Climb the powers of 5 until you reach ${T('15\\,625')}.`, finCap: `${T('5^6=15\\,625')}, so ${T('n=6')}. Check: ${T('4+20+100+500+2500+12\\,500=15\\,624')} ✓`, fin: '\\boldsymbol{n=6}' },
  b: { label: 'Example 4(b) check', ask: `${T('4-8+16-\\cdots')} has a sum of 684. Find the last term and the number of terms.`,
    alg: [['\\dfrac{-2t_n-4}{-2-1}=684', `${T('n')} is unknown, so use the <b>last-term form</b> (${T('t_1=4,\\ r=-2')}).`],
      ['-2t_n-4=-2052', `Multiply both sides by ${T('-3')}.`],
      ['t_n=1024', `Add 4, then divide by ${T('-2')}: the last term is 1024.`],
      ['4(-2)^{n-1}=1024\\ \\Rightarrow\\ (-2)^{n-1}=256', `Where is 1024? Use ${T('t_n=t_1r^{n-1}')} and divide by 4.`]],
    head: ['k', '(-2)^k'], rows: [[1, -2], [2, 4], [3, -8], [4, 16], [5, -32], [6, 64], [7, -128], [8, 256]], hit: 7, target: '256',
    ladderCap: `Climb the powers of ${T('-2')} (they flip sign) until you reach 256.`, finCap: `${T('(-2)^8=256')}, so ${T('n-1=8')}: <b>9 terms</b>, and the last term is 1024.`, fin: 'n-1=8\\Rightarrow\\boldsymbol{n=9}' }
};
const findN = {
  title: 'Finding n: isolate the power, then climb',
  height: 470,
  capH: 92,
  choices: Object.keys(FN_).map((k) => ({ v: k, label: FN_[k].label })),
  ask: (k) => FN_[k].ask,
  make(stage, k, ex) {
    const d = FN_[k], W = ex.W, LW = W - 300;
    const algs = d.alg.map((a, i) => { const e = put(stage, 'u1l7-alg u1l7-alg-l', T(a[0]), 20, 14 + i * 74, LW - 30); hide(e); return e; });
    const nR = d.rows.length, cellH = nR > 6 ? 44 : 52;
    const tb = new ValueTable(stage, { x: LW + 40, y: 6, headers: d.head, rows: d.rows.map((r) => r.slice()), hide: 1, tap: false, cellW: 104, cellH, tex: true });
    hide(tb.el);
    const fin = put(stage, 'u1l7-alg u1l7-alg-big u1l7-alg-l', T(d.fin), 20, 14 + d.alg.length * 74 + 16, LW - 30); hide(fin);
    const steps = d.alg.map((a, i) => ({ cap: a[1], run: (c) => show(c, algs[i]) }));
    steps.push({ cap: d.ladderCap, run: async (c) => {
      await show(c, tb.el);
      for (let r = 0; r < nR; r++) { await tb.reveal(r, 1, c); await sleep(c, 180); }
      tb.highlight(d.hit, true);
    } });
    steps.push({ cap: d.finCap, run: async (c) => { await pop(c, fin, 380); const s = stamp(stage, '✓', { ok: true, x: LW - 70, y: 14 + d.alg.length * 74 + 4, size: 'sm' }); await stampIn(c, s); } });
    return steps;
  }
};

/* =============================== explainer: find t1 or r (Example 5) =============================== */
const findR = {
  title: 'Finding t₁ or r',
  height: 460,
  capH: 92,
  choices: [{ v: 'a', label: 'Example 5(a): back to t₁' }, { v: 'b', label: 'Example 5(b): a quadratic' }, { v: 'c', label: 'Example 5(c): a table' }],
  ask: (k) => ({ a: `${T('t_4=540')} and ${T('r=3')}. Find ${T('S_8')}.`, b: `${T('t_1=6')} and ${T('S_3=126')}. Find every possible ${T('r')}.`, c: `${T('t_1=4')} and ${T('S_6=1456')}. Find ${T('r\\ (r>0)')} with a table, then ${T('t_3')}.` }[k]),
  make(stage, k, ex) {
    const W = ex.W, svg = svgLayer(stage, ex, 460);
    if (k === 'a') {
      const terms = ['?', '?', '?', '540', '?', '?', '?', '?'];
      const R = new TermRow(stage, svg, terms, { x: 10, y: 110, w: W - 20, step: 112, tw: 90, th: 56 });
      R.tiles.forEach((t, i) => { if (i !== 3) t.classList.add('u1l7-q'); });
      R.tiles[3].classList.add('u1l7-lastt');
      const labs = R.cx.map((x, i) => putC(stage, 'u1l7-idx', T(`t_${i + 1}`), x, 172, 60));
      const vals = ['20', '60', '180'];
      const back = [R.hop(3, 2, '\\div 3'), R.hop(2, 1, '\\div 3'), R.hop(1, 0, '\\div 3')];
      const A1 = putC(stage, 'u1l7-alg', '', W / 2, 220, W - 40); hide(A1);
      const A2 = putC(stage, 'u1l7-alg u1l7-alg-big', '', W / 2, 290, W - 40); hide(A2);
      const A3 = putC(stage, 'u1l7-alg', '', W / 2, 384, W - 40); hide(A3);
      const setT = async (c, i, v, first) => { const t = R.tiles[i]; t.innerHTML = T(first ? cT(v) : v); t.classList.remove('u1l7-q'); if (first) t.classList.add('u1l7-first'); await pop(c, t, 300); };
      return [
        { cap: `${T('t_4=540')} sits 3 hops after ${T(cT('t_1'))}. Hop <b>backwards</b>: divide by ${T(cA('3'))} each time.`,
          run: async (c) => { await R.drawHop(c, back[0], 320); await setT(c, 2, '180'); } },
        { cap: `${T('180\\div 3=60')}, then ${T('60\\div 3=20')}. So ${T(`${cT('t_1')}=20`)}.`,
          run: async (c) => { await R.drawHop(c, back[1], 320); await setT(c, 1, '60'); await R.drawHop(c, back[2], 320); await setT(c, 0, '20', true); } },
        { cap: `In one line: ${T(`t_1(3)^3=540`)}, so ${T(`t_1=\\dfrac{540}{27}=20`)}.`,
          run: async (c) => { A1.innerHTML = T(`t_1(3)^3=540\\ \\Rightarrow\\ t_1=\\dfrac{540}{27}=${cT('20')}`); await show(c, A1); } },
        { cap: `Now the sum: ${T('S_8=\\dfrac{20(3^8-1)}{3-1}=10(6560)=65\\,600')}.`,
          run: async (c) => { A2.innerHTML = T(`S_8=\\dfrac{${cT('20')}(${cA('3')}^8-1)}{${cA('3')}-1}=10(6560)=65\\,600`); await show(c, A2); } },
        { cap: `${T('S_8=65\\,600')}.`, run: async (c) => { A3.innerHTML = `<span class="u1l7-boxed">${T('S_8=65\\,600')}</span>`; await pop(c, A3, 380); } }
      ];
    }
    if (k === 'b') {
      const LW = 470;
      const L = [
        ['6+6r+6r^2=126', `Write ${T('S_3')} as its three terms: ${T(`${cT('6')},\\ 6${cA('r')},\\ 6${cA('r')}^2`)}.`],
        ['r^2+r+1=21', `Divide every term by 6.`],
        ['r^2+r-20=0', `Subtract 21: a quadratic equal to 0.`],
        ['(r+5)(r-4)=0', `Factor: two numbers that multiply to ${T('-20')} and add to 1 are ${T('5')} and ${T('-4')}.`],
        [`r=${cA('4')}\\ \\text{ or }\\ r=${cA('-5')}`, `<b>Two</b> possible ratios: ${T('r=4')} or ${T('r=-5')}.`]
      ];
      const els = L.map((a, i) => { const e = put(stage, 'u1l7-alg u1l7-alg-l', T(a[0]), 24, 14 + i * 64, LW); hide(e); return e; });
      const PX = LW + 40, PW = W - PX - 10;
      const rowA = new TermRow(stage, svg, ['6', '24', '96'], { x: PX, y: 90, w: PW, step: 110, tw: 88, th: 52 });
      const rowB = new TermRow(stage, svg, ['6', '-30', '150'], { x: PX, y: 290, w: PW, step: 110, tw: 88, th: 52 });
      const hA = [rowA.hop(0, 1, '\\times 4'), rowA.hop(1, 2, '\\times 4')], hB = [rowB.hop(0, 1, '\\times(-5)'), rowB.hop(1, 2, '\\times(-5)')];
      [...rowA.tiles, ...rowB.tiles].forEach(hide);
      const sA = putC(stage, 'u1l7-alg', T('6+24+96=126'), PX + PW / 2, 156, PW); hide(sA);
      const sB = putC(stage, 'u1l7-alg', T('6-30+150=126'), PX + PW / 2, 356, PW); hide(sB);
      const steps = L.map((a, i) => ({ cap: a[1], run: (c) => show(c, els[i]) }));
      steps.push({ cap: `Check ${T('r=4')}: ${T('6+24+96=126')} ✓`, run: async (c) => { for (const t of rowA.tiles) await pop(c, t, 220); for (const g of hA) await rowA.drawHop(c, g, 260); await show(c, sA); await stampIn(c, stamp(stage, '✓', { ok: true, x: W - 56, y: 96, size: 'sm' })); } });
      steps.push({ cap: `Check ${T('r=-5')}: ${T('6-30+150=126')} ✓. Both ratios work.`, run: async (c) => { for (const t of rowB.tiles) await pop(c, t, 220); for (const g of hB) await rowB.drawHop(c, g, 260); await show(c, sB); await stampIn(c, stamp(stage, '✓', { ok: true, x: W - 56, y: 296, size: 'sm' })); } });
      return steps;
    }
    // c: a table of r values
    const LW = 470;
    const A0 = put(stage, 'u1l7-alg u1l7-alg-l', T('\\dfrac{4(r^6-1)}{r-1}=1456'), 24, 20, LW); hide(A0);
    const A1 = put(stage, 'u1l7-alg u1l7-alg-l', T('Y_1=\\dfrac{4(X^6-1)}{X-1}'), 24, 110, LW); hide(A1);
    const A2 = put(stage, 'u1l7-alg u1l7-alg-l', '', 24, 220, LW); hide(A2);
    const A3 = put(stage, 'u1l7-alg u1l7-alg-l u1l7-alg-big', '', 24, 300, LW); hide(A3);
    const tb = new ValueTable(stage, { x: LW + 90, y: 30, headers: ['X', 'Y_1'], rows: [[2, 252], [3, 1456], [4, '5460']], hide: 1, tap: false, cellW: 120, cellH: 56 });
    hide(tb.el);
    const tgt = put(stage, 'u1l7-target', `target ${T('1456')}`, LW + 90 + 262, 30 + 56 * 2 + 14, 140); hide(tgt);
    return [
      { cap: `Put what you know into the first form: ${T('t_1=4')}, ${T('n=6')}, sum ${T('1456')}. Solving for ${T('r')} directly is hard.`, run: (c) => show(c, A0) },
      { cap: `So <b>try values</b>: evaluate the left side for ${T('r')} = 2, 3, 4, … (a graphing calculator's table does this as ${T('Y_1')}).`, run: (c) => show(c, A1) },
      { cap: `${T('X=2')} gives 252: too small. ${T('X=3')} gives 1456: a match.`,
        run: async (c) => { await show(c, tb.el); await show(c, tgt); await tb.reveal(0, 1, c); await sleep(c, 300); await tb.reveal(1, 1, c); tb.highlight(1, true); } },
      { cap: `(${T('X=4')} gives 5460: far too big, so ${T('r=3')} is the only positive answer.)`, run: (c) => tb.reveal(2, 1, c) },
      { cap: `${T('r=3')}, so ${T('t_3=4(3)^2=36')}.`,
        run: async (c) => { A2.innerHTML = T(`${cA('r')}=3`); await show(c, A2); A3.innerHTML = T(`t_3=${cT('4')}(${cA('3')})^2=36`); await pop(c, A3, 380); } }
    ];
  }
};

/* =============================== explainer: t_n = S_n − S_(n−1) (stacked bars) =============================== */
const STC = ['#0f7a80', '#3d8fd1', '#7b4fc4', '#c27a0e'];
const stairs = {
  title: 'Each sum is the one before plus one new term',
  height: 460,
  capH: 92,
  choices: [{ v: 'demo', label: T('S_n=3(2^n-1)') }, { v: 'ex6', label: 'Example 6 check' }],
  ask: (k) => (k === 'demo' ? `${T('S_n=3(2^n-1)')}. Find the first four terms.` : `${T('S_n=2(5^n-1)')}. Find the first four terms, then ${T('t_7')}.`),
  make(stage, k, ex) {
    const W = ex.W;
    if (k === 'demo') {
      const S = [3, 9, 21, 45], t = [3, 6, 12, 24], base = 420, u = 7.6, bw = 92, gap = 56, X0 = 70;
      const svg = svgLayer(stage, ex, 460);
      svgEl('line', { x1: 40, y1: base, x2: X0 + 4 * (bw + gap) - 20, y2: base, stroke: INK, 'stroke-width': 2.5 }, svg);
      const bars = S.map((s, i) => {
        const g = svgEl('g', {}, svg), x = X0 + i * (bw + gap); let y = base;
        const blocks = [];
        for (let j = 0; j <= i; j++) {
          const hh = t[j] * u; y -= hh;
          blocks.push(svgEl('rect', { x, y, width: bw, height: hh, fill: STC[j], 'fill-opacity': j === i ? 0.9 : 0.35, stroke: '#fff', 'stroke-width': 2, rx: 3 }, g));
        }
        hide(g);
        const lab = putC(stage, 'u1l7-barlab', T(`S_${i + 1}=${s}`), x + bw / 2, base + 6, 130);
        hide(lab);
        return { g, blocks, x, lab };
      });
      const panel = put(stage, 'u1l7-panel', '<div class="u1l7-ph">Terms</div>', 752, 20, W - 762, 400);
      const tl = t.map((v, i) => { const e = h('div', 'u1l7-pline', T(i === 0 ? `t_1=S_1=${v}` : `t_${i + 1}=${S[i]}-${S[i - 1]}=${v}`)); panel.appendChild(e); hide(e); return e; });
      const rl = h('div', 'u1l7-pline u1l7-pans', T('3,\\ 6,\\ 12,\\ 24') + '<br>' + T('r=2')); panel.appendChild(rl); hide(rl);
      const brace = svgEl('g', {}, svg); hide(brace);
      const b3 = bars[3], yTop = base - 45 * u, yMid = base - 21 * u;
      svgEl('path', { d: `M${b3.x + bw + 8} ${yTop} q10 0 10 10 V${(yTop + yMid) / 2 - 8} q0 8 8 8 q-8 0 -8 8 V${yMid - 10} q0 10 -10 10`, fill: 'none', stroke: RED, 'stroke-width': 3 }, brace);
      const bl = put(stage, 'u1l7-bracelab', T('t_4=24'), b3.x + bw + 32, (yTop + yMid) / 2 - 16, 100); hide(bl);
      const guide = svgEl('line', { x1: bars[2].x, y1: yMid, x2: b3.x + bw, y2: yMid, stroke: RED, 'stroke-width': 2.5, 'stroke-dasharray': '6 6' }, svg); hide(guide);
      return [
        { cap: `${T('S_1=3(2^1-1)=3')}: the sum of one term is <b>the first term</b>. So ${T('t_1=S_1=3')}.`,
          run: async (c) => { await appear(c, bars[0].g, 300); await show(c, bars[0].lab); await show(c, tl[0]); } },
        { cap: `${T('S_2=3(2^2-1)=9')}: the same first block, plus one <b>new block</b> on top.`,
          run: async (c) => { await appear(c, bars[1].g, 300); await show(c, bars[1].lab); } },
        { cap: `${T('S_3=21')} and ${T('S_4=45')}: each bar is the bar before it with one more block.`,
          run: async (c) => { await appear(c, bars[2].g, 300); await show(c, bars[2].lab); await appear(c, bars[3].g, 300); await show(c, bars[3].lab); } },
        { cap: `${T('S_4')} and ${T('S_3')} share the first three blocks. The difference is the new block: ${T('t_4=S_4-S_3=45-21=24')}.`,
          run: async (c) => { await appear(c, guide, 250); await appear(c, brace, 250); await show(c, bl); await show(c, tl[3]); } },
        { cap: `The same for each: ${T('t_2=9-3=6')}, ${T('t_3=21-9=12')}.`, run: async (c) => { await show(c, tl[1]); await show(c, tl[2]); } },
        { cap: `The terms are ${T('3,\\ 6,\\ 12,\\ 24')}: geometric with ${T('r=2')}.`, run: (c) => pop(c, rl, 380) }
      ];
    }
    // Example 6: a subtraction ladder
    const S = ['8', '48', '248', '1248'], tv = ['8', '40', '200', '1000'], step = 190, X0 = (W - step * 4) / 2 + step / 2;
    const svg = svgLayer(stage, ex, 460);
    const sTiles = S.map((s, i) => { const e = put(stage, 'u1l7-tile u1l7-t-top', T(`S_${i + 1}=${nt(+s)}`), X0 + i * step - 80, 24, 160, 54); hide(e); return e; });
    const tTiles = tv.map((s, i) => { const e = put(stage, 'u1l7-tile u1l7-tile2' + (i === 0 ? ' u1l7-first' : ''), `<div class="u1l7-tsub">${T(i ? `${nt(+S[i])}-${nt(+S[i - 1])}` : 'S_1')}</div>${T(`t_${i + 1}=${nt(+s)}`)}`, X0 + i * step - 80, 164, 160, 72); hide(e); return e; });
    const subs = [];
    for (let i = 0; i < 4; i++) {
      const g = svgEl('g', {}, svg);
      if (i === 0) { svgEl('line', { x1: X0, y1: 82, x2: X0, y2: 162, stroke: TEAL, 'stroke-width': 3, class: 'bk-stroke' }, g); }
      else {
        svgEl('line', { x1: X0 + (i - 1) * step + 30, y1: 82, x2: X0 + i * step - 10, y2: 162, stroke: RED, 'stroke-width': 3, 'stroke-dasharray': '6 5' }, g);
        svgEl('line', { x1: X0 + i * step, y1: 82, x2: X0 + i * step, y2: 162, stroke: BLUE, 'stroke-width': 3 }, g);
      }
      hide(g); subs.push(g);
    }
    const A1 = putC(stage, 'u1l7-alg', '', W / 2, 262, W - 40); hide(A1);
    const A2 = putC(stage, 'u1l7-alg', '', W / 2, 322, W - 40); hide(A2);
    const A3 = putC(stage, 'u1l7-alg u1l7-alg-big', '', W / 2, 380, W - 40); hide(A3);
    return [
      { cap: `Evaluate the sums: ${T('S_1=2(5-1)=8')}, ${T('S_2=2(25-1)=48')}, ${T('S_3=248')}, ${T('S_4=1248')}.`,
        run: async (c) => { for (const e of sTiles) await pop(c, e, 260); } },
      { cap: `${T('t_1=S_1=8')}. Each later term is a sum minus the sum before it.`,
        run: async (c) => { await appear(c, subs[0], 200); await pop(c, tTiles[0], 260); } },
      { cap: `${T('t_2=48-8=40')}, ${T('t_3=248-48=200')}, ${T('t_4=1248-248=1000')}.`,
        run: async (c) => { for (let i = 1; i < 4; i++) { await appear(c, subs[i], 200); await pop(c, tTiles[i], 260); } } },
      { cap: `The series is ${T('8+40+200+1000+\\cdots')}: each term is 5 times the one before, ${T('r=5')}.`,
        run: async (c) => { A1.innerHTML = T(`8+40+200+1000+\\cdots\\qquad(${cA('r=5')})`); await show(c, A1); } },
      { cap: `(b) ${T('t_7=S_7-S_6=2(5^7-1)-2(5^6-1)=156\\,248-31\\,248')}.`,
        run: async (c) => { A2.innerHTML = T('t_7=S_7-S_6=2(5^7-1)-2(5^6-1)=156\\,248-31\\,248'); await show(c, A2); } },
      { cap: `${T('t_7=125\\,000')}. Check with the general term: ${T('8(5)^6=125\\,000')} ✓`,
        run: async (c) => { A3.innerHTML = `<span class="u1l7-boxed">${T('t_7=125\\,000')}</span> <span class="u1l7-ortxt">check:</span> ${T('8(5)^6=125\\,000')} ✓`; await pop(c, A3, 380); } }
    ];
  }
};

/* =============================== explainer: the bouncing ball (Example 7) =============================== */
const BL = {
  ex7: { label: 'Example 7 check', h0: 27, q: 2 / 3, qT: '\\tfrac{2}{3}', qF: '\\frac{2}{3}', k: 6,
    hts: ['27', '18', '12', '8', '\\tfrac{16}{3}', '\\tfrac{32}{9}'],
    fallSum: '\\dfrac{27\\left(\\left(\\frac{2}{3}\\right)^6-1\\right)}{\\frac{2}{3}-1}=\\dfrac{665}{9}\\approx 73.89',
    riseSum: '\\dfrac{18\\left(\\left(\\frac{2}{3}\\right)^5-1\\right)}{\\frac{2}{3}-1}=\\dfrac{422}{9}\\approx 46.89',
    total: '\\dfrac{1087}{9}\\approx 120.78\\text{ m}', bounce: { n: 5, tex: '27\\left(\\tfrac{2}{3}\\right)^5=\\dfrac{32}{9}\\approx 3.56\\text{ m}' } },
  demo: { label: '16 m, half, 4th hit', h0: 16, q: 1 / 2, qT: '\\tfrac{1}{2}', qF: '\\frac{1}{2}', k: 4,
    hts: ['16', '8', '4', '2'],
    fallSum: '16+8+4+2=30', riseSum: '8+4+2=14', total: '44\\text{ m}', bounce: null }
};
const ball = {
  title: 'A bouncing ball: falls and rises',
  height: 470,
  capH: 92,
  choices: Object.keys(BL).map((k) => ({ v: k, label: BL[k].label })),
  ask: (k) => { const d = BL[k]; return `Dropped from ${d.h0} m; each bounce reaches ${T(d.qT)} of the height before. Total distance at the ${d.k === 6 ? '6th' : '4th'} hit?`; },
  make(stage, k, ex) {
    const d = BL[k], W = ex.W, svg = svgLayer(stage, ex, 470);
    const GW = 600, ground = 400, top = 40, sc = (ground - top) / d.h0, X0 = 60;
    const H = Array.from({ length: d.k }, (_, i) => d.h0 * Math.pow(d.q, i));   // fall i starts at H[i]
    // horizontal positions: each fall/rise takes time ∝ √height
    const tot = H.reduce((s, v, i) => s + Math.sqrt(v) * (i ? 2 : 1), 0), ux = (GW - 80) / tot;
    svgEl('line', { x1: 20, y1: ground, x2: GW + 10, y2: ground, stroke: INK, 'stroke-width': 3 }, svg);
    svgEl('rect', { x: 20, y: ground, width: GW - 10, height: 10, fill: '#e9e2d0' }, svg);
    // the ball's path as segments: fall i from (x, ground − H[i]) to (x + √H·ux, ground); rise i from hit to the next peak
    const segs = []; let x = X0;
    for (let i = 0; i < d.k; i++) {
      if (i > 0) { // rise to H[i]
        const dx = Math.sqrt(H[i]) * ux, x1 = x + dx;
        segs.push({ kind: 'rise', i, a: [x, ground], b: [x1, ground - H[i] * sc] }); x = x1;
      }
      const dx = Math.sqrt(H[i]) * ux, x1 = x + dx;
      segs.push({ kind: 'fall', i, a: [x, ground - H[i] * sc], b: [x1, ground] }); x = x1;
    }
    const pathD = (s) => {
      const [ax, ay] = s.a, [bx, by] = s.b;
      return s.kind === 'fall' ? `M${ax} ${ay} Q${(ax + bx) / 2} ${ay} ${bx} ${by}` : `M${ax} ${ay} Q${(ax + bx) / 2} ${by} ${bx} ${by}`;
    };
    const segEls = segs.map((s) => { const p = svgEl('path', { d: pathD(s), fill: 'none', stroke: s.kind === 'fall' ? BLUE : GRN, 'stroke-width': 3.5, class: 'bk-stroke', 'stroke-dasharray': '2 7', 'stroke-linecap': 'round' }, svg); hide(p); return p; });
    // vertical measuring arrows for each fall (down, blue) and rise (up, green)
    const bars = segs.map((s) => {
      const g = svgEl('g', {}, svg), bx = s.kind === 'fall' ? s.a[0] + 7 : s.b[0] - 7, hgt = H[s.i] * sc;
      const y0 = ground - hgt, col = s.kind === 'fall' ? BLUE : GRN;
      svgEl('line', { x1: bx, y1: y0 + 2, x2: bx, y2: ground - 2, stroke: col, 'stroke-width': 4 }, g);
      if (s.kind === 'fall') arrowHead(g, bx, ground - 2, 0, 1, { color: col, width: 4 }); else arrowHead(g, bx, y0 + 2, 0, -1, { color: col, width: 4 });
      hide(g); return g;
    });
    const hLabs = segs.filter((s) => s.kind === 'fall').map((s) => { const e = putC(stage, 'u1l7-hlab', T(d.hts[s.i]), s.a[0], s.a[1] - 32, 70); hide(e); return e; });
    const hitLabs = segs.filter((s) => s.kind === 'fall').map((s, j) => { const e = putC(stage, 'u1l7-hit', String(j + 1), s.b[0], ground + 14, 26); hide(e); return e; });
    const ballEl = svgEl('circle', { cx: X0, cy: ground - H[0] * sc - 13, r: 13, fill: '#e2553f', stroke: '#7d2a1d', 'stroke-width': 2 }, svg);
    // panel
    const PX = GW + 30, P = put(stage, 'u1l7-panel', '<div class="u1l7-ph">Distance</div>', PX, 10, W - PX - 8, 446);
    const ln = (html, cls = '') => { const e = h('div', 'u1l7-pline ' + cls, html); P.appendChild(e); hide(e); return e; };
    const fallsL = ln(`<b class="u1l7-cdown">Falls</b> (${d.k} terms): ${T(d.hts.join('+'))}`);
    const riseL = ln(`<b class="u1l7-cup">Rises</b> (${d.k - 1} terms): ${T(d.hts.slice(1).join('+'))}`);
    const fS = ln(T(d.fallSum), 'u1l7-psm'), rS = ln(T(d.riseSum), 'u1l7-psm'), totL = ln(`Total ${T('=' + d.total)}`, 'u1l7-pans');
    const bounceL = d.bounce ? ln(`5th bounce: ${T(d.bounce.tex)}`, 'u1l7-psm') : null;
    const moveBall = async (c, s, ms) => {
      const [ax, ay] = s.a, [bx, by] = s.b;
      await tween(c, ms, (t) => {
        let px, py;
        if (s.kind === 'fall') { px = ax + (bx - ax) * t; py = ay + (by - ay) * t * t; }
        else { px = ax + (bx - ax) * t; py = ay + (by - ay) * (1 - (1 - t) * (1 - t)); }
        ballEl.setAttribute('cx', px.toFixed(1)); ballEl.setAttribute('cy', (py - 13).toFixed(1));
      }, (t) => t);
    };
    const fallIdx = segs.map((s, i) => (s.kind === 'fall' ? i : -1)).filter((i) => i >= 0), riseIdx = segs.map((s, i) => (s.kind === 'rise' ? i : -1)).filter((i) => i >= 0);
    const steps = [
      { cap: `Drop the ball and follow it until it hits the ground the <b>${d.k === 6 ? '6th' : '4th'} time</b>.`,
        run: async (c) => {
          let hit = 0;
          for (let i = 0; i < segs.length; i++) {
            const s = segs[i]; segEls[i].style.opacity = 1; await moveBall(c, s, 360 + 50 * Math.sqrt(H[s.i]));
            if (s.kind === 'fall') { await pop(c, hitLabs[hit], 160); hit++; }
          }
        } },
      { cap: `Count the <b class="u1l7-cdown">falls</b>: the drop plus one after each bounce, <b>${d.k}</b> of them: ${T(d.hts.join(',\\ '))}. Each is ${T(d.qT)} of the one before.`,
        run: async (c) => { for (const i of fallIdx) await appear(c, bars[i], 150); for (const e of hLabs) await show(c, e, 120); await show(c, fallsL); } },
      { cap: `Count the <b class="u1l7-cup">rises</b>: only <b>${d.k - 1}</b>. The ball doesn’t bounce up after the last hit, and nothing rose before the drop.`,
        run: async (c) => { for (const i of riseIdx) await appear(c, bars[i], 150); await show(c, riseL); } },
      { cap: `Sum the falls (${T(`t_1=${d.h0},\\ r=${d.qT},\\ n=${d.k}`)}): ${T(d.fallSum)}.`, run: (c) => show(c, fS) },
      { cap: `Sum the rises (${T(`t_1=${d.hts[1]},\\ n=${d.k - 1}`)}): ${T(d.riseSum)}.`, run: (c) => show(c, rS) },
      { cap: `Add the two sums: total ${T('=' + d.total)}.`, run: (c) => pop(c, totL, 400) }
    ];
    if (d.bounce) steps.push({ cap: `(a) The 5th bounce is the 5th <b class="u1l7-cup">rise</b>: ${T(d.bounce.tex)}.`, run: async (c) => { await show(c, bounceL); await pulse(c, bars[riseIdx[4]], 1.05, 400); } });
    return steps;
  }
};

/* =============================== explainer: a phone tree (Example 8) =============================== */
const PH = {
  ex8: { label: 'Example 8 check', r: 5, levels: 4, target: 12000, need: 6, more: [3905, 19530] },
  two: { label: 'Each person calls 2', r: 2, levels: 4, target: 500, need: 8, more: [62, 126, 254, 510] }
};
const phone = {
  title: 'A phone tree, level by level',
  height: 460,
  capH: 92,
  choices: Object.keys(PH).map((k) => ({ v: k, label: PH[k].label })),
  ask: (k) => { const d = PH[k]; return `The president calls ${d.r}; each of them calls ${d.r} new people, and so on. How many in 4 levels? How many levels to reach ${nt(d.target).replace(/\\,/g, ' ')}?`; },
  make(stage, k, ex) {
    const d = PH[k], r = d.r, W = ex.W, svg = svgLayer(stage, ex, 460), TW = 540;
    const cnt = [1, r, r * r, r ** 3, r ** 4], tot = [0, r, r + r * r, r + r * r + r ** 3, r + r * r + r ** 3 + r ** 4];
    const pres = svgEl('g', {}, svg);
    svgEl('circle', { cx: TW / 2, cy: 30, r: 14, fill: INK }, pres);
    const presL = putC(stage, 'u1l7-plab', 'president', TW / 2 + 70, 18, 110);
    // level 1: r dots spread; level 2: r under each; level 3: a column of r under each level-2 dot; level 4: r² under each level-2 dot, small
    const w1 = (TW - 60) / r, X1 = (i) => 30 + w1 * (i + 0.5), w2 = w1 / r, X2 = (i, j) => 30 + w1 * i + w2 * (j + 0.5);
    const lvl = [svgEl('g', {}, svg), svgEl('g', {}, svg), svgEl('g', {}, svg), svgEl('g', {}, svg)];
    const Y1 = 92, Y2 = 160, Y3 = 210, Y4 = 300;
    for (let i = 0; i < r; i++) {
      svgEl('line', { x1: TW / 2, y1: 44, x2: X1(i), y2: Y1 - 11, stroke: GRAY, 'stroke-width': 2 }, lvl[0]);
      svgEl('circle', { cx: X1(i), cy: Y1, r: 11, fill: TEAL }, lvl[0]);
      for (let j = 0; j < r; j++) {
        svgEl('line', { x1: X1(i), y1: Y1 + 11, x2: X2(i, j), y2: Y2 - 6, stroke: GRAY, 'stroke-width': 1.5 }, lvl[1]);
        svgEl('circle', { cx: X2(i, j), cy: Y2, r: 6, fill: BLUE }, lvl[1]);
        for (let m = 0; m < r; m++) svgEl('circle', { cx: X2(i, j), cy: Y3 + m * (60 / r), r: Math.min(4, 26 / r), fill: PUR }, lvl[2]);
        const sp = Math.min(14, (w2 / r) * 0.92); for (let m = 0; m < r * r; m++) svgEl('circle', { cx: X2(i, j) + ((m % r) - (r - 1) / 2) * sp, cy: Y4 + Math.floor(m / r) * sp, r: Math.min(3, sp * 0.34), fill: AMB }, lvl[3]);
      }
    }
    lvl.forEach(hide);
    const lvlLab = [Y1, Y2, Y3 + 20, Y4 + 30].map((y, i) => { const e = put(stage, 'u1l7-lvl', `Level ${i + 1}: <b>${fmt(cnt[i + 1])}</b>`, TW + 6, y - 14, 140); hide(e); return e; });
    // table
    const PX = TW + 160, P = put(stage, 'u1l7-panel', '<div class="u1l7-ph">Total called</div>', PX, 6, W - PX - 6, 440);
    const rows = [];
    for (let i = 1; i <= 4; i++) { const e = h('div', 'u1l7-pline u1l7-psm', T(`S_${i}=${nt(tot[i])}`)); P.appendChild(e); hide(e); rows.push(e); }
    const fl = h('div', 'u1l7-pline u1l7-psm', T(`S_4=\\dfrac{${r}(${r}^4-1)}{${r}-1}=${nt(tot[4])}`)); P.appendChild(fl); hide(fl);
    const more = d.more.map((v, i) => { const e = h('div', 'u1l7-pline u1l7-psm', T(`S_${i + 5}=${nt(v)}`) + (i === d.more.length - 1 ? ` ${T('\\ge ' + nt(d.target))} ✓` : '')); P.appendChild(e); hide(e); return e; });
    const fin = h('div', 'u1l7-pline u1l7-pans', `<b>${d.need} levels</b>`); P.appendChild(fin); hide(fin);
    const steps = [];
    for (let i = 0; i < 4; i++) {
      steps.push({
        cap: i === 0 ? `Level 1: the president calls ${T(String(r))}. So far ${T(String(r))} people.`
          : `Level ${i + 1}: each of the ${fmt(cnt[i])} calls ${r}, so ${T(`${nt(cnt[i])}\\times ${r}=${nt(cnt[i + 1])}`)} new people. Total ${T(nt(tot[i + 1]))}.`,
        run: async (c) => { await appear(c, lvl[i], 380); await show(c, lvlLab[i]); await show(c, rows[i]); }
      });
    }
    steps.push({ cap: `The levels ${T(`${r},\\ ${nt(cnt[2])},\\ ${nt(cnt[3])},\\ ${nt(cnt[4])}`)} are geometric (${T(`t_1=${r},\\ r=${r}`)}): ${T(`S_4=\\dfrac{${r}(${r}^4-1)}{${r}-1}=${nt(tot[4])}`)}.`, run: (c) => show(c, fl) });
    steps.push({ cap: `Keep going in a table of ${T(`S_n`)} until it reaches ${T(nt(d.target))}: ${d.more.map((v, i) => T(`S_${i + 5}=${nt(v)}`)).join(', ')}.`,
      run: async (c) => { for (const e of more) await show(c, e, 220); } });
    steps.push({ cap: `${T(`S_${d.need - 1}=${nt(d.more[d.more.length - 2] || tot[4])}`)} is not enough; ${T(`S_${d.need}=${nt(d.more[d.more.length - 1])}`)} is. <b>${d.need} levels</b> are needed.`, run: (c) => pop(c, fin, 380) });
    return steps;
  }
};

/* =============================== Stand Up Break! (whiteboard stations; ../standup.js) ===============================
 * Sits after Example 3. BEG: a sum with n given (positive whole r); PRG: a sum with the last term given, or a negative r;
 * MAS: the number of terms from the sum. */
const suPow = (b, e) => Math.pow(b, e);
const suNum = (v) => nt(v);
standup('u1l7', {
  intro: 'At your whiteboard: find t₁ and r, choose the form that fits, substitute, and evaluate.',
  levels: {
    BEG: (rn) => {
      for (;;) {
        const t1 = rn.pick([2, 3, 4, 5, 6]), r = rn.pick([2, 3, 4]), n = rn.int(5, 8), S = geoS(t1, r, n);
        if (S > 200000) continue;
        return { text: `Determine the sum of the first <b>${n}</b> terms.`, q: `${t1}+${t1 * r}+${t1 * r * r}+\\cdots`,
          a: [`t_1=${t1},\\ r=${r},\\ n=${n}`, `S_{${n}}=\\dfrac{${t1}(${r}^{${n}}-1)}{${r}-1}=${suNum(S)}`] };
      }
    },
    PRG: (rn) => {
      if (rn.chance(0.5)) { // last term given
        for (;;) {
          const t1 = rn.pick([2, 3, 5, 6, 7]), r = rn.pick([2, 3]), n = rn.int(6, 9), tn = t1 * suPow(r, n - 1), S = (r * tn - t1) / (r - 1);
          if (tn > 50000) continue;
          return { text: 'Determine the sum.', q: `${t1}+${t1 * r}+${t1 * r * r}+\\cdots+${suNum(tn)}`,
            a: [`t_1=${t1},\\ r=${r},\\ t_n=${suNum(tn)}`, `S_n=\\dfrac{${r}(${suNum(tn)})-${t1}}{${r}-1}=${suNum(S)}`] };
        }
      }
      for (;;) { // negative ratio
        const t1 = rn.pick([1, 2, 3, 4, 5]), r = -rn.pick([2, 3]), n = rn.int(5, 8), S = geoS(t1, r, n);
        const sg = (v) => (v < 0 ? String(v) : '+' + v);
        return { text: `Determine the sum of the first <b>${n}</b> terms.`, q: `${t1}${sg(t1 * r)}${sg(t1 * r * r)}${t1 * r * r * r < 0 ? '-' : '+'}\\cdots`,
          a: [`t_1=${t1},\\ r=${r},\\ n=${n}`, `S_{${n}}=\\dfrac{${t1}\\left((${r})^{${n}}-1\\right)}{${r}-1}=${suNum(S)}`] };
      }
    },
    MAS: (rn) => {
      for (;;) {
        const t1 = rn.pick([2, 3, 4, 5, 6]), r = rn.pick([2, 3, 4]), n = rn.int(5, 8), S = geoS(t1, r, n);
        if (S > 100000) continue;
        return { text: `How many terms of the series add to <b>${ftxt(S)}</b>?`, q: `${t1}+${t1 * r}+${t1 * r * r}+\\cdots`,
          a: [`\\dfrac{${t1}(${r}^n-1)}{${r}-1}=${suNum(S)}`, `${r}^n=${suNum(suPow(r, n))}`, `n=${n}`] };
      }
    }
  }
});

/* =============================== mount =============================== */
mountJar();
export const explainers = mountExplainers({ shift, ghost, whichOne, findSum, findN, findR, stairs, ball, phone });
export const _test = { SH, GH, WO, FSm, FN_, BL, PH, geoS, nt };
