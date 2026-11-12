/* Math 20-1 · Unit 6 · Lesson 5 — Adding and Subtracting with Monomial Denominators.
 * New lesson format (2026-11-11): the warm-up is plain markup on the page (no code). Explainers:
 *   sameDen (same denominator, step by step: NPV pinned first, the second numerator in brackets, the minus flips
 *     every term in the bracket, factor and cancel, and the pinned NPV joins the answer; Example 3(b)–(d)),
 *   lcdBuild (STAR: the LCD builder. Each denominator is broken into factor tiles in columns (2s, 3s, x, y …); the
 *     row with the most of each factor sends its tiles down to the LCD row; then each denominator "puts on" the
 *     tiles it is missing, which is the multiplier for its top and bottom; key idea 6x²y, 4xy³ with Example 4(e)(f),
 *     and Example 4(a)–(d)),
 *   monoAdd (the five-step procedure for different monomial denominators, step numbers beside each step;
 *     Example 5(c), 6(b), 6(c), 6(d)),
 *   subCheck (STAR: the substitution test. The question, the student's answer and the corrected answer side by
 *     side; a number that is not an NPV goes into each; verdict stamps ERROR / CHECKS OUT, and a "SAME?" that a
 *     second number exposes; Kayla 7(c), Diego 7(d), cancelling terms),
 *   hike (Example 8: the hiker climbs and descends in step with a clock and a time bar; 9/v + 15/(2v) = 33/(2v)).
 * Colours: multipliers (what a denominator is missing) amber, minus/brackets and errors red, NPVs purple,
 *   answers green, first variable blue, second variable purple. Calculator allowed (Ryan's 20-1 policy). */
import { h, tex, add, box, mountExplainers, pop, fadeIn, sleep, anim, pulse, stamp, stampIn, tween, COLORS } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const AM = COLORS.amber, RD = COLORS.red, GR = COLORS.green, PU = COLORS.purple;
const ca = (s) => `\\textcolor{${AM}}{${s}}`, cr = (s) => `\\textcolor{${RD}}{${s}}`;
const md = (s) => (typeof s === 'string' ? s.replace(/\$([^$]+)\$/g, (_, t) => T(t)) : s);
function mdDef(def) {
  const mk = def.make, a = def.ask;
  def.make = function (stage, v, ex) { return (mk.call(this, stage, v, ex) || []).map((st) => Object.assign(st, { cap: typeof st.cap === 'string' ? md(st.cap) : st.cap })); };
  if (typeof a === 'function') def.ask = (v) => md(a(v)); else if (typeof a === 'string') def.ask = md(a);
  return def;
}
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); return add(host, d, x, y); };
const show = (c, el, ms = 320) => fadeIn(c, el, ms);
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const lcm = (a, b) => (a / gcd(a, b)) * b;

/* a row of working: [step badge] [label] [math] [note] */
function rowEl(stage, o, it, i) {
  const r = div(stage, 'u6l5-row' + (it.ans ? ' u6l5-ans' : ''), '', o.x, o.y + i * o.gap, o.w, o.gap - 6);
  const b = h('span', 'u6l5-num', it.n != null ? String(it.n) : it.ans ? '✓' : '');
  if ((it.n == null && !it.ans) || it.cont) b.style.visibility = 'hidden';
  const l = h('span', 'u6l5-lab', it.cont ? '' : it.lab || '');
  r.append(b, l);
  const m = h('span', 'u6l5-m');
  if (it.flip) {
    const F = it.flip, top = h('span', 'u6l5-ft'), toks = [];
    F.keep.forEach((t) => top.appendChild(h('span', 'u6l5-tk', T('{}' + t))));
    F.neg.forEach((t) => { const k = h('span', 'u6l5-tk u6l5-neg', T('{}' + cr(t))); toks.push(k); top.appendChild(k); });
    const fr = h('span', 'u6l5-fr'); fr.append(top, h('span', 'u6l5-fb', T(F.den)));
    m.appendChild(fr); r.flipToks = toks;
  } else m.innerHTML = T(it.m);
  r.appendChild(m);
  if (it.note) r.appendChild(h('span', 'u6l5-note', md(it.note)));
  r.mathEl = m;
  return hide(r);
}
async function showRow(c, r) {
  if (r.flipToks) { r.flipToks.forEach(hide); await show(c, r); for (const k of r.flipToks) await anim(c, k, [{ opacity: 0, transform: 'rotateX(90deg) scale(1.3)' }, { opacity: 1, transform: 'none' }], 420); }
  else await show(c, r);
}

