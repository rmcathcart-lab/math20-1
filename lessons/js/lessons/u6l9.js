/* Math 20-1 · Unit 6 · Lesson 9 — Problems Involving Rational Equations (work, motion, numbers).
 * New lesson format (2026-11-11): the warm-up ("The Hill Climb") is plain markup on the page (no code). Explainers:
 *   plan   (the five-step plan as a rail; the sentence translated tile by tile into the equation, NPVs and the LCD,
 *           the roots with keep / reject verdicts, the check in words; Example 1(a), (b), (c)),
 *   trips  (STAR: a race scene that runs in step with the distance–speed–time table: distances, speeds, Time = d ÷ s,
 *           the time sentence, solve, reject, then the trips race on the clock; Examples 2, 3, 4),
 *   river  (STAR: two boats on a flowing river; speed arrows show the current adding downstream and subtracting
 *           upstream while the table fills; then both boats race their 24 km on the clock; Example 5),
 *   job    (STAR: a job split into LCD-many pieces (12 fence boards …) that two workers fill from both ends at their
 *           own rates, a drain that undoes the work, a late joiner; Examples 6(a)–(d) and 7(a)),
 *   shots  (free throws: the 25 shots so far, then 19 makes in a row while the success meter crawls up to 75%;
 *           Example 8(a)).
 * Colours: distance ink, speed amber, time blue, the unknown purple, the current teal, worker A blue, worker B orange,
 *   kept roots green, rejected red. */
import { h, tex, add, box, mountExplainers, pop, fadeIn, tween, anim, svgEl, pulse, shake, linear, COLORS } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const OK = COLORS.green, NO = COLORS.red, CUR = '#0e8a9a', WA = COLORS.blue, WB = '#d9730d';
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const fadeOut = (c, el) => anim(c, el, [{ opacity: 1 }, { opacity: 0 }], 260);
const div = (host, cls, html, x, y, w, hh) => { const d = h('div', cls, html); if (w != null || hh != null) box(d, w, hh); if (x != null) d.style.position = 'absolute'; return add(host, d, x, y); };
/* a work line with its plan-step number (n) beside it, and an optional note on the right */
const wl = (p, n, html, note, cls = '') => {
  const d = h('div', 'u6l9-wl ' + cls, `<b class="u6l9-sn${n ? '' : ' u6l9-sn0'}">${n || ''}</b><span class="u6l9-lt">${html}</span>${note ? `<span class="u6l9-note">${note}</span>` : ''}`);
  p.appendChild(d); return hide(d);
};
/* a row of candidate roots, each with a keep / reject verdict that pops in later */
const candRow = (p, cands) => {
  const row = h('div', 'u6l9-cands'); p.appendChild(row); hide(row);
  const vs = cands.map(([t, ok, why]) => { const e = h('span', 'u6l9-cand', `<span class="u6l9-ct">${T(t)}</span><span class="u6l9-verd ${ok ? 'ok' : 'no'}">${ok ? '✓' : '✗'} ${why}</span>`); row.appendChild(e); return { e, v: hide(e.querySelector('.u6l9-verd')), ok }; });
  row.play = async (c) => { for (const x of vs) { await pop(c, x.v); if (!x.ok) { x.e.classList.add('out'); await shake(c, x.e); } } };
  return row;
};
const hm = (t) => { let H = Math.floor(t + 1e-9), m = Math.round((t - H) * 60); if (m === 60) { H++; m = 0; } return `${H} h ${String(m).padStart(2, '0')} min`; };
const hmS = (t) => { let H = Math.floor(t + 1e-9), m = Math.round((t - H) * 60); if (m === 60) { H++; m = 0; } return !H ? `${m} min` : m ? `${H} h ${m} min` : `${H} h`; };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* =============================== explainer: the five-step plan (number problems) =============================== */
const PL = {
  a: { label: 'Example 1(a)', ask: `Example 1(a): the sum of a number and twice its reciprocal is ${T('\\tfrac{11}{3}')}. Determine the number.`,
    letCap: `Let ${T('n')} be the number. It has a reciprocal, so ${T('n\\ne0')}.`, let: `the number: ${T('n')}`,
    tiles: [['a number', 'n'], ['and (sum)', '+'], ['twice its reciprocal', '2\\cdot\\dfrac{1}{n}=\\dfrac{2}{n}'], ['is', '='], ['eleven thirds', '\\dfrac{11}{3}']],
    eq: 'n+\\dfrac{2}{n}=\\dfrac{11}{3}', npv: 'n\\ne0', lcd: '3n',
    sol: ['3n^2+6=11n', '3n^2-11n+6=0', '(3n-2)(n-3)=0'], solCap: 'standard form, then factor: <b>two</b> roots.',
    cands: [['n=\\tfrac{2}{3}', true, 'keep'], ['n=3', true, 'keep']],
    rej: 'Any number except 0 is allowed here, so <b>both roots are admissible</b>.',
    chk: ['3+\\tfrac{2}{3}=\\tfrac{11}{3}\\ \\checkmark', '\\tfrac{2}{3}+\\dfrac{2}{\\,2/3\\,}=\\tfrac{2}{3}+3=\\tfrac{11}{3}\\ \\checkmark'],
    ans: `The number is ${T('\\tfrac{2}{3}')} or ${T('3')}.` },
  b: { label: '(b)', ask: `Example 1(b): the sum of the reciprocals of two consecutive odd integers is ${T('\\tfrac{12}{35}')}. Determine the integers.`,
    letCap: `Let the integers be ${T('n')} and ${T('n+2')}: consecutive odd integers are 2 apart.`, let: `the integers: ${T('n,\\ n+2')}`,
    tiles: [['reciprocal of the first', '\\dfrac{1}{n}'], ['plus', '+'], ['reciprocal of the next', '\\dfrac{1}{n+2}'], ['is', '='], ['twelve thirty-fifths', '\\dfrac{12}{35}']],
    eq: '\\dfrac{1}{n}+\\dfrac{1}{n+2}=\\dfrac{12}{35}', npv: 'n\\ne0,\\ -2', lcd: '35n(n+2)',
    sol: ['35(n+2)+35n=12n(n+2)', '70n+70=12n^2+24n', '6n^2-23n-35=0', '(n-5)(6n+7)=0'], solCap: 'expand, standard form (divide by 2), factor: <b>two</b> roots.',
    cands: [['n=5', true, 'keep'], ['n=-\\tfrac{7}{6}', false, 'not an integer']],
    rej: `${T('-\\tfrac{7}{6}')} is <b>not an integer</b>, and the question asks for integers: reject it. Keep ${T('n=5')}.`,
    chk: ['\\tfrac{1}{5}+\\tfrac{1}{7}=\\tfrac{7+5}{35}=\\tfrac{12}{35}\\ \\checkmark'],
    ans: 'The integers are <b>5 and 7</b>.' },
  c: { label: '(c)', ask: `Example 1(c): a fraction’s denominator is 5 more than its numerator. Adding 3 to both gives ${T('\\tfrac{3}{4}')}. Determine the fraction.`,
    letCap: `Let the numerator be ${T('n')}. The denominator is 5 more: ${T('n+5')}.`, let: `the fraction: ${T('\\dfrac{n}{n+5}')}`,
    tiles: [['numerator + 3', 'n+3'], ['denominator + 3', '(n+5)+3=n+8'], ['the new fraction', '\\dfrac{n+3}{n+8}'], ['is', '='], ['three quarters', '\\dfrac{3}{4}']],
    eq: '\\dfrac{n+3}{n+8}=\\dfrac{3}{4}', npv: 'n\\ne-8', lcd: '4(n+8)',
    sol: ['4(n+3)=3(n+8)', '4n+12=3n+24', 'n=12'], solCap: 'expand and collect the terms: <b>one</b> root.',
    cands: [['n=12', true, 'keep']],
    rej: 'One root, and it makes a real fraction: <b>keep it</b>.',
    chk: ['\\dfrac{12+3}{17+3}=\\dfrac{15}{20}=\\dfrac{3}{4}\\ \\checkmark'],
    ans: `The fraction is ${T('\\dfrac{12}{17}')}.` }
};
const RAIL = ['Let a variable', 'Write the equation', 'NPVs, LCD, solve', 'Reject roots', 'Check, answer'];
function rail(stage, x, y, w, hh) {
  const r = div(stage, 'u6l9-rail', '', x, y, w, hh);
  const pills = RAIL.map((t, i) => { const p = h('div', 'u6l9-rstep', `<b>${i + 1}</b><span>${t}</span>`); r.appendChild(p); return p; });
  return { pills, on: (i) => pills.forEach((p, j) => { p.classList.toggle('on', j === i); p.classList.toggle('done', j < i); }) };
}
const plan = {
  title: 'The five-step plan',
  height: 470, minW: 940,
  choices: [{ sep: 'Check:' }, ...Object.keys(PL).map((k) => ({ v: k, label: PL[k].label }))],
  ask: (v) => PL[v].ask,
  make(stage, v, ex) {
    const d = PL[v], W = ex.W, X = 196, SW = 318;
    const R = rail(stage, 4, 6, 180, 458);
    const tiles = div(stage, 'u6l9-tiles', '', X, 6, W - X - 6, 110);
    const tl = d.tiles.map(([w, m]) => { const t = h('div', 'u6l9-tile', `<span class="u6l9-tw">${w}</span><span class="u6l9-tm">${T(m)}</span>`); tiles.appendChild(t); return hide(t); });
    const tm = tl.map((t) => hide(t.querySelector('.u6l9-tm')));
    const P = div(stage, 'u6l9-panel', '', X, 126, W - X - 6 - SW - 10, 338);
    const Q = div(stage, 'u6l9-panel', '', W - 6 - SW, 126, SW, 338);
    const l1 = wl(P, 1, d.let), l2 = wl(P, 2, T(d.eq), '', 'u6l9-eqline');
    const l3 = wl(P, 3, T(d.npv), `× ${T(d.lcd)}`);
    const ls = d.sol.map((s) => wl(P, '', T(s)));
    const qh = hide(div(Q, 'u6l9-ph', 'Roots'));
    const cr = candRow(Q, d.cands);
    const ch = hide(div(Q, 'u6l9-ph u6l9-ph2', 'Check in words'));
    const ck = d.chk.map((t) => hide(div(Q, 'u6l9-ckl', T(t))));
    const an = hide(div(Q, 'u6l9-ansl', d.ans));
    return [
      { cap: `<b>1. Let a variable.</b> ${d.letCap}`, run: async (c) => { R.on(0); await show(c, l1); await Promise.all(tl.map((t) => show(c, t))); } },
      { cap: '<b>2. Write the equation:</b> translate the sentence piece by piece.', run: async (c) => { R.on(1); for (const m of tm) await pop(c, m); await show(c, l2); } },
      { cap: `<b>3.</b> The NPV: ${T(d.npv)}. Multiply <b>every term</b> by the LCD, ${T(d.lcd)}.`, run: async (c) => { R.on(2); await show(c, l3); await show(c, ls[0]); } },
      { cap: `<b>3. Solve:</b> ${d.solCap}`, run: async (c) => { for (const l of ls.slice(1)) await show(c, l); await show(c, qh); await show(c, cr); } },
      { cap: `<b>4. Reject inadmissible roots.</b> ${d.rej}`, run: async (c) => { R.on(3); await cr.play(c); } },
      { cap: '<b>5. Check in the words of the problem</b>, then answer the question.', run: async (c) => { R.on(4); await show(c, ch); for (const k of ck) await show(c, k); await pop(c, an); R.pills[4].classList.add('done'); } }
    ];
  }
};

