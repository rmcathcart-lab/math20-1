/* Math 20-1 · Unit 5 · Lesson 6 — Completing the Square (outcome RF4 on every part)
 * Assignment 6 (m201book unit5/u5_l06.tex, Questions 1–18) and the Lesson 6 Extra Practice (u5_ep06.tex, A1–A3, B1–B6,
 * C1–C4). Every part is a generator: the booklet question's idea, form and difficulty with new numbers (contexts vary a
 * little); the lesson's example functions and the booklet's own are left out. Calculator lesson: vertex forms and values
 * are exact (fractions where the booklet uses them), zeros exact and to the nearest hundredth where the booklet asks.
 *
 * Uses the Unit 5 kit HW.u5k34 (js/lessons/u5l3.js) and HW.p55 (js/lessons/u5l5.js) only lazily, inside generators and
 * checkers. Vertex-form answers: K.u5k34 exprChk (equal at several x, written a(x − p)² + q); completing-the-square slips are
 * recognised by the vertex form they give. Answers in k or m use the keypad 'p55v' (the u5k34 keypad plus the letter).
 * Recognised mistakes (codes u5l6-…): b not halved, b/2 not squared, a negative number added ((−9)² written −81), the sign
 * inside the square not matching b, the subtracted number not multiplied by a, the number added instead of subtracted, a
 * factored from the x²-term only, the sign of the x-term kept when factoring out a negative, the max/min value taken as p or
 * the time, the range from the wrong value or the wrong way; error analysis: the wrong step named.
 * Conversions: "show that … has no x-intercepts" → the vertex form, the minimum value and the x-intercepts ("none");
 * "identify the step with the error, explain" → multiple choice of steps with reasons, then the corrected vertex form;
 * "complete the square in general and show the axis is x = −b/2a" → multiple choice of the completed square; "show that
 * the area is …" → the greatest area and the width; numerical response → a number box (4 characters).
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: 13, 16, Extra C1(b), C4. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, B = K.P, t = K.t, form = K.form;
  var LID = 'u5l6';
  var Z = null, P5 = null;
  function z() { if (!Z) { Z = HW.u5k34; if (!Z) throw new Error('u5l6.js needs HW.u5k34 (js/lessons/u5l3.js)'); } return Z; }
  function p5() { if (!P5) { P5 = HW.p55; if (!P5) throw new Error('u5l6.js needs HW.p55 (js/lessons/u5l5.js)'); } return P5; }
  function cl(x) { return Math.round(x * 1e9) / 1e9; }
  function same(a, b) { return Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b)); }
  function pickWhere(gen, okf) { for (var i = 0; i < 20000; i++) { var o = gen(); if (okf(o)) return o; } throw new Error(LID + ': no valid numbers'); }
  function nz(r, a, b) { return pickWhere(function () { return r.int(a, b); }, function (x) { return x !== 0; }); }
  function sgn(r) { return r.chance(0.5) ? 1 : -1; }
  function isInt(x) { return Math.abs(x - Math.round(x)) < 1e-9; }
  function vT(x) { return z().vT(x); }
  function rT(x) { return z().rT(x); }
  function sT(x, f) { return z().sT(x, f == null ? true : f); }
  function aTex(a) { return z().aTex(a, true); }
  function vfTex(a, p, q, v) { return z().vfTex(a, p, q, v || 'x', true); }
  function polyTex(c, v) { return z().polyTex(c, v || 'x', true); }
  function binTex(v, p) { return z().binTex(v, p, true); }
  function ptTex(x, y) { return z().ptTex(x, y); }
  function ptR(x, y) { return '\\left(' + rT(x) + ',\\ ' + rT(y) + '\\right)'; }
  function par(a, p, q) { return function (x) { return a * (x - p) * (x - p) + q; }; }
  function eqy(tex, v) { return t((v || 'y') + '=' + tex); }

  /* the keypad 'p55v': u5k34 plus a key for each extra letter (k, m, …) */
  var W = HW.widgets;
  if (W && W.KEYSETS) {
    W.KEYSETS.p55v = function (opt) {
      var base = W.KEYSETS.u5k34 || W.KEYSETS.poly, rows = (typeof base === 'function' ? base(opt) : base).map(function (r) { return r.slice(); });
      var vs = ((opt && opt.vars) || []).filter(function (v) { return v !== 'x' && v !== 'y'; }).map(function (v) { return { label: '<i>' + v + '</i>', tex: v, plain: v }; });
      if (vs.length) rows[rows.length - 1] = vs.concat(rows[rows.length - 1]);
      return rows;
    };
    W.KEYHELP = W.KEYHELP || {};
    W.KEYHELP.p55v = ['Use the letter key for the variable, <b>±</b> and <b>√</b> for square roots, and <b>( )</b> for brackets.', 'Type e.g. <code>k - 12</code> or <code>m = ±sqrt(5)</code>.'];
  }

  var CODES = {
    'u5l6-nohalf': 'Didn’t halve the x-coefficient', 'u5l6-nosq': 'Didn’t square half the x-coefficient', 'u5l6-add-sign': 'Added a negative number (the square is positive)',
    'u5l6-sq-sign': 'Sign inside the square doesn’t match the x-term', 'u5l6-times-a': 'Didn’t multiply the subtracted number by a', 'u5l6-add': 'Added the number instead of subtracting it',
    'u5l6-factor-b': 'Factored a from the x²-term only', 'u5l6-neg-factor': 'Sign slip factoring out a negative a', 'u5l6-as-square': 'Wrote the trinomial instead of the square',
    'u5l6-step': 'Error analysis: named the wrong step', 'u5l6-swap': 'Gave the time/width instead of the maximum (or the reverse)', 'u5l6-k': 'Unknown constant: wrong value', 'u5l6-proof': 'General case: wrong completed square',
    'u5l6-range': 'Range from the wrong value', 'u5l6-mc': 'Multiple choice: classic slip'
  };
  HW.addCodes(CODES);
  HW.addPartial({ 'u5l6-nohalf': 'b', 'u5l6-nosq': 'b', 'u5l6-add-sign': 's', 'u5l6-sq-sign': 's', 'u5l6-times-a': 'b', 'u5l6-add': 's', 'u5l6-factor-b': 'b', 'u5l6-neg-factor': 's', 'u5l6-step': 'b', 'u5l6-swap': 's', 'u5l6-k': 'b', 'u5l6-range': 'b' });

  /* the lesson's examples and the booklet's own functions [a, b, c] */
  var AVL = [[1, -6, 14], [1, 2, -8], [1, 5, 3], [1, -10, 31], [1, 3, 5], [2, 12, 7], [4, -24, 31], [3, 9, -2], [-1, 8, -3], [-3, -12, 5], [0.5, -3, 1], [-1 / 3, 2, 4], [2, -8, -3], [-5, 20, 1], [-2, 12, -5], [1, 8, 5],
    [1, 6, 1], [1, -12, 40], [1, 2, -15], [1, -7, 10], [1, 1, 1], [1, 11, -2], [1, -16, 50], [2, 8, 3], [3, -30, 70], [5, 10, 0], [2, -6, 1], [4, 4, -3], [-1, -6, 2], [-2, 16, -25], [-3, 12, 7], [0.5, 4, 5], [-0.25, 3, -4],
    [-5, 10, 0], [2, 20, 53], [-3, 18, -20], [1, -6, -11], [2, 4, -7], [1, 6, 13], [-5, 30, 2], [-2, 36, 0], [3, 12, -1], [3, -12, 12], [1, 8, 19], [-3, 9, 0], [-2, 7, 1], [3, 12, 17],
    [1, -8, 9], [1, 9, 20], [1, -2, 7], [3, 6, 8], [-2, -12, -11], [1 / 3, -2, 1], [-1, 5, 0], [5, -20, 26], [1, 4, -1], [-5, 10, 10], [-1, 4, 3], [2, 10, 9], [-1, 6, 11], [1, 4, -21], [-1, 15, 0], [-2, 12, -13]];
  function AV(a, b, c) { return !AVL.some(function (L) { return same(L[0], a) && same(L[1], b) && same(L[2], c); }); }

  /* y = Ax² + Bx + C */
  function CS(A, B, C) { var m = B / A, h = -m / 2, s = h * h; return { A: A, B: B, C: C, m: m, h: h, s: s, k: C - A * s, f: function (x) { return A * x * x + B * x + C; }, tex: polyTex([A, B, C]) }; }
  /* the completing-the-square steps, in the booklet's layout */
  function csLines(Q, o) {
    o = o || {}; var v = o.v || 'x', L = (o.lhs || 'y') + '=', out = [], f = !o.dec, Zk = z();
    var pT = function (c) { return Zk.polyTex(c, v, f); }, sTT = function (x) { return Zk.sT(x, f); }, aT = function (a) { return Zk.aTex(a, f); };
    if (o.from) out.push(L + o.from);
    if (o.from) out.push(L + pT([Q.A, Q.B, Q.C]));
    if (same(Q.A, 1)) {
      out.push(L + '(' + pT([1, Q.B, Q.s]) + ')' + sTT(-Q.s) + sTT(Q.C));
    } else {
      out.push(L + aT(Q.A) + '(' + pT([1, Q.m, 0]) + ')' + sTT(Q.C));
      out.push(L + aT(Q.A) + '(' + pT([1, Q.m, 0]) + sTT(Q.s) + sTT(-Q.s) + ')' + sTT(Q.C));
      out.push(L + aT(Q.A) + '(' + Zk.binTex(v, Q.h, f) + ')^{2}' + sTT(-Q.A * Q.s) + sTT(Q.C));
    }
    out.push(L + Zk.vfTex(Q.A, Q.h, Q.k, v, f));
    return out.map(function (x) { return t(x); }).join('<br>');
  }
  /* the classic slips, as [fn, code, hint, tex] */
  function csWrong(Q, v) {
    var A = Q.A, h = Q.h, k = Q.k, out = [], half = Q.m / 2, add = function (a, p, q, code, hint) { if ([a, p, q].every(isFinite) && !(same(p, h) && same(q, k))) out.push([par(a, p, q), code, hint, vfTex(a, p, q, v)]); };
    if (!same(A, 1)) add(A, h, Q.C - Q.s, LID + '-times-a', 'When ' + t('-' + rT(Q.s)) + ' leaves the brackets, multiply it by ' + t('a=' + rT(A)) + ': ' + t(rT(A) + '\\times(' + rT(-Q.s) + ')=' + rT(-A * Q.s)) + '.');
    add(A, h, Q.C + A * Q.s, LID + '-add', 'You add ' + t(rT(Q.s)) + ' to make the perfect square, so you must also <b>subtract</b> it (adding 0 in total).');
    add(A, -Q.m, Q.C - A * Q.m * Q.m, LID + '-nohalf', 'Use the square of <b>half</b> the ' + t(v) + '-coefficient: ' + t('\\left(\\frac{' + rT(Q.m) + '}{2}\\right)^{2}=' + rT(Q.s)) + '.');
    if (!same(A, 1)) add(A, -Q.B / 2, Q.C - A * Q.B * Q.B / 4, LID + '-factor-b', 'Factor ' + t(rT(A)) + ' out of <b>both</b> the ' + t(v + '^{2}') + '- and the ' + t(v) + '-term: ' + t(aTex(A) + '(' + polyTex([1, Q.m, 0], v) + ')') + '.');
    if (!same(half, 0) && !same(Math.abs(half), Q.s)) add(A, h, Q.C + A * h, LID + '-nosq', '<b>Square</b> half the ' + t(v) + '-coefficient: ' + t('\\left(' + rT(half) + '\\right)^{2}=' + rT(Q.s)) + '.');
    if (A < 0) add(A, -h, k, LID + '-neg-factor', 'Factoring ' + t(rT(A)) + ' out of ' + t(polyTex([Q.B, 0], v)) + ' gives ' + t(polyTex([Q.m, 0], v)) + ' inside the brackets: check the sign.');
    else add(A, -h, k, LID + '-sq-sign', 'The sign inside the square matches the sign of the ' + t(v) + '-term in the brackets: ' + t(polyTex([1, Q.m, Q.s], v) + '=(' + binTex(v, Q.h) + ')^{2}') + '.');
    return out;
  }
  var HCS = ['Make ' + t('x^{2}+bx') + ' a perfect square by adding ' + t('\\left(\\frac{b}{2}\\right)^{2}') + ' — and subtract it straight away so the function doesn’t change.', 'If ' + t('a\\ne 1') + ', first factor ' + t('a') + ' out of the ' + t('x^{2}') + '- and ' + t('x') + '-terms only; the number you subtract leaves the brackets multiplied by ' + t('a') + '.'];
  /* a vertex-form answer for Ax² + Bx + C */
  function csPart(prompt, Q, o) {
    o = o || {}; var v = o.v || 'x';
    return p5().exPart(prompt, par(Q.A, Q.h, Q.k), vfTex(Q.A, Q.h, Q.k, v), { v: v, lhs: o.lhs, vertex: { a: Q.A, p: Q.h, q: Q.k }, cands: csWrong(Q, v), sol: csLines(Q, o) + (o.after || ''), hints: o.hints || HCS, text: o.text });
  }
  function csExpr(Q, o) { o = o || {}; return { label: o.label || 'Vertex form', before: t((o.lhs || 'y') + '='), expr: { fn: par(Q.A, Q.h, Q.k), key: vfTex(Q.A, Q.h, Q.k), vertex: { a: Q.A, p: Q.h, q: Q.k }, cands: csWrong(Q, 'x') } }; }
  /* vertex, axis, max/min, value, range boxes */
  function featSpecs(Q, o) {
    o = o || {}; var up = Q.A > 0, s = [];
    if (o.vertex !== false) s.push({ label: 'Vertex', pt: [Q.h, Q.k], cands: [[[-Q.h, Q.k], LID + '-sq-sign', 'Read the vertex from ' + t('a(x-p)^{2}+q') + ': ' + t('(' + binTex('x', Q.h) + ')') + ' means ' + t('p=' + rT(Q.h)) + '.'], [[Q.h, Q.C - Q.s], LID + '-times-a', 'Multiply the subtracted number by ' + t('a') + ' before you combine the constants.']] });
    if (o.axis) s.push({ label: 'Axis of symmetry', axis: Q.h, q: Q.k });
    if (o.mm) s.push({ label: 'Max or min?', mm: up ? 'min' : 'max' });
    if (o.value !== false) s.push({ label: o.valueLabel || (o.mm ? 'Max or min value' : up ? 'Minimum value' : 'Maximum value'), name: 'Value', ans: Q.k, cands: [[Q.h, 'u5l3-mm-p', 'That is the ' + t('x') + '-coordinate of the vertex. The ' + (up ? 'minimum' : 'maximum') + ' value is ' + t('q') + '.'], [Q.C, 'u5l4-vertex-c', t('c') + ' is the ' + t('y') + '-intercept. Complete the square to find the vertex.'], [Q.C - Q.s, LID + '-times-a', 'Multiply the subtracted number by ' + t('a') + '.'], [Q.C + Q.A * Q.s, LID + '-add', 'Subtract the number you added.']] });
    if (o.range) s.push({ label: 'Range', range: [Q.k, up], opt: { p: Q.h, c: Q.C } });
    return s;
  }
  function featSol(Q) { var up = Q.A > 0; return 'Vertex ' + t(ptR(Q.h, Q.k)) + '; axis ' + t('x=' + rT(Q.h)) + '; ' + t('a' + (up ? '>' : '<') + '0') + ', so ' + (up ? 'minimum' : 'maximum') + ' value ' + t(rT(Q.k)) + '; range ' + t(z().rangeTex(Q.k, up)) + '.'; }
  /* a generator: A fixed or from a list, m = B/A from a list, C in a range */
  function gen(r, As, ms, cr, okf) {
    return pickWhere(function () { var A = r.pick(As), m = r.pick(ms), C = r.int(cr[0], cr[1]); return CS(A, cl(A * m), C); }, function (Q) { return isInt(Q.B) && AV(Q.A, Q.B, Q.C) && Math.abs(Q.k) <= 80 && (!okf || okf(Q)); });
  }
  function evens(lo, hi) { var o = []; for (var i = lo; i <= hi; i++) if (i && i % 2 === 0) o.push(i); return o; }
  function odds(lo, hi) { var o = []; for (var i = lo; i <= hi; i++) if (i % 2) o.push(i); return o; }
  function wrapSq(chk) { return function (resp) { var r = chk(resp); if (r && r.v === 'form' && /not-vertex/.test(r.code || '')) return form(LID + '-as-square', 'Right — now write it as a square, ' + t('(x+k)^{2}') + '.'); return r; }; }

  /* Question 1 / Extra A1: the number that completes the square */
  function sqPart(b, text) {
    var half = b / 2, s = half * half, fn = par(1, -half, 0), dec = !isInt(b) && Math.abs(b * 10 - Math.round(b * 10)) < 1e-9, key = dec ? '(x' + (half < 0 ? '-' : '+') + vT(Math.abs(half)) + ')^{2}' : vfTex(1, -half, 0);
    var cands = [[par(1, half, 0), LID + '-sq-sign', 'The sign inside the square matches the sign of the ' + t('x') + '-term: ' + t(polyTex([1, b, s]) + '=(' + binTex('x', -half) + ')^{2}') + '.', vfTex(1, half, 0)], [par(1, -b, 0), LID + '-nohalf', 'Inside the square goes <b>half</b> the ' + t('x') + '-coefficient, ' + t(rT(half)) + '.', vfTex(1, -b, 0)]];
    var chk = wrapSq(z().exprChk(fn, { vertex: { a: 1, p: -half, q: 0 }, cands: cands.map(function (c) { return c.slice(0, 3); }) }));
    var nc = [[b * b, LID + '-nohalf', 'Halve the coefficient first: ' + t('\\frac{' + rT(b) + '}{2}=' + rT(half)) + ', then square it.'], [half, LID + '-nosq', 'Now <b>square</b> it: ' + t('\\left(' + rT(half) + '\\right)^{2}') + '.'], [-s, LID + '-add-sign', 'A square is never negative: ' + t('\\left(' + rT(half) + '\\right)^{2}=' + rT(s)) + '.'], [b * b / 2, LID + '-nohalf', 'Halve first, then square: ' + t('\\left(\\frac{b}{2}\\right)^{2}') + '.']];
    var exprTex = polyTex([1, b, 0]);
    return z().fields('For ' + t(dec ? 'x^{2}' + (b < 0 ? '-' : '+') + vT(Math.abs(b)) + 'x' : exprTex) + ':', [{ label: 'Add', check: z().numChk(s, { cands: nc }), key: dec ? String(cl(s)) : rT(s), ansTex: dec ? vT(cl(s)) : rT(s), math: true }, { label: 'Perfect square', check: chk, key: key, ansTex: key, math: true }],
      { sol: t('\\left(\\frac{' + (dec ? vT(b) : rT(b)) + '}{2}\\right)^{2}=\\left(' + (dec ? vT(half) : rT(half)) + '\\right)^{2}=' + (dec ? vT(cl(s)) : rT(s))) + ': ' + t((dec ? 'x^{2}' + (b < 0 ? '-' : '+') + vT(Math.abs(b)) + 'x' + '+' + vT(cl(s)) : polyTex([1, b, s])) + '=' + key) + '.', hints: ['To make ' + t('x^{2}+bx') + ' a perfect square, add ' + t('\\left(\\frac{b}{2}\\right)^{2}') + '; then ' + t('x^{2}+bx+\\left(\\frac{b}{2}\\right)^{2}=\\left(x+\\frac{b}{2}\\right)^{2}') + '.'], text: text, bad: cands.map(function (c) { return [dec ? String(cl(s)) : rT(s), c[3]]; }).concat(nc.filter(function (c) { return !same(c[0], s); }).map(function (c) { return [rT(c[0]), key]; })) });
  }
  function fracB(r, ns) { return pickWhere(function () { var n = r.pick(ns), k = r.int(1, n - 1); return { n: n, k: k, b: sgn(r) * 2 * k / n }; }, function (o) { return z().gcd(2 * o.k, o.n) === 1 && !same(Math.abs(o.b), 2 / 3) && !same(Math.abs(o.b), 0.8); }).b; }

  /* Question 7 / Extra B2: zeros by completing the square */
  function zerosPart(Q, pre) {
    var D = -Q.k / Q.A, R = z().vfRoots(Q.A, Q.h, Q.k), rp = z().radParts(D);
    return z().fields((pre || '') + 'Complete the square to determine the zeros of ' + t('f(x)=' + Q.tex) + ' as exact values and to the nearest hundredth.', [
      { label: 'Exact', roots: { vals: R, irr: true, pm: [Q.h, D], cands: z().vfCands(Q.A, Q.h, Q.k).concat([[z().vfRoots(Q.A, Q.h, Q.C - Q.s), LID + '-times-a', 'Multiply the subtracted number by ' + t('a') + ' when you complete the square.']]).filter(function (c) { return c[0].length; }) } },
      { label: t('x\\approx'), name: 'Smaller zero', dp: 2, ans: R[0] }, { label: 'and ' + t('x\\approx'), name: 'Larger zero', dp: 2, ans: R[1] }],
      { swap: [[1, 2]], sol: csLines(Q, { lhs: 'f(x)' }) + '<br>' + t(vfTex(Q.A, Q.h, Q.k) + '=0\\Rightarrow (' + binTex('x', Q.h) + ')^{2}=' + rT(D)) + '<br>' + t('x=' + rT(Q.h) + '\\pm\\sqrt{' + rT(D) + '}' + (rp.k !== 1 || rp.w !== 1 ? '=' + rT(Q.h) + '\\pm ' + z().radTex(rp) : '')) + ', so ' + t('x\\approx ' + R[1].toFixed(2)) + ' and ' + t('x\\approx ' + R[0].toFixed(2)) + '.',
        hints: HCS.slice(0, 1).concat(['Then set ' + t('f(x)=0') + ', isolate the square and take the square root of both sides (' + t('\\pm') + ').']), text: 'zeros by completing the square' });
  }
  /* a context max: h = A t² + B t + C */
  function ctxFields(Q, o) {
    return z().fields(o.prompt, [{ label: o.yLabel, ans: Q.k, after: o.yUnit, cands: [[Q.h, LID + '-swap', 'That is ' + o.xWhat + '. The ' + o.yWhat + ' is ' + t('q') + ', the vertex’s second coordinate.'], [Q.C - Q.s, LID + '-times-a', 'Multiply the subtracted number by ' + t('a=' + rT(Q.A)) + '.'], [Q.C + Q.A * Q.s, LID + '-add', 'Subtract the number you added.'], [Q.C, 'u5l4-vertex-c', 'That is the starting value. Complete the square.']] },
      { label: o.xLabel, before: o.xBefore, ans: Q.h, after: o.xUnit, cands: [[Q.k, LID + '-swap', 'That is the ' + o.yWhat + '.'], [-Q.h, LID + '-sq-sign', 'Check the sign inside the bracket.'], [2 * Q.h, LID + '-nohalf', 'Halve the coefficient.']] }],
      { sol: csLines(Q, { v: o.v, lhs: o.lhs, dec: o.dec }) + '<br>' + o.ans, hints: HCS.concat(o.hints || []), text: o.text });
  }

  var QUESTIONS = [
    { num: '1', stem: 'Determine the number that must be added to make each expression a perfect square, then write the result as a square.', parts: [
      { id: '1a', level: 'BEG', make: function (r) { return sqPart(r.pick(evens(4, 30).filter(function (b) { return b !== 14 && b !== 12; })), 'complete the square: b even, positive'); } },
      { id: '1b', level: 'BEG', make: function (r) { return sqPart(r.pick(evens(-30, -4).filter(function (b) { return b !== -22 && b !== -18; })), 'complete the square: b even, negative'); } },
      { id: '1c', level: 'EMG', make: function (r) { return sqPart(sgn(r) * r.pick([11, 13, 15, 17, 19, 21, 23, 25]), 'complete the square: b odd'); } },
      { id: '1d', level: 'EMG', make: function (r) { return sqPart(r.pick([1, -1, 3, -3, 5, -5]), 'complete the square: small odd b'); } },
      { id: '1e', level: 'EMG', make: function (r) { return sqPart(sgn(r) * r.pick([0.2, 0.4, 0.6, 1.2, 1.4, 1.6, 1.8]), 'complete the square: decimal b'); } },
      { id: '1f', level: 'PRG', make: function (r) { return sqPart(fracB(r, [3, 5, 7, 9]), 'complete the square: fraction b'); } }] },

    { num: '2', stem: 'Write each function in vertex form by completing the square.', parts: [
      { id: '2a', level: 'BEG', make: function (r) { var Q = gen(r, [1], evens(2, 14), [-12, 20]); return csPart(eqy(Q.tex), Q, { text: 'a = 1, b even' }); } },
      { id: '2b', level: 'BEG', make: function (r) { var Q = gen(r, [1], evens(-16, -2), [10, 60]); return csPart(eqy(Q.tex), Q, { text: 'a = 1, b negative' }); } },
      { id: '2c', level: 'BEG', make: function (r) { var Q = gen(r, [1], evens(-10, 10), [-20, -1]); return csPart(eqy(Q.tex), Q, { text: 'a = 1, c negative' }); } },
      { id: '2d', level: 'EMG', make: function (r) { var Q = gen(r, [1], odds(-11, 11).filter(function (b) { return Math.abs(b) > 1; }), [-12, 15]); return csPart(eqy(Q.tex), Q, { text: 'a = 1, b odd' }); } },
      { id: '2e', level: 'EMG', make: function (r) { var Q = gen(r, [1], [1, -1], [-9, 9], function (Q) { return Q.C !== 0; }); return csPart(eqy(Q.tex), Q, { text: 'a = 1, b = ±1' }); } },
      { id: '2f', level: 'PRG', make: function (r) { var Q = gen(r, [1], odds(-15, 15).filter(function (b) { return Math.abs(b) >= 7; }), [-12, 12], function (Q) { return Q.C !== 0; }); return csPart(eqy(Q.tex), Q, { text: 'a = 1, b odd and large' }); } }] },

    { num: '3', parts: [
      { id: '3', level: 'EMG', make: function (r) {
        var Q = gen(r, [1], evens(-20, 20).filter(function (b) { return Math.abs(b) >= 8; }), [-10, 70]);
        return z().fields('Write ' + t('f(x)=' + Q.tex) + ' in vertex form. Hence state the vertex, the axis of symmetry, the minimum value and the range.', [csExpr(Q, { lhs: 'f(x)' })].concat(featSpecs(Q, { axis: true, range: true })), { sol: csLines(Q, { lhs: 'f(x)' }) + '<br>' + featSol(Q), hints: HCS.slice(0, 1).concat(['In ' + t('a(x-p)^{2}+q') + ': vertex ' + t('(p,\\ q)') + ', axis ' + t('x=p') + ', and ' + t('a>0') + ' gives a minimum value ' + t('q') + '.']), text: 'vertex form, then features' });
      } }] },

    { num: '4', stem: 'Write each function in vertex form.', parts: [
      { id: '4a', level: 'EMG', make: function (r) { var Q = gen(r, [2], evens(-8, 8), [-9, 15]); return csPart(eqy(Q.tex), Q, { text: 'a = 2' }); } },
      { id: '4b', level: 'EMG', make: function (r) { var Q = gen(r, [3], evens(-12, 12).filter(function (m) { return Math.abs(m) >= 4; }), [-20, 80]); return csPart(eqy(Q.tex), Q, { text: 'a = 3' }); } },
      { id: '4c', level: 'EMG', make: function (r) { var Q = gen(r, [4, 5, 6], evens(-6, 6), [0, 0]); return csPart(eqy(Q.tex), Q, { text: 'no constant term' }); } },
      { id: '4d', level: 'PRG', make: function (r) { var Q = gen(r, [2], odds(-7, 7), [-9, 9], function (Q) { return Q.C !== 0; }); return csPart(eqy(Q.tex), Q, { text: 'a = 2, b/a odd' }); } },
      { id: '4e', level: 'PRG', make: function (r) { var Q = gen(r, [4], [1, -1, 3, -3], [-9, 9], function (Q) { return Q.C !== 0; }); return csPart(eqy(Q.tex), Q, { text: 'a = 4, b/a odd' }); } }] },

    { num: '5', stem: 'Write each function in vertex form.', parts: [
      { id: '5a', level: 'EMG', make: function (r) { var Q = gen(r, [-1], evens(-12, 12), [-9, 9]); return csPart(eqy(Q.tex), Q, { text: 'a = −1' }); } },
      { id: '5b', level: 'PRG', make: function (r) { var Q = gen(r, [-2, -3], evens(-10, 10).filter(function (m) { return Math.abs(m) >= 4; }), [-30, 10]); return csPart(eqy(Q.tex), Q, { text: 'a = −2 or −3' }); } },
      { id: '5c', level: 'PRG', make: function (r) { var Q = gen(r, [-3, -2, -4], evens(-8, 8), [1, 12]), from = Q.C + (Q.B < 0 ? '-' : '+') + Math.abs(Q.B) + 'x' + (Q.A === -1 ? '-' : '-' + Math.abs(Q.A)) + 'x^{2}'; return csPart(eqy(from), Q, { from: from, text: 'terms out of order' }); } },
      { id: '5d', level: 'PRG', make: function (r) { var Q = gen(r, [0.5], evens(-10, 10), [-9, 9]); return csPart(eqy(Q.tex), Q, { text: 'a = ½' }); } },
      { id: '5e', level: 'ADV', make: function (r) { var Q = gen(r, [-0.25, 1 / 3, -1 / 3, 0.25], [-12, -8, -6, -4, 4, 6, 8, 12], [-9, 9], function (Q) { return isInt(Q.k) || isInt(Q.k * 4); }); return csPart(eqy(Q.tex), Q, { text: 'a a fraction' }); } },
      { id: '5f', level: 'PRG', make: function (r) { var Q = gen(r, [-5, -4, -6], evens(-6, 6), [0, 0]), from = Q.B + 'x' + (Q.A < 0 ? '-' : '+') + Math.abs(Q.A) + 'x^{2}'; return csPart(eqy(from), Q, { from: from, text: 'bx + ax² (no constant)' }); } }] },

    { num: '6', stem: 'Complete the square. State the vertex, and whether the function has a maximum or a minimum value, and what it is.', parts: [
      { id: '6a', level: 'PRG', make: function (r) { var Q = gen(r, [2, 3], evens(-12, 12).filter(function (m) { return Math.abs(m) >= 4; }), [-10, 60]); return z().fields(t('f(x)=' + Q.tex), [csExpr(Q, { lhs: 'f(x)' })].concat(featSpecs(Q, { mm: true })), { sol: csLines(Q, { lhs: 'f(x)' }) + '<br>' + featSol(Q), hints: HCS, text: 'complete the square: min' }); } },
      { id: '6b', level: 'PRG', make: function (r) { var Q = gen(r, [-2, -3], evens(-10, 10).filter(function (m) { return Math.abs(m) >= 4; }), [-30, 5]); return z().fields(t('g(x)=' + Q.tex), [csExpr(Q, { lhs: 'g(x)' })].concat(featSpecs(Q, { mm: true })), { sol: csLines(Q, { lhs: 'g(x)' }) + '<br>' + featSol(Q), hints: HCS, text: 'complete the square: max' }); } }] },

    { num: '7', stem: 'Complete the square to determine the zeros of each function as exact values and to the nearest hundredth.', parts: [
      { id: '7a', level: 'PRG', make: function (r) { var Q = gen(r, [1], evens(-10, 10), [-15, 3], function (Q) { return Q.k < 0 && z().radParts(-Q.k).f !== 1; }); return zerosPart(Q); } },
      { id: '7b', level: 'ADV', make: function (r) { var Q = gen(r, [2, 3], [-6, -4, -2, 2, 4, 6], [-15, 5], function (Q) { var rp = z().radParts(-Q.k / Q.A); return Q.k < 0 && rp.f !== 1 && !isInt(-Q.k / Q.A); }); return zerosPart(Q); } }] },

    { num: '8', parts: [
      { id: '8', level: 'PRG', make: function (r) {
        var Q = gen(r, [1], evens(-12, 12), [1, 40], function (Q) { return Q.k > 0; });
        return z().fields('Complete the square to show that the graph of ' + eqy(Q.tex) + ' has no ' + t('x') + '-intercepts.', [csExpr(Q), { label: 'Minimum value', name: 'Minimum value', ans: Q.k, cands: [[Q.h, 'u5l3-mm-p', 'That is the ' + t('x') + '-coordinate of the vertex.'], [Q.C + Q.s, LID + '-add', 'Subtract the number you added.']] }, { label: t('x') + '-intercepts', name: 'x-intercepts', roots: { vals: [], noneText: 'none' } }],
          { sol: csLines(Q) + '<br>Since ' + t('(' + binTex('x', Q.h) + ')^{2}\\ge 0') + ', ' + t('y\\ge ' + Q.k) + ' for every ' + t('x') + ': the minimum value is ' + t(Q.k) + ', so the graph never reaches the ' + t('x') + '-axis. (Solving: ' + t('(' + binTex('x', Q.h) + ')^{2}=' + (-Q.k)) + ' has no real solution.)', hints: HCS.slice(0, 1).concat(['A square is never negative: what is the smallest value ' + t('y') + ' can have?']), text: 'show there are no x-intercepts' });
      } }] },

    { num: '9', parts: [
      { id: '9', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { T: r.int(1, 6), C: r.int(1, 10), what: r.pick(['A model rocket', 'A flare', 'A water rocket']) }; }, function (o) { return !(o.T === 3 && o.C === 2) && !(o.T === 2 && o.C === 1); }), Q = CS(-5, 10 * o.T, o.C);
        return ctxFields(Q, { prompt: o.what + '’s height, in metres, ' + t('t') + ' seconds after launch is ' + t('h=' + polyTex([-5, Q.B, Q.C], 't')) + '. Complete the square to find its maximum height and when it occurs.', yLabel: 'Maximum height', yUnit: 'm', yWhat: 'maximum height', xLabel: 'At', xBefore: t('t='), xUnit: 's', xWhat: 'the time', v: 't', lhs: 'h', ans: 'Maximum height ' + t(Q.k) + ' m, at ' + t('t=' + Q.h) + ' s.', text: 'rocket: maximum by completing the square' });
      } }] },

    { num: '10', parts: [
      { id: '10', level: 'PRG', make: function (r) {
        var w0 = pickWhere(function () { return r.int(4, 20); }, function (x) { return x !== 9; }), Q = CS(-2, 4 * w0, 0);
        return ctxFields(Q, { prompt: 'A rectangular pen is fenced on three sides, with a barn wall as the fourth side. If each side perpendicular to the wall is ' + t('w') + ' metres, the area is ' + t('A=' + polyTex([-2, Q.B, 0], 'w')) + '. Complete the square to find the greatest possible area and the value of ' + t('w') + ' that gives it.', yLabel: 'Greatest area', yUnit: t('\\text{m}^{2}'), yWhat: 'greatest area', xLabel: 'When', xBefore: t('w='), xUnit: 'm', xWhat: 'the width', v: 'w', lhs: 'A', ans: 'The greatest area is ' + t(Q.k + '\\text{ m}^{2}') + ', when ' + t('w=' + Q.h) + ' m.', text: 'pen: greatest area' });
      } }] },

    { num: '11', shared: function (r) { return pickWhere(function () { var A = r.pick([2, 3, 4, 5]), m = r.pick([-8, -6, -4, -2, 2, 4, 6, 8]); return { A: A, m: m, C: nz(r, -9, 9), name: r.pick(['Avery', 'Jordan', 'Sam', 'Kai']) }; }, function (o) { return AV(o.A, o.A * o.m, o.C) && !(o.A === 3 && o.m === 4 && o.C === -1); }); },
      stem: function (o) {
        var Q = CS(o.A, o.A * o.m, o.C), L = ['y=' + aTex(Q.A) + '(' + polyTex([1, Q.m, 0]) + ')' + sT(Q.C), 'y=' + aTex(Q.A) + '(' + polyTex([1, Q.m, 0]) + sT(Q.s) + sT(-Q.s) + ')' + sT(Q.C), 'y=' + aTex(Q.A) + '(' + binTex('x', Q.h) + ')^{2}' + sT(-Q.s) + sT(Q.C), 'y=' + vfTex(Q.A, Q.h, Q.C - Q.s)];
        return o.name + ' wrote ' + eqy(Q.tex) + ' in vertex form:<br>' + L.map(function (l, i) { return 'Step ' + (i + 1) + ': ' + t(l); }).join('<br>');
      },
      parts: [
        { id: '11a', level: 'EMG', make: function (r, o) {
          var Q = CS(o.A, o.A * o.m, o.C);
          return z().mc(r, 'Which step has the error?', [
            { html: '<b>Step 1</b>: ' + t(Q.A) + ' must be factored out of the constant ' + t(Q.C) + ' too.', why: 'Factor ' + t('a') + ' out of the ' + t('x^{2}') + '- and ' + t('x') + '-terms only: Step 1 is right.', code: LID + '-step' },
            { html: '<b>Step 2</b>: the number to add and subtract is ' + t(rT(Q.m * Q.m)) + ', the square of ' + t(rT(Q.m)) + '.', why: 'It is the square of <b>half</b> the ' + t('x') + '-coefficient, ' + t(rT(Q.s)) + ': Step 2 is right.', code: LID + '-step' },
            { html: '<b>Step 3</b>: the ' + t(rT(-Q.s)) + ' leaving the brackets must be multiplied by ' + t(Q.A) + ', giving ' + t(rT(-Q.A * Q.s)) + '.', right: true },
            { html: '<b>Step 4</b>: the constants ' + t(rT(-Q.s)) + ' and ' + t(Q.C) + ' are combined wrongly.', why: t(rT(-Q.s) + sT(Q.C) + '=' + rT(Q.C - Q.s)) + ' is right — the error is in the number being combined.', code: LID + '-step' }],
            'Step 3: the ' + t(rT(-Q.s)) + ' is inside brackets multiplied by ' + t(Q.A) + ', so it leaves as ' + t(Q.A + '(' + rT(-Q.s) + ')=' + rT(-Q.A * Q.s)) + '.', ['Expand each step to check it still equals the original function.'], 'error analysis: which step', true);
        } },
        { id: '11b', level: 'PRG', make: function (r, o) { var Q = CS(o.A, o.A * o.m, o.C); return csPart('Write the correct vertex form.', Q, { text: 'error analysis: correct vertex form' }); } }] },

    { num: '12', shared: function (r) { return pickWhere(function () { return { A: r.pick([2, 3, 4, -2, -3]), h: nz(r, -4, 4) }; }, function (o) { return !(o.A === 3 && o.h === 2); }); },
      stem: function (o) { return 'Write ' + eqy(polyTex([o.A, -2 * o.A * o.h, 0]) + '+k') + ' in vertex form, in terms of ' + t('k') + '.'; },
      parts: [
        { id: '12a', level: 'PRG', make: function (r, o) {
          var A = o.A, h = o.h, s = h * h, qk = function (k) { return k - A * s; }, key = 'k' + sT(-A * s);
          var chk = z().exprChk(qk, { v: 'k', cands: [[function (k) { return k - s; }, LID + '-times-a', 'Multiply the subtracted ' + t(s) + ' by ' + t('a=' + A) + '.'], [function (k) { return k + A * s; }, LID + '-add', 'Subtract the number you added (times ' + t('a') + ').']] });
          var p = B.fields('The vertex is ' + t('(p,\\ q)') + '. State ' + t('p') + ', and ' + t('q') + ' in terms of ' + t('k') + '.', [{ label: t('p='), name: 'p', mode: 'math', keys: 'p55v', vars: ['k'] }, { label: t('q='), name: 'q', mode: 'math', keys: 'p55v', vars: ['k'], wide: true }],
            [z().numChk(h, { cands: [[-h, LID + '-sq-sign', 'Check the sign inside the bracket: ' + t('(' + binTex('x', h) + ')') + ' means ' + t('p=' + h) + '.']] }), chk], [String(h), key], t('p=' + h) + '<br>' + t('q=' + key),
            t('y=' + aTex(A) + '(' + polyTex([1, -2 * h, s]) + sT(-s) + ')+k') + '<br>' + t('y=' + vfTex(A, h, 0) + sT(-A * s) + '+k') + '<br>' + t('y=' + vfTex(A, h, 0) + '+(' + key + ')') + ': the vertex is ' + t('(' + h + ',\\ ' + key + ')') + '.', HCS.slice(1), 'vertex in terms of k');
          p.bad = ['k' + sT(-s), 'k' + sT(A * s)]; return p;
        } },
        { id: '12b', level: 'ADV', make: function (r, o) { var A = o.A, h = o.h, s = h * h; return z().num('For what value of ' + t('k') + ' is the vertex on the ' + t('x') + '-axis?', A * s, { before: t('k='), cands: [[s, LID + '-times-a', 'The vertex’s ' + t('y') + '-value is ' + t('k' + sT(-A * s)) + ' (the ' + t(s) + ' is multiplied by ' + t(A) + ').'], [-A * s, LID + '-k', 'Solve ' + t('k' + sT(-A * s) + '=0') + '.']], sol: 'The vertex ' + t('(' + h + ',\\ k' + sT(-A * s) + ')') + ' is on the ' + t('x') + '-axis when ' + t('k' + sT(-A * s) + '=0') + ', so ' + t('k=' + A * s) + '.', hints: ['A point on the ' + t('x') + '-axis has ' + t('y') + '-coordinate 0.'], text: 'k so the vertex is on the x-axis' }); } }] },

    { num: '13', parts: [
      { id: '13', level: 'MAS', make: function (r) {
        return z().mc(r, 'Completing the square for ' + eqy('ax^{2}+bx+c') + ' gives', [
          { html: t('y=a\\left(x+\\frac{b}{2a}\\right)^{2}+\\frac{4ac-b^{2}}{4a}') + ', so the axis of symmetry is ' + t('x=-\\frac{b}{2a}') + '.', right: true },
          { html: t('y=a\\left(x+\\frac{b}{2a}\\right)^{2}+c-\\frac{b^{2}}{4a^{2}}') + ', so the axis of symmetry is ' + t('x=-\\frac{b}{2a}') + '.', why: 'The ' + t('\\frac{b^{2}}{4a^{2}}') + ' leaves the brackets multiplied by ' + t('a') + ': ' + t('-\\frac{b^{2}}{4a}') + '.', code: LID + '-times-a' },
          { html: t('y=a\\left(x-\\frac{b}{2a}\\right)^{2}+\\frac{4ac-b^{2}}{4a}') + ', so the axis of symmetry is ' + t('x=\\frac{b}{2a}') + '.', why: 'The sign inside the square matches the sign of the ' + t('x') + '-term: ' + t('+\\frac{b}{a}x') + ' gives ' + t('\\left(x+\\frac{b}{2a}\\right)^{2}') + '.', code: LID + '-sq-sign' },
          { html: t('y=a\\left(x+\\frac{b}{a}\\right)^{2}+c-\\frac{b^{2}}{a}') + ', so the axis of symmetry is ' + t('x=-\\frac{b}{a}') + '.', why: 'Add and subtract the square of <b>half</b> of ' + t('\\frac{b}{a}') + ', which is ' + t('\\frac{b^{2}}{4a^{2}}') + '.', code: LID + '-nohalf' }],
          t('y=a\\left(x^{2}+\\frac{b}{a}x\\right)+c=a\\left(x^{2}+\\frac{b}{a}x+\\frac{b^{2}}{4a^{2}}-\\frac{b^{2}}{4a^{2}}\\right)+c') + '<br>' + t('y=a\\left(x+\\frac{b}{2a}\\right)^{2}-\\frac{b^{2}}{4a}+c=a\\left(x+\\frac{b}{2a}\\right)^{2}+\\frac{4ac-b^{2}}{4a}') + '<br>So ' + t('p=-\\frac{b}{2a}') + ': the axis is ' + t('x=-\\frac{b}{2a}') + '.', HCS.slice(1), 'general case: completed square');
      } }] },

    { num: '14', parts: [
      { id: '14', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { h: nz(r, -7, 7), k: nz(r, -12, 12) }; }, function (o) { return !(o.h === -4 && o.k === 3); }), b = -2 * o.h, c = o.h * o.h + o.k;
        return z().fields('The graph of ' + eqy('x^{2}+bx+c') + ' has vertex ' + t(ptTex(o.h, o.k)) + '. Determine ' + t('b') + ' and ' + t('c') + '.', [{ label: t('b='), name: 'b', ans: b, cands: [[-b, LID + '-sq-sign', t('(' + binTex('x', o.h) + ')^{2}') + ' expands to ' + t(polyTex([1, b, o.h * o.h])) + '.'], [o.h, LID + '-nohalf', 'Expand ' + t('(' + binTex('x', o.h) + ')^{2}') + ': the middle term is ' + t('2(' + (-o.h) + ')x') + '.']] }, { label: t('c='), name: 'c', ans: c, cands: [[o.k, 'u5l4-vertex-c', 'Expand the vertex form and collect the constants: ' + t(o.h * o.h + sT(o.k)) + '.'], [o.h * o.h - o.k, 'sign', 'Check the sign of ' + t('q') + '.'], [o.k - o.h * o.h, LID + '-add', 'The ' + t(o.h * o.h) + ' from the square is added.']] }],
          { sol: eqy(vfTex(1, o.h, o.k) + '=' + polyTex([1, b, o.h * o.h]) + sT(o.k) + '=' + polyTex([1, b, c])) + ', so ' + t('b=' + b) + ' and ' + t('c=' + c) + '.', hints: ['Write the vertex form ' + t('y=(x-p)^{2}+q') + ' and expand it.'], text: 'b and c from the vertex' });
      } }] },

    { num: '15', parts: [
      { id: '15', level: 'PRG', make: function (r) {
        var Q = gen(r, [2], odds(-7, 7), [-6, 8], function (Q) { return Q.C !== 0 && !(Q.B === -6 && Q.C === 1); }), S = function (v, up) { return t('\\{y\\mid y' + (up ? '\\ge ' : '\\le ') + vT(v) + ',\\ y\\in\\mathbb{R}\\}'); };
        return z().mc(r, 'The range of ' + eqy(Q.tex) + ' is', [{ html: S(Q.k, true), right: true }, { html: S(Q.C - Q.s, true), why: 'Multiply the subtracted ' + t(vT(Q.s)) + ' by ' + t('a=2') + '.', code: LID + '-times-a' }, { html: S(Q.C + 2 * Q.s, true), why: 'Subtract the number you added (times ' + t('a') + '): ' + t(Q.C + '-' + vT(2 * Q.s)) + '.', code: LID + '-add' }, { html: S(Q.k, false), why: t('a=2>0') + ': the parabola opens up, so the range goes up from the minimum.', code: 'u5l3-range-dir' }],
          t('y=2(' + polyTex([1, Q.m, 0]) + '+' + vT(Q.s) + '-' + vT(Q.s) + ')' + sT(Q.C, false) + '=2(x' + (Q.h < 0 ? '+' : '-') + vT(Math.abs(Q.h)) + ')^{2}' + sT(-2 * Q.s, false) + sT(Q.C, false) + '=2(x' + (Q.h < 0 ? '+' : '-') + vT(Math.abs(Q.h)) + ')^{2}' + sT(Q.k, false)) + '; ' + t('a>0') + ', so ' + t('y\\ge ' + vT(Q.k)) + '.', HCS, 'MC: range by completing the square');
      } }] },

    { num: '16', parts: [
      { id: '16', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { return { n: r.int(2, 5), m: r.pick([1, 3, 4, 5, 6, 7]) }; }, function (o) { return !(o.n === 3 && o.m === 3); }), M = o.n * o.m * o.m / 4;
        return z().mc(r, 'The maximum value of ' + t('f(x)=' + o.n + 'x(' + o.m + '-x)') + ' is', [{ html: t(rT(M)), right: true }, { html: t(rT(o.m / 2)), why: 'That is where the maximum occurs (the ' + t('x') + '-coordinate of the vertex).', code: 'u5l3-mm-p' }, { html: t(rT(o.m * o.m / 4)), why: 'The ' + t(rT(o.m * o.m / 4)) + ' leaves the brackets multiplied by ' + t('-' + o.n) + '.', code: LID + '-times-a' }, { html: t(rT(2 * M)), why: 'Check the square: ' + t('\\left(\\frac{' + o.m + '}{2}\\right)^{2}=' + rT(o.m * o.m / 4)) + '.', code: LID + '-nosq' }],
          t('f(x)=' + polyTex([-o.n, o.n * o.m, 0]) + '=-' + o.n + '\\left(x^{2}-' + o.m + 'x+' + rT(o.m * o.m / 4) + '-' + rT(o.m * o.m / 4) + '\\right)=-' + o.n + '\\left(' + binTex('x', o.m / 2) + '\\right)^{2}+' + rT(M)) + '.', ['Expand first, then complete the square (factor out the negative).'], 'MC: maximum of nx(m − x)');
      } }] },

    { num: '17', parts: [
      { id: '17', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { var a = r.pick([-2, -4]), b = r.pick(a === -2 ? [1, 3, 5, 7] : [3, 5, 7, 9, 11]); return { a: a, b: b, c: r.int(0, 4) }; }, function (o) { var M = o.c - o.b * o.b / (4 * o.a); return M < 9.995 && !(o.a === -2 && o.b === 7 && o.c === 1); }), Q = CS(o.a, o.b, o.c);
        return z().apx('<i>(Numerical Response)</i> A ball’s height, in metres, ' + t('t') + ' seconds after it is tossed is ' + t('h=' + polyTex([o.a, o.b, o.c], 't')) + '. Its maximum height, to the nearest hundredth of a metre, is ______.', Q.k, 2, { nr: true, cands: [[Q.h, LID + '-swap', 'That is the time of the maximum.'], [Q.C - Q.s, LID + '-times-a', 'Multiply the subtracted number by ' + t('a=' + o.a) + '.']], sol: csLines(Q, { v: 't', lhs: 'h' }) + '<br>Maximum height ' + t(rT(Q.k) + '\\approx ' + K.roundTo(Q.k, 2).toFixed(2)) + ' m.', hints: HCS, text: 'NR: maximum height (fractions)' });
      } }] },

    { num: '18', parts: [
      { id: '18', level: 'PRG', make: function (r) {
        var Q = gen(r, [2, 3, 4], evens(-8, 8), [-5, 30], function (Q) { return Q.A + Q.h + Q.k >= 0 && Q.A + Q.h + Q.k < 1000 && !(Q.A === 3 && Q.B === 12 && Q.C === 17); }), v = Q.A + Q.h + Q.k;
        return z().num('<i>(Numerical Response)</i> When ' + eqy(Q.tex) + ' is written in the form ' + t('y=a(x-p)^{2}+q') + ', the value of ' + t('a+p+q') + ' is ______.', v, { nr: true, cands: [[Q.A - Q.h + Q.k, 'u5l3-p-sign', t('(' + binTex('x', Q.h) + ')=(x-(' + rT(Q.h) + '))') + ', so ' + t('p=' + rT(Q.h)) + '.'], [Q.A + Q.h + Q.C - Q.s, LID + '-times-a', 'Multiply the subtracted number by ' + t('a') + '.']], sol: csLines(Q) + '<br>' + t('a=' + Q.A + ',\\ p=' + Q.h + ',\\ q=' + Q.k) + ': ' + t('a+p+q=' + v) + '.', hints: HCS.concat(['Careful: ' + t('(x+2)=(x-(-2))') + ', so ' + t('p=-2') + '.']), text: 'NR: a + p + q' });
      } }] }
  ];

  var EXTRA = [
    { num: 'A1', section: 'A. Skills', stem: 'Determine the number that must be added to make a perfect square, and write the result as a square.', parts: [
      { id: 'eA1a', level: 'BEG', make: function (r) { return sqPart(sgn(r) * r.pick([16, 18, 24, 26, 28, 32]), 'complete the square: b even'); } },
      { id: 'eA1b', level: 'EMG', make: function (r) { return sqPart(sgn(r) * r.pick([5, 9, 11, 15, 17, 23]), 'complete the square: b odd'); } },
      { id: 'eA1c', level: 'PRG', make: function (r) { return sqPart(fracB(r, [3, 5, 7]), 'complete the square: b a fraction'); } }] },
    { num: 'A2', stem: 'Write each function in vertex form.', parts: [
      { id: 'eA2a', level: 'BEG', make: function (r) { var Q = gen(r, [1], evens(-14, -2), [-9, 20]); return csPart(eqy(Q.tex), Q, { text: 'a = 1, b even' }); } },
      { id: 'eA2b', level: 'EMG', make: function (r) { var Q = gen(r, [1], odds(-13, 13).filter(function (b) { return Math.abs(b) > 1; }), [-5, 25]); return csPart(eqy(Q.tex), Q, { text: 'a = 1, b odd' }); } },
      { id: 'eA2c', level: 'BEG', make: function (r) { var Q = gen(r, [1], evens(-6, 6), [-9, 12], function (Q) { return Q.C !== 0; }); return csPart(eqy(Q.tex), Q, { text: 'a = 1, small b' }); } }] },
    { num: 'A3', stem: 'Write each function in vertex form.', parts: [
      { id: 'eA3a', level: 'EMG', make: function (r) { var Q = gen(r, [3, 4], evens(-6, 6), [-9, 15]); return csPart(eqy(Q.tex), Q, { text: 'a = 3 or 4' }); } },
      { id: 'eA3b', level: 'PRG', make: function (r) { var Q = gen(r, [-2], evens(-8, 8), [-15, 9]); return csPart(eqy(Q.tex), Q, { text: 'a = −2' }); } },
      { id: 'eA3c', level: 'PRG', make: function (r) { var Q = gen(r, [1 / 3, 0.5], [-8, -6, -4, 4, 6, 8], [-6, 6]); return csPart(eqy(Q.tex), Q, { text: 'a = ⅓ or ½' }); } },
      { id: 'eA3d', level: 'PRG', make: function (r) { var Q = gen(r, [-1], odds(-9, 9).filter(function (b) { return Math.abs(b) > 1; }), [0, 0]); return csPart(eqy(Q.tex), Q, { text: 'a = −1, b odd, no constant' }); } }] },

    { num: 'B1', section: 'B. Applying', parts: [
      { id: 'eB1', level: 'PRG', make: function (r) {
        var Q = gen(r, [4, 5, 6], evens(-6, 6), [-10, 40]);
        return z().fields('Write ' + t('f(x)=' + Q.tex) + ' in vertex form. State the vertex, the axis of symmetry, the minimum value and the range.', [csExpr(Q, { lhs: 'f(x)' })].concat(featSpecs(Q, { axis: true, range: true })), { sol: csLines(Q, { lhs: 'f(x)' }) + '<br>' + featSol(Q), hints: HCS, text: 'a ≠ 1: vertex form and features' });
      } }] },
    { num: 'B2', parts: [
      { id: 'eB2', level: 'PRG', make: function (r) { var Q = gen(r, [1], evens(-8, 8), [-9, 4], function (Q) { return Q.k < 0 && z().radParts(-Q.k).f !== 1; }); return zerosPart(Q); } }] },
    { num: 'B3', parts: [
      { id: 'eB3', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { T: r.pick([0.4, 0.5, 0.6, 0.8, 1]), C: r.pick([3, 5, 7.5, 10]), who: r.pick(['A diver', 'A platform diver', 'A cliff diver']) }; }, function (o) { return !(o.T === 1 && o.C === 10); }), Q = CS(-5, 10 * o.T, o.C);
        return ctxFields(Q, { prompt: o.who + ' jumps from a ' + vT(o.C) + ' m platform. Their height above the water, in metres, after ' + t('t') + ' seconds is ' + t('h=' + z().polyTex([-5, Q.B, Q.C], 't', false)) + '. Complete the square to find the greatest height and when it is reached.', yLabel: 'Greatest height', yUnit: 'm', yWhat: 'greatest height', xLabel: 'At', xBefore: t('t='), xUnit: 's', xWhat: 'the time', v: 't', lhs: 'h', dec: true, ans: 'Greatest height ' + t(vT(Q.k)) + ' m, at ' + t('t=' + vT(Q.h)) + ' s.', text: 'diver: greatest height' });
      } }] },
    { num: 'B4', shared: function (r) { return pickWhere(function () { return { b: r.pick([2, 4, 6, 8, 10]), c: nz(r, -9, 9), name: r.pick(['A student', 'Morgan', 'Riley']) }; }, function (o) { return !(o.b === 4 && o.c === 3); }); },
      stem: function (o) { var hb = o.b / 2, s = hb * hb; return o.name + ' wrote ' + t('y=' + polyTex([-1, o.b, o.c]) + '=-(' + polyTex([1, o.b, s]) + '-' + s + ')' + sT(o.c) + '=-(x+' + hb + ')^{2}' + sT(s + o.c)) + '.'; },
      parts: [
        { id: 'eB4a', level: 'EMG', make: function (r, o) {
          var hb = o.b / 2, s = hb * hb;
          return z().mc(r, 'What is the error?', [{ html: 'Factoring ' + t('-1') + ' out of ' + t('+' + o.b + 'x') + ' gives ' + t('-' + o.b + 'x') + ' inside the brackets, not ' + t('+' + o.b + 'x') + '.', right: true },
            { html: 'The ' + t('-' + s) + ' should leave the brackets as ' + t('-' + s) + ', not ' + t('+' + s) + '.', why: 'Leaving brackets multiplied by ' + t('-1') + ', ' + t('-' + s) + ' becomes ' + t('+' + s) + ': that step is right.', code: LID + '-step' },
            { html: 'The number to add and subtract is ' + t(o.b * o.b) + ', not ' + t(s) + '.', why: 'It is the square of <b>half</b> the coefficient: ' + t(s) + ' is right.', code: LID + '-step' },
            { html: 'The ' + t('-1') + ' should not be factored out; complete the square on ' + t('-x^{2}+' + o.b + 'x') + ' directly.', why: 'The method needs ' + t('x^{2}') + ' with coefficient 1, so factoring out ' + t('-1') + ' is right.', code: LID + '-step' }],
            'Factoring ' + t('-1') + ' out of ' + t('+' + o.b + 'x') + ' gives ' + t('-' + o.b + 'x') + ': ' + t('y=-(' + polyTex([1, -o.b, s]) + '-' + s + ')' + sT(o.c) + '=-(x-' + hb + ')^{2}' + sT(s + o.c)) + '.', ['Expand the brackets of the first step: do you get the original ' + t('x') + '-term back?'], 'error analysis: factoring out −1');
        } },
        { id: 'eB4b', level: 'PRG', make: function (r, o) { return csPart('Give the correct vertex form.', CS(-1, o.b, o.c), { text: 'error analysis: correct vertex form' }); } }] },
    { num: 'B5', parts: [
      { id: 'eB5', level: 'PRG', make: function (r) {
        var Q = gen(r, [2], odds(-9, 9).filter(function (m) { return Math.abs(m) >= 3; }), [-9, 15], function (Q) { return !(Q.B === 10 && Q.C === 9); }), P = function (x, y) { return t('(' + vT(x) + ',\\ ' + vT(y) + ')'); };
        return z().mc(r, 'The vertex of the graph of ' + eqy(Q.tex) + ' is', [{ html: P(Q.h, Q.k), right: true }, { html: P(-Q.h, Q.k), why: 'The bracket ' + t('(x' + (Q.h < 0 ? '+' : '-') + vT(Math.abs(Q.h)) + ')') + ' gives ' + t('p=' + vT(Q.h)) + '.', code: LID + '-sq-sign' }, { html: P(Q.h, Q.C - Q.s), why: 'Multiply the subtracted ' + t(vT(Q.s)) + ' by ' + t('a=2') + '.', code: LID + '-times-a' }, { html: P(-Q.m, Q.C - Q.m * Q.m), why: 'Halve the coefficient: ' + t('\\frac{' + Q.m + '}{2}=' + vT(Q.m / 2)) + '.', code: LID + '-nohalf' }],
          t('y=2(' + polyTex([1, Q.m, 0]) + '+' + vT(Q.s) + '-' + vT(Q.s) + ')' + sT(Q.C, false) + '=2(x' + (Q.h < 0 ? '+' : '-') + vT(Math.abs(Q.h)) + ')^{2}' + sT(-2 * Q.s, false) + sT(Q.C, false) + '=2(x' + (Q.h < 0 ? '+' : '-') + vT(Math.abs(Q.h)) + ')^{2}' + sT(Q.k, false)) + '.', HCS, 'MC: vertex by completing the square');
      } }] },
    { num: 'B6', parts: [
      { id: 'eB6', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { b: r.pick([2, 4, 6, 8, 10, 12]), M: r.int(5, 60) }; }, function (o) { var k = o.M - o.b * o.b / 4; return k > 0 && !(o.b === 6 && o.M === 20); }), s = o.b * o.b / 4, k = o.M - s;
        return z().num('<i>(Numerical Response)</i> The function ' + eqy('-x^{2}+' + o.b + 'x+k') + ' has a maximum value of ' + t(o.M) + '. The value of ' + t('k') + ' is ______.', k, { nr: true, cands: [[o.M + s, LID + '-add', 'The ' + t(s) + ' leaves the brackets as ' + t('+' + s) + ': ' + t(s + '+k=' + o.M) + '.'], [o.M - o.b / 2, LID + '-nosq', 'Square half the coefficient: ' + t('\\left(\\frac{' + o.b + '}{2}\\right)^{2}=' + s) + '.']], sol: t('y=-(x^{2}-' + o.b + 'x+' + s + '-' + s + ')+k=-(x-' + o.b / 2 + ')^{2}+' + s + '+k') + '. ' + t(s + '+k=' + o.M) + ', so ' + t('k=' + k) + '.', hints: HCS.slice(1).concat(['The maximum value is ' + t('q') + ' in vertex form.']), text: 'NR: k from the maximum' });
      } }] },

    { num: 'C1', section: 'C. Stretch', shared: function (r) { return { C: r.pick([2, 3, 6, 7, 10, 11, 13]) }; },
      stem: function (o) { return 'Consider ' + eqy('x^{2}+2mx+' + o.C) + '.'; },
      parts: [
        { id: 'eC1a', level: 'ADV', make: function (r, o) {
          var cx = z().exprChk(function (m) { return -m; }, { v: 'm', cands: [[function (m) { return m; }, LID + '-sq-sign', t('(x+m)^{2}=(x-(-m))^{2}') + ', so ' + t('p=-m') + '.']] }), cy = z().exprChk(function (m) { return o.C - m * m; }, { v: 'm', cands: [[function (m) { return o.C + m * m; }, LID + '-add', 'Subtract the ' + t('m^{2}') + ' you added.'], [function (m) { return o.C - 4 * m * m; }, LID + '-nohalf', 'Half of ' + t('2m') + ' is ' + t('m') + '; its square is ' + t('m^{2}') + '.']] });
          var p = B.fields('Complete the square. The vertex is ' + t('(p,\\ q)') + ': give ' + t('p') + ' and ' + t('q') + ' in terms of ' + t('m') + '.', [{ label: t('p='), name: 'p', mode: 'math', keys: 'p55v', vars: ['m'] }, { label: t('q='), name: 'q', mode: 'math', keys: 'p55v', vars: ['m'], wide: true }], [cx, cy], ['-m', o.C + '-m^{2}'], t('p=-m') + '<br>' + t('q=' + o.C + '-m^{2}'),
            t('y=(x^{2}+2mx+m^{2})-m^{2}+' + o.C + '=(x+m)^{2}+' + o.C + '-m^{2}') + ': vertex ' + t('(-m,\\ ' + o.C + '-m^{2})') + '.', ['Half of ' + t('2m') + ' is ' + t('m') + ': add and subtract ' + t('m^{2}') + '.'], 'vertex in terms of m');
          p.bad = ['m', o.C + '+m^{2}']; return p;
        } },
        { id: 'eC1b', level: 'MAS', make: function (r, o) {
          var s = Math.sqrt(o.C), S = { vals: [-s, s], irr: true, pm: [0, o.C], v: 'm', cands: [[[o.C, -o.C], LID + '-nosq', 'Solve ' + t(o.C + '-m^{2}=0') + ': ' + t('m^{2}=' + o.C) + '.']], what: 'values of ' + t('m') };
          var p = z().roots('For which values of ' + t('m') + ' is the vertex on the ' + t('x') + '-axis? (The vertex is ' + t('(-m,\\ ' + o.C + '-m^{2})') + '.)', S, { sol: 'The vertex is on the ' + t('x') + '-axis when ' + t(o.C + '-m^{2}=0') + ': ' + t('m^{2}=' + o.C) + ', so ' + t('m=\\pm\\sqrt{' + o.C + '}') + '.', hints: ['Set the vertex’s ' + t('y') + '-coordinate equal to 0 and solve (two values).'], text: 'm so the vertex is on the x-axis', bad: ['m=\\sqrt{' + o.C + '}', 'm=' + o.C, 'none'] });
          p.input.keys = 'p55v'; p.input.vars = ['m']; p.input.placeholder = 'e.g. m = ±√3'; return p;
        } }] },
    { num: 'C2', parts: [
      { id: 'eC2', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { r: r.int(1, 9), s: r.int(1, 9) }; }, function (o) { return o.r !== o.s && !(o.r === 3 && o.s === 7); }), Q = CS(1, o.s - o.r, -o.r * o.s);
        return csPart('Write ' + eqy('(x-' + o.r + ')(x+' + o.s + ')') + ' in vertex form by expanding and completing the square.', Q, { from: '(x-' + o.r + ')(x+' + o.s + ')', after: '<br>Check: the axis is midway between the zeros ' + t(o.r) + ' and ' + t(-o.s) + ': ' + t('x=' + rT(Q.h)) + ' ✓', text: 'expand, then complete the square' });
      } }] },
    { num: 'C3', parts: [
      { id: 'eC3', level: 'ADV', make: function (r) {
        var P = pickWhere(function () { return 2 * r.int(6, 30); }, function (x) { return x !== 30; }), hw = P / 2, Q = CS(-1, hw, 0), w = hw / 2, Am = w * w;
        return z().fields('A rectangle has a perimeter of ' + t(P) + ' m. Its area is ' + t('A=-w^{2}+' + hw + 'w') + ', where ' + t('w') + ' is the width (the length is ' + t(hw + '-w') + '). Complete the square to find the greatest possible area and the width that gives it.', [
          { label: 'Greatest area', ans: Am, after: t('\\text{m}^{2}'), cands: [[w, LID + '-swap', 'That is the width.'], [hw * hw, LID + '-nohalf', 'Halve the coefficient ' + t(hw) + ' before squaring.'], [P * P / 4, LID + '-nohalf', 'The length is ' + t(hw + '-w') + ' (half the perimeter minus the width).']] },
          { label: 'Width', before: t('w='), ans: w, after: 'm', cands: [[Am, LID + '-swap', 'That is the area.'], [hw, LID + '-nohalf', 'Halve the coefficient.']] }],
          { sol: 'Length ' + t('=' + hw + '-w') + ', so ' + t('A=w(' + hw + '-w)=-w^{2}+' + hw + 'w') + '.<br>' + csLines(Q, { v: 'w', lhs: 'A' }) + '<br>Greatest area ' + t(vT(Am) + '\\text{ m}^{2}') + ', for a ' + t(vT(w)) + ' m by ' + t(vT(w)) + ' m square.', hints: HCS.slice(1), text: 'greatest area for a perimeter' });
      } }] },
    { num: 'C4', parts: [
      { id: 'eC4', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { return { a: r.pick([-2, -3, 2, 3, -4]), h: nz(r, -5, 5), k: nz(r, -9, 9) }; }, function (o) { return !(o.a === -2 && o.h === 3 && o.k === 5); }), b = -2 * o.a * o.h, c = o.a * o.h * o.h + o.k;
        return z().fields('Determine ' + t('b') + ' and ' + t('c') + ' so that the graph of ' + eqy(aTex(o.a) + 'x^{2}+bx+c') + ' has its vertex at ' + t(ptTex(o.h, o.k)) + '.', [{ label: t('b='), name: 'b', ans: b, cands: [[-b, LID + '-sq-sign', 'Expand ' + t('(' + binTex('x', o.h) + ')^{2}') + ' carefully: the middle term is ' + t(polyTex([-2 * o.h, 0])) + '.'], [-2 * o.h, LID + '-times-a', 'Multiply the middle term by ' + t('a=' + o.a) + '.']] }, { label: t('c='), name: 'c', ans: c, cands: [[o.h * o.h + o.k, LID + '-times-a', 'Multiply the ' + t(o.h * o.h) + ' by ' + t('a=' + o.a) + ' before adding ' + t(o.k) + '.'], [o.k, 'u5l4-vertex-c', 'Expand the vertex form: ' + t('c') + ' isn’t ' + t('q') + '.']] }],
          { sol: eqy(vfTex(o.a, o.h, o.k) + '=' + aTex(o.a) + '(' + polyTex([1, -2 * o.h, o.h * o.h]) + ')' + sT(o.k) + '=' + polyTex([o.a, b, c])) + ': ' + t('b=' + b) + ', ' + t('c=' + c) + '.', hints: ['Write the vertex form with ' + t('a=' + o.a) + ' and expand it.'], text: 'b and c from the vertex (a ≠ 1)' });
      } }] }
  ];

  HW.defineLesson({ id: LID, unit: 5, num: '6', title: 'Completing the Square', outcome: 'RF4', calc: true, questions: QUESTIONS, extra: EXTRA });
})(window);
