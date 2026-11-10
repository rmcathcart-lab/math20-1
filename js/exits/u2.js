/* Math 20-1 · Unit 2 (Radical Expressions) — exit slips for Lessons 1–7 (u2l1x … u2l7x), written in test mode at the end
 * of class. Outcome AN2 on every question; NO calculator (the unit is exact answers only). There are no older exit slips
 * for this course: each slip is written from Ryan's Unit 2 booklet (m201book/unit2/u2_lXX.tex and u2_epXX.tex), 3–4 short
 * questions (5–8 minutes): Beginning = the lesson's first-taught skill, Progressing = the typical assignment question,
 * Mastery = one of the lesson's harder assignment / extra-practice items. New numbers every time (the booklet's own
 * example and assignment items are left out of the pools where they would come up often).
 *   2.1  √n → mixed (BEG) · mixed → entire, negative coefficient (PRG) · ∛ / ∜ → mixed (PRG) · order 5 radicals (MAS, L1 #10–12)
 *   2.2  restriction of √(ax+b) or an odd root (BEG) · simplest form with variables (PRG) · mixed → entire with a variable
 *        (PRG) · largest / smallest integer allowed by a restriction (MAS, L2 #17, a denominator version from Ex 2d)
 *   2.3  like radicals (BEG) · simplify first, then combine (PRG) · cube / fourth roots (PRG) · width from a perimeter or the
 *        third side of a triangle (MAS, L3 Ex 9, #10b, EP03 #10)
 *   2.4  (a√p)(b√q) (BEG) · two binomials (PRG) · the square of a binomial (PRG) · the diagonal of a (√m+k)×(√m−k)
 *        rectangle (MAS, L4 #11)
 *   2.5  a quotient of radicals (BEG) · a/(m√b) or √(p/q) (PRG) · a cube-root denominator (PRG) · a two-term numerator over
 *        a radical (MAS, L5 #6, #9c)
 *   2.6  a binomial times its conjugate (BEG) · k/(a ± √b) or k/(√p ± √q) (PRG) · a binomial over a binomial (PRG) · a sum or
 *        difference of two fractions with conjugate denominators (MAS, L6 #12, EP06 #8)
 *   2.7  (review) simplest form (BEG) · adding radicals with a variable (PRG) · two-radical binomials (PRG) · rationalizing a
 *        binomial over a binomial (MAS, L7 #10d, EP07 C2b)
 * Answers are typed. Radical answers are checked for value (exact, compared numerically) and form by the Unit 2 kit below
 * (simplest radicals, no radical in a denominator, no fraction under a radical, like terms combined, reduced fraction,
 * positive denominator); any equivalent simplest form is accepted (one fraction over a common denominator, or a fraction
 * per term). Monomial radicals use K.radical / K.varRadical (js/kitx.js; variables checked by evaluation at positive values),
 * restrictions use K.set (js/relfn.js: an inequality, set notation, an interval, x ∈ ℝ, "all real numbers" or
 * "no restriction"), the ordering uses the order widget. Every part has `bad` answers with u2x- codes and partial-credit
 * decisions (below); a right value in the wrong form is a format nudge (counted like a small mistake in test mode). */
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
    'u2x-root-sq': 'Took out a perfect square under a cube/fourth root', 'u2x-ent-evenneg': 'Put a negative inside an even root', 'u2x-ent-square': 'Squared the coefficient for a cube root',
    'u2x-res-sign': 'Restriction: sign slip moving the constant', 'u2x-res-dir': 'Restriction: inequality sign the wrong way', 'u2x-res-strict': 'Restriction: used > instead of ≥',
    'u2x-res-odd': 'Gave a restriction for an odd index', 'u2x-res-noflip': 'Restriction: did not reverse the sign dividing by a negative',
    'u2x-var-coef': 'Left the perfect square/cube outside instead of its root', 'u2x-ent-nosq': 'Entire radical: coefficient not raised to the index', 'u2x-ent-exp': 'Entire radical: variable power not raised to the index',
    'u2x-int-round': 'Took the integer on the wrong side of the boundary', 'u2x-int-notint': 'Gave the boundary, not an integer', 'u2x-int-sign': 'Sign slip in the boundary', 'u2x-int-den': 'Allowed a zero denominator',
    'u2x-like-sign': 'Sign slip combining like radicals', 'u2x-add-rad': 'Added the radicands', 'u2x-add-coef': 'Multiplied by the perfect square, not its root', 'u2x-cube-neg': 'Lost the sign of a negative cube root',
    'u2x-per-half': 'Subtracted the length from the whole perimeter', 'u2x-per-2w': 'Gave both widths together (did not halve)', 'u2x-per-bracket': 'Did not subtract every term of a side',
    'u2x-mul-addcoef': 'Added the coefficients instead of multiplying', 'u2x-mul-addrad': 'Added the radicands instead of multiplying',
    'u2x-foil-sq': 'Treated √m·√m as 1 (not m)', 'u2x-foil-mid': 'Left out the middle (outer and inner) terms', 'u2x-sq-mid': 'Squared each term: no middle term',
    'u2x-sq-half': 'Middle term not doubled', 'u2x-sq-coef': 'Did not square the coefficient of the radical', 'u2x-diag-noroot': 'Gave d² (no square root)',
    'u2x-diag-area': 'Gave the area instead of the diagonal', 'u2x-diag-sides': 'Added the sides instead of using Pythagoras', 'u2x-div-coef': 'Divided the radicands but not the coefficients',
    'u2x-rat-top': 'Rationalizing: numerator not multiplied', 'u2x-rat-den': 'Rationalizing: multiplied by the whole denominator', 'u2x-frac-root': 'Took the root of only the numerator',
    'u2x-cube-sq': 'Cube-root denominator: multiplier does not make a perfect cube', 'u2x-one-term': 'Divided or multiplied only one term of the numerator',
    'u2x-conj-coef': 'Conjugates: coefficient not squared', 'u2x-conj-add': 'Conjugates: added the squares', 'u2x-conj-sign': 'Multiplied by the denominator itself, not its conjugate',
    'u2x-conj-den-add': 'Conjugates: denominator a² + b instead of a² − b', 'u2x-frac-add': 'Added fractions by adding numerators and denominators'
  });
  HW.addPartial({
    'u2x-root-sq': 'b', 'u2x-ent-evenneg': 's', 'u2x-ent-square': 'b', 'u2x-res-sign': 's', 'u2x-res-dir': 'b', 'u2x-res-strict': 's', 'u2x-res-odd': 'n', 'u2x-res-noflip': 'b',
    'u2x-var-coef': 'b', 'u2x-ent-nosq': 'b', 'u2x-ent-exp': 'b', 'u2x-int-round': 'b', 'u2x-int-notint': 'b', 'u2x-int-sign': 's', 'u2x-int-den': 'b',
    'u2x-like-sign': 's', 'u2x-add-rad': 'n', 'u2x-add-coef': 'b', 'u2x-cube-neg': 's', 'u2x-per-half': 'b', 'u2x-per-2w': 's', 'u2x-per-bracket': 's',
    'u2x-mul-addcoef': 'n', 'u2x-mul-addrad': 'n', 'u2x-foil-sq': 'b', 'u2x-foil-mid': 'b', 'u2x-sq-mid': 'n', 'u2x-sq-half': 'b', 'u2x-sq-coef': 's',
    'u2x-diag-noroot': 'b', 'u2x-diag-area': 'n', 'u2x-diag-sides': 'n', 'u2x-div-coef': 's', 'u2x-rat-top': 'b', 'u2x-rat-den': 's', 'u2x-frac-root': 'b',
    'u2x-cube-sq': 'b', 'u2x-one-term': 'b', 'u2x-conj-coef': 's', 'u2x-conj-add': 'n', 'u2x-conj-sign': 'n', 'u2x-conj-den-add': 'b', 'u2x-frac-add': 'n'
  });

  /* ================= small helpers ================= */
  function range(a, b) { var o = []; for (var i = a; i <= b; i++) o.push(i); return o; }
  function nz(a, b) { return range(a, b).filter(function (x) { return x !== 0; }); }
  function pickWhere(gen, okf) { for (var i = 0; i < 5000; i++) { var o = gen(); if (o != null && okf(o)) return o; } throw new Error('u2 exits: no valid numbers'); }
  function Q(num, level, stem, make) { return { num: String(num), outcome: 'AN2', stem: stem, parts: [{ id: String(num), outcome: 'AN2', level: level, make: make }] }; }
  var radT = RK.radT, mixT = RK.mixT, cT = RK.cT, coefT = RK.coefT, term = RK.term, add = RK.add, mul = RK.mul, sc = RK.scale, rtex = RK.tex;
  function sq(m) { return '\\sqrt{' + (typeof m === 'number' ? F(m) : m) + '}'; }
  function cb(m) { return '\\sqrt[3]{' + (typeof m === 'number' ? F(m) : m) + '}'; }
  function pa(s) { return '\\left(' + s + '\\right)'; }
  function rat(p, q) { return ex.texRat(ex.norm(p, q || 1)); }
  function varsT(o) { return Object.keys(o).sort().map(function (v) { return o[v] === 0 ? '' : o[v] === 1 ? v : v + '^{' + o[v] + '}'; }).join(''); }
  function bin(a, b) { return a + (String(b).charAt(0) === '-' ? '' : '+') + b; }
  var SQ7 = [2, 3, 5, 6, 7, 10, 11], CF = [2, 3, 4, 5, 6, 7, 9, 10];
  var HMIX = ['Find the <b>largest</b> perfect square (cube, fourth power, …) that divides the radicand: ' + t('4,\\ 9,\\ 16,\\ 25,\\ 36,\\ 49,\\ 64,\\ 81,\\ 100,\\ \\dots') + ' or ' + t('8,\\ 27,\\ 64,\\ 125,\\ 216,\\ \\dots'),
    'Split the root and take that factor out as its root: ' + t('\\sqrt{a^{2}b}=a\\sqrt{b}') + '.'];

  /* =====================================================================================================
   * Lesson 1 — Mixed and entire radicals
   * ===================================================================================================== */
  var AVOID1 = [8, 12, 18, 20, 27, 28, 32, 45, 48, 50, 63, 72, 75, 98, 108, 120, 150, 175, 180, 200, 242, 252, 288, 300, 363, 500];
  function l1q1(r) {
    var s = pickWhere(function () { return { k: r.int(2, 9), m: r.pick([2, 3, 5, 6, 7, 10, 11, 13, 14, 15]) }; }, function (s) { var N = s.k * s.k * s.m; return N >= 24 && N <= 600 && AVOID1.indexOf(N) < 0; });
    var k = s.k, m = s.m, N = k * k * m;
    var p = P.radical('Write ' + t(sq(N)) + ' as a mixed radical in simplest form.', { k: k, n: 2, m: m }, 'mixed',
      t(sq(N) + '=' + sq(k * k + '\\times ' + m) + '=' + sq(k * k) + '\\times' + sq(m) + '=' + mixT(k, 2, m)) + '. ' + t(F(k * k)) + ' is the largest perfect square that divides ' + t(F(N)) + ', and ' + t(m) + ' has no perfect-square factor left.',
      HMIX, 'square root to a mixed radical');
    p.bad = [F(k * k) + sq(m), F(m) + sq(k * k)];
    return p;
  }
  function l1q2(r) {
    var kind = r.pick(['cube', 'cube', 'sq', 'four']), c, m, n, AV;
    if (kind === 'cube') { n = 3; AV = ['5,2', '3,4', '2,9', '2,5', '2,7', '4,2', '2,15']; }
    else if (kind === 'sq') { n = 2; AV = ['2,11', '4,5', '6,3', '5,2']; }
    else { n = 4; AV = ['2,5', '2,3', '3,2']; }
    var s = pickWhere(function () { return kind === 'cube' ? { c: r.int(2, 5), m: r.pick([2, 3, 4, 5, 6, 7, 9, 10, 11]) } : kind === 'sq' ? { c: r.int(2, 9), m: r.pick(SQ7) } : { c: r.int(2, 3), m: r.pick([2, 3, 5, 6, 7]) }; },
      function (s) { var EM = Math.pow(s.c, n) * s.m; return AV.indexOf(s.c + ',' + s.m) < 0 && EM <= 1000; });
    c = s.c; m = s.m;
    var k = kind === 'four' ? c : -c, EM = Math.pow(c, n) * m, cn = Math.pow(c, n);
    var shown = mixT(k, n, m), sol;
    if (kind === 'cube') sol = t(shown + '=' + '\\sqrt[3]{(-' + c + ')^{3}\\times ' + m + '}=' + '\\sqrt[3]{(-' + cn + ')\\times ' + m + '}=\\sqrt[3]{-' + F(EM) + '}') + '. For an <b>odd</b> index the negative sign can go inside.';
    else if (kind === 'sq') sol = t(shown + '=-\\left(' + c + sq(m) + '\\right)=-\\sqrt{' + c + '^{2}\\times ' + m + '}=-\\sqrt{' + cn + '\\times ' + m + '}=-' + sq(EM)) + '. For an <b>even</b> index the negative sign stays outside: ' + t(sq(EM)) + ' is never negative.';
    else sol = t(shown + '=\\sqrt[4]{' + c + '^{4}\\times ' + m + '}=\\sqrt[4]{' + cn + '\\times ' + m + '}=\\sqrt[4]{' + F(EM) + '}') + '.';
    var p = P.radical('Write ' + t(shown) + ' as an entire radical.', { k: k, n: n, m: m }, 'entire', sol,
      ['Raise the number in front to the power of the index (' + (n === 2 ? 'square' : n === 3 ? 'cube' : 'fourth power') + ' it), then multiply it into the radicand: ' + t('a\\sqrt[n]{b}=\\sqrt[n]{a^{n}b}') + '.', n === 3 ? 'A negative number in front can go inside a cube root: ' + t('(-' + c + ')^{3}=-' + cn) + '.' : n === 2 ? 'A negative in front of a square root stays outside.' : 'Use ' + t(c + '^{4}=' + cn) + '.'],
      'mixed to entire radical', { diag: function (v, rr) {
        if (!isFinite(v) && n % 2 === 0) return { code: 'u2x-ent-evenneg', hint: 'An even root of a negative number is not a real number. Keep the negative sign <b>outside</b> the square root.' };
        if (n === 3 && rr && rr.n === 3 && rr.m === c * c * m && Math.abs(rr.k[0]) === 1) return { code: 'u2x-ent-square', hint: 'For a <b>cube</b> root, the number in front is <b>cubed</b> before it goes inside: ' + t(c + '^{3}=' + cn) + '.' };
        return null;
      } });
    p.bad = kind === 'cube' ? [cb(EM), cb(-c * m), cb(-c * c * m)] : kind === 'sq' ? [sq(EM), '-' + sq(c * m)] : ['\\sqrt[4]{' + (c * m) + '}', '\\sqrt[4]{' + (c * c * m) + '}'];
    if (kind === 'sq') p.bad.push(sq(-EM));
    return p;
  }
  function l1q3(r) {
    var four = r.chance(0.25), n = four ? 4 : 3;
    var AV = [16, 24, 40, 54, 56, 81, 108, 128, 135, 192, 250, 375, 432, 686, 2662, 4000, 32, 48, 80, 162, 1250, 1280];
    var s = pickWhere(function () { return four ? { k: r.int(2, 3), m: r.pick([2, 3, 5, 6, 7]), neg: false } : { k: r.int(2, 6), m: r.pick(CF), neg: r.chance(0.6) }; },
      function (s) { var N = Math.pow(s.k, n) * s.m; return N <= 2000 && AV.indexOf(N) < 0; });
    var k = s.k, m = s.m, N = Math.pow(s.k, n) * m, kn = Math.pow(k, n), sg = s.neg ? -1 : 1;
    var R = '\\sqrt[' + n + ']{' + (s.neg ? '-' : '') + F(N) + '}';
    var sqf = ex.nthFactor(N, 2), bad = [];
    if (sqf > 1 && N % (sqf * sqf) === 0) bad.push((sg < 0 ? '-' : '') + sqf + '\\sqrt[' + n + ']{' + F(N / (sqf * sqf)) + '}');
    if (s.neg) { bad.push(k + '\\sqrt[' + n + ']{' + m + '}'); bad.push(String(-kn) + cb(m)); }
    else bad.push(kn + '\\sqrt[' + n + ']{' + m + '}');
    var p = P.radical('Write ' + t(R) + ' as a mixed radical in simplest form.', { k: sg * k, n: n, m: m }, 'mixed',
      t(R + '=\\sqrt[' + n + ']{' + (s.neg ? '-' : '') + kn + '\\times ' + m + '}=\\sqrt[' + n + ']{' + (s.neg ? '-' : '') + kn + '}\\times\\sqrt[' + n + ']{' + m + '}=' + mixT(sg * k, n, m)) + '. ' + t(F(kn) + '=' + k + '^{' + n + '}') + ' is the largest perfect ' + (n === 3 ? 'cube' : 'fourth power') + ' that divides ' + t(F(N)) + '.' + (s.neg ? ' The cube root of a negative number is negative.' : ''),
      ['For a ' + (n === 3 ? 'cube' : 'fourth') + ' root you need a perfect <b>' + (n === 3 ? 'cube' : 'fourth power') + '</b> factor: ' + (n === 3 ? t('8,\\ 27,\\ 64,\\ 125,\\ 216') : t('16,\\ 81,\\ 256')) + '.', n === 3 ? t('\\sqrt[3]{-x}=-\\sqrt[3]{x}') + ': the sign comes out in front.' : 'Take its fourth root out in front.'],
      (n === 3 ? 'cube' : 'fourth') + ' root to a mixed radical', { diag: function (v, rr) {
        if (rr && rr.n === n && Math.abs(rr.k[0]) > 1 && rr.k[1] === 1 && rr.k[0] * rr.k[0] * rr.m === N && !RK.isPow(rr.k[0] * rr.k[0], n)) return { code: 'u2x-root-sq', hint: t(F(rr.k[0] * rr.k[0])) + ' is a perfect <b>square</b>, but this is a ' + (n === 3 ? 'cube' : 'fourth') + ' root: you need a perfect ' + (n === 3 ? 'cube' : 'fourth power') + ' factor.' };
        return null;
      } });
    p.bad = bad;
    return p;
  }
  function l1q4(r) {
    var cube = r.chance(0.3), items, sol, first, last;
    if (!cube) {
      items = pickWhere(function () {
        var lo = r.int(40, 95), hi = lo + r.int(24, 34), cand = [];
        [2, 3, 4, 5, 6, 7].forEach(function (c) { RK.SQF.forEach(function (m) { var N = c * c * m; if (N >= lo && N <= hi) cand.push({ c: c, m: m, N: N }); }); });
        cand = r.shuffle(cand); var pick = [], used = {};
        cand.forEach(function (x) { if (pick.length < 4 && !used[x.N]) { used[x.N] = 1; pick.push(x); } });
        if (pick.length < 4) return null;
        var extra = range(lo, hi).filter(function (N) { return !used[N] && (RK.isPow(N, 2) || ex.simplest(N, 2)); });
        if (!extra.length) return null;
        var e = r.pick(extra); pick.push({ c: 1, m: e, N: e });
        return pick;
      }, function (x) { return true; });
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
    var up = r.chance(0.5);
    items.sort(function (a, b) { return up ? a.N - b.N : b.N - a.N; });
    first = up ? 'least' : 'greatest'; last = up ? 'greatest' : 'least';
    var its = items.map(function (x, i) { return { id: 'i' + i, tex: x.tex }; });
    sol = 'Write each as an entire radical with the same index: ' + items.map(function (x) { return t(x.tex + (x.tex === x.ent ? '' : '=' + x.ent)); }).join(', ') + '. The larger radicand gives the larger number' + (cube ? ' (this works for negative cube roots too)' : '') + '. ' + (up ? 'Least to greatest' : 'Greatest to least') + ': ' + its.map(function (x) { return t(x.tex); }).join(', ') + '.';
    return P.order(r, 'Without a calculator, arrange the numbers from <b>' + first + '</b> to <b>' + last + '</b>.', its, { first: first, last: last }, sol,
      ['Write each number as an entire radical: ' + (cube ? t('a\\sqrt[3]{b}=\\sqrt[3]{a^{3}b}') + ' (a negative in front goes inside).' : t('a\\sqrt{b}=\\sqrt{a^{2}b}') + ', and a whole number ' + t('n=\\sqrt{n^{2}}') + '.'), 'Then compare the radicands: the larger radicand is the larger number.'], 'order radicals without a calculator');
  }
  HW.defineExit({ lesson: 'u2l1', calc: false, outcome: 'AN2',
    blurb: 'Mixed and entire radicals: a square root and a cube (or fourth) root in simplest mixed form, a mixed radical as an entire radical, and ordering radicals without a calculator.',
    questions: [Q(1, 'BEG', 'Simplest form.', l1q1), Q(2, 'PRG', 'An entire radical.', l1q2), Q(3, 'PRG', 'A cube or fourth root.', l1q3), Q(4, 'MAS', 'Ordering radicals.', l1q4)] });

  /* =====================================================================================================
   * Lesson 2 — Radicals with variables and their restrictions
   * ===================================================================================================== */
  function linT(a, b, v) { v = v || 'x'; return (a === 1 ? '' : a === -1 ? '-' : a) + v + (b < 0 ? '-' + Math.abs(b) : '+' + b); }
  function l2q1(r) {
    var odd = r.chance(0.3), AV = ['1,5', '1,-8', '3,-12', '2,5', '1,-2', '4,12', '3,6', '2,10', '1,6', '2,1', '1,-6', '4,-10'];
    var s = pickWhere(function () { return { a: r.int(1, 5), b: r.pick(nz(-12, 12)) }; }, function (s) { return AV.indexOf(s.a + ',' + s.b) < 0 && (s.a === 1 || s.b % s.a !== 0 || r.chance(0.4)); });
    var a = s.a, b = s.b, rad = linT(a, b), bd = rat(-b, a), bdW = rat(b, a);
    if (odd) {
      var nn = r.pick([3, 3, 5]), R = '\\sqrt[' + nn + ']{' + rad + '}';
      return RK.res('State the restriction on the variable in ' + t(R) + '.', 'x\\in\\mathbb{R}',
        [{ is: 'x\\ge ' + bd, code: 'u2x-res-odd', hint: 'Look at the index: it is ' + t(nn) + ', an <b>odd</b> number. An odd root of a negative number is a real number, so there is no restriction.' }],
        'The index ' + t(nn) + ' is odd. Every real number has exactly one ' + (nn === 3 ? 'cube' : 'fifth') + ' root, so the radicand can be any real number: ' + t('x\\in\\mathbb{R}') + ' (no restriction).',
        ['Only an <b>even</b> index (square root, fourth root, …) needs the radicand to be ' + t('\\ge 0') + '.', 'For an odd index, write ' + t('x\\in\\mathbb{R}') + '.'], 'restriction: odd index');
    }
    var key = 'x\\ge ' + bd, step = a === 1 ? '' : '\\Rightarrow ' + a + 'x\\ge ' + (-b) + '\\Rightarrow ';
    return RK.res('State the restriction on the variable in ' + t('\\sqrt{' + rad + '}') + '.', key,
      [{ is: 'x\\ge ' + bdW, code: 'u2x-res-sign', hint: 'Solve ' + t(rad + '\\ge 0') + ' carefully: moving ' + t((b < 0 ? '-' : '+') + Math.abs(b)) + ' to the other side changes its sign.' },
        { is: 'x\\le ' + bd, code: 'u2x-res-dir', hint: 'You divided by ' + t(a) + ', a <b>positive</b> number, so the inequality sign does not change: the radicand must be ' + t('\\ge 0') + '.' },
        { is: 'x>' + bd, code: 'u2x-res-strict', hint: 'The radicand can equal ' + t(0) + ' (' + t('\\sqrt{0}=0') + '), so the boundary is included: use ' + t('\\ge') + '.' }],
      'Square root (even index): the radicand must be ' + t('\\ge 0') + '. ' + t(rad + '\\ge 0' + (a === 1 ? '\\Rightarrow ' : step) + key) + '.',
      ['An even root needs radicand ' + t('\\ge 0') + ': solve ' + t(rad + '\\ge 0') + '.', 'Move the constant, then divide by the coefficient of ' + t('x') + '.'], 'restriction: square root');
  }
  function l2q2(r) {
    var cube = r.chance(0.35), c, m, N, ex1, ex2, target, outs, ins, R, n = cube ? 3 : 2, neg = false, v1 = cube ? 'a' : 'x', v2 = cube ? 'b' : 'y';
    var s = pickWhere(function () {
      return cube ? { c: r.int(2, 5), m: r.pick([2, 3, 4, 5, 6, 7, 9]), e1: r.int(4, 11), e2: r.chance(0.4) ? r.int(1, 8) : 0, neg: r.chance(0.6) }
        : { c: r.int(2, 6), m: r.pick([2, 3, 5, 6, 7, 10]), e1: r.int(2, 9), e2: r.chance(0.6) ? r.int(1, 9) : 0, neg: false };
    }, function (s) { var N0 = Math.pow(s.c, n) * s.m; return N0 <= (cube ? 700 : 300) && (s.e1 % n !== 0 || s.e2 % n !== 0) && Math.floor(s.e1 / n) > 0 && [18, 45, 72, 98, 20, 27, 150, 48, 54, 40, 16, 250, 81, 162, 63, 32, 125, 24, 500, 128].indexOf(N0) < 0; });
    c = s.c; m = s.m; N = Math.pow(c, n) * m; ex1 = s.e1; ex2 = s.e2; neg = s.neg;
    var vin = {}, vout = {}, vall = {}; vall[v1] = ex1; if (ex2) vall[v2] = ex2;
    vout[v1] = Math.floor(ex1 / n); vin[v1] = ex1 % n; if (ex2) { vout[v2] = Math.floor(ex2 / n); vin[v2] = ex2 % n; }
    outs = varsT(vout); ins = varsT(vin);
    target = (neg ? '-' : '') + c + outs + '\\sqrt' + (n === 3 ? '[3]' : '') + '{' + m + ins + '}';
    R = '\\sqrt' + (n === 3 ? '[3]' : '') + '{' + (neg ? '-' : '') + N + varsT(vall) + '}';
    var vlist = ex2 ? [v1, v2] : [v1], negT = (neg ? '' : '-') + c + outs + '\\sqrt' + (n === 3 ? '[3]' : '') + '{' + m + ins + '}';
    var chk = K.varRadical(target, 'mixed', { diag: function (rr, ast) {
      if (rr && rr.n === n && Math.abs(rr.k[0]) === Math.pow(c, n) && rr.rad.m === m) return { code: 'u2x-var-coef', hint: t(F(Math.pow(c, n))) + ' comes out of the radical as its ' + (n === 2 ? 'square' : 'cube') + ' root, ' + t(c) + '.' };
      var tp = ex.parse(negT); if (tp.ok && ex.equiv(ast, tp.ast, vlist)) return { code: 'sign', hint: 'Check the sign: ' + t('\\sqrt[3]{-x}=-\\sqrt[3]{x}') + '.' };
      return null;
    } });
    var bo = {}; Object.keys(vout).forEach(function (k) { bo[k] = vout[k] * n; });
    var p = P.math('Write ' + t(R) + ' in simplest form.' + (cube ? '' : ' Assume ' + t(vlist.join(',\\ ') + '\\ge 0') + '.'), chk, target,
      t(R + '=\\sqrt' + (n === 3 ? '[3]' : '') + '{' + (neg ? '-' : '') + Math.pow(c, n) + varsT(bo) + '}\\cdot\\sqrt' + (n === 3 ? '[3]' : '') + '{' + m + ins + '}=' + target) + '. Divide each exponent by the index ' + t(n) + ': the quotient goes outside, the remainder stays inside.' + (cube ? ' (A cube root needs no restriction.)' : ''),
      ['Simplify the number and each variable separately. ' + t(F(N) + '=' + Math.pow(c, n) + '\\times ' + m) + '.', 'For ' + t('\\sqrt' + (n === 3 ? '[3]' : '') + '{' + v1 + '^{' + ex1 + '}}') + ': ' + t(ex1 + '\\div ' + n + '=' + Math.floor(ex1 / n)) + ' remainder ' + t(ex1 % n) + '.'],
      'simplify a radical with variables', { keys: 'var' });
    var b1 = {}; Object.keys(vout).forEach(function (k) { b1[k] = vout[k] * n; });
    p.bad = [(neg ? '-' : '') + Math.pow(c, n) + outs + '\\sqrt' + (n === 3 ? '[3]' : '') + '{' + m + ins + '}'];
    if (cube && neg) p.bad.push(negT);
    return p;
  }
  function l2q3(r) {
    var kind = r.pick(['sq', 'sq', 'neg', 'cube']), v = r.pick(['x', 'a']), n = kind === 'cube' ? 3 : 2;
    var s = pickWhere(function () { return { c: r.int(2, kind === 'cube' ? 4 : 6), m: r.pick(kind === 'cube' ? [2, 3, 4, 5, 6] : [2, 3, 5, 6, 7]), p: r.int(1, 3), q: r.int(0, n - 1), sg: kind === 'cube' && r.chance(0.6) ? -1 : 1 }; },
      function (s) { return Math.pow(s.c, n) * s.m <= 400 && ['4,1,1,1', '2,3,2,1', '3,1,1,2', '5,1,1,1', '2,5,1,1'].indexOf(s.c + ',' + s.m + ',' + s.p + ',' + s.q) < 0; });
    var c = s.c, m = s.m, p = s.p, q = s.q, sg = kind === 'neg' ? -1 : s.sg, EM = Math.pow(c, n) * m, E = n * p + q;
    var vo = {}; vo[v] = p; var vi = {}; vi[v] = q; var ve = {}; ve[v] = E;
    var shown = (sg < 0 ? '-' : '') + c + varsT(vo) + '\\sqrt' + (n === 3 ? '[3]' : '') + '{' + m + varsT(vi) + '}';
    var target = n === 2 ? (sg < 0 ? '-' : '') + '\\sqrt{' + EM + varsT(ve) + '}' : '\\sqrt[3]{' + (sg < 0 ? '-' : '') + EM + varsT(ve) + '}';
    var chk = K.varRadical(target, 'entire', { diag: function (rr, ast) {
      if (rr && rr.n === n && rr.rad.m === c * m) return { code: 'u2x-ent-nosq', hint: 'Raise the number in front to the power ' + t(n) + ' before it goes inside: ' + t(c + '^{' + n + '}=' + Math.pow(c, n)) + '.' };
      if (rr && rr.n === n && rr.rad.vars[v] === p + q) return { code: 'u2x-ent-exp', hint: 'Raise ' + t(v + (p > 1 ? '^{' + p + '}' : '')) + ' to the power ' + t(n) + ' too: ' + t('(' + v + (p > 1 ? '^{' + p + '}' : '') + ')^{' + n + '}=' + v + '^{' + (n * p) + '}') + '.' };
      return null;
    } });
    var vp = {}; vp[v] = n * p;
    var pt = P.math('Write ' + t(shown) + ' as an entire radical.' + (n === 2 ? ' Assume ' + t(v + '\\ge 0') + '.' : ''), chk, target,
      t(shown + '=' + (n === 2 && sg < 0 ? '-' : '') + '\\sqrt' + (n === 3 ? '[3]' : '') + '{(' + (n === 3 && sg < 0 ? '-' : '') + c + varsT(vo) + ')^{' + n + '}\\cdot ' + m + varsT(vi) + '}=' + (n === 2 && sg < 0 ? '-' : '') + '\\sqrt' + (n === 3 ? '[3]' : '') + '{' + (n === 3 && sg < 0 ? '-' : '') + Math.pow(c, n) + varsT(vp) + '\\cdot ' + m + varsT(vi) + '}=' + target) + '.' + (n === 2 && sg < 0 ? ' The index is even, so the negative sign stays outside.' : ''),
      ['Raise everything in front (the number and the variable) to the power of the index, then multiply it into the radicand.', 'Powers: ' + t('(' + v + '^{a})^{' + n + '}=' + v + '^{' + n + 'a}') + ', then add exponents: ' + t(v + '^{a}\\cdot ' + v + '^{b}=' + v + '^{a+b}') + '.'],
      'mixed to entire with variables', { keys: 'var' });
    var bvE = {}; bvE[v] = p + q; var bvE2 = {}; bvE2[v] = E;
    pt.bad = [(n === 2 && sg < 0 ? '-' : '') + '\\sqrt' + (n === 3 ? '[3]' : '') + '{' + (n === 3 && sg < 0 ? '-' : '') + (c * m) + varsT(bvE2) + '}', (n === 2 && sg < 0 ? '-' : '') + '\\sqrt' + (n === 3 ? '[3]' : '') + '{' + (n === 3 && sg < 0 ? '-' : '') + EM + varsT(bvE) + '}'];
    return pt;
  }
  function l2q4(r) {
    var kind = r.pick(['max', 'max', 'min', 'den']), a, c, ans, prompt, sol, diag, hints;
    if (kind === 'max') {
      var s = pickWhere(function () { return { a: r.int(2, 7), c: r.int(5, 70) }; }, function (s) { return s.c % s.a !== 0 && !(s.a === 4 && s.c === 50); });
      a = s.a; c = s.c; ans = Math.floor(c / a);
      prompt = 'What is the <b>largest integer</b> value of ' + t('x') + ' for which ' + t('\\sqrt{' + c + '-' + a + 'x}') + ' is defined (a real number)?';
      sol = t(c + '-' + a + 'x\\ge 0\\Rightarrow -' + a + 'x\\ge -' + c + '\\Rightarrow x\\le \\frac{' + c + '}{' + a + '}') + ' (dividing by ' + t(-a) + ' reverses the sign). ' + t('\\frac{' + c + '}{' + a + '}') + ' is between ' + t(ans) + ' and ' + t(ans + 1) + ', so the largest integer is ' + t(ans) + '.';
      diag = function (v) { if (v === ans + 1) return { code: 'u2x-int-round', hint: 'Check: at ' + t('x=' + (ans + 1)) + ' the radicand is ' + t(c - a * (ans + 1)) + ', which is negative.' }; if (Math.abs(v - c / a) < 1e-9) return { code: 'u2x-int-notint', hint: 'That is the boundary, ' + t('\\frac{' + c + '}{' + a + '}') + ', but the question asks for an <b>integer</b>.' }; if (v === -ans || v === -ans - 1) return { code: 'u2x-int-sign', hint: 'Check the sign of the boundary: solve ' + t(c + '-' + a + 'x\\ge 0') + ' again.' }; return null; };
      hints = ['Set the radicand ' + t('\\ge 0') + ' and solve. Dividing by a negative reverses the inequality sign.', 'Then find the largest integer that fits.'];
    } else if (kind === 'min') {
      var s2 = pickWhere(function () { return { a: r.int(2, 7), c: r.int(5, 60) }; }, function (s) { return s.c % s.a !== 0; });
      a = s2.a; c = s2.c; ans = Math.ceil(-c / a);
      prompt = 'What is the <b>smallest integer</b> value of ' + t('x') + ' for which ' + t('\\sqrt{' + a + 'x+' + c + '}') + ' is defined (a real number)?';
      sol = t(a + 'x+' + c + '\\ge 0\\Rightarrow ' + a + 'x\\ge -' + c + '\\Rightarrow x\\ge -\\frac{' + c + '}{' + a + '}') + ', and ' + t('-\\frac{' + c + '}{' + a + '}') + ' is between ' + t(ans - 1) + ' and ' + t(ans) + '. The smallest integer is ' + t(ans) + '.';
      diag = function (v) { if (v === ans - 1) return { code: 'u2x-int-round', hint: 'Check: at ' + t('x=' + (ans - 1)) + ' the radicand is ' + t(a * (ans - 1) + c) + ', which is negative.' }; if (Math.abs(v + c / a) < 1e-9) return { code: 'u2x-int-notint', hint: 'That is the boundary, but the question asks for an <b>integer</b>.' }; if (v === -ans || v === -ans + 1) return { code: 'u2x-int-sign', hint: 'Check the sign of the boundary: moving ' + t('+' + c) + ' across makes it ' + t(-c) + '.' }; return null; };
      hints = ['Set the radicand ' + t('\\ge 0') + ' and solve for ' + t('x') + '.', 'The boundary is a fraction: which integers are on the allowed side of it?'];
    } else {
      var s3 = pickWhere(function () { return { a: r.int(2, 5), b: r.int(1, 6), k: r.int(2, 9) }; }, function () { return true; });
      a = s3.a; c = a * s3.b; ans = s3.b + 1;
      prompt = 'What is the <b>smallest integer</b> value of ' + t('x') + ' for which ' + t('\\dfrac{' + s3.k + '}{\\sqrt{' + a + 'x-' + c + '}}') + ' is defined?';
      sol = 'The radicand must be ' + t('\\ge 0') + ' and, because the radical is in a denominator, it cannot be ' + t(0) + ': ' + t(a + 'x-' + c + '>0\\Rightarrow ' + a + 'x>' + c + '\\Rightarrow x>' + s3.b) + '. The smallest integer is ' + t(ans) + '.';
      diag = function (v) { if (v === s3.b) return { code: 'u2x-int-den', hint: 'At ' + t('x=' + s3.b) + ' the denominator is ' + t('\\sqrt{0}=0') + ', and you can’t divide by zero.' }; if (v === -s3.b || v === -s3.b + 1) return { code: 'u2x-int-sign', hint: 'Check the sign of the boundary.' }; return null; };
      hints = ['A radical in a denominator needs a radicand ' + t('>0') + ' (not just ' + t('\\ge 0') + ').', 'Solve the inequality, then pick the smallest integer that works.'];
    }
    var pt = P.number(prompt, ans, diag, sol, hints, 'integer values allowed by a restriction');
    pt.bad = kind === 'den' ? [String(c / a)] : kind === 'max' ? [String(ans + 1)] : [String(ans - 1)];
    return pt;
  }
  HW.defineExit({ lesson: 'u2l2', calc: false, outcome: 'AN2',
    blurb: 'Radicals with variables: the restriction on the variable, a variable radical in simplest form, a mixed radical with variables as an entire radical, and the largest or smallest integer a restriction allows.',
    questions: [Q(1, 'BEG', 'The restriction.', l2q1), Q(2, 'PRG', 'Simplest form.', l2q2), Q(3, 'PRG', 'An entire radical.', l2q3), Q(4, 'MAS', 'Integer values.', l2q4)] });

  /* =====================================================================================================
   * Lesson 3 — Adding and subtracting radicals
   * ===================================================================================================== */
  var HADD = ['Only <b>like radicals</b> (same index and same radicand) combine: add or subtract their coefficients and keep the radical.', 'Never add the radicands: ' + t('\\sqrt{a}+\\sqrt{b}\\ne\\sqrt{a+b}') + '.'];
  function l3q1(r) {
    var ratK = r.chance(0.35);
    var s = pickWhere(function () {
      var pq = r.sample([2, 3, 5, 6, 7, 10, 11, 13, 15], 2);
      return { p: pq[0], q: pq[1], a: r.int(2, 9), b: r.pick(nz(-9, 9)), c: r.pick(nz(-9, 9)), d: r.pick(nz(-9, 9)) };
    }, function (s) { return s.a + s.c !== 0 && s.b + s.d !== 0 && s.a + s.c !== 1 || (s.a + s.c !== 0 && s.b + s.d !== 0 && r.chance(0.3)); });
    var p = s.p, q = s.q, a = s.a, b = s.b, c = s.c, d = s.d, shown, S, sol, dl;
    if (!ratK) {
      shown = cT(a, true, sq(p)) + cT(b, false, sq(q)) + cT(c, false, sq(p)) + cT(d, false, sq(q));
      S = add(term(a + c, 2, p), term(b + d, 2, q));
      sol = 'Group the like radicals: ' + t(pa(cT(a, true) + cT(c, false)) + sq(p) + '+' + pa(cT(b, true) + cT(d, false)) + sq(q) + '=' + rtex(S)) + '. ' + t(sq(p)) + ' and ' + t(sq(q)) + ' are not like radicals, so they stay as two terms.';
      dl = [[add(term(a + c, 2, p), term(b - d, 2, q)), 'u2x-like-sign', 'Check the sign in front of each term as you collect it.']];
      if (a + b + c + d > 0) dl.push([term(a + b + c + d, 2, p + q), 'u2x-add-rad', HADD[1] + ' Combine only the terms with the same radicand.']);
    } else {
      var e = r.int(2, 15), f = r.pick(nz(-12, 12));
      shown = e + cT(b, false, sq(p)) + cT(f, false) + cT(d, false, sq(p));
      S = add(term(e + f), term(b + d, 2, p));
      sol = 'Rational terms: ' + t(e + cT(f, false) + '=' + (e + f)) + '. Radicals: ' + t(cT(b, true, sq(p)) + cT(d, false, sq(p)) + '=' + rtex(term(b + d, 2, p))) + '. Answer: ' + t(rtex(S)) + '.';
      dl = [[term(e + f + b + d, 2, p), 'u2x-add-rad', 'A rational number and a radical are not like terms: combine the numbers with the numbers and the radicals with the radicals.'], [add(term(e - f), term(b + d, 2, p)), 'u2x-like-sign', 'Check the sign in front of each number.']];
    }
    return RK.part('Simplify ' + t(shown) + '.', S, { dl: dl }, sol, HADD, 'combine like radicals');
  }
  function l3q2(r) {
    var three = r.chance(0.55);
    var s = pickWhere(function () { var m = r.pick([2, 3, 5, 6, 7, 10, 11]); var ks = r.sample([1, 2, 3, 4, 5, 6, 7], three ? 3 : 2); return { m: m, ks: ks, cs: three ? [r.int(1, 3), r.pick([-3, -2, -1, 1, 2, 3]), r.pick([-2, -1, 1, 2])] : [r.int(1, 3), r.pick([-3, -2, -1, 1, 2, 3])] }; },
      function (s) { var tot = 0, ok2 = true; s.ks.forEach(function (k, i) { tot += s.cs[i] * k; if (k * k * s.m > 300) ok2 = false; }); return ok2 && tot !== 0 && s.ks.filter(function (k) { return k > 1; }).length >= 2; });
    var m = s.m, tot = 0, written = '', step = '', wrongC = 0, sumN = 0;
    s.ks.forEach(function (k, i) { var c = s.cs[i], N = k * k * m; tot += c * k; wrongC += c * k * k; sumN += c * N; written += cT(c, i === 0, sq(N)); step += (i ? (c < 0 ? '-' : '+') : (c < 0 ? '-' : '')) + (Math.abs(c) === 1 ? '' : Math.abs(c)) + (Math.abs(c) === 1 ? mixT(k, 2, m) : pa(mixT(k, 2, m))); });
    var S = term(tot, 2, m), dl = [[term(wrongC, 2, m), 'u2x-add-coef', 'Each perfect square comes out as its <b>root</b>: ' + t('\\sqrt{' + (s.ks[1] * s.ks[1]) + '}=' + s.ks[1]) + ', not ' + t(s.ks[1] * s.ks[1]) + '.']];
    if (sumN > 0) dl.push([term(1, 2, sumN), 'u2x-add-rad', HADD[1] + ' Simplify each radical first, then combine.']);
    return RK.part('Simplify ' + t(written) + '.' + (three ? '' : ' Write the answer as a single radical.'), S, { dl: dl },
      'Simplify each radical first: ' + t(written + '=' + step + '=' + rtex(S)) + '. All the terms became like radicals.',
      ['Write each radical as a mixed radical in simplest form first.', 'Then the terms are like radicals: add and subtract the coefficients.'], 'simplify, then combine');
  }
  function l3q3(r) {
    var four = r.chance(0.25), n = four ? 4 : 3;
    var s = pickWhere(function () { var ks = r.sample(four ? [1, 2, 3] : [1, 2, 3, 4, 5], 2); return { m: r.pick(four ? [2, 3, 5] : [2, 3, 4, 5, 6]), ks: ks, cs: [r.int(1, 3), r.pick([-2, -1, 1, 2, 3])], neg: !four && r.chance(0.5) ? r.int(0, 1) : -1 }; },
      function (s) { var tot = 0, ok2 = true; s.ks.forEach(function (k, i) { tot += s.cs[i] * k * (i === s.neg ? -1 : 1); if (Math.pow(k, n) * s.m > 700) ok2 = false; }); return ok2 && tot !== 0 && (s.ks[0] > 1 || s.ks[1] > 1); });
    var m = s.m, tot = 0, lost = 0, written = '', step = '';
    s.ks.forEach(function (k, i) {
      var c = s.cs[i], N = Math.pow(k, n) * m, sg = i === s.neg ? -1 : 1;
      tot += c * k * sg; lost += c * k;
      written += cT(c, i === 0, '\\sqrt[' + n + ']{' + (sg < 0 ? '-' : '') + F(N) + '}');
      step += (i ? (c * sg < 0 ? '-' : '+') : (c * sg < 0 ? '-' : '')) + (Math.abs(c) === 1 ? '' : Math.abs(c) + '\\cdot ') + mixT(k, n, m);
    });
    var S = term(tot, n, m), dl = [];
    if (s.neg >= 0 && lost !== tot && lost !== 0) dl.push([term(lost, n, m), 'u2x-cube-neg', 'The cube root of a negative number is negative: ' + t('\\sqrt[3]{-x}=-\\sqrt[3]{x}') + '.']);
    return RK.part('Simplify ' + t(written) + '.', S, { dl: dl },
      t(written + '=' + step + '=' + rtex(S)) + '. Each radicand has a perfect ' + (n === 3 ? 'cube' : 'fourth-power') + ' factor; once it is taken out, the terms are like radicals.',
      ['Look for perfect ' + (n === 3 ? 'cubes ' + t('8,\\ 27,\\ 64,\\ 125') : 'fourth powers ' + t('16,\\ 81,\\ 256')) + ' in each radicand.', 'Then add or subtract the coefficients of the like radicals.'], 'add and subtract ' + (n === 3 ? 'cube' : 'fourth') + ' roots');
  }
  function l3q4(r) {
    var tri = r.chance(0.45), pq = r.sample([2, 3, 5, 6, 7], 2), p = pq[0], q = pq[1], S, prompt, sol, dl, hints;
    function rS(k, m) { return k === 1 ? sq(m) : sq(k * k * m); }
    if (!tri) {
      var w1 = r.int(1, 5), w2 = r.int(1, 5), l1 = r.int(2, 8), l2 = r.int(2, 5);
      var L = add(term(l1, 2, p), term(l2, 2, q)), W = add(term(w1, 2, p), term(w2, 2, q)), Pm = sc(add(L, W), 2);
      S = W;
      prompt = 'A rectangle has a perimeter of ' + t(rtex(Pm)) + ' m and a length of ' + t(mixT(l1, 2, p) + '+' + rS(l2, q)) + ' m. Determine its width in simplest form.';
      sol = 'Length: ' + t(mixT(l1, 2, p) + '+' + rS(l2, q) + '=' + rtex(L)) + '. Length ' + t('+') + ' width ' + t('=\\frac{1}{2}P=' + rtex(sc(Pm, [1, 2])) + '') + '. Width ' + t('=' + rtex(sc(Pm, [1, 2])) + '-' + pa(rtex(L)) + '=' + rtex(W)) + ' m.';
      dl = [[RK.sub(Pm, L), 'u2x-per-half', 'The perimeter has <b>two</b> lengths and two widths. Halve the perimeter first (length + width), then subtract the length.'], [sc(W, 2), 'u2x-per-2w', 'That is both widths together: divide by ' + t(2) + '.']];
      hints = ['Simplify the length first: ' + t(rS(l2, q) + '=' + mixT(l2, 2, q)) + '.', t('P=2(\\ell+w)') + ', so ' + t('\\ell+w=\\frac{P}{2}') + '.'];
    } else {
      var x1 = r.int(1, 5), x2 = r.int(1, 4), a1 = r.int(2, 5), b1 = r.int(1, 4), b2 = r.int(2, 4);
      var X = add(term(x1, 2, p), term(x2, 2, q)), s1 = term(a1, 2, p), s2 = add(term(b2, 2, q), term(b1, 2, p)), Pm = add(X, s1, s2);
      S = X;
      prompt = 'A triangle has a perimeter of ' + t(rtex(Pm)) + ' cm. Two of its sides are ' + t(sq(a1 * a1 * p)) + ' cm and ' + t(pa(rS(b2, q) + '+' + rS(b1, p))) + ' cm. Determine the length of the third side in simplest form.';
      sol = 'Known sides: ' + t(sq(a1 * a1 * p) + '=' + mixT(a1, 2, p)) + ' and ' + t(rS(b2, q) + '+' + rS(b1, p) + '=' + rtex(s2)) + '. Third side ' + t('=' + rtex(Pm) + '-' + mixT(a1, 2, p) + '-' + pa(rtex(s2)) + '=' + rtex(X)) + ' cm.';
      dl = [[add(RK.sub(Pm, s1), term(-b2, 2, q), term(b1, 2, p)), 'u2x-per-bracket', 'Put brackets around a side with two terms before you subtract it: subtract <b>both</b> of its terms.']];
      hints = ['Simplify each side first.', 'Third side = perimeter − (the other two sides). Use brackets.'];
    }
    return RK.part(prompt, S, { dl: dl }, sol, hints, tri ? 'missing side from a perimeter' : 'width from a perimeter');
  }
  HW.defineExit({ lesson: 'u2l3', calc: false, outcome: 'AN2',
    blurb: 'Adding and subtracting radicals: like radicals, simplifying first so like radicals appear, cube (or fourth) roots, and a missing side from a perimeter.',
    questions: [Q(1, 'BEG', 'Like radicals.', l3q1), Q(2, 'PRG', 'Simplify first.', l3q2), Q(3, 'PRG', 'Cube roots.', l3q3), Q(4, 'MAS', 'A missing side.', l3q4)] });

  /* =====================================================================================================
   * Lesson 4 — Multiplying radicals
   * ===================================================================================================== */
  function l4q1(r) {
    var cube = r.chance(0.25), n = cube ? 3 : 2, s;
    if (!cube) s = pickWhere(function () { return { g: r.pick([2, 3, 5, 6, 7]), u: r.pick([1, 2, 3, 5, 7]), v: r.pick([1, 2, 3, 5, 7]), a: r.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]), b: r.int(2, 6) }; },
      function (s) { return s.u !== s.v && s.g * s.u <= 35 && s.g * s.v <= 35 && ex.simplest(s.u * s.v, 2) && !(s.g * s.u === 2 && s.g * s.v === 14) && !(s.g * s.u === 6 && s.g * s.v === 15); });
    else s = pickWhere(function () { return { g: r.pick([2, 3]), u: r.pick([1, 2, 3, 5]), v: r.pick([1, 2, 3, 5]), a: r.pick([-4, -3, -2, 2, 3, 4]), b: r.int(1, 4) }; },
      function (s) { return s.u !== s.v && ex.simplest(s.u * s.v, 3) && s.g * s.g * s.v <= 50; });
    var A = s.g * s.u, B = cube ? s.g * s.g * s.v : s.g * s.v, a = s.a, b = s.b;
    var S = mul(term(a, n, A), term(b, n, B));
    var shown = pa(mixT(a, n, A)) + pa(mixT(b, n, B));
    var dl = [[term((a + b) * s.g, n, s.u * s.v), 'u2x-mul-addcoef', 'Multiply the coefficients: ' + t(a + '\\times ' + b + '=' + (a * b)) + '.']];
    if (!cube) dl.push([term(a * b, 2, A + B), 'u2x-mul-addrad', 'Multiply the radicands too: ' + t(sq(A) + '\\cdot ' + sq(B) + '=' + sq(A + '\\cdot ' + B)) + '.']);
    return RK.part('Multiply and simplify ' + t(shown) + '.', S, { dl: dl },
      t(shown + '=' + (a * b) + '\\sqrt' + (cube ? '[3]' : '') + '{' + A + '\\cdot ' + B + '}=' + mixT(a * b, n, A * B) + '=' + rtex(S)) + '. Multiply the coefficients, multiply the radicands, then simplify.',
      ['Multiply coefficient by coefficient and radicand by radicand: ' + t('m\\sqrt[n]{a}\\cdot k\\sqrt[n]{b}=mk\\sqrt[n]{ab}') + '.', 'Then write the radical in simplest form.'], 'multiply radicals');
  }
  /* (a + b√m)(c + d√m) or (a√p + b√q)(c√p + d√q) */
  function foil(r, kind) {
    var S, shown, sol, dl;
    if (kind === 'one') {
      var s = pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7]), a: r.int(1, 6), b: r.pick([-4, -3, -2, -1, 1, 2, 3, 4]), c: r.pick(nz(-6, 6)), d: r.pick([-4, -3, -2, -1, 1, 2, 3, 4]) }; },
        function (s) { return s.a * s.d + s.b * s.c !== 0 && !(s.a === 3 && s.c === 5) && !(s.a === 2 && s.c === 4) && s.a * s.c + s.b * s.d * s.m !== 0; });
      var m = s.m, a = s.a, b = s.b, c = s.c, d = s.d;
      S = mul(add(term(a), term(b, 2, m)), add(term(c), term(d, 2, m)));
      shown = pa(a + cT(b, false, sq(m))) + pa(c + cT(d, false, sq(m)));
      sol = t(shown + '=' + (a * c) + cT(a * d, false, sq(m)) + cT(b * c, false, sq(m)) + cT(b * d, false) + pa(sq(m)) + '^{2}=' + (a * c) + cT(a * d + b * c, false, sq(m)) + cT(b * d * m, false) + '=' + rtex(S)) + '.';
      dl = [[add(term(a * c + b * d), term(a * d + b * c, 2, m)), 'u2x-foil-sq', t(sq(m) + '\\cdot' + sq(m) + '=' + m) + ', so the last product is ' + t((b * d) + '\\times ' + m) + '.'], [term(a * c + b * d * m), 'u2x-foil-mid', 'Multiply <b>each</b> term by each term (FOIL): you are missing the outer and inner products.']];
    } else {
      var s2 = pickWhere(function () { var pr = r.pick([[2, 3], [2, 5], [3, 5], [2, 7], [3, 7], [5, 7], [5, 6], [3, 10], [2, 11]]); return { p: pr[0], q: pr[1], a: r.int(1, 4), b: r.pick([-3, -2, -1, 1, 2, 3]), c: r.int(1, 4), d: r.pick([-3, -2, -1, 1, 2, 3]) }; },
        function (s) { return s.a * s.d + s.b * s.c !== 0 && (s.a > 1 || s.b * s.b > 1 || s.c > 1 || s.d * s.d > 1) && s.a * s.c * s.p + s.b * s.d * s.q !== 0; });
      var p = s2.p, q = s2.q, a2 = s2.a, b2 = s2.b, c2 = s2.c, d2 = s2.d;
      if (r.chance(0.5)) { var tm = p; p = q; q = tm; }
      S = mul(add(term(a2, 2, p), term(b2, 2, q)), add(term(c2, 2, p), term(d2, 2, q)));
      shown = pa(mixT(a2, 2, p) + cT(b2, false, sq(q))) + pa(mixT(c2, 2, p) + cT(d2, false, sq(q)));
      sol = t(shown + '=' + (a2 * c2) + '(' + p + ')' + cT(a2 * d2, false, sq(p * q)) + cT(b2 * c2, false, sq(p * q)) + cT(b2 * d2, false) + '(' + q + ')=' + rtex(S)) + '. (' + t(sq(p) + '\\cdot' + sq(p) + '=' + p) + ' and ' + t(sq(p) + '\\cdot' + sq(q) + '=' + sq(p * q)) + '.)';
      dl = [[add(term(a2 * c2 + b2 * d2), term(a2 * d2 + b2 * c2, 2, p * q)), 'u2x-foil-sq', t(sq(p) + '\\cdot' + sq(p) + '=' + p) + ', not ' + t(1) + '.'], [term(a2 * c2 * p + b2 * d2 * q), 'u2x-foil-mid', 'Multiply <b>each</b> term by each term (FOIL): you are missing the outer and inner products.']];
    }
    return { S: S, shown: shown, sol: sol, dl: dl };
  }
  var HFOIL = ['Multiply each term of the first bracket by each term of the second (FOIL).', t('\\sqrt{a}\\cdot\\sqrt{a}=a') + ' and ' + t('\\sqrt{a}\\cdot\\sqrt{b}=\\sqrt{ab}') + '. Then collect like terms.'];
  function l4q2(r) { var f = foil(r, r.chance(0.5) ? 'one' : 'two'); return RK.part('Expand and simplify ' + t(f.shown) + '.', f.S, { dl: f.dl }, f.sol, HFOIL, 'multiply two binomials'); }
  function l4q3(r) {
    var two = r.chance(0.4), S, shown, sol, dl, s;
    if (!two) {
      s = pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7, 10]), a: r.int(1, 4), b: r.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]), lead: r.chance(0.5) }; }, function (s) { return !(s.m === 7 && s.a === 1 && s.b === -2) && !(s.m === 5 && s.a === 2 && s.b === 3); });
      var m = s.m, a = s.a, b = s.b, A = term(a, 2, m), Bt = term(b), X = add(A, Bt);
      S = mul(X, X);
      shown = pa(s.lead ? b + cT(a, false, sq(m)) : mixT(a, 2, m) + cT(b, false)) + '^{2}';
      sol = t(shown + '=' + pa(mixT(a, 2, m)) + '^{2}' + cT(2 * a * b, false) + sq(m) + '+' + pa(b) + '^{2}=' + (a * a * m) + cT(2 * a * b, false, sq(m)) + '+' + (b * b) + '=' + rtex(S)) + '.';
      dl = [[term(a * a * m + b * b), 'u2x-sq-mid', 'Squaring a binomial gives <b>three</b> terms: ' + t('(x+y)^{2}=x^{2}+2xy+y^{2}') + '. You are missing the middle term.'], [add(term(a * a * m + b * b), term(a * b, 2, m)), 'u2x-sq-half', 'The middle term is <b>twice</b> the product: ' + t('2xy') + '.']];
      if (a > 1) dl.push([add(term(a * m + b * b), term(2 * a * b, 2, m)), 'u2x-sq-coef', 'Square the coefficient too: ' + t(pa(mixT(a, 2, m)) + '^{2}=' + a + '^{2}\\cdot ' + m + '=' + (a * a * m)) + '.']);
    } else {
      s = pickWhere(function () { var pr = r.pick([[2, 3], [2, 5], [3, 5], [2, 7], [5, 7], [3, 7], [2, 3]]); return { p: pr[0], q: pr[1], a: r.int(1, 4), b: r.pick([-3, -2, -1, 1, 2, 3]) }; }, function (s) { return s.a > 1 || s.b * s.b > 1; });
      var p = s.p, q = s.q, a2 = s.a, b2 = s.b, Y = add(term(a2, 2, p), term(b2, 2, q));
      S = mul(Y, Y);
      shown = pa(mixT(a2, 2, p) + cT(b2, false, sq(q))) + '^{2}';
      sol = t(shown + '=' + (a2 * a2 * p) + cT(2 * a2 * b2, false, sq(p * q)) + '+' + (b2 * b2 * q) + '=' + rtex(S)) + ' (square the first term, twice the product, square the last term).';
      dl = [[term(a2 * a2 * p + b2 * b2 * q), 'u2x-sq-mid', 'Squaring a binomial gives <b>three</b> terms: you are missing the middle term ' + t('2xy') + '.'], [add(term(a2 * a2 * p + b2 * b2 * q), term(a2 * b2, 2, p * q)), 'u2x-sq-half', 'The middle term is <b>twice</b> the product.']];
    }
    return RK.part('Expand and simplify ' + t(shown) + '.', S, { dl: dl }, sol, ['Write the square as a product of two equal brackets, or use ' + t('(x+y)^{2}=x^{2}+2xy+y^{2}') + '.', 'Never ' + t('(x+y)^{2}=x^{2}+y^{2}') + '.'], 'square a binomial');
  }
  function l4q4(r) {
    var s = pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7, 10, 11, 13, 14, 15]), k: r.int(1, 4) }; }, function (s) { return s.m > s.k * s.k && !(s.m === 3 && s.k === 1); });
    var m = s.m, k = s.k, D2 = 2 * m + 2 * k * k, S = term(1, 2, D2);
    var Lt = sq(m) + '+' + k, Wt = sq(m) + '-' + k;
    return RK.part('A rectangle measures ' + t(pa(Lt)) + ' cm by ' + t(pa(Wt)) + ' cm. Determine the exact length of its diagonal in simplest form.', S,
      { dl: [[D2, 'u2x-diag-noroot', 'That is ' + t('d^{2}') + '. Take the square root to find ' + t('d') + '.'], [m - k * k, 'u2x-diag-area', 'That is the area (length × width). The diagonal comes from the Pythagorean theorem: ' + t('d^{2}=\\ell^{2}+w^{2}') + '.'], [term(2, 2, m), 'u2x-diag-sides', 'Adding the sides doesn’t give the diagonal: use ' + t('d^{2}=\\ell^{2}+w^{2}') + '.']], after: 'cm' },
      t('d^{2}=' + pa(Lt) + '^{2}+' + pa(Wt) + '^{2}=' + pa((m + k * k) + '+' + (2 * k) + sq(m)) + '+' + pa((m + k * k) + '-' + (2 * k) + sq(m)) + '=' + D2) + ', so ' + t('d=' + sq(D2) + (RK.tex(S) === sq(D2) ? '' : '=' + rtex(S))) + ' cm. (The middle terms cancel.)',
      ['Pythagorean theorem: ' + t('d^{2}=\\ell^{2}+w^{2}') + '.', 'Square each binomial (three terms each), add, then take the square root and simplify.'], 'diagonal of a rectangle with radical sides');
  }
  HW.defineExit({ lesson: 'u2l4', calc: false, outcome: 'AN2',
    blurb: 'Multiplying radicals: two mixed radicals, two binomials (FOIL), the square of a binomial, and the diagonal of a rectangle with conjugate sides.',
    questions: [Q(1, 'BEG', 'Multiply.', l4q1), Q(2, 'PRG', 'Two binomials.', l4q2), Q(3, 'PRG', 'A square.', l4q3), Q(4, 'MAS', 'The diagonal.', l4q4)] });

  /* =====================================================================================================
   * Lesson 5 — Dividing radicals and rationalizing monomial denominators
   * ===================================================================================================== */
  function l5q1(r) {
    var cube = r.chance(0.25), n = cube ? 3 : 2;
    var s = pickWhere(function () { return { q: r.pick(cube ? [2, 3, 5] : [2, 3, 5, 6, 7]), N: r.pick(cube ? [2, 3, 4, 5, 16, 24, 9] : [2, 3, 5, 6, 7, 10, 11, 8, 12, 18, 20, 27, 50]), B: r.int(1, 6), c: r.pick([-5, -4, -3, -2, 2, 3, 4, 5, 1]) }; },
      function (s) { return s.N !== s.q && !RK.isPow(s.N * s.q, n) && s.N * s.q <= (cube ? 120 : 200) && !(s.q === 3 && s.N === 16 && !cube) && !(s.q === 6 && s.N === 7) && !(s.q === 3 && s.N === 18); });
    var q = s.q, N = s.N, B = s.B, c = s.c, A = B * c, S = term(c, n, N);
    var shown = '\\dfrac{' + mixT(A, n, N * q) + '}{' + mixT(B, n, q) + '}';
    var dl = []; if (B > 1) dl.push([term(A, n, N), 'u2x-div-coef', 'Divide the coefficients too: ' + t(A + '\\div ' + B + '=' + c) + '.']);
    return RK.part('Divide and simplify ' + t(shown) + '.', S, { dl: dl },
      t(shown + '=' + (B === 1 ? '' : '\\frac{' + A + '}{' + B + '}') + '\\sqrt' + (cube ? '[3]' : '') + '{\\frac{' + (N * q) + '}{' + q + '}}=' + mixT(c, n, N) + (rtex(S) === mixT(c, n, N) ? '' : '=' + rtex(S))) + '. Divide the coefficients, divide the radicands, then simplify.',
      ['Same index: ' + t('\\dfrac{m\\sqrt[n]{a}}{k\\sqrt[n]{b}}=\\dfrac{m}{k}\\sqrt[n]{\\dfrac{a}{b}}') + '.', 'Check whether the result can still be simplified.'], 'divide radicals');
  }
  function l5q2(r) {
    var fr = r.chance(0.4), S, shown, sol, dl, hints;
    if (!fr) {
      var s = pickWhere(function () { return { b: r.pick([2, 3, 5, 6, 7, 10, 11]), m: r.pick([1, 1, 2, 3, 4]), a: r.pick(nz(-20, 20)) }; },
        function (s) { return s.a % (s.m * s.b) !== 0 && !(s.a === 5 && s.b === 3 && s.m === 1) && !(s.a === 15 && s.b === 3 && s.m === 2) && !(s.a === -9 && s.b === 6 && s.m === 2) && !(s.a === 14 && s.b === 7 && s.m === 3); });
      var a = s.a, b = s.b, m = s.m;
      S = term([a, m * b], 2, b);
      shown = '\\dfrac{' + a + '}{' + mixT(m, 2, b) + '}';
      sol = t(shown + '\\cdot\\dfrac{' + sq(b) + '}{' + sq(b) + '}=\\dfrac{' + (a === 1 ? '' : a === -1 ? '-' : a) + sq(b) + '}{' + (m === 1 ? '' : m + '(') + b + (m === 1 ? '' : ')') + '}=' + rtex(S)) + '. Multiply by ' + t(sq(b)) + ' only (not by ' + t(mixT(m, 2, b)) + '), then reduce.';
      dl = [[term([a, m * b]), 'u2x-rat-top', 'Multiply the <b>numerator</b> by ' + t(sq(b)) + ' too, so you multiply by ' + t('\\frac{' + sq(b) + '}{' + sq(b) + '}=1') + '.']];
      if (m > 1) dl.push([term([a, m * m * b], 2, b), 'u2x-rat-den', 'Multiply only by ' + t(sq(b)) + ': ' + t(mixT(m, 2, b) + '\\cdot' + sq(b) + '=' + (m * b)) + '.']);
      hints = ['Multiply the numerator and the denominator by ' + t(sq(b)) + ': ' + t(sq(b) + '\\cdot' + sq(b) + '=' + b) + '.', 'Then reduce the fraction if you can.'];
    } else {
      var s2 = pickWhere(function () { return { p: r.pick([1, 2, 3, 5, 7]), q: r.pick([3, 5, 6, 7, 8, 10, 12, 18, 20, 27, 50]) }; }, function (s) { return s.p !== s.q && ex.gcd(s.p, s.q) === 1 && !(s.p === 5 && s.q === 12) && !(s.p === 2 && s.q === 3) && !(s.p === 5 && s.q === 8); });
      var p = s2.p, q2 = s2.q;
      S = term([1, q2], 2, p * q2);
      shown = '\\sqrt{\\dfrac{' + p + '}{' + q2 + '}}';
      var qs = RK.split(q2, 2);
      sol = t(shown + '=\\dfrac{' + sq(p) + '}{' + sq(q2) + '}' + (qs[0] > 1 ? '=\\dfrac{' + sq(p) + '}{' + mixT(qs[0], 2, qs[1]) + '}' : '') + '\\cdot\\dfrac{' + sq(qs[1]) + '}{' + sq(qs[1]) + '}=' + rtex(S)) + '. No fraction may stay under the radical, and no radical in the denominator.';
      dl = [[term([1, q2], 2, p), 'u2x-frac-root', 'The square root applies to the denominator too: ' + t(shown + '=\\dfrac{' + sq(p) + '}{' + sq(q2) + '}') + '.']];
      hints = ['Split the root: ' + t('\\sqrt{\\dfrac{a}{b}}=\\dfrac{\\sqrt{a}}{\\sqrt{b}}') + '.', 'Simplify ' + t(sq(q2)) + ' if you can, then rationalize the denominator.'];
    }
    return RK.part('Simplify ' + t(shown) + '. Write it with a rational denominator.', S, { dl: dl }, sol, hints, fr ? 'fraction under a radical' : 'rationalize a monomial denominator');
  }
  function l5q3(r) {
    var fr = r.chance(0.25), S, shown, sol, dl, mult;
    if (!fr) {
      var s = pickWhere(function () { return { b: r.pick([2, 3, 4, 5, 9, 25, 6]), a: r.int(1, 15) }; }, function (s) { return !(s.a === 4 && s.b === 3) && !(s.a === 10 && s.b === 25) && !(s.a === 12 && s.b === 4) && !(s.a === 6 && s.b === 3) && !(s.a === 2 && s.b === 5) && !(s.a === 5 && s.b === 9) && !(s.a === 9 && s.b === 3); });
      var a = s.a, b = s.b; mult = { 2: 4, 3: 9, 4: 2, 5: 25, 9: 3, 25: 5, 6: 36 }[b]; var cr = Math.round(Math.cbrt(b * mult));
      S = term([a, b], 3, b * b);
      shown = '\\dfrac{' + a + '}{' + cb(b) + '}';
      sol = t(b + '\\times ' + mult + '=' + (b * mult) + '=' + cr + '^{3}') + ', so multiply by ' + t(cb(mult)) + ': ' + t(shown + '\\cdot\\dfrac{' + cb(mult) + '}{' + cb(mult) + '}=\\dfrac{' + (a === 1 ? '' : a) + cb(mult) + '}{' + cb(b * mult) + '}=\\dfrac{' + (a === 1 ? '' : a) + cb(mult) + '}{' + cr + '}=' + rtex(S)) + '.';
      dl = [[term([a, b], 3, b), 'u2x-cube-sq', 'Multiplying by ' + t(cb(b)) + ' gives ' + t(cb(b * b)) + ' in the denominator, which is not a whole number. Multiply by the cube root that makes the radicand a perfect <b>cube</b>.']];
    } else {
      var s2 = pickWhere(function () { return { p: r.pick([1, 2, 3, 5]), q: r.pick([2, 3, 4, 9, 5]) }; }, function (s) { return s.p !== s.q && ex.gcd(s.p, s.q) === 1 && !(s.p === 3 && s.q === 4) && !(s.p === 2 && s.q === 3); });
      var p = s2.p, q = s2.q; mult = { 2: 4, 3: 9, 4: 2, 9: 3, 5: 25 }[q]; var cr2 = Math.round(Math.cbrt(q * mult));
      S = term([1, cr2], 3, p * mult);
      shown = '\\sqrt[3]{\\dfrac{' + p + '}{' + q + '}}';
      sol = t(shown + '=\\dfrac{' + cb(p) + '}{' + cb(q) + '}\\cdot\\dfrac{' + cb(mult) + '}{' + cb(mult) + '}=\\dfrac{' + cb(p * mult) + '}{' + cb(q * mult) + '}=' + rtex(S)) + ' (' + t(q + '\\times ' + mult + '=' + cr2 + '^{3}') + ').';
      dl = [[term([1, q], 3, p * q), 'u2x-cube-sq', 'Multiplying by ' + t(cb(q)) + ' gives ' + t(cb(q * q)) + ' in the denominator, which is not a whole number. You need a perfect <b>cube</b> under the root in the denominator.']];
    }
    return RK.part('Rationalize the denominator and simplify ' + t(shown) + '.', S, { dl: dl }, sol,
      ['Ask: what times the radicand in the denominator makes a perfect <b>cube</b> (' + t('8,\\ 27,\\ 64,\\ 125,\\ 216') + ')?', 'Multiply the numerator and the denominator by that cube root.'], 'rationalize a cube-root denominator');
  }
  function l5q4(r) {
    var neat = r.chance(0.6), S, shown, sol, dl;
    if (neat) {
      var s = pickWhere(function () { return { x: r.int(1, 4), y: r.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]), e: r.pick([2, 3, 5, 6, 7]), d: r.int(1, 3) }; },
        function (s) { var Y = s.y * s.d; return Y * Y * s.e <= 300 && Math.abs(Y) > 1 && !(s.x === 2 && s.y === -2 && s.e === 3 && s.d === 2); });
      var x = s.x, y = s.y, e = s.e, d = s.d, Y = y * d;
      S = add(term(x, 2, e), term(y));
      shown = '\\dfrac{' + (x * d * e) + (Y < 0 ? '-' : '+') + sq(Y * Y * e) + '}{' + mixT(d, 2, e) + '}';
      sol = 'Simplify the numerator: ' + t(sq(Y * Y * e) + '=' + mixT(Math.abs(Y), 2, e)) + '. Rationalize: ' + t('\\dfrac{(' + (x * d * e) + cT(Y, false, sq(e)) + ')' + sq(e) + '}{' + (d === 1 ? '' : d + '(') + e + (d === 1 ? '' : ')') + '}=\\dfrac{' + (x * d * e) + sq(e) + cT(Y * e, false) + '}{' + (d * e) + '}=' + rtex(S)) + ' (' + t(d * e) + ' divides every term).';
      dl = [[add(term(x, 2, e), term(Y, 2, e)), 'u2x-one-term', 'Divide <b>every</b> term of the numerator by the denominator (or multiply every term by ' + t(sq(e)) + ').']];
    } else {
      var s2 = pickWhere(function () { return { A: r.int(1, 12), B: r.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]), e: r.pick([2, 3, 5, 7]) }; }, function (s) { return s.A % s.e !== 0 && !(s.A === 5 && s.B === 1 && s.e === 3); });
      var A = s2.A, B = s2.B, e2 = s2.e;
      S = add(term([A, e2], 2, e2), term(B));
      shown = '\\dfrac{' + A + cT(B, false, sq(e2)) + '}{' + sq(e2) + '}';
      sol = t(shown + '\\cdot\\dfrac{' + sq(e2) + '}{' + sq(e2) + '}=\\dfrac{' + (A === 1 ? '' : A) + sq(e2) + cT(B * e2, false) + '}{' + e2 + '}=' + rtex(S)) + '. Every term of the numerator is multiplied by ' + t(sq(e2)) + '.';
      dl = [[add(term([A, e2], 2, e2), term([B, e2])), 'u2x-one-term', 'Multiply <b>every</b> term of the numerator by ' + t(sq(e2)) + ': ' + t(cT(B, true, sq(e2)) + '\\cdot' + sq(e2) + '=' + (B * e2)) + '.']];
    }
    return RK.part('Simplify ' + t(shown) + '. Write the answer with a rational denominator, in simplest form.', S, { dl: dl }, sol,
      ['Simplify the radicals first, then multiply the numerator and the denominator by the radical in the denominator.', 'Multiply (or divide) <b>every</b> term of the numerator, then reduce only by a factor of every term.'], 'two-term numerator over a radical');
  }
  HW.defineExit({ lesson: 'u2l5', calc: false, outcome: 'AN2',
    blurb: 'Dividing radicals and rationalizing one-term denominators: a quotient of radicals, a square-root and a cube-root denominator, and a two-term numerator over a radical.',
    questions: [Q(1, 'BEG', 'Divide.', l5q1), Q(2, 'PRG', 'Rationalize.', l5q2), Q(3, 'PRG', 'A cube root below.', l5q3), Q(4, 'MAS', 'Two terms on top.', l5q4)] });

  /* =====================================================================================================
   * Lesson 6 — Rationalizing binomial denominators with conjugates
   * ===================================================================================================== */
  var HCONJ = ['Multiply the numerator and the denominator by the <b>conjugate</b> of the denominator (same two terms, opposite sign between them).', 'The denominator becomes a difference of squares: ' + t('(a+\\sqrt{b})(a-\\sqrt{b})=a^{2}-b') + '.'];
  function l6q1(r) {
    var two = r.chance(0.4);
    var s = pickWhere(function () { var ab = r.sample([2, 3, 5, 6, 7, 10, 11], 2); return { p: r.int(1, 5), a: ab[0], q: r.int(1, 7), b: ab[1], sg: r.chance(0.5) ? 1 : -1, rev: r.chance(0.3) }; },
      function (s) { var v = two ? s.p * s.p * s.a - s.q * s.q * s.b : s.p * s.p * s.a - s.q * s.q; return v !== 0 && (s.p > 1 || s.q > 1) && !(s.p === 4 && s.a === 2 && s.q === 5) && !(s.p === 2 && s.a === 5 && s.q === 3 && !two); });
    var p = s.p, a = s.a, q = s.q, b = s.b, shown, ans, conj, dl;
    var qt = two ? mixT(q, 2, b) : String(q);
    shown = s.rev && !two ? q + (s.sg > 0 ? '+' : '-') + mixT(p, 2, a) : mixT(p, 2, a) + (s.sg > 0 ? '+' : '-') + qt;
    conj = s.rev && !two ? q + (s.sg > 0 ? '-' : '+') + mixT(p, 2, a) : mixT(p, 2, a) + (s.sg > 0 ? '-' : '+') + qt;
    var A2 = p * p * a, B2 = two ? q * q * b : q * q; ans = s.rev && !two ? B2 - A2 : A2 - B2;
    var first = s.rev && !two ? B2 : A2, second = s.rev && !two ? A2 : B2;
    dl = [[s.rev && !two ? q * q - p * a : p * a - B2, 'u2x-conj-coef', 'Square the whole term: ' + t(pa(mixT(p, 2, a)) + '^{2}=' + p + '^{2}\\cdot ' + a + '=' + A2) + '.'], [A2 + B2, 'u2x-conj-add', 'The middle terms cancel and the product is a <b>difference</b> of squares: subtract.']];
    if (p === 1) dl.shift();
    return RK.part('Multiply ' + t(shown) + ' by its conjugate. Simplify.', term(ans), { dl: dl },
      'The conjugate is ' + t(conj) + '. ' + t(pa(shown) + pa(conj) + '=' + pa(s.rev && !two ? qt : mixT(p, 2, a)) + '^{2}-' + pa(s.rev && !two ? mixT(p, 2, a) : qt) + '^{2}=' + first + '-' + (second < 0 ? '(' + second + ')' : second) + '=' + ans) + '. The middle terms cancel, so the product is rational.',
      ['The conjugate has the same two terms with the opposite sign between them.', 'Their product is (first term)² − (second term)²: ' + t('(m\\sqrt{a})^{2}=m^{2}a') + '.'], 'product of conjugates');
  }
  function l6q2(r) {
    var rr2 = r.chance(0.35), S, shown, sol, dl;
    if (!rr2) {
      var s = pickWhere(function () { return { a: r.int(1, 6), b: r.pick([2, 3, 5, 6, 7, 10, 11, 13]), k: r.int(1, 15), sg: r.chance(0.5) ? 1 : -1 }; },
        function (s) { var D = s.a * s.a - s.b; if (D === 0 || Math.abs(D) > 12) return false; var g = ex.gcd(s.k, Math.abs(D)); return Math.abs(D) / g <= 6 && !(s.a === 3 && s.b === 5 && s.k === 6) && !(s.a === 4 && s.b === 10) && !(s.a === 3 && s.b === 2 && s.k === 7); });
      var a = s.a, b = s.b, k = s.k, sg = s.sg, D = a * a - b;
      var den = add(term(a), term(sg, 2, b)), cj = add(term(a), term(-sg, 2, b));
      S = sc(cj, [k, D]);
      shown = '\\dfrac{' + k + '}{' + a + (sg > 0 ? '+' : '-') + sq(b) + '}';
      sol = t(shown + '\\cdot\\dfrac{' + a + (sg > 0 ? '-' : '+') + sq(b) + '}{' + a + (sg > 0 ? '-' : '+') + sq(b) + '}=\\dfrac{' + k + pa(a + (sg > 0 ? '-' : '+') + sq(b)) + '}{' + (a * a) + '-' + b + '}=\\dfrac{' + k + pa(a + (sg > 0 ? '-' : '+') + sq(b)) + '}{' + D + '}=' + rtex(S)) + '.';
      dl = [[sc(den, [k, D]), 'u2x-conj-sign', 'Multiply by the <b>conjugate</b> ' + t(a + (sg > 0 ? '-' : '+') + sq(b)) + ' (the opposite sign), not by the denominator itself.'], [sc(cj, [k, a * a + b]), 'u2x-conj-den-add', 'The denominator is a difference of squares: ' + t('(' + a + ')^{2}-' + pa(sq(b)) + '^{2}=' + (a * a) + '-' + b) + '.']];
    } else {
      var s2 = pickWhere(function () { var pq = r.sample([2, 3, 5, 6, 7, 10, 11, 13], 2); return { p: Math.max(pq[0], pq[1]), q: Math.min(pq[0], pq[1]), k: r.int(1, 12), sg: r.chance(0.5) ? 1 : -1 }; },
        function (s) { var D = s.p - s.q; return D <= 8 && Math.abs(D) / ex.gcd(s.k, D) <= 4 && !(s.p === 7 && s.q === 2 && s.k === 10) && !(s.p === 7 && s.q === 3 && s.k === 12) && !(s.p === 6 && s.q === 2 && s.k === 2); });
      var p = s2.p, q = s2.q, k2 = s2.k, sg2 = s2.sg, D2 = p - q;
      var den2 = add(term(1, 2, p), term(sg2, 2, q)), cj2 = add(term(1, 2, p), term(-sg2, 2, q));
      S = sc(cj2, [k2, D2]);
      shown = '\\dfrac{' + k2 + '}{' + sq(p) + (sg2 > 0 ? '+' : '-') + sq(q) + '}';
      sol = t(shown + '\\cdot\\dfrac{' + sq(p) + (sg2 > 0 ? '-' : '+') + sq(q) + '}{' + sq(p) + (sg2 > 0 ? '-' : '+') + sq(q) + '}=\\dfrac{' + k2 + pa(sq(p) + (sg2 > 0 ? '-' : '+') + sq(q)) + '}{' + p + '-' + q + '}=' + rtex(S)) + '.';
      dl = [[sc(den2, [k2, D2]), 'u2x-conj-sign', 'Multiply by the <b>conjugate</b> (the opposite sign between the terms), not by the denominator itself.'], [sc(cj2, [k2, p + q]), 'u2x-conj-den-add', 'The denominator is a difference of squares: ' + t(p + '-' + q) + '.']];
    }
    return RK.part('Rationalize the denominator and simplify ' + t(shown) + '.', S, { dl: dl }, sol, HCONJ, 'rationalize a binomial denominator');
  }
  function l6q3(r) {
    var s = pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7, 10, 11]), u: r.int(1, 3), v: r.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]), w: r.pick([-4, -3, -2, -1, 1, 2, 3, 4]) }; },
      function (s) { var D = s.m - s.w * s.w; return D !== 0 && Math.abs(D) <= 10 && !(s.u * s.w === s.v) && !(s.m === 5 && s.u === 1 && s.v === 1 && s.w === -1) && !(s.m === 7 && s.u === 1 && s.v === 2 && s.w === -2) && !(s.m === 6 && s.u === 1 && s.v === 3 && s.w === -2); });
    var m = s.m, u = s.u, v = s.v, w = s.w, D = m - w * w;
    var N = add(term(u, 2, m), term(v)), Dn = add(term(1, 2, m), term(w)), C = add(term(1, 2, m), term(-w));
    var top = mul(N, C), S = sc(top, [1, D]);
    var shown = '\\dfrac{' + mixT(u, 2, m) + cT(v, false) + '}{' + sq(m) + cT(w, false) + '}';
    var ct = sq(m) + cT(-w, false);
    return RK.part('Rationalize the denominator and simplify ' + t(shown) + '.', S,
      { dl: [[sc(top, [1, m + w * w]), 'u2x-conj-den-add', 'The denominator is a difference of squares: ' + t(pa(sq(m)) + '^{2}-' + pa(w) + '^{2}=' + m + '-' + (w * w) + '=' + D) + '.'], [sc(add(term(u * m - v * w)), [1, D]), 'u2x-foil-mid', 'Expand the numerator fully (FOIL): it has four products, and the radical terms don’t cancel here.']] },
      'Multiply by the conjugate ' + t(ct) + ': ' + t('\\dfrac{' + pa(mixT(u, 2, m) + cT(v, false)) + pa(ct) + '}{' + m + '-' + (w * w) + '}=\\dfrac{' + rtex(top) + '}{' + D + '}=' + rtex(S)) + '.',
      HCONJ.concat(['Expand the numerator with FOIL, then reduce only by a factor of every term.']), 'binomial over a binomial');
  }
  function l6q4(r) {
    var s = pickWhere(function () { return { a: r.int(2, 5), b: r.int(2, 30), k: r.int(1, 4), plus: r.chance(0.5) }; },
      function (s) { var D = s.a * s.a - s.b; return !RK.isPow(s.b, 2) && D !== 0 && Math.abs(D) <= 6 && !(s.a === 3 && s.b === 8 && s.k === 1) && !(s.a === 2 && s.b === 3 && s.k === 1); });
    var a = s.a, b = s.b, k = s.k, D = a * a - b, S, sol;
    var f1 = '\\dfrac{' + k + '}{' + a + '-' + sq(b) + '}', f2 = '\\dfrac{' + k + '}{' + a + '+' + sq(b) + '}';
    var r1 = sc(add(term(a), term(1, 2, b)), [k, D]), r2 = sc(add(term(a), term(-1, 2, b)), [k, D]);
    S = s.plus ? add(r1, r2) : RK.sub(r1, r2);
    sol = 'Rationalize each fraction (the two denominators are conjugates, and their product is ' + t((a * a) + '-' + b + '=' + D) + '): ' + t(f1 + '=' + rtex(r1)) + ' and ' + t(f2 + '=' + rtex(r2)) + '. ' + (s.plus ? 'Add' : 'Subtract') + ': ' + t('=' + rtex(S)) + '.' + (s.plus ? ' The radical terms cancel: the sum is rational.' : '');
    return RK.part('Simplify ' + t(f1 + (s.plus ? '+' : '-') + f2) + '.', S,
      { dl: [[s.plus ? term([k, a]) : 0, 'u2x-frac-add', 'Fractions are not added by adding the denominators. Rationalize each fraction (or use the common denominator ' + t('(' + a + '-' + sq(b) + ')(' + a + '+' + sq(b) + ')=' + D) + ').']] },
      sol, ['Rationalize each fraction with the conjugate of its denominator — both denominators become ' + t(D) + '.', 'Then collect like terms.'], 'sum or difference with conjugate denominators');
  }
  HW.defineExit({ lesson: 'u2l6', calc: false, outcome: 'AN2',
    blurb: 'Conjugates: the product of a binomial and its conjugate, rationalizing a binomial denominator, a binomial over a binomial, and a sum or difference of two fractions with conjugate denominators.',
    questions: [Q(1, 'BEG', 'The conjugate.', l6q1), Q(2, 'PRG', 'Rationalize.', l6q2), Q(3, 'PRG', 'A binomial over a binomial.', l6q3), Q(4, 'MAS', 'Two fractions.', l6q4)] });

  /* =====================================================================================================
   * Lesson 7 — Unit 2 review (one question from each part of the unit)
   * ===================================================================================================== */
  function l7q1(r) {
    var kind = r.pick(['sq', 'cube', 'four', 'frac']), n = kind === 'cube' ? 3 : kind === 'four' ? 4 : 2, s, k, m, d = 1, sg = 1;
    s = pickWhere(function () {
      if (kind === 'sq') return { k: r.int(3, 12), m: r.pick([2, 3, 5, 6, 7, 10]), d: 1 };
      if (kind === 'cube') return { k: r.int(2, 5), m: r.pick([2, 3, 4, 5, 6, 7]), d: 1, sg: r.chance(0.5) ? -1 : 1 };
      if (kind === 'four') return { k: r.int(2, 3), m: r.pick([2, 3, 5, 6, 7, 10]), d: 1 };
      var dd = r.pick([2, 3]); return { k: dd * r.int(2, 4), m: r.pick([2, 3, 5, 6, 7]), d: dd };
    }, function (s) { var N = Math.pow(s.k, n) * s.m; return N <= 1000 && [98, 180, 108, 162, 375, 96, 48, 80, 1250, 32].indexOf(N) < 0; });
    k = s.k; m = s.m; d = s.d; sg = s.sg || 1;
    var N = Math.pow(k, n) * m, R = (d > 1 ? '\\frac{1}{' + d + '}' : '') + '\\sqrt' + (n === 2 ? '' : '[' + n + ']') + '{' + (sg < 0 ? '-' : '') + F(N) + '}';
    var p = P.radical('Write ' + t(R) + ' as a mixed radical in simplest form.', { k: sg * k / d, n: n, m: m }, 'mixed',
      t(R + '=' + (d > 1 ? '\\frac{1}{' + d + '}' : '') + '\\sqrt' + (n === 2 ? '' : '[' + n + ']') + '{' + (sg < 0 ? '-' : '') + Math.pow(k, n) + '}\\cdot\\sqrt' + (n === 2 ? '' : '[' + n + ']') + '{' + m + '}=' + (d > 1 ? '\\frac{1}{' + d + '}(' + k + '\\sqrt{' + m + '})=' : '') + mixT(sg * k / d, n, m)) + '.',
      HMIX, 'mixed radical in simplest form');
    p.bad = [F(Math.pow(k, n) / d) + '\\sqrt' + (n === 2 ? '' : '[' + n + ']') + '{' + m + '}'];
    if (sg < 0) p.bad.push(k + cb(m));
    return p;
  }
  function l7q2(r) {
    var v = r.pick(['a', 'x']);
    var s = pickWhere(function () { return { m: r.pick([2, 3, 5, 6, 7]), ks: [r.int(1, 5), r.int(1, 5), r.int(1, 4)], cs: [1, r.pick([1, 2, -1]), r.pick([-1, -2, -3, 2, 3])] }; },
      function (s) { var tot = s.cs[0] * s.ks[0] + s.cs[1] * s.ks[1] + s.cs[2] * s.ks[2]; return tot !== 0 && s.ks.every(function (k) { return k * k * s.m <= 125; }) && (s.ks[0] > 1 || s.ks[2] > 1) && s.ks[1] > 1; });
    var m = s.m, ks = s.ks, cs = s.cs, tot = cs[0] * ks[0] + cs[1] * ks[1] + cs[2] * ks[2], nocoef = cs[0] + cs[1] + cs[2];
    var written = '\\sqrt{' + (ks[0] * ks[0] * m) + v + '^{3}}' + (cs[1] < 0 ? '-' : '+') + (Math.abs(cs[1]) === 1 ? '' : Math.abs(cs[1])) + v + '\\sqrt{' + (ks[1] * ks[1] * m) + v + '}' + (cs[2] < 0 ? '-' : '+') + (Math.abs(cs[2]) === 1 ? '' : Math.abs(cs[2])) + '\\sqrt{' + (ks[2] * ks[2] * m) + v + '^{3}}';
    var tv = coefT(tot) + v + '\\sqrt{' + m + v + '}', target = tv;
    function tm(c, k) { return cT(c * k, false, v + '\\sqrt{' + m + v + '}'); }
    var step = coefT(ks[0]) + v + '\\sqrt{' + m + v + '}' + tm(cs[1], ks[1]) + tm(cs[2], ks[2]);
    var chk = K.varRadical(target, 'mixed', { diag: function (rr) { if (rr && rr.n === 2 && nocoef !== tot && rr.k[1] === 1 && rr.k[0] === nocoef && rr.rad.m === m) return { code: 'u2x-add-coef', hint: 'Simplify each radical first: the perfect squares come out and multiply the coefficients.' }; return null; } });
    var p = P.math('Simplify ' + t(written) + '. Assume ' + t(v + '\\ge 0') + '.', chk, target,
      t(written + '=' + step + '=' + target) + '. Every radical becomes ' + t(v + '\\sqrt{' + m + v + '}') + ' times a number, so they are all like radicals.',
      ['Simplify each radical first: ' + t('\\sqrt{' + v + '^{3}}=' + v + '\\sqrt{' + v + '}') + '.', 'Then combine the like radicals by adding their coefficients.'], 'add and subtract radicals with a variable', { keys: 'var' });
    p.bad = nocoef !== tot && nocoef !== 0 ? [coefT(nocoef) + v + '\\sqrt{' + m + v + '}'] : [];
    return p;
  }
  function l7q3(r) { var f = foil(r, 'two'); return RK.part('Expand and simplify ' + t(f.shown) + '.', f.S, { dl: f.dl }, f.sol, HFOIL, 'multiply binomials with two radicals'); }
  function l7q4(r) {
    var self = r.chance(0.45), S, shown, sol, dl;
    if (self) {
      var s = pickWhere(function () { return { u: r.int(1, 4), m: r.pick([2, 3, 5, 6, 7]), v: r.int(1, 6), sg: r.chance(0.5) ? 1 : -1 }; }, function (s) { var D = s.u * s.u * s.m - s.v * s.v; return D !== 0 && Math.abs(D) <= 12 && !(s.u === 3 && s.m === 2 && s.v === 4) && !(s.u === 1 && s.m === 7 && s.v === 2) && !(s.u === 1 && s.m === 5 && s.v === 1); });
      var u = s.u, m = s.m, v = s.v, sg = s.sg, D = u * u * m - v * v;
      var N = add(term(u, 2, m), term(sg * v)), C = add(term(u, 2, m), term(-sg * v)), top = mul(N, N);
      S = sc(top, [1, D]);
      shown = '\\dfrac{' + mixT(u, 2, m) + (sg > 0 ? '+' : '-') + v + '}{' + mixT(u, 2, m) + (sg > 0 ? '-' : '+') + v + '}';
      sol = 'Multiply by the conjugate ' + t(mixT(u, 2, m) + (sg > 0 ? '+' : '-') + v) + ' of the denominator: ' + t('\\dfrac{' + pa(mixT(u, 2, m) + (sg > 0 ? '+' : '-') + v) + '^{2}}{' + (u * u * m) + '-' + (v * v) + '}=\\dfrac{' + rtex(top) + '}{' + D + '}=' + rtex(S)) + '.';
      dl = [[sc(top, [1, u * u * m + v * v]), 'u2x-conj-den-add', 'The denominator is a difference of squares: ' + t((u * u * m) + '-' + (v * v) + '=' + D) + '.'], [sc(term(u * u * m + v * v), [1, D]), 'u2x-sq-mid', 'The numerator is a square: ' + t('(x+y)^{2}=x^{2}+2xy+y^{2}') + ' — don’t forget the middle term.']];
    } else {
      var s2 = pickWhere(function () { var ab = r.sample([2, 3, 5, 6, 7], 2); return { a: ab[0], b: ab[1], p: r.int(1, 3), q: r.pick([-2, -1, 1, 2]), rr: r.int(1, 2), ss: r.pick([1, 2]) }; },
        function (s) { var D = s.rr * s.rr * s.a - s.ss * s.ss * s.b; return D !== 0 && Math.abs(D) <= 12 && ex.simplest(s.a * s.b, 2) && !(s.p === 2 && s.q === 1 && s.rr === 1 && s.ss === 2 && s.a === 5 && s.b === 3); });
      var a = s2.a, b = s2.b, p = s2.p, q = s2.q, rr = s2.rr, ss = s2.ss, D2 = rr * rr * a - ss * ss * b;
      var N2 = add(term(p, 2, a), term(q, 2, b)), C2 = add(term(rr, 2, a), term(ss, 2, b)), top2 = mul(N2, C2);
      S = sc(top2, [1, D2]);
      shown = '\\dfrac{' + mixT(p, 2, a) + cT(q, false, sq(b)) + '}{' + mixT(rr, 2, a) + '-' + mixT(ss, 2, b) + '}';
      sol = 'Multiply by the conjugate ' + t(mixT(rr, 2, a) + '+' + mixT(ss, 2, b)) + ': the denominator is ' + t(pa(mixT(rr, 2, a)) + '^{2}-' + pa(mixT(ss, 2, b)) + '^{2}=' + (rr * rr * a) + '-' + (ss * ss * b) + '=' + D2) + ' and the numerator is ' + t(pa(mixT(p, 2, a) + cT(q, false, sq(b))) + pa(mixT(rr, 2, a) + '+' + mixT(ss, 2, b)) + '=' + rtex(top2)) + '. Answer: ' + t(rtex(S)) + '.';
      dl = [[sc(top2, [1, rr * rr * a + ss * ss * b]), 'u2x-conj-den-add', 'The denominator is a difference of squares: subtract, ' + t((rr * rr * a) + '-' + (ss * ss * b)) + '.']];
    }
    return RK.part('Rationalize the denominator and simplify ' + t(shown) + '.', S, { dl: dl }, sol, HCONJ.concat(['Expand the numerator fully, then reduce and keep the denominator positive.']), 'rationalize: binomial over binomial');
  }
  HW.defineExit({ lesson: 'u2l7', calc: false, outcome: 'AN2',
    blurb: 'Unit 2 review: a radical in simplest form, adding radicals with a variable, multiplying binomials with two radicals, and rationalizing a binomial denominator.',
    questions: [Q(1, 'BEG', 'Simplest form.', l7q1), Q(2, 'PRG', 'Add and subtract.', l7q2), Q(3, 'PRG', 'Multiply.', l7q3), Q(4, 'MAS', 'Rationalize.', l7q4)] });
})(window);
