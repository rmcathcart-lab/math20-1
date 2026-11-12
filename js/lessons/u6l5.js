/* Math 20-1 · Unit 6 · Lesson 5 — Adding and Subtracting with Monomial Denominators (outcome AN5 on every part)
 * Assignment 5 (u6_l05.tex, Questions 1–18) and the Lesson 5 Extra Practice (u6_ep05.tex, A1–A4, B1–B6, C1–C3).
 * Every part is a generator: the booklet question's idea, form and difficulty with new numbers (the lesson's example
 * numbers and the booklet question's own numbers are left out where that is easy). Calculator allowed; answers exact.
 *
 * "Simplify. State the NPVs." is one part with two boxes (Simplified, NPVs). A simplified expression is checked by value
 * at six points away from the NPVs, then for form: one fraction, lowest terms (no common factor or common number left;
 * over a number denominator the numbers must be reduced too), integers rather than decimals; the numerator may be factored
 * or expanded. NPVs: "x ≠ 0" (or "0"), two letters as "a ≠ 0, b ≠ 0", "none". Recognised mistakes (codes u6l5-…): adding
 * the numerators and the denominators, the minus sign applied only to the first term of a numerator, a numerator (or a
 * whole-number term) not multiplied by its multiplier, NPVs from the simplified answer only, an LCD that is the product of
 * the denominators or uses the lowest powers, and the classic MC distractors.
 * Conversions: "show that the perimeter is …" → write it as a single expression (the given answer then checks it);
 * "find the error" → MC on the error, the correct answer, and its value at the test point; "show it is false by
 * substituting" → the two values in boxes (and the correct simplification); "all pairs (A, B)" → a list of ordered pairs.
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: 12 (the k that makes it a constant), 13 (splitting a fraction), Extra C1–C3.
 *
 * This file also holds HW.u6k56, the adding-and-subtracting kit used by u6l6.js (so u6l5.js loads first): rational
 * expressions as products of atoms, the checker (value at six points + form), NPV boxes, the keypads u6krat / u6knpv /
 * u6knum, the LCD-and-sum engine with its worked solution and wrong answers. It is adapted from the Unit 6 test's
 * assessment kit (js/lessons/u6test.js, HW.u6assess), copied rather than shared because u6test.js loads after the lessons. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, KP = K.P, P = HW.poly, ex = HW.ex, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  if (!P || !K.valueSet) throw new Error('js/lessons/u6l5.js needs js/poly.js and js/relfn.js');
  var LID = 'u6l5';

  /* ---------- codes: the kit's (for both lessons), then this lesson's ---------- */
  (function () {
    var BASE = {
      'npv-cancel': ['NPVs taken from the simplified expression (a divided-out factor’s NPV missing)', 's'], 'npv-missing': ['Missed an NPV', 's'],
      'npv-extra': ['Listed a value that is not an NPV', 's'], 'npv-sign': ['NPVs with the wrong signs', 'b'], 'npv-wrong': ['Right expression, NPVs wrong or missing', 'b'],
      'npv-one': ['Only the NPVs of one denominator', 'b'], 'opp-sign': ['Opposite factors: lost the −1', 'b'],
      'add-straight': ['Added the numerators and added the denominators', 'n'], 'sub-sign': ['Subtraction: minus not applied to every term of the second numerator', 'b'],
      'lcd-num': ['Changed a denominator to the LCD without multiplying its numerator', 'n'], 'whole-lcd': ['Whole-number term not multiplied by the LCD', 'b'],
      'k-sign': ['Value with the wrong sign', 's'], 'mc-error': ['Picked the wrong error in the student’s work', 'n'], 'test-value': ['Substitution: wrong value', 's']
    };
    var codes = {}, part = {};
    Object.keys(BASE).forEach(function (k) { ['u6l5-', 'u6l6-'].forEach(function (cp) { codes[cp + k] = BASE[k][0]; if (BASE[k][1]) part[cp + k] = BASE[k][1]; }); });
    codes['u6s-single'] = 'Not written as a single fraction (format)'; codes['u6s-lowest'] = 'Not in lowest terms: a common factor left (format)';
    codes['u6s-reduce'] = 'Numbers in the fraction not reduced (format)'; codes['u6s-tidy'] = 'Numerator or denominator not simplified (format)';
    codes['u6s-decimal'] = 'Decimal coefficients instead of exact ones (format)'; codes['u6s-npvletter'] = 'NPVs written for the wrong letter (format)';
    codes['u6l5-lcd-prod'] = 'LCD: multiplied the denominators (a common multiple, not the lowest)'; part['u6l5-lcd-prod'] = 's';
    codes['u6l5-lcd-low'] = 'LCD: used the lowest power of a variable, not the highest'; part['u6l5-lcd-low'] = 'b';
    codes['u6l5-lcd-coef'] = 'LCD: multiplied the coefficients instead of taking their LCM'; part['u6l5-lcd-coef'] = 's';
    codes['u6l5-lcd-var'] = 'LCD: left out a variable'; part['u6l5-lcd-var'] = 'b';
    codes['u6l5-num-straight'] = 'Fractions: added the numerators and the denominators'; part['u6l5-num-straight'] = 'n';
    codes['u6l5-pairs-one'] = 'Found only some of the pairs'; part['u6l5-pairs-one'] = 's';
    codes['u6l5-perim'] = 'Perimeter: added the length and width only once'; part['u6l5-perim'] = 's';
    codes['u6l5-unit-min'] = 'Gave hours instead of minutes'; part['u6l5-unit-min'] = 's';
    HW.addCodes(codes); HW.addPartial(part);
  })();

  var gcd = function (a, b) { return ex.gcd(Math.abs(a), Math.abs(b)); };
  function lcm(a, b) { return Math.abs(a) / gcd(a, b) * Math.abs(b); }
  function pickWhere(gen, test) { for (var i = 0; i < 8000; i++) { var o = gen(); if (o && test(o)) return o; } throw new Error('u6l5–6 practice: no instance found'); }
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
    var neg = cn.c[0] < 0, n = side(cn, 1), d = side(cn, -1);
    if (trivial(d)) return neg ? (bare(n) ? '-(' + sideTex(n) + ')' : '-' + sideTex(n)) : sideTex(n);
    return (neg ? '-' : '') + '\\frac{' + sideTex(n) + '}{' + sideTex(d) + '}';
  }
  function cPolys(cn) { var N = sidePoly(side(cn, 1)), D = sidePoly(side(cn, -1)); if (cn.c[0] < 0) N = P.neg(N); return { N: N, D: D }; }
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
    if (ex.shape(ast).decimals) return form('u6s-decimal', RH.decimal);
    var top = ast; while (top.t === 'paren' || top.t === 'neg') top = top.a;
    if (!hasVarDiv(ast)) {
      if (P.degree(T.D) > 0 && !P.isZero(T.N)) return form('u6s-single', RH.single);
      if (!polyOK(top)) return form('u6s-tidy', RH.tidy);
      // numerical denominators (p65): one fraction over one number, in lowest terms
      var f0 = ex.factors(top), N0 = P.num(1), D0 = P.num(1);
      try { f0.num.forEach(function (x) { N0 = P.mul(N0, P.read(x).p); }); f0.den.forEach(function (x) { D0 = P.mul(D0, P.read(x).p); }); } catch (e) { return null; }
      if (!P.vars(N0).length || P.vars(D0).length) return null;
      var c0 = content(N0), d0 = P.constant(D0);
      if (c0 < 0) return form('u6s-single', RH.single);
      if (c0 > 0 && d0[1] === 1 && gcd(c0, d0[0]) > 1) return form('u6s-reduce', RH.reduce);
      return null;
    }
    var fz = ex.factors(top), all = fz.num.concat(fz.den);
    for (var i = 0; i < all.length; i++) { if (hasDiv(all[i]) && hasVarDiv(all[i])) return form('u6s-single', RH.single); if (all[i].t === 'add' || all[i].t === 'sub') { if (hasVarDiv(all[i])) return form('u6s-single', RH.single); } }
    for (var j = 0; j < all.length; j++) if (!polyOK(all[j])) return form(hasVarDiv(all[j]) ? 'u6s-single' : 'u6s-tidy', hasVarDiv(all[j]) ? RH.single : RH.tidy);
    var Nw = P.num(1), Dw = P.num(1);
    try { fz.num.forEach(function (x) { Nw = P.mul(Nw, P.read(x).p); }); fz.den.forEach(function (x) { Dw = P.mul(Dw, P.read(x).p); }); } catch (e) { return form('u6s-tidy', RH.tidy); }
    if (P.degree(Dw) > P.degree(T.D)) return form('u6s-lowest', RH.lowest);
    var cN = content(Nw), cD = content(Dw);
    if (cN < 0 || cD < 0) return form('u6s-tidy', 'Right value — now clear the fractions inside the numerator and the denominator, so it is one fraction with integer coefficients.');
    if (cN > 0 && gcd(cN, cD) > 1) return form('u6s-reduce', RH.reduce);
    return null;
  }
  /* T: { N, D } (lowest terms); opt.dl: [{ N, D, code, hint }] known wrong values; opt.vars: letters allowed */
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
      if (same(sv, tv)) return ratForm(a.ast, T) || ok();
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
    var ml = /^\s*([a-zA-Z](?:\s*,\s*[a-zA-Z])+)\s*≠\s*(.+)$/.exec(s);
    if (ml) s = ml[1].split(',').map(function (x) { return x.trim() + '≠' + ml[2]; }).join(',');
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
      if (vs.length === 1 && ks.length === 1 && ks[0] !== vs[0] && eqMap({ x: Am[ks[0]] }, { x: TT[vs[0]] })) return form('u6s-npvletter', 'Right values — but the variable here is ' + t(vs[0]) + '.');
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
    W.KEYSETS.u6krat = function (opt) { return [[d(7), d(8), d(9), KY.plus, KY.minus, KY.del], [d(4), d(5), d(6), KY.sq, KY.pow, KY.clear], [d(1), d(2), d(3), KY.frac, KY.left, KY.right], [d(0), KY.dot, KY.par, KY.comma, KY.ne, KY.enter], vk(opt, 6)]; };
    W.KEYSETS.u6knpv = function (opt) { return [[d(7), d(8), d(9), KY.frac, KY.del], [d(4), d(5), d(6), KY.minus, KY.clear], [d(1), d(2), d(3), KY.pm, KY.left, KY.right], [d(0), KY.comma, KY.ne, KY.none, KY.enter], vk(opt, 3)]; };
    W.KEYSETS.u6knum = function () { return [[d(7), d(8), d(9), KY.frac, KY.del], [d(4), d(5), d(6), KY.minus, KY.clear], [d(1), d(2), d(3), KY.left, KY.right], [d(0), KY.dot, KY.undef, KY.enter]]; };
    if (W.KEYHELP) {
      W.KEYHELP.u6krat = ['Use the <b>fraction</b> key for a fraction and <b>( )</b> for factors; press <b>▶</b> to step out of a box. NPVs: <b>≠</b> and commas, e.g. x ≠ 3, −2 (or <b>none</b>).', 'Type fractions with <code>/</code> and brackets, e.g. <code>(x+3)/(x(x-2))</code>. NPVs: <code>x != 3, -2</code> or <code>none</code>.'];
      W.KEYHELP.u6knpv = ['Write the NPVs with <b>≠</b> and commas, e.g. x ≠ 3, −2, or press <b>none</b>.', 'Type e.g. <code>x != 3, -2</code> (or just <code>3, -2</code>), or <code>none</code>.'];
    }
  }

  /* ---------- parts ---------- */
  /* "Simplify. State the NPVs." — two boxes. T: canon of the answer; npv: { v: [vals] }; o.dl expression wrongs [{ cn, code, hint }];
     o.nw NPV wrongs [{ vals, code, hint }] */
  function simpPart(cp, prompt, T, npv, o, sol, hints, text) {
    o = o || {};
    var TP = cPolys(T), vars = vlist(P.vars(TP.N).concat(P.vars(TP.D)).concat(Object.keys(npv)).concat(o.vars || []));
    var dl = (o.dl || []).filter(function (w) { return w && w.cn && !cSame(w.cn, T); });
    var c1 = ratCheck(TP, { cp: cp, vars: vars, dl: dl.map(function (w) { var q = cPolys(w.cn); return { N: q.N, D: q.D, code: w.code, hint: w.hint }; }) });
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
    var p = { prompt: prompt, input: { type: 'fields', fields: [{ label: 'Simplified:', mode: 'math', keys: 'u6krat', vars: vars, name: 'Simplified' }, { label: 'NPVs:', mode: 'math', keys: 'u6krat', vars: vars, none: true, name: 'NPVs', placeholder: 'e.g. ' + vars[0] + ' ≠ 3, −2' }] },
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
    var p = KP.math(prompt, ratCheck(TP, { cp: cp, vars: vars, dl: dl.map(function (w) { var q = cPolys(w.cn); return { N: q.N, D: q.D, code: w.code, hint: w.hint }; }) }), o.keyTex || cTex(T), sol, hints, text, { keys: 'u6krat', vars: vars, before: o.before, after: o.after, placeholder: 'e.g. (x+3)/(x(x-2))' });
    p.bad = dl.map(function (w) { return cTex(w.cn); }).filter(function (b, i, arr) { return arr.indexOf(b) === i; });
    return p;
  }
  function npvPart(cp, prompt, npv, o, sol, hints, text) {
    o = o || {};
    var vs = Object.keys(npv), v = o.v || vs[0] || 'x', nw = (o.nw || []).filter(function (w) { return w && !npvEq(w.vals, npv); });
    var p = KP.math(prompt, npvCheck(npv, cp, { v: v, wrongs: nw }), npvTex(npv), sol, hints, text, { keys: 'u6knpv', vars: vlist([v].concat(vs)), placeholder: 'e.g. ' + v + ' ≠ 3, −2  (or: none)' });
    p.bad = nw.map(function (w) { return npvTex(w.vals); }).concat(npvTex(npv) === '\\text{none}' ? [v + '\\ne 0'] : ['\\text{none}']).filter(function (b, i, arr) { return arr.indexOf(b) === i && b !== npvTex(npv); });
    return p;
  }

  /* ---------- roots: "x = a, x = b", ± allowed, exact radicals, or "no solution" ---------- */

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
  function wrapM(s) { return /^[^()]*[+-]/.test(s.replace(/^-/, '')) ? '(' + s + ')' : s; }
  /* one numerator times its multiplier, written for a solution: 3(x-2), (x+1)(x+4), 2x(x-4), 5 */
  function prodT(numPoly, mult) {
    var nt = tx(numPoly), mt = mult;
    if (mt === '1') return nt;
    var mp = /^-?\d*[a-z]?(\^\{\d+\})?$/.test(mt) && !/[+]/.test(mt);
    if (P.count(numPoly) === 1 && !P.vars(numPoly).length) { var c = P.constant(numPoly)[0]; if (mp) return tx(P.mul(numPoly, P.parse(mt))); return c === 1 ? mt : (c === -1 ? '-' + wrapM(mt) : c + '(' + mt + ')'); }
    if (mp && P.count(numPoly) === 1 && mt !== '-1') return tx(P.mul(numPoly, P.parse(mt)));
    if (!mp && P.count(numPoly) === 1) return nt + '(' + mt.replace(/^\((.*)\)$/, '$1') + ')';
    return (mp ? (mt === '-1' ? '-' : mt) : wrapM(mt)) + (P.count(numPoly) > 1 || mp ? '(' + nt + ')' : nt);
  }
  /* terms: [{ s: ±1, nf: atoms, df: atoms }] → { lcd, N0 (numerator over the LCD), T (reduced canon), steps } */
  function sumOf(terms, v) {
    var lc = lcdOf(terms.map(function (tm) { return tm.df; })), N0 = P.num(0), pieces = [];
    terms.forEach(function (tm, i) {
      var cd = canon([tm.df]), mc = cDiv(lc, cd), mpoly = cPoly1(mc), np = listPoly(tm.nf), sd = side(mc, 1), mt = (mc.c[0] < 0 ? '-' : '') + sideTex(sd);
      if (trivial(sd)) mt = mc.c[0] < 0 ? '-1' : '1';
      N0 = P.add(N0, P.scale(P.mul(np, mpoly), tm.s));
      var pt = prodT(np, mt), neg = tm.s < 0;
      if (mt === '-1') { pt = P.count(np) > 1 ? '(' + tx(np) + ')' : tx(np); neg = !neg; }
      if (neg && i > 0 && pt.charAt(0) !== '(' && /[+-]/.test(pt.slice(1)) && mt === '1') pt = '(' + pt + ')';
      pieces.push({ neg: neg, t: pt });
    });
    var stepNum = pieces.map(function (pc, i) { return i === 0 ? (pc.neg ? '-' + (pc.t.charAt(0) === '(' || !/[+-]/.test(pc.t.slice(1)) ? pc.t : '(' + pc.t + ')') : pc.t) : (pc.neg ? '-' : '+') + (pc.t.charAt(0) === '-' ? '(' + pc.t + ')' : pc.t); }).join('');
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
    return terms.map(function (tm, i) { var body = tm.df.length ? (tm.o && tm.o.fac ? '\\frac{' + polyT(tm.nf, tm.o.an) + '}{' + facTex(tm.df) + '}' : fracE(tm.nf, tm.df, tm.o)) : polyT(tm.nf, tm.o && tm.o.an); return (tm.s < 0 ? '-' : i === 0 ? '' : '+') + body; }).join('');
  }
  function sumKey(S) { var q = cPolys(S.T), sd = side(S.T, -1); if (trivial(sd)) return cTex(S.T); var N = q.N; if (P.lead(N)[0] < 0 && P.terms(N).some(function (tm) { return tm.c[0] > 0; })) return '\\frac{' + txa(N) + '}{' + sideTex(sd) + '}'; return cTex(S.T); }
  function sumSol(terms, S, npv, o) {
    o = o || {};
    var facd = terms.some(function (tm) { return tm.df.length && !(tm.o && tm.o.fac) && facTex(tm.df) !== polyT(tm.df, tm.o && tm.o.ad); });
    var s = '';
    if (facd) s += 'Factor the denominators: ' + t(terms.map(function (tm, i) { return (tm.s < 0 ? '-' : i === 0 ? '' : '+') + (tm.df.length ? '\\frac{' + polyT(tm.nf, tm.o && tm.o.an) + '}{' + facTex(tm.df) + '}' : polyT(tm.nf)); }).join('')) + '.<br>';
    s += (o.noNpv ? '' : 'NPVs: ' + t(npvTex(npv)) + '. ') + 'The LCD is ' + t(S.lcdT) + '.<br>';
    var key = sumKey(S), N0 = S.N0, mid = (P.lead(N0)[0] < 0 && P.terms(N0).some(function (tm) { return tm.c[0] > 0; })) ? '\\frac{' + txa(N0) + '}{' + S.lcdT + '}' : S.mid;
    var chain = [S.step]; if (mid !== S.step) chain.push(mid);
    if (S.cut) s += t(chain.join('=')) + '. Factor the numerator and divide out the common factor: ' + t(key) + '.';
    else { if (key !== mid) chain.push(key); s += t(chain.join('=')) + '.'; }
    return s;
  }

  function T1(s, nf, df, o) { return { s: s, nf: nf, df: df || [], o: o }; }
  function denAtoms(cn) { var out = []; Object.keys(cn.f).forEach(function (k) { if (cn.f[k].n < 0) out.push(A(cn.f[k].a, cn.f[k].b, cn.f[k].v)); }); Object.keys(cn.m).forEach(function (x) { if (cn.m[x] < 0) out.push(Mo(1, x, 1)); }); return out; }
  function cancelNW(cp, T, npv, why) { var w = npvOf([denAtoms(T)]); return npvEq(w, npv) ? [] : [{ vals: w, code: cp + 'npv-cancel', hint: why || 'State the NPVs from every <b>original</b> denominator before dividing out: a divided-out factor still cannot be ' + t(0) + '.' }]; }
  function monics(r, n, hi, test) { return pickWhere(function () { var a = []; for (var i = 0; i < n; i++) a.push(nz(r, 1, hi)); return a; }, function (a) { return a.every(function (x, i) { return a.indexOf(x) === i; }) && (!test || test(a)); }); }
  function small2(a, b) { return Math.abs(a * b) <= 48 && Math.abs(a + b) <= 14; }
  /* the usual wrong answers to a sum: added straight across, minus on the first term only, a numerator (or whole term) not
     multiplied by its multiplier */
  function sumWrongs(cp, terms, S) {
    var dl = [];
    if (terms.length === 2 && terms.every(function (tm) { return tm.df.length; })) {
      var sumN = P.add(P.scale(listPoly(terms[0].nf), terms[0].s), P.scale(listPoly(terms[1].nf), terms[1].s)), sumD = P.add(listPoly(terms[0].df), listPoly(terms[1].df));
      if (!P.isZero(sumD) && !P.isZero(sumN) && P.vars(sumD).length) dl.push({ cn: polyCn(sumN, sumD), code: cp + 'add-straight', hint: 'Fractions are added over a <b>common denominator</b>: you cannot add the denominators. Find the LCD, rewrite each fraction over it, then add the numerators.' });
    }
    terms.forEach(function (tm, i) {
      if (tm.s > 0 || P.count(listPoly(tm.nf)) < 2 && !tm.df.length) return;
      var lc = S.lcd, mc = cDiv(lc, canon([tm.df])), pr = P.mul(listPoly(tm.nf), cPoly1(mc));
      if (P.count(pr) < 2) return;
      var lead = P.sorted(pr)[0], restP = P.sub(pr, P.mono(lead.c, lead.v)), wrongN = P.add(S.N0, P.scale(restP, 2));
      dl.push({ cn: polyCn(wrongN, cPolys(lc).N), code: cp + 'sub-sign', hint: 'The minus sign in front of a fraction applies to its <b>whole</b> numerator: ' + t('-(' + tx(pr) + ')=' + tx(P.neg(pr))) + '.' });
    });
    terms.forEach(function (tm) {
      var lc = S.lcd, mc = cDiv(lc, canon([tm.df])), mp = cPoly1(mc);
      if (P.degree(mp) < 1 && rv(P.constant(mp)) === 1) return;
      var wrongN = P.add(S.N0, P.scale(P.sub(listPoly(tm.nf), P.mul(listPoly(tm.nf), mp)), tm.s));
      dl.push({ cn: polyCn(wrongN, cPolys(lc).N), code: cp + (tm.df.length ? 'lcd-num' : 'whole-lcd'), hint: tm.df.length ? 'When a denominator is multiplied to make the LCD, multiply its <b>numerator</b> by the same factor.' : 'Write the whole-number term as a fraction over the LCD: multiply it by the whole LCD.' });
    });
    return dl.filter(function (w) { var q = cPolys(w.cn); return !P.isZero(q.N); });
  }
  function sumAll(terms, v) { // sumOf, with a zero sum written as 0
    var S = sumOf(terms, v);
    if (P.isZero(S.N0)) { S.T = canon([[C(0)]]); S.cut = false; }
    return S;
  }
  /* "Simplify. State the NPVs." for a sum of terms; o.nw extra NPV wrongs, o.dl extra expression wrongs, o.solPre / o.solPost */
  function sumPart(cp, prompt, terms, v, o, hints, text) {
    o = o || {};
    var S = sumAll(terms, v), npv = npvOf(terms.map(function (tm) { return tm.df; })), dl = sumWrongs(cp, terms, S).concat(o.dl || []);
    var nw = (o.nw || []).concat(P.isZero(S.N0) ? [] : cancelNW(cp, S.T, npv));
    var sol = o.sol || ((o.solPre || '') + sumSol(terms, S, npv, o) + (o.solPost || ''));
    var p = simpPart(cp, (o.noTerms ? prompt : prompt + ' ' + t(termsTex(terms))), S.T, npv, { dl: dl, nw: nw, vars: o.vars || [v], keyTex: sumKey(S) }, sol, hints, text);
    p.S = S; p._terms = terms; return p;
  }
  /* the same with one box (no NPVs asked: numerical denominators, or a context with v > 0) */
  function sumRatPart(cp, prompt, terms, v, o, hints, text) {
    o = o || {};
    var S = sumAll(terms, v), npv = npvOf(terms.map(function (tm) { return tm.df; })), dl = sumWrongs(cp, terms, S).concat(o.dl || []);
    var sol = o.sol || ((o.solPre || '') + sumSol(terms, S, npv, { noNpv: true }) + (o.solPost || ''));
    var p = ratPart(cp, (o.noTerms ? prompt : prompt + ' ' + t(termsTex(terms))), S.T, { dl: dl, vars: o.vars || [v], keyTex: sumKey(S), before: o.before, after: o.after }, sol, hints, text);
    p.S = S; p._terms = terms; return p;
  }
  function polyCn(N, D) { // a canon for N / D (N, D polynomials; used for wrong answers)
    var cn = blank(); put(cn, [Q(N)], 1); put(cn, [Q(D)], -1); return cn;
  }

  /* ---------- small part builders shared by both lessons ---------- */
  /* several math boxes, each with its own checker */
  function boxes(prompt, specs, sol, hints, text) {
    var vars = vlist(specs.reduce(function (a, s) { return a.concat(s.vars || []); }, []));
    var fields = specs.map(function (s) { return { label: s.label, name: s.name || s.label.replace(/<[^>]*>|\\\(|\\\)|:$/g, ''), mode: 'math', keys: s.keys || 'u6krat', vars: vars.length ? vars : ['x'], before: s.before, after: s.after, placeholder: s.placeholder }; });
    var p = KP.fields(prompt, fields, specs.map(function (s) { return s.check; }), specs.map(function (s) { return s.key; }), specs.map(function (s) { return s.label + ' ' + t(s.key); }).join(', '), sol, hints, text);
    return p;
  }
  /* a number (exact: integer or fraction) in a math box */
  function valPart(prompt, q, diag, sol, hints, text, inp) {
    q = R(q);
    var p = KP.math(prompt, K.value(q, { diag: diag }), rt(q), sol, hints, text, Object.assign({ keys: 'u6knum' }, inp || {}));
    return p;
  }
  /* multiple choice with options that must all read differently */
  function mcPart(r, prompt, opts, sol, hints, text) {
    var seen = {}; opts.forEach(function (o) { if (seen[o.html]) throw new Error('u6k56 mc: two options read the same: ' + o.html); seen[o.html] = 1; });
    return KP.mc(r, prompt, opts, sol, hints, text);
  }
  function cMul(cn, c) { var o = JSON.parse(JSON.stringify(cn)); o.c = qm(o.c, R(c)); return o; }
  function cValAt(cn, env) { var q = cPolys(cn); return P.at(q.N, env) / P.at(q.D, env); }
  /* the factored form of an integer polynomial in v of degree ≤ 2 with rational roots, or null */
  function quadFac(N, v) {
    if (P.vars(N).length !== 1 || P.degreeIn(N, v) !== 2) return null;
    var a = rv(P.coef(N, mon(v, 2))), b = rv(P.coef(N, mon(v, 1))), c = rv(P.constant(N)), D = b * b - 4 * a * c;
    if (D < 0 || [a, b, c].some(function (z) { return z !== Math.round(z); })) return null;
    var s = Math.round(Math.sqrt(D)); if (s * s !== D) return null;
    var r1 = ex.norm(-b + s, 2 * a), r2 = ex.norm(-b - s, 2 * a), k = a / (r1[1] * r2[1]);
    var f1 = '(' + tx(lin(r1[1], -r1[0], v)) + ')', f2 = '(' + tx(lin(r2[1], -r2[0], v)) + ')';
    return (k === 1 ? '' : k === -1 ? '-' : String(k)) + (f1 === f2 ? f1 + '^{2}' : f1 + f2);
  }

  HW.u6k56 = { gcd: gcd, lcm: lcm, pickWhere: pickWhere, nz: nz, M: M, lin: lin, tx: tx, txa: txa, sg: sg, par: par, R: R, rv: rv, fr: fr, rt: rt, qm: qm, qd: qd, qa: qa,
    has: has, uniqR: uniqR, coefT: coefT, pickVar: pickVar, vlist: vlist, mon: mon,
    C: C, Mo: Mo, A: A, Q: Q, atomPoly: atomPoly, listPoly: listPoly, blank: blank, put: put, canon: canon, side: side, sideTex: sideTex, sidePoly: sidePoly, trivial: trivial,
    cTex: cTex, cPolys: cPolys, cNeg: cNeg, cSame: cSame, cMul: cMul, cValAt: cValAt, facTex: facTex, fracF: fracF, polyT: polyT, fracE: fracE,
    npvOf: npvOf, npvMerge: npvMerge, npvTex: npvTex, npvEq: npvEq, ratCheck: ratCheck, npvCheck: npvCheck, simpPart: simpPart, ratPart: ratPart, npvPart: npvPart,
    lcdOf: lcdOf, cDiv: cDiv, cPoly1: cPoly1, sumOf: sumOf, sumAll: sumAll, sumWrongs: sumWrongs, sumKey: sumKey, sumSol: sumSol, termsTex: termsTex, sumPart: sumPart, sumRatPart: sumRatPart,
    polyCn: polyCn, T1: T1, denAtoms: denAtoms, cancelNW: cancelNW, monics: monics, small2: small2, content: content, quadFac: quadFac,
    boxes: boxes, valPart: valPart, mcPart: mcPart };

  /* ======================================================================================================
   * Lesson 5 generators
   * ====================================================================================================== */
  var CP = LID + '-';
  function nice(x) { return Math.abs(x - Math.round(x)) < 1e-9; }
  function F(n) { return HW.fmt(n); }
  var H_MONO = ['State the NPVs: each variable in a denominator cannot be ' + t(0) + '. Then find the LCD: the LCM of the coefficients times each variable to its highest power.',
    'Multiply each numerator by what its denominator was multiplied by to make the LCD, combine the numerators (brackets when subtracting), then simplify.'];
  var H_SAME = ['The denominators are the same: state the NPVs, then combine the numerators over that denominator. A minus sign changes the sign of every term of the numerator after it.',
    'Factor the numerator: a factor it shares with the denominator divides out (the NPVs stay).'];
  var H_NUM = ['Find the LCD of the numbers, and multiply each <b>whole</b> numerator (in brackets) by the factor its denominator needs.',
    'Expand, collect like terms, and factor the numerator if you can. These denominators are numbers, so there are no NPVs.'];

  /* ---------- numerical fractions (Ex 1, #1, EP A1a–b) ---------- */
  function numFrac(r, k, opt) {
    opt = opt || {};
    var dens = opt.dens || [2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 18];
    var z = pickWhere(function () {
      var ds = [], ns = [], sgs = [1];
      for (var i = 0; i < k; i++) ds.push(r.pick(dens));
      for (i = 0; i < k; i++) ns.push(r.int(1, Math.max(1, ds[i] - 1)));
      for (i = 1; i < k; i++) sgs.push(opt.signs ? opt.signs[i] : (r.chance(0.5) ? 1 : -1));
      return { ds: ds, ns: ns, sg: sgs };
    }, function (z) {
      if (z.ds.some(function (d, i) { return z.ds.indexOf(d) !== i; })) return false;
      if (z.ns.some(function (n, i) { return gcd(n, z.ds[i]) !== 1; })) return false;
      var L = z.ds.reduce(function (a, b) { return lcm(a, b); }, 1); if (L > (k === 3 ? 60 : 48)) return false;
      var sum = z.ns.reduce(function (a, n, i) { return a + z.sg[i] * n * L / z.ds[i]; }, 0);
      if (sum === 0) return false;
      if (opt.neg != null && (sum < 0) !== opt.neg) return false;
      var key = z.ds.map(function (d, i) { return z.ns[i] + '/' + d; }).join(z.sg[1] > 0 ? '+' : '-');
      if ((opt.avoid || []).indexOf(key) >= 0) return false;
      if (k === 2 && z.ds[0] * z.ds[1] === L && r.chance(0.7)) return false;
      if (k === 2 && (L === z.ds[0] || L === z.ds[1]) && r.chance(0.5)) return false;
      return true;
    });
    var L = z.ds.reduce(function (a, b) { return lcm(a, b); }, 1), nums = z.ns.map(function (n, i) { return z.sg[i] * n * L / z.ds[i]; }), sum = nums.reduce(function (a, b) { return a + b; }, 0);
    var ans = ex.norm(sum, L), ex0 = z.ns.map(function (n, i) { return (i === 0 ? '' : z.sg[i] > 0 ? '+' : '-') + '\\frac{' + n + '}{' + z.ds[i] + '}'; }).join('');
    var st = ex.norm(z.ns.reduce(function (a, n, i) { return a + z.sg[i] * n; }, 0), z.ds.reduce(function (a, d) { return a + d; }, 0));
    var step = nums.map(function (n, i) { return (i === 0 ? (n < 0 ? '-' : '') : n < 0 ? '-' : '+') + '\\frac{' + Math.abs(n) + '}{' + L + '}'; }).join('');
    var sol = 'The LCD is ' + t(L) + ': ' + t(ex0 + '=' + step + '=' + (sum < 0 ? '-' : '') + '\\frac{' + Math.abs(sum) + '}{' + L + '}' + (ans[1] !== L ? '=' + rt(ans) : '')) + '.';
    var p = KP.fraction('Simplify. ' + t(ex0), ans, { diag: function (v) { if (st[1] && Math.abs(v - rv(st)) < 1e-9) return { code: CP + 'num-straight', hint: 'You cannot add the denominators. Write both fractions over the LCD (the lowest common multiple of ' + z.ds.join(', ') + '), then add the numerators.' }; return null; } },
      sol, ['Find the lowest common multiple of ' + z.ds.join(', ') + '. Rewrite each fraction with that denominator.', 'Add or subtract the numerators, keep the denominator, and reduce.'], k === 3 ? 'three fractions' : (z.sg[1] > 0 ? 'add fractions' : 'subtract fractions'));
    if (st[1] && Math.abs(rv(st) - rv(ans)) > 1e-9) p.bad = [rt(st)];
    return p;
  }

  /* ---------- numerical denominators with variable numerators (Ex 2, #2, EP A1c–d) ---------- */
  function numDen(r, o) {
    var v = o.v || pickVar(r), k = o.k || 2;
    var z = pickWhere(function () {
      var ds = [], ts = [];
      for (var i = 0; i < k; i++) ds.push(r.pick(o.dens || [2, 3, 4, 5, 6, 8, 9, 10, 12]));
      for (i = 0; i < k; i++) {
        var a = r.pick(o.coef || [1, 1, 2, 3]), b = nz(r, 1, 9), s = i === 0 ? 1 : (o.signs ? o.signs[i] : (r.chance(0.5) ? 1 : -1));
        if (o.bare && o.bare[i]) b = 0;
        ts.push(T1(s, [b === 0 ? Mo(a, v, 1) : A(a, b, v)], [C(ds[i])]));
      }
      return { ds: ds, ts: ts };
    }, function (z) {
      if (z.ds.some(function (d, i) { return z.ds.indexOf(d) !== i; })) return false;
      var L = z.ds.reduce(function (a, b) { return lcm(a, b); }, 1); if (L > 36 || z.ds.some(function (d) { return d === L; }) && k === 2 && r.chance(0.6)) return false;
      if (z.ts.some(function (tm, i) { var at = tm.nf[0]; return at.k === 'l' && gcd(gcd(at.a, at.b), z.ds[i]) > 1; })) return false;
      var S = sumOf(z.ts, v); if (P.isZero(S.N0) || P.degreeIn(S.N0, v) < 1 || !P.constant(S.N0)[0]) return false;
      if (o.factor != null && (content(S.N0) > 1 && gcd(content(S.N0), L) === 1) !== o.factor) return false;
      if (o.reduce && !(gcd(content(S.N0), L) > 1)) return false;
      return true;
    });
    return sumRatPart(CP, 'Simplify.', z.ts, v, {}, H_NUM, o.text || 'numerical denominators');
  }

  /* ---------- the same denominator (Ex 3, #3, EP A2) ---------- */
  function same(r, kind) {
    var v = pickVar(r), terms, post = '';
    if (kind === 'mono') {
      var s = pickWhere(function () { return { c: r.int(2, 9), p: r.int(1, 15), q: r.int(1, 15), sub: r.chance(0.4) }; }, function (z) { var n = z.sub ? z.p - z.q : z.p + z.q; return n > 0 && gcd(n, z.c) > 1 && n % z.c !== 0 && z.p !== z.q && !(z.c === 2 && z.p === 7 && z.q === 3) && !(z.c === 5 && z.p === 4 && z.q === 11); });
      terms = [T1(1, [C(s.p)], [Mo(s.c, v, 1)]), T1(s.sub ? -1 : 1, [C(s.q)], [Mo(s.c, v, 1)])];
    } else if (kind === 'monobin') { // (a1 v + b1)/(c v) − (a2 v + b2)/(c v), the result reduces by a number
      var b = pickWhere(function () { return { c: r.int(2, 6), a1: r.int(2, 8), b1: nz(r, 1, 9), a2: r.int(1, 6), b2: nz(r, 1, 9) }; }, function (z) {
        var A1 = z.a1 - z.a2, B1 = z.b1 - z.b2; return A1 > 0 && B1 !== 0 && z.b2 < 0 === r.chance(0.6) && gcd(gcd(A1, B1), z.c) > 1 && A1 % z.c !== 0 || false; });
      terms = [T1(1, [A(b.a1, b.b1, v)], [Mo(b.c, v, 1)]), T1(-1, [A(b.a2, b.b2, v)], [Mo(b.c, v, 1)])];
    } else if (kind === 'const') { // (a1 v + b1)/(v − d) − (a2 v + b2)/(v − d) = k
      var c = pickWhere(function () { return { d: nz(r, 1, 7), k: r.int(1, 5), a2: r.int(1, 6), b2: nz(r, 1, 9) }; }, function (z) { var b1 = z.b2 - z.k * z.d; return b1 !== 0 && z.a2 + z.k <= 9 && !(z.d === 2 && z.k === 2) && !(z.d === -4 && z.k === 3); });
      terms = [T1(1, [A(c.a2 + c.k, c.b2 - c.k * c.d, v)], [A(1, -c.d, v)]), T1(-1, [A(c.a2, c.b2, v)], [A(1, -c.d, v)])];
    } else if (kind === 'tri') { // (v² + b v)/(v + d) − c/(v + d) → v + e
      var z = monics(r, 2, 8, function (a) { return a[0] !== -a[1] && a[0] + a[1] !== 0 && a[0] * a[1] < 0 && !(a[0] === 5 && a[1] === -3) && !(a[0] === -3 && a[1] === 3); });
      var d = z[0], e = z[1];
      terms = [T1(1, [Mo(1, v, 1), A(1, d + e, v)], [A(1, d, v)]), T1(-1, [C(-d * e)], [A(1, d, v)])];
    } else if (kind === 'dos') { // v²/(v − p) − p²/(v − p) → v + p
      var p = pickWhere(function () { return r.int(2, 9); }, function (x) { return x !== 3 && x !== 4; });
      terms = [T1(1, [Mo(1, v, 2)], [A(1, -p, v)]), T1(-1, [C(p * p)], [A(1, -p, v)])];
    } else if (kind === 'square') { // (v² + d²)/(v − d) − 2d v/(v − d) → v − d   (or + with v + d)
      var q = pickWhere(function () { return r.int(2, 9); }, function (x) { return x !== 2; }), plus = r.chance(0.4);
      terms = plus ? [T1(1, [Q(P.add(P.mono(1, mon(v, 2)), P.num(q * q)))], [A(1, q, v)]), T1(1, [Mo(2 * q, v, 1)], [A(1, q, v)])]
        : [T1(1, [Q(P.add(P.mono(1, mon(v, 2)), P.num(q * q)))], [A(1, -q, v)]), T1(-1, [Mo(2 * q, v, 1)], [A(1, -q, v)])];
    } else { // 'gcf': p v/(c(v + a)) ± p a/(c(v + a)) → p/c
      var g = pickWhere(function () { return { p: r.int(2, 9), c: r.int(2, 7), a: nz(r, 1, 8) }; }, function (z) { return gcd(z.p, z.c) === 1 && !(z.p === 5 && z.c === 3 && z.a === 1); });
      var fo = r.chance(0.6) ? { fac: true } : undefined;
      terms = g.a > 0 ? [T1(1, [Mo(g.p, v, 1)], [C(g.c), A(1, g.a, v)], fo), T1(1, [C(g.p * g.a)], [C(g.c), A(1, g.a, v)], fo)]
        : [T1(1, [Mo(g.p, v, 1)], [C(g.c), A(1, g.a, v)], fo), T1(-1, [C(-g.p * g.a)], [C(g.c), A(1, g.a, v)], fo)];
    }
    return sumPart(CP, 'Simplify. State the non-permissible values.', terms, v, {}, H_SAME, 'one denominator: ' + kind);
  }

  /* ---------- the LCD of monomials (Ex 4, #4, EP A4) ---------- */
  function lcdPart(r, kind) {
    var ms = pickWhere(function () {
      var v = r.pick(['x', 'a', 'm', 'y', 't']), w = r.pick(['y', 'b', 'n', 'q']).replace(v, 'z'), cs = function () { return r.int(2, 12); };
      if (kind === 'same') return [Mo(cs(), v, 1), Mo(cs(), v, 1)];
      if (kind === 'pow') return [Mo(cs(), v, r.int(2, 3)), Mo(cs(), v, 1)];
      if (kind === 'two') return [Mo(cs(), v, r.int(1, 2), w, r.int(1, 3)), Mo(cs(), v, r.int(2, 3))];
      if (kind === 'two2') return [Mo(cs(), v, r.int(1, 3), w, r.int(1, 2)), Mo(cs(), v, 1, w, r.int(2, 3))];
      if (kind === 'three') return [Mo(r.int(2, 5), v, 1), Mo(r.int(2, 5), w, 1), Mo(r.int(2, 12), v, 1, w, 1)];
      if (kind === 'const') return [C(r.int(2, 9)), Mo(r.int(2, 6), v, 1), Mo(r.int(2, 12), v, 2)];
      return [Mo(r.int(2, 6), v, 2), Mo(r.int(2, 9), v, 1, w, 1), Mo(r.int(2, 6), w, 3)]; // 'three2'
    }, function (ms) {
      var cs = ms.map(function (m) { return rv(m.c); }), L = cs.reduce(function (a, b) { return lcm(a, b); }, 1), prod = cs.reduce(function (a, b) { return a * b; }, 1);
      if (cs.some(function (c, i) { return cs.indexOf(c) !== i; })) return false;
      if (L > 60) return false;
      if (kind === 'same' && (prod === L || cs.some(function (c) { return c === L; }))) return false;
      if ((kind === 'two' || kind === 'two2' || kind === 'three2') && prod === L && r.chance(0.6)) return false;
      if (kind === 'three' && cs[2] === L) return false;
      if (kind === 'const' && cs[2] % cs[0] === 0 && cs[2] % cs[1] === 0 && r.chance(0.7)) return false;
      var key = JSON.stringify(ms); return ['[{"k":"m","c":[4,1],"m":{"x":1}},{"k":"m","c":[6,1],"m":{"x":1}}]', '[{"k":"m","c":[5,1],"m":{"x":1}},{"k":"m","c":[3,1],"m":{"x":2}}]'].indexOf(key) < 0;
    });
    var cs = ms.map(function (m) { return rv(m.c); }), L = cs.reduce(function (a, b) { return lcm(a, b); }, 1), prod = cs.reduce(function (a, b) { return a * b; }, 1);
    var hi = {}, lo = {}; ms.forEach(function (m) { Object.keys(m.m || {}).forEach(function (x) { hi[x] = Math.max(hi[x] || 0, m.m[x]); lo[x] = Math.min(lo[x] == null ? 99 : lo[x], m.m[x]); }); });
    var T = P.mono(L, hi), wr = [];
    var prodP = ms.reduce(function (acc, m) { return P.mul(acc, atomPoly(m)); }, P.num(1));
    if (!P.eq(prodP, T)) wr.push({ is: prodP, code: CP + 'lcd-prod', hint: 'Multiplying the denominators gives <i>a</i> common denominator, but not the <b>lowest</b> one. Take the LCM of the coefficients and each variable to its highest power only.' });
    var low = P.mono(L, lo); if (!P.eq(low, T)) wr.push({ is: low, code: CP + 'lcd-low', hint: 'Each variable must be raised to its <b>highest</b> power: the LCD has to be divisible by every denominator.' });
    var cp2 = P.mono(prod, hi); if (!P.eq(cp2, T)) wr.push({ is: cp2, code: CP + 'lcd-coef', hint: 'The coefficient of the LCD is the <b>lowest</b> common multiple of ' + cs.join(', ') + ', not their product.' });
    var vs = Object.keys(hi).sort(), list = ms.map(function (m) { return t(polyT([m])); });
    var listT = list.length === 2 ? list.join(' and ') : list.slice(0, -1).join(', ') + ' and ' + list[list.length - 1];
    var sol = 'The LCM of ' + cs.join(', ') + ' is ' + t(L) + '. ' + vs.map(function (x) { return 'The highest power of ' + t(x) + ' is ' + t(hi[x] === 1 ? x : x + '^{' + hi[x] + '}'); }).join('; ') + '.<br>LCD ' + t('=' + tx(T)) + '.';
    var p = KP.poly('Determine the LCD of ' + listT + '.', T, { wrong: wr, vars: vs }, sol, ['The coefficient is the lowest common multiple of the coefficients.', 'Then include each variable, raised to the highest power that appears.'], 'LCD of monomials: ' + kind);
    p.bad = wr.map(function (w) { return tx(w.is); });
    return p;
  }

  /* ---------- different monomial denominators, number numerators (Ex 5, #5, EP A3a–c) ---------- */
  function monoNum(r, kind) {
    var vw = r.pick([['a', 'b'], ['m', 'n'], ['x', 'y'], ['p', 'q']]), v = (kind === 'f' || kind === 'g') ? vw[0] : pickVar(r), w = vw[1], terms, vars = [v];
    var cop = function (n, d) { return gcd(n, d) === 1; };
    if (kind === 'a') { // p/(a v) + q/(b v)
      var s = pickWhere(function () { return { a: r.int(2, 9), b: r.int(2, 9), p: r.int(1, 9), q: r.int(1, 9), sub: r.chance(0.35) }; }, function (z) { return z.a !== z.b && lcm(z.a, z.b) <= 36 && z.a % z.b && z.b % z.a && cop(z.p, z.a) && cop(z.q, z.b) && !(z.a === 2 && z.b === 3 && z.p === 5 && z.q === 1) && !(z.a === 3 && z.b === 6); });
      terms = [T1(1, [C(s.p)], [Mo(s.a, v, 1)]), T1(s.sub ? -1 : 1, [C(s.q)], [Mo(s.b, v, 1)])];
    } else if (kind === 'b') { // p/v − q/(b v)
      var b = pickWhere(function () { return { p: r.int(2, 9), b: r.int(2, 9), q: r.int(1, 9), add: r.chance(0.3) }; }, function (z) { return cop(z.q, z.b) && !(z.p === 7 && z.b === 5 && z.q === 2); });
      terms = [T1(1, [C(b.p)], [Mo(1, v, 1)]), T1(b.add ? 1 : -1, [C(b.q)], [Mo(b.b, v, 1)])];
    } else if (kind === 'c' || kind === 'd') { // p/(a v^e) ± q/(b v^f)
      var c = pickWhere(function () { var e = kind === 'c' ? 2 : 1, f = kind === 'c' ? 1 : r.pick([2, 3]); return { a: r.int(2, 9), b: r.int(2, 9), p: r.int(1, 9), q: r.int(1, 9), e: e, f: f, sub: kind === 'd' || r.chance(0.3) }; }, function (z) {
        return z.a !== z.b && lcm(z.a, z.b) <= 36 && lcm(z.a, z.b) < z.a * z.b && cop(z.p, z.a) && cop(z.q, z.b) && !(z.a === 4 && z.b === 6 && z.p === 3 && z.q === 5) && !(z.a === 9 && z.b === 6 && z.p === 2 && z.q === 5); });
      terms = [T1(1, [C(c.p)], [Mo(c.a, v, c.e)]), T1(c.sub ? -1 : 1, [C(c.q)], [Mo(c.b, v, c.f)])];
    } else if (kind === 'e') { // p/v ± q/v² ± s/v³
      var e2 = pickWhere(function () { return { p: r.int(1, 6), q: r.int(1, 6), s: r.int(1, 6), s2: r.chance(0.6) ? 1 : -1, s3: r.chance(0.5) ? 1 : -1 }; }, function (z) { return !(z.p === 1 && z.q === 1 && z.s === 1 && z.s2 > 0 && z.s3 > 0) || r.chance(0.1); });
      terms = [T1(1, [C(e2.p)], [Mo(1, v, 1)]), T1(e2.s2, [C(e2.q)], [Mo(1, v, 2)]), T1(e2.s3, [C(e2.s)], [Mo(1, v, 3)])];
    } else if (kind === 'f') { // p/(a v w) − q/(b v²)
      vars = [v, w];
      var f2 = pickWhere(function () { return { a: r.int(2, 6), b: r.int(2, 6), p: r.int(1, 9), q: r.int(1, 9) }; }, function (z) { return z.a !== z.b && cop(z.p, z.a) && cop(z.q, z.b) && !(z.a === 3 && z.b === 2 && z.p === 4); });
      terms = [T1(1, [C(f2.p)], [Mo(f2.a, v, 1, w, 1)]), T1(-1, [C(f2.q)], [Mo(f2.b, v, 2)])];
    } else if (kind === 'g') { // p/(a v² w) + q/(b v w³)
      vars = [v, w];
      var g = pickWhere(function () { return { a: r.int(2, 9), b: r.int(2, 9), p: r.int(1, 9), q: r.int(1, 9), e: r.int(2, 3), f: r.int(2, 3), sub: r.chance(0.3) }; }, function (z) { return z.a !== z.b && lcm(z.a, z.b) <= 36 && lcm(z.a, z.b) < z.a * z.b && cop(z.p, z.a) && cop(z.q, z.b) && !(z.a === 6 && z.b === 8 && z.p === 5 && z.q === 3) && !(z.a === 6 && z.b === 9); });
      terms = [T1(1, [C(g.p)], [Mo(g.a, v, g.e, w, 1)]), T1(g.sub ? -1 : 1, [C(g.q)], [Mo(g.b, v, 1, w, g.f)])];
    } else { // 'zero': n1/(L v) − n2/(d2 v) − n3/(d3 v) = 0
      var h = pickWhere(function () { var L = r.pick([6, 10, 12, 15, 18, 20, 24, 30]), dv = []; for (var d = 2; d < L; d++) if (L % d === 0) dv.push(d); var d2 = r.pick(dv), d3 = r.pick(dv); return { L: L, d2: d2, d3: d3, n2: r.int(1, 5), n3: r.int(1, 5) }; }, function (z) {
        if (z.d2 === z.d3 || lcm(z.d2, z.d3) !== z.L || gcd(z.n2, z.d2) !== 1 || gcd(z.n3, z.d3) !== 1) return false; var n1 = z.n2 * z.L / z.d2 + z.n3 * z.L / z.d3; z.n1 = n1; return gcd(n1, z.L) === 1 && !(z.L === 12 && z.n1 === 7); });
      terms = [T1(1, [C(h.n1)], [Mo(h.L, v, 1)]), T1(-1, [C(h.n2)], [Mo(h.d2, v, 1)]), T1(-1, [C(h.n3)], [Mo(h.d3, v, 1)])];
    }
    return sumPart(CP, 'Simplify. State the non-permissible values.', terms, v, { vars: vars }, H_MONO, 'monomial denominators: ' + kind);
  }

  /* ---------- binomial numerators over monomial denominators (Ex 6, #6, EP A3d–e) ---------- */
  function monoBin(r, kind) {
    var vw = r.pick([['a', 'b'], ['m', 'n'], ['x', 'y'], ['p', 'q']]), v = kind === 'e' ? vw[0] : pickVar(r), w = vw[1], terms, vars = [v], post = '';
    if (kind === 'a' || kind === 'b') { // (c1 v + p)/(a v) ± (c2 v + q)/(b v)
      var s = pickWhere(function () { return { a: r.int(2, 9), b: r.int(2, 9), c1: kind === 'a' ? 1 : r.int(1, 4), c2: r.pick([1, 1, 2]), p: nz(r, 1, 9), q: nz(r, 1, 9), sub: kind === 'b' }; }, function (z) {
        var L = lcm(z.a, z.b); if (z.a === z.b || L > 30 || z.a % z.b === 0 || z.b % z.a === 0) return false;
        if (gcd(gcd(z.c1, z.p), z.a) > 1 || gcd(gcd(z.c2, z.q), z.b) > 1) return false;
        var A1 = z.c1 * L / z.a + (z.sub ? -1 : 1) * z.c2 * L / z.b, B1 = z.p * L / z.a + (z.sub ? -1 : 1) * z.q * L / z.b;
        return A1 !== 0 && B1 !== 0 && !(z.a === 2 && z.b === 5 && z.p === 4 && z.q === -1) && !(z.a === 3 && z.b === 2 && z.p === 2 && z.q === -4) && !(z.a === 4 && z.b === 6 && z.p === -2);
      });
      terms = [T1(1, [A(s.c1, s.p, v)], [Mo(s.a, v, 1)]), T1(s.sub ? -1 : 1, [A(s.c2, s.q, v)], [Mo(s.b, v, 1)])];
    } else if (kind === 'c') { // (c1 v + p)/(a v) − (v + q)/v²
      var c = pickWhere(function () { return { a: r.int(2, 6), c1: r.int(1, 4), p: nz(r, 1, 7), q: nz(r, 1, 7) }; }, function (z) { return gcd(gcd(z.c1, z.p), z.a) === 1 && z.p - z.a !== 0 && !(z.a === 3 && z.c1 === 2 && z.p === 1 && z.q === -4); });
      terms = [T1(1, [A(c.c1, c.p, v)], [Mo(c.a, v, 1)]), T1(-1, [A(1, c.q, v)], [Mo(1, v, 2)])];
    } else if (kind === 'd') { // (v + p)/(a v²) + (v + q)/(b v) with a numerator that factors
      var d = pickWhere(function () { return { a: r.int(2, 9), b: r.int(2, 9), p: nz(r, 1, 9), q: nz(r, 1, 9) }; }, function (z) {
        var L = lcm(z.a, z.b); if (z.a === z.b || L > 36 || gcd(z.p, z.a) > 1 || gcd(z.q, z.b) > 1) return false;
        var S = sumOf([T1(1, [A(1, z.p, v)], [Mo(z.a, v, 2)]), T1(1, [A(1, z.q, v)], [Mo(z.b, v, 1)])], v);
        return !!quadFac(S.N0, v) && content(S.N0) === 1 && !(z.a === 6 && z.b === 9 && z.p === -5 && z.q === 2) && !(z.a === 6 && z.b === 4);
      });
      terms = [T1(1, [A(1, d.p, v)], [Mo(d.a, v, 2)]), T1(1, [A(1, d.q, v)], [Mo(d.b, v, 1)])];
      var Sd = sumOf(terms, v); post = '<br>The numerator factors: ' + t('\\frac{' + quadFac(Sd.N0, v) + '}{' + Sd.lcdT + '}') + ' (no factor in common with the denominator).';
    } else if (kind === 'e') { // (αv + βw)/(v w) + (γv + δw)/v²
      vars = [v, w];
      var e = pickWhere(function () { return { al: nz(r, 1, 4), be: nz(r, 1, 4), ga: nz(r, 1, 4), de: r.int(1, 5) }; }, function (z) { return z.al > 0 && z.ga > 0 && !(z.al === 2 && z.be === -1 && z.ga === 1 && z.de === 3) && (z.be + z.ga === 0 || r.chance(0.5)); });
      var n1 = P.add(P.mono(e.al, mon(v, 1)), P.mono(e.be, mon(w, 1))), n2 = P.add(P.mono(e.ga, mon(v, 1)), P.mono(e.de, mon(w, 1)));
      terms = [T1(1, [Q(n1)], [Mo(1, v, 1, w, 1)]), T1(1, [Q(n2)], [Mo(1, v, 2)])];
    } else { // 'f': (p − c v)/(a v²) − (q − v)/(b v), ascending numerators
      var f = pickWhere(function () { return { a: r.pick([2, 4, 6, 8, 10, 12]), b: r.pick([2, 3, 4, 6, 9]), p: r.int(1, 9), c: r.int(1, 5), q: r.int(1, 9) }; }, function (z) { return z.a !== z.b && lcm(z.a, z.b) <= 36 && lcm(z.a, z.b) > Math.max(z.a, z.b) && gcd(gcd(z.p, z.c), z.a) === 1 && gcd(z.q, z.b) === 1 && !(z.a === 10 && z.b === 4 && z.p === 5); });
      terms = [T1(1, [A(-f.c, f.p, v)], [Mo(f.a, v, 2)], { an: true }), T1(-1, [A(-1, f.q, v)], [Mo(f.b, v, 1)], { an: true })];
    }
    return sumPart(CP, 'Simplify. State the non-permissible values.', terms, v, { vars: vars, solPost: post }, H_MONO, 'binomial numerators: ' + kind);
  }

  /* ---------- whole-number terms (Ex 7, #7, EP A3f) ---------- */
  function whole(r, kind) {
    var v = pickVar(r), terms, post = '';
    if (kind === 'a') { var c = r.int(2, 9), p = r.int(1, 9); terms = [T1(1, [C(c)], []), T1(r.chance(0.5) ? 1 : -1, [C(p)], [Mo(1, v, 1)])]; if (c === 3 && p === 2) terms[1].nf = [C(5)]; }
    else if (kind === 'b') { var q = r.int(1, 9), d = r.int(2, 9); terms = [T1(1, [C(q)], [Mo(1, v, 1)]), T1(r.chance(0.7) ? -1 : 1, [C(d)], [])]; }
    else if (kind === 'c') { // v + b − c/v, numerator factors
      var z = pickWhere(function () { return { m: r.int(1, 8), n: r.int(1, 8) }; }, function (z) { return z.m !== z.n && !(z.m === 3 && z.n === 2) && !(z.m === 6 && z.n === 2); });
      terms = [T1(1, [A(1, z.m - z.n, v)], []), T1(-1, [C(z.m * z.n)], [Mo(1, v, 1)])];
      post = '<br>The numerator factors: ' + t('\\frac{(' + tx(lin(1, z.m, v)) + ')(' + tx(lin(1, -z.n, v)) + ')}{' + v + '}') + '.';
    } else if (kind === 'three') { // a v/b − c + d/(e v)
      var s = pickWhere(function () { return { a: r.int(1, 5), b: r.int(2, 6), c: r.int(1, 5), d: r.int(1, 9), e: r.int(2, 6) }; }, function (z) { return z.b !== z.e && gcd(z.a, z.b) === 1 && gcd(z.d, z.e) === 1 && lcm(z.b, z.e) <= 30 && !(z.a === 2 && z.b === 3 && z.e === 4); });
      terms = [T1(1, [Mo(s.a, v, 1)], [C(s.b)]), T1(-1, [C(s.c)], []), T1(1, [C(s.d)], [Mo(s.e, v, 1)])];
    } else { // 'quad': a v − b + c/v (EP A3f)
      var g = pickWhere(function () { return { a: r.int(2, 6), b: r.int(1, 9), c: r.int(1, 9) }; }, function (z) { return z.b * z.b - 4 * z.a * z.c < 0 || r.chance(0.3); });
      terms = [T1(1, [A(g.a, -g.b, v)], []), T1(1, [C(g.c)], [Mo(1, v, 1)])];
    }
    return sumPart(CP, 'Simplify. State the non-permissible values.', terms, v, { solPost: post }, ['A term with no denominator is a fraction over ' + t(1) + ': rewrite it over the LCD like any other term.', 'State the NPV first, then combine the numerators over the LCD.'], 'whole-number terms: ' + kind);
  }

  /* ---------- the k that makes a difference a constant (#12) ---------- */
  function addK(r) {
    var s = pickWhere(function () { return { a: r.int(2, 6), b: r.int(2, 6), mm: nz(r, 1, 9), sg: r.chance(0.35) ? 1 : -1 }; }, function (z) {
      if (z.a === z.b) return false; var L = lcm(z.a, z.b), u = L / z.a, w = L / z.b, k = -z.sg * w * z.mm / u;
      z.L = L; z.u = u; z.w = w; z.k = k;
      return nice(k) && k !== 0 && Math.abs(k) <= 12 && u + z.sg * w !== 0 && !(z.a === 2 && z.b === 3 && z.mm === -3 && z.sg < 0);
    });
    var k = s.k, op = s.sg > 0 ? '+' : '-', second = tx(lin(1, s.mm)), c = ex.norm(s.u + s.sg * s.w, s.L), Ac = s.u + s.sg * s.w, Cc = s.sg * s.w * s.mm;
    var prompt = 'Determine the value of ' + t('k') + ' so that ' + t('\\frac{x+k}{' + s.a + 'x}' + op + '\\frac{' + second + '}{' + s.b + 'x}') + ' simplifies to ' + t(rt(c)) + ' (for ' + t('x\\ne 0') + ').';
    var sol = 'The LCD is ' + t(s.L + 'x') + ': ' + t('\\frac{' + (s.u === 1 ? 'x+k' : s.u + '(x+k)') + op + (s.w === 1 ? '(' + second + ')' : s.w + '(' + second + ')') + '}{' + s.L + 'x}') + '. The numerator is ' + t(tx(lin(Ac, Cc)) + '+' + coefT(s.u) + 'k') + '.<br>For the result to be a constant, the constant terms must cancel: ' + t(coefT(s.u) + 'k' + sg(Cc) + '=0') + ', so ' + t('k=' + k) + '. Then it is ' + t('\\frac{' + coefT(Ac) + 'x}{' + s.L + 'x}=' + rt(c)) + '.';
    var p = KP.math(prompt, K.value(k, { diag: function (val) { if (Math.abs(val + k) < 1e-9) return { code: CP + 'k-sign', hint: 'Check the signs: ' + (s.sg > 0 ? '' : 'the minus sign changes the sign of every term of the second numerator. ') + 'The constant terms of the numerator must add to ' + t(0) + '.' }; return null; } }),
      String(k), sol, ['Write both fractions over the LCD and combine the numerators (keep ' + t('k') + ' as a letter).', 'The answer has no ' + t('x') + ' left, so the constant terms of the numerator must cancel.'], 'working backwards: k', { keys: 'u6knum', before: 'k=' });
    p.bad = [String(-k)];
    return p;
  }

  /* ---------- split n/(L x) into a/(p x) + b/(q x) (#13) ---------- */
  function splitPart(r) {
    var z = pickWhere(function () { var pq = r.pick([[3, 4], [2, 3], [2, 5], [3, 5], [4, 5], [2, 7], [3, 7], [4, 3], [5, 2], [5, 3]]); return { p: pq[0], q: pq[1], n: r.int(5, 40) }; }, function (z) {
      var L = lcm(z.p, z.q), u = L / z.p, w = L / z.q, sols = [];
      for (var a = 1; a * u < z.n; a++) { var rem = z.n - a * u; if (rem > 0 && rem % w === 0) sols.push([a, rem / w]); }
      z.L = L; z.u = u; z.w = w; z.sols = sols;
      return sols.length === 1 && gcd(z.n, L) === 1 && !(z.p === 3 && z.q === 4 && z.n === 7);
    });
    var a0 = z.sols[0][0], b0 = z.sols[0][1];
    var chk = function (resp) {
      var ra = K.value(a0)(resp[0] == null ? '' : resp[0]), rb = K.value(b0)(resp[1] == null ? '' : resp[1]);
      if (ra.v === 'correct' && rb.v === 'correct') return ok();
      var A0 = K.read(resp[0]), B0 = K.read(resp[1]);
      if (A0.res || B0.res) return A0.res || B0.res;
      if (Math.abs(A0.val - b0) < 1e-9 && Math.abs(B0.val - a0) < 1e-9 && a0 !== b0) return wrong('value', 'Those are the right numbers in the wrong boxes: ' + t('\\frac{a}{' + z.p + 'x}') + ' is multiplied by ' + t(z.u) + ' to reach the LCD.');
      if (z.u * A0.val + z.w * B0.val === z.n && (A0.val <= 0 || B0.val <= 0 || !nice(A0.val) || !nice(B0.val))) return wrong('value', t('a') + ' and ' + t('b') + ' must be <b>positive integers</b>.');
      return wrong('value', 'Over the LCD ' + t(z.L + 'x') + ', the numerator is ' + t(coefT(z.u) + 'a+' + coefT(z.w) + 'b') + '. It must equal ' + t(z.n) + '.');
    };
    var fields = [{ label: t('a='), name: 'a', mode: 'math', keys: 'u6knum' }, { label: t('b='), name: 'b', mode: 'math', keys: 'u6knum' }];
    var sol = t('\\frac{a}{' + z.p + 'x}+\\frac{b}{' + z.q + 'x}=\\frac{' + coefT(z.u) + 'a+' + coefT(z.w) + 'b}{' + z.L + 'x}') + ', so ' + t(coefT(z.u) + 'a+' + coefT(z.w) + 'b=' + z.n) + '. With positive integers: ' + t('a=' + a0) + ', ' + t('b=' + b0) + '.<br>' + t('\\frac{' + z.n + '}{' + z.L + 'x}=\\frac{' + a0 + '}{' + z.p + 'x}+\\frac{' + b0 + '}{' + z.q + 'x}') + '.';
    return { prompt: 'Write ' + t('\\frac{' + z.n + '}{' + z.L + 'x}') + ' in the form ' + t('\\frac{a}{' + z.p + 'x}+\\frac{b}{' + z.q + 'x}') + ', where ' + t('a') + ' and ' + t('b') + ' are positive integers.', input: { type: 'fields', fields: fields }, check: chk, key: [String(a0), String(b0)], answer: t('a=' + a0 + ',\\ b=' + b0), solution: sol,
      hints: ['Add the two fractions over their LCD, keeping ' + t('a') + ' and ' + t('b') + ' as letters.', 'Set the numerator equal to ' + t(z.n) + ' and try positive integers.'], text: 'split a fraction', bad: [[String(b0 + 1), String(a0)]] };
  }

  /* ---------- multiple choice (#14–16, EP B5) ---------- */
  function mcAdd(r) { // p/(a x) + q/(b x)
    var v = 'x', s = pickWhere(function () { return { a: r.int(2, 9), b: r.int(2, 9), p: r.int(1, 7), q: r.int(1, 7) }; }, function (z) { var L = lcm(z.a, z.b); return z.a !== z.b && L < z.a * z.b && z.a % z.b && z.b % z.a && gcd(z.p, z.a) === 1 && gcd(z.q, z.b) === 1 && !(z.a === 4 && z.b === 6 && z.p === 3 && z.q === 1); });
    var L = lcm(s.a, s.b), N = s.p * L / s.a + s.q * L / s.b, ans = ex.norm(N, L);
    var right = '\\frac{' + ans[0] + '}{' + (ans[1] === 1 ? '' : ans[1]) + 'x}';
    var opts = [{ html: t(right), right: true }, { html: t('\\frac{' + (s.p + s.q) + '}{' + (s.a + s.b) + 'x}'), why: 'Adding the numerators and adding the denominators is not how fractions are added.', code: 'straight' },
      { html: t('\\frac{' + ans[0] + '}{' + (ans[1] === 1 ? '' : ans[1]) + 'x^{2}}'), why: 'The LCD of ' + t(s.a + 'x') + ' and ' + t(s.b + 'x') + ' has ' + t('x') + ', not ' + t('x^{2}') + ': the highest power that appears is 1.', code: 'square' },
      { html: t('\\frac{' + (s.p + s.q) + '}{' + L + 'x}'), why: 'Each numerator must be multiplied by the same factor as its denominator.', code: 'nomult' }];
    if (opts.some(function (o, i) { return opts.some(function (o2, j) { return j < i && o2.html === o.html; }); })) return mcAdd(r);
    return mcPart(r, 'For ' + t('x\\ne 0') + ', ' + t('\\frac{' + s.p + '}{' + s.a + 'x}+\\frac{' + s.q + '}{' + s.b + 'x}') + ' is equal to', opts,
      'The LCD is ' + t(L + 'x') + ': ' + t('\\frac{' + (s.p * L / s.a) + '}{' + L + 'x}+\\frac{' + (s.q * L / s.b) + '}{' + L + 'x}=\\frac{' + N + '}{' + L + 'x}' + (ans[1] !== L ? '=' + right : '')) + '.', H_MONO, 'MC: add over an LCD');
  }
  function mcSub(r) { // (a x − b)/(c x) − (x − d)/(c x)
    var s = pickWhere(function () { return { a: r.int(2, 6), b: nz(r, 1, 9), c: r.int(2, 9), d: nz(r, 1, 9) }; }, function (z) { return z.b !== z.d && z.b !== -z.d && gcd(gcd(z.a - 1, z.b + z.d), z.c) === 1 && z.a - 1 !== 0 && !(z.a === 2 && z.b === -3 && z.c === 5 && z.d === -4); });
    var n1 = lin(s.a, s.b), n2 = lin(1, s.d), dT = s.c + 'x';
    var right = tx(P.sub(n1, n2)), noBr = tx(P.add(n1, P.num(s.d), P.mono(-1, { x: 1 }))), addN = tx(P.add(n1, n2));
    var opts = [{ html: t('\\frac{' + right + '}{' + dT + '}'), right: true }, { html: t('\\frac{' + noBr + '}{' + dT + '}'), why: 'The minus sign applies to the <b>whole</b> second numerator: ' + t('-(' + tx(n2) + ')=' + tx(P.neg(n2))) + '.', code: 'nobr' },
      { html: t('\\frac{' + addN + '}{' + dT + '}'), why: 'This is a subtraction: subtract the second numerator.', code: 'add' }, { html: t('\\frac{' + right + '}{' + (2 * s.c) + 'x}'), why: 'The denominators are the same: keep the denominator, do not add (or subtract) it.', code: 'den' }];
    if (opts.some(function (o, i) { return opts.some(function (o2, j) { return j < i && o2.html === o.html; }); })) return mcSub(r);
    return mcPart(r, 'For ' + t('x\\ne 0') + ', ' + t('\\frac{' + tx(n1) + '}{' + dT + '}-\\frac{' + tx(n2) + '}{' + dT + '}') + ' simplifies to', opts,
      t(tx(n1) + '-(' + tx(n2) + ')=' + right) + ', over the same denominator ' + t(dT) + '.', H_SAME, 'MC: subtract over one denominator');
  }
  function mcCross(r) { // u/(m w) + w/(n u)
    var vv = r.pick([['a', 'b'], ['x', 'y'], ['m', 'n']]), u = vv[0], w = vv[1];
    var s = pickWhere(function () { return { m: r.int(2, 7), n: r.int(2, 7) }; }, function (z) { return z.m !== z.n && gcd(z.m, z.n) === 1 && !(z.m === 2 && z.n === 3); });
    var D = s.m * s.n + u + w, uu = u + '^{2}', ww = w + '^{2}';
    var opts = [{ html: t('\\frac{' + s.n + uu + '+' + s.m + ww + '}{' + D + '}'), right: true }, { html: t('\\frac{' + s.m + uu + '+' + s.n + ww + '}{' + D + '}'), why: 'Check the multipliers: ' + t('\\frac{' + u + '}{' + s.m + w + '}') + ' is multiplied by ' + t(s.n + u) + ' to reach the LCD ' + t(D) + '.', code: 'swap' },
      { html: t('\\frac{' + u + '+' + w + '}{' + D + '}'), why: 'Each numerator must be multiplied by what its denominator was multiplied by.', code: 'nomult' }, { html: t('\\frac{' + u + '+' + w + '}{' + s.m + w + '+' + s.n + u + '}'), why: 'You cannot add the denominators: find the LCD.', code: 'straight' }];
    return mcPart(r, 'For ' + t(u + ',\\ ' + w + '\\ne 0') + ', ' + t('\\frac{' + u + '}{' + s.m + w + '}+\\frac{' + w + '}{' + s.n + u + '}') + ' simplifies to', opts,
      'The LCD is ' + t(D) + ': ' + t('\\frac{' + u + '(' + s.n + u + ')}{' + D + '}+\\frac{' + w + '(' + s.m + w + ')}{' + D + '}=\\frac{' + s.n + uu + '+' + s.m + ww + '}{' + D + '}') + '.', H_MONO, 'MC: two-variable LCD');
  }
  function mcNum(r) { // x/a − (x − c)/b  (EP B5)
    var s = pickWhere(function () { return { a: r.int(2, 6), b: r.int(2, 6), c: nz(r, 1, 9) }; }, function (z) { return z.a !== z.b && gcd(z.a, z.b) === 1 && z.b - z.a !== 0 && !(z.a === 3 && z.b === 2 && z.c === 6); });
    var L = s.a * s.b, N = P.sub(P.mono(s.b, { x: 1 }), P.scale(lin(1, -s.c), s.a)), Nn = P.sub(P.mono(s.b, { x: 1 }), P.add(P.mono(s.a, { x: 1 }), P.num(s.c * s.a)));
    var fT = function (p) { var q = P.lead(p)[0] < 0 && P.terms(p).some(function (tm) { return tm.c[0] > 0; }) ? txa(p) : tx(p); return '\\frac{' + q + '}{' + L + '}'; };
    var Nadd = P.add(P.mono(s.b, { x: 1 }), P.scale(lin(1, -s.c), s.a));
    var opts = [{ html: t(fT(N)), right: true }, { html: t(fT(Nn)), why: 'The minus sign applies to the whole numerator ' + t('(x' + sg(-s.c) + ')') + '.', code: 'nobr' }, { html: t(fT(Nadd)), why: 'This is a subtraction.', code: 'add' }];
    var straight = ex.norm(s.c, s.a - s.b), stT = t(rt(straight));
    if (!opts.some(function (o) { return o.html === stT; })) opts.push({ html: stT, why: 'Subtracting the tops and the bottoms is not how fractions are subtracted.', code: 'straight' });
    if (opts.some(function (o, i) { return opts.some(function (o2, j) { return j < i && o2.html === o.html; }); })) return mcNum(r);
    return mcPart(r, 'The expression ' + t('\\frac{x}{' + s.a + '}-\\frac{' + tx(lin(1, -s.c)) + '}{' + s.b + '}') + ' simplifies to', opts,
      'The LCD is ' + t(L) + ': ' + t('\\frac{' + s.b + 'x-' + s.a + '(' + tx(lin(1, -s.c)) + ')}{' + L + '}=' + fT(N)) + '.', H_NUM, 'MC: numerical denominators');
  }

  /* ---------- numerical response (#17, #18, EP B6) ---------- */
  function nrAB(r) { // (x + p)/(a x) + (x + q)/(b x) = (Ax + B)/(L x); A + B
    var s = pickWhere(function () { return { a: r.int(2, 6), b: r.int(2, 6), p: nz(r, 1, 9), q: nz(r, 1, 9), sub: r.chance(0.3) }; }, function (z) {
      var L = lcm(z.a, z.b), u = L / z.a, w = L / z.b, sgn = z.sub ? -1 : 1, Aa = u + sgn * w, Bb = u * z.p + sgn * w * z.q; z.L = L; z.A = Aa; z.B = Bb;
      return z.a !== z.b && Aa !== 0 && Aa + Bb > 0 && Aa + Bb < 100 && !(z.a === 3 && z.b === 4 && z.p === 5 && z.q === -2);
    });
    var u = s.L / s.a, w = s.L / s.b, op = s.sub ? '-' : '+';
    var prompt = 'The expression ' + t('\\frac{' + tx(lin(1, s.p)) + '}{' + s.a + 'x}' + op + '\\frac{' + tx(lin(1, s.q)) + '}{' + s.b + 'x}') + ' can be written as ' + t('\\frac{Ax+B}{' + s.L + 'x}') + '. The value of ' + t('A+B') + ' is ______.';
    var sol = t('\\frac{' + u + '(' + tx(lin(1, s.p)) + ')' + op + w + '(' + tx(lin(1, s.q)) + ')}{' + s.L + 'x}=\\frac{' + tx(lin(s.A, s.B)) + '}{' + s.L + 'x}') + '. ' + t('A=' + s.A) + ', ' + t('B=' + s.B) + ', ' + t('A+B=' + (s.A + s.B)) + '.';
    var p = KP.nr(prompt, s.A + s.B, function (v) { if (v === s.A || v === s.B) return { code: 'value', hint: 'Give ' + t('A+B') + ', the sum of the two numbers.' }; return null; }, sol, ['Multiply each numerator (in brackets) by what its denominator needs to become ' + t(s.L + 'x') + '.', 'Collect like terms: ' + t('A') + ' is the coefficient of ' + t('x') + ' and ' + t('B') + ' the constant.'], 'NR: A + B');
    return p;
  }
  function nrK(r) { // p/(a x) − q/(b x) + s/(c x) = k/(L x)
    var z = pickWhere(function () { return { a: r.int(2, 6), b: r.int(2, 6), c: r.int(2, 6), p: r.int(1, 9), q: r.int(1, 9), s: r.int(1, 9) }; }, function (z) {
      if (z.a === z.b || z.b === z.c || z.a === z.c) return false; var L = lcm(lcm(z.a, z.b), z.c); if (L > 30) return false;
      var k = z.p * L / z.a - z.q * L / z.b + z.s * L / z.c; z.L = L; z.k = k; return k > 0 && k < 1000 && gcd(z.p, z.a) === 1 && gcd(z.q, z.b) === 1 && gcd(z.s, z.c) === 1 && !(z.a === 2 && z.b === 3 && z.c === 4 && z.p === 5);
    });
    var prompt = 'When ' + t('\\frac{' + z.p + '}{' + z.a + 'x}-\\frac{' + z.q + '}{' + z.b + 'x}+\\frac{' + z.s + '}{' + z.c + 'x}') + ' is written as a single expression ' + t('\\frac{k}{' + z.L + 'x}') + ', the value of ' + t('k') + ' is ______.';
    var sol = 'LCD ' + t(z.L + 'x') + ': ' + t('\\frac{' + (z.p * z.L / z.a) + '}{' + z.L + 'x}-\\frac{' + (z.q * z.L / z.b) + '}{' + z.L + 'x}+\\frac{' + (z.s * z.L / z.c) + '}{' + z.L + 'x}=\\frac{' + z.k + '}{' + z.L + 'x}') + ', so ' + t('k=' + z.k) + '.';
    var straight = z.p - z.q + z.s;
    return KP.nr(prompt, z.k, function (v) { if (v === straight) return { code: CP + 'lcd-num', hint: 'Multiply each numerator by the factor its denominator needs to become ' + t(z.L + 'x') + '.' }; return null; }, sol, ['Rewrite each fraction over ' + t(z.L + 'x') + '.', 'Then combine the numerators.'], 'NR: k');
  }
  function nrConst(r) { // (p a + q)/(m a) + (r a + s)/(n a) = constant; nearest hundredth
    var v = 'a', z = pickWhere(function () { return { m: r.int(2, 6), n: r.int(2, 9), p: r.int(1, 5), q: nz(r, 1, 9), rr: r.int(1, 5) }; }, function (z) {
      var L = lcm(z.m, z.n); if (z.m === z.n || L > 36) return false; var u = L / z.m, w = L / z.n; if ((u * z.q) % w) return false; z.s = -u * z.q / w; z.L = L;
      var c = (u * z.p + w * z.rr) / L; z.c = c; return z.s !== 0 && Math.abs(z.s) <= 12 && gcd(gcd(z.p, z.q), z.m) === 1 && gcd(gcd(z.rr, z.s), z.n) === 1 && !nice(c) && Math.abs(c * 100 - Math.round(c * 100)) > 1e-6 && c < 10 && !(z.m === 3 && z.n === 6 && z.p === 2 && z.q === 1);
    });
    var u = z.L / z.m, w = z.L / z.n, Nc = u * z.p + w * z.rr, cq = ex.norm(Nc, z.L);
    var prompt = 'For ' + t('a\\ne 0') + ', ' + t('\\frac{' + tx(lin(z.p, z.q, v)) + '}{' + z.m + 'a}+\\frac{' + tx(lin(z.rr, z.s, v)) + '}{' + z.n + 'a}') + ' simplifies to a constant. To the nearest hundredth, the constant is ______.';
    var sol = t('\\frac{' + coefT(u) + (u === 1 ? '' : '(') + tx(lin(z.p, z.q, v)) + (u === 1 ? '' : ')') + '+' + coefT(w) + (w === 1 ? '' : '(') + tx(lin(z.rr, z.s, v)) + (w === 1 ? '' : ')') + '}{' + z.L + 'a}=\\frac{' + Nc + 'a}{' + z.L + 'a}=' + rt(cq) + '\\approx ' + K.roundTo(z.c, 2).toFixed(2)) + '.';
    var want = K.roundTo(z.c, 2);
    var p = { prompt: prompt, input: { type: 'number', nr: true }, check: K.approx(z.c, 2, { nr: true }), key: want.toFixed(2), answer: t(want.toFixed(2)), solution: sol, hints: ['Combine over the LCD ' + t(z.L + 'a') + '.', 'The constant terms of the numerator cancel, leaving a multiple of ' + t('a') + ' over ' + t(z.L + 'a') + '.'], text: 'NR: the constant' };
    return p;
  }

  /* ---------- error analysis (#8, EP B2) ---------- */
  function errShared(r) {
    var v = pickVar(r);
    var s = pickWhere(function () { return { a: r.int(2, 6), b: nz(r, 1, 9), c: r.int(2, 6), d: r.int(1, 9) }; }, function (z) {
      return z.b !== z.d && z.b - z.d !== 0 && z.b + z.d !== 0 && !(z.a === 3 && z.b === 1 && z.c === 4 && z.d === 5) && !(z.c === 2 && z.a === 1); });
    s.v = v;
    s.terms = [T1(1, [A(s.a, s.b, v)], [Mo(s.c, v, 1)]), T1(-1, [A(1, -s.d, v)], [Mo(s.c, v, 1)])];
    s.bad = [T1(1, [A(s.a, s.b, v)], [Mo(s.c, v, 1)]), T1(-1, [A(1, s.d, v)], [Mo(s.c, v, 1)])];
    s.S = sumAll(s.terms, v); s.SB = sumAll(s.bad, v);
    return s;
  }
  function errWorkTex(s) {
    var n = tx(P.add(lin(s.a - 1, s.b - s.d, s.v))), st = '\\frac{' + n + '}{' + s.c + s.v + '}', k = sumKey(s.SB);
    return t(termsTex(s.terms) + '=' + st + (k !== st ? '=' + k : ''));
  }

  /* ---------- false statements (#9) ---------- */
  function falseA(r) {
    var u = r.pick(['a', 'x', 'm']), w = u === 'a' ? 'b' : u === 'x' ? 'y' : 'n';
    var s = pickWhere(function () { return { c: r.int(1, 4), d: r.int(1, 4), u0: r.int(1, 5), w0: r.int(1, 5) }; }, function (z) { return !(z.c === 1 && z.d === 1 && z.u0 === 2 && z.w0 === 2) && Math.abs(z.c / z.u0 + z.d / z.w0 - (z.c + z.d) / (z.u0 + z.w0)) > 1e-9; });
    var Lq = ex.norm(s.c * s.w0 + s.d * s.u0, s.u0 * s.w0), Rq = ex.norm(s.c + s.d, s.u0 + s.w0);
    var terms = [T1(1, [C(s.c)], [Mo(1, u, 1)]), T1(1, [C(s.d)], [Mo(1, w, 1)])], S = sumAll(terms, u), key = sumKey(S);
    var claim = '\\frac{' + s.c + '}{' + u + '}+\\frac{' + s.d + '}{' + w + '}=\\frac{' + (s.c + s.d) + '}{' + u + '+' + w + '}';
    var TP = cPolys(S.T), wrongT = polyCn(P.num(s.c + s.d), P.add(P.v(u), P.v(w)));
    var c3 = ratCheck(TP, { cp: CP, vars: [u, w], dl: [{ N: P.num(s.c + s.d), D: P.add(P.v(u), P.v(w)), code: CP + 'add-straight', hint: 'That is the false statement. Use the LCD ' + t(u + w) + '.' }] });
    var sol = 'Left: ' + t('\\frac{' + s.c + '}{' + s.u0 + '}+\\frac{' + s.d + '}{' + s.w0 + '}=' + rt(Lq)) + '. Right: ' + t('\\frac{' + (s.c + s.d) + '}{' + (s.u0 + s.w0) + '}' + (Rq[1] !== s.u0 + s.w0 ? '=' + rt(Rq) : '')) + '. Not equal.<br>Correct: the LCD is ' + t(u + w) + ': ' + t('\\frac{' + coefT(s.c) + w + '}{' + u + w + '}+\\frac{' + coefT(s.d) + u + '}{' + u + w + '}=' + key) + ', ' + t(u + '\\ne 0,\\ ' + w + '\\ne 0') + '.';
    var p = boxes('This statement is false: ' + t(claim) + '. Show it is false by substituting ' + t(u + '=' + s.u0) + ' and ' + t(w + '=' + s.w0) + ', then write a correct simplification of the left side.',
      [{ label: 'Left side:', check: K.value(Lq), key: rt(Lq), keys: 'u6knum' }, { label: 'Right side:', check: K.value(Rq), key: rt(Rq), keys: 'u6knum' }, { label: 'Correct:', check: c3, key: key, vars: [u, w] }], sol,
      ['Substitute the values into each side separately.', 'To add, use the LCD ' + t(u + w) + ' and multiply each numerator by the variable its denominator is missing.'], 'false statement: added the denominators');
    p.bad = [[rt(Lq), rt(Rq), cTex(wrongT)], [rt(Rq), rt(Lq), key]];
    return p;
  }
  function falseB(r) {
    var v = 'x', s = pickWhere(function () { return { c: r.int(2, 9), k: r.int(2, 7), x0: r.int(2, 5) }; }, function (z) { return gcd(z.c, z.k) === 1 && !(z.c === 6 && z.k === 3) && !(z.c === 6 && z.x0 === 2); });
    var Lq = ex.norm(s.x0 + s.c, s.k * s.x0), Rq = ex.norm(1 + s.c, s.k);
    var claim = '\\frac{x+' + s.c + '}{' + s.k + 'x}=\\frac{' + (1 + s.c) + '}{' + s.k + '}';
    var sol = 'Left: ' + t('\\frac{' + s.x0 + '+' + s.c + '}{' + s.k + '(' + s.x0 + ')}=' + rt(Lq)) + '. Right: ' + t(rt(Rq)) + '. Not equal.<br>The ' + t('x') + ' in ' + t('x+' + s.c) + ' is a <b>term</b>, not a factor, so it cannot be divided out. ' + t('\\frac{x+' + s.c + '}{' + s.k + 'x}') + ' is already in simplest form, ' + t('x\\ne 0') + '.';
    var p = boxes('This statement is false: ' + t(claim) + '. Show it is false by substituting ' + t('x=' + s.x0) + ' into each side.',
      [{ label: 'Left side:', check: K.value(Lq), key: rt(Lq), keys: 'u6knum' }, { label: 'Right side:', check: K.value(Rq), key: rt(Rq), keys: 'u6knum' }], sol,
      ['Substitute ' + t('x=' + s.x0) + ' into the left side and work it out; the right side has no ' + t('x') + '.', 'If the two values differ, the statement is false: only common <b>factors</b> divide out.'], 'false statement: cancelled a term');
    p.bad = [[rt(Rq), rt(Rq)]];
    return p;
  }

  /* ---------- problems (#10, #11, EP B3, B4) ---------- */
  function rectShared(r) {
    return pickWhere(function () { return { a: r.int(1, 9), b: r.int(2, 6), c: r.int(1, 9), d: r.int(2, 6), x0: r.pick([0.2, 0.25, 0.4, 0.75, 1.5, 0.3, 0.6]) }; }, function (z) {
      return z.b !== z.d && gcd(z.a, z.b) === 1 && gcd(z.c, z.d) === 1 && z.a / z.b > z.c / z.d && !(z.a === 5 && z.b === 2 && z.c === 2 && z.d === 3) && Math.abs(z.x0 - 0.25) > 1e-9 || false; });
  }
  function rectPerim(s) {
    var v = 'x', terms = [T1(1, [C(s.a)], [Mo(s.b, v, 1)]), T1(1, [C(s.c)], [Mo(s.d, v, 1)])], S = sumAll(terms, v), Pc = cMul(S.T, 2);
    return { terms: terms, S: S, Pc: Pc };
  }
  function tripShared(r, kind) {
    return pickWhere(function () { return { d1: r.int(5, 40), k: r.int(2, 5), d2: r.int(3, 20), s0: r.pick([20, 25, 30, 35, 40, 45, 50, 60]), first: kind || (r.chance(0.5) ? 'fast' : 'slow') }; }, function (z) {
      return gcd(z.d1, z.k) === 1 && !(z.d1 === 25 && z.k === 3 && z.d2 === 8) && !(z.d1 === 9 && z.d2 === 15) && z.d1 + z.k * z.d2 > 0; });
  }

  /* ---------- C1: all pairs (A, B) ---------- */
  function allPairs(r) {
    var z = pickWhere(function () { var pq = r.pick([[2, 3], [3, 4], [2, 5], [3, 5], [4, 3], [5, 2]]); return { p: pq[0], q: pq[1], n: r.int(8, 30) }; }, function (z) {
      var L = lcm(z.p, z.q), u = L / z.p, w = L / z.q, sols = [];
      for (var a = 1; a * u < z.n; a++) { var rem = z.n - a * u; if (rem > 0 && rem % w === 0) sols.push([a, rem / w]); }
      z.L = L; z.u = u; z.w = w; z.sols = sols; return sols.length >= 2 && sols.length <= 4 && gcd(z.n, L) === 1 && !(z.p === 2 && z.q === 3 && z.n === 13);
    });
    var pairsT = z.sols.map(function (pq) { return '(' + pq[0] + ',\\ ' + pq[1] + ')'; }).join(',\\ ');
    var base = K.pairs(z.sols), chk = function (resp) {
      var res = base(resp); if (res.v === 'correct') return res;
      if (res.code === 'pairs-missing') return wrong(CP + 'pairs-one', 'Those pairs work, but there ' + (z.sols.length === 2 ? 'is another one' : 'are more') + ': try every positive integer ' + t('A') + '.');
      return res;
    };
    var sol = t('\\frac{A}{' + z.p + 'x}+\\frac{B}{' + z.q + 'x}=\\frac{' + coefT(z.u) + 'A+' + coefT(z.w) + 'B}{' + z.L + 'x}') + ', so ' + t(coefT(z.u) + 'A+' + coefT(z.w) + 'B=' + z.n) + '.<br>Positive integers: ' + z.sols.map(function (pq) { return t('A=' + pq[0] + ',\\ B=' + pq[1]); }).join('; ') + '.';
    var p = KP.math('Determine all pairs of positive integers ' + t('A') + ' and ' + t('B') + ' for which ' + t('\\frac{A}{' + z.p + 'x}+\\frac{B}{' + z.q + 'x}=\\frac{' + z.n + '}{' + z.L + 'x}') + '. Write each pair as ' + t('(A,\\ B)') + '.', chk, pairsT, sol,
      ['Add the left side over the LCD ' + t(z.L + 'x') + ' and set the numerators equal.', 'Try ' + t('A=1,2,3,\\dots') + ' and keep each one that makes ' + t('B') + ' a positive integer.'], 'all integer pairs', { keys: 'pairs', placeholder: 'e.g. (1, 5), (3, 2)' });
    p.bad = ['(' + z.sols[0][0] + ', ' + z.sols[0][1] + ')'];
    return p;
  }

  /* ---------- C2: a complex fraction in two variables ---------- */
  function complexShared(r) {
    var vv = r.pick([['x', 'y'], ['a', 'b'], ['m', 'n']]);
    var k = pickWhere(function () { return r.int(1, 4); }, function () { return true; });
    return { u: vv[0], w: vv[1], k: k };
  }

  /* ---------- C3: unit fractions ---------- */
  var TRIPLES = [[2, 3, 6, 1], [4, 6, 12, 2], [4, 5, 20, 2], [6, 10, 15, 3], [6, 9, 18, 3], [4, 8, 8, 2], [2, 4, 4, 1], [12, 20, 30, 6], [3, 6, 6, 3], [6, 12, 12, 3]];
  TRIPLES = TRIPLES.filter(function (q) { return Math.abs(1 / q[0] + 1 / q[1] + 1 / q[2] - 1 / q[3]) < 1e-12; });

  /* ======================================================================================================
   * The questions
   * ====================================================================================================== */
  var AVOID1 = ['5/6+3/8', '7/10-4/15', '4/9-7/6', '3/4+1/6', '5/8-1/12', '1/6-7/9'];
  var QUESTIONS = [
    { num: '1', parts: [
      { id: '1a', level: 'BEG', make: function (r) { return numFrac(r, 2, { signs: [1, 1], avoid: AVOID1 }); } },
      { id: '1b', level: 'BEG', make: function (r) { return numFrac(r, 2, { signs: [1, -1], neg: false, avoid: AVOID1 }); } },
      { id: '1c', level: 'EMG', make: function (r) { return numFrac(r, 3, { dens: [2, 3, 4, 5, 6, 8, 10, 12] }); } },
      { id: '1d', level: 'BEG', make: function (r) { return numFrac(r, 2, { signs: [1, -1], neg: true, avoid: AVOID1 }); } }] },
    { num: '2', parts: [
      { id: '2a', level: 'BEG', make: function (r) { return numDen(r, { signs: [1, 1], coef: [1], text: 'numerical denominators: add' }); } },
      { id: '2b', level: 'EMG', make: function (r) { return numDen(r, { signs: [1, -1], coef: [1, 2, 3], text: 'numerical denominators: subtract' }); } },
      { id: '2c', level: 'PRG', make: function (r) { return numDen(r, { signs: [1, -1], coef: [1, 2, 3, 4], factor: true, text: 'numerical denominators: the numerator factors' }); } },
      { id: '2d', level: 'PRG', make: function (r) { return numDen(r, { k: 3, signs: [1, -1, 1], coef: [1, 1, 2], bare: [true, false, false], dens: [2, 3, 4, 6, 8, 12], text: 'numerical denominators: three terms' }); } }] },
    { num: '3', parts: [
      { id: '3a', level: 'BEG', make: function (r) { return same(r, 'mono'); } },
      { id: '3b', level: 'EMG', make: function (r) { return same(r, 'monobin'); } },
      { id: '3c', level: 'EMG', make: function (r) { return same(r, 'const'); } },
      { id: '3d', level: 'PRG', make: function (r) { return same(r, 'tri'); } },
      { id: '3e', level: 'PRG', make: function (r) { return same(r, 'square'); } },
      { id: '3f', level: 'PRG', make: function (r) { return same(r, 'gcf'); } }] },
    { num: '4', parts: [
      { id: '4a', level: 'BEG', make: function (r) { return lcdPart(r, 'same'); } },
      { id: '4b', level: 'BEG', make: function (r) { return lcdPart(r, 'pow'); } },
      { id: '4c', level: 'EMG', make: function (r) { return lcdPart(r, 'two'); } },
      { id: '4d', level: 'EMG', make: function (r) { return lcdPart(r, 'three'); } }] },
    { num: '5', parts: [
      { id: '5a', level: 'BEG', make: function (r) { return monoNum(r, 'a'); } },
      { id: '5b', level: 'BEG', make: function (r) { return monoNum(r, 'b'); } },
      { id: '5c', level: 'EMG', make: function (r) { return monoNum(r, 'c'); } },
      { id: '5d', level: 'EMG', make: function (r) { return monoNum(r, 'd'); } },
      { id: '5e', level: 'PRG', make: function (r) { return monoNum(r, 'e'); } },
      { id: '5f', level: 'PRG', make: function (r) { return monoNum(r, 'f'); } },
      { id: '5g', level: 'PRG', make: function (r) { return monoNum(r, 'g'); } },
      { id: '5h', level: 'PRG', make: function (r) { return monoNum(r, 'zero'); } }] },
    { num: '6', parts: [
      { id: '6a', level: 'PRG', make: function (r) { return monoBin(r, 'a'); } },
      { id: '6b', level: 'PRG', make: function (r) { return monoBin(r, 'b'); } },
      { id: '6c', level: 'PRG', make: function (r) { return monoBin(r, 'c'); } },
      { id: '6d', level: 'ADV', make: function (r) { return monoBin(r, 'd'); } },
      { id: '6e', level: 'ADV', make: function (r) { return monoBin(r, 'e'); } },
      { id: '6f', level: 'PRG', make: function (r) { return monoBin(r, 'f'); } }] },
    { num: '7', parts: [
      { id: '7a', level: 'BEG', make: function (r) { return whole(r, 'a'); } },
      { id: '7b', level: 'BEG', make: function (r) { return whole(r, 'b'); } },
      { id: '7c', level: 'PRG', make: function (r) { return whole(r, 'c'); } },
      { id: '7d', level: 'PRG', make: function (r) { return whole(r, 'three'); } }] },
    { num: '8', shared: errShared, stem: function (s) { return 'A student’s work is shown: ' + errWorkTex(s) + '.'; }, parts: [
      { id: '8a', level: 'EMG', make: function (r, s) {
        var opts = [{ html: 'The minus sign was not applied to the ' + t(String(-s.d)) + ': ' + t('-(' + tx(lin(1, -s.d, s.v)) + ')=' + tx(lin(-1, s.d, s.v))) + '.', right: true },
          { html: 'The denominators should have been subtracted as well.', why: 'The denominators are the same, so the denominator stays ' + t(s.c + s.v) + '.', code: 'den' },
          { html: 'The LCD should be ' + t(s.c * s.c + s.v + '^{2}') + '.', why: 'The denominators are already the same: ' + t(s.c + s.v) + ' is the LCD.', code: 'lcd' },
          { html: 'The ' + t(s.v) + ' in the numerator should have been divided out with the ' + t(s.v) + ' in the denominator.', why: 'Only common <b>factors</b> divide out, and ' + t(s.v) + ' is a term of the numerator, not a factor.', code: 'terms' }];
        return mcPart(r, 'What is the error?', opts, t(tx(lin(s.a, s.b, s.v)) + '-(' + tx(lin(1, -s.d, s.v)) + ')=' + tx(lin(s.a, s.b, s.v)) + '-' + s.v + '+' + s.d + '=' + tx(lin(s.a - 1, s.b + s.d, s.v))) + ': the student wrote ' + t(tx(lin(s.a - 1, s.b - s.d, s.v))) + '.', ['Check the subtraction of the second numerator, term by term.'], 'find the error: subtraction');
      } },
      { id: '8b', level: 'PRG', make: function (r, s) {
        return sumPart(CP, 'Give the correct simplification and state the non-permissible value.', s.terms, s.v, { noTerms: true }, ['Put the second numerator in brackets: ' + t('-(' + tx(lin(1, -s.d, s.v)) + ')') + ' changes both signs.', 'Then factor the numerator and reduce if you can.'], 'find the error: the correct answer');
      } },
      { id: '8c', level: 'EMG', make: function (r, s) {
        var env = {}; env[s.v] = 1; var qv = ex.norm(s.a + s.b - (1 - s.d), s.c), wv = cValAt(s.SB.T, env);
        return valPart('Confirm the correct answer: substitute ' + t(s.v + '=1') + ' into the <b>original</b> expression. What value do you get?', qv, function (x) { if (Math.abs(x - wv) < 1e-9) return { code: CP + 'test-value', hint: 'That is the value of the student’s answer. Substitute into the original expression: ' + t('\\frac{' + (s.a + s.b) + '}{' + s.c + '}-\\frac{' + (1 - s.d) + '}{' + s.c + '}') + '.' }; return null; },
          'Original at ' + t(s.v + '=1') + ': ' + t('\\frac{' + (s.a + s.b) + '}{' + s.c + '}-\\frac{' + (1 - s.d) + '}{' + s.c + '}=' + rt(qv)) + '. The correct answer ' + t(sumKey(s.S)) + ' gives the same value; the student’s answer gives ' + t(rt(ex.norm(Math.round(wv * 3600), 3600))) + '.',
          ['Replace every ' + t(s.v) + ' in the question with ' + t(1) + '.'], 'check by substituting');
      } }] },
    { num: '9', parts: [
      { id: '9a', level: 'EMG', make: function (r) { return falseA(r); } },
      { id: '9b', level: 'EMG', make: function (r) { return falseB(r); } }] },
    { num: '10', shared: rectShared, stem: function (s) { return 'A rectangle has length ' + t('\\frac{' + s.a + '}{' + s.b + 'x}') + ' m and width ' + t('\\frac{' + s.c + '}{' + s.d + 'x}') + ' m, where ' + t('x>0') + '.'; }, parts: [
      { id: '10a', level: 'PRG', make: function (r, s) {
        var o = rectPerim(s), key = cTex(o.Pc), half = cTex(o.S.T);
        var sol = t('P=2\\left(\\frac{' + s.a + '}{' + s.b + 'x}+\\frac{' + s.c + '}{' + s.d + 'x}\\right)=2\\left(' + o.S.mid + '\\right)=' + key) + ' m.';
        var p = ratPart(CP, 'Write the perimeter as a single expression in simplest form.', o.Pc, { vars: ['x'], after: 'm', dl: [{ cn: o.S.T, code: CP + 'perim', hint: 'That is the length plus the width. The perimeter is ' + t('2(l+w)') + '.' }] }, sol, ['Perimeter ' + t('=2(l+w)') + '. Add the length and width over the LCD first.', 'Then multiply by ' + t(2) + ' and reduce.'], 'perimeter as one expression');
        p.bad = [half]; return p;
      } },
      { id: '10b', level: 'EMG', make: function (r, s) {
        var o = rectPerim(s), env = { x: s.x0 }, val = cValAt(o.Pc, env), q = cPolys(o.Pc);
        return KP.approx('Determine the perimeter when ' + t('x=' + s.x0) + ', to the nearest hundredth of a metre.', val, 2, { after: 'm', diag: function (x) { if (Math.abs(x - val / 2) < 0.006) return { code: CP + 'perim', hint: 'That is half the perimeter: use ' + t('2(l+w)') + '.' }; return null; } },
          t('P=' + cTex(o.Pc)) + '; at ' + t('x=' + s.x0) + ': ' + t('\\frac{' + F(P.at(q.N, env)) + '}{' + F(Math.round(P.at(q.D, env) * 1e6) / 1e6) + '}\\approx ' + K.roundTo(val, 2).toFixed(2)) + ' m.', ['Substitute into your simplified perimeter (or into each fraction and add, then double).'], 'evaluate the perimeter');
      } }] },
    { num: '11', shared: function (r) { return tripShared(r, 'fast'); }, stem: function (s) { return 'A delivery driver travels ' + t(s.d1) + ' km on a highway at an average speed of ' + t(s.k + 's') + ' km/h, then ' + t(s.d2) + ' km in town at ' + t('s') + ' km/h.'; }, parts: [
      { id: '11a', level: 'PRG', make: function (r, s) {
        var terms = [T1(1, [C(s.d1)], [Mo(s.k, 's', 1)]), T1(1, [C(s.d2)], [Mo(1, 's', 1)])];
        return sumRatPart(CP, 'Write the total driving time (time ' + t('=\\frac{\\text{distance}}{\\text{speed}}') + ') as a single rational expression in simplest form.', terms, 's', { noTerms: true, after: 'h', solPre: 'Time ' + t('=\\frac{' + s.d1 + '}{' + s.k + 's}+\\frac{' + s.d2 + '}{s}') + '. ', solPost: '<br>The time is in hours (' + t('s>0') + ': a speed is positive).' }, ['Each time is distance ÷ speed. Add the two times.', 'The LCD is ' + t(s.k + 's') + '.'], 'total time as one expression');
      } },
      { id: '11b', level: 'EMG', make: function (r, s) {
        var h = s.d1 / (s.k * s.s0) + s.d2 / s.s0, m = h * 60;
        return KP.approx('Determine the total time, to the nearest minute, when ' + t('s=' + s.s0) + '.', m, 0, { after: 'min', diag: function (x) { if (Math.abs(x - h) < 0.6) return { code: CP + 'unit-min', hint: 'That is in hours. Multiply by ' + t(60) + ' to get minutes.' }; return null; } },
          t('\\frac{' + (s.d1 + s.k * s.d2) + '}{' + s.k + '(' + s.s0 + ')}=\\frac{' + (s.d1 + s.k * s.d2) + '}{' + (s.k * s.s0) + '}\\approx ' + K.roundTo(h, 4)) + ' h; ' + t(K.roundTo(h, 4) + '\\times 60\\approx ' + K.roundTo(m, 0)) + ' min.', ['Substitute into your expression to get hours, then multiply by ' + t(60) + '.'], 'evaluate the time in minutes');
      } }] },
    { num: '12', parts: [{ id: '12', level: 'MAS', make: function (r) { return addK(r); } }] },
    { num: '13', parts: [{ id: '13', level: 'MAS', make: function (r) { return splitPart(r); } }] },
    { num: '14', parts: [{ id: '14', level: 'EMG', make: function (r) { return mcAdd(r); } }] },
    { num: '15', parts: [{ id: '15', level: 'EMG', make: function (r) { return mcSub(r); } }] },
    { num: '16', parts: [{ id: '16', level: 'PRG', make: function (r) { return mcCross(r); } }] },
    { num: '17', parts: [{ id: '17', level: 'PRG', make: function (r) { return nrAB(r); } }] },
    { num: '18', parts: [{ id: '18', level: 'PRG', make: function (r) { return nrK(r); } }] }
  ];

  var EXTRA = [
    { num: 'A1', section: 'A. Skills', parts: [
      { id: 'A1a', level: 'BEG', make: function (r) { return numFrac(r, 2, { signs: [1, 1], avoid: ['7/12+5/18'].concat(AVOID1) }); } },
      { id: 'A1b', level: 'BEG', make: function (r) { return numFrac(r, 2, { signs: [1, -1], neg: true, avoid: ['3/10-5/6'].concat(AVOID1) }); } },
      { id: 'A1c', level: 'EMG', make: function (r) { return numDen(r, { signs: [1, 1], coef: [1, 2], text: 'numerical denominators: add' }); } },
      { id: 'A1d', level: 'EMG', make: function (r) { return numDen(r, { signs: [1, -1], coef: [1, 2, 3, 5], text: 'numerical denominators: subtract' }); } }] },
    { num: 'A2', parts: [
      { id: 'A2a', level: 'BEG', make: function (r) { return same(r, 'mono'); } },
      { id: 'A2b', level: 'EMG', make: function (r) { return same(r, 'const'); } },
      { id: 'A2c', level: 'PRG', make: function (r) { return same(r, 'dos'); } }] },
    { num: 'A3', parts: [
      { id: 'A3a', level: 'BEG', make: function (r) { return monoNum(r, 'a'); } },
      { id: 'A3b', level: 'EMG', make: function (r) { return monoNum(r, 'c'); } },
      { id: 'A3c', level: 'PRG', make: function (r) { return monoNum(r, 'g'); } },
      { id: 'A3d', level: 'PRG', make: function (r) { return monoBin(r, 'a'); } },
      { id: 'A3e', level: 'PRG', make: function (r) { return monoBin(r, 'c'); } },
      { id: 'A3f', level: 'EMG', make: function (r) { return whole(r, 'quad'); } }] },
    { num: 'A4', parts: [
      { id: 'A4a', level: 'EMG', make: function (r) { return lcdPart(r, 'two2'); } },
      { id: 'A4b', level: 'EMG', make: function (r) { return lcdPart(r, 'const'); } },
      { id: 'A4c', level: 'PRG', make: function (r) { return lcdPart(r, 'three2'); } }] },
    { num: 'B1', section: 'B. Applying', parts: [
      { id: 'B1', level: 'PRG', make: function (r) {
        var vv = r.pick([['a', 'b'], ['x', 'y'], ['m', 'n']]), u = vv[0], w = vv[1], s = pickWhere(function () { return { p: r.int(1, 5), q: r.int(1, 5) }; }, function (z) { return !(z.p === 1 && z.q === 1) || r.chance(0.2); });
        var n1 = P.add(P.mono(s.p, mon(u, 1)), P.mono(s.q, mon(w, 1)));
        var terms = [T1(1, [Q(n1)], [Mo(1, u, 1, w, 1)]), T1(-1, [C(s.p)], [Mo(1, w, 1)])];
        return sumPart(CP, 'Simplify. State the non-permissible values.', terms, u, { vars: [u, w] }, ['The LCD is ' + t(u + w) + ': multiply the second fraction’s numerator and denominator by ' + t(u) + '.', 'Combine the numerators; one term cancels, then divide out the common factor.'], 'a difference that simplifies to one term');
      } }] },
    { num: 'B2', parts: [
      { id: 'B2', level: 'EMG', make: function (r) {
        var v = pickVar(r), s = pickWhere(function () { return { p: r.int(1, 9), c: r.int(2, 6), q: r.int(1, 9) }; }, function (z) { return z.p !== z.q && gcd(gcd(z.p - z.q, 1), z.c) === 1 && !(z.p === 4 && z.c === 3 && z.q === 2); });
        var terms = [T1(1, [C(s.p)], [Mo(s.c, v, 1)]), T1(-1, [A(1, s.q, v)], [Mo(s.c, v, 1)])], wrongN = '\\frac{' + (s.p + s.q) + '-' + v + '}{' + s.c + v + '}';
        return sumPart(CP, 'Sam simplified ' + t(termsTex(terms)) + ' as ' + t(wrongN) + '. Give the correct answer and state the non-permissible value.', terms, v, { noTerms: true, solPre: 'Sam did not apply the minus sign to the ' + t('+' + s.q) + ': ' + t(s.p + '-(' + v + '+' + s.q + ')=' + s.p + '-' + v + '-' + s.q) + '.<br>' }, ['The minus sign in front of the second fraction applies to its whole numerator: use brackets.'], 'find the error: subtraction');
      } }] },
    { num: 'B3', parts: [
      { id: 'B3', level: 'PRG', make: function (r) {
        var s = pickWhere(function () { var L = r.pick([6, 12, 10, 15, 20]), dv = []; for (var d = 2; d < L; d++) if (L % d === 0) dv.push(d); return { L: L, d1: r.pick(dv), d2: r.pick(dv), n1: r.int(1, 9), n2: r.int(1, 9), n3: r.int(1, 9) }; }, function (z) {
          return z.d1 !== z.d2 && lcm(z.d1, z.d2) === z.L && gcd(z.n1, z.d1) === 1 && gcd(z.n2, z.d2) === 1 && gcd(z.n3, z.L) === 1 && !(z.L === 6 && z.n1 === 3 && z.n2 === 5 && z.n3 === 7); });
        var terms = [T1(1, [C(s.n1)], [Mo(s.d1, 'x', 1)]), T1(1, [C(s.n2)], [Mo(s.d2, 'x', 1)]), T1(1, [C(s.n3)], [Mo(s.L, 'x', 1)])];
        return sumRatPart(CP, 'A triangle has sides ' + t(fracE(terms[0].nf, terms[0].df)) + ', ' + t(fracE(terms[1].nf, terms[1].df)) + ' and ' + t(fracE(terms[2].nf, terms[2].df)) + ' cm, where ' + t('x>0') + '. Write its perimeter in simplest form.', terms, 'x', { noTerms: true, after: 'cm', solPost: ' The perimeter is in centimetres.' }, ['Add the three sides over the LCD ' + t(s.L + 'x') + '.', 'Reduce the result.'], 'perimeter of a triangle');
      } }] },
    { num: 'B4', shared: function (r) { return tripShared(r, 'slow'); }, stem: function (s) { return 'An athlete swims ' + t(Math.max(1, s.d1 % 6 + 1)) + ' km at ' + t('s') + ' km/h and then runs ' + t(s.d2) + ' km at ' + t(s.k + 's') + ' km/h.'; }, parts: [
      { id: 'B4a', level: 'PRG', make: function (r, s) {
        var d1 = Math.max(1, s.d1 % 6 + 1), terms = [T1(1, [C(d1)], [Mo(1, 's', 1)]), T1(1, [C(s.d2)], [Mo(s.k, 's', 1)])];
        return sumRatPart(CP, 'Write the total time as a single rational expression in simplest form.', terms, 's', { noTerms: true, after: 'h', solPre: 'Time ' + t('=\\frac{' + d1 + '}{s}+\\frac{' + s.d2 + '}{' + s.k + 's}') + '. ', solPost: '<br>The time is in hours (' + t('s>0') + ': a speed is positive).' }, ['Each time is distance ÷ speed. The LCD is ' + t(s.k + 's') + '.'], 'total time as one expression');
      } },
      { id: 'B4b', level: 'EMG', make: function (r, s) {
        var d1 = Math.max(1, s.d1 % 6 + 1), s0 = r.pick([2, 3, 4, 5, 6, 8, 10]), h = d1 / s0 + s.d2 / (s.k * s0);
        return KP.approx('Determine the total time when ' + t('s=' + s0) + ', to the nearest hundredth of an hour.', h, 2, { after: 'h' },
          t('\\frac{' + d1 + '}{' + s0 + '}+\\frac{' + s.d2 + '}{' + (s.k * s0) + '}\\approx ' + K.roundTo(h, 2).toFixed(2)) + ' h.', ['Substitute into your expression (or into each time) and add.'], 'evaluate the time');
      } }] },
    { num: 'B5', parts: [{ id: 'B5', level: 'EMG', make: function (r) { return mcNum(r); } }] },
    { num: 'B6', parts: [{ id: 'B6', level: 'PRG', make: function (r) { return nrConst(r); } }] },
    { num: 'C1', section: 'C. Stretch', parts: [{ id: 'C1', level: 'MAS', make: function (r) { return allPairs(r); } }] },
    { num: 'C2', shared: complexShared, stem: function (s) { var kk = s.k === 1 ? '' : String(s.k * s.k); return 'Consider ' + t('\\dfrac{\\dfrac{' + s.u + '}{' + s.w + '}-\\dfrac{' + kk + s.w + '}{' + s.u + '}}{\\dfrac{1}{' + s.w + '}+\\dfrac{' + (s.k === 1 ? '1' : s.k) + '}{' + s.u + '}}') + '.'; }, parts: [
      { id: 'C2a', level: 'MAS', make: function (r, s) {
        var u = s.u, w = s.w, k = s.k;
        var Tq = P.add(P.v(u), P.mono(-k, mon(w, 1))), Tc = canon([[Q(Tq)]]);
        var kk = k === 1 ? '' : String(k * k), kw = k === 1 ? w : k + w;
        var sol = 'Numerator: ' + t('\\frac{' + u + '^{2}-' + kk + w + '^{2}}{' + u + w + '}') + '. Denominator: ' + t('\\frac{' + u + '+' + kw + '}{' + u + w + '}') + '.<br>' + t('\\frac{(' + u + '-' + kw + ')(' + u + '+' + kw + ')}{' + u + w + '}\\times\\frac{' + u + w + '}{' + u + '+' + kw + '}=' + u + '-' + kw) + '.';
        return ratPart(CP, 'Simplify the complex fraction.', Tc, { vars: [u, w] }, sol, ['Write the top and the bottom each as a single fraction over ' + t(u + w) + '.', 'Dividing is multiplying by the reciprocal; factor the difference of squares.'], 'complex fraction in two variables');
      } },
      { id: 'C2b', level: 'ADV', make: function (r, s) {
        var u = s.u, w = s.w, k = s.k, kw = k === 1 ? w : k + w;
        var opts = [{ html: t(u + '\\ne 0,\\ ' + w + '\\ne 0,\\ ' + u + '\\ne -' + kw), right: true }, { html: t(u + '\\ne 0,\\ ' + w + '\\ne 0'), why: 'The divisor cannot be ' + t(0) + ' either: ' + t('\\frac{1}{' + w + '}+\\frac{' + (k === 1 ? 1 : k) + '}{' + u + '}=\\frac{' + u + '+' + kw + '}{' + u + w + '}') + ' is ' + t(0) + ' when ' + t(u + '=-' + kw) + '.', code: 'nodiv' },
          { html: t(u + '\\ne 0,\\ ' + w + '\\ne 0,\\ ' + u + '\\ne ' + kw), why: 'Check the sign: the divisor is ' + t(0) + ' when ' + t(u + '+' + kw + '=0') + '.', code: 'sign' }, { html: t(u + '\\ne -' + kw), why: 'Each small denominator, ' + t(u) + ' and ' + t(w) + ', cannot be ' + t(0) + ' either.', code: 'one' }];
        return mcPart(r, 'Which are all the restrictions on the variables?', opts, 'The small denominators: ' + t(u + '\\ne 0') + ', ' + t(w + '\\ne 0') + '. The divisor ' + t('\\frac{' + u + '+' + kw + '}{' + u + w + '}') + ' cannot be ' + t(0) + ': ' + t(u + '\\ne -' + kw) + '.', ['Every denominator, and the whole divisor, must not be ' + t(0) + '.'], 'restrictions of a complex fraction');
      } }] },
    { num: 'C3', shared: function (r) { var q = r.pick(TRIPLES), x0 = pickWhere(function () { return r.int(2, 9); }, function (x) { return !(q[3] === 1 && x === 5); }); return { a: q[0], b: q[1], c: q[2], m: q[3], x0: x0 }; },
      parts: [
      { id: 'C3a', level: 'ADV', make: function (r, s) {
        var terms = [T1(1, [C(1)], [Mo(s.a, 'x', 1)]), T1(1, [C(1)], [Mo(s.b, 'x', 1)]), T1(1, [C(1)], [Mo(s.c, 'x', 1)])];
        return sumRatPart(CP, 'Simplify ' + t(termsTex(terms)) + ', for ' + t('x\\ne 0') + '.', terms, 'x', { noTerms: true }, ['Use the LCD ' + t(lcm(lcm(s.a, s.b), s.c) + 'x') + '.', 'The numerator is a number: reduce.'], 'three unit fractions');
      } },
      { id: 'C3b', level: 'MAS', make: function (r, s) {
        var n = s.m * s.x0, D = [s.a * s.x0, s.b * s.x0, s.c * s.x0];
        var chk = function (resp) {
          var vals = []; for (var i = 0; i < 3; i++) { var a = K.read(resp[i]); if (a.res) return a.res; vals.push(a.val); }
          if (vals.some(function (x) { return !(x > 0) || !nice(x); })) return wrong('value', 'Each denominator must be a positive whole number.');
          if (Math.abs(1 / vals[0] + 1 / vals[1] + 1 / vals[2] - 1 / n) < 1e-12) return ok();
          return wrong('value', 'Check: ' + t('\\frac{1}{' + F(vals[0]) + '}+\\frac{1}{' + F(vals[1]) + '}+\\frac{1}{' + F(vals[2]) + '}') + ' is not ' + t('\\frac{1}{' + n + '}') + '. Substitute a value of ' + t('x') + ' into part (a).');
        };
        var fields = [0, 1, 2].map(function (i) { return { label: t('\\frac{1}{\\square}') + ' denominator ' + (i + 1) + ':', name: 'Denominator ' + (i + 1), mode: 'math', keys: 'u6knum' }; });
        var sol = 'From part (a), ' + t('\\frac{1}{' + s.a + 'x}+\\frac{1}{' + s.b + 'x}+\\frac{1}{' + s.c + 'x}=\\frac{1}{' + (s.m === 1 ? '' : s.m) + 'x}') + '. Let ' + t('x=' + s.x0) + ': ' + t('\\frac{1}{' + n + '}=\\frac{1}{' + D[0] + '}+\\frac{1}{' + D[1] + '}+\\frac{1}{' + D[2] + '}') + '.';
        return { prompt: 'Use part (a) to write ' + t('\\frac{1}{' + n + '}') + ' as the sum of three fractions that each have numerator ' + t(1) + '. Give the three denominators.', input: { type: 'fields', fields: fields }, check: chk, key: D.map(String), answer: t('\\frac{1}{' + n + '}=\\frac{1}{' + D[0] + '}+\\frac{1}{' + D[1] + '}+\\frac{1}{' + D[2] + '}'), solution: sol,
          hints: ['Which value of ' + t('x') + ' makes ' + t('\\frac{1}{' + (s.m === 1 ? '' : s.m) + 'x}') + ' equal to ' + t('\\frac{1}{' + n + '}') + '?', 'Substitute it into the three fractions of part (a).'], text: 'unit fractions from an identity', bad: [[String(n), String(n), String(n)]] };
      } }] }
  ];

  HW.defineLesson({ id: LID, unit: 6, num: '5', title: 'Adding and Subtracting with Monomial Denominators', outcome: 'AN5', calc: true, questions: QUESTIONS, extra: EXTRA });
})(window);
