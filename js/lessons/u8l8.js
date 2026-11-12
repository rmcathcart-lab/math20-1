/* Math 20-1 · Unit 8 · Lesson 8 — Unit 8 Review (outcome per part: RF6 systems, RF7 inequalities in two variables, RF8
 * quadratic inequalities in one variable)
 * Assignment 8, a practice test (m201book unit8/u8_l08.tex, Questions 1–27) and the Lesson 8 Extra Practice, a second
 * practice test (u8_ep08.tex: Multiple Choice 1–10, Numerical Response 11–14, Written Response 15–19). Extra ids start
 * with E. Every part is a generator: the booklet question's idea, form and difficulty with new numbers (the lesson's
 * example numbers and the booklet's own numbers are left out where feasible). Calculator allowed: answers exact unless a
 * question asks to round.
 *
 * Uses the Unit 8 assessment kit HW.u8assess (js/lessons/u8test.js — loads after the lesson files, so only inside make():
 * systems by substitution / elimination, the number of solutions, tangents, number problems, two thrown balls, which
 * graph, boundary and side, writing a region's inequality, sign-chart rows, integer counts; ordered-pair, set and
 * inequality checkers) and this unit's practice kit HW.u8k78 (u8l7.js, loaded first: sign charts, solution sets in set
 * notation, rounded / exact endpoints). Added here: a system with irrational solutions (rounded, then exact), the grad
 * committee / tutoring contexts (inequality, which combinations work, a boundary combination), a ball from a platform
 * (when and how long above a height; below the platform until it lands, rounded), and the practice tests' multiple-choice
 * and numerical-response items (the quadratic after substitution, a positive x-coordinate to the hundredth, a point not in
 * a region, the region of a dashed parabola, a point in two regions, the least number of items for a profit, a tangent's
 * k, a + b + c + d of two intersection points, the zeros of a sign chart's factors).
 * Conversions: "graph the inequality" → which graph (or boundary and side); "use a graphing calculator" → the solutions
 * to the nearest hundredth; "explain why the boundary is solid" / "explain why (0, 0) cannot be a test point" /
 * "describe how to graph" → multiple choice of explanations; "give two combinations" → one on the boundary and one more.
 * Booklet note: u8_l08 #14(b) gives 6 < t ≤ 6.32 for "below the platform"; both 6 < t < 6.32 and 6 < t ≤ 6.32 are accepted
 * here (the landing time is a rounded value).
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: 4, 14(b), Extra 12, 18(b), 19(c ii). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, KP = K.P, P = HW.poly, ex = HW.ex, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var LID = 'u8l8', CP = 'u8l8-', U = HW.u8k78, INF = Infinity, RF6 = 'RF6', RF7 = 'RF7', RF8 = 'RF8';
  if (!U) throw new Error(LID + '.js needs u8l7.js (HW.u8k78) loaded first');
  var A = U.A, pickWhere = U.pickWhere, nz = U.nz, gcd = U.gcd, vt = U.vt, dt = U.dt, M = U.M, quad = U.quad, lin = U.lin, tx = U.tx, par = U.par, at = U.at, near = U.near, coefT = U.coefT, seqT = U.seqT;
  var OPS = U.OPS, FLIP = U.FLIP, strictOp = U.strictOp, upOp = U.upOp, holds = U.holds, SET = U.SET, sIv = U.sIv, setTexX = U.setTexX, facT = U.facT, fpoly = U.fpoly, rootsOf = U.rootsOf, facSet = U.facSet, surdT = U.surdT;
  U.register(CP, {
    'dur': ['Gave a time instead of how long', 'b'], 'neg-time': ['Gave the negative (inadmissible) time', 'b'], 'ends': ['Least/greatest whole number: endpoint wrong', 's'],
    'ctx-pt': ['Misjudged whether a combination meets the goal', 's'], 'bound-pt': ['A combination not on the boundary', 's'], 'sum': ['a + b + c + d: a coordinate wrong', 's'],
    'neg-root': ['Gave the negative x-coordinate', 's'], 'y-coord': ['Gave the y-coordinate instead of x', 's'], 'k-neg': ['Gave the negative value of k', 's'],
    'chart-zero': ['Sign chart: the product is 0 only at a zero (and is 0 there)', 's'], 'chart-const': ['Sign chart: ignored the negative constant factor', 'b'], 'chart': ['Sign chart: a sign in the product row', 's'],
    'land': ['Included the landing time', 's'], 'case-why': ['Explained with the wrong reason', 'n']
  });
  /* the roots of this lesson's examples and its practice tests' one-variable inequalities: never generated here */
  var AV8 = ['-5/2,3', '-3,1', '-2,7', '-2,1/3', '-4,4', '6', '-5/2,4', '1,5', '-3,0', '-7,5', '-3/2,5', '-2,3', '-4,6', '-3,5', '-2,3/2', '8,22', '-7,4', '20,60', '2,4'];
  function B() { return A().B; }
  function mk(fn, o) { return function (r) { return B()[fn](r, CP, o); }; }
  function ptT(x, y) { return '(' + vt(x) + ',\\ ' + vt(y) + ')'; }
  function fig(svg) { return '<div class="fig">' + svg + '</div>'; }
  function mc(r, prompt, opts, sol, hints, text, keep) { var p = KP.mc(r, prompt, opts, sol, hints, text, keep); return p; }
  function nrPart(prompt, ans, diag, sol, hints, text, bad) { var p = KP.nr(prompt, ans, diag, sol, hints, text); p.bad = (bad || []).map(String).filter(function (b) { return Number(b) !== ans; }); return p; }
  function apxNr(prompt, x, diag, sol, hints, text, bad) {
    var p = KP.approx(prompt, x, 2, { nr: true, diag: diag }, sol, hints, text); p.bad = (bad || []).map(function (b) { return K.roundTo(b, 2).toFixed(2); }).filter(function (b) { return Number(b) !== K.roundTo(x, 2); }); return p;
  }

  /* ---------------- RF6: a system with irrational solutions (rounded, then exact) ---------------- */
  function surdSys(r) {
    return pickWhere(function () { return { h: r.int(-3, 3), n: r.pick([2, 3, 5, 6, 7, 10, 11]), m: nz(r, 1, 4), k: r.int(-6, 6) }; },
      function (z) { var B1 = z.m - 2 * z.h, C0 = z.k + z.h * z.h - z.n; return Math.abs(B1) <= 9 && Math.abs(C0) <= 15 && !(z.h === 2 && z.n === 7 && z.m === 1 && z.k === 2) && !(z.h === 3 && z.n === 5) && !(z.h === 1 && z.n === 3); });
  }
  function surdSysText(s) {
    var Q = quad(1, s.m - 2 * s.h, s.k + s.h * s.h - s.n), Lp = lin(s.m, s.k), E = P.sub(Q, Lp), yc = s.m * s.h + s.k;
    return { Q: Q, Lp: Lp, E: E, yc: yc, eqs: t('y=' + tx(Q)) + ' and ' + t('y=' + tx(Lp)),
      pts: [{ x: s.h + Math.sqrt(s.n), y: yc + s.m * Math.sqrt(s.n), xt: surdT(s.h, 1, s.n), yt: surdT(yc, s.m, s.n) }, { x: s.h - Math.sqrt(s.n), y: yc - s.m * Math.sqrt(s.n), xt: surdT(s.h, -1, s.n), yt: surdT(yc, -s.m, s.n) }] };
  }

  /* ---------------- RF7: the grad committee / tutoring contexts ---------------- */
  function ctxShared(r) {
    return pickWhere(function () { var pm = r.int(2, 5), pc = r.int(2, 6), G = 10 * r.int(8, 30); return { pm: pm, pc: pc, G: G, it: r.pick([['muffins', 'coffees', 'm', 'c'], ['cookies', 'smoothies', 'k', 's'], ['bracelets', 'keychains', 'b', 'k']]) }; },
      function (z) { return z.pm !== z.pc && gcd(z.pm, z.pc) === 1 && z.G % z.pm === 0 && z.G % z.pc === 0 && !(z.pm === 2 && z.pc === 3 && z.G === 150); });
  }
  function ctxPts(r, s) { // one combination that falls short, one exactly on the boundary
    var on = pickWhere(function () { var a = r.int(1, s.G / s.pm - 1); return [a, (s.G - s.pm * a) / s.pc]; }, function (q) { return q[1] % 1 === 0 && q[1] > 0; });
    var off = pickWhere(function () { var a = r.int(1, s.G / s.pm - 1), b = r.int(1, s.G / s.pc - 1); return [a, b]; }, function (q) { var v = s.pm * q[0] + s.pc * q[1]; return v < s.G && v > 0.7 * s.G; });
    return r.chance(0.5) ? [off, on] : [on, off];
  }

  /* ---------------- RF8: a ball thrown from a platform ---------------- */
  function platShared(r) {
    return pickWhere(function () { var t1 = r.int(1, 3), t2 = r.int(t1 + 2, 7), H0 = r.pick([8, 10, 12, 15, 20, 25]); return { t1: t1, t2: t2, d: t1 + t2, b: 5 * (t1 + t2), H0: H0, Hh: H0 + 5 * t1 * t2 }; },
      function (z) { var D = z.b * z.b + 20 * z.H0, sd = Math.sqrt(D); return z.b <= 35 && Math.abs(sd - Math.round(sd)) > 1e-6 && !(z.H0 === 10 && z.t1 === 1 && z.t2 === 5); });
  }

  /* ---------------- MC: a linear inequality and four points ---------------- */
  function linPts(r, strict) {
    return pickWhere(function () {
      var Aa = nz(r, 1, 5), Bb = nz(r, 1, 5), x0 = r.int(-3, 5), y0 = r.int(-4, 3), C = Aa * x0 + Bb * y0;
      return { A: Aa, B: Bb, C: C, op: strict ? r.pick(['gt', 'lt']) : r.pick(['ge', 'le']), on: [[x0, y0], [x0 + Bb, y0 - Aa], [x0 - Bb, y0 + Aa]] };
    }, function (z) { return gcd(z.A, gcd(z.B, z.C)) === 1 && z.C !== 0 && Math.abs(z.C) <= 15 && z.on.every(function (p) { return Math.abs(p[0]) <= 8 && Math.abs(p[1]) <= 8; }); });
  }
  function linTex(z) { return tx(P.add(M(z.A, 'x', 1), M(z.B, 'y', 1))) + OPS[z.op] + z.C; }

  /* ---------------- MC: a region bounded by a parabola, shown ---------------- */
  function parRegion(r) {
    var s = pickWhere(function () { return { a: r.pick([1, 1, -1]), h: r.int(-2, 2), q: r.int(-5, 5), op: r.pick(['lt', 'le', 'gt', 'ge']) }; }, function (z) { return !(z.a === 1 && z.h === 0 && z.q === -4) && Math.abs(z.q) >= 1 && z.a * z.q < 0; });
    var Qp = P.add(P.scale(P.pow(lin(1, -s.h), 2), s.a), P.num(s.q)), f = function (x) { return at(Qp, x); };
    return { s: s, Qp: Qp, f: f };
  }

  var QUESTIONS = [
    { num: '1', section: 'Systems of equations', stem: 'Solve each system algebraically and verify.', outcome: RF6, parts: [
      { id: '1a', level: 'BEG', make: mk('lqSolve', { mode: 'basic' }) },
      { id: '1b', level: 'BEG', make: mk('lqSolve', { mode: 'std' }) },
      { id: '1c', level: 'EMG', make: mk('lqSolve', { mode: 'tangent' }) },
      { id: '1d', level: 'EMG', make: mk('lqSolve', { mode: 'none' }) }] },
    { num: '2', shared: surdSys, stem: function (s) { return 'Consider the system ' + surdSysText(s).eqs + '.'; }, outcome: RF6, parts: [
      { id: '2a', level: 'EMG', make: function (r, s) {
        var z = surdSysText(s), pts = z.pts.map(function (p) { return { x: p.x, y: p.y, xt: K.roundTo(p.x, 2).toFixed(2), yt: K.roundTo(p.y, 2).toFixed(2) }; });
        return A().pairsPart(CP, 'Solve the system with a graphing calculator, to the nearest hundredth.', pts, { dp: 2 },
          'Graph ' + t('Y_1=' + tx(z.Q)) + ' and ' + t('Y_2=' + tx(z.Lp)) + ' and use <b>intersect</b> twice: ' + pts.map(function (p) { return t('(' + p.xt + ',\\ ' + p.yt + ')'); }).join(' and ') + '.',
          ['Enter both equations as ' + t('Y_1') + ' and ' + t('Y_2') + '; use CALC → intersect near each crossing.', 'Round each coordinate to two decimal places.'], 'system: graphing calculator');
      } },
      { id: '2b', level: 'PRG', make: function (r, s) {
        var z = surdSysText(s), b1 = s.m - 2 * s.h - s.m, c0 = s.k + s.h * s.h - s.n - s.k;
        return A().pairsPart(CP, 'Determine the exact solution algebraically.', z.pts, {},
          'Substitute: ' + t(tx(z.E) + '=0') + '. It does not factor: ' + t('x=\\dfrac{' + vt(2 * s.h) + '\\pm\\sqrt{' + 4 * s.n + '}}{2}=' + surdT(s.h, 1, s.n, true)) + '.<br>' + t('y=' + tx(z.Lp)) + ' gives ' + t('y=' + surdT(z.yc, s.m, s.n, true)) + '.<br>' + z.pts.map(function (p) { return t('(' + p.xt + ',\\ ' + p.yt + ')'); }).join(' and ') + '.',
          ['Set the two expressions for ' + t('y') + ' equal and use the quadratic formula.', 'Find each ' + t('y') + ' from the linear equation (keep the radicals).'], 'system: exact solutions');
      } }] },
    { num: '3', stem: 'Solve each system.', outcome: RF6, parts: [
      { id: '3a', level: 'EMG', make: mk('qqSolve', { mode: 'basic' }) },
      { id: '3b', level: 'EMG', make: mk('qqSolve', { mode: 'cancel', kind: 'one' }) },
      { id: '3c', level: 'PRG', make: mk('qqSolve', { mode: 'mix' }) }] },
    { num: '4', outcome: RF6, parts: [{ id: '4', level: 'MAS', make: mk('tangentM') }] },
    { num: '5', outcome: RF6, parts: [{ id: '5', level: 'PRG', make: mk('numberPair') }] },
    { num: '6', outcome: RF6, parts: [{ id: '6', level: 'PRG', make: mk('twoBalls') }] },

    { num: '7', section: 'Inequalities in two variables', outcome: RF7, parts: [
      { id: '7a', level: 'BEG', make: mk('whichGraph') },
      { id: '7b', level: 'EMG', make: mk('bdMC') }] },
    { num: '8', outcome: RF7, parts: [{ id: '8', level: 'PRG', make: mk('writeLin', { words: false }) }] },
    { num: '9', outcome: RF7, parts: [{ id: '9', level: 'EMG', make: mk('whichGraph', { kind: 'quad' }) }] },
    { num: '10', outcome: RF7, parts: [{ id: '10', level: 'PRG', make: mk('writeQuad') }] },
    { num: '11', outcome: RF7, shared: function (r) { var s = ctxShared(r); s.pts = ctxPts(r, s); return s; },
      stem: function (s) { return 'A grad committee sells ' + s.it[0] + ' for ' + t('\\$' + s.pm) + ' and ' + s.it[1] + ' for ' + t('\\$' + s.pc) + '. It needs to raise at least ' + t('\\$' + s.G) + '. Let ' + t(s.it[2]) + ' be the number of ' + s.it[0] + ' and ' + t(s.it[3]) + ' the number of ' + s.it[1] + ' sold.'; }, parts: [
      { id: '11a', level: 'EMG', make: function (r, s) {
        var a = s.it[2], c = s.it[3], T = P.add(M(s.pm, a, 1), M(s.pc, c, 1), P.num(-s.G)), key = tx(P.add(M(s.pm, a, 1), M(s.pc, c, 1))) + '\\ge ' + s.G;
        return A().ineqPart(CP, 'Write an inequality for the situation. (Its restrictions are ' + t(a + '\\ge 0') + ', ' + t(c + '\\ge 0') + ', whole numbers.)', T, 'ge', key, { vars: [a, c], ph: s.pm + a + ' + ' + s.pc + c + ' >= ' + s.G, example: key, sideHint: '“At least” ' + t('\\$' + s.G) + ': the money raised is ' + t('\\ge ' + s.G) + '.', strictHint: '“At least” includes exactly ' + t('\\$' + s.G) + ': use ' + t('\\ge') + '.', boundHint: 'The money raised is ' + t(s.pm + a) + ' (from ' + s.it[0] + ') plus ' + t(s.pc + c) + ' (from ' + s.it[1] + ').' },
          t(key) + ', with ' + t(a + '\\ge 0') + ', ' + t(c + '\\ge 0') + ', ' + t(a) + ' and ' + t(c) + ' whole numbers.', ['Money from ' + s.it[0] + ' + money from ' + s.it[1] + ' is at least the goal.'], 'context: write the inequality');
      } },
      { id: '11b', level: 'EMG', make: function (r, s) {
        var rows = s.pts.map(function (p, i) { return { id: 'p' + i, html: p[0] + ' ' + s.it[0] + ' and ' + p[1] + ' ' + s.it[1] }; }), want = {};
        s.pts.forEach(function (p, i) { want['p' + i] = s.pm * p[0] + s.pc * p[1] >= s.G ? 'y' : 'n'; });
        return KP.grid('Is each combination enough to reach the goal?', rows, [{ id: 'y', html: 'Enough' }, { id: 'n', html: 'Not enough' }], want, { rowHead: 'Sales', why: function (row) { var p = s.pts[Number(row.slice(1))], v = s.pm * p[0] + s.pc * p[1]; return { code: CP + 'ctx-pt', hint: t(s.pm + '(' + p[0] + ')+' + s.pc + '(' + p[1] + ')=' + v) + (v >= s.G ? ': that reaches the goal (exactly ' + t('\\$' + s.G) + ' counts: “at least”).' : ': less than ' + t('\\$' + s.G) + '.') }; } },
          s.pts.map(function (p) { var v = s.pm * p[0] + s.pc * p[1]; return t(s.pm + '(' + p[0] + ')+' + s.pc + '(' + p[1] + ')=' + v) + (v >= s.G ? ' ≥ ' + s.G + ': enough' + (v === s.G ? ' (on the boundary)' : '') : ' < ' + s.G + ': not enough'); }).join('<br>'),
          ['Substitute each combination into the inequality.'], 'context: test combinations');
      } },
      { id: '11c', level: 'EMG', make: function (r, s) {
        return mc(r, 'Why is the boundary of the solution region solid, and why do only some points in the shaded region make sense?', [
          { html: 'Raising exactly ' + t('\\$' + s.G) + ' meets the goal (' + t('\\ge') + ' includes ' + t('=') + '), and only whole numbers of sales, none negative, are possible.', right: true },
          { html: 'The line is solid because the coefficients are positive, and points with large coordinates raise too much money.', why: 'Solid or dashed depends only on the inequality sign: ' + t('\\ge') + ' includes the boundary.', code: 'coef' },
          { html: 'The boundary is solid because ' + t('(0,\\ 0)') + ' is not a solution, and only points near the boundary make sense.', why: 'The test point decides which side is shaded, not whether the line is solid. Any whole-number point in the region works.', code: 'test' },
          { html: 'Raising exactly ' + t('\\$' + s.G) + ' does not meet the goal, so the boundary is solid; every point in the region makes sense.', why: '“At least” includes exactly ' + t('\\$' + s.G) + ', and you cannot sell a fraction of an item or a negative number.', code: 'all' }],
          'Exactly ' + t('\\$' + s.G) + ' meets the goal (' + t('\\ge') + ' includes ' + t('=') + '), so the line is solid. Only points with whole-number coordinates in the first quadrant make sense (no negative or partial sales).', ['Which inequality sign is used?', 'Can you sell 2.5 items, or −3?'], 'context: explain');
      } }] },

    { num: '12', section: 'Quadratic inequalities in one variable', stem: 'Solve. Write each solution in set notation.', outcome: RF8, parts: [
      { id: '12a', level: 'BEG', make: function (r) { var f = U.intFacs(r, { lo: -8, hi: 9, gap: 3, noZero: true, avoid: AV8 }), op = U.rndOp(r); return U.solvePart(CP, 1, f, op, U.exT(1, f, op)); } },
      { id: '12b', level: 'PRG', make: function (r) {
        var f = U.fracFacs(r, { qs: [2, 3, 5], pmax: 6, avoid: AV8, test: function (g) { var E = fpoly(1, g); return P.constant(E)[0] !== 0 && P.coef(E, { x: 1 })[0] !== 0; } }), op = U.rndOp(r), E = fpoly(1, f);
        var a2 = P.coef(E, { x: 2 }), b1 = P.coef(E, { x: 1 }), c0 = P.constant(E), show = tx(M(a2[0] / a2[1], 'x', 2)) + OPS[op] + seqT([[-c0[0] / c0[1], 0], [-b1[0] / b1[1], 1]]);
        return U.solvePart(CP, 1, f, op, show, { pre: 'Rearrange: ' + t(tx(E) + OPS[op] + '0') + '.<br>' });
      } },
      { id: '12c', level: 'EMG', make: function (r) {
        var n = pickWhere(function () { return r.int(2, 12); }, function (x) { return x !== 4; }), f = [[1, -n], [1, n]], op = U.rndOp(r);
        return U.solvePart(CP, -1, f, op, n * n + '-x^{2}' + OPS[op] + '0', { rev: true, pre: 'Multiply by ' + t('-1') + ' and reverse: ' + t('x^{2}-' + n * n + OPS[FLIP[op]] + '0') + '.<br>' });
      } },
      { id: '12d', level: 'EMG', make: function (r) { return U.noRootQ(CP, r, { a: [1, 2], ops: ['le', 'lt', 'gt', 'ge'] }); } },
      { id: '12e', level: 'EMG', make: function (r) { return U.sqQ(CP, r, { m: [1, 1, 2], ops: ['gt', 'gt', 'le', 'lt', 'ge'], avoid: AV8 }); } }] },
    { num: '13', outcome: RF8, shared: function (r) { return { f: U.fracFacs(r, { qs: [2, 3], pmax: 7, avoid: AV8 }), op: U.rndOp(r) }; }, stem: function (s) { return 'Solve ' + t(U.exT(-1, s.f, s.op)) + ' using a sign chart.'; }, parts: [
      { id: '13a', level: 'PRG', make: function (r, s) {
        return U.chartGrid(CP, 'Factor with the constant ' + t('-1') + ': ' + t(tx(fpoly(-1, s.f)) + '=' + facT(-1, s.f)) + '. Complete the product row of the sign chart.' + U.chartHtml(-1, s.f, 'x', true), -1, s.f, 'x',
          'Multiply the signs in each column, including the row for ' + t('-1') + ' (negative everywhere):' + U.chartHtml(-1, s.f, 'x'), ['The constant ' + t('-1') + ' is negative in every column.', 'At a zero the product is ' + t('0') + '.'], 'sign chart with a negative constant');
      } },
      { id: '13b', level: 'PRG', make: function (r, s) { return U.solvePart(CP, -1, s.f, s.op, U.exT(-1, s.f, s.op), { rev: true, prompt: 'Use the chart to solve ' + t(U.exT(-1, s.f, s.op)) + '.', pre: 'Multiply by ' + t('-1') + ' and reverse: ' + t(U.exT(1, s.f, FLIP[s.op])) + ' (the chart gives the same signs).<br>' }); } }] },
    { num: '14', outcome: RF8, shared: platShared, stem: function (s) { return 'A ball is thrown upward from a ' + t(s.H0) + ' m platform. Its height after ' + t('t') + ' seconds is ' + t('h=-5t^{2}+' + s.b + 't+' + s.H0) + ' metres.'; }, parts: [
      { id: '14a', sub: 'a i', level: 'PRG', make: function (r, s) {
        var T = SET.between(s.t1, s.t2, true);
        return U.setPart(CP, 'When is the ball at least ' + t(s.Hh) + ' m high? Write the times in set notation.', T, { v: 't', rev: true, revHint: 'Dividing by ' + t('-5') + ' reverses the sign: the ball is high <b>between</b> the two times.' },
          t('-5t^{2}+' + s.b + 't+' + s.H0 + '\\ge ' + s.Hh) + ', so ' + t('-5t^{2}+' + s.b + 't-' + (s.Hh - s.H0) + '\\ge 0') + '. Divide by ' + t('-5') + ' (reverse): ' + t('t^{2}-' + s.d + 't+' + s.t1 * s.t2 + '\\le 0') + ', ' + t('(t-' + s.t1 + ')(t-' + s.t2 + ')\\le 0') + ': ' + t(setTexX(T, 't')) + '.',
          ['Write ' + t('h\\ge ' + s.Hh) + ' and move every term to one side.', 'Divide by ' + t('-5') + ' (reverse the sign) and factor.'], 'height: when');
      } },
      { id: '14a2', sub: 'a ii', level: 'PRG', make: function (r, s) {
        var p = KP.number('For how long is it at least ' + t(s.Hh) + ' m high?', s.t2 - s.t1, function (v) { return near(v, s.t1) || near(v, s.t2) ? { code: CP + 'dur', hint: 'That is a time when it is exactly ' + s.Hh + ' m high. Subtract the two times.' } : null; },
          t(s.t2 + '-' + s.t1 + '=' + (s.t2 - s.t1)) + ' seconds.', ['Subtract the two times from (a i).'], 'height: how long', { after: 's' });
        p.bad = [String(s.t2), String(s.t1)].filter(function (b) { return Number(b) !== s.t2 - s.t1; });
        return p;
      } },
      { id: '14b', sub: 'b', level: 'MAS', make: function (r, s) {
        var D = s.b * s.b + 20 * s.H0, Tl = (s.b + Math.sqrt(D)) / 10, T = [sIv(s.d, Tl, false, true)];
        return U.roundSetPart(CP, 'When is the ball below the platform (until it lands)? Write the times in set notation, to the nearest hundredth of a second.', T, 2, { v: 't', alts: [[sIv(s.d, Tl, false, false)]],
          wrongs: [{ parts: SET.above(s.d, false), code: CP + 'ineq-restr', hint: 'Right inequality, but the ball stops when it lands: find when ' + t('h=0') + '.' }] },
          t('-5t^{2}+' + s.b + 't+' + s.H0 + '<' + s.H0) + ', so ' + t('5t(t-' + s.d + ')>0') + ': ' + t('t>' + s.d) + ' (for ' + t('t\\ge 0') + ').<br>It lands when ' + t('t^{2}-' + s.d + 't-' + dt(s.H0 / 5) + '=0') + ': ' + t('t=\\dfrac{' + s.b + '+\\sqrt{' + D + '}}{10}\\approx ' + Tl.toFixed(2)) + ' s.<br>Below the platform from ' + s.d + ' s until it lands: ' + t('\\{t\\mid ' + s.d + '<t\\le ' + Tl.toFixed(2) + '\\}') + '.',
          ['Below the platform: ' + t('h<' + s.H0) + '. Solve it for ' + t('t\\ge 0') + '.', 'The ball lands when ' + t('h=0') + ': use the quadratic formula, and stop there.'], 'below the platform, rounded');
      } }] },
    { num: '15', parts: [
      { id: '15a', level: 'EMG', outcome: RF7, make: function (r) {
        var b = nz(r, 1, 6), op = r.pick(['lt', 'gt', 'le', 'ge']), Qp = quad(1, b, 0), xp = pickWhere(function () { return nz(r, 1, 3); }, function (x) { return x !== -b; }), yp = 0, val = at(Qp, xp);
        if (val === 0) { xp = xp + 1; val = at(Qp, xp); }
        var tr = holds(yp - val, op);
        return mc(r, 'Why can ' + t('(0,\\ 0)') + ' not be used as a test point for ' + t('y' + OPS[op] + tx(Qp)) + ', and what can be done instead?', [
          { html: t('(0,\\ 0)') + ' is on the boundary parabola, so it does not show which side to shade. Use a point off the parabola, such as ' + t(ptT(xp, yp)) + ': ' + t('0' + OPS[op] + vt(val)) + ' is ' + (tr ? 'true, so shade its side.' : 'false, so shade the other side.'), right: true },
          { html: t('(0,\\ 0)') + ' makes the inequality false, and a test point must make it true. Use ' + t(ptT(xp, yp)) + '.', why: 'A test point may make the inequality false: then you shade the other side. The problem is that ' + t('(0,\\ 0)') + ' is <b>on</b> the boundary.', code: 'false' },
          { html: t('(0,\\ 0)') + ' is the vertex of the parabola, and a vertex can never be a test point.', why: 'The vertex is at ' + t('x=' + vt(-b / 2)) + ', not at the origin. The origin is a point on the parabola (' + t('0=0') + '), which is why it can’t be used.', code: 'vertex' },
          { html: t('(0,\\ 0)') + ' can be used: ' + t('0' + OPS[op] + '0') + ' decides the side.', why: 'On the boundary both sides give ' + t('0=0') + ': it cannot tell you which side to shade.', code: 'can' }],
          t('0=0^{2}+' + (b < 0 ? '(' + b + ')' : b) + '(0)') + ': ' + t('(0,\\ 0)') + ' is on the boundary, so it is neither inside nor outside the region. Use ' + t(ptT(xp, yp)) + ': ' + t('0' + OPS[op] + vt(val)) + ' is ' + (tr ? 'true' : 'false') + ', so shade ' + (tr ? 'the side containing it' : 'the other side') + '.',
          ['Substitute ' + t('(0,\\ 0)') + ' into the boundary ' + t('y=' + tx(Qp)) + '.'], 'test point on the boundary');
      } },
      { id: '15b', level: 'BEG', outcome: RF8, make: function (r) {
        var n = pickWhere(function () { return nz(r, 1, 8); }, function (x) { return x !== 3 && x !== -3; }), f = [[1, 0], [1, -n]], op = U.rndOp(r, ['lt', 'gt', 'le']);
        return U.solvePart(CP, 1, f, op, U.exT(1, f, op), { prompt: 'Unlike ' + t('y' + OPS[op] + tx(quad(1, n, 0))) + ' (a region of points), ' + t(U.exT(1, f, op)) + ' has one variable: its solution is a set of ' + t('x') + '-values. Solve ' + t(U.exT(1, f, op)) + '.' });
      } }] },

    { num: '16', section: 'Multiple choice and numerical response', outcome: RF6, parts: [{ id: '16', level: 'BEG', make: mk('lqCount') }] },
    { num: '17', outcome: RF6, parts: [{ id: '17', level: 'EMG', make: function (r) {
      var s = pickWhere(function () { return { a: r.pick([1, 2, 3, -1, -2]), b: nz(r, 1, 6), c: r.int(-6, 6), d: nz(r, 1, 6), form: r.pick(['sum', 'diff']) }; }, function (z) { return Math.abs(z.b) !== 1 && z.c !== 0 && !(z.a === 2 && z.b === -3 && z.c === 1 && z.d === 4); });
      var sign = s.form === 'sum' ? -1 : 1; // y = sign·x + d
      var lineT = s.form === 'sum' ? 'x+y=' + s.d : 'y-x=' + s.d;
      var R0 = quad(s.a, s.b - sign, s.c - s.d), W1 = quad(s.a, s.b + sign, s.c + s.d), W2 = quad(s.a, s.b - sign, s.c + s.d), W3 = quad(s.a, s.b + sign, s.c - s.d);
      var yT = 'y=' + tx(lin(sign, s.d));
      return mc(r, 'When the system ' + t('y=' + tx(quad(s.a, s.b, s.c))) + ' and ' + t(lineT) + ' is solved by substitution, the quadratic equation that results is', [
        { html: t(tx(R0) + '=0'), right: true }, { html: t(tx(W1) + '=0'), why: 'The line gives ' + t(yT) + '; check the signs when you move every term to one side.', code: 'both' },
        { html: t(tx(W2) + '=0'), why: 'Check the constant: subtract ' + t(s.d) + ' from both sides.', code: 'const' }, { html: t(tx(W3) + '=0'), why: 'Check the ' + t('x') + '-term: ' + t(yT) + '.', code: 'xterm' }],
        t(yT) + ', so ' + t(tx(quad(s.a, s.b, s.c)) + '=' + tx(lin(sign, s.d))) + ' and ' + t(tx(R0) + '=0') + '.', ['Solve the linear equation for ' + t('y') + ' first.', 'Set the two expressions for ' + t('y') + ' equal and move every term to the left.'], 'MC: the equation after substitution');
    } }] },
    { num: '18', outcome: RF6, parts: [{ id: '18', level: 'PRG', make: function (r) {
      var s = pickWhere(function () { return { b: r.int(-5, 5), c: r.int(-8, 4), m: nz(r, 1, 4), k: r.int(-5, 6) }; }, function (z) { var B1 = z.b - z.m, C0 = z.c - z.k, D = B1 * B1 - 4 * C0, sd = Math.sqrt(D); return C0 < 0 && (-B1 + sd) / 2 < 9.99 && Math.abs(sd - Math.round(sd)) > 1e-6 && !(z.b === 1 && z.c === -4 && z.m === 2 && z.k === 1); });
      var B1 = s.b - s.m, C0 = s.c - s.k, D = B1 * B1 - 4 * C0, x = (-B1 + Math.sqrt(D)) / 2, xn = (-B1 - Math.sqrt(D)) / 2;
      return apxNr('To the nearest hundredth, the positive ' + t('x') + '-coordinate of a solution of the system ' + t('y=' + tx(quad(1, s.b, s.c))) + ' and ' + t('y=' + tx(lin(s.m, s.k))) + ' is ______.', x,
        function (v) { if (near(v, K.roundTo(Math.abs(xn), 2))) return { code: CP + 'neg-root', hint: 'That is the other root without its minus sign. Use ' + t('+\\sqrt{\\ }') + ' in the quadratic formula.' }; if (near(v, K.roundTo(s.m * x + s.k, 2))) return { code: CP + 'y-coord', hint: 'That is the ' + t('y') + '-coordinate. The question asks for ' + t('x') + '.' }; return null; },
        t(tx(quad(1, B1, C0)) + '=0') + ': ' + t('x=\\dfrac{' + vt(-B1) + '\\pm\\sqrt{' + D + '}}{2}') + '. Positive: ' + t('\\dfrac{' + vt(-B1) + '+\\sqrt{' + D + '}}{2}\\approx ' + x.toFixed(2)) + '.', ['Set the two expressions for ' + t('y') + ' equal and use the quadratic formula.'], 'NR: positive x-coordinate', [Math.abs(xn), s.m * x + s.k]);
    } }] },
    { num: '19', outcome: RF7, parts: [{ id: '19', level: 'EMG', make: function (r) {
      var z = linPts(r, false), val = function (p) { return z.A * p[0] + z.B * p[1]; }, up = upOp(z.op);
      var inn = pickWhere(function () { return [r.int(-5, 6), r.int(-5, 5)]; }, function (p) { return up ? val(p) > z.C : val(p) < z.C; }), out = pickWhere(function () { return [r.int(-5, 6), r.int(-5, 5)]; }, function (p) { return up ? val(p) < z.C : val(p) > z.C; });
      var why = function (p) { return t(z.A + '(' + p[0] + ')' + (z.B < 0 ? '' : '+') + z.B + '(' + p[1] + ')=' + val(p)) + (val(p) === z.C ? ', on the solid boundary (included).' : ', which satisfies the inequality.'); };
      return mc(r, 'The point that is <b>not</b> in the solution region of ' + t(linTex(z)) + ' is', [{ html: t(ptT(out[0], out[1])), right: true },
        { html: t(ptT(z.on[0][0], z.on[0][1])), why: why(z.on[0]), code: 'on1' }, { html: t(ptT(z.on[1][0], z.on[1][1])), why: why(z.on[1]), code: 'on2' }, { html: t(ptT(inn[0], inn[1])), why: why(inn), code: 'in' }],
        t(z.A + '(' + out[0] + ')' + (z.B < 0 ? '' : '+') + z.B + '(' + out[1] + ')=' + val(out)) + ', and ' + t(val(out) + OPS[z.op] + z.C) + ' is false. (Two of the other points are on the solid boundary, so they are included.)', ['Substitute each point.', 'A point on a solid boundary is in the solution region.'], 'MC: a point not in the region');
    } }] },
    { num: '20', outcome: RF7, parts: [{ id: '20', level: 'EMG', make: function (r) {
      var g = parRegion(r), s = g.s, solid = !strictOp(s.op), above = upOp(s.op), lo = Math.min(-5, s.q - 2), hi = Math.max(5, s.q + 2);
      var svg = A().regionSvg({ x: [-5, 5], y: [lo, hi], max: 220, curves: [{ f: g.f, dash: !solid }], shade: { f: g.f, side: above ? 'above' : 'below' }, aria: 'shaded region' });
      var opts = ['lt', 'gt', 'le', 'ge'].map(function (o) { var right = o === s.op; return { html: t('y' + OPS[o] + tx(g.Qp)), right: right, code: o, why: right ? null : (strictOp(o) !== strictOp(s.op) ? 'The boundary is ' + (solid ? 'solid: points on it are included (' + t('\\le') + ' or ' + t('\\ge') + ').' : 'dashed: points on it are not included (' + t('<') + ' or ' + t('>') + ').') : '') + (upOp(o) !== above ? ' The shaded region is ' + (above ? 'above' : 'below') + ' the parabola.' : '') }; });
      return mc(r, 'The boundary of the shaded region is the parabola ' + t('y=' + tx(g.Qp)) + '. The region is the solution of' + fig(svg), opts,
        'The boundary is ' + (solid ? 'solid (included)' : 'dashed (not included)') + ' and the region is ' + (above ? 'above' : 'below') + ' the parabola: ' + t('y' + OPS[s.op] + tx(g.Qp)) + '.', ['Solid → ' + t('\\le') + ' or ' + t('\\ge') + '; dashed → ' + t('<') + ' or ' + t('>') + '.', 'Above the parabola → ' + t('y>') + '; below → ' + t('y<') + '.'], 'MC: inequality of a region', true);
    } }] },
    { num: '21', outcome: RF8, parts: [{ id: '21', level: 'BEG', make: function (r) {
      var f = U.intFacs(r, { lo: -8, hi: 8, gap: 3, noZero: true, noOpp: true, avoid: AV8 }), op = U.rndOp(r, ['ge', 'gt']), neg = [[1, -f[1][1]], [1, -f[0][1]]];
      return U.mcSet(r, 'The solution of ' + t(U.exT(1, f, op)) + ' is', facSet(1, f, op), [{ T: facSet(1, f, FLIP[op]), why: 'Positive (' + t(OPS[op].trim() + '0') + ') is <b>outside</b> the zeros.', code: 'side' }, { T: facSet(1, neg, FLIP[op]), why: 'Check the signs of the zeros, and outside vs between.', code: 'both' }, { T: facSet(1, neg, op), why: 'Check the signs of the zeros: ' + t(facT(1, f) + '=0') + '.', code: 'sign' }],
        t(facT(1, f) + OPS[op] + '0') + ': positive outside the zeros ' + t(f[0][1]) + ' and ' + t(f[1][1]) + ': ' + t(setTexX(facSet(1, f, op))) + '.', ['Factor and find the zeros.', 'With a positive leading coefficient, the expression is positive outside the zeros.'], 'MC: solve');
    } }] },
    { num: '22', outcome: RF8, parts: [{ id: '22', level: 'PRG', make: function (r) { var p = B().countInts(r, CP); p.input.nr = true; return p; } }] },
    { num: '23', outcome: RF8, parts: [{ id: '23', level: 'PRG', make: mk('signRow') }] },
    { num: '24', outcome: RF7, parts: [{ id: '24', level: 'ADV', make: function (r) {
      var s, f1, f2, pick;
      pickWhere(function () {
        s = { a: r.int(1, 6), b: r.int(-1, 5) }; if (s.a === 4 && s.b === 2) return null;
        f1 = function (p) { return p[1] > p[0] * p[0] - s.a; }; f2 = function (p) { return p[1] < p[0] + s.b; };
        var pts = []; for (var x = -4; x <= 4; x++) for (var y = -5; y <= 7; y++) pts.push([x, y]);
        var good = r.shuffle(pts.filter(function (p) { return f1(p) && f2(p); })), n1 = r.shuffle(pts.filter(function (p) { return !f1(p) && f2(p); })), n2 = r.shuffle(pts.filter(function (p) { return f1(p) && !f2(p); })), n3 = r.shuffle(pts.filter(function (p) { return !f1(p) && !f2(p); }));
        if (!good.length || n1.length < 2 || !n2.length) return null;
        pick = [good[0], n1[0], n2[0], n3.length ? n3[0] : n1[1]]; return pick;
      }, function (q) { return !!q; });
      var chk = function (p) { return t(vt(p[1]) + '>' + vt(p[0] * p[0] - s.a)) + (f1(p) ? ' ✓' : ' ✗') + ' and ' + t(vt(p[1]) + '<' + vt(p[0] + s.b)) + (f2(p) ? ' ✓' : ' ✗'); };
      var opts = pick.map(function (p, i) { return { html: t(ptT(p[0], p[1])), right: i === 0, why: i === 0 ? null : 'Check both: ' + chk(p) + '.', code: 'p' + i }; });
      return mc(r, 'Which point is in the solution regions of <b>both</b> ' + t('y>' + tx(quad(1, 0, -s.a))) + ' and ' + t('y<' + tx(lin(1, s.b))) + '?', opts, t(ptT(pick[0][0], pick[0][1])) + ': ' + chk(pick[0]) + '.', ['Substitute each point into both inequalities.', 'It must make both true.'], 'MC: a point in two regions');
    } }] },
    { num: '25', outcome: RF8, parts: [{ id: '25', level: 'ADV', make: function (r) { return profitNr(r, false); } }] },
    { num: '26', outcome: RF6, parts: [{ id: '26', level: 'ADV', make: function (r) {
      var s = pickWhere(function () { return { sq: r.int(2, 5), q: nz(r, 1, 6), neg: r.chance(0.3) }; }, function (z) { var d = z.sq * z.sq - z.q; return d !== 0 && Math.abs(d) <= 25 && !(z.sq === 2 && z.q === 1); });
      var d = s.sq * s.sq - s.q, k = (s.neg ? -2 : 2) * s.sq, sg = s.neg ? -1 : 1;
      var opts = [{ html: t(k), right: true }, { html: t(sg * s.sq), why: 'Tangent when ' + t('k^{2}-' + 4 * s.sq * s.sq + '=0') + ': ' + t('k=\\pm' + 2 * s.sq) + '.', code: 'half' }, { html: t(sg * 4 * s.sq), why: t('k^{2}=' + 4 * s.sq * s.sq) + ', so ' + t('k=\\pm' + 2 * s.sq) + '.', code: 'dbl' }, { html: t(sg * 4 * s.sq * s.sq), why: 'That is ' + t('k^{2}') + '. Take the square root.', code: 'sq' }];
      return mc(r, 'The line ' + t('y=kx' + (s.q < 0 ? '+' + (-s.q) : '-' + s.q)) + ' is tangent to the parabola ' + t('y=' + tx(quad(1, 0, d))) + '. A possible value of ' + t('k') + ' is', opts,
        t(tx(quad(1, 0, d)) + '=kx' + (s.q < 0 ? '+' + (-s.q) : '-' + s.q)) + ', so ' + t('x^{2}-kx+' + s.sq * s.sq + '=0') + '. Tangent (one solution): ' + t('k^{2}-4(' + s.sq * s.sq + ')=0') + ', ' + t('k=\\pm' + 2 * s.sq) + '.', ['Substitute and write one quadratic equation in ' + t('x') + '.', 'Tangent: one solution, so ' + t('b^{2}-4ac=0') + '.'], 'MC: tangent line', true);
    } }] },
    { num: '27', outcome: RF6, parts: [{ id: '27', level: 'ADV', make: function (r) {
      var s = pickWhere(function () { return { x1: r.int(-4, 1), x2: r.int(1, 5), b1: r.int(-5, 5), c1: r.int(-6, 6) }; }, function (z) {
        if (z.x2 <= z.x1) return false; var f = function (x) { return x * x + z.b1 * x + z.c1; }, S = z.x1 + f(z.x1) + z.x2 + f(z.x2); return S >= 1 && S <= 99 && !(z.x1 === -1 && z.x2 === 4 && z.b1 === -2 && z.c1 === -3);
      });
      var f = function (x) { return x * x + s.b1 * x + s.c1; }, b2 = s.b1 + 2 * (s.x1 + s.x2), c2 = s.c1 - 2 * s.x1 * s.x2, y1 = f(s.x1), y2 = f(s.x2), S = s.x1 + y1 + s.x2 + y2;
      return nrPart('The parabolas ' + t('y=' + tx(quad(1, s.b1, s.c1))) + ' and ' + t('y=' + tx(quad(-1, b2, c2))) + ' intersect at ' + t('(a,\\ b)') + ' and ' + t('(c,\\ d)') + '. The value of ' + t('a+b+c+d') + ' is ______.', S,
        function (v) { return near(v, s.x1 + s.x2) || near(v, y1 + y2) ? { code: CP + 'sum', hint: 'Add all four coordinates: both ' + t('x') + '-values and both ' + t('y') + '-values.' } : null; },
        t(tx(quad(2, s.b1 - b2, s.c1 - c2)) + '=0') + ', so ' + t(tx(quad(1, (s.b1 - b2) / 2, (s.c1 - c2) / 2)) + '=0') + ' and ' + t(facT(1, [[1, s.x1], [1, s.x2]]) + '=0') + '. Points ' + t(ptT(s.x1, y1)) + ' and ' + t(ptT(s.x2, y2)) + '.<br>' + t(vt(s.x1) + '+' + par(y1) + '+' + vt(s.x2) + '+' + par(y2) + '=' + S),
        ['Set the right sides equal, collect terms and factor.', 'Find each ' + t('y') + ', then add all four coordinates.'], 'NR: a + b + c + d', [s.x1 + s.x2, y1 + y2, S + 1]);
    } }] }
  ];

  /* the least number of items for no loss (P ≥ 0) or a profit (P > 0) */
  function profitNr(r, strict) {
    var s = pickWhere(function () { return { a: r.pick([0.5, 1, 2, 0.25, 4]), n1: r.int(5, 30), w: r.int(6, 40) }; }, function (z) {
      var n2 = z.n1 + z.w, b = z.a * (z.n1 + n2), c = z.a * z.n1 * n2; return b % 1 === 0 && Math.abs(c * 4 - Math.round(c * 4)) < 1e-9 && c <= 5000 && !(z.a === 0.5 && z.n1 === 20 && n2 === 60) && !(z.a === 2 && z.n1 === 8 && n2 === 22);
    });
    var n2 = s.n1 + s.w, b = s.a * (s.n1 + n2), c = s.a * s.n1 * n2, ans = strict ? s.n1 + 1 : s.n1, aT = dt(s.a);
    var P0 = '-' + (s.a === 1 ? '' : aT) + 'n^{2}+' + dt(b) + 'n-' + dt(c);
    return nrPart('A craft business makes and sells ' + t('n') + ' items a week. Its weekly profit, in dollars, is ' + t('P=' + P0) + '. The least number of items it must sell ' + (strict ? 'to make a profit (' + t('P>0') + ')' : 'so that it does not lose money (' + t('P\\ge 0') + ')') + ' is ______.', ans,
      function (v) { return near(v, strict ? s.n1 : s.n1 + 1) ? { code: CP + 'ends', hint: strict ? 'At ' + t('n=' + s.n1) + ' the profit is exactly ' + t('0') + ': that is not a profit. Use the next whole number.' : 'At ' + t('n=' + s.n1) + ' the profit is ' + t('0') + ', which counts as not losing money.' } : near(v, n2) ? { code: CP + 'ends', hint: 'That is the greatest number, at the other end. The least is the smaller root.' } : null; },
      t(P0 + (strict ? '>0' : '\\ge 0')) + '. Divide by ' + t('-' + aT) + ' (reverse): ' + t('n^{2}-' + (s.n1 + n2) + 'n+' + s.n1 * n2 + (strict ? '<0' : '\\le 0')) + ', ' + t('(n-' + s.n1 + ')(n-' + n2 + ')' + (strict ? '<0' : '\\le 0')) + ': ' + t(s.n1 + (strict ? '<' : '\\le ') + 'n' + (strict ? '<' : '\\le ') + n2) + '. Least whole number: <b>' + ans + '</b>.',
      ['Write the inequality, divide by the negative leading coefficient (reverse the sign) and factor.', 'The solution is between the roots; ' + (strict ? 'the roots themselves give a profit of 0.' : 'the roots are included.')], 'NR: least number of items', [strict ? s.n1 : s.n1 + 1, n2]);
  }

  /* ======================================================================================================
   * Extra Practice 8 — a second practice test
   * ====================================================================================================== */
  var EXTRA = [
    { num: '1', section: 'A. Multiple Choice', outcome: RF6, parts: [{ id: 'E1', level: 'BEG', make: mk('lqCount') }] },
    { num: '2', outcome: RF6, parts: [{ id: 'E2', level: 'BEG', make: function (r) {
      var s = pickWhere(function () { return { r1: r.int(-5, 5), r2: r.int(-5, 5), m: nz(r, 1, 3), k: r.int(-4, 4) }; }, function (z) { return z.r1 < z.r2 && z.r1 !== -z.r2 && z.r1 !== 0 && z.r2 !== 0 && !(z.r1 === -1 && z.r2 === 2 && z.m === 1 && z.k === 1); });
      var Lp = lin(s.m, s.k), Q = P.add(P.mul(lin(1, -s.r1), lin(1, -s.r2)), Lp), y = function (x) { return s.m * x + s.k; };
      var pr = function (L) { return L.map(function (x) { return t(ptT(x, y(x))); }).join(' and '); };
      return mc(r, 'The solution of the system ' + t('y=' + tx(Q)) + ' and ' + t('y=' + tx(Lp)) + ' is', [
        { html: pr([s.r1, s.r2]), right: true }, { html: pr([-s.r2, -s.r1]), why: 'Check the signs of the roots: ' + t('(x-a)=0') + ' gives ' + t('x=a') + '.', code: 'sign' },
        { html: pr([s.r1]) + ' only', why: 'The quadratic equation has two roots, and each gives a solution.', code: 'one1' }, { html: pr([s.r2]) + ' only', why: 'The quadratic equation has two roots, and each gives a solution.', code: 'one2' }],
        t(tx(Q) + '=' + tx(Lp)) + ', so ' + t(tx(P.mul(lin(1, -s.r1), lin(1, -s.r2))) + '=0') + ', ' + t(facT(1, [[1, s.r1], [1, s.r2]]) + '=0') + ': ' + pr([s.r1, s.r2]) + '.', ['Set the right sides equal and solve.', 'Find each ' + t('y') + ' from the line.'], 'MC: solve a system');
    } }] },
    { num: '3', outcome: RF6, parts: [{ id: 'E3', level: 'EMG', make: function (r) {
      var s = pickWhere(function () { return { b1: r.int(-6, 6), c1: r.int(-8, 8), b2: r.int(-6, 6), x0: nz(r, 1, 4) }; }, function (z) { var c2 = z.c1 + (z.b1 - z.b2) * z.x0; return z.b1 !== z.b2 && Math.abs(c2) <= 12 && !(z.b1 === 3 && z.c1 === -2 && z.b2 === -1); });
      var c2 = s.c1 + (s.b1 - s.b2) * s.x0, Q1 = quad(1, s.b1, s.c1), Q2 = quad(1, s.b2, c2), y0 = at(Q1, s.x0), yw = at(Q1, -s.x0);
      return mc(r, 'The system ' + t('y=' + tx(Q1)) + ' and ' + t('y=' + tx(Q2)) + ' has', [{ html: 'no solution', why: 'The ' + t('x^{2}') + '-terms cancel, but a linear equation remains, with one root.', code: 'none' },
        { html: 'the solution ' + t(ptT(s.x0, y0)), right: true }, { html: 'the solution ' + t(ptT(-s.x0, yw)), why: 'Check the sign when you solve ' + t(tx(lin(s.b1 - s.b2, s.c1 - c2)) + '=0') + '.', code: 'sign' },
        { html: 'infinitely many solutions', why: 'The equations are different parabolas: they meet only where ' + t(tx(lin(s.b1 - s.b2, s.c1 - c2)) + '=0') + '.', code: 'inf' }],
        'The ' + t('x^{2}') + '-terms cancel: ' + t(tx(lin(s.b1, s.c1)) + '=' + tx(lin(s.b2, c2))) + ', so ' + t('x=' + s.x0) + ' and ' + t('y=' + vt(y0)) + ': ' + t(ptT(s.x0, y0)) + '.', ['Set the right sides equal.'], 'MC: x²-terms cancel', true);
    } }] },
    { num: '4', outcome: RF6, parts: [{ id: 'E4', level: 'PRG', make: function (r) {
      var m = 2 * pickWhere(function () { return nz(r, 1, 4); }, function (x) { return x !== 2; }), k = -(m / 2) * (m / 2);
      return mc(r, 'The line ' + t('y=' + coefT(m) + 'x+k') + ' is tangent to the parabola ' + t('y=x^{2}') + ' when ' + t('k') + ' is', [{ html: t(-k), why: 'Tangent when ' + t(m * m + '+4k=0') + ': ' + t('k') + ' is negative.', code: 'pos' }, { html: t(k), right: true }, { html: t(m * m), why: 'Solve ' + t(m * m + '+4k=0') + ' for ' + t('k') + '.', code: 'msq' }, { html: t(-m * m), why: 'Divide by ' + t('4') + ': ' + t('4k=-' + m * m) + '.', code: 'nodiv' }],
        t('x^{2}=' + coefT(m) + 'x+k') + ', so ' + t('x^{2}' + (m > 0 ? '-' : '+') + Math.abs(m) + 'x-k=0') + '. Tangent: ' + t('(' + -m + ')^{2}-4(1)(-k)=0') + ', ' + t(m * m + '+4k=0') + ', ' + t('k=' + k) + ' (point ' + t(ptT(m / 2, m * m / 4)) + ').', ['Tangent: one solution, so the discriminant is ' + t('0') + '.'], 'MC: tangent', true);
    } }] },
    { num: '5', outcome: RF7, parts: [{ id: 'E5', level: 'EMG', make: function (r) {
      var z = linPts(r, true), val = function (p) { return z.A * p[0] + z.B * p[1]; }, up = upOp(z.op);
      var inn = pickWhere(function () { return [r.int(-4, 5), r.int(-4, 5)]; }, function (p) { return up ? val(p) > z.C : val(p) < z.C; }), outs = [];
      while (outs.length < 2) { var q = [r.int(-4, 5), r.int(-4, 5)]; if ((up ? val(q) < z.C : val(q) > z.C) && !outs.some(function (o) { return o[0] === q[0] && o[1] === q[1]; })) outs.push(q); }
      return mc(r, 'The point that is in the solution region of ' + t(linTex(z)) + ' is', [{ html: t(ptT(inn[0], inn[1])), right: true },
        { html: t(ptT(z.on[0][0], z.on[0][1])), why: 'It gives ' + t(val(z.on[0])) + ': on the <b>dashed</b> boundary, so not included.', code: 'on' }, { html: t(ptT(outs[0][0], outs[0][1])), why: 'It gives ' + t(val(outs[0])) + ', and ' + t(val(outs[0]) + OPS[z.op] + z.C) + ' is false.', code: 'o1' }, { html: t(ptT(outs[1][0], outs[1][1])), why: 'It gives ' + t(val(outs[1])) + ', and ' + t(val(outs[1]) + OPS[z.op] + z.C) + ' is false.', code: 'o2' }],
        t(z.A + '(' + inn[0] + ')' + (z.B < 0 ? '' : '+') + z.B + '(' + inn[1] + ')=' + val(inn)) + ', and ' + t(val(inn) + OPS[z.op] + z.C) + ' ✓. A point on the boundary gives exactly ' + t(z.C) + ': not included for ' + t(OPS[z.op].trim()) + '.', ['Substitute each point.', 'For ' + t('<') + ' or ' + t('>') + ' the boundary is not included.'], 'MC: a point in the region');
    } }] },
    { num: '6', outcome: RF7, parts: [{ id: 'E6', level: 'PRG', make: function (r) {
      var s = pickWhere(function () { return { a: nz(r, 2, 5), b: nz(r, 2, 5), org: r.chance(0.6) }; }, function (z) { return Math.abs(z.a) !== Math.abs(z.b) && !(z.a === 3 && z.b === -2); });
      // the line through (a, 0) and (0, b): b·x + a·y = a·b (reduced)
      var g = gcd(s.b, gcd(s.a, s.a * s.b)), Ac = s.b / g, Bc = s.a / g, C = s.a * s.b / g;
      if (C < 0) { Ac = -Ac; Bc = -Bc; C = -C; }
      var op = s.org ? 'lt' : 'gt', f = function (x) { return (C - Ac * x) / Bc; }, above = (Bc > 0) === (op === 'gt');
      var svg = A().regionSvg({ x: [-6, 6], y: [-6, 6], max: 220, curves: [{ f: f, dash: true }], shade: { f: f, side: above ? 'above' : 'below' }, aria: 'shaded region' });
      var L = function (a1, b1) { return tx(P.add(M(a1, 'x', 1), M(b1, 'y', 1))); };
      return mc(r, 'The dashed boundary passes through ' + t(ptT(0, s.b)) + ' and ' + t(ptT(s.a, 0)) + '. The shaded region is the solution of' + fig(svg), [
        { html: t(L(Ac, Bc) + OPS[op] + C), right: true }, { html: t(L(Ac, Bc) + OPS[FLIP[op]] + C), why: 'Test ' + t('(0,\\ 0)') + ': the shaded side ' + (s.org ? 'contains' : 'does not contain') + ' the origin.', code: 'side' },
        { html: t(L(Ac, Bc) + OPS[op === 'lt' ? 'le' : 'ge'] + C), why: 'The boundary is dashed: use ' + t('<') + ' or ' + t('>') + '.', code: 'solid' }, { html: t(L(Bc, Ac) + OPS[op] + C), why: 'Check the boundary: substitute ' + t(ptT(s.a, 0)) + ' and ' + t(ptT(0, s.b)) + '.', code: 'swap' }],
        'The line ' + t(L(Ac, Bc) + '=' + C) + ' passes through both points. It is dashed, and the shaded side ' + (s.org ? 'contains' : 'does not contain') + ' ' + t('(0,\\ 0)') + ': ' + t('0' + OPS[op] + C) + ' is ' + (s.org ? 'true' : 'false') + '. So ' + t(L(Ac, Bc) + OPS[op] + C) + '.', ['Check which line passes through both points.', 'Dashed: ' + t('<') + ' or ' + t('>') + '. Test the origin to choose the sign.'], 'MC: inequality of a region');
    } }] },
    { num: '7', outcome: RF7, parts: [{ id: 'E7', level: 'EMG', make: function (r) {
      var s = pickWhere(function () { return { b: nz(r, 1, 6), c: r.int(-4, 4), x0: r.int(-3, 3), op: r.pick(['ge', 'le', 'gt', 'lt']) }; }, function (z) { return !(z.b === -5 && z.c === 0); });
      var Qp = quad(1, s.b, s.c), f = function (x) { return at(Qp, x); }, y0 = f(s.x0);
      var offs = []; while (offs.length < 3) { var q = [r.int(-3, 5), r.int(-4, 6)]; if (f(q[0]) !== q[1] && !offs.some(function (o) { return o[0] === q[0] && o[1] === q[1]; })) offs.push(q); }
      return mc(r, 'Which point <b>cannot</b> be used as a test point to graph ' + t('y' + OPS[s.op] + tx(Qp)) + '?', [{ html: t(ptT(s.x0, y0)), right: true }].concat(offs.map(function (p, i) { return { html: t(ptT(p[0], p[1])), why: t(ptT(p[0], p[1])) + ' is not on the parabola (' + t(vt(f(p[0]))) + ' ≠ ' + t(vt(p[1])) + '), so it can be a test point.', code: 'off' + i }; })),
        t(ptT(s.x0, y0)) + ' is on the parabola: ' + t(vt(y0) + '=' + vt(f(s.x0))) + '. A point on the boundary does not show which side to shade.', ['Substitute each point into ' + t('y=' + tx(Qp)) + '.', 'A test point must not be on the boundary.'], 'MC: a test point on the boundary');
    } }] },
    { num: '8', outcome: RF8, parts: [{ id: 'E8', level: 'BEG', make: function (r) {
      var f = U.intFacs(r, { lo: -8, hi: 8, gap: 3, noZero: true, noOpp: true, avoid: AV8 }), op = U.rndOp(r, ['lt', 'le']), neg = [[1, -f[1][1]], [1, -f[0][1]]];
      return U.mcSet(r, 'The solution of ' + t(U.exT(1, f, op)) + ' is', facSet(1, f, op), [{ T: facSet(1, neg, op), why: 'Check the signs of the zeros: ' + t(facT(1, f) + '=0') + '.', code: 'sign' }, { T: facSet(1, neg, FLIP[op]), why: 'Check the zeros, and between vs outside.', code: 'both' }, { T: facSet(1, f, FLIP[op]), why: 'Negative (' + t(OPS[op].trim() + '0') + ') is <b>between</b> the zeros.', code: 'side' }],
        t(facT(1, f) + OPS[op] + '0') + ': negative between the zeros: ' + t(setTexX(facSet(1, f, op))) + '.', ['Factor and find the zeros.', 'Positive leading coefficient: negative between the zeros.'], 'MC: solve');
    } }] },
    { num: '9', outcome: RF8, parts: [{ id: 'E9', level: 'EMG', make: function (r) {
      var f = U.intFacs(r, { lo: -6, hi: 6, gap: 3, maxGap: 9, noZero: true, noOpp: true, avoid: AV8 }), out = r.chance(0.6), inc = r.chance(0.6), rts = rootsOf(f);
      var op = out ? (inc ? 'ge' : 'gt') : (inc ? 'le' : 'lt'), op2 = out ? (inc ? 'le' : 'lt') : (inc ? 'ge' : 'gt'), T = facSet(1, f, op), g = [[1, -f[1][1]], [1, -f[0][1]]];
      return mc(r, 'The solution shown on the number line is the solution of' + U.nlSvg(T, Math.floor(rts[0]) - 3, Math.ceil(rts[1]) + 3, rts.concat(rts[0] < 0 && rts[1] > 0 ? [0] : [])), [
        { html: t(facT(1, f) + OPS[op2] + '0'), why: 'That is the region ' + (out ? 'between' : 'outside') + ' the zeros.', code: 'side' }, { html: t(facT(1, g) + OPS[op] + '0'), why: 'Its zeros are ' + t(g[0][1]) + ' and ' + t(g[1][1]) + '.', code: 'sign' },
        { html: t(facT(1, f) + OPS[op] + '0'), right: true }, { html: t(facT(1, g) + OPS[op2] + '0'), why: 'Check the zeros and the side.', code: 'both' }],
        (inc ? 'Closed' : 'Open') + ' dots at ' + t(f[0][1]) + ' and ' + t(f[1][1]) + ', shaded ' + (out ? 'outside' : 'between') + ': ' + t(facT(1, f) + OPS[op] + '0') + '.', ['Each dot ' + t('r') + ' gives a factor ' + t('(x-r)') + '.'], 'MC: from a number line', true);
    } }] },
    { num: '10', outcome: RF8, parts: [{ id: 'E10', level: 'EMG', make: function (r) {
      var s = pickWhere(function () { return { p: nz(r, 1, 5), q: r.pick([2, 3]), n: nz(r, 1, 7), op: U.rndOp(r) }; }, function (z) { var a = z.p, b = z.n / z.q; return gcd(z.q, z.n) === 1 && a !== b && !(z.p === -2 && z.q === 2 && z.n === 3); });
      var f = [[1, s.p], [s.q, s.n]], E = fpoly(1, f), name = r.pick(['Mia', 'Leah', 'Nora', 'Isla']);
      var sets = [[s.p, s.n / s.q], [-s.p, -s.n / s.q], [s.p, s.n], [s.n, s.q * s.p]], key = function (L) { return L.slice().sort(function (a, b) { return a - b; }).join(','); };
      var keys = sets.map(key); if (keys.some(function (k, i) { return keys.indexOf(k) !== i; })) sets[3] = [s.p + 1, s.n / s.q + 1];
      var html = function (L) { var M2 = L.slice().sort(function (a, b) { return a - b; }); return t(vt(M2[0])) + ' and ' + t(vt(M2[1])); };
      return mc(r, name + ' solves ' + t(tx(E) + OPS[s.op] + '0') + ' with a sign chart. The values of ' + t('x') + ' where her factor rows change sign are', [
        { html: html(sets[0]), right: true }, { html: html(sets[1]), why: 'Check the signs: ' + t(facT(1, f) + '=0') + '.', code: 'sign' },
        { html: html(sets[2]), why: t(tx(lin(s.q, -s.n)) + '=0') + ' gives ' + t('x=' + vt(s.n / s.q)) + ': divide by ' + t(s.q) + '.', code: 'nodiv' }, { html: html(sets[3]), why: 'Factor ' + t(tx(E)) + ' completely and set each factor equal to ' + t('0') + '.', code: 'ac' }],
        t(tx(E) + '=' + facT(1, f)) + ': zeros ' + html(sets[0]) + '. (The solution is ' + t(setTexX(facSet(1, f, s.op))) + '.)', ['Factor, then set each factor equal to ' + t('0') + '.'], 'MC: zeros of the factors');
    } }] },

    { num: '11', section: 'B. Numerical Response', outcome: RF6, parts: [{ id: 'E11', level: 'PRG', make: function (r) {
      var s = pickWhere(function () { return { a1: 2, b1: r.int(-5, 5), c1: r.int(-6, 4), b2: r.int(-5, 5), c2: r.int(-4, 6) }; }, function (z) { var B1 = z.b1 - z.b2, C0 = z.c1 - z.c2, D = B1 * B1 - 4 * C0, sd = Math.sqrt(D); return C0 < 0 && (-B1 + sd) / 2 < 9.99 && Math.abs(sd - Math.round(sd)) > 1e-6 && !(z.b1 === 1 && z.c1 === -5 && z.b2 === 4 && z.c2 === -3); });
      var B1 = s.b1 - s.b2, C0 = s.c1 - s.c2, D = B1 * B1 - 4 * C0, x = (-B1 + Math.sqrt(D)) / 2, xn = (-B1 - Math.sqrt(D)) / 2;
      return apxNr('To the nearest hundredth, the positive ' + t('x') + '-coordinate of a solution of the system ' + t('y=' + tx(quad(2, s.b1, s.c1))) + ' and ' + t('y=' + tx(quad(1, s.b2, s.c2))) + ' is ______.', x,
        function (v) { return near(v, K.roundTo(Math.abs(xn), 2)) ? { code: CP + 'neg-root', hint: 'Use ' + t('+\\sqrt{\\ }') + ' in the quadratic formula for the positive root.' } : null; },
        t(tx(quad(1, B1, C0)) + '=0') + ': ' + t('x=\\dfrac{' + vt(-B1) + '\\pm\\sqrt{' + D + '}}{2}') + '. Positive: ' + t('\\approx ' + x.toFixed(2)) + '.', ['Set the right sides equal and collect terms on one side.', 'Use the quadratic formula.'], 'NR: positive x-coordinate', [Math.abs(xn)]);
    } }] },
    { num: '12', outcome: RF6, parts: [{ id: 'E12', level: 'MAS', make: function (r) {
      var s = pickWhere(function () { return { b: r.int(-4, 4), sq: r.int(1, 4), q: nz(r, 1, 6) }; }, function (z) { return Math.abs(z.b) < 2 * z.sq && z.b !== 0 && !(z.b === 2 && z.sq === 2 && z.q === 3); });
      var c = s.q + s.sq * s.sq, k = s.b + 2 * s.sq, kn = s.b - 2 * s.sq;
      return nrPart('The line ' + t('y=kx' + (s.q < 0 ? '' : '+') + s.q) + ', with ' + t('k>0') + ', is tangent to the parabola ' + t('y=' + tx(quad(1, s.b, c))) + '. The value of ' + t('k') + ' is ______.', k,
        function (v) { return near(v, Math.abs(kn)) ? { code: CP + 'k-neg', hint: 'The two tangent slopes are ' + t(k) + ' and ' + t(kn) + ': check the signs when you solve for ' + t('k') + '.' } : null; },
        t(tx(quad(1, s.b, c)) + '=kx' + (s.q < 0 ? '' : '+') + s.q) + ', so ' + t('x^{2}+(' + s.b + '-k)x+' + s.sq * s.sq + '=0') + '. Tangent: ' + t('(' + s.b + '-k)^{2}-' + 4 * s.sq * s.sq + '=0') + ', ' + t(s.b + '-k=\\pm' + 2 * s.sq) + ', so ' + t('k=' + kn) + ' or ' + t('k=' + k) + '. With ' + t('k>0') + ': <b>' + k + '</b>.', ['Substitute and collect: one quadratic equation in ' + t('x') + '.', 'Tangent: ' + t('b^{2}-4ac=0') + '. Solve for ' + t('k') + ' and keep the positive value.'], 'NR: tangent slope', [Math.abs(kn)]);
    } }] },
    { num: '13', outcome: RF8, parts: [{ id: 'E13', level: 'ADV', make: function (r) { return profitNr(r, true); } }] },
    { num: '14', outcome: RF8, parts: [{ id: 'E14', level: 'EMG', make: function (r) {
      var f = U.intFacs(r, { lo: -9, hi: 9, gap: 4, maxGap: 15, noZero: true, avoid: AV8, test: function (a, b) { return a < 0 && b > 0; } }), a = f[0][1], b = f[1][1], n = b - a + 1, E = fpoly(1, f);
      return nrPart('The number of integers that satisfy ' + t(tx(E) + '\\le 0') + ' is ______.', n, function (v) { return near(v, n - 2) || near(v, n - 1) ? { code: CP + 'count-ends', hint: 'With ' + t('\\le') + ' the zeros ' + t(a) + ' and ' + t(b) + ' are included: count them too.' } : null; },
        t(facT(1, f) + '\\le 0') + ': ' + t(a + '\\le x\\le ' + b) + ', which contains <b>' + n + '</b> integers.', ['Solve the inequality, then count the integers from one zero to the other.'], 'NR: count the integers', [n - 1, n + 1]);
    } }] },

    { num: '15', section: 'C. Written Response', stem: 'Solve each system algebraically and verify.', outcome: RF6, parts: [
      { id: 'E15a', level: 'BEG', make: mk('lqSolve', { mode: 'basic' }) },
      { id: 'E15b', level: 'EMG', make: mk('qqSolve', { mode: 'basic' }) }] },
    { num: '16', stem: 'Graph each inequality.', outcome: RF7, parts: [
      { id: 'E16a', level: 'BEG', make: mk('whichGraph') },
      { id: 'E16b', level: 'BEG', make: mk('whichGraph', { kind: 'quad' }) }] },
    { num: '17', shared: function (r) { return { f: U.intFacs(r, { lo: -5, hi: 5, gap: 3, maxGap: 7, avoid: AV8 }), op: U.rndOp(r, ['lt', 'le', 'gt', 'ge']) }; }, parts: [
      { id: 'E17a', level: 'EMG', outcome: RF7, make: function (r) {
        return mc(r, 'Which describes how to graph an inequality of the form ' + t('y\\ge ax^{2}+bx+c') + ' without technology?', [
          { html: 'Find the intercepts and the vertex and draw the parabola <b>solid</b>. Substitute a test point not on it: if it makes the inequality true, shade its side; otherwise shade the other side.', right: true },
          { html: 'Find the intercepts and the vertex and draw the parabola <b>dashed</b>. Then shade above it.', why: t('\\ge') + ' includes the boundary, so it is solid; and the side comes from a test point.', code: 'dash' },
          { html: 'Draw the parabola solid and always shade inside it (the side that holds the vertex).', why: 'The side depends on the inequality: use a test point that is not on the parabola.', code: 'inside' },
          { html: 'Draw the parabola solid and test its vertex: shade that side if it makes the inequality true.', why: 'The vertex is on the boundary, so it cannot show which side to shade.', code: 'vertex' }],
          'Draw the boundary from its key features (solid for ' + t('\\ge') + '), then use a test point that is not on the boundary to choose the side.', ['Solid or dashed? Which point tells the side?'], 'MC: how to graph');
      } },
      { id: 'E17b', level: 'EMG', outcome: RF7, make: function (r, s) {
        var E = fpoly(1, s.f), f = function (x) { return at(E, x); }, rts = rootsOf(s.f), vy = f((rts[0] + rts[1]) / 2), g2 = fpoly(1, [[1, -s.f[1][1]], [1, -s.f[0][1]]]), f2 = function (x) { return at(g2, x); };
        var win = { x: [-6, 6], y: [Math.max(-12, 2 * Math.floor((vy - 2) / 2)), 8] };
        var G = function (fn, dash, side, aria) { return A().regionSvg({ x: win.x, y: win.y, max: 200, curves: [{ f: fn, dash: dash }], shade: { f: fn, side: side }, aria: aria }); };
        var p = mc(r, 'Which graph shows ' + t('y\\ge ' + tx(E)) + '?', [{ html: G(f, false, 'above', 'solid, shaded above'), right: true }, { html: G(f, true, 'above', 'dashed, shaded above'), why: t('\\ge') + ': the boundary is solid.', code: 'dash' },
          { html: G(f, false, 'below', 'solid, shaded below'), why: 'Test ' + t('(0,\\ 0)') + ': ' + t('0\\ge ' + vt(f(0))) + ' is ' + (0 >= f(0) ? 'true: shade the side containing the origin (above, inside).' : 'false: shade the side without the origin (above).'), code: 'side' },
          { html: G(f2, false, 'above', 'another parabola'), why: 'Check the ' + t('x') + '-intercepts: they are ' + t(rts[0]) + ' and ' + t(rts[1]) + '.', code: 'bound' }],
          t(tx(E) + '=' + facT(1, s.f)) + ': ' + t('x') + '-intercepts ' + t(rts[0]) + ' and ' + t(rts[1]) + ', ' + t('y') + '-intercept ' + t(vt(f(0))) + ', vertex ' + t(ptT((rts[0] + rts[1]) / 2, vy)) + '. Solid (' + t('\\ge') + '); ' + t('y\\ge') + ' is above the parabola.', ['Solid for ' + t('\\ge') + '; check the intercepts; ' + t('y\\ge') + ' is above.'], 'MC: graph of a quadratic inequality');
        p.input.columns = 2; return p;
      } },
      { id: 'E17c', level: 'EMG', outcome: RF8, make: function (r, s) {
        var E = fpoly(1, s.f), f = function (x) { return at(E, x); }, rts = rootsOf(s.f), vy = f((rts[0] + rts[1]) / 2), T = facSet(1, s.f, s.op), pos = upOp(s.op);
        var svg = A().regionSvg({ x: [-6, 6], y: [Math.max(-12, 2 * Math.floor((vy - 2) / 2)), 8], max: 240, curves: [{ f: f }], shade: { f: f, side: 'above' }, aria: 'graph of the inequality' });
        return U.setPart(CP, 'The graph of ' + t('y\\ge ' + tx(E)) + ' is shown. Use it to solve ' + t(U.exT(1, s.f, s.op)) + '. Write the solution in set notation.' + fig(svg), T, { sideHint: t(U.exT(1, s.f, s.op)) + ' asks where the parabola is ' + (pos ? 'above' : 'below') + ' the ' + t('x') + '-axis.' },
          t(U.exT(1, s.f, s.op)) + ' where the parabola is ' + (pos ? 'above' : 'below') + ' the ' + t('x') + '-axis' + (strictOp(s.op) ? '' : ' (or on it)') + ': ' + (pos ? 'outside' : 'between') + ' the intercepts ' + t(rts[0]) + ' and ' + t(rts[1]) + '. ' + t(setTexX(T)) + '.',
          ['Look at the parabola, not the shading: where is ' + t('y=' + tx(E)) + ' ' + (pos ? 'positive' : 'negative') + '?', 'The intercepts are the endpoints; ' + (strictOp(s.op) ? 'not included.' : 'included.')], 'one variable from a graph');
      } }] },
    { num: '18', shared: function (r) {
        return pickWhere(function () { var ts = r.int(1, 3), v1 = 5 * r.int(4, 8), dv = r.pick([5, 10, 15, 20]); return { ts: ts, v1: v1, v2: v1 - dv, H0: ts * dv }; }, function (z) { var h = -5 * z.ts * z.ts + z.v1 * z.ts; return z.v2 > 0 && z.H0 <= 40 && h > 0 && z.v1 / 5 - z.ts > z.ts && !(z.v1 === 30 && z.v2 === 20 && z.H0 === 20); });
      },
      stem: function (s) { return 'At the same moment, a ball is thrown upward from the ground and another from a ' + t(s.H0) + ' m roof. Their heights in metres after ' + t('t') + ' seconds are ' + t('h=-5t^{2}+' + s.v1 + 't') + ' and ' + t('h=-5t^{2}+' + s.v2 + 't+' + s.H0) + '.'; }, parts: [
      { id: 'E18a', level: 'PRG', outcome: RF6, make: function (r, s) {
        var h = -5 * s.ts * s.ts + s.v1 * s.ts, tC = K.number(s.ts), hC = K.number(h);
        var part = { prompt: 'When are the balls at the same height, and what is that height?', input: { type: 'fields', fields: [{ label: 'Time:', after: 's', name: 'Time' }, { label: 'Height:', after: 'm', name: 'Height' }] },
          check: function (resp) { resp = resp || []; var a = tC(resp[0] == null ? '' : resp[0]), b = hC(resp[1] == null ? '' : resp[1]); if (a.v === 'correct' && b.v === 'correct') return ok(); if (a.v === 'form') return a; if (a.v !== 'correct') return wrong(CP + 'balls-t', '<b>Time:</b> set the heights equal; the ' + t('-5t^{2}') + ' terms cancel.'); if (b.v === 'form') return b; return wrong(CP + 'balls-h', '<b>Height:</b> substitute ' + t('t=' + s.ts) + ' into either equation.'); },
          key: [String(s.ts), String(h)], answer: 'after ' + t(s.ts) + ' s, both ' + t(h) + ' m high',
          solution: t('-5t^{2}+' + s.v1 + 't=-5t^{2}+' + s.v2 + 't+' + s.H0) + ', so ' + t((s.v1 - s.v2) + 't=' + s.H0) + ' and ' + t('t=' + s.ts) + ' s; ' + t('h=-5(' + s.ts + ')^{2}+' + s.v1 + '(' + s.ts + ')=' + h) + ' m.',
          hints: ['Set the two heights equal: the ' + t('t^{2}') + '-terms cancel.', 'Substitute the time into either equation.'], text: 'two balls: same height' };
        part.bad = [[String(s.ts), String(h + 5)], [String(s.ts + 1), String(h)]];
        return part;
      } },
      { id: 'E18b', level: 'MAS', outcome: RF8, make: function (r, s) {
        var h = -5 * s.ts * s.ts + s.v1 * s.ts, t2 = s.v1 / 5 - s.ts, T = SET.between(s.ts, t2, false);
        return U.setPart(CP, 'During what time interval is the first ball higher than ' + t(h) + ' m? Write it in set notation.', T, { v: 't', rev: true, revHint: 'Dividing by ' + t('-5') + ' reverses the sign: the ball is high <b>between</b> the two times.' },
          t('-5t^{2}+' + s.v1 + 't>' + h) + ', so ' + t('t^{2}-' + s.v1 / 5 + 't+' + h / 5 + '<0') + ', ' + t('(t-' + s.ts + ')(t-' + t2 + ')<0') + ': ' + t(setTexX(T, 't')) + ' (seconds).',
          ['Write ' + t('-5t^{2}+' + s.v1 + 't>' + h) + ' and move every term to one side.', 'Divide by ' + t('-5') + ' (reverse the sign) and factor.'], 'higher than a height');
      } }] },
    { num: '19', outcome: RF7, shared: function (r) {
        return pickWhere(function () { var p = r.pick([12, 15, 16, 18, 20, 24, 25]), q = r.pick([10, 12, 14, 15, 16, 18, 20]), G = 30 * r.int(6, 15); return { p: p, q: q, G: G }; },
          function (z) { return z.p !== z.q && z.G % z.p === 0 && z.G % z.q === 0 && z.G / z.p <= 30 && z.G / z.q <= 30 && !(z.p === 20 && z.q === 15 && z.G === 300); });
      },
      stem: function (s) { return 'Lena earns ' + t('\\$' + s.p) + '/h tutoring and ' + t('\\$' + s.q) + '/h lifeguarding. She wants to earn at least ' + t('\\$' + s.G) + ' a week. Let ' + t('x') + ' be her tutoring hours and ' + t('y') + ' her lifeguarding hours.'; }, parts: [
      { id: 'E19a', level: 'EMG', make: function (r, s) {
        var key = tx(P.add(M(s.p, 'x', 1), M(s.q, 'y', 1))) + '\\ge ' + s.G;
        return A().ineqPart(CP, 'Write an inequality for the situation. (Its restrictions are ' + t('x\\ge 0') + ' and ' + t('y\\ge 0') + '.)', P.add(M(s.p, 'x', 1), M(s.q, 'y', 1), P.num(-s.G)), 'ge', key, { ph: s.p + 'x + ' + s.q + 'y >= ' + s.G, example: key, strictHint: '“At least” includes exactly ' + t('\\$' + s.G) + ': use ' + t('\\ge') + '.', boundHint: 'Earnings: ' + t(s.p + 'x') + ' from tutoring plus ' + t(s.q + 'y') + ' from lifeguarding.' },
          t(key) + ', ' + t('x\\ge 0') + ', ' + t('y\\ge 0') + '.', ['Earnings from each job, added, are at least the goal.'], 'context: write the inequality');
      } },
      { id: 'E19b', level: 'EMG', make: function (r, s) {
        var X = s.G / s.p, Yv = s.G / s.q, top = 5 * Math.ceil((Math.max(X, Yv) + 4) / 5), f = function (x) { return (s.G - s.p * x) / s.q; }, g = function (x) { return (s.G - s.q * x) / s.p; };
        var G = function (fn, dash, side, aria) { return A().regionSvg({ x: [0, top], y: [0, top], max: 200, labels: 5, curves: [{ f: fn, dash: dash }], shade: { f: fn, side: side }, aria: aria }); };
        var p = mc(r, 'Which graph shows the solution region (with the restrictions)?', [{ html: G(f, false, 'above', 'solid, shaded away from the origin'), right: true }, { html: G(f, false, 'below', 'solid, shaded toward the origin'), why: 'Test ' + t('(0,\\ 0)') + ': ' + t('0\\ge ' + s.G) + ' is false, so shade the side away from the origin.', code: 'side' },
          { html: G(f, true, 'above', 'dashed'), why: '“At least”: exactly ' + t('\\$' + s.G) + ' counts, so the boundary is solid.', code: 'dash' }, { html: G(g, false, 'above', 'intercepts swapped'), why: 'Check the intercepts: ' + t('x=' + X) + ' (tutoring only) and ' + t('y=' + Yv) + ' (lifeguarding only).', code: 'swap' }],
          'Intercepts ' + t(ptT(X, 0)) + ' and ' + t(ptT(0, Yv)) + '; solid (' + t('\\ge') + '). Test ' + t('(0,\\ 0)') + ': ' + t('0\\ge ' + s.G) + ' is false, so shade away from the origin, in the first quadrant.', ['Find the intercepts of the boundary.', 'Solid for ' + t('\\ge') + '; test the origin to choose the side.'], 'context: which graph');
        p.input.columns = 2; return p;
      } },
      { id: 'E19c', sub: 'c i', level: 'PRG', make: function (r, s) { return comboPart(s, true); } },
      { id: 'E19c2', sub: 'c ii', level: 'MAS', make: function (r, s) { return comboPart(s, false); } }] }
  ];

  /* Lena's hours: a combination on the boundary (exactly the goal), or one that beats the goal (whole hours, at most 40 each) */
  function comboPart(s, onB) {
    var key = null;
    for (var x = 1; x < s.G / s.p && !key; x++) { var y = (s.G - s.p * x) / s.q; if (y % 1 === 0 && y > 0) key = [x, y]; }
    if (!key) key = [s.G / s.p, 0];
    if (!onB) key = [key[0] + 1, key[1]];
    var check = function (resp) {
      resp = resp || [];
      var a = HW.parse.number(resp[0] == null ? '' : resp[0]), b = HW.parse.number(resp[1] == null ? '' : resp[1]);
      if (!a.ok || !b.ok) return form('empty', 'Enter both numbers of hours.');
      var x = a.value, y = b.value, v = s.p * x + s.q * y;
      if (x < 0 || y < 0) return wrong(CP + 'ctx-pt', 'Hours cannot be negative.');
      if (!onB && (x % 1 !== 0 || y % 1 !== 0 || x > 40 || y > 40)) return form('ctx-whole', 'Use whole numbers of hours, at most 40 of each.');
      if (onB) return Math.abs(v - s.G) < 1e-9 ? ok() : wrong(CP + 'bound-pt', t(s.p + '(' + vt(x) + ')+' + s.q + '(' + vt(y) + ')=' + vt(v)) + (v > s.G ? ': that beats the goal, so it is inside the region, not on the boundary.' : ': less than ' + t('\\$' + s.G) + '.'));
      if (Math.abs(v - s.G) < 1e-9) return wrong(CP + 'bound-pt', 'That one is on the boundary (exactly ' + t('\\$' + s.G) + '). Find one that earns <b>more</b>.');
      return v > s.G ? ok() : wrong(CP + 'ctx-pt', t(s.p + '(' + vt(x) + ')+' + s.q + '(' + vt(y) + ')=' + vt(v)) + ': less than ' + t('\\$' + s.G) + '.');
    };
    var v0 = s.p * key[0] + s.q * key[1];
    var part = { prompt: onB ? 'Give a combination of hours that meets her goal <b>exactly</b> (a point on the boundary).' : 'Give a combination of whole hours (at most 40 of each) that earns <b>more</b> than her goal.',
      input: { type: 'fields', fields: [{ label: 'Tutoring:', after: 'h', name: 'Tutoring' }, { label: 'Lifeguarding:', after: 'h', name: 'Lifeguarding' }] }, check: check, key: key.map(String),
      answer: 'for example ' + t(key[0]) + ' h tutoring and ' + t(key[1]) + ' h lifeguarding (' + t('\\$' + v0) + ')',
      solution: 'For example ' + t(ptT(key[0], key[1])) + ': ' + t(s.p + '(' + key[0] + ')+' + s.q + '(' + key[1] + ')=' + v0) + (onB ? ' — exactly the goal, on the boundary.' : ' > ' + s.G + '. Any point in the shaded region (not on the line) works.'),
      hints: [onB ? 'Choose a number of tutoring hours and solve ' + t(s.p + 'x+' + s.q + 'y=' + s.G) + ' for ' + t('y') + '.' : 'Choose a point in the shaded region, away from the line, and check it.'], text: onB ? 'context: a boundary combination' : 'context: a combination above the goal' };
    part.bad = onB ? [[String(key[0] + 1), String(key[1])], ['0', '0']] : [['0', '0'], [String(key[0] - 1), String(key[1])]];
    return part;
  }

  /* one question per booklet number: a group of single-part questions (ids like 17 or E17) becomes separate questions */
  function splitNum(list) {
    var out = [];
    list.forEach(function (q) {
      if (q.parts.length > 1 && q.parts.every(function (p) { return /^E?\d+$/.test(p.id); })) {
        q.parts.forEach(function (p, i) { var nq = { num: p.id.replace(/^E/, ''), parts: [p] }; if (i === 0 && q.section) nq.section = q.section; if (q.outcome) nq.outcome = q.outcome; if (q.stem) nq.stem = q.stem; out.push(nq); });
      } else out.push(q);
    });
    return out;
  }
  HW.defineLesson({ id: LID, unit: 8, num: '8', title: 'Unit 8 Review', outcome: RF6, calc: true, questions: splitNum(QUESTIONS), extra: splitNum(EXTRA) });
})(window);
