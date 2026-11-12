/* Math 20-1 · Unit 6 · Lesson 4 — Dividing Rational Expressions.
 * New lesson format (2026-11-11): the warm-up is plain markup on the page (no code). The explainers are
 *   flipOnly    (Example 1: keep, change, flip — the divisor card turns over; in (c) the × card stays put),
 *   lostStamp   (three students' NPV lists for Examples 2(a), 3(a), 3(b); each missing value is tested in the original
 *                expression, where it divides by 0, and the list that lost it gets a "lost a restriction" stamp),
 *   npvCatch    (Examples 4 and 5: factor; the NPV net collects the denominators' zeros and catches the divisor's
 *                numerator BEFORE the card flips it to the bottom; divide out matching factors),
 *   leftRight   (Example 1(c) with and without brackets: 5/12 vs 16/15; Example 6: a reader moves left to right and
 *                flips only the card after each ÷),
 *   complexFrac (Example 7: the main bar becomes ÷ as the two fractions slide apart, then the same steps).
 * Example 8 has a static rectangle figure (mountRect) and a TI-84 "Show me".
 * Colours: the divisor / flip blue #1f5bd6, the divisor's numerator (C) amber #c27a0e, NPVs from denominators red
 * #c93a33, ✓ green #12805a; matched factors that divide out share one colour per pair (purple, teal, rose, slate). */
import { h, tex, stamp, stampIn, mountExplainers, pop, fadeIn, appear, sleep, pulse, shake, svgEl, place, anim } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const BLUE = '#1f5bd6', AMB = '#c27a0e', RED = '#c93a33', OK = '#12805a', INK = '#1c2230';
const PAIR = ['#7b4fc4', '#0e8a86', '#a33357', '#4f5f80', '#b4651a'];
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const byId = (id) => document.getElementById(id);
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
/* position of el inside root in layout px (offsets ignore the stage's scale and the cards' 3-D turn) */
const posIn = (el, root) => { let x = 0, y = 0, e = el; while (e && e !== root) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; } return { x, y }; };
const mid = (el, root) => { const p = posIn(el, root); return { x: p.x + el.offsetWidth / 2, y: p.y + el.offsetHeight / 2 }; };
const div = (stage, cls, x, y, w, hh, html) => { const d = h('div', cls, html); d.style.left = x + 'px'; d.style.top = y + 'px'; if (w != null) d.style.width = w + 'px'; if (hh != null) d.style.height = hh + 'px'; stage.appendChild(d); return d; };

/* =============================== fraction cards =============================== */
/* A fraction built from HTML so every factor is its own element (to mark, strike or fly from).
 * Tokens are TeX strings; '·' is a multiplication dot between number factors. Keys: card letter + n/d + index. */
function frac(top, topPart, bot, botPart, kp) {
  const el = h('div', 'u6l4-fr');
  const row = (toks, part) => {
    const r = h('div', 'u6l4-fp ' + (el.childNodes.length ? 'u6l4-fd' : 'u6l4-fn')); let i = 0;
    toks.forEach((t) => {
      if (t === '·') { r.appendChild(h('span', 'u6l4-dot', T('\\cdot'))); return; }
      const s = h('span', 'u6l4-f', T(t)); s.dataset.k = kp + part + i++; r.appendChild(s);
    });
    return r;
  };
  el.appendChild(row(top, topPart)); el.appendChild(h('div', 'u6l4-bar')); el.appendChild(row(bot, botPart));
  return el;
}
const expTex = (e, back) => (Array.isArray(e) ? (back ? `\\dfrac{${e[1]}}{${e[0]}}` : `\\dfrac{${e[0]}}{${e[1]}}`) : back ? `\\dfrac{1}{${e}}` : e);
/* spec: { exp: [num, den] | 'polynomial' | null, n: [tokens], d: [tokens], sign: '-' } */
function card(spec, kp) {
  const el = h('div', 'u6l4-fc'), inn = h('div', 'u6l4-fci'); el.appendChild(inn);
  const face = (back) => {
    const f = h('div', 'u6l4-face ' + (back ? 'u6l4-back' : 'u6l4-front'));
    const sg = () => (spec.sign ? h('span', 'u6l4-sg', T(spec.sign)) : null);
    const F = h('div', 'u6l4-lay u6l4-fac'); const s1 = sg(); if (s1) F.appendChild(s1);
    F.appendChild(back ? frac(spec.d, 'd', spec.n, 'n', kp) : frac(spec.n, 'n', spec.d, 'd', kp));
    let E = null;
    if (spec.exp) { E = h('div', 'u6l4-lay u6l4-exp'); const s2 = sg(); if (s2) E.appendChild(s2); E.appendChild(h('span', 'u6l4-ex', T(expTex(spec.exp, back)))); f.appendChild(E); hide(F); }
    f.appendChild(F); f.E = E; f.F = F; return f;
  };
  const front = face(false), back = face(true); inn.append(front, back);
  const C = { el, inn, front, back, flipped: false, spec };
  C.face = () => (C.flipped ? back : front);
  C.f = (k) => C.face().querySelector(`[data-k="${k}"]`);
  C.fBoth = (k) => [front.querySelector(`[data-k="${k}"]`), back.querySelector(`[data-k="${k}"]`)];
  C.factor = async (c) => {
    if (!spec.exp) return;
    const vis = C.face(), other = C.flipped ? front : back;
    other.E.style.opacity = 0; other.F.style.opacity = 1;
    await Promise.all([anim(c, vis.E, [{ opacity: 1 }, { opacity: 0 }], 300), anim(c, vis.F, [{ opacity: 0 }, { opacity: 1 }], 420, { delay: 160 })]);
  };
  C.flip = async (c) => {
    C.flipped = true;
    await Promise.all([anim(c, inn, [{ transform: 'rotateX(0deg)' }, { transform: 'rotateX(180deg)' }], 900, { easing: 'cubic-bezier(.45,.05,.3,1)' }),
      anim(c, el, [{ transform: 'translateY(0)' }, { transform: 'translateY(-22px)', offset: 0.5 }, { transform: 'translateY(0)' }], 900)]);
  };
  return C;
}
const tokTex = (C, k) => { const part = k[1] === 'n' ? C.spec.n : C.spec.d; return part.filter((t) => t !== '·')[+k.slice(2)]; };

/* strike a factor with a coloured line; rem = what is left of a monomial (shown above a numerator, below a denominator) */
async function strike(c, span, color, rem) {
  if (!span) return;
  const s = h('i', 'u6l4-st'); s.style.background = color; span.appendChild(s); span.classList.add('u6l4-cut');
  await anim(c, s, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], 340);
  if (rem) { const r = h('b', 'u6l4-rem', T(rem)); r.style.color = color; span.appendChild(r); await pop(c, r, 300); }
}

