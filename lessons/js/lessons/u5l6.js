/* Math 20-1 · Unit 5 · Lesson 6 — Completing the Square.
 * New lesson format (2026-11-11): the warm-up ("The Locker Hallway") is plain markup on the page (no code). No
 * algebra-tile / area picture (Ryan: no visual "why it works" proofs; the written procedure instead). Explainers:
 *   halfsq  (the half-it-square-it conveyor: b rides into the HALVE station, half of b drops into the bracket, then the
 *            SQUARE station gives the number to add; steps 1–3 numbered; Example 1(a)–(d)),
 *   steps   (THE procedure, one animation with numbered steps that match the key-idea boxes: 1–3 when a = 1, 1–4 when
 *            a ≠ 1; each step's side calculation under its line; the payoff: the vertex-form graph traced exactly over
 *            the general-form graph and the vertex lit up; Example 2(a), 2(c), 4(a), 4(c), 5(b), 5(c), 5(d)),
 *   useit   (using the vertex form, Example 6: (a) the zeros, ± the square root reaching both ways from the axis onto the
 *            x-intercepts; (b) the ball flies beside its graph and stops at the vertex, the greatest height),
 *   verdict (spot the error: the student's work against the correct work line by line, a scanner, ✓ / ✗ marks and a
 *            verdict stamp: forgot × a (Example 7(b)), a not factored from the x-term, a sign error with negative a, the
 *            wrong sign inside the bracket).
 * Colours: a blue, b amber, the square of half of b purple, the number moved out (× a) green, the vertex brand,
 *   errors red. */
import {
  h, tex, add, box, Graph, stamp, stampIn, mountExplainers, pop, fadeIn, tween, anim, pulse, shake, linear, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const CA = COLORS.blue, CB = COLORS.amber, CP = COLORS.purple, CG = COLORS.green, CR = COLORS.brand, NO = COLORS.red;
const cA = (s) => `\\textcolor{${CA}}{${s}}`, cB = (s) => `\\textcolor{${CB}}{${s}}`, cP = (s) => `\\textcolor{${CP}}{${s}}`;
const cG = (s) => `\\textcolor{${CG}}{${s}}`, cR = (s) => `\\textcolor{${CR}}{${s}}`;
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) { el.style.opacity = 0; if (el.label) el.label.style.opacity = 0; } return el; };
const unhide = (el) => { if (el) { el.style.opacity = ''; if (el.label) el.label.style.opacity = ''; } return el; };
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
const panel = (stage, x, y, w, hh, title, cls = '') => div(stage, 'u5l6-panel ' + cls, title ? `<div class="u5l6-ph">${title}</div>` : '', x, y, w, hh);
const lineIn = (p, html, cls = '') => { const d = h('div', 'u5l6-line ' + cls, html); p.appendChild(d); hide(d); return d; };
const stampAt = (host, text, ok, x, y, o = {}) => hide(stamp(host, text, Object.assign({ ok, x, y }, o)));
const sn = (n) => `<span class="u5l6-sn">${n}</span>`;
const fx = (v, d = 2) => { const k = Math.pow(10, d); return (Math.round((v + Math.sign(v) * 1e-9) * k) / k).toFixed(d); };

