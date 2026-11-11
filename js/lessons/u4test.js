/* Math 20-1 · Unit 4 Test (RF1, RF5, AN3) — Factoring, Quadratic Equations and Radical Equations: the GCF, grouping,
 * x² + bx + c, ax² + bx + c by decomposition, rational coefficients, perfect squares, substitution (quadratic form, a
 * repeated binomial, two binomials), differences of squares (also of binomials), solving by factoring, equations from their
 * roots, problems leading to a quadratic, restrictions, radical equations, extraneous roots, equations that lead to
 * quadratics and squaring twice. Written from Ryan's Unit 4 booklet (m201book/unit4: Lessons 1–8, their assignments and
 * extra practice; Lesson 8's assignment and EP08 are the practice tests that set the style and difficulty). There is no
 * older test for this course. One 75-minute class, NO calculator; three outcomes, each with Beginning, Progressing and
 * Mastery boxes; 22 questions / 36 parts:
 *   RF1 (factoring, L1–L4)       Beginning 4 questions / 7 parts, Progressing 3 / 7, Mastery 3 / 3
 *   RF5 (quadratic equations, L5) Beginning 2 / 3,                Progressing 2 / 3, Mastery 2 / 3
 *   AN3 (radical equations, L6–L7) Beginning 2 / 4,               Progressing 2 / 4, Mastery 2 / 2
 *
 * How each box is pitched:
 *   Beginning  — each lesson's core skill as first taught: a GCF (a negative one when the first term is negative) and
 *                x² + bx + c (L1 Ex 1, Ex 4, #1, #4); decomposition and a perfect-square trinomial (L2 Ex 2, Ex 8, #1, #11);
 *                x⁴ + bx² + c (or x⁶, (xy)²) with no further factoring, and A² − B² (L3 Ex 1, L4 Ex 1, #1); recognising the
 *                expression that does not factor (MC: recognition, L4 #14, L8 #4g); the zero product property and
 *                a² x² − b² = 0 / ax² = bx / the zeros of y = x² + bx + c (L5 Ex 1–2, #1–3); an equation from two integer
 *                roots (L5 Ex 5a, #7a); restrictions of one radical (with the sign reversal) and of two radicals (L6 Ex 1,
 *                #1); √(ax + b) = c and k√(ax + b) + d = e (L6 Ex 2, #2–3).
 *   Progressing — the typical assignment question: factor fully with a GCF or a negative leading coefficient (monic and by
 *                decomposition, also with two variables) and with a fractional common factor (L1 #6, L2 #6–9); a quartic
 *                that finishes with differences of squares and a(mx + h)² + b(mx + h) + c (L3 #2–3, #6); grouping (two
 *                variables, rearranging, or a cubic that ends in a difference of squares) and (x + h)² − k², k² − (x + h)²
 *                or x⁴ − n⁴ (L1 #3, L4 Ex 9b, #6–7); solving after moving terms, clearing fractions or expanding first
 *                (L5 Ex 3–4, #4); an equation from a fractional or double root (L5 Ex 5, #7); a radical on each side (often
 *                extraneous) and an isolated radical that may equal a negative (L6 Ex 3–4, #4–5); the restrictions of
 *                √A = B and solving √(px + q) = x + c with an extraneous root (L7 Ex 2–4, #2, #4).
 *   Mastery    — the hardest assignment / extra-practice items: two repeated binomials aA² + bAB + cB², or a binomial
 *                substitution that leaves a common factor (L3 Ex 7b, #8, EP03 C2, L8 #24); a²(f(x))² − b²(g(x))² that
 *                simplifies to a common factor or a negative (L4 Ex 7, #7f/h, #13, EP04 B5); every integer k for which
 *                x² + kx + c or ax² + kx + c factors (L1 Ex 6b, #9, EP02 C1, L8 Ex 3c); a frame / path / rectangle problem
 *                with an inadmissible root (L5 Ex 7, EP05 B3, L8 Ex 6, EP08 #13); one root of ax² + kx + c = 0 given: k and
 *                the other root (working backwards, EP05 C1); two radicals squared twice, with an extraneous root (L7 Ex 7,
 *                #9, EP07 B2, L8 Ex 9, EP08 C4); a radical equation from words (a number and its square root, or a
 *                rectangle's diagonal) solved and checked (L7 Ex 8, #10–11, EP07 B3–B4).
 * Coverage: L1 Q1, Q9, Q11, Q18 · L2 Q2, Q9, Q18 · L3 Q3, Q10, Q16 · L4 Q3, Q4, Q11, Q17 · L5 Q5, Q6, Q12, Q13, Q19,
 *           Q20 · L6 Q7, Q8, Q14 · L7 Q15, Q21, Q22 · L8 (review) numbers and styles throughout (Q9, Q12, Q15, Q21).
 * Short version (def.short): Q2, Q5, Q8 (Beginning: RF1 2, RF5 2, AN3 2 parts), Q10, Q12, Q15 (Progressing: 2 each),
 * Q17, Q20, Q21 (Mastery: RF1 1, RF5 2, AN3 1) — about half the working time; every outcome keeps all three boxes.
 * Not used: numerical-response boxes ("record a, b, c and d") — the online version asks for the factored form or the value
 * itself; calculator items (the pendulum, decimal approximations, graphing-calculator intersect); "explain" items — their
 * checkable step is asked instead (the factored form, the root, the restriction); trigonometric quadratic forms.
 *
 * Answers are typed (one MC, Q4). Factored answers: K.factored (js/factor.js) — equal and factored completely, any order
 * and arrangement of signs and constants ((8 − x)(x + 6) = −(x − 8)(x + 6), ½(x − 4)(x + 2) = (½x − 2)(x + 2)); equal but
 * not factored completely (or a common factor left in a bracket) is a format nudge. Roots: a list "x = a, x = b" (± allowed;
 * any order; fractions or decimals), or "no solution". Restrictions: K.set (an inequality, an interval or set notation).
 * Equations from roots: the left side of "… = 0", any non-zero multiple with integer coefficients, expanded.
 * Every part has `bad` answers with u4t- codes; partial credit (one recognized mistake keeps 2/3 or 1/3) is decided below.
 *
 * The question builders are the Unit 4 assessment kit HW.u4assess (below); js/exits/u4.js uses them with u4x- codes, so
 * this file loads first. Nothing here depends on the practice files (js/lessons/u4l*.js). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, KP = K.P, P = HW.poly, FX = HW.factor, ex = HW.ex, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  if (!FX || !K.valueSet || !K.set) throw new Error('js/lessons/u4test.js needs js/factor.js and js/relfn.js');

  /* ======================================================================================================
   * Codes: one list, registered for both the test (u4t-) and the exit slips (u4x-), with partial-credit decisions
   * (s = small: keeps 2/3, b = big: keeps 1/3, n = none). Format nudges (v: 'form') only need labels.
   * ====================================================================================================== */
  var BASE = {
    'nf-claim': ['Said a factorable expression does not factor', 'n'], 'neg-signs': ['Negative common factor: signs in the bracket not all changed', 'b'],
    'drop-one': ['Dropped the 1 left by a term equal to the GCF', 's'], 'gcf-dropped': ['Dropped the common factor', 's'],
    'pair-signs': ['Pair with the wrong signs', 's'], 'pair-sum': ['Pair with the right product but the wrong sum', 'n'], 'pair-product': ['Pair with the right sum but the wrong product', 'n'],
    'swap-bc': ['Numbers multiply to b and add to c (roles swapped)', 'n'], 'group-sign': ['Wrong sign on a group’s common factor', 'b'],
    'sign-swap': ['Signs of both constants switched', 'b'], 'const-swap': ['Constant terms in the wrong brackets', 'b'], 'pair-as-factors': ['Wrote the decomposition pair into the brackets (as if a = 1)', 'n'],
    'allb-neg': ['Left out the values from negative factor pairs', 'b'], 'allb-extra': ['Listed a value that does not work', 'b'], 'allb-missing': ['Missed some of the values', 'b'],
    'pst-dos': ['Wrote a perfect square trinomial as a difference of squares', 'n'], 'pst-sign': ['Perfect square with the wrong sign in the bracket', 'b'],
    'pstk-half': ['Perfect square: middle term AB instead of 2AB', 'b'], 'pstk-root': ['Perfect square: gave B (or A) instead of its square', 'b'], 'pstk-sq': ['Perfect square: squared the middle coefficient', 'n'],
    'sum-split': ['Factored a sum of squares', 'n'], 'sub-noback': ['Substitution: did not put the expression back for A', 'b'], 'sub-bracket': ['Substitution: put the expression back without brackets', 'b'],
    'dos-square': ['Wrote a difference of squares as a perfect square', 'n'], 'no-root': ['Used a square instead of its square root in a bracket', 'b'], 'minus-bracket': ['Minus sign not applied to every term of the subtracted expression', 'b'],
    'zp-coef': ['Zero product: did not divide by the coefficient of x', 'b'], 'zp-const': ['Zero product: gave a root for a constant factor', 's'], 'zp-not0': ['Set each factor equal to a non-zero number', 'n'],
    'lost-root': ['Divided by a factor with x and lost a root', 'b'], 'eq-sign': ['Equation from roots: used (x + r) for the root r', 'b'],
    'neg-root': ['Kept the inadmissible (negative) root', 's'], 'gave-width': ['Gave a different dimension than the one asked for', 'b'], 'per-half': ['Perimeter: used L + W instead of 2(L + W)', 's'],
    'k-sign': ['Value with the wrong sign', 's'], 'gave-given': ['Gave the root that was given', 'n'],
    'res-sign': ['Restriction: sign slip moving the constant', 's'], 'res-dir': ['Restriction: inequality sign the wrong way', 'b'], 'res-strict': ['Restriction: used > instead of ≥', 's'],
    'res-one': ['Restriction: only one of the conditions', 'b'], 'res-comb': ['Restriction: combined the two conditions the wrong way', 'b'],
    'rad-nosq': ['Radical equation: did not square', 'n'], 'rad-coef': ['Radical equation: did not divide by (or square) the coefficient of the radical', 'b'],
    'extr': ['Kept an extraneous root', 'b'], 'nosol-claim': ['Said “no solution” when there is one', 'n'], 'nosol-eq': ['No solution: included the boundary (the radical can equal 0)', 's'],
    'rej-valid': ['Rejected a root that checks', 's'], 'sq-mid': ['Squared a binomial without its middle term', 'b'], 'gave-u': ['Gave √x (the value of u) instead of x', 'b'],
    'neg-gcf': ['Took out a positive factor when a negative one was asked (format)', ''], 'eq-std': ['Equation not in standard form (format)', ''], 'eq-expand': ['Equation not expanded (format)', ''], 'eq-int': ['Equation without integer coefficients (format)', '']
  };
  (function () {
    var codes = {}, part = {};
    Object.keys(BASE).forEach(function (k) { ['u4t-', 'u4x-'].forEach(function (cp) { codes[cp + k] = BASE[k][0]; if (BASE[k][1]) part[cp + k] = BASE[k][1]; }); });
    HW.addCodes(codes); HW.addPartial(part);
  })();

  /* ======================================================================================================
   * Small tools
   * ====================================================================================================== */
  var gcd = function (a, b) { return ex.gcd(Math.abs(a), Math.abs(b)); };
  function pickWhere(gen, test) { for (var i = 0; i < 6000; i++) { var o = gen(); if (o && test(o)) return o; } throw new Error('u4 assessments: no instance found'); }
  function nz(r, lo, hi) { return (r.chance(0.5) ? -1 : 1) * r.int(lo, hi); }
  function V(v, e) { var o = {}; o[v || 'x'] = e == null ? 1 : e; return P.mono(1, o); }
  function M(c, v, e) { if (!e) return P.num(c); var o = {}; o[v] = e; return P.mono(c, o); }
  function lin(a, b, v, w) { return P.add(M(a, v || 'x', 1), w ? M(b, w, 1) : P.num(b)); }
  function tx(p) { return P.tex(p); }
  function br(p) { return '(' + tx(p) + ')'; }
  function sg(n) { return n < 0 ? '-' + (-n) : '+' + n; }
  function par(n) { return n < 0 ? '(' + n + ')' : String(n); }
  function R(x) { return Array.isArray(x) ? ex.norm(x[0], x[1]) : [x, 1]; }
  function rv(x) { x = R(x); return x[0] / x[1]; }
  function fr(p, q) { return ex.texRat(ex.norm(p, q == null ? 1 : q)); }
  function rt(x) { return ex.texRat(R(x)); }
  function isSq(n) { if (n < 0) return false; var s = Math.round(Math.sqrt(n)); return s * s === n; }
  function isCube(n) { var s = Math.round(Math.cbrt(Math.abs(n))); return s * s * s === Math.abs(n); }
  function posPairs(n) { n = Math.abs(n); var o = []; for (var u = 1; u * u <= n; u++) if (n % u === 0) o.push([u, n / u]); return o; }
  function uniqNums(a) { var out = []; a.forEach(function (x) { if (!out.some(function (y) { return Math.abs(x - y) < 1e-9; })) out.push(x); }); return out; }
  function has(arr, x) { return arr.some(function (y) { return Math.abs(x - y) < 1e-9; }); }
  function coefT(c) { return c === 1 ? '' : c === -1 ? '-' : String(c); }
  function varsOf(p) { var vs = P.vars(p); return vs.length ? vs : ['x']; }
  function sqrtT(p) { return '\\sqrt{' + (typeof p === 'string' ? p : tx(p)) + '}'; }
  function kSqrt(k, p) { return coefT(k) + sqrtT(p); }
  /* a linear expression a·v + b written constant first when a < 0 (3 − 2x rather than −2x + 3) */
  function linT(a, b, v) { v = v || 'x'; if (a < 0 && b !== 0) return P.seq([P.num(b), M(a, v, 1)]); return tx(lin(a, b, v)); }
  function rootsTex(vals, v) { return vals.map(function (x) { return t((v || 'x') + '=' + rt(x)); }).join(' or '); }

  /* ======================================================================================================
   * Factoring parts (K.factored, js/factor.js)
   * ====================================================================================================== */
  function wfilter(target, ws) {
    var seen = [FX.product(target)], W = [], bad = [];
    (ws || []).forEach(function (w) {
      if (!w || !w.is) return;
      var p = Array.isArray(w.is) ? FX.product(w.is) : P.lift(w.is);
      if (seen.some(function (s) { return P.eq(s, p); })) return;
      seen.push(p); W.push({ is: w.is, code: w.code, hint: w.hint }); bad.push(Array.isArray(w.is) ? FX.tex(w.is) : tx(p));
    });
    return { W: W, bad: bad };
  }
  /* "does not factor" typed for an expression that factors is wrong (not a format nudge); an answer that is not a product at
     all (the expression typed back) shows no factoring: wrong, not the "form" nudge */
  function guard(cp, chk) {
    return function (resp) {
      var s = String(resp == null ? '' : resp).replace(/\\(text|mathrm|textrm)\{([^{}]*)\}/g, '$2').toLowerCase();
      if (/(^|[^a-z])(not|cannot|can't|doesn|prime|unfactorable|irreducible|none)([^a-z]|$)/.test(s)) return wrong(cp + 'nf-claim', 'It does factor. Take out any common factor first, then count the terms: two (a difference of squares?), three (a trinomial or quadratic form?), four (grouping?).');
      var res = chk(resp); return res && res.v === 'form' && res.code === 'not-factored' ? wrong('not-factored', res.hint) : res;
    };
  }
  function fpart(cp, prompt, target, ws, sol, hints, text, opt) {
    opt = opt || {};
    var f = wfilter(target, ws), keyTex = opt.keyTex || FX.tex(target);
    var part = KP.factored(prompt, target, Object.assign({}, opt, { wrong: f.W, keyTex: keyTex, vars: opt.vars || varsOf(FX.product(target)) }), sol, hints, text);
    part.check = guard(cp, part.check);
    part.bad = f.bad.concat(opt.bad || []).concat(['\\text{does not factor}']);
    return part;
  }
  /* the monomial factors of a typed answer multiply to a negative number? */
  function monoSign(resp) {
    var a = K.read(resp); if (a.res) return 0;
    var sp = FX.split(a.ast); if (!sp.ok) return 0;
    var s = 1; sp.factors.forEach(function (f) { if (P.count(f.p) === 1) { var c = P.terms(f.p)[0].c; if (c[0] < 0 && f.k % 2) s = -s; } });
    return s;
  }
  /* a list of factors with every bracket's common factor (and sign) taken out in front; equal brackets merged into a power */
  function cleanList(list) {
    var k = [1, 1], mono = {}, brs = [];
    list.forEach(function (f) {
      var p = f && f.p ? P.lift(f.p) : P.lift(f), m = f && f.k ? f.k : 1;
      if (P.count(p) <= 1) { var tm = P.terms(p)[0]; for (var i = 0; i < m; i++) k = ex.norm(k[0] * tm.c[0], k[1] * tm.c[1]); Object.keys(tm.v).forEach(function (x) { mono[x] = (mono[x] || 0) + tm.v[x] * m; }); return; }
      var cn = FX.content(p); for (var j = 0; j < m; j++) k = ex.norm(k[0] * cn.c[0], k[1] * cn.c[1]);
      Object.keys(cn.v).forEach(function (x) { mono[x] = (mono[x] || 0) + cn.v[x] * m; });
      var same = brs.filter(function (b) { return P.eq(b.p, cn.prim); })[0];
      if (same) same.k += m; else brs.push({ p: cn.prim, k: m });
    });
    var out = [], mp = P.mono(k, mono);
    if (!(k[0] === 1 && k[1] === 1 && !Object.keys(mono).length)) out.push(mp);
    brs.forEach(function (b) { out.push(b.k > 1 ? { p: b.p, k: b.k } : b.p); });
    return out;
  }

  /* ---------------- x² + bx + c (also with a GCF, a negative leading term, two variables) ---------------- */
  function spec(o) {
    var u = V(o.v || 'x'), w = o.y ? V(o.y) : null, G = o.G || P.num(1);
    var bin = function (n) { return P.add(u, P.scale(w || P.num(1), n)); };
    var A = bin(o.p), Bq = bin(o.q), inner = P.mul(A, Bq), full = P.mul(G, inner), g1 = P.eq(G, P.num(1));
    var list = o.p === o.q ? [{ p: A, k: 2 }] : [A, Bq];
    if (!g1) list = [G].concat(list);
    var gt = tx(G);
    return { u: u, w: w, G: G, g1: g1, p: o.p, q: o.q, b: o.p + o.q, c: o.p * o.q, A: A, B: Bq, bin: bin, inner: inner, full: full, list: list, key: FX.tex(list), gtex: gt, gpre: gt === '-1' ? '-' : gt };
  }
  function signHint(b, c) {
    if (c > 0) return b > 0 ? 'The product is positive and the sum is positive, so <b>both</b> integers are positive.' : 'The product is positive but the sum is negative, so <b>both</b> integers are negative.';
    return 'The product is negative, so one integer is positive and one is negative; the one further from ' + t('0') + ' has the sign of the sum, ' + t(b) + '.';
  }
  function coefRel(S, m) { var tm = P.terms(m)[0], c = P.coef(S, tm.v); return (c[0] * tm.c[1]) / (c[1] * tm.c[0]); }
  function pairDiag(cp, s) {
    var m2 = P.mul(s.G, P.pow(s.u, 2)), m1 = P.mul(s.G, s.u, s.w || 1), m0 = P.mul(s.G, s.w ? P.pow(s.w, 2) : 1);
    var b = s.b, c = s.c, inside = s.g1 ? '' : ' (inside the bracket)';
    return function (S) {
      var L = coefRel(S, m2), Mm = coefRel(S, m1), C = coefRel(S, m0);
      if (L !== 1 || Mm % 1 || C % 1) return null;
      if (!P.eq(S, P.add(m2, P.scale(m1, Mm), P.scale(m0, C)))) return null;
      var pre = 'Your factors multiply to ' + t(tx(S)) + ', not ' + t(tx(s.full)) + '. ';
      if (C === c && Mm === -b) return { code: cp + 'pair-signs', hint: pre + 'Your numbers multiply to ' + t(c) + ' but add to ' + t(-b) + ', not ' + t(b) + ': the signs are backwards. ' + signHint(b, c) };
      if (Mm === c && C === b && b !== c) return { code: cp + 'swap-bc', hint: pre + 'Your numbers multiply to ' + t(b) + ' and add to ' + t(c) + ': the wrong way round. They must <b>multiply to the constant</b> and <b>add to the middle coefficient</b>' + inside + '.' };
      if (C === c) return { code: cp + 'pair-sum', hint: pre + 'Your numbers multiply to ' + t(c) + ' ✓ but add to ' + t(Mm) + ', not ' + t(b) + '. Try another factor pair of ' + t(Math.abs(c)) + '.' };
      if (Mm === b && C === -c) return { code: cp + 'pair-signs', hint: pre + 'Your numbers add to ' + t(b) + ' ✓ but multiply to ' + t(-c) + ', not ' + t(c) + '. ' + signHint(b, c) };
      if (Mm === b) return { code: cp + 'pair-product', hint: pre + 'Your numbers add to ' + t(b) + ' ✓ but multiply to ' + t(C) + ', not ' + t(c) + '. The last terms of the brackets must multiply to the constant term' + inside + '.' };
      return null;
    };
  }
  function monicPart(cp, prompt, s, text) {
    var pre = s.g1 ? [] : [s.G], c = s.c, b = s.b, ws = [], bad = [];
    if (!s.g1) ws.push({ is: s.inner, code: cp + 'gcf-dropped', hint: 'Your brackets are right, but the common factor ' + t(s.gtex) + ' is missing. Multiply your answer out: you get ' + t(tx(s.inner)) + ', not ' + t(tx(s.full)) + '.' });
    ws.push({ is: pre.concat([s.bin(-s.p), s.bin(-s.q)]), code: cp + 'pair-signs', hint: 'Every sign in your brackets is backwards. ' + signHint(b, c) });
    var other = posPairs(c).map(function (pq) { return c > 0 ? (b > 0 ? pq : [-pq[0], -pq[1]]) : (b > 0 ? [pq[1], -pq[0]] : [-pq[1], pq[0]]); }).filter(function (pq) { return pq[0] + pq[1] !== b; })[0];
    if (other) bad.push(FX.tex(pre.concat([s.bin(other[0]), s.bin(other[1])])));
    var sol = (s.g1 ? '' : 'Take out the common factor ' + t(s.gtex) + ' first: ' + t(tx(s.full) + '=' + s.gpre + '(' + tx(s.inner) + ')') + '.<br>') +
      'Two integers with product ' + t(c) + ' and sum ' + t(b) + ': ' + t(sg(s.p)) + ' and ' + t(sg(s.q)) + '.' + (s.w ? ' The ' + t(tx(s.w)) + ' goes with the second term of each bracket.' : '') + '<br>' + t(tx(s.full) + '=' + s.key);
    var pair = 'Look for two integers with product ' + t(c) + ' and sum ' + t(b) + '.';
    var hints = s.g1 ? [pair, signHint(b, c)] : ['Every term has the common factor ' + t(s.gtex) + '. Take it out first, then factor the trinomial left in the bracket.', pair + ' ' + signHint(b, c)];
    return fpart(cp, prompt, s.list, ws, sol, hints, text, { diag: pairDiag(cp, s), keyTex: s.key, bad: bad });
  }
  function monicPair(r, hi) {
    return pickWhere(function () { return { p: nz(r, 1, hi || 9), q: nz(r, 1, hi || 9) }; },
      function (o) { return o.p !== o.q && o.p + o.q !== 0 && Math.abs(o.p * o.q) <= 90 && Math.abs(o.p) !== Math.abs(o.q) && Math.abs(o.p * o.q) > 1; });
  }

  /* ---------------- ax² + bx + c from (px + q)(rx + s) ---------------- */
  function axSpec(p, q, r2, s, v, w) {
    v = v || 'x';
    var A = lin(p, q, v, w), B = lin(r2, s, v, w);
    return { p: p, q: q, r: r2, s: s, v: v, w: w, A: A, B: B, full: P.mul(A, B), a: p * r2, b: p * s + q * r2, c: q * s, ac: p * r2 * q * s, m: p * s, n: q * r2 };
  }
  function axSol(o) {
    var v = o.v, W = o.w ? V(o.w) : P.num(1), lo = Math.min(o.m, o.n), hi = Math.max(o.m, o.n);
    var exp4 = [M(o.a, v, 2), P.mul(M(o.m, v, 1), W), P.mul(M(o.n, v, 1), W), P.mul(P.num(o.c), W, W)];
    var first = (o.p === 1 ? '' : o.p) + v, second = o.w ? (Math.abs(o.q) === 1 ? (o.q < 0 ? '-' : '+') : sg(o.q)) + o.w : sg(o.q);
    return t('ac=' + par(o.a) + '\\times ' + par(o.c) + '=' + o.ac) + '. Two integers with product ' + t(o.ac) + ' and sum ' + t(o.b) + ': ' + t(lo) + ' and ' + t(hi) + '.' +
      '<br>Split the middle term and group in pairs: ' + t(P.seq(exp4)) + '<br>' + t('=' + first + br(o.B) + second + br(o.B)) + '<br>' + t('=' + br(o.B) + br(o.A));
  }
  function axWrongs(cp, o, pre) {
    pre = pre || [];
    return [{ is: pre.concat([lin(o.p, -o.q, o.v, o.w), lin(o.r, -o.s, o.v, o.w)]), code: cp + 'sign-swap', hint: 'Your brackets give the middle term with the wrong sign. Expand your answer to check: the outside and inside products must add to the middle term.' },
      { is: pre.concat([lin(o.p, o.s, o.v, o.w), lin(o.r, o.q, o.v, o.w)]), code: cp + 'const-swap', hint: 'The first and last terms are right, but the constants are in the wrong brackets: the outside and inside products don’t add to the middle term.' },
      { is: pre.concat([lin(1, o.m, o.v, o.w), lin(1, o.n, o.v, o.w)]), code: cp + 'pair-as-factors', hint: 'The decomposition numbers don’t go straight into the brackets when ' + t('a\\ne 1') + '. Use them to split the middle term, then group in pairs.' }];
  }
  var HDEC = ['Find two integers with product ' + t('ac') + ' and sum ' + t('b') + '.', 'Split the middle term with them, then factor the four terms by grouping.'];

  /* ---------------- polynomial display helpers ---------------- */
  function seqDesc(p) { return P.seq(P.sorted(p).map(function (x) { return P.mono(x.c, x.v); })); }
  function seqAsc(p) { return P.seq(P.sorted(p).map(function (x) { return P.mono(x.c, x.v); }).reverse()); }

  var B = {};

  /* GCF, possibly negative, one or two variables (L1 Ex 1, #1) */
  B.gcf = function (r, cp) {
    var two = r.chance(0.45), neg = r.chance(0.45), vs = two ? r.pick([['a', 'b'], ['x', 'y'], ['m', 'n']]) : [r.pick(['x', 'y', 'p', 'a'])];
    var s = pickWhere(function () {
      var g = r.int(2, 9), n = r.chance(0.55) ? 3 : 2, ge = {}, terms = [], one = r.chance(0.3);
      vs.forEach(function (v) { ge[v] = r.int(1, 3); });
      for (var i = 0; i < n; i++) {
        var e = {}; vs.forEach(function (v) { e[v] = r.int(0, 3); });
        if (one && i === n - 1) { e = {}; terms.push(P.mono(r.chance(0.5) ? 1 : -1, e)); continue; }
        terms.push(P.mono((r.chance(0.5) ? -1 : 1) * r.int(1, 7), e));
      }
      return { g: g, ge: ge, inner: P.add.apply(null, terms), n: n };
    }, function (s) {
      if (P.count(s.inner) !== s.n) return false;
      var cn = FX.content(s.inner); if (cn.c[0] !== 1 || cn.c[1] !== 1 || Object.keys(cn.v).length) return false;
      if (P.degree(s.inner) < 1 || P.degree(s.inner) > 4) return false;
      var cs = P.terms(s.inner).map(function (x) { return Math.abs(x.c[0]); }); return Math.max.apply(null, cs) * s.g <= 60 && cs.some(function (c) { return c > 1; });
    });
    var G = P.mono((neg ? -1 : 1) * s.g, s.ge), inner = s.inner, full = P.mul(G, inner), sorted = P.sorted(inner).map(function (x) { return P.mono(x.c, x.v); });
    var ws = [], cst = P.constant(inner);
    if (neg) ws.push({ is: [G, P.add(sorted[0], P.neg(P.add.apply(null, sorted.slice(1))))], code: cp + 'neg-signs', hint: 'Dividing by a <b>negative</b> factor changes the sign of <b>every</b> term: check each sign in your bracket.' });
    if (cst[0] && Math.abs(cst[0]) === 1) ws.push({ is: [G, P.sub(inner, P.num(cst))], code: cp + 'drop-one', hint: 'One term equals the common factor itself: dividing it by the GCF leaves ' + t(cst[0] < 0 ? '-1' : '1') + ', which must stay in the bracket.' });
    var key = FX.tex([G, inner]), gp = P.mono(s.g, s.ge);
    var part = fpart(cp, 'Factor ' + t(tx(full)) + ' by taking out the greatest common factor' + (neg ? ' (take out a <b>negative</b> common factor).' : '.'), [G, inner], ws,
      'The greatest number that divides every coefficient is ' + t(s.g) + ', and the lowest power of each variable in every term gives ' + t(tx(P.mono(1, s.ge))) + ': the GCF is ' + t(tx(gp)) + (neg ? '; the first term is negative, so take out ' + t(tx(G)) + ' and every sign in the bracket changes' : '') + '.<br>Divide each term by it: ' + t(tx(full) + '=' + key) + '.',
      ['Find the largest number that divides every coefficient and the lowest power of each variable that is in every term.', neg ? 'The first term is negative: take out the negative of the GCF, so every sign in the bracket changes.' : 'Divide every term by the GCF. Check by expanding.'],
      'take out the GCF', { gcfOnly: true, keyTex: key });
    if (neg) { var chk = part.check; part.check = function (resp) { var res = chk(resp); if (res.v === 'correct' && monoSign(resp) > 0) return form(cp + 'neg-gcf', 'Right — now take out the <b>negative</b> common factor, ' + t(tx(G)) + ', as the question asks.'); return res; }; }
    return part;
  };

  /* x² + bx + c; mode 'full' adds a GCF / negative leading term / two variables (L1 Ex 4–6, #4–6) */
  B.monic = function (r, cp, opt) {
    opt = opt || {};
    var mode = opt.mode || 'basic', two = mode === 'two' || (mode === 'full' && r.chance(0.3));
    var vs = two ? r.pick([['x', 'y'], ['a', 'b'], ['m', 'n'], ['p', 'q']]) : [r.pick(['x', 'x', 'a', 'y', 'n', 't']), null];
    var pq = monicPair(r, two ? 8 : 9), G = P.num(1);
    if (mode === 'full') {
      var kind = r.pick(two ? ['num', 'var'] : ['num', 'neg', 'neg1', 'var']);
      G = kind === 'num' ? P.num(r.int(2, 6)) : kind === 'neg' ? P.num(-r.int(2, 5)) : kind === 'neg1' ? P.num(-1) : two ? M(r.int(2, 5), vs[1], 1) : M(r.int(1, 5), vs[0], r.int(1, 2));
    }
    var s = spec({ v: vs[0], y: vs[1], G: G, p: pq.p, q: pq.q });
    return monicPart(cp, (mode === 'full' ? 'Factor fully: ' : 'Factor ') + t(tx(s.full)) + '.', s, 'factor ' + tx(s.full));
  };

  /* four terms by grouping: a cubic (ax + p)(x² + q) (opt.dos: sometimes x² − m², finishing with a difference of squares),
     or (mY + n)(kX + l) written in an order that groups directly, with a negative second pair, or only after rearranging */
  B.grouping = function (r, cp, opt) {
    opt = opt || {};
    var cubic = opt.cubic != null ? opt.cubic : r.chance(0.45), A, Bq, terms, target, sol, ws = [];
    if (cubic) {
      var dos = !!opt.dos && r.chance(opt.dos), v = r.pick(['x', 'x', 'a', 'y']);
      var s = pickWhere(function () { return { a: r.pick([1, 1, 2, 3]), p: nz(r, 1, 7), q: dos ? -Math.pow(r.int(1, 5), 2) : nz(r, 1, 9) }; },
        function (z) { return gcd(z.a, z.p) === 1 && (dos || !(z.q < 0 && isSq(-z.q))) && Math.abs(z.p * z.q) <= 50 && z.p !== z.q; });
      A = lin(s.a, s.p, v); Bq = P.add(V(v, 2), P.num(s.q));
      terms = [M(s.a, v, 3), M(s.p, v, 2), M(s.a * s.q, v, 1), P.num(s.p * s.q)];
      var m = dos ? Math.round(Math.sqrt(-s.q)) : 0;
      target = dos ? [A, lin(1, -m, v), lin(1, m, v)] : [A, Bq];
      sol = 'Group in pairs and take out each pair’s common factor: ' + t(P.seq(terms) + '=' + v + '^{2}' + br(A) + sg(s.q) + br(A)) + '<br>' + t('=' + br(A) + br(Bq)) +
        (dos ? '<br>' + t(tx(Bq)) + ' is a difference of squares: ' + t('=' + FX.tex(target)) : '');
      ws.push({ is: [A, P.add(V(v, 2), P.num(-s.q))], code: cp + 'group-sign', hint: 'Check the sign of the common factor you took out of the second pair: expand your answer and compare.' });
    } else {
      var L = r.pick([['x', 'y'], ['a', 'b'], ['m', 'n'], ['p', 'q']]), X = L[0], Y = L[1];
      var z = pickWhere(function () { return { m: r.int(1, 5), n: nz(r, 1, 9), k: r.int(1, 5), l: nz(r, 1, 9), order: r.pick(['yx', 'xy', 're', 're']) }; },
        function (z) { return gcd(z.m, z.n) === 1 && gcd(z.k, z.l) === 1 && z.m * z.k > 1 && Math.abs(z.n * z.l) <= 45 && Math.abs(z.n) !== Math.abs(z.l) && (z.order !== 're' || gcd(z.m * z.k, z.n * z.l) === 1); });
      A = lin(z.m, z.n, Y); Bq = lin(z.k, z.l, X);
      var xy = P.mono(z.m * z.k, (function () { var o = {}; o[X] = 1; o[Y] = 1; return o; })()), ty = M(z.m * z.l, Y, 1), tX = M(z.n * z.k, X, 1), c0 = P.num(z.n * z.l);
      var gy = M(z.m, Y, 1), gx = M(z.k, X, 1);
      var byY = tx(gy) + br(Bq) + (z.n < 0 ? '-' : '+') + Math.abs(z.n) + br(Bq), byX = tx(gx) + br(A) + (z.l < 0 ? '-' : '+') + Math.abs(z.l) + br(A);
      if (z.order === 'yx') { terms = [xy, ty, tX, c0]; sol = 'Group in pairs: ' + t(P.seq(terms) + '=' + byY) + (z.n < 0 ? ' (a negative factor from the second pair)' : '') + '<br>' + t('=' + br(Bq) + br(A)); }
      else if (z.order === 'xy') { terms = [xy, tX, ty, c0]; sol = 'Group in pairs: ' + t(P.seq(terms) + '=' + byX) + (z.l < 0 ? ' (a negative factor from the second pair)' : '') + '<br>' + t('=' + br(A) + br(Bq)); }
      else { terms = r.chance(0.5) ? [xy, c0, tX, ty] : [xy, c0, ty, tX]; sol = 'The pairs as written share nothing. Rearrange: ' + t(P.seq([xy, ty, tX, c0])) + '<br>' + t('=' + byY) + '<br>' + t('=' + br(Bq) + br(A)); }
      target = [A, Bq];
      ws.push({ is: [Bq, lin(z.m, -z.n, Y)], code: cp + 'group-sign', hint: 'Check the sign of the common factor you took out of the second pair: expand your answer and compare.' });
      ws.push({ is: [A, lin(z.k, -z.l, X)], code: cp + 'group-sign', hint: 'Check the signs in your brackets: expand your answer and compare it with the four terms.' });
    }
    return fpart(cp, 'Factor ' + (cubic && opt.dos ? 'fully' : 'by grouping') + ': ' + t(P.seq(terms)) + '.', target, ws, sol,
      ['Four terms: group them in pairs and take the common factor out of each pair.', 'The two brackets must match. If they don’t, take a negative factor out of the second pair, or rearrange the terms.'], 'factor by grouping');
  };

  /* every integer b for which x² + bx + c factors (or every positive k for x² + bx + k) (L1 Ex 6b, #9) */
  B.allB = function (r, cp, opt) {
    opt = opt || {};
    var kind = opt.kind || r.pick(['b', 'b', 'neg', 'kpos']), vals, prompt, sol, v;
    if (kind === 'kpos') {
      var b = r.pick([6, 7, 8, 10, 11, 12]); v = 'k'; vals = [];
      for (var m = 1; m <= b / 2; m++) vals.push(m * (b - m));
      prompt = 'Determine all the <b>positive</b> integers ' + t('k') + ' for which ' + t('x^{2}+' + b + 'x+k') + ' can be factored over the integers.';
      sol = 'We need two integers with sum ' + t(b) + ' and product ' + t('k>0') + ', so both are positive: ' + vals.map(function (k, i) { return t((i + 1) + '+' + (b - i - 1)); }).join(', ') + '.<br>Their products: ' + t('k=' + vals.join(',\\ ')) + '.';
    } else {
      var c = kind === 'neg' ? -r.pick([8, 10, 14, 15, 16, 18, 20, 24, 28]) : r.pick([6, 8, 14, 16, 20, 21, 22, 24, 28]); v = 'b'; vals = [];
      var pairs = posPairs(c);
      pairs.forEach(function (pq) { var sum = c > 0 ? pq[0] + pq[1] : pq[1] - pq[0]; vals.push(sum); vals.push(-sum); });
      vals = uniqNums(vals).sort(function (a, b2) { return a - b2; });
      prompt = 'Determine all the integers ' + t('b') + ' for which ' + t('x^{2}+bx' + sg(c)) + ' can be factored over the integers.';
      sol = t('b') + ' is the sum of two integers with product ' + t(c) + '. Pairs: ' + pairs.map(function (pq) { return c > 0 ? t(pq[0] + ',\\ ' + pq[1]) + ' and ' + t(-pq[0] + ',\\ ' + (-pq[1])) : t(pq[0] + ',\\ ' + (-pq[1])) + ' and ' + t(-pq[0] + ',\\ ' + pq[1]); }).join('; ') + '.<br>Their sums: ' + t('b=' + vals.join(',\\ ')) + '.';
    }
    var pos = vals.filter(function (x) { return x > 0; });
    var part = KP.valueSet(prompt, vals, { v: v, diag: function (A, T) {
      var extra = A.filter(function (x) { return !has(T, x); }), miss = T.filter(function (x) { return !has(A, x); });
      if (extra.length) return { code: cp + 'allb-extra', hint: 'Check each value: ' + t(extra[0]) + ' is not ' + (kind === 'kpos' ? 'the product of two positive integers with sum ' + t(vals.length) : 'the sum of two integers with the right product') + '.' };
      if (kind !== 'kpos' && miss.length && miss.every(function (x) { return x <= 0; }) && A.every(function (x) { return x > 0; })) return { code: cp + 'allb-neg', hint: 'Negative factor pairs work too: each positive value of ' + t('b') + ' has a negative partner.' };
      if (miss.length) return { code: cp + 'allb-missing', hint: 'You are missing ' + (miss.length === 1 ? 'a value' : miss.length + ' values') + ': work through every factor pair in order.' };
      return null;
    } }, sol, [kind === 'kpos' ? 'The two integers in the brackets add to the middle coefficient and multiply to ' + t('k') + '.' : 'If ' + t('x^{2}+bx+c=(x+m)(x+n)') + ', then ' + t('mn=c') + ' and ' + t('m+n=b') + '.', 'List every pair in order' + (kind === 'kpos' ? '.' : ', with both signs.')], 'all values for which a trinomial factors');
    part.bad = [];
    if (kind !== 'kpos') part.bad.push(pos.map(function (x) { return v + '=' + x; }).join(',\\ '));
    if (vals.length > 2) part.bad.push(vals.slice(1).map(function (x) { return v + '=' + x; }).join(',\\ '));
    return part;
  };

  /* ax² + bx + c by decomposition; mode 'full': with a GCF or a negative leading coefficient (sometimes ascending order);
     mode 'two': two variables (L2 Ex 2–4, Ex 6, #1–2, #6–8) */
  B.decomp = function (r, cp, opt) {
    opt = opt || {};
    var mode = opt.mode || 'basic', two = mode === 'two', vs = two ? r.pick([['x', 'y'], ['a', 'b'], ['m', 'n']]) : [r.pick(['x', 'x', 'y', 'a', 'm', 't']), null];
    var z = pickWhere(function () { return { p: r.int(1, 5), q: nz(r, 1, 7), r: r.int(1, 5), s: nz(r, 1, 7) }; }, function (z) {
      var a = z.p * z.r, b = z.p * z.s + z.q * z.r, c = z.q * z.s;
      return a >= 2 && gcd(z.p, z.q) === 1 && gcd(z.r, z.s) === 1 && b !== 0 && !(z.p === z.r && z.q === z.s) && Math.abs(a * c) <= 150 && Math.abs(b) <= 30 && (z.p !== 1 || z.r !== 1) && z.p >= z.r && gcd(gcd(a, b), c) === 1;
    });
    var o = axSpec(z.p, z.q, z.r, z.s, vs[0], vs[1]), G = P.num(1), asc = false;
    if (mode === 'full') {
      var kind = r.pick(['num', 'num', 'neg1', 'negk', 'var']);
      G = kind === 'num' ? P.num(r.int(2, 5)) : kind === 'neg1' ? P.num(-1) : kind === 'negk' ? P.num(-r.int(2, 3)) : M(r.int(1, 3), vs[0], 1);
      asc = kind === 'neg1' && r.chance(0.5);
    }
    var g1 = P.eq(G, P.num(1)), full = P.mul(G, o.full), list = g1 ? [o.A, o.B] : [G, o.A, o.B], key = FX.tex(list), gt = tx(G), gpre = gt === '-1' ? '-' : gt;
    var shown = asc ? seqAsc(full) : tx(full);
    var ws = axWrongs(cp, o, g1 ? [] : [G]);
    if (!g1) ws.unshift({ is: [o.A, o.B], code: cp + 'gcf-dropped', hint: 'Your brackets are right, but the common factor ' + t(gt) + ' is missing.' });
    var sol = (g1 ? '' : 'Take out ' + t(gt) + ' first' + (P.lead(G)[0] < 0 ? ' (the leading coefficient is negative)' : '') + ': ' + t(shown + '=' + gpre + br(o.full)) + '.<br>') + axSol(o) + (g1 ? '' : '<br>' + t(shown + '=' + key));
    return fpart(cp, (mode === 'basic' ? 'Factor ' : 'Factor fully: ') + t(shown) + '.', list, ws, sol,
      g1 ? HDEC : ['Take out the common factor first' + (P.lead(G)[0] < 0 ? ' — a negative one, since the leading term is negative' : '') + '.', HDEC[0] + ' ' + HDEC[1]], 'factor by decomposition', { keyTex: key });
  };

  /* take out a fractional common factor (L2 Ex 7, #9) */
  B.ratcoef = function (r, cp) {
    var lcd = r.chance(0.3), target, full, sol, ws = [];
    if (!lcd) {
      var s = pickWhere(function () { return { n: r.pick([1, 1, 1, 2, 3]), d: r.pick([2, 3, 4, 5]), p: nz(r, 1, 9), q: nz(r, 1, 9) }; }, function (z) {
        if (gcd(z.n, z.d) !== 1 || z.n >= z.d * 2 || z.n === z.d || z.p === z.q || z.p + z.q === 0 || Math.abs(z.p * z.q) > 60) return false;
        var b = ex.norm(z.n * (z.p + z.q), z.d), c = ex.norm(z.n * z.p * z.q, z.d); return b[1] <= 5 && c[1] <= 5;
      });
      var f = [s.n, s.d], A = lin(1, s.p), Bq = lin(1, s.q), inner = P.mul(A, Bq);
      full = P.scale(inner, f); target = [P.num(f), A, Bq];
      sol = 'Take out ' + t(fr(s.n, s.d)) + ' (divide each term by it, that is, multiply by ' + t(fr(s.d, s.n)) + '): ' + t(tx(full) + '=' + fr(s.n, s.d) + br(inner)) + '.<br>Two integers with product ' + t(s.p * s.q) + ' and sum ' + t(s.p + s.q) + ': ' + t(s.p) + ' and ' + t(s.q) + '.<br>' + t('=' + FX.tex(target));
      ws.push({ is: [P.num(f), lin(1, -s.p), lin(1, -s.q)], code: cp + 'pair-signs', hint: 'Every sign in your brackets is backwards: expand your answer to check.' });
      ws.push({ is: [A, Bq], code: cp + 'gcf-dropped', hint: 'The brackets are right, but the fraction ' + t(fr(s.n, s.d)) + ' you took out is missing.' });
    } else {
      var z = pickWhere(function () { return { p: r.int(1, 3), q: nz(r, 1, 5), r: 1, s: nz(r, 1, 5), D: r.pick([2, 3, 4, 6]) }; }, function (z) {
        var a = z.p * z.r, b = z.p * z.s + z.q * z.r, c = z.q * z.s;
        if (a < 2 || gcd(z.p, z.q) !== 1 || b === 0 || gcd(gcd(a, b), c) !== 1) return false;
        var ds = [ex.norm(a, z.D)[1], ex.norm(b, z.D)[1], ex.norm(c, z.D)[1]];
        return ds.some(function (d) { return d === z.D; }) && ds.some(function (d) { return d !== z.D; }) && Math.abs(b) <= 12;
      });
      var o = axSpec(z.p, z.q, z.r, z.s, 'x');
      full = P.scale(o.full, [1, z.D]); target = [P.num([1, z.D]), o.A, o.B];
      sol = 'The denominators have LCD ' + t(z.D) + ': take out ' + t(fr(1, z.D)) + ': ' + t(tx(full) + '=' + fr(1, z.D) + br(o.full)) + '.<br>' + axSol(o) + '<br>' + t('=' + FX.tex(target));
      ws = axWrongs(cp, o, [P.num([1, z.D])]);
    }
    return fpart(cp, 'Factor fully by first taking out a fractional common factor: ' + t(tx(full)) + '.', target, ws, sol,
      ['Take out a fraction so that the bracket has integer coefficients: dividing by ' + t('\\frac{1}{2}') + ' is the same as multiplying by ' + t('2') + '.', 'Then factor the trinomial in the bracket.'], 'fractional common factor');
  };

  /* perfect-square trinomials (L2 Ex 8–9, #10, #12) */
  B.pst = function (r, cp) {
    var two = r.chance(0.3), G = r.chance(0.25) ? r.int(2, 4) : 1, v = r.pick(['x', 'x', 'a', 'y', 't']), w = two ? (v === 'y' ? 'z' : 'y') : null;
    var s = pickWhere(function () { return { a: r.int(1, 9), b: r.int(1, 9), neg: r.chance(0.5) }; }, function (z) { return gcd(z.a, z.b) === 1 && (z.a > 1 || z.b > 1) && z.a * z.b <= 45 && z.a !== z.b && (G === 1 || z.a * z.b <= 15); });
    var sb = s.neg ? -s.b : s.b, A = lin(s.a, sb, v, w), inner = P.pow(A, 2), full = P.scale(inner, G), asc = !two && G === 1 && r.chance(0.2);
    var pre = G === 1 ? [] : [P.num(G)], target = pre.concat([{ p: A, k: 2 }]), shown = asc ? seqAsc(full) : tx(full);
    var At = tx(M(s.a, v, 1)), Bt = w ? tx(M(s.b, w, 1)) : String(s.b);
    var ws = [{ is: pre.concat([lin(s.a, -s.b, v, w), lin(s.a, s.b, v, w)]), code: cp + 'pst-dos', hint: 'That is a difference of squares, ' + t('A^{2}-B^{2}') + '. Here the last term is <b>added</b>: expand your answer to check.' },
      { is: pre.concat([{ p: lin(s.a, -sb, v, w), k: 2 }]), code: cp + 'pst-sign', hint: 'The sign in the bracket is the sign of the middle term.' }];
    if (G > 1) ws.push({ is: [{ p: A, k: 2 }], code: cp + 'gcf-dropped', hint: 'The bracket is right, but the common factor ' + t(G) + ' is missing.' });
    return fpart(cp, 'Factor fully: ' + t(shown) + '.', target, ws,
      (G === 1 ? '' : 'Take out ' + t(G) + ': ' + t(shown + '=' + G + br(inner)) + '.<br>') + 'The first and last terms are perfect squares: ' + t('A=' + At) + ', ' + t('B=' + Bt) + ', and the middle term is ' + t((s.neg ? '-' : '') + '2AB=' + (s.neg ? '-' : '') + tx(P.mul(M(2 * s.a * s.b, v, 1), w ? V(w) : 1))) + ' ✓. So it is a perfect square: ' + t(shown + '=' + FX.tex(target)) + '.',
      ['Are the first and last terms perfect squares? Is the middle term ' + t('\\pm 2AB') + '?', 'Then ' + t('A^{2}\\pm 2AB+B^{2}=(A\\pm B)^{2}') + '.'], 'perfect-square trinomial');
  };

  /* the missing value that makes a perfect square (L2 Ex 8b, #11, #16, L8 Ex 3d) */
  B.pstK = function (r, cp) {
    var kind = r.pick(['mid', 'mid', 'last', 'first']), s = pickWhere(function () { return { a: r.int(2, 9), b: r.int(1, 9), neg: r.chance(0.4) }; }, function (z) { return gcd(z.a, z.b) === 1 && z.a !== z.b && 2 * z.a * z.b <= 120; });
    var a = s.a, b = s.b, A2 = a * a, B2 = b * b, mid = 2 * a * b, prompt, ans, sol, dg;
    if (kind === 'mid') {
      prompt = 'Determine the positive value of ' + t('k') + ' for which ' + t(A2 + 'x^{2}' + (s.neg ? '-' : '+') + 'kx+' + B2) + ' is a perfect-square trinomial.'; ans = mid;
      sol = t(A2 + 'x^{2}=(' + a + 'x)^{2}') + ' and ' + t(B2 + '=' + b + '^{2}') + ', so ' + t(A2 + 'x^{2}' + (s.neg ? '-' : '+') + 'kx+' + B2 + '=(' + a + 'x' + (s.neg ? '-' : '+') + b + ')^{2}') + '. The middle term is ' + t('2(' + a + 'x)(' + b + ')=' + mid + 'x') + ', so ' + t('k=' + mid) + '.';
      dg = function (v) { if (v === a * b) return { code: cp + 'pstk-half', hint: 'The middle term of ' + t('(A+B)^{2}') + ' is ' + t('2AB') + ', not ' + t('AB') + '.' }; if (v === -mid) return { code: cp + 'k-sign', hint: 'The question asks for the positive value of ' + t('k') + '.' }; if (v === A2 * B2) return { code: cp + 'pstk-sq', hint: 'Take the square roots first: ' + t('A=' + a + 'x') + ' and ' + t('B=' + b) + '; the middle term is ' + t('2AB') + '.' }; return null; };
    } else if (kind === 'last') {
      prompt = 'Determine the value of ' + t('k') + ' for which ' + t(A2 + 'x^{2}' + (s.neg ? '-' : '+') + mid + 'x+k') + ' is a perfect-square trinomial.'; ans = B2;
      sol = t('A=' + a + 'x') + ' and ' + t(mid + 'x=2(' + a + 'x)B') + ', so ' + t('B=' + b) + ' and ' + t('k=B^{2}=' + B2) + '. (' + t(A2 + 'x^{2}' + (s.neg ? '-' : '+') + mid + 'x+' + B2 + '=(' + a + 'x' + (s.neg ? '-' : '+') + b + ')^{2}') + '.)';
      dg = function (v) { if (v === b) return { code: cp + 'pstk-root', hint: 'That is ' + t('B') + '. The last term of a perfect square is ' + t('B^{2}') + '.' }; if (v === 2 * b || v === mid / 2) return { code: cp + 'pstk-root', hint: 'Use ' + t('2AB') + ' to find ' + t('B') + ', then square it.' }; return null; };
    } else {
      prompt = 'Determine the value of ' + t('k') + ' for which ' + t('kx^{2}' + (s.neg ? '-' : '+') + mid + 'x+' + B2) + ' is a perfect-square trinomial.'; ans = A2;
      sol = t(B2 + '=' + b + '^{2}') + ', so ' + t('B=' + b) + '. ' + t(mid + 'x=2A(' + b + ')') + ' gives ' + t('A=' + a + 'x') + ', and ' + t('A^{2}=' + A2 + 'x^{2}') + ': ' + t('k=' + A2) + '.';
      dg = function (v) { if (v === a) return { code: cp + 'pstk-root', hint: 'That is the coefficient of ' + t('A') + '. The first term is ' + t('A^{2}') + '.' }; return null; };
    }
    var p = KP.number(prompt, ans, dg, sol, ['A perfect square is ' + t('A^{2}\\pm 2AB+B^{2}') + ': find ' + t('A') + ' and ' + t('B') + ' from the terms you know.', 'Then work out the missing term.'], 'complete a perfect square');
    p.bad = kind === 'mid' ? [String(a * b), String(A2 * B2)] : kind === 'last' ? [String(b)] : [String(a)];
    return p;
  };

  /* every integer k for which ax² + kx + c factors (EP02 C1) */
  B.allK = function (r, cp) {
    var s = pickWhere(function () { return { a: r.pick([2, 3, 4, 5, 6, 7]), c: nz(r, 1, 12) }; }, function (z) { var ac = Math.abs(z.a * z.c); return posPairs(ac).length >= 3 && posPairs(ac).length <= 5 && ac <= 60 && !(z.a === 3 && z.c === 4) && gcd(z.a, z.c) === 1; });
    var a = s.a, c = s.c, ac = a * c, pairs = posPairs(ac), vals = [];
    pairs.forEach(function (pq) { var sum = ac > 0 ? pq[0] + pq[1] : pq[1] - pq[0]; vals.push(sum); vals.push(-sum); });
    vals = uniqNums(vals).sort(function (x, y) { return x - y; });
    var cp0 = posPairs(Math.abs(c)), wrongVals = uniqNums([].concat.apply([], cp0.map(function (pq) { var sm = c > 0 ? pq[0] + pq[1] : pq[1] - pq[0]; return [sm, -sm]; })));
    var p = KP.valueSet('Determine all the integers ' + t('k') + ' for which ' + t(a + 'x^{2}+kx' + sg(c)) + ' can be factored over the integers.', vals, { v: 'k', diag: function (A, T) {
      if (wrongVals.length === A.length && wrongVals.every(function (x) { return has(A, x); })) return { code: cp + 'allb-missing', hint: 'Use the pairs with product ' + t('ac=' + ac) + ' (decomposition), not just the pairs of ' + t(c) + '.' };
      var extra = A.filter(function (x) { return !has(T, x); }), miss = T.filter(function (x) { return !has(A, x); });
      if (extra.length) return { code: cp + 'allb-extra', hint: 'Check each value: ' + t(extra[0]) + ' is not the sum of two integers with product ' + t(ac) + '.' };
      if (miss.length && A.every(function (x) { return x > 0; }) && miss.every(function (x) { return x < 0; })) return { code: cp + 'allb-neg', hint: 'Negative factor pairs of ' + t(ac) + ' work too.' };
      if (miss.length) return { code: cp + 'allb-missing', hint: 'You are missing ' + (miss.length === 1 ? 'a value' : miss.length + ' values') + ': list every factor pair of ' + t(ac) + '.' };
      return null;
    } }, 'Decomposition needs two integers with product ' + t('ac=' + a + '\\times ' + par(c) + '=' + ac) + ' and sum ' + t('k') + '. Pairs: ' + pairs.map(function (pq) { return ac > 0 ? t(pq[0] + ',\\ ' + pq[1]) : t(pq[0] + ',\\ ' + (-pq[1])); }).join('; ') + ', and their negatives.<br>' + t('k=' + vals.join(',\\ ')) + '.',
      ['For ' + t('ax^{2}+kx+c') + ', the middle coefficient is the sum of two integers whose product is ' + t('ac') + '.', 'List every factor pair of ' + t('ac') + ' with both signs.'], 'all k for ax² + kx + c');
    p.bad = [vals.filter(function (x) { return x > 0; }).map(function (x) { return 'k=' + x; }).join(',\\ ')];
    if (!(wrongVals.length === vals.length && wrongVals.every(function (x) { return has(vals, x); }))) p.bad.push(wrongVals.map(function (x) { return 'k=' + x; }).join(',\\ '));
    return p;
  };

  /* trinomials in quadratic form: x⁴ + bx² + c (x⁶, (xy)²); 'full' finishes with differences of squares (with a GCF);
     'dec' has a ≠ 1 (L3 Ex 1–4, #1–3) */
  B.subQuartic = function (r, cp, opt) {
    opt = opt || {};
    var mode = opt.mode || 'simple', v = r.pick(['x', 'x', 'a', 'y', 'm', 'n']), target, full, F1, F2, Atex, sol, ws = [], G = P.num(1), e = 2;
    function sqf(p0) { return P.add(V(v, 2), P.num(p0)); }
    if (mode === 'simple') {
      var kind = r.pick(['x2', 'x2', 'x3', 'xy']);
      var s = pickWhere(function () { return { p: nz(r, 1, 9), q: nz(r, 1, 9) }; }, function (z) {
        if (z.p === z.q || z.p + z.q === 0 || Math.abs(z.p * z.q) > 60 || Math.abs(z.p * z.q) === 1) return false;
        if (kind === 'x2') return !(z.p < 0 && isSq(-z.p)) && !(z.q < 0 && isSq(-z.q));
        if (kind === 'x3') return !isCube(z.p) && !isCube(z.q);
        return true;
      });
      var base = kind === 'x2' ? V(v, 2) : kind === 'x3' ? V(v, 3) : P.mono(1, { x: 1, y: 1 });
      Atex = tx(base); e = kind === 'x3' ? 3 : 2;
      F1 = P.add(base, P.num(s.p)); F2 = P.add(base, P.num(s.q)); target = [F1, F2]; full = P.mul(F1, F2);
      sol = 'Let ' + t('A=' + Atex) + ': ' + t('A^{2}' + sg(s.p + s.q).replace(/^([+-])1$/, '$1') + 'A' + sg(s.p * s.q) + '=(A' + sg(s.p) + ')(A' + sg(s.q) + ')') + ' (product ' + t(s.p * s.q) + ', sum ' + t(s.p + s.q) + ').<br>Put ' + t(Atex) + ' back: ' + t(tx(full) + '=' + FX.tex(target)) + '.' + (kind === 'x2' ? ' Neither factor factors again over the integers.' : '');
      ws.push({ is: [P.add(base, P.num(-s.p)), P.add(base, P.num(-s.q))], code: cp + 'pair-signs', hint: 'Every sign in your brackets is backwards: expand your answer to check.' });
    } else if (mode === 'full') {
      var z = pickWhere(function () { var m = r.int(1, 6), sqr = r.chance(0.15), n = sqr ? m : r.int(1, 6), qneg = sqr || r.chance(0.55); return { m: m, q: qneg ? -n * n : r.pick([1, 2, 3, 4, 5, 6, 7, 9, 10, 16, 25]), g: r.chance(0.3) ? r.pick([2, 3, 5]) : r.chance(0.15) ? 'v' : 1, sqr: sqr }; },
        function (z) { return z.q !== -z.m * z.m || z.sqr ? (Math.abs(z.m * z.m * z.q) <= 150 && !(z.m === 1 && z.q === -1)) : false; });
      var m = z.m; G = z.g === 'v' ? V(v, 1) : P.num(z.g);
      F1 = sqf(-m * m); F2 = sqf(z.q); full = P.mul(G, F1, F2);
      var parts = [lin(1, -m, v), lin(1, m, v)];
      if (z.q < 0) { var n = Math.round(Math.sqrt(-z.q)); parts = parts.concat([lin(1, -n, v), lin(1, n, v)]); } else parts.push(F2);
      target = cleanList([G].concat(parts));
      var g1 = P.eq(G, P.num(1)), inner = P.mul(F1, F2), b = -m * m + z.q, c = -m * m * z.q;
      sol = (g1 ? '' : 'Take out ' + t(tx(G)) + ': ' + t(tx(full) + '=' + tx(G) + br(inner)) + '.<br>') + 'Let ' + t('A=' + v + '^{2}') + ': ' + t('A^{2}' + (b === 0 ? '' : (b === 1 ? '+' : b === -1 ? '-' : sg(b)) + 'A') + sg(c) + '=(A' + sg(-m * m) + ')(A' + sg(z.q) + ')') + ', so ' + t(FX.tex(g1 ? [F1, F2] : [G, F1, F2])) + '.<br>' +
        (z.q < 0 ? 'Both brackets are differences of squares' : t(tx(F1)) + ' is a difference of squares; ' + t(tx(F2)) + ' is a sum and does not factor') + ': ' + t(tx(full) + '=' + FX.tex(target)) + '.';
      if (z.q > 0 && isSq(z.q)) { var nn = Math.round(Math.sqrt(z.q)); ws.push({ is: [G, lin(1, -m, v), lin(1, m, v), lin(1, -nn, v), lin(1, nn, v)], code: cp + 'sum-split', hint: t(tx(F2)) + ' is a <b>sum</b> of squares: it does not factor. Only a difference of squares splits.' }); }
      if (!g1) ws.push({ is: parts, code: cp + 'gcf-dropped', hint: 'Your brackets are right, but the common factor ' + t(tx(G)) + ' is missing.' });
      ws.push({ is: [G, sqf(m * m), sqf(-z.q)], code: cp + 'pair-signs', hint: 'The signs in your brackets are backwards: expand your answer to check.' });
    } else { // dec: (a v² + p)(v² + q)
      var y = pickWhere(function () { var dos1 = r.chance(0.4), s1 = r.int(2, 3), t1 = r.int(1, 3); return { a: dos1 ? s1 * s1 : r.pick([2, 3, 5, 6]), p: dos1 ? -t1 * t1 : nz(r, 1, 7), q: r.chance(0.6) ? -Math.pow(r.int(1, 3), 2) : r.int(1, 6), dos1: dos1, s1: s1, t1: t1 }; },
        function (z) { var b = z.a * z.q + z.p; return gcd(z.a, z.p) === 1 && b !== 0 && Math.abs(z.a * z.q * z.p) <= 100 && (!z.dos1 || gcd(z.s1, z.t1) === 1) && !(z.p < 0 && !z.dos1 && isSq(-z.p) && isSq(z.a)); });
      F1 = P.add(M(y.a, v, 2), P.num(y.p)); F2 = sqf(y.q); full = P.mul(F1, F2);
      var ps = [];
      if (y.dos1) ps.push(lin(y.s1, -y.t1, v), lin(y.s1, y.t1, v)); else ps.push(F1);
      if (y.q < 0) { var nq = Math.round(Math.sqrt(-y.q)); ps.push(lin(1, -nq, v), lin(1, nq, v)); } else ps.push(F2);
      target = ps;
      var ac = y.a * y.p * y.q, bb = y.a * y.q + y.p;
      sol = 'Let ' + t('A=' + v + '^{2}') + ': ' + t(y.a + 'A^{2}' + (bb === 1 ? '+' : bb === -1 ? '-' : sg(bb)) + 'A' + sg(y.p * y.q)) + '. Product ' + t(ac) + ', sum ' + t(bb) + ': ' + t(y.a * y.q) + ' and ' + t(y.p) + '.<br>' + t('=' + br(P.add(M(y.a, 'A', 1), P.num(y.p))) + br(P.add(V('A'), P.num(y.q)))) + ', so ' + t(tx(full) + '=' + FX.tex([F1, F2])) + '.' +
        (y.dos1 || y.q < 0 ? '<br>Factor each difference of squares: ' + t('=' + FX.tex(target)) + '.' : '<br>Neither factor factors again over the integers.');
      ws.push({ is: [P.add(M(y.a, v, 2), P.num(-y.p)), sqf(-y.q)], code: cp + 'sign-swap', hint: 'The signs in your brackets are backwards: expand your answer to check.' });
      if (y.a * y.q !== y.p) ws.push({ is: [P.add(M(y.a, v, 2), P.num(y.q)), sqf(y.p)], code: cp + 'const-swap', hint: 'The constants are in the wrong brackets: expand your answer to check the middle term.' });
    }
    return fpart(cp, (mode === 'simple' ? 'Factor ' : 'Factor fully: ') + t(tx(full)) + '.', target, ws, sol,
      ['The first term is the square of the middle term’s variable part: let ' + t('A=' + (mode === 'simple' && e === 3 ? v + '^{3}' : v + '^{2}')) + ' (or the repeated expression) and factor the trinomial in ' + t('A') + '.', 'Put the expression back for ' + t('A') + ', then check each factor: a difference of squares factors again; a sum of squares does not.'], 'factor by substitution');
  };

  /* a(mx + h)² + b(mx + h) + c: mode 'basic' (a = 1, m = 1), 'gen' (a ≠ 1 or m ≠ 1), 'common' (a common factor appears) (L3 Ex 5–8, #6–7, EP03) */
  B.subBin = function (r, cp, opt) {
    opt = opt || {};
    var mode = opt.mode || 'basic', v = r.pick(['x', 'x', 'a', 'y']);
    var s = pickWhere(function () {
      var basic = mode === 'basic';
      return { m: basic ? 1 : r.pick([1, 2, 2, 3, -1, -2]), h: nz(r, 1, 5), p: basic ? 1 : r.int(1, 3), q: nz(r, 1, 6), s: basic ? 1 : r.int(1, 3), u: nz(r, 1, 6) };
    }, function (z) {
      var a = z.p * z.s, b = z.p * z.u + z.q * z.s, c = z.q * z.u;
      if (b === 0 || gcd(z.p, z.q) !== 1 || gcd(z.s, z.u) !== 1 || (z.p === z.s && z.q === z.u) || Math.abs(c) > 40 || Math.abs(b) > 15) return false;
      if (mode !== 'basic' && a === 1 && Math.abs(z.m) === 1) return false;
      if (gcd(z.m, z.h) !== 1 || (z.m < 0 && z.h < 0)) return false;
      if (z.p < z.s) return false;
      var F1 = lin(z.p * z.m, z.p * z.h + z.q, v), F2 = lin(z.s * z.m, z.s * z.h + z.u, v), c1 = FX.content(F1).c[0], c2 = FX.content(F2).c[0];
      var common = Math.abs(c1) > 1 || Math.abs(c2) > 1 || P.count(F1) < 2 || P.count(F2) < 2;
      if (mode === 'common') return common;
      if (mode === 'gen') return !common || r.chance(0.3);
      return true;
    });
    var Ap = lin(s.m, s.h, v), At = linT(s.m, s.h, v), a = s.p * s.s, b = s.p * s.u + s.q * s.s, c = s.q * s.u;
    var shown = coefT(a) + '(' + At + ')^{2}' + (b < 0 ? '-' : '+') + (Math.abs(b) === 1 ? '' : Math.abs(b)) + '(' + At + ')' + sg(c);
    var F1 = lin(s.p * s.m, s.p * s.h + s.q, v), F2 = lin(s.s * s.m, s.s * s.h + s.u, v), target = cleanList([F1, F2]);
    var Af1 = P.add(M(s.p, 'A', 1), P.num(s.q)), Af2 = P.add(M(s.s, 'A', 1), P.num(s.u));
    var put = function (k, n) { return '\\big[' + (k === 1 ? '' : k) + '(' + At + ')' + sg(n) + '\\big]'; };
    var simp = FX.tex([F1, F2]), key = FX.tex(target);
    var sol = 'Let ' + t('A=' + At) + ': ' + t(coefT(a) + 'A^{2}' + (b < 0 ? '-' : '+') + (Math.abs(b) === 1 ? '' : Math.abs(b)) + 'A' + sg(c) + '=' + br(Af1) + br(Af2)) + (a > 1 ? ' (product ' + t(a * c) + ', sum ' + t(b) + ')' : '') + '.<br>Put ' + t('(' + At + ')') + ' back, in brackets: ' + t(put(s.p, s.q) + put(s.s, s.u)) + '<br>' + t('=' + simp) + (simp !== key ? '<br>' + t('=' + key) + ' (take out the common factor)' : '') + '.';
    var ws = [{ is: [lin(s.p, s.q, v), lin(s.s, s.u, v)], code: cp + 'sub-noback', hint: 'Those are the factors of the trinomial in ' + t('A') + ' with ' + t(v) + ' written for ' + t('A') + '. Put ' + t('(' + At + ')') + ' back for ' + t('A') + ' and simplify each bracket.' }];
    if (s.p > 1 || s.s > 1) ws.push({ is: [lin(s.p * s.m, s.h + s.q, v), lin(s.s * s.m, s.h + s.u, v)], code: cp + 'sub-bracket', hint: 'Put ' + t('A') + ' back <b>in brackets</b>: ' + t((s.p > 1 ? s.p : s.s) + 'A') + ' means ' + t((s.p > 1 ? s.p : s.s) + '(' + At + ')') + ', so multiply both of its terms.' });
    return fpart(cp, 'Factor fully. Simplify each factor: ' + t(shown) + '.', target, ws, sol,
      ['Let ' + t('A=' + At) + ' and factor the trinomial in ' + t('A') + '.', 'Put ' + t('(' + At + ')') + ' back for ' + t('A') + ' in brackets, simplify each factor, and take out any common factor.'], 'factor by substituting for a binomial');
  };

  /* two repeated binomials: aA² + bAB + cB² (L3 Ex 9b, #8, EP03 C2) */
  B.subTwo = function (r, cp) {
    var v = 'x';
    var s = pickWhere(function () { return { m1: 1, h1: nz(r, 1, 5), m2: r.pick([1, 1, 2]), h2: nz(r, 1, 5), p: r.int(1, 3), q: nz(r, 1, 3), s: r.int(1, 2), u: nz(r, 1, 3) }; }, function (z) {
      var a = z.p * z.s, b = z.p * z.u + z.q * z.s, c = z.q * z.u;
      if (b === 0 || (z.m1 === z.m2 && z.h1 === z.h2) || gcd(z.p, z.q) !== 1 || gcd(z.s, z.u) !== 1 || (z.p === z.s && z.q === z.u) || (a === 1 && Math.abs(c) === 1 && Math.abs(b) < 2)) return false;
      var c1 = z.p * z.m1 + z.q * z.m2, c2 = z.s * z.m1 + z.u * z.m2; return c1 !== 0 && c2 !== 0 && Math.abs(z.p * z.h1 + z.q * z.h2) <= 20 && Math.abs(z.s * z.h1 + z.u * z.h2) <= 20;
    });
    var Ap = lin(s.m1, s.h1, v), Bp = lin(s.m2, s.h2, v), a = s.p * s.s, b = s.p * s.u + s.q * s.s, c = s.q * s.u;
    var At = tx(Ap), Bt = tx(Bp);
    var shown = coefT(a) + '(' + At + ')^{2}' + (b < 0 ? '-' : '+') + (Math.abs(b) === 1 ? '' : Math.abs(b)) + '(' + At + ')(' + Bt + ')' + sg(c) + '(' + Bt + ')^{2}';
    var F1 = P.add(P.scale(Ap, s.p), P.scale(Bp, s.q)), F2 = P.add(P.scale(Ap, s.s), P.scale(Bp, s.u)), target = cleanList([F1, F2]);
    var ab = function (k, n) { return (k === 1 ? '' : k) + 'A' + (n < 0 ? '-' : '+') + (Math.abs(n) === 1 ? '' : Math.abs(n)) + 'B'; };
    var put = function (k, n) { return '\\big[' + (k === 1 ? '' : k) + '(' + At + ')' + (n < 0 ? '-' : '+') + (Math.abs(n) === 1 ? '' : Math.abs(n)) + '(' + Bt + ')\\big]'; };
    var key = FX.tex(target), simp = FX.tex([F1, F2]);
    var sol = 'Let ' + t('A=' + At) + ' and ' + t('B=' + Bt) + ': ' + t(coefT(a) + 'A^{2}' + (b < 0 ? '-' : '+') + (Math.abs(b) === 1 ? '' : Math.abs(b)) + 'AB' + sg(c) + 'B^{2}=(' + ab(s.p, s.q) + ')(' + ab(s.s, s.u) + ')') + '.<br>Substitute back: ' + t(put(s.p, s.q) + put(s.s, s.u)) + '<br>' + t('=' + simp) + (simp !== key ? '<br>' + t('=' + key) : '') + '.';
    var ws = [];
    if (s.q < 0 && s.h2 !== 0) ws.push({ is: [P.add(P.scale(Ap, s.p), M(s.q * s.m2, v, 1), P.num(-s.q * s.h2)), F2], code: cp + 'minus-bracket', hint: 'A minus sign in front of ' + t('B') + ' applies to <b>every</b> term of ' + t('(' + Bt + ')') + '.' });
    if (s.u < 0 && s.h2 !== 0) ws.push({ is: [F1, P.add(P.scale(Ap, s.s), M(s.u * s.m2, v, 1), P.num(-s.u * s.h2))], code: cp + 'minus-bracket', hint: 'A minus sign in front of ' + t('B') + ' applies to <b>every</b> term of ' + t('(' + Bt + ')') + '.' });
    ws.push({ is: [P.add(P.scale(Ap, s.p), P.scale(Bp, -s.q)), P.add(P.scale(Ap, s.s), P.scale(Bp, -s.u))], code: cp + 'pair-signs', hint: 'Check the signs: factor ' + t('aA^{2}+bAB+cB^{2}') + ' like ' + t('ax^{2}+bxy+cy^{2}') + ', then expand your factors in ' + t('A') + ' and ' + t('B') + ' to check.' });
    return fpart(cp, 'Factor fully. Simplify each factor: ' + t(shown) + '.', target, ws, sol,
      ['Let ' + t('A=' + At) + ' and ' + t('B=' + Bt) + '. Factor ' + t('aA^{2}+bAB+cB^{2}') + ' the way you factor ' + t('ax^{2}+bxy+cy^{2}') + '.', 'Substitute both binomials back in brackets, simplify each factor, and take out any common factor (or ' + t('-1') + ').'], 'two repeated binomials');
  };

  /* differences of squares of monomials: 'basic', 'gcf' (a GCF first; sometimes a sum of squares is left), 'quartic' (twice) (L4 Ex 1–4, #1–2, #6) */
  B.dos = function (r, cp, opt) {
    opt = opt || {};
    var mode = opt.mode || 'basic', target, full, shown, sol, ws = [];
    var L = r.pick([['x', 'y'], ['a', 'b'], ['m', 'n'], ['p', 'q']]), X = L[0], Y = L[1];
    if (mode === 'quartic') {
      var z = pickWhere(function () { return { a: r.int(1, 3), b: r.pick([1, 2, 3, 5]), two: r.chance(0.4), g: r.chance(0.35) ? r.pick([2, 3, 5]) : 1 }; }, function (z) { return gcd(z.a, z.b) === 1 && (z.a > 1 || z.b > 1) && Math.pow(z.a * z.b, 4) * z.g <= 1300 && !(z.a === 1 && z.b === 3 && !z.two && z.g === 1); });
      var Bm = z.two ? M(z.b, Y, 1) : P.num(z.b), Am = M(z.a, X, 1), G = P.num(z.g);
      var dif = P.sub(P.pow(Am, 2), P.pow(Bm, 2)), sum = P.add(P.pow(Am, 2), P.pow(Bm, 2));
      full = P.mul(G, dif, sum); shown = tx(full);
      target = (z.g > 1 ? [G] : []).concat([P.sub(Am, Bm), P.add(Am, Bm), sum]);
      sol = (z.g > 1 ? 'Take out ' + t(z.g) + ': ' + t(shown + '=' + z.g + br(P.mul(dif, sum))) + '.<br>' : '') + t(tx(P.mul(dif, sum)) + '=(' + tx(P.pow(Am, 2)) + ')^{2}-(' + tx(P.pow(Bm, 2)) + ')^{2}=' + br(dif) + br(sum)) + '.<br>' + t(tx(dif)) + ' is a difference of squares again; ' + t(tx(sum)) + ' is a sum and does not factor: ' + t('=' + FX.tex(target));
      ws.push({ is: (z.g > 1 ? [G] : []).concat([P.sub(Am, Bm), P.add(Am, Bm), P.sub(Am, Bm), P.add(Am, Bm)]), code: cp + 'sum-split', hint: t(tx(sum)) + ' is a <b>sum</b> of squares: it does not factor.' });
      ws.push({ is: (z.g > 1 ? [G] : []).concat([{ p: dif, k: 2 }]), code: cp + 'dos-square', hint: 'The second factor of a difference of squares has a <b>plus</b> sign: ' + t('A^{2}-B^{2}=(A-B)(A+B)') + '.' });
    } else {
      var s = pickWhere(function () { return { a: r.int(1, 10), b: r.int(1, 10), kind: r.pick(['xy', 'xy', 'num', 'mn']), rev: r.chance(0.2), g: mode === 'gcf' ? r.pick([2, 3, 5, 6, 7, -2, -3, 'v']) : 1, sum: mode === 'gcf' && r.chance(0.2) }; },
        function (z) { return gcd(z.a, z.b) === 1 && (z.a > 1 || z.b > 1) && z.a !== z.b && (mode !== 'gcf' || z.a * z.b <= 30) && !(z.sum && z.g === 'v'); });
      var A = s.kind === 'xy' ? M(s.a, X, 1) : s.kind === 'num' ? M(s.a, X, 1) : P.mono(s.a, (function () { var o = {}; o[X] = 1; o[Y] = 1; return o; })());
      var Bm2 = s.kind === 'num' ? P.num(s.b) : s.kind === 'xy' ? M(s.b, Y, 1) : M(s.b, 'r', 1);
      var Gm = s.g === 'v' ? P.mono(r.int(2, 5), (function () { var o = {}; o[X] = 1; return o; })()) : P.num(s.g);
      var g1 = P.eq(Gm, P.num(1)), inner = s.sum ? P.add(P.pow(A, 2), P.pow(Bm2, 2)) : P.sub(P.pow(A, 2), P.pow(Bm2, 2));
      full = P.mul(Gm, inner);
      shown = s.rev && g1 ? P.seq([P.neg(P.pow(Bm2, 2)), P.pow(A, 2)]) : tx(full);
      target = s.sum ? [Gm, inner] : (g1 ? [] : [Gm]).concat([P.sub(A, Bm2), P.add(A, Bm2)]);
      var At = tx(A), Bt = tx(Bm2);
      sol = (g1 ? '' : 'Take out ' + t(tx(Gm)) + ': ' + t(shown + '=' + (tx(Gm) === '-1' ? '-' : tx(Gm)) + br(inner)) + '.<br>') +
        (s.sum ? t(tx(inner)) + ' is a <b>sum</b> of squares: it does not factor, so ' + t(FX.tex(target)) + ' is fully factored.' : t(tx(inner) + '=(' + At + ')^{2}-(' + Bt + ')^{2}') + ', a difference of squares: ' + t(shown + '=' + FX.tex(target)) + '.');
      if (!s.sum) {
        ws.push({ is: (g1 ? [] : [Gm]).concat([{ p: P.sub(A, Bm2), k: 2 }]), code: cp + 'dos-square', hint: 'The factors of a difference of squares have opposite signs: ' + t('A^{2}-B^{2}=(A-B)(A+B)') + '.' });
        if (s.a > 1 || s.b > 1) ws.push({ is: (g1 ? [] : [Gm]).concat([P.sub(P.scale(A, s.a), P.scale(Bm2, s.b)), P.add(P.scale(A, s.a), P.scale(Bm2, s.b))]), code: cp + 'no-root', hint: 'Use the square <b>roots</b>: ' + t(tx(P.pow(A, 2)) + '=(' + At + ')^{2}') + ' and ' + t(tx(P.pow(Bm2, 2)) + '=(' + Bt + ')^{2}') + '.' });
        if (!g1) ws.push({ is: [P.sub(A, Bm2), P.add(A, Bm2)], code: cp + 'gcf-dropped', hint: 'Your brackets are right, but the common factor ' + t(tx(Gm)) + ' is missing.' });
      } else {
        ws.push({ is: [Gm, P.sub(A, Bm2), P.add(A, Bm2)], code: cp + 'sum-split', hint: 'After the common factor, ' + t(tx(inner)) + ' is a <b>sum</b> of squares: it does not factor.' });
      }
    }
    return fpart(cp, 'Factor fully: ' + t(shown) + '.', target, ws, sol,
      ['Take out any common factor first. Then look for two perfect squares that are subtracted.', t('A^{2}-B^{2}=(A-B)(A+B)') + '. A sum of squares does not factor.'], 'difference of squares');
  };

  /* differences of squares of binomials: 'simple' ((x + h)² − k², k² − (x + h)²), 'two' (a²(f)² − b²(g)²) (L4 Ex 7, #7, #13) */
  B.dosBin = function (r, cp, opt) {
    opt = opt || {};
    var mode = opt.mode || 'simple', v = r.pick(['x', 'x', 'a', 'y']), w = null;
    var s = pickWhere(function () {
      if (mode === 'simple') { var k = r.int(2, 9); return { a: 1, m1: r.pick([1, 1, 2]), h1: nz(r, 1, 7), b: 1, m2: 0, h2: k, rev: r.chance(0.4) }; }
      var y = r.chance(0.2);
      return { a: r.int(1, 5), m1: r.pick([1, 1, 2, 3]), h1: nz(r, 1, 5), b: r.int(1, 4), m2: r.pick([1, 1, 2]), h2: nz(r, 1, 5), y: y };
    }, function (z) {
      if (mode === 'simple') return Math.abs(z.h1) !== z.h2;
      if (z.a === z.b && z.m1 === z.m2) return false;
      if (gcd(z.a, z.b) !== 1 && !(z.a === 1 && z.b === 1)) return false;
      if (z.a === 1 && z.b === 1 && z.m1 === z.m2) return false;
      if (z.y) return true;
      var c1 = z.a * z.m1 - z.b * z.m2, c2 = z.a * z.m1 + z.b * z.m2;
      return c1 !== 0 && c2 !== 0 && Math.abs(z.a * z.h1 - z.b * z.h2) <= 25 && Math.abs(z.a * z.h1 + z.b * z.h2) <= 25 && z.a * z.a + z.b * z.b > 2;
    });
    if (s.y) w = v === 'y' ? 'z' : 'y';
    var f = lin(s.m1, s.h1, v), g = mode === 'simple' ? P.num(s.h2) : lin(s.m2, s.h2, w || v);
    var Aq = P.scale(f, s.a), Bq = P.scale(g, s.b), F1 = P.sub(Aq, Bq), F2 = P.add(Aq, Bq), shown, target;
    if (mode === 'simple') shown = s.rev ? (s.h2 * s.h2) + '-(' + tx(f) + ')^{2}' : '(' + tx(f) + ')^{2}-' + (s.h2 * s.h2);
    else shown = (s.a > 1 ? s.a * s.a : '') + '(' + tx(f) + ')^{2}-' + (s.b > 1 ? s.b * s.b : '') + '(' + tx(g) + ')^{2}';
    if (s.rev) { F1 = P.sub(Bq, Aq); }
    target = cleanList([F1, F2]);
    var At = s.a === 1 ? '(' + tx(f) + ')' : s.a + '(' + tx(f) + ')', Bt = mode === 'simple' ? String(s.h2) : (s.b === 1 ? '(' + tx(g) + ')' : s.b + '(' + tx(g) + ')');
    var first = s.rev ? Bt : At, second = s.rev ? At : Bt;
    var simp = FX.tex([F1, F2]), key = FX.tex(target);
    var sol = t(shown + '=\\big[' + first + '\\big]^{2}-\\big[' + second + '\\big]^{2}') + ': a difference of squares with ' + t('A=' + first) + ' and ' + t('B=' + second) + '.<br>' + t('=\\big[' + first + '-' + second + '\\big]\\big[' + first + '+' + second + '\\big]') + '<br>' + t('=' + simp) + (simp !== key ? '<br>' + t('=' + key) + ' (take out the common factor' + (P.lead(target[0])[0] < 0 ? ' and the sign' : '') + ')' : '') + '.';
    var ws = [];
    if (mode !== 'simple' && s.h2 !== 0) ws.push({ is: [P.add(Aq, M(-s.b * s.m2, w || v, 1), P.num(s.b * s.h2)), F2], code: cp + 'minus-bracket', hint: 'The minus sign in ' + t('A-B') + ' applies to <b>every</b> term of ' + t('B=' + Bt) + '.' });
    if (s.rev) ws.push({ is: [P.add(P.num(s.h2), M(-s.m1, v, 1), P.num(s.h1)), F2], code: cp + 'minus-bracket', hint: 'The minus sign in front of ' + t('(' + tx(f) + ')') + ' applies to <b>both</b> of its terms.' });
    if (mode !== 'simple' && (s.a > 1 || s.b > 1)) ws.push({ is: [P.sub(P.scale(f, s.a * s.a), P.scale(g, s.b * s.b)), P.add(P.scale(f, s.a * s.a), P.scale(g, s.b * s.b))], code: cp + 'no-root', hint: 'Use the square roots: ' + t(s.a * s.a + '(' + tx(f) + ')^{2}=\\big[' + At + '\\big]^{2}') + '.' });
    ws.push({ is: [{ p: F1, k: 2 }], code: cp + 'dos-square', hint: 'The two factors of a difference of squares are ' + t('A-B') + ' and ' + t('A+B') + '.' });
    return fpart(cp, 'Factor fully. Simplify each factor: ' + t(shown) + '.', target, ws, sol,
      ['Write each term as a square: ' + t('A^{2}-B^{2}') + ', where ' + t('A') + ' and ' + t('B') + ' may be binomials (keep their brackets).', t('(A-B)(A+B)') + ': the minus sign applies to every term of ' + t('B') + '. Simplify each factor and take out any common factor.'], 'difference of squares of binomials');
  };

  /* which expression cannot be factored (MC, recognition) (L4 #14, L8 #4g) */
  B.nfMC = function (r, cp) {
    var s = pickWhere(function () { return { a: r.int(1, 7), b: r.int(1, 9), c: r.int(2, 7), d: r.int(1, 9), p: nz(r, 1, 7), q: nz(r, 1, 7), k: r.pick([2, 3, 5]), m: r.int(2, 6), two: r.chance(0.5) }; },
      function (z) { return gcd(z.a, z.b) === 1 && z.a !== z.b && (z.a > 1 || z.b > 1) && gcd(z.c, z.d) === 1 && z.p !== z.q && z.p + z.q !== 0 && z.c !== z.d; });
    var X = 'x', Y = s.two ? 'y' : null;
    var sumSq = P.add(P.pow(M(s.a, X, 1), 2), P.pow(Y ? M(s.b, Y, 1) : P.num(s.b), 2));
    var dos = P.sub(P.pow(M(s.c, X, 1), 2), P.pow(Y ? M(s.d, Y, 1) : P.num(s.d), 2));
    var tri = P.mul(lin(1, s.p), lin(1, s.q)), gdos = P.scale(P.sub(V(X, 2), P.num(s.m * s.m)), s.k);
    var opts = [{ html: t(tx(sumSq)), right: true },
      { html: t(tx(dos)), why: 'That one factors: ' + t(tx(dos) + '=' + FX.tex([lin(s.c, -s.d, X, Y), lin(s.c, s.d, X, Y)])) + '.', code: 'dos' },
      { html: t(tx(tri)), why: 'That one factors: ' + t(tx(tri) + '=' + FX.tex([lin(1, s.p), lin(1, s.q)])) + '.', code: 'tri' },
      { html: t(tx(gdos)), why: 'That one factors: ' + t(tx(gdos) + '=' + FX.tex([P.num(s.k), lin(1, -s.m), lin(1, s.m)])) + '.', code: 'gdos' }];
    return KP.mc(r, 'Which expression <b>cannot</b> be factored over the integers?', opts,
      t(tx(sumSq)) + ' is a <b>sum</b> of squares with no common factor: it does not factor. The others: ' + t(tx(dos) + '=' + FX.tex([lin(s.c, -s.d, X, Y), lin(s.c, s.d, X, Y)])) + ', ' + t(tx(tri) + '=' + FX.tex([lin(1, s.p), lin(1, s.q)])) + ', ' + t(tx(gdos) + '=' + FX.tex([P.num(s.k), lin(1, -s.m), lin(1, s.m)])) + '.',
      ['A difference of squares factors; a sum of squares does not.', 'Take out a common factor first: what is left may factor.'], 'which does not factor');
  };

  /* ======================================================================================================
   * Roots: "x = a, x = b", ± allowed, or "no solution"
   * ====================================================================================================== */
  function isNone(resp) {
    var s = String(resp == null ? '' : resp).replace(/\\(text|mathrm|textrm)\{([^{}]*)\}/g, '$2').replace(/\\[ ,;:!]|~|\s+/g, '').toLowerCase();
    return /^(no(real)?(solutions?|roots?)|nosol(ution)?s?|none|thereisnosolution|\\emptyset|\\varnothing|∅|\{\}|\\\{\\\})\.?$/.test(s);
  }
  function rootsPart(cp, prompt, vals, o, sol, hints, text) {
    o = o || {};
    var v = o.v || 'x', T = vals.map(rv), extr = (o.extr || []).map(rv).filter(function (e) { return !has(T, e); });
    var wrongs = (o.wrongs || []).filter(function (w) { var W = uniqNums(w.vals.map(rv)); return !(W.length === T.length && W.every(function (x) { return has(T, x); }) && T.every(function (x) { return has(W, x); })); });
    var extrHint = o.extrHint || 'Check every root in the <b>original</b> equation: ' + (extr.length ? t(v + '=' + fr(Math.round(extr[0] * 1e6), 1e6)) + ' does not check (or breaks a restriction), so it is extraneous' : 'one of your roots does not check') + '.';
    function wmatch(A) { for (var i = 0; i < wrongs.length; i++) { var W = uniqNums(wrongs[i].vals.map(rv)); if (W.length === A.length && W.every(function (x) { return has(A, x); }) && A.every(function (x) { return has(W, x); })) return { code: wrongs[i].code, hint: wrongs[i].hint }; } return null; }
    var inner = vals.length ? K.valueSet(vals.map(R), { v: v, diag: function (A, TT) {
      var w = wmatch(A); if (w) return w;
      var extra = A.filter(function (x) { return !has(TT, x); }), miss = TT.filter(function (x) { return !has(A, x); });
      if (extra.length && !miss.length && extr.length && extra.every(function (x) { return has(extr, x); })) return { code: cp + 'extr', hint: extrHint };
      if (miss.length && !extra.length && o.bothValid) return { code: cp + 'rej-valid', hint: 'Check the root you rejected in the original equation again: both sides are equal, so it is a root. Keep it.' };
      return null;
    } }) : null;
    var check = function (resp) {
      if (isNone(resp)) return vals.length ? wrong(cp + 'nosol-claim', o.noneHint || 'There is a root: solve, then check your answer in the original equation.') : ok();
      if (!vals.length) {
        var res = K.valueSet(extr.length ? extr : [987654.321], { v: v })(resp);
        if (res.v === 'form') return res;
        if (extr.length && res.v === 'correct') return wrong(cp + 'extr', extrHint + ' There is no solution.');
        for (var i = 0; i < wrongs.length; i++) { var rw = K.valueSet(wrongs[i].vals.map(R), { v: v })(resp); if (rw.v === 'correct') return wrong(wrongs[i].code, wrongs[i].hint); }
        return wrong('value', 'Substitute your value into the original equation: it does not check.');
      }
      return inner(resp);
    };
    var keyTex = vals.length ? vals.map(function (x) { return v + '=' + rt(x); }).join(',\\ ') : '\\text{no solution}';
    var part = KP.math(prompt, check, keyTex, sol, hints, text, { keys: 'solutions', vars: [v], placeholder: 'e.g. ' + v + ' = 3, ' + v + ' = -5   (or: no solution)' });
    var bad = [];
    function setTex(arr) { return arr.length ? arr.map(function (x) { return v + '=' + rt(x); }).join(',\\ ') : '\\text{no solution}'; }
    if (extr.length) bad.push(setTex(vals.concat(o.extr.filter(function (e) { return !has(T, rv(e)); }))));
    wrongs.forEach(function (w) { bad.push(setTex(w.vals)); });
    if (vals.length) bad.push('\\text{no solution}');
    part.bad = bad.filter(function (b, i, arr) { return arr.indexOf(b) === i && b !== keyTex; });
    return part;
  }
  function facRoots(list) { return list.map(function (f) { var p = f && f.p ? f.p : f; var c1 = P.coef(p, { x: 1 }), c0 = P.constant(p); return ex.norm(-c0[0] * c1[1], c0[1] * c1[0]); }); }

  /* the zero product property (L5 Ex 1, #1) */
  B.zp = function (r, cp) {
    var kind = r.pick(['two', 'two', 'mono', 'const']), list, shown, vals, wr = [], sol;
    if (kind === 'two') {
      var s = pickWhere(function () { return { a: r.int(1, 5), b: nz(r, 1, 9), c: r.int(1, 5), d: nz(r, 1, 9) }; }, function (z) { return gcd(z.a, z.b) === 1 && gcd(z.c, z.d) === 1 && (z.a > 1 || z.c > 1) && z.a * z.d !== z.b * z.c && !(z.a === 2 && z.b === -7 && z.c === 3 && z.d === 4); });
      list = [lin(s.a, s.b), lin(s.c, s.d)]; vals = [[-s.b, s.a], [-s.d, s.c]]; shown = FX.tex(list) + '=0';
      wr.push({ vals: [-s.b, -s.d], code: cp + 'zp-coef', hint: 'Solve each linear equation completely: ' + t(tx(list[0]) + '=0') + ' gives ' + t(s.a + 'x=' + (-s.b)) + ', so divide by ' + t(s.a) + '.' });
      sol = 'Set each factor equal to ' + t(0) + ': ' + t(tx(list[0]) + '=0') + ' or ' + t(tx(list[1]) + '=0') + '.<br>' + rootsTex(vals) + '.';
    } else if (kind === 'mono') {
      var m = pickWhere(function () { return { k: r.int(2, 9), a: r.int(1, 5), b: nz(r, 1, 9) }; }, function (z) { return gcd(z.a, z.b) === 1 && (z.a > 1 || r.chance(0.3)) && !(z.k === 4 && z.a === 1 && z.b === -9); });
      list = [M(m.k, 'x', 1), lin(m.a, m.b)]; vals = [0, [-m.b, m.a]]; shown = FX.tex(list) + '=0';
      wr.push({ vals: [[-m.b, m.a]], code: cp + 'lost-root', hint: 'The factor ' + t(m.k + 'x') + ' gives a root too: ' + t(m.k + 'x=0') + ' means ' + t('x=0') + '.' });
      sol = t(m.k + 'x=0') + ' or ' + t(tx(list[1]) + '=0') + '.<br>' + rootsTex(vals) + '.';
    } else {
      var c = pickWhere(function () { return { k: -r.int(2, 6), p: nz(r, 1, 9), a: r.int(1, 5), q: nz(r, 1, 9) }; }, function (z) { return gcd(z.a, z.q) === 1 && z.p * z.a !== z.q && z.k !== -z.p && z.k * z.a !== -z.q && !(z.k === -5 && z.p === 1); });
      list = [P.num(c.k), lin(1, c.p), lin(c.a, c.q)]; vals = [-c.p, [-c.q, c.a]]; shown = FX.tex(list) + '=0';
      wr.push({ vals: [c.k, -c.p, [-c.q, c.a]], code: cp + 'zp-const', hint: 'A constant factor such as ' + t(c.k) + ' is never ' + t(0) + ', so it gives no root.' });
      if (c.a > 1) wr.push({ vals: [-c.p, -c.q], code: cp + 'zp-coef', hint: 'Solve ' + t(tx(list[2]) + '=0') + ' completely: divide by ' + t(c.a) + '.' });
      sol = t(c.k + '\\ne 0') + ', so ' + t(tx(list[1]) + '=0') + ' or ' + t(tx(list[2]) + '=0') + '.<br>' + rootsTex(vals) + '.';
    }
    return rootsPart(cp, 'Solve ' + t(shown) + '.', vals, { wrongs: wr }, sol, ['Zero product property: if a product is ' + t(0) + ', one of its factors is ' + t(0) + '.', 'Set each factor with an ' + t('x') + ' equal to ' + t(0) + ' and solve.'], 'zero product property');
  };

  /* simple equations: x² + bx + c = 0 (or the zeros of y = …), a²x² − b² = 0, kx² − km² = 0, ax² = bx (L5 Ex 2, Ex 4, #2–3, #6) */
  B.solveSimple = function (r, cp) {
    var kind = r.pick(['monic', 'zeros', 'dos', 'kdos', 'gcf']), vals, prompt, sol, wr = [], fac, eq;
    if (kind === 'monic' || kind === 'zeros') {
      var pq = monicPair(r, 9), Q = P.mul(lin(1, pq.p), lin(1, pq.q)); fac = FX.tex([lin(1, pq.p), lin(1, pq.q)]); vals = [-pq.p, -pq.q];
      prompt = kind === 'zeros' ? 'Determine the zeros of the function ' + t('y=' + tx(Q)) + '.' : 'Solve ' + t(tx(Q) + '=0') + '.';
      sol = (kind === 'zeros' ? 'The zeros are the values of ' + t('x') + ' that make ' + t('y=0') + ': ' : '') + t(tx(Q) + '=' + fac + '=0') + '.<br>' + rootsTex(vals) + (kind === 'zeros' ? ' (the ' + t('x') + '-intercepts of the graph).' : '.');
      wr.push({ vals: [pq.p, pq.q], code: 'sol-sign', hint: 'If ' + t('x' + sg(pq.p) + '=0') + ', then ' + t('x=' + (-pq.p)) + '.' });
    } else if (kind === 'dos' || kind === 'kdos') {
      var s = pickWhere(function () { return { a: r.int(1, 9), b: r.int(1, 12), k: r.pick([2, 3, 5]) }; }, function (z) { return gcd(z.a, z.b) === 1 && z.a !== z.b && (kind === 'kdos' ? z.a === 1 && z.b <= 6 : z.a > 1) && !(z.a === 4 && z.b === 5) && !(z.a === 7 && z.b === 2); });
      vals = [[s.b, s.a], [-s.b, s.a]];
      if (kind === 'dos') { eq = (s.a * s.a) + 'x^{2}-' + (s.b * s.b) + '=0'; sol = 'Difference of squares: ' + t('(' + s.a + 'x-' + s.b + ')(' + s.a + 'x+' + s.b + ')=0') + ', so ' + t('x=\\pm' + fr(s.b, s.a)) + '.'; }
      else { eq = r.chance(0.5) ? s.k + 'x^{2}-' + (s.k * s.b * s.b) + '=0' : s.k + 'x^{2}=' + (s.k * s.b * s.b); sol = t(s.k + '(x^{2}-' + (s.b * s.b) + ')=0') + ', so ' + t(s.k + '(x-' + s.b + ')(x+' + s.b + ')=0') + ' and ' + t('x=\\pm ' + s.b) + '.'; }
      prompt = 'Solve ' + t(eq) + '.';
      wr.push({ vals: [[s.b, s.a]], code: 'sol-missing', hint: 'A difference of squares gives two roots: one from each factor.' });
    } else {
      var g = pickWhere(function () { return { a: r.int(2, 9), b: nz(r, 2, 30) }; }, function (z) { return gcd(z.a, z.b) < Math.min(z.a, Math.abs(z.b)) && z.b % z.a !== 0 || r.chance(0.3); });
      var G = gcd(g.a, g.b); vals = [0, [g.b, g.a]];
      prompt = 'Solve ' + t(g.a + 'x^{2}=' + (g.b < 0 ? '-' : '') + Math.abs(g.b) + 'x') + '.';
      sol = 'Move every term to one side (never divide by ' + t('x') + '): ' + t(g.a + 'x^{2}' + sg(-g.b) + 'x=0') + ', so ' + t(FX.tex([M(G, 'x', 1), lin(g.a / G, -g.b / G)]) + '=0') + '.<br>' + rootsTex(vals) + '.';
      wr.push({ vals: [[g.b, g.a]], code: cp + 'lost-root', hint: 'Dividing both sides by ' + t('x') + ' loses the root ' + t('x=0') + '. Move every term to one side and factor instead.' });
    }
    return rootsPart(cp, prompt, vals, { wrongs: wr }, sol, ['Get ' + t(0) + ' on one side, then factor.', 'Set each factor with ' + t('x') + ' equal to ' + t(0) + '.'], 'solve by factoring');
  };

  /* solve after rearranging ('rearr': moving terms, clearing fractions, x(x + m) = k, a negative leading coefficient) or
     expanding first ('expand') (L5 Ex 3–4, #4–5) */
  B.solveStd = function (r, cp, opt) {
    opt = opt || {};
    var mode = opt.mode || r.pick(['rearr', 'expand']), eq, std, list, vals, wr = [], steps = [];
    if (mode === 'rearr') {
      var kind = r.pick(['move', 'move', 'frac', 'xx', 'neg', 'zero']);
      if (kind === 'frac') {
        var f = pickWhere(function () { return { d: r.pick([2, 3, 4, 5]), p: nz(r, 1, 9), q: nz(r, 1, 9) }; }, function (z) { var b = ex.norm(z.p + z.q, z.d), c = ex.norm(z.p * z.q, z.d); return z.p !== z.q && z.p + z.q !== 0 && (b[1] > 1 || c[1] > 1) && Math.abs(z.p * z.q) <= 50 && Math.abs(z.p * z.q) % z.d === 0; });
        list = [lin(1, f.p), lin(1, f.q)]; std = P.mul(list[0], list[1]); vals = facRoots(list);
        eq = tx(P.scale(std, [1, f.d])) + '=0';
        steps.push('Multiply both sides by ' + t(f.d) + ' to clear the fractions: ' + t(tx(std) + '=0') + '.');
      } else if (kind === 'xx') {
        var xs = pickWhere(function () { return { r1: nz(r, 1, 9), r2: nz(r, 1, 9) }; }, function (z) { return z.r1 !== z.r2 && z.r1 + z.r2 !== 0 && z.r1 * z.r2 < 0 && Math.abs(z.r1 * z.r2) <= 60; });
        list = [lin(1, -xs.r1), lin(1, -xs.r2)]; std = P.mul(list[0], list[1]); vals = [xs.r1, xs.r2];
        var S = xs.r1 + xs.r2, Pr = xs.r1 * xs.r2;
        eq = 'x(x' + sg(-S) + ')=' + (-Pr);
        steps.push('Expand and move every term to one side: ' + t('x^{2}' + sg(-S).replace(/^([+-])1$/, '$1') + 'x' + sg(Pr) + '=0') + '.');
        wr.push({ vals: [-Pr, -Pr + S], code: cp + 'zp-not0', hint: 'The zero product property only works when one side is ' + t(0) + '. Expand, and move every term to one side first.' });
      } else {
        var z = pickWhere(function () { return { p1: r.int(1, 4), q1: nz(r, 1, 7), p2: r.int(1, 3), q2: kind === 'zero' ? 0 : nz(r, 1, 7), G: kind === 'neg' ? -r.int(1, 3) : r.pick([1, 1, 1, 2]) }; },
          function (z) { if (kind === 'zero') return z.q1 !== 0 && gcd(z.p1, z.q1) === 1 && z.p2 === 1; var a = z.p1 * z.p2; return gcd(z.p1, z.q1) === 1 && gcd(z.p2, z.q2) === 1 && z.p1 * z.q2 !== z.p2 * z.q1 && z.p1 * z.q2 + z.p2 * z.q1 !== 0 && (a > 1 || z.G !== 1) && Math.abs(a * z.q1 * z.q2) <= 120; });
        list = kind === 'zero' ? [V('x'), lin(z.p1, -z.q1)] : [lin(z.p1, -z.q1), lin(z.p2, -z.q2)];
        var inner = P.mul(list[0], list[1]); std = P.scale(inner, z.G); vals = facRoots(list);
        var ts = P.sorted(std).map(function (x) { return P.mono(x.c, x.v); }), a2 = ts[0], a1 = ts[1], a0 = ts[2];
        if (kind === 'zero') { var Gz = z.G * (r.chance(0.5) ? 1 : z.p1 === 1 ? 2 : 1); std = P.scale(inner, Gz); ts = P.sorted(std).map(function (x) { return P.mono(x.c, x.v); }); eq = tx(ts[0]) + '=' + tx(P.neg(ts[1])); wr.push({ vals: [vals[1]], code: cp + 'lost-root', hint: 'Dividing both sides by ' + t('x') + ' loses the root ' + t('x=0') + '. Move every term to one side and factor instead.' }); }
        else if (kind === 'neg') eq = P.seq([a2, a1]) + '=' + tx(P.neg(a0));
        else eq = r.chance(0.5) ? tx(a2) + '=' + P.seq([P.neg(a1), P.neg(a0)]) : P.seq([a2, a0]) + '=' + tx(P.neg(a1));
        steps.push('Move every term to one side: ' + t(tx(std) + '=0') + '.');
        if (kind !== 'zero' && z.G !== 1) steps.push('Divide by ' + t(z.G) + ': ' + t(tx(inner) + '=0') + '.');
        std = kind !== 'zero' && z.G !== 1 ? inner : std;
      }
    } else {
      var kind2 = r.pick(['eqk', 'eqk', 'common', 'sq', 'xab']);
      if (kind2 === 'eqk') {
        var e = pickWhere(function () { return { r1: nz(r, 1, 9), r2: nz(r, 1, 9), p: nz(r, 1, 6) }; }, function (z) { var q = -(z.r1 + z.r2) - z.p, k = z.p * q - z.r1 * z.r2; return z.r1 !== z.r2 && q !== 0 && k !== 0 && Math.abs(k) <= 30 && q !== z.p && Math.abs(q) <= 9; });
        var q = -(e.r1 + e.r2) - e.p, k = e.p * q - e.r1 * e.r2;
        list = [lin(1, -e.r1), lin(1, -e.r2)]; std = P.mul(list[0], list[1]); vals = [e.r1, e.r2];
        eq = FX.tex([lin(1, e.p), lin(1, q)]) + '=' + k;
        steps.push('Expand first: ' + t(tx(P.mul(lin(1, e.p), lin(1, q))) + '=' + k) + ', so ' + t(tx(std) + '=0') + '.');
        wr.push({ vals: [k - e.p, k - q], code: cp + 'zp-not0', hint: 'The zero product property only works when one side is ' + t(0) + '. Setting each factor equal to ' + t(k) + ' is not allowed: expand and move every term to one side.' });
      } else if (kind2 === 'common') {
        var c = pickWhere(function () { return { p: nz(r, 1, 7), q: nz(r, 1, 7), m: nz(r, 2, 6) }; }, function (z) { return z.p !== z.q && z.q - z.m !== z.p && z.q - z.m !== 0; });
        list = [lin(1, c.p), lin(1, c.q - c.m)]; std = P.mul(list[0], list[1]); vals = facRoots(list);
        eq = FX.tex([lin(1, c.p), lin(1, c.q)]) + '=' + c.m + br(lin(1, c.p));
        steps.push('Expand both sides and move every term to one side (do not divide by ' + t(br(lin(1, c.p))) + '): ' + t(tx(std) + '=0') + '.');
        wr.push({ vals: [c.m - c.q], code: cp + 'lost-root', hint: 'Dividing both sides by ' + t(br(lin(1, c.p))) + ' loses a root: that factor could be ' + t(0) + '. Expand and move every term to one side instead.' });
      } else if (kind2 === 'sq') {
        var sq = pickWhere(function () { return { a: r.int(1, 4), b: nz(r, 1, 6), k: r.int(2, 7) }; }, function (z) { return gcd(z.a, z.b) === 1 && z.k !== Math.abs(z.b) && (z.a > 1 || r.chance(0.4)); });
        list = [lin(sq.a, sq.b - sq.k), lin(sq.a, sq.b + sq.k)]; std = P.sub(P.pow(lin(sq.a, sq.b), 2), P.num(sq.k * sq.k)); vals = [[sq.k - sq.b, sq.a], [-sq.k - sq.b, sq.a]];
        var cs = FX.content(std);
        eq = '(' + tx(lin(sq.a, sq.b)) + ')^{2}=' + (sq.k * sq.k);
        steps.push('Expand and move every term to one side: ' + t(tx(std) + '=0') + (cs.c[0] > 1 ? ', so ' + t(cs.c[0] + br(cs.prim) + '=0') : '') + '.');
        std = cs.c[0] > 1 ? cs.prim : std;
        wr.push({ vals: [[sq.k - sq.b, sq.a]], code: 'sol-missing', hint: 'There are two roots: ' + t('(' + tx(lin(sq.a, sq.b)) + ')^{2}=' + sq.k * sq.k) + ' means ' + t(tx(lin(sq.a, sq.b)) + '=' + sq.k) + ' or ' + t(tx(lin(sq.a, sq.b)) + '=-' + sq.k) + '.' });
      } else {
        var xb = pickWhere(function () { return { p1: r.int(2, 4), q1: nz(r, 1, 7), q2: nz(r, 1, 7) }; }, function (z) { var b = -(z.p1 * z.q2 + z.q1), c = z.q1 * z.q2; return gcd(z.p1, z.q1) === 1 && b !== 0 && c < 0 && Math.abs(c) <= 30; });
        list = [lin(xb.p1, -xb.q1), lin(1, -xb.q2)]; std = P.mul(list[0], list[1]); vals = facRoots(list);
        var bb = P.coef(std, { x: 1 })[0], cc = P.constant(std)[0];
        eq = 'x(' + tx(lin(xb.p1, bb)) + ')=' + (-cc);
        steps.push('Expand and move every term to one side: ' + t(tx(std) + '=0') + '.');
      }
    }
    var fac = FX.tex(cleanList(list.length && FX.content(std).c[0] !== 1 ? [P.num(FX.content(std).c)].concat(list) : list));
    var sol = steps.join('<br>') + '<br>Factor: ' + t(tx(std) + '=' + (P.eq(FX.product(list), std) ? FX.tex(list) : fac) + '=0') + '.<br>' + rootsTex(vals) + '.';
    return rootsPart(cp, 'Solve ' + t(eq) + '.', vals, { wrongs: wr }, sol, ['Expand if needed, then move every term to one side so the equation is ' + t('ax^{2}+bx+c=0') + '. Clear fractions and divide out a common factor.', 'Factor, then set each factor with ' + t('x') + ' equal to ' + t(0) + '.'], 'solve a quadratic equation by factoring');
  };

  /* write an equation from its roots: the left side of "… = 0" (L5 Ex 5, #7) */
  function eqChk(cp, Tp, v, ws) {
    var Tl = P.lead(Tp, v);
    return function (resp) {
      var s = String(resp == null ? '' : resp).replace(/\\left|\\right/g, '').replace(/=\s*0\s*$/, '');
      if (!s.trim()) return form('empty', 'Type your answer first.');
      if (s.indexOf('=') >= 0) return form(cp + 'eq-std', 'Type only the left side: the box already ends in ' + t('=0') + '. Move every term to one side.');
      var Lr = P.read(s);
      if (!Lr.ok) return form('unreadable', 'Type the left side of the equation as a polynomial, e.g. ' + t('2x^{2}-7x-4') + '.');
      var D = Lr.p;
      if (P.isZero(D)) return wrong('value', null);
      if (P.vars(D).some(function (x) { return x !== v; })) return wrong('value', 'Use only the variable ' + t(v) + '.');
      var Dl = P.lead(D, v), k = ex.norm(Dl[0] * Tl[1], Dl[1] * Tl[0]);
      if (P.eq(D, P.scale(Tp, k))) {
        var fi = P.formIssue(Lr.ast); if (fi && fi.code !== 'not-poly') return form(cp + 'eq-expand', 'Right roots — now expand and simplify so the equation is in standard form, ' + t('ax^{2}+bx+c=0') + '.');
        if (P.terms(D).some(function (x) { return x.c[1] !== 1; })) return form(cp + 'eq-int', 'Right roots — now multiply by the common denominator so every coefficient is an integer.');
        return ok();
      }
      for (var i = 0; i < ws.length; i++) { var Wl = P.lead(ws[i].p, v), k2 = ex.norm(Dl[0] * Wl[1], Dl[1] * Wl[0]); if (P.eq(D, P.scale(ws[i].p, k2))) return wrong(ws[i].code, ws[i].hint); }
      return wrong('value', 'Check by solving your equation: its roots should be the given numbers.');
    };
  }
  B.eqFromRoots = function (r, cp, opt) {
    opt = opt || {};
    var mode = opt.mode || 'int', roots, dbl = false, txt;
    if (mode === 'int') {
      var kind = r.pick(['two', 'two', 'zero']);
      roots = pickWhere(function () { return kind === 'zero' ? [0, nz(r, 1, 9)] : [nz(r, 1, 9), nz(r, 1, 9)]; }, function (z) { return z[0] !== z[1] && z[0] + z[1] !== 0 && !(z[0] === 5 && z[1] === -3) && !(z[0] === 6 && z[1] === -2) && !(z[0] === -3 && z[1] === 7); }).map(function (x) { return [x, 1]; });
    } else {
      var k2 = r.pick(['fi', 'fi', 'ff', 'zf', 'dbl', 'pm']);
      roots = pickWhere(function () {
        var f1 = [nz(r, 1, 7), r.int(2, 5)], f2 = [nz(r, 1, 7), r.int(2, 5)];
        if (k2 === 'fi') return [f1, [nz(r, 1, 6), 1]];
        if (k2 === 'ff') return [f1, f2];
        if (k2 === 'zf') return [[0, 1], f1];
        if (k2 === 'dbl') return [f1];
        return [[Math.abs(f1[0]), f1[1]], [-Math.abs(f1[0]), f1[1]]];
      }, function (z) { return z.every(function (x) { return gcd(x[0], x[1]) === 1 && (x[1] === 1 || x[0] % x[1] !== 0); }) && (z.length === 1 || rv(z[0]) !== rv(z[1])) && z.some(function (x) { return x[1] > 1; }) && !(z.length === 2 && rv(z[0]) === -0.75 && rv(z[1]) === 2); });
      dbl = k2 === 'dbl';
    }
    var fac = function (x, sgn) { return lin(x[1], -sgn * x[0]); };
    var list = dbl ? [{ p: fac(roots[0], 1), k: 2 }] : roots.map(function (x) { return fac(x, 1); });
    var Tp = FX.product(list), Tm = FX.product(dbl ? [{ p: fac(roots[0], -1), k: 2 }] : roots.map(function (x) { return fac(x, -1); }));
    txt = dbl ? 'a double root of ' + t(rt(roots[0])) : 'the roots ' + t(rt(roots[0])) + ' and ' + t(rt(roots[1]));
    var ex0 = roots.filter(function (x) { return x[0] !== 0; })[0];
    var ws = P.eq(Tm, Tp) ? [] : [{ p: Tm, code: cp + 'eq-sign', hint: 'A root ' + t('r') + ' comes from the factor ' + t('(x-r)') + ': for example, the root ' + t(rt(ex0)) + ' gives ' + t(br(fac(ex0, 1))) + '.' }];
    var key = tx(Tp);
    var p = KP.math('Write a quadratic equation in standard form, with integer coefficients, that has ' + txt + '.', eqChk(cp, Tp, 'x', ws), key,
      'Each root ' + t('\\frac{p}{q}') + ' gives the factor ' + t('(qx-p)') + ': ' + t(FX.tex(list) + '=0') + '.<br>Expand: ' + t(key + '=0') + '. (Any non-zero multiple of it is also correct.)',
      ['A root ' + t('r') + ' comes from the factor ' + t('(x-r)') + '; a root ' + t('\\frac{p}{q}') + ' from ' + t('(qx-p)') + ', which keeps integer coefficients.', 'Multiply the factors and expand.'], 'equation from its roots', { keys: 'poly', vars: ['x'], after: t('=0'), placeholder: 'e.g. 2x^2 - 7x - 4' });
    p.answer = t(key + '=0');
    p.bad = ws.map(function (w) { return tx(w.p); }).concat([FX.tex(list)]).filter(function (b) { return b !== key; });
    p.good = [tx(P.scale(Tp, 2)), tx(P.neg(Tp))];
    return p;
  };

  /* a frame / path / rectangle problem with an inadmissible root (L5 Ex 7, EP05 B3, L8 Ex 6, EP08 #13) */
  B.wordFrame = function (r, cp, opt) {
    opt = opt || {};
    var kind = opt.kind || r.pick(['frame', 'path', 'rect']), prompt, ans, sol, dg, after;
    if (kind === 'rect') {
      var z = pickWhere(function () { return { w: r.int(3, 12), m: r.int(2, 3), n: nz(r, 1, 6) }; }, function (z) { var L = z.m * z.w + z.n; return L > z.w && z.w * L <= 300 && !(z.m === 2 && z.n === 3 && z.w === 5) && !(z.m === 3 && z.n === -4 && z.w === 8); });
      var L = z.m * z.w + z.n, A = z.w * L, Pm = 2 * (z.w + L), oth = ex.norm(-(z.n + z.m * z.w), z.m); // the other root: −n/m − w
      prompt = 'The length of a rectangular garden is ' + t(Math.abs(z.n)) + ' m ' + (z.n > 0 ? 'more' : 'less') + ' than ' + (z.m === 2 ? 'twice' : 'three times') + ' its width. Its area is ' + t(A) + ' m². Determine the perimeter of the garden.';
      ans = Pm; after = 'm';
      sol = 'Let the width be ' + t('w') + '; the length is ' + t(z.m + 'w' + sg(z.n)) + '.<br>' + t('w(' + z.m + 'w' + sg(z.n) + ')=' + A) + ', so ' + t(z.m + 'w^{2}' + sg(z.n) + 'w-' + A + '=0') + ' and ' + t(FX.tex(cleanList([lin(1, -z.w, 'w'), lin(z.m, z.n + z.m * z.w, 'w')])) + '=0') + '.<br>' + t('w=' + z.w) + ' or ' + t('w=' + ex.texRat(oth)) + ' (reject: a width is positive).<br>The garden is ' + t(z.w) + ' m by ' + t(L) + ' m, so the perimeter is ' + t('2(' + z.w + '+' + L + ')=' + Pm) + ' m.';
      dg = function (v) { if (v === z.w || v === L) return { code: cp + 'gave-width', hint: 'That is one side of the garden. The question asks for the <b>perimeter</b>.' }; if (v === z.w + L) return { code: cp + 'per-half', hint: 'The perimeter is ' + t('2(\\ell+w)') + '.' }; return null; };
    } else {
      var f = pickWhere(function () { return { W: r.int(6, 30), L: r.int(8, 40), x: r.int(1, 5) }; }, function (z) { return z.L > z.W && (z.W + z.L) % 2 === 0 && z.W * z.L <= 600 && !(z.W === 14 && z.L === 20) && !(z.W === 20 && z.L === 30) && !(z.W === 10 && z.L === 15) && !(z.W === 8 && z.L === 12); });
      var tot = (f.W + 2 * f.x) * (f.L + 2 * f.x), half = (f.W + f.L) / 2, neg = -half - f.x;
      ans = f.x; after = kind === 'frame' ? 'cm' : 'm';
      if (kind === 'frame') {
        prompt = 'A ' + t(f.W) + ' cm by ' + t(f.L) + ' cm photo has a frame of uniform width ' + t('x') + ' cm around it. The photo and frame together cover ' + t(tot) + ' cm². Determine the width of the frame.';
        sol = 'The outer dimensions are ' + t('(' + f.W + '+2x)') + ' by ' + t('(' + f.L + '+2x)') + '.<br>' + t('(' + f.W + '+2x)(' + f.L + '+2x)=' + tot) + ', so ' + t('4x^{2}+' + 2 * (f.W + f.L) + 'x' + sg(f.W * f.L - tot) + '=0') + '.<br>Divide by ' + t(4) + ': ' + t('x^{2}+' + half + 'x' + sg((f.W * f.L - tot) / 4) + '=0') + ', so ' + t(FX.tex([lin(1, -f.x), lin(1, -neg)]) + '=0') + '.<br>' + t('x=' + f.x) + ' or ' + t('x=' + neg) + ' (reject: a width cannot be negative). The frame is ' + t(f.x) + ' cm wide. (Check: ' + t((f.W + 2 * f.x) + '\\times ' + (f.L + 2 * f.x) + '=' + tot) + ' ✓)';
      } else {
        var pa = tot - f.W * f.L;
        prompt = 'A rectangular lawn ' + t(f.L) + ' m by ' + t(f.W) + ' m is surrounded by a path of uniform width ' + t('x') + ' m. The area of the path alone is ' + t(pa) + ' m². Determine the width of the path.';
        sol = 'The lawn and path together are ' + t('(' + f.L + '+2x)') + ' by ' + t('(' + f.W + '+2x)') + '.<br>' + t('(' + f.L + '+2x)(' + f.W + '+2x)-' + f.W * f.L + '=' + pa) + ', so ' + t('4x^{2}+' + 2 * (f.W + f.L) + 'x-' + pa + '=0') + '.<br>Divide by ' + t(4) + ': ' + t('x^{2}+' + half + 'x-' + pa / 4 + '=0') + ', so ' + t(FX.tex([lin(1, -f.x), lin(1, -neg)]) + '=0') + '.<br>' + t('x=' + f.x) + ' or ' + t('x=' + neg) + ' (reject: a width cannot be negative). The path is ' + t(f.x) + ' m wide.';
      }
      dg = function (v) { if (v === neg) return { code: cp + 'neg-root', hint: 'A width cannot be negative: that root is inadmissible. Give the other one.' }; if (v === 2 * f.x) return { code: cp + 'gave-width', hint: 'That is the frame on <b>both</b> sides together. The width ' + t('x') + ' is on each side.' }; return null; };
    }
    var p = KP.number(prompt, ans, dg, sol, ['Let ' + t('x') + ' (or ' + t('w') + ') be the unknown and write the other dimensions in terms of it. Write the area equation.', 'Put it in standard form, factor, and reject any root that is inadmissible (a negative length).'], 'problem that leads to a quadratic', { after: after });
    p.bad = kind === 'rect' ? [String(ans / 2)] : [String(-(f.W + f.L) / 2 - f.x)];
    return p;
  };

  /* one root of ax² + kx + c = 0 is given: k, then the other root (EP05 C1) */
  B.rootKShared = function (r) {
    return pickWhere(function () { var a = r.pick([1, 2, 2, 3, 4, 5, 6]), dv = [1, 2, 3, 4, 5, 6].filter(function (d) { return a % d === 0; }), q = r.pick(dv); return { a: a, r0: nz(r, 1, 5), sp: nz(r, 1, 7), sq: q }; },
      function (z) { var s = ex.norm(z.sp, z.sq); if (s[1] !== z.sq) return false; var k = -z.a * (z.r0 + z.sp / z.sq), c = z.a * z.r0 * z.sp / z.sq; return Math.abs(k - Math.round(k)) < 1e-9 && Math.abs(c - Math.round(c)) < 1e-9 && Math.round(k) !== 0 && z.r0 !== z.sp / z.sq && Math.abs(c) <= 40 && Math.abs(k) <= 25 && !(z.a === 2 && z.r0 === 3 && Math.round(c) === -15); });
  };
  function rkEq(s) { var c = Math.round(s.a * s.r0 * s.sp / s.sq); return coefT(s.a) + 'x^{2}+kx' + sg(c) + '=0'; }
  B.rootKStem = function (s) { return 'One root of ' + t(rkEq(s)) + ' is ' + t('x=' + s.r0) + '.'; };
  B.rootKa = function (r, cp, s) {
    var k = Math.round(-s.a * (s.r0 + s.sp / s.sq)), c = Math.round(s.a * s.r0 * s.sp / s.sq);
    var p = KP.number('Determine the value of ' + t('k') + '.', k, function (v) { if (v === -k) return { code: cp + 'k-sign', hint: 'Check the sign: substitute ' + t('x=' + s.r0) + ' and solve for ' + t('k') + ' carefully.' }; return null; },
      'A root makes the equation true. Substitute ' + t('x=' + s.r0) + ': ' + t(coefT(s.a) + '(' + s.r0 + ')^{2}+k(' + s.r0 + ')' + sg(c) + '=0') + ', so ' + t((s.a * s.r0 * s.r0 + c) + (s.r0 < 0 ? '-' : '+') + (Math.abs(s.r0) === 1 ? '' : Math.abs(s.r0)) + 'k=0') + ' and ' + t('k=' + k) + '.',
      ['A root makes the equation true: substitute it for ' + t('x') + '.', 'Then solve the linear equation for ' + t('k') + '.'], 'find a coefficient from a root');
    p.bad = [String(-k)];
    return p;
  };
  B.rootKb = function (r, cp, s) {
    var k = Math.round(-s.a * (s.r0 + s.sp / s.sq)), c = Math.round(s.a * s.r0 * s.sp / s.sq), other = ex.norm(s.sp, s.sq);
    var Q = P.add(M(s.a, 'x', 2), M(k, 'x', 1), P.num(c)), list = cleanList([P.num(s.a / other[1]), lin(1, -s.r0), lin(other[1], -other[0])]);
    return rootsPart(cp, 'Determine the other root.', [other], { wrongs: [{ vals: [s.r0], code: cp + 'gave-given', hint: t('x=' + s.r0) + ' is the root you were given. Find the other one.' }, { vals: [s.r0, other], code: 'sol-extra', hint: 'Give only the <b>other</b> root.' }] },
      'With ' + t('k=' + k) + ': ' + t(tx(Q) + '=0') + '. One factor is ' + t(br(lin(1, -s.r0))) + ' (the root ' + t(s.r0) + '): ' + t(FX.tex(list) + '=0') + '.<br>The other root is ' + t('x=' + rt(other)) + '. (Check: the product of the roots is ' + t('\\frac{c}{a}=' + fr(c, s.a)) + '.)',
      ['Put the value of ' + t('k') + ' into the equation and factor it: one factor is ' + t('(x-' + par(s.r0) + ')') + '.', 'Set the other factor equal to ' + t(0) + '.'], 'the other root');
  };
  /* both at once (one part): the other root, finding k on the way (exit slip) */
  B.rootKOne = function (r, cp) {
    var s = B.rootKShared(r), p = B.rootKb(r, cp, s);
    p.prompt = B.rootKStem(s) + ' Determine the value of ' + t('k') + ' and then the other root. Type the other root.';
    var k = Math.round(-s.a * (s.r0 + s.sp / s.sq)), c = Math.round(s.a * s.r0 * s.sp / s.sq);
    p.solution = 'Substitute ' + t('x=' + s.r0) + ': ' + t(coefT(s.a) + '(' + s.r0 + ')^{2}+k(' + s.r0 + ')' + sg(c) + '=0') + ', so ' + t('k=' + k) + '.<br>' + p.solution;
    return p;
  };

  /* ======================================================================================================
   * Radical equations (AN3)
   * ====================================================================================================== */
  function setPart(cp, prompt, target, wrongs, sol, hints, text, v) {
    var ws = (wrongs || []).filter(function (w) { return w && w.is && w.is !== target; });
    var p = KP.set(prompt, target, { v: v || 'x', wrong: ws }, sol, hints, text);
    p.bad = ws.map(function (w) { return w.is; }).filter(function (b, i, arr) { return arr.indexOf(b) === i; });
    return p;
  }
  /* restrictions: 'one' (a radicand, with the reversal), 'two' (two radicals), 'eq' (√A = B: radicand and right side) (L6 Ex 1, #1, L7 Ex 2, #2) */
  B.restr = function (r, cp, opt) {
    opt = opt || {};
    var mode = opt.mode || 'one', prompt, target, ws = [], sol, hints;
    if (mode === 'one') {
      var s = pickWhere(function () { return { a: r.int(1, 6), b: nz(r, 1, 12), rev: r.chance(0.45), eq: r.chance(0.6), k: r.int(1, 9), d: nz(r, 1, 6) }; }, function (z) { return !(z.a === 1 && z.b === 4) && !(z.a === 2 && z.b === -5) && !(z.a === 3 && z.b === 6 && z.rev) && (z.rev ? z.b > 0 : true) && Math.abs(z.b) !== z.a; });
      var rad = s.rev ? linT(-s.a, s.b) : linT(s.a, s.b), bd = s.rev ? fr(s.b, s.a) : fr(-s.b, s.a);
      var expr = s.eq ? (r.chance(0.5) ? sqrtT(rad) + '=' + s.k : sqrtT(rad) + sg(s.d) + '=' + (s.k + s.d)) : sqrtT(rad);
      prompt = 'State the restriction on the variable in ' + t(expr) + '.';
      target = (s.rev ? 'x\\le ' : 'x\\ge ') + bd;
      if (s.rev) {
        ws.push({ is: 'x\\ge ' + bd, code: cp + 'res-dir', hint: 'You divided by ' + t(-s.a) + ', a <b>negative</b> number, so the inequality sign reverses.' });
        ws.push({ is: 'x\\le ' + fr(-s.b, s.a), code: cp + 'res-sign', hint: 'Solve ' + t(rad + '\\ge 0') + ' carefully: check the sign of the boundary.' });
        ws.push({ is: 'x<' + bd, code: cp + 'res-strict', hint: 'The radicand can equal ' + t(0) + ' (' + t('\\sqrt{0}=0') + '), so the boundary is included.' });
        sol = 'The radicand must be non-negative: ' + t(rad + '\\ge 0\\Rightarrow ' + (-s.a) + 'x\\ge ' + (-s.b) + '\\Rightarrow ' + target) + ' (dividing by a negative reverses the sign).';
      } else {
        ws.push({ is: 'x\\ge ' + fr(s.b, s.a), code: cp + 'res-sign', hint: 'Solve ' + t(rad + '\\ge 0') + ' carefully: moving ' + t(sg(s.b)) + ' to the other side changes its sign.' });
        ws.push({ is: 'x\\le ' + bd, code: cp + 'res-dir', hint: 'You divided by a <b>positive</b> number, so the inequality sign does not change.' });
        ws.push({ is: 'x>' + bd, code: cp + 'res-strict', hint: 'The radicand can equal ' + t(0) + ', so the boundary is included: use ' + t('\\ge') + '.' });
        sol = 'The radicand must be non-negative: ' + t(rad + '\\ge 0\\Rightarrow ' + (s.a === 1 ? '' : s.a + 'x\\ge ' + (-s.b) + '\\Rightarrow ') + target) + '.';
      }
      hints = ['A square root is defined only when its radicand is ' + t('\\ge 0') + '.', 'Solve the inequality; dividing by a negative number reverses the sign.'];
    } else if (mode === 'two') {
      var z = pickWhere(function () { return { m: r.int(1, 3), p: nz(r, 1, 9), n: r.int(1, 3), q: nz(r, 1, 12), both: r.chance(0.25), op: r.pick(['+', '-']), eq: r.chance(0.5), k: r.int(1, 4) }; },
        function (z) { if (Math.abs(z.p) === z.m || Math.abs(z.q) === z.n) return false; var lo = -z.p / z.m, hi = z.both ? -z.q / z.n : z.q / z.n; return z.both ? Math.abs(lo - hi) > 0.4 : hi - lo >= 1; });
      var r1 = linT(z.m, z.p), r2 = z.both ? linT(z.n, z.q) : linT(-z.n, z.q), lo = fr(-z.p, z.m), hi = z.both ? fr(-z.q, z.n) : fr(z.q, z.n);
      var expr2 = sqrtT(r1) + z.op + sqrtT(r2) + (z.eq ? '=' + z.k : '');
      prompt = 'State the restriction on the variable in ' + t(expr2) + '.';
      if (z.both) {
        var big = -z.p / z.m > -z.q / z.n ? lo : hi, small = big === lo ? hi : lo;
        target = 'x\\ge ' + big;
        ws.push({ is: 'x\\ge ' + small, code: cp + 'res-comb', hint: 'Both radicands must be ' + t('\\ge 0') + ' at the same time: ' + t('x') + ' must be at least the <b>larger</b> boundary.' });
        sol = t(r1 + '\\ge 0\\Rightarrow x\\ge ' + lo) + ' and ' + t(r2 + '\\ge 0\\Rightarrow x\\ge ' + hi) + '. Both are true when ' + t(target) + '.';
      } else {
        target = lo + '\\le x\\le ' + hi;
        ws.push({ is: 'x\\ge ' + lo, code: cp + 'res-one', hint: 'That makes the first radical defined. The second radicand ' + t(r2) + ' must be ' + t('\\ge 0') + ' too.' });
        ws.push({ is: 'x\\le ' + hi, code: cp + 'res-one', hint: 'That makes the second radical defined. The first radicand ' + t(r1) + ' must be ' + t('\\ge 0') + ' too.' });
        ws.push({ is: lo + '<x<' + hi, code: cp + 'res-strict', hint: 'Each radicand may equal ' + t(0) + ', so both ends are included.' });
        sol = t(r1 + '\\ge 0\\Rightarrow x\\ge ' + lo) + ' and ' + t(r2 + '\\ge 0\\Rightarrow x\\le ' + hi) + ' (the sign reverses). Both are true when ' + t(target) + '.';
      }
      hints = ['Each radicand must be ' + t('\\ge 0') + '.', t('x') + ' must satisfy both conditions at the same time: combine them into one statement.'];
    } else { // eq: √(radicand) = right side (after isolating)
      var y = pickWhere(function () { return { a: r.pick([1, 2, 3, -1, -2, -3]), b: nz(r, 1, 12), c: nz(r, 1, 8), rs: r.pick([1, 1, -1]), d: r.chance(0.35) ? nz(r, 1, 5) : 0 }; }, function (z) {
        var radB = z.a > 0 ? -z.b / z.a : z.b / -z.a, rhsB = z.rs > 0 ? -z.c : z.c; // radicand: x ≥ radB (a>0) or x ≤ radB (a<0); rhs: x ≥ rhsB (rs>0) or x ≤ rhsB
        if (Math.abs(radB - rhsB) < 0.3) return false;
        if ((z.a > 0) !== (z.rs > 0)) return z.a > 0 ? radB < rhsB - 0.9 : rhsB < radB - 0.9; // an interval
        return true;
      });
      var rad3 = y.a > 0 ? linT(y.a, y.b) : linT(y.a, y.b), rhs = y.rs > 0 ? lin(1, y.c) : lin(-1, y.c), rhsT = y.rs > 0 ? tx(rhs) : linT(-1, y.c);
      var radB2 = y.a > 0 ? fr(-y.b, y.a) : fr(y.b, -y.a), rhsB2 = y.rs > 0 ? fr(-y.c) : fr(y.c), rv1 = y.a > 0 ? -y.b / y.a : y.b / -y.a, rv2 = y.rs > 0 ? -y.c : y.c;
      var c1 = (y.a > 0 ? 'x\\ge ' : 'x\\le ') + radB2, c2 = (y.rs > 0 ? 'x\\ge ' : 'x\\le ') + rhsB2;
      if (y.a > 0 && y.rs > 0) { target = 'x\\ge ' + (rv1 > rv2 ? radB2 : rhsB2); ws.push({ is: 'x\\ge ' + (rv1 > rv2 ? rhsB2 : radB2), code: cp + 'res-comb', hint: 'Both conditions must be true: ' + t('x') + ' must be at least the <b>larger</b> boundary.' }); }
      else if (y.a < 0 && y.rs < 0) { target = 'x\\le ' + (rv1 < rv2 ? radB2 : rhsB2); ws.push({ is: 'x\\le ' + (rv1 < rv2 ? rhsB2 : radB2), code: cp + 'res-comb', hint: 'Both conditions must be true: ' + t('x') + ' must be at most the <b>smaller</b> boundary.' }); }
      else { target = y.a > 0 ? radB2 + '\\le x\\le ' + rhsB2 : rhsB2 + '\\le x\\le ' + radB2; }
      ws.push({ is: c1, code: cp + 'res-one', hint: 'That is the radicand’s condition. A square root is never negative, so the other side, ' + t(rhsT) + ', must be ' + t('\\ge 0') + ' too.' });
      ws.push({ is: c2, code: cp + 'res-one', hint: 'That is the right side’s condition. The radicand ' + t(rad3) + ' must be ' + t('\\ge 0') + ' too.' });
      var eqT = y.d ? sqrtT(rad3) + sg(y.d) + '=' + tx(P.add(rhs, P.num(y.d))).replace(/^(-?)x([+-]\d+)$/, '$1x$2') : sqrtT(rad3) + '=' + rhsT;
      if (y.d && y.rs < 0) eqT = sqrtT(rad3) + sg(y.d) + '=' + linT(-1, y.c + y.d);
      prompt = 'State all the restrictions on ' + t('x') + ' for the equation ' + t(eqT) + '.';
      sol = (y.d ? 'Isolate the radical: ' + t(sqrtT(rad3) + '=' + rhsT) + '.<br>' : '') + 'Radicand: ' + t(rad3 + '\\ge 0\\Rightarrow ' + c1) + '. Right side (a square root is never negative): ' + t(rhsT + '\\ge 0\\Rightarrow ' + c2) + '.<br>Together: ' + t(target) + '.';
      hints = ['Isolate the radical first. Then two things must be true: the radicand is ' + t('\\ge 0') + ', and the other side is ' + t('\\ge 0') + ' (a square root is never negative).', 'Combine the two conditions into one statement.'];
    }
    return setPart(cp, prompt, target, ws, sol, hints, 'restrictions on a radical');
  };

  /* k√(ax + b) + d = e (or e − k√… = d, or √((x + b)/a) = v); opt.none: sometimes the radical must equal a negative (L6 Ex 2, Ex 4, #2–4) */
  B.radSolve1 = function (r, cp, opt) {
    opt = opt || {};
    var none = opt.none ? r.chance(opt.none) : false, kind = opt.basic ? 'plain' : r.pick(['plus', 'plus', 'minus', 'frac']);
    if (none && kind === 'frac') kind = 'plus';
    var s = pickWhere(function () { return { a: r.int(1, 5), b: nz(r, 1, 9), v: r.int(1, 7), k: kind === 'plain' || kind === 'frac' ? 1 : r.pick([1, 2, 2, 3, 4]), d: kind === 'plain' ? 0 : nz(r, 1, 9) }; }, function (z) {
      var X = (z.v * z.v - z.b) / z.a; if (kind === 'frac') X = z.a * z.v * z.v - z.b;
      if (kind === 'frac' && z.a === 1) return false;
      if (Math.abs(X * 2 - Math.round(X * 2)) > 1e-9) return false; // a whole number or a half
      if (kind === 'plus' && z.k === 1 && none && z.d < 0) return false;
      return Math.abs(X) <= 60 && !(z.a === 3 && z.b === 1 && z.v === 5) && !(z.a === 2 && z.b === -5 && z.v === 4);
    });
    var a = s.a, b = s.b, k = s.k, d = s.d, v = s.v, rad = linT(a, b), X = kind === 'frac' ? [a * v * v - b, 1] : ex.norm(v * v - b, a), eq, steps, vals = [[X[0], X[1]]], ext = [];
    var rhs = none ? -v : v;
    if (kind === 'plain') { eq = sqrtT(rad) + '=' + rhs; steps = ''; }
    else if (kind === 'frac') { eq = '\\sqrt{\\dfrac{' + tx(lin(1, b)) + '}{' + a + '}}=' + v; steps = ''; }
    else if (kind === 'plus') { eq = kSqrt(k, rad) + sg(d) + '=' + (k * rhs + d); steps = t(kSqrt(k, rad) + '=' + (k * rhs)) + (k > 1 ? ', so ' + t(sqrtT(rad) + '=' + rhs) : '') + '. '; }
    else { var e = d + k * rhs; eq = e + '-' + kSqrt(k, rad) + '=' + d; steps = t(kSqrt(-k, rad) + '=' + (d - e)) + ', so ' + t(sqrtT(rad) + '=' + rhs) + '. '; }
    var restr = kind === 'frac' ? 'x\\ge ' + fr(-b) : 'x\\ge ' + fr(-b, a);
    var wr = [], sol;
    if (none) {
      ext = [ex.norm(v * v - b, a)]; vals = [];
      sol = 'Isolate the radical: ' + steps + 'A principal square root is never negative, so there is <b>no solution</b>.<br>(Squaring anyway gives ' + t(rad + '=' + v * v) + ', ' + t('x=' + rt(ext[0])) + ', which does not check: it is extraneous.)';
    } else {
      var sqd = kind === 'frac' ? t('\\dfrac{' + tx(lin(1, b)) + '}{' + a + '}=' + v * v) + ', so ' + t(tx(lin(1, b)) + '=' + a * v * v) : t(rad + '=' + v * v);
      sol = 'Restriction: ' + t(restr) + '.<br>' + (steps ? 'Isolate the radical: ' + steps + '<br>' : '') + 'Square both sides: ' + sqd + ', so ' + t('x=' + rt(X)) + '.<br>Verify: ' + t(eq.replace(/x/g, '(' + rt(X) + ')').replace(/\(\(/g, '((')) + ' ✓ (the radicand is ' + t(v * v) + ').';
      if (kind !== 'frac') { var ns = ex.norm(v - b, a); if (ns[0] / ns[1] !== X[0] / X[1]) wr.push({ vals: [ns], code: cp + 'rad-nosq', hint: 'To undo a square root, <b>square</b> both sides: ' + t(sqrtT(rad) + '=' + v) + ' gives ' + t(rad + '=' + v * v) + '.' }); }
      if (k > 1 && kind !== 'frac') { var kv = k * v, nk = ex.norm(kv * kv - b, a); wr.push({ vals: [nk], code: cp + 'rad-coef', hint: 'Divide by ' + t(k) + ' before squaring (or square the ' + t(k) + ' too): ' + t('(' + k + '\\sqrt{A})^{2}=' + k * k + 'A') + '.' }); }
    }
    var p = rootsPart(cp, 'Solve and verify: ' + t(eq) + '.' + (opt.none ? ' (If there is no solution, type “no solution”.)' : ''), vals, { wrongs: wr, extr: ext, extrHint: none ? 'Check your value in the original equation: the left side is ' + t(sqrtT(rad) + '=' + v) + ', not ' + t(-v) + '. A square root is never negative, so the value is extraneous.' : null }, sol,
      ['Isolate the radical: get ' + t('\\sqrt{\\ }') + ' alone on one side. If it equals a negative number, there is no solution.', 'Square both sides, solve, and verify in the original equation.'], 'solve a radical equation');
    return p;
  };

  /* a radical on each side: k√(ax + b) = √(cx + d), sometimes extraneous (L6 Ex 5, #5) */
  B.radBoth = function (r, cp, opt) {
    opt = opt || {};
    var extr = opt.extr != null ? r.chance(opt.extr) : r.chance(0.4);
    var s = pickWhere(function () { var k = r.pick([1, 1, 1, 2, 3]); return { k: k, a: k === 1 ? r.pick([1, 2, 3, 4, 5, -1, -2]) : r.int(1, 3), c: r.pick([1, 2, 3, 4, 5, 6, 7, 9]), x0: r.int(-6, 10), u: extr ? -r.int(1, 6) : r.int(1, 6) }; }, function (z) {
      var b = z.u - z.a * z.x0, d = z.k * z.k * z.u - z.c * z.x0; return z.k * z.k * z.a !== z.c && b !== 0 && d !== 0 && Math.abs(b) <= 20 && Math.abs(d) <= 25 && (z.k === 1 || isSq(z.u) || true) && z.a !== z.c;
    });
    var b = s.u - s.a * s.x0, d = s.k * s.k * s.u - s.c * s.x0, A = linT(s.a, b), Cc = linT(s.c, d), eq = kSqrt(s.k, A) + '=' + sqrtT(Cc), x0 = s.x0;
    var coefL = s.k * s.k * s.a - s.c, constR = d - s.k * s.k * b;
    var sol = 'Square both sides' + (s.k > 1 ? ' (square the ' + t(s.k) + ' too)' : '') + ': ' + t((s.k > 1 ? s.k * s.k + '(' + A + ')' : A) + '=' + Cc) + ', so ' + t(coefL + 'x=' + constR) + ' and ' + t('x=' + x0) + '.<br>';
    sol += extr ? 'Verify: ' + t(A) + ' at ' + t('x=' + x0) + ' is ' + t(s.u) + ', and the square root of a negative number is not real. ' + t('x=' + x0) + ' is extraneous: <b>no solution</b>.' : 'Verify: left side ' + t(kSqrt(s.k, String(s.u))) + ', right side ' + t(sqrtT(String(s.k * s.k * s.u))) + ' ✓ (both radicands are non-negative).';
    var wr = [];
    if (s.k > 1 && s.k * s.a !== s.c) { var xn = ex.norm(d - s.k * b, s.k * s.a - s.c); if (!(xn[0] === x0 && xn[1] === 1)) wr.push({ vals: [xn], code: cp + 'rad-coef', hint: 'Square the coefficient too: ' + t('(' + s.k + '\\sqrt{A})^{2}=' + s.k * s.k + 'A') + '.' }); }
    return rootsPart(cp, 'Solve and verify: ' + t(eq) + '. (If there is no solution, type “no solution”.)', extr ? [] : [x0], { wrongs: wr, extr: extr ? [x0] : [], extrHint: 'Check ' + t('x=' + x0) + ' in the original equation: the radicand ' + t(A) + ' is ' + t(s.u) + ', a negative number, so ' + t('x=' + x0) + ' is extraneous.' }, sol,
      ['A single radical on each side: square both sides to get ' + t('A=B') + (s.k > 1 ? ' (a coefficient in front is squared too)' : '') + '.', 'Verify in <b>both</b> radicands: a value that makes either one negative is extraneous.'], 'radical on each side');
  };

  /* for which values of c does the equation have no solution? (EP06 C2) */
  B.noSolC = function (r, cp) {
    var s = pickWhere(function () { return { a: nz(r, 1, 9), q: nz(r, 1, 9), k: r.pick([1, 1, 2, 3]), kind: r.pick(['plus', 'qminus', 'cminus']) }; }, function (z) { return !(z.kind === 'plus' && z.a === -3 && z.q === 1 && z.k === 1); });
    var rad = tx(lin(1, s.a)), sq = kSqrt(s.k, rad), eq, target, wrongDir, sol;
    if (s.kind === 'plus') { eq = sq + '+c=' + s.q; target = 'c>' + s.q; wrongDir = 'c<' + s.q; sol = t(sq + '=' + s.q + '-c') + '. A square root is never negative, so there is no solution when ' + t(s.q + '-c<0') + ', that is, ' + t(target) + '.'; }
    else if (s.kind === 'qminus') { eq = s.q + '-' + sq + '=c'; target = 'c>' + s.q; wrongDir = 'c<' + s.q; sol = t(sq + '=' + s.q + '-c') + '. No solution when ' + t(s.q + '-c<0') + ': ' + t(target) + '.'; }
    else { eq = 'c-' + sq + '=' + s.q; target = 'c<' + s.q; wrongDir = 'c>' + s.q; sol = t(sq + '=c' + sg(-s.q)) + '. No solution when ' + t('c' + sg(-s.q) + '<0') + ': ' + t(target) + '.'; }
    sol += ' (When the radical equals ' + t(0) + ' there is a root, ' + t('x=' + (-s.a)) + ', so the boundary is not included.)';
    return setPart(cp, 'For which values of ' + t('c') + ' does ' + t(eq) + ' have <b>no solution</b>? Write an inequality.', target,
      [{ is: target.replace('>', '\\ge ').replace('<', '\\le '), code: cp + 'nosol-eq', hint: 'When the radical equals ' + t(0) + ' the equation has a root (' + t('x=' + (-s.a)) + '), so the boundary value of ' + t('c') + ' gives a solution.' },
        { is: wrongDir, code: cp + 'res-dir', hint: 'For those values the radical equals a <b>positive</b> number, and there is a solution. Isolate the radical and ask when the other side is negative.' }],
      sol, ['Isolate the radical. A square root is never negative.', 'There is no solution exactly when the other side is negative.'], 'when there is no solution', 'c');
  };

  /* √(px + q) = x + c leading to a quadratic: 'basic', 'isolate' (x − √… = c, √… + c = x), 'coef' (k√(x + q) = x + c) (L7 Ex 3–5, #4–5) */
  B.radQuad = function (r, cp, opt) {
    opt = opt || {};
    var mode = opt.mode || 'basic', both = r.chance(opt.both != null ? opt.both : 0.25);
    var s = pickWhere(function () {
      var k = mode === 'coef' ? r.pick([2, 3]) : 1, r1 = r.int(-6, 12), r2 = r.int(-8, 12), c = mode === 'coef' ? null : r.int(-7, 7);
      var S = r1 + r2, Pr = r1 * r2;
      if (mode === 'coef') { if ((k * k - S) % 2) return null; c = (k * k - S) / 2; if ((c * c - Pr) % (k * k)) return null; return { k: k, r1: r1, r2: r2, c: c, q: (c * c - Pr) / (k * k), p: 1 }; }
      return { k: 1, r1: r1, r2: r2, c: c, p: S + 2 * c, q: c * c - Pr };
    }, function (z) {
      if (z.r1 === z.r2) return false;
      var v1 = z.r1 + z.c >= 0, v2 = z.r2 + z.c >= 0;
      if (!v1 && !v2) return false;
      if (both ? !(v1 && v2) : (v1 && v2)) return false;
      if (mode !== 'coef' && (z.p <= 0 || z.p > 12)) return false;
      if (z.q === 0 || Math.abs(z.q) > 45) return false;
      if (mode !== 'coef' && z.c === 0 && r.chance(0.5)) return false;
      if (both && (z.r1 + z.c === 0 || z.r2 + z.c === 0) && r.chance(0.6)) return false;
      return !(z.p === 1 && z.q === 12 && z.c === 0) && !(z.p === 2 && z.q === 7 && z.c === 2);
    });
    var k = s.k, c = s.c, rad = mode === 'coef' ? tx(lin(1, s.q)) : tx(lin(s.p, s.q)), rhs = tx(lin(1, c)), eq, iso = '';
    var valid = [s.r1, s.r2].filter(function (x) { return x + c >= 0; }), bad = [s.r1, s.r2].filter(function (x) { return x + c < 0; });
    if (mode === 'isolate') {
      var form0 = r.pick(['xminus', 'plusx']);
      if (form0 === 'xminus') { eq = 'x-' + sqrtT(rad) + '=' + (-c); iso = 'Isolate the radical: ' + t(sqrtT(rad) + '=' + rhs) + '.<br>'; }
      else { eq = sqrtT(rad) + sg(-c) + '=x'; iso = 'Isolate the radical: ' + t(sqrtT(rad) + '=' + rhs) + '.<br>'; }
      if (c === 0) { eq = sqrtT(rad) + '=x'; iso = ''; }
    } else eq = r.chance(0.25) && mode === 'basic' ? rhs + '=' + kSqrt(k, rad) : kSqrt(k, rad) + '=' + rhs;
    var Q = P.mul(lin(1, -s.r1), lin(1, -s.r2)), lhsSq = mode === 'coef' ? k * k + '(' + rad + ')' : rad;
    var rbT = mode === 'coef' ? fr(-s.q) : fr(-s.q, s.p), rbV = mode === 'coef' ? -s.q : -s.q / s.p;
    var sol = iso + 'Restrictions: ' + t('x\\ge ' + rbT) + ' and ' + t(rhs + '\\ge 0') + ', so ' + t('x\\ge ' + (rbV > -c ? rbT : fr(-c))) + '.<br>' +
      'Square both sides: ' + t(lhsSq + '=' + tx(P.pow(lin(1, c), 2))) + ', so ' + t(tx(Q) + '=0') + ' and ' + t(FX.tex([lin(1, -s.r1), lin(1, -s.r2)]) + '=0') + ': ' + t('x=' + s.r1) + ' or ' + t('x=' + s.r2) + '.<br>' +
      [s.r1, s.r2].map(function (x) { var L0 = k * Math.abs(x + c), R0 = x + c; return 'Check ' + t('x=' + x) + ': ' + t(kSqrt(k, rad).replace(/x/g, '(' + x + ')') + '=' + L0) + ' and ' + t(rhs.replace(/x/g, '(' + x + ')') + '=' + R0) + (R0 >= 0 ? ' ✓' : ': ' + t(L0 + '\\ne ' + R0) + ', so ' + t('x=' + x) + ' is extraneous') + '.'; }).join('<br>') +
      '<br>' + (valid.length === 2 ? 'Both roots check: ' : 'The root is ') + rootsTex(valid) + '.';
    var wr = [];
    // squaring the binomial without its middle term: px + q = x² + c² (k = 1)
    if (mode !== 'coef' && c !== 0) { var B2 = -s.p, C2 = c * c - s.q, D2 = B2 * B2 - 4 * C2; if (D2 > 0 && isSq(D2)) { var sd = Math.sqrt(D2), w1 = (-B2 + sd) / 2, w2 = (-B2 - sd) / 2; if (w1 % 1 === 0 && w2 % 1 === 0) wr.push({ vals: [w1, w2].filter(function (x, i, arr) { return arr.indexOf(x) === i; }), code: cp + 'sq-mid', hint: t('(' + rhs + ')^{2}') + ' has a middle term: ' + t('(' + rhs + ')^{2}=' + tx(P.pow(lin(1, c), 2))) + ', not ' + t('x^{2}+' + c * c) + '.' }); } }
    return rootsPart(cp, 'Solve and verify: ' + t(eq) + '. Reject any extraneous root.', valid, { wrongs: wr, extr: bad, bothValid: valid.length === 2,
      extrHint: bad.length ? 'Check ' + t('x=' + bad[0]) + ' in the original equation: the radical side is ' + t(k * Math.abs(bad[0] + c)) + ' but the other side is ' + t(bad[0] + c) + '. It is extraneous: reject it.' : null }, sol,
      ['Isolate the radical, state the restrictions, then square both sides: ' + t('(a+b)^{2}=a^{2}+2ab+b^{2}') + '.', 'Solve the quadratic by factoring, then check <b>every</b> root in the original equation.'], 'radical equation that leads to a quadratic');
  };

  /* x + p√x = q (one root) or x − s√x + P = 0 (two roots) with u = √x (L7 Ex 6, #8, nr) */
  B.radSub = function (r, cp) {
    var two = r.chance(0.4), s, eq, vals, wr = [], sol, ext = [];
    if (two) {
      s = pickWhere(function () { return { m: r.int(1, 6), n: r.int(1, 7) }; }, function (z) { return z.m < z.n && !(z.m === 2 && z.n === 3) && !(z.m === 2 && z.n === 4) && z.m + z.n <= 11; });
      var S = s.m + s.n, Pr = s.m * s.n;
      eq = 'x-' + S + '\\sqrt{x}+' + Pr + '=0'; vals = [s.m * s.m, s.n * s.n];
      wr.push({ vals: [s.m, s.n], code: cp + 'gave-u', hint: 'Those are the values of ' + t('u=\\sqrt{x}') + '. Square them to get ' + t('x') + '.' });
      sol = 'Let ' + t('u=\\sqrt{x}') + ' (' + t('u\\ge 0') + ', ' + t('x=u^{2}') + '): ' + t('u^{2}-' + S + 'u+' + Pr + '=(u-' + s.m + ')(u-' + s.n + ')=0') + ', so ' + t('u=' + s.m) + ' or ' + t('u=' + s.n) + ' (both ' + t('\\ge 0') + ').<br>' + t('x=' + s.m * s.m) + ' or ' + t('x=' + s.n * s.n) + '. Check: ' + t(s.m * s.m + '-' + S + '(' + s.m + ')+' + Pr + '=0') + ' ✓, ' + t(s.n * s.n + '-' + S + '(' + s.n + ')+' + Pr + '=0') + ' ✓.';
    } else {
      s = pickWhere(function () { return { u1: r.int(2, 8), p: nz(r, 1, 6) }; }, function (z) { var u2 = -z.p - z.u1; return u2 < 0 && !(z.u1 === 3 && z.p === 1) && !(z.u1 === 4 && z.p === 1) && !(z.u1 === 4 && z.p === 2) && !(z.u1 === 6 && z.p === -1) && !(z.u1 === 5 && z.p === -3); });
      var u2 = -s.p - s.u1, q = -s.u1 * u2;
      eq = 'x' + (s.p < 0 ? '-' : '+') + coefT(Math.abs(s.p)) + '\\sqrt{x}=' + q; vals = [s.u1 * s.u1]; ext = [u2 * u2];
      wr.push({ vals: [s.u1], code: cp + 'gave-u', hint: 'That is ' + t('u=\\sqrt{x}') + '. Square it to get ' + t('x') + '.' });
      sol = 'Let ' + t('u=\\sqrt{x}') + ' (' + t('u\\ge 0') + ', ' + t('x=u^{2}') + '): ' + t('u^{2}' + (s.p < 0 ? '-' : '+') + coefT(Math.abs(s.p)) + 'u-' + q + '=(u-' + s.u1 + ')(u' + sg(-u2) + ')=0') + ', so ' + t('u=' + s.u1) + ' or ' + t('u=' + u2) + ' (reject: ' + t('\\sqrt{x}\\ge 0') + ').<br>' + t('\\sqrt{x}=' + s.u1 + '\\Rightarrow x=' + s.u1 * s.u1) + '. Check: ' + t(s.u1 * s.u1 + (s.p < 0 ? '-' : '+') + coefT(Math.abs(s.p)) + '(' + s.u1 + ')=' + q) + ' ✓.';
    }
    return rootsPart(cp, 'Solve and verify: ' + t(eq) + '.', vals, { wrongs: wr, extr: ext, extrHint: ext.length ? t('x=' + ext[0]) + ' comes from ' + t('\\sqrt{x}=' + Math.round(-Math.sqrt(ext[0]))) + ', which is impossible: check it in the original equation. It is extraneous.' : null }, sol,
      ['Let ' + t('u=\\sqrt{x}') + ', so ' + t('x=u^{2}') + ' and ' + t('u\\ge 0') + '. Factor the quadratic in ' + t('u') + '.', 'Reject a negative ' + t('u') + ', then square to find ' + t('x') + ' and check.'], 'substitute u = √x');
  };

  /* two radicals, squaring twice (L7 Ex 7, #9, EP07 B2, L8 Ex 9, EP08 C4) */
  function twiceSpec(r) {
    return pickWhere(function () {
      var kind = r.pick(['diff', 'diff', 'sum']), c = kind === 'diff' ? r.pick([1, 1, 2]) : r.int(3, 7), m = r.pick([1, 1, 2, 2, 3]), n = r.pick([1, 1, 2]), x0 = r.int(-3, 14), s = r.int(0, 4);
      if (Math.abs(m - n) > 1) return null;
      var top = kind === 'diff' ? s + c : c - s; if (top < 0) return null;
      var a = top * top - m * x0, b = s * s - n * x0;
      return { kind: kind, c: c, m: m, n: n, x0: x0, s: s, a: a, b: b };
    }, function (z) {
      if (Math.abs(z.a) > 30 || Math.abs(z.b) > 30 || (z.m === z.n && z.a === z.b)) return false;
      var A = lin(z.m, z.a), Bp = lin(z.n, z.b), Lp = z.kind === 'diff' ? P.sub(P.sub(A, Bp), P.num(z.c * z.c)) : P.sub(P.add(P.num(z.c * z.c), Bp), A);
      z.A = A; z.B = Bp; z.L = Lp;
      if (z.m === z.n) { var L0 = P.constant(Lp)[0]; z.roots = [z.x0]; z.x1 = null; return L0 >= 0 && L0 % (2 * z.c) === 0 && r.chance(0.3); }
      var Q = P.sub(P.mul(Lp, Lp), P.scale(Bp, 4 * z.c * z.c)), a2 = P.coef(Q, { x: 2 })[0], a1 = P.coef(Q, { x: 1 })[0];
      var x1 = -a1 / a2 - z.x0; if (Math.abs(x1 - Math.round(x1)) > 1e-9) return false; x1 = Math.round(x1);
      if (x1 === z.x0 || Math.abs(x1) > 40) return false;
      z.Q = Q; z.x1 = x1;
      var fA = z.m * x1 + z.a, fB = z.n * x1 + z.b, okv = fA >= 0 && fB >= 0 && Math.abs((z.kind === 'diff' ? Math.sqrt(fA) - Math.sqrt(fB) : Math.sqrt(fA) + Math.sqrt(fB)) - z.c) < 1e-9;
      z.x1ok = okv; z.roots = okv ? [z.x0, x1] : [z.x0];
      return P.lead(Lp)[0] !== 0 && r.chance(okv ? 0.35 : 1);
    });
  }
  B.radTwice = function (r, cp) {
    var z = twiceSpec(r), At = tx(z.A), Bt = tx(z.B), c = z.c, eq = sqrtT(At) + (z.kind === 'diff' ? '-' : '+') + sqrtT(Bt) + '=' + c;
    var lo = Math.max(-z.a / z.m, -z.b / z.n), loT = -z.a / z.m >= -z.b / z.n ? fr(-z.a, z.m) : fr(-z.b, z.n);
    var iso = z.kind === 'diff' ? c + '+' + sqrtT(Bt) : c + '-' + sqrtT(Bt), sq1 = z.kind === 'diff' ? (c * c) + '+' + 2 * c + sqrtT(Bt) + '+' + '(' + Bt + ')' : (c * c) + '-' + 2 * c + sqrtT(Bt) + '+' + '(' + Bt + ')';
    var Lt = tx(z.L), steps = 'Restrictions: ' + t('x\\ge ' + loT) + '.<br>Isolate one radical: ' + t(sqrtT(At) + '=' + iso) + '.<br>Square: ' + t(At + '=' + sq1) + ', so ' + t(Lt + '=' + 2 * c + sqrtT(Bt)) + '.<br>';
    if (z.m === z.n) { var L0 = P.constant(z.L)[0], sv = L0 / (2 * c); steps += t(sqrtT(Bt) + '=' + sv) + '. Square again: ' + t(Bt + '=' + sv * sv) + ', so ' + t('x=' + z.x0) + '.<br>'; }
    else { steps += 'Square again: ' + t('(' + Lt + ')^{2}=' + 4 * c * c + '(' + Bt + ')') + ', so ' + t(tx(z.Q) + '=0') + ', ' + t(FX.tex(cleanList([P.num(P.lead(z.Q)[0]), lin(1, -z.x0), lin(1, -z.x1)])) + '=0') + ': ' + t('x=' + z.x0) + ' or ' + t('x=' + z.x1) + '.<br>'; }
    var chk = function (x) { var fA = z.m * x + z.a, fB = z.n * x + z.b; if (fA < 0 || fB < 0) return 'Check ' + t('x=' + x) + ': ' + t(fA < 0 ? At : Bt) + ' is negative there (it breaks the restriction), so it is extraneous.'; var sA = Math.sqrt(fA), sB = Math.sqrt(fB), lhs = z.kind === 'diff' ? sA - sB : sA + sB; return 'Check ' + t('x=' + x) + ': ' + t(sqrtT(String(fA)) + (z.kind === 'diff' ? '-' : '+') + sqrtT(String(fB)) + '=' + sA + (z.kind === 'diff' ? '-' : '+') + sB + '=' + lhs) + (Math.abs(lhs - c) < 1e-9 ? ' ✓' : ' ' + t('\\ne ' + c) + ': extraneous') + '.'; };
    steps += chk(z.x0) + (z.x1 != null ? '<br>' + chk(z.x1) : '') + '<br>' + (z.roots.length === 2 ? 'Both roots check: ' : 'The root is ') + rootsTex(z.roots) + '.';
    void lo;
    var wr2 = [];
    if (z.kind === 'diff' && z.m !== z.n) { var xs = ex.norm(c * c - z.a + z.b, z.m - z.n); if (!has(z.roots, xs[0] / xs[1]) && !(z.x1 != null && Math.abs(z.x1 - xs[0] / xs[1]) < 1e-9)) wr2.push({ vals: [xs], code: cp + 'sq-mid', hint: t('(\\sqrt{A}-\\sqrt{B})^{2}') + ' is not ' + t('A-B') + ': isolate one radical first, then square; ' + t('(' + c + '+\\sqrt{B})^{2}') + ' has a middle term.' }); }
    return rootsPart(cp, 'Solve and verify: ' + t(eq) + '.', z.roots, { wrongs: wr2, extr: z.x1 != null && !z.x1ok ? [z.x1] : [], bothValid: z.roots.length === 2, extrHint: z.x1 != null && !z.x1ok ? 'Check ' + t('x=' + z.x1) + ' in the original equation: it does not check (or breaks a restriction), so it is extraneous.' : null }, steps,
      ['Isolate one radical and square both sides. The middle term of ' + t('(a+\\sqrt{B})^{2}') + ' is the radical that remains.', 'Isolate that radical and square again. Solve, then check every root in the original equation.'], 'two radicals: squaring twice');
  };

  /* a radical equation from words: a number and its square root, or a rectangle's diagonal (L7 Ex 8, #10–11, EP07 B3–B4) */
  B.radWord = function (r, cp) {
    var kind = r.pick(['num', 'num', 'diag']), p;
    if (kind === 'num') {
      var dec = r.chance(0.5), s = pickWhere(function () { return { k: r.int(1, 5), u1: r.int(3, 9) }; }, function (z) { var u2 = dec ? z.k - z.u1 : -z.k - z.u1; return u2 < 0 && !(dec && z.k === 1 && z.u1 === 6) && !(!dec && z.k === 2 && z.u1 === 4) && !(dec && z.k === 3 && z.u1 === 5); });
      var u2 = dec ? s.k - s.u1 : -s.k - s.u1, N = -s.u1 * u2, x = s.u1 * s.u1, ktxt = s.k === 1 ? 'its square root' : (s.k === 2 ? 'twice' : s.k === 3 ? 'three times' : s.k === 4 ? 'four times' : 'five times') + ' its square root';
      var eq = 'x' + (dec ? '-' : '+') + coefT(s.k) + '\\sqrt{x}=' + N;
      p = KP.number('A positive number ' + (dec ? 'decreased' : 'increased') + ' by ' + ktxt + ' is ' + t(N) + '. Write a radical equation and solve it to determine the number.', x,
        function (v) { if (v === s.u1) return { code: cp + 'gave-u', hint: 'That is the square root of the number. Square it.' }; if (v === u2 * u2) return { code: cp + 'extr', hint: 'Check it in the equation: ' + t(u2 * u2 + (dec ? '-' : '+') + coefT(s.k) + '\\sqrt{' + u2 * u2 + '}\\ne ' + N) + '. It is extraneous.' }; return null; },
        t(eq) + '. Let ' + t('u=\\sqrt{x}\\ge 0') + ': ' + t('u^{2}' + (dec ? '-' : '+') + coefT(s.k) + 'u-' + N + '=(u-' + s.u1 + ')(u' + sg(-u2) + ')=0') + ', so ' + t('u=' + s.u1) + ' (reject ' + t('u=' + u2) + ').<br>' + t('x=' + s.u1 + '^{2}=' + x) + '. Check: ' + t(x + (dec ? '-' : '+') + coefT(s.k) + '(' + s.u1 + ')=' + N) + ' ✓.',
        ['Let the number be ' + t('x') + ': its square root is ' + t('\\sqrt{x}') + '. Write the equation.', 'Isolate the radical and square, or let ' + t('u=\\sqrt{x}') + '. Check every root.'], 'radical equation from words');
      p.bad = [String(s.u1), String(u2 * u2)];
    } else {
      var tr = r.pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [20, 21, 29], [7, 24, 25]]), g = r.int(1, tr[2] > 20 ? 1 : 3);
      var w = tr[0] * g, L = tr[1] * g, d = tr[2] * g, a = L - w, b = d - w, other = -(2 * a - 2 * b) - w;
      p = KP.number('A rectangle is ' + t('x') + ' cm wide. Its length is ' + t(a) + ' cm more than its width, and its diagonal is ' + t(b) + ' cm more than its width. Write a radical equation for the diagonal and solve it to determine the width.', w,
        function (v) { if (v === other) return { code: cp + 'neg-root', hint: 'That root satisfies the equation, but a width cannot be negative: it is inadmissible.' }; if (v === L || v === d) return { code: cp + 'gave-width', hint: 'That is another dimension. The question asks for the width ' + t('x') + '.' }; return null; },
        'Pythagoras: ' + t('\\sqrt{x^{2}+(x+' + a + ')^{2}}=x+' + b) + '.<br>Square: ' + t('x^{2}+x^{2}+' + 2 * a + 'x+' + a * a + '=x^{2}+' + 2 * b + 'x+' + b * b) + ', so ' + t(tx(P.add(V('x', 2), M(2 * a - 2 * b, 'x', 1), P.num(a * a - b * b))) + '=0') + ' and ' + t(FX.tex([lin(1, -w), lin(1, -other)]) + '=0') + '.<br>' + t('x=' + w) + ': ' + t('\\sqrt{' + w * w + '+' + L * L + '}=' + d + '=' + w + '+' + b) + ' ✓. ' + t('x=' + other) + ' is inadmissible (a width is positive).<br>The width is ' + t(w) + ' cm (the rectangle is ' + t(w) + ' cm by ' + t(L) + ' cm, diagonal ' + t(d) + ' cm).',
        ['Pythagoras: the diagonal is ' + t('\\sqrt{(\\text{width})^{2}+(\\text{length})^{2}}') + '.', 'Square both sides, solve the quadratic, check, and reject a negative width.'], 'radical equation from a diagram', { after: 'cm' });
      p.bad = [String(other), String(L)];
    }
    return p;
  };

  HW.u4assess = { B: B, rootsPart: rootsPart };

  /* ======================================================================================================
   * The unit test
   * ====================================================================================================== */
  var CP = 'u4t-';
  function mk(fn, o) { return function (r) { return fn(r, CP, o); }; }
  function Pt(id, outcome, level, make) { return { id: id, outcome: outcome, level: level, make: make }; }
  var QUESTIONS = [
    // ---------------- Beginning ----------------
    { num: '1', outcome: 'RF1', lesson: 'L1', stem: 'Factor.', parts: [Pt('1a', 'RF1', 'BEG', mk(B.gcf)), Pt('1b', 'RF1', 'BEG', mk(B.monic))] },
    { num: '2', outcome: 'RF1', lesson: 'L2', stem: 'Factor.', parts: [Pt('2a', 'RF1', 'BEG', mk(B.decomp)), Pt('2b', 'RF1', 'BEG', mk(B.pst))] },
    { num: '3', outcome: 'RF1', lesson: 'L3, L4', stem: 'Factor.', parts: [Pt('3a', 'RF1', 'BEG', mk(B.subQuartic, { mode: 'simple' })), Pt('3b', 'RF1', 'BEG', mk(B.dos))] },
    { num: '4', outcome: 'RF1', lesson: 'L4', stem: 'Factoring.', parts: [Pt('4', 'RF1', 'BEG', mk(B.nfMC))] },
    { num: '5', outcome: 'RF5', lesson: 'L5', stem: 'Solve.', parts: [Pt('5a', 'RF5', 'BEG', mk(B.zp)), Pt('5b', 'RF5', 'BEG', mk(B.solveSimple))] },
    { num: '6', outcome: 'RF5', lesson: 'L5', stem: 'An equation from its roots.', parts: [Pt('6', 'RF5', 'BEG', mk(B.eqFromRoots, { mode: 'int' }))] },
    { num: '7', outcome: 'AN3', lesson: 'L6', stem: 'Restrictions on the variable.', parts: [Pt('7a', 'AN3', 'BEG', mk(B.restr, { mode: 'one' })), Pt('7b', 'AN3', 'BEG', mk(B.restr, { mode: 'two' }))] },
    { num: '8', outcome: 'AN3', lesson: 'L6', stem: 'Radical equations.', parts: [Pt('8a', 'AN3', 'BEG', mk(B.radSolve1, { basic: true })), Pt('8b', 'AN3', 'BEG', mk(B.radSolve1))] },
    // ---------------- Progressing ----------------
    { num: '9', outcome: 'RF1', lesson: 'L1, L2', stem: 'Factor fully.', parts: [Pt('9a', 'RF1', 'PRG', mk(B.monic, { mode: 'full' })), Pt('9b', 'RF1', 'PRG', mk(B.decomp, { mode: 'full' })), Pt('9c', 'RF1', 'PRG', mk(B.ratcoef))] },
    { num: '10', outcome: 'RF1', lesson: 'L3', stem: 'Factoring by substitution.', parts: [Pt('10a', 'RF1', 'PRG', mk(B.subQuartic, { mode: 'full' })), Pt('10b', 'RF1', 'PRG', mk(B.subBin, { mode: 'gen' }))] },
    { num: '11', outcome: 'RF1', lesson: 'L1, L4', stem: 'Factor fully.', parts: [Pt('11a', 'RF1', 'PRG', mk(B.grouping, { dos: 0.4 })), Pt('11b', 'RF1', 'PRG', function (r) { return r.chance(0.5) ? B.dosBin(r, CP, { mode: 'simple' }) : B.dos(r, CP, { mode: 'quartic' }); })] },
    { num: '12', outcome: 'RF5', lesson: 'L5', stem: 'Solve by factoring.', parts: [Pt('12a', 'RF5', 'PRG', mk(B.solveStd, { mode: 'rearr' })), Pt('12b', 'RF5', 'PRG', mk(B.solveStd, { mode: 'expand' }))] },
    { num: '13', outcome: 'RF5', lesson: 'L5', stem: 'An equation from its roots.', parts: [Pt('13', 'RF5', 'PRG', mk(B.eqFromRoots, { mode: 'frac' }))] },
    { num: '14', outcome: 'AN3', lesson: 'L6', stem: 'Radical equations. Identify any extraneous root.', parts: [Pt('14a', 'AN3', 'PRG', mk(B.radBoth)), Pt('14b', 'AN3', 'PRG', mk(B.radSolve1, { none: 0.5 }))] },
    { num: '15', outcome: 'AN3', lesson: 'L7', stem: 'Radical equations that lead to quadratics.', parts: [Pt('15a', 'AN3', 'PRG', mk(B.restr, { mode: 'eq' })), Pt('15b', 'AN3', 'PRG', mk(B.radQuad, { mode: 'basic' }))] },
    // ---------------- Mastery ----------------
    { num: '16', outcome: 'RF1', lesson: 'L3', stem: 'Factoring by substitution.', parts: [Pt('16', 'RF1', 'MAS', function (r) { return r.chance(0.55) ? B.subTwo(r, CP) : B.subBin(r, CP, { mode: 'common' }); })] },
    { num: '17', outcome: 'RF1', lesson: 'L4', stem: 'A difference of squares.', parts: [Pt('17', 'RF1', 'MAS', mk(B.dosBin, { mode: 'two' }))] },
    { num: '18', outcome: 'RF1', lesson: 'L1, L2', stem: 'When does a trinomial factor?', parts: [Pt('18', 'RF1', 'MAS', function (r) { return r.chance(0.5) ? B.allB(r, CP, { kind: r.pick(['b', 'neg']) }) : B.allK(r, CP); })] },
    { num: '19', outcome: 'RF5', lesson: 'L5', stem: 'A problem that leads to a quadratic equation.', parts: [Pt('19', 'RF5', 'MAS', mk(B.wordFrame))] },
    { num: '20', outcome: 'RF5', lesson: 'L5', shared: function (r) { return B.rootKShared(r); }, stem: function (s) { return B.rootKStem(s); },
      parts: [Pt('20a', 'RF5', 'MAS', function (r, s) { return B.rootKa(r, CP, s); }), Pt('20b', 'RF5', 'MAS', function (r, s) { return B.rootKb(r, CP, s); })] },
    { num: '21', outcome: 'AN3', lesson: 'L7', stem: 'Two radicals.', parts: [Pt('21', 'AN3', 'MAS', mk(B.radTwice))] },
    { num: '22', outcome: 'AN3', lesson: 'L7', stem: 'A radical equation from a problem.', parts: [Pt('22', 'AN3', 'MAS', mk(B.radWord))] }
  ];

  HW.defineTest({
    id: 'u4test', unit: 4, title: 'Unit 4 Test', outcome: 'RF1', calc: false,
    blurb: 'The Unit 4 outcomes-based test on RF1 (factoring: common factors, grouping, trinomials, perfect squares, substitution, differences of squares), RF5 (solving quadratic equations by factoring) and AN3 (radical equations, restrictions and extraneous roots) — in Beginning, Progressing and Mastery boxes. No calculator.',
    // Short version (~half the time): decomposition and a perfect square, the zero product property, two radical equations at
    // Beginning; substitution, solving after rearranging / expanding, a radical equation that leads to a quadratic at
    // Progressing; a difference of squares of binomials, k and the other root, squaring twice at Mastery.
    short: ['2', '5', '8', '10', '12', '15', '17', '20', '21'],
    questions: QUESTIONS
  });
})(window);
