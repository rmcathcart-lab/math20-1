/* Math 20-1 · Unit 6 · Lesson 3 — Multiplying Rational Expressions.
 * New lesson format (2026-11-11): the warm-up is plain markup on the page (no code). The explainers:
 *   pairOff (factor tiles for numbers and monomials: primes and single letters; the restrictions collect from the
 *     denominators; matching tiles pop out in pairs; Example 1(a), (c), (d) checks),
 *   tiles (STAR, the one procedure animation for polynomials: every numerator and denominator turns into factor tiles,
 *     every denominator tile drops its NPV into the list BEFORE anything cancels, the tiles slide into one big fraction,
 *     matching factors light up in the same colour and pop out in pairs, what is left is multiplied; step numbers
 *     beside each step. A new example, Example 2(b), 3(a), 3(b), 5(a), 5(b) checks),
 *   opp (the same tiles: an opposite factor flips over like a card, −(x − 7), and its −1 drops out beside it;
 *     a new example, Example 4(a), 4(b) checks),
 *   area (Example 6: the rectangle drawn to scale; its area two ways; x shrinks to 3 and the rectangle disappears,
 *     x = 2√3; then a slider the class can drag).
 * Colours: NPVs / restrictions red; each matching pair of factors gets its own colour (blue, amber, green, purple …);
 * prime-number tiles cream, letter tiles grey, binomial tiles blue-grey. */
import { h, tex, add, box, stamp, stampIn, mountExplainers, pop, fadeIn, sleep, pulse, anim, tween, COLORS } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const PAIRC = ['#1f5bd6', '#c27a0e', '#12805a', '#7b4fc4', '#0e7c86', '#a33357'];
const show = (c, el, ms = 320) => fadeIn(c, el, ms);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
/** position of el inside the stage (offsets ignore the stage's scale transform) */
function posIn(stage, el) { let x = 0, y = 0; while (el && el !== stage) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; } return [x, y]; }
/** FLIP: mutate the layout, then slide every element of els from where it was to where it is now */
async function reflow(c, stage, els, mutate, ms = 380) {
  const before = els.map((e) => posIn(stage, e));
  mutate();
  await Promise.all(els.map((e, i) => {
    if (!e.isConnected || e.style.display === 'none') return null;
    const [x1, y1] = posIn(stage, e), [x0, y0] = before[i];
    if (Math.abs(x1 - x0) + Math.abs(y1 - y0) < 0.5) return null;
    return anim(c, e, [{ transform: `translate(${x0 - x1}px, ${y0 - y1}px)` }, { transform: 'none' }], ms);
  }).filter(Boolean));
}
/** a copy of src flies to dst and fades */
async function fly(c, stage, src, dst, ms = 520) {
  if (c && c.fast) return;
  const [x0, y0] = posIn(stage, src), [x1, y1] = posIn(stage, dst);
  const g = src.cloneNode(true); g.classList.add('u6l3-ghost'); g.style.opacity = 1; g.style.left = x0 + 'px'; g.style.top = y0 + 'px'; stage.appendChild(g);
  try { await anim(c, g, [{ transform: 'translate(0,0) scale(1)', opacity: 1 }, { transform: `translate(${x1 - x0}px, ${y1 - y0}px) scale(.7)`, opacity: 0.15 }], ms); } finally { g.remove(); }
}

/* =============================== factor tiles =============================== */
/* data: { ask, fr: [{ n, d, nt: [tile TeX…], dt: [tile TeX | [tile TeX, restriction TeX]…] }], op, head ('x\\ne' or ''),
 *   npv: [restriction TeX…] (in the booklet's order), nl ('NPVs' | 'Restrictions'), flips: [{ from, mid, to }],
 *   cuts: [{ keys: [tile TeX…], cap }], ans, capF, capN, capM } */