/* =============================== the distance–speed–time table (trips and river) =============================== */
const TCOL = [118, 104, 118, 136];
function dstTable(stage, x, y, rows) {
  const W = TCOL.reduce((a, b) => a + b, 0), HH = 46, RH = 74;
  const el = div(stage, 'u6l9-tab', '', x, y, W, HH + RH * rows.length);
  const cell = (cls, html, cx, cy, w, hh) => div(el, 'u6l9-tc ' + cls, html, cx, cy, w, hh);
  let cx = TCOL[0];
  ['Distance (km)', 'Speed (km/h)', 'Time (h)'].forEach((t, i) => { cell('u6l9-th u6l9-c' + i, t, cx, 0, TCOL[i + 1], HH); cx += TCOL[i + 1]; });
  const cells = rows.map((r, j) => {
    cell('u6l9-rh', r.name, 0, HH + j * RH, TCOL[0], RH);
    let x2 = TCOL[0];
    return [String(r.d), r.sT, r.tT].map((t, i) => { const e = cell('u6l9-c' + i, `<span class="u6l9-tv">${T(t)}</span>`, x2, HH + j * RH, TCOL[i + 1], RH); x2 += TCOL[i + 1]; return hide(e.firstChild); });
  });
  return { el, cells, W, H: HH + RH * rows.length };
}

