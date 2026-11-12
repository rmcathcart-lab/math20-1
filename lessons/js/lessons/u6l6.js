/* Math 20-1 · Unit 6 · Lesson 6 — Adding and Subtracting with Binomial and Trinomial Denominators.
 * New format (2026-11-11): the warm-up is plain markup on the page (no code). Explainers:
 *   lcd (the procedure, numbered steps: NPVs, LCD = the product, each numerator gets its missing factor, expand,
 *     collect, factor the numerator; Example 1(a)–(c)),
 *   minus (STAR: "the minus sign meets the bracket": two panels; without the bracket the minus only reaches the first
 *     term, with it the minus walks through every term and flips each sign; a substitution check at x = 1 stamps the
 *     wrong one; Example 2(a), 2(c), 1(b)),
 *   build (STAR: factor tiles drop into an LCD tray, a shared factor merges so it is used once, the missing factors
 *     appear, and a numerator that factors gets a NOT FINISHED stamp before it cancels; Examples 3(c), 4(a), 5(a), 5(b)),
 *   opposite (a table shows x − 5 and 5 − x are opposites, the factor flips to −(x − 5) and its negative sign hops to the
 *     front, turning + into −; Example 6(a)–(c)),
 *   table (a TI-84-style Y= / TBLSET / TABLE: Y1 = question, Y2 = answer, matching columns, ERROR rows at the NPVs; a
 *     forgot-the-bracket answer that fails; Example 4(a), where the simplified answer hides an NPV),
 *   boat (Example 7: the boat goes up the river and back for c = 0, 4, 8, 11 while the points land on
 *     T = 864/((12 − c)(12 + c)); c = 12 is the NPV where the boat never gets up the river).
 * Colours: denominators / LCD factors blue, the missing factor amber, the minus sign and sign changes red, cancelling
 *   factors and NPVs purple, checks green. */