/* the step tracker: numbered pills that appear one at a time, the current one lit */
function pills(stage, labels, x, y) {
  const row = div(stage, 'u6l4-pills', x, y);
  const els = labels.map((l, i) => { const p = h('span', 'u6l4-pill', `<b>${i + 1}</b>${l}`); hide(p); row.appendChild(p); return p; });
  return { row, els, async on(c, i) { els.forEach((e, j) => e.classList.toggle('u6l4-pill-on', j === i)); if (els[i].style.opacity !== '1') { els[i].style.opacity = 1; await pop(c, els[i], 320); } } };
}

/* the NPV net: chips drop in from the factors they come from */
function npvNet(stage, x, y, w, hh, v, numLabel) {
  const P = div(stage, 'u6l4-net', x, y, w, hh, `<div class="u6l4-net-h">NPVs: ${T(v)} cannot be</div>`);
  const grp = (label, cls) => { const g = h('div', 'u6l4-ng ' + cls, `<div class="u6l4-ng-h">${label}</div>`); const box = h('div', 'u6l4-chips'); g.appendChild(box); hide(g); P.appendChild(g); return { g, box, vals: {} }; };
  const G = { den: grp('from the denominators', 'u6l4-ng-d'), num: grp(numLabel || 'from the divisor’s numerator', 'u6l4-ng-c') };
  const fin = h('div', 'u6l4-net-f'); hide(fin); P.appendChild(fin);
  const N = { P, G, fin, has: (val) => G.den.vals[val] || G.num.vals[val] };
  N.add = async (c, which, val, from) => {
    const g = G[which];
    if (g.g.style.opacity !== '1') { g.g.style.opacity = 1; await appear(c, g.g, 200); }
    if (g.vals[val]) { await pulse(c, g.vals[val], 1.25, 420); return; }
    const other = G[which === 'den' ? 'num' : 'den'].vals[val];
    if (other) pulse(c, other, 1.2, 420);
    const chip = h('span', 'u6l4-chip', T(val)); hide(chip); g.box.appendChild(chip); g.vals[val] = chip;
    chip.style.opacity = 1;
    if (!c || c.fast || !from) { await pop(c, chip, 300); return; }
    const a = mid(from, stage), b = mid(chip, stage);
    await anim(c, chip, [{ transform: `translate(${a.x - b.x}px, ${a.y - b.y}px) scale(.75)`, opacity: 0.25 }, { transform: 'none', opacity: 1 }], 650);
  };
  N.final = async (c, html) => { fin.innerHTML = html; fin.style.opacity = 1; await pop(c, fin, 360); };
  return N;
}

/* a division scene: the cards in a row with operators between them, and optionally the NPV net on the right.
 * d: { v, cards: [spec…], ops: ['÷', '·', …], den: [[key, value]…], num: [[key, value]…], cancel: [[k1, k2, rem1, rem2]…], ans: [tex…], all } */
const L = 'ABCD';
function scene(stage, ex, d, o = {}) {
  const W = ex.W, netW = o.net === false ? 0 : 288, rowW = W - netW - 24;
  const S = { stage, d, W, rowW };
  S.pills = o.pills ? pills(stage, o.pills, 14, 10) : null;
  S.row = div(stage, 'u6l4-row', 8, o.rowY ?? 66, rowW, o.rowH ?? 170);
  if (o.fs) S.row.style.fontSize = o.fs + 'px';
  S.cards = d.cards.map((sp, i) => card(sp, L[i]));
  S.ops = d.ops.map((op) => h('span', 'u6l4-op', T(op === '÷' ? '\\div' : op === '×' ? '\\times' : '\\cdot')));
  S.cards.forEach((C, i) => { S.row.appendChild(C.el); if (S.ops[i]) S.row.appendChild(S.ops[i]); });
  S.C = (k) => S.cards[L.indexOf(k[0])];
  S.f = (k) => S.C(k).f(k);
  S.ansEl = div(stage, 'u6l4-ans', 8, o.ansY ?? 262, rowW, null); S.ansEl.style.fontSize = (o.ansFs || 27) + 'px';
  S.ansLines = (d.ans || []).map((a) => { const e = h('div', 'u6l4-al', T(a)); hide(e); S.ansEl.appendChild(e); return e; });
  if (netW) S.net = npvNet(stage, W - netW - 8, o.netY ?? 56, netW, o.netH ?? 360, d.v, o.numLabel);
  S.factor = (c) => Promise.all(S.cards.map((C) => C.factor(c)));
  S.npvDen = async (c) => { for (const [k, val] of d.den) { const s = S.f(k); s.classList.add('u6l4-mk-d'); await S.net.add(c, 'den', `${d.v}\\ne ${val}`, s); } };
  S.npvNum = async (c) => {
    const ks = d.num.map(([k]) => k);
    ks.forEach((k) => S.f(k).classList.add('u6l4-mk-c'));
    await Promise.all(ks.map((k) => pulse(c, S.f(k), 1.12, 420)));
    for (const [k, val] of d.num) await S.net.add(c, 'num', `${d.v}\\ne ${val}`, S.f(k));
  };
  S.flipAt = async (c, i) => {   // op i is ÷: it turns into × and the card after it flips
    const op = S.ops[i]; op.innerHTML = T('\\times'); op.classList.add('u6l4-op-x');
    const C = S.cards[i + 1];
    await Promise.all([pop(c, op, 360), C.flip(c)]);
    (d.num || []).forEach(([k]) => { if (k[0] === L[i + 1]) { const s = C.f(k); if (s) s.classList.add('u6l4-mk-c'); } });
  };
  S.cancel = async (c) => {
    for (let i = 0; i < (d.cancel || []).length; i++) {
      const [k1, k2, r1, r2] = d.cancel[i], col = PAIR[i % PAIR.length];
      await strike(c, S.f(k1), col, r1); await strike(c, S.f(k2), col, r2); await sleep(c, 120);
    }
  };
  S.answer = async (c) => { for (const e of S.ansLines) { e.style.opacity = 1; await fadeIn(c, e, 340); } };
  S.facTex = (k) => tokTex(S.C(k), k);
  return S;
}
const uniq = (a) => a.filter((x, i) => a.indexOf(x) === i);
const capDen = (S) => { const d = S.d, fs = uniq(d.den.map(([k]) => S.facTex(k))); return `The denominator${fs.length > 1 ? 's' : ''} ${fs.map(T).join(', ')} cannot be 0: ${T(`${d.v}\\ne ${uniq(d.den.map(([, v]) => v)).join(',\\ ')}`)}.`; };
const capNum = (S, what = 'the divisor’s numerator') => {
  const d = S.d, fs = d.num.map(([k]) => S.facTex(k)), dup = d.num.every(([, v]) => d.den.some(([, w]) => w === v));
  return `Before you flip, <b>catch ${what}</b>: ${fs.map(T).join(' and ')} ${fs.length > 1 ? 'are' : 'is'} about to move to the bottom. ${T(`${d.v}\\ne ${d.num.map(([, v]) => v).join(',\\ ')}`)}${dup ? ' (already on the list)' : ''}.`;
};

