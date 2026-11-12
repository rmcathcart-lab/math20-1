/* Math 20-1 · Unit 4 · Lesson 1 — Factoring Review: Common Factors and x² + bx + c (no calculator).
 * New lesson format (2026-11-11): the warm-up is plain markup on the page (no code), and the explainers are
 *   gcf (each term as a strip of factor chips, the shared ones light up, GCF out, divide each term; negative GCF; Example 1),
 *   binomial (the bracket as one parcel: both parcels merge in front, the leftovers go in the second bracket; the hidden 1;
 *     opposite brackets flip with a b = 5 test; Example 2),
 *   grouping (four term cards, pair braces, GCF of each pair, matching brackets; a wrong sign; rearranging; Example 3),
 *   productSum (Ryan's X: c on top, b underneath, the sign rule, the factor pairs listed beside the X and the right one
 *     circled, the two numbers on the sides, then the brackets and a written check; Examples 4, 5 and 7(a)),
 *   fully (the factoring checklist as a flowchart beside the working; Example 6 and a grouping demo),
 *   isFactor (factor fully, then slide the candidate binomial along the factor cards; 7 − x counts as x − 7; Example 7),
 *   patio (the area model to scale: sides x + 7 and x + 4, perimeter, then x = 5 with a metre grid; Example 8).
 * Colours: b green, c amber, GCF rose (#a33357), a common bracket purple. */