import {
  h, tex, add, box, Graph, ValueTable, stamp, stampIn, mountExplainers, pop, fadeIn, sleep, tween, svgEl, pulse, shake,
  anim, linear, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const BL = COLORS.blue, AM = COLORS.amber, RD = COLORS.red, OK = COLORS.green, PU = COLORS.purple;
const cB = (s) => `\\textcolor{${BL}}{${s}}`, cA = (s) => `\\textcolor{${AM}}{${s}}`, cR = (s) => `\\textcolor{${RD}}{${s}}`;
const cP = (s) => `\\textcolor{${PU}}{${s}}`, cG = (s) => `\\textcolor{${OK}}{${s}}`;
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
const stampAt = (host, text, ok, x, y, o = {}) => hide(stamp(host, text, Object.assign({ ok, x, y }, o)));
/* a fraction made of boxes, so its numerator / denominator can change or move */
const frac = (n, d, cls = '') => { const f = h('div', 'u6l6-fr ' + cls); f.n = h('div', 'u6l6-fn', T(n)); f.d = h('div', 'u6l6-fd', T(d)); f.append(f.n, f.d); return f; };
const opEl = (s, cls = '') => h('div', 'u6l6-op ' + cls, s === '-' ? '−' : s === '+' ? '+' : s);
/* a numbered work line: the step number, the maths, an optional note */
const workLine = (host, n, t, note, ncls = '') => {
  const d = h('div', 'u6l6-wl', `${n ? `<span class="u6l6-n">${n}</span>` : ''}<span class="u6l6-m">${t.startsWith('<') ? t : T(t)}</span>${note ? `<span class="u6l6-note ${ncls}">${note}</span>` : ''}`);
  host.appendChild(d); return hide(d);
};
const flipTo = async (c, el, html, cls) => {
  await anim(c, el, [{ transform: 'rotateX(0deg)' }, { transform: 'rotateX(90deg)' }], 200);
  el.innerHTML = html; if (cls) el.classList.add(cls);
  await anim(c, el, [{ transform: 'rotateX(90deg)' }, { transform: 'rotateX(0deg)' }], 220);
};
const moveTo = (c, el, x, y, ms = 520) => anim(c, el, [{ left: el.style.left, top: el.style.top }, { left: x + 'px', top: y + 'px' }], ms);

/* =============================== explainer: the procedure (Example 1) =============================== */
const LC = {
  a: { n1: '3', d1: 'x+2', op: '+', n2: '5', d2: 'x-4', m1: 'x-4', m2: 'x+2', why: 'x+2\\ne0 and x-4\\ne0',
    npv: 'x\\ne-2,\\ 4', lcd: '(x+2)(x-4)',
    L3: `\\dfrac{3${cA('(x-4)')}+5${cA('(x+2)')}}{${cB('(x+2)(x-4)')}}`, L4: '=\\dfrac{3x-12+5x+10}{(x+2)(x-4)}',
    L5: '=\\dfrac{8x-2}{(x+2)(x-4)}', L6: '=\\dfrac{2(4x-1)}{(x+2)(x-4)}',
    cap4: '<b>4. Expand</b> the numerator.',
    cap6: `<b>6. Factor the numerator:</b> ${T('2(4x-1)')}. Neither ${T('x+2')} nor ${T('x-4')} is a factor of it, so nothing cancels.` },
  b: { n1: '4', d1: 'a-3', op: '-', n2: '1', d2: '2a+1', m1: '2a+1', m2: 'a-3', why: 'a-3\\ne0 and 2a+1\\ne0',
    npv: 'a\\ne3,\\ -\\tfrac{1}{2}', lcd: '(a-3)(2a+1)',
    L3: `\\dfrac{4${cA('(2a+1)')}-${cA('(a-3)')}}{${cB('(a-3)(2a+1)')}}`, L4: '=\\dfrac{8a+4-a+3}{(a-3)(2a+1)}',
    n4: T('-(a-3)=-a+3'), L5: '=\\dfrac{7a+7}{(a-3)(2a+1)}', L6: '=\\dfrac{7(a+1)}{(a-3)(2a+1)}',
    cap4: `<b>4. Expand.</b> The minus sign is in front of the whole bracket: ${T('-(a-3)=-a+3')}.`,
    cap6: `<b>6. Factor the numerator:</b> ${T('7(a+1)')}. No factor matches the denominator, so this is simplest form.` },
  c: { n1: '2', d1: 'x', op: '-', n2: '3', d2: 'x+5', m1: 'x+5', m2: 'x', why: 'x\\ne0 and x+5\\ne0',
    npv: 'x\\ne0,\\ -5', lcd: 'x(x+5)',
    L3: `\\dfrac{2${cA('(x+5)')}-3${cA('x')}}{${cB('x(x+5)')}}`, L4: '=\\dfrac{2x+10-3x}{x(x+5)}',
    L5: '=\\dfrac{10-x}{x(x+5)}', L6: null,
    cap4: '<b>4. Expand</b> the numerator.',
    cap6: `<b>6. Look for a common factor:</b> ${T('10-x')} shares no factor with ${T('x(x+5)')}, so this is simplest form.` }
};
const lcdQ = (d) => `\\dfrac{${d.n1}}{${d.d1}}${d.op}\\dfrac{${d.n2}}{${d.d2}}`;
const lcd = {
  title: 'No common factor: the LCD is the product',
  height: 440, minW: 900, capH: 84,
  choices: [{ sep: 'Example 1:' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }, { v: 'c', label: '(c)' }],
  ask: (v) => `Example 1(${v}): simplify ${T(lcdQ(LC[v]))} and state the non-permissible values.`,
  make(stage, v, ex) {
    const d = LC[v], W = ex.W;
    const row = div(stage, 'u6l6-row', '', 14, 6);
    const mw = (m) => { const w = h('div', 'u6l6-row'); w.style.gap = '6px'; w.append(opEl('×', 'u6l6-mul'), frac(cA(m), cA(m), 'u6l6-mul')); return hide(w); };
    const M1 = mw(d.m1), M2 = mw(d.m2);
    row.append(frac(d.n1, cB(d.d1)), M1, opEl(d.op), frac(d.n2, cB(d.d2)), M2);
    const side = div(stage, '', '', 584, 10, W - 594);
    const l1 = workLine(side, 1, `<b>NPVs</b> &nbsp;${T(d.npv)}`);
    const l2 = workLine(side, 2, `<b>LCD</b> &nbsp;${T(cB(d.lcd))}`);
    l2.style.marginTop = '10px';
    const col = div(stage, '', '', 14, 124, W - 200); col.style.display = 'flex'; col.style.flexDirection = 'column'; col.style.gap = '8px';
    const l3 = workLine(col, 3, d.L3, 'missing factors'), l4 = workLine(col, 4, d.L4, d.n4 || 'expand', d.n4 ? 'u6l6-nr' : '');
    const l5 = workLine(col, 5, d.L5, 'collect'), l6 = d.L6 ? workLine(col, 6, d.L6, 'factor') : null;
    const st = stampAt(stage, '✓ simplest form', true, W - 150, 330);
    return [
      { cap: `<b>1. NPVs.</b> Each denominator ≠ 0: ${T(d.why.replace(' and ', '\\text{ and }'))}, so ${T(d.npv)}.`, run: (c) => show(c, l1) },
      { cap: `<b>2. LCD.</b> ${T(d.d1)} and ${T(d.d2)} have no common factor, so the LCD is their <b>product</b>, ${T(d.lcd)}. Leave it factored.`, run: (c) => show(c, l2) },
      { cap: '<b>3.</b> Multiply each fraction, top and bottom, by the factor it is <b>missing</b>.', run: async (c) => { await pop(c, M1); await pop(c, M2); await show(c, l3); } },
      { cap: d.cap4, run: (c) => show(c, l4) },
      { cap: '<b>5. Collect</b> like terms.', run: (c) => show(c, l5) },
      { cap: d.cap6, run: async (c) => { if (l6) await show(c, l6); await stampIn(c, st); } }
    ];
  }
};

/* =============================== explainer: the minus sign meets the bracket (STAR) =============================== */
const MN = {
  a: { label: 'Example 2(a)', q: '\\dfrac{x+1}{x-2}-\\dfrac{x-3}{x+4}', v: 'x', P: '(x+1)(x+4)', Q: '(x-3)(x-2)', den: '(x-2)(x+4)',
    A: ['x^2', '+5x', '+4'], B: ['x^2', '-5x', '+6'], Bf: ['-x^2', '+5x', '-6'], Bw: ['-x^2', '-5x', '+6'],
    wrong: '=10', wrongF: '=\\dfrac{10}{(x-2)(x+4)}', right: '=10x-2', rightF: '=\\dfrac{2(5x-1)}{(x-2)(x+4)}',
    qsub: '\\dfrac{2}{-1}-\\dfrac{-2}{5}=-2+0.4=-1.6', qv: '-1.6', wv: '\\dfrac{10}{(-1)(5)}=-2', rv: '\\dfrac{2(4)}{(-1)(5)}=-1.6', wnum: '-2' },
  c: { label: 'Example 2(c)', q: '2-\\dfrac{x+1}{x+3}', v: 'x', P: '2(x+3)', Q: '(x+1)', den: 'x+3',
    A: ['2x', '+6'], B: ['x', '+1'], Bf: ['-x', '-1'], Bw: ['-x', '+1'],
    wrong: '=x+7', wrongF: '=\\dfrac{x+7}{x+3}', right: '=x+5', rightF: '=\\dfrac{x+5}{x+3}',
    qsub: '2-\\dfrac{2}{4}=1.5', qv: '1.5', wv: '\\dfrac{8}{4}=2', rv: '\\dfrac{6}{4}=1.5', wnum: '2' },
  b: { label: 'Example 1(b)', q: '\\dfrac{4}{a-3}-\\dfrac{1}{2a+1}', v: 'a', P: '4(2a+1)', Q: '(a-3)', den: '(a-3)(2a+1)',
    A: ['8a', '+4'], B: ['a', '-3'], Bf: ['-a', '+3'], Bw: ['-a', '-3'],
    wrong: '=7a+1', wrongF: '=\\dfrac{7a+1}{(a-3)(2a+1)}', right: '=7a+7', rightF: '=\\dfrac{7(a+1)}{(a-3)(2a+1)}',
    qsub: '\\dfrac{4}{-2}-\\dfrac{1}{3}=-\\tfrac{7}{3}', qv: '-\\tfrac{7}{3}', wv: '\\dfrac{8}{(-2)(3)}=-\\tfrac{4}{3}', rv: '\\dfrac{7(2)}{(-2)(3)}=-\\tfrac{7}{3}', wnum: '-\\tfrac{4}{3}' }
};
const minus = {
  title: 'The minus sign meets the bracket',
  height: 440, minW: 900, capH: 84,
  choices: [{ v: 'a', label: MN.a.label }, { v: 'c', label: MN.c.label }, { v: 'b', label: MN.b.label }],
  ask: (v) => `Simplify ${T(MN[v].q)}. The second numerator is <b>subtracted</b>.`,
  make(stage, v, ex) {
    const d = MN[v], W = ex.W, x1 = d.v + '=1';
    div(stage, 'u6l6-m lg', T(`\\dfrac{${d.P}-${cR(d.Q)}}{${cB(d.den)}}`), 14, 4);
    const chk = hide(div(stage, 'u6l6-chk', `<b>Check</b> with ${T(x1)} (not an NPV). The question: ${T(d.qsub)}`, W - 470, 18, 456));
    const PW = (W - 34) / 2, PH = 326, PY = 106;
    const mk = (x, cls, title, bracket) => {
      const P = div(stage, 'u6l6-panel ' + cls, `<div class="u6l6-ph">${title}</div>`, x, PY, PW, PH);
      const row = div(P, 'u6l6-toks', '', 12, 66);
      const tok = (t, c2 = '') => { const e = h('span', 'u6l6-tok ' + c2, T(t)); row.appendChild(e); return e; };
      const A = d.A.map((t) => tok(t)), op = h('span', 'u6l6-op u6l6-red', '−'); row.appendChild(op);
      const p1 = bracket ? row.appendChild(h('span', 'u6l6-par', '(')) : null;
      const B = d.B.map((t) => tok(t, 'u6l6-b'));
      const p2 = bracket ? row.appendChild(h('span', 'u6l6-par', ')')) : null;
      hide(row);
      const ball = hide(div(row, 'u6l6-minus', '−', 0, 0));
      const l1 = hide(div(P, 'u6l6-m', T(bracket ? d.right : d.wrong), 18, 128));
      const l2 = hide(div(P, 'u6l6-m', T(bracket ? d.rightF : d.wrongF), 18, 170));
      const l3 = hide(div(P, 'u6l6-m sm', `${T(x1)}: &nbsp;${T(bracket ? d.rv : d.wv)}`, 18, 262));
      return { P, row, A, B, op, p1, p2, ball, l1, l2, l3 };
    };
    const L = mk(10, 'u6l6-bad', 'Forgot the bracket', false), R = mk(24 + PW, 'u6l6-good', 'Minus meets the bracket', true);
    const sL = stampAt(L.P, '✗ wrong', false, PW - 80, 206), sR = stampAt(R.P, '✓ checks', true, PW - 80, 206);
    const ballTo = (c, S, el) => moveTo(c, S.ball, el.offsetLeft + el.offsetWidth / 2 - 20, el.offsetTop - 44, 460);
    const startBall = (S) => { S.ball.style.left = (S.op.offsetLeft + S.op.offsetWidth / 2 - 20) + 'px'; S.ball.style.top = (S.op.offsetTop + S.op.offsetHeight / 2 - 20) + 'px'; S.ball.style.opacity = 1; S.op.style.opacity = 0; };
    const P = d.P, Q = d.Q;
    return [
      { cap: d.B.length > 2 ? `Expand each product first: ${T(`${P}=${d.A.join('')}`)} and ${T(`${Q}=${d.B.join('')}`)}. The second one is being <b>subtracted</b>.`
        : `Expand: ${T(`${P}=${d.A.join('')}`)}. The whole second numerator, ${T(Q)}, is being <b>subtracted</b>.`,
        run: async (c) => { await show(c, L.row); await show(c, R.row); } },
      { cap: `<b>Without the bracket</b>, the minus sign only reaches the <b>first</b> term. ${d.B.length > 2 ? 'The other terms keep their signs.' : 'The second term keeps its sign.'}`,
        run: async (c) => {
          startBall(L); await ballTo(c, L, L.B[0]); await flipTo(c, L.B[0], T(d.Bw[0]), 'u6l6-fl'); L.ball.style.opacity = 0;
          L.B.slice(1).forEach((e) => e.classList.add('u6l6-miss')); await shake(c, L.row);
        } },
      { cap: `<b>With the bracket</b>, the minus sign multiplies <b>every</b> term inside: ${T(d.Bf.join(',\\ '))}.`,
        run: async (c) => {
          startBall(R);
          for (let i = 0; i < R.B.length; i++) { await ballTo(c, R, R.B[i]); await flipTo(c, R.B[i], T(d.Bf[i]), 'u6l6-fl'); }
          R.ball.style.opacity = 0; await Promise.all([anim(c, R.p1, [{ opacity: 1 }, { opacity: 0 }], 300), anim(c, R.p2, [{ opacity: 1 }, { opacity: 0 }], 300)]);
        } },
      { cap: 'Collect like terms in each. Two different answers: which one is right?',
        run: async (c) => { await show(c, L.l1); await show(c, R.l1); await show(c, L.l2); await show(c, R.l2); } },
      { cap: `<b>Check</b> with ${T(x1)}, which is not an NPV. The original question gives ${T(d.qv)}.`, run: (c) => show(c, chk) },
      { cap: `Forgetting the bracket gives ${T(d.wnum)}, not ${T(d.qv)}: <b>wrong</b>. Keeping the bracket gives ${T(d.qv)} ✓.`,
        run: async (c) => { await show(c, L.l3); await stampIn(c, sL); await show(c, R.l3); await stampIn(c, sR); } }
    ];
  }
};

/* =============================== explainer: factor first, build the LCD (STAR) =============================== */
/* tiles: [key, tex]; a key that is a number is a constant factor (the LCD takes the lowest common multiple) */
const BD = {
  c3: { label: 'Example 3(c)', n1: '4', d1: '3a-6', op: '-', n2: '5', d2: '4a-8', t1: [['3', '3'], ['a-2', 'a-2']], t2: [['4', '4'], ['a-2', 'a-2']],
    npv: 'a\\ne2', m1: '\\times4', m2: '\\times3', fcap: `${T('3a-6=3(a-2)')} and ${T('4a-8=4(a-2)')}.`,
    mcap: `${T('3')} and ${T('4')}: the LCD of the numbers is ${T('12')}. ${T('(a-2)')} is in both, so it is used <b>once</b>.`,
    L1: '\\dfrac{4(4)-5(3)}{12(a-2)}=\\dfrac{16-15}{12(a-2)}', L2: '=\\dfrac{1}{12(a-2)}', cut: null,
    endCap: `The numerator is ${T('1')}: nothing to cancel. ${T('\\dfrac{1}{12(a-2)}')}, ${T('a\\ne2')}.` },
  e4a: { label: 'Example 4(a)', n1: '2', d1: 'x-1', op: '-', n2: '4', d2: 'x^2-1', t1: [['x-1', 'x-1']], t2: [['x-1', 'x-1'], ['x+1', 'x+1']],
    npv: 'x\\ne\\pm1', m1: '\\times(x+1)', m2: '\\text{nothing}', fcap: `${T('x-1')} is already factored; ${T('x^2-1=(x-1)(x+1)')}.`,
    mcap: `${T('(x-1)')} is already in the LCD, so it is used <b>once</b>. Only ${T('(x+1)')} is new.`,
    L1: '\\dfrac{2(x+1)-4}{(x-1)(x+1)}=\\dfrac{2x-2}{(x-1)(x+1)}', L2: `=\\dfrac{2${cP('\\cancel{(x-1)}')}}{${cP('\\cancel{(x-1)}')}(x+1)}`, L3: '=\\dfrac{2}{x+1},\\ x\\ne\\pm1', cut: 'x-1',
    endCap: `Cancel ${T('(x-1)')}: ${T('\\dfrac{2}{x+1}')}. The NPVs still come from the original: ${T('x\\ne\\pm1')}.` },
  e5a: { label: 'Example 5(a)', n1: '3', d1: 'x^2+5x+6', op: '+', n2: '2', d2: 'x^2-x-6', t1: [['x+2', 'x+2'], ['x+3', 'x+3']], t2: [['x-3', 'x-3'], ['x+2', 'x+2']],
    npv: 'x\\ne-2,\\ \\pm3', m1: '\\times(x-3)', m2: '\\times(x+3)', fcap: `${T('x^2+5x+6=(x+2)(x+3)')} and ${T('x^2-x-6=(x-3)(x+2)')}.`,
    mcap: `${T('(x+2)')} is in both, so it is used <b>once</b>: the LCD has <b>three</b> factors, not four.`,
    L1: '\\dfrac{3(x-3)+2(x+3)}{(x+2)(x+3)(x-3)}=\\dfrac{3x-9+2x+6}{(x+2)(x+3)(x-3)}', L2: '=\\dfrac{5x-3}{(x+2)(x+3)(x-3)}', cut: null,
    endCap: `${T('5x-3')} does not factor, so nothing cancels: this is simplest form.` },
  e5b: { label: 'Example 5(b)', n1: '3', d1: 'x^2-2x-8', op: '-', n2: '1', d2: 'x^2-6x+8', t1: [['x-4', 'x-4'], ['x+2', 'x+2']], t2: [['x-4', 'x-4'], ['x-2', 'x-2']],
    npv: 'x\\ne4,\\ \\pm2', m1: '\\times(x-2)', m2: '\\times(x+2)', fcap: `${T('x^2-2x-8=(x-4)(x+2)')} and ${T('x^2-6x+8=(x-4)(x-2)')}.`,
    mcap: `${T('(x-4)')} is in both, so it is used <b>once</b>. Only ${T('(x-2)')} is new.`,
    L1: '\\dfrac{3(x-2)-(x+2)}{(x-4)(x+2)(x-2)}=\\dfrac{2x-8}{(x-4)(x+2)(x-2)}', L2: `=\\dfrac{2${cP('\\cancel{(x-4)}')}}{${cP('\\cancel{(x-4)}')}(x+2)(x-2)}`, L3: '=\\dfrac{2}{(x+2)(x-2)}', cut: 'x-4',
    endCap: `Cancel ${T('(x-4)')}: ${T('\\dfrac{2}{(x+2)(x-2)}')}. Keep the NPVs from the original: ${T('x\\ne4,\\ \\pm2')}.` }
};
const isNum = (k) => /^\d+$/.test(k);
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const tileW = (k) => (isNum(k) || k.length <= 2 ? 64 : 116);
const build = {
  title: 'Factor first, then build the LCD',
  height: 420, minW: 900, capH: 84,
  choices: Object.keys(BD).map((k) => ({ v: k, label: BD[k].label })),
  ask: (v) => `${BD[v].label}: simplify ${T(`\\dfrac{${BD[v].n1}}{${BD[v].d1}}${BD[v].op}\\dfrac{${BD[v].n2}}{${BD[v].d2}}`)} fully.`,
  make(stage, v, ex) {
    const d = BD[v], W = ex.W, half = W / 2;
    const F1 = div(stage, 'u6l6-row', '', 40, 4), F2 = div(stage, 'u6l6-row', '', half + 40, 4);
    F1.appendChild(frac(d.n1, cB(d.d1))); F2.appendChild(frac(d.n2, cB(d.d2)));
    div(stage, 'u6l6-op', d.op === '-' ? '−' : '+', half - 14, 28);
    const TY = 92, GAP = 10;
    const mkTiles = (list, x0) => { let x = x0; return list.map(([k, t]) => { const w = tileW(k); const e = hide(div(stage, 'u6l6-tile' + (isNum(k) ? ' u6l6-tn' : ''), T(t), x, TY, w)); e.k = k; e.x0 = x; x += w + GAP; return e; }); };
    const A = mkTiles(d.t1, 40), B = mkTiles(d.t2, half + 40);
    const M1 = hide(div(stage, 'u6l6-missl', `missing ${T(cA(d.m1))}`, F1.offsetLeft + F1.offsetWidth + 18, 22)), M2 = hide(div(stage, 'u6l6-missl', `missing ${T(cA(d.m2))}`, F2.offsetLeft + F2.offsetWidth + 18, 22));
    // the LCD tray: one slot per different factor (numbers share one slot)
    const slots = []; const slotOf = (k) => (isNum(k) ? '#' : k);
    [...d.t1, ...d.t2].forEach(([k]) => { if (!slots.includes(slotOf(k))) slots.push(slotOf(k)); });
    const RY = 168, RX = 86, sw = (s) => (s === '#' ? 64 : 116);
    let sx = RX + 12; const slotX = {}; slots.forEach((s) => { slotX[s] = sx; sx += sw(s) + GAP; });
    div(stage, 'u6l6-trayl', 'LCD', 22, RY + 20);
    div(stage, 'u6l6-tray', '', RX, RY - 10, sx - RX + 2, 66);
    const npv = hide(div(stage, 'u6l6-m', `<b>NPVs</b> &nbsp;${T(cP(d.npv))}`, sx + 40, RY + 6));
    const nums = [...d.t1, ...d.t2].filter(([k]) => isNum(k)).map(([k]) => +k);
    const lcm = nums.length ? nums.reduce((a, b) => (a * b) / gcd(a, b)) : null;
    const tray = {};   // slot -> the tile sitting there
    const W1 = div(stage, 'u6l6-wl', '', 22, 250); W1.appendChild(h('span', 'u6l6-m', T(d.L1))); hide(W1);
    const W2 = div(stage, 'u6l6-wl', '', 22, 330); const w2a = h('span', 'u6l6-m', T(d.L2)); W2.appendChild(w2a); hide(W2);
    const w2b = d.L3 ? hide(W2.appendChild(h('span', 'u6l6-m', T(d.L3)))) : null;
    const notDone = stampAt(stage, 'not finished!', null, W - 150, 270), done = stampAt(stage, '✓ simplest form', true, W - 150, 380);
    const slide = (c, e, x, y) => moveTo(c, e, x, y, 600);
    const steps = [
      { cap: `<b>Factor</b> each denominator: ${d.fcap}`, run: async (c) => { for (const e of [...A, ...B]) await pop(c, e, 300); } },
      { cap: `<b>NPVs</b>: no factor can be ${T('0')}, so ${T(d.npv)}.`, run: (c) => show(c, npv) },
      { cap: 'Build the <b>LCD</b>: drop in every factor of the first denominator.',
        run: async (c) => { for (const e of A) { const s = slotOf(e.k), cl = e.cloneNode(true); stage.appendChild(cl); cl.style.opacity = 1; await slide(c, cl, slotX[s], RY); tray[s] = cl; } } },
      { cap: d.mcap,
        run: async (c) => {
          for (const e of B) {
            const s = slotOf(e.k), cl = e.cloneNode(true); stage.appendChild(cl); cl.style.opacity = 1;
            await slide(c, cl, slotX[s], RY);
            if (tray[s]) {
              await anim(c, cl, [{ opacity: 1 }, { opacity: 0 }], 260); cl.remove();
              if (s === '#') { tray[s].innerHTML = T(String(lcm)); tray[s].classList.add('u6l6-tc'); }
              await pulse(c, tray[s], 1.12);
            } else tray[s] = cl;
          }
        } },
      { cap: 'Each fraction gets the factor its denominator is <b>missing</b> from the LCD.', run: async (c) => { await pop(c, M1); await pop(c, M2); } },
      { cap: 'Multiply out and combine the numerators over the LCD.', run: (c) => show(c, W1) }
    ];
    if (d.cut) {
      steps.push({ cap: `<b>Factor the numerator.</b> ${T(`(${d.cut})`)} is on the top <b>and</b> the bottom: the answer is <b>not finished</b>.`,
        run: async (c) => { await show(c, W2); await stampIn(c, notDone); } });
      steps.push({ cap: d.endCap, run: async (c) => { await show(c, w2b); notDone.style.opacity = 0; await stampIn(c, done); } });
    } else steps.push({ cap: d.endCap, run: async (c) => { await show(c, W2); await stampIn(c, done); } });
    return steps;
  }
};

/* =============================== explainer: opposite factors =============================== */
const OPP = {
  a: { label: 'Example 6(a)', v: 'x', n1: '6', d1: 'x-5', op: '+', n2: '2', d2: '5-x', flip: '(x-5)', newOp: '-',
    heads: ['x', 'x-5', '5-x'], xs: [0, 3, 5, 8], f: [(x) => x - 5, (x) => 5 - x], rule: '5-x=-(x-5)', npv: 'x\\ne5', sign: '+ and − make −',
    lines: [['\\dfrac{6}{x-5}-\\dfrac{2}{x-5}', 'The denominators now match.'], ['=\\dfrac{6-2}{x-5}=\\dfrac{4}{x-5}', 'Subtract the numerators.']] },
  b: { label: 'Example 6(b)', v: 'x', n1: '3x', d1: 'x^2-16', op: '-', n2: '2', d2: '4-x', flip: '(x-4)', newOp: '+',
    heads: ['x', 'x-4', '4-x'], xs: [0, 2, 4, 6], f: [(x) => x - 4, (x) => 4 - x], rule: '4-x=-(x-4)', npv: 'x\\ne\\pm4', sign: '− and − make +',
    lines: [['\\dfrac{3x}{(x-4)(x+4)}+\\dfrac{2}{x-4}', `Factor ${T('x^2-16=(x-4)(x+4)')}: the LCD is ${T('(x-4)(x+4)')}.`], ['=\\dfrac{3x+2(x+4)}{(x-4)(x+4)}=\\dfrac{5x+8}{(x-4)(x+4)}', 'Give the second fraction its missing factor and combine.']] },
  c: { label: 'Example 6(c)', v: 'a', n1: 'a+2', d1: 'a^2-a-6', op: '+', n2: '2', d2: '9-a^2', flip: '(a-3)(a+3)', newOp: '-',
    heads: ['a', 'a^2-9', '9-a^2'], xs: [0, 1, 3, 4], f: [(x) => x * x - 9, (x) => 9 - x * x], rule: '9-a^2=-(a^2-9)=-(a-3)(a+3)', npv: 'a\\ne3,\\ -2,\\ -3', sign: '+ and − make −',
    lines: [['\\dfrac{a+2}{(a-3)(a+2)}-\\dfrac{2}{(a-3)(a+3)}', `Factor the first denominator too: ${T('(a-3)(a+2)')}.`], ['=\\dfrac{1}{a-3}-\\dfrac{2}{(a-3)(a+3)}', `Simplify the first fraction on its own: ${T('\\dfrac{a+2}{(a-3)(a+2)}=\\dfrac{1}{a-3}')}.`],
      ['=\\dfrac{a+3-2}{(a-3)(a+3)}=\\dfrac{a+1}{(a-3)(a+3)}', 'Give it the missing factor and combine.']] }
};
const opposite = {
  title: 'Opposite factors: flip it, and the sign moves out front',
  height: 420, minW: 900, capH: 84,
  choices: Object.keys(OPP).map((k) => ({ v: k, label: OPP[k].label })),
  ask: (v) => `${OPP[v].label}: simplify ${T(`\\dfrac{${OPP[v].n1}}{${OPP[v].d1}}${OPP[v].op}\\dfrac{${OPP[v].n2}}{${OPP[v].d2}}`)}.`,
  make(stage, v, ex) {
    const d = OPP[v], W = ex.W;
    const tb = new ValueTable(stage, { x: 14, y: 26, headers: d.heads, rows: d.xs.map((x) => [x, d.f[0](x), d.f[1](x)]), hide: (r, c) => c > 0, tap: false, cellW: 92, cellH: 52 });
    const XL = 340;
    const row = div(stage, 'u6l6-row', '', XL, 18);
    const f2 = frac(d.n2, cB(d.d2)); const op = opEl(d.op);
    row.append(frac(d.n1, cB(d.d1)), op, f2);
    const rule = hide(div(stage, 'u6l6-m', T(cR(d.rule)), XL, 114));
    const col = div(stage, '', '', XL, 170, W - XL - 10); col.style.display = 'flex'; col.style.flexDirection = 'column'; col.style.gap = '10px';
    const ls = d.lines.map(([t]) => workLine(col, 0, t));
    const npv = hide(div(stage, 'u6l6-m sm', `NPVs from the <b>original</b> denominators: ${T(cP(d.npv))}`, 14, 300, 300));
    npv.style.whiteSpace = 'normal';
    let ball = null;
    const steps = [
      { cap: `Try some values: ${T(d.heads[1])} and ${T(d.heads[2])} are always <b>opposites</b> (same size, opposite signs).`,
        run: async (c) => { await tb.fill(c, { col: 1 }); await tb.fill(c, { col: 2 }); } },
      { cap: `So ${T(d.rule)}. Rewrite the opposite factor.`,
        run: async (c) => { await show(c, rule); await flipTo(c, f2.d, `<span class="u6l6-neg">−</span>${T(cB(d.flip))}`); } },
      { cap: `Move its negative sign to the <b>front of the fraction</b>: ${d.sign}.`,
        run: async (c) => {
          const neg = f2.d.querySelector('.u6l6-neg');
          ball = div(row, 'u6l6-minus', '−', neg.offsetLeft - 12, neg.offsetTop + neg.offsetHeight / 2 - 20);
          neg.style.visibility = 'hidden';
          await moveTo(c, ball, op.offsetLeft + op.offsetWidth / 2 - 20, op.offsetTop + op.offsetHeight / 2 - 20, 650);
          neg.style.display = 'none'; ball.style.opacity = 0;
          await flipTo(c, op, d.newOp === '-' ? '−' : '+'); op.classList.add('u6l6-red');
        } }
    ];
    d.lines.forEach(([, cap], i) => steps.push({ cap, run: (c) => show(c, ls[i]) }));
    steps.push({ cap: `Take the NPVs from the <b>original</b> denominators: ${T(d.npv)}.`, run: (c) => show(c, npv) });
    return steps;
  }
};

/* =============================== explainer: the TI-84 TABLE check =============================== */
const tiFmt = (v) => {
  if (!Number.isFinite(v) || Math.abs(v) > 1e9) return 'ERROR';
  for (let sig = 10; sig >= 1; sig--) { const s = String(Number(v.toPrecision(sig))).replace(/^(-?)0\./, '$1.'); if (s.length <= 7) return s.replace('-', '−'); }
  return v.toPrecision(2);
};
const TB = {
  a: { label: 'Example 2(a)', y1: '(X+1)/(X−2)−(X−3)/(X+4)', y2: '2(5X−1)/((X−2)(X+4))', y2cap: 'our answer',
    f1: (x) => (x + 1) / (x - 2) - (x - 3) / (x + 4), f2: (x) => 2 * (5 * x - 1) / ((x - 2) * (x + 4)), x0: -5, n: 8, kind: 'ok', npv: 'x\\ne2,\\ -4' },
  w: { label: 'Forgot the bracket', y1: '(X+1)/(X−2)−(X−3)/(X+4)', y2: '10/((X−2)(X+4))', y2cap: 'the forgot-the-bracket answer',
    f1: (x) => (x + 1) / (x - 2) - (x - 3) / (x + 4), f2: (x) => 10 / ((x - 2) * (x + 4)), x0: -5, n: 8, kind: 'bad', npv: 'x\\ne2,\\ -4' },
  b: { label: 'Example 4(a)', y1: '2/(X−1)−4/(X²−1)', y2: '2/(X+1)', y2cap: 'the simplified answer',
    f1: (x) => 2 / (x - 1) - 4 / (x * x - 1), f2: (x) => 2 / (x + 1), x0: -3, n: 7, kind: 'hide', npv: 'x\\ne\\pm1' }
};
const table = {
  title: 'Check on the calculator: Y₁ = the question, Y₂ = the answer',
  height: 430, minW: 900, capH: 92,
  choices: [{ v: 'a', label: TB.a.label }, { v: 'w', label: TB.w.label }, { v: 'b', label: TB.b.label }],
  ask: (v) => (v === 'b' ? `Check ${T('\\dfrac{2}{x-1}-\\dfrac{4}{x^2-1}=\\dfrac{2}{x+1}')} with a table of values.`
    : `Check ${T(`\\dfrac{x+1}{x-2}-\\dfrac{x-3}{x+4}=${v === 'w' ? '\\dfrac{10}{(x-2)(x+4)}' : '\\dfrac{2(5x-1)}{(x-2)(x+4)}'}`)} with a table of values.`),
  make(stage, v, ex) {
    const d = TB[v], W = ex.W, xs = Array.from({ length: d.n }, (_, i) => d.x0 + i);
    const vals = xs.map((x) => [x, d.f1(x), d.f2(x)]);
    const kc = (s) => s.split(' ').map((k) => `<span class="u6l6-kc">${k}</span>`).join('');
    div(stage, '', kc('Y='), 12, 0);
    const Y = div(stage, 'u6l6-scr', '<div class="u6l6-scrh">Plot1 Plot2 Plot3</div>', 10, 26, 436, 124);
    const y1 = hide(div(Y, 'u6l6-yl', `<b>■ Y₁=</b>${d.y1}`)), y2 = hide(div(Y, 'u6l6-yl', `<b class="u6l6-y2">■ Y₂=</b>${d.y2}`));
    div(stage, '', kc('2nd TBLSET'), 12, 164);
    const TS = hide(div(stage, 'u6l6-scr', `<div class="u6l6-scrh">TABLE SETUP</div><div class="u6l6-ts">TblStart=${tiFmt(d.x0)}</div><div class="u6l6-ts">ΔTbl=1</div>`, 10, 190, 260, 104));
    const tip = hide(div(stage, 'u6l6-note', 'brackets around every numerator and denominator', 12, 306));
    tip.style.whiteSpace = 'normal'; tip.style.width = '300px';
    const TX = 470, TW = W - TX - 96;
    div(stage, '', kc('2nd TABLE'), TX + 2, 0);
    const TT = div(stage, 'u6l6-scr', '', TX, 26, TW, 34 + d.n * 32 + 18);
    const tbl = h('table', 'u6l6-tb', `<tr><th>X</th><th class="u6l6-y1">Y₁</th><th class="u6l6-y2">Y₂</th></tr>`);
    TT.appendChild(tbl);
    const rows = vals.map((r) => { const tr = h('tr', '', `<td>${tiFmt(r[0])}</td><td></td><td></td>`); tbl.appendChild(tr); return tr; });
    const same = (a, b) => Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) < 1e-9;
    const marks = vals.map((r, i) => {
      const e1 = !Number.isFinite(r[1]), e2 = !Number.isFinite(r[2]);
      const [cls, t] = e1 && e2 ? ['np', 'NPV'] : e1 || e2 ? ['hd', 'NPV hidden'] : same(r[1], r[2]) ? ['ok', '✓'] : ['no', '✗'];
      const m = hide(div(stage, 'u6l6-mk ' + cls, t, TX + TW + 8, 26 + 10 + 34 + i * 32)); m.kind = cls; return m;
    });
    const errs = vals.map((r, i) => (!Number.isFinite(r[1]) || !Number.isFinite(r[2]) ? i : -1)).filter((i) => i >= 0);
    const ex0 = vals.find((r) => Number.isFinite(r[1]) && Number.isFinite(r[2]));
    const verdict = d.kind === 'bad' ? stampAt(stage, '✗ not equal', false, 360, 380, { size: 'lg' }) : stampAt(stage, '✓ equal', true, 330, 384, { size: 'lg' });
    const errX = errs.map((i) => tiFmt(xs[i]));
    const capFill = d.kind === 'ok' ? '<b>2nd TABLE.</b> Y₁ and Y₂ are the same in every row.'
      : d.kind === 'bad' ? `<b>2nd TABLE.</b> Y₁ and Y₂ do <b>not</b> match: at X = ${tiFmt(ex0[0])}, Y₁ = ${tiFmt(ex0[1])} but Y₂ = ${tiFmt(ex0[2])}.`
        : '<b>2nd TABLE.</b> Y₁ and Y₂ are the same in every row but one.';
    const capErr = d.kind === 'hide'
      ? `At X = −1 both columns say ERROR. At X = 1 only Y₁ does: Y₂ = 1. The simplified answer <b>hides</b> the NPV ${T('x=1')}, which is why we write ${T('x\\ne\\pm1')} beside it.`
      : `ERROR at X = ${errX.join(' and X = ')}: the calculator divides by ${T('0')}. Those are exactly the NPVs, ${T(d.npv)}.`;
    return [
      { cap: 'Press <b>Y=</b> and type the <b>question</b> as Y₁. Put brackets around every numerator and every denominator.', run: async (c) => { await show(c, y1); await show(c, tip); } },
      { cap: `Type ${d.y2cap} as Y₂.`, run: (c) => show(c, y2) },
      { cap: `<b>2nd TBLSET</b>: TblStart = ${tiFmt(d.x0)}, ΔTbl = 1.`, run: (c) => show(c, TS) },
      { cap: capFill,
        run: async (c) => {
          for (let i = 0; i < rows.length; i++) {
            const td = rows[i].children; td[1].textContent = tiFmt(vals[i][1]); td[2].textContent = tiFmt(vals[i][2]);
            if (marks[i].kind === 'ok' || marks[i].kind === 'no') await pop(c, marks[i], 220); else await sleep(c, 160);
          }
        } },
      { cap: capErr,
        run: async (c) => { for (const i of errs) { rows[i].classList.add(marks[i].kind === 'hd' ? 'u6l6-odd' : 'u6l6-err'); await pop(c, marks[i], 300); } } },
      { cap: d.kind === 'bad' ? 'The columns disagree, so the answer is <b>wrong</b>: go back and look for the mistake (here, the missing bracket).'
        : d.kind === 'hide' ? `The expressions are equal for every permissible ${T('x')}: ${T('\\dfrac{2}{x+1},\\ x\\ne\\pm1')} ✓.` : `The columns match, so ${T('\\dfrac{2(5x-1)}{(x-2)(x+4)}')} is right ✓.`,
        run: (c) => stampIn(c, verdict) }
    ];
  }
};

