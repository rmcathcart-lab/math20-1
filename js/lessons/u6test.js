/* Math 20-1 · Unit 6 Test (AN4, AN5, AN6) — Rational Expressions and Equations: non-permissible values, evaluating,
 * simplifying by factoring (opposite binomials, working backwards), multiplying and dividing (NPVs of every denominator and
 * of every divisor's numerator), adding and subtracting with monomial, binomial and trinomial denominators, solving rational
 * equations (linear and quadratic, extraneous roots, no solution, exact roots by the quadratic formula) and problems (number,
 * distance–speed–time, wind and current, work rate). Written from Ryan's Unit 6 booklet (m201book/unit6: Lessons 1–10,
 * their assignments and extra practice; Lesson 10's assignment and EP10 are the practice tests that set the style and
 * difficulty). There is no older test for this course. One class (about 75 minutes by tests/short_report.js), calculator
 * allowed (answers stay exact: simplest rational expressions, exact roots); three outcomes, each with Beginning,
 * Progressing and Mastery boxes; 18 questions / 27 parts:
 *   AN4 (equivalent forms, L1–L2)   Beginning 2 questions / 3 parts, Progressing 1 / 3, Mastery 1 / 1
 *   AN5 (operations, L3–L6)         Beginning 2 / 4,                 Progressing 3 / 5, Mastery 2 / 2
 *   AN6 (rational equations, L7–L9) Beginning 2 / 4,                 Progressing 3 / 3, Mastery 2 / 2
 *
 * How each box is pitched:
 *   Beginning  — each lesson's core skill as first taught: the NPVs of one expression with a monomial or linear
 *                denominator (L1 Ex 4, #5) and evaluating an expression, sometimes where it is undefined (L1 Ex 2, #2);
 *                simplifying a quotient of monomials with its NPVs (L2 Ex 1, #1); multiplying monomial fractions and
 *                dividing expressions with binomial factors (L3 #2, L4 #4); adding or subtracting over one denominator or
 *                over monomial denominators, and over two binomial denominators with no common factor (L5 #3, #5,
 *                L6 #1); the NPVs of an equation, an equation with monomial denominators, cross-multiplying, and
 *                x − c/x = b (L7 #1, #3, #4, L8 #1).
 *   Progressing — the typical assignment question: the NPVs after factoring the denominator (trinomials, a ≠ 1,
 *                differences of squares, a GCF or a cubic, L1 #6), simplifying trinomial over trinomial and with
 *                opposite binomials (L2 #4–6); multiplying and dividing trinomials (L3 #4–5, L4 #5); binomial numerators over
 *                monomial denominators, trinomial denominators, opposite denominators and a whole-number term (L5 #6–7,
 *                L6 #2–5); equations with binomial and trinomial denominators, sometimes with no solution (L7 #5, #8), with
 *                an extraneous root (L8 #3), and a linear problem (same time, wind or current, work together) (L9 #3, #8, #9).
 *   Mastery    — the hardest assignment / extra-practice items: working backwards (the k that makes an expression
 *                simplify, or the other NPV once k is found: L1 #18, L2 #9e, #19); three expressions multiplied and divided
 *                with every NPV (L4 #7, L10 #13); a sum of three fractions over trinomial denominators that simplifies
 *                (L6 #18–19, EP06); exact roots in simplest radical form (L8 #6, #16), and a problem that leads to a
 *                quadratic (one speed faster with a time saved, a machine that is faster, a number and its reciprocal:
 *                L9 #4, #10, L10 #24–27, EP10 C3–C4).
 * Coverage: L1 Q1, Q7a, Q14 · L2 Q2, Q7b–c, Q14 · L3 Q3a, Q8a · L4 Q3b, Q8b, Q15 · L5 Q4a, Q9a · L6 Q4b, Q9b, Q10,
 *           Q16 · L7 Q5, Q6a, Q11 · L8 Q6b, Q12, Q17 · L9 Q13, Q18 · L10 (review) numbers and styles throughout.
 * Short version (def.short): Q1, Q3b, Q4b, Q5b, Q6b (Beginning: AN4 2, AN5 2, AN6 2 parts), Q7bc, Q8b, Q9b, Q11, Q12
 * (Progressing: 2 each), Q14, Q16, Q18 (Mastery: 1 each) — 13 questions / 15 parts, about half the working time
 * (~42 of ~75 min by tests/short_report.js); every outcome keeps all three boxes.
 * Not used: numerical-response boxes ("the value of A + B") — the online version asks for the expression or the root
 * itself; "explain the error" items — their checkable step (the correct simplification and NPVs) is asked instead;
 * graphing-calculator intersect items; two-variable NPVs in terms of another variable (x ≠ 4y).
 *
 * Answers are typed. "Simplify and state the NPVs" is one part with two boxes (Simplified, NPVs). A simplified expression
 * is checked by value at six points away from the NPVs, then for form: one fraction (no fraction left in a sum), lowest
 * terms (no common factor left: the written denominator has the degree of the simplest one, and the numbers share no
 * factor), integers rather than decimals; numerator and denominator may be factored or expanded, and any arrangement of
 * the sign is accepted (−(x + 5)/x = (x + 5)/(−x) = (−x − 5)/x). NPVs: "x ≠ 3, −2" (or just "3, −2"; ± allowed; "none");
 * two variables as "m ≠ 0, n ≠ 0". Roots: "x = a, x = b" (± allowed, exact radicals in simplest form) or "no solution".
 * Every part has `bad` answers with u6t- codes; partial credit (one recognized mistake keeps 2/3 or 1/3) is decided below.
 *
 * The question builders are the Unit 6 assessment kit HW.u6assess (below); js/exits/u6.js uses them with u6x- codes, so
 * this file loads first. Nothing here depends on the practice files (js/lessons/u6l*.js). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, KP = K.P, P = HW.poly, ex = HW.ex, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  if (!P || !K.valueSet) throw new Error('js/lessons/u6test.js needs js/poly.js and js/relfn.js');

  /* ======================================================================================================
   * Codes: one list, registered for both the test (u6t-) and the exit slips (u6x-), with partial-credit decisions
   * (s = small: keeps 2/3, b = big: keeps 1/3, n = none). Format nudges (v: 'form') only need labels.
   * ====================================================================================================== */
  var BASE = {
    'npv-cancel': ['NPVs taken from the simplified expression (a divided-out factor’s NPV missing)', 's'],
    'npv-div': ['Division: left out the NPVs from the divisor’s numerator', 's'],
    'npv-num': ['Used a numerator’s zero as an NPV', 'b'], 'npv-missing': ['Missed an NPV', 's'], 'npv-extra': ['Listed a value that is not an NPV', 's'],
    'npv-sign': ['NPVs with the wrong signs', 'b'], 'npv-wrong': ['Right expression, NPVs wrong or missing', 'b'], 'npv-one': ['Only the NPVs of one denominator', 'b'],
    'ev-undef': ['Evaluating: undefined / defined mixed up', 'n'], 'ev-slip': ['Evaluating: substitution slip', 's'],
    'gave-k': ['Gave the value of k instead of what was asked', 'b'], 'gave-given': ['Gave the value that was given', 'n'], 'k-sign': ['Value with the wrong sign', 's'],
    'mono-exp': ['Monomials: a power in the wrong part of the fraction', 'b'], 'mono-coef': ['Monomials: coefficients not divided correctly', 's'],
    'opp-sign': ['Opposite factors: lost the −1', 'b'], 'terms': ['Divided out terms instead of factors', 'n'],
    'div-noflip': ['Division: multiplied by the divisor instead of its reciprocal', 'n'], 'div-flipfirst': ['Division: flipped the first fraction instead of the divisor', 'n'],
    'add-straight': ['Added the numerators and added the denominators', 'n'], 'sub-sign': ['Subtraction: minus not applied to every term of the second numerator', 'b'],
    'lcd-num': ['Changed a denominator to the LCD without multiplying its numerator', 'n'], 'whole-lcd': ['Whole-number term not multiplied by the LCD', 'b'],
    'eq-extr': ['Kept an extraneous root (an NPV)', 'b'], 'eq-rejvalid': ['Rejected a root that checks', 's'], 'eq-nosol': ['Said “no solution” when there is one', 'n'],
    'eq-oneterm': ['Did not multiply every term by the LCD', 'n'], 'eq-missing': ['Found only one of the two roots', 's'], 'eq-sign': ['Root(s) with the wrong sign', 's'],
   
    'w-add': ['Work rate: added the times', 'n'], 'w-avg': ['Work rate: averaged the times', 'n'], 'w-other': ['Gave the other quantity, not the one asked for', 's'],
    'neg-root': ['Kept the inadmissible (negative) root', 's'], 'nocancel': ['Multiplied out but did not divide out any common factor', 'b'], 'w-model': ['Equation set up with the speeds or times the wrong way round', 'n']
  };
  (function () {
    var codes = {}, part = {};
    Object.keys(BASE).forEach(function (k) { ['u6t-', 'u6x-'].forEach(function (cp) { codes[cp + k] = BASE[k][0]; if (BASE[k][1]) part[cp + k] = BASE[k][1]; }); });
    codes['u6r-single'] = 'Not written as a single fraction (format)'; codes['u6r-lowest'] = 'Not in lowest terms: a common factor left (format)';
    codes['u6r-reduce'] = 'Numbers in the fraction not reduced (format)'; codes['u6r-tidy'] = 'Numerator or denominator not simplified (format)';
    codes['u6r-decimal'] = 'Decimal coefficients instead of exact ones (format)'; codes['u6r-radical'] = 'Exact roots: radical or fraction not simplified (format)'; codes['u6r-npvletter'] = 'NPVs written for the wrong letter (format)';
    HW.addCodes(codes); HW.addPartial(part);
  })();

  /* ======================================================================================================
   * Small tools
   * ====================================================================================================== */
  var gcd = function (a, b) { return ex.gcd(Math.abs(a), Math.abs(b)); };
  function lcm(a, b) { return Math.abs(a) / gcd(a, b) * Math.abs(b); }
  function pickWhere(gen, test) { for (var i = 0; i < 8000; i++) { var o = gen(); if (o && test(o)) return o; } throw new Error('u6 assessments: no instance found'); }
  function nz(r, lo, hi) { return (r.chance(0.5) ? -1 : 1) * r.int(lo, hi); }
  function M(c, v, e) { if (!e) return P.num(c); var o = {}; o[v] = e; return P.mono(c, o); }
  function lin(a, b, v) { return P.add(M(a, v || 'x', 1), P.num(b)); }
  function tx(p) { return P.tex(p); }
  function txa(p) { return P.tex(p, { order: 'asc' }); }
  function sg(n) { return n < 0 ? '-' + (-n) : '+' + n; }
  function par(n) { return n < 0 ? '(' + n + ')' : String(n); }
  function R(x) { return Array.isArray(x) ? ex.norm(x[0], x[1]) : [x, 1]; }
  function rv(x) { x = R(x); return x[0] / x[1]; }
  function fr(p, q) { return ex.texRat(ex.norm(p, q == null ? 1 : q)); }
  function rt(x) { return ex.texRat(R(x)); }
  function qm(a, b) { return ex.norm(a[0] * b[0], a[1] * b[1]); }
  function qd(a, b) { return ex.norm(a[0] * b[1], a[1] * b[0]); }
  function qa(a, b) { return ex.norm(a[0] * b[1] + b[0] * a[1], a[1] * b[1]); }
  function has(arr, x) { return arr.some(function (y) { return Math.abs(rv(y) - rv(x)) < 1e-9; }); }
  function uniqR(a) { var out = []; a.forEach(function (x) { if (!has(out, x)) out.push(R(x)); }); return out.sort(function (p, q) { return rv(p) - rv(q); }); }
  function coefT(c) { return c === 1 ? '' : c === -1 ? '-' : String(c); }
  function pickVar(r) { return r.pick(['x', 'x', 'x', 'a', 'm', 'y', 't', 'n']); }
  function vlist(arr) { return arr.filter(function (v, i) { return arr.indexOf(v) === i; }).sort(); }
  var NAMES = { 2: 'twice', 3: 'three times', 4: 'four times', 5: 'five times', 6: 'six times', 7: 'seven times', 8: 'eight times', 9: 'nine times', 10: 'ten times', 12: 'twelve times' };

  /* ======================================================================================================
   * Rational expressions as products of atoms
   *   atom: C(c) a constant · Mo(c, v, e) a monomial · A(a, b, v) the binomial a·v + b · Q(p) a polynomial with no linear factor
   *   canon(lists…, dens…): constant, monomial exponents and linear factors (normalized: a > 0, content 1) with signed counts
   * ====================================================================================================== */
  function C(c) { return { k: 'c', c: R(c) }; }
  function Mo(c, v, e, w, f) { var m = {}; m[v] = e == null ? 1 : e; if (w) m[w] = f == null ? 1 : f; return { k: 'm', c: R(c), m: m }; }
  function A(a, b, v) { return { k: 'l', a: a, b: b, v: v || 'x' }; }
  function Q(p) { return { k: 'p', p: p }; }
  function atomPoly(at) {
    if (at.k === 'c') return P.num(at.c);
    if (at.k === 'm') return P.mono(at.c, at.m);
    if (at.k === 'l') return lin(at.a, at.b, at.v);
    return at.p;
  }
  function listPoly(list) { return list.reduce(function (acc, at) { return P.mul(acc, atomPoly(at)); }, P.num(1)); }
  function blank() { return { c: [1, 1], m: {}, f: {}, q: {} }; }
  function put(acc, list, s) {
    list.forEach(function (at) {
      if (at.k === 'c') { acc.c = s > 0 ? qm(acc.c, at.c) : qd(acc.c, at.c); return; }
      if (at.k === 'm') { acc.c = s > 0 ? qm(acc.c, at.c) : qd(acc.c, at.c); Object.keys(at.m).forEach(function (v) { acc.m[v] = (acc.m[v] || 0) + s * at.m[v]; }); return; }
      if (at.k === 'l') {
        if (at.b === 0) { acc.c = s > 0 ? qm(acc.c, [at.a, 1]) : qd(acc.c, [at.a, 1]); acc.m[at.v] = (acc.m[at.v] || 0) + s; return; }
        var g = gcd(at.a, at.b) * (at.a < 0 ? -1 : 1), a = at.a / g, b = at.b / g, key = at.v + ':' + a + ':' + b;
        acc.c = s > 0 ? qm(acc.c, [g, 1]) : qd(acc.c, [g, 1]);
        if (!acc.f[key]) acc.f[key] = { a: a, b: b, v: at.v, n: 0 };
        acc.f[key].n += s; return;
      }
      var kq = tx(at.p); if (!acc.q[kq]) acc.q[kq] = { p: at.p, n: 0 }; acc.q[kq].n += s;
    });
    return acc;
  }
  function canon(nums, dens) { var acc = blank(); (nums || []).forEach(function (l) { put(acc, l, 1); }); (dens || []).forEach(function (l) { put(acc, l, -1); }); return acc; }
  function facPoly(f) { return lin(f.a, f.b, f.v); }
  function fkeys(cn) { return Object.keys(cn.f).sort(function (x, y) { var a = cn.f[x], b = cn.f[y]; return a.v < b.v ? -1 : a.v > b.v ? 1 : (a.a - b.a) || (b.b - a.b); }); }
  /* one side of a fraction: integer coefficient, monomial, factors with positive counts (s = +1 numerator, −1 denominator) */
  function side(cn, s) {
    var co = Math.abs(s > 0 ? cn.c[0] : cn.c[1]), mono = {}, facs = [];
    Object.keys(cn.m).forEach(function (v) { var e = cn.m[v] * s; if (e > 0) mono[v] = e; });
    fkeys(cn).forEach(function (k) { var f = cn.f[k], n = f.n * s; if (n > 0) facs.push({ p: facPoly(f), n: n }); });
    Object.keys(cn.q).forEach(function (k) { var q = cn.q[k], n = q.n * s; if (n > 0) facs.push({ p: q.p, n: n }); });
    return { co: co, mono: mono, facs: facs };
  }
  function sidePoly(sd) { var p = P.mono(sd.co, sd.mono); sd.facs.forEach(function (f) { p = P.mul(p, P.pow(f.p, f.n)); }); return p; }
  function sideTex(sd) {
    var mt = P.monoTex(sd.mono);
    if (!sd.facs.length) return (sd.co === 1 && mt ? '' : String(sd.co)) + mt;
    if (sd.facs.length === 1 && sd.facs[0].n === 1 && sd.co === 1 && !mt) return tx(sd.facs[0].p);
    return (sd.co === 1 ? '' : String(sd.co)) + mt + sd.facs.map(function (f) { return '(' + tx(f.p) + ')' + (f.n > 1 ? '^{' + f.n + '}' : ''); }).join('');
  }
  function bare(sd) { return sd.facs.length === 1 && sd.facs[0].n === 1 && sd.co === 1 && !P.monoTex(sd.mono); }
  function trivial(sd) { return !sd.facs.length && sd.co === 1 && !P.monoTex(sd.mono); }
  /* LaTeX of a canon (one fraction, sign in front) */
  function cTex(cn) {
    if (cn.c[0] === 0) return '0';
    var neg = cn.c[0] < 0, n = side(cn, 1), d = side(cn, -1);
    if (trivial(d)) return neg ? (bare(n) ? '-(' + sideTex(n) + ')' : '-' + sideTex(n)) : sideTex(n);
    return (neg ? '-' : '') + '\\frac{' + sideTex(n) + '}{' + sideTex(d) + '}';
  }
  function cPolys(cn) { if (cn.c[0] === 0) return { N: P.num(0), D: P.num(1) }; var N = sidePoly(side(cn, 1)), D = sidePoly(side(cn, -1)); if (cn.c[0] < 0) N = P.neg(N); return { N: N, D: D }; }
  function cNeg(cn) { var o = JSON.parse(JSON.stringify(cn)); o.c = [-o.c[0], o.c[1]]; return o; }
  function cSame(a, b) { var A1 = cPolys(a), B1 = cPolys(b); return P.eq(P.mul(A1.N, B1.D), P.mul(B1.N, A1.D)); }
  /* a list written for the factored step of a solution: −3(m − 4), x(x + 4), (x − 6)(x + 6) */
  function facTex(list) { var cn = canon([list]), sd = side(cn, 1), st = sideTex(sd); if (cn.c[0] >= 0) return st; return bare(sd) ? '-(' + st + ')' : '-' + st; }
  function fracF(nl, dl) { var d = facTex(dl); return dl.length ? '\\frac{' + facTex(nl) + '}{' + d + '}' : facTex(nl); }
  /* a list written as the problem shows it: expanded, descending (asc: ascending, for 12 − 3m) */
  function polyT(list, asc) { var p = listPoly(list); return asc ? txa(p) : tx(p); }
  function fracE(nl, dl, o) { o = o || {}; if (!dl || !dl.length) return o.paren ? '(' + polyT(nl, o.an) + ')' : polyT(nl, o.an); return '\\frac{' + polyT(nl, o.an) + '}{' + polyT(dl, o.ad) + '}'; }

  /* NPVs of the denominators (lists of atoms): { v: [values] } */
  function npvOf(lists) {
    var o = {};
    lists.forEach(function (l) { l.forEach(function (at) {
      if (at.k === 'm') Object.keys(at.m).forEach(function (v) { if (at.m[v] > 0) { o[v] = o[v] || []; o[v].push([0, 1]); } });
      if (at.k === 'l') { o[at.v] = o[at.v] || []; o[at.v].push(ex.norm(-at.b, at.a)); }
    }); });
    Object.keys(o).forEach(function (v) { o[v] = uniqR(o[v]); });
    return o;
  }
  function npvMerge() { var o = {}; for (var i = 0; i < arguments.length; i++) { var a = arguments[i]; Object.keys(a).forEach(function (v) { o[v] = uniqR((o[v] || []).concat(a[v])); }); } return o; }
  function npvTex(o) {
    var vs = Object.keys(o).filter(function (v) { return o[v].length; }).sort();
    if (!vs.length) return '\\text{none}';
    return vs.map(function (v) { return v + '\\ne ' + o[v].map(rt).join(',\\ '); }).join(',\\ ');
  }
  function npvEq(a, b) { var vs = vlist(Object.keys(a).concat(Object.keys(b))); return vs.every(function (v) { var x = a[v] || [], y = b[v] || []; return x.length === y.length && x.every(function (z) { return has(y, z); }); }); }

  /* ======================================================================================================
   * Checking a rational expression: value at six points, then form
   * ====================================================================================================== */
  var PTS = [1.37, -2.29, 3.61, 0.43, -0.77, 2.93, -3.47, 4.19, 1.83, -1.21];
  function astVars(a, acc) { acc = acc || {}; (function w(x) { if (!x || typeof x !== 'object') return; if (x.t === 'var') acc[x.n] = 1; ['a', 'b', 'n'].forEach(function (k) { if (x[k] && typeof x[k] === 'object') w(x[k]); }); })(a); return Object.keys(acc); }
  function hasVar(x) { if (!x || typeof x !== 'object') return false; if (x.t === 'var') return true; return hasVar(x.a) || hasVar(x.b); }
  function hasVarDiv(x) { if (!x || typeof x !== 'object') return false; if (x.t === 'div' && hasVar(x.b)) return true; return hasVarDiv(x.a) || hasVarDiv(x.b); }
  function hasDiv(x) { if (!x || typeof x !== 'object') return false; if (x.t === 'div') return true; return hasDiv(x.a) || hasDiv(x.b); }
  function envs(vars, D) {
    var out = [];
    for (var i = 0; out.length < 6 && i < 40; i++) {
      var env = {}; vars.forEach(function (v, j) { env[v] = PTS[(i + 3 * j) % PTS.length] + 0.011 * i; });
      var d = P.at(D, env); if (isFinite(d) && Math.abs(d) > 1e-6) out.push(env);
    }
    return out;
  }
  function polyOK(a) {
    while (a.t === 'paren') a = a.a;
    if (a.t === 'neg') return polyOK(a.a);
    if (a.t === 'mul' || (a.t === 'div' && !hasVar(a.b))) return polyOK(a.a) && polyOK(a.b);
    if (a.t === 'pow') { var b = a.a; while (b.t === 'paren') b = b.a; if (b.t === 'add' || b.t === 'sub') { var e = ex.rat(a.b); return !!e && e[1] === 1 && e[0] > 0 && polyOK(b); } }
    return P.formIssue(a) == null;
  }
  function content(p) { return P.terms(p).reduce(function (g, tm) { return tm.c[1] !== 1 ? -1 : g < 0 ? g : gcd(g, tm.c[0]); }, 0); }
  var RH = {
    single: 'Right value — now write it as a <b>single fraction</b> over the common denominator.',
    lowest: 'Right value, but it is not in lowest terms: the numerator and the denominator still share a factor. Factor both fully and divide out the common factors.',
    reduce: 'Right value — now reduce: the numbers in the numerator and the denominator share a common factor.',
    tidy: 'Right value — now simplify the numerator and the denominator: multiply out or collect like terms (factored or expanded is fine).',
    decimal: 'That has decimals. Give the exact expression with integers (and fractions), not decimals.'
  };
  function ratForm(ast, T) {
    if (ex.shape(ast).decimals) return form('u6r-decimal', RH.decimal);
    var top = ast; while (top.t === 'paren' || top.t === 'neg') top = top.a;
    if (!hasVarDiv(ast)) {
      if (P.isZero(T.N)) return null;
      if (P.degree(T.D) > 0) return form('u6r-single', RH.single);
      if (!polyOK(top)) return form('u6r-tidy', RH.tidy);
      // one fraction over a number, e.g. (14x - 2)/20: the numerator and the number share no factor
      var fz0 = ex.factors(top); if (fz0.den.length && fz0.num.concat(fz0.den).every(function (x) { return !hasDiv(x); })) {
        var N0 = P.num(1), D0 = P.num(1);
        try { fz0.num.forEach(function (x) { N0 = P.mul(N0, P.read(x).p); }); fz0.den.forEach(function (x) { D0 = P.mul(D0, P.read(x).p); }); } catch (e) { return null; }
        var cN0 = content(N0), cD0 = content(D0);
        if (cN0 > 0 && cD0 > 0 && gcd(cN0, cD0) > 1) return form('u6r-reduce', RH.reduce);
      }
      return null;
    }
    var fz = ex.factors(top), all = fz.num.concat(fz.den);
    for (var i = 0; i < all.length; i++) { if (hasDiv(all[i]) && hasVarDiv(all[i])) return form('u6r-single', RH.single); if (all[i].t === 'add' || all[i].t === 'sub') { if (hasVarDiv(all[i])) return form('u6r-single', RH.single); } }
    for (var j = 0; j < all.length; j++) if (!polyOK(all[j])) return form(hasVarDiv(all[j]) ? 'u6r-single' : 'u6r-tidy', hasVarDiv(all[j]) ? RH.single : RH.tidy);
    var Nw = P.num(1), Dw = P.num(1);
    try { fz.num.forEach(function (x) { Nw = P.mul(Nw, P.read(x).p); }); fz.den.forEach(function (x) { Dw = P.mul(Dw, P.read(x).p); }); } catch (e) { return form('u6r-tidy', RH.tidy); }
    if (P.degree(Dw) > P.degree(T.D)) { var fl = form('u6r-lowest', RH.lowest); fl.degD = P.degree(Dw); return fl; }
    var cN = content(Nw), cD = content(Dw);
    if (cN < 0 || cD < 0) return form('u6r-tidy', 'Right value — now clear the fractions inside the numerator and the denominator, so it is one fraction with integer coefficients.');
    if (cN > 0 && gcd(cN, cD) > 1) return form('u6r-reduce', RH.reduce);
    return null;
  }
  /* the expression as given (the last \\( \\) of the prompt): how many fractions with a variable denominator, and the total
     degree of every denominator and divisor's numerator — an answer that is the question typed back is not "right value,
     wrong form" */
  function countVarDiv(a) { var n = 0; (function w(x) { if (!x || typeof x !== 'object') return; if (x.t === 'div' && hasVar(x.b)) n++; w(x.a); w(x.b); })(a); return n; }
  function origInfo(prompt) {
    var m = String(prompt || '').match(/\\\(([^]*?)\\\)/g); if (!m) return null;
    var q = ex.parse(m[m.length - 1].slice(2, -2)); if (!q.ok) return null;
    var deg = 0;
    (function w(x) { if (!x || typeof x !== 'object') return; if (x.t === 'div' && hasVar(x.b)) { var b = x.b; while (b.t === 'paren') b = b.a; if (b.t === 'div') { var rn = P.read(b.a); if (rn.ok) deg += P.degree(rn.p); w(b.b); } else { var rd = P.read(b); if (rd.ok) deg += P.degree(rd.p); } } w(x.a); w(x.b); })(q.ast);
    return { divs: countVarDiv(q.ast), degD: deg };
  }
  RH.asis = 'That is the expression as it was given. Carry out the operation and simplify it.';
  /* T: { N, D } (lowest terms); opt.dl: [{ N, D, code, hint }] known wrong values; opt.vars: letters allowed; opt.orig: origInfo */
  function ratCheck(T, opt) {
    opt = opt || {};
    var vars = vlist(P.vars(T.N).concat(P.vars(T.D)).concat(opt.vars || [])), E = envs(vars, T.D);
    var tv = E.map(function (e) { return P.at(T.N, e) / P.at(T.D, e); });
    function vals(N, D) { return E.map(function (e) { return P.at(N, e) / P.at(D, e); }); }
    function same(a, b) { return a.every(function (x, i) { return isFinite(x) && isFinite(b[i]) && ex.eq(x, b[i], 1e-7); }); }
    var dl = (opt.dl || []).map(function (d) { return { v: vals(d.N, d.D), code: d.code, hint: d.hint }; }).filter(function (d) { return d.v.every(isFinite) && !same(d.v, tv); });
    return function (resp) {
      var a = K.read(resp); if (a.res) return a.res;
      var used = astVars(a.ast), extra = used.filter(function (v) { return vars.indexOf(v) < 0; });
      if (extra.length) return wrong('value', 'Use only the letter' + (vars.length > 1 ? 's ' : ' ') + vars.map(function (v) { return t(v); }).join(', ') + ' (you wrote ' + t(extra[0]) + ').');
      var sv = E.map(function (e) { return ex.value(a.ast, e); });
      if (same(sv, tv)) {
        var f = ratForm(a.ast, T), O = opt.orig;
        if (f && O && (f.code === 'u6r-single' || f.code === 'u6r-lowest')) {
          if (O.divs >= 2 && countVarDiv(a.ast) >= O.divs) return wrong('value', RH.asis);
          if (f.code === 'u6r-lowest' && f.degD >= O.degD) return O.divs >= 2 ? wrong((opt.cp || '') + 'nocancel', 'Now divide out the common factors: the numerator and the denominator share factors (factor both fully first).') : wrong('value', RH.asis);
        }
        return f || ok();
      }
      for (var i = 0; i < dl.length; i++) if (same(sv, dl[i].v)) return wrong(dl[i].code, dl[i].hint);
      if (same(sv, tv.map(function (x) { return -x; }))) return wrong(opt.cp ? opt.cp + 'opp-sign' : 'sign', 'Check the sign: your answer is the opposite of the right one. Look for opposite factors such as ' + t('(a-b)') + ' and ' + t('(b-a)') + ', and for a minus sign in front of a fraction.');
      return wrong('value', null);
    };
  }

  /* ---------- NPVs: "x ≠ 3, -2", "3, -2", "x ≠ ±4", "m ≠ 0, n ≠ 0", "none" ---------- */
  function npvParse(resp, dv) {
    var s = String(resp == null ? '' : resp).replace(/\\(left|right)/g, '').replace(/\\(text|mathrm|textrm|operatorname)\{([^{}]*)\}/g, ' $2 ').replace(/\\[ ,;:!]|~|\\quad|\\qquad/g, ' ');
    if (/^\s*$/.test(s)) return { empty: true };
    if (/^\s*(none|no(ne)?\s*(npvs?|restrictions?|non-?\s*permissible\s*values?|values?)?|nonpvs|\\emptyset|\\varnothing|∅)\s*\.?\s*$/i.test(s.replace(/\s+/g, ' ').trim()) || /^none$/i.test(s.replace(/[\s.]/g, ''))) return { map: {} };
    s = s.replace(/\\neq?(?![a-z])|≠|!=|=\/=|<>/g, '≠').replace(/\b(and|or)\b/gi, ',').replace(/;/g, ',').replace(/\\pm|±/g, '±');
    s = s.replace(/((?:[a-zA-Z]\s*,\s*)+[a-zA-Z])\s*≠\s*([^,]+)/g, function (all, ls, val) { return ls.split(',').map(function (l) { return l.trim() + '≠' + val; }).join(','); }); // the booklet's "a, b ≠ 0"
    var pieces = s.split(','), map = {}, cur = dv, any = false;
    for (var i = 0; i < pieces.length; i++) {
      var p = pieces[i].replace(/\s+/g, ''); if (!p) continue;
      var m = /^([a-zA-Z])≠(.*)$/.exec(p);
      if (m) { cur = m[1]; p = m[2]; } else if (p.indexOf('≠') >= 0 || /=/.test(p)) return { bad: true };
      if (!p) return { bad: true };
      var pm = p.charAt(0) === '±'; if (pm) p = p.slice(1);
      if (/\\times|\\cdot|[×*+]/.test(p) || /[0-9a-zA-Z})]\s*[-−]/.test(p)) return { unsimp: true };
      var r = ex.parse(p); if (!r.ok || hasVar(r.ast)) return { bad: true };
      var val = ex.value(r.ast); if (!isFinite(val)) return { bad: true };
      map[cur] = map[cur] || []; map[cur].push(val); if (pm) map[cur].push(-val); any = true;
    }
    if (!any) return { bad: true };
    return { map: map };
  }
  function npvCheck(T, cp, opt) {
    opt = opt || {};
    var vs = Object.keys(T).filter(function (v) { return T[v].length; }), dv = opt.v || vs[0] || 'x';
    var TT = {}; vs.forEach(function (v) { TT[v] = T[v].map(rv); });
    var wr = (opt.wrongs || []).filter(function (w) { return !npvEq(w.vals, T); });
    function eqMap(A, B) { var ks = vlist(Object.keys(A).concat(Object.keys(B))); return ks.every(function (v) { var x = A[v] || [], y = B[v] || []; return x.every(function (z) { return has(y, z); }) && y.every(function (z) { return has(x, z); }); }); }
    return function (resp) {
      var L = npvParse(resp, dv);
      if (L.empty) return form('empty', 'State the non-permissible values (or write “none”).');
      if (L.unsimp) return form('simplify', 'Write each NPV as a single number (no ' + t('\\times') + ', + or − between numbers).');
      if (L.bad) return form('unreadable', 'Write the NPVs like ' + t(dv + '\\ne 3,\\ -2') + ' (or ' + t(dv + '\\ne\\pm 4') + '), or “none” if there are none.');
      var Am = L.map;
      if (eqMap(Am, TT)) return ok();
      var ks = Object.keys(Am);
      if (vs.length === 1 && ks.length === 1 && ks[0] !== vs[0] && eqMap({ x: Am[ks[0]] }, { x: TT[vs[0]] })) return form('u6r-npvletter', 'Right values — but the variable here is ' + t(vs[0]) + '.');
      for (var i = 0; i < wr.length; i++) { var W = {}; Object.keys(wr[i].vals).forEach(function (v) { W[v] = wr[i].vals[v].map(rv); }); if (eqMap(Am, W)) return wrong(wr[i].code, wr[i].hint); }
      if (!vs.length) return wrong(cp + 'npv-extra', 'Check each denominator: a denominator with no variable, or one like ' + t(dv + '^{2}+4') + ' that is never ' + t(0) + ', gives no NPVs.');
      var all = vlist(ks.concat(vs)), miss = 0, extra = 0, negd = true;
      all.forEach(function (v) { var x = Am[v] || [], y = TT[v] || []; y.forEach(function (z) { if (!has(x, z)) miss++; }); x.forEach(function (z) { if (!has(y, z)) extra++; if (!has(y, -z)) negd = false; }); if (x.length !== y.length) negd = false; });
      if (negd && extra) return wrong(cp + 'npv-sign', 'Check the signs: ' + t(dv + '-3=0') + ' gives ' + t(dv + '=3') + ', so the NPV is ' + t(dv + '\\ne 3') + '.');
      if (miss && !extra) return wrong(cp + 'npv-missing', 'You are missing ' + (miss === 1 ? 'an NPV' : miss + ' NPVs') + '. Factor every denominator fully: each factor with a variable gives an NPV.');
      if (extra && !miss) return wrong(cp + 'npv-extra', 'You have ' + (extra === 1 ? 'a value that is not an NPV' : 'values that are not NPVs') + '. Only the denominators matter: a numerator equal to ' + t(0) + ' is allowed.');
      return wrong('value', 'Set each factor of each denominator equal to ' + t(0) + ' and solve.');
    };
  }

  /* ---------- keypads ---------- */
  var W = HW.widgets;
  if (W && W.KEYSETS) {
    var d = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
    var KY = {
      del: { label: '⌫', fn: 'del', title: 'Delete' }, clear: { label: 'clear', fn: 'clear' }, enter: { label: 'Check ↵', fn: 'enter', wide: true },
      left: { label: '◀', fn: 'left', title: 'Move left' }, right: { label: '▶', fn: 'right', title: 'Move right (out of a box)' },
      plus: { label: '+', tex: '+', plain: '+' }, minus: { label: '−', tex: '-', plain: '-' }, dot: { label: '.', tex: '.', plain: '.' },
      sq: { label: 'x<sup>2</sup>', tex: '^{2}', plain: '^2', title: 'Squared' }, pow: { label: 'x<sup>n</sup>', tex: '#@^{#?}', plain: '^', title: 'Exponent' },
      frac: { label: '<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#@}{#?}', plain: '/', title: 'Fraction' }, par: { label: '( )', tex: '\\left(#0\\right)', plain: '(', title: 'Brackets' },
      comma: { label: ',', tex: ',', plain: ', ' }, ne: { label: '≠', tex: '\\ne ', plain: ' != ', title: 'is not equal to' }, pm: { label: '±', tex: '\\pm ', plain: '±' },
      sqrt: { label: '√', tex: '\\sqrt{#0}', plain: 'sqrt(' }, none: { label: 'none', tex: '\\text{none}', plain: 'none', title: 'There are none' },
      undef: { label: 'undef.', tex: '\\text{undefined}', plain: 'undefined', title: 'Undefined' }, nosol: { label: 'no sol.', tex: '\\text{no solution}', plain: 'no solution', title: 'No solution' }
    };
    var vk = function (opt, n) { return (opt && opt.vars && opt.vars.length ? opt.vars : ['x']).slice(0, n).map(function (v) { return { label: '<i>' + v + '</i>', tex: v, plain: v }; }); };
    W.KEYSETS.u6rat = function (opt) { return [[d(7), d(8), d(9), KY.plus, KY.minus, KY.del], [d(4), d(5), d(6), KY.sq, KY.pow, KY.clear], [d(1), d(2), d(3), KY.frac, KY.left, KY.right], [d(0), KY.dot, KY.par, KY.comma, KY.ne, KY.enter], vk(opt, 6)]; };
    W.KEYSETS.u6npv = function (opt) { return [[d(7), d(8), d(9), KY.frac, KY.del], [d(4), d(5), d(6), KY.minus, KY.clear], [d(1), d(2), d(3), KY.pm, KY.left, KY.right], [d(0), KY.comma, KY.ne, KY.none, KY.enter], vk(opt, 3)]; };
    W.KEYSETS.u6num = function () { return [[d(7), d(8), d(9), KY.frac, KY.del], [d(4), d(5), d(6), KY.minus, KY.clear], [d(1), d(2), d(3), KY.left, KY.right], [d(0), KY.dot, KY.undef, KY.enter]]; };
    W.KEYSETS.u6sol = function (opt) { var v = (opt && opt.vars && opt.vars[0]) || 'x'; return [[d(7), d(8), d(9), KY.frac, KY.del], [d(4), d(5), d(6), KY.sqrt, KY.clear], [d(1), d(2), d(3), KY.minus, KY.left, KY.right], [d(0), KY.dot, { label: '<i>' + v + '</i> =', tex: v + '=', plain: v + ' = ' }, KY.comma, KY.pm, KY.nosol, KY.enter]]; };
    if (W.KEYHELP) {
      W.KEYHELP.u6rat = ['Use the <b>fraction</b> key for a fraction and <b>( )</b> for factors; press <b>▶</b> to step out of a box. NPVs: <b>≠</b> and commas, e.g. x ≠ 3, −2 (or <b>none</b>).', 'Type fractions with <code>/</code> and brackets, e.g. <code>(x+3)/(x(x-2))</code>. NPVs: <code>x != 3, -2</code> or <code>none</code>.'];
      W.KEYHELP.u6npv = ['Write the NPVs with <b>≠</b> and commas, e.g. x ≠ 3, −2, or press <b>none</b>.', 'Type e.g. <code>x != 3, -2</code> (or just <code>3, -2</code>), or <code>none</code>.'];
      W.KEYHELP.u6sol = ['Write each root as <b>x =</b> …, separated by commas, or press <b>no sol.</b>', 'Type e.g. <code>x = 3, x = -5</code> or <code>no solution</code>.'];
    }
  }

  /* ---------- parts ---------- */
  /* "Simplify. State the NPVs." — two boxes. T: canon of the answer; npv: { v: [vals] }; o.dl expression wrongs [{ cn, code, hint }];
     o.nw NPV wrongs [{ vals, code, hint }] */
  function simpPart(cp, prompt, T, npv, o, sol, hints, text) {
    o = o || {};
    var TP = cPolys(T), vars = vlist(P.vars(TP.N).concat(P.vars(TP.D)).concat(Object.keys(npv)).concat(o.vars || []));
    var dl = (o.dl || []).filter(function (w) { return w && w.cn && !cSame(w.cn, T); });
    var c1 = ratCheck(TP, { cp: cp, vars: vars, orig: origInfo(prompt), dl: dl.map(function (w) { var q = cPolys(w.cn); return { N: q.N, D: q.D, code: w.code, hint: w.hint }; }) });
    var nw = (o.nw || []).filter(function (w) { return w && !npvEq(w.vals, npv); });
    var c2 = npvCheck(npv, cp, { v: vars[0], wrongs: nw });
    var key = [o.keyTex || cTex(T), npvTex(npv)];
    var check = function (resp) {
      resp = Array.isArray(resp) ? resp : [resp, ''];
      var r1 = c1(resp[0] == null ? '' : resp[0]), r2 = c2(resp[1] == null ? '' : resp[1]);
      if (r1.v === 'correct' && r2.v === 'correct') return ok();
      var h1 = '<b>Simplified:</b> ' + (r1.hint || 'Check the simplifying again.'), h2 = '<b>NPVs:</b> ' + (r2.hint || 'Check the NPVs again.');
      if (r1.v === 'wrong' && r2.v === 'wrong') return wrong('value', h1 + '<br>' + h2);
      if (r1.v === 'wrong') return r2.v === 'correct' ? wrong(r1.code, h1) : wrong(r1.code, h1 + '<br>' + h2);
      if (r2.v === 'wrong') return wrong(r2.code === 'value' ? cp + 'npv-wrong' : r2.code, h2);
      if (r1.v === 'form') return { v: 'form', code: r1.code, hint: h1 };
      if (r2.code === 'empty') return wrong(cp + 'npv-wrong', h2);
      return { v: 'form', code: r2.code, hint: h2 };
    };
    var p = { prompt: big(prompt), input: { type: 'fields', fields: [{ label: 'Simplified:', mode: 'math', keys: 'u6rat', vars: vars, name: 'Simplified', placeholder: 'e.g. (x+3)/(x(x-2))' }, { label: 'NPVs:', mode: 'math', keys: 'u6rat', vars: vars, none: true, name: 'NPVs', placeholder: 'e.g. ' + vars[0] + ' ≠ 3, −2' }] },
      check: check, key: key, answer: t(key[0]) + ', \\(' + key[1] + '\\)', solution: sol, hints: hints || [], text: text };
    var bad = [];
    dl.forEach(function (w) { bad.push([cTex(w.cn), key[1]]); });
    nw.forEach(function (w) { bad.push([key[0], npvTex(w.vals)]); });
    bad.push([key[0], '\\text{none}'].map(function (b, i) { return i === 1 && key[1] === '\\text{none}' ? vars[0] + '\\ne 0' : b; }));
    p.bad = bad.filter(function (b, i, arr) { return arr.map(JSON.stringify).indexOf(JSON.stringify(b)) === i && JSON.stringify(b) !== JSON.stringify(key); });
    return p;
  }
  /* one rational-expression box (no NPVs asked) */
  function ratPart(cp, prompt, T, o, sol, hints, text) {
    o = o || {};
    var TP = cPolys(T), vars = vlist(P.vars(TP.N).concat(P.vars(TP.D)).concat(o.vars || []));
    var dl = (o.dl || []).filter(function (w) { return w && w.cn && !cSame(w.cn, T); });
    var p = KP.math(big(prompt), ratCheck(TP, { cp: cp, vars: vars, dl: dl.map(function (w) { var q = cPolys(w.cn); return { N: q.N, D: q.D, code: w.code, hint: w.hint }; }) }), cTex(T), sol, hints, text, { keys: 'u6rat', vars: vars, before: o.before, placeholder: 'e.g. (x+3)/(x(x-2))' });
    p.bad = dl.map(function (w) { return cTex(w.cn); }).filter(function (b, i, arr) { return arr.indexOf(b) === i; });
    return p;
  }
  function npvPart(cp, prompt, npv, o, sol, hints, text) {
    o = o || {};
    var vs = Object.keys(npv), v = o.v || vs[0] || 'x', nw = (o.nw || []).filter(function (w) { return w && !npvEq(w.vals, npv); });
    var p = KP.math(big(prompt), npvCheck(npv, cp, { v: v, wrongs: nw }), npvTex(npv), sol, hints, text, { keys: 'u6npv', vars: vlist([v].concat(vs)), placeholder: 'e.g. ' + v + ' ≠ 3, −2  (or: none)' });
    p.bad = nw.map(function (w) { return npvTex(w.vals); }).concat(npvTex(npv) === '\\text{none}' ? [v + '\\ne 0'] : ['\\text{none}']).filter(function (b, i, arr) { return arr.indexOf(b) === i && b !== npvTex(npv); });
    return p;
  }

  /* ---------- roots: "x = a, x = b", ± allowed, exact radicals, or "no solution" ---------- */
  function isNone(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\(text|mathrm|textrm)\{([^{}]*)\}/g, '$2').replace(/\\[ ,;:!]|~|\s+/g, '').toLowerCase();
    return /^(no(real)?(solutions?|roots?)|nosol\.?(ution)?s?|none|thereisnosolution|\\emptyset|\\varnothing|∅|\{\}|\\\{\\\})\.?$/.test(s);
  }
  function expandPm(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\text\{\s*(or|and)\s*\}/gi, ',').replace(/\b(or|and)\b/gi, ',').replace(/;/g, ',').replace(/\\pm/g, '±');
    return s.split(',').map(function (p) { var i = p.indexOf('±'); if (i <= 0 || /^\s*[a-zA-Z]\s*=\s*$/.test(p.slice(0, i))) return p; return p.slice(0, i) + '+' + p.slice(i + 1) + ',' + p.slice(0, i) + '-' + p.slice(i + 1); }).join(',');
  }
  function radForm(resp) {
    var s = String(resp || '').replace(/(?:\\sqrt|sqrt|√)\s*\(?\s*(\d+)\s*\)?/g, '\\sqrt{$1}'), m, re = /\\sqrt\{(\d+)\}/g;
    while ((m = re.exec(s))) { var n = Number(m[1]); if (n > 1 && !ex.simplest(n, 2)) return form('u6r-radical', 'Right roots — now write each radical in simplest form (take the largest perfect square out of ' + t('\\sqrt{' + n + '}') + ').'); }
    var f = /\\frac\{(-?\d+)(?:[+-]|\\pm\s*|±)(\d*)\\sqrt\{\d+\}\}\{(\d+)\}/g;
    while ((m = f.exec(s))) { var g = gcd(gcd(Number(m[1]), Number(m[2] || 1)), Number(m[3])); if (g > 1) return form('u6r-radical', 'Right roots — now reduce: every term of the numerator and the denominator share the factor ' + t(g) + '.'); }
    return null;
  }
  /* vals: roots (numbers or [p, q]); o.extr: extraneous roots; o.wrongs: [{ vals, code, hint }]; o.v; o.radical: exact radical roots (numbers) with keyTex */
  function rootsPart(cp, prompt, vals, o, sol, hints, text) {
    o = o || {};
    var v = o.v || 'x', T = vals.map(rv), extr = (o.extr || []).map(rv).filter(function (e) { return !T.some(function (x) { return Math.abs(x - e) < 1e-9; }); });
    function same(W, A) { return W.length === A.length && W.every(function (x) { return A.some(function (y) { return Math.abs(x - y) < 1e-7; }); }); }
    var wrongs = (o.wrongs || []).filter(function (w) { var Wv = w.vals.map(rv); return !same(Wv, T) || !same(T, Wv); });
    var extrHint = o.extrHint || 'Check every root against the NPVs: ' + (extr.length ? t(v + '=' + fr(Math.round(extr[0] * 1e6), 1e6)) + ' is a non-permissible value (it makes a denominator ' + t(0) + '), so it is extraneous' : 'one of your roots does not check') + '.';
    var inner = T.length ? K.valueSet(o.exact || vals.map(R), { v: v, diag: function (Av, TT) {
      for (var i = 0; i < wrongs.length; i++) { var Wv = wrongs[i].vals.map(rv); if (same(Wv, Av) && same(Av, Wv)) return { code: wrongs[i].code, hint: wrongs[i].hint }; }
      var extra = Av.filter(function (x) { return !TT.some(function (y) { return Math.abs(x - y) < 1e-7; }); }), miss = TT.filter(function (x) { return !Av.some(function (y) { return Math.abs(x - y) < 1e-7; }); });
      if (extra.length && !miss.length && extr.length && extra.every(function (x) { return extr.some(function (y) { return Math.abs(x - y) < 1e-7; }); })) return { code: cp + 'eq-extr', hint: extrHint };
      if (miss.length && !extra.length) return TT.length > 1 && o.bothValid ? { code: cp + 'eq-rejvalid', hint: 'Check the root you left out: it is not an NPV and it checks in the original equation, so keep it.' } : { code: cp + 'eq-missing', hint: 'There is another root: the quadratic has two roots. Keep every root that is not an NPV.' };
      if (Av.length === TT.length && Av.every(function (x) { return TT.some(function (y) { return Math.abs(x + y) < 1e-7; }); })) return { code: cp + 'eq-sign', hint: 'Check the signs of your roots: substitute them into the original equation.' };
      return null;
    } }) : null;
    var check = function (resp) {
      if (isNone(resp)) return T.length ? wrong(cp + 'eq-nosol', o.noneHint || 'There is a solution: solve, then check that your root is not an NPV.') : ok();
      var s = expandPm(resp);
      if (!T.length) {
        var res = K.valueSet(extr.length ? extr : [987654.321], { v: v })(s);
        if (res.v === 'form') return res;
        if (extr.length && res.v === 'correct') return wrong(cp + 'eq-extr', extrHint + ' There is no solution.');
        for (var i = 0; i < wrongs.length; i++) { var rw = K.valueSet(wrongs[i].vals.map(R), { v: v })(s); if (rw.v === 'correct') return wrong(wrongs[i].code, wrongs[i].hint); }
        return wrong('value', 'Substitute your value into the original equation: it does not check.');
      }
      var r0 = inner(s);
      if (r0.v === 'correct' && o.radical) return radForm(resp) || r0;
      if (r0.v === 'wrong' && o.radical) {
        var ds = s.split(',').map(function (pc) { var q = ex.parse(pc.replace(/^\s*[a-zA-Z]\s*=\s*/, '')); return q.ok ? ex.value(q.ast) : NaN; });
        if (ds.length === T.length && ds.every(function (x) { return T.some(function (y) { return Math.abs(x - y) < 0.011; }); }) && /\d\.\d/.test(s)) return form('decimal', 'Those are decimal approximations. Give the <b>exact</b> roots in simplest radical form.');
      }
      return r0;
    };
    var keyTex = o.keyTex || (vals.length ? vals.map(function (x) { return v + '=' + rt(x); }).join(',\\ ') : '\\text{no solution}');
    var part = KP.math(big(prompt), check, keyTex, sol, hints, text, { keys: 'u6sol', vars: [v], placeholder: 'e.g. ' + v + ' = 3, ' + v + ' = -5   (or: no solution)' });
    function setTex(arr) { return arr.length ? arr.map(function (x) { return v + '=' + rt(x); }).join(',\\ ') : '\\text{no solution}'; }
    var bad = [];
    if (extr.length) bad.push(setTex(vals.concat(o.extr.filter(function (e) { return !has(vals, e); }))));
    wrongs.forEach(function (w) { if (w.vals.every(function (x) { return Array.isArray(x) || Number.isInteger(x); })) bad.push(setTex(w.vals)); });
    if (vals.length) bad.push('\\text{no solution}');
    part.bad = bad.filter(function (b, i, arr) { return arr.indexOf(b) === i && b !== keyTex; });
    return part;
  }
  function big(s) { return String(s).replace(/\\frac\{/g, '\\dfrac{'); } // prompts: fractions at full size (like the booklet's \dfrac)

  var B = {};

  /* ======================================================================================================
   * Sums: the LCD, each numerator times its multiplier, the reduced result (univariate)
   * ====================================================================================================== */
  function mon(v, e) { var o = {}; if (e) o[v] = e; return o; }
  function divLin(N, a, b, v) {
    var deg = P.degreeIn(N, v), cs = [], r0 = ex.norm(-b, a), acc = [0, 1], out = [];
    for (var e = deg; e >= 0; e--) cs.push(P.coef(N, mon(v, e)));
    cs.forEach(function (c) { acc = qa(qm(acc, r0), c); out.push(acc); });
    out.pop();
    var q = P.num(0); out.forEach(function (c, i) { q = P.add(q, P.mono(qd(c, [a, 1]), mon(v, deg - 1 - i))); });
    return q;
  }
  function divMono(N, v, k) { var o = P.num(0); P.terms(N).forEach(function (tm) { var vv = {}; Object.keys(tm.v).forEach(function (x) { vv[x] = tm.v[x]; }); vv[v] = (vv[v] || 0) - k; o = P.add(o, P.mono(tm.c, vv)); }); return o; }
  function lcdOf(dfs) {
    var lc = blank(); lc.c = [1, 1];
    dfs.forEach(function (df) {
      var cd = canon([df]); lc.c = [lcm(lc.c[0], cd.c[0]), 1];
      Object.keys(cd.m).forEach(function (v) { lc.m[v] = Math.max(lc.m[v] || 0, cd.m[v]); });
      Object.keys(cd.f).forEach(function (k) { if (!lc.f[k]) lc.f[k] = { a: cd.f[k].a, b: cd.f[k].b, v: cd.f[k].v, n: 0 }; lc.f[k].n = Math.max(lc.f[k].n, cd.f[k].n); });
      Object.keys(cd.q).forEach(function (k) { if (!lc.q[k]) lc.q[k] = { p: cd.q[k].p, n: 0 }; lc.q[k].n = Math.max(lc.q[k].n, cd.q[k].n); });
    });
    return lc;
  }
  function cDiv(a, b) { // canon a / canon b (b's factors all in a)
    var o = JSON.parse(JSON.stringify(a)); o.c = qd(a.c, b.c);
    Object.keys(b.m).forEach(function (v) { o.m[v] = (o.m[v] || 0) - b.m[v]; });
    Object.keys(b.f).forEach(function (k) { if (!o.f[k]) o.f[k] = JSON.parse(JSON.stringify(b.f[k])), o.f[k].n = 0; o.f[k].n -= b.f[k].n; });
    Object.keys(b.q).forEach(function (k) { if (!o.q[k]) o.q[k] = { p: b.q[k].p, n: 0 }; o.q[k].n -= b.q[k].n; });
    return o;
  }
  function cPoly1(cn) { var q = cPolys(cn); return q.N; } // a canon with no denominator
  /* a + or − outside every bracket (after the first character): the piece must be bracketed after a minus sign */
  function topSum(s) { var d = 0; for (var i = 0; i < s.length; i++) { var c = s.charAt(i); if (c === '(' || c === '{') d++; else if (c === ')' || c === '}') d--; else if (i > 0 && d === 0 && (c === '+' || c === '-')) return true; } return false; }
  function wrapM(s) { return /^[^()]*[+-]/.test(s.replace(/^-/, '')) ? '(' + s + ')' : s; }
  /* one numerator times its multiplier, written for a solution: 3(x-2), (x+1)(x+4), 2x(x-4), 5 */
  function prodT(numPoly, mult) {
    var nt = tx(numPoly), mt = mult;
    if (mt === '1') return nt;
    var mp = /^-?\d*[a-z]?(\^\{\d+\})?$/.test(mt) && !/[+]/.test(mt);
    if (P.count(numPoly) === 1 && !P.vars(numPoly).length) { var c = P.constant(numPoly)[0]; if (mp) return tx(P.mul(numPoly, P.parse(mt))); return c === 1 ? mt : (c === -1 ? '-' + wrapM(mt) : c + '(' + mt + ')'); }
    if (!mp && P.count(numPoly) === 1) return nt + '(' + mt.replace(/^\((.*)\)$/, '$1') + ')';
    return (mp ? (mt === '-1' ? '-' : mt) : wrapM(mt)) + (P.count(numPoly) > 1 || mp ? '(' + nt + ')' : nt);
  }
  /* terms: [{ s: ±1, nf: atoms, df: atoms }] → { lcd, N0 (numerator over the LCD), T (reduced canon), steps } */
  function sumOf(terms, v) {
    var lc = lcdOf(terms.map(function (tm) { return tm.df; })), N0 = P.num(0), pieces = [];
    terms.forEach(function (tm, i) {
      var cd = canon([tm.df]), mc = cDiv(lc, cd), mpoly = cPoly1(mc), np = listPoly(tm.nf), sd = side(mc, 1), mt = trivial(sd) ? '1' : sideTex(sd);
      N0 = P.add(N0, P.scale(P.mul(np, mpoly), tm.s));
      var pt = prodT(np, mt), neg = (tm.s < 0) !== (mc.c[0] < 0); // a negative multiplier (an opposite factor) flips the sign
      if (pt.charAt(0) === '-' && !topSum(pt)) { pt = pt.slice(1); neg = !neg; }
      if (neg && topSum(pt)) pt = '(' + pt + ')';
      pieces.push({ neg: neg, t: pt });
    });
    var stepNum = pieces.map(function (pc, i) { return i === 0 ? (pc.neg ? '-' : '') + pc.t : (pc.neg ? '-' : '+') + (pc.t.charAt(0) === '-' ? '(' + pc.t + ')' : pc.t); }).join('');
    // reduce N0 / lc
    var N = N0, D = JSON.parse(JSON.stringify(lc)), cut = false;
    Object.keys(D.m).forEach(function (x) { var e = D.m[x]; if (e <= 0) return; var k = Math.min.apply(null, P.terms(N).map(function (tm) { return tm.v[x] || 0; })); k = Math.min(k, e); if (k > 0) { N = divMono(N, x, k); D.m[x] -= k; cut = true; } });
    Object.keys(D.f).forEach(function (k) { var f = D.f[k]; while (f.n > 0 && P.atExact(N, (function () { var o = {}; o[f.v] = ex.norm(-f.b, f.a); return o; })())[0] === 0 && !P.isZero(N)) { N = divLin(N, f.a, f.b, f.v); f.n--; cut = true; } });
    var res = blank(); res.c = qd([1, 1], D.c); res.m = {}; Object.keys(D.m).forEach(function (x) { if (D.m[x]) res.m[x] = -D.m[x]; });
    Object.keys(D.f).forEach(function (k) { if (D.f[k].n) { res.f[k] = JSON.parse(JSON.stringify(D.f[k])); res.f[k].n = -D.f[k].n; } });
    Object.keys(D.q).forEach(function (k) { if (D.q[k].n) res.q[k] = { p: D.q[k].p, n: -D.q[k].n }; });
    // numerator: constant, monomial, linear or a polynomial
    var ts = P.terms(N), num;
    if (!ts.length) num = [C(0)];
    else if (ts.length === 1) num = [{ k: 'm', c: ts[0].c, m: ts[0].v }];
    else if (P.degree(N) === 1 && P.vars(N).length === 1) { var vv = P.vars(N)[0], c1 = P.coef(N, mon(vv, 1)), c0 = P.constant(N), dd = lcm(c1[1], c0[1]); num = [C([1, dd]), A(c1[0] * dd / c1[1], c0[0] * dd / c0[1], vv)]; }
    else { var cc = content(N), lead = P.lead(N)[0] < 0 ? -1 : 1, g = cc > 0 ? cc * lead : lead; num = [C(g), Q(P.scale(N, [1, g]))]; }
    put(res, num, 1);
    // a polynomial numerator that is a multiple of a remaining factor cannot happen (reduced above)
    var lcdT = sideTex(side(lc, 1));
    return { lcd: lc, lcdT: lcdT, N0: N0, T: res, cut: cut, stepNum: stepNum, step: '\\frac{' + stepNum + '}{' + lcdT + '}', mid: '\\frac{' + tx(N0) + '}{' + lcdT + '}' };
  }
  function termsTex(terms) {
    return terms.map(function (tm, i) { var body = tm.df.length ? fracE(tm.nf, tm.df, tm.o) : polyT(tm.nf, tm.o && tm.o.an); return (tm.s < 0 ? '-' : i === 0 ? '' : '+') + body; }).join('');
  }
  function sumKey(S) { var q = cPolys(S.T), sd = side(S.T, -1); if (trivial(sd)) return cTex(S.T); var N = q.N; if (P.lead(N)[0] < 0 && P.terms(N).some(function (tm) { return tm.c[0] > 0; })) return '\\frac{' + txa(N) + '}{' + sideTex(sd) + '}'; return cTex(S.T); }
  function sumSol(terms, S, npv, o) {
    o = o || {};
    var facd = terms.some(function (tm) { return tm.df.length && facTex(tm.df) !== polyT(tm.df, tm.o && tm.o.ad); });
    var s = '';
    if (facd) s += 'Factor the denominators: ' + t(terms.map(function (tm, i) { return (tm.s < 0 ? '-' : i === 0 ? '' : '+') + (tm.df.length ? '\\frac{' + polyT(tm.nf, tm.o && tm.o.an) + '}{' + facTex(tm.df) + '}' : polyT(tm.nf)); }).join('')) + '.<br>';
    s += 'NPVs: ' + t(npvTex(npv)) + '. The LCD is ' + t(S.lcdT) + '.<br>';
    var key = sumKey(S);
    var chain = [S.step]; if (S.mid !== S.step) chain.push(S.mid);
    if (S.cut) s += t(chain.join('=')) + '. Factor the numerator and divide out the common factor: ' + t(key) + '.';
    else { if (key !== S.mid) chain.push(key); s += t(chain.join('=')) + '.'; }
    return s;
  }

  /* ======================================================================================================
   * Equations: multiply every term by the LCD, solve the polynomial equation, reject NPVs
   * ====================================================================================================== */
  function quadRoots(E, v) {
    var a = P.coef(E, mon(v, 2)), b = P.coef(E, mon(v, 1)), c = P.constant(E);
    var deg = P.degreeIn(E, v);
    if (deg <= 0) return { deg: deg, roots: [], zero: P.isZero(E) };
    if (deg === 1) return { deg: 1, roots: [qd([-c[0], c[1]], b)] };
    var A2 = rv(a), B1 = rv(b), C0 = rv(c), D = B1 * B1 - 4 * A2 * C0;
    if (D < -1e-12) return { deg: 2, roots: [], neg: true, disc: D };
    // integer coefficients assumed (E is cleared of fractions)
    var Ai = Math.round(A2), Bi = Math.round(B1), Ci = Math.round(C0), Di = Bi * Bi - 4 * Ai * Ci, s = Math.round(Math.sqrt(Di));
    if (s * s === Di) return { deg: 2, roots: uniqR([ex.norm(-Bi + s, 2 * Ai), ex.norm(-Bi - s, 2 * Ai)]), disc: Di };
    return { deg: 2, roots: [], irr: true, a: Ai, b: Bi, c: Ci, disc: Di };
  }
  /* factored form of an integer quadratic or linear E with rational roots: 2(x+4)(x-2), (x-3)^2 */
  function facE(E, roots, v) {
    var lead = P.lead(E)[0], list = [], dd = 1;
    roots.forEach(function (x) { x = R(x); list.push(lin(x[1], -x[0], v)); dd *= x[1]; });
    if (roots.length === 1 && P.degreeIn(E, v) === 2) { var x0 = R(roots[0]); list.push(lin(x0[1], -x0[0], v)); dd *= x0[1]; }
    var k = lead / dd, out = list.map(function (p) { return '(' + tx(p) + ')'; });
    if (out.length === 2 && out[0] === out[1]) out = [out[0] + '^{2}'];
    return (k === 1 ? '' : k === -1 ? '-' : String(k)) + out.join('');
  }
  function eqParts(L, Rr, v) {
    var all = L.concat(Rr), lc = lcdOf(all.map(function (tm) { return tm.df; })), lcdT = sideTex(side(lc, 1));
    function sideP(list) {
      var p = P.num(0), pcs = [];
      list.forEach(function (tm, i) {
        var cd = canon([tm.df]), mc = cDiv(lc, cd), mp = cPoly1(mc), np = listPoly(tm.nf), pr = P.mul(np, mp), sd = side(mc, 1), hasBin = sd.facs.length > 0;
        p = P.add(p, P.scale(pr, tm.s));
        var mt = trivial(sd) ? '1' : sideTex(sd), neg = (tm.s < 0) !== (mc.c[0] < 0);
        var pt = hasBin ? prodT(np, mt) : tx(mc.c[0] < 0 ? P.neg(pr) : pr);
        if (pt.charAt(0) === '-' && !topSum(pt)) { pt = pt.slice(1); neg = !neg; }
        else if (!hasBin && pt.charAt(0) === '-') { neg = !neg; pt = tx(mc.c[0] < 0 ? pr : P.neg(pr)); }
        if (neg && topSum(pt)) pt = '(' + pt + ')';
        pcs.push((i === 0 ? (neg ? '-' : '') : (neg ? '-' : '+')) + pt);
      });
      return { p: p, t: pcs.join('') || '0' };
    }
    var Ls = sideP(L), Rs = sideP(Rr), E = P.sub(Ls.p, Rs.p);
    var npv = npvOf(all.map(function (tm) { return tm.df; }));
    return { lc: lc, lcdT: lcdT, Ls: Ls, Rs: Rs, E: E, npv: npv };
  }
  function eqTex(L, Rr) { return termsTex(L) + '=' + termsTex(Rr); }
  function stdForm(E, v) { var lead = P.lead(E)[0]; return lead < 0 ? P.neg(E) : E; }
  /* the worked solution of an equation; returns { sol, roots (valid), extr, E, info } */
  function eqWork(L, Rr, v, o) {
    o = o || {};
    var q = eqParts(L, Rr, v), Es = stdForm(q.E, v), info = quadRoots(Es, v), npvs = q.npv[v] || [];
    var all = info.roots, valid = all.filter(function (x) { return !has(npvs, x); }), extr = all.filter(function (x) { return has(npvs, x); });
    var s = 'NPVs: ' + t(npvTex(q.npv)) + '.';
    var lcIsOne = q.lcdT === '1';
    if (o.cross) s += ' Cross-multiply: ' + t(q.Ls.t + '=' + q.Rs.t) + '.';
    else if (!lcIsOne) s += ' Multiply every term by the LCD ' + t(q.lcdT) + ': ' + t(q.Ls.t + '=' + q.Rs.t) + '.';
    var Lx = tx(q.Ls.p), Rx = tx(q.Rs.p);
    if (Lx + '=' + Rx !== q.Ls.t + '=' + q.Rs.t) s += '<br>' + t(Lx + '=' + Rx);
    if (info.deg === 1) { s += (Lx + '=' + Rx !== q.Ls.t + '=' + q.Rs.t ? ', so ' : '<br>') + t(v + '=' + rt(all[0])) + '.'; }
    else if (info.deg === 2) {
      s += '<br>' + t(tx(Es) + '=0');
      if (info.roots.length) s += ', ' + t(facE(Es, info.roots, v) + '=0') + ', so ' + info.roots.map(function (x) { return t(v + '=' + rt(x)); }).join(' or ') + '.';
      else if (info.irr) s += '. It does not factor: ' + t(v + '=\\frac{' + (-info.b) + '\\pm\\sqrt{' + info.disc + '}}{' + 2 * info.a + '}') + '.';
      else if (info.neg) s += '. The discriminant is ' + t(info.disc) + ' < 0: no real roots.';
    } else s += '<br>This is never true: there is no root.';
    if (extr.length) s += '<br>' + extr.map(function (x) { return t(v + '=' + rt(x)); }).join(' and ') + (extr.length > 1 ? ' are NPVs' : ' is an NPV') + ': reject ' + (extr.length > 1 ? 'them' : 'it') + ' (extraneous).';
    if (info.roots.length || info.deg === 1) s += '<br>' + (valid.length ? (valid.length > 1 ? 'The solutions are ' : 'The solution is ') + valid.map(function (x) { return t(v + '=' + rt(x)); }).join(' and ') + '.' : 'No solution.');
    return { sol: s, roots: valid, extr: extr, E: Es, info: info, q: q };
  }
  function vals1(L, Rr, v, x) { // numeric check: both sides at x
    function side1(list) { return list.reduce(function (s, tm) { var env = {}; env[v] = x; var d = tm.df.length ? P.at(listPoly(tm.df), env) : 1; return s + tm.s * P.at(listPoly(tm.nf), env) / d; }, 0); }
    return [side1(L), side1(Rr)];
  }
  function T1(s, nf, df, o) { return { s: s, nf: nf, df: df || [], o: o }; }

  /* ======================================================================================================
   * AN4 — Lesson 1: NPVs, evaluating; Lesson 2: simplifying
   * ====================================================================================================== */
  function npvSolList(dl, npv, v, asc) {
    var ft = facTex(dl), terms = dl.filter(function (at) { return at.k === 'l' || at.k === 'm'; });
    if (!terms.length) return 'The denominator ' + t(polyT(dl)) + ' is never ' + t(0) + ': no NPVs.';
    if (dl.length === 1 && dl[0].k === 'l') return 'Set the denominator equal to ' + t(0) + ': ' + t(polyT(dl, asc) + '=0\\Rightarrow ' + v + '=' + rt(npv[v][0])) + '. NPVs: ' + t(npvTex(npv)) + '.';
    return 'Set the denominator equal to ' + t(0) + (ft !== polyT(dl) ? ' and factor' : '') + ': ' + t(ft + '=0') + '. NPVs: ' + t(npvTex(npv)) + '.';
  }
  /* the NPVs of one expression (L1 Ex 4–6, #5–8). mode 'lin': a monomial or linear denominator (or none);
     'fac': factor the denominator first; 'two': two fractions */
  B.npv = function (r, cp, o) {
    o = o || {};
    var mode = o.mode || 'lin', v = pickVar(r), nl, dl, npv, nw = [], sol, an = false, ad = false, extraT = '';
    function numFor(avoid) { return pickWhere(function () { return A(r.int(1, 4), nz(r, 1, 9), v); }, function (at) { return gcd(at.a, at.b) === 1 && !has(avoid, ex.norm(-at.b, at.a)); }); }
    if (mode === 'lin') {
      var kind = o.kind || r.pick(['mono', 'lin', 'lin', 'rev', 'none']);
      if (kind === 'mono') { dl = [Mo(r.int(2, 12), v, r.int(1, 3))]; nl = r.chance(0.5) ? [C(nz(r, 2, 15))] : [numFor([[0, 1]])]; }
      else if (kind === 'lin' || kind === 'rev') {
        var den = pickWhere(function () { return { a: r.pick([1, 1, 2, 3, 4, 5, 7]), b: nz(r, 1, 12) }; }, function (z) { return gcd(z.a, z.b) === 1 && !(z.a === 1 && Math.abs(z.b) === 8 && v === 'y'); });
        dl = kind === 'rev' ? [A(-den.a, Math.abs(den.b), v)] : [A(den.a, den.b, v)]; ad = kind === 'rev';
        nl = r.chance(0.3) ? [C(nz(r, 2, 11))] : [numFor([ex.norm(-dl[0].b, dl[0].a)])];
      } else {
        dl = r.chance(0.5) ? [C(r.int(5, 20))] : [Q(P.add(M(1, v, 2), P.num(r.pick([1, 4, 9, 16, 25, 3, 5]))))];
        nl = r.chance(0.5) ? [Mo(r.int(1, 6), v, 1)] : [Q(P.add(M(1, v, 2), P.num(r.int(1, 9))))];
      }
    } else if (mode === 'fac') {
      var fk = o.kind || r.pick(['tri', 'dos', 'gcf', 'a', 'sq', 'cubic']), z;
      if (fk === 'tri') { z = pickWhere(function () { return [nz(r, 1, 9), nz(r, 1, 9)]; }, function (q) { return q[0] !== q[1] && q[0] + q[1] !== 0 && Math.abs(q[0] * q[1]) <= 60; }); dl = [A(1, z[0], v), A(1, z[1], v)]; }
      else if (fk === 'dos') { z = pickWhere(function () { return [r.pick([1, 1, 2, 3, 4, 5]), r.int(1, 11)]; }, function (q) { return gcd(q[0], q[1]) === 1; }); dl = r.chance(0.3) ? [A(-z[0], z[1], v), A(z[0], z[1], v)] : [A(z[0], -z[1], v), A(z[0], z[1], v)]; ad = dl[0].a < 0; }
      else if (fk === 'gcf') { z = [r.int(2, 6), nz(r, 1, 9)]; dl = [Mo(z[0], v, 1), A(1, z[1], v)]; }
      else if (fk === 'a') { z = pickWhere(function () { return [r.int(2, 5), nz(r, 1, 7), nz(r, 1, 7)]; }, function (q) { return gcd(q[0], q[1]) === 1 && q[0] * q[2] !== -q[1] && Math.abs(q[0] * q[2] + q[1]) <= 20 && Math.abs(q[1] * q[2]) <= 30; }); dl = [A(z[0], z[1], v), A(1, z[2], v)]; }
      else if (fk === 'sq') { z = pickWhere(function () { return [r.pick([1, 1, 2, 3]), nz(r, 1, 7)]; }, function (q) { return gcd(q[0], q[1]) === 1; }); dl = [A(z[0], z[1], v), A(z[0], z[1], v)]; }
      else { if (r.chance(0.5)) { z = r.int(1, 7); dl = [Mo(1, v, 1), A(1, -z, v), A(1, z, v)]; } else { z = pickWhere(function () { return [r.int(2, 4), nz(r, 1, 7), nz(r, 1, 7)]; }, function (q) { return q[1] !== q[2] && q[1] + q[2] !== 0; }); dl = [C(z[0]), A(1, z[1], v), A(1, z[2], v)]; } }
      var zs = npvOf([dl])[v] || [];
      nl = r.chance(0.35) && dl.some(function (at) { return at.k === 'l'; }) ? [dl.filter(function (at) { return at.k === 'l'; })[0]] : [numFor(zs)];
    } else {
      var p = nz(r, 1, 9), q2 = pickWhere(function () { return nz(r, 1, 9); }, function (q) { return q !== p; }), num1 = r.int(1, 7);
      var L1 = [C(num1)], D1 = [A(1, p, v)], L2 = [Mo(1, v, 1)], D2 = [Mo(1, v, 1), A(1, q2, v)];
      npv = npvOf([D1, D2]);
      var op = r.chance(0.5) ? '-' : '+';
      nw.push({ vals: npvOf([D1]), code: cp + 'npv-one', hint: 'Every denominator gives NPVs: ' + t(polyT(D2) + '=' + facTex(D2)) + ' gives more.' });
      nw.push({ vals: npvOf([D1, [A(1, q2, v)]]), code: cp + 'npv-cancel', hint: 'Do not divide out first: the NPVs come from the denominators as written. ' + t(facTex(D2) + '=0') + ' gives ' + t(v + '=0') + ' too.' });
      sol = 'Every denominator gives NPVs: ' + t(polyT(D1) + '=0') + ' and ' + t(facTex(D2) + '=0') + '. NPVs: ' + t(npvTex(npv)) + '.';
      return npvPart(cp, 'State the non-permissible values of ' + t(fracE(L1, D1) + op + fracE(L2, D2)) + '.', npv, { v: v, nw: nw }, sol,
        ['Factor each denominator fully.', 'Each factor with a variable, in either denominator, gives an NPV.'], 'NPVs of a sum');
    }
    npv = npvOf([dl]);
    // the numerator's zeros instead of (or as well as) the denominator's
    var nz0 = npvOf([nl.filter(function (at) { return at.k === 'l'; })])[v] || [];
    if (nz0.length) { var wv = {}; wv[v] = uniqR(nz0.concat(npv[v] || [])); nw.push({ vals: wv, code: cp + 'npv-num', hint: 'Only the denominator matters: a numerator equal to ' + t(0) + ' is allowed (the value is ' + t(0) + ').' }); }
    if (nl.length === 1 && nl[0].k === 'l' && dl.some(function (at) { return at.k === 'l' && at.a === nl[0].a && at.b === nl[0].b; })) {
      var rest = dl.filter(function (at, i) { return !(at.k === 'l' && at.a === nl[0].a && at.b === nl[0].b && i === dl.indexOf(nl[0])); }), rv0 = npvOf([rest]);
      var only = dl.filter(function (at) { return !(at.k === 'l' && at.a === nl[0].a && at.b === nl[0].b); });
      if (!npvEq(npvOf([only]), npv)) nw.push({ vals: npvOf([only]), code: cp + 'npv-cancel', hint: 'Ignore the numerator, even when it shares a factor with the denominator: the expression is still undefined where that factor is ' + t(0) + '.' });
      void rv0;
    }
    sol = npvSolList(dl, npv, v, ad) + extraT;
    return npvPart(cp, 'State the non-permissible values of ' + t(fracE(nl, dl, { an: an, ad: ad })) + '.', npv, { v: v, nw: nw }, sol,
      ['Only the denominator matters. ' + (mode === 'fac' ? 'Factor it fully first.' : 'Set it equal to ' + t(0) + ' and solve.'), 'Each factor with a variable gives an NPV. A denominator that is never ' + t(0) + ' gives none.'], mode === 'fac' ? 'NPVs: factor the denominator' : 'NPVs');
  };

  /* evaluate an expression at a value, or say it is undefined (L1 Ex 2, #2) */
  B.evalAt = function (r, cp) {
    var v = pickVar(r), s = pickWhere(function () {
      var kind = r.pick(['A', 'B']), x0 = nz(r, 1, 6), undef = r.chance(0.3), z;
      if (kind === 'A') { var b = nz(r, 1, 7), c = r.int(1, 4), dd = undef ? -c * x0 : nz(r, 1, 9); z = { nl: [Mo(1, v, 1), A(1, b, v)], dl: [A(c, dd, v)] }; }
      else { var a = r.int(1, 5), b2 = nz(r, 1, 6), c2 = undef ? -x0 : nz(r, 1, 6); z = { nl: [A(a, b2, v)], dl: [Mo(1, v, 1), A(1, c2, v)] }; }
      z.x0 = x0; z.undef = undef; return z;
    }, function (z) {
      var env = {}; env[z.x0 === 0 ? 'q' : v] = z.x0; var D0 = P.atExact(listPoly(z.dl), env), N0 = P.atExact(listPoly(z.nl), env);
      z.D0 = D0; z.N0 = N0; if (D0[0] === 0) return z.undef; if (z.undef) return false;
      var val = qd(N0, D0); z.val = val; return Math.abs(val[0]) <= 200 && val[1] <= 60 && N0[0] !== 0 && !(val[1] === 1 && Math.abs(val[0]) === 1 && r.chance(0.5));
    });
    var Nn = listPoly(s.nl), Dd = listPoly(s.dl), env1 = {}; env1[v] = s.x0;
    function sub(p) { return P.sorted(p).map(function (tm, i) { var e = tm.v[v] || 0, c = tm.c[0]; var xx = Math.abs(c) === 1 ? par(s.x0) : '(' + s.x0 + ')', body = e === 0 ? String(Math.abs(c)) : (Math.abs(c) === 1 ? '' : Math.abs(c)) + (e === 1 ? xx : par(s.x0) + '^{' + e + '}'); return (c < 0 ? '-' : i ? '+' : '') + body; }).join(''); }
    var subT = '\\frac{' + sub(Nn) + '}{' + sub(Dd) + '}=\\frac{' + rt(s.N0) + '}{' + rt(s.D0) + '}';
    var sol = 'Substitute ' + t(v + '=' + s.x0) + ': ' + (s.undef ? t(subT) + '. The denominator is ' + t(0) + ', so the expression is <b>undefined</b> at ' + t(v + '=' + s.x0) + ' (it is an NPV).' : t(subT + (s.val[1] === s.D0[1] && s.val[0] === s.N0[0] ? '' : '=' + rt(s.val))) + '.');
    var other = (function () { var e2 = {}; e2[v] = -s.x0; var d2 = P.atExact(Dd, e2); return d2[0] === 0 ? null : qd(P.atExact(Nn, e2), d2); })();
    var check = function (resp) {
      var raw = String(resp == null ? '' : resp).replace(/\\[a-zA-Z]+/g, function (m) { return /^\\(text|mathrm|textrm|operatorname)$/.test(m) ? ' ' : m; }).replace(/[{}\\\s]/g, '').toLowerCase();
      if (/undef|notdefined|novalue|dne|doesnotexist|nosolution|cannot/.test(raw)) return s.undef ? ok() : wrong(cp + 'ev-undef', 'It is defined here: the denominator is ' + t(rt(s.D0)) + ', not ' + t(0) + '. Simplify the numerator and the denominator separately.');
      if (s.undef) { var rd = K.read(resp); if (rd.res) return rd.res; return wrong(cp + 'ev-undef', 'Check the denominator at ' + t(v + '=' + s.x0) + ': it is ' + t(0) + ', so the expression has no value there.'); }
      return K.value(s.val, { diag: function (val) { if (other && s.x0 < 0 && ex.eq(val, rv(other))) return { code: cp + 'ev-slip', hint: 'Check the signs when you substitute ' + t(v + '=' + s.x0) + ': use brackets, e.g. ' + t('(' + s.x0 + ')^{2}') + '.' }; return null; } })(resp);
    };
    var key = s.undef ? '\\text{undefined}' : rt(s.val);
    var p = KP.math(big('Evaluate ' + t(fracE(s.nl, s.dl)) + ' for ' + t(v + '=' + s.x0) + '. If it is undefined, say so.'), check, key, sol,
      ['Substitute, then work out the numerator and the denominator separately.', 'A denominator of ' + t(0) + ' means the expression is undefined; a numerator of ' + t(0) + ' is fine.'], 'evaluate a rational expression', { keys: 'u6num', placeholder: 'e.g. -7/8  (or: undefined)' });
    p.bad = s.undef ? ['0', rt(s.N0)] : ['\\text{undefined}'].concat(other && s.x0 < 0 && rv(other) !== rv(s.val) ? [rt(other)] : []);
    return p;
  };

  /* an NPV and k given: the other NPV (L1 Ex 7e, #18) */
  B.npvK = function (r, cp) {
    var v = 'x', s = pickWhere(function () { return { a: r.pick([1, 1, 2, 3]), r1: nz(r, 1, 7), m: nz(r, 1, 9), c0: r.pick([1, 2, 3, 4, 5]) }; }, function (z) {
      var s2 = ex.norm(z.m, z.a); if (s2[1] !== z.a) return false; if (rv(s2) === z.r1) return false;
      var k = -(z.a * z.r1 + z.m), q = z.r1 * z.m; return k !== 0 && Math.abs(k) <= 15 && Math.abs(q) <= 40 && !(z.a === 1 && z.r1 * z.m === 18 && z.r1 === 3);
    });
    var k = -(s.a * s.r1 + s.m), q = s.r1 * s.m, other = ex.norm(s.m, s.a);
    var den = coefT(s.a) + v + '^{2}+k' + v + sg(q), Dp = P.add(M(s.a, v, 2), M(k, v, 1), P.num(q));
    var sol = t(v + '=' + s.r1) + ' makes the denominator ' + t(0) + ': ' + t(coefT(s.a) + '(' + s.r1 + ')^{2}+' + par(s.r1) + 'k' + sg(q) + '=0') + ', so ' + t((s.a * s.r1 * s.r1 + q) + (s.r1 === 1 ? '+' : s.r1 === -1 ? '-' : sg(s.r1)) + 'k=0') + ' and ' + t('k=' + k) + '.<br>' + t(tx(Dp) + '=(' + tx(lin(1, -s.r1, v)) + ')(' + tx(lin(s.a, -s.m, v)) + ')') + '. The other NPV is ' + t(v + '=' + rt(other)) + '.';
    var p = KP.math(big('The expression ' + t('\\frac{' + s.c0 + '}{' + den + '}') + ' has a non-permissible value of ' + t(v + '=' + s.r1) + '. Determine the other non-permissible value.'),
      K.value(other, { diag: function (val) { if (ex.eq(val, k)) return { code: cp + 'gave-k', hint: 'That is ' + t('k') + '. Put ' + t('k') + ' back into the denominator, factor it, and find the other value that makes it ' + t(0) + '.' }; if (ex.eq(val, s.r1)) return { code: cp + 'gave-given', hint: 'That NPV was given. Find the other one.' }; if (ex.eq(val, -rv(other))) return { code: cp + 'k-sign', hint: 'Check the sign: the factor ' + t('(' + tx(lin(s.a, -s.m, v)) + ')') + ' is ' + t(0) + ' when ' + t(v + '=' + rt(other)) + '.' }; return null; } }),
      rt(other), sol, ['Substitute ' + t(v + '=' + s.r1) + ' into the denominator: it equals ' + t(0) + '. Solve for ' + t('k') + '.', 'Put ' + t('k') + ' back, factor the denominator, and read the other NPV.'], 'working backwards: the other NPV', { keys: 'u6num', before: v + '=' });
    p.bad = [String(k), String(s.r1)].concat(rv(other) !== 0 ? [rt([-other[0], other[1]])] : []).filter(function (b) { return b !== rt(other); });
    return p;
  };

  /* a quotient of monomials (L2 Ex 1, #1a–b) */
  B.simpMono = function (r, cp) {
    var two = r.chance(0.65), vs = two ? r.pick([['m', 'n'], ['x', 'y'], ['a', 'b']]) : [pickVar(r)];
    var s = pickWhere(function () {
      var g = r.int(2, 9), p = r.int(1, 9), q = r.int(1, 9), e1 = r.int(1, 6), e2 = r.int(1, 6), f1 = two ? r.int(0, 5) : 0, f2 = two ? r.int(1, 5) : 0;
      return { g: g, p: p, q: q, e1: e1, e2: e2, f1: f1, f2: f2, neg: r.chance(0.35) };
    }, function (z) { return gcd(z.p, z.q) === 1 && z.g * Math.max(z.p, z.q) <= 48 && z.e1 !== z.e2 && (!two || z.f1 !== z.f2) && z.p * z.q > 1 && !(z.g * z.p === 21 && z.g * z.q === 14); });
    var num = Mo((s.neg ? -1 : 1) * s.g * s.p, vs[0], s.e1, vs[1], s.f1), den = Mo(s.g * s.q, vs[0], s.e2, vs[1], s.f2);
    var T = canon([[num]], [[den]]), npv = npvOf([[den]]);
    var flip = JSON.parse(JSON.stringify(T)); Object.keys(flip.m).forEach(function (x) { flip.m[x] = Math.abs(flip.m[x]); });
    var inv = JSON.parse(JSON.stringify(T)); inv.c = ex.norm((s.neg ? -1 : 1) * s.q, s.p);
    var dl = [{ cn: flip, code: cp + 'mono-exp', hint: 'When the larger power is in the denominator, the leftover power stays in the denominator: ' + t('\\frac{x^{2}}{x^{5}}=\\frac{1}{x^{3}}') + '.' }];
    if (s.p !== s.q) dl.push({ cn: inv, code: cp + 'mono-coef', hint: 'Check the numbers: divide the numerator’s coefficient and the denominator’s coefficient by their GCF, ' + t(s.g) + ', and keep each in its place.' });
    var rem = {}; Object.keys(T.m).forEach(function (x) { if (T.m[x] < 0) { rem[x] = [[0, 1]]; } });
    var nw = npvEq(rem, npv) ? [] : [{ vals: rem, code: cp + 'npv-cancel', hint: 'The NPVs come from the <b>original</b> denominator ' + t(P.tex(atomPoly(den))) + ': every letter in it cannot be ' + t(0) + '.' }];
    var prompt = 'Simplify. State the non-permissible values. ' + t('\\frac{' + tx(atomPoly(num)) + '}{' + tx(atomPoly(den)) + '}');
    var sol = 'Divide the coefficients by their GCF ' + t(s.g) + ' and subtract the exponents of each letter: ' + t('\\frac{' + tx(atomPoly(num)) + '}{' + tx(atomPoly(den)) + '}=' + cTex(T)) + '.<br>NPVs (from the original denominator): ' + t(npvTex(npv)) + '.';
    return simpPart(cp, prompt, T, npv, { dl: dl, nw: nw, vars: vs }, sol, ['Divide the numbers by their greatest common factor; for each letter, subtract the smaller exponent from the larger and keep it where the larger one was.', 'Each letter in the original denominator gives an NPV: it cannot be ' + t(0) + '.'], 'simplify a monomial quotient');
  };

  /* simplify by factoring (L2 Ex 3–8, #3–6). mode 'gcf' | 'tri' | 'a' | 'opp' | 'cubic' */
  function distinct(r, n, hi, ok0) { return pickWhere(function () { var a = []; for (var i = 0; i < n; i++) a.push(nz(r, 1, hi)); return a; }, function (a) { return a.every(function (x, i) { return a.indexOf(x) === i; }) && (!ok0 || ok0(a)); }); }
  B.simpRat = function (r, cp, o) {
    o = o || {};
    var mode = o.mode || 'tri', v = pickVar(r), nl, dl, an = false, ad = false, kind;
    if (mode === 'gcf') {
      kind = r.pick(['g1', 'g2', 'g3']);
      if (kind === 'g1') { var p1 = nz(r, 1, 9), c1 = r.int(2, 9); nl = [C(c1), A(1, -p1, v)]; dl = [Mo(1, v, 1), A(1, -p1, v)]; }
      else if (kind === 'g2') { var p2 = r.int(1, 9), c2 = r.int(2, 7); nl = [A(1, -p2, v), A(1, p2, v)]; dl = [C(c2), A(1, (r.chance(0.5) ? 1 : -1) * p2, v)]; }
      else { var k3 = r.int(2, 6), a3 = r.int(2, 5), b3 = nz(r, 1, 7); if (gcd(a3, b3) > 1) b3 = b3 > 0 ? 1 : -1; nl = [Mo(k3, v, r.chance(0.3) ? 2 : 1), A(a3, b3, v)]; dl = [Mo(k3, v, 1)]; }
    } else if (mode === 'tri') {
      var z = distinct(r, 3, 9, function (a) { return Math.abs(a[0] * a[1]) <= 54 && Math.abs(a[1] * a[2]) <= 54; });
      nl = [A(1, z[0], v), A(1, z[1], v)]; dl = [A(1, z[1], v), A(1, z[2], v)];
      if (r.chance(0.25)) { dl = [A(1, z[1], v), A(1, z[1], v)]; } // a perfect-square denominator
    } else if (mode === 'a') {
      var s = pickWhere(function () { return { a: r.int(2, 4), b: nz(r, 1, 7), c: r.int(1, 3), d: nz(r, 1, 7), e: nz(r, 1, 7), common: r.pick(['mon', 'non']) }; }, function (q) { return gcd(q.a, q.b) === 1 && gcd(q.c, q.d) === 1 && q.b * 1 !== q.a * q.e && !(q.c === 1 && q.d === q.e) && Math.abs(q.a * q.e + q.b) <= 20 && Math.abs(q.c * q.e + q.d) <= 20 && q.a * q.e !== -q.b; });
      if (s.common === 'mon') { nl = [A(s.a, s.b, v), A(1, s.e, v)]; dl = [A(1, s.e, v), A(s.c, s.d, v)]; }
      else { nl = [A(s.a, s.b, v), A(1, s.e, v)]; dl = [A(s.a, s.b, v), A(s.c, s.d, v)]; if (s.c === 1 && s.d === s.e) dl = [A(s.a, s.b, v), A(2, s.d % 2 ? s.d : s.d + 1, v)]; }
    } else if (mode === 'opp') {
      kind = r.pick(['dos', 'tri', 'lin']);
      var p = r.int(1, 9), q = pickWhere(function () { return nz(r, 1, 9); }, function (x) { return Math.abs(x) !== p; });
      if (kind === 'dos') { nl = [A(-1, p, v), A(1, p, v)]; dl = [A(1, -p, v), A(1, q, v)]; an = true; }
      else if (kind === 'tri') { nl = [A(-1, p, v), A(1, q, v)]; dl = [A(1, -p, v), A(1, pickWhere(function () { return nz(r, 1, 9); }, function (x) { return x !== q && x !== -p; }), v)]; an = true; }
      else { var g = r.int(2, 7); nl = [C(g), A(1, -p, v)]; dl = [A(-1, p, v)]; ad = true; }
    } else {
      kind = r.pick(['xc', 'gc']);
      if (kind === 'xc') { var p5 = r.int(2, 7); nl = [Mo(1, v, 1), A(1, -p5, v), A(1, p5, v)]; dl = [Mo(1, v, 1), A(1, p5, v), A(1, p5, v)]; }
      else { var z5 = distinct(r, 3, 7), g1 = r.pick([2, 3]), g2 = g1 * r.pick([2, 3]); nl = [C(g1), A(1, z5[0], v), A(1, z5[1], v)]; dl = [C(g2), A(1, z5[2], v), A(1, z5[1], v)]; }
    }
    var T = canon([nl], [dl]), npv = npvOf([dl]);
    var simpD = []; (function () { var sd = side(T, -1); Object.keys(T.f).forEach(function (k) { if (T.f[k].n < 0) simpD.push(A(T.f[k].a, T.f[k].b, T.f[k].v)); }); Object.keys(T.m).forEach(function (x) { if (T.m[x] < 0) simpD.push(Mo(1, x, 1)); }); void sd; })();
    var nw = [{ vals: npvOf([simpD]), code: cp + 'npv-cancel', hint: 'State the NPVs from the <b>original</b> denominator ' + t(facTex(dl)) + ', before dividing out: a divided-out factor still cannot be ' + t(0) + '.' }];
    var dlw = [];
    if (mode === 'opp') dlw.push({ cn: cNeg(T), code: cp + 'opp-sign', hint: t('(a-b)') + ' and ' + t('(b-a)') + ' are opposites: ' + t('\\frac{a-b}{b-a}=-1') + '. Keep the ' + t('-1') + '.' });
    var prompt = 'Simplify. State the non-permissible values. ' + t(fracE(nl, dl, { an: an, ad: ad }));
    var sol = 'Factor: ' + t(fracE(nl, dl, { an: an, ad: ad }) + '=' + fracF(nl, dl)) + '.<br>NPVs (from the original denominator): ' + t(npvTex(npv)) + '.<br>Divide out the common factor' + (mode === 'opp' ? ' (an opposite pair gives ' + t('-1') + ')' : '') + ': ' + t(cTex(T)) + '.';
    return simpPart(cp, prompt, T, npv, { dl: dlw, nw: nw, vars: [v] }, sol, ['Factor the numerator and the denominator fully' + (mode === 'opp' ? ' (take out ' + t('-1') + ' to turn ' + t('(b-a)') + ' into ' + t('-(a-b)') + ')' : '') + '. State the NPVs before dividing anything out.', 'Divide out common <b>factors</b> only, never terms.'], mode === 'opp' ? 'simplify with opposite factors' : 'simplify by factoring');
  };

  /* the k that makes an expression simplify (L2 #9e, #19) */
  B.simpK = function (r, cp) {
    var v = 'x', s = pickWhere(function () { return { a: r.int(1, 4), m: nz(r, 1, 9), n: nz(r, 1, 7), dos: r.chance(0.5), u: nz(r, 1, 7) }; }, function (z) {
      if (gcd(z.a, z.m) !== 1 || (z.a === 1 && Math.abs(z.m) === Math.abs(z.n))) return false; if (!z.dos && (z.u === z.n || z.u === -z.n)) return false;
      if (z.a * z.n === z.m && z.a === 1) return false; var k = z.a * z.n + z.m; return k !== 0 && Math.abs(k) <= 25 && (z.a > 1 || r.chance(0.4)) && !(z.a === 2 && z.m === -3 && z.n === 4);
    });
    var other = s.dos ? -s.n : s.u, k = s.a * s.n + s.m, Np = P.mul(lin(s.a, s.m, v), lin(1, s.n, v)), Dp = P.mul(lin(1, s.n, v), lin(1, other, v));
    var c2 = P.coef(Np, mon(v, 2))[0], c0 = P.constant(Np)[0];
    var numT = coefT(c2) + v + '^{2}+k' + v + sg(c0);
    var kw = s.a * other + s.m;
    var sol = t(tx(Dp) + '=(' + tx(lin(1, s.n, v)) + ')(' + tx(lin(1, other, v)) + ')') + '. The answer keeps ' + t('(' + tx(lin(1, other, v)) + ')') + ', so ' + t('(' + tx(lin(1, s.n, v)) + ')') + ' was divided out: the numerator is ' + t('(' + tx(lin(s.a, s.m, v)) + ')(' + tx(lin(1, s.n, v)) + ')=' + tx(Np)) + '.<br>' + t('k=' + k) + '.';
    var p = KP.math(big('The expression ' + t('\\frac{' + numT + '}{' + tx(Dp) + '}') + ' simplifies to ' + t('\\frac{' + tx(lin(s.a, s.m, v)) + '}{' + tx(lin(1, other, v)) + '}') + '. Determine the value of ' + t('k') + '.'),
      K.value(k, { diag: function (val) { if (val === kw) return { code: cp + 'k-factor', hint: 'The factor that was divided out is the one that is <b>not</b> left in the answer’s denominator: ' + t('(' + tx(lin(1, s.n, v)) + ')') + '.' }; if (val === -k) return { code: cp + 'k-sign', hint: 'Check the signs when you expand ' + t('(' + tx(lin(s.a, s.m, v)) + ')(' + tx(lin(1, s.n, v)) + ')') + '.' }; return null; } }),
      String(k), sol, ['Factor the denominator. Which factor is missing from the simplified answer? That one was divided out.', 'The numerator is the answer’s numerator times that factor. Expand it and read the middle coefficient.'], 'working backwards: k', { keys: 'u6num', before: 'k=' });
    p.bad = [String(kw), String(-k)].filter(function (b) { return b !== String(k); });
    return p;
  };
  BASE['k-factor'] = ['Used the wrong factor of the denominator', 'b'];
  HW.addCodes({ 'u6t-k-factor': BASE['k-factor'][0], 'u6x-k-factor': BASE['k-factor'][0] }); HW.addPartial({ 'u6t-k-factor': 'b', 'u6x-k-factor': 'b' });

  /* ======================================================================================================
   * AN5 — Lessons 3–4: multiplying and dividing
   * ====================================================================================================== */
  function denAtoms(cn) { var out = []; Object.keys(cn.f).forEach(function (k) { if (cn.f[k].n < 0) out.push(A(cn.f[k].a, cn.f[k].b, cn.f[k].v)); }); Object.keys(cn.m).forEach(function (x) { if (cn.m[x] < 0) out.push(Mo(1, x, 1)); }); return out; }
  function cancelNW(cp, T, npv, why) { var w = npvOf([denAtoms(T)]); return npvEq(w, npv) ? [] : [{ vals: w, code: cp + 'npv-cancel', hint: why || 'State the NPVs from every <b>original</b> denominator before dividing out: a divided-out factor still cannot be ' + t(0) + '.' }]; }
  /* monomial fractions multiplied (L3 #2) */
  B.mulMono = function (r, cp) {
    var vs = r.pick([['a', 'b', 'c'], ['x', 'y', 'z'], ['m', 'n'], ['x', 'y']]);
    var s = pickWhere(function () {
      function ex3() { var o = {}; vs.forEach(function (v) { o[v] = r.int(0, 4); }); return o; }
      return { c: [nz(r, 2, 15), r.int(2, 15), r.int(2, 15), r.int(2, 15)], e: [ex3(), ex3(), ex3(), ex3()] };
    }, function (z) {
      var ok1 = [1, 3].every(function (i) { return vs.some(function (v) { return z.e[i][v] > 0; }); }) && [0, 2].every(function (i) { return vs.some(function (v) { return z.e[i][v] > 0; }); });
      var top = z.c[0] * z.c[2], bot = z.c[1] * z.c[3], g = gcd(top, bot);
      var net = vs.map(function (v) { return z.e[0][v] + z.e[2][v] - z.e[1][v] - z.e[3][v]; });
      return ok1 && Math.abs(z.c[0]) !== z.c[1] && z.c[2] !== z.c[3] && Math.abs(z.c[0]) !== z.c[3] && z.c[2] !== z.c[1] && g >= 6 && bot / g <= 30 && Math.abs(top / g) <= 30 && gcd(z.c[0], z.c[3]) > 1 && gcd(z.c[2], z.c[1]) > 1 && net.some(function (x) { return x < 0; }) && net.some(function (x) { return x > 0; }) && vs.every(function (v) { return z.e[0][v] + z.e[1][v] + z.e[2][v] + z.e[3][v] > 0; });
    });
    var mons = [0, 1, 2, 3].map(function (i) { return { k: 'm', c: [s.c[i], 1], m: s.e[i] }; });
    var T = canon([[mons[0]], [mons[2]]], [[mons[1]], [mons[3]]]), npv = npvOf([[mons[1]], [mons[3]]]);
    var flip = JSON.parse(JSON.stringify(T)); Object.keys(flip.m).forEach(function (x) { flip.m[x] = Math.abs(flip.m[x]); });
    var mt = function (i) { return tx(atomPoly(mons[i])); };
    var prompt = 'Simplify. State the non-permissible values. ' + t('\\frac{' + mt(0) + '}{' + mt(1) + '}\\cdot\\frac{' + mt(2) + '}{' + mt(3) + '}');
    var top = P.mul(atomPoly(mons[0]), atomPoly(mons[2])), bot = P.mul(atomPoly(mons[1]), atomPoly(mons[3]));
    var sol = 'NPVs: every letter in a denominator: ' + t(npvTex(npv)) + '.<br>' + t('=\\frac{' + tx(top) + '}{' + tx(bot) + '}=' + cTex(T)) + ' (divide the numbers by their GCF, subtract exponents).';
    return simpPart(cp, prompt, T, npv, { dl: [{ cn: flip, code: cp + 'mono-exp', hint: 'A larger power in the denominator leaves its extra factors in the denominator.' }], nw: cancelNW(cp, T, npv, 'The NPVs come from both <b>original</b> denominators: every letter in them cannot be ' + t(0) + '.'), vars: vs }, sol,
      ['Multiply the numerators and the denominators (or divide out common factors first).', 'Every letter in either denominator gives an NPV.'], 'multiply monomial fractions');
  };

  /* multiplying (L3 #3–6). mode 'bin' | 'tri' | 'opp' */
  function monics(r, n, hi, test) { return pickWhere(function () { var a = []; for (var i = 0; i < n; i++) a.push(nz(r, 1, hi)); return a; }, function (a) { return a.every(function (x, i) { return a.indexOf(x) === i; }) && (!test || test(a)); }); }
  function small2(a, b) { return Math.abs(a * b) <= 48 && Math.abs(a + b) <= 14; }
  B.mulRat = function (r, cp, o) {
    o = o || {};
    var mode = o.mode || 'tri', v = pickVar(r), n1, d1, n2, d2, k, oa = {}, ob = {};
    if (mode === 'bin') {
      k = r.pick(['A', 'B', 'C']);
      var z = monics(r, 2, 9, function (a) { return a[0] !== -a[1]; }), g = [r.int(2, 6), r.int(2, 6), r.int(2, 6)];
      if (k === 'A') { n1 = [C(g[0]), A(1, z[0], v)]; d1 = [Mo(1, v, 1), A(1, z[1], v)]; n2 = [C(g[1]), A(1, z[1], v)]; d2 = [C(g[2]), A(1, z[0], v)]; }
      else if (k === 'B') { var p = r.int(2, 8), c1 = r.int(2, 9), c2 = r.int(2, 9); n1 = [A(1, -p, v), A(1, p, v)]; d1 = [Mo(c1, v, 1)]; n2 = [Mo(c2, v, 3)]; d2 = [C(g[2]), A(1, p, v)]; }
      else { var p3 = r.int(2, 8), c3 = r.int(2, 9); n1 = [A(1, -p3, v), A(1, p3, v)]; d1 = []; n2 = [Mo(c3, v, 1)]; d2 = [Mo(1, v, 1), A(1, (r.chance(0.5) ? 1 : -1) * p3, v)]; }
    } else if (mode === 'tri') {
      var f = monics(r, 5, 7, function (a) { return small2(a[0], a[1]) && small2(a[2], a[3]) && small2(a[3], a[4]) && small2(a[4], a[0]); });
      n1 = [A(1, f[0], v), A(1, f[1], v)]; d1 = [A(1, f[2], v), A(1, f[3], v)]; n2 = [A(1, f[3], v), A(1, f[4], v)]; d2 = [A(1, f[4], v), A(1, f[0], v)];
      if (r.chance(0.3)) { var a2 = r.pick([2, 3]), b2 = pickWhere(function () { return nz(r, 1, 5); }, function (b) { return gcd(a2, b) === 1; }); n1 = [A(a2, b2, v), A(1, f[1], v)]; d2 = [A(1, f[4], v), A(a2, b2, v)]; }
    } else {
      var pp = r.int(1, 9), q = pickWhere(function () { return r.int(2, 9); }, function (x) { return x !== pp; }), cc = r.int(2, 5);
      n1 = [A(-1, pp, v)]; d1 = [Mo(1, v, 1), A(1, q, v)]; n2 = [A(1, -q, v), A(1, q, v)]; d2 = [C(cc), A(1, -pp, v)]; oa = { an: true };
      if (r.chance(0.4)) { n1 = [C(cc), A(-1, pp, v)]; d2 = [A(1, -pp, v)]; }
    }
    var T = canon([n1, n2], [d1, d2]), npv = npvOf([d1, d2]);
    var dl = mode === 'opp' ? [{ cn: cNeg(T), code: cp + 'opp-sign', hint: t('(a-b)') + ' and ' + t('(b-a)') + ' are opposites: their quotient is ' + t('-1') + '. Keep the minus sign.' }] : [];
    var nw = cancelNW(cp, T, npv);
    var e1 = fracE(n1, d1, Object.assign({ paren: true }, oa)), e2 = fracE(n2, d2, ob);
    var prompt = 'Simplify. State the non-permissible values. ' + t(e1 + '\\cdot ' + e2);
    var sol = 'Factor: ' + t(fracF(n1, d1) + '\\cdot ' + fracF(n2, d2)) + '.<br>NPVs (every denominator): ' + t(npvTex(npv)) + '.<br>Divide out the common factors' + (mode === 'opp' ? ' (the opposite pair gives ' + t('-1') + ')' : '') + ' and multiply: ' + t(cTex(T)) + '.';
    return simpPart(cp, prompt, T, npv, { dl: dl, nw: nw, vars: [v] }, sol, ['Factor every numerator and denominator fully, and state the NPVs of every denominator.', 'Divide out factors that appear in any numerator and any denominator, then multiply what is left.'], 'multiply rational expressions');
  };

  /* dividing (L4 #4–5). mode 'bin' | 'tri' */
  B.divRat = function (r, cp, o) {
    o = o || {};
    var mode = o.mode || 'tri', v = pickVar(r), n1, d1, n2, d2;
    if (mode === 'bin') {
      var k = r.pick(['A', 'B', 'C']), z = monics(r, 2, 9, function (a) { return a[0] !== -a[1]; });
      if (k === 'A') { var g1 = r.int(2, 9), g2 = pickWhere(function () { return r.int(2, 9); }, function (x) { return x !== g1; }); n1 = [C(g1), A(1, z[0], v)]; d1 = [Mo(1, v, 1), A(1, z[1], v)]; n2 = [C(g2), A(1, z[0], v)]; d2 = [A(1, z[1], v)]; }
      else if (k === 'B') { var a = r.int(2, 5), b = pickWhere(function () { return r.int(1, 5); }, function (x) { return gcd(a, x) === 1; }); n1 = [A(a, -b, v), A(a, b, v)]; d1 = [Mo(1, v, 1), A(1, z[1], v)]; n2 = [A(a, b, v)]; d2 = []; }
      else { var p = r.int(1, 8), c = r.int(2, 9); n1 = [Mo(1, v, 1), A(1, -p, v)]; d1 = []; n2 = [A(1, -p, v), A(1, p, v)]; d2 = [Mo(c, v, 1)]; }
    } else {
      var f = monics(r, 5, 7, function (a) { return small2(a[0], a[1]) && small2(a[2], a[3]) && small2(a[1], a[4]) && small2(a[4], a[3]); });
      n1 = [A(1, f[0], v), A(1, f[1], v)]; d1 = [A(1, f[2], v), A(1, f[3], v)]; n2 = [A(1, f[1], v), A(1, f[4], v)]; d2 = [A(1, f[4], v), A(1, f[3], v)];
      if (r.chance(0.3)) { var a2 = r.pick([2, 3]), b2 = pickWhere(function () { return nz(r, 1, 5); }, function (b) { return gcd(a2, b) === 1; }); n1 = [A(1, f[0], v), A(a2, b2, v)]; n2 = [A(a2, b2, v), A(1, f[4], v)]; }
    }
    var T = canon([n1, d2], [d1, n2]), npv = npvMerge(npvOf([d1, d2]), npvOf([n2]));
    var noflip = canon([n1, n2], [d1, d2]);
    var dl = [{ cn: noflip, code: cp + 'div-noflip', hint: 'To divide, multiply by the <b>reciprocal</b> of the divisor: flip the second expression, then multiply.' }];
    var nw = [{ vals: npvOf([d1, d2]), code: cp + 'npv-div', hint: 'In a division the divisor cannot be ' + t(0) + ' either: the zeros of its numerator ' + t(facTex(n2)) + ' are NPVs too.' }].concat(cancelNW(cp, T, npv));
    var prompt = 'Simplify. State the non-permissible values. ' + t(fracE(n1, d1, { paren: true }) + '\\div ' + fracE(n2, d2, { paren: true }));
    var sol = 'Factor: ' + t(fracF(n1, d1) + '\\div ' + fracF(n2, d2)) + '.<br>NPVs: the denominators give ' + t(npvTex(npvOf([d1, d2]))) + '; the divisor’s numerator gives ' + t(npvTex(npvOf([n2]))) + '. So ' + t(npvTex(npv)) + '.<br>Multiply by the reciprocal: ' + t(fracF(n1, d1) + '\\cdot ' + fracF(d2.length ? d2 : [C(1)], n2) + '=' + cTex(T)) + '.';
    return simpPart(cp, prompt, T, npv, { dl: dl, nw: nw, vars: [v] }, sol, ['Factor everything. NPVs: every denominator, and also the numerator of the divisor (it becomes a denominator when you flip it).', 'Multiply by the reciprocal of the divisor, then divide out common factors.'], 'divide rational expressions');
  };

  /* the NPVs of a division, without simplifying (L4 Ex 3, #3) */
  B.npvDiv = function (r, cp) {
    var v = pickVar(r), s = pickWhere(function () { return { a: nz(r, 1, 9), b: nz(r, 1, 9), c: nz(r, 1, 9), m: r.int(1, 4), n: nz(r, 1, 7) }; }, function (z) { return gcd(z.m, z.n) === 1 && z.b !== z.c && z.a !== z.b && z.a !== z.c && rv(ex.norm(-z.n, z.m)) !== -z.b && rv(ex.norm(-z.n, z.m)) !== -z.c && (z.m > 1 || r.chance(0.3)); });
    var n1 = [A(1, s.a, v)], d1 = [A(1, s.b, v)], n2 = [A(1, s.c, v)], d2 = [A(s.m, s.n, v)];
    var npv = npvMerge(npvOf([d1, d2]), npvOf([n2]));
    var nw = [{ vals: npvOf([d1, d2]), code: cp + 'npv-div', hint: 'The divisor ' + t(fracE(n2, d2)) + ' cannot be ' + t(0) + ': after you flip it, ' + t(polyT(n2)) + ' is a denominator. Include its zero.' }];
    var sol = 'Denominators: ' + t(polyT(d1) + '=0') + ' and ' + t(polyT(d2) + '=0') + '. The divisor’s numerator: ' + t(polyT(n2) + '=0') + ' (it is a denominator after flipping).<br>NPVs: ' + t(npvTex(npv)) + '.';
    return npvPart(cp, 'State the non-permissible values. Do not simplify. ' + t(fracE(n1, d1) + '\\div ' + fracE(n2, d2)), npv, { v: v, nw: nw }, sol, ['Both denominators give NPVs.', 'The divisor’s numerator does too: dividing by ' + t(fracE(n2, d2)) + ' means multiplying by ' + t(fracE(d2, n2)) + '.'], 'NPVs of a division');
  };

  /* three expressions multiplied and divided (L4 #7, L10 #13) */
  B.mixed3 = function (r, cp, o) {
    var v = pickVar(r), kind = (o && o.kind) || r.pick(['dm', 'md', 'dd']), es, ops, T, divN = [];
    var z = monics(r, 4, 7, function (a) { return a[0] !== -a[1] && a[0] > 0 && a.slice(1).every(function (x) { return Math.abs(x) !== a[0]; }) && Math.abs(a[2]) !== Math.abs(a[3]) && Math.abs(a[1]) !== Math.abs(a[2]) && Math.abs(a[1]) !== Math.abs(a[3]); });
    var p = z[0], q = z[1], s1 = z[2], u = z[3];
    if (kind === 'dm') { // e1 ÷ e2 · e3 → v
      es = [[[A(1, -p, v), A(1, p, v)], [Mo(1, v, 1), A(1, q, v)]], [[A(1, -p, v)], [A(1, s1, v), A(1, q, v)]], [[Mo(1, v, 2)], [A(1, p, v), A(1, s1, v)]]];
      ops = ['\\div ', '\\cdot ']; T = canon([es[0][0], es[1][1], es[2][0]], [es[0][1], es[1][0], es[2][1]]); divN = [es[1][0]];
    } else if (kind === 'md') { // e1 · e2 ÷ e3 → 1/(v − u)
      es = [[[A(1, -p, v), A(1, q, v)], [A(1, -p, v), A(1, s1, v)]], [[Mo(1, v, 1), A(1, s1, v)], [A(1, q, v), A(1, q, v)]], [[Mo(1, v, 1), A(1, u, v)], [A(1, q, v)]]];
      ops = ['\\cdot ', '\\div ']; T = canon([es[0][0], es[1][0], es[2][1]], [es[0][1], es[1][1], es[2][0]]); divN = [es[2][0]];
    } else if (kind === 'mmm') { // e1 · e2 · e3 → (g2/g1) v
      var g1 = r.pick([2, 3, 4, 6]), g2 = g1 * r.pick([1, 2]) / r.pick([1, 2]);
      if (g2 !== Math.round(g2)) g2 = g1 * 2;
      es = [[[A(1, -p, v), A(1, q, v)], [Mo(g1, v, 2)]], [[Mo(g2, v, 2), A(1, s1, v)], [A(1, -p, v), A(1, u, v)]], [[Mo(1, v, 1), A(1, u, v)], [A(1, s1, v), A(1, q, v)]]];
      ops = ['\\cdot ', '\\cdot ']; T = canon([es[0][0], es[1][0], es[2][0]], [es[0][1], es[1][1], es[2][1]]);
    } else { // e1 ÷ e2 ÷ e3 → gh/(v + p)
      var g = r.int(2, 4), h = r.int(2, 4);
      es = [[[C(g), A(1, -p, v), A(1, p, v)], [Mo(1, v, 1), A(1, q, v)]], [[A(1, p, v), A(1, p, v)], [A(1, q, v)]], [[A(1, -p, v)], [Mo(h, v, 1)]]];
      ops = ['\\div ', '\\div ']; T = canon([es[0][0], es[1][1], es[2][1]], [es[0][1], es[1][0], es[2][0]]); divN = [es[1][0], es[2][0]];
    }
    var dens = es.map(function (e) { return e[1]; }), npv = npvMerge(npvOf(dens), npvOf(divN));
    var nw = (divN.length ? [{ vals: npvOf(dens), code: cp + 'npv-div', hint: 'Each divisor’s numerator becomes a denominator when you flip it, so its zeros are NPVs too.' }] : []).concat(cancelNW(cp, T, npv));
    var prompt = 'Simplify. State the non-permissible values. ' + t(fracE(es[0][0], es[0][1]) + ops[0] + fracE(es[1][0], es[1][1]) + ops[1] + fracE(es[2][0], es[2][1]));
    var flipT = es.map(function (e, i) { var flip = (i === 1 && ops[0] === '\\div ') || (i === 2 && ops[1] === '\\div '); return flip ? fracF(e[1], e[0]) : fracF(e[0], e[1]); }).join('\\cdot ');
    var sol = 'Factor: ' + t(fracF(es[0][0], es[0][1]) + ops[0] + fracF(es[1][0], es[1][1]) + ops[1] + fracF(es[2][0], es[2][1])) + '.<br>' + (divN.length ? 'NPVs: denominators ' + t(npvTex(npvOf(dens))) + '; divisors’ numerators ' + t(npvTex(npvOf(divN))) + '. So ' + t(npvTex(npv)) + '.<br>Flip each divisor and multiply: ' : 'NPVs (every denominator): ' + t(npvTex(npv)) + '.<br>Divide out the common factors and multiply: ') + t((divN.length ? flipT + '=' : '') + cTex(T)) + '.';
    return simpPart(cp, prompt, T, npv, { nw: nw, vars: [v] }, sol, ['Factor everything. Flip each divisor (only the one after a ' + t('\\div') + ' sign), then multiply.', 'NPVs: every denominator, and every divisor’s numerator.'], 'multiply and divide three expressions');
  };

  /* ======================================================================================================
   * AN5 — Lessons 5–6: adding and subtracting
   * ====================================================================================================== */
  function sumPart(cp, prompt, terms, v, o, hints, text) {
    o = o || {};
    var S = sumOf(terms, v), npv = npvOf(terms.map(function (tm) { return tm.df; })), dl = [];
    // add straight across (numerators over denominators added)
    if (terms.length === 2 && terms.every(function (tm) { return tm.df.length; })) {
      var sumN = P.add(P.scale(listPoly(terms[0].nf), terms[0].s), P.scale(listPoly(terms[1].nf), terms[1].s)), sumD = P.add(listPoly(terms[0].df), listPoly(terms[1].df));
      if (!P.isZero(sumD) && !P.isZero(sumN) && P.vars(sumD).length) dl.push({ cn: polyCn(sumN, sumD), code: cp + 'add-straight', hint: 'Fractions are added over a <b>common denominator</b>: you cannot add the denominators. Find the LCD, rewrite each fraction over it, then add the numerators.' });
    }
    // a subtraction with the minus applied to the first term only
    terms.forEach(function (tm, i) {
      if (tm.s > 0 || P.count(listPoly(tm.nf)) < 2 && !tm.df.length) return;
      var lc = S.lcd, mc = cDiv(lc, canon([tm.df])), pr = P.mul(listPoly(tm.nf), cPoly1(mc));
      if (P.count(pr) < 2) return;
      var lead = P.sorted(pr)[0], restP = P.sub(pr, P.mono(lead.c, lead.v)), wrongN = P.add(S.N0, P.scale(restP, 2));
      dl.push({ cn: polyCn(wrongN, cPolys(lc).N), code: cp + 'sub-sign', hint: 'The minus sign in front of a fraction applies to its <b>whole</b> numerator: ' + t('-(' + tx(pr) + ')=' + tx(P.neg(pr))) + '.' });
    });
    // a whole-number term (or a numerator) not multiplied by its multiplier
    terms.forEach(function (tm) {
      var lc = S.lcd, mc = cDiv(lc, canon([tm.df])), mp = cPoly1(mc);
      if (P.degree(mp) < 1 && rv(P.constant(mp)) === 1) return;
      var wrongN = P.add(S.N0, P.scale(P.sub(listPoly(tm.nf), P.mul(listPoly(tm.nf), mp)), tm.s));
      dl.push({ cn: polyCn(wrongN, cPolys(lc).N), code: cp + (tm.df.length ? 'lcd-num' : 'whole-lcd'), hint: tm.df.length ? 'When a denominator is multiplied to make the LCD, multiply its <b>numerator</b> by the same factor.' : 'Write the whole-number term as a fraction over the LCD: multiply it by the whole LCD.' });
    });
    var sol = sumSol(terms, S, npv, o);
    return simpPart(cp, prompt + ' ' + t(termsTex(terms)), S.T, npv, { dl: dl, nw: o.nw || [], vars: [v], keyTex: sumKey(S) }, sol, hints, text);
  }
  function polyCn(N, D) { // a canon for N / D (N, D polynomials; used for wrong answers)
    var cn = blank(); put(cn, [Q(N)], 1); put(cn, [Q(D)], -1); return cn;
  }
  /* one denominator (L5 #3) */
  B.addSame = function (r, cp) {
    var v = pickVar(r), kind = r.pick(['mono', 'bin', 'tri']), terms;
    if (kind === 'mono') {
      var s = pickWhere(function () { return { c: r.int(2, 6), a1: r.int(1, 9), b1: nz(r, 1, 9), a2: r.int(1, 9), b2: nz(r, 1, 9), sub: r.chance(0.7) }; }, function (z) { var A1 = z.sub ? z.a1 - z.a2 : z.a1 + z.a2, B1 = z.sub ? z.b1 - z.b2 : z.b1 + z.b2; return A1 !== 0 && B1 !== 0 && z.a1 !== z.a2 && gcd(gcd(z.a1, z.b1), z.c) === 1 && gcd(gcd(z.a2, z.b2), z.c) === 1 && (gcd(gcd(A1, B1), z.c) > 1 || r.chance(0.4)); });
      terms = [T1(1, [A(s.a1, s.b1, v)], [Mo(s.c, v, 1)]), T1(s.sub ? -1 : 1, [A(s.a2, s.b2, v)], [Mo(s.c, v, 1)])];
    } else if (kind === 'bin') {
      var b = pickWhere(function () { return { d: nz(r, 1, 7), k: nz(r, 2, 5), a2: r.int(1, 6), b2: nz(r, 1, 9) }; }, function (z) { return z.b2 !== 0 && z.a2 + z.k !== 0; });
      // (a1 v + b1) − (a2 v + b2) = k(v + d)
      var a1 = b.a2 + b.k, b1 = b.b2 + b.k * b.d;
      if (a1 <= 0 || b1 === 0) { a1 = b.a2 + Math.abs(b.k); b1 = b.b2 + Math.abs(b.k) * b.d; }
      terms = [T1(1, [A(a1, b1, v)], [A(1, b.d, v)]), T1(-1, [A(b.a2, b.b2, v)], [A(1, b.d, v)])];
    } else {
      var z = monics(r, 2, 8, function (a) { return a[0] !== -a[1] && a[0] * a[1] !== 0; }), d = z[0], e = z[1], bcoef = d + e, cst = d * e;
      // (v² + b v)/(v + d) − (−c)/(v + d) → v + e   with v² + (d+e) v + de
      terms = cst < 0 ? [T1(1, [Mo(1, v, 1), A(1, bcoef, v)], [A(1, d, v)]), T1(-1, [C(-cst)], [A(1, d, v)])] : [T1(1, [Mo(1, v, 1), A(1, bcoef, v)], [A(1, d, v)]), T1(1, [C(cst)], [A(1, d, v)])];
      if (bcoef === 0) terms[0].nf = [Mo(1, v, 2)];
    }
    return sumPart(cp, 'Simplify. State the non-permissible values.', terms, v, {}, ['The denominators are the same: combine the numerators over it. A minus sign changes the sign of every term of the numerator after it.', 'Factor the result: it may simplify.'], 'add or subtract over one denominator');
  };
  /* monomial denominators (L5 #5–8). mode 'num' | 'bin' | 'whole' */
  B.addMono = function (r, cp, o) {
    o = o || {};
    var mode = o.mode || 'num', v = pickVar(r), terms;
    if (mode === 'num') {
      var s = pickWhere(function () { return { p: nz(r, 1, 9), q: nz(r, 1, 9), a: r.int(2, 9), b: r.int(2, 9), e: r.pick([1, 1, 2]), f: r.pick([1, 1, 2, 3]) }; }, function (z) { return z.p > 0 && z.a !== z.b && gcd(z.a, z.b) > 1 && gcd(z.a, z.b) < Math.min(z.a, z.b) && gcd(z.p, z.a) === 1 && gcd(Math.abs(z.q), z.b) === 1; });
      terms = [T1(1, [C(s.p)], [Mo(s.a, v, s.e)]), T1(s.q < 0 ? -1 : 1, [C(Math.abs(s.q))], [Mo(s.b, v, s.f)])];
    } else if (mode === 'bin') {
      var s2 = pickWhere(function () { return { a: r.int(2, 6), b: r.int(2, 6), e: r.pick([1, 1, 2]), f: r.pick([1, 1, 2]), p: nz(r, 1, 7), q: nz(r, 1, 7), c1: r.pick([1, 1, 2, 3]), c2: r.pick([1, 1, 2]), sub: r.chance(0.5) }; }, function (z) { return z.a !== z.b && !(z.e === 2 && z.f === 2) && gcd(z.c1, z.p) === 1 && gcd(z.c2, z.q) === 1; });
      terms = [T1(1, [A(s2.c1, s2.p, v)], [Mo(s2.a, v, s2.e)]), T1(s2.sub ? -1 : 1, [A(s2.c2, s2.q, v)], [Mo(s2.b, v, s2.f)])];
    } else {
      var kind = r.pick(['cf', 'fc', 'vc']), c = r.int(2, 7), p = r.int(1, 9), a = r.pick([1, 1, 2, 3]); if (gcd(p, a) > 1) a = 1;
      if (kind === 'cf') terms = [T1(1, [C(c)], []), T1(r.chance(0.5) ? 1 : -1, [C(p)], [Mo(a, v, 1)])];
      else if (kind === 'fc') terms = [T1(1, [C(p)], [Mo(a, v, 1)]), T1(-1, [C(c)], [])];
      else terms = [T1(1, [A(1, nz(r, 1, 5), v)], []), T1(-1, [C(p)], [Mo(1, v, 1)])];
    }
    return sumPart(cp, 'Simplify. State the non-permissible values.', terms, v, {}, ['Find the LCD: the LCM of the numbers and the highest power of the variable.', 'Multiply each numerator by what its denominator was multiplied by, then combine the numerators.' + (mode === 'whole' ? ' A whole-number term is a fraction over ' + t(1) + '.' : '')], 'add or subtract with monomial denominators');
  };
  /* the k that makes a difference a constant (L5 #12) */
  B.addK = function (r, cp) {
    var v = 'x', s = pickWhere(function () { return { a: r.int(2, 6), b: r.int(2, 6), m: nz(r, 1, 9), add: r.chance(0.35) }; }, function (z) {
      if (z.a === z.b) return false; var k = -z.a * z.m / z.b; if (!nice(k) || k === 0 || Math.abs(k) > 12) return false;
      return !(z.a === 2 && z.b === 3 && z.m === -3 && !z.add);
    });
    var k = -s.a * s.m / s.b, c = s.add ? ex.norm(s.a + s.b, s.a * s.b) : ex.norm(s.b - s.a, s.a * s.b), L = s.a * s.b / gcd(s.a, s.b);
    var second = tx(lin(1, s.add ? s.m : -s.m)), op = s.add ? '+' : '-';
    // (x + k)/(ax) ± (x − m)/(bx)  [add: (x + k)/(ax) + (x + m)/(bx)]
    var prompt = 'Determine the value of ' + t('k') + ' so that ' + t('\\frac{x+k}{' + s.a + 'x}' + op + '\\frac{' + second + '}{' + s.b + 'x}') + ' simplifies to ' + t(rt(c)) + ' (for ' + t('x\\ne 0') + ').';
    var Ac = L / s.a + (s.add ? 1 : -1) * L / s.b, Cc = (L / s.b) * s.m, ka = L / s.a;
    var sol = 'The LCD is ' + t(L + 'x') + ': ' + t('\\frac{' + coefT(ka) + '(x+k)' + op + coefT(L / s.b) + '(' + second + ')}{' + L + 'x}') + '. The numerator is ' + t(tx(lin(Ac, Cc)) + '+' + coefT(ka) + 'k') + '.<br>For the result to be a constant, the constant terms must cancel: ' + t(coefT(ka) + 'k' + sg(Cc) + '=0') + ', so ' + t('k=' + k) + '. Then it is ' + t('\\frac{' + coefT(Ac) + 'x}{' + L + 'x}=' + rt(c)) + '.';
    var p = KP.math(big(prompt), K.value(k, { diag: function (val) { if (val === -k) return { code: cp + 'k-sign', hint: 'Check the signs: ' + (s.add ? '' : 'the minus sign changes the sign of every term of the second numerator. ') + 'The constant terms of the numerator must add to ' + t(0) + '.' }; return null; } }),
      String(k), sol, ['Write both fractions over the LCD and combine the numerators (keep ' + t('k') + ' as a letter).', 'The answer has no ' + t('x') + ' left, so the constant terms of the numerator must cancel.'], 'working backwards: k', { keys: 'u6num', before: 'k=' });
    p.bad = [String(-k)];
    return p;
  };
  /* binomial and trinomial denominators (L6). mode 'lin' | 'num' | 'gcf' | 'tri' | 'opp' | 'red' */
  B.addBin = function (r, cp, o) {
    o = o || {};
    var mode = o.mode || 'lin', v = pickVar(r), terms, an;
    if (mode === 'lin') {
      var s = pickWhere(function () { return { p: r.int(1, 7), q: nz(r, 1, 7), a: nz(r, 1, 8), b: nz(r, 1, 8), m: r.pick([1, 1, 1, 2, 3]) }; }, function (z) { return z.a !== z.b && gcd(z.m, z.a) === 1 && (z.m === 1 || rv(ex.norm(-z.a, z.m)) !== -z.b) && Math.abs(z.p) !== Math.abs(z.q); });
      terms = [T1(1, [C(s.p)], [A(s.m, s.a, v)]), T1(s.q < 0 ? -1 : 1, [C(Math.abs(s.q))], [A(1, s.b, v)])];
    } else if (mode === 'num') {
      var z = monics(r, 4, 6, function (a) { return a[1] !== a[3] && a[0] !== a[1] && a[2] !== a[3]; });
      terms = [T1(1, [A(1, z[0], v)], [A(1, z[1], v)]), T1(r.chance(0.6) ? -1 : 1, [A(r.pick([1, 1, 2]), z[2], v)], [A(1, z[3], v)])];
      if (r.chance(0.25)) terms = [T1(1, [C(r.int(2, 4))], []), T1(r.chance(0.5) ? 1 : -1, [A(1, z[2], v)], [A(1, z[3], v)])];
    } else if (mode === 'gcf') {
      var kind = r.pick(['c', 'x', 'dos']), p = nz(r, 1, 7), g = r.int(2, 5), n1 = r.int(1, 7), n2 = r.int(1, 7);
      if (kind === 'c' && gcd(n1, g) > 1) n1 = 1;
      if (kind === 'c') terms = [T1(1, [C(n1)], [C(g), A(1, p, v)]), T1(r.chance(0.5) ? 1 : -1, [C(n2)], [A(1, p, v)])];
      else if (kind === 'x') terms = [T1(1, [C(n1)], [Mo(1, v, 1), A(1, p, v)]), T1(-1, [C(n2)], [Mo(1, v, 1)])];
      else { var q = r.int(2, 7); terms = [T1(1, [Mo(1, v, 1)], [A(1, -q, v), A(1, q, v)]), T1(-1, [C(1)], [A(1, q, v)])]; }
      if (terms[0].nf[0].k === 'c' && terms[1].nf[0].k === 'c' && kind === 'c' && n1 === g * n2 && terms[1].s < 0) terms[1].nf = [C(n2 + 1)];
    } else if (mode === 'tri') {
      var f = monics(r, 3, 6, function (a) { return small2(a[0], a[1]) && small2(a[0], a[2]); });
      var c1 = r.int(1, 5), c2 = r.int(1, 5);
      terms = [T1(1, [C(c1)], [A(1, f[0], v), A(1, f[1], v)]), T1(r.chance(0.5) ? -1 : 1, [C(c2)], [A(1, f[0], v), A(1, f[2], v)])];
    } else if (mode === 'opp') {
      var pp = r.int(1, 9), k1 = r.int(1, 9), k2 = pickWhere(function () { return r.int(1, 9); }, function (x) { return x !== k1; });
      if (r.chance(0.5)) terms = [T1(1, [C(k1)], [A(1, -pp, v)]), T1(1, [C(k2)], [A(-1, pp, v)], { ad: true })];
      else terms = [T1(1, [C(k1)], [A(1, -pp, v), A(1, pp, v)]), T1(1, [C(k2)], [A(-1, pp, v)], { ad: true })];
    } else { // 'red': the result simplifies
      var kind2 = r.pick(['two', 'three']);
      if (kind2 === 'two') { // a/(v − p) − 2ap/(v² − p²) = a/(v + p)
        var a = r.int(1, 6), p2 = r.int(1, 7);
        terms = [T1(1, [C(a)], [A(1, -p2, v)]), T1(-1, [C(2 * a * p2)], [A(1, -p2, v), A(1, p2, v)])];
      } else { // b/(v − p) + c/(v + p) − K/(v² − p²) with numerator = k(v − p)
        var s3 = pickWhere(function () { return { b: r.int(1, 6), c: r.int(1, 6), p: r.int(1, 6) }; }, function (z) { return z.b !== z.c && z.b + z.c > 1; });
        // b(v+p) + c(v−p) − K = (b+c)v + (b−c)p − K; make it (b+c)(v − p): K = (b−c)p + (b+c)p = 2bp
        terms = [T1(1, [C(s3.b)], [A(1, -s3.p, v)]), T1(1, [C(s3.c)], [A(1, s3.p, v)]), T1(-1, [C(2 * s3.b * s3.p)], [A(1, -s3.p, v), A(1, s3.p, v)])];
      }
    }
    void an;
    return sumPart(cp, 'Simplify. State the non-permissible values.', terms, v, {}, ['Factor each denominator' + (mode === 'opp' ? ' (write ' + t('(b-a)') + ' as ' + t('-(a-b)') + ')' : '') + ', state the NPVs and find the LCD: each different factor, to its highest power.', 'Multiply each numerator by the factors its denominator is missing, combine, then factor the numerator: it may simplify.'], 'add or subtract rational expressions');
  };

  /* ======================================================================================================
   * AN6 — Lessons 7–8: rational equations
   * ====================================================================================================== */
  function eqPart(cp, prompt, L, Rr, v, o, hints, text) {
    o = o || {};
    var W = eqWork(L, Rr, v, o), wr = (o.wrongs || []).slice();
    // multiplying only the fraction terms by the LCD (a whole-number term left alone)
    var lcP = cPolys(W.q.lc).N;
    if (P.degree(lcP) > 0) {
      var all = L.map(function (tm) { return { tm: tm, side: 1 }; }).concat(Rr.map(function (tm) { return { tm: tm, side: -1 }; }));
      if (all.some(function (x) { return !x.tm.df.length; })) {
        var E2 = P.num(0);
        all.forEach(function (x) { var tm = x.tm, cd = canon([tm.df]), mp = tm.df.length ? cPoly1(cDiv(W.q.lc, cd)) : P.num(1); E2 = P.add(E2, P.scale(P.mul(listPoly(tm.nf), mp), tm.s * x.side)); });
        var i2 = quadRoots(stdForm(E2, v), v); if (i2.roots.length && i2.deg >= 1) wr.push({ vals: i2.roots, code: cp + 'eq-oneterm', hint: 'Multiply <b>every</b> term by the LCD, including the whole-number term(s).' });
      }
    }
    var p = rootsPart(cp, prompt, W.roots, { v: v, extr: W.extr, wrongs: wr, bothValid: W.roots.length > 1, exact: o.exact, keyTex: o.keyTex, radical: o.radical }, W.sol, hints, text);
    p.W = W;
    return p;
  }
  /* the NPVs of an equation (L7 #1) */
  B.npvEq = function (r, cp) {
    var v = 'x', kind = r.pick(['A', 'B', 'C']), L, Rr;
    if (kind === 'A') { var z = monics(r, 1, 9); L = [T1(1, [C(r.int(2, 9))], [A(1, z[0], v)])]; Rr = [T1(1, [C(r.int(1, 5))], [Mo(1, v, 1)])]; }
    else if (kind === 'B') { var s = pickWhere(function () { return { m: r.int(2, 5), n: nz(r, 1, 7), b: nz(r, 1, 8) }; }, function (q) { return gcd(q.m, q.n) === 1; }); L = [T1(1, [Mo(1, v, 1)], [A(s.m, s.n, v)]), T1(1, [C(r.int(2, 5))], [])]; Rr = [T1(1, [C(1)], [A(1, s.b, v)])]; }
    else { var f = monics(r, 2, 8, function (a) { return a[0] !== -a[1] && small2(a[0], a[1]); }); L = [T1(1, [C(r.int(2, 9))], [A(1, f[0], v), A(1, f[1], v)]), T1(1, [C(1)], [A(1, f[1], v)])]; Rr = [T1(1, [C(0)], [])]; }
    var npv = npvOf(L.concat(Rr).map(function (tm) { return tm.df; }));
    var one = npvOf([L[0].df]);
    var nw = npvEq(one, npv) ? [] : [{ vals: one, code: cp + 'npv-one', hint: 'Every denominator in the equation gives NPVs, on both sides.' }];
    var sol = 'Set each denominator equal to ' + t(0) + ': ' + L.concat(Rr).filter(function (tm) { return tm.df.length; }).map(function (tm) { return t(facTex(tm.df) + '=0'); }).join(', ') + '.<br>NPVs: ' + t(npvTex(npv)) + '.';
    return npvPart(cp, 'State the non-permissible values of the equation ' + t(eqTex(L, Rr)) + '.', npv, { v: v, nw: nw }, sol, ['Factor every denominator, on both sides of the equation.', 'Each factor with a variable gives an NPV.'], 'NPVs of an equation');
  };
  /* monomial denominators, linear result (L7 #3) */
  B.eqMono = function (r, cp) {
    var v = 'x', kind = r.pick(['F1', 'F2', 'F3']), L, Rr;
    var s = pickWhere(function () {
      if (kind === 'F1') { var p = nz(r, 1, 9), q = nz(r, 1, 4), x0 = nz(r, 1, 9), sv = p + q * x0; return { L: [T1(p < 0 ? -1 : 1, [C(Math.abs(p))], [Mo(1, v, 1)]), T1(q < 0 ? -1 : 1, [C(Math.abs(q))], [])], R: [T1(sv < 0 ? -1 : 1, [C(Math.abs(sv))], [Mo(1, v, 1)])], sv: sv, p: p }; }
      if (kind === 'F2') { var m = r.int(2, 4), n = r.pick([2, 3, 4, 5, 6]), p2 = r.int(1, 9), q2 = r.int(1, 3), s2 = r.int(1, 9); return { L: [T1(1, [C(p2)], [Mo(m, v, 1)]), T1(1, [C(q2)], [C(n)])], R: [T1(1, [C(s2)], [Mo(1, v, 1)])], sv: s2, p: p2, m: m, n: n }; }
      var b = r.pick([2, 3, 4, 5]), c = r.pick([2, 3, 4, 6]), a = r.int(1, 9), dd = r.int(1, 5);
      return { L: [T1(1, [A(1, -a, v)], [Mo(b, v, 1)])], R: [T1(1, [C(1)], [C(c)]), T1(1, [C(dd)], [Mo(1, v, 1)])], sv: 1, p: a, b: b, c: c };
    }, function (z) {
      if (z.sv === 0 || z.p === 0) return false;
      if (z.m && (z.n % z.m === 0 || z.m % z.n === 0) && r.chance(0.7)) return false;
      if (z.m && (gcd(z.p, z.m) > 1 || gcd(z.L[1].nf[0].c[0], z.n) > 1)) return false;
      if (z.b && (z.c === z.b)) return false;
      var W = eqWork(z.L, z.R, v); if (W.roots.length !== 1 || W.info.deg !== 1) return false;
      var x0 = R(W.roots[0]); return x0[0] !== 0 && Math.abs(x0[0]) <= 60 && x0[1] <= 6;
    });
    return eqPart(cp, 'Solve. ' + t(eqTex(s.L, s.R)), s.L, s.R, v, {}, ['State the NPV, then multiply <b>every</b> term by the LCD of the denominators.', 'Solve the linear equation and check that the root is not an NPV.'], 'solve a rational equation');
  };
  /* one fraction on each side (L7 #4, L8 #2). mode 'lin' | 'quad' */
  B.eqCross = function (r, cp, o) {
    o = o || {};
    var mode = o.mode || 'lin', v = 'x', s = pickWhere(function () {
      var L, Rr, kind = mode === 'lin' ? r.pick(['A', 'B', 'C']) : r.pick(['Q1', 'Q2']);
      if (kind === 'A') { var p = r.int(1, 9), q = r.int(1, 9), a = nz(r, 1, 9); L = [T1(1, [C(p)], [A(1, a, v)])]; Rr = [T1(1, [C(q)], [Mo(1, v, 1)])]; }
      else if (kind === 'B') { var m = r.int(1, 5), n = nz(r, 1, 7), a2 = nz(r, 1, 7), pp = nz(r, 1, 7), qq = r.int(2, 5); if (gcd(pp, qq) > 1) return null; L = [T1(1, [A(m, n, v)], [A(1, a2, v)])]; Rr = [T1(pp < 0 ? -1 : 1, [C(Math.abs(pp))], [C(qq)])]; }
      else if (kind === 'C') { var k = r.int(1, 9), c = r.int(1, 9), d = r.int(1, 4), e = nz(r, 1, 6); L = [T1(1, [C(k)], [A(-d, c, v)], { ad: true })]; Rr = [T1(e < 0 ? -1 : 1, [C(Math.abs(e))], [])]; }
      else if (kind === 'Q1') { var b = r.pick([2, 3, 4, 5]), r1 = nz(r, 1, 9), r2 = nz(r, 1, 9), cc = -r1 * r2 / b; if (cc !== Math.round(cc) || cc <= 0 || r1 === r2) return null; L = [T1(1, [A(1, -(r1 + r2), v)], [C(b)])]; Rr = [T1(1, [C(cc)], [Mo(1, v, 1)])]; }
      else { var m2 = r.int(2, 4), a3 = nz(r, 1, 6), b3 = nz(r, 1, 6); if (a3 === b3) return null; L = [T1(1, [Mo(m2, v, 1)], [A(1, a3, v)])]; Rr = [T1(1, [A(1, b3, v)], [Mo(1, v, 1)])]; }
      return { L: L, R: Rr, kind: kind };
    }, function (z) {
      var W = eqWork(z.L, z.R, v, { cross: true });
      if (mode === 'lin') { if (W.roots.length !== 1 || W.info.deg !== 1) return false; var x0 = R(W.roots[0]); return Math.abs(x0[0]) <= 60 && x0[1] <= 6 && (x0[1] === 1 || r.chance(0.4)); }
      return W.roots.length === 2 && !W.extr.length && W.roots.every(function (x) { return R(x)[1] === 1 && Math.abs(rv(x)) <= 12; });
    });
    // multiplying the numerators instead of cross-multiplying
    var wr = [];
    return eqPart(cp, 'Solve. ' + t(eqTex(s.L, s.R)), s.L, s.R, v, { cross: true, wrongs: wr }, ['State the NPVs. With one fraction on each side, cross-multiply: ' + t('\\frac{a}{b}=\\frac{c}{d}\\Rightarrow ad=bc') + '.', mode === 'quad' ? 'Write the quadratic in standard form and factor. Check both roots.' : 'Expand, collect like terms and solve.'], mode === 'quad' ? 'cross-multiply: a quadratic' : 'cross-multiply');
  };
  /* binomial and trinomial denominators, linear result (L7 #5, #8). o.none: the root is an NPV (no solution) */
  B.eqBin = function (r, cp, o) {
    o = o || {};
    var v = 'x', s = pickWhere(function () {
      var b = nz(r, 1, 7), c = r.chance(0.4) ? -b : nz(r, 1, 7), p = r.int(1, 6), q = nz(r, 1, 6), x0 = o.none ? (r.chance(0.5) ? b : -c) : r.int(-6, 9);
      // p/(x − b) + q/(x + c) = S/((x − b)(x + c)):  p(x + c) + q(x − b) = S
      var S = p * (x0 + c) + q * (x0 - b);
      return { b: b, c: c, p: p, q: q, x0: x0, S: S };
    }, function (z) { return z.b !== -z.c && z.p + z.q !== 0 && z.S !== 0 && Math.abs(z.S) <= 60 && (o.none || (z.x0 !== z.b && z.x0 !== -z.c)) && Math.abs(z.p) !== Math.abs(z.q); });
    var L = [T1(1, [C(s.p)], [A(1, -s.b, v)]), T1(s.q < 0 ? -1 : 1, [C(Math.abs(s.q))], [A(1, s.c, v)])], Rr = [T1(s.S < 0 ? -1 : 1, [C(Math.abs(s.S))], [A(1, -s.b, v), A(1, s.c, v)])];
    return eqPart(cp, (o.none ? 'Solve, or show that there is no solution. ' : 'Solve. ') + t(eqTex(L, Rr)), L, Rr, v, {}, ['Factor the denominators and state the NPVs. The LCD is the product of the different factors.', 'Multiply every term by the LCD, solve, and reject a root that is an NPV.'], o.none ? 'a rational equation with no solution' : 'solve a rational equation');
  };
  /* x − c/x = b and similar: a quadratic (L8 #1) */
  B.eqQuad = function (r, cp) {
    var v = 'x', s = pickWhere(function () {
      var kind = r.pick(['A', 'A', 'B', 'C']), r1 = nz(r, 1, 9), r2 = nz(r, 1, 9), L, Rr;
      if (r1 === r2 && !r.chance(0.15)) return null;
      var S = r1 + r2, Pd = r1 * r2;
      if (kind === 'A') { if (S === 0) return null; L = [T1(1, [Mo(1, v, 1)], []), T1(Pd > 0 ? 1 : -1, [C(Math.abs(Pd))], [Mo(1, v, 1)])]; Rr = [T1(S < 0 ? -1 : 1, [C(Math.abs(S))], [])]; }
      else if (kind === 'B') { var q = r.pick([2, 3]); if (Pd % q !== 0 || Pd <= 0 || S <= 0) return null; L = [T1(1, [C(Pd / q)], [Mo(1, v, 1)]), T1(1, [Mo(1, v, 1)], [C(q)])]; Rr = [T1(1, [C(S)], [C(q)])]; }
      else { if (Pd === 0) return null; L = [T1(-Pd < 0 ? -1 : 1, [C(Math.abs(Pd))], [Mo(1, v, 2)]), T1(-S < 0 ? 1 : -1, [C(Math.abs(S))], [Mo(1, v, 1)])].filter(function (tm) { return tm.nf[0].c[0] !== 0; }); if (S === 0) return null; Rr = [T1(1, [C(1)], [])]; if (L[0].s < 0) return null; }
      return { L: L, R: Rr };
    }, function (z) { var W = eqWork(z.L, z.R, v); return W.info.deg === 2 && W.roots.length >= 1 && !W.extr.length; });
    return eqPart(cp, 'Solve. ' + t(eqTex(s.L, s.R)), s.L, s.R, v, {}, ['State the NPV and multiply every term by the LCD.', 'Write the quadratic in standard form, factor and solve.'], 'a rational equation that leads to a quadratic');
  };
  /* an extraneous root (L8 #3, L10 #19) */
  B.eqExtr = function (r, cp) {
    var v = 'x', s = pickWhere(function () {
      var a = nz(r, 1, 7), b = nz(r, 1, 7), p = nz(r, 1, 6), e = r.chance(0.5) ? b : -a, rr = b - p - e;
      var S = e * (e - b) + p * (e + a);
      return { a: a, b: b, p: p, e: e, rr: rr, S: S };
    }, function (z) { return z.a !== -z.b && z.S !== 0 && z.rr !== z.e && z.rr !== z.b && z.rr !== -z.a && Math.abs(z.S) <= 60 && Math.abs(z.rr) <= 12; });
    var L = [T1(1, [Mo(1, v, 1)], [A(1, s.a, v)]), T1(s.p < 0 ? -1 : 1, [C(Math.abs(s.p))], [A(1, -s.b, v)])], Rr = [T1(s.S < 0 ? -1 : 1, [C(Math.abs(s.S))], [A(1, s.a, v), A(1, -s.b, v)])];
    return eqPart(cp, 'Solve. Reject any extraneous root. ' + t(eqTex(L, Rr)), L, Rr, v, {}, ['Factor the trinomial denominator and state the NPVs. Multiply every term by the LCD.', 'Solve the quadratic, then reject any root that is an NPV.'], 'a rational equation with an extraneous root');
  };
  /* exact roots by the quadratic formula (L8 #6, #16, L10 #20) */
  function exactRoots(Ai, Bi, Di) {
    var k = ex.nthFactor(Di, 2), m = Di / (k * k), g = gcd(gcd(Bi, k), 2 * Ai), b = -Bi / g, kk = k / g, d = 2 * Ai / g;
    if (d < 0) { d = -d; b = -b; kk = -kk; }
    var rad = (Math.abs(kk) === 1 ? '' : Math.abs(kk)) + '\\sqrt{' + m + '}';
    function piece(sgn) { var top = (b === 0 ? (sgn * kk < 0 ? '-' : '') : b + (sgn * kk < 0 ? '-' : '+')) + rad; return d === 1 ? top : '\\frac{' + top + '}{' + d + '}'; }
    var vp = (b + kk * Math.sqrt(m)) / d, vm = (b - kk * Math.sqrt(m)) / d;
    return { tex: [piece(1), piece(-1)], vals: [vp, vm], pm: (d === 1 ? (b === 0 ? '' : b) + '\\pm ' + rad : '\\frac{' + (b === 0 ? '' : b) + '\\pm ' + rad + '}{' + d + '}') };
  }
  B.eqFormula = function (r, cp) {
    var v = 'x', s = pickWhere(function () {
      var kind = r.pick(['A', 'B']), L, Rr;
      if (kind === 'A') { var p = nz(r, 1, 9), q = nz(r, 1, 5), m = r.pick([1, 2, 3]); L = [T1(1, [C(Math.abs(p))], [Mo(1, v, 1)]), T1(q < 0 ? -1 : 1, [C(Math.abs(q))], [])]; if (p < 0) L[0].s = -1; Rr = [T1(1, [Mo(1, v, 1)], m === 1 ? [] : [C(m)])]; }
      else { var a = r.int(1, 5), b = nz(r, 1, 5), c = r.int(1, 5), d = nz(r, 1, 5); if (b === d) return null; L = [T1(1, [C(a)], [A(1, b, v)]), T1(1, [C(c)], [A(1, d, v)])]; Rr = [T1(1, [C(1)], [])]; }
      return { L: L, R: Rr };
    }, function (z) { var W = eqWork(z.L, z.R, v); if (!(W.info.irr && W.info.disc > 0 && W.info.disc <= 300)) return false; var Ai = W.info.a, Bi = W.info.b; return Math.abs(Ai) <= 3 && Math.abs(Bi) <= 14 && ex.nthFactor(W.info.disc, 2) <= 6 && (ex.nthFactor(W.info.disc, 2) > 1 || r.chance(0.35)); });
    var W = eqWork(s.L, s.R, v), I = W.info, X = exactRoots(I.a, I.b, I.disc);
    var key = v + '=' + X.tex[0] + ',\\ ' + v + '=' + X.tex[1];
    var rawT = v + '=\\frac{' + (-I.b) + '\\pm\\sqrt{' + I.disc + '}}{' + 2 * I.a + '}';
    var sol = W.sol.replace(/It does not factor:.*$/, '') + 'It does not factor, so use the quadratic formula: ' + t(rawT + (rawT.replace(/\s/g, '') === (v + '=' + X.pm).replace(/\s/g, '') ? '' : '=' + X.pm)) + '.<br>Neither root is an NPV: ' + t(v + '=' + X.pm) + ' (' + t('\\approx ' + K.roundTo(X.vals[0], 2) + ',\\ ' + K.roundTo(X.vals[1], 2)) + ').';
    var wrongVals = [-X.vals[0], -X.vals[1]];
    var p = rootsPart(cp, 'Solve. Give exact roots in simplest radical form. ' + t(eqTex(s.L, s.R)), X.vals, { v: v, keyTex: key, radical: true, wrongs: [{ vals: wrongVals, code: cp + 'eq-sign', hint: 'Check the sign of ' + t('b') + ' in ' + t('x=\\frac{-b\\pm\\sqrt{b^{2}-4ac}}{2a}') + '.' }] }, sol,
      ['Multiply every term by the LCD and write the quadratic in standard form.', 'It does not factor: use ' + t('x=\\frac{-b\\pm\\sqrt{b^{2}-4ac}}{2a}') + ' and simplify the radical.'], 'exact roots: the quadratic formula');
    p.bad = ['\\text{no solution}', v + '=' + X.tex[0]];
    return p;
  };
  /* one root of x + k/x = b given: the other root (L8 #11) */
  B.eqRootK = function (r, cp) {
    var v = 'x', s = pickWhere(function () { return { r0: nz(r, 1, 8), r1: nz(r, 1, 9), neg: r.chance(0.3) }; }, function (z) { return z.r0 !== z.r1 && z.r0 + z.r1 !== 0 && Math.abs(z.r0 * z.r1) <= 60 && z.r0 * z.r1 !== z.r0 + z.r1; });
    var b = s.r0 + s.r1, k = s.r0 * s.r1;
    var eq = v + '+\\frac{k}{' + v + '}=' + b;
    var sol = 'Substitute ' + t(v + '=' + s.r0) + ': ' + t(s.r0 + '+\\frac{k}{' + s.r0 + '}=' + b) + ', so ' + t('\\frac{k}{' + s.r0 + '}=' + (b - s.r0)) + ' and ' + t('k=' + k) + '.<br>' + t(v + (k < 0 ? '-' : '+') + '\\frac{' + Math.abs(k) + '}{' + v + '}=' + b) + ': multiply by ' + t(v) + ' (' + t(v + '\\ne 0') + '): ' + t(tx(P.add(M(1, v, 2), M(-b, v, 1), P.num(k))) + '=0') + ', ' + t('(' + tx(lin(1, -s.r0, v)) + ')(' + tx(lin(1, -s.r1, v)) + ')=0') + '. The other root is ' + t(v + '=' + s.r1) + '.';
    var p = KP.math(big('One root of ' + t(eq) + ' is ' + t(v + '=' + s.r0) + '. Determine the other root.'),
      K.value(s.r1, { diag: function (val) { if (val === k) return { code: cp + 'gave-k', hint: 'That is ' + t('k') + '. Put it back into the equation and solve for both roots.' }; if (val === s.r0) return { code: cp + 'gave-given', hint: 'That root was given: find the other one.' }; if (val === -s.r1) return { code: cp + 'k-sign', hint: 'Check the sign of the second factor.' }; return null; } }),
      String(s.r1), sol, ['Substitute the given root to find ' + t('k') + '.', 'Put ' + t('k') + ' back, multiply by ' + t(v) + ' and factor the quadratic.'], 'working backwards: k and the other root', { keys: 'u6num', before: v + '=' });
    p.bad = [String(k), String(s.r0), String(-s.r1)].filter(function (x, i, arr) { return x !== String(s.r1) && arr.indexOf(x) === i; });
    return p;
  };

  /* ======================================================================================================
   * AN6 — Lesson 9: problems
   * ====================================================================================================== */
  function nice(x) { return Math.abs(x - Math.round(x)) < 1e-9; }
  function hm(h) { var H = Math.floor(h + 1e-9), m = Math.round((h - H) * 60); return H ? H + ' h' + (m ? ' ' + m + ' min' : '') : m + ' min'; }
  /* work rate. mode 'together' | 'other' | 'faster' */
  B.wWork = function (r, cp, o) {
    o = o || {};
    var mode = o.mode || 'together', ctx = r.pick([['One printer', 'another printer', 'print the yearbooks', 'min', 'printers'], ['One hose', 'a second hose', 'fill a pond', 'min', 'hoses'], ['Kai', 'Mo', 'wash the team’s jerseys', 'h'], ['Ali', 'Sam', 'tile a floor', 'h'], ['One crew', 'a second crew', 'paint a house', 'h', 'crews'], ['One pump', 'a second pump', 'drain a pool', 'h', 'pumps'], ['Rae', 'Tom', 'paint a room', 'h']]);
    var u = ctx[3], A1 = ctx[0], B1 = ctx[1], job = ctx[2], p;
    if (mode === 'together') {
      var s = pickWhere(function () { return { a: r.int(2, u === 'min' ? 80 : 24), b: r.int(2, u === 'min' ? 80 : 24) }; }, function (z) { return z.a < z.b && nice(z.a * z.b / (z.a + z.b)) && z.a * z.b / (z.a + z.b) >= 2 && !(z.a === 30 && z.b === 45) && !(z.a === 40 && z.b === 60) && !(z.a === 3 && z.b === 6); });
      var tt = s.a * s.b / (s.a + s.b), L = s.a * s.b / gcd(s.a, s.b);
      p = KP.number(A1 + ' can ' + job + ' in ' + t(s.a) + ' ' + u + ' and ' + B1 + ' can do it in ' + t(s.b) + ' ' + u + '. How long does the job take working together?', tt,
        function (val) { if (val === s.a + s.b) return { code: cp + 'w-add', hint: 'Working together is <b>faster</b> than either one alone. Add the parts of the job done: ' + t('\\frac{t}{' + s.a + '}+\\frac{t}{' + s.b + '}=1') + '.' }; if (val === (s.a + s.b) / 2) return { code: cp + 'w-avg', hint: 'Do not average the times: together must take less time than the faster one alone. Use ' + t('\\frac{t}{' + s.a + '}+\\frac{t}{' + s.b + '}=1') + '.' }; return null; },
        t('\\frac{t}{' + s.a + '}+\\frac{t}{' + s.b + '}=1') + '. Multiply by ' + t(L) + ': ' + t((L / s.a) + 't+' + (L / s.b) + 't=' + L) + ', so ' + t((L / s.a + L / s.b) + 't=' + L) + ' and ' + t('t=' + tt) + ' ' + u + '.',
        ['In ' + t('t') + ' ' + u + ', the first does ' + t('\\frac{t}{' + s.a + '}') + ' of the job and the second ' + t('\\frac{t}{' + s.b + '}') + '.', 'Together they do the whole job: the parts add to ' + t(1) + '.'], 'work rate: together', { after: u });
      p.bad = [String(s.a + s.b), String((s.a + s.b) / 2)];
    } else if (mode === 'other') {
      var s2 = pickWhere(function () { return { a: r.int(3, 20), tt: r.int(2, 12) }; }, function (z) { return z.tt < z.a && nice(z.a * z.tt / (z.a - z.tt)) && z.a * z.tt / (z.a - z.tt) <= 60 && !(z.a === 6 && z.tt === 4) && z.a * z.tt / (z.a - z.tt) !== z.a; });
      var x = s2.a * s2.tt / (s2.a - s2.tt);
      var q2txt = ctx[4] ? 'Working together, two ' + ctx[4] + ' can ' + job + ' in ' + t(s2.tt) + ' ' + u + '. One of them alone needs ' + t(s2.a) + ' ' + u + '. How long would the other need alone?' : 'Working together, ' + A1 + ' and ' + B1 + ' can ' + job + ' in ' + t(s2.tt) + ' ' + u + '. ' + A1 + ' alone needs ' + t(s2.a) + ' ' + u + '. How long would ' + B1 + ' need alone?';
      p = KP.number(q2txt, x,
        function (val) { if (val === s2.a - s2.tt) return { code: cp + 'w-add', hint: 'Times do not subtract. In ' + t(s2.tt) + ' ' + u + ' the first does ' + t('\\frac{' + s2.tt + '}{' + s2.a + '}') + ' of the job; the second does the rest: ' + t('\\frac{' + s2.tt + '}{x}') + '.' }; if (val === s2.a) return { code: cp + 'w-other', hint: 'That is the time for the first one. Find the other’s time.' }; return null; },
        t('\\frac{' + s2.tt + '}{' + s2.a + '}+\\frac{' + s2.tt + '}{x}=1') + ' (' + t('x\\ne 0') + '). ' + t('\\frac{' + s2.tt + '}{x}=1-' + fr(s2.tt, s2.a) + '=' + fr(s2.a - s2.tt, s2.a)) + ', so ' + t('x=' + x) + ' ' + u + '.',
        ['Let ' + t('x') + ' be the time alone. In ' + t(s2.tt) + ' ' + u + ' each does ' + t('\\frac{' + s2.tt + '}{\\text{its time}}') + ' of the job.', 'The two parts add to the whole job, ' + t(1) + '.'], 'work rate: the other time', { after: u });
      p.bad = [String(s2.a - s2.tt), String(s2.a)];
    } else {
      var s3 = pickWhere(function () { return { x: r.int(2, 20), h: r.int(1, 15) }; }, function (z) { var T = z.x * (z.x + z.h) / (2 * z.x + z.h); return nice(T) && !(z.x === 3 && z.h === 3) && !(z.x === 9 && z.h === 9) && z.x + z.h <= 30; });
      var T = s3.x * (s3.x + s3.h) / (2 * s3.x + s3.h), slow = r.chance(0.5), want = slow ? s3.x + s3.h : s3.x, negR = -(s3.h - 2 * T) - s3.x;
      p = KP.number('A new machine can package an order ' + t(s3.h) + ' h faster than an old machine. Using both machines, the order takes ' + t(T) + ' h. How long does the ' + (slow ? 'old' : 'new') + ' machine take alone?', want,
        function (val) { if (val === (slow ? s3.x : s3.x + s3.h)) return { code: cp + 'w-other', hint: 'That is the time for the ' + (slow ? 'new' : 'old') + ' machine. The question asks for the ' + (slow ? 'old' : 'new') + ' one.' }; if (val === negR || val === negR + s3.h) return { code: cp + 'neg-root', hint: 'A time cannot be negative: reject that root.' }; return null; },
        'New machine ' + t('x') + ' h, old ' + t('x+' + s3.h) + ' h: ' + t('\\frac{' + T + '}{x}+\\frac{' + T + '}{x+' + s3.h + '}=1') + ' (' + t('x\\ne 0,\\ -' + s3.h) + ').<br>Multiply by ' + t('x(x+' + s3.h + ')') + ': ' + t(T + '(x+' + s3.h + ')+' + T + 'x=x(x+' + s3.h + ')') + ', so ' + t(tx(P.add(M(1, 'x', 2), M(s3.h - 2 * T, 'x', 1), P.num(-T * s3.h))) + '=0') + ', ' + t('(' + tx(lin(1, -s3.x)) + ')(' + tx(lin(1, -negR)) + ')=0') + '.<br>' + t('x=' + s3.x) + ' (reject ' + t('x=' + negR) + ': a time is positive). New machine ' + t(s3.x) + ' h, old machine ' + t(s3.x + s3.h) + ' h.',
        ['Let the new machine take ' + t('x') + ' hours; the old one takes ' + t('x+' + s3.h) + '. In ' + t(T) + ' h each does ' + t('\\frac{' + T + '}{\\text{its time}}') + ' of the job.', 'The parts add to ' + t(1) + '. Multiply by the LCD, solve the quadratic and reject the negative root.'], 'work rate: a quadratic', { after: 'h' });
      p.bad = [String(slow ? s3.x : s3.x + s3.h), String(negR)];
    }
    return p;
  };
  /* distance, speed and time. mode 'same' | 'wind' | 'diff' | 'round' */
  B.wSpeed = function (r, cp, o) {
    o = o || {};
    var mode = o.mode || 'same', p;
    if (mode === 'same') {
      var ctx = r.pick([['A train', 'a car', 'train', 'car'], ['A cyclist', 'a runner', 'cyclist', 'runner'], ['A bus', 'a cyclist', 'bus', 'cyclist'], ['A jet', 'a small plane', 'jet', 'small plane']]);
      var s = pickWhere(function () { return { s: r.int(ctx[2] === 'jet' ? 300 : 8, ctx[2] === 'jet' ? 700 : ctx[2] === 'train' ? 90 : 30), d: r.int(2, ctx[2] === 'jet' ? 200 : 40), T: r.pick([2, 3, 4, 5, 1.5, 2.5]) }; }, function (z) { return nice(z.s * z.T) && nice((z.s + z.d) * z.T) && (ctx[2] === 'jet' ? z.s % 10 === 0 && z.d % 10 === 0 : true) && !(z.s === 70 && z.d === 30); });
      var fast = s.s + s.d, d1 = fast * s.T, d2 = s.s * s.T, askFast = r.chance(0.4), want = askFast ? fast : s.s;
      p = KP.number(ctx[0] + ' travels ' + t(d1) + ' km in the same time that ' + ctx[1] + ' travels ' + t(d2) + ' km. The ' + ctx[2] + '’s average speed is ' + t(s.d) + ' km/h greater than the ' + ctx[3] + '’s. Determine the ' + (askFast ? ctx[2] : ctx[3]) + '’s average speed.', want,
        function (val) { if (val === (askFast ? s.s : fast)) return { code: cp + 'w-other', hint: 'That is the other speed. The question asks for the ' + (askFast ? ctx[2] : ctx[3]) + '’s.' }; return null; },
        ctx[3].charAt(0).toUpperCase() + ctx[3].slice(1) + ' ' + t('s') + ', ' + ctx[2] + ' ' + t('s+' + s.d) + '. The times are equal: ' + t('\\frac{' + d1 + '}{s+' + s.d + '}=\\frac{' + d2 + '}{s}') + ' (' + t('s\\ne 0,\\ -' + s.d) + ').<br>Cross-multiply: ' + t(d1 + 's=' + d2 + '(s+' + s.d + ')') + ', so ' + t((d1 - d2) + 's=' + d2 * s.d) + ' and ' + t('s=' + s.s) + '.<br>The ' + ctx[3] + ' averages ' + t(s.s) + ' km/h and the ' + ctx[2] + ' ' + t(fast) + ' km/h (each takes ' + hm(s.T) + ').',
        ['Time ' + t('=\\frac{\\text{distance}}{\\text{speed}}') + '. Let the slower speed be ' + t('s') + '.', 'The times are equal: write one fraction on each side and cross-multiply.'], 'distance, speed, time: the same time', { after: 'km/h' });
      p.bad = [String(askFast ? s.s : fast)];
    } else if (mode === 'wind') {
      var plane = r.chance(0.6);
      if (plane) {
        var z = pickWhere(function () { return { a: 10 * r.int(12, 50), w: 10 * r.int(2, 8), T: r.pick([2, 3, 1.5, 2.5]) }; }, function (q) { return q.w < q.a / 3 && nice((q.a + q.w) * q.T) && !(q.a === 195) && !(q.a === 400 && q.w === 50); });
        var dT = (z.a + z.w) * z.T, dH = (z.a - z.w) * z.T;
        p = KP.number('With a ' + t(z.w) + ' km/h tailwind, a small plane flies ' + t(dT) + ' km in the same time it flies ' + t(dH) + ' km into the same wind (a headwind). Determine the plane’s airspeed (its speed in still air).', z.a,
          function (val) { if (val === z.a + z.w || val === z.a - z.w) return { code: cp + 'w-other', hint: 'That is the ground speed with the wind. The airspeed is the speed in still air, ' + t('s') + '.' }; return null; },
          t('\\frac{' + dT + '}{s+' + z.w + '}=\\frac{' + dH + '}{s-' + z.w + '}') + ' (' + t('s\\ne\\pm ' + z.w) + '). Cross-multiply: ' + t(dT + '(s-' + z.w + ')=' + dH + '(s+' + z.w + ')') + ', so ' + t((dT - dH) + 's=' + (dT + dH) * z.w) + ' and ' + t('s=' + z.a) + ' km/h. (Each flight takes ' + hm(z.T) + '.)',
          ['With the wind the speed is ' + t('s+' + z.w) + '; against it, ' + t('s-' + z.w) + '.', 'The times are equal: ' + t('\\frac{\\text{distance}}{\\text{speed}}') + ' on each side. Cross-multiply.'], 'wind: the same time', { after: 'km/h' });
        p.bad = [String(z.a + z.w), String(z.a - z.w)];
      } else {
        var y = pickWhere(function () { return { b: r.int(8, 30), c: r.int(1, 6), T: r.pick([1, 1.5, 2, 2.5, 3]) }; }, function (q) { return q.c < q.b / 2 && nice((q.b + q.c) * q.T) && nice((q.b - q.c) * q.T) && !(q.b === 20 && q.c === 4); });
        var dD = (y.b + y.c) * y.T, dU = (y.b - y.c) * y.T;
        p = KP.number('A boat that travels at ' + t(y.b) + ' km/h in still water goes ' + t(dD) + ' km downstream in the same time it goes ' + t(dU) + ' km upstream. Determine the speed of the current.', y.c,
          function (val) { if (val === y.b + y.c || val === y.b - y.c) return { code: cp + 'w-other', hint: 'That is the boat’s speed with or against the current. The question asks for the current ' + t('c') + '.' }; return null; },
          t('\\frac{' + dD + '}{' + y.b + '+c}=\\frac{' + dU + '}{' + y.b + '-c}') + ' (' + t('c\\ne\\pm ' + y.b) + '). Cross-multiply: ' + t(dD + '(' + y.b + '-c)=' + dU + '(' + y.b + '+c)') + ', so ' + t((dD - dU) * y.b + '=' + (dD + dU) + 'c') + ' and ' + t('c=' + y.c) + ' km/h. (Each trip takes ' + hm(y.T) + '.)',
          ['Downstream the speed is ' + t(y.b + '+c') + '; upstream, ' + t(y.b + '-c') + '.', 'The times are equal: cross-multiply and solve for ' + t('c') + '.'], 'current: the same time', { after: 'km/h' });
        p.bad = [String(y.b + y.c)];
      }
    } else if (mode === 'diff') {
      var slower = r.chance(0.4), ctx2 = r.pick([['cycles', 'ride'], ['drives', 'drive'], ['runs', 'run']]);
      var q2 = pickWhere(function () { var cyc = ctx2[0] === 'drives' ? 0 : 1; return { s: cyc ? r.int(6, 25) : 5 * r.int(10, 20), dl: cyc ? r.int(2, 6) : 5 * r.int(1, 5), h: r.pick([1, 0.5, 2, 1.5]) }; }, function (z) { var d = z.h * z.s * (z.s + z.dl) / z.dl; return nice(d) && d <= 400 && d >= 20 && !(z.s === 15 && z.dl === 5) && !(z.s === 75 && z.dl === 15) && !(z.s === 70 && z.dl === 10) && !(z.s === 75 && z.dl === 25); });
      var D = q2.h * q2.s * (q2.s + q2.dl) / q2.dl, neg = -q2.dl - q2.s, Hs = q2.h === 0.5 ? '30 minutes' : q2.h === 1.5 ? '1.5 hours' : q2.h + (q2.h === 1 ? ' hour' : ' hours');
      var there = slower && r.chance(0.5), want2 = there ? q2.s + q2.dl : q2.s, hT = q2.h === 1 ? '1' : q2.h === 2 ? '2' : q2.h === 0.5 ? '\\frac{1}{2}' : '\\frac{3}{2}';
      var prompt = slower ? 'On the way home from a lake ' + t(D) + ' km away, in heavy traffic, a family averages ' + t(q2.dl) + ' km/h less than on the way there, and the trip home takes ' + Hs + ' longer. Determine the average speed on the way ' + (there ? 'there' : 'home') + '.'
        : 'Priya ' + ctx2[0] + ' ' + t(D) + ' km. If she went ' + t(q2.dl) + ' km/h faster, the trip would take ' + Hs + ' less. Determine her actual average speed.';
      var eqT = slower ? '\\frac{' + D + '}{s}-\\frac{' + D + '}{s+' + q2.dl + '}=' + hT : '\\frac{' + D + '}{s}-\\frac{' + D + '}{s+' + q2.dl + '}=' + hT;
      var quad = tx(P.add(M(1, 's', 2), M(q2.dl, 's', 1), P.num(-D * q2.dl / q2.h)));
      p = KP.number(prompt, want2, function (val) { if (val === (there ? q2.s : q2.s + q2.dl)) return { code: cp + 'w-other', hint: 'That is the other speed. Check which trip the question asks about.' }; if (val === neg || val === -neg) return { code: cp + 'neg-root', hint: 'Reject the negative root, and check which speed it gives.' }; return null; },
        (slower ? 'Home speed ' + t('s') + ', speed there ' + t('s+' + q2.dl) + '. The trip home takes ' + Hs + ' longer: ' : 'Actual speed ' + t('s') + ', faster ' + t('s+' + q2.dl) + '. The faster trip takes ' + Hs + ' less: ') + t(eqT) + ' (' + t('s\\ne 0,\\ -' + q2.dl) + ').<br>Multiply by ' + t((q2.h === 1 ? '' : q2.h === 2 ? '' : '2') + 's(s+' + q2.dl + ')') + ' and simplify: ' + t(quad + '=0') + ', so ' + t('(s-' + q2.s + ')(s+' + (q2.s + q2.dl) + ')=0') + '.<br>' + t('s=' + q2.s) + ' (reject ' + t('s=' + neg) + '). ' + (slower ? 'Home: ' + t(q2.s) + ' km/h; there: ' + t(q2.s + q2.dl) + ' km/h.' + (there ? ' The question asks for the speed there: ' + t(q2.s + q2.dl) + ' km/h.' : '') : 'Her actual speed is ' + t(q2.s) + ' km/h (' + hm(D / q2.s) + ').'),
        ['Time ' + t('=\\frac{\\text{distance}}{\\text{speed}}') + '. Write the two times; the slower trip’s time minus the faster trip’s time is the difference.', 'Multiply by the LCD, solve the quadratic and reject the negative root.'], 'distance, speed, time: a quadratic', { after: 'km/h' });
      p.bad = [String(there ? q2.s : q2.s + q2.dl), String(neg)].filter(function (b) { return b !== String(want2); });
    } else {
      var q3 = pickWhere(function () { return { b: r.int(4, 15), c: r.int(1, 5), d: r.int(4, 30) }; }, function (z) { var T = 2 * z.b * z.d / (z.b * z.b - z.c * z.c); return z.c < z.b && nice(2 * T) && T <= 10 && !(z.b === 6 && z.c === 2 && z.d === 12); });
      var T3 = 2 * q3.b * q3.d / (q3.b * q3.b - q3.c * q3.c), T3t = nice(T3) ? String(T3) : '\\frac{' + 2 * T3 + '}{2}';
      p = KP.number('A canoeist who paddles at ' + t(q3.b) + ' km/h in still water goes ' + t(q3.d) + ' km downstream and returns to the start in a total of ' + t(T3) + ' h. Determine the speed of the current.', q3.c,
        function (val) { if (val === -q3.c) return { code: cp + 'neg-root', hint: 'A speed of the current is positive: reject the negative root.' }; return null; },
        t('\\frac{' + q3.d + '}{' + q3.b + '+c}+\\frac{' + q3.d + '}{' + q3.b + '-c}=' + T3t) + ' (' + t('c\\ne\\pm ' + q3.b) + ').<br>Multiply by ' + t('(' + q3.b + '+c)(' + q3.b + '-c)') + ': ' + t(q3.d + '(' + q3.b + '-c)+' + q3.d + '(' + q3.b + '+c)=' + T3 + '(' + q3.b * q3.b + '-c^{2})') + ', so ' + t(2 * q3.b * q3.d + '=' + K.roundTo(T3 * q3.b * q3.b, 6) + '-' + T3 + 'c^{2}') + ' and ' + t('c^{2}=' + q3.c * q3.c) + '.<br>' + t('c=' + q3.c) + ' km/h (reject ' + t('c=-' + q3.c) + ').',
        ['Downstream speed ' + t(q3.b + '+c') + ', upstream ' + t(q3.b + '-c') + '. Add the two times.', 'Multiply by the LCD: the ' + t('c') + ' terms cancel and you get ' + t('c^{2}') + '.'], 'current: a round trip', { after: 'km/h' });
      p.bad = [String(-q3.c), String(q3.c * q3.c)].filter(function (b) { return b !== String(q3.c); });
    }
    return p;
  };
  /* a number and its reciprocal (L9 #1, L10 #23, EP10 B2). mode 'recip' (two answers) | 'pos' */
  B.wNum = function (r, cp, o) {
    o = o || {};
    var mode = o.mode || 'pos', p;
    if (mode === 'recip') {
      var s = pickWhere(function () { return { a: r.int(1, 7), b: r.int(2, 9) }; }, function (z) { return z.a < z.b && gcd(z.a, z.b) === 1 && !(z.a === 2 && z.b === 5); });
      var num = s.a * s.a + s.b * s.b, den = s.a * s.b;
      p = rootsPart(cp, 'The sum of a number and its reciprocal is ' + t('\\frac{' + num + '}{' + den + '}') + '. Determine the number. (Give every possibility.)', [ex.norm(s.a, s.b), ex.norm(s.b, s.a)], { v: 'n', bothValid: true },
        t('n+\\frac{1}{n}=\\frac{' + num + '}{' + den + '}') + ' (' + t('n\\ne 0') + '). Multiply by ' + t(den + 'n') + ': ' + t(den + 'n^{2}+' + den + '=' + num + 'n') + ', so ' + t(den + 'n^{2}-' + num + 'n+' + den + '=0') + ' and ' + t('(' + s.b + 'n-' + s.a + ')(' + s.a + 'n-' + s.b + ')=0') + '.<br>' + t('n=\\frac{' + s.a + '}{' + s.b + '}') + ' or ' + t('n=\\frac{' + s.b + '}{' + s.a + '}') + ' (both work).',
        ['Let the number be ' + t('n') + '; its reciprocal is ' + t('\\frac{1}{n}') + '.', 'Multiply by the LCD and solve the quadratic. Both roots may work.'], 'a number and its reciprocal');
      p.bad.push('n=' + fr(s.a, s.b));
    } else {
      var q = pickWhere(function () { return { n1: r.int(2, 12), n2: -r.int(1, 9) }; }, function (z) { var c = z.n1 + z.n2, d = -z.n1 * z.n2; return c > 0 && d > 1 && NAMES[d] && !(z.n1 === 5 && z.n2 === -2) && !(z.n1 === 3 && z.n2 === -2); });
      var c = q.n1 + q.n2, d = -q.n1 * q.n2;
      p = KP.number('A positive number is ' + t(c) + ' more than ' + NAMES[d] + ' its reciprocal. Determine the number.', q.n1,
        function (val) { if (val === q.n2) return { code: cp + 'neg-root', hint: 'The number is positive: reject the negative root.' }; return null; },
        t('n=' + c + '+\\frac{' + d + '}{n}') + ' (' + t('n\\ne 0') + '). Multiply by ' + t('n') + ': ' + t('n^{2}=' + c + 'n+' + d) + ', so ' + t('n^{2}-' + (c === 1 ? '' : c) + 'n-' + d + '=0') + ' and ' + t('(n-' + q.n1 + ')(n+' + (-q.n2) + ')=0') + '.<br>' + t('n=' + q.n1) + ' (reject ' + t('n=' + q.n2) + ': the number is positive). Check: ' + t(c + '+\\frac{' + d + '}{' + q.n1 + '}=' + q.n1) + ' ✓.',
        ['Let the number be ' + t('n') + '. “' + NAMES[d].charAt(0).toUpperCase() + NAMES[d].slice(1) + ' its reciprocal” is ' + t('\\frac{' + d + '}{n}') + '.', 'Multiply by ' + t('n') + ', solve the quadratic and keep the positive root.'], 'a number and its reciprocal');
      p.bad = [String(q.n2), String(-q.n2)].filter(function (b) { return b !== String(q.n1); });
    }
    return p;
  };
  /* which equation models a same-time problem (L9 #16, EP10 A10) */
  B.wModel = function (r, cp) {
    var s = pickWhere(function () { return { s: 10 * r.int(4, 10), d: 2 * r.int(3, 10), T: r.pick([2, 3, 4]) }; }, function (z) { return !(z.s === 60 && z.d === 12); });
    var d1 = s.s * s.T, d2 = (s.s + s.d) * s.T;
    var opts = [
      { html: t('\\frac{' + d1 + '}{s}=\\frac{' + d2 + '}{s+' + s.d + '}'), right: true },
      { html: t('\\frac{' + d1 + '}{s+' + s.d + '}=\\frac{' + d2 + '}{s}'), why: 'That gives Liam the faster speed. Liam is the slower driver: his speed is ' + t('s') + '.', code: cp + 'w-model' },
      { html: t(d1 + 's=' + d2 + '(s+' + s.d + ')'), why: 'Time is distance <b>divided</b> by speed, not multiplied.', code: cp + 'w-model' },
      { html: t('\\frac{' + d1 + '}{s}+\\frac{' + d2 + '}{s+' + s.d + '}=' + s.d), why: 'The times are <b>equal</b>; nothing is added.', code: cp + 'w-model' }
    ];
    return KP.mc(r, 'Liam drives ' + t(d1) + ' km in the same time that Noor drives ' + t(d2) + ' km. Noor’s average speed is ' + t(s.d) + ' km/h greater than Liam’s. If Liam’s average speed is ' + t('s') + ' km/h, which equation can be used to determine ' + t('s') + '?', opts,
      'The times ' + t('\\frac{\\text{distance}}{\\text{speed}}') + ' are equal: Liam ' + t('\\frac{' + d1 + '}{s}') + ', Noor ' + t('\\frac{' + d2 + '}{s+' + s.d + '}') + '. (Solving: ' + t('s=' + s.s) + ' km/h.)',
      ['Time ' + t('=\\frac{\\text{distance}}{\\text{speed}}') + '. Who is faster?', 'The two times are equal.'], 'model a same-time problem');
  };

  HW.u6assess = { B: B, simpPart: simpPart, ratPart: ratPart, npvPart: npvPart, rootsPart: rootsPart };

  /* ======================================================================================================
   * The unit test
   * ====================================================================================================== */
  var CP = 'u6t-';
  function mk(fn, o) { return function (r) { return fn(r, CP, o); }; }
  function Pt(id, outcome, level, make) { return { id: id, outcome: outcome, level: level, make: make }; }
  var QUESTIONS = [
    // ---------------- Beginning ----------------
    { num: '1', outcome: 'AN4', lesson: 'L1', stem: 'Non-permissible values and evaluating.', parts: [Pt('1a', 'AN4', 'BEG', mk(B.npv, { mode: 'lin' })), Pt('1b', 'AN4', 'BEG', mk(B.evalAt))] },
    { num: '2', outcome: 'AN4', lesson: 'L2', stem: 'Simplifying.', parts: [Pt('2', 'AN4', 'BEG', mk(B.simpMono))] },
    { num: '3', outcome: 'AN5', lesson: 'L3, L4', stem: 'Multiplying and dividing.', parts: [Pt('3a', 'AN5', 'BEG', mk(B.mulMono)), Pt('3b', 'AN5', 'BEG', mk(B.divRat, { mode: 'bin' }))] },
    { num: '4', outcome: 'AN5', lesson: 'L5, L6', stem: 'Adding and subtracting.', parts: [Pt('4a', 'AN5', 'BEG', function (r) { return r.chance(0.5) ? B.addSame(r, CP) : B.addMono(r, CP, { mode: 'num' }); }), Pt('4b', 'AN5', 'BEG', mk(B.addBin, { mode: 'lin' }))] },
    { num: '5', outcome: 'AN6', lesson: 'L7', stem: 'Rational equations.', parts: [Pt('5a', 'AN6', 'BEG', mk(B.npvEq)), Pt('5b', 'AN6', 'BEG', mk(B.eqMono))] },
    { num: '6', outcome: 'AN6', lesson: 'L7, L8', stem: 'Rational equations.', parts: [Pt('6a', 'AN6', 'BEG', mk(B.eqCross, { mode: 'lin' })), Pt('6b', 'AN6', 'BEG', mk(B.eqQuad))] },
    // ---------------- Progressing ----------------
    { num: '7', outcome: 'AN4', lesson: 'L1, L2', stem: 'Factor first.', parts: [Pt('7a', 'AN4', 'PRG', mk(B.npv, { mode: 'fac' })), Pt('7b', 'AN4', 'PRG', function (r) { return B.simpRat(r, CP, { mode: r.pick(['tri', 'a', 'a', 'cubic']) }); }), Pt('7c', 'AN4', 'PRG', mk(B.simpRat, { mode: 'opp' }))] },
    { num: '8', outcome: 'AN5', lesson: 'L3, L4', stem: 'Multiplying and dividing.', parts: [Pt('8a', 'AN5', 'PRG', function (r) { return B.mulRat(r, CP, { mode: r.chance(0.6) ? 'tri' : 'opp' }); }), Pt('8b', 'AN5', 'PRG', mk(B.divRat, { mode: 'tri' }))] },
    { num: '9', outcome: 'AN5', lesson: 'L5, L6', stem: 'Adding and subtracting.', parts: [Pt('9a', 'AN5', 'PRG', function (r) { return B.addMono(r, CP, { mode: r.chance(0.7) ? 'bin' : 'whole' }); }), Pt('9b', 'AN5', 'PRG', function (r) { return B.addBin(r, CP, { mode: r.chance(0.55) ? 'tri' : 'gcf' }); })] },
    { num: '10', outcome: 'AN5', lesson: 'L6', stem: 'Adding and subtracting.', parts: [Pt('10', 'AN5', 'PRG', function (r) { return B.addBin(r, CP, { mode: r.chance(0.6) ? 'num' : 'opp' }); })] },
    { num: '11', outcome: 'AN6', lesson: 'L7', stem: 'A rational equation.', parts: [Pt('11', 'AN6', 'PRG', function (r) { return B.eqBin(r, CP, { none: r.chance(0.35) }); })] },
    { num: '12', outcome: 'AN6', lesson: 'L8', stem: 'An extraneous root.', parts: [Pt('12', 'AN6', 'PRG', mk(B.eqExtr))] },
    { num: '13', outcome: 'AN6', lesson: 'L9', stem: 'A problem.', parts: [Pt('13', 'AN6', 'PRG', function (r) { var k = r.pick(['same', 'wind', 'together', 'other']); return k === 'same' || k === 'wind' ? B.wSpeed(r, CP, { mode: k }) : B.wWork(r, CP, { mode: k }); })] },
    // ---------------- Mastery ----------------
    { num: '14', outcome: 'AN4', lesson: 'L1, L2', stem: 'Working backwards.', parts: [Pt('14', 'AN4', 'MAS', function (r) { return r.chance(0.5) ? B.simpK(r, CP) : B.npvK(r, CP); })] },
    { num: '15', outcome: 'AN5', lesson: 'L4', stem: 'Three expressions.', parts: [Pt('15', 'AN5', 'MAS', mk(B.mixed3))] },
    { num: '16', outcome: 'AN5', lesson: 'L6', stem: 'A sum that simplifies.', parts: [Pt('16', 'AN5', 'MAS', mk(B.addBin, { mode: 'red' }))] },
    { num: '17', outcome: 'AN6', lesson: 'L8', stem: 'A rational equation.', parts: [Pt('17', 'AN6', 'MAS', function (r) { return r.chance(0.7) ? B.eqFormula(r, CP) : B.eqRootK(r, CP); })] },
    { num: '18', outcome: 'AN6', lesson: 'L9', stem: 'A problem that leads to a quadratic.', parts: [Pt('18', 'AN6', 'MAS', function (r) { var k = r.pick(['diff', 'diff', 'round', 'faster', 'recip']); return k === 'faster' ? B.wWork(r, CP, { mode: 'faster' }) : k === 'recip' ? B.wNum(r, CP, { mode: 'recip' }) : B.wSpeed(r, CP, { mode: k }); })] }
  ];

  HW.defineTest({
    id: 'u6test', unit: 6, title: 'Unit 6 Test', outcome: 'AN4', calc: true,
    blurb: 'The Unit 6 outcomes-based test on AN4 (non-permissible values, evaluating and simplifying rational expressions), AN5 (multiplying, dividing, adding and subtracting rational expressions) and AN6 (rational equations and problems) — in Beginning, Progressing and Mastery boxes. Calculator allowed; answers exact.',
    // Short version (~half the time): NPVs and evaluating, a division, a binomial sum, two equations at Beginning; simplifying
    // with factoring and opposites, a trinomial division and sum, an equation (sometimes no solution) and an extraneous root
    // at Progressing; working backwards, a sum that simplifies and a quadratic problem at Mastery.
    short: ['1', '3b', '4b', '5b', '6b', '7bc', '8b', '9b', '11', '12', '14', '16', '18'],
    questions: QUESTIONS
  });
})(window);
