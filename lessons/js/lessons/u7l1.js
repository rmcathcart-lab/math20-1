/* Math 20-1 · Unit 7 · Lesson 1 — Absolute Value of Real Numbers.
 * New lesson format (2026-11-11): the warm-up is plain markup on the page (no code). Explainers:
 *   walker (STAR: a little walker on a number line measures the distance from 0: he walks from 0 to the number,
 *     the steps are counted under the line, and the number's minus sign drops off its tag: the distance is what's
 *     left. |5| and |−5|, −|6| vs |−6| (the outside minus flips the answer), and the Example 1 check),
 *   bars (the order of operations, step numbers beside the steps: S substitute, 1 inside the bars, 2 take the
 *     absolute value, 3 finish; a rule card lights the current step. Example 2 (e)–(h) and Example 3 (d)–(h) checks),
 *   split (can the bars be split? A try-everything table for |a + b| vs |a| + |b| (a counterexample is stamped)
 *     and for |ab| vs |a||b| (always equal); then the Example 5(a) check on two check cards),
 *   between (the walker again: from a to b, counting the distance apart, then |b − a| and |a − b| side by side:
 *     the sign drops away and both are the same. The booklet's −3 and 5, and the Example 6 check; in (f) two
 *     walkers leave −1 in opposite directions),
 *   context (Example 7: a thermometer rises from −17 °C to 4 °C and counts 21 degrees; an elevator rides its
 *     four trips while a signed "net change" and an always-growing "floors travelled" counter run side by side;
 *     bolts slide onto a zoomed-in ruler with the 45.00 ± 0.15 mm band and are stamped accepted or rejected),
 *   fork (the piecewise rule as a machine: a number rolls into "x ≥ 0?", takes the yes or the no road, and the
 *     number line shows a negative number hopping over 0 to its opposite. A demo, Example 8(a) and 8(e)).
 * Colours for the unit: inside the bars / the number blue, absolute value / distance green, signs that drop and
 * "the opposite" red. Calculator allowed. */
import {
  h, tex, add, box, stamp, stampIn, mountExplainers, pop, fadeIn, sleep, svgEl, pulse, shake, anim, tween, linear, COLORS,
  NumberLine, ValueTable, Flowchart, checkCard
} from '../blocks.js';
import { standup } from '../standup.js';

/* KaTeX reads "|" as an ordinary symbol, so the minus in |-5| gets binary spacing ("| − 5|"). Pair the bars and
 * write them as \lvert … \rvert (opening / closing delimiters), so |-5| looks like |−5|. Bars after \left, \right,
 * \bigl, \bigr … are left alone. Used for every formula on this page (the static .tex spans are fixed below, before
 * boot() typesets them). */
export function fixBars(s) {
  let out = '', open = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch !== '|') { out += ch; continue; }
    const before = s.slice(0, i), bs = (before.match(/\\+$/) || [''])[0].length;
    if (bs % 2 === 1 || /\\(left|right|bigl|bigr|Bigl|Bigr|biggl|biggr|big|Big|middle)\s*$/.test(before)) { out += ch; continue; }
    out += open ? '\\rvert ' : '\\lvert '; open = !open;
  }
  return out;
}
document.querySelectorAll('main.u7l1 .tex').forEach((el) => { if (!el.dataset.texDone && el.textContent.includes('|')) el.textContent = fixBars(el.textContent); });
const T = (s) => tex(fixBars(String(s)));
const IN = COLORS.blue, AB = COLORS.green, RED = COLORS.red, INK = COLORS.ink, SL = COLORS.slate, AMB = COLORS.amber;
const cin = (s) => `\\textcolor{${IN}}{${s}}`, cab = (s) => `\\textcolor{${AB}}{${s}}`, cam = (s) => `\\textcolor{${AMB}}{${s}}`;
const show = (c, el, ms = 320) => fadeIn(c, el, ms);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
const r6 = (v) => { const r = Math.round(v * 1e6) / 1e6; return Object.is(r, -0) ? 0 : r; };
const nt = (v) => String(r6(v));
const sub = (a, b) => (b < 0 ? `${nt(a)}-(${nt(b)})` : `${nt(a)}-${nt(b)}`);

/* ============================ the walker (a little person on a number line) ============================ */
function makeWalker(parent, color = '#f2c14e') {
  const g = svgEl('g', { class: 'u7l1-walker' }, parent), b = svgEl('g', {}, g);
  const ln = (x1, y1, x2, y2) => svgEl('line', { x1, y1, x2, y2, stroke: INK, 'stroke-width': 4.5, 'stroke-linecap': 'round' }, b);
  const l1 = ln(0, -20, -7, -1), l2 = ln(0, -20, 7, -1); ln(0, -20, 0, -40);
  const a1 = ln(0, -35, -9, -25), a2 = ln(0, -35, 9, -25);
  svgEl('circle', { cx: 0, cy: -49, r: 9.5, fill: color, stroke: INK, 'stroke-width': 3 }, b);
  svgEl('circle', { cx: 3.6, cy: -50.5, r: 1.9, fill: INK }, b);
  return {
    g,
    at(px, py) { g.setAttribute('transform', `translate(${px.toFixed(1)} ${py})`); },
    face(d) { b.setAttribute('transform', d < 0 ? 'scale(-1 1)' : ''); },
    legs(px) { const s = 8 * Math.sin(px / 9); l1.setAttribute('x2', s); l2.setAttribute('x2', -s); a1.setAttribute('x2', -s); a2.setAttribute('x2', s); },
    stand() { l1.setAttribute('x2', -7); l2.setAttribute('x2', 7); a1.setAttribute('x2', -9); a2.setAttribute('x2', 9); }
  };
}

/* A number line with walkers, number tags, step counts and a distance counter. */
class WalkScene {
  constructor(stage, ex, o) {
    const W = ex.W; this.o = o;
    this.N = new NumberLine(stage, { x: 10, y: 96, width: W - 20, height: 236, axisY: 150, min: o.min, max: o.max, step: 1, labelStep: o.labelStep || 1, fontSize: 18 });
    this.ay = 150;
    this.wl = svgEl('g', {}, this.N.svg);
    this.w = [makeWalker(this.wl), makeWalker(this.wl, '#8fc7f0')];
    this.w[1].g.style.display = 'none';
    this.ctr = div(stage, 'u7l1-ctr', `<div class="u7l1-ctr-h">${o.ctrLabel || 'distance from 0'}</div><div class="u7l1-ctr-v">0</div><div class="u7l1-ctr-u">units</div>`, W - 232, 4, 222, 86);
    this.ctrV = this.ctr.querySelector('.u7l1-ctr-v');
    this.res = div(stage, 'u7l1-res', '', 14, 4, W - 262, 88);
    this.reset();
  }
  px(v) { return this.N.toPx(v); }
  reset() {
    this.N.clear(); this.res.innerHTML = ''; this.ctrV.innerHTML = '0';
    this.w.forEach((w) => { w.stand(); w.face(1); w.at(this.px(0), this.ay); });
    this.w[1].g.style.display = 'none';
  }
  /** a number tag above the line at v: { neg: show a red minus that can drop, magT: TeX of the size, plain: TeX shown as is } */
  tag(v, o = {}) {
    const d = h('div', 'u7l1-tag' + (o.cls ? ' ' + o.cls : ''), (o.neg ? '<span class="u7l1-sg">−</span>' : '') + `<span class="u7l1-mg">${T(o.plain || o.magT)}</span>`);
    d.style.left = this.px(v) + 'px'; d.style.top = (this.ay - 124) + 'px';
    this.N.html.appendChild(d);
    const dot = this.N.point(v, { color: o.color || IN, r: 7 });
    d.dot = dot; return d;
  }
  async showTag(c, d) { await Promise.all([pop(c, d.dot, 300), fadeIn(c, d, 320)]); }
  /** the sign falls off the tag; what is left (the distance) turns green */
  async drop(c, d) {
    const sg = d.querySelector('.u7l1-sg');
    if (sg) { await anim(c, sg, [{ transform: 'none', opacity: 1 }, { transform: 'translate(18px, 86px) rotate(70deg)', opacity: 0 }], 760, { easing: 'ease-in' }); sg.style.display = 'none'; }
    d.classList.add('u7l1-tagd'); await pulse(c, d, 1.12);
  }
  setCtr(html) { this.ctrV.innerHTML = html; }
  /** walk walker k from a to b; counts each whole unit under the line; o.finT: the counter's final TeX */
  async walk(c, a, b, o = {}) {
    const w = this.w[o.k || 0], N = this.N, ay = this.ay, d = Math.abs(b - a), dir = b >= a ? 1 : -1;
    w.g.style.display = ''; w.face(dir); w.at(this.px(a), ay);
    const bar = svgEl('line', { x1: this.px(a), x2: this.px(a), y1: ay, y2: ay, stroke: o.color || AB, 'stroke-width': 10, 'stroke-linecap': 'round', opacity: 0.45 }, N.layers.data);
    const cnts = [];
    for (let k = 1; k <= Math.floor(d + 1e-9); k++) {
      const t = svgEl('text', { x: this.px(a + dir * (k - 0.5)), y: ay + 66, class: 'u7l1-cnt', 'text-anchor': 'middle', opacity: 0 }, N.layers.data);
      t.textContent = k; cnts.push(t);
    }
    const px = Math.abs(this.px(b) - this.px(a)), ms = d ? Math.min(3000, 450 + px * 4.2) : 0;
    const whole = Number.isInteger(r6(d)), ctr = o.ctr !== false;
    await tween(c, ms, (t) => {
      const v = a + (b - a) * t, wd = Math.abs(v - a);
      w.at(this.px(v), ay); w.legs(Math.abs(this.px(v) - this.px(a))); bar.setAttribute('x2', this.px(v));
      cnts.forEach((e, i) => { if (wd >= i + 1 - 1e-9) e.setAttribute('opacity', 1); });
      if (ctr) this.ctrV.textContent = whole ? String(Math.floor(wd + 1e-9)) : wd.toFixed(2);
    }, linear);
    w.stand();
    if (ctr) this.setCtr(T(o.finT || nt(d)));
    return bar;
  }
  /** a green arc from a to b labelled with the distance (static picture of a finished walk) */
  arc(a, b, labT, o = {}) { return this.N.hop(null, a, b, { label: T(labT) + ' units', color: o.color || AB, height: o.height || 52 }); } // a Promise (hop is async)
  async result(c, s) { this.res.innerHTML = T(s); await show(c, this.res); }
}