/* =============================== explainer: same denominator =============================== */
const SD = {
  e3b: { label: 'Example 3(b) check', ask: 'Example 3(b): simplify $\\dfrac{4a+1}{3a}-\\dfrac{a-5}{3a}$. State the NPVs.', npv: 'a\\ne0', rows: [
    { n: 1, lab: 'NPVs', m: '3a\\ne0', note: 'so $a\\ne0$', pin: true, cap: '<b>NPVs first.</b> The denominator $3a$ is $0$ when $a=0$, so $a\\ne0$. Pin it: it stays to the end.' },
    { n: 2, lab: 'Combine', m: `\\dfrac{4a+1${cr('-(a-5)')}}{3a}`, cap: 'Same denominator: subtract the numerators and keep $3a$. The second numerator goes in <b>brackets</b>.' },
    { n: 3, lab: 'Expand', flip: { keep: ['4a', '+1'], neg: ['-a', '+5'], den: '3a' }, cap: 'The minus hits <b>every</b> term in the bracket: $-(a-5)=-a+5$. The $-5$ becomes $+5$.' },
    { n: 4, lab: 'Collect', m: '\\dfrac{3a+6}{3a}', cap: 'Collect like terms: $4a-a=3a$ and $1+5=6$.' },
    { n: 5, lab: 'Factor', m: '\\dfrac{3(a+2)}{3a}=\\dfrac{\\cancel{3}(a+2)}{\\cancel{3}a}', cap: 'Factor the numerator and cancel the common <b>factor</b> $3$.' },
    { ans: true, m: '\\dfrac{a+2}{a}', npvJoin: true, cap: 'Answer: $\\dfrac{a+2}{a}$, and the pinned NPV comes with it: $a\\ne0$.' }] },
  e3c: { label: 'Example 3(c) check', ask: 'Example 3(c): simplify $\\dfrac{5m-2}{m+4}-\\dfrac{2m-14}{m+4}$. State the NPVs.', npv: 'm\\ne-4', rows: [
    { n: 1, lab: 'NPVs', m: 'm+4\\ne0', note: 'so $m\\ne-4$', pin: true, cap: '<b>NPVs first.</b> $m+4=0$ when $m=-4$, so $m\\ne-4$. Pin it.' },
    { n: 2, lab: 'Combine', m: `\\dfrac{5m-2${cr('-(2m-14)')}}{m+4}`, cap: 'Subtract the numerators over the same denominator, with the second one in <b>brackets</b>.' },
    { n: 3, lab: 'Expand', flip: { keep: ['5m', '-2'], neg: ['-2m', '+14'], den: 'm+4' }, cap: 'The minus flips both terms: $-(2m-14)=-2m+14$.' },
    { n: 4, lab: 'Collect', m: '\\dfrac{3m+12}{m+4}', cap: '$5m-2m=3m$ and $-2+14=12$.' },
    { n: 5, lab: 'Factor', m: '\\dfrac{3(m+4)}{m+4}=\\dfrac{3\\cancel{(m+4)}}{\\cancel{m+4}}', cap: 'Factor out $3$: the numerator has the factor $(m+4)$, the same as the denominator. Cancel it.' },
    { ans: true, m: '3', npvJoin: true, cap: 'The answer is just $3$, but the original is still undefined at $m=-4$: the NPV <b>stays</b>. $3,\\ m\\ne-4$.' }] },
  e3d: { label: 'Example 3(d) check', ask: 'Example 3(d): simplify $\\dfrac{x^2}{x-3}-\\dfrac{9}{x-3}$. State the NPVs.', npv: 'x\\ne3', rows: [
    { n: 1, lab: 'NPVs', m: 'x-3\\ne0', note: 'so $x\\ne3$', pin: true, cap: '<b>NPVs first.</b> $x-3=0$ when $x=3$, so $x\\ne3$. Pin it.' },
    { n: 2, lab: 'Combine', m: '\\dfrac{x^2-9}{x-3}', cap: 'Subtract the numerators. The second numerator is a single term, $9$, so the minus just goes in front of it.' },
    { n: 3, lab: 'Factor', m: '\\dfrac{(x-3)(x+3)}{x-3}', cap: '$x^2-9$ is a difference of squares: $(x-3)(x+3)$.' },
    { n: 4, lab: 'Cancel', m: '\\dfrac{\\cancel{(x-3)}(x+3)}{\\cancel{x-3}}', cap: 'Cancel the common factor $(x-3)$.' },
    { ans: true, m: 'x+3', npvJoin: true, cap: 'The factor that made the NPV is gone, but the NPV <b>stays</b>: $x+3,\\ x\\ne3$.' }] }
};
const sameDen = {
  capH: 100,
  title: 'Same denominator: brackets, and the NPV stays',
  height: 410, minW: 920,
  choices: Object.keys(SD).map((k) => ({ v: k, label: SD[k].label })),
  ask: (v) => SD[v].ask,
  make(stage, v, ex) {
    const d = SD[v], W = ex.W, o = { x: 14, y: 12, gap: 66, w: W - 270 };
    const pin = hide(div(stage, 'u6l5-pin', `<span class="u6l5-pin-h">📌 NPV</span>${T(d.npv)}`, W - 230, 16));
    const rows = d.rows.map((it, i) => rowEl(stage, o, it, i));
    return d.rows.map((it, i) => ({ cap: it.cap, run: async (c) => {
      const r = rows[i];
      await showRow(c, r);
      if (it.pin) { await sleep(c, 150); pin.style.opacity = 1; await pop(c, pin, 420); }
      if (it.npvJoin) {
        const tag = h('span', 'u6l5-npvj', T(',\\ ' + d.npv)); r.mathEl.appendChild(tag);
        await pulse(c, pin, 1.12, 420);
        await anim(c, tag, [{ opacity: 0, transform: 'translate(120px,-40px) scale(.7)' }, { opacity: 1, transform: 'none' }], 560);
        await pulse(c, r, 1.03, 360);
      }
    } }));
  }
};