/* =============================== explainer: half it, square it =============================== */
const HS = {
  a: { label: 'Example 1(a)', expr: 'x^2+12x', b: '12', half: '6', halfCalc: '12\\div2=6', sq: '36', sqCalc: '6^2=36',
    br: '(x+6)^2', brc: `(x+${cB('6')})^2`, fin: `x^2+12x+${cP('36')}=(x+6)^2` },
  b: { label: '(b)', expr: 'x^2-18x', b: '-18', half: '-9', halfCalc: '-18\\div2=-9', sq: '81', sqCalc: '(-9)^2=81',
    br: '(x-9)^2', brc: `(x${cB('-9')})^2`, fin: `x^2-18x+${cP('81')}=(x-9)^2` },
  c: { label: '(c)', expr: 'x^2+7x', b: '7', half: '\\tfrac{7}{2}', halfCalc: '7\\div2=\\tfrac{7}{2}', sq: '\\tfrac{49}{4}', sqCalc: '\\left(\\tfrac{7}{2}\\right)^2=\\tfrac{49}{4}',
    br: '\\left(x+\\tfrac{7}{2}\\right)^2', brc: `\\left(x+${cB('\\tfrac{7}{2}')}\\right)^2`, fin: `x^2+7x+${cP('\\tfrac{49}{4}')}=\\left(x+\\tfrac{7}{2}\\right)^2` },
  d: { label: '(d)', expr: 'x^2-\\tfrac{2}{3}x', b: '-\\tfrac{2}{3}', half: '-\\tfrac{1}{3}', halfCalc: '-\\tfrac{2}{3}\\div2=-\\tfrac{1}{3}', sq: '\\tfrac{1}{9}', sqCalc: '\\left(-\\tfrac{1}{3}\\right)^2=\\tfrac{1}{9}',
    br: '\\left(x-\\tfrac{1}{3}\\right)^2', brc: `\\left(x${cB('-\\tfrac{1}{3}')}\\right)^2`, fin: `x^2-\\tfrac{2}{3}x+${cP('\\tfrac{1}{9}')}=\\left(x-\\tfrac{1}{3}\\right)^2` }
};
const exprB = (d) => d.expr.replace(/(x\^2)([+-].*)(x)$/, (m, a, b) => `${a}${b.startsWith('-') ? '-' + cB(b.slice(1)) : '+' + cB(b.slice(1))}x`);
const halfsq = {
  title: 'Half it, square it',
  height: 330, minW: 960,
  choices: Object.keys(HS).map((k) => ({ v: k, label: HS[k].label })),
  ask: (v) => `What must be added to ${T(HS[v].expr)} to make a perfect square?`,
  make(stage, v, ex) {
    const d = HS[v], W = ex.W, q = '\\textcolor{#a5a9b3}{?}';
    const L = panel(stage, 8, 6, 290, 118, 'The expression');
    div(L, 'u5l6-expr', T(exprB(d)));
    const R = panel(stage, 312, 6, W - 320, 118, 'The perfect square');
    const tgt = div(R, 'u5l6-target', T(`${d.expr}+${q}=\\left(x+${q}\\right)^2`));
    const chk = hide(div(R, 'u5l6-chk', `✓ the sign inside the bracket is the sign of ${T('b')}`));
    chk.style.position = 'absolute'; chk.style.right = '16px'; chk.style.top = '10px';
    /* the conveyor */
    const BY = 290, S1 = 300, S2 = 610, SW = 170;
    div(stage, 'u5l6-belt', '', 8, BY, W - 16, 30);
    const st1 = div(stage, 'u5l6-stn', `<i>${sn(2)}HALVE</i><b>÷ 2</b>`, S1, 150, SW, 128);
    const st2 = div(stage, 'u5l6-stn', `<i>${sn(3)}SQUARE</i><b>(&nbsp;&nbsp;)²</b>`, S2, 150, SW, 128);
    const tok = (html, colr, x, w = 150) => { const t = div(stage, 'u5l6-tok', html, x, 208, w, 70); t.style.borderColor = colr; t.style.color = colr; return hide(t); };
    const t1 = tok(`<small>${sn(1)}</small>${T(`b=${d.b}`)}`, CB, 40, 210);
    const t2 = tok(`<small>half</small>${T(d.half)}`, CB, S1 + SW + 14, 120);
    const t3 = tok(`<small>add</small>${T(d.sq)}`, CP, S2 + SW + 30, 140);
    /* a copy of the token rides into the station; the token itself stays in place as a record */
    const slide = (c, el, dx) => { const k = el.cloneNode(true); stage.appendChild(k); return anim(c, k, [{ transform: 'none', opacity: 1 }, { transform: `translateX(${dx}px) scale(.5)`, opacity: 0 }], 650); };
    const out = (c, el) => anim(c, el, [{ transform: 'translateX(-60px) scale(.6)', opacity: 0 }, { transform: 'none', opacity: 1 }], 520);
    return [
      { cap: `<b>1. Take ${T('b')} with its sign</b>: in ${T(d.expr)}, ${T(`b=${d.b}`)}.`, run: (c) => pop(c, t1, 360) },
      { cap: `<b>2. Halve it</b>: ${T(d.halfCalc)}. Half of ${T('b')} goes <b>inside the bracket</b>: ${T(d.br)}.`,
        run: async (c) => {
          await slide(c, t1, S1 + 20 - 40); await pulse(c, st1, 1.06); await out(c, t2);
          tgt.innerHTML = T(`${d.expr}+${q}=${d.brc}`); await pulse(c, tgt, 1.05);
        } },
      { cap: `<b>3. Square it</b>: ${T(d.sqCalc)}. That is the number to <b>add</b>.`,
        run: async (c) => {
          await slide(c, t2, S2 + 30 - (S1 + SW + 14)); await pulse(c, st2, 1.06); await out(c, t3);
          tgt.innerHTML = T(d.fin); await pulse(c, tgt, 1.05);
        } },
      { cap: `${T(d.fin)}. Check by expanding the square. The sign inside the bracket matches the sign of ${T('b')}.`, run: (c) => show(c, chk) }
    ];
  }
};