/* ================================ 1. distance from zero ================================ */
/* items: { v (the number inside), neg (it has a minus that drops), magT (its size as TeX), out (a minus outside the
 * bars or the root), first (TeX after the bars are taken), last (TeX after the outside minus), cap1, cap2 } */
const WK = {
  ex1: [
    { k: '(a)', v: -14, neg: true, magT: '14', first: '|-14|=14', cap1: `(a) ${T('-14')} is <b>${T('14')} units</b> from ${T('0')}: the sign drops away. ${T('|-14|=14')}.` },
    { k: '(b)', v: 0, magT: '0', first: '|0|=0', cap1: `(b) ${T('0')} is <b>${T('0')} units</b> from ${T('0')}: the walker doesn’t move. ${T('|0|=0')}.` },
    { k: '(c)', v: 11, magT: '11', out: true, first: '-|11|=-(11)', last: '-|11|=-11', cap1: `(c) First the bars: ${T('11')} is ${T('11')} units from ${T('0')}, so ${T('|11|=11')}…`, cap2: `…then the minus <b>outside</b> the bars makes the opposite: ${T('-|11|=-11')}.` },
    { k: '(d)', v: -2.5, neg: true, magT: '2.5', out: true, first: '-|-2.5|=-(2.5)', last: '-|-2.5|=-(2.5)=-2.5', cap1: `(d) Inside the bars: ${T('-2.5')} is ${T('2.5')} units from ${T('0')}, so ${T('|-2.5|=2.5')}…`, cap2: `…and the outside minus: ${T('-|-2.5|=-(2.5)=-2.5')}.` },
    { k: '(e)', v: -7 / 3, neg: true, magT: '\\frac{7}{3}', fin: '\\tfrac{7}{3}', first: '\\left|-\\tfrac{7}{3}\\right|=\\tfrac{7}{3}', cap1: `(e) ${T('-\\frac{7}{3}\\approx-2.33')} is ${T('\\frac{7}{3}')} units from ${T('0')}: ${T('\\left|-\\frac{7}{3}\\right|=\\frac{7}{3}')}.` },
    { k: '(f)', v: -Math.sqrt(5), neg: true, magT: '\\sqrt{5}', fin: '\\sqrt{5}', first: '|-\\sqrt{5}|=\\sqrt{5}', cap1: `(f) ${T('-\\sqrt{5}\\approx-2.24')} is ${T('\\sqrt{5}')} units from ${T('0')}: ${T('|-\\sqrt{5}|=\\sqrt{5}')}. Keep it exact.` },
    { k: '(g)', v: -9, neg: true, magT: '9', first: '\\sqrt{(-9)^2}=\\sqrt{81}=9', cap1: `(g) Squaring removes the sign: ${T('\\sqrt{(-9)^2}=\\sqrt{81}=9')}, the distance from ${T('-9')} to ${T('0')}.` },
    { k: '(h)', v: -4, neg: true, magT: '4', out: true, first: '-\\sqrt{(-4)^2}=-\\sqrt{16}', last: '-\\sqrt{(-4)^2}=-\\sqrt{16}=-4', cap1: `(h) Under the root: ${T('\\sqrt{(-4)^2}=\\sqrt{16}=4')}, the distance from ${T('-4')} to ${T('0')}…`, cap2: `…and the minus <b>outside</b> the root: ${T('-\\sqrt{(-4)^2}=-4')}.` }
  ]
};
function walkItem(S, it) {
  let tg;
  const steps = [{ cap: it.cap1, run: async (c) => {
    S.reset(); tg = S.tag(it.v, { neg: it.neg, magT: it.magT }); await S.showTag(c, tg);
    await S.walk(c, 0, it.v, { finT: it.fin || it.magT });
    if (it.neg) await S.drop(c, tg); else { tg.classList.add('u7l1-tagd'); await pulse(c, tg, 1.1); }
    await S.result(c, it.first);
  } }];
  if (it.out) steps.push({ cap: it.cap2, run: async (c) => {
    const m = Math.abs(it.v);
    await anim(c, tg, [{ opacity: 1 }, { opacity: 0 }], 260);
    const gp = S.N.point(m, { color: AB, r: 8 }); await pop(c, gp, 300);
    const hp = await S.N.hop(null, m, -m, { color: RED, height: 60, label: 'opposite' });
    hide(hp.label); await S.N.drawIn(hp, 700, c); if (hp.label) await show(c, hp.label);
    const t2 = S.tag(-m, { plain: '-' + it.magT, cls: 'u7l1-tagr', color: RED });
    await S.showTag(c, t2); await S.result(c, it.last);
  } });
  return steps;
}
const walkerDef = {
  title: 'The distance walker', height: 336, capH: 86,
  choices: [{ v: 'demo', label: `${T('|5|')} and ${T('|-5|')}` }, { v: 'neg', label: `${T('|-6|')} and ${T('-|6|')}` }, { v: 'ex1', label: 'Example 1 check' }],
  ask: (v) => (v === 'demo' ? `Evaluate ${T('|-5|')} and ${T('|5|')}.` : v === 'neg' ? `Evaluate ${T('|-6|')} and ${T('-|6|')}.` : `Example 1: evaluate ${T('|-14|,\\ |0|,\\ -|11|,\\ -|-2.5|,\\ \\left|-\\tfrac{7}{3}\\right|,\\ |-\\sqrt{5}|,\\ \\sqrt{(-9)^2},\\ -\\sqrt{(-4)^2}')}.`),
  make(stage, v, ex) {
    if (v === 'ex1') {
      const S = new WalkScene(stage, ex, { min: -15, max: 15, labelStep: 5 });
      return WK.ex1.flatMap((it) => walkItem(S, it));
    }
    const S = new WalkScene(stage, ex, { min: -8, max: 8 });
    if (v === 'neg') {
      return [
        ...walkItem(S, { v: -6, neg: true, magT: '6', first: '|-6|=6', cap1: `${T('|-6|')}: the minus is <b>inside</b> the bars. ${T('-6')} is ${T('6')} units from ${T('0')}, so ${T('|-6|=6')}.` }),
        ...walkItem(S, { v: 6, magT: '6', out: true, first: '-|6|=-(6)', last: '-|6|=-6', cap1: `${T('-|6|')}: the minus is <b>outside</b> the bars. The bars first: ${T('|6|=6')}…`, cap2: `…then the outside minus makes the opposite: ${T('-|6|=-6')}. The bars act only on what is inside them.` })
      ];
    }
    let t5, t5n;
    return [
      { cap: `${T('|-5|')} asks: how far is ${T('-5')} from ${T('0')}? Walk from ${T('0')} and count the steps.`, run: async (c) => {
        t5n = S.tag(-5, { neg: true, magT: '5' }); await S.showTag(c, t5n); await S.walk(c, 0, -5, { finT: '5' });
      } },
      { cap: `<b>${T('5')} units.</b> A distance has no direction, so the sign <b>drops away</b>: ${T('|-5|=5')}.`, run: async (c) => {
        await S.drop(c, t5n); await S.result(c, '|-5|=5');
      } },
      { cap: `${T('|5|')}: walk from ${T('0')} the other way. Also <b>${T('5')} units</b>: ${T('|5|=5')}.`, run: async (c) => {
        S.N.layers.data.innerHTML = ''; const a1 = await S.arc(0, -5, '5'); await show(c, a1);
        S.w[0].at(S.px(0), S.ay); t5 = S.tag(5, { magT: '5' }); await S.showTag(c, t5); await S.walk(c, 0, 5, { finT: '5' });
        t5.classList.add('u7l1-tagd'); await S.result(c, '|-5|=5\\qquad|5|=5');
      } },
      { cap: `A number and its opposite are the same distance from ${T('0')}: ${T('|-a|=|a|')}. A distance is never negative: ${T('|a|\\ge0')}.`, run: async (c) => {
        S.N.layers.data.querySelectorAll('line').forEach((e) => e.remove()); S.N.layers.data.querySelectorAll('.u7l1-cnt').forEach((e) => e.remove());
        const a2 = await S.arc(0, 5, '5'); await S.N.drawIn(a2, 600, c);
        await S.result(c, '|-5|=|5|=5\\qquad |a|\\ge0');
      } }
    ];
  }
};