/* =============================== explainer: up the river and back (Example 7) =============================== */
const boat = {
  title: 'Up the river and back: what the current does',
  height: 430, minW: 900, capH: 92,
  ask: `The boat goes ${T('36')} km up the river and ${T('36')} km back, ${T('12')} km/h in still water. How does the current ${T('c')} change the total time?`,
  make(stage, v, ex) {
    const W = ex.W, SW = 500, SH = 236, XR = 440, XL = 70, BY = 122;
    const svg = svgEl('svg', { width: SW, height: SH, viewBox: `0 0 ${SW} ${SH}` }, stage);
    svg.style.position = 'absolute'; svg.style.left = '0px'; svg.style.top = '0px';
    svgEl('rect', { x: 0, y: 0, width: SW, height: SH, rx: 14, fill: '#cfe6b8' }, svg);
    svgEl('rect', { x: 0, y: 56, width: SW, height: 128, fill: '#bfe0f5' }, svg);
    svgEl('rect', { x: 0, y: 184, width: SW, height: 52, fill: '#ecd9a8' }, svg);
    const flows = [84, 122, 160].map((y, i) => svgEl('line', { x1: 0, y1: y + (i === 1 ? 26 : 0), x2: SW, y2: y + (i === 1 ? 26 : 0), stroke: '#fff', 'stroke-width': 3, 'stroke-dasharray': '24 36', opacity: 0.85 }, svg));
    [[XR + 14, 'Start'], [XL - 50, 'Upstream end']].forEach(([x, t]) => { svgEl('rect', { x: x - 2, y: 34, width: 22, height: 50, fill: '#8a6d4b', rx: 3 }, svg); });
    div(stage, 'u6l6-spd', 'start', XR - 6, 10); div(stage, 'u6l6-spd', 'turn around', XL - 62, 10);
    svgEl('line', { x1: XL, y1: 206, x2: XR + 20, y2: 206, stroke: '#5b4630', 'stroke-width': 2.5 }, svg);
    svgEl('path', { d: `M${XL} 206 l10 -6 v12 z M${XR + 20} 206 l-10 -6 v12 z`, fill: '#5b4630' }, svg);
    div(stage, 'u6l6-spd', '36 km', (XL + XR) / 2 - 14, 214).style.color = '#5b4630';
    const cur = div(stage, 'u6l6-spd', '', 180, 60);
    const g = svgEl('g', {}, svg);
    svgEl('path', { d: 'M-34 0 L40 0 L24 18 L-34 18 Z', fill: '#7a1f3d' }, g);
    svgEl('rect', { x: -22, y: -16, width: 30, height: 16, rx: 3, fill: '#fff', stroke: '#7a1f3d', 'stroke-width': 3 }, g);
    const setBoat = (x, dir) => g.setAttribute('transform', `translate(${x} ${BY}) scale(${dir} 1)`);
    setBoat(XR, -1);
    const setCur = (cv) => {
      cur.innerHTML = cv ? `current ${T(`c=${cv}`)} km/h →` : 'no current';
      flows.forEach((l) => {
        [...l.children].forEach((a) => a.remove());
        if (cv) svgEl('animate', { attributeName: 'stroke-dashoffset', values: '0;-60', dur: (4 / cv).toFixed(2) + 's', repeatCount: 'indefinite' }, l);
      });
    };
    setCur(0);
    const read = div(stage, 'u6l6-read', '', 10, SH + 10, SW - 150), clock = div(stage, 'u6l6-clock', '0 h', SW - 132, SH + 14);
    const ff = hide(div(stage, 'u6l6-ff', '⏩ fast-forward', SW - 140, SH + 62));
    const f = (cv) => 864 / ((12 - cv) * (12 + cv));
    const r2 = (x) => String(Math.round(x * 100) / 100);
    const G = new Graph(stage, { x: SW + 16, y: 26, width: W - SW - 22, height: 400, xmin: 0, xmax: 13, ymin: 0, ymax: 40, xstep: 1, ystep: 5, xlabels: 2, ylabels: 10, xtitle: 'c', ytitle: 'T', fontSize: 15 });
    const runs = [0, 4, 8, 11].map((cv) => {
      const up = 36 / (12 - cv), dn = 36 / (12 + cv), tot = up + dn;
      const p = G.point(cv, tot, { label: (cv === 11 ? '≈ ' : '') + r2(tot) + ' h', pos: cv === 11 ? 'w' : 'nw', color: 'brand' });
      hide(p); if (p.label) hide(p.label);
      return { cv, up, dn, tot, p };
    });
    const curve = hide(G.fn((x) => f(x), { from: 0, to: 11.97, color: 'brand' }));
    const flab = hide(G.label(3.2, 31, T('T=\\dfrac{864}{(12-c)(12+c)}'), { cls: 'bk-ptlab' }));
    const asy = hide(G.vline(12)); const alab = hide(G.label(12, 5, T('c=12'), { pos: 'w', cls: 'bk-ptlab', color: PU }));
    const fmtH = (x) => (Math.abs(x - Math.round(x * 100) / 100) < 1e-9 ? r2(x) : '\\approx' + r2(x));
    const trip = async (c, R) => {
      setCur(R.cv);
      read.innerHTML = `${T(`c=${R.cv}`)} km/h<br>Up: ${T(`36\\div(12-${R.cv})=36\\div${12 - R.cv}=${fmtH(R.up)}`)} h<br>Down: ${T(`36\\div(12+${R.cv})=36\\div${12 + R.cv}=${fmtH(R.dn)}`)} h<br><b>Total: ${T(fmtH(R.tot))} h</b>`;
      const MS = 260, mu = R.up * MS, md = R.dn * MS;
      ff.style.opacity = mu > 3600 ? 1 : 0;
      setBoat(XR, -1);
      await tween(c, Math.min(3600, Math.max(900, mu)), (t) => { setBoat(XR + (XL - XR) * t, -1); clock.textContent = (R.up * t).toFixed(2) + ' h'; }, linear);
      ff.style.opacity = 0;
      await tween(c, Math.min(3600, Math.max(900, md)), (t) => { setBoat(XL + (XR - XL) * t, 1); clock.textContent = (R.up + R.dn * t).toFixed(2) + ' h'; }, linear);
      await pop(c, R.p); if (R.p.label) await show(c, R.p.label);
    };
    const [r0, r4, r8, r11] = runs;
    return [
      { cap: `No current, ${T('c=0')}: ${T('12')} km/h both ways, ${T('3')} h up and ${T('3')} h back. Total ${T('6')} h.`, run: (c) => trip(c, r0) },
      { cap: `${T('c=4')}: up at ${T('12-4=8')} km/h (${T('4.5')} h), down at ${T('12+4=16')} km/h (${T('2.25')} h). Total ${T('6.75')} h: <b>longer</b> than with no current.`, run: (c) => trip(c, r4) },
      { cap: `${T('c=8')}: up at ${T('4')} km/h (${T('9')} h), down at ${T('20')} km/h (${T('1.8')} h). Total ${T('10.8')} h. The slow leg costs far more than the fast leg saves.`, run: (c) => trip(c, r8) },
      { cap: `${T('c=11')}: up at only ${T('1')} km/h, ${T('36')} h! Down at ${T('23')} km/h, about ${T('1.57')} h. Total about ${T('37.6')} h.`, run: (c) => trip(c, r11) },
      { cap: `Every point lies on ${T('T=\\dfrac{864}{(12-c)(12+c)}')}, the simplified expression. The time shoots up as ${T('c')} gets close to ${T('12')}.`,
        run: async (c) => { curve.style.opacity = ''; await G.drawIn(curve, 900, c); await show(c, flab); } },
      { cap: `${T('c=12')}: the upstream speed is ${T('12-12=0')}. The boat never gets up the river, and ${T('T')} is undefined: an <b>NPV</b>. In context, ${T('0\\le c<12')}.`,
        run: async (c) => {
          setCur(12); read.innerHTML = `${T('c=12')} km/h<br>Up: ${T('36\\div(12-12)=36\\div0')}<br><b>undefined: the boat never gets there</b>`; clock.textContent = '∞';
          asy.style.opacity = ''; await G.drawIn(asy, 600, c); await show(c, alab);
          setBoat(XR, -1); await tween(c, 1400, (t) => setBoat(XR - 8 * Math.sin(t * Math.PI * 6), -1), linear);
        } }
    ];
  }
};

