/* Math 20-1 · Unit 1 · Lesson 7 — Geometric Series.
 * The explainers (2026-11-11 class format: the old warm-up and the ghost / whichOne / findSum / findR / stairs explainers
 * were removed):
 *   shift (STAR: S_n and rS_n as two rows one place apart, matching terms cancel, rS_n − S_n = t_1r^n − t_1, factor, divide;
 *     general 6-term row, Example 1 check, 2 + 6 + 18 + 54, a penny jar),
 *   findN (isolate the power, then climb a table of powers; Example 4 checks),
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

/* =============================== explainer: shift and subtract (STAR) =============================== */
const SH = {
  gen: { label: `Any ${T('t_1,\\ r')} (6 terms)`, sym: true, n: 6 },
  ex1: { label: 'Example 1 check', t1: 5, r: 2, n: 5 },
  two: { label: T('2+6+18+54'), t1: 2, r: 3, n: 4 },
  jar: { label: 'A penny jar: 1¢ + 2¢ + 4¢ + …', t1: 1, r: 2, n: 5 }
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
          cap: `A penny jar that doubles: after 5 days it holds <b>1¢ less than the next drop</b>. After 30 days: ${T('2S-S=2^{30}-1')}, about <b>$10.7 million</b>.`,
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
export const explainers = mountExplainers({ shift, findN, ball, phone });
export const _test = { SH, FN_, BL, PH, geoS, nt };