/* =============================== explainer: the procedure, step by step =============================== */
/* rows: [TeX line, TeX side calculation (or ''), caption]; the first row of an a ≠ 1 chip is step 1 (factor a) */
const ST = {
  e2a: { label: 'Example 2(a)', eq: 'y=x^2-6x+14', a: 1, b: -6, c: 14, win: { xmin: -1, xmax: 7, ymin: -2, ymax: 16, ystep: 2, ylabels: 4 },
    vx: '(3,\\ 5)', q: '5',
    rows: [
      ['\\left(\\tfrac{-6}{2}\\right)^2=' + cP('9'), '', `<b>1. Find</b> ${T('\\left(\\tfrac{b}{2}\\right)^2')}: half of ${T('-6')} is ${T('-3')}, and ${T('(-3)^2=9')}.`],
      [`y=(x^2-6x${cP('+9')})${cP('-9')}+14`, '+9-9=0', `<b>2. Add and subtract ${T('9')}</b> right after the ${T('x')}-term. ${T('+9-9=0')}, so the equation stays equal.`],
      ['y=(x-3)^2+5', '-9+14=5', `<b>3. Write the first three terms as a square</b>, ${T('x^2-6x+9=(x-3)^2')}, and combine the constants: ${T('-9+14=5')}.`]] },
  e2c: { label: '(c)', eq: 'y=x^2+5x+3', a: 1, b: 5, c: 3, win: { xmin: -7, xmax: 2, ymin: -5, ymax: 8, ylabels: 2 },
    vx: '\\left(-\\tfrac{5}{2},\\ -\\tfrac{13}{4}\\right)', q: '-\\tfrac{13}{4}',
    rows: [
      ['\\left(\\tfrac{5}{2}\\right)^2=' + cP('\\tfrac{25}{4}'), '', `<b>1. Find</b> ${T('\\left(\\tfrac{b}{2}\\right)^2')}: half of ${T('5')} is ${T('\\tfrac{5}{2}')}, and ${T('\\left(\\tfrac{5}{2}\\right)^2=\\tfrac{25}{4}')}. Fractions are fine.`],
      [`y=\\left(x^2+5x${cP('+\\tfrac{25}{4}')}\\right)${cP('-\\tfrac{25}{4}')}+\\tfrac{12}{4}`, '3=\\tfrac{12}{4}', `<b>2. Add and subtract ${T('\\tfrac{25}{4}')}</b>. Write ${T('3')} as ${T('\\tfrac{12}{4}')} so the constants have a common denominator.`],
      ['y=\\left(x+\\tfrac{5}{2}\\right)^2-\\tfrac{13}{4}', '-\\tfrac{25}{4}+\\tfrac{12}{4}=-\\tfrac{13}{4}', `<b>3. Write the first three terms as a square</b>, ${T('\\left(x+\\tfrac{5}{2}\\right)^2')}, and combine: ${T('-\\tfrac{25}{4}+\\tfrac{12}{4}=-\\tfrac{13}{4}')}.`]] },
  e4a: { label: 'Example 4(a)', eq: 'y=2x^2+12x+7', a: 2, b: 12, c: 7, win: { xmin: -7, xmax: 1, ymin: -14, ymax: 10, ystep: 2, ylabels: 4 },
    vx: '(-3,\\ -11)', q: '-11',
    rows: [
      [`y=${cA('2')}(x^2+6x)+7`, '12x\\div2=6x', `<b>1. Factor ${T('a=2')} from the first two terms only</b>: ${T('12x\\div2=6x')}. The constant ${T('7')} stays outside.`],
      [`y=2(x^2+6x${cP('+9-9')})+7`, '\\left(\\tfrac{6}{2}\\right)^2=9', `<b>2. Inside the brackets</b>, add and subtract the square of half the new ${T('x')}-coefficient: ${T('\\left(\\tfrac{6}{2}\\right)^2=9')}.`],
      [`y=2(x+3)^2${cG('-18')}+7`, `${cA('2')}\\times(${cP('-9')})=${cG('-18')}`, `<b>3. Move ${T('-9')} out of the brackets: multiply it by ${T('a')}</b>, ${T('2\\times(-9)=-18')}. What stays inside, ${T('x^2+6x+9')}, is ${T('(x+3)^2')}.`],
      ['y=2(x+3)^2-11', '-18+7=-11', `<b>4. Combine the constants</b>: ${T('-18+7=-11')}.`]] },
  e4c: { label: '(c)', eq: 'y=3x^2+9x-2', a: 3, b: 9, c: -2, win: { xmin: -5, xmax: 2, ymin: -10, ymax: 8, ystep: 2, ylabels: 4 },
    vx: '\\left(-\\tfrac{3}{2},\\ -\\tfrac{35}{4}\\right)', q: '-\\tfrac{35}{4}',
    rows: [
      [`y=${cA('3')}(x^2+3x)-2`, '9x\\div3=3x', `<b>1. Factor ${T('a=3')} from the first two terms only</b>: ${T('9x\\div3=3x')}. The ${T('-2')} stays outside.`],
      [`y=3\\left(x^2+3x${cP('+\\tfrac{9}{4}-\\tfrac{9}{4}')}\\right)-2`, '\\left(\\tfrac{3}{2}\\right)^2=\\tfrac{9}{4}', `<b>2. Inside the brackets</b>, add and subtract ${T('\\left(\\tfrac{3}{2}\\right)^2=\\tfrac{9}{4}')}.`],
      [`y=3\\left(x+\\tfrac{3}{2}\\right)^2${cG('-\\tfrac{27}{4}')}-\\tfrac{8}{4}`, `${cA('3')}\\times\\left(${cP('-\\tfrac{9}{4}')}\\right)=${cG('-\\tfrac{27}{4}')}`, `<b>3. Move ${T('-\\tfrac{9}{4}')} out: multiply it by ${T('a=3')}</b>, ${T('-\\tfrac{27}{4}')}. Write ${T('-2')} as ${T('-\\tfrac{8}{4}')}.`],
      ['y=3\\left(x+\\tfrac{3}{2}\\right)^2-\\tfrac{35}{4}', '-\\tfrac{27}{4}-\\tfrac{8}{4}=-\\tfrac{35}{4}', `<b>4. Combine the constants</b>: ${T('-\\tfrac{27}{4}-\\tfrac{8}{4}=-\\tfrac{35}{4}')}.`]] },
  e5b: { label: 'Example 5(b)', eq: 'y=5-12x-3x^2', a: -3, b: -12, c: 5, win: { xmin: -6, xmax: 2, ymin: -4, ymax: 20, ystep: 2, ylabels: 4 },
    vx: '(-2,\\ 17)', q: '17',
    rows: [
      [`y=-3x^2-12x+5=${cA('-3')}(x^2+4x)+5`, '-12x\\div(-3)=+4x', `<b>1.</b> Put the terms in order first. Then <b>factor ${T('a=-3')}</b> from the first two terms: ${T('-12x\\div(-3)=+4x')}.`],
      [`y=-3(x^2+4x${cP('+4-4')})+5`, '\\left(\\tfrac{4}{2}\\right)^2=4', `<b>2. Inside the brackets</b>, add and subtract ${T('\\left(\\tfrac{4}{2}\\right)^2=4')}.`],
      [`y=-3(x+2)^2${cG('+12')}+5`, `(${cA('-3')})\\times(${cP('-4')})=${cG('+12')}`, `<b>3. Move ${T('-4')} out: multiply it by ${T('a=-3')}</b>. Negative times negative: ${T('(-3)(-4)=+12')}.`],
      ['y=-3(x+2)^2+17', '12+5=17', `<b>4. Combine the constants</b>: ${T('12+5=17')}.`]] },
  e5c: { label: '(c)', eq: 'y=\\tfrac{1}{2}x^2-3x+1', a: 0.5, b: -3, c: 1, win: { xmin: -2, xmax: 8, ymin: -5, ymax: 8, ylabels: 2 },
    vx: '\\left(3,\\ -\\tfrac{7}{2}\\right)', q: '-\\tfrac{7}{2}',
    rows: [
      [`y=${cA('\\tfrac{1}{2}')}(x^2-6x)+1`, '-3x\\div\\tfrac{1}{2}=-3x\\times2=-6x', `<b>1. Factor ${T('a=\\tfrac{1}{2}')}</b> from the first two terms. Dividing by ${T('\\tfrac{1}{2}')} is multiplying by ${T('2')}: ${T('-3x\\div\\tfrac{1}{2}=-6x')}.`],
      [`y=\\tfrac{1}{2}(x^2-6x${cP('+9-9')})+1`, '\\left(\\tfrac{-6}{2}\\right)^2=9', `<b>2. Inside the brackets</b>, add and subtract ${T('\\left(\\tfrac{-6}{2}\\right)^2=9')}.`],
      [`y=\\tfrac{1}{2}(x-3)^2${cG('-\\tfrac{9}{2}')}+1`, `${cA('\\tfrac{1}{2}')}\\times(${cP('-9')})=${cG('-\\tfrac{9}{2}')}`, `<b>3. Move ${T('-9')} out: multiply it by ${T('a=\\tfrac{1}{2}')}</b>, ${T('-\\tfrac{9}{2}')}.`],
      ['y=\\tfrac{1}{2}(x-3)^2-\\tfrac{7}{2}', '-\\tfrac{9}{2}+\\tfrac{2}{2}=-\\tfrac{7}{2}', `<b>4. Combine the constants</b>: ${T('-\\tfrac{9}{2}+1=-\\tfrac{7}{2}')}.`]] },
  e5d: { label: '(d)', eq: 'y=-\\tfrac{1}{3}x^2+2x+4', a: -1 / 3, b: 2, c: 4, win: { xmin: -3, xmax: 9, ymin: -4, ymax: 9, ylabels: 2 },
    vx: '(3,\\ 7)', q: '7',
    rows: [
      [`y=${cA('-\\tfrac{1}{3}')}(x^2-6x)+4`, '2x\\div\\left(-\\tfrac{1}{3}\\right)=2x\\times(-3)=-6x', `<b>1. Factor ${T('a=-\\tfrac{1}{3}')}</b> from the first two terms: ${T('2x\\div\\left(-\\tfrac{1}{3}\\right)=2x\\times(-3)=-6x')}.`],
      [`y=-\\tfrac{1}{3}(x^2-6x${cP('+9-9')})+4`, '\\left(\\tfrac{-6}{2}\\right)^2=9', `<b>2. Inside the brackets</b>, add and subtract ${T('\\left(\\tfrac{-6}{2}\\right)^2=9')}.`],
      [`y=-\\tfrac{1}{3}(x-3)^2${cG('+3')}+4`, `\\left(${cA('-\\tfrac{1}{3}')}\\right)\\times(${cP('-9')})=${cG('+3')}`, `<b>3. Move ${T('-9')} out: multiply it by ${T('a=-\\tfrac{1}{3}')}</b>: ${T('\\left(-\\tfrac{1}{3}\\right)(-9)=+3')}.`],
      ['y=-\\tfrac{1}{3}(x-3)^2+7', '3+4=7', `<b>4. Combine the constants</b>: ${T('3+4=7')}.`]] }
};
const steps = {
  title: 'Completing the square, step by step',
  height: 440, minW: 960, capH: 84,
  choices: [{ sep: T('a=1') + ':' }, { v: 'e2a', label: ST.e2a.label }, { v: 'e2c', label: ST.e2c.label },
    { sep: T('a\\ne1') + ':' }, { v: 'e4a', label: ST.e4a.label }, { v: 'e4c', label: ST.e4c.label },
    { sep: 'negative or fraction:' }, { v: 'e5b', label: ST.e5b.label }, { v: 'e5c', label: ST.e5c.label }, { v: 'e5d', label: ST.e5d.label }],
  ask: (v) => `Write ${T(ST[v].eq)} in vertex form.`,
  make(stage, v, ex) {
    const d = ST[v], W = ex.W, H = 440, PW = 596, GX = PW + 16, GW = W - GX - 6;
    const f = (x) => d.a * x * x + d.b * x + d.c, p = -d.b / (2 * d.a), qv = f(p);
    const P = panel(stage, 6, 6, PW, H - 12, d.a === 1 ? 'Three steps (a = 1)' : 'Four steps (a ≠ 1)');
    const r0 = div(P, 'u5l6-wrow', `<span></span><span class="u5l6-wt u5l6-w0">${T(d.eq)}</span>`, null, null); r0.style.top = '40px';
    const RH = d.rows.length === 3 ? 96 : 72;
    const rows = d.rows.map(([t, note], i) => {
      const r = div(P, 'u5l6-wrow', `${sn(i + 1)}<span class="u5l6-wt">${T(t)}</span>${note ? `<span class="u5l6-wn u5l6-note">${T(note)}</span>` : ''}`);
      r.style.top = (92 + i * RH) + 'px'; return hide(r);
    });
    const G = new Graph(stage, Object.assign({ x: GX, y: 4, width: GW, height: H - 8, xlabels: 1, fontSize: 15, pad: [30, 18, 18, 18] }, d.win));
    G.fn(f, { color: CA });
    const vf = hide(G.fn(f, { color: CR, dash: true, width: 5 }));
    const vtx = hide(G.point(p, qv, { color: CR, r: 7 }));
    const vb = div(P, 'u5l6-wrow', `<span></span><span class="u5l6-vb">vertex ${T(d.vx)} &nbsp;·&nbsp; ${d.a > 0 ? 'opens up, minimum' : 'opens down, maximum'} ${T(d.q)}</span>`);
    vb.style.top = '382px'; hide(vb);
    const out = d.rows.map((r, i) => ({ cap: r[2], run: async (c) => { await show(c, rows[i]); if (i === d.rows.length - 1) await pulse(c, rows[i], 1.03); } }));
    const last = d.rows[d.rows.length - 1][0];
    out.push({ cap: `<b>Vertex form</b>, ${T(last)}: the vertex is ${T(d.vx)}. ${d.a > 0 ? `${T('a>0')}, so it opens up: <b>minimum</b>` : `${T('a<0')}, so it opens down: <b>maximum</b>`} ${T(d.q)}. Its graph lies exactly on the original: same function.`,
      run: async (c) => { unhide(vf); await G.drawIn(vf, 1100, c); unhide(vtx); await pop(c, vtx); await pulse(c, vtx, 1.6); await show(c, vb); } });
    return out;
  }
};