/* =============================== explainer 1: keep, change, flip (Example 1) =============================== */
const FO = {
  a: { q: '\\dfrac{8}{15}\\div\\dfrac{12}{25}', cards: [{ exp: ['8', '15'], n: ['2', '·', '4'], d: ['3', '·', '5'] }, { exp: ['12', '25'], n: ['3', '·', '4'], d: ['5', '·', '5'] }], ops: ['÷'],
    cancel: [['An1', 'Bn1'], ['Ad1', 'Bd0']], ans: ['=\\dfrac{2\\cdot5}{3\\cdot3}=\\dfrac{10}{9}'], note: 'Write each number as a product so the matching factors show.' },
  b: { q: '-\\dfrac{9}{14}\\div6', cards: [{ sign: '-', exp: ['9', '14'], n: ['3', '·', '3'], d: ['14'] }, { exp: '6', n: ['2', '·', '3'], d: ['1'] }], ops: ['÷'],
    cancel: [['An1', 'Bn1']], ans: ['=-\\dfrac{3}{14\\cdot2}=-\\dfrac{3}{28}'], whole: true, note: `${T('9=3\\cdot3')} and ${T('6=2\\cdot3')}: one 3 divides out.` },
  c: { q: '\\dfrac{4}{9}\\div\\dfrac{2}{3}\\times\\dfrac{5}{8}', cards: [{ n: ['4'], d: ['9'] }, { n: ['2'], d: ['3'] }, { n: ['5'], d: ['8'] }], ops: ['÷', '×'],
    ans: ['=\\dfrac{4\\cdot3\\cdot5}{9\\cdot2\\cdot8}=\\dfrac{60}{144}=\\dfrac{5}{12}'], three: true }
};
const flipOnly = {
  title: 'Keep, change, flip',
  height: 400, minW: 860,
  choices: [{ sep: 'Example 1' }, ...Object.keys(FO).map((k) => ({ v: k, label: `(${k}) ${T(FO[k].q)}` }))],
  ask: (k) => `<b>Example 1(${k}):</b> divide ${T(FO[k].q)}. Write the answer in lowest terms.`,
  make(stage, k, ex) {
    const d = FO[k], S = scene(stage, ex, d, { net: false, pills: ['Keep', 'Change', 'Flip', d.three ? 'Multiply' : 'Divide out'], rowY: 70, rowH: 170, ansY: 262, ansFs: 30 });
    const A = S.cards[0], B = S.cards[1];
    const tag = (C, txt, cls) => { const t = h('div', 'u6l4-tag ' + cls, txt); hide(t); C.el.appendChild(t); return t; };
    const tk = tag(A, 'keep', 'u6l4-tag-keep'), tf = tag(B, 'flip', 'u6l4-tag-flip'), ts = d.three ? tag(S.cards[2], 'stays', 'u6l4-tag-stay') : null;
    const steps = [
      { cap: `<b>Keep</b> the first fraction as it is.`, run: async (c) => { await S.pills.on(c, 0); A.el.classList.add('u6l4-keep'); await pop(c, tk); } },
      { cap: `<b>Change</b> ${T('\\div')} to ${T('\\times')}.`, run: async (c) => { await S.pills.on(c, 1); const op = S.ops[0]; op.innerHTML = T('\\times'); op.classList.add('u6l4-op-x'); await pop(c, op, 380); } },
      { cap: d.whole ? `<b>Flip</b> the divisor. ${T('6=\\tfrac{6}{1}')}, so it turns into ${T('\\tfrac{1}{6}')}.` : `<b>Flip</b> the divisor: only the fraction right after ${T('\\div')} turns over.`,
        run: async (c) => { await S.pills.on(c, 2); await pop(c, tf); await B.flip(c); } }
    ];
    if (d.three) steps.push({ cap: `${T('\\tfrac{5}{8}')} has a ${T('\\times')} in front of it, not a ${T('\\div')}: it <b>stays</b> the right way up.`, run: async (c) => { await pop(c, ts); await shake(c, S.cards[2].el); } });
    if (d.cancel) {
      steps.push({ cap: `${d.note}`, run: async (c) => { await S.pills.on(c, 3); await S.factor(c); } });
      steps.push({ cap: `<b>Divide out</b> the matching factors, then multiply what is left.`, run: async (c) => { await S.cancel(c); await S.answer(c); } });
    } else steps.push({ cap: `<b>Multiply</b> straight across, then reduce: ${T('\\tfrac{60}{144}=\\tfrac{5}{12}')}.`, run: async (c) => { await S.pills.on(c, 3); await S.answer(c); } });
    return steps;
  }
};