/* ================================ 2. bars first: the order of operations ================================ */
const sv = (s) => cam(s);
const BR = {
  e2e: { q: '3|-5|-2|4|', ex: 'Example 2(e)', lines: [
    { s: 1, t: `3|${cin('-5')}|-2|${cin('4')}|`, cap: `<b>Step 1:</b> inside the bars: ${T('-5')} and ${T('4')}. Nothing to simplify.` },
    { s: 2, t: `=3(${cab('5')})-2(${cab('4')})`, cap: `<b>Step 2:</b> take the absolute values: ${T('|-5|=5')}, ${T('|4|=4')}. The bars become brackets.` },
    { s: 3, t: `=15-8=\\boldsymbol{7}`, cap: `<b>Step 3:</b> multiply, then subtract: ${T('15-8=7')}.` }] },
  e2f: { q: '-2|1-7|+|-3|^2', ex: 'Example 2(f)', lines: [
    { s: 1, t: `-2|${cin('-6')}|+|${cin('-3')}|^2`, cap: `<b>Step 1:</b> inside the bars: ${T('1-7=-6')}. (${T('|-3|')} has nothing to simplify.)` },
    { s: 2, t: `=-2(${cab('6')})+${cab('3')}^2`, cap: `<b>Step 2:</b> ${T('|-6|=6')} and ${T('|-3|=3')}. The power acts on the absolute value: ${T('|-3|^2=3^2')}.` },
    { s: 3, t: `=-12+9=\\boldsymbol{-3}`, cap: `<b>Step 3:</b> the power ${T('3^2=9')}, then ${T('-2(6)=-12')}, then add: ${T('-12+9=-3')}.` }] },
  e2g: { q: '\\bigl|\\,|2-9|-|-11|\\,\\bigr|', ex: 'Example 2(g)', lines: [
    { s: 1, t: `\\bigl|\\,|${cin('-7')}|-|${cin('-11')}|\\,\\bigr|`, cap: `Bars inside bars: work from the <b>inside out</b>. <b>Step 1:</b> ${T('2-9=-7')}.` },
    { s: 2, t: `=|${cab('7')}-${cab('11')}|`, cap: `<b>Step 2:</b> the inner absolute values: ${T('|-7|=7')}, ${T('|-11|=11')}.` },
    { s: 1, t: `=|${cin('-4')}|`, cap: `<b>Step 1</b> again, for the outer bars: inside, ${T('7-11=-4')}.` },
    { s: 2, t: `=\\boldsymbol{${cab('4')}}`, cap: `<b>Step 2:</b> ${T('|-4|=4')}.` }] },
  e2h: { q: '|(-3)(4)+5|', ex: 'Example 2(h)', lines: [
    { s: 1, t: `|${cin('-12+5')}|=|${cin('-7')}|`, cap: `<b>Step 1:</b> inside the bars, in order: ${T('(-3)(4)=-12')}, then ${T('-12+5=-7')}.` },
    { s: 2, t: `=\\boldsymbol{${cab('7')}}`, cap: `<b>Step 2:</b> ${T('|-7|=7')}. Nothing is left to finish.` }] },
  e3d: { q: '|2-\\sqrt{10}|', ex: 'Example 3(d)', lines: [
    { s: 1, t: `\\sqrt{10}\\approx3.16,\\ \\text{so}\\ ${cin('2-\\sqrt{10}')}<0`, cap: `<b>Step 1:</b> ${T('2-\\sqrt{10}')} can’t be simplified, but it is <b>negative</b>: ${T('\\sqrt{10}\\approx3.16>2')}.` },
    { s: 2, t: `|2-\\sqrt{10}|=-(2-\\sqrt{10})=${cab('\\sqrt{10}-2')}`, cap: `<b>Step 2:</b> the absolute value of a negative number is its <b>opposite</b>: ${T('\\sqrt{10}-2')} (exact).` },
    { s: 3, t: `\\approx\\boldsymbol{${cab('1.16')}}`, cap: `To the nearest hundredth: ${T('\\sqrt{10}-2\\approx1.16')}. The calculator agrees: ${T('\\text{abs}(2-\\sqrt{10})')}.` }] },
  e3e: { q: '|2x-7|', at: true, ex: 'Example 3(e)', lines: [
    { s: 'S', t: `|2${sv('(-3)')}-7|`, cap: `<b>Substitute</b> ${T('x=-3')}, in brackets.` },
    { s: 1, t: `=|${cin('-13')}|`, cap: `<b>Step 1:</b> inside the bars: ${T('2(-3)-7=-6-7=-13')}.` },
    { s: 2, t: `=\\boldsymbol{${cab('13')}}`, cap: `<b>Step 2:</b> ${T('|-13|=13')}.` }] },
  e3f: { q: '|x|-|x-5|', at: true, ex: 'Example 3(f)', lines: [
    { s: 'S', t: `|${sv('-3')}|-|${sv('-3')}-5|`, cap: `<b>Substitute</b> ${T('x=-3')} into both bars.` },
    { s: 1, t: `=|${cin('-3')}|-|${cin('-8')}|`, cap: `<b>Step 1:</b> inside the second bars: ${T('-3-5=-8')}.` },
    { s: 2, t: `=${cab('3')}-${cab('8')}`, cap: `<b>Step 2:</b> ${T('|-3|=3')} and ${T('|-8|=8')}.` },
    { s: 3, t: `=\\boldsymbol{-5}`, cap: `<b>Step 3:</b> ${T('3-8=-5')}. A negative answer is fine here: the minus is <b>outside</b> the bars.` }] },
  e3h: { q: '-4|x+1|', at: true, ex: 'Example 3(h)', lines: [
    { s: 'S', t: `-4|${sv('-3')}+1|`, cap: `<b>Substitute</b> ${T('x=-3')}.` },
    { s: 1, t: `=-4|${cin('-2')}|`, cap: `<b>Step 1:</b> inside the bars: ${T('-3+1=-2')}.` },
    { s: 2, t: `=-4(${cab('2')})`, cap: `<b>Step 2:</b> ${T('|-2|=2')}. The bars become brackets.` },
    { s: 3, t: `=\\boldsymbol{-8}`, cap: `<b>Step 3:</b> multiply: ${T('-4(2)=-8')}.` }] }
};
const RULES = [['S', 'Substitute the value (in brackets)'], ['1', 'Simplify <b>inside</b> the bars'], ['2', 'Take the <b>absolute value</b>'], ['3', 'Finish: powers, × ÷, + −']];
const barsDef = {
  title: 'Bars first', height: 340, capH: 86,
  choices: [{ sep: 'Example 2' }, { v: 'e2e', label: '(e)' }, { v: 'e2f', label: '(f)' }, { v: 'e2g', label: '(g)' }, { v: 'e2h', label: '(h)' },
    { sep: 'Example 3' }, { v: 'e3d', label: '(d)' }, { v: 'e3e', label: '(e)' }, { v: 'e3f', label: '(f)' }, { v: 'e3h', label: '(h)' }],
  ask: (v) => `${BR[v].ex}: evaluate ${T(BR[v].q)}${BR[v].at ? ' for ' + T('x=-3') : ''}.`,
  make(stage, v, ex) {
    const B = BR[v], W = ex.W, RW = 318;
    div(stage, 'u7l1-bq', T(B.q), 78, 8, W - RW - 100, 60);
    const card = div(stage, 'u7l1-rules', '<div class="u7l1-rules-h">The order</div>', W - RW - 6, 8, RW);
    const rows = {};
    RULES.forEach(([k, txt]) => { if (k === 'S' && !B.at) return; rows[k] = add(card, h('div', 'u7l1-rule', `<span class="u7l1-bdg u7l1-b${k}">${k}</span><span>${txt}</span>`)); });
    const lit = (k) => Object.entries(rows).forEach(([kk, el]) => el.classList.toggle('u7l1-on', String(kk) === String(k)));
    return B.lines.map((L, i) => {
      const y = 76 + i * 64;
      const bd = hide(div(stage, `u7l1-bdg u7l1-big u7l1-b${L.s}`, String(L.s), 20, y + 6));
      const ln = hide(div(stage, 'u7l1-bl', T(L.t), 78, y, W - RW - 100, 60));
      return { cap: L.cap, run: async (c) => { lit(L.s); await pop(c, bd, 300); await show(c, ln, 420); } };
    });
  }
};

