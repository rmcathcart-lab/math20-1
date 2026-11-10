/* Math 20-1 · Unit 1 · Lesson 5 — Geometric Sequences (outcome RF10 on every part)
 * Assignment 5 (m201book unit1/u1_l05.tex, Questions 1–17) and the Lesson 5 Extra Practice (u1_ep05.tex, Questions 1–13).
 * Every part is a generator: the booklet question's idea, form and difficulty with new numbers (the lesson's example
 * numbers and the booklet question's own numbers are left out). On-screen calculator allowed (Unit 1); "exact value"
 * answers are exact (fractions, or the full terminating decimal).
 * General terms are typed with the keypad (n, powers, brackets): any expression equal to t₁rⁿ⁻¹ for n = 1…7 is
 * accepted, simplified (one power, no + or − outside the exponent); "as a single power" and "in the form t₁rⁿ⁻¹" are
 * required where asked. Recognised slips: rⁿ for rⁿ⁻¹, t₁ and r swapped, t₁·r multiplied first, the sign or the
 * reciprocal of r, the arithmetic formula.
 * Conversions: "is it enough / explain / what is his error / is it linear" -> multiple choice; Q2 -> a type table plus
 * one part per sequence (r or d, next two terms; "none" for the sequence with neither); lists of terms or means -> one
 * box per sequence with the numbers separated by commas; "is it a term?" -> multiple choice.
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: Q12(b), Extra 11, Extra 13. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, B = K.P, ex = HW.ex, F = HW.fmt, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var LID = 'u1l5';

  var CODES = {
    'u1l5-gt-rn': 'General term: rⁿ instead of rⁿ⁻¹', 'u1l5-gt-swap': 'General term: t₁ and r swapped', 'u1l5-gt-mult': 'General term: multiplied t₁ by r first ((t₁r)ⁿ⁻¹)',
    'u1l5-gt-sign': 'General term: wrong sign of r', 'u1l5-gt-recip': 'General term: used 1/r', 'u1l5-gt-arith': 'General term: used the arithmetic formula',
    'u1l5-gt-letter': 'General term: a letter other than n', 'u1l5-gt-no-n': 'General term: no n in it', 'u1l5-gt-ratio': 'General term: right t₁, wrong ratio', 'u1l5-gt-t1': 'General term: wrong first term',
    'u1l5-not-tr': 'Not written as t₁rⁿ⁻¹', 'u1l5-gave-d': 'Gave the difference for a geometric sequence', 'u1l5-gave-r': 'Gave a ratio for an arithmetic sequence', 'u1l5-r-flip': 'Ratio upside down',
    'u1l5-arith-next': 'Next term: added instead of multiplying', 'u1l5-geo-next': 'Next term: multiplied an arithmetic sequence', 'u1l5-neither': 'Gave r or d for a sequence with neither',
    'u1l5-rn': 'Term: used rⁿ instead of rⁿ⁻¹', 'u1l5-rn2': 'Term: used rⁿ⁻²', 'u1l5-mult': 'Term: multiplied t₁ by r before the power', 'u1l5-n-minus': 'Number of terms: gave n − 1',
    'u1l5-last': 'Gave the last term instead of the middle', 'u1l5-means-count': 'Number of terms from means: miscounted', 'u1l5-r-power': 'Gave a power of r instead of r',
    'u1l5-t1-power': 'First term: divided by the wrong power of r', 'u1l5-t1-mult': 'First term: multiplied instead of dividing', 'u1l5-one-sign': 'Missed the negative-ratio case',
    'u1l5-exp-add': 'Single power: exponents added wrong', 'u1l5-exp-mult': 'Single power: multiplied the exponents', 'u1l5-gave-x': 'Gave x instead of the term', 'u1l5-gave-t3': 'Gave t₃ instead of t₄',
    'u1l5-x-zero': 'Kept x = 0 (no common ratio)', 'u1l5-table-early': 'Table: stopped one step early', 'u1l5-table-late': 'Table: went one step too far',
    'u1l5-list-count': 'Wrong number of values', 'u1l5-list-order': 'Values out of order', 'u1l5-list': 'Wrong values in the list'
  };
  HW.addCodes(Object.keys(CODES).filter(function (k) { return !HW.CODES[k]; }).reduce(function (o, k) { o[k] = CODES[k]; return o; }, {}));
  HW.addPartial({ 'u1l5-gt-rn': 's', 'u1l5-gt-swap': 'b', 'u1l5-gt-mult': 'b', 'u1l5-gt-sign': 's', 'u1l5-gt-recip': 's', 'u1l5-gt-arith': 'n', 'u1l5-gt-ratio': 'b', 'u1l5-gt-t1': 'b',
    'u1l5-gave-d': 'b', 'u1l5-gave-r': 'b', 'u1l5-r-flip': 's', 'u1l5-arith-next': 'b', 'u1l5-geo-next': 'b', 'u1l5-neither': 'b', 'u1l5-rn': 's', 'u1l5-rn2': 's', 'u1l5-mult': 'b',
    'u1l5-n-minus': 's', 'u1l5-last': 'b', 'u1l5-means-count': 's', 'u1l5-r-power': 's', 'u1l5-t1-power': 's', 'u1l5-t1-mult': 'b', 'u1l5-one-sign': 's', 'u1l5-exp-add': 's',
    'u1l5-exp-mult': 'b', 'u1l5-gave-x': 'b', 'u1l5-gave-t3': 's', 'u1l5-x-zero': 's', 'u1l5-table-early': 's', 'u1l5-table-late': 's', 'u1l5-list-order': 's' });

  /* ======================= helpers (the same block in u1l4.js, u1l5.js and u1l6.js) ======================= */
  function cl(x) { return Math.round(x * 1e9) / 1e9; }
  function same(a, b) { return Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b)); }
  function nT(x) { x = cl(x); if (Math.abs(x) < 1e-12) x = 0; return F(x); }
  function sgp(x) { return x < 0 ? '(' + nT(x) + ')' : nT(x); }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var r = a % b; a = b; b = r; } return a; }
  function range(a, b, s) { var o = []; for (var i = a; i <= b + 1e-9; i += (s || 1)) o.push(cl(i)); return o; }
  function pickWhere(gen, okf) { for (var i = 0; i < 6000; i++) { var o = gen(); if (okf(o)) return o; } throw new Error(LID + ': no valid numbers'); }
  function isInt(x) { return Math.abs(x - Math.round(x)) < 1e-9; }
  function rd(x, dp) { return K.roundTo(x, dp); }
  function fx(x, dp) { return F(rd(x, dp).toFixed(dp)); }
  function money(x) { return '\\$' + fx(x, 2); }
  /* exact fractions [p, q] */
  function Q(p, q) { return ex.norm(p, q == null ? 1 : q); }
  function qv(r) { return Array.isArray(r) ? r[0] / r[1] : r; }
  function qa(a, b) { return Q(a[0] * b[1] + b[0] * a[1], a[1] * b[1]); }
  function qs(a, b) { return Q(a[0] * b[1] - b[0] * a[1], a[1] * b[1]); }
  function qm(a, b) { return Q(a[0] * b[0], a[1] * b[1]); }
  function qd(a, b) { return Q(a[0] * b[1], a[1] * b[0]); }
  function qp(a, k) { var r = [1, 1]; for (var i = 0; i < Math.abs(k); i++) r = qm(r, a); return k < 0 ? Q(r[1], r[0]) : r; }
  function qi(n) { return [n, 1]; }
  /* LaTeX of a fraction (par: brackets around a negative or a fraction, for a base or a factor) */
  function qTex(r, par) {
    r = Q(r[0], r[1]);
    if (r[1] === 1) return par && r[0] < 0 ? '(' + nT(r[0]) + ')' : nT(r[0]);
    var s = (r[0] < 0 ? '-' : '') + '\\frac{' + nT(Math.abs(r[0])) + '}{' + nT(r[1]) + '}';
    return par ? '\\left(' + s + '\\right)' : s;
  }
  function qKey(r) { r = Q(r[0], r[1]); return r[1] === 1 ? String(r[0]) : (r[0] < 0 ? '-' : '') + '\\frac{' + Math.abs(r[0]) + '}{' + r[1] + '}'; }
  /* a fraction as a terminating decimal string, or null */
  function dec(r) {
    r = Q(r[0], r[1]); var q = r[1], k = 0, j = 0;
    while (q % 2 === 0) { q /= 2; k++; } while (q % 5 === 0) { q /= 5; j++; }
    if (q !== 1) return null;
    var s = (r[0] / r[1]).toFixed(Math.max(k, j));
    return s.indexOf('.') >= 0 ? s.replace(/0+$/, '').replace(/\.$/, '') : s;
  }
  function dTex(r) { var d = dec(r); return d == null ? qTex(r) : F(Number(d)) === String(Number(d)) ? d : F(Number(d)); }
  /* ---- reading a number answer (a leading $ is fine; a trailing unit gets a nudge) ---- */
  var UNIT = /\s*(cm\^\{?2\}?|cm²|mm|cm|km|m|mg|kg|g|h|hours?|days?|years?|min|minutes?|weeks?|seats|cans|logs|layers|rows|terms|bacteria|cells|members|people|loans|animals|items|folds|swings|passes|\\%|%)\s*\.?\s*$/i;
  function clean(resp) {
    var s = String(resp == null ? '' : resp).trim().replace(/^\s*(\\\$|\$)\s*/, '').replace(/^\s*\\text\{\s*\$\s*\}\s*/, '');
    var u = s.replace(/\\(text|mathrm)\{\s*([^{}]*)\}/g, '$2').replace(/\\[,;: ]|~/g, ' ');
    var u2 = u.replace(UNIT, '');
    return { s: s, u: u2 !== u && u2.trim() ? u2.trim() : null };
  }
  /* typical wrong values -> diagnosis: cands = [[value, code, hint]] (dp: also match the value rounded to dp places) */
  function cdiag(cands, dp) {
    return function (v) {
      var c = cands || [];
      for (var i = 0; i < c.length; i++) {
        if (!c[i] || !isFinite(c[i][0])) continue;
        if (same(v, c[i][0]) || (dp != null && Math.abs(v - rd(c[i][0], dp)) < 1e-9)) return { code: c[i][1], hint: c[i][2] };
      }
      return null;
    };
  }
  /* an exact number (or fraction [p, q]); o.cands, o.int (whole number required) */
  function exact(ans, o) {
    o = o || {};
    var T = qv(ans), fr = Array.isArray(ans) && Q(ans[0], ans[1])[1] !== 1, term = fr && dec(ans) != null, dg = cdiag(o.cands);
    return function (resp) {
      var C = clean(resp), a = K.read(C.s);
      if (a.res && C.u != null) { var a2 = K.read(C.u); if (!a2.res && same(a2.val, T)) return form('units', 'Right — now leave the unit out and type just the number.'); if (!a2.res) a = a2; }
      if (a.res) return a.res;
      var sh = ex.shape(a.ast);
      if (Object.keys(sh.vars).length) { if (C.u != null) { var a3 = K.read(C.u); if (!a3.res && same(a3.val, T)) return form('units', 'Right — now leave the unit out and type just the number.'); } return form('notnumber', 'Type a number only (no letters).'); }
      var mv = ex.mixedValue(a.ast);
      if (mv != null) return same(mv, T) ? form('mixed-num', 'Right value! Write it as an improper fraction (for example ' + t('2\\tfrac{1}{3}=\\frac{7}{3}') + ') or a decimal, not a mixed number.') : wrong('value', null);
      if (same(a.val, T)) {
        var pf = ex.plainFraction(a.ast);
        if (sh.ops || sh.pow || sh.roots || sh.muls || sh.abs || (sh.divs && !pf)) return form('simplify', 'Right value — now simplify it to a single number.');
        if (pf && pf[1] !== 1 && gcd(pf[0], pf[1]) > 1) return form('lowest', 'Right value — now reduce the fraction to lowest terms.');
        return ok();
      }
      if (fr && !term && sh.decimals && Math.abs(a.val - T) < 0.01) return form('decimal-rounded', 'That decimal is close, but it isn’t exact. Give the exact value as a fraction.');
      if (!isFinite(a.val)) return wrong('undefined', null);
      var h = dg(a.val); if (h) return wrong(h.code, h.hint);
      if (T !== 0 && same(a.val, -T)) return wrong('sign', 'Check the sign of your answer.');
      return wrong('value', null);
    };
  }
  function badOf(cands, ans, dp) {
    var out = [], v = qv(ans);
    (cands || []).forEach(function (c) {
      if (!c || !isFinite(c[0])) return;
      var x = dp != null ? rd(c[0], dp) : cl(c[0]);
      if (dp != null ? Math.abs(x - rd(v, dp)) < 1e-9 : same(x, v)) return;
      if (Math.abs(x) > 1e15 || (x !== 0 && Math.abs(x) < 1e-6)) return;
      out.push(dp != null ? x.toFixed(dp) : String(x));
    });
    return out;
  }
  function nrWrap(check) {
    return function (resp) { var s = String(resp == null ? '' : resp).replace(/\s/g, ''); if (HW.parse.number(s).ok && s.length > 4) return form('nr-long', 'Numerical response answers fit in 4 boxes (digits and a decimal point only).'); return check(resp); };
  }
  /* a part with one exact number (ans: number or [p, q]). o: cands, before, after, sol, hints, text, nr, math, keys */
  function numPart(prompt, ans, o) {
    o = o || {};
    var fr = Array.isArray(ans) && Q(ans[0], ans[1])[1] !== 1, v = qv(ans);
    var key = fr ? qKey(ans) : String(cl(v));
    var input = fr || o.math ? { type: 'math', keys: o.keys || 'fraction', before: o.before, after: o.after } : { type: 'number', before: o.before, after: o.after, nr: !!o.nr };
    var check = exact(ans, o); if (o.nr) check = nrWrap(check);
    return { prompt: prompt, input: input, check: check, key: key, answer: t((o.ansPre || '') + (fr ? qTex(ans) : nT(v)) + (o.unit ? '\\text{ ' + o.unit + '}' : '')),
      solution: o.sol, hints: o.hints || [], text: o.text, bad: badOf(o.cands, ans).concat(o.bad || []), good: o.good };
  }
  /* a part with a rounded number */
  function apxPart(prompt, x, dp, o) {
    o = o || {};
    var want = rd(x, dp);
    return { prompt: prompt, input: { type: 'number', before: o.before, after: o.after, nr: !!o.nr }, check: K.approx(x, dp, { diag: cdiag(o.cands, dp), nr: o.nr }), key: want.toFixed(Math.max(dp, 0)),
      answer: t((o.ansPre || '') + fx(x, dp) + (o.unit ? '\\text{ ' + o.unit + '}' : '')), solution: o.sol, hints: o.hints || [], text: o.text, bad: badOf(o.cands, x, dp).concat(o.bad || []), good: o.good };
  }
  /* several boxes. specs: [{ label (HTML), ans, dp, cands, math, keys, vars, none, check, key, ansTex, after, before }] */
  function fieldsPart(prompt, specs, o) {
    o = o || {};
    var fields = [], checks = [], keys = [], ans = [];
    specs.forEach(function (s) {
      var fr = s.ans != null && Array.isArray(s.ans) && Q(s.ans[0], s.ans[1])[1] !== 1, math = !!(s.math || fr);
      fields.push({ label: s.label, name: s.name || s.label, after: s.after, before: s.before, mode: math ? 'math' : undefined, keys: math ? (s.keys || 'fraction') : undefined, vars: s.vars, none: s.none, placeholder: s.placeholder });
      checks.push(s.check || (s.dp != null ? K.approx(s.ans, s.dp, { diag: cdiag(s.cands, s.dp) }) : exact(s.ans, s)));
      keys.push(s.key != null ? s.key : s.dp != null ? rd(s.ans, s.dp).toFixed(s.dp) : fr ? qKey(s.ans) : String(cl(qv(s.ans))));
      ans.push((s.label ? s.label + ' ' : '') + t(s.ansTex || (s.dp != null ? fx(s.ans, s.dp) : fr ? qTex(s.ans) : nT(qv(s.ans)))));
    });
    var p = B.fields(prompt, fields, checks, keys, ans.join('<br>'), o.sol, o.hints || [], o.text);
    p.bad = o.bad; p.good = o.good;
    return p;
  }
  function mcPart(r, prompt, opts, sol, hints, text, keepOrder) {
    var seen = {}, out = [];
    opts.forEach(function (op) { var k = op.html.replace(/\s/g, ''); if (seen[k] && !op.right) return; seen[k] = 1; out.push(op); });
    return B.mc(r, prompt, out, sol, hints || [], text, keepOrder);
  }
  /* a list of numbers typed in one math box, separated by commas. o.any: order doesn't matter */
  function listCheck(vals, o) {
    o = o || {};
    return function (resp) {
      var s = String(resp == null ? '' : resp).replace(/\\left|\\right/g, '').replace(/^\s*\\\{|\\\}\s*$/g, '').replace(/\\text\{\s*and\s*\}|\\text\{\s*or\s*\}|\bor\b|\band\b|;/g, ',').trim();
      if (!s) return form('empty', 'Type your answer first.');
      var parts = s.split(',').map(function (x) { return x.trim(); }).filter(function (x) { return x.length; }), got = [];
      for (var i = 0; i < parts.length; i++) {
        var a = K.read(parts[i]); if (a.res) return form('unreadable', 'Separate the numbers with commas, e.g. ' + t('6,\\ 18,\\ 54') + '.');
        var sh = ex.shape(a.ast); if (sh.ops || sh.pow || sh.muls) return form('simplify', 'Give each number as a single value (work out the products).');
        got.push(a.val);
      }
      var want = vals.map(qv);
      if (got.length !== want.length) return wrong(LID + '-list-count', 'Give ' + want.length + ' number' + (want.length === 1 ? '' : 's') + ', separated by commas.');
      var g = got.slice(), w = want.slice();
      if (o.any) { g.sort(function (a, b) { return a - b; }); w.sort(function (a, b) { return a - b; }); }
      if (g.every(function (x, i) { return same(x, w[i]); })) return ok();
      if (!o.any && g.slice().reverse().every(function (x, i) { return same(x, w[i]); })) return wrong(LID + '-list-order', 'Right numbers, but write them in order, starting next to the first given number.');
      var nOk = g.filter(function (x, i) { return same(x, w[i]); }).length;
      if (o.diag) { var h = o.diag(g); if (h) return wrong(h.code, h.hint); }
      return wrong(LID + '-list', nOk ? nOk + ' of your ' + w.length + ' numbers are right. Check the others: multiply by the common ratio each time.' : null);
    };
  }
  function listKey(vals) { return vals.map(function (v) { return Array.isArray(v) ? qKey(v) : String(cl(v)); }).join(', '); }
  function listTex(vals) { return vals.map(function (v) { return Array.isArray(v) ? qTex(v) : nT(v); }).join(',\\ '); }
  /* ---- a general term in n: any equivalent expression (checked at n = 1 … 7), in the form asked ---- */
  function stripLHS(s) { return String(s == null ? '' : s).replace(/^\s*(t_\{?n\}?|t_\{\s*n\s*\}|t\(n\)|[a-zA-Z]_\{?n\}?|[yPVAh])\s*=\s*/, ''); }
  function eqFn(f, g) { for (var n = 1; n <= 7; n++) { var x = f(n), y = g(n); if (!isFinite(x) || !isFinite(y) || !same(x, y)) return false; } return true; }
  function unparen(a) { while (a && a.t === 'paren') a = a.a; return a; }
  function hasVar(a, v) { var f = false; (function w(x) { if (!x || typeof x !== 'object') return; if (x.t === 'var' && x.n === v) f = true; ['a', 'b', 'n'].forEach(function (k) { if (x[k]) w(x[k]); }); })(a); return f; }
  function countT(a, ty, inExp) { var c = 0; (function w(x, e) { if (!x || typeof x !== 'object') return; if (x.t === ty && !e) c++; if (x.t === 'pow') { w(x.a, e); w(x.b, inExp ? e : true); return; } ['a', 'b', 'n'].forEach(function (k) { if (x[k]) w(x[k], e); }); })(a, false); return c; }
  /* fn(n): the target; o.cands: [[fn, code, hint]]; o.form: 'single' (one power of a number) | 'tr' (t1·r^(n−1) with t1 = o.t1, r = o.r) */
  function gtCheck(fn, o) {
    o = o || {}; var v = o.v || 'n';
    return function (resp) {
      var a = K.read(stripLHS(resp)); if (a.res) return a.res;
      var sh = ex.shape(a.ast), vs = Object.keys(sh.vars);
      if (vs.some(function (x) { return x !== v; })) return form(LID + '-gt-letter', 'Use only ' + t(v) + ' (the position) as a letter in the general term.');
      var f = function (n) { var e = {}; e[v] = n; return ex.value(a.ast, e); };
      if (!vs.length) return wrong(LID + '-gt-no-n', 'The general term is a formula in ' + t(v) + ': it gives every term, so ' + t(v) + ' must appear in it.');
      if (eqFn(f, fn)) {
        if (countT(a.ast, 'add') + countT(a.ast, 'sub') > 0) return form('simplify', 'Right values — now simplify it: no ' + t('+') + ' or ' + t('-') + ' outside the exponent.');
        var A = unparen(a.ast);
        if (o.form === 'single' && !(A.t === 'pow' && ex.rat(unparen(A.a)) && hasVar(A.b, v))) return form('single-power', 'Right values — now write it as <b>one</b> power of ' + t(o.base) + ': write the first term as a power of ' + t(o.base) + ' and add the exponents.');
        if (o.form === 'tr') {
          var good = A.t === 'mul' && ex.rat(A.a) && unparen(A.b).t === 'pow' && ex.rat(unparen(unparen(A.b).a)) && same(ex.value(A.a), qv(o.t1)) && eqFn(function (n) { return ex.value(unparen(A.b).b, { n: n }); }, function (n) { return n - 1; });
          if (!good) return form(LID + '-not-tr', 'Right values — now write it in the form ' + t('t_n=t_1r^{n-1}') + ': the first term times the common ratio to the power ' + t('n-1') + '.');
        }
        if (countT(a.ast, 'pow') > 1) return form('simplify', 'Right values — now simplify it to one power (combine the powers).');
        return ok();
      }
      var c = o.cands || [];
      for (var i = 0; i < c.length; i++) if (c[i] && eqFn(f, c[i][0])) return wrong(c[i][1], c[i][2]);
      var f1 = f(1), g1 = fn(1), f2 = f(2), g2 = fn(2);
      if (same(f1, g1) && !same(f2, g2)) return wrong(LID + '-gt-ratio', 'Your formula gives the right first term, but not the right second term. Check the common ratio.');
      if (!same(f1, g1)) return wrong(LID + '-gt-t1', 'Check your formula at ' + t(v + '=1') + ': it should give the first term, ' + t(nT(g1)) + ', but it gives ' + t(nT(f1)) + '.');
      return wrong('value', null);
    };
  }
  function gtPart(prompt, fn, keyTex, o) {
    o = o || {};
    return { prompt: prompt, input: { type: 'math', keys: 'expo', vars: [o.v || 'n'], before: o.before === undefined ? t('t_n=') : o.before, placeholder: o.placeholder }, check: gtCheck(fn, o), key: keyTex,
      answer: t((o.before === undefined ? 't_n=' : '') + keyTex), solution: o.sol, hints: o.hints || [], text: o.text, bad: o.bad, good: o.good };
  }

  /* ======================= Lesson 5: geometric sequences ======================= */
  function gv(t1, r, n) { return qm(t1, qp(r, n - 1)); }                 // t_n as a fraction
  function rB(r) { return '\\left(' + qTex(r) + '\\right)'; }
  function rK(r) { return '\\left(' + qKey(r) + '\\right)'; }
  function coefT(c, tex) { return c === '1' ? '' : c === '-1' ? '-' : c; }
  function gtTex(t1, r) { return coefT(qTex(t1)) + rB(r) + '^{n-1}'; }
  function gtKey(t1, r) { return coefT(qKey(t1)) + rK(r) + '^{n-1}'; }
  function gtFn(t1, r) { var a = qv(t1), b = qv(r); return function (n) { return a * Math.pow(b, n - 1); }; }
  function seqTex(vals, more) { return vals.map(function (v) { return Array.isArray(v) ? qTex(v) : nT(v); }).join(',\\ ') + (more === false ? '' : ',\\ \\dots'); }
  /* typical wrong general terms */
  function gtC(t1, r) {
    var a = qv(t1), b = qv(r);
    return [[function (n) { return a * Math.pow(b, n); }, 'u1l5-gt-rn', 'Use the exponent ' + t('n-1') + ', not ' + t('n') + ': at ' + t('n=1') + ' the formula must give ' + t('t_1=' + qTex(t1)) + '.'],
      [function (n) { return b * Math.pow(a, n - 1); }, 'u1l5-gt-swap', 'You swapped ' + t('t_1') + ' and ' + t('r') + ': ' + t('t_n=t_1r^{n-1}') + ' — the first term in front, the common ratio in the power.'],
      [function (n) { return Math.pow(a * b, n - 1); }, 'u1l5-gt-mult', 'Don’t multiply ' + t('t_1') + ' by ' + t('r') + ' first: the exponent applies only to ' + t('r') + '. Your formula gives ' + t('t_1=1') + '.'],
      [function (n) { return a * Math.pow(-b, n - 1); }, 'u1l5-gt-sign', 'Check the sign of the common ratio: ' + t('r=\\frac{t_2}{t_1}') + '.'],
      [function (n) { return a * Math.pow(1 / b, n - 1); }, 'u1l5-gt-recip', t('r') + ' is each term divided by the term <b>before</b> it: ' + t('r=\\frac{t_2}{t_1}') + '.'],
      [function (n) { return a + (n - 1) * (a * b - a); }, 'u1l5-gt-arith', 'This sequence is geometric (each term is <b>multiplied</b> by ' + t('r') + '), so use ' + t('t_n=t_1r^{n-1}') + ', not the arithmetic formula.']];
  }
  /* typical wrong values of one term t_n */
  function termC(t1, r, n) {
    var a = qv(t1), b = qv(r);
    return [[a * Math.pow(b, n), 'u1l5-rn', 'The exponent on ' + t('r') + ' is one less than the position: ' + t('t_{' + n + '}=t_1r^{' + (n - 1) + '}') + '.'],
      [a * Math.pow(b, n - 2), 'u1l5-rn2', 'The exponent is ' + t(n - 1) + ': ' + t('t_{' + n + '}=t_1r^{' + (n - 1) + '}') + '.'],
      [Math.pow(a * b, n - 1), 'u1l5-mult', 'Work out the power first, then multiply by ' + t('t_1') + ': ' + t('t_1\\left(r^{' + (n - 1) + '}\\right)') + '.'],
      [a * Math.pow(-b, n - 1), 'sign', 'Check the sign: a negative ratio to an odd power is negative, to an even power is positive.']];
  }
  var HG = ['General term: ' + t('t_n=t_1r^{n-1}') + ', with ' + t('r=\\frac{t_2}{t_1}') + '.', 'Leave it as ' + t('t_1') + ' times ' + t('r^{n-1}') + ' — don’t multiply ' + t('t_1') + ' by ' + t('r') + ' first.'];
  var HT = ['Use ' + t('t_n=t_1r^{n-1}') + ': the exponent is one less than the position.'];
  var HNT = ['Set ' + t('t_1r^{n-1}') + ' equal to the last term, divide by ' + t('t_1') + ', then write both sides as powers of the same base and compare exponents.'];
  function ratioSol(vals, r) { return t('r=\\frac{' + qTex(vals[1]) + '}{' + qTex(vals[0]) + '}=' + qTex(r)); }
  /* "number of terms": t1, r, n */
  function nTermsSol(t1, r, n) {
    var last = gv(t1, r, n), q = qd(last, t1);
    return t(qTex(t1) + rB(r) + '^{n-1}=' + qTex(last)) + '<br>' + t(rB(r) + '^{n-1}=' + qTex(q) + '=' + rB(r) + '^{' + (n - 1) + '}') + '<br>' + t('n-1=' + (n - 1) + '\\Rightarrow n=' + n);
  }
  function nC(n) { return [[n - 1, 'u1l5-n-minus', 'That is the exponent ' + t('n-1') + '. Add ' + t('1') + ' to get the number of terms.'], [n + 1, 'u1l5-n-minus', 'Check: the exponent in ' + t('t_1r^{n-1}') + ' is ' + t('n-1') + '.']]; }
  /* two terms t_p, t_q -> r (odd gap) */
  function rFromTwo(tp, tq, p, q) { return '\\frac{t_1r^{' + (q - 1) + '}}{t_1r^{' + (p - 1) + '}}=\\frac{' + qTex(tq) + '}{' + qTex(tp) + '}\\Rightarrow r^{' + (q - p) + '}=' + qTex(qd(tq, tp)); }
  /* a list of numbers in one box */
  function listField(label, vals, o) { o = o || {}; return { label: label, name: o.name || label, math: true, keys: 'fraction', check: listCheck(vals, o), key: listKey(vals), ansTex: listTex(vals), placeholder: 'e.g. 6, 18, 54' }; }
  function noneCheck(hint) { return function (resp) { var s = String(resp == null ? '' : resp).replace(/\\text\{\s*none\s*\}|\\mathrm\{none\}/g, 'none').trim().toLowerCase(); if (s === 'none') return ok(); if (!s) return form('empty', 'Type your answer first (or press <b>none</b>).'); return wrong('u1l5-neither', hint); }; }
  function radCheck(k, m) { return K.radical({ k: [k, 1], n: 2, m: m }, 'mixed'); }
  function radTex(k, m) { return (k === 1 ? '' : k) + '\\sqrt{' + m + '}'; }
  function mono(c, L, e) { return (c === 1 ? '' : c) + L + (e === 1 ? '' : '^{' + e + '}'); }
  /* Q2 / EP1: r or d and the next two terms of one sequence (o from seqKinds) */
  function nextPart(prompt, o, text, level) {
    var fieldsR, kind = o.kind, keys = o.keys || 'fraction';
    if (kind === 'ne') fieldsR = { label: t('r\\text{ or }d='), name: 'r or d', math: true, keys: keys, none: true, check: noneCheck('The differences are ' + t(o.diffs.join(',\\ ')) + ' and the ratios aren’t equal either: there is no common ' + t('d') + ' or ' + t('r') + '. Press <b>none</b>.'), key: 'none', ansTex: '\\text{none}' };
    else if (o.rCheck) fieldsR = { label: t('r\\text{ or }d='), name: 'r or d', math: true, keys: keys, check: o.rCheck, key: o.rKey, ansTex: o.rTex };
    else fieldsR = { label: t('r\\text{ or }d='), name: 'r or d', math: true, keys: keys, ans: o.val, cands: o.rCands, none: o.none };
    if (o.vars) { fieldsR.vars = o.vars; }
    var nf = o.next.map(function (v, i) {
      if (o.nextCheck) return { label: t(['\\text{Next term:}', '\\text{Term after:}'][i]), name: ['next term', 'term after'][i], math: true, keys: keys, vars: o.vars, check: o.nextCheck[i], key: o.nextKey[i], ansTex: o.nextTex[i], none: o.none };
      return { label: t(['\\text{Next term:}', '\\text{Term after:}'][i]), name: ['next term', 'term after'][i], math: true, keys: keys, ans: v, cands: o.nextCands ? o.nextCands[i] : [], none: o.none };
    });
    return fieldsPart(prompt, [fieldsR].concat(nf), { sol: o.sol, hints: o.hints || ['Divide each term by the one before it (' + t('r=\\frac{t_2}{t_1}') + ') and subtract consecutive terms (' + t('d=t_2-t_1') + '). Whichever is constant decides the type.'], text: text });
  }
  /* geometric kinds (vals: first terms, r: ratio) */
  function geoKind(vals, r, nxt) {
    var d = qs(vals[1], vals[0]), arithNext = qa(vals[vals.length - 1], qs(vals[vals.length - 1], vals[vals.length - 2]));
    return { kind: 'ge', val: r, rCands: [[qv(d), 'u1l5-gave-d', 'That is ' + t('t_2-t_1') + '. The terms are <b>multiplied</b> each time: divide, ' + t('r=\\frac{t_2}{t_1}') + '.'], [1 / qv(r), 'u1l5-r-flip', 'Divide each term by the one <b>before</b> it: ' + t('r=\\frac{t_2}{t_1}') + '.']],
      next: nxt, nextCands: [[[qv(arithNext), 'u1l5-arith-next', 'The terms aren’t going up by the same amount: multiply the last term by ' + t('r') + '.']], [[qv(qa(nxt[0], d)), 'u1l5-arith-next', 'Multiply by ' + t('r') + ' again.']]],
      sol: 'Geometric: ' + ratioSol(vals, r) + ' (the same for every pair).<br>Next terms: ' + t(qTex(vals[vals.length - 1]) + '\\times ' + qTex(r, true) + '=' + dTex(nxt[0])) + ', ' + t(dTex(nxt[0]) + '\\times ' + qTex(r, true) + '=' + dTex(nxt[1])) + '.' };
  }
  function arKind(vals, dd) {
    var nxt = [qa(vals[2], dd), qa(vals[2], qm(qi(2), dd))];
    return { kind: 'ar', val: dd, rCands: [[qv(qd(vals[1], vals[0])), 'u1l5-gave-r', 'The ratios ' + t('\\frac{t_2}{t_1}') + ' and ' + t('\\frac{t_3}{t_2}') + ' aren’t equal, but the differences are: this sequence is arithmetic. Give ' + t('d') + '.']],
      next: nxt, nextCands: [[[qv(qm(vals[2], qd(vals[2], vals[1]))), 'u1l5-geo-next', 'This one is arithmetic: add ' + t('d') + ' to the last term.']], []],
      sol: 'Arithmetic: ' + t('d=' + qTex(vals[1]) + '-' + qTex(vals[0], qv(vals[0]) < 0) + '=' + qTex(dd)) + ' (the ratios are not equal).<br>Next terms: ' + t(qTex(nxt[0]) + ',\\ ' + qTex(nxt[1])) + '.' };
  }
  function Qd(x) { return Q(Math.round(x * 1000), 1000); }

  var QUESTIONS = [
    { num: '1', parts: [
      { id: '1', level: 'BEG', make: function (r) {
        var a = r.pick([3, 5, 6, 7, 9, 10]), d = a, b = 2 * a;
        return mcPart(r, 'The first two terms of a sequence are ' + t(a + ',\\ ' + b + ',\\ \\dots') + ' Is this enough information to decide whether the sequence is arithmetic or geometric?', [
          { html: 'No. It could be arithmetic (' + t('d=' + d) + ', next term ' + t(b + d) + ') or geometric (' + t('r=2') + ', next term ' + t(2 * b) + '). A third term is needed.', right: true },
          { html: 'Yes. It is arithmetic, because ' + t(b + '-' + a + '=' + d) + '.', why: 'Two terms always have a difference — and also a ratio, ' + t('\\frac{' + b + '}{' + a + '}=2') + '. Both types fit.' },
          { html: 'Yes. It is geometric, because ' + t('\\frac{' + b + '}{' + a + '}=2') + '.', why: 'The difference ' + t(d) + ' fits an arithmetic sequence just as well. You need a third term to tell.' },
          { html: 'No. A sequence needs at least five terms before its type can be decided.', why: 'Three terms are enough: they show whether the differences or the ratios stay the same.' }],
          'Two terms fit both types: ' + t(a + ',\\ ' + b + ',\\ ' + (b + d)) + ' (arithmetic, ' + t('d=' + d) + ') or ' + t(a + ',\\ ' + b + ',\\ ' + 2 * b) + ' (geometric, ' + t('r=2') + '). At least three terms are needed.', ['Write a possible third term for each type.'], 'two terms: not enough');
      } }] },
    { num: '2', shared: function (r) {
        var o = {};
        o.a = pickWhere(function () { return { a: r.int(2, 9), r: r.int(3, 5) }; }, function (z) { return !(z.a === 7 && z.r === 4) && !(z.a === 5 && z.r === 4) && z.a * Math.pow(z.r, 4) <= 6000; });
        o.b = pickWhere(function () { return { k: r.pick([2, 4, 5, 10]), c: r.int(1, 8) }; }, function (z) { return z.c * z.k * z.k * z.k <= 2000 && !(z.k === 5 && z.c === 8) && z.c % z.k !== 0; });
        o.c = pickWhere(function () { return { a: r.int(1, 9), e: r.int(1, 4), c: r.int(1, 3) }; }, function (z) { return !(z.a === 3 && z.e === 2 && z.c === 2); });
        o.d = pickWhere(function () { var f = r.pick([[1, 2, 16], [3, 2, 16], [2, 3, 81], [1, 3, 81]]); return { p: f[0], q: f[1], a: f[2] * r.int(1, f[2] === 81 ? 2 : 4) * r.pick([1, -1]) }; }, function (z) { return !(z.a === -81 && z.p === 2); });
        o.e = pickWhere(function () { return { a: r.int(8, 20), d: -r.int(3, 9) }; }, function (z) { return !(z.a === 12 && z.d === -8) && z.a + z.d !== 0 && z.a + 2 * z.d !== 0; });
        o.f = pickWhere(function () { return { c: r.int(1, 3), p: r.pick([2, 3, 5, 6, 7]) }; }, function (z) { return !(z.c === 1 && z.p === 5) && !(z.c === 2 && z.p === 2); });
        o.g = pickWhere(function () { return { L: r.pick(['m', 'x', 'k', 'y']), c: r.int(2, 6), e: r.int(1, 2), k: r.int(1, 3) }; }, function (z) { return !(z.c === 2 && z.L === 'm' && z.e === 1 && z.k === 2); });
        o.h = pickWhere(function () { return { a: r.pick([3, 5, 6, 7, 8, 9, 20, 30]), r: r.pick([[1, 10], [1, 10], [1, 2], [1, 5]]) }; }, function (z) { return !(z.a === 4 && z.r[1] === 10); });
        return o;
      },
      stem: 'Identify each sequence as arithmetic, geometric or neither. State ' + t('d') + ' or ' + t('r') + ' where there is one, and write the next two terms.',
      parts: [
        { id: '2t', sub: 'type', level: 'BEG', make: function (r, o) {
          var S = seqs2(o), rows = 'abcdefgh'.split('').map(function (k) { return { id: k, html: '(' + k + ') ' + t(S[k].tex) }; }), want = {};
          'abcdefgh'.split('').forEach(function (k) { want[k] = S[k].kind; });
          return B.grid('Identify each sequence as arithmetic, geometric or neither.', rows, [{ id: 'ar', html: 'Arithmetic' }, { id: 'ge', html: 'Geometric' }, { id: 'ne', html: 'Neither' }], want, { rowHead: 'Sequence' },
            'Arithmetic: the differences are constant ((e)). Geometric: the ratios ' + t('\\frac{t_{n}}{t_{n-1}}') + ' are constant ((a), (b), (d), (f), (g), (h)). Neither: (c), whose differences ' + t(S.c.diffs.join(',\\ ')) + ' change and whose ratios aren’t equal.', ['Check the differences and the ratios of consecutive terms.'], 'type of each sequence');
        } }].concat('abcdefgh'.split('').map(function (k) {
          return { id: '2' + k, sub: k, level: { a: 'BEG', b: 'BEG', c: 'EMG', d: 'EMG', e: 'BEG', f: 'PRG', g: 'PRG', h: 'EMG' }[k], make: function (r, o) { var s = seqs2(o)[k]; return nextPart(t(s.tex), s, 'r or d and next terms (' + k + ')'); } };
        })) },
    { num: '3', shared: function (r) { return pickWhere(function () { return { a: r.int(2, 9), k: r.pick([2, 3]) }; }, function (z) { return !(z.a === 3 && z.k === 2) && z.a * Math.pow(z.k, 5) <= 1500; }); },
      stem: function (o) { return 'A post is shared online. In the first hour ' + o.a + ' people share it, and in each hour after that ' + (o.k === 2 ? 'twice' : 'three times') + ' as many people share it as in the hour before.'; },
      parts: [
        { id: '3a', level: 'BEG', make: function (r, o) {
          var v = [1, 2, 3, 4, 5, 6].map(function (h) { return o.a * Math.pow(o.k, h - 1); });
          return fieldsPart('Write the number of shares in each of hours 1 to 6.', v.map(function (x, i) { return { label: 'Hour ' + (i + 1), name: 'hour ' + (i + 1), ans: x, cands: [[o.a + i * o.a * (o.k - 1), 'u1l5-arith-next', 'Each hour is ' + (o.k === 2 ? 'twice' : 'three times') + ' the hour before: <b>multiply</b> by ' + t(o.k) + '.']] }; }),
            { sol: t(v.join(',\\ ')) + ' (multiply by ' + t(o.k) + ' each hour).', hints: ['Multiply by ' + t(o.k) + ' to get each next hour.'], text: 'shares hours 1–6', bad: [v.map(function (x, i) { return String(o.a + i * o.a * (o.k - 1)); })] });
        } },
        { id: '3b', level: 'BEG', make: function (r, o) {
          return mcPart(r, 'Is the sequence arithmetic or geometric? State ' + t('d') + ' or ' + t('r') + '.', [
            { html: 'Geometric, ' + t('r=' + o.k), right: true }, { html: 'Arithmetic, ' + t('d=' + o.a * (o.k - 1)), why: 'The differences grow: ' + t(o.a * (o.k - 1) + ',\\ ' + o.a * o.k * (o.k - 1) + ',\\ \\dots') + '. The ratios are all ' + t(o.k) + '.' },
            { html: 'Geometric, ' + t('r=\\frac{1}{' + o.k + '}'), why: t('r') + ' is each term divided by the one <b>before</b>: ' + t('\\frac{' + o.a * o.k + '}{' + o.a + '}=' + o.k) + '.' }, { html: 'Arithmetic, ' + t('d=' + o.k), why: 'Adding ' + t(o.k) + ' each hour would give ' + t(o.a + ',\\ ' + (o.a + o.k) + ',\\ \\dots') + '. Here the terms are multiplied.' }],
            'Each term is ' + t(o.k) + ' times the one before: geometric, ' + t('r=' + o.k) + '.', ['Divide each term by the one before it.'], 'type and ratio');
        } },
        { id: '3c', level: 'EMG', make: function (r, o) {
          var v = [1, 2, 3, 4, 5, 6].map(function (h) { return o.a * Math.pow(o.k, h - 1); }), top = v[5], st = top > 400 ? 100 : top > 200 ? 50 : top > 100 ? 20 : 10, ym = Math.ceil(top / st) * st;
          var fig = '<div class="fig">' + HW.graph({ x: [0, 7], y: [0, ym], unitX: 34, unitY: 200 / ym, grid: 1, gridY: st, labels: 1, labelsY: st, xName: 'hour', yName: 'shares', firstQuadrant: true, points: v.map(function (y, i) { return { x: i + 1, y: y }; }), max: 300, aria: 'shares by hour' }) + '</div>';
          return mcPart(r, 'The points (hour, shares) are plotted below. Is the relationship linear?' + fig, [
            { html: 'No: the points curve upward more and more steeply (non-linear).', right: true },
            { html: 'Yes: the points lie on a straight line.', why: 'Look at the jumps between points: ' + t(v.slice(0, 4).join(',\\ ')) + ' — they get bigger each hour, so the points bend upward.' },
            { html: 'Yes: the shares go up by the same amount each hour.', why: 'They go up by ' + t((v[1] - v[0]) + ',\\ ' + (v[2] - v[1]) + ',\\ ' + (v[3] - v[2])) + ', … — not the same amount.' },
            { html: 'No: the points curve down towards zero.', why: 'The shares increase every hour, so the points rise.' }],
            'The increases ' + t((v[1] - v[0]) + ',\\ ' + (v[2] - v[1]) + ',\\ ' + (v[3] - v[2]) + ',\\ \\dots') + ' keep growing, so the points curve upward: a geometric sequence has a non-linear graph.', ['A straight line means equal increases.'], 'graph not linear');
        } },
        { id: '3d', level: 'EMG', make: function (r, o) {
          var t1 = qi(o.a), rr = qi(o.k);
          return gtPart('Write the general term.', gtFn(t1, rr), gtKey(t1, rr), { cands: gtC(t1, rr), sol: t('t_1=' + o.a + ',\\ r=' + o.k) + ', so ' + t('t_n=' + gtTex(t1, rr)) + '.', hints: HG, text: 'general term of the shares' });
        } }] },
    { num: '4', stem: 'Write the general term of each geometric sequence.', parts: [
      { id: '4a', level: 'BEG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 9), r: r.int(3, 6) }; }, function (z) { return !(z.a === 6 && z.r === 4) && !(z.a === 7 && z.r === 2); });
        return gt4(o.a, qi(o.r), 'general term, r > 1');
      } },
      { id: '4b', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { c: r.int(2, 9), k: r.int(2, 5) }; }, function (z) { return !(z.c === 5 && z.k === 4) && z.c % z.k !== 0; });
        return gt4(o.c * o.k * o.k, Q(1, o.k), 'general term, r a fraction');
      } },
      { id: '4c', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { a: -r.int(2, 9), r: -r.int(2, 4) }; }, function (z) { return !(z.a === -7 && z.r === -2) && !(z.a === -2 && z.r === -3); });
        return gt4(o.a, qi(o.r), 'general term, negative ratio');
      } },
      { id: '4d', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { t1: r.pick([Q(1, 2), Q(1, 3), Q(2, 3), Q(3, 4), Q(1, 4), Q(2, 5)]), r: -r.int(2, 4) }; }, function (z) { return !(z.t1[0] === 1 && z.t1[1] === 2 && z.r === -3); });
        return gt4(o.t1, qi(o.r), 'general term, fraction first term');
      } }] },
    { num: '5', parts: [
      { id: '5a', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { p: r.pick([2, 3, 5, 6, 7]), a: r.int(2, 4) }; }, function (z) { return Math.pow(z.p, z.a + 2) <= 20000 && !(z.p === 5 && z.a === 2) && !(z.p === 2 && z.a === 2); });
        var v = [0, 1, 2].map(function (k) { return Math.pow(o.p, o.a + k); }), key = o.p + '^{n+' + (o.a - 1) + '}';
        return gtPart('Write the general term of ' + t(seqTex(v)) + ' as a single power of ' + t(o.p) + '.', function (n) { return Math.pow(o.p, n + o.a - 1); }, key, { form: 'single', base: o.p,
          cands: gtC(qi(v[0]), qi(o.p)).concat([[function (n) { return Math.pow(o.p, n + o.a); }, 'u1l5-exp-add', 'Check at ' + t('n=1') + ': your power gives ' + t(nT(Math.pow(o.p, o.a + 1))) + ', not ' + t(v[0]) + '. Add the exponents of ' + t(o.p + '^{' + o.a + '}') + ' and ' + t(o.p + '^{n-1}') + '.'], [function (n) { return Math.pow(o.p, o.a * (n - 1)); }, 'u1l5-exp-mult', 'When powers of the same base are <b>multiplied</b>, add the exponents (don’t multiply them).']]),
          sol: t('t_n=' + v[0] + '(' + o.p + ')^{n-1}=' + o.p + '^{' + o.a + '}\\cdot ' + o.p + '^{n-1}=' + key) + '<br>(Check: ' + t('n=1') + ' gives ' + t(o.p + '^{' + o.a + '}=' + v[0]) + '.)', hints: ['Write ' + t(v[0]) + ' as a power of ' + t(o.p) + ', then use ' + t('a^m\\cdot a^n=a^{m+n}') + '.'], text: 'general term as a single power' });
      } },
      { id: '5b', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { p: r.pick([2, 3, 4, 5]), a: r.int(2, 3) }; }, function (z) { return !(z.p === 3 && z.a === 2); });
        var v = [0, 1, 2, 3].map(function (k) { return qp(qi(o.p), k - o.a); }), e = o.a + 1, key = o.p + '^{n-' + e + '}';
        return gtPart('Write the general term of ' + t(seqTex(v)) + ' as a single power of ' + t(o.p) + '.', function (n) { return Math.pow(o.p, n - e); }, key, { form: 'single', base: o.p,
          cands: gtC(v[0], qi(o.p)).concat([[function (n) { return Math.pow(o.p, n - o.a); }, 'u1l5-exp-add', 'Check at ' + t('n=1') + ': it should give ' + t(qTex(v[0])) + '. ' + t(qTex(v[0]) + '=' + o.p + '^{-' + o.a + '}') + ', so add ' + t('-' + o.a) + ' and ' + t('n-1') + '.']]),
          sol: t('t_n=' + qTex(v[0]) + '(' + o.p + ')^{n-1}=' + o.p + '^{-' + o.a + '}\\cdot ' + o.p + '^{n-1}=' + key) + '<br>(Check: ' + t('n=1') + ' gives ' + t(o.p + '^{-' + o.a + '}=' + qTex(v[0])) + '.)', hints: ['Write ' + t(qTex(v[0])) + ' as a power of ' + t(o.p) + ' with a negative exponent.'], text: 'single power, negative exponent' });
      } },
      { id: '5c', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 7), b: r.int(3, 6) }; }, function (z) { return !(z.a === 3 && z.b === 5); });
        var ab = o.a * o.b;
        return mcPart(r, 'Kai writes the general term of ' + t(seqTex([o.a, ab, ab * o.b])) + ' as ' + t('t_n=' + ab + '^{n-1}') + '. What is his error?', [
          { html: 'He multiplied ' + t(o.a + '\\times ' + o.b) + ' before applying the exponent. His formula gives ' + t('t_1=' + ab + '^0=1') + ', not ' + t(o.a) + '. Correct: ' + t('t_n=' + o.a + '(' + o.b + ')^{n-1}') + '.', right: true },
          { html: 'He should use the exponent ' + t('n') + ': ' + t('t_n=' + ab + '^{n}') + '.', why: 'That gives ' + t('t_1=' + ab) + ', still not ' + t(o.a) + '. The exponent applies only to the ratio ' + t(o.b) + '.' },
          { html: 'There is no error: ' + t(ab + '^{n-1}') + ' and ' + t(o.a + '(' + o.b + ')^{n-1}') + ' are equal.', why: 'Test ' + t('n=1') + ': ' + t(ab + '^{0}=1') + ' but ' + t(o.a + '(' + o.b + ')^{0}=' + o.a) + '.' },
          { html: 'The sequence is arithmetic, so ' + t('t_n=' + o.a + '+(n-1)' + (ab - o.a)) + '.', why: 'The ratios are all ' + t(o.b) + ' and the differences change: it is geometric.' }],
          'The exponent belongs to the ratio only. ' + t(ab + '^{n-1}') + ' gives ' + t('t_1=1') + '. Correct: ' + t('t_n=' + o.a + '(' + o.b + ')^{n-1}') + '.', ['Test his formula at ' + t('n=1') + '.'], 'error: multiplied t1 by r');
      } }] },
    { num: '6', stem: 'Determine the exact value of the indicated term.', parts: [
      { id: '6a', level: 'BEG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 9), r: r.int(2, 4), n: r.int(8, 11) }; }, function (z) { return z.a * Math.pow(z.r, z.n - 1) <= 1e6 && !(z.a === 4 && z.r === 3 && z.n === 10) && !(z.a === 7 && z.r === 2 && z.n === 12); });
        return term6(qi(o.a), qi(o.r), o.n, 'exact term, whole ratio');
      } },
      { id: '6b', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { var j = r.int(3, 6); return { c: r.pick([3, 5, 7, 9]), j: j, n: j + r.int(3, 6) }; }, function (z) { return !(z.c === 5 && z.j === 5 && z.n === 12) && z.c * Math.pow(2, z.j) <= 600; });
        return term6(qi(o.c * Math.pow(2, o.j)), Q(1, 2), o.n, 'exact term, ratio 1/2');
      } },
      { id: '6c', level: 'PRG', make: function (r) {
        var o = r.chance(0.5) ? pickWhere(function () { return { t1: Q(r.pick([1, 2, 4, 5]), 3), r: -3, n: r.int(7, 9) }; }, function (z) { return !(z.t1[0] === 2 && z.n === 9); }) : { t1: Q(r.pick([1, 3, 5]), 2), r: -2, n: r.int(9, 12) };
        return term6(o.t1, qi(o.r), o.n, 'exact term, fraction first term, negative ratio');
      } },
      { id: '6d', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { var rr = r.pick([2, 4]); return { t1: r.pick([Q(1, 2), Q(1, 4), Q(3, 2), Q(5, 2), Q(3, 4)]), r: rr, n: rr === 2 ? r.int(10, 15) : r.int(6, 9) }; }, function (z) { return !(z.t1[0] === 1 && z.t1[1] === 2 && z.r === 2 && z.n === 15) && isInt(qv(gv(z.t1, qi(z.r), z.n))) && qv(gv(z.t1, qi(z.r), z.n)) <= 1e6; });
        return term6(o.t1, qi(o.r), o.n, 'exact term, decimal first term', true);
      } }] },
    { num: '7', stem: 'Determine the number of terms in each sequence.', parts: [
      { id: '7a', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 9), r: r.int(3, 4), n: r.int(6, 9) }; }, function (z) { return z.a * Math.pow(z.r, z.n - 1) <= 99999 && !(z.a === 5 && z.r === 3 && z.n === 8) && !(z.a === 2 && z.r === 3 && z.n === 10); });
        return nTerms(qi(o.a), qi(o.r), o.n, 'number of terms, r > 1');
      } },
      { id: '7b', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: -r.int(2, 5), n: r.int(8, 12) }; }, function (z) { return !(z.a === -3 && z.n === 11); });
        return nTerms(qi(o.a), qi(-2), o.n, 'number of terms, negative ratio');
      } },
      { id: '7c', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { var b = r.pick([2, 3, 4, 5]); return { b: b, j: r.int(3, 7), m: r.int(1, 3) }; }, function (z) { return Math.pow(z.b, z.j) <= 5000 && !(z.b === 4 && z.j === 6 && z.m === 2); });
        return nTerms(qi(Math.pow(o.b, o.j)), Q(1, o.b), o.j + o.m + 1, 'number of terms, fraction ratio');
      } }] },
    { num: '8', parts: [
      { id: '8a', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { N: 2 * r.int(3, 6) + 1, a: r.int(2, 7), r: r.int(2, 3) }; }, function (z) { return z.a * Math.pow(z.r, (z.N - 1) / 2) <= 100000 && !(z.N === 11 && z.a === 3 && z.r === 2); });
        var m = (o.N + 1) / 2, v = o.a * Math.pow(o.r, m - 1);
        return numPart('A geometric sequence has ' + o.N + ' terms, ' + t('t_1=' + o.a) + ' and ' + t('r=' + o.r) + '. Determine the middle term.', v, { cands: termC(qi(o.a), qi(o.r), m).concat([[o.a * Math.pow(o.r, o.N - 1), 'u1l5-last', 'That is the last term. The middle of ' + o.N + ' terms is ' + t('t_{' + m + '}') + '.']]),
          sol: 'The middle of ' + o.N + ' terms is ' + t('t_{' + m + '}') + ' (' + (m - 1) + ' terms on each side): ' + t('t_{' + m + '}=' + o.a + '(' + o.r + ')^{' + (m - 1) + '}=' + nT(v)) + '.', hints: ['Which position is in the middle of ' + o.N + ' terms?'], text: 'middle term' });
      } },
      { id: '8b', level: 'BEG', make: function (r) {
        var k = r.pick([3, 4, 6, 7, 8, 9]);
        return numPart(word(k) + ' geometric means are placed between two numbers. How many terms does the sequence have?', k + 2, { after: 'terms', cands: [[k + 1, 'u1l5-means-count', 'Count the two given numbers too: the means are <b>between</b> them.'], [k, 'u1l5-means-count', 'Add the two given numbers at the ends.']],
          sol: 'The ' + k + ' means plus the 2 given numbers: ' + t(k + '+2=' + (k + 2)) + ' terms.', hints: ['The means sit between the two given numbers.'], text: 'terms from number of means' });
      } }] },
    { num: '9', stem: 'Two terms of a geometric sequence are given. Determine ' + t('r') + ', ' + t('t_1') + ' and the general term.', parts: [
      { id: '9a', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { var p = r.pick([2, 3]); return { p: p, q: p + 3, r: -r.int(2, 4), a: r.pick([1, 2, 3, 4, 5, -1, -2, -3]) }; }, function (z) { return Math.abs(z.a * Math.pow(z.r, z.q - 1)) <= 1e5 && !(z.p === 2 && z.a === 2 && z.r === -3) && !(z.p === 3 && z.a === 3 && z.r === -2); });
        return twoTerms(qi(o.a), qi(o.r), o.p, o.q, 'r, t1, t_n from two terms (negative r)');
      } },
      { id: '9b', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { var p = r.pick([3, 4]); return { p: p, q: p + 3, k: r.int(2, 3), c: r.int(2, 9) }; }, function (z) { return z.c * Math.pow(z.k, z.q - 1) <= 20000 && !(z.p === 4 && z.k === 2 && z.c === 5); });
        return twoTerms(qi(o.c * Math.pow(o.k, o.q - 1)), Q(1, o.k), o.p, o.q, 'r, t1, t_n from two terms (fraction r)');
      } }] },
    { num: '10', parts: [
      { id: '10a', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { c: r.int(1, 4), k: r.int(2, 4) }; }, function (z) { return z.c * Math.pow(z.k, 5) <= 1e5 && !(z.c === 2 && z.k === 5); });
        var t3 = o.c * o.k * o.k, t5 = t3 * o.k * o.k, t6 = t5 * o.k;
        return fieldsPart('In a geometric sequence ' + t('t_3=' + nT(t3)) + ' and ' + t('t_5=' + nT(t5)) + '. Determine ' + t('t_1') + ' and the two possible values of ' + t('t_6') + '.', [
          { label: t('t_1='), name: 't₁', ans: o.c, cands: [[t3 / o.k, 'u1l5-t1-power', t('t_3=t_1r^{2}') + ', so divide ' + t('t_3') + ' by ' + t('r^{2}') + '.']] },
          { label: t('t_6') + ' (for ' + t('r>0') + ')', name: 't₆ (r > 0)', ans: t6, cands: [[t5 * o.k * o.k, 'u1l5-rn', t('t_6=t_5\\cdot r') + '.']] },
          { label: t('t_6') + ' (for ' + t('r<0') + ')', name: 't₆ (r < 0)', ans: -t6, cands: [[t6, 'u1l5-one-sign', 'With ' + t('r=-' + o.k) + ', ' + t('r^{5}') + ' is negative.']] }],
          { sol: t(rFromTwo(qi(t3), qi(t5), 3, 5) + '\\Rightarrow r=\\pm ' + o.k) + '<br>' + t('t_1r^{2}=' + nT(t3) + '\\Rightarrow t_1=' + nT(t3) + '\\div ' + o.k * o.k + '=' + o.c) + ' (for both).<br>' + t('r=' + o.k + ':\\ t_6=' + o.c + '(' + o.k + ')^{5}=' + nT(t6)) + '; ' + t('r=-' + o.k + ':\\ t_6=' + o.c + '(-' + o.k + ')^{5}=' + nT(-t6)),
            hints: ['Divide the two terms: ' + t('t_1') + ' cancels and ' + t('r^{2}') + ' is left. An even power has two square roots.'], text: 't1 and two values of t6' });
      } },
      { id: '10b1', sub: 'b', level: 'EMG', make: function (r) {
        var o = q10b(r);
        return mcPart(r, 'In a geometric sequence ' + t('t_2=' + o.c) + ' and ' + t('t_6=' + qTex(o.t6)) + '. Why are there two possible sequences?', [
          { html: t('r^{4}=\\frac{t_6}{t_2}=' + qTex(qd(o.t6, qi(o.c)))) + ' is an <b>even</b> power, so ' + t('r=\\frac{1}{' + o.k + '}') + ' or ' + t('r=-\\frac{1}{' + o.k + '}') + ': both give a valid sequence.', right: true },
          { html: 'Because ' + t('t_2') + ' is positive, ' + t('t_1') + ' can be positive or negative.', why: 'The sign of ' + t('t_1') + ' follows from ' + t('r') + '. The reason is the even power ' + t('r^{4}') + '.' },
          { html: 'Because the terms get smaller, ' + t('r') + ' could be a fraction or a whole number.', why: 'Getting smaller means ' + t('|r|<1') + '. The two answers come from ' + t('r^{4}') + ' having a positive and a negative root.' },
          { html: 'There aren’t two sequences: ' + t('r=\\frac{1}{' + o.k + '}') + ' is the only possibility.', why: 'Check ' + t('r=-\\frac{1}{' + o.k + '}') + ': ' + t('\\left(-\\frac{1}{' + o.k + '}\\right)^{4}') + ' is also ' + t('\\frac{1}{' + Math.pow(o.k, 4) + '}') + '.' }],
          t('\\frac{t_1r^{5}}{t_1r}=r^{4}=' + qTex(qd(o.t6, qi(o.c)))) + '. An even power has two real roots, ' + t('r=\\pm\\frac{1}{' + o.k + '}') + ', and both work.', ['Divide the two terms. What power of ' + t('r') + ' is left?'], 'why two sequences');
        } },
      { id: '10b2', sub: 'b, terms', level: 'ADV', make: function (r) {
        var o = q10b(r), pos = [qi(o.c * o.k), qi(o.c), Q(o.c, o.k), Q(o.c, o.k * o.k)], neg = [qi(-o.c * o.k), qi(o.c), Q(-o.c, o.k), Q(o.c, o.k * o.k)];
        return fieldsPart('In a geometric sequence ' + t('t_2=' + o.c) + ' and ' + t('t_6=' + qTex(o.t6)) + '. Write the first four terms of each possible sequence (separate them with commas).', [
          listField('With ' + t('r>0') + ':', pos, { name: 'r > 0' }), listField('With ' + t('r<0') + ':', neg, { name: 'r < 0' })],
          { sol: t('r^{4}=' + qTex(qd(o.t6, qi(o.c))) + '\\Rightarrow r=\\pm\\frac{1}{' + o.k + '}') + '.<br>' + t('r=\\frac{1}{' + o.k + '}') + ': ' + t(listTex(pos)) + '<br>' + t('r=-\\frac{1}{' + o.k + '}') + ': ' + t(listTex(neg)) + ' (' + t('t_1=t_2\\div r') + ').', hints: ['Find ' + t('t_1=t_2\\div r') + ' for each value of ' + t('r') + ', then multiply by ' + t('r') + '.'], text: 'two sequences, first four terms' });
      } }] },
    { num: '11', stem: 'Insert the geometric means. Give all possible answers.', parts: [
      { id: '11a', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 5), k: r.int(2, 4) }; }, function (z) { return z.a * Math.pow(z.k, 4) <= 1300 && !(z.a === 2 && z.k === 3) && !(z.a === 5 && z.k === 3); });
        var b = o.a * Math.pow(o.k, 4), pos = [1, 2, 3].map(function (i) { return o.a * Math.pow(o.k, i); }), neg = [1, 2, 3].map(function (i) { return o.a * Math.pow(-o.k, i); });
        return fieldsPart('Three means between ' + t(o.a) + ' and ' + t(nT(b)) + '.', [listField('With ' + t('r>0') + ':', pos, { name: 'r > 0' }), listField('With ' + t('r<0') + ':', neg, { name: 'r < 0' })],
          { sol: '5 terms: ' + t('t_1=' + o.a + ',\\ t_5=' + nT(b)) + '. ' + t(o.a + 'r^{4}=' + nT(b) + '\\Rightarrow r^{4}=' + Math.pow(o.k, 4) + '\\Rightarrow r=\\pm ' + o.k) + '.<br>' + t('r=' + o.k) + ': ' + t(listTex(pos)) + '; ' + t('r=-' + o.k) + ': ' + t(listTex(neg)) + '.', hints: ['Three means plus the two numbers make 5 terms, so ' + t(nT(b) + '=' + o.a + 'r^{4}') + '.'], text: 'three geometric means (two answers)' });
      } },
      { id: '11b', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { var k = r.int(2, 3); return { k: k, c: k === 2 ? r.int(1, 9) : r.int(1, 3) }; }, function (z) { return !(z.k === 3 && z.c === 2); });
        var a = o.c * Math.pow(o.k, 5), means = [1, 2, 3, 4].map(function (i) { return o.c * Math.pow(o.k, 5 - i); });
        return fieldsPart('Four means between ' + t(nT(a)) + ' and ' + t(o.c) + '.', [listField('Means:', means, { name: 'means' })],
          { sol: '6 terms: ' + t(nT(a) + 'r^{5}=' + o.c + '\\Rightarrow r^{5}=\\frac{1}{' + Math.pow(o.k, 5) + '}\\Rightarrow r=\\frac{1}{' + o.k + '}') + ' (an odd power: one real root).<br>Means: ' + t(listTex(means)) + '.', hints: ['Four means plus the two numbers make 6 terms: ' + t(o.c + '=' + nT(a) + 'r^{5}') + '.'], text: 'four geometric means' });
      } },
      { id: '11c', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { c: r.int(1, 5), m: r.int(1, 5), n: r.int(2, 6) }; }, function (z) { return z.m !== z.n && gcd(z.m, z.n) === 1 && !(z.c === 7) && !(z.c === 1 && z.m === 1) && z.c * z.n * z.n <= 150; });
        var a = o.c * o.m * o.m, b = o.c * o.n * o.n, g = o.c * o.m * o.n;
        return fieldsPart('One mean between ' + t(a) + ' and ' + t(b) + '.', [listField('Possible means:', [g, -g], { name: 'means', any: true })],
          { sol: '3 terms: ' + t(a + 'r^{2}=' + b + '\\Rightarrow r^{2}=' + qTex(Q(b, a)) + '\\Rightarrow r=\\pm ' + qTex(Q(o.n, o.m))) + '.<br>The mean is ' + t(g) + ' or ' + t(-g) + '. (Check: ' + t(g + '^{2}=' + a + '\\times ' + b) + '.)', hints: ['One mean makes 3 terms. Remember both square roots.'], text: 'one geometric mean (two answers)', bad: [[String(g)]] });
      } }] },
    { num: '12', stem: 'Each set of expressions gives three consecutive terms of a geometric sequence. Determine ' + t('x') + ' and the terms.', parts: [
      { id: '12a', level: 'PRG', make: function (r) { return exprLin(r, function (z) { return !(z.x === 10 && z.A === 6) && !(z.x === 2 && z.A === 3); }, 'expressions: linear equation'); } },
      { id: '12b', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { var m = r.int(2, 4), L = m === 2 ? 3 : m === 3 ? 4 : 15; return { m: m, c: L * r.int(1, m === 4 ? 1 : 4) }; }, function (z) { return !(z.m === 2 && z.c === 6) && !(z.m === 3 && z.c === 4); });
        var m = o.m, c = o.c, k = m * m, x1 = c / (m - 1), x2 = -c / (m + 1), T = function (x) { return [x, x + c, k * x]; };
        var A = k - 1, Bq = -2 * c, C = -c * c, g = gcd(gcd(A, Math.abs(Bq)), C);
        return fieldsPart(t('x,\\ x+' + c + ',\\ ' + k + 'x'), [
          listField('Values of ' + t('x') + ':', [x1, x2], { name: 'x', any: true }), listField('Terms for the larger ' + t('x') + ':', T(x1), { name: 'terms (larger x)' }), listField('Terms for the smaller ' + t('x') + ':', T(x2), { name: 'terms (smaller x)' })],
          { sol: t('(x+' + c + ')^{2}=x(' + k + 'x)') + '<br>' + t('x^{2}+' + 2 * c + 'x+' + c * c + '=' + k + 'x^{2}\\Rightarrow ' + A + 'x^{2}-' + 2 * c + 'x-' + c * c + '=0') + '<br>Divide by ' + t(A) + ': ' + t('x^{2}-' + (2 * c / A === 1 ? '' : 2 * c / A) + 'x-' + c * c / A + '=0\\Rightarrow (x-' + nT(x1) + ')(x+' + nT(-x2) + ')=0') + ', so ' + t('x=' + nT(x1)) + ' or ' + t('x=' + nT(x2)) + '.<br>' + t('x=' + nT(x1)) + ': ' + t(listTex(T(x1))) + ', ' + t('r=' + m) + '; ' + t('x=' + nT(x2)) + ': ' + t(listTex(T(x2))) + ', ' + t('r=-' + m) + '.',
            hints: ['Consecutive terms ' + t('a,\\ b,\\ c') + ' of a geometric sequence have ' + t('b^{2}=ac') + '.', 'This gives a quadratic: two values of ' + t('x') + '.'], text: 'expressions: quadratic, two answers' });
      } }] },
    { num: '13', parts: [
      { id: '13', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { var rr = r.pick([2, 2, 3]), p = r.int(2, 3), g = rr === 2 ? 3 : 2, R = Math.pow(rr, g); return { r: rr, p: p, q: p + g, R: R, y: r.int(4, 14), a: r.int(1, 5), b: r.int(2, R - 1) }; },
          function (z) { return z.y - z.a > 0 && z.R * (z.y - z.a) - z.b * z.y !== 0 && !(z.y === 10 && z.a === 1 && z.r === 2 && z.p === 3); });
        var tp = o.y - o.a, tq = o.R * tp, c = tq - o.b * o.y, t1 = Q(tp, Math.pow(o.r, o.p - 1)), last = o.q + 2, tl = tq * o.r * o.r;
        return fieldsPart('In a geometric sequence with ' + t('r=' + o.r) + ', the ' + ord(o.p) + ' term is ' + t('y-' + o.a) + ' and the ' + ord(o.q) + ' term is ' + t(o.b + 'y' + (c < 0 ? '-' : '+') + Math.abs(c)) + '. Determine ' + t('y') + ', then ' + t('t_1') + ' and ' + t('t_{' + last + '}') + '.', [
          { label: t('y='), name: 'y', ans: o.y }, { label: t('t_1='), name: 't₁', ans: t1, math: true, cands: [[qv(t1) * o.r, 'u1l5-t1-power', 'Divide ' + t('t_{' + o.p + '}') + ' by ' + t('r^{' + (o.p - 1) + '}') + ' (it is ' + (o.p - 1) + ' steps after ' + t('t_1') + ').']] }, { label: t('t_{' + last + '}='), name: 't_' + last, ans: tl }],
          { sol: t('t_{' + o.q + '}=t_{' + o.p + '}r^{' + (o.q - o.p) + '}') + ': ' + t(o.b + 'y' + (c < 0 ? '-' : '+') + Math.abs(c) + '=' + o.R + '(y-' + o.a + ')\\Rightarrow ' + o.b + 'y' + (c < 0 ? '-' : '+') + Math.abs(c) + '=' + o.R + 'y-' + o.R * o.a + '\\Rightarrow y=' + o.y) + '<br>' + t('t_{' + o.p + '}=' + tp + ',\\ t_{' + o.q + '}=' + tq) + '; ' + t('t_1=' + tp + '\\div ' + o.r + '^{' + (o.p - 1) + '}=' + qTex(t1)) + '; ' + t('t_{' + last + '}=' + tq + '(' + o.r + ')^{2}=' + nT(tl)),
            hints: ['The ' + ord(o.q) + ' term is ' + t('r^{' + (o.q - o.p) + '}') + ' times the ' + ord(o.p) + ' term: write that as an equation in ' + t('y') + '.'], text: 'expressions in y with given r' });
      } }] },
    { num: '14', parts: [
      { id: '14', level: 'BEG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 9), b: r.int(2, 5) }; }, function (z) { return !(z.a === 5 && z.b === 3) && z.a !== z.b; });
        return mcPart(r, '<i>(Multiple Choice)</i> The general term of the sequence ' + t(seqTex([o.a, -o.a * o.b, o.a * o.b * o.b])) + ' is', [
          { html: t('t_n=' + o.a + '(-' + o.b + ')^{n-1}'), right: true }, { html: t('t_n=' + o.a + '(' + o.b + ')^{n-1}'), why: 'The signs alternate, so the ratio is negative: ' + t('r=\\frac{' + (-o.a * o.b) + '}{' + o.a + '}=-' + o.b) + '.' },
          { html: t('t_n=-' + o.b + '(' + o.a + ')^{n-1}'), why: 'You swapped ' + t('t_1') + ' and ' + t('r') + '.' }, { html: t('t_n=(-' + o.a * o.b + ')^{n-1}'), why: 'Don’t multiply ' + t('t_1') + ' by ' + t('r') + ' first: this gives ' + t('t_1=1') + '.' }],
          t('t_1=' + o.a) + ' and ' + t('r=\\frac{' + (-o.a * o.b) + '}{' + o.a + '}=-' + o.b) + ', so ' + t('t_n=' + o.a + '(-' + o.b + ')^{n-1}') + '.', HG, 'MC: general term');
      } }] },
    { num: '15', parts: [
      { id: '15', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 8), r: r.int(2, 4) }; }, function (z) { return !(z.a === 6 && z.r === 3) && z.a * Math.pow(z.r, 7) <= 200000; });
        var t4 = o.a * Math.pow(o.r, 3), t7 = o.a * Math.pow(o.r, 6);
        return mcPart(r, '<i>(Multiple Choice)</i> In a geometric sequence ' + t('t_1=' + o.a) + ' and ' + t('t_4=' + nT(t4)) + '. The value of ' + t('t_7') + ' is', [
          { html: t(nT(t7)), right: true }, { html: t(nT(2 * t4 - o.a)), why: 'That treats it as arithmetic. Divide: ' + t('r^{3}=\\frac{' + nT(t4) + '}{' + o.a + '}') + '.' },
          { html: t(nT(o.a * Math.pow(o.r, 5))), why: t('t_7=t_1r^{6}') + ' (the exponent is ' + t('7-1') + ').' }, { html: t(nT(o.a * Math.pow(o.r, 7))), why: t('t_7=t_1r^{6}') + ', not ' + t('r^{7}') + '.' }],
          t('r^{3}=\\frac{' + nT(t4) + '}{' + o.a + '}=' + Math.pow(o.r, 3) + '\\Rightarrow r=' + o.r) + '; ' + t('t_7=' + o.a + '(' + o.r + ')^{6}=' + nT(t7)), HT, 'MC: t7 from t1 and t4');
      } }] },
    { num: '16', parts: [
      { id: '16', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 5), r: r.int(3, 4), n: r.int(7, 11) }; }, function (z) { return z.a * Math.pow(z.r, z.n - 1) <= 3e6 && !(z.a === 2 && z.r === 3 && z.n === 10); });
        var last = o.a * Math.pow(o.r, o.n - 1);
        return numPart('<i>(Numerical Response)</i> The number of terms in the sequence ' + t(o.a + ',\\ ' + o.a * o.r + ',\\ ' + o.a * o.r * o.r + ',\\ \\dots,\\ ' + nT(last)) + ' is ______.', o.n, { nr: true, cands: nC(o.n), sol: nTermsSol(qi(o.a), qi(o.r), o.n), hints: HNT, text: 'NR: number of terms' });
      } }] },
    { num: '17', parts: [
      { id: '17', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { var a = r.int(-3, 6), b = a + r.int(1, 6), c = b + r.int(2, 12); return { a: a, b: b, c: c }; }, function (z) {
          var den = 2 * z.b - z.a - z.c; if (!den) return false; var x = (z.a * z.c - z.b * z.b) / den, t1 = x + z.a; if (t1 <= 0 || !isInt(x * 2)) return false;
          var rr = (x + z.b) / t1, t4 = (x + z.c) * rr, s = String(cl(t4)); return rr > 1 && isInt(t4 * 10) && t4 > 0 && s.length <= 4 && !(z.a === 2 && z.b === 5 && z.c === 14) && !(z.a === 1 && z.b === 4 && z.c === 10);
        });
        var den = 2 * o.b - o.a - o.c, x = (o.a * o.c - o.b * o.b) / den, T = [x + o.a, x + o.b, x + o.c], rr = T[1] / T[0], t4 = cl(T[2] * rr);
        var ex1 = function (k) { return 'x' + (k < 0 ? '-' : '+') + Math.abs(k); };
        return numPart('<i>(Numerical Response)</i> The expressions ' + t(ex1(o.a)) + ', ' + t(ex1(o.b)) + ' and ' + t(ex1(o.c)) + ' are the first three terms of a geometric sequence. The value of ' + t('t_4') + ' is ______.', t4, { nr: true,
          cands: [[x, 'u1l5-gave-x', 'That is ' + t('x') + '. Use it to find the terms and ' + t('r') + ', then ' + t('t_4=t_3r') + '.'], [T[2], 'u1l5-gave-t3', 'That is ' + t('t_3') + '. Multiply by ' + t('r') + '.']],
          sol: t('(' + ex1(o.b) + ')^{2}=(' + ex1(o.a) + ')(' + ex1(o.c) + ')') + '<br>' + t('x^{2}' + (2 * o.b < 0 ? '-' : '+') + Math.abs(2 * o.b) + 'x+' + o.b * o.b + '=x^{2}' + (o.a + o.c < 0 ? '-' : '+') + Math.abs(o.a + o.c) + 'x' + (o.a * o.c < 0 ? '-' : '+') + Math.abs(o.a * o.c) + '\\Rightarrow x=' + nT(x)) + '<br>Terms ' + t(T.map(nT).join(',\\ ')) + ', so ' + t('r=' + nT(rr)) + ' and ' + t('t_4=' + nT(T[2]) + '(' + nT(rr) + ')=' + nT(t4)) + '.', hints: [t('b^{2}=ac') + ' for consecutive terms ' + t('a,\\ b,\\ c') + '.'], text: 'NR: expressions, t4' });
      } }] }
  ];
  function word(k) { return ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'][k] || String(k); }
  function ord(n) { return n + (n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th'); }
  /* Q2: the eight sequences */
  function seqs2(o) {
    var S = {}, a = o.a, b = o.b, c = o.c, d = o.d, e = o.e, f = o.f, g = o.g, h = o.h;
    var va = [0, 1, 2].map(function (k) { return qi(a.a * Math.pow(a.r, k)); });
    S.a = geoKind(va, qi(a.r), [qi(a.a * Math.pow(a.r, 3)), qi(a.a * Math.pow(a.r, 4))]); S.a.tex = seqTex(va);
    var vb = [3, 2, 1].map(function (k) { return qi(b.c * Math.pow(b.k, k)); });
    S.b = geoKind(vb, Q(1, b.k), [qi(b.c), Q(b.c, b.k)]); S.b.tex = seqTex(vb);
    var vc = [c.a], df = []; for (var i = 0; i < 6; i++) { df.push(c.e + i * c.c); vc.push(vc[i] + c.e + i * c.c); }
    S.c = { kind: 'ne', diffs: df.slice(0, 4), next: [qi(vc[5]), qi(vc[6])], nextCands: [[[vc[4] + df[3], 'u1l5-arith-next', 'The differences grow by ' + t(c.c) + ' each time: the next difference is ' + t(df[4]) + '.']], []],
      sol: 'Neither: the differences are ' + t(df.slice(0, 4).join(',\\ ')) + ' (not constant) and the ratios aren’t equal.<br>The differences grow by ' + t(c.c) + ', so the next differences are ' + t(df[4]) + ' and ' + t(df[5]) + ': ' + t(vc[5] + ',\\ ' + vc[6]) + '.', hints: ['Check the differences. If they aren’t constant, look for a pattern in the differences themselves.'] };
    S.c.tex = seqTex(vc.slice(0, 5));
    var rd_ = Q(-d.p, d.q), vd = [0, 1, 2].map(function (k) { return qm(qi(d.a), qp(rd_, k)); });
    S.d = geoKind(vd, rd_, [qm(qi(d.a), qp(rd_, 3)), qm(qi(d.a), qp(rd_, 4))]); S.d.tex = seqTex(vd);
    var ve = [0, 1, 2].map(function (k) { return qi(e.a + k * e.d); });
    S.e = arKind(ve, qi(e.d)); S.e.tex = seqTex(ve);
    var fc = f.c, fp = f.p;
    S.f = { kind: 'ge', keys: 'radical', rCheck: radCheck(1, fp), rKey: '\\sqrt{' + fp + '}', rTex: '\\sqrt{' + fp + '}', next: [0, 0], nextCheck: [exact(fc * fp * fp), radCheck(fc * fp * fp, fp)], nextKey: [String(fc * fp * fp), radTex(fc * fp * fp, fp)], nextTex: [nT(fc * fp * fp), radTex(fc * fp * fp, fp)],
      sol: 'Geometric: ' + t('r=\\frac{' + fc * fp + '}{' + radTex(fc, fp) + '}=\\sqrt{' + fp + '}') + ' (each term is ' + t('\\sqrt{' + fp + '}') + ' times the one before).<br>Next terms: ' + t(radTex(fc * fp, fp) + '\\times\\sqrt{' + fp + '}=' + fc * fp * fp) + ', ' + t(fc * fp * fp + '\\sqrt{' + fp + '}') + '.' };
    S.f.tex = radTex(fc, fp) + ',\\ ' + fc * fp + ',\\ ' + radTex(fc * fp, fp) + ',\\ \\dots';
    var L = g.L, gt = [0, 1, 2, 3, 4].map(function (k) { return mono(g.c, L, g.e + k * g.k); }), rT = mono(1, L, g.k);
    S.g = { kind: 'ge', keys: 'expo', vars: [L], rCheck: K.expo(rT, {}), rKey: rT, rTex: rT, next: [0, 0], nextCheck: [K.expo(gt[3], {}), K.expo(gt[4], {})], nextKey: [gt[3], gt[4]], nextTex: [gt[3], gt[4]],
      sol: 'Geometric: ' + t('r=\\frac{' + gt[1] + '}{' + gt[0] + '}=' + rT) + '.<br>Next terms: ' + t(gt[3]) + ', ' + t(gt[4]) + ' (multiply by ' + t(rT) + ': add ' + t(g.k) + ' to the exponent).', hints: ['Divide each term by the one before: subtract the exponents.'] };
    S.g.tex = gt.slice(0, 3).join(',\\ ') + ',\\ \\dots';
    var hr = Q(h.r[0], h.r[1]), vh = [0, 1, 2].map(function (k) { return qm(Q(h.a, 10), qp(hr, k)); });
    S.h = geoKind(vh, hr, [qm(Q(h.a, 10), qp(hr, 3)), qm(Q(h.a, 10), qp(hr, 4))]); S.h.tex = vh.map(dTex).join(',\\ ') + ',\\ \\dots';
    S.h.sol = 'Geometric: ' + t('r=\\frac{' + dTex(vh[1]) + '}{' + dTex(vh[0]) + '}=' + dTex(hr)) + '.<br>Next terms: ' + t(dTex(S.h.next[0])) + ', ' + t(dTex(S.h.next[1])) + '.';
    return S;
  }
  function gt4(a, rr, text) {
    var t1 = Array.isArray(a) ? a : qi(a), v = [1, 2, 3].map(function (n) { return gv(t1, rr, n); });
    return gtPart(t(seqTex(v)), gtFn(t1, rr), gtKey(t1, rr), { cands: gtC(t1, rr), sol: t('t_1=' + qTex(t1)) + ', ' + ratioSol(v, rr) + ', so ' + t('t_n=' + gtTex(t1, rr)) + '.', hints: HG, text: text });
  }
  function term6(t1, rr, n, text, decs) {
    var v = [1, 2, 3].map(function (k) { return gv(t1, rr, k); }), ans = gv(t1, rr, n), X = decs ? dTex : qTex;
    return numPart(t(v.map(X).join(',\\ ') + ',\\ \\dots') + '; ' + t('t_{' + n + '}'), ans, { cands: termC(t1, rr, n), before: t('t_{' + n + '}='),
      sol: t('r=' + qTex(rr)) + '; ' + t('t_{' + n + '}=' + X(t1) + (rr[1] !== 1 || qv(rr) < 0 ? rB(rr) : '(' + qTex(rr) + ')') + '^{' + (n - 1) + '}=' + X(t1) + '(' + qTex(qp(rr, n - 1)) + ')=' + qTex(ans)) + (dec(ans) != null && ans[1] !== 1 ? ' ' + t('(=' + dec(ans) + ')') : ''), hints: HT, text: text });
  }
  function nTerms(t1, rr, n, text) {
    var v = [1, 2, 3].map(function (k) { return gv(t1, rr, k); }), last = gv(t1, rr, n);
    return numPart(t(v.map(function (x) { return qTex(x); }).join(',\\ ') + ',\\ \\dots,\\ ' + qTex(last)), n, { after: 'terms', cands: nC(n), sol: t('t_1=' + qTex(t1) + ',\\ r=' + qTex(rr)) + '<br>' + nTermsSol(t1, rr, n) + ' terms', hints: HNT, text: text });
  }
  function twoTerms(t1, rr, p, q, text) {
    var tp = gv(t1, rr, p), tq = gv(t1, rr, q), g = q - p, rg = qp(rr, g);
    return fieldsPart(t('t_' + p + '=' + qTex(tp) + ',\\quad t_' + q + '=' + qTex(tq)), [
      { label: t('r='), name: 'r', ans: rr, math: true, keys: 'expo', vars: ['n'], cands: [[qv(rg), 'u1l5-r-power', 'That is ' + t('r^{' + g + '}') + '. Take the ' + (g === 3 ? 'cube' : g + 'th') + ' root.'], [1 / qv(rr), 'u1l5-r-flip', 'Divide the <b>later</b> term by the earlier one.']] },
      { label: t('t_1='), name: 't₁', ans: t1, math: true, keys: 'expo', vars: ['n'], cands: [[qv(qd(tp, qp(rr, p))), 'u1l5-t1-power', t('t_' + p + '=t_1r^{' + (p - 1) + '}') + ': divide by ' + t('r^{' + (p - 1) + '}') + '.'], [qv(qm(tp, qp(rr, p - 1))), 'u1l5-t1-mult', 'To go back from ' + t('t_' + p) + ' to ' + t('t_1') + ', <b>divide</b> by ' + t('r^{' + (p - 1) + '}') + '.']] },
      { label: t('t_n='), name: 'general term', math: true, keys: 'expo', vars: ['n'], check: gtCheck(gtFn(t1, rr), { cands: gtC(t1, rr) }), key: gtKey(t1, rr), ansTex: gtTex(t1, rr) }],
      { sol: t(rFromTwo(tp, tq, p, q) + '\\Rightarrow r=' + qTex(rr)) + '<br>' + t('t_1' + rB(rr) + '^{' + (p - 1) + '}=' + qTex(tp) + '\\Rightarrow t_1=' + qTex(t1)) + '<br>' + t('t_n=' + gtTex(t1, rr)),
        hints: ['Write both terms with ' + t('t_1r^{n-1}') + ' and divide: ' + t('t_1') + ' cancels.', 'An odd power has one real root: ' + t('r^{3}=-27\\Rightarrow r=-3') + '.'], text: text });
  }
  function q10b(r) { return pickWhere(function () { var k = r.int(2, 3), c = r.int(2, 12); return { k: k, c: c, t6: Q(c, Math.pow(k, 4)) }; }, function (z) { return !(z.c === 6 && z.k === 2) && z.t6[1] !== 1; }); }
  /* expressions x − p, x + q, x + s with one solution */
  function exprLin(r, excl, text) {
    var o = pickWhere(function () { var A = r.int(2, 8), rr = r.int(2, 3); return { A: A, r: rr, x: r.int(A + 1, A * rr - 1) }; }, function (z) { return excl(z) && z.x - z.A > 0; });
    var p = o.x - o.A, q = o.A * o.r - o.x, s = o.A * o.r * o.r - o.x, T = [o.A, o.A * o.r, o.A * o.r * o.r];
    return fieldsPart(t('x-' + p + ',\\ x+' + q + ',\\ x+' + s), [{ label: t('x='), name: 'x', ans: o.x }, listField('Terms:', T, { name: 'terms' })],
      { sol: t('(x+' + q + ')^{2}=(x-' + p + ')(x+' + s + ')') + '<br>' + t('x^{2}+' + 2 * q + 'x+' + q * q + '=x^{2}' + (s - p < 0 ? '-' : '+') + Math.abs(s - p) + 'x-' + p * s) + '<br>' + t(q * q + p * s + '=' + (s - p - 2 * q) + 'x\\Rightarrow x=' + o.x) + '; terms ' + t(listTex(T)) + ' (' + t('r=' + o.r) + ').',
        hints: ['For consecutive terms ' + t('a,\\ b,\\ c') + ': ' + t('\\frac{b}{a}=\\frac{c}{b}') + ', so ' + t('b^{2}=ac') + '.', 'The ' + t('x^{2}') + ' terms cancel, leaving a linear equation.'], text: text });
  }

  /* ======================= Lesson 5 Extra Practice ======================= */
  var EXTRA = [
    { num: '1', section: 'A. Skills', stem: 'State the common ratio and write the next two terms.', parts: [
      { id: 'e1a', level: 'BEG', make: function (r) { var o = pickWhere(function () { return { a: r.int(2, 9), r: r.int(3, 5) }; }, function (z) { return !(z.a === 9 && z.r === 4) && !(z.a === 5 && z.r === 4); }); return epNext([0, 1, 2].map(function (k) { return qi(o.a * Math.pow(o.r, k)); }), qi(o.r), 'ratio and next terms (whole)'); } },
      { id: 'e1b', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { k: r.pick([2, 4, 5]), c: r.int(2, 9) }; }, function (z) { return z.c % z.k !== 0 && !(z.k === 5 && z.c === 2); }); return epNext([3, 2, 1].map(function (k) { return qi(o.c * Math.pow(o.k, k)); }), Q(1, o.k), 'ratio and next terms (fraction)', true); } },
      { id: 'e1c', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { a: -r.int(2, 6), r: -r.int(2, 4) }; }, function (z) { return !(z.a === -4 && z.r === -3) && !(z.a === -2 && z.r === -3); }); return epNext([0, 1, 2].map(function (k) { return qi(o.a * Math.pow(o.r, k)); }), qi(o.r), 'ratio and next terms (negative)'); } },
      { id: 'e1d', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { c: r.pick([1, 3, 5, 7]), j: r.int(2, 3) }; }, function (z) { return !(z.c === 3 && z.j === 3); }); var t1 = Q(o.c, Math.pow(2, o.j)); return epNext([0, 1, 2].map(function (k) { return gv(t1, qi(2), k + 1); }), qi(2), 'ratio and next terms (fraction first term)'); } },
      { id: 'e1e', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { c: r.int(2, 7), p: r.pick([2, 3, 5]) }; }, function (z) { return !(z.c === 6 && z.p === 2) && !(z.c === 2 && z.p === 2); });
        var c = o.c, p = o.p;
        return nextPart(t(c + ',\\ ' + radTex(c, p) + ',\\ ' + c * p + ',\\ \\dots'), { kind: 'ge', keys: 'radical', rCheck: radCheck(1, p), rKey: '\\sqrt{' + p + '}', rTex: '\\sqrt{' + p + '}', next: [0, 0], nextCheck: [radCheck(c * p, p), exact(c * p * p)], nextKey: [radTex(c * p, p), String(c * p * p)], nextTex: [radTex(c * p, p), nT(c * p * p)],
          sol: t('r=\\frac{' + radTex(c, p) + '}{' + c + '}=\\sqrt{' + p + '}') + '; next terms ' + t(c * p + '\\sqrt{' + p + '}') + ', ' + t(c * p * p) + '.', hints: ['Divide the second term by the first.', t('\\sqrt{' + p + '}\\times\\sqrt{' + p + '}=' + p) + '.'] }, 'ratio and next terms (radical)');
      } },
      { id: 'e1f', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: r.pick([8, 12, 16, 24, 32, 40]), r: r.pick([[-1, 2], [-1, 5], [-1, 4]]) }; }, function (z) { return !(z.a === 12 && z.r[1] === 2); });
        var t1 = Q(o.a, 10), rr = Q(o.r[0], o.r[1]), v = [0, 1, 2].map(function (k) { return qm(t1, qp(rr, k)); }), nx = [qm(t1, qp(rr, 3)), qm(t1, qp(rr, 4))], s = geoKind(v, rr, nx);
        s.sol = t('r=\\frac{' + dTex(v[1]) + '}{' + dTex(v[0]) + '}=' + dTex(rr)) + '; next terms ' + t(dTex(nx[0])) + ', ' + t(dTex(nx[1])) + '.';
        return nextPart(t(v.map(dTex).join(',\\ ') + ',\\ \\dots'), s, 'ratio and next terms (decimal, negative)');
      } }] },
    { num: '2', stem: 'Write the general term, then determine the indicated term.', parts: [
      { id: 'e2a', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { a: r.int(2, 5), r: r.int(5, 7), k: r.int(6, 7) }; }, function (z) { return z.a * Math.pow(z.r, z.k - 1) <= 1e6 && !(z.a === 3 && z.r === 7); }); return gtAndTerm(qi(o.a), qi(o.r), o.k, 'general term and term (whole)'); } },
      { id: 'e2b', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { c: r.pick([3, 5, 7, 9, 11]), j: r.int(6, 8), k: r.int(9, 11) }; }, function (z) { return z.c * Math.pow(2, z.j) <= 3000 && !(z.c === 7 && z.j === 7); }); return gtAndTerm(qi(o.c * Math.pow(2, o.j)), Q(1, 2), o.k, 'general term and term (ratio 1/2)'); } },
      { id: 'e2c', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { a: r.int(2, 4), r: -r.int(4, 6), k: r.int(6, 8) }; }, function (z) { return Math.abs(z.a * Math.pow(z.r, z.k - 1)) <= 1e6 && !(z.a === 2 && z.r === -5); }); return gtAndTerm(qi(o.a), qi(o.r), o.k, 'general term and term (negative)'); } }] },
    { num: '3', stem: 'Determine the number of terms.', parts: [
      { id: 'e3a', level: 'EMG', make: function (r) { var o = pickWhere(function () { return { a: r.int(3, 9), n: r.int(8, 12) }; }, function (z) { return !(z.a === 7 && z.n === 10) && z.a * Math.pow(2, z.n - 1) <= 20000; }); return nTerms(qi(o.a), qi(2), o.n, 'number of terms (r = 2)'); } },
      { id: 'e3b', level: 'EMG', make: function (r) { var o = pickWhere(function () { var b = r.pick([2, 3, 4]); return { b: b, j: r.int(4, 9) }; }, function (z) { return Math.pow(z.b, z.j) <= 10000 && !(z.b === 3 && z.j === 8); }); return nTerms(qi(Math.pow(o.b, o.j)), Q(1, o.b), o.j + 1, 'number of terms (down to 1)'); } }] },
    { num: '4', stem: 'For the sequence below, decide whether the number is a term. If it is, state its position.', shared: function (r) { return pickWhere(function () { return { a: r.int(3, 7), m: r.int(8, 11), f: r.pick([3, 5, 7]) }; }, function (z) { return !(z.a === 3); }); },
      parts: [
        { id: 'e4a', level: 'EMG', make: function (r, o) { var N = o.a * Math.pow(2, o.m); return isTerm(r, o, N, o.m + 1); } },
        { id: 'e4b', level: 'EMG', make: function (r, o) { var N = o.a * (Math.pow(2, o.m - 1) + o.f * Math.pow(2, o.m - 4)); return isTerm(r, o, N, null); } }] },
    { num: '5', section: 'B. Applying', parts: [
      { id: 'e5', level: 'PRG', make: function (r) { var o = pickWhere(function () { return { a: r.int(2, 7), r: r.int(2, 4) }; }, function (z) { return !(z.a === 5 && z.r === 3) && z.a * Math.pow(z.r, 4) <= 5000; }); return twoTerms(qi(o.a), qi(o.r), 2, 5, 'r, t1, t_n from t2 and t5'); } }] },
    { num: '6', parts: [
      { id: 'e6', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { var k = r.pick([2, 3]); return { k: k, up: r.chance(0.5), c: r.int(1, 6) }; }, function (z) { return !(z.k === 2 && !z.up && z.c === 3); });
        var rr = o.up ? qi(o.k) : Q(1, o.k), t1 = o.up ? qi(o.c) : qi(o.c * Math.pow(o.k, 6)), t3 = gv(t1, rr, 3), t7 = gv(t1, rr, 7), t8 = gv(t1, rr, 8);
        return fieldsPart('In a geometric sequence ' + t('t_3=' + qTex(t3)) + ' and ' + t('t_7=' + qTex(t7)) + '. Determine the possible values of ' + t('r') + ' and ' + t('t_8') + '.', [
          { label: 'Positive ' + t('r='), name: 'r', ans: rr, math: true, cands: [[qv(qp(rr, 4)), 'u1l5-r-power', 'That is ' + t('r^{4}') + '. Take the fourth root.']] },
          { label: t('t_8') + ' (for ' + t('r>0') + ')', name: 't₈ (r > 0)', ans: t8, math: true },
          { label: t('t_8') + ' (for ' + t('r<0') + ')', name: 't₈ (r < 0)', ans: qm(qi(-1), t8), math: true, cands: [[qv(t8), 'u1l5-one-sign', 'With a negative ' + t('r') + ', ' + t('r^{7}') + ' is negative.']] }],
          { sol: t('r^{4}=\\frac{' + qTex(t7) + '}{' + qTex(t3) + '}=' + qTex(qp(rr, 4)) + '\\Rightarrow r=\\pm ' + qTex(rr)) + '; ' + t('t_1=' + qTex(t3) + '\\div ' + qTex(qp(rr, 2), true) + '=' + qTex(t1)) + ' (both).<br>' + t('r=' + qTex(rr) + ':\\ t_8=' + qTex(t8)) + '; ' + t('r=-' + qTex(rr) + ':\\ t_8=' + qTex(qm(qi(-1), t8))),
            hints: ['Divide: ' + t('r^{4}=\\frac{t_7}{t_3}') + '. An even power gives ' + t('\\pm') + '.'], text: 'possible r and t8' });
      } }] },
    { num: '7', parts: [
      { id: 'e7a', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 6), k: r.int(3, 5) }; }, function (z) { return !(z.a === 3 && z.k === 5) && z.a * Math.pow(z.k, 3) <= 1000; });
        var b = o.a * Math.pow(o.k, 3), m = [o.a * o.k, o.a * o.k * o.k];
        return fieldsPart('Insert two geometric means between ' + t(o.a) + ' and ' + t(nT(b)) + '.', [listField('Means:', m, { name: 'means' })], { sol: t(o.a + 'r^{3}=' + nT(b) + '\\Rightarrow r^{3}=' + Math.pow(o.k, 3) + '\\Rightarrow r=' + o.k) + ': means ' + t(listTex(m)) + '.', hints: ['Two means make 4 terms: ' + t(nT(b) + '=' + o.a + 'r^{3}') + '.'], text: 'two geometric means' });
      } },
      { id: 'e7b', level: 'ADV', make: function (r) {
        var o = r.pick([{ a: 1, k: 3 }, { a: 2, k: 2 }, { a: 3, k: 2 }, { a: 5, k: 2 }]), b = o.a * Math.pow(o.k, 6), pos = [1, 2, 3, 4, 5].map(function (i) { return o.a * Math.pow(o.k, i); }), neg = [1, 2, 3, 4, 5].map(function (i) { return o.a * Math.pow(-o.k, i); });
        return fieldsPart('Insert five geometric means between ' + t(o.a) + ' and ' + t(nT(b)) + '. Give all possible answers.', [listField('With ' + t('r>0') + ':', pos, { name: 'r > 0' }), listField('With ' + t('r<0') + ':', neg, { name: 'r < 0' })],
          { sol: '7 terms: ' + t(o.a + 'r^{6}=' + nT(b) + '\\Rightarrow r^{6}=' + Math.pow(o.k, 6) + '\\Rightarrow r=\\pm ' + o.k) + '.<br>' + t(listTex(pos)) + ' or ' + t(listTex(neg)) + '.', hints: ['Five means make 7 terms. ' + t('r^{6}') + ' is an even power.'], text: 'five geometric means (two answers)' });
      } }] },
    { num: '8', parts: [
      { id: 'e8', level: 'PRG', make: function (r) { return exprLin(r, function (z) { return !(z.x === 7 && z.A === 4) && !(z.x === 10 && z.A === 6); }, 'expressions: linear'); } }] },
    { num: '9', parts: [
      { id: 'e9', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 6), k: r.int(3, 6), pos: r.chance(0.5) }; }, function (z) { return !(z.a === 2 && z.k === 5); });
        var t3 = o.a * o.k * o.k, m = o.a * o.k, right = o.pos ? m : -m;
        return mcPart(r, '<i>(Multiple Choice)</i> In a geometric sequence ' + t('t_1=' + o.a) + ' and ' + t('t_3=' + t3) + '. A possible value of ' + t('t_2') + ' is', [
          { html: t(right), right: true }, { html: t(nT((o.a + t3) / 2)), why: 'That is the arithmetic mean. Here ' + t('r^{2}=\\frac{' + t3 + '}{' + o.a + '}') + '.' },
          { html: t(nT(t3 / 2)), why: 'Halving ' + t('t_3') + ' doesn’t use the ratio. Find ' + t('r^{2}') + ' first.' }, { html: t(nT(2 * t3)), why: t('t_2') + ' is between ' + t('t_1') + ' and ' + t('t_3') + ': ' + t('t_2=t_1r') + '.' }],
          t('r^{2}=\\frac{' + t3 + '}{' + o.a + '}=' + o.k * o.k + '\\Rightarrow r=\\pm ' + o.k) + ', so ' + t('t_2=' + m) + ' or ' + t(-m) + '.', ['Find ' + t('r^{2}') + ' from ' + t('t_3=t_1r^{2}') + '.'], 'MC: possible t2');
      } }] },
    { num: '10', parts: [
      { id: 'e10', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { j: r.int(2, 5), m: r.int(6, 10) }; }, function (z) { return !(z.j === 4 && z.m === 9); });
        var n = o.j + o.m + 1, f = [0, 1, 2].map(function (k) { return Q(Math.pow(2, k), Math.pow(2, o.j)); });
        return numPart('<i>(Numerical Response)</i> The number of terms in the sequence ' + t(f.map(function (x) { return qTex(x); }).join(',\\ ') + ',\\ \\dots,\\ ' + nT(Math.pow(2, o.m))) + ' is ______.', n, { nr: true, cands: nC(n), sol: nTermsSol(f[0], qi(2), n), hints: HNT, text: 'NR: number of terms from a fraction' });
      } }] },
    { num: '11', section: 'C. Stretch', parts: [
      { id: 'e11', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(1, 6), p: r.int(2, 4), q: r.int(3, 15) }; }, function (z) { var d = z.p * z.p - z.q; return d > 0 && isInt(z.q * z.a / d) && z.q !== z.p && !(z.a === 2 && z.p === 3 && z.q === 8) && z.q * z.a / d > 0; });
        var x = o.q * o.a / (o.p * o.p - o.q), T = [x + o.a, o.p * x, o.q * x], rr = Q(o.q, o.p);
        return fieldsPart('The expressions ' + t('x+' + o.a) + ', ' + t(o.p + 'x') + ' and ' + t(o.q + 'x') + ' are consecutive terms of a geometric sequence. Determine ' + t('x') + ', the terms and ' + t('r') + '.', [
          { label: t('x='), name: 'x', ans: x, cands: [[0, 'u1l5-x-zero', t('x=0') + ' makes two terms ' + t('0') + ': there is no common ratio. Reject it and use the other solution.']] }, listField('Terms:', T, { name: 'terms' }), { label: t('r='), name: 'r', ans: rr, math: true }],
          { sol: t('(' + o.p + 'x)^{2}=' + o.q + 'x(x+' + o.a + ')\\Rightarrow ' + o.p * o.p + 'x^{2}=' + o.q + 'x^{2}+' + o.q * o.a + 'x') + '<br>' + t((o.p * o.p - o.q === 1 ? '' : o.p * o.p - o.q) + 'x^{2}-' + o.q * o.a + 'x=0\\Rightarrow x(' + (o.p * o.p - o.q === 1 ? '' : o.p * o.p - o.q) + 'x-' + o.q * o.a + ')=0') + '<br>' + t('x=0') + ' gives ' + t(o.a + ',\\ 0,\\ 0') + ', which has no common ratio, so reject it. ' + t('x=' + x) + ': ' + t(listTex(T)) + ', ' + t('r=' + qTex(rr)) + '.',
            hints: [t('b^{2}=ac') + '. Factor out ' + t('x') + ' — and check whether each solution gives a real geometric sequence.'], text: 'expressions: reject x = 0' });
      } }] },
    { num: '12', parts: [
      { id: 'e12', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 9), b: r.int(2, 5) }; }, function (z) { return !(z.a === 3 && z.b === 2); });
        var t1 = o.a * o.b, key = t1 + '\\left(' + o.b + '\\right)^{n-1}';
        return gtPart('A sequence has general term ' + t('t_n=' + o.a + '(' + o.b + ')^{n}') + '. It is geometric (' + t('\\frac{t_{n+1}}{t_n}=' + o.b) + ' for every ' + t('n') + '). Rewrite the general term in the form ' + t('t_n=t_1r^{n-1}') + '.', function (n) { return o.a * Math.pow(o.b, n); }, key, { form: 'tr', t1: t1, r: o.b,
          sol: t('\\frac{t_{n+1}}{t_n}=\\frac{' + o.a + '(' + o.b + ')^{n+1}}{' + o.a + '(' + o.b + ')^{n}}=' + o.b) + ' for every ' + t('n') + ', so it is geometric with ' + t('r=' + o.b) + '.<br>' + t('t_1=' + o.a + '(' + o.b + ')^{1}=' + t1) + ', so ' + t('t_n=' + key) + '.', hints: ['Find ' + t('t_1') + ' by substituting ' + t('n=1') + '.'], text: 'rewrite as t1 r^(n-1)', good: [String(t1) + '\\cdot ' + o.b + '^{n-1}'] });
      } }] },
    { num: '13', parts: [
      { id: 'e13', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { return { h: r.pick([0.05, 0.08, 0.1, 0.15, 0.2, 0.25]), T: r.pick([[100, '10 cm (100 mm)'], [500, '50 cm (500 mm)'], [1000, '1 m (1000 mm)'], [2000, '2 m (2000 mm)']]) }; }, function (z) { return !(z.h === 0.1 && z.T[0] === 1000); });
        var n = 0; while (o.h * Math.pow(2, n) <= o.T[0]) n++;
        return numPart('A sheet of paper is ' + o.h + ' mm thick. Each fold in half doubles the thickness. After how many folds would it be thicker than ' + o.T[1] + '? Use a table of values.', n, { after: 'folds', cands: [[n - 1, 'u1l5-table-early', 'After ' + (n - 1) + ' folds it is ' + nT(cl(o.h * Math.pow(2, n - 1))) + ' mm — not thicker than ' + o.T[0] + ' mm yet.'], [n + 1, 'u1l5-table-late', 'Check one fold fewer: is it already thicker?']],
          sol: 'After ' + t('n') + ' folds the thickness is ' + t(o.h + '(2)^{n}') + ' mm (or ' + t('t_n=' + cl(o.h * 2) + '(2)^{n-1}') + ').<br>' + t(n - 1) + ' folds: ' + t(nT(cl(o.h * Math.pow(2, n - 1)))) + ' mm; ' + t(n) + ' folds: ' + t(nT(cl(o.h * Math.pow(2, n)))) + ' mm. After ' + n + ' folds.', hints: ['Make a table: double the thickness for each fold until it passes the target.'], text: 'paper folding' });
      } }] }
  ];
  function epNext(v, rr, text, decs) {
    var nx = [qm(v[2], rr), qm(v[2], qm(rr, rr))], s = geoKind(v, rr, nx);
    if (decs) s.sol = ratioSol(v, rr) + '; next terms ' + t(dTex(nx[0])) + ', ' + t(dTex(nx[1])) + '.';
    return nextPart(t(v.map(function (x) { return qTex(x); }).join(',\\ ') + ',\\ \\dots'), s, text);
  }
  function gtAndTerm(t1, rr, k, text) {
    var v = [1, 2, 3].map(function (n) { return gv(t1, rr, n); }), ans = gv(t1, rr, k);
    return fieldsPart(t(seqTex(v)) + '; ' + t('t_{' + k + '}'), [
      { label: t('t_n='), name: 'general term', math: true, keys: 'expo', vars: ['n'], check: gtCheck(gtFn(t1, rr), { cands: gtC(t1, rr) }), key: gtKey(t1, rr), ansTex: gtTex(t1, rr) },
      { label: t('t_{' + k + '}='), name: 't_' + k, ans: ans, math: true, keys: 'expo', vars: ['n'], cands: termC(t1, rr, k) }],
      { sol: ratioSol(v, rr) + '; ' + t('t_n=' + gtTex(t1, rr)) + '<br>' + t('t_{' + k + '}=' + qTex(t1) + rB(rr) + '^{' + (k - 1) + '}=' + qTex(ans)) + (dec(ans) != null && ans[1] !== 1 ? ' ' + t('(=' + dec(ans) + ')') : ''), hints: HG, text: text });
  }
  function isTerm(r, o, N, pos) {
    var q = N / o.a, lo = Math.floor(Math.log(q) / Math.log(2) + 1e-9);
    var opts = [{ html: 'No, it is not a term.', right: pos == null, why: pos == null ? null : t('\\frac{' + nT(N) + '}{' + o.a + '}=' + nT(q) + '=2^{' + Math.round(Math.log(q) / Math.log(2)) + '}') + ' is a power of 2, so it is a term.' }];
    var p0 = pos || lo + 1;
    [p0 - 1, p0, p0 + 1].forEach(function (p) { opts.push({ html: 'Yes, it is ' + t('t_{' + p + '}') + '.', right: pos === p, why: pos == null ? t('\\frac{' + nT(N) + '}{' + o.a + '}=' + nT(q)) + ' is not a power of 2 (' + t('2^{' + lo + '}=' + nT(Math.pow(2, lo))) + ', ' + t('2^{' + (lo + 1) + '}=' + nT(Math.pow(2, lo + 1))) + '), so no term equals it.' : 'Solve ' + t('2^{n-1}=' + nT(q)) + ': the position is one more than the exponent.' }); });
    return mcPart(r, 'Sequence ' + t(o.a + ',\\ ' + 2 * o.a + ',\\ ' + 4 * o.a + ',\\ \\dots') + '. Is ' + t(nT(N)) + ' a term?', opts,
      t(o.a + '(2)^{n-1}=' + nT(N) + '\\Rightarrow 2^{n-1}=' + nT(q) + (pos != null ? '=2^{' + (pos - 1) + '}' : '')) + (pos != null ? ', so ' + t('n=' + pos) + ': yes, ' + t('t_{' + pos + '}') + '.' : ', which is not a power of 2 (' + t('2^{' + lo + '}=' + nT(Math.pow(2, lo))) + ', ' + t('2^{' + (lo + 1) + '}=' + nT(Math.pow(2, lo + 1))) + '): not a term.'), ['Divide by ' + t(o.a) + ' and see whether the result is a power of 2.'], pos ? 'is it a term (yes)' : 'is it a term (no)');
  }

  HW.defineLesson({ id: 'u1l5', unit: 1, num: 5, title: 'Geometric Sequences', outcome: 'RF10', questions: QUESTIONS, extra: EXTRA });
})(window);
