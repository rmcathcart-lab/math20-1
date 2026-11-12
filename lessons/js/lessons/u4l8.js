/* Math 20-1 · Unit 4 · Lesson 8 — Unit 4 Review (no calculator).
 * New format (2026-11-11): the warm-up is plain markup on the page (no code). Explainers:
 *   machine (STAR: the factoring checklist as a sorting machine. An expression drops from the hopper onto a belt, the
 *     GCF gate pulls out a common factor, the terms gate counts the terms, a chute routes it to one of seven stations
 *     (difference of squares, x² + bx + c, decomposition, perfect square, substitution, grouping, does not factor),
 *     the factors land in the tray, any factor that still factors goes round again, then the factored form is expanded
 *     back and stamped. The summary table's examples, Example 1 checks and three review questions),
 *   kHunt (Example 3: the factor cards with the candidate binomial sliding over them; the factor pairs of −12 giving
 *     every k on a number line; the (3x ± 7)² area square giving k = ±42),
 *   frame (Example 6 to scale: the frame grows around the photo with a live area readout, the equation, −29
 *     inadmissible, 28 × 38 = 1 064 ✓),
 *   radGraph (each side of a radical equation as a graph: they meet at the root; the mirror graph meets at the
 *     extraneous root; Example 7(b) and 8 and two more).
 * Colours: GCF rose (#a33357), chunk A / squaring amber, B blue, roots / zero product blue, radicals purple,
 *   checks and admissible green, extraneous / inadmissible / errors red. No calculator in Unit 4. */
import {
  h, tex, add, box, Graph, NumberLine, ValueTable, stamp, stampIn, checkCard, mountExplainers, pop, fadeIn, sleep,
  tween, svgEl, pulse, shake, anim, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const GCF = '#a33357', AMB = COLORS.amber, BLU = COLORS.blue, GRN = COLORS.green, PUR = COLORS.purple, RED = COLORS.red;
const INK = COLORS.ink, GRAY = COLORS.gray, BRAND = '#7a1f3d', TEAL = '#0e7c86';
const K = (c, s) => `\\textcolor{${c}}{${s}}`;
const cA = (s = 'A') => K(AMB, s), cB = (s = 'B') => K(BLU, s);
const bA = (s) => `\\fcolorbox{${AMB}}{#fff4dd}{$${s}$}`, bB = (s) => `\\fcolorbox{${BLU}}{#e6eefc}{$${s}$}`;
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
const panel = (stage, x, y, w, hh, title, cls = '') => div(stage, 'u4l8-panel ' + cls, title ? `<div class="u4l8-ph">${title}</div>` : '', x, y, w, hh);
const lineIn = (p, html, cls = '') => { const d = h('div', 'u4l8-line ' + cls, html); p.appendChild(d); hide(d); return d; };
/* a maths line; a leading '#' makes it a small working note (a product–sum hunt, a substitution) */
const mline = (p, t, cls = '') => (t.startsWith('#') ? lineIn(p, T(t.slice(1)), 'u4l8-note ' + cls) : lineIn(p, T(t), cls));
const stampAt = (host, text, ok, x, y, o = {}) => hide(stamp(host, text, Object.assign({ ok, x, y }, o)));
const drawOn = (c, G, el, ms = 800) => { el.style.opacity = ''; return G.drawIn(el, ms, c); };
const hideP = (p) => { hide(p); if (p.label) hide(p.label); return p; };
const popP = (c, p) => Promise.all([pop(c, p), p.label ? show(c, p.label) : null]);
const moveTo = (c, el, x, y, ms = 500, to = {}) => anim(c, el, [{ left: el.style.left, top: el.style.top, opacity: el.style.opacity || 1, transform: el.style.transform || 'none' },
  Object.assign({ left: x + 'px', top: y + 'px', opacity: el.style.opacity || 1, transform: el.style.transform || 'none' }, to)], ms);
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
/* TeX for a polynomial: poly([2, -3, 1], ['x^2', 'x', '']) → 2x^2-3x+1 */
const poly = (cs, vs) => { let out = ''; cs.forEach((k, i) => { if (!k) return; const m = Math.abs(k), v = vs[i]; out += (k < 0 ? '-' : out ? '+' : '') + (v ? (m === 1 ? '' : m) + v : m); }); return out || '0'; };
const lin = (a, b, v = 'x') => poly([a, b], [v, '']);
const frac = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d) || 1; n /= g; d /= g; return d === 1 ? String(n) : `${n < 0 ? '-' : ''}\\frac{${Math.abs(n)}}{${d}}`; };

/* ====================================================================================================
 * STAR: the factoring machine
 * ==================================================================================================== */
