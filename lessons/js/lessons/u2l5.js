/* Math 20-1 · Unit 2 · Lesson 5 — Dividing Radicals and Rationalizing Monomial Denominators.
 * The warm-up is plain markup in the page (tools/newformat/specs/u2l5.py). Explainers:
 *   divideRule (coefficients ÷ coefficients, radicands ÷ radicands; Example 1 checks),
 *   splitBar (the fraction bar groups the numerator; the denominator copies under every term; the 6 + 4 trap; Ex 3),
 *   simplestStamp (the five simplest-form checks stamped on six expressions),
 *   formOfOne (× √b/√b = 1, and √b·√b = b clears the denominator; Example 4 checks),
 *   cubeFill (the star, 3-D: factor slots fill to three of each and a box of unit cubes grows into a perfect cube;
 *     ∛2·∛2 = ∛4 is only a flat slab; a fourth root needs four of each; Example 6 checks),
 *   restrictions (even index: radicand ≥ 0; in a denominator: ≠ 0; shaded on a number line; Example 7 checks).
 * Colours: the form of 1 / multiplier amber; coefficients burgundy (the site's teal token); radicands blue;
 * finished answers green; mistakes red. No calculator in Unit 2. */
import {
  h, tex, add, box, NumberLine, mountExplainers, pop, fadeIn, appear, sleep, tween, anim,
  svgEl, pulse, place, drawIn, arrowHead, stamp, stampIn, shake, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const AM = COLORS.amber, TL = COLORS.teal, BL = COLORS.blue, GR = COLORS.green, RD = COLORS.red, INK = COLORS.ink, GY = COLORS.gray;
const ca = (s) => `\\textcolor{${AM}}{${s}}`, cb = (s) => `\\textcolor{${BL}}{${s}}`, ct = (s) => `\\textcolor{${TL}}{${s}}`;
const cg = (s) => `\\textcolor{${GR}}{${s}}`, cx = (s) => `\\textcolor{${RD}}{${s}}`;
/** the form of 1, in amber: \dfrac{√b}{√b} */
const ONE = (r) => ca(`\\dfrac{${r}}{${r}}`);
const rt = (x, n = 2) => (n === 2 ? `\\sqrt{${x}}` : `\\sqrt[${n}]{${x}}`);

/* ---------- small drawing helpers ---------- */
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const show = (c, el) => fadeIn(c, el, 320);
/** an absolutely placed label (place(): pos 'c' centred, or the side of (x, y) it sits on) */
const lab = (stage, x, y, html, cls = '', pos = 'c', gap = 6) => { const d = add(stage, h('div', 'u2l5-lab ' + cls, html)); place(d, x, y, pos, gap); return d; };
/** a stack of lines (each hidden until shown) */
function lines(stage, x, y, w, cls = '') {
  const el = add(stage, box(h('div', 'u2l5-lines ' + cls), w), x, y);
  return { el, add(html, c2 = '') { const d = h('div', 'u2l5-ln ' + c2, html); el.appendChild(d); hide(d); return d; } };
}
const overlay = (stage, W, H) => svgEl('svg', { class: 'u2l5-ov', width: W, height: H, viewBox: `0 0 ${W} ${H}` }, stage);
/** a straight arrow (drawn in by drawIn) */
function arrow(ov, x1, y1, x2, y2, color = GY, w = 3) {
  const g = svgEl('g', {}, ov);
  svgEl('path', { class: 'bk-stroke', d: `M${x1} ${y1} L${x2} ${y2}`, stroke: color, 'stroke-width': w, fill: 'none', 'stroke-linecap': 'round' }, g);
  arrowHead(g, x2, y2, x2 - x1, y2 - y1, { color, cls: 'bk-end', width: w });
  hide(g);
  return { g, async draw(c) { g.style.opacity = 1; await drawIn(g, 360, c); } };
}
const stampAt = (stage, x, y, text, ok = true, size) => hide(stamp(stage, text, { ok, x, y, size }));
const sIn = async (c, el) => { el.style.opacity = 1; await stampIn(c, el); };
/** mark the last line as the finished answer */
const done = (el) => el && el.classList.add('u2l5-done');

/* ---------- integer helpers (stand-up questions) ---------- */
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
/** n = out^k · in with the largest possible out */
function sqf(n, k = 2) { let out = 1, inn = n; for (let p = 2; p ** k <= inn; p++) while (inn % p ** k === 0) { inn /= p ** k; out *= p; } return [out, inn]; }
/** TeX for (n/d)·ᵏ√r with the sign in front: 3√7, \dfrac{2\sqrt7}{3}, -\dfrac{3\sqrt6}{4}, 5 */
function radQ(n, d, r, k = 2) {
  const g = gcd(n, d); n /= g; d /= g; if (d < 0) { n = -n; d = -d; }
  const s = n < 0 ? '-' : '', a = Math.abs(n), R = r === 1 ? '' : rt(r, k);
  const top = R ? (a === 1 ? R : a + R) : String(a);
  return d === 1 ? s + top : `${s}\\dfrac{${top}}{${d}}`;
}

/* ====================================================================================================
 * Explainer: divideRule — coefficients by coefficients, radicands by radicands.
 * ==================================================================================================== */
const DR = {
  e1a: { m: '', k: '', a: 48, b: 3, n: 2, coef: null, q: 16, tog: '\\sqrt{16}', simp: { cap: `${T('16=4^2')} is a perfect square: ${T('\\sqrt{16}=4')}.`, tex: '=4' }, ans: '4' },
  e1b: { m: '12', k: '4', a: 42, b: 6, n: 2, coef: '12\\div4=3', q: 7, tog: '3\\sqrt{7}', simp: { cap: `7 has no perfect-square factor, so ${T('3\\sqrt7')} is in simplest form.`, tex: null }, ans: '3\\sqrt7' },
  e1c: { m: '10', k: '5', a: 54, b: 3, n: 2, coef: '10\\div5=2', q: 18, tog: '2\\sqrt{18}', simp: { cap: `${T('18=9\\cdot2')} holds the perfect square 9: ${T('\\sqrt{18}=3\\sqrt2')}, so ${T('2(3\\sqrt2)=6\\sqrt2')}.`, tex: '=2(3\\sqrt2)=6\\sqrt2' }, ans: '6\\sqrt2' },
  e1d: { m: '', k: '', a: 250, b: 2, n: 3, coef: null, q: 125, tog: '\\sqrt[3]{125}', simp: { cap: `${T('125=5^3')} is a perfect cube: ${T('\\sqrt[3]{125}=5')}.`, tex: '=5' }, ans: '5' },
  e1e: { m: '-18', k: '6', a: 80, b: 5, n: 3, coef: '-18\\div6=-3', q: 16, tog: '-3\\sqrt[3]{16}', simp: { cap: `${T('16=8\\cdot2')} holds the perfect cube 8: ${T('\\sqrt[3]{16}=2\\sqrt[3]2')}, so ${T('-3(2\\sqrt[3]2)=-6\\sqrt[3]2')}.`, tex: '=-3(2\\sqrt[3]{2})=-6\\sqrt[3]{2}' }, ans: '-6\\sqrt[3]2' },
  e1f: { m: '6', k: '9', a: 35, b: 5, n: 2, coef: '\\dfrac{6}{9}=\\dfrac{2}{3}', coefCap: `${T('6\\div9')} is not a whole number: reduce the fraction, ${T('\\frac69=\\frac23')}.`, q: 7, tog: '\\dfrac{2}{3}\\sqrt{7}', simp: { cap: `Write it as one fraction: ${T('\\frac23\\sqrt7=\\frac{2\\sqrt7}{3}')}.`, tex: '=\\dfrac{2\\sqrt7}{3}' }, ans: '\\dfrac{2\\sqrt7}{3}' }
};
const frac = (d, colored = true) => {
  const C = colored ? ct : (s) => s, B = colored ? cb : (s) => s;
  return `\\dfrac{${d.m ? C(d.m) : ''}${rt(B(d.a), d.n)}}{${d.k ? C(d.k) : ''}${rt(B(d.b), d.n)}}`;
};
const divideRule = {
  title: 'Divide coefficients by coefficients, radicands by radicands',
  height: 400,
  capH: 84,
  choices: [{ sep: 'Example 1 check:' }, ...['a', 'b', 'c', 'd', 'e', 'f'].map((k) => ({ v: 'e1' + k, label: `(${k})` }))],
  ask: (k) => `Example 1(${k.slice(2)}): divide ${T(frac(DR[k], false))} and write it in simplest form.`,
  make(stage, k, ex) {
    const W = ex.W, ov = overlay(stage, W, 400);
    const d = DR[k];
    const fb = add(stage, box(h('div', 'u2l5-bigfrac', T(frac(d))), 330, 190), 20, 24);
    const split = (d.m ? `\\dfrac{${ct(d.m)}}{${ct(d.k)}}` : '') + rt(`\\dfrac{${cb(d.a)}}{${cb(d.b)}}`, d.n);
    const sp = hide(add(stage, box(h('div', 'u2l5-split', T('=' + split)), 330), 20, 236));
    const cx0 = 400, cw = W - cx0 - 20;
    const card = (y, head, html, cls) => hide(add(stage, box(h('div', 'u2l5-card ' + cls, `<div class="u2l5-card-h">${head}</div><div class="u2l5-card-b">${html}</div>`), cw, 80), cx0, y));
    const c1 = card(20, 'Coefficients', d.coef ? T(ct(d.coef)) : '<span class="u2l5-muted">none: each is 1</span>', 'u2l5-cardT');
    const c2 = card(112, `Radicands <span class="u2l5-muted">(same index)</span>`, T(cb(`${d.a}\\div${d.b}=${d.q}`)), 'u2l5-cardB');
    const a1 = arrow(ov, 352, 96, cx0 - 8, 62), a2 = arrow(ov, 352, 150, cx0 - 8, 152);
    const L = lines(stage, cx0, 214, cw, 'u2l5-big');
    const tg = L.add(T('=' + d.tog));
    const sm = d.simp.tex ? L.add(T(d.simp.tex)) : null;
    const idx = d.n === 2 ? 'square roots' : 'cube roots';
    return [
      { cap: `Both are ${idx} (the same index), so the quotient fits under <b>one</b> radical: ${T(split)}.`, run: async (c) => { await pulse(c, fb, 1.04); await show(c, sp); } },
      { cap: d.coefCap || (d.coef ? `Divide the coefficients: ${T(d.coef)}.` : 'No coefficients in front (each is 1): nothing to divide.'), run: async (c) => { await a1.draw(c); await show(c, c1); } },
      { cap: `Divide the radicands: ${T(`${d.a}\\div${d.b}=${d.q}`)}.`, run: async (c) => { await a2.draw(c); await show(c, c2); } },
      { cap: `Together: ${T(d.tog)}.`, run: (c) => show(c, tg) },
      { cap: d.simp.cap, run: async (c) => { if (sm) await show(c, sm); done(sm || tg); await pulse(c, sm || tg, 1.05); } }
    ];
  }
};

/* ====================================================================================================
 * Explainer: splitBar — a monomial denominator divides every term (Example 3; the 6 + 4 trap).
 * ==================================================================================================== */
const SB = {
  trap: { t: ['6', '4'], op: '+', den: '2' },
  e3a: { t: ['\\sqrt{70}', '\\sqrt{42}'], op: '-', den: '\\sqrt{7}', r: ['\\sqrt{10}', '\\sqrt{6}'],
    caps: [`${T('\\frac{\\sqrt{70}}{\\sqrt7}=\\sqrt{10}')}, because ${T('70\\div7=10')}.`, `${T('\\frac{\\sqrt{42}}{\\sqrt7}=\\sqrt6')}. The answer: ${T('\\sqrt{10}-\\sqrt6')}.`] },
  e3b: { t: ['12\\sqrt{15}', '8\\sqrt{6}'], op: '+', den: '4\\sqrt{3}', r: ['3\\sqrt{5}', '2\\sqrt{2}'],
    caps: [`${T('\\frac{12\\sqrt{15}}{4\\sqrt3}=3\\sqrt5')}: ${T('12\\div4=3')} and ${T('15\\div3=5')}.`, `${T('\\frac{8\\sqrt6}{4\\sqrt3}=2\\sqrt2')}: ${T('8\\div4=2')} and ${T('6\\div3=2')}. The answer: ${T('3\\sqrt5+2\\sqrt2')}.`] },
  e3c: { t: ['6\\sqrt{40}', '9\\sqrt{24}'], op: '-', den: '3\\sqrt{2}', r: ['2\\sqrt{20}', '3\\sqrt{12}'],
    caps: [`${T('\\frac{6\\sqrt{40}}{3\\sqrt2}=2\\sqrt{20}')}: ${T('6\\div3=2')} and ${T('40\\div2=20')}.`, `${T('\\frac{9\\sqrt{24}}{3\\sqrt2}=3\\sqrt{12}')}: ${T('9\\div3=3')} and ${T('24\\div2=12')}.`],
    extra: ['=2(2\\sqrt{5})-3(2\\sqrt{3})=4\\sqrt{5}-6\\sqrt{3}', `Not done yet: simplest form. ${T('\\sqrt{20}=2\\sqrt5')} and ${T('\\sqrt{12}=2\\sqrt3')}, so ${T('4\\sqrt5-6\\sqrt3')}.`] }
};
const splitBar = {
  title: 'The fraction bar groups the whole numerator',
  height: 440,
  capH: 84,
  choices: [{ v: 'trap', label: T('\\frac{6+4}{2}') }, { sep: 'Example 3 check:' }, ...['a', 'b', 'c'].map((k) => ({ v: 'e3' + k, label: `(${k})` }))],
  ask: (k) => (k === 'trap' ? '' : `Example 3(${k.slice(2)}): divide each term of ${T(`\\dfrac{${SB[k].t[0]}${SB[k].op}${SB[k].t[1]}}{${SB[k].den}}`)} by the denominator.`),
  make(stage, k, ex) {
    const W = ex.W, d = SB[k], ov = overlay(stage, W, 440), cx0 = W / 2, tw = 210, gap = 150;
    const grp = hide(add(stage, box(h('div', 'u2l5-grp'), 2 * gap + tw + 20, 84), cx0 - gap - tw / 2 - 10, 24));
    const tile = (x, y, html, cls = '') => add(stage, box(h('div', 'u2l5-tile ' + cls, html), tw, 64), x - tw / 2, y);
    tile(cx0 - gap, 34, T(d.t[0])); tile(cx0 + gap, 34, T(d.t[1]));
    lab(stage, cx0, 66, T(d.op), 'u2l5-op');
    svgEl('line', { x1: cx0 - gap - tw / 2 - 10, x2: cx0 + gap + tw / 2 + 10, y1: 118, y2: 118, stroke: INK, 'stroke-width': 4, 'stroke-linecap': 'round' }, ov);
    const den = tile(cx0, 128, T(ct(d.den)), 'u2l5-tileD');
    // the split: one fraction per term
    const px = [cx0 - 200, cx0 + 200], py = 262;
    const piece = (i) => hide(lab(stage, px[i], py, T(`\\dfrac{${d.t[i]}}{${ct(d.den)}}`), 'u2l5-piece'));
    const pc = [piece(0), piece(1)], pop2 = hide(lab(stage, cx0, py, T(d.op), 'u2l5-op'));
    const fly = [0, 1].map(() => hide(tile(cx0, 128, T(ct(d.den)), 'u2l5-tileD')));
    const flyTo = async (c) => {
      await Promise.all(fly.map((f, i) => { f.style.opacity = 1; return anim(c, f, [{ translate: '0 0', opacity: 1 }, { translate: `${px[i] - cx0}px ${py - 128 - 8}px`, opacity: 0 }], 650); }));
    };
    if (k === 'trap') {
      const tot = hide(lab(stage, cx0 + gap + tw / 2 + 24, 118, T('=\\dfrac{10}{2}=5'), 'u2l5-piece', 'e', 0));
      const bad = hide(lab(stage, cx0, py, T(`\\dfrac{6}{2}+4=3+4=${cx('7')}\\ \\ ${cx('\\times')}`), 'u2l5-bad'));
      const r = [hide(lab(stage, px[0], 352, T(cg('=3')), 'u2l5-res')), hide(lab(stage, px[1], 352, T(cg('=2')), 'u2l5-res'))];
      const fin = hide(lab(stage, cx0, 410, T('3+2=5\\ \\checkmark'), 'u2l5-res u2l5-xt'));
      return [
        { cap: `Do the top first: ${T('6+4=10')}, and ${T('\\frac{10}{2}=5')}. The bar groups the <b>whole</b> top.`, run: async (c) => { await show(c, grp); await show(c, tot); } },
        { cap: `A common error: divide only the first term. ${T('\\frac62+4=7')}: wrong, the answer is 5.`, run: async (c) => { await show(c, bad); await shake(c, bad); } },
        { cap: `Divide <b>every</b> term: the 2 goes under the 6 <b>and</b> under the 4.`, run: async (c) => { bad.style.opacity = 0; await flyTo(c); await show(c, pc[0]); await show(c, pop2); await show(c, pc[1]); } },
        { cap: `${T('\\frac62+\\frac42=3+2=5')}. The same as ${T('\\frac{10}{2}')}. Radicals follow the same rule.`, run: async (c) => { await show(c, r[0]); await show(c, r[1]); await pop(c, fin); done(fin); } }
      ];
    }
    const r = [hide(lab(stage, px[0], 352, T(cg('=' + d.r[0])), 'u2l5-res')), hide(lab(stage, px[1], 352, T(cg('=' + d.r[1])), 'u2l5-res'))];
    const rop = hide(lab(stage, cx0, 352, T(cg(d.op)), 'u2l5-res'));
    const xt = hide(lab(stage, cx0, 410, T(d.extra ? d.extra[0] : `=${d.r[0]}${d.op}${d.r[1]}`), 'u2l5-res u2l5-xt'));
    const steps = [
      { cap: `The fraction bar groups the <b>whole</b> numerator: ${T(ct(d.den))} divides all of it.`, run: async (c) => { await show(c, grp); await pulse(c, den, 1.06); } },
      { cap: `So ${T(ct(d.den))} divides <b>every</b> term: split it into two fractions.`, run: async (c) => { await flyTo(c); await show(c, pc[0]); await show(c, pop2); await show(c, pc[1]); } },
      { cap: d.caps[0], run: (c) => show(c, r[0]) },
      { cap: d.caps[1], run: async (c) => { await show(c, rop); await show(c, r[1]); if (!d.extra) { await show(c, xt); done(xt); } } }
    ];
    if (d.extra) steps.push({ cap: d.extra[1], run: async (c) => { await show(c, xt); done(xt); } });
    return steps;
  }
};

/* ====================================================================================================
 * Explainer: simplestStamp — the five checks for simplest form.
 * ==================================================================================================== */
const SS_RULES = ['No perfect-square (or cube) factor in a radicand', 'No radical in a denominator', 'No fraction under a radical', 'Like radicals combined', 'The fraction is reduced'];
const SS = [
  { e: '\\sqrt{12}', r: 0, fix: '2\\sqrt3', cap: `${T('\\sqrt{12}')}: ${T('12=4\\cdot3')} has a perfect-square factor. Not simplest: ${T('\\sqrt{12}=2\\sqrt3')}.` },
  { e: '\\dfrac{4}{\\sqrt7}', r: 1, fix: '\\dfrac{4\\sqrt7}{7}', cap: `${T('\\frac{4}{\\sqrt7}')}: a radical in the <b>denominator</b>. Today we learn to clear it: ${T('\\frac{4\\sqrt7}{7}')}.` },
  { e: '\\sqrt{\\dfrac35}', r: 2, fix: '\\dfrac{\\sqrt{15}}{5}', cap: `${T('\\sqrt{\\frac35}')}: a <b>fraction under a radical</b>. Today it becomes ${T('\\frac{\\sqrt{15}}{5}')}.` },
  { e: '2\\sqrt3+\\sqrt3', r: 3, fix: '3\\sqrt3', cap: `${T('2\\sqrt3+\\sqrt3')}: <b>like radicals</b> not combined. Collect them: ${T('3\\sqrt3')}.` },
  { e: '\\dfrac{6\\sqrt5}{4}', r: 4, fix: '\\dfrac{3\\sqrt5}{2}', cap: `${T('\\frac{6\\sqrt5}{4}')}: the fraction is <b>not reduced</b> (6 and 4 share 2): ${T('\\frac{3\\sqrt5}{2}')}.` },
  { e: '\\dfrac{3\\sqrt5}{5}', r: -1, fix: null, cap: `${T('\\frac{3\\sqrt5}{5}')} passes all five checks: <b>simplest form</b>. (The 5s do not cancel: one is inside a radical.)` }
];
const simplestStamp = {
  title: 'Simplest form: five checks',
  height: 400,
  capH: 84,
  choices: null,
  ask: false,
  intro: 'Six answers. Which are in simplest form? Press <b>Next</b>.',
  make(stage, k, ex) {
    const W = ex.W;
    const list = add(stage, box(h('div', 'u2l5-rules'), 350), 16, 14);
    const rows = SS_RULES.map((t, i) => { const r = h('div', 'u2l5-rule-r', `<span class="u2l5-rn">${i + 1}</span><span class="u2l5-rt">${t}</span>`); list.appendChild(r); return r; });
    const x0 = 390, cw = (W - x0 - 16 - 2 * 12) / 3, chH = 178;
    const cards = SS.map((s, i) => {
      const x = x0 + (i % 3) * (cw + 12), y = 14 + Math.floor(i / 3) * (chH + 14);
      const cd = add(stage, box(h('div', 'u2l5-sc', `<div class="u2l5-sc-e">${T(s.e)}</div>`), cw, chH), x, y);
      const fx = h('div', 'u2l5-sc-f', s.fix ? `${T('\\to\\ ' + cg(s.fix))}` : '<b>simplest form</b>'); cd.appendChild(fx); hide(fx);
      const st = stampAt(stage, x + cw - 30, y + 30, s.r < 0 ? '✓' : `✗ ${s.r + 1}`, s.r < 0, 'sm');
      return { cd, fx, st };
    });
    return SS.map((s, i) => ({
      cap: s.cap,
      run: async (c) => {
        cards.forEach((q) => q.cd.classList.remove('u2l5-on')); rows.forEach((r) => r.classList.remove('u2l5-on'));
        cards[i].cd.classList.add('u2l5-on');
        if (s.r >= 0) { rows[s.r].classList.add('u2l5-on'); await pulse(c, rows[s.r], 1.03); }
        else rows.forEach((r) => r.classList.add('u2l5-okr'));
        await sIn(c, cards[i].st); await show(c, cards[i].fx);
      }
    }));
  }
};

/* ====================================================================================================
 * Explainer: formOfOne — multiply by √b/√b = 1; √b·√b = b clears the denominator (Example 4).
 * ==================================================================================================== */
const FO = {
  e4a: { start: '\\dfrac{5}{\\sqrt{3}}', b: 3, top: '5\\cdot\\sqrt3=5\\sqrt3', bot: '\\sqrt3\\cdot\\sqrt3=3', res: '=\\dfrac{5\\sqrt{3}}{3}', endCap: `3 does not divide 5 (and the 3s can't cancel: one is under a radical). Answer: ${T('\\frac{5\\sqrt3}{3}')}.` },
  e4b: { start: '\\dfrac{\\sqrt{2}}{\\sqrt{7}}', b: 7, top: '\\sqrt2\\cdot\\sqrt7=\\sqrt{14}', bot: '\\sqrt7\\cdot\\sqrt7=7', res: '=\\dfrac{\\sqrt{14}}{7}', endCap: `Nothing to reduce: ${T('\\frac{\\sqrt{14}}{7}')}.` },
  e4c: { start: '\\dfrac{14}{3\\sqrt{7}}', b: 7, m: '3', top: '14\\cdot\\sqrt7=14\\sqrt7', bot: '3\\sqrt7\\cdot\\sqrt7=3(7)', res: '=\\dfrac{14\\sqrt{7}}{3(7)}=\\dfrac{14\\sqrt{7}}{21}', red: [['=\\dfrac{2\\sqrt{7}}{3}', `Reduce: 14 and 21 share 7. Answer: ${T('\\frac{2\\sqrt7}{3}')}.`]] },
  e4d: { start: '\\dfrac{10}{\\sqrt{20}}', pre: [['=\\dfrac{10}{2\\sqrt{5}}=\\dfrac{5}{\\sqrt{5}}', `Simplify the denominator <b>first</b>: ${T('\\sqrt{20}=2\\sqrt5')}, and ${T('\\frac{10}{2}=5')}. Smaller numbers!`]], from: '\\dfrac{5}{\\sqrt{5}}', b: 5, top: '5\\cdot\\sqrt5=5\\sqrt5', bot: '\\sqrt5\\cdot\\sqrt5=5', res: '=\\dfrac{5\\sqrt{5}}{5}', red: [['=\\sqrt{5}', `${T('5\\div5=1')}: the answer is ${T('\\sqrt5')}.`]] },
  e4e: { start: '\\dfrac{-9}{2\\sqrt{6}}', b: 6, m: '2', top: '-9\\cdot\\sqrt6=-9\\sqrt6', bot: '2\\sqrt6\\cdot\\sqrt6=2(6)', res: '=\\dfrac{-9\\sqrt{6}}{2(6)}=\\dfrac{-9\\sqrt{6}}{12}', red: [['=-\\dfrac{3\\sqrt{6}}{4}', `Reduce: 9 and 12 share 3. Put the negative sign in front: ${T('-\\frac{3\\sqrt6}{4}')}.`]] },
  e4f: { start: '\\sqrt{\\dfrac{5}{8}}', pre: [['=\\dfrac{\\sqrt{5}}{\\sqrt{8}}=\\dfrac{\\sqrt{5}}{2\\sqrt{2}}', `A fraction under a radical: split it, ${T('\\sqrt{\\frac58}=\\frac{\\sqrt5}{\\sqrt8}')}, then simplify ${T('\\sqrt8=2\\sqrt2')}.`]], from: '\\dfrac{\\sqrt{5}}{2\\sqrt{2}}', b: 2, m: '2', top: '\\sqrt5\\cdot\\sqrt2=\\sqrt{10}', bot: '2\\sqrt2\\cdot\\sqrt2=2(2)', res: '=\\dfrac{\\sqrt{10}}{2(2)}=\\dfrac{\\sqrt{10}}{4}', endCap: `Nothing to reduce: ${T('\\frac{\\sqrt{10}}{4}')}.` }
};
const formOfOne = {
  title: 'Multiply by a form of 1',
  height: 450,
  capH: 84,
  choices: [{ sep: 'Example 4 check:' }, ...['a', 'b', 'c', 'd', 'e', 'f'].map((k) => ({ v: 'e4' + k, label: `(${k})` }))],
  ask: (k) => `Example 4(${k.slice(2)}): rationalize the denominator of ${T(FO[k].start)} and simplify.`,
  make(stage, k, ex) {
    const W = ex.W, d = FO[k], b = d.b, rb = `\\sqrt{${b}}`, from = d.from || d.start;
    // ---- left: the working
    const L = lines(stage, 22, 16, 530, 'u2l5-big');
    L.add(T(d.start)).style.opacity = 1;
    const pre = (d.pre || []).map(([t]) => L.add(T(t)));
    const mul = L.add(`${T(`${from}\\cdot${ONE(rb)}`)} <span class="u2l5-one">${T(ca(`\\dfrac{${rb}}{${rb}}=1`))}</span>`);
    const res = L.add(T(d.res));
    const red = (d.red || []).map(([t]) => L.add(T(t)));
    // ---- right: why the bottom becomes rational
    const PX = 580, PW = W - PX - 16;
    const eq = hide(lab(stage, PX + PW / 2, 150, T(`${cb(rb)}\\cdot${cb(rb)}=${b}`), 'u2l5-eq', 'c', 0));
    const steps = (d.pre || []).map(([, cap], i) => ({ cap, run: (c) => show(c, pre[i]) }));
    steps.push(
      { cap: `Multiply by ${T(`\\frac{${rb}}{${rb}}`)}. It equals <b>1</b>, so the value does not change.${d.m ? ` The ${T(d.m)} is already rational: multiply by ${T(rb)} <b>only</b>.` : ''}`, run: async (c) => { await show(c, mul); } },
      { cap: `Top: ${T(d.top)}. Bottom: ${T(d.bot)}${d.m ? `, because ${T(`${rb}\\cdot${rb}=${b}`)}` : ''}. No radical left in the denominator.`, run: async (c) => { await pop(c, eq); await show(c, res); if (!red.length) done(res); } }
    );
    (d.red || []).forEach(([, cap], i) => steps.push({ cap, run: async (c) => { await show(c, red[i]); if (i === red.length - 1) done(red[i]); } }));
    if (d.endCap) steps.push({ cap: d.endCap, run: (c) => pulse(c, res, 1.05) });
    return steps;
  }
};

/* ====================================================================================================
 * Explainer: cubeFill (the star, 3-D) — fill the factor slots and grow the box of unit cubes into a perfect cube.
 * ==================================================================================================== */
const CF = {
  w: { idx: 3, start: '\\dfrac{5}{\\sqrt[3]{2}}', b: 2, fac: [[2, 1]], mult: 4, pw: 8, k: 2, box: [2, 1, 1], mid: [2, 2, 1], tgt: [2, 2, 2],
    res: '=\\dfrac{5\\sqrt[3]{4}}{\\sqrt[3]{8}}=\\dfrac{5\\sqrt[3]{4}}{2}' },
  e6a: { idx: 3, start: '\\dfrac{4}{\\sqrt[3]{3}}', b: 3, fac: [[3, 1]], mult: 9, pw: 27, k: 3, box: [3, 1, 1], tgt: [3, 3, 3],
    res: '=\\dfrac{4\\sqrt[3]{9}}{\\sqrt[3]{27}}=\\dfrac{4\\sqrt[3]{9}}{3}', end: `3 does not divide 4: the answer is ${T('\\frac{4\\sqrt[3]9}{3}')}.` },
  e6b: { idx: 3, start: '\\dfrac{10}{\\sqrt[3]{25}}', b: 25, fac: [[5, 2]], mult: 5, pw: 125, k: 5, box: [5, 5, 1], tgt: [5, 5, 5],
    res: '=\\dfrac{10\\sqrt[3]{5}}{\\sqrt[3]{125}}=\\dfrac{10\\sqrt[3]{5}}{5}', red: ['=2\\sqrt[3]{5}', `${T('10\\div5=2')}: the answer is ${T('2\\sqrt[3]5')}.`] },
  e6c: { idx: 3, start: '\\dfrac{9}{2\\sqrt[3]{6}}', m: '2', b: 6, fac: [[2, 1], [3, 1]], mult: 36, pw: 216, k: 6, box: [3, 2, 1], tgt: [6, 6, 6],
    res: '=\\dfrac{9\\sqrt[3]{36}}{2\\sqrt[3]{216}}=\\dfrac{9\\sqrt[3]{36}}{12}', red: ['=\\dfrac{3\\sqrt[3]{36}}{4}', `${T('2\\sqrt[3]{216}=2(6)=12')}. Reduce: 9 and 12 share 3, so ${T('\\frac{3\\sqrt[3]{36}}{4}')}.`] },
  e6d: { idx: 3, start: '\\sqrt[3]{\\dfrac{3}{4}}', pre: ['=\\dfrac{\\sqrt[3]{3}}{\\sqrt[3]{4}}', `A fraction under a radical: split it first, ${T('\\sqrt[3]{\\frac34}=\\frac{\\sqrt[3]3}{\\sqrt[3]4}')}.`], from: '\\dfrac{\\sqrt[3]{3}}{\\sqrt[3]{4}}',
    b: 4, fac: [[2, 2]], mult: 2, pw: 8, k: 2, box: [2, 2, 1], tgt: [2, 2, 2], res: '=\\dfrac{\\sqrt[3]{6}}{\\sqrt[3]{8}}=\\dfrac{\\sqrt[3]{6}}{2}', end: `Nothing to reduce: ${T('\\frac{\\sqrt[3]6}{2}')}.` },
  e6e: { idx: 3, start: '\\dfrac{12}{\\sqrt[3]{18}}', b: 18, fac: [[2, 1], [3, 2]], mult: 12, pw: 216, k: 6, box: [3, 3, 2], tgt: [6, 6, 6],
    res: '=\\dfrac{12\\sqrt[3]{12}}{\\sqrt[3]{216}}=\\dfrac{12\\sqrt[3]{12}}{6}', red: ['=2\\sqrt[3]{12}', `${T('12\\div6=2')}: the answer is ${T('2\\sqrt[3]{12}')}.`] },
  e6f: { idx: 4, start: '\\dfrac{6}{\\sqrt[4]{27}}', b: 27, fac: [[3, 3]], mult: 3, pw: 81, k: 3, box: [3, 3, 3], tgt: [9, 3, 3],
    res: '=\\dfrac{6\\sqrt[4]{3}}{\\sqrt[4]{81}}=\\dfrac{6\\sqrt[4]{3}}{3}', red: ['=2\\sqrt[4]{3}', `${T('6\\div3=2')}: the answer is ${T('2\\sqrt[4]3')}.`] }
};
const facTex = (fac) => fac.flatMap(([p, n]) => Array(n).fill(p)).join('\\cdot');
const WORD = ['', 'one', 'two', 'three', 'four'];
const missText = (d) => d.fac.map(([p, n]) => `${WORD[d.idx - n]} more ${p}${d.idx - n > 1 ? 's' : ''}`).join(' and ');
/** isometric boxes of unit cubes: P(x, y, z) → px; visible faces x = max (right), y = max (left), z = max (top) */
function iso(ov, cx0, top, u, X, Y, Z) {
  const c30 = Math.cos(Math.PI / 6), ox = cx0 - (X - Y) * u * c30 / 2, oy = top + Z * u;
  const P = (x, y, z) => [ox + (x - y) * u * c30, oy + (x + y) * u / 2 - z * u];
  const quad = (g, pts, cls) => svgEl('polygon', { points: pts.map((p) => P(...p).map((v) => v.toFixed(1)).join(',')).join(' '), class: cls }, g);
  const seg = (g, a, b2) => { const [x1, y1] = P(...a), [x2, y2] = P(...b2); svgEl('line', { x1, y1, x2, y2, class: 'u2l5-isogrid' }, g); };
  /** draw the box [x0,x1]×[y0,y1]×[z0,z1]; faces: which of 'top','right','left' */
  function boxG(parent, [x0, x1], [y0, y1], [z0, z1], cls, faces = ['top', 'right', 'left']) {
    const g = svgEl('g', { class: cls }, parent);
    if (faces.includes('left')) { quad(g, [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], 'u2l5-fL'); for (let i = x0 + 1; i < x1; i++) seg(g, [i, y1, z0], [i, y1, z1]); for (let j = z0 + 1; j < z1; j++) seg(g, [x0, y1, j], [x1, y1, j]); }
    if (faces.includes('right')) { quad(g, [[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], 'u2l5-fR'); for (let i = y0 + 1; i < y1; i++) seg(g, [x1, i, z0], [x1, i, z1]); for (let j = z0 + 1; j < z1; j++) seg(g, [x1, y0, j], [x1, y1, j]); }
    if (faces.includes('top')) { quad(g, [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], 'u2l5-fT'); for (let i = x0 + 1; i < x1; i++) seg(g, [i, y0, z1], [i, y1, z1]); for (let j = y0 + 1; j < y1; j++) seg(g, [x0, j, z1], [x1, j, z1]); }
    return g;
  }
  /** a box of size (a, b, c) sitting on the floor in the front corner of the X × Y × Z frame */
  const corner = (parent, [a, b2, c], cls, faces) => boxG(parent, [X - a, X], [Y - b2, Y], [0, c], cls, faces);
  return { P, boxG, corner, H: (X + Y) * u / 2 + Z * u };
}
const cubeFill = {
  title: 'Build a perfect cube',
  height: 480,
  capH: 84,
  choices: [{ v: 'w', label: T('\\tfrac{5}{\\sqrt[3]{2}}') }, { sep: 'Example 6 check:' }, ...['a', 'b', 'c', 'd', 'e', 'f'].map((k) => ({ v: 'e6' + k, label: `(${k})` }))],
  ask: (k) => (k === 'w' ? '' : `Example 6(${k.slice(2)}): rationalize the denominator of ${T(CF[k].start)} and simplify.`),
  make(stage, k, ex) {
    const W = ex.W, d = CF[k], n = d.idx, ov = overlay(stage, W, 470);
    const rB = rt(d.b, n), rM = rt(d.mult, n), from = d.from || d.start, power = n === 3 ? 'cube' : 'fourth power';
    // ---- left: the working
    const L = lines(stage, 22, 12, 500, 'u2l5-big2 u2l5-cfl');
    L.add(T(d.start)).style.opacity = 1;
    const pre = d.pre ? L.add(T(d.pre[0])) : null;
    const mul = L.add(T(`${from}\\cdot${ONE(rM)}`));
    const res = L.add(T(d.res));
    const red = d.red ? L.add(T(d.red[0])) : null;
    // ---- left, below: the factor slots (n of each prime make a perfect cube / fourth power)
    const tal = add(stage, box(h('div', 'u2l5-tally'), 500), 22, 326);
    const fx = facTex(d.fac), bEq = fx === String(d.b) ? T(String(d.b)) : T(`${d.b}=${fx}`);
    tal.innerHTML = `<div class="u2l5-tal-h">${bEq}: a perfect ${power} needs <b>${WORD[n] || n}</b> of each factor</div>`;
    hide(tal);
    const fills = [];
    d.fac.forEach(([p, have]) => {
      const row = h('div', 'u2l5-tal-r', `<span class="u2l5-tal-p">${T(String(p))}</span>`);
      for (let i = 0; i < n; i++) {
        const sl = h('span', 'u2l5-slot' + (i < have ? ' u2l5-have' : ''), i < have ? T(String(p)) : '');
        row.appendChild(sl);
        if (i >= have) fills.push({ sl, p });
      }
      tal.appendChild(row);
    });
    const fillSlot = async (c, f) => { f.sl.classList.add('u2l5-add'); f.sl.innerHTML = T(ca(String(f.p))); await pop(c, f.sl, 300); };
    // ---- right: the 3-D picture
    const PX = 540, PW = W - PX - 12, [X, Y, Z] = d.tgt;
    const c30 = Math.cos(Math.PI / 6);
    const u = Math.min(84, (PW - 30) / ((X + Y) * c30), (470 - 92) / ((X + Y) / 2 + Z));
    const I = iso(ov, PX + PW / 2, 66 + Math.max(0, (470 - 92 - ((X + Y) / 2 + Z) * u) / 2), u, X, Y, Z);
    const gNew = hide(I.corner(ov, d.tgt, 'u2l5-isoN'));
    const gMid = d.mid ? hide(I.corner(ov, d.mid, 'u2l5-isoM')) : null;
    const gOld = hide(I.corner(ov, d.box, 'u2l5-isoO'));
    const gOldSides = hide(I.corner(ov, d.box, 'u2l5-isoO', d.box[2] === Z ? ['top', 'right', 'left'] : ['right', 'left']));
    const dims = (a) => a.join('\\times');
    const capOld = hide(lab(stage, PX + PW / 2, 10, `${T(cb(String(d.b)))} small cubes: ${T(dims(d.box))}`, 'u2l5-ptitle', 's', 0));
    const capMid = d.mid ? hide(lab(stage, PX + PW / 2, 10, `${T('2\\cdot2=4')}: a flat ${T('2\\times2\\times1')} slab ${T(cx('\\times'))}`, 'u2l5-ptitle u2l5-ptbad', 's', 0)) : null;
    const capNew = hide(lab(stage, PX + PW / 2, 10, n === 3 ? `${T(`${d.b}\\cdot${ca(d.mult)}=${d.pw}=${d.k}^3`)}: a ${T(dims(d.tgt))} cube ✓` : `${T(`${d.b}\\cdot${ca(d.mult)}=${d.pw}=3^4`)}: three ${T('3\\times3\\times3')} cubes ✓`, 'u2l5-ptitle u2l5-ptok', 's', 0));
    const swap = async (c, outs, ins) => { outs.forEach((e) => e && (e.style.opacity = 0)); for (const e of ins) await show(c, e); };
    const steps = [];
    if (pre) steps.push({ cap: d.pre[1], run: (c) => show(c, pre) });
    steps.push({
      cap: n === 3 ? `A cube root wants a perfect <b>cube</b>: three equal factors. ${fx === String(d.b) ? `${T(String(d.b))} has only <b>one</b> factor ${T(String(d.b))}` : `${T(`${d.b}=${fx}`)} is ${d.b} small cubes`}: not a cube.`
        : `A <b>fourth</b> root wants a perfect fourth power: <b>four</b> equal factors. ${T('27=3\\cdot3\\cdot3')} is a cube, but only three 3s.`,
      run: async (c) => { await show(c, tal); await show(c, gOld); await show(c, capOld); }
    });
    if (k === 'w') {
      steps.push({ cap: `Multiplying by ${T('\\sqrt[3]2')} is not enough: ${T('\\sqrt[3]2\\cdot\\sqrt[3]2=\\sqrt[3]4')}. Two 2s make a flat slab, not a cube, so ${T('\\sqrt[3]4')} is still irrational.`,
        run: async (c) => { await fillSlot(c, fills[0]); await swap(c, [gOld, capOld], [gMid, capMid]); } });
      steps.push({ cap: `Use ${T('\\sqrt[3]4')} instead: ${T('\\sqrt[3]2\\cdot\\sqrt[3]4=\\sqrt[3]8=2')}. Three 2s: a ${T('2\\times2\\times2')} cube!`,
        run: async (c) => { await fillSlot(c, fills[1]); await swap(c, [gMid, capMid], [gNew, gOldSides, capNew]); } });
    } else {
      steps.push({ cap: `Missing: ${missText(d)}. Multiply by ${T(ca(String(d.mult)))}: ${T(`${d.b}\\cdot${d.mult}=${d.pw}=${d.k}^${n}`)}, a perfect ${power}.`,
        run: async (c) => { for (const f of fills) await fillSlot(c, f); await swap(c, [gOld, capOld], [gNew, gOldSides, capNew]); } });
    }
    steps.push({ cap: `Multiply top and bottom by ${T(`\\frac{${rM}}{${rM}}`)}, a form of 1.${d.m ? ` The ${T(d.m)} is already rational.` : ''}`, run: (c) => show(c, mul) });
    steps.push({ cap: `${T(`${rt(d.pw, n)}=${d.k}`)}: the denominator is rational now.`, run: async (c) => { await show(c, res); if (!red) done(res); } });
    if (red) steps.push({ cap: d.red[1], run: async (c) => { await show(c, red); done(red); } });
    else if (d.end) steps.push({ cap: d.end, run: (c) => pulse(c, res, 1.05) });
    return steps;
  }
};

/* ====================================================================================================
 * Explainer: restrictions — even index: radicand ≥ 0; in a denominator: ≠ 0 (Example 7).
 * ==================================================================================================== */
const RS = {
  e7a: { e: '\\dfrac{\\sqrt{45x^5}}{\\sqrt{5x}}', v: 'x',
    c: [['45x^5\\ge0,\\ 5x\\ge0\\ \\Rightarrow\\ x\\ge0', `Square roots: every radicand must be ${T('\\ge0')}. ${T('45x^5\\ge0')} and ${T('5x\\ge0')} mean ${T('x\\ge0')}.`],
      ['\\sqrt{5x}\\ne0\\ \\Rightarrow\\ x\\ne0', `${T('\\sqrt{5x}')} is in the <b>denominator</b>, so it can't be 0: ${T('x\\ne0')}. Together: ${T('x>0')}.`]],
    L: [['=\\sqrt{\\dfrac{45x^5}{5x}}=\\sqrt{9x^4}', `Divide under one radical: ${T('\\frac{45x^5}{5x}=9x^4')}.`], ['=3x^2', `${T('\\sqrt{9x^4}=3x^2')}, because ${T('(3x^2)^2=9x^4')}.`]] },
  e7b: { e: '\\dfrac{\\sqrt{14a^3}+\\sqrt{21a}}{\\sqrt{7a}}', v: 'a',
    c: [['14a^3,\\ 21a,\\ 7a\\ge0\\ \\Rightarrow\\ a\\ge0', `Every radicand must be ${T('\\ge0')}: ${T('14a^3')}, ${T('21a')} and ${T('7a')} all need ${T('a\\ge0')}.`],
      ['\\sqrt{7a}\\ne0\\ \\Rightarrow\\ a\\ne0', `${T('\\sqrt{7a}')} is in the denominator: ${T('a\\ne0')}. Together: ${T('a>0')}.`]],
    L: [['=\\dfrac{\\sqrt{14a^3}}{\\sqrt{7a}}+\\dfrac{\\sqrt{21a}}{\\sqrt{7a}}', `Divide <b>each</b> term by ${T('\\sqrt{7a}')}.`], ['=\\sqrt{2a^2}+\\sqrt{3}', `${T('\\frac{14a^3}{7a}=2a^2')} and ${T('\\frac{21a}{7a}=3')}.`], ['=a\\sqrt{2}+\\sqrt{3}', `${T('\\sqrt{a^2}=a')}, because ${T('a>0')}.`]] },
  e7c: { e: '\\dfrac{6}{\\sqrt{x}}', v: 'x',
    c: [['x\\ge0', `${T('\\sqrt x')} needs ${T('x\\ge0')}.`], ['\\sqrt{x}\\ne0\\ \\Rightarrow\\ x\\ne0', `It is in the denominator: ${T('x\\ne0')}. So ${T('x>0')}.`]],
    L: [[`=\\dfrac{6}{\\sqrt{x}}\\cdot${ONE('\\sqrt x')}`, `Rationalize: multiply by ${T('\\frac{\\sqrt x}{\\sqrt x}')}, a form of 1.`], ['=\\dfrac{6\\sqrt{x}}{x}', `${T('\\sqrt x\\cdot\\sqrt x=x')}: ${T('\\frac{6\\sqrt x}{x}')}.`]] },
  e7d: { e: '\\dfrac{3x}{\\sqrt{6x}}', v: 'x',
    c: [['6x\\ge0\\ \\Rightarrow\\ x\\ge0', `${T('6x\\ge0')} means ${T('x\\ge0')}.`], ['\\sqrt{6x}\\ne0\\ \\Rightarrow\\ x\\ne0', `In the denominator: ${T('x\\ne0')}. So ${T('x>0')}.`]],
    L: [[`=\\dfrac{3x}{\\sqrt{6x}}\\cdot${ONE('\\sqrt{6x}')}`, `Multiply by ${T('\\frac{\\sqrt{6x}}{\\sqrt{6x}}')}.`], ['=\\dfrac{3x\\sqrt{6x}}{6x}', `${T('\\sqrt{6x}\\cdot\\sqrt{6x}=6x')}.`], ['=\\dfrac{\\sqrt{6x}}{2}', `Reduce: ${T('\\frac{3x}{6x}=\\frac12')} (allowed, since ${T('x\\ne0')}).`]] },
  e7e: { e: '\\sqrt{\\dfrac{5}{8y}}', v: 'y',
    c: [['\\dfrac{5}{8y}\\ge0\\ \\Rightarrow\\ y\\ge0', `The radicand ${T('\\frac{5}{8y}')} must be ${T('\\ge0')}. The 5 is positive, so ${T('8y')} can't be negative: ${T('y\\ge0')}.`],
      ['8y\\ne0\\ \\Rightarrow\\ y\\ne0', `${T('8y')} is a denominator: ${T('y\\ne0')}. So ${T('y>0')}.`]],
    L: [['=\\dfrac{\\sqrt{5}}{\\sqrt{8y}}=\\dfrac{\\sqrt{5}}{2\\sqrt{2y}}', `Split the fraction, then simplify ${T('\\sqrt{8y}=2\\sqrt{2y}')}.`],
      [`=\\dfrac{\\sqrt{5}}{2\\sqrt{2y}}\\cdot${ONE('\\sqrt{2y}')}`, `Multiply by ${T('\\frac{\\sqrt{2y}}{\\sqrt{2y}}')} only (the 2 is rational).`],
      ['=\\dfrac{\\sqrt{10y}}{2(2y)}=\\dfrac{\\sqrt{10y}}{4y}', `${T('\\sqrt5\\cdot\\sqrt{2y}=\\sqrt{10y}')} and ${T('2\\sqrt{2y}\\cdot\\sqrt{2y}=2(2y)')}.`]] },
  e7f: { e: '\\dfrac{4}{\\sqrt[3]{2m}}', v: 'm', odd: true,
    c: [['\\sqrt[3]{2m}:\\ \\text{any real }m', `A <b>cube</b> root can hold any real number, negatives too: no ${T('\\ge0')} condition.`],
      ['\\sqrt[3]{2m}\\ne0\\ \\Rightarrow\\ m\\ne0', `But it is in the denominator: ${T('m\\ne0')}. That is the only restriction.`]],
    L: [[`=\\dfrac{4}{\\sqrt[3]{2m}}\\cdot${ONE('\\sqrt[3]{4m^2}')}`, `A perfect cube: ${T('2m\\cdot4m^2=8m^3=(2m)^3')}. Multiply by ${T('\\frac{\\sqrt[3]{4m^2}}{\\sqrt[3]{4m^2}}')}.`],
      ['=\\dfrac{4\\sqrt[3]{4m^2}}{\\sqrt[3]{8m^3}}=\\dfrac{4\\sqrt[3]{4m^2}}{2m}', `${T('\\sqrt[3]{8m^3}=2m')}.`], ['=\\dfrac{2\\sqrt[3]{4m^2}}{m}', `Reduce: ${T('\\frac42=2')}.`]] }
};
const restrictions = {
  title: 'Restrictions first, then simplify',
  height: 420,
  capH: 84,
  choices: [{ sep: 'Example 7 check:' }, ...['a', 'b', 'c', 'd', 'e', 'f'].map((k) => ({ v: 'e7' + k, label: `(${k})` }))],
  ask: (k) => `Example 7(${k.slice(2)}): simplify ${T(RS[k].e)} and state the restrictions.`,
  make(stage, k, ex) {
    const W = ex.W, d = RS[k], v = d.v;
    add(stage, box(h('div', 'u2l5-rexp', T(d.e)), 460), 16, 10);
    const C = lines(stage, 22, 118, 460, 'u2l5-big2 u2l5-rsl');
    const cl = d.c.map(([t]) => C.add(T(t)));
    const fin = hide(lab(stage, 22 + 230, 330, T(cg(d.odd ? `${v}\\ne0` : `${v}>0`)), 'u2l5-restr'));
    const NL = new NumberLine(stage, { x: 500, y: 4, width: W - 516, height: 110, min: -3, max: 3, fontSize: 18 });
    lab(stage, W - 24, 52, T(v), 'u2l5-nlv', 'w', 0);
    const i1 = d.odd ? NL.interval(-Infinity, Infinity, { color: TL }) : NL.interval(0, Infinity, { color: TL });
    hide(i1);
    const hole = hide(NL.point(0, { open: true, color: TL }));
    const R = lines(stage, 500, 136, W - 516, 'u2l5-big2 u2l5-rsl');
    const rl = d.L.map(([t]) => R.add(T(t)));
    const steps = [
      { cap: d.c[0][1], run: async (c) => { await show(c, cl[0]); i1.style.opacity = 1; await drawIn(i1, 700, c); } },
      { cap: d.c[1][1], run: async (c) => { await show(c, cl[1]); await pop(c, hole); await pop(c, fin); } }
    ];
    d.L.forEach(([, cap], i) => steps.push({ cap, run: async (c) => { await show(c, rl[i]); if (i === d.L.length - 1) done(rl[i]); } }));
    return steps;
  }
};

/* ====================================================================================================
 * Stand Up Break
 * ==================================================================================================== */
const coefT = (v) => (v === 1 ? '' : v === -1 ? '-' : String(v));
standup('u2l5', {
  intro: 'At your whiteboard: exact answers, simplest form.',
  levels: {
    BEG: (R) => { // divide radicals
      const b = R.pick([2, 3, 5, 6, 7]), q = R.pick([4, 5, 7, 8, 9, 10, 12, 18, 20, 25]), kk = R.pick([1, 2, 3, 4]), t = R.pick([1, 2, 3, 5]) * R.sign(), m = kk * t;
      const [o, i] = sqf(q), q1 = `\\dfrac{${coefT(m)}\\sqrt{${b * q}}}{${kk === 1 ? '' : kk}\\sqrt{${b}}}`;
      const a = [`=${coefT(t)}\\sqrt{${q}}`];
      if (o > 1) a.push(i === 1 ? `=${t * o}` : `=${coefT(t)}(${o}\\sqrt{${i}})=${coefT(t * o)}\\sqrt{${i}}`);
      return { text: 'Divide and write in simplest form.', q: q1, a };
    },
    PRG: (R) => { // rationalize a / (m√b)
      const m = R.pick([1, 1, 2, 3]), b = R.pick([2, 3, 5, 6, 7, 8, 12, 18, 20, 27]), A = R.pick([2, 3, 4, 5, 6, 8, 9, 10, 12, 15]) * R.sign();
      const [o, i] = sqf(b), D = m * o, a = [];
      if (o > 1) a.push(`=\\dfrac{${A}}{${D}\\sqrt{${i}}}`);
      a.push(`=\\dfrac{${A}\\sqrt{${i}}}{${D === 1 ? i : `${D}(${i})`}}`);
      if (D !== 1 || gcd(A, i) > 1) a.push('=' + radQ(A, D * i, i));
      return { text: 'Rationalize the denominator and simplify.', q: `\\dfrac{${A}}{${m === 1 ? '' : m}\\sqrt{${b}}}`, a };
    },
    MAS: (R) => { // cube-root denominator
      const opt = R.pick([[2, 4, 2], [3, 9, 3], [4, 2, 2], [5, 25, 5], [9, 3, 3], [25, 5, 5], [6, 36, 6], [12, 18, 6], [18, 12, 6], [36, 6, 6]]);
      const [b, mu, kk] = opt, A = R.pick([1, 2, 3, 4, 5, 6, 8, 9, 10, 12]);
      const a = [`\\dfrac{${A}}{\\sqrt[3]{${b}}}\\cdot\\dfrac{\\sqrt[3]{${mu}}}{\\sqrt[3]{${mu}}}=\\dfrac{${coefT(A)}\\sqrt[3]{${mu}}}{\\sqrt[3]{${b * mu}}}`, `=\\dfrac{${coefT(A)}\\sqrt[3]{${mu}}}{${kk}}`];
      if (gcd(A, kk) > 1) a.push('=' + radQ(A, kk, mu, 3));
      return { text: 'Rationalize the denominator. (What times the radicand makes a perfect cube?)', q: `\\dfrac{${A}}{\\sqrt[3]{${b}}}`, a };
    }
  }
});

/* =============================== mount =============================== */
export const explainers = mountExplainers({ divideRule, splitBar, simplestStamp, formOfOne, cubeFill, restrictions });
export const _test = { sqf, radQ, DR, SB, FO, CF, RS };
