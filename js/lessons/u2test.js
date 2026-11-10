/* Math 20-1 · Unit 2 Test (AN2) — Radical Expressions: evaluating roots, mixed and entire radicals, comparing radicals,
 * restrictions on variables, simplifying with variables, adding/subtracting, multiplying, dividing, and rationalizing
 * monomial and binomial (conjugate) denominators. Written from Ryan's Unit 2 booklet (m201book/unit2: Lessons 1–7, their
 * assignments and extra practice; Lesson 7's assignment and EP07 are the practice tests that set the style and
 * difficulty). There is no older test for this course. One 75-minute class, NO calculator; one outcome (AN2);
 * 20 questions / 35 parts: Beginning 7 questions / 14 parts, Progressing 6 / 12, Mastery 7 / 9.
 *
 * How each box is pitched:
 *   Beginning  — each lesson's core skill as first taught: evaluate a cube / fourth / fifth root (a negative or a fraction)
 *                and pick the root that is not real (L1 Ex 1, #1, MC: recognition); √n and ∛n to simplest mixed form
 *                (L1 Ex 4, #5); mixed → entire, a square root and a cube root with a negative coefficient (L1 Ex 7, #9);
 *                the restriction of √(ax + b), of an odd root (x ∈ ℝ) or of √(−kx) (L2 Ex 1, #1); like radicals, and like
 *                radicals with a different index in the mix (L3 Ex 1, #1); (a√p)(b√q) and (c√m)² / (c∛m)³ (L4 Ex 1–2, #1–2);
 *                a quotient of radicals and a/(m√b) (L5 Ex 1, Ex 4, #1, #4).
 *   Progressing — the typical assignment question: order five radicals (square or cube roots, with a whole number or
 *                negatives) without a calculator (L1 Ex 8, #10–12, L7 #6); the restriction of √(c − ax) (sign reversal),
 *                a variable radical in simplest form and a mixed radical with a variable as an entire radical (L2 #1, #6,
 *                #8); simplify-then-combine with three terms, and with a variable (L3 Ex 2, #3, #7); FOIL with one or two
 *                radicals and the square of a binomial (L4 Ex 3–4, #7–8); a cube-root denominator and dividing each term of
 *                a numerator (L5 Ex 3, Ex 5, #3, #10); k/(a ± √b) and a binomial over a binomial (L6 Ex 2–3, #2, #4).
 *   Mastery    — the hardest assignment / extra-practice items: a rectangle's perimeter as an entire radical (L7 #16); where
 *                √(x − a) + √(b − x) (or with one radical in a denominator) is defined (EP02 C1, L2 Ex 2d); solve
 *                x√a ∓ √b = √c (L5 #16, EP05 B5, L3 #11); a rectangle from its area and a binomial width: the length
 *                (conjugate) and the perimeter (L6 Ex 5b, #11, EP07 C3); a sum of two conjugate fractions that is rational
 *                (L6 #19, EP07 C4a); an arithmetic sequence with radical terms: d and a far term (L3 Ex 10b, #12b);
 *                the value of x² + px + c at x = a ± √b (L4 C4, L7 #15a).
 * Coverage: L1 Q1, Q2, Q3, Q8, Q14 · L2 Q4, Q9, Q15 · L3 Q5, Q10, Q14, Q16, Q19 · L4 Q6, Q11, Q20 · L5 Q7, Q12, Q16 ·
 *           L6 Q13, Q17, Q18 · L7 (review) numbers and styles throughout (Q8, Q14, Q17, Q20).
 * Short version (def.short): Q2, Q4, Q6, Q7 (Beginning, 8 parts), Q8, Q10, Q11, Q13 (Progressing, 7), Q16, Q17
 * (Mastery, 3) — about half the working time; every box keeps 3+ parts.
 * Not used: numerical-response boxes ("the value of a + b is") — the online version asks for the expression itself; the
 * approximation items (√3 ≈ 1.732, L1 Ex 6) and "explain" items — their checkable step is asked instead (the corrected
 * answer, the conjugate product).
 * Answers are typed (one MC, Q1b). Radical answers: exact value AND simplest form (the Unit 2 kit below: simplest radicals,
 * no radical in a denominator, no fraction under a radical, like terms combined, reduced, positive denominator); any
 * equivalent simplest form is accepted. Variable radicals: K.varRadical (checked by evaluation at positive values + form).
 * Restrictions: K.set (inequality, set notation, interval, x ∈ ℝ, "all real numbers" or "no restriction"). Every part has
 * `bad` answers with u2t- codes; partial credit: one recognized mistake keeps 2/3 or 1/3 (decisions below), a right value
 * in the wrong form is a format nudge. */