/* =============================== explainer 2: who lost a restriction? (Examples 2(a), 3(a), 3(b)) =============================== */
const LS = {
  '2a': { ex: '2(a)', q: '\\dfrac{12a^3}{5b^2}\\div\\dfrac{18a}{25b^5}', also: `Simplified: ${T('\\dfrac{10a^2b^3}{3}')}`,
    st: [{ m: 'read them from the answer', l: '\\text{none}' }, { m: 'denominators only', l: 'b\\ne0' }, { m: 'denominators and the divisor’s numerator', l: 'a\\ne0,\\ b\\ne0' }],
    tests: [{ at: 'a=0', miss: [0, 1], sub: '\\dfrac{12(0)^3}{5b^2}\\div\\dfrac{18(0)}{25b^5}=0\\div0', why: 'the divisor is 0, so this divides by 0' },
      { at: 'b=0', miss: [0], sub: '\\dfrac{12a^3}{5(0)^2}=\\dfrac{12a^3}{0}', why: 'a denominator is 0' }],
    cap1: `Ava read the NPVs from the simplified answer ${T('\\tfrac{10a^2b^3}{3}')}. Ben used the denominators. Cal used the denominators <b>and</b> the divisor’s numerator.` },
  '3a': { ex: '3(a)', q: '\\dfrac{x+2}{x-5}\\div\\dfrac{x+7}{x}', also: `Flipped first: ${T('\\dfrac{x+2}{x-5}\\cdot\\dfrac{x}{x+7}')}`,
    st: [{ m: 'flipped first, then read the denominators', l: 'x\\ne5,\\ -7' }, { m: 'denominators only', l: 'x\\ne5,\\ 0' }, { m: 'denominators and the divisor’s numerator', l: 'x\\ne5,\\ 0,\\ -7' }],
    tests: [{ at: 'x=-7', miss: [1], sub: '\\dfrac{-7+2}{-7-5}\\div\\dfrac{-7+7}{-7}=\\dfrac{5}{12}\\div\\dfrac{0}{-7}=\\dfrac{5}{12}\\div0', why: 'the divisor is 0, so this divides by 0' },
      { at: 'x=0', miss: [0], sub: '\\dfrac{0+2}{0-5}\\div\\dfrac{0+7}{0}', why: 'the divisor’s denominator is 0' }],
    cap1: `Ava flipped first and then read the denominators. Ben used the denominators of the original. Cal used the denominators <b>and</b> the divisor’s numerator.` },
  '3b': { ex: '3(b)', q: '\\dfrac{x^2-9}{x^2+4x}\\div\\dfrac{x^2-x-6}{2x-1}', also: `Flipped first: ${T('\\dfrac{x^2-9}{x(x+4)}\\cdot\\dfrac{2x-1}{(x-3)(x+2)}')}`,
    st: [{ m: 'flipped first, then read the denominators', l: 'x\\ne0,\\ -4,\\ 3,\\ -2' }, { m: 'denominators only', l: 'x\\ne0,\\ -4,\\ \\tfrac{1}{2}' }, { m: 'denominators and the divisor’s numerator', l: 'x\\ne0,\\ -4,\\ \\tfrac{1}{2},\\ 3,\\ -2' }],
    tests: [{ at: 'x=3', miss: [1], sub: '\\dfrac{x^2-x-6}{2x-1}=\\dfrac{9-3-6}{5}=\\dfrac{0}{5}=0', why: `the divisor is 0, so this divides by 0 (${T('x=-2')} does the same)` },
      { at: 'x=\\tfrac{1}{2}', miss: [0], sub: '2x-1=2\\left(\\tfrac{1}{2}\\right)-1=0', why: 'the divisor’s denominator is 0' }],
    cap1: `Ava flipped first and then read the denominators. Ben used the denominators of the original. Cal used the denominators <b>and</b> the divisor’s numerator.` }
};
const WHO = [['Ava', '#7b4fc4'], ['Ben', '#0e8a86'], ['Cal', '#b4651a']];
const lostStamp = {
  title: 'Who lost a restriction?',
  height: 450, minW: 900,
  choices: Object.keys(LS).map((k) => ({ v: k, label: `Example ${LS[k].ex}` })),
  ask: (k) => `<b>Example ${LS[k].ex}:</b> the NPVs of ${T(LS[k].q)}. Which list is complete?`,
  make(stage, k, ex) {
    const d = LS[k], W = ex.W, cw = Math.floor((W - 56) / 3);
    const also = div(stage, 'u6l4-ls-also', 0, 6, W, null, d.also); hide(also);
    const cards = d.st.map((s, i) => {
      const e = div(stage, 'u6l4-stu', 16 + i * (cw + 12), 70, cw, 190,
        `<div class="u6l4-stu-h"><span class="u6l4-av" style="background:${WHO[i][1]}">${WHO[i][0][0]}</span><b>${WHO[i][0]}</b></div><div class="u6l4-stu-m">${s.m}</div><div class="u6l4-stu-l">${T(s.l)}</div>`);
      hide(e); return e;
    });
    const stamps = cards.map((e) => { const s = stamp(e, 'lost a restriction', { ok: false, size: 'sm', rotate: -6 }); s.classList.add('u6l4-stu-st'); hide(s); return s; });
    const okSt = stamp(cards[2], 'all found', { ok: true, size: 'sm', rotate: -6 }); okSt.classList.add('u6l4-stu-st'); hide(okSt);
    const test = div(stage, 'u6l4-test', 16, 274, W - 32, 164); hide(test);
    const th = h('div', 'u6l4-test-h'), tsub = h('div', 'u6l4-test-s'), twhy = h('div', 'u6l4-test-w'); test.append(th, tsub, twhy);
    const stamped = new Set();
    const steps = [{ cap: d.cap1 + ' Who is right?', run: async (c) => { await show(c, also); for (const e of cards) await show(c, e); } }];
    d.tests.forEach((t) => {
      const names = t.miss.map((i) => WHO[i][0]).join(' and ');
      steps.push({ cap: `${names} left out ${T(t.at)}. Test it in the <b>original</b> expression.`,
        run: async (c) => {
          th.innerHTML = `Test ${T(t.at)} in the original`; tsub.innerHTML = T(t.sub); twhy.innerHTML = ''; hide(tsub); hide(twhy);
          test.style.opacity = 1; await appear(c, test, 200); t.miss.forEach((i) => cards[i].classList.add('u6l4-stu-hot')); await show(c, tsub);
        } });
      steps.push({ cap: `Undefined: ${t.why}. So ${T(t.at.replace('=', '\\ne'))} is a real restriction, and ${names} lost it.`,
        run: async (c) => {
          twhy.innerHTML = `<b>undefined</b>: ${t.why}`; await pop(c, twhy, 360);
          for (const i of t.miss) { cards[i].classList.remove('u6l4-stu-hot'); cards[i].classList.add('u6l4-stu-no'); if (!stamped.has(i)) { stamped.add(i); stamps[i].style.opacity = 1; await stampIn(c, stamps[i]); } else await pulse(c, stamps[i], 1.15); }
        } });
    });
    steps.push({ cap: `Cal has them all: find the NPVs from the <b>original</b> expression, <b>before you flip</b>. The simplified or flipped form can hide some.`,
      run: async (c) => { cards[2].classList.add('u6l4-stu-ok'); okSt.style.opacity = 1; await stampIn(c, okSt); } });
    return steps;
  }
};