const STN = [
  { k: 'dos', name: 'Difference of squares', sub: `2 terms · ${T('A^2-B^2')}`, color: PUR },
  { k: 'tri', name: T('x^2+bx+c'), sub: `3 terms · product ${T('c')}, sum ${T('b')}`, color: GRN },
  { k: 'dec', name: 'Decomposition', sub: `3 terms · product ${T('ac')}, sum ${T('b')}`, color: BLU },
  { k: 'ps', name: 'Perfect square', sub: `3 terms · ${T('A^2\\pm2AB+B^2')}`, color: TEAL },
  { k: 'sub', name: 'Substitution', sub: '3 terms · a repeated chunk', color: AMB },
  { k: 'grp', name: 'Grouping', sub: '4 terms · in pairs', color: BRAND },
  { k: 'no', name: 'Does not factor', sub: 'a sum of squares · no pair', color: RED }
];
const WHY = {
  dos: 'Both terms are squares, <b>subtracted</b>: a <b>difference of squares</b>.',
  tri: `Leading coefficient 1: <b>${T('x^2+bx+c')}</b>.`,
  dec: 'Leading coefficient not 1: <b>decomposition</b>.',
  ps: 'First and last terms are squares: test for a <b>perfect square</b>.',
  sub: 'A <b>repeated chunk</b>: <b>substitution</b>.',
  grp: 'Four terms: <b>grouping</b>.'
};
const MC = {
  grp: { label: 'grouping', e: 'x^3-4x^2+3x-12', terms: ['x^3', '-4x^2', '+3x', '-12'], st: 'grp',
    how: 'group in pairs, take the GCF of each pair, then the common binomial.',
    work: ['=x^2(x-4)+3(x-4)', '=(x-4)(x^2+3)'], fac: ['x-4', 'x^2+3'],
    done: `${T('x-4')} is linear and ${T('x^2+3')} is a sum`, fin: '(x-4)(x^2+3)',
    chk: ['(x-4)(x^2+3)=x^3+3x-4x^2-12', '=x^3-4x^2+3x-12'] },
  dec: { label: 'decomposition', e: '6x^2+7x-3', terms: ['6x^2', '+7x', '-3'], st: 'dec',
    how: `product ${T('ac=-18')} and sum ${T('7')}: ${T('9')} and ${T('-2')}. Split the middle term and group.`,
    work: ['#ac=-18:\\ 9+(-2)=7', '=6x^2+9x-2x-3', '=3x(2x+3)-(2x+3)', '=(2x+3)(3x-1)'], fac: ['2x+3', '3x-1'],
    done: 'both factors are linear', fin: '(2x+3)(3x-1)', chk: ['(2x+3)(3x-1)=6x^2-2x+9x-3', '=6x^2+7x-3'] },
  ps: { label: 'perfect square', e: '9x^2-30x+25', terms: ['9x^2', '-30x', '+25'], st: 'ps',
    how: `${T('9x^2=(3x)^2')} and ${T('25=5^2')}, and the middle is ${T('2AB=2(3x)(5)=30x')} (with a minus sign).`,
    work: ['#9x^2=(3x)^2,\\ 25=5^2,\\ 2(3x)(5)=30x', '=(3x-5)^2'], fac: ['3x-5', '3x-5'],
    done: 'the factor is linear (it appears twice)', fin: '(3x-5)^2', chk: ['(3x-5)^2=9x^2-15x-15x+25', '=9x^2-30x+25'] },
  dos: { label: 'diff. of squares', e: 'x^4-81', terms: ['x^4', '-81'], st: 'dos',
    how: `${T('x^4=(x^2)^2')} and ${T('81=9^2')}: ${T('A=x^2')}, ${T('B=9')}.`,
    work: ['#A=x^2,\\ B=9', '=(x^2-9)(x^2+9)'], fac: ['x^2-9', 'x^2+9'],
    again: [{ of: 'x^2-9', st: 'dos', cap: `${T('x^2-9=x^2-3^2')} is a difference of squares <b>again</b>.`, work: 'x^2-9=(x-3)(x+3)', res: ['x-3', 'x+3'] }],
    done: `${T('x^2+9')} is a <b>sum</b> of squares: it stays`, fin: '(x-3)(x+3)(x^2+9)', chk: ['(x-3)(x+3)=x^2-9', '(x^2-9)(x^2+9)=x^4-81'] },
  sub: { label: 'substitution', e: '(x+1)^2-5(x+1)+6', terms: ['(x+1)^2', '-5(x+1)', '+6'], st: 'sub',
    why: `The chunk ${T('(x+1)')} repeats: <b>substitution</b>.`,
    how: `let ${T('A=x+1')}, factor in ${T('A')}, put ${T('(x+1)')} back in brackets, simplify.`,
    work: ['#A=x+1:\\ A^2-5A+6', '=(A-2)(A-3)', '=[(x+1)-2][(x+1)-3]', '=(x-1)(x-2)'], fac: ['x-1', 'x-2'],
    done: 'both factors are linear', fin: '(x-1)(x-2)', chk: ['(x-1)(x-2)=x^2-3x+2', '(x+1)^2-5(x+1)+6=x^2-3x+2'] },
  e1a: { label: '(a)', e: '4x^3-8x^2-60x', gcf: '4x', gnote: 'Every term has a 4 and an x.', after: 'x^2-2x-15', terms: ['x^2', '-2x', '-15'], st: 'tri',
    how: `product ${T('-15')} and sum ${T('-2')}: ${T('-5')} and ${T('3')}.`,
    work: ['#(-5)(3)=-15,\\ -5+3=-2', '=4x(x-5)(x+3)'], fac: ['x-5', 'x+3'],
    done: 'every factor is linear', fin: '4x(x-5)(x+3)', chk: ['4x(x-5)(x+3)=4x(x^2-2x-15)', '=4x^3-8x^2-60x'] },
  e1b: { label: '(b)', e: '10x^2-11xy-6y^2', terms: ['10x^2', '-11xy', '-6y^2'], st: 'dec',
    how: `two variables, same hunt: product ${T('ac=-60')} and sum ${T('-11')}: ${T('-15')} and ${T('4')}.`,
    work: ['#ac=-60:\\ -15+4=-11', '=10x^2-15xy+4xy-6y^2', '=5x(2x-3y)+2y(2x-3y)', '=(2x-3y)(5x+2y)'], fac: ['2x-3y', '5x+2y'],
    done: 'both factors are linear', fin: '(2x-3y)(5x+2y)', chk: ['(2x-3y)(5x+2y)=10x^2+4xy-15xy-6y^2', '=10x^2-11xy-6y^2'] },
  e1c: { label: '(c)', e: 'x^3+2x^2-9x-18', terms: ['x^3', '+2x^2', '-9x', '-18'], st: 'grp',
    how: `${T('x^2(x+2)')} and ${T('-9(x+2)')}: the common binomial is ${T('x+2')}.`,
    work: ['=x^2(x+2)-9(x+2)', '=(x+2)(x^2-9)'], fac: ['x+2', 'x^2-9'],
    again: [{ of: 'x^2-9', st: 'dos', cap: `${T('x^2-9')} is a <b>difference of squares</b>: back through the machine.`, work: 'x^2-9=(x-3)(x+3)', res: ['x-3', 'x+3'] }],
    done: 'every factor is linear', fin: '(x+2)(x-3)(x+3)', chk: ['(x-3)(x+3)=x^2-9', '(x+2)(x^2-9)=x^3+2x^2-9x-18'] },
  e1d: { label: '(d)', e: '\\tfrac{1}{3}x^2-2x-9', gcf: '\\tfrac{1}{3}', gnote: `A fraction leads: factor out ${T('\\tfrac13')} (dividing each term by ${T('\\tfrac13')} is multiplying it by 3).`,
    after: 'x^2-6x-27', terms: ['x^2', '-6x', '-27'], st: 'tri', how: `product ${T('-27')} and sum ${T('-6')}: ${T('-9')} and ${T('3')}.`,
    work: ['#(-9)(3)=-27,\\ -9+3=-6', '=\\tfrac{1}{3}(x-9)(x+3)'], fac: ['x-9', 'x+3'],
    done: 'both binomials are linear', fin: '\\tfrac{1}{3}(x-9)(x+3)', chk: ['\\tfrac{1}{3}(x-9)(x+3)=\\tfrac{1}{3}(x^2-6x-27)', '=\\tfrac{1}{3}x^2-2x-9'] },
  r1: { label: T('2x^3-18x'), e: '2x^3-18x', gcf: '2x', gnote: 'Both terms have a 2 and an x.', after: 'x^2-9', terms: ['x^2', '-9'], st: 'dos',
    how: `${T('x^2')} and ${T('9=3^2')} are squares, subtracted: ${T('A=x')}, ${T('B=3')}.`, work: ['=2x(x-3)(x+3)'], fac: ['x-3', 'x+3'],
    done: 'every factor is linear', fin: '2x(x-3)(x+3)', chk: ['2x(x-3)(x+3)=2x(x^2-9)', '=2x^3-18x'] },
  r2: { label: T('x^2+4x+6'), e: 'x^2+4x+6', terms: ['x^2', '+4x', '+6'], st: 'tri',
    how: `product ${T('6')} and sum ${T('4')} (both numbers positive)?`, work: ['#1\\times6:\\ 1+6=7', '#2\\times3:\\ 2+3=5'], reject: true,
    rcap: `<b>No pair has sum 4</b>: the trinomial <b>does not factor</b>. (Close: ${T('(x+2)^2=x^2+4x+4')}, not ${T('+6')}.)` },
  r3: { label: T('x^4-13x^2+36'), e: 'x^4-13x^2+36', terms: ['x^4', '-13x^2', '+36'], st: 'sub',
    why: `${T('x^4=(x^2)^2')}: the chunk ${T('x^2')} repeats. <b>Substitution</b>.`,
    how: `let ${T('A=x^2')}: product ${T('36')} and sum ${T('-13')} are ${T('-4')} and ${T('-9')}.`,
    work: ['#A=x^2:\\ A^2-13A+36', '=(A-4)(A-9)', '=(x^2-4)(x^2-9)'], fac: ['x^2-4', 'x^2-9'],
    again: [{ of: 'x^2-4', st: 'dos', cap: `${T('x^2-4')} is a difference of squares.`, work: 'x^2-4=(x-2)(x+2)', res: ['x-2', 'x+2'] },
      { of: 'x^2-9', st: 'dos', cap: `So is ${T('x^2-9')}.`, work: 'x^2-9=(x-3)(x+3)', res: ['x-3', 'x+3'] }],
    done: 'every factor is linear', fin: '(x-2)(x+2)(x-3)(x+3)', chk: ['(x^2-4)(x^2-9)=x^4-9x^2-4x^2+36', '=x^4-13x^2+36'] }
};
const TCOL = [BLU, AMB, GRN, PUR];
const machine = {
  title: 'The factoring machine',
  height: 452, minW: 980, capH: 84,
  choices: [{ sep: 'Table:' }, ...['grp', 'dec', 'ps', 'dos', 'sub'].map((v) => ({ v, label: MC[v].label })),
    { sep: 'Example 1:' }, ...['e1a', 'e1b', 'e1c', 'e1d'].map((v) => ({ v, label: MC[v].label })),
    { sep: 'Review:' }, ...['r1', 'r2', 'r3'].map((v) => ({ v, label: MC[v].label }))],
  ask: (v) => `${/^e1/.test(v) ? `Example 1${MC[v].label}: f` : 'F'}actor fully: ${T(MC[v].e)}`,
  make(stage, v, ex) {
    const d = MC[v], W = ex.W, BY = 112, G1 = 214, G2 = 388, SX = 512, SW = 230, SH = 42, SG = 6;
    const svg = svgEl('svg', { width: W, height: 452, class: 'u4l8-msvg' }, stage);
    // hopper, belt, rollers, scanner beams
    svgEl('path', { d: 'M52 2 L188 2 L156 60 L84 60 Z', fill: '#efe9dc', stroke: '#b9ad94', 'stroke-width': 3, 'stroke-linejoin': 'round' }, svg);
    svgEl('text', { x: 120, y: 38, 'text-anchor': 'middle', class: 'u4l8-hoptxt' }, svg).textContent = 'IN';
    svgEl('rect', { x: 6, y: 134, width: 484, height: 14, rx: 7, fill: '#3a4254' }, svg);
    for (let x = 22; x < 490; x += 34) svgEl('circle', { cx: x, cy: 141, r: 3.6, fill: '#9aa0ab' }, svg);
    const beam = (x) => svgEl('line', { x1: x, x2: x, y1: 84, y2: 132, stroke: '#c9c2b3', 'stroke-width': 3, 'stroke-dasharray': '5 5' }, svg);
    const beams = [beam(G1), beam(G2)];
    const stations = STN.map((s, i) => {
      const y = 4 + i * (SH + SG), el = div(stage, 'u4l8-st', `<b>${s.name}</b><span class="u4l8-sts">${s.sub}</span>`, SX, y, SW, SH);
      el.style.setProperty('--st', s.color); return Object.assign({}, s, { el, cy: y + SH / 2 });
    });
    const chutes = {}; stations.forEach((s) => { chutes[s.k] = svgEl('path', { d: `M490 ${BY} C 502 ${BY}, 498 ${s.cy}, ${SX} ${s.cy}`, fill: 'none', stroke: '#ddd6c8', 'stroke-width': 3 }, svg); });
    const g1 = div(stage, 'u4l8-gate', '<i></i><b>GCF?</b>', G1 - 64, 40, 128, 44);
    const g2 = div(stage, 'u4l8-gate', '<i></i><b>Terms?</b><span class="u4l8-cnt">–</span>', G2 - 74, 40, 148, 44);
    const cnt = g2.querySelector('.u4l8-cnt');
    const lamp = (g, cls) => { g.classList.remove('on', 'no'); g.classList.add(cls); };
    // tray, working, result band
    const TX = SX + SW + 14, TW = W - TX - 2;
    const tray = panel(stage, TX, 4, TW, 336, 'Factors', 'u4l8-tray'), chipsBox = h('div', 'u4l8-chips'); tray.appendChild(chipsBox);
    const nLines = 1 + (d.gcf ? 1 : 0) + (d.work || []).length + (d.again || []).length + (d.chk || []).length;
    const wp = panel(stage, 6, 160, 486, 288, 'Working', 'u4l8-work' + (nLines > 7 ? ' u4l8-tight' : ''));
    const band = div(stage, 'u4l8-band', '', SX, 348, W - SX - 2, 100); hide(band);
    const okSt = stampAt(stage, d.reject ? '✗ DOES NOT FACTOR' : '✓ EXPANDS BACK', !d.reject, SX + SW + 14 + (W - SX - SW - 16) / 2, 300, { size: 'sm' });
    const card = div(stage, 'u4l8-mcard', T(d.e), 120, 34); hide(card);
    const chips = [];
    const addChip = (t, cls = '', before = null) => { const el = h('div', 'u4l8-fchip ' + cls, T(t)); if (before) chipsBox.insertBefore(el, before); else chipsBox.appendChild(el); hide(el); const o = { t, el }; if (before) chips.splice(chips.findIndex((q) => q.el === before), 0, o); else chips.push(o); return el; };
    const L0 = lineIn(wp, T(d.e), 'u4l8-eq0');
    const Lg = d.gcf ? lineIn(wp, T(`=${d.gcf}(${d.after})`)) : null;
    const Lw = (d.work || []).map((t) => mline(wp, t));
    const La = (d.again || []).map((a) => lineIn(wp, T(a.work), 'u4l8-again'));
    const Lc = (d.chk || []).map((t, i) => lineIn(wp, (i ? '' : '<b>Check:</b> ') + T(t + (i === d.chk.length - 1 ? '\\ \\checkmark' : '')), 'u4l8-chk'));
    const S = stations.find((s) => s.k === d.st), n = d.terms.length;
    const steps = [];
    steps.push({ cap: `Into the machine: ${T(d.e)}. <b>Gate 1: is there a GCF?</b>`,
      run: async (c) => {
        card.style.opacity = 1; await anim(c, card, [{ top: '34px', opacity: 0 }, { top: BY + 'px', opacity: 1 }], 600);
        await show(c, L0); await moveTo(c, card, G1, BY, 520);
      } });
    if (d.gcf) steps.push({ cap: `<b>Yes: the GCF is ${T(d.gcf)}.</b> ${d.gnote} What’s left: ${T(d.after)}.`,
      run: async (c) => { lamp(g1, 'on'); beams[0].setAttribute('stroke', GCF); const gc = addChip(d.gcf, 'u4l8-gcf'); await pop(c, gc); card.innerHTML = T(d.after); await pulse(c, card, 1.1); await show(c, Lg); } });
    else steps.push({ cap: '<b>No common factor</b> (other than 1): it rolls on to gate 2.', run: async (c) => { lamp(g1, 'no'); await shake(c, g1); } });
    steps.push({ cap: `<b>Gate 2: ${n} terms.</b> ${d.why || WHY[d.st]}`,
      run: async (c) => {
        await moveTo(c, card, G2, BY, 520);
        card.innerHTML = T(d.terms.map((t, i) => K(TCOL[i % 4], t)).join(''));
        cnt.textContent = n; lamp(g2, 'on'); beams[1].setAttribute('stroke', S.color); await pop(c, cnt);
        const ch = chutes[d.st]; ch.setAttribute('stroke', S.color); ch.setAttribute('stroke-width', 5);
        await moveTo(c, card, SX + SW / 2, S.cy, 700, { opacity: 0, transform: 'scale(.45)' });
        S.el.classList.add('on'); await pulse(c, S.el, 1.05);
      } });
    steps.push({ cap: `<b>${S.name}:</b> ${d.how}`,
      run: async (c) => {
        for (const l of Lw) await show(c, l);
        if (!d.reject) for (const t of d.fac) await pop(c, addChip(t));
      } });
    if (d.reject) {
      const NO = stations.find((s) => s.k === 'no');
      steps.push({ cap: d.rcap,
        run: async (c) => { S.el.classList.remove('on'); NO.el.classList.add('on'); await shake(c, NO.el); band.innerHTML = `<div class="u4l8-bh">Result</div>${T(d.e)} <b class="u4l8-xr">does not factor</b>`; band.classList.add('u4l8-bandno'); await show(c, band); await stampIn(c, okSt); } });
      return steps;
    }
    (d.again || []).forEach((a, i) => {
      const AS = stations.find((s) => s.k === a.st);
      steps.push({ cap: `<b>Factor again?</b> ${a.cap}`,
        run: async (c) => {
          const o = chips.find((q) => q.t === a.of); o.el.classList.add('u4l8-again');
          stations.forEach((s) => s.el.classList.remove('on')); AS.el.classList.add('on'); await pulse(c, o.el, 1.12); await pulse(c, AS.el, 1.05);
          await show(c, La[i]);
          const news = a.res.map((t) => addChip(t, 'u4l8-new', o.el));
          o.el.remove(); chips.splice(chips.indexOf(o), 1);
          for (const e of news) await pop(c, e);
        } });
    });
    steps.push({ cap: `<b>Check every factor:</b> ${d.done}. <b>Factored fully:</b> ${T(d.fin)}.`,
      run: async (c) => {
        stations.forEach((s) => s.el.classList.remove('on'));
        chips.forEach((q) => { if (!q.el.querySelector('em')) q.el.insertAdjacentHTML('beforeend', '<em>✓</em>'); q.el.classList.add('u4l8-done'); });
        band.innerHTML = `<div class="u4l8-bh">Factored fully</div>${T(`=${d.fin}`)}`; await show(c, band);
      } });
    steps.push({ cap: '<b>Expand to check:</b> multiplying the factors back gives the original expression ✓.',
      run: async (c) => { for (const l of Lc) await show(c, l); await stampIn(c, okSt); } });
    return steps;
  }
};