(function (root) {
  'use strict';
  var HW = root.HW, ex = HW.ex, F = HW.fmt, K = HW.kit;

  /* ================= Unit 2 radical kit =================
   * The same block is in js/lessons/u2test.js and js/exits/u2.js; each file builds its own copy (local variable RK),
   * so neither file depends on the other or on anything a practice file puts on HW.
   *   RK.term(c, n, m)          exact c·ⁿ√m, already in simplest form (a sum is { 'n:m': [p, q] }, '1:1' = the rational part)
   *   RK.add/sub/mul/scale/neg  exact arithmetic on sums (same index only); RK.val(S) its value; RK.tex(S, opt) its LaTeX
   *                             (one fraction over a positive common denominator; opt.split: a fraction per term)
   *   RK.check(S, opt)          checker: right value (exact, compared numerically) AND simplest form: every radical
   *                             simplest, no radical in a denominator, no fraction under a radical, like terms combined,
   *                             one coefficient per term, fraction reduced, positive denominator, brackets multiplied out.
   *                             opt.dl = [[wrong S or number, code, hint]] diagnoses known wrong values.
   *   RK.part(prompt, S, o, sol, hints, text)   a typed part on the radical keypad, with bad = the dl answers
   *   RK.res(prompt, tex, wrongs, sol, hints, text)   a restriction (inequality / ℝ) on the set keypad (K.set, js/relfn.js) */
  function buildKit() {
    var ex = HW.ex, F = HW.fmt, K = HW.kit, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
    function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var c = a % b; a = b; b = c; } return a; }
    function lcm(a, b) { return a / gcd(a, b) * b; }
    function nq(p, q) { return ex.norm(p, q == null ? 1 : q); }
    function Rq(c) { return typeof c === 'number' ? [c, 1] : c; }
    function qa(x, y) { return nq(x[0] * y[1] + y[0] * x[1], x[1] * y[1]); }
    function qm(x, y) { return nq(x[0] * y[0], x[1] * y[1]); }
    function isPow(m, n) { var r = Math.round(Math.pow(m, 1 / n)); return Math.pow(r, n) === m; }
    function split(m, n) { var s = m < 0 ? -1 : 1, a = Math.abs(m), k = ex.nthFactor(a, n); return [s * k, a / Math.pow(k, n)]; }
    function clean(o) { Object.keys(o).forEach(function (k) { if (!o[k] || o[k][0] === 0) delete o[k]; }); return o; }
    function term(c, n, m) {
      c = Rq(c); c = nq(c[0], c[1]); var o = {};
      if (m === 0) return o;
      if (n == null || n === 1 || m === 1) { o['1:1'] = c; return clean(o); }
      if (m < 0 && n % 2 === 0) throw new Error('u2 kit: even root of a negative');
      var sp = split(m, n); o[sp[1] === 1 ? '1:1' : n + ':' + sp[1]] = qm(c, [sp[0], 1]); return clean(o);
    }
    function add() { var o = {}; for (var i = 0; i < arguments.length; i++) { var A = arguments[i]; Object.keys(A).forEach(function (k) { o[k] = o[k] ? qa(o[k], A[k]) : A[k]; }); } return clean(o); }
    function scale(A, c) { c = Rq(c); var o = {}; Object.keys(A).forEach(function (k) { o[k] = qm(A[k], c); }); return clean(o); }
    function neg(A) { return scale(A, -1); }
    function sub(A, B) { return add(A, neg(B)); }
    function kp(k) { var p = k.split(':'); return [Number(p[0]), Number(p[1])]; }
    function mul() {
      var out = { '1:1': [1, 1] };
      for (var i = 0; i < arguments.length; i++) {
        var A = out, B = arguments[i], o = {};
        Object.keys(A).forEach(function (ka) { Object.keys(B).forEach(function (kb) {
          var a = kp(ka), b = kp(kb), c = qm(A[ka], B[kb]), tm;
          if (a[0] === 1) tm = term(c, b[0], b[1]); else if (b[0] === 1) tm = term(c, a[0], a[1]);
          else if (a[0] === b[0]) tm = term(c, a[0], a[1] * b[1]); else throw new Error('u2 kit: different indices');
          o = add(o, tm);
        }); });
        out = o;
      }
      return out;
    }
    function val(A) { return Object.keys(A).reduce(function (s, k) { var a = kp(k), c = A[k]; return s + c[0] / c[1] * (a[0] === 1 ? 1 : Math.pow(a[1], 1 / a[0])); }, 0); }
    function isRat(A) { var ks = Object.keys(A); return !ks.length || (ks.length === 1 && ks[0] === '1:1'); }
    function same(A, B) { return !Object.keys(sub(A, B)).length; }
    function order(A, opt) {
      var ks = Object.keys(A);
      ks.sort(function (x, y) { var a = kp(x), b = kp(y); if (opt && opt.ratLast) { if (a[0] === 1) return 1; if (b[0] === 1) return -1; } return a[0] - b[0] || a[1] - b[1]; });
      if (opt && opt.first) { var i = ks.indexOf(opt.first); if (i > 0) { ks.splice(i, 1); ks.unshift(opt.first); } }
      else if (ks.length > 1 && A[ks[0]][0] < 0) { var j = ks.findIndex(function (x) { return A[x][0] > 0; }); if (j > 0) ks.unshift(ks.splice(j, 1)[0]); } // start with a positive term
      return ks;
    }
    function radT(n, m) { return ex.texRoot(n, F(m)); }
    /* one term with an integer or fractional coefficient c (sign handled by the caller); lead = first term */
    function piece(c, key) {
      var a = kp(key), p = Math.abs(c[0]), q = c[1], rad = a[0] === 1 ? '' : radT(a[0], a[1]);
      if (!rad) return q === 1 ? F(p) : '\\frac{' + F(p) + '}{' + F(q) + '}';
      if (q === 1) return (p === 1 ? '' : F(p)) + rad;
      return '\\frac{' + (p === 1 ? '' : F(p)) + rad + '}{' + F(q) + '}';
    }
    function sumTex(list) {
      return list.map(function (x, i) { var neg0 = x[0][0] < 0, pc = piece(x[0], x[1]); return i === 0 ? (neg0 ? '-' : '') + pc : (neg0 ? '-' : '+') + pc; }).join('');
    }
    function tex(A, opt) {
      opt = opt || {};
      var ks = order(A, opt); if (!ks.length) return '0';
      var D = ks.reduce(function (d, k) { return lcm(d, A[k][1]); }, 1);
      if (D === 1 || opt.split || ks.length === 1) return sumTex(ks.map(function (k) { return [A[k], k]; }));
      var N = ks.map(function (k) { return [A[k][0] * (D / A[k][1]), k]; }), allNeg = N.every(function (x) { return x[0] < 0; });
      if (allNeg) N = N.map(function (x) { return [-x[0], x[1]]; });
      return (allNeg ? '-' : '') + '\\frac{' + sumTex(N.map(function (x) { return [[x[0], 1], x[1]]; })) + '}{' + F(D) + '}';
    }

    /* ---------- reading a typed answer as a sum of terms ---------- */
    function hasRoot(a) { var f = false; (function w(x) { if (!x || typeof x !== 'object' || f) return; if (x.t === 'root') f = true; ['a', 'b', 'n'].forEach(function (k) { if (x[k] && typeof x[k] === 'object') w(x[k]); }); })(a); return f; }
    function strip(a) { var s = 1; while (a && (a.t === 'paren' || a.t === 'neg')) { if (a.t === 'neg') s = -s; a = a.a; } return { s: s, a: a }; }
    function terms(a, sign, out) {
      if (a.t === 'paren') return terms(a.a, sign, out);
      if (a.t === 'neg') return terms(a.a, -sign, out);
      if (a.t === 'add') { terms(a.a, sign, out); return terms(a.b, sign, out); }
      if (a.t === 'sub') { terms(a.a, sign, out); return terms(a.b, -sign, out); }
      out.push({ s: sign, a: a }); return out;
    }
    var H = {
      decimal: 'That’s a decimal. Give the <b>exact</b> answer with radicals — no calculator in this unit.',
      expand: 'Right value — now multiply out the brackets and simplify, so the answer is a sum of simplified terms.',
      oneroot: 'Right value, but one term still has two radicals multiplied together. Multiply them into one radical and simplify it.',
      fracunder: 'Right value, but there is a fraction under a radical. Write it as a radical over a radical, then rationalize the denominator.',
      simplify: 'Right value — now simplify it fully: one number in front of each radical, powers worked out, and one fraction at most.',
      radden: 'Right value, but there is still a radical in the denominator. Rationalize it: multiply the numerator and the denominator by the radical (or by the conjugate of a two-term denominator).',
      negden: 'Right value — now keep the denominator positive: move the negative sign to the front or into the numerator.'
    };
    function termInfo(node, s0) {
      var fz = ex.factors(node), sign = fz.sign * s0, cN = [1, 1], cD = [1, 1], nN = 0, nD = 0, root = null;
      for (var i = 0; i < fz.num.length; i++) {
        var g = fz.num[i];
        if (g.t === 'add' || g.t === 'sub') return { res: form('u2r-expand', H.expand) };
        if (g.t === 'root') {
          if (root) return { res: form('u2r-oneroot', H.oneroot) };
          var n = ex.rat(g.n), r = ex.rat(g.a);
          if (!n || n[1] !== 1 || n[0] < 2) return { res: form('u2r-simplify', H.simplify) };
          if (!r) return { res: form(hasRoot(g.a) ? 'u2r-simplify' : 'u2r-simplify', H.simplify) };
          if (r[1] !== 1) return { res: form('u2r-fracunder', H.fracunder) };
          var m = r[0]; if (m < 0) { m = -m; sign = -sign; }
          if (m <= 1 || isPow(m, n[0])) return { res: form('u2r-evaluate', 'Right value — but ' + t(radT(n[0], m)) + ' is a whole number: ' + t(radT(n[0], m) + '=' + Math.round(Math.pow(m, 1 / n[0]))) + '. Work it out.') };
          if (!ex.simplest(m, n[0])) { var f = ex.nthFactor(m, n[0]); return { res: form('not-simplest', 'Right value, but not in simplest form yet: ' + t(F(m)) + ' still has the factor ' + t(F(Math.pow(f, n[0])) + '=' + f + '^{' + n[0] + '}') + '. Take ' + t(f) + ' out of the radical.') }; }
          root = { n: n[0], m: m }; continue;
        }
        if (g.t === 'pow') return { res: form('u2r-simplify', H.simplify) };
        var q = ex.rat(g); if (!q) return { res: form('u2r-simplify', H.simplify) };
        nN++; cN = qm(cN, q);
      }
      for (var j = 0; j < fz.den.length; j++) {
        var d = fz.den[j];
        if (hasRoot(d)) return { res: form('u2r-radden', H.radden) };
        if (d.t === 'pow') return { res: form('u2r-simplify', H.simplify) };
        var q2 = ex.rat(d); if (!q2) return { res: form('u2r-simplify', H.simplify) };
        nD++; cD = qm(cD, q2);
      }
      if (nN > 1 || nD > 1 || cN[1] !== 1 || cD[1] !== 1) return { res: form('u2r-simplify', H.simplify) };
      if (cD[0] < 0) return { res: form('u2r-negden', H.negden) };
      if (nD && gcd(cN[0], cD[0]) > 1) return { res: form('u2r-reduce', 'Right value — now reduce the fraction: ' + t(F(Math.abs(cN[0]))) + ' and ' + t(F(cD[0])) + ' share the factor ' + t(gcd(cN[0], cD[0])) + '.') };
      return { key: root ? root.n + ':' + root.m : '1:1', c: nq(sign * cN[0], cD[0]), num: sign * cN[0], den: cD[0], root: root };
    }
    function likeCheck(list) {
      var seen = {};
      for (var i = 0; i < list.length; i++) {
        var k = list[i].key;
        if (seen[k]) { var a = kp(k); return form('u2r-like', 'Right value — now combine the like terms: ' + (a[0] === 1 ? 'two of your terms are both rational numbers' : 'two of your terms both have ' + t(radT(a[0], a[1]))) + '. Add their coefficients.'); }
        seen[k] = 1;
      }
      return null;
    }
    /* form of an answer whose value is already right: null = simplest form */
    function formOf(ast) {
      var sh = ex.shape(ast);
      if (sh.decimals) return form('decimal', H.decimal);
      var top = strip(ast).a;
      if (top.t === 'div' && (strip(top.a).a.t === 'add' || strip(top.a).a.t === 'sub')) {
        if (hasRoot(top.b)) return form('u2r-radden', H.radden);
        var D = ex.rat(top.b); if (!D || D[1] !== 1) return form('u2r-simplify', H.simplify);
        if (D[0] < 0) return form('u2r-negden', H.negden);
        var ts = terms(top.a, 1, []), info = [];
        for (var i = 0; i < ts.length; i++) { var ti = termInfo(ts[i].a, ts[i].s); if (ti.res) return ti.res; if (ti.den !== 1) return form('u2r-simplify', H.simplify); info.push(ti); }
        var lk = likeCheck(info); if (lk) return lk;
        var g = info.reduce(function (gg, x) { return gcd(gg, x.num); }, D[0]);
        if (g > 1) return form('u2r-reduce', 'Right value — now reduce: every term of the numerator and the denominator ' + t(F(D[0])) + ' share the factor ' + t(g) + '. Divide each of them by ' + t(g) + '.');
        return null;
      }
      var ts2 = terms(ast, 1, []), info2 = [];
      for (var k = 0; k < ts2.length; k++) { var t2 = termInfo(ts2[k].a, ts2[k].s); if (t2.res) return t2.res; info2.push(t2); }
      return likeCheck(info2);
    }
    function valOf(x) { return typeof x === 'number' ? x : val(x); }
    function check(S, opt) {
      opt = opt || {}; var V = val(S);
      var dl = (opt.dl || []).filter(function (d) { return d && !ex.eq(valOf(d[0]), V, 1e-9); });
      return function (resp) {
        var a = K.read(resp); if (a.res) return a.res;
        if (Object.keys(ex.shape(a.ast).vars).length) return wrong('var', 'There is no variable in this question — your answer should be a number (with radicals).');
        if (!isFinite(a.val)) return wrong('value', null);
        if (ex.eq(a.val, V, 1e-9) || Math.abs(a.val - V) < 1e-12) { var f = formOf(a.ast); return f || ok(); }
        if (ex.shape(a.ast).decimals && Math.abs(a.val - V) < 0.01 * Math.max(1, Math.abs(V))) return form('decimal', H.decimal);
        for (var i = 0; i < dl.length; i++) if (ex.eq(a.val, valOf(dl[i][0]), 1e-9)) return wrong(dl[i][1], dl[i][2]);
        if (V !== 0 && ex.eq(a.val, -V, 1e-9)) return wrong('sign', 'Check the sign of your answer.');
        return wrong('value', null);
      };
    }
    function texOf(x) { return typeof x === 'number' ? String(x) : tex(x); }
    function part(prompt, S, o, sol, hints, text) {
      o = o || {};
      var key = tex(S), p = { prompt: prompt, input: { type: 'math', keys: o.keys || 'radical', before: o.before }, check: check(S, o), key: key, answer: t((o.ansPre || '') + key), solution: sol, hints: hints || [], text: text };
      var V = val(S);
      p.bad = (o.dl || []).filter(function (d) { return d && !ex.eq(valOf(d[0]), V, 1e-9); }).map(function (d) { return texOf(d[0]); }).filter(function (b, i, arr) { return arr.indexOf(b) === i; });
      var alt = [tex(S, { split: true }), tex(S, { ratLast: true })].filter(function (x) { return x !== key; });
      p.good = alt.filter(function (b, i, arr) { return arr.indexOf(b) === i; });
      return p;
    }
    /* a restriction: K.set (inequality, set notation, interval, or "x ∈ ℝ" / "all real numbers"); "no restriction" means ℝ */
    function res(prompt, texT, wrongs, sol, hints, text, v) {
      v = v || 'x';
      var p = K.P.set(prompt, texT, { v: v, wrong: wrongs }, sol, hints, text);
      var raw = p.check;
      p.check = function (resp) {
        var s = String(resp == null ? '' : resp), plain = s.replace(/\\text\{([^}]*)\}/g, '$1').replace(/\\[ ,;:!]|~/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
        if (/^(no\s*restrictions?|none|any\s*real\s*numbers?|norestrictions?)$/.test(plain)) s = '\\mathbb{R}';
        return raw(s);
      };
      p.bad = (wrongs || []).map(function (w) { return w.is; });
      return p;
    }
    /* LaTeX helpers for questions */
    function coefT(c) { c = Rq(c); if (c[1] === 1) return c[0] === 1 ? '' : c[0] === -1 ? '-' : F(c[0]); return (c[0] < 0 ? '-' : '') + '\\frac{' + F(Math.abs(c[0])) + '}{' + F(c[1]) + '}'; }
    function mixT(c, n, m) { return coefT(c) + radT(n, m); }
    function sgn(x, first) { return x < 0 ? '-' : first ? '' : '+'; }
    /* a signed coefficient for a written term: first term "3", "-3"; later "+3", "-3"; 1 is left out before a radical */
    function cT(c, first, rad) { var a = Math.abs(c); return sgn(c, first) + (rad && a === 1 ? '' : F(a)) + (rad || ''); }
    var SQF = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15, 17, 19, 21, 22, 23, 26, 29, 30];
    return { gcd: gcd, lcm: lcm, nq: nq, term: term, add: add, sub: sub, mul: mul, scale: scale, neg: neg, val: val, tex: tex, isRat: isRat, same: same,
      check: check, part: part, res: res, formOf: formOf, radT: radT, coefT: coefT, mixT: mixT, cT: cT, isPow: isPow, split: split, SQF: SQF, texOf: texOf };
  }
  var RK = buildKit();

  var t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, P = K.P;

  HW.addCodes({
    'u2r-expand': 'Brackets left in the answer', 'u2r-oneroot': 'Two radicals left multiplied in one term', 'u2r-fracunder': 'Fraction left under a radical',
    'u2r-evaluate': 'A root of a perfect power not worked out', 'u2r-simplify': 'Not fully simplified', 'u2r-radden': 'Radical left in the denominator',
    'u2r-negden': 'Negative denominator', 'u2r-reduce': 'Fraction not reduced', 'u2r-like': 'Like terms not combined',
    'u2t-ev-sign': 'Root of a negative: lost the sign', 'u2t-ev-div': 'Divided by the index instead of taking the root', 'u2t-root-sq': 'Took out a perfect square under a cube root',
    'u2t-ent-square': 'Squared the coefficient for a cube root', 'u2t-ent-evenneg': 'Put a negative inside an even root',
    'u2t-res-sign': 'Restriction: sign slip moving the constant', 'u2t-res-dir': 'Restriction: inequality sign the wrong way', 'u2t-res-strict': 'Restriction: used > instead of ≥',
    'u2t-res-odd': 'Gave a restriction for an odd index', 'u2t-res-noflip': 'Restriction: did not reverse the sign dividing by a negative', 'u2t-def-one': 'Used only one of the two radicals',
    'u2t-def-den': 'Allowed a zero denominator', 'u2t-like-index': 'Combined radicals with different indices', 'u2t-like-sign': 'Sign slip combining like radicals', 'u2t-add-rad': 'Added the radicands',
    'u2t-add-coef': 'Multiplied by the perfect square, not its root', 'u2t-mul-addcoef': 'Added the coefficients instead of multiplying', 'u2t-mul-addrad': 'Added the radicands instead of multiplying',
    'u2t-pow-coef': 'Did not square/cube the coefficient', 'u2t-pow-rad': 'Did not square/cube the radical', 'u2t-div-coef': 'Divided the radicands but not the coefficients',
    'u2t-rat-top': 'Rationalizing: numerator not multiplied', 'u2t-rat-den': 'Rationalizing: multiplied by the whole denominator', 'u2t-cube-sq': 'Cube-root denominator: multiplier does not make a perfect cube',
    'u2t-one-term': 'Divided only one term of the numerator', 'u2t-foil-sq': 'Treated √m·√m as 1 (not m)', 'u2t-foil-mid': 'Left out the middle (outer and inner) terms',
    'u2t-sq-mid': 'Squared each term: no middle term', 'u2t-sq-half': 'Middle term not doubled', 'u2t-var-coef': 'Left the perfect square outside instead of its root',
    'u2t-ent-nosq': 'Entire radical: coefficient not raised to the index', 'u2t-ent-exp': 'Entire radical: variable power not raised to the index',
    'u2t-conj-sign': 'Multiplied by the denominator itself, not its conjugate', 'u2t-conj-den-add': 'Conjugates: denominator a² + b instead of a² − b',
    'u2t-per-half': 'Perimeter: only one length and one width', 'u2t-per-mixed': 'Perimeter left as a mixed radical', 'u2t-solve-noroot': 'Divided by the radicand instead of the radical',
    'u2t-solve-sign': 'Solving: moved a term without changing its sign', 'u2t-len-noconj': 'Length: divided without rationalizing correctly', 'u2t-len-width': 'Gave the width plus the length for the perimeter',
    'u2t-sum-cancel': 'Sum of the fractions: middle terms treated as cancelling in the numerators', 'u2t-seq-sign': 'Common difference: subtracted in the wrong order', 'u2t-seq-n': 'General term: used n instead of n − 1',
    'u2t-seq-d': 'Common difference: subtracted only the radical part', 'u2t-sub-sq': 'Substitution: x² without the middle term'
  });
  HW.addPartial({
    'u2t-ev-sign': 's', 'u2t-ev-div': 'n', 'u2t-root-sq': 'b', 'u2t-ent-square': 'b', 'u2t-ent-evenneg': 's', 'u2t-res-sign': 's', 'u2t-res-dir': 'b', 'u2t-res-strict': 's', 'u2t-res-odd': 'n',
    'u2t-res-noflip': 'b', 'u2t-def-one': 'b', 'u2t-def-den': 's', 'u2t-like-index': 'n', 'u2t-like-sign': 's', 'u2t-add-rad': 'n', 'u2t-add-coef': 'b', 'u2t-mul-addcoef': 'n', 'u2t-mul-addrad': 'n',
    'u2t-pow-coef': 'b', 'u2t-pow-rad': 'b', 'u2t-div-coef': 's', 'u2t-rat-top': 'b', 'u2t-rat-den': 's', 'u2t-cube-sq': 'b', 'u2t-one-term': 'b', 'u2t-foil-sq': 'b', 'u2t-foil-mid': 'b',
    'u2t-sq-mid': 'n', 'u2t-sq-half': 'b', 'u2t-var-coef': 'b', 'u2t-ent-nosq': 'b', 'u2t-ent-exp': 'b', 'u2t-conj-sign': 'n', 'u2t-conj-den-add': 'b', 'u2t-per-half': 'b', 'u2t-per-mixed': 's',
    'u2t-solve-noroot': 'b', 'u2t-solve-sign': 's', 'u2t-len-noconj': 'b', 'u2t-len-width': 'n', 'u2t-sum-cancel': 'n', 'u2t-seq-sign': 's', 'u2t-seq-n': 's', 'u2t-seq-d': 'b', 'u2t-sub-sq': 'b'
  });

  /* ================= small helpers ================= */
  function range(a, b) { var o = []; for (var i = a; i <= b; i++) o.push(i); return o; }
  function nz(a, b) { return range(a, b).filter(function (x) { return x !== 0; }); }
  function pickWhere(gen, okf) { for (var i = 0; i < 5000; i++) { var o = gen(); if (o != null && okf(o)) return o; } throw new Error('u2 test: no valid numbers'); }
  var radT = RK.radT, mixT = RK.mixT, cT = RK.cT, coefT = RK.coefT, term = RK.term, add = RK.add, mul = RK.mul, sc = RK.scale, rtex = RK.tex, sub = RK.sub;
  function sq(m) { return '\\sqrt{' + (typeof m === 'number' ? F(m) : m) + '}'; }
  function cb(m) { return '\\sqrt[3]{' + (typeof m === 'number' ? F(m) : m) + '}'; }
  function rn(n, m) { return '\\sqrt' + (n === 2 ? '' : '[' + n + ']') + '{' + (typeof m === 'number' ? F(m) : m) + '}'; }
  function pa(s) { return '\\left(' + s + '\\right)'; }
  function rat(p, q) { return ex.texRat(ex.norm(p, q || 1)); }
  function varsT(o) { return Object.keys(o).sort().map(function (v) { return o[v] === 0 ? '' : o[v] === 1 ? v : v + '^{' + o[v] + '}'; }).join(''); }
  function linT(a, b, v) { v = v || 'x'; return (a === 1 ? '' : a === -1 ? '-' : a) + v + (b < 0 ? '-' + Math.abs(b) : '+' + b); }
  var HMIX = ['Find the <b>largest</b> perfect square (or cube) that divides the radicand: ' + t('4,\\ 9,\\ 16,\\ 25,\\ 36,\\ 49,\\ 64,\\ \\dots') + ' or ' + t('8,\\ 27,\\ 64,\\ 125,\\ 216,\\ \\dots'), 'Split the root and take that factor out as its root.'];
  var HCONJ = ['Multiply the numerator and the denominator by the <b>conjugate</b> of the denominator (same two terms, opposite sign between them).', 'The denominator becomes a difference of squares: ' + t('(a+\\sqrt{b})(a-\\sqrt{b})=a^{2}-b') + '.'];
  var HFOIL = ['Multiply each term of the first bracket by each term of the second (FOIL).', t('\\sqrt{a}\\cdot\\sqrt{a}=a') + ' and ' + t('\\sqrt{a}\\cdot\\sqrt{b}=\\sqrt{ab}') + '. Then collect like terms.'];

  /* =====================================================================================================
   * BEGINNING
   * ===================================================================================================== */
  /* Q1 (L1) — evaluate a root exactly; which number is not real */
  function q1a(r) {
    var kind = r.pick(['cneg', 'cfrac', 'four', 'five']), N, A, R, sol, dl = [];
    if (kind === 'cneg') { var k = r.int(4, 10); A = term(-k); R = cb(-k * k * k); sol = t('(-' + k + ')^{3}=-' + F(k * k * k)) + ', so ' + t(R + '=-' + k) + '.'; dl = [[k, 'u2t-ev-sign', 'The cube root of a negative number is negative.'], [-k * k * k / 3, 'u2t-ev-div', 'A cube root is not a third: find the number that, cubed, gives the radicand.']]; }
    else if (kind === 'cfrac') { var pq = pickWhere(function () { return [r.int(1, 5), r.int(2, 7)]; }, function (x) { return x[0] < x[1] && ex.gcd(x[0], x[1]) === 1 && !(x[0] === 2 && x[1] === 3) && !(x[0] === 4 && x[1] === 5) && !(x[0] === 1 && x[1] === 3); }), sg = r.chance(0.5) ? -1 : 1;
      A = term([sg * pq[0], pq[1]]); R = '\\sqrt[3]{' + (sg < 0 ? '-' : '') + '\\dfrac{' + Math.pow(pq[0], 3) + '}{' + Math.pow(pq[1], 3) + '}}';
      sol = t(pa(rat(sg * pq[0], pq[1])) + '^{3}=' + (sg < 0 ? '-' : '') + '\\frac{' + Math.pow(pq[0], 3) + '}{' + Math.pow(pq[1], 3) + '}') + ', so the cube root is ' + t(rat(sg * pq[0], pq[1])) + '.'; if (sg < 0) dl = [[term([pq[0], pq[1]]), 'u2t-ev-sign', 'The cube root of a negative number is negative.']]; }
    else if (kind === 'four') { var k4 = r.int(2, 5); A = term(k4); R = '\\sqrt[4]{' + F(Math.pow(k4, 4)) + '}'; sol = t(k4 + '^{4}=' + F(Math.pow(k4, 4))) + ', so ' + t(R + '=' + k4) + '.'; dl = [[Math.pow(k4, 4) / 4, 'u2t-ev-div', 'A fourth root is not a quarter: find the number that, raised to the fourth power, gives the radicand.'], [k4 * k4, 'u2t-ev-div', 'That is the square root. For a fourth root, find the number whose fourth power is the radicand.']]; }
    else { var k5 = r.int(2, 3); A = term(-k5); R = '\\sqrt[5]{-' + F(Math.pow(k5, 5)) + '}'; sol = t('(-' + k5 + ')^{5}=-' + F(Math.pow(k5, 5))) + ', so ' + t(R + '=-' + k5) + ' (an odd root of a negative number is negative).'; dl = [[k5, 'u2t-ev-sign', 'An odd root of a negative number is negative.']]; }
    return RK.part('Evaluate ' + t(R) + '.', A, { dl: dl }, sol, ['Which number, raised to the power of the index, gives the radicand?', 'An odd root of a negative number is negative.'], 'evaluate a root');
  }
  function q1b(r) {
    var k = r.pick([4, 9, 16, 25, 36, 49, 64, 81]), even = r.pick([2, 4]), c3 = r.int(2, 6), c4 = r.pick([9, 16, 25, 36, 49]), c5 = r.int(2, 4);
    var badTex = even === 2 ? sq(-k) : '\\sqrt[4]{-' + (even === 4 ? [16, 81][r.int(0, 1)] : k) + '}';
    var opts = [{ html: t(badTex), right: true }, { html: t(cb(-c3 * c3 * c3)), why: 'Every real number has a cube root: ' + t(cb(-c3 * c3 * c3) + '=-' + c3) + '.' },
      { html: t('-' + sq(c4)), why: t('-' + sq(c4) + '=-' + Math.round(Math.sqrt(c4))) + ' is a real number: the negative sign is outside the root.' },
      { html: t('\\sqrt[5]{-' + Math.pow(c5, 5) + '}'), why: 'An odd root of a negative number is real: ' + t('\\sqrt[5]{-' + Math.pow(c5, 5) + '}=-' + c5) + '.' }];
    return P.mc(r, 'Which of these is <b>not</b> a real number?', opts, t(badTex) + ': the index is even and the radicand is negative. No real number raised to an even power is negative. (The others are ' + t('-' + c3) + ', ' + t('-' + Math.round(Math.sqrt(c4))) + ' and ' + t('-' + c5) + '.)',
      ['An <b>even</b> root (square root, fourth root, …) of a negative number is not real.', 'An odd root of a negative number is negative, and a negative sign outside a root is fine.'], 'which root is not real');
  }
  /* Q2 (L1) — simplest mixed radical */
  var AVOID1 = [8, 12, 18, 20, 27, 28, 32, 45, 48, 50, 63, 72, 75, 98, 108, 120, 150, 175, 180, 200, 242, 252, 288, 300, 363, 500];
  function q2a(r) {
    var s = pickWhere(function () { return { k: r.int(3, 10), m: r.pick([2, 3, 5, 6, 7, 10, 11, 13, 14, 15]) }; }, function (s) { var N = s.k * s.k * s.m; return N >= 40 && N <= 700 && AVOID1.indexOf(N) < 0; });
    var k = s.k, m = s.m, N = k * k * m;
    var p = P.radical('Write ' + t(sq(N)) + ' as a mixed radical in simplest form.', { k: k, n: 2, m: m }, 'mixed',
      t(sq(N) + '=\\sqrt{' + (k * k) + '}\\cdot\\sqrt{' + m + '}=' + mixT(k, 2, m)) + ' (' + t(F(k * k)) + ' is the largest perfect square that divides ' + t(F(N)) + ').', HMIX, 'square root to a mixed radical');
    p.bad = [F(k * k) + sq(m), F(m) + sq(k * k)];
    return p;
  }
  function q2b(r) {
    var s = pickWhere(function () { return { k: r.int(2, 6), m: r.pick([2, 3, 4, 5, 6, 7, 9, 10]), neg: r.chance(0.5) }; }, function (s) { var N = s.k * s.k * s.k * s.m; return N <= 2200 && [16, 24, 40, 54, 56, 81, 108, 128, 135, 192, 250, 375, 432, 686].indexOf(N) < 0; });
    var k = s.k, m = s.m, N = k * k * k * m, sg = s.neg ? -1 : 1, R = cb((s.neg ? -1 : 1) * N), sqf = ex.nthFactor(N, 2);
    var p = P.radical('Write ' + t(R) + ' as a mixed radical in simplest form.', { k: sg * k, n: 3, m: m }, 'mixed',
      t(R + '=\\sqrt[3]{' + (s.neg ? '-' : '') + (k * k * k) + '}\\cdot\\sqrt[3]{' + m + '}=' + mixT(sg * k, 3, m)) + ' (' + t(F(k * k * k) + '=' + k + '^{3}') + ' is the largest perfect cube that divides ' + t(F(N)) + ').',
      ['For a cube root you need a perfect <b>cube</b> factor: ' + t('8,\\ 27,\\ 64,\\ 125,\\ 216') + '.', t('\\sqrt[3]{-x}=-\\sqrt[3]{x}') + '.'], 'cube root to a mixed radical', { diag: function (v, rr) {
        if (rr && rr.n === 3 && Math.abs(rr.k[0]) > 1 && rr.k[1] === 1 && rr.k[0] * rr.k[0] * rr.m === N && !RK.isPow(rr.k[0] * rr.k[0], 3)) return { code: 'u2t-root-sq', hint: t(F(rr.k[0] * rr.k[0])) + ' is a perfect <b>square</b>; a cube root needs a perfect <b>cube</b> factor.' };
        return null;
      } });
    p.bad = [(sg < 0 ? '-' : '') + (k * k * k) + cb(m)];
    if (s.neg) p.bad.push(k + cb(m));
    if (sqf > 1 && !RK.isPow(sqf * sqf, 3)) p.bad.push((sg < 0 ? '-' : '') + sqf + cb(N / (sqf * sqf)));
    return p;
  }
  /* Q3 (L1) — entire radicals */
  function q3a(r) {
    var s = pickWhere(function () { return { c: r.int(2, 9), m: r.pick([2, 3, 5, 6, 7, 10, 11]) }; }, function (s) { return ['6,2', '3,11', '5,3', '9,2', '7,2', '4,3', '5,6'].indexOf(s.c + ',' + s.m) < 0 && s.c * s.c * s.m <= 600; });
    var c = s.c, m = s.m, EM = c * c * m;
    var p = P.radical('Write ' + t(mixT(c, 2, m)) + ' as an entire radical.', { k: c, n: 2, m: m }, 'entire', t(mixT(c, 2, m) + '=\\sqrt{' + c + '^{2}\\cdot ' + m + '}=\\sqrt{' + (c * c) + '\\cdot ' + m + '}=' + sq(EM)) + '.',
      ['Square the number in front, then multiply it into the radicand: ' + t('a\\sqrt{b}=\\sqrt{a^{2}b}') + '.'], 'mixed to entire radical');
    p.bad = [sq(c * m), sq(c * c + m)];
    return p;
  }
  function q3b(r) {
    var s = pickWhere(function () { return { c: r.int(2, 5), m: r.pick([2, 3, 4, 5, 6, 7, 9, 10]), neg: r.chance(0.7) }; }, function (s) { return ['2,9', '5,2', '3,4', '2,5', '2,7', '3,7', '4,2'].indexOf(s.c + ',' + s.m) < 0 && s.c * s.c * s.c * s.m <= 1000; });
    var c = s.c, m = s.m, sg = s.neg ? -1 : 1, EM = c * c * c * m;
    var p = P.radical('Write ' + t(mixT(sg * c, 3, m)) + ' as an entire radical.', { k: sg * c, n: 3, m: m }, 'entire',
      t(mixT(sg * c, 3, m) + '=\\sqrt[3]{(' + (sg < 0 ? '-' : '') + c + ')^{3}\\cdot ' + m + '}=\\sqrt[3]{' + (sg < 0 ? '-' : '') + (c * c * c) + '\\cdot ' + m + '}=' + cb(sg * EM)) + '.' + (s.neg ? ' For a cube root (odd index) the negative sign can go inside.' : ''),
      ['Cube the number in front, then multiply it into the radicand: ' + t('a\\sqrt[3]{b}=\\sqrt[3]{a^{3}b}') + '.', 'A negative number in front can go inside a cube root.'], 'mixed to entire: cube root', { diag: function (v, rr) {
        if (rr && rr.n === 3 && rr.m === c * c * m && Math.abs(rr.k[0]) === 1) return { code: 'u2t-ent-square', hint: 'For a <b>cube</b> root the number in front is <b>cubed</b>: ' + t(c + '^{3}=' + (c * c * c)) + '.' };
        return null;
      } });
    p.bad = [cb(-sg * EM), cb(sg * c * m), cb(sg * c * c * m)];
    return p;
  }
  /* Q4 (L2) — restrictions */
  function q4a(r) {
    var s = pickWhere(function () { return { a: r.int(1, 5), b: r.pick(nz(-15, 15)) }; }, function (s) { return ['1,5', '1,-8', '3,-12', '2,5', '1,-2', '4,12', '3,6', '2,10', '1,6', '1,-6', '3,12'].indexOf(s.a + ',' + s.b) < 0; });
    var a = s.a, b = s.b, rad = linT(a, b), bd = rat(-b, a), key = 'x\\ge ' + bd;
    return RK.res('State the restriction on the variable in ' + t('\\sqrt{' + rad + '}') + '.', key,
      [{ is: 'x\\ge ' + rat(b, a), code: 'u2t-res-sign', hint: 'Solve ' + t(rad + '\\ge 0') + ' carefully: moving the constant to the other side changes its sign.' },
        { is: 'x\\le ' + bd, code: 'u2t-res-dir', hint: 'You divide by a <b>positive</b> number here, so the inequality sign stays the same.' },
        { is: 'x>' + bd, code: 'u2t-res-strict', hint: 'The radicand can equal ' + t(0) + ', so the boundary is included: use ' + t('\\ge') + '.' }],
      'Even index: ' + t(rad + '\\ge 0' + (a === 1 ? '' : '\\Rightarrow ' + a + 'x\\ge ' + (-b)) + '\\Rightarrow ' + key) + '.',
      ['A square root needs a radicand ' + t('\\ge 0') + '.', 'Solve the inequality ' + t(rad + '\\ge 0') + '.'], 'restriction: square root');
  }
  function q4b(r) {
    var odd = r.chance(0.5);
    if (odd) {
      var a = r.int(1, 4), b = r.pick(nz(-9, 9)), n = r.pick([3, 3, 5]), R = '\\sqrt[' + n + ']{' + (r.chance(0.5) ? linT(a, b) : b + (a === 1 ? '-x' : '-' + a + 'x')) + '}';
      return RK.res('State the restriction on the variable in ' + t(R) + '.', 'x\\in\\mathbb{R}',
        [{ is: 'x\\ge ' + rat(-b, a), code: 'u2t-res-odd', hint: 'The index ' + t(n) + ' is <b>odd</b>: any real number has a ' + (n === 3 ? 'cube' : 'fifth') + ' root, so there is no restriction.' }, { is: 'x\\le ' + rat(b, a), code: 'u2t-res-odd', hint: 'The index ' + t(n) + ' is <b>odd</b>: there is no restriction.' }],
        'The index ' + t(n) + ' is odd, and every real number has exactly one ' + (n === 3 ? 'cube' : 'fifth') + ' root: ' + t('x\\in\\mathbb{R}') + ' (no restriction).',
        ['Only an even index needs radicand ' + t('\\ge 0') + '.', 'For an odd index, write ' + t('x\\in\\mathbb{R}') + '.'], 'restriction: odd index');
    }
    var k = r.int(2, 9), n2 = r.pick([2, 4]);
    var R2 = n2 === 2 ? '\\sqrt{-' + k + 'x}' : '\\sqrt[4]{-' + k + 'x}';
    return RK.res('State the restriction on the variable in ' + t(R2) + '.', 'x\\le 0',
      [{ is: 'x\\ge 0', code: 'u2t-res-noflip', hint: 'Dividing both sides of ' + t('-' + k + 'x\\ge 0') + ' by ' + t(-k) + ' (a negative number) <b>reverses</b> the inequality sign.' }, { is: 'x<0', code: 'u2t-res-strict', hint: 'The radicand can be ' + t(0) + ', so include ' + t('x=0') + '.' }],
      'Even index: ' + t('-' + k + 'x\\ge 0\\Rightarrow x\\le 0') + ' (dividing by ' + t(-k) + ' reverses the sign). Only zero and negative values of ' + t('x') + ' give a radicand that isn’t negative.',
      ['Set the radicand ' + t('\\ge 0') + ' and solve.', 'Dividing by a negative number reverses the inequality sign.'], 'restriction: negative coefficient');
  }
  /* Q5 (L3) — like radicals */
  function q5a(r) {
    var s = pickWhere(function () { var pq = r.sample([2, 3, 5, 6, 7, 10, 11, 13, 15], 2); return { p: pq[0], q: pq[1], a: r.int(2, 9), b: r.pick(nz(-9, 9)), c: r.pick(nz(-9, 9)), d: r.pick(nz(-9, 9)) }; },
      function (s) { return s.a + s.c !== 0 && s.b + s.d !== 0; });
    var p = s.p, q = s.q, a = s.a, b = s.b, c = s.c, d = s.d;
    var shown = cT(a, true, sq(p)) + cT(b, false, sq(q)) + cT(c, false, sq(p)) + cT(d, false, sq(q)), S = add(term(a + c, 2, p), term(b + d, 2, q));
    var dl = [[add(term(a + c, 2, p), term(b - d, 2, q)), 'u2t-like-sign', 'Check the sign in front of each term as you collect it.']];
    if (a + b + c + d > 0) dl.push([term(a + b + c + d, 2, p + q), 'u2t-add-rad', 'Only like radicals combine; never add the radicands.']);
    return RK.part('Simplify ' + t(shown) + '.', S, { dl: dl }, t(pa(cT(a, true) + cT(c, false)) + sq(p) + '+' + pa(cT(b, true) + cT(d, false)) + sq(q) + '=' + rtex(S)) + '.',
      ['Group the like radicals (same index, same radicand) and add their coefficients.', 'Unlike radicals stay as separate terms.'], 'combine like radicals');
  }
  function q5b(r) {
    var s = pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7, 10]), a: r.int(2, 9), b: r.pick(nz(-6, 6)), c: r.pick(nz(-7, 7)) }; }, function (s) { return s.a + s.c !== 0; });
    var m = s.m, a = s.a, b = s.b, c = s.c;
    var shown = mixT(a, 3, m) + cT(b, false, sq(m)) + cT(c, false, cb(m)), S = add(term(a + c, 3, m), term(b, 2, m));
    return RK.part('Simplify ' + t(shown) + '.', S, { dl: [[term(a + b + c, 3, m), 'u2t-like-index', t(sq(m)) + ' and ' + t(cb(m)) + ' have <b>different indices</b>, so they are not like radicals and can’t be combined.'], [term(a + b + c, 2, m), 'u2t-like-index', t(sq(m)) + ' and ' + t(cb(m)) + ' have <b>different indices</b>, so they are not like radicals.']] },
      'Only the cube roots are like radicals: ' + t(pa(cT(a, true) + cT(c, false)) + cb(m) + cT(b, false, sq(m)) + '=' + rtex(S)) + '. ' + t(sq(m)) + ' has a different index, so it stays a separate term.',
      ['Like radicals need the same index <b>and</b> the same radicand.', t(sq(m)) + ' and ' + t(cb(m)) + ' are not like radicals.'], 'like radicals: index matters');
  }
  /* Q6 (L4) — multiply monomials; a power of a radical */
  function q6a(r) {
    var s = pickWhere(function () { return { g: r.pick([2, 3, 5, 6, 7]), u: r.pick([1, 2, 3, 5, 7]), v: r.pick([1, 2, 3, 5, 7]), a: r.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]), b: r.int(2, 6) }; },
      function (s) { return s.u !== s.v && s.g * s.u <= 35 && s.g * s.v <= 35 && ex.simplest(s.u * s.v, 2) && !(s.g * s.u === 6 && s.g * s.v === 15) && !(s.g * s.u === 6 && s.g * s.v === 10); });
    var A = s.g * s.u, B = s.g * s.v, a = s.a, b = s.b, S = mul(term(a, 2, A), term(b, 2, B)), shown = pa(mixT(a, 2, A)) + pa(mixT(b, 2, B));
    return RK.part('Multiply and simplify ' + t(shown) + '.', S, { dl: [[term((a + b) * s.g, 2, s.u * s.v), 'u2t-mul-addcoef', 'Multiply the coefficients: ' + t(a + '\\times ' + b + '=' + (a * b)) + '.'], [term(a * b, 2, A + B), 'u2t-mul-addrad', 'Multiply the radicands: ' + t('\\sqrt{' + A + '}\\cdot\\sqrt{' + B + '}=\\sqrt{' + A + '\\cdot ' + B + '}') + '.']] },
      t(shown + '=' + (a * b) + '\\sqrt{' + A + '\\cdot ' + B + '}=' + mixT(a * b, 2, A * B) + '=' + rtex(S)) + '.', ['Multiply the coefficients together and the radicands together: ' + t('m\\sqrt{a}\\cdot k\\sqrt{b}=mk\\sqrt{ab}') + '.', 'Then simplify the radical.'], 'multiply radicals');
  }
  function q6b(r) {
    var cube = r.chance(0.35), n = cube ? 3 : 2, c = r.int(2, cube ? 3 : 7), m = r.pick(cube ? [2, 3, 4, 5, 7] : [2, 3, 5, 6, 7, 10, 11]), neg = !cube && r.chance(0.4);
    var shown = (neg ? '-' : '') + pa(mixT(c, n, m)) + '^{' + n + '}', V = (neg ? -1 : 1) * Math.pow(c, n) * m;
    return RK.part('Simplify ' + t(shown) + '.', term(V), { dl: [[(neg ? -1 : 1) * c * m, 'u2t-pow-coef', 'Raise the coefficient to the power too: ' + t(pa(mixT(c, n, m)) + '^{' + n + '}=' + c + '^{' + n + '}\\cdot' + pa(rn(n, m)) + '^{' + n + '}') + '.'], [term((neg ? -1 : 1) * Math.pow(c, n), n, Math.pow(m, n)), 'u2t-pow-rad', t(pa(rn(n, m)) + '^{' + n + '}=' + m) + '.'], [-V, 'sign', neg ? 'The negative sign is outside the bracket, so it is not squared: the answer is negative.' : 'Check the sign.']] },
      t(shown + '=' + (neg ? '-' : '') + c + '^{' + n + '}\\cdot' + pa(rn(n, m)) + '^{' + n + '}=' + (neg ? '-' : '') + Math.pow(c, n) + '(' + m + ')=' + V) + '.',
      [t(pa(rn(n, 'a')) + '^{' + n + '}=a') + '.', 'Raise the coefficient and the radical to the power separately, then multiply.' + (neg ? ' The negative sign outside the bracket stays.' : '')], 'power of a radical');
  }
  /* Q7 (L5) — divide; rationalize a monomial denominator */
  function q7a(r) {
    var s = pickWhere(function () { return { q: r.pick([2, 3, 5, 6, 7, 11]), N: r.pick([2, 3, 5, 6, 7, 10, 8, 12, 18, 20, 27]), B: r.int(2, 6), c: r.pick([-4, -3, -2, 2, 3, 4, 5]) }; },
      function (s) { return s.N !== s.q && !RK.isPow(s.N * s.q, 2) && s.N * s.q <= 200 && !(s.q === 6 && s.N === 7) && !(s.q === 3 && s.N === 18) && !(s.q === 5 && s.N === 6); });
    var q = s.q, N = s.N, B = s.B, c = s.c, A = B * c, S = term(c, 2, N), shown = '\\dfrac{' + mixT(A, 2, N * q) + '}{' + mixT(B, 2, q) + '}';
    return RK.part('Divide and simplify ' + t(shown) + '.', S, { dl: [[term(A, 2, N), 'u2t-div-coef', 'Divide the coefficients too: ' + t(A + '\\div ' + B + '=' + c) + '.']] },
      t(shown + '=\\frac{' + A + '}{' + B + '}\\sqrt{\\frac{' + (N * q) + '}{' + q + '}}=' + mixT(c, 2, N) + (rtex(S) === mixT(c, 2, N) ? '' : '=' + rtex(S))) + '.',
      [t('\\dfrac{m\\sqrt{a}}{k\\sqrt{b}}=\\dfrac{m}{k}\\sqrt{\\dfrac{a}{b}}') + '.', 'Then simplify the radical if you can.'], 'divide radicals');
  }
  function q7b(r) {
    var s = pickWhere(function () { return { b: r.pick([2, 3, 5, 6, 7, 10, 11]), m: r.pick([1, 2, 3]), a: r.pick(nz(-24, 24)) }; },
      function (s) { return s.a % (s.m * s.b) !== 0 && Math.abs(s.a) > 1 && !(s.a === 10 && s.b === 5 && s.m === 1) && !(s.a === 9 && s.b === 6 && s.m === 2) && !(s.a === 15 && s.b === 3 && s.m === 2); });
    var a = s.a, b = s.b, m = s.m, S = term([a, m * b], 2, b), shown = '\\dfrac{' + a + '}{' + mixT(m, 2, b) + '}';
    var dl = [[term([a, m * b]), 'u2t-rat-top', 'Multiply the numerator by ' + t(sq(b)) + ' too.']]; if (m > 1) dl.push([term([a, m * m * b], 2, b), 'u2t-rat-den', 'Multiply by ' + t(sq(b)) + ' only: ' + t(mixT(m, 2, b) + '\\cdot' + sq(b) + '=' + (m * b)) + '.']);
    return RK.part('Rationalize the denominator and simplify ' + t(shown) + '.', S, { dl: dl },
      t(shown + '\\cdot\\dfrac{' + sq(b) + '}{' + sq(b) + '}=\\dfrac{' + a + sq(b) + '}{' + (m * b) + '}=' + rtex(S)) + '.',
      ['Multiply the numerator and the denominator by ' + t(sq(b)) + '.', 'Reduce the fraction at the end.'], 'rationalize a monomial denominator');
  }

  /* =====================================================================================================
   * PROGRESSING
   * ===================================================================================================== */
  /* Q8 (L1) — order radicals */
  function q8(r) {
    var cube = r.chance(0.3), items;
    if (!cube) {
      items = pickWhere(function () {
        var lo = r.int(45, 100), hi = lo + r.int(22, 30), cand = [];
        [2, 3, 4, 5, 6, 7].forEach(function (c) { RK.SQF.forEach(function (m) { var N = c * c * m; if (N >= lo && N <= hi) cand.push({ c: c, m: m, N: N }); }); });
        cand = r.shuffle(cand); var pick = [], used = {};
        cand.forEach(function (x) { if (pick.length < 4 && !used[x.N]) { used[x.N] = 1; pick.push(x); } });
        if (pick.length < 4) return null;
        var extra = range(lo, hi).filter(function (N) { return !used[N] && (RK.isPow(N, 2) || ex.simplest(N, 2)); });
        if (!extra.length) return null;
        var e = r.pick(extra); pick.push({ c: 1, m: e, N: e }); return pick;
      }, function () { return true; });
      items.forEach(function (x) { x.tex = x.c === 1 ? (RK.isPow(x.N, 2) ? String(Math.round(Math.sqrt(x.N))) : sq(x.N)) : mixT(x.c, 2, x.m); x.ent = sq(x.N); });
    } else {
      items = pickWhere(function () {
        var cand = [];
        [2, 3, 4, 5].forEach(function (c) { [2, 3, 4, 5, 6, 7, 9, 10, 11].forEach(function (m) { var N = c * c * c * m; if (N <= 140 && N >= 16) { cand.push({ c: c, m: m, N: N }); cand.push({ c: -c, m: m, N: -N }); } }); });
        cand = r.shuffle(cand); var pick = [], used = {}, negs = 0;
        cand.forEach(function (x) { if (pick.length < 5 && !used[x.N] && !used[-x.N] && (x.N > 0 || negs < 2)) { used[x.N] = 1; if (x.N < 0) negs++; pick.push(x); } });
        return pick.length === 5 && negs === 2 ? pick : null;
      }, function () { return true; });
      items.forEach(function (x) { x.tex = mixT(x.c, 3, x.m); x.ent = cb(x.N); });
    }
    var up = r.chance(0.5); items.sort(function (a, b) { return up ? a.N - b.N : b.N - a.N; });
    var first = up ? 'least' : 'greatest', last = up ? 'greatest' : 'least', its = items.map(function (x, i) { return { id: 'i' + i, tex: x.tex }; });
    return P.order(r, 'Without a calculator, arrange the numbers from <b>' + first + '</b> to <b>' + last + '</b>.', its, { first: first, last: last },
      'As entire radicals with the same index: ' + items.map(function (x) { return t(x.tex + (x.tex === x.ent ? '' : '=' + x.ent)); }).join(', ') + '. The larger radicand is the larger number. ' + (up ? 'Least to greatest' : 'Greatest to least') + ': ' + its.map(function (x) { return t(x.tex); }).join(', ') + '.',
      ['Write each number as an entire radical with the same index' + (cube ? ' (a negative in front goes inside a cube root).' : ', and a whole number as ' + t('n=\\sqrt{n^{2}}') + '.'), 'Compare the radicands.'], 'order radicals');
  }
  /* Q9 (L2) — restriction with a sign flip; simplest form with variables; entire radical with a variable */
  function q9a(r) {
    var s = pickWhere(function () { return { a: r.int(2, 6), c: r.int(3, 30) }; }, function (s) { return !(s.a === 5 && s.c === 10) && !(s.a === 3 && s.c === 9) && !(s.a === 3 && s.c === 6) && !(s.a === 4 && s.c === 20) && !(s.a === 3 && s.c === 12) && !(s.a === 5 && s.c === 15) && !(s.a === 2 && s.c === 9); });
    var a = s.a, c = s.c, bd = rat(c, a), key = 'x\\le ' + bd;
    return RK.res('State the restriction on the variable in ' + t('\\sqrt{' + c + '-' + a + 'x}') + '.', key,
      [{ is: 'x\\ge ' + bd, code: 'u2t-res-noflip', hint: 'Dividing by ' + t(-a) + ' (a negative number) <b>reverses</b> the inequality sign.' }, { is: 'x\\le ' + rat(-c, a), code: 'u2t-res-sign', hint: 'Check the sign of the boundary: ' + t('-' + a + 'x\\ge -' + c) + '.' }, { is: 'x<' + bd, code: 'u2t-res-strict', hint: 'The radicand can be ' + t(0) + ', so the boundary is included.' }],
      t(c + '-' + a + 'x\\ge 0\\Rightarrow -' + a + 'x\\ge -' + c + '\\Rightarrow ' + key) + ' (dividing by ' + t(-a) + ' reverses the inequality sign).',
      ['Set the radicand ' + t('\\ge 0') + ' and solve.', 'Dividing both sides by a negative number reverses the inequality sign.'], 'restriction with a sign reversal');
  }
  function q9b(r) {
    var cube = r.chance(0.35), n = cube ? 3 : 2, v1 = cube ? 'a' : 'x', v2 = cube ? 'b' : 'y';
    var s = pickWhere(function () {
      return cube ? { c: r.int(2, 5), m: r.pick([2, 3, 4, 5, 6, 7]), e1: r.int(4, 11), e2: r.chance(0.4) ? r.int(1, 7) : 0, neg: r.chance(0.6) } : { c: r.int(2, 7), m: r.pick([2, 3, 5, 6, 7, 10]), e1: r.int(3, 9), e2: r.chance(0.7) ? r.int(1, 8) : 0, neg: false };
    }, function (s) { var N0 = Math.pow(s.c, n) * s.m; return N0 <= (cube ? 700 : 350) && (s.e1 % n !== 0 || s.e2 % n !== 0) && [45, 72, 98, 20, 27, 150, 48, 54, 40, 16, 250, 81, 63, 32, 125, 24, 500, 128, 200, 75, 18].indexOf(N0) < 0; });
    var c = s.c, m = s.m, N = Math.pow(c, n) * m, neg = s.neg, vin = {}, vout = {}, vall = {};
    vall[v1] = s.e1; vout[v1] = Math.floor(s.e1 / n); vin[v1] = s.e1 % n; if (s.e2) { vall[v2] = s.e2; vout[v2] = Math.floor(s.e2 / n); vin[v2] = s.e2 % n; }
    var outs = varsT(vout), ins = varsT(vin), target = (neg ? '-' : '') + c + outs + rn(n, m + ins), R = rn(n, (neg ? '-' : '') + N + varsT(vall)), vlist = s.e2 ? [v1, v2] : [v1];
    var negT = (neg ? '' : '-') + c + outs + rn(n, m + ins), bo = {}; Object.keys(vout).forEach(function (k) { bo[k] = vout[k] * n; });
    var chk = K.varRadical(target, 'mixed', { diag: function (rr, ast) {
      if (rr && rr.n === n && Math.abs(rr.k[0]) === Math.pow(c, n) && rr.rad.m === m) return { code: 'u2t-var-coef', hint: t(F(Math.pow(c, n))) + ' comes out of the radical as ' + t(c) + '.' };
      var tp = ex.parse(negT); if (tp.ok && ex.equiv(ast, tp.ast, vlist)) return { code: 'sign', hint: 'Check the sign: ' + t('\\sqrt[3]{-x}=-\\sqrt[3]{x}') + '.' };
      return null;
    } });
    var p = P.math('Write ' + t(R) + ' in simplest form.' + (cube ? '' : ' Assume ' + t(vlist.join(',\\ ') + '\\ge 0') + '.'), chk, target,
      t(R + '=' + rn(n, (neg ? '-' : '') + Math.pow(c, n) + varsT(bo)) + '\\cdot ' + rn(n, m + ins) + '=' + target) + '. Divide each exponent by the index ' + t(n) + ': the quotient is the exponent outside, the remainder stays inside.',
      ['Simplify the number and each variable separately.', 'Divide each exponent by the index; the remainder stays under the radical.'], 'simplify a radical with variables', { keys: 'var' });
    p.bad = [(neg ? '-' : '') + Math.pow(c, n) + outs + rn(n, m + ins)]; if (cube && neg) p.bad.push(negT);
    return p;
  }
  function q9c(r) {
    var kind = r.pick(['sq', 'cube', 'cube']), v = r.pick(['x', 'a']), n = kind === 'cube' ? 3 : 2;
    var s = pickWhere(function () { return { c: r.int(2, kind === 'cube' ? 4 : 6), m: r.pick(kind === 'cube' ? [2, 3, 4, 5] : [2, 3, 5, 6, 7]), p: r.int(1, 3), q: r.int(1, n - 1), sg: r.chance(0.6) ? -1 : 1 }; },
      function (s) { return Math.pow(s.c, n) * s.m <= 400 && ['3,1,2,1', '2,5,3,1', '5,1,1,1', '2,3,2,1'].indexOf(s.c + ',' + s.m + ',' + s.p + ',' + s.q) < 0; });
    var c = s.c, m = s.m, p = s.p, q = s.q, sg = s.sg, EM = Math.pow(c, n) * m, E = n * p + q, vo = {}, vi = {}, ve = {}, vb = {};
    vo[v] = p; vi[v] = q; ve[v] = E; vb[v] = p + q;
    var shown = (sg < 0 ? '-' : '') + c + varsT(vo) + rn(n, m + varsT(vi));
    var target = n === 2 ? (sg < 0 ? '-' : '') + sq(EM + varsT(ve)) : cb((sg < 0 ? '-' : '') + EM + varsT(ve));
    var chk = K.varRadical(target, 'entire', { diag: function (rr) {
      if (rr && rr.n === n && rr.rad.m === c * m) return { code: 'u2t-ent-nosq', hint: 'Raise the number in front to the power ' + t(n) + ' first: ' + t(c + '^{' + n + '}=' + Math.pow(c, n)) + '.' };
      if (rr && rr.n === n && rr.rad.vars[v] === p + q) return { code: 'u2t-ent-exp', hint: 'Raise the variable in front to the power ' + t(n) + ' too, then add the exponents.' };
      return null;
    } });
    var vp = {}; vp[v] = n * p;
    var pt = P.math('Write ' + t(shown) + ' as an entire radical.' + (n === 2 ? ' Assume ' + t(v + '\\ge 0') + '.' : ''), chk, target,
      t(shown + '=' + (n === 2 && sg < 0 ? '-' : '') + rn(n, '(' + (n === 3 && sg < 0 ? '-' : '') + c + varsT(vo) + ')^{' + n + '}\\cdot ' + m + varsT(vi)) + '=' + (n === 2 && sg < 0 ? '-' : '') + rn(n, (n === 3 && sg < 0 ? '-' : '') + Math.pow(c, n) + varsT(vp) + '\\cdot ' + m + varsT(vi)) + '=' + target) + '.' + (n === 2 && sg < 0 ? ' Even index: the negative sign stays outside.' : n === 3 && sg < 0 ? ' Odd index: the negative sign goes inside.' : ''),
      ['Raise everything in front (number and variable) to the power of the index, then multiply it into the radicand.', 'A negative in front goes inside only for an odd index.'], 'mixed to entire with a variable', { keys: 'var' });
    pt.bad = [(n === 2 && sg < 0 ? '-' : '') + rn(n, (n === 3 && sg < 0 ? '-' : '') + (c * m) + varsT(ve)), (n === 2 && sg < 0 ? '-' : '') + rn(n, (n === 3 && sg < 0 ? '-' : '') + EM + varsT(vb))];
    return pt;
  }
  /* Q10 (L3) — simplify first, then combine; with a variable */
  function q10a(r) {
    var s = pickWhere(function () { var m = r.pick([2, 3, 5, 6, 7, 10, 11]); return { m: m, ks: r.sample([1, 2, 3, 4, 5, 6, 7], 3), cs: [r.int(1, 3), r.pick([-3, -2, -1, 1, 2, 3]), r.pick([-2, -1, 1, 2])] }; },
      function (s) { var tot = 0, okk = true; s.ks.forEach(function (k, i) { tot += s.cs[i] * k; if (k * k * s.m > 300) okk = false; }); return okk && tot !== 0 && s.ks.filter(function (k) { return k > 1; }).length >= 2; });
    var m = s.m, tot = 0, written = '', step = '', wc = 0, sumN = 0;
    s.ks.forEach(function (k, i) { var c = s.cs[i], N = k * k * m; tot += c * k; wc += c * k * k; sumN += c * N; written += cT(c, i === 0, sq(N)); step += (i ? (c < 0 ? '-' : '+') : (c < 0 ? '-' : '')) + (Math.abs(c) === 1 ? '' : Math.abs(c)) + (Math.abs(c) === 1 ? mixT(k, 2, m) : pa(mixT(k, 2, m))); });
    var S = term(tot, 2, m), dl = [[term(wc, 2, m), 'u2t-add-coef', 'A perfect square comes out as its <b>root</b>, not as itself.']]; if (sumN > 0) dl.push([term(1, 2, sumN), 'u2t-add-rad', 'Never add the radicands: simplify each radical first, then combine like radicals.']);
    return RK.part('Simplify ' + t(written) + '.', S, { dl: dl }, t(written + '=' + step + '=' + rtex(S)) + '.', ['Write each radical in simplest form first.', 'Then combine the like radicals.'], 'simplify, then combine');
  }
  function q10b(r) {
    var v = r.pick(['x', 'a']);
    var s = pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7]), k1: r.int(2, 5), k2: r.int(2, 5), c2: r.pick([1, 2, -1]), cube: r.chance(0.3) }; },
      function (s) { var n = s.cube ? 3 : 2; return s.k1 !== s.k2 && s.k1 + s.c2 * s.k2 !== 0 && Math.pow(s.k1, n) * s.m <= 400 && Math.pow(s.k2, n) * s.m <= 400 && (s.cube ? s.m <= 5 : true) && !(s.m === 2 && s.k1 === 2 && s.k2 === 3 && !s.cube) && !(s.m === 3 && s.k1 === 2 && s.k2 === 3 && !s.cube); });
    var n = s.cube ? 3 : 2, m = s.m, k1 = s.k1, k2 = s.k2, c2 = s.c2, tot = k1 + c2 * k2, ve = {}; ve[v] = n + 1;
    var written = rn(n, Math.pow(k1, n) * m + varsT(ve)) + (c2 < 0 ? '-' : '+') + (Math.abs(c2) === 1 ? '' : Math.abs(c2)) + v + rn(n, Math.pow(k2, n) * m + v);
    var target = coefT(tot) + v + rn(n, m + v);
    var chk = K.varRadical(target, 'mixed', { diag: function (rr) { if (rr && rr.n === n && rr.rad.m === m && rr.k[1] === 1 && rr.k[0] === 1 + c2 && 1 + c2 !== tot) return { code: 'u2t-add-coef', hint: 'Simplify each radical first: the perfect ' + (n === 2 ? 'squares' : 'cubes') + ' come out and multiply the coefficients.' }; return null; } });
    var p = P.math('Simplify ' + t(written) + '.' + (n === 2 ? ' Assume ' + t(v + '\\ge 0') + '.' : ''), chk, target,
      t(written + '=' + coefT(k1) + v + rn(n, m + v) + cT(c2 * k2, false, v + rn(n, m + v)) + '=' + target) + '. Both terms are like radicals once they are simplified.' + (n === 3 ? ' (A cube root needs no restriction.)' : ''),
      ['Simplify each radical: ' + t(rn(n, v + '^{' + (n + 1) + '}') + '=' + v + rn(n, v)) + '.', 'Then add the coefficients of the like radicals.'], 'add radicals with a variable', { keys: 'var' });
    p.bad = 1 + c2 !== tot && 1 + c2 !== 0 ? [coefT(1 + c2) + v + rn(n, m + v)] : [];
    return p;
  }
  /* Q11 (L4) — two binomials; a square */
  function q11a(r) {
    var two = r.chance(0.5), S, shown, sol, dl;
    if (!two) {
      var s = pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7]), a: r.int(1, 6), b: r.pick([-4, -3, -2, -1, 1, 2, 3, 4]), c: r.pick(nz(-6, 6)), d: r.pick([-4, -3, -2, -1, 1, 2, 3, 4]) }; },
        function (s) { return s.a * s.d + s.b * s.c !== 0 && s.a * s.c + s.b * s.d * s.m !== 0 && !(s.a === 3 && s.c === 5 && s.m === 2); });
      var m = s.m, a = s.a, b = s.b, c = s.c, d = s.d;
      S = mul(add(term(a), term(b, 2, m)), add(term(c), term(d, 2, m))); shown = pa(a + cT(b, false, sq(m))) + pa(c + cT(d, false, sq(m)));
      sol = t(shown + '=' + (a * c) + cT(a * d, false, sq(m)) + cT(b * c, false, sq(m)) + cT(b * d, false) + '(' + m + ')=' + rtex(S)) + '.';
      dl = [[add(term(a * c + b * d), term(a * d + b * c, 2, m)), 'u2t-foil-sq', t(sq(m) + '\\cdot' + sq(m) + '=' + m) + '.'], [term(a * c + b * d * m), 'u2t-foil-mid', 'You are missing the outer and inner products: multiply each term by each term.']];
    } else {
      var s2 = pickWhere(function () { var pr = r.pick([[2, 3], [2, 5], [3, 5], [2, 7], [3, 7], [5, 7], [5, 6], [3, 10], [2, 11]]); return { p: pr[0], q: pr[1], a: r.int(1, 4), b: r.pick([-3, -2, -1, 1, 2, 3]), c: r.int(1, 4), d: r.pick([-3, -2, -1, 1, 2, 3]), sw: r.chance(0.5) }; },
        function (s) { return s.a * s.d + s.b * s.c !== 0 && s.a * s.c * s.p + s.b * s.d * s.q !== 0 && (s.a > 1 || s.c > 1); });
      var p = s2.sw ? s2.q : s2.p, q = s2.sw ? s2.p : s2.q, a2 = s2.a, b2 = s2.b, c2 = s2.c, d2 = s2.d;
      S = mul(add(term(a2, 2, p), term(b2, 2, q)), add(term(c2, 2, p), term(d2, 2, q))); shown = pa(mixT(a2, 2, p) + cT(b2, false, sq(q))) + pa(mixT(c2, 2, p) + cT(d2, false, sq(q)));
      sol = t(shown + '=' + (a2 * c2) + '(' + p + ')' + cT(a2 * d2, false, sq(p * q)) + cT(b2 * c2, false, sq(p * q)) + cT(b2 * d2, false) + '(' + q + ')=' + rtex(S)) + '.';
      dl = [[add(term(a2 * c2 + b2 * d2), term(a2 * d2 + b2 * c2, 2, p * q)), 'u2t-foil-sq', t(sq(p) + '\\cdot' + sq(p) + '=' + p) + '.'], [term(a2 * c2 * p + b2 * d2 * q), 'u2t-foil-mid', 'You are missing the outer and inner products.']];
    }
    return RK.part('Expand and simplify ' + t(shown) + '.', S, { dl: dl }, sol, HFOIL, 'multiply two binomials');
  }
  function q11b(r) {
    var s = pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7, 10]), a: r.int(1, 5), b: r.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]) }; }, function (s) { return (s.a > 1 || Math.abs(s.b) > 1) && !(s.m === 5 && s.a === 1 && s.b === 3) && !(s.m === 2 && s.a === 3 && s.b === -2); });
    var m = s.m, a = s.a, b = s.b, X = add(term(a, 2, m), term(b)), S = mul(X, X), shown = pa(mixT(a, 2, m) + cT(b, false)) + '^{2}';
    return RK.part('Expand and simplify ' + t(shown) + '.', S,
      { dl: [[term(a * a * m + b * b), 'u2t-sq-mid', t('(x+y)^{2}=x^{2}+2xy+y^{2}') + ': you are missing the middle term.'], [add(term(a * a * m + b * b), term(a * b, 2, m)), 'u2t-sq-half', 'The middle term is <b>twice</b> the product.']] },
      t(shown + '=' + pa(mixT(a, 2, m)) + '^{2}' + cT(2 * a * b, false) + sq(m) + '+' + (b * b) + '=' + (a * a * m) + cT(2 * a * b, false, sq(m)) + '+' + (b * b) + '=' + rtex(S)) + '.',
      ['Use ' + t('(x+y)^{2}=x^{2}+2xy+y^{2}') + ', or write it as two equal brackets and FOIL.', t(pa(a + '\\sqrt{' + m + '}') + '^{2}=' + a + '^{2}\\cdot ' + m) + '.'], 'square a binomial');
  }
  /* Q12 (L5) — cube-root denominator; divide each term */
  function q12a(r) {
    var s = pickWhere(function () { return { b: r.pick([2, 3, 4, 5, 9, 25, 6]), a: r.int(1, 15) }; }, function (s) { return !(s.a === 4 && s.b === 3) && !(s.a === 10 && s.b === 25) && !(s.a === 12 && s.b === 4) && !(s.a === 6 && s.b === 3) && !(s.a === 4 && s.b === 2) && !(s.a === 9 && s.b === 3) && !(s.a === 5 && s.b === 9); });
    var a = s.a, b = s.b, mult = { 2: 4, 3: 9, 4: 2, 5: 25, 9: 3, 25: 5, 6: 36 }[b], cr = Math.round(Math.cbrt(b * mult)), S = term([a, b], 3, b * b), shown = '\\dfrac{' + a + '}{' + cb(b) + '}';
    return RK.part('Rationalize the denominator and simplify ' + t(shown) + '.', S, { dl: [[term([a, b], 3, b), 'u2t-cube-sq', 'Multiplying by ' + t(cb(b)) + ' leaves ' + t(cb(b * b)) + ' in the denominator. Multiply by the cube root that makes a perfect <b>cube</b>.']] },
      t(b + '\\times ' + mult + '=' + cr + '^{3}') + ': ' + t(shown + '\\cdot\\dfrac{' + cb(mult) + '}{' + cb(mult) + '}=\\dfrac{' + (a === 1 ? '' : a) + cb(mult) + '}{' + cr + '}=' + rtex(S)) + '.',
      ['What times the radicand makes a perfect cube (' + t('8,\\ 27,\\ 64,\\ 125,\\ 216') + ')?', 'Multiply the numerator and the denominator by that cube root.'], 'rationalize a cube-root denominator');
  }
  function q12b(r) {
    var s = pickWhere(function () { var uv = r.sample([2, 3, 5, 7, 10, 11, 1], 2); return { q: r.pick([2, 3, 5, 6, 7]), u: uv[0], v: uv[1], c: r.int(1, 4), x: r.int(1, 5), y: r.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]) }; },
      function (s) { return ex.gcd(s.u, s.q) === 1 && ex.gcd(s.v, s.q) === 1 && s.u * s.q <= 80 && s.v * s.q <= 80 && !(s.q === 6 && s.u === 11 && s.v === 5); });
    var q = s.q, u = s.u, v = s.v, c = s.c, x = s.x, y = s.y;
    var S = add(term(x, 2, u), term(y, 2, v));
    function tm(k, w, first) { var A = k * c; return w === 1 ? cT(A, first, sq(q)) : cT(A, first, sq(w * q)); }
    var shown = '\\dfrac{' + tm(x, u, true) + tm(y, v, false) + '}{' + mixT(c, 2, q) + '}';
    return RK.part('Simplify ' + t(shown) + '.', S, { dl: [[add(term(x, 2, u), term(y * c, 2, v * q)), 'u2t-one-term', 'Divide <b>every</b> term of the numerator by the denominator.']] },
      'Divide each term of the numerator by ' + t(mixT(c, 2, q)) + ': ' + t(shown + '=' + (c === 1 ? '' : '\\frac{' + (x * c) + '}{' + c + '}') + '\\sqrt{\\frac{' + (u * q) + '}{' + q + '}}' + cT(y, false, '\\sqrt{\\frac{' + (v * q) + '}{' + q + '}}') + '=' + rtex(S)) + '.',
      ['A one-term denominator divides <b>every</b> term of the numerator: ' + t('\\dfrac{a+b}{c}=\\dfrac{a}{c}+\\dfrac{b}{c}') + '.', 'Divide the coefficients and divide the radicands.'], 'divide each term');
  }
  /* Q13 (L6) — rationalize binomial denominators */
  function q13a(r) {
    var s = pickWhere(function () { return { a: r.int(1, 6), b: r.pick([2, 3, 5, 6, 7, 10, 11, 13]), k: r.int(2, 15), sg: r.chance(0.5) ? 1 : -1 }; },
      function (s) { var D = s.a * s.a - s.b; if (D === 0 || Math.abs(D) > 12) return false; return Math.abs(D) / ex.gcd(s.k, Math.abs(D)) <= 6 && !(s.a === 3 && s.b === 5 && s.k === 6) && !(s.a === 4 && s.b === 10 && s.k === 6) && !(s.a === 3 && s.b === 2 && s.k === 7); });
    var a = s.a, b = s.b, k = s.k, sg = s.sg, D = a * a - b, den = add(term(a), term(sg, 2, b)), cj = add(term(a), term(-sg, 2, b)), S = sc(cj, [k, D]);
    var shown = '\\dfrac{' + k + '}{' + a + (sg > 0 ? '+' : '-') + sq(b) + '}', ct = a + (sg > 0 ? '-' : '+') + sq(b);
    return RK.part('Rationalize the denominator and simplify ' + t(shown) + '.', S, { dl: [[sc(den, [k, D]), 'u2t-conj-sign', 'Multiply by the <b>conjugate</b> ' + t(ct) + ', not by the denominator itself.'], [sc(cj, [k, a * a + b]), 'u2t-conj-den-add', 'The denominator is a difference of squares: ' + t((a * a) + '-' + b) + '.']] },
      t(shown + '\\cdot\\dfrac{' + ct + '}{' + ct + '}=\\dfrac{' + k + pa(ct) + '}{' + (a * a) + '-' + b + '}=' + rtex(S)) + '.', HCONJ, 'rationalize a binomial denominator');
  }
  function q13b(r) {
    var s = pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7, 10, 11]), u: r.int(1, 3), v: r.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]), w: r.pick([-4, -3, -2, -1, 1, 2, 3, 4]) }; },
      function (s) { var D = s.m - s.w * s.w; return D !== 0 && Math.abs(D) <= 10 && s.u * s.w !== s.v && !(s.m === 7 && s.u === 1 && s.v === 2 && s.w === -2) && !(s.m === 3 && s.u === 1 && s.v === -2 && s.w === 1) && !(s.m === 6 && s.u === 1 && s.v === 3 && s.w === -2); });
    var m = s.m, u = s.u, v = s.v, w = s.w, D = m - w * w, N = add(term(u, 2, m), term(v)), C = add(term(1, 2, m), term(-w)), top = mul(N, C), S = sc(top, [1, D]);
    var shown = '\\dfrac{' + mixT(u, 2, m) + cT(v, false) + '}{' + sq(m) + cT(w, false) + '}', ct = sq(m) + cT(-w, false);
    return RK.part('Rationalize the denominator and simplify ' + t(shown) + '.', S, { dl: [[sc(top, [1, m + w * w]), 'u2t-conj-den-add', 'The denominator is a difference of squares: ' + t(m + '-' + (w * w) + '=' + D) + '.'], [sc(term(u * m - v * w), [1, D]), 'u2t-foil-mid', 'Expand the numerator fully: four products.']] },
      'Multiply by the conjugate ' + t(ct) + ': ' + t('\\dfrac{' + pa(mixT(u, 2, m) + cT(v, false)) + pa(ct) + '}{' + m + '-' + (w * w) + '}=\\dfrac{' + rtex(top) + '}{' + D + '}=' + rtex(S)) + '.',
      HCONJ.concat(['Expand the numerator with FOIL, then reduce only by a factor of every term.']), 'binomial over a binomial');
  }

  /* =====================================================================================================
   * MASTERY
   * ===================================================================================================== */
  /* Q14 (L1, L3) — a perimeter as an entire radical */
  function q14(r) {
    var s = pickWhere(function () { var ab = r.sample([1, 2, 3, 4, 5, 6], 2); return { m: r.pick([2, 3, 5, 6, 7]), a: Math.max(ab[0], ab[1]), b: Math.min(ab[0], ab[1]), tri: r.chance(0.3) }; },
      function (s) { var tot = 2 * (s.a + s.b); return s.a > 1 && tot * tot * s.m <= 2000 && !(s.m === 3 && s.a === 4 && s.b === 3); });
    var m = s.m, a = s.a, b = s.b, Lt = sq(a * a * m), Wt = b === 1 ? sq(m) : sq(b * b * m), tot = 2 * (a + b), K2 = tot * tot * m;
    var p = P.radical('A rectangle has a length of ' + t(Lt) + ' cm and a width of ' + t(Wt) + ' cm. Its perimeter can be written as the entire radical ' + t('\\sqrt{k}') + ' cm. Write the perimeter as an entire radical.', { k: tot, n: 2, m: m }, 'entire',
      'Simplify the sides: ' + t(Lt + '=' + mixT(a, 2, m)) + ' and ' + t(Wt + '=' + mixT(b, 2, m)) + '. ' + t('P=2' + pa(mixT(a, 2, m) + '+' + mixT(b, 2, m)) + '=2' + pa(mixT(a + b, 2, m)) + '=' + mixT(tot, 2, m)) + '. As an entire radical: ' + t(mixT(tot, 2, m) + '=\\sqrt{' + (tot * tot) + '\\cdot ' + m + '}=' + sq(K2)) + ' cm.',
      ['Simplify each side so they become like radicals, then find ' + t('P=2(\\ell+w)') + '.', 'Write the mixed radical as an entire radical: square the coefficient and multiply it in.'], 'perimeter as an entire radical', { diag: function (v, rr) {
        if (rr && rr.n === 2 && Math.abs(rr.k[0]) === 1 && rr.m === (a + b) * (a + b) * m) return { code: 'u2t-per-half', hint: 'That is ' + t('\\ell+w') + ': the perimeter has two lengths and two widths.' };
        return null;
      } });
    p.bad = [sq((a + b) * (a + b) * m), sq(2 * (a * a * m + (b === 1 ? m : b * b * m)))];
    return p;
  }
  /* Q15 (L2) — where two radicals are defined */
  function q15(r) {
    var den = r.chance(0.35), lo = r.int(-6, 4), hi = lo + r.int(3, 9), key, prompt, sol, wr;
    var A = 'x' + (lo < 0 ? '+' + (-lo) : lo === 0 ? '' : '-' + lo), B = hi + '-x';
    if (!den) {
      key = lo + '\\le x\\le ' + hi;
      prompt = 'For what values of ' + t('x') + ' is ' + t('\\sqrt{' + A + '}+\\sqrt{' + B + '}') + ' defined (a real number)? Write the answer as an inequality.';
      sol = 'Both radicands must be ' + t('\\ge 0') + ': ' + t(A + '\\ge 0' + (lo === 0 ? '' : '\\Rightarrow x\\ge ' + lo)) + ' and ' + t(B + '\\ge 0\\Rightarrow x\\le ' + hi) + '. Both are true when ' + t(key) + '.';
      wr = [{ is: 'x\\ge ' + lo, code: 'u2t-def-one', hint: 'That makes the first radical defined. The second radicand ' + t(B) + ' must be ' + t('\\ge 0') + ' too.' }, { is: 'x\\le ' + hi, code: 'u2t-def-one', hint: 'That makes the second radical defined. The first radicand ' + t(A) + ' must be ' + t('\\ge 0') + ' too.' },
        { is: lo + '<x<' + hi, code: 'u2t-res-strict', hint: 'Each radicand may be ' + t(0) + ', so both ends are included.' }];
      if (lo !== -hi) wr.push({ is: '-' + hi + '\\le x\\le ' + (-lo), code: 'u2t-res-sign', hint: 'Check the signs of the boundaries.' });
    } else {
      key = lo + '<x\\le ' + hi;
      prompt = 'For what values of ' + t('x') + ' is ' + t('\\dfrac{1}{\\sqrt{' + A + '}}+\\sqrt{' + B + '}') + ' defined? Write the answer as an inequality.';
      sol = 'The radical in the denominator needs ' + t(A + '>0\\Rightarrow x>' + lo) + ' (it can’t be ' + t(0) + '), and the other needs ' + t(B + '\\ge 0\\Rightarrow x\\le ' + hi) + '. Together: ' + t(key) + '.';
      wr = [{ is: lo + '\\le x\\le ' + hi, code: 'u2t-def-den', hint: 'At ' + t('x=' + lo) + ' the denominator is ' + t('\\sqrt{0}=0') + ': you can’t divide by zero, so that end is not included.' }, { is: 'x>' + lo, code: 'u2t-def-one', hint: 'The second radicand ' + t(B) + ' must be ' + t('\\ge 0') + ' too.' }, { is: 'x\\le ' + hi, code: 'u2t-def-one', hint: 'The first radical (in the denominator) needs ' + t(A + '>0') + ' too.' }];
    }
    return RK.res(prompt, key, wr, sol, ['Each even-index radicand must be ' + t('\\ge 0') + ' (and ' + t('>0') + ' in a denominator).', 'Both conditions must be true at the same time: write one inequality with ' + t('x') + ' in the middle.'], 'where an expression is defined');
  }
  /* Q16 (L3, L5) — solve for an unknown radical expression */
  function q16(r) {
    var s = pickWhere(function () { return { a: r.pick([2, 3, 5, 6, 7, 10]), s: r.pick([2, 3, 5, 6, 7]), p: r.int(1, 5), q: r.int(1, 4), mode: r.pick(['minus', 'plus']) }; },
      function (s) { var K2 = s.mode === 'minus' ? s.p + s.q : s.p - s.q; return K2 > 0 && s.p !== s.q && (s.s === s.a || ex.simplest(s.s * s.a, 2)) && (s.p > 1 || s.q > 1) && !(s.a === 10 && s.s === 5 && s.p === 3 && s.q === 2) && !(s.a === 6 && s.s === 2 && s.p === 5); });
    var a = s.a, sv = s.s, p = s.p, q = s.q, K2 = s.mode === 'minus' ? p + q : p - q;
    var Pt = p === 1 ? sq(sv) : sq(p * p * sv), Qt = q === 1 ? sq(sv) : sq(q * q * sv);
    var eq = s.mode === 'minus' ? 'x' + sq(a) + '-' + Qt + '=' + Pt : 'x' + sq(a) + '+' + Qt + '=' + Pt;
    var S = term([K2, a], 2, sv * a);
    return RK.part('Solve ' + t(eq) + ' for ' + t('x') + '. Write ' + t('x') + ' in simplest form, with a rational denominator.', S,
      { before: t('x='), ansPre: 'x=', dl: [[term([K2, a], 2, sv), 'u2t-solve-noroot', 'You divided by ' + t(a) + ', but ' + t('x') + ' is multiplied by ' + t(sq(a)) + ': divide by ' + t(sq(a)) + ', then rationalize.'], [term([s.mode === 'minus' ? p - q : p + q, a], 2, sv * a), 'u2t-solve-sign', 'Moving ' + t((s.mode === 'minus' ? '-' : '+') + Qt) + ' to the other side changes its sign.']] },
      t('x' + sq(a) + '=' + Pt + (s.mode === 'minus' ? '+' : '-') + Qt + '=' + mixT(p, 2, sv) + (s.mode === 'minus' ? '+' : '-') + mixT(q, 2, sv) + '=' + mixT(K2, 2, sv)) + ', so ' + t('x=\\dfrac{' + mixT(K2, 2, sv) + '}{' + sq(a) + '}=' + rtex(S)) + ' (rationalize: multiply by ' + t('\\frac{' + sq(a) + '}{' + sq(a) + '}') + ' and simplify).',
      ['Isolate ' + t('x' + sq(a)) + ' as in a linear equation, simplifying and combining the radicals.', 'Divide by ' + t(sq(a)) + ', then rationalize the denominator and simplify.'], 'solve for an unknown radical expression');
  }
  /* Q17 (L6) — a rectangle from its area and width: length, then perimeter */
  function q17shared(r) {
    return pickWhere(function () { var pq = r.sample([2, 3, 5, 6, 7, 10, 11, 13, 14, 15], 2); return { two: r.chance(0.5), p: Math.max(pq[0], pq[1]), q: Math.min(pq[0], pq[1]), m: r.pick([5, 6, 7, 10, 11, 13, 14, 15, 17, 19]), k: r.int(1, 4), j: r.int(1, 6) }; },
      function (s) { var D = s.two ? s.p - s.q : s.m - s.k * s.k; return D > 0 && D <= 10 && s.j * D <= 40 && !(s.two && s.p === 7 && s.q === 3 && s.j === 6) && !(!s.two && s.m === 15 && s.k === 2 && s.j === 1) && !(!s.two && s.m === 5 && s.k === 1 && s.j === 2); });
  }
  function q17W(s) { return s.two ? add(term(1, 2, s.p), term(-1, 2, s.q)) : add(term(1, 2, s.m), term(-s.k)); }
  function q17C(s) { return s.two ? add(term(1, 2, s.p), term(1, 2, s.q)) : add(term(1, 2, s.m), term(s.k)); }
  function q17D(s) { return s.two ? s.p - s.q : s.m - s.k * s.k; }
  function q17a(r, s) {
    var D = q17D(s), A = s.j * D, W = q17W(s), C = q17C(s), L = sc(C, s.j), Wt = rtex(W);
    return RK.part('Determine the exact length of the rectangle, with a rational denominator.', L,
      { after: 'm', dl: [[sc(W, s.j), 'u2t-conj-sign', 'Multiply by the <b>conjugate</b> of the width (the opposite sign), not by the width itself.'], [sc(C, [A, s.two ? s.p + s.q : s.m + s.k * s.k]), 'u2t-conj-den-add', 'The denominator is a difference of squares: ' + t(pa(Wt) + pa(rtex(C)) + '=' + D) + '.']] },
      t('\\ell=\\dfrac{A}{w}=\\dfrac{' + A + '}{' + Wt + '}\\cdot\\dfrac{' + rtex(C) + '}{' + rtex(C) + '}=\\dfrac{' + A + pa(rtex(C)) + '}{' + D + '}=' + rtex(L)) + ' m.',
      [t('\\ell=\\dfrac{A}{w}') + '. Rationalize with the conjugate of the width.', 'The denominator becomes a difference of squares.'], 'length from the area (conjugate)');
  }
  function q17b(r, s) {
    var W = q17W(s), C = q17C(s), L = sc(C, s.j), Pm = sc(add(L, W), 2);
    return RK.part('Determine the exact perimeter of the rectangle in simplest form.', Pm,
      { dl: [[add(L, W), 'u2t-per-half', 'That is ' + t('\\ell+w') + '. The perimeter is ' + t('2(\\ell+w)') + '.'], [sc(add(C, W), 2), 'u2t-len-noconj', 'Use the length you found: ' + t('\\ell=' + rtex(L)) + '.']] },
      t('P=2(\\ell+w)=2' + pa(rtex(L) + '+' + pa(rtex(W))) + '=2' + pa(rtex(add(L, W))) + '=' + rtex(Pm)) + ' m.',
      [t('P=2(\\ell+w)') + ': add the length and the width, collect like terms, then double.'], 'perimeter with radical sides');
  }
  /* Q18 (L6) — a sum of two fractions with conjugate denominators is rational */
  function q18(r) {
    var s = pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7, 10, 11]), k: r.int(1, 4) }; }, function (s) { var D = s.m - s.k * s.k; return D !== 0 && Math.abs(D) <= 10 && !(s.m === 3 && s.k === 1); });
    var m = s.m, k = s.k, D = m - k * k, V = term([2 * (m + k * k), D]);
    var f1 = '\\dfrac{' + sq(m) + '+' + k + '}{' + sq(m) + '-' + k + '}', f2 = '\\dfrac{' + sq(m) + '-' + k + '}{' + sq(m) + '+' + k + '}';
    return RK.part('Simplify ' + t(f1 + '+' + f2) + '. (The answer is a rational number.)', V,
      { dl: [[2, 'u2t-sum-cancel', 'The fractions don’t cancel each other: rationalize each one (or use the common denominator ' + t(pa(sq(m) + '-' + k) + pa(sq(m) + '+' + k) + '=' + D) + ').'], [term([2 * m, D]), 'u2t-sq-mid', 'Each numerator is a square: ' + t('(\\sqrt{' + m + '}+' + k + ')^{2}=' + (m + k * k) + '+' + (2 * k) + '\\sqrt{' + m + '}') + '.'], [term([2 * (m + k * k), m + k * k]), 'u2t-conj-den-add', 'The common denominator is a difference of squares: ' + t(m + '-' + (k * k) + '=' + D) + '.']] },
      'Common denominator ' + t(pa(sq(m) + '-' + k) + pa(sq(m) + '+' + k) + '=' + m + '-' + (k * k) + '=' + D) + '. Numerator: ' + t(pa(sq(m) + '+' + k) + '^{2}+' + pa(sq(m) + '-' + k) + '^{2}=' + pa((m + k * k) + '+' + (2 * k) + sq(m)) + '+' + pa((m + k * k) + '-' + (2 * k) + sq(m)) + '=' + (2 * (m + k * k))) + '. The sum is ' + t('\\dfrac{' + (2 * (m + k * k)) + '}{' + D + '}=' + rtex(V)) + ', a rational number.',
      ['Rationalize each fraction with the conjugate of its denominator — both denominators become ' + t(D) + '.', 'Expand each numerator as a square, then add: the radical terms cancel.'], 'show a sum is rational');
  }
  /* Q19 (L3 + Unit 1) — an arithmetic sequence with radical terms */
  function q19shared(r) {
    return pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7]), a: r.int(-5, 12), b: r.pick([-3, -2, -1, 1, 2, 3, 4]), da: r.pick([-3, -2, -1, 1, 2, 3, 4]), db: r.pick([-3, -2, -1, 1, 2, 3]), n: r.int(8, 25) }; },
      function (s) { return s.da !== s.db && !(s.m === 2 && s.a === 3 && s.b === 1 && s.da === 2 && s.db === 3) && !(s.m === 3 && s.a === 10 && s.b === -1 && s.da === -2 && s.db === 2); });
  }
  function q19t(s, i) { return add(term(s.a + i * s.da), term(s.b + i * s.db, 2, s.m)); }
  function q19stem(s) { return 'The sequence ' + t(rtex(q19t(s, 0), { first: '1:1' }) + ',\\ ' + rtex(q19t(s, 1), { first: '1:1' }) + ',\\ ' + rtex(q19t(s, 2), { first: '1:1' }) + ',\\ \\dots') + ' is arithmetic.'; }
  function q19a(r, s) {
    var d = add(term(s.da), term(s.db, 2, s.m));
    return RK.part('Determine the common difference ' + t('d') + '.', d, { before: t('d='), ansPre: 'd=', dl: [[RK.neg(d), 'u2t-seq-sign', t('d=t_{2}-t_{1}') + ': subtract the first term from the second.'], [term(s.db, 2, s.m), 'u2t-seq-d', 'Subtract the rational parts too: ' + t('d') + ' has a rational part and a radical part.']] },
      t('d=t_{2}-t_{1}=' + pa(rtex(q19t(s, 1), { first: '1:1' })) + '-' + pa(rtex(q19t(s, 0), { first: '1:1' })) + '=' + rtex(d, { first: '1:1' })) + ' (subtract the rational parts and the radical parts separately).',
      [t('d=t_{2}-t_{1}') + '.', 'Collect the rational parts and the radical parts separately.'], 'common difference with radicals');
  }
  function q19b(r, s) {
    var n = s.n, T = q19t(s, n - 1);
    return RK.part('Determine ' + t('t_{' + n + '}') + ' in simplest form.', T, { before: t('t_{' + n + '}='), ansPre: 't_{' + n + '}=', dl: [[q19t(s, n), 'u2t-seq-n', t('t_{n}=t_{1}+(n-1)d') + ': use ' + t(n - 1) + ' differences, not ' + t(n) + '.'], [add(q19t(s, 0), sc(add(term(-s.da), term(-s.db, 2, s.m)), n - 1)), 'u2t-seq-sign', 'Check the sign of ' + t('d=t_{2}-t_{1}') + '.']] },
      t('t_{' + n + '}=t_{1}+' + (n - 1) + 'd=' + pa(rtex(q19t(s, 0), { first: '1:1' })) + '+' + (n - 1) + pa(rtex(add(term(s.da), term(s.db, 2, s.m)), { first: '1:1' })) + '=' + rtex(T, { first: '1:1' })) + '.',
      ['Use the general term ' + t('t_{n}=t_{1}+(n-1)d') + ' from Unit 1.', 'Multiply ' + t('d') + ' by ' + t(n - 1) + ', then collect the rational and the radical parts.'], 'a term of a sequence with radicals');
  }
  /* Q20 (L4, L7) — substitute a radical into a polynomial */
  function q20(r) {
    var s = pickWhere(function () { return { a: r.int(1, 5), b: r.pick([2, 3, 5, 6, 7, 10]), sg: r.chance(0.5) ? 1 : -1, nice: r.chance(0.5), p: r.pick(nz(-6, 6)), c: r.pick(nz(-9, 9)) }; },
      function (s) { return !(s.a === 2 && s.b === 3) && s.a * s.a !== s.b; });
    var a = s.a, b = s.b, sg = s.sg, X = add(term(a), term(sg, 2, b)), p = s.nice ? -2 * a : s.p, c = s.c;
    if (!s.nice && p === -2 * a) p = p + 1;
    var V = add(mul(X, X), sc(X, p), term(c)), Xt = a + (sg > 0 ? '+' : '-') + sq(b);
    var poly = 'x^{2}' + (p < 0 ? '-' : '+') + (Math.abs(p) === 1 ? '' : Math.abs(p)) + 'x' + cT(c, false);
    var X2 = mul(X, X);
    return RK.part('Determine the exact value of ' + t(poly) + ' when ' + t('x=' + Xt) + '.', V, { dl: [[add(term(a * a + b), sc(X, p), term(c)), 'u2t-sub-sq', t(pa(Xt) + '^{2}') + ' has a middle term: ' + t('2(' + a + ')(' + (sg > 0 ? '' : '-') + sq(b) + ')') + '.']] },
      t('x^{2}=' + pa(Xt) + '^{2}=' + rtex(X2, { first: '1:1' })) + ' and ' + t((p === 1 ? '' : p === -1 ? '-' : p) + 'x=' + rtex(sc(X, p), { first: '1:1' })) + '. So ' + t(poly + '=' + pa(rtex(X2, { first: '1:1' })) + '+' + pa(rtex(sc(X, p), { first: '1:1' })) + cT(c, false) + '=' + rtex(V, { first: '1:1' })) + '.',
      ['Find ' + t('x^{2}') + ' first (square the binomial: three terms).', 'Substitute, then collect the rational parts and the radical parts.'], 'substitute a radical into an expression');
  }

  var QUESTIONS = [
    { num: '1', outcome: 'AN2', lesson: 'L1', stem: 'Without a calculator, evaluate each root.', parts: [{ id: '1a', outcome: 'AN2', level: 'BEG', make: q1a }, { id: '1b', outcome: 'AN2', level: 'BEG', make: q1b }] },
    { num: '2', outcome: 'AN2', lesson: 'L1', stem: 'Mixed radicals in simplest form.', parts: [{ id: '2a', outcome: 'AN2', level: 'BEG', make: q2a }, { id: '2b', outcome: 'AN2', level: 'BEG', make: q2b }] },
    { num: '3', outcome: 'AN2', lesson: 'L1', stem: 'Entire radicals.', parts: [{ id: '3a', outcome: 'AN2', level: 'BEG', make: q3a }, { id: '3b', outcome: 'AN2', level: 'BEG', make: q3b }] },
    { num: '4', outcome: 'AN2', lesson: 'L2', stem: 'Restrictions on the variable (the values for which the radical is a real number).', parts: [{ id: '4a', outcome: 'AN2', level: 'BEG', make: q4a }, { id: '4b', outcome: 'AN2', level: 'BEG', make: q4b }] },
    { num: '5', outcome: 'AN2', lesson: 'L3', stem: 'Combine like radicals.', parts: [{ id: '5a', outcome: 'AN2', level: 'BEG', make: q5a }, { id: '5b', outcome: 'AN2', level: 'BEG', make: q5b }] },
    { num: '6', outcome: 'AN2', lesson: 'L4', stem: 'Multiply and simplify.', parts: [{ id: '6a', outcome: 'AN2', level: 'BEG', make: q6a }, { id: '6b', outcome: 'AN2', level: 'BEG', make: q6b }] },
    { num: '7', outcome: 'AN2', lesson: 'L5', stem: 'Divide; rationalize the denominator.', parts: [{ id: '7a', outcome: 'AN2', level: 'BEG', make: q7a }, { id: '7b', outcome: 'AN2', level: 'BEG', make: q7b }] },
    { num: '8', outcome: 'AN2', lesson: 'L1', stem: 'Comparing radicals.', parts: [{ id: '8', outcome: 'AN2', level: 'PRG', make: q8 }] },
    { num: '9', outcome: 'AN2', lesson: 'L2', stem: 'Radicals with variables.', parts: [{ id: '9a', outcome: 'AN2', level: 'PRG', make: q9a }, { id: '9b', outcome: 'AN2', level: 'PRG', make: q9b }, { id: '9c', outcome: 'AN2', level: 'PRG', make: q9c }] },
    { num: '10', outcome: 'AN2', lesson: 'L3', stem: 'Adding and subtracting radicals.', parts: [{ id: '10a', outcome: 'AN2', level: 'PRG', make: q10a }, { id: '10b', outcome: 'AN2', level: 'PRG', make: q10b }] },
    { num: '11', outcome: 'AN2', lesson: 'L4', stem: 'Multiplying binomials.', parts: [{ id: '11a', outcome: 'AN2', level: 'PRG', make: q11a }, { id: '11b', outcome: 'AN2', level: 'PRG', make: q11b }] },
    { num: '12', outcome: 'AN2', lesson: 'L5', stem: 'Dividing and rationalizing.', parts: [{ id: '12a', outcome: 'AN2', level: 'PRG', make: q12a }, { id: '12b', outcome: 'AN2', level: 'PRG', make: q12b }] },
    { num: '13', outcome: 'AN2', lesson: 'L6', stem: 'Binomial denominators.', parts: [{ id: '13a', outcome: 'AN2', level: 'PRG', make: q13a }, { id: '13b', outcome: 'AN2', level: 'PRG', make: q13b }] },
    { num: '14', outcome: 'AN2', lesson: 'L1, L3', stem: 'A perimeter.', parts: [{ id: '14', outcome: 'AN2', level: 'MAS', make: q14 }] },
    { num: '15', outcome: 'AN2', lesson: 'L2', stem: 'Where is it defined?', parts: [{ id: '15', outcome: 'AN2', level: 'MAS', make: q15 }] },
    { num: '16', outcome: 'AN2', lesson: 'L3, L5', stem: 'An unknown radical expression.', parts: [{ id: '16', outcome: 'AN2', level: 'MAS', make: q16 }] },
    { num: '17', outcome: 'AN2', lesson: 'L6', shared: q17shared,
      stem: function (s) { var D = q17D(s); return 'A rectangle has an area of ' + t(s.j * D) + ' m² and a width of ' + t(pa(rtex(q17W(s), { first: s.two ? '2:' + s.p : '2:' + s.m }))) + ' m.'; },
      parts: [{ id: '17a', outcome: 'AN2', level: 'MAS', make: q17a }, { id: '17b', outcome: 'AN2', level: 'MAS', make: q17b }] },
    { num: '18', outcome: 'AN2', lesson: 'L6', stem: 'A rational sum.', parts: [{ id: '18', outcome: 'AN2', level: 'MAS', make: q18 }] },
    { num: '19', outcome: 'AN2', lesson: 'L3', shared: q19shared, stem: q19stem, parts: [{ id: '19a', outcome: 'AN2', level: 'MAS', make: q19a }, { id: '19b', outcome: 'AN2', level: 'MAS', make: q19b }] },
    { num: '20', outcome: 'AN2', lesson: 'L4, L7', stem: 'Substituting a radical.', parts: [{ id: '20', outcome: 'AN2', level: 'MAS', make: q20 }] }
  ];

  HW.defineTest({
    id: 'u2test', unit: 2, title: 'Unit 2 Test', outcome: 'AN2', calc: false,
    blurb: 'The Unit 2 outcomes-based test on AN2 (radical expressions): evaluating roots, mixed and entire radicals, comparing radicals, restrictions on variables, adding, subtracting, multiplying and dividing radicals, and rationalizing monomial and binomial denominators — in Beginning, Progressing and Mastery boxes. No calculator.',
    // Short version (~half the time): mixed radicals, restrictions, multiplying and rationalizing at Beginning; ordering, adding,
    // multiplying binomials and conjugates at Progressing; solving for x and the rectangle from its area at Mastery.
    short: ['2', '4', '6', '7', '8', '10', '11', '13', '16', '17'],
    questions: QUESTIONS
  });
})(window);