/* =============================== explainer: trips (STAR) =============================== */
const TR = {
  e2: { label: 'Example 2', ask: 'Example 2: a cyclist rides 54 km in the same time that a runner covers 24 km. The cyclist is 15 km/h faster. Determine each speed.',
    rows: [{ name: 'Cyclist', em: '🚴', d: 54, sT: 's+15', tT: '\\dfrac{54}{s+15}', v: 27, t0: 0 }, { name: 'Runner', em: '🏃', d: 24, sT: 's', tT: '\\dfrac{24}{s}', v: 12, t0: 0 }],
    dCap: 'A row for each trip. The <b>distances</b> are given: 54 km and 24 km.',
    sCap: `Let ${T('s')} be the runner’s speed. The cyclist is 15 km/h faster: ${T('s+15')}.`,
    sent: ['Same time', 'the times are equal'], eq: '\\dfrac{54}{s+15}=\\dfrac{24}{s}', npv: 's\\ne0,\\ -15',
    eqCap: `The time sentence: the <b>same time</b>, so the two times are <b>equal</b> (${T('s\\ne0,\\ -15')}).`,
    sol: [['54s=24(s+15)', 'cross-multiply'], ['54s=24s+360', ''], ['30s=360', ''], ['s=12', '']],
    solCap: `Cross-multiply and solve: ${T('s=12')}. Only one root, and it is a sensible speed.`,
    raceCap: `Runner 12 km/h, cyclist ${T('12+15=27')} km/h. Race them: both take ${T('\\tfrac{54}{27}=\\tfrac{24}{12}=2')} h ✓`,
    ans: 'Runner <b>12 km/h</b>, cyclist <b>27 km/h</b>' },
  e3: { label: 'Example 3', ask: 'Example 3: a courier drives 160 km to a town and comes back 20 km/h faster, saving 40 minutes. Determine her speed each way and the return time.',
    rows: [{ name: 'Going', em: '🚗', d: 160, sT: 's', tT: '\\dfrac{160}{s}', v: 60, t0: 0 }, { name: 'Returning', em: '🚙', d: 160, sT: 's+20', tT: '\\dfrac{160}{s+20}', v: 80, t0: 0, back: true }],
    dCap: 'A row for each trip: 160 km there, and the same 160 km back.',
    sCap: `Let ${T('s')} be her speed going. Coming back she is 20 km/h faster: ${T('s+20')}.`,
    sent: ['40 min longer', 'longer time − shorter time = ⅔ h'], eq: '\\dfrac{160}{s}-\\dfrac{160}{s+20}=\\dfrac{2}{3}', npv: 's\\ne0,\\ -20',
    eqCap: `Going takes <b>40 min longer</b>: longer time − shorter time ${T('=\\tfrac{40}{60}=\\tfrac{2}{3}')} h.`,
    sol: [['480(s+20)-480s=2s(s+20)', `× ${T('3s(s+20)')}`], ['9600=2s^2+40s', ''], ['s^2+20s-4800=0', '÷ 2'], ['(s-60)(s+80)=0', 'factor']],
    solCap: `Multiply every term by the LCD ${T('3s(s+20)')}, then standard form and factor.`,
    cands: [['s=60', true, 'keep'], ['s=-80', false, 'negative speed']],
    rejCap: `${T('s=-80')} is a <b>negative speed</b>: reject it. She drives 60 km/h going and ${T('60+20=80')} km/h back.`,
    raceCap: `Race the two trips: back at 80 km/h takes <b>2 h</b>; going at 60 km/h takes ${T('2\\tfrac{2}{3}')} h = 2 h 40 min. 40 min saved ✓`,
    ans: 'Going <b>60 km/h</b>, returning <b>80 km/h</b> in <b>2 h</b>' },
  e4: { label: 'Example 4', ask: 'Example 4: Mara cycles 15 km, then runs 6 km. She runs 12 km/h slower than she cycles, and the race takes 1.5 h. Determine both speeds.',
    rows: [{ name: 'Cycling', em: '🚴', d: 15, sT: 's', tT: '\\dfrac{15}{s}', v: 20, t0: 0 }, { name: 'Running', em: '🏃', d: 6, sT: 's-12', tT: '\\dfrac{6}{s-12}', v: 8, t0: 0.75 }],
    dCap: 'A row for each part of the race: 15 km cycling, then 6 km running.',
    sCap: `Let ${T('s')} be her cycling speed. Running is 12 km/h slower: ${T('s-12')}.`,
    sent: ['Total time', 'add the times'], eq: '\\dfrac{15}{s}+\\dfrac{6}{s-12}=\\dfrac{3}{2}', npv: 's\\ne0,\\ 12',
    eqCap: `The race takes 1.5 h in total: <b>add the times</b> and set the sum equal to ${T('\\tfrac{3}{2}')}.`,
    sol: [['30(s-12)+12s=3s(s-12)', `× ${T('2s(s-12)')}`], ['3s^2-78s+360=0', ''], ['s^2-26s+120=0', '÷ 3'], ['(s-6)(s-20)=0', 'factor']],
    solCap: `Multiply every term by the LCD ${T('2s(s-12)')}, then standard form and factor.`,
    cands: [['s=6', false, 'runs at −6 km/h'], ['s=20', true, 'keep']],
    rejCap: `${T('s=6')} would make her running speed ${T('6-12=-6')} km/h: <b>inadmissible</b>. So ${T('s=20')}, and she runs ${T('20-12=8')} km/h.`,
    raceCap: `Cycling 20 km/h for ${T('\\tfrac{15}{20}=0.75')} h, then running 8 km/h for ${T('\\tfrac{6}{8}=0.75')} h: 1.5 h in all ✓`,
    ans: 'Cycling <b>20 km/h</b>, running <b>8 km/h</b>' }
};
/* the race scene: one lane per row, length to scale, a clock; returns { lanes, clock, set(t), end } */
function raceScene(stage, x, y, w, hh, rows) {
  const sc = div(stage, 'u6l9-scene', '', x, y, w, hh);
  const RC = w - 236, clock = div(sc, 'u6l9-clock', `⏱ ${hm(0)}`, RC, 8, 222, 34);
  const x0 = 150, x1 = RC - 40, dmax = Math.max(...rows.map((r) => r.d)), k = (x1 - x0) / dmax;
  const lanes = rows.map((r, i) => {
    const ly = 70 + i * 74, L = r.d * k, xs = r.back ? x0 + L : x0, xe = r.back ? x0 : x0 + L;
    div(sc, 'u6l9-lname', `<span class="u6l9-lem">${r.em}</span>${r.name}`, 8, ly - 20, x0 - 20, 40);
    const tr = hide(div(sc, 'u6l9-track', '', x0, ly + 14, L, 6));
    const fl = hide(div(sc, 'u6l9-flag', '🏁', xe - 14, ly - 22, 28, 30));
    const dl = hide(div(sc, 'u6l9-dlab', `${r.d} km`, x0 + L / 2 - 50, ly + 22, 100, 24));
    const tv = hide(div(sc, 'u6l9-trav', `<span class="${r.back ? '' : 'u6l9-flip'}">${r.em}</span>`, xs - 22, ly - 26, 44, 44));
    const fin = hide(div(sc, 'u6l9-fin', '', RC, ly - 2, 222, 28));
    return { r, tr, fl, dl, tv, fin, xs, xe, k, arr: r.t0 + r.d / r.v };
  });
  const end = Math.max(...lanes.map((l) => l.arr));
  const set = (t) => {
    clock.innerHTML = `⏱ ${hm(t)}`;
    lanes.forEach((l) => {
      const dist = l.r.v * clamp(t - l.r.t0, 0, l.r.d / l.r.v), px = (l.r.back ? -1 : 1) * dist * l.k;
      l.tv.style.transform = `translateX(${px}px)`;
      if (t >= l.arr - 1e-6) { l.fin.innerHTML = `${l.r.name}: finishes at ${hmS(l.arr)}`; l.fin.style.opacity = 1; }
    });
  };
  return { sc, clock, lanes, set, end };
}
const trips = {
  title: 'Fill the table, then race the trips',
  height: 526, minW: 940, capH: 92,
  choices: [{ sep: 'Check:' }, ...Object.keys(TR).map((k) => ({ v: k, label: TR[k].label }))],
  ask: (v) => TR[v].ask,
  make(stage, v, ex) {
    const d = TR[v], W = ex.W;
    const S = raceScene(stage, 4, 4, W - 8, 194, d.rows);
    const tb = dstTable(stage, 4, 208, d.rows);
    const ban = hide(div(stage, 'u6l9-ban', `<b>${d.sent[0]}</b>${d.sent[1]}`, 4, 208 + tb.H + 12, tb.W, 54));
    const PX = 4 + tb.W + 14, P = div(stage, 'u6l9-panel', '', PX, 208, W - PX - 4, 312);
    const le = wl(P, 2, `${T(d.eq)}`, T(d.npv), 'u6l9-eqline');
    const ls = d.sol.map(([t, n]) => wl(P, '', T(t), n));
    const cr = d.cands ? candRow(P, d.cands) : null;
    const an = hide(div(P, 'u6l9-ansl', d.ans));
    const col = (i) => tb.cells.map((r) => r[i]);
    const steps = [
      { cap: d.dCap, run: async (c) => { for (const l of S.lanes) { await show(c, l.tr); await Promise.all([show(c, l.fl), show(c, l.dl), pop(c, l.tv)]); } for (const e of col(0)) await pop(c, e); } },
      { cap: d.sCap, run: async (c) => { for (const e of col(1)) await pop(c, e); } },
      { cap: `<b>Time = Distance ÷ Speed</b> in each row.`, run: async (c) => { for (const e of col(2)) await pop(c, e); } },
      { cap: d.eqCap, run: async (c) => { await show(c, ban); await show(c, le); } },
      { cap: d.solCap, run: async (c) => { for (const l of ls) await show(c, l); if (cr) await show(c, cr); } }
    ];
    if (cr) steps.push({ cap: d.rejCap, run: (c) => cr.play(c) });
    steps.push({ cap: d.raceCap, run: async (c) => { await tween(c, 3200, (t) => { S.set(clamp(t, 0, 1) * S.end); }, linear); await pop(c, an); } });
    return steps;
  }
};

