/* Math 20-1 · Unit 1 · Lesson 9 — Unit 1 Review (outcome per part: RF9 arithmetic, RF10 geometric)
 * Assignment 9 (u1_l09.tex: Multiple Choice 1–9, Numerical Response 10–13, Written Response 14–26) and the Lesson 9
 * Extra Practice, a second practice test (u1_ep09.tex: Multiple Choice 1–10, Numerical Response 11–15, Written Response 16–19).
 * Every part is a generator (booklet idea, form and difficulty; new numbers; the lesson's example numbers and the
 * booklet's own excluded where feasible). Uses HW.u1seq from u1l7.js (load order). Calculator allowed.
 * General terms are typed in n (any equivalent expression is accepted; checked at n = 1…7) with diagnoses for the classic
 * slips (n instead of n − 1, t₁ and d swapped, sign of d, rⁿ instead of rⁿ⁻¹).
 * Conversions: 14(a) "write the first five terms; arithmetic or geometric; linear?" -> one multiple choice (terms and
 * classification together); 26(d) "what must you assume?" -> in the worked solution; WR 19(a) -> boxes x and the terms.
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: 20, 26(c), Extra 19(a). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, ex = HW.ex, F = HW.fmt, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var LID = 'u1l9', G = HW.u1seq;
  if (!G) throw new Error('u1l9.js needs js/lessons/u1l7.js loaded first');
  var L = G.lib, Q = L.Q, qn = L.qn, qa = L.qa, qs = L.qs, qm = L.qm, qd = L.qd, qp = L.qp, qv = L.qv, qeq = L.qeq, qint = L.qint, gsum = L.gsum, term = L.term, first = L.first,
    qtex = L.qtex, pT = L.pT, nT = L.nT, fx = L.fx, fxT = L.fxT, money = L.money, seriesTex = L.seriesTex, pickWhere = L.pickWhere, isBk = L.isBk, terminates = L.terminates, decStr = L.decStr,
    exactP = L.exactP, roundP = L.roundP, nrP = L.nrP, mcP = L.mcP, fieldsP = L.fieldsP, fNum = L.fNum, fRnd = L.fRnd, fS = L.fS, fT = L.fT, cS = L.cS, cE = L.cE, cSet = L.cSet, cl = L.cl, ord = G.ord;

  var CODES = {
    'u1-n-not-n-1': 'General term: used n instead of n − 1', 'u1-swap-td': 'General term: t₁ and d swapped', 'u1-d-sign': 'General term: wrong sign of d', 'u1-r-n': 'General term: rⁿ instead of rⁿ⁻¹',
    'u1-r-time0': 'General term: started from the wrong term (time 0 vs year 1)', 'u1-steps': 'Counted the steps between terms wrong', 'u1-linear': 'Treated a percent change as a fixed amount',
    'u1-time0': 'Counted from the wrong starting term (time 0)', 'u1-arith-geo': 'Mixed up arithmetic and geometric', 'u1-gave-sn': 'Gave Sₙ instead of tₙ', 'u1-count': 'Number of terms off by one',
    'u1-means': 'Means: wrong number of steps', 'u1-mult-ends': 'Multiples: wrong first or last multiple', 'u1-quad-root': 'Kept the negative root of the quadratic', 'u1-one-sign': 'Gave only one of the ± answers',
    'u1-hours': 'Gave doublings instead of hours', 'u1-interest': 'Simple interest: wrong yearly amount', 'u1-ice-base': 'Forgot the starting thickness', 'u1-gm': 'Geometric mean condition set up wrong'
  };
  HW.addCodes(Object.keys(CODES).filter(function (k) { return !HW.CODES[k]; }).reduce(function (o, k) { o[k] = CODES[k]; return o; }, {}));
  HW.addPartial({ 'u1-n-not-n-1': 's', 'u1-swap-td': 'b', 'u1-d-sign': 's', 'u1-r-n': 's', 'u1-r-time0': 's', 'u1-steps': 'b', 'u1-linear': 'n', 'u1-time0': 's', 'u1-arith-geo': 'n', 'u1-gave-sn': 'b', 'u1-count': 's',
    'u1-means': 'b', 'u1-mult-ends': 's', 'u1-quad-root': 's', 'u1-one-sign': 's', 'u1-hours': 's', 'u1-interest': 'b', 'u1-ice-base': 's', 'u1-gm': 'b' });

  /* ---------------- arithmetic helpers ---------------- */
  function at(t1, d, n) { return cl(t1 + (n - 1) * d); }
  function as(t1, d, n) { return cl(n / 2 * (2 * t1 + (n - 1) * d)); }
  function sg(x) { return x < 0 ? '-' + nT(-x) : '+' + nT(x); }
  /* "4n-3" for t1 + (n−1)d */
  function aTex(t1, d) { var b = cl(t1 - d); return (d === 1 ? '' : d === -1 ? '-' : nT(d)) + 'n' + (b === 0 ? '' : sg(b)); }
  function aCands(t1, d) {
    return [[function (n) { return t1 + n * d; }, 'u1-n-not-n-1', 'Check ' + t('n=1') + ': your formula should give ' + t('t_1=' + nT(t1)) + '. The general term is ' + t('t_1+(n-1)d') + ' — use ' + t('n-1') + ', not ' + t('n') + '.'],
      [function (n) { return d + (n - 1) * t1; }, 'u1-swap-td', 'You swapped ' + t('t_1') + ' and ' + t('d') + ': ' + t('t_n=t_1+(n-1)d') + ' with ' + t('t_1=' + nT(t1)) + ' and ' + t('d=' + nT(d)) + '.'],
      [function (n) { return t1 - (n - 1) * d; }, 'u1-d-sign', 'Check the sign of ' + t('d') + ': ' + t('d=' + nT(d)) + '.']];
  }
  function gTex(a, r, base) { return nT(a) + '(' + nT(r) + ')^{n' + (base === 0 ? '' : '-1') + '}'; }
  function gCands(a, r) {
    return [[function (n) { return a * Math.pow(r, n); }, 'u1-r-n', 'Check ' + t('n=1') + ': your formula should give ' + t('t_1=' + nT(a)) + '. The exponent is ' + t('n-1') + '.'],
      [function (n) { return r * Math.pow(a, n - 1); }, 'u1-swap-td', 'You swapped ' + t('t_1') + ' and ' + t('r') + ': ' + t('t_n=t_1r^{n-1}') + '.'], [function (n) { return a + (n - 1) * r; }, 'u1-arith-geo', 'That is an arithmetic formula. A fixed percent change is geometric: ' + t('t_n=t_1r^{n-1}') + '.']];
  }
  function choicesNum(arr) { return arr.map(function (x) { return t(F(x)); }); }
  /* a multiple choice with numeric options, shown in increasing order */
  function mcNum(r, prompt, right, wrongs, sol, hints, text, fmt) {
    fmt = fmt || function (x) { return t(F(x)); };
    var all = [{ v: right, right: true }].concat(wrongs.map(function (w) { return { v: w[0], why: w[1] }; })), seen = [], opts = [];
    all.forEach(function (o) { var k = String(cl(o.v)); if (seen.indexOf(k) >= 0 || !isFinite(o.v)) return; seen.push(k); opts.push(o); });
    var step = Math.max(1, Math.abs(Math.round(right / 10)) || 1), j = 1;
    while (opts.length < 4) { var v = right + (j % 2 ? 1 : -1) * Math.ceil(j / 2) * step; j++; if (seen.indexOf(String(cl(v))) < 0) { seen.push(String(cl(v))); opts.push({ v: v, why: 'Check your working again.' }); } }
    opts = opts.slice(0, 4).sort(function (a, b) { return a.v - b.v; });
    return K.P.mc(r, prompt, opts.map(function (o) { return { html: fmt(o.v), right: !!o.right, why: o.why }; }), sol, hints, text, true);
  }
  var HA = ['Arithmetic: ' + t('t_n=t_1+(n-1)d') + ', ' + t('S_n=\\dfrac{n}{2}\\left[2t_1+(n-1)d\\right]=\\dfrac{n}{2}(t_1+t_n)') + '.'];
  var HG = ['Geometric: ' + t('t_n=t_1r^{n-1}') + ', ' + t('S_n=\\dfrac{t_1(r^n-1)}{r-1}') + ', ' + t('S_\\infty=\\dfrac{t_1}{1-r}') + ' when ' + t('-1<r<1') + '.'];

  /* =========================== Assignment 9 =========================== */
  var QUESTIONS = [
    { num: '1', section: 'Multiple Choice', parts: [{ id: '1', level: 'EMG', outcome: 'RF9', make: function (r) {
      var a = r.int(2, 9), d = r.int(2, 6), g = r.int(2, 4), k = r.int(2, 4), m = 2;
      var A = [0, 1, 2, 3].map(function (i) { return a + i * d; }), Bs = [0, 1, 2, 3].map(function (i) { return a * Math.pow(g, i); }), b2 = 2 * r.int(1, 4) * 4, C = [b2, b2 * 1.5, b2 * 2.25, b2 * 3.375], D = [a, a + k, a + 2 * k + m, a + 3 * k + 3 * m];
      var sq = function (s) { return t(s.map(function (x) { return nT(x); }).join(',\\ ') + ',\\ \\ldots'); };
      return mcP(r, 'Which sequence is neither arithmetic nor geometric?', sq(D), [{ html: sq(A), why: 'Differences: ' + t(d) + ' each time, so it is arithmetic.' }, { html: sq(Bs), why: 'Ratios: ' + t(g) + ' each time, so it is geometric.' }, { html: sq(C), why: 'Ratios: ' + t('1.5') + ' each time, so it is geometric.' }],
        t(nT(D[0]) + ',\\ ' + nT(D[1]) + ',\\ ' + nT(D[2]) + ',\\ ' + nT(D[3])) + ': differences ' + t(k + ',\\ ' + (k + m) + ',\\ ' + (k + 2 * m)) + ' and ratios are not constant. (The others: ' + t('d=' + d) + '; ' + t('r=' + g) + '; ' + t('r=1.5') + '.)', ['Check the differences and the ratios of each.'], 'MC: neither arithmetic nor geometric');
    } }] },
    { num: '2', parts: [{ id: '2', level: 'BEG', outcome: 'RF9', make: function (r) {
      var z = pickWhere(function () { return { t1: r.int(2, 12), d: r.int(3, 9), n: r.int(25, 60) }; }, function (z) { return !(z.t1 === 7 && z.d === 5 && z.n === 44); });
      var X = at(z.t1, z.d, z.n), ts = function (k) { return t('t_{' + k + '}'); };
      return K.P.mc(r, 'In the arithmetic sequence ' + t(z.t1 + ',\\ ' + (z.t1 + z.d) + ',\\ ' + (z.t1 + 2 * z.d) + ',\\ \\ldots') + ', the number ' + t(F(X)) + ' is the term', [-1, 0, 1, 2].map(function (o) {
        return { html: ts(z.n + o), right: o === 0, why: o === -1 ? 'Solve ' + t(z.t1 + '+(n-1)(' + z.d + ')=' + X) + ': ' + t('n-1=' + (z.n - 1)) + ', so ' + t('n=' + z.n) + '.' : 'Solve ' + t(z.t1 + '+(n-1)(' + z.d + ')=' + X) + ' for ' + t('n') + '.' };
      }), t(z.t1 + '+(n-1)(' + z.d + ')=' + X + '\\ \\Rightarrow\\ n-1=' + (z.n - 1) + '\\ \\Rightarrow\\ n=' + z.n), HA, 'MC: which term', true);
    } }] },
    { num: '3', parts: [{ id: '3', level: 'PRG', outcome: 'RF10', make: function (r) {
      var z = pickWhere(function () { return { a: r.int(2, 9), r: r.pick([-2, -3, 2, 3, -2]) }; }, function (z) { return !(z.a === 5 && z.r === -2); });
      var t4 = z.a * Math.pow(z.r, 3), t7 = z.a * Math.pow(z.r, 6);
      return mcNum(r, 'In a geometric sequence, ' + t('t_1=' + z.a) + ' and ' + t('t_4=' + F(t4)) + '. The value of ' + t('t_7') + ' is', t7, [[-t7, 'Check the sign: ' + t('(' + z.r + ')^{6}') + ' is positive.'], [z.a * Math.pow(z.r, 7), 'That is ' + t('t_8') + ': ' + t('t_7=t_1r^{6}') + '.'], [-z.a * Math.pow(z.r, 7), t('t_7=t_1r^{6}') + '.']],
        t(z.a + 'r^{3}=' + F(t4) + '\\ \\Rightarrow\\ r^{3}=' + Math.pow(z.r, 3) + '\\ \\Rightarrow\\ r=' + z.r) + '. ' + t('t_7=' + z.a + '(' + z.r + ')^{6}=' + F(t7)), HG, 'MC: geometric term');
    } }] },
    { num: '4', parts: [{ id: '4', level: 'ADV', outcome: 'RF9', make: function (r) {
      var z = pickWhere(function () { return { a: r.int(2, 5), b: r.int(-5, 5) }; }, function (z) { return z.b !== 0 && !(z.a === 3 && z.b === -1) && !(z.a === 2 && z.b === 3); });
      var A = 2 * z.a, B = z.b - z.a, lin = function (p, q) { return t('t_n=' + p + 'n' + (q === 0 ? '' : q > 0 ? '+' + q : String(q))); };
      return mcP(r, 'The sum of the first ' + t('n') + ' terms of a sequence is ' + t('S_n=' + z.a + 'n^{2}' + (z.b > 0 ? '+' + z.b : String(z.b)) + 'n') + '. The general term is', lin(A, B),
        [{ html: lin(A, B + 2), why: 'Find ' + t('t_1=S_1=' + (z.a + z.b)) + ' and check your formula at ' + t('n=1') + '.' }, { html: lin(A, z.b + z.a), why: 'Check at ' + t('n=1') + ': ' + t('t_1=S_1=' + (z.a + z.b)) + '.' }, { html: lin(A, B - 2), why: 'Check at ' + t('n=1') + ': ' + t('t_1=S_1=' + (z.a + z.b)) + '.' }, { html: t('t_n=' + z.a + 'n^{2}' + (z.b > 0 ? '+' + z.b : String(z.b)) + 'n'), why: 'That is ' + t('S_n') + ' itself.' }],
        t('t_1=S_1=' + (z.a + z.b)) + ', ' + t('t_2=S_2-S_1=' + (4 * z.a + 2 * z.b) + '-' + (z.a + z.b) + '=' + (3 * z.a + z.b)) + ', so ' + t('d=' + A) + ' and ' + t('t_n=' + (z.a + z.b) + '+(n-1)' + A + '=' + A + 'n' + (B === 0 ? '' : B > 0 ? '+' + B : String(B))) + '.', [t('t_1=S_1') + ' and ' + t('t_2=S_2-S_1') + '.'], 'MC: tₙ from Sₙ = an² + bn');
    } }] },
    { num: '5', parts: [{ id: '5', level: 'PRG', outcome: 'RF9', make: function (r) {
      var z = pickWhere(function () { return { d: r.pick([-3, -2, -4, -5, 2, 3, 4]), k: r.int(4, 8), v: r.int(-10, 12) }; }, function (z) { return !(z.d === -3 && z.k === 5 && z.v === 4); });
      var t1 = z.v - (z.k - 1) * z.d;
      return mcNum(r, 'The points ' + t('(n,\\ t_n)') + ' of an arithmetic sequence lie on a line with slope ' + t(z.d) + ' that passes through ' + t('(' + z.k + ',\\ ' + z.v + ')') + '. The first term is', t1,
        [[z.v - z.k * z.d, 'From ' + t('t_1') + ' to ' + t('t_{' + z.k + '}') + ' is ' + t(z.k - 1) + ' steps, not ' + t(z.k) + '.'], [z.v + (z.k - 1) * z.d, 'Going back to ' + t('t_1') + ' you subtract the steps: ' + t('t_1=t_' + z.k + '-' + (z.k - 1) + 'd') + '.'], [z.v - z.d, 'That goes back only one step.']],
        t('d=' + z.d) + ' (the slope) and ' + t('t_{' + z.k + '}=' + z.v) + ', so ' + t('t_1=' + z.v + '-' + (z.k - 1) + '(' + z.d + ')=' + t1) + '.', ['The slope is ' + t('d') + '; the point says ' + t('t_{' + z.k + '}=' + z.v) + '.'], 'MC: t₁ from a graph line');
    } }] },
    { num: '6', parts: [{ id: '6', level: 'PRG', outcome: 'RF10', make: function (r) {
      var z = pickWhere(function () { return { P: r.pick([18000, 24500, 28500, 32000, 21000, 36500]), pc: r.pick([12, 15, 18, 20, 22]), k: r.int(3, 6) }; }, function (z) { return !(z.P === 28500 && z.pc === 18 && z.k === 4) && !(z.P === 32000 && z.pc === 15); });
      var g = 1 - z.pc / 100, right = K.roundTo(z.P * Math.pow(g, z.k), 2);
      return mcNum(r, 'A car bought for ' + t('\\$' + F(z.P)) + ' loses ' + t(z.pc + '\\%') + ' of its value each year. To the nearest cent, its value ' + t(z.k) + ' years after it was bought is', right,
        [[K.roundTo(z.P - z.k * z.P * z.pc / 100, 2), 'That subtracts a fixed ' + t(money(z.P * z.pc / 100)) + ' a year. A percent loss is geometric: ' + t('r=' + nT(g)) + '.'], [K.roundTo(z.P * Math.pow(g, z.k + 1), 2), 'That is ' + t(z.k + 1) + ' years.'], [K.roundTo(z.P * Math.pow(g, z.k - 1), 2), 'That is ' + t(z.k - 1) + ' years: the purchase price is the value at time 0, so after ' + t(z.k) + ' years multiply by ' + t(nT(g)) + ' ' + t(z.k) + ' times.']],
        t(F(z.P) + '(' + nT(g) + ')^{' + z.k + '}\\approx ' + money(right)) + '.', ['The value at time 0 is ' + t('\\$' + F(z.P)) + '; each year multiply by ' + t(nT(g)) + '.'], 'MC: depreciation', function (x) { return t(money(x)); });
    } }] },
    { num: '7', parts: [{ id: '7', level: 'PRG', outcome: 'RF10', make: function (r) {
      var z = pickWhere(function () { return { S: r.pick([10, 15, 20, 25, 30, 40, 50]), r: r.pick([-0.6, -0.5, -0.4, -0.2, -0.8, -0.25]) }; }, function (z) { return !(z.S === 25 && z.r === -0.6); });
      var t1 = cl(z.S * (1 - z.r));
      return mcNum(r, 'An infinite geometric series has ' + t('S_\\infty=' + z.S) + ' and ' + t('r=' + nT(z.r)) + '. The first term is', t1, [[cl(z.S * (1 + z.r)), t('t_1=S_\\infty(1-r)') + ', and ' + t('1-(' + nT(z.r) + ')=' + nT(1 - z.r)) + '.'], [cl(z.S * z.r), 'Multiply by ' + t('1-r') + ', not by ' + t('r') + '.'], [cl(z.S / (1 - z.r)), 'Multiply by ' + t('1-r') + ' — don’t divide.']],
        t('t_1=S_\\infty(1-r)=' + z.S + '(' + nT(1 - z.r) + ')=' + nT(t1)) + '.', HG, 'MC: t₁ from S∞', function (x) { return t(nT(x)); });
    } }] },
    { num: '8', parts: [{ id: '8', level: 'EMG', outcome: 'RF9', make: function (r) {
      var z = pickWhere(function () { return { k: r.int(2, 5), d: r.int(2, 9) * r.pick([1, 1, -1]), A: r.int(-10, 20) }; }, function (z) { return !(z.k === 3 && z.d === 7 && z.A === 5); });
      var B = z.A + (z.k + 1) * z.d, D = B - z.A, means = []; for (var i = 1; i <= z.k; i++) means.push(z.A + i * z.d);
      return mcNum(r, t(z.k) + ' arithmetic means are inserted between ' + t(z.A) + ' and ' + t(B) + '. The common difference is', z.d, [[D / z.k, 'There are ' + t(z.k + 1) + ' steps from ' + t(z.A) + ' to ' + t(B) + ' (one more than the number of means).'], [D / (z.k + 2), 'There are ' + t(z.k + 1) + ' steps, not ' + t(z.k + 2) + '.'], [z.k > 1 ? D / (z.k - 1) : 2 * D, 'Count the steps: ' + t(z.k + 1) + '.']],
        'The sequence is ' + t(z.A + ',\\ ' + means.map(function () { return '\\_'; }).join(',\\ ') + ',\\ ' + B) + ': ' + t(z.k + 1) + ' steps, so ' + t((z.k + 1) + 'd=' + D) + ' and ' + t('d=' + z.d) + '. The means are ' + t(means.join(',\\ ')) + '.', [t(z.k) + ' means make ' + t(z.k + 1) + ' steps.'], 'MC: arithmetic means', function (x) { return t(Math.abs(x - Math.round(x)) < 1e-9 ? F(Math.round(x)) : Math.abs(x * 10 - Math.round(x * 10)) < 1e-9 ? nT(x) : K.decTex(Q(Math.round(x * 3 * 4 * 5 * 7), 3 * 4 * 5 * 7))); });
    } }] },
    { num: '9', parts: [{ id: '9', level: 'PRG', outcome: 'RF10', make: function (r) {
      var z = pickWhere(function () { return { a: r.int(2, 6), r: r.int(2, 3), n: r.int(7, 10) }; }, function (z) { return !(z.a === 3 && z.r === 2 && z.n === 9) && z.a * Math.pow(z.r, z.n - 1) < 30000; });
      var last = z.a * Math.pow(z.r, z.n - 1), S = qv(gsum(z.a, z.r, z.n));
      return mcNum(r, 'The sum of the geometric series ' + t(seriesTex(first(z.a, z.r, 3), { last: [last, 1] })) + ' is', S, [[S - last, 'That leaves out the last term. Use ' + t('\\dfrac{rt_n-t_1}{r-1}') + '.'], [z.r * last, 'That is the next term, not the sum.'], [qv(gsum(z.a, z.r, z.n + 1)), 'That adds one term too many.']],
        t(z.a + '(' + z.r + ')^{n-1}=' + F(last) + '\\ \\Rightarrow\\ n=' + z.n) + '. ' + t('S_{' + z.n + '}=\\dfrac{' + z.r + '(' + F(last) + ')-' + z.a + '}{' + z.r + '-1}=' + F(S)) + '.', HG, 'MC: geometric sum to a last term');
    } }] },
    { num: '10', section: 'Numerical Response', parts: [{ id: '10', level: 'PRG', outcome: 'RF9', make: function (r) {
      var z = pickWhere(function () { return { t1: r.int(5, 30), d: r.int(3, 9), n: r.int(40, 150) }; }, function (z) { return !(z.t1 === 15 && z.d === 7 && z.n === 99) && at(z.t1, z.d, z.n) < 10000; });
      var last = at(z.t1, z.d, z.n);
      return nrP('The number of terms in the arithmetic sequence ' + t(z.t1 + ',\\ ' + (z.t1 + z.d) + ',\\ ' + (z.t1 + 2 * z.d) + ',\\ \\ldots,\\ ' + F(last)) + ' is _____.', z.n, { cands: [[z.n - 1, 'u1-count', t('\\dfrac{' + F(last) + '-' + z.t1 + '}{' + z.d + '}=' + (z.n - 1)) + ' counts the steps. The number of terms is one more.'], [z.n + 1, 'u1-count', t('n=\\dfrac{t_n-t_1}{d}+1') + '.']] },
        t('n=\\dfrac{' + F(last) + '-' + z.t1 + '}{' + z.d + '}+1=' + (z.n - 1) + '+1=' + z.n), [t('n=\\dfrac{t_n-t_1}{d}+1') + '.'], 'NR: number of terms');
    } }] },
    { num: '11', parts: [{ id: '11', level: 'ADV', outcome: 'RF10', make: function (r) {
      var z = pickWhere(function () { return { t3: r.int(10, 80), r: r.pick([1.5, 2.5, 1.2, 0.5, 1.5]) }; }, function (z) { var t6 = z.t3 * Math.pow(z.r, 3), t1 = z.t3 / (z.r * z.r); return !(z.t3 === 20 && z.r === 1.5) && Math.abs(t6 * 1000 - Math.round(t6 * 1000)) < 1e-6 && Math.abs(t1 * 10 - Math.round(t1 * 10)) > 1e-6 && t1 < 999; });
      var t6 = cl(z.t3 * Math.pow(z.r, 3)), t1 = z.t3 / (z.r * z.r);
      return nrP('In a geometric sequence, ' + t('t_3=' + z.t3) + ' and ' + t('t_6=' + nT(t6)) + '. The first term, to the nearest tenth, is _____.', t1, { dp: 1, cands: [[z.t3 / Math.pow(z.r, 3), 'u1-steps', 'From ' + t('t_1') + ' to ' + t('t_3') + ' is 2 steps: ' + t('t_1=\\dfrac{t_3}{r^{2}}') + '.'], [z.t3 / z.r, 'u1-steps', 'From ' + t('t_1') + ' to ' + t('t_3') + ' is 2 steps.'], [z.t3 * z.r * z.r, 'u1-steps', 'Divide by ' + t('r^{2}') + ' to go back.']] },
        t(z.t3 + 'r^{3}=' + nT(t6) + '\\ \\Rightarrow\\ r^{3}=' + nT(cl(Math.pow(z.r, 3))) + '\\ \\Rightarrow\\ r=' + nT(z.r)) + '. ' + t('t_1=\\dfrac{' + z.t3 + '}{' + nT(z.r) + '^{2}}\\approx ' + fxT(t1, 1)), ['From ' + t('t_3') + ' to ' + t('t_6') + ' is 3 steps: ' + t('r^{3}=\\dfrac{t_6}{t_3}') + '.'], 'NR: t₁ from two terms');
    } }] },
    { num: '12', parts: [{ id: '12', level: 'PRG', outcome: 'RF9', make: function (r) {
      var z = pickWhere(function () { return { T: r.int(2, 8), k: r.int(1, 3), n: r.int(8, 20), what: r.pick(['Cans', 'Logs', 'Boxes', 'Bricks']) }; }, function (z) { return !(z.T === 4 && z.k === 2 && z.n === 14); });
      var B = z.T + (z.n - 1) * z.k, S = z.n * (B + z.T) / 2;
      return nrP(z.what + ' are stacked in rows. The bottom row has ' + t(B) + ', each row above has ' + t(z.k) + ' fewer than the row below it, and the top row has ' + t(z.T) + '. The total number is _____.', S, { cands: [[(z.n - 1) * (B + z.T) / 2, 'u1-count', 'Count the rows: ' + t('n=\\dfrac{' + z.T + '-' + B + '}{-' + z.k + '}+1=' + z.n) + '.'], [(z.n + 1) * (B + z.T) / 2, 'u1-count', 'Count the rows: ' + t(z.n) + '.'], [B + z.T, 'u1-gave-sn', 'Add all the rows: ' + t('S_n=\\dfrac{n}{2}(t_1+t_n)') + '.']] },
        t('n=\\dfrac{' + z.T + '-' + B + '}{-' + z.k + '}+1=' + z.n) + ' rows. ' + t('S_{' + z.n + '}=\\dfrac{' + z.n + '}{2}(' + B + '+' + z.T + ')=' + S), ['Find the number of rows first.', HA[0]], 'NR: stacked rows');
    } }] },
    { num: '13', parts: [{ id: '13', level: 'PRG', outcome: 'RF10', make: function (r) {
      var z = pickWhere(function () { return { a: r.int(1, 9), b: r.int(1, 9) }; }, function (z) { return z.a !== z.b && !(z.a === 1 && z.b === 5); });
      var V = qa(Q(z.a, 10), Q(z.b, 90));
      return nrP('When ' + t('0.' + z.a + '\\overline{' + z.b + '}') + ' is written as a fraction ' + t('\\dfrac{a}{b}') + ' in lowest terms, the value of ' + t('b') + ' is _____.', V[1], { cands: [[90, 'lowest', 'Reduce the fraction to lowest terms first.'], [99, 'u1l8-non-rep', 'Only ' + t(z.b) + ' repeats; keep ' + t('0.' + z.a) + ' separate.'], [9, 'u1l8-non-rep', 'Only ' + t(z.b) + ' repeats.']] },
        t('0.' + z.a + '+(0.0' + z.b + '+0.00' + z.b + '+\\cdots)=\\dfrac{' + z.a + '}{10}+\\dfrac{0.0' + z.b + '}{0.9}=\\dfrac{' + z.a + '}{10}+\\dfrac{' + z.b + '}{90}=\\dfrac{' + (9 * z.a + z.b) + '}{90}=' + qtex(V)) + '. ' + t('b=' + V[1]), ['Keep ' + t('0.' + z.a) + ' separate; the repeating part has ' + t('r=0.1') + '.'], 'NR: repeating decimal denominator');
    } }] },
    /* ---------------- Written response ---------------- */
    { num: '14', section: 'Written Response', shared: function (r) { return pickWhere(function () { return { c: r.int(15, 40), d: r.int(2, 5) }; }, function (z) { return !(z.c === 25 && z.d === 3) && z.c % z.d !== 0; }); },
      stem: function (z) { return 'A sequence has general term ' + t('t_n=' + z.c + '-' + z.d + 'n') + '.'; }, parts: [
        { id: '14a', level: 'BEG', outcome: 'RF9', make: function (r, z) {
          var T = [1, 2, 3, 4, 5].map(function (n) { return z.c - z.d * n; }), T0 = [0, 1, 2, 3, 4].map(function (n) { return z.c - z.d * n; }), j = function (a) { return t(a.join(',\\ ')); };
          return mcP(r, 'Write the first five terms. Is the sequence arithmetic or geometric? Is its graph linear?', j(T) + '; arithmetic (' + t('d=-' + z.d) + '), so its graph is linear.',
            [{ html: j(T) + '; geometric, so its graph is not linear.', why: 'The terms change by the same amount (' + t('-' + z.d) + ') each time: arithmetic.' }, { html: j(T0) + '; arithmetic, so its graph is linear.', why: 'Start at ' + t('n=1') + ': ' + t('t_1=' + z.c + '-' + z.d + '=' + T[0]) + '.' }, { html: j(T) + '; arithmetic, but its graph is not linear.', why: 'An arithmetic sequence graphs as points on a line (slope ' + t('d') + ').' }],
            t(T.join(',\\ ')) + '. Arithmetic (' + t('d=-' + z.d) + '), so its graph is linear.', ['Substitute ' + t('n=1,\\ 2,\\ 3,\\ 4,\\ 5') + '.'], 'terms and type from tₙ');
        } },
        { id: '14b', level: 'EMG', outcome: 'RF9', make: function (r, z) {
          var n = pickWhere(function () { return r.int(15, 40); }, function (n) { return n !== 25; }), X = z.c - z.d * n;
          return exactP('Which term is ' + t(X) + '? (Give ' + t('n') + '.)', [n, 1], { before: 'n =', cands: [[n - 1, 'u1-count', 'Check: ' + t('t_{' + (n - 1) + '}=' + (z.c - z.d * (n - 1))) + '.'], [-n, 'sign', 'Solve ' + t(z.c + '-' + z.d + 'n=' + X) + ' carefully.']] }, t(z.c + '-' + z.d + 'n=' + X + '\\ \\Rightarrow\\ ' + z.d + 'n=' + (z.c - X) + '\\ \\Rightarrow\\ n=' + n) + ': ' + t('t_{' + n + '}'), ['Set ' + t('t_n=' + X) + ' and solve for ' + t('n') + '.'], 'which term');
        } },
        { id: '14c', level: 'PRG', outcome: 'RF9', make: function (r, z) {
          var n = Math.floor(z.c / z.d) + 1, v = z.c - z.d * n;
          return fieldsP('Determine the first negative term.', [fNum(t('n='), [n, 1], { cands: [[n - 1, 'u1-count', t('t_{' + (n - 1) + '}=' + (z.c - z.d * (n - 1))) + ' is still positive.']] }), fNum(t('t_n='), [v, 1], { cands: [[z.c - z.d * (n - 1), 'sign', 'That term is not negative.']] })],
            t('t_{' + n + '}=' + v), t(z.c + '-' + z.d + 'n<0\\ \\Rightarrow\\ n>' + nT(K.roundTo(z.c / z.d, 3)) + '\\ldots') + ', so the first negative term is ' + t('t_{' + n + '}=' + z.c + '-' + z.d * n + '=' + v) + '.', ['Solve ' + t(z.c + '-' + z.d + 'n<0') + '; ' + t('n') + ' must be a whole number.'], 'first negative term');
        } }] },
    { num: '15', parts: [
      { id: '15a', level: 'EMG', outcome: 'RF9', make: function (r) {
        var z = pickWhere(function () { return { t1: r.int(-12, 12), d: r.pick([1.5, 2.5, 3.5, -1.5, 4.5, -2.5]), k: r.int(15, 30) }; }, function (z) { return !(z.t1 === -8 && z.d === 3.5) && z.t1 !== 0; });
        var tk = at(z.t1, z.d, z.k);
        return fieldsP('An arithmetic sequence has ' + t('t_1=' + z.t1) + ' and ' + t('d=' + nT(z.d)) + '. Determine ' + t('t_{' + z.k + '}') + ' and the general term.',
          [fNum(t('t_{' + z.k + '}='), qn(tk), { cands: [[at(z.t1, z.d, z.k + 1), 'u1-n-not-n-1', t('t_{' + z.k + '}=t_1+' + (z.k - 1) + 'd') + '.']] }), fT(t('t_n='), function (n) { return z.t1 + (n - 1) * z.d; }, aTex(z.t1, z.d), { cands: aCands(z.t1, z.d) })],
          t('t_{' + z.k + '}=' + nT(tk) + ',\\ t_n=' + aTex(z.t1, z.d)), t('t_{' + z.k + '}=' + z.t1 + '+' + (z.k - 1) + '(' + nT(z.d) + ')=' + nT(tk)) + '<br>' + t('t_n=' + z.t1 + '+(n-1)(' + nT(z.d) + ')=' + aTex(z.t1, z.d)), HA, 'a term and the general term');
      } },
      { id: '15b', level: 'PRG', outcome: 'RF9', make: function (r) {
        var z = pickWhere(function () { return { A: r.int(-10, 30), d: r.int(-6, 6) }; }, function (z) { return z.d !== 0 && !(z.A === 10 && z.d === -3); });
        var B = z.A + 5 * z.d, M = [1, 2, 3, 4].map(function (i) { return z.A + i * z.d; });
        return fieldsP('Insert four arithmetic means between ' + t(z.A) + ' and ' + t(B) + '.', M.map(function (m, i) { return fNum('mean ' + (i + 1) + ':', [m, 1], { cands: [[cl(z.A + (i + 1) * (B - z.A) / 4), 'u1-means', 'Four means make 5 steps: ' + t('5d=' + (B - z.A)) + '.']], name: 'mean ' + (i + 1) }); }),
          t(M.join(',\\ ')), '5 steps: ' + t('5d=' + B + '-' + (z.A < 0 ? '(' + z.A + ')' : z.A) + '=' + (B - z.A) + '\\ \\Rightarrow\\ d=' + z.d) + '. Means: ' + t(M.join(',\\ ')) + '.', ['Four means between two numbers make 5 steps of ' + t('d') + '.'], 'four arithmetic means');
      } }] },
    { num: '16', parts: [{ id: '16', level: 'PRG', outcome: 'RF9', make: function (r) {
      var z = pickWhere(function () { var i = r.int(3, 8); return { i: i, j: i + r.int(5, 10), t1: r.int(-10, 20), d: r.int(2, 9) * r.pick([1, 1, -1]), k: r.int(30, 50) }; }, function (z) { return !(z.i === 6 && z.j === 15) && !(z.i === 5 && z.j === 12); });
      var ti = at(z.t1, z.d, z.i), tj = at(z.t1, z.d, z.j), tk = at(z.t1, z.d, z.k);
      return fieldsP('In an arithmetic sequence, ' + t('t_{' + z.i + '}=' + ti) + ' and ' + t('t_{' + z.j + '}=' + tj) + '. Determine ' + t('d') + ', ' + t('t_1') + ', the general term and ' + t('t_{' + z.k + '}') + '.',
        [fNum(t('d='), [z.d, 1], { cands: [[cl((tj - ti) / (z.j - z.i + 1)), 'u1-steps', 'From ' + t('t_{' + z.i + '}') + ' to ' + t('t_{' + z.j + '}') + ' is ' + t(z.j - z.i) + ' steps.'], [tj - ti, 'u1-steps', 'Divide by the number of steps, ' + t(z.j - z.i) + '.']] }),
          fNum(t('t_1='), [z.t1, 1], { cands: [[ti - z.i * z.d, 'u1-steps', 'From ' + t('t_1') + ' to ' + t('t_{' + z.i + '}') + ' is ' + t(z.i - 1) + ' steps.']] }),
          fT(t('t_n='), function (n) { return z.t1 + (n - 1) * z.d; }, aTex(z.t1, z.d), { cands: aCands(z.t1, z.d) }), fNum(t('t_{' + z.k + '}='), [tk, 1], { cands: [[at(z.t1, z.d, z.k + 1), 'u1-n-not-n-1', t('t_{' + z.k + '}=t_1+' + (z.k - 1) + 'd') + '.']] })],
        t('d=' + z.d + ',\\ t_1=' + z.t1 + ',\\ t_n=' + aTex(z.t1, z.d) + ',\\ t_{' + z.k + '}=' + tk), t((z.j - z.i) + 'd=' + tj + '-' + (ti < 0 ? '(' + ti + ')' : ti) + '=' + (tj - ti) + '\\ \\Rightarrow\\ d=' + z.d) + '. ' + t('t_1=' + ti + '-' + (z.i - 1) + '(' + z.d + ')=' + z.t1) + '.<br>' + t('t_n=' + z.t1 + '+(n-1)(' + z.d + ')=' + aTex(z.t1, z.d)) + '. ' + t('t_{' + z.k + '}=' + tk),
        ['From ' + t('t_{' + z.i + '}') + ' to ' + t('t_{' + z.j + '}') + ' is ' + t(z.j - z.i) + ' steps of ' + t('d') + '.'], 'd, t₁, tₙ from two terms');
    } }] },
    { num: '17', shared: function (r) { return pickWhere(function () { return { P: r.pick([2000, 2500, 3000, 4000, 5000, 6000]), i: r.pick([2.5, 3, 3.5, 4, 4.5, 2.75]), T: r.pick([1.5, 1.6, 1.4, 1.75]) }; }, function (z) {
        var I = z.P * z.i / 100; z.I = I; z.target = z.P * z.T; var n = Math.floor((z.target - z.P) / I) + 1; z.n = n; return Number.isInteger(I * 100) && !(z.P === 4000 && z.i === 3.25) && n <= 40 && Math.abs(z.P + I * n - z.target) > 0.01 && Math.abs((z.target - z.P) / I - Math.round((z.target - z.P) / I)) > 1e-9; }); },
      stem: function (z) { return t('\\$' + F(z.P)) + ' is invested at ' + t(nT(z.i) + '\\%') + ' per year simple interest (the interest each year is ' + t(nT(z.i) + '\\%') + ' of ' + t('\\$' + F(z.P)) + ').'; }, parts: [
        { id: '17a', level: 'BEG', outcome: 'RF9', make: function (r, z) {
          var V = [1, 2, 3].map(function (n) { return cl(z.P + n * z.I); });
          return fieldsP('Write the value of the investment at the end of years 1, 2 and 3.', V.map(function (v, i) { return fNum('year ' + (i + 1) + ':', qn(v), { before: '$', cands: [[cl(z.P * Math.pow(1 + z.i / 100, i + 1)), 'u1-interest', 'Simple interest is the same ' + t(money(z.I)) + ' every year (it doesn’t compound).']], name: 'year ' + (i + 1) }); }),
            t(V.map(money).join(',\\ ')), 'Interest is ' + t(nT(z.i / 100) + '(' + F(z.P) + ')=' + money(z.I)) + ' each year: ' + t(V.map(money).join(',\\ ')) + '.', ['Add the same interest each year.'], 'simple interest values');
        } },
        { id: '17b', level: 'PRG', outcome: 'RF9', make: function (r, z) {
          var f = function (n) { return z.P + z.I * n; };
          return { prompt: 'Write a general term for the value at the end of year ' + t('n') + '.', input: { type: 'math', keys: 'expo', vars: ['n'], before: 'tₙ =' }, check: L.cT(f, { cands: [[function (n) { return z.P + z.I * (n - 1); }, 'u1-time0', 'Check ' + t('n=1') + ': the value at the end of year 1 is ' + t(money(z.P + z.I)) + '.'], [function (n) { return z.P * Math.pow(1 + z.i / 100, n); }, 'u1-arith-geo', 'Simple interest grows by a fixed amount: arithmetic, not geometric.']] }),
            key: nT(z.I) + 'n+' + z.P, answer: t('t_n=' + F(z.P) + '+' + nT(z.I) + 'n'), solution: t('t_1=' + nT(z.P + z.I) + ',\\ d=' + nT(z.I)) + ': ' + t('t_n=' + nT(z.P + z.I) + '+(n-1)(' + nT(z.I) + ')=' + F(z.P) + '+' + nT(z.I) + 'n'), hints: ['Arithmetic: ' + t('t_1') + ' is the value at the end of year 1, and ' + t('d') + ' is the yearly interest.'], text: 'general term, simple interest', good: [nT(z.P + z.I) + '+(n-1)(' + nT(z.I) + ')'] };
        } },
        { id: '17c', level: 'ADV', outcome: 'RF9', make: function (r, z) {
          return exactP('At the end of which year is the value first more than ' + t(money(z.target)) + '?', [z.n, 1], { before: 'year', cands: [[z.n - 1, 'u1-count', 'At the end of year ' + t(z.n - 1) + ' the value is ' + t(money(z.P + z.I * (z.n - 1))) + ' — not more than ' + t(money(z.target)) + ' yet.'], [z.n + 1, 'u1-count', 'Check year ' + t(z.n) + ': ' + t(money(z.P + z.I * z.n)) + '.']] },
            t(F(z.P) + '+' + nT(z.I) + 'n>' + nT(z.target) + '\\ \\Rightarrow\\ n>' + nT(K.roundTo((z.target - z.P) / z.I, 2))) + '. The end of year ' + t(z.n) + ' (' + t(money(z.P + z.I * z.n)) + ').', ['Solve ' + t('t_n>' + nT(z.target)) + '; round up to the next whole year.'], 'year the value passes a target');
        } }] },
    { num: '18', parts: [
      { id: '18a', level: 'EMG', outcome: 'RF9', make: function (r) {
        var z = pickWhere(function () { return { t1: r.int(5, 20), d: r.int(2, 9), n: r.int(25, 50) }; }, function (z) { return !(z.t1 === 12 && z.d === 5 && z.n === 40) && !(z.t1 === 24 && z.d === 3 && z.n === 20); });
        var S = as(z.t1, z.d, z.n);
        return exactP('Determine the sum of the first ' + t(z.n) + ' terms of ' + t(z.t1 + '+' + (z.t1 + z.d) + '+' + (z.t1 + 2 * z.d) + '+\\cdots'), [S, 1], { cands: [[as(z.t1, z.d, z.n - 1), 'u1-count', 'That is ' + t(z.n - 1) + ' terms.'], [at(z.t1, z.d, z.n), 'u1-gave-sn', 'That is ' + t('t_{' + z.n + '}') + '. The question asks for the sum.'], [cl(z.n / 2 * (2 * z.t1 + z.n * z.d)), 'u1-n-not-n-1', t('S_n=\\dfrac{n}{2}\\left[2t_1+(n-1)d\\right]') + ' — use ' + t('n-1') + '.']] },
          t('S_{' + z.n + '}=\\dfrac{' + z.n + '}{2}\\left[2(' + z.t1 + ')+' + (z.n - 1) + '(' + z.d + ')\\right]=' + (z.n / 2) + '(' + (2 * z.t1 + (z.n - 1) * z.d) + ')=' + F(S)), HA, 'arithmetic sum');
      } },
      { id: '18b', level: 'ADV', outcome: 'RF9', make: function (r) {
        var z = pickWhere(function () { return { k: r.pick([3, 6, 7, 8, 9, 11, 12, 13]), A: r.pick([50, 100, 150, 200]), B: r.pick([400, 500, 600, 800]) }; }, function (z) { return !(z.k === 7 && z.A === 100 && z.B === 500) && z.A % z.k !== 0 && z.B % z.k !== 0; });
        var f = Math.ceil(z.A / z.k) * z.k, l = Math.floor(z.B / z.k) * z.k, n = (l - f) / z.k + 1, S = n * (f + l) / 2;
        return exactP('Determine the sum of all the multiples of ' + t(z.k) + ' between ' + t(z.A) + ' and ' + t(z.B) + '.', [S, 1], { cands: [[(n - 1) * (f + l) / 2, 'u1-count', 'Count the terms: ' + t('n=\\dfrac{' + l + '-' + f + '}{' + z.k + '}+1=' + n) + '.'], [n * (f - z.k + l) / 2 + 0, 'u1-mult-ends', 'The first multiple of ' + t(z.k) + ' after ' + t(z.A) + ' is ' + t(f) + '.'], [(n + 1) * (f + l + z.k) / 2, 'u1-mult-ends', 'The last multiple of ' + t(z.k) + ' below ' + t(z.B) + ' is ' + t(l) + '.']] },
          t(f + '+' + (f + z.k) + '+\\cdots+' + l) + ': ' + t('n=\\dfrac{' + l + '-' + f + '}{' + z.k + '}+1=' + n) + '.<br>' + t('S_{' + n + '}=\\dfrac{' + n + '}{2}(' + f + '+' + l + ')=' + F(S)), ['Find the first and last multiples in the range, then the number of terms.'], 'sum of multiples');
      } }] },
    { num: '19', parts: [{ id: '19', level: 'ADV', outcome: 'RF9', make: function (r) {
      var z = pickWhere(function () { return { t1: r.int(2, 9), d: r.pick([2, 2, 4, 1]), n: r.int(10, 25) }; }, function (z) { return !(z.t1 === 4 && z.d === 2 && z.n === 17) && !(z.t1 === 3 && z.d === 2 && z.n === 15); });
      var S = as(z.t1, z.d, z.n), b = 2 * z.t1 - z.d; // n(dn + b)/2 = S  ->  d n^2 + b n - 2S = 0
      var other = -(b / z.d) - z.n;
      return exactP('How many terms of the arithmetic series ' + t(z.t1 + '+' + (z.t1 + z.d) + '+' + (z.t1 + 2 * z.d) + '+\\cdots') + ' must be added to get a sum of ' + t(F(S)) + '?', [z.n, 1], { after: 'terms', cands: [[other, 'u1-quad-root', t('n') + ' is a number of terms, so it can’t be negative: keep the positive root.']] },
        t('\\dfrac{n}{2}\\left[2(' + z.t1 + ')+(n-1)(' + z.d + ')\\right]=' + F(S)) + '<br>' + t((z.d === 1 ? '' : z.d) + 'n^{2}' + (b === 0 ? '' : (b > 0 ? '+' : '') + b + 'n') + '-' + (2 * S) + '=0') + '. Factor (or use a table): ' + t('n=' + z.n) + (Number.isInteger(other) ? ' or ' + t('n=' + other) + ' (rejected)' : '') + '.', ['Substitute into ' + t('S_n=\\dfrac{n}{2}\\left[2t_1+(n-1)d\\right]') + ' to get a quadratic in ' + t('n') + '.', 'A calculator table of ' + t('S_n') + ' works too.'], 'number of terms of an arithmetic series');
    } }] },
    { num: '20', parts: [{ id: '20', level: 'MAS', outcome: 'RF10', make: function (r) {
      var z = pickWhere(function () { return { a: r.int(1, 6), r: r.int(2, 4) }; }, function (z) { return !(z.a === 2 && z.r === 3) && z.a * Math.pow(z.r, 4) < 2000; });
      var B = z.a * Math.pow(z.r, 4), P = [1, 2, 3].map(function (i) { return z.a * Math.pow(z.r, i); }), N = [1, 2, 3].map(function (i) { return z.a * Math.pow(-z.r, i); });
      var check = function (resp) {
        resp = resp || []; var a = resp.slice(0, 3), b = resp.slice(3, 6);
        var rd = function (arr) { return arr.map(function (s) { var p = HW.parse.number(L.strip(s)); return p.ok ? p.value : null; }); };
        var x = rd(a), y = rd(b); if (x.concat(y).some(function (v) { return v == null; })) return form('empty', 'Fill in all six boxes with numbers (two sets of three means).');
        var eqA = function (u, v) { return u.every(function (q, i) { return Math.abs(q - v[i]) < 1e-9; }); };
        if ((eqA(x, P) && eqA(y, N)) || (eqA(x, N) && eqA(y, P))) return ok();
        if ((eqA(x, P) || eqA(x, N)) && (eqA(y, P) || eqA(y, N))) return form('same', 'Both rows hold the same set — the second set uses the other sign of ' + t('r') + '.');
        if (eqA(x, P) || eqA(x, N) || eqA(y, P) || eqA(y, N)) return wrong('u1-one-sign', 'One set is right. ' + t('r^{4}=' + Math.pow(z.r, 4)) + ' has two real solutions, ' + t('r=\\pm' + z.r) + ': find the means for the other one too.');
        var lin = [1, 2, 3].map(function (i) { return z.a + i * (B - z.a) / 4; }); if (eqA(x, lin) || eqA(y, lin)) return wrong('u1-arith-geo', 'Those are arithmetic means. Geometric means multiply by the same ratio ' + t('r') + ' each step.');
        return wrong('u1-gm', '4 steps from ' + t(z.a) + ' to ' + t(F(B)) + ': ' + t(z.a + 'r^{4}=' + F(B)) + '.');
      };
      var fl = [0, 1, 2].map(function (i) { return { label: i === 0 ? t('r>0:') : '', name: 'mean ' + (i + 1) + ' (r > 0)' }; }).concat([0, 1, 2].map(function (i) { return { label: i === 0 ? t('r<0:') : '', name: 'mean ' + (i + 1) + ' (r < 0)' }; }));
      return fieldsP('Insert three geometric means between ' + t(z.a) + ' and ' + t(F(B)) + '. Give both possible answers.', fl.map(function (f, i) { return { label: f.label, name: f.name, key: String(i < 3 ? P[i] : N[i - 3]) }; }),
        t('r=' + z.r + ':\\ ' + P.map(F).join(',\\ ') + ';\\quad r=-' + z.r + ':\\ ' + N.map(F).join(',\\ ')), '4 steps: ' + t(z.a + 'r^{4}=' + F(B) + '\\ \\Rightarrow\\ r^{4}=' + Math.pow(z.r, 4) + '\\ \\Rightarrow\\ r=\\pm' + z.r) + '.<br>' + t('r=' + z.r + ':\\ ' + P.map(F).join(',\\ ')) + '. ' + t('r=-' + z.r + ':\\ ' + N.map(F).join(',\\ ')) + '.',
        ['Three means make 4 steps: ' + t('t_5=t_1r^{4}') + '.', 'An even power: ' + t('r') + ' can be positive or negative.'], 'three geometric means (both)', { check: check, bad: [P.map(String).concat(P.map(String)), P.map(String).concat(['1', '2', '3'])], good: [N.map(String).concat(P.map(String))] });
    } }] },
    { num: '21', shared: function (r) { return pickWhere(function () { return { N0: r.pick([100, 200, 250, 300, 500, 800]), h: r.int(2, 5), m: r.int(4, 9), M: r.pick([100000, 500000, 1000000, 2000000]) }; }, function (z) {
        var k = 0; while (z.N0 * Math.pow(2, k) <= z.M) k++; z.k = k; return !(z.N0 === 500 && z.h === 3) && z.N0 * Math.pow(2, k - 1) !== z.M && k > z.m; }); },
      stem: function (z) { return 'A culture starts with ' + t(z.N0) + ' bacteria, and the number doubles every ' + t(z.h) + ' hours.'; }, parts: [
        { id: '21a', level: 'PRG', outcome: 'RF10', make: function (r, z) {
          var T = z.m * z.h, N = z.N0 * Math.pow(2, z.m);
          return exactP('How many bacteria are there after ' + t(T) + ' hours?', [N, 1], { cands: [[z.N0 * Math.pow(2, T), 'u1-hours', 'The number doubles every ' + t(z.h) + ' hours, not every hour: ' + t(T) + ' hours is ' + t(z.m) + ' doublings.'], [z.N0 * Math.pow(2, z.m - 1), 'u1-time0', t(z.N0) + ' is the number at time 0, so after ' + t(z.m) + ' doublings it is ' + t(z.N0 + '(2)^{' + z.m + '}') + '.'], [z.N0 * 2 * z.m, 'u1-linear', 'Doubling is multiplying by 2 each time (geometric).']] },
            t(T) + ' hours is ' + t(z.m) + ' doublings: ' + t(z.N0 + '(2)^{' + z.m + '}=' + F(N)) + ' bacteria.', ['How many doublings happen in ' + t(T) + ' hours?'], 'bacteria after T hours');
        } },
        { id: '21b', level: 'ADV', outcome: 'RF10', make: function (r, z) {
          return exactP('After how many hours does the number first pass ' + t(F(z.M)) + '?', [z.k * z.h, 1], { after: 'hours', cands: [[z.k, 'u1-hours', 'That is the number of doublings. Each doubling takes ' + t(z.h) + ' hours.'], [(z.k - 1) * z.h, 'u1-count', 'After ' + t(z.k - 1) + ' doublings there are ' + t(F(z.N0 * Math.pow(2, z.k - 1))) + ' — not past ' + t(F(z.M)) + ' yet.']] },
            t(z.N0 + '(2)^{k}>' + F(z.M) + '\\ \\Rightarrow\\ 2^{k}>' + nT(K.roundTo(z.M / z.N0, 2))) + '. Table: ' + t('2^{' + (z.k - 1) + '}=' + F(Math.pow(2, z.k - 1)) + ',\\ 2^{' + z.k + '}=' + F(Math.pow(2, z.k))) + '.<br>' + t(z.k) + ' doublings: after ' + t(z.k * z.h) + ' hours.', ['Find the number of doublings with a table, then convert to hours.'], 'hours to pass a number');
        } }] },
    { num: '22', shared: function (r) { return pickWhere(function () { return { P: r.pick([1500, 2000, 2500, 3000, 5000, 1200]), i: r.pick([3.5, 4, 4.5, 5, 5.5, 6]), k: r.int(8, 15) }; }, function (z) { return !(z.P === 2500 && z.i === 4.5); }); },
      stem: function (z) { return t('\\$' + F(z.P)) + ' is invested at ' + t(nT(z.i) + '\\%') + ' per year, compounded annually.'; }, parts: [
        { id: '22a', level: 'EMG', outcome: 'RF10', make: function (r, z) {
          var g = 1 + z.i / 100, V = [1, 2, 3].map(function (n) { return z.P * Math.pow(g, n); });
          return fieldsP('Write the value at the end of years 1, 2 and 3, to the nearest cent.', V.map(function (v, i) { return fRnd('year ' + (i + 1) + ':', v, 2, { before: '$', cands: [[z.P + (i + 1) * z.P * z.i / 100, 'u1-linear', 'Compound interest earns interest on the interest: multiply by ' + t(nT(g)) + ' each year.']], name: 'year ' + (i + 1) }); }),
            t(V.map(money).join(',\\ ')), 'Multiply by ' + t(nT(g)) + ' each year: ' + t(V.map(money).join(',\\ ')) + '.', ['Each year the value is multiplied by ' + t('1+' + nT(z.i / 100)) + '.'], 'compound interest values');
        } },
        { id: '22b', level: 'PRG', outcome: 'RF10', make: function (r, z) {
          var g = 1 + z.i / 100, x = z.P * Math.pow(g, z.k);
          return fieldsP('Write a general term for the value at the end of year ' + t('n') + ', and determine the value at the end of year ' + t(z.k) + '.',
            [fT(t('t_n='), function (n) { return z.P * Math.pow(g, n); }, F(z.P).replace(/\\,/g, '') + '(' + nT(g) + ')^{n}', { cands: [[function (n) { return z.P * Math.pow(g, n - 1); }, 'u1-r-time0', 'Check ' + t('n=1') + ': the value at the end of year 1 is ' + t(money(z.P * g)) + '. Either write ' + t(F(z.P) + '(' + nT(g) + ')^{n}') + ' or start from ' + t('t_1=' + nT(K.roundTo(z.P * g, 2))) + '.'], [function (n) { return z.P + n * z.P * z.i / 100; }, 'u1-arith-geo', 'That is simple interest. Compound interest is geometric.']] }), fRnd(t('t_{' + z.k + '}\\approx'), x, 2, { before: '$', cands: [[z.P * Math.pow(g, z.k - 1), 'u1-r-time0', 'That is the end of year ' + t(z.k - 1) + '.'], [z.P * Math.pow(g, z.k + 1), 'u1-r-time0', 'That is the end of year ' + t(z.k + 1) + '.']] })],
            t('t_n=' + F(z.P) + '(' + nT(g) + ')^{n};\\ t_{' + z.k + '}\\approx ' + money(x)), t('t_n=' + nT(K.roundTo(z.P * g, 4)) + '(' + nT(g) + ')^{n-1}=' + F(z.P) + '(' + nT(g) + ')^{n}') + '<br>' + t('t_{' + z.k + '}=' + F(z.P) + '(' + nT(g) + ')^{' + z.k + '}\\approx ' + money(x)), HG, 'general term, compound interest');
        } }] },
    { num: '23', parts: [
      { id: '23a', level: 'EMG', outcome: 'RF10', make: function (r) {
        var z = pickWhere(function () { return { t1: r.int(2, 12), r: r.pick([1.5, 1.2, 2.5, 1.25, 0.5, 0.8]), n: r.int(6, 10) }; }, function (z) { return !(z.t1 === 6 && z.r === 1.5 && z.n === 8); });
        var x = z.t1 * (Math.pow(z.r, z.n) - 1) / (z.r - 1);
        return roundP('A geometric series has ' + t('t_1=' + z.t1) + ' and ' + t('r=' + nT(z.r)) + '. Determine ' + t('S_{' + z.n + '}') + ' to the nearest hundredth.', x, 2, { cands: [[z.t1 * Math.pow(z.r, z.n - 1), 'u1l7-gave-term', 'That is ' + t('t_{' + z.n + '}') + '.'], [z.t1 * (Math.pow(z.r, z.n - 1) - 1) / (z.r - 1), 'u1l7-exp-n-1', 'The exponent in the sum formula is ' + t('n') + '.'], [z.t1 * (Math.pow(z.r, z.n) - 1) / z.r, 'u1l7-div-r', 'Divide by ' + t('r-1') + '.']] },
          t('S_{' + z.n + '}=\\dfrac{' + z.t1 + '(' + nT(z.r) + '^{' + z.n + '}-1)}{' + nT(z.r) + '-1}\\approx ' + fxT(x, 2)), HG, 'geometric sum, decimal r');
      } },
      { id: '23b', level: 'ADV', outcome: 'RF10', make: function (r) {
        var z = pickWhere(function () { return { q: r.pick([5, 4, 2, 10]), n: r.int(5, 8), c: r.int(1, 9) }; }, function (z) { return !(z.q === 5 && z.n === 7 && z.c === 2) && z.c * Math.pow(z.q, z.n - 3) <= 200000; });
        /* decreasing: t1 = c·q^(n−3), r = 1/q, so the last term c/q² is a decimal */
        var m = 2, R = Q(1, z.q), t1 = qm(z.c, qp(z.q, z.n - 1 - m)), last = term(t1, R, z.n), S = gsum(t1, R, z.n);
        return fieldsP('Determine the number of terms and the sum of ' + t(seriesTex(first(t1, R, 3), { last: last, dec: true })) + '.', [fNum(t('n='), [z.n, 1], { cands: [[z.n - 1, 'u1-count', t('r^{n-1}=' + nT(qv(qd(last, t1)))) + ' gives ' + t('n-1=' + (z.n - 1)) + ', so ' + t('n=' + z.n) + '.']] }), fNum(t('S_n='), S, { name: 'sum', cands: L.lastCands(t1, R, last) })],
          t('n=' + z.n + ',\\ S_n=' + qtex(S, { dec: true })), t('r=' + qtex(R, { dec: true })) + ': ' + t(qtex(t1, { dec: true }) + '(' + qtex(R, { dec: true }) + ')^{n-1}=' + qtex(last, { dec: true }) + '\\ \\Rightarrow\\ ' + qtex(R, { dec: true }) + '^{n-1}=' + qtex(qd(last, t1), { dec: true })) + '. Table: ' + t('n-1=' + (z.n - 1)) + ', so ' + t('n=' + z.n) + '.<br>' + t(L.lastLine(t1, R, last, S, { dec: true })),
          ['Find ' + t('r') + ', then solve ' + t('t_1r^{n-1}=t_n') + ' with a table.', 'Then use ' + t('S_n=\\dfrac{rt_n-t_1}{r-1}') + '.'], 'number of terms and sum, decimal last term');
      } }] },
    { num: '24', shared: function (r) { return pickWhere(function () { return { k: r.int(3, 5), R: r.int(5, 8), M: r.pick([100000, 1000000, 500000, 250000]) }; }, function (z) {
        var n = 1; while (qv(gsum(z.k, z.k, n)) <= z.M) n++; z.n = n; return !(z.k === 4 && z.R === 7) && !(z.k === 3 && z.R === 8) && n > z.R && n <= 20; }); },
      stem: function (z) { return 'A post is shared with ' + t(z.k) + ' people in round 1. In each round after that, each person who just received it shares it with ' + t(z.k) + ' new people.'; }, parts: [
        { id: '24a', level: 'PRG', outcome: 'RF10', make: function (r, z) {
          var S = gsum(z.k, z.k, z.R);
          return exactP('How many people in total have received the post after ' + t(z.R) + ' rounds?', S, { cands: L.sumCands(z.k, z.k, z.R) }, t(L.sumLine(z.k, z.k, z.R)) + ' people', ['Round 1 has ' + t(z.k) + ' people; each round is ' + t(z.k) + ' times the one before.'], 'total after R rounds');
        } },
        { id: '24b', level: 'ADV', outcome: 'RF10', make: function (r, z) {
          return exactP('In which round does the total number of people first pass ' + t(F(z.M)) + '?', [z.n, 1], { before: 'round', cands: [[z.n - 1, 'u1-count', 'After round ' + t(z.n - 1) + ' the total is ' + t(F(qv(gsum(z.k, z.k, z.n - 1)))) + '.'], [z.n + 1, 'u1-count', 'Check round ' + t(z.n) + ': ' + t(F(qv(gsum(z.k, z.k, z.n)))) + '.']] },
            'Table of ' + t('S_n=\\dfrac{' + z.k + '(' + z.k + '^{n}-1)}{' + (z.k - 1) + '}') + ': ' + t('S_{' + (z.n - 1) + '}=' + F(qv(gsum(z.k, z.k, z.n - 1))) + ',\\ S_{' + z.n + '}=' + F(qv(gsum(z.k, z.k, z.n)))) + '. Round ' + t(z.n) + '.', ['Make a table of the totals ' + t('S_n') + '.'], 'round the total passes a number');
        } }] },
    { num: '25', parts: [
      { id: '25a', level: 'PRG', outcome: 'RF10', make: function (r) {
        var z = pickWhere(function () { return { t1: r.pick([64, 48, 80, 32, 100, 125]), r: r.pick([-0.75, -0.5, -0.25, -0.6, -0.8]) }; }, function (z) { return !(z.t1 === 64 && z.r === -0.75) && Math.abs(z.t1 * z.r * z.r * 100 - Math.round(z.t1 * z.r * z.r * 100)) < 1e-6; });
        var R = qn(z.r), S = qd(z.t1, qs(1, R));
        return exactP('Determine the sum to infinity of ' + t(seriesTex(first(z.t1, R, 3), { dec: true })), S, { dp: 2, cands: [[qd(z.t1, qa(1, R)), 'u1l8-one-plus-r', 'The denominator is ' + t('1-r=1-(' + nT(z.r) + ')=' + nT(1 - z.r)) + '.']] },
          t('r=' + nT(z.r) + ':\\ S_\\infty=\\dfrac{' + z.t1 + '}{' + nT(1 - z.r) + '}=' + qtex(S) + (terminates(S) ? '' : '\\approx ' + fxT(qv(S), 2))), HG, 'S∞, alternating');
      } },
      { id: '25b', level: 'ADV', outcome: 'RF10', make: function (r) {
        var k = r.pick([2, 3, 4, 5]), c = r.pick([1, 1, 2, 3]);
        return G.ineqP('For what values of ' + t('x') + ' does ' + t(c + '+' + c * k + 'x+' + c * k * k + 'x^{2}+\\cdots') + ' converge?', Q(-1, k), Q(1, k), 'x',
          t('r=' + k + 'x') + ': ' + t('-1<' + k + 'x<1\\ \\Rightarrow\\ -\\frac{1}{' + k + '}<x<\\frac{1}{' + k + '}'), ['Find ' + t('r') + ' (divide the second term by the first), then solve ' + t('-1<r<1') + '.'], 'interval of convergence (review)', { cands: [[-k, k, 'u1l8-ineq', 'Divide all three parts by ' + t(k) + ', don’t multiply.']] });
      } },
      { id: '25c', level: 'ADV', outcome: 'RF10', make: function (r) {
        var z = pickWhere(function () { return { k: r.pick([2, 3, 4]), S: r.pick([2, 4, 5, 10, 1.25, 2.5]) }; }, function (z) { return !(z.k === 2 && z.S === 5); });
        var R = qs(1, qd(1, qn(z.S))), x = qd(R, z.k);
        return exactP('For the series ' + t('1+' + z.k + 'x+' + z.k * z.k + 'x^{2}+\\cdots') + ', determine ' + t('x') + ' if the sum to infinity is ' + t(nT(z.S)) + '.', x, { cands: [[R, 'u1l8-x-for-r', 'That is ' + t('r') + '. Now solve ' + t(z.k + 'x=' + qtex(R, { dec: true })) + '.'], [qd(qs(1, qn(z.S)), z.k), 'sign', 'Solve ' + t('\\dfrac{1}{1-' + z.k + 'x}=' + nT(z.S)) + ' carefully.']] },
          t('\\dfrac{1}{1-' + z.k + 'x}=' + nT(z.S) + '\\ \\Rightarrow\\ 1-' + z.k + 'x=' + qtex(qd(1, qn(z.S)), { dec: true }) + '\\ \\Rightarrow\\ x=' + qtex(x, { dec: true })) + ' (it is between ' + t('-\\frac{1}{' + z.k + '}') + ' and ' + t('\\frac{1}{' + z.k + '}') + ').', [t('t_1=1') + ' and ' + t('r=' + z.k + 'x') + '.'], 'x from S∞ (review)');
      } }] },
    { num: '26', shared: function (r) { return pickWhere(function () { return { h: r.pick([200, 250, 300, 400, 150]), p: r.pick([0.85, 0.8, 0.9, 0.75, 0.7]), k: r.int(3, 6), n: r.int(8, 12), f: r.pick([0.1, 0.2, 0.25]) }; }, function (z) {
        var lim = z.h * z.f, m = 1; while (z.h * Math.pow(z.p, m - 1) >= lim) m++; z.m = m; z.lim = lim; return !(z.h === 300 && z.p === 0.85) && Math.abs(z.h * Math.pow(z.p, m - 2) - lim) > 0.5 && Math.abs(z.h * Math.pow(z.p, m - 1) - lim) > 0.5; }); },
      stem: function (z) { return 'A hot-air balloon lifts off from the ground. It rises ' + t(z.h) + ' m in the first minute, and in each minute after that it rises ' + t(Math.round(z.p * 100) + '\\%') + ' as far as it rose in the minute before.'; }, parts: [
        { id: '26a', level: 'EMG', outcome: 'RF10', make: function (r, z) { var x = z.h * Math.pow(z.p, z.k - 1); return roundP('How far, to the nearest hundredth of a metre, does it rise during minute ' + t(z.k) + '?', x, 2, { after: 'm', cands: [[z.h * Math.pow(z.p, z.k), 'u1l7-day-off', 'Minute ' + t(z.k) + ' is ' + t('t_{' + z.k + '}=' + z.h + '(' + nT(z.p) + ')^{' + (z.k - 1) + '}') + '.'], [z.h * (1 - Math.pow(z.p, z.k)) / (1 - z.p), 'u1-gave-sn', 'That is the height after ' + t(z.k) + ' minutes. The question asks for the rise <b>during</b> minute ' + t(z.k) + '.']] }, t('t_{' + z.k + '}=' + z.h + '(' + nT(z.p) + ')^{' + (z.k - 1) + '}\\approx ' + fxT(x, 2)) + ' m', HG, 'rise in minute k'); } },
        { id: '26b', level: 'PRG', outcome: 'RF10', make: function (r, z) { var x = z.h * (1 - Math.pow(z.p, z.n)) / (1 - z.p); return roundP('What is its height, to the nearest hundredth of a metre, after ' + t(z.n) + ' minutes?', x, 2, { after: 'm', cands: [[z.h * Math.pow(z.p, z.n - 1), 'u1l8-term-not-sum', 'That is the rise in minute ' + t(z.n) + ' only. The height is the total.'], [z.h / (1 - z.p), 'u1l8-term-not-sum', 'That is the height it approaches (forever).']] }, t('S_{' + z.n + '}=\\dfrac{' + z.h + '(1-' + nT(z.p) + '^{' + z.n + '})}{' + nT(1 - z.p) + '}\\approx ' + fxT(x, 2)) + ' m', HG, 'height after n minutes'); } },
        { id: '26c', level: 'MAS', outcome: 'RF10', make: function (r, z) {
          return exactP('During which minute does it first rise less than ' + t(nT(z.lim)) + ' m?', [z.m, 1], { before: 'minute', cands: [[z.m - 1, 'u1-count', 'Minute ' + t(z.m) + ' is ' + t('t_{' + z.m + '}') + ', with exponent ' + t(z.m - 1) + ': solve ' + t(nT(z.p) + '^{n-1}<' + nT(z.f)) + ' and add 1 to the exponent.'], [z.m + 1, 'u1-count', 'Check minute ' + t(z.m) + ': ' + t('\\approx ' + fxT(z.h * Math.pow(z.p, z.m - 1), 2)) + ' m.']] },
            t(z.h + '(' + nT(z.p) + ')^{n-1}<' + nT(z.lim) + '\\ \\Rightarrow\\ ' + nT(z.p) + '^{n-1}<' + nT(z.f)) + '. Table: ' + t(nT(z.p) + '^{' + (z.m - 2) + '}\\approx ' + nT(K.roundTo(Math.pow(z.p, z.m - 2), 3)) + ',\\ ' + nT(z.p) + '^{' + (z.m - 1) + '}\\approx ' + nT(K.roundTo(Math.pow(z.p, z.m - 1), 3))) + '.<br>' + t('n-1=' + (z.m - 1)) + ': minute ' + t(z.m) + '.', ['The rise in minute ' + t('n') + ' is ' + t(z.h + '(' + nT(z.p) + ')^{n-1}') + '.'], 'minute the rise drops below a value');
        } },
        { id: '26d', level: 'PRG', outcome: 'RF10', make: function (r, z) { var S = qd(z.h, qs(1, qn(z.p))); return exactP('What height does the balloon approach?', S, { after: 'm', dp: 2, cands: [[qd(z.h, qn(z.p)), 'u1l8-div-r', t('S_\\infty=\\dfrac{t_1}{1-r}') + '.']] }, t('S_\\infty=\\dfrac{' + z.h + '}{1-' + nT(z.p) + '}=' + qtex(S, { dec: true }) + (terminates(S) ? '' : '\\approx ' + fxT(qv(S), 2))) + ' m. This assumes the ' + Math.round(z.p * 100) + '% pattern continues forever (the pilot does not add heat or let air out).', ['The height approaches ' + t('S_\\infty') + '.'], 'height approached'); } }] }
  ];

  /* =========================== Extra practice 9 (Practice Test 2) =========================== */
  var EXTRA = [
    { num: '1', section: 'A. Multiple Choice', parts: [{ id: 'e1', level: 'BEG', outcome: 'RF9', make: function (r) {
      var a = r.int(1, 9), d = r.int(2, 6), n = r.int(10, 25), L2 = a + (n - 1) * d;
      return mcP(r, 'Which of the following is a finite arithmetic series?', t(a + '+' + (a + d) + '+' + (a + 2 * d) + '+\\cdots+' + L2),
        [{ html: t(a + ',\\ ' + (a + d) + ',\\ ' + (a + 2 * d) + ',\\ \\ldots,\\ ' + L2), why: 'That is a sequence (a list), not a series (a sum).' }, { html: t(a + '+' + (a + d) + '+' + (a + 2 * d) + '+' + (a + 3 * d) + '+\\cdots'), why: 'That has no last term, so it is infinite.' }, { html: t(a + '+' + a * 3 + '+' + a * 9 + '+' + a * 27), why: 'That is geometric (' + t('r=3') + ').' }],
        'It is a sum (a series), it has a last term (finite), and the common difference is ' + t(d) + ' (arithmetic).', ['Series = sum. Finite = has a last term.'], 'MC: finite arithmetic series');
    } }] },
    { num: '2', parts: [{ id: 'e2', level: 'EMG', outcome: 'RF10', make: function (r) {
      var a = r.pick([3, 4, 5, 6, 7, 8, 9]);
      return mcP(r, 'Which statement about the sequence ' + t(a + ',\\ ' + a + ',\\ ' + a + ',\\ ' + a + ',\\ \\ldots') + ' is true?', 'It is both arithmetic and geometric.',
        [{ html: 'It is arithmetic only.', why: 'It also has a common ratio: ' + t('r=1') + '.' }, { html: 'It is geometric only.', why: 'It also has a common difference: ' + t('d=0') + '.' }, { html: 'It is neither arithmetic nor geometric.', why: 'Check: ' + t('d=0') + ' and ' + t('r=1') + '.' }],
        t('d=0') + ' and ' + t('r=1') + ', so it is both.', ['Find the difference and the ratio.'], 'MC: a constant sequence', true);
    } }] },
    { num: '3', parts: [{ id: 'e3', level: 'EMG', outcome: 'RF9', make: function (r) {
      var z = pickWhere(function () { return { x1: r.int(1, 4), s: r.int(3, 7), d: r.pick([-3, -2, -4, 2, 3, 5]), y1: r.int(-5, 15) }; }, function (z) { return !(z.x1 === 2 && z.s === 5 && z.d === -3); });
      var x2 = z.x1 + z.s, y2 = z.y1 + z.s * z.d;
      return mcNum(r, 'The points ' + t('(' + z.x1 + ',\\ ' + z.y1 + ')') + ' and ' + t('(' + x2 + ',\\ ' + y2 + ')') + ' lie on the graph of an arithmetic sequence. The common difference is', z.d, [[y2 - z.y1, 'Divide by the ' + t(z.s) + ' steps between the terms.'], [-z.d, 'Check the sign: ' + t('\\dfrac{' + y2 + '-' + z.y1 + '}{' + x2 + '-' + z.x1 + '}') + '.'], [cl(z.s / (y2 - z.y1)), 'The slope is rise over run: ' + t('\\dfrac{\\Delta t_n}{\\Delta n}') + '.']],
        t('d') + ' is the slope: ' + t('\\dfrac{' + y2 + '-' + z.y1 + '}{' + x2 + '-' + z.x1 + '}=\\dfrac{' + (y2 - z.y1) + '}{' + z.s + '}=' + z.d) + '.', ['The common difference is the slope of the line.'], 'MC: d from two graph points', function (x) { return t(Math.abs(x - Math.round(x)) < 1e-9 ? String(Math.round(x)) : qtex(Q(Math.round(x * z.s * 1000), Math.round(z.s * 1000)))); });
    } }] },
    { num: '4', parts: [{ id: 'e4', level: 'PRG', outcome: 'RF9', make: function (r) {
      var z = pickWhere(function () { var i = r.int(2, 6); return { i: i, j: i + r.int(3, 7), t1: r.int(-15, 10), d: r.int(2, 6), k: r.int(15, 30) }; }, function (z) { return !(z.i === 4 && z.j === 9); });
      var ti = at(z.t1, z.d, z.i), tj = at(z.t1, z.d, z.j), tk = at(z.t1, z.d, z.k);
      return mcNum(r, 'In an arithmetic sequence, ' + t('t_{' + z.i + '}=' + ti) + ' and ' + t('t_{' + z.j + '}=' + tj) + '. The value of ' + t('t_{' + z.k + '}') + ' is', tk, [[tk - z.d, 'Check the number of steps from ' + t('t_1') + ': ' + t('t_{' + z.k + '}=t_1+' + (z.k - 1) + 'd') + '.'], [tk + z.d, t('t_{' + z.k + '}=t_1+' + (z.k - 1) + 'd') + ', not ' + t(z.k + 'd') + '.'], [tk + 5 * z.d, 'Find ' + t('d') + ' from ' + t('(' + (z.j - z.i) + ')d=' + (tj - ti)) + '.']],
        t((z.j - z.i) + 'd=' + (tj - ti) + '\\ \\Rightarrow\\ d=' + z.d) + '; ' + t('t_1=' + ti + '-' + (z.i - 1) + '(' + z.d + ')=' + z.t1) + '; ' + t('t_{' + z.k + '}=' + z.t1 + '+' + (z.k - 1) + '(' + z.d + ')=' + tk) + '.', HA, 'MC: a term from two terms');
    } }] },
    { num: '5', parts: [{ id: 'e5', level: 'PRG', outcome: 'RF10', make: function (r) {
      var q = r.int(2, 4), up = r.chance(0.5), a = r.int(1, 5), t1 = up ? a : a * Math.pow(q, 4), t5 = up ? a * Math.pow(q, 4) : a, R = up ? String(q) : '\\frac{1}{' + q + '}', iR = up ? '\\frac{1}{' + q + '}' : String(q);
      return mcP(r, 'In a geometric sequence, ' + t('t_1=' + F(t1)) + ' and ' + t('t_5=' + F(t5)) + '. The possible values of ' + t('r') + ' are', t('\\pm' + R),
        [{ html: t(R) + ' only', why: 'An even power hides the sign: ' + t('(-' + R + ')^{4}') + ' is positive too.' }, { html: t('-' + R) + ' only', why: t('r^{4}') + ' has a positive solution too.' }, { html: t('\\pm' + iR), why: 'Solve ' + t(F(t1) + 'r^{4}=' + F(t5)) + ': ' + t('r^{4}=' + qtex(Q(t5, t1))) + '.' }],
        t(F(t1) + 'r^{4}=' + F(t5) + '\\ \\Rightarrow\\ r^{4}=' + qtex(Q(t5, t1)) + '\\ \\Rightarrow\\ r=\\pm' + R) + ' (an even power hides the sign).', ['From ' + t('t_1') + ' to ' + t('t_5') + ' is 4 steps.'], 'MC: ± ratio');
    } }] },
    { num: '6', parts: [{ id: 'e6', level: 'ADV', outcome: 'RF10', make: function (r) {
      var z = pickWhere(function () { return { P: r.pick([1200, 1500, 1800, 2400, 900, 2000]), pc: r.pick([20, 25, 30, 35]), T: r.pick([200, 250, 300, 400]) }; }, function (z) {
        var g = 1 - z.pc / 100, n = 0; while (z.P * Math.pow(g, n) >= z.T) n++; z.n = n; var lin = Math.floor((z.P - z.T) / (z.P * z.pc / 100)) + 1; z.lin = lin; return !(z.P === 1800 && z.pc === 25 && z.T === 300) && n >= 3 && n <= 12 && lin !== n && lin > 0 && Math.abs(z.P * Math.pow(g, n - 1) - z.T) > 1; });
      var g = 1 - z.pc / 100;
      return mcNum(r, 'A laptop bought for ' + t('\\$' + F(z.P)) + ' loses ' + t(z.pc + '\\%') + ' of its value each year. After how many full years is it first worth less than ' + t('\\$' + z.T) + '?', z.n, [[z.lin, 'That treats the loss as a fixed ' + t(money(z.P * z.pc / 100)) + ' a year. A percent loss is geometric.'], [z.n - 1, 'After ' + t(z.n - 1) + ' years it is worth ' + t('\\approx ' + money(z.P * Math.pow(g, z.n - 1))) + '.'], [z.n + 1, 'Check ' + t(z.n) + ' years: ' + t('\\approx ' + money(z.P * Math.pow(g, z.n))) + '.']],
        'Table of ' + t(F(z.P) + '(' + nT(g) + ')^{n}') + ': ' + t('n=' + (z.n - 1)) + ' gives ' + t(money(z.P * Math.pow(g, z.n - 1))) + ', ' + t('n=' + z.n) + ' gives ' + t(money(z.P * Math.pow(g, z.n))) + '.', ['Make a table of the value after ' + t('n') + ' years.'], 'MC: years until worth less than');
    } }] },
    { num: '7', parts: [{ id: 'e7', level: 'EMG', outcome: 'RF10', make: function (r) {
      var P = r.pick([12000, 15000, 18000, 20000, 25000, 8000]), pc = r.pick([1.5, 2, 2.5, 3, 4]), g = nT(1 + pc / 100), Pt = F(P);
      return mcP(r, 'A town of ' + t(Pt) + ' people grows by ' + t(nT(pc) + '\\%') + ' per year. Its population ' + t('P') + ' after ' + t('n') + ' years can be modelled by', t('P=' + Pt + '(' + g + ')^{n}'),
        [{ html: t('P=' + Pt + '(' + nT(pc / 100) + ')^{n}'), why: 'Growing by ' + t(nT(pc) + '\\%') + ' means multiplying by ' + t('1+' + nT(pc / 100) + '=' + g) + '.' }, { html: t('P=' + Pt + '(' + g + ')^{n-1}'), why: t(Pt) + ' is the population at time 0, so after ' + t('n') + ' years it has been multiplied ' + t('n') + ' times.' }, { html: t('P=' + Pt + '(' + nT(1 + pc / 10) + ')^{n}'), why: t(nT(pc) + '\\%=' + nT(pc / 100)) + ', so ' + t('r=' + g) + '.' }],
        t('r=1+' + nT(pc / 100) + '=' + g) + ', and after ' + t('n') + ' years the ' + t(Pt) + ' has been multiplied by ' + t(g) + ' ' + t('n') + ' times.', ['What do you multiply by each year?'], 'MC: growth model');
    } }] },
    { num: '8', parts: [{ id: 'e8', level: 'PRG', outcome: 'RF10', make: function (r) {
      var z = pickWhere(function () { return { a: r.int(1, 5), r: -r.int(2, 4), n: r.int(5, 7) }; }, function (z) { return !(z.a === 2 && z.r === -3 && z.n === 6) && Math.abs(z.a * Math.pow(z.r, z.n)) < 1e5; });
      var S = qv(gsum(z.a, z.r, z.n));
      return mcNum(r, 'The sum of the first ' + t(z.n) + ' terms of ' + t(seriesTex(first(z.a, z.r, 3))) + ' is', S, [[z.a * Math.pow(z.r, z.n - 1), 'That is ' + t('t_{' + z.n + '}') + '.'], [-S, 'Check the sign: ' + t('(' + z.r + ')^{' + z.n + '}') + (z.n % 2 ? ' is negative.' : ' is positive.')], [qv(gsum(z.a, z.r, z.n + 1)), 'That is ' + t('S_{' + (z.n + 1) + '}') + '.']],
        t('r=' + z.r) + '. ' + t(L.sumLine(z.a, z.r, z.n)), HG, 'MC: alternating sum');
    } }] },
    { num: '9', parts: [{ id: 'e9', level: 'PRG', outcome: 'RF10', make: function (r) {
      var z = pickWhere(function () { return { V: r.pick([10, 12, 20, 15, 24, 30]), q: r.pick([2, 3, 4, 5]) }; }, function (z) { return z.V * (z.q - 1) % z.q === 0 && !(z.V === 10 && z.q === 2); });
      var R = Q(1, z.q), t1 = z.V * (z.q - 1) / z.q, ser = function (a, rr) { return t(seriesTex(first(a, rr, 3), { dec: true })); };
      var b2 = t1;
      return mcP(r, 'Which infinite geometric series has a sum of ' + t(z.V) + '?', ser(t1, R),
        [{ html: ser(z.V * 2, Q(-1, 2)), why: t('\\dfrac{' + (2 * z.V) + '}{1.5}') + ' is not ' + t(z.V) + '.' }, { html: ser(b2, Q(1, z.q + 1)), why: t('S_\\infty=\\dfrac{' + b2 + '}{1-' + qtex(Q(1, z.q + 1)) + '}=' + qtex(qd(b2, Q(z.q, z.q + 1)))) + '.' }, { html: ser(Math.max(1, Math.round(t1 / 4)), 2), why: t('r=2') + ': divergent.' }],
        t('\\dfrac{' + nT(t1) + '}{1-' + qtex(R) + '}=' + z.V) + '.', ['Find ' + t('S_\\infty') + ' for each (or check that it diverges).'], 'MC: which series has a given sum');
    } }] },
    { num: '10', parts: [{ id: 'e10', level: 'ADV', outcome: 'RF10', make: function (r) {
      var z = pickWhere(function () { var pq = r.pick([[2, 3], [1, 2], [3, 4], [1, 3], [3, 5]]); return { R: r.int(3, 15), p: pq[0], q: pq[1] }; }, function (z) { return !(z.R === 9 && z.p === 2 && z.q === 3) && (2 * z.R * z.q) % (z.q - z.p) === 0 && (2 * z.R * z.q) % z.p === 0; });
      var C = 2 * z.R, S = C * z.q / (z.q - z.p), W = C * z.q / z.p, A = z.R * z.R;
      var pi = function (x) { return t(F(x) + '\\pi') + ' cm'; };
      var opts = [[S, null], [C, 'That is the first circle only.'], [W, 'Divide by ' + t('1-r=' + qtex(Q(z.q - z.p, z.q))) + ', not by ' + t('r') + '.'], [A, 'That is the area of the first circle, not a sum of circumferences.'], [C * 2, 'Use ' + t('S_\\infty=\\dfrac{t_1}{1-r}') + '.'], [S * 2, 'The first circumference is ' + t('2\\pi r=' + C + '\\pi') + '.']].concat([3, 5, 6, 7].map(function (k) { return [k * C, 'Use ' + t('S_\\infty=\\dfrac{t_1}{1-r}') + ' with ' + t('t_1=' + C + '\\pi') + '.']; }));
      var seen = [], list = []; opts.forEach(function (o) { if (seen.indexOf(o[0]) < 0 && list.length < 4) { seen.push(o[0]); list.push(o); } });
      return mcP(r, 'A circle has a radius of ' + t(z.R) + ' cm. A second circle has a radius ' + t('\\frac{' + z.p + '}{' + z.q + '}') + ' as long, a third has a radius ' + t('\\frac{' + z.p + '}{' + z.q + '}') + ' of the second’s, and so on forever. The sum of the circumferences of all the circles is', pi(S),
        list.slice(1).map(function (o) { return { html: pi(o[0]), why: o[1] }; }), 'Circumferences ' + t(C + '\\pi,\\ ' + qtex(Q(C * z.p, z.q)) + '\\pi,\\ \\ldots') + ': ' + t('S_\\infty=\\dfrac{' + C + '\\pi}{1-\\frac{' + z.p + '}{' + z.q + '}}=' + F(S) + '\\pi') + ' cm.', ['The circumferences form a geometric series with ' + t('r=\\frac{' + z.p + '}{' + z.q + '}') + '.'], 'MC: sum of circumferences');
    } }] },
    { num: '11', section: 'B. Numerical Response', parts: [{ id: 'e11', level: 'PRG', outcome: 'RF9', make: function (r) {
      var z = pickWhere(function () { return { t1: r.int(20, 80), d: r.pick([1.5, 2.5, 3.5, 4.5, 1.25, 2.25]) }; }, function (z) { var x = z.t1 / z.d; return !(z.t1 === 48 && z.d === 2.5) && Math.abs(x - Math.round(x)) > 1e-9 && Math.abs(x + 1 - Math.round(x + 1)) > 1e-9; });
      var n = Math.floor(z.t1 / z.d) + 2;
      return nrP('In the arithmetic sequence ' + t(z.t1 + ',\\ ' + nT(z.t1 - z.d) + ',\\ ' + nT(z.t1 - 2 * z.d) + ',\\ \\ldots') + ', the first negative term is ' + t('t_n') + '. The value of ' + t('n') + ' is _____.', n, { cands: [[n - 1, 'u1-count', t('t_{' + (n - 1) + '}=' + nT(at(z.t1, -z.d, n - 1))) + ' is still positive.']] },
        t(z.t1 + '-' + nT(z.d) + '(n-1)<0\\ \\Rightarrow\\ n-1>' + nT(K.roundTo(z.t1 / z.d, 3)) + '\\ \\Rightarrow\\ n=' + n) + ' (' + t('t_{' + (n - 1) + '}=' + nT(at(z.t1, -z.d, n - 1)) + ',\\ t_{' + n + '}=' + nT(at(z.t1, -z.d, n))) + ').', ['Solve ' + t('t_n<0') + '; ' + t('n') + ' is the next whole number.'], 'NR: first negative term');
    } }] },
    { num: '12', parts: [{ id: 'e12', level: 'PRG', outcome: 'RF10', make: function (r) {
      var z = pickWhere(function () { return { a: r.pick([0.25, 0.5, 0.75, 1.5, 1.25, 3]), r: r.pick([2, 3]), n: r.int(8, 14) }; }, function (z) { return !(z.a === 0.75 && z.r === 2 && z.n === 12) && z.a * Math.pow(z.r, z.n - 1) < 1e6; });
      var X = cl(z.a * Math.pow(z.r, z.n - 1));
      return nrP('In the geometric sequence ' + t(nT(z.a) + ',\\ ' + nT(z.a * z.r) + ',\\ ' + nT(z.a * z.r * z.r) + ',\\ \\ldots') + ', the number ' + t(F(X)) + ' is the term ' + t('t_n') + '. The value of ' + t('n') + ' is _____.', z.n, { cands: [[z.n - 1, 'u1-count', t(z.r + '^{n-1}=' + F(Math.pow(z.r, z.n - 1)) + '=' + z.r + '^{' + (z.n - 1) + '}') + ' gives ' + t('n-1=' + (z.n - 1)) + '.']] },
        t(nT(z.a) + '(' + z.r + ')^{n-1}=' + F(X) + '\\ \\Rightarrow\\ ' + z.r + '^{n-1}=' + F(Math.pow(z.r, z.n - 1)) + '=' + z.r + '^{' + (z.n - 1) + '}\\ \\Rightarrow\\ n=' + z.n), ['Divide by ' + t(nT(z.a)) + ' and find the exponent.'], 'NR: position of a geometric term');
    } }] },
    { num: '13', parts: [{ id: 'e13', level: 'EMG', outcome: 'RF9', make: function (r) {
      var z = pickWhere(function () { return { a: r.int(5, 25), d: r.int(1, 5), n: r.int(15, 40), who: r.pick(['A student', 'Jamal', 'Lena', 'Rosa', 'Theo']) }; }, function (z) { return !(z.a === 15 && z.d === 3 && z.n === 26) && as(z.a, z.d, z.n) <= 9999; });
      var S = as(z.a, z.d, z.n);
      return nrP(z.who + ' saves ' + t('\\$' + z.a) + ' in the first week, and each week saves ' + t('\\$' + z.d) + ' more than the week before. The total saved, in dollars, after ' + t(z.n) + ' weeks is _____.', S, { cands: [[at(z.a, z.d, z.n), 'u1-gave-sn', 'That is week ' + t(z.n) + ' only.'], [as(z.a, z.d, z.n - 1), 'u1-count', 'That is ' + t(z.n - 1) + ' weeks.']] },
        t('S_{' + z.n + '}=\\dfrac{' + z.n + '}{2}\\left[2(' + z.a + ')+' + (z.n - 1) + '(' + z.d + ')\\right]=' + F(S)), HA, 'NR: arithmetic savings');
    } }] },
    { num: '14', parts: [{ id: 'e14', level: 'PRG', outcome: 'RF10', make: function (r) {
      var z = pickWhere(function () { return { a: r.pick([0.2, 0.3, 0.4, 0.5, 0.6, 0.1]), r: 3, n: r.int(8, 10) }; }, function (z) { var S = z.a * (Math.pow(3, z.n) - 1) / 2; return !(z.a === 0.2 && z.n === 10) && S < 9999.5 && Math.abs(S - Math.round(S) - 0.5) > 0.01; });
      var S = z.a * (Math.pow(z.r, z.n) - 1) / (z.r - 1);
      return nrP('The sum of the first ' + t(z.n) + ' terms of ' + t(nT(z.a) + '+' + nT(z.a * 3) + '+' + nT(cl(z.a * 9)) + '+\\cdots') + ', to the nearest whole number, is _____.', S, { dp: 0, cands: [[z.a * Math.pow(3, z.n - 1), 'u1l7-gave-term', 'That is ' + t('t_{' + z.n + '}') + '.'], [z.a * (Math.pow(3, z.n - 1) - 1) / 2, 'u1l7-exp-n-1', 'The exponent is ' + t('n') + '.']] },
        t('S_{' + z.n + '}=\\dfrac{' + nT(z.a) + '(3^{' + z.n + '}-1)}{3-1}=' + nT(cl(S)) + '\\approx ' + Math.round(S)), HG, 'NR: geometric sum (whole number)');
    } }] },
    { num: '15', parts: [{ id: 'e15', level: 'PRG', outcome: 'RF10', make: function (r) {
      var z = pickWhere(function () { return { t1: r.int(5, 60), S: r.int(10, 80) }; }, function (z) { var rr = 1 - z.t1 / z.S; return z.t1 < z.S && Math.abs(rr * 100 - Math.round(rr * 100)) < 1e-9 && Math.abs(rr * 10 - Math.round(rr * 10)) > 1e-9 && !(z.t1 === 18 && z.S === 24); });
      var rr = cl(1 - z.t1 / z.S);
      return nrP('An infinite geometric series has ' + t('t_1=' + z.t1) + ' and ' + t('S_\\infty=' + z.S) + '. The common ratio, to the nearest hundredth, is _____.', rr, { dp: 2, cands: [[cl(z.t1 / z.S), 'u1l8-1-minus-r', 'That is ' + t('1-r') + '.']] },
        t(z.S + '=\\dfrac{' + z.t1 + '}{1-r}\\ \\Rightarrow\\ 1-r=' + nT(cl(z.t1 / z.S)) + '\\ \\Rightarrow\\ r=' + nT(rr)), ['Solve ' + t('S_\\infty=\\dfrac{t_1}{1-r}') + ' for ' + t('r') + '.'], 'NR: r to the hundredth');
    } }] },
    { num: '16', section: 'C. Written Response', shared: function (r) { return pickWhere(function () { return { a: r.int(10, 30), d: r.pick([1, 2, 2, 3, 4]), n: r.int(15, 35), what: r.pick(['An auditorium', 'A theatre', 'A concert hall']) }; }, function (z) { return !(z.a === 16 && z.d === 2 && z.n === 26); }); },
      stem: function (z) { return z.what + ' has ' + t(z.a) + ' seats in the first row, and each row has ' + t(z.d) + ' more seat' + (z.d > 1 ? 's' : '') + ' than the row in front of it. There are ' + t(F(as(z.a, z.d, z.n))) + ' seats in total.'; }, parts: [
        { id: 'e16a', level: 'ADV', outcome: 'RF9', make: function (r, z) {
          var S = as(z.a, z.d, z.n), b = 2 * z.a - z.d, other = -(b / z.d) - z.n;
          return exactP('How many rows are there?', [z.n, 1], { after: 'rows', cands: [[other, 'u1-quad-root', 'A number of rows can’t be negative: keep the positive root.']] },
            t('\\dfrac{n}{2}\\left[2(' + z.a + ')+(n-1)(' + z.d + ')\\right]=' + F(S) + '\\ \\Rightarrow\\ ' + (z.d === 1 ? '' : z.d) + 'n^{2}+' + b + 'n-' + (2 * S) + '=0') + '. Factor (or a table): ' + t('n=' + z.n) + (Number.isInteger(other) ? ' (' + t('n=' + other) + ' is rejected)' : '') + '.', ['Substitute into ' + t('S_n=\\dfrac{n}{2}\\left[2t_1+(n-1)d\\right]') + ' and solve the quadratic.'], 'rows from the total');
        } },
        { id: 'e16b', level: 'EMG', outcome: 'RF9', make: function (r, z) {
          var last = at(z.a, z.d, z.n);
          return exactP('How many seats are in the last row?', [last, 1], { after: 'seats', cands: [[at(z.a, z.d, z.n + 1), 'u1-n-not-n-1', t('t_{' + z.n + '}=t_1+' + (z.n - 1) + 'd') + '.']] }, t('t_{' + z.n + '}=' + z.a + '+' + (z.n - 1) + '(' + z.d + ')=' + last), HA, 'seats in the last row');
        } }] },
    { num: '17', shared: function (r) { return pickWhere(function () { return { D: r.pick([80, 100, 120, 150, 200, 250]), pc: r.pick([20, 25, 30, 35, 40]), k: r.int(4, 6), L: r.pick([5, 10, 2, 8]) }; }, function (z) {
        var g = 1 - z.pc / 100, n = 0; while (z.D * Math.pow(g, n) >= z.L) n++; z.n = n; return !(z.D === 120 && z.pc === 35) && n >= 4 && n <= 15 && Math.abs(z.D * Math.pow(g, n - 1) - z.L) > 0.05 && Math.abs(z.D * Math.pow(g, n) - z.L) > 0.05; }); },
      stem: function (z) { return 'A patient is given ' + t(z.D) + ' mg of a medicine. Each hour, the body removes ' + t(z.pc + '\\%') + ' of the medicine present at the start of that hour.'; }, parts: [
        { id: 'e17a', level: 'EMG', outcome: 'RF10', make: function (r, z) {
          var g = 1 - z.pc / 100, V = [1, 2, 3].map(function (h) { return z.D * Math.pow(g, h); });
          return fieldsP('Determine the amount left after 1, 2 and 3 hours (to the nearest hundredth of a milligram).', V.map(function (v, i) { return fRnd('after ' + (i + 1) + ' h:', v, 2, { after: 'mg', cands: [[z.D * Math.pow(z.pc / 100, i + 1), 'u1l8-ratio', 'Removing ' + t(z.pc + '\\%') + ' leaves ' + t((100 - z.pc) + '\\%') + ': ' + t('r=' + nT(g)) + '.'], [z.D - (i + 1) * z.D * z.pc / 100, 'u1-linear', 'Each hour removes ' + t(z.pc + '\\%') + ' of what is <b>there</b>, not of the first dose.']], name: (i + 1) + ' h' }); }),
            t(V.map(function (v) { return fxT(v, 2); }).join(',\\ ')) + ' mg', t('r=' + nT(g)) + ': ' + t(V.map(function (v) { return fxT(v, 2); }).join(',\\ ')) + ' mg.', ['Each hour ' + t((100 - z.pc) + '\\%') + ' of the amount remains.'], 'medicine left each hour');
        } },
        { id: 'e17b', level: 'PRG', outcome: 'RF10', make: function (r, z) {
          var g = 1 - z.pc / 100, a1 = cl(z.D * g);
          return { prompt: 'Let ' + t('t_n') + ' be the amount left after ' + t('n') + ' hours. Write the general term.', input: { type: 'math', keys: 'expo', vars: ['n'], before: 'tₙ =' }, check: L.cT(function (n) { return z.D * Math.pow(g, n); }, { cands: [[function (n) { return z.D * Math.pow(g, n - 1); }, 'u1-r-time0', 'Check ' + t('n=1') + ': after 1 hour there are ' + t(nT(a1)) + ' mg. Use ' + t('t_1=' + nT(a1)) + ', or ' + t(z.D + '(' + nT(g) + ')^{n}') + '.'], [function (n) { return z.D * Math.pow(z.pc / 100, n); }, 'u1l8-ratio', 'The ratio is the part that remains: ' + t(nT(g)) + '.']] }),
            key: z.D + '(' + nT(g) + ')^{n}', answer: t('t_n=' + nT(a1) + '(' + nT(g) + ')^{n-1}=' + z.D + '(' + nT(g) + ')^{n}'), solution: t('t_1=' + nT(a1)) + ': ' + t('t_n=' + nT(a1) + '(' + nT(g) + ')^{n-1}') + ', which is the same as ' + t(z.D + '(' + nT(g) + ')^{n}') + '.', hints: [t('t_1') + ' is the amount after 1 hour, not the starting dose.'], text: 'general term, medicine', good: [nT(a1) + '(' + nT(g) + ')^{n-1}'] };
        } },
        { id: 'e17c', level: 'PRG', outcome: 'RF10', make: function (r, z) { var g = 1 - z.pc / 100, x = z.D * Math.pow(g, z.k); return roundP('How much is left after ' + t(z.k) + ' hours?', x, 2, { after: 'mg', cands: [[z.D * Math.pow(g, z.k - 1), 'u1-r-time0', 'That is after ' + t(z.k - 1) + ' hours.'], [z.D * Math.pow(g, z.k + 1), 'u1-r-time0', 'That is after ' + t(z.k + 1) + ' hours.']] }, t(z.D + '(' + nT(g) + ')^{' + z.k + '}\\approx ' + fxT(x, 2)) + ' mg', ['Use your general term with ' + t('n=' + z.k) + '.'], 'medicine after k hours'); } },
        { id: 'e17d', level: 'ADV', outcome: 'RF10', make: function (r, z) {
          var g = 1 - z.pc / 100;
          return exactP('After how many full hours is the amount first less than ' + t(z.L) + ' mg?', [z.n, 1], { after: 'hours', cands: [[z.n - 1, 'u1-count', 'After ' + t(z.n - 1) + ' hours there is ' + t('\\approx ' + fxT(z.D * Math.pow(g, z.n - 1), 2)) + ' mg — not below ' + t(z.L) + ' yet.'], [z.n + 1, 'u1-count', 'Check ' + t(z.n) + ' hours: ' + t('\\approx ' + fxT(z.D * Math.pow(g, z.n), 2)) + ' mg.']] },
            'Table of ' + t(z.D + '(' + nT(g) + ')^{n}') + ': ' + t('n=' + (z.n - 1)) + ' gives ' + t(fxT(z.D * Math.pow(g, z.n - 1), 2)) + ' mg, ' + t('n=' + z.n) + ' gives ' + t(fxT(z.D * Math.pow(g, z.n), 2)) + ' mg. After ' + t(z.n) + ' hours.', ['Make a table of the amount left after ' + t('n') + ' hours.'], 'hours until below a level');
        } }] },
    { num: '18', shared: function (r) { return pickWhere(function () { return { b: r.int(4, 15), a: r.int(3, 9), p: r.pick([0.8, 0.75, 0.6, 0.9, 0.7]), k: r.int(3, 5), n: r.int(5, 8), what: r.pick(['the ice on a lake', 'a snowpack', 'the ice on a pond']) }; }, function (z) { return !(z.b === 8 && z.a === 6 && z.p === 0.8); }); },
      stem: function (z) { return 'On December 1 ' + z.what + ' is ' + t(z.b) + ' cm thick. In the first week it gets ' + t(z.a) + ' cm thicker, and each week after that it gets thicker by ' + t(Math.round(z.p * 100) + '\\%') + ' of the previous week’s increase.'; }, parts: [
        { id: 'e18a', level: 'EMG', outcome: 'RF10', make: function (r, z) { var x = z.a * Math.pow(z.p, z.k - 1); return roundP('By how much, to the nearest hundredth of a centimetre, does it thicken in week ' + t(z.k) + '?', x, 2, { after: 'cm', cands: [[z.a * Math.pow(z.p, z.k), 'u1l7-day-off', 'Week ' + t(z.k) + ' is ' + t(z.a + '(' + nT(z.p) + ')^{' + (z.k - 1) + '}') + '.'], [z.b + z.a * Math.pow(z.p, z.k - 1), 'u1-ice-base', 'The question asks only for the increase in week ' + t(z.k) + '.']] }, t(z.a + '(' + nT(z.p) + ')^{' + (z.k - 1) + '}\\approx ' + fxT(x, 2)) + ' cm', ['The weekly increases are geometric with ' + t('t_1=' + z.a) + ', ' + t('r=' + nT(z.p)) + '.'], 'weekly increase'); } },
        { id: 'e18b', level: 'ADV', outcome: 'RF10', make: function (r, z) { var Sn = z.a * (1 - Math.pow(z.p, z.n)) / (1 - z.p), x = z.b + Sn; return roundP('How thick, to the nearest hundredth of a centimetre, is it after ' + t(z.n) + ' weeks?', x, 2, { after: 'cm', cands: [[Sn, 'u1-ice-base', 'That is the total increase. Add the starting thickness, ' + t(z.b) + ' cm.'], [z.b + z.a * Math.pow(z.p, z.n - 1), 'u1l8-term-not-sum', 'Add all ' + t(z.n) + ' weekly increases, not just the last.']] }, t(z.b + '+S_{' + z.n + '}=' + z.b + '+\\dfrac{' + z.a + '(1-' + nT(z.p) + '^{' + z.n + '})}{' + nT(1 - z.p) + '}\\approx ' + z.b + '+' + fxT(Sn, 2) + '=' + fxT(x, 2)) + ' cm', ['Thickness = starting thickness + the sum of the increases.'], 'thickness after n weeks'); } },
        { id: 'e18c', level: 'ADV', outcome: 'RF10', make: function (r, z) { var S = qa(z.b, qd(z.a, qs(1, qn(z.p)))); return exactP('If the pattern continued, what thickness would it approach?', S, { after: 'cm', dp: 2, cands: [[qd(z.a, qs(1, qn(z.p))), 'u1-ice-base', 'That is the total increase. Add the starting thickness, ' + t(z.b) + ' cm.']] }, t(z.b + '+S_\\infty=' + z.b + '+\\dfrac{' + z.a + '}{' + nT(1 - z.p) + '}=' + qtex(S, { dec: true }) + (terminates(S) ? '' : '\\approx ' + fxT(qv(S), 2))) + ' cm', ['Starting thickness + ' + t('S_\\infty') + ' of the increases.'], 'thickness approached'); } }] },
    { num: '19', shared: function (r) { return pickWhere(function () { return { x: r.int(1, 6), a: r.int(1, 4), r: r.int(2, 4), n: r.int(6, 9) }; }, function (z) { return !(z.x === 1 && z.a === 2 && z.r === 3); }); },
      stem: function (z) { var w = function (c) { return 'x' + (c < 0 ? '-' + (-c) : c === 0 ? '' : '+' + c); }; return 'The expressions ' + t(w(z.a - z.x)) + ', ' + t(w(z.a * z.r - z.x)) + ' and ' + t(w(z.a * z.r * z.r - z.x)) + ' are consecutive terms of a geometric sequence.'; }, parts: [
        { id: 'e19a', level: 'MAS', outcome: 'RF10', make: function (r, z) {
          var p = z.a - z.x, q = z.a * z.r - z.x, s = z.a * z.r * z.r - z.x, w = function (c) { return 'x' + (c < 0 ? '-' + (-c) : c === 0 ? '' : '+' + c); }, T = [z.a, z.a * z.r, z.a * z.r * z.r];
          var lhs = 2 * q, rhs = p + s, cst = q * q - p * s; // (x+q)^2 = (x+p)(x+s) -> (2q - p - s)x = ps - q^2
          return fieldsP('Determine ' + t('x') + ' and the three terms.', [fNum(t('x='), [z.x, 1], { cands: [[-z.x, 'sign', 'Check the sign when you solve the linear equation.']] }), fNum('terms:', [T[0], 1], { name: 'first term' }), fNum('', [T[1], 1], { name: 'second term' }), fNum('', [T[2], 1], { name: 'third term' })],
            t('x=' + z.x) + '; terms ' + t(T.join(',\\ ')) + ' (' + t('r=' + z.r) + ')', t('(' + w(q) + ')^{2}=(' + w(p) + ')(' + w(s) + ')') + '<br>' + t('x^{2}' + (lhs >= 0 ? '+' : '') + lhs + 'x+' + q * q + '=x^{2}' + (rhs >= 0 ? '+' : '') + rhs + 'x' + (p * s >= 0 ? '+' : '') + p * s) + '<br>' + t((lhs - rhs) + 'x=' + (p * s - q * q) + '\\ \\Rightarrow\\ x=' + z.x) + '. Terms: ' + t(T.join(',\\ ')) + ' (' + t('r=' + z.r) + ').',
            ['For three terms ' + t('a,\\ b,\\ c') + ' in a row of a geometric sequence, ' + t('b^{2}=ac') + '.', 'Expand both sides: the ' + t('x^{2}') + ' terms cancel.'], 'x from three geometric terms');
        } },
        { id: 'e19b', level: 'ADV', outcome: 'RF10', make: function (r, z) { var S = gsum(z.a, z.r, z.n); return exactP('If these are the first three terms, determine the sum of the first ' + t(z.n) + ' terms of the series.', S, { cands: L.sumCands(z.a, z.r, z.n) }, t(L.sumLine(z.a, z.r, z.n)), HG, 'Sₙ of that series'); } }] }
  ];

  HW.defineLesson({ id: LID, unit: 1, num: '9', title: 'Unit 1 Review', outcome: 'RF10', questions: QUESTIONS, extra: EXTRA });
})(window);