/* =============================== explainer 3: the NPV net catches the divisor's numerator (Examples 4, 5) =============================== */
const NC = {
  '4a': { ex: '4(a)', q: '\\dfrac{x+4}{x^2-2x}\\div\\dfrac{3x+12}{x^2-4}', v: 'x',
    cards: [{ exp: ['x+4', 'x^2-2x'], n: ['(x+4)'], d: ['x', '(x-2)'] }, { exp: ['3x+12', 'x^2-4'], n: ['3', '(x+4)'], d: ['(x-2)', '(x+2)'] }], ops: ['÷'],
    den: [['Ad0', '0'], ['Ad1', '2'], ['Bd0', '2'], ['Bd1', '-2']], num: [['Bn1', '-4']], numNote: ` The ${T('3')} is never 0.`,
    cancel: [['An0', 'Bn1'], ['Ad1', 'Bd0']], ans: ['=\\dfrac{x+2}{3x}'], all: 'x\\ne0,\\ 2,\\ -2,\\ -4' },
  '4b': { ex: '4(b)', q: '\\dfrac{5y^2}{y^2-36}\\div\\dfrac{10y}{y+6}', v: 'y',
    cards: [{ exp: ['5y^2', 'y^2-36'], n: ['5y^2'], d: ['(y-6)', '(y+6)'] }, { exp: ['10y', 'y+6'], n: ['10y'], d: ['(y+6)'] }], ops: ['÷'],
    den: [['Ad0', '6'], ['Ad1', '-6'], ['Bd0', '-6']], num: [['Bn0', '0']],
    cancel: [['Ad1', 'Bd0'], ['An0', 'Bn0', 'y', '2']], ans: ['=\\dfrac{5y^2}{10y(y-6)}=\\dfrac{y}{2(y-6)}'], all: 'y\\ne6,\\ -6,\\ 0' },
  '4c': { ex: '4(c)', q: '\\dfrac{x^2-25}{4x}\\div(x^2+3x-10)', v: 'x', note: ` The divisor is a polynomial: write it over ${T('1')}.`,
    cards: [{ exp: ['x^2-25', '4x'], n: ['(x-5)', '(x+5)'], d: ['4x'] }, { exp: 'x^2+3x-10', n: ['(x+5)', '(x-2)'], d: ['1'] }], ops: ['÷'],
    den: [['Ad0', '0']], num: [['Bn0', '-5'], ['Bn1', '2']],
    cancel: [['An1', 'Bn0']], ans: ['=\\dfrac{x-5}{4x(x-2)}'], all: 'x\\ne0,\\ -5,\\ 2' },
  '5a': { ex: '5(a)', q: '\\dfrac{x^2+x-12}{x^2-x-2}\\div\\dfrac{x^2+6x+8}{x^2-1}', v: 'x',
    cards: [{ exp: ['x^2+x-12', 'x^2-x-2'], n: ['(x+4)', '(x-3)'], d: ['(x-2)', '(x+1)'] }, { exp: ['x^2+6x+8', 'x^2-1'], n: ['(x+2)', '(x+4)'], d: ['(x-1)', '(x+1)'] }], ops: ['÷'],
    den: [['Ad0', '2'], ['Ad1', '-1'], ['Bd0', '1'], ['Bd1', '-1']], num: [['Bn0', '-2'], ['Bn1', '-4']],
    cancel: [['An0', 'Bn1'], ['Ad1', 'Bd1']], ans: ['=\\dfrac{(x-3)(x-1)}{(x-2)(x+2)}'], all: 'x\\ne2,\\ -1,\\ 1,\\ -2,\\ -4' },
  '5b': { ex: '5(b)', q: '\\dfrac{2a^2-a-6}{a^2-9}\\div\\dfrac{4a^2-9}{6-2a}', v: 'a', note: ` ${T('6-2a=-2(a-3)')}.`,
    cards: [{ exp: ['2a^2-a-6', 'a^2-9'], n: ['(2a+3)', '(a-2)'], d: ['(a-3)', '(a+3)'] }, { exp: ['4a^2-9', '6-2a'], n: ['(2a-3)', '(2a+3)'], d: ['-2', '(a-3)'] }], ops: ['÷'],
    den: [['Ad0', '3'], ['Ad1', '-3'], ['Bd1', '3']], num: [['Bn0', '\\tfrac{3}{2}'], ['Bn1', '-\\tfrac{3}{2}']],
    cancel: [['An0', 'Bn1'], ['Ad0', 'Bd1']], ans: ['=-\\dfrac{2(a-2)}{(a+3)(2a-3)}'], all: 'a\\ne3,\\ -3,\\ \\tfrac{3}{2},\\ -\\tfrac{3}{2}' },
  '5c': { ex: '5(c)', q: '\\dfrac{x^2-y^2}{x^2+4xy+3y^2}\\div\\dfrac{2x^2-2xy}{x+3y}', v: 'x', fs: 23,
    cards: [{ exp: ['x^2-y^2', 'x^2+4xy+3y^2'], n: ['(x-y)', '(x+y)'], d: ['(x+y)', '(x+3y)'] }, { exp: ['2x^2-2xy', 'x+3y'], n: ['2x', '(x-y)'], d: ['(x+3y)'] }], ops: ['÷'],
    den: [['Ad0', '-y'], ['Ad1', '-3y'], ['Bd0', '-3y']], num: [['Bn0', '0'], ['Bn1', 'y']],
    cancel: [['An1', 'Ad0'], ['An0', 'Bn1'], ['Ad1', 'Bd0']], ans: ['=\\dfrac{1}{2x}'], all: 'x\\ne-y,\\ -3y,\\ 0,\\ y' }
};
const npvCatch = {
  title: 'Catch the divisor’s numerator before it flips',
  height: 440, minW: 920,
  choices: [{ sep: 'Example 4' }, ...['4a', '4b', '4c'].map((k) => ({ v: k, label: `(${k[1]})` })), { sep: 'Example 5' }, ...['5a', '5b', '5c'].map((k) => ({ v: k, label: `(${k[1]})` }))],
  ask: (k) => `<b>Example ${NC[k].ex}:</b> simplify ${T(NC[k].q)}. State the NPVs.`,
  make(stage, k, ex) {
    const d = NC[k], S = scene(stage, ex, d, { pills: ['Factor', 'NPVs', 'Flip', 'Divide out'], fs: d.fs || 28, rowY: 66, rowH: 180, ansY: 276 });
    return [
      { cap: `<b>Factor</b> every numerator and denominator.${d.note || ''}`, run: async (c) => { await S.pills.on(c, 0); await S.factor(c); } },
      { cap: capDen(S), run: async (c) => { await S.pills.on(c, 1); await S.npvDen(c); } },
      { cap: capNum(S) + (d.numNote || ''), run: (c) => S.npvNum(c) },
      { cap: `<b>Flip</b> the divisor and change ${T('\\div')} to ${T('\\times')}. The caught factors are now in the denominator, already on the list.`, run: async (c) => { await S.pills.on(c, 2); await S.flipAt(c, 0); } },
      { cap: `<b>Divide out</b> the factors that match, top and bottom.`, run: async (c) => { await S.pills.on(c, 3); await S.cancel(c); } },
      { cap: `Multiply what is left and leave it factored: ${T(d.ans[0].replace(/^=/, ''))}, ${T(d.all)}.`, run: async (c) => { await S.answer(c); await S.net.final(c, T(d.all)); } }
    ];
  }
};