/* =============================== explainer: the LCD builder =============================== */
const LB = {
  key: { label: 'Key idea → Example 4(e)(f)', ask: 'Find the LCD of $6x^2y$ and $4xy^3$, then rewrite $\\dfrac{5}{6x^2y}$ and $\\dfrac{3}{4xy^3}$ over it.',
    terms: [{ num: '5', den: '6x^2y', f: { 2: 1, 3: 1, x: 2, y: 1 } }, { num: '3', den: '4xy^3', f: { 2: 2, x: 1, y: 3 } }], lcd: '12x^2y^3' },
  e4a: { label: 'Example 4(a) check', ask: 'Example 4(a): determine the LCD of $5x$ and $3x^2$.',
    terms: [{ den: '5x', f: { 5: 1, x: 1 } }, { den: '3x^2', f: { 3: 1, x: 2 } }], lcd: '15x^2' },
  e4b: { label: 'Example 4(b) check', ask: 'Example 4(b): determine the LCD of $8a$ and $12b$.',
    terms: [{ den: '8a', f: { 2: 3, a: 1 } }, { den: '12b', f: { 2: 2, 3: 1, b: 1 } }], lcd: '24ab' },
  e4c: { label: 'Example 4(c) check', ask: 'Example 4(c): determine the LCD of $6m^2n$ and $9mn^3$.',
    terms: [{ den: '6m^2n', f: { 2: 1, 3: 1, m: 2, n: 1 } }, { den: '9mn^3', f: { 3: 2, m: 1, n: 3 } }], lcd: '18m^2n^3' },
  e4d: { label: 'Example 4(d) check', ask: 'Example 4(d): determine the LCD of $2x$, $4$ and $x^3$.',
    terms: [{ den: '2x', f: { 2: 1, x: 1 } }, { den: '4', f: { 2: 2 } }, { den: 'x^3', f: { x: 3 } }], lcd: '4x^3' }
};
const isNum = (b) => /^\d+$/.test(b);
/** a monomial from factor counts: { 2: 1, y: 2 } → "2y^2" */
function mono(f, bases) {
  let k = 1, s = '';
  for (const b of bases) { const n = f[b] || 0; if (!n) continue; if (isNum(b)) k *= Number(b) ** n; else s += b + (n > 1 ? '^' + n : ''); }
  return (k === 1 && s ? '' : String(k)) + s;
}
const coef = (f, bases) => bases.filter(isNum).reduce((k, b) => k * Number(b) ** (f[b] || 0), 1);
const powWord = (n) => ['', 'one', 'two', 'three', 'four'][n] || String(n);
const lcdBuild = {
  capH: 100,
  title: 'The LCD builder',
  height: 430, minW: 920,
  choices: Object.keys(LB).map((k) => ({ v: k, label: LB[k].label })),
  ask: (v) => LB[v].ask,
  make(stage, v, ex) {
    const d = LB[v], W = ex.W, terms = d.terms, nT = terms.length;
    const all = new Set(); terms.forEach((t) => Object.keys(t.f).forEach((b) => all.add(b)));
    const bases = [...all].sort((a, b) => (isNum(a) && isNum(b) ? a - b : isNum(a) ? -1 : isNum(b) ? 1 : a < b ? -1 : 1));
    const max = {}; bases.forEach((b) => { max[b] = Math.max(...terms.map((t) => t.f[b] || 0)); });
    const lcdT = mono(max, bases);
    if (lcdT !== d.lcd) console.warn('u6l5 lcdBuild: computed LCD', lcdT, 'expected', d.lcd);
    const vars = bases.filter((b) => !isNum(b));
    const TW = 46, TG = 6, GG = 22, X0 = 214, RH = terms.some((t) => t.num) ? 88 : 62, Y0 = 46;
    const gx = {}; let x = X0;
    bases.forEach((b) => { gx[b] = x; x += max[b] * (TW + TG) - TG + GG; });
    const xEnd = x - GG, RX = Math.max(xEnd + 30, 640);
    const rowY = (i) => Y0 + i * RH, lcdY = Y0 + nT * RH + 26;
    const tcls = (b) => (isNum(b) ? 'u6l5-tn' : b === vars[0] ? 'u6l5-tv1' : 'u6l5-tv2');
    const tile = (b, cls, xx, yy) => div(stage, 'u6l5-tile ' + tcls(b) + (cls ? ' ' + cls : ''), T(b), xx, yy, TW, TW);
    // column headers and bands
    bases.forEach((b) => {
      const w = max[b] * (TW + TG) - TG;
      div(stage, 'u6l5-band', '', gx[b] - 6, Y0 - 8, w + 12, lcdY + TW + 8 - (Y0 - 8));
      div(stage, 'u6l5-colh', isNum(b) ? `${b}s` : T(b), gx[b] - 6, 12, w + 12, 26);
    });
    // term rows
    const rows = terms.map((t, i) => {
      const lab = div(stage, 'u6l5-tlab', T(t.num ? `\\dfrac{${t.num}}{${t.den}}` : t.den), 14, rowY(i) - (t.num ? 18 : 0), 180, t.num ? 82 : TW);
      const tiles = [];
      bases.forEach((b) => { for (let k = 0; k < (t.f[b] || 0); k++) tiles.push(hide(tile(b, '', gx[b] + k * (TW + TG), rowY(i)))); });
      const miss = {}; bases.forEach((b) => { miss[b] = max[b] - (t.f[b] || 0); });
      const ghosts = [];
      bases.forEach((b) => { for (let k = t.f[b] || 0; k < max[b]; k++) ghosts.push(hide(tile(b, 'u6l5-put', gx[b] + k * (TW + TG), rowY(i)))); });
      const mult = mono(miss, bases), none = !ghosts.length;
      const mx = hide(div(stage, 'u6l5-mult', none ? 'nothing missing' : `${T('\\times\\,' + ca(mult))}`, RX, rowY(i) + 4));
      return { t, lab, tiles, ghosts, mult, none, mx };
    });
    div(stage, 'u6l5-sep', '', 14, lcdY - 14, W - 28, 2);
    const lcdLab = div(stage, 'u6l5-tlab u6l5-lcdlab', 'LCD', 14, lcdY, 180, TW);
    const lcdOut = hide(div(stage, 'u6l5-lcdout', T('=' + lcdT), RX, lcdY + 2));
    const lcdTiles = {}; bases.forEach((b) => { lcdTiles[b] = []; for (let k = 0; k < max[b]; k++) lcdTiles[b].push(hide(tile(b, 'u6l5-lt', gx[b] + k * (TW + TG), lcdY))); });
    const fly = async (c, b) => {
      const src = terms.findIndex((t) => (t.f[b] || 0) === max[b]), srcTiles = rows[src].tiles.filter((e) => e.dataset.b === b);
      srcTiles.forEach((e) => e.classList.add('u6l5-hot'));
      await Promise.all(srcTiles.map((e) => pulse(c, e, 1.15, 380)));
      const dy = rowY(src) - lcdY;
      await Promise.all(lcdTiles[b].map((e, k) => anim(c, e, [{ opacity: .9, transform: `translateY(${dy}px)` }, { opacity: 1, transform: 'none' }], 560, { delay: k * 90 })));
      srcTiles.forEach((e) => e.classList.remove('u6l5-hot'));
    };
    rows.forEach((R) => { let k = 0; bases.forEach((b) => { for (let j = 0; j < (R.t.f[b] || 0); j++) R.tiles[k++].dataset.b = b; }); });
    const steps = [];
    // 1. factor tiles
    const facTex = (t) => { const p = []; bases.forEach((b) => { for (let k = 0; k < (t.f[b] || 0); k++) p.push(b); }); return p.join('\\cdot ') || '1'; };
    steps.push({ cap: 'Break each denominator into factors: ' + terms.map((t) => `$${t.den}=${facTex(t)}$`).join(', ') + '.',
      run: async (c) => { for (const R of rows) { await Promise.all(R.tiles.map((e, k) => anim(c, e, [{ opacity: 0, transform: 'scale(.4)' }, { opacity: 1, transform: 'none' }], 300, { delay: k * 50 }))); } } });
    // 2. numbers
    const nums = bases.filter(isNum);
    if (nums.length) {
      const coefs = terms.map((t) => coef(t.f, bases)).filter((k) => k > 1), L = coef(max, bases);
      const most = nums.map((b) => { const src = terms.find((t) => (t.f[b] || 0) === max[b]); return `${powWord(max[b])} ${b}${max[b] > 1 ? 's' : ''} (from $${src.den}$)`; });
      steps.push({ cap: `<b>Numbers:</b> take the most of each prime in any one denominator: ${most.join(' and ')}. That makes $${L}$, the LCM of ${coefs.join(' and ')}.`,
        run: async (c) => { for (const b of nums) await fly(c, b); } });
    }
    // 3. each variable
    vars.forEach((b) => {
      const src = terms.find((t) => (t.f[b] || 0) === max[b]), p = b + (max[b] > 1 ? '^' + max[b] : '');
      const pw = (k) => b + (k > 1 ? '^' + k : '');
      const others = terms.filter((t) => t !== src && t.f[b]).map((t) => `$${pw(t.f[b])}$ in $${t.den}$`);
      steps.push({ cap: `<b>Highest power of $${b}$:</b> $${p}$, from $${src.den}$.` + (others.length ? ` The ${others.join(' and the ')} ${others.length > 1 ? 'fit' : 'fits'} inside $${p}$.` : ''), run: (c) => fly(c, b) });
    });
    steps.push({ cap: `So the <b>LCD is $${lcdT}$</b>: every denominator fits inside it.`, run: async (c) => { await pop(c, lcdOut, 420); await pulse(c, lcdLab, 1.1, 360); } });
    // 4. what each is missing
    rows.forEach((R) => {
      const cap = R.none ? `$${R.t.den}$ already is the LCD: it is missing nothing (multiply by $1$).`
        : `What is $${R.t.den}$ missing? The amber tiles: $${R.mult}$. It <b>puts on</b> $${R.mult}$: $${R.t.den}\\times ${R.mult}=${lcdT}$.`;
      steps.push({ cap, run: async (c) => {
        for (const g of R.ghosts) { g.style.opacity = 1; await anim(c, g, [{ opacity: 0, transform: 'translateX(60px) scale(.6)' }, { opacity: 1, transform: 'none' }], 340); }
        await pop(c, R.mx, 380);
      } });
    });
    // 5. the equivalent fractions (when there are numerators)
    if (terms.every((t) => t.num)) {
      const eq = terms.map((t, i) => `\\dfrac{${t.num}}{${t.den}}=\\dfrac{${t.num}${ca('\\cdot ' + rows[i].mult)}}{${t.den}${ca('\\cdot ' + rows[i].mult)}}=\\dfrac{${multTex(t.num, rows[i].mult)}}{${lcdT}}`);
      const band = hide(div(stage, 'u6l5-eqband', eq.map((s) => `<span>${T(s)}</span>`).join(''), 14, lcdY + TW + 18, W - 28, 92));
      steps.push({ cap: `Multiply the <b>numerator too</b>: ${terms.map((t, i) => `$\\dfrac{${t.num}}{${t.den}}=\\dfrac{${multTex(t.num, rows[i].mult)}}{${lcdT}}$`).join(' and ')}. That is Example 4(e) and (f).`,
        run: (c) => show(c, band, 420) });
    }
    return steps;
  }
};
/** numerator × monomial, for a number numerator: 5 × 2y^2 → 10y^2 */
function multTex(num, mult) {
  const m = /^(\d*)(.*)$/.exec(mult), k = (m[1] ? Number(m[1]) : 1) * Number(num);
  return (k === 1 && m[2] ? '' : String(k)) + m[2];
}

