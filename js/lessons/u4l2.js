/* Math 20-1 · Unit 4 · Lesson 2 — Factoring ax² + bx + c (outcome RF1 on every part)
 * Assignment 2 (u4_l02.tex, Questions 1–18) and the Lesson 2 Extra Practice (u4_ep02.tex, A1–A3, B1–B6, C1–C4).
 * Every part is a generator: the booklet question's idea, form and difficulty with new numbers (the lesson's example
 * numbers and the booklet's own numbers are left out). No calculator (Unit 4): exact answers.
 * Uses the factoring kit HW.u4kit from u4l1.js (load that first): every trinomial is built from its factors, the key is
 * the factorization it was made from, and the decomposition slips (pair written straight into the brackets, a not
 * divided out, last terms in the wrong brackets, both signs switched, a dropped or wrong-sign common factor, the second
 * letter left out) are recognised. Fractional common factors must come out in front (whole numbers in the brackets).
 *
 * Conversions: "which are perfect squares? factor those that are" → one box with a none key (none = not a perfect
 * square); "complete the steps" (Q3) → boxes for ac, the pair and the factored form; "check the student's answer"
 * (Q5) → the expansion and the correct factoring; "guess and check" (Q4) → the factored form with a guess-and-check
 * solution; the poster frame (Q13) → expressions and a number.
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: 17, Extra C1, C2(b), C4. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, B = K.P, P = HW.poly, FX = HW.factor, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var U = HW.u4kit, LID = 'u4l2';
  if (!U) throw new Error('u4l2.js needs u4l1.js (HW.u4kit) loaded first');
  var gcd = U.gcd, V = U.V, M = U.M, N = U.N, tx = U.tx, br = U.br, sg = U.sg, par = U.par, lin = U.lin, pickWhere = U.pickWhere, posPairs = U.posPairs;

  HW.addCodes({
    'u4l2-ac': 'Wrong value of ac', 'u4l2-pair': 'Wrong decomposition pair', 'u4l2-expand': 'Expanded the student’s answer wrongly', 'u4l2-no-double': 'Perfect square: forgot to double AB',
    'u4l2-not-squared': 'Perfect square: forgot to square', 'u4l2-frame-once': 'Frame added on one side only', 'u4l2-outer': 'Gave the outer area, not the frame', 'u4l2-frame-sign': 'Subtracted the wrong way round',
    'u4l2-digits': 'Digits in the wrong order', 'u4l2-k-sign': 'Sign of the middle term wrong', 'u4l2-square-x': 'Wrong value of x for the square', 'u4l2-side': 'Gave the side instead of the area'
  });
  HW.addPartial({ 'u4l2-ac': 's', 'u4l2-pair': 'b', 'u4l2-expand': 's', 'u4l2-no-double': 'b', 'u4l2-not-squared': 'b', 'u4l2-frame-once': 'b', 'u4l2-outer': 'b', 'u4l2-frame-sign': 's', 'u4l2-digits': 's', 'u4l2-k-sign': 's', 'u4l2-side': 's' });

  var LET = ['x', 'y', 'a', 'n', 't', 'm', 'k', 'p', 'w', 'z'];
  var PAIRS2 = [['x', 'y'], ['a', 'b'], ['m', 'n'], ['p', 'q'], ['r', 's']];
  // examples and booklet questions of Lesson 2 (letters as x and y) — never generated
  var AVOID = ['2x^2+11x+12', '6x^2+19x+10', '3x^2+10x+8', '5x^2+17x+6', '4x^2+16x+15', '4x^2-4x-15', '6x^2-13x+6', '5x^2+13x-6', '3x^2-7x-6', '12x^2+2x-4', '-6x^2+7x+3',
    '-3x^2+2x+8', '18x^3-33x^2-30x', '3x^2+7xy-6y^2', '10x^2-23xy+12y^2', '\\frac{1}{2}x^2-x-4', '\\frac{1}{2}x^2+x-12', '\\frac{3}{4}x^2-3x-24', '\\frac{1}{2}x^2+\\frac{5}{4}x+\\frac{1}{2}',
    '9x^2+12x+4', '25x^2-20xy+4y^2', '64x^2-48x+9', '2x^3+20x^2+50x', '4x^2+28x+49', 'x^2-18x+81', '16x^2+40x+25', '9x^2+42x+49',
    '2x^2+9x+4', '3x^2+16x+5', '4x^2+12x+5', '6x^2+23x+20', '5x^2-17x+6', '2x^2+x-15', '6x^2-x-12', '8x^2-14x+3', '10x^2+11x-6', '9x^2-9x-4', '12x^2-25x+12', '7x^2+2x-9',
    '6x^2-7x-20', '2x^2+5x-12', '6x^2-x-2', '6x^2+21x+9', '20x^2-10x-30', '12x^3+14x^2-6x', '8x^4-26x^3+15x^2', '-3x^2+10x+8', '-12x^2-x+6', '-10x^2-13x+3', '-4x^3+2x^2+30x',
    '2x^2+7xy+3y^2', '6x^2-5xy-4y^2', '4x^2-12xy+5y^2', '15x^2+2xy-8y^2', '\\frac{1}{2}x^2-3x+4', '\\frac{1}{5}x^2+x-10', '\\frac{2}{3}x^2+2x-12', '\\frac{1}{2}x^2+\\frac{7}{6}x+\\frac{1}{3}',
    'x^2+14x+49', '4x^2-20x+25', '49x^2-56xy+16y^2', '9x^2+6x+1', 'x^2+12x+36', '25x^2+70x+49', '81x^2-36xy+4y^2', '\\frac{1}{4}x^2+3x+9', '81x^2-18x+1', '49x^2+28x+4', '3x^2-30x+75',
    '16x^2+24xy+9y^2', '6x^2+x-15', '18x^2-3x-6', '9x^2-30xy+25y^2', '4x^2+12x+9', 'x^2-2x+1', '2x^2+7x-15', '15x^2+14x-8', '4x^2+20x+25',
    '2x^2+13x+15', '3x^2-11x+10', '4x^2+4x-3', '6x^2-5x-6', '5x^2-21x+4', '8x^2+10x-3', '4x^2+22x+10', '9x^3-21x^2-18x', '30x^2-5x-10', '2x^2+9xy+10y^2', '3x^2-10xy-8y^2',
    '6x^2-17xy+12y^2', '-2x^2-5x+12', '-4x^2+3x+10', '\\frac{1}{3}x^2+2x-9', '\\frac{1}{4}x^2-x-3', '\\frac{2}{5}x^2+\\frac{6}{5}x+\\frac{4}{5}', '9x^2-42x+49', '36x^2+60x+25',
    '50x^2+40x+8', '8x^2+2x-15', '6x^2+7x-3', '5x^2-7x-6', '6x^2+5x-6', '\\frac{2}{5}x^2-\\frac{7}{5}x-\\frac{4}{5}'];
  var tri = U.triMaker(AVOID, LID);
  function letter(r) { return r.pick(LET); }
  function two(r) { return r.pick(PAIRS2); }
  function pos(lo, hi) { return [lo, hi]; }
  function negr(lo, hi) { return [-hi, -lo]; }
  function fac(r, sp, ex, o) { return U.facPart(tri(r, sp, ex), o); }
  function can(r, sp, ex, o) { return U.canPart(tri(r, sp, ex), o); }
  var PRIME = { of: [2, 3, 5, 7] }, COMP = [2, 4];
  function composite(o) { return o.a === 4 || o.a === 6 || o.a === 8 || o.a === 9 || o.a === 10 || o.a === 12 || o.a === 14 || o.a === 15 || o.a === 16; }

  /* ---------------- perfect squares ---------------- */
  /* T (a square Tri) typed as (A ± B)², or a non-square typed as none */
  function psPart(T, o) {
    o = o || {};
    var base = U.facPart(T, Object.assign({ ps: true }, o)), chk = base.check, vs = P.vars(T.full);
    return { prompt: base.prompt, input: { type: 'fields', fields: U.noneField(vs.length ? vs : [T.v]) }, key: [base.key], answer: base.answer, solution: base.solution, hints: base.hints, text: base.text,
      check: function (resp) {
        var v = U.noneVal(resp);
        if (!v) return form('empty', 'Type it as ' + t('(A\\pm B)^{2}') + ', or press <b>none</b> if it isn’t a perfect square.');
        if (/^none$/i.test(v)) return wrong('u4-said-not-ps', 'It <b>is</b> a perfect square: the first and last terms are squares and the middle term is ' + t('2AB') + '. Find ' + t('A') + ' and ' + t('B') + '.');
        return chk(v);
      },
      good: base.good.map(function (g) { return [g]; }), bad: [['none']].concat(base.bad.map(function (b) { return [b]; })) };
  }
  /* full: a trinomial that is not a perfect square; why: the reason (HTML); A, Bm: the would-be square roots (for the hint) */
  function notPsPart(full, why, o) {
    o = o || {};
    var vs = P.vars(full);
    return { prompt: o.prompt || t(o.asc ? tx(full, { order: 'asc' }) : tx(full)), input: { type: 'fields', fields: U.noneField(vs) }, key: ['none'], answer: 'Not a perfect square.', solution: why + ' So it is <b>not</b> a perfect square.',
      hints: ['A perfect square ' + t('A^{2}\\pm 2AB+B^{2}') + ' has its first and last terms perfect squares (both positive) and its middle term ' + t('\\pm 2AB') + '.', 'Test each condition. If one fails, press <b>none</b>.'], text: o.text || 'perfect square? ' + tx(full) + ' (no)',
      check: function (resp) {
        var s = U.noneVal(resp);
        if (!s) return form('empty', 'Type it as ' + t('(A\\pm B)^{2}') + ', or press <b>none</b> if it isn’t a perfect square.');
        if (/^none$/i.test(s)) return ok();
        var r = K.read(s); if (r.res) return r.res;
        var sp = FX.split(r.ast); if (!sp.ok) return wrong('value', null);
        var S = sp.factors.reduce(function (acc, f) { return P.mul(acc, P.pow(f.p, f.k)); }, N(1));
        if (P.eq(S, full)) return form('u4-use-none', 'That is the trinomial itself. If it isn’t a perfect square, press <b>none</b>.');
        return wrong('u4-not-ps', 'Expand your answer: it gives ' + t(tx(S)) + ', not ' + t(tx(full)) + '. ' + why);
      },
      bad: o.bad || [[tx(full)]] };
  }
  /* a square Tri (A·v + B·w)² with a random sign */
  function sqTri(r, sp, ex) { return tri(r, Object.assign({ square: true }, sp), ex); }
  /* (A v)² + A B v + B² (middle = AB, not 2AB) */
  function halfMid(A, Bb, v, w) { var Av = M(A, oneV(v)), Bw = w ? M(Bb, oneV(w)) : N(Bb); return P.add(P.pow(Av, 2), P.mul(Av, Bw), P.pow(Bw, 2)); }
  function oneV(v) { var o = {}; o[v] = 1; return o; }

  /* ---------------- multiple choice: one factor of … ---------------- */
  function isFactor(full, L, v) { var c0 = P.constant(L)[0], l0 = P.coef(L, oneV(v))[0]; if (!l0 || P.count(L) !== 2) return false; return P.atExact(full, (function () { var e = {}; e[v] = [-c0, l0]; return e; })())[0] === 0; }
  function oneFactorMC(r, T, prompt, text) {
    var v = T.v, R = r.chance(0.5) ? T.F1 : T.F2, O = R === T.F1 ? T.F2 : T.F1;
    var rc = P.constant(R)[0], rl = P.coef(R, oneV(v))[0], oc = P.constant(O)[0], ol = P.coef(O, oneV(v))[0];
    var cands = [lin(rl, -rc, v), lin(ol, -oc, v), lin(Math.abs(rc), (rc < 0 ? -1 : 1) * rl, v), lin(rl, oc, v), lin(ol, rc, v), lin(Math.abs(oc), (oc < 0 ? -1 : 1) * ol, v), lin(rl + 1, rc, v), lin(1, rc, v)];
    var picked = [];
    cands.forEach(function (c) {
      var cc = P.constant(c)[0], cl = P.coef(c, oneV(v))[0];
      if (picked.length >= 3 || !cc || !cl || gcd(cc, cl) !== 1 || isFactor(T.full, c, v) || P.eq(c, R) || picked.some(function (y) { return P.eq(c, y); })) return;
      picked.push(c);
    });
    if (picked.length < 3) throw new Error(LID + ': not enough distractors');
    var gcfNote = T.g1 ? 'Factor it by decomposition first. ' : 'Take out the common factor ' + t(T.gtex) + ' first, then decompose ' + t(T.innerTex) + '. ';
    var opts = [{ html: t(tx(R)), right: true }].concat(picked.map(function (c, i) {
      return { html: t(tx(c)), why: gcfNote + (i === 0 || P.eq(c, lin(ol, -oc, v)) ? 'Then check the signs: the last terms of the brackets must multiply to ' + t(T.c) + ' and give the right middle term.' : t(tx(c)) + ' is not one of the brackets.') };
    }));
    return B.mc(r, prompt || 'One factor of ' + t(T.tex) + ' is', opts, U.sol(T) + '<br>So ' + t(tx(R)) + ' is a factor.', [gcfNote + 'Then compare the brackets with the options.'], text || 'one factor of ' + T.tex);
  }

  /* ---------------- fields helpers ---------------- */
  function pairCheck(m, n, ac, b) {
    return function (resp) {
      resp = resp || [];
      var A = HW.parse.number(resp[0] == null ? '' : resp[0]), Bn = HW.parse.number(resp[1] == null ? '' : resp[1]);
      if (!A.ok || !Bn.ok) return form('empty', 'Enter one integer in each box.');
      var x = A.value, y = Bn.value;
      if ((x === m && y === n) || (x === n && y === m)) return ok();
      var both = 'Yours: ' + t(par(x) + '\\times ' + par(y) + '=' + x * y) + ' and ' + t(par(x) + '+' + par(y) + '=' + (x + y)) + '. ';
      if (x * y === ac && x + y === -b) return wrong('pair-signs', both + 'Right product, but the sum must be ' + t(b) + '. Switch both signs.');
      if (x * y === ac) return wrong('pair-sum', both + 'The product is right ✓ but the sum must be ' + t(b) + '. Try another factor pair of ' + t(Math.abs(ac)) + '.');
      if (x + y === b) return wrong('pair-product', both + 'The sum is right ✓ but the product must be ' + t('ac=' + ac) + '.');
      return wrong('u4l2-pair', both + 'The two numbers multiply to ' + t('ac=' + ac) + ' and add to ' + t('b=' + b) + '.');
    };
  }
  function labelled(res, lab) { return res.v === 'correct' ? res : { v: res.v, code: res.code, hint: '<b>' + lab + ':</b> ' + (res.hint || 'Check this one again.') }; }

  /* ---------------- frame / rectangle shared numbers ---------------- */
  function posterShared(r) {
    return pickWhere(function () {
      var o = { p: r.int(2, 5), q: r.int(1, 7), rr: r.int(2, 4), s: r.int(1, 7), f: r.int(1, 3), X: r.int(5, 12) };
      return o;
    }, function (o) { return o.p > o.rr && gcd(o.p, o.q) === 1 && gcd(o.rr, o.s) === 1 && o.rr * o.X - o.s >= 3 && o.p * o.q !== o.rr * o.s && o.p * -o.s + o.q * o.rr !== 0 && !(o.p === 3 && o.q === 5 && o.rr === 2 && o.s === 3); });
  }

  var QUESTIONS = [
    { num: '1', section: 'Decomposition', stem: 'Factor by decomposition, or press <b>none</b> if the trinomial does not factor over the integers.', parts: [
      { id: '1a', level: 'EMG', make: function (r) { return can(r, { p: { of: [2, 3] }, q: pos(1, 5), s: pos(1, 6), test: function (o) { return o.b <= 15; } }); } },
      { id: '1b', level: 'EMG', make: function (r) { return can(r, { p: { of: [3, 5, 7] }, q: 1, s: pos(2, 7) }); } },
      { id: '1c', level: 'EMG', make: function (r) { return can(r, { p: { of: [2, 3, 4] }, r: { of: [2, 3, 4] }, q: { of: [1, 3, 5, 7] }, s: { of: [1, 3, 5, 7] }, test: function (o) { return o.p === o.r && o.q < o.s; } }); } },
      { id: '1d', level: 'PRG', make: function (r) { return can(r, { p: pos(2, 4), r: pos(2, 4), q: pos(1, 7), s: pos(1, 7), test: function (o) { return o.p !== o.r && o.ac >= 40 && o.ac <= 180; } }); } },
      { id: '1e', level: 'PRG', make: function (r) { var o = U.noneTri(r, { a: { of: [2, 3, 5] }, b: [2, 9], c: [2, 9], test: function (o) { return ['3x^{2}+5x+4'].indexOf(tx(P.add(M(o.a, { x: 2 }), M(o.b, { x: 1 }), N(o.c)))) < 0; } }); return U.nonePart({ a: o.a, b: o.b, c: o.c }); } }] },
    { num: '2', stem: 'Factor.', parts: [
      { id: '2a', level: 'EMG', make: function (r) { return fac(r, { p: PRIME, q: negr(1, 4), s: negr(2, 6), test: function (o) { return o.b < -5; } }); } },
      { id: '2b', level: 'EMG', make: function (r) { return fac(r, { p: PRIME, q: negr(1, 7), s: pos(1, 6), test: function (o) { return o.b > 0; } }, { v: letter(r) }); } },
      { id: '2c', level: 'PRG', make: function (r) { return fac(r, { p: pos(2, 4), r: pos(2, 4), q: pos(1, 5), s: negr(1, 5), test: function (o) { return o.p !== o.r && o.b < 0; } }, { v: letter(r) }); } },
      { id: '2d', level: 'PRG', make: function (r) { return fac(r, { p: pos(2, 4), r: pos(2, 4), q: negr(1, 3), s: negr(1, 5), test: function (o) { return o.p !== o.r && o.a >= 6; } }); } },
      { id: '2e', level: 'PRG', make: function (r) { return fac(r, { p: pos(2, 5), r: pos(2, 3), q: negr(1, 3), s: pos(1, 5), test: function (o) { return o.p !== o.r && o.b > 0 && o.a >= 6; } }, { v: letter(r) }); } },
      { id: '2f', level: 'PRG', make: function (r) { return fac(r, { p: { of: [2, 3, 4] }, r: { of: [2, 3, 4] }, q: negr(1, 7), s: pos(1, 5), test: function (o) { return o.p === o.r && o.b !== 0; } }, { v: letter(r) }); } },
      { id: '2g', level: 'PRG', make: function (r) { return fac(r, { p: pos(2, 5), r: pos(2, 5), q: negr(1, 5), s: negr(1, 5), test: function (o) { return o.p !== o.r && o.ac >= 100; } }); } },
      { id: '2h', level: 'PRG', make: function (r) { return fac(r, { p: { of: [5, 7, 11] }, q: pos(3, 9), s: negr(1, 3), test: function (o) { return o.b > 0 && o.q > -o.s; } }, { v: letter(r) }); } }] },
    { num: '3', section: 'Showing the steps',
      parts: [
        { id: '3', level: 'PRG', make: function (r) {
          var T = tri(r, { p: pos(2, 4), r: pos(2, 5), q: pos(2, 7), s: negr(1, 7), test: function (o) { return o.p !== o.r && o.b < 0 && Math.abs(o.ac) >= 40; } });
          var base = U.facPart(T), cAc = K.number(T.ac, function (v) { if (v === -T.ac) return { code: 'u4l2-ac', hint: 'Keep the sign: ' + t('a\\times c=' + T.a + '\\times' + par(T.c)) + '.' }; if (v === T.a + T.c) return { code: 'u4l2-ac', hint: t('ac') + ' means ' + t('a') + ' <b>times</b> ' + t('c') + '.' }; return null; });
          var cPair = pairCheck(T.m, T.n, T.ac, T.b);
          return { prompt: 'Complete the steps to factor ' + t(T.tex) + ' by decomposition: find ' + t('ac') + ', the two numbers (product ' + t('ac') + ', sum ' + t('b') + ') that split the middle term, and the factored form.',
            input: { type: 'fields', fields: [{ name: 'ac', label: t('ac=') }, { name: 'First number', label: 'First number' }, { name: 'Second number', label: 'Second number' }, U.polyBox('Factored form', ['x'])] },
            check: function (resp) {
              resp = resp || [];
              var a = cAc(resp[0] == null ? '' : resp[0]); if (a.v !== 'correct') return labelled(a, 'ac');
              var pp = cPair([resp[1], resp[2]]); if (pp.v !== 'correct') return labelled(pp, 'The two numbers');
              return labelled(base.check(resp[3] == null ? '' : resp[3]), 'Factored form');
            },
            key: [String(T.ac), String(T.m), String(T.n), T.key], answer: t('ac=' + T.ac) + '; ' + t(T.m) + ' and ' + t(T.n) + '; ' + t(T.tex + '=' + splitT(T) + '=' + T.key), solution: U.sol(T),
            hints: ['Multiply the first and last coefficients: ' + t('ac=' + T.a + '\\times' + par(T.c)) + '.', 'Two integers with product ' + t(T.ac) + ' and sum ' + t(T.b) + ' split ' + t(tx(M(T.b, { x: 1 }))) + ' into two terms; then group.'], text: 'decomposition steps',
            good: [[String(T.ac), String(T.n), String(T.m), base.good[0]]], bad: [[String(-T.ac), String(T.m), String(T.n), T.key], [String(T.ac), String(-T.m), String(-T.n), T.key]] };
        } }] },
    { num: '4', section: 'Guess and check', parts: [
      { id: '4', level: 'EMG', make: function (r) {
        var T = tri(r, { p: { of: [2, 3, 5] }, q: negr(1, 7), s: pos(1, 7), test: function (o) { return o.b > 0 && Math.abs(o.q) !== o.s && o.p * o.s !== -o.q; } });
        var tryW = '(' + tx(lin(T.p, -T.q)) + ')(' + tx(lin(1, -T.s)) + ')', midW = -T.p * T.s - T.q;
        var sol = 'First terms must be ' + t(T.p + 'x') + ' and ' + t('x') + '; the last terms multiply to ' + t(T.c) + '.<br>Try ' + t(tryW) + ': middle term ' + t(tx(M(midW, { x: 1 }))) + ' — right size, wrong sign: switch the signs.<br>' +
          'Try ' + t(br(T.F1) + br(T.F2)) + ': middle term ' + t(tx(M(T.p * T.s, { x: 1 })) + sg(T.q) + 'x=' + tx(M(T.b, { x: 1 }))) + ' ✓<br>So ' + t(T.tex + '=' + T.key) + '.';
        return U.facPart(T, { prompt: 'Factor ' + t(T.tex) + ' by guess and check.', sol: sol, hints: ['The first terms of the brackets are ' + t(T.p + 'x') + ' and ' + t('x') + '. The last terms are a factor pair of ' + t(T.c) + '.', 'Expand each try mentally: does the middle term come out as ' + t(tx(M(T.b, { x: 1 }))) + '? Switch signs or swap the pair and try again.'] });
      } }] },
    { num: '5', section: 'Checking a factoring',
      parts: [
        { id: '5', level: 'PRG', make: function (r) {
          var T = tri(r, { p: pos(2, 4), r: pos(2, 5), q: negr(1, 5), s: pos(1, 5), test: function (o) { return o.p !== o.r && o.b !== 0 && Math.abs(o.ac) <= 60; } });
          var Wf = lin(T.r, -T.s), Sw = P.mul(T.F1, Wf), stu = br(T.F1) + br(Wf);
          var cE = K.poly(Sw, { wrong: [{ is: T.full, code: 'u4l2-expand', hint: 'Expand the <b>student’s</b> brackets ' + t(stu) + ' exactly as written — the last terms multiply to ' + t(T.q * -T.s) + '.' }] }), base = U.facPart(T);
          return { prompt: 'A student factored ' + t(T.tex) + ' as ' + t(stu) + '. Check the answer by expanding it, then give the correct factoring.',
            input: { type: 'fields', fields: [U.polyBox(t(stu) + ' expands to', ['x']), U.polyBox('Correct factoring of ' + t(T.tex), ['x'])] },
            check: function (resp) { resp = resp || []; var a = cE(resp[0] == null ? '' : resp[0]); if (a.v !== 'correct') return labelled(a, 'Expansion'); return labelled(base.check(resp[1] == null ? '' : resp[1]), 'Correct factoring'); },
            key: [tx(Sw), T.key], answer: t(stu + '=' + tx(Sw)) + ' (wrong); correct: ' + t(T.key),
            solution: t(stu + '=' + P.seq([M(T.a, { x: 2 }), M(-T.p * T.s, { x: 1 }), M(T.q * T.r, { x: 1 }), N(-T.q * T.s)]) + '=' + tx(Sw)) + '. Wrong.<br>' + U.sol(T),
            hints: ['Multiply out the student’s brackets and compare with ' + t(T.tex) + '.', 'Then decompose: two integers with product ' + t('ac=' + T.ac) + ' and sum ' + t(T.b) + '.'], text: 'check a factoring',
            good: [[tx(Sw), base.good[0]]], bad: [[tx(T.full), T.key], [tx(Sw), stu]] };
        } }] },
    { num: '6', section: 'GCF first', stem: 'Factor fully.', parts: [
      { id: '6a', level: 'PRG', make: function (r) { return fac(r, { p: { of: [2, 3] }, q: pos(1, 4), s: pos(1, 5) }, { k: r.int(2, 5) }); } },
      { id: '6b', level: 'PRG', make: function (r) { return fac(r, { p: { of: [2, 3, 5] }, q: negr(1, 5), s: pos(1, 3), test: function (o) { return o.b !== 0; } }, { v: letter(r), k: r.pick([2, 3, 4, 5, 6, 10]) }); } },
      { id: '6c', level: 'PRG', make: function (r) { var v = letter(r), gv = {}; gv[v] = 1; return fac(r, { p: pos(2, 3), r: pos(2, 3), q: negr(1, 3), s: pos(1, 5), test: function (o) { return o.p !== o.r && o.b !== 0; } }, { v: v, k: r.int(2, 3), gv: gv }); } },
      { id: '6d', level: 'ADV', make: function (r) { var v = letter(r), gv = {}; gv[v] = 2; return fac(r, { p: pos(2, 4), r: pos(2, 4), q: negr(1, 5), s: negr(1, 5), test: function (o) { return o.p !== o.r; } }, { v: v, gv: gv }); } }] },
    { num: '7', section: 'Negative leading coefficient', stem: 'Factor fully.', parts: [
      { id: '7a', level: 'PRG', make: function (r) { return fac(r, { p: { of: [3, 5] }, q: pos(1, 4), s: negr(2, 6), test: function (o) { return o.b !== 0; } }, { k: -1 }); } },
      { id: '7b', level: 'ADV', make: function (r) { return fac(r, { p: pos(2, 4), r: pos(2, 4), q: pos(1, 5), s: negr(1, 5), test: function (o) { return o.p !== o.r && o.a >= 6 && o.b !== 0; } }, { k: -1 }, { asc: true }); } },
      { id: '7c', level: 'PRG', make: function (r) { return fac(r, { p: pos(2, 5), r: pos(2, 3), q: negr(1, 3), s: pos(1, 5), test: function (o) { return o.p !== o.r && o.a >= 6 && o.b !== 0; } }, { k: -1 }); } },
      { id: '7d', level: 'ADV', make: function (r) { var v = letter(r), gv = {}; gv[v] = 1; return fac(r, { p: { of: [2, 3] }, q: pos(1, 7), s: negr(1, 5), test: function (o) { return o.b !== 0; } }, { v: v, k: r.pick([-2, -3]), gv: gv }); } }] },
    { num: '8', section: 'Two variables', stem: 'Factor.', parts: [
      { id: '8a', level: 'EMG', make: function (r) { var pr = two(r); return fac(r, { p: { of: [2, 3] }, q: pos(1, 3), s: pos(1, 5) }, { v: pr[0], w: pr[1] }); } },
      { id: '8b', level: 'PRG', make: function (r) { var pr = two(r); return fac(r, { p: pos(2, 4), r: pos(2, 3), q: negr(1, 5), s: pos(1, 3), test: function (o) { return o.p !== o.r && o.b !== 0; } }, { v: pr[0], w: pr[1] }); } },
      { id: '8c', level: 'PRG', make: function (r) { var pr = two(r); return fac(r, { p: { of: [2, 3] }, r: { of: [2, 3] }, q: negr(1, 2), s: negr(3, 7), test: function (o) { return o.p === o.r; } }, { v: pr[0], w: pr[1] }); } },
      { id: '8d', level: 'PRG', make: function (r) { var pr = two(r); return fac(r, { p: pos(3, 5), r: pos(2, 4), q: pos(1, 5), s: negr(1, 5), test: function (o) { return o.p !== o.r && o.b !== 0 && o.a >= 9; } }, { v: pr[0], w: pr[1] }); } }] },
    { num: '9', section: 'Rational coefficients', stem: 'Factor fully by first taking out a fractional common factor.', parts: [
      { id: '9a', level: 'PRG', make: function (r) { var d = r.pick([2, 3, 4]); return fac(r, { q: negr(1, 6), s: negr(1, 6), test: function (o) { return o.q > o.s; } }, { k: [1, d] }, { intBrackets: true }); } },
      { id: '9b', level: 'PRG', make: function (r) { var d = r.pick([3, 4, 5]); return fac(r, { q: pos(2, 12), s: negr(1, 10), test: function (o) { return o.b % d === 0 && o.c % d === 0 && o.b !== 0; } }, { k: [1, d] }, { intBrackets: true }); } },
      { id: '9c', level: 'ADV', make: function (r) { var nd = r.pick([[2, 3], [3, 4], [2, 5], [3, 5], [4, 3], [3, 2]]); return fac(r, { q: pos(2, 10), s: negr(1, 10), test: function (o) { return o.b % nd[1] === 0 && o.c % nd[1] === 0 && o.b !== 0; } }, { k: nd }, { intBrackets: true }); } },
      { id: '9d', level: 'ADV', make: function (r) { var L = r.pick([4, 6, 8, 10, 12]); return fac(r, { p: pos(2, 3), q: pos(1, 3), s: pos(1, 4), test: function (o) { return gcd(o.a, L) > 1 && o.a % L !== 0 && (o.b % L !== 0 || o.c % L !== 0) && gcd(gcd(gcd(o.a, o.b), o.c), L) === 1; } }, { k: [1, L] }, { intBrackets: true }); } }] },
    { num: '10', section: 'Perfect-square trinomials', stem: 'Which are perfect-square trinomials? Factor those that are as ' + t('(A\\pm B)^{2}') + '; press <b>none</b> for those that are not.', parts: [
      { id: '10a', level: 'EMG', make: function (r) { return psPart(sqTri(r, { q: { of: [-9, -8, -7, -6, -5, -4, -3, 3, 4, 5, 6, 7, 8, 9, 10, 11] }, s: 0 }, { v: letter(r) })); } },
      { id: '10b', level: 'EMG', make: function (r) { return psPart(sqTri(r, { p: pos(2, 5), r: 0, q: { of: [-7, -5, -3, -1, 1, 3, 5, 7] }, s: 0 }, { v: letter(r) })); } },
      { id: '10c', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { A: r.int(2, 7), B: r.int(2, 9) }; }, function (o) { return gcd(o.A, o.B) === 1 && !(o.A === 3 && o.B === 5) && !(o.A === 2 && o.B === 3); });
        var v = letter(r), full = halfMid(o.A, o.B, v), mid = 2 * o.A * o.B;
        return notPsPart(full, 'The first and last terms are ' + t('(' + o.A + v + ')^{2}') + ' and ' + t(o.B + '^{2}') + ', but ' + t('2(' + o.A + v + ')(' + o.B + ')=' + mid + v + '\\ne ' + o.A * o.B + v) + '.',
          { bad: [['(' + o.A + v + '+' + o.B + ')^{2}'], [tx(full)]] });
      } },
      { id: '10d', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { A: r.pick([1, 1, 2, 3]), B: r.int(2, 9) }; }, function (o) { return gcd(o.A, o.B) === 1 && !(o.A === 1 && o.B === 6); });
        var v = letter(r), Av = M(o.A, oneV(v)), full = P.sub(P.add(P.pow(Av, 2), P.scale(Av, -2 * o.B)), N(o.B * o.B));
        return notPsPart(full, 'The last term ' + t(-o.B * o.B) + ' is negative, so it is not ' + t('B^{2}') + '.', { bad: [['(' + tx(P.sub(Av, N(o.B))) + ')^{2}'], [tx(full)]] });
      } },
      { id: '10e', level: 'PRG', make: function (r) { var pr = two(r); return psPart(sqTri(r, { p: pos(2, 9), r: 0, q: negr(1, 7), s: 0, test: function (o) { return o.p !== -o.q; } }, { v: pr[0], w: pr[1] })); } },
      { id: '10f', level: 'PRG', make: function (r) { return psPart(sqTri(r, { p: pos(2, 5), r: 0, q: { of: [1, 2, 3, 5] }, s: 0, test: function (o) { return o.p !== o.q; } }, { v: letter(r) }), { asc: true }); } }] },
    { num: '11', section: 'Completing a perfect square', stem: 'Fill in the blank so that each trinomial is a perfect square. Use a positive middle term where there is a choice.', parts: [
      { id: '11a', level: 'EMG', make: function (r) {
        var b = pickWhere(function () { return r.int(3, 12); }, function (b) { return b !== 6 && b !== 9; }), mid = M(2 * b, { x: 1 });
        return B.poly('Fill in the blank: ' + t('x^{2}+\\square+' + b * b), mid, { before: t('x^{2}+'), after: t('+' + b * b), wrong: [{ is: M(b, { x: 1 }), code: 'u4l2-no-double', hint: 'The middle term is ' + t('2AB') + ', not ' + t('AB') + ': double it.' }, { is: M(b * b, { x: 1 }), code: 'u4l2-no-double', hint: 'The middle term is ' + t('2AB=2(x)(' + b + ')') + '.' }] },
          t('A=x') + ', ' + t('B=' + b) + ': ' + t('2AB=2(x)(' + b + ')=' + tx(mid)) + '. So ' + t('x^{2}+' + tx(mid) + '+' + b * b + '=(x+' + b + ')^{2}') + '.', ['Write it as ' + t('A^{2}+2AB+B^{2}') + ': what are ' + t('A') + ' and ' + t('B') + '?', 'The middle term is ' + t('2AB') + '.'], 'complete the square: middle');
      } },
      { id: '11b', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { A: r.int(2, 9), b: r.int(1, 9) }; }, function (o) { return gcd(o.A, o.b) === 1 && !(o.A === 8 && o.b === 3) && !(o.A === 3 && o.b === 2); }), mid = M(2 * o.A * o.b, { x: 1 });
        var p = B.poly('Fill in the blank: ' + t(o.A * o.A + 'x^{2}-\\square+' + o.b * o.b), mid, { before: t(o.A * o.A + 'x^{2}-'), after: t('+' + o.b * o.b), wrong: [{ is: M(o.A * o.b, { x: 1 }), code: 'u4l2-no-double', hint: 'The middle term is ' + t('2AB') + ', not ' + t('AB') + '.' }] },
          t('A=' + o.A + 'x') + ', ' + t('B=' + o.b) + ': ' + t('2AB=2(' + o.A + 'x)(' + o.b + ')=' + tx(mid)) + '. So ' + t(o.A * o.A + 'x^{2}-' + tx(mid) + '+' + o.b * o.b + '=(' + o.A + 'x-' + o.b + ')^{2}') + '.', ['' + t(o.A * o.A + 'x^{2}=(' + o.A + 'x)^{2}') + ' and ' + t(o.b * o.b + '=' + o.b + '^{2}') + '.', 'The middle term is ' + t('2AB') + ' (the minus sign is already there).'], 'complete the square: middle');
        var base = p.check; p.check = function (resp) { var s = String(resp == null ? '' : resp).replace(/\s/g, ''); if (/^-/.test(s)) { var r2 = base(s.slice(1)); if (r2.v === 'correct') return form('u4l2-minus-shown', 'The minus sign is already written before the blank — type the term without it.'); } return base(resp); };
        return p;
      } },
      { id: '11c', level: 'EMG', make: function (r) {
        var v = letter(r), o = pickWhere(function () { return { A: r.int(2, 9), b: r.int(2, 9) }; }, function (o) { return gcd(o.A, o.b) === 1 && !(o.A === 5 && o.b === 7) && !(o.A === 4 && o.b === 5); });
        return B.number('Fill in the blank: ' + t(o.A * o.A + v + '^{2}+' + 2 * o.A * o.b + v + '+\\square'), o.b * o.b, function (x) { if (x === o.b) return { code: 'u4l2-not-squared', hint: 'That is ' + t('B') + '. The last term is ' + t('B^{2}') + '.' }; if (x === 2 * o.b || x === o.A * o.b) return { code: 'u4l2-pair', hint: 'Find ' + t('B') + ' from ' + t('2AB=' + 2 * o.A * o.b + v) + ' with ' + t('A=' + o.A + v) + ', then square it.' }; return null; },
          t(2 * o.A * o.b + v + '=2(' + o.A + v + ')B\\Rightarrow B=' + o.b) + ', so the blank is ' + t('B^{2}=' + o.b * o.b) + ': ' + t('(' + o.A + v + '+' + o.b + ')^{2}') + '.', ['' + t('A=' + o.A + v) + '. Solve ' + t('2AB=' + 2 * o.A * o.b + v) + ' for ' + t('B') + '.', 'The blank is ' + t('B^{2}') + '.'], 'complete the square: last term');
      } },
      { id: '11d', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { A: r.int(2, 9), b: r.int(1, 7) }; }, function (o) { return gcd(o.A, o.b) === 1 && !(o.A === 9 && o.b === 2) && !(o.A === 3 && o.b === 7); }), first = M(o.A * o.A, { x: 2 });
        return B.poly('Fill in the blank: ' + t('\\square-' + 2 * o.A * o.b + 'xy+' + o.b * o.b + 'y^{2}'), first, { after: t('-' + 2 * o.A * o.b + 'xy+' + o.b * o.b + 'y^{2}'), wrong: [{ is: M(o.A, { x: 1 }), code: 'u4l2-not-squared', hint: 'That is ' + t('A') + '. The first term is ' + t('A^{2}') + '.' }, { is: M(o.A, { x: 2 }), code: 'u4l2-not-squared', hint: 'Square the whole of ' + t('A=' + o.A + 'x') + ': ' + t('(' + o.A + 'x)^{2}') + '.' }] },
          t('B=' + o.b + 'y') + '; ' + t(2 * o.A * o.b + 'xy=2A(' + o.b + 'y)\\Rightarrow A=' + o.A + 'x') + ', so the blank is ' + t('A^{2}=' + tx(first)) + ': ' + t('(' + o.A + 'x-' + o.b + 'y)^{2}') + '.', ['' + t(o.b * o.b + 'y^{2}=(' + o.b + 'y)^{2}') + ', so ' + t('B=' + o.b + 'y') + '. Solve ' + t('2AB=' + 2 * o.A * o.b + 'xy') + ' for ' + t('A') + '.', 'The blank is ' + t('A^{2}') + '.'], 'complete the square: first term');
      } },
      { id: '11e', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { d: r.pick([2, 3, 4, 5]), b: r.int(2, 9) }; }, function (o) { return gcd(o.d, o.b) === 1 && !(o.d === 2 && o.b === 3); });
        var mid = M([2 * o.b, o.d], { x: 1 }), half = M([o.b, o.d], { x: 1 });
        return B.poly('Fill in the blank: ' + t('\\frac{1}{' + o.d * o.d + '}x^{2}+\\square+' + o.b * o.b), mid, { before: t('\\frac{1}{' + o.d * o.d + '}x^{2}+'), after: t('+' + o.b * o.b), wrong: [{ is: half, code: 'u4l2-no-double', hint: 'The middle term is ' + t('2AB') + ', not ' + t('AB') + '.' }] },
          t('A=\\frac{1}{' + o.d + '}x') + ', ' + t('B=' + o.b) + ': ' + t('2AB=2\\left(\\frac{1}{' + o.d + '}x\\right)(' + o.b + ')=' + tx(mid)) + '. So ' + t('\\left(\\frac{1}{' + o.d + '}x+' + o.b + '\\right)^{2}') + '.', ['' + t('\\frac{1}{' + o.d * o.d + '}x^{2}=\\left(\\frac{1}{' + o.d + '}x\\right)^{2}') + '.', 'The middle term is ' + t('2AB') + '.'], 'complete the square: fraction');
      } }] },
    { num: '12', section: 'Factor fully', stem: 'Factor fully.', parts: [
      { id: '12a', level: 'EMG', make: function (r) { return fac(r, { p: pos(2, 9), r: 0, q: { of: [-1, -2, -3, -5] }, s: 0, square: true }, null, { ps: true }); } },
      { id: '12b', level: 'PRG', make: function (r) { return fac(r, { p: pos(2, 9), r: 0, q: pos(2, 5), s: 0, square: true, test: function (o) { return o.p !== o.q; } }, { v: letter(r) }, { ps: true, asc: true }); } },
      { id: '12c', level: 'PRG', make: function (r) { return fac(r, { q: { of: [-7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6] }, s: 0, square: true }, { k: r.int(2, 5) }, { ps: true }); } },
      { id: '12d', level: 'PRG', make: function (r) { var pr = two(r); return fac(r, { p: pos(2, 7), r: 0, q: pos(1, 7), s: 0, square: true, test: function (o) { return o.p !== o.q; } }, { v: pr[0], w: pr[1] }, { ps: true }); } }] },
    { num: '13', section: 'Problem solving', shared: posterShared,
      stem: function (sh) { var A = P.mul(lin(sh.p, sh.q), lin(sh.rr, -sh.s)); return 'A rectangular poster has an area of ' + t('(' + tx(A) + ')\\ \\text{cm}^{2}') + '. It is mounted in a frame that is ' + t(sh.f) + ' cm wide on every side.'; },
      parts: [
        { id: '13a', level: 'PRG', make: function (r, sh) {
          var T = U.Tri({ p: sh.p, q: sh.q, r: sh.rr, s: -sh.s });
          return U.twoPolys('Factor to find the poster’s dimensions.', [T.F1, T.F2], ['Length (cm)', 'Width (cm)'], U.sol(T) + '<br>The poster is ' + t(br(T.F1)) + ' cm by ' + t(br(T.F2)) + ' cm.',
            ['Factor the area by decomposition: ' + t('ac=' + T.ac) + ', sum ' + t(T.b) + '.', 'The two brackets are the length and the width.'], 'poster dimensions');
        } },
        { id: '13b', level: 'PRG', make: function (r, sh) {
          var L = lin(sh.p, sh.q + 2 * sh.f), W = lin(sh.rr, -sh.s + 2 * sh.f), p = U.twoPolys('Write expressions for the outer length and width of the frame.', [L, W], ['Outer length (cm)', 'Outer width (cm)'],
            'Add ' + t(sh.f) + ' cm on <b>each</b> side (' + t(2 * sh.f) + ' cm in all): ' + t(br(lin(sh.p, sh.q)) + '+' + 2 * sh.f + '=' + tx(L)) + ' and ' + t(br(lin(sh.rr, -sh.s)) + '+' + 2 * sh.f + '=' + tx(W)) + '.',
            ['The frame adds ' + t(sh.f) + ' cm at both ends of each side.', 'Outer length ' + t('=') + ' poster length ' + t('+2(' + sh.f + ')') + '.'], 'frame outer dimensions');
          var base = p.check, once = [lin(sh.p, sh.q + sh.f), lin(sh.rr, -sh.s + sh.f)];
          p.check = function (resp) { var res = base(resp); if (res.v === 'correct') return res; var a = (resp || []).map(function (x) { var rr = K.read(x || ''); if (rr.res) return null; var q = P.read(rr.ast); return q.ok ? q.p : null; }); if (a.some(function (q) { return q && once.some(function (o) { return P.eq(q, o); }); })) return wrong('u4l2-frame-once', 'The frame is on <b>both</b> ends: add ' + t(sh.f) + ' cm twice to each dimension (' + t(2 * sh.f) + ' cm).'); return res; };
          return p;
        } },
        { id: '13c', level: 'ADV', make: function (r, sh) {
          var F1 = lin(sh.p, sh.q), F2 = lin(sh.rr, -sh.s), L = lin(sh.p, sh.q + 2 * sh.f), W = lin(sh.rr, -sh.s + 2 * sh.f), inner = P.mul(F1, F2), outer = P.mul(L, W), fr = P.sub(outer, inner);
          return B.poly('Find and simplify an expression for the area of the frame alone.', fr, { wrong: [{ is: outer, code: 'u4l2-outer', hint: 'That is the area of the whole thing. Subtract the poster’s area.' }, { is: P.neg(fr), code: 'u4l2-frame-sign', hint: 'Subtract the poster from the outer rectangle (outer − poster), not the other way round.' }] },
            t(br(L) + br(W) + '-(' + tx(inner) + ')=' + tx(outer) + '-' + tx(inner).replace(/^/, '(') + ')') + '<br>' + t('=' + tx(fr)) + ' (cm²)',
            ['Frame area ' + t('=') + ' outer area ' + t('-') + ' poster area.', 'Expand the outer area, then subtract every term of the poster’s area (use brackets).'], 'frame area');
        } },
        { id: '13d', level: 'ADV', make: function (r, sh) {
          var X = sh.X, A1 = (sh.p * X + sh.q + 2 * sh.f) * (sh.rr * X - sh.s + 2 * sh.f), A0 = (sh.p * X + sh.q) * (sh.rr * X - sh.s), ans = A1 - A0;
          var fr = P.sub(P.mul(lin(sh.p, sh.q + 2 * sh.f), lin(sh.rr, -sh.s + 2 * sh.f)), P.mul(lin(sh.p, sh.q), lin(sh.rr, -sh.s)));
          return B.number('Find the area of the frame when ' + t('x=' + X) + '.', ans, function (v) { if (v === A1) return { code: 'u4l2-outer', hint: 'That is the outer area. Subtract the poster’s area.' }; if (v === A0) return { code: 'u4l2-outer', hint: 'That is the poster’s area.' }; return null; },
            t(tx(fr) + '=' + P.coef(fr, { x: 1 })[0] + '(' + X + ')' + sg(P.constant(fr)[0]) + '=' + ans) + ' cm². (Check: ' + t((sh.p * X + sh.q + 2 * sh.f) + '\\times' + (sh.rr * X - sh.s + 2 * sh.f) + '-' + (sh.p * X + sh.q) + '\\times' + (sh.rr * X - sh.s) + '=' + A1 + '-' + A0 + '=' + ans) + '.)',
            ['Substitute ' + t('x=' + X) + ' into your frame-area expression.', 'Check with the dimensions: outer area minus poster area.'], 'frame area value', { after: 'cm²' });
        } }] },
    { num: '14', section: 'Multiple choice and numerical response', parts: [
      { id: '14', level: 'PRG', make: function (r) { return oneFactorMC(r, tri(r, { p: pos(2, 3), r: pos(2, 3), q: negr(1, 3), s: pos(1, 3), test: function (o) { return o.p !== o.r && o.b !== 0; } }, { k: r.int(2, 4) })); } }] },
    { num: '15', parts: [
      { id: '15', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 5), b: r.int(2, 7), c: r.int(2, 4), d: r.int(1, 5), e: r.int(2, 9), A: r.int(1, 3), Bb: r.int(2, 9) }; }, function (o) { return gcd(o.a, o.b) === 1 && gcd(o.c, o.d) === 1 && o.c !== o.d && gcd(o.A, o.Bb) === 1 && !(o.A === 1 && o.Bb === 8); });
        var pr = r.pick([['a', 'b'], ['x', 'y'], ['m', 'n']]), y = r.pick(['y', 't', 'k']);
        var s1 = '(' + o.a + pr[0] + '-' + o.b + pr[1] + ')^{2}', p1 = P.pow(P.sub(M(o.a, oneV(pr[0])), M(o.b, oneV(pr[1]))), 2);
        var p2 = P.pow(lin(o.c, o.d), 2), s2 = '(' + o.c + 'x+' + o.d + ')^{2}';
        var p3 = P.pow(P.sub(N(1), M(1, oneV(y))), 2), s3 = '(1-' + y + ')^{2}';
        var bad = halfMid(o.A, o.Bb, 'x'), At = (o.A === 1 ? '' : o.A) + 'x';
        return B.mc(r, 'Which trinomial is <b>not</b> a perfect square?', [
          { html: t(tx(p1)), why: 'It is: ' + t(tx(p1) + '=' + s1) + '.' }, { html: t(tx(p2)), why: 'It is: ' + t(tx(p2) + '=' + s2) + '.' },
          { html: t(tx(bad)), right: true }, { html: t(tx(p3, { order: 'asc' })), why: 'It is: ' + t(tx(p3, { order: 'asc' }) + '=' + s3) + '.' }],
          t(tx(bad)) + ': ' + t('2(' + At + ')(' + o.Bb + ')=' + 2 * o.A * o.Bb + 'x\\ne ' + o.A * o.Bb + 'x') + '. The others are ' + t(s1) + ', ' + t(s2) + ' and ' + t(s3) + '.',
          ['For each, find ' + t('A') + ' and ' + t('B') + ' from the first and last terms.', 'Is the middle term ' + t('2AB') + '?'], 'which is not a perfect square');
      } }] },
    { num: '16', parts: [
      { id: '16', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { al: r.int(2, 5), be: r.pick([-7, -5, -4, -3, -2, -1, 1, 2, 3, 5]), ga: r.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]) }; },
          function (o) { var k = o.al * o.ga + o.be, ds = [k, -k, o.al * o.ga - o.be, o.be + o.ga]; return gcd(o.al, o.be) === 1 && k !== 0 && ds.every(function (x, i) { return ds.indexOf(x) === i; }) && o.be * o.ga < 0 && !(o.al === 2 && o.be === -3 && o.ga === 5); });
        var k = o.al * o.ga + o.be, c = o.be * o.ga, F1 = lin(o.al, o.be), F2 = lin(1, o.ga);
        return B.mc(r, 'If ' + t(o.al + 'x^{2}+kx' + sg(c) + '=' + br(F1) + br(F2)) + ', then the value of ' + t('k') + ' is', [
          { html: t(k), right: true }, { html: t(-k), why: 'Check the signs of the two middle products: ' + t(o.al + 'x(' + o.ga + ')') + ' and ' + t(par(o.be) + '(x)') + '.' },
          { html: t(o.al * o.ga - o.be), why: 'The inside product is ' + t(par(o.be) + '\\cdot x=' + o.be + 'x') + ' — keep its sign.' },
          { html: t(o.be + o.ga), why: 'Multiply before adding: the outside product is ' + t(o.al + 'x\\cdot' + par(o.ga) + '=' + o.al * o.ga + 'x') + '.' }],
          'The middle term is ' + t(o.al + 'x(' + o.ga + ')+(' + o.be + ')(x)=' + o.al * o.ga + 'x' + sg(o.be) + 'x=' + k + 'x') + ', so ' + t('k=' + k) + '.',
          ['Expand the right side: the middle term comes from the outside and inside products.', 'Add them, keeping their signs.'], 'k from a factoring');
      } }] },
    { num: '17', parts: [
      { id: '17', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 9), b: r.int(1, 9), c: r.int(1, 9), d: r.int(1, 9) }; },
          function (o) { return gcd(o.a, o.b) === 1 && gcd(o.c, o.d) === 1 && o.a * o.d - o.b * o.c !== 0 && (o.a !== o.c || o.b !== o.d) && !(o.a === 5 && o.b === 2 && o.c === 3 && o.d === 4) && o.a * o.c > 2; });
        var T = U.Tri({ p: o.a, q: -o.b, r: o.c, s: o.d }), ans = 1000 * o.a + 100 * o.b + 10 * o.c + o.d;
        return B.nr('<i>(Numerical Response)</i> The trinomial ' + t(T.tex) + ' can be written in the form ' + t('(ax-b)(cx+d)') + ', where ' + t('a, b, c') + ' and ' + t('d') + ' are positive integers. Record ' + t('a') + ' in the first box, ' + t('b') + ' in the second, ' + t('c') + ' in the third and ' + t('d') + ' in the fourth.', ans,
          function (v) { if (v === 1000 * o.c + 100 * o.d + 10 * o.a + o.b) return { code: 'u4l2-digits', hint: 'The bracket with the minus sign is ' + t('(ax-b)') + ': its numbers go in the first two boxes.' }; if (v === 1000 * o.a + 100 * o.d + 10 * o.c + o.b) return { code: 'u4l2-digits', hint: 'Check which number goes with which bracket.' }; return null; },
          U.sol(T) + '<br>' + t('a=' + o.a + ',\\ b=' + o.b + ',\\ c=' + o.c + ',\\ d=' + o.d) + ': ' + t(ans),
          ['Factor by decomposition: ' + t('ac=' + T.ac) + ', sum ' + t(T.b) + '.', 'Match your factors to ' + t('(ax-b)(cx+d)') + ': the bracket with the minus sign comes first.'], 'decomposition to digits');
      } }] },
    { num: '18', parts: [
      { id: '18', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { A: r.int(2, 9), Bb: r.int(2, 9) }; }, function (o) { return gcd(o.A, o.Bb) === 1 && !(o.A === 2 && o.Bb === 5) && 2 * o.A * o.Bb < 10000; });
        var b = 2 * o.A * o.Bb;
        return B.nr('<i>(Numerical Response)</i> The trinomial ' + t(o.A * o.A + 'x^{2}+bx+' + o.Bb * o.Bb) + ' is a perfect square and ' + t('b>0') + '. The value of ' + t('b') + ' is ____.', b,
          function (v) { if (v === o.A * o.Bb) return { code: 'u4l2-no-double', hint: 'The middle term is ' + t('2AB') + ', not ' + t('AB') + '.' }; if (v === o.A * o.A + o.Bb * o.Bb) return { code: 'u4l2-pair', hint: 'Find ' + t('A') + ' and ' + t('B') + ' (the square roots of the first and last terms) and use ' + t('2AB') + '.' }; return null; },
          t(o.A * o.A + 'x^{2}+bx+' + o.Bb * o.Bb + '=(' + o.A + 'x+' + o.Bb + ')^{2}') + ', so ' + t('b=2(' + o.A + ')(' + o.Bb + ')=' + b) + '.',
          ['' + t('A=' + o.A + 'x') + ' and ' + t('B=' + o.Bb) + '.', 'The middle term of a perfect square is ' + t('2AB') + '.'], 'b for a perfect square');
      } }] }
  ];
  function splitT(T) { return U.splitTex(T); }

  var EXTRA = [
    { num: 'A1', section: 'A. Skills', stem: 'Factor.', parts: [
      { id: 'A1a', level: 'EMG', make: function (r) { return fac(r, { p: PRIME, q: pos(1, 5), s: pos(2, 7) }); } },
      { id: 'A1b', level: 'EMG', make: function (r) { return fac(r, { p: PRIME, q: negr(1, 7), s: negr(1, 5), test: function (o) { return o.b !== 0; } }); } },
      { id: 'A1c', level: 'PRG', make: function (r) { return fac(r, { p: { of: [2, 3] }, r: { of: [2, 3] }, q: negr(1, 5), s: pos(1, 5), test: function (o) { return o.p === o.r && o.b !== 0; } }); } },
      { id: 'A1d', level: 'PRG', make: function (r) { return fac(r, { p: pos(2, 4), r: pos(2, 3), q: pos(1, 5), s: negr(1, 5), test: function (o) { return o.p !== o.r && o.b < 0; } }); } },
      { id: 'A1e', level: 'EMG', make: function (r) { return fac(r, { p: PRIME, q: negr(1, 2), s: negr(3, 7) }); } },
      { id: 'A1f', level: 'PRG', make: function (r) { return fac(r, { p: pos(2, 5), r: pos(2, 3), q: negr(1, 3), s: pos(1, 5), test: function (o) { return o.p !== o.r && o.b > 0 && o.a >= 6; } }); } }] },
    { num: 'A2', stem: 'Factor fully.', parts: [
      { id: 'A2a', level: 'PRG', make: function (r) { return fac(r, { p: { of: [2, 3] }, q: pos(1, 3), s: pos(2, 6) }, { k: r.int(2, 5) }); } },
      { id: 'A2b', level: 'PRG', make: function (r) { var v = letter(r), gv = {}; gv[v] = 1; return fac(r, { p: { of: [2, 3] }, q: pos(1, 5), s: negr(1, 5), test: function (o) { return o.b < 0; } }, { v: v, k: r.int(2, 4), gv: gv }); } },
      { id: 'A2c', level: 'PRG', make: function (r) { return fac(r, { p: pos(2, 3), r: pos(2, 3), q: negr(1, 3), s: pos(1, 3), test: function (o) { return o.p !== o.r && o.b !== 0; } }, { v: letter(r), k: r.int(2, 6) }); } }] },
    { num: 'A3', stem: 'Factor.', parts: [
      { id: 'A3a', level: 'EMG', make: function (r) { var pr = two(r); return fac(r, { p: { of: [2, 3, 5] }, q: pos(1, 5), s: pos(1, 5) }, { v: pr[0], w: pr[1] }); } },
      { id: 'A3b', level: 'PRG', make: function (r) { var pr = two(r); return fac(r, { p: { of: [2, 3, 5] }, q: pos(1, 5), s: negr(1, 5), test: function (o) { return o.b < 0; } }, { v: pr[0], w: pr[1] }); } },
      { id: 'A3c', level: 'PRG', make: function (r) { var pr = two(r); return fac(r, { p: pos(2, 4), r: pos(2, 4), q: negr(1, 5), s: negr(1, 5), test: function (o) { return o.p !== o.r; } }, { v: pr[0], w: pr[1] }); } }] },
    { num: 'B1', section: 'B. Applying', stem: 'Factor fully.', parts: [
      { id: 'B1a', level: 'PRG', make: function (r) { return fac(r, { p: { of: [2, 3, 5] }, q: negr(1, 7), s: pos(1, 6), test: function (o) { return o.b > 0; } }, { k: -1 }); } },
      { id: 'B1b', level: 'ADV', make: function (r) { return fac(r, { p: pos(2, 4), r: pos(1, 3), q: pos(1, 7), s: negr(1, 5), test: function (o) { return o.a >= 4 && o.b !== 0 && o.p !== o.r; } }, { k: -1 }, { asc: true }); } }] },
    { num: 'B2', stem: 'Factor fully.', parts: [
      { id: 'B2a', level: 'PRG', make: function (r) { var d = r.pick([2, 3, 4]); return fac(r, { q: pos(2, 10), s: negr(1, 8), test: function (o) { return o.b % d === 0 && o.c % d === 0 && o.b !== 0; } }, { k: [1, d] }, { intBrackets: true }); } },
      { id: 'B2b', level: 'PRG', make: function (r) { var d = r.pick([2, 3, 4, 5]); return fac(r, { q: negr(2, 10), s: pos(1, 8), test: function (o) { return o.b % d === 0 && o.c % d === 0 && o.b !== 0; } }, { k: [1, d] }, { intBrackets: true }); } },
      { id: 'B2c', level: 'ADV', make: function (r) { var nd = r.pick([[2, 3], [2, 5], [3, 5], [3, 4], [2, 7], [3, 7]]); return fac(r, { q: pos(1, 5), s: pos(1, 6), test: function (o) { return o.q < o.s; } }, { k: nd }, { intBrackets: true }); } }] },
    { num: 'B3', parts: [
      { id: 'B3a', level: 'EMG', make: function (r) { var T = sqTri(r, { p: pos(2, 9), r: 0, q: negr(1, 9), s: 0, test: function (o) { return o.p !== -o.q; } }); var p = psPart(T); p.prompt = 'Is ' + p.prompt + ' a perfect-square trinomial? If so, factor it (or press <b>none</b>).'; return p; } },
      { id: 'B3b', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { A: r.int(2, 9), b: r.int(1, 9) }; }, function (o) { return gcd(o.A, o.b) === 1 && !(o.A === 6 && o.b === 5); }), mid = M(2 * o.A * o.b, { x: 1 });
        return B.poly('Fill in the blank to make a perfect square: ' + t(o.A * o.A + 'x^{2}+\\square+' + o.b * o.b), mid, { before: t(o.A * o.A + 'x^{2}+'), after: t('+' + o.b * o.b), wrong: [{ is: M(o.A * o.b, { x: 1 }), code: 'u4l2-no-double', hint: 'The middle term is ' + t('2AB') + ', not ' + t('AB') + '.' }] },
          t('2(' + o.A + 'x)(' + o.b + ')=' + tx(mid)), ['' + t('A=' + o.A + 'x') + ', ' + t('B=' + o.b) + '.', 'The middle term is ' + t('2AB') + '.'], 'complete the square');
      } },
      { id: 'B3c', level: 'PRG', make: function (r) { return fac(r, { p: pos(2, 7), r: 0, q: pos(1, 5), s: 0, square: true, test: function (o) { return o.p !== o.q; } }, { k: r.int(2, 5) }, { ps: true }); } }] },
    { num: 'B4', shared: function (r) { return pickWhere(function () { return { p: r.int(2, 5), q: r.int(1, 7), rr: r.int(2, 4), s: r.int(1, 7), X: r.int(3, 9) }; }, function (o) { return gcd(o.p, o.q) === 1 && gcd(o.rr, o.s) === 1 && o.p !== o.rr && o.p * o.X - o.q >= 2 && o.p * o.q !== o.rr * o.s && -o.p * o.s + o.q * o.rr !== 0 && !(o.p === 4 && o.q === 5 && o.rr === 2 && o.s === 3); }); },
      stem: function (sh) { return 'A rectangle has an area of ' + t('(' + tx(P.mul(lin(sh.p, -sh.q), lin(sh.rr, sh.s))) + ')\\ \\text{m}^{2}') + '.'; },
      parts: [
        { id: 'B4a', level: 'PRG', make: function (r, sh) { var T = U.Tri({ p: sh.p, q: -sh.q, r: sh.rr, s: sh.s }); return U.twoPolys('Factor to find expressions for its dimensions.', [T.F1, T.F2], ['Length (m)', 'Width (m)'], U.sol(T), ['Decompose: ' + t('ac=' + T.ac) + ', sum ' + t(T.b) + '.', 'The two brackets are the dimensions.'], 'rectangle dimensions'); } },
        { id: 'B4b', level: 'PRG', make: function (r, sh) {
          var Pp = P.add(P.scale(lin(sh.p, -sh.q), 2), P.scale(lin(sh.rr, sh.s), 2));
          return B.poly('Write and simplify an expression for its perimeter.', Pp, { wrong: [{ is: P.add(lin(sh.p, -sh.q), lin(sh.rr, sh.s)), code: 'u4l1-half-perim', hint: 'That is length + width. The perimeter is ' + t('2l+2w') + '.' }] },
            t('2' + br(lin(sh.p, -sh.q)) + '+2' + br(lin(sh.rr, sh.s)) + '=' + tx(Pp)) + ' (m)', ['Factor the area first to get the dimensions.', 'Perimeter ' + t('=2l+2w') + '; collect like terms.'], 'rectangle perimeter');
        } },
        { id: 'B4c', level: 'PRG', make: function (r, sh) {
          var X = sh.X, a = sh.p * X - sh.q, b = sh.rr * X + sh.s, Pm = 2 * (a + b), cs = [K.number(a), K.number(b)], cP = K.number(Pm, function (v) { if (v === a + b) return { code: 'u4l1-half-perim', hint: 'That is half the perimeter.' }; if (v === a * b) return { code: 'u4l1-area', hint: 'That is the area.' }; return null; });
          return { prompt: 'Find the dimensions and perimeter when ' + t('x=' + X) + '.', input: { type: 'fields', fields: [{ name: 'Length', label: 'Length', after: 'm' }, { name: 'Width', label: 'Width', after: 'm' }, { name: 'Perimeter', label: 'Perimeter', after: 'm' }] },
            check: function (resp) { resp = resp || []; var d = U.eitherOrder(cs, ['Length', 'Width'])([resp[0], resp[1]]); if (d.v !== 'correct') return d; return labelled(cP(resp[2] == null ? '' : resp[2]), 'Perimeter'); },
            key: [String(Math.max(a, b)), String(Math.min(a, b)), String(Pm)], answer: t(Math.max(a, b)) + ' m by ' + t(Math.min(a, b)) + ' m; perimeter ' + t(Pm) + ' m',
            solution: 'When ' + t('x=' + X) + ': ' + t(br(lin(sh.p, -sh.q)) + '=' + a) + ' m and ' + t(br(lin(sh.rr, sh.s)) + '=' + b) + ' m; perimeter ' + t('2(' + a + ')+2(' + b + ')=' + Pm) + ' m.',
            hints: ['Substitute ' + t('x=' + X) + ' into each dimension.', 'Use your perimeter expression, or ' + t('2l+2w') + '.'], text: 'dimensions and perimeter', good: [[String(Math.min(a, b)), String(Math.max(a, b)), String(Pm)]], bad: [[String(a), String(b), String(a + b)]] };
        } }] },
    { num: 'B5', parts: [
      { id: 'B5', level: 'PRG', make: function (r) { var T = tri(r, { p: pos(2, 3), r: pos(2, 3), q: negr(1, 3), s: pos(1, 3), test: function (o) { return o.p !== o.r && o.b !== 0; } }); return oneFactorMC(r, T, 'Which binomial is a factor of ' + t(T.tex) + '?'); } }] },
    { num: 'B6', parts: [
      { id: 'B6', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { P: r.pick([2, 3, 5, 7]), a: r.int(1, 9), b: r.int(1, 9) }; }, function (o) { return gcd(o.P, o.a) === 1 && o.a - o.P * o.b !== 0 && !(o.P === 5 && o.a === 3 && o.b === 2); });
        var T = U.Tri({ p: o.P, q: o.a, r: 1, s: -o.b }), ans = 10 * o.a + o.b;
        return B.nr('<i>(Numerical Response)</i> The trinomial ' + t(T.tex) + ' can be written as ' + t('(' + o.P + 'x+a)(x-b)') + ', where ' + t('a') + ' and ' + t('b') + ' are positive integers. Record ' + t('a') + ' in the first box and ' + t('b') + ' in the second box.', ans,
          function (v) { if (v === 10 * o.b + o.a) return { code: 'u4l2-digits', hint: t('a') + ' goes in the first box and ' + t('b') + ' in the second.' }; return null; },
          U.sol(T) + '<br>' + t('a=' + o.a + ',\\ b=' + o.b) + ': ' + t(ans), ['Decompose: ' + t('ac=' + T.ac) + ', sum ' + t(T.b) + '.', 'Match your factors to ' + t('(' + o.P + 'x+a)(x-b)') + '.'], 'decomposition to digits');
      } }] },
    { num: 'C1', section: 'C. Stretch', parts: [
      { id: 'C1', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { return { A: r.pick([2, 3, 5]), C: r.pick([2, 3, 4, 5, 6, 8, 9]) }; }, function (o) { return !(o.A === 3 && o.C === 4) && gcd(o.A, o.C) === 1 && posPairs(o.A * o.C).length >= 2; });
        var ac = o.A * o.C, vals = [];
        posPairs(ac).forEach(function (pq) { var s = pq[0] + pq[1]; if (vals.indexOf(s) < 0) vals.push(s, -s); });
        return U.valuesPart('Find all integers ' + t('k') + ' so that ' + t(o.A + 'x^{2}+kx+' + o.C) + ' can be factored over the integers.', vals, 'k',
          t('ac=' + ac) + '. Pairs: ' + posPairs(ac).map(function (pq) { return t(pq[0] + ',\\ ' + pq[1]); }).join('; ') + ' and their negatives. ' + t('k') + ' is a pair’s sum: ' + t('k=' + vals.filter(function (x) { return x > 0; }).map(function (x) { return '\\pm ' + x; }).join(',\\ ')) + '.',
          ['It factors when two integers have product ' + t('ac=' + ac) + ' and sum ' + t('k') + '.', 'List every factor pair of ' + t(ac) + ' — positive and negative.'], 'all k for ' + o.A + 'x^2+kx+' + o.C,
          function (A, T) { var tp = T.filter(function (x) { return x > 0; }); if (A.length === tp.length && tp.every(function (x) { return A.indexOf(x) >= 0; })) return { code: 'u4l1-no-negatives', hint: 'Negative pairs work too: two negative numbers also multiply to ' + t(ac) + '.' }; return null; });
      } }] },
    { num: 'C2', shared: function (r) { return pickWhere(function () { var rr = r.int(1, 3); return { p: r.int(rr + 1, rr + 3), q: r.int(1, 7), rr: rr, s: r.int(1, 7) }; }, function (o) { return gcd(o.p, o.q) === 1 && gcd(o.rr, o.s) === 1 && (o.q + o.s) % (o.p - o.rr) === 0 && (o.q + o.s) / (o.p - o.rr) >= 2 && o.p * o.s !== o.q * o.rr && !(o.p === 3 && o.q === 2 && o.rr === 2 && o.s === 3); }); },
      stem: function (sh) { return 'A rectangle has an area of ' + t('(' + tx(P.mul(lin(sh.p, -sh.q), lin(sh.rr, sh.s))) + ')\\ \\text{cm}^{2}') + ' and a length of ' + t('(' + tx(lin(sh.p, -sh.q)) + ')') + ' cm.'; },
      parts: [
        { id: 'C2a', level: 'ADV', make: function (r, sh) { var T = U.Tri({ p: sh.p, q: -sh.q, r: sh.rr, s: sh.s }), W = T.F2; return B.poly('Find its width.', W, {}, U.sol(T) + '<br>The width is ' + t(br(W)) + ' cm.', ['Factor the area; one factor is the length ' + t(br(T.F1)) + '.', 'Decompose: ' + t('ac=' + T.ac) + ', sum ' + t(T.b) + '.'], 'width from area'); } },
        { id: 'C2b', level: 'MAS', make: function (r, sh) {
          var X = (sh.q + sh.s) / (sh.p - sh.rr), side = sh.p * X - sh.q, area = side * side;
          var cX = K.number(X, function (v) { if (v * (sh.p + sh.rr) === sh.s - sh.q) return { code: 'u4l2-square-x', hint: 'A square has length = width: solve ' + t(tx(lin(sh.p, -sh.q)) + '=' + tx(lin(sh.rr, sh.s))) + '.' }; return null; }), cA = K.number(area, function (v) { if (v === side) return { code: 'u4l2-side', hint: 'That is the side. The area is the side squared.' }; if (v === 4 * side) return { code: 'u4l1-area', hint: 'That is the perimeter.' }; return null; });
          return B.fields('For what value of ' + t('x') + ' is the rectangle a square? What is the square’s area?', [{ name: 'x', label: t('x=') }, { name: 'Area', label: 'Area', after: 'cm²' }], [cX, cA], [String(X), String(area)], t('x=' + X) + '; ' + t(area) + ' cm²',
            'Square when length = width: ' + t(tx(lin(sh.p, -sh.q)) + '=' + tx(lin(sh.rr, sh.s)) + '\\Rightarrow x=' + X) + '. Side ' + t(side) + ' cm, area ' + t(area) + ' cm² (check: ' + t(tx(P.mul(lin(sh.p, -sh.q), lin(sh.rr, sh.s))) + '\\text{ at }x=' + X) + ' gives ' + t(area) + ').',
            ['Factor to get the width first.', 'A square has length = width. Solve, then square the side.'], 'square from a rectangle');
        } }] },
    { num: 'C3', parts: [
      { id: 'C3', level: 'ADV', make: function (r) {
        var k = r.pick([[1, 5], [1, 2], [1, 10], [3, 10]]), dec = String(k[0] / k[1]);
        var T = tri(r, { p: pos(2, 3), q: pos(1, 3), s: negr(1, 5), test: function (o) { return o.b !== 0; } }, { k: k });
        var shown = tx(T.full, { dec: true }), keyTex = dec + br(T.F1) + br(T.F2);
        var sol = 'Take out ' + t(dec) + ' (each term ' + t('\\div ' + dec) + '): ' + t(shown + '=' + dec + '(' + T.innerTex + ')') + '.<br>' + U.pairLine(T) + '<br>' + t(T.innerTex + '=' + U.splitTex(T) + '=' + U.groupTex(T)) + '<br>So ' + t(shown + '=' + dec + br(T.F2) + br(T.F1)) + '.';
        return U.facPart(T, { prompt: t(shown), keyTex: keyTex, sol: sol, intBrackets: true, hints: ['Take out ' + t(dec) + ' first so the bracket has whole numbers (dividing by ' + t(dec) + ' is multiplying by ' + t(k[1] / k[0] % 1 ? '\\frac{' + k[1] + '}{' + k[0] + '}' : k[1] / k[0]) + ').', 'Then decompose the trinomial in the bracket.'], text: 'factor with decimals ' + shown });
      } }] },
    { num: 'C4', parts: [
      { id: 'C4', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { return { b: r.int(5, 11), c: r.pick([2, 3, 5]) }; }, function (o) { var n = 0; for (var m = 1; m < o.b; m++) if ((m * (o.b - m)) % o.c === 0) n++; return n >= 2 && !(o.b === 7 && o.c === 3); });
        var ks = [], lines = [];
        for (var m = 1; m <= o.b / 2; m++) { var pr = m * (o.b - m); lines.push(t(m + ',\\ ' + (o.b - m)) + ' (product ' + t(pr) + ')'); if (pr % o.c === 0 && ks.indexOf(pr / o.c) < 0) ks.push(pr / o.c); }
        return U.valuesPart('Find all positive integers ' + t('k') + ' so that ' + t('kx^{2}+' + o.b + 'x+' + o.c) + ' can be factored over the integers.', ks, 'k',
          'We need two integers with product ' + t(o.c + 'k') + ' and sum ' + t(o.b) + '; both are positive. Pairs with sum ' + t(o.b) + ': ' + lines.join(', ') + '.<br>' + t(o.c + 'k') + ' must be one of those products (a multiple of ' + t(o.c) + '), so ' + t('k=' + ks.join(',\\ ')) + '.',
          ['' + t('ac=' + o.c + 'k') + ': you need two positive integers with sum ' + t(o.b) + ' and product ' + t(o.c + 'k') + '.', 'List the pairs that add to ' + t(o.b) + '; which products are multiples of ' + t(o.c) + '?'], 'all positive k for kx^2+' + o.b + 'x+' + o.c,
          function (A) { if (A.some(function (x) { return x <= 0 || x % 1; })) return { code: 'u4l1-k-positive', hint: t('k') + ' has to be a positive integer.' }; return null; });
      } }] }
  ];

  HW.defineLesson({ id: 'u4l2', unit: 4, num: '2', title: 'Factoring ax² + bx + c', outcome: 'RF1', calc: true, questions: QUESTIONS, extra: EXTRA });
})(typeof window !== 'undefined' ? window : globalThis);