import {
  h, tex, add, box, Flowchart, stamp, stampIn, mountExplainers, pop, fadeIn, appear, sleep, svgEl, pulse, shake, anim, drawIn, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const BC = COLORS.green, CC = COLORS.amber, NC = COLORS.red, GC = COLORS.teal, PC = COLORS.purple, X2C = COLORS.blue;
const cB = (s) => `\\textcolor{${BC}}{${s}}`, cC = (s) => `\\textcolor{${CC}}{${s}}`, cG = (s) => `\\textcolor{${GC}}{${s}}`;
const cP = (s) => `\\textcolor{${PC}}{${s}}`, cN = (s) => `\\textcolor{${NC}}{${s}}`;
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
const panel = (stage, x, y, w, hh, title, cls = '') => div(stage, 'u4l1-panel ' + cls, title ? `<div class="u4l1-ph">${title}</div>` : '', x, y, w, hh);
const lineIn = (p, html, cls = '') => { const d = h('div', 'u4l1-line ' + cls, html); p.appendChild(d); hide(d); return d; };
const centre = (el) => { el.style.translate = '-50% -50%'; return el; };
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const pf = (n) => { const out = []; let m = Math.abs(n); for (let p = 2; p * p <= m; p++) while (m % p === 0) { out.push(p); m /= p; } if (m > 1) out.push(m); return out; };
/* polynomial TeX: term(k, 'x', first) → '+3x', '-x', '7'; tri('x', b, c, 'y') → 'x^2+bxy+cy^2'; bin('x', m) → '(x+m)' */
const term = (k, mono, first) => { if (!k) return ''; const s = k < 0 ? '-' : first ? '' : '+'; const a = Math.abs(k); return s + (a === 1 && mono ? '' : a) + mono; };
const tri = (v, b, c, w = '') => `${v}^2${term(b, v + w, false)}${term(c, w ? w + '^2' : '', false)}`;
const bin = (v, m, w = '') => `(${v}${term(m, w, false)})`;
const sn = (k) => (k < 0 ? `-${-k}` : `${k}`);
const pn = (k) => (k < 0 ? `(-${-k})` : `${k}`);   // a number in a product: (−5)
const xp = (v, p) => (p <= 0 ? '' : p === 1 ? v : `${v}^{${p}}`);

/* =============================== explainer: the GCF as factor chips =============================== */
const GF = {
  n1: { label: T('6x^3-15x^2'), terms: [[6, { x: 3 }], [-15, { x: 2 }]] },
  neg: { label: T('-4x^2+10x'), terms: [[-4, { x: 2 }], [10, { x: 1 }]] },
  e1a: { label: 'Example 1(a)', terms: [[12, { x: 3 }], [-18, { x: 2 }]] },
  e1b: { label: '1(b)', terms: [[10, { a: 4, b: 2 }], [15, { a: 2, b: 3 }], [-5, { a: 2, b: 1 }]] },
  e1c: { label: '1(c)', terms: [[-4, { m: 3 }], [12, { m: 2 }], [-8, { m: 1 }]], again: { tri: 'm^2-3m+2', fac: '(m-1)(m-2)', why: `product ${T('2')}, sum ${T('-3')}: ${T('-1')} and ${T('-2')}` } }
};
const monoT = (k, vars, first = true) => { const vs = Object.entries(vars).map(([v, p]) => xp(v, p)).join(''); return term(k, vs, first); };
const gfOrig = (d) => d.terms.map((t, i) => monoT(t[0], t[1], i === 0)).join('');
const gcf = {
  title: 'Find the greatest common factor',
  height: 430, minW: 900,
  choices: [...['n1', 'neg'].map((k) => ({ v: k, label: GF[k].label })), { sep: 'Check:' }, ...['e1a', 'e1b', 'e1c'].map((k) => ({ v: k, label: GF[k].label }))],
  ask: (v) => `Factor ${T(gfOrig(GF[v]))} by taking out the GCF.`,
  make(stage, v, ex) {
    const d = GF[v], terms = d.terms, neg = terms[0][0] < 0, vars = Object.keys(terms[0][1]);
    const G = terms.map((t) => Math.abs(t[0])).reduce(gcd), minP = {};
    vars.forEach((x) => (minP[x] = Math.min(...terms.map((t) => t[1][x] || 0))));
    const gNum = neg ? -G : G, gTex = monoT(gNum, minP), gPos = monoT(G, minP);
    const gChips = [...pf(G).map(String), ...vars.flatMap((x) => Array(minP[x]).fill(x))];
    const left = terms.map((t) => { const vv = {}; vars.forEach((x) => (vv[x] = (t[1][x] || 0) - minP[x])); return [t[0] / gNum, vv]; });
    const brk = left.map((t, i) => monoT(t[0], t[1], i === 0)).join(''), orig = gfOrig(d), ans = `${gTex}(${brk})`;
    const has1 = left.some((t) => vars.every((x) => !t[1][x]) && Math.abs(t[0]) === 1);
    const RH = 64, R0 = 12, CX = 206, CW = 48;
    const rows = terms.map((t, i) => {
      const r = hide(div(stage, 'u4l1-row', '', 0, R0 + i * RH, ex.W, RH - 6));
      div(r, 'u4l1-rl', T(`${monoT(t[0], t[1], true)}=${t[0] < 0 ? '-' : ''}`), 0, 8, CX - 10);
      const rest = [...pf(Math.abs(t[0]) / G).map(String), ...vars.flatMap((x) => Array((t[1][x] || 0) - minP[x]).fill(x))];
      const chips = [...gChips.map((s) => ({ s, on: true })), ...rest.map((s) => ({ s, on: false }))].map((o, j) => {
        const e = div(r, 'u4l1-fc', T(o.s), CX + j * CW, 6, CW - 6, 44); e.on = o.on; return e;
      });
      return { r, chips, n: chips.length };
    });
    const maxN = Math.max(...rows.map((r) => r.n)), FX = Math.max(CX + maxN * CW + 34, 600);
    const fracs = terms.map((t, i) => hide(div(rows[i].r, 'u4l1-frac', T(`\\dfrac{${monoT(t[0], t[1])}}{${gTex}}=${neg ? cN(monoT(left[i][0], left[i][1])) : monoT(left[i][0], left[i][1])}`), FX, 0)));
    const Y = R0 + terms.length * RH + 8, LH = 50;
    const L0 = hide(div(stage, 'u4l1-big', T(`\\text{GCF}=${gChips.join('\\cdot ')}=${cG(gPos)}` + (neg ? `\\qquad\\text{leading term negative: take out }${cG(gTex)}` : '')), 24, Y));
    const L1 = hide(div(stage, 'u4l1-big', T(`${orig}=${cG(gTex)}(${brk})`), 24, Y + LH));
    const L2 = d.again ? hide(div(stage, 'u4l1-big', T(`\\phantom{${orig}}=${cG(gTex)}${d.again.fac}`), 24, Y + 2 * LH)) : null;
    const L3 = hide(div(stage, 'u4l1-big u4l1-ok', T(`\\text{Check: }${gTex}(${brk})=${orig}\\ \\checkmark`), 24, Y + (d.again ? 3 : 2) * LH));
    const st = hide(stamp(stage, 'factored', { x: ex.W - 120, y: Y + LH + 22 }));
    return [
      { cap: `Write each term as a product of its factors: numbers as primes, powers as repeated variables.`, run: async (c) => { for (const r of rows) await show(c, r.r); } },
      { cap: `Light up the factors that are in <b>every</b> term.`, run: async (c) => { rows.forEach((r) => r.chips.forEach((e) => e.on && e.classList.add('u4l1-fc-on'))); await Promise.all(rows.map((r) => pulse(c, r.r, 1.02))); } },
      { cap: neg ? `The GCF is ${T(cG(gPos))}. The leading term is <b>negative</b>, so take out ${T(cG(gTex))}.` : `The GCF is ${T(`${gChips.join('\\cdot ')}=${cG(gPos)}`)}.`, run: (c) => show(c, L0) },
      { cap: `Divide each term by ${T(gTex)}: what is left goes in the brackets.` + (has1 ? ' A term that is all GCF leaves <b>1</b>, not 0.' : '') + (neg ? ' Dividing by a negative <b>flips every sign</b>.' : ''),
        run: async (c) => { rows.forEach((r) => r.chips.forEach((e) => e.on && e.classList.add('u4l1-fc-dim'))); for (const f of fracs) await show(c, f); } },
      { cap: `Write the GCF in front: ${T(`${orig}=${ans}`)}.`, run: (c) => show(c, L1) },
      ...(d.again ? [{ cap: `The bracket ${T(d.again.tri)} factors again (Section 4): ${d.again.why}.`, run: (c) => show(c, L2) }] : []),
      { cap: `Check by expanding: ${T(gTex)} times each term in the bracket gives back ${T(orig)}.`, run: async (c) => { await show(c, L3); await stampIn(c, st); } }
    ];
  }
};

/* =============================== explainer: a bracket as the common factor =============================== */
const BI = {
  n: { label: T('4x(x-3)+7(x-3)'), A: '4x', op: '+', B: '7', bx: 'x-3', q: '4x(x-3)+7(x-3)', exp: '4x^2-5x-21' },
  e2a: { label: 'Example 2(a)', A: '5y', op: '-', B: '2', bx: 'y+6', q: '5y(y+6)-2(y+6)', exp: '5y^2+28y-12' },
  e2b: { label: '2(b)', A: '3x', op: '+', B: '', bx: '2x-1', q: '3x(2x-1)+(2x-1)', exp: '6x^2-x-1' },
  e2c: { label: '2(c)', A: 'a', op: '+', B: '7', bx: 'b-2', bx2: '2-b', q: 'a(b-2)+7(2-b)', exp: 'ab-2a-7b+14' }
};
const binomial = {
  title: 'A whole bracket as the common factor',
  height: 380, minW: 900,
  choices: [{ v: 'n', label: BI.n.label }, { sep: 'Check:' }, ...['e2a', 'e2b', 'e2c'].map((k) => ({ v: k, label: BI[k].label }))],
  ask: (v) => `Factor ${T(BI[v].q)}.`,
  make(stage, v, ex) {
    const d = BI[v], W = ex.W, Y1 = 34, Y2 = 160, HH = 62;
    const w1 = [64, 156, 40, 40, 156], x1 = []; let acc = (W - w1.reduce((a, b) => a + b)) / 2; w1.forEach((w) => { x1.push(acc); acc += w; });
    const slot = (i, html, cls = '') => div(stage, 'u4l1-bslot ' + cls, html, x1[i], Y1, w1[i], HH);
    const opp = !!d.bx2, oneB = d.B === '';
    const A = slot(0, T(d.A), 'u4l1-br'), bx1 = slot(1, T(`(${d.bx})`), 'u4l1-bun'), op = slot(2, T(d.op)), B = slot(3, oneB ? '' : T(d.B), 'u4l1-br');
    const bx2 = slot(4, T(`(${opp ? d.bx2 : d.bx})`), 'u4l1-bun' + (opp ? ' u4l1-bun-opp' : ''));
    const ghost = oneB ? hide(div(B, 'u4l1-ghost1', T('1'))) : null;
    // the result row: = [bracket] ( A op B )
    const w2 = [40, 156, 18, 60, 40, 36, 18], x2 = []; acc = (W - w2.reduce((a, b) => a + b)) / 2; w2.forEach((w) => { x2.push(acc); acc += w; });
    const eq = hide(div(stage, 'u4l1-bslot', T('='), x2[0], Y2, w2[0], HH));
    const rb = hide(div(stage, 'u4l1-bslot u4l1-bun', T(`(${d.bx})`), x1[1], Y1, w1[1], HH));
    const lp = hide(div(stage, 'u4l1-bslot u4l1-paren', T('\\Big('), x2[2], Y2, w2[2], HH)), rp = hide(div(stage, 'u4l1-bslot u4l1-paren', T('\\Big)'), x2[6], Y2, w2[6], HH));
    const fopB = opp ? '-' : d.op, fB = oneB ? '1' : d.B;
    const rA = hide(div(stage, 'u4l1-bslot u4l1-br', T(d.A), x1[0], Y1, w1[0], HH)), rop = hide(div(stage, 'u4l1-bslot', T(fopB), x2[4], Y2, w2[4], HH));
    const rB = hide(div(stage, 'u4l1-bslot u4l1-br', T(fB), x1[3], Y1, w1[3], HH));
    const note = hide(panel(stage, (W - 700) / 2, 262, 700, 96, '', 'u4l1-bnote'));
    const ans = `(${d.bx})(${d.A}${fopB}${fB})`;
    if (opp) note.innerHTML = `<div class="u4l1-line">${T(`b=5:\\quad b-2=${cP('3')}\\quad\\text{but}\\quad 2-b=\\textcolor{${COLORS.orange}}{-3}`)}</div><div class="u4l1-line">${T(`\\text{Opposites: }\\ 2-b=-(b-2),\\ \\text{ so }\\ +7(2-b)=-7(b-2)`)}</div>`;
    else if (oneB) note.innerHTML = `<div class="u4l1-line">${T(`(2x-1)=${cC('1')}(2x-1)`)}: the second term has a hidden coefficient <b>1</b>.</div><div class="u4l1-line">Taking the bracket out leaves <b>1</b>, not 0.</div>`;
    else note.innerHTML = `<div class="u4l1-line">Treat the bracket as one object ${T('\\blacksquare')}:</div><div class="u4l1-line u4l1-big">${T(`${d.A}\\,${cP('\\blacksquare')}${d.op}${d.B}\\,${cP('\\blacksquare')}=(${d.A}${d.op}${d.B})\\,${cP('\\blacksquare')}`)}</div>`;
    const chk = hide(div(stage, 'u4l1-big u4l1-ok', T(`\\text{Check: both expand to }${d.exp}\\ \\checkmark`), 0, 262, W)); chk.style.textAlign = 'center';
    const st = hide(stamp(stage, 'factored', { x: W - 120, y: Y2 + 32 }));
    const fly = (c, el, x, y, w) => anim(c, el, [{ left: el.style.left, top: el.style.top, width: el.style.width }, { left: x + 'px', top: y + 'px', width: w + 'px' }], 560);
    const merge = async (c) => {
      rb.style.opacity = 1; bx1.style.opacity = 0.25; bx2.style.opacity = 0.25;
      await show(c, eq); await fly(c, rb, x2[1], Y2, w2[1]);
    };
    const leftovers = async (c) => {
      rA.style.opacity = 1; rB.style.opacity = 1; A.style.opacity = 0.3; B.style.opacity = 0.3;
      await Promise.all([fly(c, rA, x2[3], Y2, w2[3]), fly(c, rB, x2[5], Y2, w2[5]), appear(c, rop, 400), appear(c, lp, 400), appear(c, rp, 400)]);
    };
    if (opp) return [
      { cap: `Both terms have a bracket, but ${T('(b-2)')} and ${T('(2-b)')} are <b>opposites</b>, not the same.`, run: async (c) => { await pulse(c, bx1, 1.06); await shake(c, bx2); } },
      { cap: `Test ${T('b=5')}: ${T('b-2=3')} but ${T('2-b=-3')}. So ${T('2-b=-(b-2)')}.`, run: (c) => show(c, note) },
      { cap: `Then ${T('+7(2-b)=-7(b-2)')}: now both brackets match.`, run: async (c) => {
        await anim(c, bx2, [{ transform: 'rotateY(0deg)' }, { transform: 'rotateY(90deg)' }], 260);
        bx2.innerHTML = T(`(${d.bx})`); bx2.classList.remove('u4l1-bun-opp'); op.innerHTML = T('-'); op.classList.add('u4l1-flipped');
        await anim(c, bx2, [{ transform: 'rotateY(90deg)' }, { transform: 'rotateY(0deg)' }], 260);
      } },
      { cap: `Take the common bracket ${T(cP('(b-2)'))} out in front.`, run: async (c) => { note.style.opacity = 0; await merge(c); } },
      { cap: `What is left of each term, ${T('a')} and ${T('-7')}, goes in the second bracket: ${T(ans)}.`, run: leftovers },
      { cap: `Check by expanding: both give ${T(d.exp)}.`, run: async (c) => { await show(c, chk); await stampIn(c, st); } }
    ];
    return [
      { cap: `Both terms contain the same bracket ${T(cP(`(${d.bx})`))}.`, run: async (c) => { await Promise.all([pulse(c, bx1, 1.08), pulse(c, bx2, 1.08)]); } },
      oneB ? { cap: `The second term is ${T(`1(${d.bx})`)}: there is a <b>hidden 1</b> in front of the bracket.`, run: async (c) => { await pop(c, ghost); await show(c, note); } }
        : { cap: `Treat the bracket as one object, like a box: ${T(`${d.A}`)} boxes ${d.op === '+' ? 'plus' : 'minus'} ${T(d.B)} boxes.`, run: (c) => show(c, note) },
      { cap: `Take the common bracket out in front, just like a monomial GCF.`, run: async (c) => { note.style.opacity = 0; await merge(c); } },
      { cap: `What is left of each term goes in the second bracket: ${T(ans)}.`, run: async (c) => { if (ghost) ghost.style.opacity = 0; await leftovers(c); } },
      { cap: `Check by expanding: both give ${T(d.exp)}.`, run: async (c) => { await show(c, chk); await stampIn(c, st); } }
    ];
  }
};

/* =============================== explainer: grouping =============================== */
const GR = {
  n: { label: T('x^3+4x^2-3x-12'), terms: ['x^3', '+4x^2', '-3x', '-12'], p1: ['x^2', 'x+4'], p2: ['-3', 'x+4'], res: ['x+4', 'x^2-3'], exp: '(x+4)(x^2-3)=x^3-3x+4x^2-12' },
  e3a: { label: 'Example 3(a)', terms: ['6ab', '-9a', '+4b', '-6'], p1: ['3a', '2b-3'], p2: ['+2', '2b-3'], res: ['2b-3', '3a+2'], exp: '(2b-3)(3a+2)=6ab+4b-9a-6' },
  e3b: { label: '3(b)', terms: ['xy', '-5x', '-2y', '+10'], p1: ['x', 'y-5'], bad: ['+2', '-y+5'], p2: ['-2', 'y-5'], res: ['y-5', 'x-2'], exp: '(y-5)(x-2)=xy-2y-5x+10' },
  e3c: { label: '3(c)', terms: ['2xy', '+15', '+6x', '+5y'], order: [0, 2, 3, 1], p1: ['2x', 'y+3'], p2: ['+5', 'y+3'], res: ['y+3', '2x+5'], exp: '(y+3)(2x+5)=2xy+5y+6x+15' }
};
const grouping = {
  title: 'Factoring by grouping',
  height: 340, minW: 900,
  choices: [{ v: 'n', label: GR.n.label }, { sep: 'Check:' }, ...['e3a', 'e3b', 'e3c'].map((k) => ({ v: k, label: GR[k].label }))],
  ask: (v) => `Factor ${T(GR[v].terms.join('').replace(/^\+/, ''))} by grouping.`,
  make(stage, v, ex) {
    const d = GR[v], W = ex.W, CW = 140, CH = 60, Y = 26;
    const sx = (i) => (W - 658) / 2 + i * 154 + (i >= 2 ? 56 : 0);
    const cards = d.terms.map((t, i) => div(stage, 'u4l1-card', T(i === 0 ? t.replace(/^\+/, '') : t), sx(i), Y, CW, CH));
    const svg = svgEl('svg', { class: 'u4l1-ov', width: W, height: 340 }, stage);
    const brace = (i, color) => {
      const x1 = sx(i) + 8, x2 = sx(i + 1) + CW - 8, m = (x1 + x2) / 2, y = Y + CH + 8;
      const g = svgEl('g', { class: 'bk-curve' }, svg); g.style.color = color;
      svgEl('path', { class: 'bk-stroke', d: `M${x1} ${y} q0 12 12 12 H${m - 12} q12 0 12 12 q0 -12 12 -12 H${x2 - 12} q12 0 12 -12`, fill: 'none', stroke: color, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
      hide(g); return g;
    };
    const b1 = brace(0, COLORS.blue), b2 = brace(2, COLORS.amber);
    const pm = (i) => (sx(i) + sx(i + 1) + CW) / 2, PY = 128;
    const pairEl = (i, g, br, cls = '') => centre(hide(div(stage, 'u4l1-pair ' + cls, T(`${cG(g)}${cls ? `\\textcolor{${COLORS.orange}}{(${br})}` : cP(`(${br})`)}`), pm(i), PY + 26)));
    const P1 = pairEl(0, d.p1[0], d.p1[1]), P2 = pairEl(2, d.p2[0], d.p2[1]);
    const bad = d.bad ? pairEl(2, d.bad[0], d.bad[1], 'u4l1-pair-bad') : null;
    const none = d.order ? [0, 2].map((i) => centre(hide(div(stage, 'u4l1-pair u4l1-pair-none', 'nothing in common', pm(i), PY + 26)))) : null;
    const R = hide(div(stage, 'u4l1-big u4l1-gres', T(`=${cP(`(${d.res[0]})`)}(${d.res[1]})`), 0, 214, W)); R.style.textAlign = 'center';
    const C = hide(div(stage, 'u4l1-big u4l1-ok', T(`\\text{Check: }${d.exp}\\ \\checkmark`), 0, 290, W)); C.style.textAlign = 'center';
    const st = hide(stamp(stage, 'factored', { x: W - 110, y: 236 }));
    const braces = async (c) => { b1.style.opacity = 1; b2.style.opacity = 1; await Promise.all([drawIn(b1, 500, c), drawIn(b2, 500, c)]); };
    const t = (i) => (i === 0 ? d.terms[i].replace(/^\+/, '') : d.terms[i]);
    const ord = d.order ? d.order.map((j) => d.terms[j]) : d.terms;
    const pr1 = `${ord[0].replace(/^\+/, '')}${ord[1]}`, pr2 = (ord[2] + ord[3]).replace(/^\+/, '');
    const steps = [{ cap: `Four terms, and no common factor in all four. Group them in <b>pairs</b>.`, run: braces }];
    if (d.order) {
      steps.push({ cap: `The pairs as written, ${T(`${t(0)}${t(1)}`)} and ${T(`${t(2)}${t(3)}`)}, share nothing.`, run: async (c) => { for (const e of none) await show(c, e); await Promise.all(none.map((e) => shake(c, e))); } });
      steps.push({ cap: `<b>Rearrange</b>: put the ${T('x')}-terms together: ${T(ord.join('').replace(/^\+/, ''))}.`, run: async (c) => {
        none.forEach((e) => (e.style.opacity = 0));
        await Promise.all(d.order.map((j, i) => anim(c, cards[j], [{ left: cards[j].style.left }, { left: sx(i) + 'px' }], 600)));
        cards.forEach((e, j) => { const i = d.order.indexOf(j); e.innerHTML = T(i === 0 ? d.terms[j].replace(/^\+/, '') : d.terms[j]); });
      } });
    }
    steps.push({ cap: `First pair: ${T(`${pr1}=${cG(d.p1[0])}(${d.p1[1]})`)}.`, run: (c) => show(c, P1) });
    if (d.bad) {
      steps.push({ cap: `Second pair: take out ${T('+2')}? ${T(`${pr2}=2(${d.bad[1]})`)}. The brackets <b>don't match</b>.`, run: async (c) => { await show(c, bad); await shake(c, bad); } });
      steps.push({ cap: `Take out ${T('-2')} instead: ${T(`${pr2}=${cG('-2')}(${d.p2[1]})`)}. A match!`, run: async (c) => { bad.style.opacity = 0; await show(c, P2); } });
    } else steps.push({ cap: `Second pair: ${T(`${pr2}=${cG(d.p2[0].replace(/^\+/, ''))}(${d.p2[1]})`)}.`, run: (c) => show(c, P2) });
    steps.push({ cap: `The brackets match: ${T(cP(`(${d.res[0]})`))} is a common factor of both parts.`, run: async (c) => { await Promise.all([pulse(c, P1, 1.1), pulse(c, P2, 1.1)]); } });
    steps.push({ cap: `Take it out: ${T(`${cP(`(${d.res[0]})`)}(${d.res[1]})`)}.`, run: (c) => show(c, R) });
    steps.push({ cap: `Check by expanding: back to the four terms.`, run: async (c) => { await show(c, C); await stampIn(c, st); } });
    return steps;
  }
};

const sideLab = (stage, html, x, y, pos, cls = '') => { const e = hide(div(stage, 'u4l1-slab ' + cls, html, x, y)); e.style.translate = pos === 'top' ? '-50% -100%' : '-100% -50%'; return e; };

/* =============================== explainer: find the two numbers with Ryan's X =============================== */
/* Ryan's X (2026-11-11): c goes on top (it is ac, with a = 1), b underneath, the two numbers on the sides; the factor
 * pairs are listed beside the X and the right pair is circled. */
const PS = {
  d24: { v: 'x', b: 10, c: 24, label: T('x^2+10x+24') },
  e4a: { v: 'n', b: 13, c: 36, label: 'Example 4(a)' }, e4b: { v: 'x', b: -10, c: 21, label: '4(b)' },
  e4c: { v: 'y', b: 2, c: -35, label: '4(c)' }, e4d: { v: 'p', b: -9, c: -36, label: '4(d)' },
  e5a: { v: 'x', w: 'y', b: -7, c: 12, label: 'Example 5(a)' }, e5b: { v: 'a', w: 'b', b: 1, c: -20, label: '5(b)' },
  e7a: { v: 'x', b: 5, c: 8, label: 'Example 7(a)' }
};
function psPairs(b, c) { // in the order a student lists them (c > 0 small first, c < 0 big first), stopping at the right pair
  const out = [], s = b < 0 ? -1 : 1, A = Math.abs(c);
  for (let k = 1; k * k <= A; k++) if (A % k === 0) {
    const pr = c > 0 ? [s * k, s * (A / k)] : [s * (A / k), -s * k];
    out.push(pr); if (pr[0] + pr[1] === b) break;
  }
  return out;
}
/** Ryan's X centred at (cx, cy): top and bottom values, labels above and below, side slots (hidden) */
function ryanX(stage, svg, cx, cy, r, top, bot, topLab, botLab) {
  const ln = (x1, y1, x2, y2) => svgEl('line', { x1, y1, x2, y2, stroke: COLORS.blue, 'stroke-width': 5, 'stroke-linecap': 'round' }, svg);
  const g = svgEl('g', {}, svg); g.style.opacity = 0;
  g.appendChild(ln(cx - r, cy - r, cx + r, cy + r)); g.appendChild(ln(cx + r, cy - r, cx - r, cy + r));
  const v = (cls, html, x, y) => centre(hide(div(stage, 'u4l1-xv ' + cls, html, x, y)));
  return { g, la: v('u4l1-xlab', topLab, cx, cy - r - 18), lb: v('u4l1-xlab', botLab, cx, cy + r + 20),
    top: v('u4l1-xtop', T(top), cx, cy - r * 0.6), bot: v('u4l1-xbot', T(bot), cx, cy + r * 0.62),
    L: v('u4l1-xside', '', cx - r * 0.8, cy), R: v('u4l1-xside', '', cx + r * 0.8, cy) };
}
const productSum = {
  title: 'Find the two numbers: the X',
  height: 430, minW: 900, capH: 84,
  choices: [{ v: 'd24', label: PS.d24.label }, { sep: 'Check:' }, ...['e4a', 'e4b', 'e4c', 'e4d', 'e5a', 'e5b', 'e7a'].map((k) => ({ v: k, label: PS[k].label }))],
  ask: (v) => { const d = PS[v]; return v === 'e7a' ? `Show that ${T(tri(d.v, d.b, d.c))} does not factor over the integers.` : `Factor ${T(tri(d.v, d.b, d.c, d.w || ''))}.`; },
  make(stage, v, ex) {
    const d = PS[v], w = d.w || '', pairs = psPairs(d.b, d.c), W = ex.W, H = 430;
    const hit = pairs.findIndex(([p, q]) => p + q === d.b), [m, n] = hit >= 0 ? pairs[hit] : [0, 0];
    const triC = `${d.v}^2${d.b < 0 ? '-' : '+'}${cB(Math.abs(d.b) === 1 ? '' : Math.abs(d.b))}${d.v}${w}${d.c < 0 ? '-' : '+'}${cC(Math.abs(d.c))}${w ? w + '^2' : ''}`;
    const ans = hit >= 0 ? `${bin(d.v, m, w)}${bin(d.v, n, w)}` : '';
    div(stage, 'u4l1-fbig', T(triC), 20, 8);
    div(stage, 'u4l1-muted', `multiply to ${T(cC(sn(d.c)))}, add to ${T(cB(sn(d.b)))}`, 22, 58);
    const svg = svgEl('svg', { class: 'u4l1-ov', width: W, height: H }, stage);
    const sNum = (k, x, y) => hide(div(stage, 'u4l1-sn', String(k), x, y));
    // left: the X and the pair list
    const XC = 120, YC = 262, XR = 64;
    const X = ryanX(stage, svg, XC, YC, XR, sn(d.c), sn(d.b), T(cC('c')), T(cB('b')));
    const n1 = sNum(1, 14, 112);
    const RH = pairs.length > 4 ? 40 : 46, LX = 236, LY = YC - (pairs.length * RH) / 2 + 4;
    const rows = pairs.map(([p, q], i) => {
      const e = hide(div(stage, 'u4l1-xp', `<span>${T(`${sn(p)}\\times${pn(q)}`)}</span><span class="u4l1-xps">${T(`\\text{sum }${sn(p + q)}`)}</span>`, LX, LY + i * RH, 226, RH - 8));
      e.ok = p + q === d.b; return e;
    });
    // right: signs, then the answer and the check
    const SX = 500, SW = W - SX - 16;
    const sg = panel(stage, SX + 40, 8, SW - 40, 128, 'Signs');
    const n2 = sNum(2, SX, 14);
    const r1 = h('div', 'u4l1-rule', `${T('c>0')}: <b>same</b> signs, the sign of ${T('b')}`), r2 = h('div', 'u4l1-rule', `${T('c<0')}: <b>opposite</b> signs; the larger size takes the sign of ${T('b')}`);
    sg.append(r1, r2); const lit = d.c > 0 ? r1 : r2;
    const signCap = d.c > 0 ? `${T(`c=${d.c}>0`)}: same signs, and ${T(`b=${d.b}`)} is ${d.b > 0 ? 'positive' : 'negative'}, so both numbers are ${d.b > 0 ? 'positive' : 'negative'}.`
      : `${T(`c=${d.c}<0`)}: opposite signs, and ${T(`b=${d.b}`)} is ${d.b > 0 ? 'positive' : 'negative'}, so the larger number is ${d.b > 0 ? 'positive' : 'negative'}.`;
    const n3 = sNum(3, SX, 168), A = hide(div(stage, 'u4l1-fbig', T(`=${ans}`), SX + 40, 162));
    const cw = w ? w + '^2' : '';
    const n4 = sNum(4, SX, 238);
    const C1 = hide(div(stage, 'u4l1-wl u4l1-ok', T(`\\text{Check: }${ans}`), SX + 40, 232));
    const C2 = hide(div(stage, 'u4l1-wl u4l1-ok', T(`=${d.v}^2${term(n, d.v + w, false)}${term(m, d.v + w, false)}${term(m * n, cw, false)}`), SX + 40, 276));
    const C3 = hide(div(stage, 'u4l1-wl u4l1-ok', T(`=${tri(d.v, d.b, d.c, w)}\\ \\checkmark`), SX + 40, 320));
    const st = hit >= 0 ? hide(stamp(stage, 'factored', { x: SX + SW / 2 + 60, y: 392 })) : hide(stamp(stage, 'does not factor', { ok: false, x: SX + SW / 2 + 20, y: 210, size: 'lg' }));
    const showX = async (c) => { X.g.style.opacity = 1; await appear(c, X.g, 300); await show(c, n1); await show(c, X.la); await pop(c, X.top); await show(c, X.lb); await pop(c, X.bot); };
    const steps = [
      { cap: `Draw the X. ${T(cC(sn(d.c)))} goes on <b>top</b> (it is ${T('ac')}, and here ${T('a=1')}), ${T(cB(sn(d.b)))} goes <b>underneath</b>. The two numbers on the sides must <b>multiply</b> to the top and <b>add</b> to the bottom.`, run: showX },
      { cap: signCap, run: async (c) => { await show(c, n2); lit.classList.add('u4l1-rule-on'); await pulse(c, lit, 1.04); } },
      { cap: `List the factor pairs of ${T(String(Math.abs(d.c)))} with those signs, in order, and check each sum.`, run: async (c) => { for (const r of rows) await show(c, r); } }
    ];
    if (hit < 0) {
      steps.push({ cap: `No pair adds to ${T(String(d.b))}. ${d.c > 0 ? `(Pairs with the other sign add to ${pairs.map(([p, q]) => T(sn(-(p + q)))).join(' and ')}: no good either.)` : ''} So ${T(tri(d.v, d.b, d.c))} <b>does not factor over the integers</b>.`,
        run: async (c) => { rows.forEach((r) => r.classList.add('u4l1-xp-no')); await shake(c, X.bot); await stampIn(c, st); } });
      return steps;
    }
    steps.push({ cap: `${T(sn(m))} and ${T(sn(n))}: product ${T(cC(sn(m * n)))}, sum ${T(cB(sn(m + n)))}. <b>Circle</b> that pair and write the two numbers on the sides of the X.`,
      run: async (c) => { rows.forEach((r) => r.classList.add(r.ok ? 'u4l1-xp-ok' : 'u4l1-xp-no')); await pulse(c, rows[hit], 1.06); X.L.innerHTML = T(sn(m)); X.R.innerHTML = T(sn(n)); await pop(c, X.L); await pop(c, X.R); } });
    steps.push({ cap: `The two numbers go in the brackets: ${T(`${tri(d.v, d.b, d.c, w)}=${ans}`)}.` + (w ? ` Keep the ${T(w)} with each number.` : ''), run: async (c) => { await show(c, n3); await show(c, A); } });
    steps.push({ cap: `Check by expanding: ${T(ans)} gives back ${T(tri(d.v, d.b, d.c, w))}.`, run: async (c) => { await show(c, n4); await show(c, C1); await show(c, C2); await show(c, C3); await stampIn(c, st); } });
    return steps;
  }
};

/* =============================== explainer: the factoring checklist =============================== */
const FU = {
  e6a: { label: 'Example 6(a)', start: '4x^2-8x-60', steps: [
    ['gcf', `GCF first: ${T('4')} divides every term. The numbers inside are much smaller.`, '=4(x^2-2x-15)'],
    ['tri', `Inside is ${T('x^2+bx+c')}: product ${T('-15')}, sum ${T('-2')}: ${T('-5')} and ${T('3')}.`, '=4(x-5)(x+3)'],
    ['again', `Can ${T('4')}, ${T('x-5')} or ${T('x+3')} be factored again? No: it is factored fully.`, null],
    ['chk', `Check by expanding.`, ['\\text{check: }4(x^2-2x-15)', '=4x^2-8x-60\\ \\checkmark']]] },
  e6b: { label: '6(b)', start: '2a^3+14a^2+24a', steps: [
    ['gcf', `GCF first: ${T('2a')} is in every term.`, '=2a(a^2+7a+12)'],
    ['tri', `Inside: product ${T('12')}, sum ${T('7')}: ${T('3')} and ${T('4')}.`, '=2a(a+3)(a+4)'],
    ['again', `Can ${T('2a')}, ${T('a+3')} or ${T('a+4')} be factored again? No.`, null],
    ['chk', `Check by expanding.`, ['\\text{check: }2a(a^2+7a+12)', '=2a^3+14a^2+24a\\ \\checkmark']]] },
  e6c: { label: '6(c)', start: '-x^2+2x+48', steps: [
    ['gcf', `No common number, but the leading term is <b>negative</b>: take out ${T('-1')}. Every sign flips.`, '=-(x^2-2x-48)'],
    ['tri', `Inside: product ${T('-48')}, sum ${T('-2')}: ${T('-8')} and ${T('6')}.`, '=-(x-8)(x+6)'],
    ['again', `Nothing factors again. Moving the minus into the first bracket gives the other form: ${T('(8-x)(x+6)')}.`, '\\text{or }\\ (8-x)(x+6)'],
    ['chk', `Check by expanding.`, ['\\text{check: }-(x^2-2x-48)', '=-x^2+2x+48\\ \\checkmark']]] },
  e6d: { label: '6(d)', start: '5x^2y-15xy^2-50y^3', steps: [
    ['gcf', `GCF first: ${T('5y')} is in every term.`, '=5y(x^2-3xy-10y^2)'],
    ['tri', `Inside: product ${T('-10')}, sum ${T('-3')}: ${T('-5')} and ${T('2')}. Keep the ${T('y')}.`, '=5y(x-5y)(x+2y)'],
    ['again', `Can any factor be factored again? No.`, null],
    ['chk', `Check by expanding.`, ['\\text{check: }5y(x^2-3xy-10y^2)', '=5x^2y-15xy^2-50y^3\\ \\checkmark']]] },
  grp: { label: T('x^3+4x^2-3x-12'), start: 'x^3+4x^2-3x-12', steps: [
    ['gcf', `GCF of all four terms? Only ${T('1')}. Nothing to take out.`, null],
    ['grp', `Four terms: <b>grouping</b>.`, '=x^2(x+4)-3(x+4)=(x+4)(x^2-3)'],
    ['again', `Can ${T('x^2-3')} be factored? Product ${T('-3')}, sum ${T('0')}: no pair works. Done.`, null],
    ['chk', `Check by expanding.`, ['\\text{check: }(x+4)(x^2-3)', '=x^3-3x+4x^2-12\\ \\checkmark']]] }
};
const fully = {
  title: 'The factoring checklist',
  height: 420, minW: 900,
  choices: [...['e6a', 'e6b', 'e6c', 'e6d'].map((k) => ({ v: k, label: FU[k].label })), { sep: 'Grouping:' }, { v: 'grp', label: FU.grp.label }],
  ask: (v) => `Factor ${T(FU[v].start)} fully.`,
  make(stage, v, ex) {
    const d = FU[v];
    const F = new Flowchart(stage, { x: 4, y: 0, width: 470, height: 420,
      nodes: {
        start: { x: 235, y: 30, w: 260, h: 46, html: '<b>Factor fully</b>', cls: 'bk-round' },
        gcf: { x: 235, y: 102, w: 400, h: 56, html: '<b>1. GCF first</b>negative if the leading term is negative' },
        cnt: { x: 235, y: 172, w: 260, h: 46, html: '<b>2. Count the terms</b>' },
        grp: { x: 110, y: 246, w: 200, h: 56, html: '<b>4 terms</b>grouping' },
        tri: { x: 360, y: 246, w: 200, h: 56, html: `<b>${T('x^2+bx+c')}</b>product and sum` },
        again: { x: 235, y: 320, w: 400, h: 56, html: '<b>3. Factor again?</b>check every factor' },
        chk: { x: 235, y: 390, w: 300, h: 46, html: '<b>4. Check</b> by expanding', cls: 'bk-round' }
      },
      edges: [{ from: 'start', to: 'gcf' }, { from: 'gcf', to: 'cnt' }, { from: 'cnt', to: 'grp', route: 'vhv' }, { from: 'cnt', to: 'tri', route: 'vhv' },
        { from: 'grp', to: 'again', route: 'vhv' }, { from: 'tri', to: 'again', route: 'vhv' }, { from: 'again', to: 'chk' }] });
    const P = panel(stage, 500, 8, ex.W - 516, 404, 'Working', 'u4l1-work');
    const L0 = lineIn(P, T(d.start), 'u4l1-wl');
    const ls = d.steps.map((s) => (s[2] ? [].concat(s[2]).map((l) => lineIn(P, T(l), 'u4l1-wl' + (s[0] === 'chk' ? ' u4l1-ok' : ''))) : []));
    const st = hide(stamp(P, 'fully factored', { x: (ex.W - 516) / 2, y: 330 }));
    let cur = 'start';
    const goTo = async (c, id) => { if (id === 'grp' || id === 'tri') { await F.go(c, cur, 'cnt'); await F.visit(c, 'cnt'); cur = 'cnt'; } await F.go(c, cur, id); await F.visit(c, id); cur = id; };
    return [
      { cap: `Factor ${T(d.start)} fully: work down the checklist.`, run: async (c) => { cur = 'start'; await F.visit(c, 'start'); await show(c, L0); } },
      ...d.steps.map((s, i) => ({ cap: s[1], run: async (c) => { await goTo(c, s[0]); for (const l of ls[i]) await show(c, l); if (s[0] === 'again') await stampIn(c, st); } }))
    ];
  }
};

/* =============================== explainer: is it a factor? =============================== */
const IF = {
  e7c: { label: 'Example 7(c)', cand: 'x-4', poly: '2x^2-2x-24', lines: ['=2(x^2-x-12)', '=2(x-4)(x+3)'], cards: ['2', '(x-4)', '(x+3)'], hit: 1, yes: true },
  e7d: { label: '7(d)', cand: 'x+2', poly: 'x^3+2x^2-9x-18', lines: ['=x^2(x+2)-9(x+2)', '=(x+2)(x^2-9)'], cards: ['(x+2)', '(x^2-9)'], hit: 0, yes: true,
    note: `(${T('x^2-9')} factors again as a difference of squares in Lesson 4, but ${T('x+2')} is already there.)` },
  asc: { label: T('x-7\\text{ and }35+2x-x^2'), cand: 'x-7', poly: '35+2x-x^2', lines: ['=(7-x)(5+x)'], cards: ['(7-x)', '(5+x)'], hit: 0, yes: true, flip: '=-(x-7)' },
  no: { label: T('x-3\\text{ and }x^2-4x-21'), cand: 'x-3', poly: 'x^2-4x-21', lines: ['=(x-7)(x+3)'], cards: ['(x-7)', '(x+3)'], hit: -1, near: 1, yes: false }
};
const isFactor = {
  title: 'Is it a factor?',
  height: 400, minW: 900,
  choices: [{ v: 'asc', label: IF.asc.label }, { v: 'no', label: IF.no.label }, { sep: 'Check:' }, { v: 'e7c', label: IF.e7c.label }, { v: 'e7d', label: IF.e7d.label }],
  ask: (v) => `Is ${T(IF[v].cand)} a factor of ${T(IF[v].poly)}?`,
  make(stage, v, ex) {
    const d = IF[v], W = ex.W;
    const P = panel(stage, 16, 8, W - 32, 172, 'Factor fully', 'u4l1-work');
    lineIn(P, T(d.poly), 'u4l1-wl').style.opacity = 1;
    const ls = d.lines.map((l) => lineIn(P, T(l), 'u4l1-wl'));
    const CW = 170, gap = 26, n = d.cards.length, x0 = (W - (n * CW + (n - 1) * gap)) / 2, CY = 290;
    const cards = d.cards.map((t, i) => hide(div(stage, 'u4l1-fcard', T(t), x0 + i * (CW + gap), CY, CW, 64)));
    const sub = d.flip ? hide(div(stage, 'u4l1-fsubl', T(d.flip), x0 + d.hit * (CW + gap), CY + 70, CW)) : null;
    const cand = hide(div(stage, 'u4l1-fcard u4l1-cand', T(d.cand), 20, 200, CW, 64));
    const st = hide(stamp(stage, d.yes ? 'yes' : 'no', { ok: d.yes, x: W - 110, y: 228, size: 'lg' }));
    const note = d.note ? hide(div(stage, 'u4l1-muted', d.note, 0, CY + 76, W)) : null;
    if (note) note.style.textAlign = 'center';
    const cx = (i) => x0 + i * (CW + gap);
    return [
      { cap: `To test a factor, <b>factor fully</b> first.`, run: async (c) => { for (const l of ls) await show(c, l); } },
      { cap: `The factors are ${d.cards.map((t) => T(t)).join(', ')}.`, run: async (c) => { for (const e of cards) await pop(c, e); } },
      { cap: `Look for ${T(d.cand)} among them.` + (d.flip ? ` ${T('7-x=-(x-7)')}: it counts!` : ''),
        run: async (c) => {
          await show(c, cand);
          for (let i = 0; i < n; i++) {
            await anim(c, cand, [{ left: cand.style.left, top: cand.style.top }, { left: cx(i) + 'px', top: '200px' }], 420);
            if (i === d.hit) { cards[i].classList.add('u4l1-fcard-hit'); if (sub) await show(c, sub); await pulse(c, cards[i], 1.08); break; }
            await shake(c, cand);
          }
        } },
      { cap: d.yes ? `<b>Yes</b>, ${T(d.cand)} is a factor of ${T(d.poly)}.` : `<b>No.</b> ${T('x+3')} is a factor, but ${T('x-3')} is not: the signs matter.`,
        run: async (c) => { if (!d.yes) cards[d.near].classList.add('u4l1-fcard-near'); if (note) await show(c, note); await stampIn(c, st); } }
    ];
  }
};

/* =============================== explainer: the patio (area model to scale) =============================== */
const patio = {
  title: 'Factoring and area',
  height: 420, minW: 900, capH: 84,
  choices: [{ v: 5, label: 'Example 8 check (x = 5)' }, { sep: 'Try:' }, { v: 2, label: T('x=2') }, { v: 10, label: T('x=10') }],
  ask: (v) => `A patio has an area of ${T('(x^2+11x+28)')} m². Find its length, width and perimeter, then use ${T(`x=${v}`)}.`,
  make(stage, x, ex) {
    const W = ex.W, Lm = x + 7, Wm = x + 4, s = Math.min(400 / Lm, 320 / Wm), OX = 62, OY = 52, RW = Lm * s, RH = Wm * s, xs = x * s;
    const reg = (cls, lx, ly, w, hh, t, tv) => { const e = div(stage, 'u4l1-preg ' + cls, `<span class="u4l1-plab">${T(t)}</span>`, OX + lx, OY + ly, w, hh); e.tv = tv; return e; };
    const R = [reg('u4l1-p-x2', 0, 0, xs, xs, 'x^2', `${x}^2=${x * x}`), reg('u4l1-p-x', xs, 0, 7 * s, xs, '7x', `7(${x})=${7 * x}`), reg('u4l1-p-x', 0, xs, xs, 4 * s, '4x', `4(${x})=${4 * x}`), reg('u4l1-p-u', xs, xs, 7 * s, 4 * s, '28', '28')];
    R.forEach(hide);
    const svg = svgEl('svg', { class: 'u4l1-ov', width: W, height: 420 }, stage);
    const grid = svgEl('g', { class: 'u4l1-pgrid' }, svg); hide(grid);
    for (let i = 1; i < Lm; i++) svgEl('line', { x1: OX + i * s, y1: OY, x2: OX + i * s, y2: OY + RH }, grid);
    for (let j = 1; j < Wm; j++) svgEl('line', { x1: OX, y1: OY + j * s, x2: OX + RW, y2: OY + j * s }, grid);
    const bg = svgEl('g', { class: 'bk-curve' }, svg); bg.style.color = GC;
    svgEl('path', { class: 'bk-stroke', d: `M${OX} ${OY} H${OX + RW} V${OY + RH} H${OX} Z`, fill: 'none', stroke: GC, 'stroke-width': 5, 'stroke-linejoin': 'round' }, bg); hide(bg);
    const top = [sideLab(stage, T('x'), OX + xs / 2, OY - 6, 'top'), sideLab(stage, T('7'), OX + xs + 3.5 * s, OY - 6, 'top')];
    const left = [sideLab(stage, T('x'), OX - 10, OY + xs / 2, 'left'), sideLab(stage, T('4'), OX - 10, OY + xs + 2 * s, 'left')];
    const lenL = centre(hide(div(stage, 'u4l1-ptot', `length ${T('x+7')}`, OX + RW / 2, OY + RH + 24)));
    const widL = hide(div(stage, 'u4l1-ptot u4l1-pvert', `width ${T('x+4')}`, OX + RW + 12, OY + RH / 2)); widL.style.translate = '0 -50%';
    const P = panel(stage, 584, 8, W - 600, 404, 'Patio', 'u4l1-work');
    const l1 = lineIn(P, T('x^2+11x+28=(x+7)(x+4)'), 'u4l1-wl u4l1-wl-sm');
    const l2 = lineIn(P, `length ${T('x+7')}, width ${T('x+4')}`, 'u4l1-wl u4l1-wl-sm');
    const l3 = lineIn(P, T('P=2(x+7)+2(x+4)'), 'u4l1-wl u4l1-wl-sm'), l3b = lineIn(P, T('\\phantom{P}=4x+22'), 'u4l1-wl u4l1-wl-sm');
    const l4 = lineIn(P, `${T(`x=${x}`)}: ${T(`${Lm}`)} m by ${T(`${Wm}`)} m`, 'u4l1-wl u4l1-wl-sm');
    const l5 = lineIn(P, T(`P=4(${x})+22=${4 * x + 22}\\text{ m}`), 'u4l1-wl u4l1-wl-sm');
    const A = x * x + 11 * x + 28;
    const l6 = lineIn(P, T(`A=${x * x}+${11 * x}+28=${A}\\text{ m}^2`), 'u4l1-wl u4l1-wl-sm');
    const l7 = lineIn(P, T(`${Lm}\\times${Wm}=${Lm * Wm}\\ \\checkmark`), 'u4l1-wl u4l1-wl-sm u4l1-ok');
    const st = hide(stamp(P, 'area checks', { x: (W - 600) / 2, y: 376 }));
    return [
      { cap: `An area of ${T('x^2+11x+28')} is a rectangle: ${T('x^2')}, ${T('7x')} and ${T('4x')} strips, and a corner of ${T('28')}. ${T('7\\times4=28')} and ${T('7+4=11')}.`, run: async (c) => { for (const e of R) await show(c, e); await show(c, l1); } },
      { cap: `Its sides are the factors: length ${T('x+7')}, width ${T('x+4')}.`, run: async (c) => { for (const e of [...top, ...left]) await show(c, e); await show(c, lenL); await show(c, widL); await show(c, l2); } },
      { cap: `Perimeter: walk all the way around. ${T('2(x+7)+2(x+4)=4x+22')}.`, run: async (c) => { bg.style.opacity = 1; await drawIn(bg, 900, c); await show(c, l3); await show(c, l3b); } },
      { cap: `Put in ${T(`x=${x}`)}: length ${T(`${x}+7=${Lm}`)} m and width ${T(`${x}+4=${Wm}`)} m. Here is the patio in 1 m squares.`,
        run: async (c) => { grid.style.opacity = 1; await appear(c, grid, 400); lenL.innerHTML = `length ${T(`${Lm}`)} m`; widL.innerHTML = `width ${T(`${Wm}`)} m`; top[0].innerHTML = T(String(x)); left[0].innerHTML = T(String(x)); await show(c, l4); } },
      { cap: `Perimeter ${T(`4(${x})+22=${4 * x + 22}`)} m. Check: ${T(`${Lm}+${Wm}+${Lm}+${Wm}=${2 * (Lm + Wm)}`)}.`, run: (c) => show(c, l5) },
      { cap: `Area from the trinomial: ${T(`${x * x}+${7 * x}+${4 * x}+28=${A}`)} m². Length × width: ${T(`${Lm}\\times${Wm}=${Lm * Wm}`)} ✓`,
        run: async (c) => { R.forEach((e) => (e.firstChild.innerHTML = T(e.tv))); await show(c, l6); await show(c, l7); await stampIn(c, st); } }
    ];
  }
};

/* =============================== Stand Up Break =============================== */
function triFromPair(r, opts) { // m, n nonzero, distinct sums ≠ 0
  for (;;) {
    const m = r.int(opts.lo, opts.hi), n = r.int(opts.lo, opts.hi);
    if (!m || !n || m + n === 0 || m === n) continue;
    if (opts.pos && (m < 0 || n < 0)) continue;
    if (opts.mixed && m > 0 && n > 0) continue;
    return [Math.min(m, n), Math.max(m, n)];
  }
}
standup('u4l1', {
  intro: 'At your whiteboard: GCF first, then product and sum. Check by expanding.',
  levels: {
    BEG: (r) => {
      if (r.chance(0.4)) {
        const g = r.pick([2, 3, 4, 5, 6]), p = r.int(1, 3), a = r.pick([2, 3, 5, 7]), b = r.pick([1, 2, 3, 4, 5, 7].filter((k) => gcd(k, a) === 1));
        return { text: 'Factor by taking out the GCF.', q: `${g * a}${xp('x', p + 1)}-${g * b}${xp('x', p)}`, a: [`\\text{GCF}=${g}${xp('x', p)}`, `=${g}${xp('x', p)}(${a}x-${b})`] };
      }
      const [m, n] = triFromPair(r, { lo: 1, hi: 9, pos: true });
      return { text: 'Factor.', q: tri('x', m + n, m * n), a: [`\\text{product }${m * n},\\ \\text{sum }${m + n}:\\ ${m},\\ ${n}`, `=(x+${m})(x+${n})`] };
    },
    PRG: (r) => {
      const t = r.int(0, 2);
      if (t === 0) {
        const [m, n] = triFromPair(r, { lo: -9, hi: 9, mixed: true });
        return { text: 'Factor.', q: tri('x', m + n, m * n), a: [`\\text{product }${sn(m * n)},\\ \\text{sum }${sn(m + n)}:\\ ${sn(m)},\\ ${sn(n)}`, `=${bin('x', m)}${bin('x', n)}`] };
      }
      if (t === 1) {
        const [m, n] = triFromPair(r, { lo: -8, hi: 8 });
        return { text: 'Factor.', q: tri('a', m + n, m * n, 'b'), a: [`\\text{product }${sn(m * n)},\\ \\text{sum }${sn(m + n)}:\\ ${sn(m)},\\ ${sn(n)}`, `=${bin('a', m, 'b')}${bin('a', n, 'b')}`] };
      }
      const a = r.pick([1, 2, 3, 4, 5, 6, -1, -2, -3, -5]), b = r.pick([2, 3, 5, 6, 7, -2, -3, -5, -6, -7]);
      return { text: 'Factor by grouping.', q: `x^3${term(a, 'x^2', false)}${term(b, 'x', false)}${term(a * b, '', false)}`,
        a: [`=x^2${bin('x', a)}${b < 0 ? '-' : '+'}${Math.abs(b)}${bin('x', a)}`, `=${bin('x', a)}(x^2${term(b, '', false)})`] };
    },
    MAS: (r) => {
      const [m, n] = triFromPair(r, { lo: -8, hi: 8 }), b = m + n, c = m * n;
      if (r.chance(0.35)) {
        return { text: 'Factor fully.', q: `-x^2${term(-b, 'x', false)}${term(-c, '', false)}`, a: [`=-(${tri('x', b, c)})`, `=-${bin('x', m)}${bin('x', n)}`] };
      }
      const k = r.pick([2, 3, 4, 5]), withX = r.chance(0.5), g = `${k}${withX ? 'x' : ''}`;
      const q = withX ? `${k}x^3${term(k * b, 'x^2', false)}${term(k * c, 'x', false)}` : `${k}x^2${term(k * b, 'x', false)}${term(k * c, '', false)}`;
      return { text: 'Factor fully.', q, a: [`=${g}(${tri('x', b, c)})`, `=${g}${bin('x', m)}${bin('x', n)}`] };
    }
  }
});

/* =============================== mount =============================== */
export const explainers = mountExplainers({ gcf, binomial, grouping, productSum, fully, isFactor, patio });
export const _test = { term, tri, bin, psPairs, GF, BI, GR, PS, FU, IF };