/* =============================== Stand Up Break =============================== */
const sg = (n) => (n < 0 ? `-${-n}` : `+${n}`);
const bin = (p, v = 'x') => (p === 0 ? v : `${v}${sg(p)}`);
const poly = (cs, v = 'x') => { // [[coefficient, power], …]
  let s = '';
  for (const [k, e] of cs) { if (!k) continue; const a = Math.abs(k), mono = e === 0 ? String(a) : (a === 1 ? '' : a) + (e === 2 ? v + '^2' : v); s += (k < 0 ? '-' : s ? '+' : '') + mono; }
  return s || '0';
};
const lin = (m, n) => poly([[m, 1], [n, 0]]);
const npvs = (ps) => [...new Set(ps.map((p) => -p))].sort((a, b) => a - b).join(',\\ ');
const fac = (m, n) => { const g = gcd(m, n); return g > 1 && m > 0 ? `${g}(${lin(m / g, n / g)})` : lin(m, n); };
const coef = (k) => (k === 1 ? '' : String(k));
standup('u6l6', {
  intro: 'At your whiteboard: factor, NPVs, LCD, missing factors, brackets on anything subtracted, then factor the numerator.',
  levels: {
    BEG: (r) => { // a/(x + p) ± b/(x + q), no common factor
      for (;;) {
        const a = r.int(1, 7), b = r.int(1, 7), p = r.int(-6, 6), q = r.int(-6, 6), s = r.sign();
        if (!p || !q || p === q) continue;
        const m = a + s * b, n = a * q + s * b * p;
        if (m === 0 && n === 0) continue;
        if (m !== 0 && n % m === 0 && (n / m === p || n / m === q)) continue;
        const D = `(${bin(p)})(${bin(q)})`, op = s > 0 ? '+' : '-';
        const a2 = [`x\\ne ${npvs([p, q])}`, `\\dfrac{${a}(${bin(q)})${op}${coef(b)}(${bin(p)})}{${D}}`, `=\\dfrac{${lin(m, n)}}{${D}}`];
        if (fac(m, n) !== lin(m, n)) a2.push(`=\\dfrac{${fac(m, n)}}{${D}}`);
        return { text: 'Simplify. State the non-permissible values.', q: `\\dfrac{${a}}{${bin(p)}}${op}\\dfrac{${b}}{${bin(q)}}`, a: a2 };
      }
    },
    PRG: (r) => { // (x + p)/(x + q) ± (x + t)/(x + s): binomial numerators
      for (;;) {
        const p = r.int(-6, 6), q = r.int(-6, 6), t = r.int(-6, 6), s = r.int(-6, 6), k = r.chance(0.7) ? -1 : 1;
        if (!q || !s || q === s || p === q || t === s) continue;
        const c2 = 1 + k, c1 = p + s + k * (t + q), c0 = p * s + k * t * q;
        if (c2 === 0 && c1 === 0) continue;
        const N = (x) => c2 * x * x + c1 * x + c0; if (N(-q) === 0 || N(-s) === 0) continue;
        const D = `(${bin(q)})(${bin(s)})`, op = k > 0 ? '+' : '-';
        const e1 = poly([[1, 2], [p + s, 1], [p * s, 0]]), e2 = poly([[1, 2], [t + q, 1], [t * q, 0]]);
        const num = poly([[c2, 2], [c1, 1], [c0, 0]]);
        const a2 = [`x\\ne ${npvs([q, s])}`, `\\dfrac{(${bin(p)})(${bin(s)})${op}(${bin(t)})(${bin(q)})}{${D}}`,
          `=\\dfrac{${e1}${k < 0 ? `-(${e2})` : `+${e2}`}}{${D}}`, `=\\dfrac{${num}}{${D}}`];
        if (c2 === 0 && fac(c1, c0) !== lin(c1, c0)) a2.push(`=\\dfrac{${fac(c1, c0)}}{${D}}`);
        return { text: 'Simplify. State the non-permissible values.', q: `\\dfrac{${bin(p)}}{${bin(q)}}${op}\\dfrac{${bin(t)}}{${bin(s)}}`, a: a2 };
      }
    },
    MAS: (r) => { // a/((x + p)(x + q)) ± b/((x + p)(x + t)), trinomials that share a factor; the result may cancel
      for (;;) {
        const p = r.int(-5, 5), q = r.int(-6, 6), t = r.int(-6, 6), a = r.int(1, 6), b = r.int(1, 6), k = r.sign();
        if (!p || !q || !t || p === q || p === t || q === t) continue;
        const m = a + k * b, n = a * t + k * b * q;
        if (m === 0 && n === 0) continue;
        const D1 = poly([[1, 2], [p + q, 1], [p * q, 0]]), D2 = poly([[1, 2], [p + t, 1], [p * t, 0]]);
        const F1 = `(${bin(p)})(${bin(q)})`, F2 = `(${bin(p)})(${bin(t)})`, L = `(${bin(p)})(${bin(q)})(${bin(t)})`, op = k > 0 ? '+' : '-';
        const a2 = [`\\dfrac{${a}}{${F1}}${op}\\dfrac{${b}}{${F2}}`, `x\\ne ${npvs([p, q, t])};\\ \\text{LCD }${L}`,
          `\\dfrac{${a}(${bin(t)})${op}${coef(b)}(${bin(q)})}{${L}}=\\dfrac{${lin(m, n)}}{${L}}`];
        if (m !== 0 && n % m === 0 && [p, q, t].includes(n / m)) {
          const z = n / m, rest = [p, q, t]; rest.splice(rest.indexOf(z), 1);
          a2.push(`=\\dfrac{${m === 1 ? '' : m === -1 ? '-' : m}(${bin(z)})}{${L}}=\\dfrac{${m}}{(${bin(rest[0])})(${bin(rest[1])})}`);
        } else if (fac(m, n) !== lin(m, n)) a2.push(`=\\dfrac{${fac(m, n)}}{${L}}`);
        return { text: 'Factor first. Simplify fully and state the non-permissible values.', q: `\\dfrac{${a}}{${D1}}${op}\\dfrac{${b}}{${D2}}`, a: a2 };
      }
    }
  }
});

/* =============================== mount =============================== */
export const explainers = mountExplainers({ lcd, minus, build, opposite, table, boat });
export const _test = { LC, MN, BD, OPP, TB, tiFmt };