/* ====================================================================================================
 * Example 3: is it a factor? every k; the perfect-square k
 * ==================================================================================================== */
const KH = {
  a: { e: '2x^2+5x-12', cand: 'x+4', lines: ['#ac=-24:\\ 8+(-3)=5', '=2x^2+8x-3x-12', '=2x(x+4)-3(x+4)', '=(x+4)(2x-3)'], facs: ['x+4', '2x-3'], hit: 0,
    hunt: `product ${T('ac=-24')} and sum ${T('5')}: ${T('8')} and ${T('-3')}. Split, group, factor.`, q: `Is ${T('x+4')} a factor of ${T('2x^2+5x-12')}?` },
  b: { e: '6x^3+x^2-2x', cand: '3x+2', lines: ['=x(6x^2+x-2)', '#ac=-12:\\ 4+(-3)=1', '=x(6x^2+4x-3x-2)', '=x[2x(3x+2)-(3x+2)]', '=x(3x+2)(2x-1)'], facs: ['x', '3x+2', '2x-1'], hit: 1,
    hunt: `GCF ${T('x')} first, then product ${T('ac=-12')} and sum ${T('1')}: ${T('4')} and ${T('-3')}.`, q: `Is ${T('3x+2')} a factor of ${T('6x^3+x^2-2x')}?` }
};
const KPAIRS = [[1, -12], [-1, 12], [2, -6], [-2, 6], [3, -4], [-3, 4]];
const kHunt = {
  title: 'Factors and missing coefficients',
  height: 420, minW: 960,
  choices: [{ sep: 'Example 3 check:' }, ...'abcd'.split('').map((v) => ({ v, label: `(${v})` }))],
  ask: (v) => (KH[v] ? `Example 3(${v}): ${KH[v].q}` : v === 'c' ? `Example 3(c): every integer ${T('k')} so that ${T('x^2+kx-12')} factors.` : `Example 3(d): ${T('k')} so that ${T('9x^2+kx+49')} is a perfect square.`),
  make(stage, v, ex) {
    const W = ex.W;
    if (KH[v]) {
      const d = KH[v], PW = 520;
      const P = panel(stage, 0, 4, PW, 410, '', 'u4l8-big');
      lineIn(P, T(d.e), 'u4l8-eq0').style.opacity = 1;
      const ls = d.lines.map((t) => mline(P, t));
      const RX = PW + 20, RW = W - RX;
      div(stage, 'u4l8-kh', 'Fully factored: the factor cards', RX, 10, RW);
      const row = div(stage, 'u4l8-krow', '', RX, 46, RW, 80);
      const cards = d.facs.map((t) => { const e = h('div', 'u4l8-kcard', T(t)); row.appendChild(e); hide(e); return e; });
      div(stage, 'u4l8-kh', `The candidate`, RX, 180, RW);
      const cand = div(stage, 'u4l8-kcard u4l8-kcand', T(d.cand), RX + RW / 2 - 70, 214, 140); hide(cand);
      const st = stampAt(stage, 'YES: a factor', true, RX + RW / 2, 250, { size: 'sm' });
      return [
        { cap: `<b>Factor fully first.</b> ${d.hunt}`, run: async (c) => { for (const l of ls) await show(c, l); } },
        { cap: `The fully factored form gives the <b>factor cards</b>: ${d.facs.map((t) => T(t)).join(', ')}.`, run: async (c) => { for (const e of cards) await pop(c, e); } },
        { cap: `Slide the candidate ${T(d.cand)} over the cards…`, run: async (c) => { await show(c, cand); } },
        { cap: `It matches a card: <b>yes</b>, ${T(d.cand)} is a factor of ${T(d.e)}.`,
          run: async (c) => {
            const t = cards[d.hit];
            await anim(c, cand, [{ left: cand.style.left, top: cand.style.top, width: cand.style.width }, { left: (RX + t.offsetLeft) + 'px', top: (46 + t.offsetTop) + 'px', width: t.offsetWidth + 'px' }], 700);
            t.classList.add('u4l8-hit'); cand.classList.add('u4l8-hit'); await stampIn(c, st);
          } }
      ];
    }
    if (v === 'c') {
      const tb = new ValueTable(stage, { x: 10, y: 8, headers: ['\\text{pair }m,\\ n', 'm\\times n', 'k=m+n'], rows: KPAIRS.map(([m, n]) => [`${m},\\ ${n}`, '-12', String(m + n)]), hide: () => true, tap: false, cellW: 150, cellH: 50 });
      const NX = 500, N = new NumberLine(stage, { x: NX, y: 30, width: W - NX, height: 110, min: -12, max: 12, step: 1, labelStep: 4 });
      div(stage, 'u4l8-kh', `Every possible ${T('k')}`, NX + 20, 6, 300);
      const dots = KPAIRS.map(([m, n]) => { const p = N.point(m + n, { label: T(String(m + n)), color: GCF }); hideP(p); return p; });
      const P = panel(stage, NX, 160, W - NX, 250, '', 'u4l8-big');
      const l1 = lineIn(P, `<b>${T('k=\\pm11,\\ \\pm4,\\ \\pm1')}</b>`, 'u4l8-ansl');
      const l2 = lineIn(P, T('k=11:\\ x^2+11x-12=(x+12)(x-1)'));
      const l3 = lineIn(P, T('k=-4:\\ x^2-4x-12=(x-6)(x+2)'));
      return [
        { cap: `List <b>every</b> pair of integers with product ${T('-12')}: one positive, one negative.`, run: async (c) => { for (let r = 0; r < 6; r++) { tb.reveal(r, 0, c); tb.reveal(r, 1, c); await sleep(c, 160); } } },
        { cap: `Each pair’s <b>sum</b> is a value of ${T('k')} that works: ${KPAIRS.map(([m, n]) => T(String(m + n))).join(', ')}.`,
          run: async (c) => { for (let r = 0; r < 6; r++) { tb.reveal(r, 2, c); await popP(c, dots[r]); } } },
        { cap: `Six pairs, six values, in ${T('\\pm')} pairs: ${T('k=\\pm11,\\ \\pm4,\\ \\pm1')}.`, run: (c) => show(c, l1) },
        { cap: `Check two: ${T('k=11')} uses ${T('12')} and ${T('-1')}; ${T('k=-4')} uses ${T('-6')} and ${T('2')}.`, run: async (c) => { await show(c, l2); await show(c, l3); } }
      ];
    }
    // (d) the perfect-square area model
    const S = 330, a = 220, b = S - a, X0 = 40, Y0 = 46;
    const svg = svgEl('svg', { width: 460, height: 420, class: 'u4l8-sqsvg' }, stage);
    const rect = (x, y, w, hh, fill) => svgEl('rect', { x: X0 + x, y: Y0 + y, width: w, height: hh, fill, stroke: '#1c2230', 'stroke-width': 2.5 }, svg);
    const parts = [rect(0, 0, a, a, '#e6eefc'), rect(a, 0, b, a, '#fff4dd'), rect(0, a, a, b, '#fff4dd'), rect(a, a, b, b, '#e8f5ef')];
    parts.forEach(hide);
    const lab = (x, y, t, cls = '') => { const e = div(stage, 'u4l8-sqlab ' + cls, T(t), X0 + x, Y0 + y); e.style.translate = '-50% -50%'; return hide(e); };
    const sideT = [lab(a / 2, -20, '3x'), lab(a + b / 2, -20, '7'), lab(-20, a / 2, '3x'), lab(-20, a + b / 2, '7')];
    const inT = [lab(a / 2, a / 2, '9x^2', 'u4l8-sqbig'), lab(a + b / 2, a / 2, '21x'), lab(a / 2, a + b / 2, '21x'), lab(a + b / 2, a + b / 2, '49')];
    const P = panel(stage, 480, 4, W - 480, 410, '', 'u4l8-big');
    const ls = ['9x^2=(3x)^2,\\quad 49=7^2', '(3x+7)^2=9x^2+21x+21x+49', '=9x^2+42x+49\\ \\Rightarrow\\ k=42', '(3x-7)^2=9x^2-42x+49\\ \\Rightarrow\\ k=-42'].map((t, i) => lineIn(P, T(t), i === 3 ? 'u4l8-negl' : ''));
    const fin = lineIn(P, `<b>${T('k=42')}</b> or <b>${T('k=-42')}</b>`, 'u4l8-ansl');
    return [
      { cap: `First and last terms are squares: ${T('9x^2=(3x)^2')} and ${T('49=7^2')}. So try ${T('(3x+7)^2')}.`, run: (c) => show(c, ls[0]) },
      { cap: `Build ${T('(3x+7)^2')} as a square of side ${T('3x+7')}.`, run: async (c) => { for (const e of sideT) await show(c, e); for (const p of parts) await fadeIn(c, p, 300); } },
      { cap: `The four pieces: ${T('9x^2')}, two rectangles of ${T('21x')}, and ${T('49')}.`, run: async (c) => { for (const e of inT) await pop(c, e); await show(c, ls[1]); } },
      { cap: `The middle term is ${T('21x+21x=42x')} (that is ${T('2AB=2(3x)(7)')}), so ${T('k=42')}.`, run: async (c) => { await pulse(c, inT[1], 1.3); await pulse(c, inT[2], 1.3); await show(c, ls[2]); } },
      { cap: `${T('(3x-7)^2')} works too: the two rectangles are ${T('-21x')} each, so ${T('k=-42')}.`, run: async (c) => { inT[1].innerHTML = T('-21x'); inT[2].innerHTML = T('-21x'); inT[1].classList.add('u4l8-xr'); inT[2].classList.add('u4l8-xr'); sideT[1].innerHTML = T('-7'); sideT[3].innerHTML = T('-7'); await show(c, ls[3]); await show(c, fin); } }
    ];
  }
};

