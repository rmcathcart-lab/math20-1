/* Math 20-1 · Unit 1 · Lesson 9 — Unit 1 Review.
 * The explainers (2026-11-11 class format: the old warm-up and the sideBySide / countTerms / twoTerms / threeTerms /
 * sumToTerm explainers were removed):
 *   whichFormula (star: the "which formula?" decision flowchart lights its path for each context, the clue words light
 *     up in the question, and the work panel substitutes; Example 1(a)–(d) checks, two review contexts, rows forever),
 *   findN (solve for n, then a table of values climbs to the target line; Example 6 and 7(b) checks),
 *   bounce (the ball's path: drops and rises as two geometric series; Example 8 checks).
 * Colours: arithmetic blue, geometric green, d / r amber, t1 teal (the course's #a33357), S∞ purple, mistakes red. */
import {
  h, tex, add, box, Box, Flowchart, NumberLine, stamp, stampIn, mountExplainers, pop, fadeIn, appear, sleep, tween,
  svgEl, liveCtx, pulse, drawIn, arrowHead, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const CA = COLORS.blue, CG = COLORS.green, CD = COLORS.amber, C1 = COLORS.teal, CI = COLORS.purple, RED = COLORS.red, INK = COLORS.ink, GRAY = COLORS.gray;
const cA = (s) => `\\textcolor{${CA}}{${s}}`, cG = (s) => `\\textcolor{${CG}}{${s}}`, cD = (s) => `\\textcolor{${CD}}{${s}}`;
const c1 = (s) => `\\textcolor{${C1}}{${s}}`, cI = (s) => `\\textcolor{${CI}}{${s}}`, cR = (s) => `\\textcolor{${RED}}{${s}}`;
/** a number as TeX: rounded to dp places (trailing zeros dropped unless keep), a thin space from 10 000 up (booklet style) */
function tn(v, dp = 4, keep = false) {
  let s = keep ? v.toFixed(dp) : String(parseFloat(v.toFixed(dp)));
  const neg = s.startsWith('-'); if (neg) s = s.slice(1);
  let [i, f] = s.split('.');
  if (i.length > 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');
  return (neg ? '-' : '') + i + (f ? '.' + f : '');
}
/** the same for HTML text (real minus, narrow no-break space) */
const hn = (v, dp = 4, keep = false) => tn(v, dp, keep).replace(/\\,/g, ' ').replace('-', '−');
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const panel = (stage, x, y, w, hh, title, cls = '') => add(stage, box(h('div', 'u1l9-panel ' + cls, title ? `<div class="u1l9-ph">${title}</div>` : ''), w, hh), x, y);
const line = (p, html, cls = '') => { const d = h('div', 'u1l9-line ' + cls, html); p.appendChild(d); return d; };
const lab = (B, x, y, html, cls = '', pos = 'c') => B.hlabel(x, y, html, { cls: 'u1l9-lab ' + cls, pos, gap: 0 });

/* =============================== explainer: which formula? (star) =============================== */
const K1 = (s) => `<span class="u1l9-k u1l9-k1">${s}</span>`, K2 = (s) => `<span class="u1l9-k u1l9-k2">${s}</span>`;
const WF = {
  a: { label: 'Example 1(a)', kind: 'A', want: 'S',
    ask: `(a) A theatre has 24 seats in row 1, and each row has ${K1('3 more seats')} than the row in front of it. How many seats are in ${K2('the first 20 rows')}?`,
    c1: '“3 more seats” each row: the same <b>amount</b> is added.', par: 'd=3', c2: '“in the first 20 rows”: a <b>total</b>.',
    f: 'S_n=\\dfrac{n}{2}\\left[2t_1+(n-1)d\\right]', sub: ['t_1=24,\\ \\ d=3,\\ \\ n=20', 'S_{20}=\\dfrac{20}{2}\\left[2(24)+19(3)\\right]', '=10(105)=1050'], ans: '1050 seats' },
  b: { label: '1(b)', kind: 'G', want: 't',
    ask: `(b) A car bought for $32 000 ${K1('loses 15% of its value each year')}. What is it ${K2('worth 6 years after')} it was bought?`,
    c1: '“loses 15%” each year: the same <b>percent</b>, so multiply by ' + T('1-0.15') + '.', par: 'r=0.85', c2: '“worth … 6 years after”: <b>one value</b>.',
    f: 't_n=t_1r^{\\,n-1}', extra: `Count: $32 000 is the value at <b>time 0</b>, so it is ${T('t_1')}, and 6 years later is ${T('t_7')}.`,
    xline: '\\text{time }0=t_1\\ \\Rightarrow\\ 6\\text{ years}=t_7', sub: ['t_1=32\\,000,\\ \\ r=0.85,\\ \\ n=7', 't_7=32\\,000(0.85)^6', '\\approx 12\\,068.78'], ans: '$12 068.78' },
  c: { label: '1(c)', kind: 'G', want: 'S',
    ask: `(c) A message is sent to 3 people in round 1. After that, everyone who just got it ${K1('sends it to 3 new people')}. How many people get it ${K2('in the first 8 rounds')}?`,
    c1: '“sends it to 3 new people”: each round <b>triples</b>, a fixed multiple.', par: 't_1=3,\\ r=3', c2: '“in the first 8 rounds”: a <b>total</b>.',
    f: 'S_n=\\dfrac{t_1(r^n-1)}{r-1}', sub: ['t_1=3,\\ \\ r=3,\\ \\ n=8', 'S_8=\\dfrac{3(3^8-1)}{3-1}', '=\\dfrac{3(6560)}{2}=9840'], ans: '9840 people' },
  d: { label: '1(d)', kind: 'G', want: 'I',
    ask: `(d) A pendulum’s first swing is 50 cm, and each swing is ${K1('90% as long as the one before')}. What ${K2('total distance')} does it travel if it ${K2('swings forever')}?`,
    c1: '“90% as long”: the same <b>percent</b> each swing.', par: 'r=0.9', c2: '“total distance … forever”: a total that <b>never stops</b>.',
    f: 'S_\\infty=\\dfrac{t_1}{1-r}', extra: `${T('S_\\infty')} only exists if ${T('-1<r<1')}: ${T('r=0.9')} ✓, so the series <b>converges</b>.`,
    xline: '-1<0.9<1\\ \\checkmark', sub: ['t_1=50,\\ \\ r=0.9', 'S_\\infty=\\dfrac{50}{1-0.9}', '=500'], ans: '500 cm' },
  sep: { sep: 'Review:' },
  int: { label: 'Simple interest', kind: 'A', want: 't',
    ask: `$4000 is invested at 3.25% ${K1('simple interest: $130 every year')}. What is the ${K2('value at the end of year 3')}?`,
    c1: '“simple interest”: the same <b>$130</b> is added every year.', par: 'd=130', c2: '“the value at the end of year 3”: <b>one value</b>.',
    f: 't_n=t_1+(n-1)d', extra: `Count: the value at the end of year 1 is ${T('t_1=4000+130=4130')}, so year 3 is ${T('t_3')}.`,
    xline: '\\text{end of year }1:\\ t_1=4130', sub: ['t_1=4130,\\ \\ d=130,\\ \\ n=3', 't_3=4130+2(130)', '=4390'], ans: '$4390' },
  bal: { label: 'Balloon', kind: 'G', want: 'S',
    ask: `A balloon rises 300 m in the first minute; each minute after that it rises ${K1('85% as far')} as the minute before. What is its ${K2('height after 10 minutes')}?`,
    c1: '“85% as far”: the same <b>percent</b> each minute.', par: 'r=0.85', c2: '“height after 10 minutes” adds up all 10 climbs: a <b>total</b>.',
    f: 'S_n=\\dfrac{t_1(r^n-1)}{r-1}', sub: ['t_1=300,\\ \\ r=0.85,\\ \\ n=10', 'S_{10}=\\dfrac{300(0.85^{10}-1)}{0.85-1}', '\\approx 1606.25'], ans: 'about 1606.25 m' },
  inf: { label: 'Rows forever?', kind: 'A', want: 'I',
    ask: `What if the theatre in (a) kept going: each row with ${K1('3 more seats')}, and the rows ${K2('went on forever')}? How many seats altogether?`,
    c1: 'Still 3 more seats each row: the same <b>amount</b>.', par: 'd=3', c2: '“went on forever … altogether”: a total <b>forever</b>.',
    f: '\\text{no }S_\\infty', sub: ['S_{20}=1050', 'S_{100}=17\\,250', 'S_{1000}=1\\,522\\,500'], ans: 'no sum to infinity' }
};
const FC_NODES = {
  q1: { x: 310, y: 30, w: 500, h: 54, html: '<b>Clue 1: add or multiply?</b>the same amount, or the same percent / multiple', cls: 'bk-diamond' },
  ar: { x: 150, y: 112, w: 230, h: 54, html: `<b>Arithmetic</b>add ${T('d')} each time`, color: CA },
  ge: { x: 470, y: 112, w: 230, h: 54, html: `<b>Geometric</b>multiply by ${T('r')}`, color: CG },
  q2a: { x: 150, y: 196, w: 286, h: 54, html: '<b>Clue 2</b>one value, a total, or forever?', cls: 'bk-diamond' },
  q2g: { x: 470, y: 196, w: 286, h: 54, html: '<b>Clue 2</b>one value, a total, or forever?', cls: 'bk-diamond' },
  ta: { x: 52, y: 298, w: 96, h: 76, html: `<b>one value</b>${T('t_n')}`, color: CA },
  sa: { x: 152, y: 298, w: 96, h: 76, html: `<b>a total</b>${T('S_n')}`, color: CA },
  na: { x: 252, y: 298, w: 96, h: 76, html: '<b>forever</b>none!', color: GRAY, cls: 'bk-dashed' },
  tg: { x: 368, y: 298, w: 96, h: 76, html: `<b>one value</b>${T('t_n')}`, color: CG },
  sg: { x: 468, y: 298, w: 96, h: 76, html: `<b>a total</b>${T('S_n')}`, color: CG },
  ig: { x: 568, y: 298, w: 96, h: 76, html: `<b>forever</b>${T('S_\\infty')}`, color: CI }
};
const FC_EDGES = [
  { from: 'q1', to: 'ar', label: 'amount' }, { from: 'q1', to: 'ge', label: 'percent / ×' },
  { from: 'ar', to: 'q2a' }, { from: 'ge', to: 'q2g' },
  { from: 'q2a', to: 'ta' }, { from: 'q2a', to: 'sa' }, { from: 'q2a', to: 'na' },
  { from: 'q2g', to: 'tg' }, { from: 'q2g', to: 'sg' }, { from: 'q2g', to: 'ig' }
];
const hlClue = (ex, n) => { const a = ex.askEl; if (a) a.querySelectorAll('.u1l9-k' + n).forEach((s) => s.classList.add('on')); };
const whichFormula = {
  title: 'Which formula?',
  height: 412,
  minW: 940,
  capH: 84,
  choices: Object.keys(WF).map((k) => (WF[k].sep ? WF[k] : { v: k, label: WF[k].label })),
  ask: (k) => WF[k].ask,
  make(stage, k, ex) {
    const d = WF[k], isA = d.kind === 'A', W = ex.W;
    const F = new Flowchart(stage, { x: 0, y: 2, width: 620, height: 342, nodes: FC_NODES, edges: FC_EDGES, cls: 'u1l9-fc' });
    const leaf = (isA ? { t: 'ta', S: 'sa', I: 'na' } : { t: 'tg', S: 'sg', I: 'ig' })[d.want];
    const mid = isA ? 'ar' : 'ge', q2 = isA ? 'q2a' : 'q2g';
    const clue = add(stage, box(h('div', 'u1l9-clues'), 620, 64), 0, 346);
    const cl1 = hide(line(clue, `<b>Clue 1:</b> ${d.c1}`)), cl2 = hide(line(clue, `<b>Clue 2:</b> ${d.c2}`));
    const PX = 636, P = panel(stage, PX, 2, W - PX - 2, 408, 'Work', 'u1l9-work');
    const fl = hide(line(P, T(d.f), 'u1l9-wf ' + (isA ? 'u1l9-wfa' : d.want === 'I' ? 'u1l9-wfi' : 'u1l9-wfg')));
    const xl = d.xline ? hide(line(P, T(d.xline), 'u1l9-wx')) : null;
    const sl = d.sub.map((s) => hide(line(P, T(s), 'u1l9-ws')));
    const al = hide(line(P, `<b>${d.ans}</b>`, 'u1l9-wans'));
    const st = stamp(stage, d.want === 'I' && isA ? 'divergent' : '✓', { ok: d.want === 'I' && isA ? null : true, x: W - 70, y: 380, size: d.want === 'I' && isA ? 'sm' : undefined }); hide(st);
    const kindW = isA ? '<b class="u1l9-ca">arithmetic</b>' : '<b class="u1l9-cg">geometric</b>';
    const wantW = { t: `one value: use ${T('t_n')}`, S: `a total: use ${T('S_n')}`, I: isA ? `forever? An arithmetic total never settles: there is <b>no</b> ${T('S_\\infty')}` : `a total forever: use ${T('S_\\infty')}` }[d.want];
    const steps = [
      { cap: `<b>Clue 1: add or multiply?</b> ${d.c1}`, run: async (c) => { hlClue(ex, 1); await F.visit(c, 'q1'); await show(c, cl1); } },
      { cap: `So it’s ${kindW}, with ${T(cD(d.par))}.`, run: async (c) => { await F.go(c, 'q1', mid); await F.visit(c, mid); } },
      { cap: `<b>Clue 2: one value, a total, or forever?</b> ${d.c2}`, run: async (c) => { hlClue(ex, 2); await F.go(c, mid, q2); await F.visit(c, q2); await show(c, cl2); } },
      { cap: `${isA ? 'Arithmetic' : 'Geometric'}, ${wantW}.`, run: async (c) => { await F.go(c, q2, leaf); await F.visit(c, leaf); await show(c, fl); } }
    ];
    if (d.extra) steps.push({ cap: d.extra, run: (c) => show(c, xl) });
    if (d.want === 'I' && isA) {
      steps.push({ cap: `The running totals just keep growing: ${T('S_{20}=1050')}, ${T('S_{100}=17\\,250')}, ${T('S_{1000}=1\\,522\\,500')}, …`, run: async (c) => { for (const s of sl) await show(c, s); } });
      steps.push({ cap: `<b>No sum to infinity.</b> Only a geometric series with ${T('-1<r<1')} has one.`, run: async (c) => { await show(c, al); st.style.opacity = 1; await stampIn(c, st); } });
    } else {
      steps.push({ cap: `Substitute: ${T(d.sub[0])}.`, run: async (c) => { await show(c, sl[0]); await show(c, sl[1]); } });
      steps.push({ cap: `Work it out: <b>${d.ans}</b>.`, run: async (c) => { for (const s of sl.slice(2)) await show(c, s); await show(c, al); st.style.opacity = 1; await stampIn(c, st); } });
    }
    return steps;
  }
};

/* =============================== explainer: finding n =============================== */
const FN = {
  a: { label: 'Example 6(a) check', f: (n) => n * (n + 2), n0: 1, n1: 15, target: 255, mode: 'eq', ylab: 'S_n',
    alg: ['\\dfrac{n}{2}\\left[2(3)+(n-1)(2)\\right]=255', '\\dfrac{n}{2}(2n+4)=255', 'n(n+2)=255', 'n^2+2n-255=0', '(n+17)(n-15)=0', 'n=15\\quad(\\text{not }n=-17)'], groups: [[0], [1, 2, 3], [4, 5]],
    caps: [`Set the sum formula equal to 255: ${T('\\dfrac{n}{2}\\left[2(3)+(n-1)(2)\\right]=255')}.`,
      `Simplify: ${T('\\dfrac{n}{2}(2n+4)=n(n+2)')}, so ${T('n(n+2)=255')}. That is a <b>quadratic</b>: ${T('n^2+2n-255=0')}.`,
      `Factor: ${T('(n+17)(n-15)=0')}. ${T('n=-17')} is impossible for a number of terms, so ${T('n=15')}.`,
      `Check with the running totals ${T('S_1,\\ S_2,\\ \\dots')}: they reach <b>255</b> exactly at ${T('n=15')} ✓`] },
  b: { label: 'Example 6(b) check', f: (n) => 5 * (2 ** n - 1), n0: 1, n1: 10, target: 5115, mode: 'eq', ylab: 'S_n',
    alg: ['\\dfrac{5(2^n-1)}{2-1}=5115', '2^n-1=1023', '2^n=1024', '2^9=512,\\ \\ 2^{10}=1024', 'n=10'], groups: [[0], [1, 2], [3, 4]],
    caps: [`Set the geometric sum formula equal to 5115: ${T('\\dfrac{5(2^n-1)}{2-1}=5115')}.`,
      `Divide by 5 and add 1: ${T('2^n=1024')}. Now ${T('n')} is an <b>exponent</b>.`,
      `Try powers of 2: ${T('2^9=512')}, ${T('2^{10}=1024')} ✓. So ${T('n=10')}.`,
      `The running totals ${T('5,\\ 15,\\ 35,\\ \\dots')} hit 5115 exactly at ${T('n=10')} ✓`] },
  c: { label: 'Example 7(b) check', f: (n) => 8400 * 1.035 ** n, n0: 0, n1: 11, target: 12000, mode: 'over', base: 7000, ylab: '8400(1.035)^n',
    alg: ['8400(1.035)^n>12\\,000', 'n=10:\\ \\approx11\\,849', 'n=11:\\ \\approx12\\,264', '\\text{after 11 years}'],
    caps: [`We want the first ${T('n')} with ${T('8400(1.035)^n>12\\,000')}. ${T('n')} is an exponent, so make a <b>table</b>.`,
      `Grow the population one year at a time (each bar is ${T('\\times1.035')}).`,
      `${T('n=10')} gives about ${T('11\\,849')}: <b>not yet</b> over 12 000.`,
      `${T('n=11')} gives about ${T('12\\,264')}: the first one over. <b>After 11 years.</b>`] },
  d: { label: 'Balloon: under 30 m', f: (n) => 300 * 0.85 ** (n - 1), n0: 1, n1: 16, target: 30, mode: 'under', ylab: 't_n',
    alg: ['300(0.85)^{n-1}<30', '0.85^{n-1}<0.1', 'n=15:\\ \\approx30.83', 'n=16:\\ \\approx26.21', '\\text{the 16th minute}'],
    caps: [`The climb in minute ${T('n')} is ${T('t_n=300(0.85)^{n-1}')}. When is it first <b>under 30 m</b>? ${T('300(0.85)^{n-1}<30')}.`,
      `Make a table: each minute’s climb is ${T('\\times0.85')} of the one before.`,
      `${T('n=15')}: about ${T('30.83')} m, still not under 30.`,
      `${T('n=16')}: about ${T('26.21')} m, the first under 30. The <b>16th minute</b>.`] }
};
const findN = {
  title: 'Finding n',
  height: 440,
  minW: 900,
  capH: 84,
  choices: Object.keys(FN).map((k) => ({ v: k, label: FN[k].label })),
  intro: 'Solve for n, then check with a table of values. Press <b>Next</b>.',
  make(stage, key, ex) {
    const d = FN[key], W = ex.W, ns = []; for (let n = d.n0; n <= d.n1; n++) ns.push(n);
    const vals = ns.map(d.f), CW = 600, B = new Box(stage, { x: 0, y: 0 }, 'u1l9-fnbox', CW, 440);
    const L = 64, R = CW - 12, base = 392, top = 30, lo = d.base || 0, hi = Math.max(...vals, d.target) * 1.06;
    const Y = (v) => base - ((v - lo) / (hi - lo)) * (base - top), slot = (R - L) / ns.length, X = (i) => L + (i + 0.5) * slot, bw = Math.min(30, slot - 6);
    svgEl('line', { x1: L - 6, y1: base, x2: R, y2: base, stroke: '#6a7182', 'stroke-width': 2 }, B.svg);
    svgEl('line', { x1: L - 6, y1: top - 10, x2: L - 6, y2: base, stroke: '#6a7182', 'stroke-width': 2 }, B.svg);
    if (lo) { svgEl('path', { d: `M${L - 14} ${base - 18} l8 -6 l8 6`, fill: 'none', stroke: '#6a7182', 'stroke-width': 2 }, B.svg); lab(B, L - 12, base, T(tn(lo)), 'u1l9-nlab', 'w'); }
    ns.forEach((n, i) => { if (ns.length <= 12 || n % 2 === 1 || i === ns.length - 1) lab(B, X(i), base + 14, String(n), 'u1l9-nlab'); });
    lab(B, R, base + 34, T('n'), 'u1l9-nlab', 'w');
    lab(B, L + 4, top - 14, T(d.ylab), 'u1l9-ctitle', 'e');
    const ty = Y(d.target);
    svgEl('line', { x1: L - 6, y1: ty, x2: R, y2: ty, stroke: RED, 'stroke-width': 2.5, 'stroke-dasharray': '9 6' }, B.svg);
    lab(B, L - 10, ty, T(cR(tn(d.target))), 'u1l9-tgtlab', 'w');
    const bars = vals.map((v, i) => { const r = svgEl('rect', { x: X(i) - bw / 2, y: Y(v), width: bw, height: base - Y(v), rx: 3, fill: '#8fb6e4' }, B.svg); r.style.opacity = 0; return r; });
    const hitI = d.mode === 'eq' ? vals.findIndex((v) => Math.abs(v - d.target) < 1e-9) : d.mode === 'over' ? vals.findIndex((v) => v > d.target) : vals.findIndex((v) => v < d.target);
    const vlab = (i, left) => lab(B, left ? X(i) - bw / 2 - 2 : X(i), Y(vals[i]) - (left ? 2 : 14), T(tn(vals[i], d.mode === 'under' ? 2 : 0)), 'u1l9-vlab', left ? 'w' : 'c');
    const PX = CW + 20, P = panel(stage, PX, 0, W - PX - 2, 438, '', 'u1l9-alg u1l9-fnp');
    const ls = d.alg.map((s, i) => hide(line(P, T(s), 'u1l9-algl' + (i === d.alg.length - 1 ? ' u1l9-big' : ''))));
    const st = stamp(stage, '✓', { x: Math.min(CW - 30, X(hitI) + 6), y: Math.max(36, Math.min(Y(vals[hitI]), ty) - 50) }); hide(st);
    const growTo = async (c, upto, ms = 90) => { for (let i = 0; i <= upto; i++) if (bars[i].style.opacity !== '1') { bars[i].style.opacity = 1; await appear(c, bars[i], ms); } };
    const mark = (i, color) => { bars[i].setAttribute('fill', color); };
    if (d.mode === 'eq') {
      return [
        ...d.groups.map((gp, j) => ({ cap: d.caps[j], run: async (c) => { for (const i of gp) await show(c, ls[i]); } })),
        { cap: d.caps[3], run: async (c) => { await growTo(c, hitI); mark(hitI, CD); vlab(hitI); st.style.opacity = 1; await stampIn(c, st); } }
      ];
    }
    return [
      { cap: d.caps[0], run: (c) => show(c, ls[0]) },
      { cap: d.caps[1], run: async (c) => { if (ls.length > 4) await show(c, ls[1]); await growTo(c, hitI - 1); } },
      { cap: d.caps[2], run: async (c) => { mark(hitI - 1, '#b9bfc9'); vlab(hitI - 1, true); await show(c, ls[ls.length - 3]); } },
      { cap: d.caps[3], run: async (c) => { await growTo(c, hitI); mark(hitI, CD); vlab(hitI); await show(c, ls[ls.length - 2]); await show(c, ls[ls.length - 1]); st.style.opacity = 1; await stampIn(c, st); } }
    ];
  }
};

/* =============================== explainer: the bouncing ball =============================== */
const BB = {
  a: { label: 'Example 8(a) check', rises: 4, mode: 'a' },
  b: { label: 'Example 8(b) check', rises: 4, mode: 'b' },
  c: { label: 'Example 8(c) check', rises: 9, mode: 'c' }
};
const bounce = {
  title: 'The bouncing ball',
  height: 440,
  minW: 900,
  capH: 84,
  choices: Object.keys(BB).map((k) => ({ v: k, label: BB[k].label })),
  intro: 'Dropped from 15 m; each bounce rises to 70% of the fall. Press <b>Next</b>.',
  make(stage, key, ex) {
    const d = BB[key], W = ex.W, CW = 560, B = new Box(stage, { x: 0, y: 0 }, 'u1l9-bbbox', CW, 440);
    const ground = 392, Y = (m) => ground - m * 21.5, x0 = 70, hs = [15]; for (let k = 1; k <= d.rises; k++) hs.push(15 * 0.7 ** k);
    const wsc = d.mode === 'c' ? 92 : 122, widths = hs.slice(1).map((v) => wsc * Math.sqrt(v / 10.5));
    svgEl('rect', { x: 0, y: ground, width: CW, height: 48, fill: '#e8e2d6' }, B.svg);
    svgEl('line', { x1: 0, y1: ground, x2: CW, y2: ground, stroke: '#6a7182', 'stroke-width': 2.5 }, B.svg);
    for (let m = 0; m <= 15; m += 5) { svgEl('line', { x1: 30, y1: Y(m), x2: 38, y2: Y(m), stroke: '#6a7182', 'stroke-width': 1.6 }, B.svg); lab(B, 26, Y(m), String(m), 'u1l9-rulab', 'w'); }
    svgEl('line', { x1: 34, y1: Y(15), x2: 34, y2: ground, stroke: '#6a7182', 'stroke-width': 1.6 }, B.svg);
    lab(B, 34, Y(15) - 18, 'm', 'u1l9-rulab');
    // the path: a drop, then for each bounce a rise half (green) and a fall half (blue)
    const segs = [], hits = [x0];
    segs.push({ kind: 'down', pts: [[x0, Y(15)], [x0, ground]], h: 15 });
    let xs = x0;
    widths.forEach((w, i) => {
      const hgt = hs[i + 1], up = [], dn = [];
      for (let j = 0; j <= 14; j++) { const t = j / 14, x = xs + t * w / 2, yy = ground - (ground - Y(hgt)) * (1 - (1 - t) ** 2); up.push([x, yy]); }
      for (let j = 0; j <= 14; j++) { const t = j / 14, x = xs + w / 2 + t * w / 2, yy = Y(hgt) + (ground - Y(hgt)) * t * t; dn.push([x, yy]); }
      segs.push({ kind: 'up', pts: up, h: hgt, k: i + 1 }); segs.push({ kind: 'down', pts: dn, h: hgt, k: i + 1 });
      xs += w; hits.push(xs);
    });
    const pd = (pts) => 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L');
    const segEls = segs.map((s) => { const p = svgEl('path', { class: 'bk-stroke', d: pd(s.pts), fill: 'none', stroke: '#9aa0ab', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, B.svg); p.style.opacity = 0; return p; });
    const dropLab = hide(lab(B, x0 - 12, Y(7.5), T('15'), 'u1l9-hgt u1l9-hdown', 'w'));
    const peakLab = hs.slice(1).map((v, i) => { const s = segs[1 + 2 * i], pk = s.pts[s.pts.length - 1]; return hide(lab(B, pk[0], pk[1] - 16, i < 4 ? T(tn(v)) : '', 'u1l9-hgt')); });
    const hitLab = hits.map((x, i) => hide(lab(B, x, ground + 20, String(i + 1), 'u1l9-hitn' + (d.mode === 'c' ? ' u1l9-none' : ''))));
    const ball = svgEl('circle', { cx: x0, cy: Y(15) - 11, r: 11, fill: '#e2574c', stroke: '#9b2c24', 'stroke-width': 2 }, B.svg);
    const roll = async (c, from, to, ms) => { // move the ball along segments [from, to)
      for (let i = from; i < to; i++) {
        const s = segs[i], el = segEls[i]; el.style.opacity = 1;
        if (!c.fast) await drawIn(el, ms, c);
        const p = s.pts[s.pts.length - 1]; ball.setAttribute('cx', p[0]); ball.setAttribute('cy', p[1] - 11);
        if (s.kind === 'down') { const hi = s.k == null ? 0 : s.k; hitLab[hi].style.opacity = 1; }
        else if (peakLab[s.k - 1]) peakLab[s.k - 1].style.opacity = 1;
      }
      if (from === 0) dropLab.style.opacity = 1;
    };
    const colour = () => segs.forEach((s, i) => { segEls[i].setAttribute('stroke', s.kind === 'up' ? CG : CA); });
    const PX = CW + 16, P = panel(stage, PX, 0, W - PX - 2, 438, '', 'u1l9-alg u1l9-bbp');
    const L = (s, cls = '') => hide(line(P, s, 'u1l9-algl ' + cls));
    const leg = add(stage, h('div', 'u1l9-bbleg', `<span class="u1l9-ca">━ down</span> <span class="u1l9-cg">━ up</span>`), CW - 10, 14); leg.style.translate = '-100% 0'; hide(leg);
    const allSegs = segs.length;
    if (d.mode === 'a') {
      const l1 = L(T('\\text{rises: }' + cG('10.5,\\ 7.35,\\ 5.145,\\ 3.6015'))), l2 = L(T('t_n=15(0.7)^n')), l3 = L(T('t_4=15(0.7)^4\\approx3.60\\text{ m}'), 'u1l9-big');
      return [
        { cap: `The ball falls 15 m to the ground. That first <b>drop</b> is not a rise.`, run: (c) => roll(c, 0, 1, 500) },
        { cap: `Each bounce rises to 70% of the fall before it: ${T(cG('15(0.7)=10.5'))}, then ${T(cG('7.35'))}, ${T(cG('5.145'))}, ${T(cG('3.6015'))}.`, run: async (c) => { await roll(c, 1, allSegs, 260); await show(c, l1); } },
        { cap: `The rises are ${T('15(0.7)^1,\\ 15(0.7)^2,\\ \\dots')}, so ${T('t_n=15(0.7)^n')}.`, run: (c) => show(c, l2) },
        { cap: `After the 4th bounce: ${T('t_4=15(0.7)^4\\approx3.60')} m (to the nearest hundredth).`, run: async (c) => { peakLab[3].classList.add('u1l9-hgton'); await pulse(c, peakLab[3], 1.25); await show(c, l3); } }
      ];
    }
    if (d.mode === 'b') {
      const l1 = L(`<b class="u1l9-ca">Down:</b> ${T(cA('15+10.5+7.35+5.145+3.6015'))}`, 'u1l9-small'), l2 = L(T('S_5=\\dfrac{15(1-0.7^5)}{0.3}\\approx41.5965'));
      const l3 = L(`<b class="u1l9-cg">Up:</b> ${T(cG('10.5+7.35+5.145+3.6015'))}`, 'u1l9-small'), l4 = L(T('S_4=\\dfrac{10.5(1-0.7^4)}{0.3}\\approx26.5965'));
      const l5 = L(T('\\text{Total}\\approx68.19\\text{ m}'), 'u1l9-big');
      return [
        { cap: `Follow the ball until it hits the ground for the <b>5th</b> time.`, run: (c) => roll(c, 0, allSegs, 230) },
        { cap: `Count: 5 hits means <b>5 drops</b> (blue) but only <b>4 rises</b> (green). The 5th hit ends with a drop.`, run: async (c) => { colour(); leg.style.opacity = 1; for (const hl of hitLab) await pulse(c, hl, 1.3, 220); } },
        { cap: `Drops: a geometric series with ${T(c1('t_1=15'))}, ${T(cD('r=0.7'))}, ${T('n=5')}. ${T('S_5\\approx41.5965')} m.`, run: async (c) => { await show(c, l1); await show(c, l2); } },
        { cap: `Rises: it starts with the <b>first rebound</b>, ${T(c1('t_1=10.5'))}, ${T(cD('r=0.7'))}, ${T('n=4')}. ${T('S_4\\approx26.5965')} m.`, run: async (c) => { await show(c, l3); await show(c, l4); } },
        { cap: `Add the two series: ${T('41.5965+26.5965\\approx68.19')}, so about <b>68.19 m</b>. Round only at the end.`, run: (c) => show(c, l5) }
      ];
    }
    const l1 = L(`${T('-1<0.7<1')}: both series converge`), l2 = L(`<b class="u1l9-ca">Down:</b> ${T('\\dfrac{15}{1-0.7}=\\dfrac{15}{0.3}=50')}`);
    const l3 = L(`<b class="u1l9-cg">Up:</b> ${T('\\dfrac{10.5}{1-0.7}=\\dfrac{10.5}{0.3}=35')}`), l4 = L(T('\\text{Total}=50+35=85\\text{ m}'), 'u1l9-big');
    const l5 = L(`<span class="muted">Check: every rise is matched by an equal fall, plus the first 15 m drop: ${T('2(35)+15=85')} ✓</span>`, 'u1l9-small');
    return [
      { cap: `Let it bounce forever. The bounces get smaller and smaller…`, run: async (c) => { await roll(c, 0, allSegs, 150); colour(); leg.style.opacity = 1; } },
      { cap: `Forever means an <b>infinite</b> series, and ${T(cD('r=0.7'))} is between ${T('-1')} and ${T('1')}, so ${T(cI('S_\\infty'))} exists for the drops and for the rises.`, run: (c) => show(c, l1) },
      { cap: `Drops: ${T(cI('S_\\infty=\\dfrac{15}{1-0.7}=50'))} m.`, run: (c) => show(c, l2) },
      { cap: `Rises (starting at 10.5): ${T(cI('S_\\infty=\\dfrac{10.5}{0.3}=35'))} m.`, run: (c) => show(c, l3) },
      { cap: `Total: ${T('50+35=85')} m. A ball that bounces forever still travels a <b>finite</b> distance.`, run: async (c) => { await show(c, l4); await show(c, l5); } }
    ];
  }
};

/* =============================== Stand Up Break =============================== */
const money = (v) => '\\$' + tn(v, 2, true);
const SU_CTX = [
  (r) => { const a = r.int(14, 30), k = r.int(2, 5), n = r.int(15, 30); return { text: `A theatre has <b>${a}</b> seats in row 1, and each row has <b>${k} more</b> seats than the row in front of it. How many seats are in <b>row ${n}</b>?`,
    a: [`\\text{Arithmetic }(d=${k})\\text{, one value: }t_{${n}}`, `t_{${n}}=${a}+${n - 1}(${k})=${a + (n - 1) * k}\\text{ seats}`] }; },
  (r) => { const a = r.int(5, 15), k = r.int(2, 4), n = r.int(10, 20); const S = n / 2 * (2 * a + (n - 1) * k); return { text: `Maya saves <b>$${a}</b> in week 1, and each week she saves <b>$${k} more</b> than the week before. How much has she saved <b>altogether</b> after ${n} weeks?`,
    a: [`\\text{Arithmetic }(d=${k})\\text{, a total: }S_{${n}}`, `S_{${n}}=\\tfrac{${n}}{2}\\left[2(${a})+${n - 1}(${k})\\right]=${money(S)}`] }; },
  (r) => { const a = r.pick([50, 100, 200, 250]), n = r.int(6, 10); return { text: `A culture has <b>${a}</b> bacteria in hour 1, and the number <b>doubles</b> every hour. How many bacteria are there in <b>hour ${n}</b>?`,
    a: [`\\text{Geometric }(r=2)\\text{, one value: }t_{${n}}`, `t_{${n}}=${a}(2)^{${n - 1}}=${tn(a * 2 ** (n - 1))}`] }; },
  (r) => { const a = r.int(2, 5), m = r.pick([2, 3, 4]), n = r.int(5, 8); const S = a * (m ** n - 1) / (m - 1); return { text: `A post is shared with <b>${a}</b> people in round 1. After that, each person who just got it shares it with <b>${m} new people</b>. How many people get it <b>in the first ${n} rounds</b>?`,
    a: [`\\text{Geometric }(r=${m})\\text{, a total: }S_{${n}}`, `S_{${n}}=\\dfrac{${a}(${m}^{${n}}-1)}{${m}-1}=${tn(S)}`] }; },
  (r) => { const a = r.pick([40, 60, 80, 120]), p = r.pick([75, 80, 90]); return { text: `A swing’s first arc is <b>${a} cm</b>, and each arc is <b>${p}%</b> as long as the one before. What <b>total</b> distance does it swing if it goes on <b>forever</b>?`,
    a: [`\\text{Geometric }(r=${p / 100})\\text{, forever: }S_\\infty`, `S_\\infty=\\dfrac{${a}}{1-${p / 100}}=${tn(a / (1 - p / 100), 2)}\\text{ cm}`] }; },
  (r) => { const a = r.pick([800, 1200, 1500]), p = r.pick([10, 20, 25]), n = r.int(3, 5); const v = a * (1 - p / 100) ** n; return { text: `A <b>$${a}</b> phone loses <b>${p}%</b> of its value each year. What is it worth <b>${n} years after</b> it was bought?`,
    a: [`\\text{Geometric }(r=${1 - p / 100})\\text{, one value: time 0 is }t_1\\text{, so }t_{${n + 1}}`, `t_{${n + 1}}=${a}(${1 - p / 100})^{${n}}\\approx${money(v)}`] }; }
];
standup('u1l9', {
  intro: 'At your whiteboard: decide arithmetic or geometric, and term, sum or sum to infinity. Then solve it.',
  levels: {
    BEG: (r) => { const q = r.pick(SU_CTX)(r); return { text: '<b>Arithmetic or geometric? Term, sum or sum to infinity?</b> Then answer it.<br>' + q.text, q: '', a: q.a }; },
    PRG: (r) => { // two terms known
      if (r.chance(0.5)) {
        const d = r.int(2, 7) * r.sign(), t1 = r.int(-10, 20), p = r.int(2, 5), q = p + r.int(3, 7), n = r.int(20, 40);
        const tp = t1 + (p - 1) * d, tq = t1 + (q - 1) * d;
        return { text: `In an <b>arithmetic</b> sequence, two terms are given. Determine ${'<i>d</i>'}, ${'<i>t</i><sub>1</sub>'}, the general term and ${`<i>t</i><sub>${n}</sub>`}.`,
          q: `t_{${p}}=${tp},\\qquad t_{${q}}=${tq}`,
          a: [`${q - p}d=${tq}-(${tp})=${tq - tp}\\Rightarrow d=${d}`, `t_1=${tp}-${p - 1}(${d})=${t1}`, `t_n=${t1}+(n-1)(${d})=${d}n${t1 - d < 0 ? '-' : '+'}${Math.abs(t1 - d)}`, `t_{${n}}=${t1 + (n - 1) * d}`] };
      }
      const rr = r.pick([2, 3, -2, -3]), t1 = r.int(1, 5) * r.sign(), p = r.int(2, 3), q = p + 3;
      const tp = t1 * rr ** (p - 1), tq = t1 * rr ** (q - 1), S = t1 * (rr ** 6 - 1) / (rr - 1);
      return { text: 'In a <b>geometric</b> sequence, two terms are given. Determine <i>r</i>, <i>t</i><sub>1</sub>, the general term and <i>S</i><sub>6</sub>.',
        q: `t_{${p}}=${tp},\\qquad t_{${q}}=${tq}`,
        a: [`${tp < 0 ? '(' + tp + ')' : tp}r^{${q - p}}=${tq}\\Rightarrow r^{${q - p}}=${tq / tp}\\Rightarrow r=${rr}`, `t_1=${t1}`, `t_n=${t1}(${rr})^{n-1}`, `S_6=\\dfrac{${t1}\\left[(${rr})^6-1\\right]}{${rr}-1}=${S}`] };
    },
    MAS: (r) => {
      const kind = r.int(0, 2);
      if (kind === 0) { // arithmetic: how many terms
        const a = r.int(1, 6), d = r.int(2, 4), n = r.int(8, 16), S = n / 2 * (2 * a + (n - 1) * d);
        return { text: `How many terms of the arithmetic series must be added to get a sum of <b>${S}</b>?`, q: `${a}+${a + d}+${a + 2 * d}+\\dots`,
          a: [`\\dfrac{n}{2}\\left[2(${a})+(n-1)(${d})\\right]=${S}`, `${d}n^2${2 * a - d < 0 ? '-' : '+'}${Math.abs(2 * a - d)}n-${2 * S}=0`, `n=${n}\\ (\\text{the other root is negative})`] };
      }
      if (kind === 1) { // geometric: how many terms
        const a = r.int(2, 5), m = r.pick([2, 3]), n = r.int(5, 8), S = a * (m ** n - 1) / (m - 1);
        return { text: `How many terms of the geometric series add to <b>${S}</b>?`, q: `${a}+${a * m}+${a * m * m}+\\dots`,
          a: [`\\dfrac{${a}(${m}^n-1)}{${m}-1}=${S}`, `${m}^n=${m ** n}`, `n=${n}`] };
      }
      const hgt = r.pick([8, 10, 12, 16, 20]), p = r.pick([50, 60, 75, 80]), rr = p / 100, up = hgt * rr / (1 - rr), dn = hgt / (1 - rr);
      return { text: `A ball is dropped from <b>${hgt} m</b>. Each bounce rises to <b>${p}%</b> of the height it fell from. What total vertical distance does it travel if it bounces <b>forever</b>?`, q: '',
        a: [`\\text{Down: }\\dfrac{${hgt}}{1-${rr}}=${tn(dn, 2)}`, `\\text{Up: }\\dfrac{${tn(hgt * rr)}}{1-${rr}}=${tn(up, 2)}`, `\\text{Total}=${tn(dn + up, 2)}\\text{ m}`] };
    }
  }
});

/* =============================== mount =============================== */
export const explainers = mountExplainers({ whichFormula, findN, bounce });
export const _test = { tn, WF, FN, BB };