/* =============================== explainer: different monomial denominators =============================== */
const MA = {
  e5c: { label: 'Example 5(c) check', ask: 'Example 5(c): simplify $\\dfrac{5}{6m^2n}-\\dfrac{7}{9mn^3}$. State the NPVs.', rows: [
    { n: 1, lab: 'NPVs', m: 'm\\ne0,\\ n\\ne0', cap: '<b>1. NPVs.</b> Each variable in a monomial denominator can’t be $0$: $m\\ne0$, $n\\ne0$.' },
    { n: 2, lab: 'LCD', m: '18m^2n^3', note: 'LCM of 6 and 9; $m^2$; $n^3$', cap: '<b>2. LCD.</b> The LCM of $6$ and $9$ is $18$; the highest powers are $m^2$ and $n^3$.' },
    { n: 3, lab: 'Rewrite', m: `\\dfrac{5${ca('(3n^2)')}}{6m^2n${ca('(3n^2)')}}-\\dfrac{7${ca('(2m)')}}{9mn^3${ca('(2m)')}}`, cap: '<b>3. Rewrite</b> over the LCD: $6m^2n$ is missing $3n^2$, and $9mn^3$ is missing $2m$. Top and bottom.' },
    { n: 4, lab: 'Combine', m: '\\dfrac{15n^2-14m}{18m^2n^3}', cap: '<b>4. Combine</b> the numerators: $5(3n^2)=15n^2$ and $7(2m)=14m$.' },
    { n: 5, lab: 'Simplify', ans: true, m: '\\dfrac{15n^2-14m}{18m^2n^3},\\ m\\ne0,\\ n\\ne0', cap: '<b>5. Simplify.</b> $15n^2-14m$ has no common factor to cancel, so this is the answer.' }] },
  e6b: { label: 'Example 6(b) check', ask: 'Example 6(b): simplify $\\dfrac{2y-1}{4y}-\\dfrac{y-3}{6y^2}$. State the NPVs.', rows: [
    { n: 1, lab: 'NPVs', m: 'y\\ne0', cap: '<b>1. NPVs:</b> $y\\ne0$.' },
    { n: 2, lab: 'LCD', m: '12y^2', note: 'LCM of 4 and 6; $y^2$', cap: '<b>2. LCD:</b> the LCM of $4$ and $6$ is $12$, and the highest power of $y$ is $y^2$.' },
    { n: 3, lab: 'Rewrite', m: `\\dfrac{(2y-1)${ca('(3y)')}}{4y${ca('(3y)')}}-\\dfrac{(y-3)${ca('(2)')}}{6y^2${ca('(2)')}}`, cap: '<b>3. Rewrite:</b> $4y$ is missing $3y$, $6y^2$ is missing $2$. Multiply the <b>whole</b> numerator.' },
    { n: 4, lab: 'Combine', m: `\\dfrac{3y(2y-1)${cr('-2(y-3)')}}{12y^2}`, cap: '<b>4. Combine</b> over $12y^2$. The minus belongs to all of $2(y-3)$.' },
    { n: 4, cont: true, m: '=\\dfrac{6y^2-3y-2y+6}{12y^2}', cap: 'Expand: $3y(2y-1)=6y^2-3y$, and $-2(y-3)=-2y+6$.' },
    { n: 5, lab: 'Simplify', ans: true, m: '=\\dfrac{6y^2-5y+6}{12y^2},\\ y\\ne0', cap: '<b>5. Collect:</b> $-3y-2y=-5y$. The numerator does not factor, so nothing cancels.' }] },
  e6c: { label: 'Example 6(c) check', ask: 'Example 6(c): simplify $\\dfrac{3a-b}{a^2b}-\\dfrac{a-2b}{ab^2}$. State the NPVs.', rows: [
    { n: 1, lab: 'NPVs', m: 'a\\ne0,\\ b\\ne0', cap: '<b>1. NPVs:</b> two variables, so $a\\ne0$ and $b\\ne0$.' },
    { n: 2, lab: 'LCD', m: 'a^2b^2', note: 'highest powers $a^2$, $b^2$', cap: '<b>2. LCD:</b> no numbers to worry about; the highest powers are $a^2$ and $b^2$.' },
    { n: 3, lab: 'Rewrite', m: `\\dfrac{(3a-b)${ca('b')}}{a^2b\\cdot${ca('b')}}-\\dfrac{(a-2b)${ca('a')}}{ab^2\\cdot${ca('a')}}`, cap: '<b>3. Rewrite:</b> $a^2b$ is missing a $b$; $ab^2$ is missing an $a$.' },
    { n: 4, lab: 'Combine', m: `\\dfrac{b(3a-b)${cr('-a(a-2b)')}}{a^2b^2}`, cap: '<b>4. Combine</b>, keeping the minus in front of all of $a(a-2b)$.' },
    { n: 4, cont: true, m: '=\\dfrac{3ab-b^2-a^2+2ab}{a^2b^2}', cap: 'Expand: $-a(a-2b)=-a^2+2ab$.' },
    { n: 5, lab: 'Simplify', ans: true, m: '=\\dfrac{-a^2+5ab-b^2}{a^2b^2},\\ a\\ne0,\\ b\\ne0', cap: '<b>5. Collect:</b> $3ab+2ab=5ab$. Nothing cancels.' }] },
  e6d: { label: 'Example 6(d) check', ask: 'Example 6(d): simplify $\\dfrac{x+6}{2x}-\\dfrac{x+9}{3x}$. State the NPVs.', rows: [
    { n: 1, lab: 'NPVs', m: 'x\\ne0', cap: '<b>1. NPVs:</b> $x\\ne0$.' },
    { n: 2, lab: 'LCD', m: '6x', cap: '<b>2. LCD:</b> the LCM of $2$ and $3$ is $6$: $6x$.' },
    { n: 3, lab: 'Rewrite', m: `\\dfrac{(x+6)${ca('(3)')}}{2x${ca('(3)')}}-\\dfrac{(x+9)${ca('(2)')}}{3x${ca('(2)')}}`, cap: '<b>3. Rewrite:</b> $2x$ is missing $3$, $3x$ is missing $2$.' },
    { n: 4, lab: 'Combine', m: `\\dfrac{3(x+6)${cr('-2(x+9)')}}{6x}`, cap: '<b>4. Combine</b>, with the minus in front of all of $2(x+9)$.' },
    { n: 4, cont: true, m: '=\\dfrac{3x+18-2x-18}{6x}', cap: 'Expand: $-2(x+9)=-2x-18$.' },
    { n: 5, lab: 'Simplify', ans: true, m: '=\\dfrac{x}{6x}=\\dfrac{1}{6},\\ x\\ne0', cap: '<b>5. Simplify:</b> the $18$s cancel, and $\\dfrac{x}{6x}=\\dfrac16$. No variable left, but the original is undefined at $x=0$, so $x\\ne0$ stays.' }] }
};
const monoAdd = {
  capH: 100,
  title: 'Different monomial denominators, step by step',
  height: 410, minW: 920,
  choices: Object.keys(MA).map((k) => ({ v: k, label: MA[k].label })),
  ask: (v) => MA[v].ask,
  make(stage, v, ex) {
    const d = MA[v], o = { x: 14, y: 10, gap: 66, w: ex.W - 28 };
    const rows = d.rows.map((it, i) => rowEl(stage, o, it, i));
    return d.rows.map((it, i) => ({ cap: it.cap, run: async (c) => { await showRow(c, rows[i]); if (it.ans) await pulse(c, rows[i], 1.03, 380); } }));
  }
};