/* ====================================================================================================
 * Example 6: the picture frame to scale
 * ==================================================================================================== */
const frame = {
  title: 'The picture frame',
  height: 420, minW: 960,
  choices: [{ sep: 'Example 6 check:' }, { v: 'f', label: 'the frame' }],
  ask: () => `Example 6: a 20 cm by 30 cm photo, a frame of width ${T('x')}, total area ${T('1\\,064')} cm².`,
  make(stage, v, ex) {
    const W = ex.W, SC = 9, CX = 230, CY = 190;
    const svg = svgEl('svg', { width: 470, height: 420, class: 'u4l8-frsvg' }, stage);
    const outer = svgEl('rect', { fill: '#8a5a33', stroke: '#5b3a1f', 'stroke-width': 3, rx: 3 }, svg);
    const photo = svgEl('g', {}, svg);
    svgEl('rect', { x: CX - 15 * SC, y: CY - 10 * SC, width: 30 * SC, height: 20 * SC, fill: '#cfe6f7' }, photo);
    svgEl('path', { d: `M${CX - 15 * SC} ${CY + 10 * SC} L${CX - 70} ${CY - 20} L${CX - 20} ${CY + 30} L${CX + 40} ${CY - 40} L${CX + 15 * SC} ${CY + 30} L${CX + 15 * SC} ${CY + 10 * SC} Z`, fill: '#6aa84f' }, photo);
    svgEl('circle', { cx: CX + 90, cy: CY - 50, r: 16, fill: '#f2c14e' }, photo);
    const lp = (x, y, t, cls = '') => { const e = div(stage, 'u4l8-frlab ' + cls, T(t), x, y); e.style.translate = '-50% -50%'; return e; };
    lp(CX, CY - 10 * SC + 16, '30'); lp(CX - 15 * SC + 18, CY, '20');
    const lw = lp(CX, 0, 'x', 'u4l8-frx'), lh = lp(0, CY, 'x', 'u4l8-frx');
    const lo1 = lp(CX, 0, '30+2x', 'u4l8-frout'), lo2 = lp(0, CY, '20+2x', 'u4l8-frout');
    const read = div(stage, 'u4l8-frread', '', 10, 372, 450, 40);
    const setX = (xw, num = false) => {
      const w = (30 + 2 * xw) * SC, hh = (20 + 2 * xw) * SC;
      outer.setAttribute('x', CX - w / 2); outer.setAttribute('y', CY - hh / 2); outer.setAttribute('width', w); outer.setAttribute('height', hh);
      lw.style.top = (CY - 10 * SC - xw * SC / 2) + 'px'; lh.style.left = (CX - 15 * SC - xw * SC / 2) + 'px';
      lo1.style.top = (CY + hh / 2 + 18) + 'px'; lo2.style.left = (CX + w / 2 + 34) + 'px';
      const A = (20 + 2 * xw) * (30 + 2 * xw), xs = Math.round(xw * 100) / 100;
      read.innerHTML = num ? T(`x=${xs}:\\ (${20 + 2 * xs})(${30 + 2 * xs})=${Math.round(A).toLocaleString('en-CA').replace(/,/g, '\\,')}\\text{ cm}^2`) : T('\\text{Area}=(20+2x)(30+2x)');
    };
    setX(3);
    hide(lw); hide(lh); hide(lo1); hide(lo2); hide(read); outer.style.opacity = 0;
    const P = panel(stage, 490, 4, W - 490, 410, '', 'u4l8-big');
    const ls = ['(20+2x)(30+2x)=1\\,064', '600+100x+4x^2=1\\,064', '4x^2+100x-464=0', '4(x^2+25x-116)=0', '4(x+29)(x-4)=0'].map((t) => lineIn(P, T(t)));
    const lr = lineIn(P, `${T('x=4')} &nbsp; or &nbsp; <span class="u4l8-strike">${T('x=-29')}</span>`, 'u4l8-ansl');
    const lc = lineIn(P, `Check: ${T('28\\times38=1\\,064')} ✓<br>The frame is <b>4 cm</b> wide.`, 'u4l8-okl');
    const no = stampAt(stage, 'INADMISSIBLE', false, W - 105, 238, { size: 'sm' }), ok = stampAt(stage, '✓ 1 064 cm²', true, 390, 26, { size: 'sm' });
    return [
      { cap: `<b>Sketch it.</b> The frame adds ${T('x')} on <b>both</b> sides, so the outside is ${T('(30+2x)')} by ${T('(20+2x)')}.`,
        run: async (c) => { await fadeIn(c, outer, 400); for (const e of [lw, lh, lo1, lo2, read]) await show(c, e); } },
      { cap: `Try a width: ${T('x=2')} gives ${T('24\\times34=816')} cm², too small. Let algebra find it exactly.`,
        run: async (c) => { await tween(c, 900, (t) => setX(3 - t, true)); } },
      { cap: `<b>The equation:</b> the outside area is ${T('1\\,064')}: ${T('(20+2x)(30+2x)=1\\,064')}.`, run: async (c) => { await show(c, ls[0]); } },
      { cap: `<b>Expand</b> and get <b>0 on one side</b>: ${T('4x^2+100x-464=0')}.`, run: async (c) => { await show(c, ls[1]); await show(c, ls[2]); } },
      { cap: `<b>GCF 4</b>, then product ${T('-116')} and sum ${T('25')}: ${T('29')} and ${T('-4')}.`, run: async (c) => { await show(c, ls[3]); await show(c, ls[4]); } },
      { cap: `${T('x=4')} or ${T('x=-29')}. A frame can’t be ${T('-29')} cm wide: that root is <b class="u4l8-xr">inadmissible</b>.`, run: async (c) => { await show(c, lr); await stampIn(c, no); } },
      { cap: `<b>Check in the story:</b> ${T('x=4')} makes the outside ${T('28')} by ${T('38')}, and ${T('28\\times38=1\\,064')} ✓. The frame is 4 cm wide.`,
        run: async (c) => { await tween(c, 900, (t) => setX(2 + 2 * t, true)); await show(c, lc); await stampIn(c, ok); } }
    ];
  }
};