/* =============================== explainer 4: left to right (Example 1(c) with brackets; Example 6) =============================== */
const LR = {
  '6a': { ex: '6(a)', q: '\\dfrac{x^2-4x}{x+3}\\div\\dfrac{x^2-16}{x^2+3x}\\cdot\\dfrac{x+4}{2x}', v: 'x',
    cards: [{ exp: ['x^2-4x', 'x+3'], n: ['x', '(x-4)'], d: ['(x+3)'] }, { exp: ['x^2-16', 'x^2+3x'], n: ['(x-4)', '(x+4)'], d: ['x', '(x+3)'] }, { exp: ['x+4', '2x'], n: ['(x+4)'], d: ['2x'] }],
    ops: ['÷', '·'], den: [['Ad0', '-3'], ['Bd0', '0'], ['Bd1', '-3'], ['Cd0', '0']], num: [['Bn0', '4'], ['Bn1', '-4']],
    cancel: [['An1', 'Bn0'], ['Ad0', 'Bd1'], ['Bn1', 'Cn0'], ['An0', 'Cd0', null, '2']], ans: ['=\\dfrac{x^2}{2x}=\\dfrac{x}{2}'], all: 'x\\ne-3,\\ 0,\\ 4,\\ -4' },
  '6b': { ex: '6(b)', q: '\\dfrac{m^2+m-6}{m^2-4}\\cdot\\dfrac{m^2+5m+6}{m^2+6m+9}\\div\\dfrac{m+2}{3m}', v: 'm', note: ` ${T('(m+3)^2=(m+3)(m+3)')}.`,
    cards: [{ exp: ['m^2+m-6', 'm^2-4'], n: ['(m+3)', '(m-2)'], d: ['(m-2)', '(m+2)'] }, { exp: ['m^2+5m+6', 'm^2+6m+9'], n: ['(m+2)', '(m+3)'], d: ['(m+3)', '(m+3)'] }, { exp: ['m+2', '3m'], n: ['(m+2)'], d: ['3m'] }],
    ops: ['·', '÷'], den: [['Ad0', '2'], ['Ad1', '-2'], ['Bd0', '-3'], ['Cd0', '0']], num: [['Cn0', '-2']],
    cancel: [['An0', 'Bd0'], ['An1', 'Ad0'], ['Ad1', 'Bn0'], ['Bn1', 'Bd1']], ans: ['=\\dfrac{3m}{m+2}'], all: 'm\\ne2,\\ -2,\\ -3,\\ 0' }
};
const leftRight = {
  title: 'Left to right: flip only what follows ÷',
  height: 440, minW: 940,
  choices: [{ v: 'br', label: `Example 1(c): brackets or not?` }, { sep: 'Example 6' }, { v: '6a', label: '(a)' }, { v: '6b', label: '(b)' }],
  ask: (k) => (k === 'br' ? `Is ${T('\\dfrac{4}{9}\\div\\dfrac{2}{3}\\times\\dfrac{5}{8}')} the same as ${T('\\dfrac{4}{9}\\div\\left(\\dfrac{2}{3}\\times\\dfrac{5}{8}\\right)')}?` : `<b>Example ${LR[k].ex}:</b> simplify ${T(LR[k].q)}. State the NPVs.`),
  make(stage, k, ex) { return k === 'br' ? bracketsOrNot(stage, ex) : mixedScene(stage, ex, LR[k]); }
};
function mixedScene(stage, ex, d) {
  const S = scene(stage, ex, d, { pills: ['Factor', 'NPVs', 'Flip', 'Divide out'], fs: 22, rowY: 92, rowH: 170, ansY: 290 });
  const rd = div(stage, 'u6l4-reader', 80, 56, null, null, '<span>read</span>▼'); hide(rd);
  const moveTo = async (c, i) => { const m = mid(S.ops[i], stage), x0 = parseFloat(rd.style.left) || 0; rd.style.left = m.x + 'px'; await anim(c, rd, [{ transform: `translateX(${x0 - m.x}px)` }, { transform: 'none' }], 650); };
  const scan = async (c) => {
    rd.style.left = (mid(S.cards[0].el, stage).x) + 'px'; rd.style.opacity = 1; await appear(c, rd, 250);
    for (let i = 0; i < d.ops.length; i++) {
      await moveTo(c, i);
      if (d.ops[i] === '÷') await S.flipAt(c, i);
      else { S.ops[i].classList.add('u6l4-op-keep'); await shake(c, S.cards[i + 1].el); }
      await sleep(c, 200);
    }
  };
  return [
    { cap: `<b>Factor</b> every numerator and denominator.${d.note || ''}`, run: async (c) => { await S.pills.on(c, 0); await S.factor(c); } },
    { cap: `NPVs from <b>every</b> denominator. ${capDen(S)}`, run: async (c) => { await S.pills.on(c, 1); await S.npvDen(c); } },
    { cap: `There is one ${T('\\div')}, so one divisor. ${capNum(S)}`, run: (c) => S.npvNum(c) },
    { cap: `Read <b>left to right</b>. The ${T('\\div')} flips only the fraction right after it; the ${T('\\cdot')} leaves its fraction alone.`, run: async (c) => { await S.pills.on(c, 2); await scan(c); } },
    { cap: `Now it is one big product: <b>divide out</b> matching factors anywhere, top and bottom.`, run: async (c) => { await S.pills.on(c, 3); await S.cancel(c); } },
    { cap: `What is left: ${T(d.ans[0].replace(/^=/, ''))}. NPVs: ${T(d.all)}.`, run: async (c) => { await S.answer(c); await S.net.final(c, T(d.all)); } }
  ];
}
function bracketsOrNot(stage, ex) {
  const W = ex.W, lane = (y, title) => { div(stage, 'u6l4-lane-h', 18, y, null, null, title); return y; };
  const fc = (n, dd) => card({ n: [n], d: [dd] }, 'X');
  const opE = (s) => h('span', 'u6l4-op', T(s));
  // lane 1: left to right
  lane(10, '<b>No brackets:</b> left to right');
  const r1 = div(stage, 'u6l4-row u6l4-row-l', 18, 40, W * 0.56, 150);
  const a1 = fc('4', '9'), b1 = fc('2', '3'), c1 = fc('5', '8'), o11 = opE('\\div'), o12 = opE('\\times');
  r1.append(a1.el, o11, b1.el, o12, c1.el);
  const res1 = div(stage, 'u6l4-res', W * 0.58, 70, W * 0.4, 90, T('=\\dfrac{4\\cdot3\\cdot5}{9\\cdot2\\cdot8}=\\dfrac{60}{144}=\\dfrac{5}{12}')); hide(res1);
  // lane 2: brackets first
  lane(214, '<b>With brackets:</b> the bracket first');
  const r2 = div(stage, 'u6l4-row u6l4-row-l', 18, 244, W * 0.56, 150);
  const a2 = fc('4', '9'), o21 = opE('\\div'), grp = h('span', 'u6l4-grp'), b2 = fc('2', '3'), c2 = fc('5', '8'), bc = card({ n: ['10'], d: ['24'] }, 'Y');
  grp.append(h('span', 'u6l4-brk', T('\\Big(')), b2.el, opE('\\times'), c2.el, h('span', 'u6l4-brk', T('\\Big)')));
  bc.el.style.display = 'none'; r2.append(a2.el, o21, grp, bc.el);
  const res2a = div(stage, 'u6l4-res', W * 0.58, 236, W * 0.4, 70, T('\\dfrac{2}{3}\\times\\dfrac{5}{8}=\\dfrac{10}{24}')); hide(res2a);
  const res2 = div(stage, 'u6l4-res', W * 0.58, 314, W * 0.4, 90, T('=\\dfrac{4\\cdot24}{9\\cdot10}=\\dfrac{96}{90}=\\dfrac{16}{15}')); hide(res2);
  const st = stamp(stage, 'not the same!', { ok: false, x: W * 0.78, y: 212, rotate: -7 }); hide(st);
  const xop = async (c, op) => { op.innerHTML = T('\\times'); op.classList.add('u6l4-op-x'); await pop(c, op, 360); };
  return [
    { cap: `No brackets: read <b>left to right</b>. Only ${T('\\tfrac{2}{3}')} comes right after the ${T('\\div')}, so only it flips.`, run: async (c) => { await xop(c, o11); await b1.flip(c); await shake(c, c1.el); } },
    { cap: `Multiply: ${T('\\tfrac{4}{9}\\times\\tfrac{3}{2}\\times\\tfrac{5}{8}=\\tfrac{60}{144}=\\tfrac{5}{12}')}.`, run: (c) => show(c, res1) },
    { cap: `With brackets, the bracket comes first: ${T('\\tfrac{2}{3}\\times\\tfrac{5}{8}=\\tfrac{10}{24}')}.`,
      run: async (c) => { await show(c, res2a); await anim(c, grp, [{ opacity: 1 }, { opacity: 0 }], 300); grp.style.display = 'none'; bc.el.style.display = ''; await pop(c, bc.el, 360); } },
    { cap: `Now flip ${T('\\tfrac{10}{24}')}: ${T('\\tfrac{4}{9}\\times\\tfrac{24}{10}=\\tfrac{96}{90}=\\tfrac{16}{15}')}.`, run: async (c) => { await xop(c, o21); await bc.flip(c); await show(c, res2); } },
    { cap: `${T('\\tfrac{5}{12}\\ne\\tfrac{16}{15}')}. Do <b>not</b> group the last two unless there are brackets.`, run: async (c) => { st.style.opacity = 1; await stampIn(c, st); } }
  ];
}