/* ================================ 3. can the bars be split? ================================ */
const SP = {
  sum: { hd: ['a', 'b', '|a+b|', '|a|+|b|'], L: (a, b) => Math.abs(a + b), R: (a, b) => Math.abs(a) + Math.abs(b),
    lt: (a, b) => `|${nt(a + b)}|=${nt(Math.abs(a + b))}`, rt: (a, b) => `${nt(Math.abs(a))}+${nt(Math.abs(b))}=${nt(Math.abs(a) + Math.abs(b))}` },
  prod: { hd: ['a', 'b', '|ab|', '|a|\\,|b|'], L: (a, b) => Math.abs(a * b), R: (a, b) => Math.abs(a) * Math.abs(b),
    lt: (a, b) => `|${nt(a * b)}|=${nt(Math.abs(a * b))}`, rt: (a, b) => `${nt(Math.abs(a))}\\times${nt(Math.abs(b))}=${nt(Math.abs(a) * Math.abs(b))}` }
};
const SPROWS = [[3, 4], [-2, -5], [7, -2], [-1, 8]];
const SPCAP = {
  sum: [`${T('a=3,\\ b=4')}: ${T('|7|=7')} and ${T('3+4=7')}. Both positive: <b>equal</b>.`,
    `${T('a=-2,\\ b=-5')}: ${T('|-7|=7')} and ${T('2+5=7')}. Both negative: still <b>equal</b>.`,
    `${T('a=7,\\ b=-2')}: ${T('|5|=5')}, but ${T('7+2=9')}. Opposite signs partly cancel inside the bars: <b>not equal!</b>`,
    `${T('a=-1,\\ b=8')}: ${T('|7|=7')}, but ${T('1+8=9')}. Not equal again.`,
    `One <b>counterexample</b> is enough: ${T('|a+b|=|a|+|b|')} is <b>false</b> in general. (It works when ${T('a')} and ${T('b')} have the same sign.)`],
  prod: [`${T('a=3,\\ b=4')}: ${T('|12|=12')} and ${T('3\\times4=12')}. <b>Equal</b>.`,
    `${T('a=-2,\\ b=-5')}: ${T('|10|=10')} and ${T('2\\times5=10')}. <b>Equal</b>.`,
    `${T('a=7,\\ b=-2')}: ${T('|-14|=14')} and ${T('7\\times2=14')}. <b>Equal</b>.`,
    `${T('a=-1,\\ b=8')}: ${T('|-8|=8')} and ${T('1\\times8=8')}. <b>Equal</b>.`,
    `Every row matches: the sizes multiply and the sign drops away either way. That’s the rule ${T('|ab|=|a|\\,|b|')} (and ${T('\\left|\\frac{a}{b}\\right|=\\frac{|a|}{|b|}')}).`]
};
const splitDef = {
  title: 'Can the bars be split?', height: 340, capH: 86,
  choices: [{ v: 'sum', label: `${T('|a+b|')} vs ${T('|a|+|b|')}` }, { v: 'prod', label: `${T('|ab|')} vs ${T('|a|\\,|b|')}` }, { v: 'ex5', label: 'Example 5(a) check' }],
  ask: (v) => (v === 'ex5' ? `Let ${T('a=-4')} and ${T('b=6')}. Compare ${T('|a+b|')} with ${T('|a|+|b|')}, and ${T('|ab|')} with ${T('|a|\\,|b|')}.` : v === 'sum' ? `Is ${T('|a+b|=|a|+|b|')} for every ${T('a')} and ${T('b')}? Try everything.` : `Is ${T('|ab|=|a|\\,|b|')} for every ${T('a')} and ${T('b')}? Try everything.`),
  make(stage, v, ex) {
    const W = ex.W;
    if (v === 'ex5') {
      const L = checkCard(stage, { title: 'Sums', at: 'a=-4,\\ b=6', left: ['|a+b|', '|-4+6|', '|2|', '2'].map(fixBars), right: ['|a|+|b|', '|-4|+|6|', '4+6', '10'].map(fixBars), ok: false, x: 20, y: 10, width: (W - 70) / 2, hidden: true });
      const R = checkCard(stage, { title: 'Products', at: 'a=-4,\\ b=6', left: ['|ab|', '|(-4)(6)|', '|-24|', '24'].map(fixBars), right: ['|a|\\,|b|', '|-4|\\,|6|', '4\\times6', '24'].map(fixBars), ok: true, x: W / 2 + 15, y: 10, width: (W - 70) / 2, hidden: true });
      return [
        { cap: `${T('|a+b|=|-4+6|=|2|=2')}, but ${T('|a|+|b|=4+6=10')}: <b>not equal</b>. The bars can’t be split over a sum.`, run: (c) => L.play(c) },
        { cap: `${T('|ab|=|-24|=24')} and ${T('|a|\\,|b|=4\\times6=24')}: <b>equal</b>. Over a product, they can.`, run: (c) => R.play(c) }
      ];
    }
    const S = SP[v], cw = 124;
    const tb = new ValueTable(stage, { x: 24, y: 10, headers: [...S.hd.map(fixBars), '\\text{same?}'], rows: SPROWS.map(([a, b]) => [a, b, '', '', '']), tap: false, cellW: cw, cellH: 60 });
    tb.heads.forEach((e, i) => { if (i === 2) e.classList.add('u7l1-thl'); if (i === 3) e.classList.add('u7l1-thr'); });
    const sx = (24 + cw * 5 + W) / 2;
    const big = hide(stamp(stage, v === 'sum' ? 'NOT always equal' : 'always equal', { ok: v !== 'sum', x: sx, y: 150 }));
    const cx = hide(stamp(stage, 'counterexample', { ok: false, x: sx, y: 10 + 60 * 3.5 + 0, size: 'sm' }));
    const steps = SPROWS.map(([a, b], i) => {
      const eq = Math.abs(S.L(a, b) - S.R(a, b)) < 1e-9;
      return { cap: SPCAP[v][i], run: async (c) => {
        tb.highlight(i, true);
        await tb.set(i, 2, fixBars(S.lt(a, b)), c); await tb.set(i, 3, S.rt(a, b), c);
        await tb.set(i, 4, { html: eq ? '<span class="u7l1-yes">✓ yes</span>' : '<span class="u7l1-no">✗ no</span>' }, c);
        if (!eq && i === 2) await stampIn(c, cx);
        tb.highlight(i, false);
      } };
    });
    steps.push({ cap: SPCAP[v][4], run: async (c) => { if (v === 'sum') { hide(cx); } await stampIn(c, big); } });
    return steps;
  }
};

