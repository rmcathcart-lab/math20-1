/* Math 20-1 · Unit 1 · Lesson 2 — Arithmetic Sequences (outcome RF9 on every part)
 * Assignment 2 (u1_l02.tex, Questions 1–18) and the Lesson 2 Extra Practice (u1_ep02.tex, A1–A5, B1–B6, C1–C2).
 * Uses the sequence kit in u1l1.js (HW.seqKit13), so u1l1.js must load first.
 * Every part is a generator: the booklet question with new numbers (the lesson's example numbers and the booklet's own
 * numbers are left out). General terms are typed in simplest form (expanded, like terms collected); an unexpanded
 * t_1 + (n − 1)d gets a nudge, and the classic slips (n instead of n − 1, t_1 and d swapped, sign of d) are recognised.
 * Conversions: "explain the error" / "explain why the common difference is 35" → multiple choice of reasons;
 * "which of −169 and −190 are terms" → a position box for each (or none).
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: 12(b), 16, Extra C1 and C2(c). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, F = HW.fmt, t = K.t, P = HW.poly, S = HW.seqKit13;
  if (!S) throw new Error('u1l2.js needs js/lessons/u1l1.js (the sequence kit) to load first');
  var LID = 'u1l2', cl = S.cl, same = S.same, isInt = S.isInt, gcd = S.gcd, range = S.range, vT = S.vT, vP = S.vP, sgn = S.sgn, seqTex = S.seqTex, tsub = S.tsub;
  function pw(gen, okf) { return S.pickWhere(gen, okf, LID); }

  HW.addCodes({
    'u1l2-left': 'Going left: added d instead of subtracting', 'u1l2-n-1': 'Number of terms: gave n − 1 (forgot to add 1)', 'u1l2-div-last': 'Number of terms: divided the last term by d',
    'u1l2-outside': 'Multiple outside the interval', 'u1l2-means-steps': 'Means: wrong number of steps (k means = k + 1 steps)', 'u1l2-means-avg': 'Means: averaged the ends instead of stepping',
    'u1l2-incl': 'Counted an endpoint that is not included', 'u1l2-rem': 'Remainder: started from the wrong first number', 'u1l2-gave-m': 'Gave the variable instead of the common difference',
    'u1l2-gave-t': 'Gave a term instead of the common difference', 'u1l2-cross-eq': 'Took the last position where P is still less', 'u1l2-zero-term': 'Counted a term that is 0 or negative',
    'u1l2-lcm': 'Common terms: used a difference that is not a common multiple', 'u1l2-floor': 'Rounded up a number of shapes (not enough toothpicks)'
  });
  HW.addPartial({ 'u1l2-left': 's', 'u1l2-n-1': 's', 'u1l2-div-last': 'n', 'u1l2-outside': 's', 'u1l2-means-steps': 'b', 'u1l2-means-avg': 'n', 'u1l2-incl': 's', 'u1l2-rem': 'b',
    'u1l2-gave-m': 'b', 'u1l2-gave-t': 'b', 'u1l2-cross-eq': 's', 'u1l2-zero-term': 's', 'u1l2-lcm': 'n', 'u1l2-floor': 's' });

  /* ---------------- helpers ---------------- */
  function arT(t1, d, k, frac) { return seqTex(S.arith(t1, d, k), { frac: frac }); }
  function nextSpecs(t1, d, from, count, frac) {
    var out = []; for (var i = 0; i < count; i++) { var k = from + i, v = t1 + (k - 1) * d; out.push(S.fNum(tsub(k), v, [[v - 2 * d, 'u1l2-left', 'The terms go ' + (d > 0 ? 'up' : 'down') + ' by ' + t(vT(Math.abs(d), frac)) + ': add ' + t(vP(d, frac)) + ' to the previous term.'], [t1 + k * d, 'u1l1-shift', 'That is ' + t(tsub(k + 1)) + '.']], { frac: frac })); }
    return out;
  }
  function dSpec(d, frac, cands) { return S.fNum('d', d, [[-d, 'u1l1-d-sign', 'Subtract each term from the <b>next</b> one: ' + t('d=t_2-t_1') + '.']].concat(cands || []), { frac: frac }); }
  /* algebraic terms a·x + b·y as polynomials */
  function lin2(a, b, x, y) { var o1 = {}, o2 = {}; o1[x || 'x'] = 1; o2[y || 'y'] = 1; return P.add(P.mono(a, o1), P.mono(b, o2)); }
  function polyTex(p) { return P.tex(p, { dec: true }); }
  function polySeq(p0, dp, k) { var o = [], cur = p0; for (var i = 0; i < k; i++) { o.push(cur); cur = P.add(cur, dp); } return o; }
  /* number of terms n from t1, d, last */
  function countCands(t1, d, L, n) {
    return [[n - 1, 'u1l2-n-1', 'That is ' + t('n-1') + ' (the number of steps). Add 1 to get the number of terms.'], [n + 1, 'u1l1-shift', 'Check: ' + t('t_{' + (n + 1) + '}=' + vT(t1 + n * d)) + '.'], [L / d, 'u1l2-div-last', 'Use ' + t('t_n=t_1+(n-1)d') + ' with ' + t('t_n') + ' equal to the last term.']];
  }
  function countSol(t1, d, L, n) { return t(vT(L) + '=' + vT(t1) + '+(n-1)' + vP(d)) + ' &nbsp;⇒&nbsp; ' + t(vT(cl(L - t1)) + '=' + vP(d) + '(n-1)') + ' &nbsp;⇒&nbsp; ' + t('n-1=' + (n - 1)) + ', &nbsp;' + t('n=' + n) + '.'; }
  var HN = ['The last term is ' + t('t_n') + '. Substitute ' + t('t_1') + ', ' + t('d') + ' and the last term into ' + t('t_n=t_1+(n-1)d') + '.', 'Solve for ' + t('n-1') + ' first, then add 1.'];
  /* the "set the two differences equal" working for three linear expressions */
  function exprSol(o, v) {
    var L = S.linX, e1 = L(o.a1, o.b1, v), e2 = L(o.a2, o.b2, v), e3 = L(o.a3, o.b3, v);
    return t('(' + e2 + ')-(' + e1 + ')=(' + e3 + ')-(' + e2 + ')') + '<br>' + t(L(o.a2 - o.a1, o.b2 - o.b1, v) + '=' + L(o.a3 - o.a2, o.b3 - o.b2, v)) + ' &nbsp;⇒&nbsp; ' + t(v + '=' + o.x);
  }
  function exprTerms(o) { return [o.a1 * o.x + o.b1, o.a2 * o.x + o.b2, o.a3 * o.x + o.b3]; }
  var HE = ['Consecutive terms of an arithmetic sequence have equal differences: ' + t('t_2-t_1=t_3-t_2') + '.', 'Put each expression in brackets when you subtract, then solve for the variable.'];

  /* =============================== Assignment 2 =============================== */
  var QUESTIONS = [
    { num: '1', stem: 'Each sequence is arithmetic. State ' + t('d') + ' and the next three terms.', parts: [
      { id: '1a', sub: 'a', level: 'BEG', make: function (r) { var o = pw(function () { return { t1: r.int(3, 20), d: r.int(6, 15) }; }, function (z) { return !(z.t1 === 9 && z.d === 11) && !(z.t1 === 13 && z.d === 8); }); return q1part('a', o.t1, o.d); } },
      { id: '1b', sub: 'b', level: 'BEG', make: function (r) { var o = pw(function () { return { t1: -r.int(5, 20), d: r.int(4, 10) }; }, function (z) { return !(z.t1 === -14 && z.d === 8); }); return q1part('b', o.t1, o.d); } },
      { id: '1c', sub: 'c', level: 'BEG', make: function (r) { var o = pw(function () { return { t1: r.int(40, 80), d: -r.int(9, 20) }; }, function (z) { return !(z.t1 === 55 && z.d === -17) && !(z.t1 === 41 && z.d === -7); }); return q1part('c', o.t1, o.d); } },
      { id: '1d', sub: 'd', level: 'EMG', make: function (r) { var o = pw(function () { return { t1: r.int(10, 50) / 10, d: -r.int(5, 25) / 10 }; }, function (z) { return !(z.t1 === 2.6 && z.d === -1.7) && z.d * 10 % 10 !== 0; }); return q1part('d', o.t1, o.d); } },
      { id: '1e', sub: 'e', level: 'PRG', make: function (r) {
        var o = pw(function () { var M = r.pick([6, 10, 12, 15, 20]); return { M: M, a: r.int(1, M - 1), b: r.int(1, M - 1) }; }, function (z) { var f1 = S.fr(z.a / z.M), f2 = S.fr((z.a + z.b) / z.M); return gcd(z.b, z.M) === 1 && f1[1] > 1 && f2[1] > 1 && f1[1] !== f2[1] && !(z.M === 12 && z.a === 3 && z.b === 5); });
        return q1part('e', o.a / o.M, o.b / o.M, true, o.M);
      } },
      { id: '1f', sub: 'f', level: 'PRG', make: function (r) {
        var o = pw(function () { return { a: r.int(2, 7), b: r.pick([1, -1]) * r.int(1, 4), c: r.pick([1, -1]) * r.int(1, 3), e: r.pick([1, -1]) * r.int(1, 3) }; }, function (z) { return !(z.a === 5 && z.b === -1 && z.c === -2 && z.e === 3) && z.a + z.c !== 0 && z.b + z.e !== 0 && z.a + 2 * z.c !== 0 && z.b + 2 * z.e !== 0; });
        var p0 = lin2(o.a, o.b), dp = lin2(o.c, o.e), seq = polySeq(p0, dp, 6);
        var specs = [S.fPoly('d', dp, { var: 'x' })].concat([3, 4, 5].map(function (i) { return S.fPoly(tsub(i + 1), seq[i], { var: 'x', wrong: [{ is: seq[i - 1], code: 'u1l1-shift', hint: 'That is ' + t(tsub(i)) + ' — add ' + t('d') + ' once more.' }] }); }));
        return S.fieldsPart('(f) ' + t(seq.slice(0, 3).map(polyTex).join(',\\ ') + ',\\ \\dots'), specs,
          t('d=(' + polyTex(seq[1]) + ')-(' + polyTex(seq[0]) + ')=' + polyTex(dp)) + ' (check: ' + t('(' + polyTex(seq[2]) + ')-(' + polyTex(seq[1]) + ')') + ' is the same).<br>Next: ' + t(seq.slice(3).map(polyTex).join(',\\ ')) + '.', ['Subtract the expressions: collect the ' + t('x') + ' terms and the ' + t('y') + ' terms separately.', 'Add ' + t('d') + ' to the third term to get the fourth.'], 'd and next three (algebraic)');
      } }] },
    { num: '2', stem: 'One term and the common difference of each arithmetic sequence are given. Fill in the missing terms.', parts: [
      { id: '2a', sub: 'a', level: 'BEG', make: function (r) { var o = pw(function () { return { d: r.int(3, 9), p: r.int(2, 4), v: r.int(5, 30) }; }, function (z) { return !(z.d === 4 && z.p === 3 && z.v === 9); }); return q2part('a', o.d, o.p, o.v); } },
      { id: '2b', sub: 'b', level: 'BEG', make: function (r) { var o = pw(function () { return { d: -r.int(3, 9), p: r.int(3, 4), v: r.int(-10, 12) }; }, function (z) { return !(z.d === -6 && z.p === 4 && z.v === -2); }); return q2part('b', o.d, o.p, o.v); } },
      { id: '2c', sub: 'c', level: 'EMG', make: function (r) { var o = pw(function () { return { d: -r.pick([5, 15, 25, 35]) / 10, p: r.int(2, 3), v: r.int(-20, 40) / 10 }; }, function (z) { return !(z.d === -1.5 && z.p === 2 && z.v === 0.5); }); return q2part('c', o.d, o.p, o.v); } },
      { id: '2d', sub: 'd', level: 'EMG', make: function (r) { var o = pw(function () { var q = r.pick([2, 3, 4]); return { q: q, d: 1 / q, p: 5, v: r.int(5, 20) }; }, function (z) { return !(z.q === 2 && z.v === 13); }); return q2part('d', o.d, o.p, o.v, true); } }] },
    { num: '3', stem: 'Write the first four terms of each arithmetic sequence.', parts: [
      { id: '3a', sub: 'a', level: 'BEG', make: function (r) { var o = pw(function () { return { t1: -r.int(3, 15), d: r.int(3, 9) }; }, function (z) { return !(z.t1 === -9 && z.d === 5); }); return q3part('a', 1, o.t1, o.d); } },
      { id: '3b', sub: 'b', level: 'EMG', make: function (r) { var o = pw(function () { return { tk: r.int(12, 40), d: -r.int(2, 7) }; }, function (z) { return !(z.tk === 26 && z.d === -4); }); return q3part('b', 3, o.tk - 2 * o.d, o.d); } },
      { id: '3c', sub: 'c', level: 'EMG', make: function (r) { var o = pw(function () { return { k: r.int(5, 8), t1: r.int(-6, 12), d: r.int(3, 9) }; }, function (z) { return !(z.k === 6 && z.t1 === 5 && z.d === 7) && !(z.k === 4); }); return q3part('c', o.k, o.t1, o.d); } }] },
    { num: '4', shared: function (r) {
        var o = pw(function () { return { t1: r.int(15, 45), d: -r.int(3, 9), N: r.int(30, 50), m: r.int(25, 45) }; }, function (z) { return !(z.t1 === 23 && z.d === -6) && !(z.t1 === 41 && z.d === -7) && z.m !== z.N; });
        o.j = r.int(1, -o.d - 1); o.m2 = o.m + r.int(2, 6); o.first = r.chance(0.5); return o;
      },
      stem: function (o) { return 'Consider the arithmetic sequence ' + t(arT(o.t1, o.d, 4)) + '.'; },
      parts: [
        { id: '4a', sub: 'a', level: 'BEG', make: function (r, o) { return S.gtPart('Determine the general term in simplest form.', o.t1, o.d, null, null, 'general term of a decreasing sequence'); } },
        { id: '4b', sub: 'b', level: 'EMG', make: function (r, o) { var v = o.t1 + (o.N - 1) * o.d, g = S.gtTex(o.t1, o.d); return S.numPart('Determine ' + t(tsub(o.N)) + '.', v, [[o.t1 + o.N * o.d, 'u1l1-gt-n', 'Use ' + t('n-1=' + (o.N - 1)) + ' steps of ' + t('d') + ' (or substitute into your general term).'], [o.t1 - (o.N - 1) * o.d, 'u1l1-gt-dsign', 'Check the sign of ' + t('d') + '.']], t(tsub(o.N) + '=' + g.replace(/n/g, '(' + o.N + ')') + '=' + F(v)), S.HTERM, 't_N from the general term'); } },
        { id: '4c', sub: 'c', level: 'PRG', make: function (r, o) {
          var g = S.gtTex(o.t1, o.d), a = o.d, b = o.t1 - o.d, V1 = a * o.m + b, V2 = a * o.m2 + b + o.j;
          var first = o.first ? [V1, o.m] : [V2, null], second = o.first ? [V2, null] : [V1, o.m];
          var spec = function (V, n) { var s = S.fPos(F(V), n, n ? [[n - 1, 'u1l1-gt-n', 'Check your general term at ' + t('n=1') + '.']] : []); s.label = t(F(V) + ':\\ n='); s.name = t(F(V)); return s; };
          var sol = [first, second].map(function (x) { var nn = (x[0] - b) / a; return t(g + '=' + F(x[0])) + ' &nbsp;⇒&nbsp; ' + t('n=' + (isInt(nn) ? nn : F(Math.round(nn * 100) / 100))) + ': ' + (isInt(nn) ? t(F(x[0]) + '=' + tsub(nn)) : t(F(x[0])) + ' is not a term.'); }).join('<br>');
          return S.fieldsPart('Which of ' + t(F(first[0])) + ' and ' + t(F(second[0])) + ' are terms of the sequence? For each term, state its position ' + t('n') + ' (press <b>none</b> if it is not a term).', [spec(first[0], first[1]), spec(second[0], second[1])], sol,
            ['Set your general term equal to each number and solve for ' + t('n') + '.', 'A number is a term only if ' + t('n') + ' is a natural number.'], 'which values are terms');
        } }] },
    { num: '5', stem: 'Determine the general term in simplest form and the given term for each arithmetic sequence.', parts: [
      { id: '5a', sub: 'a', level: 'EMG', make: function (r) { var o = pw(function () { return { t1: r.int(2, 12), d: r.int(5, 12), N: r.int(15, 30) }; }, function (z) { return !(z.t1 === 4 && z.d === 9); }); return q5part('a', o.t1, o.d, o.N); } },
      { id: '5b', sub: 'b', level: 'PRG', make: function (r) { var o = pw(function () { return { t1: -r.int(10, 40), d: r.int(3, 14) + 0.5, N: r.int(15, 30) }; }, function (z) { return !(z.t1 === -30 && z.d === 11.5); }); return q5part('b', o.t1, o.d, o.N); } },
      { id: '5c', sub: 'c', level: 'ADV', make: function (r) {
        var o = pw(function () { return { a: r.int(1, 4), b: r.int(2, 6), c: r.int(1, 3), e: -r.int(1, 3), N: r.int(15, 30) }; }, function (z) { return !(z.a === 1 && z.b === 5 && z.c === 2 && z.e === -1) && z.a !== z.c; });
        var p0 = lin2(o.a, o.b), dp = lin2(o.c, o.e), seq = polySeq(p0, dp, 3);
        var nn = P.v('n'), gen = P.add(p0, P.mul(P.sub(nn, P.num(1)), dp)), tN = P.add(p0, P.scale(dp, [o.N - 1, 1]));
        var specs = [S.fPoly('t_n', gen, { expanded: false, var: 'n', wrong: [{ is: P.add(p0, P.mul(nn, dp)), code: 'u1l1-gt-n', hint: 'With ' + t('n=1') + ' your formula should give ' + t(polyTex(p0)) + ': use ' + t('(n-1)d') + '.' }] }), S.fPoly(tsub(o.N), tN, { var: 'x', wrong: [{ is: P.add(p0, P.scale(dp, [o.N, 1])), code: 'u1l1-gt-n', hint: 'That is ' + t(tsub(o.N + 1)) + ': it takes ' + t(o.N - 1) + ' steps from ' + t('t_1') + '.' }] })];
        return S.fieldsPart('(c) ' + t(seq.map(polyTex).join(',\\ ') + ',\\ \\dots') + ' &nbsp; Determine the general term and ' + t(tsub(o.N)) + '.', specs,
          t('d=' + polyTex(dp)) + '<br>' + t('t_n=' + polyTex(p0) + '+(n-1)(' + polyTex(dp) + ')=(' + S.linX(o.c, o.a - o.c, 'n') + ')x' + '+(' + S.linX(o.e, o.b - o.e, 'n') + ')y') + '<br>' + t(tsub(o.N) + '=' + polyTex(tN)) + ' &nbsp;(any equivalent form of ' + t('t_n') + ' is fine)', ['Find ' + t('d') + ' by subtracting the expressions, then use ' + t('t_n=t_1+(n-1)d') + '.', 'For ' + t(tsub(o.N)) + ', substitute ' + t('n=' + o.N) + ' and collect the ' + t('x') + ' and ' + t('y') + ' terms.'], 'general term (algebraic) and t_N');
      } }] },
    { num: '6', shared: function (r) { return pw(function () { return { A: r.pick([3, 4]), c: r.int(0, 2), N: r.int(30, 80), m: r.int(20, 45) }; }, function (z) { return !(z.A === 4 && z.c === 0) && z.N !== 50; }); },
      stem: function (o) {
        return 'Square tiles make a pattern of ' + (o.A === 4 ? 'plus signs' : '“T” shapes') + '. Each arm of Figure ' + t('n') + ' has ' + t(o.c ? 'n+' + o.c : 'n') + ' tiles.' +
          S.fig(S.tiles([1, 2, 3].map(function (n) { return { cells: armCells(o.A, n + o.c), label: 'Figure ' + n }; }), { u: 10 }));
      },
      parts: [
        { id: '6a', sub: 'a', level: 'BEG', make: function (r, o) { var f = function (n) { return 1 + o.A * (n + o.c); }; return S.fieldsPart('State the number of tiles in Figures 1 to 5.', [1, 2, 3, 4, 5].map(function (k) { return S.fNum(tsub(k), f(k), [[o.A * (k + o.c), 'value', 'Count the centre tile too.']]); }), t(seqTex([1, 2, 3, 4, 5].map(f), { inf: false })) + ': the centre tile plus ' + t(o.A) + ' arms of ' + t(o.c ? 'n+' + o.c : 'n') + ' tiles.', ['Count the centre, then the ' + t(o.A) + ' arms.'], 'plus pattern tiles 1–5'); } },
        { id: '6b', sub: 'b', level: 'EMG', make: function (r, o) { var t1 = 1 + o.A * (1 + o.c); return S.gtPart('Determine the general term.', t1, o.A, t('t_1=' + t1) + ', ' + t('d=' + o.A) + ': ' + t(S.gtSteps(t1, o.A)) + '.', null, 'pattern general term'); } },
        { id: '6c', sub: 'c', level: 'EMG', make: function (r, o) { var v = 1 + o.A * (o.N + o.c); return S.numPart('How many tiles are in Figure ' + t(o.N) + '?', v, [[o.A * (o.N + o.c), 'value', 'Include the centre tile.'], [1 + o.A * (o.N + o.c) + o.A, 'u1l1-gt-n', 'Check your general term with Figure 1.']], t(tsub(o.N) + '=' + S.gtTex(1 + o.A * (1 + o.c), o.A).replace('n', '(' + o.N + ')') + '=' + v) + ' tiles.', S.HTERM, 'tiles in Figure N'); } },
        { id: '6d', sub: 'd', level: 'PRG', make: function (r, o) {
          var b = 1 + o.A * o.c, V = o.A * o.m + b, W = o.A * (o.m + r.int(3, 9)) + b + r.int(1, o.A - 1);
          var s1 = S.fPos(V + '\\text{ tiles}', o.m, [[o.m + o.c, 'value', 'Solve ' + t(S.gtTex(1 + o.A * (1 + o.c), o.A) + '=' + V) + '.']]), s2 = S.fPos(W + '\\text{ tiles}', null);
          s1.label = t(V + '\\text{ tiles: Figure}'); s1.name = t(V) + ' tiles'; s2.label = t(W + '\\text{ tiles: Figure}'); s2.name = t(W) + ' tiles';
          var g = S.gtTex(1 + o.A * (1 + o.c), o.A), n2 = (W - b) / o.A;
          return S.fieldsPart('Which figure uses ' + t(V) + ' tiles? Can any figure use exactly ' + t(W) + ' tiles? (Press <b>none</b> if no figure does.)', [s1, s2],
            t(g + '=' + V) + ' &nbsp;⇒&nbsp; ' + t('n=' + o.m) + ': Figure ' + t(o.m) + '.<br>' + t(g + '=' + W) + ' &nbsp;⇒&nbsp; ' + t('n=' + F(Math.round(n2 * 100) / 100)) + ': not a natural number, so no figure uses ' + t(W) + ' tiles.', ['Set the general term equal to the number of tiles and solve for ' + t('n') + '.'], 'which figure / no figure');
        } }] },
    { num: '7', stem: 'Determine the number of terms in each sequence.', parts: [
      { id: '7a', sub: 'a', level: 'EMG', make: function (r) { var o = pw(function () { return { t1: r.int(2, 12), d: r.int(3, 9), n: r.int(30, 70) }; }, function (z) { return !(z.t1 === 5 && z.d === 4 && z.n === 50); }); return q7part('a', o.t1, o.d, o.n); } },
      { id: '7b', sub: 'b', level: 'EMG', make: function (r) { var o = pw(function () { return { t1: -r.int(5, 25), d: -r.int(5, 12), n: r.int(20, 50) }; }, function (z) { return !(z.t1 === -17 && z.d === -8); }); return q7part('b', o.t1, o.d, o.n); } },
      { id: '7c', sub: 'c', level: 'PRG', make: function (r) { var o = pw(function () { return { t1: r.int(5, 60) / 10, d: r.pick([0.25, 0.75, 1.25, 0.4, 0.6, 0.35]), n: r.int(15, 40) }; }, function (z) { return !(z.t1 === 2.5 && z.d === 0.75) && S.isInt(z.t1 * 100 + 0) && String(cl(z.t1 + (z.n - 1) * z.d)).length <= 6; }); return q7part('c', o.t1, o.d, o.n); } }] },
    { num: '8', parts: [
      { id: '8a', sub: 'a', level: 'EMG', make: function (r) {
        var o = pw(function () { return { m: r.int(6, 15), k1: r.int(3, 15), g: r.int(30, 80) }; }, function (z) { return !(z.m === 8 && z.k1 === 5 && z.g === 55); });
        var A = o.m * o.k1, Bv = o.m * (o.k1 + o.g), n = o.g + 1;
        return S.numPart('How many multiples of ' + t(o.m) + ' are there from ' + t(A) + ' to ' + t(F(Bv)) + ', inclusive?', n, [[o.g, 'u1l2-n-1', 'Both ends count (inclusive): ' + t('n-1=' + o.g) + ', so ' + t('n=' + n) + '.'], [n - 2, 'u1l2-incl', '“Inclusive” means both ' + t(A) + ' and ' + t(F(Bv)) + ' count.'], [Bv / o.m, 'u1l2-outside', 'That counts every multiple from ' + t(o.m) + ' up. Start at ' + t(A) + '.']],
          t('t_1=' + A + ',\\ t_n=' + F(Bv) + ',\\ d=' + o.m) + ': ' + countSol(A, o.m, Bv, n) + ' There are ' + t(n) + ' multiples.', HN, 'multiples inclusive');
      } },
      { id: '8b', sub: 'b', level: 'PRG', make: function (r) {
        var o = pw(function () { return { p: r.pick([11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 23]), A: r.int(100, 400), span: r.int(300, 900) }; }, function (z) { return z.A % z.p !== 0 && (z.A + z.span) % z.p !== 0 && !(z.p === 13 && z.A === 200 && z.span === 700) && !(z.p === 9); });
        var Bv = o.A + o.span, k1 = Math.ceil(o.A / o.p), k2 = Math.floor(Bv / o.p), f = o.p * k1, l = o.p * k2, n = k2 - k1 + 1;
        return S.fieldsPart('State the first and last multiples of ' + t(o.p) + ' between ' + t(o.A) + ' and ' + t(Bv) + ', then find how many multiples of ' + t(o.p) + ' there are between ' + t(o.A) + ' and ' + t(Bv) + '.', [
          S.fNum('\\text{first}', f, [[f - o.p, 'u1l2-outside', t(F(f - o.p)) + ' is less than ' + t(o.A) + '.']]), S.fNum('\\text{last}', l, [[l + o.p, 'u1l2-outside', t(F(l + o.p)) + ' is more than ' + t(Bv) + '.']]), S.fNum('n', n, [[n - 1, 'u1l2-n-1', 'You found ' + t('n-1') + '. Add 1.']])],
          t(o.A + '\\div ' + o.p + '\\approx ' + F(Math.round(o.A / o.p * 10) / 10)) + ', so the first is ' + t(o.p + '\\times ' + k1 + '=' + f) + '. ' + t(Bv + '\\div ' + o.p + '\\approx ' + F(Math.round(Bv / o.p * 10) / 10)) + ', so the last is ' + t(o.p + '\\times ' + k2 + '=' + l) + '.<br>' + countSol(f, o.p, l, n) + ' (Check: ' + t(k2 + '-' + k1 + '+1=' + n) + '.)', ['Divide each end by ' + t(o.p) + ' and round inward to find the first and last multiples.', HN[0]], 'multiples between');
      } }] },
    { num: '9', parts: [
      { id: '9', level: 'ADV', make: function (r) {
        var o = pw(function () { return { m: r.int(5, 12), rr: r.int(2, 11), N: r.pick([500, 600, 800, 1000, 1500, 2000]) }; }, function (z) { return z.rr < z.m && !(z.m === 7 && z.rr === 2 && z.N === 1000); });
        var last = o.N - 1 - ((o.N - 1 - o.rr) % o.m + o.m) % o.m, n = (last - o.rr) / o.m + 1;
        return S.numPart('How many whole numbers between ' + t(1) + ' and ' + t(F(o.N)) + ' leave a remainder of ' + t(o.rr) + ' when divided by ' + t(o.m) + '?', n, [[n - 1, 'u1l2-n-1', 'You found ' + t('n-1') + '. Add 1.'], [n + 1, 'u1l2-incl', 'Check the last one: it must be less than ' + t(F(o.N)) + '.'], [Math.floor(o.N / o.m), 'u1l2-rem', 'Write the numbers as a sequence: the first is ' + t(o.rr) + ' and each next one is ' + t(o.m) + ' more.']],
          'These are ' + t(arT(o.rr, o.m, 3)) + ' (' + t('t_1=' + o.rr) + ', ' + t('d=' + o.m) + '). The largest below ' + t(F(o.N)) + ' is ' + t(o.m + '\\times ' + Math.floor(last / o.m) + '+' + o.rr + '=' + F(last)) + '.<br>' + countSol(o.rr, o.m, last, n) + ' There are ' + t(n) + ' such numbers.', ['The numbers are ' + t(o.rr) + ', ' + t(o.rr + o.m) + ', ' + t(o.rr + 2 * o.m) + ', … Find the last one below ' + t(F(o.N)) + '.', HN[0]], 'remainder count');
      } }] },
    { num: '10', parts: [
      { id: '10a', sub: 'a', level: 'EMG', make: function (r) {
        var o = pw(function () { return { d: r.pick([1, -1]) * r.int(2, 8), k: r.int(12, 30), t1: r.int(-20, 30) }; }, function (z) { return !(z.d === -4 && z.k === 18) && z.t1 !== 0; });
        var tk = o.t1 + (o.k - 1) * o.d;
        return S.numPart('An arithmetic sequence has ' + t('d=' + o.d) + ' and ' + t(tsub(o.k) + '=' + tk) + '. Determine ' + t('t_1') + '.', o.t1, [[tk - o.k * o.d, 'u1l1-gt-n', 'From ' + t('t_1') + ' to ' + t(tsub(o.k)) + ' is ' + t(o.k - 1) + ' steps.'], [tk + (o.k - 1) * o.d, 'sign', 'Solve for ' + t('t_1') + ': subtract ' + t((o.k - 1) + vP(o.d)) + ' from ' + t(tk) + '.']],
          t(tk + '=t_1+(' + o.k + '-1)' + vP(o.d)) + ' &nbsp;⇒&nbsp; ' + t(tk + '=t_1' + sgn((o.k - 1) * o.d)) + ' &nbsp;⇒&nbsp; ' + t('t_1=' + o.t1), ['Substitute ' + t('t_n') + ', ' + t('n') + ' and ' + t('d') + ' into ' + t('t_n=t_1+(n-1)d') + ', then solve for ' + t('t_1') + '.'], 'find t1', { before: t('t_1=') });
      } },
      { id: '10b', sub: 'b', level: 'PRG', make: function (r) {
        var o = pw(function () { return { t1: r.int(-12, 10), d: r.pick([1, -1]) * (r.int(0, 3) + 0.5), k: r.int(11, 31) }; }, function (z) { return !(z.t1 === -6 && z.d === 2.5 && z.k === 21) && z.t1 !== 0; });
        var tk = o.t1 + (o.k - 1) * o.d;
        return S.fieldsPart('An arithmetic sequence has ' + t('t_1=' + o.t1) + ' and ' + t(tsub(o.k) + '=' + vT(tk)) + '. Determine ' + t('d') + ' and the general term.', [S.fNum('d', o.d, [[(tk - o.t1) / o.k, 'u1l1-gt-n', 'It takes ' + t(o.k - 1) + ' steps (not ' + t(o.k) + ') from ' + t('t_1') + ' to ' + t(tsub(o.k)) + '.']]), S.gtSpec('t_n', o.t1, o.d)],
          t(vT(tk) + '=' + o.t1 + '+' + (o.k - 1) + 'd') + ' &nbsp;⇒&nbsp; ' + t(vT(cl(tk - o.t1)) + '=' + (o.k - 1) + 'd') + ' &nbsp;⇒&nbsp; ' + t('d=' + vT(o.d)) + '<br>' + t(S.gtSteps(o.t1, o.d)), ['Substitute into ' + t('t_n=t_1+(n-1)d') + ' and solve for ' + t('d') + '.', S.HGT[1]], 'find d and general term');
      } },
      { id: '10c', sub: 'c', level: 'PRG', make: function (r) {
        var o = pw(function () { return { t1: 10 * r.int(4, 15), d: -r.pick([2.5, 3.5, 1.5, 4.5]), n: r.int(25, 60) }; }, function (z) { return !(z.t1 === 100 && z.d === -3.5) && z.t1 + (z.n - 1) * z.d < 0; });
        var L = o.t1 + (o.n - 1) * o.d;
        return S.numPart('An arithmetic sequence starts at ' + t(o.t1) + ' and has ' + t('d=' + vT(o.d)) + '. Its last term is ' + t(vT(L)) + '. How many terms does it have?', o.n, countCands(o.t1, o.d, L, o.n), countSol(o.t1, o.d, L, o.n) + ' It has ' + t(o.n) + ' terms.', HN, 'number of terms, decimal d', { after: 'terms' });
      } }] },
    { num: '11', stem: 'Insert the arithmetic means.', parts: [
      { id: '11a', sub: 'a', level: 'EMG', make: function (r) { var o = pw(function () { return { A: r.int(-20, 20), d: r.pick([1, -1]) * r.int(3, 9) }; }, function (z) { return !(z.A === -13 && z.d === 7) && !(z.A === 7 && z.d === -5); }); return meansPart('a', o.A, o.d, 4); } },
      { id: '11b', sub: 'b', level: 'PRG', make: function (r) { var o = pw(function () { var q = r.pick([2, 3, 4]); return { q: q, a: r.int(1, 7), b: r.int(1, 3) }; }, function (z) { return gcd(z.b, z.q) === 1 && z.a % z.q !== 0 && !(z.q === 2 && z.a === 1 && z.b === 1); }); return meansPart('b', o.a / o.q, o.b / o.q, 3, true); } },
      { id: '11c', sub: 'c', level: 'PRG', make: function (r) { var o = pw(function () { return { A: r.int(-30, 50) / 10, d: r.pick([1, -1]) * r.pick([0.3, 0.4, 0.6, 0.7, 0.8]) }; }, function (z) { return !(z.A === 3.2 && z.d === -0.6) && !S.isInt(z.A); }); return meansPart('c', o.A, o.d, 6); } }] },
    { num: '12', stem: 'Each set of expressions forms three consecutive terms of an arithmetic sequence. Find the value of the variable and the three terms.', parts: [
      { id: '12a', sub: 'a', level: 'ADV', make: function (r) {
        var o = S.c1nums(r, [[4, 1, 3, 6, 1, 9], [1, -4, 2, 1, 5, -2], [1, 1, 2, 3, 4, 1]]), T = exprTerms(o), L = S.linX;
        return S.fieldsPart('(a) ' + t(L(o.a1, o.b1) + ',\\quad ' + L(o.a2, o.b2) + ',\\quad ' + L(o.a3, o.b3)), [S.fNum('x', o.x, [[-o.x, 'sign', 'Check the signs as you collect the ' + t('x') + ' terms.']]), S.fNum('t_1', T[0]), S.fNum('t_2', T[1]), S.fNum('t_3', T[2])],
          exprSol(o, 'x') + '<br>Terms: ' + t(T.join(',\\ ')) + ' (' + t('d=' + (T[1] - T[0])) + ').', HE, 'expressions: x and terms');
      } },
      { id: '12b', sub: 'b', level: 'MAS', make: function (r) {
        var o = S.c1nums(r, [[2, 1, 5, -2, 6, 3], [1, -4, 2, 1, 5, -2], [1, 1, 2, 3, 4, 1]]), T = exprTerms(o), L = S.linX, d = T[1] - T[0];
        return S.fieldsPart('(b) ' + t(L(o.a1, o.b1, 'k') + ',\\quad ' + L(o.a2, o.b2, 'k') + ',\\quad ' + L(o.a3, o.b3, 'k')) + ' &nbsp; (then also give the general term)', [S.fNum('k', o.x, [[-o.x, 'sign', 'Check the signs as you collect the ' + t('k') + ' terms.']]), S.fNum('t_1', T[0]), S.fNum('t_2', T[1]), S.fNum('t_3', T[2]), S.gtSpec('t_n', T[0], d)],
          exprSol(o, 'k') + '<br>Terms: ' + t(T.join(',\\ ')) + '; &nbsp;' + t(S.gtSteps(T[0], d)) + '.', HE.concat([S.HGT[1]]), 'expressions: k, terms, general term');
      } }] },
    { num: '13', shared: function (r) { return pw(function () { return { t1: r.int(2, 12), d: r.int(3, 9) }; }, function (z) { return !(z.t1 === 3 && z.d === 4) && z.t1 !== z.d; }); },
      stem: function (o) { return 'A student says the general term of ' + t(arT(o.t1, o.d, 4)) + ' is ' + t('t_n=' + o.t1 + '+' + o.d + 'n') + '.'; },
      parts: [
        { id: '13a', sub: 'a', level: 'PRG', make: function (r, o) {
          return S.mc(r, 'Explain the error.', [
            { html: 'With ' + t('t_n=' + o.t1 + '+' + o.d + 'n') + ', ' + t('t_1=' + (o.t1 + o.d)) + ', not ' + t(o.t1) + ': the student used ' + t('n') + ' steps instead of ' + t('n-1') + '.', right: true },
            { html: 'The common difference should be ' + t(o.t1) + ', not ' + t(o.d) + '.', why: t(o.d) + ' is right: each term is ' + t(o.d) + ' more than the one before. Check what the formula gives for ' + t('t_1') + '.' },
            { html: 'The formula should multiply: ' + t('t_n=' + o.t1 + '(' + o.d + ')^{n}') + '.', why: 'The sequence adds ' + t(o.d) + ' each time, so it is arithmetic, not geometric.' },
            { html: 'There is no error: ' + t(o.t1 + '+' + o.d + 'n') + ' gives the sequence.', why: 'Test it: ' + t('n=1') + ' gives ' + t(o.t1 + o.d) + ', but ' + t('t_1=' + o.t1) + '.' }],
            'Test ' + t('n=1') + ': ' + t(o.t1 + '+' + o.d + '(1)=' + (o.t1 + o.d)) + ', which is ' + t('t_2') + '. It takes ' + t('n-1') + ' steps to get from ' + t('t_1') + ' to ' + t('t_n') + ', so the formula is ' + t('t_n=t_1+(n-1)d') + '.', ['Substitute ' + t('n=1') + ' into the student’s formula.'], 'explain the n − 1 error');
        } },
        { id: '13b', sub: 'b', level: 'EMG', make: function (r, o) { return S.gtPart('Write the correct general term in simplest form.', o.t1, o.d, null, null, 'correct general term'); } }] },
    { num: '14', parts: [
      { id: '14', level: 'BEG', make: function (r) {
        var k = pw(function () { return r.int(2, 9); }, function (z) { return z !== 5; }), s = r.int(4, 9) * k;
        return S.mc(r, '<i>(Multiple Choice)</i> Which sequence is arithmetic with a common difference of ' + t(-k) + '?', [
          { html: t(arT(s, -k, 4)), right: true }, { html: t(arT(-4 * k, k, 4)), why: 'Those terms go <b>up</b> by ' + t(k) + ': ' + t('d=+' + k) + '.' },
          { html: t(seqTex([k * k * k, k * k, k, 1])), why: 'Each term is the previous one divided by ' + t(k) + ': geometric, not arithmetic.' }, { html: t(seqTex([k, -k, k, -k])), why: 'The differences alternate (' + t(-2 * k) + ', ' + t(2 * k) + '): not arithmetic.' }],
          'In ' + t(arT(s, -k, 4)) + ' each term is ' + t(k) + ' less than the one before: ' + t('d=' + (-k)) + '.', S.HCLS, 'MC arithmetic with d = −k');
      } }] },
    { num: '15', parts: [
      { id: '15', level: 'ADV', make: function (r) {
        var o = pw(function () { return S.c1nums(r, [[1, 1, 2, 4, 4, -1], [1, -4, 2, 1, 5, -2]]); }, function (z) { var T = exprTerms(z), d = T[1] - T[0]; return [z.x, T[0], T[1]].every(function (v) { return v !== d; }) && z.x !== T[0] && z.x !== T[1] && T[0] !== T[1] && d > 0; }), T = exprTerms(o), d = T[1] - T[0], L = S.linX;
        return S.mc(r, '<i>(Multiple Choice)</i> The expressions ' + t(L(o.a1, o.b1, 'm')) + ', ' + t(L(o.a2, o.b2, 'm')) + ' and ' + t(L(o.a3, o.b3, 'm')) + ', in that order, form an arithmetic sequence. The common difference of the sequence is', [
          { html: t(d), right: true }, { html: t(o.x), why: t(o.x) + ' is the value of ' + t('m') + '. Substitute it to get the terms, then subtract.', code: 'gave-m' },
          { html: t(T[0]), why: t(T[0]) + ' is the first term.' }, { html: t(T[1]), why: t(T[1]) + ' is the second term.' }],
          exprSol(o, 'm') + '. Terms: ' + t(T.join(',\\ ')) + ', so ' + t('d=' + d) + '.', HE, 'MC common difference from expressions');
      } }] },
    { num: '16', parts: [
      { id: '16', level: 'MAS', make: function (r) {
        var o = pw(function () { return { a: r.int(2, 15), p: r.int(3, 8), b: r.int(120, 300), q: r.int(3, 8) }; }, function (z) { var s = (z.b - z.a) / (z.p + z.q); return !(z.a === 7 && z.p === 4 && z.b === 200 && z.q === 6) && !S.isInt(s) && s > 8; });
        var s = (o.b - o.a) / (o.p + o.q), n = Math.floor(s) + 2, Pn = function (k) { return o.a + (k - 1) * o.p; }, Qn = function (k) { return o.b - (k - 1) * o.q; };
        var opts = [n - 2, n - 1, n, n + 1].map(function (k) { return { html: t('n=' + k), right: k === n, why: k < n ? 'At ' + t('n=' + k) + ', P is ' + t(Pn(k)) + ' and Q is ' + t(Qn(k)) + ': P is still less.' : 'Check ' + t('n=' + (k - 1)) + ': P is ' + t(Pn(k - 1)) + ' and Q is ' + t(Qn(k - 1)) + ' — P is already greater.' }; });
        var gP = S.gtTex(o.a, o.p), gQ = S.gtTex(o.b, -o.q);
        return S.mc(r, '<i>(Multiple Choice)</i> Sequence P is ' + t(arT(o.a, o.p, 3)) + ' and sequence Q is ' + t(arT(o.b, -o.q, 3)) + '. The first position ' + t('n') + ' at which the term of P is greater than the term of Q is', opts,
          'P: ' + t('t_n=' + gP) + '. &nbsp; Q: ' + t('t_n=' + gQ) + '.<br>' + t(gP + '>' + gQ) + ' &nbsp;⇒&nbsp; ' + t((o.p + o.q) + 'n>' + (o.b - o.a + o.p + o.q)) + ' &nbsp;⇒&nbsp; ' + t('n>' + F(Math.round((s + 1) * 100) / 100)) + ', so ' + t('n=' + n) + ' (P: ' + t(Pn(n)) + ', Q: ' + t(Qn(n)) + '). At ' + t('n=' + (n - 1)) + ', P is ' + t(Pn(n - 1)) + ' and Q is ' + t(Qn(n - 1)) + '.', ['Write a general term for each sequence, then solve the inequality P > Q.'], 'MC first n with P > Q', true);
      } }] },
    { num: '17', parts: [
      { id: '17', level: 'ADV', make: function (r) {
        var o = pw(function () { return { k: r.int(5, 11), A: -r.int(5, 20), d: r.int(3, 9) + r.pick([0, 0.5]), j: 0 }; }, function (z) { z.j = 3 + (z.k > 6 ? 3 : 1); var v = z.A + (z.j - 1) * z.d; return !(z.k === 9 && z.A === -12 && z.d === 6.5) && v > 0 && String(v).length <= 4; });
        var B0 = o.A + (o.k + 1) * o.d, v = cl(o.A + (o.j - 1) * o.d), dd = (B0 - o.A) / o.k;
        var p = S.numPart('<i>(Numerical Response)</i> ' + numWord(o.k) + ' arithmetic means are inserted between ' + t(o.A) + ' and ' + t(vT(B0)) + '. The ' + ordWord(o.j) + ' term of the resulting sequence is ______.', v,
          [[cl(o.A + (o.j - 1) * dd), 'u1l2-means-steps', o.k + ' means plus the 2 ends make ' + t(o.k + 2) + ' terms, so there are ' + t(o.k + 1) + ' steps: ' + t(vT(B0) + '=' + o.A + '+' + (o.k + 1) + 'd') + '.'], [cl(o.A + o.j * o.d), 'u1l1-shift', 'That is ' + t(tsub(o.j + 1)) + '. ' + t(tsub(o.j) + '=t_1+' + (o.j - 1) + 'd') + '.']],
          t(o.k + 2) + ' terms: ' + t(vT(B0) + '=' + o.A + '+' + (o.k + 1) + 'd') + ' &nbsp;⇒&nbsp; ' + t('d=' + vT(o.d)) + '. &nbsp; ' + t(tsub(o.j) + '=' + o.A + '+' + (o.j - 1) + '(' + vT(o.d) + ')=' + vT(v)), ['How many terms are there altogether (means plus the two ends)?', 'Then use ' + t('t_n=t_1+(n-1)d') + ' to find ' + t('d') + '.'], 'NR term after inserting means');
        p.input.nr = true; return p;
      } }] },
    { num: '18', parts: [
      { id: '18', level: 'ADV', make: function (r) {
        var o = pw(function () { return { A: r.int(200, 900), k: r.int(3, 13) }; }, function (z) { return !(z.A === 400 && z.k === 7) && z.A % z.k !== 0; });
        var n = Math.floor(o.A / o.k) + 1, g = S.gtTex(o.A, -o.k);
        var p = S.numPart('<i>(Numerical Response)</i> The sequence ' + t(arT(o.A, -o.k, 3)) + ' continues forever. The number of positive terms in the sequence is ______.', n,
          [[n - 1, 'u1l2-n-1', 'Check the last positive term: ' + t(tsub(n) + '=' + (o.A - (n - 1) * o.k)) + ' is still positive.'], [n + 1, 'u1l2-zero-term', t(tsub(n + 1) + '=' + (o.A - n * o.k)) + ' is negative.'], [Math.round(o.A / o.k), 'u1l2-n-1', 'Solve ' + t(g + '>0') + ' and take the largest natural number that works.']],
          t('t_n=' + g + '>0') + ' &nbsp;⇒&nbsp; ' + t('n<' + F(Math.round((o.A + o.k) / o.k * 100) / 100)) + ', so ' + t('n\\le ' + n) + '. (' + t(tsub(n) + '=' + (o.A - (n - 1) * o.k)) + ', ' + t(tsub(n + 1) + '=' + (o.A - n * o.k)) + '.) There are ' + t(n) + ' positive terms.', ['Write the general term and solve ' + t('t_n>0') + '.'], 'NR number of positive terms');
        p.input.nr = true; return p;
      } }] }
  ];
  function numWord(k) { return ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'][k]; }
  function ordWord(k) { return ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth'][k]; }
  /* Q1: d and the next three terms */
  function q1part(lab, t1, d, frac, M) {
    var seq = S.arith(t1, d, 6), specs = [dSpec(d, frac)].concat(nextSpecs(t1, d, 4, 3, frac));
    var dline = M ? 'In ' + (M === 12 ? 'twelfths' : 'units of ' + t('\\frac{1}{' + M + '}')) + ': ' + t(seq.slice(0, 3).map(function (x) { return '\\frac{' + Math.round(x * M) + '}{' + M + '}'; }).join(',\\ ')) + ', so ' + t('d=' + vT(d, true)) + '.' : t('d=' + vT(seq[1], frac) + '-' + vP(seq[0], frac) + '=' + vT(d, frac)) + '.';
    return S.fieldsPart('(' + lab + ') ' + t(seqTex(seq.slice(0, 3), { frac: frac })), specs, dline + '<br>Next: ' + t(seq.slice(3).map(function (x) { return vT(x, frac); }).join(',\\ ')) + '.', ['Subtract the first term from the second to get ' + t('d') + '.', frac ? 'Write the fractions with a common denominator first.' : 'Add ' + t('d') + ' to get each next term.'], 'd and next three (' + lab + ')');
  }
  /* Q2: a row of five terms with one known */
  function q2part(lab, d, p, v, frac) {
    var t1 = v - (p - 1) * d, cells = [1, 2, 3, 4, 5].map(function (k) { return t1 + (k - 1) * d; });
    var row = cells.map(function (x, i) { return i === p - 1 ? vT(x, frac) : '?'; });
    var specs = [];
    cells.forEach(function (x, i) { var k = i + 1; if (k === p) return; specs.push(S.fNum(tsub(k), x, k < p ? [[v + (p - k) * d, 'u1l2-left', 'To go left, <b>subtract</b> ' + t('d') + ' (each term is ' + t('d') + ' more than the one before it).']] : [[v - (k - p) * d, 'u1l2-left', 'To go right, add ' + t(vP(d, frac)) + '.']], { frac: frac })); });
    return S.fieldsPart('(' + lab + ') ' + t('d=' + vT(d, frac)) + HW.valueTable([['n', 1, 2, 3, 4, 5], ['t_n'].concat(row)]), specs,
      (p > 1 ? 'Go left by subtracting ' + t(vP(d, frac)) + ' and ' : 'Go ') + 'right by adding ' + t(vP(d, frac)) + ': ' + t(cells.map(function (x) { return vT(x, frac); }).join(',\\ ')) + '.', ['Each term is ' + t('d') + ' more than the term before it.', 'Going left, subtract ' + t('d') + '.'], 'fill missing terms (' + lab + ')');
  }
  /* Q3: first four terms from t_k and d */
  function q3part(lab, k, t1, d) {
    var tk = t1 + (k - 1) * d, seq = S.arith(t1, d, 4);
    var specs = seq.map(function (x, i) { return S.fNum(tsub(i + 1), x, i === 0 && k > 1 ? [[tk - k * d, 'u1l1-gt-n', 'From ' + t('t_1') + ' to ' + t(tsub(k)) + ' is ' + t(k - 1) + ' steps.'], [tk + (k - 1) * d, 'u1l2-left', 'To go back to ' + t('t_1') + ', subtract ' + t('d') + ' (' + t(k - 1) + ' times).']] : []); });
    var pre = k === 1 ? t('t_1=' + t1 + ',\\ d=' + d) : t(tsub(k) + '=' + tk + ',\\ d=' + d);
    var sol = k === 1 ? 'Add ' + t(vP(d)) + ' each time: ' : k <= 3 ? 'Go left by subtracting ' + t(vP(d)) + ': ' : t('t_1=' + tk + '-' + (k - 1) + vP(d) + '=' + t1) + ': ';
    return S.fieldsPart('(' + lab + ') ' + pre, specs, sol + t(seqTex(seq, { inf: false })) + '.', ['Each term is ' + t('d') + ' more than the one before it.', 'Work back from ' + t(tsub(k)) + ' to ' + t('t_1') + ' by subtracting ' + t('d') + '.'], 'first four from t_k (' + lab + ')');
  }
  /* Q5: general term and t_N */
  function q5part(lab, t1, d, N) {
    var v = t1 + (N - 1) * d;
    return S.fieldsPart('(' + lab + ') ' + t(arT(t1, d, 3)) + ' &nbsp; Determine the general term and ' + t(tsub(N)) + '.', [S.gtSpec('t_n', t1, d), S.fNum(tsub(N), v, [[t1 + N * d, 'u1l1-gt-n', 'That is ' + t(tsub(N + 1)) + '.']])],
      t('d=' + vT(d)) + ': ' + t(S.gtSteps(t1, d)) + '<br>' + t(tsub(N) + '=' + S.gtTex(t1, d).replace('n', '(' + N + ')') + '=' + vT(v)), S.HGT, 'general term and t_N (' + lab + ')');
  }
  /* Q7: number of terms */
  function q7part(lab, t1, d, n) {
    var L = cl(t1 + (n - 1) * d);
    return S.numPart('(' + lab + ') ' + t(arT(t1, d, 3).replace(/\\dots$/, '\\dots,\\ ' + vT(L))), n, countCands(t1, d, L, n), countSol(t1, d, L, n), HN, 'number of terms (' + lab + ')', { after: 'terms' });
  }
  /* Q11: insert k arithmetic means between A and A + (k+1)d */
  function meansPart(lab, A, d, k, frac) {
    var Bv = cl(A + (k + 1) * d), seq = S.arith(A, d, k + 2), dw = (Bv - A) / k;
    var specs = seq.slice(1, k + 1).map(function (x, i) { return S.fNum('\\text{mean ' + (i + 1) + '}', x, [[cl(A + (i + 1) * dw), 'u1l2-means-steps', k + ' means plus the 2 ends make ' + t(k + 2) + ' terms: ' + t(k + 1) + ' steps from ' + t(vT(A, frac)) + ' to ' + t(vT(Bv, frac)) + '.']], { frac: frac }); });
    return S.fieldsPart('(' + lab + ') ' + ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven'][k] + ' means between ' + t(vT(A, frac)) + ' and ' + t(vT(Bv, frac)), specs,
      t(k + 2) + ' terms: ' + t(vT(Bv, frac) + '=' + vT(A, frac) + '+' + (k + 1) + 'd') + ', ' + t('d=' + vT(d, frac)) + '.<br>' + t(seq.map(function (x, i) { return i > 0 && i <= k ? '\\mathbf{' + vT(x, frac) + '}' : vT(x, frac); }).join(',\\ ')), ['With ' + t(k) + ' means the sequence has ' + t(k + 2) + ' terms: ' + t('t_1=' + vT(A, frac)) + ' and ' + t(tsub(k + 2) + '=' + vT(Bv, frac)) + '.', 'Find ' + t('d') + ', then build the means.'], 'insert ' + k + ' means (' + lab + ')');
  }
  /* Q6: plus / T tile figures with arms of length k */
  function armCells(A, k) {
    var c = [[0, 0]], dirs = A === 4 ? [[1, 0], [-1, 0], [0, 1], [0, -1]] : [[1, 0], [-1, 0], [0, -1]];
    dirs.forEach(function (dv) { for (var i = 1; i <= k; i++) c.push([dv[0] * i, dv[1] * i]); }); return c;
  }

  /* =============================== Extra Practice 2 =============================== */
  var EXTRA = [
    { num: 'A1', section: 'A. Skills', stem: 'Each sequence is arithmetic. State ' + t('d') + ' and the next two terms.', parts: [
      { id: 'eA1a', sub: 'a', level: 'BEG', make: function (r) { var o = pw(function () { return { t1: r.int(10, 25), d: r.int(6, 12) }; }, function (z) { return !(z.t1 === 17 && z.d === 9); }); return ep1part('a', o.t1, o.d); } },
      { id: 'eA1b', sub: 'b', level: 'BEG', make: function (r) { var o = pw(function () { return { t1: r.int(2, 12), d: -r.int(8, 13) }; }, function (z) { return !(z.t1 === 8 && z.d === -11); }); return ep1part('b', o.t1, o.d); } },
      { id: 'eA1c', sub: 'c', level: 'EMG', make: function (r) { var o = pw(function () { return { t1: -r.int(10, 30) / 10, d: r.int(3, 8) / 10 }; }, function (z) { return !(z.t1 === -2.4 && z.d === 0.6); }); return ep1part('c', o.t1, o.d); } },
      { id: 'eA1d', sub: 'd', level: 'PRG', make: function (r) { var o = pw(function () { var q = r.pick([3, 5, 7]); return { q: q, a: r.int(1, q - 1), b: r.int(1, q - 1) }; }, function (z) { return !(z.q === 5 && z.a === 3 && z.b === 2); }); return ep1part('d', o.a / o.q, o.b / o.q, true); } },
      { id: 'eA1e', sub: 'e', level: 'PRG', make: function (r) {
        var o = pw(function () { return { a: r.int(1, 4), b: r.int(-6, 9), c: r.int(2, 4), e: -r.int(1, 4) }; }, function (z) { return !(z.a === 2 && z.b === 7 && z.c === 3 && z.e === -3) && z.b !== 0; });
        var p0 = P.add(P.mono(o.a, { a: 1 }), P.num(o.b)), dp = P.add(P.mono(o.c, { a: 1 }), P.num(o.e)), seq = polySeq(p0, dp, 5);
        var specs = [S.fPoly('d', dp, { var: 'a' }), S.fPoly('t_4', seq[3], { var: 'a', wrong: [{ is: seq[2], code: 'u1l1-shift', hint: 'Add ' + t('d') + ' to the third term.' }] }), S.fPoly('t_5', seq[4], { var: 'a' })];
        return S.fieldsPart('(e) ' + t(seq.slice(0, 3).map(polyTex).join(',\\ ') + ',\\ \\dots'), specs, t('d=(' + polyTex(seq[1]) + ')-(' + polyTex(seq[0]) + ')=' + polyTex(dp)) + '. Next: ' + t(polyTex(seq[3]) + ',\\ ' + polyTex(seq[4])) + '.', ['Subtract: collect the ' + t('a') + ' terms and the numbers separately.'], 'EP d and next two (algebraic)');
      } }] },
    { num: 'A2', parts: [
      { id: 'eA2', level: 'EMG', make: function (r) {
        var o = pw(function () { return { k: r.int(3, 6), tk: r.int(-15, 10), d: r.pick([1.5, 2.5, 3.5, -1.5, -2.5]) }; }, function (z) { return !(z.k === 4 && z.tk === -6 && z.d === 2.5); });
        var t1 = o.tk - (o.k - 1) * o.d, seq = S.arith(t1, o.d, 5);
        return S.fieldsPart('An arithmetic sequence has ' + t(tsub(o.k) + '=' + o.tk) + ' and ' + t('d=' + vT(o.d)) + '. Write the first five terms.', seq.map(function (x, i) { return S.fNum(tsub(i + 1), x, i === 0 ? [[o.tk - o.k * o.d, 'u1l1-gt-n', 'From ' + t('t_1') + ' to ' + t(tsub(o.k)) + ' is ' + t(o.k - 1) + ' steps.'], [o.tk + (o.k - 1) * o.d, 'u1l2-left', 'To go back, subtract ' + t('d') + '.']] : []); }),
          t('t_1=' + o.tk + '-' + (o.k - 1) + vP(o.d) + '=' + vT(t1)) + ': ' + t(seqTex(seq, { inf: false })), ['Work back from ' + t(tsub(o.k)) + ' by subtracting ' + t('d') + '.'], 'EP first five from t_k');
      } }] },
    { num: 'A3', stem: 'Determine the general term in simplest form and the given term.', parts: [
      { id: 'eA3a', sub: 'a', level: 'EMG', make: function (r) { var o = pw(function () { return { t1: r.int(2, 12), d: r.int(3, 9), N: r.int(40, 70) }; }, function (z) { return !(z.t1 === 6 && z.d === 5); }); return q5part('a', o.t1, o.d, o.N); } },
      { id: 'eA3b', sub: 'b', level: 'EMG', make: function (r) { var o = pw(function () { return { t1: r.int(60, 99), d: -r.int(4, 11), N: r.int(40, 70) }; }, function (z) { return !(z.t1 === 90 && z.d === -8); }); return q5part('b', o.t1, o.d, o.N); } },
      { id: 'eA3c', sub: 'c', level: 'PRG', make: function (r) { var o = pw(function () { return { t1: -r.int(3, 12), d: r.pick([1.5, 2.5, 3.5, 0.5]), N: r.int(40, 70) }; }, function (z) { return !(z.t1 === -7 && z.d === 2.5); }); return q5part('c', o.t1, o.d, o.N); } }] },
    { num: 'A4', stem: 'Determine the number of terms in each sequence.', parts: [
      { id: 'eA4a', sub: 'a', level: 'EMG', make: function (r) { var o = pw(function () { return { t1: r.int(5, 20), d: r.int(4, 9), n: r.int(25, 50) }; }, function (z) { return !(z.t1 === 12 && z.d === 7); }); return q7part('a', o.t1, o.d, o.n); } },
      { id: 'eA4b', sub: 'b', level: 'PRG', make: function (r) { var o = pw(function () { return { t1: 10 * r.int(4, 9), d: -r.pick([1.5, 2.5, 3.5, 4.5]), n: r.int(15, 35) }; }, function (z) { return !(z.t1 === 60 && z.d === -3.5); }); return q7part('b', o.t1, o.d, o.n); } }] },
    { num: 'A5', parts: [
      { id: 'eA5a', sub: 'a', level: 'EMG', make: function (r) {
        var o = pw(function () { return { t1: r.int(5, 30), d: -r.int(2, 6), n: r.int(25, 50) }; }, function (z) { return !(z.t1 === 14 && z.d === -3) && z.t1 + (z.n - 1) * z.d < 0; });
        var V = o.t1 + (o.n - 1) * o.d;
        return S.numPart('An arithmetic sequence has ' + t('t_1=' + o.t1) + ' and ' + t('d=' + o.d) + '. Which term is ' + t(V) + '? Give its position ' + t('n') + '.', o.n, countCands(o.t1, o.d, V, o.n), countSol(o.t1, o.d, V, o.n) + ': ' + t(tsub(o.n)) + '.', HN, 'EP which term', { before: 'n =' });
      } },
      { id: 'eA5b', sub: 'b', level: 'EMG', make: function (r) {
        var o = pw(function () { return { d: r.int(3, 9), k: r.int(20, 40), t1: r.int(-9, 9) }; }, function (z) { return !(z.d === 7 && z.k === 30) && z.t1 !== 0; });
        var tk = o.t1 + (o.k - 1) * o.d;
        return S.numPart('An arithmetic sequence has ' + t('d=' + o.d) + ' and ' + t(tsub(o.k) + '=' + tk) + '. Determine ' + t('t_1') + '.', o.t1, [[tk - o.k * o.d, 'u1l1-gt-n', 'From ' + t('t_1') + ' to ' + t(tsub(o.k)) + ' is ' + t(o.k - 1) + ' steps.']], t(tk + '=t_1+' + (o.k - 1) + '(' + o.d + ')') + ' &nbsp;⇒&nbsp; ' + t('t_1=' + tk + '-' + ((o.k - 1) * o.d) + '=' + o.t1), ['Substitute and solve for ' + t('t_1') + '.'], 'EP find t1', { before: t('t_1=') });
      } },
      { id: 'eA5c', sub: 'c', level: 'EMG', make: function (r) {
        var o = pw(function () { return { t1: -r.int(5, 30), d: r.int(2, 7), k: r.int(12, 25) }; }, function (z) { return !(z.t1 === -20 && z.k === 17 && z.d === 3); });
        var tk = o.t1 + (o.k - 1) * o.d;
        return S.numPart('An arithmetic sequence has ' + t('t_1=' + o.t1) + ' and ' + t(tsub(o.k) + '=' + tk) + '. Determine ' + t('d') + '.', o.d, [[(tk - o.t1) / o.k, 'u1l1-gt-n', 'It is ' + t(o.k - 1) + ' steps from ' + t('t_1') + ' to ' + t(tsub(o.k)) + '.'], [-o.d, 'u1l1-d-sign', 'Check the sign.']], t(tk + '=' + o.t1 + '+' + (o.k - 1) + 'd') + ' &nbsp;⇒&nbsp; ' + t((tk - o.t1) + '=' + (o.k - 1) + 'd') + ' &nbsp;⇒&nbsp; ' + t('d=' + o.d), ['Substitute and solve for ' + t('d') + '.'], 'EP find d', { before: t('d=') });
      } }] },
    { num: 'B1', section: 'B. Applying', parts: [
      { id: 'eB1', level: 'EMG', make: function (r) { var o = pw(function () { return { A: r.int(-20, 10), d: r.pick([1, -1]) * r.int(2, 7) }; }, function (z) { return !(z.A === -9 && z.d === 4); }); return meansPart('B1', o.A, o.d, 5); } }] },
    { num: 'B2', parts: [
      { id: 'eB2', level: 'PRG', make: function (r) {
        var o = pw(function () { return { m: r.int(4, 9), A: r.int(150, 400), span: r.int(300, 700) }; }, function (z) { return z.A % z.m !== 0 && (z.A + z.span) % z.m !== 0 && !(z.m === 6 && z.A === 250); });
        var Bv = o.A + o.span, k1 = Math.ceil(o.A / o.m), k2 = Math.floor(Bv / o.m), f = o.m * k1, l = o.m * k2, n = k2 - k1 + 1;
        return S.numPart('How many multiples of ' + t(o.m) + ' are there between ' + t(o.A) + ' and ' + t(Bv) + '?', n, [[n - 1, 'u1l2-n-1', 'You found ' + t('n-1') + ': add 1.'], [n + 1, 'u1l2-outside', 'Check the first and last multiples: they must be between ' + t(o.A) + ' and ' + t(Bv) + '.']],
          'First: ' + t(o.m + '\\times ' + k1 + '=' + f) + '; last: ' + t(o.m + '\\times ' + k2 + '=' + l) + '.<br>' + countSol(f, o.m, l, n), ['Find the first and last multiples in the interval: they are ' + t('t_1') + ' and ' + t('t_n') + '.', HN[0]], 'EP multiples between');
      } }] },
    { num: 'B3', shared: function (r) { var sh = r.pick([['triangle', 3], ['pentagon', 5], ['hexagon', 6]]); return pw(function () { return { name: sh[0], s: sh[1], N: r.int(40, 90), T: r.int(150, 400) }; }, function (z) { return !(z.name === 'triangle' && z.N === 60 && z.T === 250) && (z.T - 1) % (z.s - 1) !== 0; }); },
      stem: function (o) { var f = function (n) { return 1 + (o.s - 1) * n; }; return 'Toothpicks make a row of ' + o.name + 's that share sides: 1 ' + o.name + ' uses ' + t(f(1)) + ' toothpicks, 2 ' + o.name + 's use ' + t(f(2)) + ', and 3 ' + o.name + 's use ' + t(f(3)) + '.'; },
      parts: [
        { id: 'eB3a', sub: 'a', level: 'EMG', make: function (r, o) { return S.gtPart('Determine the general term.', o.s, o.s - 1, null, null, 'EP toothpicks general term'); } },
        { id: 'eB3b', sub: 'b', level: 'EMG', make: function (r, o) { var v = 1 + (o.s - 1) * o.N; return S.numPart('How many toothpicks make a row of ' + t(o.N) + ' ' + o.name + 's?', v, [[o.s * o.N, 'value', 'Neighbouring ' + o.name + 's share a toothpick: use the general term.']], t(tsub(o.N) + '=' + (o.s - 1) + '(' + o.N + ')+1=' + v), S.HTERM, 'EP toothpicks for N shapes'); } },
        { id: 'eB3c', sub: 'c', level: 'PRG', make: function (r, o) { var nn = (o.T - 1) / (o.s - 1), n = Math.floor(nn); return S.numPart('With ' + t(o.T) + ' toothpicks, what is the longest row of ' + o.name + 's that can be made?', n, [[n + 1, 'u1l2-floor', 'Round <b>down</b>: ' + t(n + 1) + ' ' + o.name + 's need ' + t(1 + (o.s - 1) * (n + 1)) + ' toothpicks.']], t((o.s - 1) + 'n+1=' + o.T) + ' &nbsp;⇒&nbsp; ' + t('n\\approx ' + F(Math.round(nn * 100) / 100)) + '. Round down: ' + t(n) + ' ' + o.name + 's (' + t(1 + (o.s - 1) * n) + ' toothpicks).', ['Set the general term equal to ' + t(o.T) + ' and solve; you can’t make part of a shape.'], 'EP longest row', { after: o.name + 's' }); } }] },
    { num: 'B4', parts: [
      { id: 'eB4', level: 'ADV', make: function (r) {
        var o = S.c1nums(r, [[1, 7, 3, 1, 4, 3]]), T = exprTerms(o), L = S.linX;
        return S.fieldsPart('The expressions ' + t(L(o.a1, o.b1, 'y')) + ', ' + t(L(o.a2, o.b2, 'y')) + ' and ' + t(L(o.a3, o.b3, 'y')) + ' are consecutive terms of an arithmetic sequence. Determine ' + t('y') + ' and the three terms.', [S.fNum('y', o.x, [[-o.x, 'sign', 'Check the signs.']]), S.fNum('t_1', T[0]), S.fNum('t_2', T[1]), S.fNum('t_3', T[2])],
          exprSol(o, 'y') + '<br>Terms: ' + t(T.join(',\\ ')) + '.', HE, 'EP expressions: y and terms');
      } }] },
    { num: 'B5', parts: [
      { id: 'eB5', level: 'EMG', make: function (r) {
        var o = pw(function () { return { t1: r.int(2, 15), d: r.int(3, 9), N: r.int(18, 40) }; }, function (z) { return !(z.t1 === 4 && z.d === 6 && z.N === 25); });
        var v = o.t1 + (o.N - 1) * o.d;
        return S.mc(r, '<i>(Multiple Choice)</i> The ' + S.ord(o.N) + ' term of the arithmetic sequence ' + t(arT(o.t1, o.d, 3)) + ' is', [
          { html: t(v), right: true }, { html: t(o.t1 + o.N * o.d), why: 'That uses ' + t(o.N + 'd') + '. From ' + t('t_1') + ' to ' + t(tsub(o.N)) + ' is ' + t(o.N - 1) + ' steps.' },
          { html: t(o.N * o.d), why: 'Start from ' + t('t_1=' + o.t1) + ': ' + t('t_n=t_1+(n-1)d') + '.' }, { html: t(o.t1 + (o.N - 2) * o.d), why: 'That is ' + t(tsub(o.N - 1)) + '.' }],
          t(tsub(o.N) + '=' + o.t1 + '+' + (o.N - 1) + '(' + o.d + ')=' + v) + '.', S.HTERM, 'EP MC t_N');
      } }] },
    { num: 'B6', parts: [
      { id: 'eB6', level: 'PRG', make: function (r) {
        var m = pw(function () { return r.int(7, 19); }, function (z) { return z !== 11; }), k1 = Math.ceil(100 / m), k2 = Math.floor(999 / m), n = k2 - k1 + 1;
        var p = S.numPart('<i>(Numerical Response)</i> The number of three-digit whole numbers that are multiples of ' + t(m) + ' is ______.', n, [[n - 1, 'u1l2-n-1', 'Add 1: ' + t('n-1') + ' is the number of steps.'], [k2, 'u1l2-outside', 'Count only the three-digit multiples (from ' + t(m * k1) + ').']],
          'First: ' + t(m * k1) + ', last: ' + t(m * k2) + '. &nbsp; ' + countSol(m * k1, m, m * k2, n), ['The smallest three-digit number is 100 and the largest is 999.', HN[0]], 'EP NR three-digit multiples');
        p.input.nr = true; return p;
      } }] },
    { num: 'C1', section: 'C. Stretch', shared: function (r) { return pw(function () { var r1 = r.int(1, 5), r2 = r.int(2, 7), p = r.int(2, 6); return { r1: Math.min(r1, r2), r2: Math.max(r1, r2), p: p }; }, function (z) { var q = 2 * z.p - (z.r1 + z.r2); return z.r1 !== z.r2 && q !== 0 && !(z.p === 4 && z.r1 === 1 && z.r2 === 4); }); },
      stem: function (o) { var q = 2 * o.p - (o.r1 + o.r2), c = o.r1 * o.r2; return 'The expressions ' + t('x^{2}') + ', ' + t(o.p + 'x') + ' and ' + t(S.linX(q, c)) + ' are consecutive terms of an arithmetic sequence.'; },
      parts: [
        { id: 'eC1a', sub: 'a', level: 'MAS', make: function (r, o) {
          var q = 2 * o.p - (o.r1 + o.r2), c = o.r1 * o.r2, sx = o.r1 + o.r2;
          return S.fieldsPart('Determine the possible values of ' + t('x') + ' (smaller one first).', [S.fNum('x', o.r1, [[-o.r1, 'sign', 'Check the signs when you factor.']]), S.fNum('x', o.r2, [[-o.r2, 'sign', 'Check the signs when you factor.']])],
            t(o.p + 'x-x^{2}=(' + S.linX(q, c) + ')-' + o.p + 'x') + ' &nbsp;⇒&nbsp; ' + t('x^{2}' + (sx ? '-' + sx + 'x' : '') + '+' + c + '=0') + ' &nbsp;⇒&nbsp; ' + t('(x-' + o.r1 + ')(x-' + o.r2 + ')=0') + ', so ' + t('x=' + o.r1) + ' or ' + t('x=' + o.r2) + '.', ['Set the two differences equal. This time you get a quadratic equation: collect everything on one side and factor.'], 'EP stretch: quadratic for x');
        } },
        { id: 'eC1b', sub: 'b', level: 'MAS', make: function (r, o) {
          var q = 2 * o.p - (o.r1 + o.r2), c = o.r1 * o.r2, T = function (x) { return [x * x, o.p * x, q * x + c]; }, A = T(o.r1), Bt = T(o.r2);
          var specs = [];
          [[o.r1, A], [o.r2, Bt]].forEach(function (z) { [0, 1, 2].forEach(function (i) { specs.push(S.fNum('x=' + z[0] + ':\\ t_' + (i + 1), z[1][i], [])); }); });
          return S.fieldsPart('State the three terms for each value of ' + t('x') + '.', specs, t('x=' + o.r1) + ': ' + t(A.join(',\\ ')) + ' (' + t('d=' + (A[1] - A[0])) + '). &nbsp; ' + t('x=' + o.r2) + ': ' + t(Bt.join(',\\ ')) + ' (' + t('d=' + (Bt[1] - Bt[0])) + ').', ['Substitute each value of ' + t('x') + ' into the three expressions.'], 'EP stretch: terms for each x');
        } }] },
    { num: 'C2', shared: function (r) {
        return pw(function () { var p = r.int(3, 9), q = r.int(3, 9); return { a: r.int(1, 9), p: p, b: r.int(1, 9), q: q, N: r.pick([500, 800, 1000, 1200]) }; }, function (z) {
          if (gcd(z.p, z.q) !== 1 || z.p === z.q || (z.a === 5 && z.p === 7 && z.b === 3 && z.q === 5)) return false; var c = c2first(z); return c && c < 200;
        });
      },
      stem: function (o) { return 'Sequence A is ' + t(arT(o.a, o.p, 3)) + ' and sequence B is ' + t(arT(o.b, o.q, 3)); },
      parts: [
        { id: 'eC2a', sub: 'a', level: 'ADV', make: function (r, o) {
          var c0 = c2first(o), L = o.p * o.q;
          return S.fieldsPart('Find the first two numbers that appear in both sequences.', [S.fNum('\\text{first}', c0, [[c0 + L, 'value', 'That is a common number, but not the first one.']]), S.fNum('\\text{second}', c0 + L, [[c0 + Math.max(o.p, o.q), 'u1l2-lcm', 'Check that it is in both lists.']])],
            'A: ' + t(S.arith(o.a, o.p, 8).join(',\\ ') + ',\\ \\dots') + '<br>B: ' + t(S.arith(o.b, o.q, 8).join(',\\ ') + ',\\ \\dots') + '<br>Common: ' + t(c0) + ' and ' + t(c0 + L) + '.', ['List more terms of each sequence and look for numbers in both lists.'], 'EP stretch: first common terms');
        } },
        { id: 'eC2b', sub: 'b', level: 'PRG', make: function (r, o) {
          var L = o.p * o.q;
          return S.mc(r, 'The common numbers form an arithmetic sequence. Why is its common difference ' + t(L) + '?', [
            { html: 'To get from one common number to the next you must add a multiple of ' + t(o.p) + ' (to stay in A) and a multiple of ' + t(o.q) + ' (to stay in B); the smallest such step is ' + t(L) + '.', right: true },
            { html: 'Because ' + t(o.p + '+' + o.q + '+' + (L - o.p - o.q)) + ' is ' + t(L) + '.', why: 'The step has to be a multiple of both common differences.' },
            { html: 'Because the first common number is ' + t(c2first(o)) + '.', why: 'Where it starts doesn’t set the step size. The step must be a multiple of ' + t(o.p) + ' and of ' + t(o.q) + '.' },
            { html: 'Because ' + t(L) + ' is the difference between the two sequences’ first terms.', why: 'Check: ' + t(o.a + '-' + o.b) + ' is not ' + t(L) + '. Think about multiples of ' + t(o.p) + ' and ' + t(o.q) + '.' }],
            'Moving along A adds multiples of ' + t(o.p) + '; moving along B adds multiples of ' + t(o.q) + '. A step that keeps you in both is a common multiple, and the smallest is ' + t(o.p + '\\times ' + o.q + '=' + L) + ' (they share no factor).', ['What kind of number can you add and stay in sequence A? In sequence B?'], 'EP stretch: why the step is the lcm');
        } },
        { id: 'eC2c', sub: 'c', level: 'MAS', make: function (r, o) {
          var c0 = c2first(o), L = o.p * o.q, n = Math.floor((o.N - 1 - c0) / L) + 1, last = c0 + (n - 1) * L;
          return S.numPart('How many numbers less than ' + t(F(o.N)) + ' appear in both sequences?', n, [[n - 1, 'u1l2-n-1', 'You found the number of steps: add 1.'], [n + 1, 'u1l2-incl', 'Check the last one: ' + t(c0 + n * L) + ' is not less than ' + t(F(o.N)) + '.']],
            t(c0 + '+' + L + '(n-1)<' + F(o.N)) + ' &nbsp;⇒&nbsp; ' + t('n-1<' + F(Math.round((o.N - c0) / L * 100) / 100)) + ', so ' + t('n=' + n) + ' (the ' + S.ord(n) + ' is ' + t(last) + ').', ['The common numbers start at ' + t(c0) + ' with ' + t('d=' + L) + '. Solve ' + t('t_n<' + o.N) + '.'], 'EP stretch: count common terms');
        } }] }
  ];
  function c2first(o) { var start = Math.max(o.a, o.b); for (var x = start; x < start + o.p * o.q + 1; x++) if ((x - o.a) % o.p === 0 && (x - o.b) % o.q === 0) return x; return null; }
  function ep1part(lab, t1, d, frac) {
    var seq = S.arith(t1, d, 5), specs = [dSpec(d, frac)].concat(nextSpecs(t1, d, 4, 2, frac));
    return S.fieldsPart('(' + lab + ') ' + t(seqTex(seq.slice(0, 3), { frac: frac })), specs, t('d=' + vT(seq[1], frac) + '-' + vP(seq[0], frac) + '=' + vT(d, frac)) + '. Next: ' + t(vT(seq[3], frac) + ',\\ ' + vT(seq[4], frac)) + '.', ['Subtract the first term from the second to get ' + t('d') + '.'], 'EP d and next two (' + lab + ')');
  }

  HW.defineLesson({ id: LID, unit: 1, num: '2', title: 'Arithmetic Sequences', outcome: 'RF9', questions: QUESTIONS, extra: EXTRA });
})(window);