/* ====================================================================================================
 * Each side as a graph: the root is where they meet; the extraneous root lives on the mirror
 * ==================================================================================================== */
const RGR = {
  b: { label: '7(b)', ask: `Example 7(b): ${T('\\sqrt{x+8}+4=x')} as two graphs.`, f1: (x) => Math.sqrt(x + 8) + 4, from: -8, s0: [-8, 4], t1: 'y=\\sqrt{x+8}+4', f2: (x) => x, t2: 'y=x',
    mir: (x) => 4 - Math.sqrt(x + 8), tm: 'y=4-\\sqrt{x+8}', root: [8, 8], fake: [1, 1], win: { xmin: -9, xmax: 11, ymin: -4, ymax: 12, xlabels: 2, ylabels: 2 },
    mcap: `Squaring ${T('\\sqrt{x+8}=x-4')} also accepts ${T('-\\sqrt{x+8}=x-4')}: the <b>mirror</b> graph ${T('y=4-\\sqrt{x+8}')}.`,
    alg: ['\\sqrt{x+8}=x-4', 'x+8=x^2-8x+16', '0=(x-1)(x-8)'], okT: 'x=8', fakeT: 'x=1' },
  e8: { label: '8(c)', ask: `Example 8: ${T('\\sqrt{2x+1}-\\sqrt{x+4}=1')} as two graphs.`, f1: (x) => Math.sqrt(2 * x + 1) - Math.sqrt(x + 4), from: -0.5, s0: [-0.5, -Math.sqrt(3.5)], t1: 'y=\\sqrt{2x+1}-\\sqrt{x+4}', f2: () => 1, t2: 'y=1',
    mline: -1, tm: 'y=-1', root: [12, 1], fake: [0, -1], win: { xmin: -2, xmax: 16, ymin: -3, ymax: 3, xlabels: 2 },
    mcap: `Squaring can’t tell ${T('1')} from ${T('-1')}: the squared equations also hold where the left side is ${T('-1')}.`,
    alg: ['x(x-12)=0', 'x=0\\ \\text{or}\\ x=12'], okT: 'x=12', fakeT: 'x=0' },
  neg: { label: T('\\sqrt{x}=-3'), ask: `${T('\\sqrt{x}=-3')} as two graphs.`, f1: (x) => Math.sqrt(x), from: 0, s0: [0, 0], t1: 'y=\\sqrt{x}', f2: () => -3, t2: 'y=-3',
    mir: (x) => -Math.sqrt(x), tm: 'y=-\\sqrt{x}', root: null, fake: [9, -3], win: { xmin: -1, xmax: 12, ymin: -5, ymax: 5 },
    mcap: `Squaring gives ${T('x=9')}, which also solves ${T('-\\sqrt{x}=-3')}: the mirror graph ${T('y=-\\sqrt{x}')}.`, alg: ['x=9'], fakeT: 'x=9' },
  rev: { label: T('\\sqrt{x+7}=x+1'), ask: `${T('\\sqrt{x+7}=x+1')} as two graphs.`, f1: (x) => Math.sqrt(x + 7), from: -7, s0: [-7, 0], t1: 'y=\\sqrt{x+7}', f2: (x) => x + 1, t2: 'y=x+1',
    mir: (x) => -Math.sqrt(x + 7), tm: 'y=-\\sqrt{x+7}', root: [2, 3], fake: [-3, -2], win: { xmin: -8, xmax: 5, ymin: -5, ymax: 6 },
    mcap: `Squaring also accepts ${T('-\\sqrt{x+7}=x+1')}: the mirror graph ${T('y=-\\sqrt{x+7}')}.`, alg: ['x+7=x^2+2x+1', '0=(x+3)(x-2)'], okT: 'x=2', fakeT: 'x=-3' }
};
const radGraph = {
  title: 'Two sides, two graphs',
  height: 420, minW: 960,
  choices: [{ sep: 'Check:' }, { v: 'b', label: RGR.b.label }, { v: 'e8', label: RGR.e8.label }, { sep: 'Concept:' }, { v: 'neg', label: RGR.neg.label }, { v: 'rev', label: RGR.rev.label }],
  ask: (v) => RGR[v].ask,
  make(stage, v, ex) {
    const d = RGR[v], W = ex.W, GW = 560;
    const G = new Graph(stage, Object.assign({ x: 0, y: 6, width: GW, height: 408, fontSize: 15 }, d.win));
    const c1 = G.fn(d.f1, { color: PUR, width: 4, from: d.from }); c1.style.opacity = 0;
    const s0 = hideP(G.point(d.s0[0], d.s0[1], { color: PUR, r: 6 }));
    const c2 = G.fn(d.f2, { color: BLU, width: 4 }); c2.style.opacity = 0;
    const cm = d.mline != null ? G.hline(d.mline, { color: RED, width: 3 }) : G.fn(d.mir, { color: RED, width: 3, dash: true, from: d.from });
    cm.style.opacity = 0;
    const rp = d.root ? hideP(G.point(d.root[0], d.root[1], { label: T(`(${d.root[0]},\\,${d.root[1]})\\ \\checkmark`), pos: 'nw', color: GRN, labelColor: GRN })) : null;
    const fp = hideP(G.point(d.fake[0], d.fake[1], { label: T(`(${d.fake[0]},\\,${d.fake[1]})\\ \\times`), pos: 'se', color: RED, labelColor: RED }));
    const P = panel(stage, GW + 20, 4, W - GW - 20, 410, '', 'u4l8-big5');
    const key = (col, t) => lineIn(P, `<span class="u4l8-key" style="background:${col}"></span>${T(t)}`, 'u4l8-keyl');
    const k1 = key(PUR, d.t1), k2 = key(BLU, d.t2), k3 = key(RED, d.tm);
    const la = d.alg.map((t) => lineIn(P, T(t), 'u4l8-note'));
    const lok = lineIn(P, d.root ? `<span class="u4l8-ok">${T(d.okT)}</span>: the graphs meet ✓` : '<span class="u4l8-xr">The graphs never meet: no solution.</span>');
    const lfk = lineIn(P, `<span class="u4l8-xr">${T(d.fakeT)}</span>: only the mirror meets: <b class="u4l8-xr">✗ extraneous</b>`);
    return [
      { cap: `<b>Left side:</b> ${T(d.t1)}. It starts at ${T(`x=${d.s0[0] === -0.5 ? '-\\frac{1}{2}' : d.s0[0]}`)} (the restriction).`, run: async (c) => { await show(c, k1); await popP(c, s0); await drawOn(c, G, c1, 900); } },
      { cap: `<b>Right side:</b> ${T(d.t2)}.`, run: async (c) => { await show(c, k2); await drawOn(c, G, c2, 700); } },
      { cap: d.root ? `They meet at ${T(`(${d.root[0]},\\,${d.root[1]})`)}: ${T(d.okT)} is the <b>root</b>.` : `They <b>never meet</b>: ${T('\\sqrt{x}')} is never negative. No solution.`,
        run: async (c) => { for (const l of la) await show(c, l); if (rp) await popP(c, rp); await show(c, lok); } },
      { cap: d.mcap, run: async (c) => { await show(c, k3); cm.style.opacity = ''; await G.drawIn(cm, 800, c); } },
      { cap: `That meets ${T(d.t2)} at ${T(`(${d.fake[0]},\\,${d.fake[1]})`)}: ${T(d.fakeT)} solves the <b>squared</b> equation but not the original. <b class="u4l8-xr">Extraneous.</b>`,
        run: async (c) => { await popP(c, fp); await show(c, lfk); } }
    ];
  }
};