/* ================================ 4. the distance between two numbers ================================ */
const BT = {
  demo: { a: -3, b: 5, aT: '-3', bT: '5' },
  ex6: [
    { k: '(a)', a: 9, b: 2, aT: '9', bT: '2', w: '|9-2|=7', cap: `(a) From ${T('9')} to ${T('2')}: ${T('7')} units. ${T('|9-2|=7')}.` },
    { k: '(b)', a: -6, b: 4, aT: '-6', bT: '4', w: '|-6-4|=|-10|=10', cap: `(b) From ${T('-6')} to ${T('4')}: ${T('10')} units. ${T('|-6-4|=|-10|=10')}: the sign drops away.` },
    { k: '(c)', a: -11, b: -3, aT: '-11', bT: '-3', w: '|-11-(-3)|=|-8|=8', cap: `(c) From ${T('-11')} to ${T('-3')}: ${T('8')} units. ${T('|-11-(-3)|=|-8|=8')}.` },
    { k: '(d)', a: -2.75, b: 1.5, aT: '-2.75', bT: '1.5', w: '|-2.75-1.5|=|-4.25|=4.25', cap: `(d) From ${T('-2.75')} to ${T('1.5')}: ${T('|-2.75-1.5|=|-4.25|=4.25')} units.` },
    { k: '(e)', a: Math.SQRT2, b: -Math.sqrt(8), aT: '\\sqrt{2}', bT: '-\\sqrt{8}', fin: '3\\sqrt{2}', w: '|\\sqrt{2}-(-2\\sqrt{2})|=|3\\sqrt{2}|=3\\sqrt{2}', cap: `(e) ${T('-\\sqrt{8}=-2\\sqrt{2}')}, so the distance is ${T('|\\sqrt{2}-(-2\\sqrt{2})|=3\\sqrt{2}\\approx4.24')}. Exact: ${T('3\\sqrt{2}')}.` }
  ]
};
function betweenItem(S, it, two = false) {
  return { cap: it.cap, run: async (c) => {
    S.reset();
    const ta = S.tag(it.a, { plain: it.aT }), tb = S.tag(it.b, { plain: it.bT }); await Promise.all([S.showTag(c, ta), S.showTag(c, tb)]);
    S.w[0].at(S.px(it.a), S.ay);
    await S.walk(c, it.a, it.b, { finT: it.fin || nt(Math.abs(it.a - it.b)) });
    await S.result(c, it.w);
  } };
}
const betweenDef = {
  title: 'Walk from one to the other', height: 336, capH: 86,
  choices: [{ v: 'demo', label: `${T('-3')} and ${T('5')}` }, { v: 'ex6', label: 'Example 6 check' }],
  ask: (v) => (v === 'demo' ? `How far apart are ${T('-3')} and ${T('5')}?` : `Example 6: the distance between ${T('9,\\,2')}; ${T('-6,\\,4')}; ${T('-11,\\,-3')}; ${T('-2.75,\\,1.5')}; ${T('\\sqrt{2},\\,-\\sqrt{8}')}. (f) Which numbers are ${T('4')} units from ${T('-1')}?`),
  make(stage, v, ex) {
    if (v === 'demo') {
      const S = new WalkScene(stage, ex, { min: -5, max: 7, ctrLabel: 'distance apart' }), D = BT.demo;
      return [
        { cap: `Two numbers, ${T('-3')} and ${T('5')}. Walk from ${T('-3')} to ${T('5')} and count: <b>${T('8')} units</b>.`, run: async (c) => {
          const ta = S.tag(D.a, { plain: D.aT }), tb = S.tag(D.b, { plain: D.bT }); await Promise.all([S.showTag(c, ta), S.showTag(c, tb)]);
          S.w[0].at(S.px(D.a), S.ay); await S.walk(c, D.a, D.b, { finT: '8' });
        } },
        { cap: `Subtract one way: ${T('5-(-3)=8')}. The distance is ${T('|5-(-3)|=8')}.`, run: (c) => S.result(c, '|5-(-3)|=|8|=8') },
        { cap: `Subtract the other way: ${T('-3-5=-8')}. The bars drop the sign: ${T('|-3-5|=8')}. <b>Either order</b> gives the distance: ${T('|a-b|=|b-a|')}.`, run: async (c) => {
          S.res.classList.add('u7l1-res2'); await S.result(c, '|5-(-3)|=|8|=8\\\\|-3-5|=|-8|=8');
          S.N.layers.data.innerHTML = ''; const a = await S.arc(-3, 5, '8'); await S.N.drawIn(a, 600, c);
        } }
      ];
    }
    const S = new WalkScene(stage, ex, { min: -12, max: 10, labelStep: 2, ctrLabel: 'distance apart' });
    const steps = BT.ex6.map((it) => betweenItem(S, it));
    steps.push({ cap: `(f) The numbers ${T('4')} units from ${T('-1')}: walk ${T('4')} units <b>each way</b>. ${T('-1+4=3')} and ${T('-1-4=-5')}.`, run: async (c) => {
      S.reset(); const t0 = S.tag(-1, { plain: '-1' }); await S.showTag(c, t0);
      S.w[0].at(S.px(-1), S.ay); S.w[1].at(S.px(-1), S.ay); S.w[1].g.style.display = '';
      await Promise.all([S.walk(c, -1, 3, { finT: '4' }), S.walk(c, -1, -5, { k: 1, ctr: false })]);
      const t1 = S.tag(3, { plain: '3', cls: 'u7l1-tagd', color: AB }), t2 = S.tag(-5, { plain: '-5', cls: 'u7l1-tagd', color: AB });
      await Promise.all([S.showTag(c, t1), S.showTag(c, t2)]);
      await S.result(c, '-1+4=3\\quad\\text{and}\\quad -1-4=-5');
    } });
    return steps;
  }
};