/* =============================== explainer 5: a complex fraction comes apart (Example 7) =============================== */
const CF = { ex: '7', v: 'x', q: '\\dfrac{\\;\\dfrac{x^2-9}{6x}\\;}{\\;\\dfrac{x^2+x-12}{4x^2}\\;}',
  cards: [{ exp: ['x^2-9', '6x'], n: ['(x-3)', '(x+3)'], d: ['6x'] }, { exp: ['x^2+x-12', '4x^2'], n: ['(x+4)', '(x-3)'], d: ['4x^2'] }], ops: ['÷'],
  den: [['Ad0', '0'], ['Bd0', '0']], num: [['Bn0', '-4'], ['Bn1', '3']],
  cancel: [['An0', 'Bn1'], ['Ad0', 'Bd0', '3', '2x']], ans: ['=\\dfrac{4x^2(x+3)}{6x(x+4)}=\\dfrac{2x(x+3)}{3(x+4)}'], all: 'x\\ne0,\\ -4,\\ 3' };
const complexFrac = {
  title: 'The main bar means divide',
  height: 440, minW: 920,
  choices: [{ v: 'ex7', label: 'Example 7' }],
  ask: () => `<b>Example 7:</b> simplify ${T(CF.q)}. State the NPVs.`,
  make(stage, k, ex) {
    const d = CF, S = scene(stage, ex, d, { pills: ['Rewrite', 'Factor', 'NPVs', 'Flip', 'Divide out'], fs: 25, rowY: 66, rowH: 180, ansY: 290, numLabel: 'from the bottom fraction’s numerator' });
    // start stacked: the two fractions above and below a long main bar, centred over the row
    const [A, B] = S.cards, op = S.ops[0];
    const stack = div(stage, 'u6l4-stack', 8, 50, S.rowW, 330);
    const bar = h('div', 'u6l4-mainbar');
    stack.append(A.el, bar, B.el); hide(op);
    const tagD = div(stage, 'u6l4-divtag', 0, 0, null, null, T('\\div')); hide(tagD);
    const untangle = async (c) => {
      const p0 = [mid(A.el, stage), mid(B.el, stage)];
      S.row.insertBefore(A.el, op); S.row.appendChild(B.el); op.style.opacity = 1;
      const p1 = [mid(A.el, stage), mid(B.el, stage)];
      await Promise.all([
        anim(c, A.el, [{ transform: `translate(${p0[0].x - p1[0].x}px, ${p0[0].y - p1[0].y}px)` }, { transform: 'none' }], 800),
        anim(c, B.el, [{ transform: `translate(${p0[1].x - p1[1].x}px, ${p0[1].y - p1[1].y}px)` }, { transform: 'none' }], 800),
        anim(c, bar, [{ opacity: 1, transform: 'scaleX(1)' }, { opacity: 0, transform: 'scaleX(.05)' }], 600),
        anim(c, tagD, [{ opacity: 1 }, { opacity: 0 }], 400),
        pop(c, op, 500, { delay: 350 })]);
      stack.style.display = 'none';
    };
    return [
      { cap: `The <b>main fraction bar</b> means divide: the top fraction divided by the bottom fraction.`,
        run: async (c) => { const m = mid(bar, stage); tagD.style.left = (m.x + bar.offsetWidth / 2 + 10) + 'px'; tagD.style.top = (m.y - 22) + 'px'; await S.pills.on(c, 0); await pulse(c, bar, 1.04); await pop(c, tagD); } },
      { cap: `Rewrite it as a division: the top fraction moves left, the bottom fraction moves right, and the main bar becomes ${T('\\div')}.`, run: (c) => untangle(c) },
      { cap: `<b>Factor</b> every numerator and denominator.`, run: async (c) => { await S.pills.on(c, 1); await S.factor(c); } },
      { cap: capDen(S), run: async (c) => { await S.pills.on(c, 2); await S.npvDen(c); } },
      { cap: capNum(S, 'the bottom fraction’s numerator'), run: (c) => S.npvNum(c) },
      { cap: `<b>Flip</b> the bottom fraction and change ${T('\\div')} to ${T('\\times')}.`, run: async (c) => { await S.pills.on(c, 3); await S.flipAt(c, 0); } },
      { cap: `<b>Divide out</b> ${T('(x-3)')}, and reduce ${T('\\tfrac{4x^2}{6x}')} to ${T('\\tfrac{2x}{3}')}.`, run: async (c) => { await S.pills.on(c, 4); await S.cancel(c); } },
      { cap: `${T('\\dfrac{2x(x+3)}{3(x+4)}')}, ${T(d.all)}.`, run: async (c) => { await S.answer(c); await S.net.final(c, T(d.all)); } }
    ];
  }
};

