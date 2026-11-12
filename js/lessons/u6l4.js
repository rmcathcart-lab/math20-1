/* Math 20-1 · Unit 6 · Lesson 4 — Dividing Rational Expressions (outcome AN5 on every part)
 * Assignment 4 (m201book unit6/u6_l04.tex, Questions 1–15) and the Lesson 4 Extra Practice (u6_ep04.tex, Questions 1–12).
 * Every part is a generator: the booklet question's idea, form and difficulty with new numbers (the lesson's example
 * numbers and the booklet question's own numbers are left out). Calculator allowed (calc: true); answers stay exact.
 *
 * Answers are typed, checked as in Lesson 3 (js/lessons/u6l3.js, the kit HW.u6k34, which loads first): the simplified
 * expression by value away from the NPVs plus form, and the NPVs as a list — here from both denominators AND the
 * numerator of every divisor (found before flipping); two variables as restrictions (x ≠ 2y, …).
 * Recognised mistakes (u6l4- codes): multiplying without flipping, flipping the first fraction, grouping ÷ … · the wrong
 * way (not left to right), the divisor's numerator left out of the NPVs, the divisor's denominator dropped after
 * flipping, NPVs from the simplified answer only, a bracketed divisor's zeros left out, the −1 of opposite factors lost,
 * the missing expression multiplied instead of divided or upside down, A × B for A + B.
 * Conversions: Q9(a) both areas → two boxes; Q9(c) "evaluate and explain" → the value, then a multiple-choice meaning;
 * Q11 "identify both errors" → multiple choice + the corrected answer and NPVs typed; EP C12 "explain" → the values
 * where it is not 1, typed as NPVs.
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: Q7(c), Q10, Q15, EP C10, EP C11. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, KP = K.P, P = HW.poly, ex = HW.ex, t = K.t;
  var U = HW.u6k34;
  if (!U) throw new Error('js/lessons/u6l4.js needs js/lessons/u6l3.js (the kit HW.u6k34) loaded first');
  var CP = 'u6l4-', A = U.A, C = U.C, Mo = U.Mo, L2 = U.L2, nz = U.nz, pickWhere = U.pickWhere, monics = U.monics, noOpp = U.noOpp, gcd = U.gcd, pickVar = U.pickVar;
  var tx = U.tx, cTex = U.cTex, canon = U.canon, npvOf = U.npvOf, npvTex = U.npvTex, npvMerge = U.npvMerge, polyT = U.polyT, fracE = U.fracE, fracF = U.fracF, facTex = U.facTex;
  U.codes(CP);
  function E(n, d, o) { var e = { n: n, d: d || [] }; if (o) Object.keys(o).forEach(function (k) { e[k] = o[k]; }); return e; }
  function div2(a, b, o) { return { es: [a, b], ops: ['div'], o: o }; }
  function ft(cn) { return t(cTex(cn)); }
  function mcp(r, prompt, opts, sol, hints, text) { return U.mcPart(r, prompt, opts, sol, hints, text); }
  function ox(vals) { return { x: U.uniqR(vals) }; }
  /* the booklet's own and the lesson examples' first expressions (numerator|denominator, letters as x): left out */
  var AV = ['x+2|x-5', 'x^2-9|x^2+4x', 'x+4|x^2-2x', '5x^2|x^2-36', 'x^2-25|4x', 'x^2+x-12|x^2-x-2', '2x^2-x-6|x^2-9', 'x^2-x^2|x^2+4xx+3x^2', 'x^2-4x|x+3', 'x^2+x-6|x^2-4', 'x^2-9|6x', 'x^2+5x|x-2',
    'x-1|x+6', 'x^2+5x|x^2-49', '6x-18|x^2+x', '4x^2+20x+25|x^2-64', '9x^2-1|x^2+3x', 'x^2-2x|1', 'x^2-3x-10|x^2-4x+3', '3x^2+5x-2|x^2-4', 'x^2-36|x^2+x', '16-x^2|2x^2+7x-4', 'x^2+xx-2x^2|x^2-4x^2',
    'x^2-9|x^2+2x', 'x^2-x-12|x^2-16', '2x^2-8|x^2+x', '4x^2-1|x^2-3x', 'x^2-4|x^2+3x', 'x+1|x-2', 'x^2-x-6|x^2-4x', 'x^2-1|x+3', '3x^2+23x+40|x^2+x-20', 'x+4|x^2-25', 'x^2-49|5x', 'x^2+2x-15|x^2-6x+8',
    '4x^2-4x+1|x^2+x', 'x-6|x^2+2x', 'x^2+x-2|x^2-3x', 'x^2-9x^2|x^2+xx', 'x+3|x-2', '5x^2-11x-12|x^2-x-6', 'x^2-1|x^2+4x', 'x-3|x+1'];

  var QUESTIONS = [
    { num: '1', parts: [
      { id: 'q1a', level: 'BEG', make: function (r) { return U.fracQ(r, CP, { ops: ['div'], avoid: ['15/16,25/24', '8/15,12/25'], text: 'divide fractions' }); } },
      { id: 'q1b', level: 'BEG', make: function (r) { return U.fracQ(r, CP, { ops: ['div'], neg: 0, avoid: ['21/25,14/15'], text: 'divide fractions (negative)' }); } },
      { id: 'q1c', level: 'EMG', make: function (r) { return U.fracQ(r, CP, { ops: ['mul', 'div'], avoid: ['5/12,9/20,3/8', '4/9,2/3,5/8'], text: 'multiply and divide fractions' }); } }] },
    { num: '2', parts: [
      { id: 'q2a', level: 'BEG', make: function (r) { return U.monoQ(r, CP, { vs: r.pick([['a', 'b', 'c'], ['x', 'y', 'z']]), ops: ['div'], avoid: ['8/15,4/5', '12/5,18/25'], text: 'divide monomial fractions' }); } },
      { id: 'q2b', level: 'EMG', make: function (r) { return U.monoQ(r, CP, { vs: r.pick([['x', 'y'], ['a', 'b'], ['m', 'n']]), ops: ['div'], neg: 0, avoid: ['10/21,15/14', '14/9,21/6'], text: 'divide monomial fractions (negative)' }); } },
      { id: 'q2c', level: 'PRG', make: function (r) { return U.monoQ(r, CP, { vs: r.pick([['m', 'n', 'p'], ['a', 'b', 'c'], ['x', 'y', 'z']]), ops: ['mul', 'div'], avoid: ['6/5,10/9,4/3'], text: 'multiply and divide monomial fractions' }); } }] },
    { num: '3', parts: [
      { id: 'q3a', level: 'EMG', make: function (r) {   // (v+a)/(v+b) ÷ (v+c)/(mv+n): NPVs −b, −n/m, −c
        var v = pickVar(r), s = pickWhere(function () { return { a: nz(r, 1, 9), b: nz(r, 1, 9), c: nz(r, 1, 9), m: r.int(2, 5), n: nz(r, 1, 7) }; }, function (z) {
          var q = -z.n / z.m; return gcd(z.m, z.n) === 1 && z.a !== z.b && z.a !== z.c && z.b !== z.c && q !== -z.b && q !== -z.c && q !== -z.a && !(z.a === -1 && z.b === 6 && z.c === -8) && !(z.a === 2 && z.b === -5 && z.c === 7); });
        var n1 = [A(1, s.a, v)], d1 = [A(1, s.b, v)], n2 = [A(1, s.c, v)], d2 = [A(s.m, s.n, v)], npv = npvMerge(npvOf([d1, d2]), npvOf([n2]));
        var nw = [{ vals: npvOf([d1, d2]), code: CP + 'npv-div', hint: 'The divisor ' + t(fracE(n2, d2)) + ' cannot be ' + t(0) + ': after flipping, ' + t(polyT(n2)) + ' is a denominator. Include its zero.' },
          { vals: npvMerge(npvOf([d1, d2]), npvOf([n2]), npvOf([n1])), code: CP + 'npv-num', hint: t(polyT(n1)) + ' stays a numerator: ' + t(polyT(n1) + '=0') + ' is allowed.' }];
        return U.npvPart(CP, 'State the non-permissible values. Do not simplify. ' + t(fracE(n1, d1) + '\\div ' + fracE(n2, d2)), npv, { v: v, nw: nw, div: true },
          'Denominators: ' + t(polyT(d1) + '=0') + ' and ' + t(polyT(d2) + '=0') + '. The divisor’s numerator: ' + t(polyT(n2) + '=0') + ' (it becomes a denominator when you flip).<br>NPVs: ' + t(npvTex(npv)) + '.',
          ['Both denominators give NPVs.', 'The divisor’s numerator does too: dividing by ' + t(fracE(n2, d2)) + ' means multiplying by ' + t(fracE(d2, n2)) + '.'], 'NPVs of a division');
      } },
      { id: 'q3b', level: 'PRG', make: function (r) {   // v(v+a)/((v−p)(v+p)) ÷ (v+s)(v+u)/(v(v−w)): NPVs ±p, 0, w, −s, −u
        var v = pickVar(r), s = pickWhere(function () { var f = monics(r, 4, 8, noOpp); return { p: r.int(2, 9), a: f[0], s: f[1], u: f[2], w: f[3] }; }, function (z) {
          var all = [z.p, -z.p, 0, z.w, -z.s, -z.u]; return all.every(function (x, i) { return all.indexOf(x) === i; }) && Math.abs(z.s * z.u) <= 40 && !(z.p === 7 && z.a === 5); });
        var n1 = [Mo(1, v, 1), A(1, s.a, v)], d1 = [A(1, -s.p, v), A(1, s.p, v)], n2 = [A(1, s.s, v), A(1, s.u, v)], d2 = [Mo(1, v, 1), A(1, -s.w, v)];
        var npv = npvMerge(npvOf([d1, d2]), npvOf([n2]));
        var nw = [{ vals: npvOf([d1, d2]), code: CP + 'npv-div', hint: 'Factor the divisor’s numerator ' + t(polyT(n2) + '=' + facTex(n2)) + ': its zeros are NPVs too.' },
          { vals: npvMerge(npv, npvOf([n1])), code: CP + 'npv-num', hint: 'The first numerator ' + t(facTex(n1)) + ' stays a numerator: its zeros are allowed (unless they come from a denominator).' }];
        return U.npvPart(CP, 'State the non-permissible values. Do not simplify. ' + t(fracE(n1, d1) + '\\div ' + fracE(n2, d2)), npv, { v: v, nw: nw, div: true },
          'Factor: ' + t(polyT(d1) + '=' + facTex(d1)) + ', ' + t(polyT(d2) + '=' + facTex(d2)) + ', and the divisor’s numerator ' + t(polyT(n2) + '=' + facTex(n2)) + '.<br>NPVs: ' + t(npvTex(npv)) + ' (' + U.npvCount(npv) + ' values).',
          ['Factor both denominators and the divisor’s numerator.', 'Each factor with a variable gives an NPV.'], 'NPVs of a division: factor');
      } }] },
    { num: '4', parts: [
      { id: 'q4a', level: 'EMG', make: function (r) {   // c1(v−p)/(v(v+q)) ÷ c2(v−p)/(v+q) → c1/(c2 v)
        var v = pickVar(r);
        return U.gen(r, CP, function () { var z = monics(r, 2, 9, noOpp), c1 = r.int(2, 9), c2 = r.int(2, 9); if (c1 === c2 || c1 % c2 === 0) return null;
          return div2(E([C(c1), A(1, -z[0], v)], [Mo(1, v, 1), A(1, z[1], v)]), E([C(c2), A(1, -z[0], v)], [A(1, z[1], v)])); },
          { deg: [0, 1], npvs: 3, v: v, avoid: AV, text: 'divide: common binomial factors' });
      } },
      { id: 'q4b', level: 'PRG', make: function (r) {   // (av+b)²/((v−p)(v+p)) ÷ (av+b)(v−q)/(v−p) → (av+b)/((v+p)(v−q))
        var v = pickVar(r);
        return U.gen(r, CP, function () { var a = r.pick([2, 3]), b = nz(r, 1, 7), p = r.int(2, 9), q = nz(r, 1, 7); if (gcd(a, b) !== 1 || Math.abs(q) === p) return null;
          return div2(E([A(a, b, v), A(a, b, v)], [A(1, -p, v), A(1, p, v)], { fn: true }), E([A(a, b, v), A(1, -q, v)], [A(1, -p, v)], { fn: true })); },
          { deg: [1, 2], npvs: 4, v: v, avoid: AV, maxc: 90, text: 'divide: a squared binomial' });
      } },
      { id: 'q4c', level: 'PRG', make: function (r) {   // (av−b)(av+b)/(v(v+q)) ÷ (av+b) → (av−b)/(v(v+q))
        var v = pickVar(r);
        return U.gen(r, CP, function () { var a = r.pick([2, 3, 4, 5]), b = r.int(1, 5), q = nz(r, 1, 8); if (gcd(a, b) !== 1) return null;
          return div2(E([A(a, -b, v), A(a, b, v)], [Mo(1, v, 1), A(1, q, v)]), E([A(a, b, v)])); },
          { deg: [1, 2], npvs: 3, v: v, avoid: AV, text: 'divide by a polynomial' });
      } },
      { id: 'q4d', level: 'PRG', make: function (r) {   // v(v−p) ÷ (v−p)(v+p)/(c v) → c v²/(v+p)
        var v = pickVar(r);
        return U.gen(r, CP, function () { var p = nz(r, 1, 9), c = r.int(2, 9); return div2(E([Mo(1, v, 1), A(1, -p, v)]), E([A(1, -p, v), A(1, p, v)], [Mo(c, v, 1)])); },
          { deg: [2, 1], npvs: 3, v: v, avoid: AV, text: 'divide a polynomial by a fraction' });
      } }] },
    { num: '5', parts: [
      { id: 'q5a', level: 'PRG', make: function (r) {   // (f0)(f1)/((f2)(f3)) ÷ (f1)(f4)/((f4)(f3)) → f0/f2
        var v = pickVar(r);
        return U.gen(r, CP, function () { var f = monics(r, 5, 7, noOpp); return div2(E([A(1, f[0], v), A(1, f[1], v)], [A(1, f[2], v), A(1, f[3], v)]), E([A(1, f[1], v), A(1, f[4], v)], [A(1, f[4], v), A(1, f[3], v)])); },
          { deg: [1, 1], npvs: 4, v: v, avoid: AV, maxc: 50, text: 'divide: trinomials' });
      } },
      { id: 'q5b', level: 'PRG', make: function (r) {   // (αv−β)(v+p)/((v−p)(v+p)) ÷ (αv−β)(αv+β)/(v(v−p)) → v/(αv+β)
        var v = pickVar(r);
        return U.gen(r, CP, function () { var al = r.pick([2, 3, 4, 5]), be = nz(r, 1, 5), p = r.int(1, 7); if (gcd(al, be) !== 1) return null;
          return div2(E([A(al, -be, v), A(1, p, v)], [A(1, -p, v), A(1, p, v)]), E([A(al, -be, v), A(al, be, v)], [Mo(1, v, 1), A(1, -p, v)])); },
          { deg: [1, 1], npvs: 5, v: v, avoid: AV, text: 'divide: a ≠ 1 trinomials' });
      } },
      { id: 'q5c', level: 'PRG', make: function (r) {   // (v−s)(v+s)/(v(v+q)) ÷ (v−s)(v+q)/((v+q)(v+u)) → (v+s)(v+u)/(v(v+q))
        var v = pickVar(r);
        return U.gen(r, CP, function () { var f = monics(r, 3, 7, noOpp), s = Math.abs(f[0]) + 1, q = f[1], u = f[2]; if ([q, u].some(function (x) { return Math.abs(x) === s; })) return null;
          return div2(E([A(1, -s, v), A(1, s, v)], [Mo(1, v, 1), A(1, q, v)]), E([A(1, -s, v), A(1, q, v)], [A(1, q, v), A(1, u, v)])); },
          { deg: [2, 2], npvs: 4, v: v, avoid: AV, text: 'divide: trinomials' });
      } },
      { id: 'q5d', level: 'ADV', make: function (r) {   // (p²−v²)/((av−b)(v+p)) ÷ (v−p)(v+q)/((av−b)(av+b)) → −(av+b)/(v+q)
        var v = pickVar(r);
        return U.gen(r, CP, function () { var a = r.pick([2, 3]), b = r.int(1, 5) * (r.chance(0.5) ? 1 : -1), p = r.int(2, 6), q = nz(r, 1, 6); if (gcd(a, b) !== 1 || Math.abs(q) === p) return null;
          return div2(E([A(-1, p, v), A(1, p, v)], [A(a, -b, v), A(1, p, v)], { an: true }), E([A(1, -p, v), A(1, q, v)], [A(a, -b, v), A(a, b, v)])); },
          { deg: [1, 1], npvs: 5, v: v, avoid: AV, opp: true, maxc: 40, text: 'divide: opposite factors' });
      } }] },
    { num: '6', parts: [
      { id: 'q6', level: 'ADV', make: function (r) {   // (x+ky)(x−jy)/((x−ky)(x+ky)) ÷ (x−jy)(x+jy)/(c(x−ky)) → c/(x+jy)
        var vw = r.pick([['x', 'y'], ['a', 'b'], ['m', 'n'], ['p', 'q']]), x = vw[0], y = vw[1];
        return U.gen(r, CP, function () { var k = r.int(1, 4), j = r.int(1, 4), c = r.int(2, 6), sg = r.chance(0.5) ? 1 : -1; if (k === j) return null;
          return { es: [E([L2(1, k, x, y), L2(1, -sg * j, x, y)], [L2(1, -k, x, y), L2(1, k, x, y)]), E([L2(1, -sg * j, x, y), L2(1, sg * j, x, y)], [C(c), L2(1, -k, x, y)])], ops: ['div'], o: { restr: true, vars: [x, y] } }; },
          { avoid: AV, npvs: 4, maxc: 40, text: 'two variables: divide' });
      } }] },
    { num: '7', parts: [
      { id: 'q7a', level: 'ADV', make: function (r) {   // (v−p)(v+p)/(v(v+q)) ÷ (v−p)/((v−q)(v+q)) · v²/((v+p)(v−q)) → v
        var v = pickVar(r);
        return U.gen(r, CP, function () { var p = r.int(2, 8), q = r.int(1, 8) * (r.chance(0.5) ? 1 : -1); if (Math.abs(q) === p) return null;
          return { es: [E([A(1, -p, v), A(1, p, v)], [Mo(1, v, 1), A(1, q, v)]), E([A(1, -p, v)], [A(1, -q, v), A(1, q, v)]), E([Mo(1, v, 2)], [A(1, p, v), A(1, -q, v)])], ops: ['div', 'mul'] }; },
          { deg: [1, 0], npvs: 5, v: v, avoid: AV, text: 'divide then multiply' });
      } },
      { id: 'q7b', level: 'ADV', make: function (r) {   // (v−p)(v+q)/((v−p)(v+p)) · v(v+p)/(v+q)² ÷ v(v−s)/(v+q) → 1/(v−s)
        var v = pickVar(r);
        return U.gen(r, CP, function () { var f = monics(r, 3, 7, noOpp), p = Math.abs(f[0]) + 1, q = f[1], s = f[2]; if ([q, s].some(function (x) { return Math.abs(x) === p; })) return null;
          return { es: [E([A(1, -p, v), A(1, q, v)], [A(1, -p, v), A(1, p, v)]), E([Mo(1, v, 1), A(1, p, v)], [A(1, q, v), A(1, q, v)]), E([Mo(1, v, 1), A(1, -s, v)], [A(1, q, v)])], ops: ['mul', 'div'] }; },
          { deg: [0, 1], npvs: 5, v: v, avoid: AV, text: 'multiply then divide' });
      } },
      { id: 'q7c', level: 'MAS', make: function (r) {   // c1(v−p)(v+p)/(v(v+q)) ÷ (v+p)²/(v+q) ÷ (v−p)/(c2 v) → c1c2/(v+p)
        var v = pickVar(r);
        return U.gen(r, CP, function () { var p = r.int(1, 7) * (r.chance(0.5) ? 1 : -1), q = nz(r, 1, 7), c1 = r.int(2, 4), c2 = r.int(2, 5); if (Math.abs(q) === Math.abs(p)) return null;
          return { es: [E([C(c1), A(1, -p, v), A(1, p, v)], [Mo(1, v, 1), A(1, q, v)]), E([A(1, p, v), A(1, p, v)], [A(1, q, v)]), E([A(1, -p, v)], [Mo(c2, v, 1)])], ops: ['div', 'div'] }; },
          { deg: [0, 1], npvs: 4, v: v, avoid: AV, text: 'divide twice' });
      } }] },
    { num: '8', parts: [
      { id: 'q8', level: 'ADV', make: function (r) {   // complex: (av−b)(av+b)/(v(v−p)) over v(av+b)/((v−p)(v+p)) → (av−b)(v+p)/v²
        var v = pickVar(r);
        return U.gen(r, CP, function () { var a = r.pick([2, 3, 4]), b = r.int(1, 5), p = nz(r, 1, 7); if (gcd(a, b) !== 1) return null;
          return { es: [E([A(a, -b, v), A(a, b, v)], [Mo(1, v, 1), A(1, -p, v)]), E([Mo(1, v, 1), A(a, b, v)], [A(1, -p, v), A(1, p, v)])], ops: ['div'], o: { complex: true } }; },
          { deg: [2, 2], npvs: 4, v: v, avoid: AV, text: 'complex fraction' });
      } }] },
    { num: '9', shared: function (r) {
        return pickWhere(function () { return { p: r.int(1, 6), q: r.int(1, 5), c: r.int(2, 9), k: r.pick([2, 4, 6, 8]), x0: r.int(2, 10) }; }, function (z) {
          if (z.p === z.q || z.x0 <= z.q || (z.q === 3 && z.p === 4 && z.c === 6 && z.k === 4) || 2 * z.c === z.k) return false;
          var num = 2 * z.c * z.x0, den = z.k * (z.x0 - z.q) * (z.x0 - z.q), g = gcd(num, den), d0 = den / g; while (d0 % 2 === 0) d0 /= 2; while (d0 % 5 === 0) d0 /= 5;
          return d0 === 1 && num / den !== 1;
        });
      },
      stem: function (o) { return 'A rectangle has length ' + t(fracE([Mo(1, 'x', 1), A(1, o.p)], [A(1, -o.q)])) + ' cm and width ' + t('\\frac{' + o.c + '}{x+' + o.p + '}') + ' cm. A triangle has base ' + t(fracE([A(1, -o.q), A(1, o.q)], [Mo(1, 'x', 1)])) + ' cm and height ' + t('\\frac{' + o.k + 'x}{x+' + o.q + '}') + ' cm. Here ' + t('x>' + o.q) + '.'; },
      parts: [
        { id: 'q9a', level: 'PRG', make: function (r, o) {
          var Rc = canon([[Mo(1, 'x', 1), A(1, o.p)], [C(o.c)]], [[A(1, -o.q)], [A(1, o.p)]]), Tr = canon([[C(1)], [A(1, -o.q), A(1, o.q)], [Mo(o.k, 'x', 1)]], [[C(2)], [Mo(1, 'x', 1)], [A(1, o.q)]]);
          var noHalf = canon([[A(1, -o.q), A(1, o.q)], [Mo(o.k, 'x', 1)]], [[Mo(1, 'x', 1)], [A(1, o.q)]]), Tq = U.cPolys(Tr), Rq = U.cPolys(Rc);
          var c1 = U.ratCheck(Rq, { cp: CP, vars: ['x'] }), c2 = U.ratCheck(Tq, { cp: CP, vars: ['x'], dl: [(function () { var q = U.cPolys(noHalf); return { N: q.N, D: q.D, code: CP + 'area-half', hint: 'The area of a triangle is ' + t('\\frac{1}{2}bh') + '.' }; })()] });
          var p = KP.fields('Write and simplify an expression for each area.', [{ label: 'Rectangle:', mode: 'math', keys: 'u6krat', vars: ['x'], name: 'Rectangle', after: '\\text{ cm}^2' }, { label: 'Triangle:', mode: 'math', keys: 'u6krat', vars: ['x'], name: 'Triangle', after: '\\text{ cm}^2' }],
            [c1, c2], [cTex(Rc), cTex(Tr)], 'Rectangle ' + t(cTex(Rc)) + ', triangle ' + t(cTex(Tr)),
            'Rectangle: ' + t(fracF([Mo(1, 'x', 1), A(1, o.p)], [A(1, -o.q)]) + '\\cdot\\frac{' + o.c + '}{x+' + o.p + '}=' + cTex(Rc)) + '.<br>Triangle: ' + t('\\frac{1}{2}\\cdot\\frac{' + facTex([A(1, -o.q), A(1, o.q)]) + '}{x}\\cdot\\frac{' + o.k + 'x}{x+' + o.q + '}=' + cTex(Tr)) + '.',
            ['Rectangle: length × width. Triangle: ' + t('\\frac{1}{2}') + ' × base × height.', 'Factor, then divide out common factors.'], 'two areas');
          p.bad = [[cTex(Tr), cTex(Rc)], [cTex(Rc), cTex(noHalf)]];
          return p;
        } },
        { id: 'q9b', level: 'PRG', make: function (r, o) {
          var T = canon([[C(2 * o.c), Mo(1, 'x', 1)]], [[C(o.k), A(1, -o.q), A(1, -o.q)]]), inv = canon([[C(o.k), A(1, -o.q), A(1, -o.q)]], [[C(2 * o.c), Mo(1, 'x', 1)]]);
          var Rc = canon([[C(o.c), Mo(1, 'x', 1)]], [[A(1, -o.q)]]), Tr = canon([[C(o.k), A(1, -o.q)]], [[C(2)]]);
          return U.ratPart(CP, 'Write and simplify the ratio of the area of the rectangle to the area of the triangle.', T, { dl: [{ cn: inv, code: CP + 'ratio-inv', hint: 'The ratio of the rectangle to the triangle is rectangle ' + t('\\div') + ' triangle.' }] },
            t(cTex(Rc) + '\\div ' + cTex(Tr).replace(/^(\d+)\((.*)\)$/, '$1($2)') + '=' + cTex(Rc) + '\\cdot\\frac{1}{' + cTex(Tr) + '}=' + cTex(T)) + '.', ['Ratio of A to B means A ÷ B.', 'Dividing by a polynomial means multiplying by 1 over it.'], 'ratio of areas');
        } },
        { id: 'q9c', level: 'EMG', make: function (r, o) {
          var num = 2 * o.c * o.x0, den = o.k * (o.x0 - o.q) * (o.x0 - o.q), val = ex.norm(num, den);
          return KP.fraction('Evaluate the ratio when ' + t('x=' + o.x0) + '.', val, { decimalOk: true, diag: function (y) { if (ex.eq(y, den / num)) return { code: CP + 'ratio-inv', hint: 'Rectangle ÷ triangle, not the other way round.' }; return null; } },
            t('\\frac{' + 2 * o.c + '(' + o.x0 + ')}{' + o.k + '(' + o.x0 + '-' + o.q + ')^{2}}=\\frac{' + num + '}{' + den + '}=' + ex.texRat(val) + (val[1] === 1 ? '' : '=' + HW.fmt(num / den))) + '.', ['Substitute into your simplified ratio.'], 'ratio at a value');
        } },
        { id: 'q9d', level: 'EMG', make: function (r, o) {
          var num = 2 * o.c * o.x0, den = o.k * (o.x0 - o.q) * (o.x0 - o.q), R0 = HW.fmt(num / den), ra = o.c * o.x0 / (o.x0 - o.q), ta = o.k * (o.x0 - o.q) / 2;
          return mcp(r, 'What does the value of the ratio at ' + t('x=' + o.x0) + ' mean?', [
            { html: 'The rectangle’s area is ' + t(R0) + ' times the triangle’s area.', right: true },
            { html: 'The triangle’s area is ' + t(R0) + ' times the rectangle’s area.', why: 'The ratio is rectangle ÷ triangle, so it compares the rectangle to the triangle.', code: 'why-mc' },
            { html: 'The rectangle’s area is ' + t(R0) + ' cm² larger than the triangle’s.', why: 'A ratio (a quotient) tells <b>how many times</b>, not how much larger.', code: 'why-mc' },
            { html: 'The rectangle’s area is ' + t(R0) + ' cm².', why: 'The rectangle’s area at ' + t('x=' + o.x0) + ' is ' + t(HW.fmt(Math.round(ra * 1e6) / 1e6)) + ' cm²; the ratio compares it with the triangle’s.', code: 'why-mc' }],
            'The ratio is rectangle ÷ triangle: the rectangle’s area (' + t(HW.fmt(Math.round(ra * 1e6) / 1e6)) + ' cm²) is ' + t(R0) + ' times the triangle’s area (' + t(HW.fmt(ta)) + ' cm²).', ['A ratio A : B tells how many times as large A is as B.'], 'meaning of the ratio');
        } }] },
    { num: '10', parts: [
      { id: 'q10', level: 'MAS', make: function (r) {   // P ÷ □ = R → □ = P ÷ R; P = (x−p)(x+p)/(x(x+q)), R = (x∓p)/x
        var s = pickWhere(function () { return { p: r.int(1, 7), q: nz(r, 1, 7), sg: r.chance(0.5) ? 1 : -1 }; }, function (z) { return Math.abs(z.q) !== z.p && !(z.p === 2 && z.q === 3 && z.sg === -1); });
        var Pn = [A(1, -s.p), A(1, s.p)], Pd = [Mo(1, 'x', 1), A(1, s.q)], Rn = [A(1, -s.sg * s.p)], Rd = [Mo(1, 'x', 1)];
        var T = canon([Pn, Rd], [Pd, Rn]), mul = canon([Pn, Rn], [Pd, Rd]), inv = canon([Pd, Rn], [Pn, Rd]);
        return U.ratPart(CP, 'Determine the rational expression that belongs in the box: ' + t(fracE(Pn, Pd) + '\\div\\boxed{\\phantom{xx}}=' + fracE(Rn, Rd)), T,
          { dl: [{ cn: mul, code: CP + 'box-mul', hint: 'If ' + t('P\\div Q=R') + ', then ' + t('Q=P\\div R') + ': divide, don’t multiply.' }, { cn: inv, code: CP + 'box-inv', hint: 'If ' + t('P\\div Q=R') + ', then ' + t('Q=P\\div R') + ' (not ' + t('R\\div P') + ').' }] },
          'If ' + t('P\\div Q=R') + ', then ' + t('Q=P\\div R') + '.<br>' + t('Q=' + fracF(Pn, Pd) + '\\div ' + fracF(Rn, Rd) + '=' + fracF(Pn, Pd) + '\\cdot ' + fracF(Rd, Rn) + '=' + cTex(T)) + '.',
          ['If ' + t('P\\div Q=R') + ', how do you find ' + t('Q') + ' from ' + t('P') + ' and ' + t('R') + '? (Think ' + t('12\\div Q=3') + '.)', 'Factor, flip and divide out.'], 'missing divisor');
      } }] },
    { num: '11', shared: function (r) { return pickWhere(function () { return { a: nz(r, 1, 8), b: nz(r, 1, 8), c: nz(r, 1, 8) }; }, function (z) { return z.a !== -z.b && z.a !== z.c && z.b !== -z.c && !(z.a === 1 && z.b === 2 && z.c === 5); }); },
      stem: function (o) {
        var e1 = fracE([A(1, o.a)], [A(1, -o.b)]), e2 = fracE([A(1, o.a)], [A(1, o.c)]);
        return 'A student’s work is shown: ' + t(e1 + '\\div ' + e2 + '=' + fracE([A(1, -o.b)], [A(1, o.a)]) + '\\cdot ' + e2 + '=' + fracE([A(1, -o.b)], [A(1, o.c)])) + ', ' + t('x\\ne ' + U.rt(o.b) + ',\\ ' + U.rt(-o.c)) + '.';
      },
      parts: [
        { id: 'q11a', level: 'EMG', make: function (r, o) {
          var mA = U.rt(-o.a);
          return mcp(r, 'Which describes <b>both</b> of the student’s errors?', [
            { html: 'The student flipped the first fraction instead of the divisor, and left out the NPV ' + t('x\\ne ' + mA) + ' from the divisor’s numerator.', right: true },
            { html: 'The student flipped the first fraction instead of the divisor; the NPVs are complete.', why: 'The divisor ' + t(fracE([A(1, o.a)], [A(1, o.c)])) + ' cannot be ' + t(0) + ': ' + t('x\\ne ' + mA) + ' is an NPV too.', code: 'why-mc' },
            { html: 'The student should not have divided out ' + t(tx(U.listPoly([A(1, o.a)]))) + ', and left out ' + t('x\\ne ' + mA) + '.', why: 'Dividing out a common factor is fine once it is a multiplication. The first error is which fraction was flipped.', code: 'why-mc' },
            { html: 'The student flipped the divisor correctly, but ' + t('x\\ne ' + U.rt(o.b)) + ' should not be an NPV.', why: 'Look again: it was the <b>first</b> fraction that was flipped. And ' + t(polyT([A(1, -o.b)])) + ' is a denominator, so ' + t('x\\ne ' + U.rt(o.b)) + ' is an NPV.', code: 'why-mc' }],
            'Error 1: the student flipped the first fraction instead of the divisor. Error 2: the NPV ' + t('x\\ne ' + mA) + ' is missing (the divisor’s numerator ' + t(polyT([A(1, o.a)])) + ' cannot be ' + t(0) + ').', ['Which expression should be flipped? Which values make the divisor ' + t(0) + '?'], 'error analysis: both errors');
        } },
        { id: 'q11b', level: 'PRG', make: function (r, o) {
          var p = U.opPart(CP, [E([A(1, o.a)], [A(1, -o.b)]), E([A(1, o.a)], [A(1, o.c)])], ['div'], { prompt: 'Give the correct simplified answer and its NPVs.', text: 'error analysis: correct answer' });
          var stu = canon([[A(1, -o.b)]], [[A(1, o.c)]]);
          p.bad = p.bad.concat([[cTex(stu), p.key[1]], [p.key[0], 'x\\ne ' + U.rt(o.b) + ',\\ ' + U.rt(-o.c)]]);
          return p;
        } }] },
    { num: '12', parts: [
      { id: 'q12', level: 'EMG', make: function (r) {   // (x−w)(x+q)/(x(x−p)) ÷ (x+q)(x+s)/((x−p)(x+p) | (x−u)(x+u)): count the NPVs
        var s = pickWhere(function () { var f = monics(r, 4, 7, noOpp); return { p: r.int(2, 7), w: f[0], q: f[1], s: f[2], u: Math.abs(f[3]), share: r.chance(0.65) }; }, function (z) {
          var vals = [0, z.p].concat(z.share ? [-z.p] : [z.u, -z.u]).concat([-z.q, -z.s]); var d = vals.filter(function (x, i) { return vals.indexOf(x) === i; });
          return d.length === vals.length - (z.share ? 0 : 0) && (z.share || (z.u !== z.p && z.u !== 0)) && Math.abs(z.q * z.s) <= 40 && !(z.share && z.p === 4 && z.q === 2 && z.s === 3);
        });
        var n1 = [A(1, -s.w), A(1, s.q)], d1 = [Mo(1, 'x', 1), A(1, -s.p)], n2 = [A(1, s.q), A(1, s.s)], d2 = s.share ? [A(1, -s.p), A(1, s.p)] : [A(1, -s.u), A(1, s.u)];
        var npv = npvMerge(npvOf([d1, d2]), npvOf([n2])), n = U.npvCount(npv), dn = U.npvCount(npvOf([d1, d2]));
        var opts = [{ html: t(n), right: true }, { html: t(dn), why: 'The divisor’s numerator ' + t(facTex(n2)) + ' gives NPVs too (it becomes a denominator after flipping).', code: 'npv-div' },
          { html: t(n + 1), why: s.share ? 'The value ' + t(s.p) + ' comes from two denominators: count it once.' : 'The first numerator ' + t(facTex(n1)) + ' is not a denominator: its zeros are allowed.', code: 'npv-mc' },
          { html: t(n - 1 === dn ? n - 2 : n - 1), why: 'Factor each denominator fully: ' + t(polyT(d1) + '=' + facTex(d1)) + ' and ' + t(polyT(d2) + '=' + facTex(d2)) + '.', code: 'npv-mc' }];
        return mcp(r, '<i>(Multiple Choice)</i> The number of non-permissible values of ' + t(fracE(n1, d1) + '\\div ' + fracE(n2, d2)) + ' is', opts,
          t(polyT(d1) + '=' + facTex(d1)) + '; ' + t(polyT(d2) + '=' + facTex(d2)) + '; the divisor’s numerator ' + t(facTex(n2)) + '. The distinct values are ' + t(npvTex(npv).replace(/^x\\ne /, '')) + ': ' + n + '.', ['Factor both denominators and the divisor’s numerator; count each value once.'], 'MC: number of NPVs');
      } }] },
    { num: '13', parts: [
      { id: 'q13', level: 'PRG', make: function (r) {   // x/a ÷ x²/b · x/c = b/(ac)
        var s = pickWhere(function () { return { a: r.int(2, 9), b: r.int(2, 12), c: r.int(2, 9) }; }, function (z) { return z.a !== z.c && z.b !== z.a && z.b !== z.c && !(z.a === 3 && z.b === 6 && z.c === 2) && gcd(z.b, z.a * z.c) > 1; });
        var right = canon([[C(s.b)]], [[C(s.a * s.c)]]), fA = canon([[Mo(s.a, 'x', 2)]], [[C(s.b * s.c)]]), fB = canon([[C(s.b * s.c)]], [[Mo(s.a, 'x', 2)]]), fD = canon([[Mo(1, 'x', 4)]], [[C(s.a * s.b * s.c)]]);
        return mcp(r, '<i>(Multiple Choice)</i> For ' + t('x\\ne 0') + ', the expression ' + t('\\frac{x}{' + s.a + '}\\div\\frac{x^{2}}{' + s.b + '}\\cdot\\frac{x}{' + s.c + '}') + ' is equal to', [
          { html: ft(right), right: true },
          { html: ft(fA), why: 'Keep the first fraction; flip only the divisor ' + t('\\frac{x^{2}}{' + s.b + '}') + '.', code: 'div-flipfirst' },
          { html: ft(fB), why: 'Work from left to right: divide by ' + t('\\frac{x^{2}}{' + s.b + '}') + ' only, then multiply by ' + t('\\frac{x}{' + s.c + '}') + '.', code: 'mix-group' },
          { html: ft(fD), why: 'Dividing means multiplying by the reciprocal: flip ' + t('\\frac{x^{2}}{' + s.b + '}') + '.', code: 'div-noflip' }],
          'Left to right: ' + t('\\frac{x}{' + s.a + '}\\cdot\\frac{' + s.b + '}{x^{2}}\\cdot\\frac{x}{' + s.c + '}=\\frac{' + s.b + 'x^{2}}{' + s.a * s.c + 'x^{2}}=' + cTex(right)) + '.', ['Change ' + t('\\div') + ' to ' + t('\\times') + ' and flip only the fraction right after it.'], 'MC: left to right');
      } }] },
    { num: '14', parts: [
      { id: 'q14', level: 'PRG', make: function (r) {   // (x²−p²)/(x+q) ÷ (p−x)/(x²+qx) → −x(x+p)
        var s = pickWhere(function () { return { p: r.int(1, 8), q: nz(r, 1, 8) }; }, function (z) { return Math.abs(z.q) !== z.p && !(z.p === 1 && z.q === 3); });
        var T = canon([[C(-1), Mo(1, 'x', 1), A(1, s.p)]], []);
        return mcp(r, '<i>(Multiple Choice)</i> For all permissible values of ' + t('x') + ', ' + t(fracE([A(1, -s.p), A(1, s.p)], [A(1, s.q)]) + '\\div ' + fracE([A(-1, s.p)], [Mo(1, 'x', 1), A(1, s.q)], { an: true })) + ' simplifies to', [
          { html: ft(T), right: true },
          { html: ft(U.cNeg(T)), why: t(s.p + '-x=-(x-' + s.p + ')') + ': keep the −1.', code: 'opp-sign' },
          { html: ft(canon([[C(-1)]], [[Mo(1, 'x', 1), A(1, s.p)]])), why: 'Flip the divisor, not the first fraction.', code: 'div-flipfirst' },
          { html: ft(canon([[C(-1), Mo(1, 'x', 1), A(1, -s.p)]], [])), why: 'The factor that divides out with ' + t(s.p + '-x') + ' is ' + t('x-' + s.p) + ', leaving ' + t('x+' + s.p) + '.', code: 'wrong-factor' }],
          t('\\frac{(x-' + s.p + ')(x+' + s.p + ')}{' + polyT([A(1, s.q)]) + '}\\cdot\\frac{x' + facTex([A(1, s.q)]) + '}{-(x-' + s.p + ')}=' + cTex(T)), ['Flip the divisor and write ' + t(s.p + '-x') + ' as ' + t('-(x-' + s.p + ')') + '.'], 'MC: opposite factors');
      } }] },
    { num: '15', parts: [
      { id: 'q15', level: 'MAS', make: function (r) {   // complex: (av+b)(v+p)/((v+p)(v−q)) over (v+s)/((v−q)(v+s)) → av+b
        var z = U.gen(r, CP, function () { var f = monics(r, 3, 6, noOpp), a = r.int(2, 5), b = r.int(1, 9); if (gcd(a, b) !== 1 || -b / a === -f[0] || -b / a === f[1]) return null;
          return { es: [E([A(a, b), A(1, f[0])], [A(1, f[0]), A(1, -f[1])]), E([A(1, f[2])], [A(1, -f[1]), A(1, f[2])])], ops: ['div'], o: { complex: true } }; },
          { deg: [1, 0], npvs: 3, avoid: AV, maxc: 80, text: 'NR: A + B' }).z;
        var a = z.es[0].n[0].a, b = z.es[0].n[0].b, I = U.opInfo(z.es, z.ops, z.o), sh = '\\dfrac{\\;' + U.exprShow(z.es[0]).replace(/^\\frac/, '\\dfrac') + '\\;}{\\;' + U.exprShow(z.es[1]).replace(/^\\frac/, '\\dfrac') + '\\;}';
        return KP.nr('<i>(Numerical Response)</i> For all permissible values of ' + t('x') + ', the complex fraction ' + t(sh) + ' simplifies to a linear expression ' + t('Ax+B') + '. The value of ' + t('A+B') + ' is ______.', a + b,
          function (v) { if (v === a * b) return { code: CP + 'nr-ab', hint: 'That is ' + t('A\\times B') + '. The question asks for ' + t('A+B') + '.' }; if (v === a || v === b) return { code: CP + 'nr-ab', hint: 'Add both: ' + t('A+B') + '.' }; return null; },
          t(U.exprFac(z.es[0]) + '\\cdot ' + U.fracF(z.es[1].d, z.es[1].n) + '=' + cTex(I.T)) + ', so ' + t('A=' + a) + ', ' + t('B=' + b) + ' and ' + t('A+B=' + (a + b)) + '.', ['The main fraction bar means divide: multiply the top fraction by the reciprocal of the bottom one.', 'Factor everything (use ' + t('ac') + ' for the trinomial with a leading coefficient).'], 'NR: complex fraction to Ax + B');
      } }] }
  ];

  var EXTRA = [
    { num: '1', section: 'A. Skills', parts: [
      { id: 'e1a', level: 'BEG', make: function (r) { return U.fracQ(r, CP, { ops: ['div'], neg: 0, avoid: ['21/25,14/15', '14/9,21/6'], text: 'divide fractions (negative)' }); } },
      { id: 'e1b', level: 'BEG', make: function (r) { return U.monoQ(r, CP, { vs: r.pick([['x', 'y'], ['a', 'b'], ['p', 'q']]), ops: ['div'], avoid: ['9/8,3/4'], text: 'divide monomial fractions' }); } },
      { id: 'e1c', level: 'EMG', make: function (r) { return U.monoQ(r, CP, { vs: r.pick([['a', 'b', 'c'], ['x', 'y', 'z']]), ops: ['div'], neg: 0, avoid: ['5/12,10/9'], text: 'divide monomial fractions (negative)' }); } }] },
    { num: '2', parts: [
      { id: 'e2', level: 'PRG', make: function (r) {   // (v+a)/(v²−p²) ÷ (mv+n)/(v²+wv): NPVs ±p, 0, −w, −n/m
        var v = pickVar(r), s = pickWhere(function () { return { a: nz(r, 1, 9), p: r.int(2, 9), w: nz(r, 1, 9), m: r.int(2, 5), n: nz(r, 1, 7) }; }, function (z) {
          var vals = [z.p, -z.p, 0, -z.w, -z.n / z.m]; return gcd(z.m, z.n) === 1 && vals.every(function (x, i) { return vals.indexOf(x) === i; }) && z.a !== z.p && z.a !== -z.p && !(z.a === 4 && z.p === 5); });
        var n1 = [A(1, s.a, v)], d1 = [A(1, -s.p, v), A(1, s.p, v)], n2 = [A(s.m, s.n, v)], d2 = [Mo(1, v, 1), A(1, s.w, v)], npv = npvMerge(npvOf([d1, d2]), npvOf([n2]));
        var nw = [{ vals: npvOf([d1, d2]), code: CP + 'npv-div', hint: 'The divisor’s numerator ' + t(polyT(n2)) + ' becomes a denominator after flipping: include its zero.' }, { vals: npvMerge(npv, npvOf([n1])), code: CP + 'npv-num', hint: t(polyT(n1)) + ' stays a numerator: its zero is allowed.' }];
        return U.npvPart(CP, 'State the non-permissible values. Do not simplify. ' + t(fracE(n1, d1) + '\\div ' + fracE(n2, d2)), npv, { v: v, nw: nw, div: true },
          'Denominators: ' + t(facTex(d1)) + ' and ' + t(facTex(d2)) + ' give ' + t(npvTex(npvOf([d1, d2]))) + '. Divisor’s numerator: ' + t(npvTex(npvOf([n2]))) + '.<br>NPVs: ' + t(npvTex(npv)) + '.', ['Factor both denominators.', 'Include the zero of the divisor’s numerator.'], 'NPVs of a division');
      } }] },
    { num: '3', parts: [
      { id: 'e3a', level: 'EMG', make: function (r) {   // (v−p)(v+p)/(c1 v) ÷ (v+p)/(c2 v²) → (c2/c1) v(v−p)
        var v = pickVar(r);
        return U.gen(r, CP, function () { var p = nz(r, 1, 9), c1 = r.int(2, 9), c2 = r.int(2, 12); if (c2 % c1 !== 0 || c2 === c1) return null; return div2(E([A(1, -p, v), A(1, p, v)], [Mo(c1, v, 1)]), E([A(1, p, v)], [Mo(c2, v, 2)])); },
          { deg: [2, 0], npvs: 2, v: v, avoid: AV, text: 'divide: a binomial factor' });
      } },
      { id: 'e3b', level: 'PRG', make: function (r) {   // (f0)(f1)/((f2)(f3)) ÷ (f4)(f0)/((f3)(f5)) → f1 f5/(f2 f4)
        var v = pickVar(r);
        return U.gen(r, CP, function () { var f = monics(r, 6, 6, noOpp); return div2(E([A(1, f[0], v), A(1, f[1], v)], [A(1, f[2], v), A(1, f[3], v)]), E([A(1, f[4], v), A(1, f[0], v)], [A(1, f[3], v), A(1, f[5], v)])); },
          { deg: [2, 2], npvs: 5, v: v, avoid: AV, maxc: 40, text: 'divide: trinomials' });
      } },
      { id: 'e3c', level: 'PRG', make: function (r) {   // (av−b)²/(v(v+p)) ÷ (av−b)(v+q)/((v−p)(v+p)) → (av−b)(v−p)/(v(v+q))
        var v = pickVar(r);
        return U.gen(r, CP, function () { var a = r.pick([2, 3]), b = nz(r, 1, 5), p = r.int(1, 6), q = nz(r, 1, 6); if (gcd(a, b) !== 1 || Math.abs(q) === p) return null;
          return div2(E([A(a, -b, v), A(a, -b, v)], [Mo(1, v, 1), A(1, p, v)]), E([A(a, -b, v), A(1, q, v)], [A(1, -p, v), A(1, p, v)])); },
          { deg: [2, 2], npvs: 5, v: v, avoid: AV, maxc: 40, text: 'divide: a perfect square' });
      } },
      { id: 'e3d', level: 'ADV', make: function (r) {   // (v−p)/(v(v+q)) ÷ (p²−v²)/((v−q)(v+q)) → −(v−q)/(v(v+p))
        var v = pickVar(r);
        return U.gen(r, CP, function () { var p = r.int(2, 9), q = r.int(1, 8); if (q === p) return null; return div2(E([A(1, -p, v)], [Mo(1, v, 1), A(1, q, v)]), E([A(-1, p, v), A(1, p, v)], [A(1, -q, v), A(1, q, v)], { an: true })); },
          { deg: [1, 2], npvs: 5, v: v, avoid: AV, opp: true, text: 'divide: opposite factors' });
      } }] },
    { num: '4', section: 'B. Applying', parts: [
      { id: 'e4', level: 'ADV', make: function (r) {   // (v+s)(v−p)/(v(v−q)) ÷ (v−p)(v+p)/((v−q)(v+q)) · v/(v+q) → (v+s)/(v+p)
        var v = pickVar(r);
        return U.gen(r, CP, function () { var f = monics(r, 3, 7, noOpp), p = f[0], q = Math.abs(f[1]), s = f[2]; if (Math.abs(p) === q || Math.abs(s) === q || s === p) return null;
          return { es: [E([A(1, s, v), A(1, -p, v)], [Mo(1, v, 1), A(1, -q, v)]), E([A(1, -p, v), A(1, p, v)], [A(1, -q, v), A(1, q, v)]), E([Mo(1, v, 1)], [A(1, q, v)])], ops: ['div', 'mul'] }; },
          { deg: [1, 1], npvs: 5, v: v, avoid: AV, text: 'divide then multiply' });
      } }] },
    { num: '5', parts: [
      { id: 'e5', level: 'ADV', make: function (r) {   // (a−kb)(a+kb)/(a(a+jb)) ÷ (a−kb)(a+jb)/((a−jb)(a+jb)) → (a+kb)(a−jb)/(a(a+jb))
        var vw = r.pick([['a', 'b'], ['x', 'y'], ['m', 'n']]), x = vw[0], y = vw[1];
        return U.gen(r, CP, function () { var k = r.int(2, 4), j = r.int(1, 3), sg = r.chance(0.5) ? 1 : -1; if (k === j) return null;
          return { es: [E([L2(1, -sg * k, x, y), L2(1, sg * k, x, y)], [Mo(1, x, 1), L2(1, j, x, y)]), E([L2(1, -sg * k, x, y), L2(1, j, x, y)], [L2(1, -j, x, y), L2(1, j, x, y)])], ops: ['div'], o: { restr: true, vars: [x, y] } }; },
          { avoid: AV, npvs: 4, maxc: 40, text: 'two variables: divide' });
      } }] },
    { num: '6', parts: [
      { id: 'e6', level: 'ADV', make: function (r) {   // complex: v(v−p)/(v+q) over (v−p)(v+p)/(v(v+q)) → v²/(v+p)
        var v = pickVar(r);
        return U.gen(r, CP, function () { var z = monics(r, 2, 8, noOpp); return { es: [E([Mo(1, v, 1), A(1, -z[0], v)], [A(1, z[1], v)]), E([A(1, -z[0], v), A(1, z[0], v)], [Mo(1, v, 1), A(1, z[1], v)])], ops: ['div'], o: { complex: true } }; },
          { deg: [2, 1], npvs: 4, v: v, avoid: AV, text: 'complex fraction' });
      } }] },
    { num: '7', shared: function (r) {
        return pickWhere(function () { return { p: r.int(2, 8), q: r.int(1, 6), x0: r.int(3, 14) }; }, function (z) {
          if (z.p === z.q || z.x0 <= z.p || (z.p === 5 && z.q === 1)) return false;
          var num = z.x0 * (z.x0 + z.q), den = z.x0 - z.p, d0 = den / gcd(num, den); while (d0 % 2 === 0) d0 /= 2; while (d0 % 5 === 0) d0 /= 5; return d0 === 1 && num / den < 500;
        });
      },
      stem: function (o) { return 'A rectangular prism has volume ' + t(fracE([Mo(1, 'x', 1), A(1, o.p)], [A(1, -o.q)])) + ' cubic metres and base area ' + t(fracE([A(1, -o.p), A(1, o.p)], [A(1, -o.q), A(1, o.q)])) + ' square metres, where ' + t('x>' + o.p) + '.'; },
      parts: [
        { id: 'e7a', level: 'PRG', make: function (r, o) {
          var p = U.opPart(CP, [E([Mo(1, 'x', 1), A(1, o.p)], [A(1, -o.q)]), E([A(1, -o.p), A(1, o.p)], [A(1, -o.q), A(1, o.q)])], ['div'], { noNpv: true, prompt: 'Write and simplify an expression for its height.', show: '\\text{height}=\\text{volume}\\div\\text{base area}', text: 'prism height' });
          p.prompt = 'Write and simplify an expression for its height.';
          return p;
        } },
        { id: 'e7b', level: 'EMG', make: function (r, o) {
          var num = o.x0 * (o.x0 + o.q), den = o.x0 - o.p, val = ex.norm(num, den);
          var p = KP.fraction('Determine the height when ' + t('x=' + o.x0) + '.', val, { decimalOk: true }, t('\\frac{' + o.x0 + '(' + (o.x0 + o.q) + ')}{' + den + '}=' + ex.texRat(val) + (val[1] === 1 ? '' : '=' + HW.fmt(num / den))) + ' m.', ['Substitute into your simplified height.'], 'prism height at a value');
          p.input.after = '\\text{ m}';
          return p;
        } }] },
    { num: '8', parts: [
      { id: 'e8', level: 'EMG', make: function (r) {   // (x+a)/(x−b) ÷ (x−c)/(x+d): NPVs b, −d, c
        var s = pickWhere(function () { return { a: r.int(1, 9), b: nz(r, 1, 9), c: nz(r, 1, 9), d: nz(r, 1, 9) }; }, function (z) { var v = [-z.a, z.b, z.c, -z.d]; return v.every(function (x, i) { return v.indexOf(x) === i; }) && !(z.a === 3 && z.b === 2 && z.c === 4 && z.d === 1); });
        var e1 = fracE([A(1, s.a)], [A(1, -s.b)]), e2 = fracE([A(1, -s.c)], [A(1, s.d)]);
        return mcp(r, '<i>(Multiple Choice)</i> The non-permissible values of ' + t(e1 + '\\div ' + e2) + ' are', [
          { html: t(npvTex(ox([s.b, -s.d, s.c]))), right: true },
          { html: t(npvTex(ox([s.b]))), why: 'Both denominators give NPVs, and so does the divisor’s numerator.', code: 'npv-mc' },
          { html: t(npvTex(ox([s.b, -s.d]))), why: 'The divisor cannot be ' + t(0) + ': ' + t(polyT([A(1, -s.c)]) + '=0') + ' gives an NPV too.', code: 'npv-div' },
          { html: t(npvTex(ox([s.b, -s.d, s.c, -s.a]))), why: t(polyT([A(1, s.a)])) + ' is a numerator of the first expression (it stays a numerator), so ' + t('x=' + (-s.a)) + ' is allowed.', code: 'npv-num' }],
          'Denominators give ' + t('x\\ne ' + s.b) + ' and ' + t('x\\ne ' + (-s.d)) + '; the divisor’s numerator gives ' + t('x\\ne ' + s.c) + '. (' + t(polyT([A(1, s.a)])) + ' is a numerator of the first expression, so ' + t('x=' + (-s.a)) + ' is allowed.)', ['Denominators, and the numerator of the divisor.'], 'MC: NPVs of a division');
      } }] },
    { num: '9', parts: [
      { id: 'e9', level: 'ADV', make: function (r) {   // (av+b)(v−p)/((v−p)(v+q)) ÷ (v−s)/((v+q)(v−s)) → av+b; A × B
        var z = U.gen(r, CP, function () { var f = monics(r, 3, 6, noOpp), a = r.int(2, 6), b = r.int(1, 9); if (gcd(a, b) !== 1 || a * b > 99) return null;
          return div2(E([A(a, b), A(1, -f[0])], [A(1, -f[0]), A(1, f[1])]), E([A(1, -f[2])], [A(1, f[1]), A(1, -f[2])])); },
          { deg: [1, 0], npvs: 3, avoid: AV, maxc: 80, text: 'NR: A × B' }).z;
        var a = z.es[0].n[0].a, b = z.es[0].n[0].b, T = U.opInfo(z.es, z.ops).T;
        return KP.nr('<i>(Numerical Response)</i> For all permissible values of ' + t('x') + ', ' + t(U.exprShow(z.es[0]) + '\\div ' + U.exprShow(z.es[1])) + ' simplifies to a linear expression ' + t('Ax+B') + '. The value of ' + t('A\\times B') + ' is ______.', a * b,
          function (v) { if (v === a + b) return { code: CP + 'nr-ab', hint: 'That is ' + t('A+B') + '. The question asks for ' + t('A\\times B') + '.' }; return null; },
          t(U.exprFac(z.es[0]) + '\\cdot ' + U.fracF(z.es[1].d, z.es[1].n) + '=' + cTex(T)) + ', so ' + t('A\\times B=' + a + '\\times ' + b + '=' + a * b) + '.', ['Factor the first numerator with the ' + t('ac') + ' method, then flip the divisor.'], 'NR: A × B');
      } }] },
    { num: '10', section: 'C. Stretch', parts: [
      { id: 'e10', level: 'MAS', make: function (r) {   // □ ÷ Q = R → □ = R·Q; Q = (x−p)(x+p)/(x(x+q)), R = x/(x−p)
        var s = pickWhere(function () { return { p: nz(r, 1, 7), q: nz(r, 1, 7) }; }, function (z) { return Math.abs(z.q) !== Math.abs(z.p) && !(z.p === 3 && z.q === 1); });
        var Qn = [A(1, -s.p), A(1, s.p)], Qd = [Mo(1, 'x', 1), A(1, s.q)], Rn = [Mo(1, 'x', 1)], Rd = [A(1, -s.p)];
        var T = canon([Rn, Qn], [Rd, Qd]), dv = canon([Rn, Qd], [Rd, Qn]), inv = canon([Rd, Qd], [Rn, Qn]);
        return U.ratPart(CP, 'Determine the rational expression that belongs in the box: ' + t('\\boxed{\\phantom{xx}}\\div ' + fracE(Qn, Qd) + '=' + fracE(Rn, Rd)), T,
          { dl: [{ cn: dv, code: CP + 'box-mul', hint: 'If ' + t('P\\div Q=R') + ', then ' + t('P=R\\cdot Q') + ': multiply, don’t divide.' }, { cn: inv, code: CP + 'box-inv', hint: 'Your expression is upside down. If ' + t('P\\div Q=R') + ', then ' + t('P=R\\cdot Q') + '.' }] },
          'If ' + t('P\\div Q=R') + ', then ' + t('P=R\\cdot Q') + '.<br>' + t('P=' + fracF(Rn, Rd) + '\\cdot ' + fracF(Qn, Qd) + '=' + cTex(T)) + '.', ['If ' + t('P\\div Q=R') + ', how do you get ' + t('P') + '? (Think ' + t('P\\div 4=3') + '.)'], 'missing dividend');
      } }] },
    { num: '11', parts: [
      { id: 'e11', level: 'MAS', make: function (r) {   // E1 ÷ (E2 ÷ E3) → (x−p)²/x
        var s = pickWhere(function () { return { p: nz(r, 1, 6), q: r.int(1, 6) }; }, function (z) { return Math.abs(z.p) !== z.q && !(z.p === 4 && z.q === 1); });
        var p = s.p, q = s.q;
        var E1 = E([A(1, -q), A(1, q)], [Mo(1, 'x', 1), A(1, p)]), E2 = E([Mo(1, 'x', 1), A(1, q)], [A(1, -p), A(1, p)]), E3 = E([Mo(1, 'x', 1), A(1, -p)], [A(1, -q)]);
        var es = [E1, E2, E3], show = U.exprShow(E1) + '\\div\\left(' + U.exprShow(E2) + '\\div ' + U.exprShow(E3) + '\\right)';
        var I = U.opInfo(es, ['div', 'div'], { flip: [false, true, false], divN: [E3.n, E2.n] });
        var noBr = npvMerge(npvOf(I.dens), npvOf([E3.n])), ltr = U.opCanon(es, [false, true, true]);
        var inner = U.opCanon([E2, E3], [false, true]);
        return U.opPart(CP, es, ['div', 'div'], { flip: [false, true, false], divN: [E3.n, E2.n], show: show, text: 'nested division',
          dl: [{ cn: ltr, code: CP + 'mix-group', hint: 'Do the brackets first: ' + t('\\left(' + U.exprShow(E2) + '\\div ' + U.exprShow(E3) + '\\right)') + ' is one divisor.' }],
          nw: [{ vals: noBr, code: CP + 'npv-bracket', hint: 'The bracket is itself a divisor, so its value cannot be ' + t(0) + ': it is ' + t(0) + ' where ' + t(facTex(E2.n) + '=0') + '.' }],
          hints: ['Brackets first: simplify ' + t(U.exprShow(E2) + '\\div ' + U.exprShow(E3)) + ', then divide by the result.', 'NPVs: every denominator, the inner divisor’s numerator, and every value that makes the bracket ' + t(0) + '.'],
          sol: function (I2, key) {
            var recip = U.opCanon([E3, E2], [false, true]);
            return 'Brackets first: ' + t(U.exprFac(E2) + '\\cdot ' + U.fracF(E3.d, E3.n) + '=' + cTex(inner)) + '.<br>Then ' + t(U.exprFac(E1) + '\\div ' + cTex(inner) + '=' + U.exprFac(E1) + '\\cdot ' + cTex(recip) + '=' + key) + '.<br>NPVs: the denominators ' + t(facTex(E1.d)) + ', ' + t(facTex(E2.d)) + ', ' + t(facTex(E3.d)) + ' give ' + t(npvTex(npvOf(I2.dens))) + '; the inner divisor’s numerator ' + t(facTex(E3.n)) + ' gives ' + t(npvTex(npvOf([E3.n]))) + '; the bracket is a divisor, so its value cannot be ' + t(0) + ': ' + t(facTex(E2.n) + '=0') + ' gives ' + t(npvTex(npvOf([E2.n]))) + '.<br>So ' + t(npvTex(I2.npv)) + '.';
          } });
      } }] },
    { num: '12', parts: [
      { id: 'e12', level: 'ADV', make: function (r) {   // (x−a)/(x+b) ÷ (x−a)/(x+b) = 1 except at −b, a
        var s = pickWhere(function () { return { a: nz(r, 1, 9), b: nz(r, 1, 9) }; }, function (z) { return z.a !== -z.b && !(z.a === 3 && z.b === 1); });
        var e = fracE([A(1, -s.a)], [A(1, s.b)]), npv = ox([-s.b, s.a]);
        return U.npvPart(CP, 'Any non-zero number divided by itself is ' + t(1) + '. For which values of ' + t('x') + ' is ' + t(e + '\\div ' + e) + ' <b>not</b> equal to ' + t(1) + '?', npv,
          { nw: [{ vals: ox([-s.b]), code: CP + 'npv-div', hint: 'The divisor cannot be ' + t(0) + ': at ' + t('x=' + s.a) + ' it is ' + t(0) + ', so the quotient is undefined there too.' }, { vals: ox([s.a]), code: CP + 'npv-missing', hint: 'A denominator is ' + t(0) + ' at ' + t('x=' + (-s.b)) + ', so the expression is undefined there.' }], div: true },
          'It fails where the expression is undefined: at ' + t('x=' + (-s.b)) + ' (a denominator is ' + t(0) + ') and at ' + t('x=' + s.a) + ' (the divisor is ' + t(0) + '). So it equals ' + t(1) + ' for ' + t(npvTex(npv)) + ' and is undefined (not ' + t(1) + ') at ' + t('x=' + (-s.b)) + ' and ' + t('x=' + s.a) + '.',
          ['Where is the expression undefined? Check the denominators and the divisor.'], 'not equal to 1: where');
      } }] }
  ];

  HW.defineLesson({ id: 'u6l4', unit: 6, num: '4', title: 'Dividing Rational Expressions', outcome: 'AN5', calc: true, questions: QUESTIONS, extra: EXTRA });
})(window);