/* ====================================================================================================
 * Stand Up Break
 * ==================================================================================================== */
standup('u4l8', {
  intro: 'At your whiteboard: factor fully, solve, and verify. GCF first; check every root!',
  levels: {
    BEG: (r) => { // k(x − p)(x − q), factor fully
      const p = r.int(-9, 9) || 2, q = r.int(-9, 9) || -3, k = r.pick([1, 1, 2, 3, 5]);
      const b = -(p + q), c = p * q, tri = poly([1, b, c], ['x^2', 'x', '']);
      const f = (s) => (s === 0 ? 'x' : `(${lin(1, -s)})`);
      const facs = p === q ? `${f(p)}^2` : `${f(p)}${f(q)}`;
      return { text: 'Factor fully.', q: poly([k, k * b, k * c], ['x^2', 'x', '']),
        a: k === 1 ? [`=${facs}`] : [`=${k}(${tri})`, `=${k}${facs}`] };
    },
    PRG: (r) => { // (a x + m)(x + n) = 0 by decomposition
      let a, m; do { a = r.pick([2, 3, 4, 5, 6]); m = r.int(-7, 7); } while (!m || gcd(a, m) !== 1);
      const n = r.int(-8, 8) || 4, B = a * n + m, C = m * n;
      return { text: 'Solve by factoring.', q: `${poly([a, B, C], ['x^2', 'x', ''])}=0`,
        a: [`ac=${a * C}:\\ ${a * n}+(${m})=${B}`, `(${lin(a, m)})(${lin(1, n)})=0`, `x=${frac(-m, a)}\\ \\text{or}\\ x=${-n}`] };
    },
    MAS: (r) => {
      if (r.chance(0.5)) { // √(x + b) = x + d with one root and one extraneous root
        for (let tries = 0; tries < 200; tries++) {
          const rt = r.int(0, 8), s = r.int(-8, rt - 1);
          if ((rt + s) % 2 === 0) continue;
          const d = (1 - rt - s) / 2, b = d * d - rt * s;
          if (rt + d < 0 || s + d >= 0 || s + b < 0) continue;
          return { text: 'Solve and verify. Identify any extraneous root.', q: `\\sqrt{${lin(1, b)}}=${lin(1, d)}`,
            a: [`${lin(1, b)}=${poly([1, 2 * d, d * d], ['x^2', 'x', ''])}`, `0=${poly([1, 2 * d - 1, d * d - b], ['x^2', 'x', ''])}=(${lin(1, -rt)})(${lin(1, -s)})`,
              `x=${rt}:\\ \\sqrt{${rt + b}}=${rt + d}\\ \\checkmark`, `x=${s}:\\ \\sqrt{${s + b}}=${Math.sqrt(s + b)}\\ne${s + d}\\ \\text{(extraneous)}`] };
        }
      }
      // substitution: (x + p)² − (m + n)(x + p) + mn
      const p = r.int(-5, 5) || 1; let m = r.int(-6, 6) || 2, n = r.int(-6, 6) || -3; if (m === n) n = m + 1;
      const A = `(${lin(1, p)})`, bb = -(m + n), cc = m * n;
      const mid = bb === 0 ? '' : (bb < 0 ? '-' : '+') + (Math.abs(bb) === 1 ? '' : Math.abs(bb)) + A, con = cc === 0 ? '' : (cc < 0 ? '-' : '+') + Math.abs(cc);
      return { text: 'Factor fully using substitution.', q: `${A}^2${mid}${con}`,
        a: [`A=${lin(1, p)}:\\ ${poly([1, -(m + n), m * n], ['A^2', 'A', ''])}=(${lin(1, -m, 'A')})(${lin(1, -n, 'A')})`, `=(${lin(1, p - m)})(${lin(1, p - n)})`] };
    }
  }
});

/* =============================== mount =============================== */
export const explainers = mountExplainers({ machine, kHunt, frame, radGraph });
export const _test = { MC, KH, RGR, poly, lin, frac };