/* =============================== explainer: the substitution test =============================== */
const SC = {
  kayla: { label: 'Kayla, Example 7(c)', ask: 'Example 7(c): Kayla wrote $\\dfrac{5}{2x}-\\dfrac{x-3}{2x}=\\dfrac{2-x}{2x}$. Test her answer with a number.',
    npv: 'x\\ne0', heads: ['The question', 'Kayla’s answer', 'Corrected answer'],
    e: ['\\dfrac{5}{2x}-\\dfrac{x-3}{2x}', '\\dfrac{2-x}{2x}', '\\dfrac{8-x}{2x}'],
    tests: [{ at: 'x=1', s: ['\\dfrac{5}{2}-\\dfrac{-2}{2}', '\\dfrac{2-1}{2}', '\\dfrac{8-1}{2}'], v: ['\\dfrac{7}{2}', '\\dfrac{1}{2}', '\\dfrac{7}{2}'] }],
    fix: 'Kayla’s error: the minus sign was not applied to $-3$. $5-(x-3)=5-x+3=8-x$, so the answer is $\\dfrac{8-x}{2x}$.' },
  diego: { label: 'Diego, Example 7(d)', ask: 'Example 7(d): Diego wrote $\\dfrac{2}{x}+\\dfrac{3}{y}=\\dfrac{5}{x+y}$. Test it with $x=1$ and $y=1$.',
    npv: 'x\\ne0,\\ y\\ne0', heads: ['The question', 'Diego’s answer', 'Corrected answer'],
    e: ['\\dfrac{2}{x}+\\dfrac{3}{y}', '\\dfrac{5}{x+y}', '\\dfrac{3x+2y}{xy}'],
    tests: [{ at: 'x=1,\\ y=1', s: ['\\dfrac{2}{1}+\\dfrac{3}{1}', '\\dfrac{5}{1+1}', '\\dfrac{3+2}{1}'], v: ['5', '\\dfrac{5}{2}', '5'] }],
    fix: 'Diego <b>added the denominators</b>. Use the LCD $xy$: $\\dfrac{2y}{xy}+\\dfrac{3x}{xy}=\\dfrac{3x+2y}{xy}$.' },
  cancel: { label: 'Cancelling terms', ask: 'Example 6(a) gave $\\dfrac{5x-8}{6x}$. A student kept going: “cancel the $x$s” to get $\\dfrac{5-8}{6}=-\\dfrac{1}{2}$. Test it.',
    npv: 'x\\ne0', heads: ['The question', 'The student’s answer', 'Corrected answer'],
    e: ['\\dfrac{x+2}{3x}+\\dfrac{x-4}{2x}', '-\\dfrac{1}{2}', '\\dfrac{5x-8}{6x}'],
    tests: [{ at: 'x=1', s: ['\\dfrac{3}{3}+\\dfrac{-3}{2}', '', '\\dfrac{5-8}{6}'], v: ['-\\dfrac{1}{2}', '-\\dfrac{1}{2}', '-\\dfrac{1}{2}'], same: true },
      { at: 'x=2', s: ['\\dfrac{4}{6}+\\dfrac{-2}{4}', '', '\\dfrac{10-8}{12}'], v: ['\\dfrac{1}{6}', '-\\dfrac{1}{2}', '\\dfrac{1}{6}'] }],
    fix: 'The $x$ in $5x-8$ is part of a <b>term</b>, not a factor of the whole numerator, so it can’t be cancelled. $\\dfrac{5x-8}{6x}$ was already the answer.' }
};
const subCheck = {
  capH: 100,
  title: 'The substitution test',
  height: 420, minW: 920,
  choices: Object.keys(SC).map((k) => ({ v: k, label: SC[k].label })),
  ask: (v) => SC[v].ask,
  make(stage, v, ex) {
    const d = SC[v], W = ex.W, cw = Math.floor((W - 48) / 3), nt = d.tests.length;
    const X = (j) => 12 + j * (cw + 12);
    const cols = [0, 1, 2].map((j) => {
      const card = div(stage, 'u6l5-col u6l5-col' + j, '', X(j), 10, cw, 400);
      const hd = div(stage, 'u6l5-colhd', d.heads[j], X(j), 18, cw, 30);
      const e = div(stage, 'u6l5-cole', T(d.e[j]), X(j), 54, cw, 84);
      const at = d.tests.map((te, k) => hide(div(stage, 'u6l5-at', T(te.at), X(j) + 12, 148 + k * 100)));
      const t = d.tests.map((te, k) => hide(div(stage, 'u6l5-colt', (te.s[j] ? T(te.s[j] + '=') : '') + `<b class="u6l5-val">${T(te.v[j])}</b>`, X(j), 178 + k * 100, cw, 62)));
      return { card, hd, e, t, at };
    });
    const ats = d.tests.map((te, k) => [cols[0].at[k], cols[1].at[k]]);
    [cols[2].card, cols[2].hd, cols[2].e, ...cols[2].at].forEach(hide);
    const sy = nt > 1 ? 384 : 318;
    const stW = stamp(stage, 'ERROR', { ok: false, x: X(1) + cw / 2, y: sy, rotate: -8 }); hide(stW);
    const stS = nt > 1 ? hide(stamp(stage, 'SAME?', { ok: null, x: X(1) + cw / 2, y: sy, rotate: 6 })) : null;
    const stC = stamp(stage, '✓ CHECKS OUT', { ok: true, x: X(2) + cw / 2, y: sy, rotate: -6 }); hide(stC);
    const steps = [];
    d.tests.forEach((te, k) => {
      const last = k === nt - 1;
      steps.push({ cap: k === 0 ? `Pick a number that is <b>not an NPV</b> ($${d.npv}$). Try $${te.at}$.`
        : `With $x=1$, crossing out an $x$ changes nothing, so the mistake hides. Try another number: $${te.at}$.`,
      run: async (c) => { await Promise.all(ats[k].map((e) => pop(c, e, 380))); if (k > 0 && stS) await anim(c, stS, [{ opacity: 1 }, { opacity: 0 }], 300); } });
      steps.push({ cap: `Put $${te.at}$ into the <b>question</b>: ${te.s[0] ? `$${te.s[0]}=${te.v[0]}$` : `$${te.v[0]}$`}.`, run: async (c) => { await show(c, cols[0].t[k]); await pulse(c, cols[0].t[k].querySelector('.u6l5-val'), 1.2, 360); } });
      const same = te.v[1] === te.v[0];
      steps.push({ cap: same ? `The student’s answer is $${te.v[1]}$ for every $x$. The <b>same</b> value… but equal values don’t prove the answer is right.`
        : `Now the answer under test: ${te.s[1] ? `$${te.s[1]}=${te.v[1]}$` : `$${te.v[1]}$`}. Not $${te.v[0]}$: the values differ, so there is an <b>error</b>.`,
      run: async (c) => { await show(c, cols[1].t[k]); if (same) await stampIn(c, stS); else if (last) await stampIn(c, stW); } });
    });
    steps.push({ cap: d.fix, run: async (c) => { for (const e of [cols[2].card, cols[2].hd, cols[2].e]) e.style.opacity = 1; await Promise.all([fadeIn(c, cols[2].card, 360), fadeIn(c, cols[2].hd, 360), fadeIn(c, cols[2].e, 360)]); } });
    const L = d.tests[nt - 1];
    steps.push({ cap: `Test the corrected answer with $${L.at}$: $${L.s[2]}=${L.v[2]}$, the same as the question. ✓`,
      run: async (c) => { for (let k = 0; k < nt; k++) { await pop(c, cols[2].at[k], 320); await show(c, cols[2].t[k]); } await stampIn(c, stC); } });
    return steps;
  }
};