/* =============================== explainer: two boats on a river (STAR) =============================== */
const RV = [{ name: 'Upstream', em: '🚤', d: 24, sT: 's-2', tT: '\\dfrac{24}{s-2}', v: 8, t0: 0, back: true }, { name: 'Downstream', em: '🚤', d: 24, sT: 's+2', tT: '\\dfrac{24}{s+2}', v: 12, t0: 0 }];
const river = {
  title: 'Two boats on a river: the current helps one and slows the other',
  height: 520, minW: 940, capH: 92,
  ask: 'Example 5: a tour boat goes 24 km upstream and 24 km back downstream in 5 h. The current flows at 2 km/h. Find its still-water speed and the time for each leg.',
  make(stage, v, ex) {
    const W = ex.W, SW = W - 8, SH = 196;
    const sc = div(stage, 'u6l9-river', '', 4, 4, SW, SH);
    const svg = svgEl('svg', { width: SW, height: SH, viewBox: `0 0 ${SW} ${SH}` }, sc);
    svgEl('rect', { x: 0, y: 0, width: SW, height: SH, fill: '#cfe6c0' }, svg);
    svgEl('rect', { x: 0, y: 30, width: SW, height: 136, fill: '#bfe0f2' }, svg);
    [52, 84, 118, 150].forEach((yy, i) => {
      const ln = svgEl('path', { d: `M-40 ${yy} q20 -6 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0`, fill: 'none', stroke: '#fff', 'stroke-width': 2.5, 'stroke-dasharray': '26 30', opacity: 0.8 }, svg);
      svgEl('animate', { attributeName: 'stroke-dashoffset', values: '0;-56', dur: (1.6 + 0.3 * i) + 's', repeatCount: 'indefinite' }, ln);
    });
    const dA = 70, dB = SW - 70, k = (dB - dA) / 24;
    svgEl('rect', { x: dA - 52, y: 26, width: 18, height: 144, rx: 4, fill: '#8a6440' }, svg);
    svgEl('rect', { x: dB + 34, y: 26, width: 18, height: 144, rx: 4, fill: '#8a6440' }, svg);
    const cl = div(sc, 'u6l9-curlab', 'current 2 km/h →', SW / 2 - 110, 2, 220, 26);
    const clock = div(sc, 'u6l9-clock', `⏱ ${hm(0)}`, SW - 196, 168, 186, 26);
    const span = hide(div(sc, 'u6l9-span', '⟵ 24 km ⟶', SW / 2 - 70, 168, 140, 26));
    // boats: downstream (upper lane) starts at A heading right, upstream (lower lane) starts at B heading left
    const yD = 64, yU = 128;
    const bD = div(sc, 'u6l9-boat', '<span class="u6l9-flip">🚤</span>', dA - 28, yD - 28, 56, 56), bU = div(sc, 'u6l9-boat', '<span>🚤</span>', dB - 28, yU - 28, 56, 56);
    const fD = hide(div(sc, 'u6l9-fin', '', dB - 128, yD - 58, 126, 28)), fU = hide(div(sc, 'u6l9-fin', '', dA + 2, yU + 8, 126, 28));
    // speed arrows: the boat's own speed s (purple), the current (teal) from its tip, and the result (ink) underneath
    const AL = 240, CL = 60, ar = svgEl('g', {}, svg);
    const arrow = (x1, x2, yy, color, w = 5) => { const g = svgEl('g', { opacity: 0 }, ar); const dir = Math.sign(x2 - x1); svgEl('line', { x1, y1: yy, x2: x2 - dir * 10, y2: yy, stroke: color, 'stroke-width': w, 'stroke-linecap': 'round' }, g); svgEl('path', { d: `M${x2} ${yy} l${-dir * 16} -9 v18 z`, fill: color }, g); return g; };
    const d0 = dA + 34, u0 = dB - 34;
    const dS = arrow(d0, d0 + AL, yD - 12, COLORS.purple), dC = arrow(d0 + AL, d0 + AL + CL, yD - 12, CUR), dN = arrow(d0, d0 + AL + CL, yD + 14, '#1c2230', 6);
    const uS = arrow(u0, u0 - AL, yU - 14, COLORS.purple), uC = arrow(u0 - AL, u0 - AL + CL, yU - 2, CUR), uN = arrow(u0, u0 - AL + CL, yU + 18, '#1c2230', 6);
    const lab = (html, xx, yy, cls = '') => hide(div(sc, 'u6l9-alab ' + cls, html, xx, yy, 120, 26));
    const dSl = lab(`own speed ${T('s')}`, d0 + AL / 2 - 60, yD - 40), dCl = lab(T('+2'), d0 + AL + CL / 2 - 60, yD - 40, 'u6l9-cur'), dR = lab(T('s+2'), d0 + AL + CL + 6, yD + 1, 'u6l9-res');
    const uSl = lab(`own speed ${T('s')}`, u0 - AL / 2 - 60, yU - 42), uCl = lab(T('-2'), u0 - AL + CL + 2, yU - 15, 'u6l9-cur u6l9-curl'), uR = lab(T('s-2'), u0 - AL + CL - 126, yU + 5, 'u6l9-res u6l9-resl');
    const arrIn = async (c, g) => { g.style.opacity = 1; await anim(c, g, [{ opacity: 0, transform: 'scaleX(0.2)' }, { opacity: 1, transform: 'scaleX(1)' }], 520); };
    const vecD = [dS, dC, dN], vecU = [uS, uC, uN], labD = [dSl, dCl, dR], labU = [uSl, uCl, uR];
    // table and working
    const tb = dstTable(stage, 4, 210, RV);
    const ban = hide(div(stage, 'u6l9-ban', '<b>Total time 5 h</b>add the times', 4, 210 + tb.H + 10, tb.W, 54));
    const PX = 4 + tb.W + 14, P = div(stage, 'u6l9-panel', '', PX, 210, W - PX - 4, 306);
    const le = wl(P, 2, T('\\dfrac{24}{s-2}+\\dfrac{24}{s+2}=5'), T('s\\ne\\pm2'), 'u6l9-eqline');
    const ls = [['24(s+2)+24(s-2)=5(s^2-4)', `× ${T('(s-2)(s+2)')}`], ['48s=5s^2-20', ''], ['5s^2-48s-20=0', ''], ['(5s+2)(s-10)=0', 'factor']].map(([t, n]) => wl(P, '', T(t), n));
    const cr = candRow(P, [['s=-\\tfrac{2}{5}', false, 'negative speed'], ['s=10', true, 'keep']]);
    const an = hide(div(P, 'u6l9-ansl', 'Still water <b>10 km/h</b>: up 3 h, down 2 h'));
    const fill = async (c, row) => { for (const e of tb.cells[row]) await pop(c, e); };
    return [
      { cap: 'The river flows <b>downstream</b> (→) at 2 km/h and carries both boats with it. Each trip is 24 km.', run: async (c) => { await show(c, span); await pulse(c, cl, 1.15); } },
      { cap: `<b>Upstream</b>, against the current: the boat’s own speed ${T('s')} <b>minus</b> 2. Speed ${T('s-2')}, time ${T('\\tfrac{24}{s-2}')}.`,
        run: async (c) => { await arrIn(c, uS); await show(c, uSl); await arrIn(c, uC); await show(c, uCl); await arrIn(c, uN); await pop(c, uR); await fill(c, 0); } },
      { cap: `<b>Downstream</b>, with the current: ${T('s')} <b>plus</b> 2. Speed ${T('s+2')}, time ${T('\\tfrac{24}{s+2}')}.`,
        run: async (c) => { await arrIn(c, dS); await show(c, dSl); await arrIn(c, dC); await show(c, dCl); await arrIn(c, dN); await pop(c, dR); await fill(c, 1); } },
      { cap: `Up and back takes 5 h: <b>add the times</b>. The NPVs are ${T('s\\ne\\pm2')}.`, run: async (c) => { await show(c, ban); await show(c, le); } },
      { cap: `Multiply every term by ${T('(s-2)(s+2)')}, then standard form and factor.`, run: async (c) => { for (const l of ls) await show(c, l); await show(c, cr); } },
      { cap: `${T('s=-\\tfrac{2}{5}')} is a negative speed: reject it. In still water the boat goes ${T('s=10')} km/h.`, run: (c) => cr.play(c) },
      { cap: `Upstream ${T('10-2=8')} km/h: ${T('\\tfrac{24}{8}=3')} h. Downstream ${T('10+2=12')} km/h: ${T('\\tfrac{24}{12}=2')} h. Race them: ${T('3+2=5')} h ✓`,
        run: async (c) => {
          await Promise.all([...vecD, ...vecU, ...labD, ...labU].map((e) => fadeOut(c, e)));
          await tween(c, 3200, (t) => {
            const hrs = 3 * clamp(t, 0, 1); clock.innerHTML = `⏱ ${hm(hrs)}`;
            bD.style.transform = `translateX(${12 * Math.min(hrs, 2) * k}px)`; bU.style.transform = `translateX(${-8 * hrs * k}px)`;
            if (hrs >= 2 - 1e-6) { fD.innerHTML = 'downstream: 2 h'; fD.style.opacity = 1; }
            if (hrs >= 3 - 1e-6) { fU.innerHTML = 'upstream: 3 h'; fU.style.opacity = 1; }
          }, linear);
          await pop(c, an);
        } }
    ];
  }
};

