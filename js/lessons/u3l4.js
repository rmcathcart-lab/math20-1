/* Math 20-1 · Unit 3 · Lesson 4 — Exact Values from Special Triangles (T2: exact values and solving; T1: angles from
 * points and rotations, i.e. reference angles and quadrants)
 * Assignment 4 (u3_l04.tex, Questions 1–18) and the Lesson 4 Extra Practice (u3_ep04.tex, A1–A3, B1–B6, C1–C3).
 * Every part is a generator: the booklet question's idea, form and difficulty with new numbers (the lesson's example
 * numbers and the booklet's own numbers are left out where that is easy). NO calculator: every answer is exact.
 * Exact values: √3/2, −1/√2 or −√2/2 are all fine unless the question asks for rationalized form (Question 1);
 * "undefined" is on the keypad. Angles: whole degrees, all solutions as a set (U.angleCheck with exact: true).
 * Uses the Unit 3 kit HW.u3kit from u3l3.js (load u3l3.js first).
 *
 * Conversions: "sketch the special triangles" (Q1 stem) → the triangles are in the worked solutions; "explain why" (Q3a,
 * Extra C3b) → multiple choice of reasons; "show that tan = sin/cos" (Q3b) → evaluate sin θ / cos θ exactly; "describe what
 * happens" (Q3c) → multiple choice; "true or false, justify" (Q5) → true/false with the exact values in the feedback;
 * "find and correct each error" (Q13) → give the corrected exact values; "show that sin² + cos² = 1" (Extra C3a) → the
 * values of sin²θ and cos²θ.
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: Q12, Q18, Extra C1, C2, C3b. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, B = K.P, F = HW.fmt, t = K.t, U = HW.u3kit;
  var LID = 'u3l4';
  if (!U) throw new Error('u3l4 needs u3l3.js (HW.u3kit) loaded first');
  var gcd = U.gcd, pickWhere = U.pickWhere;
  var FN = ['sin', 'cos', 'tan'], SPA = [30, 45, 60, 120, 135, 150, 210, 225, 240, 300, 315, 330], SPX = [120, 135, 150, 210, 225, 240, 300, 315, 330], SPQ1 = [30, 45, 60], QA = [0, 90, 180, 270];
  function fnT(fn, a) { return '\\' + fn + (a == null ? '\\theta' : ' ' + U.deg(a)); }
  function sgnWord(s) { return s > 0 ? 'positive' : 'negative'; }
  function key(fn, a) { return fn + a; }
  var EX = U.tex;
  var H_EV = ['Find the quadrant and the reference angle ' + t('\\theta_R') + '; take the value of ' + t('\\theta_R') + ' from the table of exact values.', 'Attach the sign from CAST. On an axis, use the point with ' + t('r=1') + ': ' + t('(1,0),\\ (0,1),\\ (-1,0),\\ (0,-1)') + '.'];
  var H_SOLVE = ['Use the sign of the value and CAST to choose the quadrants.', 'Find the angle in the table whose ratio is the positive value: that is ' + t('\\theta_R') + '. Place it: II ' + t('180^\\circ-\\theta_R') + ', III ' + t('180^\\circ+\\theta_R') + ', IV ' + t('360^\\circ-\\theta_R') + '.'];
  var TRI = '<svg class="fig" viewBox="0 0 300 120" width="300" style="max-width:100%;height:auto;display:block;margin:6px auto" role="img" aria-label="The special triangles"><polygon points="20,100 110,100 110,10" fill="#eef2fa" stroke="#2b3340" stroke-width="1.5"/><text x="65" y="114" font-size="12" text-anchor="middle">1</text><text x="120" y="58" font-size="12">1</text><text x="52" y="50" font-size="12">√2</text><text x="36" y="94" font-size="10">45°</text><text x="96" y="30" font-size="10">45°</text><polygon points="160,100 280,100 280,30.7" fill="#eef2fa" stroke="#2b3340" stroke-width="1.5"/><text x="220" y="114" font-size="12" text-anchor="middle">√3</text><text x="287" y="68" font-size="12">1</text><text x="210" y="58" font-size="12">2</text><text x="178" y="95" font-size="10">30°</text><text x="262" y="50" font-size="10">60°</text></svg>';

  /* ---------------- exact value of fn a ---------------- */
  function evAlts(fn, a) {
    var want = U.exact(fn, a), q = U.quad(a), rf = U.ref(a), alts = [];
    if (q) {
      var rf2 = rf === 30 ? 60 : rf === 60 ? 30 : null;
      if (rf2 && q > 1) alts.push({ v: U.val(U.exact(fn, U.place(rf2, q))), code: 'u3l4-ref', hint: 'Check the reference angle: ' + t(U.refTex(a)) + ', not ' + t(U.deg(rf2)) + '. Then take ' + t('\\' + fn + ' ' + U.deg(rf)) + ' from the table.' });
      if (fn !== 'tan') { var o2 = fn === 'sin' ? 'cos' : 'sin'; alts.push({ v: U.val(U.exact(o2, a)), code: 'u3l4-swap', hint: 'That value is ' + t(fnT(o2, a)) + '. Use ' + t('\\' + fn) + ': ' + (fn === 'sin' ? t('\\sin\\theta=\\frac{y}{r}') + ' (opposite over hypotenuse)' : t('\\cos\\theta=\\frac{x}{r}') + ' (adjacent over hypotenuse)') + '.' }); }
      else if (want !== 'undef' && want.p) alts.push({ v: 1 / U.val(want), code: 'u3l4-tan-flip', hint: t('\\tan\\theta=\\frac{\\text{opposite}}{\\text{adjacent}}=\\frac{y}{x}') + ' — you have it upside down.' });
    } else if (fn !== 'tan') {
      var o3 = fn === 'sin' ? 'cos' : 'sin', w = U.exact(o3, a);
      alts.push({ v: U.val(w), code: 'u3l4-xy', hint: 'At ' + t(U.deg(a)) + ' the point is ' + t(ptT(a)) + ' with ' + t('r=1') + ': ' + (fn === 'sin' ? t('\\sin\\theta=\\frac{y}{r}') : t('\\cos\\theta=\\frac{x}{r}')) + '.' });
    }
    return alts;
  }
  function ptT(a) { return { 0: '(1,0)', 90: '(0,1)', 180: '(-1,0)', 270: '(0,-1)' }[a]; }
  function evSol(fn, a) {
    var want = U.exact(fn, a), q = U.quad(a), rf = U.ref(a);
    if (!q) return 'Point ' + t(ptT(a)) + ', ' + t('r=1') + ': ' + t(fnT(fn, a) + '=' + (fn === 'sin' ? '\\frac{y}{r}' : fn === 'cos' ? '\\frac{x}{r}' : '\\frac{y}{x}') + '=' + (fn === 'tan' ? '\\frac{' + ptT(a).slice(1, -1).split(',')[1] + '}{' + ptT(a).slice(1, -1).split(',')[0] + '}' : '\\frac{' + (fn === 'sin' ? ptT(a).slice(1, -1).split(',')[1] : ptT(a).slice(1, -1).split(',')[0]) + '}{1}')) + (want === 'undef' ? ', which is <b>undefined</b> (division by zero).' : t('=' + EX(want)) + '.');
    var s = U.sign(fn, q);
    return (q === 1 ? 'Quadrant I.' : 'Quadrant ' + U.ROM[q] + ', ' + t(U.refTex(a)) + ', ' + fn + ' ' + sgnWord(s) + '.') + '<br>' + t(fnT(fn, a) + (q === 1 ? '' : '=' + (s < 0 ? '-' : '') + fnT(fn, rf)) + '=' + EX(want));
  }
  function evPart(fn, a, o) {
    o = o || {};
    var want = U.exact(fn, a), q = U.quad(a);
    return U.P.exact(o.prompt || t(fnT(fn, a)), want, { rational: !!o.rational, undef: true, alts: evAlts(fn, a), signHint: q ? t(U.deg(a)) + ' is in Quadrant ' + U.ROM[q] + ', where ' + U.castWhy(q) + '.' : null }, o.sol || (o.pre || '') + evSol(fn, a), o.hints || H_EV, 'exact value of ' + fn + ' ' + a);
  }
  /* Question 1: read the ratio off the special triangle */
  function triSol(fn, a) {
    var S = a === 45 ? { o: '1', a: '1', h: '\\sqrt{2}' } : a === 30 ? { o: '1', a: '\\sqrt{3}', h: '2' } : { o: '\\sqrt{3}', a: '1', h: '2' };
    var raw = fn === 'sin' ? '\\frac{' + S.o + '}{' + S.h + '}' : fn === 'cos' ? '\\frac{' + S.a + '}{' + S.h + '}' : '\\frac{' + S.o + '}{' + S.a + '}', fin = EX(U.exact(fn, a));
    return (a === 45 ? '45-45-90 triangle' : '30-60-90 triangle') + ': ' + (fn === 'sin' ? 'opposite over hypotenuse' : fn === 'cos' ? 'adjacent over hypotenuse' : 'opposite over adjacent') + '.<br>' + t(fnT(fn, a) + '=' + raw + (raw === fin ? '' : '=' + fin)) + (/\\sqrt/.test(raw.split('}{')[1] || '') ? ' (rationalized: multiply the top and bottom by the radical).' : '');
  }
  /* distinct (fn, angle) combos */
  function comboShared(n, angles, fns, avoid, filter) {
    return function (r) {
      var all = []; (fns || FN).forEach(function (f) { angles.forEach(function (a) { if ((avoid || []).indexOf(key(f, a)) < 0 && (!filter || filter(f, a))) all.push({ fn: f, a: a }); }); });
      return r.shuffle(all).slice(0, n);
    };
  }
  var AV_EX = ['sin240', 'cos135', 'tan330', 'cos225', 'sin180', 'tan270'];

  /* ---------------- solving exactly ---------------- */
  function solveEx(prompt, fn, spec, o) {
    o = o || {};
    var info = U.solveExact(fn, spec), sols = info.sols, all = null;
    if (o.interval) { all = sols; sols = sols.filter(o.interval.has); }
    var lines = (o.pre || []).concat(info.lines);
    if (o.interval) lines.push(sols.length ? 'In ' + t(o.interval.tex) + ': ' + t('\\theta=' + U.angTex(sols, 0, true)) : 'None of them is in ' + t(o.interval.tex) + '.');
    var alts0 = (o.altSets || []).slice();
    if (info.ref === 30 || info.ref === 60) alts0.push({ sols: info.quads.map(function (q) { return U.place(90 - info.ref, q); }).sort(function (a, b) { return a - b; }), code: 'u3l4-ref', hint: 'Check the reference angle in the table: ' + t('\\' + fn + '\\theta_R=' + EX({ p: Math.abs(spec.p), q: spec.q, m: spec.m })) + ' when ' + t('\\theta_R=' + U.deg(info.ref)) + ', not ' + t(U.deg(90 - info.ref)) + '.' });
    var altSets = alts0.map(function (as) { var s2 = as.sols || U.solveExact(as.fn || fn, as.spec).sols; if (o.interval) s2 = s2.filter(o.interval.has); return { sols: s2, code: as.code, hint: as.hint }; }).filter(function (as) { return as.sols.length; });
    var mh = o.missingHint || (info.quadrantal ? 'Check every point on the axes (with ' + t('r=1') + '): ' + t('(1,0)') + ' at ' + t('0^\\circ') + ', ' + t('(0,1)') + ' at ' + t('90^\\circ') + ', ' + t('(-1,0)') + ' at ' + t('180^\\circ') + ', ' + t('(0,-1)') + ' at ' + t('270^\\circ') + '.' : null);
    return U.P.angles(prompt, sols, { exact: true, fn: fn, ref: info.ref, quads: info.quads, all: all, interval: o.interval && o.interval.tex, altSets: altSets, missingHint: mh }, lines.join('<br>'), o.hints || H_SOLVE, o.text || 'solve exactly');
  }
  function iv(lo, hi, loInc, hiInc) {
    return { tex: U.deg(lo) + (loInc ? '\\le' : '<') + '\\theta' + (hiInc ? '\\le' : '<') + U.deg(hi), has: function (x) { return (loInc ? x >= lo : x > lo) && (hiInc ? x <= hi : x < hi); } };
  }
  var IVS = [iv(0, 180, true, true), iv(90, 270, true, true), iv(180, 360, true, false), iv(0, 90, true, true), iv(270, 360, true, false), iv(90, 180, true, true)];
  /* special values that solve fn θ = v nicely: { fn, spec, tex (as written) } */
  function specialVal(r, fn, sign, o) {
    o = o || {};
    var refs = o.refs || [30, 45, 60], rf = r.pick(refs), b = U.BASE[fn][rf], s = U.spec(sign * b[0], b[1], b[2]);
    var tex = EX(s);
    if (o.unrat !== false && U.hasUnrat(s) && r.chance(o.unratP == null ? 0.35 : o.unratP)) tex = EX(s, { unrat: true });
    return { spec: s, tex: tex, ref: rf };
  }

  /* ---------------- exact expressions ---------------- */
  function vTex(fn, a, pw) { return '\\' + fn + (pw ? '^{2}' : '') + ' ' + U.deg(a); }
  function subTex(fn, a, pw) { var e = U.exact(fn, a); return pw ? '\\left(' + EX(e) + '\\right)^{2}' : (e.p < 0 ? '\\left(' + EX(e) + '\\right)' : EX(e)); }
  function nOf(fn, a) { return U.num(U.exact(fn, a)); }
  function absN(fn, a) { var e = U.exact(fn, a); return U.num({ p: Math.abs(e.p), q: e.q, m: e.m }); }
  /* expression parts: o = { tex, sub (substituted tex), val (Num), alt (Num with CAST signs ignored) , extra alts } */
  function exprPart(o, text) {
    var want = U.nSingle(o.val), v = U.nVal(o.val);
    var alts = [];
    if (o.alt && Math.abs(U.nVal(o.alt) - v) > 1e-9) alts.push({ v: U.nVal(o.alt), code: 'u3l4-cast', hint: 'Check the signs: find each angle’s quadrant and use CAST before you substitute.' });
    (o.alts || []).forEach(function (a) { alts.push(a); });
    var key = U.nTex(o.val);
    var p = B.math(t(o.tex), want ? U.exactCheck(want, { alts: alts, signHint: 'Check the signs: use CAST for each angle, and remember that a square is never negative.' }) : U.exactCheck(v, { alts: alts }), key,
      t('=' + o.sub) + (o.mid ? '<br>' + t('=' + o.mid) : '') + '<br>' + t('=' + key), ['Replace each ratio by its exact value in brackets (with its CAST sign), then simplify.', t('\\sin^{2}\\theta') + ' means ' + t('(\\sin\\theta)^{2}') + ': find the value, then square it.'], text || 'exact expression', { keys: 'u3exact', placeholder: 'e.g. -sqrt(3)/2' });
    p.bad = alts.filter(function (a) { return Math.abs(a.v - v) > 1e-6; }).map(function (a) { return String(Math.round(a.v * 1e6) / 1e6); }).concat([v !== 0 ? String(-v) : '1']);
    return p;
  }
  function sameMPair(r, angles) { // two (fn, angle) with the same radical part
    return pickWhere(function () { return [{ fn: r.pick(FN), a: r.pick(angles) }, { fn: r.pick(FN), a: r.pick(angles) }]; }, function (pr) {
      var e1 = U.exact(pr[0].fn, pr[0].a), e2 = U.exact(pr[1].fn, pr[1].a); if (e1 === 'undef' || e2 === 'undef' || !e1.p || !e2.p) return false;
      return e1.m === e2.m && !(pr[0].fn === pr[1].fn && pr[0].a === pr[1].a);
    });
  }
  var EXPR = {
    sum: function (r) { // f1(α) ± f2(β), angles 0°–90°
      var pr = pickWhere(function () { return sameMPair(r, SPQ1); }, function (pr) { return !(pr[0].fn === 'cos' && pr[0].a === 60 && pr[1].fn === 'sin' && pr[1].a === 30); }), op = r.chance(0.5) ? 1 : -1;
      var val = U.nAdd(nOf(pr[0].fn, pr[0].a), op > 0 ? nOf(pr[1].fn, pr[1].a) : U.nNeg(nOf(pr[1].fn, pr[1].a)));
      return { tex: vTex(pr[0].fn, pr[0].a) + (op > 0 ? '+' : '-') + vTex(pr[1].fn, pr[1].a), sub: subTex(pr[0].fn, pr[0].a) + (op > 0 ? '+' : '-') + subTex(pr[1].fn, pr[1].a), val: val };
    },
    sq: function (r) { // f²(α) + c
      var o = pickWhere(function () { return { fn: r.pick(FN), a: r.pick(SPA), c: r.pick([-1, 1, -2, 2, 3, -3]) }; }, function (o) { return !(o.fn === 'tan' && o.a === 300 && o.c === -1); });
      var e = U.exact(o.fn, o.a), sqv = U.nMul(U.num(e), U.num(e)), val = U.nAdd(sqv, U.num(o.c));
      return { tex: vTex(o.fn, o.a, true) + (o.c > 0 ? '+' + o.c : String(o.c)), sub: subTex(o.fn, o.a, true) + (o.c > 0 ? '+' + o.c : String(o.c)), mid: U.nTex(sqv) + (o.c > 0 ? '+' + o.c : String(o.c)), val: val,
        alts: [{ v: -U.nVal(sqv) + o.c, code: 'u3l4-neg-square', hint: 'A square is never negative: ' + t('\\left(-a\\right)^{2}=a^{2}') + '.' }] };
    },
    prod: function (r) { // f1(α) f2(β), product rational
      var pr = pickWhere(function () { return sameMPair(r, SPA); }, function (pr) { return pr[0].a !== pr[1].a && !(pr[0].fn === 'sin' && pr[0].a === 135 && pr[1].fn === 'cos' && pr[1].a === 225); });
      var val = U.nMul(nOf(pr[0].fn, pr[0].a), nOf(pr[1].fn, pr[1].a));
      return { tex: vTex(pr[0].fn, pr[0].a) + vTex(pr[1].fn, pr[1].a), sub: subTex(pr[0].fn, pr[0].a) + subTex(pr[1].fn, pr[1].a), val: val, alt: U.nMul(absN(pr[0].fn, pr[0].a), absN(pr[1].fn, pr[1].a)) };
    },
    kprod: function (r) { // k f1(α) f2(β), one rational value and one radical
      var o = pickWhere(function () { return { f1: r.pick(FN), a1: r.pick(SPA), f2: r.pick(FN), a2: r.pick(SPA), k: r.pick([2, 4, 6, 8]) }; }, function (o) {
        var e1 = U.exact(o.f1, o.a1), e2 = U.exact(o.f2, o.a2); if (e1 === 'undef' || e2 === 'undef') return false;
        if (!((e1.m === 1) !== (e2.m === 1))) return false; if (o.a1 === o.a2) return false;
        var v = U.nMul(U.num(o.k), U.nMul(U.num(e1), U.num(e2))), s = U.nSingle(v); return s && s.q === 1 && !(o.k === 4 && o.f1 === 'sin' && o.a1 === 210 && o.f2 === 'cos' && o.a2 === 330);
      });
      var val = U.nMul(U.num(o.k), U.nMul(nOf(o.f1, o.a1), nOf(o.f2, o.a2)));
      return { tex: o.k + vTex(o.f1, o.a1) + vTex(o.f2, o.a2), sub: o.k + subTex(o.f1, o.a1) + subTex(o.f2, o.a2), val: val, alt: U.nMul(U.num(o.k), U.nMul(absN(o.f1, o.a1), absN(o.f2, o.a2))) };
    },
    quot: function (r) { // (k ± f1(α)) / f2(β): rational values
      var o = pickWhere(function () { return { k: r.pick([1, 2, 3]), op: r.chance(0.5) ? 1 : -1, f1: r.pick(['sin', 'cos']), a1: r.pick([30, 60, 120, 150, 210, 240, 300, 330, 0, 180]), f2: r.pick(['sin', 'cos']), a2: r.pick([90, 270, 0, 180, 30, 150, 210, 330, 60, 120, 240, 300]) }; }, function (o) {
        var e1 = U.exact(o.f1, o.a1), e2 = U.exact(o.f2, o.a2); if (e1.m !== 1 || e2.m !== 1 || !e2.p) return false;
        if (o.k === 1 && o.op < 0 && o.f1 === 'cos' && o.a1 === 120 && o.f2 === 'sin' && o.a2 === 270) return false;
        return Math.abs(U.nVal(U.nAdd(U.num(o.k), o.op > 0 ? U.num(e1) : U.nNeg(U.num(e1))))) > 1e-9;
      });
      var top = U.nAdd(U.num(o.k), o.op > 0 ? nOf(o.f1, o.a1) : U.nNeg(nOf(o.f1, o.a1))), val = U.nDiv(top, nOf(o.f2, o.a2));
      var topA = U.nAdd(U.num(o.k), o.op > 0 ? absN(o.f1, o.a1) : U.nNeg(absN(o.f1, o.a1)));
      return { tex: '\\frac{' + o.k + (o.op > 0 ? '+' : '-') + vTex(o.f1, o.a1) + '}{' + vTex(o.f2, o.a2) + '}', sub: '\\frac{' + o.k + (o.op > 0 ? '+' : '-') + subTex(o.f1, o.a1) + '}{' + subTex(o.f2, o.a2) + '}', mid: '\\frac{' + U.nTex(top) + '}{' + EX(U.exact(o.f2, o.a2)) + '}', val: val,
        alt: Math.abs(U.nVal(topA)) > 1e-9 ? U.nDiv(topA, absN(o.f2, o.a2)) : null };
    },
    pyth: function (r) { // sin²α + cos²α
      var a = r.pick([120, 135, 150, 210, 225, 300, 315, 330]), sw = r.chance(0.5), f = sw ? ['cos', 'sin'] : ['sin', 'cos'];
      var s1 = U.nMul(nOf(f[0], a), nOf(f[0], a)), s2 = U.nMul(nOf(f[1], a), nOf(f[1], a));
      return { tex: vTex(f[0], a, true) + '+' + vTex(f[1], a, true), sub: subTex(f[0], a, true) + '+' + subTex(f[1], a, true), mid: U.nTex(s1) + '+' + U.nTex(s2), val: U.nAdd(s1, s2), alts: [{ v: -U.nVal(s1) + U.nVal(s2), code: 'u3l4-neg-square', hint: 'A square is never negative: ' + t('\\left(-a\\right)^{2}=a^{2}') + '.' }, { v: U.nVal(s1) - U.nVal(s2), code: 'u3l4-neg-square', hint: 'A square is never negative: ' + t('\\left(-a\\right)^{2}=a^{2}') + '.' }] };
    },
    sqdiff: function (r) { // cos²α − sin²α (Extra B1a)
      var a = r.pick([45, 60, 120, 135, 150, 210, 240, 300, 330]), s1 = U.nMul(nOf('cos', a), nOf('cos', a)), s2 = U.nMul(nOf('sin', a), nOf('sin', a));
      return { tex: vTex('cos', a, true) + '-' + vTex('sin', a, true), sub: subTex('cos', a, true) + '-' + subTex('sin', a, true), mid: U.nTex(s1) + '-' + U.nTex(s2), val: U.nAdd(s1, U.nNeg(s2)) };
    },
    axis: function (r) { // f1(α) + f2(quadrantal) (Extra B1b)
      var o = pickWhere(function () { return { f1: r.pick(FN), a1: r.pick(SPA), f2: r.pick(['sin', 'cos']), a2: r.pick(QA), op: r.chance(0.5) ? 1 : -1 }; }, function (o) { var e = U.exact(o.f1, o.a1); return e.m === 1 && !(o.f1 === 'tan' && o.a1 === 225 && o.f2 === 'cos' && o.a2 === 180); });
      var val = U.nAdd(nOf(o.f1, o.a1), o.op > 0 ? nOf(o.f2, o.a2) : U.nNeg(nOf(o.f2, o.a2)));
      return { tex: vTex(o.f1, o.a1) + (o.op > 0 ? '+' : '-') + vTex(o.f2, o.a2), sub: subTex(o.f1, o.a1) + (o.op > 0 ? '+' : '-') + subTex(o.f2, o.a2), val: val, alt: U.nAdd(absN(o.f1, o.a1), o.op > 0 ? absN(o.f2, o.a2) : U.nNeg(absN(o.f2, o.a2))) };
    },
    ratio: function (r) { // f1(α)/f2(β) with equal sizes (Extra B1d)
      var o = pickWhere(function () { return { f1: r.pick(['sin', 'cos']), a1: r.pick(SPA), f2: r.pick(['sin', 'cos']), a2: r.pick(SPA) }; }, function (o) { var e1 = U.exact(o.f1, o.a1), e2 = U.exact(o.f2, o.a2); return e1.m === e2.m && e1.q === e2.q && Math.abs(e1.p) === Math.abs(e2.p) && !(o.f1 === o.f2 && o.a1 === o.a2) && !(o.a1 === 45 && o.a2 === 315); });
      var val = U.nDiv(nOf(o.f1, o.a1), nOf(o.f2, o.a2));
      return { tex: '\\frac{' + vTex(o.f1, o.a1) + '}{' + vTex(o.f2, o.a2) + '}', sub: '\\frac{' + subTex(o.f1, o.a1) + '}{' + subTex(o.f2, o.a2) + '}', val: val };
    }
  };

  /* ---------------- points on the terminal arm ---------------- */
  var K2 = [1, 3, 4, 9, 12, 16, 25, 27, 36, 48, 49, 64, 75, 81];
  function pointGen(r, avoid) {
    return pickWhere(function () {
      var fam = r.pick([30, 45, 60]), k2 = r.pick(K2), q = r.pick([1, 2, 3, 4]);
      var X = fam === 45 ? k2 : fam === 60 ? k2 : 3 * k2, Y = fam === 45 ? k2 : fam === 60 ? 3 * k2 : k2;
      return { X: X, Y: Y, sx: q === 1 || q === 4 ? 1 : -1, sy: q <= 2 ? 1 : -1, ref: fam, q: q, a: U.place(fam, q) };
    }, function (P) {
      if (P.q === 1 && r.chance(0.7)) return false;
      var tx = U.radTexOf(P.sx, P.X) + ',' + U.radTexOf(P.sy, P.Y);
      return (avoid || []).indexOf(tx) < 0 && Math.max(P.X, P.Y) <= 243;
    });
  }
  var AV_PT = ['2\\sqrt{3},-2', '-3,-3\\sqrt{3}', '-5,5\\sqrt{3}', '6,-6', '-2\\sqrt{3},-2', '-7,7', '\\sqrt{3},-3', '-4\\sqrt{3},4', '2,2\\sqrt{3}'];
  function ptTex(P) { return '(' + U.radTexOf(P.sx, P.X) + ',\\ ' + U.radTexOf(P.sy, P.Y) + ')'; }
  function pointSol(P, name) {
    var xT = U.radTexOf(P.sx, P.X), yT = U.radTexOf(P.sy, P.Y), tn = U.radRatio(P.sx * P.sy, P.Y, P.X);
    return 'Quadrant ' + U.ROM[P.q] + '. ' + t('\\tan\\theta=\\frac{y}{x}=\\frac{' + yT + '}{' + xT + '}=' + EX(tn)) + ', so ' + t('\\theta_R=' + U.deg(P.ref)) + '.' + (P.q === 1 ? '' : ' ' + t('\\theta=' + U.placeTex(P.q, P.ref) + '=' + U.deg(P.a)));
  }
  function pointAlts(P) {
    var alts = [{ v: P.ref, code: 'u3l4-ref-only', hint: t(U.deg(P.ref)) + ' is the reference angle. The point is in Quadrant ' + U.ROM[P.q] + ', so place ' + t('\\theta_R') + ' there.' }];
    var other = P.ref === 30 ? 60 : P.ref === 60 ? 30 : null;
    if (other) alts.push({ v: U.place(other, P.q), code: 'u3l4-tan-flip', hint: 'Check ' + t('\\tan\\theta_R=\\frac{|y|}{|x|}') + ' (rise over run): that gives ' + t('\\theta_R=' + U.deg(P.ref)) + ', not ' + t(U.deg(other)) + '.' });
    [1, 2, 3, 4].forEach(function (z) { if (z !== P.q && U.place(P.ref, z) !== P.ref) alts.push({ v: U.place(P.ref, z), code: 'u3l4-quad', hint: 'Check the quadrant: ' + t('x') + ' is ' + (P.sx > 0 ? 'positive' : 'negative') + ' and ' + t('y') + ' is ' + (P.sy > 0 ? 'positive' : 'negative') + ', so the point is in Quadrant ' + U.ROM[P.q] + '.' }); });
    return alts;
  }
  function pointPart(P, o) {
    o = o || {};
    var sk = U.sketch({ x: P.sx * Math.sqrt(P.X), y: P.sy * Math.sqrt(P.Y), label: '(' + U.plainRad(P.sx, P.X) + ', ' + U.plainRad(P.sy, P.Y) + ')', width: 190 });
    return U.P.deg(o.prompt || t(ptTex(P)), P.a, pointAlts(P), sk + pointSol(P), ['Find the quadrant from the signs of ' + t('x') + ' and ' + t('y') + '.', 'Use ' + t('\\tan\\theta_R=\\frac{|y|}{|x|}') + ' and the table to find ' + t('\\theta_R') + ', then place it in the quadrant.'], 'angle from a point');
  }
  /* two points on one circle: P at α, Q at β (counterclockwise from P) */
  function rotGen(r, avoid) {
    return pickWhere(function () {
      var fam = r.pick(['3060', '3060', '45']), k = r.int(1, 5);
      var angs = fam === '45' ? [45, 135, 225, 315] : [30, 60, 120, 150, 210, 240, 300, 330, 90, 270, 0, 180];
      var ab = r.sample(angs, 2), r2 = fam === '45' ? 2 * k * k : 4 * k * k;
      function pt(a) { var c = U.exact('cos', a), s = U.exact('sin', a); return { X: r2 * U.val(c) * U.val(c), Y: r2 * U.val(s) * U.val(s), sx: U.val(c) < -1e-12 ? -1 : 1, sy: U.val(s) < -1e-12 ? -1 : 1, a: a }; }
      var P = pt(ab[0]), Q = pt(ab[1]);
      [P, Q].forEach(function (z) { z.X = Math.round(z.X); z.Y = Math.round(z.Y); z.q = U.quad(z.a); z.ref = U.ref(z.a); });
      return { P: P, Q: Q, r2: r2, rot: U.norm(ab[1] - ab[0]) };
    }, function (o) { var tx = ptTex(o.P) + ptTex(o.Q); return (avoid || []).indexOf(tx) < 0 && o.rot !== 180 && !(o.P.q === 0 && o.Q.q === 0) && o.r2 <= 100; });
  }
  function angOfPt(Z) {
    if (!Z.q) return 'on the axis: ' + t(U.deg(Z.a));
    var xT = U.radTexOf(Z.sx, Z.X), yT = U.radTexOf(Z.sy, Z.Y), tn = U.radRatio(Z.sx * Z.sy, Z.Y, Z.X);
    return 'Quadrant ' + U.ROM[Z.q] + ', ' + t('\\tan=\\frac{' + yT + '}{' + xT + '}=' + EX(tn)) + ', ' + t('\\theta_R=' + U.deg(Z.ref)) + ', angle ' + t(U.deg(Z.a));
  }
  function ptT2(Z) { return '(' + U.radTexOf(Z.sx, Z.X) + ',\\ ' + U.radTexOf(Z.sy, Z.Y) + ')'; }
  function rotSol(o, nm) { nm = nm || ['P', 'Q']; return t(nm[0]) + ': ' + angOfPt(o.P) + '.<br>' + t(nm[1]) + ': ' + angOfPt(o.Q) + '.<br>Rotation: ' + t(o.Q.a >= o.P.a ? U.deg(o.Q.a) + '-' + U.deg(o.P.a) + '=' + U.deg(o.rot) : U.deg(o.Q.a) + '+' + U.deg(360) + '-' + U.deg(o.P.a) + '=' + U.deg(o.rot)); }
  function rotAlts(o) {
    var a = [{ v: U.norm(o.P.a - o.Q.a), code: 'u3l4-cw', hint: 'That’s the clockwise rotation. Counterclockwise from ' + t('P') + ' to ' + t('Q') + ': (angle of ' + t('Q') + ') − (angle of ' + t('P') + ')' + (o.Q.a < o.P.a ? ', adding ' + t('360^\\circ') + ' when it passes the positive ' + t('x') + '-axis' : '') + '.' }];
    if (o.Q.a !== o.rot) a.push({ v: o.Q.a, code: 'u3l4-rot-end', hint: 'That’s the angle of ' + t('Q') + ' in standard position. The point starts at ' + t('P') + ', not on the positive ' + t('x') + '-axis.' });
    return a;
  }

  /* ---------------- isolating forms ---------------- */
  function isoForm(r, fn, kind, avoid) {
    return pickWhere(function () {
      var s = r.chance(0.5) ? 1 : -1, o = { fn: fn };
      var f = '\\' + fn + '\\theta';
      if (kind === 'half') { var m = r.pick([2, 3]); o.spec = U.spec(-s, 2, m); o.tex = '2' + f + (s > 0 ? '+' : '-') + '\\sqrt{' + m + '}=0'; o.pre = t('2' + f + '=' + (s > 0 ? '-' : '') + '\\sqrt{' + m + '}') + ', so ' + t(f + '=' + EX(o.spec)) + '.'; }
      else if (kind === 'root2') { o.spec = U.spec(s, 2, 2); o.tex = '\\sqrt{2}' + f + (s > 0 ? '-1' : '+1') + '=0'; o.pre = t(f + '=' + (s < 0 ? '-' : '') + '\\frac{1}{\\sqrt{2}}=' + EX(o.spec)) + '.'; }
      else if (kind === 'tan3') { o.spec = U.spec(s, 3, 3); o.tex = '3' + f + (s > 0 ? '-' : '+') + '\\sqrt{3}=0'; o.pre = t('3' + f + '=' + (s < 0 ? '-' : '') + '\\sqrt{3}') + ', so ' + t(f + '=' + EX(o.spec)) + '.'; }
      else if (kind === 'tanr3') { o.spec = U.spec(s, 3, 3); o.tex = '\\sqrt{3}' + f + (s > 0 ? '-1' : '+1') + '=0'; o.pre = t(f + '=' + (s < 0 ? '-' : '') + '\\frac{1}{\\sqrt{3}}=' + EX(o.spec)) + '.'; }
      else if (kind === 'tanroot') { o.spec = U.spec(s, 1, 3); o.tex = f + (s > 0 ? '-' : '+') + '\\sqrt{3}=0'; o.pre = t(f + '=' + EX(o.spec)) + '.'; }
      else { // lead: a − k f = b, f = (a − b)/k = ±1/2
        var k = r.pick([2, 4, 6]), b = r.int(-5, 8), a = b + s * k / 2; o.spec = U.spec(s, 2, 1);
        if (a <= 0) return null;
        if (r.chance(0.5)) { o.tex = a + '-' + k + f + '=' + b; o.pre = t('-' + k + f + '=' + b + (a >= 0 ? '-' + a : '+' + (-a)) + '=' + (b - a)) + ', so ' + t(f + '=' + EX(o.spec)) + '.'; }
        else { var c = r.int(-6, 6), d = c + s * k / 2; o.tex = k + f + (c > 0 ? '+' + c : c < 0 ? String(c) : '') + '=' + d; o.pre = t(k + f + '=' + d + (c > 0 ? '-' + c : '+' + (-c)) + '=' + (d - c)) + ', so ' + t(f + '=' + EX(o.spec)) + '.'; if (c === 0) return null; }
      }
      return o;
    }, function (o) { return o && (avoid || []).indexOf(o.tex) < 0; });
  }
  var AV_ISO = ['2\\cos\\theta+\\sqrt{3}=0', '\\sqrt{2}\\cos\\theta-1=0', '3\\tan\\theta-\\sqrt{3}=0', '5-2\\sin\\theta=4', '2\\sin\\theta+1=0', '\\sqrt{3}\\tan\\theta+1=0', '2\\cos\\theta-\\sqrt{3}=0', '2\\cos\\theta+\\sqrt{2}=0', '\\sqrt{2}\\sin\\theta-1=0'];
  function isoPart(o, extra) {
    extra = extra || {};
    return solveEx(t(o.tex) + (extra.suffix || ''), o.fn, o.spec, { pre: [o.pre], interval: extra.interval, altSets: [{ spec: U.neg(o.spec), code: 'u3l3-isolate', hint: 'Check the sign when you move the constant to the other side of the equation.' }],
      hints: ['Isolate the ratio first, like solving a linear equation. Rationalize the value if needed.'].concat(H_SOLVE), text: 'isolate, then solve exactly' });
  }
  /* squared: k f² + … ; v2 = [p, q] the value of f² */
  function sqForm(r, fn, avoid) {
    return pickWhere(function () {
      var v2 = fn === 'tan' ? r.pick([[1, 3], [1, 1], [3, 1]]) : r.pick([[1, 4], [1, 2], [3, 4]]), m = r.pick([1, 1, 2, 3]), k = v2[1] * m, c = v2[0] * m, f = '\\' + fn + '^{2}\\theta', kind = r.int(0, 2), e = r.int(1, 6);
      var tex = kind === 0 ? (k === 1 ? '' : k) + f + '=' + c : kind === 1 ? (k === 1 ? '' : k) + f + '-' + c + '=0' : (k === 1 ? '' : k) + f + '+' + e + '=' + (c + e);
      return { fn: fn, v2: v2, k: k, c: c, tex: tex };
    }, function (o) { return (avoid || []).indexOf(o.tex) < 0 && !(o.k === 1 && o.v2[0] === 1 && o.v2[1] === 1); });
  }
  var AV_SQ = ['4\\cos^{2}\\theta=1', '2\\sin^{2}\\theta-1=0', '3\\tan^{2}\\theta=1', '4\\sin^{2}\\theta-3=0', '2\\cos^{2}\\theta=1', '\\tan^{2}\\theta=1'];
  function sqPart(o) {
    var f = '\\' + o.fn, v2T = o.v2[1] === 1 ? String(o.v2[0]) : '\\frac{' + o.v2[0] + '}{' + o.v2[1] + '}';
    var sp = U.spec(1, o.v2[1], o.v2[0] * o.v2[1]), sn = U.neg(sp), s1 = U.solveExact(o.fn, sp), s2 = U.solveExact(o.fn, sn);
    var all = s1.sols.concat(s2.sols).sort(function (a, b) { return a - b; });
    var rt = o.v2[1] === 1 ? (o.v2[0] === 1 ? '1' : '\\sqrt{' + o.v2[0] + '}') : '\\frac{' + (o.v2[0] === 1 ? '1' : '\\sqrt{' + o.v2[0] + '}') + '}{' + (sq(o.v2[1]) ? Math.round(Math.sqrt(o.v2[1])) : '\\sqrt{' + o.v2[1] + '}') + '}';
    var lines = [t(f + '^{2}\\theta=' + v2T) + ', so ' + t(f + '\\theta=\\pm' + rt + (EX(sp) !== rt ? '=\\pm' + EX(sp) : '')) + '; ' + t('\\theta_R=' + U.deg(s1.ref)) + ' in all four quadrants.', t('\\theta=' + U.angTex(all, 0, true))];
    return U.P.angles(t(o.tex), all, { exact: true, fn: o.fn, ref: s1.ref, quads: [1, 2, 3, 4], missingHint: 'Taking the square root gives <b>two</b> values, ' + t('\\pm') + '. Solve ' + t(f + '\\theta=' + EX(sp)) + ' and ' + t(f + '\\theta=' + EX(sn)) + ': four solutions.',
      altSets: (s1.ref === 30 || s1.ref === 60 ? [{ sols: [1, 2, 3, 4].map(function (q) { return U.place(90 - s1.ref, q); }), code: 'u3l4-ref', hint: 'Check the reference angle in the table: ' + t(f + '\\theta_R=' + EX(sp)) + ' when ' + t('\\theta_R=' + U.deg(s1.ref)) + '.' }] : []).concat([{ sols: s1.sols, code: 'u3l4-pm', hint: 'You solved only ' + t(f + '\\theta=' + EX(sp)) + '. The square root gives ' + t('\\pm') + ': solve ' + t(f + '\\theta=' + EX(sn)) + ' too.' }, { sols: s2.sols, code: 'u3l4-pm', hint: 'The square root gives ' + t('\\pm') + ': solve ' + t(f + '\\theta=' + EX(sp)) + ' too.' }]) },
      lines.join('<br>'), ['Isolate ' + t(f + '^{2}\\theta') + ', then take the square root of both sides — remember ' + t('\\pm') + '.'].concat(H_SOLVE), 'squared ratio, solve exactly');
  }
  function sq(n) { var s = Math.round(Math.sqrt(n)); return s * s === n; }

  /* ---------------- angle + the other two ratios ---------------- */
  function angleRatios(r, avoid, o) {
    o = o || {};
    var c = pickWhere(function () {
      var a = r.pick([120, 135, 150, 210, 225, 240, 300, 315, 330]), g = r.pick(FN), q = U.quad(a), s = U.sign(g, q), qs = U.quadsFor(g, s), other = qs[0] === q ? qs[1] : qs[0];
      var kind = r.chance(0.5) ? 'not' : 'sign', f2 = r.pick(FN.filter(function (f) { return f !== g; }));
      return { a: a, g: g, q: q, other: other, kind: kind, f2: f2, letter: r.pick(['A', 'B']) };
    }, function (c) { return (avoid || []).indexOf(c.g + c.a) < 0 && (o.kind == null || c.kind === o.kind); });
    var L = c.letter, gv = U.exact(c.g, c.a), cond = c.kind === 'not' ? t(L) + ' is not in Quadrant ' + U.ROM[c.other] : t('\\' + c.f2 + ' ' + L + (U.sign(c.f2, c.q) > 0 ? '>0' : '<0'));
    var others = FN.filter(function (f) { return f !== c.g; });
    var boxes = [{ label: t(L + '='), name: L, deg: c.a, alts: [{ v: U.ref(c.a), code: 'u3l4-ref-only', hint: 'That’s the reference angle; place it in Quadrant ' + U.ROM[c.q] + '.' }, { v: U.place(U.ref(c.a), c.other), code: 'u3l4-quad', hint: 'That angle is in Quadrant ' + U.ROM[c.other] + (c.kind === 'not' ? ', which the question rules out.' : ', where ' + t('\\' + c.f2) + ' has the wrong sign.') }] }]
      .concat(others.map(function (f) { return { label: t('\\' + f + ' ' + L + '='), name: f + ' ' + L, want: U.exact(f, c.a), alts: evAlts(f, c.a), signHint: 'Check the sign: ' + t(L) + ' is in Quadrant ' + U.ROM[c.q] + ', where ' + U.castWhy(c.q) + '.' }; }));
    var sol = (c.kind === 'not' ? t('\\' + c.g) + ' ' + sgnWord(U.sign(c.g, c.q)) + ': Quadrants ' + U.quadsTex(U.quadsFor(c.g, U.sign(c.g, c.q))) + ', not ' + U.ROM[c.other] + ', so Quadrant ' + U.ROM[c.q] + '.' : t('\\' + c.g) + ' ' + (U.sign(c.g, c.q) > 0 ? '+' : '−') + ', ' + t('\\' + c.f2) + ' ' + (U.sign(c.f2, c.q) > 0 ? '+' : '−') + ': Quadrant ' + U.ROM[c.q] + '.') +
      ' ' + t('\\theta_R=' + U.deg(U.ref(c.a))) + ', ' + t(L + '=' + U.placeTex(c.q, U.ref(c.a)) + '=' + U.deg(c.a)) + '.<br>' + others.map(function (f) { return t('\\' + f + ' ' + L + '=' + EX(U.exact(f, c.a))); }).join(', &nbsp; ');
    var lead = o.lead != null ? o.lead : 'Determine the angle (' + t('0^\\circ\\le ' + L + '<360^\\circ') + ') and the exact values of the other two ratios.';
    return U.P.boxes((lead ? lead + '<br>' : '') + t('\\' + c.g + ' ' + L + '=' + EX(gv)) + (c.kind === 'not' ? ' and ' : ' and ') + cond, boxes, sol,
      ['Use the sign of the given ratio and the condition to pick the quadrant; the table gives ' + t('\\theta_R') + '.', 'Then write the other two ratios with their CAST signs.'], 'angle and the other two ratios');
  }

  /* ============================== the assignment ============================== */
  var QUESTIONS = [
    { num: '1', section: 'The special triangles', stem: 'Use the special triangles (45-45-90 with sides ' + t('1,\\ 1,\\ \\sqrt{2}') + '; 30-60-90 with sides ' + t('1,\\ \\sqrt{3},\\ 2') + ') to write each exact value in rationalized form.',
      shared: comboShared(6, SPQ1), parts: [0, 1, 2, 3, 4, 5].map(function (i) {
        return { id: '1' + 'abcdef'[i], level: 'BEG', make: function (r, sh) { var c = sh[i]; return evPart(c.fn, c.a, { rational: true, sol: TRI + triSol(c.fn, c.a) }); } }; }) },
    { num: '2', section: 'Exact values in any quadrant', stem: 'Determine the exact value.', shared: function (r) {
        return { sp: comboShared(8, SPX, FN, AV_EX.concat(['cos150', 'sin225', 'tan315', 'sin120', 'cos240', 'tan210', 'tan135', 'sin210']))(r), qa: comboShared(3, QA, FN, ['cos90', 'tan180', 'sin270'], function (f, a) { return !(f === 'tan' && (a === 90 || a === 270)); })(r), und: r.pick([90, 270]) }; },
      parts: 'abcdefghijkl'.split('').map(function (l, i) {
        return { id: '2' + l, level: 'EMG', make: function (r, sh) {
          if (i < 6) return evPart(sh.sp[i].fn, sh.sp[i].a); if (i < 9) return evPart(sh.qa[i - 6].fn, sh.qa[i - 6].a); if (i === 9) return evPart('tan', sh.und); return evPart(sh.sp[i - 4].fn, sh.sp[i - 4].a);
        } }; }) },
    { num: '3', section: 'Patterns in the exact values', parts: [
      { id: '3a', level: 'EMG', make: function (r) {
        var k = r.pick([['sin', 30, 'cos', 60], ['sin', 60, 'cos', 30], ['cos', 30, 'sin', 60], ['cos', 60, 'sin', 30], ['sin', 45, 'cos', 45]]);
        var opp = k[0] === 'sin' ? k[1] : 90 - k[1], side = opp === 30 ? '1' : opp === 60 ? '\\sqrt{3}' : '1', hyp = k[1] === 45 ? '\\sqrt{2}' : '2';
        var right = k[1] === 45 ? 'The two legs are equal, so the side opposite ' + t('45^\\circ') + ' and the side adjacent to the other ' + t('45^\\circ') + ' both have length ' + t('1') + '; both ratios divide it by the hypotenuse ' + t('\\sqrt{2}') + '.'
          : 'The side opposite ' + t(U.deg(opp)) + ' is the side adjacent to ' + t(U.deg(90 - opp)) + ' (length ' + t(side) + '), and both ratios divide it by the hypotenuse ' + t(hyp) + '.';
        return U.mc(r, 'Use the 30-60-90 or 45-45-90 triangle: why is ' + t(fnT(k[0], k[1]) + '=' + fnT(k[2], k[3])) + '?', [{ html: right, right: true },
          { html: 'Sine and cosine are always equal for any angle.', why: 'Not for every angle: ' + t('\\sin 30^\\circ=\\frac{1}{2}') + ' but ' + t('\\cos 30^\\circ=\\frac{\\sqrt{3}}{2}') + '. Look at which side each ratio uses.', code: 'u3l4-why-always' },
          { html: 'Both angles are in Quadrant I, so the ratios are positive.', why: 'Both are positive, but that doesn’t make them equal. Compare the sides each ratio uses.', code: 'u3l4-why-quad' },
          { html: 'The two angles add to ' + t('90^\\circ') + ', so the two ratios add to ' + t('1') + '.', why: 'The ratios don’t add to 1 here. Compare the sides each ratio uses in the triangle.', code: 'u3l4-why-add' }],
          right + ' Both equal ' + t(EX(U.exact(k[0], k[1]))) + '.', ['Label the sides of the triangle opposite and adjacent to each angle.'], 'why the ratios are equal');
      } },
      { id: '3b', level: 'PRG', make: function (r) {
        var a = pickWhere(function () { return r.pick([30, 45, 120, 135, 150, 210, 240, 300, 315, 330, 0, 180]); }, function (a) { return a !== 60 && a !== 225; });
        var s = U.exact('sin', a), c = U.exact('cos', a), tn = U.exact('tan', a);
        return U.P.exact('Use exact values to evaluate ' + t('\\frac{\\sin ' + U.deg(a) + '}{\\cos ' + U.deg(a) + '}') + '. (Compare your answer with ' + t('\\tan ' + U.deg(a)) + '.)', tn, { alts: [{ v: U.val(c) / U.val(s), code: 'u3l4-tan-flip', hint: 'That’s ' + t('\\frac{\\cos}{\\sin}') + '. Divide the sine by the cosine.' }] },
          t('\\frac{\\sin ' + U.deg(a) + '}{\\cos ' + U.deg(a) + '}=\\frac{' + EX(s) + '}{' + EX(c) + '}=' + EX(tn)) + ', which is ' + t('\\tan ' + U.deg(a)) + '. (In general ' + t('\\frac{y/r}{x/r}=\\frac{y}{x}') + '.)', ['Write the exact values of ' + t('\\sin') + ' and ' + t('\\cos') + ', then divide (multiply by the reciprocal).'], 'sin / cos');
      } },
      { id: '3c', level: 'EMG', make: function (r) {
        var fn = r.pick(FN), D = { sin: 'increases from ' + t('0') + ' to ' + t('1'), cos: 'decreases from ' + t('1') + ' to ' + t('0'), tan: 'increases from ' + t('0') + ' and has no largest value (it is undefined at ' + t('90^\\circ') + ')' };
        var opts = [{ html: D[fn].charAt(0).toUpperCase() + D[fn].slice(1) + '.', right: true }].concat(FN.filter(function (f) { return f !== fn; }).map(function (f) { return { html: D[f].charAt(0).toUpperCase() + D[f].slice(1) + '.', why: 'That describes ' + t('\\' + f + '\\theta') + '. Look at the ' + fn + ' row of the table: ' + [0, 30, 45, 60, 90].map(function (a) { return t(EX(U.exact(fn, a))); }).join(', ') + '.', code: 'u3l4-pattern' }; }))
          .concat([{ html: 'Stays the same.', why: 'Look at the ' + fn + ' row of the table of exact values.', code: 'u3l4-pattern' }]);
        return U.mc(r, 'As ' + t('\\theta') + ' increases from ' + t('0^\\circ') + ' to ' + t('90^\\circ') + ', what happens to ' + t('\\' + fn + '\\theta') + '?', opts,
          t('\\' + fn + '\\theta') + ' at ' + t('0^\\circ,30^\\circ,45^\\circ,60^\\circ,90^\\circ') + ': ' + [0, 30, 45, 60, 90].map(function (a) { return t(EX(U.exact(fn, a))); }).join(', ') + '. It ' + D[fn] + '.', ['Read the ' + fn + ' row of the table of exact values from left to right.'], 'pattern as θ increases');
      } }] },
    { num: '4', section: 'Exact expressions', stem: 'Determine the exact value of each expression.', parts: [
      { id: '4a', level: 'EMG', make: function (r) { return exprPart(EXPR.sum(r)); } },
      { id: '4b', level: 'PRG', make: function (r) { return exprPart(EXPR.sq(r)); } },
      { id: '4c', level: 'PRG', make: function (r) { return exprPart(EXPR.prod(r)); } },
      { id: '4d', level: 'PRG', make: function (r) { return exprPart(EXPR.kprod(r)); } },
      { id: '4e', level: 'ADV', make: function (r) { return exprPart(EXPR.quot(r)); } },
      { id: '4f', level: 'PRG', make: function (r) { return exprPart(EXPR.pyth(r)); } }] },
    { num: '5', section: 'True or false', stem: 'True or false? (The exact values are in the feedback.)', parts: [
      { id: '5a', level: 'EMG', make: function (r) { return tfRef(r, 'neg'); } },
      { id: '5b', level: 'PRG', make: function (r) { return tfDouble(r); } },
      { id: '5c', level: 'EMG', make: function (r) { return tfRef(r, 'tan'); } },
      { id: '5d', level: 'EMG', make: function (r) { return tfRef(r, 'same'); } }] },
    { num: '6', section: 'Solving equations exactly', stem: 'Solve for ' + t('\\theta') + ', ' + t('0^\\circ\\le\\theta<360^\\circ') + ', without a calculator.',
      shared: function (r) { var f = r.shuffle(['sin', 'cos']), qa = r.shuffle([['sin', 0], ['sin', 1], ['sin', -1], ['cos', 0], ['cos', 1], ['cos', -1], ['tan', 0]]); return { f: f, qa: qa }; }, parts: [
      { id: '6a', level: 'EMG', make: function (r, sh) { var v = specialVal(r, sh.f[0], 1); return solveEx(t(fnT(sh.f[0]) + '=' + v.tex), sh.f[0], v.spec); } },
      { id: '6b', level: 'PRG', make: function (r, sh) { var fn = r.pick(['sin', 'cos']), v = specialVal(r, fn, -1); return solveEx(t(fnT(fn) + '=' + v.tex), fn, v.spec); } },
      { id: '6c', level: 'PRG', make: function (r) { var v = specialVal(r, 'tan', -1); return solveEx(t(fnT('tan') + '=' + v.tex), 'tan', v.spec); } },
      { id: '6d', level: 'EMG', make: function (r, sh) { var v = specialVal(r, sh.f[1], 1); return solveEx(t(fnT(sh.f[1]) + '=' + v.tex), sh.f[1], v.spec); } },
      { id: '6e', level: 'EMG', make: function (r, sh) { var z = sh.qa[0]; return solveEx(t(fnT(z[0]) + '=' + z[1]), z[0], U.spec(z[1])); } },
      { id: '6f', level: 'PRG', make: function (r) { var s = r.chance(0.7) ? -1 : 1, v = specialVal(r, 'tan', s, { refs: [30, 60] }); return solveEx(t(fnT('tan') + '=' + v.tex), 'tan', v.spec); } },
      { id: '6g', level: 'EMG', make: function (r, sh) { var z = sh.qa[1]; return solveEx(t(fnT(z[0]) + '=' + z[1]), z[0], U.spec(z[1])); } },
      { id: '6h', level: 'PRG', make: function (r) { var v = r.pick(['tan', 'xy']); return solveEx(v === 'tan' ? t('\\tan\\theta') + ' is undefined' : 'the ratio ' + t('\\frac{y}{x}') + ' for the terminal arm of ' + t('\\theta') + ' is undefined', 'tan', 'undef', { hints: [t('\\tan\\theta=\\frac{y}{x}') + ' is undefined when the denominator ' + t('x') + ' is ' + t('0') + '.', 'Where on the axes is ' + t('x=0') + '?'] }); } }] },
    { num: '7', stem: 'Solve for ' + t('\\theta') + ', ' + t('0^\\circ\\le\\theta<360^\\circ') + ', without a calculator.', parts: [
      { id: '7a', level: 'PRG', make: function (r) { return isoPart(isoForm(r, r.pick(['sin', 'cos']), 'half', AV_ISO)); } },
      { id: '7b', level: 'PRG', make: function (r) { return isoPart(isoForm(r, r.pick(['sin', 'cos']), 'root2', AV_ISO)); } },
      { id: '7c', level: 'PRG', make: function (r) { return isoPart(isoForm(r, 'tan', r.pick(['tan3', 'tanr3', 'tanroot']), AV_ISO)); } },
      { id: '7d', level: 'PRG', make: function (r) { return isoPart(isoForm(r, r.pick(['sin', 'cos']), 'lead', AV_ISO)); } }] },
    { num: '8', stem: 'Solve for ' + t('\\theta') + ', ' + t('0^\\circ\\le\\theta<360^\\circ') + ', without a calculator.', shared: function (r) { return r.shuffle(FN); }, parts: [0, 1, 2].map(function (i) {
      return { id: '8' + 'abc'[i], level: 'ADV', make: function (r, sh) { return sqPart(sqForm(r, sh[i], AV_SQ)); } }; }) },
    { num: '9', section: 'Restricted intervals', stem: 'Solve each equation in the given interval, without a calculator.', parts: [0, 1, 2].map(function (i) {
      return { id: '9' + 'abc'[i], level: 'ADV', make: function (r) {
        var o = pickWhere(function () { var fn = r.pick(FN); return { fn: fn, v: specialVal(r, fn, r.chance(0.5) ? 1 : -1, { unratP: 0 }), I: r.pick(IVS), form: i === 2 && fn !== 'tan' && r.chance(0.7) }; },
          function (o) { var s = U.solveExact(o.fn, o.v.spec).sols.filter(o.I.has); return s.length === 1 && !(o.fn === 'cos' && o.v.tex === '-\\frac{\\sqrt{3}}{2}' && o.I.tex.indexOf('180') === 0) && !(o.fn === 'tan' && o.v.tex === '\\sqrt{3}' && o.I.tex.indexOf('90') === 0); });
        var eq = fnT(o.fn) + '=' + o.v.tex, pre = [];
        if (o.form && o.v.spec.m === 1) { eq = '2' + fnT(o.fn) + '=' + (o.v.spec.p < 0 ? '-1' : '1'); pre.push(t(fnT(o.fn) + '=' + o.v.tex) + '.'); }
        return solveEx(t(eq) + ', ' + t(o.I.tex), o.fn, o.v.spec, { interval: o.I, pre: pre, hints: ['Find both solutions from ' + t('0^\\circ') + ' to ' + t('360^\\circ') + ' first, then keep only the ones in the interval.'], text: 'solve exactly in an interval' });
      } }; }) },
    { num: '10', section: 'Exact angles from a point or a ratio', stem: 'Each point is on the terminal arm of ' + t('\\theta') + '. Determine ' + t('\\theta') + ' exactly, ' + t('0^\\circ\\le\\theta<360^\\circ') + '.', outcome: 'T1', parts: [0, 1, 2].map(function (i) {
      return { id: '10' + 'abc'[i], level: 'PRG', make: function (r) { return pointPart(pointGen(r, AV_PT)); } }; }) },
    { num: '11', stem: 'Determine the angle (from ' + t('0^\\circ') + ' to ' + t('360^\\circ') + ') and the exact values of the other two ratios.', parts: [
      { id: '11a', level: 'ADV', make: function (r) { return angleRatios(r, ['cos315', 'sin150'], { kind: 'not', lead: '' }); } },
      { id: '11b', level: 'ADV', make: function (r) { return angleRatios(r, ['tan120', 'sin240'], { kind: 'sign', lead: '' }); } }] },
    { num: '12', outcome: 'T1', parts: [{ id: '12', level: 'MAS', make: function (r) {
      var o = rotGen(r, ['(2,\\ 2\\sqrt{3})(2\\sqrt{3},\\ -2)', '(-3\\sqrt{3},\\ 3)(3,\\ -3\\sqrt{3})']);
      return U.P.deg('A point moves counterclockwise around a circle centred at the origin, from ' + t('P' + ptT2(o.P)) + ' to ' + t('Q' + ptT2(o.Q)) + '. Through what angle does it rotate?', o.rot, rotAlts(o), rotSol(o),
        ['Find the angle in standard position of each point (quadrant, then ' + t('\\theta_R') + ' from ' + t('\\tan\\theta_R=\\frac{|y|}{|x|}') + ').', 'Counterclockwise rotation from ' + t('P') + ' to ' + t('Q') + ' = (angle of ' + t('Q') + ') − (angle of ' + t('P') + '), plus ' + t('360^\\circ') + ' if that is negative.'], 'rotation between two points');
    } }] },
    { num: '13', section: 'Find the error', shared: function (r) {
        var a1 = r.pick([120, 135, 150, 210, 225, 240, 300, 315, 330]), f1 = pickWhere(function () { return r.pick(FN); }, function (f) { var e = U.exact(f, a1); return e.p < 0 && !(f === 'sin' && a1 === 240); });
        var a2 = pickWhere(function () { return r.pick([120, 150, 210, 240, 300, 330]); }, function (a) { return a !== a1; }), f2 = pickWhere(function () { return r.pick(FN); }, function (f) { return !(f === 'tan' && a2 === 150); });
        var wrongRef = U.ref(a2) === 30 ? 60 : 30, sam2 = U.spec(U.sign(f2, U.quad(a2)) * U.BASE[f2][wrongRef][0], U.BASE[f2][wrongRef][1], U.BASE[f2][wrongRef][2]);
        return { a1: a1, f1: f1, a2: a2, f2: f2, sam1: U.neg(U.exact(f1, a1)), sam2: sam2, wrongRef: wrongRef, name: r.pick(['Sam', 'Priya', 'Mateo', 'Ava']) };
      }, stem: function (sh) { return sh.name + ' wrote: “' + t(fnT(sh.f1, sh.a1) + '=' + EX(sh.sam1)) + ' because the reference angle is ' + t(U.deg(U.ref(sh.a1))) + '” and “' + t(fnT(sh.f2, sh.a2) + '=' + EX(sh.sam2)) + ' because ' + t(U.deg(sh.a2)) + ' is in Quadrant ' + U.ROM[U.quad(sh.a2)] + '.” Each statement has an error. Give the correct value.'; }, parts: [
      { id: '13a', level: 'ADV', make: function (r, sh) { return evPart(sh.f1, sh.a1, { prompt: 'Correct the first statement: ' + t(fnT(sh.f1, sh.a1) + '=\\;?'), pre: t(U.deg(sh.a1)) + ' is in Quadrant ' + U.ROM[U.quad(sh.a1)] + ', where ' + U.castWhy(U.quad(sh.a1)) + ': the value is negative. ' }); } },
      { id: '13b', level: 'ADV', make: function (r, sh) { return evPart(sh.f2, sh.a2, { prompt: 'Correct the second statement: ' + t(fnT(sh.f2, sh.a2) + '=\\;?'), pre: 'The reference angle of ' + t(U.deg(sh.a2)) + ' is ' + t(U.deg(U.ref(sh.a2))) + ', not ' + t(U.deg(sh.wrongRef)) + '. ' }); } }] },
    { num: '14', section: 'Multiple choice and numerical response', parts: [{ id: '14', level: 'PRG', make: function (r) {
      var o = pickWhere(function () { return { f1: r.pick(FN), a1: r.pick(SPA), f2: r.pick(FN), a2: r.pick(SPA) }; }, function (o) {
        var e1 = U.exact(o.f1, o.a1), e2 = U.exact(o.f2, o.a2); if (o.a1 === o.a2 || (o.f1 === 'cos' && o.a1 === 210 && o.f2 === 'sin' && o.a2 === 300)) return false;
        var v = [U.val(e1) + U.val(e2), -U.val(e1) + U.val(e2), U.val(e1) - U.val(e2), -U.val(e1) - U.val(e2)];
        return v.every(function (x, i) { return v.every(function (y, j) { return i === j || Math.abs(x - y) > 1e-9; }); });
      });
      var n1 = nOf(o.f1, o.a1), n2 = nOf(o.f2, o.a2), opt = function (a, b) { return t(U.nTex(U.nAdd(a, b))); };
      return U.mc(r, 'The exact value of ' + t(vTex(o.f1, o.a1) + '+' + vTex(o.f2, o.a2)) + ' is', [{ html: opt(n1, n2), right: true },
        { html: opt(U.nNeg(n1), n2), why: 'Check the sign of ' + t(fnT(o.f1, o.a1)) + ' (CAST).', code: 'u3l4-sign' }, { html: opt(n1, U.nNeg(n2)), why: 'Check the sign of ' + t(fnT(o.f2, o.a2)) + ' (CAST).', code: 'u3l4-sign' },
        { html: opt(U.nNeg(n1), U.nNeg(n2)), why: 'Check both signs with CAST.', code: 'u3l4-sign' }],
        t(fnT(o.f1, o.a1) + '=' + EX(U.exact(o.f1, o.a1))) + ' and ' + t(fnT(o.f2, o.a2) + '=' + EX(U.exact(o.f2, o.a2))) + '; the sum is ' + t(U.nTex(U.nAdd(n1, n2))) + '.', H_EV, 'exact sum (MC)');
    } }] },
    { num: '15', parts: [{ id: '15', level: 'PRG', make: function (r) {
      var o = pickWhere(function () { var fn = r.pick(['sin', 'cos', 'tan']); return isoForm(r, fn, fn === 'tan' ? r.pick(['tan3', 'tanr3', 'tanroot']) : r.pick(['half', 'root2', 'lead']), AV_ISO); }, function (o) { return o.spec.p < 0; });
      var info = U.solveExact(o.fn, o.spec), rf = info.ref, P4 = [1, 2, 3, 4].map(function (q) { return U.place(rf, q); }), ans = info.sols[0];
      return U.mc(r, 'The smallest positive solution of ' + t(o.tex) + ' is', P4.map(function (a) { return a === ans ? { html: t(U.deg(a)), right: true } : { html: t(U.deg(a)), why: info.sols.indexOf(a) >= 0 ? 'That is a solution, but not the smallest one.' : 'Check: ' + t(fnT(o.fn, a)) + ' has the wrong sign (CAST). The value is negative, so ' + t('\\theta') + ' is in Quadrants ' + U.quadsTex(info.quads) + '.', code: info.sols.indexOf(a) >= 0 ? 'u3l4-not-smallest' : 'u3l4-quad' }; }),
        o.pre + ' ' + info.lines.join(' ') + ' The smallest is ' + t(U.deg(ans)) + '.', H_SOLVE, 'smallest positive solution (MC)', true);
    } }] },
    { num: '16', parts: [{ id: '16', level: 'ADV', make: function (r) { return notEqualPart(r); } }] },
    { num: '17', parts: [{ id: '17', level: 'ADV', make: function (r) {
      var o = pickWhere(function () { var fn = r.pick(FN); return isoForm(r, fn, fn === 'tan' ? r.pick(['tan3', 'tanr3', 'tanroot']) : r.pick(['half', 'root2', 'lead']), AV_ISO.concat(['2\\cos\\theta-\\sqrt{3}=0'])); }, function () { return true; });
      var info = U.solveExact(o.fn, o.spec), ans = info.sols.reduce(function (s, x) { return s + x; }, 0);
      var p = B.nr('The sum of all the solutions of ' + t(o.tex) + ' for ' + t('0^\\circ\\le\\theta<360^\\circ') + ', in degrees, is ____.', ans, function (v) {
        if (info.sols.indexOf(v) >= 0) return { code: 'u3l3-missing', hint: 'That’s one solution. Find both, then add them.' }; return null; },
        o.pre + ' ' + info.lines.join(' ') + ' Sum: ' + t(info.sols.join('+') + '=' + ans) + '.', H_SOLVE, 'sum of the solutions (NR)');
      p.bad = info.sols.map(String); return p;
    } }] },
    { num: '18', parts: [{ id: '18', level: 'MAS', make: function (r) { return nrExprPart(r, 'tt'); } }] }
  ];

  /* ---- true / false ---- */
  function tfRef(r, kind) {
    var o = pickWhere(function () {
      var fn = kind === 'tan' ? 'tan' : r.pick(FN), a = r.pick([120, 135, 150, 210, 225, 240, 300, 315, 330]), rf = U.ref(a), s = kind === 'neg' ? -1 : 1, B2 = rf;
      if (kind === 'tan') B2 = r.pick([rf, U.place(rf, r.pick([2, 3, 4]))]);
      return { fn: fn, a: a, rf: rf, s: s, b: B2 };
    }, function (o) { var bad = { neg: 'cos120', tan: 'tan225', same: 'sin300' }[kind]; return o.a !== o.b && o.fn + o.a !== bad; });
    var L = U.exact(o.fn, o.a), Rv = U.exact(o.fn, o.b), truth = Math.abs(U.val(L) - o.s * U.val(Rv)) < 1e-9;
    var st = fnT(o.fn, o.a) + '=' + (o.s < 0 ? '-' : '') + fnT(o.fn, o.b), why = t(fnT(o.fn, o.a) + '=' + EX(L)) + ' and ' + t((o.s < 0 ? '-' : '') + fnT(o.fn, o.b) + '=' + EX(o.s < 0 ? U.neg(Rv) : Rv)) + (truth ? ': they are equal.' : ': they are not equal.');
    return B.tf(r, t(st), truth, why, (truth ? '<b>True.</b> ' : '<b>False.</b> ') + why + ' (' + t(U.deg(o.a)) + ': Quadrant ' + U.ROM[U.quad(o.a)] + ', ' + U.castWhy(U.quad(o.a)) + '.)', ['Write the exact value of each side, with the sign from CAST.'], 'true/false exact values');
  }
  function tfDouble(r) {
    var v = r.pick(['dbl', 'dbl', 'sin2', 'cos2', 'sum']), a = r.pick([30, 45]), b, st, L, Rv, fn;
    if (v === 'dbl') { fn = r.pick(FN); if (fn === 'tan' && a === 45) a = 30; if (fn === 'cos' && a === 45 && r.chance(0.5)) a = 30; L = U.val(U.exact(fn, 2 * a)); Rv = 2 * U.val(U.exact(fn, a)); st = '\\' + fn + '\\left(2\\times ' + U.deg(a) + '\\right)=2\\' + fn + ' ' + U.deg(a); }
    else if (v === 'sin2') { a = r.pick([30, 45, 60]); L = U.val(U.exact('sin', 2 * a)); Rv = 2 * U.val(U.exact('sin', a)) * U.val(U.exact('cos', a)); st = '\\sin\\left(2\\times ' + U.deg(a) + '\\right)=2\\sin ' + U.deg(a) + '\\cos ' + U.deg(a); }
    else if (v === 'cos2') { a = r.pick([30, 45, 60]); L = U.val(U.exact('cos', 2 * a)); var cA = U.val(U.exact('cos', a)), sA = U.val(U.exact('sin', a)); Rv = cA * cA - sA * sA; st = '\\cos\\left(2\\times ' + U.deg(a) + '\\right)=\\cos^{2} ' + U.deg(a) + '-\\sin^{2} ' + U.deg(a); }
    else { fn = r.pick(['sin', 'cos']); a = 30; b = 60; L = U.val(U.exact(fn, 90)); Rv = U.val(U.exact(fn, 30)) + U.val(U.exact(fn, 60)); st = '\\' + fn + '\\left(30^\\circ+60^\\circ\\right)=\\' + fn + ' 30^\\circ+\\' + fn + ' 60^\\circ'; }
    var truth = Math.abs(L - Rv) < 1e-9, vt = function (x) { var n = U.nTex(numOfVal(x)); return n; };
    var why = 'Left side ' + t('=' + vt(L)) + ', right side ' + t('=' + vt(Rv)) + '.' + (truth ? '' : (v === 'dbl' ? ' Doubling the angle does not double the ratio.' : ' The ratio of a sum is not the sum of the ratios.'));
    return B.tf(r, t(st), truth, why, (truth ? '<b>True.</b> ' : '<b>False.</b> ') + why, ['Work out each side exactly with the table of values.'], 'true/false: doubling an angle');
  }
  function numOfVal(x) { // a value of the form p/q·√m with m in {1, 2, 3} → Num
    for (var m = 1; m <= 3; m++) for (var q = 1; q <= 12; q++) { var p = x * q / Math.sqrt(m); if (Math.abs(p - Math.round(p)) < 1e-9) { var o = {}; if (Math.round(p)) o[m] = [Math.round(p) / gcd(Math.round(p), q), q / gcd(Math.round(p), q)]; return o; } }
    var a = {}; return a;
  }
  /* ---- which is NOT equal to v ---- */
  function notEqualPart(r) {
    var o = pickWhere(function () { var fn = r.pick(['sin', 'cos']), rf = r.pick([30, 60]), s = r.chance(0.5) ? 1 : -1; return { v: U.spec(s * U.BASE[fn][rf][0], U.BASE[fn][rf][1], U.BASE[fn][rf][2]) }; }, function (o) { return !(o.v.p === 1 && o.v.q === 2 && o.v.m === 1 && r.chance(0.6)); });
    var V = U.val(o.v), pool = [];
    FN.forEach(function (fn) { SPA.forEach(function (a) { var e = U.exact(fn, a); if (e === 'undef') return; var x = U.val(e); if (Math.abs(x - V) < 1e-9) pool.push({ tex: fnT(fn, a), eq: true }); else if (Math.abs(x + V) < 1e-9) { pool.push({ tex: '-' + fnT(fn, a), eq: true }); pool.push({ tex: fnT(fn, a), eq: false, fn: fn, a: a }); } }); });
    var eqs = r.shuffle(pool.filter(function (p) { return p.eq; })), neqs = r.shuffle(pool.filter(function (p) { return !p.eq; }));
    var pick = []; eqs.forEach(function (p) { if (pick.length < 3 && !pick.some(function (z) { return z.tex.replace('-', '') === p.tex.replace('-', ''); })) pick.push(p); });
    if (!pick.some(function (z) { return z.tex.charAt(0) === '-'; })) { var neg = eqs.filter(function (p) { return p.tex.charAt(0) === '-'; })[0]; if (neg) pick[2] = neg; }
    var odd = pickWhere(function () { return r.pick(neqs); }, function (p) { return !pick.some(function (z) { return z.tex.replace('-', '') === p.tex; }); });
    var opts = pick.map(function (p) { return { html: t(p.tex), why: t(p.tex) + ' does equal ' + t(EX(o.v)) + '.', code: 'u3l4-is-equal' }; }).concat([{ html: t(odd.tex), right: true }]);
    return U.mc(r, 'Which of the following is <b>not</b> equal to ' + t(EX(o.v)) + '?', opts,
      t(odd.tex + '=' + EX(U.exact(odd.fn, odd.a))) + ' (Quadrant ' + U.ROM[U.quad(odd.a)] + ', ' + U.castWhy(U.quad(odd.a)) + '). The others equal ' + t(EX(o.v)) + ': ' + pick.map(function (p) { return t(p.tex); }).join(', ') + '.', H_EV, 'not equal (MC)');
  }
  /* ---- NR integer expressions ---- */
  function nrExprPart(r, kind) {
    var o = pickWhere(function () {
      if (kind === 'tt') { // f1(α) f2(β) + k f3²(γ)
        var f1 = r.pick(FN), a1 = r.pick(SPA), f2 = r.pick(FN), a2 = r.pick(SPA), f3 = r.pick(FN), a3 = r.pick(SPA.concat([0, 180])), k = r.pick([2, 3, 4, 6, 8, 12]), op = r.chance(0.7) ? 1 : -1;
        return { f1: f1, a1: a1, f2: f2, a2: a2, f3: f3, a3: a3, k: k, op: op };
      }
      var g = r.pick(['sin', 'cos']), b = r.pick(SPA.concat([0, 90, 180, 270])), kk = r.pick([4, 8, 12, 16, 3, 6]), h = r.pick(['tan', 'sin', 'cos']), c = r.pick(SPA.concat([0, 180]));
      return { f3: g, a3: b, k: kk, f1: h, a1: c, op: -1 };
    }, function (o) {
      var e3 = U.exact(o.f3, o.a3); if (e3 === 'undef') return false;
      var t3 = U.nMul(U.num(o.k), U.nMul(U.num(e3), U.num(e3)));
      var val;
      if (kind === 'tt') { var e1 = U.exact(o.f1, o.a1), e2 = U.exact(o.f2, o.a2); if (e1 === 'undef' || e2 === 'undef' || e1.m !== e2.m || o.a1 === o.a2) return false; var p = U.nMul(U.num(e1), U.num(e2)); val = U.nAdd(p, o.op > 0 ? t3 : U.nNeg(t3)); o.t1 = p; }
      else { var e = U.exact(o.f1, o.a1); if (e === 'undef' || e.m !== 1) return false; val = U.nAdd(t3, U.nNeg(U.num(e))); o.t1 = U.num(e); }
      var s = U.nSingle(val); if (!s || s.m !== 1 || s.q !== 1 || s.p <= 0 || s.p > 99) return false;
      o.val = s.p; o.t3 = t3; return !(kind === 'tt' && o.f1 === 'tan' && o.a1 === 60 && o.a2 === 240) && !(kind !== 'tt' && o.k === 12 && o.a3 === 30 && o.f1 === 'tan' && o.a1 === 45);
    });
    var tex, sub;
    if (kind === 'tt') { tex = '\\left(' + vTex(o.f1, o.a1) + '\\right)\\left(' + vTex(o.f2, o.a2) + '\\right)' + (o.op > 0 ? '+' : '-') + o.k + vTex(o.f3, o.a3, true); sub = '\\left(' + EX(U.exact(o.f1, o.a1)) + '\\right)\\left(' + EX(U.exact(o.f2, o.a2)) + '\\right)' + (o.op > 0 ? '+' : '-') + o.k + subTex(o.f3, o.a3, true); }
    else { tex = o.k + vTex(o.f3, o.a3, true) + '-' + vTex(o.f1, o.a1); sub = o.k + subTex(o.f3, o.a3, true) + '-' + subTex(o.f1, o.a1); }
    var mid = U.nTex(o.t1) + (kind === 'tt' ? (o.op > 0 ? '+' : '-') : '') + (kind === 'tt' ? U.nTex(o.t3) : '');
    if (kind !== 'tt') mid = U.nTex(o.t3) + '-' + (U.nVal(o.t1) < 0 ? '\\left(' + U.nTex(o.t1) + '\\right)' : U.nTex(o.t1));
    var p = B.nr('The exact value of ' + t(tex) + ' is ____.', o.val, null, t('=' + sub) + '<br>' + t('=' + mid + '=' + o.val), ['Replace each ratio by its exact value in brackets, then simplify. ' + t('\\cos^{2}\\theta=(\\cos\\theta)^{2}') + '.'], 'exact expression (NR)');
    return p;
  }

  /* ============================== the extra practice ============================== */
  var EXTRA = [
    { num: 'A1', section: 'A. Skills', stem: 'Determine the exact value, without a calculator.', shared: function (r) {
        return { sp: comboShared(7, SPX, FN, AV_EX.concat(['sin330', 'cos315', 'tan120', 'sin135', 'tan240', 'cos210', 'tan300']))(r), qa: comboShared(3, QA, FN, ['cos180', 'sin90', 'cos270'])(r) }; },
      parts: 'abcdefghij'.split('').map(function (l, i) {
        var qi = { 3: 0, 7: 1, 9: 2 }[i], si = [0, 1, 2, null, 3, 4, 5, null, 6, null][i];
        return { id: 'A1' + l, level: 'EMG', make: function (r, sh) { return qi != null ? evPart(sh.qa[qi].fn, sh.qa[qi].a) : evPart(sh.sp[si].fn, sh.sp[si].a); } }; }) },
    { num: 'A2', stem: 'Solve for ' + t('\\theta') + ', ' + t('0^\\circ\\le\\theta<360^\\circ') + ', without a calculator.', shared: function (r) { return { qa: r.shuffle([['sin', 0], ['sin', 1], ['sin', -1], ['cos', 0], ['cos', 1], ['cos', -1], ['tan', 0]]), f: r.shuffle(FN) }; }, parts: [
      { id: 'A2a', level: 'EMG', make: function (r, sh) { var v = specialVal(r, sh.f[0], 1); return solveEx(t(fnT(sh.f[0]) + '=' + v.tex), sh.f[0], v.spec); } },
      { id: 'A2b', level: 'EMG', make: function (r, sh) { var v = specialVal(r, sh.f[1], 1); return solveEx(t(fnT(sh.f[1]) + '=' + v.tex), sh.f[1], v.spec); } },
      { id: 'A2c', level: 'EMG', make: function (r, sh) { var v = specialVal(r, sh.f[2], 1); return solveEx(t(fnT(sh.f[2]) + '=' + v.tex), sh.f[2], v.spec); } },
      { id: 'A2d', level: 'EMG', make: function (r, sh) { var z = sh.qa[0]; return solveEx(t(fnT(z[0]) + '=' + z[1]), z[0], U.spec(z[1])); } },
      { id: 'A2e', level: 'EMG', make: function (r, sh) { var z = sh.qa[1]; return solveEx(t(fnT(z[0]) + '=' + z[1]), z[0], U.spec(z[1])); } },
      { id: 'A2f', level: 'PRG', make: function (r) { var fn = r.pick(FN), v = specialVal(r, fn, -1); return solveEx(t(fnT(fn) + '=' + v.tex), fn, v.spec); } }] },
    { num: 'A3', stem: 'Each point is on the terminal arm of ' + t('\\theta') + '. Determine ' + t('\\theta') + ' exactly, ' + t('0^\\circ\\le\\theta<360^\\circ') + '.', outcome: 'T1', parts: [0, 1, 2].map(function (i) {
      return { id: 'A3' + 'abc'[i], level: 'PRG', make: function (r) { return pointPart(pointGen(r, AV_PT)); } }; }) },
    { num: 'B1', section: 'B. Applying', stem: 'Determine the exact value of each expression.', parts: [
      { id: 'B1a', level: 'PRG', make: function (r) { return exprPart(EXPR.sqdiff(r)); } },
      { id: 'B1b', level: 'PRG', make: function (r) { return exprPart(EXPR.axis(r)); } },
      { id: 'B1c', level: 'PRG', make: function (r) { return exprPart(EXPR.kprod(r)); } },
      { id: 'B1d', level: 'PRG', make: function (r) { return exprPart(EXPR.ratio(r)); } }] },
    { num: 'B2', stem: 'Solve for ' + t('\\theta') + ', ' + t('0^\\circ\\le\\theta<360^\\circ') + ', without a calculator.', shared: function (r) { return r.shuffle(FN); }, parts: [0, 1].map(function (i) {
      return { id: 'B2' + 'ab'[i], level: 'ADV', make: function (r, sh) { return sqPart(sqForm(r, sh[i], AV_SQ)); } }; }) },
    { num: 'B3', stem: 'Solve in the given interval, without a calculator.', parts: [0, 1].map(function (i) {
      return { id: 'B3' + 'ab'[i], level: 'ADV', make: function (r) {
        var o = pickWhere(function () { var fn = r.pick(FN), kind = fn === 'tan' ? 'tanroot' : r.pick(['half', 'root2', 'lead']); return { f: isoForm(r, fn, kind, AV_ISO.concat(['2\\cos\\theta=-1', '\\tan\\theta+1=0'])), I: r.pick(IVS) }; },
          function (o) { return U.solveExact(o.f.fn, o.f.spec).sols.filter(o.I.has).length === 1; });
        return isoPart(o.f, { interval: o.I, suffix: ', ' + t(o.I.tex) });
      } }; }) },
    { num: 'B4', parts: [{ id: 'B4', level: 'ADV', make: function (r) { return angleRatios(r, ['sin240'], { kind: 'sign', lead: 'Determine the angle (' + t('0^\\circ\\le A<360^\\circ') + ') and the exact values of the other two ratios.' }); } }] },
    { num: 'B5', parts: [{ id: 'B5', level: 'PRG', make: function (r) {
      var o = pickWhere(function () { var fn = r.pick(['sin', 'cos', 'tan']); return isoForm(r, fn, fn === 'tan' ? r.pick(['tan3', 'tanr3', 'tanroot']) : r.pick(['half', 'root2', 'lead']), ['\\sqrt{2}\\sin\\theta-1=0']); }, function () { return true; });
      var info = U.solveExact(o.fn, o.spec), rf = info.ref, P4 = [1, 2, 3, 4].map(function (q) { return U.place(rf, q); });
      var right = info.quads.join(), pairs = [[1, 2], [1, 4], [2, 3], [1, 3], [3, 4], [2, 4]].filter(function (c) { return c.join() !== right; });
      var pr = function (qs) { return t(qs.map(function (q) { return U.deg(P4[q - 1]); }).join(',\\ ')); };
      var opts = [{ html: pr(info.quads), right: true }].concat(r.shuffle(pairs).slice(0, 3).map(function (c) { return { html: pr(c), why: 'CAST: the value is ' + (o.spec.p > 0 ? 'positive' : 'negative') + ', so ' + t('\\theta') + ' is in Quadrants ' + U.quadsTex(info.quads) + '.', code: 'u3l4-quad' }; }));
      return U.mc(r, 'The solutions of ' + t(o.tex) + ', ' + t('0^\\circ\\le\\theta<360^\\circ') + ', are', opts, o.pre + ' ' + info.lines.join(' '), H_SOLVE, 'solution set (MC)');
    } }] },
    { num: 'B6', parts: [{ id: 'B6', level: 'ADV', make: function (r) { return nrExprPart(r, 'kc'); } }] },
    { num: 'C1', section: 'C. Stretch', outcome: 'T1', parts: [{ id: 'C1', level: 'MAS', make: function (r) {
      var o = rotGen(r, ['(-3\\sqrt{3},\\ 3)(3,\\ -3\\sqrt{3})', '(2,\\ 2\\sqrt{3})(2\\sqrt{3},\\ -2)']), rr = U.spec(1, 1, o.r2);
      var p = U.P.boxes('A point moves counterclockwise around a circle centred at the origin, from ' + t('A' + ptT2(o.P)) + ' to ' + t('B' + ptT2(o.Q)) + '. Through what angle does it rotate? What is the radius of the circle?',
        [{ label: 'Rotation:', name: 'Rotation', deg: o.rot, alts: rotAlts(o) }, { label: 'Radius ' + t('r='), name: 'Radius', want: rr, alts: [{ v: o.r2, code: 'u3l4-r-noroot', hint: 'That’s ' + t('r^{2}') + '. Take the square root: ' + t('r=\\sqrt{x^{2}+y^{2}}') + '.' }] }],
        rotSol(o, ['A', 'B']) + '<br>Radius ' + t('r=\\sqrt{x^{2}+y^{2}}=\\sqrt{' + o.P.X + '+' + o.P.Y + '}=' + EX(rr)) + '.',
        ['Find each point’s angle in standard position, then subtract (counterclockwise).', t('r=\\sqrt{x^{2}+y^{2}}') + ' for either point.'], 'rotation and radius');
      return p;
    } }] },
    { num: 'C2', parts: [{ id: 'C2', level: 'MAS', make: function (r) {
      var o = pickWhere(function () { var fn = r.pick(['sin', 'cos']), rs = r.sample([[1, 2], [-1, 2], [1, 1], [-1, 1], [0, 1]], 2); return { fn: fn, rs: rs }; },
        function (o) { return !(o.fn === 'sin' && o.rs.some(function (z) { return z[0] === -1 && z[1] === 2; }) && o.rs.some(function (z) { return z[0] === 1 && z[1] === 1; })); });
      // factor (q s − p) for each root p/q
      var f = o.rs.map(function (z) { return [z[1], -z[0]]; }), A = f[0][0] * f[1][0], Bc = f[0][0] * f[1][1] + f[0][1] * f[1][0], C = f[0][1] * f[1][1], s = '\\' + o.fn + '\\theta', s2 = '\\' + o.fn + '^{2}\\theta';
      var poly = (A === 1 ? '' : A) + s2 + (Bc === 0 ? '' : (Bc > 0 ? '+' : '-') + (Math.abs(Bc) === 1 ? '' : Math.abs(Bc)) + s) + (C === 0 ? '' : (C > 0 ? '+' : '') + C) + '=0';
      var facT = f.map(function (z) { return z[1] === 0 ? (z[0] === 1 ? '' : z[0]) + s : '\\left(' + (z[0] === 1 ? '' : z[0]) + s + (z[1] > 0 ? '+' : '-') + Math.abs(z[1]) + '\\right)'; }).join('');
      var parts = o.rs.map(function (z) { var sp = U.spec(z[0], z[1]), info = U.solveExact(o.fn, sp); return { sp: sp, info: info }; });
      var all = []; parts.forEach(function (p) { p.info.sols.forEach(function (x) { if (all.indexOf(x) < 0) all.push(x); }); }); all.sort(function (a, b) { return a - b; });
      var lines = [t(facT + '=0')].concat(parts.map(function (p) { return t(s + '=' + EX(p.sp)) + ': ' + p.info.lines.join(' '); })).concat(['Solutions: ' + t(U.angTex(all, 0, true))]);
      return U.P.angles('Solve ' + t(poly) + ' for ' + t('0^\\circ\\le\\theta<360^\\circ') + '. (Hint: let ' + t('s=' + s) + ' and factor.)', all,
        { exact: true, missingHint: 'Each factor gives its own solutions: set both factors equal to ' + t('0') + '.', altSets: parts.map(function (p) { return { sols: p.info.sols, code: 'u3l3-missing', hint: 'That solves one factor. Set the other factor equal to ' + t('0') + ' too.' }; }) },
        lines.join('<br>'), ['Factor like ' + t('2s^{2}-s-1=(2s+1)(s-1)') + ', then set each factor to ' + t('0') + '.'].concat(H_SOLVE), 'quadratic in ' + o.fn);
    } }] },
    { num: 'C3', parts: [
      { id: 'C3a', level: 'PRG', make: function (r) {
        var a = r.pick([120, 135, 210, 225, 240, 300, 330]), s = U.exact('sin', a), c = U.exact('cos', a), s2 = U.nSingle(U.nMul(U.num(s), U.num(s))), c2 = U.nSingle(U.nMul(U.num(c), U.num(c)));
        var neg = function (x) { return { v: -U.val(x), code: 'u3l4-neg-square', hint: 'A square is never negative: ' + t('\\left(-a\\right)^{2}=a^{2}') + '.' }; };
        return U.P.boxes('For ' + t('\\theta=' + U.deg(a)) + ', determine the exact values of ' + t('\\sin^{2}\\theta') + ' and ' + t('\\cos^{2}\\theta') + '. (Then check that ' + t('\\sin^{2}\\theta+\\cos^{2}\\theta=1') + '.)',
          [{ label: t('\\sin^{2}\\theta='), name: 'sin²θ', want: s2, alts: [neg(s2), { v: U.val(s), code: 'u3l4-no-square', hint: 'Now square it.' }] }, { label: t('\\cos^{2}\\theta='), name: 'cos²θ', want: c2, alts: [neg(c2), { v: U.val(c), code: 'u3l4-no-square', hint: 'Now square it.' }] }],
          t('\\sin ' + U.deg(a) + '=' + EX(s)) + ', so ' + t('\\sin^{2}' + U.deg(a) + '=\\left(' + EX(s) + '\\right)^{2}=' + EX(s2)) + '.<br>' + t('\\cos ' + U.deg(a) + '=' + EX(c)) + ', so ' + t('\\cos^{2}' + U.deg(a) + '=\\left(' + EX(c) + '\\right)^{2}=' + EX(c2)) + '.<br>' + t(EX(s2) + '+' + EX(c2) + '=1'),
          ['Find each exact value first (with its sign), then square it.'], 'sin² and cos²');
      } },
      { id: 'C3b', level: 'MAS', make: function (r) {
        return U.mc(r, 'Why is ' + t('\\sin^{2}\\theta+\\cos^{2}\\theta=1') + ' true for <b>every</b> angle ' + t('\\theta') + '? (Use a point ' + t('P(x,y)') + ' on the terminal arm, ' + t('r>0') + '.)', [
          { html: t('\\sin^{2}\\theta+\\cos^{2}\\theta=\\frac{y^{2}}{r^{2}}+\\frac{x^{2}}{r^{2}}=\\frac{x^{2}+y^{2}}{r^{2}}=\\frac{r^{2}}{r^{2}}=1') + ', because ' + t('x^{2}+y^{2}=r^{2}') + '.', right: true },
          { html: t('\\sin\\theta+\\cos\\theta=1') + ' for every angle, so squaring both keeps it true.', why: t('\\sin 45^\\circ+\\cos 45^\\circ=\\sqrt{2}') + ', not 1. Use ' + t('x') + ', ' + t('y') + ' and ' + t('r') + '.', code: 'u3l4-why-sum' },
          { html: 'It is only true for the special angles in the table.', why: 'It’s true for every angle: write ' + t('\\sin\\theta') + ' and ' + t('\\cos\\theta') + ' with ' + t('x') + ', ' + t('y') + ', ' + t('r') + '.', code: 'u3l4-why-special' },
          { html: 'Because ' + t('x+y=r') + ' on the terminal arm.', why: 'Not ' + t('x+y=r') + ': the Pythagorean theorem gives ' + t('x^{2}+y^{2}=r^{2}') + '.', code: 'u3l4-why-xy' }],
          'In general ' + t('\\sin^{2}\\theta+\\cos^{2}\\theta=\\frac{y^{2}}{r^{2}}+\\frac{x^{2}}{r^{2}}=\\frac{x^{2}+y^{2}}{r^{2}}=\\frac{r^{2}}{r^{2}}=1') + ', since ' + t('x^{2}+y^{2}=r^{2}') + '.', ['Write ' + t('\\sin\\theta=\\frac{y}{r}') + ' and ' + t('\\cos\\theta=\\frac{x}{r}') + ', square, and add.'], 'why sin² + cos² = 1');
      } }] }
  ];

  HW.addCodes({ 'u3l4-ref': 'Wrong reference angle (30° ↔ 60°)', 'u3l4-swap': 'Used sin for cos (or cos for sin)', 'u3l4-tan-flip': 'tan upside down (x/y)', 'u3l4-sign': 'Wrong sign (CAST)', 'u3l4-xy': 'Mixed up x and y on an axis',
    'u3l4-cast': 'Ignored the CAST signs', 'u3l4-neg-square': 'Squared a negative to a negative', 'u3l4-pm': 'Forgot ± (only one sign of the square root)', 'u3l4-ref-only': 'Gave the reference angle', 'u3l4-quad': 'Wrong quadrant',
    'u3l4-cw': 'Gave the clockwise rotation', 'u3l4-rot-end': 'Gave the end angle, not the rotation', 'u3l4-r-noroot': 'Gave r² for the radius', 'u3l4-no-square': 'Didn’t square',
    'mc-u3l4-why-always': 'Said sin and cos are always equal (MC)', 'mc-u3l4-why-quad': 'Gave the quadrant as the reason (MC)', 'mc-u3l4-why-add': 'Said the ratios add to 1 (MC)', 'mc-u3l4-pattern': 'Wrong pattern for the ratio (MC)',
    'mc-u3l4-sign': 'Wrong sign (MC)', 'mc-u3l4-quad': 'Wrong quadrant (MC)', 'mc-u3l4-not-smallest': 'A solution, not the smallest (MC)', 'mc-u3l4-is-equal': 'Picked one that is equal (MC)',
    'mc-u3l4-why-sum': 'Said sin + cos = 1 (MC)', 'mc-u3l4-why-special': 'Said it holds only for special angles (MC)', 'mc-u3l4-why-xy': 'Said x + y = r (MC)' });
  HW.addPartial({ 'u3l4-ref': 'b', 'u3l4-swap': 'b', 'u3l4-tan-flip': 'b', 'u3l4-sign': 'b', 'u3l4-xy': 'b', 'u3l4-cast': 'b', 'u3l4-neg-square': 'b', 'u3l4-pm': 'b', 'u3l4-ref-only': 'b', 'u3l4-quad': 'b', 'u3l4-cw': 'b', 'u3l4-rot-end': 'n', 'u3l4-r-noroot': 's', 'u3l4-no-square': 's' });

  HW.defineLesson({ id: LID, unit: 3, num: '4', title: 'Exact Values from Special Triangles', outcome: 'T2', calc: false, questions: QUESTIONS, extra: EXTRA });
})(window);