/* =============================== explainer: the hike (Example 8) =============================== */
const HK = { 3: 'v = 3 km/h · Example 8(b)', 2: 'v = 2 km/h', 5: 'v = 5 km/h' };
const dec = (q) => String(Math.round(q * 1000) / 1000);
const hike = {
  capH: 100,
  title: 'Up and down the mountain',
  height: 430, minW: 920,
  choices: [3, 2, 5].map((s) => ({ v: s, label: HK[s] })),
  ask: (s) => `Example 8: climb $9$ km at $v$ km/h, come down $15$ km at $2v$ km/h. Here $v=${s}$.`,
  make(stage, s, ex) {
    const W = ex.W, up = 9 / s, dn = 15 / (2 * s), tot = up + dn, dif = up - dn;
    // the mountain
    const A = [40, 300], P = [250, 70], B = [560, 300];
    const ns = 'http://www.w3.org/2000/svg', svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('width', 600); svg.setAttribute('height', 320); svg.style.left = '0px'; svg.style.top = '0px';
    svg.innerHTML = `<polygon points="${A} ${P} ${B}" fill="#efe6d2" stroke="#b9a27a" stroke-width="3"/>`
      + `<polygon points="${P[0] - 34},${P[1] + 38} ${P} ${P[0] + 50},${P[1] + 38} ${P[0] + 20},${P[1] + 30} ${P[0]},${P[1] + 44}" fill="#fff"/>`
      + `<line x1="${A[0]}" y1="${A[1]}" x2="${P[0]}" y2="${P[1]}" stroke="${AM}" stroke-width="5" stroke-dasharray="10 8"/>`
      + `<line x1="${P[0]}" y1="${P[1]}" x2="${B[0]}" y2="${B[1]}" stroke="${COLORS.blue}" stroke-width="5" stroke-dasharray="10 8"/>`
      + `<line x1="10" y1="300" x2="590" y2="300" stroke="#b9a27a" stroke-width="3"/>`;
    stage.appendChild(svg);
    div(stage, 'u6l5-trail u6l5-tu', `${T('9')} km at ${T('v')}`, 34, 150);
    div(stage, 'u6l5-trail u6l5-td', `${T('15')} km at ${T('2v')}`, 420, 160);
    const walker = div(stage, 'u6l5-walker', '🚶', A[0] - 22, A[1] - 52);
    const clock = div(stage, 'u6l5-clock', '⏱ <b>0</b> h', 16, 12);
    const setClock = (t) => { clock.innerHTML = `⏱ <b>${dec(t)}</b> h`; };
    const walk = (c, from, to, t0, t1, ms) => tween(c, ms, (u) => { walker.style.left = (from[0] + (to[0] - from[0]) * u - 22) + 'px'; walker.style.top = (from[1] + (to[1] - from[1]) * u - 52) + 'px'; setClock(t0 + (t1 - t0) * u); });
    // the working
    const RX = 616, rw = W - RX - 12;
    const line = (y, html, cls) => hide(div(stage, 'u6l5-hl ' + (cls || ''), html, RX, y, rw, 58));
    const Lu = line(20, `Up: ${T(`\\dfrac{9}{v}=\\dfrac{9}{${s}}=${dec(up)}`)} h`, 'u6l5-hu');
    const Ld = line(86, `Down: ${T(`\\dfrac{15}{2v}=\\dfrac{15}{${2 * s}}=${dec(dn)}`)} h`, 'u6l5-hd');
    const Lt = line(152, `${T('\\dfrac{9}{v}+\\dfrac{15}{2v}=\\dfrac{18}{2v}+\\dfrac{15}{2v}=\\dfrac{33}{2v}')}`, 'u6l5-ht');
    const Lt2 = line(214, `${T(`\\dfrac{33}{2(${s})}=${dec(tot)}`)} h &nbsp;✓ <span class="u6l5-small">same as the clock</span>`, 'u6l5-ht');
    const Lf = line(270, `Longer by ${T(`\\dfrac{9}{v}-\\dfrac{15}{2v}=\\dfrac{3}{2v}=${dec(dif)}`)} h`, 'u6l5-hf');
    // the time bars
    const X0 = 70, ppu = (W - X0 - 40) / 9, BY = 340;
    div(stage, 'u6l5-axis', '', X0, BY + 64, 9 * ppu, 2);
    for (let k = 0; k <= 9; k++) div(stage, 'u6l5-tick', String(k), X0 + k * ppu - 10, BY + 68, 20, 18);
    div(stage, 'u6l5-blab', 'hours', 10, BY + 66, 56, 20);
    const bu = div(stage, 'u6l5-bar u6l5-bu', '', X0, BY, 0, 26), bd = div(stage, 'u6l5-bar u6l5-bd', '', X0 + up * ppu, BY, 0, 26);
    const bd2 = hide(div(stage, 'u6l5-bar u6l5-bd', '', X0, BY + 32, dn * ppu, 26)), bf = hide(div(stage, 'u6l5-bar u6l5-bf', '', X0 + dn * ppu, BY + 32, dif * ppu, 26));
    const grow = (c, el, wpx, ms) => tween(c, ms, (u) => { el.style.width = (wpx * u) + 'px'; });
    return [
      { cap: `<b>Up:</b> time $=\\dfrac{\\text{distance}}{\\text{speed}}=\\dfrac{9}{v}$. At $v=${s}$: $\\dfrac{9}{${s}}=${dec(up)}$ h.`,
        run: async (c) => { await show(c, Lu); await Promise.all([walk(c, A, P, 0, up, 1700), grow(c, bu, up * ppu, 1700)]); } },
      { cap: `<b>Down</b> at $2v=${2 * s}$ km/h: $\\dfrac{15}{2v}=\\dfrac{15}{${2 * s}}=${dec(dn)}$ h. A longer trail, but twice as fast.`,
        run: async (c) => { await show(c, Ld); await Promise.all([walk(c, P, B, up, tot, 1700), grow(c, bd, dn * ppu, 1700)]); } },
      { cap: `<b>Total as one expression:</b> LCD $2v$, so $\\dfrac{18}{2v}+\\dfrac{15}{2v}=\\dfrac{33}{2v}$. At $v=${s}$: $\\dfrac{33}{${2 * s}}=${dec(tot)}$ h, just what the clock says.`,
        run: async (c) => { await show(c, Lt); await show(c, Lt2); await pulse(c, clock, 1.15, 400); } },
      { cap: `<b>How much longer is the climb?</b> $\\dfrac{9}{v}-\\dfrac{15}{2v}=\\dfrac{18-15}{2v}=\\dfrac{3}{2v}$. At $v=${s}$: $${dec(dif)}$ h${s === 3 ? ', or 30 min' : ''}.`,
        run: async (c) => { await show(c, bd2); await show(c, bf); await show(c, Lf); } }
    ];
  }
};

