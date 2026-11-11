/* Math 20-1 · Unit 4 · Lesson 8 — Unit 4 Review (outcome per part: RF1 factoring, RF5 solving quadratics, AN3 radical equations)
 * Assignment 8, a practice test (u4_l08.tex, Questions 1–27) and the Lesson 8 Extra Practice, a second practice test
 * (u4_ep08.tex: Multiple Choice 1–10, Numerical Response 11–14, Written Response 15–18). Extra ids start with E.
 * Every part is a generator: the booklet question's idea, form and difficulty with new numbers (the lesson's example
 * numbers and the booklet's own numbers are left out where feasible). No calculator (Unit 4): exact answers.
 *
 * Uses the Unit 4 kits (load order): HW.u4kit (u4l1.js: trinomials, GCF, grouping, "none" boxes), HW.p43 (u4l3.js:
 * substitution, factored-answer parts), HW.u4rad (u4l6.js: restrictions, roots with "no solution", one-radical equations)
 * and HW.u4r7 (u4l7.js: radical equations that lead to quadratics, squaring twice, u = √x).
 * Added here: differences of squares of monomials (with a GCF, splitting again, fractions) and of binomials
 * (a²(U)² − b²(V)², the minus not distributed, square roots not taken), a "factor or say none" wrapper for any factoring
 * part, sums of squares (none), solving by factoring (roots in any order; sign slips, fraction roots upside down, the root
 * x = 0 or a bracket's root lost by dividing), "an equation with these roots" (any multiple nudged to the smallest
 * integer coefficients, factored form nudged to standard form, opposite-sign roots recognised), two pairs of integers.
 * Conversions: "explain the error" (Ava, Ben) and "explain why an extraneous root may appear" → multiple choice of
 * explanations; "explain how zeros and x-intercepts are related" and "explain why there are two times" → in the solution.
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: 4(f), 24, Extra 15(c), 18(c). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, B = K.P, ex = HW.ex, P = HW.poly, FX = HW.factor, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var LID = 'u4l8', U = HW.u4kit, X = HW.p43, R = HW.u4rad, U7 = HW.u4r7;
  if (!U || !X || !R || !U7) throw new Error(LID + '.js needs u4l1.js, u4l3.js, u4l6.js and u4l7.js loaded first');
  var Q = R.Q, qq = R.qq, qv = R.qv, qmul = R.qmul, qadd = R.qadd, qdiv = R.qdiv, rT = R.rT, pT = R.pT, linT = R.linT, fracOf = R.fracOf;
  var gcd = U7.gcd, same = U7.same, range = U7.range, pm = U7.pm, negs = U7.negs, pickWhere = U7.pickWhere, has = U7.has, sameSet = U7.sameSet, facTex = U7.facTex, rootsLine = U7.rootsLine, isInt = U7.isInt;
  var M = U.M, V = U.V, N = U.N, tx = U.tx, lin = U.lin;

  HW.addCodes({
    'u4l8-bin-sign': 'Common binomial: sign of the other factor', 'u4l8-dos-sq': 'Difference of squares written as a square', 'u4l8-dos-root': 'Difference of squares: didn’t take the square roots',
    'u4l8-dist': 'Minus sign not distributed over a bracket', 'u4l8-sumsq': 'Factored a sum of squares', 'u4l8-sign': 'Roots with the wrong signs', 'u4l8-recip': 'Fraction root upside down',
    'u4l8-lost-zero': 'Lost the root x = 0 (divided by x)', 'u4l8-lost-root': 'Lost a root by dividing by a bracket', 'u4l8-ignore-k': 'Ignored the number on the right side',
    'u4l8-eq-sign': 'Equation: roots with the wrong signs', 'u4l8-eq-smallest': 'Equation: not the smallest integer coefficients', 'u4l8-eq-expand': 'Equation: not in standard form',
    'u4l8-one-pair': 'Gave only one of the two answers', 'u4l8-reject': 'Kept a root that must be rejected', 'u4l8-t0': 'Gave the starting height / launch time', 'u4l8-h': 'Free fall: didn’t square (or square root)',
    'u4l8-digits': 'NR: numbers in the wrong boxes', 'u4l8-half': 'Perfect square: middle term not doubled', 'u4l8-deck': 'Deck: used the total area instead of the deck alone', 'u4l8-sub': 'Didn’t substitute back'
  });
  HW.addPartial({ 'u4l8-bin-sign': 's', 'u4l8-dos-sq': 'b', 'u4l8-dos-root': 'b', 'u4l8-dist': 's', 'u4l8-sumsq': 's', 'u4l8-sign': 's', 'u4l8-recip': 's', 'u4l8-lost-zero': 'b', 'u4l8-lost-root': 'b',
    'u4l8-eq-sign': 'b', 'u4l8-one-pair': 's', 'u4l8-reject': 's', 'u4l8-h': 'b', 'u4l8-digits': 's', 'u4l8-half': 's', 'u4l8-deck': 'b', 'u4l8-sub': 'b' });

  /* the booklet's and the examples' trinomials (letters as x and y) — never generated */
  var AVOID = ['4x^3-8x^2-60x', '10x^2-11xy-6y^2', '2x^2+5x-12', '6x^3+x^2-2x', '6x^2-7x-3', '2x^2-x-6', 'x^2-4xy-21y^2', '2x^2+6x-56', '12x^2-7x-10', '-3x^2+10x+8', '8x^2+10xy-3y^2',
    '25x^2-30x+9', '18x^3-3x^2-6x', '6x^2-x-15', '12x^2+7x-10', 'x^2-2xy-24y^2', 'x^2+9xy+20y^2', '10x^2+13x-3', '8x^2-2x-15', '6x^2-x-12', '-2x^3+4x^2+30x', '2x^2+5x-3', '10x^2+3x-4',
    '9x^2-12x+4', 'x^2-11x+24', '4x^2+20x+25', '4x^2-12x+9', 'x^2-3x-10', '2x^2-2x-12'];
  var tri = U.triMaker(AVOID, LID);
  var RF1 = 'RF1', RF5 = 'RF5', AN3 = 'AN3';
  function F(n) { return HW.fmt(n); }
  function sgn(n) { return n < 0 ? '-' + (-n) : '+' + n; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  /* ============================== factoring ============================== */
  /* any factoring part → one box with a "none" key */
  function noneWrap(p, vars) {
    var chk = p.check, vs = vars || (p.input && p.input.vars) || ['x'];
    return { prompt: p.prompt, input: { type: 'fields', fields: U.noneField(vs) }, key: [p.key], answer: p.answer, solution: p.solution, hints: p.hints, text: p.text,
      check: function (resp) {
        var v = U.noneVal(resp);
        if (!v) return form('empty', 'Type the factored form, or press <b>none</b> if it can’t be factored.');
        if (/^none$/i.test(v)) return wrong('u4-said-none', 'It <b>can</b> be factored. Start with the greatest common factor, then count the terms (two: difference of squares; three: trinomial; four: grouping).');
        return chk(v);
      }, good: (p.good || []).map(function (g) { return [g]; }), bad: [['none']].concat((p.bad || []).map(function (b) { return [b]; })) };
  }
  /* a sum of squares a²x² + b²(y²) — does not factor */
  function sumSqNone(r, avoid) {
    var o = pickWhere(function () { return { a: r.int(1, 9), b: r.int(1, 9), y: r.chance(0.3) }; }, function (o) { return gcd(o.a, o.b) === 1 && !(o.a === 2 && o.b === 5 && !o.y) && !(avoid && avoid(o)); });
    var Tt = o.y ? P.add(M(o.a * o.a, { x: 2 }), M(o.b * o.b, { y: 2 })) : P.add(M(o.a * o.a, { x: 2 }), N(o.b * o.b)), vs = o.y ? ['x', 'y'] : ['x'], Bt = o.y ? o.b + 'y' : String(o.b), At = (o.a === 1 ? '' : o.a) + 'x';
    return { prompt: t(tx(Tt)), input: { type: 'fields', fields: U.noneField(vs) }, key: ['none'], answer: 'It does not factor: it is a <b>sum</b> of squares.',
      solution: t(tx(Tt) + '=(' + At + ')^{2}+(' + Bt + ')^{2}') + ' is a <b>sum</b> of squares, and it has no common factor: it does not factor. (' + t('(' + At + '-' + Bt + ')(' + At + '+' + Bt + ')') + ' multiplies to a <b>difference</b>, ' + t(tx(P.sub(M(o.a * o.a, { x: 2 }), o.y ? M(o.b * o.b, { y: 2 }) : N(o.b * o.b)))) + '.)',
      hints: ['Is it a difference of squares, or a sum?', 'A sum of squares ' + t('A^{2}+B^{2}') + ' does not factor (when there is no common factor).'], text: 'sum of squares (none)',
      check: function (resp) {
        var s = U.noneVal(resp);
        if (!s) return form('empty', 'Type the factored form, or press <b>none</b> if it can’t be factored.');
        if (/^none$/i.test(s)) return ok();
        var rr = K.read(s); if (rr.res) return rr.res;
        var spl = FX.split(rr.ast); if (!spl.ok) return wrong('value', null);
        var S = spl.factors.reduce(function (acc, f) { return P.mul(acc, P.pow(f.p, f.k)); }, N(1));
        if (P.eq(S, Tt)) return form('u4-use-none', 'That is the expression itself. If it can’t be factored, press <b>none</b>.');
        return wrong('u4l8-sumsq', 'Your factors multiply to ' + t(tx(S)) + ', not ' + t(tx(Tt)) + '. A <b>sum</b> of squares does not factor: press <b>none</b>.');
      }, bad: [['(' + At + '-' + Bt + ')(' + At + '+' + Bt + ')'], ['(' + At + '+' + Bt + ')^{2}']] };
  }
  function sqT(m) { var s = tx(m); return /^([0-9]+|[a-z])$/.test(s) ? s + '^{2}' : '(' + s + ')^{2}'; }
  /* g·(A² − B²) with monomials A, B (A, B may have fraction coefficients) */
  function dosMono(o) {
    var A = o.A, Bm = o.Bm, g = o.g || 1, D = P.sub(P.pow(A, 2), P.pow(Bm, 2)), expr = P.mul(N(g), D);
    var col = X.collect([N(g), P.sub(A, Bm), P.add(A, Bm)], true), key = o.key || X.cTex(col);
    var L = [];
    if (g !== 1) L.push('GCF first: ' + t(tx(expr) + '=' + g + '(' + tx(D) + ')'));
    L.push('Difference of squares: ' + t(tx(D) + '=' + sqT(A) + '-' + sqT(Bm)) + ' &nbsp;⇒&nbsp; ' + t('(' + tx(P.sub(A, Bm)) + ')(' + tx(P.add(A, Bm)) + ')'));
    var Am = X.sqrtMono(P.terms(A)[0]), Bq = X.sqrtMono(P.terms(Bm)[0]);
    if (Am && Bq) L.push(t(tx(P.sub(A, Bm))) + ' is a difference of squares again: ' + t('(' + tx(P.sub(Am, Bq)) + ')(' + tx(P.add(Am, Bq)) + ')') + '. ' + t(tx(P.add(A, Bm))) + ' is a sum of squares: it does not factor.');
    L.push('So ' + t(tx(expr) + '=' + key) + '.');
    var ws = [{ is: [N(g), { p: P.sub(A, Bm), k: 2 }], code: 'u4l8-dos-sq', hint: 'A difference of squares factors into two <b>different</b> brackets: ' + t('A^{2}-B^{2}=(A-B)(A+B)') + '. Your answer multiplies to ' + t(tx(P.mul(N(g), P.pow(P.sub(A, Bm), 2)))) + '.' },
      { is: [N(g), P.sub(P.pow(A, 2), Bm), P.add(P.pow(A, 2), Bm)], code: 'u4l8-dos-root', hint: 'Take the <b>square roots</b>: ' + t(tx(D) + '=' + sqT(A) + '-' + sqT(Bm)) + ', so the brackets hold ' + t(tx(A)) + ' and ' + t(tx(Bm)) + '.' }];
    if (g !== 1) ws.push({ is: col.br.map(function (b) { return { p: b.p, k: b.k }; }), code: 'p43-lost-gcf', hint: 'Your brackets are right, but the common factor ' + t(String(g)) + ' has gone missing. It stays in front.' });
    if (Am && Bq) ws.push({ is: [N(g), P.sub(Am, Bq), P.add(Am, Bq), P.sub(Am, Bq), P.add(Am, Bq)], code: 'p43-sum-sq', hint: t(tx(P.add(A, Bm))) + ' is a <b>sum</b> of squares — it does not factor.' });
    return X.fx({ prompt: o.prompt || t(tx(expr)), key: key, ws: ws, sol: L.join('<br>'), text: o.text || 'difference of squares ' + tx(expr),
      hints: [(g !== 1 ? 'Take out the common factor ' + t(String(g)) + ' first. ' : '') + 'Write it as ' + t('A^{2}-B^{2}') + ': what are ' + t('A') + ' and ' + t('B') + '?', t('A^{2}-B^{2}=(A-B)(A+B)') + '. Check every factor again: can one be factored further?'],
      good: o.good, vars: o.vars });
  }
  /* a²(U)² − b²(V)² with U, V binomials (V may be the number 1) */
  function dosBin(o) {
    var a = o.a, b = o.b, Uu = o.U, Vv = o.V, uT = X.ut(Uu), vNum = P.count(Vv) === 1 && !P.vars(Vv).length;
    var aU = P.scale(Uu, a), bV = P.scale(Vv, b), F1 = P.sub(aU, bV), F2 = P.add(aU, bV), col = X.collect([F1, F2], true), key = X.cTex(col);
    var shownU = (a * a === 1 ? '' : a * a) + '(' + uT + ')^{2}', shownV = vNum ? String(b * b) : (b * b === 1 ? '' : b * b) + '(' + X.ut(Vv) + ')^{2}', shown = shownU + '-' + shownV;
    var aUt = a === 1 ? '(' + uT + ')' : a + '(' + uT + ')', bVt = vNum ? String(b) : (b === 1 ? '(' + X.ut(Vv) + ')' : b + '(' + X.ut(Vv) + ')');
    var simp = '(' + tx(F1) + ')(' + tx(F2) + ')';
    var L = ['Difference of squares with ' + t('A=' + aUt) + ' and ' + t('B=' + bVt) + ':', t('=\\left[' + aUt + '-' + bVt + '\\right]\\left[' + aUt + '+' + bVt + '\\right]'), t('=' + simp) + (simp !== key ? '<br>' + t('=' + key) + ' &nbsp; (take out the common factor)' : '')];
    var ws = [], vts = P.sorted(bV);
    if (!vNum && vts.length > 1) { var lead = P.mono(vts[0].c, vts[0].v), rest = P.sub(bV, lead), F1w = P.add(P.sub(aU, lead), rest); ws.push({ is: [F1w, F2], code: 'u4l8-dist', hint: 'Subtracting a bracket changes the sign of <b>every</b> term in it: ' + t('-' + bVt + '=' + tx(P.neg(bV))) + '.' }); }
    ws.push({ is: [P.sub(P.scale(Uu, a * a), P.scale(Vv, b * b)), P.add(P.scale(Uu, a * a), P.scale(Vv, b * b))], code: 'u4l8-dos-root', hint: 'Take the square roots: ' + t(shown + '=\\left[' + aUt + '\\right]^{2}-\\left[' + bVt + '\\right]^{2}') + '.' });
    if (!X.isOne(col.mono)) ws.push({ is: col.br.map(function (bb) { return { p: bb.p, k: bb.k }; }), code: 'p43-lost-gcf', hint: 'Taking a common factor out of a bracket doesn’t make it disappear: it moves in front.' });
    return X.fx({ prompt: o.prompt || t(shown), key: key, ws: ws, sol: L.join('<br>'), text: o.text || 'difference of squares of binomials',
      hints: ['It is ' + t('A^{2}-B^{2}') + ' with ' + t('A=' + aUt) + ' and ' + t('B=' + bVt) + '. Keep each part in brackets.', 'Write ' + t('[A-B][A+B]') + ', then simplify inside each bracket (the minus applies to every term of ' + t('B') + ') and take out any common factor.'], exprTex: shown });
  }
  function shown(e) { return e; }
  /* (y + k)(ay − b) from ay(y + k) − b(y + k) */
  function binCommon(r) {
    var v = r.pick(['y', 'x', 'a', 'm']);
    var o = pickWhere(function () { return { a: r.int(2, 9), b: r.int(1, 9), k: r.pick(pm(1, 9)), neg: r.chance(0.7) }; }, function (o) { return gcd(o.a, o.b) === 1 && !(o.a === 7 && o.b === 2 && o.k === 5) && o.a * o.k !== o.b; });
    var Fb = lin(1, o.k, v), G = lin(o.a, o.neg ? -o.b : o.b, v), bt = '(' + tx(Fb) + ')';
    var expr = o.a + v + bt + (o.neg ? '-' : '+') + o.b + bt;
    var p = B.factored(t(expr), [Fb, G], { wrong: [{ is: [Fb, lin(o.a, o.neg ? o.b : -o.b, v)], code: 'u4l8-bin-sign', hint: 'Check the sign of the second term in your second bracket: it comes from ' + t((o.neg ? '-' : '+') + o.b + bt) + '.' }] },
      'The common factor is the binomial ' + t(bt) + ': ' + t(expr + '=' + bt + '(' + tx(G) + ')'), ['Both terms contain the same bracket ' + t(bt) + ': take it out as a common factor.', 'What is left from each term goes in the second bracket.'], 'common binomial factor');
    p.bad = ['(' + tx(Fb) + ')(' + tx(lin(o.a, o.neg ? o.b : -o.b, v)) + ')'];
    return p;
  }
  /* grouping (x + a)(x² + b) */
  function groupNice(r, avoid) {
    var v = 'x', o = pickWhere(function () { return { a: r.pick(pm(1, 9)), b: r.int(1, 9) }; }, function (o) { return !(avoid || []).some(function (z) { return z[0] === o.a && z[1] === o.b; }); });
    return U.groupPart(V(v, 2), N(o.b), V(v), N(o.a));
  }
  /* "is it a factor?" style MC helpers: distinct option texts */
  function distinct(list) { return list.every(function (x, i) { return list.indexOf(x) === i; }); }

  /* ============================== solving ============================== */
  function roots2(fs) { var out = []; fs.forEach(function (f) { var r = Q(-f[1], f[0]); if (!out.some(function (s) { return s[0] === r[0] && s[1] === r[1]; })) out.push(r); }); return out; }
  function expandF(g, fs) { var p = [g]; fs.forEach(function (f) { var n = []; for (var i = 0; i <= p.length; i++) n[i] = (i < p.length ? p[i] * f[1] : 0) + (i > 0 ? p[i - 1] * f[0] : 0); p = n; }); return p; } // low → high
  function solveQ(prompt, roots, o) {
    o = o || {}; var v = o.v || 'x', T = roots.map(qv);
    var diag = function (A) {
      var cs = o.cands || [];
      for (var i = 0; i < cs.length; i++) if (sameSet(A, cs[i].vals.map(qv))) return { code: cs[i].code, hint: cs[i].hint };
      if (T.length > 1 && has(T, 0) && sameSet(A, T.filter(function (x) { return !same(x, 0); }))) return { code: 'u4l8-lost-zero', hint: 'There is another root: never divide both sides by ' + t(v) + ' — factor it out. The factor ' + t(v) + ' gives ' + t(v + '=0') + '.' };
      if (o.lost && sameSet(A, T.filter(function (x) { return !same(x, qv(o.lost)); }))) return { code: 'u4l8-lost-root', hint: 'You’ve lost a root: dividing both sides by a bracket throws away the value that makes it ' + t('0') + '. Expand, move every term to one side and factor instead.' };
      if (A.length === T.length && !sameSet(A, T) && A.every(function (x) { return has(T, x) || T.some(function (y) { return y && same(x, 1 / y); }); })) return { code: 'u4l8-recip', hint: 'A fraction root is upside down: ' + t('q' + v + '-p=0') + ' gives ' + t(v + '=\\frac{p}{q}') + ' (divide by the coefficient of ' + t(v) + ').' };
      if (A.length === T.length && !sameSet(A, T) && A.every(function (x) { return has(T, x) || has(T, -x); }) && !A.every(function (x) { return has(T, -x); })) return { code: 'u4l8-sign', hint: 'Check the sign of each root: ' + t('(' + v + '-3)=0') + ' gives ' + t(v + '=3') + ', and ' + t('(2' + v + '+5)=0') + ' gives ' + t(v + '=-\\frac{5}{2}') + '.' };
      return null;
    };
    var keyTex = o.keyTex || roots.map(function (x) { return v + '=' + rT(x); }).join(',\\ ');
    var p = K.P.valueSet(prompt, roots, { v: v, keyTex: keyTex, diag: diag }, o.sol, o.hints || ['Move every term to one side so the other side is ' + t('0') + ', take out any common factor and factor fully.', 'Set each factor that contains ' + t(v) + ' equal to ' + t('0') + ' and solve.'], o.text);
    p.bad = (o.cands || []).map(function (c) { return c.vals.map(function (x) { return v + '=' + rT(fracOf(qv(x))); }).join(','); });
    if (roots.length > 1) p.good = [roots.slice().reverse().map(function (x) { return v + '=' + rT(x); }).join(',')];
    return p;
  }
  /* zero-product lines for g·Π(a v + b) */
  function zLines(g, fs, v) {
    v = v || 'x';
    var rs = roots2(fs), p = expandF(g, fs), A = p[2], Bc = p[1], C = p[0];
    var fac = facTex(A, rs.length === 1 && fs.length === 2 ? [rs[0]] : rs, v);
    return { std: pT([[A, 2], [Bc, 1], [C, 0]], v), fac: fac, roots: rs, A: A, B: Bc, C: C, line: t(fac + '=0') + ', so ' + rootsLine(rs, v) + (rs.length === 1 ? ' (a double root)' : '') + '.' };
  }
  /* an equation with the given roots: polynomial box with "= 0" after */
  function eqPart(prompt, roots, o) {
    o = o || {}; var v = 'x', fs = roots.map(function (r) { r = qq(r); return [r[1], -r[0]]; });
    var pp = expandF(1, fs), g = gcd(gcd(pp[2], pp[1]), pp[0]) || 1, T = [pp[2] / g, pp[1] / g, pp[0] / g], key = pT([[T[0], 2], [T[1], 1], [T[2], 0]]);
    var check = function (resp) {
      var s = String(resp == null ? '' : resp).replace(/\\left|\\right/g, '');
      if (!s.replace(/\s|\\[ ,;:!]/g, '')) return form('empty', 'Type your answer first.');
      var sides = s.split('='); if (sides.length > 2) return form('unreadable', 'Write one equation.');
      var polys = [], asts = [];
      for (var i = 0; i < sides.length; i++) {
        if (!sides[i].replace(/\s|\\[ ,;:!]/g, '')) { polys.push(N(0)); asts.push(null); continue; }
        var a = K.read(sides[i]); if (a.res) return a.res;
        var rd = P.read(a.ast); if (!rd.ok) return wrong('value', 'Multiply your factors out.');
        polys.push(rd.p); asts.push(a.ast);
      }
      var S = polys.length === 2 ? P.sub(polys[0], polys[1]) : polys[0];
      if (P.vars(S).some(function (x) { return x !== v; })) return form('sol-letter', 'Use the variable ' + t(v) + ' only.');
      if (P.degree(S) !== 2) return wrong('value', 'A quadratic equation comes from multiplying two linear factors, one for each root.');
      var c2 = qv(P.coef(S, { x: 2 })), c1 = qv(P.coef(S, { x: 1 })), c0 = qv(P.coef(S, {})), lam = c2 / T[0];
      if (same(c1, lam * T[1]) && same(c0, lam * T[2])) {
        for (var j = 0; j < asts.length; j++) if (asts[j]) { var fi = P.formIssue(asts[j]); if (fi && fi.code !== 'not-poly') return form('u4l8-eq-expand', 'Right roots — now expand and collect like terms: standard form ' + t('ax^{2}+bx+c=0') + '.'); }
        if (polys.length === 2 && !P.isZero(polys[0]) && !P.isZero(polys[1])) return form('u4l8-eq-expand', 'Right roots — now move every term to one side: ' + t('ax^{2}+bx+c=0') + '.');
        if (same(lam, 1)) return ok();
        return form('u4l8-eq-smallest', 'Right roots — now give it with the <b>smallest</b> integer coefficients (and a positive ' + t('x^{2}') + ' term).');
      }
      var D = c1 * c1 - 4 * c2 * c0, Tv = roots.map(qv);
      if (D >= 0) { var s1 = (-c1 + Math.sqrt(D)) / (2 * c2), s2 = (-c1 - Math.sqrt(D)) / (2 * c2); var Sv = Tv.length === 1 ? [s1] : [s1, s2]; if (sameSet(Sv.map(function (x) { return -x; }), Tv) && !sameSet(Sv, Tv)) return wrong('u4l8-eq-sign', 'Your equation has the roots with the opposite signs. A root ' + t('x=r') + ' comes from the factor ' + t('(x-r)') + '; a root ' + t('\\frac{p}{q}') + ' from ' + t('(qx-p)') + '.'); }
      return wrong('value', 'Your equation doesn’t have the given roots. Write one factor for each root and multiply them.');
    };
    var steps = roots.map(function (r) { r = qq(r); return t('x=' + rT(r)) + ' gives the factor ' + t('(' + linT(r[1], -r[0]) + ')'); }).join('; ');
    return { prompt: prompt, input: { type: 'math', keys: 'poly', vars: [v], after: t('=0'), placeholder: 'e.g. 2x^2 - 7x - 4' }, check: check, key: key, answer: t(key + '=0'),
      solution: steps + '.<br>' + t(fs.map(function (f) { return '(' + linT(f[0], f[1]) + ')'; }).join('') + '=0') + ' &nbsp;⇒&nbsp; ' + t(key + '=0'),
      hints: ['Work backwards: a root ' + t('x=r') + ' gives the factor ' + t('(x-r)') + ', and a root ' + t('\\frac{p}{q}') + ' gives ' + t('(qx-p)') + '.', 'Multiply the factors and write ' + t('ax^{2}+bx+c=0') + '.'], text: o.text || 'equation from its roots',
      bad: [pT([[T[0], 2], [-T[1], 1], [T[2], 0]]), pT([[2 * T[0], 2], [2 * T[1], 1], [2 * T[2], 0]])].filter(function (b) { return b !== key; }), good: [key + '=0'] };
  }
  /* two pairs of integers in any order */
  function twoPairs(prompt, pA, pB, o) {
    o = o || {};
    var fields = [{ label: 'One pair:', name: 'First pair' }, { label: 'and', name: 'First pair' }, { label: 'Another pair:', name: 'Second pair' }, { label: 'and', name: 'Second pair' }];
    var check = function (resp) {
      resp = resp || []; var vals = [];
      for (var i = 0; i < 4; i++) { var s = String(resp[i] == null ? '' : resp[i]).trim(); if (!s) { vals.push(null); continue; } var pr = HW.parse.number(s); if (!pr.ok) return form('notnumber', 'Type one integer in each box.'); vals.push(pr.value); }
      if (vals.every(function (x) { return x == null; })) return form('empty', 'Type your answer first.');
      var rows = [[vals[0], vals[1]], [vals[2], vals[3]]], isP = function (rw, pr) { return rw[0] != null && rw[1] != null && sameSet(rw, pr); };
      var r0 = isP(rows[0], pA) ? 'A' : isP(rows[0], pB) ? 'B' : null, r1 = isP(rows[1], pA) ? 'A' : isP(rows[1], pB) ? 'B' : null;
      if (r0 && r1 && r0 !== r1) return ok();
      if (r0 && r1) return wrong('u4l8-one-pair', 'You gave the same pair twice. The quadratic has two roots, so there are two different pairs.');
      var oneBlank = rows.some(function (rw) { return rw[0] == null && rw[1] == null; });
      if ((r0 || r1) && oneBlank) return wrong('u4l8-one-pair', 'That pair works — but the other root of the quadratic gives a second pair that also works. Find it and check it.');
      if (rows.some(function (rw) { return rw[0] == null || rw[1] == null; }) && !(r0 || r1)) return form('blank', 'Fill in both numbers of each pair.');
      if (r0 || r1) return wrong('value', 'One pair is right. Check the other pair.');
      return wrong('value', null);
    };
    return { prompt: prompt, input: { type: 'fields', fields: fields }, check: check, key: [String(pA[0]), String(pA[1]), String(pB[0]), String(pB[1])], answer: t(pA[0] + '\\text{ and }' + pA[1]) + ', or ' + t(pB[0] + '\\text{ and }' + pB[1]),
      solution: o.sol, hints: o.hints || [], text: o.text, bad: [[String(pA[0]), String(pA[1]), '', ''], [String(pA[0]), String(pA[1]), String(pA[0]), String(pA[1])]], good: [[String(pB[1]), String(pB[0]), String(pA[1]), String(pA[0])]] };
  }

  /* ============================== generators used more than once ============================== */
  function triFac(r, sp, extra, o) { return U.facPart(tri(r, sp, extra), o); }
  function triCan(r, sp, extra, o) { return U.canPart(tri(r, sp, extra), o); }
  /* MC: one factor of ax² + bx + c */
  function oneFactorMC(r, avoidAB) {
    var T = pickWhere(function () { return tri(r, { p: [2, 5], q: { of: pm(1, 7) }, r: [1, 4], s: { of: pm(1, 7) } }); }, function (T) {
      if (T.a > 15 || !T.b || (avoidAB && avoidAB(T))) return false;
      var opts = [tx(T.F1), tx(lin(T.p, -T.q)), tx(lin(T.r, -T.s)), tx(lin(T.a, T.q))];
      return distinct(opts) && opts.slice(1).every(function (s) { return s !== tx(T.F2); });
    });
    return B.mc(r, 'One factor of ' + t(T.tex) + ' is', [{ html: t(tx(T.F1)), right: true },
      { html: t(tx(lin(T.p, -T.q))), why: 'Close — but check the sign: expand ' + t('(' + tx(lin(T.p, -T.q)) + ')(' + tx(lin(T.r, -T.s)) + ')') + ' and compare the middle term.' },
      { html: t(tx(lin(T.r, -T.s))), why: 'Check the signs: the factors are ' + t(br2(T)) + '.' },
      { html: t(tx(lin(T.a, T.q))), why: 'Splitting the middle term and grouping gives two brackets; ' + t(tx(lin(T.a, T.q))) + ' isn’t one of them.' }],
      t('ac=' + T.ac) + ', sum ' + t(String(T.b)) + ': ' + t(T.m + ',\\ ' + T.n) + '. ' + t(T.tex + '=' + U.splitTex(T) + '=' + U.groupTex(T) + '=' + br2(T)) + '.', ['Factor by decomposition: two numbers with product ' + t('ac=' + T.ac) + ' and sum ' + t(String(T.b)) + '.', 'Split the middle term, group, and read off the factors.'], 'MC: one factor of a trinomial');
  }
  function br2(T) { return U.br(T.F2) + U.br(T.F1); }
  /* NR: (ax − b)(cx + d) */
  function nrDigits(r, avoid) {
    var o = pickWhere(function () { return { a: r.int(2, 9), b: r.int(1, 9), c: r.int(1, 9), d: r.int(1, 9) }; }, function (o) {
      return gcd(o.a, o.b) === 1 && gcd(o.c, o.d) === 1 && o.a * o.c <= 30 && o.a * o.d !== o.b * o.c && !(avoid || []).some(function (z) { return z.join() === [o.a, o.b, o.c, o.d].join(); }) && !(o.c === 1 && o.a === 1);
    });
    var T = U.Tri({ p: o.a, q: -o.b, r: o.c, s: o.d }), ans = 1000 * o.a + 100 * o.b + 10 * o.c + o.d;
    return B.nr('<i>(Numerical Response)</i> The expression ' + t(T.tex) + ' can be written in the form ' + t('(ax-b)(cx+d)') + ', where ' + t('a, b, c') + ' and ' + t('d') + ' are positive integers. Write the value of ' + t('a') + ' in the first box, ' + t('b') + ' in the second, ' + t('c') + ' in the third and ' + t('d') + ' in the fourth.', ans,
      function (v) { if (v === 1000 * o.c + 100 * o.d + 10 * o.a + o.b) return { code: 'u4l8-digits', hint: 'The bracket with the minus sign is ' + t('(ax-b)') + ': its numbers go in the first two boxes.' }; if (v === 1000 * o.a + 100 * o.d + 10 * o.c + o.b) return { code: 'u4l8-digits', hint: 'Check which number goes with which bracket.' }; return null; },
      U.sol(T) + '<br>So ' + t('a=' + o.a + ',\\ b=' + o.b + ',\\ c=' + o.c + ',\\ d=' + o.d) + ': ' + t(String(ans)) + '.', U.hints(T), 'NR: (ax − b)(cx + d)');
  }
  /* a ball's height h = −5(t − T)(t + s) */
  function ballShared(r, avoid) {
    return pickWhere(function () { var T = r.int(3, 8), s = r.int(1, 3), sum = T - s, t1 = r.int(1, Math.max(1, sum - 1)); return { T: T, s: s, t1: t1, t2: sum - t1 }; }, function (o) {
      return o.t1 >= 1 && o.t2 > o.t1 && o.t1 * o.t2 < o.T * o.s + 0 && !(avoid || []).some(function (z) { return z[0] === o.T && z[1] === o.s; });
    });
  }
  function ballH(s) { s.b = 5 * (s.T - s.s); s.c = 5 * s.T * s.s; s.H = s.c - 5 * s.t1 * s.t2; return s; }
  function ballPartGround(r, s, what) {
    var q = zLines(-5, [[1, -s.T], [1, s.s]], 't');
    return B.number('When does the ball ' + (what || 'hit the ground') + '?', s.T, function (v) { if (same(v, -s.s)) return { code: 'u4l8-reject', hint: 'Time after the throw can’t be negative: reject that root.' }; if (same(v, 0)) return { code: 'u4l8-t0', hint: t('t=0') + ' is the start. Solve ' + t('h=0') + '.' }; return null; },
      t(pT([[-5, 2], [s.b, 1], [s.c, 0]], 't') + '=0') + ' &nbsp;⇒&nbsp; ' + t('-5(' + pT([[1, 2], [-(s.T - s.s), 1], [-s.T * s.s, 0]], 't') + ')=0') + ' &nbsp;⇒&nbsp; ' + t('-5(t-' + s.T + ')(t+' + s.s + ')=0') + '<br>' + t('t=' + s.T) + ' s (' + t('t=' + (-s.s)) + ' is inadmissible: time after the throw can’t be negative).',
      ['Set ' + t('h=0') + ' and take out the common factor ' + t('-5') + '.', 'Factor the trinomial; reject a negative time.'], 'projectile: when it lands', { after: 's' });
  }
  function ballPartTimes(r, s) {
    var A = -5, Bc = s.b, C = s.c - s.H, ts = [Q(s.t1, 1), Q(s.t2, 1)];
    return solveQ('At what times is the ball ' + t(String(s.H)) + ' m high? (Then think about why there are two answers.)', ts, { v: 't', text: 'projectile: two times at a height',
      sol: t(pT([[-5, 2], [s.b, 1], [s.c, 0]], 't') + '=' + s.H) + ' &nbsp;⇒&nbsp; ' + t(pT([[A, 2], [Bc, 1], [C, 0]], 't') + '=0') + ' &nbsp;⇒&nbsp; ' + t('-5(t-' + s.t1 + ')(t-' + s.t2 + ')=0') + '<br>' + t('t=' + s.t1) + ' s (on the way up) and ' + t('t=' + s.t2) + ' s (on the way down): the ball passes that height twice.',
      hints: ['Set ' + t('h=' + s.H) + ', move it to the left side and take out ' + t('-5') + '.', 'Factor; both times are admissible.'] });
  }
  /* restriction MC √(x − a) = √(b − x) + c etc. */
  function radMC(r, E, what) {
    var x1 = rT(E.r1), x2 = rT(E.r2);
    return B.mc(r, 'The extraneous root of the equation ' + t(E.tex) + ' is', [{ html: t(x2), right: true }, { html: t(x1), why: 'Check it: ' + E.checks[x1].line }, { html: t(rT(qmul(E.r2, -1))), why: 'That isn’t a root of the squared equation. Square, factor, then check each root.' }, { html: t(rT(qmul(E.r1, -1))), why: 'That isn’t a root of the squared equation. Square, factor, then check each root.' }],
      E.lines.join('<br>'), E.hints, 'MC: the extraneous root');
  }

  /* ============================== the assignment (a practice test) ============================== */
  var QUESTIONS = [
    { num: '1', section: 'Factoring', stem: 'Factor fully. If it cannot be factored, press <b>none</b>.', outcome: RF1, parts: [
      { id: '1a', level: 'BEG', make: function (r) {
        var o = pickWhere(function () { return { g: r.int(2, 6), p: r.int(2, 5), q: r.int(1, 9) }; }, function (o) { return gcd(o.p, o.q) === 1 && !(o.g === 4 && o.p === 2 && o.q === 5); });
        return noneWrap(U.gcfPart(M(-o.g, { x: 1 }), lin(o.p, -o.q)), ['x']);
      } },
      { id: '1b', level: 'EMG', make: function (r) { var p = binCommon(r); return noneWrap(p, p.input.vars); } },
      { id: '1c', level: 'EMG', make: function (r) { return noneWrap(groupNice(r, [[-2, 5]]), ['x']); } },
      { id: '1d', level: 'EMG', make: function (r) { var pr = r.pick([['a', 'b'], ['x', 'y'], ['m', 'n']]); return triCan(r, { q: { of: pm(1, 9) }, s: { of: pm(1, 9) }, test: function (o) { return o.q * o.s < 0; } }, { v: pr[0], w: pr[1] }); } },
      { id: '1e', level: 'BEG', make: function (r) { return triCan(r, { q: { of: pm(1, 9) }, s: { of: pm(1, 9) } }, { k: r.int(2, 5) }); } },
      { id: '1f', level: 'EMG', make: function (r) { var o = U.noneTri(r, { b: { of: pm(1, 9) }, c: [2, 15], test: function (o) { return !(o.b === 5 && o.c === 8); } }); return U.nonePart({ v: 'x', b: o.b, c: o.c }); } }] },
    { num: '2', stem: 'Factor fully.', outcome: RF1, parts: [
      { id: '2a', level: 'PRG', make: function (r) { return triFac(r, { p: [2, 6], q: { of: pm(1, 7) }, r: [2, 6], s: { of: pm(1, 7) }, test: function (o) { return o.a <= 24 && o.q * o.s < 0; } }); } },
      { id: '2b', level: 'PRG', make: function (r) { return triFac(r, { p: [2, 5], q: { of: pm(1, 7) }, r: 1, s: { of: pm(1, 7) } }, { k: -1 }); } },
      { id: '2c', level: 'PRG', make: function (r) { return triFac(r, { p: [1, 4], q: { of: pm(1, 5) }, r: [2, 4], s: { of: pm(1, 5) }, test: function (o) { return o.a > 2; } }, { v: 'x', w: 'y' }); } },
      { id: '2d', level: 'PRG', make: function (r) { var d = r.pick([2, 3, 4]); return triFac(r, { q: { of: pm(1, 8) }, s: { of: pm(1, 8) }, test: function (o) { return o.q * o.s < 0 && o.b % d === 0 && o.c % d === 0; } }, { k: [1, d] }); } },
      { id: '2e', level: 'EMG', make: function (r) { return triFac(r, { p: [2, 7], q: { of: pm(1, 9) }, s: 1, square: true, test: function (o) { return o.q < 0 || o.p > 2; } }, {}, { ps: true }); } },
      { id: '2f', level: 'PRG', make: function (r) { return triFac(r, { p: [2, 4], q: { of: pm(1, 5) }, r: [1, 3], s: { of: pm(1, 5) }, test: function (o) { return o.a > 1; } }, { k: r.int(2, 4), gv: { x: 1 } }); } }] },
    { num: '3', stem: 'Factor fully using substitution.', outcome: RF1, parts: [
      { id: '3a', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { h: r.pick(pm(1, 7)), m: r.pick(pm(1, 8)), n: r.pick(pm(1, 8)) }; }, function (o) { return o.m !== o.n && o.m + o.n !== 0 && o.h + o.m !== 0 && o.h + o.n !== 0 && !(o.h === 3 && [o.m, o.n].sort().join() === '-5,3'); });
        return X.sub({ U: P.parse('x' + sgn(o.h)), f: [[1, o.m], [1, o.n]], mode: 'bin' }).part();
      } },
      { id: '3b', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { p: r.pick([2, 3]), h: r.pick(pm(1, 5)), m: r.pick(pm(1, 5)), n: r.pick(pm(1, 5)) }; }, function (o) { return gcd(o.p, o.m) === 1 && o.p * o.n + o.m !== 0 && !(o.p === 2 && o.h === -1 && o.m === -1 && o.n === -3); });
        return X.sub({ U: P.parse('2x' + sgn(o.h)), f: [[o.p, o.m], [1, o.n]], mode: 'bin' }).part();
      } },
      { id: '3c', level: 'PRG', make: function (r) { var ab = pickWhere(function () { return r.sample([1, 2, 3, 4, 5], 2).sort(); }, function (ab) { return !(ab[0] === 1 && ab[1] === 3); }); return X.sub({ U: P.parse('x^2'), f: [[1, -ab[0] * ab[0]], [1, -ab[1] * ab[1]]], mode: 'mono' }).part(); } },
      { id: '3d', level: 'ADV', make: function (r) { var o = pickWhere(function () { return { p: r.pick([2, 3]), q: r.int(1, 4), s: r.int(1, 7) }; }, function (o) { return gcd(o.p, o.q) === 1 && !(o.p === 2 && o.q === 1 && o.s === 3); }); return X.sub({ U: P.parse('x^2'), f: [[o.p * o.p, -o.q * o.q], [1, o.s]], mode: 'mono' }).part(); } }] },
    { num: '4', stem: 'Factor fully. If it cannot be factored, press <b>none</b>.', outcome: RF1, parts: [
      { id: '4a', level: 'BEG', make: function (r) { var o = pickWhere(function () { return { a: r.int(2, 9), b: r.int(2, 9) }; }, function (o) { return gcd(o.a, o.b) === 1 && !(o.a === 7 && o.b === 8); }); return noneWrap(dosMono({ A: M(o.a, { x: 1 }), Bm: M(o.b, { y: 1 }) }), ['x', 'y']); } },
      { id: '4b', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { g: r.pick([2, 3, 5]), a: r.int(2, 7), b: r.int(1, 7) }; }, function (o) { return gcd(o.a, o.b) === 1 && !(o.g === 2 && o.a === 5 && o.b === 2); }); return noneWrap(dosMono({ g: o.g, A: M(o.a, { a: 1 }), Bm: M(o.b, { b: 1 }) }), ['a', 'b']); } },
      { id: '4c', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { a: r.int(1, 3), b: r.int(1, 3) }; }, function (o) { return gcd(o.a, o.b) === 1 && !(o.a === 1 && o.b === 2) && !(o.a === 2 && o.b === 3); }); return noneWrap(dosMono({ A: M(o.a * o.a, { x: 2 }), Bm: M(o.b * o.b, { y: 2 }) }), ['x', 'y']); } },
      { id: '4d', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 7), b: r.int(2, 7) }; }, function (o) { return o.a !== o.b && gcd(o.a, o.b) === 1 && !(o.a === 5 && o.b === 3) && !(o.a === 3 && o.b === 2); });
        var key = '\\left(\\frac{x}{' + o.a + '}-\\frac{1}{' + o.b + '}\\right)\\left(\\frac{x}{' + o.a + '}+\\frac{1}{' + o.b + '}\\right)';
        return noneWrap(dosMono({ A: M([1, o.a], { x: 1 }), Bm: N([1, o.b]), key: key, prompt: t('\\dfrac{x^{2}}{' + o.a * o.a + '}-\\dfrac{1}{' + o.b * o.b + '}'), good: ['\\frac{1}{' + o.a * o.a * o.b * o.b + '}(' + o.b + 'x-' + o.a + ')(' + o.b + 'x+' + o.a + ')'] }), ['x']);
      } },
      { id: '4e', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { p: r.pick([1, 2, 3]), q: r.pick(pm(1, 5)), n: r.int(2, 8) }; }, function (o) { return gcd(o.p, Math.abs(o.q)) === 1 && Math.abs(o.q) !== o.n && !(o.p === 2 && o.q === 1 && o.n === 6); }); return noneWrap(dosBin({ a: 1, U: lin(o.p, o.q), b: o.n, V: N(1) }), ['x']); } },
      { id: '4f', level: 'MAS', make: function (r) { var o = pickWhere(function () { return { a: r.int(2, 5), b: r.int(1, 4), h: r.pick(pm(1, 5)), k: r.pick(pm(1, 5)) }; }, function (o) { return o.a > o.b && o.h !== o.k && !(o.a === 3 && o.b === 2 && o.h === -2 && o.k === 1) && !(o.a === 5 && o.b === 2 && o.h === 1 && o.k === -2); }); return noneWrap(dosBin({ a: o.a, U: lin(1, o.h), b: o.b, V: lin(1, o.k) }), ['x']); } },
      { id: '4g', level: 'EMG', make: function (r) { return sumSqNone(r); } }] },
    { num: '5', section: 'Solving quadratic equations', stem: 'Solve by factoring.', outcome: RF5, parts: [
      { id: '5a', level: 'BEG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(1, 12), b: r.int(1, 12) }; }, function (o) { return o.a < o.b && !(o.a === 3 && o.b === 8); }), z = zLines(1, [[1, -o.a], [1, -o.b]]);
        return solveQ(t(z.std + '=0'), z.roots, { sol: z.line, text: 'solve x² − bx + c = 0' });
      } },
      { id: '5b', level: 'PRG', make: function (r) {
        var T = pickWhere(function () { return tri(r, { p: [2, 5], q: { of: pm(1, 6) }, r: [2, 5], s: { of: pm(1, 6) }, test: function (o) { return o.q * o.s < 0 && o.a <= 20 && o.b; } }); }, function () { return true; });
        var z = zLines(1, [[T.p, T.q], [T.r, T.s]]);
        return solveQ(t(pT([[T.a, 2], [T.b, 1]]) + '=' + (-T.c)), z.roots, { sol: t(z.std + '=0') + '; ' + U.pairLine(T) + '<br>' + z.line, text: 'solve ax² + bx = c',
          cands: [{ vals: [Q(-T.c, 1), Q(-T.c - T.b, T.a)], code: 'u4l8-ignore-k', hint: 'The zero product property needs ' + t('0') + ' on one side: move ' + t(String(-T.c)) + ' to the left first.' }] });
      } },
      { id: '5c', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { k: r.int(2, 6), m: r.int(2, 12) }; }, function (o) { return !(o.k === 3 && o.m === 9); }), z = zLines(o.k, [[1, 0], [1, -o.m]]);
        return solveQ(t(o.k + 'x^{2}=' + o.k * o.m + 'x'), z.roots, { sol: t(o.k + 'x^{2}-' + o.k * o.m + 'x=0') + '<br>' + z.line, text: 'solve kx² = mx (don’t divide by x)' });
      } },
      { id: '5d', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { a: r.pick(pm(1, 6)), b: r.int(1, 6), c: r.int(2, 6) }; }, function (o) { return o.c - o.a !== o.b && o.a !== o.c && !(o.a === 2 && o.b === 3 && o.c === 4); });
        // (x + a)(x − b) = c(x − b)  → (x − b)(x + a − c) = 0
        var z = zLines(1, [[1, -o.b], [1, o.a - o.c]]), lhs = '(' + linT(1, o.a) + ')(x-' + o.b + ')';
        var exp = pT([[1, 2], [o.a - o.b, 1], [-o.a * o.b, 0]]) + pT([[-o.c, 1], [o.c * o.b, 0]]).replace(/^(?=[^-])/, '+');
        return solveQ(t(lhs + '=' + o.c + '(x-' + o.b + ')'), z.roots, { lost: Q(o.b, 1), text: '(x + a)(x − b) = c(x − b)', cands: [{ vals: [Q(-o.a, 1), Q(o.b, 1)], code: 'u4l8-ignore-k', hint: 'The right side isn’t ' + t('0') + ': expand, move every term to the left and factor again.' }],
          sol: t(exp + '=0') + '<br>' + t(z.std + '=0') + '<br>' + z.line + '<br>(Dividing both sides by ' + t('(x-' + o.b + ')') + ' would lose ' + t('x=' + o.b) + '.)' });
      } },
      { id: '5e', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { p: r.int(2, 7), q: r.pick(pm(1, 9)) }; }, function (o) { return gcd(o.p, Math.abs(o.q)) === 1 && !(o.p === 3 && o.q === -2) && !(o.p === 2 && o.q === 5) && !(o.p === 2 && o.q === -3); });
        var z = zLines(1, [[o.p, o.q], [o.p, o.q]]);
        return solveQ(t(z.std + '=0'), z.roots, { sol: 'Perfect square trinomial: ' + z.line, text: 'perfect square: a double root', hints: ['Are the first and last terms perfect squares, and is the middle term twice their product?', 'A squared factor gives one (double) root.'] });
      } }] },
    { num: '6', outcome: RF5, parts: [
      { id: '6a', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { a: r.pick(pm(1, 9)), b: r.pick(pm(1, 9)) }; }, function (o) { return o.a !== o.b && o.a + o.b !== 0 && o.a * o.b < 0 && !(o.a === -3 && o.b === 7) && !(o.a === 7 && o.b === -3); }); return eqPart('Write a quadratic equation in standard form whose roots are ' + t(String(o.a)) + ' and ' + t(String(o.b)) + '.', [Q(o.a, 1), Q(o.b, 1)]); } },
      { id: '6b', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { q: r.int(2, 5), p: r.pick(pm(1, 7)), s: r.pick(pm(1, 6)) }; }, function (o) { return gcd(Math.abs(o.p), o.q) === 1 && !(o.p === 3 && o.q === 4 && o.s === -2) && !(o.p === 2 && o.q === 3 && o.s === -5); }); return eqPart('Write a quadratic equation with integer coefficients whose roots are ' + t(rT(Q(o.p, o.q))) + ' and ' + t(String(o.s)) + '.', [Q(o.p, o.q), Q(o.s, 1)]); } },
      { id: '6c', level: 'PRG', make: function (r) {
        var T = tri(r, { p: [2, 3], q: { of: pm(1, 6) }, r: 1, s: { of: pm(1, 6) }, test: function (o) { return !(o.p === 2 && o.q === -1 && o.s === 3); } }), z = zLines(1, [[T.p, T.q], [T.r, T.s]]);
        var pts = z.roots.map(function (x) { return [qv(x), 0]; }), keyP = '\\{' + z.roots.map(function (x) { return '(' + rT(x) + ', 0)'; }).join(', ') + '\\}', keyZ = z.roots.map(function (x) { return rT(x); }).join(',\\ ');
        var fields = [{ label: 'Zeros:', name: 'Zeros', mode: 'math', keys: 'pairs', wide: true }, { label: t('x') + '-intercepts:', name: 'x-intercepts', mode: 'math', keys: 'pairs', wide: true }];
        var p = B.fields('Determine the zeros of ' + t('y=' + T.tex) + ' and the ' + t('x') + '-intercepts of its graph.', fields, [K.valueSet(z.roots, { v: 'x' }), K.pairs(pts)], [keyZ, keyP], 'zeros ' + t(keyZ) + '; ' + t('x') + '-intercepts ' + t(keyP),
          t(T.tex + '=0') + ': ' + U.pairLine(T) + ' ' + t(T.tex + '=' + br2(T)) + '<br>' + z.line + '<br>Zeros: ' + t(keyZ) + '; ' + t('x') + '-intercepts ' + z.roots.map(function (x) { return t('(' + rT(x) + ',\\ 0)'); }).join(' and ') + '.<br>They are the same numbers as the roots of ' + t(T.tex + '=0') + ': the roots are the ' + t('x') + '-values where ' + t('y=0') + ', which is where the graph crosses the ' + t('x') + '-axis.',
          ['The zeros are the values of ' + t('x') + ' that make ' + t('y=0') + ': solve ' + t(T.tex + '=0') + '.', 'An ' + t('x') + '-intercept is a point on the ' + t('x') + '-axis: ' + t('(r,\\ 0)') + '.'], 'zeros and x-intercepts');
        p.bad = [[keyZ, '\\{' + z.roots.map(function (x) { return '(0, ' + rT(x) + ')'; }).join(', ') + '\\}']]; return p;
      } }] },
    { num: '7', outcome: RF5, parts: [
      { id: '7', level: 'PRG', make: function (r) {
        var n = pickWhere(function () { return 2 * r.int(2, 15) + 1; }, function (n) { return n !== 11; }), Pp = n * (n + 2), z = zLines(1, [[1, n + 2], [1, -n]], 'n');
        return twoPairs('The product of two consecutive odd integers is ' + t(String(Pp)) + '. Write and solve an equation to determine the integers. (There are two possible pairs.)', [n, n + 2], [-n - 2, -n],
          { text: 'consecutive odd integers: product', sol: 'Let the integers be ' + t('n') + ' and ' + t('n+2') + ': ' + t('n(n+2)=' + Pp) + ' &nbsp;⇒&nbsp; ' + t('n^{2}+2n-' + Pp + '=0') + '<br>' + z.line + '<br>' + t('n=' + n) + ': ' + t(n + '\\text{ and }' + (n + 2)) + '. ' + t('n=' + (-n - 2)) + ': ' + t((-n - 2) + '\\text{ and }' + (-n)) + '. (Both pairs work.)',
            hints: ['Let the integers be ' + t('n') + ' and ' + t('n+2') + ' and write ' + t('n(n+2)=' + Pp) + '.', 'Put it in standard form and factor. Each root gives a pair.'] });
      } }] },
    { num: '8', stem: function (s) { return 'A ball is thrown upward from the top of a building. Its height, ' + t('h') + ' metres, after ' + t('t') + ' seconds is ' + t('h=' + pT([[-5, 2], [s.b, 1], [s.c, 0]], 't')) + '.'; }, shared: function (r) { return ballH(ballShared(r, [[5, 1], [4, 1]])); }, outcome: RF5, parts: [
      { id: '8a', level: 'BEG', make: function (r, s) { return B.number('How tall is the building?', s.c, function (v) { return same(v, s.T) ? { code: 'value', hint: 'That’s when it lands. The ball starts at the top of the building: at ' + t('t=0') + '.' } : null; }, 'At ' + t('t=0') + ': ' + t('h=' + s.c) + ' m.', ['The ball starts at the top of the building, when ' + t('t=0') + '.'], 'projectile: starting height', { after: 'm' }); } },
      { id: '8b', level: 'PRG', make: function (r, s) { return ballPartGround(r, s); } },
      { id: '8c', level: 'ADV', make: function (r, s) { return ballPartTimes(r, s); } }] },
    { num: '9', section: 'Radical equations', stem: 'State the restrictions on the variable.', outcome: AN3, parts: [
      { id: '9a', level: 'BEG', make: function (r) { var o = pickWhere(function () { return { a: r.int(2, 6), b: r.int(1, 12), n: r.int(2, 9) }; }, function (o) { return !(o.a === 3 && o.b === 6); }); return R.P.restrict(t('\\sqrt{' + linT(o.a, -o.b) + '}=' + o.n), [{ a: o.a, b: -o.b }]); } },
      { id: '9b', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { p: r.int(2, 9), q: r.int(1, 9), c: r.int(2, 5) }; }, function (o) { return !(o.p === 5 && o.q === 1); }); return R.P.restrict(t('\\sqrt{' + pT([[o.p, 0], [-1, 1]]) + '}+\\sqrt{' + linT(1, o.q) + '}=' + o.c), [{ a: -1, b: o.p }, { a: 1, b: o.q }]); } },
      { id: '9c', level: 'EMG', make: function (r) { var p = pickWhere(function () { return r.int(2, 20); }, function (p) { return p !== 6 && p !== 12; }); return U7.restrictPart(t('\\sqrt{' + linT(1, p) + '}=x'), { v: 'x', a: 1, b: p, m: 1, e: 0, rhsTex: 'x', isoLine: '', tex: '\\sqrt{' + linT(1, p) + '}=x' }); } }] },
    { num: '10', stem: 'Solve and verify.', outcome: AN3, parts: [
      { id: '10a', level: 'BEG', make: function (r) { var e = pickWhere(function () { return R.lin1({ a: r.int(2, 6), b: r.pick(pm(1, 9)), d: r.int(3, 9) }); }, function (e) { return e.ok && isInt(e.x) && e.tex !== '\\sqrt{4x+1}=7'; }); return R.P.lin1(t(e.tex), e); } },
      { id: '10b', level: 'EMG', make: function (r) { var e = pickWhere(function () { var k = r.int(2, 4), m = r.int(1, 4), c = r.int(m * k + 1, m * k + 8); return R.lin1({ a: 1, b: -r.int(1, 9), k: -k, c: c, d: c - k * m, layout: 'ck' }); }, function (e) { return e.ok && isInt(e.x) && e.tex !== '5-2\\sqrt{x-3}=1'; }); return R.P.lin1(t(e.tex), e); } },
      { id: '10c', level: 'EMG', make: function (r) { var e = pickWhere(function () { return R.two({ a1: r.int(2, 5), b1: -r.int(1, 9), a2: 1, b2: r.int(1, 9) }); }, function (e) { return e.ok && isInt(e.x) && qv(e.x) > 0 && e.tex !== '\\sqrt{3x-2}=\\sqrt{x+8}'; }); return R.P.two(t(e.tex), e); } },
      { id: '10d', level: 'PRG', make: function (r) { var e = pickWhere(function () { var c = r.int(3, 9); return R.lin1({ a: 1, b: r.pick(pm(1, 9)), c: c, d: r.int(1, c - 1) }); }, function (e) { return !e.ok && e.tex !== '\\sqrt{x+2}+6=3'; }); return R.P.lin1(t(e.tex), e); } }] },
    { num: '11', stem: 'Solve and verify. Identify any extraneous roots.', outcome: AN3, parts: [
      { id: '11a', level: 'PRG', make: function (r) { var E = U7.pickQ(r, { e: range(1, 3), u1: range(0, 6), u2: range(1, 7), test: function (E) { return E.roots.length === 2 && E.a >= 2 && U7.nice(E); } }); return U7.solvePart(t(E.tex), E); } },
      { id: '11b', level: 'PRG', make: function (r) { var E = U7.pickQ(r, { e: negs(1, 6), c: range(1, 6), u1: range(1, 9), u2: negs(1, 6), layout: 'xminus', test: function (E) { return E.e + E.c === 0 && E.a === 1 && U7.nice(E); } }); return U7.solvePart(t(E.tex), E); } },
      { id: '11c', level: 'ADV', make: function (r) { var E = pickWhere(function () { var w = r.int(1, 6), c = r.pick([2, 2, 3]), s = w + c, q = r.int(1, 9), x0 = w * w + q, p = s * s - x0; return U7.twoRad({ a1: 1, b1: p, a2: 1, b2: -q, c: c, form: 'diff' }); }, function (E) { return E && E.roots.length === 1 && !/x\+6\}-\\sqrt\{x-6\}=2$/.test(E.tex); }); return U7.solvePart(t(E.tex), E); } }] },
    { num: '12', stem: 'The time ' + t('t') + ', in seconds, for an object dropped from a height of ' + t('h') + ' metres to reach the ground is ' + t('t=\\sqrt{\\dfrac{h}{4.9}}') + '.', outcome: AN3, parts: [
      { id: '12a', level: 'EMG', make: function (r) { var n = r.int(3, 8), h = 49 * n * n / 10; return B.number('How long does an object dropped from ' + t(F(h)) + ' m take to fall?', n, function (v) { return same(v, n * n) ? { code: 'u4l8-h', hint: t('\\frac{' + F(h) + '}{4.9}=' + n * n) + ' is under the square root: take its square root.' } : null; }, t('t=\\sqrt{\\dfrac{' + F(h) + '}{4.9}}=\\sqrt{' + n * n + '}=' + n) + ' s', ['Substitute ' + t('h=' + F(h)) + ' and divide by ' + t('4.9') + ' first.'], 'free fall: time', { after: 's' }); } },
      { id: '12b', level: 'PRG', make: function (r) { var m = pickWhere(function () { return r.int(2, 7); }, function (m) { return m !== 3; }), h = 49 * m * m / 10; return B.number('A stone dropped from a bridge takes ' + t(String(m)) + ' s to reach the water. How high is the bridge?', h, function (v) { if (same(v, 4.9 * m)) return { code: 'u4l8-h', hint: 'Square both sides first: ' + t(m + '^{2}=\\dfrac{h}{4.9}') + '.' }; if (same(v, m * m)) return { code: 'value', hint: t('\\dfrac{h}{4.9}=' + m * m) + ': now multiply by ' + t('4.9') + '.' }; return null; }, t(m + '=\\sqrt{\\dfrac{h}{4.9}}') + ' &nbsp;⇒&nbsp; ' + t(m * m + '=\\dfrac{h}{4.9}') + ' &nbsp;⇒&nbsp; ' + t('h=4.9(' + m * m + ')=' + F(h)) + ' m', ['Substitute ' + t('t=' + m) + ' and square both sides.', 'Then multiply both sides by ' + t('4.9') + '.'], 'free fall: height', { after: 'm' }); } }] },
    { num: '13', outcome: AN3, parts: [
      { id: '13', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { p: r.int(3, 9), q: r.int(1, 6) }; }, function (o) { return o.q < o.p && !(o.p === 5 && o.q === 2); });
        var E = U7.subRad({ f: [[1, -o.p], [1, o.q]], layout: 'rhs' }), c = o.p - o.q, d = o.p * o.q, word = { 1: 'its square root', 2: 'twice its square root', 3: 'three times its square root', 4: 'four times its square root', 5: 'five times its square root', 6: 'six times its square root', 7: 'seven times its square root', 8: 'eight times its square root' }[c];
        return B.number('A number decreased by ' + word + ' is ' + t(String(d)) + '. Write a radical equation and determine the number.', o.p * o.p, function (v) { if (v === o.q * o.q) return { code: 'u4rad-kept-extraneous', hint: 'That value doesn’t check: ' + E.checks[rT(Q(o.q * o.q, 1))].line }; if (v === o.p) return { code: 'u4l7-u', hint: 'That’s the square root of the number. The number is its square.' }; return null; },
          'Let the number be ' + t('x') + ': ' + t(E.tex) + '.<br>' + E.lines.join('<br>'), E.hints, 'number problem: x − c√x = d');
      } }] },
    { num: '14', parts: [
      { id: '14a', level: 'PRG', outcome: RF1, make: function (r) {
        var o = pickWhere(function () { return { g: r.int(2, 5), k: r.int(2, 7) }; }, function (o) { return !(o.g === 2 && o.k === 2); }), g = o.g, k = o.k, ex2 = g + 'x^{2}-' + g * k * k;
        return B.mc(r, 'Ava factored ' + t(ex2) + ' as ' + t('(' + g + 'x-' + g * k + ')(x+' + k + ')') + '. Her product is correct, but the question was marked wrong. Why, and what is the full factoring?', [
          { html: t(g + 'x-' + g * k) + ' still has a common factor ' + t(String(g)) + ', so it isn’t factored fully: ' + t(ex2 + '=' + g + '(x-' + k + ')(x+' + k + ')') + '.', right: true },
          { html: 'Her product is wrong: ' + t('(' + g + 'x-' + g * k + ')(x+' + k + ')') + ' expands to ' + t(g + 'x^{2}+' + g * k * k) + '.', why: 'Expand it: ' + t(g + 'x^{2}+' + g * k + 'x-' + g * k + 'x-' + g * k * k + '=' + ex2) + '. The product is right.' },
          { html: 'A difference of squares must be written as a square: ' + t(g + '(x-' + k + ')^{2}') + '.', why: t('(x-' + k + ')^{2}') + ' expands to ' + t('x^{2}-' + 2 * k + 'x+' + k * k) + ' — there is a middle term. A difference of squares has two different brackets.' },
          { html: 'She should have written the brackets the other way round: ' + t('(x+' + k + ')(' + g + 'x-' + g * k + ')') + '.', why: 'The order of the factors doesn’t matter. Look for a factor that can still be factored.' }],
          t(g + 'x-' + g * k) + ' still has the common factor ' + t(String(g)) + '. Take out the GCF first: ' + t(ex2 + '=' + g + '(x^{2}-' + k * k + ')=' + g + '(x-' + k + ')(x+' + k + ')') + '.', ['Is every factor factored as far as it can go?'], 'MC: not factored fully');
      } },
      { id: '14b', level: 'PRG', outcome: RF5, make: function (r) {
        var o = pickWhere(function () { return { a: r.int(1, 4), b: r.int(2, 9) }; }, function (o) { return o.b % o.a === 0 && !(o.a === 1 && o.b === 5); }), a = o.a, b = o.b, root = b / a, lhs = (a === 1 ? '' : a) + 'x^{2}';
        return B.mc(r, 'Ben solved ' + t(lhs + '=' + b + 'x') + ' by dividing both sides by ' + t('x') + ' and got ' + t('x=' + root) + '. What is his error, and what is the full solution?', [
          { html: 'Dividing by ' + t('x') + ' assumes ' + t('x\\ne 0') + ', so the root ' + t('x=0') + ' is lost: ' + t(lhs + '-' + b + 'x=0') + ', ' + t('x(' + linT(a, -b) + ')=0') + ', so ' + t('x=0') + ' or ' + t('x=' + root) + '.', right: true },
          { html: 'He should have taken the square root of both sides: ' + t('x=\\pm\\sqrt{' + b + 'x}') + '.', why: 'That still has ' + t('x') + ' on both sides. Move every term to one side and factor.' },
          { html: 'There is no error: ' + t('x=' + root) + ' is the only solution.', why: 'Substitute ' + t('x=0') + ': ' + t('0=0') + '. It is a root too.' },
          { html: 'He should have divided by ' + t(String(b)) + ' instead, giving ' + t('x=\\pm' + root) + '.', why: 'Check ' + t('x=-' + root) + ': it doesn’t work. Factor instead of dividing.' }],
          'Dividing by ' + t('x') + ' assumes ' + t('x\\ne 0') + ', so the root ' + t('x=0') + ' is lost. ' + t(lhs + '-' + b + 'x=0') + ' &nbsp;⇒&nbsp; ' + t('x(' + linT(a, -b) + ')=0') + ', so ' + t('x=0') + ' or ' + t('x=' + root) + '.', ['Substitute ' + t('x=0') + ' into the equation. Is it a root?'], 'MC: dividing by x loses a root');
      } }] },
    { num: '15', section: 'Multiple choice and numerical response', outcome: RF1, parts: [
      { id: '15', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 7), b: r.int(2, 9) }; }, function (o) { return gcd(o.a, o.b) === 1 && !(o.a === 3 && o.b === 7); }), a = o.a, b = o.b;
        return B.mc(r, 'One factor of ' + t(a * a + 'x^{2}-' + b * b + 'y^{2}') + ' is', [{ html: t(a * a + 'x-' + b + 'y'), why: 'Take the square root of each term: ' + t(a * a + 'x^{2}=(' + a + 'x)^{2}') + '.' }, { html: t(a + 'x-' + b * b + 'y'), why: 'Take the square root of each term: ' + t(b * b + 'y^{2}=(' + b + 'y)^{2}') + '.' }, { html: t(a + 'x+' + b + 'y'), right: true }, { html: t(a * a + 'x+' + b * b + 'y'), why: 'The factors hold the square roots: ' + t('(' + a + 'x)^{2}-(' + b + 'y)^{2}') + '.' }],
          t(a * a + 'x^{2}-' + b * b + 'y^{2}=(' + a + 'x)^{2}-(' + b + 'y)^{2}=(' + a + 'x-' + b + 'y)(' + a + 'x+' + b + 'y)') + '.', ['It is a difference of squares: ' + t('A^{2}-B^{2}=(A-B)(A+B)') + '.'], 'MC: a factor of a difference of squares');
      } },
      { id: '16', level: 'PRG', make: function (r) { return oneFactorMC(r); } },
      { id: '17', level: 'PRG', make: function (r) { return nrDigits(r, [[3, 2, 4, 5], [2, 3, 4, 5]]); } },
      { id: '18', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: r.pick(pm(1, 7)), b: r.pick(pm(1, 7)), c: r.pick(pm(1, 7)) }; }, function (o) { return distinct([o.a, o.b, o.c, -o.a]) && !(o.a === 4 && ((o.b === -6 && o.c === 5) || (o.b === 5 && o.c === -6))); });
        var T1 = U.Tri({ p: 1, q: o.a, r: 1, s: o.b, v: 'x', w: 'y' }), T2 = U.Tri({ p: 1, q: o.a, r: 1, s: o.c, v: 'x', w: 'y' }), f = function (k) { return t(tx(lin(1, k, 'x', 'y'))); };
        return B.mc(r, 'When factored, ' + t(T1.tex) + ' and ' + t(T2.tex) + ' have one binomial factor in common. This factor is', [{ html: f(o.b), why: 'That factor is in ' + t(T1.tex) + ' only.' }, { html: f(o.a), right: true }, { html: f(o.c), why: 'That factor is in ' + t(T2.tex) + ' only.' }, { html: f(-o.a), why: 'Check the signs when you factor.' }],
          t(T1.tex + '=' + T1.key) + ' and ' + t(T2.tex + '=' + T2.key) + ' share ' + f(o.a) + '.', ['Factor both trinomials: two numbers with the right product and sum, each with a ' + t('y') + '.'], 'MC: common binomial factor');
      } },
      { id: '19', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(1, 4), b: r.int(2, 6), c: r.int(1, 7) }; }, function (o) { return o.a < o.b && o.c !== o.a && o.c !== o.b && !(o.a === 1 && o.b === 4); }), a = o.a, b = o.b;
        var ex4 = 'x^{4}-' + (a * a + b * b) + 'x^{2}+' + a * a * b * b;
        return B.mc(r, 'Which of the following is <b>not</b> a factor of ' + t(ex4) + '?', [{ html: t('x+' + a), why: 'It is a factor: ' + t(ex4 + '=(x^{2}-' + a * a + ')(x^{2}-' + b * b + ')') + ', and ' + t('x^{2}-' + a * a + '=(x-' + a + ')(x+' + a + ')') + '.' }, { html: t('x-' + b), why: 'It is a factor: ' + t('x^{2}-' + b * b + '=(x-' + b + ')(x+' + b + ')') + '.' }, { html: t('x+' + o.c), right: true }, { html: t('x^{2}-' + b * b), why: 'It is a factor: it is a product of two of the factors, ' + t('(x-' + b + ')(x+' + b + ')') + '.' }],
          t(ex4 + '=(x^{2}-' + a * a + ')(x^{2}-' + b * b + ')=(x-' + a + ')(x+' + a + ')(x-' + b + ')(x+' + b + ')') + '. ' + t('x^{2}-' + b * b) + ' is a product of two factors, so it is a factor; ' + t('x+' + o.c) + ' is not.', ['Let ' + t('A=x^{2}') + ' and factor the trinomial, then factor each difference of squares.'], 'MC: not a factor');
      } },
      { id: '20', level: 'EMG', outcome: RF5, make: function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 9), b: r.int(1, 9) }; }, function (o) { return gcd(o.a, o.b) === 1 && o.a !== o.b && !(o.a === 4 && o.b === 5); }), a = o.a, b = o.b;
        return B.mc(r, 'The solution of ' + t(a * a + 'x^{2}-' + b * b + '=0') + ' is', [{ html: t('x=\\frac{' + b + '}{' + a + '}') + ' only', why: 'Each factor gives a root: there is a negative root too.' }, { html: t('x=\\pm\\frac{' + a + '}{' + b + '}'), why: 'Upside down: ' + t(a + 'x-' + b + '=0') + ' gives ' + t('x=\\frac{' + b + '}{' + a + '}') + '.' }, { html: t('x=\\pm\\frac{' + b + '}{' + a + '}'), right: true }, { html: t('x=\\pm\\frac{' + b * b + '}{' + a * a + '}'), why: 'That’s the value of ' + t('x^{2}') + '. Take square roots (or factor).' }],
          t('(' + a + 'x-' + b + ')(' + a + 'x+' + b + ')=0') + ', so ' + t('x=\\frac{' + b + '}{' + a + '}') + ' or ' + t('x=-\\frac{' + b + '}{' + a + '}') + '.', ['Factor the difference of squares and set each factor to ' + t('0') + '.'], 'MC: solve a²x² − b² = 0');
      } },
      { id: '21', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 9), b: r.int(2, 9) }; }, function (o) { return gcd(o.a, o.b) === 1 && !(o.a === 5 && o.b === 4) && !(o.a === 3 && o.b === 7); }), k = 2 * o.a * o.b;
        return B.nr('<i>(Numerical Response)</i> In order for ' + t(o.a * o.a + 'x^{2}-kx+' + o.b * o.b) + ' to be a perfect square trinomial, the positive value of ' + t('k') + ' must be ________.', k, function (v) { return v === o.a * o.b ? { code: 'u4l8-half', hint: 'The middle term of ' + t('(A-B)^{2}') + ' is ' + t('2AB') + ': double the product.' } : null; },
          t('(' + o.a + 'x-' + o.b + ')^{2}=' + o.a * o.a + 'x^{2}-' + k + 'x+' + o.b * o.b) + ', so ' + t('k=' + k) + '.', ['The first and last terms are ' + t('(' + o.a + 'x)^{2}') + ' and ' + t(o.b + '^{2}') + '. The middle term of a perfect square is ' + t('2AB') + '.'], 'NR: perfect square k');
      } },
      { id: '22', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { p: r.int(2, 5), q: r.int(1, 9) }; }, function (o) { return !(o.p === 2 && o.q === 3); }), p = o.p, q = o.q;
        return B.mc(r, 'The factored form of ' + t(p * p + 'a^{2}-(b-' + q + ')^{2}') + ' is', [{ html: t('(' + p + 'a-b-' + q + ')(' + p + 'a+b+' + q + ')'), why: 'Subtracting the bracket changes every sign: ' + t(p + 'a-(b-' + q + ')=' + p + 'a-b+' + q) + '.' }, { html: t('(' + p + 'a-b+' + q + ')(' + p + 'a+b-' + q + ')'), right: true }, { html: t('(' + p + 'a-b+' + q + ')(' + p + 'a+b+' + q + ')'), why: 'In the second bracket, adding ' + t('(b-' + q + ')') + ' gives ' + t('+b-' + q) + '.' }, { html: t('(' + p * p + 'a-b+' + q + ')(' + p * p + 'a+b-' + q + ')'), why: 'Take the square root of ' + t(p * p + 'a^{2}') + ': it is ' + t(p + 'a') + '.' }],
          t('\\left[' + p + 'a-(b-' + q + ')\\right]\\left[' + p + 'a+(b-' + q + ')\\right]=(' + p + 'a-b+' + q + ')(' + p + 'a+b-' + q + ')') + '.', ['It is ' + t('A^{2}-B^{2}') + ' with ' + t('A=' + p + 'a') + ' and ' + t('B=b-' + q) + '. Keep ' + t('B') + ' in brackets.'], 'MC: difference of squares with a binomial');
      } },
      { id: '23', level: 'PRG', outcome: AN3, make: function (r) { var E = U7.pickQ(r, { e: range(1, 6), u1: range(2, 9), u2: negs(1, 6), layout: 'swap', test: function (E) { return E.a === 1 && E.b > 0 && qv(E.r1) !== -qv(E.r2) && qv(E.r2) !== 0 && qv(E.r1) !== 0; } }); return radMC(r, E); } },
      { id: '24', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { return { p: r.pick([2, 3, 4]), q: r.pick([1, 2, 3]), h: r.int(1, 4), m: r.pick(pm(1, 5)), n: r.pick(pm(1, 5)) }; }, function (o) {
          o.K = o.p * o.h + o.m; o.L = o.q * o.h + o.n; return o.p !== o.q && o.K > 0 && o.L > 0 && gcd(o.p, Math.abs(o.m)) === 1 && gcd(o.q, Math.abs(o.n)) === 1 && o.K * o.L <= 999 && !(o.p === 3 && o.q === 2 && o.h === 1 && o.m === -1 && o.n === 3);
        });
        var s = X.sub({ U: P.parse('x+' + o.h), f: [[o.p, o.m], [o.q, o.n]], mode: 'bin' }), KL = o.K * o.L;
        return B.nr('<i>(Numerical Response)</i> The expression ' + t(s.exprTex) + ' can be written in factored form as ' + t('(' + o.p + 'x+K)(' + (o.q === 1 ? '' : o.q) + 'x+L)') + '. The value of ' + t('KL') + ' is ________.', KL,
          function (v) { if (v === o.m * o.n) return { code: 'u4l8-sub', hint: 'Those are the numbers in the brackets in ' + t('A') + '. Put ' + t('x+' + o.h) + ' back in for ' + t('A') + ' and simplify first.' }; return null; },
          s.lines.join('<br>') + '<br>' + t('(' + o.p + 'x+' + o.K + ')(' + o.q + 'x+' + o.L + ')') + ': ' + t('K=' + o.K) + ', ' + t('L=' + o.L) + ', ' + t('KL=' + KL) + '.', ['Let ' + t('A=x+' + o.h) + ' and factor the trinomial in ' + t('A') + '.', 'Replace ' + t('A') + ' with ' + t('x+' + o.h) + ' and simplify each bracket; then read off ' + t('K') + ' and ' + t('L') + '.'], 'NR: substitution, KL');
      } },
      { id: '25', level: 'EMG', outcome: AN3, make: function (r) {
        var o = pickWhere(function () { return { a: r.int(1, 8), b: r.int(3, 15), c: r.int(1, 4) }; }, function (o) { return o.a < o.b && !(o.a === 3 && o.b === 7); });
        return B.mc(r, 'All the restrictions on ' + t('x') + ' in the equation ' + t('\\sqrt{x-' + o.a + '}=\\sqrt{' + o.b + '-x}+' + o.c) + ' are', [{ html: t('x\\ge ' + o.a), why: 'That’s only the first radicand. The other radicand, ' + t(o.b + '-x') + ', must be ' + t('\\ge 0') + ' too.' }, { html: t('x\\le ' + o.b), why: 'That’s only the second radicand. ' + t('x-' + o.a) + ' must be ' + t('\\ge 0') + ' too.' }, { html: t(o.a + '\\le x\\le ' + o.b), right: true }, { html: t('x\\ge ' + o.b), why: 'Solve ' + t(o.b + '-x\\ge 0') + ' carefully: the sign reverses, ' + t('x\\le ' + o.b) + '.' }],
          t('x-' + o.a + '\\ge 0') + ' gives ' + t('x\\ge ' + o.a) + ', and ' + t(o.b + '-x\\ge 0') + ' gives ' + t('x\\le ' + o.b) + '. Together: ' + t(o.a + '\\le x\\le ' + o.b) + '.', ['Write a restriction for each radicand, then combine them.'], 'MC: restrictions with two radicals');
      } },
      { id: '26', level: 'PRG', outcome: RF5, make: function (r) {
        var T = tri(r, { p: [2, 5], q: { of: pm(1, 5) }, r: [2, 5], s: { of: pm(1, 5) }, test: function (o) { return o.q * o.s < 0 && o.p !== o.r && o.a <= 20 && Math.abs(o.q) !== o.p && Math.abs(o.s) !== o.r && o.q * o.s !== -o.p * o.r; } });
        var r1 = Q(-T.q, T.p), r2 = Q(-T.s, T.r), opt = function (a, b) { return t(rT(a)) + ', ' + t(rT(b)); }, inv = function (x) { return Q(x[1], x[0]); };
        var shown = pT([[-T.c, 0], [-T.b, 1], [-T.a, 2]]);
        return B.mc(r, 'The roots of ' + t(shown + '=0') + ' are', [{ html: opt(qmul(r1, -1), qmul(r2, -1)), why: 'Check the signs: ' + t(tx(T.F1) + '=0') + ' gives ' + t('x=' + rT(r1)) + '.' }, { html: opt(r1, r2), right: true }, { html: opt(inv(r1), inv(r2)), why: 'Upside down: ' + t(tx(T.F1) + '=0') + ' gives ' + t('x=' + rT(r1)) + '.' }, { html: opt(qmul(inv(r1), -1), qmul(inv(r2), -1)), why: 'Solve each factor: move the constant, then divide by the coefficient of ' + t('x') + '.' }],
          t(shown + '=-(' + T.tex + ')=-' + br2(T) + '=0') + ', so ' + t('x=' + rT(r1)) + ' or ' + t('x=' + rT(r2)) + '.', ['Write it in descending order and take out ' + t('-1') + '.', 'Factor by decomposition, then solve each factor.'], 'MC: roots, negative leading coefficient');
      } },
      { id: '27', level: 'ADV', outcome: AN3, make: function (r) {
        var E = pickWhere(function () { var w = r.int(1, 6), s = r.int(2, 9), q = r.int(1, 9), x0 = w * w + q, p = s * s - x0; if (s <= w || !p) return null; return U7.twoRad({ a1: 1, b1: p, a2: 1, b2: -q, c: s + w, form: 'sum' }); }, function (E) { return E && E.roots.length === 1 && qv(E.roots[0]) > 0 && qv(E.roots[0]) <= 999 && !/x\+1\}\+\\sqrt\{x-6\}=7$/.test(E.tex); });
        var x = qv(E.roots[0]);
        return B.nr('<i>(Numerical Response)</i> The solution of ' + t(E.tex) + ' is ' + t('x=') + ' ________.', x, null, E.lines.join('<br>'), E.hints, 'NR: two radicals');
      } }] }
  ];

  /* ============================== the extra practice (a second practice test) ============================== */
  var EXTRA = [
    { num: '1', section: 'A. Multiple Choice', outcome: RF1, parts: [
      { id: 'E1', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { g: r.int(2, 6), k: r.int(2, 7) }; }, function (o) { return !(o.g === 3 && o.k === 2); }), g = o.g, k = o.k, e = g + 'x^{2}-' + g * k * k;
        return B.mc(r, 'When ' + t(e) + ' is factored fully, the result is', [{ html: t('(' + g + 'x-' + g * k + ')(x+' + k + ')'), why: 'Equal, but not factored fully: ' + t(g + 'x-' + g * k + '=' + g + '(x-' + k + ')') + '.' }, { html: t(g + '(x-' + k + ')(x+' + k + ')'), right: true }, { html: t(g + '(x-' + k + ')^{2}'), why: 'Expand it: there is a middle term. A difference of squares has two different brackets.' }, { html: t(g + '(x-' + k * k + ')(x+' + k * k + ')'), why: 'Take square roots: ' + t('x^{2}-' + k * k + '=(x-' + k + ')(x+' + k + ')') + '.' }],
          t(g + '(x^{2}-' + k * k + ')=' + g + '(x-' + k + ')(x+' + k + ')') + '.', ['GCF first, then the difference of squares.'], 'MC: GCF and difference of squares');
      } }] },
    { num: '2', outcome: RF1, parts: [{ id: 'E2', level: 'PRG', make: function (r) { return oneFactorMC(r); } }] },
    { num: '3', outcome: RF1, parts: [
      { id: 'E3', level: 'PRG', make: function (r) {
        var Nn = pickWhere(function () { return r.pick([12, 18, 20, 24, 28, 30, 36, 40, 42]); }, function (n) { return n !== 18; });
        var sums = U.posPairs(Nn).map(function (pq) { return pq[0] + pq[1]; }), valid = sums.concat(sums.map(function (x) { return -x; }));
        var pick3 = r.sample(valid, 3), bad = pickWhere(function () { return r.int(2, Nn); }, function (k) { return valid.indexOf(k) < 0 && valid.indexOf(-k) < 0; });
        var opts = pick3.map(function (k) { return { html: t(String(k)), why: t(String(k)) + ' works: it is the sum of a factor pair of ' + t(String(Nn)) + '.' }; }).concat([{ html: t(String(bad)), right: true }]);
        return B.mc(r, 'The trinomial ' + t('x^{2}+kx+' + Nn) + ' can be factored over the integers for each of these values of ' + t('k') + ' <b>except</b>', opts,
          'Pairs with product ' + t(String(Nn)) + ': ' + U.posPairs(Nn).map(function (pq) { return t(pq[0] + '\\times ' + pq[1]) + ' (sum ' + t('\\pm ' + (pq[0] + pq[1])) + ')'; }).join(', ') + '. No pair has sum ' + t(String(bad)) + '.', ['List the factor pairs of ' + t(String(Nn)) + ' and their sums (positive and negative).'], 'MC: which k fails');
      } }] },
    { num: '4', outcome: RF1, parts: [
      { id: 'E4', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { g: r.pick([2, 3, 5]), a: r.int(1, 3) }; }, function (o) { return !(o.g === 2 && o.a === 2); }), g = o.g, a = o.a, a2 = a * a, e = g + 'x^{4}-' + g * a2 * a2;
        return B.mc(r, 'When ' + t(e) + ' is factored fully, the result is', [{ html: t(g + '(x^{2}-' + a2 + ')(x^{2}+' + a2 + ')'), why: 'Not fully: ' + t('x^{2}-' + a2) + ' is a difference of squares again.' }, { html: t(g + '(x-' + a + ')(x+' + a + ')(x^{2}+' + a2 + ')'), right: true }, { html: t(g + '(x-' + a + ')^{2}(x+' + a + ')^{2}'), why: 'That expands to ' + t(g + '(x^{2}-' + a2 + ')^{2}') + '. The sum ' + t('x^{2}+' + a2) + ' doesn’t factor.' }, { html: t('(' + g + 'x^{2}-' + g * a2 + ')(x^{2}+' + a2 + ')'), why: 'Take out the GCF, and factor ' + t('x^{2}-' + a2) + ' again.' }],
          t(e + '=' + g + '(x^{4}-' + a2 * a2 + ')=' + g + '(x^{2}-' + a2 + ')(x^{2}+' + a2 + ')=' + g + '(x-' + a + ')(x+' + a + ')(x^{2}+' + a2 + ')') + '; the sum ' + t('x^{2}+' + a2) + ' does not factor.', ['GCF, then a difference of squares — twice.'], 'MC: factor fully x⁴ − a⁴');
      } }] },
    { num: '5', outcome: RF1, parts: [
      { id: 'E5', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { h: r.int(1, 6), m: r.pick(pm(1, 8)), n: r.pick(pm(1, 8)) }; }, function (o) {
          if (o.m === o.n || o.m + o.n === 0) return false;
          var L = [[-o.h + o.m, -o.h + o.n], [o.m, o.n], [-o.h - o.m, -o.h - o.n], [o.h + o.m, o.h + o.n]].map(function (pr) { return pr.slice().sort().join(); });
          return distinct(L) && !(o.h === 2 && [o.m, o.n].sort().join() === '-7,2');
        });
        var f = function (a, b) { var A = lin(1, a), Bb = lin(1, b); return t(U.br(A) + U.br(Bb)); };
        var bc = o.m + o.n, cc = o.m * o.n, shown = '(x-' + o.h + ')^{2}' + (bc ? (bc < 0 ? '-' : '+') + (Math.abs(bc) === 1 ? '' : Math.abs(bc)) + '(x-' + o.h + ')' : '') + sgn(cc);
        return B.mc(r, 'When factored, ' + t(shown) + ' is', [{ html: f(o.m, o.n), why: 'Those are the factors in ' + t('A') + ' with ' + t('x') + ' written for ' + t('A') + '. Replace ' + t('A') + ' with ' + t('(x-' + o.h + ')') + '.' }, { html: f(-o.h + o.m, -o.h + o.n), right: true }, { html: f(-o.h - o.m, -o.h - o.n), why: 'Check the signs of the numbers in the factors of the trinomial in ' + t('A') + '.' }, { html: f(o.h + o.m, o.h + o.n), why: t('A=x-' + o.h) + ', so ' + t('A' + sgn(o.m) + '=x-' + o.h + sgn(o.m)) + '.' }],
          'Let ' + t('A=x-' + o.h) + ': ' + t('A^{2}' + (bc ? (bc < 0 ? '-' : '+') + (Math.abs(bc) === 1 ? '' : Math.abs(bc)) + 'A' : '') + sgn(cc) + '=(A' + sgn(o.m) + ')(A' + sgn(o.n) + ')') + ' &nbsp;⇒&nbsp; ' + t('(x-' + o.h + sgn(o.m) + ')(x-' + o.h + sgn(o.n) + ')=' + U.br(lin(1, -o.h + o.m)) + U.br(lin(1, -o.h + o.n))) + '.', ['Let ' + t('A=x-' + o.h) + ', factor, then substitute back and simplify.'], 'MC: substitution');
      } }] },
    { num: '6', outcome: RF5, parts: [
      { id: 'E6', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { q: r.int(2, 5), p: r.int(1, 7), s: r.int(1, 7) }; }, function (o) { return gcd(o.p, o.q) === 1 && !(o.q === 2 && o.p === 3 && o.s === 4) && o.p !== o.q * o.s && o.q * o.s - o.p !== 0; });
        var c = function (A, Bc, C) { return t(pT([[A, 2], [Bc, 1], [C, 0]]) + '=0'); };
        return B.mc(r, 'A quadratic equation with roots ' + t('-' + rT(Q(o.p, o.q))) + ' and ' + t(String(o.s)) + ' is', [{ html: c(o.q, o.q * o.s - o.p, -o.p * o.s), why: 'That has roots ' + t(rT(Q(o.p, o.q))) + ' and ' + t(String(-o.s)) + ': both signs are opposite.' }, { html: c(o.q, o.p - o.q * o.s, -o.p * o.s), right: true }, { html: c(o.q, -(o.q * o.s + o.p), o.p * o.s), why: 'That has roots ' + t(rT(Q(o.p, o.q))) + ' and ' + t(String(o.s)) + ': the root ' + t('-' + rT(Q(o.p, o.q))) + ' comes from ' + t('(' + linT(o.q, o.p) + ')') + '.' }, { html: c(o.q, o.p - o.q * o.s, o.p * o.s), why: 'Multiply the factors carefully: the constant term is ' + t('(' + o.p + ')(-' + o.s + ')') + '.' }],
          t('(' + linT(o.q, o.p) + ')(x-' + o.s + ')=' + pT([[o.q, 2], [o.p - o.q * o.s, 1], [-o.p * o.s, 0]])) + '.', ['Root ' + t('-' + rT(Q(o.p, o.q))) + ' gives the factor ' + t('(' + linT(o.q, o.p) + ')') + '.'], 'MC: equation from its roots');
      } }] },
    { num: '7', outcome: RF5, parts: [
      { id: 'E7', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { a: r.pick(pm(1, 9)), b: r.pick(pm(1, 9)) }; }, function (o) { return o.a !== o.b && o.a + o.b !== 0 && o.a * o.b < 0 && !(Math.abs(o.a * o.b) === 1) && !([o.a, o.b].sort().join() === '-5,3'); });
        var bb = -(o.a + o.b), cc = o.a * o.b, y = 'y=' + pT([[1, 2], [bb, 1], [cc, 0]]), pt = function (list) { return list.map(function (p) { return t('(' + p[0] + ',\\ ' + p[1] + ')'); }).join(', '); };
        return B.mc(r, 'The ' + t('x') + '-intercepts of the graph of ' + t(y) + ' are', [{ html: pt([[-o.a, 0], [-o.b, 0]]), why: 'Check the signs: the factor ' + t('(x-' + '(' + o.a + '))') + ' gives ' + t('x=' + o.a) + '.' }, { html: pt([[o.a, 0], [o.b, 0]]), right: true }, { html: pt([[0, cc]]), why: 'That is the ' + t('y') + '-intercept. The ' + t('x') + '-intercepts have ' + t('y=0') + '.' }, { html: pt([[cc, 0], [1, 0]]), why: 'Those numbers multiply to ' + t(String(cc)) + ' but don’t add to ' + t(String(bb)) + '. Factor the trinomial.' }],
          t(pT([[1, 2], [bb, 1], [cc, 0]]) + '=(' + linT(1, -o.a) + ')(' + linT(1, -o.b) + ')=0') + ', so ' + t('x=' + o.a) + ' or ' + t('x=' + o.b) + '.', ['Set ' + t('y=0') + ' and factor.'], 'MC: x-intercepts');
      } }] },
    { num: '8', outcome: AN3, parts: [
      { id: 'E8', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 5), b: r.int(1, 15), d: r.int(1, 7) }; }, function (o) { return gcd(o.a, o.b) === 1 && o.b % o.a !== 0 && !(o.a === 2 && o.b === 9 && o.d === 3); }), lo = rT(Q(-o.b, o.a));
        return B.mc(r, 'All the restrictions on ' + t('x') + ' in the equation ' + t('\\sqrt{' + linT(o.a, o.b) + '}=x-' + o.d) + ' are', [{ html: t('x\\ge ' + lo), why: 'That’s only the radicand. The right side, ' + t('x-' + o.d) + ', equals a square root, so it is ' + t('\\ge 0') + ' too.' }, { html: t('x\\ge ' + o.d), right: true }, { html: t(lo + '\\le x\\le ' + o.d), why: t('x-' + o.d + '\\ge 0') + ' gives ' + t('x\\ge ' + o.d) + ', not ' + t('x\\le ' + o.d) + '.' }, { html: t('x\\ge 0'), why: 'Solve each restriction: radicand ' + t('\\ge 0') + ' and right side ' + t('\\ge 0') + '.' }],
          'The radicand needs ' + t('x\\ge ' + lo) + ' and the right side needs ' + t('x-' + o.d + '\\ge 0') + ', so ' + t('x\\ge ' + o.d) + '.', ['Two restrictions: the radicand, and the side the radical equals.'], 'MC: restrictions');
      } }] },
    { num: '9', outcome: AN3, parts: [
      { id: 'E9', level: 'PRG', make: function (r) {
        var E = U7.pickQ(r, { e: negs(2, 8), u1: range(2, 8), u2: negs(1, 6), test: function (E) { return E.a === 1 && E.b > 0 && qv(E.r2) > 0; } });
        var x1 = rT(E.r1), x2 = rT(E.r2);
        return B.mc(r, 'The solution of ' + t(E.tex) + ' is', [{ html: t('x=' + x2) + ' only', why: 'Check it: ' + E.checks[x2].line }, { html: t('x=' + x1) + ' only', right: true }, { html: t('x=' + x2 + ',\\ ' + x1), why: 'Verify both: ' + E.checks[x2].line }, { html: 'no solution', why: 'Verify both roots: ' + E.checks[x1].line }],
          E.lines.join('<br>'), E.hints, 'MC: solution of a radical equation');
      } }] },
    { num: '10', outcome: AN3, parts: [
      { id: 'E10', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(1, 9), b: r.int(3, 9), c: r.int(1, 8) }; }, function (o) { return o.c < o.b && !(o.a === 3 && o.b === 5 && o.c === 2); }), d = o.b - o.c;
        return B.mc(r, 'The equation ' + t('\\sqrt{x+' + o.a + '}+' + o.b + '=' + o.c) + ' has no solution because', [{ html: 'the radicand can be negative', why: 'The radicand is fine for ' + t('x\\ge -' + o.a) + '. Look at what the radical must equal.' }, { html: 'after isolating, a square root would have to equal ' + t('-' + d), right: true }, { html: 'squaring both sides gives a quadratic', why: 'Squaring this gives a linear equation — and squaring isn’t the problem. Isolate the radical.' }, { html: t(String(o.b)) + ' is greater than ' + t(String(o.c)) + ', so ' + t('x') + ' must be negative', why: 'A negative ' + t('x') + ' is allowed. The problem is that ' + t('\\sqrt{x+' + o.a + '}=-' + d) + '.' }],
          t('\\sqrt{x+' + o.a + '}=' + o.c + '-' + o.b + '=-' + d) + ', and a square root is never negative.', ['Isolate the radical first.'], 'MC: why no solution');
      } }] },
    { num: '11', section: 'B. Numerical Response', outcome: RF1, parts: [{ id: 'E11', level: 'PRG', make: function (r) { return nrDigits(r, [[2, 3, 4, 5], [3, 2, 4, 5]]); } }] },
    { num: '12', outcome: RF5, parts: [
      { id: 'E12', level: 'PRG', make: function (r) {
        var T = tri(r, { p: [2, 5], q: { of: pm(1, 9) }, r: [2, 4], s: [1, 9], test: function (o) { return o.q < 0 && (o.p === 2 || o.p === 5) && gcd(o.p, o.q) === 1 && o.a <= 20 && -o.q / o.p < 10; } }, {});
        var x = -T.q / T.p, z = zLines(1, [[T.p, T.q], [T.r, T.s]]);
        return B.nr('<i>(Numerical Response)</i> The positive root of ' + t(T.tex + '=0') + ', to the nearest tenth, is ________.', x, function (v) { return same(v, -T.s / T.r) || same(v, T.s / T.r) ? { code: 'u4l8-sign', hint: 'That comes from the other factor. Which root is positive?' } : same(v, T.p / -T.q) ? { code: 'u4l8-recip', hint: 'Upside down: ' + t(tx(T.F1) + '=0') + ' gives ' + t('x=' + rT(Q(-T.q, T.p))) + '.' } : null; },
          U.sol(T) + '<br>' + z.line + ' Positive root: ' + t(x.toFixed(1)) + '.', ['Factor by decomposition (product ' + t('ac=' + T.ac) + ').', 'Solve each factor; give the positive root as a decimal.'], 'NR: positive root');
      } }] },
    { num: '13', outcome: RF5, parts: [
      { id: 'E13', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { L: r.int(6, 20), W: r.int(4, 14), x: r.int(1, 5) }; }, function (o) { return o.L > o.W && !(o.L === 12 && o.W === 8 && o.x === 2); });
        var A = 4 * o.x * o.x + 2 * (o.L + o.W) * o.x, S = o.L + o.W, other = -(S / 2) - o.x;
        var g = gcd(gcd(4, 2 * S), A), q = zLines(4 / g, [[1, -o.x], [1, -other]]);
        return B.nr('<i>(Numerical Response)</i> ' + (/^(8|11|18)/.test(String(o.L)) ? 'An ' : 'A ') + o.L + ' m by ' + o.W + ' m pool is surrounded by a deck of uniform width. The area of the deck alone is ' + t(F(A) + '\\text{ m}^{2}') + '. The width of the deck, in metres, is ________.', o.x,
          function (v) { if (same(v, other)) return { code: 'u4l8-reject', hint: 'A width can’t be negative: reject that root.' }; if (same(v * v * 4 + 2 * S * v + o.L * o.W, A) && !same(v, o.x)) return { code: 'u4l8-deck', hint: t(F(A)) + ' is the deck alone: the outer rectangle minus the pool.' }; return null; },
          t('(' + o.L + '+2x)(' + o.W + '+2x)-' + o.L * o.W + '=' + A) + ' &nbsp;⇒&nbsp; ' + t('4x^{2}+' + 2 * S + 'x-' + A + '=0') + ' &nbsp;⇒&nbsp; ' + t(g + '(' + pT([[4 / g, 2], [2 * S / g, 1], [-A / g, 0]]) + ')=0') + '<br>' + t('x=' + o.x) + ' (' + t('x=' + rT(fracOf(other))) + ' is inadmissible). Check: ' + t('(' + (o.L + 2 * o.x) + ')(' + (o.W + 2 * o.x) + ')-' + o.L * o.W + '=' + A) + ' ✓',
          ['The outer rectangle is ' + t('(' + o.L + '+2x)') + ' by ' + t('(' + o.W + '+2x)') + '; the deck is the outer area minus the pool.', 'Expand, put it in standard form, take out the common factor and factor.'], 'NR: deck width');
      } }] },
    { num: '14', outcome: AN3, parts: [
      { id: 'E14', level: 'PRG', make: function (r) {
        var E = U7.pickQ(r, { e: negs(1, 6), c: range(1, 6), u1: range(1, 9), u2: negs(1, 6), layout: 'radc', test: function (E) { return E.e + E.c === 0 && E.a >= 1 && E.a <= 4 && U7.nice(E) && qv(E.r1) > 0 && !(E.a === 2 && E.b === -1 && E.c === 2); } });
        return B.nr('<i>(Numerical Response)</i> The root of ' + t(E.tex) + ' is ________.', qv(E.r1), function (v) { return E.ext.some(function (y) { return same(v, qv(y)); }) ? { code: 'u4rad-kept-extraneous', hint: 'That root doesn’t check: ' + E.checks[rT(E.ext[0])].line } : null; }, E.lines.join('<br>'), E.hints, 'NR: root of a radical equation');
      } }] },
    { num: '15', section: 'C. Written Response', stem: 'Factor fully.', outcome: RF1, parts: [
      { id: 'E15a', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { g: r.pick([2, 3, 5]), a: r.int(2, 6), b: r.int(1, 5) }; }, function (o) { return gcd(o.a, o.b) === 1 && !(o.g === 3 && o.a === 4 && o.b === 1); }); return dosMono({ g: o.g, A: M(o.a, { x: 1 }), Bm: M(o.b, { y: 1 }) }); } },
      { id: 'E15b', level: 'PRG', make: function (r) { return triFac(r, { q: { of: pm(1, 7) }, s: { of: pm(1, 7) }, test: function (o) { return o.q * o.s < 0; } }, { k: -r.int(2, 4), gv: { x: 1 } }); } },
      { id: 'E15c', level: 'MAS', make: function (r) { var o = pickWhere(function () { return { a: r.int(2, 4), h: r.pick(pm(1, 5)), k: r.pick(pm(1, 5)) }; }, function (o) { return o.h !== o.k && !(o.a === 2 && o.h === 2 && o.k === -1); }); return dosBin({ a: o.a, U: lin(1, o.h), b: 1, V: lin(1, o.k) }); } },
      { id: 'E15d', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { p: r.pick([2, 3, 5]), q: r.pick(pm(1, 7)), k: r.int(1, 4) }; }, function (o) { return gcd(o.p, Math.abs(o.q)) === 1 && !(o.p === 2 && o.q === -3 && o.k === 2); });
        var F1 = lin(o.p, o.q), x2 = P.sub(V('x', 2), N(o.k * o.k)), full = P.mul(F1, x2), ts = P.sorted(full);
        var key = FX.tex([F1, lin(1, -o.k), lin(1, o.k)]);
        var p = B.factored(t(tx(full)), [F1, lin(1, -o.k), lin(1, o.k)], { wrong: [{ is: P.mul(F1, P.add(V('x', 2), N(o.k * o.k))), code: 'u4-group-sign', hint: 'Check the sign of the factor you took out of the second pair: it should be ' + t('-' + o.k * o.k) + '.' }] },
          t(tx(full) + '=x^{2}(' + tx(F1) + ')-' + o.k * o.k + '(' + tx(F1) + ')') + '<br>' + t('=(' + tx(F1) + ')(x^{2}-' + o.k * o.k + ')') + '<br>' + t('=' + key) + ' (the second factor is a difference of squares)',
          ['Group the terms in pairs and take the GCF out of each pair (a negative one from the second pair).', 'The second bracket is a difference of squares: factor it too.'], 'grouping, then a difference of squares');
        p.bad = [FX.tex([F1, x2])]; return p;
      } }] },
    { num: '16', stem: 'Solve by factoring.', outcome: RF5, parts: [
      { id: 'E16a', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { p: r.int(2, 6), q: r.int(1, 9) }; }, function (o) { return gcd(o.p, o.q) === 1 && !(o.p === 2 && o.q === 3); }), z = zLines(1, [[o.p, -o.q], [o.p, -o.q]]);
        return solveQ(t(o.p * o.p + 'x^{2}+' + o.q * o.q + '=' + 2 * o.p * o.q + 'x'), z.roots, { sol: t(z.std + '=0') + '<br>' + z.line, text: 'rearrange: a double root' });
      } },
      { id: 'E16b', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 3), b: r.pick(pm(1, 5)), c: r.int(2, 5), d: r.pick(pm(1, 9)) }; }, function (o) {
          var A = o.a, Bc = o.b - o.c, C = -o.c * o.d, rr = U7.rootsQ(A, Bc, C); o.rr = rr; return rr && rr.length === 2 && C !== 0 && !(o.a === 2 && o.b === 1 && o.c === 3 && o.d === 4);
        });
        var A = o.a, Bc = o.b - o.c, C = -o.c * o.d, g = gcd(gcd(A, Math.abs(Bc)), Math.abs(C)), fac = facTex(A, o.rr, 'x');
        return solveQ(t('x(' + linT(o.a, o.b) + ')=' + o.c + '(' + linT(1, o.d) + ')'), o.rr, { text: 'expand both sides first', cands: [{ vals: [Q(0, 1), Q(-o.b, o.a)], code: 'u4l8-ignore-k', hint: 'The right side isn’t ' + t('0') + ': expand both sides, move every term to the left and factor.' }],
          sol: t(pT([[o.a, 2], [o.b, 1]]) + '=' + pT([[o.c, 1], [o.c * o.d, 0]])) + ' &nbsp;⇒&nbsp; ' + t(pT([[A, 2], [Bc, 1], [C, 0]]) + '=0') + (fac ? ' &nbsp;⇒&nbsp; ' + t(fac + '=0') : '') + '<br>' + rootsLine(o.rr, 'x') + '.' });
      } }] },
    { num: '17', stem: function (s) { return 'A ball is kicked from the top of a hill. Its height above the bottom of the hill, ' + t('h') + ' metres, after ' + t('t') + ' seconds is ' + t('h=' + pT([[-5, 2], [s.b, 1], [s.c, 0]], 't')) + '.'; }, shared: function (r) { return ballH(ballShared(r, [[4, 1], [5, 1]])); }, outcome: RF5, parts: [
      { id: 'E17a', level: 'PRG', make: function (r, s) { return ballPartGround(r, s, 'reach the bottom of the hill (' + t('h=0') + ')'); } },
      { id: 'E17b', level: 'ADV', make: function (r, s) { return ballPartTimes(r, s); } }] },
    { num: '18', stem: function (E) { return 'Consider the radical equation ' + t(E.tex) + '.'; }, outcome: AN3, shared: function (r) {
        return pickWhere(function () { var a2 = r.pick([2, 3]), x0 = r.int(0, 6), s = r.int(1, 5), w = s - 1, b1 = s * s - x0, b2 = w * w - a2 * x0; return U7.twoRad({ a1: 1, b1: b1, a2: a2, b2: b2, c: 1, form: 'diff' }); },
          function (E) { return E && E.roots.length === 1 && E.ext.length === 1 && E.all.every(function (x) { return isInt(x) && Math.abs(qv(x)) <= 30; }) && !E.restrict.empty && !/sqrt\{x\}-\\sqrt\{2x-2\}=1$/.test(E.tex); });
      }, parts: [
      { id: 'E18a', level: 'EMG', make: function (r, E) { var L = E.eq.L; return R.P.restrict('Determine the restrictions on ' + t('x') + '.', [{ a: L[0].list[0][0], b: L[0].list[1][0] }, { a: L[1].list[0][0], b: L[1].list[1][0] }]); } },
      { id: 'E18b', level: 'PRG', make: function (r, E) {
        return B.mc(r, 'Explain why an extraneous root may appear when this equation is solved algebraically.', [
          { html: 'Solving requires squaring both sides, and equal squares don’t mean equal quantities (' + t('a^{2}=b^{2}') + ' also when ' + t('a=-b') + '), so the squared equation can have a root the original doesn’t.', right: true },
          { html: 'The equation has two radicals, so it always has exactly one extraneous root.', why: 'Some equations with two radicals have no extraneous root (both roots check). The reason is the squaring.' },
          { html: 'Factoring a quadratic always gives one root that is too big.', why: 'Factoring is exact. Extraneous roots come from squaring.' },
          { html: 'Any negative root of a radical equation is extraneous.', why: 'Negative roots can be valid. A root is extraneous when it fails the original equation, which can happen after squaring.' }],
          'Solving requires squaring both sides. If two quantities have equal squares, they are not necessarily equal (' + t('a^{2}=b^{2}') + ' also when ' + t('a=-b') + '), so a root of the squared equation may not satisfy the original.', ['What step can turn a false statement like ' + t('3=-3') + ' into a true one?'], 'MC: why extraneous roots appear');
      } },
      { id: 'E18c', level: 'MAS', make: function (r, E) { return U7.solvePart('Algebraically determine the root(s) of the equation.', E); } }] }
  ];

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
  HW.defineLesson({ id: LID, unit: 4, num: '8', title: 'Unit 4 Review', outcome: 'RF1', calc: false, questions: splitNum(QUESTIONS), extra: splitNum(EXTRA) });
})(window);
