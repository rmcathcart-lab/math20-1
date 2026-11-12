/* Math 20-1 · Unit 5 Test (RF3, RF4, RF5) — Quadratic Functions and Equations: zeros, roots and x-intercepts, a quadratic
 * function from its zeros, transformations of y = x², the features of vertex form (vertex, range, intercepts), general
 * and factored form (axis x = −b/2a, vertex), writing an equation from the vertex and a point, completing the square, the
 * quadratic formula, the discriminant, and maximum/minimum problems (graphing calculator and algebra). Written from Ryan's
 * Unit 5 booklet (m201book/unit5: Lessons 1–11, their assignments and extra practice; Lesson 11's assignment and EP11 are
 * the practice tests that set the style and difficulty). There is no older test for this course. One class (about 75
 * minutes by tests/short_report.js), calculator allowed (exact answers where exactness is the skill: radical roots in
 * simplest form, fractions in vertex form; "to the nearest hundredth" where the booklet rounds); three outcomes, each with
 * Beginning, Progressing and Mastery boxes; 20 questions / 26 parts:
 *   RF3 (vertex form, L2, L3, L5)                       Beginning 2 questions / 4 parts, Progressing 2 / 3, Mastery 2 / 2
 *   RF4 (general form, max/min, L4, L6, L9, L10)        Beginning 2 / 3,                 Progressing 3 / 4, Mastery 2 / 2
 *   RF5 (quadratic equations, L1, L7, L8)               Beginning 2 / 3,                 Progressing 3 / 3, Mastery 2 / 2
 *
 * How each box is pitched:
 *   Beginning  — each lesson's core skill as first taught: the image of y = x² after a stretch / reflection / translation
 *                (L2 Ex 4, #2, #12); the vertex, the range and the number of x-intercepts read from vertex form (L3 Ex 1,
 *                Ex 3, Ex 5, #1, #4); the axis of symmetry x = −b/2a and the vertex of y = a(x − r)(x − s) (L4 Ex 2, Ex 4,
 *                #2, #13); completing the square for x² + bx + c with an even b (L6 Ex 2, #2a–c); the zeros of a function
 *                by factoring (L1 Ex 3–4, #3–4); the quadratic formula with exact roots in simplest form (L7 Ex 2, #4); the
 *                discriminant's value or the nature of the roots (L8 Ex 1–2, #1–2).
 *   Progressing — the typical assignment question: x-intercepts of a(x − p)² + q exactly (a surd, a fraction under the
 *                root, or none) (L3 Ex 6, #5–6); the image of a point under y = a(x − p)² + q (L2 Ex 6, #9, #14); an
 *                equation from the vertex and a point, a fractional a, or the y-/x-intercept as the point (L5 Ex 1–2, #2,
 *                #4); completing the square with a ≠ 1, a negative or a fractional a (L6 Ex 4–5, #4–5); the vertex, range
 *                or maximum of general form (L4 Ex 4, #4, #6); a revenue problem and a fencing / number problem (L9 #4–5,
 *                L10 #4–5, #8–9); a function in factored form from its zeros and a point (L1 Ex 6, #8); the quadratic
 *                formula after writing the equation in standard form (L7 Ex 4, #9); the values of k for two, one or no
 *                real roots (L8 Ex 4, #5–6, #8).
 *   Mastery    — the hardest assignment / extra-practice items: an equation from the axis and two points, an arch or a
 *                fountain jet (L5 #8, #11–13, EP05 B3, C1); working backwards from vertex form (values of q, q from the
 *                x-intercepts, the two values of p) (EP03 C1–C3); an unknown coefficient (a from the axis, c from the
 *                maximum, c from two symmetric points) (L4 #9, EP04 C1–C2, L6 #13–14, EP06 C4); optimization: a
 *                rectangle in a triangle, a wire cut into two squares, a rectangle under a line, sums of numbers (L10 #7,
 *                #10, EP10 B1, B5, C3); a problem solved with the quadratic formula and rounded (a right triangle, a
 *                rectangle from its perimeter and area, a ball landing, a diagonal) (L7 #11–13, L11 #15, EP07 B4); the
 *                discriminant with a parameter (a parameter in the leading coefficient, the greatest integer k) (L8 #8–9,
 *                #18, EP08 C2).
 * Coverage: L1 Q5, Q12 · L2 Q1, Q8 · L3 Q1, Q2, Q7, Q16 · L4 Q3, Q10, Q17 · L5 Q8, Q15 · L6 Q4, Q9, Q17 · L7 Q6, Q13, Q19 ·
 *           L8 Q6, Q14, Q20 · L9 Q11 · L10 Q11, Q18 · L11 (review) numbers and styles throughout (Q7, Q9, Q13, Q18, Q19).
 * Short version (def.short): Q1, Q3, Q6 (Beginning: 2 parts each), Q8, Q9, Q10, Q13, Q14 (Progressing: 2 each), Q15, Q18,
 * Q19 (Mastery: 1 each) — 11 questions / 15 parts, about half the working time (~42 of ~75 min by tests/short_report.js);
 * every outcome keeps all three boxes.
 * Not used: sketching (the online version asks for the features a sketch shows: vertex, intercepts, range); "describe the
 * transformations" and "explain" items (the equation or point they lead to is asked instead); matching graphs; numerical-
 * response boxes; graphing-calculator keystrokes (the calculator's answer is asked, rounded as the booklet does).
 *
 * Answers are typed. Equations: "y = a(x − p)² + q" (vertex form is required where asked: the same function in another
 * form is a format nudge), factored form through K.factored. Points "(p, q)", the axis "x = h", sets through K.set
 * (inequality, interval or set notation), numbers (fractions or decimals), roots "x = a, x = b" with ± allowed
 * ("x = 2 ± √5", "x = (−3 ± √15)/3") or "no real roots"; exact roots must be in simplest form (format nudges for a
 * decimal, a radical that is not simplified, or a fraction that is not reduced); rounded roots and values are checked
 * to the place asked. Every part has `bad` answers with u5t- codes; partial credit (one recognized mistake keeps 2/3 or
 * 1/3) is decided below.
 *
 * The question builders are the Unit 5 assessment kit HW.u5assess (below); js/exits/u5.js uses them with u5x- codes, so
 * this file loads first. Nothing here depends on the practice files (js/lessons/u5l*.js) or on other units' files. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, KP = K.P, P = HW.poly, FX = HW.factor, ex = HW.ex, F = HW.fmt, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  if (!FX || !K.set || !K.point || !HW.graph) throw new Error('js/lessons/u5test.js needs js/factor.js, js/relfn.js and js/lines.js');

  /* ======================================================================================================
   * Codes: one list, registered for both the test (u5t-) and the exit slips (u5x-), with partial-credit decisions
   * (s = small: keeps 2/3, b = big: keeps 1/3, n = none). Format nudges (v: 'form') only need labels.
   * ====================================================================================================== */
  var BASE = {
    'zero-sign': ['Zeros (or roots) with the signs reversed', 'b'], 'zero-recip': ['Zero of (mx − n): gave m/n instead of n/m', 'b'], 'zero-const': ['Gave a zero for a constant factor', 's'],
    'lost-root': ['Divided by x and lost the root 0', 'b'], 'zp-not0': ['Set each factor equal to a non-zero number', 'n'], 'gave-given': ['Gave the zero that was given', 'n'],
    'a-sign': ['Value of a with the wrong sign', 'b'], 'a-recip': ['Value of a upside down', 'b'],
    'vf-psign': ['Vertex form: sign of p wrong', 'b'], 'vf-qsign': ['Vertex form: sign of q wrong', 'b'], 'vf-refl': ['Left out the reflection (sign of a)', 'b'],
    'vf-a': ['Vertex right, wrong value of a', 'b'], 'vf-q': ['Wrong vertical translation / maximum or minimum value', 'b'], 'vf-order': ['Translated before stretching', 'b'],
    'vf-move': ['Did not move the constant across before reading q', 's'], 'vf-div': ['Did not divide every term by the coefficient of y', 's'],
    'map-pdir': ['Image of a point: moved the wrong way horizontally', 'b'], 'map-order': ['Image of a point: translated before stretching', 'b'], 'map-noa': ['Image of a point: y-coordinate not multiplied by a', 'b'],
    'vp-nosq': ['Finding a: did not square (x − p)', 'b'], 'vp-recip': ['Finding a: divided the wrong way', 'b'],
    'range-dir': ['Range: inequality the wrong way (direction of opening)', 'b'], 'range-p': ['Range: used the x-coordinate of the vertex', 'n'], 'range-c': ['Range: used the y-intercept instead of the vertex', 'n'],
    'nx-count': ['Wrong number of x-intercepts', 'n'], 'xint-diva': ['x-intercepts: did not divide by a before taking the square root', 'b'],
    'axis-sign': ['Axis: lost the negative sign in x = −b/(2a)', 'b'], 'axis-2a': ['Axis: x = −b/a (forgot the 2)', 'b'], 'axis-y': ['Wrote the axis as y = …', 's'],
    'vtx-a': ['Vertex: left out a in the y-coordinate', 'b'], 'vtx-yint': ['Gave the y-intercept instead of the vertex', 'n'],
    'cts-a': ['Completing the square: subtracted square not multiplied by a', 'b'], 'cts-add': ['Completing the square: added the square instead of subtracting it', 'b'],
    'ctx-time': ['Gave the time / x-coordinate instead of the value asked', 'b'], 'ctx-c': ['Gave the starting value (the y-intercept)', 'n'],
    'qf-negb': ['Quadratic formula: used b instead of −b', 'b'], 'qf-2a': ['Quadratic formula: divided by a instead of 2a', 'b'], 'qf-disc': ['Quadratic formula: sign slip in b² − 4ac', 'b'],
    'qf-std': ['Used the coefficients before writing the equation in standard form', 'b'], 'disc-sign': ['Discriminant: sign slip in −4ac', 'b'], 'disc-std': ['Discriminant: equation not in standard form first', 'b'],
    'disc-4': ['Discriminant: used b² − ac', 'b'], 'k-dir': ['Parameter: inequality the wrong way', 'b'], 'k-strict': ['Parameter: strict and non-strict inequality mixed up', 's'],
    'k-zero': ['Left out k ≠ 0 (the equation must stay quadratic)', 's'], 'k-round': ['Greatest integer: rounded the boundary up', 'b'], 'q-sign': ['Sign of q', 'b'],
    'rev-x': ['Gave the number of price changes instead of the price', 'b'], 'rev-zero': ['Used a zero of the revenue function instead of the midpoint', 'n'], 'rev-R': ['Gave the revenue instead of the price (or the reverse)', 'n'],
    'rev-whole': ['Used a part of a week (the vertex) instead of a whole number', 'b'], 'gave-num': ['Gave one of the numbers instead of the value asked', 'b'], 'gave-dim': ['Gave a dimension instead of the area', 'b'],
    'fence-4': ['Fenced all four sides (or the wrong number of widths)', 'b'], 'gave-other': ['Gave the other side / root', 's'], 'neg-root': ['Kept the negative (inadmissible) root', 'b'],
    'nosol-claim': ['Said there are no real roots when there are', 'n'], 'none-roots': ['Gave roots when there are none', 'n'], 'round': ['Rounding slip', 's'],
    'exact': ['Decimals instead of exact roots (format)', ''], 'surd': ['Radical not in simplest form (format)', ''], 'reduce': ['Fraction not reduced (format)', ''],
    'vf-form': ['Not in vertex form (format)', ''], 'vf-lhs': ['Equation not solved for y (format)', ''], 'axis-eq': ['Axis not written as an equation (format)', '']
  };
  (function () {
    var codes = {}, part = {};
    Object.keys(BASE).forEach(function (k) { ['u5t-', 'u5x-'].forEach(function (cp) { codes[cp + k] = BASE[k][0]; if (BASE[k][1]) part[cp + k] = BASE[k][1]; }); });
    HW.addCodes(codes); HW.addPartial(part);
  })();

  /* ======================================================================================================
   * Small tools: rationals [p, q], LaTeX, polynomials
   * ====================================================================================================== */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var c = a % b; a = b; b = c; } return a; }
  function pickWhere(gen, test) { for (var i = 0; i < 6000; i++) { var o = gen(); if (o && test(o)) return o; } throw new Error('u5 assessments: no instance found'); }
  function nz(r, lo, hi) { return (r.chance(0.5) ? -1 : 1) * r.int(lo, hi); }
  function R(x) {
    if (Array.isArray(x)) return ex.norm(x[0], x[1]);
    if (Number.isInteger(x)) return [x, 1];
    var d = 1; while (Math.abs(Math.round(x * d) - x * d) > 1e-9 && d < 1e7) d *= 10; return ex.norm(Math.round(x * d), d);
  }
  function rv(x) { x = R(x); return x[0] / x[1]; }
  function qa(x, y) { x = R(x); y = R(y); return ex.norm(x[0] * y[1] + y[0] * x[1], x[1] * y[1]); }
  function qs(x, y) { y = R(y); return qa(x, [-y[0], y[1]]); }
  function qm(x, y) { x = R(x); y = R(y); return ex.norm(x[0] * y[0], x[1] * y[1]); }
  function qd(x, y) { x = R(x); y = R(y); return ex.norm(x[0] * y[1], x[1] * y[0]); }
  function isI(x) { return R(x)[1] === 1; }
  function rt(x) { return ex.texRat(R(x)); }
  function kA(n) { return n === 1 ? 'a' : n + 'a'; }
  function rT(x, dp) { return K.roundTo(x, dp).toFixed(dp); }
  function near(a, b) { return Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(b)); }
  function isSq(n) { if (n < 0) return false; var s = Math.round(Math.sqrt(n)); return s * s === n; }
  /* a coefficient in front of a bracket or x²: 1 → '', −1 → '−' */
  function cT(a) { a = R(a); return a[0] === a[1] ? '' : a[0] === -a[1] ? '-' : rt(a); }
  /* a signed term after the first: '+3', '-\frac{1}{2}', '' for 0 */
  function sT(c) { c = R(c); return !c[0] ? '' : (c[0] < 0 ? '-' : '+') + rt([Math.abs(c[0]), c[1]]); }
  /* a number in brackets when negative: (−3) */
  function par(x) { return rv(x) < 0 ? '(' + rt(x) + ')' : rt(x); }
  /* decimals for contexts (−4.9, 19.6) */
  function dT(x) { return F(Math.round(x * 1e6) / 1e6); }
  function dS(x) { return x < 0 ? '-' + dT(-x) : '+' + dT(x); }
  function V(v) { var o = {}; o[v || 'x'] = 1; return P.mono(1, o); }
  function lin(a, b, v) { return P.add(P.scale(V(v), R(a)), P.num(R(b))); }
  function tx(p) { return P.tex(p); }
  function br(p) { return '(' + tx(p) + ')'; }
  /* y = a(x − p)² + q */
  function binT(p, v) { v = v || 'x'; p = R(p); return p[0] ? '(' + v + sT(qm(p, -1)) + ')' : v; }
  function vfT(a, p, q, v) { return cT(a) + binT(p, v) + '^{2}' + sT(q); }
  function vfP(a, p, q, v) { return P.add(P.scale(P.pow(lin(1, qm(p, -1), v), 2), R(a)), P.num(R(q))); }
  function genP(a, b, c, v) { return P.add(P.scale(P.pow(V(v), 2), R(a)), P.scale(V(v), R(b)), P.num(R(c))); }
  function genT(a, b, c, v) { return tx(genP(a, b, c, v)); }
  /* general-form coefficients of a quadratic polynomial in v */
  function abcOf(p, v) { var o2 = {}, o1 = {}; o2[v || 'x'] = 2; o1[v || 'x'] = 1; return [P.coef(p, o2), P.coef(p, o1), P.constant(p)]; }
  /* vertex form of a general-form quadratic: [a, p, q] */
  function toVF(a, b, c) { var p = qd(qm(b, -1), qm(a, 2)); return [R(a), p, qs(c, qd(qm(b, b), qm(a, 4)))]; }
  function fval(a, b, c, x) { return qa(qa(qm(a, qm(x, x)), qm(b, x)), c); }
  function ptT(x, y) { return '(' + rt(x) + ',\\ ' + rt(y) + ')'; }
  function setT(v, op, x) { return '\\{' + v + '\\mid ' + v + op + rt(x) + ',\\ ' + v + '\\in\\mathbb{R}\\}'; }
  function sqrtSplit(m) { var k = ex.nthFactor(m, 2); return [k, m / (k * k)]; }
  /* LaTeX of (A ± B√m)/D in simplest form (D > 0), with the gcd taken out; returns { tex, plus, minus } */
  function surdRoots(A, B, m, D) {
    var sp = sqrtSplit(m); B = B * sp[0]; m = sp[1];
    if (m === 1) return null;
    if (D < 0) { A = -A; D = -D; }
    var g = gcd(gcd(A, B), D); A /= g; B /= g; D /= g;
    var rad = (Math.abs(B) === 1 ? '' : Math.abs(B)) + '\\sqrt{' + m + '}', num = (A ? A + '\\pm ' : '\\pm ') + rad;
    var tex = D === 1 ? num : '\\frac{' + num + '}{' + D + '}';
    return { tex: tex, vals: [(A + Math.abs(B) * Math.sqrt(m)) / D, (A - Math.abs(B) * Math.sqrt(m)) / D], A: A, B: Math.abs(B), m: m, D: D };
  }
  function strHas(s, re) { return re.test(String(s == null ? '' : s)); }

  /* ======================================================================================================
   * Checkers
   * ====================================================================================================== */
  function unp(n) { while (n && n.t === 'paren') n = n.a; return n; }
  function isConst(n) { return JSON.stringify(n).indexOf('"var"') < 0; }
  function isVarN(n, v) { n = unp(n); return n && n.t === 'var' && n.n === v; }
  function isLinX(n, v) { n = unp(n); if (isVarN(n, v)) return true; if (n.t === 'add' || n.t === 'sub') return isVarN(n.a, v) && isConst(n.b) || n.t === 'add' && isVarN(n.b, v) && isConst(n.a); return false; }
  function isSqT(n, v) {
    if (!n) return false;
    if (n.t === 'neg') return isSqT(n.a, v);
    if (n.t === 'mul') return isConst(n.a) && isSqT(n.b, v);
    if (n.t === 'pow') { var e = ex.rat(n.b); return !!e && e[0] === 2 && e[1] === 1 && (isVarN(n.a, v) || n.a.t === 'paren' && isLinX(n.a.a, v)); }
    return false;
  }
  function vertexShape(ast, v) { var n = unp(ast); if (isSqT(n, v)) return true; return (n.t === 'add' || n.t === 'sub') && isSqT(n.a, v) && isConst(n.b); }
  /* "y = …" (or f(x) =, h =, h(t) = …): the right side; LHS must be the dependent variable alone */
  function rhsOf(resp, ys) {
    var s = String(resp == null ? '' : resp).replace(/\\left|\\right/g, '');
    var i = s.lastIndexOf('='); if (i < 0) return { rhs: s };
    var lhs = s.slice(0, i).replace(/\s|\\[,;! ]/g, '');
    if (!lhs || (ys || ['y']).concat(['y', 'f(x)', 'g(x)', 'h(x)', 'f(t)', 'h(t)']).indexOf(lhs) >= 0) return { rhs: s.slice(i + 1) };
    return { lhs: lhs, rhs: s.slice(i + 1) };
  }
  /* an equation y = (quadratic in x), compared as polynomials. opt.form: 'vertex' (required), 'any'. opt.wrongs: [{ p, code, hint }] */
  function eqChk(cp, T, opt) {
    opt = opt || {}; var v = opt.v || 'x', ws = opt.wrongs || [], A0 = abcOf(T, v);
    var T3 = toVF(A0[0], A0[1], A0[2]);
    return function (resp) {
      var h = rhsOf(resp, opt.ys);
      if (h.lhs) return form(cp + 'vf-lhs', 'Solve for ' + t('y') + ': write the equation as ' + t('y=a(x-p)^{2}+q') + '.');
      if (!String(h.rhs).trim()) return form('empty', 'Type your answer first.');
      var r = P.read(h.rhs);
      if (!r.ok) return form('unreadable', 'Type the equation, e.g. ' + t('y=2(x-3)^{2}+1') + '.');
      var D = r.p;
      if (P.vars(D).some(function (x) { return x !== v; })) return wrong('value', 'Use only the variable ' + t(v) + '.');
      if (P.eq(D, T)) {
        if (opt.form === 'vertex' && !vertexShape(r.ast, v)) return form(cp + 'vf-form', 'Right function — now write it in vertex form, ' + t('y=a(x-p)^{2}+q') + '.');
        return ok();
      }
      for (var i = 0; i < ws.length; i++) if (P.eq(D, ws[i].p)) return wrong(ws[i].code, ws[i].hint);
      if (P.degreeIn(D, v) === 2) {
        var B3 = abcOf(D, v), S = toVF(B3[0], B3[1], B3[2]), eqv = function (x, y) { return near(rv(x), rv(y)); };
        var aa = eqv(S[0], T3[0]), pp = eqv(S[1], T3[1]), q2 = eqv(S[2], T3[2]);
        if (aa && q2 && !pp && eqv(S[1], qm(T3[1], -1))) return wrong(cp + 'vf-psign', 'Check the sign inside the bracket: the vertex is at ' + t('x=' + rt(T3[1])) + ', and ' + t('(x-p)') + ' with ' + t('p=' + rt(T3[1])) + ' is ' + t(binT(T3[1], v)) + '.');
        if (aa && pp && !q2 && eqv(S[2], qm(T3[2], -1))) return wrong(cp + 'vf-qsign', 'Check the sign of ' + t('q') + ': it is the ' + t('y') + '-coordinate of the vertex, ' + t(rt(T3[2])) + '.');
        if (pp && q2 && eqv(S[0], qm(T3[0], -1))) return wrong(cp + 'vf-refl', 'The vertex is right, but the parabola opens the wrong way: check the sign of ' + t('a') + '.');
        if (pp && q2) return wrong(cp + 'vf-a', 'The vertex is right — check the value of ' + t('a') + (opt.aHint ? ': ' + opt.aHint : '.'));
        if (aa && pp) return wrong(cp + 'vf-q', 'The shape and the axis are right — check the ' + t('y') + '-coordinate of the vertex, ' + t('q') + '.');
      }
      return wrong('value', null);
    };
  }
  function eqPart(cp, prompt, T, opt, sol, hints, text) {
    opt = opt || {}; var A0 = abcOf(T, opt.v), S = toVF(A0[0], A0[1], A0[2]);
    var key = opt.keyTex || (opt.form === 'vertex' ? vfT(S[0], S[1], S[2], opt.v) : tx(T));
    var p = KP.math(prompt, eqChk(cp, T, opt), key, sol, hints, text, { keys: 'poly', vars: [opt.v || 'x'], before: (opt.y || 'y') + '=', placeholder: 'e.g. 2(x - 3)^2 + 1' });
    p.answer = t((opt.y || 'y') + '=' + key);
    p.bad = (opt.wrongs || []).map(function (w) { var B3 = abcOf(w.p, opt.v), W = toVF(B3[0], B3[1], B3[2]); return vfT(W[0], W[1], W[2], opt.v); }).filter(function (b, i, arr) { return b !== key && arr.indexOf(b) === i; });
    if (opt.form === 'vertex' && P.count(T) > 1 && S[1][0]) p.bad.push(tx(T)); // general form: a format nudge, not correct
    var dec = function (x) { x = R(x); var v = x[0] / x[1]; return Math.abs(v * 1000 - Math.round(v * 1000)) < 1e-9 ? v : null; };
    if (opt.form === 'vertex' && [S[0], S[1], S[2]].every(function (x) { return dec(x) != null; }) && [S[0], S[1], S[2]].some(function (x) { return !isI(x); })) {
      var a = dec(S[0]), pp = dec(S[1]), q = dec(S[2]);
      p.good = [(a === 1 ? '' : a === -1 ? '-' : String(a)) + (pp ? '(x' + (pp > 0 ? '-' + pp : '+' + (-pp)) + ')' : 'x') + '^2' + (q ? (q > 0 ? '+' + q : String(q)) : '')];
    }
    return p;
  }
  /* factored form y = a(x − r)(x − s): K.factored after "y =" */
  function facPart(cp, prompt, list, wrongs, sol, hints, text) {
    var target = FX.product(list), seen = [target], W = [];
    (wrongs || []).forEach(function (w) { var pp = FX.product(w.is); if (seen.some(function (s) { return P.eq(s, pp); })) return; seen.push(pp); W.push(w); });
    var p = KP.factored(prompt, list, { wrong: W, before: 'y=' }, sol, hints, text);
    var raw = p.check;
    p.check = function (resp) { var h = rhsOf(resp); if (h.lhs) return form(cp + 'vf-lhs', 'Write the function as ' + t('y=a(x-r)(x-s)') + '.'); return raw(h.rhs); };
    p.answer = t('y=' + p.key);
    p.bad = W.map(function (w) { return FX.tex(w.is); });
    return p;
  }

  /* roots: "x = a, x = b", "x = 2 ± √5", "(−3 ± √15)/3", or "no real roots". vals: numbers; opt.exact (simplest form) or
     opt.dp (rounded); opt.wrongs: [{ vals, code, hint }]; opt.v the variable; opt.keyTex */
  function isNone(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\(text|mathrm|textrm)\{([^{}]*)\}/g, '$2').replace(/\\[ ,;:!]|~|\s+|-/g, '').toLowerCase();
    return /^(no(real)?(solutions?|roots?|zeros?|xintercepts?|values?)|nosol(ution)?s?|none|thereisnosolution|\\emptyset|\\varnothing|∅|\{\}|\\\{\\\})\.?$/.test(s);
  }
  function rootList(resp, v) {
    var s = String(resp == null ? '' : resp).replace(/\\left|\\right/g, '').replace(/\\text\{\s*(or|and)\s*\}/gi, ',').replace(/\b(or|and)\b/gi, ',').replace(/;/g, ',').replace(/\\approx|≈|\\doteq/g, '=');
    var m, re = /([a-zA-Z])\s*=/g;
    while ((m = re.exec(s))) if (m[1] !== v) return { letter: m[1] };
    s = s.replace(/(^|[^a-zA-Z\\])[a-zA-Z]\s*=\s*/g, '$1').replace(/\\mp|∓/g, '\\pm').replace(/±/g, '\\pm');
    if (!s.trim()) return { empty: true };
    var pieces = s.split(','), out = [], asts = [], dec = false;
    for (var i = 0; i < pieces.length; i++) {
      var pc = pieces[i].trim(); if (!pc) continue;
      if (!/sqrt|√/.test(pc) && /\\times|\\cdot|[×*·]/.test(pc)) return { unsimp: true };
      var vars = pc.indexOf('\\pm') >= 0 ? [pc.replace(/\\pm/g, '+'), pc.replace(/\\pm/g, '-')] : [pc];
      for (var j = 0; j < vars.length; j++) {
        var a = K.read(vars[j]); if (a.res || !isFinite(a.val)) return { bad: true };
        if (Object.keys(ex.shape(a.ast).vars).length) return { bad: true };
        if (ex.shape(a.ast).decimals) dec = true;
        out.push(a.val); if (j === 0) asts.push(a.ast);
      }
    }
    return { vals: out, asts: asts, dec: dec, n: pieces.length };
  }
  function uniqV(a) { var o = []; a.forEach(function (x) { if (!o.some(function (y) { return Math.abs(x - y) < 1e-9 * Math.max(1, Math.abs(y)); })) o.push(x); }); return o; }
  function sameSet(A, T, tol) { tol = tol || function (x, y) { return near(x, y); }; return A.length === T.length && A.every(function (x) { return T.some(function (y) { return tol(x, y); }); }) && T.every(function (y) { return A.some(function (x) { return tol(x, y); }); }); }
  function termCoefs(n) {
    var out = [];
    (function walk(x, s) { x = unp(x); if (x.t === 'add') { walk(x.a, s); walk(x.b, s); } else if (x.t === 'sub') { walk(x.a, s); walk(x.b, -s); } else if (x.t === 'neg') walk(x.a, -s); else out.push(x); })(n, 1);
    var cs = [];
    for (var i = 0; i < out.length; i++) {
      var v = ex.value(out[i]), m = null;
      (function find(x) { if (!x || typeof x !== 'object' || m != null) return; if (x.t === 'root') { var q = ex.rat(x.a); if (q && q[1] === 1) m = q[0]; return; } ['a', 'b'].forEach(function (k) { if (x[k]) find(x[k]); }); })(out[i]);
      var c = m ? v / Math.sqrt(m) : v; if (Math.abs(c - Math.round(c)) > 1e-9) return null; cs.push(Math.round(c));
    }
    return cs;
  }
  function exactIssue(cp, ast) {
    var issue = null;
    (function walk(n) {
      if (!n || typeof n !== 'object' || issue) return;
      if (n.t === 'root') { var r = ex.rat(n.a), idx = n.n ? ex.rat(n.n) : [2, 1]; if (r && idx && idx[0] === 2 && idx[1] === 1) { if (r[1] !== 1) issue = 'frac'; else if (isSq(r[0])) issue = 'eval'; else if (r[0] > 0 && !ex.simplest(r[0], 2)) issue = 'surd'; } }
      ['a', 'b'].forEach(function (k) { if (n[k] && typeof n[k] === 'object') walk(n[k]); });
    })(ast);
    if (issue === 'surd') return form(cp + 'surd', 'Right roots — now simplify the radical: take every perfect-square factor out of the square root.');
    if (issue === 'eval') return form(cp + 'surd', 'Right roots — the square root of a perfect square is a whole number: work it out.');
    if (issue === 'frac') return form(cp + 'surd', 'Right roots — now simplify: no fraction under the square root (' + t('\\sqrt{\\frac{a}{b}}=\\frac{\\sqrt{ab}}{b}') + ').');
    var top = unp(ast); if (top.t === 'neg') top = unp(top.a);
    if (top.t === 'div') {
      var D = ex.rat(top.b), cs = termCoefs(top.a);
      if (D && D[1] === 1 && cs) { var g = Math.abs(D[0]); cs.forEach(function (c) { g = gcd(g, c); }); if (g > 1) return form(cp + 'reduce', 'Right roots — now reduce: every term of the numerator and the denominator share the factor ' + t(g) + '.'); }
    }
    return null;
  }
  function rootsChk(cp, vals, o) {
    o = o || {}; var v = o.v || 'x', T = uniqV(vals), dp = o.dp, irr = T.some(function (x) { return !isI(R(Math.round(x * 1e6) / 1e6)) && Math.abs(x * 1e6 - Math.round(x * 1e6)) > 1e-6; });
    var RT = dp != null ? T.map(function (x) { return K.roundTo(x, dp); }) : null;
    var place = dp === 1 ? 'tenth' : dp === 2 ? 'hundredth' : dp === 0 ? 'whole number' : dp + ' decimal places';
    var wrongs = (o.wrongs || []).filter(function (w) { return !sameSet(uniqV(w.vals), T); });
    return function (resp) {
      if (isNone(resp)) return T.length ? wrong(cp + 'nosol-claim', o.noneHint || 'There are real roots: solve the equation (or check the sign of the discriminant).') : ok();
      var L = rootList(resp, v);
      if (L.letter) return form('sol-letter', 'Use the variable ' + t(v) + ' here (you wrote ' + t(L.letter + '=') + ').');
      if (L.empty) return form('empty', 'Type your answer first.');
      if (L.unsimp) return form('simplify', 'Simplify each value to a single number (no ' + t('\\times') + ' between numbers).');
      if (L.bad) return form('unreadable', 'Write each root as a number, separated by commas, e.g. ' + t(v + '=2\\pm\\sqrt{5}') + ' or ' + t(v + '=3,\\ ' + v + '=-5') + (T.length ? '' : ' (or type “no real roots”)') + '.');
      var A = uniqV(L.vals);
      if (!T.length) { for (var w0 = 0; w0 < wrongs.length; w0++) if (sameSet(A, uniqV(wrongs[w0].vals))) return wrong(wrongs[w0].code, wrongs[w0].hint); return wrong(cp + 'none-roots', o.noneWrong || 'Check your work: this equation has no real roots.'); }
      if (dp != null) {
        if (sameSet(A, RT)) return ok();
        var close = function (x, y) { return Math.abs(x - y) <= Math.pow(10, -dp) * 0.5 + 1e-9; };
        if (sameSet(A, T)) return form('round', 'Right — now give each root to the nearest ' + place + '.');
        if (sameSet(A, T, function (x, y) { return Math.abs(x - y) < Math.pow(10, -dp) + 1e-9; })) return sameSet(A, T, close) ? form('round', 'Right — now round each root to the nearest ' + place + '.') : wrong(cp + 'round', 'Close — check your rounding to the nearest ' + place + '.');
        for (var i = 0; i < wrongs.length; i++) { var W = uniqV(wrongs[i].vals); if (sameSet(A, W, function (x, y) { return Math.abs(x - y) < Math.pow(10, -dp) + 1e-9; })) return wrong(wrongs[i].code, wrongs[i].hint); }
      } else {
        if (sameSet(A, T)) {
          if (o.exact !== false) {
            if (L.dec && irr) return form(cp + 'exact', 'Give the <b>exact</b> roots (with a square root, in simplest form), not calculator decimals.');
            for (var k = 0; k < L.asts.length; k++) { var fi = exactIssue(cp, L.asts[k]); if (fi) return fi; }
          }
          return ok();
        }
        if (L.dec && sameSet(A, T, function (x, y) { return Math.abs(x - y) < 0.01; })) return form(cp + 'exact', 'Give the <b>exact</b> roots, not rounded decimals.');
        for (var j = 0; j < wrongs.length; j++) if (sameSet(A, uniqV(wrongs[j].vals))) return wrong(wrongs[j].code, wrongs[j].hint);
      }
      var tolx = dp != null ? function (x, y) { return Math.abs(x - y) < Math.pow(10, -dp) + 1e-9; } : function (x, y) { return near(x, y); };
      var miss = (dp != null ? RT : T).filter(function (y) { return !A.some(function (x) { return tolx(x, y); }); }), extra = A.filter(function (x) { return !(dp != null ? RT : T).some(function (y) { return tolx(x, y); }); });
      if (miss.length && !extra.length) return wrong('sol-missing', 'Correct so far — but there ' + (miss.length === 1 ? 'is another root' : 'are more roots') + '. ' + (o.missHint || 'Remember both signs of the square root (±).'));
      if (extra.length && !miss.length) return wrong('sol-extra', o.extraHint || 'You have a value that is not a root — substitute each one to check.');
      if (A.length === T.length && A.every(function (x) { return T.some(function (y) { return tolx(-x, y); }); })) return wrong(cp + 'zero-sign', 'Check the signs: a factor ' + t('(x-r)') + ' gives the root ' + t('r') + '.');
      return wrong('value', null);
    };
  }
  function rootsPart(cp, prompt, vals, o, sol, hints, text) {
    o = o || {}; var v = o.v || 'x';
    var key = o.keyTex || (vals.length ? uniqV(vals).map(function (x) { return v + '=' + (o.dp != null ? String(K.roundTo(x, o.dp)) : rt(x)); }).join(',\\ ') : '\\text{no real roots}');
    var p = KP.math(prompt, rootsChk(cp, vals, o), key, sol, hints, text, { keys: 'solutions', vars: [v], placeholder: 'e.g. ' + v + ' = 2 ± sqrt(5)   (or: no real roots)' });
    var bad = (o.wrongs || []).filter(function (w) { return !sameSet(uniqV(w.vals), uniqV(vals)); }).map(function (w) { return w.vals.map(function (x) { return v + '=' + (o.dp != null ? String(K.roundTo(x, o.dp)) : Math.abs(x - Math.round(x * 1e6) / 1e6) < 1e-12 ? rt(Math.round(x * 1e6) / 1e6) : String(x)); }).join(',\\ '); });
    if (vals.length) bad.push('\\text{no real roots}'); else bad.push(v + '=1');
    p.bad = bad.filter(function (b, i, arr) { return arr.indexOf(b) === i && b !== key; });
    return p;
  }
  /* a number (fraction or decimal allowed); units and "$" are ignored */
  function numChk(Vv, diag, o) {
    o = o || {}; var T = rv(Vv);
    return function (resp) {
      var s = String(resp == null ? '' : resp).replace(/\\text\{[^}]*\}/g, '').replace(/\\?\$/g, '').replace(/(\d)[,\s](?=\d{3}(\D|$))/g, '$1').replace(/\\[,;:! ]|~/g, '').replace(/\s*(m|cm|s|km|kg|h|dollars?)(\^\{?2\}?)?\s*$/i, '').replace(/^\s*[a-zA-Z]\s*=\s*/, '');
      var a = K.read(s); if (a.res) return a.res;
      if (Object.keys(ex.shape(a.ast).vars).length || !isFinite(a.val)) return form('unreadable', 'Give a single number.');
      if (near(a.val, T)) return ok();
      var h = diag ? diag(a.val) : null; if (h) return wrong(h.code, h.hint);
      if (ex.shape(a.ast).decimals && !o.allowRound && Math.abs(a.val - T) < 0.006 * Math.max(1, Math.abs(T))) return form(cp0(o) + 'exact', 'Give the exact value (a fraction), not a rounded decimal.');
      if (T !== 0 && near(a.val, -T)) return wrong('sign', 'Check the sign.');
      return wrong('value', null);
    };
  }
  function cp0(o) { return o.cp || 'u5t-'; }
  function numPart(cp, prompt, Vv, diag, sol, hints, text, o) {
    o = o || {}; o.cp = cp;
    var key = o.keyTex || rt(Vv);
    var p = KP.math(prompt, numChk(Vv, diag, o), key, sol, hints, text, { keys: 'fraction', before: o.before, after: o.after, placeholder: o.placeholder || 'e.g. -3/4' });
    p.answer = t((o.before === '$' ? '\\$' : o.before || '') + key) + (o.after ? ' ' + o.after : '');
    p.bad = (o.bad || []).map(function (x) { return rt(x); }).filter(function (b) { return b !== key; });
    return p;
  }
  /* a rounded number (K.approx) */
  function apxPart(cp, prompt, x, dp, diag, sol, hints, text, o) {
    o = o || {};
    var p = KP.approx(prompt, x, dp, { diag: diag, diagFirst: true, after: o.after, before: o.before }, sol, hints, text);
    p.bad = (o.bad || []).filter(function (b) { return Math.abs(K.roundTo(b, dp) - K.roundTo(x, dp)) > 1e-9; }).map(function (b) { return String(K.roundTo(b, dp)); });
    return p;
  }
  /* the axis of symmetry "x = h" */
  function axisPart(cp, prompt, h, wrongs, sol, hints, text) {
    var H = rv(h), ws = (wrongs || []).filter(function (w) { return !near(rv(w.v), H); });
    var chk = function (resp) {
      var s = String(resp == null ? '' : resp).replace(/\\left|\\right/g, '').trim();
      if (!s) return form('empty', 'Type your answer first.');
      var m = /^([a-zA-Z])\s*=\s*(.+)$/.exec(s), body = m ? m[2] : s;
      if (m && m[1] === 'y') return wrong(cp + 'axis-y', 'The axis of symmetry is a <b>vertical</b> line through the vertex, so its equation is ' + t('x=\\ldots') + '.');
      var a = K.read(body); if (a.res) return a.res;
      if (Object.keys(ex.shape(a.ast).vars).length || !isFinite(a.val)) return form('unreadable', 'Write the axis of symmetry as an equation, e.g. ' + t('x=3') + '.');
      if (near(a.val, H)) return m ? ok() : form(cp + 'axis-eq', 'Right value — write the axis as an equation: ' + t('x=' + rt(h)) + '.');
      for (var i = 0; i < ws.length; i++) if (near(a.val, rv(ws[i].v))) return wrong(ws[i].code, ws[i].hint);
      return wrong('value', null);
    };
    var p = KP.math(prompt, chk, 'x=' + rt(h), sol, hints, text, { keys: 'eq', vars: ['x'], placeholder: 'e.g. x = 3' });
    p.bad = ws.map(function (w) { return 'x=' + rt(w.v); }).concat(['y=' + rt(h)]).filter(function (b, i, arr) { return arr.indexOf(b) === i; });
    return p;
  }
  function pointPart(cp, prompt, pt, wrongs, sol, hints, text) {
    var ws = (wrongs || []).filter(function (w) { return !(near(rv(w.is[0]), rv(pt[0])) && near(rv(w.is[1]), rv(pt[1]))); }).map(function (w) { return { is: [rv(w.is[0]), rv(w.is[1])], code: w.code, hint: w.hint }; });
    var p = KP.point(prompt, [rv(pt[0]), rv(pt[1])], { wrong: ws }, sol, hints, text);
    p.key = ptT(pt[0], pt[1]); p.answer = t(p.key);
    p.bad = ws.map(function (w) { return ptT(w.is[0], w.is[1]); }).filter(function (b, i, arr) { return b !== p.key && arr.indexOf(b) === i; });
    return p;
  }
  function setPart(cp, prompt, target, wrongs, sol, hints, text, v) {
    var ws = (wrongs || []).filter(function (w) { return w && w.is && w.is !== target; });
    var p = KP.set(prompt, target, { v: v || 'x', wrong: ws }, sol, hints, text);
    p.bad = ws.map(function (w) { return w.is; }).filter(function (b, i, arr) { return arr.indexOf(b) === i; });
    return p;
  }
  function mcPart(r, prompt, opts, sol, hints, text, keep) { var p = KP.mc(r, prompt, opts, sol, hints, text, keep); return p; }

  var B = {};

  /* ======================================================================================================
   * Lesson 1 (RF5): zeros, roots and x-intercepts; a function from its zeros
   * ====================================================================================================== */
  /* the zeros of a function by factoring (L1 Ex 3–4, #3–4) */
  B.zeros = function (r, cp, opt) {
    opt = opt || {};
    var kind = opt.kind || r.pick(['gcf', 'dec', 'dec', 'fac']), vals, shown, sol, wr = [];
    if (kind === 'gcf') {
      var g = pickWhere(function () { return { k: r.pick([2, 3, 4, 5, -2, -3]), r1: nz(r, 1, 8), r2: nz(r, 1, 8) }; }, function (z) { return z.r1 < z.r2 && z.r1 + z.r2 !== 0 && Math.abs(z.k * z.r1 * z.r2) <= 90 && !(z.k === 2 && z.r1 === -2 && z.r2 === 5); });
      var inner = P.mul(lin(1, -g.r1), lin(1, -g.r2)), Q = P.scale(inner, g.k); vals = [g.r1, g.r2];
      shown = 'f(x)=' + tx(Q);
      sol = 'Set ' + t('f(x)=0') + ' and take out the common factor: ' + t(g.k + br(inner) + '=0') + ', so ' + t(g.k + FX.tex([lin(1, -g.r1), lin(1, -g.r2)]) + '=0') + '.<br>The zeros are ' + t(g.r1) + ' and ' + t(g.r2) + '.';
      wr.push({ vals: [-g.r1, -g.r2], code: cp + 'zero-sign', hint: 'A factor ' + t('(x-r)') + ' gives the zero ' + t('r') + ': for example ' + t(br(lin(1, -g.r1))) + ' gives ' + t(g.r1) + '.' });
    } else {
      var d = pickWhere(function () { return { m: r.int(2, 5), n: nz(r, 1, 9), s: nz(r, 1, 7), k: kind === 'fac' ? r.pick([-3, -2, 2, 3, 4, -1]) : 1 }; }, function (z) { return gcd(z.m, z.n) === 1 && Math.abs(z.n) !== 1 && z.n !== z.m * z.s && Math.abs(z.m * z.s * z.n * z.k) <= 80 && !(z.m === 3 && z.n === -1) && !(z.m === 3 && z.n === 4 && z.s === -5); });
      var f1 = lin(d.m, -d.n), f2 = lin(1, -d.s); vals = [[d.n, d.m], d.s];
      if (kind === 'fac') {
        shown = 'h(x)=' + FX.tex([P.num(d.k), f1, f2]);
        sol = t(d.k + '\\ne 0') + ', so ' + t(tx(f1) + '=0') + ' or ' + t(tx(f2) + '=0') + '.<br>The zeros are ' + t(rt([d.n, d.m])) + ' and ' + t(d.s) + '.';
        if (Math.abs(d.k) !== 1) wr.push({ vals: [d.k, [d.n, d.m], d.s], code: cp + 'zero-const', hint: 'A constant factor such as ' + t(d.k) + ' is never ' + t(0) + ', so it gives no zero.' });
      } else {
        var Q2 = P.mul(f1, f2); shown = 'f(x)=' + tx(Q2);
        sol = 'Set ' + t('f(x)=0') + ' and factor (decomposition): ' + t(tx(Q2) + '=' + FX.tex([f1, f2]) + '=0') + '.<br>The zeros are ' + t(rt([d.n, d.m])) + ' and ' + t(d.s) + '.';
      }
      wr.push({ vals: [[-d.n, d.m], -d.s], code: cp + 'zero-sign', hint: 'Set each factor equal to ' + t(0) + ' and solve: ' + t(tx(f1) + '=0') + ' gives ' + t('x=' + rt([d.n, d.m])) + '.' });
      wr.push({ vals: [[d.m, d.n], d.s], code: cp + 'zero-recip', hint: t(tx(f1) + '=0') + ' gives ' + t(d.m + 'x=' + d.n) + ', so ' + t('x=' + rt([d.n, d.m])) + ' (divide by ' + t(d.m) + ').' });
    }
    return rootsPart(cp, 'Determine the zeros of ' + t(shown) + '.', vals.map(rv), { wrongs: wr.map(function (w) { return { vals: w.vals.map(rv), code: w.code, hint: w.hint }; }), keyTex: vals.map(function (x) { return 'x=' + rt(x); }).join(',\\ ') }, sol,
      ['The zeros are the values of ' + t('x') + ' that make ' + t('f(x)=0') + '. Factor fully.', 'Set each factor that contains ' + t('x') + ' equal to ' + t(0) + '.'], 'zeros by factoring');
  };
  /* roots after writing the equation with 0 on one side (L1 Ex 3, #2, #15) */
  B.rootsRearr = function (r, cp) {
    var kind = r.pick(['move', 'dec', 'kx', 'cubic', 'dbl']), vals, eq, steps, wr = [], fac;
    if (kind === 'move') {
      var m = pickWhere(function () { return { r1: nz(r, 1, 9), r2: nz(r, 1, 9) }; }, function (z) { return z.r1 < z.r2 && z.r1 + z.r2 !== 0 && z.r1 * z.r2 < 0 && Math.abs(z.r1 * z.r2) <= 60 && !(z.r1 === -2 && z.r2 === 7); });
      var S = m.r1 + m.r2, Pr = m.r1 * m.r2; vals = [m.r1, m.r2];
      eq = 'x^{2}' + sT(-S).replace(/^([+-])1$/, '$1') + 'x=' + (-Pr); fac = FX.tex([lin(1, -m.r1), lin(1, -m.r2)]);
      steps = t('x^{2}' + sT(-S).replace(/^([+-])1$/, '$1') + 'x' + sT(Pr) + '=0') + ', so ' + t(fac + '=0') + '.';
      wr.push({ vals: [-Pr, -Pr + S], code: cp + 'zp-not0', hint: 'Factor only when one side is ' + t(0) + ': move every term to one side first.' });
    } else if (kind === 'dec') {
      var d = pickWhere(function () { return { m: r.int(2, 4), n: nz(r, 1, 7), s: nz(r, 1, 6) }; }, function (z) { return gcd(z.m, z.n) === 1 && Math.abs(z.n) !== z.m && z.n !== z.m * z.s && Math.abs(z.n * z.s) <= 30 && !(z.m === 3 && z.n === 1 && z.s === -2); });
      var Q = P.mul(lin(d.m, -d.n), lin(1, -d.s)), A3 = abcOf(Q); vals = [[d.n, d.m], d.s];
      eq = genT(A3[0], A3[1], 0) + '=' + rt(qm(A3[2], -1)); fac = FX.tex([lin(d.m, -d.n), lin(1, -d.s)]);
      steps = t(tx(Q) + '=0') + ', so ' + t(fac + '=0') + '.';
    } else if (kind === 'kx') {
      var k = pickWhere(function () { return { k: r.pick([2, 3, 4, 5]), r1: nz(r, 1, 6), r2: nz(r, 1, 6) }; }, function (z) { return z.r1 < z.r2 && z.r1 * z.r2 < 0 && z.r1 + z.r2 !== 0 && !(z.k === 2 && z.r1 === -1 && z.r2 === 4); });
      var S2 = k.r1 + k.r2, P2 = k.r1 * k.r2; vals = [k.r1, k.r2];
      eq = k.k + 'x(x' + sT(-S2) + ')=' + (-k.k * P2); fac = k.k + FX.tex([lin(1, -k.r1), lin(1, -k.r2)]);
      steps = 'Expand and move every term to one side: ' + t(k.k + 'x^{2}' + sT(-k.k * S2) + 'x' + sT(k.k * P2) + '=0') + ', so ' + t(fac + '=0') + '.';
      wr.push({ vals: [rv([-P2 * k.k, k.k]), S2 - P2 * k.k], code: cp + 'zp-not0', hint: 'The zero product property only works when one side is ' + t(0) + '. Expand and move every term to one side.' });
    } else if (kind === 'cubic') {
      var c = pickWhere(function () { return { r1: nz(r, 1, 7), r2: nz(r, 1, 7) }; }, function (z) { return z.r1 < z.r2 && z.r1 * z.r2 < 0 && z.r1 + z.r2 !== 0 && !(z.r1 === -2 && z.r2 === 5); });
      var S3 = c.r1 + c.r2, P3 = c.r1 * c.r2; vals = [0, c.r1, c.r2];
      eq = 'x^{3}' + sT(-S3).replace(/^([+-])1$/, '$1') + 'x^{2}=' + (-P3) + 'x'; fac = 'x' + FX.tex([lin(1, -c.r1), lin(1, -c.r2)]);
      steps = 'Move every term to one side (never divide by ' + t('x') + '): ' + t('x^{3}' + sT(-S3).replace(/^([+-])1$/, '$1') + 'x^{2}' + sT(P3) + 'x=0') + ', so ' + t(fac + '=0') + '.';
      wr.push({ vals: [c.r1, c.r2], code: cp + 'lost-root', hint: 'Dividing by ' + t('x') + ' loses the root ' + t('x=0') + '. Move every term to one side and take out the common factor ' + t('x') + '.' });
    } else {
      var e = pickWhere(function () { return { a: r.int(2, 5), b: nz(r, 1, 7) }; }, function (z) { return gcd(z.a, z.b) === 1 && !(z.a === 2 && z.b === 1); });
      vals = [[e.b, e.a]];
      eq = (e.a * e.a) + 'x^{2}+' + (e.b * e.b) + '=' + (2 * e.a * e.b) + 'x'; fac = '(' + tx(lin(e.a, -e.b)) + ')^{2}';
      steps = t((e.a * e.a) + 'x^{2}' + sT(-2 * e.a * e.b) + 'x+' + (e.b * e.b) + '=0') + ', a perfect square: ' + t(fac + '=0') + ' (a double root).';
    }
    var vt = vals.map(rv);
    return rootsPart(cp, 'Determine the roots of ' + t(eq) + '.', vt, { wrongs: wr, keyTex: vals.map(function (x) { return 'x=' + rt(x); }).join(',\\ ') },
      steps + '<br>' + vals.map(function (x) { return t('x=' + rt(x)); }).join(' or ') + '.',
      ['Move every term to one side so the other side is ' + t(0) + '.', 'Factor fully, then set each factor with ' + t('x') + ' equal to ' + t(0) + '.'], 'roots by factoring');
  };
  /* a quadratic function in factored form from its zeros and one more point (L1 Ex 6, #8) */
  B.fromZeros = function (r, cp) {
    var kind = r.pick(['pt', 'pt', 'yint', 'dbl', 'frac']), z, list, wr = [], txt, a, pt, steps;
    if (kind === 'dbl') {
      z = pickWhere(function () { return { s: nz(r, 1, 6), a: r.pick([-3, -2, -1, 2, 3, [1, 2], [-1, 2], [3, 2], [-3, 2]]), x1: nz(r, 1, 6) }; }, function (o) { return o.x1 !== o.s && Math.abs(o.x1 - o.s) <= 4 && isI(qm(o.a, (o.x1 - o.s) * (o.x1 - o.s))) && !(o.s === 3 && o.x1 === 1); });
      a = R(z.a); pt = [z.x1, qm(a, (z.x1 - z.s) * (z.x1 - z.s))];
      list = [P.num(a), { p: lin(1, -z.s), k: 2 }];
      txt = 'The graph of a quadratic function touches the ' + t('x') + '-axis only at ' + t('x=' + z.s) + ' and passes through ' + t(ptT(pt[0], pt[1])) + '.';
      steps = 'A double zero at ' + t(z.s) + ': ' + t('y=a' + binT(z.s) + '^{2}') + '.<br>' + t(rt(pt[1]) + '=a(' + z.x1 + sT(-z.s) + ')^{2}=' + (z.x1 - z.s) * (z.x1 - z.s) + 'a') + ', so ' + t('a=' + rt(a)) + '.';
      if (rv(a) !== -1 && rv(a) !== 1) wr.push({ is: [P.num(qd(1, a)), { p: lin(1, -z.s), k: 2 }], code: cp + 'a-recip', hint: 'Solve for ' + t('a') + ' by dividing the ' + t('y') + '-value by ' + t((z.x1 - z.s) * (z.x1 - z.s)) + '.' });
      wr.push({ is: [P.num(qm(a, -1)), { p: lin(1, -z.s), k: 2 }], code: cp + 'a-sign', hint: 'Check the sign of ' + t('a') + ' when you solve.' });
      wr.push({ is: [P.num(a), { p: lin(1, z.s), k: 2 }], code: cp + 'zero-sign', hint: 'The zero ' + t(z.s) + ' gives the factor ' + t(binT(z.s)) + '.' });
    } else {
      z = pickWhere(function () {
        var o = { r1: nz(r, 1, 7), r2: nz(r, 1, 7), a: r.pick([-3, -2, -1, 1, 2, 3, [1, 2], [-1, 2], [3, 2], [-3, 2], [1, 3], [-2, 3]]), x1: kind === 'yint' ? 0 : nz(r, 1, 6) };
        if (kind === 'frac') { o.m = r.pick([2, 3]); o.n = nz(r, 1, 5); o.a = o.m * r.pick([-2, -1, 1, 2]); }
        return o;
      }, function (o) {
        var zs = kind === 'frac' ? [rv([o.n, o.m]), o.r2] : [o.r1, o.r2];
        if (kind === 'frac' && (gcd(o.n, o.m) !== 1 || Math.abs(o.n) === 1 && o.m === 3)) return false;
        if (kind !== 'frac' && o.r1 >= o.r2) return false;
        if (zs.indexOf(o.x1) >= 0 || near(zs[0], zs[1])) return false;
        if (kind !== 'yint' && o.x1 === 0) return false;
        var yv = qm(o.a, qm(qs(o.x1, kind === 'frac' ? [o.n, o.m] : o.r1), o.x1 - o.r2));
        return isI(yv) && Math.abs(rv(yv)) <= 40 && rv(yv) !== 0;
      });
      a = R(z.a);
      var r1 = kind === 'frac' ? [z.n, z.m] : [z.r1, 1];
      pt = [z.x1, qm(a, qm(qs(z.x1, r1), z.x1 - z.r2))];
      list = kind === 'frac' ? [P.num(qd(a, z.m)), lin(z.m, -z.n), lin(1, -z.r2)] : [P.num(a), lin(1, -z.r1), lin(1, -z.r2)];
      list = list.filter(function (f, i) { return i > 0 || !P.eq(f, P.num(1)); });
      txt = 'A quadratic function has zeros ' + t(rt(r1)) + ' and ' + t(z.r2) + (kind === 'yint' ? ', and the ' + t('y') + '-intercept of its graph is ' + t(rt(pt[1])) : ', and its graph passes through ' + t(ptT(pt[0], pt[1]))) + '.';
      var x1r = qs(z.x1, r1), x2r = z.x1 - z.r2;
      steps = t('y=a(x' + sT(qm(r1, -1)) + ')(x' + sT(-z.r2) + ')') + '.<br>Substitute ' + t(ptT(pt[0], pt[1])) + ': ' + t(rt(pt[1]) + '=a' + '(' + rt(x1r) + ')(' + x2r + ')=' + rt(qm(x1r, x2r)) + 'a') + ', so ' + t('a=' + rt(a)) + '.';
      var base = list.slice(list.length - 2);
      wr.push({ is: [P.num(qm(a, -1))].concat(base), code: cp + 'a-sign', hint: 'Check the sign of ' + t('a') + ': substitute the point and solve carefully.' });
      if (Math.abs(rv(a)) !== 1 && kind !== 'frac') wr.push({ is: [P.num(qd(1, a))].concat(base), code: cp + 'a-recip', hint: 'Solve for ' + t('a') + ' by dividing the ' + t('y') + '-value by ' + t(rt(qm(x1r, x2r))) + '.' });
      wr.push({ is: [P.num(kind === 'frac' ? qd(a, z.m) : a)].concat(kind === 'frac' ? [lin(z.m, z.n), lin(1, z.r2)] : [lin(1, z.r1), lin(1, z.r2)]), code: cp + 'zero-sign', hint: 'A zero ' + t('r') + ' gives the factor ' + t('(x-r)') + '.' });
    }
    var key = FX.tex(list);
    return facPart(cp, txt + ' Write the function in factored form.', list, wr, steps + '<br>' + t('y=' + key) + '.',
      ['Each zero ' + t('r') + ' gives a factor ' + t('(x-r)') + ': write ' + t('y=a(x-r)(x-s)') + '.', 'Substitute the other point for ' + t('x') + ' and ' + t('y') + ' and solve for ' + t('a') + '.'], 'function from its zeros');
  };
  /* MAS: zeros and the maximum / minimum value (L1 #13, EP01 C2); one zero of ax² + kx + c given: the other zero (EP01 C3) */
  B.zerosMax = function (r, cp) {
    if (r.chance(0.4)) {
      var s = pickWhere(function () { return { a: r.int(2, 5), r0: nz(r, 1, 4), n: nz(r, 1, 7), m: r.int(1, 5) }; }, function (z) {
        if (gcd(z.n, z.m) !== 1 || z.a % z.m !== 0) return false;
        var o = z.n / z.m, k = -z.a * (z.r0 + o), c = z.a * z.r0 * o;
        return Number.isInteger(Math.round(k * 1e9) / 1e9) && Math.abs(k - Math.round(k)) < 1e-9 && Math.abs(c - Math.round(c)) < 1e-9 && Math.round(k) !== 0 && Math.abs(c) <= 40 && !near(o, z.r0) && Math.abs(k) <= 25 && !(z.a === 3 && z.r0 === -2);
      });
      var o = R([s.n, s.m]), k = Math.round(-s.a * (s.r0 + rv(o))), c = Math.round(s.a * s.r0 * rv(o));
      var p = rootsPart(cp, 'One zero of ' + t('f(x)=' + s.a + 'x^{2}+kx' + sT(c)) + ' is ' + t(s.r0) + '. Determine the value of ' + t('k') + ' and the other zero. Type the other zero.', [rv(o)],
        { keyTex: 'x=' + rt(o), wrongs: [{ vals: [s.r0], code: cp + 'gave-given', hint: t(s.r0) + ' is the zero you were given. Find the other one.' }, { vals: [s.r0, rv(o)], code: 'sol-extra', hint: 'Give only the <b>other</b> zero.' }] },
        'A zero makes ' + t('f(x)=0') + ': ' + t(s.a + '(' + s.r0 + ')^{2}+k(' + s.r0 + ')' + sT(c) + '=0') + ', so ' + t('k=' + k) + '.<br>' + t('f(x)=' + genT(s.a, k, c)) + '; one factor is ' + t(binT(s.r0)) + ': ' + t('f(x)=' + FX.tex([P.num(s.a / s.m), lin(1, -s.r0), lin(s.m, -s.n)].filter(function (f, i) { return i > 0 || s.a !== s.m; }))) + '.<br>The other zero is ' + t(rt(o)) + '. (Check: the product of the zeros is ' + t('\\frac{c}{a}=' + rt(R([c, s.a]))) + '.)',
        ['A zero makes the function ' + t(0) + ': substitute it for ' + t('x') + ' and solve for ' + t('k') + '.', 'Factor ' + t('f(x)') + ' (one factor is ' + t(binT(s.r0)) + ') and set the other factor equal to ' + t(0) + '.'], 'the other zero');
      return p;
    }
    var z = pickWhere(function () { return { h: nz(r, 0, 5), d: r.int(1, 6), a: r.pick([-3, -2, -1, 1, 2, 3, [1, 2], [-1, 2], [1, 4], [-1, 4], [3, 2], [-3, 2]]) }; }, function (o) { var m = qm(qm(o.a, -1), o.d * o.d); return isI(m) && Math.abs(rv(m)) <= 50 && !(o.h === 2 && o.d === 4) && rv(m) !== 0; });
    var a = R(z.a), r1 = z.h - z.d, r2 = z.h + z.d, mv = qm(qm(a, -1), z.d * z.d), mx = rv(a) < 0;
    var list = [P.num(a), lin(1, -r1), lin(1, -r2)].filter(function (f, i) { return i > 0 || !P.eq(f, P.num(1)); }), base = [lin(1, -r1), lin(1, -r2)];
    return facPart(cp, 'A quadratic function has zeros ' + t(r1) + ' and ' + t(r2) + ', and its ' + (mx ? 'maximum' : 'minimum') + ' value is ' + t(rt(mv)) + '. Write the function in factored form.', list,
      [{ is: [P.num(qm(a, -1))].concat(base), code: cp + 'a-sign', hint: 'The vertex ' + t(ptT(z.h, mv)) + ' gives ' + t('a') + ': substitute it and solve carefully.' }, { is: [P.num(qd(mv, z.d))].concat(base), code: cp + 'vp-nosq', hint: 'At the vertex ' + t('x=' + z.h) + ': ' + t('(x' + sT(-r1) + ')(x' + sT(-r2) + ')=(' + (z.h - r1) + ')(' + (z.h - r2) + ')') + '.' }],
      'The axis is halfway between the zeros: ' + t('x=\\frac{' + r1 + '+' + par(r2) + '}{2}=' + z.h) + ', so the vertex is ' + t(ptT(z.h, mv)) + '.<br>' + t('y=a(x' + sT(-r1) + ')(x' + sT(-r2) + ')') + ': ' + t(rt(mv) + '=a(' + (z.h - r1) + ')(' + (z.h - r2) + ')=' + (-z.d * z.d) + 'a') + ', so ' + t('a=' + rt(a)) + '.<br>' + t('y=' + FX.tex(list)) + '.',
      ['The maximum or minimum is at the vertex, which is on the axis halfway between the zeros.', 'Write ' + t('y=a(x-r)(x-s)') + ' and substitute the vertex to find ' + t('a') + '.'], 'function from its zeros and maximum');
  };

  /* ======================================================================================================
   * Lesson 2 (RF3): transformations of y = x²
   * ====================================================================================================== */
  var STRETCH = [2, 3, 4, 5, [1, 2], [1, 3], [1, 4], [2, 3], [3, 4], [3, 2]];
  function stretchWords(s) { s = R(s); return 'a vertical ' + (s[0] < s[1] ? 'compression' : 'stretch') + ' by a factor of ' + t(rt(s)); }
  function transWords(p, q) {
    var h = p ? t(Math.abs(rv(p))) + ' unit' + (Math.abs(rv(p)) === 1 ? '' : 's') + ' ' + (rv(p) > 0 ? 'right' : 'left') : '', v = q ? t(Math.abs(rv(q))) + ' unit' + (Math.abs(rv(q)) === 1 ? '' : 's') + ' ' + (rv(q) > 0 ? 'up' : 'down') : '';
    return 'a translation of ' + (h && v ? h + ' and ' + v : h || v);
  }
  /* the image of y = x² after a translation ('trans') or a stretch / reflection and a translation ('full') (L2 Ex 4, #2, #8, #12) */
  B.imageEq = function (r, cp, opt) {
    opt = opt || {};
    var mode = opt.mode || 'full', z = pickWhere(function () { return { p: nz(r, 1, 8), q: nz(r, 1, 9), s: r.pick(STRETCH), neg: r.chance(0.5) }; }, function (o) { return !(o.p === -3 && o.q === 2) && !(o.p === 3 && o.q === -5); });
    var a = mode === 'trans' ? [1, 1] : qm(z.s, z.neg ? -1 : 1), T = vfP(a, z.p, z.q), ws = [], words;
    if (mode === 'trans') {
      if (r.chance(0.3)) words = 'a translation that moves its vertex to ' + t(ptT(z.p, z.q));
      else words = transWords(z.p, z.q);
      ws.push({ p: vfP(a, -z.p, z.q), code: cp + 'vf-psign', hint: 'Moving right ' + t('p') + ' units gives ' + t('(x-p)^{2}') + '; moving left gives ' + t('(x+p)^{2}') + '.' });
    } else {
      var parts = [stretchWords(z.s)]; if (z.neg) parts.push('a reflection in the ' + t('x') + '-axis'); parts.push(transWords(z.p, z.q));
      words = parts.length > 2 ? parts.slice(0, -1).join(', ') + ', and ' + parts[parts.length - 1] : parts.join(' and ');
      ws.push({ p: vfP(a, -z.p, z.q), code: cp + 'vf-psign', hint: 'Moving right ' + t('p') + ' units gives ' + t('(x-p)^{2}') + '; moving left gives ' + t('(x+p)^{2}') + '.' });
      if (z.neg) ws.push({ p: vfP(z.s, z.p, z.q), code: cp + 'vf-refl', hint: 'A reflection in the ' + t('x') + '-axis makes ' + t('a') + ' negative.' });
      ws.push({ p: P.scale(vfP(1, z.p, z.q), a), code: cp + 'vf-order', hint: 'Stretch (and reflect) first, then translate: the vertical translation ' + t(rt(z.q)) + ' is not multiplied by ' + t('a') + '.' });
    }
    return eqPart(cp, 'Write the equation of the image of ' + t('y=x^{2}') + ' after ' + words + '.', T, { form: 'vertex', wrongs: ws },
      (mode === 'trans' ? 'The' : t('a=' + rt(a)) + (z.neg ? ' (negative for the reflection)' : '') + '; the') + ' vertex moves from ' + t('(0,\\ 0)') + ' to ' + t(ptT(z.p, z.q)) + ', so ' + t('p=' + z.p) + ' and ' + t('q=' + z.q) + '.<br>' + t('y=' + vfT(a, z.p, z.q)) + '.',
      ['In ' + t('y=a(x-p)^{2}+q') + ': ' + t('a') + ' is the stretch factor (negative for a reflection), ' + t('p') + ' the horizontal and ' + t('q') + ' the vertical translation.', 'Right ' + t('p') + ' gives ' + t('(x-p)') + '; left ' + t('p') + ' gives ' + t('(x+p)') + '.'], 'image of y = x²');
  };
  /* the image of a point of y = x² (L2 Ex 6, #9, #14) */
  B.imagePt = function (r, cp) {
    var z = pickWhere(function () { return { x0: nz(r, 1, 3), a: r.pick([-3, -2, 2, 3, -1, [1, 2], [-1, 2], 4]), p: nz(r, 1, 6), q: nz(r, 1, 9) }; }, function (o) { var y = qm(o.a, o.x0 * o.x0); return isI(y) && !(o.x0 === -1 && o.a === -2 && o.p === 3); });
    var y0 = z.x0 * z.x0, X = z.x0 + z.p, Y = qa(qm(z.a, y0), z.q);
    var ws = [{ is: [z.x0 - z.p, Y], code: cp + 'map-pdir', hint: 'In ' + t('(x' + sT(-z.p) + ')^{2}') + ' the graph moves ' + (z.p > 0 ? 'right' : 'left') + ' ' + t(Math.abs(z.p)) + ': add ' + t(par(z.p)) + ' to the ' + t('x') + '-coordinate.' },
      { is: [X, qm(z.a, y0 + z.q)], code: cp + 'map-order', hint: 'Stretch first, then translate: multiply ' + t(y0) + ' by ' + t(rt(z.a)) + ', then add ' + t(par(z.q)) + '.' }];
    if (rv(z.a) !== 1) ws.push({ is: [X, y0 + z.q], code: cp + 'map-noa', hint: 'Multiply the ' + t('y') + '-coordinate by ' + t('a=' + rt(z.a)) + ' before translating.' });
    return pointPart(cp, 'The point ' + t('(' + z.x0 + ',\\ ' + y0 + ')') + ' is on the graph of ' + t('y=x^{2}') + '. Determine its image on the graph of ' + t('y=' + vfT(z.a, z.p, z.q)) + '.', [X, Y], ws,
      'Each point ' + t('(x,\\ y)') + ' maps to ' + t('(x+p,\\ ay+q)') + ' with ' + t('a=' + rt(z.a)) + ', ' + t('p=' + z.p) + ', ' + t('q=' + z.q) + ':<br>' + t('(' + z.x0 + '+' + par(z.p) + ',\\ ' + rt(z.a) + '(' + y0 + ')+' + par(z.q) + ')=' + ptT(X, Y)) + '. (Check: ' + t(vfT(z.a, z.p, z.q).replace(/x/g, '(' + X + ')') + '=' + rt(Y)) + ' ✓)',
      ['Stretch (and reflect) first: multiply the ' + t('y') + '-coordinate by ' + t('a') + '. Then translate.', 'Add ' + t('p') + ' to the ' + t('x') + '-coordinate and ' + t('q') + ' to the ' + t('y') + '-coordinate.'], 'image of a point');
  };
  /* MAS: a stretch factor from a point on the image, or k on the final graph (EP02 C2, #11, EP02 #8) */
  B.findA = function (r, cp) {
    if (r.chance(0.5)) {
      var z = pickWhere(function () { return { s: r.pick([2, 3, 4, [1, 2], [1, 3], [1, 4], [3, 2], [2, 3], [3, 4]]), p: nz(r, 1, 6), q: nz(r, 1, 8), d: nz(r, 2, 4) }; }, function (o) { return isI(qm(o.s, o.d * o.d)) && Math.abs(rv(qm(o.s, o.d * o.d)) + o.q) <= 40 && Math.abs(o.d) !== 1 && !(o.p === -2 && o.q === -5); });
      var x1 = z.p + z.d, y1 = qa(qm(z.s, z.d * z.d), z.q), dW = qd(qs(y1, z.q), z.d);
      return numPart(cp, 'The graph of ' + t('y=x^{2}') + ' is stretched vertically by a factor of ' + t('a') + ' ' + t('(a>0)') + ', then translated ' + transWords(z.p, z.q).replace('a translation of ', '') + '. The image passes through ' + t(ptT(x1, y1)) + '. Determine ' + t('a') + '.', z.s,
        function (v) { if (near(v, rv(dW)) || near(v, -rv(dW))) return { code: cp + 'vp-nosq', hint: 'Square the bracket: ' + t('(' + x1 + sT(-z.p) + ')^{2}=' + z.d * z.d) + '.' }; if (near(v, rv(qd(qs(y1, z.q), (x1 + z.p) * (x1 + z.p))))) return { code: cp + 'vf-psign', hint: 'Translated ' + (z.p > 0 ? 'right' : 'left') + ' gives ' + t(binT(z.p)) + '.' }; if (near(v, rv(qd(z.d * z.d, qs(y1, z.q))))) return { code: cp + 'vp-recip', hint: 'Solve ' + t(rt(qs(y1, z.q)) + '=' + kA(z.d * z.d)) + ' by dividing by ' + t(z.d * z.d) + '.' }; return null; },
        'The image is ' + t('y=a' + binT(z.p) + '^{2}' + sT(z.q)) + '.<br>Substitute ' + t(ptT(x1, y1)) + ': ' + t(rt(y1) + '=a(' + x1 + sT(-z.p) + ')^{2}' + sT(z.q)) + ', so ' + t(rt(qs(y1, z.q)) + '=' + kA(z.d * z.d)) + ' and ' + t('a=' + rt(z.s)) + '.',
        ['Write the equation of the image with the unknown ' + t('a') + ': ' + t('y=a(x-p)^{2}+q') + '.', 'Substitute the point and solve for ' + t('a') + '.'], 'stretch factor from a point', { bad: [dW, qd(z.d * z.d, qs(y1, z.q))] });
    }
    var w = pickWhere(function () { return { s: r.pick(STRETCH), neg: r.chance(0.6), p: nz(r, 1, 6), q: nz(r, 1, 9), x1: nz(r, 0, 7) }; }, function (o) { var a = qm(o.s, o.neg ? -1 : 1), k = qa(qm(a, (o.x1 - o.p) * (o.x1 - o.p)), o.q); return o.x1 !== o.p && Math.abs(o.x1 - o.p) >= 2 && isI(k) && Math.abs(rv(k)) <= 60; });
    var a = qm(w.s, w.neg ? -1 : 1), k = qa(qm(a, (w.x1 - w.p) * (w.x1 - w.p)), w.q), parts = [stretchWords(w.s)];
    if (w.neg) parts.push('reflected in the ' + t('x') + '-axis'); parts.push(transWords(w.p, w.q).replace('a translation of ', 'translated '));
    var kOrder = qm(a, (w.x1 - w.p) * (w.x1 - w.p) + rv(w.q)), kPs = qa(qm(a, (w.x1 + w.p) * (w.x1 + w.p)), w.q);
    return numPart(cp, 'The graph of ' + t('y=x^{2}') + ' is transformed by ' + parts.join(', ').replace(/, ([^,]*)$/, ' and $1') + ', in that order. The point ' + t('(' + w.x1 + ',\\ k)') + ' is on the final graph. Determine ' + t('k') + '.', k,
      function (v) { if (near(v, rv(kOrder))) return { code: cp + 'vf-order', hint: 'Stretch first, then translate: the image is ' + t('y=' + vfT(a, w.p, w.q)) + '; the ' + t(rt(w.q)) + ' is not multiplied by ' + t('a') + '.' }; if (near(v, rv(kPs))) return { code: cp + 'vf-psign', hint: 'Translated ' + (w.p > 0 ? 'right' : 'left') + ' gives ' + t(binT(w.p)) + '.' }; if (w.neg && near(v, rv(qa(qm(w.s, (w.x1 - w.p) * (w.x1 - w.p)), w.q)))) return { code: cp + 'vf-refl', hint: 'The reflection makes ' + t('a') + ' negative.' }; return null; },
      'The final graph is ' + t('y=' + vfT(a, w.p, w.q)) + '.<br>' + t('k=' + cT(a) + '(' + w.x1 + sT(-w.p) + ')^{2}' + sT(w.q) + '=' + rt(qm(a, (w.x1 - w.p) * (w.x1 - w.p))) + sT(w.q) + '=' + rt(k)) + '.',
      ['Write the equation of the final graph, ' + t('y=a(x-p)^{2}+q') + '.', 'Substitute ' + t('x=' + w.x1) + ' to find ' + t('k') + '.'], 'a point on the image', { bad: [kOrder, kPs] });
  };
  /* BEG: which graph is narrower / wider and opens up / down (L2 #15) */
  B.shapeMC = function (r, cp) {
    var narrow = r.chance(0.5), down = r.chance(0.5), opts = [];
    var good = narrow ? r.pick([2, 3, 2.5, 4, 1.5]) : r.pick([0.5, 0.4, 0.25, 0.75]), bad1 = narrow ? r.pick([0.5, 0.4, 0.25]) : r.pick([2, 3, 2.5]), bad2 = good, bad3 = 1;
    function f(a) { var p = nz(r, 1, 5), q = nz(r, 0, 6); return t('y=' + (a === 1 ? '' : a === -1 ? '-' : dT(a)) + binT(p) + '^{2}' + sT(q)); }
    var sg = down ? -1 : 1;
    opts.push({ html: f(sg * good), right: true });
    opts.push({ html: f(sg * bad1), why: 'Here ' + t('|a|') + (narrow ? ' is less than 1, so the graph is <b>wider</b>.' : ' is greater than 1, so the graph is <b>narrower</b>.'), code: cp + 'vf-a' });
    opts.push({ html: f(-sg * bad2), why: 'Here ' + t('a') + (down ? ' is positive, so the graph opens <b>up</b>.' : ' is negative, so the graph opens <b>down</b>.'), code: cp + 'vf-refl' });
    opts.push({ html: f(sg * bad3), why: 'Here ' + t('|a|=1') + ': the same shape as ' + t('y=x^{2}') + '.', code: cp + 'vf-a' });
    return mcPart(r, 'Which graph is ' + (narrow ? 'narrower' : 'wider') + ' than the graph of ' + t('y=x^{2}') + ' and opens ' + (down ? 'down' : 'up') + '?', opts,
      t('|a|>1') + ' makes the parabola narrower and ' + t('0<|a|<1') + ' wider; ' + t('a<0') + ' opens down, ' + t('a>0') + ' up. The translations do not change the shape.',
      ['Look only at ' + t('a') + ': its size gives the width, its sign the direction of opening.'], 'shape from a');
  };

  /* ======================================================================================================
   * Lesson 3 (RF3): characteristics of vertex form
   * ====================================================================================================== */
  /* a vertex-form function, written plainly or rearranged ('lhs': y − c = …, 'div': ky = …, 'rev': y = q + a(x − p)²) */
  function vfSpec(r, opt) {
    opt = opt || {};
    var z = pickWhere(function () { return { a: r.pick([-4, -3, -2, -1, 2, 3, 5, [1, 2], [-1, 2], [1, 4], [-3, 4], [2, 3]]), p: nz(r, 0, 8), q: nz(r, 1, 12) }; }, function (o) { return !(o.p === 4 && o.q === 1) && !(o.p === -2 && o.q === 6) && (opt.p0 || o.p !== 0 || r.chance(0.25)); });
    var kind = opt.rearr ? r.pick(['lhs', 'lhs2', 'div', 'rev']) : 'plain', shown, step = '', wq = null;
    if (kind === 'lhs') { shown = 'y' + sT(-z.q) + '=' + cT(z.a) + binT(z.p) + '^{2}'; step = 'Solve for ' + t('y') + ': ' + t('y=' + vfT(z.a, z.p, z.q)) + '.<br>'; wq = -z.q; }
    else if (kind === 'lhs2') { var c = nz(r, 1, 6); while (c === z.q) c = nz(r, 1, 6); shown = 'y' + sT(c) + '=' + cT(z.a) + binT(z.p) + '^{2}' + sT(z.q + c); step = 'Solve for ' + t('y') + ': ' + t('y=' + vfT(z.a, z.p, z.q)) + '.<br>'; wq = z.q + c; }
    else if (kind === 'div') {
      var k = r.pick([2, 3, 4]); z.a = r.pick([1, -1]) * 1; z.a = [z.a, k];
      shown = k + 'y=' + cT(k * rv(z.a) === 1 ? 1 : -1) + binT(z.p) + '^{2}' + sT(k * z.q); step = 'Divide every term by ' + t(k) + ': ' + t('y=' + vfT(z.a, z.p, z.q)) + '.<br>'; wq = k * z.q;
    } else if (kind === 'rev') { shown = 'y=' + z.q + (rv(z.a) < 0 ? '-' + cT(qm(z.a, -1)) : '+' + cT(z.a)) + binT(z.p) + '^{2}'; step = 'Reorder: ' + t('y=' + vfT(z.a, z.p, z.q)) + '.<br>'; }
    else shown = 'y=' + vfT(z.a, z.p, z.q);
    return { a: R(z.a), p: z.p, q: z.q, shown: shown, step: step, wq: wq, kind: kind };
  }
  B.vertex = function (r, cp, opt) {
    var s = vfSpec(r, opt), ws = [];
    if (s.p) ws.push({ is: [-s.p, s.q], code: cp + 'vf-psign', hint: 'The bracket is ' + t('(x-p)') + ': ' + t(binT(s.p)) + ' means ' + t('p=' + s.p) + '.' });
    if (s.wq != null) ws.push({ is: [s.p, s.wq], code: cp + (s.kind === 'div' ? 'vf-div' : 'vf-move'), hint: 'First write the equation as ' + t('y=a(x-p)^{2}+q') + (s.kind === 'div' ? ': divide every term by the coefficient of ' + t('y') + '.' : ': move the constant on the left to the right side.') });
    ws.push({ is: [s.q, s.p], code: 'pt-swap', hint: 'The vertex is ' + t('(p,\\ q)') + ': the ' + t('x') + '-coordinate first.' });
    return pointPart(cp, 'State the vertex of the graph of ' + t(s.shown) + '.', [s.p, s.q], ws, s.step + 'In ' + t('y=a(x-p)^{2}+q') + ' the vertex is ' + t('(p,\\ q)') + ': ' + t(ptT(s.p, s.q)) + '.',
      ['Write the equation as ' + t('y=a(x-p)^{2}+q') + ' first if it is not.', 'The vertex is ' + t('(p,\\ q)') + ' — careful with the sign of ' + t('p') + '.'], 'vertex from vertex form');
  };
  B.range = function (r, cp, opt) {
    var s = vfSpec(r, opt), up = rv(s.a) > 0, op = up ? '\\ge ' : '\\le ', other = up ? '\\le ' : '\\ge ';
    var ws = [{ is: setT('y', other, s.q), code: cp + 'range-dir', hint: t('a=' + rt(s.a)) + (up ? ' is positive: the parabola opens up, so ' + t(s.q) + ' is the <b>minimum</b> value.' : ' is negative: the parabola opens down, so ' + t(s.q) + ' is the <b>maximum</b> value.') }];
    if (s.p !== s.q) ws.push({ is: setT('y', op, s.p), code: cp + 'range-p', hint: 'The range is about ' + t('y') + ': use the ' + t('y') + '-coordinate of the vertex, ' + t('q') + '.' });
    if (s.wq != null && s.wq !== s.q) ws.push({ is: setT('y', op, s.wq), code: cp + (s.kind === 'div' ? 'vf-div' : 'vf-move'), hint: 'First write the equation as ' + t('y=a(x-p)^{2}+q') + '.' });
    return setPart(cp, 'State the range of ' + t(s.shown) + '.', setT('y', op, s.q), ws, s.step + 'The vertex is ' + t(ptT(s.p, s.q)) + ' and ' + t('a') + (up ? '>0' : '<0') + ', so the parabola opens ' + (up ? 'up' : 'down') + ' and ' + t(s.q) + ' is the ' + (up ? 'minimum' : 'maximum') + ' value.<br>Range: ' + t(setT('y', op, s.q)) + '.',
      ['The range starts at the ' + t('y') + '-coordinate of the vertex.', 'It goes up from there if ' + t('a>0') + ', down if ' + t('a<0') + '.'], 'range from vertex form', 'y');
  };
  B.nXint = function (r, cp) {
    var z = pickWhere(function () { return { a: r.pick([-5, -3, -2, -1, [-1, 2], 2, 3, 4, [1, 2], [1, 3]]), p: nz(r, 0, 7), q: r.chance(0.2) ? 0 : nz(r, 1, 9) }; }, function () { return true; });
    var n = z.q === 0 ? 1 : rv(z.a) * z.q < 0 ? 2 : 0, up = rv(z.a) > 0;
    var why = z.q === 0 ? 'The vertex ' + t(ptT(z.p, 0)) + ' is on the ' + t('x') + '-axis: one ' + t('x') + '-intercept.' : 'The parabola opens ' + (up ? 'up' : 'down') + ' and its vertex ' + t(ptT(z.p, z.q)) + ' is ' + (z.q > 0 ? 'above' : 'below') + ' the ' + t('x') + '-axis, so it ' + (n === 2 ? 'crosses the axis twice' : 'never reaches the axis') + '.';
    var p = KP.number('How many ' + t('x') + '-intercepts does the graph of ' + t('y=' + vfT(z.a, z.p, z.q)) + ' have?', n, function (v) { if ([0, 1, 2].indexOf(v) >= 0) return { code: cp + 'nx-count', hint: 'Picture the vertex and the direction of opening: is the vertex above, on or below the ' + t('x') + '-axis, and which way does the parabola open?' }; return null; },
      why + ' (' + t('a') + ' and ' + t('q') + ' with opposite signs: 2; ' + t('q=0') + ': 1; the same sign: 0.)', ['Find the vertex and the direction of opening.', 'A parabola that opens toward the ' + t('x') + '-axis from its vertex crosses it twice.'], 'number of x-intercepts');
    p.bad = [0, 1, 2].filter(function (x) { return x !== n; }).map(String);
    return p;
  };
  /* the x-intercepts of y = a(x − p)² + q, exactly (L3 Ex 6, #5–6) */
  B.xintVF = function (r, cp, opt) {
    opt = opt || {};
    var kind = opt.kind || r.pick(['int', 'surd', 'surd', 'frac', 'none']);
    var z = pickWhere(function () {
      var o = { a: r.pick([-3, -2, -1, 2, 3, 4, [1, 2], [-1, 2], [1, 4]]), p: nz(r, 1, 7) };
      if (kind === 'int') o.m = r.pick([1, 4, 9, 16, 25, 36]);
      else if (kind === 'surd') o.m = r.pick([2, 3, 5, 6, 7, 8, 10, 12, 18, 20, 27, 28]);
      else if (kind === 'frac') { o.d = r.pick([2, 3]); o.n = r.pick([1, 5, 7, 10, 11, 5, 7]); o.m = [o.n, o.d]; o.a = r.pick([o.d, -o.d, 2 * o.d, -2 * o.d]); }
      else o.m = -r.pick([1, 2, 3, 4, 5, 9]);
      o.q = qm(qm(o.a, -1), o.m); return o;
    }, function (o) { return isI(o.q) && Math.abs(rv(o.q)) <= 80 && !(kind === 'frac' && gcd(o.n, o.d) !== 1) && !(o.p === 3 && rv(o.m) === 16); });
    var a = R(z.a), q = R(z.q), m = R(z.m), vals, key, sol;
    sol = t('0=' + vfT(a, z.p, q)) + ', so ' + t(cT(a) === '' ? binT(z.p) + '^{2}=' + rt(qm(q, -1)) : (cT(a) === '-' ? '-' : rt(a)) + binT(z.p) + '^{2}=' + rt(qm(q, -1))) + ' and ' + t(binT(z.p) + '^{2}=' + rt(m)) + '.<br>';
    if (kind === 'none') { vals = []; key = '\\text{no real roots}'; sol += 'A square is never negative, so there are no ' + t('x') + '-intercepts. (The vertex ' + t(ptT(z.p, q)) + ' is ' + (rv(a) > 0 ? 'above the axis and the parabola opens up' : 'below the axis and the parabola opens down') + '.)'; }
    else if (kind === 'int') { var s = Math.sqrt(rv(m)); vals = [z.p + s, z.p - s]; key = 'x=' + (z.p + s) + ',\\ x=' + (z.p - s); sol += t('x' + sT(-z.p) + '=\\pm ' + s) + ', so ' + t('x=' + (z.p + s)) + ' or ' + t('x=' + (z.p - s)) + '.'; }
    else {
      var M = kind === 'frac' ? z.n * z.d : rv(m), D = kind === 'frac' ? z.d : 1, sr = surdRoots(z.p * D, 1, M, D);
      vals = sr.vals; key = 'x=' + sr.tex;
      sol += t('x' + sT(-z.p) + '=\\pm\\sqrt{' + rt(m) + '}') + ', so ' + t('x=' + sr.tex) + (kind === 'frac' ? ' (since ' + t('\\sqrt{' + rt(m) + '}=\\frac{\\sqrt{' + M + '}}{' + D + '}') + ')' : '') + '.';
      if (kind === 'surd' && !ex.simplest(M, 2)) sol += ' (' + t('\\sqrt{' + M + '}=' + sqrtSplit(M)[0] + '\\sqrt{' + sqrtSplit(M)[1] + '}') + ')';
    }
    var ws = [];
    if (vals.length) {
      ws.push({ vals: vals.map(function (x) { return x - 2 * z.p; }), code: cp + 'vf-psign', hint: 'The bracket ' + t(binT(z.p)) + ' means ' + t('p=' + z.p) + ': add ' + t(par(z.p)) + ' to both sides at the end.' });
      if (rv(a) !== 1 && rv(qm(q, -1)) > 0 && !near(rv(qm(q, -1)), rv(m))) ws.push({ vals: [z.p + Math.sqrt(rv(qm(q, -1))), z.p - Math.sqrt(rv(qm(q, -1)))], code: cp + 'xint-diva', hint: 'Divide both sides by ' + t('a=' + rt(a)) + ' before taking the square root.' });
    } else ws.push({ vals: [z.p + Math.sqrt(-rv(m)), z.p - Math.sqrt(-rv(m))], code: cp + 'none-roots', hint: 'Look at the sign: ' + t(binT(z.p) + '^{2}=' + rt(m)) + ' asks for a square equal to a negative number.' });
    return rootsPart(cp, 'Determine the ' + t('x') + '-intercepts of the graph of ' + t('y=' + vfT(a, z.p, q)) + ' as exact values. (If there are none, type “no real roots”.)', vals, { exact: true, keyTex: key, wrongs: ws }, sol,
      ['Set ' + t('y=0') + ' and isolate the square ' + t('(x-p)^{2}') + '.', 'Take the square root of both sides (' + t('\\pm') + '). A square cannot equal a negative number. Simplify the radical.'], 'x-intercepts from vertex form');
  };
  /* MAS: working backwards from vertex form (EP03 C1–C3) */
  B.vfBack = function (r, cp) {
    var kind = r.pick(['qCond', 'pq', 'twoP']);
    if (kind === 'qCond') {
      var a = r.pick([-4, -3, -2, 2, 3, [1, 2], [-1, 2]]), p = nz(r, 1, 6), two = r.chance(0.5), up = rv(a) > 0;
      var op = (two ? !up : up) ? '>' : '<', other = op === '>' ? '<' : '>';
      return setPart(cp, 'For which values of ' + t('q') + ' does the graph of ' + t('y=' + cT(a) + binT(p) + '^{2}+q') + ' have ' + (two ? 'two' : 'no') + ' ' + t('x') + '-intercepts?', setT('q', op, 0),
        [{ is: setT('q', other, 0), code: cp + 'k-dir', hint: 'The parabola opens ' + (up ? 'up' : 'down') + '. For ' + (two ? 'two intercepts the vertex must be on the other side of the axis from where it opens' : 'none, the vertex must be on the side it opens toward') + '.' }, { is: setT('q', op + '=', 0).replace('>=', '\\ge ').replace('<=', '\\le '), code: cp + 'k-strict', hint: 'When ' + t('q=0') + ' the vertex is on the axis: exactly one ' + t('x') + '-intercept. Leave ' + t(0) + ' out.' }],
        'The vertex is ' + t('(' + p + ',\\ q)') + ' and the parabola opens ' + (up ? 'up' : 'down') + ' (' + t('a=' + rt(a)) + ').<br>' + (two ? 'Two ' + t('x') + '-intercepts: the vertex must be ' + (up ? 'below' : 'above') + ' the axis, so ' + t('q' + op + '0') + '.' : 'No ' + t('x') + '-intercepts: the vertex must be ' + (up ? 'above' : 'below') + ' the axis, so ' + t('q' + op + '0') + '.') + ' (' + t('q=0') + ' gives one.)',
        ['Picture the vertex ' + t('(p,\\ q)') + ' and the direction of opening.', 'Two intercepts when ' + t('a') + ' and ' + t('q') + ' have opposite signs; none when they have the same sign.'], 'values of q', 'q');
    }
    if (kind === 'pq') {
      var z = pickWhere(function () { return { a: r.pick([-3, -2, 2, 3, 4, [1, 2], [-1, 2]]), h: nz(r, 1, 6), m: r.pick([2, 3, 5, 6, 7, 10, 11]) }; }, function (o) { return isI(qm(o.a, o.m)); });
      var qv = qm(qm(z.a, -1), z.m);
      return numPart(cp, 'The graph of ' + t('y=' + cT(z.a) + '(x-p)^{2}+q') + ' has ' + t('x') + '-intercepts ' + t(z.h + '+\\sqrt{' + z.m + '}') + ' and ' + t(z.h + '-\\sqrt{' + z.m + '}') + '. Determine ' + t('q') + '.', qv,
        function (v) { if (near(v, -rv(qv))) return { code: cp + 'q-sign', hint: 'Check the sign: at an intercept ' + t('0=a(\\sqrt{' + z.m + '})^{2}+q') + '.' }; if (near(v, -z.m) || near(v, z.m)) return { code: cp + 'xint-diva', hint: 'Use ' + t('a=' + rt(z.a)) + ': ' + t('(x-p)^{2}=' + z.m) + ' at an intercept, so ' + t('0=' + rt(z.a) + '(' + z.m + ')+q') + '.' }; return null; },
        'The intercepts are symmetric about the axis: ' + t('p=' + z.h) + '. At ' + t('x=' + z.h + '+\\sqrt{' + z.m + '}') + ', ' + t('(x-p)^{2}=' + z.m) + ':<br>' + t('0=' + rt(z.a) + '(' + z.m + ')+q') + ', so ' + t('q=' + rt(qv)) + '.',
        ['The axis is halfway between the intercepts: that gives ' + t('p') + '.', 'Substitute one intercept with ' + t('y=0') + ' and solve for ' + t('q') + '.'], 'q from the x-intercepts', { bad: [qm(qv, -1)] });
    }
    var w = pickWhere(function () { return { n: r.int(1, 5), x1: nz(r, 0, 6) }; }, function (o) { return !(o.n === 3 && o.x1 === 1); });
    return rootsPart(cp, 'The graph of ' + t('y=(x-p)^{2}-' + w.n * w.n) + ' has an ' + t('x') + '-intercept at ' + t('x=' + w.x1) + '. Determine every possible value of ' + t('p') + '.', [w.x1 - w.n, w.x1 + w.n],
      { v: 'p', keyTex: 'p=' + (w.x1 - w.n) + ',\\ p=' + (w.x1 + w.n), missHint: 'The intercept can be on either side of the axis.', wrongs: [{ vals: [-w.x1 - w.n, -w.x1 + w.n], code: cp + 'vf-psign', hint: 'Substitute ' + t('x=' + w.x1) + ': ' + t('(' + w.x1 + '-p)^{2}=' + w.n * w.n) + '.' }] },
      'Substitute ' + t('(' + w.x1 + ',\\ 0)') + ': ' + t('0=(' + w.x1 + '-p)^{2}-' + w.n * w.n) + ', so ' + t('(' + w.x1 + '-p)^{2}=' + w.n * w.n) + ' and ' + t(w.x1 + '-p=\\pm ' + w.n) + '.<br>' + t('p=' + (w.x1 - w.n)) + ' or ' + t('p=' + (w.x1 + w.n)) + ' (the intercept is ' + t(w.n) + ' units on either side of the axis).',
      ['Substitute the intercept: ' + t('x=' + w.x1) + ', ' + t('y=0') + '.', 'Solve for ' + t('p') + ' with square roots: two values.'], 'two values of p');
  };

  /* ======================================================================================================
   * Lesson 4 (RF4): general form and factored form
   * ====================================================================================================== */
  function genSpec(r, opt) {
    opt = opt || {};
    return pickWhere(function () { var o = { a: r.pick(opt.as || [-3, -2, -1, 1, 2, 3, [1, 2], [-1, 2]]), h: r.chance(opt.half || 0.15) ? [nz(r, 1, 7) * 2 + 1, 2] : nz(r, 1, 6), c: nz(r, 1, 15) }; o.b = qm(qm(o.a, -2), o.h); o.k = fval(o.a, o.b, o.c, o.h); return o; },
      function (o) { return isI(o.b) && rv(o.b) !== 0 && Math.abs(rv(o.b)) <= 24 && Math.abs(rv(o.k)) <= 60 && (isI(o.k) || R(o.k)[1] <= 8) && !(rv(o.a) === 3 && rv(o.b) === -12); });
  }
  B.axisGen = function (r, cp) {
    var g = genSpec(r, { half: 0.25 }), b = g.b, a = g.a;
    return axisPart(cp, 'State the equation of the axis of symmetry of the graph of ' + t('y=' + genT(a, b, g.c)) + '.', g.h,
      [{ v: qm(g.h, -1), code: cp + 'axis-sign', hint: 'The formula is ' + t('x=-\\frac{b}{2a}') + ' — keep the negative sign.' }, { v: qm(g.h, 2), code: cp + 'axis-2a', hint: 'Divide by ' + t('2a') + ', not ' + t('a') + ': ' + t('x=-\\frac{b}{2a}') + '.' }, { v: g.c, code: cp + 'vtx-yint', hint: t(g.c) + ' is the ' + t('y') + '-intercept. The axis is ' + t('x=-\\frac{b}{2a}') + '.' }],
      t('a=' + rt(a)) + ', ' + t('b=' + rt(b)) + ': ' + t('x=-\\frac{b}{2a}=-\\frac{' + rt(b) + '}{2(' + rt(a) + ')}=' + rt(g.h)) + '.<br>The axis of symmetry is ' + t('x=' + rt(g.h)) + '.',
      ['For ' + t('y=ax^{2}+bx+c') + ' the axis of symmetry is ' + t('x=-\\frac{b}{2a}') + '.'], 'axis from general form');
  };
  /* the vertex of y = a(x − r)(x − s) ('int') or a(mx + n)(x − s) ('dec') (L4 Ex 2, #2, #13) */
  B.vertexFac = function (r, cp, opt) {
    opt = opt || {};
    var dec = opt.mode === 'dec' || (opt.mode !== 'int' && r.chance(0.35));
    var z = pickWhere(function () { return { a: r.pick(dec ? [1, 2, -1, -2] : [-3, -2, -1, 1, 2, 3, [1, 2], [-1, 2], 4]), r1: nz(r, 0, 9), r2: nz(r, 1, 9), m: dec ? r.pick([2, 4]) : 1, n: nz(r, 1, 7) }; },
      function (o) { var zr = dec ? [-o.n, o.m] : [o.r1, 1]; if (dec && gcd(o.m, o.n) !== 1) return false; if (!dec && o.r1 === o.r2) return false; if (!dec && (o.r1 + o.r2) % 2 && rv(o.a) !== 2 && rv(o.a) !== -2 && rv(o.a) !== 4) return false; var h = qd(qa(zr, o.r2), 2), k = qm(o.a, qm(qs(h, zr), qs(h, o.r2))); return Math.abs(rv(k)) <= 70 && !near(rv(zr), o.r2) && R(k)[1] <= 8 && !(o.a === -1 && o.r1 === -3 && o.r2 === 5); });
    var zr = dec ? R([-z.n, z.m]) : R(z.r1), h = qd(qa(zr, z.r2), 2), k = qm(qm(z.a, dec ? z.m : 1), qm(qs(h, zr), qs(h, z.r2))), aEff = qm(z.a, dec ? z.m : 1);
    var shown = dec ? FX.tex([P.num(z.a), lin(z.m, z.n), lin(1, -z.r2)]) : FX.tex([P.num(z.a), lin(1, -z.r1), lin(1, -z.r2)]);
    if (rv(z.a) === 1) shown = dec ? FX.tex([lin(z.m, z.n), lin(1, -z.r2)]) : FX.tex([lin(1, -z.r1), lin(1, -z.r2)]);
    var ws = [{ is: [qm(h, -1), k], code: cp + 'zero-sign', hint: 'Set each factor equal to ' + t(0) + ': the zeros are ' + t(rt(zr)) + ' and ' + t(z.r2) + '.' }];
    if (rv(aEff) !== 1) ws.push({ is: [h, qd(k, aEff)], code: cp + 'vtx-a', hint: 'Substitute the axis value into the <b>whole</b> function, including ' + t('a') + '.' });
    var yint = qm(aEff, qm(zr, z.r2)); if (rv(yint) !== 0) ws.push({ is: [0, yint], code: cp + 'vtx-yint', hint: 'That is the ' + t('y') + '-intercept. The vertex is on the axis of symmetry, halfway between the zeros.' });
    return pointPart(cp, 'Determine the vertex of the graph of ' + t('y=' + shown) + '.', [h, k], ws,
      'Zeros: ' + t(rt(zr)) + ' and ' + t(z.r2) + '. Axis: ' + t('x=\\frac{' + rt(zr) + '+' + par(z.r2) + '}{2}=' + rt(h)) + '.<br>' + t('y=' + shown.replace(/x/g, '(' + rt(h) + ')') + '=' + rt(k)) + '. The vertex is ' + t(ptT(h, k)) + '.',
      ['The zeros come from the factors; the axis is halfway between them.', 'Substitute that ' + t('x') + '-value into the function for the ' + t('y') + '-coordinate.'], 'vertex from factored form');
  };
  /* the vertex ('vertex'), range ('range') or max/min value ('max') of y = ax² + bx + c (L4 Ex 4, #4, #6) */
  B.vertexGen = function (r, cp, opt) {
    opt = opt || {};
    var ask = opt.ask || r.pick(['vertex', 'range', 'max']), g = genSpec(r, { half: 0.2 }), a = g.a, b = g.b, c = g.c, h = g.h, k = g.k, up = rv(a) > 0;
    var shown = 'y=' + genT(a, b, c), kW = fval(a, b, c, qm(h, -1));
    var sol = 'Axis: ' + t('x=-\\frac{b}{2a}=-\\frac{' + rt(b) + '}{2(' + rt(a) + ')}=' + rt(h)) + '.<br>' + t('y=' + genT(a, b, c).replace(/x/g, '(' + rt(h) + ')') + '=' + rt(k)) + '. Vertex ' + t(ptT(h, k)) + '; ' + t('a') + (up ? '>0' : '<0') + ', so ' + t(rt(k)) + ' is the ' + (up ? 'minimum' : 'maximum') + ' value.';
    var hints = ['The axis of symmetry is ' + t('x=-\\frac{b}{2a}') + '.', 'Substitute it into the function for the ' + t('y') + '-coordinate of the vertex.'];
    if (ask === 'vertex') return pointPart(cp, 'Determine the vertex of the graph of ' + t(shown) + '.', [h, k], [{ is: [qm(h, -1), kW], code: cp + 'axis-sign', hint: 'The axis is ' + t('x=-\\frac{b}{2a}') + ' — keep the negative sign.' }, { is: [0, c], code: cp + 'vtx-yint', hint: t('(0,\\ ' + rt(c) + ')') + ' is the ' + t('y') + '-intercept, not the vertex.' }], sol, hints, 'vertex from general form');
    if (ask === 'range') {
      var op = up ? '\\ge ' : '\\le ';
      return setPart(cp, 'State the range of ' + t(shown) + '.', setT('y', op, k), [{ is: setT('y', up ? '\\le ' : '\\ge ', k), code: cp + 'range-dir', hint: 'The parabola opens ' + (up ? 'up' : 'down') + ', so the vertex gives the ' + (up ? 'minimum' : 'maximum') + '.' }, { is: setT('y', op, c), code: cp + 'range-c', hint: t(rt(c)) + ' is the ' + t('y') + '-intercept. Use the vertex.' }, { is: setT('y', op, kW), code: cp + 'axis-sign', hint: 'The axis is ' + t('x=-\\frac{b}{2a}') + ' — keep the negative sign.' }], sol + '<br>Range: ' + t(setT('y', op, k)) + '.', hints, 'range from general form', 'y');
    }
    return numPart(cp, 'Determine the ' + (up ? 'minimum' : 'maximum') + ' value of ' + t(shown) + '.', k, function (v) { if (near(v, rv(h))) return { code: cp + 'ctx-time', hint: t(rt(h)) + ' is where the ' + (up ? 'minimum' : 'maximum') + ' happens (the ' + t('x') + '-coordinate). The value is the ' + t('y') + '-coordinate.' }; if (near(v, rv(kW))) return { code: cp + 'axis-sign', hint: 'The axis is ' + t('x=-\\frac{b}{2a}') + ' — keep the negative sign.' }; if (near(v, rv(c))) return { code: cp + 'ctx-c', hint: 'That is the ' + t('y') + '-intercept.' }; return null; }, sol, hints, 'maximum or minimum value', { bad: [h, kW] });
  };
  /* MAS: an unknown coefficient (L4 #9, EP04 C1–C2) */
  B.unknownCoef = function (r, cp) {
    var kind = r.pick(['a', 'c', 'sym']);
    if (kind === 'a') {
      var z = pickWhere(function () { return { a: r.pick([-4, -3, -2, 2, 3, 4, [1, 2], [-1, 2]]), h: nz(r, 1, 4), c: nz(r, 1, 9) }; }, function (o) { var b = qm(qm(o.a, -2), o.h); return isI(b) && Math.abs(rv(b)) <= 16 && !(o.a === -3 && o.h === -1); });
      var b = rv(qm(qm(z.a, -2), z.h)), k = fval(z.a, b, z.c, z.h), aw = qm(z.a, -1);
      return pointPart(cp, 'The graph of ' + t('y=ax^{2}' + sT(b) + 'x' + sT(z.c)) + ' has the axis of symmetry ' + t('x=' + z.h) + '. Determine ' + t('a') + ', then type the vertex.', [z.h, k],
        [{ is: [z.h, fval(aw, b, z.c, z.h)], code: cp + 'axis-sign', hint: 'Solve ' + t('-\\frac{' + b + '}{2a}=' + z.h) + ' carefully: ' + t('a=' + rt(z.a)) + '.' }, { is: [z.h, z.c], code: cp + 'vtx-yint', hint: 'Find ' + t('a') + ', then substitute ' + t('x=' + z.h) + ' into the whole function.' }],
        t('-\\frac{' + b + '}{2a}=' + z.h) + ', so ' + t((-b) + '=' + 2 * z.h + 'a') + ' and ' + t('a=' + rt(z.a)) + '.<br>' + t('y=' + genT(z.a, b, z.c).replace(/x/g, '(' + z.h + ')') + '=' + rt(k)) + '. The vertex is ' + t(ptT(z.h, k)) + '.',
        ['Use the axis formula ' + t('x=-\\frac{b}{2a}') + ' with the known ' + t('b') + ' and solve for ' + t('a') + '.', 'Then substitute the axis value for the ' + t('y') + '-coordinate.'], 'unknown leading coefficient');
    }
    if (kind === 'c') {
      var g = genSpec(r, { as: [-3, -2, -1, 1, 2, 3], half: 0 }), mv = g.k, up = rv(g.a) > 0, part = qs(mv, g.c), cv = g.c, wrongC = qs(mv, qa(qm(g.a, qm(g.h, g.h)), qm(g.b, qm(g.h, -1))));
      return numPart(cp, 'The function ' + t('y=' + genT(g.a, g.b, 0) + '+c') + ' has a ' + (up ? 'minimum' : 'maximum') + ' value of ' + t(rt(mv)) + '. Determine ' + t('c') + '.', cv,
        function (v) { if (near(v, rv(wrongC))) return { code: cp + 'axis-sign', hint: 'The axis is ' + t('x=-\\frac{b}{2a}') + ' — keep the negative sign.' }; if (near(v, rv(qa(mv, part)))) return { code: cp + 'q-sign', hint: 'Check the sign when you solve for ' + t('c') + '.' }; return null; },
        'Axis: ' + t('x=-\\frac{' + rt(g.b) + '}{2(' + rt(g.a) + ')}=' + rt(g.h)) + ', so the vertex is ' + t(ptT(g.h, mv)) + '.<br>' + t(rt(mv) + '=' + genT(g.a, g.b, 0).replace(/x/g, '(' + rt(g.h) + ')') + '+c=' + rt(qs(mv, cv)) + '+c') + ', so ' + t('c=' + rt(cv)) + '.',
        ['The ' + (up ? 'minimum' : 'maximum') + ' is at the vertex, on the axis ' + t('x=-\\frac{b}{2a}') + '.', 'Substitute the vertex into the function and solve for ' + t('c') + '.'], 'unknown constant from the maximum', { bad: [wrongC] });
    }
    var s = pickWhere(function () { return { a: r.pick([-2, -1, 1, 2, 3]), x1: nz(r, 0, 6), d: r.int(1, 4) * 2, y0: nz(r, 1, 9) }; }, function (o) { var h = o.x1 + o.d / 2, b = -2 * o.a * h, c = o.y0 - o.a * o.x1 * o.x1 - b * o.x1; return b !== 0 && Math.abs(b) <= 24 && Math.abs(c) <= 60; });
    var h2 = s.x1 + s.d / 2, b2 = -2 * s.a * h2, c2 = s.y0 - s.a * s.x1 * s.x1 - b2 * s.x1, x2 = s.x1 + s.d, cW = s.y0 - s.a * s.x1 * s.x1 + b2 * s.x1;
    return numPart(cp, 'The graph of ' + t('y=' + cT(s.a) + 'x^{2}+bx+c') + ' passes through ' + t('(' + s.x1 + ',\\ ' + s.y0 + ')') + ' and ' + t('(' + x2 + ',\\ ' + s.y0 + ')') + '. Determine ' + t('b') + ' and ' + t('c') + '. Type the value of ' + t('c') + '.', c2,
      function (v) { if (near(v, cW)) return { code: cp + 'axis-sign', hint: 'From the axis: ' + t('-\\frac{b}{2(' + s.a + ')}=' + h2) + ', so ' + t('b=' + b2) + '.' }; return null; },
      'The two points have the same ' + t('y') + '-value, so the axis is halfway between them: ' + t('x=\\frac{' + s.x1 + '+' + par(x2) + '}{2}=' + h2) + '.<br>' + t('-\\frac{b}{2(' + s.a + ')}=' + h2) + ', so ' + t('b=' + b2) + '.<br>Substitute ' + t('(' + s.x1 + ',\\ ' + s.y0 + ')') + ': ' + t(s.y0 + '=' + s.a + '(' + s.x1 + ')^{2}' + sT(b2) + '(' + s.x1 + ')+c') + ', so ' + t('c=' + c2) + '.',
      ['Points with the same ' + t('y') + '-value are mirror images: the axis is halfway between them.', 'Use ' + t('x=-\\frac{b}{2a}') + ' for ' + t('b') + ', then substitute a point for ' + t('c') + '.'], 'coefficients from two symmetric points', { bad: [cW] });
  };

  /* ======================================================================================================
   * Lesson 5 (RF3): an equation from the vertex and a point
   * ====================================================================================================== */
  /* mode 'int' (a an integer), 'frac' (a fraction, or the y-intercept / an x-intercept as the point) (L5 Ex 1–2, #2, #4) */
  B.vpEq = function (r, cp, opt) {
    opt = opt || {};
    var mode = opt.mode || 'frac', via = mode === 'int' ? 'pt' : r.pick(['pt', 'pt', 'yint', 'xint']);
    var z = pickWhere(function () { return { a: r.pick(mode === 'int' ? [-4, -3, -2, -1, 2, 3, 4] : [[1, 2], [-1, 2], [1, 3], [-1, 3], [1, 4], [-1, 4], [3, 2], [-3, 2], [2, 3], [-2, 3], [3, 4]]), p: nz(r, 0, 7), q: nz(r, 1, 10), d: nz(r, 1, 6) }; },
      function (o) { if (via === 'yint') o.d = -o.p; if (via === 'xint') { var m = qd(qm(o.q, -1), o.a); if (rv(m) <= 0 || !isSq(rv(m)) || !isI(m)) return false; o.d = Math.round(Math.sqrt(rv(m))) * (r.chance(0.5) ? 1 : -1); } var y = qa(qm(o.a, o.d * o.d), o.q); return o.d !== 0 && Math.abs(o.d) >= (mode === 'int' ? 1 : 2) && isI(y) && Math.abs(rv(y)) <= 50 && !(o.p === 2 && o.q === -1 && o.d === 2); });
    var a = R(z.a), x1 = z.p + z.d, y1 = qa(qm(a, z.d * z.d), z.q), T = vfP(a, z.p, z.q);
    var info = via === 'yint' ? 'its ' + t('y') + '-intercept is ' + t(rt(y1)) : via === 'xint' ? 'one of its ' + t('x') + '-intercepts is ' + t(x1) : 'it passes through ' + t(ptT(x1, y1));
    var dy = qs(y1, z.q), ws = [];
    var aP = qd(dy, (x1 + z.p) * (x1 + z.p)); if (z.p && (x1 + z.p) !== 0) ws.push({ p: vfP(aP, -z.p, z.q), code: cp + 'vf-psign', hint: 'The vertex ' + t(ptT(z.p, z.q)) + ' gives the bracket ' + t(binT(z.p)) + '.' });
    if (Math.abs(z.d) !== 1) ws.push({ p: vfP(qd(dy, z.d), z.p, z.q), code: cp + 'vp-nosq', hint: 'Square the bracket: ' + t('(' + x1 + sT(-z.p) + ')^{2}=' + z.d * z.d) + '.' });
    if (rv(dy) !== 0 && Math.abs(rv(dy)) !== z.d * z.d) ws.push({ p: vfP(qd(z.d * z.d, dy), z.p, z.q), code: cp + 'vp-recip', hint: 'Solve ' + t(rt(dy) + '=' + kA(z.d * z.d)) + ' by dividing both sides by ' + t(z.d * z.d) + '.' });
    return eqPart(cp, 'A parabola has its vertex at ' + t(ptT(z.p, z.q)) + ', and ' + info + '. Write its equation in vertex form.', T, { form: 'vertex', wrongs: ws, aHint: 'substitute the point and solve for ' + t('a') + '.' },
      t('y=a' + binT(z.p) + '^{2}' + sT(z.q)) + '. Substitute ' + t(ptT(x1, y1)) + ': ' + t(rt(y1) + '=a(' + x1 + sT(-z.p) + ')^{2}' + sT(z.q)) + ', so ' + t(rt(dy) + '=' + kA(z.d * z.d)) + ' and ' + t('a=' + rt(a)) + '.<br>' + t('y=' + vfT(a, z.p, z.q)) + '.',
      ['Start with ' + t('y=a(x-p)^{2}+q') + ' and the vertex values for ' + t('p') + ' and ' + t('q') + '.', 'Substitute the other point (' + (via === 'yint' ? t('x=0') : via === 'xint' ? t('y=0') : 'its coordinates') + ') and solve for ' + t('a') + '.'], 'equation from the vertex and a point');
  };
  /* the equation of a graph with its vertex and one more point marked (L5 Ex 3, #3) */
  B.graphEq = function (r, cp) {
    var z = pickWhere(function () { return { a: r.pick([-3, -2, -1, 1, 2, 3, [1, 2], [-1, 2], [1, 4], [-1, 4], [3, 2], [-3, 2]]), p: nz(r, 0, 4), q: nz(r, 0, 5), d: nz(r, 1, 4) }; },
      function (o) { var y = qa(qm(o.a, o.d * o.d), o.q); return isI(y) && Math.abs(rv(y)) <= 9 && Math.abs(rv(qm(o.a, o.d * o.d))) >= 2 && (Math.abs(o.d) >= 2 || Math.abs(rv(o.a)) >= 2); });
    var a = R(z.a), x1 = z.p + z.d, y1 = rv(qa(qm(a, z.d * z.d), z.q)), lo = Math.min(z.q, y1) - 2, hi = Math.max(z.q, y1) + 2, av = rv(a);
    var span = Math.max(Math.abs(z.d) + 2, 4), xl = Math.min(z.p - span, -1), xh = Math.max(z.p + span, 1); lo = Math.min(lo, -1); hi = Math.max(hi, 1);
    var reach = Math.sqrt(Math.max(Math.abs((av > 0 ? hi : lo) - z.q) / Math.abs(av), 0.25));
    var fig = '<div class="fig">' + HW.graph({ x: [xl, xh], y: [lo, hi], grid: 1, labels: 2, max: 300, points: [{ x: z.p, y: z.q }, { x: x1, y: y1 }], fns: [{ f: function (x) { return av * (x - z.p) * (x - z.p) + z.q; }, from: Math.max(xl, z.p - reach), to: Math.min(xh, z.p + reach), start: 'arrow', end: 'arrow' }], aria: 'graph of a parabola with two marked points' }) + '</div>';
    var dy = qs(y1, z.q), ws = [];
    if (z.p) ws.push({ p: vfP(qd(dy, (x1 + z.p) * (x1 + z.p) || 1), -z.p, z.q), code: cp + 'vf-psign', hint: 'The vertex ' + t(ptT(z.p, z.q)) + ' gives the bracket ' + t(binT(z.p)) + '.' });
    if (Math.abs(z.d) !== 1) ws.push({ p: vfP(qd(dy, z.d), z.p, z.q), code: cp + 'vp-nosq', hint: 'Square the bracket: ' + t('(' + x1 + sT(-z.p) + ')^{2}=' + z.d * z.d) + '.' });
    var p = eqPart(cp, 'The graph of a quadratic function is shown. The two marked points (the vertex and one other point) have integer coordinates. Write the equation in vertex form.' + fig, vfP(a, z.p, z.q), { form: 'vertex', wrongs: ws, aHint: 'substitute the second marked point and solve for ' + t('a') + '.' },
      'The vertex is ' + t(ptT(z.p, z.q)) + ' and the graph passes through ' + t(ptT(x1, y1)) + '.<br>' + t(rt(y1) + '=a(' + x1 + sT(-z.p) + ')^{2}' + sT(z.q)) + ', so ' + t(rt(dy) + '=' + kA(z.d * z.d)) + ' and ' + t('a=' + rt(a)) + '.<br>' + t('y=' + vfT(a, z.p, z.q)) + '.',
      ['Read the vertex from the graph: ' + t('y=a(x-p)^{2}+q') + '.', 'Substitute the other marked point and solve for ' + t('a') + '.'], 'equation from a graph');
    return p;
  };
  /* MAS: the axis and two points; an arch; a fountain jet (L5 #8, #11, #13, EP05 B3, C1) */
  B.vpMas = function (r, cp) {
    var kind = r.pick(['axis2', 'arch', 'jet']);
    if (kind === 'axis2') {
      var z = pickWhere(function () { return { a: r.pick([-3, -2, -1, 1, 2, 3, [1, 2], [-1, 2]]), h: nz(r, 0, 5), q: nz(r, 1, 9), d1: r.int(1, 4), d2: r.int(2, 5) }; },
        function (o) { var y1 = qa(qm(o.a, o.d1 * o.d1), o.q), y2 = qa(qm(o.a, o.d2 * o.d2), o.q); return o.d1 !== o.d2 && isI(y1) && isI(y2) && Math.abs(rv(y2)) <= 50 && Math.abs(rv(y1)) <= 50; });
      var a = R(z.a), x1 = z.h - z.d1, x2 = z.h + z.d2, y1 = qa(qm(a, z.d1 * z.d1), z.q), y2 = qa(qm(a, z.d2 * z.d2), z.q);
      return eqPart(cp, 'A parabola has the axis of symmetry ' + t('x=' + z.h) + ' and passes through ' + t(ptT(x1, y1)) + ' and ' + t(ptT(x2, y2)) + '. Write its equation in vertex form.', vfP(a, z.h, z.q), { form: 'vertex', wrongs: [{ p: vfP(a, -z.h, z.q), code: cp + 'vf-psign', hint: 'The axis ' + t('x=' + z.h) + ' gives the bracket ' + t(binT(z.h)) + '.' }] },
        t('y=a' + binT(z.h) + '^{2}+q') + '.<br>' + t(ptT(x1, y1)) + ': ' + t(rt(y1) + '=' + z.d1 * z.d1 + 'a+q') + '; ' + t(ptT(x2, y2)) + ': ' + t(rt(y2) + '=' + z.d2 * z.d2 + 'a+q') + '.<br>Subtract: ' + t(rt(qs(y2, y1)) + '=' + (z.d2 * z.d2 - z.d1 * z.d1) + 'a') + ', so ' + t('a=' + rt(a)) + ' and ' + t('q=' + rt(y1) + '-' + par(qm(a, z.d1 * z.d1)) + '=' + z.q) + '.<br>' + t('y=' + vfT(a, z.h, z.q)) + '.',
        ['The axis gives ' + t('p') + ': ' + t('y=a(x-p)^{2}+q') + ' with two unknowns, ' + t('a') + ' and ' + t('q') + '.', 'Substitute both points and solve the two equations (subtract them).'], 'equation from the axis and two points');
    }
    if (kind === 'arch') {
      var s = pickWhere(function () { return { w: r.pick([20, 24, 30, 36, 40, 48, 50, 60]), H: r.pick([6, 8, 9, 10, 12, 15]), D: r.int(2, 9) }; }, function (o) { return o.D < o.w / 2 - 1 && !(o.w === 40 && o.H === 10); });
      var half = s.w / 2, a2 = -s.H / (half * half), X = half - s.D, hgt = s.H + a2 * X * X, aR = R([-s.H, half * half]);
      return apxPart(cp, 'A parabolic arch spans ' + t(s.w) + ' m at its base and rises to ' + t(s.H) + ' m at its centre. Place the origin on the base directly below the top of the arch. How high is the arch ' + t(s.D) + ' m in from one end of the base? Give the answer to the nearest tenth of a metre.', hgt, 1,
        function (v) { var w1 = s.H + a2 * s.D * s.D; if (Math.abs(v - K.roundTo(w1, 1)) < 1e-9) return { code: cp + 'ctx-time', hint: t(s.D) + ' m in from an end is ' + t('x=' + half + '-' + s.D + '=' + X) + ' from the centre, not ' + t('x=' + s.D) + '.' }; return null; },
        'Vertex ' + t('(0,\\ ' + s.H + ')') + ', and the base ends at ' + t('(\\pm' + half + ',\\ 0)') + ': ' + t('y=ax^{2}+' + s.H) + ', ' + t('0=' + half * half + 'a+' + s.H) + ', so ' + t('a=' + rt(aR)) + '.<br>' + t(s.D) + ' m in from an end: ' + t('x=' + half + '-' + s.D + '=' + X) + ', ' + t('y=' + rt(aR) + '(' + X + ')^{2}+' + s.H + '\\approx ' + rT(hgt, 1)) + ' m.',
        ['With the origin below the top, the vertex is ' + t('(0,\\ ' + s.H + ')') + ' and the base ends are ' + t('(\\pm' + half + ',\\ 0)') + '.', 'Find ' + t('a') + ', then substitute the ' + t('x') + '-value of the point ' + t(s.D) + ' m from an end.'], 'arch problem', { after: 'm', bad: [s.H + a2 * s.D * s.D] });
    }
    var j = pickWhere(function () { return { y0: r.pick([0.5, 1, 1.2, 1.5, 2]), H: r.pick([2.5, 3, 3.2, 4, 4.5, 5]), d: r.pick([1, 1.5, 2, 2.5, 3]) }; }, function (o) { return o.H - o.y0 >= 1; });
    var aj = (j.y0 - j.H) / (j.d * j.d), land = j.d + Math.sqrt(j.H / -aj);
    return apxPart(cp, 'The jet of water from a fountain leaves a nozzle ' + t(dT(j.y0)) + ' m above the ground and reaches its greatest height, ' + t(dT(j.H)) + ' m, at a horizontal distance of ' + t(dT(j.d)) + ' m from the nozzle. Using the ground below the nozzle as the origin, how far from the nozzle (horizontally) does the water hit the ground? Give the answer to the nearest hundredth of a metre.', land, 2,
      function (v) { if (Math.abs(v - K.roundTo(2 * j.d, 2)) < 1e-9) return { code: cp + 'ctx-time', hint: 'The nozzle is above the ground, so the jet lands further than twice the distance to the top. Solve ' + t('y=0') + '.' }; if (Math.abs(v - K.roundTo(j.d - Math.sqrt(j.H / -aj), 2)) < 1e-9 || Math.abs(v + K.roundTo(j.d - Math.sqrt(j.H / -aj), 2)) < 1e-9) return { code: cp + 'neg-root', hint: 'That root is behind the nozzle, where there is no water.' }; return null; },
      'Vertex ' + t('(' + dT(j.d) + ',\\ ' + dT(j.H) + ')') + ', point ' + t('(0,\\ ' + dT(j.y0) + ')') + ': ' + t(dT(j.y0) + '=a(' + dT(j.d) + ')^{2}+' + dT(j.H)) + ', so ' + t('a=' + dT(Math.round(aj * 1e4) / 1e4)) + '.<br>' + t('0=a(x-' + dT(j.d) + ')^{2}+' + dT(j.H)) + ' gives ' + t('(x-' + dT(j.d) + ')^{2}=' + dT(Math.round(j.H / -aj * 1e4) / 1e4)) + ', ' + t('x\\approx ' + rT(land, 2)) + ' (reject the root behind the nozzle). The water lands about ' + t(rT(land, 2)) + ' m away.',
      ['The top of the jet is the vertex; the nozzle is the point ' + t('(0,\\ ' + dT(j.y0) + ')') + '. Find ' + t('a') + '.', 'Set ' + t('y=0') + ', solve with square roots and keep the root in front of the nozzle.'], 'fountain problem', { after: 'm', bad: [2 * j.d] });
  };

  /* ======================================================================================================
   * Lesson 6 (RF4): completing the square
   * ====================================================================================================== */
  /* mode 'monic' (x² + bx + c, b even), 'odd' (b odd), 'a' (a ≠ 1), 'neg' (a < 0), 'frac' (a a fraction) (L6 Ex 2–5, #2, #4–5) */
  B.cts = function (r, cp, opt) {
    opt = opt || {};
    var mode = opt.mode || r.pick(['a', 'neg', 'neg', 'frac', 'odd']), a, b, c, shown;
    var z = pickWhere(function () {
      var o = {};
      if (mode === 'monic') { o.a = 1; o.b = nz(r, 1, 9) * 2; o.c = nz(r, 1, 30); }
      else if (mode === 'odd') { o.a = 1; o.b = nz(r, 1, 6) * 2 + (r.chance(0.5) ? 1 : -1); o.c = nz(r, 1, 15); }
      else if (mode === 'a') { o.a = r.pick([2, 3, 4, 5]); o.b = o.a * nz(r, 1, 6) * (r.chance(0.75) ? 2 : 1); o.c = nz(r, 1, 30); }
      else if (mode === 'neg') { o.a = r.pick([-1, -2, -3, -5, -4]); o.b = o.a * nz(r, 1, 6) * 2; o.c = r.chance(0.25) ? 0 : nz(r, 1, 25); }
      else { o.a = r.pick([[1, 2], [-1, 2], [-1, 4], [1, 3], [1, 4]]); o.b = r.pick([2, 3, 4, -2, -3, -4]) * (R(o.a)[1] === 4 ? 1 : 1); o.c = nz(r, 1, 9); }
      return o;
    }, function (o) { var V3 = toVF(o.a, o.b, o.c); return rv(o.b) !== 0 && Math.abs(rv(V3[2])) <= 60 && (mode === 'odd' || mode === 'a' || isI(V3[1])) && R(V3[2])[1] <= 4 && !(mode === 'monic' && o.b === 6 && o.c === 1); });
    a = R(z.a); b = R(z.b); c = R(z.c);
    var V3 = toVF(a, b, c), pp = V3[1], q = V3[2], half = qd(b, qm(a, 2)), sq = qm(half, half), T = genP(a, b, c);
    shown = mode === 'neg' && r.chance(0.5) ? (rv(c) ? rt(c) + sT(b) + 'x' : rt(b) + 'x') + (rv(a) === -1 ? '-x^{2}' : sT(a) + 'x^{2}') : genT(a, b, c);
    var ws = [{ p: vfP(a, qm(pp, -1), q), code: cp + 'vf-psign', hint: 'Half of the ' + t('x') + '-coefficient (inside the bracket) is ' + t(rt(half)) + ', so the square is ' + t(binT(pp) + '^{2}') + '.' }, { p: vfP(a, pp, qa(c, qm(a, sq))), code: cp + 'cts-add', hint: 'You add ' + t(rt(sq)) + ' inside the bracket, so you must <b>subtract</b> it too (times ' + t('a') + ' when it leaves the bracket).' }];
    if (rv(a) !== 1) ws.push({ p: vfP(a, pp, qs(c, sq)), code: cp + 'cts-a', hint: 'The ' + t('-' + rt(sq)) + ' is inside the bracket: multiply it by ' + t(rt(a)) + ' when it comes out.' });
    var inner = rv(a) === 1 ? 'x^{2}' + sT(b) + 'x' : 'x^{2}' + sT(qd(b, a)) + 'x';
    var sol = (rv(a) === 1 ? t('y=(' + inner + '+' + rt(sq) + ')-' + rt(sq) + sT(c)) : t('y=' + (rv(a) === -1 ? '-' : rt(a)) + '(' + inner + ')' + sT(c)) + ', then ' + t('y=' + (rv(a) === -1 ? '-' : rt(a)) + '(' + inner + '+' + rt(sq) + '-' + rt(sq) + ')' + sT(c))) + '.<br>' +
      (rv(a) === 1 ? '' : t('y=' + (rv(a) === -1 ? '-' : rt(a)) + binT(pp) + '^{2}' + sT(qm(qm(a, sq), -1)) + sT(c)) + ' (the ' + t('-' + rt(sq)) + ' is multiplied by ' + t(rt(a)) + ' as it leaves the bracket).<br>') + t('y=' + vfT(a, pp, q)) + '.';
    return eqPart(cp, 'Write ' + t('y=' + shown) + ' in vertex form by completing the square.', T, { form: 'vertex', wrongs: ws }, sol,
      [rv(a) === 1 ? 'Add and subtract ' + t('\\left(\\frac{b}{2}\\right)^{2}') + ' right after the ' + t('x') + '-term.' : 'Factor ' + t(rt(a)) + ' out of the first two terms.', 'Inside the bracket add and subtract the square of half the ' + t('x') + '-coefficient; ' + (rv(a) === 1 ? 'combine the constants.' : 'multiply the subtracted number by ' + t(rt(a)) + ' as it leaves the bracket.')], 'completing the square');
  };
  /* a context maximum by completing the square (L6 #9–10, #19, L10 #3) */
  B.ctsCtx = function (r, cp) {
    var kind = r.pick(['rocket', 'pen', 'toss']), sol, ans, prompt, tv, after, a, b, c, dp = null, fn;
    if (kind === 'rocket') { a = -5; tv = r.int(1, 5); b = 10 * tv; c = r.int(1, 30); fn = 'h=-5t^{2}+' + b + 't+' + c; prompt = 'A model rocket’s height, in metres, ' + t('t') + ' seconds after launch is ' + t(fn) + '. Complete the square to find its maximum height.'; after = 'm'; }
    else if (kind === 'pen') { a = -2; tv = r.int(5, 20); b = 4 * tv; c = 0; fn = 'A=-2w^{2}+' + b + 'w'; prompt = 'A rectangular pen is fenced on three sides, with a barn wall as the fourth side. If each side perpendicular to the wall is ' + t('w') + ' metres, the area in square metres is ' + t(fn) + '. Complete the square to find the greatest possible area.'; after = 'm²'; }
    else { a = r.pick([-2, -4]); b = r.pick([5, 7, 9, 3]); c = r.int(1, 3); tv = -b / (2 * a); fn = 'h=' + a + 't^{2}+' + b + 't+' + c; prompt = 'A ball’s height, in metres, ' + t('t') + ' seconds after it is tossed is ' + t(fn) + '. Complete the square to find its maximum height, to the nearest hundredth of a metre.'; after = 'm'; dp = 2; }
    var V3 = toVF(a, b, c), mx = rv(V3[2]), wrongA = rv(qa(c, qm(qd(b, qm(a, 2)), qd(b, qm(a, 2)))));
    var vv = kind === 'pen' ? 'w' : 't';
    sol = t(fn.replace(/^[hA]=/, (kind === 'pen' ? 'A' : 'h') + '=') ) + '<br>' + t((kind === 'pen' ? 'A' : 'h') + '=' + a + '(' + vv + '^{2}' + sT(qd(b, a)) + vv + '+' + rt(qm(qd(b, qm(a, 2)), qd(b, qm(a, 2)))) + '-' + rt(qm(qd(b, qm(a, 2)), qd(b, qm(a, 2)))) + ')' + sT(c) + '=' + vfT(V3[0], V3[1], V3[2], vv)) + '.<br>The maximum is ' + t(rt(V3[2])) + (dp ? ' ' + t('\\approx ' + rT(mx, 2)) : '') + ' ' + after + ', when ' + t(vv + '=' + rt(V3[1])) + '.';
    var diag = function (v) { if (near(v, rv(V3[1]))) return { code: cp + 'ctx-time', hint: t(rt(V3[1])) + ' is <b>when</b> (or where) the maximum happens. The maximum value is ' + t('q') + '.' }; if (near(v, wrongA) || dp && Math.abs(v - K.roundTo(wrongA, 2)) < 1e-9) return { code: cp + 'cts-a', hint: 'Multiply the subtracted square by ' + t(a) + ' when it leaves the bracket.' }; if (near(v, c) && c) return { code: cp + 'ctx-c', hint: 'That is the starting value.' }; return null; };
    var hints = ['Factor ' + t(a) + ' out of the first two terms and complete the square inside.', 'In vertex form the maximum value is ' + t('q') + '.'];
    if (dp) return apxPart(cp, prompt, mx, 2, diag, sol, hints, 'maximum by completing the square', { after: after, bad: [rv(V3[1])] });
    return numPart(cp, prompt, V3[2], diag, sol, hints, 'maximum by completing the square', { after: after, bad: [V3[1]] });
  };
  /* MAS: a parameter from completing the square (L6 #13–14, EP06 #6, C1, C4) */
  B.ctsK = function (r, cp) {
    var kind = r.pick(['onx', 'maxk', 'm']);
    if (kind === 'onx') {
      var z = pickWhere(function () { return { a: r.pick([1, 2, 3, 4, 5, -2, -3]), h: nz(r, 1, 5) }; }, function (o) { return Math.abs(o.a * o.h * 2) <= 30; });
      var b = -2 * z.a * z.h, k = z.a * z.h * z.h;
      return numPart(cp, 'Write ' + t('y=' + cT(z.a) + 'x^{2}' + sT(b) + 'x+k') + ' in vertex form, in terms of ' + t('k') + '. For what value of ' + t('k') + ' is the vertex on the ' + t('x') + '-axis?', k,
        function (v) { if (near(v, z.h * z.h) && z.a !== 1) return { code: cp + 'cts-a', hint: 'Multiply the subtracted square ' + t(z.h * z.h) + ' by ' + t(z.a) + ' when it leaves the bracket.' }; if (near(v, -k)) return { code: cp + 'q-sign', hint: 'The vertex is ' + t('(' + z.h + ',\\ k' + sT(-k) + ')') + ': it is on the axis when ' + t('k' + sT(-k) + '=0') + '.' }; return null; },
        t('y=' + (z.a === 1 ? '' : z.a === -1 ? '-' : z.a) + '(x^{2}' + sT(-2 * z.h) + 'x+' + z.h * z.h + '-' + z.h * z.h + ')+k=' + cT(z.a) + binT(z.h) + '^{2}+k' + sT(-k)) + '.<br>The vertex ' + t('(' + z.h + ',\\ k' + sT(-k) + ')') + ' is on the ' + t('x') + '-axis when ' + t('k' + sT(-k) + '=0') + ': ' + t('k=' + k) + '.',
        ['Complete the square with ' + t('k') + ' as the constant: the vertex is ' + t('(p,\\ q)') + ' with ' + t('q') + ' in terms of ' + t('k') + '.', 'On the ' + t('x') + '-axis means ' + t('q=0') + '.'], 'parameter from completing the square', { bad: [-k, z.h * z.h] });
    }
    if (kind === 'maxk') {
      var w = pickWhere(function () { return { a: r.pick([-1, -2, -3, 1, 2]), h: nz(r, 1, 5), M: nz(r, 1, 30) }; }, function (o) { return Math.abs(2 * o.a * o.h) <= 24; });
      var b2 = -2 * w.a * w.h, k2 = w.M + w.a * w.h * w.h, up = w.a > 0;
      return numPart(cp, 'The function ' + t('y=' + cT(w.a) + 'x^{2}' + sT(b2) + 'x+k') + ' has a ' + (up ? 'minimum' : 'maximum') + ' value of ' + t(w.M) + '. Determine ' + t('k') + '.', k2,
        function (v) { if (near(v, w.M - w.a * w.h * w.h)) return { code: cp + 'q-sign', hint: 'In vertex form ' + t('q=k' + sT(-w.a * w.h * w.h)) + '; set it equal to ' + t(w.M) + '.' }; if (w.a !== 1 && w.a !== -1 && near(v, w.M + w.h * w.h * (w.a < 0 ? 1 : -1))) return { code: cp + 'cts-a', hint: 'Multiply the subtracted square by ' + t(w.a) + ' when it leaves the bracket.' }; return null; },
        t('y=' + cT(w.a) + binT(w.h) + '^{2}+k' + sT(-w.a * w.h * w.h)) + '. The ' + (up ? 'minimum' : 'maximum') + ' value is ' + t('k' + sT(-w.a * w.h * w.h) + '=' + w.M) + ', so ' + t('k=' + k2) + '.',
        ['Complete the square with ' + t('k') + ' as the constant.', 'The maximum or minimum value is ' + t('q') + ' in vertex form.'], 'parameter from the maximum', { bad: [w.M - w.a * w.h * w.h] });
    }
    var n = r.pick([4, 9, 16, 25, 3, 5, 7, 2, 6]), mS = isSq(n) ? [Math.sqrt(n), -Math.sqrt(n)] : [Math.sqrt(n), -Math.sqrt(n)];
    return rootsPart(cp, 'Write ' + t('y=x^{2}+2mx+' + n) + ' in vertex form in terms of ' + t('m') + '. For which values of ' + t('m') + ' is the vertex on the ' + t('x') + '-axis?', mS,
      { v: 'm', exact: true, keyTex: isSq(n) ? 'm=\\pm ' + Math.sqrt(n) : 'm=\\pm\\sqrt{' + n + '}', missHint: 'A square root has two signs.', wrongs: [{ vals: [n / 2, -n / 2], code: cp + 'cts-a', hint: 'Half of ' + t('2m') + ' is ' + t('m') + ', so the square is ' + t('(x+m)^{2}') + ' and the constant left is ' + t(n + '-m^{2}') + '.' }] },
      t('y=(x^{2}+2mx+m^{2})-m^{2}+' + n + '=(x+m)^{2}+' + n + '-m^{2}') + '.<br>The vertex ' + t('(-m,\\ ' + n + '-m^{2})') + ' is on the ' + t('x') + '-axis when ' + t(n + '-m^{2}=0') + ': ' + t('m=\\pm' + (isSq(n) ? Math.sqrt(n) : '\\sqrt{' + n + '}')) + '.',
      ['Half of the ' + t('x') + '-coefficient ' + t('2m') + ' is ' + t('m') + ': add and subtract ' + t('m^{2}') + '.', 'The vertex is on the ' + t('x') + '-axis when ' + t('q=0') + '.'], 'parameter in completing the square');
  };

  /* ======================================================================================================
   * Lesson 7 (RF5): the quadratic formula
   * ====================================================================================================== */
  function qfSpec(r, opt) {
    opt = opt || {};
    return pickWhere(function () { return { a: r.int(1, opt.amax || 5), b: nz(r, 0, 10), c: nz(r, 1, 12) }; }, function (o) { var D = o.b * o.b - 4 * o.a * o.c; return D > 0 && !isSq(D) && D <= 240 && !(o.a === 1 && o.b === 2 && o.c === -1) && (o.a > 1 || o.b % 2 !== 0 || r.chance(0.5)); });
  }
  function qfRootsT(a, b, c) { return surdRoots(-b, 1, b * b - 4 * a * c, 2 * a); }
  function qfWrongs(cp, a, b, c) {
    var D = b * b - 4 * a * c, w = [], s = Math.sqrt(D);
    if (b) w.push({ vals: [(b + s) / (2 * a), (b - s) / (2 * a)], code: cp + 'qf-negb', hint: 'The formula starts with ' + t('-b') + ': here ' + t('-b=' + (-b)) + '.' });
    w.push({ vals: [(-b + s) / a, (-b - s) / a], code: cp + 'qf-2a', hint: 'Divide by ' + t('2a=' + 2 * a) + ', not by ' + t('a') + '.' });
    var D2 = b * b + 4 * a * c; if (D2 > 0 && D2 !== D) w.push({ vals: [(-b + Math.sqrt(D2)) / (2 * a), (-b - Math.sqrt(D2)) / (2 * a)], code: cp + 'qf-disc', hint: 'Check the discriminant: ' + t('b^{2}-4ac=' + par(b) + '^{2}-4(' + a + ')(' + c + ')=' + D) + '.' });
    return w;
  }
  function qfSol(a, b, c, pre) {
    var D = b * b - 4 * a * c, sr = qfRootsT(a, b, c), sp = sqrtSplit(D);
    return (pre || '') + t('a=' + a + ',\\ b=' + b + ',\\ c=' + c) + ': ' + t('x=\\frac{' + (-b) + '\\pm\\sqrt{' + par(b) + '^{2}-4(' + a + ')(' + c + ')}}{2(' + a + ')}=\\frac{' + (-b) + '\\pm\\sqrt{' + D + '}}{' + 2 * a + '}') +
      (sp[0] > 1 ? ' and ' + t('\\sqrt{' + D + '}=' + sp[0] + '\\sqrt{' + sp[1] + '}') : '') + '.<br>' + t('x=' + sr.tex) + '.';
  }
  B.qf = function (r, cp) {
    var z = qfSpec(r), sr = qfRootsT(z.a, z.b, z.c);
    return rootsPart(cp, 'Solve ' + t(genT(z.a, z.b, z.c) + '=0') + ' with the quadratic formula. Give exact roots in simplest form.', sr.vals, { exact: true, keyTex: 'x=' + sr.tex, wrongs: qfWrongs(cp, z.a, z.b, z.c) }, qfSol(z.a, z.b, z.c),
      ['Use ' + t('x=\\frac{-b\\pm\\sqrt{b^{2}-4ac}}{2a}') + ' with ' + t('a=' + z.a) + ', ' + t('b=' + z.b) + ', ' + t('c=' + z.c) + '.', 'Simplify the radical, then divide every term by the common factor.'], 'quadratic formula');
  };
  /* standard form first, then the formula (L7 Ex 4, #9, EP07 B1) */
  B.qfStd = function (r, cp) {
    var kind = r.pick(['xx', 'sq', 'recip', 'frac', 'gcf']), z, eq, pre;
    if (kind === 'xx') { z = pickWhere(function () { return { m: nz(r, 1, 6), n: nz(r, 1, 6), k: nz(r, 1, 9) }; }, function (o) { var b = -(o.m + o.n), D = b * b - 4 * o.k; return o.m + o.n !== 0 && D > 0 && !isSq(D) && D <= 200; }); eq = 'x(x' + sT(-z.m) + ')=' + (z.n === 1 ? '' : z.n === -1 ? '-' : z.n) + 'x' + sT(-z.k); z = { a: 1, b: -(z.m + z.n), c: z.k }; }
    else if (kind === 'sq') { var s = pickWhere(function () { return { h: nz(r, 1, 5), b: nz(r, 1, 6), c: nz(r, 1, 12) }; }, function (o) { var B1 = 2 * o.h - o.b, C1 = o.h * o.h - o.c, D = B1 * B1 - 4 * C1; return B1 !== 0 && D > 0 && !isSq(D) && D <= 200; }); eq = '(x' + sT(s.h) + ')^{2}=' + (s.b === 1 ? '' : s.b === -1 ? '-' : s.b) + 'x' + sT(s.c); z = { a: 1, b: 2 * s.h - s.b, c: s.h * s.h - s.c }; }
    else if (kind === 'recip') { var w = pickWhere(function () { return { m: nz(r, 1, 6), k: r.int(1, 9) }; }, function (o) { var D = o.m * o.m + 4 * o.k; return !isSq(D); }); eq = 'x-\\frac{' + w.k + '}{x}=' + w.m + ',\\ x\\ne 0'; z = { a: 1, b: -w.m, c: -w.k }; }
    else if (kind === 'frac') { var f = pickWhere(function () { return { d1: r.pick([2, 3, 4]), d2: r.pick([2, 3, 4, 6]), s: r.pick([1, -1]) }; }, function (o) { if (o.d1 === o.d2) return false; var L = o.d1 * o.d2 / gcd(o.d1, o.d2), a = L / o.d1, b = o.s * L / o.d2, c = -L, D = b * b - 4 * a * c; return !isSq(D); }); var L = f.d1 * f.d2 / gcd(f.d1, f.d2); eq = '\\frac{x^{2}}{' + f.d1 + '}' + (f.s > 0 ? '+' : '-') + '\\frac{x}{' + f.d2 + '}-1=0'; z = { a: L / f.d1, b: f.s * L / f.d2, c: -L }; pre = 'Multiply by ' + t(L) + ': ' + t(genT(L / f.d1, f.s * L / f.d2, -L) + '=0') + '.<br>'; }
    else { var g = pickWhere(function () { return { k: r.pick([2, 3, 4, 5]), a: r.int(1, 4), b: nz(r, 1, 8), c: nz(r, 1, 9) }; }, function (o) { var D = o.b * o.b - 4 * o.a * o.c; return D > 0 && !isSq(D) && D <= 160 && gcd(gcd(o.a, o.b), o.c) === 1; }); eq = genT(g.k * g.a, g.k * g.b, 0) + '=' + (-g.k * g.c); z = { a: g.a, b: g.b, c: g.c }; pre = 'Standard form: ' + t(genT(g.k * g.a, g.k * g.b, g.k * g.c) + '=0') + '; divide by ' + t(g.k) + ': ' + t(genT(g.a, g.b, g.c) + '=0') + '.<br>'; }
    if (!pre) pre = 'Standard form: ' + t(genT(z.a, z.b, z.c) + '=0') + '.<br>';
    var sr = qfRootsT(z.a, z.b, z.c);
    return rootsPart(cp, 'Write ' + t(eq) + ' in standard form, then solve. Give exact roots in simplest form.', sr.vals, { exact: true, keyTex: 'x=' + sr.tex, wrongs: qfWrongs(cp, z.a, z.b, z.c) }, qfSol(z.a, z.b, z.c, pre),
      ['Expand, clear fractions and move every term to one side: ' + t('ax^{2}+bx+c=0') + '.', 'Then use the quadratic formula and simplify.'], 'standard form, then the quadratic formula');
  };
  /* roots to the nearest hundredth / tenth (L7 Ex 3, #5, L11 #9c) */
  B.qfRound = function (r, cp) {
    var kind = r.pick(['plain', 'move', 'dec']), dp = r.chance(0.6) ? 2 : 1, a, b, c, eq, pre = '';
    if (kind === 'dec') { var d = pickWhere(function () { return { a: r.pick([0.5, 0.2, 1.5, 2.5]), b: nz(r, 1, 30) / 10, c: nz(r, 1, 40) / 10 }; }, function (o) { var D = o.b * o.b - 4 * o.a * o.c; return D > 0.5; }); a = d.a; b = d.b; c = d.c; eq = dT(a) + 'x^{2}' + dS(b) + 'x' + dS(c) + '=0'; }
    else { var z = qfSpec(r, { amax: 6 }); a = z.a; b = z.b; c = z.c; eq = kind === 'move' ? genT(a, 0, 0) + '=' + genT(0, -b, -c).replace(/^\+/, '') : genT(a, b, c) + '=0'; if (kind === 'move') pre = 'Standard form: ' + t(genT(a, b, c) + '=0') + '.<br>'; if (!b) { b = 1; eq = genT(a, b, c) + '=0'; pre = ''; } }
    var D = b * b - 4 * a * c, s = Math.sqrt(D), x1 = (-b + s) / (2 * a), x2 = (-b - s) / (2 * a), w = [];
    w.push({ vals: [(b + s) / (2 * a), (b - s) / (2 * a)], code: cp + 'qf-negb', hint: 'The formula starts with ' + t('-b') + '.' });
    w.push({ vals: [(-b + s) / a, (-b - s) / a], code: cp + 'qf-2a', hint: 'Divide by ' + t('2a') + ', not by ' + t('a') + '.' });
    var place = dp === 2 ? 'hundredth' : 'tenth';
    return rootsPart(cp, 'Solve ' + t(eq) + ' with the quadratic formula. Give the roots to the nearest ' + place + '.', [x1, x2], { dp: dp, wrongs: w }, pre + t('x=\\frac{' + dT(-b) + '\\pm\\sqrt{' + dT(Math.round(D * 1e6) / 1e6) + '}}{' + dT(2 * a) + '}') + ', so ' + t('x\\approx ' + rT(x1, dp)) + ' or ' + t('x\\approx ' + rT(x2, dp)) + '.',
      ['Write the equation as ' + t('ax^{2}+bx+c=0') + ' and read ' + t('a') + ', ' + t('b') + ', ' + t('c') + ' with their signs.', 'Use the formula, then round each root at the end.'], 'quadratic formula, rounded');
  };
  /* MAS: a problem solved with the formula and rounded (L7 #11–13, L11 #15, EP07 B3–B4) */
  B.qfWord = function (r, cp) {
    var kind = r.pick(['tri', 'run', 'ball', 'diag']);
    if (kind === 'tri' || kind === 'diag') {
      var z = pickWhere(function () { return { d: r.int(1, 7), h: r.int(8, 20) }; }, function (o) { var D = 2 * o.h * o.h - o.d * o.d; return D > 0 && !isSq(D) && o.h > o.d + 2; });
      var D = 2 * z.h * z.h - z.d * z.d, x = (-z.d + Math.sqrt(D)) / 2, neg = (-z.d - Math.sqrt(D)) / 2;
      var prompt = kind === 'tri' ? 'The legs of a right triangle differ by ' + t(z.d) + ' cm and the hypotenuse is ' + t(z.h) + ' cm. Determine the length of the shorter leg, to the nearest hundredth of a centimetre.' : 'The length of a rectangle is ' + t(z.d) + ' cm more than its width, and its diagonal is ' + t(z.h) + ' cm. Determine the width, to the nearest hundredth of a centimetre.';
      return apxPart(cp, prompt, x, 2, function (v) { if (Math.abs(v - K.roundTo(x + z.d, 2)) < 1e-9) return { code: cp + 'gave-other', hint: 'That is the longer ' + (kind === 'tri' ? 'leg' : 'side') + '. The question asks for the ' + (kind === 'tri' ? 'shorter leg' : 'width') + '.' }; if (Math.abs(v - K.roundTo(neg, 2)) < 1e-9 || Math.abs(v + K.roundTo(neg, 2)) < 1e-9) return { code: cp + 'neg-root', hint: 'A length is positive: use the other root.' }; return null; },
        'Let the ' + (kind === 'tri' ? 'shorter leg' : 'width') + ' be ' + t('x') + ': ' + t('x^{2}+(x+' + z.d + ')^{2}=' + z.h * z.h) + ', so ' + t('2x^{2}+' + 2 * z.d + 'x' + sT(z.d * z.d - z.h * z.h) + '=0') + '.<br>' + t('x=\\frac{-' + 2 * z.d + '\\pm\\sqrt{' + 4 * z.d * z.d + '-8(' + (z.d * z.d - z.h * z.h) + ')}}{4}') + ' ' + t('\\approx ' + rT(x, 2)) + ' (reject the negative root). The ' + (kind === 'tri' ? 'shorter leg' : 'width') + ' is about ' + t(rT(x, 2)) + ' cm.',
        ['Let the shorter length be ' + t('x') + '; the other is ' + t('x+' + z.d) + '. Use the Pythagorean theorem.', 'Write the equation in standard form, use the quadratic formula, and reject the negative root.'], 'right-triangle problem', { after: 'cm', bad: [x + z.d] });
    }
    if (kind === 'run') {
      var w = pickWhere(function () { return { S: r.int(10, 24), A: r.int(20, 120) }; }, function (o) { var D = o.S * o.S - 4 * o.A; return D > 0 && !isSq(D); });
      var Dw = w.S * w.S - 4 * w.A, L = (w.S + Math.sqrt(Dw)) / 2, Wd = (w.S - Math.sqrt(Dw)) / 2;
      return apxPart(cp, 'A rectangular dog run is enclosed by ' + t(2 * w.S) + ' m of fencing and has an area of ' + t(w.A) + ' m². Determine its length (the longer side), to the nearest tenth of a metre.', L, 1,
        function (v) { if (Math.abs(v - K.roundTo(Wd, 1)) < 1e-9) return { code: cp + 'gave-other', hint: 'That is the shorter side. The question asks for the length.' }; return null; },
        'Let the width be ' + t('x') + '; the length is ' + t(w.S + '-x') + ' (half the perimeter minus the width).<br>' + t('x(' + w.S + '-x)=' + w.A) + ', so ' + t('x^{2}-' + w.S + 'x+' + w.A + '=0') + ' and ' + t('x=\\frac{' + w.S + '\\pm\\sqrt{' + Dw + '}}{2}') + '.<br>The two roots are the two sides: about ' + t(rT(L, 1)) + ' m by ' + t(rT(Wd, 1)) + ' m. The length is ' + t(rT(L, 1)) + ' m.',
        ['Half the perimeter is the length plus the width.', 'Write the area equation, use the quadratic formula; the two roots are the two sides.'], 'perimeter and area problem', { after: 'm', bad: [Wd] });
    }
    var b = pickWhere(function () { return { v: r.int(8, 25), h0: r.pick([0.5, 1, 1.5, 2, 2.5]) }; }, function () { return true; });
    var a = -4.9, Db = b.v * b.v - 4 * a * b.h0, tl = (-b.v - Math.sqrt(Db)) / (2 * a), tn = (-b.v + Math.sqrt(Db)) / (2 * a);
    return apxPart(cp, 'A ball is kicked from a height of ' + t(dT(b.h0)) + ' m. Its height after ' + t('t') + ' seconds is ' + t('h=-4.9t^{2}+' + b.v + 't+' + dT(b.h0)) + ' metres. When does the ball land? Give the answer to the nearest tenth of a second.', tl, 1,
      function (v) { if (Math.abs(v - K.roundTo(b.v / 9.8, 1)) < 1e-9) return { code: cp + 'ctx-time', hint: 'That is when the ball is highest. It lands when ' + t('h=0') + '.' }; if (Math.abs(v - K.roundTo(tn, 1)) < 1e-9 || Math.abs(v + K.roundTo(tn, 1)) < 1e-9) return { code: cp + 'neg-root', hint: 'Time is not negative: use the other root.' }; return null; },
      'The ball lands when ' + t('h=0') + ': ' + t('-4.9t^{2}+' + b.v + 't+' + dT(b.h0) + '=0') + '.<br>' + t('t=\\frac{-' + b.v + '\\pm\\sqrt{' + b.v * b.v + '+' + dT(Math.round(4 * 4.9 * b.h0 * 1e4) / 1e4) + '}}{-9.8}') + ', so ' + t('t\\approx ' + rT(tl, 1)) + ' or ' + t('t\\approx ' + rT(tn, 2)) + ' (reject). It lands after about ' + t(rT(tl, 1)) + ' s.',
      ['The ball lands when the height is ' + t(0) + '.', 'Use the quadratic formula and reject the negative time.'], 'landing time', { after: 's', bad: [b.v / 9.8] });
  };

  /* ======================================================================================================
   * Lesson 8 (RF5): the discriminant
   * ====================================================================================================== */
  function discSpec(r, sign, opt) {
    opt = opt || {};
    return pickWhere(function () { return { a: nz(r, 1, 6), b: nz(r, 0, 12), c: nz(r, 1, 12) }; }, function (o) { var D = o.b * o.b - 4 * o.a * o.c; return (sign > 0 ? D > 0 : sign < 0 ? D < 0 : D === 0) && (sign !== 0 || o.b !== 0) && (opt.posA ? o.a > 0 : true) && Math.abs(D) <= 300; });
  }
  function eqForm(r, a, b, c, rearr) {
    if (!rearr) return { eq: genT(a, b, c) + '=0', pre: '' };
    var k = r.pick(['move', 'rev', 'mul']);
    if (k === 'mul' && a % 2 === 0 && b % 2 === 0) return { eq: '2x(' + tx(lin(a / 2, b / 2)) + ')=' + (-c), pre: 'Standard form: ' + t(genT(a, b, c) + '=0') + '.<br>' };
    if (k === 'rev' && b) return { eq: c + (a > 0 ? '+' : '') + genT(a, 0, 0) + '=' + genT(0, -b, 0), pre: 'Standard form: ' + t(genT(a, b, c) + '=0') + '.<br>' };
    return { eq: genT(a, 0, c) + '=' + genT(0, -b, 0).replace(/^\+/, ''), pre: 'Standard form: ' + t(genT(a, b, c) + '=0') + '.<br>' };
  }
  B.disc = function (r, cp, opt) {
    opt = opt || {};
    var z = discSpec(r, r.pick([1, 1, -1, 0])), e = eqForm(r, z.a, z.b, z.c, opt.rearr != null ? opt.rearr : r.chance(0.35)), D = z.b * z.b - 4 * z.a * z.c, W = z.b * z.b + 4 * z.a * z.c;
    if (/=0$/.test(e.eq) && !e.pre) e.pre = '';
    var p = KP.number('Determine the value of the discriminant of ' + t(e.eq) + '.', D, function (v) { if (v === W && W !== D) return { code: cp + 'disc-sign', hint: 'Check the sign of ' + t('-4ac=-4(' + z.a + ')(' + z.c + ')=' + (-4 * z.a * z.c)) + '.' }; if (v === -z.b * z.b - 4 * z.a * z.c) return { code: cp + 'disc-sign', hint: 'A square is never negative: ' + t(par(z.b) + '^{2}=' + z.b * z.b) + '.' }; if (v === z.b * z.b - z.a * z.c) return { code: cp + 'disc-4', hint: 'The discriminant is ' + t('b^{2}-4ac') + '.' }; return null; },
      e.pre + t('b^{2}-4ac=' + par(z.b) + '^{2}-4(' + z.a + ')(' + z.c + ')=' + z.b * z.b + sT(-4 * z.a * z.c) + '=' + D) + '.', [(e.pre ? 'Write the equation in standard form first. ' : '') + 'Read ' + t('a') + ', ' + t('b') + ' and ' + t('c') + ' with their signs.', 'The discriminant is ' + t('b^{2}-4ac') + '.'], 'the discriminant');
    p.bad = [String(W), String(z.b * z.b - z.a * z.c)].filter(function (b) { return b !== String(D); });
    return p;
  };
  B.nature = function (r, cp, opt) {
    opt = opt || {};
    var sign = r.pick([1, -1, 0]), z = discSpec(r, sign), e = eqForm(r, z.a, z.b, z.c, opt.rearr != null ? opt.rearr : r.chance(0.5)), D = z.b * z.b - 4 * z.a * z.c;
    var opts = [{ html: 'two distinct real roots', right: sign > 0, why: 'For two distinct real roots the discriminant must be positive.', code: cp + 'k-dir' }, { html: 'two equal real roots (one real root)', right: sign === 0, why: 'Equal roots need a discriminant of exactly ' + t(0) + '.', code: cp + 'k-dir' }, { html: 'no real roots', right: sign < 0, why: 'No real roots needs a negative discriminant.', code: cp + 'k-dir' }];
    opts.forEach(function (o) { if (o.right) { delete o.why; delete o.code; } });
    return mcPart(r, 'Without solving, determine the nature of the roots of ' + t(e.eq) + '.', opts, e.pre + t('b^{2}-4ac=' + par(z.b) + '^{2}-4(' + z.a + ')(' + z.c + ')=' + D) + (D > 0 ? '>0' : D < 0 ? '<0' : '') + ': ' + (sign > 0 ? 'two distinct real roots.' : sign < 0 ? 'no real roots.' : 'two equal real roots.'),
      ['Write the equation in standard form and find ' + t('b^{2}-4ac') + '.', 'Positive: two distinct real roots; zero: two equal real roots; negative: no real roots.'], 'nature of the roots', true);
  };
  /* the values of k for two distinct / equal / no / real roots (L8 Ex 4, #5–6, #8) */
  B.kRange = function (r, cp) {
    var kind = r.pick(['c', 'c', 'cneg', 'c2']), ask = r.pick(['two', 'none', 'real']), a, b, m, eq, D, Dt;
    var z = pickWhere(function () { return { a: r.pick(kind === 'cneg' ? [-1, -2, -3] : [1, 2, 3, 4]), b: nz(r, 1, 12), m: kind === 'c2' ? r.pick([2, 3]) : 1 }; }, function (o) { return o.b % 2 === 0 || r.chance(0.3); });
    a = z.a; b = z.b; m = z.m;
    eq = genT(a, b, 0) + '+' + (m === 1 ? '' : m) + 'k=0';
    var bound = qd(b * b, 4 * a * m), coef = -4 * a * m; // D = b² + coef·k
    var op = ask === 'two' ? (coef < 0 ? '<' : '>') : ask === 'none' ? (coef < 0 ? '>' : '<') : (coef < 0 ? '\\le ' : '\\ge ');
    var opFlip = { '<': '>', '>': '<', '\\le ': '\\ge ', '\\ge ': '\\le ' }[op], opStrict = { '<': '\\le ', '>': '\\ge ', '\\le ': '<', '\\ge ': '>' }[op];
    var ws = [{ is: setT('k', opFlip, bound), code: cp + 'k-dir', hint: 'Check the direction: ' + (coef < 0 ? 'dividing by a negative number reverses the inequality.' : 'solve the inequality for ' + t('k') + ' carefully.') }, { is: setT('k', opStrict, bound), code: cp + 'k-strict', hint: ask === 'real' ? '“Real roots” includes equal roots: ' + t('b^{2}-4ac\\ge 0') + '.' : 'Equal roots happen when the discriminant is exactly ' + t(0) + ': leave that value out.' }];
    var bw = qd(b * b, a * m); if (!near(rv(bw), rv(bound))) ws.push({ is: setT('k', op, bw), code: cp + 'disc-4', hint: 'The discriminant is ' + t('b^{2}-4ac') + ' — the 4 matters.' });
    var ineq = ask === 'two' ? '>0' : ask === 'none' ? '<0' : '\\ge 0';
    return setPart(cp, 'For what values of ' + t('k') + ' does ' + t(eq) + ' have ' + (ask === 'two' ? 'two distinct real roots' : ask === 'none' ? 'no real roots' : 'real roots') + '?', setT('k', op, bound), ws,
      t('b^{2}-4ac=' + par(b) + '^{2}-4(' + a + ')(' + (m === 1 ? 'k' : m + 'k') + ')=' + b * b + (coef < 0 ? '-' : '+') + Math.abs(coef) + 'k') + '.<br>' + (ask === 'two' ? 'Two distinct real roots' : ask === 'none' ? 'No real roots' : 'Real roots') + ': ' + t(b * b + (coef < 0 ? '-' : '+') + Math.abs(coef) + 'k' + ineq) + ', so ' + t('k' + op + rt(bound)) + '.',
      ['Write the discriminant in terms of ' + t('k') + '.', (ask === 'two' ? 'Two distinct real roots: ' + t('b^{2}-4ac>0') : ask === 'none' ? 'No real roots: ' + t('b^{2}-4ac<0') : 'Real roots: ' + t('b^{2}-4ac\\ge 0')) + '. Solve for ' + t('k') + '.'], 'values of k', 'k');
  };
  B.kEqual = function (r, cp) {
    var kind = r.pick(['b', 'b', 'lead']);
    if (kind === 'b') {
      var z = pickWhere(function () { return { a: r.pick([1, 4, 9, 16, 25]), c: r.pick([1, 4, 9, 16, 25, 36, 49]) }; }, function (o) { return !(o.a === 1 && o.c === 25) && !(o.a === 4 && o.c === 1); });
      var K2 = 2 * Math.sqrt(z.a * z.c), ra = Math.sqrt(z.a), rc = Math.sqrt(z.c);
      return rootsPart(cp, 'The equation ' + t(cT(z.a) + 'x^{2}+kx+' + z.c + '=0') + ' has two equal real roots. Determine every possible value of ' + t('k') + '.', [K2, -K2],
        { v: 'k', keyTex: 'k=\\pm ' + K2, missHint: 'Solving ' + t('k^{2}=' + K2 * K2) + ' gives two values.', wrongs: [{ vals: [Math.sqrt(z.a * z.c) * 1, -Math.sqrt(z.a * z.c)], code: cp + 'disc-4', hint: 'Use ' + t('b^{2}-4ac=0') + ': ' + t('k^{2}-4(' + z.a + ')(' + z.c + ')=0') + '.' }] },
        'Equal roots: ' + t('b^{2}-4ac=0') + ', so ' + t('k^{2}-4(' + z.a + ')(' + z.c + ')=0') + ', ' + t('k^{2}=' + K2 * K2) + ' and ' + t('k=\\pm ' + K2) + '.<br>(' + t('k=' + K2) + ' gives ' + t('(' + (ra === 1 ? '' : ra) + 'x+' + rc + ')^{2}') + '; ' + t('k=-' + K2) + ' gives ' + t('(' + (ra === 1 ? '' : ra) + 'x-' + rc + ')^{2}') + '.)',
        ['Equal roots means the discriminant is ' + t(0) + '.', 'Solve ' + t('b^{2}-4ac=0') + ' for ' + t('k') + ': a square root has two signs.'], 'k for equal roots');
    }
    var w = pickWhere(function () { return { b: nz(r, 2, 12), c: r.int(1, 9) }; }, function (o) { var k = o.b * o.b / (4 * o.c); return Number.isInteger(k) && k > 0 && k <= 40 && !(o.b === -12 && o.c === 4); });
    var kv = w.b * w.b / (4 * w.c);
    return rootsPart(cp, 'The equation ' + t('kx^{2}' + sT(w.b) + 'x+' + w.c + '=0') + ' has two equal real roots. Determine ' + t('k') + '.', [kv],
      { v: 'k', keyTex: 'k=' + kv, wrongs: [{ vals: [w.b * w.b / w.c], code: cp + 'disc-4', hint: 'The discriminant is ' + t('b^{2}-4ac') + ': ' + t(w.b * w.b + '-' + 4 * w.c + 'k=0') + '.' }, { vals: [-kv], code: cp + 'disc-sign', hint: 'Check the sign: ' + t(w.b * w.b + '-' + 4 * w.c + 'k=0') + '.' }] },
      'Equal roots: ' + t(par(w.b) + '^{2}-4(k)(' + w.c + ')=0') + ', so ' + t(w.b * w.b + '=' + 4 * w.c + 'k') + ' and ' + t('k=' + kv) + '.', ['Equal roots means ' + t('b^{2}-4ac=0') + '.', 'Here ' + t('a=k') + ': solve for ' + t('k') + '.'], 'k for equal roots');
  };
  /* MAS: a parameter in the leading coefficient; the greatest integer k (L8 #8–9, #18, EP08 C2) */
  B.discMas = function (r, cp) {
    var kind = r.pick(['lead', 'kreal', 'gint']);
    if (kind === 'lead') {
      var z = pickWhere(function () { return { p: nz(r, 1, 5), b: nz(r, 2, 8), c: r.int(1, 5) }; }, function (o) { return (o.b * o.b) % (4 * o.c) === 0 || r.chance(0.3); });
      var bound = qa(z.p, qd(z.b * z.b, 4 * z.c));
      return setPart(cp, 'For what values of ' + t('m') + ' does ' + t('(m' + sT(-z.p) + ')x^{2}' + sT(z.b) + 'x+' + z.c + '=0') + ' have no real roots?', setT('m', '>', bound),
        [{ is: setT('m', '<', bound), code: cp + 'k-dir', hint: 'Solve ' + t(z.b * z.b + '-' + 4 * z.c + '(m' + sT(-z.p) + ')<0') + ' carefully: dividing by a negative reverses the inequality.' }, { is: setT('m', '\\ge ', bound), code: cp + 'k-strict', hint: 'At the boundary the roots are equal (real). Leave it out.' }, { is: setT('m', '>', qd(z.b * z.b, 4 * z.c)), code: cp + 'disc-std', hint: 'Here ' + t('a=m' + sT(-z.p)) + ', not ' + t('m') + '.' }],
        t('a=m' + sT(-z.p) + ',\\ b=' + z.b + ',\\ c=' + z.c) + ': ' + t('b^{2}-4ac=' + z.b * z.b + '-' + 4 * z.c + '(m' + sT(-z.p) + ')=' + (z.b * z.b + 4 * z.c * z.p) + '-' + 4 * z.c + 'm') + '.<br>No real roots: ' + t((z.b * z.b + 4 * z.c * z.p) + '-' + 4 * z.c + 'm<0') + ', so ' + t('m>' + rt(bound)) + '. (These values never make ' + t('m' + sT(-z.p) + '=0') + '.)',
        ['Here ' + t('a=m' + sT(-z.p)) + '. Write the discriminant in terms of ' + t('m') + '.', 'No real roots: ' + t('b^{2}-4ac<0') + '.'], 'parameter in the leading coefficient', 'm');
    }
    if (kind === 'kreal') {
      var w = pickWhere(function () { return { b: nz(r, 2, 10), c: r.int(1, 6) }; }, function (o) { return (o.b * o.b) % (4 * o.c) === 0 && o.b * o.b / (4 * o.c) > 0; });
      var bd = w.b * w.b / (4 * w.c), tgt = '\\{k\\mid k\\le ' + bd + ',\\ k\\ne 0,\\ k\\in\\mathbb{R}\\}';
      return setPart(cp, 'For what values of ' + t('k') + ' does ' + t('kx^{2}' + sT(w.b) + 'x+' + w.c + '=0') + ' have real roots, as a quadratic equation?', tgt,
        [{ is: setT('k', '\\le ', bd), code: cp + 'k-zero', hint: 'If ' + t('k=0') + ' the equation is not quadratic: leave ' + t(0) + ' out (' + t('k\\ne 0') + ').' }, { is: '\\{k\\mid k<' + bd + ',\\ k\\ne 0,\\ k\\in\\mathbb{R}\\}', code: cp + 'k-strict', hint: 'Real roots include equal roots: ' + t('b^{2}-4ac\\ge 0') + '.' }, { is: '\\{k\\mid k\\ge ' + bd + ',\\ k\\in\\mathbb{R}\\}', code: cp + 'k-dir', hint: 'Solve ' + t(w.b * w.b + '-' + 4 * w.c + 'k\\ge 0') + ' carefully: dividing by a negative reverses the inequality.' }],
        t('b^{2}-4ac=' + w.b * w.b + '-' + 4 * w.c + 'k\\ge 0') + ', so ' + t('k\\le ' + bd) + '. Also ' + t('k\\ne 0') + ' (otherwise there is no ' + t('x^{2}') + ' term): ' + t(tgt) + '.',
        ['Real roots: ' + t('b^{2}-4ac\\ge 0') + '.', 'The leading coefficient of a quadratic cannot be ' + t(0) + '.'], 'real roots with a parameter', 'k');
    }
    var g = pickWhere(function () { return { a: r.int(1, 5), b: nz(r, 3, 13) }; }, function (o) { return (o.b * o.b) % (4 * o.a) !== 0; });
    var bnd = g.b * g.b / (4 * g.a), gi = Math.floor(bnd);
    return numPart(cp, 'Determine the greatest integer value of ' + t('k') + ' for which ' + t(genT(g.a, g.b, 0) + '+k=0') + ' has two distinct real roots.', gi,
      function (v) { if (v === gi + 1) return { code: cp + 'k-round', hint: t('k<' + rt(R([g.b * g.b, 4 * g.a]))) + ': the greatest integer less than ' + t(dT(Math.round(bnd * 1000) / 1000)) + ' is found by rounding <b>down</b>.' }; if (v === Math.floor(g.b * g.b / g.a) || v === Math.floor(g.b * g.b / g.a - 1e-9)) return { code: cp + 'disc-4', hint: 'The discriminant is ' + t('b^{2}-4ac') + '.' }; return null; },
      t('b^{2}-4ac=' + g.b * g.b + '-' + 4 * g.a + 'k>0') + ', so ' + t('k<' + rt(R([g.b * g.b, 4 * g.a])) + '\\approx ' + dT(Math.round(bnd * 1000) / 1000)) + '. The greatest integer is ' + t(gi) + '.',
      ['Two distinct real roots: ' + t('b^{2}-4ac>0') + '.', 'Solve for ' + t('k') + ', then take the greatest integer below the boundary.'], 'greatest integer k', { bad: [gi + 1] });
  };

  /* ======================================================================================================
   * Lesson 9 (RF4): max/min problems with a graphing calculator
   * ====================================================================================================== */
  function ballSpec(r) { return pickWhere(function () { var a = r.pick([-4.9, -5]), tv = r.pick([1, 1.5, 2, 2.5, 3, 1.2, 1.8]); return { a: a, tv: tv, b: Math.round(-2 * a * tv * 100) / 100, c: r.pick([0.8, 1, 1.5, 2, 0.5, 10, 12, 20]) }; }, function () { return true; }); }
  B.ctxGraph = function (r, cp) {
    var s = ballSpec(r), mx = s.c + s.a * s.tv * s.tv + s.b * s.tv, fn = 'h(t)=' + dT(s.a) + 't^{2}+' + dT(s.b) + 't+' + dT(s.c), askT = r.chance(0.3);
    var sol = 'Graph ' + t('Y_1=' + dT(s.a) + 'X^{2}+' + dT(s.b) + 'X+' + dT(s.c)) + ' and use <b>maximum</b>: the vertex is ' + t('(' + dT(s.tv) + ',\\ ' + dT(Math.round(mx * 100) / 100) + ')') + ' (or ' + t('t=-\\frac{b}{2a}=' + dT(s.tv)) + ').<br>' + (askT ? 'The maximum is reached after ' + t(dT(s.tv)) + ' s (the ' + t('x') + '-coordinate of the vertex).' : 'The maximum height is ' + t(dT(Math.round(mx * 100) / 100)) + ' m (the ' + t('y') + '-coordinate of the vertex).');
    var prompt = 'A ball is thrown upward. Its height in metres after ' + t('t') + ' seconds is ' + t(fn) + '. Use a graphing calculator. ' + (askT ? 'When does the ball reach its maximum height?' : 'What is the maximum height of the ball? Answer to the nearest hundredth of a metre.');
    var diag = function (v) { if (!askT && near(v, s.tv)) return { code: cp + 'ctx-time', hint: t(dT(s.tv)) + ' s is <b>when</b> the maximum happens. The height is the ' + t('y') + '-coordinate of the vertex.' }; if (askT && Math.abs(v - K.roundTo(mx, 2)) < 0.01) return { code: cp + 'ctx-time', hint: 'That is the maximum height. The time is the ' + t('x') + '-coordinate of the vertex.' }; if (near(v, s.c)) return { code: cp + 'ctx-c', hint: 'That is the starting height (the ' + t('h') + '-intercept).' }; return null; };
    var hints = ['The maximum height is the vertex of the graph: use the calculator’s maximum feature (or ' + t('t=-\\frac{b}{2a}') + ').', 'The time is the ' + t('x') + '-coordinate of the vertex; the height is its ' + t('y') + '-coordinate.'];
    if (askT) return numPart(cp, prompt, s.tv, diag, sol, hints, 'maximum from a graph', { after: 's', bad: [mx], allowRound: true, keyTex: dT(s.tv) });
    return apxPart(cp, prompt, mx, 2, diag, sol, hints, 'maximum from a graph', { after: 'm', bad: [s.tv] });
  };
  B.ctxLand = function (r, cp) {
    var s = ballSpec(r), mx = s.c + s.a * s.tv * s.tv + s.b * s.tv, fn = 'h(t)=' + dT(s.a) + 't^{2}+' + dT(s.b) + 't+' + dT(s.c), D = s.b * s.b - 4 * s.a * s.c, tl = (-s.b - Math.sqrt(D)) / (2 * s.a), tn = (-s.b + Math.sqrt(D)) / (2 * s.a);
    if (r.chance(0.45)) {
      var H = Math.round(r.int(Math.ceil(s.c + 1), Math.max(Math.ceil(s.c + 1), Math.floor(mx - 1)))), D2 = s.b * s.b - 4 * s.a * (s.c - H), t1 = (-s.b + Math.sqrt(D2)) / (2 * s.a), t2 = (-s.b - Math.sqrt(D2)) / (2 * s.a);
      if (H < mx - 0.5 && H > s.c) return rootsPart(cp, 'A ball’s height in metres after ' + t('t') + ' seconds is ' + t(fn) + '. Use a graphing calculator. At what times is the ball ' + t(H) + ' m above the ground? Give the times to the nearest hundredth of a second.', [t1, t2], { v: 't', dp: 2, missHint: 'The ball passes that height twice: once going up and once coming down.' },
        'Graph ' + t('Y_1=' + dT(s.a) + 'X^{2}+' + dT(s.b) + 'X+' + dT(s.c)) + ' and ' + t('Y_2=' + H) + ' and use <b>intersect</b> twice: ' + t('t\\approx ' + rT(t1, 2)) + ' s (going up) and ' + t('t\\approx ' + rT(t2, 2)) + ' s (coming down).',
        ['Graph the height and the line ' + t('Y_2=' + H) + '.', 'Find both intersections (or solve ' + t(fn.replace('h(t)=', '') + '=' + H) + ').'], 'times at a height');
    }
    return apxPart(cp, 'A ball’s height in metres after ' + t('t') + ' seconds is ' + t(fn) + '. Use a graphing calculator. When does the ball hit the ground? Give the answer to the nearest hundredth of a second.', tl, 2,
      function (v) { if (near(v, s.tv)) return { code: cp + 'ctx-time', hint: 'That is when the ball is highest. It hits the ground at the positive zero.' }; if (Math.abs(v - K.roundTo(tn, 2)) < 1e-9 || Math.abs(v + K.roundTo(tn, 2)) < 1e-9) return { code: cp + 'neg-root', hint: 'Time cannot be negative: use the positive zero.' }; return null; },
      'Graph ' + t('Y_1=' + dT(s.a) + 'X^{2}+' + dT(s.b) + 'X+' + dT(s.c)) + ' and use <b>zero</b> at the positive ' + t('t') + '-intercept: ' + t('t\\approx ' + rT(tl, 2)) + ' s. (The other zero, ' + t('t\\approx ' + rT(tn, 2)) + ', is before the throw.)',
      ['The ball hits the ground when ' + t('h(t)=0') + ': a zero of the function.', 'Use the positive zero.'], 'landing time from a graph', { after: 's', bad: [s.tv] });
  };
  /* revenue: a price change in steps (L9 #4–5, L10 #8–9) */
  B.revenue = function (r, cp, opt) {
    opt = opt || {};
    var dec = opt.dec != null ? opt.dec : r.chance(0.35), ask = opt.ask || (r.chance(0.65) ? 'price' : 'rev');
    var z = pickWhere(function () { return { P0: r.pick([20, 30, 40, 50, 60, 80, 90, 12, 16, 24]), d: r.pick([1, 2, 3, 5, 0.5]), N0: r.pick([200, 300, 400, 480, 500, 600, 800, 1000, 1200, 2000]), m: r.pick([5, 10, 20, 25, 40, 50, 100]) }; },
      function (o) { var xs = dec ? (o.P0 / o.d - o.N0 / o.m) / 2 : (o.N0 / o.m - o.P0 / o.d) / 2; return Number.isInteger(xs) && xs >= 2 && xs <= 20 && o.d < o.P0 / 4 && (dec ? o.P0 - o.d * xs > 0 : o.N0 - o.m * xs > 0); });
    var sg = dec ? -1 : 1, xs = dec ? (z.P0 / z.d - z.N0 / z.m) / 2 : (z.N0 / z.m - z.P0 / z.d) / 2, price = z.P0 + sg * z.d * xs, num = z.N0 - sg * z.m * xs, Rv = price * num;
    var item = r.pick([['a theatre', 'tickets', 'ticket'], ['a club', 'memberships', 'membership'], ['a bakery', 'cakes', 'cake'], ['a gym', 'passes', 'pass']]);
    var Rt = 'R(x)=(' + z.P0 + (dec ? '-' : '+') + (z.d === 1 ? '' : dT(z.d)) + 'x)(' + z.N0 + (dec ? '+' : '-') + z.m + 'x)';
    var money = function (v) { return Number.isInteger(v) ? String(v) : v.toFixed(2); };
    var prompt = 'Each week ' + item[0] + ' sells ' + t(z.N0) + ' ' + item[1] + ' at \\$' + money(z.P0) + ' each. For every \\$' + money(z.d) + ' ' + (dec ? 'decrease' : 'increase') + ' in the price, ' + t(z.m) + ' ' + (dec ? 'more' : 'fewer') + ' ' + item[1] + ' are sold. ' + (ask === 'price' ? 'What price gives the maximum weekly revenue?' : 'What is the maximum weekly revenue?');
    prompt = prompt.replace(/\\\$/g, '$');
    var z1 = dec ? z.P0 / z.d : -z.P0 / z.d, z2 = dec ? -z.N0 / z.m : z.N0 / z.m;
    var sol = 'Let ' + t('x') + ' be the number of \\$' + dT(z.d) + ' ' + (dec ? 'decreases' : 'increases') + ': ' + t(Rt) + '.<br>Zeros ' + t('x=' + dT(z1)) + ' and ' + t('x=' + dT(z2)) + '; the maximum is halfway: ' + t('x=' + xs) + ' (or use the calculator’s maximum).<br>Price ' + t(z.P0 + (dec ? '-' : '+') + dT(z.d) + '(' + xs + ')=' + dT(price)) + ' dollars, ' + t(num) + ' ' + item[1] + ', revenue ' + t(dT(price) + '\\times ' + num + '=' + F(Rv)) + ' dollars.';
    sol = sol.replace(/\\\$/g, '$');
    var hints = ['Let ' + t('x') + ' be the number of price changes. Price ' + t('=' + z.P0 + (dec ? '-' : '+') + dT(z.d) + 'x') + ', number sold ' + t('=' + z.N0 + (dec ? '+' : '-') + z.m + 'x') + '.', 'Revenue = price × number sold. The maximum is at the vertex, halfway between the zeros.'];
    var diag = function (v) { if (ask === 'price' && v === xs) return { code: cp + 'rev-x', hint: t(xs) + ' is the number of price changes. The price is ' + t(z.P0 + (dec ? '-' : '+') + dT(z.d) + '(' + xs + ')') + '.' }; if (ask === 'price' && near(v, Rv)) return { code: cp + 'rev-R', hint: 'That is the revenue. The question asks for the price.' }; if (ask === 'rev' && near(v, price)) return { code: cp + 'rev-R', hint: 'That is the price. The question asks for the revenue.' }; if (ask === 'price' && (near(v, z.P0 + sg * z.d * z2) || near(v, z.P0 + sg * z.d * z1))) return { code: cp + 'rev-zero', hint: 'At a zero the revenue is ' + t(0) + '. The maximum is halfway between the zeros.' }; return null; };
    return numPart(cp, prompt, ask === 'price' ? price : Rv, diag, sol, hints, 'revenue problem', { before: '$', bad: ask === 'price' ? [xs, Rv] : [price], placeholder: 'e.g. 45' });
  };
  /* MAS: whole numbers of weeks (L9 #6, EP09 C2) */
  B.wholeWeeks = function (r, cp) {
    var z = pickWhere(function () { return { W0: r.pick([3000, 4000, 5000, 6000, 8000]), g: r.pick([200, 250, 300, 400, 500]), P0: r.pick([4, 4.5, 5, 6, 6.5, 7]), d: r.pick([0.1, 0.2, 0.25, 0.3]) }; }, function (o) {
      var ws = (o.P0 / o.d - o.W0 / o.g) / 2, f = ws - Math.floor(ws); return ws > 1 && ws < 20 && f > 0.15 && f < 0.85 && Math.abs(f - 0.5) > 0.05;
    });
    var Rf = function (w) { return Math.round((z.W0 + z.g * w) * (z.P0 - z.d * w) * 100) / 100; }, ws = (z.P0 / z.d - z.W0 / z.g) / 2, lo = Math.floor(ws), best = Rf(lo) >= Rf(lo + 1) ? lo : lo + 1, other = best === lo ? lo + 1 : lo;
    var askW = r.chance(0.4);
    var prompt = 'A fish farm could sell its stock today: ' + t(F(z.W0)) + ' kg of fish at $' + z.P0.toFixed(2) + ' per kg. For each week it waits, the fish gain a total of ' + t(z.g) + ' kg, but the price falls by $' + z.d.toFixed(2) + ' per kg. The farm can only sell at the end of a whole week. ' + (askW ? 'After how many whole weeks should it sell to earn the most?' : 'What is the greatest revenue it can earn?');
    var sol = t('R(w)=(' + z.W0 + '+' + z.g + 'w)(' + dT(z.P0) + '-' + dT(z.d) + 'w)') + '. The calculator’s maximum is at ' + t('w=' + dT(Math.round(ws * 1000) / 1000)) + ' (' + t(F(Math.round(Rf(ws) * 100) / 100)) + ' dollars), but ' + t('w') + ' must be a whole number.<br>TABLE: ' + t('R(' + lo + ')=' + F(Rf(lo))) + ', ' + t('R(' + (lo + 1) + ')=' + F(Rf(lo + 1))) + '. Sell after ' + t(best) + ' weeks, for ' + t(F(Rf(best))) + ' dollars.';
    var hints = ['Revenue = (mass of fish) × (price per kg), each in terms of the number of weeks ' + t('w') + '.', 'The vertex is not a whole number of weeks: compare the whole numbers on each side of it.'];
    if (askW) return numPart(cp, prompt, best, function (v) { if (v === other) return { code: cp + 'rev-whole', hint: 'Compare the revenue for ' + t(lo) + ' and ' + t(lo + 1) + ' weeks: one is larger.' }; if (Math.abs(v - ws) < 0.01) return { code: cp + 'rev-whole', hint: 'The farm sells only at the end of a whole week.' }; return null; }, sol, hints, 'whole-number maximum', { after: 'weeks', bad: [other] });
    return numPart(cp, prompt, Rf(best), function (v) { if (Math.abs(v - Rf(ws)) < 0.01) return { code: cp + 'rev-whole', hint: 'That revenue needs a part of a week. Compare the whole numbers of weeks on each side of the vertex.' }; if (near(v, Rf(other))) return { code: cp + 'rev-whole', hint: 'Compare the revenue for ' + t(lo) + ' and ' + t(lo + 1) + ' weeks: the other one is larger.' }; if (v === best) return { code: cp + 'rev-R', hint: 'That is the number of weeks. The question asks for the revenue.' }; return null; }, sol, hints, 'whole-number maximum', { before: '$', bad: [Rf(other)], allowRound: true });
  };

  /* ======================================================================================================
   * Lesson 10 (RF4 / RF5): max/min problems with algebra
   * ====================================================================================================== */
  B.numbers = function (r, cp) {
    var kind = r.pick(['sumSq', 'prod2', 'diff']), S, ans, prompt, sol, num;
    if (kind === 'sumSq') { S = r.int(5, 20) * 2; ans = S * S / 2; num = S / 2; prompt = 'Two numbers have a sum of ' + t(S) + '. Determine the minimum possible value of the sum of their squares.'; sol = 'Let the numbers be ' + t('x') + ' and ' + t(S + '-x') + ': ' + t('S(x)=x^{2}+(' + S + '-x)^{2}=2x^{2}-' + 2 * S + 'x+' + S * S) + '.<br>' + t('x=-\\frac{-' + 2 * S + '}{4}=' + num) + '; the numbers are ' + t(num) + ' and ' + t(num) + ', and the minimum is ' + t(num * num + '+' + num * num + '=' + ans) + '.'; }
    else if (kind === 'prod2') { S = r.int(3, 15) * 4; num = S / 4; ans = num * (S - 2 * num); prompt = 'The sum of a number and twice a second number is ' + t(S) + '. Determine the maximum possible product of the two numbers.'; sol = 'Let the second number be ' + t('y') + '; the first is ' + t(S + '-2y') + '. ' + t('P(y)=y(' + S + '-2y)') + ' has zeros ' + t(0) + ' and ' + t(S / 2) + ', so the axis is ' + t('y=' + num) + '.<br>The numbers are ' + t(S - 2 * num) + ' and ' + t(num) + '; the maximum product is ' + t(ans) + '.'; }
    else { S = r.int(3, 15) * 2; num = S / 2; ans = -num * num; prompt = 'Two numbers have a difference of ' + t(S) + '. Determine the minimum possible value of their product.'; sol = 'Let the numbers be ' + t('x') + ' and ' + t('x+' + S) + ': ' + t('P(x)=x^{2}+' + S + 'x=(x+' + num + ')^{2}-' + num * num) + '.<br>The minimum is ' + t(ans) + ', when the numbers are ' + t(-num) + ' and ' + t(num) + '.'; }
    return numPart(cp, prompt, ans, function (v) { if (v === num || v === -num || v === S - 2 * num) return { code: cp + 'gave-num', hint: 'That is one of the numbers. The question asks for the ' + (kind === 'sumSq' ? 'sum of the squares' : 'product') + '.' }; return null; }, sol,
      ['Let one number be ' + t('x') + ' and write the other in terms of it.', 'Write the quantity to be made ' + (kind === 'prod2' ? 'greatest' : 'least') + ' as a quadratic function and find its vertex.'], 'number problem', { bad: [num] });
  };
  B.fence = function (r, cp) {
    var kind = r.pick(['wall', 'pens', 'cost']), prompt, sol, A, dims, xS;
    if (kind === 'wall') { var Fw = r.int(10, 60) * 4; xS = Fw / 4; A = xS * (Fw - 2 * xS); dims = [xS, Fw - 2 * xS]; prompt = 'A rectangular garden is fenced on three sides with ' + t(Fw) + ' m of fencing; the fourth side is a house wall. Determine the maximum area of the garden.'; sol = 'Let each side perpendicular to the wall be ' + t('x') + ': ' + t('A(x)=x(' + Fw + '-2x)') + ', zeros ' + t(0) + ' and ' + t(Fw / 2) + ', axis ' + t('x=' + xS) + '.<br>The garden is ' + t(xS) + ' m by ' + t(Fw - 2 * xS) + ' m: ' + t('A=' + F(A)) + ' m².'; }
    else if (kind === 'pens') { var n = r.pick([2, 3, 4]); var Fp = 2 * (n + 1) * r.int(4, 15) * 2; xS = Fp / (2 * (n + 1)); var L = (Fp - (n + 1) * xS) / 2; A = xS * L; dims = [xS, L]; prompt = 'A rectangular field is divided into ' + t(n) + ' pens by ' + t(n - 1) + ' fence' + (n > 2 ? 's' : '') + ' parallel to its width. A total of ' + t(Fp) + ' m of fencing is used. Determine the greatest possible total area.'; sol = 'Let the width be ' + t('w') + '. There are ' + t(n + 1) + ' widths and ' + t(2) + ' lengths: ' + t((n + 1) + 'w+2L=' + Fp) + ', so ' + t('L=' + Fp / 2 + '-' + rt([n + 1, 2]) + 'w') + '.<br>' + t('A(w)=w\\left(' + Fp / 2 + '-' + rt([n + 1, 2]) + 'w\\right)') + ': zeros ' + t(0) + ' and ' + t(2 * xS) + ', axis ' + t('w=' + xS) + ', ' + t('L=' + L) + '.<br>The greatest area is ' + t(xS + '\\times ' + L + '=' + F(A)) + ' m².'; }
    else { var cz = pickWhere(function () { return { c1: r.pick([10, 12, 15, 20]), c2: r.pick([5, 6, 8]), xx: r.int(5, 20) }; }, function (o) { return (2 * o.c2 * o.xx) % o.c1 === 0; }), c1 = cz.c1, c2 = cz.c2, xx = cz.xx; var Bg = 4 * c2 * xx, Lq = R([2 * c2 * xx, c1]); xS = xx; A = qm(xx, Lq); dims = [xx, rv(Lq)]; prompt = 'A rectangular yard is built against a wall, so only three sides need fencing. The side parallel to the wall costs $' + c1 + ' per metre; the two ends cost $' + c2 + ' per metre. The budget is $' + F(Bg) + '. Determine the largest possible area of the yard.'; sol = 'Let each end be ' + t('x') + ' m and the side parallel to the wall ' + t('L') + ': ' + t(c2 + '(2x)+' + c1 + 'L=' + Bg) + ', so ' + t('L=\\frac{' + Bg + '-' + 2 * c2 + 'x}{' + c1 + '}') + '.<br>' + t('A(x)=x\\cdot\\frac{' + Bg + '-' + 2 * c2 + 'x}{' + c1 + '}') + ': zeros ' + t(0) + ' and ' + t(Bg / (2 * c2)) + ', axis ' + t('x=' + xx) + '.<br>' + t('L=' + rt(Lq)) + '; the largest area is ' + t(rt(A)) + ' m².'; }
    var Av = R(A); A = rv(Av);
    return numPart(cp, prompt, Av, function (v) { if (near(v, dims[0]) || near(v, dims[1])) return { code: cp + 'gave-dim', hint: 'That is one of the dimensions. The question asks for the area.' }; if (kind === 'wall' && near(v, A / 2)) return { code: cp + 'fence-4', hint: 'Only three sides are fenced: ' + t('2x+L') + ' is the fencing.' }; return null; },
      sol, ['Let one dimension be ' + t('x') + ' and write the other in terms of it using the fencing (or the budget).', 'Write the area as a quadratic function; the maximum is at the vertex, halfway between the zeros.'], 'fencing problem', { after: 'm²', bad: [dims[0]] });
  };
  /* RF5: when is a thrown object at a given height (L10 #11) */
  B.height = function (r, cp) {
    var z = pickWhere(function () { return { v: r.int(15, 30), H: r.int(5, 25) }; }, function (o) { var D = o.v * o.v - 20 * o.H; return D > 0 && !isSq(D); });
    var D = z.v * z.v - 20 * z.H, t1 = (z.v - Math.sqrt(D)) / 10, t2 = (z.v + Math.sqrt(D)) / 10;
    return rootsPart(cp, 'A stone is thrown straight up. Its height in metres after ' + t('t') + ' seconds is ' + t('h(t)=' + z.v + 't-5t^{2}') + '. When is the stone ' + t(z.H) + ' m above the ground? Give the times to the nearest tenth of a second.', [t1, t2], { v: 't', dp: 1, missHint: 'The stone passes ' + t(z.H) + ' m twice: once on the way up and once on the way down.' },
      t(z.v + 't-5t^{2}=' + z.H) + ', so ' + t('5t^{2}-' + z.v + 't+' + z.H + '=0') + '.<br>' + t('t=\\frac{' + z.v + '\\pm\\sqrt{' + z.v * z.v + '-' + 20 * z.H + '}}{10}=\\frac{' + z.v + '\\pm\\sqrt{' + D + '}}{10}') + ', so ' + t('t\\approx ' + rT(t1, 1)) + ' s and ' + t('t\\approx ' + rT(t2, 1)) + ' s (once going up, once coming down).',
      ['Set the height equal to ' + t(z.H) + ' and write the equation in standard form.', 'Use the quadratic formula: there are two times.'], 'time at a given height');
  };
  /* MAS: optimization (L10 #7, #10, EP10 B1, B5) */
  B.optMas = function (r, cp) {
    var kind = r.pick(['tri', 'wire', 'line', 'sumsq2']);
    if (kind === 'tri') {
      var z = pickWhere(function () { return { b: r.int(4, 16), h: r.int(6, 20) }; }, function (o) { return o.h % 2 === 0 || o.b % 2 === 0; });
      var A = R([z.b * z.h, 4]), hy = R([z.h, 2]), wd = R([z.b, 2]);
      return numPart(cp, 'A rectangle is drawn inside an isosceles triangle with base ' + t(z.b) + ' cm and height ' + t(z.h) + ' cm. The bottom of the rectangle lies on the base and its top corners touch the other two sides. Determine the greatest possible area of the rectangle.', A,
        function (v) { if (near(v, rv(hy)) || near(v, rv(wd))) return { code: cp + 'gave-dim', hint: 'That is a dimension of the rectangle. The question asks for its area.' }; if (near(v, z.b * z.h / 2)) return { code: cp + 'gave-dim', hint: 'That is the area of the triangle.' }; return null; },
        'Let the height of the rectangle be ' + t('y') + '. The triangle above it is similar to the whole: ' + t('\\frac{w}{' + z.b + '}=\\frac{' + z.h + '-y}{' + z.h + '}') + ', so ' + t('w=' + z.b + '-' + rt([z.b, z.h]) + 'y') + '.<br>' + t('A(y)=y\\left(' + z.b + '-' + rt([z.b, z.h]) + 'y\\right)') + ': zeros ' + t(0) + ' and ' + t(z.h) + ', axis ' + t('y=' + rt(hy)) + '.<br>Width ' + t(rt(wd)) + ' cm, height ' + t(rt(hy)) + ' cm: the greatest area is ' + t(rt(A)) + ' cm².',
        ['Use similar triangles to write the width in terms of the height ' + t('y') + '.', 'The area is a quadratic in ' + t('y') + ': its maximum is halfway between its zeros.'], 'rectangle in a triangle', { after: 'cm²', bad: [hy] });
    }
    if (kind === 'wire') {
      var L = r.int(5, 30) * 4, A2 = R([L * L, 32]);
      return numPart(cp, 'A wire ' + t(L) + ' cm long is cut into two pieces, and each piece is bent into a square. Determine the smallest possible total area of the two squares.', A2,
        function (v) { if (near(v, L / 2)) return { code: cp + 'gave-dim', hint: t(L / 2) + ' cm is where to cut. The question asks for the total area.' }; if (near(v, L * L / 16)) return { code: cp + 'gave-dim', hint: 'That is the area if the whole wire made one square.' }; return null; },
        'Pieces ' + t('x') + ' and ' + t(L + '-x') + '; the sides are ' + t('\\frac{x}{4}') + ' and ' + t('\\frac{' + L + '-x}{4}') + '.<br>' + t('A(x)=\\frac{x^{2}}{16}+\\frac{(' + L + '-x)^{2}}{16}=\\frac{1}{16}(2x^{2}-' + 2 * L + 'x+' + L * L + ')') + ': ' + t('x=-\\frac{-' + 2 * L + '}{4}=' + L / 2) + '.<br>Cut it in the middle: ' + t('A=2\\left(\\frac{' + L / 2 + '}{4}\\right)^{2}=' + rt(A2)) + ' cm².',
        ['Let one piece be ' + t('x') + ' cm: each square’s side is a quarter of its piece.', 'Write the total area as a quadratic and find its vertex.'], 'wire cut into squares', { after: 'cm²', bad: [L / 2] });
    }
    if (kind === 'line') {
      var w = pickWhere(function () { return { a: r.int(1, 6), b: r.int(1, 6), c: r.int(2, 8) * 6 }; }, function (o) { return o.a !== o.b && o.c % o.a === 0 && o.c % o.b === 0; });
      var A3 = R([w.c * w.c, 4 * w.a * w.b]), xv = R([w.c, 2 * w.a]), yv = R([w.c, 2 * w.b]);
      return numPart(cp, 'A rectangle has one corner at the origin, two sides along the positive axes, and the opposite corner on the line ' + t(cT(w.a) + 'x+' + cT(w.b) + 'y=' + w.c) + '. Determine the greatest possible area of the rectangle.', A3,
        function (v) { if (near(v, rv(xv)) || near(v, rv(yv))) return { code: cp + 'gave-dim', hint: 'That is a dimension. The question asks for the area.' }; return null; },
        'The corner ' + t('(x,\\ y)') + ' is on the line: ' + t('y=\\frac{' + w.c + '-' + cT(w.a) + 'x}{' + w.b + '}') + '.<br>' + t('A(x)=x\\cdot\\frac{' + w.c + '-' + cT(w.a) + 'x}{' + w.b + '}') + ': zeros ' + t(0) + ' and ' + t(w.c / w.a) + ', axis ' + t('x=' + rt(xv)) + ', ' + t('y=' + rt(yv)) + '.<br>The greatest area is ' + t(rt(xv) + '\\times ' + rt(yv) + '=' + rt(A3)) + '.',
        ['Write ' + t('y') + ' in terms of ' + t('x') + ' from the line.', 'The area ' + t('xy') + ' is a quadratic in ' + t('x') + '; its maximum is halfway between its zeros.'], 'rectangle under a line', { bad: [xv] });
    }
    var S = r.int(10, 40), mn = R([4 * S - 1, 4]);
    return numPart(cp, 'The sum of two numbers is ' + t(S) + '. Determine the smallest possible value of the first number plus the square of the second.', mn,
      function (v) { if (near(v, 0.5)) return { code: cp + 'gave-num', hint: t('\\frac{1}{2}') + ' is the second number. The question asks for the smallest value of the expression.' }; if (near(v, S - 0.5)) return { code: cp + 'gave-num', hint: 'That is the first number.' }; return null; },
      'Let the second number be ' + t('y') + '; the first is ' + t(S + '-y') + '. ' + t('f(y)=' + S + '-y+y^{2}=\\left(y-\\frac{1}{2}\\right)^{2}+' + rt(mn)) + '.<br>The smallest value is ' + t(rt(mn)) + ', when the numbers are ' + t(rt(R([2 * S - 1, 2]))) + ' and ' + t('\\frac{1}{2}') + '.',
      ['Write the expression in terms of one number.', 'Complete the square (or use ' + t('x=-\\frac{b}{2a}') + ') for the minimum.'], 'number problem', { bad: [[1, 2]] });
  };

  HW.u5assess = { B: B, rootsPart: rootsPart, eqPart: eqPart };

  /* ======================================================================================================
   * The unit test
   * ====================================================================================================== */
  var CP = 'u5t-';
  function mk(fn, o) { return function (r) { return fn(r, CP, o); }; }
  function Pt(id, outcome, level, make) { return { id: id, outcome: outcome, level: level, make: make }; }
  var QUESTIONS = [
    // ---------------- Beginning ----------------
    { num: '1', outcome: 'RF3', lesson: 'L2, L3', stem: 'Vertex form.', parts: [Pt('1a', 'RF3', 'BEG', function (r) { return B.imageEq(r, CP, { mode: r.chance(0.35) ? 'trans' : 'full' }); }), Pt('1b', 'RF3', 'BEG', mk(B.vertex, { rearr: false }))] },
    { num: '2', outcome: 'RF3', lesson: 'L3', stem: 'Features of vertex form.', parts: [Pt('2a', 'RF3', 'BEG', mk(B.range)), Pt('2b', 'RF3', 'BEG', mk(B.nXint))] },
    { num: '3', outcome: 'RF4', lesson: 'L4', stem: 'General and factored form.', parts: [Pt('3a', 'RF4', 'BEG', mk(B.axisGen)), Pt('3b', 'RF4', 'BEG', mk(B.vertexFac, { mode: 'int' }))] },
    { num: '4', outcome: 'RF4', lesson: 'L6', stem: 'Completing the square.', parts: [Pt('4', 'RF4', 'BEG', mk(B.cts, { mode: 'monic' }))] },
    { num: '5', outcome: 'RF5', lesson: 'L1', stem: 'Zeros.', parts: [Pt('5', 'RF5', 'BEG', mk(B.zeros))] },
    { num: '6', outcome: 'RF5', lesson: 'L7, L8', stem: 'Quadratic equations.', parts: [Pt('6a', 'RF5', 'BEG', mk(B.qf)), Pt('6b', 'RF5', 'BEG', function (r) { return r.chance(0.5) ? B.nature(r, CP, { rearr: false }) : B.disc(r, CP, { rearr: false }); })] },
    // ---------------- Progressing ----------------
    { num: '7', outcome: 'RF3', lesson: 'L3', stem: 'x-intercepts from vertex form.', parts: [Pt('7', 'RF3', 'PRG', mk(B.xintVF))] },
    { num: '8', outcome: 'RF3', lesson: 'L2, L5', stem: 'Transformations and equations.', parts: [Pt('8a', 'RF3', 'PRG', mk(B.imagePt)), Pt('8b', 'RF3', 'PRG', function (r) { return r.chance(0.3) ? B.graphEq(r, CP) : B.vpEq(r, CP, { mode: 'frac' }); })] },
    { num: '9', outcome: 'RF4', lesson: 'L6', stem: 'Completing the square.', parts: [Pt('9', 'RF4', 'PRG', mk(B.cts))] },
    { num: '10', outcome: 'RF4', lesson: 'L4', stem: 'General form.', parts: [Pt('10', 'RF4', 'PRG', function (r) { return B.vertexGen(r, CP, { ask: r.pick(['vertex', 'range']) }); })] },
    { num: '11', outcome: 'RF4', lesson: 'L9, L10', stem: 'Maximum and minimum problems.', parts: [Pt('11a', 'RF4', 'PRG', mk(B.revenue)), Pt('11b', 'RF4', 'PRG', function (r) { return r.chance(0.55) ? B.fence(r, CP) : B.numbers(r, CP); })] },
    { num: '12', outcome: 'RF5', lesson: 'L1', stem: 'A function from its zeros.', parts: [Pt('12', 'RF5', 'PRG', mk(B.fromZeros))] },
    { num: '13', outcome: 'RF5', lesson: 'L7', stem: 'The quadratic formula.', parts: [Pt('13', 'RF5', 'PRG', mk(B.qfStd))] },
    { num: '14', outcome: 'RF5', lesson: 'L8', stem: 'The discriminant.', parts: [Pt('14', 'RF5', 'PRG', function (r) { return r.chance(0.7) ? B.kRange(r, CP) : B.kEqual(r, CP); })] },
    // ---------------- Mastery ----------------
    { num: '15', outcome: 'RF3', lesson: 'L5', stem: 'Writing the equation.', parts: [Pt('15', 'RF3', 'MAS', mk(B.vpMas))] },
    { num: '16', outcome: 'RF3', lesson: 'L3', stem: 'Working backwards.', parts: [Pt('16', 'RF3', 'MAS', mk(B.vfBack))] },
    { num: '17', outcome: 'RF4', lesson: 'L4, L6', stem: 'An unknown coefficient.', parts: [Pt('17', 'RF4', 'MAS', function (r) { return r.chance(0.6) ? B.unknownCoef(r, CP) : B.ctsK(r, CP); })] },
    { num: '18', outcome: 'RF4', lesson: 'L10', stem: 'Optimization.', parts: [Pt('18', 'RF4', 'MAS', mk(B.optMas))] },
    { num: '19', outcome: 'RF5', lesson: 'L7', stem: 'A problem solved with the quadratic formula.', parts: [Pt('19', 'RF5', 'MAS', mk(B.qfWord))] },
    { num: '20', outcome: 'RF5', lesson: 'L8', stem: 'The discriminant with a parameter.', parts: [Pt('20', 'RF5', 'MAS', mk(B.discMas))] }
  ];

  HW.defineTest({
    id: 'u5test', unit: 5, title: 'Unit 5 Test', outcome: 'RF3', calc: true,
    blurb: 'The Unit 5 outcomes-based test on RF3 (vertex form: transformations, vertex, range, intercepts, writing the equation), RF4 (general form: axis and vertex, completing the square, maximum and minimum problems) and RF5 (quadratic equations: zeros, the quadratic formula, the discriminant) — in Beginning, Progressing and Mastery boxes. Calculator allowed.',
    // Short version (~half the time): the image of y = x² and the vertex, the axis and the vertex of factored form, the
    // quadratic formula and the discriminant at Beginning; a point's image and an equation from the vertex, completing the
    // square and general form, standard form then the formula and the values of k at Progressing; an equation from the
    // axis / an arch / a jet, optimization and a formula word problem at Mastery.
    short: ['1', '3', '6', '8', '9', '10', '13', '14', '15', '18', '19'],
    questions: QUESTIONS
  });
})(window);