/* =============================== explainer: using the vertex form =============================== */
const hB = (t) => -5 * t * t + 20 * t + 1, TL = 2 + Math.sqrt(21 / 5);
const useit = {
  title: 'Using the vertex form',
  height: 436, minW: 960, capH: 84,
  choices: [{ v: 'zeros', label: 'Example 6(a): the zeros' }, { v: 'ball', label: '(b): the ball' }],
  ask: (v) => (v === 'zeros' ? `Find the minimum value and the zeros of ${T('f(x)=2x^2-8x-3')}.` : `A ball's height is ${T('h=-5t^2+20t+1')} metres. Find the greatest height and when it occurs.`),
  make(stage, v, ex) { return v === 'zeros' ? zeroSteps(stage, ex) : ballSteps(stage, ex); }
};
function zeroSteps(stage, ex) {
  const W = ex.W, H = 436, GW = 500, f = (x) => 2 * (x - 2) * (x - 2) - 11, r = Math.sqrt(5.5);
  const G = new Graph(stage, { x: 6, y: 4, width: GW, height: H - 8, xmin: -2, xmax: 6, ymin: -12, ymax: 6, ystep: 2, xlabels: 1, ylabels: 2, fontSize: 15, pad: [30, 18, 18, 18] });
  const cur = hide(G.fn(f, { color: CA }));
  const vx = hide(G.point(2, -11, { color: CR, label: T('(2,\\ -11)'), pos: 'e' }));
  const axis = hide(G.vline(2, { color: 'slate' }));
  const arL = hide(G.segment([2, 0], [2 - r, 0], { color: CP, width: 5, ends: [null, 'arrow'] }));
  const arR = hide(G.segment([2, 0], [2 + r, 0], { color: CP, width: 5, ends: [null, 'arrow'] }));
  const rl = hide(G.label(2 + r / 2, 0.9, `\\pm${fx(r, 2)}`, { tex: true, cls: 'bk-ptlab', pos: 'n', color: CP }));
  const z1 = hide(G.point(2 - r, 0, { color: CR, label: T('-0.35'), pos: 'sw' })), z2 = hide(G.point(2 + r, 0, { color: CR, label: T('4.35'), pos: 'se' }));
  const P = div(stage, 'u5l6-panel', '<div class="u5l6-ph">Vertex form, then the zeros</div>', GW + 22, 6, W - GW - 28, H - 12);
  lineIn(P, T('f(x)=2x^2-8x-3'), 'u5l6-big').style.opacity = 1;
  const l = [
    lineIn(P, `${T('f(x)=2(x-2)^2-11')} <span class="u5l6-note">minimum ${T('-11')}</span>`, 'u5l6-big'),
    lineIn(P, T('0=2(x-2)^2-11')), lineIn(P, T('2(x-2)^2=11\\ \\Rightarrow\\ (x-2)^2=\\tfrac{11}{2}')),
    lineIn(P, T(`x-2=\\pm\\sqrt{\\tfrac{11}{2}}\\approx\\pm${fx(r, 2)}`)),
    lineIn(P, T('x=2\\pm\\sqrt{\\tfrac{11}{2}}=2\\pm\\tfrac{\\sqrt{22}}{2}'), 'u5l6-strong'),
    lineIn(P, T('x\\approx4.35\\ \\text{and}\\ x\\approx-0.35'), 'u5l6-strong')];
  return [
    { cap: `Complete the square: ${T('f(x)=2(x^2-4x+4-4)-3=2(x-2)^2-11')}. It opens up, so the vertex ${T('(2,\\ -11)')} gives the <b>minimum value</b> ${T('-11')}.`,
      run: async (c) => { await show(c, l[0]); unhide(cur); await G.drawIn(cur, 900, c); unhide(vx); await pop(c, vx); } },
    { cap: `<b>Zeros:</b> set ${T('f(x)=0')} and isolate the square: ${T('2(x-2)^2=11')}, so ${T('(x-2)^2=\\tfrac{11}{2}')}.`,
      run: async (c) => { await show(c, l[1]); await show(c, l[2]); unhide(axis); await G.drawIn(axis, 500, c); } },
    { cap: `Take ${T('\\pm')} the square root: ${T(`x-2=\\pm\\sqrt{\\tfrac{11}{2}}\\approx\\pm${fx(r, 2)}`)}. From the axis ${T('x=2')}, reach ${T(fx(r, 2))} <b>both ways</b>.`,
      run: async (c) => { await show(c, l[3]); unhide(arL); unhide(arR); await Promise.all([G.drawIn(arL, 700, c), G.drawIn(arR, 700, c)]); await show(c, rl); } },
    { cap: `${T('x=2\\pm\\tfrac{\\sqrt{22}}{2}')} (since ${T('\\sqrt{\\tfrac{11}{2}}=\\tfrac{\\sqrt{22}}{2}')}): the zeros are ${T('x\\approx4.35')} and ${T('x\\approx-0.35')}, the ${T('x')}-intercepts.`,
      run: async (c) => { await show(c, l[4]); unhide(z1); unhide(z2); await Promise.all([pop(c, z1), pop(c, z2)]); await show(c, l[5]); } }
  ];
}
function ballSteps(stage, ex) {
  const W = ex.W, H = 436, SW = 150, PW = 320, GX = SW + 14, GW = W - GX - PW - 16;
  const sc = div(stage, 'u5l6-sky', '', 6, 6, SW, H - 12);
  const gy = H - 12 - 40, ppm = (gy - 34) / 23, yOf = (m) => gy - m * ppm;
  for (let m = 4; m <= 22; m += 4) div(sc, 'u5l6-tick', `${m} m`, 6, yOf(m) - 9);
  div(sc, 'u5l6-ground', '', 0, gy, SW, 40);
  div(sc, 'u5l6-thrower', '🧍', 58, gy - 46);
  const ball = div(sc, 'u5l6-bball', '', 92, yOf(1) - 11, 22, 22);
  const clock = div(stage, 'u5l6-clock', T('t=0.00\\text{ s}'), 26, 14, 112, 34);
  const G = new Graph(stage, { x: GX, y: 4, width: GW, height: H - 8, xmin: -0.3, xmax: 4.4, ymin: -1, ymax: 24, xstep: 0.5, ystep: 2, xlabels: 1, ylabels: 4, xtitle: 't', ytitle: 'h', fontSize: 15, pad: [30, 18, 18, 18] });
  const o = { from: 0, to: 0.0001, color: CA }, cur = G.fn(hB, o);
  const dot = G.point(0, 1, { color: CA });
  const vx = hide(G.point(2, 21, { color: CR, label: T('(2,\\ 21)'), pos: 'ne' }));
  const P = div(stage, 'u5l6-panel', '<div class="u5l6-ph">Complete the square</div>', W - PW - 6, 6, PW, H - 12);
  lineIn(P, T('h=-5t^2+20t+1')).style.opacity = 1;
  const l = [lineIn(P, T(`h=${cA('-5')}(t^2-4t)+1`)), lineIn(P, T(`h=-5(t^2-4t${cP('+4-4')})+1`)), lineIn(P, T(`h=-5(t-2)^2${cG('+20')}+1`)),
    lineIn(P, T('h=-5(t-2)^2+21'), 'u5l6-strong'), lineIn(P, `Vertex ${T('(2,\\ 21)')}: <b>21 m</b> at <b>2 s</b>`, 'u5l6-strong')];
  const st = stampAt(stage, 'highest point', true, GX + GW / 2 + 10, 330, { rotate: -4 });
  const setT = (t) => { o.to = Math.max(0.0001, t); cur._bkDraw(); G.moveTo(dot, t, hB(t)); ball.style.top = (yOf(Math.max(0, hB(t))) - 11) + 'px'; clock.innerHTML = T(`t=${t.toFixed(2)}\\text{ s}`); };
  return [
    { cap: `Complete the square with ${T('a=-5')}: factor ${T('-5')} from the first two terms, add and subtract ${T('4')}, and move ${T('-4')} out: ${T('(-5)(-4)=+20')}.`,
      run: async (c) => { for (const k of l.slice(0, 4)) await show(c, k); } },
    { cap: `${T('h=-5(t-2)^2+21')}: the vertex is ${T('(2,\\ 21)')}. ${T('a<0')}, so the parabola opens down and the vertex is the <b>highest point</b>.`,
      run: async (c) => { unhide(vx); await pop(c, vx); await show(c, l[4]); } },
    { cap: 'Throw! The graph records the height at every moment. The ball climbs until <b>2 s</b>, when it is <b>21 m</b> up.',
      run: async (c) => { await tween(c, 2200, (t) => setT(2 * t)); await stampIn(c, st); } },
    { cap: 'Then it falls back down. The greatest height is <b>21 m</b>, <b>2 s</b> after the throw.', run: (c) => tween(c, 2000, (t) => setT(2 + (TL - 2) * t), linear) }
  ];
}

