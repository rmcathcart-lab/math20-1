/* Math 20-1 · Unit 4 · Lesson 5 — Solving Quadratic Equations by Factoring (outcome RF5 on every part)
 * Assignment 5 (u4_l05.tex, Questions 1–18) and the Lesson 5 Extra Practice (u4_ep05.tex, A1–A3, B1–B7, C1–C3).
 * Every part is a generator: the booklet question's idea, form and difficulty with new numbers (the lesson's example
 * numbers and the booklet question's own numbers are left out where that is easy). No calculator (Unit 4): exact roots.
 *
 * Roots are typed as a list in any order ("x = 3, x = -5", "x = ±4", fractions or decimals) and checked with the shared
 * K.valueSet (js/relfn.js). Recognised mistakes (lesson codes u4l5-…): a root with the wrong sign (x = 3 from (x + 3)),
 * a fraction root upside down (−4/3 from 4x + 3 = 0), not dividing by the coefficient (−3 from 4x + 3 = 0), the root
 * x = 0 lost by dividing by x (or a root lost by dividing by a bracket), a constant factor given as a root, setting each
 * factor equal to the right-side number (or ignoring it) when the right side isn't 0, only the positive square root,
 * and in problems a root that should have been rejected.
 * "Write an equation with these roots" is a polynomial box with "= 0" after it: any non-zero multiple has the right
 * roots but gets a nudge to the smallest integer coefficients; factored form gets a nudge to expand; an equation with
 * the wrong roots is told what its roots are (with sign / upside-down diagnoses).
 * Conversions: "state the x-intercepts" → ordered pairs; "show that the area is 21x − x²" → multiple choice of
 * expressions; problems with two answers (pairs of integers) → two pairs of number boxes in any order; "explain what
 * each answer means" → in the worked solution.
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: 13 (terms of an arithmetic series), Extra C1–C3. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, B = K.P, ex = HW.ex, P = HW.poly, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var LID = 'u4l5';

  var CODES = {
    'u4l5-sign': 'Root with the wrong sign (x = 3 from x + 3 = 0)', 'u4l5-recip': 'Fraction root upside down', 'u4l5-nodiv': 'Didn’t divide by the coefficient of x',
    'u4l5-lost-zero': 'Lost the root x = 0 (divided by x)', 'u4l5-lost-root': 'Lost a root by dividing by a bracket', 'u4l5-const-root': 'Gave a constant factor as a root',
    'u4l5-set-k': 'Set each factor equal to the right side (not 0)', 'u4l5-ignore-k': 'Ignored the number on the right side', 'u4l5-pm': 'Only the positive square root',
    'u4l5-no-root': 'Gave x² instead of x', 'u4l5-reject': 'Kept a root that must be rejected', 'u4l5-one-pair': 'Gave only one of the two answers',
    'u4l5-eq-smallest': 'Equation: not the smallest integer coefficients', 'u4l5-eq-integer': 'Equation: fractions left in the coefficients', 'u4l5-eq-expand': 'Equation: not expanded to standard form',
    'u4l5-eq-sign': 'Equation: roots with the wrong signs', 'u4l5-eq-recip': 'Equation: fraction roots upside down', 'u4l5-eq-one': 'Equation: one root wrong', 'u4l5-eq-double': 'Equation: double root used only once',
    'u4l5-eq-linear': 'Equation isn’t quadratic', 'u4l5-half': 'Forgot the ½ in the triangle area', 'u4l5-perim': 'Perimeter: added the length and width only once',
    'u4l5-base': 'Gave the base of the box, not the sheet', 'u4l5-x2': 'Gave the values of x², not x', 'u4l5-nr-diff': 'Subtracted instead of adding', 'u4l5-k-sign': 'Sign slip finding k'
  };
  HW.addCodes(CODES);
  HW.addPartial({ 'u4l5-sign': 's', 'u4l5-recip': 's', 'u4l5-nodiv': 's', 'u4l5-lost-zero': 'b', 'u4l5-lost-root': 'b', 'u4l5-const-root': 's', 'u4l5-set-k': 'n', 'u4l5-ignore-k': 'n',
    'u4l5-pm': 'b', 'u4l5-no-root': 'b', 'u4l5-reject': 's', 'u4l5-one-pair': 's', 'u4l5-eq-sign': 'b', 'u4l5-eq-recip': 'b', 'u4l5-eq-one': 'b', 'u4l5-eq-double': 'b', 'u4l5-eq-linear': 'n',
    'u4l5-half': 'b', 'u4l5-perim': 's', 'u4l5-base': 's', 'u4l5-x2': 'b', 'u4l5-nr-diff': 'b', 'u4l5-k-sign': 's' });

  /* ======================= numbers and LaTeX ======================= */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var r = a % b; a = b; b = r; } return a; }
  function Q(p, q) { q = q == null ? 1 : q; if (q < 0) { p = -p; q = -q; } var g = gcd(p, q) || 1; return [p / g, q / g]; }
  function qv(r) { return r[0] / r[1]; }
  function rT(r) { r = Array.isArray(r) ? Q(r[0], r[1]) : [r, 1]; return ex.texRat(r); }
  function same(a, b) { return Math.abs(a - b) < 1e-9; }
  function range(a, b) { var o = []; for (var i = a; i <= b; i++) o.push(i); return o; }
  function pm(a, b) { return range(a, b).concat(range(a, b).map(function (x) { return -x; })); }
  function pickWhere(gen, okf) { for (var i = 0; i < 8000; i++) { var o = gen(); if (okf(o)) return o; } throw new Error(LID + ': no valid numbers'); }
  function sp(x) { return x < 0 ? '(' + x + ')' : String(x); }
  /* a term c·v^pow with a sign ('' when c = 0); c an integer or [p, q] */
  function termTex(c, pow, v, first) {
    c = Array.isArray(c) ? Q(c[0], c[1]) : [c, 1]; if (!c[0]) return '';
    var neg = c[0] < 0, a = Math.abs(c[0]), num = c[1] === 1 ? String(a) : '\\frac{' + a + '}{' + c[1] + '}', body;
    if (pow === 0) body = num; else body = (a === 1 && c[1] === 1 ? '' : num) + v + (pow > 1 ? '^{' + pow + '}' : '');
    return (neg ? '-' : first ? '' : '+') + body;
  }
  /* terms [[c, pow], …] in the order given */
  function pT(list, v) { var s = ''; list.forEach(function (x) { var tt = termTex(x[0], x[1], v || 'x', !s); s += tt; }); return s || '0'; }
  function linT(a, b, v) { return pT([[a, 1], [b, 0]], v); }
  function quadT(A, Bc, C, v) { return pT([[A, 2], [Bc, 1], [C, 0]], v); }
  /* coefficients (low → high) of g·Π(a·v + b) */
  function expand(g, fs) { var p = [g]; fs.forEach(function (f) { var n = []; for (var i = 0; i <= p.length; i++) n[i] = (i < p.length ? p[i] * f[1] : 0) + (i > 0 ? p[i - 1] * f[0] : 0); p = n; }); return p; }
  function arrT(p, v) { var l = []; for (var i = p.length - 1; i >= 0; i--) l.push([p[i], i]); return pT(l, v); }

  /* ---- a factored quadratic g·Π(a·v + b): its standard form, factored form, zero-product lines and roots ---- */
  function Quad(g, fs, v) {
    v = v || 'x';
    var p = expand(g, fs), roots = [], seen = {};
    fs.forEach(function (f) { var r = Q(-f[1], f[0]), k = r.join('/'); if (!seen[k]) { seen[k] = 1; roots.push(r); } });
    var mono = g, monoPow = 0, brs = [];
    fs.forEach(function (f) { if (f[1] === 0) { mono *= f[0]; monoPow++; } else brs.push(f); });
    var s = monoPow ? (mono === 1 ? '' : mono === -1 ? '-' : String(mono)) + v + (monoPow > 1 ? '^{' + monoPow + '}' : '') : (mono === 1 ? '' : mono === -1 ? '-' : String(mono));
    var uq = [];
    brs.forEach(function (f) { var u = uq.filter(function (x) { return x.f[0] === f[0] && x.f[1] === f[1]; })[0]; if (u) u.k++; else uq.push({ f: f, k: 1 }); });
    uq.forEach(function (u) { s += '(' + linT(u.f[0], u.f[1], v) + ')' + (u.k > 1 ? '^{' + u.k + '}' : ''); });
    var zs = [];
    if (monoPow) zs.push((mono === 1 ? '' : mono === -1 ? '-' : String(mono)) + v + '=0');
    uq.forEach(function (u) { zs.push(linT(u.f[0], u.f[1], v) + '=0'); });
    var pre = !monoPow && Math.abs(mono) !== 1 ? t(mono + '\\ne 0') + ', so ' : '';
    var double = uq.length === 1 && uq[0].k === 2 && !monoPow;
    var rl;
    if (roots.length === 1) rl = t(v + '=' + rT(roots[0])) + (double ? ' (a double root)' : '');
    else if (roots.length === 2 && roots[0][0] === -roots[1][0] && roots[0][1] === roots[1][1] && roots[0][0]) rl = t(v + '=' + rT(roots[0])) + ' or ' + t(v + '=' + rT(roots[1])) + ' &nbsp;(' + t(v + '=\\pm' + rT([Math.abs(roots[0][0]), roots[0][1]])) + ')';
    else rl = roots.map(function (r) { return t(v + '=' + rT(r)); }).join(' or ');
    return { g: g, fs: fs, v: v, p: p, A: p[2], B: p[1], C: p[0], std: arrT(p, v), fac: s, roots: roots, double: double,
      zero: pre + zs.map(function (z) { return t(z); }).join(' or '), rootsLine: rl };
  }

  /* ======================= checking a list of roots ======================= */
  function sameSet(A, Bv) { if (A.length !== Bv.length) return false; return A.every(function (x) { return Bv.some(function (y) { return same(x, y); }); }) && Bv.every(function (y) { return A.some(function (x) { return same(x, y); }); }); }
  function perms(a) { if (a.length <= 1) return [a.slice()]; var out = []; a.forEach(function (x, i) { perms(a.slice(0, i).concat(a.slice(i + 1))).forEach(function (p) { out.push([x].concat(p)); }); }); return out; }
  /* typical wrong versions of one root r = p/q (from the factor q·v − p) */
  function variants(r, v) {
    var p = r[0], q = r[1], out = [], fac = linT(q, -p, v);
    if (p) out.push({ val: -p / q, code: 'u4l5-sign', hint: 'Check the signs: ' + t(fac + '=0') + ' gives ' + t(v + '=' + rT(r)) + ' — the root has the <b>opposite</b> sign to the number in the bracket.' });
    if (p && (q > 1 || Math.abs(p) > 1) && Math.abs(p) !== q) out.push({ val: q / p, code: 'u4l5-recip', hint: 'A fraction root is upside down. Solve ' + t(fac + '=0') + ': move the constant, then <b>divide by the coefficient</b> of ' + t(v) + ': ' + t(v + '=' + rT(r)) + '.' },
      { val: -q / p, code: 'u4l5-recip', hint: 'A fraction root is upside down (and check its sign). Solve ' + t(fac + '=0') + ' step by step.' });
    if (q > 1) out.push({ val: p, code: 'u4l5-nodiv', hint: 'Divide by the coefficient of ' + t(v) + ': ' + t(fac + '=0') + ' gives ' + t(q + v + '=' + p) + ', so ' + t(v + '=' + rT(r)) + '.' },
      { val: -p, code: 'u4l5-nodiv', hint: 'After moving the constant, divide by the coefficient of ' + t(v) + ' (and watch the sign).' });
    return out;
  }
  /* o: { v, cands: [{ vals, code, hint }], g (constant factor), zero (x = 0 can be lost by dividing by x), lost: { val, hint } } */
  function rootsDiag(roots, o) {
    o = o || {}; var v = o.v || 'x', T = roots.map(qv);
    return function (A) {
      var cs = o.cands || [];
      for (var i = 0; i < cs.length; i++) if (sameSet(A, cs[i].vals)) return { code: cs[i].code, hint: cs[i].hint };
      if (T.some(function (x) { return same(x, 0); }) && sameSet(A, T.filter(function (x) { return !same(x, 0); })) && T.length > 1)
        return { code: 'u4l5-lost-zero', hint: 'There is another root: never divide both sides by ' + t(v) + ' — factor it out instead. The factor ' + t(v) + ' gives ' + t(v + '=0') + '.' };
      if (o.lost && sameSet(A, T.filter(function (x) { return !same(x, o.lost.val); }))) return { code: 'u4l5-lost-root', hint: o.lost.hint };
      if (o.g && Math.abs(o.g) > 1 && A.length === T.length + 1 && T.every(function (x) { return A.some(function (y) { return same(x, y); }); }) && A.some(function (y) { return same(Math.abs(y), Math.abs(o.g)); }))
        return { code: 'u4l5-const-root', hint: 'The constant factor ' + t(String(o.g)) + ' can never be ' + t('0') + ', so it gives <b>no root</b>. Only the factors with ' + t(v) + ' give roots.' };
      if (T.length === 2 && same(T[0], -T[1]) && A.length === 1 && same(A[0], Math.abs(T[0])))
        return { code: 'u4l5-pm', hint: 'There are two roots: both factors give one (' + t(v + '=\\pm' + rT([Math.abs(roots[0][0]), roots[0][1]])) + ' form). Don’t forget the negative one.' };
      if (A.length === T.length && T.length <= 4) {
        var vs = roots.map(function (r) { return variants(r, v); }), best = null;
        perms(A).some(function (pa) {
          var codes = [];
          for (var j = 0; j < T.length; j++) {
            if (same(pa[j], T[j])) { codes.push(null); continue; }
            var m = vs[j].filter(function (w) { return same(w.val, pa[j]); })[0];
            if (!m) return false;
            codes.push(m);
          }
          var first = codes.filter(function (c) { return c; })[0];
          if (first && !(first.code === 'u4l5-sign' && codes.every(function (c) { return c && c.code === 'u4l5-sign'; }))) { best = first; return true; }
          return false;
        });
        if (best) return { code: best.code, hint: best.hint };
      }
      return null;
    };
  }
  /* a "solve" part: roots as [p, q]; o: { v, pre (solution lines before the factored line), q (a Quad), sol, hints, text, cands, g, zero, lost, keyTex } */
  function solvePart(prompt, roots, o) {
    o = o || {}; var v = o.v || 'x';
    var part = K.P.valueSet(prompt, roots, { v: v, keyTex: o.keyTex, diag: rootsDiag(roots, o) }, o.sol, o.hints || H_SOLVE, o.text);
    part.bad = (o.cands || []).map(function (c) { return c.vals.map(function (x) { return v + '=' + rT(fracOf(x)); }).join(','); });
    return part;
  }
  function fracOf(x) { for (var q = 1; q <= 60; q++) { var p = Math.round(x * q); if (Math.abs(p / q - x) < 1e-9) return Q(p, q); } return [x, 1]; }
  function solLines(q, pre, post) { return (pre || []).concat([t(q.fac + '=0'), q.zero, q.rootsLine]).concat(post || []).join('<br>'); }
  var H_SOLVE = ['Set each factor that contains the variable equal to ' + t('0') + ' and solve it.', 'A constant factor (like ' + t('-3') + ') is never ' + t('0') + ', so it gives no root. Give every root, separated by commas.'];
  var H_STD = ['First move every term to one side so the other side is ' + t('0') + ' — the zero product property only works then.', 'Take out any common factor, factor fully, then set each factor with the variable equal to ' + t('0') + '.'];

  /* random linear factors */
  function fracRoot(r, dens, nums) { return pickWhere(function () { return { q: r.pick(dens), p: r.pick(nums) }; }, function (o) { return gcd(o.p, o.q) === 1 && o.q > 1; }); }

  /* ======================= "write an equation with these roots" ======================= */
  function polyOf(T, v) { var o = {}; o[v] = 2; var o1 = {}; o1[v] = 1; return P.add(P.mono(T[0], o), P.mono(T[1], o1), P.num(T[2])); }
  function eqCheck(T, roots, v, double) {
    var Tp = polyOf(T, v);
    return function (resp) {
      var s = String(resp == null ? '' : resp).replace(/\\left|\\right/g, '');
      if (!s.replace(/\s|\\[ ,;:!]/g, '')) return form('empty', 'Type your answer first.');
      var sides = s.split('=');
      if (sides.length > 2) return form('unreadable', 'Write one equation: the quadratic, then ' + t('=0') + '.');
      var polys = [], asts = [];
      for (var i = 0; i < sides.length; i++) {
        if (!sides[i].replace(/\s|\\[ ,;:!]/g, '')) { polys.push(P.num(0)); asts.push(null); continue; }
        var a = K.read(sides[i]); if (a.res) return a.res;
        var rd = P.read(a.ast); if (!rd.ok) return wrong('value', 'That isn’t a polynomial in ' + t(v) + '. Multiply your factors out.');
        polys.push(rd.p); asts.push(a.ast);
      }
      var S = polys.length === 2 ? P.sub(polys[0], polys[1]) : polys[0];
      if (P.vars(S).some(function (x) { return x !== v; })) return form('sol-letter', 'Use the variable ' + t(v) + ' only.');
      var c2 = P.coef(S, (function () { var o = {}; o[v] = 2; return o; })()), c1 = P.coef(S, (function () { var o = {}; o[v] = 1; return o; })()), c0 = P.constant ? P.constant(S) : P.coef(S, {});
      var a2 = qv(c2), a1 = qv(c1), a0 = qv(c0);
      if (P.degree(S) > 2) return wrong('u4l5-eq-linear', 'That has a power higher than 2. A quadratic equation comes from multiplying <b>two</b> linear factors.');
      if (same(a2, 0)) {
        if (double && !same(a1, 0) && same(a0 / a1, -qv(roots[0]))) return wrong('u4l5-eq-double', 'A <b>double root</b> means the factor appears twice: square it, ' + t('(' + linT(roots[0][1], -roots[0][0], v) + ')^{2}=0') + ', then expand.');
        return wrong('u4l5-eq-linear', 'That equation isn’t quadratic (it has no ' + t(v + '^{2}') + ' term). Multiply one factor for each root.');
      }
      var lam = a2 / T[0];
      if (same(a1, lam * T[1]) && same(a0, lam * T[2])) {
        if (same(lam, 1)) {
          for (var j = 0; j < asts.length; j++) if (asts[j]) { var fi = P.formIssue(asts[j]); if (fi && fi.code !== 'not-poly') return form('u4l5-eq-expand', 'Right roots — now write it in <b>standard form</b>: expand the brackets and collect like terms, ' + t('a' + v + '^{2}+b' + v + '+c=0') + '.'); }
          if (polys.length === 2 && !P.isZero(polys[1]) && !P.isZero(polys[0])) return form('u4l5-eq-expand', 'Right roots — now move every term to one side so the equation reads ' + t('a' + v + '^{2}+b' + v + '+c=0') + '.');
          return ok();
        }
        if (![c2, c1, c0].every(function (c) { return c[1] === 1; })) return form('u4l5-eq-integer', 'Those are the right roots — now multiply through by the common denominator so every coefficient is an integer.');
        return form('u4l5-eq-smallest', 'Those are the right roots — but give the equation with the <b>smallest</b> integer coefficients (divide out the common factor' + (lam < 0 ? ', and make the ' + t(v + '^{2}') + ' coefficient positive' : '') + ').');
      }
      var D = a1 * a1 - 4 * a2 * a0, Tv = roots.map(qv); if (Tv.length === 1) Tv = [Tv[0], Tv[0]];
      if (D >= -1e-9) {
        var sq = Math.sqrt(Math.max(0, D)), s1 = (-a1 + sq) / (2 * a2), s2 = (-a1 - sq) / (2 * a2), Sv = [s1, s2];
        var has = function (L, x) { return L.some(function (y) { return same(x, y); }); };
        var mine = Math.abs(D) < 1e-9 ? t(v + '=' + rT(fracOf(s1))) + ' (a double root)' : t(v + '=' + rT(fracOf(s1))) + ' and ' + t(v + '=' + rT(fracOf(s2)));
        var rational = same(fracOf(s1)[0] / fracOf(s1)[1], s1) && same(fracOf(s2)[0] / fracOf(s2)[1], s2) && fracOf(s1)[1] <= 60;
        if (sameSet(Sv, Tv.map(function (x) { return -x; })) && !sameSet(Sv, Tv)) return wrong('u4l5-eq-sign', 'Your equation has roots ' + mine + ' — the opposite signs. A root ' + t(v + '=r') + ' comes from the factor ' + t('(' + v + '-r)') + ', e.g. root ' + t('-3') + ' gives ' + t('(' + v + '+3)') + '.');
        if (Tv.every(function (x) { return !same(x, 0); }) && sameSet(Sv, Tv.map(function (x) { return 1 / x; })) && !sameSet(Sv, Tv)) return wrong('u4l5-eq-recip', 'Your equation has roots ' + mine + ' — upside down. A root ' + t(v + '=\\frac{p}{q}') + ' comes from the factor ' + t('(q' + v + '-p)') + ': e.g. ' + t(v + '=\\frac{2}{3}') + ' gives ' + t('(3' + v + '-2)') + '.');
        if (Tv.length === 2 && !same(Tv[0], Tv[1]) && (has(Sv, Tv[0]) !== has(Sv, Tv[1])) && rational) return wrong('u4l5-eq-one', 'Your equation has roots ' + mine + ': one of them is right, but check the factor for the other root.');
        if (double && rational && has(Sv, Tv[0])) return wrong('u4l5-eq-double', 'A <b>double root</b> means the same factor twice: ' + t('(' + linT(roots[0][1], -roots[0][0], v) + ')^{2}=0') + '.');
        if (rational) return wrong('value', 'Your equation has roots ' + mine + ', not the ones given. Write one factor for each root, multiply, and check.');
      }
      return wrong('value', 'Your equation doesn’t have the given roots. Write one factor for each root, then multiply them out.');
    };
  }
  /* roots: [[p, q], …] (one entry for a double root) */
  function eqPart(prompt, roots, o) {
    o = o || {}; var v = o.v || 'x', fs = roots.map(function (r) { return [r[1], -r[0]]; });
    if (roots.length === 1) fs = [fs[0], fs[0]];
    var g = 1, p = expand(1, fs), T = [p[2], p[1], p[0]], gg = gcd(gcd(T[0], T[1]), T[2]); if (gg > 1) T = T.map(function (x) { return x / gg; });
    var key = quadT(T[0], T[1], T[2], v), q = Quad(g, fs, v);
    var steps = roots.map(function (r) { return r[1] > 1 ? t(v + '=' + rT(r)) + ' gives ' + t(linT(r[1], -r[0], v) + '=0') : t(v + '=' + rT(r)) + ' gives ' + t(linT(1, -r[0], v)); });
    var sol = (o.solPre ? o.solPre + '<br>' : '') + (roots.length === 1 ? 'A double root: the factor appears twice. ' : '') + steps.join('; ') + '.<br>' + t(q.fac + '=0') + '<br>' + t(key + '=0');
    var bad = [];
    var pn = expand(1, roots.map(function (r) { return [r[1], r[0]]; }).concat(roots.length === 1 ? [[roots[0][1], roots[0][0]]] : []));
    if (!sameSet([pn[1]], [p[1]])) bad.push(quadT(pn[2], pn[1], pn[0], v));
    bad.push(quadT(2 * T[0], 2 * T[1], 2 * T[2], v));
    return { prompt: prompt, input: { type: 'math', keys: 'poly', vars: [v], after: t('=0'), placeholder: 'e.g. 2x^2 - 7x - 4' }, check: eqCheck(T, roots, v, roots.length === 1), key: key, answer: t(key + '=0'), solution: sol,
      hints: o.hints || ['Work backwards: a root ' + t(v + '=r') + ' comes from the factor ' + t('(' + v + '-r)') + '; a root ' + t(v + '=\\frac{p}{q}') + ' comes from ' + t('(q' + v + '-p)') + ', which keeps the coefficients integers.', 'Multiply the factors and write the result as ' + t('a' + v + '^{2}+b' + v + '+c=0') + '.'],
      text: o.text || 'equation from its roots', bad: bad, good: [key + '=0'] };
  }

  /* ======================= problems: number boxes ======================= */
  function numBox(ans, rejected, why) {
    return function (v) {
      if (rejected != null && rejected.some(function (x) { return same(v, x); })) return { code: 'u4l5-reject', hint: why };
      return null;
    };
  }
  function fieldsPart(prompt, fields, checkers, keys, answer, sol, hints, text) {
    var p = B.fields(prompt, fields, checkers, keys, answer, sol, hints, text); return p;
  }
  /* two answers that are each a pair of numbers (in any order, in either row) */
  function twoPairs(prompt, pA, pB, o) {
    o = o || {};
    var fields = [{ label: 'One pair:', name: 'First pair' }, { label: 'and', name: 'First pair' }, { label: 'Another pair:', name: 'Second pair' }, { label: 'and', name: 'Second pair' }];
    var check = function (resp) {
      resp = resp || []; var vals = [];
      for (var i = 0; i < 4; i++) {
        var s = String(resp[i] == null ? '' : resp[i]).trim();
        if (!s) { vals.push(null); continue; }
        var pr = HW.parse.number(s); if (!pr.ok) return form('notnumber', 'Type one integer in each box.');
        vals.push(pr.value);
      }
      if (vals.every(function (x) { return x == null; })) return form('empty', 'Type your answer first.');
      var rows = [[vals[0], vals[1]], [vals[2], vals[3]]];
      var isP = function (row, pr) { return row[0] != null && row[1] != null && sameSet(row, pr); };
      var r0 = isP(rows[0], pA) ? 'A' : isP(rows[0], pB) ? 'B' : null, r1 = isP(rows[1], pA) ? 'A' : isP(rows[1], pB) ? 'B' : null;
      if (r0 && r1 && r0 !== r1) return ok();
      if (r0 && r1) return wrong('u4l5-one-pair', 'You gave the same pair twice. The quadratic has two roots, so there are two different pairs.');
      var oneBlank = rows.some(function (rw) { return rw[0] == null && rw[1] == null; });
      if ((r0 || r1) && oneBlank) return wrong('u4l5-one-pair', 'That pair works — but the quadratic has <b>two</b> roots, and the other root gives a second pair that also works. Find it and check it.');
      if (rows.some(function (rw) { return rw[0] == null || rw[1] == null; }) && !(r0 || r1)) return form('blank', 'Fill in both numbers of each pair.');
      if (r0 || r1) return wrong('value', 'One pair is right. Check the other pair by substituting it into the condition.');
      return wrong('value', o.hint || null);
    };
    return { prompt: prompt, input: { type: 'fields', fields: fields }, check: check, key: [String(pA[0]), String(pA[1]), String(pB[0]), String(pB[1])], answer: t(pA[0] + '\\text{ and }' + pA[1]) + ', or ' + t(pB[0] + '\\text{ and }' + pB[1]),
      solution: o.sol, hints: o.hints || [], text: o.text, bad: [[String(pA[0]), String(pA[1]), '', ''], [String(pA[0]), String(pA[1]), String(pA[0]), String(pA[1])]],
      good: [[String(pB[1]), String(pB[0]), String(pA[1]), String(pA[0])]] };
  }

  /* ======================= figures ======================= */
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function svg(w, h, body, aria) { return '<svg class="fig-svg" viewBox="0 0 ' + w + ' ' + h + '" style="max-width:' + w + 'px" role="img" aria-label="' + esc(aria) + '">' + body + '</svg>'; }
  function txt(x, y, s, anchor) { return '<text x="' + x + '" y="' + y + '" font-size="14" text-anchor="' + (anchor || 'middle') + '" fill="#1c2230" font-style="' + (/^[a-z]$/.test(s) ? 'italic' : 'normal') + '">' + esc(s) + '</text>'; }
  /* L-shaped bracket: bottom edge A, left edge Bh, width shown as x */
  function lFig(A, Bh) {
    var sc = 150 / Math.max(A, Bh), w = A * sc, h = Bh * sc, th = Math.max(16, Math.min(A, Bh) * sc * 0.28), x0 = 40, y0 = 14;
    var pts = [[x0, y0 + h], [x0 + w, y0 + h], [x0 + w, y0 + h - th], [x0 + th, y0 + h - th], [x0 + th, y0], [x0, y0]].map(function (p) { return p.join(','); }).join(' ');
    var s = '<polygon points="' + pts + '" fill="#e6e2d8" stroke="#2b3340" stroke-width="2"/>';
    s += txt(x0 + w / 2, y0 + h + 20, A + ' cm') + txt(x0 - 6, y0 + h / 2 + 5, Bh + ' cm', 'end') + txt(x0 + w + 8, y0 + h - th / 2 + 5, 'x', 'start') + txt(x0 + th / 2, y0 - 3, 'x');
    return svg(x0 + w + 26, y0 + h + 30, s, 'L-shaped bracket with outer edges ' + A + ' cm and ' + Bh + ' cm and width x');
  }
  /* a rectangle with a uniform border x */
  function frameFig(Lw, Wh, inner, aria) {
    var sc = 150 / Math.max(Lw, Wh), w = Lw * sc, h = Wh * sc, b = 16, x0 = 14, y0 = 14;
    var s = '<rect x="' + x0 + '" y="' + y0 + '" width="' + (w + 2 * b) + '" height="' + (h + 2 * b) + '" fill="#e6e2d8" stroke="#2b3340" stroke-width="2"/>';
    s += '<rect x="' + (x0 + b) + '" y="' + (y0 + b) + '" width="' + w + '" height="' + h + '" fill="#ffffff" stroke="#2b3340" stroke-width="1.5"/>';
    s += txt(x0 + b + w / 2, y0 + b + h / 2 + 5, inner) + txt(x0 + b + w / 2, y0 + b + 16, Lw + ' m') + txt(x0 + b + w - 4, y0 + b + h / 2 + 22, Wh + ' m', 'end');
    s += '<line x1="' + x0 + '" y1="' + (y0 + h + 2 * b + 8) + '" x2="' + (x0 + b) + '" y2="' + (y0 + h + 2 * b + 8) + '" stroke="#2b3340"/>' + txt(x0 + b / 2, y0 + h + 2 * b + 24, 'x');
    return svg(x0 + w + 2 * b + 14, y0 + h + 2 * b + 32, s, aria);
  }

  /* ======================= generators used more than once ======================= */
  /* (v − a)(v − b) = 0 with integer roots; avoid: list of root sets to leave out */
  function intRoots(r, o) {
    o = o || {};
    return pickWhere(function () { return { a: r.pick(o.as || pm(1, 12)), b: r.pick(o.bs || pm(1, 12)) }; }, function (x) {
      if (x.a === x.b || x.a === -x.b) return false;
      if (o.signs === 'mixed' && x.a * x.b > 0) return false;
      if (o.signs === 'pos' && (x.a < 0 || x.b < 0)) return false;
      if (o.signs === 'neg' && (x.a > 0 || x.b > 0)) return false;
      return !(o.avoid || []).some(function (s) { return sameSet([x.a, x.b], s); });
    });
  }
  /* (m v + q)(v + s) with m ≥ 2 */
  function monicTimes(r, ms, avoid) {
    return pickWhere(function () { return { m: r.pick(ms), q: r.pick(pm(1, 9)), s: r.pick(pm(1, 9)) }; }, function (x) {
      return gcd(x.m, x.q) === 1 && x.m * x.s + x.q !== 0 && Math.abs(x.q) !== x.m && !(avoid || []).some(function (a) { return a[0] === x.m && a[1] === x.q && a[2] === x.s; });
    });
  }
  /* (m v + q)(n v + s) with m, n ≥ 2 */
  function twoNonUnit(r, avoid) {
    return pickWhere(function () { var mn = r.pick([[2, 3], [2, 5], [3, 4], [2, 7], [3, 5], [4, 5], [2, 9], [3, 2], [5, 2]]); return { m: mn[0], n: mn[1], q: r.pick(pm(1, 7)), s: r.pick(pm(1, 7)) }; }, function (x) {
      return gcd(x.m, x.q) === 1 && gcd(x.n, x.s) === 1 && x.m * x.s + x.n * x.q !== 0 && x.m * x.s !== x.n * x.q && !(avoid || []).some(function (a) { return a.join() === [x.m, x.q, x.n, x.s].join(); });
    });
  }
  function acLine(A, Bc, C, f1, f2) { var u = f1[0] * f2[1], w = f1[1] * f2[0]; return 'Product ' + t('ac=' + (A * C)) + ', sum ' + t(String(Bc)) + ': ' + t(String(u)) + ' and ' + t(String(w)) + '.'; }

  /* trinomial with a = 1 and both roots of the given sign pattern */
  function monicPart(r, o) {
    var x = intRoots(r, o), q = Quad(1, [[1, -x.a], [1, -x.b]], o.v);
    return solvePart(t(q.std + '=0'), [[x.a, 1], [x.b, 1]], { v: o.v, text: o.text || 'solve x² + bx + c = 0', sol: solLines(q),
      hints: ['Find two numbers that multiply to ' + t(String(q.C)) + ' and add to ' + t(String(q.B)) + '.', H_SOLVE[0]] });
  }
  function mTimesPart(r, ms, avoid, text) {
    var x = monicTimes(r, ms, avoid), q = Quad(1, [[x.m, x.q], [1, x.s]]);
    return solvePart(t(q.std + '=0'), q.roots, { text: text || 'solve ax² + bx + c = 0', sol: solLines(q, [acLine(q.A, q.B, q.C, [x.m, x.q], [1, x.s])]),
      hints: ['Use decomposition: two numbers that multiply to ' + t('ac=' + (q.A * q.C)) + ' and add to ' + t('b=' + q.B) + '.', 'One root is a fraction: ' + t(linT(x.m, x.q) + '=0') + ' gives ' + t('x=' + rT(Q(-x.q, x.m))) + '.'] });
  }
  function twoNUPart(r, avoid, text) {
    var x = twoNonUnit(r, avoid), q = Quad(1, [[x.m, x.q], [x.n, x.s]]);
    return solvePart(t(q.std + '=0'), q.roots, { text: text || 'solve ax² + bx + c = 0, two fraction roots', sol: solLines(q, [acLine(q.A, q.B, q.C, [x.m, x.q], [x.n, x.s])]),
      hints: ['Product ' + t('ac=' + (q.A * q.C)) + ', sum ' + t(String(q.B)) + ': find the pair, split the middle term and group.', H_SOLVE[0]] });
  }
  /* x² + bx = 0 */
  function gcfPart(r, avoid) {
    var b = pickWhere(function () { return r.pick(pm(2, 16)); }, function (b) { return (avoid || []).indexOf(b) < 0; }), q = Quad(1, [[1, 0], [1, b]]);
    return solvePart(t(pT([[1, 2], [b, 1]]) + '=0'), q.roots, { zero: true, text: 'solve x² + bx = 0', sol: solLines(q),
      hints: ['Both terms have a common factor of ' + t('x') + ': factor it out (don’t divide by ' + t('x') + ').', H_SOLVE[0]] });
  }
  /* a²x² − b² = 0 */
  function dosPart(r, as, avoid) {
    var x = pickWhere(function () { return { a: r.pick(as), b: r.int(1, 11) }; }, function (x) { return gcd(x.a, x.b) === 1 && !(avoid || []).some(function (a) { return a[0] === x.a && a[1] === x.b; }); });
    var q = Quad(1, [[x.a, -x.b], [x.a, x.b]]);
    return solvePart(t((x.a * x.a) + 'x^{2}-' + (x.b * x.b) + '=0'), q.roots, { text: 'difference of squares a²x² − b² = 0', sol: solLines(q, ['Difference of squares:']),
      keyTex: 'x=\\pm' + rT(Q(x.b, x.a)), cands: [{ vals: [Math.pow(x.b / x.a, 2), -Math.pow(x.b / x.a, 2)], code: 'u4l5-no-root', hint: 'Those are values of ' + t('x^{2}') + '. Factor as a difference of squares, ' + t('(' + x.a + 'x-' + x.b + ')(' + x.a + 'x+' + x.b + ')') + ', then solve each factor.' },
        { vals: [Math.pow(x.b / x.a, 2)], code: 'u4l5-no-root', hint: 'That’s the value of ' + t('x^{2}') + '. Factor as a difference of squares, then solve each factor.' }],
      hints: ['It’s a difference of squares: ' + t('(' + x.a + 'x)^{2}-' + x.b + '^{2}') + '.', 'Each factor gives one root, so there are two: a positive and a negative.'] });
  }
  /* zeros of a quadratic function y = q.std */
  function zerosShared(r) { var x = monicTimes(r, [2, 3, 5], [[2, -3, 2]]); return Quad(1, [[x.m, x.q], [1, x.s]]); }
  /* a consecutive-integer problem with two pairs */
  /* the series S_n = n/2[2a + (n − 1)d] */
  function seriesPart(r, avoid, nr) {
    var o = pickWhere(function () { return { a: r.int(1, 7), d: r.int(2, 6), n: r.int(8, 20) }; }, function (o) {
      var S = o.n * (2 * o.a + (o.n - 1) * o.d) / 2;
      return S % 1 === 0 && S <= (nr ? 9999 : 2000) && !(avoid || []).some(function (x) { return x[0] === o.a && x[1] === o.d && x[2] === o.n; }) && (2 * o.a - o.d) % o.d !== 0;
    });
    var S = o.n * (2 * o.a + (o.n - 1) * o.d) / 2, terms = [o.a, o.a + o.d, o.a + 2 * o.d];
    // d n² + (2a − d) n − 2S = 0 → (d n + (2S)/n) (n − N)… factor: (d·n + c)(n − N) with c = 2S / N
    var c = 2 * S / o.n, q = Quad(1, [[o.d, c], [1, -o.n]], 'n');
    var std = quadT(o.d, 2 * o.a - o.d, -2 * S, 'n');
    var sol = t('t_1=' + o.a + ',\\ d=' + o.d) + ': ' + t('\\frac{n}{2}\\left[' + (2 * o.a) + '+' + o.d + '(n-1)\\right]=' + S) + '<br>' + t('n\\left[' + (2 * o.a) + '+' + o.d + 'n-' + o.d + '\\right]=' + (2 * S)) + ' &nbsp;⇒&nbsp; ' + t(std + '=0') +
      '<br>' + t(q.fac + '=0') + ', so ' + t('n=' + rT(Q(-c, o.d))) + ' (reject: not a natural number) or ' + t('n=' + o.n) + '.<br>' + t(String(o.n)) + ' terms.';
    var prompt = 'How many terms of the arithmetic series ' + t(terms.join('+') + '+\\dots') + ' must be added to give a sum of ' + t(String(S)) + '? Use ' + t('S_n=\\frac{n}{2}\\left[2t_1+(n-1)d\\right]') + ' to write a quadratic equation, and solve it.';
    var diag = function (v) { if (same(v, (S - o.a) / o.d + 1)) return { code: 'value', hint: 'That’s the term number whose <b>value</b> is ' + t(String(S)) + '. Here ' + t(String(S)) + ' is the <b>sum</b>: use the series formula ' + t('S_n') + '.' }; return null; };
    var hints = ['Substitute ' + t('t_1=' + o.a) + ', ' + t('d=' + o.d) + ' and ' + t('S_n=' + S) + ' into the formula, multiply both sides by ' + t('2') + ' and expand.', 'Write it as ' + t('an^{2}+bn+c=0') + ' and factor. The number of terms is a natural number.'];
    return nr ? B.nr('The arithmetic series ' + t(terms.join('+') + '+\\dots') + ' has a sum of ' + t(String(S)) + '. The number of terms is ________.', o.n, diag, sol, hints, 'terms of a series (NR)')
      : B.number(prompt, o.n, diag, sol, hints, 'terms of an arithmetic series', { after: 'terms' });
  }

  /* ============================== the assignment ============================== */
  var QUESTIONS = [
    { num: '1', section: 'The zero product property', stem: 'Solve.', parts: [
      { id: '1a', level: 'BEG', make: function (r) {
        var x = intRoots(r, { signs: 'mixed', avoid: [[-6, 4], [8, -3]] }), q = Quad(1, r.chance(0.5) ? [[1, -x.a], [1, -x.b]] : [[1, -x.b], [1, -x.a]]);
        return solvePart(t(q.fac + '=0'), q.roots, { text: '(x − a)(x + b) = 0', sol: [q.zero, q.rootsLine].join('<br>') });
      } },
      { id: '1b', level: 'EMG', make: function (r) {
        var x = pickWhere(function () { return { m: r.int(2, 7), q: r.pick(pm(1, 9)), s: r.pick(pm(1, 9)) }; }, function (x) { return gcd(x.m, x.q) === 1 && !(x.m === 4 && x.q === 3 && x.s === -6) && !(x.m === 2 && x.q === -7); });
        var q = Quad(1, [[x.m, x.q], [1, x.s]]);
        return solvePart(t(q.fac + '=0'), q.roots, { text: '(px + q)(x − r) = 0, a fraction root', sol: [q.zero, q.rootsLine].join('<br>') });
      } },
      { id: '1c', level: 'EMG', make: function (r) {
        var x = pickWhere(function () { return { k: r.int(2, 9), m: r.int(2, 7), n: r.pick(pm(1, 11)) }; }, function (x) { return gcd(x.m, x.n) === 1 && !(x.k === 7 && x.m === 2 && x.n === 9) && x.k !== Math.abs(x.n); });
        var q = Quad(x.k, [[1, 0], [x.m, -x.n]]);
        return solvePart(t(q.fac + '=0'), q.roots, { zero: true, g: x.k, text: 'kx(mx − n) = 0', sol: [q.zero, q.rootsLine].join('<br>'),
          cands: [{ vals: [x.k, qv(Q(x.n, x.m))], code: 'u4l5-const-root', hint: t(x.k + 'x=0') + ' means ' + t('x=0') + ' (divide both sides by ' + t(String(x.k)) + '), not ' + t('x=' + x.k) + '.' }] });
      } },
      { id: '1d', level: 'EMG', make: function (r) {
        var x = pickWhere(function () { return { c: r.int(2, 6), a: r.pick(pm(1, 9)), m: r.int(2, 6), n: r.pick(pm(1, 9)) }; }, function (x) { return gcd(x.m, x.n) === 1 && !(x.c === 3 && x.a === 5 && x.m === 5 && x.n === 2) && !(x.c === 5 && x.a === 1) && x.c !== Math.abs(x.a); });
        var q = Quad(-x.c, [[1, x.a], [x.m, -x.n]]);
        return solvePart(t(q.fac + '=0'), q.roots, { g: -x.c, text: '−c(x + a)(px − q) = 0', sol: [q.zero, q.rootsLine].join('<br>') });
      } }] },
    { num: '2', section: 'Common factors and differences of squares', stem: 'Solve.', parts: [
      { id: '2a', level: 'BEG', make: function (r) { return gcfPart(r, [11]); } },
      { id: '2b', level: 'BEG', make: function (r) {
        var n = pickWhere(function () { return r.int(2, 15); }, function (n) { return n !== 12 && n !== 4; }), q = Quad(1, [[1, -n], [1, n]]);
        return solvePart(t('x^{2}-' + (n * n) + '=0'), q.roots, { text: 'x² − n² = 0', keyTex: 'x=\\pm ' + n, sol: solLines(q),
          cands: [{ vals: [n * n], code: 'u4l5-no-root', hint: 'That’s the value of ' + t('x^{2}') + '. Factor: ' + t('(x-' + n + ')(x+' + n + ')=0') + '.' }, { vals: [n * n, -n * n], code: 'u4l5-no-root', hint: 'Those are values of ' + t('x^{2}') + '. Factor as a difference of squares and solve each factor.' }],
          hints: ['Difference of squares: ' + t('x^{2}-' + (n * n) + '=(x-' + n + ')(x+' + n + ')') + '.', 'Each factor gives a root.'] });
      } },
      { id: '2c', level: 'EMG', make: function (r) { return dosPart(r, [2, 3, 4, 5, 6, 7, 8, 9, 10], [[4, 5], [7, 2]]); } },
      { id: '2d', level: 'PRG', make: function (r) {
        var x = pickWhere(function () { return { g: r.int(2, 5), p: r.int(2, 5), q: r.int(1, 7) }; }, function (x) { return gcd(x.p, x.q) === 1 && !(x.g === 2 && x.p === 3 && x.q === 2); });
        var L = x.g * x.p * x.p, Rr = x.g * x.q * x.q, q = Quad(x.g, [[x.p, -x.q], [x.p, x.q]]);
        return solvePart(t(L + 'x^{2}=' + Rr), q.roots, { text: 'kx² = m: common factor, then difference of squares', keyTex: 'x=\\pm' + rT(Q(x.q, x.p)),
          sol: [t(L + 'x^{2}-' + Rr + '=0') + ' &nbsp;⇒&nbsp; ' + t(x.g + '(' + (x.p * x.p) + 'x^{2}-' + (x.q * x.q) + ')=0'), t(q.fac + '=0'), q.rootsLine].join('<br>'),
          cands: [{ vals: [Rr / L], code: 'u4l5-no-root', hint: 'That’s the value of ' + t('x^{2}') + '. Move every term to one side and factor.' }, { vals: [Rr / L, -Rr / L], code: 'u4l5-no-root', hint: 'Those are values of ' + t('x^{2}') + '. Factor fully and solve each factor.' }], hints: H_STD });
      } },
      { id: '2e', level: 'PRG', make: function (r) {
        var x = pickWhere(function () { return { g: r.int(2, 6), m: r.int(2, 5), n: r.int(1, 9) }; }, function (x) { return gcd(x.m, x.n) === 1 && !(x.g === 4 && x.m === 2 && x.n === 3); });
        var q = Quad(x.g, [[1, 0], [-x.m, x.n]]);
        return solvePart(t((x.g * x.n) + 'x-' + (x.g * x.m) + 'x^{2}=0'), q.roots, { zero: true, text: 'cx − dx² = 0', sol: solLines(q),
          hints: ['Take out the greatest common factor, ' + t(x.g + 'x') + '.', 'Set ' + t(x.g + 'x=0') + ' and the bracket ' + t('=0') + '.'] });
      } },
      { id: '2f', level: 'PRG', make: function (r) {
        var x = pickWhere(function () { return { g: r.int(2, 5), n: r.int(2, 9) }; }, function (x) { return !(x.g === 2 && x.n === 5); });
        var q = Quad(x.g, [[-1, x.n], [1, x.n]]);
        return solvePart(t((x.g * x.n * x.n) + '-' + (x.g === 1 ? '' : x.g) + 'x^{2}=0'), q.roots, { text: 'c − kx² = 0', keyTex: 'x=\\pm ' + x.n,
          sol: [t(x.g + '(' + (x.n * x.n) + '-x^{2})=0'), t(q.fac + '=0'), q.rootsLine].join('<br>'), hints: ['Take out the common factor ' + t(String(x.g)) + ', then factor the difference of squares ' + t((x.n * x.n) + '-x^{2}') + '.', H_SOLVE[0]] });
      } }] },
    { num: '3', section: 'Factoring trinomials', stem: 'Solve.', parts: [
      { id: '3a', level: 'BEG', make: function (r) { return monicPart(r, { signs: 'pos', avoid: [[2, 7], [2, 3]], text: 'x² − bx + c = 0, two positive roots' }); } },
      { id: '3b', level: 'BEG', make: function (r) { return monicPart(r, { signs: 'mixed', avoid: [[-9, 5], [-7, 4]], text: 'x² + bx − c = 0' }); } },
      { id: '3c', level: 'EMG', make: function (r) {
        var k = pickWhere(function () { return r.pick(pm(2, 12)); }, function (k) { return k !== 8; }), q = Quad(1, [[1, k], [1, k]]);
        return solvePart(t(q.std + '=0'), q.roots, { text: 'perfect square trinomial: a double root', sol: solLines(q, ['Perfect square trinomial:']),
          hints: ['Is it a perfect square? ' + t('(x' + (k > 0 ? '+' : '-') + Math.abs(k) + ')^{2}=x^{2}' + (k > 0 ? '+' : '-') + Math.abs(2 * k) + 'x+' + (k * k)) + '.', 'Both factors are the same, so there is only one (double) root.'] });
      } },
      { id: '3d', level: 'EMG', make: function (r) { return mTimesPart(r, [2, 3, 5], [[2, -1, 5]]); } },
      { id: '3e', level: 'PRG', make: function (r) { return twoNUPart(r, [[3, 2, 2, -5]]); } },
      { id: '3f', level: 'PRG', make: function (r) {
        var x = intRoots(r, { signs: 'mixed', avoid: [[6, -4]] }), q = Quad(-1, [[1, -x.a], [1, -x.b]]);
        var shown = pT([[q.C, 0], [q.B, 1], [-1, 2]]);
        return solvePart(t(shown + '=0'), q.roots, { text: 'c + bx − x² = 0 (negative leading coefficient)', sol: [t('-(' + quadT(1, -q.B, -q.C) + ')=0'), t(q.fac + '=0'), q.rootsLine].join('<br>'),
          hints: ['Write the terms in descending order and take out ' + t('-1') + ': ' + t(shown + '=-(' + quadT(1, -q.B, -q.C) + ')') + '.', 'Then factor the trinomial in the bracket.'] });
      } }] },
    { num: '4', section: 'Standard form first', stem: 'Write each equation in standard form, then solve.', parts: [
      { id: '4a', level: 'PRG', make: function (r) {
        var x = pickWhere(function () { return monicTimes(r, [2, 3, 4, 5], [[3, -4, 2]]); }, function (x) { return x.q * x.s < 0; }), q = Quad(1, [[x.m, x.q], [1, x.s]]);
        var k = -q.C, lhs = pT([[q.A, 2], [q.B, 1]]);
        return solvePart(t(lhs + '=' + k), q.roots, { text: 'ax² + bx = c', sol: solLines(q, [t(q.std + '=0')]), hints: H_STD,
          cands: q.B ? [{ vals: [k, (k - q.B) / q.A], code: 'u4l5-set-k', hint: 'The zero product property needs ' + t('0') + ' on one side: ' + t('x(' + linT(q.A, q.B) + ')=' + k) + ' doesn’t mean a factor equals ' + t(String(k)) + '. Subtract ' + t(String(k)) + ' first.' }] : [] });
      } },
      { id: '4b', level: 'PRG', make: function (r) {
        var x = twoNonUnit(r, [[5, 1, 2, -3]]), q = Quad(1, [[x.m, x.q], [x.n, x.s]]);
        return solvePart(t(q.A + 'x^{2}=' + pT([[-q.B, 1], [-q.C, 0]])), q.roots, { text: 'ax² = bx + c', sol: solLines(q, [t(q.std + '=0'), acLine(q.A, q.B, q.C, [x.m, x.q], [x.n, x.s])]), hints: H_STD });
      } },
      { id: '4c', level: 'PRG', make: function (r) {
        var x = intRoots(r, { signs: 'mixed', avoid: [[9, -3]] }), q = Quad(1, [[1, -x.a], [1, -x.b]]);
        if (!q.B) return QUESTIONS[3].parts[2].make(r);
        var b = -q.B, c = -q.C;
        return solvePart(t('x(' + linT(1, -b) + ')=' + c), q.roots, { text: 'x(x − b) = c', sol: solLines(q, [t(quadT(1, -b, 0) + '=' + c), t(q.std + '=0')]), hints: H_STD,
          cands: [{ vals: [c, c + b], code: 'u4l5-set-k', hint: 'A product equal to ' + t(String(c)) + ' doesn’t mean a factor equals ' + t(String(c)) + '. Expand, subtract ' + t(String(c)) + ' so the right side is ' + t('0') + ', then factor.' }] });
      } },
      { id: '4d', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(1, 7), b: r.int(1, 7), m: r.pick([1, 1, 2, 3]), r1: r.pick(pm(1, 9)) }; }, function (o) {
          var s = o.b + o.m - o.a, r2 = s - o.r1, c = -o.r1 * r2 - o.a * o.b; o.r2 = r2; o.c = c;
          return r2 !== o.r1 && c !== 0 && Math.abs(r2) <= 12 && !(o.a === 4 && o.b === 2 && o.m === 1) && !(o.a === 2 && o.b === 5);
        });
        var q = Quad(1, [[1, -o.r1], [1, -o.r2]]), rhs = pT([[o.m, 1], [o.c, 0]]);
        return solvePart(t('(x+' + o.a + ')(x-' + o.b + ')=' + rhs), q.roots, { text: '(x + a)(x − b) = mx + c', hints: H_STD,
          sol: solLines(q, [t(quadT(1, o.a - o.b, -o.a * o.b) + '=' + rhs), t(q.std + '=0')]),
          cands: [{ vals: [-o.a, o.b], code: 'u4l5-ignore-k', hint: 'The right side isn’t ' + t('0') + ', so the factors on the left don’t give the roots. Expand, move every term to the left, collect like terms and factor again.' }] });
      } },
      { id: '4e', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { p: r.int(2, 5), q: r.pick(pm(1, 7)), n: r.int(2, 9) }; }, function (o) { return o.n !== Math.abs(o.q) && gcd(o.p, o.q) === 1 && !(o.p === 3 && o.q === 1 && o.n === 4) && (gcd(o.p, o.n - o.q) === o.p || gcd(o.p, o.n + o.q) === o.p || true); });
        var q = Quad(1, [[o.p, o.q - o.n], [o.p, o.q + o.n]]), A = o.p * o.p, Bc = 2 * o.p * o.q, C = o.q * o.q - o.n * o.n, g = gcd(gcd(A, Bc), Math.abs(C));
        var lines = [t(pT([[A, 2], [Bc, 1], [o.q * o.q, 0]]) + '-' + (o.n * o.n) + '=0'), t(quadT(A, Bc, C) + '=0') + (g > 1 ? ' &nbsp;⇒&nbsp; ' + t(g + '(' + quadT(A / g, Bc / g, C / g) + ')=0') : '')];
        var q2 = Quad(1, [[o.p, o.q - o.n], [o.p, o.q + o.n]]);
        if (g > 1) { var f1 = [o.p, o.q - o.n], f2 = [o.p, o.q + o.n], g1 = gcd(f1[0], f1[1]), g2 = gcd(f2[0], f2[1]); q2 = Quad(g1 * g2, [[f1[0] / g1, f1[1] / g1], [f2[0] / g2, f2[1] / g2]]); }
        var only = Q(o.n - o.q, o.p);
        return solvePart(t('(' + linT(o.p, o.q) + ')^{2}=' + (o.n * o.n)), q.roots, { text: '(px + q)² = n²', sol: solLines(q2, lines), hints: ['Expand the square: ' + t('(' + linT(o.p, o.q) + ')^{2}=' + pT([[A, 2], [Bc, 1], [o.q * o.q, 0]])) + ' (don’t forget the middle term), then subtract ' + t(String(o.n * o.n)) + '.', 'Factor fully. (Or: ' + t(linT(o.p, o.q) + '=\\pm' + o.n) + '.)'],
          cands: [{ vals: [qv(only)], code: 'sol-missing', hint: 'That root is right, but there are two: ' + t(linT(o.p, o.q) + '=' + o.n) + ' <b>or</b> ' + t(linT(o.p, o.q) + '=-' + o.n) + '.' }] });
      } },
      { id: '4f', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { a: r.pick(pm(1, 8)), b: r.pick(pm(1, 8)), c: r.int(2, 6) }; }, function (o) { return o.c - o.b !== o.a && o.a !== -o.b && !(o.a === 2 && o.b === 5 && o.c === 4) && !(o.a === 4 && o.b === 1 && o.c === 2); });
        var q = Quad(1, [[1, -o.a], [1, o.b - o.c]]), lhs = '(' + linT(1, -o.a) + ')(' + linT(1, o.b) + ')';
        var exp = quadT(1, o.b - o.a, -o.a * o.b) + pT([[-o.c, 1], [o.c * o.a, 0]]).replace(/^(?=[^-])/, '+');
        return solvePart(t(lhs + '=' + o.c + '(' + linT(1, -o.a) + ')'), q.roots, { text: '(x − a)(x + b) = c(x − a): don’t divide by the bracket', hints: H_STD,
          sol: solLines(q, [t(exp + '=0'), t(q.std + '=0')], ['(Dividing by ' + t(linT(1, -o.a)) + ' would lose ' + t('x=' + o.a) + '.)']),
          lost: { val: o.a, hint: 'You’ve lost a root: dividing both sides by ' + t('(' + linT(1, -o.a) + ')') + ' throws away ' + t('x=' + o.a) + ' (that bracket could be ' + t('0') + '). Expand, move everything to one side and factor instead.' } });
      } },
      { id: '4g', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { p: r.int(2, 5), q: r.pick(pm(1, 9)) }; }, function (o) { return gcd(o.p, o.q) === 1 && !(o.p === 2 && o.q === 5) && !(o.p === 3 && o.q === -2); });
        var q = Quad(1, [[o.p, -o.q], [o.p, -o.q]]);
        return solvePart(t(pT([[-o.p * o.p, 2], [2 * o.p * o.q, 1]]) + '=' + (o.q * o.q)), q.roots, { text: '−p²x² + 2pqx = q²: a double root', hints: H_STD.concat(['It’s a perfect square trinomial once the ' + t('x^{2}') + ' coefficient is positive.']),
          sol: solLines(q, [t(quadT(-o.p * o.p, 2 * o.p * o.q, -o.q * o.q) + '=0') + ' &nbsp;⇒&nbsp; ' + t(q.std + '=0') + ' (multiply by ' + t('-1') + ')']) });
      } },
      { id: '4h', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { d: r.pick([2, 3, 4, 5]), r1: r.pick(pm(1, 12)), r2: r.pick(pm(1, 12)) }; }, function (o) {
          return o.r1 !== o.r2 && (o.r1 + o.r2) % o.d === 0 && (o.r1 * o.r2) % o.d === 0 && o.r1 + o.r2 !== 0 && !(o.d === 3 && [o.r1, o.r2].sort().join() === [-6, 3].sort().join()) && !(o.d === 4 && [o.r1, o.r2].sort().join() === [6, -2].sort().join());
        });
        var q = Quad(1, [[1, -o.r1], [1, -o.r2]]), shown = pT([[[1, o.d], 2], [-(o.r1 + o.r2) / o.d, 1], [o.r1 * o.r2 / o.d, 0]]);
        return solvePart(t(shown + '=0'), q.roots, { text: 'fraction coefficient: multiply by the LCD', hints: ['Clear the fraction first: multiply every term by ' + t(String(o.d)) + '.', 'Then factor the trinomial.'],
          sol: solLines(q, ['Multiply by ' + t(String(o.d)) + ': ' + t(q.std + '=0')]) });
      } },
      { id: '4i', level: 'PRG', make: function (r) {
        var v = r.pick(['m', 'k', 'n']), x = twoNonUnit(r, [[4, -3, 2, 1]]), q = Quad(1, [[x.m, x.q], [x.n, x.s]], v);
        if (!q.B) return QUESTIONS[3].parts[8].make(r);
        return solvePart(t(pT([[q.A, 2], [q.C, 0]], v) + '=' + pT([[-q.B, 1]], v)), q.roots, { v: v, text: 'am² + c = bm', hints: H_STD,
          sol: solLines(q, [t(q.std + '=0'), acLine(q.A, q.B, q.C, [x.m, x.q], [x.n, x.s])]) });
      } }] },
    { num: '5', parts: [
      { id: '5', level: 'ADV', make: function (r) {
        var x = pickWhere(function () { return monicTimes(r, [2, 3], [[2, -1, 5]]); }, function (x) { return x.m * x.s + x.q !== 0; });
        var q = Quad(1, [[x.m, x.q], [1, x.s]], 'p'), A1 = r.int(1, q.A - 1), A2 = q.A - A1;
        var lhs = pT([[-q.C, 0], [-q.B, 1], [-A1, 2]], 'p'), rhs = pT([[A2, 2]], 'p');
        return solvePart('Solve ' + t(lhs + '=' + rhs) + '.', q.roots, { v: 'p', text: 'collect terms from both sides', hints: ['Move every term to the side where the ' + t('p^{2}') + ' term stays positive: add ' + t(pT([[A1, 2], [q.B, 1], [q.C, 0]], 'p')) + ' to both sides.', 'Then factor ' + t(q.std) + '.'],
          sol: solLines(q, [t('0=' + q.std)]) });
      } }] },
    { num: '6', section: 'Roots, zeros and x-intercepts', stem: function (s) { return 'Consider the function ' + t('y=' + s.std) + '.'; }, shared: zerosShared, parts: [
      { id: '6a', level: 'PRG', make: function (r, s) {
        return solvePart('Determine the zeros of the function.', s.roots, { text: 'zeros of a quadratic function', sol: [t(s.std + '=0') + ' &nbsp;⇒&nbsp; ' + t(s.fac + '=0'), 'Zeros: ' + s.roots.map(function (x) { return t(rT(x)); }).join(' and ')].join('<br>'),
          hints: ['The zeros are the ' + t('x') + '-values that make ' + t('y=0') + ': solve ' + t(s.std + '=0') + '.', H_SOLVE[0]] });
      } },
      { id: '6b', level: 'EMG', make: function (r, s) {
        var pts = s.roots.map(function (x) { return [qv(x), 0]; }), key = '\\{' + s.roots.map(function (x) { return '(' + rT(x) + ', 0)'; }).join(', ') + '\\}';
        return { prompt: 'State the ' + t('x') + '-intercepts of its graph as points. (They are also the roots of ' + t(s.std + '=0') + '.)', input: { type: 'math', keys: 'pairs', placeholder: 'e.g. {(1, 0), (-4, 0)}' }, check: K.pairs(pts), key: key, answer: t(key),
          solution: t('x') + '-intercepts ' + s.roots.map(function (x) { return t('(' + rT(x) + ',\\ 0)'); }).join(' and ') + '; roots ' + s.roots.map(function (x) { return t('x=' + rT(x)); }).join(' and ') + '. The zeros, roots and ' + t('x') + '-intercepts are the same numbers.',
          hints: ['An ' + t('x') + '-intercept is a point on the ' + t('x') + '-axis, so its ' + t('y') + '-coordinate is ' + t('0') + '.', 'Use the zeros from part (a).'], text: 'x-intercepts as points', bad: ['\\{' + s.roots.map(function (x) { return '(0, ' + rT(x) + ')'; }).join(', ') + '\\}'] };
      } }] },
    { num: '7', section: 'Writing an equation from its roots', stem: 'Write a quadratic equation in standard form, with integer coefficients, that has the given roots.', parts: [
      { id: '7a', level: 'EMG', make: function (r) { var x = intRoots(r, { signs: 'mixed', avoid: [[6, -2], [5, -3]] }); return eqPart(t(x.a) + ' and ' + t(x.b), [[x.a, 1], [x.b, 1]], { text: 'equation from two integer roots' }); } },
      { id: '7b', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { q: r.int(2, 5), p: r.int(1, 7), s: r.pick(pm(1, 7)) }; }, function (o) { return gcd(o.p, o.q) === 1 && !(o.q === 4 && o.p === 3 && o.s === 2) && !(o.q === 2 && o.p === 1 && o.s === 4); });
        return eqPart(t('-' + rT(Q(o.p, o.q))) + ' and ' + t(String(o.s)), [[-o.p, o.q], [o.s, 1]], { text: 'equation from a fraction root and an integer root' });
      } },
      { id: '7c', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { q: r.int(2, 5), p: r.pick(pm(1, 9)) }; }, function (o) { return gcd(o.p, o.q) === 1 && !(o.q === 2 && o.p === 5) && !(o.q === 3 && o.p === -7); });
        return eqPart(t('0') + ' and ' + t(rT(Q(o.p, o.q))), [[0, 1], [o.p, o.q]], { text: 'equation with roots 0 and a fraction' });
      } },
      { id: '7d', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { q: r.int(2, 5), p: r.pick(pm(1, 7)) }; }, function (o) { return gcd(o.p, o.q) === 1 && !(o.q === 3 && o.p === -2) && !(o.q === 5 && o.p === 3); });
        return eqPart('a double root of ' + t(rT(Q(o.p, o.q))), [[o.p, o.q]], { text: 'equation with a double root' });
      } },
      { id: '7e', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { q: r.int(2, 6), p: r.int(1, 11) }; }, function (o) { return gcd(o.p, o.q) === 1 && !(o.q === 3 && o.p === 7); });
        return eqPart(t(rT(Q(o.p, o.q))) + ' and ' + t('-' + rT(Q(o.p, o.q))), [[o.p, o.q], [-o.p, o.q]], { text: 'equation with roots ±p/q' });
      } }] },
    { num: '8', section: 'Problems that lead to a quadratic equation', stem: 'Write an equation and solve it.', parts: [
      { id: '8a', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { odd: r.chance(0.4), n: r.int(3, 21) }; }, function (o) { return (o.n % 2 === 1) === o.odd && !(o.n === 12 && !o.odd) && o.n !== 11; });
        var n = o.n, S = n * n + (n + 2) * (n + 2), half = (S - 4) / 2, q = Quad(1, [[1, n + 2], [1, -n]], 'n');
        var sol = 'Let the integers be ' + t('n') + ' and ' + t('n+2') + '.<br>' + t('n^{2}+(n+2)^{2}=' + S) + ' &nbsp;⇒&nbsp; ' + t('2n^{2}+4n+4=' + S) + '<br>' + t('2n^{2}+4n-' + (S - 4) + '=0') + ' &nbsp;⇒&nbsp; ' + t('n^{2}+2n-' + half + '=0') +
          '<br>' + t(q.fac + '=0') + ', so ' + t('n=' + (-n - 2)) + ' or ' + t('n=' + n) + '.<br>The integers are ' + t(n + '\\text{ and }' + (n + 2)) + ', or ' + t((-n - 2) + '\\text{ and }' + (-n)) + '.';
        return twoPairs('The sum of the squares of two consecutive ' + (o.odd ? 'odd' : 'even') + ' integers is ' + t(String(S)) + '. Determine the integers. (There are two possible pairs.)', [n, n + 2], [-n - 2, -n],
          { text: 'consecutive ' + (o.odd ? 'odd' : 'even') + ' integers: sum of squares', sol: sol, hints: ['Let the integers be ' + t('n') + ' and ' + t('n+2') + ', and write ' + t('n^{2}+(n+2)^{2}=' + S) + '.', 'Expand, put it in standard form, divide by the common factor and factor. Each root gives a pair.'] });
      } },
      { id: '8b', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { k: r.pick([2, 3, 4]), rr: r.int(2, 9), a: r.int(1, 15) }; }, function (o) { return gcd(o.a, o.k) === 1 && o.a % o.k !== 0 && o.k * o.rr - o.a > 0 && !(o.k === 2 && o.rr === 5 && o.a === 7); });
        var c = o.k * o.rr - o.a, Pp = o.a * o.rr, q = Quad(1, [[o.k, o.a], [1, -o.rr]]), neg = Q(-o.a, o.k);
        return B.number('A positive number is multiplied by ' + t(String(c)) + ' less than ' + ['', '', 'twice', 'three times', 'four times'][o.k] + ' the number. The product is ' + t(String(Pp)) + '. Determine the number.', o.rr,
          numBox(o.rr, [qv(neg)], 'That root must be rejected: the number is <b>positive</b>.'),
          t('x(' + linT(o.k, -c) + ')=' + Pp) + ' &nbsp;⇒&nbsp; ' + t(quadT(o.k, -c, -Pp) + '=0') + '<br>' + t(q.fac + '=0') + ', ' + t('x=' + rT(neg)) + ' (reject: not positive) or ' + t('x=' + o.rr) + '.<br>The number is ' + t(String(o.rr)) + '.',
          ['Let the number be ' + t('x') + '. "' + c + ' less than ' + ['', '', 'twice', 'three times', 'four times'][o.k] + ' the number" is ' + t(linT(o.k, -c)) + '.', 'Write ' + t('x(' + linT(o.k, -c) + ')=' + Pp) + ', put it in standard form and factor. Reject a root that isn’t positive.'], 'number problem with a rejected root');
      } }] },
    { num: '9', parts: [
      { id: '9', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { k: r.pick([2, 3, 4]), w: r.int(3, 12), a: r.int(1, 20), more: r.chance(0.35) }; }, function (o) {
          var c = o.more ? o.a - o.k * o.w : o.k * o.w - o.a; return gcd(o.a, o.k) === 1 && o.a % o.k !== 0 && c > 0 && c < 15 && !(o.k === 3 && o.w === 8 && o.a === 20 && !o.more) && !(o.k === 2 && o.w === 5 && o.more && c === 3);
        });
        var c = o.more ? o.a - o.k * o.w : o.k * o.w - o.a, Lh = o.more ? o.k * o.w + c : o.k * o.w - c, A = o.w * Lh, Pm = 2 * (o.w + Lh);
        var lenT = o.more ? linT(o.k, c, 'w') : linT(o.k, -c, 'w'), q = Quad(1, [[o.k, o.a], [1, -o.w]], 'w');
        var rej = Q(-o.a, o.k), times = ['', '', 'twice', 'three times', 'four times'][o.k];
        var fields = [{ label: 'Width:', name: 'Width', after: 'cm' }, { label: 'Length:', name: 'Length', after: 'cm' }, { label: 'Perimeter:', name: 'Perimeter', after: 'cm' }];
        var ck = [K.number(o.w, numBox(o.w, [qv(rej)], 'A width can’t be negative: reject that root.')), K.number(Lh, function (v) { return same(v, o.w) ? { code: 'swap-answer', hint: 'That’s the width. The length is ' + t(lenT) + '.' } : null; }),
          K.number(Pm, function (v) { return same(v, o.w + Lh) ? { code: 'u4l5-perim', hint: 'A rectangle has two lengths and two widths: ' + t('P=2(l+w)') + '.' } : same(v, A) ? { code: 'value', hint: 'That’s the area. The perimeter is ' + t('2(l+w)') + '.' } : null; })];
        var p = B.fields('The length of a rectangular poster is ' + t(String(c)) + ' cm ' + (o.more ? 'more' : 'less') + ' than ' + times + ' its width. Its area is ' + t(A + '\\text{ cm}^{2}') + '. Determine the dimensions and the perimeter of the poster.', fields, ck, [String(o.w), String(Lh), String(Pm)],
          t('w=' + o.w) + ' cm, length ' + t(String(Lh)) + ' cm, perimeter ' + t(String(Pm)) + ' cm',
          'Width ' + t('w') + ', length ' + t(lenT) + '.<br>' + t('w(' + lenT + ')=' + A) + ' &nbsp;⇒&nbsp; ' + t(quadT(o.k, o.more ? c : -c, -A, 'w') + '=0') + '<br>' + t(q.fac + '=0') + ', ' + t('w=' + rT(rej)) + ' (reject) or ' + t('w=' + o.w) + '.<br>The poster is ' + t(String(o.w)) + ' cm by ' + t(String(Lh)) + ' cm; perimeter ' + t('=2(' + o.w + '+' + Lh + ')=' + Pm) + ' cm.',
          ['Let the width be ' + t('w') + '; then the length is ' + t(lenT) + '.', 'Area: ' + t('w(' + lenT + ')=' + A) + '. Put it in standard form, factor, and reject the negative root.'], 'rectangle dimensions from its area');
        p.bad = [[String(o.w), String(Lh), String(o.w + Lh)]]; return p;
      } }] },
    { num: '10', parts: [
      { id: '10', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { h: r.int(5, 20), s: r.int(2, 16), longer: r.chance(0.35) }; }, function (o) { var c = o.longer ? o.s - o.h : o.h - o.s; return c > 0 && (o.h * o.s) % 2 === 0 && !(o.h === 14 && o.s === 8) && c <= 10; });
        var c = o.longer ? o.s - o.h : o.h - o.s, base = o.longer ? o.h + c : o.h - c, A = o.h * base / 2;
        var bT = o.longer ? linT(1, c, 'h') : linT(1, -c, 'h'), q = Quad(1, [[1, -o.h], [1, o.s]], 'h');
        var half = function (v) { return same(v * (o.longer ? v + c : v - c), A) ? { code: 'u4l5-half', hint: 'The area of a triangle is ' + t('\\frac{1}{2}bh') + ' — don’t forget the ' + t('\\frac{1}{2}') + '.' } : null; };
        var fields = [{ label: 'Base:', name: 'Base', after: 'm' }, { label: 'Height:', name: 'Height', after: 'm' }];
        var p = B.fields('The base of a triangle is ' + t(String(c)) + ' m ' + (o.longer ? 'longer' : 'shorter') + ' than its height. The area of the triangle is ' + t(A + '\\text{ m}^{2}') + '. Determine the base and the height.', fields,
          [K.number(base, function (v) { return same(v, o.h) ? { code: 'swap-answer', hint: 'That’s the height. The base is ' + t(bT) + '.' } : half(v - (o.longer ? c : -c)); }), K.number(o.h, function (v) { return same(v, -o.s) ? { code: 'u4l5-reject', hint: 'A length can’t be negative: reject that root.' } : half(v); })],
          [String(base), String(o.h)], 'base ' + t(String(base)) + ' m, height ' + t(String(o.h)) + ' m',
          'Height ' + t('h') + ', base ' + t(bT) + '.<br>' + t('\\frac{1}{2}h(' + bT + ')=' + A) + ' &nbsp;⇒&nbsp; ' + t(quadT(1, o.longer ? c : -c, -2 * A, 'h') + '=0') + '<br>' + t(q.fac + '=0') + ', ' + t('h=' + o.h) + ' or ' + t('h=' + (-o.s)) + ' (reject).<br>Height ' + t(String(o.h)) + ' m, base ' + t(String(base)) + ' m.',
          ['Let the height be ' + t('h') + '; the base is ' + t(bT) + '.', 'Use ' + t('A=\\frac{1}{2}bh') + ', multiply both sides by ' + t('2') + ', and factor.'], 'triangle base and height from its area');
        p.bad = [[String(o.h), String(base)]]; return p;
      } }] },
    { num: '11', stem: function (s) { return 'A metal bracket is an L-shape of uniform width ' + t('x') + ' cm. Its outer edges are ' + t(String(s.A)) + ' cm and ' + t(String(s.Bh)) + ' cm long, as shown.<br>' + lFig(s.A, s.Bh); },
      shared: function (r) { return pickWhere(function () { return { A: r.int(8, 16), Bh: r.int(6, 12), x: r.int(1, 5) }; }, function (o) { return o.A !== o.Bh && o.x < Math.min(o.A, o.Bh) - 1 && !(o.A === 12 && o.Bh === 9); }); }, parts: [
      { id: '11a', level: 'EMG', make: function (r, s) {
        var S = s.A + s.Bh;
        return B.mc(r, 'Which expression gives the area of the bracket, in square centimetres?', [
          { html: t(S + 'x-x^{2}'), right: true },
          { html: t(S + 'x'), why: 'That counts the corner square twice: split the shape into a ' + t(s.A + '\\times x') + ' strip and a ' + t('(' + s.Bh + '-x)\\times x') + ' strip.' },
          { html: t(S + 'x+x^{2}'), why: 'The corner square is counted twice in ' + t(S + 'x') + ', so it must be <b>subtracted</b> once, not added.' },
          { html: t((s.A * s.Bh) + '-x^{2}'), why: 'That’s the whole outer rectangle minus a square of side ' + t('x') + '. The missing piece is ' + t('(' + s.A + '-x)(' + s.Bh + '-x)') + ', not ' + t('x^{2}') + '.' }],
          'Split it into a ' + t(s.A) + ' by ' + t('x') + ' strip along the bottom and a ' + t('(' + s.Bh + '-x)') + ' by ' + t('x') + ' strip up the side.<br>Area ' + t('=' + s.A + 'x+x(' + s.Bh + '-x)=' + s.A + 'x+' + s.Bh + 'x-x^{2}=' + S + 'x-x^{2}') + '.',
          ['Split the L into two rectangles that don’t overlap.', 'The upright strip is only ' + t(s.Bh + '-x') + ' tall above the bottom strip.'], 'area expression for an L-shape');
      } },
      { id: '11b', level: 'ADV', make: function (r, s) {
        var S = s.A + s.Bh, Ar = S * s.x - s.x * s.x, big = S - s.x, q = Quad(1, [[1, -s.x], [1, -big]]);
        return B.number('The area of the bracket is ' + t(Ar + '\\text{ cm}^{2}') + '. Determine ' + t('x') + ', and explain why one root is rejected.', s.x,
          numBox(s.x, [big], 'If ' + t('x=' + big) + ', the width would be more than the bracket’s edges (' + t(s.Bh + '-' + big) + ' is negative). Reject it.'),
          t(S + 'x-x^{2}=' + Ar) + ' &nbsp;⇒&nbsp; ' + t(q.std + '=0') + '<br>' + t(q.fac + '=0') + ', ' + t('x=' + s.x) + ' or ' + t('x=' + big) + '.<br>Reject ' + t(String(big)) + ': the width must be less than ' + t(String(Math.min(s.A, s.Bh))) + ' cm. So ' + t('x=' + s.x) + ' cm.',
          ['Set ' + t(S + 'x-x^{2}=' + Ar) + ' and move everything to one side (keep ' + t('x^{2}') + ' positive).', 'Both roots are positive — which one fits inside a bracket with edges ' + s.A + ' cm and ' + s.Bh + ' cm?'], 'L-shape width from its area', { after: 'cm' });
      } }] },
    { num: '12', stem: function (s) { return 'A stone is thrown upward from the top of a ' + t(String(s.H)) + ' m cliff. Its height above the water below is ' + t('h=' + quadT(-5, s.b, s.H, 't')) + ' metres after ' + t('t') + ' seconds.'; },
      shared: function (r) { var o = pickWhere(function () { return { T: r.int(3, 8), s: r.int(1, 7) }; }, function (o) { return o.s < o.T && !(o.T === 5 && (o.s === 3 || o.s === 1)); }); o.b = 5 * (o.T - o.s); o.H = 5 * o.T * o.s; return o; }, parts: [
      { id: '12a', level: 'PRG', make: function (r, s) {
        var q = Quad(1, [[1, -s.T], [1, s.s]], 't');
        return B.number('When does the stone hit the water?', s.T, numBox(s.T, [-s.s], 'Time after the throw can’t be negative: reject that root.'),
          t(quadT(-5, s.b, s.H, 't') + '=0') + ' &nbsp;⇒&nbsp; ' + t(q.std + '=0') + ' (divide by ' + t('-5') + ')<br>' + t(q.fac + '=0') + ', ' + t('t=' + s.T) + ' or ' + t('t=' + (-s.s)) + ' (reject). It hits the water after ' + t(String(s.T)) + ' s.',
          ['The water is at ' + t('h=0') + '.', 'Divide every term by ' + t('-5') + ', then factor.'], 'projectile: when it lands', { after: 's' });
      } },
      { id: '12b', level: 'ADV', make: function (r, s) {
        var t2 = s.T - s.s;
        return solvePart('At what times is the stone ' + t(String(s.H)) + ' m above the water? (Then think about what each answer means.)', [[0, 1], [t2, 1]], { v: 't', text: 'projectile: times at a given height', zero: true,
          sol: t(quadT(-5, s.b, s.H, 't') + '=' + s.H) + ' &nbsp;⇒&nbsp; ' + t(quadT(-5, s.b, 0, 't') + '=0') + ' &nbsp;⇒&nbsp; ' + t('-5t(t-' + t2 + ')=0') + '<br>' + t('t=0') + ' (the moment it is thrown) and ' + t('t=' + t2) + ' s (passing the cliff top on the way down).',
          hints: ['Set ' + t('h=' + s.H) + ' and subtract ' + t(String(s.H)) + ' from both sides.', 'Take out the common factor ' + t('-5t') + ' — don’t divide by ' + t('t') + '.'] });
      } }] },
    { num: '13', parts: [{ id: '13', level: 'MAS', make: function (r) { return seriesPart(r, [[3, 4, 12], [5, 4, 10]]); } }] },
    { num: '14', section: 'Multiple choice and numerical response', parts: [
      { id: '14', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { k: r.int(2, 7), m: r.int(2, 9) }; }, function (o) { return !(o.k === 3 && o.m === 4); });
        var sq = Math.round(Math.sqrt(o.m)) * Math.round(Math.sqrt(o.m)) === o.m;
        return B.mc(r, 'The roots of ' + t(o.k + 'x^{2}=' + (o.k * o.m) + 'x') + ' are', [
          { html: t(o.m) + ' only', why: 'Dividing both sides by ' + t('x') + ' loses the root ' + t('x=0') + '. Move everything to one side and factor out ' + t(o.k + 'x') + '.' },
          { html: t('0') + ' and ' + t(String(o.m)), right: true },
          { html: t('0') + ' and ' + t(String(-o.m)), why: t('x-' + o.m + '=0') + ' gives ' + t('x=' + o.m) + ', not ' + t(String(-o.m)) + '.' },
          { html: t(sq ? Math.round(Math.sqrt(o.m)) + '\\text{ and }-' + Math.round(Math.sqrt(o.m)) : o.m + '\\text{ and }-' + o.m), why: 'This isn’t a difference of squares: the right side has an ' + t('x') + ' term. Factor out ' + t(o.k + 'x') + '.' }],
          t(o.k + 'x^{2}-' + (o.k * o.m) + 'x=0') + ' &nbsp;⇒&nbsp; ' + t(o.k + 'x(x-' + o.m + ')=0') + ', so ' + t('x=0') + ' or ' + t('x=' + o.m) + '. (Dividing by ' + t('x') + ' loses ' + t('x=0') + '.)', H_STD, 'MC: roots of ax² = bx');
      } }] },
    { num: '15', parts: [
      { id: '15', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { q: r.int(2, 5), p: r.int(1, 7), s: r.int(1, 7) }; }, function (o) { return gcd(o.p, o.q) === 1 && !(o.q === 5 && o.p === 2 && o.s === 3) && o.p !== o.q * o.s; });
        var c = function (A, Bc, C) { return t(quadT(A, Bc, C) + '=0'); };
        return B.mc(r, 'A quadratic equation with roots ' + t('-' + rT(Q(o.p, o.q))) + ' and ' + t(String(o.s)) + ' is', [
          { html: c(o.q, o.p - o.q * o.s, -o.p * o.s), right: true },
          { html: c(o.q, o.q * o.s - o.p, -o.p * o.s), why: 'That has roots ' + t(rT(Q(o.p, o.q))) + ' and ' + t(String(-o.s)) + ': both signs are opposite.' },
          { html: c(o.q, -(o.q * o.s + o.p), o.p * o.s), why: 'That has roots ' + t(rT(Q(o.p, o.q))) + ' and ' + t(String(o.s)) + ': the root ' + t('-' + rT(Q(o.p, o.q))) + ' comes from ' + t('(' + linT(o.q, o.p) + ')') + '.' },
          { html: c(1, o.p - o.q * o.s, -o.p * o.s), why: 'The factor for ' + t('x=-' + rT(Q(o.p, o.q))) + ' is ' + t('(' + linT(o.q, o.p) + ')') + ', so the ' + t('x^{2}') + ' coefficient is ' + t(String(o.q)) + '. Multiply the factors carefully.' }],
          t('(' + linT(o.q, o.p) + ')(x-' + o.s + ')=' + quadT(o.q, -o.q * o.s, 0) + pT([[o.p, 1], [-o.p * o.s, 0]]).replace(/^(?=[^-])/, '+') + '=' + quadT(o.q, o.p - o.q * o.s, -o.p * o.s)), ['Root ' + t('-' + rT(Q(o.p, o.q))) + ' ⇒ factor ' + t('(' + linT(o.q, o.p) + ')') + '; root ' + t(String(o.s)) + ' ⇒ factor ' + t('(x-' + o.s + ')') + '.', 'Multiply the two factors.'], 'MC: equation from its roots');
      } }] },
    { num: '16', parts: [
      { id: '16', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(1, 7), b: r.int(1, 7), r1: r.pick(pm(1, 9)) }; }, function (o) {
          o.r2 = o.a - o.b - o.r1; o.k = -o.a * o.b - o.r1 * o.r2;
          var sets = [[o.a, -o.b], [o.a + o.k, o.k - o.b], [-o.r1, -o.r2], [o.r1, o.r2]];
          return o.k > 0 && o.k <= 30 && o.r1 !== o.r2 && !(o.a === 3 && o.b === 2) && o.r1 > o.r2 && sets.every(function (u, i) { return sets.every(function (w, j) { return i === j || !sameSet(u, w); }); });
        });
        var opt = function (u, w) { return t(u) + ' and ' + t(w); };
        return B.mc(r, 'The solutions of ' + t('(x-' + o.a + ')(x+' + o.b + ')=' + o.k) + ' are', [
          { html: opt(o.a, -o.b), why: 'Those solve ' + t('(x-' + o.a + ')(x+' + o.b + ')=0') + '. The right side is ' + t(String(o.k)) + ', not ' + t('0') + '.' },
          { html: opt(o.a + o.k, o.k - o.b), why: 'Setting each factor equal to ' + t(String(o.k)) + ' doesn’t work: only a product equal to ' + t('0') + ' tells you a factor is ' + t('0') + '.' },
          { html: opt(-o.r1, -o.r2), why: 'Check the signs: ' + t('(x-' + o.r1 + ')') + ' gives ' + t('x=' + o.r1) + '.' },
          { html: opt(o.r1, o.r2), right: true }],
          t(quadT(1, o.b - o.a, -o.a * o.b) + '=' + o.k) + ' &nbsp;⇒&nbsp; ' + t(quadT(1, o.b - o.a, -o.a * o.b - o.k) + '=0') + ' &nbsp;⇒&nbsp; ' + t('(' + linT(1, -o.r1) + ')(' + linT(1, -o.r2) + ')=0') + ', so ' + t('x=' + o.r1) + ' or ' + t('x=' + o.r2) + '.', H_STD, 'MC: product equal to a non-zero number');
      } }] },
    { num: '17', parts: [
      { id: '17', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { q1: r.int(2, 5), p1: r.int(1, 7), q2: r.int(2, 5), p2: r.int(1, 7) }; }, function (o) {
          var s = o.p1 / o.q1 + o.p2 / o.q2; return gcd(o.p1, o.q1) === 1 && gcd(o.p2, o.q2) === 1 && o.q1 !== o.q2 && o.p1 / o.q1 < 2 && o.p2 / o.q2 < 2 && s < 9.99 && o.q1 * o.p2 !== o.q2 * o.p1 && !(o.p1 === 2 && o.q1 === 3 && o.p2 === 3 && o.q2 === 4) && Math.abs(K.roundTo(s, 2) * 100 - s * 100) > 1e-6;
        });
        var A = o.q1 * o.q2, Bc = o.q1 * o.p2 - o.q2 * o.p1, C = -o.p1 * o.p2, s = o.p1 / o.q1 + o.p2 / o.q2;
        var q = Quad(1, [[o.q2, o.p2], [o.q1, -o.p1]]), want = K.roundTo(s, 2);
        var p = { prompt: 'The equation ' + t(quadT(A, Bc, C) + '=0') + ' has roots ' + t('x=a') + ' and ' + t('x=-b') + ', where ' + t('a') + ' and ' + t('b') + ' are positive. The value of ' + t('a+b') + ', to the nearest hundredth, is ________.',
          input: { type: 'number', nr: true }, check: K.approx(s, 2, { nr: true, diag: function (v) { return same(K.roundTo(v, 2), K.roundTo(Math.abs(o.p1 / o.q1 - o.p2 / o.q2), 2)) ? { code: 'u4l5-nr-diff', hint: t('b') + ' is positive (the root is ' + t('-b') + '), so add the two sizes: ' + t('a+b') + '.' } : null; } }),
          key: want.toFixed(2), answer: t(want.toFixed(2)), solution: t('ac=' + (A * C)) + ': ' + t(String(o.q1 * o.p2)) + ' and ' + t(String(-o.q2 * o.p1)) + '. ' + t(q.fac + '=0') + '<br>' + t('x=' + rT(Q(o.p1, o.q1))) + ' or ' + t('x=-' + rT(Q(o.p2, o.q2))) + ', so ' + t('a=' + rT(Q(o.p1, o.q1))) + ', ' + t('b=' + rT(Q(o.p2, o.q2))) + ', and ' + t('a+b=' + rT(Q(o.p1 * o.q2 + o.p2 * o.q1, o.q1 * o.q2)) + '\\approx ' + want.toFixed(2)) + '.',
          hints: ['Factor by decomposition (product ' + t('ac=' + (A * C)) + ') and find both roots as fractions.', 'The negative root is ' + t('-b') + ', so ' + t('b') + ' is its size. Add, then round.'], text: 'NR: sum of root sizes' };
        return p;
      } }] },
    { num: '18', parts: [
      { id: '18', level: 'PRG', make: function (r) {
        var n = pickWhere(function () { return r.int(7, 22); }, function (n) { return n !== 12 && n * (n - 3) / 2 <= 9999; }), D = n * (n - 3) / 2, q = Quad(1, [[1, -n], [1, n - 3]], 'n');
        return B.nr('A polygon with ' + t('n') + ' sides has ' + t('\\dfrac{n(n-3)}{2}') + ' diagonals. A polygon has ' + t(String(D)) + ' diagonals. The number of sides is ________.', n, null,
          t('\\frac{n(n-3)}{2}=' + D) + ' &nbsp;⇒&nbsp; ' + t('n^{2}-3n-' + (2 * D) + '=0') + ' &nbsp;⇒&nbsp; ' + t(q.fac + '=0') + '<br>' + t('n=' + n) + ' (' + t('n=' + (3 - n)) + ' is rejected).',
          ['Multiply both sides by ' + t('2') + ', expand and put it in standard form.', 'Factor; a number of sides is a positive whole number.'], 'NR: polygon diagonals');
      } }] }
  ];

  /* ============================== the extra practice ============================== */
  var EXTRA = [
    { num: 'A1', section: 'A. Skills', stem: 'Solve.', parts: [
      { id: 'A1a', level: 'BEG', make: function (r) {
        var x = pickWhere(function () { return { a: r.pick(pm(1, 12)), m: r.int(2, 5), n: r.pick(pm(1, 9)) }; }, function (x) { return gcd(x.m, x.n) === 1 && !(x.a === 9 && x.m === 2 && x.n === 1); });
        var q = Quad(1, [[1, x.a], [x.m, -x.n]]); return solvePart(t(q.fac + '=0'), q.roots, { text: '(x + a)(px − q) = 0', sol: [q.zero, q.rootsLine].join('<br>') });
      } },
      { id: 'A1b', level: 'BEG', make: function (r) { return gcfPart(r, [-13]); } },
      { id: 'A1c', level: 'EMG', make: function (r) { return dosPart(r, [5, 6, 7, 8, 9, 10, 11, 12], [[10, 3]]); } },
      { id: 'A1d', level: 'BEG', make: function (r) { return monicPart(r, { signs: r.chance(0.5) ? 'pos' : 'neg', avoid: [[3, 7], [-3, -7]], text: 'x² + bx + c = 0, roots of the same sign' }); } },
      { id: 'A1e', level: 'BEG', make: function (r) { return monicPart(r, { signs: 'mixed', avoid: [[-8, 7]], text: 'x² + bx − c = 0' }); } },
      { id: 'A1f', level: 'EMG', make: function (r) { return mTimesPart(r, [2, 3, 5, 7], [[3, -1, 5]]); } },
      { id: 'A1g', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { p: r.int(2, 5), q: r.pick(pm(1, 9)) }; }, function (o) { return gcd(o.p, o.q) === 1 && !(o.p === 2 && o.q === 7); });
        var q = Quad(1, [[o.p, o.q], [o.p, o.q]]);
        return solvePart(t(q.std + '=0'), q.roots, { text: 'perfect square a²x² + 2abx + b²', sol: solLines(q, ['Perfect square trinomial:']), hints: ['Are the first and last terms perfect squares? ' + t(q.A + 'x^{2}=(' + o.p + 'x)^{2}') + ', ' + t(q.C + '=' + Math.abs(o.q) + '^{2}') + '.', 'A squared factor gives a double root.'] });
      } },
      { id: 'A1h', level: 'PRG', make: function (r) {
        var x = intRoots(r, { signs: 'mixed', avoid: [[8, -2]] }), q = Quad(-1, [[1, -x.a], [1, -x.b]]);
        if (!q.B) return EXTRA[0].parts[7].make(r);
        return solvePart(t(q.std + '=0'), q.roots, { text: '−x² + bx + c = 0', sol: [t('-(' + quadT(1, -q.B, -q.C) + ')=0'), t(q.fac + '=0'), q.rootsLine].join('<br>'), hints: ['Take out ' + t('-1') + ' first so the ' + t('x^{2}') + ' coefficient is positive.', H_SOLVE[0]] });
      } },
      { id: 'A1i', level: 'PRG', make: function (r) { return twoNUPart(r, [[3, -2, 2, 3]]); } }] },
    { num: 'A2', stem: 'Write each equation in standard form, then solve.', parts: [
      { id: 'A2a', level: 'PRG', make: function (r) {
        var x = monicTimes(r, [2, 3, 5], [[5, -1, 2]]), q = Quad(1, [[x.m, x.q], [1, x.s]]);
        return solvePart(t(q.A + 'x^{2}=' + pT([[-q.C, 0], [-q.B, 1]])), q.roots, { text: 'ax² = c − bx', sol: solLines(q, [t(q.std + '=0')]), hints: H_STD });
      } },
      { id: 'A2b', level: 'PRG', make: function (r) {
        var x = pickWhere(function () { return monicTimes(r, [2, 3], [[2, -5, 3]]); }, function (x) { return x.q * x.s < 0; }), q = Quad(1, [[x.m, x.q], [1, x.s]]);
        if (!q.B) return EXTRA[1].parts[1].make(r);
        return solvePart(t('x(' + linT(q.A, q.B) + ')=' + (-q.C)), q.roots, { text: 'x(px + q) = c', sol: solLines(q, [t(q.std + '=0')]), hints: H_STD,
          cands: [{ vals: [-q.C, (-q.C - q.B) / q.A], code: 'u4l5-set-k', hint: 'A product equal to ' + t(String(-q.C)) + ' doesn’t mean a factor equals ' + t(String(-q.C)) + '. Expand and subtract first.' }] });
      } },
      { id: 'A2c', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { a: r.pick(pm(1, 6)), m: r.int(1, 6), r1: r.pick(pm(1, 8)) }; }, function (o) {
          o.r2 = o.m - 2 * o.a - o.r1; o.c = o.a * o.a - o.r1 * o.r2; return o.r2 !== o.r1 && o.c !== 0 && Math.abs(o.r2) <= 10 && !(o.a === 3 && o.m === 4);
        });
        var q = Quad(1, [[1, -o.r1], [1, -o.r2]]), rhs = pT([[o.m, 1], [o.c, 0]]);
        return solvePart(t('(' + linT(1, o.a) + ')^{2}=' + rhs), q.roots, { text: '(x + a)² = mx + c', hints: ['Expand the square (three terms), then move every term to the left.', 'Collect like terms and factor.'],
          sol: solLines(q, [t(quadT(1, 2 * o.a, o.a * o.a) + '-' + (o.m === 1 ? '' : o.m) + 'x' + (o.c < 0 ? '+' + (-o.c) : '-' + o.c) + '=0') + ' &nbsp;⇒&nbsp; ' + t(q.std + '=0')]) });
      } },
      { id: 'A2d', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { r1: r.pick(pm(1, 10)), r2: r.pick(pm(1, 10)) }; }, function (o) { return o.r1 !== o.r2 && (o.r1 + o.r2) % 2 === 0 && o.r1 + o.r2 !== 0 && o.r1 * o.r2 < 0 && (o.r1 * o.r2) % 2 === 0 && [o.r1, o.r2].sort().join() !== [-8, 4].sort().join(); });
        var q = Quad(1, [[1, -o.r1], [1, -o.r2]]), Bc = -(o.r1 + o.r2) / 2, Rr = -o.r1 * o.r2 / 2;
        return solvePart(t(pT([[[1, 2], 2], [Bc, 1]]) + '=' + Rr), q.roots, { text: '½x² + bx = c', hints: ['Multiply every term by ' + t('2') + ' to clear the fraction, then move ' + t(String(2 * Rr)) + ' to the left.', 'Factor the trinomial.'],
          sol: solLines(q, ['Multiply by ' + t('2') + ': ' + t(quadT(1, 2 * Bc, 0) + '=' + (2 * Rr)) + ' &nbsp;⇒&nbsp; ' + t(q.std + '=0')]) });
      } }] },
    { num: 'A3', stem: 'Write a quadratic equation in standard form, with integer coefficients, that has the given roots.', parts: [
      { id: 'A3a', level: 'EMG', make: function (r) { var x = intRoots(r, { signs: 'mixed', avoid: [[-4, 9]] }); return eqPart(t(x.a) + ' and ' + t(x.b), [[x.a, 1], [x.b, 1]], { text: 'equation from two integer roots' }); } },
      { id: 'A3b', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { q1: r.int(2, 5), p1: r.int(1, 8), q2: r.int(2, 5), p2: r.int(1, 8) }; }, function (o) { return gcd(o.p1, o.q1) === 1 && gcd(o.p2, o.q2) === 1 && !(o.p1 === 5 && o.q1 === 3 && o.p2 === 1 && o.q2 === 2); });
        return eqPart(t(rT(Q(o.p1, o.q1))) + ' and ' + t('-' + rT(Q(o.p2, o.q2))), [[o.p1, o.q1], [-o.p2, o.q2]], { text: 'equation from two fraction roots' });
      } },
      { id: 'A3c', level: 'EMG', make: function (r) { var a = pickWhere(function () { return r.pick(pm(1, 9)); }, function (a) { return a !== 4; }); return eqPart('a double root of ' + t(String(a)), [[a, 1]], { text: 'equation with an integer double root' }); } }] },
    { num: 'B1', section: 'B. Applying', parts: [
      { id: 'B1', level: 'PRG', make: function (r) {
        var g = r.int(2, 5), x = intRoots(r, { as: pm(1, 7), bs: pm(1, 7), signs: 'mixed', avoid: [[-3, 2]] }), q = Quad(g, [[1, -x.a], [1, -x.b]]);
        if (!q.B) return EXTRA[3].parts[0].make(r);
        return solvePart('Determine the zeros of ' + t('y=' + q.std) + '. (They are also the ' + t('x') + '-intercepts of its graph.)', q.roots, { g: g, text: 'zeros: common factor first',
          sol: [t(q.std + '=0') + ' &nbsp;⇒&nbsp; ' + t(g + '(' + quadT(1, q.B / g, q.C / g) + ')=0') + ' &nbsp;⇒&nbsp; ' + t(q.fac + '=0'), 'Zeros: ' + q.roots.map(function (z) { return t(rT(z)); }).join(' and ') + '. ' + t('x') + '-intercepts: ' + q.roots.map(function (z) { return t('(' + rT(z) + ',\\ 0)'); }).join(' and ') + '.'].join('<br>'),
          hints: ['Solve ' + t(q.std + '=0') + '. Take out the common factor ' + t(String(g)) + ' first.', H_SOLVE[1]] });
      } }] },
    { num: 'B2', parts: [
      { id: 'B2', level: 'ADV', make: function (r) {
        var n = pickWhere(function () { return r.int(4, 13); }, function (n) { return n !== 7; }), k = n * n - n - 1, q = Quad(1, [[1, -n], [1, n - 1]], 'n');
        return twoPairs('The product of two consecutive integers is ' + t(String(k)) + ' more than their sum. Determine the integers. (There are two possible pairs.)', [n, n + 1], [1 - n, 2 - n],
          { text: 'consecutive integers: product and sum', sol: t('n(n+1)=n+(n+1)+' + k) + ' &nbsp;⇒&nbsp; ' + t('n^{2}+n=2n+' + (k + 1)) + ' &nbsp;⇒&nbsp; ' + t('n^{2}-n-' + (k + 1) + '=0') + '<br>' + t(q.fac + '=0') + ', ' + t('n=' + n) + ' or ' + t('n=' + (1 - n)) + '.<br>The integers are ' + t(n + '\\text{ and }' + (n + 1)) + ', or ' + t((1 - n) + '\\text{ and }' + (2 - n)) + '.',
            hints: ['Let the integers be ' + t('n') + ' and ' + t('n+1') + '. Product: ' + t('n(n+1)') + '; sum: ' + t('n+(n+1)') + '.', 'Write product ' + t('=') + ' sum ' + t('+' + k) + ', put it in standard form and factor. Each root gives a pair.'] });
      } }] },
    { num: 'B3', parts: [
      { id: 'B3', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { L: r.int(8, 20), W: r.int(5, 14), h: r.pick([2, 3, 4, 5, 6]) }; }, function (o) { return o.L > o.W && !(o.L === 15 && o.W === 10 && o.h === 3); });
        var x = o.h / 2, Ap = 4 * x * x + 2 * (o.L + o.W) * x, S = o.L + o.W;
        // 4x² + 2Sx − Ap = 0 → divide by 2: 2x² + Sx − Ap/2 = 0 when Ap even; factor (2x − h)(x + S/2 + h/2)… use roots x and −S/2 − x
        var other = -S / 2 - x, Ap2 = Ap / 2, half = Ap % 2 === 0, qa = half ? 2 : 4, qb = half ? S : 2 * S, qc = half ? -Ap2 : -Ap;
        var fac = o.h % 2 === 0 ? '(x-' + x + ')(' + linT(qa, qa * (-other)) + ')' : '(' + linT(2, -o.h) + ')(' + linT(qa / 2, qa / 2 * (-other)) + ')';
        var wrongR = (-S + Math.sqrt(S * S + 4 * Ap)) / 2;
        return B.number('A rectangular lawn ' + t(String(o.L)) + ' m by ' + t(String(o.W)) + ' m is surrounded by a path of uniform width. The area of the path alone is ' + t(F(Ap) + '\\text{ m}^{2}') + '. How wide is the path?<br>' + frameFig(o.L, o.W, 'lawn', 'lawn with a path of width x around it'), x,
          function (v) { if (same(v, other)) return { code: 'u4l5-reject', hint: 'A width can’t be negative: reject that root.' }; if (Math.abs(v - wrongR) < 0.005) return { code: 'value', hint: 'The path adds ' + t('x') + ' on <b>both</b> sides, so the outer rectangle is ' + t('(' + o.L + '+2x)') + ' by ' + t('(' + o.W + '+2x)') + '.' }; return null; },
          'Outer rectangle: ' + t('(' + o.L + '+2x)(' + o.W + '+2x)') + '. Path ' + t('=') + ' outer ' + t('-') + ' lawn:<br>' + t('(' + o.L + '+2x)(' + o.W + '+2x)-' + (o.L * o.W) + '=' + Ap) + ' &nbsp;⇒&nbsp; ' + t('4x^{2}+' + (2 * S) + 'x-' + Ap + '=0') + (half ? ' &nbsp;⇒&nbsp; ' + t(quadT(qa, qb, qc) + '=0') : '') +
            '<br>' + t(fac + '=0') + ', ' + t('x=' + rT(fracOf(x))) + ' (' + t('x=' + rT(fracOf(other))) + ' is rejected). The path is ' + t(String(x)) + ' m wide.',
          ['The outer rectangle is ' + t('(' + o.L + '+2x)') + ' by ' + t('(' + o.W + '+2x)') + '. The path’s area is the outer area minus the lawn.', 'Expand, put it in standard form, divide out any common factor and factor. The answer may be a decimal.'], 'border width from the path’s area', { after: 'm' });
      } }] },
    { num: 'B4', stem: function (s) { return 'A model rocket is launched from the ground. Its height after ' + t('t') + ' seconds is ' + t('h=' + quadT(-5, s.v, 0, 't')) + ' metres.'; },
      shared: function (r) { var o = pickWhere(function () { return { T1: r.int(1, 6), T2: r.int(3, 11) }; }, function (o) { return o.T1 < o.T2 && !(o.T1 === 3 && o.T2 === 5); }); o.v = 5 * (o.T1 + o.T2); o.H = 5 * o.T1 * o.T2; return o; }, parts: [
      { id: 'B4a', level: 'PRG', make: function (r, s) {
        var q = Quad(1, [[1, -s.T1], [1, -s.T2]], 't');
        return solvePart('At what times is the rocket ' + t(String(s.H)) + ' m high?', q.roots, { v: 't', text: 'projectile: two times at a height', sol: t(quadT(-5, s.v, -s.H, 't') + '=0') + ' &nbsp;⇒&nbsp; ' + t(q.std + '=0') + ' &nbsp;⇒&nbsp; ' + t(q.fac + '=0') + '<br>At ' + t(String(s.T1)) + ' s (going up) and at ' + t(String(s.T2)) + ' s (coming down).',
          hints: ['Set ' + t('h=' + s.H) + ', move it to the left and divide every term by ' + t('-5') + '.', 'Factor; both roots are admissible.'] });
      } },
      { id: 'B4b', level: 'PRG', make: function (r, s) {
        var L = s.T1 + s.T2;
        return B.number('When does it land?', L, function (v) { return same(v, 0) ? { code: 'value', hint: t('t=0') + ' is the launch. The other root is when it lands.' } : null; },
          t(quadT(-5, s.v, 0, 't') + '=0') + ' &nbsp;⇒&nbsp; ' + t('-5t(t-' + L + ')=0') + ': ' + t('t=0') + ' (launch) or ' + t('t=' + L) + '. It lands after ' + t(String(L)) + ' s.', ['It lands when ' + t('h=0') + '.', 'Factor out ' + t('-5t') + '.'], 'projectile: landing time', { after: 's' });
      } }] },
    { num: 'B5', parts: [
      { id: 'B5', level: 'ADV', make: function (r) {
        var tr = pickWhere(function () { var b = r.pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41], [12, 35, 37]]), k = b[0] === 3 ? r.int(2, 6) : 1; return [b[0] * k, b[1] * k, b[2] * k]; }, function (b) { return !(b[0] === 5 && b[1] === 12); });
        var w = tr[0], Lh = tr[1], d = tr[2], c = Lh - w, other = -Lh, q = Quad(1, [[1, -w], [1, Lh]], 'w');
        var fields = [{ label: 'Width:', name: 'Width', after: 'cm' }, { label: 'Length:', name: 'Length', after: 'cm' }];
        var p = B.fields('The length of a rectangle is ' + t(String(c)) + ' cm more than its width, and its diagonal is ' + t(String(d)) + ' cm. Determine the dimensions. (Use the Pythagorean theorem.)', fields,
          [K.number(w, numBox(w, [other], 'A width can’t be negative: reject that root.')), K.number(Lh, null)], [String(w), String(Lh)], t(w + '\\text{ cm by }' + Lh + '\\text{ cm}'),
          t('w^{2}+(w+' + c + ')^{2}=' + d + '^{2}') + ' &nbsp;⇒&nbsp; ' + t('2w^{2}+' + (2 * c) + 'w+' + (c * c) + '=' + (d * d)) + '<br>' + t('2w^{2}+' + (2 * c) + 'w-' + (d * d - c * c) + '=0') + ' &nbsp;⇒&nbsp; ' + t(q.std + '=0') + ' &nbsp;⇒&nbsp; ' + t(q.fac + '=0') + '<br>' + t('w=' + w) + ' (' + t(String(other)) + ' rejected). The rectangle is ' + t(String(w)) + ' cm by ' + t(String(Lh)) + ' cm.',
          ['The diagonal is the hypotenuse: ' + t('w^{2}+(w+' + c + ')^{2}=' + d + '^{2}') + '.', 'Expand, put it in standard form, divide by ' + t('2') + ' and factor.'], 'rectangle from its diagonal');
        p.bad = [[String(Lh), String(w)]]; return p;
      } }] },
    { num: 'B6', parts: [
      { id: 'B6', level: 'EMG', make: function (r) {
        var n = pickWhere(function () { return r.int(2, 9); }, function (n) { return n !== 3; });
        return B.mc(r, 'Which equation has a double root?', [
          { html: t('x^{2}-' + (n * n) + '=0'), why: 'That factors as ' + t('(x-' + n + ')(x+' + n + ')') + ': two different roots, ' + t('\\pm' + n) + '.' },
          { html: t('x^{2}+' + (2 * n) + 'x+' + (n * n) + '=0'), right: true },
          { html: t('x^{2}-' + (2 * n) + 'x=0'), why: 'That factors as ' + t('x(x-' + (2 * n) + ')') + ': roots ' + t('0') + ' and ' + t(String(2 * n)) + '.' },
          { html: t('x^{2}+' + (n * n) + 'x=0'), why: 'That factors as ' + t('x(x+' + (n * n) + ')') + ': roots ' + t('0') + ' and ' + t(String(-n * n)) + '.' }],
          t('x^{2}+' + (2 * n) + 'x+' + (n * n) + '=(x+' + n + ')^{2}=0') + ' gives only ' + t('x=-' + n) + '.', ['A double root comes from a perfect square trinomial: the same factor twice.'], 'MC: which has a double root');
      } }] },
    { num: 'B7', parts: [{ id: 'B7', level: 'ADV', make: function (r) { return seriesPart(r, [[5, 4, 10], [3, 4, 12]], true); } }] },
    { num: 'C1', section: 'C. Stretch', parts: [
      { id: 'C1', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 4), p: r.pick(pm(1, 9)), rr: r.pick(pm(1, 6)) }; }, function (o) { return gcd(o.a, o.p) === 1 && o.p - o.a * o.rr !== 0 && !(o.a === 2 && o.p === 5 && o.rr === 3); });
        var k = o.p - o.a * o.rr, C = -o.p * o.rr, other = Q(-o.p, o.a);
        var fields = [{ label: t('k='), name: 'k' }, { label: 'Other root: ' + t('x='), name: 'Other root', mode: 'math', keys: 'fraction' }];
        var p = B.fields('One root of ' + t(o.a + 'x^{2}+kx' + (C < 0 ? '-' + (-C) : '+' + C) + '=0') + ' is ' + t('x=' + o.rr) + '. Determine ' + t('k') + ' and the other root.', fields,
          [K.number(k, function (v) { return same(v, -k) ? { code: 'u4l5-k-sign', hint: 'Substitute ' + t('x=' + o.rr) + ' carefully, then solve for ' + t('k') + ' (watch the sign when you move terms).' } : null; }), K.value(qv(other), { diag: function (v) { return same(v, -qv(other)) ? { code: 'u4l5-sign', hint: 'Check the sign of the other root: solve the factor ' + t('=0') + '.' } : null; } })],
          [String(k), rT(other)], t('k=' + k) + ', other root ' + t('x=' + rT(other)),
          'Substitute ' + t('x=' + o.rr) + ': ' + t(o.a + '(' + o.rr + ')^{2}+(' + o.rr + ')k' + (C < 0 ? '-' + (-C) : '+' + C) + '=0') + ' &nbsp;⇒&nbsp; ' + t(pT([[o.a * o.rr * o.rr + C, 0], [o.rr, 1]], 'k') + '=0') + ', so ' + t('k=' + k) + '.<br>' + t(quadT(o.a, k, C) + '=0') + ' &nbsp;⇒&nbsp; ' + t('(' + linT(o.a, o.p) + ')(' + linT(1, -o.rr) + ')=0') + '. The other root is ' + t(rT(other)) + '.',
          ['A root makes the equation true: substitute ' + t('x=' + o.rr) + ' and solve for ' + t('k') + '.', 'Then factor the equation; one factor is ' + t('(' + linT(1, -o.rr) + ')') + '.'], 'unknown coefficient from a root');
        return p;
      } }] },
    { num: 'C2', parts: [
      { id: 'C2', level: 'MAS', make: function (r) {
        var ab = pickWhere(function () { return r.sample([1, 2, 3, 4, 5, 6], 2).sort(function (a, b) { return a - b; }); }, function (ab) { return !(ab[0] === 1 && ab[1] === 3); }), a = ab[0], b = ab[1];
        var s = a * a + b * b, pr = a * a * b * b;
        var part = K.P.valueSet('Solve ' + t('x^{4}-' + s + 'x^{2}+' + pr + '=0') + '. (Factor as a trinomial in ' + t('x^{2}') + ' first.)', [a, -a, b, -b], { v: 'x', keyTex: 'x=\\pm ' + a + ',\\ x=\\pm ' + b,
          diag: function (A) {
            if (sameSet(A, [a * a, b * b])) return { code: 'u4l5-x2', hint: 'Those are the values of ' + t('x^{2}') + '. Each one gives two values of ' + t('x') + ': factor the differences of squares.' };
            if (sameSet(A, [a, b])) return { code: 'u4l5-pm', hint: 'Each difference of squares gives two roots — include the negative ones (four roots in all).' };
            return null;
          } },
          t('(x^{2}-' + (a * a) + ')(x^{2}-' + (b * b) + ')=0') + ' &nbsp;⇒&nbsp; ' + t('(x-' + a + ')(x+' + a + ')(x-' + b + ')(x+' + b + ')=0') + '<br>' + t('x=\\pm ' + a) + ' or ' + t('x=\\pm ' + b) + ' (four roots).',
          ['Let ' + t('u=x^{2}') + ': ' + t('u^{2}-' + s + 'u+' + pr) + ' factors like a trinomial.', 'Each factor ' + t('x^{2}-k^{2}') + ' is a difference of squares.'], 'quartic in quadratic form');
        part.bad = ['x=' + (a * a) + ',x=' + (b * b), 'x=' + a + ',x=' + b]; return part;
      } }] },
    { num: 'C3', parts: [
      { id: 'C3', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { return { c: r.int(2, 5), b: r.int(4, 14) }; }, function (o) { return !(o.c === 3 && o.b === 10) && o.c * o.b * o.b <= 2000; });
        var V = o.c * o.b * o.b, s = o.b + 2 * o.c, neg = 2 * o.c - o.b, q = Quad(1, [[1, -s], [1, -neg]], 's');
        return B.number('Squares of side ' + t(String(o.c)) + ' cm are cut from the corners of a square sheet of cardboard, and the sides are folded up to make an open box with a volume of ' + t(F(V) + '\\text{ cm}^{3}') + '. Determine the side length of the original sheet.', s,
          function (v) { if (same(v, o.b)) return { code: 'u4l5-base', hint: 'That’s the side of the box’s base. The sheet is the base plus the two cut squares: ' + t('s-' + (2 * o.c)) + ' is the base.' }; if (same(v, neg)) return { code: 'u4l5-reject', hint: 'That root must be rejected: the base ' + t('s-' + (2 * o.c)) + ' would be negative (or the sheet too small).' }; return null; },
          'Let the sheet be ' + t('s') + ' cm. The base is ' + t('(s-' + (2 * o.c) + ')') + ' by ' + t('(s-' + (2 * o.c) + ')') + ' and the height is ' + t(String(o.c)) + '.<br>' + t(o.c + '(s-' + (2 * o.c) + ')^{2}=' + V) + ' &nbsp;⇒&nbsp; ' + t('s^{2}-' + (4 * o.c) + 's+' + (4 * o.c * o.c) + '=' + (o.b * o.b)) + ' &nbsp;⇒&nbsp; ' + t(q.std + '=0') +
            '<br>' + t(q.fac + '=0') + ', ' + t('s=' + s) + ' (' + t(String(neg)) + ' rejected). The sheet is ' + t(String(s)) + ' cm by ' + t(String(s)) + ' cm.',
          ['Draw it: cutting a ' + o.c + ' cm square from each corner leaves a base of side ' + t('s-' + (2 * o.c)) + '.', 'Volume ' + t('=') + ' base area ' + t('\\times') + ' height. Divide by ' + t(String(o.c)) + ', expand and factor.'], 'open box from its volume', { after: 'cm' });
      } }] }
  ];
  function F(n) { return HW.fmt(n); }

  HW.defineLesson({ id: LID, unit: 4, num: '5', title: 'Solving Quadratic Equations by Factoring', outcome: 'RF5', calc: false, questions: QUESTIONS, extra: EXTRA });
})(window);