/* ================================ Example 7: only the size matters ================================ */
function thermo(stage, ex) {
  const W = ex.W, top = 30, bot = 360, lo = -20, hi = 10, X = 250;
  const y = (t) => bot - (t - lo) * (bot - top) / (hi - lo);
  const s = svgEl('svg', { class: 'u7l1-ov', width: W, height: 430 }, stage);
  svgEl('rect', { x: X - 16, y: top - 14, width: 32, height: bot - top + 30, rx: 16, fill: '#fff', stroke: SL, 'stroke-width': 3.5 }, s);
  svgEl('circle', { cx: X, cy: bot + 34, r: 30, fill: RED, stroke: SL, 'stroke-width': 3.5 }, s);
  const liq = svgEl('rect', { x: X - 8, y: y(-17), width: 16, height: bot + 20 - y(-17), fill: RED }, s);
  for (let t = lo; t <= hi; t += 5) {
    svgEl('line', { x1: X + 18, x2: X + 34, y1: y(t), y2: y(t), stroke: SL, 'stroke-width': 2.5 }, s);
    const tx = svgEl('text', { x: X + 42, y: y(t) + 6, class: 'u7l1-svgt' }, s); tx.textContent = (t < 0 ? '−' : '') + Math.abs(t) + ' °C';
  }
  for (let t = lo; t <= hi; t++) if (t % 5) svgEl('line', { x1: X + 18, x2: X + 26, y1: y(t), y2: y(t), stroke: SL, 'stroke-width': 1.5 }, s);
  const mk = (t, txt, col) => { const g = svgEl('g', {}, s); svgEl('line', { x1: X - 70, x2: X - 18, y1: y(t), y2: y(t), stroke: col, 'stroke-width': 3, 'stroke-dasharray': '6 5' }, g); const tx = svgEl('text', { x: X - 78, y: y(t) + 6, class: 'u7l1-svgt u7l1-svgb', 'text-anchor': 'end', fill: col }, g); tx.textContent = txt; return g; };
  const m1 = mk(-17, 'low −17 °C', IN), m2 = hide(mk(4, 'high 4 °C', RED));
  const br = hide(svgEl('g', {}, s));
  svgEl('path', { d: `M${X + 120} ${y(-17)} L${X + 134} ${y(-17)} L${X + 134} ${y(4)} L${X + 120} ${y(4)}`, fill: 'none', stroke: AB, 'stroke-width': 4 }, br);
  const ctr = div(stage, 'u7l1-ctr', '<div class="u7l1-ctr-h">rise</div><div class="u7l1-ctr-v">0</div><div class="u7l1-ctr-u">degrees</div>', X + 150, y(-6) - 44, 200, 88);
  const cv = ctr.querySelector('.u7l1-ctr-v');
  const res = hide(div(stage, 'u7l1-res u7l1-res2', T('|4-(-17)|=|21|=21\\\\|-17-4|=|-21|=21'), X + 380, 120, W - X - 390, 120));
  return [
    { cap: `The overnight low: ${T('-17\\,^\\circ\\text{C}')}. The afternoon high: ${T('4\\,^\\circ\\text{C}')}.`, run: (c) => show(c, m2) },
    { cap: `The temperature rises from ${T('-17')} to ${T('4')}: count the degrees. ${T('17')} up to ${T('0')}, then ${T('4')} more: <b>${T('21')} degrees</b>.`, run: async (c) => {
      await tween(c, 2600, (t) => { const v = -17 + 21 * t; liq.setAttribute('y', y(v)); liq.setAttribute('height', bot + 20 - y(v)); cv.textContent = String(Math.floor(21 * t + 1e-9)); }, linear);
      cv.textContent = '21'; await show(c, br);
    } },
    { cap: `Only the size of the change matters: ${T('|4-(-17)|=|21|=21')}, a change of <b>${T('21\\,^\\circ\\text{C}')}</b>. (The other order gives ${T('|-21|=21')} too.)`, run: (c) => show(c, res) }
  ];
}
function elevator(stage, ex) {
  const W = ex.W, F = 22, fh = 17, base = 412, X0 = 40, BW = 170, sx = 112;
  const fy = (n) => base - (n - 0.5) * fh;
  const s = svgEl('svg', { class: 'u7l1-ov', width: 380, height: 430 }, stage);
  svgEl('rect', { x: X0, y: base - F * fh, width: BW, height: F * fh, fill: '#f4efe5', stroke: SL, 'stroke-width': 3.5 }, s);
  svgEl('rect', { x: sx - 4, y: base - F * fh, width: 52, height: F * fh, fill: '#e3ddcf' }, s);
  for (let n = 1; n <= F; n++) {
    svgEl('line', { x1: X0, x2: X0 + BW, y1: base - n * fh, y2: base - n * fh, stroke: '#cfc8b8', 'stroke-width': 1.2 }, s);
    const t = svgEl('text', { x: X0 + 26, y: fy(n) + 5, class: 'u7l1-svgs', 'text-anchor': 'middle' }, s); t.textContent = n;
    if (n % 2) { svgEl('rect', { x: X0 + 120, y: fy(n) - 5, width: 12, height: 9, fill: '#bcd7f3' }, s); svgEl('rect', { x: X0 + 142, y: fy(n) - 5, width: 12, height: 9, fill: '#bcd7f3' }, s); }
  }
  const car = svgEl('g', {}, s);
  svgEl('rect', { x: sx, y: -8, width: 44, height: 16, rx: 3, fill: COLORS.brand, stroke: INK, 'stroke-width': 2 }, car);
  svgEl('line', { x1: sx + 22, x2: sx + 22, y1: -8, y2: 8, stroke: '#fff', 'stroke-width': 1.5 }, car);
  const cable = svgEl('line', { x1: sx + 22, x2: sx + 22, y1: base - F * fh, y2: fy(14) - 8, stroke: SL, 'stroke-width': 1.5 }, s);
  const put = (f) => { car.setAttribute('transform', `translate(0 ${fy(f)})`); cable.setAttribute('y2', fy(f) - 8); };
  put(14);
  const X = 400;
  const fl = div(stage, 'u7l1-ctr u7l1-floor', '<div class="u7l1-ctr-h">floor</div><div class="u7l1-ctr-v">14</div>', X, 8, 150, 92);
  const net = div(stage, 'u7l1-ctr u7l1-net', '<div class="u7l1-ctr-h">net change</div><div class="u7l1-ctr-v">0</div><div class="u7l1-ctr-u">keeps the signs</div>', X + 166, 8, 200, 92);
  const tot = div(stage, 'u7l1-ctr', '<div class="u7l1-ctr-h">floors travelled</div><div class="u7l1-ctr-v">0</div><div class="u7l1-ctr-u">adds the sizes</div>', X + 382, 8, W - X - 390, 92);
  const [flV, netV, totV] = [fl, net, tot].map((e) => e.querySelector('.u7l1-ctr-v'));
  const tb = new ValueTable(stage, { x: X, y: 118, headers: ['\\text{trip}', '\\text{change}', '\\text{size}', '\\text{floor}'], rows: [[1, '', '', ''], [2, '', '', ''], [3, '', '', ''], [4, '', '', '']], tap: false, cellW: 132, cellH: 46 });
  const fin = hide(div(stage, 'u7l1-res u7l1-res2 u7l1-elres', T('\\text{net: }7-15+4-9=-13\\ \\Rightarrow\\ \\text{floor }14-13=1') + '<br>' + T('\\text{total: }|7|+|-15|+|4|+|-9|=35\\ \\text{floors}'), X, 356, W - X - 6, 72));
  const trips = [7, -15, 4, -9]; let f = 14, n = 0, d = 0;
  const data = trips.map((t) => { const a = { t, f0: f, n0: n, d0: d }; f += t; n += t; d += Math.abs(t); return Object.assign(a, { f1: f, n1: n, d1: d }); });
  const sg = (v) => (v > 0 ? '+' + v : v < 0 ? '−' + Math.abs(v) : '0');
  const caps = [
    `Trip 1: up ${T('7')}, to floor ${T('21')}. Net change ${T('+7')}, floors travelled ${T('7')}.`,
    `Trip 2: down ${T('15')}, to floor ${T('6')}. The net change goes <b>down</b> (${T('7-15=-8')}), but the floors travelled go <b>up</b>: ${T('7+15=22')}.`,
    `Trip 3: up ${T('4')}, to floor ${T('10')}. Net ${T('-8+4=-4')}, travelled ${T('22+4=26')}.`,
    `Trip 4: down ${T('9')}, to floor ${T('1')}. Net ${T('-4-9=-13')}, travelled ${T('26+9=35')}.`
  ];
  const steps = data.map((D, i) => ({ cap: caps[i], run: async (c) => {
    tb.highlight(i, true);
    await tb.set(i, 1, (D.t > 0 ? '+' : '') + D.t, c);
    const ms = 360 + Math.abs(D.t) * 120;
    await tween(c, ms, (t) => {
      const ff = D.f0 + D.t * t; put(ff); flV.textContent = String(Math.round(ff));
      netV.textContent = sg(Math.round(D.n0 + D.t * t)); totV.textContent = String(Math.round(D.d0 + Math.abs(D.t) * t));
    });
    put(D.f1); flV.textContent = String(D.f1); netV.textContent = sg(D.n1); totV.textContent = String(D.d1);
    await tb.set(i, 2, fixBars(`|${D.t}|=${Math.abs(D.t)}`), c); await tb.set(i, 3, D.f1, c);
    tb.highlight(i, false);
  } }));
  steps.push({ cap: `It finishes on floor <b>${T('1')}</b> and travels <b>${T('35')} floors</b>. The net change keeps the signs; the total distance adds the absolute values.`, run: (c) => show(c, fin) });
  return steps;
}
function bolts(stage, ex) {
  const W = ex.W, ay = 120;
  const N = new NumberLine(stage, { x: 10, y: 196, width: W - 20, height: 200, axisY: ay, min: 44.75, max: 45.25, step: 0.05, labelStep: 0.05, fontSize: 16, labels: (v) => T(v.toFixed(2)) });
  const band = N.interval(44.85, 45.15, { color: 'green', width: 12 }); band.style.opacity = 0.55;
  N.point(45, { color: INK, r: 6 });
  const lab = div(stage, 'u7l1-blab', `accepted: within ${T('0.15')} of ${T('45.00')}`, 0, 196 + ay + 52); lab.style.left = (10 + N.toPx(45)) + 'px';
  const L0 = 10 + 6;
  const rod = svgEl('svg', { class: 'u7l1-ov', width: W, height: 330 }, stage);
  const boltG = svgEl('g', {}, rod);
  svgEl('rect', { x: -1000, y: 132, width: 1000, height: 26, fill: '#c9cdd4', stroke: SL, 'stroke-width': 2.5 }, boltG);
  for (let i = 1; i < 60; i++) svgEl('line', { x1: -i * 11, x2: -i * 11 - 6, y1: 132, y2: 158, stroke: '#8a909a', 'stroke-width': 2 }, boltG);
  const drop = svgEl('line', { x1: 0, x2: 0, y1: 160, y2: 196 + ay, stroke: SL, 'stroke-width': 2, 'stroke-dasharray': '5 5' }, rod);
  drop.style.opacity = 0;
  const list = div(stage, 'u7l1-blist', '', 14, 6, W - 28, 60);
  const put = (L) => { const px = 10 + N.toPx(L); boltG.setAttribute('transform', `translate(${px} 0)`); drop.setAttribute('x1', px); drop.setAttribute('x2', px); };
  boltG.setAttribute('transform', `translate(${L0} 0)`);
  const Ls = [44.82, 45.09, 45.15, 45.21];
  const res = Ls.map((L) => { const d = r6(Math.abs(L - 45)); return { L, d, ok: d <= 0.15 + 1e-9 }; });
  const steps = res.map((R, i) => ({ cap: `${T(R.L.toFixed(2))} mm: ${T(`|${R.L.toFixed(2)}-45.00|=${R.d.toFixed(2)}`)}${R.ok ? (R.d === 0.15 ? `. Exactly ${T('0.15')}: ${T('\\le')} includes it, <b>accepted</b>.` : ` ${T('\\le0.15')}: <b>accepted</b>.`) : ` ${T('>0.15')}: <b>rejected</b>.`}`, run: async (c) => {
    N.layers.data.querySelectorAll('.bk-hop').forEach((e) => e.remove()); N.html.innerHTML = '';
    drop.style.opacity = 0;
    await tween(c, 1100, (t) => put(44.7 + (R.L - 44.7) * t));
    put(R.L); drop.style.opacity = 1;
    const hp = await N.hop(c, 45, R.L, { color: R.ok ? 'green' : 'red', height: 44, label: T(R.d.toFixed(2)) });
    const chip = h('span', 'u7l1-bchip ' + (R.ok ? 'u7l1-ok' : 'u7l1-bad'), `${T(R.L.toFixed(2))}<b>${R.ok ? '✓ accepted' : '✗ rejected'}</b>`);
    list.appendChild(chip); await pop(c, chip, 320);
    if (!R.ok) await shake(c, chip);
    void hp;
  } }));
  steps.push({ cap: `The <b>45.09 mm</b> and <b>45.15 mm</b> bolts are accepted: ${T('|L-45.00|\\le0.15')} means ${T('L')} is at most ${T('0.15')} from the target.`, run: async (c) => { list.querySelectorAll('.u7l1-ok').forEach((e) => e.classList.add('u7l1-win')); await pulse(c, list, 1.03); } });
  return steps;
}
const contextDef = {
  title: 'Only the size matters', height: 430, capH: 86,
  choices: [{ sep: 'Example 7' }, { v: 'a', label: '(a) Temperature' }, { v: 'b', label: '(b) Elevator' }, { v: 'c', label: '(c) Bolts' }],
  ask: (v) => (v === 'a' ? `From ${T('-17\\,^\\circ\\text{C}')} to ${T('4\\,^\\circ\\text{C}')}: by how many degrees did the temperature change?` : v === 'b' ? `Floor ${T('14')}, trips ${T('+7,\\ -15,\\ +4,\\ -9')}: which floor at the end, and how many floors in all?` : `Accepted if ${T('|L-45.00|\\le0.15')}: ${T('44.82,\\ 45.09,\\ 45.15,\\ 45.21')} mm?`),
  make(stage, v, ex) { return v === 'a' ? thermo(stage, ex) : v === 'b' ? elevator(stage, ex) : bolts(stage, ex); }
};