/* =============================== explainer: spot the error (verdict stamps) =============================== */
/* rows: [student TeX, correct TeX, status ('ok' | 'err' | 'carry'), tag, caption] */
const VD = {
  ex7: { label: 'Example 7(b)', eq: 'y=-2x^2+12x-5', verdict: 'FORGOT TO MULTIPLY',
    rows: [
      ['y=-2(x^2-6x)-5', 'y=-2(x^2-6x)-5', 'ok', '', `<b>Step 1: correct.</b> ${T('12x\\div(-2)=-6x')}, and the ${T('-5')} stays outside.`],
      ['y=-2(x^2-6x+9-9)-5', 'y=-2(x^2-6x+9-9)-5', 'ok', '', `<b>Step 2: correct.</b> ${T('\\left(\\tfrac{-6}{2}\\right)^2=9')} is added and subtracted inside the brackets.`],
      ['y=-2(x-3)^2-9-5', 'y=-2(x-3)^2+18-5', 'err', '(−2)(−9) = +18', `<b>Step 3: error.</b> The ${T('-9')} left the brackets without being multiplied by ${T('a=-2')}: ${T('(-2)(-9)=+18')}.`],
      ['y=-2(x-3)^2-14', 'y=-2(x-3)^2+13', 'carry', 'from Step 3', `<b>Step 4</b> carries the error: ${T('18-5=13')}, not ${T('-14')}.`]],
    final: 'y=-2(x-3)^2+13', vcap: 'The number moved out of the brackets must be <b>multiplied by a</b>. The correct vertex form: ' },
  xterm: { label: 'a not out of bx', eq: 'y=3x^2+6x+5', verdict: 'x-TERM NOT DIVIDED',
    rows: [
      ['y=3(x^2+6x)+5', 'y=3(x^2+2x)+5', 'err', '6x ÷ 3 = 2x', `<b>Step 1: error.</b> ${T('3')} was factored out of the ${T('x^2')}-term but not out of the ${T('x')}-term: ${T('6x\\div3=2x')}.`],
      ['y=3(x^2+6x+9-9)+5', 'y=3(x^2+2x+1-1)+5', 'carry', 'from Step 1', `<b>Step 2</b> is done right for the wrong brackets: ${T('\\left(\\tfrac{2}{2}\\right)^2=1')}, not ${T('9')}.`],
      ['y=3(x+3)^2-27+5', 'y=3(x+1)^2-3+5', 'carry', 'from Step 1', `<b>Step 3:</b> the ${T('-9')} was multiplied by ${T('3')} correctly, but the error from Step 1 is still there.`],
      ['y=3(x+3)^2-22', 'y=3(x+1)^2+2', 'carry', 'check: expand!', `<b>Step 4:</b> a check catches it: ${T('3(x+3)^2-22=3x^2+18x+5')}, not the original ${T('3x^2+6x+5')}.`]],
    final: 'y=3(x+1)^2+2', vcap: 'Factor <b>a</b> out of <b>both</b> the ' + T('x^2') + '-term and the ' + T('x') + '-term. The correct vertex form: ' },
  neg: { label: 'Negative a', eq: 'y=-2x^2-8x+1', verdict: 'SIGN ERROR',
    rows: [
      ['y=-2(x^2-4x)+1', 'y=-2(x^2+4x)+1', 'err', '−8x ÷ (−2) = +4x', `<b>Step 1: error.</b> Dividing by a negative changes the sign: ${T('-8x\\div(-2)=+4x')}. Check: ${T('-2(-4x)=+8x')}, not ${T('-8x')}.`],
      ['y=-2(x^2-4x+4-4)+1', 'y=-2(x^2+4x+4-4)+1', 'carry', 'from Step 1', `<b>Step 2</b> carries the sign error. (${T('4')} is right: ${T('(\\pm2)^2=4')} either way.)`],
      ['y=-2(x-2)^2+8+1', 'y=-2(x+2)^2+8+1', 'carry', 'from Step 1', `<b>Step 3:</b> ${T('(-2)(-4)=+8')} is right, but the bracket has the wrong sign.`],
      ['y=-2(x-2)^2+9', 'y=-2(x+2)^2+9', 'carry', 'vertex (2, 9)?', `<b>Step 4:</b> the student's vertex is ${T('(2,\\ 9)')}; the real vertex is ${T('(-2,\\ 9)')}.`]],
    final: 'y=-2(x+2)^2+9', vcap: 'A <b>sign error</b> with a negative ' + T('a') + ' moves the vertex to the wrong side. The correct vertex form: ' },
  inside: { label: 'Sign inside the bracket', eq: 'y=x^2-10x+4', verdict: 'WRONG SIGN INSIDE',
    rows: [
      ['\\left(\\tfrac{-10}{2}\\right)^2=25', '\\left(\\tfrac{-10}{2}\\right)^2=25', 'ok', '', `<b>Step 1: correct.</b> Half of ${T('-10')} is ${T('-5')}, and ${T('(-5)^2=25')}.`],
      ['y=(x^2-10x+25)-25+4', 'y=(x^2-10x+25)-25+4', 'ok', '', '<b>Step 2: correct.</b> Added and subtracted right after the ' + T('x') + '-term.'],
      ['y=(x+5)^2-21', 'y=(x-5)^2-21', 'err', 'b = −10 → (x − 5)²', `<b>Step 3: error.</b> ${T('x^2-10x+25=(x-5)^2')}: the sign inside the bracket matches the sign of ${T('b')}. (${T('(x+5)^2')} expands to ${T('x^2+10x+25')}.)`]],
    final: 'y=(x-5)^2-21', vcap: 'The sign inside matches the sign of ' + T('b') + '. The correct vertex form: ' }
};
const verdict = {
  title: 'Spot the error',
  height: 436, minW: 960, capH: 84,
  choices: [{ v: 'ex7', label: 'Example 7(b)' }, { sep: 'Other common errors:' }, ...['xterm', 'neg', 'inside'].map((k) => ({ v: k, label: VD[k].label }))],
  ask: (v) => `A student wrote ${T(VD[v].eq)} in vertex form. Check each step against the correct work.`,
  make(stage, v, ex) {
    const d = VD[v], W = ex.W, PW = (W - 28) / 2, y0 = 52, RH = 78;
    div(stage, 'u5l6-paper u5l6-stu', '<div class="u5l6-ph">The student’s work</div>', 8, 6, PW, 424);
    div(stage, 'u5l6-paper u5l6-cor', '<div class="u5l6-ph">The correct work</div>', 20 + PW, 6, PW, 424);
    const scan = hide(div(stage, 'u5l6-scan', '', 4, y0, W - 8, RH - 6));
    const rows = d.rows.map(([s, c2, st, tag], i) => {
      const y = y0 + i * RH;
      const a = div(stage, 'u5l6-vrow', `<span class="u5l6-vn">${i + 1}</span>${T(s)}`, 16, y, PW - 64, RH - 8);
      const b = hide(div(stage, 'u5l6-vrow u5l6-vgood', `<span class="u5l6-vn">${i + 1}</span>${T(c2)}`, 28 + PW, y, PW - 24, RH - 8));
      const mk = hide(div(stage, 'u5l6-vmk u5l6-vmk-' + st, st === 'ok' ? '✓' : st === 'err' ? '✗' : '≈', PW - 42, y + 12, 40, 40));
      const tg = st === 'ok' ? null : hide(div(stage, 'u5l6-vtag u5l6-vtag-' + st, tag, 0, y + RH - 26));
      if (tg) { tg.style.right = (W - PW + 2) + 'px'; tg.style.left = 'auto'; }
      return { a, b, mk, tg, st };
    });
    const fy = y0 + d.rows.length * RH + 6;
    const fin = hide(div(stage, 'u5l6-vfin', `${T(d.final)}`, 28 + PW, fy, PW - 24, 60));
    const vst = stampAt(stage, d.verdict, false, 8 + PW / 2, 394, { rotate: -2 });
    const out = d.rows.map((r, i) => ({ cap: r[4], run: async (c) => {
      const o = rows[i];
      scan.style.opacity = 1; await anim(c, scan, [{ top: scan.style.top }, { top: (y0 + i * RH - 4) + 'px' }], 420);
      await show(c, o.b);
      if (o.st === 'err') { o.a.classList.add('u5l6-vbad'); await shake(c, o.a); } else if (o.st === 'carry') o.a.classList.add('u5l6-vcarry');
      await pop(c, o.mk, 300); if (o.tg) await pop(c, o.tg, 300);
    } }));
    out.push({ cap: d.vcap + T(d.final) + '.', run: async (c) => { scan.style.opacity = 0; await stampIn(c, vst); await pop(c, fin, 420); } });
    return out;
  }
};

