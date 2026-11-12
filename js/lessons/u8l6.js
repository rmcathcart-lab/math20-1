/* Math 20-1 · Unit 8 · Lesson 6 — Quadratic Inequalities in One Variable: Roots and Test Points (outcome RF8 on every part)
 * Assignment 6 (u8_l06.tex, Questions 1–17) and the Lesson 6 Extra Practice (u8_ep06.tex, A1–A3, B1–B6, C1–C3).
 * Every part is a generator: the booklet question's idea, form and difficulty with new numbers (the lesson's example
 * inequalities and the booklet questions' own are left out). Calculator allowed; answers exact unless a question asks to
 * round.
 *
 * Answers: solution sets typed in set notation {x | x < −2 or x > 3, x ∈ ℝ}, as a plain inequality "x < −2 or x > 3", or
 * in interval notation (−∞, −2) ∪ (3, ∞), read by HW.sets (the assessment kit's setPart), with "x ≠ 4", "x = 4", all real
 * numbers {x | x ∈ ℝ} and "no solution"; exact endpoints with surds (3 − √7 < x < 3 + √7) by HW.u8k56.exactSetPart;
 * calculator answers rounded to the nearest tenth (a "round" nudge for unrounded values); roots and values of k as
 * "x = −1, x = 5"; consecutive integers as a list (or an inequality in n). Worked solutions use roots and a test point in
 * each interval and show the solution on a number line. "Show on a number line" → the number line is in the worked
 * solution (students don't draw); "write the set shown on the number line" → the number line is drawn in the question;
 * "find and correct the error" → the student's work is shown and the corrected solution typed (the student's answer is
 * recognised and explained).
 * Recognised mistakes (codes u8l6-…): roots included/excluded wrong, between instead of outside, a sign not reversed after
 * multiplying by a negative, roots with the wrong signs, "and" instead of "or", only one interval, taking the square root
 * (losing the negative side), only the both-positive case, perfect squares (x ≠ h / x = h / all / none), the restriction
 * of a context ignored, the discriminant-zero values instead of an inequality, the sign of b.
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: 10 (m in two coefficients), 11b (consecutive integers), Extra C1–C3.
 * Uses HW.u8k56 (js/lessons/u8l5.js, which loads first) and, inside generators, HW.u8assess (js/lessons/u8test.js). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, KP = K.P, P = HW.poly, ex = HW.ex, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, U = HW.u8k56;
  if (!U) throw new Error('js/lessons/u8l6.js needs js/lessons/u8l5.js (HW.u8k56)');
  var AK = U.AK, pickWhere = U.pickWhere, nz = U.nz, R = U.R, rv = U.rv, fr = U.fr, vt = U.vt, dt = U.dt, M = U.M, quad = U.quad, lin = U.lin, tx = U.tx, br = U.br, par = U.par, at = U.at,
    coefT = U.coefT, near = U.near, ptT = U.ptT, sgn = U.sgn, OPS = U.OPS, FLIP = U.FLIP, TOG = U.TOG, strictOp = U.strictOp, upOp = U.upOp, holds = U.holds, fig = U.fig, facT = U.facT,
    fin = U.fin, mcPart = U.mcPart, sIv = U.sIv, SET = U.SET, quadSet = U.quadSet, setTex = U.setTex, nlSvg = U.nlSvg, testLine = U.testLine, regSvg = U.regSvg, winFor = U.winFor;
  var INF = Infinity, CP = 'u8l6-', LID = 'u8l6';
  var FRESH = U.exclude([[1, -1, -12], [-1, 2, 8], [1, -4, -3], [2, -5, -4], [1, -3, -10], [2, 5, -3], [-1, 2, 15], [1, 4, -5], [1, -7, 6], [1, -8, 16], [1, 2, 5], [1, 0, -36], [1, 4, -21],
    [1, -4, -5], [-2, 4, 6], [1, -7, 12], [1, 2, -15], [1, -9, 0], [4, 0, -25], [2, 1, -6], [-1, 3, 10], [1, -5, -14], [3, -8, 4], [1, 2, -8], [6, -7, -3], [1, -6, 2], [-1, 4, 1], [2, 3, -7],
    [1, 6, 9], [1, -3, 5], [-1, 4, -7], [4, -12, 9], [1, 0, -9], [-1, 1, 6], [1, -1, -6], [1, -3, -28], [1, 7, -18], [1, 3, -40], [1, 1, -30], [1, 0, -25], [1, 0, 4], [1, 0, -4],
    [1, -1, -20], [1, 8, 12], [3, -12, 0], [5, 13, -6], [1, -10, 25], [1, 1, 3], [1, 2, 1], [3, 5, -2], [1, -6, 8], [1, 3, -5], [-1, 6, -5], [1, -2, -24], [1, -6, 1], [2, -5, -3], [1, 1, -6]]);
  function anyOp(r) { return r.pick(['lt', 'le', 'gt', 'ge']); }
  function plainSet(parts, v) { v = v || 'x'; var s = setTex(parts, v); var m = /^\\\{[a-z]\\mid (.*),\\ [a-z]\\in\\mathbb\{R\}\\\}$/.exec(s); return m ? m[1] : s; }
  var SETHINT = 'Type the solution, e.g. ' + t('\\{x\\mid x<-2\\text{ or }x>3,\\ x\\in\\mathbb{R}\\}') + ' or ' + t('-2\\le x\\le 5') + '.';
  var NOSOL = ' (If no real number works, type “no solution”; for every real number, type ' + t('\\{x\\mid x\\in\\mathbb{R}\\}') + '.)';
  function hintsSolve(extra) { return [extra || 'Move every term to one side (one side ' + t('0') + ') and factor to find the roots.', 'Test one value in each interval in the inequality. Include the roots for ' + t('\\le') + ', ' + t('\\ge') + '; leave them out for ' + t('<') + ', ' + t('>') + '.']; }

  /* solve E op 0 (E = A(x − r1)(x − r2) after rearranging). o: { show, E, A, r1, r2, op, pre, facS, rev, wrongs, how, v } */
  function solveP(o) {
    var v = o.v || 'x', T = quadSet(o.A, o.r1, o.r2, o.op), pos = o.A > 0 ? upOp(o.op) : !upOp(o.op);
    var sol = (o.pre || '') + 'Roots: ' + t(o.facS + '=0') + ', so ' + t(v + '=' + vt(o.r1)) + ' or ' + t(v + '=' + vt(o.r2)) + '.<br>' + testLine(o.E, o.r1, o.r2, o.op, v) + '<br>' +
      'The solution is ' + (pos ? 'outside' : 'between') + ' the roots, ' + (strictOp(o.op) ? 'not including them' : 'including them') + ': ' + t(setTex(T, v)) + '.' + fig(nlSvg(T));
    var p = AK().setPart(CP, o.prompt || ('Solve ' + t(o.show) + (o.how || '') + '. Write the solution in set notation.'), T, { v: v, wrongs: o.wrongs, rev: o.rev, sideHint: 'Right roots, but test a value in each interval: ' + testLine(o.E, o.r1, o.r2, o.op, v).replace(/^Test /, '') }, sol, o.hints || hintsSolve(o.hint1), o.text || 'solve a quadratic inequality');
    return fin(p);
  }
  /* integer roots a < b of (x − a)(x − b) */
  function intRoots(r, o) {
    o = o || {};
    return pickWhere(function () { return { a: r.int(o.lo || -8, o.hi || 6), b: r.int(o.lo || -7, o.hi2 || 9) }; }, function (z) { return z.a < z.b && (o.zero || (z.a !== 0 && z.b !== 0)) && Math.abs(z.a * z.b) <= (o.prod || 45) && (!o.test || o.test(z)) && FRESH(P.mul(lin(1, -z.a), lin(1, -z.b))); });
  }
  function monic(r, dir, o) {
    o = o || {};
    var z = intRoots(r, o), E = P.mul(lin(1, -z.a), lin(1, -z.b)), op = dir === 'between' ? r.pick(['lt', 'le']) : dir === 'outside' ? r.pick(['gt', 'ge']) : anyOp(r);
    if (o.op) op = o.op;
    return solveP({ show: tx(E) + OPS[op] + '0', E: E, A: 1, r1: z.a, r2: z.b, op: op, facS: facT(1, z.a, z.b), how: o.how });
  }
  function gcfQ(r, kList) {
    var s = pickWhere(function () { return { k: r.pick(kList), n: nz(r, 2, 9) }; }, function (z) { return FRESH(P.scale(quad(1, -z.n, 0), z.k)); });
    var E = P.scale(quad(1, -s.n, 0), s.k), op = anyOp(r), r1 = Math.min(0, s.n), r2 = Math.max(0, s.n);
    return solveP({ show: tx(E) + OPS[op] + '0', E: E, A: s.k, r1: r1, r2: r2, op: op, facS: coefT(s.k) + 'x' + br(lin(1, -s.n)), how: ' using roots and test points' });
  }
  function dosQ(r) {
    var s = pickWhere(function () { return { m: r.pick([2, 3, 4, 5, 1]), n: r.int(1, 9) }; }, function (z) { return ex.gcd(z.m, z.n) === 1 && FRESH(quad(z.m * z.m, 0, -z.n * z.n)) && !(z.m === 1 && z.n < 3); });
    var E = quad(s.m * s.m, 0, -s.n * s.n), op = anyOp(r), a = s.n / s.m, pos = upOp(op), inc = !strictOp(op);
    return solveP({ show: tx(E) + OPS[op] + '0', E: E, A: s.m * s.m, r1: -a, r2: a, op: op, facS: s.m === 1 ? '(x-' + s.n + ')(x+' + s.n + ')' : '(' + s.m + 'x-' + s.n + ')(' + s.m + 'x+' + s.n + ')', how: ' using roots and test points',
      wrongs: [{ parts: pos ? SET.above(a, inc) : SET.below(a, inc), code: CP + 'ineq-sqrt', hint: 'Taking the square root loses the negative side: find both roots, ' + t('\\pm ' + vt(a)) + ', and test.' }] });
  }
  /* (q x − p)(x − s)·k with a fractional root p/q */
  function fracRoot(r, qList, o) {
    o = o || {};
    return pickWhere(function () { return { q: r.pick(qList), p: nz(r, 1, 9), s: r.int(-6, 6) }; }, function (z) { var E = P.mul(lin(z.q, -z.p), lin(1, -z.s)); return z.p % z.q !== 0 && ex.gcd(Math.abs(z.p), z.q) === 1 && !near(z.p / z.q, z.s) && z.s !== 0 && Math.abs(z.p * z.s) <= 30 && Math.abs(rv(P.coef(E, { x: 1 }))) > 0 && FRESH(E) && (!o.test || o.test(z, E)); });
  }
  function nonmonicQ(r, op, o) {
    o = o || {};
    var z = fracRoot(r, o.qList || [2, 3, 5]), E = P.mul(lin(z.q, -z.p), lin(1, -z.s)), rs = [z.p / z.q, z.s].sort(function (a, b) { return a - b; });
    op = op || anyOp(r);
    return solveP({ show: tx(E) + OPS[op] + '0', E: E, A: z.q, r1: rs[0], r2: rs[1], op: op, facS: br(lin(z.q, -z.p)) + br(lin(1, -z.s)), how: ' using roots and test points' });
  }
  function negLeadQ(r, op) {
    var z = intRoots(r, { test: function (q) { return q.a < 0 && q.b > 0; } }), E = P.neg(P.mul(lin(1, -z.a), lin(1, -z.b))), C = U.cof(E);
    op = op || anyOp(r);
    var show = (r.chance(0.4) ? vt(C[2]) + sgn(C[1]).replace(/^\+/, '+').replace(/1x$/, 'x') + 'x-x^{2}' : tx(E)) + OPS[op] + '0';
    show = show.replace(/([+-])1x/, '$1x');
    return solveP({ show: show, E: E, A: -1, r1: z.a, r2: z.b, op: op, facS: '-' + facT(1, z.a, z.b), rev: true, how: ' using roots and test points',
      pre: 'You may multiply by ' + t('-1') + ' and reverse the sign (' + t(tx(P.neg(E)) + OPS[FLIP[op]] + '0') + '), but the test points can check the original.<br>' });
  }

  /* rearrange first (Q5, EP B1) */
  function rearrQ(r, kind) {
    var op = anyOp(r), E, show, A = 1, rs, facS, z;
    if (kind === 'move') { // x² op bx + c
      z = intRoots(r, { test: function (q) { return q.a + q.b !== 0; } }); E = P.mul(lin(1, -z.a), lin(1, -z.b));
      show = 'x^{2}' + OPS[op] + tx(lin(z.a + z.b, -z.a * z.b)); rs = [z.a, z.b]; facS = facT(1, z.a, z.b);
    } else if (kind === 'const') { // a x² + c op b x  (rational root)
      z = fracRoot(r, [2, 3], { test: function (q, EE) { return Math.abs(rv(P.constant(EE))) > 0; } }); E = P.mul(lin(z.q, -z.p), lin(1, -z.s)); A = z.q;
      var C = U.cof(E); show = tx(quad(C[0], 0, C[2])) + OPS[op] + tx(M(-C[1], 'x', 1)); rs = [z.p / z.q, z.s]; facS = br(lin(z.q, -z.p)) + br(lin(1, -z.s));
    } else if (kind === 'prod') { // (x + u)(x + v) op w
      z = pickWhere(function () { var q = intRoots(r, {}); q.u = nz(r, 1, 6); q.v = -(q.a + q.b) - q.u; q.w = q.u * q.v - q.a * q.b; return q; }, function (q) { return q.v !== 0 && q.w !== 0 && Math.abs(q.w) <= 20 && q.u !== q.v; });
      E = P.mul(lin(1, -z.a), lin(1, -z.b)); show = br(lin(1, z.u)) + br(lin(1, z.v)) + OPS[op] + vt(z.w); rs = [z.a, z.b]; facS = facT(1, z.a, z.b);
      return solveP({ show: show, E: E, A: 1, r1: rs[0], r2: rs[1], op: op, facS: facS, pre: 'Expand and move ' + t(vt(z.w)) + ': ' + t(tx(P.mul(lin(1, z.u), lin(1, z.v))) + sgn(-z.w) + OPS[op] + '0') + ', so ' + t(tx(E) + OPS[op] + '0') + '.<br>', hint1: 'Expand the product first, then move every term to one side. (Do not set each factor equal to ' + t(vt(z.w)) + '.)' });
    } else if (kind === 'two') { // a x² op b x + c, both roots fractions
      z = pickWhere(function () { return { q1: r.pick([2, 3]), q2: r.pick([2, 3, 5]), p1: nz(r, 1, 5), p2: nz(r, 1, 7) }; }, function (q) { var EE = P.mul(lin(q.q1, -q.p1), lin(q.q2, -q.p2)); return q.p1 % q.q1 !== 0 && q.p2 % q.q2 !== 0 && ex.gcd(Math.abs(q.p1), q.q1) === 1 && ex.gcd(Math.abs(q.p2), q.q2) === 1 && !near(q.p1 / q.q1, q.p2 / q.q2) && q.q1 * q.q2 <= 10 && Math.abs(q.p1 * q.p2) <= 20 && Math.abs(rv(P.coef(EE, { x: 1 }))) > 0 && FRESH(EE); });
      E = P.mul(lin(z.q1, -z.p1), lin(z.q2, -z.p2)); A = z.q1 * z.q2; var C2 = U.cof(E);
      show = tx(M(C2[0], 'x', 2)) + OPS[op] + tx(lin(-C2[1], -C2[2])); rs = [z.p1 / z.q1, z.p2 / z.q2]; facS = br(lin(z.q1, -z.p1)) + br(lin(z.q2, -z.p2));
    } else if (kind === 'constfirst') { // a x² op c − b x
      z = fracRoot(r, [2, 3], { test: function (q, EE) { return Math.abs(rv(P.constant(EE))) > 0; } }); E = P.mul(lin(z.q, -z.p), lin(1, -z.s)); A = z.q;
      var C3 = U.cof(E); show = tx(M(C3[0], 'x', 2)) + OPS[op] + P.seq([P.num(-C3[2]), M(-C3[1], 'x', 1)]); rs = [z.p / z.q, z.s]; facS = br(lin(z.q, -z.p)) + br(lin(1, -z.s));
    } else { // x(x − b) op c
      z = intRoots(r, { test: function (q) { return q.a + q.b !== 0; } }); E = P.mul(lin(1, -z.a), lin(1, -z.b));
      show = 'x' + br(lin(1, -(z.a + z.b))) + OPS[op] + vt(-z.a * z.b); rs = [z.a, z.b]; facS = facT(1, z.a, z.b);
    }
    rs.sort(function (a, b) { return a - b; });
    return solveP({ show: show, E: E, A: A, r1: rs[0], r2: rs[1], op: op, facS: facS, pre: 'Rearrange so one side is ' + t('0') + ': ' + t(tx(E) + OPS[op] + '0') + '.<br>', hint1: 'Move every term to one side so the other side is ' + t('0') + ', then factor.' });
  }

  /* calculator (Q6, EP B2): a(x − h)² − n form with irrational roots h ± √n, or b odd: (−b ± √D)/2 */
  function surdT(h, m, d, sgnc) { // h + sgnc·m√d
    var rad = (m === 1 ? '' : m) + '\\sqrt{' + d + '}';
    return (h ? vt(h) : (sgnc < 0 ? '' : '')) + (sgnc < 0 ? '-' : h ? '+' : '') + rad;
  }
  function sqf(N) { var m = 1, d = N; for (var k = 2; k * k <= d; k++) while (d % (k * k) === 0) { d /= k * k; m *= k; } return { m: m, d: d }; }
  function calcShared(r, kind) {
    return pickWhere(function () { return { h: r.int(-4, 4), n: r.pick([2, 3, 5, 6, 7, 10, 11, 13]), op: anyOp(r), a: kind === 'neg' ? -1 : 1 }; }, function (z) { var E = P.scale(P.sub(P.pow(lin(1, -z.h), 2), P.num(z.n)), z.a); return FRESH(E) && Math.abs(rv(P.constant(E))) <= 15 && !(z.h === 3 && z.n === 7) && !(z.h === 2 && z.n === 5) && !(z.h === 2 && z.n === 7); });
  }
  function calcRound(r, s, A, show, E, pre) {
    var r1 = s.h - Math.sqrt(s.n), r2 = s.h + Math.sqrt(s.n), rd = function (x) { return K.roundTo(x, 1).toFixed(1); }, T = quadSet(A, K.roundTo(r1, 1), K.roundTo(r2, 1), s.op), pos = A > 0 ? upOp(s.op) : !upOp(s.op);
    var f = function (x) { return at(E, x); }, wn = winFor(f, s.h, {});
    var svg = regSvg({ x: wn.x, y: wn.y, max: 220, curves: [{ f: f }], points: [{ x: r1, y: 0 }, { x: r2, y: 0 }], aria: 'graph of Y1' });
    var sol = (pre || '') + t('Y_1=' + tx(E).replace(/x/g, 'X')) + '; 2nd CALC <b>zero</b>: ' + t('x\\approx ' + rd(r1)) + ' and ' + t('x\\approx ' + rd(r2)) + '. The parabola opens ' + (A > 0 ? 'up' : 'down') + '; the solution is where it is ' + (upOp(s.op) ? 'above' : 'below') + ' the ' + t('x') + '-axis: ' + (pos ? 'outside' : 'between') + ' the zeros.<br>' + t(setTex(T, 'x', function (x) { return x.toFixed(1); })) + '.' + fig(svg);
    return fin(U.roundSetPart(CP, 'Solve ' + t(show) + ' with a graphing calculator, to the nearest tenth. Write the solution in set notation.', A, r1, r2, s.op, {}, sol,
      ['Move every term to one side and graph ' + t('Y_1') + ' = that side. Use 2nd CALC <b>zero</b> for each ' + t('x') + '-intercept.', 'Read where the graph is above (' + t('>0') + ') or below (' + t('<0') + ') the ' + t('x') + '-axis. Round to one decimal place.'], 'solve with a calculator'));
  }
  function exactPart(prompt, T, keyTex, sol, hints, text) { return fin(U.exactSetPart(CP, prompt, T, keyTex, {}, sol, hints, text)); }

  /* one root or none (Q7, EP A3) */
  function specialP(r, kind, op, s) {
    var E, show, T, sol, wr = [];
    if (kind === 'sq' || kind === 'sqshow') { // (m x − n)²
      var h = s.n / s.m, base = br(lin(s.m, -s.n));
      E = P.pow(lin(s.m, -s.n), 2); show = (kind === 'sqshow' ? base + '^{2}' : tx(E)) + OPS[op] + '0'; T = quadSet(1, h, h, op);
      sol = (kind === 'sqshow' ? '' : t(tx(E) + '=' + base + '^{2}') + '. ') + 'A square is never negative, and it is ' + t('0') + ' only at ' + t('x=' + vt(h)) + '.<br>' + (T.length ? t(setTex(T)) + '.' : '<b>No solution</b> (a square is never negative).');
      [SET.ne(h), SET.pt(h), SET.all(), SET.none()].forEach(function (w) { wr.push({ parts: w, code: CP + 'ineq-sq', hint: 'Think about the square ' + t(base + '^{2}') + ': it is never negative, and it is ' + t('0') + ' only at ' + t('x=' + vt(h)) + '. Which values make the inequality true?' }); });
    } else { // no real roots: a x² + b x + c with b² − 4ac < 0
      E = quad(s.a, s.b, s.c); show = tx(E) + OPS[op] + '0'; T = (s.a > 0 ? upOp(op) : !upOp(op)) ? SET.all() : SET.none();
      sol = t('b^{2}-4ac=' + par(s.b) + '^{2}-4(' + s.a + ')' + par(s.c) + '=' + (s.b * s.b - 4 * s.a * s.c)) + ' < 0: no real roots, so ' + t(tx(E)) + ' has one sign for every ' + t('x') + '. Test ' + t('x=0') + ': ' + t(vt(s.c) + OPS[op] + '0') + ' is ' + (holds(s.c, op) ? 'true' : 'false') + '.<br>' + (T.length ? 'All real numbers: ' + t(setTex(T)) + '.' : '<b>No solution</b>.');
    }
    return fin(AK().setPart(CP, 'Solve ' + t(show) + '.' + NOSOL, T, { wrongs: wr }, sol, ['Find the roots: ' + (kind === 'none' ? 'check the discriminant first.' : 'this one is a perfect square.'), 'With one root or none, the expression has the same sign everywhere (except ' + t('0') + ' at a double root): one test value decides.'], 'one or no roots'));
  }
  function sqShared(r, mList) { return pickWhere(function () { return { m: r.pick(mList || [1]), n: nz(r, 1, 7) }; }, function (z) { return ex.gcd(z.m, Math.abs(z.n)) === 1 && FRESH(P.pow(lin(z.m, -z.n), 2)); }); }
  function noRoot(r, aList) { return pickWhere(function () { return { a: r.pick(aList), b: r.int(-6, 6), c: r.int(-9, 9) }; }, function (z) { return z.b * z.b - 4 * z.a * z.c < 0 && FRESH(quad(z.a, z.b, z.c)); }); }

  /* the graph of y = E (Q1, Q2, EP A1) */
  function graphStem(E, extra) {
    var f = function (x) { return at(E, x); }, C = U.cof(E), h = -C[1] / (2 * C[0]), wn = winFor(f, h, {}), rts = [];
    var D = C[1] * C[1] - 4 * C[0] * C[2]; if (D > 0) rts = [(-C[1] - Math.sqrt(D)) / (2 * C[0]), (-C[1] + Math.sqrt(D)) / (2 * C[0])];
    return regSvg({ x: wn.x, y: wn.y, max: 240, curves: [{ f: f }].concat(extra || []), points: rts.map(function (x) { return { x: x, y: 0 }; }), aria: 'graph of the parabola' });
  }
  function fromGraph(s, op, o) {
    o = o || {};
    var T = quadSet(s.A, s.r1, s.r2, op), pos = upOp(op);
    var sol = t(tx(s.E) + OPS[op] + '0') + ' where the graph is ' + (pos ? 'above' : 'below') + ' the ' + t('x') + '-axis' + (strictOp(op) ? '' : ' (or on it)') + ': ' + (s.A > 0 ? (pos ? 'outside' : 'between') : (pos ? 'between' : 'outside')) + ' the ' + t('x') + '-intercepts ' + t(vt(s.r1)) + ' and ' + t(vt(s.r2)) + '.<br>' + t(setTex(T)) + '.' + fig(nlSvg(T));
    return fin(AK().setPart(CP, 'Use the graph to solve ' + t(tx(s.E) + OPS[op] + '0') + '. Write the solution in set notation.', T, { sideHint: t('>0') + ' means the graph is <b>above</b> the ' + t('x') + '-axis, ' + t('<0') + ' below it. Read those ' + t('x') + '-values.' }, sol,
      [t(tx(s.E) + OPS[op] + '0') + ' asks where the graph is ' + (pos ? 'above' : 'below') + ' the ' + t('x') + '-axis.', 'The ' + t('x') + '-intercepts are the endpoints; ' + (strictOp(op) ? 'they are not included.' : 'they are included.')], 'a quadratic inequality from a graph'));
  }
  function graphShared(r, aList) {
    var z = pickWhere(function () { var a = r.pick(aList), r1 = r.int(-5, 3), w = r.int(2, 7); return { a: a, r1: r1, r2: r1 + w }; }, function (q) { var E = P.scale(P.mul(lin(1, -q.r1), lin(1, -q.r2)), q.a), C = U.cof(E); return q.r2 <= 6 && Math.abs(C[2]) <= 12 && Math.abs(q.a * (q.r2 - q.r1) * (q.r2 - q.r1) / 4) <= 12 && FRESH(E); });
    z.A = z.a; z.E = P.scale(P.mul(lin(1, -z.r1), lin(1, -z.r2)), z.a); return z;
  }

  /* the values of k (Q9, EP B4) */
  function kShared(r, aList, cList, excl) {
    return pickWhere(function () { return { a: r.pick(aList), c: r.pick(cList) }; }, function (z) { var x = 4 * z.a * z.c, sr = Math.round(Math.sqrt(x)); return sr * sr === x && !excl.some(function (e) { return e[0] === z.a && e[1] === z.c; }); });
  }
  function kPart(r, s, two) {
    var S = Math.sqrt(4 * s.a * s.c), eqT = tx(M(s.a, 'x', 2)) + '+kx+' + s.c + '=0', T = two ? SET.outside(-S, S, false) : SET.between(-S, S, false);
    var sol = (two ? 'Two distinct real roots: ' + t('b^{2}-4ac>0') : 'No real roots: ' + t('b^{2}-4ac<0')) + ': ' + t('k^{2}-4(' + s.a + ')(' + s.c + ')' + (two ? '>' : '<') + '0') + ', so ' + t('k^{2}-' + S * S + (two ? '>' : '<') + '0') + '.<br>Roots ' + t('k=\\pm ' + S) + '; test ' + t('k=0') + ': ' + t('-' + S * S + (two ? '>' : '<') + '0') + ' is ' + (two ? 'false' : 'true') + ', so ' + (two ? 'outside' : 'between') + '.<br>' + t(setTex(T, 'k')) + '.';
    return fin(AK().setPart(CP, 'For what values of ' + t('k') + ' does ' + t(eqT) + ' have ' + (two ? '<b>two distinct real roots</b>' : '<b>no real roots</b>') + '?', T, { v: 'k', wrongs: [{ parts: SET.pt(-S).concat(SET.pt(S)), code: CP + 'k-tangent', hint: 'Those values make the discriminant ' + t('0') + ': <b>one</b> (double) root. Write the inequality the question asks for.' }] }, sol,
      ['Write the discriminant ' + t('b^{2}-4ac') + ' in terms of ' + t('k') + '.', (two ? 'Two distinct real roots: ' + t('b^{2}-4ac>0') : 'No real roots: ' + t('b^{2}-4ac<0')) + '. Solve that inequality in ' + t('k') + '.'], 'values of k for real roots'));
  }

  /* a number line in the question (Q3, Q12) */
  function nlFig(T) { return fig(nlSvg(T)); }

  /* ---------------- the assignment ---------------- */
  var QUESTIONS = [
    { num: '1', shared: function (r) { return graphShared(r, [1]); }, stem: function (s) { return 'The graph of ' + t('y=' + tx(s.E)) + ' is shown.' + fig(graphStem(s.E)); }, parts: [
      { id: '1a', level: 'LIM', make: function (r, s) {
        var p = K.P.valueSet('Solve ' + t(tx(s.E) + '=0') + '.', [s.r1, s.r2], { diag: function (A) { return A.length === 2 && A.every(function (x) { return near(-x, s.r1) || near(-x, s.r2); }) ? { code: CP + 'root-sign', hint: 'Read the ' + t('x') + '-intercepts from the graph: check their signs.' } : null; } },
          'The solutions are the ' + t('x') + '-intercepts: ' + t('x=' + s.r1) + ' or ' + t('x=' + s.r2) + ' (factor: ' + t(facT(1, s.r1, s.r2) + '=0') + ').', ['The solutions of ' + t('\\dots=0') + ' are where the graph meets the ' + t('x') + '-axis.'], 'roots from a graph');
        p.bad = ['x=' + (-s.r1) + ',\\ x=' + (-s.r2), 'x=' + s.r1]; return fin(p);
      } },
      { id: '1b', level: 'BEG', make: function (r, s) { return fromGraph(s, r.pick(['lt', 'le'])); } },
      { id: '1c', level: 'BEG', make: function (r, s) { return fromGraph(s, r.pick(['gt', 'ge'])); } }] },
    { num: '2', shared: function (r) {
        var z = graphShared(r, [-1, -2, -1]); z.u = pickWhere(function () { return r.int(z.r1, z.r2); }, function (u) { return !near(u, (z.r1 + z.r2) / 2) && u !== z.r1 && u !== z.r2 && (r.chance(0.5) || u === 0); });
        z.L = at(z.E, z.u); z.u2 = z.r1 + z.r2 - z.u; return z;
      }, stem: function (s) { return 'The graph of ' + t('y=' + tx(s.E)) + ' is shown. Use it to solve each inequality.' + fig(graphStem(s.E)); }, parts: [
      { id: '2a', level: 'BEG', make: function (r, s) { return fromGraph(s, r.pick(['gt', 'ge'])); } },
      { id: '2b', level: 'BEG', make: function (r, s) { return fromGraph(s, r.pick(['le', 'lt'])); } },
      { id: '2c', level: 'PRG', make: function (r, s) {
        var op = r.pick(['ge', 'gt', 'le']), a = Math.min(s.u, s.u2), b = Math.max(s.u, s.u2), T = quadSet(-1, a, b, op), f = function (x) { return at(s.E, x); };
        var svg = graphStem(s.E, [{ f: function () { return s.L; }, dash: true, color: '#c4532a' }]);
        var sol = 'Draw the line ' + t('y=' + vt(s.L)) + '. It meets the graph where ' + t(tx(s.E) + '=' + vt(s.L)) + ': ' + t('x=' + vt(a)) + ' and ' + t('x=' + vt(b)) + ' (check: ' + t('f(' + vt(a) + ')=' + vt(f(a))) + ').<br>The graph is ' + (upOp(op) ? 'above' : 'below') + ' the line ' + (upOp(op) ? 'between' : 'outside') + ' them: ' + t(setTex(T)) + '.' + fig(svg);
        return fin(AK().setPart(CP, 'Solve ' + t(tx(s.E) + OPS[op] + vt(s.L)) + '. Write the solution in set notation.', T, { wrongs: [{ parts: quadSet(s.A, s.r1, s.r2, op), code: CP + 'line', hint: 'Compare the graph with the line ' + t('y=' + vt(s.L)) + ', not with the ' + t('x') + '-axis.' }] }, sol,
          ['Draw the horizontal line ' + t('y=' + vt(s.L)) + ' on the graph.', 'Where is the parabola ' + (upOp(op) ? 'above' : 'below') + ' that line? (Or rearrange: ' + t(tx(P.sub(s.E, P.num(s.L))) + OPS[op] + '0') + '.)'], 'compare with a line'));
      } }] },
    { num: '3', stem: 'Write the solution shown on each number line in set notation.', parts: [
      { id: '3a', level: 'LIM', make: function (r) { var z = intRoots(r, { zero: true }), inc = r.chance(0.35), T = SET.between(z.a, z.b, inc); return fin(AK().setPart(CP, nlFig(T), T, {}, (inc ? 'Closed' : 'Open') + ' dots at ' + t(z.a) + ' and ' + t(z.b) + ', shaded between: ' + t(setTex(T)) + '.', ['Open dot: not included (' + t('<') + '); closed dot: included (' + t('\\le') + ').'], 'set from a number line')); } },
      { id: '3b', level: 'BEG', make: function (r) { var z = intRoots(r, { zero: true }), inc = r.chance(0.65), T = SET.outside(z.a, z.b, inc); return fin(AK().setPart(CP, nlFig(T), T, {}, (inc ? 'Closed' : 'Open') + ' dots at ' + t(z.a) + ' and ' + t(z.b) + ', shaded outward: two pieces joined by “or”: ' + t(setTex(T)) + '.', ['Two pieces: join them with <b>or</b>.', 'Open dot: not included; closed dot: included.'], 'set from a number line')); } },
      { id: '3c', level: 'EMG', make: function (r) { var h = r.int(-5, 6), T = SET.ne(h); return fin(AK().setPart(CP, nlFig(T), T, {}, 'Every real number except ' + t(h) + ' (an open dot at ' + t(h) + ', shaded both ways): ' + t(setTex(T)) + '.', ['Which number is left out?', 'Use ' + t('\\ne') + '.'], 'set from a number line')); } }] },
    { num: '4', stem: 'Solve using roots and test points. Write each solution in set notation.', parts: [
      { id: '4a', level: 'BEG', make: function (r) { return monic(r, 'between', { test: function (z) { return z.a > 0 || z.b < 0; } }); } },
      { id: '4b', level: 'BEG', make: function (r) { return monic(r, 'outside', { test: function (z) { return z.a < 0 && z.b > 0; } }); } },
      { id: '4c', level: 'BEG', make: function (r) { return gcfQ(r, [1, 1, 1]); } },
      { id: '4d', level: 'EMG', make: function (r) { return dosQ(r); } },
      { id: '4e', level: 'EMG', make: function (r) { return nonmonicQ(r); } },
      { id: '4f', level: 'PRG', make: function (r) { return negLeadQ(r); } }] },
    { num: '5', stem: 'Rearrange, then solve.', parts: [
      { id: '5a', level: 'EMG', make: function (r) { return rearrQ(r, 'move'); } },
      { id: '5b', level: 'PRG', make: function (r) { return rearrQ(r, 'const'); } },
      { id: '5c', level: 'PRG', make: function (r) { return rearrQ(r, 'prod'); } },
      { id: '5d', level: 'PRG', make: function (r) { return rearrQ(r, 'two'); } }] },
    { num: '6', stem: 'Solve with a graphing calculator, to the nearest tenth.', shared: function (r) { return calcShared(r, 'pos'); }, parts: [
      { id: '6a', level: 'EMG', make: function (r, s) { var E = P.sub(P.pow(lin(1, -s.h), 2), P.num(s.n)); return calcRound(r, s, 1, tx(E) + OPS[s.op] + '0', E); } },
      { id: '6b', level: 'PRG', make: function (r) { var s = calcShared(r, 'neg'), E = P.neg(P.sub(P.pow(lin(1, -s.h), 2), P.num(s.n))); return calcRound(r, s, -1, tx(E) + OPS[s.op] + '0', E); } },
      { id: '6c', level: 'PRG', make: function (r) {
        var z = pickWhere(function () { return { a: r.pick([2, 3, 2]), b: r.int(-6, 6), c: nz(r, 1, 9), op: anyOp(r) }; }, function (q) { var D = q.b * q.b + 4 * q.a * q.c, sd = Math.sqrt(D); return D > 0 && Math.abs(sd - Math.round(sd)) > 1e-6 && q.b !== 0 && FRESH(quad(q.a, q.b, -q.c)) && Math.abs(sd / q.a) > 0.8 && Math.abs((-q.b - sd) / (2 * q.a)) <= 6 && Math.abs((-q.b + sd) / (2 * q.a)) <= 6; });
        var E = quad(z.a, z.b, -z.c), D = z.b * z.b + 4 * z.a * z.c, h = -z.b / (2 * z.a), w = Math.sqrt(D) / (2 * z.a);
        return calcRound(r, { h: h, n: w * w, op: z.op }, z.a, tx(quad(z.a, z.b, 0)) + OPS[z.op] + vt(z.c), E, 'Move the ' + t(vt(z.c)) + ': graph ' + t(tx(E) + OPS[z.op] + '0') + '.<br>');
      } },
      { id: '6d', level: 'ADV', make: function (r, s) {
        var E = P.sub(P.pow(lin(1, -s.h), 2), P.num(s.n)), C = U.cof(E), T = quadSet(1, s.h - Math.sqrt(s.n), s.h + Math.sqrt(s.n), s.op), et = function (x) { return x < s.h ? surdT(s.h, 1, s.n, -1) : surdT(s.h, 1, s.n, 1); };
        var sol = t('x=\\dfrac{' + vt(-C[1]) + '\\pm\\sqrt{' + par(C[1]) + '^{2}-4(1)' + par(C[2]) + '}}{2}=\\dfrac{' + vt(-C[1]) + '\\pm\\sqrt{' + 4 * s.n + '}}{2}=' + (s.h ? vt(s.h) : '') + '\\pm\\sqrt{' + s.n + '}') + '.<br>' + t(setTex(T, 'x', et)) + '.';
        return exactPart('Solve ' + t(tx(E) + OPS[s.op] + '0') + ' exactly, using the quadratic formula.', T, setTex(T, 'x', et), sol, ['The roots are ' + t('x=\\frac{-b\\pm\\sqrt{b^{2}-4ac}}{2a}') + '. Simplify the radical.', 'The parabola opens up: ' + t('<0') + ' between the roots, ' + t('>0') + ' outside.'], 'exact solution');
      } }] },
    { num: '7', stem: 'Solve each inequality.', shared: function (r) { return { sq: sqShared(r, [1]), sq2: sqShared(r, [2, 3]), nr: noRoot(r, [1, 1, 2]), nr2: noRoot(r, [-1, -1, -2]) }; }, parts: [
      { id: '7a', level: 'EMG', make: function (r, s) { return specialP(r, 'sq', r.pick(['le', 'le', 'lt']), s.sq); } },
      { id: '7b', level: 'EMG', make: function (r, s) { return specialP(r, 'sq', r.pick(['gt', 'gt', 'ge']), s.sq); } },
      { id: '7c', level: 'EMG', make: function (r, s) { return specialP(r, 'none', r.pick(['gt', 'ge']), s.nr); } },
      { id: '7d', level: 'PRG', make: function (r, s) { return specialP(r, 'none', r.pick(['ge', 'gt']), s.nr2); } },
      { id: '7e', level: 'PRG', make: function (r, s) { return specialP(r, 'sq', 'lt', s.sq2); } }] },
    { num: '8', stem: 'Find and correct the error in each student’s work.', parts: [
      { id: '8a', level: 'EMG', make: function (r) {
        var n = pickWhere(function () { return r.int(2, 9); }, function (x) { return x !== 3 && x !== 5; }), op = anyOp(r), inc = !strictOp(op), pos = upOp(op), T = quadSet(1, -n, n, op), sam = pos ? SET.above(n, inc) : SET.below(n, inc);
        var sol = 'Sam’s answer misses the negative values: e.g. ' + t('x=' + (pos ? -(n + 2) : -(n + 2))) + ' ' + (pos ? 'satisfies ' + t('x^{2}' + OPS[op] + n * n) + ' (' + t((n + 2) * (n + 2) + OPS[op] + n * n) + ') but not ' + t('x' + OPS[op] + n) : 'satisfies ' + t('x' + OPS[op] + n) + ' but ' + t((n + 2) * (n + 2) + OPS[op] + n * n) + ' is false') + '. The square root ignores the negative root.<br>Roots of ' + t('x^{2}-' + n * n + '=0') + ': ' + t('\\pm ' + n) + '; test ' + t('x=0') + ': ' + t('0' + OPS[op] + n * n) + ' is ' + (holds(-n * n, op) ? 'true' : 'false') + '. Solution: ' + t(setTex(T)) + '.' + fig(nlSvg(T));
        return fin(AK().setPart(CP, 'To solve ' + t('x^{2}' + OPS[op] + n * n) + ', Sam took the square root of both sides and wrote ' + t('x' + OPS[op] + n) + '. Write the correct solution in set notation.', T, { wrongs: [{ parts: sam, code: CP + 'ineq-sqrt', hint: 'That is Sam’s answer. Try a negative number such as ' + t('x=' + (-(n + 2))) + ' in ' + t('x^{2}' + OPS[op] + n * n) + '.' }] }, sol,
          ['Test a negative value in the original inequality and in Sam’s answer.', 'Solve ' + t('x^{2}-' + n * n + OPS[op] + '0') + ' with both roots and test points.'], 'correct the error'));
      } },
      { id: '8b', level: 'PRG', make: function (r) {
        var z = intRoots(r, { test: function (q) { return q.a < 0 && q.b > 0; } }), E = P.neg(P.mul(lin(1, -z.a), lin(1, -z.b))), op = anyOp(r), T = quadSet(-1, z.a, z.b, op), her = quadSet(1, z.a, z.b, op);
        var sol = 'Multiplying by ' + t('-1') + ' reverses the sign: ' + t(tx(P.neg(E)) + OPS[FLIP[op]] + '0') + '. Roots ' + t(z.a) + ' and ' + t(z.b) + '; test ' + t('x=0') + ' in the original: ' + t(vt(at(E, 0)) + OPS[op] + '0') + ' is ' + (holds(at(E, 0), op) ? 'true' : 'false') + '.<br>Solution: ' + t(setTex(T)) + '.' + fig(nlSvg(T));
        return fin(AK().setPart(CP, 'To solve ' + t(tx(E) + OPS[op] + '0') + ', Priya multiplied by ' + t('-1') + ' to get ' + t(tx(P.neg(E)) + OPS[op] + '0') + ', and wrote ' + t(plainSet(her)) + '. Write the correct solution in set notation.', T, { rev: true, wrongs: [{ parts: her, code: CP + 'ineq-rev', hint: 'That is Priya’s answer. Multiplying by ' + t('-1') + ' must reverse the inequality sign.' }] }, sol,
          ['What happens to the inequality sign when you multiply both sides by a negative number?', 'Check with a test point in the <b>original</b> inequality.'], 'correct the error'));
      } },
      { id: '8c', level: 'PRG', make: function (r) {
        var z = intRoots(r, { test: function (q) { return q.a < 0 && q.b > 0; } }), op = r.pick(['gt', 'ge']), E = P.mul(lin(1, -z.a), lin(1, -z.b)), T = quadSet(1, z.a, z.b, op), inc = !strictOp(op);
        var sol = 'Jordan assumed both factors must be positive; a product is also positive when both are negative (' + t('x' + (inc ? '\\le ' : '<') + z.a) + ').<br>Roots ' + t(z.a) + ', ' + t(z.b) + '. ' + testLine(E, z.a, z.b, op) + '<br>Solution: ' + t(setTex(T)) + '.' + fig(nlSvg(T));
        var f1 = tx(lin(1, -z.b)), f2 = tx(lin(1, -z.a));
        return fin(AK().setPart(CP, 'To solve ' + t(tx(E) + OPS[op] + '0') + ', Jordan wrote ' + t(facT(1, z.a, z.b) + OPS[op] + '0') + ', so ' + t(f1 + OPS[op] + '0') + ' and ' + t(f2 + OPS[op] + '0') + ', so ' + t('x' + OPS[op] + z.b) + '. Write the correct solution in set notation.', T, { wrongs: [{ parts: SET.above(z.b, inc), code: CP + 'ineq-case', hint: 'That is Jordan’s answer. A product is also positive when <b>both</b> factors are negative: test ' + t('x=' + (z.a - 1)) + '.' }] }, sol,
          ['Test a value less than both roots, e.g. ' + t('x=' + (z.a - 1)) + '.', 'Use roots and a test point in every interval.'], 'correct the error'));
      } }] },
    { num: '9', shared: function (r) { return kShared(r, [1, 2, 3, 4, 5, 1], [1, 2, 3, 4, 5, 6, 8, 9, 12, 16, 25, 18, 20], [[3, 12], [1, 9], [1, 16], [3, 3]]); }, stem: function (s) { return 'Consider the equation ' + t(tx(M(s.a, 'x', 2)) + '+kx+' + s.c + '=0') + '. Determine the values of ' + t('k') + ' for which the equation has'; }, parts: [
      { id: '9a', level: 'PRG', make: function (r, s) { return kPart(r, s, true); } },
      { id: '9b', level: 'PRG', make: function (r, s) { return kPart(r, s, false); } },
      { id: '9c', level: 'EMG', make: function (r, s) {
        var S = Math.sqrt(4 * s.a * s.c);
        var p = K.P.valueSet('two equal real roots.', [-S, S], { v: 'k', keyTex: 'k=-' + S + ',\\ k=' + S, diag: function (A) { return A.length === 1 && near(Math.abs(A[0]), S) ? { code: CP + 'k-equal', hint: t('k^{2}=' + S * S) + ' has two solutions.' } : null; } },
          'Equal roots: ' + t('b^{2}-4ac=0') + ', so ' + t('k^{2}-' + S * S + '=0') + ' and ' + t('k=\\pm ' + S) + '.', ['Two equal roots: the discriminant is ' + t(0) + '.'], 'one (double) root');
        p.bad = ['k=' + S]; return fin(p);
      } }] },
    { num: '10', parts: [{ id: '10', level: 'MAS', make: function (r) {
      var z = pickWhere(function () { var p = r.int(-8, 4), q = r.int(-2, 10); return { p: p, q: q, two: r.chance(0.3) }; }, function (s) { var sum = s.p + s.q, pr = s.p * s.q; return s.p < s.q && sum % 4 === 0 && sum !== 0 && pr % 4 === 0 && pr !== 0 && Math.abs(sum / 4) <= 3 && Math.abs(pr / 4) <= 9 && !(s.p === -2 && s.q === 6); });
      var u = (z.p + z.q) / 4, w = -z.p * z.q / 4, cT = (u > 0 ? '+' : '-') + coefT(Math.abs(u)) + 'm' + sgn(w), T = z.two ? SET.outside(z.p, z.q, false) : SET.between(z.p, z.q, false);
      var Dp = P.add(M(1, 'm', 2), M(-4 * u, 'm', 1), P.num(-4 * w));
      var sol = (z.two ? 'Two ' + t('x') + '-intercepts: ' + t('b^{2}-4ac>0') : 'No ' + t('x') + '-intercepts: ' + t('b^{2}-4ac<0')) + ': ' + t('m^{2}-4(1)(' + tx(lin(u, w, 'm')) + ')' + (z.two ? '>' : '<') + '0') + ', so ' + t(tx(Dp) + (z.two ? '>' : '<') + '0') + '.<br>' + t(facT(1, z.p, z.q, 'm') + '=0') + ': roots ' + t(z.p) + ' and ' + t(z.q) + '. Test ' + t('m=' + vt((z.p + z.q) / 2)) + ': ' + t(vt(at(Dp, 0) * 0 + P.at(Dp, { m: (z.p + z.q) / 2 }))) + ' < 0.<br>' + t(setTex(T, 'm')) + '.';
      return fin(AK().setPart(CP, 'For what values of ' + t('m') + ' does the graph of ' + t('y=x^{2}+mx' + cT) + ' have ' + (z.two ? 'two' : 'no') + ' ' + t('x') + '-intercepts?', T, { v: 'm', wrongs: [{ parts: SET.pt(z.p).concat(SET.pt(z.q)), code: CP + 'k-tangent', hint: 'Those values make the discriminant ' + t(0) + ' (one ' + t('x') + '-intercept). Write the inequality.' }] }, sol,
        ['The discriminant is ' + t('b^{2}-4ac') + ' with ' + t('b=m') + ' and ' + t('c=' + tx(lin(u, w, 'm'))) + '.', (z.two ? 'Two' : 'No') + ' ' + t('x') + '-intercepts: ' + t('b^{2}-4ac' + (z.two ? '>' : '<') + '0') + '. Solve that quadratic inequality in ' + t('m') + '.'], 'values of m'));
    } }] },
    { num: '11', stem: 'Write and solve a quadratic inequality.', parts: [
      { id: '11a', level: 'ADV', make: function (r) { return fin(AK().B.heightCtx(r, CP, { mode: 'rect' })); } },
      { id: '11b', level: 'MAS', make: function (r) {
        var s = pickWhere(function () { return { N: r.int(12, 42), le: r.chance(0.3) }; }, function (z) { return z.N !== 30; });
        var D = 1 + 4 * s.N, r1 = (-1 - Math.sqrt(D)) / 2, r2 = (-1 + Math.sqrt(D)) / 2, ints = [];
        for (var n = Math.floor(r1) - 1; n <= Math.ceil(r2) + 1; n++) if (s.le ? n * (n + 1) <= s.N : n * (n + 1) < s.N) ints.push(n);
        var keyTex = 'n=' + ints.join(',\\ ');
        var sol = t('n(n+1)' + (s.le ? '\\le ' : '<') + s.N) + ', so ' + t('n^{2}+n-' + s.N + (s.le ? '\\le 0' : '<0')) + '. Roots ' + t('n=\\frac{-1\\pm\\sqrt{' + D + '}}{2}') + (Math.abs(Math.sqrt(D) - Math.round(Math.sqrt(D))) < 1e-9 ? ' ' + t('=' + vt(r1) + ',\\ ' + vt(r2)) : ' ' + t('\\approx ' + r1.toFixed(2) + ',\\ ' + r2.toFixed(2))) + '; test ' + t('n=0') + ': true, so between.<br>' + t('n') + ' is an integer: ' + t(ints.join(',\\ ')) + '.';
        var check = function (resp) {
          var str = String(resp == null ? '' : resp).trim(); if (!str) return form('empty', 'Type your answer first.');
          var vals = null, vs = K.valueSet(ints, { v: 'n' })(resp);
          if (vs.v === 'correct') return ok();
          var pr = HW.sets.parse(String(resp).replace(/\\(operatorname|mathrm|text)\{\s*(or|and)\s*\}/g, ' $2 '));
          if (pr.ok && pr.set.kind === 'list') vals = pr.set.vals;
          else if (pr.ok && pr.set.kind === 'int' && pr.set.parts.every(function (q) { return isFinite(q.lo) && isFinite(q.hi); })) { vals = []; pr.set.parts.forEach(function (q) { for (var k = Math.ceil(q.lo); k <= Math.floor(q.hi); k++) if ((k > q.lo || q.lc) && (k < q.hi || q.hc)) vals.push(k); }); }
          if (!vals) { var m = /n\s*=\s*(.*)/.exec(str); if (!m) return vs; return wrongVals(vs); }
          vals = vals.filter(function (v, i, a) { return a.indexOf(v) === i; }).sort(function (a, b) { return a - b; });
          if (vals.join() === ints.join()) return ok();
          return wrongVals(null, vals);
        };
        function wrongVals(vs, vals) {
          if (vals) {
            var neg = vals.every(function (v) { return v >= 0; }) && ints.some(function (v) { return v < 0; });
            if (neg) return wrong(CP + 'ineq-restr', 'Integers can be negative too: the product of two negative consecutive integers is positive. Include the negative ones.');
            var miss = ints.filter(function (v) { return vals.indexOf(v) < 0; }), extra = vals.filter(function (v) { return ints.indexOf(v) < 0; });
            if (miss.length + extra.length <= 2) return wrong(CP + 'consec', 'Nearly: check the integers at each end (test their product).');
            return wrong('value', null);
          }
          return vs;
        }
        var p = KP.math('The product of two consecutive integers is ' + (s.le ? 'at most' : 'less than') + ' ' + t(s.N) + '. Determine all possible values of the smaller integer.', check, keyTex, sol, ['Let the integers be ' + t('n') + ' and ' + t('n+1') + '. Write the inequality and solve it.', 'List every integer in the solution (negative ones too).'], 'consecutive integers', { keys: 'solutions', vars: ['n'], placeholder: 'e.g. n = -2, -1, 0, 1' });
        p.bad = ['n=' + ints.filter(function (v) { return v >= 0; }).join(',\\ '), 'n=' + ints.slice(1).join(',\\ ')]; return fin(p);
      } }] },
    { num: '12', parts: [{ id: '12', level: 'EMG', make: function (r) {
      var z = intRoots(r, { zero: true, test: function (q) { return q.b - q.a >= 2 && q.b - q.a <= 8; } }), out = r.chance(0.6), inc = r.chance(0.6), T = out ? SET.outside(z.a, z.b, inc) : SET.between(z.a, z.b, inc);
      var op = out ? (inc ? 'ge' : 'gt') : (inc ? 'le' : 'lt'), F = facT(1, z.a, z.b), Fw = facT(1, -z.b, -z.a);
      var opts = [{ html: t(F + OPS[op] + '0'), right: true }, { html: t(F + OPS[FLIP[op]] + '0'), code: 'side', why: out ? 'That is the solution between the roots.' : 'That is the solution outside the roots.' },
        { html: t(Fw + OPS[op] + '0'), code: 'roots', why: 'Those factors have roots ' + t(-z.b) + ' and ' + t(-z.a) + '.' }, { html: t(F + OPS[TOG[op]] + '0'), code: 'ends', why: inc ? 'The dots are closed: the roots are included.' : 'The dots are open: the roots are not included.' }];
      return fin(mcPart(r, 'The solution shown is the solution of' + nlFig(T), opts, 'Roots ' + t(z.a) + ' and ' + t(z.b) + ' give the factors ' + t(F) + '. ' + (out ? 'Outside the roots the product is positive' : 'Between the roots the product is negative') + ', and ' + (inc ? 'closed dots mean the roots are included' : 'open dots mean they are not') + ': ' + t(F + OPS[op] + '0') + '.',
        ['The endpoints are the roots.', 'Outside the roots → the product is positive; between → negative. Closed dots → ' + t('\\le') + ' or ' + t('\\ge') + '.'], 'which inequality'));
    } }] },
    { num: '13', parts: [{ id: '13', level: 'EMG', make: function (r) {
      var n = pickWhere(function () { return r.int(2, 12); }, function (x) { return x !== 5; }), op = anyOp(r), T = quadSet(1, -n, n, op), pos = upOp(op);
      var cand = [T, pos ? SET.above(n, !strictOp(op)) : SET.below(n, !strictOp(op)), quadSet(-1, -n, n, op), quadSet(1, -n, n, TOG[op])];
      var why = [null, 'That misses the negative side: ' + t('x^{2}') + ' is also ' + (pos ? 'large' : 'small') + ' for negative ' + t('x') + '.', 'Test ' + t('x=0') + ': ' + t('0' + OPS[op] + n * n) + ' is ' + (holds(-n * n, op) ? 'true' : 'false') + '.', 'Check the endpoints: ' + (strictOp(op) ? t(OPS[op]) + ' leaves the roots out.' : t(OPS[op].trim()) + ' includes the roots.')];
      var opts = cand.map(function (c, i) { return { html: t(plainSet(c)), right: i === 0, code: ['r', 'sqrt', 'side', 'ends'][i], why: why[i] }; });
      return fin(mcPart(r, 'The solution of ' + t('x^{2}' + OPS[op] + n * n) + ' is', opts, 'Roots ' + t('\\pm ' + n) + '; test ' + t('x=0') + ': ' + t('0' + OPS[op] + n * n) + ' is ' + (holds(-n * n, op) ? 'true, so between' : 'false, so outside') + ', roots ' + (strictOp(op) ? 'excluded' : 'included') + ': ' + t(plainSet(T)) + '.', ['Find both roots of ' + t('x^{2}-' + n * n + '=0') + '.', 'Test ' + t('x=0') + '.'], 'solve x² vs a square'));
    } }] },
    { num: '14', parts: [{ id: '14', level: 'EMG', make: function (r) {
      var c = r.pick([1, 4, 9, 2, 3, 5, 16]), h = nz(r, 1, 5), c2 = r.pick([1, 4, 9, 16, 25]);
      var none = r.shuffle([t('x^{2}+' + c + '\\le 0'), t(br(lin(1, -h)) + '^{2}<0'), t('-x^{2}-' + c + '\\ge 0')])[0];
      var others = r.shuffle([{ h: t('x^{2}+' + c + '>0'), w: 'A square plus a positive number is always positive: every real number works.' }, { h: t('x^{2}-' + c2 + '<0'), w: 'That one is true between ' + t('-' + Math.sqrt(c2)) + ' and ' + t(Math.sqrt(c2)) + '.' }, { h: t(br(lin(1, -h)) + '^{2}\\ge 0'), w: 'A square is never negative: every real number works.' }, { h: t(br(lin(1, -h)) + '^{2}\\le 0'), w: 'That one has exactly one solution, ' + t('x=' + h) + '.' }]).slice(0, 3);
      var opts = [{ html: none, right: true }].concat(others.map(function (o, i) { return { html: o.h, code: 'o' + i, why: o.w }; }));
      return fin(mcPart(r, 'Which inequality has no solution?', opts, none + ': ' + (/\\le 0/.test(none) ? t('x^{2}+' + c) + ' is at least ' + t(c) + ' for every ' + t('x') + ', so it is never ' + t('\\le 0') + '.' : /<0/.test(none) ? 'a square is never negative.' : t('-x^{2}-' + c) + ' is at most ' + t('-' + c) + ', so it is never ' + t('\\ge 0') + '.'), ['A square is never negative. Which statement can never be true?'], 'no solution'));
    } }] },
    { num: '15', parts: [{ id: '15', level: 'PRG', make: function (r) { return fin(AK().B.countInts(r, CP)); } }] },
    { num: '16', parts: [{ id: '16', level: 'PRG', make: function (r) {
      var z = intRoots(r, { test: function (q) { return q.a < 0 && q.b > 0 && q.a + q.b !== 0; } }), out = r.chance(0.3), b = -(z.a + z.b), c = z.a * z.b, op = out ? 'gt' : 'lt', T = out ? SET.outside(z.a, z.b, false) : SET.between(z.a, z.b, false);
      var p = KP.nr(t('\\text{NR}') + ' The solution of ' + t('x^{2}+bx' + sgn(c) + OPS[op] + '0') + ' is ' + t(setTex(T)) + '. The value of ' + t('b') + ' is', b, function (v) { return v === -b ? { code: CP + 'b-sign', hint: 'The factors are ' + t(facT(1, z.a, z.b)) + ': expand them carefully.' } : null; },
        'The roots are ' + t(z.a) + ' and ' + t(z.b) + ', so ' + t('x^{2}+bx' + sgn(c) + '=' + facT(1, z.a, z.b) + '=' + tx(P.mul(lin(1, -z.a), lin(1, -z.b)))) + '. ' + t('b=' + b) + '.', ['The endpoints are the roots of ' + t('x^{2}+bx' + sgn(c) + '=0') + '.', 'Write the factors from the roots and expand.'], 'unknown coefficient');
      p.bad = [String(-b)]; return fin(p);
    } }] }
  ];

  /* ---------------- the extra practice ---------------- */
  var EXTRA = [
    { num: 'A1', section: 'A. Skills', shared: function (r) { return graphShared(r, [1]); }, stem: function (s) { return 'The graph of ' + t('y=' + tx(s.E)) + ' is shown. Use it to solve each inequality.' + fig(graphStem(s.E)); }, parts: [
      { id: 'A1a', level: 'BEG', make: function (r, s) { return fromGraph(s, r.pick(['lt', 'le'])); } },
      { id: 'A1b', level: 'BEG', make: function (r, s) { return fromGraph(s, r.pick(['gt', 'ge'])); } }] },
    { num: 'A2', stem: 'Solve using roots and test points.', parts: [
      { id: 'A2a', level: 'BEG', make: function (r) { return monic(r, 'outside', { test: function (z) { return z.a < 0 && z.b > 0; } }); } },
      { id: 'A2b', level: 'BEG', make: function (r) { return monic(r, 'between', { hi: -1, hi2: -1, test: function (z) { return z.b < 0; } }); } },
      { id: 'A2c', level: 'EMG', make: function (r) { return gcfQ(r, [2, 3, 4, 5]); } },
      { id: 'A2d', level: 'PRG', make: function (r) { return nonmonicQ(r, r.pick(['ge', 'gt', 'le']), { qList: [3, 5, 4] }); } }] },
    { num: 'A3', stem: 'Solve each inequality.', shared: function (r) { return { sq: sqShared(r, [1]), sq2: sqShared(r, [1]), nr: noRoot(r, [1, 1, 3]) }; }, parts: [
      { id: 'A3a', level: 'EMG', make: function (r, s) { return specialP(r, 'sq', 'lt', s.sq); } },
      { id: 'A3b', level: 'EMG', make: function (r, s) { return specialP(r, 'none', r.pick(['ge', 'gt', 'lt']), s.nr); } },
      { id: 'A3c', level: 'EMG', make: function (r, s) { return specialP(r, 'sqshow', r.pick(['gt', 'gt', 'le']), s.sq2); } }] },
    { num: 'B1', section: 'B. Applying', stem: 'Rearrange, then solve.', parts: [
      { id: 'B1a', level: 'PRG', make: function (r) { return rearrQ(r, 'constfirst'); } },
      { id: 'B1b', level: 'PRG', make: function (r) { return rearrQ(r, 'xprod'); } }] },
    { num: 'B2', shared: function (r) { return pickWhere(function () { return { b: r.pick([-7, -5, -3, -1, 1, 3, 5, 7]), c: r.int(-9, 4), op: anyOp(r) }; }, function (z) { var D = z.b * z.b - 4 * z.c, sd = Math.sqrt(D); return D > 0 && Math.abs(sd - Math.round(sd)) > 1e-6 && FRESH(quad(1, z.b, z.c)) && Math.abs((-z.b - sd) / 2) <= 7 && Math.abs((-z.b + sd) / 2) <= 7; }); },
      stem: function (s) { return 'Solve ' + t(tx(quad(1, s.b, s.c)) + OPS[s.op] + '0') + '.'; }, parts: [
      { id: 'B2a', level: 'PRG', make: function (r, s) { var E = quad(1, s.b, s.c), D = s.b * s.b - 4 * s.c; return calcRound(r, { h: -s.b / 2, n: D / 4, op: s.op }, 1, tx(E) + OPS[s.op] + '0', E); } },
      { id: 'B2b', level: 'ADV', make: function (r, s) {
        var D = s.b * s.b - 4 * s.c, q = sqf(D), r1 = (-s.b - Math.sqrt(D)) / 2, r2 = (-s.b + Math.sqrt(D)) / 2, T = quadSet(1, r1, r2, s.op);
        var rad = (q.m === 1 ? '' : q.m) + '\\sqrt{' + q.d + '}', et = function (x) { return '\\frac{' + vt(-s.b) + (x < -s.b / 2 ? '-' : '+') + rad + '}{2}'; };
        var sol = t('x=\\dfrac{' + vt(-s.b) + '\\pm\\sqrt{' + par(s.b) + '^{2}-4(1)' + par(s.c) + '}}{2}=\\dfrac{' + vt(-s.b) + '\\pm' + rad + '}{2}') + '.<br>' + t(setTex(T, 'x', et)) + '.';
        return exactPart('Solve it exactly.', T, setTex(T, 'x', et), sol, ['Use the quadratic formula for the roots.', 'Opens up: ' + t('<0') + ' between the roots, ' + t('>0') + ' outside.'], 'exact solution');
      } }] },
    { num: 'B3', parts: [{ id: 'B3', level: 'EMG', make: function (r) {
      var z = intRoots(r, { test: function (q) { return q.a < 0 && q.b > 0; } }), E = P.mul(lin(1, -z.a), lin(1, -z.b)), op = anyOp(r);
      return solveP({ show: (r.chance(0.5) ? facT(1, z.a, z.b) : facT(1, z.b, z.a)) + OPS[op] + '0', E: E, A: 1, r1: z.a, r2: z.b, op: op, facS: facT(1, z.a, z.b), how: ' using roots and test points' });
    } }] },
    { num: 'B4', parts: [{ id: 'B4', level: 'PRG', make: function (r) { var s = kShared(r, [1, 1, 2], [1, 4, 9, 16, 25, 36, 2, 8, 18], [[1, 16], [1, 9], [1, 36]]); return kPart(r, s, r.chance(0.3)); } }] },
    { num: 'B5', parts: [{ id: 'B5', level: 'PRG', make: function (r) {
      var z = intRoots(r, { test: function (q) { return q.a > 0 || q.b < 0; } }), E = P.neg(P.mul(lin(1, -z.a), lin(1, -z.b))), op = anyOp(r), T = quadSet(-1, z.a, z.b, op);
      var cand = [T, quadSet(1, z.a, z.b, op), quadSet(-1, -z.b, -z.a, op), quadSet(-1, z.a, z.b, TOG[op])];
      var why = [null, 'That comes from multiplying by ' + t('-1') + ' without reversing the sign.', 'Check the signs of the roots: ' + t(tx(E) + '=-' + facT(1, z.a, z.b)) + '.', 'Check the endpoints: ' + (strictOp(op) ? 'they are not included.' : 'they are included.')];
      var mid = (z.a + z.b) / 2, mv = at(E, mid);
      return fin(mcPart(r, 'The solution of ' + t(tx(E) + OPS[op] + '0') + ' is', cand.map(function (c, i) { return { html: t(plainSet(c)), right: i === 0, code: ['r', 'norev', 'roots', 'ends'][i], why: why[i] }; }),
        t(tx(E) + '=-' + facT(1, z.a, z.b)) + '; test ' + t('x=' + vt(mid)) + ': ' + t(vt(mv) + OPS[op] + '0') + ' is ' + (holds(mv, op) ? 'true, so between' : 'false, so outside') + ', roots ' + (strictOp(op) ? 'excluded' : 'included') + ': ' + t(plainSet(T)) + '.', ['Factor out ' + t('-1') + ' and find the roots.', 'Test a value between the roots in the original inequality.'], 'solve (MC)'));
    } }] },
    { num: 'B6', parts: [{ id: 'B6', level: 'PRG', make: function (r) {
      var z = intRoots(r, { test: function (q) { return q.b - q.a >= 3 && q.b - q.a <= 12; } }), op = r.pick(['lt', 'le']), E = P.mul(lin(1, -z.a), lin(1, -z.b)), inc = op === 'le', n = inc ? z.b - z.a + 1 : z.b - z.a - 1;
      var p = KP.nr(t('\\text{NR}') + ' The number of integers that satisfy ' + t(tx(E) + OPS[op] + '0') + ' is', n, function (v) { return Math.abs(v - n) <= 2 && v !== n ? { code: CP + 'count-ends', hint: 'Check the endpoints: ' + (inc ? t('\\le') + ' includes the roots.' : t('<') + ' leaves the roots out.') } : null; },
        t(facT(1, z.a, z.b) + OPS[op] + '0') + ': ' + t(z.a + (inc ? '\\le ' : '<') + 'x' + (inc ? '\\le ' : '<') + z.b) + '. The integers ' + t((inc ? z.a : z.a + 1) + ',\\ \\dots,\\ ' + (inc ? z.b : z.b - 1)) + ': <b>' + n + '</b>.', ['Solve the inequality first.', 'Count the integers in the solution, watching the endpoints.'], 'count the integers');
      p.bad = [String(n + 1), String(n - 1), String(n + 2)]; return fin(p);
    } }] },
    { num: 'C1', section: 'C. Stretch', parts: [{ id: 'C1', level: 'MAS', make: function (r) {
      var s = pickWhere(function () { return { u: nz(r, 1, 4), v: nz(r, 1, 4), op: anyOp(r) }; }, function (z) { var h = 2 * z.u - z.v, N = h * h - 2 * z.u * z.u + z.v * z.v, sr = Math.round(Math.sqrt(N)); return N > 0 && sr * sr !== N && !(z.u === 1 && z.v === -1) && z.u !== z.v; });
      var h = 2 * s.u - s.v, N = h * h - 2 * s.u * s.u + s.v * s.v, q = sqf(N), E = quad(1, -2 * h, 2 * s.u * s.u - s.v * s.v), r1 = h - Math.sqrt(N), r2 = h + Math.sqrt(N), T = quadSet(1, r1, r2, s.op);
      var et = function (x) { return surdT(h, q.m, q.d, x < h ? -1 : 1); };
      var Lt = '2' + br(lin(1, -s.u)) + '^{2}', Rt = br(lin(1, -s.v)) + '^{2}';
      var sol = t(tx(P.scale(P.pow(lin(1, -s.u), 2), 2)) + OPS[s.op] + tx(P.pow(lin(1, -s.v), 2))) + ', so ' + t(tx(E) + OPS[s.op] + '0') + '.<br>Roots ' + t('x=\\dfrac{' + vt(2 * h) + '\\pm\\sqrt{' + 4 * N + '}}{2}=' + (h ? vt(h) : '') + '\\pm ' + (q.m === 1 ? '' : q.m) + '\\sqrt{' + q.d + '}') + '. Test ' + t('x=' + h) + ': ' + t(vt(at(E, h)) + OPS[s.op] + '0') + ' is ' + (holds(at(E, h), s.op) ? 'true, so between' : 'false, so outside') + '.<br>' + t(setTex(T, 'x', et)) + '.';
      return exactPart('Solve ' + t(Lt + OPS[s.op] + Rt) + ' exactly.', T, setTex(T, 'x', et), sol, ['Expand both sides and move every term to one side.', 'Use the quadratic formula; simplify the radical; then test a value.'], 'solve exactly');
    } }] },
    { num: 'C2', parts: [{ id: 'C2', level: 'MAS', make: function (r) {
      var s = pickWhere(function () { return { q: r.pick([2, 3, 4, 2]), p: nz(r, 1, 7), r2: r.int(-6, 6) }; }, function (z) { return z.p % z.q !== 0 && ex.gcd(Math.abs(z.p), z.q) === 1 && z.p / z.q < z.r2 && !(z.q === 2 && z.p === -1 && z.r2 === 3); });
      var a = s.p / s.q, E = P.mul(lin(s.q, -s.p), lin(1, -s.r2)), T = SET.outside(a, s.r2, false);
      return fin(AK().ineqPart(CP, 'Write a quadratic inequality, in the form ' + t('ax^{2}+bx+c>0') + ' with integer coefficients, whose solution is ' + t(setTex(T)) + '.', E, 'gt', tx(E) + '>0',
        { vars: ['x'], posLead: true, intCoef: true, ph: '2x^2 - 5x - 3 > 0', example: '2x^{2}-5x-3>0', sideHint: 'Right roots, but the inequality points the wrong way: outside the roots the product (with a positive leading coefficient) is positive.', strictHint: 'The endpoints are not included: use ' + t('>') + '.', boundHint: 'Check your factors: the root ' + t(vt(a)) + ' gives the factor ' + t(br(lin(s.q, -s.p))) + '.' },
        'The roots ' + t(vt(a)) + ' and ' + t(s.r2) + ' give the factors ' + t(br(lin(s.q, -s.p))) + ' and ' + t(br(lin(1, -s.r2))) + '. Outside the roots with ' + t('a>0') + ' means ' + t('>0') + ':<br>' + t(br(lin(s.q, -s.p)) + br(lin(1, -s.r2)) + '>0') + ', ' + t(tx(E) + '>0') + '.',
        ['Each endpoint is a root: write a factor for each (clear the fraction).', 'Outside the roots → the product is positive.'], 'write an inequality from its solution'));
    } }] },
    { num: 'C3', parts: [{ id: 'C3', level: 'MAS', make: function (r) {
      var s = pickWhere(function () { return { m: r.pick([2, 2, 3]), p: r.int(1, 9), q: r.int(1, 8) }; }, function (z) {
        var A = z.m - 1, B = z.m * z.q - z.p, C = -z.p * z.q, D = B * B - 4 * A * C, sd = Math.round(Math.sqrt(D)); if (sd * sd !== D) return false;
        var rp = (-B + sd) / (2 * A); return Math.abs(rp * 2 - Math.round(rp * 2)) < 1e-9 && rp > z.p / z.m + 1e-9 && !(z.m === 2 && z.p === 3 && z.q === 2) && rp <= 12;
      });
      var A = s.m - 1, B = s.m * s.q - s.p, C = -s.p * s.q, D = B * B - 4 * A * C, rp = (-B + Math.sqrt(D)) / (2 * A), rn = (-B - Math.sqrt(D)) / (2 * A), E = quad(A, B, C), T = SET.above(rp, false), L = s.p / s.m;
      var sol = 'The rectangle exists only if ' + t(s.m + 'x-' + s.p + '>0') + ', so ' + t('x>' + vt(L)) + '.<br>' + t('(' + s.m + 'x-' + s.p + ')(x+' + s.q + ')>x^{2}') + ', so ' + t(tx(P.mul(lin(s.m, -s.p), lin(1, s.q))) + '>x^{2}') + ' and ' + t(tx(E) + '>0') + '. Roots ' + t(vt(rn)) + ' and ' + t(vt(rp)) + '; outside: ' + t('x<' + vt(rn) + '\\text{ or }x>' + vt(rp)) + '.<br>With ' + t('x>' + vt(L)) + ': ' + t(setTex(T)) + '.';
      return fin(AK().setPart(CP, 'A square has side ' + t('x') + ' cm. A rectangle has length ' + t('(' + s.m + 'x-' + s.p + ')') + ' cm and width ' + t('(x+' + s.q + ')') + ' cm. For what values of ' + t('x') + ' is the area of the rectangle greater than the area of the square?', T,
        { wrongs: [{ parts: SET.outside(rn, rp, false), code: CP + 'ineq-restr', hint: 'Right inequality — but the side lengths must be positive: ' + t(s.m + 'x-' + s.p + '>0') + '.' }, { parts: SET.above(L, false), code: CP + 'ineq-restr', hint: 'That is only the restriction. Which values also make the rectangle bigger?' }] }, sol,
        ['Write the area inequality and move every term to one side.', 'Solve it, then keep only the values where both lengths are positive.'], 'areas with a restriction'));
    } }] }
  ];

  HW.defineLesson({ id: LID, unit: 8, num: '6', title: 'Quadratic Inequalities in One Variable: Roots and Test Points', outcome: 'RF8', calc: true, questions: QUESTIONS, extra: EXTRA });
})(window);