/* ================================ 5. the piecewise rule as a machine ================================ */
const FK = {
  demo: { vals: [5, -6, 0], min: -8, max: 8 },
  ex8a: { vals: [-3.8, 2.4], min: -5, max: 5 },
  ex8e: { vals: [10, 1], min: -1, max: 12, shift: 4 }
};
const forkDef = {
  title: 'The two-road machine', height: 410, capH: 86,
  choices: [{ v: 'demo', label: `Try it: ${T('5,\\ -6,\\ 0')}` }, { v: 'ex8a', label: 'Example 8(a)' }, { v: 'ex8e', label: 'Example 8(e)' }],
  ask: (v) => (v === 'ex8a' ? `Use the definition to evaluate ${T('|-3.8|')} and ${T('|2.4|')}.` : v === 'ex8e' ? `Write ${T('|x-4|')} in piecewise form; evaluate it for ${T('x=10')} and ${T('x=1')}.` : `${T('|x|=\\begin{cases}x, & x\\ge0\\\\ -x, & x<0\\end{cases}')}: evaluate ${T('|5|,\\ |-6|,\\ |0|')}.`),
  make(stage, v, ex) {
    const W = ex.W, D = FK[v], sh = D.shift || 0, FW = 640, FH = 280;
    const inside = sh ? 'x-4' : 'x';
    const F = new Flowchart(stage, { x: 0, y: 0, width: FW, height: FH, nodes: {
      in: { x: 320, y: 34, w: 250, h: 54, html: `<b>in</b>${T('x=\\ ?')}`, cls: 'bk-round' },
      test: { x: 320, y: 128, w: 250, h: 92, html: T(`${inside}\\ge0\\,?`), cls: 'bk-diamond' },
      yes: { x: 120, y: 236, w: 230, h: 72, html: `<b>keep it</b>${T(`|${inside}|=${inside}`)}`, color: 'green' },
      no: { x: 520, y: 236, w: 236, h: 72, html: `<b>the opposite</b>${T(`|${inside}|=-(${inside})`)}`, color: 'red' }
    }, edges: [{ from: 'in', to: 'test' }, { from: 'test', to: 'yes', label: 'yes', route: 'hv' }, { from: 'test', to: 'no', label: 'no', route: 'hv' }] });
    const inEl = F.node('in').querySelector('.bk-fc-in'), yesEl = F.node('yes').querySelector('.bk-fc-in'), noEl = F.node('no').querySelector('.bk-fc-in'), tEl = F.node('test').querySelector('.bk-fc-in');
    const out = div(stage, 'u7l1-fout', '<div class="u7l1-fout-h">results</div>', FW + 14, 8, W - FW - 22, FH - 14);
    const N = new NumberLine(stage, { x: 10, y: FH, width: W - 20, height: 128, axisY: 78, min: D.min, max: D.max, step: 1, labelStep: 1, fontSize: 17 });
    if (sh) N.point(4, { color: INK, r: 6 });
    const tok = hide(div(stage, 'u7l1-tok', ''));
    const at = (id) => { const n = F.node(id).n; return [n.x, n.y]; };
    const move = (c, a, b, ms = 480) => anim(c, tok, [{ transform: `translate(${a[0]}px, ${a[1]}px) translate(-50%, -50%)` }, { transform: `translate(${b[0]}px, ${b[1]}px) translate(-50%, -50%)` }], ms);
    const steps = D.vals.map((x) => {
      const inner = r6(x - sh), yes = inner >= 0, val = r6(Math.abs(inner));
      const xT = nt(x), inT = sh ? `${xT}-4=${nt(inner)}` : xT;
      const resT = sh ? (yes ? `|${xT}-4|=${xT}-4=${nt(val)}` : `|${xT}-4|=4-${xT}=${nt(val)}`) : (yes ? `|${xT}|=${xT}` : `|${xT}|=-(${xT})=${nt(val)}`);
      const cap = sh
        ? (yes ? `${T(`x=${xT}`)}: ${T(`${xT}-4=${nt(inner)}\\ge0`)}, the <b>yes</b> road: ${T(`|x-4|=x-4=${nt(val)}`)}.` : `${T(`x=${xT}`)}: ${T(`${xT}-4=${nt(inner)}<0`)}, the <b>no</b> road: ${T(`|x-4|=-(x-4)=4-x=${nt(val)}`)}. Check: ${T(`|${nt(inner)}|=${nt(val)}`)}.`)
        : (yes ? `${T(`${xT}\\ge0`)}${x === 0 ? ' (≥ includes 0)' : ''}: the <b>yes</b> road. A number that is positive or zero is its own absolute value: ${T(`|${xT}|=${xT}`)}.` : `${T(`${xT}<0`)}: the <b>no</b> road. Take the opposite: ${T(`|${xT}|=-(${xT})=${nt(val)}`)}, a <b>positive</b> number.`);
      return { cap, run: async (c) => {
        F.reset(); N.layers.data.innerHTML = ''; N.layers.top.querySelectorAll('.u7l1-fp').forEach((e) => e.remove());
        N.html.querySelectorAll('.bk-hoplab').forEach((e) => e.remove());
        inEl.innerHTML = `<b>in</b>${T(`x=${xT}`)}`;
        yesEl.innerHTML = `<b>keep it</b>${T(`|${inside}|=${inside}`)}`; noEl.innerHTML = `<b>the opposite</b>${T(sh ? '|x-4|=4-x' : '|x|=-x')}`;
        tok.innerHTML = T(sh ? nt(inner) : xT); tok.classList.toggle('u7l1-tokn', inner < 0);
        await F.visit(c, 'in');
        const p = N.point(x, { color: inner < 0 ? RED : IN, r: 8 }); p.classList.add('u7l1-fp'); await pop(c, p, 300);
        tEl.innerHTML = T(sh ? `${inT}\\ge0\\,?` : `${xT}\\ge0\\,?`);
        tok.style.opacity = 1; await move(c, at('in'), at('test'), 420); await F.go(c, 'in', 'test'); await F.visit(c, 'test');
        const br = yes ? 'yes' : 'no';
        await move(c, at('test'), at(br), 520); await F.go(c, 'test', br); await F.visit(c, br);
        tok.style.opacity = 0;
        (yes ? yesEl : noEl).innerHTML = `<b>${yes ? 'keep it' : 'the opposite'}</b>${T(resT)}`;
        if (!sh && !yes) {
          const hp = await N.hop(null, x, val, { color: RED, height: 40, label: 'opposite' }); hide(hp.label); await N.drawIn(hp, 650, c); if (hp.label) await show(c, hp.label);
          const q = N.point(val, { color: AB, r: 8 }); q.classList.add('u7l1-fp'); await pop(c, q, 300);
        } else if (sh) {
          const hp = await N.hop(null, 4, x, { color: AB, height: 40, label: T(nt(val)) + ' units' }); hide(hp.label); await N.drawIn(hp, 650, c); if (hp.label) await show(c, hp.label);
        } else { p.querySelector('circle').setAttribute('fill', AB); await pulse(c, p, 1.2); }
        const line = h('div', 'u7l1-fo', T(resT)); out.appendChild(line); await show(c, line);
      } };
    });
    steps.push(sh
      ? { cap: `In pieces: ${T('|x-4|=x-4')} if ${T('x\\ge4')}, and ${T('4-x')} if ${T('x<4')}. Either way it is the <b>distance</b> between ${T('x')} and ${T('4')}.`, run: async (c) => { const l = h('div', 'u7l1-fo u7l1-fo2', T('|x-4|=\\begin{cases}x-4, & x\\ge4\\\\ 4-x, & x<4\\end{cases}')); out.appendChild(l); await show(c, l); } }
      : { cap: `Two roads, one rule: ${T('|x|=x')} if ${T('x\\ge0')}, and ${T('|x|=-x')} if ${T('x<0')}. On the <b>no</b> road ${T('x')} is negative, so ${T('-x')} is <b>positive</b>.`, run: async (c) => { const l = h('div', 'u7l1-fo u7l1-fo2', T('|x|=\\begin{cases}x, & x\\ge0\\\\ -x, & x<0\\end{cases}')); out.appendChild(l); await show(c, l); } });
    return steps;
  }
};

