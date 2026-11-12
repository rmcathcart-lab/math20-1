/* Math 20-1 · Unit 6 · Lesson 6 — Adding and Subtracting with Binomial and Trinomial Denominators (outcome AN5)
 * Assignment 6 (u6_l06.tex, Questions 1–17) and the Lesson 6 Extra Practice (u6_ep06.tex, A1–A4, B1–B5, C1–C3).
 * Every part is a generator: the booklet question's idea, form and difficulty with new numbers (the lesson's example
 * numbers and the booklet question's own numbers are left out where that is easy). Calculator allowed; answers exact.
 *
 * Built on the kit HW.u6k56 from u6l5.js (load order): "Simplify. State the NPVs." is one part with two boxes; the
 * expression is checked by value at six points away from the NPVs, then for form (one fraction, lowest terms — no
 * common factor left with the denominator — integers, factored or expanded); NPVs as "x ≠ 3, −2" (± allowed).
 * Recognised mistakes (codes u6l6-…): adding straight across, the minus sign applied only to the first term of a
 * subtracted product, a numerator not multiplied by the factor its denominator is missing, a whole-number term not
 * multiplied by the LCD, the lost −1 of an opposite factor (a − x = −(x − a)), NPVs from the simplified answer only,
 * NPVs of one denominator only, NPVs with the wrong signs.
 * Conversions: "show that … simplifies to …" → simplify (the given answer is in the solution); "test the claim with
 * x = 3" → the two values in boxes; "find the error" → MC on the error and the correct answer; "which values make sense"
 * → MC; "find A and B" → two boxes; the two-variable denominators x ± y (EP A1d) → the expression only (the NPVs x ≠ ±y
 * are in the solution).
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: 4e (a ≠ 1 trinomial that cancels), 12b (complex fraction), Extra C1–C3. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, KP = K.P, P = HW.poly, ex = HW.ex, t = K.t, ok = K.ok, wrong = K.wrong;
  var U = HW.u6k56;
  if (!U) throw new Error('js/lessons/u6l6.js needs js/lessons/u6l5.js (HW.u6k56) loaded first');
  var LID = 'u6l6', CP = LID + '-';
  var gcd = U.gcd, lcm = U.lcm, pickWhere = U.pickWhere, nz = U.nz, lin = U.lin, tx = U.tx, sg = U.sg, R = U.R, rv = U.rv, rt = U.rt, coefT = U.coefT, pickVar = U.pickVar, mon = U.mon;
  var C = U.C, Mo = U.Mo, A = U.A, Q = U.Q, T1 = U.T1, canon = U.canon, cTex = U.cTex, cPolys = U.cPolys, cMul = U.cMul, cValAt = U.cValAt, facTex = U.facTex, fracF = U.fracF, polyT = U.polyT, fracE = U.fracE;
  var npvOf = U.npvOf, npvTex = U.npvTex, simpPart = U.simpPart, ratPart = U.ratPart, sumAll = U.sumAll, sumKey = U.sumKey, sumSol = U.sumSol, termsTex = U.termsTex, sumPart = U.sumPart, sumRatPart = U.sumRatPart;
  var monics = U.monics, small2 = U.small2, ratCheck = U.ratCheck, boxes = U.boxes, valPart = U.valPart, mcPart = U.mcPart, cancelNW = U.cancelNW, listPoly = U.listPoly;

  HW.addCodes({ 'u6l6-sense': 'Values that make sense: a length or speed must be positive', 'u6l6-AB-swap': 'A and B swapped', 'u6l6-perim': 'Perimeter: added the length and width only once',
    'u6l6-tele': 'Telescoping sum: kept the first fraction instead of the last', 'u6l6-other': 'Gave the other expression, not the one asked for' });
  HW.addPartial({ 'u6l6-sense': 'b', 'u6l6-AB-swap': 's', 'u6l6-perim': 's', 'u6l6-tele': 'b', 'u6l6-other': 'b' });

  var H_BIN = ['State the NPVs (each denominator ' + t('\\ne 0') + '). With no common factor, the LCD is the product of the denominators.',
    'Multiply each numerator (in brackets) by the denominator it is missing, expand, collect like terms, then factor the numerator to see whether anything divides out.'];
  var H_FAC = ['Factor every denominator first, then state the NPVs. The LCD uses each different factor once (to its highest power).',
    'Multiply each numerator by the factors its denominator is missing, combine, then factor the numerator: it may divide out.'];
  var H_OPP = ['A factor like ' + t('(a-x)') + ' is ' + t('-(x-a)') + ': rewrite it so both denominators have the same factor, and change the sign in front of the fraction.',
    'Then combine the numerators over the common denominator and simplify.'];
  var SIMP = 'Simplify. State the non-permissible values.';
  function L(a, b, v) { return lin(a, b, v || 'x'); }
  function vOf(r) { return r.pick(['x', 'x', 'x', 'a', 'm', 'y', 't', 'n']); }

  /* ---------- 1: binomial denominators, number numerators ---------- */
  function bin1(r, kind) {
    var v = vOf(r), terms;
    if (kind === 'a' || kind === 'b') {
      var s = pickWhere(function () { return { a: nz(r, 1, 9), b: nz(r, 1, 9), p: r.int(1, 9), q: r.int(1, 9) }; }, function (z) {
        return z.a !== z.b && z.p !== z.q && !(z.a === 2 && z.b === -4) && !(z.a === 1 && z.b === -2 && z.p === 2) && !(z.a === -4 && z.b === 3 && z.p === 5) && (z.p * (kind === 'a' ? 1 : 1) + (kind === 'a' ? z.q : -z.q)) !== 0; });
      terms = [T1(1, [C(s.p)], [A(1, s.a, v)]), T1(kind === 'a' ? 1 : -1, [C(s.q)], [A(1, s.b, v)])];
    } else if (kind === 'c') {
      var c = pickWhere(function () { return { p: r.int(1, 9), q: r.int(1, 9), d: nz(r, 1, 9), add: r.chance(0.3) }; }, function (z) { return z.p !== z.q && !(z.p === 4 && z.q === 1 && z.d === 6) && !(z.p === 2 && z.q === 3 && z.d === -5); });
      terms = [T1(1, [C(c.p)], [Mo(1, v, 1)]), T1(c.add ? 1 : -1, [C(c.q)], [A(1, -c.d, v)])];
    } else if (kind === 'd') {
      var d = pickWhere(function () { return { c: r.int(2, 4), e: nz(r, 1, 7), f: nz(r, 1, 7), p: r.int(1, 5), q: r.int(1, 5), sub: r.chance(0.4) }; }, function (z) { return gcd(z.c, Math.abs(z.e)) === 1 && rv(ex.norm(-z.e, z.c)) !== -z.f && !(z.c === 2 && z.e === -1 && z.f === 2) && !(z.c === 2 && z.e === 1 && z.f === 0); });
      terms = [T1(1, [C(d.p)], [A(d.c, d.e, v)]), T1(d.sub ? -1 : 1, [C(d.q)], [A(1, d.f, v)])];
    } else { // 'e': k·a/(a t + b) − k·c/(c t + d): the variable terms cancel
      var e = pickWhere(function () { return { a: r.int(2, 5), b: nz(r, 1, 7), c: r.int(2, 5), d: nz(r, 1, 7), k: r.pick([1, 1, 1, 2]) }; }, function (z) {
        return z.a !== z.c && gcd(z.a, Math.abs(z.b)) === 1 && gcd(z.c, Math.abs(z.d)) === 1 && z.a * z.d - z.c * z.b !== 0 && rv(ex.norm(-z.b, z.a)) !== rv(ex.norm(-z.d, z.c)) && !(z.a === 3 && z.b === 2 && z.c === 2 && z.d === -1); });
      terms = [T1(1, [C(e.k * e.a)], [A(e.a, e.b, v)]), T1(-1, [C(e.k * e.c)], [A(e.c, e.d, v)])];
    }
    return sumPart(CP, SIMP, terms, v, {}, H_BIN, 'binomial denominators: ' + kind);
  }

  /* ---------- 2: binomial numerators, whole-number terms ---------- */
  function bin2(r, kind) {
    var v = vOf(r), terms;
    if (kind === 'a' || kind === 'b') {
      var z = monics(r, 4, 7, function (a) { return a[1] !== a[3] && a[0] !== a[1] && a[2] !== a[3] && !(a[1] === -1 && a[3] === 1) && !(a[1] === -3 && a[3] === 2); });
      terms = [T1(1, [A(1, z[0], v)], [A(1, z[1], v)]), T1(kind === 'a' ? 1 : -1, [A(1, z[2], v)], [A(1, z[3], v)])];
    } else if (kind === 'c') {
      var c = pickWhere(function () { return { k: r.int(2, 4), a: nz(r, 1, 7), q: nz(r, 1, 7), b: nz(r, 1, 7) }; }, function (s) { return s.a !== s.b && s.q !== s.b && !(s.k === 2 && s.a === 4 && s.b === -2); });
      terms = [T1(1, [Mo(c.k, v, 1)], [A(1, c.a, v)]), T1(-1, [A(1, c.q, v)], [A(1, c.b, v)])];
    } else if (kind === 'd') {
      var d = pickWhere(function () { return { c: r.int(2, 6), p: nz(r, 1, 9), a: nz(r, 1, 9), sub: r.chance(0.35) }; }, function (s) { return !(s.c === 2 && s.p === 5 && s.a === -3) && !(s.c === 2 && s.a === 3) && s.c * s.a !== (s.sub ? -s.p : s.p); });
      terms = [T1(1, [C(d.c)], []), T1(d.sub ? -1 : 1, [C(Math.abs(d.p))], [A(1, d.a, v)])];
    } else { // 'e': (c v)/(v + a) − c, or (v + p)/(v + a) − 1
      var e = pickWhere(function () { return { c: r.int(1, 5), a: nz(r, 1, 9), p: nz(r, 1, 9), form: r.pick(['cv', 'lin']) }; }, function (s) { return s.p !== s.a && !(s.c === 1 && s.a === 1 && s.form === 'cv') && !(s.c === 1 && s.a === 3 && s.form === 'cv'); });
      terms = e.form === 'cv' ? [T1(1, [Mo(e.c, v, 1)], [A(1, e.a, v)]), T1(-1, [C(e.c)], [])] : [T1(1, [A(1, e.p, v)], [A(1, e.a, v)]), T1(-1, [C(1)], [])];
    }
    return sumPart(CP, SIMP, terms, v, {}, kind === 'd' || kind === 'e' ? ['A whole-number term is a fraction over ' + t(1) + ': multiply it by the whole denominator.', 'Combine the numerators (brackets when subtracting) and collect like terms.'] : H_BIN, 'binomial numerators: ' + kind);
  }

  /* ---------- 3: factor the denominators first ---------- */
  function fac3(r, kind) {
    var v = vOf(r), terms;
    if (kind === 'a') { // p/(g(v + a)) ± q/(v + a)
      var s = pickWhere(function () { return { g: r.int(2, 6), a: nz(r, 1, 8), p: r.int(1, 9), q: r.int(1, 9), sub: r.chance(0.4) }; }, function (z) { return z.p !== z.g * z.q && !(z.g === 4 && z.a === 2 && z.p === 3) && !(z.g === 2 && z.a === 3 && z.p === 5) && (z.sub ? z.p - z.g * z.q : z.p + z.g * z.q) !== 0; });
      terms = [T1(1, [C(s.p)], [C(s.g), A(1, s.a, v)]), T1(s.sub ? -1 : 1, [C(s.q)], [A(1, s.a, v)])];
    } else if (kind === 'b') { // p/(v(v + a)) − q/v
      var b = pickWhere(function () { return { a: nz(r, 1, 8), p: r.int(1, 9), q: r.int(1, 5), add: r.chance(0.3) }; }, function (z) { return z.p !== (z.add ? -1 : 1) * z.q * z.a && !(z.a === 2 && z.p === 5) && !(z.a === -4 && z.p === 3); });
      terms = [T1(1, [C(b.p)], [Mo(1, v, 1), A(1, b.a, v)]), T1(b.add ? 1 : -1, [C(b.q)], [Mo(1, v, 1)])];
    } else if (kind === 'c') { // p/(g1(c v + e)) + q/(g2(c v + e))
      var c = pickWhere(function () { return { g1: r.int(2, 5), g2: r.int(2, 5), c: r.int(2, 3), e: nz(r, 1, 7), p: r.int(1, 5), q: r.int(1, 5), sub: r.chance(0.4) }; }, function (z) { return z.g1 !== z.g2 && gcd(z.c, Math.abs(z.e)) === 1 && gcd(z.g1, z.g2) < Math.min(z.g1, z.g2) && !(z.g1 === 3 && z.g2 === 2 && z.e === -3) && !(z.g1 === 3 && z.g2 === 4 && z.e === -2) && (z.p * lcm(z.g1, z.g2) / z.g1 + (z.sub ? -1 : 1) * z.q * lcm(z.g1, z.g2) / z.g2) !== 0; });
      terms = [T1(1, [C(c.p)], [C(c.g1), A(c.c, c.e, v)]), T1(c.sub ? -1 : 1, [C(c.q)], [C(c.g2), A(c.c, c.e, v)])];
    } else if (kind === 'd') { // k v/(v² − p²) − k/(v + p) = kp/((v − p)(v + p))
      var d = pickWhere(function () { return { p: r.int(2, 9), k: r.pick([1, 1, 2, 3]) }; }, function (z) { return z.p !== 5 && z.p !== 1; });
      terms = [T1(1, [Mo(d.k, v, 1)], [A(1, -d.p, v), A(1, d.p, v)]), T1(-1, [C(d.k)], [A(1, d.p, v)])];
    } else if (kind === 'e') { // v/(g(v + p)) − p²/(g v (v + p)) = (v − p)/(g v)
      var e = pickWhere(function () { return { g: r.int(2, 5), p: nz(r, 2, 8) }; }, function (z) { return !(z.g === 2 && z.p === 3) && !(z.p === -5); });
      terms = [T1(1, [Mo(1, v, 1)], [C(e.g), A(1, e.p, v)]), T1(-1, [C(e.p * e.p)], [C(e.g), Mo(1, v, 1), A(1, e.p, v)])];
    } else { // 'f': c/(v − p) − 2cp/(v² − p²) = c/(v + p)
      var f = pickWhere(function () { return { c: r.int(1, 6), p: r.int(1, 8), flip: r.chance(0.3) }; }, function (z) { return !(z.c === 3 && z.p === 2) && !(z.c === 2 && z.p === 1) && !(z.c === 1 && z.p === 3); });
      terms = f.flip ? [T1(1, [C(f.c)], [A(1, f.p, v)]), T1(1, [C(2 * f.c * f.p)], [A(1, -f.p, v), A(1, f.p, v)])] : [T1(1, [C(f.c)], [A(1, -f.p, v)]), T1(-1, [C(2 * f.c * f.p)], [A(1, -f.p, v), A(1, f.p, v)])];
    }
    return sumPart(CP, 'Factor the denominators first. Simplify fully and state the non-permissible values.', terms, v, {}, H_FAC, 'factor first: ' + kind);
  }

  /* ---------- 4: trinomial denominators ---------- */
  function tri4(r, kind) {
    var v = vOf(r), terms;
    if (kind === 'a' || kind === 'b' || kind === 'c') {
      var z = monics(r, 3, 6, function (a) { return small2(a[0], a[1]) && small2(a[0], a[2]) && !(a[0] === 1 && a[1] === 2 && a[2] === 3); });
      var p = r.int(1, 5), q = r.int(1, 5), d2 = kind === 'b' ? [A(1, z[0], v), A(1, -z[0], v)] : kind === 'c' ? [Mo(1, v, 1), A(1, z[0], v)] : [A(1, z[0], v), A(1, z[2], v)];
      if (kind === 'b' && (z[1] === -z[0])) return tri4(r, kind);
      terms = [T1(1, [C(p)], [A(1, z[0], v), A(1, z[1], v)]), T1(kind === 'b' ? -1 : r.chance(0.6) ? 1 : -1, [C(q)], d2)];
    } else if (kind === 'd') { // p/((v+a)(v+b)) − q/((v+a)(v+c)), numerator p(v+c) − q(v+b) ∝ (v + a)
      var s = pickWhere(function () { var m = monics(r, 3, 6, function (a) { return small2(a[0], a[1]) && small2(a[0], a[2]); }); return { a: m[0], b: m[1], c: m[2], p: r.int(1, 7), q: r.int(1, 7), sub: r.chance(0.7) }; }, function (z) {
        var sq = z.sub ? -1 : 1, A1 = z.p + sq * z.q, B1 = z.p * z.c + sq * z.q * z.b; return A1 !== 0 && B1 === A1 * z.a && !(z.a === 3 && z.b === -2 && z.c === 2 && z.p === 5); });
      terms = [T1(1, [C(s.p)], [A(1, s.a, v), A(1, s.b, v)]), T1(s.sub ? -1 : 1, [C(s.q)], [A(1, s.a, v), A(1, s.c, v)])];
    } else { // 'e': p/((m v + e)(v − f)) − q/(v(v − f)), numerator p v − q(m v + e) ∝ (v − f)
      var w = pickWhere(function () { return { m: r.int(2, 3), e: nz(r, 1, 3), f: nz(r, 1, 4), q: r.int(1, 3) }; }, function (z) {
        if (gcd(z.m, Math.abs(z.e)) !== 1) return false; var pp = z.q * (z.m + z.e / z.f); z.p = pp; return Math.abs(pp - Math.round(pp)) < 1e-9 && pp > 0 && pp <= 15 && rv(ex.norm(-z.e, z.m)) !== z.f && !(z.m === 2 && z.e === 1 && z.f === 1 && z.q === 1); });
      terms = [T1(1, [C(w.p)], [A(w.m, w.e, v), A(1, -w.f, v)]), T1(-1, [C(w.q)], [Mo(1, v, 1), A(1, -w.f, v)])];
    }
    return sumPart(CP, 'Simplify fully. State the non-permissible values.', terms, v, {}, H_FAC, 'trinomial denominators: ' + kind);
  }

  /* ---------- 5: opposite factors ---------- */
  function opp5(r, kind) {
    var v = vOf(r), terms;
    if (kind === 'a') {
      var s = pickWhere(function () { return { a: nz(r, 1, 9), p: r.int(1, 9), q: r.int(1, 9) }; }, function (z) { return z.p !== z.q && !(z.a === 2 && z.p === 7) && !(z.a === 5 && z.p === 6); });
      terms = [T1(1, [C(s.p)], [A(1, -s.a, v)]), T1(1, [C(s.q)], [A(-1, s.a, v)], { ad: true })];
    } else if (kind === 'b') { // c v/(v − a) − d/(a − v) = (c v + d)/(v − a)
      var b = pickWhere(function () { return { a: r.int(1, 9), c: r.int(1, 4), d: r.int(1, 9) }; }, function (z) { return !(z.c === 1 && z.a === 6 && z.d === 6) && z.d !== z.c * z.a; });
      terms = [T1(1, [Mo(b.c, v, 1)], [A(1, -b.a, v)]), T1(-1, [C(b.d)], [A(-1, b.a, v)], { ad: true })];
    } else { // p/(v² − a²) + q/(a − v)
      var c = pickWhere(function () { return { a: r.int(1, 7), p: r.int(1, 9), q: r.int(1, 5) }; }, function (z) { return z.p !== 2 * z.q * z.a && !(z.a === 1 && z.p === 5 && z.q === 2) && z.p !== z.q * 2 * z.a; });
      terms = [T1(1, [C(c.p)], [A(1, -c.a, v), A(1, c.a, v)]), T1(1, [C(c.q)], [A(-1, c.a, v)], { ad: true })];
    }
    return sumPart(CP, SIMP, terms, v, {}, H_OPP, 'opposite factors: ' + kind);
  }

  /* ---------- 6: simplify each expression first ---------- */
  function first6(r, kind) {
    var v = vOf(r), terms, sol;
    if (kind === 'a') { // (v − a)(v + b)/((v + b)(v − c)) ± k/(v − c) = (v − a ± k)/(v − c)
      var s = pickWhere(function () { var m = monics(r, 3, 6); return { a: m[0], b: m[1], c: m[2], k: r.int(1, 9), sub: r.chance(0.35) }; }, function (z) {
        return z.a !== z.c && -z.b !== z.c && (z.sub ? z.c - z.a - z.k : z.c - z.a + z.k) !== 0 && small2(z.b, -z.c) && small2(-z.a, z.b) && !(z.a === 2 && z.b === 2 && z.c === 1) && (z.sub ? -z.a - z.k : -z.a + z.k) !== z.b; });
      var n1 = [A(1, -s.a, v), A(1, s.b, v)], d1 = [A(1, s.b, v), A(1, -s.c, v)];
      terms = [T1(1, n1, d1), T1(s.sub ? -1 : 1, [C(s.k)], [A(1, -s.c, v)])];
      var red = [T1(1, [A(1, -s.a, v)], [A(1, -s.c, v)]), T1(s.sub ? -1 : 1, [C(s.k)], [A(1, -s.c, v)])], S2 = sumAll(red, v), npv = npvOf([d1, [A(1, -s.c, v)]]);
      sol = 'Simplify the first expression: ' + t(fracF(n1, d1) + '=' + fracE([A(1, -s.a, v)], [A(1, -s.c, v)])) + '. NPVs (from the original denominators): ' + t(npvTex(npv)) + '.<br>' + t(termsTex(red) + '=' + S2.step + (sumKey(S2) !== S2.step ? '=' + sumKey(S2) : '')) + '.';
    } else { // k(v − a)/((v − a)(v + b)) − q/(v + c) = k/(v + b) − q/(v + c)
      var b = pickWhere(function () { var m = monics(r, 3, 6); return { a: m[0], b: m[1], c: m[2], k: r.int(2, 5), q: r.int(1, 4) }; }, function (z) { return small2(-z.a, z.b) && z.k !== z.q && !(z.a === 3 && z.b === 2 && z.c === 3) && (z.k - z.q) !== 0 && (z.k * z.c - z.q * z.b) !== 0 && ((z.k * z.c - z.q * z.b) % (z.k - z.q) !== 0 || ((z.k * z.c - z.q * z.b) / (z.k - z.q) !== z.b && (z.k * z.c - z.q * z.b) / (z.k - z.q) !== z.c)); });
      var n1b = [C(b.k), A(1, -b.a, v)], d1b = [A(1, -b.a, v), A(1, b.b, v)];
      terms = [T1(1, n1b, d1b), T1(-1, [C(b.q)], [A(1, b.c, v)])];
      var redb = [T1(1, [C(b.k)], [A(1, b.b, v)]), T1(-1, [C(b.q)], [A(1, b.c, v)])], S3 = sumAll(redb, v), npvb = npvOf([d1b, [A(1, b.c, v)]]);
      sol = 'Simplify the first expression: ' + t(fracF(n1b, d1b) + '=' + fracE([C(b.k)], [A(1, b.b, v)])) + '. NPVs (from the original denominators): ' + t(npvTex(npvb)) + '.<br>' + t(termsTex(redb) + '=' + S3.step + '=' + S3.mid + (sumKey(S3) !== S3.mid ? '=' + sumKey(S3) : '')) + '.';
    }
    return sumPart(CP, 'Simplify each expression on its own first, then combine. State the non-permissible values.', terms, v, { sol: sol }, ['Factor the first expression and divide out its common factor — but take the NPVs from the <b>original</b> denominators.', 'Then add or subtract the simpler fractions.'], 'simplify first: ' + kind);
  }

  /* ---------- 7: a trinomial and an opposite difference of squares ---------- */
  function show7(r) {
    var v = 'x', s = pickWhere(function () { var m = monics(r, 2, 7, function (a) { return a[0] > 1 && Math.abs(a[1]) !== a[0]; }); return { a: m[0], b: m[1], p: r.int(1, 5), q: r.int(1, 3) }; }, function (z) {
      return small2(-z.a, z.b) && !(z.a === 5 && z.b === 1 && z.p === 3 && z.q === 1) && (z.p - z.q) !== 0; });
    var terms = [T1(1, [C(s.p)], [A(1, -s.a, v), A(1, s.b, v)]), T1(1, [C(s.q)], [A(-1, s.a, v), A(1, s.a, v)], { ad: true })];
    return sumPart(CP, SIMP, terms, v, { solPost: '' }, ['Factor both denominators. ' + t(s.a * s.a + '-x^{2}') + ' is ' + t('-(x-' + s.a + ')(x+' + s.a + ')') + ': the minus sign changes the ' + t('+') + ' in front of the fraction to ' + t('-') + '.', 'The LCD has three different factors. Combine, then factor the numerator.'], 'trinomial and opposite difference of squares');
  }

  /* ---------- 8: Maya's claim ---------- */
  function mayaShared(r) { return pickWhere(function () { return { a: r.int(1, 6), p: r.int(1, 4), x0: r.int(2, 9) }; }, function (z) { return z.x0 !== z.a && !(z.a === 1 && z.p === 1 && z.x0 === 3); }); }
  function mayaClaim(s) { var pp = s.p === 1 ? '1' : String(s.p); return '\\frac{' + pp + '}{x-' + s.a + '}-\\frac{' + pp + '}{x+' + s.a + '}=\\frac{' + 2 * s.a * s.p + '}{x^{2}-' + s.a * s.a + '}'; }

  /* ---------- 9: a student's sign error in a subtracted product ---------- */
  function errShared(r) {
    var v = 'x', s = pickWhere(function () { var m = monics(r, 3, 6); return { p: m[0], a: m[1], q: m[2] }; }, function (z) { return z.a > 0 && z.q !== z.a && z.q !== -z.a && z.p !== z.a && !(z.p === 2 && z.a === 3 && z.q === -1); });
    s.v = v; s.terms = [T1(1, [A(1, s.p, v)], [A(1, -s.a, v)]), T1(-1, [A(1, s.q, v)], [A(1, s.a, v)])];
    s.P1 = P.mul(L(1, s.p), L(1, s.a)); s.P2 = P.mul(L(1, s.q), L(1, -s.a));
    var rest = P.sub(s.P2, P.mono(1, { x: 2 })); s.wrongN = P.add(s.P1, P.mono(-1, { x: 2 }), rest); s.rest = rest;
    s.S = sumAll(s.terms, v);
    return s;
  }
  function errWork(s) {
    var D = '(x-' + s.a + ')(x+' + s.a + ')', rt0 = tx(s.rest), restT = rt0.charAt(0) === '-' ? rt0 : '+' + rt0;
    return t('\\frac{' + tx(L(1, s.p)) + '}{x-' + s.a + '}-\\frac{' + tx(L(1, s.q)) + '}{x+' + s.a + '}=\\frac{(' + tx(L(1, s.p)) + ')(x+' + s.a + ')-(' + tx(L(1, s.q)) + ')(x-' + s.a + ')}{' + D + '}=\\frac{' + tx(s.P1) + '-x^{2}' + restT + '}{' + D + '}=\\frac{' + tx(s.wrongN) + '}{' + D + '}');
  }

  /* ---------- 10: rectangle ---------- */
  function rectShared(r) { return pickWhere(function () { return { p: r.int(1, 9), q: r.int(1, 9), a: r.int(1, 6), dx: r.int(1, 6) }; }, function (z) { return z.p !== z.q && !(z.p === 4 && z.q === 2 && z.a === 2); }); }
  function rectP(s) { var terms = [T1(1, [C(s.p)], [A(1, -s.a)]), T1(1, [C(s.q)], [A(1, s.a)])], S = sumAll(terms, 'x'); return { terms: terms, S: S, Pc: cMul(S.T, 2) }; }

  /* ---------- 11: cyclist ---------- */
  function cycShared(r) { return pickWhere(function () { return { d: r.pick([12, 15, 18, 20, 24, 30, 36, 40]), c: r.int(2, 8), x0: r.int(8, 25) }; }, function (z) { return !(z.d === 24 && z.c === 4) && (z.d / z.x0 + z.d / (z.x0 + z.c)) * 100 % 1 !== 0 || r.chance(0.3); }); }

  /* ---------- 12: complex fractions ---------- */
  function cx12a(r) {
    var v = pickVar(r), k = pickWhere(function () { return r.int(2, 9); }, function (x) { return x !== 3; }), flip = r.chance(0.4);
    // (1/v − 1/k)/(v − k) = (k − v)/(k v) ÷ (v − k) = −1/(k v);  flip: (1/k − 1/v)/(v − k) = 1/(k v)
    var T = canon([[C(flip ? 1 : -1)]], [[Mo(k, v, 1)]]), npv = npvOf([[Mo(1, v, 1)], [A(1, -k, v)]]);
    var top = flip ? '\\dfrac{1}{' + k + '}-\\dfrac{1}{' + v + '}' : '\\dfrac{1}{' + v + '}-\\dfrac{1}{' + k + '}', topS = flip ? '\\frac{' + v + '-' + k + '}{' + k + v + '}' : '\\frac{' + k + '-' + v + '}{' + k + v + '}';
    var sol = 'The top: ' + t(topS) + (flip ? '' : t('=\\frac{-(' + v + '-' + k + ')}{' + k + v + '}')) + '. Divide by ' + t(v + '-' + k) + ' (multiply by ' + t('\\frac{1}{' + v + '-' + k + '}') + '): ' + t(cTex(T)) + '.<br>NPVs: ' + t(v + '\\ne 0') + ' (the small denominator) and ' + t(v + '\\ne ' + k) + ' (the divisor): ' + t(npvTex(npv)) + '.';
    return simpPart(CP, 'Simplify the complex fraction. State the non-permissible values. ' + t('\\dfrac{' + top + '}{' + v + '-' + k + '}'), T, npv, { vars: [v], nw: [{ vals: npvOf([[Mo(1, v, 1)]]), code: CP + 'npv-missing', hint: 'The divisor ' + t(v + '-' + k) + ' cannot be ' + t(0) + ' either.' }] }, sol,
      ['Write the top as a single fraction. Watch for ' + t(k + '-' + v + '=-(' + v + '-' + k + ')') + '.', 'Dividing by ' + t(v + '-' + k) + ' is multiplying by its reciprocal.'], 'complex fraction: divide by a binomial');
  }
  function cx12b(r) {
    var v = pickVar(r), s = pickWhere(function () { return { c: r.int(2, 6), d: r.int(1, 5) }; }, function (z) { return !(z.c === 2 && z.d === 1); });
    var cd = s.c * s.d, d2 = s.d * s.d, T = canon([[C(s.c), Mo(1, v, 1)]], [[A(1, s.d, v)]]), npv = npvOf([[Mo(1, v, 1)], [A(1, -s.d, v), A(1, s.d, v)]]);
    var prompt = 'Simplify the complex fraction. State the non-permissible values. ' + t('\\dfrac{' + s.c + '-\\dfrac{' + cd + '}{' + v + '}}{1-\\dfrac{' + d2 + '}{' + v + '^{2}}}');
    var sol = 'Top: ' + t('\\frac{' + s.c + '(' + v + '-' + s.d + ')}{' + v + '}') + '. Bottom: ' + t('\\frac{' + v + '^{2}-' + d2 + '}{' + v + '^{2}}=\\frac{(' + v + '-' + s.d + ')(' + v + '+' + s.d + ')}{' + v + '^{2}}') + '.<br>' + t('\\frac{' + s.c + '(' + v + '-' + s.d + ')}{' + v + '}\\times\\frac{' + v + '^{2}}{(' + v + '-' + s.d + ')(' + v + '+' + s.d + ')}=' + cTex(T)) + '.<br>NPVs: ' + t(v + '\\ne 0') + ', and the divisor is ' + t(0) + ' when ' + t(v + '=\\pm ' + s.d) + ': ' + t(npvTex(npv)) + '.';
    return simpPart(CP, prompt, T, npv, { vars: [v], nw: [{ vals: npvOf([[Mo(1, v, 1)], [A(1, s.d, v)]]), code: CP + 'npv-cancel', hint: 'The divisor ' + t('1-\\frac{' + d2 + '}{' + v + '^{2}}') + ' is ' + t(0) + ' when ' + t(v + '=' + s.d) + ' as well as ' + t(v + '=-' + s.d) + '.' }, { vals: npvOf([[Mo(1, v, 1)]]), code: CP + 'npv-missing', hint: 'The divisor cannot be ' + t(0) + ': solve ' + t('1-\\frac{' + d2 + '}{' + v + '^{2}}=0') + '.' }] }, sol,
      ['Write the top and the bottom each as one fraction (LCDs ' + t(v) + ' and ' + t(v + '^{2}') + ').', 'Divide by multiplying by the reciprocal, factor the difference of squares and divide out.'], 'complex fraction: two levels');
  }

  /* ---------- MC (13–15, EP B4) ---------- */
  function mc13(r) {
    var a = pickWhere(function () { return r.int(2, 9); }, function (x) { return x !== 3; }), k = r.pick([1, 1, 2]);
    var D = 'x^{2}-' + a * a, opts = [{ html: t('\\frac{' + k + '}{x+' + a + '}'), right: true }, { html: t('\\frac{' + (k - 2 * k * a) + '}{' + D + '}'), why: 'Multiply the first numerator by ' + t('x+' + a) + ' before subtracting.', code: 'nomult' },
      { html: t('\\frac{' + k + 'x-' + (k * a + 2 * k * a) + '}{' + D + '}').replace('\\frac{1x', '\\frac{x'), why: 'The first fraction is missing the factor ' + t('x+' + a) + ', not ' + t('x-' + a) + '.', code: 'wrongfac' }, { html: t('\\frac{' + k + '}{x-' + a + '}'), why: 'Check which factor divides out: the numerator is ' + t(k + '(x-' + a + ')') + '.', code: 'cancel' }];
    opts[2].html = t('\\frac{' + tx(L(k, -k * a - 2 * k * a)) + '}{' + D + '}');
    return mcPart(r, 'For ' + t('x\\ne\\pm ' + a) + ', ' + t('\\frac{' + k + '}{x-' + a + '}-\\frac{' + 2 * k * a + '}{' + D + '}') + ' simplifies to', opts,
      t('\\frac{' + k + '(x+' + a + ')-' + 2 * k * a + '}{(x-' + a + ')(x+' + a + ')}=\\frac{' + tx(L(k, -k * a)) + '}{(x-' + a + ')(x+' + a + ')}=\\frac{' + k + '(x-' + a + ')}{(x-' + a + ')(x+' + a + ')}=\\frac{' + k + '}{x+' + a + '}') + '.', H_FAC, 'MC: a difference that simplifies');
  }
  function mc14(r) {
    var s = pickWhere(function () { return { c: r.int(2, 6), a: r.int(2, 9) }; }, function (z) { return !(z.c === 2 && z.a === 5); });
    var opts = [{ html: t(String(s.c)), right: true }, { html: t('\\frac{' + s.c + 'x+' + s.c * s.a + '}{x-' + s.a + '}'), why: t(s.a + '-x') + ' is ' + t('-(x-' + s.a + ')') + ': the second fraction changes sign.', code: 'opp' },
      { html: t(String(-s.c)), why: 'Check the sign: after rewriting, the numerator is ' + t(s.c + 'x-' + s.c * s.a + '=' + s.c + '(x-' + s.a + ')') + '.', code: 'sign' }, { html: t('\\frac{' + s.c + 'x-' + s.c * s.a + '}{x^{2}-' + s.a * s.a + '}'), why: 'The denominators are opposites, not different factors: do not multiply them.', code: 'mult' }];
    return mcPart(r, 'For ' + t('x\\ne ' + s.a) + ', ' + t('\\frac{' + s.c + 'x}{x-' + s.a + '}+\\frac{' + s.c * s.a + '}{' + s.a + '-x}') + ' is equal to', opts,
      t('\\frac{' + s.c + 'x}{x-' + s.a + '}-\\frac{' + s.c * s.a + '}{x-' + s.a + '}=\\frac{' + s.c + '(x-' + s.a + ')}{x-' + s.a + '}=' + s.c) + '.', H_OPP, 'MC: opposite denominators');
  }
  function mc15(r) {
    var m = monics(r, 2, 6, function (a) { return small2(a[0], a[1]) && a[0] !== -a[1]; }), a = m[0], b = m[1], p = r.int(1, 7);
    // p/((x − a)(x + b)) − 1/(x² + b x) = p/((x−a)(x+b)) − 1/(x(x + b))
    var d1 = tx(P.mul(L(1, -a), L(1, b))), d2 = tx(P.mul(P.v('x'), L(1, b)));
    var right = npvTex({ x: [[a, 1], [-b, 1], [0, 1]].sort(function (u, w) { return u[0] - w[0]; }) });
    var o1 = npvTex({ x: [[a, 1], [-b, 1]].sort(function (u, w) { return u[0] - w[0]; }) }), o2 = npvTex({ x: [[-a, 1], [b, 1], [0, 1]].sort(function (u, w) { return u[0] - w[0]; }) }), o3 = npvTex({ x: [[0, 1], [-b, 1]].sort(function (u, w) { return u[0] - w[0]; }) });
    var opts = [{ html: t(right), right: true }, { html: t(o1), why: 'The second denominator ' + t('x(x' + sg(b) + ')') + ' adds ' + t('x\\ne 0') + '.', code: 'one' }, { html: t(o2), why: 'Check the signs: ' + t('x' + sg(-a) + '=0') + ' gives ' + t('x=' + a) + '.', code: 'sign' }, { html: t(o3), why: 'The first denominator factors as ' + t('(x' + sg(-a) + ')(x' + sg(b) + ')') + ': it adds ' + t('x\\ne ' + a) + '.', code: 'two' }];
    if (opts.some(function (o, i) { return opts.some(function (o2, j) { return j < i && o2.html === o.html; }); })) return mc15(r);
    return mcPart(r, 'The non-permissible values of ' + t('\\frac{' + p + '}{' + d1 + '}-\\frac{1}{' + d2 + '}') + ' are', opts,
      t(d1 + '=(x' + sg(-a) + ')(x' + sg(b) + ')') + ' and ' + t(d2 + '=x(x' + sg(b) + ')') + ', so ' + t(right) + '.', ['Factor each denominator; each factor gives an NPV.'], 'MC: NPVs of a difference');
  }
  function mcB4(r) { // (x + p)/(x² + (b−a)x − ab) − k/(x − a)
    var s = pickWhere(function () { return { a: r.int(1, 6), b: r.int(1, 6), p: nz(r, 1, 9), k: r.int(2, 4) }; }, function (z) { return z.a !== z.b && !(z.a === 2 && z.b === 1 && z.p === 5 && z.k === 2) && z.p - z.k * z.b !== 0 && z.k !== 1 && (z.p - z.k * z.b) !== -z.b * (1 - z.k) && (1 - z.k) !== 0; });
    var D = tx(P.mul(L(1, -s.a), L(1, s.b))), Df = '(x-' + s.a + ')(x+' + s.b + ')', c = s.p - s.k * s.b, A1 = 1 - s.k;
    var nT = function (A0, B0) { var q = L(A0, B0); return P.lead(q)[0] < 0 && P.constant(q)[0] > 0 ? U.txa(q) : tx(q); };
    var opts = [{ html: t('\\frac{' + nT(A1, c) + '}{' + Df + '}'), right: true }, { html: t('\\frac{' + nT(A1, s.p + s.k * s.b) + '}{' + Df + '}'), why: 'The minus sign applies to the whole product: ' + t('-' + s.k + '(x+' + s.b + ')=-' + s.k + 'x-' + s.k * s.b) + '.', code: 'sign' },
      { html: t('\\frac{' + nT(-A1, c) + '}{' + Df + '}'), why: 'Check the sign of the ' + t('x') + '-term: ' + t('x-' + s.k + 'x=' + coefT(A1) + 'x') + '.', code: 'xsign' }, { html: t('\\frac{' + nT(A1, s.p - s.k) + '}{' + Df + '}'), why: 'Multiply both terms of ' + t('(x+' + s.b + ')') + ' by ' + t(s.k) + '.', code: 'dist' }];
    if (opts.some(function (o, i) { return opts.some(function (o2, j) { return j < i && o2.html === o.html; }); })) return mcB4(r);
    return mcPart(r, 'For ' + t('x\\ne ' + s.a + ',\\ ' + (-s.b)) + ', ' + t('\\frac{' + tx(L(1, s.p)) + '}{' + D + '}-\\frac{' + s.k + '}{x-' + s.a + '}') + ' simplifies to', opts,
      t(D + '=' + Df) + '; ' + t('\\frac{' + tx(L(1, s.p)) + '-' + s.k + '(x+' + s.b + ')}{' + Df + '}=\\frac{' + nT(A1, c) + '}{' + Df + '}') + '.', H_FAC, 'MC: trinomial minus binomial');
  }

  /* ---------- NR (16, 17, EP B5) ---------- */
  function nr16(r) { // p/(x − a) + q/(x + a) − 2pa/(x² − a²) = (p + q)/(x + a)
    var s = pickWhere(function () { return { a: r.int(1, 6), p: r.int(1, 9), q: r.int(1, 9) }; }, function (z) { return !(z.a === 1 && z.p === 4 && z.q === 1) && z.p + z.q > 0; });
    var K0 = 2 * s.p * s.a, k = s.p + s.q;
    var prompt = 'For ' + t('x\\ne\\pm ' + s.a) + ', ' + t('\\frac{' + s.p + '}{x-' + s.a + '}+\\frac{' + s.q + '}{x+' + s.a + '}-\\frac{' + K0 + '}{x^{2}-' + s.a * s.a + '}') + ' simplifies to ' + t('\\frac{k}{x+' + s.a + '}') + '. The value of ' + t('k') + ' is ______.';
    var sol = t('\\frac{' + s.p + '(x+' + s.a + ')+' + s.q + '(x-' + s.a + ')-' + K0 + '}{(x-' + s.a + ')(x+' + s.a + ')}=\\frac{' + tx(L(k, -k * s.a)) + '}{(x-' + s.a + ')(x+' + s.a + ')}=\\frac{' + k + '(x-' + s.a + ')}{(x-' + s.a + ')(x+' + s.a + ')}=\\frac{' + k + '}{x+' + s.a + '}') + ', so ' + t('k=' + k) + '.';
    return KP.nr(prompt, k, null, sol, ['Use the LCD ' + t('(x-' + s.a + ')(x+' + s.a + ')') + ' and combine all three numerators.', 'Factor the numerator: one factor divides out.'], 'NR: k after simplifying');
  }
  function nrAB(r, mode) { // p/((x − a)(x + b)) + q/((x − b)(x + b)) = (Ax + B)/(…), A − B  |  EP: p/(x − a) + q/(x + b), A + B
    var s = pickWhere(function () { return { a: r.int(1, 6), b: nz(r, 1, 6), p: r.int(1, 6), q: r.int(1, 6) }; }, function (z) {
      if (mode === 'tri') { if (z.a === z.b || z.a === -z.b || z.b < 0 && z.a === -z.b) return false; z.A = z.p + z.q; z.B = -z.p * z.b - z.q * z.a; z.ans = z.A - z.B; return z.ans > 0 && z.ans < 1000 && !(z.a === 3 && z.b === 2 && z.p === 2 && z.q === 3); }
      if (z.a === -z.b) return false; z.A = z.p + z.q; z.B = z.p * z.b - z.q * z.a; z.ans = z.A + z.B; return z.ans > 0 && z.ans < 1000 && !(z.a === 2 && z.b === 3 && z.p === 3 && z.q === 2);
    });
    var prompt, sol, D;
    if (mode === 'tri') {
      D = '(x' + sg(s.b) + ')(x-' + s.a + ')(x' + sg(-s.b) + ')';
      prompt = 'When simplified, ' + t('\\frac{' + s.p + '}{' + tx(P.mul(L(1, -s.a), L(1, s.b))) + '}+\\frac{' + s.q + '}{x^{2}-' + s.b * s.b + '}') + ' can be written as ' + t('\\frac{Ax+B}{' + D + '}') + ', where ' + t('A') + ' and ' + t('B') + ' are integers. The value of ' + t('A-B') + ' is ______.';
      sol = t('\\frac{' + s.p + '}{(x-' + s.a + ')(x' + sg(s.b) + ')}+\\frac{' + s.q + '}{(x' + sg(-s.b) + ')(x' + sg(s.b) + ')}=\\frac{' + s.p + '(x' + sg(-s.b) + ')+' + s.q + '(x-' + s.a + ')}{' + D + '}=\\frac{' + tx(L(s.A, s.B)) + '}{' + D + '}') + '. ' + t('A=' + s.A) + ', ' + t('B=' + s.B) + ', ' + t('A-B=' + s.ans) + '.';
    } else {
      D = '(x-' + s.a + ')(x' + sg(s.b) + ')';
      prompt = 'The expression ' + t('\\frac{' + s.p + '}{x-' + s.a + '}+\\frac{' + s.q + '}{x' + sg(s.b) + '}') + ' can be written as ' + t('\\frac{Ax+B}{' + D + '}') + '. The value of ' + t('A+B') + ' is ______.';
      sol = t('\\frac{' + s.p + '(x' + sg(s.b) + ')+' + s.q + '(x-' + s.a + ')}{' + D + '}=\\frac{' + tx(L(s.A, s.B)) + '}{' + D + '}') + '. ' + t('A=' + s.A) + ', ' + t('B=' + s.B) + ', ' + t('A+B=' + s.ans) + '.';
    }
    var alt = mode === 'tri' ? s.A + s.B : s.A - s.B;
    return KP.nr(prompt, s.ans, function (v) { if (v === alt && alt !== s.ans) return { code: 'value', hint: mode === 'tri' ? 'The question asks for ' + t('A-B') + '.' : 'The question asks for ' + t('A+B') + '.' }; return null; }, sol, ['Factor the denominators and use the LCD shown.', 'Expand the numerator: ' + t('A') + ' is the coefficient of ' + t('x') + ', ' + t('B') + ' the constant.'], mode === 'tri' ? 'NR: A − B' : 'NR: A + B');
  }

  /* ---------- "values that make sense" (10b, EP B2c) ---------- */
  function senseMC(r, a, what, lowName) {
    var opts = [{ html: t('x>' + a), right: true }, { html: t('x>-' + a), why: 'For ' + t('-' + a + '<x\\le ' + a) + ', ' + lowName + ' is not positive.', code: 'neg' },
      { html: t('x\\ne\\pm ' + a), why: 'Those are only the NPVs. A ' + what + ' must also be positive.', code: 'npv' }, { html: t('x>0'), why: 'For ' + t('0<x\\le ' + a) + ', ' + lowName + ' is not positive.', code: 'zero' }];
    return opts;
  }

  /* ---------- EP C2: A and B ---------- */
  function abPart(r) {
    var s = pickWhere(function () { var m = monics(r, 2, 5); return { a: m[0], b: m[1], A: nz(r, 1, 6), B: nz(r, 1, 6) }; }, function (z) { return !(z.a === 1 && z.b === -2 && z.A === 2 && z.B === 3) && z.A !== z.B && (z.A + z.B) !== 0; });
    // A/(x + a) + B/(x + b) = ((A + B)x + (A b + B a))/((x + a)(x + b))
    var N = L(s.A + s.B, s.A * s.b + s.B * s.a), D = '(x' + sg(s.a) + ')(x' + sg(s.b) + ')';
    var chk = function (resp) {
      var ra = K.value(s.A)(resp[0] == null ? '' : resp[0]), rb = K.value(s.B)(resp[1] == null ? '' : resp[1]);
      if (ra.v === 'correct' && rb.v === 'correct') return ok();
      if (ra.v === 'form') return ra; if (rb.v === 'form') return rb;
      var a0 = K.read(resp[0]).val, b0 = K.read(resp[1]).val;
      if (Math.abs(a0 - s.B) < 1e-9 && Math.abs(b0 - s.A) < 1e-9) return wrong(CP + 'AB-swap', 'Swapped: ' + t('A') + ' goes with ' + t('x' + sg(s.a)) + ', so it is multiplied by ' + t('x' + sg(s.b)) + '.');
      return wrong('value', 'Expand ' + t('A(x' + sg(s.b) + ')+B(x' + sg(s.a) + ')') + ' and match the coefficients with ' + t(tx(N)) + ': the ' + t('x') + '-terms and the constants.');
    };
    var sol = t('A(x' + sg(s.b) + ')+B(x' + sg(s.a) + ')=(A+B)x+(' + (s.b === 1 ? '' : s.b === -1 ? '-' : s.b) + 'A' + (s.a < 0 ? '-' : '+') + (Math.abs(s.a) === 1 ? '' : Math.abs(s.a)) + 'B)=' + tx(N)) + '.<br>' + t('A+B=' + (s.A + s.B)) + ' and ' + t((s.b === 1 ? '' : s.b === -1 ? '-' : s.b) + 'A' + (s.a < 0 ? '-' : '+') + (Math.abs(s.a) === 1 ? '' : Math.abs(s.a)) + 'B=' + (s.A * s.b + s.B * s.a)) + '. Solving: ' + t('A=' + s.A) + ', ' + t('B=' + s.B) + '.';
    return { prompt: 'Determine the constants ' + t('A') + ' and ' + t('B') + ' so that ' + t('\\frac{A}{x' + sg(s.a) + '}+\\frac{B}{x' + sg(s.b) + '}=\\frac{' + tx(N) + '}{' + D + '}') + '.', input: { type: 'fields', fields: [{ label: t('A='), name: 'A', mode: 'math', keys: 'u6knum' }, { label: t('B='), name: 'B', mode: 'math', keys: 'u6knum' }] },
      check: chk, key: [String(s.A), String(s.B)], answer: t('A=' + s.A + ',\\ B=' + s.B), solution: sol, hints: ['Add the left side over ' + t(D) + ': the numerator is ' + t('A(x' + sg(s.b) + ')+B(x' + sg(s.a) + ')') + '.', 'Match the coefficient of ' + t('x') + ' and the constant term: two equations in ' + t('A') + ' and ' + t('B') + '.'], text: 'constants A and B', bad: [[String(s.B), String(s.A)]] };
  }

  /* ======================================================================================================
   * The questions
   * ====================================================================================================== */
  var QUESTIONS = [
    { num: '1', parts: [
      { id: '1a', level: 'BEG', make: function (r) { return bin1(r, 'a'); } },
      { id: '1b', level: 'BEG', make: function (r) { return bin1(r, 'b'); } },
      { id: '1c', level: 'EMG', make: function (r) { return bin1(r, 'c'); } },
      { id: '1d', level: 'EMG', make: function (r) { return bin1(r, 'd'); } },
      { id: '1e', level: 'PRG', make: function (r) { return bin1(r, 'e'); } }] },
    { num: '2', parts: [
      { id: '2a', level: 'PRG', make: function (r) { return bin2(r, 'a'); } },
      { id: '2b', level: 'PRG', make: function (r) { return bin2(r, 'b'); } },
      { id: '2c', level: 'PRG', make: function (r) { return bin2(r, 'c'); } },
      { id: '2d', level: 'EMG', make: function (r) { return bin2(r, 'd'); } },
      { id: '2e', level: 'EMG', make: function (r) { return bin2(r, 'e'); } }] },
    { num: '3', parts: [
      { id: '3a', level: 'EMG', make: function (r) { return fac3(r, 'a'); } },
      { id: '3b', level: 'PRG', make: function (r) { return fac3(r, 'b'); } },
      { id: '3c', level: 'PRG', make: function (r) { return fac3(r, 'c'); } },
      { id: '3d', level: 'PRG', make: function (r) { return fac3(r, 'd'); } },
      { id: '3e', level: 'ADV', make: function (r) { return fac3(r, 'e'); } },
      { id: '3f', level: 'ADV', make: function (r) { return fac3(r, 'f'); } }] },
    { num: '4', parts: [
      { id: '4a', level: 'PRG', make: function (r) { return tri4(r, 'a'); } },
      { id: '4b', level: 'PRG', make: function (r) { return tri4(r, 'b'); } },
      { id: '4c', level: 'PRG', make: function (r) { return tri4(r, 'c'); } },
      { id: '4d', level: 'ADV', make: function (r) { return tri4(r, 'd'); } },
      { id: '4e', level: 'MAS', make: function (r) { return tri4(r, 'e'); } }] },
    { num: '5', parts: [
      { id: '5a', level: 'EMG', make: function (r) { return opp5(r, 'a'); } },
      { id: '5b', level: 'PRG', make: function (r) { return opp5(r, 'b'); } },
      { id: '5c', level: 'PRG', make: function (r) { return opp5(r, 'c'); } }] },
    { num: '6', parts: [
      { id: '6a', level: 'ADV', make: function (r) { return first6(r, 'a'); } },
      { id: '6b', level: 'ADV', make: function (r) { return first6(r, 'b'); } }] },
    { num: '7', parts: [{ id: '7', level: 'ADV', make: function (r) { return show7(r); } }] },
    { num: '8', shared: mayaShared, stem: function (s) { return 'Maya claims that ' + t(mayaClaim(s)) + '.'; }, parts: [
      { id: '8a', level: 'EMG', make: function (r, s) {
        var Lq = ex.norm(s.p * (s.x0 + s.a) - s.p * (s.x0 - s.a), (s.x0 - s.a) * (s.x0 + s.a)), Rq = ex.norm(2 * s.a * s.p, s.x0 * s.x0 - s.a * s.a);
        var pp = s.p;
        var p = boxes('Test her claim with ' + t('x=' + s.x0) + ': work out each side.', [{ label: 'Left side:', check: K.value(Lq), key: rt(Lq), keys: 'u6knum' }, { label: 'Right side:', check: K.value(Rq), key: rt(Rq), keys: 'u6knum' }],
          'Left: ' + t('\\frac{' + pp + '}{' + (s.x0 - s.a) + '}-\\frac{' + pp + '}{' + (s.x0 + s.a) + '}=' + rt(Lq)) + '. Right: ' + t('\\frac{' + 2 * s.a * pp + '}{' + (s.x0 * s.x0 - s.a * s.a) + '}=' + rt(Rq)) + '. Equal for ' + t('x=' + s.x0) + ' — but one value does not prove the claim.', ['Substitute ' + t('x=' + s.x0) + ' into each side separately.'], 'test a claim with a value');
        p.bad = [[rt(ex.norm(pp, s.x0 - s.a)), rt(Rq)]];
        return p;
      } },
      { id: '8b', level: 'PRG', make: function (r, s) {
        var terms = [T1(1, [C(s.p)], [A(1, -s.a)]), T1(-1, [C(s.p)], [A(1, s.a)])];
        return sumPart(CP, 'One value does not prove the claim. Simplify the left side and state the non-permissible values (it should match the right side).', terms, 'x', { noTerms: true, solPost: '<br>' + t('(x-' + s.a + ')(x+' + s.a + ')=x^{2}-' + s.a * s.a) + ', so the claim is true for ' + t('x\\ne\\pm ' + s.a) + '.' }, ['The LCD is ' + t('(x-' + s.a + ')(x+' + s.a + ')') + '.', 'Put the second numerator times its factor in brackets before subtracting.'], 'prove the claim');
      } }] },
    { num: '9', shared: errShared, stem: function (s) { return 'A student’s work is shown: ' + errWork(s) + '.'; }, parts: [
      { id: '9a', level: 'EMG', make: function (r, s) {
        var opts = [{ html: 'The product ' + t('(' + tx(L(1, s.q)) + ')(x-' + s.a + ')=' + tx(s.P2)) + ' was not subtracted as a whole: every one of its signs must change.', right: true },
          { html: 'The LCD should be ' + t('(x-' + s.a + ')^{2}(x+' + s.a + ')^{2}') + '.', why: 'The denominators have no common factor, so the LCD is their product ' + t('(x-' + s.a + ')(x+' + s.a + ')') + '.', code: 'lcd' },
          { html: 'Each numerator was multiplied by the wrong factor.', why: t(tx(L(1, s.p))) + ' is over ' + t('x-' + s.a) + ', so it is multiplied by ' + t('x+' + s.a) + ', as the student did.', code: 'factor' },
          { html: 'The ' + t('x^{2}') + ' terms should not cancel.', why: t('x^{2}-x^{2}=0') + ': they do cancel.', code: 'x2' }];
        return mcPart(r, 'What is the error?', opts, t('-(' + tx(s.P2) + ')=' + tx(P.neg(s.P2))) + ': the student changed only the sign of ' + t('x^{2}') + '.', ['Look at the step where the second product is subtracted.'], 'find the error: a subtracted product');
      } },
      { id: '9b', level: 'PRG', make: function (r, s) {
        return sumPart(CP, 'Simplify correctly and state the non-permissible values.', s.terms, 'x', { noTerms: true }, ['Subtract the whole product: ' + t('-(' + tx(s.P2) + ')=' + tx(P.neg(s.P2))) + '.', 'Collect like terms and factor the numerator if you can.'], 'find the error: the correct answer');
      } }] },
    { num: '10', shared: rectShared, stem: function (s) { return 'A rectangle has length ' + t('\\frac{' + s.p + '}{x-' + s.a + '}') + ' cm and width ' + t('\\frac{' + s.q + '}{x+' + s.a + '}') + ' cm.'; }, parts: [
      { id: '10a', level: 'PRG', make: function (r, s) {
        var o = rectP(s), key = cTex(o.Pc);
        var p = ratPart(CP, 'Write its perimeter as a single expression in simplest form.', o.Pc, { vars: ['x'], after: 'cm', dl: [{ cn: o.S.T, code: CP + 'perim', hint: 'That is the length plus the width. The perimeter is ' + t('2(l+w)') + '.' }] },
          t('P=2\\left(' + o.S.step + '\\right)=2\\left(' + o.S.mid + '\\right)=' + key) + ' cm.', ['Add the length and the width over the LCD ' + t('(x-' + s.a + ')(x+' + s.a + ')') + ', then double.'], 'perimeter as one expression');
        p.bad = [cTex(o.S.T)]; return p;
      } },
      { id: '10b', level: 'EMG', make: function (r, s) {
        return mcPart(r, 'Which values of ' + t('x') + ' make sense?', senseMC(r, s.a, 'length', 'the length ' + t('\\frac{' + s.p + '}{x-' + s.a + '}')), 'Both lengths must be positive: ' + t('x-' + s.a + '>0') + ' and ' + t('x+' + s.a + '>0') + ', so ' + t('x>' + s.a) + '.', ['A length must be positive: when is ' + t('x-' + s.a) + ' positive?'], 'values that make sense');
      } },
      { id: '10c', level: 'EMG', make: function (r, s) {
        var x0 = s.a + s.dx, o = rectP(s), val = ex.norm(2 * (s.p * (x0 + s.a) + s.q * (x0 - s.a)), (x0 - s.a) * (x0 + s.a));
        return valPart('Determine the perimeter when ' + t('x=' + x0) + '. Give the exact value.', val, function (v) { if (Math.abs(v - rv(val) / 2) < 1e-9) return { code: CP + 'perim', hint: 'That is the length plus the width: double it.' }; return null; },
          t('P=' + cTex(o.Pc)) + '. At ' + t('x=' + x0) + ': ' + t('2\\left(\\frac{' + s.p + '}{' + (x0 - s.a) + '}+\\frac{' + s.q + '}{' + (x0 + s.a) + '}\\right)=' + rt(val)) + ' cm.', ['Substitute into your simplified perimeter, or find each length and use ' + t('2(l+w)') + '.'], 'evaluate the perimeter', { after: 'cm' });
      } }] },
    { num: '11', shared: cycShared, stem: function (s) { return 'A cyclist rides ' + t(s.d) + ' km to a lake at an average speed of ' + t('x') + ' km/h and rides back ' + t(s.c) + ' km/h faster.'; }, parts: [
      { id: '11a', level: 'PRG', make: function (r, s) {
        var terms = [T1(1, [C(s.d)], [Mo(1, 'x', 1)]), T1(1, [C(s.d)], [A(1, s.c)])];
        return sumRatPart(CP, 'Write the total riding time as a single rational expression in simplest form.', terms, 'x', { noTerms: true, after: 'h', solPre: 'Time ' + t('=\\frac{' + s.d + '}{x}+\\frac{' + s.d + '}{x+' + s.c + '}') + '. ', solPost: '<br>The time is in hours (' + t('x>0') + ').' }, ['Each time is distance ÷ speed; the speed back is ' + t('x+' + s.c) + '.', 'Use the LCD ' + t('x(x+' + s.c + ')') + ' and factor the numerator.'], 'total time as one expression');
      } },
      { id: '11b', level: 'EMG', make: function (r, s) {
        var h = s.d / s.x0 + s.d / (s.x0 + s.c);
        return KP.approx('Determine the total time when ' + t('x=' + s.x0) + ', to the nearest hundredth of an hour.', h, 2, { after: 'h' }, t('\\frac{' + s.d + '}{' + s.x0 + '}+\\frac{' + s.d + '}{' + (s.x0 + s.c) + '}\\approx ' + K.roundTo(h, 2).toFixed(2)) + ' h.', ['Substitute into your expression (or into each time) and add.'], 'evaluate the time');
      } },
      { id: '11c', level: 'PRG', make: function (r, s) {
        var terms = [T1(1, [C(s.d)], [Mo(1, 'x', 1)]), T1(-1, [C(s.d)], [A(1, s.c)])], Ssum = sumAll([T1(1, [C(s.d)], [Mo(1, 'x', 1)]), T1(1, [C(s.d)], [A(1, s.c)])], 'x');
        return sumRatPart(CP, 'Write a simplified expression for how much longer the trip to the lake takes than the trip back.', terms, 'x', { noTerms: true, after: 'h', dl: [{ cn: Ssum.T, code: CP + 'other', hint: 'That is the total time. “How much longer” is a difference: (time there) − (time back).' }], solPre: 'Difference ' + t('=\\frac{' + s.d + '}{x}-\\frac{' + s.d + '}{x+' + s.c + '}') + '. ', solPost: '<br>In hours.' }, ['The slower trip (to the lake) takes longer: subtract the time back from the time there.', 'Use the LCD ' + t('x(x+' + s.c + ')') + '.'], 'difference of times');
      } }] },
    { num: '12', stem: '<b>Extension.</b>', parts: [
      { id: '12a', level: 'ADV', make: function (r) { return cx12a(r); } },
      { id: '12b', level: 'MAS', make: function (r) { return cx12b(r); } }] },
    { num: '13', parts: [{ id: '13', level: 'PRG', make: function (r) { return mc13(r); } }] },
    { num: '14', parts: [{ id: '14', level: 'EMG', make: function (r) { return mc14(r); } }] },
    { num: '15', parts: [{ id: '15', level: 'PRG', make: function (r) { return mc15(r); } }] },
    { num: '16', parts: [{ id: '16', level: 'ADV', make: function (r) { return nr16(r); } }] },
    { num: '17', parts: [{ id: '17', level: 'ADV', make: function (r) { return nrAB(r, 'tri'); } }] }
  ];

  var EXTRA = [
    { num: 'A1', section: 'A. Skills', parts: [
      { id: 'A1a', level: 'BEG', make: function (r) { return bin1(r, 'a'); } },
      { id: 'A1b', level: 'EMG', make: function (r) {
        var v = vOf(r), s = pickWhere(function () { return { c: r.int(2, 4), e: nz(r, 1, 5), p: r.int(1, 7), q: r.int(1, 7) }; }, function (z) { return gcd(z.c, Math.abs(z.e)) === 1 && !(z.c === 2 && z.e === 1 && z.p === 3 && z.q === 2) && z.p - z.q * z.c !== 0; });
        return sumPart(CP, SIMP, [T1(1, [C(s.p)], [A(s.c, s.e, v)]), T1(-1, [C(s.q)], [Mo(1, v, 1)])], v, {}, H_BIN, 'binomial and monomial denominators');
      } },
      { id: 'A1c', level: 'PRG', make: function (r) { return bin2(r, 'a'); } },
      { id: 'A1d', level: 'PRG', make: function (r) {
        var vv = r.pick([['x', 'y'], ['a', 'b'], ['m', 'n']]), u = vv[0], w = vv[1], s = pickWhere(function () { return { p: r.int(1, 6), q: r.int(1, 6), sub: r.chance(0.6) }; }, function (z) { return z.p !== z.q && !(z.p === 2 && z.q === 1); });
        var dm = P.sub(P.v(u), P.v(w)), dp = P.add(P.v(u), P.v(w));
        var terms = [T1(1, [C(s.p)], [Q(dm)]), T1(s.sub ? -1 : 1, [C(s.q)], [Q(dp)])];
        return sumRatPart(CP, 'Simplify. (The non-permissible values are ' + t(u + '\\ne\\pm ' + w) + '.)', terms, u, { vars: [u, w], solPost: '<br>NPVs: ' + t(u + '\\ne ' + w) + ' and ' + t(u + '\\ne -' + w) + '.' }, H_BIN, 'two-variable binomial denominators');
      } }] },
    { num: 'A2', parts: [
      { id: 'A2a', level: 'EMG', make: function (r) { return fac3(r, 'a'); } },
      { id: 'A2b', level: 'PRG', make: function (r) {
        var v = vOf(r), s = pickWhere(function () { return { a: nz(r, 1, 7), p: r.int(1, 9), q: r.int(1, 9) }; }, function (z) { return z.p !== z.q && !(z.a === 1 && z.p === 5 && z.q === 10); });
        return sumPart(CP, 'Factor the denominators first. Simplify fully and state the non-permissible values.', [T1(1, [C(s.p)], [A(1, s.a, v)]), T1(-1, [C(s.q)], [Mo(1, v, 1), A(1, s.a, v)])], v, {}, H_FAC, 'factor first: v(v + a)');
      } }] },
    { num: 'A3', parts: [
      { id: 'A3a', level: 'PRG', make: function (r) { return tri4(r, 'b'); } },
      { id: 'A3b', level: 'ADV', make: function (r) { return tri4(r, 'd'); } }] },
    { num: 'A4', parts: [
      { id: 'A4', level: 'PRG', make: function (r) {
        var v = vOf(r), s = pickWhere(function () { return { m: r.int(2, 5), e: r.int(1, 7), k: r.int(2, 4) }; }, function (z) { return gcd(z.m, z.e) === 1 && !(z.m === 2 && z.e === 3 && z.k === 2); });
        // k m v/(m v − e) + k e/(e − m v) = k
        var terms = [T1(1, [Mo(s.k * s.m, v, 1)], [A(s.m, -s.e, v)]), T1(1, [C(s.k * s.e)], [A(-s.m, s.e, v)], { ad: true })];
        return sumPart(CP, SIMP, terms, v, {}, H_OPP, 'opposite denominators: a constant');
      } }] },
    { num: 'B1', section: 'B. Applying', parts: [
      { id: 'B1', level: 'ADV', make: function (r) { return first6(r, 'a'); } }] },
    { num: 'B2', shared: function (r) { return pickWhere(function () { return { d1: r.pick([150, 180, 200, 240, 300, 360]), d2: r.pick([80, 100, 120, 150, 200]), c: r.pick([10, 15, 20, 25, 30]), x0: r.pick([60, 75, 80, 90, 100, 120]) }; }, function (z) { return z.x0 > z.c && !(z.d1 === 300 && z.d2 === 200 && z.c === 20); }); },
      stem: function (s) { return 'A train travels ' + t(s.d1) + ' km at an average speed of ' + t('x') + ' km/h, then ' + t(s.d2) + ' km through mountains at ' + t(s.c) + ' km/h slower.'; }, parts: [
      { id: 'B2a', level: 'PRG', make: function (r, s) {
        var terms = [T1(1, [C(s.d1)], [Mo(1, 'x', 1)]), T1(1, [C(s.d2)], [A(1, -s.c)])];
        return sumRatPart(CP, 'Write the total time as a single rational expression in simplest form.', terms, 'x', { noTerms: true, after: 'h', solPre: 'Time ' + t('=\\frac{' + s.d1 + '}{x}+\\frac{' + s.d2 + '}{x-' + s.c + '}') + '. ', solPost: '<br>The time is in hours.' }, ['The slower speed is ' + t('x-' + s.c) + '. Add the two times over ' + t('x(x-' + s.c + ')') + '.', 'Factor the numerator.'], 'total time as one expression');
      } },
      { id: 'B2b', level: 'EMG', make: function (r, s) {
        return mcPart(r, 'Which values of ' + t('x') + ' make sense?', [{ html: t('x>' + s.c), right: true }, { html: t('x>0'), why: 'The mountain speed ' + t('x-' + s.c) + ' must be positive too.', code: 'zero' }, { html: t('x\\ne 0,\\ ' + s.c), why: 'Those are only the NPVs. A speed must be positive.', code: 'npv' }, { html: t('x>-' + s.c), why: 'Both speeds must be positive.', code: 'neg' }],
          'Both speeds must be positive: ' + t('x>0') + ' and ' + t('x-' + s.c + '>0') + ', so ' + t('x>' + s.c) + '.', ['A speed must be positive. Which speed is smaller?'], 'values that make sense');
      } },
      { id: 'B2c', level: 'EMG', make: function (r, s) {
        var h = s.d1 / s.x0 + s.d2 / (s.x0 - s.c);
        return KP.approx('Determine the total time when ' + t('x=' + s.x0) + ', to the nearest hundredth of an hour.', h, 2, { after: 'h' }, t('\\frac{' + s.d1 + '}{' + s.x0 + '}+\\frac{' + s.d2 + '}{' + (s.x0 - s.c) + '}\\approx ' + K.roundTo(h, 2).toFixed(2)) + ' h.', ['Substitute into your expression (or into each time) and add.'], 'evaluate the time');
      } }] },
    { num: 'B3', parts: [
      { id: 'B3', level: 'EMG', make: function (r) {
        var s = pickWhere(function () { return { c: r.int(1, 5), x0: r.int(1, 5) }; }, function (z) { return !(z.c === 1 && z.x0 === 1); });
        var Lq = ex.norm(2 * s.x0 + s.c, s.x0 * (s.x0 + s.c)), Rq = ex.norm(2, 2 * s.x0 + s.c);
        var terms = [T1(1, [C(1)], [Mo(1, 'x', 1)]), T1(1, [C(1)], [A(1, s.c)])], S = sumAll(terms, 'x'), key = sumKey(S);
        var c3 = ratCheck(cPolys(S.T), { cp: CP, vars: ['x'], dl: [{ N: P.num(2), D: L(2, s.c), code: CP + 'add-straight', hint: 'That is Leo’s claim. Use the LCD ' + t('x(x+' + s.c + ')') + '.' }] });
        var claim = '\\frac{1}{x}+\\frac{1}{x+' + s.c + '}=\\frac{2}{2x+' + s.c + '}';
        var p = boxes('Leo says ' + t(claim) + '. Test his claim with ' + t('x=' + s.x0) + ', then simplify the left side correctly.',
          [{ label: 'Left side:', check: K.value(Lq), key: rt(Lq), keys: 'u6knum' }, { label: 'Right side:', check: K.value(Rq), key: rt(Rq), keys: 'u6knum' }, { label: 'Correct:', check: c3, key: key, vars: ['x'] }],
          'Left: ' + t('\\frac{1}{' + s.x0 + '}+\\frac{1}{' + (s.x0 + s.c) + '}=' + rt(Lq)) + '. Right: ' + t('\\frac{2}{' + (2 * s.x0 + s.c) + '}' + (Rq[1] !== 2 * s.x0 + s.c ? '=' + rt(Rq) : '')) + '. The claim is false.<br>Correct: ' + t(S.step + '=' + key) + ', ' + t('x\\ne 0,\\ -' + s.c) + '.',
          ['Substitute into each side separately.', 'To add, use the LCD ' + t('x(x+' + s.c + ')') + '.'], 'test a claim, then simplify');
        p.bad = [[rt(Lq), rt(Rq), '\\frac{2}{2x+' + s.c + '}']];
        return p;
      } }] },
    { num: 'B4', parts: [{ id: 'B4', level: 'PRG', make: function (r) { return mcB4(r); } }] },
    { num: 'B5', parts: [{ id: 'B5', level: 'PRG', make: function (r) { return nrAB(r, 'lin'); } }] },
    { num: 'C1', section: 'C. Stretch', parts: [
      { id: 'C1', level: 'MAS', make: function (r) {
        var v = 'x', s = pickWhere(function () { return { a: r.int(1, 5), b: r.int(1, 5) }; }, function (z) { return !(z.a === 1 && z.b === 1) && z.a !== z.b - 0 || r.chance(0.2); });
        // (x/(x − a) − 1)/(b/(x − a) + 1) = (a/(x − a)) ÷ ((x − a + b)/(x − a)) = a/(x − a + b)
        var c0 = s.b - s.a, T = canon([[C(s.a)]], [[c0 === 0 ? Mo(1, v, 1) : A(1, c0, v)]]), npv = npvOf([[A(1, -s.a, v)], [c0 === 0 ? Mo(1, v, 1) : A(1, c0, v)]]);
        var bb = s.b === 1 ? '1' : String(s.b), den = c0 === 0 ? 'x' : tx(L(1, c0));
        var prompt = 'Simplify. State the non-permissible values. ' + t('\\dfrac{\\dfrac{x}{x-' + s.a + '}-1}{\\dfrac{' + bb + '}{x-' + s.a + '}+1}');
        var sol = 'Top: ' + t('\\frac{x-(x-' + s.a + ')}{x-' + s.a + '}=\\frac{' + s.a + '}{x-' + s.a + '}') + '. Bottom: ' + t('\\frac{' + bb + '+(x-' + s.a + ')}{x-' + s.a + '}=\\frac{' + den + '}{x-' + s.a + '}') + '.<br>' + t('\\frac{' + s.a + '}{x-' + s.a + '}\\times\\frac{x-' + s.a + '}{' + den + '}=' + cTex(T)) + ', ' + t(npvTex(npv)) + ' (the small denominator, and the divisor ' + t('\\ne 0') + ').';
        return simpPart(CP, prompt, T, npv, { vars: [v], nw: [{ vals: npvOf([[A(1, -s.a, v)]]), code: CP + 'npv-missing', hint: 'The divisor cannot be ' + t(0) + ' either: ' + t('\\frac{' + den + '}{x-' + s.a + '}=0') + ' when ' + t(den + '=0') + '.' }, { vals: npvOf([[c0 === 0 ? Mo(1, v, 1) : A(1, c0, v)]]), code: CP + 'npv-cancel', hint: 'The small denominator ' + t('x-' + s.a) + ' cannot be ' + t(0) + ' either, even though it divides out.' }] }, sol,
          ['Write the top and the bottom each as one fraction over ' + t('x-' + s.a) + '.', 'Dividing is multiplying by the reciprocal. NPVs: the small denominators and the divisor.'], 'complex fraction with binomials');
      } }] },
    { num: 'C2', parts: [{ id: 'C2', level: 'MAS', make: function (r) { return abPart(r); } }] },
    { num: 'C3', parts: [
      { id: 'C3a', level: 'ADV', make: function (r) {
        var v = r.pick(['n', 'n', 'x', 'k']), k = r.pick([1, 1, 2, 3]);
        var terms = [T1(1, [C(1)], [Mo(1, v, 1)]), T1(-1, [C(1)], [A(1, k, v)])];
        return sumPart(CP, SIMP, terms, v, {}, ['The LCD is ' + t(v + '(' + v + '+' + k + ')') + '.', 'Subtract the numerators: the ' + t(v) + '-terms cancel.'], 'difference of unit fractions');
      } },
      { id: 'C3b', level: 'MAS', make: function (r) {
        var m = pickWhere(function () { return r.int(5, 24); }, function (x) { return x !== 9; }), ans = ex.norm(m, m + 1);
        var prompt = 'Using ' + t('\\frac{1}{n}-\\frac{1}{n+1}=\\frac{1}{n(n+1)}') + ', find the exact sum ' + t('\\frac{1}{1\\cdot 2}+\\frac{1}{2\\cdot 3}+\\frac{1}{3\\cdot 4}+\\dots+\\frac{1}{' + m + '\\cdot ' + (m + 1) + '}') + '.';
        var sol = t('\\left(1-\\frac{1}{2}\\right)+\\left(\\frac{1}{2}-\\frac{1}{3}\\right)+\\dots+\\left(\\frac{1}{' + m + '}-\\frac{1}{' + (m + 1) + '}\\right)') + '. Every middle term cancels, leaving ' + t('1-\\frac{1}{' + (m + 1) + '}=' + rt(ans)) + '.';
        return valPart(prompt, ans, function (x) { if (Math.abs(x - 1 / (m + 1)) < 1e-9) return { code: CP + 'tele', hint: 'The middle terms cancel, but the first one (' + t(1) + ') stays: ' + t('1-\\frac{1}{' + (m + 1) + '}') + '.' }; if (Math.abs(x - (m - 1) / m) < 1e-9) return { code: 'value', hint: 'Check the last term: it is ' + t('\\frac{1}{' + m + '}-\\frac{1}{' + (m + 1) + '}') + '.' }; return null; },
          sol, ['Write each fraction as a difference: ' + t('\\frac{1}{1\\cdot 2}=1-\\frac{1}{2}') + ', ' + t('\\frac{1}{2\\cdot 3}=\\frac{1}{2}-\\frac{1}{3}') + ', …', 'Add them up: which terms are left?'], 'telescoping sum');
      } }] }
  ];

  HW.defineLesson({ id: LID, unit: 6, num: '6', title: 'Adding and Subtracting with Binomial and Trinomial Denominators', outcome: 'AN5', calc: true, questions: QUESTIONS, extra: EXTRA });
})(window);