/* =============================== explainer: sharing a job (STAR) =============================== */
const JB = {
  a: { label: 'Example 6(a)', ask: 'Example 6(a): Ari can paint a fence in 6 h and Bea can paint it in 4 h. How long will it take them working together?',
    mode: 'both', N: 12, job: 'one fence = <b>12 boards</b> (the LCD of 6 and 4)', bg: '#efe2c8', fA: '#6f9ee8', fB: '#f0a55a',
    A: ['Ari', `alone 6 h → ${T('\\tfrac{1}{6}')} of the fence per hour = <b>2 boards/h</b>. In ${T('t')} h: ${T('\\tfrac{t}{6}')}`],
    B: ['Bea', `alone 4 h → ${T('\\tfrac{1}{4}')} per hour = <b>3 boards/h</b>. In ${T('t')} h: ${T('\\tfrac{t}{4}')}`],
    rA: 2, rB: 3, T: 2.4,
    capA: `Ari alone takes 6 h, so he paints ${T('\\tfrac{1}{6}')} of the fence each hour. Make the fence 12 boards (the LCD): that is <b>2 boards an hour</b>.`,
    capB: `Bea alone takes 4 h: ${T('\\tfrac{1}{4}')} of the fence each hour, <b>3 boards an hour</b>.`,
    eq: '\\dfrac{t}{6}+\\dfrac{t}{4}=1', eqCap: `Together for ${T('t')} hours, Ari does ${T('\\tfrac{t}{6}')} and Bea ${T('\\tfrac{t}{4}')}. The parts add to <b>one whole job</b>.`,
    sol: [['2t+3t=12', '× 12'], ['5t=12', ''], ['t=\\tfrac{12}{5}=2.4', '']],
    solCap: `Multiply by the LCD 12: ${T('2t+3t=12')}. That is 2 + 3 = 5 boards an hour together, so ${T('t=\\tfrac{12}{5}=2.4')} h.`,
    playCap: `Paint! They meet after 2.4 h: Ari did ${T('\\tfrac{2.4}{6}=0.4')} of the fence and Bea ${T('\\tfrac{2.4}{4}=0.6')}. ${T('0.4+0.6=1')} ✓`,
    pA: 'Ari: \\tfrac{2.4}{6}=0.4', pB: 'Bea: \\tfrac{2.4}{4}=0.6', ans: 'Together: <b>2.4 h</b> (2 h 24 min)' },
  b: { label: '(b)', ask: 'Example 6(b): a large pump empties a flooded basement in 3 h. With a small pump too, it takes 2 h. How long would the small pump take alone?',
    mode: 'both', N: 6, job: 'empty the basement = <b>6 loads</b> of water', bg: '#7fb8ea', fA: '#d6e3fa', fB: '#fde0c2', water: true,
    A: ['Large pump', `alone 3 h → ${T('\\tfrac{1}{3}')} per hour = <b>2 loads/h</b>. In 2 h: ${T('\\tfrac{2}{3}')}`],
    B: ['Small pump', `alone ${T('x')} h → ${T('\\tfrac{1}{x}')} per hour. In 2 h: ${T('\\tfrac{2}{x}')}`],
    rA: 2, rB: 1, T: 2,
    capA: `The large pump alone takes 3 h: ${T('\\tfrac{1}{3}')} of the water each hour. In the 2 h, it does ${T('\\tfrac{2}{3}')} of the job.`,
    capB: `The small pump alone takes ${T('x')} hours (the unknown, ${T('x\\ne0')}): ${T('\\tfrac{1}{x}')} each hour, so ${T('\\tfrac{2}{x}')} in the 2 h.`,
    eq: '\\dfrac{2}{3}+\\dfrac{2}{x}=1', eqCap: 'The two parts add to one whole job: one empty basement.',
    sol: [['2x+6=3x', `× ${T('3x')}`], ['x=6', '']],
    solCap: `Multiply by the LCD ${T('3x')}: ${T('2x+6=3x')}, so ${T('x=6')}.`,
    playCap: `Pump for 2 h: the large pump takes 4 of the 6 loads, the small pump 2. That is 1 load an hour, so <b>6 h</b> alone ✓`,
    pA: 'large: \\tfrac{2}{3}', pB: 'small: \\tfrac{2}{6}=\\tfrac{1}{3}', ans: 'Small pump alone: <b>6 h</b>' },
  c: { label: '(c)', ask: 'Example 6(c): an inlet fills a pool in 8 h and the drain empties it in 12 h. The drain is left open while the pool fills. How long does it take to fill?',
    mode: 'drain', N: 24, job: 'fill the pool = <b>24 units</b> (the LCD of 8 and 12)', bg: '#f4f1ea', fA: '#7fb8ea', fB: '#c93a33', drainB: true,
    A: ['Inlet', `alone 8 h → ${T('\\tfrac{1}{8}')} per hour = <b>3 units/h in</b>. In ${T('t')} h: ${T('\\tfrac{t}{8}')}`],
    B: ['Drain', `alone 12 h → ${T('\\tfrac{1}{12}')} per hour = <b>2 units/h out</b>. In ${T('t')} h: ${T('-\\tfrac{t}{12}')}`],
    rA: 3, rB: 2, T: 24,
    capA: `The inlet alone fills the pool in 8 h: ${T('\\tfrac{1}{8}')} of a pool each hour, <b>3 units an hour</b> of 24.`,
    capB: `The drain empties a pool in 12 h: it <b>undoes</b> ${T('\\tfrac{1}{12}')} of the work each hour, 2 units an hour.`,
    eq: '\\dfrac{t}{8}-\\dfrac{t}{12}=1', eqCap: `The inlet adds ${T('\\tfrac{t}{8}')}, the drain takes away ${T('\\tfrac{t}{12}')}: <b>subtract</b>. The result is one full pool.`,
    sol: [['3t-2t=24', '× 24'], ['t=24', '']],
    solCap: `Multiply by the LCD 24: ${T('3t-2t=24')}. The pool gains only ${T('3-2=1')} unit an hour, so ${T('t=24')} h.`,
    playCap: 'Fill it: 3 units in, 2 units out, every hour. A whole day: the inlet pours in 3 pools of water and the drain lets 2 out ✓',
    pA: 'in: 72=3\\text{ pools}', pB: 'out: 48=2\\text{ pools}', ans: 'Full after <b>24 h</b>' },
  d: { label: '(d)', ask: 'Example 6(d): Dev can stain a deck in 10 h and Eli in 15 h. Dev works alone for 5 h, then Eli joins him. How long do they work together?',
    mode: 'late', N: 30, job: 'stain the deck = <b>30 boards</b> (the LCD of 10 and 15)', bg: '#efe2c8', fA: '#6f9ee8', fB: '#f0a55a',
    A: ['Dev', `alone 10 h → <b>3 boards/h</b>. He works ${T('5+t')} h: ${T('\\tfrac{5+t}{10}')}`],
    B: ['Eli', `alone 15 h → <b>2 boards/h</b>. He works ${T('t')} h: ${T('\\tfrac{t}{15}')}`],
    rA: 3, rB: 2, T: 8, tB: 5,
    capA: `Dev alone takes 10 h (3 of 30 boards an hour). He works the 5 h alone <b>plus</b> the ${T('t')} h together: ${T('5+t')} hours.`,
    capB: `Eli alone takes 15 h (2 boards an hour), and he works only the ${T('t')} hours together.`,
    eq: '\\dfrac{5+t}{10}+\\dfrac{t}{15}=1', eqCap: 'Each part is (time that person works) ÷ (time that person needs alone). The parts add to 1.',
    sol: [['15+3t+2t=30', '× 30'], ['5t=15', ''], ['t=3', '']],
    solCap: `Multiply by the LCD 30: ${T('15+3t+2t=30')}, so ${T('t=3')} h together.`,
    playCap: 'Stain! Dev does 15 boards alone in 5 h (half the deck); then together, 5 boards an hour, the other 15 take 3 h. 8 h in all ✓',
    pA: 'Dev: \\tfrac{8}{10}=0.8', pB: 'Eli: \\tfrac{3}{15}=0.2', ans: 'Together for <b>3 h</b> (8 h in all)' },
  k: { label: 'Example 7(a)', ask: 'Example 7(a): alone, Jordan takes 5 h longer than Kai to clear a rink. Together they take 6 h. How long does each take alone?',
    mode: 'both', N: 30, job: 'clear the rink = <b>30 strips</b> of snow', bg: '#f4f7fb', fA: '#6f9ee8', fB: '#f0a55a',
    A: ['Kai', `alone ${T('x')} h → in 6 h: ${T('\\tfrac{6}{x}')}`],
    B: ['Jordan', `alone ${T('x+5')} h → in 6 h: ${T('\\tfrac{6}{x+5}')}`],
    rA: 3, rB: 2, T: 6,
    capA: `Let Kai’s time alone be ${T('x')} hours. In the 6 h together he clears ${T('\\tfrac{6}{x}')} of the rink.`,
    capB: `Jordan takes 5 h longer: ${T('x+5')} hours alone, so ${T('\\tfrac{6}{x+5}')} in the 6 h.`,
    eq: '\\dfrac{6}{x}+\\dfrac{6}{x+5}=1', eqCap: `The parts add to 1 (${T('x\\ne0,\\ -5')}).`,
    sol: [['6(x+5)+6x=x(x+5)', `× ${T('x(x+5)')}`], ['x^2-7x-30=0', ''], ['(x-10)(x+3)=0', 'factor']],
    solCap: `Multiply by the LCD ${T('x(x+5)')}, then standard form and factor.`,
    cands: [['x=10', true, 'keep'], ['x=-3', false, 'negative time']],
    rejCap: `${T('x=-3')} is a negative time: reject it. Kai takes 10 h (3 of 30 strips an hour), Jordan 15 h (2 an hour).`,
    playCap: `Clear it: in 6 h Kai does ${T('\\tfrac{6}{10}=0.6')} and Jordan ${T('\\tfrac{6}{15}=0.4')} of the rink. ${T('0.6+0.4=1')} ✓`,
    pA: 'Kai: \\tfrac{6}{10}=0.6', pB: 'Jordan: \\tfrac{6}{15}=0.4', ans: 'Kai <b>10 h</b>, Jordan <b>15 h</b>' }
};
const job = {
  title: 'Sharing a job: the parts add to 1',
  height: 500, minW: 940, capH: 92,
  choices: [{ sep: 'Check:' }, ...Object.keys(JB).map((k) => ({ v: k, label: JB[k].label }))],
  ask: (v) => JB[v].ask,
  make(stage, v, ex) {
    const d = JB[v], W = ex.W, BX = 24, BY = 52, BW = W - 48, BH = 84, cw = BW / d.N;
    div(stage, 'u6l9-jobh', `<b>The job:</b> ${d.job}`, BX, 8, BW - 210, 34);
    const clock = div(stage, 'u6l9-clock', `⏱ ${hm(0)}`, W - 24 - 186, 8, 186, 34);
    const bar = div(stage, 'u6l9-bar', '', BX, BY, BW, BH);
    const svg = svgEl('svg', { width: BW, height: BH, viewBox: `0 0 ${BW} ${BH}` }, bar);
    svgEl('rect', { x: 0, y: 0, width: BW, height: BH, fill: d.bg }, svg);
    const rA = svgEl('rect', { x: 0, y: 0, width: 0, height: BH, fill: d.fA }, svg);
    const rB = svgEl('rect', { x: BW, y: 0, width: 0, height: BH, fill: d.fB }, svg);
    for (let i = 1; i < d.N; i++) svgEl('line', { x1: i * cw, y1: 0, x2: i * cw, y2: BH, stroke: '#1c2230', 'stroke-opacity': 0.28, 'stroke-width': 1.5 }, svg);
    svgEl('rect', { x: 1.5, y: 1.5, width: BW - 3, height: BH - 3, fill: 'none', stroke: '#1c2230', 'stroke-width': 3, rx: 6 }, svg);
    const bA = div(stage, 'u6l9-wk u6l9-wkA', d.A[0][0], BX - 18, BY + BH * 0.3 - 18, 36, 36);
    const bB = div(stage, 'u6l9-wk u6l9-wkB' + (d.drainB ? ' u6l9-wkD' : ''), d.B[0][0], BX + BW - 18, BY + BH * 0.7 - 18, 36, 36);
    hide(bA); hide(bB);
    const part = (q) => { const i = q.indexOf(': '); return `<b>${q.slice(0, i)}:</b> ${T(q.slice(i + 2))}`; };
    const pA = hide(div(stage, 'u6l9-part u6l9-pA', part(d.pA), BX, BY + BH + 8, 300, 34));
    const pB = hide(div(stage, 'u6l9-part u6l9-pB', part(d.pB), BX + BW - 300, BY + BH + 8, 300, 34));
    const cnt = d.mode === 'drain' ? hide(div(stage, 'u6l9-part u6l9-cnt', '', BX + BW / 2 - 150, BY + BH + 8, 300, 34)) : null;
    // rate cards and working
    const CY = 196, CW = 452;
    const card = (k, [nm, txt], cls) => hide(div(stage, 'u6l9-rc ' + cls, `<b class="u6l9-wk">${nm[0]}</b><div><b>${nm}</b> ${txt}</div>`, 4, CY + k * 104, CW, 94));
    const cA = card(0, d.A, 'u6l9-rcA'), cB = card(1, d.B, 'u6l9-rcB' + (d.drainB ? ' u6l9-rcD' : ''));
    const P = div(stage, 'u6l9-panel', '', CW + 16, CY, W - CW - 20, 300);
    const le = wl(P, 2, T(d.eq), '', 'u6l9-eqline');
    const ls = d.sol.map(([t, n]) => wl(P, '', T(t), n));
    const cr = d.cands ? candRow(P, d.cands) : null;
    const an = hide(div(P, 'u6l9-ansl', d.ans));
    // the picture at time t (hours)
    const set = (t) => {
      clock.innerHTML = `⏱ ${hm(t)}`;
      let a, b = 0;
      if (d.mode === 'drain') { a = (d.rA - d.rB) * t; if (cnt) cnt.innerHTML = `in ${Math.round(d.rA * t)}, out ${Math.round(d.rB * t)}: ${Math.round(a)} of ${d.N}`; }
      else { a = d.rA * t; b = d.rB * Math.max(0, t - (d.tB || 0)); }
      const wa = Math.min(a, d.N) * cw, wb = Math.min(b, d.N) * cw;
      rA.setAttribute('width', wa); rB.setAttribute('x', BW - wb); rB.setAttribute('width', wb);
      bA.style.transform = `translateX(${d.mode === 'drain' ? 0 : wa}px)`; bB.style.transform = `translateX(${-wb}px)`;
    };
    const steps = [
      { cap: d.capA, run: async (c) => { await show(c, cA); await pop(c, bA); } },
      { cap: d.capB, run: async (c) => { await show(c, cB); await pop(c, bB); } },
      { cap: d.eqCap, run: (c) => show(c, le) },
      { cap: d.solCap, run: async (c) => { for (const l of ls) await show(c, l); if (cr) await show(c, cr); } }
    ];
    if (cr) steps.push({ cap: d.rejCap, run: (c) => cr.play(c) });
    steps.push({ cap: d.playCap, run: async (c) => {
      if (cnt) await show(c, cnt);
      await tween(c, d.mode === 'drain' ? 4200 : 3200, (t) => set(clamp(t, 0, 1) * d.T), linear);
      await Promise.all([show(c, pA), show(c, pB)]); await pop(c, an);
    } });
    return steps;
  }
};

