/* Math 20-1 · Unit 1 · Lesson 3 — Arithmetic Sequences in Context (outcome RF9 on every part)
 * Assignment 3 (u1_l03.tex, Questions 1–15) and the Lesson 3 Extra Practice (u1_ep03.tex, A1–A4, B1–B6, C1–C3).
 * Uses the sequence kit in u1l1.js (HW.seqKit13), so u1l1.js must load first.
 * Every part is a generator: the booklet question with new numbers and the same context (the lesson's example numbers
 * and the booklet's own numbers are left out). On-screen calculator allowed; money answers are exact here.
 * Conversions: "what do m and b represent" / "why are the points not joined" / "is 100 a term? explain" → multiple choice;
 * "plot the points" → the graph pad (points snap to the grid).
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: 5(b), Extra C1 and C2. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, F = HW.fmt, t = K.t, P = HW.poly, S = HW.seqKit13;
  if (!S) throw new Error('u1l3.js needs js/lessons/u1l1.js (the sequence kit) to load first');
  var LID = 'u1l3', cl = S.cl, isInt = S.isInt, vT = S.vT, vP = S.vP, sgn = S.sgn, seqTex = S.seqTex, tsub = S.tsub;
  function pw(gen, okf) { return S.pickWhere(gen, okf, LID); }
  function money(x) { return '\\$' + F(cl(x)); }
  function mT(x) { return t(money(x)); }

  HW.addCodes({
    'u1l3-d-steps': 'd from two terms: divided by the wrong number of steps', 'u1l3-pairs': 'Gave the number of pairs, not rows', 'u1l3-row-pair': 'Used the row number as the pair number',
    'u1l3-pos': 'Value after k periods: wrong position (t_k vs t_{k+1})', 'u1l3-compound': 'Used compound interest (simple interest is the same every year)', 'u1l3-boundary': 'Inequality: took the boundary value (needs strictly more/less)',
    'u1l3-round-up': 'Rounded up where the answer must round down (or the reverse)', 'u1l3-interest-total': 'Gave the total instead of the yearly interest', 'u1l3-depth-step': 'Depth: forgot that reading 1 is at the surface',
    'u1l3-m-b-swap': 'Slope and intercept mixed up'
  });
  HW.addPartial({ 'u1l3-d-steps': 'b', 'u1l3-pairs': 'b', 'u1l3-row-pair': 'b', 'u1l3-pos': 's', 'u1l3-compound': 'n', 'u1l3-boundary': 's', 'u1l3-round-up': 's', 'u1l3-interest-total': 'b', 'u1l3-depth-step': 's', 'u1l3-m-b-swap': 'n' });

  /* d, t1 and the general term from two terms */
  function dCands(tp, p, tq, q, d) { return [[(tq - tp) / q, 'u1l3-d-steps', 'From ' + t(tsub(p)) + ' to ' + t(tsub(q)) + ' is ' + t(q - p) + ' steps: divide the change in the terms by ' + t(q + '-' + p + '=' + (q - p)) + '.'], [(tq - tp) / (q - p + 1), 'u1l3-d-steps', 'Count the steps: ' + t(q + '-' + p + '=' + (q - p)) + '.'], [-d, 'u1l1-d-sign', 'Subtract in the same order: later term minus earlier term.']]; }
  function t1Cands(tp, p, d) { return [[tp - p * d, 'u1l1-gt-n', t(tsub(p)) + ' is ' + t(p - 1) + ' steps after ' + t('t_1') + ': ' + t(tsub(p) + '=t_1+' + (p - 1) + 'd') + '.'], [tp + (p - 1) * d, 'sign', 'Solve for ' + t('t_1') + ': subtract ' + t((p - 1) + 'd') + '.']]; }
  function dSol(tp, p, tq, q, d) { return t('d=\\dfrac{' + vT(tq) + '-' + vP(tp) + '}{' + q + '-' + p + '}=\\dfrac{' + vT(cl(tq - tp)) + '}{' + (q - p) + '}=' + vT(d)); }
  function t1Sol(tp, p, d, t1) { return t(vT(tp) + '=t_1+' + (p - 1) + vP(d)) + ' &nbsp;⇒&nbsp; ' + t('t_1=' + vT(t1)); }
  var HD = ['From ' + t('t_p') + ' to ' + t('t_q') + ' is ' + t('q-p') + ' steps: ' + t('d=\\dfrac{t_q-t_p}{q-p}') + '.', 'Then substitute one known term into ' + t('t_n=t_1+(n-1)d') + ' to find ' + t('t_1') + '.'];
  function twoTermPart(lab, t1, d, p, q) {
    var tp = cl(t1 + (p - 1) * d), tq = cl(t1 + (q - 1) * d);
    return S.fieldsPart((lab ? '(' + lab + ') ' : '') + t(tsub(p) + '=' + vT(tp) + ',\\quad ' + tsub(q) + '=' + vT(tq)), [S.fNum('d', d, dCands(tp, p, tq, q, d)), S.fNum('t_1', t1, t1Cands(tp, p, d)), S.gtSpec('t_n', t1, d)],
      dSol(tp, p, tq, q, d) + '<br>' + t1Sol(tp, p, d, t1) + '<br>' + t(S.gtSteps(t1, d)), HD, 'd, t1, general term from two terms' + (lab ? ' (' + lab + ')' : ''));
  }
  function seqGraph(t1, d) { return S.fig(S.graph(S.arith(t1, d, 5).map(function (y, i) { return [i + 1, y]; }), { nmax: 6 })); }

  /* =============================== Assignment 3 =============================== */
  var QUESTIONS = [
    { num: '1', stem: 'For each arithmetic sequence, determine ' + t('d') + ', ' + t('t_1') + ' and the general term.', parts: [
      { id: '1a', sub: 'a', level: 'BEG', make: function (r) { var o = pw(function () { var p = r.int(3, 6); return { t1: r.int(-5, 12), d: r.int(2, 8), p: p, q: p + r.int(5, 9) }; }, function (z) { return z.t1 !== 0 && !(z.p === 5 && z.q === 12 && z.d === 4 && z.t1 === 7) && !(z.p === 4 && z.q === 11 && z.d === 5 && z.t1 === 4); }); return twoTermPart('a', o.t1, o.d, o.p, o.q); } },
      { id: '1b', sub: 'b', level: 'EMG', make: function (r) { var o = pw(function () { var p = r.int(2, 3); return { t1: r.int(10, 25), d: -r.int(2, 6), p: p, q: r.int(12, 18) }; }, function (z) { return !(z.p === 2 && z.q === 15 && z.d === -4 && z.t1 === 15); }); return twoTermPart('b', o.t1, o.d, o.p, o.q); } },
      { id: '1c', sub: 'c', level: 'PRG', make: function (r) { var o = pw(function () { var p = r.int(6, 10); return { t1: r.int(-8, 6) + 0.5, d: r.pick([0.5, 1.5, 2.5]), p: p, q: p + r.int(10, 14) }; }, function (z) { return !(z.p === 8 && z.q === 20 && z.d === 0.5) && !(z.p === 6 && z.q === 20); }); return twoTermPart('c', o.t1, o.d, o.p, o.q); } }] },
    { num: '2', parts: [
      { id: '2', level: 'PRG', make: function (r) {
        var o = pw(function () { var p = r.int(3, 5); return { tp: r.int(-8, 6), d: r.pick([1.5, 2.5, 3.5, 4.5]), p: p, q: p + 2 * r.int(2, 4), N: r.int(25, 40) }; }, function (z) { return !(z.p === 4 && z.q === 10 && z.tp === -1) && z.tp !== 0; });
        var t1 = cl(o.tp - (o.p - 1) * o.d), tq = cl(o.tp + (o.q - o.p) * o.d), tN = cl(t1 + (o.N - 1) * o.d);
        return S.fieldsPart('An arithmetic sequence has ' + t(tsub(o.p) + '=' + vT(o.tp)) + ' and ' + t(tsub(o.q) + '=' + vT(tq)) + '. Use a system of equations to determine ' + t('t_1') + ' and ' + t('d') + ', then determine ' + t(tsub(o.N)) + '.', [
          S.fNum('t_1', t1, t1Cands(o.tp, o.p, o.d)), S.fNum('d', o.d, dCands(o.tp, o.p, tq, o.q, o.d)), S.fNum(tsub(o.N), tN, [[cl(t1 + o.N * o.d), 'u1l1-gt-n', 'That is ' + t(tsub(o.N + 1)) + '.']])],
          t('t_1+' + (o.p - 1) + 'd=' + vT(o.tp)) + ' and ' + t('t_1+' + (o.q - 1) + 'd=' + vT(tq)) + '. Subtract: ' + t((o.q - o.p) + 'd=' + vT(cl(tq - o.tp))) + ' &nbsp;⇒&nbsp; ' + t('d=' + vT(o.d)) + '.<br>' + t('t_1=' + vT(o.tp) + '-' + (o.p - 1) + vP(o.d) + '=' + vT(t1)) + '. &nbsp; ' + t(tsub(o.N) + '=' + vT(t1) + '+' + (o.N - 1) + vP(o.d) + '=' + vT(tN)),
          ['Write each known term as ' + t('t_1+(n-1)d') + ': that gives two equations.', 'Subtract the equations to eliminate ' + t('t_1') + '.'], 'system: t1, d, t_N');
      } }] },
    { num: '3', shared: function (r) { return pw(function () { return { p: r.int(3, 7), d: r.pick([1, -1]) * r.int(3, 8), t1: r.int(-10, 60), m: r.int(18, 35) }; }, function (z) { return !(z.p === 5 && z.d === -6 && z.t1 === 55) && z.t1 !== 0 && z.t1 + (z.p + 3) * z.d !== 0; }); },
      stem: function (o) { return 'An arithmetic sequence has ' + t(tsub(o.p) + '=' + (o.t1 + (o.p - 1) * o.d)) + ' and ' + t(tsub(o.p + 4) + '=' + (o.t1 + (o.p + 3) * o.d)) + '.'; },
      parts: [
        { id: '3a', sub: 'a', level: 'EMG', make: function (r, o) {
          var tp = o.t1 + (o.p - 1) * o.d, tq = tp + 4 * o.d;
          return S.fieldsPart('Determine ' + t(tsub(o.p + 1)) + ', ' + t(tsub(o.p + 2)) + ' and ' + t(tsub(o.p + 3)) + ' without finding ' + t('t_1') + '.', [1, 2, 3].map(function (i) { return S.fNum(tsub(o.p + i), tp + i * o.d, [[tp + i * (tq - tp) / 5, 'u1l3-d-steps', 'From ' + t(tsub(o.p)) + ' to ' + t(tsub(o.p + 4)) + ' is 4 steps.']]); }),
            dSol(tp, o.p, tq, o.p + 4, o.d) + ': ' + t([1, 2, 3].map(function (i) { return tsub(o.p + i) + '=' + (tp + i * o.d); }).join(',\\ ')), HD, 'terms between two known terms');
        } },
        { id: '3b', sub: 'b', level: 'PRG', make: function (r, o) {
          var V = o.t1 + (o.m - 1) * o.d, g = S.gtTex(o.t1, o.d), tp = o.t1 + (o.p - 1) * o.d;
          return S.numPart('Which term of the sequence is ' + t(V) + '? Give its position ' + t('n') + '.', o.m, [[o.m - 1, 'u1l1-gt-n', 'Check your ' + t('t_1') + ': ' + t(tsub(o.p)) + ' is ' + t(o.p - 1) + ' steps after it.'], [o.m + 1, 'u1l1-shift', 'Check ' + t(tsub(o.m + 1)) + '.']],
            t('t_1=' + tp + '-' + (o.p - 1) + vP(o.d) + '=' + o.t1) + ', &nbsp;' + t('t_n=' + g) + '<br>' + t(g + '=' + V) + ' &nbsp;⇒&nbsp; ' + t('n=' + o.m) + ': ' + t(tsub(o.m)) + '.', ['Find ' + t('t_1') + ' and the general term, then set it equal to ' + t(V) + '.'], 'which term after two known terms', { before: 'n =' });
        } }] },
    { num: '4', parts: [
      { id: '4', level: 'PRG', make: function (r) {
        var o = pw(function () { var p = r.int(4, 8); return { t1: r.int(-5, 20), d: r.int(3, 9), p: p, q: p + r.int(6, 10), isT: r.chance(0.5), m: r.int(14, 25) }; }, function (z) { return !(z.p === 6 && z.q === 14 && z.d === 5 && z.t1 === 12) && z.t1 !== 0; });
        var tp = o.t1 + (o.p - 1) * o.d, tq = o.t1 + (o.q - 1) * o.d, g = S.gtTex(o.t1, o.d), V = o.t1 + (o.m - 1) * o.d + (o.isT ? 0 : r.int(1, o.d - 1)), nn = (V - o.t1 + o.d) / o.d, nT = isInt(nn) ? F(nn) : F(Math.round(nn * 100) / 100);
        var opts = o.isT ? [
          { html: 'Yes: ' + t(g + '=' + V) + ' gives ' + t('n=' + nT) + ', so ' + t(V + '=' + tsub(nn)) + '.', right: true },
          { html: 'No: ' + t(V) + ' is not a multiple of ' + t(o.d) + '.', why: 'The terms aren’t multiples of ' + t(o.d) + '. Use the general term ' + t('t_n=' + g) + ' and solve for ' + t('n') + '.' },
          { html: 'Yes: it is ' + t(tsub(nn + 1)) + '.', why: 'Check: ' + t(tsub(nn + 1) + '=' + (o.t1 + nn * o.d)) + '.' },
          { html: 'No: it is between ' + t(tsub(o.p)) + ' and ' + t(tsub(o.q)) + '.', why: 'Terms keep going past ' + t(tsub(o.q)) + '. Solve ' + t(g + '=' + V) + '.' }] : [
          { html: 'No: ' + t(g + '=' + V) + ' gives ' + t('n=' + nT) + ', which is not a natural number.', right: true },
          { html: 'Yes: it is ' + t(tsub(Math.round(nn))) + '.', why: 'Check: ' + t(tsub(Math.round(nn)) + '=' + (o.t1 + (Math.round(nn) - 1) * o.d)) + ', not ' + t(V) + '.' },
          { html: 'No: ' + t(V) + ' is not a multiple of ' + t(o.d) + '.', why: 'Right answer, wrong reason: the terms aren’t multiples of ' + t(o.d) + ' either. It isn’t a term because ' + t('n') + ' is not a natural number.' },
          { html: 'Yes: it is between ' + t(tsub(o.p)) + ' and ' + t(tsub(o.q)) + '.', why: 'Find the general term and solve for ' + t('n') + '.' }];
        return S.mc(r, 'An arithmetic sequence has ' + t(tsub(o.p) + '=' + tp) + ' and ' + t(tsub(o.q) + '=' + tq) + '. Is ' + t(V) + ' a term of the sequence? Explain.', opts,
          dSol(tp, o.p, tq, o.q, o.d) + ', &nbsp;' + t('t_1=' + tp + '-' + (o.p - 1) * o.d + '=' + o.t1) + ', &nbsp;' + t('t_n=' + g) + '<br>' + t(g + '=' + V) + ' &nbsp;⇒&nbsp; ' + t('n=' + nT) + (o.isT ? ': yes, ' + t(V + '=' + tsub(nn)) + '.' : ': not a natural number, so ' + t(V) + ' is not a term.'), HD.concat(['Then solve ' + t('t_n=' + V) + '.']), 'is V a term (two known terms)');
      } }] },
    { num: '5', shared: function (r) { return pw(function () { var k = r.int(2, 5), s = r.int(2, 6), P2 = r.int(9, 18); return { k: k, s: s, P: P2, T0: s + (P2 - 1) * k, R1: 0, R2: 0 }; }, function (z) { return !(z.T0 === 40 && z.k === 3 && z.s === 4) && z.T0 <= 70 && z.T0 >= 25; }); },
      stem: function (o) { return 'A store stacks cans in a display. Rows 1 and 2 (at the bottom) each have ' + t(o.T0) + ' cans, rows 3 and 4 each have ' + t(o.T0 - o.k) + ' cans, rows 5 and 6 each have ' + t(o.T0 - 2 * o.k) + ' cans, and so on. The top two rows each have ' + t(o.s) + ' cans.'; },
      parts: [
        { id: '5a', sub: 'a', level: 'ADV', make: function (r, o) {
          return S.numPart('How many rows are in the display?', 2 * o.P, [[o.P, 'u1l3-pairs', 'That is the number of <b>pairs</b> of rows. Each pair is two rows.'], [2 * o.P - 1, 'u1l3-pairs', 'The top <b>two</b> rows each have ' + t(o.s) + ' cans.'], [o.P - 1, 'u1l2-n-1', 'Add 1 to get the number of pairs, then double.']],
            'Each pair of rows: ' + t(arT(o.T0, -o.k, 3).replace(/\\dots$/, '\\dots,\\ ' + o.s)) + '.<br>' + t(o.s + '=' + o.T0 + '-' + o.k + '(k-1)') + ' &nbsp;⇒&nbsp; ' + t('k-1=' + (o.P - 1)) + ', ' + t('k=' + o.P) + ' pairs.<br>' + t(o.P + '\\times 2=' + 2 * o.P) + ' rows.', ['Think of the pairs of rows as the terms: ' + t(o.T0 + ',\\ ' + (o.T0 - o.k) + ',\\ \\dots,\\ ' + o.s) + '.', 'Each pair is 2 rows.'], 'cans: number of rows', { after: 'rows' });
        } },
        { id: '5b', sub: 'b', level: 'MAS', make: function (r, o) {
          var R1 = 2 * r.int(3, o.P - 2) + 1, R2 = 2 * r.int(Math.ceil((R1 + 1) / 2), o.P - 1); if (R2 <= R1) R2 = R1 + 1;
          var c = function (R) { return o.T0 - o.k * (Math.ceil(R / 2) - 1); };
          return S.fieldsPart('How many cans are in row ' + t(R1) + '? in row ' + t(R2) + '?', [R1, R2].map(function (R) { return S.fNum('\\text{row ' + R + '}', c(R), [[o.T0 - o.k * (R - 1), 'u1l3-row-pair', 'Rows come in pairs: row ' + t(R) + ' is in pair ' + t(Math.ceil(R / 2)) + '.'], [o.T0 - o.k * Math.ceil(R / 2), 'u1l1-gt-n', 'Pair ' + t(Math.ceil(R / 2)) + ' is ' + t(Math.ceil(R / 2) - 1) + ' steps after pair 1.']]); }),
            [R1, R2].map(function (R) { return 'Row ' + t(R) + ' is in pair ' + t(Math.ceil(R / 2)) + ': ' + t(o.T0 + '-' + o.k + '(' + (Math.ceil(R / 2) - 1) + ')=' + c(R)) + ' cans.'; }).join('<br>'), ['Rows ' + t('2k-1') + ' and ' + t('2k') + ' are pair ' + t('k') + '. Find the pair, then use the pair sequence.'], 'cans in given rows');
        } }] },
    { num: '6', shared: function (r) { return pw(function () { return { P: 100 * r.int(20, 90), rate: r.pick([2.5, 3, 3.25, 3.5, 4, 4.25, 4.5, 4.75, 5.25]), N: r.int(12, 25) }; }, function (z) { var I = z.P * z.rate / 100; return isInt(I) && !(z.P === 3200 && z.rate === 4.25) && !(z.P === 2400 && z.rate === 3.75) && !isInt(z.P / I); }); },
      stem: function (o) { return 'Leah deposits ' + mT(o.P) + ' in an account that pays ' + t(vT(o.rate) + '\\%') + ' simple interest per year.'; },
      parts: [
        { id: '6a', sub: 'a', level: 'BEG', make: function (r, o) {
          var I = o.P * o.rate / 100;
          return S.fieldsPart('How much interest is paid each year? Write the account values at the end of years 1, 2 and 3.', [S.fNum('\\text{interest per year}', I, [[o.P * o.rate, 'value', 'Write the rate as a decimal: ' + t(vT(o.rate) + '\\%=' + vT(o.rate / 100)) + '.'], [o.P + I, 'u1l3-interest-total', 'That is the value after a year. The interest is just the part added.']], { before: '$' }), S.fNum('\\text{year 1}', o.P + I, [], { before: '$' }), S.fNum('\\text{year 2}', o.P + 2 * I, [[Math.round(o.P * Math.pow(1 + o.rate / 100, 2) * 100) / 100, 'u1l3-compound', 'Simple interest is paid on the original deposit only: the same ' + mT(I) + ' every year.']], { before: '$' }), S.fNum('\\text{year 3}', o.P + 3 * I, [[Math.round(o.P * Math.pow(1 + o.rate / 100, 3) * 100) / 100, 'u1l3-compound', 'Simple interest: add the same ' + mT(I) + ' every year.']], { before: '$' })],
            t(money(o.P) + '\\times ' + vT(o.rate / 100) + '=' + money(I)) + ' per year: ' + t(money(o.P + I) + ',\\ ' + money(o.P + 2 * I) + ',\\ ' + money(o.P + 3 * I)), ['Interest per year = principal × rate (as a decimal).', 'Simple interest is the same every year.'], 'simple interest values');
        } },
        { id: '6b', sub: 'b', level: 'EMG', make: function (r, o) { var I = o.P * o.rate / 100; return S.gtPart('Let ' + t('t_1') + ' be the value at the end of year 1. Write the general term.', o.P + I, I, null, null, 'simple interest general term', { wrong: [{ is: S.lin(I, o.P - I), code: 'u1l3-pos', hint: 'With ' + t('n=1') + ' your formula should give the value at the end of year 1, ' + mT(o.P + I) + '.' }] }); } },
        { id: '6c', sub: 'c', level: 'EMG', make: function (r, o) { var I = o.P * o.rate / 100, v = o.P + o.N * I; return S.numPart('What is the value after ' + t(o.N) + ' years?', v, [[o.P + (o.N - 1) * I, 'u1l3-pos', t('t_1') + ' is the value after 1 year, so the value after ' + t(o.N) + ' years is ' + t(tsub(o.N)) + '.'], [Math.round(o.P * Math.pow(1 + o.rate / 100, o.N) * 100) / 100, 'u1l3-compound', 'Simple interest: the same ' + mT(I) + ' is added each year.']], t(tsub(o.N) + '=' + I + '(' + o.N + ')+' + o.P + '=' + money(v)), ['Substitute ' + t('n=' + o.N) + ' into your general term.'], 'simple interest value after N years', { before: '$' }); } },
        { id: '6d', sub: 'd', level: 'PRG', make: function (r, o) { var I = o.P * o.rate / 100, n = Math.ceil(o.P / I); return S.numPart('After how many full years will the account first hold at least double the deposit?', n, [[n - 1, 'u1l3-round-up', 'Check: after ' + t(n - 1) + ' years it holds ' + mT(o.P + (n - 1) * I) + ', less than ' + mT(2 * o.P) + '.'], [n + 1, 'u1l3-boundary', 'Check the year before: after ' + t(n) + ' years it already holds ' + mT(o.P + n * I) + '.']], t(I + 'n+' + o.P + '\\ge ' + 2 * o.P) + ' &nbsp;⇒&nbsp; ' + t('n\\ge ' + F(Math.round(o.P / I * 100) / 100)) + ': after ' + t(n) + ' years (' + mT(o.P + n * I) + ').', ['Solve ' + t('t_n\\ge ' + 2 * o.P) + ' and round up to a whole number of years.'], 'simple interest: double', { after: 'years' }); } }] },
    { num: '7', shared: function (r) { return pw(function () { return { F: 25 * r.int(8, 24), c: r.int(18, 45), N: r.int(60, 120), B: 100 * r.int(20, 60) }; }, function (z) { return !(z.F === 350 && z.c === 28) && (z.B - z.F) % z.c !== 0 && (z.B - z.F) / z.c > 20; }); },
      stem: function (o) { return 'A caterer charges a ' + mT(o.F) + ' set-up fee plus ' + mT(o.c) + ' per guest.'; },
      parts: [
        { id: '7a', sub: 'a', level: 'BEG', make: function (r, o) { return S.fieldsPart('Write the costs for 1, 2, 3 and 4 guests.', [1, 2, 3, 4].map(function (k) { return S.fNum('\\text{' + k + ' guest' + (k > 1 ? 's' : '') + '}', o.F + k * o.c, [[k * o.c, 'value', 'Include the set-up fee.']], { before: '$' }); }), t(money(o.F + o.c) + ',\\ ' + money(o.F + 2 * o.c) + ',\\ ' + money(o.F + 3 * o.c) + ',\\ ' + money(o.F + 4 * o.c)), ['Set-up fee plus ' + mT(o.c) + ' for each guest.'], 'caterer costs'); } },
        { id: '7b', sub: 'b', level: 'EMG', make: function (r, o) { return S.gtPart('Write the general term ' + t('t_n=t_1+(n-1)d') + ', then simplify it to the form ' + t('C=mn+b') + '.', o.F + o.c, o.c, t('t_n=' + (o.F + o.c) + '+(n-1)(' + o.c + ')') + ', so ' + t('C=' + o.c + 'n+' + o.F) + '.', null, 'caterer: C = mn + b', { lhs: 'C' }); } },
        { id: '7b2', sub: 'b, meaning', level: 'BEG', make: function (r, o) {
          return S.mc(r, 'In ' + t('C=' + o.c + 'n+' + o.F) + ', what do ' + t('m=' + o.c) + ' and ' + t('b=' + o.F) + ' represent?', [
            { html: t('m') + ' is the cost per guest; ' + t('b') + ' is the set-up fee.', right: true }, { html: t('m') + ' is the set-up fee; ' + t('b') + ' is the cost per guest.', why: t(o.c) + ' is multiplied by the number of guests ' + t('n') + ', so it is the cost per guest.', code: 'm-b-swap' },
            { html: t('m') + ' is the number of guests; ' + t('b') + ' is the total cost.', why: t('n') + ' is the number of guests and ' + t('C') + ' is the total cost.' }, { html: t('m') + ' is the cost for 1 guest; ' + t('b') + ' is the cost for 0 guests.', why: 'The cost for 1 guest is ' + mT(o.F + o.c) + ' (that is ' + t('t_1') + '). ' + t('m') + ' is what each guest adds.' }],
            t('m=' + o.c) + ' is the slope: each extra guest adds ' + mT(o.c) + '. ' + t('b=' + o.F) + ' is the set-up fee (it is ' + t('t_1-d') + ').', ['What changes when one more guest comes? What is paid no matter how many come?'], 'meaning of m and b');
        } },
        { id: '7c', sub: 'c', level: 'EMG', make: function (r, o) { var v = o.c * o.N + o.F; return S.numPart('Find the cost for ' + t(o.N) + ' guests.', v, [[o.c * o.N, 'value', 'Add the set-up fee.'], [o.F + o.c + o.N * o.c, 'u1l1-gt-n', 'Use ' + t('C=' + o.c + 'n+' + o.F) + '.']], t('C=' + o.c + '(' + o.N + ')+' + o.F + '=' + money(v)), ['Substitute ' + t('n=' + o.N) + '.'], 'caterer: cost for N guests', { before: '$' }); } },
        { id: '7d', sub: 'd', level: 'PRG', make: function (r, o) { var nn = (o.B - o.F) / o.c, n = Math.floor(nn); return S.numPart('A family’s budget is ' + mT(o.B) + '. What is the greatest number of guests they can invite?', n, [[n + 1, 'u1l3-round-up', 'Round <b>down</b>: ' + t(n + 1) + ' guests would cost ' + mT(o.c * (n + 1) + o.F) + '.'], [Math.floor(o.B / o.c), 'value', 'Take off the set-up fee first.']], t(o.c + 'n+' + o.F + '\\le ' + o.B) + ' &nbsp;⇒&nbsp; ' + t('n\\le ' + F(Math.round(nn * 100) / 100)) + ': ' + t(n) + ' guests (' + mT(o.c * n + o.F) + ').', ['Solve ' + t(o.c + 'n+' + o.F + '\\le ' + o.B) + '; you can’t invite part of a guest.'], 'caterer: budget', { after: 'guests' }); } }] },
    { num: '8', shared: function (r) { return pw(function () { var S0 = 500 * r.int(80, 120), R = 50 * r.int(24, 50); return { S0: S0, R: R, k: r.int(6, 12), X: 5000 * r.int(13, 18) }; }, function (z) { return !(z.S0 === 48500 && z.R === 1850) && z.X > z.S0 + 6 * z.R && (z.X - z.S0) % z.R !== 0 && (z.X - z.S0) / z.R < 40; }); },
      stem: function (o) { return 'An engineer’s starting salary is ' + mT(o.S0) + ' in year 1, with a raise of ' + mT(o.R) + ' at the start of each year after that.'; },
      parts: [
        { id: '8a', sub: 'a', level: 'EMG', make: function (r, o) { var v = o.S0 + (o.k - 1) * o.R; return S.numPart('What is the salary in year ' + t(o.k) + '?', v, [[o.S0 + o.k * o.R, 'u1l1-gt-n', 'Year 1 has no raise yet: year ' + t(o.k) + ' has ' + t(o.k - 1) + ' raises.']], t(tsub(o.k) + '=' + F(o.S0) + '+' + (o.k - 1) + '(' + F(o.R) + ')=' + money(v)), ['Year ' + t(o.k) + ' is ' + t(o.k - 1) + ' raises after year 1.'], 'salary in year k', { before: '$' }); } },
        { id: '8b', sub: 'b', level: 'PRG', make: function (r, o) { var nn = (o.X - o.S0) / o.R + 1, n = Math.floor(nn) + 1; return S.numPart('In which year is the salary first more than ' + mT(o.X) + '?', n, [[n - 1, 'u1l3-round-up', 'Check year ' + t(n - 1) + ': ' + mT(o.S0 + (n - 2) * o.R) + ', not more than ' + mT(o.X) + '.'], [n - 2, 'u1l1-gt-n', 'You found the number of raises; add 1 for the year.']], t(F(o.S0) + '+' + F(o.R) + '(n-1)>' + F(o.X)) + ' &nbsp;⇒&nbsp; ' + t('n-1>' + F(Math.round((nn - 1) * 100) / 100)) + ', so ' + t('n=' + n) + ': year ' + t(n) + ' (' + mT(o.S0 + (n - 1) * o.R) + '; year ' + t(n - 1) + ': ' + mT(o.S0 + (n - 2) * o.R) + ').', ['Solve the inequality and take the next whole year.'], 'salary first over X', { before: 'year' }); } }] },
    { num: '9', shared: function (r) { return pw(function () { return { C: 1000 * r.int(35, 70), L1: 500 * r.int(12, 24), L: 100 * r.int(25, 50), Y: r.int(8, 10), eq: r.chance(0.5), X: 0 }; }, function (z) { var t1 = z.C - z.L1, last = t1 - 11 * z.L; z.X = 0; return !(z.C === 52000 && z.L1 === 9000 && z.L === 3800) && t1 - (z.Y - 1) * z.L > 0 && last > 0 && (z.L1 !== z.L); }); },
      stem: function (o) { return 'A delivery van costs ' + mT(o.C) + ' new. It loses ' + mT(o.L1) + ' of value in its first year and ' + mT(o.L) + ' in each year after that.'; },
      parts: [
        { id: '9a', sub: 'a', level: 'PRG', make: function (r, o) { var t1 = o.C - o.L1, v = t1 - (o.Y - 1) * o.L; return S.numPart('What is the van worth at the end of year ' + t(o.Y) + '?', v, [[o.C - o.Y * o.L, 'value', 'The first year’s loss is ' + mT(o.L1) + ', not ' + mT(o.L) + '. Let ' + t('t_1') + ' be the value at the end of year 1.'], [t1 - o.Y * o.L, 'u1l1-gt-n', 'From the end of year 1 to the end of year ' + t(o.Y) + ' is ' + t(o.Y - 1) + ' years.']], 'Let ' + t('t_n') + ' be the value at the end of year ' + t('n') + ': ' + t('t_1=' + F(o.C) + '-' + F(o.L1) + '=' + F(t1)) + ', ' + t('d=-' + F(o.L)) + '.<br>' + t(tsub(o.Y) + '=' + F(t1) + '+' + (o.Y - 1) + '(-' + F(o.L) + ')=' + money(v)), ['The first year is different: start the sequence at the end of year 1.'], 'van value at year Y', { before: '$' }); } },
        { id: '9b', sub: 'b', level: 'ADV', make: function (r, o) {
          var t1 = o.C - o.L1, m = r.int(Math.max(o.Y + 1, 9), 12), X = o.eq ? t1 - (m - 1) * o.L : t1 - (m - 1) * o.L + r.int(1, o.L / 100 - 1) * 100, n = o.eq ? m + 1 : m;
          var val = function (k) { return t1 - (k - 1) * o.L; };
          return S.numPart('At the end of which year is it first worth less than ' + mT(X) + '?', n, [[n - 1, o.eq ? 'u1l3-boundary' : 'u1l3-round-up', 'At the end of year ' + t(n - 1) + ' it is worth ' + mT(val(n - 1)) + (o.eq ? ' — exactly ' + mT(X) + ', not less.' : ', not less than ' + mT(X) + '.')], [n + 1, 'u1l3-round-up', 'Check year ' + t(n) + ': ' + mT(val(n)) + ' is already less.']],
            t(F(t1) + '-' + F(o.L) + '(n-1)<' + F(X)) + ' &nbsp;⇒&nbsp; ' + t('n-1>' + F(Math.round((t1 - X) / o.L * 100) / 100)) + ', so ' + t('n=' + n) + ': end of year ' + t(n) + ' (' + mT(val(n)) + '). At the end of year ' + t(n - 1) + ' it is ' + (o.eq ? 'exactly ' : '') + mT(val(n - 1)) + '.', ['Solve ' + t('t_n<' + X) + ' and round to the first whole year that works. Check the year before.'], 'van first below X', { before: 'year' });
        } }] },
    { num: '10', shared: function (r) { return pw(function () { return { H: r.int(18, 36), b: r.pick([1.2, 1.4, 1.5, 1.6, 2.2, 2.4, 2.5]), k: r.int(3, 7), h: r.int(2, 5) }; }, function (z) { return !(z.H === 24 && z.b === 1.8) && z.H - z.k * z.b > z.h && !isInt((z.H - z.h) / z.b); }); },
      stem: function (o) { return 'A candle is ' + t(o.H) + '&nbsp;cm tall when it is lit, and it burns down ' + t(vT(o.b)) + '&nbsp;cm every hour. Let ' + t('t_1=' + o.H) + '.'; },
      parts: [
        { id: '10a', sub: 'a', level: 'PRG', make: function (r, o) {
          var v = cl(o.H - o.k * o.b);
          return S.fieldsPart('Write the general term. Which term gives the height after ' + t(o.k) + ' hours, and what is that height?', [S.gtSpec('t_n', o.H, -o.b), S.fNum('\\text{term: }n', o.k + 1, [[o.k, 'u1l3-pos', t('t_1') + ' is the height at 0 hours, so after ' + t(o.k) + ' hours is ' + t(tsub(o.k + 1)) + '.']]), S.fNum('\\text{height}', v, [[cl(o.H - (o.k - 1) * o.b), 'u1l3-pos', 'That is the height after ' + t(o.k - 1) + ' hours (' + t(tsub(o.k)) + ').']], { after: 'cm' })],
            t(S.gtSteps(o.H, -o.b)) + '<br>After ' + t(o.k) + ' hours is ' + t(tsub(o.k + 1) + '=' + S.gtTex(o.H, -o.b).replace('n', '(' + (o.k + 1) + ')') + '=' + vT(v)) + '&nbsp;cm.', ['' + t('t_1') + ' is the height at the start (0 hours).', 'After ' + t('k') + ' hours is ' + t('t_{k+1}') + '.'], 'candle: general term and height');
        } },
        { id: '10b', sub: 'b', level: 'PRG', make: function (r, o) { var kk = (o.H - o.h) / o.b, k = Math.floor(kk) + 1; return S.numPart('After how many full hours is the candle first shorter than ' + t(o.h) + '&nbsp;cm?', k, [[k - 1, 'u1l3-round-up', 'After ' + t(k - 1) + ' hours it is ' + t(vT(cl(o.H - (k - 1) * o.b))) + '&nbsp;cm — not shorter than ' + t(o.h) + '&nbsp;cm yet.'], [k + 1, 'u1l3-pos', 'Count hours, not terms: after ' + t('k') + ' hours the height is ' + t(o.H + '-' + vT(o.b) + 'k') + '.']], 'After ' + t('k') + ' hours: ' + t(o.H + '-' + vT(o.b) + 'k<' + o.h) + ' &nbsp;⇒&nbsp; ' + t('k>' + F(Math.round(kk * 100) / 100)) + ': after ' + t(k) + ' hours (' + t(vT(cl(o.H - k * o.b))) + '&nbsp;cm).', ['Write the height after ' + t('k') + ' hours and solve the inequality.'], 'candle: first shorter than h', { after: 'hours' }); } }] },
    { num: '11', shared: function (r) { return pw(function () { return { m: r.pick([2, 3, -1, -2, 2]), b: r.int(-5, 9) }; }, function (z) { var v1 = z.m + z.b, v5 = 5 * z.m + z.b; return !(z.m === 2 && z.b === -3) && Math.min(v1, v5) >= -4 && Math.max(v1, v5) <= 14 && z.b !== 0; }); },
      stem: function (o) { return 'The linear function ' + t('y=' + S.linX(o.m, o.b)) + ' has its domain restricted to the natural numbers.'; },
      parts: [
        { id: '11a', sub: 'a', level: 'BEG', make: function (r, o) {
          var pts = [1, 2, 3, 4, 5].map(function (x) { return [x, o.m * x + o.b]; }), lo = Math.min(-2, Math.min.apply(null, pts.map(function (p) { return p[1]; })) - 1), hi = Math.max(8, Math.max.apply(null, pts.map(function (p) { return p[1]; })) + 1);
          return B.points('Plot the points of the function for ' + t('x=1') + ' to ' + t('5') + '.', { x: [0, 6], y: [lo, hi], grid: 1, labels: 2, max: 300, help: 'Tap to place each point. Tap a point again to remove it.' }, pts,
            pts.map(function (p) { return t('(' + p[0] + ',\\ ' + p[1] + ')'); }).join(', ') + ' (separate points, not joined).', ['Substitute ' + t('x=1,\\ 2,\\ 3,\\ 4,\\ 5') + ' into ' + t('y=' + S.linX(o.m, o.b)) + '.'], 'plot y = mx + b on the naturals', { what: 'point of the function' });
        } },
        { id: '11b', sub: 'b', level: 'BEG', make: function (r, o) { return S.fieldsPart('List the first five elements of the range.', [1, 2, 3, 4, 5].map(function (x) { return S.fNum('f(' + x + ')', o.m * x + o.b, [[o.m * (x - 1) + o.b, 'u1l1-n0', 'The domain starts at ' + t('x=1') + '.']]); }), t([1, 2, 3, 4, 5].map(function (x) { return o.m * x + o.b; }).join(',\\ ')), ['Substitute ' + t('x=1') + ' to ' + t('5') + '.'], 'range values'); } },
        { id: '11c', sub: 'c', level: 'BEG', make: function (r, o) { return S.numPart('The range values form an arithmetic sequence. State ' + t('d') + '.', o.m, [[o.b, 'u1l3-m-b-swap', 'That is the ' + t('y') + '-intercept. ' + t('d') + ' is how much ' + t('y') + ' changes each step.'], [-o.m, 'u1l1-d-sign', 'Subtract each value from the next one.']], 'Each value is ' + t(Math.abs(o.m)) + ' ' + (o.m > 0 ? 'more' : 'less') + ' than the one before: ' + t('d=' + o.m) + ', the slope.', ['Subtract consecutive range values.'], 'd = slope', { before: 'd =' }); } },
        { id: '11d', sub: 'd', level: 'EMG', make: function (r) {
          return S.mc(r, 'Why are the points not joined?', [
            { html: 'The domain is only the natural numbers: there are no points between them.', right: true }, { html: 'Because ' + t('y') + ' can be negative.', why: 'Negative values can be graphed. It’s the domain that matters.' },
            { html: 'Because the function is not linear.', why: 'It is linear — but only the natural numbers are in its domain.' }, { html: 'Joined points would not be a function.', why: 'A line is a function too. The domain here is only ' + t('1,\\ 2,\\ 3,\\ \\dots') + '.' }],
            'The domain is restricted to the natural numbers, so there is no point at ' + t('x=1.5') + ': the graph is separate points.', ['Which ' + t('x') + '-values are allowed?'], 'why not joined (function)');
        } }] },
    { num: '12', parts: [
      { id: '12', level: 'PRG', make: function (r) {
        var o = pw(function () { return { D: 50 * r.int(4, 12), e: 25 * r.int(4, 10), G: 1000 * r.int(3, 7) }; }, function (z) { return !(z.D === 400 && z.e === 150 && z.G === 5000) && (z.G - z.D) % z.e !== 0 && (z.G - z.D) / z.e > 8; });
        var n = Math.floor((o.G - o.D) / o.e) + 2, f = function (k) { return o.D + (k - 1) * o.e; };
        return S.mc(r, '<i>(Multiple Choice)</i> A swimmer swims ' + t(o.D) + '&nbsp;m on day 1 of a training plan and ' + t(o.e) + '&nbsp;m more each day after that. The first day she swims more than ' + t(o.G / 1000) + '&nbsp;km is day', [n - 2, n - 1, n, n + 1].map(function (k) { return { html: t(k), right: k === n, why: k < n ? 'Day ' + k + ': ' + t(F(f(k))) + '&nbsp;m, not more than ' + t(F(o.G)) + '&nbsp;m.' : 'Check day ' + (k - 1) + ': ' + t(F(f(k - 1))) + '&nbsp;m is already more.' }; }),
          t(o.D + '+' + o.e + '(n-1)>' + F(o.G)) + ' &nbsp;⇒&nbsp; ' + t('n-1>' + F(Math.round((o.G - o.D) / o.e * 100) / 100)) + ' &nbsp;⇒&nbsp; ' + t('n=' + n) + '. Day ' + (n - 1) + ': ' + t(F(f(n - 1))) + '&nbsp;m; day ' + n + ': ' + t(F(f(n))) + '&nbsp;m.', ['Change km to m, then solve the inequality.'], 'MC swimmer first day over', true);
      } }] },
    { num: '13', parts: [
      { id: '13', level: 'EMG', make: function (r) {
        var o = pw(function () { return { V: 1000 * r.int(12, 30), L: 250 * r.int(4, 12) }; }, function (z) { return !(z.V === 18000 && z.L === 1500); }), V = F(o.V), L = F(o.L);
        return S.mc(r, '<i>(Multiple Choice)</i> A machine bought for ' + mT(o.V) + ' loses ' + mT(o.L) + ' of value each year. Its value after ' + t('n') + ' years is', [
          { html: t(V + '-' + L + 'n'), right: true }, { html: t(V + '-' + L + '(n-1)'), why: 'That treats ' + mT(o.V) + ' as the value after 1 year. After 0 years it is worth ' + mT(o.V) + '.' },
          { html: t(F(o.V - o.L) + '-' + L + 'n'), why: 'That takes off one year too many: after 1 year it would give ' + mT(o.V - 2 * o.L) + '.' }, { html: t(V + '+' + L + 'n'), why: 'The value goes <b>down</b> each year.' }],
          'After 0 years it is worth ' + mT(o.V) + ', and each year takes off ' + mT(o.L) + ': ' + t(V + '-' + L + 'n') + '.', ['What should the formula give for ' + t('n=0') + ' and ' + t('n=1') + '?'], 'MC depreciation formula');
      } }] },
    { num: '14', parts: [
      { id: '14', level: 'EMG', make: function (r) {
        var o = pw(function () { return { t1: r.int(15, 24), d: -r.int(2, 4), N: r.int(15, 25) }; }, function (z) { return z.t1 + 4 * z.d >= 2 && !(z.t1 === 22 && z.d === -3 && z.N === 20); });
        var f = function (k) { return o.t1 + (k - 1) * o.d; };
        return S.mc(r, 'The graph shows an arithmetic sequence.' + seqGraph(o.t1, o.d) + '<i>(Multiple Choice)</i> If the pattern in the graph continues, the ' + S.ord(o.N) + ' term of the sequence is', [
          { html: t(f(o.N)), right: true }, { html: t(f(o.N + 1)), why: 'That is ' + t(tsub(o.N + 1)) + ': it uses ' + t(o.N + 'd') + '.' }, { html: t(f(o.N - 1)), why: 'That is ' + t(tsub(o.N - 1)) + '.' }, { html: t(o.N * o.d), why: 'Start from ' + t('t_1=' + o.t1) + '.' }],
          'From the graph: ' + t('t_1=' + o.t1) + ', ' + t('d=' + o.d) + '. ' + t(tsub(o.N) + '=' + o.t1 + '+' + (o.N - 1) + '(' + o.d + ')=' + f(o.N)) + '.', ['Read ' + t('t_1') + ' and ' + t('d') + ' from the graph.'], 'MC t_N from a graph');
      } }] },
    { num: '15', parts: [
      { id: '15', level: 'PRG', make: function (r) {
        var o = pw(function () { return { t1: r.int(12, 24), d: -r.int(2, 5) }; }, function (z) { return z.t1 + 4 * z.d >= 1 && !(z.t1 === 22 && z.d === -3); }), b = o.t1 - o.d;
        var p = S.numPart('The graph shows an arithmetic sequence.' + seqGraph(o.t1, o.d) + '<i>(Numerical Response)</i> The general term of the sequence in the graph can be written ' + t('t_n=mn+b') + '. The value of ' + t('b') + ' is ______.', b, [[o.t1, 'u1l1-gt-n', 'That is ' + t('t_1') + '. ' + t('b') + ' is one step <b>before</b> ' + t('t_1') + ': ' + t('b=t_1-d') + '.'], [o.t1 + o.d, 'u1l1-gt-dsign', 'Check the sign: ' + t('b=t_1-d=' + o.t1 + '-' + vP(o.d)) + '.']],
          t('t_n=' + o.t1 + '+(n-1)' + vP(o.d) + '=' + S.gtTex(o.t1, o.d)) + ', so ' + t('b=' + b) + ' (' + t('=t_1-d') + ').', ['Read ' + t('t_1') + ' and ' + t('d') + ' from the graph, then expand ' + t('t_1+(n-1)d') + '.'], 'NR b from a graph');
        p.input.nr = true; return p;
      } }] }
  ];
  var B = K.P;
  function arT(t1, d, k) { return seqTex(S.arith(t1, d, k)); }

  /* =============================== Extra Practice 3 =============================== */
  var EXTRA = [
    { num: 'A1', section: 'A. Skills', stem: 'For each arithmetic sequence, determine ' + t('d') + ', ' + t('t_1') + ' and the general term.', parts: [
      { id: 'eA1a', sub: 'a', level: 'BEG', make: function (r) { var o = pw(function () { var p = r.int(2, 5); return { t1: r.int(-6, 10), d: r.int(2, 7), p: p, q: p + r.int(5, 8) }; }, function (z) { return z.t1 !== 0 && !(z.p === 3 && z.q === 10 && z.d === 4) && !(z.p === 5 && z.q === 12 && z.d === 4) && !(z.p === 4 && z.q === 11 && z.d === 5); }); return twoTermPart('a', o.t1, o.d, o.p, o.q); } },
      { id: 'eA1b', sub: 'b', level: 'EMG', make: function (r) { var o = pw(function () { var p = r.int(3, 6); return { t1: r.int(8, 25), d: -r.int(3, 7), p: p, q: p + r.int(6, 9) }; }, function (z) { return !(z.p === 5 && z.q === 13 && z.d === -5); }); return twoTermPart('b', o.t1, o.d, o.p, o.q); } },
      { id: 'eA1c', sub: 'c', level: 'PRG', make: function (r) { var o = pw(function () { var p = 5 * r.int(1, 3); return { t1: r.int(-4, 6) + r.pick([0, 0.5]), d: r.pick([0.5, 1.5]), p: p, q: p + 10 * r.int(1, 2) }; }, function (z) { return !(z.p === 10 && z.q === 30 && z.d === 0.5) && z.t1 !== 0; }); return twoTermPart('c', o.t1, o.d, o.p, o.q); } }] },
    { num: 'A2', parts: [
      { id: 'eA2', level: 'EMG', make: function (r) {
        var o = pw(function () { return { p: r.int(4, 9), d: r.pick([1, -1]) * r.int(3, 8), t1: r.int(-10, 30) }; }, function (z) { return !(z.p === 7 && z.d === 5 && z.t1 === 10) && z.t1 !== 0; });
        var tp = o.t1 + (o.p - 1) * o.d, tq = tp + 5 * o.d;
        var specs = [1, 2, 3, 4].map(function (i) { return S.fNum(tsub(o.p + i), tp + i * o.d, [[tp + i * (tq - tp) / 6, 'u1l3-d-steps', 'From ' + t(tsub(o.p)) + ' to ' + t(tsub(o.p + 5)) + ' is 5 steps.']]); }).concat([S.fNum('t_1', o.t1, t1Cands(tp, o.p, o.d))]);
        return S.fieldsPart('An arithmetic sequence has ' + t(tsub(o.p) + '=' + tp) + ' and ' + t(tsub(o.p + 5) + '=' + tq) + '. Determine ' + t(tsub(o.p + 1)) + ', ' + t(tsub(o.p + 2)) + ', ' + t(tsub(o.p + 3)) + ', ' + t(tsub(o.p + 4)) + ' and ' + t('t_1') + '.', specs,
          dSol(tp, o.p, tq, o.p + 5, o.d) + ': ' + t([1, 2, 3, 4].map(function (i) { return tp + i * o.d; }).join(',\\ ')) + '. &nbsp; ' + t('t_1=' + tp + '-' + (o.p - 1) + vP(o.d) + '=' + o.t1), HD, 'EP terms between and t1');
      } }] },
    { num: 'A3', parts: [
      { id: 'eA3', level: 'BEG', make: function (r) {
        var o = pw(function () { return { a: r.pick([1, -1]) * r.int(2, 6), b: r.int(-9, 15) }; }, function (z) { return !(z.a === 4 && z.b === -7) && !(z.a === -2 && z.b === 30) && z.b !== 0; });
        var vals = [1, 2, 3, 4].map(function (x) { return o.a * x + o.b; });
        return S.fieldsPart('The function ' + t('f(x)=' + S.linX(o.a, o.b)) + ' has its domain restricted to the natural numbers. Write the first four values of the range and state the common difference.', vals.map(function (v, i) { return S.fNum('f(' + (i + 1) + ')', v, [[o.a * i + o.b, 'u1l1-n0', 'The domain starts at ' + t('x=1') + '.']]); }).concat([S.fNum('d', o.a, [[o.b, 'u1l3-m-b-swap', 'That is the constant term; ' + t('d') + ' is the slope.']])]),
          t(vals.join(',\\ ')) + '; each value changes by ' + t(o.a) + ': ' + t('d=' + o.a) + ' (the slope).', ['Substitute ' + t('x=1,\\ 2,\\ 3,\\ 4') + '.'], 'EP range values and d');
      } }] },
    { num: 'A4', parts: [
      { id: 'eA4', level: 'EMG', make: function (r) {
        var o = pw(function () { return { c: r.int(20, 60), k: r.pick([1, -1]) * r.int(2, 6), N: r.int(8, 15) }; }, function (z) { return !(z.c === 40 && z.k === -3 && z.N === 12) && z.c + z.k * z.N !== 0; });
        var line = 't=' + (o.k > 0 ? o.k + 'n+' + o.c : o.c + '-' + (-o.k) + 'n'), t1 = o.c + o.k, v = o.c + o.k * o.N;
        return S.fieldsPart('The points ' + t('(n,\\ t_n)') + ' of an arithmetic sequence lie on the line ' + t(line) + '. State ' + t('t_1') + ', ' + t('d') + ' and ' + t(tsub(o.N)) + '.', [S.fNum('t_1', t1, [[o.c, 'u1l1-n0', t(o.c) + ' is where the line crosses the vertical axis (' + t('n=0') + '). The first term is at ' + t('n=1') + '.']]), S.fNum('d', o.k, [[o.c, 'u1l3-m-b-swap', 'The common difference is the slope.']]), S.fNum(tsub(o.N), v, [])],
          t('t_1=' + (o.k > 0 ? o.k + '(1)+' + o.c : o.c + '-' + (-o.k) + '(1)') + '=' + t1) + ', &nbsp;' + t('d=' + o.k) + ' (the slope), &nbsp;' + t(tsub(o.N) + '=' + v), ['Substitute ' + t('n=1') + ' for ' + t('t_1') + '. The slope is ' + t('d') + '.'], 'EP line → t1, d, t_N');
      } }] },
    { num: 'B1', section: 'B. Applying', shared: function (r) { return pw(function () { return { P: 500 * r.int(4, 18), rate: r.pick([1.8, 2.2, 2.4, 2.8, 3.2, 3.6]), N: r.int(8, 15), X: 0 }; }, function (z) { var I = z.P * z.rate / 100; z.X = 500 * Math.ceil((z.P + 12 * I) / 500); return isInt(I) && !(z.P === 5000 && z.rate === 2.8) && (z.X - z.P) % I !== 0; }); },
      stem: function (o) { return mT(o.P) + ' is invested at ' + t(vT(o.rate) + '\\%') + ' simple interest per year.'; },
      parts: [
        { id: 'eB1a', sub: 'a', level: 'EMG', make: function (r, o) { var I = o.P * o.rate / 100, v = o.P + o.N * I; return S.numPart('What is the investment worth after ' + t(o.N) + ' years?', v, [[o.P + (o.N - 1) * I, 'u1l3-pos', 'After ' + t(o.N) + ' years, ' + t(o.N) + ' years of interest have been added.'], [o.N * I, 'value', 'Add the original ' + mT(o.P) + '.']], 'Interest: ' + t(money(o.P) + '\\times ' + vT(o.rate / 100) + '=' + money(I)) + ' per year. &nbsp; ' + t(F(o.P) + '+' + o.N + '(' + I + ')=' + money(v)), ['Interest per year = principal × rate.'], 'EP simple interest value', { before: '$' }); } },
        { id: 'eB1b', sub: 'b', level: 'PRG', make: function (r, o) { var I = o.P * o.rate / 100, kk = (o.X - o.P) / I, k = Math.floor(kk) + 1; return S.numPart('After how many full years is it first worth more than ' + mT(o.X) + '?', k, [[k - 1, 'u1l3-round-up', 'After ' + t(k - 1) + ' years it is worth ' + mT(o.P + (k - 1) * I) + '.']], t(F(o.P) + '+' + I + 'k>' + F(o.X)) + ' &nbsp;⇒&nbsp; ' + t('k>' + F(Math.round(kk * 100) / 100)) + ': after ' + t(k) + ' years (' + mT(o.P + k * I) + ').', ['Solve the inequality for the number of years ' + t('k') + '.'], 'EP first more than X', { after: 'years' }); } }] },
    { num: 'B2', parts: [
      { id: 'eB2', level: 'PRG', make: function (r) {
        var o = pw(function () { var p = r.int(2, 5); return { t1: r.int(15, 30), d: r.int(2, 5), p: p, q: p + r.int(7, 11), n: r.int(20, 32) }; }, function (z) { return !(z.t1 === 24 && z.d === 3 && z.p === 3 && z.q === 12); });
        var tp = o.t1 + (o.p - 1) * o.d, tq = o.t1 + (o.q - 1) * o.d, L = o.t1 + (o.n - 1) * o.d;
        return S.numPart('In a concert hall, each row has the same number of extra seats as the row in front of it. Row ' + t(o.p) + ' has ' + t(tp) + ' seats and row ' + t(o.q) + ' has ' + t(tq) + ' seats. The last row has ' + t(L) + ' seats. How many rows are there?', o.n, [[o.n - 1, 'u1l2-n-1', 'Add 1: you found ' + t('n-1') + '.'], [o.n + 1, 'u1l1-shift', 'Check your ' + t('t_1') + '.']],
          dSol(tp, o.p, tq, o.q, o.d) + ', &nbsp;' + t1Sol(tp, o.p, o.d, o.t1) + '<br>' + t(L + '=' + o.t1 + '+' + o.d + '(n-1)') + ' &nbsp;⇒&nbsp; ' + t('n-1=' + (o.n - 1)) + ', ' + t('n=' + o.n) + ' rows.', HD.concat(['Then set the general term equal to ' + t(L) + '.']), 'EP concert hall rows', { after: 'rows' });
      } }] },
    { num: 'B3', shared: function (r) { return pw(function () { var a = r.int(1, 4); return { L: 100 * r.int(8, 25), V0: 1000 * r.int(10, 30), a: a, b: a + r.int(4, 7), c: 0 }; }, function (z) { z.c = z.b + r.int(1, 3); return !(z.L === 1300 && z.V0 === 17000) && z.V0 - z.c * z.L > 0; }); },
      stem: function (o) { return 'Computer equipment loses the same dollar value every year. It is worth ' + mT(o.V0 - o.a * o.L) + ' ' + numWord(o.a) + ' year' + (o.a > 1 ? 's' : '') + ' after it was bought and ' + mT(o.V0 - o.b * o.L) + ' ' + numWord(o.b) + ' years after it was bought.'; },
      parts: [
        { id: 'eB3a', sub: 'a', level: 'PRG', make: function (r, o) {
          var va = o.V0 - o.a * o.L, vb = o.V0 - o.b * o.L;
          return S.fieldsPart('Determine the annual depreciation and the original price.', [S.fNum('\\text{loses per year}', o.L, [[(va - vb) / o.b, 'u1l3-d-steps', 'From year ' + o.a + ' to year ' + o.b + ' is ' + t(o.b - o.a) + ' years.'], [-o.L, 'sign', 'Give the amount it loses (a positive number).']], { before: '$' }), S.fNum('\\text{original price}', o.V0, [[va + (o.a - 1) * o.L, 'u1l3-pos', 'It was bought at time 0: add back ' + t(o.a) + ' year' + (o.a > 1 ? 's' : '') + ' of loss.']], { before: '$' })],
            t('\\dfrac{' + F(vb) + '-' + F(va) + '}{' + o.b + '-' + o.a + '}=' + F(-o.L)) + ': it loses ' + mT(o.L) + ' per year.<br>Original: ' + t(F(va) + '+' + o.a + '(' + F(o.L) + ')=' + money(o.V0)), ['Change in value ÷ change in years gives the yearly change.', 'The price is the value at 0 years.'], 'EP depreciation and price');
        } },
        { id: 'eB3b', sub: 'b', level: 'EMG', make: function (r, o) { var v = o.V0 - o.c * o.L; return S.numPart('What is it worth ' + numWord(o.c) + ' years after it was bought?', v, [[o.V0 - (o.c - 1) * o.L, 'u1l3-pos', 'After ' + t(o.c) + ' years, ' + t(o.c) + ' years of loss have been taken off.']], t(F(o.V0) + '-' + o.c + '(' + F(o.L) + ')=' + money(v)), ['Start from the original price.'], 'EP value after c years', { before: '$' }); } }] },
    { num: 'B4', shared: function (r) { return pw(function () { return { s: r.pick([2, 3, 4, 6, 8, 10]), m: r.int(5, 12) }; }, function (z) { return cl(1 + (z.m - 1) * 0.1 * z.s) <= 12; }); },
      stem: function (o) { return 'The water pressure on a diver is ' + t('1.0') + '&nbsp;atm at the surface and rises ' + t('0.1') + '&nbsp;atm for every metre of depth. A gauge records the pressure every ' + t(o.s) + '&nbsp;m on the way down, starting at the surface: ' + t('t_1=1.0') + '.'; },
      parts: [
        { id: 'eB4a', sub: 'a', level: 'EMG', make: function (r, o) {
          var d = cl(0.1 * o.s);
          return S.fieldsPart('Write the second and third readings and the general term.', [S.fNum('t_2', 1 + d, [[1.1, 'u1l1-shift', 'Readings are every ' + t(o.s) + '&nbsp;m: the pressure rises ' + t(o.s + '\\times 0.1=' + vT(d)) + '&nbsp;atm between readings.']]), S.fNum('t_3', cl(1 + 2 * d), []), S.gtSpec('t_n', 1, d)],
            t(seqTex(S.arith(1, d, 3))) + ' (' + t('d=' + o.s + '\\times 0.1=' + vT(d)) + '); &nbsp;' + t(S.gtSteps(1, d)), ['Between readings the depth changes by ' + t(o.s) + '&nbsp;m.'], 'EP diver readings and general term');
        } },
        { id: 'eB4b', sub: 'b', level: 'PRG', make: function (r, o) {
          var d = cl(0.1 * o.s), R = cl(1 + (o.m - 1) * d), depth = (o.m - 1) * o.s;
          return S.numPart('At what depth is the reading ' + t(vT(R)) + '&nbsp;atm?', depth, [[o.m * o.s, 'u1l3-depth-step', 'Reading 1 is at the surface (0&nbsp;m), so reading ' + t(o.m) + ' is ' + t(o.m - 1) + ' steps down.'], [o.m, 'u1l1-gave-value', 'That is the reading number. Multiply the number of steps by ' + t(o.s) + '&nbsp;m.']],
            t(S.gtTex(1, d) + '=' + vT(R)) + ' &nbsp;⇒&nbsp; ' + t('n=' + o.m) + '. Reading ' + t(o.m) + ' is ' + t((o.m - 1) + '\\times ' + o.s + '=' + depth) + '&nbsp;m deep.', ['Find which reading it is, then work out its depth.'], 'EP diver depth', { after: 'm' });
        } }] },
    { num: 'B5', parts: [
      { id: 'eB5', level: 'EMG', make: function (r) {
        var o = pw(function () { return { b: r.int(13, 23) * 0.25, c: r.int(30, 48) * 0.05 }; }, function (z) { return !(z.b === 4.25 && Math.abs(z.c - 1.9) < 1e-9); }), bT = cl(o.b).toFixed(2), cT = cl(o.c).toFixed(2), sT = cl(o.b + o.c).toFixed(2);
        return S.mc(r, '<i>(Multiple Choice)</i> A taxi charges \\$' + bT + ' plus \\$' + cT + ' per kilometre. Which general term gives the fare, in dollars, for a trip of ' + t('n') + '&nbsp;km?', [
          { html: t('t_n=' + cT + 'n+' + bT), right: true }, { html: t('t_n=' + bT + '+' + cT + '(n-1)'), why: 'That makes \\$' + bT + ' the fare for 1&nbsp;km. A 1&nbsp;km trip costs \\$' + sT + '.' },
          { html: t('t_n=' + sT + 'n'), why: 'The \\$' + bT + ' is paid once, not for every kilometre.' }, { html: t('t_n=' + bT + 'n+' + cT), why: 'The per-kilometre charge multiplies ' + t('n') + '.' }],
          t('t_1=' + sT + ',\\ d=' + cT) + ': ' + t('t_n=' + sT + '+' + cT + '(n-1)=' + cT + 'n+' + bT) + '.', ['What is the fare for 1 km? How much does each extra kilometre add?'], 'EP MC taxi');
      } }] },
    { num: 'B6', parts: [
      { id: 'eB6', level: 'PRG', make: function (r) {
        var o = pw(function () { var p = r.int(3, 8), q = p + r.int(6, 10); return { t1: r.int(2, 20), d: r.int(3, 9), p: p, q: q, R: q + r.int(5, 12) }; }, function (z) { var v = z.t1 + (z.R - 1) * z.d; return !(z.p === 6 && z.q === 15 && z.R === 25) && v <= 9999; });
        var tp = o.t1 + (o.p - 1) * o.d, tq = o.t1 + (o.q - 1) * o.d, v = o.t1 + (o.R - 1) * o.d;
        var p = S.numPart('<i>(Numerical Response)</i> An arithmetic sequence has ' + t(tsub(o.p) + '=' + tp) + ' and ' + t(tsub(o.q) + '=' + tq) + '. The value of ' + t(tsub(o.R)) + ' is ______.', v, [[o.t1 + o.R * o.d, 'u1l1-gt-n', 'That is ' + t(tsub(o.R + 1)) + '.'], [tq + (o.R - o.q + 1) * o.d, 'u1l1-shift', 'From ' + t(tsub(o.q)) + ' to ' + t(tsub(o.R)) + ' is ' + t(o.R - o.q) + ' steps.']],
          dSol(tp, o.p, tq, o.q, o.d) + ', &nbsp;' + t1Sol(tp, o.p, o.d, o.t1) + ', &nbsp;' + t(tsub(o.R) + '=' + o.t1 + '+' + (o.R - 1) + '(' + o.d + ')=' + v), HD, 'EP NR t_R from two terms');
        p.input.nr = true; return p;
      } }] },
    { num: 'C1', section: 'C. Stretch', parts: [
      { id: 'eC1', level: 'MAS', make: function (r) {
        var o = pw(function () { var p = r.int(2, 4); return { al: r.pick([1, 1, 2]), be: r.pick([1, -1]) * r.int(1, 5), ga: r.pick([1, -1]) * r.int(1, 9), p: p, q: p + r.int(2, 5) }; }, function (z) { return !(z.p === 3 && z.q === 7 && z.al === 1 && z.be === 3 && z.ga === -5) && (z.p - 1) * z.be + z.ga !== 0 && (z.q - 1) * z.be + z.ga !== 0; });
        var kp = (o.p - 1) * o.al, cp = (o.p - 1) * o.be + o.ga, kq = (o.q - 1) * o.al, cq = (o.q - 1) * o.be + o.ga, L = S.linX, dP = P.add(P.mono(o.al, { k: 1 }), P.num(o.be));
        return S.fieldsPart('In an arithmetic sequence, ' + t(tsub(o.p) + '=' + L(kp, cp, 'k')) + ' and ' + t(tsub(o.q) + '=' + L(kq, cq, 'k')) + '. Determine ' + t('d') + ' in terms of ' + t('k') + ', and show that ' + t('t_1') + ' does not depend on ' + t('k') + ' (give its value).', [S.fPoly('d', dP, { var: 'k' }), S.fNum('t_1', o.ga, [[cp - (o.p) * o.be, 'u1l1-gt-n', t(tsub(o.p)) + ' is ' + t(o.p - 1) + ' steps after ' + t('t_1') + '.']])],
          t('d=\\dfrac{(' + L(kq, cq, 'k') + ')-(' + L(kp, cp, 'k') + ')}{' + o.q + '-' + o.p + '}=\\dfrac{' + L(kq - kp, cq - cp, 'k') + '}{' + (o.q - o.p) + '}=' + L(o.al, o.be, 'k')) + '<br>' + t('t_1=' + tsub(o.p) + '-' + (o.p - 1) + 'd=' + L(kp, cp, 'k') + '-' + (o.p - 1) + '(' + L(o.al, o.be, 'k') + ')=' + o.ga) + ', for every value of ' + t('k') + '.', ['Use ' + t('d=\\dfrac{t_q-t_p}{q-p}') + ' with the expressions; collect the ' + t('k') + ' terms and the numbers.', 'Then ' + t('t_1=t_p-(p-1)d') + '.'], 'EP stretch: d in terms of k');
      } }] },
    { num: 'C2', parts: [
      { id: 'eC2', level: 'MAS', make: function (r) {
        var o = pw(function () { return { t1: r.int(-25, 15), d: r.pick([1, -1]) * r.int(2, 9), a: r.int(2, 5), b: r.int(6, 12), c: r.int(3, 9) }; }, function (z) { return z.a + z.b !== 2 * z.c && z.c !== z.a && z.c !== z.b && !(z.a === 4 && z.b === 9 && z.c === 6 && z.t1 === -19) && z.t1 !== 0; });
        var Sab = 2 * o.t1 + (o.a + o.b - 2) * o.d, V = o.t1 + (o.c - 1) * o.d, k = o.a + o.b - 2, m = o.c - 1;
        return S.fieldsPart('In an arithmetic sequence, ' + t(tsub(o.a) + '+' + tsub(o.b) + '=' + Sab) + ' and ' + t(tsub(o.c) + '=' + V) + '. Determine ' + t('t_1') + ' and ' + t('d') + '.', [S.fNum('t_1', o.t1, []), S.fNum('d', o.d, [[-o.d, 'sign', 'Check the signs as you eliminate ' + t('t_1') + '.']])],
          t('(t_1+' + (o.a - 1) + 'd)+(t_1+' + (o.b - 1) + 'd)=' + Sab + '\\Rightarrow 2t_1+' + k + 'd=' + Sab) + ' &nbsp;and&nbsp; ' + t('t_1+' + m + 'd=' + V + '\\Rightarrow 2t_1+' + 2 * m + 'd=' + 2 * V) + '<br>Subtract: ' + t((k - 2 * m) + 'd=' + (Sab - 2 * V)) + ', ' + t('d=' + o.d) + ', &nbsp;' + t('t_1=' + V + '-' + m + vP(o.d) + '=' + o.t1), ['Write each term as ' + t('t_1+(n-1)d') + ': you get two equations in ' + t('t_1') + ' and ' + t('d') + '.', 'Double the second equation, then subtract to eliminate ' + t('t_1') + '.'], 'EP stretch: system from a sum');
      } }] },
    { num: 'C3', parts: [
      { id: 'eC3', level: 'ADV', make: function (r) {
        var o = pw(function () { var a = r.int(8, 20); return { F: 10 * r.int(3, 10), a: a, b: a + r.int(3, 8) }; }, function (z) { return !(z.F === 60 && z.a === 12 && z.b === 17); });
        var g = o.b - o.a, m0 = o.F / g, n = Math.floor(m0) + 1;
        return S.fieldsPart('Phone plan A costs \\$' + o.F + ' to start plus \\$' + o.a + ' per month. Plan B has no start-up cost and costs \\$' + o.b + ' per month. Write the total cost of each plan after ' + t('n') + ' months, and find the first month at which plan A has cost less in total.',
          [S.fPoly('\\text{A: }C', S.lin(o.a, o.F), { wrong: [{ is: S.lin(o.a, o.F - o.a), code: 'u1l3-pos', hint: 'After 1 month plan A has cost ' + t('\\$' + (o.F + o.a)) + '.' }] }), S.fPoly('\\text{B: }C', S.lin(o.b, 0), {}), S.fNum('\\text{month}', n, [[Math.ceil(m0), 'u1l3-boundary', isInt(m0) ? 'At month ' + t(m0) + ' the plans cost the same — A is not less yet.' : 'Check that month.'], [n + 1, 'u1l3-round-up', 'Check month ' + t(n) + ': A costs ' + t('\\$' + (o.a * n + o.F)) + ' and B costs ' + t('\\$' + o.b * n) + '.']])],
          'A: ' + t(o.a + 'n+' + o.F) + ' &nbsp; B: ' + t(o.b + 'n') + '<br>' + t(o.a + 'n+' + o.F + '<' + o.b + 'n') + ' &nbsp;⇒&nbsp; ' + t(o.F + '<' + g + 'n') + ' &nbsp;⇒&nbsp; ' + t('n>' + F(Math.round(m0 * 100) / 100)) + ': month ' + t(n) + ' (A: ' + t('\\$' + (o.a * n + o.F)) + ', B: ' + t('\\$' + o.b * n) + (isInt(m0) ? '; at ' + m0 + ' months both cost ' + t('\\$' + o.b * m0) : '') + ').', ['Write each total as ' + t('C=mn+b') + '.', 'Solve A < B for ' + t('n') + ' and take the first whole month that works.'], 'EP stretch: phone plans');
      } }] }
  ];
  function numWord(k) { return ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen'][k]; }

  HW.defineLesson({ id: LID, unit: 1, num: '3', title: 'Arithmetic Sequences in Context (growth, decay, two known terms)', outcome: 'RF9', questions: QUESTIONS, extra: EXTRA });
})(window);