/* =============================== Example 8: the rectangle figure =============================== */
function mountRect() {
  const host = byId('u6l4-rect'); if (!host) return;
  const svg = svgEl('svg', { width: 270, height: 250, viewBox: '0 0 270 250', class: 'u6l4-rectsvg' }, host);
  svgEl('rect', { x: 66, y: 16, width: 190, height: 170, rx: 3, fill: '#f2ece0', stroke: INK, 'stroke-width': 2.5 }, svg);
  const L = (x, y, html, pos, cls = '') => { const d = h('div', 'u6l4-rl ' + cls, html); host.appendChild(d); place(d, x, y, pos, 0); };
  L(161, 101, `area<br>${T('\\dfrac{x^2+5x}{x-2}')}`, 'c', 'u6l4-rl-in');
  L(161, 196, `length ${T('\\dfrac{x^2-25}{x^2-4}')}`, 's');
  L(56, 101, 'width<br>?', 'w', 'u6l4-rl-w');
}

/* =============================== Stand Up Break =============================== */
const mono = (co, x, ex) => { const a = Math.abs(co), s = co < 0 ? '-' : ''; const vv = ex === 0 ? '' : ex === 1 ? x : `${x}^{${ex}}`; return s + (a === 1 && vv ? '' : a) + vv; };
const lin = (k) => (k === 0 ? 'x' : k > 0 ? `(x+${k})` : `(x-${-k})`);
const lin0 = (k) => lin(k).replace(/^\(|\)$/g, '');
const quad = (p, q) => { const b = p + q, c = p * q; return 'x^2' + (b === 0 ? '' : b === 1 ? '+x' : b === -1 ? '-x' : (b > 0 ? '+' : '') + b + 'x') + (c === 0 ? '' : (c > 0 ? '+' : '') + c); };
const nv = (k) => String(-k);
function monoFrac(num, den) {   // num/den as {co, x, y} → reduced TeX (x, y exponents can be negative)
  const g = gcd(num.co, den.co), sg = (num.co < 0) !== (den.co < 0) ? '-' : '';
  const nc = Math.abs(num.co) / g, dc = Math.abs(den.co) / g, ex = num.x - den.x, ey = num.y - den.y;
  const part = (co, vs) => { const s = vs.filter(([, e]) => e > 0).map(([v, e]) => (e === 1 ? v : `${v}^{${e}}`)).join(''); return (co === 1 && s ? '' : String(co)) + s; };
  const top = part(nc, [['x', Math.max(ex, 0)], ['y', Math.max(ey, 0)]]), bot = part(dc, [['x', Math.max(-ex, 0)], ['y', Math.max(-ey, 0)]]);
  return sg + (bot === '1' ? top : `\\dfrac{${top}}{${bot}}`);
}
standup('u6l4', {
  intro: 'At your whiteboard: state every NPV first (the divisor’s numerator too), then flip the divisor, factor and divide out.',
  levels: {
    BEG: (r) => {
      const A = { co: r.int(2, 9) * r.pick([1, 1, -1]), x: r.int(1, 4), y: 0 }, B = { co: r.int(2, 9), x: 0, y: r.int(1, 3) };
      const C = { co: r.int(2, 9), x: r.int(1, 3), y: 0 }, D = { co: r.int(2, 9), x: 0, y: r.int(1, 4) };
      const q = `\\dfrac{${mono(A.co, 'x', A.x)}}{${mono(B.co, 'y', B.y)}}\\div\\dfrac{${mono(C.co, 'x', C.x)}}{${mono(D.co, 'y', D.y)}}`;
      const ans = monoFrac({ co: A.co * D.co, x: A.x, y: D.y }, { co: B.co * C.co, x: C.x, y: B.y });
      return { text: 'Simplify. State the non-permissible values.', q,
        a: [`=\\dfrac{${mono(A.co, 'x', A.x)}}{${mono(B.co, 'y', B.y)}}\\cdot\\dfrac{${mono(D.co, 'y', D.y)}}{${mono(C.co, 'x', C.x)}}`, `=${ans}`, `x\\ne0,\\ y\\ne0`] };
    },
    PRG: (r) => {
      let a, b, c, d, e; do { [a, b, c, d, e] = [r.int(-6, 6), r.int(-6, 6), r.int(-6, 6), r.int(-6, 6), r.int(-6, 6)]; } while (new Set([a, b, c, d, e]).size < 5 || [a, b, c, d, e].includes(0));
      const q = `\\dfrac{${quad(a, b)}}{${quad(c, d)}}\\div\\dfrac{${quad(a, e)}}{${lin0(c)}}`;
      return { text: 'Simplify. State the non-permissible values.', q,
        a: [`=\\dfrac{${lin(a)}${lin(b)}}{${lin(c)}${lin(d)}}\\cdot\\dfrac{${lin0(c)}}{${lin(a)}${lin(e)}}`, `=\\dfrac{${lin0(b)}}{${lin(d)}${lin(e)}}`,
          `x\\ne${[c, d, a, e].map(nv).join(',\\ ')}`] };
    },
    MAS: (r) => {
      let a, b; do { a = r.int(1, 7); b = r.int(-7, 7); } while (!b || b === a || b === -a);
      const k = r.pick([2, 3, 4, 6, 8, 9]), m = r.pick([2, 3, 4, 6, 9, 10]), g = gcd(m, k), mk = m / g, kk = k / g;
      const top = `\\dfrac{x^2-${a * a}}{${k}x}`, bot = `\\dfrac{${quad(a, b)}}{${m}x^2}`;
      const co = mk === 1 ? '' : mk;
      const res = kk === 1 ? `\\dfrac{${co}x(x-${a})}{${lin0(b)}}` : `\\dfrac{${co}x(x-${a})}{${kk}${lin(b)}}`;
      return { text: 'Simplify the complex fraction. State the non-permissible values.', q: `\\dfrac{\\;${top}\\;}{\\;${bot}\\;}`,
        a: [`=\\dfrac{(x-${a})(x+${a})}{${k}x}\\cdot\\dfrac{${m}x^2}{(x+${a})${lin(b)}}`, `=${res}`, `x\\ne0,\\ ${-a},\\ ${-b}`] };
    }
  }
});

/* =============================== mount =============================== */
mountRect();
export const explainers = mountExplainers({ flipOnly, lostStamp, npvCatch, leftRight, complexFrac });
export const _test = { FO, LS, NC, LR, CF, monoFrac, quad, lin };
