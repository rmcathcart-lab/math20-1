/* Math 20-1 · Unit 7 · Lesson 4 — Solving Absolute Value Equations (Linear) (outcome RF2 on every part)
 * Assignment 4 (m201book unit7/u7_l04.tex, Questions 1–18) and the Lesson 4 Extra Practice (u7_ep04.tex, A1–A4, B5–B9,
 * C1–C3). Every part is a generator: the booklet question's idea, form and difficulty with new numbers (the lesson's
 * example numbers and the booklet question's own numbers are left out). Calculator allowed; answers exact (fractions)
 * except where the booklet rounds (the zero method to the hundredth, numerical response to the tenth or hundredth).
 * Conversions: "describe how to use the intersection / zero method" -> multiple choice on the method (what to graph,
 * which CALC feature, which coordinate is the answer), then the solution; "solve graphically, sketch both graphs" ->
 * the solution, with the two graphs drawn in the worked solution; "find the error" -> multiple choice, then the correct
 * solution; "solve by cases, show the number line and both cases" -> boxes for the value where the inside is 0, each
 * case's answer and the solution; "solve and verify, identify extraneous solutions" -> the solutions and the extraneous
 * roots (or none); "explain why" -> multiple choice; clock times -> hh:mm boxes; numerical response -> a number box.
 * Recognised mistakes: one case only, splitting before isolating the absolute value, solving |A| = (a negative), keeping
 * an extraneous root (or one outside its subdomain), rejecting a root that checks, negating only one term in the second
 * case, the zero with the wrong sign, the whole distance for d, the wrong centre, k-inequalities the wrong way or with
 * the boundary, counting solutions without checking.
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: Q12, Q13(b), Extra C1, C2, C3.
 * Uses the Lesson 3–4 kit HW.u7k34 (js/lessons/u7l3.js, loaded first; codes 'u7l4-…' are registered there). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, KP = K.P, P = HW.poly, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, U = HW.u7k34;
  if (!U) throw new Error('js/lessons/u7l4.js needs js/lessons/u7l3.js (the kit HW.u7k34) loaded first');
  var LID = 'u7l4', CP = 'u7l4-', OUT = 'RF2';
  var toR = U.toR, rv = U.rv, nt = U.nt, sgT = U.sgT, A = U.A, lin = U.lin, tx = U.tx, pickWhere = U.pickWhere, nz = U.nz, has = U.has, uniqNums = U.uniqNums, sameSet = U.sameSet,
    excl = U.excl, rootsT = U.rootsT, rootsChk = U.rootsChk, rootsPart = U.rootsPart, valChk = U.valChk, valPart = U.valPart, numChk = U.numChk, fieldsPart = U.fieldsPart, mcPart = U.mcPart,
    setT = U.setT, numVal = U.numVal, G = U.G, crv = U.crv, gcd = U.gcd;
  function Pt(id, level, make) { return { id: id, level: level, outcome: OUT, make: make }; }
  function sortV(a) { return a.slice().sort(function (x, y) { return rv(x) - rv(y); }); }
  function linT(a, b, cf) { return cf && rv(a) < 0 && rv(b) !== 0 ? P.seq([U.M(b, 0), U.M(a, 1)]) : tx(lin(a, b)); }
  function par(x) { return rv(x) < 0 ? '(' + nt(x) + ')' : nt(x); }
  var HCST = ['Isolate the absolute value first: undo what is done outside the bars.', t('|A|=c') + ': two solutions if ' + t('c>0') + ' (' + t('A=c') + ' or ' + t('A=-c') + '), one if ' + t('c=0') + ', none if ' + t('c<0') + '.'];
  var HLIN = ['Isolate the absolute value, then solve ' + t('A=B') + ' and ' + t('A=-B') + ' (negate the whole right side).', 'Substitute each answer into the original equation: the side without bars must not be negative.'];

  /* ======================================================================================================
   * |A| = c after isolating. s: { a, b (inside = ax + b), inner (its tex), eq (tex), c (the isolated value), steps,
   * noiso: values from splitting before isolating, sign: values from a sign slip in the zero }
   * ====================================================================================================== */
  function cstPart(s, prompt) {
    var a = rv(s.a), b = s.b, c = s.c, vals = c < 0 ? [] : c === 0 ? [-b / a] : sortV(uniqNums([(c - b) / a, (-c - b) / a])), wr = [];
    if (c > 0) wr.push({ vals: [(c - b) / a], code: CP + 'one-case', hint: 'There is a second case: ' + t(s.inner + '=-' + nt(c)) + '.' });
    if (c < 0) wr.push({ vals: uniqNums([(c - b) / a, (-c - b) / a]), code: CP + 'neg-abs', hint: 'After isolating, ' + t(A(s.inner) + '=' + nt(c)) + ': an absolute value is never negative, so there is no solution.' });
    if (s.noiso && !sameSet(s.noiso, vals)) wr.push({ vals: s.noiso, code: CP + 'no-iso', hint: 'Isolate the absolute value <b>before</b> splitting into two cases: ' + t(A(s.inner) + '=' + nt(c)) + '.' });
    if (s.sign && !sameSet(s.sign, vals)) wr.push({ vals: s.sign, code: 'sign', hint: 'Check the signs: solve ' + t(s.inner + '=' + nt(Math.abs(c))) + ' carefully.' });
    if (c > 0) wr.push({ vals: [], code: CP + 'nosol-claim', hint: 'The absolute value equals a positive number, so there are two solutions.' });
    var sol = (s.steps || '') + (c < 0 ? t(A(s.inner) + '=' + nt(c)) + ': an absolute value is never negative, so there is <b>no solution</b>.' : c === 0 ? t(s.inner + '=0') + ', so ' + t('x=' + nt(vals[0])) + ' (one solution).' : t(s.inner + '=' + nt(c)) + ' or ' + t(s.inner + '=-' + nt(c)) + ', so ' + vals.map(function (x) { return t('x=' + nt(x)); }).join(' or ') + '.');
    return rootsPart(CP, prompt || 'Solve ' + t(s.eq) + '.', vals, { wrongs: wr }, sol, HCST, 'solving |A| = c');
  }
  /* the kinds of |A| = c in the booklet */
  function cst(kind, ex0, opt) {
    ex0 = ex0 || []; opt = opt || {};
    return function (r) {
      var s;
      if (kind === 'x') { var c0 = pickWhere(function () { return r.int(2, 20); }, function (c) { return c !== 7 && c !== 12; }); s = { a: 1, b: 0, inner: 'x', eq: A('x') + '=' + c0, c: c0 }; }
      else if (kind === 'xneg') { var c1 = r.int(1, 9), h1 = r.chance(0.5) ? 0 : nz(r, 1, 6); s = { a: 1, b: h1, inner: tx(lin(1, h1)), eq: A(tx(lin(1, h1))) + '=-' + c1, c: -c1 }; }
      else if (kind === 'shift' || kind === 'shiftBig') {
        var z = pickWhere(function () { return kind === 'shift' ? { h: nz(r, 1, 9), c: r.int(1, 9) } : { h: -r.int(2, 15), c: r.int(5, 15) }; }, function (z) { return excl(z, ex0.concat([{ h: -3, c: 5 }, { h: 6, c: 2 }, { h: 8, c: 3 }, { h: -7, c: 10 }])) && z.c !== Math.abs(z.h); });
        s = { a: 1, b: z.h, inner: tx(lin(1, z.h)), eq: A(tx(lin(1, z.h))) + '=' + z.c, c: z.c, sign: [z.h + z.c, z.h - z.c] };
      } else if (kind === 'zero') { var h2 = pickWhere(function () { return nz(r, 1, 12); }, function (h) { return h !== 9 && h !== -4; }); s = { a: 1, b: -h2, inner: tx(lin(1, -h2)), eq: A(tx(lin(1, -h2))) + '=0', c: 0, sign: [-h2] }; }
      else if (kind === 'zeroLin') { var z3 = pickWhere(function () { return { a: r.int(2, 7), b: r.int(1, 20) }; }, function (z) { return excl(z, [{ a: 2, b: 6 }]) && (gcd(z.a, z.b) === 1 || z.b % z.a === 0); }); s = { a: -z3.a, b: z3.b, inner: linT(-z3.a, z3.b, true), eq: A(linT(-z3.a, z3.b, true)) + '=0', c: 0, sign: [-z3.b / z3.a] }; }
      else if (kind === 'lin') { var z4 = pickWhere(function () { return { a: nz(r, 2, 6), b: nz(r, 1, 9), c: r.int(3, 16) }; }, function (z) { return gcd(z.a, z.b) === 1 && excl(z, ex0.concat([{ a: 5, b: 2, c: 13 }, { a: 2, b: -5, c: 9 }, { a: 2, b: -4, c: 6 }, { a: 4, b: -2, c: 10 }])) && ((z.c - z.b) % z.a !== 0 || (-z.c - z.b) % z.a !== 0 || r.chance(0.4)); }); var cf = z4.a < 0 && r.chance(0.6); s = { a: z4.a, b: z4.b, inner: linT(z4.a, z4.b, cf), eq: A(linT(z4.a, z4.b, cf)) + '=' + z4.c, c: z4.c }; }
      else if (kind === 'iso' || kind === 'isoNone') {
        var z5 = pickWhere(function () { var none = kind === 'isoNone', k = none ? r.pick([1, 1, 2, 3]) : r.int(2, 5), a = none ? nz(r, 1, 4) : 1; return { k: k, a: a, b: nz(r, 1, 8), c: none ? -r.int(1, 8) : r.int(1, 8), d: nz(r, 1, 12) }; },
          function (z) { return gcd(z.a, z.b) === 1 && excl({ k: z.k, b: z.b, d: z.d, e: z.k * z.c + z.d }, ex0.concat([{ k: 4, b: 1, d: -3, e: 17 }, { k: 3, b: 2, d: -4, e: 11 }, { k: 5, b: -1, d: 2, e: 22 }])) && excl({ a: z.a, b: z.b, d: z.d }, [{ a: 3, b: -4, d: 9 }, { a: -3, b: 4, d: 8 }, { a: 2, b: 7, d: 6 }]) && z.k * z.c + z.d !== 0; });
        var e = z5.k * z5.c + z5.d, inner = linT(z5.a, z5.b, z5.a < 0), lhs = (z5.k === 1 ? '' : z5.k) + A(inner) + sgT(z5.d);
        var w1 = ((e - z5.d) / z5.k - z5.b) / z5.a, w2 = ((-e - z5.d) / z5.k - z5.b) / z5.a;
        s = { a: z5.a, b: z5.b, inner: inner, eq: lhs + '=' + e, c: z5.c, noiso: uniqNums([w1, w2]), steps: t((z5.k === 1 ? '' : z5.k) + A(inner) + '=' + (e - z5.d)) + (z5.k === 1 ? '' : ', so ' + t(A(inner) + '=' + nt(z5.c))) + '.<br>' };
      } else if (kind === 'negk') {
        var z6 = pickWhere(function () { return { k: r.pick(opt.ks || [2, 3, 4]), a: r.pick(opt.as || [1, 2, 3]), b: nz(r, 1, 6), c: r.int(2, 9) }; }, function (z) { return gcd(z.a, z.b) === 1 && excl(z, ex0.concat([{ k: 3, a: 2, b: -1, c: 5 }, { k: 1, a: 1, b: 4, c: 9 }])); });
        var inner6 = tx(lin(z6.a, z6.b)), e6 = -z6.k * z6.c;
        s = { a: z6.a, b: z6.b, inner: inner6, eq: (z6.k === 1 ? '-' : '-' + z6.k) + A(inner6) + '=' + e6, c: z6.c, steps: 'Divide by ' + t(-z6.k) + ': ' + t(A(inner6) + '=' + z6.c) + '.<br>' };
      } else if (kind === 'half') {
        var z7 = pickWhere(function () { return { m: r.pick([2, 2, 3]), b: nz(r, 1, 6), c: r.int(1, 6) }; }, function (z) { return excl(z, [{ m: 2, b: -3, c: 1 }]) && z.c !== Math.abs(z.b); });
        var in7 = '\\frac{1}{' + z7.m + '}x' + sgT(z7.b);
        s = { a: 1 / z7.m, b: z7.b, inner: in7, eq: A(in7) + '=' + z7.c, c: z7.c, steps: '', fr: true };
      } else if (kind === 'fracIn') {
        var z8 = pickWhere(function () { return { m: r.pick([2, 3, 4, 5]), h: nz(r, 1, 7), c: r.int(1, 5) }; }, function (z) { return excl(z, [{ m: 3, h: 2, c: 2 }]); });
        var in8 = '\\frac{x' + sgT(-z8.h) + '}{' + z8.m + '}';
        s = { a: 1 / z8.m, b: -z8.h / z8.m, inner: in8, eq: A(in8) + '=' + z8.c, c: z8.c, steps: t(in8 + '=\\pm ' + z8.c) + ', so ' + t('x' + sgT(-z8.h) + '=\\pm ' + z8.m * z8.c) + '.<br>' };
      } else if (kind === 'sub') {
        var z9 = pickWhere(function () { return { d: r.int(4, 15), h: nz(r, 1, 8), c: r.int(1, 8) }; }, function (z) { return z.d - z.c > 0 && excl(z, [{ d: 7, h: 2, c: 4 }]) && z.c !== Math.abs(z.h); });
        var in9 = tx(lin(1, z9.h)), e9 = z9.d - z9.c;
        s = { a: 1, b: z9.h, inner: in9, eq: z9.d + '-' + A(in9) + '=' + e9, c: z9.c, noiso: uniqNums([z9.d - e9 - z9.h, z9.d + e9 - z9.h]), steps: t('-' + A(in9) + '=' + (e9 - z9.d)) + ', so ' + t(A(in9) + '=' + z9.c) + '.<br>' };
      } else if (kind === 'div') {
        var z10 = pickWhere(function () { return { m: r.pick([2, 3, 4, 5]), a: nz(r, 2, 5), b: nz(r, 1, 7), c: r.int(1, 6) }; }, function (z) { return gcd(z.a, z.b) === 1 && excl(z, [{ m: 3, a: 4, b: -1, c: 5 }]); });
        var in10 = tx(lin(z10.a, z10.b));
        s = { a: z10.a, b: z10.b, inner: in10, eq: '\\frac{' + A(in10) + '}{' + z10.m + '}=' + z10.c, c: z10.m * z10.c, steps: 'Multiply by ' + t(z10.m) + ': ' + t(A(in10) + '=' + z10.m * z10.c) + '.<br>', noiso: uniqNums([(z10.c - z10.b) / z10.a, (-z10.c - z10.b) / z10.a]) };
      }
      return cstPart(s);
    };
  }
  function negk(ks, as) { return cst('negk', [], { ks: ks, as: as }); }

  /* ======================================================================================================
   * |ax + b| = cx + d
   * ====================================================================================================== */
  function linSpec(r, o) {
    o = o || {};
    return pickWhere(function () { return { a: o.as ? r.pick(o.as) : nz(r, 1, 5), b: o.bs ? r.pick(o.bs) : r.int(-10, 10), c: o.cs ? r.pick(o.cs) : nz(r, 1, 4), d: r.int(o.dlo == null ? -10 : o.dlo, o.dhi == null ? 10 : o.dhi) }; }, function (z) {
      var a = rv(z.a), c = rv(z.c);
      if (Math.abs(a) === Math.abs(c) || z.b === 0 || z.d === 0 && !o.d0) return false;
      var x1 = (z.d - z.b) / (a - c), x2 = (-z.d - z.b) / (a + c), f1 = toR(x1), f2 = toR(x2);
      if (!f1 || !f2 || f1[1] > (o.den || 5) || f2[1] > (o.den || 5) || Math.abs(x1 - x2) < 1e-9 || Math.abs(x1) > 15 || Math.abs(x2) > 15) return false;
      var B1 = c * x1 + z.d, B2 = c * x2 + z.d; if (Math.abs(B1) < 1e-9 || Math.abs(B2) < 1e-9) return false;
      z.x1 = x1; z.x2 = x2; z.v1 = B1 > 0; z.v2 = B2 > 0; z.n = (z.v1 ? 1 : 0) + (z.v2 ? 1 : 0);
      if (o.ints && (f1[1] !== 1 || f2[1] !== 1)) return false;
      return (o.counts || [1, 2]).indexOf(z.n) >= 0 && (!o.test || o.test(z)) && excl(z, o.ex || []);
    });
  }
  var EXLIN = [{ a: 2, b: -4, c: 0, d: 6 }, { a: 1, b: 1, c: 2, d: -1 }, { a: 3, b: -6, c: 1, d: 2 }, { a: 1, b: -4, c: 3, d: 0 }, { a: 2, b: 3, c: 1, d: 6 }, { a: 3, b: 1, c: 1, d: -5 }, { a: 2, b: -6, c: 1, d: 3 }, { a: 1, b: 5, c: 2, d: 1 }];
  function L(z) {
    var vals = [], extr = [];
    [[z.x1, z.v1], [z.x2, z.v2]].forEach(function (q) { (q[1] ? vals : extr).push(q[0]); });
    var inner = tx(lin(z.a, z.b)), rhs = tx(lin(z.c, z.d));
    return { vals: sortV(vals), extr: extr, inner: inner, rhs: rhs, xn: (z.d - z.b) / (-rv(z.a) - rv(z.c)) };
  }
  /* the same equation with the inside written with a positive leading coefficient: recompute the cases */
  function respec(z, a, b) { var q = Object.assign({}, z, { a: a, b: b }), c = rv(q.c); q.x1 = (q.d - b) / (a - c); q.x2 = (-q.d - b) / (a + c); q.v1 = c * q.x1 + q.d > 0; q.v2 = c * q.x2 + q.d > 0; return q; }
  function chkLine(z, x) { var Lv = Math.abs(rv(z.a) * x + z.b), Rv = rv(z.c) * x + z.d; return 'Check ' + t('x=' + nt(x)) + ': left side ' + t(nt(Lv)) + ', right side ' + t(nt(Rv)) + (Math.abs(Lv - Rv) < 1e-9 ? ' ✓' : ' ✗: the right side is negative, so ' + t('x=' + nt(x)) + ' is extraneous') + '.'; }
  function linSol(z, iso) {
    var S = L(z);
    return (iso || '') + 'Case 1: ' + t(S.inner + '=' + S.rhs) + ', so ' + t('x=' + nt(z.x1)) + '.<br>Case 2: ' + t(S.inner + '=-(' + S.rhs + ')') + ', so ' + t('x=' + nt(z.x2)) + '.<br>' + chkLine(z, z.x1) + '<br>' + chkLine(z, z.x2) + '<br>' +
      (S.vals.length ? 'Solution: ' + S.vals.map(function (x) { return t('x=' + nt(x)); }).join(' or ') + (S.extr.length ? ' (' + S.extr.map(function (x) { return t(nt(x)); }).join(', ') + ' is extraneous)' : '') : 'Both are extraneous: <b>no solution</b>') + '.';
  }
  function linWrongs(z) {
    var S = L(z), wr = [];
    if (!has(S.vals.concat(S.extr), S.xn) && isFinite(S.xn)) wr.push({ vals: S.vals.length ? [S.vals[0], S.xn] : [S.xn], code: CP + 'neg-one', hint: 'In the second case the <b>whole</b> right side is negated: ' + t(S.inner + '=-(' + S.rhs + ')') + '.' });
    return wr;
  }
  /* the equation shown: std |A| = B; iso |A| ± cx = d; coef k|x − h| = B */
  function linEq(z, view, cf) {
    var S = L(z), a = rv(z.a);
    if (view === 'iso') { var cc = rv(z.c); return { eq: A(linT(z.a, z.b, cf)) + (cc > 0 ? '-' + (cc === 1 ? '' : nt(cc)) : '+' + (cc === -1 ? '' : nt(-cc))) + 'x=' + z.d, iso: 'Isolate: ' + t(A(S.inner) + '=' + S.rhs) + '.<br>' }; }
    if (view === 'coef') { var k = Math.abs(a), h = -z.b / a, inn = tx(lin(1, -h)); return { eq: k + A(inn) + '=' + S.rhs, iso: t(k + A(inn) + '=' + A(tx(lin(Math.abs(a), Math.abs(a) * -h)))) + ', so the equation is ' + t(A(tx(lin(Math.abs(a), Math.abs(a) * -h))) + '=' + S.rhs) + '.<br>' }; }
    return { eq: A(linT(z.a, z.b, cf)) + '=' + S.rhs, iso: '' };
  }
  /* solve by cases: the zero of the inside, each case's answer, the solution */
  function casesPart(r, z, cfOk) {
    var a = rv(z.a), z0 = -z.b / a, cf = cfOk && a < 0, inner = linT(z.a, z.b, cf), S = L(z), rhs = S.rhs;
    var pos = a > 0 ? 'x\\ge ' + nt(z0) : 'x\\le ' + nt(z0), neg = a > 0 ? 'x<' + nt(z0) : 'x>' + nt(z0);
    var keep = function (x, c1) { return c1 ? (a > 0 ? x >= z0 - 1e-9 : x <= z0 + 1e-9) : (a > 0 ? x < z0 : x > z0); };
    var fields = [{ label: 'The inside is 0 at ' + t('x='), name: 'zero of the inside', mode: 'math', keys: 'u7sol', vars: ['x'] }, { label: 'Case ' + t(pos) + ': ' + t('x='), name: 'case 1', mode: 'math', keys: 'u7sol', vars: ['x'] },
      { label: 'Case ' + t(neg) + ': ' + t('x='), name: 'case 2', mode: 'math', keys: 'u7sol', vars: ['x'] }, { label: 'Solution:', name: 'solution', mode: 'math', keys: 'u7sol', vars: ['x'] }];
    var keys = [nt(z0), nt(z.x1), nt(z.x2), rootsT(S.vals)];
    var subHint = 'Keep a case answer only if it is in its own subdomain: ' + S.extr.map(function (x) { return t('x=' + nt(x)); }).join(', ') + ' is not.';
    var checks = [valChk(CP, z0, [{ v: -z0, code: CP + 'case-zero', hint: 'Solve ' + t(inner + '=0') + ' again.' }]), valChk(CP, z.x1, []), valChk(CP, z.x2, isFinite(S.xn) && Math.abs(S.xn - z.x2) > 1e-9 ? [{ v: S.xn, code: CP + 'neg-one', hint: 'Where the inside is negative, ' + t(A(inner) + '=-(' + tx(lin(z.a, z.b)) + ')') + ': change the sign of <b>every</b> term.' }] : []),
      rootsChk(CP, S.vals, { extr: S.extr, extrCode: 'case-sub', extrHint: subHint, rejValid: true, wrongs: linWrongs(z) })];
    var line = function (x, c1) { return keep(x, c1) ? 'in the subdomain: keep' : 'not ' + t(c1 ? (a > 0 ? '\\ge ' : '\\le ') + nt(z0) : (a > 0 ? '<' : '>') + nt(z0)) + ': reject'; };
    var sol = t(inner + '=0') + ' at ' + t('x=' + nt(z0)) + '.<br>Case ' + t(pos) + ': ' + t(A(inner) + '=' + inner) + ', so ' + t(inner + '=' + rhs) + ', ' + t('x=' + nt(z.x1)) + ' (' + line(z.x1, true) + ').<br>Case ' + t(neg) + ': ' + t(A(inner) + '=-(' + inner + ')') + ', so ' + t('-(' + inner + ')=' + rhs) + ', ' + t('x=' + nt(z.x2)) + ' (' + line(z.x2, false) + ').<br>' + (S.vals.length ? 'Solution: ' + S.vals.map(function (x) { return t('x=' + nt(x)); }).join(' or ') : '<b>No solution</b>') + '.';
    var bad = [keys.slice(0, 3).concat([rootsT(sortV([z.x1, z.x2]))]), [nt(-z0)].concat(keys.slice(1))];
    return fieldsPart('Solve ' + t(A(inner) + '=' + rhs) + ' by cases. Give the value of ' + t('x') + ' where the inside is 0, the answer from each case (before checking its subdomain), and the solution.', fields, checks, keys, t(keys[3]), sol,
      ['The inside ' + t(inner) + ' is 0 at one value of ' + t('x') + ': it splits the number line into two subdomains.', 'Where the inside is negative, replace the bars by ' + t('-(\\ldots)') + '. Keep each answer only if it is in its own subdomain.'], 'solving |ax + b| = cx + d by cases', bad);
  }
  /* solve and verify: the solutions and the extraneous roots */
  function verifyPart(r, z, view) {
    var cf = rv(z.a) < 0 && r.chance(0.5), E = linEq(z, view, cf), S = L(z), zz = z;
    if (view === 'coef') { var aa = Math.abs(rv(z.a)); zz = respec(z, aa, aa * (-z.b / rv(z.a))); }
    var fields = [{ label: 'Solutions:', name: 'solutions', mode: 'math', keys: 'u7sol', vars: ['x'] }, { label: 'Extraneous roots:', name: 'extraneous roots', mode: 'math', keys: 'u7sol', vars: ['x'], none: true, placeholder: 'e.g. x = 2   (or: none)' }];
    var keys = [rootsT(S.vals), S.extr.length ? rootsT(S.extr) : '\\text{none}'];
    var checks = [rootsChk(CP, S.vals, { extr: S.extr, rejValid: true, wrongs: linWrongs(zz) }), rootsChk(CP, S.extr, { wrongs: S.vals.length ? [{ vals: S.vals, code: CP + 'ext-list', hint: 'Those values check in the original equation, so they are solutions, not extraneous.' }, { vals: S.vals.concat(S.extr), code: CP + 'ext-list', hint: 'Only the values that fail the check are extraneous.' }] : [], noneHint: 'One of the two answers fails the check: it is extraneous.' })];
    var bad = [[rootsT(sortV([z.x1, z.x2])), '\\text{none}'], [keys[0], S.vals.length ? rootsT(S.vals) : '\\text{none}']];
    return fieldsPart('Solve and verify: ' + t(E.eq) + '. Identify any extraneous roots.', fields, checks, keys, 'solutions ' + t(keys[0]) + '; extraneous ' + t(keys[1]), linSol(zz, E.iso), HLIN, 'solve and verify, extraneous roots', bad);
  }
  /* a graph of the V and the line */
  function vlGraph(a, b, c, d, pts) {
    var xs = pts.map(function (p) { return p[0]; }).concat([-b / a]), lo = Math.floor(Math.min.apply(null, xs.concat([-4]))) - 2, hi = Math.ceil(Math.max.apply(null, xs.concat([4]))) + 2;
    var ys = pts.map(function (p) { return p[1]; }), Y = Math.max(6, Math.ceil(Math.max.apply(null, ys.concat([0]))) + 2); if (Y % 2) Y++;
    return G({ x: [lo, hi], y: [-Math.min(Y, 8), Y], labels: Math.max(hi - lo, Y + 8) > 16 ? 4 : 2, max: 280, fns: [crv(function (x) { return Math.abs(a * x + b); }), crv(function (x) { return c * x + d; }, { color: '#c4532a' })], points: pts.map(function (p) { return { x: p[0], y: p[1], label: '(' + U.fmt(p[0]) + ', ' + U.fmt(p[1]) + ')' }; }), aria: 'a V-shaped graph and a line' });
  }

  /* ======================================================================================================
   * The assignment
   * ====================================================================================================== */
  var QUESTIONS = [
    { num: '1', parts: [Pt('1a', 'LIM', cst('x')), Pt('1b', 'BEG', cst('shift')), Pt('1c', 'BEG', cst('zero')), Pt('1d', 'BEG', cst('xneg'))] },

    { num: '2', shared: function (r) { return linSpec(r, { as: [1, 2, 3, -2], cs: [1, 2], counts: [2], ints: true, ex: EXLIN.concat([{ a: 2, b: -3, c: 1, d: 3 }]) }); },
      stem: function (z) { return 'Consider ' + t(A(L(z).inner) + '=' + L(z).rhs) + '.'; },
      parts: [
        Pt('2a', 'EMG', function (r, z) { var S = L(z), y1 = 'Y_1=' + A(S.inner), y2 = 'Y_2=' + S.rhs;
          return mcPart(r, 'Which describes the <b>intersection method</b> on a graphing calculator?', [
            { html: 'Graph ' + t(y1) + ' and ' + t(y2) + '; use <b>intersect</b> at each point where they meet. The solutions are the ' + t('x') + '-coordinates.', right: true },
            { html: 'Graph ' + t(y1) + ' and ' + t(y2) + '; use <b>intersect</b> at each point where they meet. The solutions are the ' + t('y') + '-coordinates.', why: 'The solutions are values of ' + t('x') + ' that make the two sides equal: the ' + t('x') + '-coordinates of the intersection points.' },
            { html: 'Graph ' + t('Y_1=' + A(S.inner)) + ' only and use <b>zero</b> to find its ' + t('x') + '-intercept.', why: 'That solves ' + t(A(S.inner) + '=0') + ', not this equation. Graph both sides.' },
            { html: 'Graph ' + t(y1) + ' and ' + t(y2) + '; use <b>minimum</b> on ' + t('Y_1') + '. The solution is the ' + t('x') + '-coordinate of the vertex.', why: 'The vertex of the V is where the inside is 0. The solutions are where the two graphs meet.' }],
            'Graph each side as its own function (' + t(y1) + ' is typed <code>abs(…)</code>, from MATH, NUM). The solutions are the ' + t('x') + '-coordinates of the points of intersection (2nd TRACE, intersect).', ['The intersection method graphs both sides.'], 'the intersection method'); }),
        Pt('2b', 'PRG', function (r, z) { var S = L(z); return rootsPart(CP, 'Use the intersection method (or algebra) to state the solution of ' + t(A(S.inner) + '=' + S.rhs) + '.', S.vals, { extr: S.extr, wrongs: linWrongs(z), rejValid: true }, 'The graphs meet at ' + S.vals.map(function (x) { return t('(' + nt(x) + ',\\ ' + nt(rv(z.c) * x + z.d) + ')'); }).join(' and ') + ': ' + S.vals.map(function (x) { return t('x=' + nt(x)); }).join(' or ') + '.' + vlGraph(rv(z.a), z.b, rv(z.c), z.d, S.vals.map(function (x) { return [x, rv(z.c) * x + z.d]; })) + '<br>' + linSol(z), HLIN, 'solve with the intersection method'); })] },

    { num: '3', shared: function (r) { return linSpec(r, { as: [1, 2, -1], cs: [2, 3], bs: [1, 2, 3, -1, -2, 4, 5], counts: [1], ints: true, ex: EXLIN.concat([{ a: 1, b: 1, c: 2, d: -4 }]) }); },
      stem: function (z) { return 'Consider ' + t(A(L(z).inner) + '=' + L(z).rhs) + '.'; },
      parts: [
        Pt('3a', 'EMG', function (r, z) { var S = L(z), mv = tx(P.neg(lin(z.c, z.d))), moved = A(S.inner) + (mv.charAt(0) === '-' ? '' : '+') + mv, plus = A(S.inner) + (S.rhs.charAt(0) === '-' ? '' : '+') + S.rhs, slip = A(S.inner) + (mv.charAt(0) === '-' ? '' : '+') + tx(lin(-rv(z.c), z.d)), inside = A(S.inner + (mv.charAt(0) === '-' ? '' : '+') + mv);
          return mcPart(r, 'For the <b>zero method</b>, which function do you graph?', [
            { html: t('Y_1=' + moved), right: true }, { html: t('Y_1=' + plus), why: 'Move the right side over by <b>subtracting</b> it: every term changes sign.' },
            { html: t('Y_1=' + slip), why: 'Subtract the <b>whole</b> right side: both of its terms change sign.' }, { html: t('Y_1=' + inside), why: 'The terms you move go outside the bars: ' + t(A(S.inner) + '-(' + S.rhs + ')') + '.' }],
            'Move every term to one side: ' + t(moved + '=0') + '. Graph ' + t('Y_1=' + moved) + ' and use <b>zero</b> (2nd TRACE) on each ' + t('x') + '-intercept.', ['The zero method needs (…) = 0.'], 'the zero method'); }),
        Pt('3b', 'PRG', function (r, z) { var S = L(z), mv = tx(P.neg(lin(z.c, z.d))), F = function (x) { return Math.abs(rv(z.a) * x + z.b) - rv(z.c) * x - z.d; };
          return rootsPart(CP, 'Use the zero method (or algebra) to state the solution of ' + t(A(S.inner) + '=' + S.rhs) + '.', S.vals, { extr: S.extr, wrongs: linWrongs(z), rejValid: true },
            'The graph of ' + t('y=' + A(S.inner) + (mv.charAt(0) === '-' ? '' : '+') + mv) + ' has one zero, ' + t('x=' + nt(S.vals[0])) + '.' + G({ x: [Math.floor(Math.min(S.vals[0], -z.b / rv(z.a))) - 4, Math.ceil(Math.max(S.vals[0], -z.b / rv(z.a))) + 4], y: [-8, 8], fns: [crv(F)], points: [{ x: S.vals[0], y: 0 }], max: 260, aria: 'the graph for the zero method' }) + '<br>' + linSol(z), HLIN, 'solve with the zero method'); })] },

    { num: '4', parts: [
      Pt('4a', 'BEG', function (r) { var z = pickWhere(function () { return { h: nz(r, 1, 5), c: r.int(2, 6) }; }, function (z) { return excl(z, [{ h: 2, c: 4 }, { h: 3, c: 5 }]); }), vals = [z.h - z.c, z.h + z.c];
        return rootsPart(CP, 'Solve graphically (graph ' + t('y=' + A(tx(lin(1, -z.h)))) + ' and ' + t('y=' + z.c) + '): ' + t(A(tx(lin(1, -z.h))) + '=' + z.c) + '.', vals, { wrongs: [{ vals: [z.h + z.c], code: CP + 'one-case', hint: 'The horizontal line meets <b>both</b> arms of the V.' }, { vals: [-z.h - z.c, -z.h + z.c], code: 'sign', hint: 'The vertex of ' + t('y=' + A(tx(lin(1, -z.h)))) + ' is at ' + t('x=' + z.h) + '.' }] },
          'The V has its vertex at ' + t('(' + z.h + ',\\ 0)') + '; the line ' + t('y=' + z.c) + ' meets it at ' + t('(' + (z.h - z.c) + ',\\ ' + z.c + ')') + ' and ' + t('(' + (z.h + z.c) + ',\\ ' + z.c + ')') + ': ' + t('x=' + (z.h - z.c)) + ' or ' + t('x=' + (z.h + z.c)) + '.' + vlGraph(1, -z.h, 0, z.c, [[z.h - z.c, z.c], [z.h + z.c, z.c]]), ['Sketch the V and the horizontal line; read the ' + t('x') + '-coordinates where they meet.'], 'solving graphically: |x − h| = c'); }),
      Pt('4b', 'PRG', function (r) { var z = linSpec(r, { as: [2, -2, 3], cs: [1, -1], counts: [2], ints: true, ex: EXLIN.concat([{ a: 2, b: 2, c: 1, d: 4 }]) }), S = L(z);
        return rootsPart(CP, 'Solve graphically (graph both sides): ' + t(A(S.inner) + '=' + S.rhs) + '.', S.vals, { extr: S.extr, wrongs: linWrongs(z) }, 'The graphs meet at ' + S.vals.map(function (x) { return t('(' + nt(x) + ',\\ ' + nt(rv(z.c) * x + z.d) + ')'); }).join(' and ') + ': ' + S.vals.map(function (x) { return t('x=' + nt(x)); }).join(' or ') + '.' + vlGraph(rv(z.a), z.b, rv(z.c), z.d, S.vals.map(function (x) { return [x, rv(z.c) * x + z.d]; })), ['Graph the V and the line; read where they meet.', 'Check each answer in the equation.'], 'solving graphically: two solutions'); }),
      Pt('4c', 'PRG', function (r) {
        var z = pickWhere(function () { return { h: r.int(-4, 5), m: r.pick([0.5, -0.5]), d: -r.int(1, 6) }; }, function (z) { return z.m * z.h + z.d < 0 && excl(z, [{ h: 3, m: 0.5, d: -4 }]); });
        var x1 = (z.h + z.d) / (1 - z.m), x2 = (z.h - z.d) / (1 + z.m), rhs = (z.m > 0 ? '' : '-') + '\\frac{1}{2}x' + sgT(z.d);
        return rootsPart(CP, 'Solve graphically (graph both sides): ' + t(A(tx(lin(1, -z.h))) + '=' + rhs) + '.', [], { extr: [x1, x2], wrongs: [{ vals: [x1, x2], code: CP + 'extr', hint: 'Look at the graph: the line stays below the V, so they never meet. Both algebraic answers fail the check.' }] },
          'The line ' + t('y=' + rhs) + ' has a slope between ' + t('-1') + ' and ' + t('1') + ' and passes below the vertex ' + t('(' + z.h + ',\\ 0)') + ', so it stays below the V: <b>no solution</b>. (Algebra gives ' + t('x=' + nt(x1)) + ' and ' + t('x=' + nt(x2)) + '; both fail the check.)' + vlGraph(1, -z.h, z.m, z.d, []), ['Sketch both graphs. Do they meet?'], 'solving graphically: no solution');
      }),
      Pt('4d', 'ADV', function (r) {
        var z = pickWhere(function () { return { h: r.int(-3, 5), d: r.int(-5, 5), s: r.pick([1, -1]) }; }, function (z) { return z.d > -z.h && z.d !== -z.h && excl(z, [{ h: 3, d: -1, s: 1 }]); });
        var x = (z.h - z.d) / 2, inner = z.s > 0 ? z.h + '-x' : tx(lin(1, -z.h)), y = x + z.d;
        if (z.h === 0) inner = z.s > 0 ? '-x' : 'x';
        return rootsPart(CP, 'Solve graphically (graph both sides): ' + t(A(inner) + '=' + tx(lin(1, z.d))) + '.', [x], { wrongs: [{ vals: [], code: CP + 'nosol-claim', hint: 'The left arm of the V does meet the line.' }] },
          'The right arm of the V, ' + t('y=x' + sgT(-z.h)) + ', is parallel to the line ' + t('y=' + tx(lin(1, z.d))) + ', so only the left arm meets it: at ' + t('(' + nt(x) + ',\\ ' + nt(y) + ')') + '. ' + t('x=' + nt(x)) + '.' + vlGraph(1, -z.h, 1, z.d, [[x, y]]), ['Compare the slopes of the arms of the V with the slope of the line.'], 'solving graphically: one solution (parallel arm)');
      })] },

    { num: '5', parts: [Pt('5a', 'BEG', cst('shiftBig')), Pt('5b', 'BEG', cst('lin')), Pt('5c', 'BEG', cst('zeroLin')), Pt('5d', 'EMG', cst('isoNone')), Pt('5e', 'EMG', cst('iso')), Pt('5f', 'EMG', negk([2, 3, 4], [1, 2, 3])),
      Pt('5g', 'PRG', cst('half')), Pt('5h', 'PRG', cst('sub')), Pt('5i', 'PRG', cst('div'))] },

    { num: '6', shared: function (r) { return pickWhere(function () { return { h: nz(r, 1, 8), d: r.int(2, 9), e: r.int(1, 9) }; }, function (z) { return z.d !== z.e && excl(z, [{ h: 3, d: 5, e: 2 }, { h: -2, d: 4, e: 1 }]); }); },
      stem: function (z) { var inn = tx(lin(1, -z.h)); return 'Jordan solved ' + t(A(inn) + '-' + z.d + '=' + z.e) + ' like this: ' + t(inn + '-' + z.d + '=' + z.e) + ' or ' + t(inn + '-' + z.d + '=-' + z.e) + ', so ' + t('x=' + (z.h + z.d + z.e)) + ' or ' + t('x=' + (z.h + z.d - z.e)) + '.'; },
      parts: [
        Pt('6a', 'EMG', function (r, z) { var inn = tx(lin(1, -z.h)), bad = z.h + z.d - z.e;
          return mcPart(r, 'What is Jordan’s error?', [
            { html: 'He did not isolate the absolute value before splitting into two cases.', right: true }, { html: 'He forgot the negative case.', why: 'He did write two cases. Look at what was still outside the bars when he split.' },
            { html: 'An absolute value equation has only one solution.', why: 'It can have two, one or none.' }, { html: 'He should have changed ' + t('-' + z.d) + ' to ' + t('+' + z.d) + ' in both cases.', why: 'The ' + t('-' + z.d) + ' is outside the bars: it must be moved first, not changed.' }],
            'The absolute value was not isolated first. Check ' + t('x=' + bad) + ': ' + t(A(bad + sgT(-z.h)) + '-' + z.d + '=' + (Math.abs(bad - z.h) - z.d)) + (Math.abs(bad - z.h) - z.d === z.e ? '' : '\\ne ' + z.e) + ', so it is wrong.', ['What has to be done before splitting into cases?'], 'finding the error'); }),
        Pt('6b', 'PRG', function (r, z) { var inn = tx(lin(1, -z.h)), c = z.d + z.e, vals = [z.h - c, z.h + c];
          return rootsPart(CP, 'Solve ' + t(A(inn) + '-' + z.d + '=' + z.e) + ' correctly.', vals, { wrongs: [{ vals: [z.h + z.d + z.e, z.h + z.d - z.e], code: CP + 'no-iso', hint: 'That is Jordan’s answer. Isolate first: ' + t(A(inn) + '=' + c) + '.' }, { vals: [z.h + c], code: CP + 'one-case', hint: 'There is a second case: ' + t(inn + '=-' + c) + '.' }] },
            t(A(inn) + '=' + c) + ', so ' + t(inn + '=\\pm ' + c) + ': ' + t('x=' + (z.h + c)) + ' or ' + t('x=' + (z.h - c)) + '. Check ' + t('x=' + (z.h - c)) + ': ' + t(A(-c) + '-' + z.d + '=' + z.e) + ' ✓', HCST, 'solving after isolating'); })] },

    { num: '7', parts: [
      Pt('7a', 'PRG', function (r) { return casesPart(r, linSpec(r, { as: [1], cs: [2, 3, 4], counts: [1], test: function (z) { return z.v1; }, ex: EXLIN.concat([{ a: 1, b: 2, c: 3, d: 0 }]), d0: true, bs: [1, 2, 3, 4, 5, -1, -2, -3, -5], dlo: 0, dhi: 0 })); }),
      Pt('7b', 'PRG', function (r) { return casesPart(r, linSpec(r, { as: [2, 3], cs: [1], counts: [2], ex: EXLIN.concat([{ a: 2, b: -6, c: 1, d: 0 }]), d0: true, dlo: 0, dhi: 0 })); }),
      Pt('7c', 'PRG', function (r) { return casesPart(r, linSpec(r, { as: [-1, -2], cs: [2, 3, 1], bs: [3, 4, 5, 6, 7, 8], counts: [1], dlo: -4, dhi: 5, ex: EXLIN.concat([{ a: -1, b: 5, c: 2, d: 1 }]) }), true); }),
      Pt('7d', 'ADV', function (r) { return casesPart(r, linSpec(r, { as: [2, 3, 4], cs: [1], counts: [0], ex: EXLIN.concat([{ a: 3, b: 1, c: 1, d: -3 }]) })); })] },

    { num: '8', parts: [
      Pt('8a', 'PRG', function (r) { return verifyPart(r, linSpec(r, { as: [2, 3, -3, 4], cs: [1], counts: [2], test: function (z) { return Number.isInteger(-z.b / rv(z.a)); }, ex: EXLIN.concat([{ a: 3, b: -6, c: 1, d: 6 }]) }), 'coef'); }),
      Pt('8b', 'PRG', function (r) { return verifyPart(r, linSpec(r, { as: [3, 4, -4, 5], cs: [2, 1, 3], counts: [2], ex: EXLIN.concat([{ a: 4, b: -3, c: 2, d: 5 }]) }), 'iso'); }),
      Pt('8c', 'ADV', function (r) { return verifyPart(r, linSpec(r, { as: [1], cs: [-2, -3], counts: [1], d0: true, dlo: 0, dhi: 0, ex: EXLIN.concat([{ a: 1, b: -6, c: -2, d: 0 }]) }), 'iso'); }),
      Pt('8d', 'ADV', function (r) { return verifyPart(r, linSpec(r, { as: [2, -2, 3], cs: [3, 4, 1], counts: [1], ex: EXLIN.concat([{ a: 2, b: 5, c: 3, d: 10 }]) }), 'std'); })] },

    { num: '9', parts: [Pt('9', 'ADV', function (r) {
      var z = linSpec(r, { as: [[1, 2], [1, 3], [-1, 2]], cs: [1, 2], bs: [1, 2, 3, -1, -2, -3, 4], counts: [1], den: 3, ex: [{ a: 0.5, b: 1, c: 1, d: -2 }] }), S = L(z);
      return rootsPart(CP, 'Solve ' + t(A(S.inner) + '=' + S.rhs) + '.', S.vals, { extr: S.extr, wrongs: linWrongs(z), rejValid: true }, linSol(z), HLIN, 'an equation with a fraction coefficient');
    })] },

    { num: '10', parts: [Pt('10', 'BEG', function (r) {
      var kind = r.pick(['thermo', 'fridge', 'pool']), s = kind === 'thermo' ? pickWhere(function () { return { T: r.int(18, 23), d: r.pick([0.5, 1, 1.5, 2, 2.5]) }; }, function (z) { return excl(z, [{ T: 20, d: 1.5 }]); }) : kind === 'fridge' ? { T: r.pick([3, 4, 5]), d: r.pick([0.5, 1, 1.5, 2]) } : { T: r.pick([26, 27, 28, 29]), d: r.pick([0.5, 1, 1.5]) };
      var ctx = { thermo: 'A home thermostat is set to ' + t(s.T + '\\,^\\circ') + 'C. The furnace turns on or off whenever the room temperature differs from the setting by ' + t(nt(s.d) + '\\,^\\circ') + 'C.', fridge: 'A fridge is set to ' + t(s.T + '\\,^\\circ') + 'C. Its compressor switches on or off when the temperature inside differs from the setting by ' + t(nt(s.d) + '\\,^\\circ') + 'C.', pool: 'A pool heater keeps the water at ' + t(s.T + '\\,^\\circ') + 'C. It switches on or off when the water temperature differs from that by ' + t(nt(s.d) + '\\,^\\circ') + 'C.' }[kind];
      var vals = [s.T - s.d, s.T + s.d];
      return rootsPart(CP, ctx + ' Write and solve an absolute value equation for these two temperatures ' + t('T') + ' (in ' + t('^\\circ') + 'C).', vals, { v: 'T', noNone: true, wrongs: [{ vals: [s.T + s.d], code: CP + 'one-case', hint: 'The temperature can also be ' + t(nt(s.d) + '\\,^\\circ') + 'C <b>below</b> the setting.' }] },
        t(A('T-' + s.T) + '=' + nt(s.d)) + ': ' + t('T-' + s.T + '=\\pm ' + nt(s.d)) + ', so ' + t('T=' + nt(s.T + s.d)) + '\\(^\\circ\\)C or ' + t('T=' + nt(s.T - s.d)) + '\\(^\\circ\\)C.', ['The difference from the setting is ' + t(A('T-' + s.T)) + '.'], 'temperatures from |T − s| = d');
    })] },

    { num: '11', parts: [
      Pt('11a', 'EMG', fromSol('int')), Pt('11b', 'PRG', fromSol('dec')), Pt('11c', 'EMG', fromSol('one'))] },

    { num: '12', parts: [Pt('12', 'MAS', function (r) {
      var s = pickWhere(function () { return { h: nz(r, 2, 12), m: r.pick([2, 3, 4, 5]) }; }, function (z) { return excl(z, [{ h: 7, m: 3 }, { h: 2, m: 2 }]); });
      var mv = s.m, x1 = s.h / (1 - mv), x2 = s.h / (1 + mv), good = mv * x1 >= 0 ? x1 : x2, bad = good === x1 ? x2 : x1;
      var times = { 2: 'twice', 3: 'three times', 4: 'four times', 5: 'five times' }[mv], eq = A('x' + sgT(-s.h)) + '=' + mv + 'x';
      var chk = function (x) { return t(A(nt(x) + sgT(-s.h)) + '=' + nt(Math.abs(x - s.h))) + ' and ' + t(mv + '\\times' + par(x) + '=' + nt(mv * x)) + (mv * x >= 0 ? ' ✓' : ' ✗ (a distance cannot be negative)'); };
      return valPart(CP, 'The distance between a number and ' + t(s.h) + ' is ' + times + ' the number. Write an equation and determine the number.', toR(good),
        [{ v: bad, code: CP + 'extr', hint: 'Check it: ' + t(mv + 'x') + ' would be negative there, and a distance is never negative. It is extraneous.' }],
        'Let the number be ' + t('x') + ': ' + t(eq) + '.<br>' + t('x' + sgT(-s.h) + '=' + mv + 'x') + ' gives ' + t('x=' + nt(x1)) + '; ' + t('-(x' + sgT(-s.h) + ')=' + mv + 'x') + ' gives ' + t('x=' + nt(x2)) + '.<br>Check ' + t('x=' + nt(x1)) + ': ' + chk(x1) + '<br>Check ' + t('x=' + nt(x2)) + ': ' + chk(x2) + '<br>The number is ' + t(nt(good)) + '.',
        ['The distance between ' + t('x') + ' and ' + t(s.h) + ' is ' + t(A('x' + sgT(-s.h))) + '.', 'Solve both cases, then check each answer: the right side must not be negative.'], 'a number from its distance to h');
    })] },

    { num: '13', parts: [
      Pt('13a', 'EMG', function (r) {
        var h = U.pickWhere(function () { return nz(r, 1, 9); }, function (h) { return h !== 3; }), inn = tx(lin(1, -h));
        var fields = [{ label: 'Two solutions when', name: 'two solutions', mode: 'math', keys: 'set', vars: ['k'] }, { label: 'One solution when ' + t('k='), name: 'one solution' , mode: 'math', keys: 'set', vars: ['k'] }, { label: 'No solution when', name: 'no solution', mode: 'math', keys: 'set', vars: ['k'] }];
        var T2 = setT('k>0', 'k'), T0 = setT('k<0', 'k');
        return fieldsPart('For which values of ' + t('k') + ' does ' + t(A(inn) + '=k') + ' have two solutions? one solution? no solution?', fields,
          [K.set(T2, { v: 'k', tag: false, wrong: [{ is: setT('k\\ge 0', 'k'), code: CP + 'k-end', hint: 'When ' + t('k=0') + ' there is only one solution.' }, { is: T0, code: CP + 'k-swap', hint: 'A negative ' + t('k') + ' gives no solution.' }] }), valChk(CP, 0, [{ v: h, code: CP + 'k-swap', hint: t('x=' + h) + ' is the solution when ' + t('k=0') + '; the question asks for ' + t('k') + '.' }]), K.set(T0, { v: 'k', tag: false, wrong: [{ is: setT('k\\le 0', 'k'), code: CP + 'k-end', hint: 'When ' + t('k=0') + ' there is one solution, ' + t('x=' + h) + '.' }, { is: T2, code: CP + 'k-swap', hint: 'A positive ' + t('k') + ' gives two solutions.' }] })],
          [T2, '0', T0], 'two: ' + t('k>0') + '; one: ' + t('k=0') + ' (' + t('x=' + h) + '); none: ' + t('k<0'), 'Two: ' + t('k>0') + ' (' + t('x=' + h + '\\pm k') + '). One: ' + t('k=0') + ' (' + t('x=' + h) + '). None: ' + t('k<0') + ' (an absolute value is never negative).', HCST, 'number of solutions of |x − h| = k', [[setT('k\\ge 0', 'k'), '0', T0], [T2, String(h), T0]]);
      }),
      Pt('13b', 'MAS', function (r) {
        var a = nz(r, 1, 4), b = nz(r, 1, 9), d = pickWhere(function () { return nz(r, 1, 12); }, function (d) { return d !== 4; }), m = r.pick([1, 1, 2, 3]), inner = tx(lin(a, b)), flip = r.chance(0.4);
        var eq = flip ? 'k-' + (m === 1 ? '' : m) + A(inner) + '=' + d : (m === 1 ? '' : m) + A(inner) + '+k=' + d;
        var tgt = flip ? setT('k<' + d, 'k') : setT('k>' + d, 'k');
        var wr = flip ? [{ is: setT('k>' + d, 'k'), code: CP + 'k-dir', hint: 'Isolate: ' + t((m === 1 ? '' : m) + A(inner) + '=k-' + par(d)) + '. No solution when the right side is negative.' }, { is: setT('k\\le ' + d, 'k'), code: CP + 'k-end', hint: 'When ' + t('k=' + d) + ' the absolute value equals 0: one solution.' }]
          : [{ is: setT('k<' + d, 'k'), code: CP + 'k-dir', hint: 'Isolate: ' + t((m === 1 ? '' : m) + A(inner) + '=' + d + '-k') + '. No solution when the right side is negative.' }, { is: setT('k\\ge ' + d, 'k'), code: CP + 'k-end', hint: 'When ' + t('k=' + d) + ' the absolute value equals 0: one solution.' }];
        var p = KP.set('For which values of ' + t('k') + ' does ' + t(eq) + ' have no solution?', tgt, { v: 'k', tag: false, wrong: wr },
          'Isolate the absolute value: ' + t((m === 1 ? '' : m) + A(inner) + '=' + (flip ? 'k-' + par(d) : d + '-k')) + '. It has no solution when the right side is negative: ' + t(flip ? 'k-' + par(d) + '<0' : d + '-k<0') + ', that is, ' + t(flip ? 'k<' + d : 'k>' + d) + '.',
          ['Isolate the absolute value: the other side is an expression in ' + t('k') + '.', 'No solution exactly when that side is negative (when it is 0 there is one solution).'], 'values of k with no solution');
        p.bad = wr.map(function (w) { return w.is; }); return p;
      })] },

    { num: '14', parts: [Pt('14', 'PRG', function (r) {
      var z = pickWhere(function () { return { m: r.pick([2, 3, 4]), h: nz(r, 1, 6), c: r.int(2, 8), d: r.int(1, 9) }; }, function (z) { return excl(z, [{ m: 2, h: 1, c: 4, d: 3 }, { m: 3, h: -2, c: 5, d: -4 }]) && z.c !== Math.abs(z.h); });
      var e = z.m * z.c + z.d, inn = tx(lin(1, -z.h)), xA = z.h + z.c, xB = z.h - z.c, xN = z.h - (e + z.d) / z.m;
      var opts = [{ html: t('x=' + xA) + ' or ' + t('x=' + xB), right: true }, { html: t('x=' + xA) + ' only', why: 'There is a second case: ' + t(inn + '=-' + z.c) + '.' },
        { html: t('x=' + xA) + ' or ' + t('x=' + nt(xN)), why: 'Isolate the absolute value before you split into two cases.' }, { html: t('x=' + (-z.h + z.c)) + ' or ' + t('x=' + (-z.h - z.c)), why: 'Check the signs: ' + t(inn + '=\\pm ' + z.c) + ' gives ' + t('x=' + z.h + '\\pm ' + z.c) + '.' }];
      return mcPart(r, 'The complete solution of ' + t(z.m + A(inn) + '+' + z.d + '=' + e) + ' is', opts, t(z.m + A(inn) + '=' + (e - z.d)) + ', ' + t(A(inn) + '=' + z.c) + ', ' + t(inn + '=\\pm ' + z.c) + ': ' + t('x=' + xA) + ' or ' + t('x=' + xB) + '.', HCST, 'MC: the complete solution');
    })] },

    { num: '15', parts: [Pt('15', 'PRG', function (r) {
      var n = r.pick([0, 0, 1, 2]), z = linSpec(r, n === 1 ? { as: [1, 2, -1], cs: [3, 4, -3], counts: [1] } : { as: [2, 3, -2, -3], cs: [1, 2, -1], counts: [n], ex: [{ a: 2, b: -1, c: 1, d: -4 }] }), S = L(z);
      var whys = { 0: 'Check each answer from the two cases: ' + [z.x1, z.x2].map(function (x) { return t('x=' + nt(x)) + ' makes the right side ' + t(nt(rv(z.c) * x + z.d)); }).join('; ') + '.', 1: 'Check both answers in the original equation: one of them makes the right side negative.', 2: 'Both answers from the two cases check.' };
      var opts = [0, 1, 2].map(function (k) { return { html: t(k), right: k === n, why: k === 2 && n < 2 ? 'Two answers come from the cases, but each must be checked: ' + whys[0] : whys[n] }; }).concat([{ html: 'infinitely many', why: 'The line is not on an arm of the V (their slopes differ), so they meet at most twice.' }]);
      return mcPart(r, 'How many solutions does ' + t(A(S.inner) + '=' + S.rhs) + ' have?', opts, linSol(z), HLIN, 'MC: number of solutions');
    })] },

    { num: '16', parts: [Pt('16', 'EMG', function (r) {
      var h = nz(r, 1, 6), k = r.int(2, 9), j = r.int(1, 9);
      return mcPart(r, 'Which equation has <b>no</b> solution?', [
        { html: t(A('x') + '+' + k + '=0'), right: true }, { html: t(A(tx(lin(1, h))) + '=0'), why: t(A(tx(lin(1, h))) + '=0') + ' when ' + t('x=' + (-h)) + ': one solution.' },
        { html: t(A(tx(lin(1, -h))) + '-' + j + '=0'), why: 'Isolate: ' + t(A(tx(lin(1, -h))) + '=' + j) + ', a positive number: two solutions.' }, { html: t('-' + A('x') + '=-' + k), why: 'Divide by ' + t('-1') + ': ' + t(A('x') + '=' + k) + ', so ' + t('x=\\pm ' + k) + '.' }],
        'Isolate: ' + t(A('x') + '=-' + k) + ' is impossible, because an absolute value is never negative.', HCST, 'MC: no solution');
    })] },

    { num: '17', parts: [Pt('17', 'PRG', function (r) {
      var z = linSpec(r, { as: [3, 4, -3, 5], cs: [1, 2], counts: [2], ints: true, test: function (z) { var s = z.x1 + z.x2; return s > 0 && s < 100; }, ex: [{ a: 3, b: -12, c: 2, d: 2 }] }), S = L(z), sum = z.x1 + z.x2;
      return KP.nr('The sum of the solutions of ' + t(A(S.inner) + '=' + S.rhs) + ' is ____.', sum, function (v) { return Math.abs(v - Math.max(z.x1, z.x2)) < 1e-9 ? { code: CP + 'sol-missing', hint: 'There are two solutions: solve both cases.' } : null; }, linSol(z) + '<br>Sum ' + t('=' + sum) + '.', HLIN, 'NR: sum of the solutions');
    })] },

    { num: '18', parts: [Pt('18', 'ADV', function (r) {
      var z = linSpec(r, { as: [-2, -3, 2, 3], cs: [3, 4, 2], counts: [1], den: 9, test: function (z) { var x = z.v1 ? z.x1 : z.x2; return x > 0 && x < 100; }, ex: [{ a: -2, b: 5, c: 3, d: 1 }] }), S = L(z), x = S.vals[0], cf = rv(z.a) < 0;
      var inner = linT(z.a, z.b, cf);
      var p = KP.approx('The solution of ' + t(A(inner) + '=' + S.rhs) + ', to the nearest tenth, is ____.', x, 1, { nr: true, diag: function (v) { return S.extr.some(function (e) { return Math.abs(Math.round(e * 10) / 10 - v) < 1e-9; }) ? { code: CP + 'extr', hint: 'That one makes the right side negative: it is extraneous.' } : null; } }, linSol(z) + '<br>To the nearest tenth: ' + t(String(K.roundTo(x, 1))) + '.', HLIN, 'NR: the solution to the tenth');
      return p;
    })] }
  ];

  /* |x − a| = d from its solutions */
  function fromSol(kind) {
    return function (r) {
      var m, n;
      if (kind === 'int') { var s = pickWhere(function () { return { m: r.int(-15, 6), w: r.pick([2, 4, 6, 8, 10, 12, 14, 16]) }; }, function (z) { return z.m + z.w !== -z.m && excl(z, [{ m: -2, w: 12 }, { m: -3, w: 14 }]); }); m = s.m; n = s.m + s.w; }
      else if (kind === 'dec') { var s2 = pickWhere(function () { return { m: r.int(-20, 4) + 0.5, w: r.int(2, 12) }; }, function (z) { return excl(z, [{ m: -7.5, w: 6 }]); }); m = s2.m; n = s2.m + s2.w; }
      else { m = n = pickWhere(function () { return nz(r, 1, 12); }, function (v) { return v !== 5; }); }
      var a = (m + n) / 2, d = (n - m) / 2;
      var fields = [{ label: t('a='), name: 'a', mode: 'math', keys: 'fraction' }, { label: t('d='), name: 'd', mode: 'math', keys: 'fraction' }], keys = [nt(a), nt(d)];
      var eqT = A('x' + (a === 0 ? '' : sgT(-a))) + '=' + nt(d);
      return fieldsPart('Write an absolute value equation in the form ' + t('|x-a|=d') + ' with the solution' + (m === n ? ' ' + t(m) + ' only' : 's ' + t(nt(m)) + ' and ' + t(nt(n))) + ': give ' + t('a') + ' and ' + t('d') + '.', fields, [valChk(CP, a, [{ v: -a, code: CP + 'wd-a', hint: t('a') + ' is the midpoint of the solutions. Check its sign.' }], { exact: false }), valChk(CP, d, [{ v: n - m, code: CP + 'wd-d', hint: t('d') + ' is half the distance between the solutions.' }], { exact: false })], keys, t('a=' + nt(a)) + ', ' + t('d=' + nt(d)) + ': ' + t(eqT),
        m === n ? 'Only one solution means ' + t('d=0') + ' and ' + t('a=' + nt(m)) + ': ' + t(eqT) + '.' : t('a') + ' is the midpoint: ' + t('\\frac{' + nt(m) + '+' + par(n) + '}{2}=' + nt(a)) + '; ' + t('d') + ' is half the distance: ' + t('\\frac{' + nt(n) + '-' + par(m) + '}{2}=' + nt(d)) + '.<br>' + t(eqT) + '. Check: ' + t(A(nt(m) + sgT(-a)) + '=' + nt(d)) + ' ✓',
        [t('|x-a|=d') + ' means ' + t('x') + ' is ' + t('d') + ' units from ' + t('a') + ': the solutions are ' + t('a-d') + ' and ' + t('a+d') + '.', 'So ' + t('a') + ' is halfway between the solutions.'], 'an equation from its solutions', [[nt(a), nt(n - m)], [nt(-a), nt(d)]].filter(function (b) { return !(b[0] === keys[0] && b[1] === keys[1]); }),
        function (resp) { var x = numVal(resp[0]), y = numVal(resp[1]); if (x == null || y == null) return null; if (Math.abs(x - a) < 1e-9 && Math.abs(y - (n - m)) < 1e-9 && n !== m) return wrong(CP + 'wd-d', t('a') + ' is right. ' + t('d') + ' is the distance from the midpoint to each solution: half the distance between them.'); return null; });
    };
  }

  /* ======================================================================================================
   * Extra practice
   * ====================================================================================================== */
  function clockT(mins) { var h = Math.floor(mins / 60), m = mins % 60; return h + ':' + (m < 10 ? '0' : '') + m; }
  function clockChk(mins, other) {
    return function (resp) {
      var s = String(resp == null ? '' : resp).replace(/\\text\{([^}]*)\}/g, '$1').replace(/\\[:,; ]|\s/g, '').replace(/\\colon/g, ':');
      if (!s) return form('empty', 'Type your answer first.');
      var m = /^(\d{1,2})[:.h](\d{2})$/.exec(s); if (!m) return form('clock-fmt', 'Write the time as hh:mm, for example 14:05.');
      var v = Number(m[1]) * 60 + Number(m[2]);
      if (v === mins) return ok();
      if (v === other) return wrong(CP + 'clock', 'That is the other time: check which one is earlier.');
      return wrong(CP + 'clock', 'Convert the minutes after midnight: divide by 60 for the hours; the remainder is the minutes.');
    };
  }
  HW.addCodes({ 'clock-fmt': 'Time not written as hh:mm (format)' });

  var EXTRA = [
    { num: 'A1', section: 'A. Skills', parts: [Pt('eA1a', 'BEG', cst('shift', [{ h: 8, c: 3 }])), Pt('eA1b', 'BEG', cst('lin')), Pt('eA1c', 'EMG', cst('iso')), Pt('eA1d', 'EMG', cst('isoNone')), Pt('eA1e', 'EMG', negk([1], [1])), Pt('eA1f', 'PRG', cst('fracIn'))] },
    { num: 'A2', parts: [
      Pt('eA2a', 'PRG', function (r) { return casesPart(r, linSpec(r, { as: [1], cs: [3, 4, 5], counts: [1], test: function (z) { return z.v2; }, d0: true, dlo: 0, dhi: 0, bs: [-2, -3, -4, -5, -6, -7], ex: [{ a: 1, b: -5, c: 4, d: 0 }, { a: 1, b: -4, c: 3, d: 0 }] })); }),
      Pt('eA2b', 'PRG', function (r) { return casesPart(r, linSpec(r, { as: [2, 3, 4], cs: [1], counts: [2], ex: [{ a: 3, b: 6, c: 1, d: 10 }].concat(EXLIN) })); })] },
    { num: 'A3', parts: [
      Pt('eA3a', 'PRG', function (r) { return verifyPart(r, linSpec(r, { as: [1], cs: [2, 3], counts: [1], d0: true, dlo: 0, dhi: 0, ex: [{ a: 1, b: 3, c: 2, d: 0 }, { a: 1, b: -4, c: 3, d: 0 }] }), 'std'); }),
      Pt('eA3b', 'PRG', function (r) { return verifyPart(r, linSpec(r, { as: [2, 4, 3], cs: [1, 2], counts: [2], test: function (z) { return Number.isInteger(-z.b / rv(z.a)); }, ex: [{ a: 4, b: -4, c: 2, d: 6 }] }), 'coef'); }),
      Pt('eA3c', 'ADV', function (r) { return verifyPart(r, linSpec(r, { as: [2, 3], cs: [-1, -2], counts: [0], ex: [{ a: 2, b: -1, c: -1, d: -2 }] }), 'iso'); })] },
    { num: 'A4', shared: function (r) { return pickWhere(function () { return { h: nz(r, 1, 4), d: r.int(-3, 6) }; }, function (z) { return z.d > z.h && (z.h + z.d) % 2 === 0 && excl(z, [{ h: -1, d: 3 }]); }); },
      stem: function (z) { return 'Consider ' + t(A(tx(lin(1, -z.h))) + '=-x' + sgT(z.d)) + '.'; },
      parts: [
        Pt('eA4a', 'PRG', function (r, z) { var x = (z.h + z.d) / 2, y = x - z.h;
          return rootsPart(CP, 'Solve it graphically (graph both sides), then verify algebraically.', [x], { wrongs: [{ vals: [], code: CP + 'nosol-claim', hint: 'The right arm of the V meets the line.' }] },
            'The graphs meet at ' + t('(' + nt(x) + ',\\ ' + nt(y) + ')') + ': ' + t('x=' + nt(x)) + '. Check: ' + t(A(nt(x - z.h)) + '=' + nt(y)) + ' and ' + t('-' + par(x) + sgT(z.d) + '=' + nt(y)) + ' ✓' + vlGraph(1, -z.h, -1, z.d, [[x, y]]), ['Graph the V and the line; read where they meet.'], 'solving graphically: one solution'); }),
        Pt('eA4b', 'ADV', function (r, z) {
          return mcPart(r, 'Why is there only one solution?', [
            { html: 'The left arm of the V, ' + t('y=-x' + sgT(z.h)) + ', has the same slope as the line, so they are parallel and never meet.', right: true },
            { html: 'An absolute value equation always has exactly one solution.', why: 'It can have two, one or none.' },
            { html: 'The line has a negative slope, so it can meet the V only once.', why: 'A line with a negative slope can cross both arms (try ' + t('y=-2x+8') + ' with ' + t('y=|x|') + '). Compare the slopes.' },
            { html: 'The vertex of the V is below the line.', why: 'That only shows they meet at least once. Why not twice?' }],
            'The left arm is ' + t('y=-(x' + sgT(-z.h) + ')=-x' + sgT(z.h)) + ': slope ' + t('-1') + ', the same as the line. Algebra: ' + t('-x' + sgT(z.h) + '=-x' + sgT(z.d)) + ' gives ' + t(nt(z.h) + '=' + nt(z.d)) + ', impossible.', ['Compare the slopes of the two arms with the slope of the line.'], 'why one solution');
        })] },
    { num: 'B5', section: 'B. Applying', parts: [Pt('eB5', 'ADV', function (r) {
      var z = linSpec(r, { as: [2, 3, -2], cs: [1], bs: [1, 2, 3, -1, -2, 4], counts: [2], den: 5, test: function (q) { return toR(q.x1)[1] > 1 && [3, 6, 7, 9].indexOf(toR(q.x1)[1]) >= 0 || toR(q.x2)[1] > 1 && [3, 6, 7, 9].indexOf(toR(q.x2)[1]) >= 0; }, ex: [{ a: 2, b: 1, c: 1, d: 3 }] });
      var S = L(z), e = r.int(1, 6), dd = z.d - e; // |ax + b| − e = cx + dd  ⇔  |ax + b| = cx + d
      var eqT = A(S.inner) + '-' + e + '=' + tx(lin(z.c, dd)), mv = tx(P.neg(lin(z.c, dd)));
      return rootsPart(CP, 'Use the zero method on a graphing calculator to solve ' + t(eqT) + '. Give the solutions to the nearest hundredth (or exactly), then confirm them algebraically.', S.vals, { extr: S.extr, round: true, wrongs: linWrongs(z) },
        'Graph ' + t('Y_1=' + A(S.inner) + '-' + e + (mv.charAt(0) === '-' ? '' : '+') + mv) + ' and use <b>zero</b>: ' + S.vals.map(function (x) { return t('x\\approx ' + x.toFixed(2)); }).join(' and ') + '.<br>Algebra: ' + t(A(S.inner) + '=' + S.rhs) + '.<br>' + linSol(z), HLIN, 'zero method to the hundredth');
    })] },
    { num: 'B6', parts: [Pt('eB6', 'PRG', function (r) {
      var z = pickWhere(function () { return { h: r.int(6, 21), m: r.pick([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]), d: r.pick([5, 6, 7, 8, 9, 10, 12, 15]) }; }, function (z) { return excl(z, [{ h: 14, m: 30, d: 8 }]) && (z.m + z.d < 60 && z.m - z.d >= 0 || r.chance(0.5)); });
      var s = z.h * 60 + z.m, lo = s - z.d, hi = s + z.d, mode = r.pick(['ferry', 'bus', 'train']);
      var ctx = { ferry: 'A ferry is scheduled to arrive at ', bus: 'A bus is scheduled to reach a stop at ', train: 'A train is scheduled to arrive at ' }[mode];
      var fields = [{ label: 'Solutions ' + t('t=') + ' (minutes after midnight)', name: 'solutions', mode: 'math', keys: 'u7sol', vars: ['t'] }, { label: 'Earliest on-time arrival (hh:mm)', name: 'earliest', mode: 'text', wide: true, placeholder: 'hh:mm' }, { label: 'Latest on-time arrival (hh:mm)', name: 'latest', mode: 'text', wide: true, placeholder: 'hh:mm' }];
      return fieldsPart(ctx + clockT(s) + ', which is ' + t(s) + ' minutes after midnight. It is counted as on time if it arrives within ' + t(z.d) + ' minutes of the schedule. Write and solve an absolute value equation for the earliest and latest on-time arrivals ' + t('t') + ', and give them as clock times.', fields,
        [rootsChk(CP, [lo, hi], { v: 't', noNone: true, wrongs: [{ vals: [hi], code: CP + 'one-case', hint: 'It can also be up to ' + t(z.d) + ' minutes <b>early</b>.' }] }), clockChk(lo, hi), clockChk(hi, lo)], ['t=' + lo + ',\\ t=' + hi, clockT(lo), clockT(hi)],
        t(A('t-' + s) + '=' + z.d) + ': ' + t('t=' + lo) + ' or ' + t('t=' + hi) + '; ' + clockT(lo) + ' and ' + clockT(hi),
        t(A('t-' + s) + '=' + z.d) + ': ' + t('t-' + s + '=\\pm ' + z.d) + ', so ' + t('t=' + hi) + ' or ' + t('t=' + lo) + ' minutes after midnight.<br>' + t(lo + '=' + Math.floor(lo / 60) + '\\times 60+' + (lo % 60)) + ': ' + clockT(lo) + '; ' + t(hi + '=' + Math.floor(hi / 60) + '\\times 60+' + (hi % 60)) + ': ' + clockT(hi) + '.',
        ['On time means ' + t(A('t-' + s) + '\\le ' + z.d) + '; the earliest and latest times solve ' + t(A('t-' + s) + '=' + z.d) + '.', 'Divide by 60: the quotient is the hour, the remainder the minutes.'], 'on-time arrivals as clock times', [['t=' + hi, clockT(lo), clockT(hi)], ['t=' + lo + ',\\ t=' + hi, clockT(hi), clockT(lo)]]);
    })] },
    { num: 'B7', parts: [Pt('eB7', 'ADV', function (r) {
      var z = pickWhere(function () { var m = r.pick([[1, 2], [1, 3], [1, 2], [2, 1]]); return { m: m, c: r.int(3, 18) }; }, function (z) { var mv = z.m[0] / z.m[1], x1 = z.c / (1 - mv), x2 = z.c / (1 + mv); return toR(x2)[1] <= 4 && (mv >= 1 || toR(x1)[1] <= 4) && excl({ c: z.c, mv: mv }, [{ c: 9, mv: 0.5 }]); });
      var mv = z.m[0] / z.m[1], mT = mv === 0.5 ? 'half' : mv === 1 / 3 ? 'one third of' : 'twice', x1 = mv < 1 ? z.c / (1 - mv) : null, x2 = z.c / (1 + mv), vals = (x1 != null ? [x2, x1] : [x2]), mTex = mv === 0.5 ? '\\frac{1}{2}x' : mv === 1 / 3 ? '\\frac{1}{3}x' : '2x';
      var wr = []; if (x1 != null) { wr.push({ vals: [x1], code: CP + 'sol-missing', hint: 'She could also be between the start and the cabin: solve the case ' + t('x<' + z.c) + ' too.' }); wr.push({ vals: [x2], code: CP + 'sol-missing', hint: 'She could also be past the cabin: solve the case ' + t('x\\ge ' + z.c) + ' too.' }); }
      else wr.push({ vals: [-z.c, x2], code: CP + 'extr', hint: 'The marker is at least 0 (and ' + t('2x') + ' cannot be negative): ' + t('x=' + (-z.c)) + ' is extraneous.' });
      var kk = 1 / mv, sw = [z.c / (1 + kk)].concat(kk < 1 ? [z.c / (1 - kk)] : []);
      wr.push({ vals: sw, code: CP + 'dist-ratio', hint: 'The distance from the cabin, ' + t(A('x-' + z.c)) + ', is ' + mT + ' the distance from the start, ' + t('x') + '.' });
      wr = wr.filter(function (w) { return !sameSet(w.vals, vals); });
      return rootsPart(CP, 'A hiker is at kilometre marker ' + t('x') + ' on a straight trail that starts at marker 0 (' + t('x\\ge 0') + '). A ranger cabin is at marker ' + t(z.c) + '. The hiker’s distance from the cabin is ' + mT + ' her distance from the start of the trail. Where could she be?', vals, { noNone: true, wrongs: wr },
        t(A('x-' + z.c) + '=' + mTex) + '.<br>' + t('x\\ge ' + z.c) + ': ' + t('x-' + z.c + '=' + mTex) + (x1 != null ? ', ' + t('x=' + nt(x1)) + ' (keep)' : ', ' + t('x=' + (-z.c)) + ' (reject: not ' + t('\\ge ' + z.c) + ')') + '.<br>' + t('x<' + z.c) + ': ' + t(z.c + '-x=' + mTex) + ', ' + t('x=' + nt(x2)) + ' (keep).<br>At marker ' + vals.map(function (x) { return t(nt(x)); }).join(' or ') + '.',
        ['The distance from the cabin is ' + t(A('x-' + z.c)) + '; the distance from the start is ' + t('x') + '.', 'Solve by cases on each side of the cabin.'], 'a hiker on a trail');
    })] },
    { num: 'B8', parts: [Pt('eB8', 'PRG', function (r) {
      var n = r.pick([1, 1, 1, 2, 0]), z = linSpec(r, n === 1 ? { as: [1], cs: [2, 3, -2, 4], counts: [1], ints: true, ex: [{ a: 1, b: -2, c: 3, d: 6 }] } : { as: [2, 3, -2], cs: [1, -1], counts: [n], ints: true }), S = L(z), xs = sortV([z.x1, z.x2]);
      var right = S.vals.length === 2 ? 2 : S.vals.length === 1 ? (has([xs[0]], S.vals[0]) ? 0 : 1) : 3;
      var opts = [{ html: t('x=' + xs[0]) + ' only' }, { html: t('x=' + xs[1]) + ' only' }, { html: t('x=' + xs[0]) + ' or ' + t('x=' + xs[1]) }, { html: 'no solution' }].map(function (o, i) { return { html: o.html, right: i === right, why: i === 2 ? 'Each answer must be checked in the original equation.' : 'Substitute each value into the original equation: does the right side come out negative?' }; });
      return mcPart(r, 'Solving ' + t(A(S.inner) + '=' + S.rhs) + ' by solving both linear equations gives ' + t('x=' + xs[0]) + ' and ' + t('x=' + xs[1]) + '. The solution of the absolute value equation is', opts, chkLine(z, xs[0]) + '<br>' + chkLine(z, xs[1]), HLIN, 'MC: which roots check');
    })] },
    { num: 'B9', parts: [Pt('eB9', 'ADV', function (r) {
      var z = linSpec(r, { as: [2, 3, 4], cs: [1, -1, 2], counts: [2], test: function (q) { var s = q.x1 + q.x2; return s > 0 && s < 10 && Math.abs(s * 100 - Math.round(s * 100)) > 1e-6; }, ex: [{ a: 2, b: 2, c: 1, d: 8 }] }), S = L(z), sum = z.x1 + z.x2;
      var view = Number.isInteger(-z.b / rv(z.a)) && r.chance(0.6) ? 'coef' : 'std', E = linEq(z, view, false);
      return KP.approx('The sum of the solutions of ' + t(E.eq) + ', to the nearest hundredth, is ____.', sum, 2, { nr: true, diag: function (v) { return Math.abs(v - Math.round(Math.max(z.x1, z.x2) * 100) / 100) < 1e-9 ? { code: CP + 'sol-missing', hint: 'There are two solutions: add them.' } : null; } }, linSol(view === 'coef' ? Object.assign({}, z) : z, E.iso) + '<br>Sum ' + t('=' + nt(sum) + '\\approx ' + sum.toFixed(2)) + '.', HLIN, 'NR: sum of the solutions to the hundredth');
    })] },
    { num: 'C1', section: 'C. Stretch', shared: function (r) { return pickWhere(function () { return { a: r.pick([1, 1, 2]), b: nz(r, 1, 6), c: r.pick([2, 3, -2, 1]), d: nz(r, 1, 8) }; }, function (z) { if (z.a === Math.abs(z.c)) return false; var x1 = (z.d - z.b) / (z.a - z.c), x2 = (-z.d - z.b) / (z.a + z.c), f1 = toR(x1), f2 = toR(x2); return f1 && f2 && f1[1] <= 5 && f2[1] <= 5 && Math.abs(x1 - x2) > 1e-9 && excl(z, [{ a: 1, b: 1, c: 2, d: -5 }]); }); },
      stem: function (z) { return 'Consider ' + t(A(tx(lin(z.a, z.b))) + '=' + A(tx(lin(z.c, z.d)))) + '. (Two numbers have the same absolute value when they are equal or opposite.)'; },
      parts: [
        Pt('eC1a', 'MAS', function (r, z) { var x1 = (z.d - z.b) / (z.a - z.c), x2 = (-z.d - z.b) / (z.a + z.c), vals = sortV([x1, x2]), Lt = tx(lin(z.a, z.b)), Rt = tx(lin(z.c, z.d));
          var xn = (z.d - z.b) / (-z.a - z.c);
          return rootsPart(CP, 'Solve the equation.', vals, { wrongs: [{ vals: [x1], code: CP + 'one-case', hint: 'There is a second case: ' + t(Lt + '=-(' + Rt + ')') + '.' }].concat(has(vals, xn) ? [] : [{ vals: [x1, xn], code: CP + 'neg-one', hint: 'Negate the <b>whole</b> right side: ' + t('-(' + Rt + ')') + '.' }]) },
            t(Lt + '=' + Rt) + ' gives ' + t('x=' + nt(x1)) + '; ' + t(Lt + '=-(' + Rt + ')') + ' gives ' + t('x=' + nt(x2)) + '.<br>Check: ' + t(A(nt(z.a * x1 + z.b)) + '=' + A(nt(z.c * x1 + z.d))) + ' ✓; ' + t(A(nt(z.a * x2 + z.b)) + '=' + A(nt(z.c * x2 + z.d))) + ' ✓', ['Equal or opposite: ' + t('A=B') + ' or ' + t('A=-B') + '.'], 'solving |A| = |B|'); }),
        Pt('eC1b', 'MAS', function (r) {
          return mcPart(r, 'Why is no check needed for extraneous solutions here?', [
            { html: 'Both sides are absolute values, so neither side can be negative: every solution of ' + t('A=\\pm B') + ' works.', right: true },
            { html: 'Linear equations never have extraneous solutions.', why: 'Lesson 4 is full of extraneous roots from linear cases (e.g. ' + t('|x|=x-2') + '). What is different here?' },
            { html: 'The two solutions are always opposites of each other.', why: 'They are not opposites in general. Think about the sign of each side.' },
            { html: 'There is always exactly one solution, so there is nothing to reject.', why: 'This equation has two solutions.' }],
            'An extraneous root makes the side without bars negative. Here both sides are absolute values, so neither can be negative: every solution of ' + t('A=B') + ' or ' + t('A=-B') + ' makes ' + t('|A|=|B|') + ' true.', ['Where do extraneous roots come from in Lesson 4?'], 'why no check is needed');
        })] },
    { num: 'C2', parts: [Pt('eC2', 'MAS', function (r) {
      var h = pickWhere(function () { return r.int(-6, 6); }, function (h) { return h !== 0 || r.chance(0.15); }), inn = h === 0 ? 'x' : tx(lin(1, -h)), bnd = -h;
      var fields = [{ label: 'No solution when', name: 'no solution', mode: 'math', keys: 'set', vars: ['b'] }, { label: 'Exactly one solution when', name: 'one solution', mode: 'math', keys: 'set', vars: ['b'] }, { label: 'Infinitely many when ' + t('b='), name: 'infinitely many', mode: 'math', keys: 'set', vars: ['b'] }];
      var Tn = setT('b<' + bnd, 'b'), T1 = setT('b>' + bnd, 'b');
      return fieldsPart('For which values of ' + t('b') + ' does ' + t(A(inn) + '=x+b') + ' have no solution, exactly one solution, or infinitely many solutions? (Sketch ' + t('y=' + A(inn)) + ' and the line ' + t('y=x+b') + '.)', fields,
        [K.set(Tn, { v: 'b', tag: false, wrong: [{ is: T1, code: CP + 'k-swap', hint: 'For a large ' + t('b') + ' the line is high up and crosses the left arm.' }, { is: setT('b\\le ' + bnd, 'b'), code: CP + 'k-end', hint: 'When ' + t('b=' + bnd) + ' the line lies on the right arm.' }] }), K.set(T1, { v: 'b', tag: false, wrong: [{ is: Tn, code: CP + 'k-swap', hint: 'For a small ' + t('b') + ' the line is below the V.' }, { is: setT('b\\ge ' + bnd, 'b'), code: CP + 'k-end', hint: 'When ' + t('b=' + bnd) + ' the line lies on the right arm: infinitely many.' }] }), valChk(CP, bnd, [{ v: h, code: 'sign', hint: 'The line ' + t('y=x+b') + ' lies on the right arm ' + t('y=' + inn) + ' when ' + t('b=' + bnd) + '.' }], { exact: false })],
        [Tn, T1, nt(bnd)], 'none: ' + t('b<' + bnd) + '; one: ' + t('b>' + bnd) + '; infinitely many: ' + t('b=' + bnd),
        t('x\\ge ' + h) + ': ' + t(inn + '=x+b') + ' needs ' + t('b=' + bnd) + ', and then every ' + t('x\\ge ' + h) + ' works (the line lies on the right arm).<br>' + t('x<' + h) + ': ' + t(h + '-x=x+b') + ' gives ' + t('x=\\frac{' + h + '-b}{2}') + ', which is less than ' + t(h) + ' only if ' + t('b>' + bnd) + '.<br>' + t('b>' + bnd) + ': one solution; ' + t('b=' + bnd) + ': infinitely many; ' + t('b<' + bnd) + ': none (the line is below the V).',
        ['The line ' + t('y=x+b') + ' is parallel to the right arm of the V.', 'Solve by cases and see what each case needs.'], 'parameter b: none, one or infinitely many', [[T1, Tn, nt(bnd)], [Tn, setT('b\\ge ' + bnd, 'b'), nt(bnd)]]);
    })] },
    { num: 'C3', parts: [Pt('eC3', 'MAS', function (r) {
      var z = pickWhere(function () { var m = r.int(-8, 4), w = r.pick([1, 3, 5, 7, 9]); return { m: m, n: m + w }; }, function (z) { return excl(z, [{ m: -1, n: 4 }]) && z.m + z.n !== 0; });
      var b = -(z.m + z.n), c = z.n - z.m;
      var fields = [{ label: t('b='), name: 'b', mode: 'math', keys: 'fraction' }, { label: t('c='), name: 'c', mode: 'math', keys: 'fraction' }];
      var eqT = A('2x' + sgT(b)) + '=' + c;
      return fieldsPart('Write an absolute value equation of the form ' + t('|2x+b|=c') + ' whose solutions are ' + t(z.m) + ' and ' + t(z.n) + ': give ' + t('b') + ' and ' + t('c') + '.', fields,
        [valChk(CP, b, [{ v: -b, code: CP + 'wd-a', hint: 'Check the sign of ' + t('b') + ': the midpoint ' + t(nt((z.m + z.n) / 2)) + ' must make ' + t('2x+b=0') + '.' }, { v: b / 2, code: CP + 'fr-half', hint: 'Multiply ' + t(A('x-' + par((z.m + z.n) / 2)) + '=' + nt(c / 2)) + ' by 2.' }], { exact: false }), valChk(CP, c, [{ v: c / 2, code: CP + 'fr-half', hint: 'Multiply both sides by 2: the bars contain ' + t('2x') + '.' }, { v: 2 * c, code: CP + 'wd-d', hint: 'Half the distance between the solutions is ' + t(nt(c / 2)) + '; then multiply by 2.' }], { exact: false })],
        [String(b), String(c)], t(eqT), 'Midpoint ' + t(nt((z.m + z.n) / 2)) + ', half the distance ' + t(nt(c / 2)) + ': ' + t(A('x' + sgT(-(z.m + z.n) / 2)) + '=' + nt(c / 2)) + '. Multiply by 2: ' + t(eqT) + '.<br>Check: ' + t(A(2 * z.m + b) + '=' + c) + ' ✓, ' + t(A(2 * z.n + b) + '=' + c) + ' ✓',
        ['First write ' + t('|x-a|=d') + ' (midpoint, half the distance).', 'Multiply both sides by 2: ' + t('2|x-a|=|2x-2a|') + '.'], '|2x + b| = c from its solutions', [[String(-b), String(c)], [String(b), String(c / 2)]]);
    })] }
  ];

  HW.defineLesson({ id: LID, unit: 7, num: '4', title: 'Solving Absolute Value Equations (Linear)', outcome: OUT, calc: true, questions: QUESTIONS, extra: EXTRA });
})(window);
