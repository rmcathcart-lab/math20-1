/* Math 20-1 · Unit 6 · Lesson 8 — Rational Equations That Lead to Quadratics (outcome AN6)
 * Assignment 8 (u6_l08.tex, Questions 1–16) and the Lesson 8 Extra Practice (u6_ep08.tex, A1–A4, B1–B5, C1–C3).
 * Every part is a generator: the booklet question's idea, form and difficulty with new numbers (the lesson's example
 * numbers and the booklet question's own numbers are left out where that is easy). Calculator allowed; roots exact
 * (fractions, simplest radical form), the graphing-calculator and numerical-response items rounded as the booklet asks.
 *
 * Built on the kit HW.p67 from u6l7.js (load order): the equation is worked as the booklet does (NPVs, every term times
 * the LCD or cross-multiplying, standard form, factoring or the quadratic formula, NPV roots rejected, roots verified);
 * roots are typed "x = a, x = b" (± and exact radicals allowed) or "no solution" and checked by HW.u6assess.rootsPart.
 * Recognised mistakes (codes u6l8-…): an extraneous (NPV) root kept, a valid root rejected, a missing root, "no solution"
 * when there is one, signs, a whole-number term not multiplied by the LCD (Priya's error), the −1 of an opposite
 * denominator lost, an inadmissible negative length or resistance kept, k vs the other root, the k-inequality reversed or
 * given as a single value, radicals not simplified, decimals instead of exact roots.
 * Conversions: "explain why … / which method avoids the extraneous root" → the simplified left side and its root (the
 * reason is in the solution); "use the discriminant to show …" → the discriminant and "no real solution"; "explain her
 * error" → MC on the error, then solve correctly; "use a graphing calculator to confirm" → the roots to the nearest
 * hundredth; "determine all values of k" → an inequality k > c.
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: 11, 14, Extra B3, C1, C2, C3. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, KP = K.P, P = HW.poly, ex = HW.ex, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var KT = HW.p67;
  if (!KT) throw new Error('js/lessons/u6l8.js needs js/lessons/u6l7.js (HW.p67) loaded first');
  var LID = 'u6l8', CP = LID + '-';
  KT.codes(CP);
  var F = KT.F, sgnF = KT.sgnF, X = KT.X, pick = KT.pick, nz = KT.nz, lp = KT.lp, tx = KT.tx, R = KT.R, rv = KT.rv, rt = KT.rt, qa = KT.qa, qm = KT.qm, qd = KT.qd;
  var has = KT.has, isInt = KT.isInt, coefT = KT.coefT, gcd = KT.gcd, big = KT.big, exactRoots = KT.exactRoots;

  /* the inequality keypad (C2): k, <, >, ≤, ≥ */
  var W = HW.widgets;
  if (W && W.KEYSETS) {
    var d = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
    var KY = { del: { label: '⌫', fn: 'del', title: 'Delete' }, clear: { label: 'clear', fn: 'clear' }, enter: { label: 'Check ↵', fn: 'enter', wide: true },
      left: { label: '◀', fn: 'left', title: 'Move left' }, right: { label: '▶', fn: 'right', title: 'Move right (out of a box)' }, minus: { label: '−', tex: '-', plain: '-' },
      frac: { label: '<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#@}{#?}', plain: '/', title: 'Fraction' }, dot: { label: '.', tex: '.', plain: '.' } };
    W.KEYSETS.p67ineq = function () { return [[d(7), d(8), d(9), KY.frac, KY.del], [d(4), d(5), d(6), KY.minus, KY.clear], [d(1), d(2), d(3), KY.left, KY.right],
      [d(0), KY.dot, { label: '<i>k</i>', tex: 'k', plain: 'k' }, { label: '&lt;', tex: '<', plain: '<' }, { label: '&gt;', tex: '>', plain: '>' }, { label: '≤', tex: '\\le ', plain: '<=' }, { label: '≥', tex: '\\ge ', plain: '>=' }, KY.enter]]; };
    if (W.KEYHELP) W.KEYHELP.p67ineq = ['Write the values as an inequality, e.g. <b>k &gt; 9</b> (use the fraction key for a fraction).', 'Type e.g. <code>k > 9</code> or <code>k > 25/4</code>.'];
  }

  var H_QUAD = ['State the NPVs and multiply every term by the LCD.', 'Write the quadratic in standard form ' + t('ax^{2}+bx+c=0') + ', factor and solve. Check each root against the NPVs.'];
  var H_EXTR = ['Factor the trinomial denominator and state the NPVs. Multiply every term by the LCD.', 'Solve the quadratic, then reject any root that is an NPV (extraneous).'];
  var H_FORM = ['Multiply every term by the LCD and write the quadratic in standard form.', 'It does not factor: use ' + t('x=\\frac{-b\\pm\\sqrt{b^{2}-4ac}}{2a}') + ' and simplify the radical (and the fraction).'];
  var H_NONE = ['State the NPVs, multiply every term by the LCD and solve the quadratic.', 'Compare both roots with the NPVs. If every root is rejected, write “no solution”.'];
  var H_OPP = ['Opposite denominators: ' + t('a-x=-(x-a)') + ', so the fraction changes sign.', 'Multiply every term by the LCD, write the quadratic in standard form and factor. Check both roots.'];
  var SOLVE = 'State the NPVs and solve. ';
  function roots2(r, lo, hi, test) { return pick(function () { return [nz(r, lo, hi), nz(r, lo, hi)]; }, test); }
  function sig(a) { return JSON.stringify(a); }

  /* ---------- Q1 / EP A1a: x + c/x = b and friends ---------- */
  function q1(r, kind, avoid) {
    var v = 'x', s = pick(function () {
      var z = [nz(r, 1, 9), nz(r, 1, 9)], S = z[0] + z[1], Pd = z[0] * z[1];
      if (z[0] === z[1] && kind !== 'd') return null;
      if (kind === 'a') { if (S === 0) return null; return { L: [F(1, [1, 0], []), sgnF(Pd, Pd, [X])], R: [sgnF(S, S, [])], k: [Pd, S] }; }
      if (kind === 'b') { var q = r.pick([2, 3, 4]); if (Pd % q || S === 0 || gcd(S, q) > 1) return null; var p = Pd / q; return { L: [sgnF(p, p, [X]), F(1, [1, 0], [q])], R: [sgnF(S, S, [q])], k: [p, q, S] }; }
      if (kind === 'c') { var c = -Pd, dd = S; if (dd === 0) return null; return { L: [sgnF(c, c, [X, X]), sgnF(dd, dd, [X])], R: [F(1, 1, [])], k: [c, dd] }; }
      var a = nz(r, 1, 9), Ld = [F(1, 1, []), F(1, a * a, [X, X])]; if (r.chance(0.4)) Ld.reverse(); return { L: Ld, R: [sgnF(a, 2 * a, [X])], k: [a] };
    }, function (z) { if ((avoid || []).concat({ a: ['[-12,4]', '[6,5]'], b: ['[5,2,7]'], c: ['[2,-1]'], d: ['[3]'] }[kind]).indexOf(sig(z.k)) >= 0) return false; var W = KT.eq(v, z.L, z.R); return W.info.deg === 2 && W.valid.length >= 1 && !W.extr.length; });
    var W = KT.eq(v, s.L, s.R);
    return KT.solvePart(CP, SOLVE + t(W.tex), W, H_QUAD, kind === 'd' ? 'a double root' : 'a rational equation that leads to a quadratic');
  }

  /* ---------- Q2 / EP A1b: one fraction on each side, a quadratic ---------- */
  function q2a(r, swap, verify) { // (x + a)/q = p/x
    var s = pick(function () { var z = [nz(r, 1, 9), nz(r, 1, 9)], q = r.pick([2, 3, 4, 5]), Pd = z[0] * z[1]; if (z[0] === z[1] || Pd % q) return null; var a = -(z[0] + z[1]), p = -Pd / q; if (a === 0 || p === 0) return null; return { a: a, q: q, p: p }; },
      function (z) { if ([sig([-2, 3, 8]), sig([-2, 5, 3])].indexOf(sig([z.a, z.q, z.p])) >= 0) return false; var W = KT.eq('x', [F(1, [1, z.a], [z.q])], [sgnF(z.p, z.p, [X])], { cross: true }); return W.valid.length === 2 && W.valid.every(isInt); });
    var L = [F(1, [1, s.a], [s.q])], Rr = [sgnF(s.p, s.p, [X])];
    var W = swap ? KT.eq('x', Rr, L, { cross: true, verify: verify }) : KT.eq('x', L, Rr, { cross: true, verify: verify });
    return KT.solvePart(CP, (verify ? 'State the NPVs, solve and verify. ' : SOLVE) + t(W.tex), W, ['State the NPVs. One fraction on each side: cross-multiply.', 'Write the quadratic in standard form and factor.'], 'cross-multiply: a quadratic');
  }
  function q2b(r) { // m x/(x + a) = (x + b)/x
    var s = pick(function () { return { a: nz(r, 1, 9), b: nz(r, 1, 9), m: r.pick([2, 2, 3]) }; }, function (z) {
      if (z.a === 3 && z.b === 2 && z.m === 2) return false; var W = KT.eq('x', [F(1, [z.m, 0], [[1, z.a]])], [F(1, [1, z.b], [X])], { cross: true }); return W.info.deg === 2 && W.valid.length === 2 && W.valid.every(function (x) { return R(x)[1] <= 2 && Math.abs(rv(x)) <= 20; }) && (W.valid.every(isInt) || r.chance(0.5));
    });
    var W = KT.eq('x', [F(1, [s.m, 0], [[1, s.a]])], [F(1, [1, s.b], [X])], { cross: true, verify: true });
    return KT.solvePart(CP, 'State the NPVs, solve and verify. ' + t(W.tex), W, ['State the NPVs. Cross-multiply (brackets!).', 'Write the quadratic in standard form, factor, and verify both roots.'], 'cross-multiply: a quadratic');
  }

  /* ---------- Q3 / EP A2b: an extraneous root ---------- */
  function q3(r, kind, avoid) { // x/(x + a) + p/(x − b) = S/((x + a)(x − b)); one root is an NPV
    var s = pick(function () {
      var a = nz(r, 1, 7), b = kind === 'b' ? a : nz(r, 1, 7), e = r.chance(0.5) ? b : -a, rr = nz(r, 1, 9), p = b - e - rr, S = p * a - e * rr;
      return { a: a, b: b, e: e, rr: rr, p: p, S: S };
    }, function (z) {
      if (z.a === -z.b || (kind === 'a' && z.a === z.b) || z.p === 0 || z.S === 0 || z.rr === z.e || z.rr === z.b || z.rr === -z.a || Math.abs(z.S) > 60) return false;
      return (avoid || []).concat([sig([2, 1, 4, 12]), sig([4, 4, 3, 32])]).indexOf(sig([z.a, z.b, z.p, z.S])) < 0;
    });
    var W = KT.eq('x', [F(1, [1, 0], [[1, s.a]]), sgnF(s.p, s.p, [[1, -s.b]])], [sgnF(s.S, s.S, [[1, s.a], [1, -s.b]])]);
    return KT.solvePart(CP, 'State the NPVs and solve. Reject any extraneous root. ' + t(W.tex), W, H_EXTR, 'an extraneous root');
  }

  /* ---------- Q4 / EP A2a: (x + a)(x + c)/(x + a) = m x + n ---------- */
  function q4Shared(r, avoid) {
    return pick(function () { return { a: nz(r, 1, 7), c: nz(r, 1, 7), m: r.pick([2, 3]), n: nz(r, 0, 9) }; }, function (z) {
      if (z.a === z.c) return false; var rr = (z.c - z.n) / (z.m - 1); if (rr !== Math.round(rr) || rr === -z.a || Math.abs(rr) > 15) return false;
      return (avoid || []).concat([sig([4, -1, 3, -5]), sig([-5, 3, 2, 0]), sig([2, -3, 2, -7])]).indexOf(sig([z.a, z.c, z.m, z.n])) < 0;
    });
  }
  function q4Tex(s) { var N = P.mul(lp(1, s.a, 'x'), lp(1, s.c, 'x')); return '\\frac{' + tx(N) + '}{' + tx(lp(1, s.a, 'x')) + '}=' + tx(lp(s.m, s.n, 'x')); }
  function q4a(r, s, prompt) {
    var N = P.mul(lp(1, s.a, 'x'), lp(1, s.c, 'x'));
    var W = KT.eq('x', [F(1, N, [[1, s.a]])], [F(1, [s.m, s.n], [])], { cross: true });
    return KT.solvePart(CP, prompt || 'Solve by cross-multiplying.', W, ['State the NPV. Cross-multiply: the right side is over 1.', 'Write the quadratic in standard form and factor; reject the root that is the NPV.'], 'cross-multiply: an extraneous root');
  }
  function q4b(r, s) {
    var rr = (s.c - s.n) / (s.m - 1), tgt = lp(1, s.c, 'x');
    var c1 = K.poly(tgt, { wrong: [{ is: lp(1, s.a, 'x'), code: 'value', hint: 'Factor the numerator: ' + t('(' + tx(lp(1, s.a, 'x')) + ')(' + tx(tgt) + ')') + '. Which factor divides out?' }] }), c2 = K.value(rr, { diag: function (x) { return x === -s.a ? { code: CP + 'eq-extr', hint: t('x=' + (-s.a)) + ' is the NPV: it is not a solution.' } : null; } });
    var fields = [{ label: 'Left side =', mode: 'math', keys: 'u6rat', vars: ['x'], name: 'Simplified left side', placeholder: 'simplified' }, { label: 'Solution: x =', mode: 'math', keys: 'u6rat', vars: ['x'], name: 'Solution' }];
    var sol = 'For ' + t('x\\ne ' + (-s.a)) + ': ' + t('\\frac{(' + tx(lp(1, s.a, 'x')) + ')(' + tx(tgt) + ')}{' + tx(lp(1, s.a, 'x')) + '}=' + tx(tgt)) + '.<br>' + t(tx(tgt) + '=' + tx(lp(s.m, s.n, 'x'))) + ', so ' + t((s.m - 1) + 'x=' + (s.c - s.n)) + (s.m - 1 === 1 ? '' : ' and ' + t('x=' + rr)) + '.<br>Simplifying first gives a <b>linear</b> equation, so it avoids the extraneous root ' + t('x=' + (-s.a)) + ' that cross-multiplying creates.';
    var check = function (resp) {
      resp = resp || []; var r1 = c1(resp[0] == null ? '' : resp[0]), r2 = c2(String(resp[1] == null ? '' : resp[1]).replace(/^\s*x\s*=\s*/, ''));
      if (r1.v === 'correct' && r2.v === 'correct') return ok();
      if (r1.v !== 'correct') return { v: r1.v, code: r1.code, hint: '<b>Left side:</b> ' + (r1.hint || 'Factor the numerator and divide out the common factor.') };
      return { v: r2.v, code: r2.code, hint: '<b>Solution:</b> ' + (r2.hint || 'Solve the linear equation.') };
    };
    var key = [tx(tgt), String(rr)];
    var p = { prompt: 'Show a second method: for ' + t('x\\ne ' + (-s.a)) + ', simplify the left side first, then solve the simplified equation. Which method avoids the extraneous root?', input: { type: 'fields', fields: fields }, check: check, key: key, answer: t(tx(tgt)) + '; ' + t('x=' + rr) + ' (simplifying first avoids the extraneous root)', solution: sol, hints: ['Factor the numerator; one factor divides out with the denominator.', 'The equation left is linear.'], text: 'simplify first' };
    p.bad = [[tx(lp(1, s.a, 'x')), String(rr)], [key[0], String(-s.a)]];
    return p;
  }

  /* ---------- Q5 / EP B1: no solution (both roots NPVs) ---------- */
  function q5(r, fam, avoid) {
    var s = pick(function () { return { m: r.pick([1, 1, 2, 3]), a: nz(r, 1, 6) }; }, function (z) { return (avoid || []).concat(fam === 'A' ? [sig([2, 2])] : [sig([1, 4])]).indexOf(sig([z.m, z.a])) < 0; }), m = s.m, a = s.a, W;
    if (fam === 'A') W = KT.eq('x', [F(1, [m, 0], [[1, -a]]), sgnF(-1, m * a * a, [X, [1, -a]])], [sgnF(m * a, m * a, [X])]); // m x/(x − a) − m a²/(x² − a x) = m a/x
    else W = KT.eq('x', [F(1, [m, 0], [[1, a]]), sgnF(m * a, m * a, [X])], [F(1, m * a * a, [X, [1, a]])]); // m x/(x + a) + m a/x = m a²/(x² + a x)
    return KT.solvePart(CP, 'Show that the equation has no solution (or solve it). ' + t(W.tex), W, H_NONE, 'no solution: both roots are NPVs');
  }

  /* ---------- Q6: exact roots ---------- */
  function irrOK(W, maxA) { var I = W.info; return !!I.irr && I.D <= 300 && Math.abs(I.Ar) <= (maxA || 3) && Math.abs(I.Br) <= 16 && I.irr.vals.every(function (x) { return Math.abs(x) < 15; }); }
  function q6a(r) { // p/x + c = x/q
    var s = pick(function () { return { p: nz(r, 1, 9), c: nz(r, 1, 5), q: r.pick([1, 2, 3, 4]) }; }, function (z) {
      if ([sig([4, -3, 2]), sig([2, 1, 3])].indexOf(sig([z.p, z.c, z.q])) >= 0) return false;
      var W = KT.eq('x', [sgnF(z.p, z.p, [X]), sgnF(z.c, z.c, [])], [F(1, [1, 0], z.q === 1 ? [] : [z.q])]); return irrOK(W) && (ex.nthFactor(W.info.D, 2) > 1 || r.chance(0.4));
    });
    var W = KT.eq('x', [sgnF(s.p, s.p, [X]), sgnF(s.c, s.c, [])], [F(1, [1, 0], s.q === 1 ? [] : [s.q])]);
    return KT.solvePart(CP, 'Solve. Give exact roots in simplest radical form. ' + t(W.tex), W, H_FORM, 'exact roots: the quadratic formula');
  }
  function q6Shared(r) { // a/(x + b) + c/(x + d) = 1
    return pick(function () { return { a: r.int(1, 5), b: nz(r, 1, 5), c: r.int(1, 5), d: nz(r, 1, 5), e: r.pick([1, 1, 2]) }; }, function (z) {
      if (z.b === z.d || [sig([2, 1, 1, -2, 1]), sig([1, -1, 1, 1, 1])].indexOf(sig([z.a, z.b, z.c, z.d, z.e])) >= 0) return false;
      var W = KT.eq('x', [F(1, z.a, [[1, z.b]]), F(1, z.c, [[1, z.d]])], [F(1, z.e, [])]); return irrOK(W, 2) && W.info.irr.vals.every(function (x) { return Math.abs(x) < 9; });
    });
  }
  function q6W(s) { return KT.eq('x', [F(1, s.a, [[1, s.b]]), F(1, s.c, [[1, s.d]])], [F(1, s.e, [])]); }

  /* ---------- Q7: the discriminant: no real solution ---------- */
  function q7(r) {
    var s = pick(function () { return { a: nz(r, 1, 6), p: nz(r, 1, 9) }; }, function (z) { if (z.a === 1 && z.p === 2) return false; var W = KT.eq('x', [F(1, [1, 0], [[1, -z.a]])], [sgnF(z.p, z.p, [X]), F(-1, 1, [])]); return W.info.deg === 2 && W.info.neg; });
    var W = KT.eq('x', [F(1, [1, 0], [[1, -s.a]])], [sgnF(s.p, s.p, [X]), F(-1, 1, [])]), D = W.info.D;
    var c1 = function (resp) {
      var a = K.read(String(resp == null ? '' : resp).replace(/^\s*(b\^\{?2\}?-4ac|\\Delta|D)\s*=\s*/, '')); if (a.res) return a.res;
      for (var k = 1; k <= 8; k++) if (Math.abs(a.val - D * k * k) < 1e-9) return ok();
      if (a.val > 0) return wrong('value', 'Check the sign of ' + t('4ac') + ': here ' + t('b^{2}-4ac') + ' is negative.');
      return wrong('value', 'Write the quadratic in standard form first, then use ' + t('b^{2}-4ac') + '.');
    };
    var c2 = function (resp) { var s2 = String(resp == null ? '' : resp).replace(/\\text\{([^}]*)\}/g, '$1').replace(/\\[ ,;:!]|~/g, ' ').trim().toLowerCase(); if (!s2) return form('empty', 'State the solution(s), or “no real solution”.'); return /^(no|none|∅|\\emptyset|\\varnothing)/.test(s2) ? ok() : wrong(CP + 'eq-nosol', 'A negative discriminant means the quadratic has no real roots, so the equation has no real solution.'); };
    var fields = [{ label: t('b^{2}-4ac='), mode: 'math', keys: 'u6sol', vars: ['x'], name: 'Discriminant' }, { label: 'Solutions:', mode: 'math', keys: 'u6sol', vars: ['x'], name: 'Solutions', placeholder: 'roots, or no solution' }];
    var check = function (resp) { resp = resp || []; var r1 = c1(resp[0]), r2 = c2(resp[1]); if (r1.v === 'correct' && r2.v === 'correct') return ok(); if (r1.v !== 'correct') return { v: r1.v, code: r1.code, hint: '<b>Discriminant:</b> ' + (r1.hint || 'Check it.') }; return { v: r2.v, code: r2.code, hint: '<b>Solutions:</b> ' + r2.hint }; };
    var p = { prompt: big('Use the discriminant to show that ' + t(W.tex) + ' has no real solution.'), input: { type: 'fields', fields: fields }, check: check, key: [String(D), '\\text{no solution}'], answer: t('b^{2}-4ac=' + D) + ' < 0: no real solution', solution: W.sol, hints: ['State the NPVs, multiply every term by the LCD and write the quadratic in standard form.', 'Work out ' + t('b^{2}-4ac') + '. If it is negative, there are no real roots.'], text: 'the discriminant: no real solution' };
    p.bad = [[String(-D), '\\text{no solution}'], [String(D), 'x=1']];
    return p;
  }

  /* ---------- Q8 / EP A3: opposite denominators, two roots ---------- */
  function q8(r) { // x/(x − a) + p/(a − x) = x/q
    var s = pick(function () { return { a: r.int(1, 9), p: nz(r, 1, 9), q: r.pick([2, 3, 4]) }; }, function (z) { if (z.a === 5 && z.p === 3 && z.q === 2) return false; var W = KT.eq('x', [F(1, [1, 0], [[1, -z.a]]), sgnF(z.p, z.p, [[-1, z.a]], { asc: true })], [F(1, [1, 0], [z.q])]); return W.valid.length === 2 && W.valid.every(isInt) && !W.extr.length; });
    var W = KT.eq('x', [F(1, [1, 0], [[1, -s.a]]), sgnF(s.p, s.p, [[-1, s.a]], { asc: true })], [F(1, [1, 0], [s.q])], { verify: true });
    return KT.solvePart(CP, 'Solve. ' + t(W.tex), W, H_OPP, 'opposite denominators: a quadratic');
  }
  function epA3(r) { // (x + b)/(x − a) + p/(a − x) = x
    var s = pick(function () { return { a: r.int(1, 7), b: nz(r, 1, 9), p: r.int(1, 9) }; }, function (z) { if ((z.a === 3 && z.b === 9 && z.p === 4) || z.b - z.p === -z.a || z.b === z.p || z.b === -z.a) return false; var W = KT.eq('x', [F(1, [1, z.b], [[1, -z.a]]), F(1, z.p, [[-1, z.a]], { asc: true })], [F(1, [1, 0], [])]); return W.valid.length === 2 && W.valid.every(isInt) && !W.extr.length; });
    var W = KT.eq('x', [F(1, [1, s.b], [[1, -s.a]]), F(1, s.p, [[-1, s.a]], { asc: true })], [F(1, [1, 0], [])], { verify: true });
    return KT.solvePart(CP, 'Solve. ' + t(W.tex), W, H_OPP, 'opposite denominators: a quadratic');
  }

  /* ---------- Q9: Priya ---------- */
  function priyaShared(r) { return pick(function () { var z = [nz(r, 1, 8), nz(r, 1, 8)]; return { r1: z[0], r2: z[1] }; }, function (z) { var b = z.r1 + z.r2, p = -z.r1 * z.r2; return z.r1 * z.r2 < 0 && b !== 0 && !(b === 1 && p === 6) && p + b !== z.r1 && p + b !== z.r2; }); }
  function priyaEq(s) { var b = s.r1 + s.r2, p = -s.r1 * s.r2; return KT.eq('x', [F(1, p, [X])], [F(1, [1, -b], [])]); }

  /* ---------- Q10 / EP C1: k and the other root ---------- */
  function kOther(r, prompt, k, other, given, sol, hints, text) {
    return KT.numPart(prompt, [{ label: t('k='), name: 'k', val: k, cands: [[other, CP + 'other', 'That is the other root. First find ' + t('k') + ' by substituting the given root.']] }, { label: 'Other root: ' + t('x='), name: 'Other root', val: other, cands: [[given, CP + 'gave-given', 'That root was given: find the other one.'], [k, CP + 'gave-k', 'That is ' + t('k') + '. Put it back into the equation and solve for both roots.']] }], sol, hints, text);
  }
  function q10(r) {
    var s = pick(function () { return { r0: nz(r, 1, 8), r1: nz(r, 1, 9) }; }, function (z) { var b = z.r0 + z.r1, k = z.r0 * z.r1; return z.r0 !== z.r1 && b !== 0 && k !== z.r1 && k !== z.r0 && Math.abs(k) <= 60 && !(z.r0 === 2 && z.r1 === 5); });
    var b = s.r0 + s.r1, k = s.r0 * s.r1;
    var sol = 'Substitute ' + t('x=' + s.r0) + ': ' + t(s.r0 + '+\\frac{k}{' + s.r0 + '}=' + b) + ', so ' + t('\\frac{k}{' + s.r0 + '}=' + s.r1) + ' and ' + t('k=' + k) + '.<br>' + t('x' + (k < 0 ? '-' : '+') + '\\frac{' + Math.abs(k) + '}{x}=' + b) + ': multiply by ' + t('x') + ' (' + t('x\\ne 0') + '): ' + t(tx(P.add(P.mono(1, { x: 2 }), P.mono(-b, { x: 1 }), P.num(k))) + '=0') + ', ' + t('(' + tx(lp(1, -s.r0, 'x')) + ')(' + tx(lp(1, -s.r1, 'x')) + ')=0') + '. The other root is ' + t('x=' + s.r1) + '.';
    return kOther(r, big('One root of ' + t('x+\\frac{k}{x}=' + b) + ' is ' + t('x=' + s.r0) + '. Determine ' + t('k') + ' and the other root.'), k, s.r1, s.r0, sol, ['Substitute the given root to find ' + t('k') + '.', 'Put ' + t('k') + ' back, multiply by ' + t('x') + ' and factor the quadratic.'], 'working backwards: k and the other root');
  }

  /* ---------- Q11 / EP B3: lens and parallel resistors ---------- */
  function recipShared(r, ctx) {
    return pick(function () { var p = r.int(2, 60), d = r.int(1, 60); return { p: p, d: d, f: p * (p + d) / (2 * p + d) }; }, function (z) {
      if (z.f !== Math.round(z.f) || z.f < 2) return false;
      if (ctx === 'lens') return !(z.f === 12 && z.d === 32) && z.d >= 4 && z.p >= 4 && z.p <= 60;
      return !(z.f === 4 && z.d === 6) && !(z.f === 6 && z.d === 5) && z.p <= 40 && z.d <= 30;
    });
  }
  function recipPart(r, ctx) {
    var s = recipShared(r, ctx), f = s.f, d = s.d, p = s.p, q = p + d, neg = 2 * f - d - p;
    var lens = ctx === 'lens', u = lens ? 'p' : 'R', unit = lens ? 'cm' : '\\Omega';
    var setup = lens
      ? 'For a thin lens, ' + t('\\frac{1}{f}=\\frac{1}{p}+\\frac{1}{q}') + ', where ' + t('f') + ' is the focal length, ' + t('p') + ' the distance from the object to the lens and ' + t('q') + ' the distance from the lens to the image (all in cm). A lens has ' + t('f=' + f) + ' cm, and the image is ' + t(d) + ' cm farther from the lens than the object is. Determine ' + t('p') + ' and ' + t('q') + '.'
      : 'Two resistors are connected in parallel (' + t('\\frac{1}{R}=\\frac{1}{R_{1}}+\\frac{1}{R_{2}}') + '). One resistor is ' + t(d + '\\ \\Omega') + ' greater than the other, and the combined resistance is ' + t(f + '\\ \\Omega') + '. Determine both resistances.';
    var A = P.add(P.mono(1, { x: 2 }), P.mono(d - 2 * f, { x: 1 }), P.num(-f * d));
    var sol = (lens ? t('q=p+' + d) + ': ' + t('\\frac{1}{' + f + '}=\\frac{1}{p}+\\frac{1}{p+' + d + '}') + ' (' + t('p\\ne 0,\\ -' + d) + '). LCD ' + t(f + 'p(p+' + d + ')') + ':<br>' + t('p(p+' + d + ')=' + f + '(p+' + d + ')+' + f + 'p')
      : 'Let the smaller resistance be ' + t('R') + '; the other is ' + t('R+' + d) + '. ' + t('\\frac{1}{' + f + '}=\\frac{1}{R}+\\frac{1}{R+' + d + '}') + ' (' + t('R\\ne 0,\\ -' + d) + '). LCD ' + t(f + 'R(R+' + d + ')') + ':<br>' + t('R(R+' + d + ')=' + f + '(R+' + d + ')+' + f + 'R'))
      + '<br>' + t(tx(A).replace(/x/g, u) + '=0') + ', ' + t('(' + u + '-' + p + ')(' + u + (neg < 0 ? '+' : '-') + Math.abs(neg) + ')=0') + ', so ' + t(u + '=' + p) + ' (' + t(u + '=' + neg) + ' is rejected: ' + (lens ? 'a distance' : 'a resistance') + ' is positive).<br>'
      + (lens ? t('p=' + p) + ' cm and ' + t('q=' + q) + ' cm.' : 'The resistances are ' + t(p + '\\ \\Omega') + ' and ' + t(q + '\\ \\Omega') + '.') + ' Check: ' + t('\\frac{1}{' + p + '}+\\frac{1}{' + q + '}=\\frac{1}{' + f + '}') + ' ✓';
    var cands = [[neg, CP + 'neg-root', 'That root is negative: ' + (lens ? 'a distance' : 'a resistance') + ' must be positive. Use the other root.'], [neg + d, CP + 'neg-root', 'That comes from the negative root, which is rejected.']];
    return KT.numPart(setup, lens ? [{ label: t('p='), name: 'p', val: p, after: 'cm', cands: cands }, { label: t('q='), name: 'q', val: q, after: 'cm', cands: [[neg + d, CP + 'neg-root', 'That comes from the negative root, which is rejected.']] }]
      : [{ label: 'Smaller:', name: 'Smaller', val: p, after: 'Ω', cands: cands }, { label: 'Larger:', name: 'Larger', val: q, after: 'Ω' }],
      sol, [lens ? 'Write ' + t('q=p+' + d) + ' and substitute into the lens equation.' : 'Let the smaller resistance be ' + t('R') + '; the other is ' + t('R+' + d) + '.', 'Multiply every term by the LCD, solve the quadratic, and reject the root that does not make sense.'], lens ? 'the lens equation' : 'parallel resistors', { swap: CP + 'other' });
  }

  /* ---------- MC: radical roots, u ± k√m ---------- */
  function pmT(u, k, m) { return (u === 0 ? '' : String(u)) + '\\pm ' + (k === 1 ? '' : k) + '\\sqrt{' + m + '}'; }
  function radMC(r, prompt, W, text) {
    var I = W.info, X0 = I.irr; // roots (b ± k√m)/d with d = 1
    var u = X0.b, k = X0.k, m = X0.m;
    var opts = [{ html: t(pmT(u, k, m)), right: true }, { html: t(pmT(-u, k, m)), why: 'Check the sign of ' + t('-b') + ' in the quadratic formula.', code: 'sign' },
      { html: t(pmT(2 * u, 2 * k, m)), why: 'Divide <b>every</b> term of the numerator by ' + t(2) + '.', code: 'divide' }, { html: t(pmT(u, 2 * k, m)), why: 'Divide every term by ' + t(2) + ' — the radical term too.', code: 'half' }];
    return KT.mc(r, prompt, opts, W.sol, H_FORM, text);
  }

  /* ---------- NR ---------- */
  function nrPos(prompt, W, dp, hints, text) {
    var x = W.info.irr ? Math.max.apply(null, W.info.irr.vals) : Math.max.apply(null, W.valid.map(rv));
    return KP.approx(big(prompt), x, dp, { nr: true }, W.sol, hints, text);
  }
  function q15(r) { // (x + a)/(x − b) = m x/(x + c), the positive root
    var s = pick(function () { return { a: nz(r, 1, 5), b: nz(r, 1, 5), c: nz(r, 1, 5), m: r.pick([2, 3, 3, 4]) }; }, function (z) {
      if (z.a * z.c <= 0 || z.b === -z.c || (z.a === 1 && z.b === 2 && z.c === 2 && z.m === 3)) return false;
      var W = KT.eq('x', [F(1, [1, z.a], [[1, -z.b]])], [F(1, [z.m, 0], [[1, z.c]])], { cross: true }); if (!W.info.irr) return false; var pos = W.info.irr.vals.filter(function (x) { return x > 0; }); return pos.length === 1 && pos[0] < 9.995 && pos[0] > 0.05;
    });
    var W = KT.eq('x', [F(1, [1, s.a], [[1, -s.b]])], [F(1, [s.m, 0], [[1, s.c]])], { cross: true });
    return nrPos('The positive root of ' + t(W.tex) + ', to the nearest hundredth, is ____.', W, 2, H_FORM, 'NR: the positive root');
  }
  function q16(r) { // x/(x − a) − c/(x + a) = 2a²/(x² − a²): roots a (rejected) and r
    var s = pick(function () { return { a: nz(r, 1, 7), rr: r.int(1, 30) }; }, function (z) { return z.rr !== z.a && z.rr !== -z.a && z.rr + 2 * z.a !== 0 && !(z.a === 3 && z.rr === 7); });
    var c = s.rr + 2 * s.a, a = s.a;
    var W = KT.eq('x', [F(1, [1, 0], [[1, -a]]), sgnF(-c, c, [[1, a]])], [F(1, 2 * a * a, [[1, -a], [1, a]])]);
    var p = KP.nr(big('The solution of ' + t(W.tex) + ' is ' + t('x=') + ' ____.'), s.rr, function (x) { return x === a ? { code: CP + 'eq-extr', hint: t('x=' + a) + ' is an NPV: reject it. Use the other root.' } : null; }, W.sol, H_EXTR, 'NR: reject the extraneous root');
    return p;
  }

  /* ---------- EP ---------- */
  function epA1c(r) { // p/x + q/(x + a) = c, non-monic quadratic
    var s = pick(function () { return { p: r.int(1, 6), q: r.int(1, 6), a: nz(r, 1, 4), c: r.pick([2, 2, 3]) }; }, function (z) {
      if (z.p === 2 && z.q === 3 && z.a === 1 && z.c === 2) return false; var W = KT.eq('x', [F(1, z.p, [X]), F(1, z.q, [[1, z.a]])], [F(1, z.c, [])]); return W.info.deg === 2 && W.info.Ar > 1 && W.valid.length === 2 && W.valid.some(function (x) { return !isInt(x); }) && W.valid.every(function (x) { return Math.abs(rv(x)) < 15 && R(x)[1] <= 4; });
    });
    var W = KT.eq('x', [F(1, s.p, [X]), F(1, s.q, [[1, s.a]])], [F(1, s.c, [])]);
    return KT.solvePart(CP, SOLVE + t(W.tex), W, H_QUAD, 'a quadratic with leading coefficient not 1');
  }
  function epA4(r) { // p/x + x/(x − a) = c, exact roots
    var s = pick(function () { return { p: nz(r, 1, 7), a: nz(r, 1, 5), c: r.pick([2, 3, 4]) }; }, function (z) { if (z.p === 3 && z.a === 2 && z.c === 3) return false; var W = KT.eq('x', [sgnF(z.p, z.p, [X]), F(1, [1, 0], [[1, -z.a]])], [F(1, z.c, [])]); return irrOK(W, 3); });
    var W = KT.eq('x', [sgnF(s.p, s.p, [X]), F(1, [1, 0], [[1, -s.a]])], [F(1, s.c, [])]);
    return KT.solvePart(CP, 'Solve. Give exact roots. ' + t(W.tex), W, H_FORM, 'exact roots: the quadratic formula');
  }
  function epB2(r) { // k x²/(x − a) = k a²/(x − a): exactly one solution
    var s = pick(function () { return { k: r.pick([1, 1, 2, 3]), a: nz(r, 1, 9) }; }, function (z) { return !(z.k === 1 && z.a === 3); });
    var W = KT.eq('x', [F(1, [s.k, 0, 0], [[1, -s.a]])], [F(1, s.k * s.a * s.a, [[1, -s.a]])]);
    var sol = W.sol + '<br>(Multiplying by ' + t(tx(lp(1, -s.a, 'x'))) + ' gives ' + t((s.k === 1 ? '' : s.k) + 'x^{2}=' + s.k * s.a * s.a) + ', so ' + t('x=\\pm ' + Math.abs(s.a)) + '; ' + t('x=' + s.a) + ' is the NPV and is rejected, leaving exactly one solution.)';
    return KT.solvePart(CP, 'Explain why ' + t(W.tex) + ' has exactly one solution, and state it.', W, ['Multiply both sides by the denominator: what quadratic is left?', 'It has two roots, but one of them is the NPV.'], 'one root rejected', { sol: sol });
  }
  function epB4(r) { // p/x − q/(x + a) = 1 → MC radical roots
    var s = pick(function () { return { p: r.int(2, 9), q: r.int(1, 5), a: nz(r, 1, 4) }; }, function (z) {
      if (z.p === 6 && z.q === 1 && z.a === 1) return false; var W = KT.eq('x', [F(1, z.p, [X]), F(-1, z.q, [[1, z.a]])], [F(1, 1, [])]); return !!W.info.irr && W.info.irr.d === 1 && W.info.irr.b !== 0 && W.info.irr.m < 60;
    });
    var W = KT.eq('x', [F(1, s.p, [X]), F(-1, s.q, [[1, s.a]])], [F(1, 1, [])]);
    return radMC(r, 'The solutions of ' + t(W.tex) + ' are', W, 'MC: exact roots');
  }
  function epB5(r) { // 1/x + 1/(x + a) = 1/c, the positive solution
    var s = pick(function () { return { a: r.int(1, 6), c: r.int(1, 6), n: r.pick([1, 1, 2]) }; }, function (z) {
      if (z.a === 2 && z.c === 2 && z.n === 1) return false; var W = KT.eq('x', [F(1, z.n, [X]), F(1, z.n, [[1, z.a]])], [F(1, 1, [z.c])]); if (!W.info.irr) return false; var pos = W.info.irr.vals.filter(function (x) { return x > 0; }); return pos.length === 1 && pos[0] < 9.995;
    });
    var W = KT.eq('x', [F(1, s.n, [X]), F(1, s.n, [[1, s.a]])], [F(1, 1, [s.c])]);
    return nrPos('The positive solution of ' + t(W.tex) + ', to the nearest hundredth, is ____.', W, 2, H_FORM, 'NR: the positive solution');
  }
  function epC1(r) { // p/x + x/(x − a) = k has the root x0
    var s = pick(function () { return { p: nz(r, 1, 8), a: nz(r, 1, 5), x0: nz(r, 1, 6) }; }, function (z) {
      if (z.x0 === z.a || (z.p === 3 && z.a === 2 && z.x0 === 3)) return false; var k = qa(qd(z.p, z.x0), qd(z.x0, z.x0 - z.a)); if (!isInt(k) || k[0] === 1 || k[0] === 0) return false;
      var W = KT.eq('x', [sgnF(z.p, z.p, [X]), F(1, [1, 0], [[1, -z.a]])], [sgnF(k[0], k[0], [])]); return W.valid.length === 2 && W.valid.every(function (x) { return R(x)[1] <= 6 && Math.abs(rv(x)) <= 30; });
    });
    var k = qa(qd(s.p, s.x0), qd(s.x0, s.x0 - s.a))[0], W = KT.eq('x', [sgnF(s.p, s.p, [X]), F(1, [1, 0], [[1, -s.a]])], [sgnF(k, k, [])]);
    var other = W.valid.filter(function (x) { return !has([s.x0], x); })[0];
    var eqk = t((s.p < 0 ? '-' : '') + '\\frac{' + Math.abs(s.p) + '}{x}+\\frac{x}{' + tx(lp(1, -s.a, 'x')) + '}=k');
    var sol = 'Substitute ' + t('x=' + s.x0) + ': ' + t('\\frac{' + s.p + '}{' + s.x0 + '}+\\frac{' + s.x0 + '}{' + (s.x0 - s.a) + '}=k') + ', so ' + t('k=' + k) + '.<br>' + W.sol.replace(/<br>The solutions are.*$/, '') + '<br>The other root is ' + t('x=' + rt(other)) + '.';
    return kOther(r, big('The equation ' + eqk + ' has the root ' + t('x=' + s.x0) + '. Determine ' + t('k') + ' and the other root.'), k, other, s.x0, sol, ['Substitute ' + t('x=' + s.x0) + ' to find ' + t('k') + '.', 'Put ' + t('k') + ' back, multiply by the LCD and factor; one factor is ' + t('(x-' + s.x0 + ')') + ' (or contains it).'], 'working backwards: k and the other root');
  }
  function epC2(r) { // x + k/x = b has no real solution for k > b²/4
    var b = pick(function () { return nz(r, 2, 12); }, function (z) { return Math.abs(z) !== 4; }), c = ex.norm(b * b, 4);
    var ct = rt(c);
    var check = function (resp) {
      var s = String(resp == null ? '' : resp).replace(/\\left|\\right/g, '').replace(/\\gt|&gt;/g, '>').replace(/\\lt|&lt;/g, '<').replace(/\\geq?|≥/g, '≥').replace(/\\leq?|≤/g, '≤').replace(/>=/g, '≥').replace(/<=/g, '≤').replace(/\\[ ,;:!]|~|\s/g, '');
      if (!s) return form('empty', 'Type your answer first.');
      var m = /^k([<>≤≥=])(.+)$/.exec(s), rev = /^(.+)([<>≤≥])k$/.exec(s), op, val;
      if (m) { op = m[1]; val = m[2]; } else if (rev) { val = rev[1]; op = { '<': '>', '>': '<', '≤': '≥', '≥': '≤' }[rev[2]]; } else return form('unreadable', 'Write the values as an inequality, e.g. ' + t('k>9') + '.');
      var q = ex.parse(val); if (!q.ok) return form('unreadable', 'Write the values as an inequality, e.g. ' + t('k>9') + '.');
      var x = ex.value(q.ast), at = Math.abs(x - rv(c)) < 1e-9;
      if (at && op === '>') return ok();
      if (at && op === '=') return wrong(CP + 'k-eq', 'At ' + t('k=' + ct) + ' the discriminant is ' + t(0) + ': there is one (double) root. Which values of ' + t('k') + ' make the discriminant negative?');
      if (at && op === '≥') return wrong(CP + 'k-eq', 'At ' + t('k=' + ct) + ' there is a double root, so that value has a solution: use ' + t('>') + ', not ' + t('\\ge') + '.');
      if (at) return wrong(CP + 'k-dir', 'Check the direction: the discriminant ' + t(b * b + '-4k') + ' is negative when ' + t('k') + ' is <b>greater</b> than ' + t(ct) + '.');
      return wrong('value', 'Multiply by ' + t('x') + ': ' + t('x^{2}' + (b < 0 ? '+' : '-') + Math.abs(b) + 'x+k=0') + '. No real roots when ' + t('b^{2}-4ac\\lt 0') + '.');
    };
    var sol = t('x\\ne 0') + ': multiply by ' + t('x') + ': ' + t('x^{2}' + (b < 0 ? '+' : '-') + Math.abs(b) + 'x+k=0') + '. No real roots when ' + t('b^{2}-4ac\\lt 0') + ': ' + t(b * b + '-4k\\lt 0') + ', so ' + t('k>' + ct) + '.<br>(If ' + t('k=0') + ', the roots are ' + t(0) + ' and ' + t(b) + '; ' + t(0) + ' is rejected but ' + t(b) + ' remains, so ' + t('k=0') + ' still has a solution.)<br>No real solution for ' + t('k>' + ct) + '.';
    var p = KP.math(big('Determine all values of ' + t('k') + ' for which ' + t('x+\\frac{k}{x}=' + b) + ' has no real solution.'), check, 'k>' + ct, sol, ['Multiply by ' + t('x') + ' to get a quadratic in ' + t('x') + '.', 'No real roots when the discriminant ' + t('b^{2}-4ac') + ' is negative. Solve that inequality for ' + t('k') + '.'], 'the discriminant: values of k', { keys: 'p67ineq', placeholder: 'e.g. k > 9' });
    p.bad = ['k<' + ct, 'k=' + ct, 'k\\ge ' + ct];
    return p;
  }
  var C3R = [[8, 3], [3, 2], [5, 6], [15, 4], [24, 5], [7, 12], [21, 10]];
  function epC3(r) { // (x + a)/(x − a) − (x − a)/(x + a) = p/q
    var s = pick(function () { var c = r.pick(C3R); return { a: r.int(1, 4), p: c[0], q: c[1], flip: r.chance(0.3) }; }, function (z) { return !(z.a === 1 && z.p === 8 && z.q === 3 && !z.flip); });
    var A1 = [1, s.a], A2 = [1, -s.a], L = s.flip ? [F(1, A2, [[1, s.a]]), F(-1, A1, [[1, -s.a]])] : [F(1, A1, [[1, -s.a]]), F(-1, A2, [[1, s.a]])];
    var W = KT.eq('x', L, [F(1, s.p, [s.q])]);
    return KT.solvePart(CP, 'Solve. ' + t(W.tex), W, ['NPVs ' + t('x\\ne\\pm ' + s.a) + '. The LCD is ' + t(s.q + '(x-' + s.a + ')(x+' + s.a + ')') + '.', 'Expand both squares: most terms cancel. Then factor the quadratic.'], 'a difference of two fractions');
  }

  /* ======================================================================================================
   * The questions
   * ====================================================================================================== */
  var QUESTIONS = [
    { num: '1', parts: [
      { id: '1a', level: 'BEG', make: function (r) { return q1(r, 'a', ['[10,7]']); } },
      { id: '1b', level: 'EMG', make: function (r) { return q1(r, 'b'); } },
      { id: '1c', level: 'PRG', make: function (r) { return q1(r, 'c'); } },
      { id: '1d', level: 'PRG', make: function (r) { return q1(r, 'd'); } }] },
    { num: '2', parts: [
      { id: '2a', level: 'EMG', make: function (r) { return q2a(r, false, true); } },
      { id: '2b', level: 'PRG', make: function (r) { return q2b(r); } }] },
    { num: '3', parts: [
      { id: '3a', level: 'PRG', make: function (r) { return q3(r, 'a'); } },
      { id: '3b', level: 'PRG', make: function (r) { return q3(r, 'b'); } }] },
    { num: '4', shared: function (r) { return q4Shared(r); }, stem: function (s) { return 'Consider ' + t(big(q4Tex(s))) + '.'; }, parts: [
      { id: '4a', level: 'PRG', make: function (r, s) { return q4a(r, s); } },
      { id: '4b', level: 'EMG', make: function (r, s) { return q4b(r, s); } }] },
    { num: '5', parts: [{ id: '5', level: 'ADV', make: function (r) { return q5(r, 'A'); } }] },
    { num: '6', shared: q6Shared, parts: [
      { id: '6a', level: 'PRG', make: function (r) { return q6a(r); } },
      { id: '6b', level: 'ADV', make: function (r, s) { var W = q6W(s); return KT.solvePart(CP, 'Solve. Give exact roots in simplest radical form. ' + t(W.tex), W, H_FORM, 'exact roots: binomial denominators'); } },
      { id: '6c', level: 'EMG', make: function (r, s) { var W = q6W(s); return KT.approxPart(CP, 'Use a graphing calculator to confirm your answers to (b): give the solutions of ' + t(W.tex) + ' to the nearest hundredth.', W.info.irr.vals, 2, 'x', KT.calcSol(W), ['Graph ' + t('Y_1=') + ' the left side and ' + t('Y_2=') + ' the right side, then use <b>intersect</b> at each crossing.'], 'graphing calculator: confirm'); } }] },
    { num: '7', parts: [{ id: '7', level: 'ADV', make: function (r) { return q7(r); } }] },
    { num: '8', parts: [{ id: '8', level: 'ADV', make: function (r) { return q8(r); } }] },
    { num: '9', shared: priyaShared, stem: function (s) { var b = s.r1 + s.r2, p = -s.r1 * s.r2; return 'Priya solved ' + t(big('\\frac{' + p + '}{x}=' + tx(lp(1, -b, 'x')))) + ' by writing “' + t(p + '=' + tx(lp(1, -b, 'x'))) + ', so ' + t('x=' + (p + b)) + '.”'; }, parts: [
      { id: '9a', level: 'EMG', make: function (r, s) {
        var b = s.r1 + s.r2, p = -s.r1 * s.r2, rhs = tx(lp(1, -b, 'x'));
        return KT.mc(r, 'What is her error?', [{ html: 'She removed the denominator without multiplying the right side by ' + t('x') + ': it should be ' + t(p + '=x(' + rhs + ')') + '.', right: true },
          { html: 'She should have multiplied both sides by ' + t(p) + '.', why: 'Multiply by the denominator ' + t('x') + ', not the numerator.', code: 'num' },
          { html: t('x=' + (p + b)) + ' is a non-permissible value.', why: 'The only NPV is ' + t('x=0') + '. The error is in her first step.', code: 'npv' },
          { html: 'There is no error.', why: 'Check ' + t('x=' + (p + b)) + ': ' + t('\\frac{' + p + '}{' + (p + b) + '}\\ne ' + p) + '.', code: 'none' }],
          'She did not multiply the right side by ' + t('x') + '. Multiplying every term by ' + t('x') + ' gives ' + t(p + '=x(' + rhs + ')') + '. (Check ' + t('x=' + (p + b)) + ': ' + t('\\frac{' + p + '}{' + (p + b) + '}\\ne ' + p) + '.)', ['Multiply each side by ' + t('x') + ': what is ' + t('x(' + rhs + ')') + '?'], 'find the error');
      } },
      { id: '9b', level: 'PRG', make: function (r, s) { var W = priyaEq(s); return KT.solvePart(CP, 'Solve the equation correctly.', W, H_QUAD, 'solve correctly'); } }] },
    { num: '10', parts: [{ id: '10', level: 'ADV', make: function (r) { return q10(r); } }] },
    { num: '11', parts: [{ id: '11', level: 'MAS', make: function (r) { return recipPart(r, 'lens'); } }] },
    { num: '12', parts: [{ id: '12', level: 'PRG', make: function (r) {
      var s = pick(function () { return { a: nz(r, 1, 9), c: r.pick([2, 2, 3]) }; }, function (z) { return !(z.a === 3 && z.c === 2); }), a = s.a, c = s.c, d0 = a * (2 - c);
      var W = KT.eq('x', [F(1, [1, 0, -a * a], [[1, -a]])], [F(1, [c, d0], [])]);
      var opts = [{ html: 'no solution', right: true }, { html: t('x=' + a), why: t('x=' + a) + ' is the NPV: it makes the denominator ' + t(0) + '.', code: 'npv' },
        { html: t('x=' + a) + ' or ' + t('x=' + (-a)), why: 'Check each value: ' + t('x=' + (-a)) + ' does not satisfy the equation, and ' + t('x=' + a) + ' is the NPV.', code: 'both' },
        { html: t('x=' + (-a)), why: 'Substitute ' + t('x=' + (-a)) + ': the left side is ' + t(0) + ', the right side is not.', code: 'neg' }];
      return KT.mc(r, 'The solution of ' + t(W.tex) + ' is', opts, W.sol + '<br>(Or: for ' + t('x\\ne ' + a) + ' the left side is ' + t(tx(lp(1, a, 'x'))) + ', and ' + t(tx(lp(1, a, 'x')) + '=' + tx(lp(c, d0, 'x'))) + ' gives ' + t('x=' + a) + ', the NPV.)', H_NONE, 'MC: no solution');
    } }] },
    { num: '13', parts: [{ id: '13', level: 'PRG', make: function (r) {
      var v = r.pick(['a', 'a', 'x', 'm', 't']), s = pick(function () { return { b: nz(r, 1, 6), rr: r.int(-6, 6) }; }, function (z) { var c = z.rr + 2 * z.b; return c !== 0 && z.rr !== z.b && z.rr !== -z.b && !(z.b === 2 && z.rr === 0); });
      var b = s.b, c = s.rr + 2 * b, W = KT.eq(v, [F(1, [1, 0], [[1, -b]]), sgnF(-c, c, [[1, b]])], [F(1, 2 * b * b, [[1, -b], [1, b]])]);
      var vr = v + '=' + s.rr, vb = v + '=' + b;
      var opts = [{ html: t(vr) + ' only', right: true }, { html: t(vr) + ' and ' + t(vb), why: t(vb) + ' is an NPV: reject it.', code: 'extr' }, { html: t(vb) + ' only', why: t(vb) + ' is the root that is rejected (an NPV); ' + t(vr) + ' is permissible.', code: 'swap' }, { html: 'no solution', why: 'Only one root is rejected: ' + t(vr) + ' is permissible and checks.', code: 'none' }];
      return KT.mc(r, 'The solution(s) of ' + t(W.tex) + ' is (are)', opts, W.sol, H_EXTR, 'MC: one root rejected');
    } }] },
    { num: '14', parts: [{ id: '14', level: 'MAS', make: function (r) {
      var s = pick(function () { return { a: nz(r, 1, 6), u: nz(r, 1, 5) }; }, function (z) { var N = z.u * z.u + 2 * z.u * z.a, k = N > 0 ? ex.nthFactor(N, 2) : 0; return N > 1 && k * k !== N && !(z.a === 1 && z.u === 1) && N / (k * k) < 60; });
      var W = KT.eq('x', [F(1, [1, 0], [[1, s.a]])], [sgnF(2 * s.u, 2 * s.u, [X])], { cross: true });
      return radMC(r, 'The roots of ' + t(W.tex) + ' are', W, 'MC: exact roots');
    } }] },
    { num: '15', parts: [{ id: '15', level: 'ADV', make: function (r) { return q15(r); } }] },
    { num: '16', parts: [{ id: '16', level: 'ADV', make: function (r) { return q16(r); } }] }
  ];

  var EXTRA = [
    { num: 'A1', section: 'A. Skills', parts: [
      { id: 'A1a', level: 'BEG', make: function (r) { return q1(r, 'a', ['[10,7]']); } },
      { id: 'A1b', level: 'EMG', make: function (r) { return q2a(r, true, false); } },
      { id: 'A1c', level: 'PRG', make: function (r) { return epA1c(r); } }] },
    { num: 'A2', parts: [
      { id: 'A2a', level: 'PRG', make: function (r) { var s = q4Shared(r); return q4a(r, s, 'State the NPVs and solve. Reject any extraneous root. ' + t(q4Tex(s))); } },
      { id: 'A2b', level: 'PRG', make: function (r) { return q3(r, 'a', [sig([-1, -2, 1, 3])]); } }] },
    { num: 'A3', parts: [{ id: 'A3', level: 'PRG', make: function (r) { return epA3(r); } }] },
    { num: 'A4', parts: [{ id: 'A4', level: 'ADV', make: function (r) { return epA4(r); } }] },
    { num: 'B1', section: 'B. Applying', parts: [{ id: 'B1', level: 'ADV', make: function (r) { return q5(r, 'B'); } }] },
    { num: 'B2', parts: [{ id: 'B2', level: 'PRG', make: function (r) { return epB2(r); } }] },
    { num: 'B3', parts: [{ id: 'B3', level: 'MAS', make: function (r) { return recipPart(r, 'res'); } }] },
    { num: 'B4', parts: [{ id: 'B4', level: 'ADV', make: function (r) { return epB4(r); } }] },
    { num: 'B5', parts: [{ id: 'B5', level: 'ADV', make: function (r) { return epB5(r); } }] },
    { num: 'C1', section: 'C. Stretch', parts: [{ id: 'C1', level: 'MAS', make: function (r) { return epC1(r); } }] },
    { num: 'C2', parts: [{ id: 'C2', level: 'MAS', make: function (r) { return epC2(r); } }] },
    { num: 'C3', parts: [{ id: 'C3', level: 'MAS', make: function (r) { return epC3(r); } }] }
  ];

  HW.defineLesson({ id: LID, unit: 6, num: '8', title: 'Rational Equations That Lead to Quadratics', outcome: 'AN6', calc: true, questions: QUESTIONS, extra: EXTRA });
})(window);
