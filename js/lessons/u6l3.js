/* Math 20-1 · Unit 6 · Lesson 3 — Multiplying Rational Expressions (outcome AN5 on every part)
 * Assignment 3 (m201book unit6/u6_l03.tex, Questions 1–14) and the Lesson 3 Extra Practice (u6_ep03.tex, Questions 1–12).
 * Every part is a generator: the booklet question's idea, form and difficulty with new numbers (the lesson's example
 * numbers and the booklet question's own numbers are left out). Calculator allowed (calc: true); answers stay exact.
 *
 * Answers are typed. "Simplify. State the NPVs." is one part with two boxes (Simplified, NPVs). A simplified expression is
 * checked by value at six points away from the NPVs, then for form: one fraction, lowest terms (no common factor left),
 * integer coefficients; numerator and denominator may be factored or expanded, the sign may sit anywhere. NPVs:
 * "x ≠ 3, −2" (or "3, −2"; ± allowed). Two variables: restrictions such as "x ≠ −y, x ≠ 3y" (solved for either letter).
 * Recognised mistakes (u6l3- codes): NPVs from the simplified expression only (a divided-out factor's NPV missing), a
 * numerator's zero as an NPV, signs of NPVs, the −1 of opposite factors lost, terms divided out instead of factors,
 * monomial powers on the wrong side, the polynomial in the box (only one of its factors), wrong letter.
 * Conversions: Q8(a) "show that" → write and simplify the area (the target is not shown); Q8(b) and Q9 "identify the
 * error / explain" → multiple choice + the corrected answer typed; Q8(c) and EP C11(b) exact values → a radical box;
 * EP C12 (Jordan) → two multiple-choice parts (is he right; how the graphs differ).
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: Q8(c), Q10, EP C10, EP C11(b).
 *
 * The first part of this file is the Lessons 3–4 kit HW.u6k34 (rational expressions as products of atoms, the
 * value-and-form checker, NPVs and two-variable restrictions, the operation builder); js/lessons/u6l4.js uses it, so this
 * file loads first. Nothing here depends on other Unit 6 files. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, KP = K.P, P = HW.poly, ex = HW.ex, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  if (!P) throw new Error('js/lessons/u6l3.js needs js/poly.js');

  /* ==================================================================================================================
   * HW.u6k34 — the Unit 6 Lessons 3–4 kit
   * ================================================================================================================== */
  if (!HW.u6k34) HW.u6k34 = (function () {
    var gcd = function (a, b) { return ex.gcd(Math.abs(a), Math.abs(b)); };
    function pickWhere(gen, test, tag) { for (var i = 0; i < 20000; i++) { var o = gen(); if (o && test(o)) return o; } throw new Error((tag || 'u6k34') + ': no instance found'); }
    function nz(r, lo, hi) { return (r.chance(0.5) ? -1 : 1) * r.int(lo, hi); }
    function M(c, v, e) { if (!e) return P.num(c); var o = {}; o[v] = e; return P.mono(c, o); }
    function lin(a, b, v) { return P.add(M(a, v || 'x', 1), P.num(b)); }
    function tx(p) { return P.tex(p); }
    function txa(p) { return P.tex(p, { order: 'asc' }); }
    function R(x) { return Array.isArray(x) ? ex.norm(x[0], x[1]) : [x, 1]; }
    function rv(x) { x = R(x); return x[0] / x[1]; }
    function rt(x) { return ex.texRat(R(x)); }
    function qm(a, b) { return ex.norm(a[0] * b[0], a[1] * b[1]); }
    function qd(a, b) { return ex.norm(a[0] * b[1], a[1] * b[0]); }
    function has(arr, x) { return arr.some(function (y) { return Math.abs(rv(y) - rv(x)) < 1e-9; }); }
    function uniqR(a) { var out = []; a.forEach(function (x) { if (!has(out, x)) out.push(R(x)); }); return out.sort(function (p, q) { return rv(p) - rv(q); }); }
    function vlist(arr) { return arr.filter(function (v, i) { return arr.indexOf(v) === i; }).sort(); }
    function pickVar(r) { return r.pick(['x', 'x', 'x', 'a', 'm', 'y', 't', 'n', 'p']); }
    /* n distinct non-zero integers in [−hi, hi] (no two opposite unless allowed by test) */
    function monics(r, n, hi, test) { return pickWhere(function () { var a = []; for (var i = 0; i < n; i++) a.push(nz(r, 1, hi)); return a; }, function (a) { return a.every(function (x, i) { return a.indexOf(x) === i; }) && (!test || test(a)); }); }
    function noOpp(a) { return a.every(function (x) { return a.indexOf(-x) < 0; }); }

    /* ---------- format codes (no partial credit: they don't use a try) ---------- */
    HW.addCodes({ 'u6k-single': 'Not written as a single fraction (format)', 'u6k-lowest': 'Not in lowest terms: a common factor left (format)',
      'u6k-reduce': 'Numbers in the fraction not reduced (format)', 'u6k-tidy': 'Numerator or denominator not simplified (format)',
      'u6k-decimal': 'Decimal coefficients instead of exact ones (format)', 'u6k-npvletter': 'NPVs written for the wrong letter (format)',
      'u6k-rad': 'Exact value: radical or fraction not in simplest form (format)', 'u6k-exact': 'Gave a decimal instead of the exact value (format)' });
    /* lesson codes: one list, registered for each lesson prefix with partial-credit decisions (s keeps 2/3, b keeps 1/3, n none) */
    var BASE = {
      'npv-cancel': ['NPVs taken from the simplified expression (a divided-out factor’s NPV missing)', 's'],
      'npv-div': ['Division: left out the NPVs from the divisor’s numerator', 's'],
      'npv-flip': ['Division: left out the NPVs of the divisor’s denominator (after flipping)', 's'],
      'npv-bracket': ['Left out the values that make a bracketed divisor 0', 's'],
      'npv-num': ['Used a numerator’s zero as an NPV', 'b'], 'npv-missing': ['Missed an NPV', 's'], 'npv-extra': ['Listed a value that is not an NPV', 's'],
      'npv-sign': ['NPVs with the wrong signs', 'b'], 'npv-wrong': ['Right expression, NPVs wrong or missing', 'b'], 'npv-one': ['Only the NPVs of one denominator', 'b'],
      'npv-mc': ['NPVs: chose a list with a value missing or extra', 'n'],
      'mono-exp': ['Monomials: a power on the wrong side of the fraction', 'b'], 'mono-coef': ['Monomials: coefficients not divided correctly', 's'],
      'opp-sign': ['Opposite factors: lost the −1', 'b'], 'terms': ['Divided out terms instead of factors', 'n'], 'wrong-factor': ['Divided out a factor that is not common', 'n'],
      'div-noflip': ['Division: multiplied by the divisor instead of its reciprocal', 'n'], 'div-flipfirst': ['Division: flipped the first fraction instead of the divisor', 'n'],
      'mix-group': ['Mixed × and ÷: grouped the last two (not left to right)', 'b'], 'frac-noflip': ['Fractions: divided without flipping the divisor', 'n'],
      'box-one': ['Missing polynomial: only one of the factors needed', 'b'], 'box-inv': ['Missing expression: upside down', 'b'], 'box-mul': ['Missing expression: multiplied instead of divided', 'n'],
      'k-part': ['Whole-number answer: only one of the factors that multiply to it', 'b'], 'nr-ab': ['Gave A × B instead of A + B (or the reverse)', 's'],
      'ev-orig': ['Evaluated, but at the wrong value or with a slip', 's'], 'why-mc': ['Explanation: chose a reason that is not right', 'n'], 'step-mc': ['Error analysis: picked the wrong step', 'n'],
      'restr-sign': ['Restrictions with the wrong signs', 'b'], 'ratio-inv': ['Ratio upside down', 'b'], 'area-half': ['Triangle area: left out the ½', 's'], 'rad-slip': ['Exact value: substitution or rationalizing slip', 's']
    };
    var registered = {};
    function codes(cp) {
      if (registered[cp]) return; registered[cp] = 1;
      var c = {}, part = {};
      Object.keys(BASE).forEach(function (k) { c[cp + k] = BASE[k][0]; if (BASE[k][1]) part[cp + k] = BASE[k][1]; });
      HW.addCodes(c); HW.addPartial(part);
    }

    /* ---------- rational expressions as products of atoms ----------
       C(c) a constant · Mo(c, 'x', e) or Mo(c, {a: 2, b: 1}) a monomial · A(a, b, v) the binomial a·v + b ·
       L2(a, b, v, w) the two-variable binomial a·v + b·w (v first) · Qp(p) any other polynomial factor */
    function C(c) { return { k: 'c', c: R(c) }; }
    function Mo(c, m, e) { if (typeof m === 'string') { var o = {}; o[m] = e == null ? 1 : e; m = o; } return { k: 'm', c: R(c), m: m || {} }; }
    function A(a, b, v) { return { k: 'l', a: a, b: b, v: v || 'x' }; }
    function L2(a, b, v, w) { return { k: 'l2', a: a, b: b, v: v, w: w }; }
    function Qp(p) { return { k: 'p', p: p }; }
    function atomPoly(at) {
      if (at.k === 'c') return P.num(at.c);
      if (at.k === 'm') return P.mono(at.c, at.m);
      if (at.k === 'l') return lin(at.a, at.b, at.v);
      if (at.k === 'l2') return P.add(M(at.a, at.v, 1), M(at.b, at.w, 1));
      return at.p;
    }
    function listPoly(list) { return list.reduce(function (acc, at) { return P.mul(acc, atomPoly(at)); }, P.num(1)); }
    function blank() { return { c: [1, 1], m: {}, f: {}, q: {} }; }
    function put(acc, list, s) {
      list.forEach(function (at) {
        if (at.k === 'c') { acc.c = s > 0 ? qm(acc.c, at.c) : qd(acc.c, at.c); return; }
        if (at.k === 'm') { acc.c = s > 0 ? qm(acc.c, at.c) : qd(acc.c, at.c); Object.keys(at.m).forEach(function (v) { if (at.m[v]) acc.m[v] = (acc.m[v] || 0) + s * at.m[v]; }); return; }
        if (at.k === 'l') {
          if (at.b === 0) { acc.c = s > 0 ? qm(acc.c, [at.a, 1]) : qd(acc.c, [at.a, 1]); acc.m[at.v] = (acc.m[at.v] || 0) + s; return; }
          var g = gcd(at.a, at.b) * (at.a < 0 ? -1 : 1), a = at.a / g, b = at.b / g, key = at.v + ':' + a + ':' + b;
          acc.c = s > 0 ? qm(acc.c, [g, 1]) : qd(acc.c, [g, 1]);
          if (!acc.f[key]) acc.f[key] = { a: a, b: b, v: at.v, n: 0 };
          acc.f[key].n += s; return;
        }
        if (at.k === 'l2') {
          var g2 = gcd(at.a, at.b) * (at.a < 0 ? -1 : 1), pp = P.add(M(at.a / g2, at.v, 1), M(at.b / g2, at.w, 1)), k2 = 'L2:' + tx(pp);
          acc.c = s > 0 ? qm(acc.c, [g2, 1]) : qd(acc.c, [g2, 1]);
          if (!acc.q[k2]) acc.q[k2] = { p: pp, n: 0 }; acc.q[k2].n += s; return;
        }
        var kq = 'P:' + tx(at.p); if (!acc.q[kq]) acc.q[kq] = { p: at.p, n: 0 }; acc.q[kq].n += s;
      });
      return acc;
    }
    function canon(nums, dens) { var acc = blank(); (nums || []).forEach(function (l) { put(acc, l, 1); }); (dens || []).forEach(function (l) { put(acc, l, -1); }); return acc; }
    function facPoly(f) { return lin(f.a, f.b, f.v); }
    function fkeys(cn) { return Object.keys(cn.f).sort(function (x, y) { var a = cn.f[x], b = cn.f[y]; return a.v < b.v ? -1 : a.v > b.v ? 1 : (a.a - b.a) || (b.b - a.b); }); }
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
    function cTex(cn) {
      var neg = cn.c[0] < 0, n = side(cn, 1), d = side(cn, -1);
      if (trivial(d)) return neg ? (bare(n) ? '-(' + sideTex(n) + ')' : '-' + sideTex(n)) : sideTex(n);
      return (neg ? '-' : '') + '\\frac{' + sideTex(n) + '}{' + sideTex(d) + '}';
    }
    function cPolys(cn) { var N = sidePoly(side(cn, 1)), D = sidePoly(side(cn, -1)); if (cn.c[0] < 0) N = P.neg(N); return { N: N, D: D }; }
    function cNeg(cn) { var o = JSON.parse(JSON.stringify(cn)); o.c = [-o.c[0], o.c[1]]; return o; }
    function cSame(a, b) { var A1 = cPolys(a), B1 = cPolys(b); return P.eq(P.mul(A1.N, B1.D), P.mul(B1.N, A1.D)); }
    function cAt(cn, env) { var q = cPolys(cn); return P.at(q.N, env) / P.at(q.D, env); }
    /* a list written factored for a solution: −3(m − 4), x(x + 4), (x − 6)(x + 6) */
    function facTex(list) { var cn = canon([list]), sd = side(cn, 1), st = sideTex(sd); if (cn.c[0] >= 0) return st; return bare(sd) ? '-(' + st + ')' : '-' + st; }
    function fracF(nl, dl) { return dl && dl.length ? '\\frac{' + facTex(nl) + '}{' + facTex(dl) + '}' : facTex(nl); }
    /* a list written as the problem shows it: expanded, descending (asc: ascending, for 12 − 3m) */
    function polyT(list, asc) { var p = listPoly(list); return asc ? txa(p) : tx(p); }
    function fracE(nl, dl, o) { o = o || {}; if (!dl || !dl.length) return o.paren ? '(' + polyT(nl, o.an) + ')' : polyT(nl, o.an); return '\\frac{' + polyT(nl, o.an) + '}{' + polyT(dl, o.ad) + '}'; }
    function wrapM(s) { return /[+-]/.test(s.replace(/^-/, '').replace(/\([^()]*\)/g, '')) ? '(' + s + ')' : s; }
    function polyAbsMax(list) { return P.terms(listPoly(list)).reduce(function (m, tm) { return Math.max(m, Math.abs(tm.c[0]) * (tm.c[1] === 1 ? 1 : 1000)); }, 0); }
    function sig(list) { return polyT(list).replace(/[{}\s]/g, '').replace(/[a-z]/g, 'x'); }

    /* ---------- NPVs (one letter): { v: [values] } ---------- */
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
    function npvCount(o) { return Object.keys(o).reduce(function (s, v) { return s + o[v].length; }, 0); }

    /* ---------- checking a rational expression: value at six points, then form ---------- */
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
      single: 'Right value — now write it as a <b>single fraction</b>.',
      lowest: 'Right value, but it is not in lowest terms: the numerator and the denominator still share a factor. Factor both fully and divide out the common factors.',
      reduce: 'Right value — now reduce: the numbers in the numerator and the denominator share a common factor.',
      tidy: 'Right value — now simplify the numerator and the denominator (factored or expanded is fine).',
      decimal: 'That has decimals. Give the exact expression with integers, not decimals.'
    };
    function ratForm(ast, T) {
      if (ex.shape(ast).decimals) return form('u6k-decimal', RH.decimal);
      var top = ast; while (top.t === 'paren' || top.t === 'neg') top = top.a;
      if (!hasVarDiv(ast)) { if (P.degree(T.D) > 0) return form('u6k-single', RH.single); return polyOK(top) ? null : form('u6k-tidy', RH.tidy); }
      var fz = ex.factors(top), all = fz.num.concat(fz.den);
      for (var i = 0; i < all.length; i++) { if (hasDiv(all[i]) && hasVarDiv(all[i])) return form('u6k-single', RH.single); if ((all[i].t === 'add' || all[i].t === 'sub') && hasVarDiv(all[i])) return form('u6k-single', RH.single); }
      for (var j = 0; j < all.length; j++) if (!polyOK(all[j])) return form(hasVarDiv(all[j]) ? 'u6k-single' : 'u6k-tidy', hasVarDiv(all[j]) ? RH.single : RH.tidy);
      var Nw = P.num(1), Dw = P.num(1);
      try { fz.num.forEach(function (x) { Nw = P.mul(Nw, P.read(x).p); }); fz.den.forEach(function (x) { Dw = P.mul(Dw, P.read(x).p); }); } catch (e) { return form('u6k-tidy', RH.tidy); }
      if (P.degree(Dw) > P.degree(T.D)) return form('u6k-lowest', RH.lowest);
      var cN = content(Nw), cD = content(Dw);
      if (cN < 0 || cD < 0) return form('u6k-tidy', 'Right value — now clear the fractions inside the numerator and the denominator, so it is one fraction with integer coefficients.');
      if (cN > 0 && gcd(cN, cD) > 1) return form('u6k-reduce', RH.reduce);
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
        if (same(sv, tv.map(function (x) { return 1 / x; }))) return wrong(opt.cp ? opt.cp + 'div-flipfirst' : 'flip', 'Your answer is upside down. Check which expression you flipped: only the divisor (the one right after ' + t('\\div') + ') is flipped.');
        return wrong('value', null);
      };
    }

    /* ---------- NPVs: "x ≠ 3, -2", "3, -2", "x ≠ ±4", "m ≠ 0, n ≠ 0", "none" ---------- */
    function prep(resp) { return String(resp == null ? '' : resp).replace(/\\(left|right)/g, '').replace(/\\(text|mathrm|textrm|operatorname)\{([^{}]*)\}/g, ' $2 ').replace(/\\[ ,;:!]|~|\\quad|\\qquad/g, ' '); }
    function isNoneStr(s) { return /^\s*(none|no(ne)?\s*(npvs?|restrictions?|non-?\s*permissible\s*values?|values?)?|nonpvs|\\emptyset|\\varnothing|∅)\s*\.?\s*$/i.test(s.replace(/\s+/g, ' ').trim()) || /^none$/i.test(s.replace(/[\s.]/g, '')); }
    function neSplit(s) { return s.replace(/\\neq?(?![a-z])|≠|!=|=\/=|<>/g, '≠').replace(/\b(and|or)\b/gi, ',').replace(/;/g, ',').replace(/\\pm|±/g, '±').split(','); }
    function npvParse(resp, dv) {
      var s = prep(resp);
      if (/^\s*$/.test(s)) return { empty: true };
      if (isNoneStr(s)) return { map: {} };
      var pieces = neSplit(s), map = {}, cur = dv, any = false;
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
      function eqMap(A1, B1) { var ks = vlist(Object.keys(A1).concat(Object.keys(B1))); return ks.every(function (v) { var x = A1[v] || [], y = B1[v] || []; return x.every(function (z) { return has(y, z); }) && y.every(function (z) { return has(x, z); }); }); }
      return function (resp) {
        var L = npvParse(resp, dv);
        if (L.empty) return form('empty', 'State the non-permissible values (or write “none”).');
        if (L.unsimp) return form('simplify', 'Write each NPV as a single number (no ' + t('\\times') + ', + or − between numbers).');
        if (L.bad) return form('unreadable', 'Write the NPVs like ' + t(dv + '\\ne 3,\\ -2') + ' (or ' + t(dv + '\\ne\\pm 4') + '), or “none” if there are none.');
        var Am = L.map;
        if (eqMap(Am, TT)) return ok();
        var ks = Object.keys(Am);
        if (vs.length === 1 && ks.length === 1 && ks[0] !== vs[0] && eqMap({ x: Am[ks[0]] }, { x: TT[vs[0]] })) return form('u6k-npvletter', 'Right values — but the variable here is ' + t(vs[0]) + '.');
        for (var i = 0; i < wr.length; i++) { var W = {}; Object.keys(wr[i].vals).forEach(function (v) { W[v] = wr[i].vals[v].map(rv); }); if (eqMap(Am, W)) return wrong(wr[i].code, wr[i].hint); }
        if (!vs.length) return wrong(cp + 'npv-extra', 'Check each denominator: a denominator with no variable gives no NPVs.');
        var all = vlist(ks.concat(vs)), miss = 0, extra = 0, negd = true;
        all.forEach(function (v) { var x = Am[v] || [], y = TT[v] || []; y.forEach(function (z) { if (!has(x, z)) miss++; }); x.forEach(function (z) { if (!has(y, z)) extra++; if (!has(y, -z)) negd = false; }); if (x.length !== y.length) negd = false; });
        if (negd && extra) return wrong(cp + 'npv-sign', 'Check the signs: ' + t(dv + '-3=0') + ' gives ' + t(dv + '=3') + ', so the NPV is ' + t(dv + '\\ne 3') + '.');
        if (miss && !extra) return wrong(cp + 'npv-missing', 'You are missing ' + (miss === 1 ? 'an NPV' : miss + ' NPVs') + '. Factor every denominator fully' + (opt.div ? ' (and the numerator of every divisor)' : '') + ': each factor with a variable gives an NPV.');
        if (extra && !miss) return wrong(cp + 'npv-extra', 'You have ' + (extra === 1 ? 'a value that is not an NPV' : 'values that are not NPVs') + '. Only the denominators' + (opt.div ? ' and the divisor’s numerator' : '') + ' matter: a numerator equal to ' + t(0) + ' is allowed.');
        return wrong('value', 'Set each factor of each denominator' + (opt.div ? ' (and of each divisor’s numerator)' : '') + ' equal to ' + t(0) + ' and solve.');
      };
    }

    /* ---------- two-variable restrictions: v ≠ c·w + d (w null: v ≠ d) ---------- */
    function rN(o) { return { v: o.v, w: o.w || null, c: rv(o.c || 0), d: rv(o.d || 0) }; }
    function rSame(a, b) { return a.v === b.v && a.w === b.w && Math.abs(a.c - b.c) < 1e-9 && Math.abs(a.d - b.d) < 1e-9; }
    function rUniq(list) { var out = []; list.forEach(function (x) { if (!out.some(function (y) { return rSame(x, y); })) out.push(x); }); return out; }
    function restrOf(lists) {
      var out = [];
      lists.forEach(function (l) { l.forEach(function (at) {
        if (at.k === 'm') Object.keys(at.m).sort().forEach(function (v) { if (at.m[v] > 0) out.push(rN({ v: v })); });
        if (at.k === 'l') out.push(rN({ v: at.v, d: ex.norm(-at.b, at.a) }));
        if (at.k === 'l2') out.push(rN({ v: at.v, w: at.w, c: ex.norm(-at.b, at.a) }));
      }); });
      return rUniq(out);
    }
    function frNum(x) { var best = null; for (var q = 1; q <= 12; q++) { var p = Math.round(x * q); if (Math.abs(p / q - x) < 1e-9) { best = ex.norm(p, q); break; } } return best || [x, 1]; }
    function wTex(c, w) { var f = frNum(c); if (f[1] === 1) return (f[0] === 1 ? '' : f[0] === -1 ? '-' : String(f[0])) + w; return (f[0] < 0 ? '-' : '') + '\\frac{' + (Math.abs(f[0]) === 1 ? '' : Math.abs(f[0])) + w + '}{' + f[1] + '}'; }
    function rTex1(x) { var rhs = x.w ? wTex(x.c, x.w) + (Math.abs(x.d) > 1e-12 ? (x.d > 0 ? '+' : '-') + rt(frNum(Math.abs(x.d))) : '') : rt(frNum(x.d)); return x.v + '\\ne ' + rhs; }
    function rSort(list) { return list.slice().sort(function (a, b) { return (a.w ? 1 : 0) - (b.w ? 1 : 0) || (a.v < b.v ? -1 : a.v > b.v ? 1 : 0) || (b.c - a.c) || (a.d - b.d); }); }
    function restrTex(list) { return list.length ? rSort(list).map(rTex1).join(',\\ ') : '\\text{none}'; }
    function restrParse(resp, vars) {
      var s = prep(resp);
      if (/^\s*$/.test(s)) return { empty: true };
      if (isNoneStr(s)) return { list: [] };
      var pieces = neSplit(s), out = [], cur = vars[0], any = false;
      for (var i = 0; i < pieces.length; i++) {
        var p = pieces[i].replace(/\s+/g, ''); if (!p) continue;
        var m = /^([a-zA-Z])≠(.*)$/.exec(p);
        if (m) { cur = m[1]; p = m[2]; } else if (p.indexOf('≠') >= 0 || /=/.test(p)) return { bad: true };
        if (!p || vars.indexOf(cur) < 0) return { bad: true };
        var pm = p.charAt(0) === '±'; if (pm) p = p.slice(1);
        var r1 = ex.parse(p); if (!r1.ok) return { bad: true };
        var oth = vars.filter(function (u) { return u !== cur; })[0], used = astVars(r1.ast);
        if (used.some(function (u) { return u !== oth; })) return { bad: true };
        var at = function (z) { var env = {}; env[oth] = z; return ex.value(r1.ast, env); };
        var d = at(0), c = at(1) - d;
        if (!isFinite(d) || !isFinite(c) || Math.abs(at(2) - (2 * c + d)) > 1e-9) return { bad: true };
        (pm ? [1, -1] : [1]).forEach(function (sg) {
          var cc = c * sg, dd = d * sg;
          if (Math.abs(cc) < 1e-12) out.push({ v: cur, w: null, c: 0, d: dd });
          else if (cur === vars[0]) out.push({ v: cur, w: oth, c: cc, d: dd });
          else out.push({ v: oth, w: cur, c: 1 / cc, d: -dd / cc });
        });
        any = true;
      }
      if (!any) return { bad: true };
      return { list: rUniq(out) };
    }
    function restrCheck(T, cp, opt) {
      opt = opt || {};
      var vars = opt.vars, wr = (opt.wrongs || []).filter(function (w) { return !sameSet(w.list, T); });
      function sameSet(a, b) { return a.length === b.length && a.every(function (x) { return b.some(function (y) { return rSame(x, y); }); }); }
      var ex1 = vars[0] + '\\ne 2' + vars[1] + ',\\ ' + vars[0] + '\\ne 0';
      return function (resp) {
        var L = restrParse(resp, vars);
        if (L.empty) return form('empty', 'State the restrictions (or write “none”).');
        if (L.bad) return form('unreadable', 'Write each restriction like ' + t(ex1) + ', separated by commas.');
        var Al = L.list;
        if (sameSet(Al, T)) return ok();
        for (var i = 0; i < wr.length; i++) if (sameSet(Al, wr[i].list)) return wrong(wr[i].code, wr[i].hint);
        var miss = T.filter(function (x) { return !Al.some(function (y) { return rSame(x, y); }); }).length, extra = Al.filter(function (x) { return !T.some(function (y) { return rSame(x, y); }); }).length;
        var negd = Al.length === T.length && Al.every(function (x) { return T.some(function (y) { return x.v === y.v && x.w === y.w && Math.abs(x.c + y.c) < 1e-9 && Math.abs(x.d + y.d) < 1e-9; }); });
        if (negd && extra) return wrong(cp + 'restr-sign', 'Check the signs: ' + t(vars[0] + '-2' + vars[1] + '=0') + ' gives ' + t(vars[0] + '=2' + vars[1]) + ', so the restriction is ' + t(vars[0] + '\\ne 2' + vars[1]) + '.');
        if (miss && !extra) return wrong(cp + 'npv-missing', 'You are missing ' + (miss === 1 ? 'a restriction' : miss + ' restrictions') + '. Factor every denominator' + (opt.div ? ' and the divisor’s numerator' : '') + ' fully: each factor with a variable gives one.');
        if (extra && !miss) return wrong(cp + 'npv-extra', 'You have ' + (extra === 1 ? 'a restriction' : 'restrictions') + ' that do not come from a denominator' + (opt.div ? ' or the divisor’s numerator' : '') + '.');
        return wrong('value', 'Set each factor of each denominator' + (opt.div ? ' (and of the divisor’s numerator)' : '') + ' equal to ' + t(0) + ' and solve for ' + t(vars[0]) + '.');
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
        none: { label: 'none', tex: '\\text{none}', plain: 'none', title: 'There are none' }
      };
      var vk = function (opt, n) { return (opt && opt.vars && opt.vars.length ? opt.vars : ['x']).slice(0, n).map(function (v) { return { label: '<i>' + v + '</i>', tex: v, plain: v }; }); };
      W.KEYSETS.u6krat = function (opt) { return [[d(7), d(8), d(9), KY.plus, KY.minus, KY.del], [d(4), d(5), d(6), KY.sq, KY.pow, KY.clear], [d(1), d(2), d(3), KY.frac, KY.left, KY.right], [d(0), KY.dot, KY.par, KY.comma, KY.ne, KY.enter], vk(opt, 6)]; };
      W.KEYSETS.u6knpv = function (opt) { return [[d(7), d(8), d(9), KY.frac, KY.del], [d(4), d(5), d(6), KY.minus, KY.clear], [d(1), d(2), d(3), KY.pm, KY.left, KY.right], [d(0), KY.comma, KY.ne, KY.none, KY.enter], vk(opt, 3)]; };
      if (W.KEYHELP) {
        W.KEYHELP.u6krat = ['Use the <b>fraction</b> key for a fraction and <b>( )</b> for factors; press <b>▶</b> to step out of a box. NPVs: <b>≠</b> and commas, e.g. x ≠ 3, −2 (two letters: x ≠ 2y, x ≠ 0).', 'Type fractions with <code>/</code> and brackets, e.g. <code>(x+3)/(x(x-2))</code>. NPVs: <code>x != 3, -2</code> (two letters: <code>x != 2y, x != 0</code>).'];
        W.KEYHELP.u6knpv = ['Write the NPVs with <b>≠</b> and commas, e.g. x ≠ 3, −2, or press <b>none</b>.', 'Type e.g. <code>x != 3, -2</code> (or just <code>3, -2</code>), or <code>none</code>.'];
      }
    }

    /* ---------- parts ---------- */
    /* "Simplify. State the NPVs." — two boxes. T: canon of the answer; npv: { v: [vals] } (or o.restr: two-variable list);
       o.dl expression wrongs [{ cn, code, hint }]; o.nw NPV wrongs [{ vals | list, code, hint }] */
    function simpPart(cp, prompt, T, npv, o, sol, hints, text) {
      o = o || {};
      var TP = cPolys(T), two = !!o.restr, vars = vlist(P.vars(TP.N).concat(P.vars(TP.D)).concat(two ? o.restrVars : Object.keys(npv)).concat(o.vars || []));
      var dl = (o.dl || []).filter(function (w) { return w && w.cn && !cSame(w.cn, T); });
      var c1 = ratCheck(TP, { cp: cp, vars: vars, dl: dl.map(function (w) { var q = cPolys(w.cn); return { N: q.N, D: q.D, code: w.code, hint: w.hint }; }) });
      var nw, c2, npvKey;
      if (two) {
        nw = (o.nw || []).filter(function (w) { return w && w.list && !(w.list.length === o.restr.length && w.list.every(function (x) { return o.restr.some(function (y) { return rSame(x, y); }); })); });
        c2 = restrCheck(o.restr, cp, { vars: o.restrVars, wrongs: nw, div: o.div }); npvKey = restrTex(o.restr);
      } else {
        nw = (o.nw || []).filter(function (w) { return w && w.vals && !npvEq(w.vals, npv); });
        c2 = npvCheck(npv, cp, { v: o.v || vars[0], wrongs: nw, div: o.div }); npvKey = npvTex(npv);
      }
      var key = [o.keyTex || cTex(T), npvKey], lab = two ? 'Restrictions' : 'NPVs';
      var check = function (resp) {
        resp = Array.isArray(resp) ? resp : [resp, ''];
        var r1 = c1(resp[0] == null ? '' : resp[0]), r2 = c2(resp[1] == null ? '' : resp[1]);
        if (r1.v === 'correct' && r2.v === 'correct') return ok();
        var h1 = '<b>Simplified:</b> ' + (r1.hint || 'Check the simplifying again.'), h2 = '<b>' + lab + ':</b> ' + (r2.hint || 'Check the ' + lab.toLowerCase() + ' again.');
        if (r1.v === 'wrong' && r2.v === 'wrong') return wrong(r1.code === 'value' ? r2.code : r1.code, h1 + '<br>' + h2);
        if (r1.v === 'wrong') return r2.v === 'correct' ? wrong(r1.code, h1) : wrong(r1.code, h1 + '<br>' + h2);
        if (r2.v === 'wrong') return wrong(r2.code === 'value' ? cp + 'npv-wrong' : r2.code, h2);
        if (r1.v === 'form') return { v: 'form', code: r1.code, hint: h1 };
        if (r2.code === 'empty') return wrong(cp + 'npv-wrong', h2);
        return { v: 'form', code: r2.code, hint: h2 };
      };
      var ph = two ? 'e.g. ' + o.restrVars[0] + ' ≠ 2' + o.restrVars[1] + ', ' + o.restrVars[0] + ' ≠ 0' : 'e.g. ' + (o.v || vars[0]) + ' ≠ 3, −2';
      var p = { prompt: prompt, input: { type: 'fields', fields: [{ label: 'Simplified:', mode: 'math', keys: 'u6krat', vars: vars, name: 'Simplified' }, { label: lab + ':', mode: 'math', keys: 'u6krat', vars: vars, none: true, name: lab, placeholder: ph }] },
        check: check, key: key, answer: t(key[0]) + ', \\(' + key[1] + '\\)', solution: sol, hints: hints || [], text: text };
      var bad = [];
      dl.forEach(function (w) { bad.push([cTex(w.cn), key[1]]); });
      nw.forEach(function (w) { bad.push([key[0], two ? restrTex(w.list) : npvTex(w.vals)]); });
      bad.push([key[0], key[1] === '\\text{none}' ? vars[0] + '\\ne 0' : '\\text{none}']);
      p.bad = bad.filter(function (b, i, arr) { return arr.map(JSON.stringify).indexOf(JSON.stringify(b)) === i && JSON.stringify(b) !== JSON.stringify(key); });
      return p;
    }
    /* one rational-expression box (no NPVs asked) */
    function ratPart(cp, prompt, T, o, sol, hints, text) {
      o = o || {};
      var TP = cPolys(T), vars = vlist(P.vars(TP.N).concat(P.vars(TP.D)).concat(o.vars || []));
      var dl = (o.dl || []).filter(function (w) { return w && w.cn && !cSame(w.cn, T); });
      var p = KP.math(prompt, ratCheck(TP, { cp: cp, vars: vars, dl: dl.map(function (w) { var q = cPolys(w.cn); return { N: q.N, D: q.D, code: w.code, hint: w.hint }; }) }), o.keyTex || cTex(T), sol, hints, text, { keys: 'u6krat', vars: vars, before: o.before, placeholder: o.placeholder || 'e.g. (x+3)/(x(x-2))' });
      p.bad = dl.map(function (w) { return cTex(w.cn); }).filter(function (b, i, arr) { return arr.indexOf(b) === i; });
      return p;
    }
    function npvPart(cp, prompt, npv, o, sol, hints, text) {
      o = o || {};
      var vs = Object.keys(npv), v = o.v || vs[0] || 'x', nw = (o.nw || []).filter(function (w) { return w && !npvEq(w.vals, npv); });
      var p = KP.math(prompt, npvCheck(npv, cp, { v: v, wrongs: nw, div: o.div }), npvTex(npv), sol, hints, text, { keys: 'u6knpv', vars: vlist([v].concat(vs)), placeholder: 'e.g. ' + v + ' ≠ 3, −2  (or: none)' });
      p.bad = nw.map(function (w) { return npvTex(w.vals); }).concat(npvTex(npv) === '\\text{none}' ? [v + '\\ne 0'] : ['\\text{none}']).filter(function (b, i, arr) { return arr.indexOf(b) === i && b !== npvTex(npv); });
      return p;
    }
    /* multiple choice: drops a distractor that renders the same as an earlier option */
    function mcPart(r, prompt, opts, sol, hints, text, keepOrder) {
      var seen = {}, out = [];
      opts.forEach(function (op) { var k = op.html.replace(/\s/g, ''); if (seen[k]) return; seen[k] = 1; out.push(op); });
      return KP.mc(r, prompt, out, sol, hints || [], text, keepOrder);
    }

    /* ---------- exact values (p + s√n)/q ---------- */
    function radNorm(p, s, n, q) { if (q < 0) { p = -p; s = -s; q = -q; } var g = gcd(gcd(p, s), q) || 1; return { p: p / g, s: s / g, n: n, q: q / g }; }
    function radVal(x) { return (x.p + x.s * Math.sqrt(x.n)) / x.q; }
    function radTex(x) {
      var st = (Math.abs(x.s) === 1 ? '' : Math.abs(x.s)) + '\\sqrt{' + x.n + '}', num = x.p === 0 ? (x.s < 0 ? '-' : '') + st : x.p + (x.s < 0 ? '-' : '+') + st;
      return x.q === 1 ? num : '\\frac{' + num + '}{' + x.q + '}';
    }
    /* checker: equal value, no decimals, no radical left in a denominator, radicals in simplest form */
    function exactCheck(x, cp, o) {
      o = o || {};
      var T = radVal(x);
      return function (resp) {
        var a = K.read(resp); if (a.res) return a.res;
        if (astVars(a.ast).length) return form('unreadable', 'Give a number (with ' + t('\\sqrt{\\ }') + '), not an expression with a letter.');
        var s = String(resp), sh = ex.shape(a.ast);
        if (ex.eq(a.val, T, 1e-9)) {
          if (sh.decimals) return form('u6k-exact', 'Right value, but give the <b>exact</b> value with a radical, not a decimal.');
          if (!/sqrt/.test(s)) return form('u6k-exact', 'Give the exact value, with a radical.');
          var m, re = /\\sqrt\{?(\d+)\}?/g; while ((m = re.exec(s))) { var n = Number(m[1]); if (n > 1 && !ex.simplest(n, 2)) return form('u6k-rad', 'Right value — now write the radical in simplest form.'); }
          if (/\\frac\{[^{}]*\}\{[^{}]*sqrt/.test(s) || /\/\s*\(?[^()]*sqrt/.test(s)) return form('u6k-rad', 'Right value — now rationalize the denominator (multiply by the conjugate) so no radical is left in it.');
          return ok();
        }
        if (sh.decimals && Math.abs(a.val - T) < 0.01) return form('u6k-exact', 'That decimal is close, but give the <b>exact</b> value with a radical.');
        var h = o.diag ? o.diag(a.val) : null; if (h) return wrong(h.code, h.hint);
        return wrong('value', 'Substitute into your simplified expression, then rationalize the denominator if a radical is left in it.');
      };
    }
    function exactPart(cp, prompt, x, o, sol, hints, text) {
      o = o || {};
      var p = KP.math(prompt, exactCheck(x, cp, o), radTex(x), sol, hints, text, { keys: 'radical', before: o.before, placeholder: 'e.g. (3-√3)/2' });
      var approx = (Math.round(radVal(x) * 100) / 100).toFixed(2);
      p.bad = [approx];
      return p;
    }

    /* ---------- the operation builder: e1 op e2 op e3 …  (op 'mul' | 'div')
       es: [{ n: atoms, d: atoms, an, ad (ascending), fac (shown factored) }]
       o: { opp: true (an opposite pair), flip: [bools] custom, divN: [atom lists] custom, show: tex custom, complex: true,
            restr: true (two variables: restrictions), vars: [v, w], dl, nw, prompt, hints, text, noNpv: true (one box) } */
    var OPS = { mul: '\\cdot ', div: '\\div ', times: '\\times ' };
    function flipsOf(es, ops, o) { return (o && o.flip) || es.map(function (e, i) { return i > 0 && ops[i - 1] === 'div'; }); }
    function opCanon(es, mask) { var nums = [], dens = []; es.forEach(function (e, i) { if (mask[i]) { nums.push(e.d); dens.push(e.n); } else { nums.push(e.n); dens.push(e.d); } }); return canon(nums, dens); }
    function exprShow(e) {
      if (e.fac) return e.d.length ? fracF(e.n, e.d) : wrapM(facTex(e.n));
      if (!e.d.length) { var p = listPoly(e.n); return P.count(p) > 1 ? '(' + (e.an ? txa(p) : tx(p)) + ')' : tx(p); }
      return '\\frac{' + polyT(e.n, e.an) + '}{' + polyT(e.d, e.ad) + '}';
    }
    function exprFac(e) { return e.d.length ? fracF(e.n, e.d) : wrapM(facTex(e.n)); }
    function exprFlip(e) { return fracF(e.d.length ? e.d : [C(1)], e.n); }
    function showAll(es, ops, o, fn) {
      if (o && o.complex) { var a = fn(es[0]).replace(/^\\frac/, '\\dfrac'), b = fn(es[1]).replace(/^\\frac/, '\\dfrac'); return '\\dfrac{\\;' + a + '\\;}{\\;' + b + '\\;}'; }
      return es.map(function (e, i) { return (i ? OPS[ops[i - 1]] : '') + fn(e); }).join('');
    }
    function opInfo(es, ops, o) {
      o = o || {};
      var mask = flipsOf(es, ops, o), T = opCanon(es, mask), dens = es.map(function (e) { return e.d; });
      var divN = o.divN || es.filter(function (e, i) { return mask[i]; }).map(function (e) { return e.n; });
      return { mask: mask, T: T, dens: dens, divN: divN, npv: npvMerge(npvOf(dens), npvOf(divN)), restr: rUniq(restrOf(dens).concat(restrOf(divN))) };
    }
    function denAtoms(cn) {
      var out = [];
      Object.keys(cn.f).forEach(function (k) { if (cn.f[k].n < 0) out.push(A(cn.f[k].a, cn.f[k].b, cn.f[k].v)); });
      Object.keys(cn.m).forEach(function (x) { if (cn.m[x] < 0) out.push(Mo(1, x, 1)); });
      Object.keys(cn.q).forEach(function (k) { if (cn.q[k].n < 0 && /^L2:/.test(k)) { var p = cn.q[k].p, vs = P.vars(p).sort(); out.push(L2(rv(P.coef(p, (function () { var z = {}; z[vs[0]] = 1; return z; })())), rv(P.coef(p, (function () { var z = {}; z[vs[1]] = 1; return z; })())), vs[0], vs[1])); } });
      return out;
    }
    function opPart(cp, es, ops, o) {
      o = o || {};
      var I = opInfo(es, ops, o), T = I.T, anyDiv = I.mask.some(Boolean), two = !!o.restr, v = o.v;
      var dl = [], nw = [];
      if (o.opp) dl.push({ cn: cNeg(T), code: cp + 'opp-sign', hint: t('(a-b)') + ' and ' + t('(b-a)') + ' are opposites: their quotient is ' + t('-1') + '. Keep the minus sign.' });
      if (anyDiv && !o.flip) {
        dl.push({ cn: opCanon(es, es.map(function () { return false; })), code: cp + 'div-noflip', hint: 'To divide, multiply by the <b>reciprocal</b> of the divisor: flip the expression right after ' + t('\\div') + ', then multiply.' });
        if (ops[0] === 'div') dl.push({ cn: opCanon(es, es.map(function (e, i) { return i === 0 ? true : I.mask[i] && i !== 1; })), code: cp + 'div-flipfirst', hint: 'Keep the first expression as it is; flip only the divisor (the expression right after ' + t('\\div') + ').' });
        if (ops.length === 2 && ops[0] === 'div' && ops[1] === 'mul') dl.push({ cn: opCanon(es, [false, true, true]), code: cp + 'mix-group', hint: 'Work from left to right: only the expression right after ' + t('\\div') + ' is flipped, not the one after ' + t('\\cdot') + '.' });
      }
      (o.dl || []).forEach(function (w) { dl.push(w); });
      if (two) {
        var rD = rUniq(restrOf(I.dens)), rC = restrOf([denAtoms(T)]);
        if (anyDiv && I.divN.length && rD.length !== I.restr.length) nw.push({ list: rD, code: cp + 'npv-div', hint: 'In a division the divisor cannot be ' + t(0) + ': each factor of the divisor’s numerator gives a restriction too.' });
        nw.push({ list: rC, code: cp + 'npv-cancel', hint: 'State the restrictions from every <b>original</b> denominator' + (anyDiv ? ' (and the divisor’s numerator)' : '') + ' before dividing out: a divided-out factor still cannot be ' + t(0) + '.' });
      } else {
        var nD = npvOf(I.dens);
        if (anyDiv && I.divN.length && !npvEq(nD, I.npv)) nw.push({ vals: nD, code: cp + 'npv-div', hint: 'In a division the divisor cannot be ' + t(0) + ' either: the zeros of its numerator are NPVs too (it becomes a denominator when you flip it).' });
        if (anyDiv && !o.flip) {
          var after = npvOf(es.map(function (e, i) { return I.mask[i] ? e.n : e.d; }));
          if (!npvEq(after, I.npv)) nw.push({ vals: after, code: cp + 'npv-flip', hint: 'Find the NPVs <b>before</b> you flip: the divisor’s original denominator cannot be ' + t(0) + ' either, even though it is in a numerator after flipping.' });
        }
        var nC = npvOf([denAtoms(T)]);
        if (!npvEq(nC, I.npv)) nw.push({ vals: nC, code: cp + 'npv-cancel', hint: 'State the NPVs from every <b>original</b> denominator' + (anyDiv ? ' and divisor’s numerator' : '') + ' before dividing out: a divided-out factor still cannot be ' + t(0) + '.' });
      }
      (o.nw || []).forEach(function (w) { nw.push(w); });
      var shown = o.show || showAll(es, ops, o, exprShow), fac = showAll(es, ops, o, exprFac);
      var prompt = (o.prompt || (two ? 'Simplify. State the restrictions on the variables.' : 'Simplify. State the non-permissible values.')) + ' ' + t(shown);
      var key = cTex(T), word = two ? 'Restrictions' : 'NPVs', s = '';
      if (o.sol) s = o.sol(I, key);
      else {
        var factored = es.some(function (e) { return exprShow(e) !== exprFac(e); });
        if (o.complex) s += 'The main fraction bar means divide: ' + t(exprShow(es[0]) + '\\div ' + exprShow(es[1])) + '.<br>';
        if (factored) s += 'Factor: ' + t(o.complex ? exprFac(es[0]) + '\\div ' + exprFac(es[1]) : fac) + '.<br>';
        var tx1 = two ? function (L) { return restrTex(L); } : npvTex;
        if (anyDiv && I.divN.length) {
          var dPart = two ? restrOf(I.dens) : npvOf(I.dens), nPart = two ? restrOf(I.divN) : npvOf(I.divN), nDiv = I.divN.length;
          s += word + ': the denominators give ' + t(tx1(dPart)) + (o.divWhy ? '; ' + o.divWhy(nPart) : '; the ' + (nDiv > 1 ? 'divisors’ numerators give ' : (o.complex ? 'numerator of the bottom fraction gives ' : 'divisor’s numerator gives ')) + t(tx1(nPart))) + '. So ' + t(two ? restrTex(I.restr) : npvTex(I.npv)) + '.<br>';
        } else s += word + ' (every denominator): ' + t(two ? restrTex(I.restr) : npvTex(I.npv)) + '.<br>';
        if (anyDiv) s += 'Multiply by the reciprocal' + (I.mask.filter(Boolean).length > 1 ? ' of each divisor' : ' of the divisor') + ': ' + t(es.map(function (e, i) { return (i ? '\\cdot ' : '') + (I.mask[i] ? exprFlip(e) : exprFac(e)); }).join('')) + '.<br>';
        s += 'Divide out the common factors' + (o.opp ? ' (an opposite pair divides to ' + t('-1') + ')' : '') + ' and multiply: ' + t('=' + key) + '.';
      }
      var hints = o.hints || (anyDiv ? ['Factor everything. ' + word + ': every denominator, and also the numerator of ' + (I.mask.filter(Boolean).length > 1 ? 'each divisor' : 'the divisor') + ' (it becomes a denominator when you flip it).', 'Flip only the expression right after each ' + t('\\div') + ', then divide out common factors and multiply.']
        : ['Factor every numerator and denominator fully' + (o.opp ? ' (write a factor such as ' + t('(3-x)') + ' as ' + t('-(x-3)') + ')' : '') + ', and state the ' + word + ' from every denominator.', 'Divide out factors that appear in any numerator and any denominator, then multiply what is left.']);
      var part;
      if (o.noNpv) part = ratPart(cp, prompt, T, { dl: dl, vars: o.vars }, s, hints, o.text);
      else part = simpPart(cp, prompt, T, I.npv, { dl: dl, nw: nw, vars: o.vars || (v ? [v] : []), v: v, restr: two ? I.restr : null, restrVars: o.vars, div: anyDiv }, s, hints, o.text);
      part.info = I;
      return part;
    }
    /* build, validate, then opPart. o.deg: [numerator degree, denominator degree] of the answer; o.npvs: how many NPVs;
       o.avoid: signatures of the first expression (numerator|denominator, letters as x) to leave out; o.maxc: largest coefficient */
    function gen(r, cp, build, o) {
      o = o || {};
      var s = pickWhere(function () { return build(r); }, function (z) {
        if (!z) return false;
        var I = opInfo(z.es, z.ops, z.o || {}), q = cPolys(I.T);
        if (o.deg && (P.degree(q.N) !== o.deg[0] || P.degree(q.D) !== o.deg[1])) return false;
        if (o.npvs != null && (z.o && z.o.restr ? I.restr.length : npvCount(I.npv)) !== o.npvs) return false;
        var mx = o.maxc || 60;
        if (z.es.some(function (e) { return polyAbsMax(e.n) > mx || (e.d.length && polyAbsMax(e.d) > mx); })) return false;
        if (o.avoid && o.avoid.indexOf(sig(z.es[0].n) + '|' + sig(z.es[0].d)) >= 0) return false;
        if (o.test && !o.test(z, I)) return false;
        return true;
      }, cp + (o.text || ''));
      var p = opPart(cp, s.es, s.ops, Object.assign({}, o, s.o || {}));
      p.z = s;
      return p;
    }

    /* ---------- numeric fractions: a/b op c/d (op mul | div), one fraction may be negative ---------- */
    function fracQ(r, cp, spec) {
      var n = spec.ops.length + 1, hi = spec.hi || (n > 2 ? 25 : 40);
      var s = pickWhere(function () { var f = []; for (var i = 0; i < n; i++) f.push([r.int(2, hi), r.int(2, hi)]); if (spec.intDiv) f[1] = [r.int(2, 12), 1]; return f; }, function (f) {
        if (f.some(function (x) { return gcd(x[0], x[1]) !== 1 || x[0] === x[1]; })) return false;
        var num = 1, den = 1; f.forEach(function (x, i) { var flip = i > 0 && spec.ops[i - 1] === 'div'; num *= flip ? x[1] : x[0]; den *= flip ? x[0] : x[1]; });
        var g = gcd(num, den), p = num / g, q = den / g; if (q === 1 || p > 30 || q > 30 || g < (n > 2 ? 6 : 4)) return false;
        if (spec.ops[0] === 'div' && !spec.intDiv) { var nf = f[0][0] * f[1][0], df = f[0][1] * f[1][1], g2 = gcd(nf, df); if (nf / g2 === p && df / g2 === q) return false; }
        var key = f.map(function (x) { return x.join('/'); }).join(','); return (spec.avoid || []).indexOf(key) < 0;
      }, cp + 'fracQ');
      var neg = spec.neg != null ? spec.neg : -1;
      var num = 1, den = 1; s.forEach(function (x, i) { var flip = i > 0 && spec.ops[i - 1] === 'div'; num *= flip ? x[1] : x[0]; den *= flip ? x[0] : x[1]; });
      var ans = ex.norm(neg >= 0 ? -num : num, den);
      function ft(x, i, flip) { var a = flip ? x[1] : x[0], b = flip ? x[0] : x[1], body = b === 1 ? String(a) : '\\frac{' + a + '}{' + b + '}'; if (i !== neg) return body; return i === 0 ? '-' + body : '\\left(-' + body + '\\right)'; }
      var shown = s.map(function (x, i) { return (i ? OPS[spec.ops[i - 1] === 'div' ? 'div' : 'times'] : '') + ft(x, i, false); }).join('');
      var anyDiv = spec.ops.indexOf('div') >= 0;
      var flipped = s.map(function (x, i) { return (i ? '\\times ' : '') + ft(x, i, i > 0 && spec.ops[i - 1] === 'div'); }).join('');
      var g = gcd(num, den);
      var sol = t(shown + (anyDiv ? '=' + flipped : '')) + (anyDiv ? ' (flip only the divisor' + (spec.ops.filter(function (o2) { return o2 === 'div'; }).length > 1 ? 's' : '') + ')' : '') + '.<br>Divide out common factors (a factor of any numerator with a factor of any denominator): ' + t('\\frac{' + (neg >= 0 ? '-' : '') + num + '}{' + den + '}=' + ex.texRat(ans)) + ' (the common factor is ' + g + ').';
      var noflipN = 1, noflipD = 1; s.forEach(function (x) { noflipN *= x[0]; noflipD *= x[1]; });
      var nf = rv(ex.norm(neg >= 0 ? -noflipN : noflipN, noflipD)), ff = null;
      if (spec.ops[0] === 'div') { var fN = s[0][1] * s[1][0], fD = s[0][0] * s[1][1]; for (var i = 2; i < s.length; i++) { var fl = spec.ops[i - 1] === 'div'; fN *= fl ? s[i][1] : s[i][0]; fD *= fl ? s[i][0] : s[i][1]; } ff = (neg >= 0 ? -1 : 1) * fN / fD; }
      var p = KP.fraction((spec.prompt || (anyDiv ? 'Simplify. Write the answer in lowest terms.' : 'Multiply. Write the answer in lowest terms.')) + ' ' + t(shown), ans, { diag: function (val) {
        if (anyDiv && ex.eq(val, nf)) return { code: cp + 'frac-noflip', hint: 'To divide, multiply by the <b>reciprocal</b> of the divisor: flip it first.' };
        if (ff != null && ex.eq(val, ff)) return { code: cp + 'div-flipfirst', hint: 'Keep the first fraction as it is; flip only the divisor.' };
        return null;
      } }, sol, [anyDiv ? 'Change each ' + t('\\div') + ' to ' + t('\\times') + ' and flip only the fraction right after it.' : 'Multiply the numerators and multiply the denominators.', 'Divide out common factors first (a numerator with any denominator), so the numbers stay small.'], spec.text || 'numeric fractions');
      p.bad = [ex.texRat(ex.norm(-ans[0], ans[1]))].concat(anyDiv && rv(ans) !== nf ? [ex.texRat(ex.norm(Math.round(nf * noflipD), noflipD))] : []);
      return p;
    }

    /* ---------- monomial fractions: n fractions with ops; vs letters; neg index ---------- */
    function monoQ(r, cp, spec) {
      var vs = spec.vs, n = spec.ops.length + 1;
      var s = pickWhere(function () {
        var fs = [];
        for (var i = 0; i < n; i++) {
          var nm = {}, dm = {}; vs.forEach(function (v) { nm[v] = r.chance(0.35) ? 0 : r.int(1, 5); dm[v] = r.chance(0.4) ? 0 : r.int(1, 5); if (nm[v] && dm[v]) { if (r.chance(0.5)) nm[v] = 0; else dm[v] = 0; } });
          fs.push({ nc: r.int(2, n > 2 ? 15 : 36), dc: r.int(2, n > 2 ? 15 : 36), nm: nm, dm: dm });
        }
        if (spec.constNum != null) { var fz = fs[spec.constNum]; vs.forEach(function (v) { fz.nm[v] = 0; }); }
        return fs;
      }, function (fs) {
        if (fs.some(function (f, i) { return !vs.some(function (v) { return f.dm[v] > 0; }) || (i !== spec.constNum && !vs.some(function (v) { return f.nm[v] > 0; })) || f.nc === f.dc || gcd(f.nc, f.dc) > 3; })) return false;
        var numC = 1, denC = 1, net = {}; vs.forEach(function (v) { net[v] = 0; });
        fs.forEach(function (f, i) { var fl = i > 0 && spec.ops[i - 1] === 'div'; numC *= fl ? f.dc : f.nc; denC *= fl ? f.nc : f.dc; vs.forEach(function (v) { net[v] += (fl ? -1 : 1) * (f.nm[v] - f.dm[v]); }); });
        var g = gcd(numC, denC), p = numC / g, q = denC / g;
        if (p > 30 || q > 30 || g < 6) return false;
        if (spec.unit && !(p === 1 && q === 1)) return false;
        if (!vs.every(function (v) { return fs.some(function (f) { return f.nm[v] || f.dm[v]; }); })) return false;
        var both = vs.filter(function (v) { return fs.some(function (f) { return f.nm[v]; }) && fs.some(function (f) { return f.dm[v]; }); });
        if (both.length < Math.min(2, vs.length)) return false;
        var nets = vs.map(function (v) { return net[v]; });
        if (n === 2 && !(nets.some(function (x) { return x < 0; }) && nets.some(function (x) { return x > 0; }))) return false;
        if (nets.some(function (x) { return Math.abs(x) > 6; }) || nets.every(function (x) { return x === 0; })) return false;
        var key = fs.map(function (f) { return f.nc + '/' + f.dc; }).join(','); return (spec.avoid || []).indexOf(key) < 0;
      }, cp + 'monoQ');
      var neg = spec.neg != null ? spec.neg : -1;
      var es = s.map(function (f, i) { return { n: [Mo(i === neg ? -f.nc : f.nc, f.nm)], d: [Mo(f.dc, f.dm)] }; });
      var mask = es.map(function (e, i) { return i > 0 && spec.ops[i - 1] === 'div'; });
      var T = opCanon(es, mask), I = opInfo(es, spec.ops), anyDiv = mask.some(Boolean);
      var top = P.num(1), bot = P.num(1); es.forEach(function (e, i) { top = P.mul(top, listPoly(mask[i] ? e.d : e.n)); bot = P.mul(bot, listPoly(mask[i] ? e.n : e.d)); });
      var flipC = JSON.parse(JSON.stringify(T)); Object.keys(flipC.m).forEach(function (x) { flipC.m[x] = Math.abs(flipC.m[x]); });
      var dl = [{ cn: flipC, code: cp + 'mono-exp', hint: 'Subtract exponents: a larger power in the denominator leaves its extra factors in the <b>denominator</b>.' }];
      if (anyDiv) dl.push({ cn: opCanon(es, es.map(function () { return false; })), code: cp + 'div-noflip', hint: 'To divide, multiply by the <b>reciprocal</b> of the divisor: flip it first.' });
      var nw = [];
      if (anyDiv) { var nd = npvOf(I.dens); if (!npvEq(nd, I.npv)) nw.push({ vals: nd, code: cp + 'npv-div', hint: 'The divisor cannot be ' + t(0) + ': every letter in the divisor’s numerator cannot be ' + t(0) + ' either.' }); }
      var nc = npvOf([denAtoms(T)]); if (!npvEq(nc, I.npv)) nw.push({ vals: nc, code: cp + 'npv-cancel', hint: 'The NPVs come from the <b>original</b> denominators' + (anyDiv ? ' (and the divisor’s numerator)' : '') + ': every letter in them cannot be ' + t(0) + ', even if it is not in your answer.' });
      var shown = es.map(function (e, i) { return (i ? OPS[spec.ops[i - 1]] : '') + '\\frac{' + polyT(e.n) + '}{' + polyT(e.d) + '}'; }).join('');
      var flipped = es.map(function (e, i) { return (i ? '\\cdot ' : '') + '\\frac{' + polyT(mask[i] ? e.d : e.n) + '}{' + polyT(mask[i] ? e.n : e.d) + '}'; }).join('');
      var key = cTex(T);
      var sol = (anyDiv ? 'Flip the divisor: ' + t(flipped) + '.<br>' : '') + 'Multiply the numerators and the denominators: ' + t('\\frac{' + tx(top) + '}{' + tx(bot) + '}=' + key) + ' (divide the coefficients by their GCF and subtract exponents).<br>NPVs: every letter in a denominator' + (anyDiv ? ' or in the divisor’s numerator' : '') + ': ' + t(npvTex(I.npv)) + (vs.some(function (v) { return !I.npv[v]; }) ? ' (' + vs.filter(function (v) { return !I.npv[v]; }).map(function (v) { return t(v); }).join(', ') + ' is never in a denominator, so it has no restriction)' : '') + '.';
      return simpPart(cp, (spec.prompt || 'Simplify. State the non-permissible values.') + ' ' + t(shown), T, I.npv, { dl: dl, nw: nw, vars: vs, div: anyDiv }, sol,
        [(anyDiv ? 'Flip the divisor, then multiply' : 'Multiply the numerators and the denominators') + ' (or divide out common factors first).', 'Every letter in a denominator' + (anyDiv ? ' — or in the divisor’s numerator —' : '') + ' gives an NPV.'], spec.text || 'monomial fractions');
    }

    return {
      gcd: gcd, pickWhere: pickWhere, nz: nz, M: M, lin: lin, tx: tx, txa: txa, R: R, rv: rv, rt: rt, has: has, uniqR: uniqR, vlist: vlist, pickVar: pickVar, monics: monics, noOpp: noOpp,
      codes: codes, C: C, Mo: Mo, A: A, L2: L2, Qp: Qp, atomPoly: atomPoly, listPoly: listPoly, canon: canon, side: side, sideTex: sideTex, cTex: cTex, cPolys: cPolys, cNeg: cNeg, cSame: cSame, cAt: cAt,
      facTex: facTex, fracF: fracF, polyT: polyT, fracE: fracE, wrapM: wrapM, sig: sig, npvOf: npvOf, npvMerge: npvMerge, npvTex: npvTex, npvEq: npvEq, npvCount: npvCount,
      restrOf: restrOf, restrTex: restrTex, ratCheck: ratCheck, npvCheck: npvCheck, simpPart: simpPart, ratPart: ratPart, npvPart: npvPart, mcPart: mcPart,
      radNorm: radNorm, radVal: radVal, radTex: radTex, exactPart: exactPart, opCanon: opCanon, opInfo: opInfo, opPart: opPart, gen: gen, exprShow: exprShow, exprFac: exprFac, OPS: OPS,
      fracQ: fracQ, monoQ: monoQ, denAtoms: denAtoms
    };
  })();

  /* ==================================================================================================================
   * Lesson 3
   * ================================================================================================================== */
  var U = HW.u6k34, CP = 'u6l3-', A = U.A, C = U.C, Mo = U.Mo, L2 = U.L2, nz = U.nz, pickWhere = U.pickWhere, monics = U.monics, noOpp = U.noOpp, gcd = U.gcd, pickVar = U.pickVar;
  var tx = U.tx, rt = U.rt, cTex = U.cTex, canon = U.canon, npvOf = U.npvOf, npvTex = U.npvTex, polyT = U.polyT, fracE = U.fracE, fracF = U.fracF, facTex = U.facTex;
  U.codes(CP);
  function E(n, d, o) { var e = { n: n, d: d || [] }; if (o) Object.keys(o).forEach(function (k) { e[k] = o[k]; }); return e; }
  function mul2(a, b) { return { es: [a, b], ops: ['mul'] }; }
  function mul3(a, b, c) { return { es: [a, b, c], ops: ['mul', 'mul'] }; }
  /* the booklet's own and the lesson examples' first expressions (numerator|denominator, letters as x): left out */
  var AV = ['x+3|4x', '5x-15|x^2+2x', '8x^2|x^2-25', 'x^2-x-12|x^2+5x+6', '2x^2+7x-4|x^2-16', '3x^2-12x|6x^2+x-2', 'x-7|x^2+3x', '9-x^2|x^2+x-6', 'x^2-4|2x+6', 'x^2-9x^2|x^2+xx-2x^2', 'x^2-9|4x',
    '12x-60|x^2+2x', '4x-20|x^2+3x', 'x^2-36|9x', 'x^2-16|1', 'x^2+x-20|x^2-3x-10', 'x^2-49|x^2+4x-21', '2x^2-5x-3|x^2-9', '6x^2+7x-3|3x^2+12x', '3-x|x^2+4x', '12-3x|x^2+2x', '25-x^2|x^2-2x-15',
    'x^2-x-6|4x^2', 'x^2-x^2|3x+3x', 'x^2+xx-6x^2|2x^2-8x^2', 'x^2-x|x+4', '7x+14|x^2-3x', 'x^2+6x+8|x^2-x-6', '3x^2+5x-2|x^2-4', '4-x|x^2+x', 'x^2-x-12|10-5x', 'x^2-25|3x', 'x^2-4x^2|x^2+xx',
    'x^2-25|x^2+2x', 'x+1|x^2-9', '4x^2-36|x^2+2x', 'x^2-x-2|x^2+3x', '2x-6|x^2-x', '5x^2-20|x^2-3x', 'x^2-2x|x^2-1', 'x-1|x+3', 'x+6|x^2-4', 'x+2|x-1'];
  var HFAC = ['Factor every numerator and denominator fully, and state the NPVs from every denominator.', 'Divide out factors that appear in any numerator and any denominator, then multiply what is left.'];
  function mcp(r, prompt, opts, sol, hints, text) { return U.mcPart(r, prompt, opts, sol, hints, text); }
  function ft(cn) { return t(cTex(cn)); }

  var QUESTIONS = [
    { num: '1', parts: [
      { id: 'q1a', level: 'BEG', make: function (r) { return U.fracQ(r, CP, { ops: ['mul'], avoid: ['14/15,25/21', '21/32,24/35', '15/14,21/40'], text: 'multiply fractions' }); } },
      { id: 'q1b', level: 'BEG', make: function (r) { return U.fracQ(r, CP, { ops: ['mul'], neg: 0, avoid: ['10/27,18/25', '9/16,20/27'], text: 'multiply fractions (negative)' }); } }] },
    { num: '2', parts: [
      { id: 'q2a', level: 'BEG', make: function (r) { return U.monoQ(r, CP, { vs: r.pick([['a', 'b', 'c'], ['p', 'q', 'r']]), ops: ['mul'], avoid: ['9/4,10/21'], text: 'multiply monomial fractions' }); } },
      { id: 'q2b', level: 'EMG', make: function (r) { return U.monoQ(r, CP, { vs: r.pick([['x', 'y', 'z'], ['a', 'b', 'c']]), ops: ['mul'], neg: 0, avoid: ['12/35,14/18'], text: 'multiply monomial fractions (negative)' }); } },
      { id: 'q2c', level: 'PRG', make: function (r) { return U.monoQ(r, CP, { vs: r.pick([['m', 'n'], ['x', 'y'], ['a', 'b']]), ops: ['mul', 'mul'], neg: 1, constNum: 2, avoid: ['8/15,5/6,9/4'], text: 'multiply three monomial fractions' }); } }] },
    { num: '3', parts: [
      { id: 'q3a', level: 'BEG', make: function (r) {   // c1(x+p)/(x(x+q)) · x²(x+q)/(c2(x+p)(x+s)), shown factored
        var v = pickVar(r);
        return U.gen(r, CP, function () {
          var z = monics(r, 3, 9, noOpp), c1 = r.int(2, 15), c2 = r.int(2, 15); if (c1 === c2 || gcd(c1, c2) < 2 || c1 % c2 === 0 || c2 % c1 === 0) return null;
          if (c1 === 12 && c2 === 8) return null;
          return mul2(E([C(c1), A(1, z[0], v)], [Mo(1, v, 1), A(1, z[1], v)], { fac: true }), E([Mo(1, v, 2), A(1, z[1], v)], [C(c2), A(1, z[0], v), A(1, z[2], v)], { fac: true }));
        }, { deg: [1, 1], npvs: 4, v: v, text: 'multiply: factored binomials' });
      } },
      { id: 'q3b', level: 'EMG', make: function (r) {   // g1(v+p)/(v(v+q)) · g2(v+q)/(g3(v+p)) → g1g2/(g3 v)
        var v = pickVar(r);
        return U.gen(r, CP, function () {
          var z = monics(r, 2, 9, noOpp), g = [r.int(2, 6), r.int(2, 6), r.int(2, 6)];
          return mul2(E([C(g[0]), A(1, z[0], v)], [Mo(1, v, 1), A(1, z[1], v)]), E([C(g[1]), A(1, z[1], v)], [C(g[2]), A(1, z[0], v)]));
        }, { deg: [0, 1], npvs: 3, v: v, avoid: AV, test: function (z, I) { return Math.abs(I.T.c[0]) > 1 || I.T.c[1] > 1; }, text: 'multiply: common binomial factors' });
      } },
      { id: 'q3c', level: 'EMG', make: function (r) {   // (v²−p²)/(c1 v) · c2 v³/(g(v+p)) → c2 v²(v−p)/(c1 g)
        var v = pickVar(r);
        return U.gen(r, CP, function () {
          var p = r.int(2, 9) * (r.chance(0.5) ? 1 : -1), c1 = r.int(2, 12), c2 = r.int(2, 12), g = r.int(2, 5), k = r.int(2, 3);
          if (gcd(c1 * g, c2) < 2) return null;
          return mul2(E([A(1, -p, v), A(1, p, v)], [Mo(c1, v, 1)]), E([Mo(c2, v, k)], [C(g), A(1, p, v)]));
        }, { npvs: 2, v: v, avoid: AV, test: function (z, I) { return I.T.c[1] > 1 && I.T.c[1] <= 12; }, text: 'multiply: difference of squares and a monomial' });
      } },
      { id: 'q3d', level: 'PRG', make: function (r) {   // (v²−p²)·c v/(v²+pv) → c(v−p)
        var v = pickVar(r);
        return U.gen(r, CP, function () {
          var p = r.int(2, 9) * (r.chance(0.5) ? 1 : -1), c = r.int(2, 9), q = r.chance(0.4) ? -p : p;
          return mul2(E([A(1, -q, v), A(1, q, v)]), E([Mo(c, v, 1)], [Mo(1, v, 1), A(1, p, v)]));
        }, { deg: [1, 0], npvs: 2, v: v, avoid: AV, text: 'multiply: a polynomial times a fraction' });
      } }] },
    { num: '4', parts: [
      { id: 'q4a', level: 'PRG', make: function (r) {   // (f0)(f1)/((f2)(f3)) · (f3)(f4)/((f4)(f0)) → f1/f2
        var v = pickVar(r);
        return U.gen(r, CP, function () { var f = monics(r, 5, 7, noOpp); return mul2(E([A(1, f[0], v), A(1, f[1], v)], [A(1, f[2], v), A(1, f[3], v)]), E([A(1, f[3], v), A(1, f[4], v)], [A(1, f[4], v), A(1, f[0], v)])); },
          { deg: [1, 1], npvs: 4, v: v, avoid: AV, maxc: 50, text: 'multiply: trinomials' });
      } },
      { id: 'q4b', level: 'PRG', make: function (r) {   // (v−p)(v+p)/((v+p)(v−q)) · (v−q)(v+q)/((v−p)(v+s)) → (v+q)/(v+s)
        var v = pickVar(r);
        return U.gen(r, CP, function () { var p = r.int(2, 9), q = r.int(1, 8) * (r.chance(0.5) ? 1 : -1), s = nz(r, 1, 8); if (Math.abs(q) === p || Math.abs(s) === p || Math.abs(s) === Math.abs(q)) return null;
          return mul2(E([A(1, -p, v), A(1, p, v)], [A(1, p, v), A(1, -q, v)]), E([A(1, -q, v), A(1, q, v)], [A(1, -p, v), A(1, s, v)])); },
          { deg: [1, 1], npvs: 4, v: v, avoid: AV, maxc: 50, text: 'multiply: differences of squares and trinomials' });
      } },
      { id: 'q4c', level: 'PRG', make: function (r) {   // (av+b)(v−p)/((v−p)(v+p)) · (v+p)²/((av−b)(av+b)) → (v+p)/(av−b)
        var v = pickVar(r);
        return U.gen(r, CP, function () { var a = r.pick([2, 3, 2, 5]), b = nz(r, 1, 5), p = nz(r, 1, 7); if (gcd(a, b) !== 1) return null;
          return mul2(E([A(a, b, v), A(1, -p, v)], [A(1, -p, v), A(1, p, v)]), E([A(1, p, v), A(1, p, v)], [A(a, -b, v), A(a, b, v)])); },
          { deg: [1, 1], npvs: 4, v: v, avoid: AV, text: 'multiply: trinomials with a ≠ 1' });
      } },
      { id: 'q4d', level: 'ADV', make: function (r) {   // (αv+β)(γv+δ)/(k v(v+p)) · (v+p)(v+q)/((γv−δ)(γv+δ)) → (αv+β)(v+q)/(k v(γv−δ))
        var v = pickVar(r);
        return U.gen(r, CP, function () { var al = r.pick([2, 3, 4]), be = nz(r, 1, 5), ga = r.pick([2, 3]), de = r.pick([1, 3, 5]) * (r.chance(0.5) ? 1 : -1), k = r.pick([2, 3, 4]), p = nz(r, 1, 6), q = nz(r, 1, 6);
          if (gcd(al, be) !== 1 || gcd(ga, de) !== 1 || p === q || al * de === be * ga) return null;
          return mul2(E([A(al, be, v), A(ga, de, v)], [Mo(k, v, 1), A(1, p, v)]), E([A(1, p, v), A(1, q, v)], [A(ga, -de, v), A(ga, de, v)])); },
          { deg: [2, 2], npvs: 4, v: v, avoid: AV, maxc: 40, test: function (z, I) { return I.T.c[1] > 1 || Math.abs(I.T.c[0]) > 1; }, text: 'multiply: two a ≠ 1 trinomials' });
      } }] },
    { num: '5', parts: [
      { id: 'q5a', level: 'PRG', make: function (r) {   // (p−v)/(v²+qv) · (v²−q²)/(c v − cp) → −(v−q)/(c v)
        var v = pickVar(r);
        return U.gen(r, CP, function () { var p = r.int(1, 9), q = r.int(2, 9), c = r.int(2, 5); if (p === q) return null;
          return mul2(E([A(-1, p, v)], [Mo(1, v, 1), A(1, q, v)], { an: true }), E([A(1, -q, v), A(1, q, v)], [C(c), A(1, -p, v)])); },
          { deg: [1, 1], npvs: 3, v: v, avoid: AV, opp: true, text: 'opposite factors' });
      } },
      { id: 'q5b', level: 'PRG', make: function (r) {   // (cp − c v)/(v(v+q)) · (v−q)(v+q)/((v−q)(v−p)) → −c/v
        var v = pickVar(r);
        return U.gen(r, CP, function () { var p = r.int(2, 6), q = nz(r, 1, 6), c = r.int(2, 5); if (Math.abs(q) === p) return null;
          return mul2(E([A(-c, c * p, v)], [Mo(1, v, 1), A(1, q, v)], { an: true }), E([A(1, -q, v), A(1, q, v)], [A(1, -q, v), A(1, -p, v)])); },
          { deg: [0, 1], npvs: 4, v: v, avoid: AV, opp: true, text: 'opposite factors with a common factor' });
      } },
      { id: 'q5c', level: 'ADV', make: function (r) {   // (p²−v²)/((v−p)(v+q)) · v(v+q)/(v(v+p)) → −1
        var v = pickVar(r);
        return U.gen(r, CP, function () { var p = r.int(2, 9), q = nz(r, 1, 7); if (Math.abs(q) === p) return null;
          return mul2(E([A(-1, p, v), A(1, p, v)], [A(1, -p, v), A(1, q, v)], { an: true }), E([Mo(1, v, 1), A(1, q, v)], [Mo(1, v, 1), A(1, p, v)])); },
          { deg: [0, 0], npvs: 4, v: v, avoid: AV, opp: true, text: 'opposite factors: everything divides out' });
      } }] },
    { num: '6', parts: [
      { id: 'q6', level: 'ADV', make: function (r) {   // (v−p)(v+q)/(c1 v²) · c2 v²(v+s)/((v−p)(v+u)) · v(v+u)/((v+s)(v+q)) → c2 v/c1
        var v = pickVar(r);
        return U.gen(r, CP, function () { var f = monics(r, 4, 7, noOpp), c1 = r.pick([2, 3, 4, 6]), c2 = r.int(1, 6); if (c2 % c1 === 0 || gcd(c1, c2) === c1) return null;
          return mul3(E([A(1, -f[0], v), A(1, f[1], v)], [Mo(c1, v, 2)]), E([Mo(c2, v, 2), A(1, f[2], v)], [A(1, -f[0], v), A(1, f[3], v)]), E([Mo(1, v, 1), A(1, f[3], v)], [A(1, f[2], v), A(1, f[1], v)])); },
          { deg: [1, 0], npvs: 5, v: v, avoid: AV, text: 'multiply three expressions' });
      } }] },
    { num: '7', parts: [
      { id: 'q7a', level: 'ADV', make: function (r) {   // (x−ky)(x+ky)/(c1(x+ky)) · c2 x/(x−ky)² → (c2/c1) x/(x−ky)
        var vw = r.pick([['x', 'y'], ['a', 'b'], ['m', 'n'], ['s', 't']]), x = vw[0], y = vw[1];
        return U.gen(r, CP, function () { var k = r.int(1, 4) * (r.chance(0.5) ? 1 : -1), c1 = r.int(2, 6), c2 = r.int(2, 12); if (c2 % c1 === 0 || gcd(c1, c2) < 2) return null;
          return { es: [E([L2(1, -k, x, y), L2(1, k, x, y)], [C(c1), L2(1, k, x, y)]), E([Mo(c2, x, 1)], [L2(1, -k, x, y), L2(1, -k, x, y)])], ops: ['mul'], o: { restr: true, vars: [x, y] } }; },
          { avoid: AV, npvs: 2, text: 'two variables: restrictions' });
      } },
      { id: 'q7b', level: 'ADV', make: function (r) {   // (a+pb)(a−qb)/(c(a−qb)(a+qb)) · c2 a(a+qb)/(a+pb)² → (c2/c) a/(a+pb)
        var vw = r.pick([['a', 'b'], ['x', 'y'], ['m', 'n']]), x = vw[0], y = vw[1];
        return U.gen(r, CP, function () { var p = nz(r, 1, 4), q = r.int(1, 4), c = r.pick([2, 3]), c2 = r.int(2, 8); if (Math.abs(p) === q || c2 % c === 0) return null;
          return { es: [E([L2(1, p, x, y), L2(1, -q, x, y)], [C(c), L2(1, -q, x, y), L2(1, q, x, y)]), E([Mo(c2, x, 1), L2(1, q, x, y)], [L2(1, p, x, y), L2(1, p, x, y)])], ops: ['mul'], o: { restr: true, vars: [x, y] } }; },
          { avoid: AV, npvs: 3, maxc: 40, text: 'two variables: trinomials' });
      } }] },
    { num: '8', shared: function (r) {
        return pickWhere(function () { var h = r.int(1, 3), k2 = r.int(2, 5), m = r.pick([1, 1, 2]), q = r.int(1, 7), n = r.pick([2, 3, 5, 6, 7, 10, 11, 13]); return { h: h, p: 2 * h, k2: k2, k1: 2 * m * k2, m: m, q: q, n: n }; },
          function (z) { return z.n > z.h * z.h && z.n - z.h * z.h <= 12 && z.q !== z.p && !(z.p === 2 && z.q === 3 && z.n === 5) && ex.simplest(z.n, 2); });
      },
      stem: function (o) { return 'A triangle has base ' + t('\\frac{' + tx(U.listPoly([Mo(o.k1, 'x', 1)])) + '}{x^{2}-' + o.p * o.p + '}') + ' m and height ' + t('\\frac{' + tx(U.listPoly([A(1, o.p, 'x'), A(1, o.q, 'x')])) + '}{' + o.k2 + 'x^{2}}') + ' m, where ' + t('x>' + o.p) + '.'; },
      parts: [
        { id: 'q8a', level: 'PRG', make: function (r, o) {
          var T = canon([[C(1)], [Mo(o.k1, 'x', 1)], [A(1, o.p, 'x'), A(1, o.q, 'x')]], [[C(2)], [A(1, -o.p, 'x'), A(1, o.p, 'x')], [Mo(o.k2, 'x', 2)]]);
          var noHalf = canon([[Mo(o.k1, 'x', 1)], [A(1, o.p, 'x'), A(1, o.q, 'x')]], [[A(1, -o.p, 'x'), A(1, o.p, 'x')], [Mo(o.k2, 'x', 2)]]);
          return U.ratPart(CP, 'Write and simplify an expression for the area of the triangle.', T, { dl: [{ cn: noHalf, code: CP + 'area-half', hint: 'The area of a triangle is ' + t('\\frac{1}{2}bh') + ': multiply by ' + t('\\frac{1}{2}') + ' too.' }] },
            t('A=\\frac{1}{2}\\cdot\\frac{' + o.k1 + 'x}{(x-' + o.p + ')(x+' + o.p + ')}\\cdot\\frac{(x+' + o.p + ')(x+' + o.q + ')}{' + o.k2 + 'x^{2}}=\\frac{' + o.k1 + 'x(x+' + o.q + ')}{' + 2 * o.k2 + 'x^{2}(x-' + o.p + ')}=' + cTex(T)) + ' square metres.',
            ['Area of a triangle: ' + t('A=\\frac{1}{2}bh') + '.', 'Factor ' + t('x^{2}-' + o.p * o.p) + ' and the trinomial, then divide out common factors.'], 'triangle area');
        } },
        { id: 'q8b', level: 'EMG', make: function (r, o) {
          return mcp(r, 'Why must ' + t('x') + ' be greater than ' + t(o.p) + ' in this context?', [
            { html: 'For ' + t('0<x<' + o.p) + ' the base is negative (' + t('x^{2}-' + o.p * o.p + '<0') + '), and ' + t('x=' + o.p) + ' is an NPV. Lengths must be positive.', right: true },
            { html: 'At ' + t('x=' + o.p) + ' the height is ' + t(0) + ', and for ' + t('x<' + o.p) + ' the height is negative.', why: 'Check the height at ' + t('x=' + o.p) + ': ' + t('\\frac{(' + o.p + '+' + o.p + ')(' + o.p + '+' + o.q + ')}{' + o.k2 * o.p * o.p + '}') + ' is positive. It is the <b>base</b> that is negative there.', code: 'why-mc' },
            { html: 'For ' + t('x<' + o.p) + ' the expression for the area cannot be simplified.', why: 'Simplifying works for every permissible value. The reason is that lengths must be positive.', code: 'why-mc' },
            { html: t('x') + ' must be a whole number greater than ' + t(o.p) + '.', why: t('x') + ' can be any real number that keeps both lengths positive; it does not have to be a whole number.', code: 'why-mc' }],
            'For ' + t('0<x<' + o.p) + ', ' + t('x^{2}-' + o.p * o.p + '<0') + ', so the base ' + t('\\frac{' + o.k1 + 'x}{x^{2}-' + o.p * o.p + '}') + ' is negative, and ' + t('x=' + o.p) + ' is an NPV. Lengths must be positive, so ' + t('x>' + o.p) + '.', ['Try a value such as ' + t('x=1') + ' in the base.'], 'why x > p');
        } },
        { id: 'q8c', level: 'MAS', make: function (r, o) {
          var d0 = o.n - o.h * o.h, x = U.radNorm(o.m * (o.h + o.q), o.m, o.n, d0), xs = o.h + '+\\sqrt{' + o.n + '}';
          return U.exactPart(CP, 'Determine the exact area when ' + t('x=' + xs) + ', in simplest form.', x, {},
            t('x(x-' + o.p + ')=(' + xs + ')(\\sqrt{' + o.n + '}-' + o.h + ')=' + o.n + '-' + o.h * o.h + '=' + d0) + '<br>' + t('A=\\frac{' + (o.m > 1 ? o.m + '(' : '') + xs + '+' + o.q + (o.m > 1 ? ')' : '') + '}{' + d0 + '}=' + U.radTex(x)) + ' m² ' + t('(\\approx ' + U.radVal(x).toFixed(2) + ')') + '.',
            ['Substitute into your simplified area. Work out the denominator ' + t('x(x-' + o.p + ')') + ' first: it is a difference of squares.', 'Simplify the numerator; reduce if every term shares a factor.'], 'exact area at a radical');
        } }] },
    { num: '9', shared: function (r) {
        return pickWhere(function () { var p = r.int(2, 5), k = r.int(2, 4), b = r.int(1, 9); return { p: p, a: k * p, k: k, b: b }; }, function (z) { return z.b !== z.p && z.b !== z.a && !(z.a === 6 && z.p === 2 && z.b === 3); });
      },
      stem: function (o) { return 'A student simplified ' + t('\\frac{x+' + o.a + '}{x^{2}-' + o.p * o.p + '}\\cdot\\frac{x-' + o.p + '}{x+' + o.b + '}') + ', ' + t('x\\ne ' + o.p + ',\\ -' + o.p + ',\\ -' + o.b) + ', as shown.<br>Step 1: ' + t('\\frac{x+' + o.a + '}{(x-' + o.p + ')(x+' + o.p + ')}\\cdot\\frac{x-' + o.p + '}{x+' + o.b + '}') + ' &nbsp; Step 2: ' + t('\\frac{x+' + o.a + '}{(x+' + o.p + ')(x+' + o.b + ')}') + ' &nbsp; Step 3: ' + t('\\frac{\\cancel{x}+\\cancelto{' + o.k + '}{' + o.a + '}}{(\\cancel{x}+\\cancel{' + o.p + '})(x+' + o.b + ')}=\\frac{' + o.k + '}{x+' + o.b + '}'); },
      parts: [
        { id: 'q9a', level: 'EMG', make: function (r, o) {
          return mcp(r, 'Which step has the error?', [
            { html: 'Step 3: ' + t('x') + ' and ' + t(o.a) + ' are <b>terms</b> of ' + t('x+' + o.a) + ', not factors; only common factors can be divided out.', right: true },
            { html: 'Step 1: ' + t('x^{2}-' + o.p * o.p) + ' was factored incorrectly.', why: t('(x-' + o.p + ')(x+' + o.p + ')=x^{2}-' + o.p * o.p) + ': Step 1 is right. Look at what was divided out in Step 3.', code: 'step-mc' },
            { html: 'Step 2: ' + t('x-' + o.p) + ' cannot be divided out because it is in different fractions.', why: 'A factor of any numerator can be divided out with the same factor of any denominator. Step 2 is right.', code: 'step-mc' },
            { html: 'There is no error.', why: 'Check Step 3 with a number, e.g. ' + t('x=1') + ': Step 2 gives ' + t('\\frac{' + (1 + o.a) + '}{' + (1 + o.p) * (1 + o.b) + '}') + ', Step 3 gives ' + t('\\frac{' + o.k + '}{' + (1 + o.b) + '}') + '.', code: 'step-mc' }],
            'Step 3 is wrong. ' + t('x') + ' and ' + t(o.a) + ' are terms of ' + t('x+' + o.a) + ', not factors, and only common <b>factors</b> can be divided out. ' + t('x+' + o.a) + ' and ' + t('x+' + o.p) + ' have no common factor.', ['Check each step with a number such as ' + t('x=1') + '.'], 'error analysis: which step');
        } },
        { id: 'q9b', level: 'PRG', make: function (r, o) {
          var T = canon([[A(1, o.a)]], [[A(1, o.p), A(1, o.b)]]), bad = canon([[C(o.k)]], [[A(1, o.b)]]);
          return U.ratPart(CP, 'Give the correct simplified answer.', T, { dl: [{ cn: bad, code: CP + 'terms', hint: 'That is the student’s answer: ' + t('x') + ' and ' + t(o.a) + ' are terms, not factors, so they cannot be divided out.' }] },
            'Step 2 is already in lowest terms: ' + t(cTex(T)) + ', ' + t('x\\ne ' + o.p + ',\\ -' + o.p + ',\\ -' + o.b) + '. (Check ' + t('x=1') + ': ' + t('\\frac{' + (1 + o.a) + '}{' + (1 + o.p) * (1 + o.b) + '}') + ', but Step 3 gives ' + t('\\frac{' + o.k + '}{' + (1 + o.b) + '}') + '.)', ['Stop after the last step that divides out a common factor.'], 'error analysis: correct answer');
        } }] },
    { num: '10', parts: [
      { id: 'q10', level: 'MAS', make: function (r) {   // (v−p)(v+q)/(v(v+s)) · □/((v−p)(v+p)) = (v+q)/v → □ = (v+s)(v+p)
        var s = pickWhere(function () { var z = monics(r, 3, 7, noOpp); return { p: Math.abs(z[0]) + 1, q: z[1], s: z[2] }; }, function (z) { return [z.q, z.s].every(function (x) { return Math.abs(x) !== z.p; }) && z.q !== z.s && !(z.p === 3 && z.q === 2 && z.s === 4); });
        var n1 = [A(1, -s.p), A(1, s.q)], d1 = [Mo(1, 'x', 1), A(1, s.s)], d2 = [A(1, -s.p), A(1, s.p)], box = [A(1, s.s), A(1, s.p)];
        var T = canon([box], []), one = canon([[A(1, s.s)]], []), inv = canon([], [box]);
        var p = U.ratPart(CP, 'Determine the polynomial that belongs in the box: ' + t(fracE(n1, d1) + '\\cdot\\frac{\\boxed{\\phantom{xx}}}{' + polyT(d2) + '}=' + fracE([A(1, s.q)], [Mo(1, 'x', 1)])), T,
          { dl: [{ cn: one, code: CP + 'box-one', hint: 'After dividing out, the left side has ' + t('(x' + (s.s > 0 ? '+' : '') + s.s + ')(x+' + s.p + ')') + ' left in the denominator: the box must divide out <b>both</b>.' }, { cn: inv, code: CP + 'box-inv', hint: 'The box is a numerator: it must be a polynomial that divides out the extra denominator factors.' }], placeholder: 'e.g. (x+4)(x+3)' },
          'Factor: ' + t(fracF(n1, d1) + '\\cdot\\frac{\\boxed{\\phantom{x}}}{' + facTex(d2) + '}=\\frac{' + facTex([A(1, s.q)]) + '\\cdot\\boxed{\\phantom{x}}}{x' + facTex([A(1, s.s), A(1, s.p)]) + '}') + '.<br>For this to equal ' + t(fracE([A(1, s.q)], [Mo(1, 'x', 1)])) + ', the box must divide out ' + t(facTex(box)) + '. The box is ' + t(facTex(box) + '=' + polyT(box)) + '.',
          ['Factor everything you know, and divide out what you can.', 'Compare with the right side: which factors must the box cancel?'], 'missing polynomial');
        return p;
      } }] },
    { num: '11', parts: [
      { id: 'q11', level: 'PRG', make: function (r) {   // (v²−p²)/(v²+qv) · (v+q)/(p−v) → −(v+p)/v
        var s = pickWhere(function () { return { p: r.int(2, 9), q: nz(r, 1, 8) }; }, function (z) { return Math.abs(z.q) !== z.p && !(z.p === 5 && z.q === 2); });
        var T = canon([[A(1, s.p)]], [[Mo(1, 'x', 1)]]);
        return mcp(r, '<i>(Multiple Choice)</i> For all permissible values of ' + t('x') + ', the product ' + t(fracE([A(1, -s.p), A(1, s.p)], [Mo(1, 'x', 1), A(1, s.q)]) + '\\cdot' + fracE([A(1, s.q)], [A(-1, s.p)], { an: true, ad: true })) + ' simplifies to', [
          { html: ft(U.cNeg(T)), right: true },
          { html: ft(T), why: t('\\frac{x-' + s.p + '}{' + s.p + '-x}=-1') + ': keep the minus sign.', code: 'opp-sign' },
          { html: ft(U.cNeg(canon([[A(1, -s.p)]], [[Mo(1, 'x', 1)]]))), why: 'The factor that divides out with ' + t(s.p + '-x') + ' is ' + t('x-' + s.p) + ', leaving ' + t('x+' + s.p) + '.', code: 'wrong-factor' },
          { html: ft(canon([[A(1, s.p)]], [[Mo(1, 'x', 1), A(1, s.q)]])), why: t(fracE([A(1, s.q)], [])) + ' is in a numerator and a denominator: divide it out. And keep the −1 from the opposite factors.', code: 'opp-sign' }],
          t('\\frac{(x-' + s.p + ')(x+' + s.p + ')}{x' + facTex([A(1, s.q)]) + '}\\cdot\\frac{' + facTex([A(1, s.q)]) + '}{-(x-' + s.p + ')}=' + cTex(U.cNeg(T))), ['Write ' + t(s.p + '-x') + ' as ' + t('-(x-' + s.p + ')') + '.'], 'MC: opposite factors');
      } }] },
    { num: '12', parts: [
      { id: 'q12', level: 'EMG', make: function (r) {   // (v+a)/(v²−p²) · (v−p)/(v²+av): NPVs 0, −a, p, −p
        var s = pickWhere(function () { return { a: nz(r, 1, 8), p: r.int(2, 8) }; }, function (z) { return Math.abs(z.a) !== z.p && !(z.a === 1 && z.p === 3); });
        var d1 = [A(1, -s.p), A(1, s.p)], d2 = [Mo(1, 'x', 1), A(1, s.a)], npv = npvOf([d1, d2]);
        function ot(vals) { var o = {}; o.x = U.uniqR(vals); return t(npvTex(o)); }
        return mcp(r, '<i>(Multiple Choice)</i> The non-permissible values of ' + t(fracE([A(1, s.a)], d1) + '\\cdot' + fracE([A(1, -s.p)], d2)) + ' are', [
          { html: t(npvTex(npv)), right: true },
          { html: ot([0, s.p]), why: 'That is the NPVs of the simplified answer ' + t('\\frac{1}{x(x+' + s.p + ')}') + '. The NPVs come from every <b>original</b> denominator.', code: 'npv-cancel' },
          { html: ot([0, s.p, -s.p]), why: 'Factor ' + t(polyT(d2) + '=' + facTex(d2)) + ': it gives two NPVs.', code: 'npv-mc' },
          { html: ot([-s.a, s.p, -s.p]), why: 'Factor ' + t(polyT(d2) + '=' + facTex(d2)) + ': the factor ' + t('x') + ' gives ' + t('x\\ne 0') + '.', code: 'npv-mc' }],
          t(polyT(d1) + '=' + facTex(d1)) + ' and ' + t(polyT(d2) + '=' + facTex(d2)) + ', so ' + t(npvTex(npv)) + '.', ['Factor both denominators fully.'], 'MC: NPVs of a product');
      } }] },
    { num: '13', parts: [
      { id: 'q13', level: 'ADV', make: function (r) {   // c1(v−p)(v+p)/(v(v+q)) · c2 v(v+q)/((v+p)(v−s)) · (v−s)/(v−p) = c1 c2
        var z = U.gen(r, CP, function () { var f = monics(r, 3, 6, noOpp), c1 = r.int(2, 6), c2 = r.int(2, 6), p = Math.abs(f[0]);
          if (c1 * c2 > 99 || f.slice(1).some(function (x) { return Math.abs(x) === p; })) return null;
          return mul3(E([C(c1), A(1, -p), A(1, p)], [Mo(1, 'x', 1), A(1, f[1])]), E([Mo(c2, 'x', 1), A(1, f[1])], [A(1, p), A(1, -f[2])]), E([A(1, -f[2])], [A(1, -p)])); },
          { deg: [0, 0], npvs: 5, avoid: AV.concat(['4x^2-36|x^2+2x']), text: 'NR: whole number' }).z;
        var c1 = z.es[0].n[0].c[0], c2 = z.es[1].n[0].c[0], k = c1 * c2, sh = z.es.map(function (e, i) { return (i ? '\\cdot ' : '') + U.exprShow(e); }).join(''), fac = z.es.map(function (e, i) { return (i ? '\\cdot ' : '') + U.exprFac(e); }).join('');
        return KP.nr('<i>(Numerical Response)</i> For all permissible values of ' + t('x') + ', the product ' + t(sh) + ' simplifies to a whole number ' + t('k') + '. The value of ' + t('k') + ' is ______.', k,
          function (v) { if (v === c1 || v === c2) return { code: CP + 'k-part', hint: 'Both constant factors are left after dividing out: multiply them.' }; return null; },
          t(fac + '=' + c1 + '\\cdot ' + c2 + '=' + k), ['Factor everything, including the common factors ' + t(c1) + ' and ' + t(c2 + 'x') + '.', 'Every binomial divides out; multiply what is left.'], 'NR: whole number');
      } }] },
    { num: '14', parts: [
      { id: 'q14', level: 'PRG', make: function (r) {   // (v−p)(v+q)/(v(v+s)) · (v−s)(v+s)/(v−p)² → (v+q)(v−s)/(v(v−p)), at x0
        var z, x0, val;
        z = U.gen(r, CP, function () { var f = monics(r, 3, 6, noOpp); x0 = r.int(4, 9); var p = f[0], q = f[1], s = f[2];
          if ([p, s, -s, 0].indexOf(x0) >= 0 || x0 === -q) return null;
          return mul2(E([A(1, -p), A(1, q)], [Mo(1, 'x', 1), A(1, s)]), E([A(1, -s), A(1, s)], [A(1, -p), A(1, -p)])); },
          { deg: [2, 2], npvs: 3, avoid: AV, test: function (z0, I) { val = U.cAt(I.T, { x: x0 }); return val > 0.05 && val < 9.99 && Math.abs(val * 100 - Math.round(val * 100)) > 1e-6 && Math.abs(val * 100 - Math.floor(val * 100) - 0.5) > 0.02; }, text: 'NR: evaluate' }).z;
        var I = U.opInfo(z.es, z.ops), T = I.T, sh = U.exprShow(z.es[0]) + '\\cdot ' + U.exprShow(z.es[1]);
        val = U.cAt(T, { x: x0 });
        var q2 = U.cPolys(T);
        return KP.approx('<i>(Numerical Response)</i> Simplify ' + t(sh) + ', then evaluate it for ' + t('x=' + x0) + '. To the nearest hundredth, the value is ______.', val, 2, { nr: true },
          t(U.exprFac(z.es[0]) + '\\cdot ' + U.exprFac(z.es[1]) + '=' + cTex(T)) + ', ' + t(npvTex(I.npv)) + '.<br>At ' + t('x=' + x0) + ': ' + t('\\frac{' + P.at(q2.N, { x: x0 }) + '}{' + P.at(q2.D, { x: x0 }) + '}\\approx ' + val.toFixed(2)) + '.',
          ['Simplify first, then substitute (or substitute into the original: the value is the same).'], 'NR: simplify and evaluate');
      } }] }
  ];

  var EXTRA = [
    { num: '1', section: 'A. Skills', parts: [
      { id: 'e1a', level: 'BEG', make: function (r) { return U.fracQ(r, CP, { ops: ['mul'], neg: 1, avoid: ['15/14,21/40', '9/16,20/27'], text: 'multiply fractions (negative)' }); } },
      { id: 'e1b', level: 'BEG', make: function (r) { return U.monoQ(r, CP, { vs: ['x', 'y', 'z'], ops: ['mul'], avoid: ['10/9,3/25'], text: 'multiply monomial fractions' }); } },
      { id: 'e1c', level: 'EMG', make: function (r) { return U.monoQ(r, CP, { vs: r.pick([['p', 'q'], ['a', 'b'], ['x', 'y']]), ops: ['mul'], neg: 0, avoid: ['6/7,14/9', '4/15,25/6'], text: 'multiply monomial fractions (negative)' }); } }] },
    { num: '2', parts: [
      { id: 'e2a', level: 'EMG', make: function (r) {   // v(v−p)/(v+q) · c(v+q)/((v−p)(v+p)) → c v/(v+p)
        var v = pickVar(r);
        return U.gen(r, CP, function () { var z = monics(r, 2, 8, noOpp), c = r.int(2, 7); var p = z[0], q = z[1]; return mul2(E([Mo(1, v, 1), A(1, -p, v)], [A(1, q, v)]), E([C(c), A(1, q, v)], [A(1, -p, v), A(1, p, v)])); },
          { deg: [1, 1], npvs: 3, v: v, avoid: AV, test: function (z) { return Math.abs(z.es[0].n[1].b) !== Math.abs(z.es[0].d[0].b); }, text: 'multiply: common factors' });
      } },
      { id: 'e2b', level: 'EMG', make: function (r) {   // c1(v+p)/(v(v−q)) · c2(v−q)/((v−p)(v+p)) → c1c2/(v(v−p))
        var v = pickVar(r);
        return U.gen(r, CP, function () { var z = monics(r, 2, 8, noOpp), c1 = r.int(2, 9), c2 = r.int(2, 6); var p = z[0], q = z[1]; if (c1 * c2 > 40) return null; return mul2(E([C(c1), A(1, p, v)], [Mo(1, v, 1), A(1, -q, v)]), E([C(c2), A(1, -q, v)], [A(1, -p, v), A(1, p, v)])); },
          { deg: [0, 2], npvs: 4, v: v, avoid: AV, test: function (z) { return Math.abs(z.es[0].n[1].b) !== Math.abs(z.es[0].d[1].b); }, text: 'multiply: common factors' });
      } }] },
    { num: '3', parts: [
      { id: 'e3a', level: 'PRG', make: function (r) {   // (f0)(f1)/((f2)(f0)) · (f3)(f2)/((f1)(f4)) → f3/f4
        var v = pickVar(r);
        return U.gen(r, CP, function () { var f = monics(r, 5, 7, noOpp); return mul2(E([A(1, f[0], v), A(1, f[1], v)], [A(1, f[2], v), A(1, f[0], v)]), E([A(1, f[3], v), A(1, f[2], v)], [A(1, f[1], v), A(1, f[4], v)])); },
          { deg: [1, 1], npvs: 4, v: v, avoid: AV, maxc: 50, text: 'multiply: trinomials' });
      } },
      { id: 'e3b', level: 'PRG', make: function (r) {   // (av−b)(v+p)/((v−p)(v+p)) · v(v−p)/((av−b)(av+b)) → v/(av+b)
        var v = pickVar(r);
        return U.gen(r, CP, function () { var a = r.pick([2, 3, 4, 5]), b = r.int(1, 5) * (r.chance(0.5) ? 1 : -1), p = r.int(1, 7); if (gcd(a, b) !== 1) return null;
          return mul2(E([A(a, -b, v), A(1, p, v)], [A(1, -p, v), A(1, p, v)]), E([Mo(1, v, 1), A(1, -p, v)], [A(a, -b, v), A(a, b, v)])); },
          { deg: [1, 1], npvs: 4, v: v, avoid: AV, text: 'multiply: a ≠ 1 trinomials' });
      } }] },
    { num: '4', parts: [
      { id: 'e4a', level: 'PRG', make: function (r) {   // (p−v)/(v(v+q)) · (v+q)(v+p)/((v−p)(v+p)) → −1/v
        var v = pickVar(r);
        return U.gen(r, CP, function () { var p = r.int(2, 9), q = nz(r, 1, 7); if (Math.abs(q) === p) return null;
          return mul2(E([A(-1, p, v)], [Mo(1, v, 1), A(1, q, v)], { an: true }), E([A(1, q, v), A(1, p, v)], [A(1, -p, v), A(1, p, v)])); },
          { deg: [0, 1], npvs: 4, v: v, avoid: AV, opp: true, text: 'opposite factors' });
      } },
      { id: 'e4b', level: 'ADV', make: function (r) {   // (v−p)(v+q)/(c(s−v)) · (v−s)(v+s)/((v+q)(v−s)) → −(v−p)(v+s)/(c(v−s))
        var v = pickVar(r);
        return U.gen(r, CP, function () { var f = monics(r, 3, 7, noOpp), c = r.int(2, 6); var p = f[0], q = f[1], s = Math.abs(f[2]);
          if ([p, -q].indexOf(s) >= 0 || [p, -q].indexOf(-s) >= 0) return null;
          return mul2(E([A(1, -p, v), A(1, q, v)], [A(-c, c * s, v)], { ad: true }), E([A(1, -s, v), A(1, s, v)], [A(1, q, v), A(1, -s, v)])); },
          { deg: [2, 1], npvs: 2, v: v, avoid: AV, opp: true, text: 'opposite factors: one left' });
      } }] },
    { num: '5', section: 'B. Applying', parts: [
      { id: 'e5', level: 'ADV', make: function (r) {   // (v−p)(v+p)/(c1 v) · c2 v²/((v+p)(v−q)) · (v−q)/(v−p) → (c2/c1) v
        var v = pickVar(r);
        return U.gen(r, CP, function () { var f = monics(r, 2, 8, noOpp), c1 = r.pick([2, 3, 4, 5]), c2 = r.int(2, 12); var p = Math.abs(f[0]), q = f[1]; if (Math.abs(q) === p || c2 === c1 || c2 % c1 && c1 % c2 && gcd(c1, c2) === 1) return null;
          return mul3(E([A(1, -p, v), A(1, p, v)], [Mo(c1, v, 1)]), E([Mo(c2, v, 2)], [A(1, p, v), A(1, -q, v)]), E([A(1, -q, v)], [A(1, -p, v)])); },
          { deg: [1, 0], npvs: 4, v: v, avoid: AV, text: 'multiply three expressions' });
      } }] },
    { num: '6', parts: [
      { id: 'e6', level: 'ADV', make: function (r) {   // (m−kn)(m+kn)/(m(m+jn)) · (m−jn)(m+jn)/((m−kn)(m+jn)) → (m+kn)(m−jn)/(m(m+jn))
        var vw = r.pick([['m', 'n'], ['x', 'y'], ['a', 'b'], ['p', 'q']]), x = vw[0], y = vw[1];
        return U.gen(r, CP, function () { var k = r.int(2, 4), j = r.int(1, 3); if (k === j) return null; var sk = r.chance(0.5) ? 1 : -1;
          return { es: [E([L2(1, -k, x, y), L2(1, k, x, y)], [Mo(1, x, 1), L2(1, j, x, y)]), E([L2(1, -j, x, y), L2(1, j, x, y)], [L2(1, -sk * k, x, y), L2(1, j, x, y)])], ops: ['mul'], o: { restr: true, vars: [x, y] } }; },
          { avoid: AV, npvs: 3, maxc: 40, text: 'two variables: restrictions' });
      } }] },
    { num: '7', shared: function (r) {
        return pickWhere(function () { return { p: r.int(1, 6), q: r.int(1, 4), c1: r.pick([2, 3, 4, 6]), c2: r.int(2, 12), x0: r.int(2, 9) }; }, function (z) {
          if (z.p === z.q || z.c2 % z.c1 === 0 || gcd(z.c1, z.c2) === 1 || z.x0 <= z.q) return false;
          var val = z.c2 * z.x0 * (z.x0 + z.q) / (z.c1 * (z.x0 + z.p)), den = z.c1 * (z.x0 + z.p) / gcd(z.c2 * z.x0 * (z.x0 + z.q), z.c1 * (z.x0 + z.p));
          while (den % 2 === 0) den /= 2; while (den % 5 === 0) den /= 5;
          return den === 1 && val < 1000 && !(z.p === 2 && z.q === 1 && z.c1 === 4 && z.c2 === 8);
        });
      },
      stem: function (o) { return 'A box (rectangular prism) has length ' + t(fracE([A(1, o.p)], [A(1, -o.q)])) + ', width ' + t(fracE([A(1, -o.q), A(1, o.q)], [Mo(o.c1, 'x', 1)])) + ' and height ' + t(fracE([Mo(o.c2, 'x', 2)], [A(1, o.p), A(1, o.p)])) + ', all in metres, where ' + t('x>' + o.q) + '.'; },
      parts: [
        { id: 'e7a', level: 'PRG', make: function (r, o) {
          var es = [E([A(1, o.p)], [A(1, -o.q)]), E([A(1, -o.q), A(1, o.q)], [Mo(o.c1, 'x', 1)]), E([Mo(o.c2, 'x', 2)], [A(1, o.p), A(1, o.p)])], T = U.opCanon(es, [false, false, false]);
          return U.ratPart(CP, 'Write and simplify an expression for its volume.', T, {}, t('V=' + es.map(function (e, i) { return (i ? '\\cdot ' : '') + U.exprFac(e); }).join('') + '=' + cTex(T)) + ' cubic metres.', ['Volume = length × width × height.', 'Factor, then divide out the common factors.'], 'box volume');
        } },
        { id: 'e7b', level: 'EMG', make: function (r, o) {
          var nn = o.c2 * o.x0 * (o.x0 + o.q), dd = o.c1 * (o.x0 + o.p), val = ex.norm(nn, dd);
          var p = KP.fraction('Determine the volume when ' + t('x=' + o.x0) + '.', val, { decimalOk: true }, t('V=\\frac{' + nn + '}{' + dd + '}=' + ex.texRat(val) + (val[1] === 1 ? '' : '=' + HW.fmt(val[0] / val[1]))) + ' m³.', ['Substitute into your simplified volume.'], 'box volume at a value');
          p.input.after = '\\text{ m}^3';
          return p;
        } }] },
    { num: '8', parts: [
      { id: 'e8', level: 'PRG', make: function (r) {   // c(v−p)/(v(v−q)) · (v−q)(v+q)/((p−v)(p+v)) → −c(v+q)/(v(v+p))
        var s = pickWhere(function () { return { p: r.int(2, 8), q: nz(r, 1, 7), c: r.int(2, 5) }; }, function (z) { return Math.abs(z.q) !== z.p && !(z.p === 3 && z.q === 1 && z.c === 2); });
        var n1 = [C(s.c), A(1, -s.p)], d1 = [Mo(1, 'x', 1), A(1, -s.q)], n2 = [A(1, -s.q), A(1, s.q)], d2 = [A(-1, s.p), A(1, s.p)];
        var T = canon([n1, n2], [d1, d2]);
        return mcp(r, '<i>(Multiple Choice)</i> For all permissible values of ' + t('x') + ', ' + t(fracE(n1, d1) + '\\cdot' + fracE(n2, d2, { ad: true })) + ' is equal to', [
          { html: ft(T), right: true },
          { html: ft(U.cNeg(T)), why: t(U.txa(U.listPoly(d2)) + '=-(x-' + s.p + ')(x+' + s.p + ')') + ': keep the −1.', code: 'opp-sign' },
          { html: ft(canon([[C(-s.c), A(1, s.q)]], [[Mo(1, 'x', 1), A(1, -s.p)]])), why: 'The factor ' + t('x-' + s.p) + ' divides out (with the −1); ' + t('x+' + s.p) + ' is left.', code: 'wrong-factor' },
          { html: ft(canon([[C(s.c)]], [[Mo(1, 'x', 1), A(1, s.p)]])), why: t(facTex([A(1, s.q)])) + ' is only in a numerator: it cannot be divided out. Keep the −1 too.', code: 'wrong-factor' }],
          t(fracF(n1, d1) + '\\cdot\\frac{' + facTex(n2) + '}{-(x-' + s.p + ')(x+' + s.p + ')}=' + cTex(T)), ['Write ' + t(U.txa(U.listPoly(d2))) + ' as ' + t('-(x^{2}-' + s.p * s.p + ')') + '.'], 'MC: opposite factors');
      } }] },
    { num: '9', parts: [
      { id: 'e9', level: 'ADV', make: function (r) {   // c1(v−p)(v+p)/(v(v−q)) · (v−q)(v+q)/((v+p)(v+q)) · c2 v/(v−p) = c1 c2
        var z = U.gen(r, CP, function () { var f = monics(r, 2, 6, noOpp), c1 = r.int(2, 6), c2 = r.int(2, 6), p = Math.abs(f[0]), q = f[1]; if (Math.abs(q) === p || c1 * c2 > 99) return null;
          return mul3(E([C(c1), A(1, -p), A(1, p)], [Mo(1, 'x', 1), A(1, -q)]), E([A(1, -q), A(1, q)], [A(1, p), A(1, q)]), E([Mo(c2, 'x', 1)], [A(1, -p)])); },
          { deg: [0, 0], npvs: 5, avoid: AV, text: 'NR: whole number' }).z;
        var c1 = z.es[0].n[0].c[0], c2 = z.es[2].n[0].c[0], k = c1 * c2, sh = z.es.map(function (e, i) { return (i ? '\\cdot ' : '') + U.exprShow(e); }).join(''), fac = z.es.map(function (e, i) { return (i ? '\\cdot ' : '') + U.exprFac(e); }).join('');
        return KP.nr('<i>(Numerical Response)</i> For all permissible values of ' + t('x') + ', the product ' + t(sh) + ' simplifies to a whole number. The number is ______.', k,
          function (v) { if (v === c1 || v === c2) return { code: CP + 'k-part', hint: 'Two constant factors are left after dividing out: multiply them.' }; return null; },
          t(fac + '=' + c1 + '\\cdot ' + c2 + '=' + k), ['Factor everything, then divide out every common factor.'], 'NR: whole number');
      } }] },
    { num: '10', section: 'C. Stretch', parts: [
      { id: 'e10', level: 'MAS', make: function (r) {   // (v+p)(v−q)/□ · (v−s)(v+s)/(v+p) = (v+s)/v → □ = v(v−q)(v−s)
        var s = pickWhere(function () { var z = monics(r, 3, 6, noOpp); return { p: z[0], q: z[1], s: Math.abs(z[2]) }; }, function (z) { return [z.p, z.q].every(function (x) { return Math.abs(x) !== z.s; }) && !(z.p === 5 && z.q === 3 && z.s === 2); });
        var n1 = [A(1, s.p), A(1, -s.q)], n2 = [A(1, -s.s), A(1, s.s)], d2 = [A(1, s.p)], box = [Mo(1, 'x', 1), A(1, -s.q), A(1, -s.s)];
        var T = canon([box], []), part = canon([[A(1, -s.q), A(1, -s.s)]], []);
        return U.ratPart(CP, 'Determine the polynomial that belongs in the box: ' + t('\\frac{' + polyT(n1) + '}{\\boxed{\\phantom{xx}}}\\cdot' + fracE(n2, d2) + '=' + fracE([A(1, s.s)], [Mo(1, 'x', 1)])), T,
          { dl: [{ cn: part, code: CP + 'box-one', hint: 'The right side has ' + t('x') + ' in its denominator: the box must supply it too.' }], placeholder: 'e.g. x(x-3)(x-2)' },
          t('\\frac{' + facTex(n1) + '}{\\boxed{\\phantom{x}}}\\cdot\\frac{' + facTex(n2) + '}{' + facTex(d2) + '}=\\frac{' + facTex([A(1, -s.q), A(1, -s.s), A(1, s.s)]) + '}{\\boxed{\\phantom{x}}}') + '.<br>To leave ' + t(fracE([A(1, s.s)], [Mo(1, 'x', 1)])) + ', the box must be ' + t(facTex(box) + '=' + polyT(box)) + '.',
          ['Factor and divide out what you can; the box is the only denominator left on the left side.', 'Which factors must the box divide out, and what must it leave?'], 'missing denominator');
      } }] },
    { num: '11', shared: function (r) {
        return pickWhere(function () { return { p: nz(r, 1, 4), q: r.int(1, 4), n: r.pick([2, 3, 5, 6, 7]) }; }, function (z) {
          if (Math.abs(z.p) === z.q || (z.p === 2 && z.q === 1 && z.n === 3)) return false;
          var A0 = z.n - z.q * z.p, B0 = z.p - z.q, den = A0 * A0 - B0 * B0 * z.n; return den !== 0 && Math.abs(den) <= 60 && A0 !== 0;
        });
      },
      parts: [
        { id: 'e11a', level: 'ADV', make: function (r, o) {   // v(v−p)/((v−q)(v+q)) · (v+q)/((v−p)(v+p)) → v/((v−q)(v+p))
          return U.opPart(CP, [E([Mo(1, 'x', 1), A(1, -o.p)], [A(1, -o.q), A(1, o.q)]), E([A(1, o.q)], [A(1, -o.p), A(1, o.p)])], ['mul'], { text: 'simplify, then evaluate' });
        } },
        { id: 'e11b', level: 'MAS', make: function (r, o) {
          var A0 = o.n - o.q * o.p, B0 = o.p - o.q, x = U.radNorm(-B0 * o.n, A0, o.n, A0 * A0 - B0 * B0 * o.n), sn = '\\sqrt{' + o.n + '}';
          var dexp = A0 + (B0 ? (B0 > 0 ? '+' : '-') + (Math.abs(B0) === 1 ? '' : Math.abs(B0)) + sn : '');
          return U.exactPart(CP, 'Determine the exact value of the simplified expression when ' + t('x=' + sn) + ', in simplest form.', x, {},
            t('(' + sn + '-' + o.q + ')(' + sn + (o.p > 0 ? '+' : '-') + Math.abs(o.p) + ')=' + dexp) + '.<br>' + t('\\frac{' + sn + '}{' + dexp + '}\\cdot\\frac{' + A0 + (B0 > 0 ? '-' : '+') + (Math.abs(B0) === 1 ? '' : Math.abs(B0)) + sn + '}{' + A0 + (B0 > 0 ? '-' : '+') + (Math.abs(B0) === 1 ? '' : Math.abs(B0)) + sn + '}=' + U.radTex(x)) + ' ' + t('(\\approx ' + U.radVal(x).toFixed(3) + ')') + '.',
            ['Substitute into the simplified expression and expand the denominator.', 'Multiply the numerator and denominator by the conjugate of the denominator.'], 'exact value at √n');
        } }] },
    { num: '12', shared: function (r) { return pickWhere(function () { return { a: nz(r, 1, 8), b: nz(r, 1, 8) }; }, function (z) { return z.a !== -z.b && !(z.a === 1 && z.b === 3); }); },
      stem: function (o) { return 'Jordan says ' + t(fracE([A(1, -o.a)], [A(1, o.b)]) + '\\cdot' + fracE([A(1, o.b)], [A(1, -o.a)])) + ' is equal to ' + t(1) + ' for every value of ' + t('x') + '.'; },
      parts: [
        { id: 'e12a', level: 'EMG', make: function (r, o) {
          return mcp(r, 'Is Jordan right?', [
            { html: 'Not quite: it equals ' + t(1) + ' only for ' + t('x\\ne ' + (-o.b) + ',\\ ' + o.a) + '. At those values a denominator is ' + t(0) + ', so the product is undefined.', right: true },
            { html: 'Yes: every factor divides out, so it is ' + t(1) + ' everywhere.', why: 'Try ' + t('x=' + o.a) + ': a denominator is ' + t(0) + ', so the product has no value there.', code: 'why-mc' },
            { html: 'Not quite: it equals ' + t(1) + ' only for ' + t('x\\ne ' + (-o.b)) + '.', why: 'Both denominators give NPVs: ' + t('x' + (o.a > 0 ? '-' : '+') + Math.abs(o.a)) + ' is a denominator too.', code: 'why-mc' },
            { html: 'No: it equals ' + t('-1') + '.', why: 'The factors are the same (not opposites), so they divide to ' + t(1) + '.', code: 'why-mc' }],
            'The product equals ' + t(1) + ' only for ' + t('x\\ne ' + (-o.b) + ',\\ ' + o.a) + '; at those values a denominator is ' + t(0) + ' and the product is undefined.', ['Where is each denominator ' + t(0) + '?'], 'Jordan: is he right');
        } },
        { id: 'e12b', level: 'ADV', make: function (r, o) {
          function pt(x) { return '(' + x + ',\\ 1)'; }
          return mcp(r, 'How do the graphs of ' + t('y=' + fracE([A(1, -o.a)], [A(1, o.b)]) + '\\cdot' + fracE([A(1, o.b)], [A(1, -o.a)])) + ' and ' + t('y=1') + ' differ?', [
            { html: 'The product’s graph is the line ' + t('y=1') + ' with holes at ' + t(pt(-o.b)) + ' and ' + t(pt(o.a)) + '; the graph of ' + t('y=1') + ' has no holes.', right: true },
            { html: 'The product’s graph has vertical asymptotes at ' + t('x=' + (-o.b)) + ' and ' + t('x=' + o.a) + '.', why: 'Every factor divides out, so there is no asymptote: the graph is ' + t('y=1') + ' with points missing.', code: 'why-mc' },
            { html: 'The product’s graph is the line ' + t('y=1') + ' with holes at ' + t('(' + (-o.b) + ',\\ 0)') + ' and ' + t('(' + o.a + ',\\ 0)') + '.', why: 'The holes are on the line ' + t('y=1') + ', so their ' + t('y') + '-coordinate is ' + t(1) + '.', code: 'why-mc' },
            { html: 'They are the same graph.', why: 'The product is undefined at two values of ' + t('x') + ', so its graph is missing two points.', code: 'why-mc' }],
            'The product is ' + t(1) + ' except at its NPVs ' + t('x=' + (-o.b)) + ' and ' + t('x=' + o.a) + ', where it is undefined: the line ' + t('y=1') + ' with holes at ' + t(pt(-o.b)) + ' and ' + t(pt(o.a)) + '.', ['A value where the expression is undefined is a point missing from its graph.'], 'Jordan: the graphs');
        } }] }
  ];

  HW.defineLesson({ id: 'u6l3', unit: 6, num: '3', title: 'Multiplying Rational Expressions', outcome: 'AN5', calc: true, questions: QUESTIONS, extra: EXTRA });
})(window);
