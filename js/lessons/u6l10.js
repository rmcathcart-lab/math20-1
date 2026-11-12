/* Math 20-1 · Unit 6 · Lesson 10 — Unit 6 Review (outcome per part: AN4 equivalent forms — NPVs, simplifying;
 * AN5 operations — multiplying, dividing, adding, subtracting; AN6 rational equations and their problems)
 * Assignment 10, a practice test (u6_l10.tex, Questions 1–27) and the Lesson 10 Extra Practice, a second practice test
 * (u6_ep10.tex: Multiple Choice 1–10, Numerical Response 11–14, Written Response 15–18). Extra ids start with E.
 * Every part is a generator: the booklet question's idea, form and difficulty with new numbers (the lesson's example
 * numbers and the booklet's own numbers are left out where feasible). Calculator allowed; answers exact (simplest
 * rational expressions, NPVs, exact roots), "to the nearest hundredth" where the booklet asks.
 *
 * Built on (lazily, inside the generators: the test runners load files alphabetically, so this file loads before the
 * others): the Unit 6 assessment kit HW.u6assess (js/lessons/u6test.js: NPVs, evaluating, simplifying, multiplying,
 * dividing, adding and subtracting, equations — the unit test's builders, here with u6l10- codes), the adding kit
 * HW.u6k56 (u6l5.js: a two-variable monomial sum) and the Lesson 9 problem kit HW.p69 (u6l9.js: number, motion and work
 * problems; it registers its codes under u6l10- too).
 * Added here: the review's multiple choice (opposite binomials, an equivalent expression, NPVs of a division and after
 * simplifying, simplest forms, a difference with a minus sign, the equation after multiplying by the LCD, an extraneous
 * root, no solution, a work equation), "write the sum as (ax + b)/…" and "3/(x − 4) = (ax + b)/(x² − 2x − 8)" as two
 * boxes (a, b), one fraction on each side that cross-multiplies to a linear equation, and the positive root to the
 * nearest hundredth (numerical response).
 * Conversions: "explain the error" (Kim) → multiple choice of explanations; "what is missing, and why" (Raj) → the NPVs
 * of the original expression (his "x ≠ 0" recognised); 1(e) "evaluate, and explain why it cannot be evaluated" → evaluate
 * (or "undefined"); EP C4 "explain why one root is rejected" → in the solution; NR digit boxes → a, b boxes.
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: 13, 25, Extra 17(b), 18. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, KP = K.P, ex = HW.ex, t = K.t, F = HW.fmt;
  var LID = 'u6l10', CP = LID + '-', AN4 = 'AN4', AN5 = 'AN5', AN6 = 'AN6';

  /* the assessment kit's codes, under this lesson's prefix (HW.p69 registers its own u6l10- codes) */
  (function () {
    var BASE = {
      'npv-cancel': ['NPVs taken from the simplified expression (a divided-out factor’s NPV missing)', 's'], 'npv-div': ['Division: left out the NPVs from the divisor’s numerator', 's'],
      'npv-num': ['Used a numerator’s zero as an NPV', 'b'], 'npv-missing': ['Missed an NPV', 's'], 'npv-extra': ['Listed a value that is not an NPV', 's'],
      'npv-sign': ['NPVs with the wrong signs', 'b'], 'npv-wrong': ['Right expression, NPVs wrong or missing', 'b'], 'npv-one': ['Only the NPVs of one denominator', 'b'],
      'ev-undef': ['Evaluating: undefined / defined mixed up', 'n'], 'ev-slip': ['Evaluating: substitution slip', 's'],
      'mono-exp': ['Monomials: a power in the wrong part of the fraction', 'b'], 'mono-coef': ['Monomials: coefficients not divided correctly', 's'],
      'opp-sign': ['Opposite factors: lost the −1', 'b'], 'terms': ['Divided out terms instead of factors', 'n'],
      'div-noflip': ['Division: multiplied by the divisor instead of its reciprocal', 'n'], 'div-flipfirst': ['Division: flipped the first fraction instead of the divisor', 'n'],
      'add-straight': ['Added the numerators and added the denominators', 'n'], 'sub-sign': ['Subtraction: minus not applied to every term of the second numerator', 'b'],
      'lcd-num': ['Changed a denominator to the LCD without multiplying its numerator', 'n'], 'whole-lcd': ['Whole-number term not multiplied by the LCD', 'b'],
      'eq-extr': ['Kept an extraneous root (an NPV)', 'b'], 'eq-rejvalid': ['Rejected a root that checks', 's'], 'eq-nosol': ['Said “no solution” when there is one', 'n'],
      'eq-oneterm': ['Did not multiply every term by the LCD', 'n'], 'eq-missing': ['Found only one of the two roots', 's'], 'eq-sign': ['Root(s) with the wrong sign', 's'],
      'neg-root': ['Kept the inadmissible (negative) root', 's'], 'nocancel': ['Multiplied out but did not divide out any common factor', 'b'],
      'ab-swap': ['a and b in each other’s boxes', 's'], 'ab-lcd': ['a, b: a numerator not multiplied by the factor its denominator is missing', 'n']
    };
    var c = {}, p = {};
    Object.keys(BASE).forEach(function (k) { c[CP + k] = BASE[k][0]; p[CP + k] = BASE[k][1]; });
    ['opp', 'equiv', 'npvdiv', 'npv', 'simp', 'sum', 'lcd', 'extr', 'nosol', 'work', 'kim', 'prod'].forEach(function (k) { c['mc-' + CP + k] = 'MC: ' + ({ opp: 'opposite binomials', equiv: 'an equivalent expression', npvdiv: 'NPVs of a division', npv: 'NPVs', simp: 'simplest form', sum: 'a sum or difference', lcd: 'the equation after multiplying by the LCD', extr: 'the extraneous root', nosol: 'no solution', work: 'a work equation', kim: 'dividing out terms', prod: 'a product' })[k] + ' (wrong choice)'; p['mc-' + CP + k] = 'n'; });
    HW.addCodes(c); HW.addPartial(p);
  })();

  function A6() { if (!HW.u6assess) throw new Error('u6l10.js needs js/lessons/u6test.js (HW.u6assess)'); return HW.u6assess; }
  function B6() { return A6().B; }
  function P9() { if (!HW.p69) throw new Error('u6l10.js needs js/lessons/u6l9.js (HW.p69)'); return HW.p69; }
  function U56() { if (!HW.u6k56) throw new Error('u6l10.js needs js/lessons/u6l5.js (HW.u6k56)'); return HW.u6k56; }
  function gcd(a, b) { return ex.gcd(Math.abs(a), Math.abs(b)); }
  function lcm(a, b) { return Math.abs(a) / gcd(a, b) * Math.abs(b); }
  function pickWhere(gen, test) { for (var i = 0; i < 20000; i++) { var o = gen(); if (o && test(o)) return o; } throw new Error('u6l10: no instance found'); }
  function lt(v, c) { return c === 0 ? v : v + (c > 0 ? '+' : '-') + F(Math.abs(c)); }
  function pt(cs, v) {
    var d = cs.length - 1, out = '';
    cs.forEach(function (c, i) { var e = d - i; if (c === 0) return; var first = out === ''; if (e === 0) out += (c > 0 && !first ? '+' : c < 0 ? '-' : '') + F(Math.abs(c)); else out += (c === 1 ? (first ? '' : '+') : c === -1 ? '-' : (c > 0 && !first ? '+' : '') + F(c)) + v + (e > 1 ? '^{' + e + '}' : ''); });
    return out || '0';
  }
  function fr(p, q) { return ex.texRat(ex.norm(p, q)); }
  function df(n, d) { return '\\dfrac{' + n + '}{' + d + '}'; }
  function vr(r) { return r.pick(['x', 'x', 'x', 'a', 'm', 't']); }
  function nzr(r, lo, hi) { return (r.chance(0.5) ? -1 : 1) * r.int(lo, hi); }
  function distinct(arr) { return arr.every(function (x, i) { return arr.indexOf(x) === i; }); }
  function mc(r, prompt, opts, sol, hints, text) {
    var seen = {}; opts.forEach(function (o) { if (seen[o.html]) throw new Error('u6l10 mc: two options read the same: ' + o.html); seen[o.html] = 1; });
    return KP.mc(r, prompt, opts, sol, hints, text);
  }
  function npvList(v, vals) { return t(v + '\\ne ' + vals.map(function (x) { return typeof x === 'string' ? x : F(x); }).join(',\\ ')); }
  function rt(q) { return ex.texRat(ex.norm(q[0], q[1])); }

  /* ======================================================================================================
   * Multiple choice and two-box parts (AN4, AN5)
   * ====================================================================================================== */
  /* (x − a)/(a − x) (#3) */
  function oppMC(r) {
    var v = vr(r), a = r.int(2, 9), sw = r.chance(0.5);
    var nT = sw ? a + '-' + v : v + '-' + a, dT = sw ? v + '-' + a : a + '-' + v;
    return mc(r, 'For ' + t(v + '\\ne ' + a) + ', the expression ' + t(df(nT, dT)) + ' is equal to', [
      { html: t('-1'), right: true }, { html: t('1'), why: 'The two binomials are opposites, not equal: ' + t(dT + '=-(' + nT + ')') + '.', code: CP + 'opp' },
      { html: t('0'), why: 'The numerator is ' + t(0) + ' only at ' + t(v + '=' + a) + ', which is not allowed. Factor out ' + t('-1') + '.', code: CP + 'opp' },
      { html: t(nT), why: 'Divide the whole numerator by the whole denominator: ' + t(dT + '=-(' + nT + ')') + '.', code: CP + 'opp' }],
      t(dT + '=-(' + nT + ')') + ', so ' + t(df(nT, '-(' + nT + ')') + '=-1') + '.', ['Take out ' + t('-1') + ' from the denominator.'], 'MC: opposite binomials');
  }
  /* Kim's error: (x + kb)/(x + b) = k (#4a) */
  function kimMC(r) {
    var b = r.int(2, 6), k = r.int(2, 4), a = k * b, x0 = pickWhere(function () { return r.int(1, 5); }, function (x) { return x !== b; }), nm = r.pick(['Kim', 'Ana', 'Theo', 'Jas']);
    if (b === 3 && k === 2) b = 4, a = 8;
    var val = ex.norm(x0 + a, x0 + b);
    return mc(r, nm + ' wrote ' + t(df('x+' + a, 'x+' + b) + '=' + k) + '. Which statement is correct?', [
      { html: nm + ' divided out the <b>terms</b> ' + t('x') + ' and ' + t(b) + '; only common <b>factors</b> can be divided out. The expression is already in simplest form.', right: true },
      { html: 'Nothing is wrong: ' + t(a + '\\div ' + b + '=' + k) + ', so the answer is right for every ' + t('x\\ne -' + b) + '.', why: 'Test it: at ' + t('x=' + x0) + ' the expression is ' + t(rt(val)) + ', not ' + t(k) + '.', code: CP + 'kim' },
      { html: 'The answer should be ' + t(k + 'x') + ': the ' + t('x') + ' terms stay.', why: 'Nothing divides out at all: ' + t('x+' + a) + ' and ' + t('x+' + b) + ' share no factor.', code: CP + 'kim' },
      { html: 'The answer should be ' + t('\\frac{' + a + '}{' + b + '}') + ' only when ' + t('x=0') + ', so it is right for every ' + t('x') + '.', why: 'It is only equal at one value of ' + t('x') + '. Simplifying must give an expression equal for <b>every</b> permissible value.', code: CP + 'kim' }],
      'Only common factors divide out; ' + t('x') + ' and ' + t(b) + ' are terms of the sum ' + t('x+' + b) + '. Test with ' + t('x=' + x0) + ': ' + t(df(x0 + a, x0 + b) + '=' + rt(val) + '\\ne ' + k) + '. The expression is already in simplest form (' + t('x\\ne -' + b) + ').',
      ['Substitute a value such as ' + t('x=' + x0) + ' into both sides.'], 'MC: dividing out terms');
  }
  /* Raj: (x² − c²)/(x² − cx) = (x + c)/x, "x ≠ 0" (#4b) */
  function rajNPV(r) {
    var c = r.int(2, 9), nm = r.pick(['Raj', 'Liam', 'Mia', 'Sofia']);
    if (c === 2) c = r.pick([3, 5, 6]);
    var sol = 'The original denominator is ' + t('x^{2}-' + c + 'x=x(x-' + c + ')') + ', which is ' + t(0) + ' at ' + t('x=0') + ' <b>and</b> at ' + t('x=' + c) + '. NPVs come from the original expression, before ' + t('x-' + c) + ' is divided out: ' + t('x\\ne 0,\\ ' + c) + '.';
    return A6().npvPart(CP, nm + ' simplified ' + t(df('x^{2}-' + c * c, 'x^{2}-' + c + 'x')) + ' to ' + t(df('x+' + c, 'x')) + ' and wrote “' + t('x\\ne 0') + '”. State all the non-permissible values.', { x: [0, c] }, { v: 'x', nw: [{ vals: { x: [[0, 1]] }, code: CP + 'npv-cancel', hint: 'That is ' + nm + '’s answer. The original denominator ' + t('x(x-' + c + ')') + ' is ' + t(0) + ' at another value too.' }, { vals: { x: [[0, 1], [c, 1], [-c, 1]] }, code: CP + 'npv-num', hint: t('x=-' + c) + ' only makes the numerator ' + t(0) + ': that is allowed.' }] }, sol,
      ['Factor the <b>original</b> denominator.', 'Each factor gives an NPV, even one that divides out.'], 'NPVs before dividing out');
  }
  /* an equivalent expression (#6) */
  function equivMC(r) {
    var s = pickWhere(function () { return { a: r.int(1, 7), b: r.int(1, 7), c: r.int(2, 6) }; }, function (z) { return distinct([z.a, z.b, z.c]) && !(z.a === 2 && z.b === 3 && z.c === 1); });
    var a = s.a, b = s.b, c = s.c;
    var right = df(pt([1, a + c, a * c], 'x'), pt([1, c - b, -b * c], 'x'));
    return mc(r, 'Which expression is equivalent to ' + t(df('x+' + a, 'x-' + b)) + ' for ' + t('x\\ne -' + c + ',\\ ' + b) + '?', [
      { html: t(df('x+' + (a + c), 'x' + (c - b === 0 ? '' : (c - b > 0 ? '+' : '-') + Math.abs(c - b)))), why: 'Adding the same number to the numerator and the denominator changes the value.', code: CP + 'equiv' },
      { html: t(df(c + 'x+' + a, c + 'x-' + b)), why: 'Every <b>term</b> must be multiplied, not only the ' + t('x') + ' terms.', code: CP + 'equiv' },
      { html: t(right), right: true },
      { html: t(df('x^{2}+' + a, 'x^{2}-' + b)), why: 'Squaring only the ' + t('x') + ' terms does not keep the value.', code: CP + 'equiv' }],
      t(right + '=' + df('(x+' + a + ')(x+' + c + ')', '(x-' + b + ')(x+' + c + ')')) + ': the original multiplied by ' + t(df('x+' + c, 'x+' + c) + '=1') + '.',
      ['Factor each option. Which one is the original times ' + t('\\frac{\\text{something}}{\\text{the same thing}}') + '?'], 'MC: an equivalent expression');
  }
  /* the NPVs of a division, MC (#8, EP 6) */
  function npvDivMC(r, ep) {
    var v = 'x', s = pickWhere(function () { return { a: r.int(1, 8), b: r.int(1, 8), c: r.int(1, 8), d: r.int(1, 8) }; }, function (z) { return distinct([z.a, z.b, z.c, z.d]) && !(z.a === 2 && z.b === 5 && z.c === 3 && z.d === 1); });
    var a = s.a, b = s.b, c = s.c, d = s.d, expr, opts, sol;
    if (ep) { // x/(x + a) ÷ (x − b)/(x − c)
      expr = df('x', 'x+' + a) + '\\div ' + df('x-' + b, 'x-' + c);
      opts = [{ html: t('-' + a + ',\\ ' + c) + ' only', why: 'The divisor cannot be ' + t(0) + ' either: its numerator gives ' + t('x=' + b) + '.', code: CP + 'npvdiv' },
        { html: t('-' + a + ',\\ ' + b) + ' only', why: 'The second denominator gives ' + t('x=' + c) + ' too.', code: CP + 'npvdiv' },
        { html: t('-' + a + ',\\ ' + c + ',\\ ' + b), right: true },
        { html: t('0,\\ -' + a + ',\\ ' + c + ',\\ ' + b), why: t('x=0') + ' only makes the first numerator ' + t(0) + ': that is allowed.', code: CP + 'npvdiv' }];
      sol = 'The denominators give ' + t('x\\ne -' + a + ',\\ ' + c) + '; the divisor’s numerator gives ' + t('x\\ne ' + b) + '.';
    } else { // (x + a)/(x − b) ÷ (x − c)/(x + d)
      expr = df('x+' + a, 'x-' + b) + '\\div ' + df('x-' + c, 'x+' + d);
      opts = [{ html: t(b + ',\\ -' + d) + ' only', why: 'The divisor cannot be ' + t(0) + ': its numerator gives ' + t('x=' + c) + '.', code: CP + 'npvdiv' },
        { html: t(b + ',\\ ' + c) + ' only', why: 'The second denominator gives ' + t('x=-' + d) + ' too.', code: CP + 'npvdiv' },
        { html: t('-' + a + ',\\ ' + b + ',\\ ' + c + ',\\ -' + d), why: t('x=-' + a) + ' only makes the expression ' + t(0) + ': that is allowed.', code: CP + 'npvdiv' },
        { html: t(b + ',\\ -' + d + ',\\ ' + c), right: true }];
      sol = 'The denominators give ' + t('x\\ne ' + b + ',\\ -' + d) + '; the divisor’s numerator gives ' + t('x\\ne ' + c) + '. (' + t('-' + a) + ' only makes the expression ' + t(0) + '.)';
    }
    void v;
    return mc(r, 'The non-permissible values of ' + t(expr) + ' are', opts, sol, ['Every denominator gives NPVs, and so does the divisor’s numerator (it becomes a denominator when you flip it).'], 'MC: NPVs of a division');
  }
  /* p/(x + u) ± q/(x + v) = (ax + b)/((x + u)(x + v)): a and b (#10, EP 11) */
  function abSum(r, ep) {
    var s = pickWhere(function () { return ep ? { u: nzr(r, 1, 6), w: nzr(r, 1, 6), p: r.int(2, 9), q: r.int(1, 9), sub: true } : { u: 0, w: r.int(1, 6), p: r.int(2, 9), q: r.int(1, 9), sub: r.chance(0.3) }; }, function (z) {
      z.a = z.p + (z.sub ? -z.q : z.q); z.b = z.p * z.w + (z.sub ? -z.q * z.u : z.q * z.u);
      return z.u !== z.w && z.a > 0 && z.b > 0 && z.a < 10 && z.b < 100 && z.p !== z.q && !(z.u === 0 && z.w === 1 && z.p === 3 && z.q === 2) && !(z.u === -3 && z.w === 1 && z.p === 4 && z.q === 2) && gcd(z.a, z.b) >= 1;
    });
    var X = function (c) { return c === 0 ? 'x' : lt('x', c); }, D1 = X(s.u), D2 = X(s.w), op = s.sub ? '-' : '+';
    var lcdT = (s.u === 0 ? 'x' : '(' + D1 + ')') + '(' + D2 + ')';
    var sumT = df(s.p, D1) + op + df(s.q, D2);
    var bWrong = s.p * s.w + (s.sub ? s.q * s.u : -s.q * s.u);
    var sol = t(sumT + '=' + df(s.p + '(' + D2 + ')' + op + s.q + (s.u === 0 ? 'x' : '(' + D1 + ')'), lcdT) + '=' + df(pt([s.a, s.b], 'x'), lcdT)) + ', so ' + t('a=' + s.a) + ' and ' + t('b=' + s.b) + '.';
    var p = P9().boxesN('<i>(Numerical Response)</i> The ' + (s.sub ? 'difference' : 'sum') + ' ' + t(sumT) + ' can be written as ' + t(df('ax+b', lcdT)) + '. Determine ' + t('a') + ' and ' + t('b') + '.', [
      { label: t('a='), name: 'a', ans: s.a, diag: function (v) { if (v === s.p + s.q && s.sub) return { code: CP + 'sub-sign', hint: 'Subtract: the minus sign applies to the whole second numerator.' }; return null; } },
      { label: t('b='), name: 'b', ans: s.b, diag: function (v) { if (v === bWrong) return { code: CP + 'sub-sign', hint: 'Check the sign: ' + (s.sub ? 'the minus sign applies to every term of ' + t(s.q + '(' + D1 + ')') : 'expand ' + t(s.q + '(' + D1 + ')') + ' carefully') + '.' }; if (v === s.p) return { code: CP + 'ab-lcd', hint: 'Multiply each numerator by the factor its denominator is missing before you combine.' }; return null; }, bad: [bWrong] }], sol,
      ['The LCD is ' + t(lcdT) + '. Multiply each numerator by the factor its denominator is missing.', 'Expand, collect like terms and read off ' + t('a') + ' (the ' + t('x') + ' coefficient) and ' + t('b') + ' (the constant).'], 'NR: a sum as (ax + b)/LCD');
    return p;
  }
  /* p/(x − u) = (ax + b)/((x − u)(x + v)) expanded (#14) */
  function abEquiv(r) {
    var s = pickWhere(function () { return { p: r.int(2, 9), u: nzr(r, 1, 8), w: nzr(r, 1, 8) }; }, function (z) { return z.u !== -z.w && !(z.p === 3 && z.u === 4 && z.w === 2) && z.p * Math.abs(z.w) < 100 && z.u !== z.w; });
    var D = pt([1, s.w - s.u, -s.u * s.w], 'x'), a = s.p, b = s.p * s.w;
    var sol = t(D + '=(' + lt('x', -s.u) + ')(' + lt('x', s.w) + ')') + ', so multiply by ' + t(df(lt('x', s.w), lt('x', s.w))) + ': ' + t(df(s.p + '(' + lt('x', s.w) + ')', '(' + lt('x', -s.u) + ')(' + lt('x', s.w) + ')') + '=' + df(pt([a, b], 'x'), D)) + '. ' + t('a=' + a) + ', ' + t('b=' + b) + '.';
    return P9().boxesN('<i>(Numerical Response)</i> ' + t(df(s.p, lt('x', -s.u)) + '=' + df('ax+b', D)) + ' for all permissible values of ' + t('x') + '. Determine ' + t('a') + ' and ' + t('b') + '.', [
      { label: t('a='), name: 'a', ans: a }, { label: t('b='), name: 'b', ans: b, diag: function (v) { if (v === -b) return { code: CP + 'sub-sign', hint: 'Check the sign of the missing factor: factor ' + t(D) + ' carefully.' }; if (v === s.p * -s.u || v === s.w) return { code: CP + 'ab-lcd', hint: 'Find the factor that ' + t(lt('x', -s.u)) + ' is missing, then multiply the numerator ' + t(s.p) + ' by it.' }; return null; }, bad: [-b] }], sol,
      ['Factor the trinomial denominator.', 'Multiply the numerator and the denominator by the missing factor.'], 'NR: an equivalent form (a, b)');
  }
  /* p/x − q/x² (#12); p/(qx) + m/x² (EP 7) */
  function sumMC(r, ep) {
    var v = 'x', s;
    if (!ep) {
      s = pickWhere(function () { return { p: r.int(2, 9), q: r.int(1, 9) }; }, function (z) { return z.p !== z.q && !(z.p === 2 && z.q === 3); });
      var pq = s.p - s.q;
      return mc(r, 'In simplest form, ' + t(df(s.p, v) + '-' + df(s.q, v + '^{2}')) + ' is', [
        { html: t(df(pq, v + '-' + v + '^{2}')), why: 'Denominators are not subtracted. Use the LCD ' + t(v + '^{2}') + '.', code: CP + 'sum' },
        { html: t(df(pq, v + '^{2}')), why: 'Multiply the first numerator by ' + t(v) + ' when you change its denominator to ' + t(v + '^{2}') + '.', code: CP + 'sum' },
        { html: t(df(s.p + v + '-' + s.q, v + '^{2}')), right: true },
        { html: t(df(s.p + '-' + s.q + v, v + '^{2}')), why: 'The ' + t(v) + ' goes with the first fraction (the one over ' + t(v) + ').', code: CP + 'sum' }],
        'LCD ' + t(v + '^{2}') + ': ' + t(df(s.p + v, v + '^{2}') + '-' + df(s.q, v + '^{2}') + '=' + df(s.p + v + '-' + s.q, v + '^{2}')) + ', ' + t(v + '\\ne 0') + '.', ['The LCD is ' + t(v + '^{2}') + '. Which numerator must be multiplied by ' + t(v) + '?'], 'MC: a difference over monomials');
    }
    s = pickWhere(function () { return { p: r.int(1, 7), q: r.int(2, 6), m: r.int(1, 5) }; }, function (z) { return gcd(z.p, z.q) === 1 && !(z.p === 2 && z.q === 3 && z.m === 1) && gcd(gcd(z.p, z.q * z.m), z.q) === 1; });
    var qm = s.q * s.m;
    return mc(r, 'The sum ' + t(df(s.p, s.q + v) + '+' + df(s.m, v + '^{2}')) + ' is', [
      { html: t(df(s.p + s.m, s.q + v + '+' + v + '^{2}')), why: 'Denominators are not added. Use the LCD ' + t(s.q + v + '^{2}') + '.', code: CP + 'sum' },
      { html: t(df((s.p === 1 ? '' : s.p) + v + '+' + qm, s.q + v + '^{2}')), right: true },
      { html: t(df(s.p + s.m, s.q + v + '^{3}')), why: 'The LCD has the highest power of ' + t(v) + ', ' + t(v + '^{2}') + ', not the product of the powers.', code: CP + 'sum' },
      { html: t(df(s.p + s.m, s.q + v + '^{2}')), why: 'Multiply each numerator by what its denominator was multiplied by.', code: CP + 'sum' }],
      'LCD ' + t(s.q + v + '^{2}') + ': ' + t(df(s.p + v, s.q + v + '^{2}') + '+' + df(qm, s.q + v + '^{2}') + '=' + df((s.p === 1 ? '' : s.p) + v + '+' + qm, s.q + v + '^{2}')) + ', ' + t(v + '\\ne 0') + '.', ['The LCD is ' + t(s.q + v + '^{2}') + '.'], 'MC: a sum over monomials');
  }
  /* a/(x + b) − (x − c)/(x + b) (EP 8) */
  function diffMC(r) {
    var s = pickWhere(function () { return { a: r.int(2, 9), b: r.int(1, 9), c: r.int(1, 9) }; }, function (z) { return z.a !== z.c && z.a + z.c !== z.b && !(z.a === 3 && z.b === 2 && z.c === 1); });
    var D = 'x+' + s.b;
    return mc(r, 'The difference ' + t(df(s.a, D) + '-' + df('x-' + s.c, D)) + ' is', [
      { html: t(df((s.a + s.c) + '-x', D)), right: true },
      { html: t(df(s.a - s.c === 0 ? '-x' : (s.a - s.c) + '-x', D)), why: 'Brackets: ' + t(s.a + '-(x-' + s.c + ')=' + s.a + '-x+' + s.c) + '. The minus sign applies to every term.', code: CP + 'sum' },
      { html: t(df('x-' + (s.a + s.c), D)), why: 'Check the sign: the ' + t('x') + ' term is subtracted.', code: CP + 'sum' },
      { html: t(df((s.a + s.c) + '-x', '0')), why: 'The denominators are the same: keep the denominator, combine the numerators.', code: CP + 'sum' }],
      t(df(s.a + '-(x-' + s.c + ')', D) + '=' + df(s.a + '-x+' + s.c, D) + '=' + df((s.a + s.c) + '-x', D)) + ', ' + t('x\\ne -' + s.b) + '.', ['Put the second numerator in brackets before you subtract.'], 'MC: subtracting a binomial numerator');
  }
  /* NPVs of (x − a)/(x² + …) (EP 1) */
  function npvMC(r) {
    var s = pickWhere(function () { return { a: r.int(1, 9), p: r.int(1, 8), q: r.int(1, 8) }; }, function (z) { return distinct([z.a, z.p, z.q]) && z.a !== -z.p && !(z.a === 2 && z.p === 5 && z.q === 3); });
    var a = s.a, p = s.p, q = s.q, Dt = pt([1, p - q, -p * q], 'x');
    return mc(r, 'The non-permissible values of ' + t(df('x-' + a, Dt)) + ' are', [
      { html: t(a + ',\\ -' + p + ',\\ ' + q), why: 'The numerator’s zero, ' + t(a) + ', is permitted.', code: CP + 'npv' },
      { html: t('-' + p + ',\\ ' + q), right: true },
      { html: t(p + ',\\ -' + q), why: 'Check the signs: ' + t('x+' + p + '=0') + ' gives ' + t('x=-' + p) + '.', code: CP + 'npv' },
      { html: t(a) + ' only', why: 'Only the denominator matters.', code: CP + 'npv' }],
      t(Dt + '=(x+' + p + ')(x-' + q + ')') + ': ' + t('x\\ne -' + p + ',\\ ' + q) + '. (The numerator’s zero, ' + t(a) + ', is permitted.)', ['Factor the denominator; each factor gives an NPV.'], 'MC: NPVs');
  }
  /* simplest form (EP 2, EP 3) */
  function simpMC(r, kind) {
    if (kind === 'tri') { // (x − p)(x − q)/((x − q)(x + q)) = (x − p)/(x + q)
      var s = pickWhere(function () { return { p: r.int(1, 9), q: r.int(1, 9) }; }, function (z) { return z.p !== z.q && !(z.p === 5 && z.q === 2); });
      var N = pt([1, -(s.p + s.q), s.p * s.q], 'x'), D = 'x^{2}-' + s.q * s.q;
      return mc(r, 'In simplest form, ' + t(df(N, D)) + ' is', [
        { html: t(df('x-' + s.p, 'x+' + s.q)), right: true },
        { html: t(df('x+' + s.p, 'x-' + s.q)), why: 'Check the signs of the factors: ' + t(N + '=(x-' + s.p + ')(x-' + s.q + ')') + '.', code: CP + 'simp' },
        { html: t(df(pt([-(s.p + s.q), s.p * s.q], 'x'), -(s.q * s.q))), why: 'The ' + t('x^{2}') + ' terms are terms, not factors: they cannot be divided out.', code: CP + 'simp' },
        { html: t(df('x-' + s.p, 'x-' + s.q)), why: 'The common factor ' + t('x-' + s.q) + ' divides out of both; the denominator keeps ' + t('x+' + s.q) + '.', code: CP + 'simp' }],
        t(df('(x-' + s.p + ')(x-' + s.q + ')', '(x-' + s.q + ')(x+' + s.q + ')') + '=' + df('x-' + s.p, 'x+' + s.q)) + ', ' + t('x\\ne\\pm ' + s.q) + '.', ['Factor the numerator and the denominator, then divide out the common factor.'], 'MC: simplest form');
    }
    var z = pickWhere(function () { return { k: r.int(2, 5), a: r.int(2, 9) }; }, function (q) { return !(q.k === 2 && q.a === 4); }); // (ka − kx)/(x² − a²) = −k/(x + a)
    var N = z.k * z.a + '-' + z.k + 'x', D = 'x^{2}-' + z.a * z.a;
    return mc(r, 'In simplest form, ' + t(df(N, D)) + ' is', [
      { html: t(df(z.k, 'x+' + z.a)), why: 'You lost the ' + t('-1') + ': ' + t(z.a + '-x=-(x-' + z.a + ')') + '.', code: CP + 'simp' },
      { html: t('-' + df(z.k, 'x-' + z.a)), why: 'The factor ' + t('x-' + z.a) + ' divides out; ' + t('x+' + z.a) + ' stays.', code: CP + 'simp' },
      { html: t('-' + df(z.k, 'x+' + z.a)), right: true },
      { html: t(df(z.k, 'x-' + z.a)), why: 'The factor ' + t('x-' + z.a) + ' divides out, and the opposite factor leaves ' + t('-1') + '.', code: CP + 'simp' }],
      t(df('-' + z.k + '(x-' + z.a + ')', '(x-' + z.a + ')(x+' + z.a + ')') + '=-' + df(z.k, 'x+' + z.a)) + ', ' + t('x\\ne\\pm ' + z.a) + '.', ['Take out ' + t('-' + z.k) + ' from the numerator so it has the factor ' + t('x-' + z.a) + '.'], 'MC: simplest form with opposites');
  }
  /* NPVs when (x² − a²)/(x² − ax) is simplified to (x + a)/x (EP 4) */
  function npvSimpMC(r) {
    var a = pickWhere(function () { return r.int(2, 9); }, function (x) { return x !== 3; });
    return mc(r, 'When ' + t(df('x^{2}-' + a * a, 'x^{2}-' + a + 'x')) + ' is simplified to ' + t(df('x+' + a, 'x')) + ', the non-permissible values are', [
      { html: t('x\\ne 0') + ' only', why: 'That uses the simplified expression. The original denominator ' + t('x(x-' + a + ')') + ' is ' + t(0) + ' at ' + t('x=' + a) + ' too.', code: CP + 'npv' },
      { html: t('x\\ne 0,\\ ' + a), right: true },
      { html: t('x\\ne -' + a + ',\\ 0'), why: t('x=-' + a) + ' only makes the numerator ' + t(0) + '.', code: CP + 'npv' },
      { html: t('x\\ne\\pm ' + a + ',\\ 0'), why: 'Only the denominator ' + t('x(x-' + a + ')') + ' matters: ' + t('x=-' + a) + ' is permitted.', code: CP + 'npv' }],
      'The original denominator ' + t('x(x-' + a + ')') + ' is ' + t(0) + ' at ' + t('x=0') + ' and ' + t('x=' + a) + ': ' + t('x\\ne 0,\\ ' + a) + '.', ['NPVs come from the original denominator.'], 'MC: NPVs after simplifying');
  }
  /* a product that simplifies to (x − q)/x (EP 5) */
  function prodMC(r) {
    var s = pickWhere(function () { return { p: r.int(1, 7), q: r.int(1, 7), w: r.int(1, 7) }; }, function (z) { return distinct([z.p, z.q, z.w]) && z.p !== z.w && !(z.p === 3 && z.q === 2 && z.w === 4); });
    var p = s.p, q = s.q, w = s.w; // (x + p)(x − q)/(x(x − w)) · (x − w)(x + w)/((x + p)(x + w))
    var e1 = df(pt([1, p - q, -p * q], 'x'), pt([1, -w, 0], 'x')), e2 = df('x^{2}-' + w * w, pt([1, p + w, p * w], 'x'));
    return mc(r, 'The product ' + t(e1 + '\\cdot ' + e2) + ' simplifies to', [
      { html: t(df('x+' + q, 'x')), why: 'Check the signs: ' + t(pt([1, p - q, -p * q], 'x') + '=(x+' + p + ')(x-' + q + ')') + '.', code: CP + 'prod' },
      { html: t(df('x', 'x-' + q)), why: 'Upside down: ' + t('x') + ' is in a denominator.', code: CP + 'prod' },
      { html: t(df('(x-' + q + ')(x+' + w + ')', 'x')), why: 'The factor ' + t('x+' + w) + ' divides out too.', code: CP + 'prod' },
      { html: t(df('x-' + q, 'x')), right: true }],
      t(df('(x+' + p + ')(x-' + q + ')', 'x(x-' + w + ')') + '\\cdot ' + df('(x-' + w + ')(x+' + w + ')', '(x+' + p + ')(x+' + w + ')') + '=' + df('x-' + q, 'x')) + ', ' + t('x\\ne 0,\\ ' + w + ',\\ -' + p + ',\\ -' + w) + '.', ['Factor everything, then divide out factors common to a numerator and a denominator.'], 'MC: a product');
  }
  /* 2/(3a²b) − 5/(6ab²) (#9b) */
  function twoVarSum(r) {
    var U = U56(), vs = r.pick([['a', 'b'], ['x', 'y'], ['m', 'n']]);
    var s = pickWhere(function () { return { p: r.int(1, 9), q: r.int(1, 9), m: r.int(2, 6), n: r.int(2, 8), sub: r.chance(0.7) }; }, function (z) {
      var L = lcm(z.m, z.n); z.L = L; var c1 = z.p * L / z.m, c2 = z.q * L / z.n;
      return z.m !== z.n && L < z.m * z.n && gcd(gcd(c1, c2), L) === 1 && !(z.p === 2 && z.q === 5 && z.m === 3 && z.n === 6) && gcd(z.p, z.m) === 1 && gcd(z.q, z.n) === 1;
    });
    var a = vs[0], b = vs[1], c1 = s.p * s.L / s.m, c2 = s.q * s.L / s.n, op = s.sub ? '-' : '+';
    var terms = [U.T1(1, [U.C(s.p)], [U.Mo(s.m, a, 2, b, 1)]), U.T1(s.sub ? -1 : 1, [U.C(s.q)], [U.Mo(s.n, a, 1, b, 2)])];
    var LT = s.L + a + '^{2}' + b + '^{2}', NT = c1 + b + op + c2 + a;
    var sol = 'NPVs: ' + t(a + '\\ne 0,\\ ' + b + '\\ne 0') + '. LCD ' + t(LT) + ': multiply the first by ' + t(df((s.L / s.m === 1 ? '' : s.L / s.m) + b, (s.L / s.m === 1 ? '' : s.L / s.m) + b)) + ' and the second by ' + t(df((s.L / s.n === 1 ? '' : s.L / s.n) + a, (s.L / s.n === 1 ? '' : s.L / s.n) + a)) + ':<br>' +
      t(df(c1 + b, LT) + op + df(c2 + a, LT) + '=' + df(NT, LT)) + '.';
    return U.sumPart(CP, 'Simplify. State the non-permissible values.', terms, a, { vars: [a, b], sol: sol }, ['The LCD is the LCM of ' + t(s.m) + ' and ' + t(s.n) + ' times each letter to its highest power.', 'Multiply each numerator by what its denominator was multiplied by, then combine.'], 'two-variable monomial denominators');
  }

  /* ======================================================================================================
   * Equations (AN6)
   * ====================================================================================================== */
  /* (x + a)/(x + b) = (x + c)/(x + d): cross-multiply, linear (#15b) */
  function crossLin(r) {
    var s = pickWhere(function () { return { a: nzr(r, 1, 7), b: nzr(r, 1, 7), c: nzr(r, 1, 7), d: nzr(r, 1, 7) }; }, function (z) {
      var den = z.a + z.d - z.b - z.c; if (!den) return false; z.x = ex.norm(z.b * z.c - z.a * z.d, den); var xv = z.x[0] / z.x[1];
      return distinct([z.a, z.b, z.c, z.d]) && z.b !== z.d && xv !== -z.b && xv !== -z.d && z.x[1] <= 6 && Math.abs(z.x[0]) <= 40 && !(z.a === 1 && z.b === -2 && z.c === -3 && z.d === 4);
    });
    var X = function (c) { return lt('x', c); }, A1 = s.a + s.d, B1 = s.a * s.d, A2 = s.b + s.c, B2 = s.b * s.c;
    var sol = 'NPVs: ' + t('x\\ne ' + F(-s.b) + ',\\ ' + F(-s.d)) + '. Cross-multiply: ' + t('(' + X(s.a) + ')(' + X(s.d) + ')=(' + X(s.c) + ')(' + X(s.b) + ')') + '.<br>' +
      t(pt([1, A1, B1], 'x') + '=' + pt([1, A2, B2], 'x')) + ': the ' + t('x^{2}') + ' terms cancel, ' + t(pt([A1 - A2, 0], 'x') + '=' + F(B2 - B1)) + ', so ' + t('x=' + rt(s.x)) + ' (not an NPV).';
    return A6().rootsPart(CP, 'State the non-permissible values and solve. ' + t(df(X(s.a), X(s.b)) + '=' + df(X(s.c), X(s.d))), [s.x], { v: 'x' }, sol,
      ['State the NPVs, then cross-multiply: ' + t('\\frac{a}{b}=\\frac{c}{d}\\Rightarrow ad=bc') + '.', 'Expand both sides: the ' + t('x^{2}') + ' terms cancel and the equation is linear.'], 'cross-multiply: binomials');
  }
  /* the equation after multiplying by the LCD (#16) */
  function lcdMC(r) {
    var s = pickWhere(function () { return { p: r.int(2, 7), a: r.int(1, 6) }; }, function (z) { return z.a !== z.p && !(z.p === 3 && z.a === 2); });
    var p = s.p, a = s.a, eq = df(p, 'x-' + a) + '+' + df('x', 'x+' + a) + '=2';
    var right = pt([1, a - p, -(p * a + 2 * a * a)], 'x') + '=0';
    return mc(r, 'When the equation ' + t(eq) + ' is solved by multiplying every term by the LCD, an equation that appears is', [
      { html: t(pt([1, p - a, p * a - 2], 'x') + '=0'), why: 'Multiply <b>every</b> term by the LCD, including the ' + t(2) + ' on the right.', code: CP + 'lcd' },
      { html: t(right), right: true },
      { html: t(pt([1, a - p, 2 * a * a - p * a], 'x') + '=0'), why: t('(x-' + a + ')(x+' + a + ')=x^{2}-' + a * a) + ', not ' + t('x^{2}+' + a * a) + '.', code: CP + 'lcd' },
      { html: t(pt([1, p - a, -(p * a + 2 * a * a)], 'x') + '=0'), why: 'Check the sign of the ' + t('x') + ' term when you collect like terms.', code: CP + 'lcd' }],
      'LCD ' + t('(x-' + a + ')(x+' + a + ')') + ': ' + t(p + '(x+' + a + ')+x(x-' + a + ')=2(x-' + a + ')(x+' + a + ')') + ', so ' + t(pt([1, p - a, p * a], 'x') + '=' + pt([2, 0, -2 * a * a], 'x')) + ' and ' + t(right) + '.', ['Multiply each term by the LCD ' + t('(x-' + a + ')(x+' + a + ')') + ' and move everything to one side.'], 'MC: the equation after the LCD');
  }
  /* the extraneous root of x²/(x − a) = a²/(x − a) (#18) */
  function extrMC(r) {
    var a = pickWhere(function () { return r.int(2, 9); }, function (x) { return x !== 4; }), neg = r.chance(0.35);
    var A = neg ? '+' + a : '-' + a, ext = neg ? -a : a;
    return mc(r, 'The extraneous root of ' + t(df('x^{2}', 'x' + A) + '=' + df(a * a, 'x' + A)) + ' is', [
      { html: t(ext), right: true }, { html: t(-ext), why: t('x=' + (-ext)) + ' is not an NPV and it checks: it is the solution.', code: CP + 'extr' },
      { html: t(a * a), why: 'Solve ' + t('x^{2}=' + a * a) + ': take the square root.', code: CP + 'extr' }, { html: t(0), why: t('x=0') + ' is not a root: ' + t('0\\ne ' + df(a * a, A.charAt(0) === '+' ? a : '-' + a)) + '.', code: CP + 'extr' }],
      t('x\\ne ' + ext) + '. Multiply by ' + t('x' + A) + ': ' + t('x^{2}=' + a * a) + ', so ' + t('x=\\pm ' + a) + '. ' + t('x=' + ext) + ' is the NPV (extraneous); the solution is ' + t('x=' + (-ext)) + '.', ['State the NPV, then multiply both sides by the denominator.'], 'MC: the extraneous root');
  }
  /* x/(x − a) = a/(x − a) + 2: no solution (EP 9) */
  function noSolMC(r) {
    var a = pickWhere(function () { return r.int(2, 9); }, function (x) { return x !== 3; }), k = r.pick([2, 2, 3]);
    // x = a + k(x − a) → (1 − k)x = a − ka → x = a
    return mc(r, 'The solution of ' + t(df('x', 'x-' + a) + '=' + df(a, 'x-' + a) + '+' + k) + ' is', [
      { html: t('x=' + a), why: t('x=' + a) + ' makes the denominators ' + t(0) + ': it is extraneous.', code: CP + 'nosol' },
      { html: t('x=-' + a), why: 'Check it: ' + t(df('-' + a, '-' + 2 * a) + '\\ne ' + df(a, '-' + 2 * a) + '+' + k) + '.', code: CP + 'nosol' },
      { html: t('x=0'), why: 'Check it: ' + t('0\\ne ' + df(a, '-' + a) + '+' + k) + '.', code: CP + 'nosol' },
      { html: 'no solution', right: true }],
      t('x\\ne ' + a) + '. Multiply by ' + t('x-' + a) + ': ' + t('x=' + a + '+' + k + '(x-' + a + ')') + ', so ' + t('x=' + a) + ', which is the NPV: it is extraneous, so there is no solution.', ['State the NPV first. Then multiply every term by the LCD.'], 'MC: no solution');
  }
  /* a work equation (EP 10) */
  function workMC(r) {
    var nm = r.pick([['Rae', 'Tom'], ['Lena', 'Ike'], ['Ola', 'Ben'], ['Zara', 'Max']]);
    var z = pickWhere(function () { return { a: r.int(3, 12), T: r.int(2, 8) }; }, function (q) { return q.T < q.a && !(q.a === 5 && q.T === 3); });
    return mc(r, nm[0] + ' can paint a room in ' + t(z.a) + ' h. With ' + nm[1] + ' helping, it takes ' + t(z.T) + ' h. If ' + nm[1] + ' alone takes ' + t('t') + ' hours, an equation for ' + t('t') + ' is', [
      { html: t(df(z.T, z.a) + '+' + df(z.T, 't') + '=1'), right: true },
      { html: t(df(1, z.a) + '+' + df(1, 't') + '=' + z.T), why: 'In one hour they do ' + t(df(1, z.a) + '+' + df(1, 't')) + ' of the room; that equals ' + t(df(1, z.T)) + ', not ' + t(z.T) + '.', code: CP + 'work' },
      { html: t(z.a + '+t=' + z.T), why: 'Times do not add; the parts of the job add to ' + t(1) + '.', code: CP + 'work' },
      { html: t(df(z.a, z.T) + '+' + df('t', z.T) + '=1'), why: 'Upside down: in ' + t(z.T) + ' h ' + nm[0] + ' does ' + t(df(z.T, z.a)) + ' of the room.', code: CP + 'work' }],
      'In ' + t(z.T) + ' h ' + nm[0] + ' does ' + t(df(z.T, z.a)) + ' of the room and ' + nm[1] + ' ' + t(df(z.T, 't')) + '; together one room.', ['Each part is ' + t('\\frac{\\text{time worked}}{\\text{time alone}}') + '.'], 'MC: a work equation');
  }
  /* the positive root of p/x + q/(x + c) = s, to the nearest hundredth (#19, EP 14) */
  function posRootNR(r, ep) {
    var z = pickWhere(function () { return { p: r.int(1, 6), q: r.int(1, 6), c: r.int(1, 4), s: r.pick([1, 1, 2, 3]) }; }, function (z) {
      z.B = z.s * z.c - z.p - z.q; z.C = -z.p * z.c; z.D = z.B * z.B - 4 * z.s * z.C;
      var k = Math.round(Math.sqrt(z.D)); if (k * k === z.D) return false;
      z.x = (-z.B + Math.sqrt(z.D)) / (2 * z.s); var f = z.x * 100 - Math.floor(z.x * 100);
      return z.x > 0.2 && z.x < 9.99 && Math.abs(f - 0.5) > 0.05 && !(z.p === 5 && z.q === 3 && z.c === 2 && z.s === 2) && !(z.p === 2 && z.q === 3 && z.c === 1 && z.s === 1);
    });
    var g = gcd(gcd(z.s, z.B), z.C), A = z.s / g, Bq = z.B / g, Cq = z.C / g, Dd = Bq * Bq - 4 * A * Cq, neg = (-z.B - Math.sqrt(z.D)) / (2 * z.s);
    var eq = df(z.p, 'x') + '+' + df(z.q, 'x+' + z.c) + '=' + z.s;
    var sol = t('x\\ne 0,\\ -' + z.c) + '. Multiply by ' + t('x(x+' + z.c + ')') + ': ' + t(z.p + '(x+' + z.c + ')+' + z.q + 'x=' + (z.s === 1 ? '' : z.s) + 'x(x+' + z.c + ')') + ', so ' + t(pt([A, Bq, Cq], 'x') + '=0') + '.<br>' +
      t('x=\\frac{' + (-Bq) + '\\pm\\sqrt{' + Dd + '}}{' + 2 * A + '}') + '; the positive root is ' + t('x\\approx ' + K.roundTo(z.x, 2).toFixed(2)) + ' (the other is ' + t('\\approx ' + K.roundTo(neg, 2).toFixed(2)) + ').';
    var p = KP.approx('<i>(Numerical Response)</i> The positive root of ' + t(eq) + ', to the nearest hundredth, is ________.', z.x, 2, { nr: true, diag: function (v) { if (Math.abs(v + K.roundTo(neg, 2)) < 1e-9) return { code: CP + 'eq-sign', hint: 'That comes from the negative root. Use the root with ' + t('+\\sqrt{\\ }') + '.' }; return null; } }, sol,
      ['Multiply every term by the LCD ' + t('x(x+' + z.c + ')') + ' and write the quadratic in standard form.', 'It does not factor: use the quadratic formula and keep the positive root.'], 'NR: the positive root');
    void ep;
    return p;
  }

  /* shared problems: Sara (#22–23) and the tour bus (EP 17) */
  function saraShared(r) { return P9().fasterShared(r, { kind: 'drive', not: function (z) { return z.h !== 0.5 && z.h !== 1; } }); }
  function saraMC(r, z) {
    var D = F(z.D), k = z.k, h = z.h, hT = h === 0.5 ? '\\frac{1}{2}' : '1', hM = h === 0.5 ? '30' : '60';
    return mc(r, z.who + ' drives ' + t(D) + ' km to a cabin at ' + t('s') + ' km/h. If ' + z.she + ' drove ' + t(k) + ' km/h faster, the trip would take ' + (h === 0.5 ? '30 minutes' : '1 hour') + ' less. An equation that can be used to determine ' + t('s') + ' is', [
      { html: t(df(D, 's') + '-' + df(D, 's+' + k) + '=' + hM), why: 'The speeds are in km/h, so the time must be in hours: ' + (h === 0.5 ? '30 min ' + t('=\\frac{1}{2}') + ' h' : '60 min ' + t('=1') + ' h') + '.', code: CP + 'lcd' },
      { html: t(df(D, 's') + '-' + df(D, 's+' + k) + '=' + hT), right: true },
      { html: t(df(D, 's+' + k) + '-' + df(D, 's') + '=' + hT), why: 'The slower trip takes longer: slower time minus faster time is positive.', code: CP + 'lcd' },
      { html: t(df(D, 's') + '+' + df(D, 's+' + k) + '=' + hT), why: 'The difference of the times is ' + t(hT) + ' h, not their sum.', code: CP + 'lcd' }],
      'The slower trip is longer, so slower time ' + t('-') + ' faster time ' + t('=') + ' ' + (h === 0.5 ? '30 min ' + t('=\\frac{1}{2}') + ' h' : '1 h') + ': ' + t(df(D, 's') + '-' + df(D, 's+' + k) + '=' + hT) + '.', ['Time ' + t('=\\frac{\\text{distance}}{\\text{speed}}') + ', in hours. Which trip is longer?'], 'MC: the equation for a time saved');
  }
  function busShared(r) { return P9().fasterShared(r, { kind: 'drive', not: function (z) { return z.h !== 0.5 && z.h !== 1; } }); }

  /* ======================================================================================================
   * The lesson
   * ====================================================================================================== */
  function b(fn, o) { return function (r) { return B6()[fn](r, CP, o); }; }
  function p9(fn, o) { return function (r) { return P9()[fn](r, CP, o); }; }
  var QUESTIONS = [
    { num: '1', section: 'Expressions', outcome: AN4, parts: [
      { id: '1a', level: 'LIM', make: b('npv', { mode: 'lin', kind: 'mono' }) },
      { id: '1b', level: 'BEG', make: b('npv', { mode: 'fac', kind: 'dos' }) },
      { id: '1c', level: 'PRG', make: b('npv', { mode: 'fac', kind: 'a' }) },
      { id: '1d', level: 'EMG', make: b('npv', { mode: 'lin', kind: 'none' }) },
      { id: '1e', level: 'BEG', make: b('evalAt') }] },
    { num: '2', outcome: AN4, parts: [
      { id: '2a', level: 'BEG', make: b('simpMono') },
      { id: '2b', level: 'PRG', make: b('simpRat', { mode: 'tri' }) },
      { id: '2c', level: 'PRG', make: b('simpRat', { mode: 'opp' }) },
      { id: '2d', level: 'PRG', make: b('simpRat', { mode: 'a' }) }] },
    { num: '3', outcome: AN4, parts: [{ id: '3', level: 'BEG', make: oppMC }] },
    { num: '4', outcome: AN4, parts: [
      { id: '4a', level: 'EMG', make: kimMC },
      { id: '4b', level: 'PRG', make: rajNPV }] },
    { num: '5', outcome: AN5, parts: [
      { id: '5a', level: 'BEG', make: b('mulMono') },
      { id: '5b', level: 'PRG', make: b('mulRat', { mode: 'tri' }) }] },
    { num: '6', outcome: AN4, parts: [{ id: '6', level: 'PRG', make: equivMC }] },
    { num: '7', outcome: AN5, parts: [
      { id: '7a', level: 'PRG', make: b('divRat', { mode: 'tri' }) },
      { id: '7b', level: 'ADV', make: b('divRat', { mode: 'tri' }) }] },
    { num: '8', outcome: AN5, parts: [{ id: '8', level: 'PRG', make: function (r) { return npvDivMC(r, false); } }] },
    { num: '9', outcome: AN5, parts: [
      { id: '9a', level: 'BEG', make: b('addMono', { mode: 'num' }) },
      { id: '9b', level: 'PRG', make: twoVarSum },
      { id: '9c', level: 'PRG', make: b('addMono', { mode: 'bin' }) }] },
    { num: '10', outcome: AN5, parts: [{ id: '10', level: 'PRG', make: function (r) { return abSum(r, false); } }] },
    { num: '11', outcome: AN5, parts: [
      { id: '11a', level: 'PRG', make: b('addBin', { mode: 'lin' }) },
      { id: '11b', level: 'ADV', make: b('addBin', { mode: 'tri' }) },
      { id: '11c', level: 'PRG', make: b('addBin', { mode: 'opp' }) }] },
    { num: '12', outcome: AN5, parts: [{ id: '12', level: 'EMG', make: function (r) { return sumMC(r, false); } }] },
    { num: '13', outcome: AN5, parts: [{ id: '13', level: 'MAS', make: b('mixed3') }] },
    { num: '14', outcome: AN4, parts: [{ id: '14', level: 'ADV', make: abEquiv }] },
    { num: '15', section: 'Equations and problems', outcome: AN6, stem: 'State the non-permissible values and solve.', parts: [
      { id: '15a', level: 'BEG', make: b('eqMono') },
      { id: '15b', level: 'PRG', make: crossLin },
      { id: '15c', level: 'PRG', make: b('eqBin') }] },
    { num: '16', outcome: AN6, parts: [{ id: '16', level: 'PRG', make: lcdMC }] },
    { num: '17', outcome: AN6, stem: 'State the non-permissible values, solve and verify.', parts: [
      { id: '17a', level: 'PRG', make: b('eqQuad') },
      { id: '17b', level: 'ADV', make: b('eqExtr') }] },
    { num: '18', outcome: AN6, parts: [{ id: '18', level: 'EMG', make: extrMC }] },
    { num: '19', outcome: AN6, parts: [{ id: '19', level: 'ADV', make: function (r) { return posRootNR(r, false); } }] },
    { num: '20', outcome: AN6, parts: [{ id: '20', level: 'PRG', make: p9('recipMinus', { diff: true }) }] },
    { num: '21', outcome: AN6, parts: [{ id: '21', level: 'PRG', make: p9('boatSame') }] },
    { num: '22–23', outcome: AN6, shared: saraShared, parts: [
      { id: '22', level: 'EMG', make: function (r, z) { return saraMC(r, z); } },
      { id: '23', level: 'ADV', make: function (r, z) { return P9().fasterSolve(r, CP, z, { prompt: 'Solve the equation from the previous question to find ' + z.who + '’s speed and ' + z.her + ' driving time.' }); } }] },
    { num: '24', outcome: AN6, parts: [{ id: '24', level: 'PRG', make: p9('workOther', { min: true }) }] },
    { num: '25', outcome: AN6, parts: [{ id: '25', level: 'MAS', make: p9('workFaster', { nr: true }) }] },
    { num: '26', outcome: AN6, parts: [{ id: '26', level: 'EMG', make: p9('fracJobMC', { together: true }) }] },
    { num: '27', outcome: AN6, parts: [{ id: '27', level: 'PRG', make: p9('winsRow', { bat: true }) }] }
  ];

  var EXTRA = [
    { num: '1', section: 'A. Multiple Choice', outcome: AN4, parts: [{ id: 'E1', level: 'BEG', make: npvMC }] },
    { num: '2', outcome: AN4, parts: [{ id: 'E2', level: 'PRG', make: function (r) { return simpMC(r, 'tri'); } }] },
    { num: '3', outcome: AN4, parts: [{ id: 'E3', level: 'PRG', make: function (r) { return simpMC(r, 'opp'); } }] },
    { num: '4', outcome: AN4, parts: [{ id: 'E4', level: 'PRG', make: npvSimpMC }] },
    { num: '5', outcome: AN5, parts: [{ id: 'E5', level: 'PRG', make: prodMC }] },
    { num: '6', outcome: AN5, parts: [{ id: 'E6', level: 'PRG', make: function (r) { return npvDivMC(r, true); } }] },
    { num: '7', outcome: AN5, parts: [{ id: 'E7', level: 'EMG', make: function (r) { return sumMC(r, true); } }] },
    { num: '8', outcome: AN5, parts: [{ id: 'E8', level: 'EMG', make: diffMC }] },
    { num: '9', outcome: AN6, parts: [{ id: 'E9', level: 'PRG', make: noSolMC }] },
    { num: '10', outcome: AN6, parts: [{ id: 'E10', level: 'EMG', make: workMC }] },
    { num: '11', section: 'B. Numerical Response', outcome: AN5, parts: [{ id: 'E11', level: 'PRG', make: function (r) { return abSum(r, true); } }] },
    { num: '12', outcome: AN6, parts: [{ id: 'E12', level: 'PRG', make: p9('recipMinus', { pos: true }) }] },
    { num: '13', outcome: AN6, parts: [{ id: 'E13', level: 'PRG', make: p9('windSame', { nr: true }) }] },
    { num: '14', outcome: AN6, parts: [{ id: 'E14', level: 'ADV', make: function (r) { return posRootNR(r, true); } }] },
    { num: '15', section: 'C. Written Response', outcome: AN5, stem: 'Simplify and state the non-permissible values.', parts: [
      { id: 'E15a', level: 'ADV', make: b('divRat', { mode: 'tri' }) },
      { id: 'E15b', level: 'ADV', make: b('addBin', { mode: 'tri' }) }] },
    { num: '16', outcome: AN6, parts: [{ id: 'E16', level: 'ADV', make: b('eqExtr') }] },
    { num: '17', outcome: AN6, shared: busShared, stem: function (z) { return 'A tour bus travels ' + t(F(z.D)) + ' km from one city to another. On the return trip it averages ' + t(z.k) + ' km/h more and takes ' + P9().hText(z.h) + ' less.'; }, parts: [
      { id: 'E17a', level: 'EMG', make: function (r, z) { return P9().fasterTable(r, CP, z, { prompt: 'If the speed on the first trip is ' + t('s') + ' km/h, write expressions for the time of each trip.', l1: 'First trip:', n1: 'First trip', l2: 'Return trip:', n2: 'Return trip' }); } },
      { id: 'E17b', level: 'MAS', make: function (r, z) {
        var p = P9().boxesN('Determine the speed of each trip.', [{ label: 'First trip:', ans: z.s, after: 'km/h', diag: function (v) { if (v === -(z.s + z.k)) return { code: CP + 'neg', hint: 'Reject the negative root: a speed is positive.' }; return null; } }, { label: 'Return trip:', ans: z.s + z.k, after: 'km/h' }],
          P9().fasterSol(z).replace('Actual speed', 'First trip').replace(', faster', ', return trip').replace('The actual trip takes', 'The first trip takes') + '<br>First trip ' + t(z.s) + ' km/h, return trip ' + t(z.s + z.k) + ' km/h.',
          ['The first trip’s time minus the return trip’s time is ' + P9().hText(z.h) + '.', 'Multiply by the LCD, solve the quadratic and reject the negative root.'], 'a time saved: the speeds');
        return p;
      } },
      { id: 'E17c', level: 'PRG', make: function (r, z) {
        var T = z.D / z.s + z.D / (z.s + z.k);
        return KP.number('Determine the total driving time for the round trip.', T, function (v) { if (Math.abs(v - z.D / z.s) < 1e-9 || Math.abs(v - z.D / (z.s + z.k)) < 1e-9) return { code: CP + 'other', hint: 'That is one trip. Add the two times.' }; return null; },
          t('\\frac{' + F(z.D) + '}{' + z.s + '}+\\frac{' + F(z.D) + '}{' + (z.s + z.k) + '}=' + K.roundTo(z.D / z.s, 4) + '+' + K.roundTo(z.D / (z.s + z.k), 4) + '=' + K.roundTo(T, 4)) + ' h (' + P9().hmT(T) + ').', ['Use the speeds from (b): each time is distance ÷ speed.'], 'the total time', { after: 'h' });
      } }] },
    { num: '18', outcome: AN6, parts: [{ id: 'E18', level: 'MAS', make: p9('workFaster', { ctx: 'crew' }) }] }
  ];

  /* one question per booklet number: a group of single-part questions (ids like 17 or E17) becomes separate questions */
  function splitNum(list) {
    var out = [];
    list.forEach(function (q) {
      if (q.parts.length > 1 && q.parts.every(function (p) { return /^E?\d+$/.test(p.id); }) && !q.shared) {
        q.parts.forEach(function (p, i) { var nq = { num: p.id.replace(/^E/, ''), parts: [p] }; if (i === 0 && q.section) nq.section = q.section; if (q.outcome) nq.outcome = q.outcome; if (q.stem) nq.stem = q.stem; out.push(nq); });
      } else out.push(q);
    });
    return out;
  }
  HW.defineLesson({ id: LID, unit: 6, num: '10', title: 'Unit 6 Review', outcome: AN4, calc: true, questions: splitNum(QUESTIONS), extra: splitNum(EXTRA) });
})(window);