/* ================================ Stand Up Break ================================ */
const ab = (v) => Math.abs(v);
const fixQ = (fn) => (r) => { const o = fn(r); o.q = fixBars(o.q); o.a = [].concat(o.a).map(fixBars); return o; };
standup('u7l1', {
  intro: 'At your whiteboard: inside the bars first, then the absolute value, then finish.',
  levels: {
    BEG: fixQ((r) => {
      const t = r.int(1, 3);
      if (t === 1) { const p = r.int(1, 12), q = p + r.int(2, 12); return { q: `|${p}-${q}|`, a: [`|${p - q}|`, `${q - p}`] }; }
      if (t === 2) { const k = r.int(2, 15), m = r.int(2, 15); return { q: `|-${k}|-|${m}|`, a: [`${k}-${m}`, `${k - m}`] }; }
      const k = r.int(2, 15); return { q: `-|-${k}|`, a: [`-(${k})`, `-${k}`] };
    }),
    PRG: fixQ((r) => {
      const t = r.int(1, 2);
      if (t === 1) {
        const a = r.int(2, 5) * r.sign(), p = r.int(1, 9), q = p + r.int(2, 9), k = r.int(2, 6);
        const inner = p - q, v = a * ab(inner) + k * k;
        return { q: `${a}|${p}-${q}|+|-${k}|^2`, a: [`${a}|${inner}|+|-${k}|^2`, `${a}(${ab(inner)})+${k}^2`, `${a * ab(inner)}+${k * k}=${v}`] };
      }
      const x = -r.int(1, 6), m = r.int(2, 5), b = r.int(1, 9), inner = m * x - b;
      return { q: `|${m}x-${b}|\\ \\text{for}\\ x=${x}`, a: [`|${m}(${x})-${b}|`, `|${inner}|`, `${ab(inner)}`] };
    }),
    MAS: fixQ((r) => {
      const t = r.int(1, 3);
      if (t === 1) {
        const a = -r.int(2, 12) - r.pick([0, 0.5, 0.25]), b = r.int(1, 12) + r.pick([0, 0.5, 0.75]);
        return { q: `\\text{Distance between } ${nt(a)} \\text{ and } ${nt(b)}`, a: [`|${sub(a, b)}|=|${nt(a - b)}|`, nt(ab(a - b))] };
      }
      if (t === 2) { const a = r.int(-9, 9), d = r.int(2, 9); return { q: `\\text{Numbers } ${d} \\text{ units from } ${a}`, a: [`${a}+${d}=${a + d}`, `${a}-${d}=${a - d}`] }; }
      const k = r.int(2, 7) * r.sign(); return { q: `\\text{If } x<0,\\ \\text{simplify } |x|${k > 0 ? '+' : ''}${k}x`, a: ['|x|=-x', `-x${k > 0 ? '+' : ''}${k}x=${k - 1 === 1 ? '' : k - 1 === -1 ? '-' : k - 1}x`] };
    })
  }
});

/* ================================ mount ================================ */
export const explainers = mountExplainers({ walker: walkerDef, bars: barsDef, split: splitDef, between: betweenDef, context: contextDef, fork: forkDef });
export const _test = { WK, BR, BT, FK };