/* =============================== Stand Up Break (exact fractions) =============================== */
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const F = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); return { n: n / g, d: d / g }; };
const fmul = (x, y) => F(x.n * y.n, x.d * y.d), fadd = (x, y) => F(x.n * y.d + y.n * x.d, x.d * y.d), fneg = (x) => F(-x.n, x.d);
const ftex = (x) => (x.d === 1 ? `${x.n}` : `${x.n < 0 ? '-' : ''}\\tfrac{${Math.abs(x.n)}}{${x.d}}`);
const sgn = (x) => (x.n < 0 ? `-${ftex(fneg(x))}` : `+${ftex(x)}`);           // "+3", "-\tfrac{9}{4}"
const coefX = (x, v) => (x.n === x.d ? v : x.n === -x.d ? '-' + v : ftex(x) + v);
const termX = (x, v) => (x.n === 0 ? '' : x.n === x.d ? '+' + v : x.n === -x.d ? '-' + v : sgn(x) + v);
const big = (s) => (/frac/.test(s) ? `\\left(${s}\\right)` : `(${s})`);
/** the booklet's lines for y = ax² + bx + c (a, b, c fractions) */
function ctsLines(a, b, c) {
  const one = a.n === 1 && a.d === 1, B = fmul(b, F(a.d, a.n)), half = fmul(B, F(1, 2)), sq = fmul(half, half);
  const A = one ? '' : (a.n === -a.d ? '-' : ftex(a)), cT = c.n ? sgn(c) : '';
  const inner = `x^2${termX(B, 'x')}`, br = `${big(`x${sgn(half)}`)}^2`;
  const moved = fmul(fneg(sq), a), q = fadd(moved, c);
  const vx = `\\text{vertex }\\left(${ftex(fneg(half))},\\ ${ftex(q)}\\right)`;
  if (one) return [`\\left(\\tfrac{${ftex(B)}}{2}\\right)^2=${ftex(sq)}`, `y=${big(`${inner}${sgn(sq)}`)}${sgn(fneg(sq))}${cT}`, `y=${br}${q.n ? sgn(q) : ''}`, vx];
  return [`y=${A}${big(inner)}${cT}`, `y=${A}${big(`${inner}${sgn(sq)}${sgn(fneg(sq))}`)}${cT}`, `y=${A}${br}${sgn(moved)}${cT}`, `y=${A}${br}${q.n ? sgn(q) : ''}`, vx];
}
const genQ = (a, b, c) => `y=${coefX(a, 'x^2')}${termX(b, 'x')}${c.n ? sgn(c) : ''}`;
standup('u5l6', {
  intro: 'At your whiteboard: write the function in vertex form and state the vertex.',
  levels: {
    BEG: (r) => { // a = 1, b even
      const b = F(r.pick([-12, -10, -8, -6, -4, -2, 2, 4, 6, 8, 10, 12])), c = F(r.int(-15, 15) || 3);
      return { text: 'Complete the square. Write in vertex form and state the vertex.', q: genQ(F(1), b, c), a: ctsLines(F(1), b, c) };
    },
    PRG: (r) => { // a = 2…5, b/a even; or a = 1 with b odd
      if (r.chance(0.3)) { const b = F(r.pick([-7, -5, -3, -1, 1, 3, 5, 7])), c = F(r.int(-6, 6) || 2); return { text: 'Complete the square. Write in vertex form and state the vertex.', q: genQ(F(1), b, c), a: ctsLines(F(1), b, c) }; }
      const a = r.pick([2, 3, 4, 5]), m = r.pick([-8, -6, -4, -2, 2, 4, 6, 8]), c = F(r.int(-12, 12) || 1);
      return { text: 'Complete the square. Write in vertex form and state the vertex.', q: genQ(F(a), F(a * m), c), a: ctsLines(F(a), F(a * m), c) };
    },
    MAS: (r) => { // negative a, a fraction, or the terms out of order
      const kind = r.int(0, 2);
      if (kind === 0) { const a = r.pick([-1, -2, -3, -4]), m = r.pick([-6, -4, -2, 2, 4, 6]), c = F(r.int(-9, 9) || 2); return { text: 'Complete the square. Write in vertex form, state the vertex and the maximum value.', q: genQ(F(a), F(a * m), c), a: ctsLines(F(a), F(a * m), c) }; }
      if (kind === 1) { // a = ±1/d and b = 2k: the new x-coefficient b ÷ a = ±2kd is even, so every number stays an integer
        const a = F(r.pick([1, -1]), r.pick([2, 3])), b = F(r.pick([-4, -2, 2, 4])), c = F(r.int(-6, 6) || 1);
        return { text: 'Complete the square. Write in vertex form and state the vertex.', q: genQ(a, b, c), a: ctsLines(a, b, c) };
      }
      const a = r.pick([-2, -3]), m = r.pick([-4, -2, 2, 4]), c = r.int(2, 9);
      const lines = ctsLines(F(a), F(a * m), F(c));
      return { text: 'Complete the square. Write in vertex form and state the vertex.', q: `y=${c}${termX(F(a * m), 'x')}${a}x^2`, a: [`y=${a}x^2${termX(F(a * m), 'x')}+${c}`, ...lines.slice(0)] };
    }
  }
});

/* =============================== mount =============================== */
export const explainers = mountExplainers({ halfsq, steps, useit, verdict });
export const _test = { HS, ST, VD, ctsLines, genQ, F };