/* =============================== Stand Up Break =============================== */
const sg = (n) => (n < 0 ? '-' : '+');
/** c·v with a sign in front ("+3x", "-x"); first term without "+" */
const term = (k, v, first) => { if (!k) return ''; const a = Math.abs(k), s = (k < 0 ? '-' : first ? '' : '+'); return s + (a === 1 && v ? '' : a) + v; };
const lin = (a, v, b) => (term(a, v, true) + term(b, '', !a)) || '0';
const dv = (k, v) => (k === 1 ? v : k + v);
function frac(n, d, dvar) { // n / (d·dvar), sign out front, n a number
  const den = d === 1 && dvar ? dvar : d + dvar;
  if (n === 0) return '0';
  return (n < 0 ? '-' : '') + `\\dfrac{${Math.abs(n)}}{${den}}`;
}
standup('u6l5', {
  intro: 'At your whiteboard: NPVs, the LCD, rewrite each term over it, combine (brackets when subtracting), then simplify.',
  levels: {
    BEG: (r) => {
      const V = r.pick(['x', 'a', 'y', 't']);
      let p, q, a, b, op, N;
      do { p = r.pick([2, 3, 4, 5, 6, 8]); q = r.pick([2, 3, 4, 5, 6, 8]); a = r.int(1, 7); b = r.int(1, 7); op = r.pick([1, -1]); N = a * (lcm(p, q) / p) + op * b * (lcm(p, q) / q); }
      while (p === q || lcm(p, q) > 24 || N === 0 || gcd(a, p) > 1 || gcd(b, q) > 1);
      const L = lcm(p, q), u = L / p, w = L / q, g = gcd(N, L);
      return { text: 'Simplify. State the NPVs.', q: `\\dfrac{${a}}{${p}${V}}${op > 0 ? '+' : '-'}\\dfrac{${b}}{${q}${V}}`,
        a: [`${V}\\ne0;\\ \\text{LCD } ${L}${V}`, `=\\dfrac{${a * u}${op > 0 ? '+' : '-'}${b * w}}{${L}${V}}`, '=' + frac(N / g, L / g, V)] };
    },
    PRG: (r) => {
      const V = r.pick(['x', 'm', 'y']);
      let p, q, a, b, op, A, B;
      do {
        p = r.pick([2, 3, 4, 5, 6]); q = r.pick([2, 3, 4, 5, 6]); a = r.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]); b = r.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]); op = r.pick([1, -1]);
        const L0 = lcm(p, q); A = L0 / p + op * (L0 / q); B = (L0 / p) * a + op * (L0 / q) * b;
      } while (p === q || lcm(p, q) > 20 || A === 0 || B === 0);
      const L = lcm(p, q), u = L / p, w = L / q;
      const br = (k, c0) => (k === 1 ? `(${lin(1, V, c0)})` : `${k}(${lin(1, V, c0)})`);
      const comb = `\\dfrac{${br(u, a)}${op > 0 ? '+' : '-'}${br(w, b)}}{${L}${V}}`;
      const exp = `\\dfrac{${lin(u, V, u * a)}${term(op * w, V)}${term(op * w * b, '')}}{${L}${V}}`;
      const g = gcd(gcd(A, B), L), A2 = A / g, B2 = B / g, L2 = L / g, out = [`${V}\\ne0;\\ \\text{LCD } ${L}${V}`, '=' + comb, '=' + exp];
      const den = (L2 === 1 ? V : L2 + V);
      if (A === 0) out.push('=' + frac(B2, L2, V));
      else {
        out.push(`=\\dfrac{${lin(A, V, B)}}{${L}${V}}`);
        if (g > 1) out.push(`=\\dfrac{${lin(A2, V, B2)}}{${den}}`);
        const h2 = gcd(A2, B2); if (h2 > 1) out.push(`=\\dfrac{${h2}(${lin(A2 / h2, V, B2 / h2)})}{${den}}`);
      }
      return { text: 'Simplify. State the NPVs.', q: `\\dfrac{${lin(1, V, a)}}{${p}${V}}${op > 0 ? '+' : '-'}\\dfrac{${lin(1, V, b)}}{${q}${V}}`, a: out };
    },
    MAS: (r) => {
      if (r.chance(0.5)) { // two variables: c1/(p x^2 y) ± c2/(q x y^2)
        let p, q, c1, c2, op;
        do { p = r.pick([2, 3, 4, 6]); q = r.pick([2, 3, 4, 6, 9]); c1 = r.int(1, 7); c2 = r.int(1, 7); op = r.pick([1, -1]); } while (p === q || lcm(p, q) > 18 || gcd(c1, p) > 1 || gcd(c2, q) > 1);
        const L = lcm(p, q), u = L / p, w = L / q, A = c1 * u, B = op * c2 * w, g = gcd(gcd(A, B), L);
        const out = [`x\\ne0,\\ y\\ne0;\\ \\text{LCD } ${L}x^2y^2`, `=\\dfrac{${c1 === 1 ? '' : c1}(${dv(u, 'y')})${op > 0 ? '+' : '-'}${c2 === 1 ? '' : c2}(${dv(w, 'x')})}{${L}x^2y^2}`, `=\\dfrac{${term(A, 'y', true)}${term(B, 'x')}}{${L}x^2y^2}`];
        if (g > 1) out.push(`=\\dfrac{${term(A / g, 'y', true)}${term(B / g, 'x')}}{${L / g === 1 ? '' : L / g}x^2y^2}`);
        return { text: 'Simplify. State the NPVs.', q: `\\dfrac{${c1}}{${p}x^2y}${op > 0 ? '+' : '-'}\\dfrac{${c2}}{${q}xy^2}`, a: out };
      }
      // a whole number minus a fraction: k − (x + a)/(p x)
      const k = r.int(2, 5), p = r.int(2, 5), a = r.pick([-7, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 7]);
      const A = k * p - 1, B = -a, g = gcd(gcd(A, B), p);
      const out = [`x\\ne0;\\ \\text{LCD } ${p}x`, `=\\dfrac{${k * p}x-(${lin(1, 'x', a)})}{${p}x}`, `=\\dfrac{${k * p}x-x${term(-a, '')}}{${p}x}`, `=\\dfrac{${lin(A, 'x', B)}}{${p}x}`];
      if (g > 1) out.push(`=\\dfrac{${lin(A / g, 'x', B / g)}}{${p / g === 1 ? '' : p / g}x}`);
      return { text: 'Simplify. State the NPVs.', q: `${k}-\\dfrac{${lin(1, 'x', a)}}{${p}x}`, a: out };
    }
  }
});

/* =============================== mount =============================== */
const DEFS = { sameDen, lcdBuild, monoAdd, subCheck, hike };
Object.values(DEFS).forEach(mdDef);
export const explainers = mountExplainers(DEFS);
export const _test = { SD, LB, MA, SC, mono, multTex, lin, term, frac };
