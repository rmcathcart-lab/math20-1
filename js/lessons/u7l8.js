/* Math 20-1 · Unit 7 · Lesson 8 — Unit 7 Review (outcome per part: AN1 absolute value of numbers, RF2 graphs of
 * y = |f(x)| and absolute value equations, RF11 reciprocal functions)
 * Assignment 8, a practice test (m201book unit7/u7_l08.tex, Questions 1–26) and the Lesson 8 Extra Practice, a second
 * practice test (u7_ep08.tex: Multiple Choice 1–11, Numerical Response 12–15, Written Response 16–20; extra ids start
 * with E). Every part is a generator: the booklet question's idea, form and difficulty with new numbers (the lesson's
 * example numbers and the booklet's own are left out where feasible). Calculator allowed; answers exact where the
 * booklet's are; numerical-response answers fit the four boxes (positive, rounded as asked).
 * Two-absolute-value equations (|A| = |B|, a workbook extension) are not in this review, as in the unit test.
 *
 * Uses the kit HW.u7k78 (u7l7.js: reciprocal features, domains, ranges, turning points, vertex form, checkers) at load,
 * and the Unit 7 assessment builders HW.u7assess.B (u7test.js, which loads after the lessons) only inside generators,
 * always with u7l8- codes (u7l7.js registers that list): evaluating, ordering and distances (AN1); piecewise forms,
 * |A| = c, |ax + b| = cx + d, |quadratic| = k and |A| = B with extraneous roots (RF2); y = 1/(ax + b) (RF11).
 * Added here: evaluating with a cube root / a square / nested bars, |f| from a graph (invariant points, y-intercept,
 * range), the features of y = |x² + bx + c|, calculator solutions to the tenth, the f / |f| / 1/f table, and the
 * multiple-choice and numerical-response items of both practice tests.
 * Conversions: sketches → what the sketch shows (invariant points, asymptotes, turning point, intercepts, domain and
 * range); "explain" items (Q13, Extra 20) → multiple choice of explanations; "describe a strategy" (Extra 16a, 18a)
 * → its first step (the invariant points of |f|; the vertex of f).
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: Q26, Extra 18(b). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, KP = K.P, P = HW.poly, ex = HW.ex, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var LID = 'u7l8', CP = 'u7l8-', U = HW.u7k78;
  if (!U || !U.rangeMC) throw new Error('js/lessons/u7l8.js needs js/lessons/u7l7.js loaded first');
  var gcd = U.gcd, pickWhere = U.pickWhere, nz = U.nz, toR = U.toR, rv = U.rv, rt = U.rt, dt = U.dt, sgT = U.sgT, coefT = U.coefT, uniqNums = U.uniqNums, sameSet = U.sameSet, isSq = U.isSq, A = U.A,
    lin = U.lin, quad = U.quad, tx = U.tx, linT = U.linT, vtxT = U.vtxT, pt = U.pt, ptsT = U.ptsT, G = U.G, crv = U.crv, recFns = U.recFns, win = U.win, numVal = U.numVal, qroots = U.qroots, zerosOf = U.zerosOf,
    rootsPart = U.rootsPart, ptsCheck = U.ptsCheck, ptsBad = U.ptsBad, valChk = U.valChk, valPart = U.valPart, pointChk = U.pointChk, pointPart = U.pointPart, fieldsPart = U.fieldsPart, mc = U.mc,
    mkQ = U.mkQ, mkV = U.mkV, S = U.S, combo = U.combo, sAsy = U.sAsy, sTP = U.sTP, sType = U.sType, sDom = U.sDom, sRng = U.sRng, sYint = U.sYint, sInv = U.sInv, invPart = U.invPart, tpPart = U.tpPart,
    sVform = U.sVform, sGform = U.sGform, backWrongs = U.backWrongs, fresh = U.fresh, fullSpec = U.fullSpec, fullWhy = U.fullWhy, asyTurnSpec = U.asyTurnSpec, asyTurnStem = U.asyTurnStem, asyTurnGraph = U.asyTurnGraph, asyTurnSol = U.asyTurnSol,
    turnYSpec = U.turnYSpec, turnYSol = U.turnYSol, fGraph = U.fGraph, REC = U.REC, HINT_ASY = U.HINT_ASY, HINT_TP = U.HINT_TP, HINT_DR = U.HINT_DR, HINT_BACK = U.HINT_BACK;
  var AN1 = 'AN1', RF2 = 'RF2', RF11 = 'RF11';

  HW.addCodes({ 'u7l8-cube': 'Cube root of a negative number taken as positive', 'u7l8-sq-first': 'Squared −a instead of a (minus sign outside)', 'u7l8-tenth': 'Not rounded to the tenth',
    'u7l8-tol-d': 'Tolerance: gave the allowed difference, not the lengths', 'u7l8-tol-2d': 'Tolerance: used twice the allowed difference', 'u7l8-cnt': 'Number of solutions wrong' });
  HW.addPartial({ 'u7l8-cube': 's', 'u7l8-sq-first': 's', 'u7l8-tol-d': 'b', 'u7l8-tol-2d': 's', 'u7l8-cnt': 'b' });

  /* the Unit 7 assessment builders (u7test.js loads after the lessons, so only inside generators) */
  function UA() { if (!HW.u7assess || !HW.u7assess.B) throw new Error('u7l8.js needs js/lessons/u7test.js (HW.u7assess)'); return HW.u7assess.B; }
  function ua(name, o) { return function (r) { return UA()[name](r, CP, o); }; }
  function Pt(id, outcome, level, make) { return { id: id, outcome: outcome, level: level, make: make }; }
  function nb(n) { return n < 0 ? '(' + n + ')' : String(n); }
  var ABSF = t('y=|f(x)|');

  /* ======================================================================================================
   * AN1 — evaluating (Q1, Q14, Q23, Extra 1–2)
   * ====================================================================================================== */
  function numPart(prompt, val, wr, sol, hints, text) {
    var W = wr.filter(function (w) { return w.v !== val; });
    var p = KP.number(prompt, val, function (v) { for (var i = 0; i < W.length; i++) if (v === W[i].v) return { code: W[i].code, hint: W[i].hint }; return null; }, sol, hints, text);
    p.bad = W.map(function (w) { return String(w.v); }).filter(function (b, i, arr) { return arr.indexOf(b) === i; });
    return p;
  }
  var H_EV = ['Absolute value bars are grouping symbols: simplify inside them first, then take the absolute value.', 'A negative sign outside the bars stays: ' + t('-\\lvert -6\\rvert=-6') + '.'];
  function ev1(r) { // |−a| + |b − c|
    var a = r.int(3, 15), b = r.int(-6, 6), c = b + r.int(2, 9); if (a === 12 && b === 4 && c === 9) a = 13;
    var val = a + (c - b);
    return numPart('Evaluate ' + t(A('-' + a) + '+' + A(b + '-' + c)) + '.', val, [{ v: -a + (b - c), code: CP + 'abs-bracket', hint: 'The bars make each value non-negative: ' + t(A('-' + a) + '=' + a) + ' and ' + t(A(b - c) + '=' + (c - b)) + '.' }, { v: a + (b - c), code: CP + 'abs-bracket', hint: 'Simplify inside the second bars, then take the absolute value: ' + t(A(b - c) + '=' + (c - b)) + '.' }],
      t(A('-' + a) + '+' + A(b - c) + '=' + a + '+' + (c - b) + '=' + val) + '.', H_EV, 'evaluating absolute values');
  }
  function ev2(r) { // −|−a|²
    var a = pickWhere(function () { return r.int(2, 9); }, function (x) { return x !== 3; });
    return numPart('Evaluate ' + t('-' + A('-' + a) + '^{2}') + '.', -a * a, [{ v: a * a, code: CP + 'abs-minus', hint: 'The negative sign is outside the bars and the square: ' + t('-(' + a + ')^{2}=-' + a * a) + '.' }],
      t('-' + A('-' + a) + '^{2}=-(' + a + ')^{2}=-' + a * a) + '.', ['Evaluate the absolute value first, then the power, then apply the negative sign in front.'], 'evaluating absolute values');
  }
  function ev3(r) { // |∛(−n³) − m|
    var n = r.int(2, 5), m = pickWhere(function () { return r.int(1, 9); }, function (x) { return x !== n && !(n === 2 && x === 5); });
    return numPart('Evaluate ' + t(A('\\sqrt[3]{-' + n * n * n + '}-' + m)) + '.', n + m, [{ v: Math.abs(n - m), code: CP + 'cube', hint: 'The cube root of a negative number is negative: ' + t('\\sqrt[3]{-' + n * n * n + '}=-' + n) + '.' }, { v: -n - m, code: CP + 'abs-bracket', hint: 'You simplified inside the bars correctly. Now take the absolute value: it is never negative.' }],
      t(A('\\sqrt[3]{-' + n * n * n + '}-' + m) + '=' + A('-' + n + '-' + m) + '=' + A(-n - m) + '=' + (n + m)) + '.', H_EV, 'evaluating absolute values');
  }
  function ev4(r) { // ||−a| − |b||
    var a = r.int(2, 9), b = pickWhere(function () { return r.int(a + 1, 15); }, function (x) { return !(a === 7 && x === 10); });
    return numPart('Evaluate ' + t('\\bigl\\lvert\\,' + A('-' + a) + '-' + A(b) + '\\,\\bigr\\rvert ') + '.', b - a, [{ v: a - b, code: CP + 'abs-bracket', hint: 'Work from the inside out: ' + t(A('-' + a) + '-' + A(b) + '=' + (a - b)) + ', and then the outer bars make it positive.' }, { v: a + b, code: CP + 'abs-split', hint: t(A('-' + a) + '=' + a) + ', so the inside is ' + t(a + '-' + b) + '.' }],
      t('\\bigl\\lvert\\,' + A('-' + a) + '-' + A(b) + '\\,\\bigr\\rvert=' + A(a + '-' + b) + '=' + A(a - b) + '=' + (b - a)) + '.', H_EV, 'evaluating nested absolute values');
  }
  function ev23(r) { // NR: |−a| − |b − c| + |∛(−n³)|
    var z = pickWhere(function () { return { a: r.int(4, 15), b: r.int(-3, 6), w: r.int(2, 9), n: r.int(2, 5) }; }, function (s) { s.v = s.a - s.w + s.n; return s.v > 0 && !(s.a === 9 && s.w === 7 && s.n === 5); });
    var c = z.b + z.w, W = [{ v: z.a + z.w + z.n, code: CP + 'abs-minus', hint: 'The middle absolute value is subtracted: ' + t('-' + A(z.b + '-' + c) + '=-' + z.w) + '.' }, { v: z.a - z.w - z.n, code: CP + 'cube', hint: t('\\sqrt[3]{-' + z.n * z.n * z.n + '}=-' + z.n) + ', and its absolute value is ' + t(z.n) + '.' }].filter(function (w) { return w.v !== z.v; });
    var p = KP.nr('The value of ' + t(A('-' + z.a) + '-' + A(z.b + '-' + c) + '+' + A('\\sqrt[3]{-' + z.n * z.n * z.n + '}')) + ' is ____.', z.v, function (v) { for (var i = 0; i < W.length; i++) if (v === W[i].v) return { code: W[i].code, hint: W[i].hint }; return null; },
      t(z.a + '-' + z.w + '+' + z.n + '=' + z.v), H_EV, 'evaluating absolute values');
    p.bad = W.filter(function (w) { return w.v > 0 && String(w.v).length <= 4; }).map(function (w) { return String(w.v); });
    return p;
  }
  function greatestMC(r) {
    var a = r.int(5, 12), b = pickWhere(function () { return r.int(2, 4); }, function (x) { return a - 2 * x > 0 && !(a === 7 && x === 2); });
    var opts = [{ html: t(A('-' + a) + '-' + A('-' + b)), v: a - b }, { html: t(A('-' + a + '-' + b)), v: a + b, right: true }, { html: t(A(a) + '-2' + A('-' + b)), v: a - 2 * b }, { html: t('-' + A('-' + (a + b))), v: -(a + b) }];
    opts.forEach(function (o, i) { if (!o.right) { o.why = 'That one equals ' + t(o.v) + '. Evaluate each choice.'; o.code = 'u7l8-g' + i; } });
    return mc(r, 'Which expression has the greatest value?', opts, t(A('-' + a + '-' + b) + '=' + A(-(a + b)) + '=' + (a + b)) + ', the greatest. (The others: ' + t(a - b) + ', ' + t(a - 2 * b) + ', ' + t(-(a + b)) + '.)', ['Evaluate each expression: simplify inside the bars first.'], 'comparing absolute values');
  }
  function ep1MC(r) {
    var z = pickWhere(function () { return { a: r.int(2, 9), b: r.int(5, 15), c: r.int(1, 9) }; }, function (s) { s.v = s.a - s.b + s.c; return s.v !== 0 && Math.abs(s.v) !== s.a + s.b + s.c && !(s.a === 4 && s.b === 10 && s.c === 3); });
    var opts = [{ html: t(z.v), right: true }, { html: t(z.a + z.b + z.c), why: 'The ' + t('-') + ' in front of ' + t(A('-' + z.b)) + ' stays: ' + t('-' + A('-' + z.b) + '=-' + z.b) + '.', code: 'u7l8-e1a' }, { html: t(-z.v), why: 'Each absolute value is positive: ' + t(z.a + '-' + z.b + '+' + z.c) + '.', code: 'u7l8-e1b' }, { html: t(-(z.a + z.b + z.c)), why: 'Each absolute value is positive; only the middle one is subtracted.', code: 'u7l8-e1c' }];
    return mc(r, 'The value of ' + t(A('-' + z.a) + '-' + A('-' + z.b) + '+' + A(z.c)) + ' is', opts, t(z.a + '-' + z.b + '+' + z.c + '=' + z.v) + '.', H_EV, 'evaluating absolute values');
  }
  function ep2MC(r) {
    var a = r.int(2, 12), b = pickWhere(function () { return r.int(2, 12); }, function (x) { return x !== a && a * x !== a + x && !(a === 7 && x === 3); });
    var opts = [{ html: t(a + b), right: true }, { html: t(Math.abs(a - b)), why: 'Subtract the numbers with their signs: ' + t(A('-' + a + '-' + b)) + '.', code: 'u7l8-e2a' }, { html: t(-(a + b)), why: 'A distance is never negative.', code: 'u7l8-e2b' }, { html: t(a * b), why: 'The distance is the absolute value of the <b>difference</b>.', code: 'u7l8-e2c' }];
    return mc(r, 'The distance between ' + t(-a) + ' and ' + t(b) + ' on a number line is', opts, t(A('-' + a + '-' + b) + '=' + A(-(a + b)) + '=' + (a + b)) + '.', ['The distance between ' + t('a') + ' and ' + t('b') + ' is ' + t('|a-b|') + '.'], 'distance between two numbers');
  }

  /* ======================================================================================================
   * RF2 — graphs of y = |f(x)|
   * ====================================================================================================== */
  function absLinSpec(r) { return pickWhere(function () { return { m: toR(r.pick([1, -1, 2, -2, 3, -3, [1, 2], [-1, 2]])), h: nz(r, 1, 5) }; }, function (s) { s.b = -rv(s.m) * s.h; return Number.isInteger(s.b) && s.b !== 0 && Math.abs(s.b) <= 8 && !(rv(s.m) === -0.5 && s.h === -2) && !(rv(s.m) === -2 && s.h === 2); }); }
  function sAbsInv(zs, o) {
    o = o || {};
    var pairs = zs.map(function (z) { return [z, 0]; }), wr = [{ pairs: zs.map(function (z) { return [-z, 0]; }), code: CP + 'inv-sign', hint: 'Solve ' + t('f(x)=0') + ' again: invariant points of ' + ABSF + ' are the zeros of ' + t('f') + '.' }];
    if (o.c) wr.push({ pairs: pairs.concat([[0, Math.abs(o.c)]]), code: CP + 'inv-yint', hint: 'The ' + t('y') + '-intercept moves if it is below the axis. Invariant points are on the ' + t('x') + '-axis: the zeros of ' + t('f') + '.' });
    if (o.vtx) wr.push({ pairs: [o.vtx], code: CP + 'inv-vertex', hint: 'The vertex is reflected, so it moves. The invariant points are where ' + t('f(x)=0') + '.' });
    var W = wr.filter(function (w) { return !sameSet(w.pairs.map(function (p) { return p[0] * 7 + p[1]; }), pairs.map(function (p) { return p[0] * 7 + p[1]; })); });
    return { f: { label: 'Invariant points', mode: 'math', keys: 'u7pts', placeholder: 'e.g. (2, 0)' }, c: ptsCheck(CP, pairs, W, { noneOk: false, noneHint: 'The graph of ' + t('f') + ' meets the ' + t('x') + '-axis, and those points do not move.' }), k: ptsT(pairs), a: 'invariant point' + (zs.length > 1 ? 's ' : ' ') + t(ptsT(pairs)), bad: ptsBad(pairs, W, { noneOk: false }) };
  }
  function sAbsY(c, h) {
    var y = Math.abs(c), W = [];
    return { f: { label: t('y') + '-intercept', name: 'y-intercept', mode: 'math', keys: 'fraction' }, c: K.value(y, { diag: function (v) { if (c < 0 && v === c) return { code: CP + 'yint-neg', hint: 'At ' + t('x=0') + ', ' + t('|f(0)|=' + A(c) + '=' + y) + ': the graph of ' + ABSF + ' is never below the ' + t('x') + '-axis.' }; if (h != null && Math.abs(v - h) < 1e-9) return { code: CP + 'yint-x', hint: 'That is an ' + t('x') + '-intercept. The ' + t('y') + '-intercept is the value at ' + t('x=0') + '.' }; return null; } }), k: String(y), a: t('y') + '-intercept ' + t(y), bad: c < 0 ? [String(c)] : [] };
  }
  function sAbsR(q) {
    var tg = S('y', 'y\\ge 0'), wr = [{ is: '\\{y\\mid y\\in\\mathbb{R}\\}', code: CP + 'rng-f', hint: 'That is the range of ' + t('y=f(x)') + '. The graph of ' + ABSF + ' has no negative ' + t('y') + '-values.' }];
    if (q != null) wr.push({ is: S('y', 'y\\ge ' + rt(toR(Math.abs(q)))), code: CP + 'rng-q', hint: 'The parabola crosses the ' + t('x') + '-axis, so ' + t('|f(x)|') + ' reaches 0 at the invariant points.' }, { is: S('y', 'y\\ge ' + rt(toR(q))), code: CP + 'rng-f', hint: 'That is the range of ' + t('y=f(x)') + '. Reflecting removes the negative values.' });
    return { f: { label: 'Range', mode: 'math', keys: 'set', vars: ['y'] }, c: K.set(tg, { v: 'y', wrong: wr }), k: tg, a: 'range ' + t(tg), bad: wr.map(function (w) { return w.is; }) };
  }
  var H_ABSG = ['Keep the part of the graph on or above the ' + t('x') + '-axis and reflect the part below it: the ' + t('x') + '-intercepts do not move (invariant points).', 'The graph of ' + ABSF + ' has no negative ' + t('y') + '-values.'];
  function absLinGraph(r) {
    var z = absLinSpec(r), m = rv(z.m), f = function (x) { return m * x + z.b; }, ft = linT(z.m, z.b, m < 0 && r.chance(0.5));
    return combo('The graph of ' + t('y=f(x)') + ', where ' + t('f(x)=' + ft) + ', is shown.' + G({ fns: [crv(f)], max: 260, aria: 'the graph of a line' }) + 'State the invariant points, the ' + t('y') + '-intercept and the range of ' + ABSF + '.', [sAbsInv([z.h], { c: z.b }), sAbsY(z.b, z.h), sAbsR(null)], H_ABSG, 'invariant points, y-intercept and range of y = |f(x)|', null,
      'The part of the line ' + (m > 0 ? 'left' : 'right') + ' of its zero is below the axis and is reflected. Invariant point ' + t(pt(z.h, 0)) + '; ' + t('y') + '-intercept ' + t(A(z.b) + '=' + Math.abs(z.b)) + '; range ' + t(S('y', 'y\\ge 0')) + '.');
  }
  function quadAbsSpec(r, o) {
    o = o || {};
    return pickWhere(function () { return { r1: r.int(-6, 4), w: r.int(2, 7) }; }, function (s) { s.s1 = s.r1 + s.w; s.Q = mkQ(1, -(s.r1 + s.s1), s.r1 * s.s1); return s.s1 <= 7 && s.Q.cv !== 0 && fresh(s.Q) && (!o.even || s.w % 2 === 0) && Math.abs(s.Q.cv) <= 30; });
  }
  function absQuadGraph(r) {
    var z = quadAbsSpec(r), Q = z.Q;
    return combo('The graph of ' + t('y=f(x)') + ', where ' + t('f(x)=' + Q.tex) + ', is shown.' + G({ x: win([z.r1, z.s1], 1.5), y: [-7, 7], fns: [crv(Q.f)], max: 260, aria: 'the graph of a parabola that crosses the x-axis twice' }) + 'State the invariant points, the ' + t('y') + '-intercept and the range of ' + ABSF + '.', [sAbsInv([z.r1, z.s1], { c: Q.cv, vtx: [Q.p, Math.abs(Q.q)] }), sAbsY(Q.cv, z.r1), sAbsR(Q.q)], H_ABSG, 'invariant points, y-intercept and range of y = |f(x)|', null,
      t('f(x)=(x' + sgT(-z.r1) + ')(x' + sgT(-z.s1) + ')') + ': the part between the zeros is below the axis and is reflected; the vertex ' + t(pt(toR(Q.p), toR(Q.q))) + ' becomes a local maximum ' + t(pt(toR(Q.p), toR(-Q.q))) + '.<br>Invariant points ' + t(ptsT([[z.r1, 0], [z.s1, 0]])) + '; ' + t('y') + '-intercept ' + t(A(Q.cv) + '=' + Math.abs(Q.cv)) + '; range ' + t(S('y', 'y\\ge 0')) + '.');
  }
  /* y = |x² + bx + c|: intercepts, local maximum, domain, range (Q5) */
  function q5(r) {
    var z = quadAbsSpec(r, { even: true }), Q = z.Q, mx = [toR(Q.p), toR(-Q.q)];
    var xi = { f: { label: t('x') + '-intercepts', name: 'x-intercepts', mode: 'math', keys: 'u7sol', vars: ['x'], placeholder: 'e.g. x = 1, x = 5' }, c: K.valueSet([z.r1, z.s1], { v: 'x' }), k: 'x=' + z.r1 + ',\\ x=' + z.s1, a: t('x') + '-intercepts ' + t(z.r1) + ' and ' + t(z.s1), bad: z.r1 === -z.s1 ? ['x=' + z.r1] : ['x=' + -z.r1 + ',\\ x=' + -z.s1] };
    var pc = pointChk(CP, mx, [{ p: [toR(Q.p), toR(Q.q)], code: CP + 'vtx-noreflect', hint: 'The vertex ' + t(pt(toR(Q.p), toR(Q.q))) + ' is below the axis, so it is reflected.' }, { p: [toR(-Q.p), toR(-Q.q)], code: CP + 'pt-xchg', hint: 'The axis of symmetry is halfway between the zeros.' }]);
    var lm = { f: { label: 'Local maximum point', name: 'local maximum', mode: 'math', keys: 'u7pts' }, c: pc.check, k: pt(mx[0], mx[1]), a: 'local maximum ' + t(pt(mx[0], mx[1])), bad: pc.W.map(function (w) { return pt(w.p[0], w.p[1]); }) };
    var dm = { f: { label: 'Domain', mode: 'math', keys: 'set', vars: ['x'] }, c: K.set('\\{x\\mid x\\in\\mathbb{R}\\}', { v: 'x' }), k: '\\{x\\mid x\\in\\mathbb{R}\\}', a: 'domain ' + t('\\{x\\mid x\\in\\mathbb{R}\\}'), bad: [S('x', 'x\\ge 0')] };
    return combo('For ' + t('y=' + A(Q.tex)) + ', state the ' + t('x') + '-intercepts, the ' + t('y') + '-intercept, the coordinates of the local maximum point, the domain and the range.', [xi, sAbsY(Q.cv, z.r1), lm, dm, sAbsR(Q.q)], ['Factor and complete the square: ' + t(Q.tex + '=(x-p)^{2}+q') + '.', 'The vertex below the axis is reflected: it becomes the local maximum.'], 'features of y = |x² + bx + c|', null,
      t(Q.tex + '=(x' + sgT(-z.r1) + ')(x' + sgT(-z.s1) + ')=' + Q.vtex) + '. ' + t('x') + '-intercepts ' + t(z.r1) + ' and ' + t(z.s1) + '; ' + t('y') + '-intercept ' + t(A(Q.cv) + '=' + Math.abs(Q.cv)) + '.<br>The vertex ' + t(pt(toR(Q.p), toR(Q.q))) + ' is reflected: local maximum ' + t(pt(mx[0], mx[1])) + '. Domain ' + t('\\{x\\mid x\\in\\mathbb{R}\\}') + '; range ' + t(S('y', 'y\\ge 0')) + '.');
  }
  function pwTex(e1, c1, e2, c2) { return 'y=\\begin{cases}' + e1 + ', & ' + c1 + '\\\\ ' + e2 + ', & ' + c2 + '\\end{cases}'; }
  function pwLinMC(r) {
    var m = r.int(2, 4), h = pickWhere(function () { return nz(r, 1, 6); }, function (x) { return !(m === 2 && x === -4); }), n = -m * h, E = tx(lin(m, n)), N = tx(lin(-m, -n));
    var opts = [{ html: t(pwTex(E, 'x\\ge ' + h, N, 'x<' + h)), right: true },
      { html: t(pwTex(E, 'x\\ge ' + -h, tx(lin(-m, n)), 'x<' + -h)), why: 'The pieces meet where ' + t(E + '=0') + ', at ' + t('x=' + h) + '; the other piece is the opposite of the whole expression.', code: 'u7l8-p1' },
      { html: t(pwTex(E, 'x\\ge ' + h, tx(lin(m, -n)), 'x<' + h)), why: 'Where ' + t(E + '<0') + ' the piece is ' + t('-(' + E + ')=' + N) + ': change the sign of every term.', code: 'u7l8-p2' },
      { html: t(pwTex(E, 'x\\le ' + h, N, 'x>' + h)), why: 'Solve ' + t(E + '\\ge 0') + ': ' + t('x\\ge ' + h) + '. That is where the bars change nothing.', code: 'u7l8-p3' }];
    return mc(r, 'The piecewise form of ' + t('y=' + A(E)) + ' is', opts, t(E + '\\ge 0') + ' when ' + t('x\\ge ' + h) + '; otherwise ' + t('y=-(' + E + ')=' + N) + '.', ['Solve ' + t(E + '\\ge 0') + '.', 'Where the inside is negative the piece is its opposite.'], 'piecewise form of y = |ax + b|');
  }
  function pwQuadMC(r) {
    var n = pickWhere(function () { return r.int(2, 9); }, function (x) { return x !== 4 && x !== 3; }), E = 'x^{2}-' + n * n, N = n * n + '-x^{2}';
    var opts = [{ html: t(pwTex(E, 'x\\le -' + n + '\\text{ or }x\\ge ' + n, N, '-' + n + '<x<' + n)), right: true },
      { html: t(pwTex(E, '-' + n + '\\le x\\le ' + n, N, 'x<-' + n + '\\text{ or }x>' + n)), why: 'The parabola opens up, so it is below the axis <b>between</b> its zeros: that is where the piece is ' + t(N) + '.', code: 'u7l8-q1' },
      { html: t(pwTex(E, 'x\\ge ' + n, N, 'x<' + n)), why: 'There are two zeros, ' + t('\\pm ' + n) + ': the parabola is above the axis on both sides of them.', code: 'u7l8-q2' },
      { html: t(pwTex(E, 'x\\le -' + n + '\\text{ or }x\\ge ' + n, 'x^{2}+' + n * n, '-' + n + '<x<' + n)), why: 'The middle piece is ' + t('-(' + E + ')=' + N) + ': every sign changes.', code: 'u7l8-q3' }];
    return mc(r, 'The piecewise form of ' + t('y=' + A(E)) + ' is', opts, t(E + '\\ge 0') + ' outside the zeros ' + t('\\pm ' + n) + '; between them it is negative and becomes ' + t('-(' + E + ')=' + N) + '.', ['Find the zeros and decide where the parabola is below the axis.'], 'piecewise form of y = |x² − n²|');
  }
  function rangeAbsMC(r) {
    var z = quadAbsSpec(r), Q = z.Q, q = Q.q, qT = rt(toR(q)), aq = rt(toR(-q));
    var opts = [{ html: t('y\\ge 0'), right: true }, { html: t('y\\ge ' + qT), why: 'That is the range of ' + t('y=f(x)') + '; reflecting removes the negative values.', code: 'u7l8-r1' }, { html: t('y\\ge ' + aq), why: 'The parabola crosses the ' + t('x') + '-axis, so ' + t('|f(x)|') + ' reaches 0.', code: 'u7l8-r2' }, { html: t('0\\le y\\le ' + aq), why: 'The outer arms rise without bound.', code: 'u7l8-r3' }];
    return mc(r, 'The range of ' + t('y=' + A(Q.tex)) + ' is', opts, 'The parabola crosses the ' + t('x') + '-axis (at ' + t(z.r1) + ' and ' + t(z.s1) + '), so after the reflection the lowest ' + t('y') + '-value is 0 and the arms rise without bound: ' + t('y\\ge 0') + '.', H_ABSG, 'range of y = |f(x)|');
  }
  function falseStmtMC(r) {
    var h = r.int(1, 6), k = r.int(2, 7), m = r.int(2, 5), c = r.int(1, 5), g = r.int(1, 6);
    var trues = [t('|x-' + h + '|=x-' + h) + ' if ' + t('x\\ge ' + h), t('|' + c + '-' + m + 'x|=' + m + 'x-' + c) + ' if ' + t('x>' + rt(toR([c, m]))), t('|x+' + g + '|=-x-' + g) + ' if ' + t('x<-' + g), t('|' + k + '-x|=' + k + '-x') + ' if ' + t('x\\le ' + k)];
    var falses = [{ s: t('|' + k + '-x|=' + k + '-x') + ' if ' + t('x>' + k), why: 'For ' + t('x>' + k) + ', ' + t(k + '-x<0') + ', so ' + t('|' + k + '-x|=x-' + k) + '. (Test ' + t('x=' + (k + 1)) + ': ' + t('\\lvert -1\\rvert=1\\ne -1') + '.)' },
      { s: t('|x-' + h + '|=' + h + '-x') + ' if ' + t('x>' + h), why: 'For ' + t('x>' + h) + ', ' + t('x-' + h + '>0') + ', so the bars change nothing: ' + t('|x-' + h + '|=x-' + h) + '.' },
      { s: t('|x+' + g + '|=x+' + g) + ' if ' + t('x<-' + g), why: 'For ' + t('x<-' + g) + ', ' + t('x+' + g + '<0') + ', so ' + t('|x+' + g + '|=-x-' + g) + '.' }];
    var fz = r.pick(falses), tr = r.shuffle(trues).slice(0, 3);
    var opts = tr.map(function (s, i) { return { html: s, why: 'That one is true: test a value of ' + t('x') + ' in the interval.', code: 'u7l8-t' + i }; }).concat([{ html: fz.s, right: true }]);
    return mc(r, 'Which statement is <b>false</b>?', opts, fz.why, ['On the interval, is the expression inside the bars positive or negative? Test a value.'], 'piecewise statements');
  }
  function sameAbsMC(r) {
    var h = pickWhere(function () { return nz(r, 1, 5); }, function (x) { return x !== 1; }), n = r.int(1, 9), m = r.int(2, 5), d = r.int(1, 7);
    var opts = [{ html: t('(x' + sgT(-h) + ')^{2}'), right: true }, { html: t('x^{2}-' + n), why: 'It is negative for ' + t('-\\sqrt{' + n + '}<x<\\sqrt{' + n + '}') + ': that part is reflected.', code: 'u7l8-s1' }, { html: t('-' + (m === 1 ? '' : m) + 'x^{2}'), why: 'It is negative for every ' + t('x\\ne 0') + ': the whole graph is reflected.', code: 'u7l8-s2' }, { html: t(m + 'x+' + d), why: 'A line with a non-zero slope is below the axis on one side of its zero.', code: 'u7l8-s3' }];
    return mc(r, 'For which function is the graph of ' + ABSF + ' identical to the graph of ' + t('y=f(x)') + '?', opts, t('(x' + sgT(-h) + ')^{2}\\ge 0') + ' for every ' + t('x') + ', so nothing is below the ' + t('x') + '-axis to reflect.', ['The graphs are the same exactly when ' + t('f(x)\\ge 0') + ' everywhere.'], 'when |f| is the same as f');
  }

  /* ======================================================================================================
   * RF2 — absolute value equations
   * ====================================================================================================== */
  function twoNums(r) { // two numbers each d units from h
    var h = pickWhere(function () { return nz(r, 1, 12); }, function (x) { return x !== 2; }), d = r.int(2, 12), v1 = h - d, v2 = h + d;
    return rootsPart(CP, 'Two numbers are each ' + t(d) + ' units from ' + t(h) + ' on a number line. Write an absolute value equation and determine the numbers.', [v1, v2], { noNone: true, wrongs: [{ vals: [v2], code: CP + 'one-case', hint: 'There is a second number, ' + t(d) + ' units on the other side of ' + t(h) + ': ' + t('x' + sgT(-h) + '=-' + d) + '.' }, { vals: [-h - d, -h + d], code: CP + 'wd-a', hint: 'The distance from ' + t(h) + ' is ' + t(A('x' + sgT(-h))) + ': check the sign in the bars.' }] },
      t(A('x' + sgT(-h)) + '=' + d) + ': ' + t('x' + sgT(-h) + '=' + d) + ' or ' + t('x' + sgT(-h) + '=-' + d) + ', so ' + t('x=' + v2) + ' or ' + t('x=' + v1) + '.', ['The distance between ' + t('x') + ' and ' + t(h) + ' is ' + t(A('x' + sgT(-h))) + '.', 'Solve both cases.'], 'numbers at a given distance');
  }
  function calcTenth(r) { // |x² − bx| = k to the nearest tenth
    var z = pickWhere(function () { return { b: r.int(2, 9), k: r.int(1, 12) }; }, function (s) { var D1 = s.b * s.b + 4 * s.k, D2 = s.b * s.b - 4 * s.k; return D2 > 0 && !isSq(D1) && !isSq(D2) && !(s.b === 4 && s.k === 2) && !(s.b === 5 && s.k === 6); });
    var c1 = qroots(1, -z.b, -z.k), c2 = qroots(1, -z.b, z.k), all = c1.concat(c2).sort(function (a, b) { return a.v - b.v; });
    var tenth = all.map(function (x) { return Math.round(x.v * 10) / 10; }), keyTex = tenth.map(function (v) { return 'x=' + dt(v); }).join(',\\ ');
    var ftex = 'x^{2}-' + z.b + 'x', p = rootsPart(CP, 'Use a graphing calculator to solve ' + t(A(ftex) + '=' + z.k) + '. Give the solutions to the nearest tenth.', all, { round: 0.051, noNone: true, keyTex: keyTex, answer: t(tenth.map(function (v) { return 'x\\approx ' + dt(v); }).join(',\\ ')), wrongs: [{ vals: c1, code: CP + 'one-case', hint: 'Graph ' + t('Y_1=\\text{abs}(X^{2}-' + z.b + 'X)') + ' and ' + t('Y_2=' + z.k) + ': the line also meets the reflected hump (' + t(ftex + '=-' + z.k) + ').' }] },
      'Graph ' + t('Y_1=\\text{abs}(X^{2}-' + z.b + 'X)') + ' and ' + t('Y_2=' + z.k) + ' and use intersect at each of the four intersection points: ' + t(tenth.map(function (v) { return dt(v); }).join(',\\ ')) + '.<br>Exactly: ' + t(ftex + '-' + z.k + '=0') + ' gives ' + t('x=' + c1.map(function (x) { return x.tex; }).join(',\\ ')) + '; ' + t(ftex + '+' + z.k + '=0') + ' gives ' + t('x=' + c2.map(function (x) { return x.tex; }).join(',\\ ')) + '.',
      ['The line ' + t('y=' + z.k) + ' meets the W-shaped graph four times when it is below the top of the reflected hump.', 'Round each intersection to one decimal place.'], 'solving |f(x)| = k with a calculator');
    p.bad = [all.map(function (x) { return 'x=' + dt(Math.round(x.v * 100) / 100 + 0.3); }).join(',\\ '), c1.map(function (x) { return 'x=' + dt(Math.round(x.v * 10) / 10); }).join(',\\ ')];
    return p;
  }
  function noSolMC(r) {
    var k = r.int(2, 9);
    var opts = [{ html: 'An absolute value is a distance, so it is never negative: ' + t('|f(x)|') + ' cannot equal ' + t(-k) + '.', right: true }, { html: 'Because ' + t('f(x)') + ' is never negative.', why: t('f(x)') + ' can be negative; it is ' + t('|f(x)|') + ' that cannot be.', code: 'u7l8-n1' }, { html: 'It has the solutions where ' + t('f(x)=' + -k) + '.', why: 'If ' + t('f(x)=' + -k) + ' then ' + t('|f(x)|=' + k) + ', not ' + t(-k) + '.', code: 'u7l8-n2' }, { html: 'Because the two cases ' + t('f(x)=' + -k) + ' and ' + t('f(x)=' + k) + ' cancel out.', why: 'Cases do not cancel. Look at what an absolute value can equal.', code: 'u7l8-n3' }];
    return mc(r, 'Which statement explains why the equation ' + t('|f(x)|=' + -k) + ' has no solution?', opts, 'An absolute value is a distance from 0, never negative, so ' + t('|f(x)|') + ' cannot equal ' + t(-k) + '.', ['What values can an absolute value take?'], 'why |f(x)| = −k has no solution');
  }
  function oneSolMC(r) {
    var a = nz(r, 1, 6), opts = [{ html: t('k<0'), why: 'Then there is no solution: an absolute value is never negative.', code: 'u7l8-o1' }, { html: t('k=0'), right: true }, { html: t('k>0'), why: 'Then there are two solutions, ' + t('x' + sgT(a) + '=k') + ' or ' + t('x' + sgT(a) + '=-k') + '.', code: 'u7l8-o2' }, { html: t('k=' + Math.abs(a)), why: 'That is a positive value of ' + t('k') + ': two solutions.', code: 'u7l8-o3' }];
    if (Math.abs(a) === 1) opts[3] = { html: t('k=2'), why: 'That is a positive value of ' + t('k') + ': two solutions.', code: 'u7l8-o3' };
    return mc(r, 'The equation ' + t('|x' + sgT(a) + '|=k') + ' has exactly one solution when', opts, t('|x' + sgT(a) + '|=0') + ' only at ' + t('x=' + -a) + '. For ' + t('k>0') + ' there are two solutions; for ' + t('k<0') + ' none.', ['How many numbers are a distance ' + t('k') + ' from ' + t(-a) + '?'], 'number of solutions of |x + a| = k', true);
  }
  function countMC(r) {
    var z = pickWhere(function () { return { p: nz(r, 1, 4), q: -r.int(3, 9), kind: r.pick([4, 4, 3, 2]) }; }, function (s) { s.Q = mkV(1, s.p, s.q); return fresh(s.Q); });
    var Q = z.Q, hump = -z.q, k = z.kind === 4 ? r.int(1, hump - 1) : z.kind === 3 ? hump : hump + r.int(1, 5);
    var opts = [1, 2, 3, 4].map(function (n) { return { html: t(n), right: n === z.kind, why: 'Sketch ' + t('y=' + A(Q.tex)) + ': the reflected hump reaches ' + t('y=' + hump) + '. Count where ' + t('y=' + k) + ' meets the graph.', code: 'u7l8-c' + n }; });
    var c1 = qroots(1, Q.bv, Q.cv - k), c2 = qroots(1, Q.bv, Q.cv + k), fmt = function (rs) { return rs.length ? t('x=' + rs.map(function (x) { return x.tex; }).join(',\\ ')) : 'no real roots'; };
    return mc(r, 'The number of solutions of the equation ' + t(A(Q.tex) + '=' + k) + ' is', opts, t(Q.tex + '=' + Q.vtex) + ': the vertex ' + t(pt(z.p, z.q)) + ' reflects to ' + t(pt(z.p, hump)) + '.<br>' + t(Q.tex + '=' + k) + ': ' + fmt(c1) + '; ' + t(Q.tex + '=-' + k) + ': ' + fmt(c2) + '.<br><b>' + z.kind + '</b> solutions.', ['Solve ' + t('f(x)=' + k) + ' and ' + t('f(x)=-' + k) + ', or compare ' + t(k) + ' with the height of the reflected hump.'], 'number of solutions of |f(x)| = k', true);
  }
  function sumSol(r) { // NR: the sum of all the solutions of |x² − bx| = k
    var z = pickWhere(function () { return { b: r.int(3, 9), k: r.int(2, 20), four: r.chance(0.75) }; }, function (s) { var t2 = s.b * s.b / 4; return (s.four ? s.k < t2 : s.k > t2) && !(s.b === 5 && s.k === 6); });
    var ans = z.four ? 2 * z.b : z.b, c1 = qroots(1, -z.b, -z.k), c2 = qroots(1, -z.b, z.k), ft = 'x^{2}-' + z.b + 'x';
    return KP.nr('The sum of all the solutions of ' + t(A(ft) + '=' + z.k) + ' is ____.', ans, function (v) { if (z.four && v === z.b) return { code: CP + 'sum-one', hint: 'Solve the second case too: ' + t(ft + '=-' + z.k) + ' has real solutions.' }; if (!z.four && v === 2 * z.b) return { code: CP + 'sum-one', hint: 'Check the second case: ' + t(ft + '+' + z.k + '=0') + ' has a negative discriminant, so no real solutions.' }; return null; },
      t(ft + '-' + z.k + '=0') + ': ' + t('x=' + c1.map(function (x) { return x.tex; }).join(',\\ ')) + '; ' + t(ft + '+' + z.k + '=0') + ': ' + (c2.length ? t('x=' + c2.map(function (x) { return x.tex; }).join(',\\ ')) : 'no real roots (' + t('b^{2}-4ac=' + (z.b * z.b - 4 * z.k) + '<0') + ')') + '.<br>Sum: ' + t(ans) + (z.four ? ' (each case has two roots adding to ' + t(z.b) + ').' : '.'),
      ['Solve both cases; each quadratic ' + t('x^{2}-' + z.b + 'x+c=0') + ' with real roots has roots adding to ' + t(z.b) + '.'], 'sum of the solutions of |f(x)| = k');
  }
  function oneHund(r) { // NR: |x − a| = 2x + b has one solution, to the nearest hundredth
    var z = pickWhere(function () { return { a: r.int(-6, 9), b: r.int(-6, 8) }; }, function (s) { var x2 = (s.a - s.b) / 3; return 2 * s.a + s.b > 0 && (s.a - s.b) % 3 !== 0 && x2 > 0 && x2 < 10 && !(s.a === 5 && s.b === 1) && s.a !== 0 && s.b !== 0; });
    var x1 = -z.a - z.b, x2 = (z.a - z.b) / 3, inner = 'x' + sgT(-z.a), rhs = '2x' + sgT(z.b);
    var p = KP.approx('The equation ' + t(A(inner) + '=' + rhs) + ' has one solution. To the nearest hundredth, it is ____.', x2, 2, { nr: true },
      t(inner + '=' + rhs) + ': ' + t('x=' + x1) + ', but then ' + t(rhs + '=' + (2 * x1 + z.b) + '<0') + ' (extraneous).<br>' + t(inner + '=-(' + rhs + ')') + ': ' + t('3x=' + (z.a - z.b)) + ', ' + t('x=' + rt(toR(x2)) + '\\approx ' + x2.toFixed(2)) + '. Check: ' + t(A(rt(toR(x2 - z.a))) + '=' + rt(toR(Math.abs(x2 - z.a))) + '=2\\left(' + rt(toR(x2)) + '\\right)' + sgT(z.b)) + ' ✓',
      ['Solve both cases, then check: the right side must not be negative.'], 'solving |x − a| = 2x + b');
    p.bad = [x2.toFixed(1), (x2 + 0.01).toFixed(2)].filter(function (b) { return Math.abs(Number(b) - Math.round(x2 * 100) / 100) > 1e-9; });
    return p;
  }
  function prodHund(r) { // NR: the product of the two positive solutions of |x² − n| = k
    var z = pickWhere(function () { return { n: r.int(3, 10), k: r.int(1, 9) }; }, function (s) { return s.n > s.k && !isSq(s.n * s.n - s.k * s.k) && Math.sqrt(s.n * s.n - s.k * s.k) < 9.99 && !(s.n === 7 && s.k === 2); });
    var v = Math.sqrt(z.n * z.n - z.k * z.k), u1 = Math.sqrt(z.n + z.k), u2 = Math.sqrt(z.n - z.k);
    return KP.approx('The product of the two positive solutions of ' + t(A('x^{2}-' + z.n) + '=' + z.k) + ', to the nearest hundredth, is ____.', v, 2, { nr: true, diag: function (w) { if (Math.abs(w - u1 * u1 * u2 * u2) < 0.006 || Math.abs(w - (z.n * z.n - z.k * z.k)) < 0.006) return { code: CP + 'prod-all', hint: 'Multiply the two positive <b>solutions</b> ' + t('\\sqrt{' + (z.n + z.k) + '}') + ' and ' + t('\\sqrt{' + (z.n - z.k) + '}') + ', not their squares.' }; return null; } },
      t('x^{2}-' + z.n + '=' + z.k) + ': ' + t('x=\\pm\\sqrt{' + (z.n + z.k) + '}') + '; ' + t('x^{2}-' + z.n + '=-' + z.k) + ': ' + t('x=\\pm\\sqrt{' + (z.n - z.k) + '}') + '.<br>Positive solutions ' + t('\\sqrt{' + (z.n + z.k) + '}') + ' and ' + t('\\sqrt{' + (z.n - z.k) + '}') + ': product ' + t('\\sqrt{' + (z.n * z.n - z.k * z.k) + '}\\approx ' + v.toFixed(2)) + '.',
      ['Solve both cases: ' + t('x^{2}=' + z.n + '\\pm ' + z.k) + '.'], 'product of solutions of |x² − n| = k');
  }
  function sumLin(r) { // NR: the sum of the solutions of |3x − b| = x + c
    var z = pickWhere(function () { return { b: r.int(1, 12), c: r.int(-4, 10) }; }, function (s) { var x1 = (s.b + s.c) / 2, x2 = (s.b - s.c) / 4; s.x1 = x1; s.x2 = x2; s.sum = x1 + x2; return x1 + s.c >= 0 && x2 + s.c >= 0 && Math.abs(x1 - x2) > 1e-9 && s.sum > 0 && String(+s.sum.toFixed(4)).length <= 4 && !(s.b === 4 && s.c === 6) && s.c !== 0; });
    var inner = '3x-' + z.b, rhs = 'x' + sgT(z.c);
    return KP.nr('The sum of the solutions of ' + t(A(inner) + '=' + rhs) + ' is ____.', z.sum, function (v) { if (Math.abs(v - z.x1) < 1e-9) return { code: CP + 'one-case', hint: 'There is a second solution: ' + t(inner + '=-(' + rhs + ')') + '.' }; return null; },
      t(inner + '=' + rhs) + ': ' + t('x=' + dt(z.x1)) + ' ✓. ' + t(inner + '=-(' + rhs + ')') + ': ' + t('4x=' + (z.b - z.c)) + ', ' + t('x=' + dt(z.x2)) + ' ✓ (the right side is ' + t(dt(z.x2 + z.c)) + ', not negative).<br>Sum: ' + t(dt(z.sum)) + '.',
      ['Solve both cases and check each in the original equation.'], 'sum of the solutions of |ax − b| = x + c');
  }
  function tolerance(r) {
    var ctx = r.pick([{ w: 'A mill cuts boards to a length of', u: 'm', L: r.pick([2.4, 3.6, 1.8, 3.0]), d: r.pick([0.015, 0.02, 0.025, 0.012]), thing: 'board', q: 'length' }, { w: 'A machine fills bags of flour to a mass of', u: 'kg', L: r.pick([2.5, 5, 10]), d: r.pick([0.05, 0.04, 0.08]), thing: 'bag', q: 'mass' }, { w: 'A factory makes bolts with a diameter of', u: 'mm', L: r.pick([12, 8, 16]), d: r.pick([0.2, 0.15, 0.3]), thing: 'bolt', q: 'diameter' }]);
    if (ctx.L === 2.4 && ctx.d === 0.015) ctx.d = 0.02;
    var lo = +(ctx.L - ctx.d).toFixed(4), hi = +(ctx.L + ctx.d).toFixed(4), V = ctx.q.charAt(0).toUpperCase();
    var f1 = { f: { label: 'Least acceptable ' + ctx.q + ' (' + ctx.u + ')', name: 'least', mode: 'math', keys: 'fraction' }, c: K.value(lo, { diag: function (v) { if (Math.abs(v - ctx.d) < 1e-9) return { code: CP + 'tol-d', hint: 'That is the allowed difference. The ' + ctx.q + ' itself is ' + t(dt(ctx.L) + '\\pm ' + dt(ctx.d)) + '.' }; if (Math.abs(v - (ctx.L - 2 * ctx.d)) < 1e-9) return { code: CP + 'tol-2d', hint: 'Each limit is ' + t(dt(ctx.d)) + ' from ' + t(dt(ctx.L)) + '.' }; return null; } }), k: dt(lo), a: dt(lo) + ' ' + ctx.u, bad: [dt(ctx.d)] };
    var f2 = { f: { label: 'Greatest acceptable ' + ctx.q + ' (' + ctx.u + ')', name: 'greatest', mode: 'math', keys: 'fraction' }, c: K.value(hi, { diag: function (v) { if (Math.abs(v - (ctx.L + 2 * ctx.d)) < 1e-9) return { code: CP + 'tol-2d', hint: 'Each limit is ' + t(dt(ctx.d)) + ' from ' + t(dt(ctx.L)) + '.' }; return null; } }), k: dt(hi), a: dt(hi) + ' ' + ctx.u, bad: [dt(ctx.L + 2 * ctx.d)] };
    return combo(ctx.w + ' ' + t(dt(ctx.L)) + ' ' + ctx.u + '. A ' + ctx.thing + ' is rejected if its ' + ctx.q + ' differs from ' + t(dt(ctx.L)) + ' ' + ctx.u + ' by more than ' + t(dt(ctx.d)) + ' ' + ctx.u + '. Solve the absolute value equation ' + t('|' + V + '-' + dt(ctx.L) + '|=' + dt(ctx.d)) + ' for the least and the greatest acceptable ' + ctx.q + '.', [f1, f2], ['The acceptable values are at most ' + t(dt(ctx.d)) + ' from ' + t(dt(ctx.L)) + ': solve ' + t(V + '-' + dt(ctx.L) + '=\\pm ' + dt(ctx.d)) + '.'], 'an absolute value equation in context', null,
      t('|' + V + '-' + dt(ctx.L) + '|=' + dt(ctx.d)) + ': ' + t(V + '-' + dt(ctx.L) + '=' + dt(ctx.d)) + ' or ' + t(V + '-' + dt(ctx.L) + '=-' + dt(ctx.d)) + '.<br>Least ' + t(dt(lo)) + ' ' + ctx.u + ', greatest ' + t(dt(hi)) + ' ' + ctx.u + '.');
  }
  function errorMC(r) {
    var z = pickWhere(function () { return { a: r.int(1, 6), m: r.pick([2, 3]), b: r.int(3, 9) }; }, function (s) { s.x1 = (s.a + s.b) / (s.m - 1); s.x2 = (s.b - s.a) / (s.m + 1); return Number.isInteger(s.x1) && Number.isInteger(s.x2) && s.m * s.x2 - s.b < 0 && s.m * s.x1 - s.b > 0 && s.x1 !== s.x2 && !(s.a === 2 && s.m === 2 && s.b === 5); });
    var inner = 'x+' + z.a, rhs = z.m + 'x-' + z.b, nm = r.pick(['A student', 'Jordan', 'Mei', 'Ravi']);
    var opts = [{ html: t('x=' + z.x2) + ' is extraneous: ' + t(A(z.x2 + '+' + z.a) + '=' + (z.x2 + z.a)) + ' but ' + t(z.m + '(' + z.x2 + ')-' + z.b + '=' + (z.m * z.x2 - z.b)) + '. The only solution is ' + t('x=' + z.x1) + '.', right: true },
      { html: t('x=' + z.x1) + ' is extraneous; the only solution is ' + t('x=' + z.x2) + '.', why: 'Check ' + t('x=' + z.x1) + ': both sides equal ' + t(z.x1 + z.a) + '.', code: 'u7l8-x1' },
      { html: 'There is no error: both solutions check.', why: 'Check ' + t('x=' + z.x2) + ' in the original equation: the right side is negative.', code: 'u7l8-x2' },
      { html: 'Both are extraneous: there is no solution.', why: 'Check ' + t('x=' + z.x1) + ': it makes both sides equal.', code: 'u7l8-x3' }];
    return mc(r, nm + ' solved ' + t(A(inner) + '=' + rhs) + ' and gave the solutions ' + t('x=' + z.x1) + ' and ' + t('x=' + z.x2) + '. Which statement is correct?', opts,
      'Check each: ' + t('x=' + z.x1) + ': ' + t(A(z.x1 + '+' + z.a) + '=' + (z.x1 + z.a)) + ' and ' + t(z.m + '(' + z.x1 + ')-' + z.b + '=' + (z.m * z.x1 - z.b)) + ' ✓. ' + t('x=' + z.x2) + ': ' + t(A(z.x2 + '+' + z.a) + '=' + (z.x2 + z.a)) + ' but the right side is ' + t(z.m * z.x2 - z.b) + ': an absolute value cannot equal a negative number. The only solution is ' + t('x=' + z.x1) + '.', ['Verify each answer in the original equation.'], 'extraneous solutions');
  }
  function solvedMC(r, o) { // 8 − |x + 1| = 3 and |2x + 3| = −1 (Extra 6–7)
    if (o === 'none') {
      var m = r.int(2, 5), n = nz(r, 1, 7), k = r.int(1, 6), w1 = toR([-k - n, m]), w2 = toR([k - n, m]);
      var opts = [{ html: 'no solution', right: true }, { html: 'the solution ' + t('x=' + rt(w1)), why: 'An absolute value is never negative.', code: 'u7l8-a1' }, { html: 'the solutions ' + t('x=' + rt(w1)) + ' and ' + t('x=' + rt(w2)), why: 'Those would solve ' + t(A(tx(lin(m, n))) + '=' + k) + '. An absolute value is never negative.', code: 'u7l8-a2' }, { html: 'the solution ' + t('x=' + rt(w2)), why: 'An absolute value is never negative.', code: 'u7l8-a3' }];
      return mc(r, 'The equation ' + t(A(tx(lin(m, n))) + '=' + -k) + ' has', opts, 'An absolute value is never negative, so there is no solution.', ['What values can an absolute value take?'], 'an absolute value equal to a negative number');
    }
    var z = pickWhere(function () { return { K: r.int(5, 15), a: nz(r, 1, 6), m: r.int(1, 12) }; }, function (s) { return s.K > s.m && !(s.K === 8 && s.a === 1 && s.m === 3); });
    var d = z.K - z.m, s1 = d - z.a, s2 = -d - z.a;
    var opts2 = [{ html: t('x=' + s1) + ' or ' + t('x=' + s2), right: true }, { html: t('x=' + s1) + ' only', why: 'There is a second case: ' + t('x' + sgT(z.a) + '=-' + d) + '.', code: 'u7l8-b1' }, { html: t('x=' + -s1) + ' or ' + t('x=' + -s2), why: 'Solve ' + t('x' + sgT(z.a) + '=\\pm ' + d) + ' carefully: subtract ' + t(z.a) + '.', code: 'u7l8-b2' }, { html: 'no solution', why: 'Isolate first: ' + t(A('x' + sgT(z.a)) + '=' + d) + ', a positive number.', code: 'u7l8-b3' }];
    return mc(r, 'The complete solution of ' + t(z.K + '-' + A('x' + sgT(z.a)) + '=' + z.m) + ' is', opts2, t(A('x' + sgT(z.a)) + '=' + d) + ', so ' + t('x' + sgT(z.a) + '=' + d) + ' or ' + t('x' + sgT(z.a) + '=-' + d) + ': ' + t('x=' + s1) + ' or ' + t('x=' + s2) + '.', ['Isolate the absolute value first.'], 'solving after isolating');
  }

  /* ======================================================================================================
   * RF11 — reciprocal functions
   * ====================================================================================================== */
  function recEqMC(r) {
    var m = r.pick([1, -1, 2, -2, 3]), b = nz(r, 1, 8), f = linT(m, b, m < 0), opts = [{ html: t('y=\\dfrac{1}{' + f + '}'), right: true }, { html: t('y=' + linT(-m, -b, -m < 0)), why: 'That is the opposite (a reflection), not the reciprocal.', code: 'u7l8-l1' }, { html: t('y=\\dfrac{1}{' + (m === 1 ? '' : m === -1 ? '-' : m) + 'x}' + sgT(b)), why: 'The reciprocal of the <b>whole</b> expression: ' + t('\\frac{1}{' + f + '}') + '.', code: 'u7l8-l2' }, { html: t('y=' + f + '-1'), why: 'The reciprocal is ' + t('\\frac{1}{f(x)}') + '.', code: 'u7l8-l3' }];
    return mc(r, 'The equation of the reciprocal of ' + t('f(x)=' + f) + ' is', opts, t('y=\\frac{1}{f(x)}=\\frac{1}{' + f + '}') + '.', ['The reciprocal of ' + t('a') + ' is ' + t('\\frac{1}{a}') + '.'], 'equation of the reciprocal function');
  }
  function recLinDR(r) {
    var z = pickWhere(function () { return { m: r.pick([1, -1, 2, -2, 3, -3, 4, [1, 2]]), b: nz(r, 1, 9) }; }, function (s) { s.h = -s.b / rv(toR(s.m)); return toR(s.h)[1] <= 4 && !(rv(toR(s.m)) === -1 && s.b === 3) && !(rv(toR(s.m)) === 2 && s.b === -4); });
    var f = linT(toR(z.m), z.b, rv(toR(z.m)) < 0), h = toR(z.h), Q = { zs: [{ v: rv(h), tex: rt(h) }], zv: [rv(h)], p: NaN };
    var dom = { f: { label: 'Domain', mode: 'math', keys: 'set', vars: ['x'] }, c: U.domChk(CP, Q), k: S('x', 'x\\ne ' + rt(h)), a: 'domain ' + t(S('x', 'x\\ne ' + rt(h))), bad: ['\\{x\\mid x\\in\\mathbb{R}\\}', S('x', 'x\\ne ' + rt(rneg(h)))] };
    var rgT = S('y', 'y\\ne 0'), rg = { f: { label: 'Range', mode: 'math', keys: 'set', vars: ['y'] }, c: K.set(rgT, { v: 'y', wrong: [{ is: '\\{y\\mid y\\in\\mathbb{R}\\}', code: CP + 'rr-f', hint: 'That is the range of the line. The reciprocal is never 0.' }, { is: S('y', 'y\\ne ' + rt(h)), code: CP + 'asy-xy', hint: 'The value left out of the range is ' + t('y=0') + ' (the horizontal asymptote).' }] }), k: rgT, a: 'range ' + t(rgT), bad: ['\\{y\\mid y\\in\\mathbb{R}\\}'] };
    return combo('State the domain and range of ' + t('y=\\dfrac{1}{' + f + '}') + '.', [dom, rg], ['The domain leaves out the zero of the denominator; the range leaves out ' + t('y=0') + ' (the horizontal asymptote).'], 'domain and range of y = 1/(ax + b)', null,
      'Domain: every real number except the zero of ' + t(f) + ': ' + t(S('x', 'x\\ne ' + rt(h))) + '. Range: a reciprocal is never 0, and it takes every other value: ' + t(rgT) + '.');
  }
  function rneg(x) { var f = toR(x); return [-f[0], f[1]]; }
  function crossMC(r) {
    var opts = [{ html: 'A fraction with numerator 1 is never 0, so ' + t('\\frac{1}{f(x)}\\ne 0') + ': the graph has no ' + t('x') + '-intercepts (' + t('y=0') + ' is its horizontal asymptote).', right: true }, { html: t('f(x)') + ' is never 0.', why: t('f') + ' can have zeros; there the reciprocal has vertical asymptotes. The reason is about the reciprocal itself.', code: 'u7l8-x5' }, { html: 'The graph has vertical asymptotes.', why: 'Vertical asymptotes say nothing about crossing the ' + t('x') + '-axis (some reciprocal graphs have none).', code: 'u7l8-x6' }, { html: 'The reciprocal of a negative number is positive.', why: 'A reciprocal keeps the sign: ' + t('\\frac{1}{-2}=-\\frac{1}{2}') + '.', code: 'u7l8-x7' }];
    return mc(r, 'Which statement explains why the graph of ' + REC + ' can never cross the ' + t('x') + '-axis?', opts, 'For a point on the ' + t('x') + '-axis we would need ' + t('\\frac{1}{f(x)}=0') + ', but a fraction with numerator 1 is never 0. ' + t('y=0') + ' is the horizontal asymptote.', ['Can ' + t('\\frac{1}{a}') + ' ever be 0?'], 'why the reciprocal never meets the x-axis');
  }
  function absRecMC(r) {
    var x = nz(r, 1, 8), y = r.pick([-0.5, -0.25, -0.2, -2, -4, -0.125]), w = 1 / y;
    var opts = [{ html: t('(' + x + ',\\ ' + dt(-w) + ')'), right: true }, { html: t('(' + x + ',\\ ' + dt(w) + ')'), why: 'That is on ' + REC + '. The bars make it positive.', code: 'u7l8-m1' }, { html: t('(' + -x + ',\\ ' + dt(-w) + ')'), why: 'The ' + t('x') + '-value does not change.', code: 'u7l8-m2' }, { html: t('(' + x + ',\\ ' + dt(-y) + ')'), why: 'That is on ' + t('y=|f(x)|') + '. Take the reciprocal too.', code: 'u7l8-m3' }];
    return mc(r, 'The point ' + t('(' + x + ',\\ ' + dt(y) + ')') + ' is on the graph of ' + t('y=f(x)') + '. Which point must be on the graph of ' + t('y=\\left\\lvert\\dfrac{1}{f(x)}\\right\\rvert') + '?', opts, t('\\frac{1}{' + dt(y) + '}=' + dt(w)) + ', and ' + t(A(dt(w)) + '=' + dt(-w)) + ': ' + t('(' + x + ',\\ ' + dt(-w) + ')') + '.', ['Take the reciprocal of the ' + t('y') + '-value, then its absolute value.'], 'a point on y = |1/f(x)|');
  }
  function sqVAMC(r) {
    var h = pickWhere(function () { return nz(r, 1, 6); }, function (x) { return x !== 1; }), F = mkQ(1, -2 * h, h * h);
    var opts = [{ html: 'two vertical asymptotes, ' + t('x=' + h) + ' and ' + t('x=' + -h), why: t(F.tex + '=(x' + sgT(-h) + ')^{2}') + ' has only one zero.', code: 'u7l8-v1' }, { html: 'one vertical asymptote, ' + t('x=' + h), right: true }, { html: 'one vertical asymptote, ' + t('x=' + -h), why: 'Solve ' + t('(x' + sgT(-h) + ')^{2}=0') + ' again.', code: 'u7l8-v2' }, { html: 'no vertical asymptotes', why: 'The quadratic is 0 at ' + t('x=' + h) + '.', code: 'u7l8-v3' }];
    return mc(r, 'The graph of ' + t('y=\\dfrac{1}{' + F.tex + '}') + ' has', opts, t(F.tex + '=(x' + sgT(-h) + ')^{2}') + ' has one zero, ' + t('x=' + h) + ': one vertical asymptote.', ['Factor the denominator.'], 'vertical asymptotes for a perfect square', true);
  }
  function vaPmMC(r) {
    var n = pickWhere(function () { return r.int(2, 9); }, function (x) { return x !== 3; });
    var opts = [{ html: t('x=' + n) + ' only', why: t('(-' + n + ')^{2}=' + n * n) + ' too.', code: 'u7l8-w1' }, { html: t('x=-' + n) + ' and ' + t('x=' + n), right: true }, { html: t('x=' + n * n), why: 'Solve ' + t('x^{2}-' + n * n + '=0') + ': ' + t('x^{2}=' + n * n) + '.', code: 'u7l8-w2' }, { html: t('x=-' + n * n) + ' and ' + t('x=' + n * n), why: 'Take the square root: ' + t('x=\\pm ' + n) + '.', code: 'u7l8-w3' }];
    return mc(r, 'The vertical asymptotes of the graph of ' + t('y=\\dfrac{1}{x^{2}-' + n * n + '}') + ' are', opts, t('x^{2}-' + n * n + '=0') + ' at ' + t('x=\\pm ' + n) + '.', ['Vertical asymptotes are at the zeros of the denominator.'], 'vertical asymptotes of 1/(x² − n²)', true);
  }
  function turnMC(r) {
    var p = pickWhere(function () { return nz(r, 1, 5); }, function (x) { return x !== 2; }), q = r.pick([2, 3, 5, 6, 8, 10]);
    var opts = [{ html: 'a maximum point at ' + t('\\left(' + p + ',\\ \\frac{1}{' + q + '}\\right)'), right: true }, { html: 'a minimum point at ' + t('\\left(' + p + ',\\ \\frac{1}{' + q + '}\\right)'), why: 'The parabola’s minimum gives the reciprocal’s <b>largest</b> value.', code: 'u7l8-y1' }, { html: 'a maximum point at ' + t(pt(p, q)), why: 'Take the reciprocal of the vertex value: ' + t('\\frac{1}{' + q + '}') + '.', code: 'u7l8-y2' }, { html: 'a minimum point at ' + t('\\left(' + -p + ',\\ \\frac{1}{' + q + '}\\right)'), why: 'The turning point keeps the vertex’s ' + t('x') + '-value, and the type switches.', code: 'u7l8-y3' }];
    return mc(r, 'The graph of ' + t('y=\\dfrac{1}{(x' + sgT(-p) + ')^{2}+' + q + '}') + ' has', opts, 'The minimum ' + t(q) + ' of the parabola (at ' + t('x=' + p) + ') gives the largest reciprocal, ' + t('\\frac{1}{' + q + '}') + ': a maximum point.', HINT_TP, 'turning point of y = 1/f(x)');
  }
  function recPtMC(r) {
    var x = nz(r, 1, 8), d = r.pick([0.25, 0.5, 0.2, -0.25, -0.5, 0.125]), w = 1 / d;
    if (x === -2 && d === 0.25) x = 3;
    var opts = [{ html: t('(' + x + ',\\ ' + dt(w) + ')'), right: true }, { html: t('(' + x + ',\\ ' + dt(-w) + ')'), why: 'A reciprocal keeps the sign.', code: 'u7l8-z1' }, { html: t('(' + -x + ',\\ ' + dt(w) + ')'), why: 'The ' + t('x') + '-value does not change.', code: 'u7l8-z2' }, { html: t('(' + x + ',\\ ' + dt(-d) + ')'), why: 'Take the reciprocal of the ' + t('y') + '-value.', code: 'u7l8-z3' }];
    return mc(r, 'The point ' + t('(' + x + ',\\ ' + dt(d) + ')') + ' is on the graph of ' + REC + '. Which point must be on the graph of ' + t('y=f(x)') + '?', opts, t('f(' + x + ')=\\frac{1}{' + dt(d) + '}=' + dt(w)) + '.', ['The conversion works both ways: ' + t('(x,\\ k)') + ' matches ' + t('\\left(x,\\ \\frac{1}{k}\\right)') + '.'], 'matching points');
  }
  function bothMC(r) {
    var a = nz(r, 1, 6), b = pickWhere(function () { return nz(r, 1, 6); }, function (x) { return x !== a; }), c = pickWhere(function () { return nz(r, 1, 6); }, function (x) { return x !== a && x !== b; }), d = pickWhere(function () { return nz(r, 1, 6); }, function (x) { return x !== a && x !== b && x !== c; }), k = r.pick([2, 3, 4]);
    var opts = [{ html: t(pt(a, -1)), why: t('\\frac{1}{-1}=-1') + ', so it is on the reciprocal, but on ' + ABSF + ' it becomes ' + t(pt(a, 1)) + '.', code: 'u7l8-k1' }, { html: t(pt(b, 1)), right: true }, { html: t(pt(c, 0)), why: 'It is on ' + ABSF + ', but ' + t('\\frac{1}{0}') + ' is undefined.', code: 'u7l8-k2' }, { html: t(pt(d, k)), why: 'It is on ' + ABSF + ', but the reciprocal has ' + t('y=\\frac{1}{' + k + '}') + ' there.', code: 'u7l8-k3' }];
    return mc(r, 'The points below are on the graph of ' + t('y=f(x)') + '. Which one must also be on both ' + ABSF + ' and ' + REC + '?', opts, t(pt(b, 1)) + ': ' + t('|1|=1') + ' and ' + t('\\frac{1}{1}=1') + '.', ['A point stays on ' + ABSF + ' when ' + t('y\\ge 0') + ', and on ' + REC + ' when ' + t('y=\\pm 1') + '.'], 'points on both |f| and 1/f');
  }
  function signDirMC(r) {
    var neg = r.chance(0.6), inc = r.chance(0.6), a = r.int(-3, 3), b = a + r.int(2, 5);
    var absInc = neg ? !inc : inc, recInc = !inc;
    var lab = function (ai, ri) { return ai === ri ? t('y=|f(x)|') + ' and ' + REC + ' are both ' + (ai ? 'increasing' : 'decreasing') : t('y=|f(x)|') + ' is ' + (ai ? 'increasing' : 'decreasing') + ' and ' + REC + ' is ' + (ri ? 'increasing' : 'decreasing'); };
    var combos = [[false, false], [true, false], [false, true], [true, true]];
    var opts = combos.map(function (c, i) { var right = c[0] === absInc && c[1] === recInc; return { html: lab(c[0], c[1]), right: right, why: right ? null : (c[0] !== absInc ? (neg ? 'Where ' + t('f') + ' is negative, ' + t('|f(x)|=-f(x)') + ': the reflection reverses the direction.' : 'Where ' + t('f') + ' is positive, ' + t('|f(x)|=f(x)') + ': nothing changes.') : 'Where ' + t('f') + ' ' + (inc ? 'increases' : 'decreases') + ', ' + t('\\frac{1}{f}') + ' ' + (inc ? 'decreases' : 'increases') + '.'), code: 'u7l8-d' + i }; });
    return mc(r, 'A function ' + t('f') + ' is ' + (neg ? 'negative' : 'positive') + ' and ' + (inc ? 'increasing' : 'decreasing') + ' on the interval ' + t(a + '<x<' + b) + '. On this interval,', opts,
      (neg ? t('|f(x)|=-f(x)') + ' there, the reflection of ' + (inc ? 'an increasing' : 'a decreasing') + ' graph, so it ' + (absInc ? 'increases' : 'decreases') : t('|f(x)|=f(x)') + ' there, so it also ' + (absInc ? 'increases' : 'decreases')) + '. Where ' + t('f') + ' ' + (inc ? 'increases' : 'decreases') + ', ' + t('\\frac{1}{f}') + ' ' + (recInc ? 'increases' : 'decreases') + '.', ['A reflection in the ' + t('x') + '-axis reverses increasing and decreasing.', 'Larger values have smaller reciprocals (on one side of the axis).'], 'increasing and decreasing for |f| and 1/f', true);
  }
  function turnDec(r, o) { // f general form from a maximum point (p, 0.2) and the y-intercept 1/c (Q11)
    var z = turnYSpec(r, { as: [1, 2, 3, [1, 2]], qs: [2, 4, 5, 10] }), kT = dt(1 / z.q), cT = rt(toR(1 / z.c));
    var wr = backWrongs(CP, z.T, toR(1 / z.q), 'the ' + t('y') + '-intercept, ' + t('f(0)=' + z.c), [0, z.c]);
    var p = KP.poly('The graph of ' + REC + ', where ' + t('f') + ' is a quadratic function, has a maximum point ' + t('(' + z.p + ',\\ ' + kT + ')') + ' and a ' + t('y') + '-intercept of ' + t(cT) + '. Determine ' + t('f(x)') + ' in general form.', z.T.poly, { wrong: wr }, turnYSol(z, kT, cT), HINT_BACK, 'a quadratic f from its reciprocal', { before: 'f(x)=' });
    return U.withBad(p, wr);
  }
  function kMaxNR(r) { // 1/(x² − 2hx + k) with a maximum point (h, −0.2): k
    var z = pickWhere(function () { return { h: nz(r, 1, 6), q: r.pick([-5, -4, -2, -10]) }; }, function (s) { s.k = s.h * s.h + s.q; return s.k > 0 && !(s.h === 3 && s.q === -5); });
    return KP.nr('The graph of ' + t('y=\\dfrac{1}{x^{2}' + sgT(-2 * z.h) + 'x+k}') + ' has a maximum point ' + t('(' + z.h + ',\\ ' + dt(1 / z.q) + ')') + '. The value of ' + t('k') + ' is ____.', z.k, function (v) { if (v === z.h * z.h - z.q) return { code: CP + 'k-sign', hint: t('\\frac{1}{k-' + z.h * z.h + '}=' + dt(1 / z.q)) + ' gives ' + t('k-' + z.h * z.h + '=' + z.q) + '.' }; return null; },
      t('x^{2}' + sgT(-2 * z.h) + 'x+k=(x' + sgT(-z.h) + ')^{2}+k-' + z.h * z.h) + '. The turning point is ' + t('\\left(' + z.h + ',\\ \\frac{1}{k-' + z.h * z.h + '}\\right)') + ': ' + t('\\frac{1}{k-' + z.h * z.h + '}=' + dt(1 / z.q)) + ', so ' + t('k-' + z.h * z.h + '=' + z.q) + ' and ' + t('k=' + z.k) + '.',
      ['Complete the square; the turning point’s ' + t('y') + '-value is the reciprocal of the vertex value.'], 'k from the turning point of the reciprocal');
  }
  function invNR(r) { // smallest positive x-coordinate of an invariant point, to the hundredth
    var z = pickWhere(function () { return { h: nz(r, 1, 4), c: r.int(-12, 6) }; }, function (s) { s.Q = mkQ(1, -2 * s.h, s.c); var xs = zerosOf(1, -2 * s.h, s.c - 1).concat(zerosOf(1, -2 * s.h, s.c + 1)).map(function (x) { return x.v; }).filter(function (v) { return v > 1e-9; }); s.xs = xs; if (!xs.length) return false; s.min = Math.min.apply(null, xs); return s.min < 10 && Math.abs(s.min * 100 - Math.round(s.min * 100)) > 1e-6 && fresh(s.Q) && !(s.h === 1 && s.c === -7); });
    var Q = z.Q, D = U.invData(CP, Q), others = z.xs.filter(function (v) { return Math.abs(v - z.min) > 1e-9; });
    var p = KP.approx('Let ' + t('f(x)=' + Q.tex) + '. To the nearest hundredth, the smallest positive ' + t('x') + '-coordinate of an invariant point of the graphs of ' + t('y=f(x)') + ' and ' + REC + ' is ____.', z.min, 2, { nr: true, diag: function (v) { for (var i = 0; i < others.length; i++) if (Math.abs(v - others[i]) < 0.006) return { code: CP + 'value', hint: 'That is an invariant point, but not the smallest positive one.' }; return null; } },
      D.sol + '<br>Positive ' + t('x') + '-coordinates: ' + t(z.xs.map(function (v) { return v.toFixed(2); }).join(',\\ ')) + '; the smallest is ' + t(z.min.toFixed(2)) + '.', ['Invariant points are where ' + t('f(x)=1') + ' or ' + t('f(x)=-1') + '. Solve both with the quadratic formula.'], 'invariant points to the hundredth');
    p.bad = others.filter(function (v) { return v < 99; }).map(function (v) { return v.toFixed(2); });
    return p;
  }
  function yAtNR(r) { // VAs, a maximum point, the reciprocal's value at x0 to the tenth (Q26)
    var z = pickWhere(function () { return { r1: r.int(-5, 2), m: r.pick([1, 2, 3]), k: r.pick([-0.5, -0.25, -0.2, -0.125, -1]), dx: r.pick([1, 2, 3]) }; }, function (s) { s.s1 = s.r1 + 2 * s.m; s.p = s.r1 + s.m; s.q = 1 / s.k; s.a = -s.q / (s.m * s.m); s.T = mkV(s.a, s.p, s.q); s.x0 = s.s1 + s.dx; s.y = 1 / s.T.f(s.x0); return s.s1 <= 6 && s.x0 <= 8 && toR(s.a) && toR(s.a)[1] <= 9 && Math.abs(s.y) >= 0.05 && Math.abs(s.y) < 99 && !(s.r1 === 0 && s.s1 === 4 && s.k === -0.5); });
    var fx = z.T.f(z.x0);
    return KP.approx('The graph of ' + REC + ', where ' + t('f') + ' is quadratic, has the vertical asymptotes ' + t('x=' + z.r1) + ' and ' + t('x=' + z.s1) + ' and a maximum point ' + t('(' + z.p + ',\\ ' + dt(z.k) + ')') + '. To the nearest tenth, the ' + t('y') + '-coordinate of the point on this graph where ' + t('x=' + z.x0) + ' is ____.', z.y, 1, { nr: true, diag: function (v) { if (Math.abs(v - fx) < 0.051) return { code: CP + 'f-val', hint: 'That is ' + t('f(' + z.x0 + ')') + '. The point is on the reciprocal graph: take its reciprocal.' }; return null; } },
      'Vertex of ' + t('f') + ': ' + t('\\left(' + z.p + ',\\ \\frac{1}{' + dt(z.k) + '}\\right)=' + pt(z.p, z.q)) + '; ' + t('f(x)=a(x' + sgT(-z.p) + ')^{2}' + sgT(z.q)) + ' with ' + t('f(' + z.s1 + ')=0') + ': ' + t(z.m * z.m + 'a' + sgT(z.q) + '=0') + ', ' + t('a=' + rt(toR(z.a))) + '.<br>' + t('f(' + z.x0 + ')=' + rt(toR(z.a)) + '(' + (z.x0 - z.p) + ')^{2}' + sgT(z.q) + '=' + rt(toR(fx))) + ', so ' + t('\\frac{1}{f(' + z.x0 + ')}\\approx ' + z.y.toFixed(1)) + '.',
      HINT_BACK, 'a value of the reciprocal from its features');
  }
  /* the f, |f| and 1/f table for f(x) = x² − n² (Q12) */
  function q12Shared(r) { var n = pickWhere(function () { return r.int(2, 8); }, function (x) { return x !== 3; }); return { n: n, Q: mkQ(1, 0, -n * n) }; }
  function q12a(r, s) {
    var n2 = s.n * s.n, R = '\\{x\\mid x\\in\\mathbb{R}\\}', dc = K.set(R, { v: 'x' });
    var rf = S('y', 'y\\ge -' + n2), ra = S('y', 'y\\ge 0');
    var f1 = { f: { label: 'Domain of ' + t('y=f(x)'), name: 'domain of f', mode: 'math', keys: 'set', vars: ['x'] }, c: dc, k: R, a: t('f') + ': domain ' + t(R), bad: [S('x', 'x\\ne\\pm ' + s.n).replace('\\pm ', '') ] };
    f1.bad = [S('x', 'x\\ge 0')];
    var f2 = { f: { label: 'Range of ' + t('y=f(x)'), name: 'range of f', mode: 'math', keys: 'set', vars: ['y'] }, c: K.set(rf, { v: 'y', wrong: [{ is: ra, code: CP + 'rng-f', hint: 'That is the range of ' + ABSF + '. ' + t('f') + ' itself reaches its vertex value ' + t(-n2) + '.' }] }), k: rf, a: 'range ' + t(rf), bad: [ra] };
    var f3 = { f: { label: 'Domain of ' + ABSF, name: 'domain of |f|', mode: 'math', keys: 'set', vars: ['x'] }, c: dc, k: R, a: t('|f|') + ': domain ' + t(R), bad: [S('x', 'x\\ge 0')] };
    var f4 = { f: { label: 'Range of ' + ABSF, name: 'range of |f|', mode: 'math', keys: 'set', vars: ['y'] }, c: K.set(ra, { v: 'y', wrong: [{ is: rf, code: CP + 'rng-f', hint: 'That is the range of ' + t('f') + '. The graph of ' + ABSF + ' has no negative values.' }, { is: S('y', 'y\\ge ' + n2), code: CP + 'rng-q', hint: 'The parabola crosses the ' + t('x') + '-axis, so ' + t('|f(x)|') + ' reaches 0.' }] }), k: ra, a: 'range ' + t(ra), bad: [rf, S('y', 'y\\ge ' + n2)] };
    return combo('State the domain and range of ' + t('y=f(x)') + ' and of ' + ABSF + '.', [f1, f2, f3, f4], H_ABSG, 'domain and range of f and |f|', null,
      t('y=f(x)') + ': domain ' + t(R) + ', range ' + t(rf) + ' (vertex ' + t(pt(0, -n2)) + ').<br>' + ABSF + ': the part for ' + t('-' + s.n + '<x<' + s.n) + ' is reflected; domain ' + t(R) + ', range ' + t(ra) + '.');
  }
  function q12b(r, s) { return combo('State the domain and range of ' + REC + '.', [sDom(CP, s.Q), sRng(CP, s.Q)], HINT_DR, 'domain and range of y = 1/f(x)'); }
  /* |f| for the C16 parabola (opening down) */
  function c16a(r, z) {
    var Q = z.Q, inv = sAbsInv([z.r1, z.s1], { c: Q.cv, vtx: [Q.p, Q.q] }), rg = sAbsR(Q.q);
    rg.c = K.set(S('y', 'y\\ge 0'), { v: 'y', wrong: [{ is: S('y', 'y\\le ' + rt(toR(Q.q))), code: CP + 'rng-f', hint: 'That is the range of ' + t('y=f(x)') + '. Reflecting removes the negative values, and the arms now rise without bound.' }, { is: S('y', '0\\le y\\le ' + rt(toR(Q.q))), code: CP + 'rng-q', hint: 'The parts outside the zeros are reflected upward: they rise without bound.' }] });
    rg.bad = [S('y', 'y\\le ' + rt(toR(Q.q))), S('y', '0\\le y\\le ' + rt(toR(Q.q)))];
    return combo('A strategy for graphing ' + ABSF + ': keep the part of the parabola on or above the ' + t('x') + '-axis and reflect the parts below it. State the invariant points and the range of ' + ABSF + '.', [inv, rg], H_ABSG, 'invariant points and range of y = |f(x)|', null,
      'Keep the part for ' + t(z.r1 + '\\le x\\le ' + z.s1) + ' (on or above the axis); reflect the parts for ' + t('x<' + z.r1) + ' and ' + t('x>' + z.s1) + '. The zeros ' + t(ptsT([[z.r1, 0], [z.s1, 0]])) + ' are invariant. Range ' + t(S('y', 'y\\ge 0')) + '.');
  }

  /* ======================================================================================================
   * The review assignment
   * ====================================================================================================== */
  var QUESTIONS = [
    { num: '1', section: 'Absolute value', stem: 'Evaluate.', outcome: AN1, parts: [Pt('1a', AN1, 'BEG', ev1), Pt('1b', AN1, 'BEG', ev2), Pt('1c', AN1, 'BEG', ev3), Pt('1d', AN1, 'BEG', ev4)] },
    { num: '2', outcome: AN1, parts: [Pt('2a', AN1, 'PRG', ua('order')), Pt('2b', AN1, 'BEG', ua('distance', { kinds: ['dec'] })), Pt('2c', RF2, 'EMG', twoNums)] },
    { num: '3', section: 'Graphs of y = |f(x)|', stem: 'Write in piecewise form.', outcome: RF2, parts: [Pt('3a', RF2, 'PRG', ua('linPiece')), Pt('3b', RF2, 'PRG', ua('linPiece')), Pt('3c', RF2, 'PRG', ua('quadPiece'))] },
    { num: '4', outcome: RF2, parts: [Pt('4a', RF2, 'EMG', absLinGraph), Pt('4b', RF2, 'PRG', absQuadGraph)] },
    { num: '5', outcome: RF2, parts: [Pt('5', RF2, 'PRG', q5)] },
    { num: '6', section: 'Absolute value equations', stem: 'Solve algebraically and verify.', outcome: RF2, parts: [Pt('6a', RF2, 'BEG', ua('absConst', { modes: ['plain'] })), Pt('6b', RF2, 'BEG', ua('absConst', { modes: ['iso'] })), Pt('6c', RF2, 'EMG', ua('absConst', { modes: ['none'] })), Pt('6d', RF2, 'PRG', ua('absLin', { counts: [2] })), Pt('6e', RF2, 'PRG', ua('absLin', { counts: [1] }))] },
    { num: '7', stem: 'Solve algebraically. Identify any extraneous solutions.', outcome: RF2, parts: [Pt('7a', RF2, 'PRG', ua('absQuadK', { modes: ['sq'] })), Pt('7b', RF2, 'ADV', ua('absQuadVar')), Pt('7c', RF2, 'PRG', ua('absQuadK', { modes: ['gen'] }))] },
    { num: '8', outcome: RF2, parts: [Pt('8', RF2, 'PRG', calcTenth)] },
    { num: '9', section: 'Reciprocal functions', outcome: RF11, parts: [Pt('9a', RF11, 'LIM', recEqMC), Pt('9b', RF11, 'BEG', ua('recLinFeat')), Pt('9c', RF11, 'EMG', ua('recLinInv')), Pt('9d', RF11, 'EMG', recLinDR)] },
    { num: '10', outcome: RF11, shared: function (r) { return fullSpec(r, { ms: [1] }); }, stem: function (z) { return 'Let ' + t('f(x)=' + z.Q.tex) + '. For ' + REC + ', state:'; }, parts: [
      Pt('10a', RF11, 'EMG', function (r, z) { return combo('the asymptotes and the ' + t('y') + '-intercept', [sAsy(CP, z.Q, true, { why: fullWhy(z) }), sYint(CP, z.Q)], HINT_ASY, 'asymptotes and y-intercept of y = 1/f(x)'); }),
      Pt('10b', RF11, 'PRG', function (r, z) { var a = sTP(CP, z.Q), b = sType(CP, z.Q), c = sInv(CP, z.Q); return combo('the turning point and its type, and the exact invariant points', [a, b, c], HINT_TP.slice(0, 1).concat(['Invariant points: solve ' + t('f(x)=1') + ' and ' + t('f(x)=-1') + '.']), 'turning point and invariant points', function (resp) { if (a.c(resp[0] || '').v === 'correct') { var r2 = b.c(resp[1] || ''); if (r2.v === 'wrong') return r2; } return null; }, t('f(x)=' + z.Q.vtex) + '. ' + a.s + ' (The vertex is an invariant point.)<br>' + c.s); }),
      Pt('10c', RF11, 'PRG', function (r, z) { return combo('the domain and range', [sDom(CP, z.Q), sRng(CP, z.Q)], HINT_DR, 'domain and range of y = 1/f(x)'); })] },
    { num: '11', outcome: RF11, parts: [Pt('11', RF11, 'ADV', turnDec)] },
    { num: '12', shared: q12Shared, stem: function (s) { return 'Let ' + t('f(x)=x^{2}-' + s.n * s.n) + '.'; }, outcome: RF2, parts: [Pt('12a', RF2, 'EMG', q12a), Pt('12b', RF11, 'PRG', q12b)] },
    { num: '13', outcome: RF11, parts: [Pt('13a', RF11, 'EMG', crossMC), Pt('13b', RF2, 'EMG', noSolMC)] },
    { num: '14', section: 'Multiple choice and numerical response', outcome: AN1, parts: [Pt('14', AN1, 'BEG', greatestMC)] },
    { num: '15', outcome: RF2, parts: [Pt('15', RF2, 'EMG', pwLinMC)] },
    { num: '16', outcome: RF11, parts: [Pt('16', RF11, 'PRG', absRecMC)] },
    { num: '17', outcome: RF2, parts: [Pt('17', RF2, 'EMG', oneSolMC)] },
    { num: '18', outcome: RF2, parts: [Pt('18', RF2, 'EMG', sameAbsMC)] },
    { num: '19', outcome: RF11, parts: [Pt('19', RF11, 'PRG', function (r) { return U.rangeMC(r, CP); })] },
    { num: '20', outcome: RF11, parts: [Pt('20', RF11, 'EMG', sqVAMC)] },
    { num: '21', outcome: RF11, parts: [Pt('21', RF11, 'ADV', signDirMC)] },
    { num: '22', outcome: RF2, parts: [Pt('22', RF2, 'PRG', countMC)] },
    { num: '23', outcome: AN1, parts: [Pt('23', AN1, 'BEG', ev23)] },
    { num: '24', outcome: RF2, parts: [Pt('24', RF2, 'PRG', sumSol)] },
    { num: '25', outcome: RF2, parts: [Pt('25', RF2, 'ADV', oneHund)] },
    { num: '26', outcome: RF11, parts: [Pt('26', RF11, 'MAS', yAtNR)] }
  ];

  /* ======================================================================================================
   * Extra Practice: the second practice test
   * ====================================================================================================== */
  var EXTRA = [
    { num: '1', section: 'A. Multiple Choice', outcome: AN1, parts: [Pt('E1', AN1, 'BEG', ep1MC)] },
    { num: '2', outcome: AN1, parts: [Pt('E2', AN1, 'BEG', ep2MC)] },
    { num: '3', outcome: RF2, parts: [Pt('E3', RF2, 'PRG', falseStmtMC)] },
    { num: '4', outcome: RF2, parts: [Pt('E4', RF2, 'PRG', pwQuadMC)] },
    { num: '5', outcome: RF2, parts: [Pt('E5', RF2, 'EMG', rangeAbsMC)] },
    { num: '6', outcome: RF2, parts: [Pt('E6', RF2, 'EMG', function (r) { return solvedMC(r, 'iso'); })] },
    { num: '7', outcome: RF2, parts: [Pt('E7', RF2, 'BEG', function (r) { return solvedMC(r, 'none'); })] },
    { num: '8', outcome: RF11, parts: [Pt('E8', RF11, 'BEG', vaPmMC)] },
    { num: '9', outcome: RF11, parts: [Pt('E9', RF11, 'EMG', turnMC)] },
    { num: '10', outcome: RF11, parts: [Pt('E10', RF11, 'BEG', recPtMC)] },
    { num: '11', outcome: RF11, parts: [Pt('E11', RF11, 'PRG', bothMC)] },
    { num: '12', section: 'B. Numerical Response', outcome: RF2, parts: [Pt('E12', RF2, 'ADV', prodHund)] },
    { num: '13', outcome: RF2, parts: [Pt('E13', RF2, 'PRG', sumLin)] },
    { num: '14', outcome: RF11, parts: [Pt('E14', RF11, 'ADV', kMaxNR)] },
    { num: '15', outcome: RF11, parts: [Pt('E15', RF11, 'ADV', invNR)] },
    { num: '16', section: 'C. Written Response', outcome: RF2, shared: function (r) { return fullSpec(r, { a: -1, ms: [2, 3] }); }, stem: function (z) { return 'Let ' + t('f(x)=' + z.Q.tex) + '.' + G({ x: win([z.r1, z.s1], 1.5), y: [-5, 10], fns: [crv(z.Q.f)], hline: [1, -1], max: 260, aria: 'the graph of a parabola opening down that crosses the x-axis twice' }); }, parts: [
      Pt('E16a', RF2, 'PRG', c16a),
      Pt('E16b', RF11, 'PRG', function (r, z) { var Q = z.Q, a = sTP(CP, Q), b = sType(CP, Q); return combo('A strategy for graphing ' + REC + ': the zeros of ' + t('f') + ' give the vertical asymptotes, the vertex gives the turning point. State the asymptotes, the turning point and its type, and the ' + t('y') + '-intercept of ' + REC + '.', [sAsy(CP, Q, true, { why: fullWhy(z) }), a, b, sYint(CP, Q)], HINT_ASY.concat(HINT_TP.slice(0, 1)), 'features of y = 1/f(x)', function (resp) { if (a.c(resp[1] || '').v === 'correct') { var r2 = b.c(resp[2] || ''); if (r2.v === 'wrong') return r2; } return null; }); }),
      Pt('E16c', RF11, 'PRG', function (r, z) { return invPart(CP, z.Q, 'State the exact invariant points of the graphs of ' + t('y=f(x)') + ' and ' + REC + '.'); }),
      Pt('E16d', RF11, 'PRG', function (r, z) { return combo('State the domain and range of ' + REC + '.', [sDom(CP, z.Q), sRng(CP, z.Q)], HINT_DR, 'domain and range of y = 1/f(x)'); })] },
    { num: '17', stem: 'Solve algebraically. Identify any extraneous solutions.', outcome: RF2, parts: [Pt('E17a', RF2, 'PRG', ua('absLin', { counts: [1] })), Pt('E17b', RF2, 'PRG', ua('absQuadK', { modes: ['gen'] })), Pt('E17c', RF2, 'ADV', ua('absQuadVar'))] },
    { num: '18', outcome: RF11, shared: function (r) { return asyTurnSpec(r, { sign: 1, as: [1, 2, [1, 2], [1, 3], [1, 4]] }); }, stem: function (z) { return asyTurnStem(z) + asyTurnGraph(z); }, parts: [
      Pt('E18a', RF11, 'EMG', function (r, z) { var k = toR(1 / z.q); return pointPart(CP, 'To sketch ' + t('y=f(x)') + ', start from its zeros and its vertex. State the coordinates of the vertex of ' + t('f') + '.', [z.p, toR(z.q)], [{ p: [z.p, k], code: CP + 'rb-vertex', hint: 'That is the turning point of ' + t('g') + '. The vertex of ' + t('f') + ' has the reciprocal ' + t('y') + '-value.' }, { p: [z.p, toR(-z.q)], code: CP + 'rpt-neg', hint: 'A reciprocal keeps the sign.' }], 'The maximum point ' + t('\\left(' + z.p + ',\\ ' + rt(k) + '\\right)') + ' of ' + t('g') + ' comes from the vertex ' + t(pt(z.p, toR(z.q))) + ' of ' + t('f') + ', a minimum. The parabola passes through it and the zeros ' + t(z.r1) + ' and ' + t(z.s1) + '.', ['A point ' + t('(x,\\ k)') + ' on ' + t('g') + ' matches ' + t('\\left(x,\\ \\frac{1}{k}\\right)') + ' on ' + t('f') + '.'], 'vertex of f from its reciprocal'); }),
      Pt('E18b', RF11, 'MAS', function (r, z) { var wr = backWrongs(CP, z.T, toR(1 / z.q), 'a zero, ' + t('f(' + z.s1 + ')=0'), [z.s1, 0]), v = sVform(CP, z.T, wr); var p = KP.math('Determine ' + t('f(x)') + ' in the form ' + t('f(x)=a(x-p)^{2}+q') + '.', v.c, v.k, asyTurnSol(z), HINT_BACK, 'a quadratic f from its reciprocal', { keys: 'poly', vars: ['x'], before: 'f(x)=' }); p.bad = v.bad; return p; }),
      Pt('E18c', RF11, 'PRG', function (r, z) { var c = z.T.cv; return valPart(CP, 'State the ' + t('y') + '-intercept of ' + t('y=g(x)') + '.', toR(1 / c), [{ v: toR(c), code: CP + 'yint-same', hint: 'That is ' + t('f(0)') + '. ' + t('g(0)=\\frac{1}{f(0)}') + '.' }, { v: toR(-1 / c), code: CP + 'rpt-neg', hint: 'A reciprocal keeps the sign.' }], t('f(0)=' + rt(toR(c))) + ', so ' + t('g(0)=\\frac{1}{f(0)}=' + rt(toR(1 / c))) + '.', ['Find ' + t('f(0)') + ', then take its reciprocal.'], 'y-intercept of y = 1/f(x)'); })] },
    { num: '19', outcome: RF2, parts: [Pt('E19', RF2, 'PRG', tolerance)] },
    { num: '20', outcome: RF11, parts: [Pt('E20a', RF11, 'EMG', crossMC), Pt('E20b', RF2, 'PRG', errorMC)] }
  ];

  HW.defineLesson({ id: LID, unit: 7, num: '8', title: 'Unit 7 Review', outcome: 'RF2', calc: true, questions: QUESTIONS, extra: EXTRA });
})(window);