const kindOf = (t) => (t === '-1' ? 'u6l3-neg' : /^\(/.test(t) ? 'u6l3-bin' : /^-?\d+$/.test(t) ? 'u6l3-num' : 'u6l3-mono');
function tile(t, v) { const e = h('div', 'u6l3-tile ' + kindOf(t), T(t)); e.dataset.t = t; e._v = v; return e; }
const norm = (t) => (Array.isArray(t) ? { t: t[0], v: t[1] } : { t });

function tileDef(title, data, o = {}) {
  return {
    title, height: 440, capH: 92, minW: o.minW || 900,
    choices: Object.keys(data).map((k) => ({ v: k, label: data[k].label })),
    ask: (v) => data[v].ask,
    make(stage, v, ex) {
      const d = data[v], W = ex.W, LX = 128, CW = W - LX - 8, lbl = d.nl || 'NPVs';
      const badge = (y, s) => hide(div(stage, 'u6l3-badge', s, 4, y, 116));
      const bF = badge(48, '1 · factor'), bN = badge(150, lbl === 'NPVs' ? '2 · NPVs' : '2 · restrict'), bD = badge(256, '3 · divide out'), bM = badge(378, '4 · multiply');
      /* row A: the product as given, then factored */
      const rowA = div(stage, 'u6l3-prod', '', LX, 8, CW, 118);
      const frs = d.fr.map((f, i) => {
        if (i) rowA.appendChild(h('div', 'u6l3-op', T(d.op || '\\cdot')));
        const fe = h('div', 'u6l3-fr'), nr = h('div', 'u6l3-row'), bar = h('div', 'u6l3-bar'), dr = h('div', 'u6l3-row');
        fe.append(nr, bar, dr); rowA.appendChild(fe);
        const no = h('div', 'u6l3-orig', T(f.n)), dn = h('div', 'u6l3-orig', T(f.d)); nr.appendChild(no); dr.appendChild(dn);
        return { nr, dr, no, dn, nt: f.nt.map((t) => tile(norm(t).t)), dt: f.dt.map((t) => { const q = norm(t); return tile(q.t, q.v); }) };
      });
      const numT = frs.flatMap((f) => f.nt), denT = frs.flatMap((f) => f.dt);
      /* the NPV list */
      const tray = hide(div(stage, 'u6l3-tray', `<span class="u6l3-trl">${lbl}:</span>`, LX, 140));
      if (d.head) tray.appendChild(h('span', 'u6l3-trh', T(d.head)));
      const slots = {};
      d.npv.forEach((r, i) => { const s = hide(h('span', 'u6l3-slot', T((i ? ',\\ ' : '') + r))); tray.appendChild(s); slots[r] = s; });
      const npvTex = (d.head || '') + d.npv.join(',\\ ');
      const stay = hide(stamp(stage, lbl === 'NPVs' ? 'NPVs stay!' : 'still restricted!', { ok: null, x: W - 104, y: 160, size: 'sm' }));
      /* the big fraction */
      const big = div(stage, 'u6l3-bigw', '', LX, 214, CW, 130);
      const bfe = h('div', 'u6l3-fr u6l3-big'), bn = h('div', 'u6l3-row'), bbar = h('div', 'u6l3-bar'), bd = h('div', 'u6l3-row');
      bfe.append(bn, bbar, bd); big.appendChild(bfe); hide(bbar);
      const one = tile('1'); one.classList.add('u6l3-one');
      /* the answer */
      const ansEl = hide(div(stage, 'u6l3-ans', T('=' + d.ans), LX, 354, CW));
      let pairK = 0;
      const live = (row) => [...row.children].filter((e) => e.style.display !== 'none');
      async function cut(c, key) {
        const a = live(bn).find((e) => e.dataset.t === key && !e._cut), b = live(bd).find((e) => e.dataset.t === key && !e._cut);
        if (!a || !b) throw new Error('u6l3: no pair for ' + key);
        a._cut = b._cut = true;
        const col = PAIRC[pairK++ % PAIRC.length];
        [a, b].forEach((e) => { e.style.setProperty('--pc', col); e.classList.add('u6l3-lit'); });
        await Promise.all([pulse(c, a, 1.18, 420), pulse(c, b, 1.18, 420)]);
        await Promise.all([
          anim(c, a, [{ transform: 'none', opacity: 1 }, { transform: 'translateY(-26px) scale(1.25)', opacity: 0 }], 420),
          anim(c, b, [{ transform: 'none', opacity: 1 }, { transform: 'translateY(26px) scale(1.25)', opacity: 0 }], 420)]);
        await reflow(c, stage, [...bn.children, ...bd.children], () => {
          a.style.display = b.style.display = 'none';
          if (!live(bn).length) { bn.appendChild(one); one.style.opacity = 1; one.style.transform = 'none'; }
          if (!live(bd).length) { bbar.style.visibility = bd.style.visibility = 'hidden'; }
        });
      }
      const steps = [
        { cap: d.capF || '<b>Step 1 · Factor</b> every numerator and every denominator <b>fully</b>.',
          run: async (c) => {
            await show(c, bF);
            await Promise.all(frs.flatMap((f) => [anim(c, f.no, [{ opacity: 1 }, { opacity: 0 }], 200), anim(c, f.dn, [{ opacity: 1 }, { opacity: 0 }], 200)]));
            frs.forEach((f) => { f.no.style.display = f.dn.style.display = 'none'; f.nt.forEach((e) => f.nr.appendChild(e)); f.dt.forEach((e) => f.dr.appendChild(e)); });
            await Promise.all([...numT, ...denT].map((e, i) => pop(c, e, 360, { delay: i * 35 })));
          } }
      ];
      if (d.npv.length) steps.push({
        cap: d.capN || `<b>Step 2 · ${lbl}</b> come from <b>every</b> factor of a denominator, <b>before</b> anything is divided out: ${T(npvTex)}.`,
        run: async (c) => {
          await show(c, bN); tray.style.opacity = 1; await fadeIn(c, tray.firstChild, 200);
          for (const e of denT) {
            if (e._v == null) continue;
            const s = slots[e._v]; e.classList.add('u6l3-npvsrc');
            await fly(c, stage, e, s, 480);
            if (s.style.opacity !== '1') { s.style.opacity = 1; await pop(c, s, 300); } else await pulse(c, s, 1.25, 300);
          }
          if (d.head) tray.querySelector('.u6l3-trh').style.opacity = 1;
        } });
      steps.push({
        cap: d.capS || '<b>Step 3 · Divide out.</b> Slide everything into one big fraction: a factor of <b>any</b> numerator can divide out with a factor of <b>any</b> denominator.',
        run: async (c) => {
          await show(c, bD); bbar.style.opacity = 1;
          const moves = [...numT.map((e) => [e, bn]), ...denT.map((e) => [e, bd])];
          const from = moves.map(([e]) => posIn(stage, e));
          moves.forEach(([e, row]) => { const cl = e.cloneNode(true); cl.classList.add('u6l3-dim'); cl.style.opacity = ''; cl.style.transform = ''; cl.classList.remove('u6l3-npvsrc'); e.replaceWith(cl); e.classList.remove('u6l3-npvsrc'); row.appendChild(e); });
          await Promise.all(moves.map(([e], i) => { const [x1, y1] = posIn(stage, e), [x0, y0] = from[i]; return anim(c, e, [{ transform: `translate(${x0 - x1}px, ${y0 - y1}px)` }, { transform: 'none' }], 620, { delay: i * 40 }); }));
        } });
      (d.flips || []).forEach((f) => steps.push({
        cap: f.cap,
        run: async (c) => {
          const e = live(bd).find((q) => q.dataset.t === f.from);
          await anim(c, e, [{ transform: 'perspective(400px) rotateY(0deg)' }, { transform: 'perspective(400px) rotateY(90deg)' }], 260);
          e.innerHTML = T(f.mid); e.classList.add('u6l3-flip');
          await anim(c, e, [{ transform: 'perspective(400px) rotateY(-90deg)' }, { transform: 'none' }], 260);
          await sleep(c, 450);
          const neg = tile('-1'); neg.style.opacity = 0;
          await reflow(c, stage, [...bn.children, ...bd.children], () => { e.before(neg); e.innerHTML = T(f.to); e.dataset.t = f.to; e.className = 'u6l3-tile ' + kindOf(f.to); });
          await pop(c, neg, 380);
        } }));
      d.cuts.forEach((g) => steps.push({
        cap: g.cap || `Divide out ${g.keys.map((k) => T(k)).join(', ')}: each one is in a numerator <b>and</b> a denominator, and each pair makes ${T('1')}.`,
        run: async (c) => { for (const k of g.keys) await cut(c, k); } }));
      steps.push({
        cap: d.capM || `<b>Step 4 · Multiply</b> what is left: ${T(d.ans)}.${d.npv.length ? ` The ${lbl === 'NPVs' ? 'NPVs' : 'restrictions'} stay: ${T(npvTex)}.` : ''}`,
        run: async (c) => {
          await show(c, bM); await show(c, ansEl, 420);
          if (d.npv.length) { await pulse(c, tray, 1.06, 420); stay.style.opacity = 1; await stampIn(c, stay); }
        } });
      return steps;
    }
  };
}

/* ---------- Example 1: numbers and monomials (primes and single letters) ---------- */
const PO = {
  e1a: { label: 'Example 1(a) check', op: '\\times', ask: `Example 1(a): simplify ${T('\\dfrac{14}{15}\\times\\dfrac{25}{21}')}.`,
    fr: [{ n: '14', d: '15', nt: ['2', '7'], dt: ['3', '5'] }, { n: '25', d: '21', nt: ['5', '5'], dt: ['3', '7'] }],
    npv: [], capF: `<b>Step 1 · Factor</b> each number into primes: ${T('14=2\\cdot7')}, ${T('15=3\\cdot5')}, ${T('25=5\\cdot5')}, ${T('21=3\\cdot7')}. No variables, so no NPVs.`,
    cuts: [{ keys: ['7', '5'], cap: `Divide out a ${T('7')} and a ${T('5')}: the ${T('7')} on top of the first fraction with the ${T('7')} under the second, the ${T('5')}s across.` }],
    ans: '\\dfrac{2\\cdot5}{3\\cdot3}=\\dfrac{10}{9}', capM: `<b>Step 4 · Multiply</b> what is left: ${T('\\dfrac{2\\cdot5}{3\\cdot3}=\\dfrac{10}{9}')}, already in simplest form.` },
  e1c: { label: 'Example 1(c) check', ask: `Example 1(c): simplify ${T('\\dfrac{6x^3}{5y}\\cdot\\dfrac{10y^4}{9x}')}. State the NPVs.`,
    fr: [{ n: '6x^3', d: '5y', nt: ['2', '3', 'x', 'x', 'x'], dt: ['5', ['y', 'y\\ne0']] }, { n: '10y^4', d: '9x', nt: ['2', '5', 'y', 'y', 'y', 'y'], dt: ['3', '3', ['x', 'x\\ne0']] }],
    npv: ['x\\ne0', 'y\\ne0'],
    capF: `<b>Step 1 · Factor</b>: numbers into primes, powers into single letters: ${T('6x^3=2\\cdot3\\cdot x\\cdot x\\cdot x')}.`,
    capN: `<b>Step 2 · NPVs</b>: each variable in a <b>denominator</b> can’t be ${T('0')}: ${T('x\\ne0,\\ y\\ne0')}.`,
    cuts: [{ keys: ['3', '5'], cap: `Divide out a ${T('3')} and a ${T('5')}: a factor of <b>any</b> numerator with a factor of <b>any</b> denominator.` },
      { keys: ['x', 'y'], cap: `Divide out an ${T('x')} and a ${T('y')}. That is the exponent laws: ${T('\\tfrac{x^3}{x}=x^2')}, ${T('\\tfrac{y^4}{y}=y^3')}.` }],
    ans: '\\dfrac{4x^2y^3}{3}' },
  e1d: { label: 'Example 1(d) check', ask: `Example 1(d): simplify ${T('\\dfrac{-4a^2b}{15c^3}\\cdot\\dfrac{25bc}{6a^5}')}. State the NPVs.`,
    fr: [{ n: '-4a^2b', d: '15c^3', nt: ['-1', '2', '2', 'a', 'a', 'b'], dt: ['3', '5', ['c', 'c\\ne0'], ['c', 'c\\ne0'], ['c', 'c\\ne0']] },
      { n: '25bc', d: '6a^5', nt: ['5', '5', 'b', 'c'], dt: ['2', '3', ['a', 'a\\ne0'], ['a', 'a\\ne0'], ['a', 'a\\ne0'], ['a', 'a\\ne0'], ['a', 'a\\ne0']] }],
    npv: ['a\\ne0', 'c\\ne0'],
    capF: `<b>Step 1 · Factor</b>: ${T('-4=-1\\cdot2\\cdot2')}, numbers into primes, powers into single letters.`,
    capN: `<b>Step 2 · NPVs</b>: ${T('a\\ne0,\\ c\\ne0')}. ${T('b')} is never in a denominator, so it has <b>no restriction</b>.`,
    cuts: [{ keys: ['2', '5'], cap: `Divide out a ${T('2')} and a ${T('5')}.` },
      { keys: ['a', 'a'], cap: `Divide out two ${T('a')}s: ${T('\\tfrac{a^2}{a^5}=\\tfrac{1}{a^3}')}.` },
      { keys: ['c'], cap: `Divide out a ${T('c')}: ${T('\\tfrac{c}{c^3}=\\tfrac{1}{c^2}')}. The ${T('-1')} stays: the answer is negative.` }],
    ans: '-\\dfrac{10b^2}{9a^3c^2}' }
};
const pairOff = tileDef('Pair off the common factors', PO);

/* ---------- polynomials (STAR) ---------- */
const TL = {
  demo: { label: 'A new one', ask: `Simplify ${T('\\dfrac{x^2-25}{6x}\\cdot\\dfrac{9x^2}{x^2+3x-10}')}. State the NPVs.`,
    fr: [{ n: 'x^2-25', d: '6x', nt: ['(x-5)', '(x+5)'], dt: [['6x', '0']] }, { n: '9x^2', d: 'x^2+3x-10', nt: ['9x^2'], dt: [['(x+5)', '-5'], ['(x-2)', '2']] }],
    head: 'x\\ne', npv: ['0', '-5', '2'],
    capF: `<b>Step 1 · Factor</b> everything fully: ${T('x^2-25')} is a difference of squares; ${T('x^2+3x-10')}: product ${T('-10')}, sum ${T('3')}, so ${T('5')} and ${T('-2')}.`,
    cuts: [{ keys: ['(x+5)'] }],
    ans: '\\dfrac{9x^2(x-5)}{6x(x-2)}=\\dfrac{3x(x-5)}{2(x-2)}',
    capM: `<b>Step 4 · Multiply</b> what is left and simplify the monomials: ${T('\\dfrac{9x^2(x-5)}{6x(x-2)}=\\dfrac{3x(x-5)}{2(x-2)}')}. The NPVs stay, even ${T('-5')}.` },
  e2b: { label: 'Example 2(b) check', ask: `Example 2(b): ${T('\\dfrac{5x-15}{x^2+2x}\\cdot\\dfrac{3x+6}{x^2-9}')}`,
    fr: [{ n: '5x-15', d: 'x^2+2x', nt: ['5', '(x-3)'], dt: [['x', '0'], ['(x+2)', '-2']] }, { n: '3x+6', d: 'x^2-9', nt: ['3', '(x+2)'], dt: [['(x-3)', '3'], ['(x+3)', '-3']] }],
    head: 'x\\ne', npv: ['0', '-2', '3', '-3'],
    capF: `<b>Step 1 · Factor</b>: common factors ${T('5(x-3)')}, ${T('x(x+2)')}, ${T('3(x+2)')}, and a difference of squares ${T('(x-3)(x+3)')}.`,
    cuts: [{ keys: ['(x-3)', '(x+2)'] }], ans: '\\dfrac{15}{x(x+3)}' },
  e3a: { label: 'Example 3(a) check', ask: `Example 3(a): ${T('\\dfrac{x^2-x-12}{x^2+5x+6}\\cdot\\dfrac{x^2-4}{x^2-6x+8}')}`,
    fr: [{ n: 'x^2-x-12', d: 'x^2+5x+6', nt: ['(x-4)', '(x+3)'], dt: [['(x+2)', '-2'], ['(x+3)', '-3']] }, { n: 'x^2-4', d: 'x^2-6x+8', nt: ['(x-2)', '(x+2)'], dt: [['(x-2)', '2'], ['(x-4)', '4']] }],
    head: 'x\\ne', npv: ['-2', '-3', '2', '4'],
    cuts: [{ keys: ['(x-4)', '(x+3)'] }, { keys: ['(x-2)', '(x+2)'], cap: `Divide out ${T('(x-2)')} and ${T('(x+2)')}. <b>Every</b> factor divides out!` }],
    ans: '1', capM: `<b>Step 4 · Multiply</b> what is left: nothing but ${T('1')}s, so the product is ${T('1')}, but only for ${T('x\\ne-2,\\ -3,\\ 2,\\ 4')}.` },
  e3b: { label: 'Example 3(b) check', ask: `Example 3(b): ${T('\\dfrac{2a^2+7a-4}{a^2-16}\\cdot\\dfrac{a^2-3a-4}{4a^2-1}')}`,
    fr: [{ n: '2a^2+7a-4', d: 'a^2-16', nt: ['(2a-1)', '(a+4)'], dt: [['(a-4)', '4'], ['(a+4)', '-4']] }, { n: 'a^2-3a-4', d: '4a^2-1', nt: ['(a-4)', '(a+1)'], dt: [['(2a-1)', '\\tfrac{1}{2}'], ['(2a+1)', '-\\tfrac{1}{2}']] }],
    head: 'a\\ne', npv: ['4', '-4', '\\tfrac{1}{2}', '-\\tfrac{1}{2}'],
    capF: `<b>Step 1 · Factor</b>: ${T('2a^2+7a-4=(2a-1)(a+4)')} by decomposition, two differences of squares, and ${T('a^2-3a-4=(a-4)(a+1)')}.`,
    capN: `<b>Step 2 · NPVs</b> from every denominator factor: ${T('2a-1=0')} gives ${T('a=\\tfrac{1}{2}')}. So ${T('a\\ne4,\\ -4,\\ \\tfrac{1}{2},\\ -\\tfrac{1}{2}')}.`,
    cuts: [{ keys: ['(2a-1)', '(a+4)', '(a-4)'] }], ans: '\\dfrac{a+1}{2a+1}' },
  e5a: { label: 'Example 5(a): three', ask: `Example 5(a): ${T('\\dfrac{x^2-4}{2x+6}\\cdot\\dfrac{x^2+7x+12}{x^2+2x}\\cdot\\dfrac{4x^2}{x^2+2x-8}')}`,
    fr: [{ n: 'x^2-4', d: '2x+6', nt: ['(x-2)', '(x+2)'], dt: ['2', ['(x+3)', '-3']] }, { n: 'x^2+7x+12', d: 'x^2+2x', nt: ['(x+3)', '(x+4)'], dt: [['x', '0'], ['(x+2)', '-2']] },
      { n: '4x^2', d: 'x^2+2x-8', nt: ['4x^2'], dt: [['(x+4)', '-4'], ['(x-2)', '2']] }],
    head: 'x\\ne', npv: ['-3', '0', '-2', '-4', '2'],
    cuts: [{ keys: ['(x-2)', '(x+2)', '(x+3)', '(x+4)'], cap: `Divide out across the <b>whole</b> product: ${T('(x-2)')}, ${T('(x+2)')}, ${T('(x+3)')} and ${T('(x+4)')}.` }],
    ans: '\\dfrac{4x^2}{2x}=2x', capM: `<b>Step 4 · Multiply</b> what is left: ${T('\\dfrac{4x^2}{2x}=2x')}. The five NPVs stay: ${T('x\\ne-3,\\ 0,\\ -2,\\ -4,\\ 2')}.` },
  e5b: { label: 'Example 5(b): two variables', ask: `Example 5(b): ${T('\\dfrac{x^2-9y^2}{x^2+xy-2y^2}\\cdot\\dfrac{x^2-xy}{2x-6y}')}`,
    fr: [{ n: 'x^2-9y^2', d: 'x^2+xy-2y^2', nt: ['(x-3y)', '(x+3y)'], dt: [['(x+2y)', 'x\\ne-2y'], ['(x-y)', 'x\\ne y']] }, { n: 'x^2-xy', d: '2x-6y', nt: ['x', '(x-y)'], dt: ['2', ['(x-3y)', 'x\\ne3y']] }],
    npv: ['x\\ne-2y', 'x\\ne y', 'x\\ne3y'], nl: 'Restrictions',
    capF: `<b>Step 1 · Factor</b>: ${T('x^2+xy-2y^2=(x+2y)(x-y)')}, like ${T('x^2+x-2')} with a ${T('y')} in each bracket.`,
    capN: `<b>Step 2 · Restrictions</b>: each denominator factor ${T('\\ne0')}. ${T('x-3y=0')} means ${T('x=3y')}, so ${T('x\\ne3y')}. Also ${T('x\\ne-2y,\\ x\\ne y')}.`,
    cuts: [{ keys: ['(x-3y)', '(x-y)'] }], ans: '\\dfrac{x(x+3y)}{2(x+2y)}' }
};
const tiles = tileDef('Factor tiles: factor, NPVs, divide out, multiply', TL);

/* ---------- opposite factors ---------- */
const OP = {
  demo: { label: 'A new one', ask: `Simplify ${T('\\dfrac{x-5}{2x+4}\\cdot\\dfrac{x+2}{5-x}')}. State the NPVs.`,
    fr: [{ n: 'x-5', d: '2x+4', nt: ['(x-5)'], dt: ['2', ['(x+2)', '-2']] }, { n: 'x+2', d: '5-x', nt: ['(x+2)'], dt: [['(5-x)', '5']] }],
    head: 'x\\ne', npv: ['-2', '5'],
    flips: [{ from: '(5-x)', mid: '-(x-5)', to: '(x-5)', cap: `${T('(5-x)')} and ${T('(x-5)')} are <b>opposites</b>. Flip the tile: ${T('5-x=-(x-5)')}, and the ${T('-1')} drops out beside it.` }],
    cuts: [{ keys: ['(x-5)', '(x+2)'] }],
    ans: '\\dfrac{1}{-2}=-\\dfrac{1}{2}', capM: `<b>Step 4 · Multiply</b> what is left: ${T('\\dfrac{1}{2(-1)}=-\\dfrac{1}{2}')}. NPVs: ${T('x\\ne-2,\\ 5')}.` },
  e4a: { label: 'Example 4(a) check', ask: `Example 4(a): ${T('\\dfrac{x-7}{x^2+3x}\\cdot\\dfrac{4x+12}{14-2x}')}`,
    fr: [{ n: 'x-7', d: 'x^2+3x', nt: ['(x-7)'], dt: [['x', '0'], ['(x+3)', '-3']] }, { n: '4x+12', d: '14-2x', nt: ['4', '(x+3)'], dt: ['2', ['(7-x)', '7']] }],
    head: 'x\\ne', npv: ['0', '-3', '7'],
    capF: `<b>Step 1 · Factor</b>: ${T('x(x+3)')}, ${T('4(x+3)')}, and ${T('14-2x=2(7-x)')}.`,
    flips: [{ from: '(7-x)', mid: '-(x-7)', to: '(x-7)', cap: `${T('(7-x)')} is the <b>opposite</b> of ${T('(x-7)')}. Flip it: ${T('7-x=-(x-7)')}. Now the two can divide out.` }],
    cuts: [{ keys: ['(x-7)', '(x+3)'] }],
    ans: '\\dfrac{4}{-2x}=-\\dfrac{2}{x}', capM: `<b>Step 4 · Multiply</b> what is left: ${T('\\dfrac{4}{x\\cdot2\\cdot(-1)}=\\dfrac{4}{-2x}=-\\dfrac{2}{x}')}. NPVs: ${T('x\\ne0,\\ -3,\\ 7')}.` },
  e4b: { label: 'Example 4(b) check', ask: `Example 4(b): ${T('\\dfrac{9-a^2}{a^2+a-6}\\cdot\\dfrac{a^2-4a+4}{2a^2-6a}')}`,
    fr: [{ n: '9-a^2', d: 'a^2+a-6', nt: ['-1', '(a-3)', '(a+3)'], dt: [['(a+3)', '-3'], ['(a-2)', '2']] }, { n: 'a^2-4a+4', d: '2a^2-6a', nt: ['(a-2)', '(a-2)'], dt: [['2a', '0'], ['(a-3)', '3']] }],
    head: 'a\\ne', npv: ['-3', '2', '0', '3'],
    capF: `<b>Step 1 · Factor.</b> ${T('9-a^2')} has a negative leading coefficient: take out ${T('-1')} first, ${T('-(a^2-9)=-(a-3)(a+3)')}. And ${T('(a-2)^2=(a-2)(a-2)')}.`,
    cuts: [{ keys: ['(a-3)', '(a+3)', '(a-2)'] }],
    ans: '-\\dfrac{a-2}{2a}', capM: `<b>Step 4 · Multiply</b> what is left: ${T('\\dfrac{-1\\cdot(a-2)}{2a}=-\\dfrac{a-2}{2a}')}. NPVs: ${T('a\\ne-3,\\ 2,\\ 0,\\ 3')}.` }
};
const opp = tileDef('Opposite factors: flip, then divide out', OP);

/* =============================== Example 6: the rectangle, to scale =============================== */
const area = {
  title: 'The rectangle, drawn to scale', height: 456, capH: 92, minW: 900,
  ask: `Example 6: length ${T('\\dfrac{x^2-9}{4x}')} cm, width ${T('\\dfrac{8x^2}{x^2+x-6}')} cm, ${T('x>3')}. The area?`,
  make(stage, v, ex) {
    const W = ex.W, S = 30, OX = 60, OY = 62;   // 30 px per cm
    const Lf = (x) => (x * x - 9) / (4 * x), Wf = (x) => (8 * x * x) / (x * x + x - 6), Af = (x) => (2 * x * (x - 3)) / (x - 2);
    const f2 = (n) => (Math.abs(n) < 5e-3 ? '0' : n.toFixed(2)).replace('-', '−'), f3 = (n) => String(Math.round(n * 1000) / 1000).replace('-', '−');
    const x6 = 6, r3 = 2 * Math.sqrt(3);
    const rect = hide(div(stage, 'u6l3-arect', '', OX, OY, 10, 10));
    const lTop = hide(div(stage, 'u6l3-alab u6l3-alab-l', '', OX, OY - 36));
    const lSide = hide(div(stage, 'u6l3-alab u6l3-alab-w', '', OX + 10, OY));
    const gone = hide(div(stage, 'u6l3-agone', '', OX - 40, OY + 40, 300));
    const PX = 470, P = div(stage, 'u6l3-apanel', '', PX, 6, W - PX - 8);
    const p1 = hide(h('div', 'u6l3-aln', T('\\begin{aligned}A&=\\dfrac{x^2-9}{4x}\\cdot\\dfrac{8x^2}{x^2+x-6}\\\\[4pt]&=\\dfrac{(x-3)(x+3)}{4x}\\cdot\\dfrac{8x^2}{(x+3)(x-2)}\\end{aligned}')));
    const p2 = hide(h('div', 'u6l3-aln u6l3-aln-key', `${T('A=\\dfrac{2x(x-3)}{x-2}')} <span class="u6l3-amut">${T('x\\ne0,\\ -3,\\ 2')}</span>`));
    const rd = hide(h('div', 'u6l3-ard'));
    const p3 = hide(h('div', 'u6l3-aln u6l3-aln-ex', `${T('x=2\\sqrt{3}')}: ${T('A=3\\sqrt{3}-3\\approx2.20')} cm²`));
    P.append(p1, p2, rd, p3);
    const sl = hide(h('div', 'u6l3-aslide no-ink', `<span>${T('x')}</span><input type="range" min="2.2" max="16" step="0.01" value="6" aria-label="the value of x" disabled><b></b>`)); P.appendChild(sl);
    const inp = sl.querySelector('input'), xv = sl.querySelector('b');
    function upd(x) {
      const L = Lf(x), Wd = Wf(x), A1 = L * Wd, A2 = Af(x), ok = x > 3 + 1e-9;
      if (ok) {
        const w = Math.max(2, L * S), hh = Math.min(366, Wd * S);
        box(rect, w, hh); rect.style.visibility = 'visible';
        lTop.innerHTML = `length <b>${f3(L)}</b>`; lTop.style.left = OX + w / 2 + 'px';
        lSide.innerHTML = `width <b>${f3(Wd)}</b>`; lSide.style.left = OX + w + 12 + 'px'; lSide.style.top = OY + hh / 2 - 14 + 'px';
        gone.style.visibility = 'hidden';
      } else {
        rect.style.visibility = 'hidden';
        lTop.innerHTML = `length <b class="u6l3-bad">${f3(L)}</b>`; lTop.style.left = OX + 60 + 'px';
        lSide.innerHTML = ''; gone.style.visibility = 'visible';
        gone.innerHTML = x > 2 ? `${Math.abs(L) < 5e-3 ? 'The length is <b>0</b>' : 'The length is <b>negative</b>'}: no rectangle! The context needs ${T('x>3')}.` : '';
      }
      rd.innerHTML = `<div class="u6l3-ax">${T('x')} = <b>${f3(x)}</b></div>`
        + `<div>length × width = ${ok ? `${f3(L)} × ${f3(Wd)} = <b>${f2(A1)}</b>` : '<span class="u6l3-bad">no rectangle</span>'}</div>`
        + `<div>${T('\\tfrac{2x(x-3)}{x-2}')} = <b>${f2(A2)}</b> ${ok ? '<span class="u6l3-ok">✓ same</span>' : ''}</div>`;
      xv.textContent = f3(x).replace(/(\.\d\d)\d$/, '$1');
    }
    upd(x6);
    let cur = x6;
    inp.addEventListener('input', () => { cur = Number(inp.value); upd(cur); });
    const slide = (c, a, b, ms) => tween(c, ms, (t) => { cur = a + (b - a) * t; upd(cur); });
    return [
      { cap: `The rectangle for ${T('x=6')}, drawn to scale: length ${T('\\tfrac{36-9}{24}=1.125')} cm, width ${T('\\tfrac{288}{36}=8')} cm.`,
        run: async (c) => { await show(c, rect); await show(c, lTop); await show(c, lSide); } },
      { cap: `Area = length × width. Factor, state the NPVs, divide out ${T('(x+3)')}: ${T('A=\\dfrac{8x^2(x-3)}{4x(x-2)}=\\dfrac{2x(x-3)}{x-2}')}.`,
        run: async (c) => { await show(c, p1); await show(c, p2); } },
      { cap: `Check ${T('x=6')}: length × width ${T('=1.125\\times8=9')}, and ${T('\\dfrac{2(6)(3)}{6-2}=9')}. The same area ✓`,
        run: (c) => show(c, rd) },
      { cap: `Let ${T('x')} shrink toward 3: the length gets shorter and shorter. At ${T('x=3')} it is ${T('0')}, and below 3 it is negative. That is why the context needs ${T('x>3')}.`,
        run: async (c) => { await slide(c, x6, 3, 1800); upd(3); cur = 3; await show(c, gone); } },
      { cap: `${T('x=2\\sqrt{3}\\approx3.46')}, just above 3: a thin rectangle with area ${T('3\\sqrt{3}-3\\approx2.20')} cm² (Example 6(b)). Now drag ${T('x')} yourself.`,
        run: async (c) => { await slide(c, 3, r3, 900); upd(r3); cur = r3; inp.value = r3; await show(c, p3); await show(c, sl); inp.disabled = false; } }
    ];
  }
};

/* =============================== Stand Up Break =============================== */
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const sgn = (k) => (k < 0 ? '-' : '+');
const bin = (a, X = 'x') => `(${X}${sgn(a)}${Math.abs(a)})`;
const binNP = (a, X = 'x') => `${X}${sgn(a)}${Math.abs(a)}`;
/** TeX of x^2 + bx + c */
const tri = (b, c, X = 'x') => `${X}^2${b ? `${sgn(b)}${Math.abs(b) === 1 ? '' : Math.abs(b)}${X}` : ''}${c ? `${sgn(c)}${Math.abs(c)}` : ''}`;
/** TeX of k·X + k·a (k > 0) */
const linK = (k, a, X = 'x') => `${k === 1 ? '' : k}${X}${sgn(k * a)}${Math.abs(k * a)}`;
/** monomial TeX: coefficient (> 0) and [[letter, power]…] (powers ≤ 0 are left out) */
const mono = (k, vs) => { const v = vs.filter(([, p]) => p > 0).map(([l, p]) => (p === 1 ? l : `${l}^${p}`)).join(''); return (k === 1 && v ? '' : String(k)) + v; };
standup('u6l3', {
  intro: 'At your whiteboard: factor everything, write the NPVs, divide out the common factors, then multiply what is left.',
  levels: {
    BEG: (r) => { // monomials
      const k1 = r.pick([2, 3, 4, 6, 8, 9, 10, 12]), k2 = r.pick([3, 5, 7, 9, 14, 15]), k3 = r.pick([2, 4, 5, 6, 10, 12, 15]), k4 = r.pick([3, 4, 8, 9, 10, 21]);
      const neg = r.chance(0.35), p1 = r.int(2, 5), q1 = r.int(1, 3), q2 = r.int(2, 5), p2 = r.int(1, 4);
      const N = k1 * k3, D = k2 * k4, g = gcd(N, D), n = N / g, dd = D / g, ex = p1 - p2, ey = q2 - q1;
      const top = mono(n, [['x', ex], ['y', ey]]), bot = mono(dd, [['x', -ex], ['y', -ey]]);
      const res = (neg ? '-' : '') + (bot === '1' ? top : `\\dfrac{${top}}{${bot}}`);
      return { text: 'Simplify. State the non-permissible values.',
        q: `\\dfrac{${neg ? '-' : ''}${mono(k1, [['x', p1]])}}{${mono(k2, [['y', q1]])}}\\cdot\\dfrac{${mono(k3, [['y', q2]])}}{${mono(k4, [['x', p2]])}}`,
        a: [`=\\dfrac{${neg ? '-' : ''}${mono(N, [['x', p1], ['y', q2]])}}{${mono(D, [['x', p2], ['y', q1]])}}=${res}`, 'x\\ne0,\\ y\\ne0'] };
    },
    PRG: (r) => { // trinomial over a difference of squares
      let p, t, s; do { p = r.int(1, 7); t = r.sign() * r.int(1, 8); s = r.sign() * r.int(1, 6); } while ([p, -p].includes(t) || [p, -p, t].includes(s));
      let m, n; do { m = r.int(2, 6); n = r.int(2, 6); } while (m === n);
      const g = gcd(m, n), mm = m / g, nn = n / g;
      const res = `\\dfrac{${mm === 1 ? binNP(t) : mm + bin(t)}}{${nn === 1 ? binNP(-p) : nn + bin(-p)}}`;
      return { text: 'Simplify. State the non-permissible values.',
        q: `\\dfrac{${tri(p + t, p * t)}}{${linK(n, s)}}\\cdot\\dfrac{${linK(m, s)}}{x^2-${p * p}}`,
        a: [`=\\dfrac{${bin(p)}${bin(t)}}{${n}${bin(s)}}\\cdot\\dfrac{${m}${bin(s)}}{${bin(-p)}${bin(p)}}`, `x\\ne${-s},\\ ${p},\\ ${-p}`, `=${res}`] };
    },
    MAS: (r) => { // an opposite factor
      let u, v, w, s; do { u = r.sign() * r.int(1, 7); v = r.sign() * r.int(1, 7); w = r.sign() * r.int(1, 7); s = r.int(1, 9); } while (new Set([u, v, w]).size < 3 || [-u, -v, -w].includes(s));
      const m = r.pick([1, 2, 3, 4, 5]), mT = m === 1 ? '' : String(m);
      return { text: 'Simplify. State the non-permissible values.',
        q: `\\dfrac{${s}-x}{${tri(u + v, u * v)}}\\cdot\\dfrac{${tri(u + w, u * w)}}{${linK(m, -s)}}`,
        a: [`=\\dfrac{-${bin(-s)}}{${bin(u)}${bin(v)}}\\cdot\\dfrac{${bin(u)}${bin(w)}}{${mT}${bin(-s)}}`, `x\\ne${-u},\\ ${-v},\\ ${s}`, `=-\\dfrac{${binNP(w)}}{${m === 1 ? binNP(v) : mT + bin(v)}}`] };
    }
  }
});

/* =============================== mount =============================== */
export const explainers = mountExplainers({ pairOff, tiles, opp, area });
export const _test = { PO, TL, OP, tri, linK, mono };