/* =============================== explainer: free throws in a row =============================== */
const MISS = [2, 4, 7, 9, 12, 15, 17, 19, 21, 23, 24]; // 11 misses among the first 25 shots (14 made)
const shots = {
  title: 'Free throws in a row: a percent that changes',
  height: 500, minW: 900, capH: 92,
  ask: 'Example 8(a): a basketball player has made 14 of her 25 free throws. How many in a row must she make to raise her success rate to 75%?',
  make(stage, v, ex) {
    const W = ex.W, GX = 20, GY = 46, SP = 48, R = 18;
    div(stage, 'u6l9-jobh', '<b>Her shots</b> (11 to a row)', GX, 6, 400, 34);
    const read = div(stage, 'u6l9-read', '', W - 330, 6, 316, 40);
    const svg = svgEl('svg', { width: 11 * SP, height: 4 * SP, viewBox: `0 0 ${11 * SP} ${4 * SP}` }, div(stage, 'u6l9-shots', '', GX, GY, 11 * SP, 4 * SP));
    const dots = [];
    for (let i = 0; i < 44; i++) {
      const cx = (i % 11) * SP + SP / 2, cy = Math.floor(i / 11) * SP + SP / 2, made = i >= 25 || !MISS.includes(i + 1);
      const g = svgEl('g', { opacity: 0 }, svg);
      svgEl('circle', { cx, cy, r: R, fill: made ? (i >= 25 ? '#e8a01e' : '#12805a') : '#fff', stroke: made ? 'none' : '#9aa0ab', 'stroke-width': 3 }, g);
      if (!made) svgEl('path', { d: `M${cx - 7} ${cy - 7} l14 14 m0 -14 l-14 14`, stroke: '#9aa0ab', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, g);
      else svgEl('circle', { cx, cy, r: 6, fill: '#fff', opacity: 0.85 }, g);
      dots.push(g);
    }
    // the success meter
    const MX = W - 170, MY = 56, MW = 70, MH = 230;
    const meter = div(stage, 'u6l9-meter', '', MX, MY, MW, MH);
    const fillEl = h('div', 'u6l9-mfill'); meter.appendChild(fillEl);
    div(stage, 'u6l9-mtgt', '75%', MX - 70, MY + MH * 0.25 - 14, 60, 28);
    div(stage, 'u6l9-mline', '', MX - 8, MY + MH * 0.25 - 1.5, MW + 16, 3);
    div(stage, 'u6l9-m0', '0%', MX + MW + 8, MY + MH - 14, 50, 28); div(stage, 'u6l9-m0', '100%', MX + MW + 8, MY - 14, 60, 28);
    const setRate = (m, n) => { const p = m / n; fillEl.style.height = (p * 100) + '%'; read.innerHTML = `${m} of ${n} = <b>${(p * 100).toFixed(1).replace(/\.0$/, '')}%</b>`; };
    hide(read); hide(meter);
    const P = div(stage, 'u6l9-panel', '', GX, 4 * SP + GY + 14, W - 220 - GX - 30, 500 - (4 * SP + GY + 14) - 6);
    const lm = wl(P, 1, `${T('x')} in a row: ${T('\\dfrac{14+x}{25+x}')}`);
    const le = wl(P, 2, T('\\dfrac{14+x}{25+x}=\\dfrac{3}{4}'), T('x\\ne-25'), 'u6l9-eqline');
    const ls = [['4(14+x)=3(25+x)', 'cross-multiply'], ['56+4x=75+3x\\ \\Rightarrow\\ x=19', '']].map(([t, n]) => wl(P, '', T(t), n));
    const an = hide(div(P, 'u6l9-ansl', 'She must make <b>19 in a row</b>'));
    const st = hide(div(stage, 'u6l9-stamp', '75% ✓', MX - 40, MY + MH + 20, 150, 48));
    return [
      { cap: `So far she has made <b>14 of 25</b>: ${T('\\tfrac{14}{25}=0.56')}, a 56% success rate.`,
        run: async (c) => { await show(c, meter); setRate(14, 25); await show(c, read); for (let i = 0; i < 25; i++) { dots[i].setAttribute('opacity', 1); } await pulse(c, read, 1.08); } },
      { cap: `Let ${T('x')} be the number she makes in a row. Each one adds 1 to the shots made <b>and</b> 1 to the shots taken: ${T('\\dfrac{14+x}{25+x}')}.`, run: (c) => show(c, lm) },
      { cap: `Set it equal to 75% ${T('=\\tfrac{3}{4}')} and cross-multiply: ${T('x=19')}.`, run: async (c) => { await show(c, le); for (const l of ls) await show(c, l); } },
      { cap: 'Watch her make them in a row. Each make raises the rate by <b>less</b> than the one before …',
        run: async (c) => { let last = 0; await tween(c, 4200, (t) => { const x = Math.round(19 * clamp(t, 0, 1)); for (let i = last; i < x; i++) dots[25 + i].setAttribute('opacity', 1); last = Math.max(last, x); setRate(14 + x, 25 + x); }, linear); } },
      { cap: `… and the 19th make reaches ${T('\\tfrac{33}{44}=0.75')} exactly ✓ She must make <b>19 in a row</b>.`, run: async (c) => { st.style.opacity = 1; await anim(c, st, [{ opacity: 0, transform: 'scale(1.8) rotate(-16deg)' }, { opacity: 1, transform: 'scale(1) rotate(-7deg)' }], 420); await pop(c, an); } }
    ];
  }
};

/* =============================== Stand Up Break =============================== */
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
standup('u6l9', {
  intro: 'At your whiteboard: let a variable, write the equation, state the NPVs, solve, and reject anything the situation can’t allow.',
  levels: {
    BEG: (r) => { // n + k/n = S with roots p and m
      const p = r.int(1, 6), m = r.int(p + 1, 9), k = p * m, S = p + m;
      return { text: `The sum of a number and ${k} times its reciprocal is ${S}. Determine the number.`, q: '',
        a: [`n+\\dfrac{${k}}{n}=${S},\\ \\ n\\ne0`, `n^2+${k}=${S}n`, `n^2-${S}n+${k}=0`, `(n-${p})(n-${m})=0`, `n=${p}\\ \\text{or}\\ n=${m}\\ \\text{(both work)}`] };
    },
    PRG: (r) => { // same time: d1/(s + k) = d2/s
      const s = r.pick([6, 8, 10, 12, 15]), k = r.pick([4, 5, 6, 9, 10, 12]), tt = r.pick([2, 3]), d2 = s * tt, d1 = (s + k) * tt;
      return { text: `A cyclist rides ${d1} km in the same time that a runner covers ${d2} km. The cyclist’s average speed is ${k} km/h greater than the runner’s. Determine each average speed.`, q: '',
        a: [`\\dfrac{${d1}}{s+${k}}=\\dfrac{${d2}}{s},\\ \\ s\\ne0,\\ -${k}`, `${d1}s=${d2}(s+${k})`, `${d1 - d2}s=${d2 * k}`, `s=${s}`, `\\text{Runner } ${s}\\text{ km/h, cyclist } ${s + k}\\text{ km/h (${tt} h each)}`] };
    },
    MAS: (r) => { // time saved: D/s − D/(s + k) = minutes/60
      let D = 120, s = 40, k = 20;
      for (let i = 0; i < 300; i++) {
        const s1 = r.pick([40, 45, 48, 50, 60, 72, 75, 80, 90]), k1 = r.pick([10, 12, 15, 20, 24, 30]), D1 = r.pick([60, 90, 120, 144, 150, 180, 200, 240, 300, 360]);
        if ((D1 * 60) % s1 || (D1 * 60) % (s1 + k1)) continue;
        const mm = (D1 * 60) / s1 - (D1 * 60) / (s1 + k1);
        if (mm % 5 || mm < 10 || mm > 90) continue;
        D = D1; s = s1; k = k1; break;
      }
      const mm = (D * 60) / s - (D * 60) / (s + k), g = gcd(mm, 60), a = mm / g, b = 60 / g, P = s * (s + k);
      return { text: `A courier drives ${D} km to a town. On the way back she drives ${k} km/h faster and saves ${mm} minutes. Determine her speed each way.`, q: '',
        a: [`\\dfrac{${D}}{s}-\\dfrac{${D}}{s+${k}}=${b === 1 ? a : `\\dfrac{${a}}{${b}}`},\\ \\ s\\ne0,\\ -${k}`, `${b * D}(s+${k})-${b * D}s=${a === 1 ? '' : a}s(s+${k})`, `${b * D * k}=${a === 1 ? '' : a}s^2+${a * k}s`,
          `s^2+${k}s-${P}=0`, `(s-${s})(s+${s + k})=0`, `s=${s}\\ \\ (s=-${s + k}\\text{ rejected})`, `\\text{Going } ${s}\\text{ km/h, back } ${s + k}\\text{ km/h}`] };
    }
  }
});

/* =============================== mount =============================== */
export const explainers = mountExplainers({ plan, trips, river, job, shots });
export const _test = { PL, TR, JB };
