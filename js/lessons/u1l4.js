/* Math 20-1 · Unit 1 · Lesson 4 — Arithmetic Series (outcome RF9 on every part)
 * Assignment 4 (m201book unit1/u1_l04.tex, Questions 1–18) and the Lesson 4 Extra Practice (u1_ep04.tex, Questions 1–14).
 * Every part is a generator: the booklet question's idea, form and difficulty with new numbers (the lesson's example
 * numbers and the booklet question's own numbers are left out). On-screen calculator allowed (Unit 1).
 * Conversions: "write the series" and "explain" -> multiple choice (the distractors are real mistakes: the sequence
 * with commas, a missing term, dropped signs); tables of partial sums and multi-answer items -> labelled boxes; the
 * (n, Sₙ) graph is drawn as SVG with its points labelled; numerical response -> a 4-character box.
 * Recognised mistakes: (n)d for (n − 1)d, forgetting the ½, t₁ not doubled, giving tₙ for Sₙ, n − 1 for n, the
 * rejected root of the "how many terms" quadratic, a sum given for a term (and the reverse).
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: Q8 (sum of the means), Q12(d), Extra 12–14. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, B = K.P, ex = HW.ex, F = HW.fmt, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var LID = 'u1l4';

  var CODES = {
    'u1l4-nd': 'Sum: used nd instead of (n − 1)d', 'u1l4-no-half': 'Sum: forgot the ½ (n/2)', 'u1l4-t1-once': 'Sum: used t₁ instead of 2t₁ in the bracket',
    'u1l4-gave-tn': 'Gave the last term tₙ instead of the sum', 'u1l4-n-minus': 'Sum: used n − 1 terms', 'u1l4-no-n': 'Sum: gave t₁ + tₙ (no n/2)',
    'u1l4-term-not-sum': 'Gave a term instead of a partial sum', 'u1l4-sum-not-term': 'Gave a partial sum instead of a term', 'u1l4-pair-total': 'Pairing: wrong column total',
    'u1l4-half-twice': 'Pairing: halved twice', 'u1l4-count': 'Miscounted the terms', 'u1l4-n-minus-one': 'Number of terms: gave n − 1', 'u1l4-other-root': 'Kept the wrong root of the quadratic',
    'u1l4-2t1': 'Gave 2t₁ instead of t₁', 'u1l4-t1-plus': 'Gave t₁ + tₙ instead of t₁', 'u1l4-d-n': 'Divided by n instead of n − 1 for d', 'u1l4-means-ends': 'Sum of means: included the given terms',
    'u1l4-one-way': 'Counted one way only (not there and back)', 'u1l4-row-step': 'Stepped p instead of p − 1 rows', 'u1l4-gave-d': 'Gave d instead of the term',
    'u1l4-d-half': 'd from Sₙ: wrong value', 'u1l4-gave-t2': 'Gave t₂ instead of d', 'u1l4-next-term': 'Gave the next term (Sₖ₊₁ − Sₖ)', 'u1l4-t0': 'Used the constant of tₙ as t₁',
    'u1l4-mid': 'Middle term: gave 3m', 'u1l4-list-count': 'Wrong number of values', 'u1l4-list-order': 'Values out of order', 'u1l4-list': 'Wrong values in the list'
  };
  HW.addCodes(Object.keys(CODES).filter(function (k) { return !HW.CODES[k]; }).reduce(function (o, k) { o[k] = CODES[k]; return o; }, {}));
  HW.addPartial({ 'u1l4-nd': 's', 'u1l4-no-half': 's', 'u1l4-t1-once': 's', 'u1l4-gave-tn': 'b', 'u1l4-n-minus': 's', 'u1l4-no-n': 'b', 'u1l4-term-not-sum': 'b', 'u1l4-sum-not-term': 'b',
    'u1l4-pair-total': 'b', 'u1l4-half-twice': 's', 'u1l4-count': 's', 'u1l4-n-minus-one': 's', 'u1l4-other-root': 'b', 'u1l4-2t1': 's', 'u1l4-t1-plus': 'b', 'u1l4-d-n': 's',
    'u1l4-means-ends': 'b', 'u1l4-one-way': 's', 'u1l4-row-step': 's', 'u1l4-gave-d': 'b', 'u1l4-d-half': 'b', 'u1l4-gave-t2': 'b', 'u1l4-next-term': 's', 'u1l4-t0': 's', 'u1l4-mid': 'b' });

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
    return { prompt: prompt, input: input, check: check, key: key, answer: t((o.ansPre || '') + (fr ? qTex(ans) : nT(v)) + (o.unit ? '\\text{ ' + o.unit + '}' : '') + (o.unitTex || '')),
      solution: o.sol, hints: o.hints || [], text: o.text, bad: badOf(o.cands, ans).concat(o.bad || []), good: o.good };
  }
  /* a part with a rounded number */
  function apxPart(prompt, x, dp, o) {
    o = o || {};
    var want = rd(x, dp);
    return { prompt: prompt, input: { type: 'number', before: o.before, after: o.after, nr: !!o.nr }, check: K.approx(x, dp, { diag: cdiag(o.cands, dp), nr: o.nr }), key: want.toFixed(Math.max(dp, 0)),
      answer: t((o.ansPre || '') + fx(x, dp) + (o.unit ? '\\text{ ' + o.unit + '}' : '') + (o.unitTex || '')), solution: o.sol, hints: o.hints || [], text: o.text, bad: badOf(o.cands, x, dp).concat(o.bad || []), good: o.good };
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
    return { prompt: prompt, input: { type: 'math', keys: 'poly', vars: [o.v || 'n'], before: o.before === undefined ? t('t_n=') : o.before, placeholder: o.placeholder }, check: gtCheck(fn, o), key: keyTex,
      answer: t((o.before === undefined ? 't_n=' : '') + keyTex), solution: o.sol, hints: o.hints || [], text: o.text, bad: o.bad, good: o.good };
  }

  /* ======================= Lesson 4: arithmetic series ======================= */
  function S(t1, d, n) { return qm(Q(n, 2), qa(qm(qi(2), t1), qm(qi(n - 1), d))); }       // rationals in, rational out
  function Sf(t1, d, n) { return n * (2 * t1 + (n - 1) * d) / 2; }                     // numbers
  function tN(t1, d, n) { return t1 + (n - 1) * d; }
  function half(n) { return n % 2 === 0 ? nT(n / 2) : '\\frac{' + n + '}{2}'; }
  function bra(x) { return '(' + qTex(x) + ')'; }
  /* S_n = n/2[2t1 + (n−1)d] worked, t1 and d as fractions [p, q] (dm: show them as decimals) */
  function sSol2(n, t1, d, dm) {
    var inner = qa(qm(qi(2), t1), qm(qi(n - 1), d)), X = dm ? dTex : qTex;
    var b1 = t1[1] !== 1 && !dm ? qTex(t1, true) : '(' + X(t1) + ')', b2 = d[1] !== 1 && !dm ? qTex(d, true) : '(' + X(d) + ')';
    return t('t_1=' + X(t1) + ',\\ d=' + X(d) + ',\\ n=' + n) + '<br>' +
      t('S_{' + n + '}=\\frac{' + n + '}{2}\\left[2' + b1 + '+' + (n - 1) + b2 + '\\right]=' + half(n) + '\\left(' + X(inner) + '\\right)=' + X(S(t1, d, n)));
  }
  function lSol(n, a, l) { return t('S_{' + n + '}=\\frac{' + n + '}{2}(' + nT(a) + '+' + sgp(l) + ')=' + half(n) + '(' + nT(a + l) + ')=' + nT(n * (a + l) / 2)); }
  function sumC(t1, d, n) {
    t1 = qv(t1); d = qv(d);
    return [[n * (2 * t1 + n * d) / 2, 'u1l4-nd', 'Use ' + t('(n-1)d') + ', not ' + t('nd') + ': the last term is ' + t('n-1') + ' steps after the first.'],
      [n * (2 * t1 + (n - 1) * d), 'u1l4-no-half', 'Don’t forget the ' + t('\\frac{n}{2}') + ': multiply the bracket by <b>half</b> of ' + t('n') + '.'],
      [n * (t1 + (n - 1) * d) / 2, 'u1l4-t1-once', 'The bracket is ' + t('2t_1+(n-1)d') + ' — double the first term.'],
      [t1 + (n - 1) * d, 'u1l4-gave-tn', 'That is the last term ' + t('t_n') + ', not the sum. Now use it: ' + t('S_n=\\frac{n}{2}(t_1+t_n)') + '.']];
  }
  function lastC(n, a, l) {
    return [[n * (a + l), 'u1l4-no-half', 'Don’t forget to halve: ' + t('S_n=\\frac{n}{2}(t_1+t_n)') + '.'],
      [(n - 1) * (a + l) / 2, 'u1l4-n-minus', 'Use the number of terms, ' + t('n=' + n) + ', in ' + t('\\frac{n}{2}') + '.'],
      [a + l, 'u1l4-no-n', 'That is ' + t('t_1+t_n') + ' — now multiply by ' + t('\\frac{n}{2}') + '.']];
  }
  /* a series written out: first terms, then … (and optionally the last term) */
  function serTex(terms, last) {
    return terms.map(function (x, i) { var s = Array.isArray(x) ? dTex(x) : nT(x); return i > 0 && qv(x) < 0 ? '(' + s + ')' : s; }).join('+') + '+\\dots' + (last != null ? '+' + (last < 0 ? '(' + nT(last) + ')' : nT(last)) : '');
  }
  var HS = ['Sum formula: ' + t('S_n=\\frac{n}{2}\\left[2t_1+(n-1)d\\right]') + '. Find ' + t('t_1') + ', ' + t('d') + ' and ' + t('n') + ' first.', 'Multiply ' + t('(n-1)') + ' by ' + t('d') + ', and don’t forget the ' + t('\\frac{n}{2}') + '.'];
  var HL = ['When the first and last terms are known, use ' + t('S_n=\\frac{n}{2}(t_1+t_n)') + '.'];
  var HN = ['Find the number of terms first: solve ' + t('t_n=t_1+(n-1)d') + ' for ' + t('n') + ', then use ' + t('S_n=\\frac{n}{2}(t_1+t_n)') + '.'];
  var HQ = ['Substitute ' + t('t_1') + ', ' + t('d') + ' and ' + t('S_n') + ' into ' + t('S_n=\\frac{n}{2}\\left[2t_1+(n-1)d\\right]') + '. You get a quadratic in ' + t('n') + '.', 'Expand, move every term to one side, divide out a common factor, then factor. Reject a root that isn’t a natural number.'];
  /* the "how many terms" quadratic, worked: t1, d, S, n0 (answer) */
  function polyN(b, c) { return 'n^{2}' + (b ? (b > 0 ? '+' : '-') + (Math.abs(b) === 1 ? '' : Math.abs(b)) + 'n' : '') + (c ? (c > 0 ? '+' : '-') + nT(Math.abs(c)) : '') + '=0'; }
  function fac(r) { return r < 0 ? '(n+' + (-r) + ')' : '(n-' + r + ')'; }
  function howMany(t1, d, Sv) {
    var A = d, Bc = 2 * t1 - d, roots = [], disc = Bc * Bc + 8 * A * Sv, sq = Math.sqrt(disc);
    var n0 = (-Bc + sq) / (2 * A), n1 = (-Bc - sq) / (2 * A);
    return { n0: Math.round(n0), n1: Math.round(n1), b: Bc / A, c: -2 * Sv / A, ok: isInt(n0) && isInt(n1) && isInt(Bc / A) && isInt(2 * Sv / A) && n0 > 0 && n1 < 0 };
  }
  function howSol(t1, d, Sv, h) {
    var lin = d + 'n' + (2 * t1 - d === 0 ? '' : (2 * t1 - d > 0 ? '+' : '-') + Math.abs(2 * t1 - d));
    return t('t_1=' + nT(t1) + ',\\ d=' + nT(d) + ',\\ S_n=' + nT(Sv)) + '<br>' +
      t(nT(Sv) + '=\\frac{n}{2}\\left[2' + bra(qi(t1)) + '+(n-1)' + bra(qi(d)) + '\\right]=\\frac{n}{2}(' + lin + ')') + '<br>' +
      t(nT(2 * Sv) + '=' + (d === 1 ? '' : d) + 'n^{2}' + (2 * t1 - d === 0 ? '' : (2 * t1 - d > 0 ? '+' : '-') + Math.abs(2 * t1 - d) + 'n')) + (d !== 1 ? ' &nbsp;→&nbsp; divide by ' + t(d) + ':' : '') + '<br>' +
      t(polyN(h.b, h.c)) + '<br>' + t(fac(h.n0) + fac(h.n1) + '=0') + ' &nbsp;→&nbsp; ' + t('n=' + h.n0) + ' (' + t('n=' + h.n1) + ' is rejected: ' + t('n') + ' must be a natural number).';
  }
  function howC(h) { return [[-h.n1, 'u1l4-other-root', 'Check that root: it doesn’t give the right sum. Factor again — the root you keep must be a natural number that makes ' + t('S_n') + ' work.'], [h.n0 - 1, 'u1l4-n-minus', 'Check your factoring: substitute your ' + t('n') + ' into the sum formula.']]; }

  var QUESTIONS = [
    { num: '1', shared: function (r) { return pickWhere(function () { return { a: r.int(6, 15), d: -r.int(3, 6) }; }, function (z) { return z.a + 2 * z.d > 0 && z.a + 3 * z.d < 0 && !(z.a === 9 && z.d === -4); }); },
      stem: function (o) { return 'Consider the arithmetic sequence ' + t([0, 1, 2, 3, 4].map(function (k) { return nT(o.a + k * o.d); }).join(',\\ ') + ',\\ \\dots') + '.'; },
      parts: [
        { id: '1a', level: 'BEG', make: function (r, o) {
          var T = [0, 1, 2, 3, 4].map(function (k) { return o.a + k * o.d; });
          var ser = function (arr) { return t(arr.map(function (x, i) { return i > 0 && x < 0 ? '(' + nT(x) + ')' : nT(x); }).join('+')); };
          return mcPart(r, 'Which is the <b>series</b> of the first five terms?', [
            { html: ser(T), right: true },
            { html: t(T.map(nT).join(',\\ ')), why: 'That is the <b>sequence</b> (terms separated by commas). A series <b>adds</b> the terms: write them with plus signs.' },
            { html: ser(T.slice(0, 4)), why: 'That adds only four terms. The series of the first <b>five</b> terms has five terms.' },
            { html: ser(T.map(Math.abs)), why: 'The last terms of this sequence are negative — keep their signs: ' + t('+(' + nT(T[4]) + ')') + '.' }],
            'A series is the sum of the terms: ' + ser(T) + '. (The sequence uses commas; the series uses plus signs.)', ['A series is written with plus signs.'], 'series of the first five terms');
        } },
        { id: '1b', level: 'BEG', make: function (r, o) {
          var T = [0, 1, 2, 3, 4].map(function (k) { return o.a + k * o.d; }), Sv = [], s = 0;
          T.forEach(function (x) { s += x; Sv.push(s); });
          return fieldsPart('Complete the table of partial sums.', Sv.map(function (v, i) {
            return { label: t('S_' + (i + 1) + '='), name: 'S' + (i + 1), ans: v, cands: i ? [[T[i], 'u1l4-term-not-sum', 'That is the term ' + t('t_' + (i + 1)) + '. ' + t('S_' + (i + 1)) + ' is the running total: add ' + t('t_' + (i + 1)) + ' to ' + t('S_' + i) + '.']] : [] };
          }), { sol: Sv.map(function (v, i) { return t('S_' + (i + 1) + '=' + (i ? 'S_' + i + '+t_' + (i + 1) + '=' + nT(Sv[i - 1]) + '+' + sgp(T[i]) + '=' : '') + nT(v)); }).join('<br>'),
            hints: [t('S_1=t_1') + ', ' + t('S_2=t_1+t_2') + ', … Each partial sum is the one before plus the next term.'], text: 'table of partial sums', bad: [T.map(String)] });
        } },
        { id: '1c', level: 'EMG', make: function (r, o) {
          var T = [0, 1, 2, 3, 4].map(function (k) { return o.a + k * o.d; });
          return mcPart(r, 'Why do the partial sums start to decrease?', [
            { html: 'From ' + t('t_4') + ' on, the terms are negative, so adding them makes the total smaller.', right: true },
            { html: 'The common difference is negative, so each partial sum is smaller than the one before.', why: 'Not every one: ' + t('S_2=' + nT(T[0] + T[1])) + ' is bigger than ' + t('S_1=' + nT(T[0])) + '. The sums grow while the terms are positive.' },
            { html: 'Partial sums always decrease after the third term.', why: 'For ' + t('2+4+6+\\dots') + ' they keep growing. It depends on the signs of the terms being added.' },
            { html: 'The first term is too small.', why: 'The size of ' + t('t_1') + ' isn’t the reason. Look at the sign of each term you add.' }],
            'The terms are ' + t(T.map(nT).join(',\\ ')) + '. From ' + t('t_4=' + nT(T[3])) + ' on they are negative, so adding them lowers the total.', ['Look at the sign of each term that is added.'], 'why partial sums decrease');
        } }] },
    { num: '2', stem: 'Use pairing (write the sum forwards and backwards) to find each sum.', parts: [
      { id: '2a', level: 'BEG', make: function (r) {
        var N = r.pick(range(120, 480, 10).filter(function (x) { return x !== 250; }));
        return numPart(t('1+2+3+\\dots+' + (N - 1) + '+' + N), N * (N + 1) / 2, { cands: [[N * (N + 1), 'u1l4-no-half', 'That is ' + t('2S') + '. Divide by ' + t('2') + '.'], [N * N / 2, 'u1l4-pair-total', 'Each column adds to the first term plus the last term: ' + t('1+' + N + '=' + (N + 1)) + '.'], [N * (N + 1) / 4, 'u1l4-half-twice', 'There are ' + t(N) + ' columns, each ' + t(N + 1) + ', so ' + t('2S=' + N + '(' + (N + 1) + ')') + '. Halve once.']],
          sol: t('\\phantom{2}S=1+2+3+\\dots+' + N) + '<br>' + t('\\phantom{2}S=' + N + '+' + (N - 1) + '+' + (N - 2) + '+\\dots+1') + '<br>' + t('2S=' + (N + 1) + '+' + (N + 1) + '+\\dots+' + (N + 1)) + ' (' + N + ' columns)<br>' + t('2S=' + N + '(' + (N + 1) + ')=' + nT(N * (N + 1))) + ', so ' + t('S=' + nT(N * (N + 1) / 2)) + '.',
          hints: ['Add the first and last terms: every column of the two lines adds to the same total.', 'Count the columns (the number of terms).'], text: 'pairing 1 + 2 + … + N' });
      } },
      { id: '2b', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { k: r.pick([2, 3, 4, 6, 7, 8]), M: r.int(30, 70) }; }, function (z) { return !(z.k === 3 && z.M === 50) && !(z.k === 5 && z.M === 60); });
        var k = o.k, M = o.M, L = k * M;
        return fieldsPart(t(k + '+' + 2 * k + '+' + 3 * k + '+\\dots+' + (L - k) + '+' + L), [
          { label: 'Number of terms', name: 'number of terms', ans: M, cands: [[L, 'u1l4-count', 'The terms are the multiples of ' + t(k) + ': divide the last term by ' + t(k) + ' to count them.'], [M - 1, 'u1l4-count', 'Count again: ' + t(L + '\\div ' + k) + '.']] },
          { label: 'Each column adds to', name: 'column total', ans: L + k, cands: [[L, 'u1l4-pair-total', 'A column adds the first term and the last term: ' + t(k + '+' + L) + '.']] },
          { label: 'Sum', name: 'sum', ans: M * (L + k) / 2, cands: [[M * (L + k), 'u1l4-no-half', 'That is ' + t('2S') + '. Divide by ' + t('2') + '.']] }],
          { sol: t(L + '\\div ' + k + '=' + M) + ' terms; each column ' + t(k + '+' + L + '=' + (L + k)) + '.<br>' + t('2S=' + M + '(' + (L + k) + ')=' + nT(M * (L + k))) + ', so ' + t('S=' + nT(M * (L + k) / 2)) + '.',
            hints: ['Write the sum forwards and backwards; each column adds to the first term plus the last term.'], text: 'pairing multiples of k', bad: [[String(M), String(L), String(M * (L + k))]] });
      } }] },
    { num: '3', stem: 'Determine the sum of each arithmetic series.', parts: [
      { id: '3a', level: 'BEG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 12), d: r.int(3, 9), n: r.int(16, 30) }; }, function (z) { return !(z.a === 5 && z.d === 7 && z.n === 20) && !(z.a === 7 && z.d === 4); });
        return numPart(t(serTex([o.a, o.a + o.d, o.a + 2 * o.d])) + ' (first ' + o.n + ' terms)', Sf(o.a, o.d, o.n), { cands: sumC(o.a, o.d, o.n), sol: sSol2(o.n, qi(o.a), qi(o.d)), hints: HS, text: 'sum, positive terms' });
      } },
      { id: '3b', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { a: -r.int(8, 25), d: r.int(2, 6), n: r.int(20, 36) }; }, function (z) { return !(z.a === -15 && z.d === 4 && z.n === 32); });
        return numPart(t(serTex([o.a, o.a + o.d, o.a + 2 * o.d])) + ' (first ' + o.n + ' terms)', Sf(o.a, o.d, o.n), { cands: sumC(o.a, o.d, o.n), sol: sSol2(o.n, qi(o.a), qi(o.d)), hints: HS, text: 'sum, negative first term' });
      } },
      { id: '3c', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(11, 39), b: r.pick([2, 3, 4, 5, 6, 7, 8, 15]), n: r.int(12, 30) }; }, function (z) { return z.a % 10 !== 0 && !(z.a === 18 && z.b === 5 && z.n === 24); });
        var t1 = Q(o.a, 10), d = Q(o.b, 10), terms = [t1, qa(t1, d), qa(t1, qm(qi(2), d))];
        return numPart(t(serTex(terms)) + ' (first ' + o.n + ' terms)', qv(S(t1, d, o.n)), { cands: sumC(t1, d, o.n), sol: sSol2(o.n, t1, d, true), hints: HS, text: 'sum with decimals' });
      } },
      { id: '3d', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { var q = r.pick([2, 3, 4, 6]), e = r.pick([2, 3, 4, 6]); return { t1: Q(r.int(1, 2 * q), q), d: Q(r.int(1, 3), e), n: r.int(8, 14) }; },
          function (z) { var s = S(z.t1, z.d, z.n); return z.t1[1] !== 1 && z.d[1] !== 1 && s[1] !== 1 && !(z.t1[0] === 1 && z.t1[1] === 3 && z.d[0] === 1 && z.d[1] === 2) && qa(z.t1, z.d)[1] !== 1; });
        var terms = [o.t1, qa(o.t1, o.d), qa(o.t1, qm(qi(2), o.d))];
        return numPart(t(terms.map(function (x) { return qTex(x); }).join('+') + '+\\dots') + ' (first ' + o.n + ' terms)', S(o.t1, o.d, o.n), { cands: sumC(o.t1, o.d, o.n),
          sol: 'Find ' + t('d') + ': ' + t('d=' + qTex(terms[1]) + '-' + qTex(o.t1) + '=' + qTex(o.d)) + '.<br>' + sSol2(o.n, o.t1, o.d), hints: HS.concat(['Give the exact answer as a fraction.']), text: 'sum with fractions' });
      } }] },
    { num: '4', stem: 'Determine the sum of each arithmetic series from its first and last terms.', parts: [
      { id: '4a', level: 'BEG', make: function (r) {
        var o = pickWhere(function () { var a = r.int(5, 25), d = r.int(2, 6), N = r.int(25, 45); return { a: a, N: N, l: a + (N - 1) * d }; }, function (z) { return isInt(z.N * (z.a + z.l) / 2) && !(z.a === 14 && z.N === 40); });
        return numPart(t('t_1=' + o.a + ',\\ t_{' + o.N + '}=' + o.l), o.N * (o.a + o.l) / 2, { cands: lastC(o.N, o.a, o.l), sol: lSol(o.N, o.a, o.l), hints: HL, text: 'sum from first and last (positive)' });
      } },
      { id: '4b', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { var a = -r.int(2, 12), d = -r.int(2, 6), N = 2 * r.int(10, 17) + 1; return { a: a, N: N, l: a + (N - 1) * d }; }, function (z) { return isInt(z.N * (z.a + z.l) / 2) && !(z.a === -6 && z.N === 31); });
        return numPart(t('t_1=' + o.a + ',\\ t_{' + o.N + '}=' + o.l), o.N * (o.a + o.l) / 2, { cands: lastC(o.N, o.a, o.l), sol: lSol(o.N, o.a, o.l), hints: HL, text: 'sum from first and last (negative)' });
      } }] },
    { num: '5', stem: 'Determine each sum.', parts: [
      { id: '5a', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(3, 15), d: r.int(4, 11), n: r.int(18, 32) }; }, function (z) { return !(z.a === 8 && z.d === 9 && z.n === 28) && !(z.a === 7 && z.d === 5); });
        return lastPart(o.a, o.d, o.n, 'sum with last term (increasing)');
      } },
      { id: '5b', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(40, 80), d: -r.int(4, 8), n: r.int(14, 22) }; }, function (z) { return tN(z.a, z.d, z.n) < 0 && !(z.a === 64 && z.d === -6) && !(z.a === 52 && z.d === -7); });
        return lastPart(o.a, o.d, o.n, 'sum with last term (decreasing)');
      } }] },
    { num: '6', stem: 'How many terms of each series must be added to give the stated sum?', parts: [
      { id: '6a', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { var a = r.int(2, 9), d = r.pick([2, 4]), n = r.int(10, 20); return { a: a, d: d, n: n, S: Sf(a, d, n) }; }, function (z) { return howMany(z.a, z.d, z.S).ok && !(z.a === 3 && z.d === 2 && z.n === 13) && !(z.a === 6 && z.d === 4); });
        var h = howMany(o.a, o.d, o.S);
        return numPart(t(serTex([o.a, o.a + o.d, o.a + 2 * o.d]) + '=' + nT(o.S)), h.n0, { cands: howC(h), sol: howSol(o.a, o.d, o.S, h), hints: HQ, text: 'how many terms (positive)', after: 'terms' });
      } },
      { id: '6b', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { var a = -r.int(4, 15), d = r.int(2, 5), n = r.int(12, 24); return { a: a, d: d, n: n, S: Sf(a, d, n) }; }, function (z) { return z.S > 0 && howMany(z.a, z.d, z.S).ok && !(z.a === -10 && z.d === 4); });
        var h = howMany(o.a, o.d, o.S);
        return numPart(t(serTex([o.a, o.a + o.d, o.a + 2 * o.d]) + '=' + nT(o.S)), h.n0, { cands: howC(h), sol: howSol(o.a, o.d, o.S, h), hints: HQ, text: 'how many terms (negative start)', after: 'terms' });
      } }] },
    { num: '7', parts: [
      { id: '7a', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { n: r.int(12, 24), d: r.int(2, 5), a: r.int(3, 20) }; }, function (z) { return !(z.n === 16 && z.d === 2 && z.a === 12) && !(z.n === 20 && z.d === 3); });
        var Sv = Sf(o.a, o.d, o.n), X = 2 * Sv / o.n;
        return numPart('An arithmetic series has ' + t('S_{' + o.n + '}=' + nT(Sv)) + ' and ' + t('d=' + o.d) + '. Determine ' + t('t_1') + '.', o.a, {
          cands: [[(Sv / o.n - (o.n - 1) * o.d) / 2, 'u1l4-no-half', 'Remember the ' + t('\\frac{n}{2}') + ': ' + t(nT(Sv) + '=\\frac{' + o.n + '}{2}[\\dots]') + ', so the bracket equals ' + t(nT(X)) + '.'],
            [(X - o.n * o.d) / 2, 'u1l4-nd', 'Use ' + t('(n-1)d=' + (o.n - 1) + '(' + o.d + ')') + ', not ' + t('nd') + '.'], [2 * o.a, 'u1l4-2t1', 'That is ' + t('2t_1') + '. Divide by ' + t('2') + '.']],
          sol: t(nT(Sv) + '=\\frac{' + o.n + '}{2}\\left[2t_1+' + (o.n - 1) + '(' + o.d + ')\\right]') + '<br>' + t(nT(X) + '=2t_1+' + (o.n - 1) * o.d) + ' (multiply by ' + t('\\frac{2}{' + o.n + '}') + ')<br>' + t('2t_1=' + nT(X - (o.n - 1) * o.d) + '\\Rightarrow t_1=' + o.a),
          hints: ['Substitute into ' + t('S_n=\\frac{n}{2}\\left[2t_1+(n-1)d\\right]') + ' and solve the linear equation for ' + t('t_1') + '.'], text: 'find t1 from S_n and d', before: t('t_1=') });
      } },
      { id: '7b', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { n: r.int(14, 26), a: r.int(2, 12), d: r.int(3, 7) }; }, function (z) { return !(z.n === 22 && z.a === 6 && z.d === 5); });
        var l = tN(o.a, o.d, o.n), Sv = Sf(o.a, o.d, o.n);
        return fieldsPart('An arithmetic series has ' + o.n + ' terms. The last term is ' + t(l) + ' and the sum is ' + t(nT(Sv)) + '. Determine ' + t('t_1') + ' and ' + t('d') + '.', [
          { label: t('t_1='), name: 't₁', ans: o.a, cands: [[2 * Sv / o.n, 'u1l4-t1-plus', 'That is ' + t('t_1+t_{' + o.n + '}') + '. Subtract the last term.'], [Sv / o.n - l, 'u1l4-no-half', 'Remember the ' + t('\\frac{n}{2}') + ' in ' + t('S_n=\\frac{n}{2}(t_1+t_n)') + '.']] },
          { label: t('d='), name: 'd', ans: o.d, cands: [[(l - o.a) / o.n, 'u1l4-d-n', 'From ' + t('t_1') + ' to ' + t('t_{' + o.n + '}') + ' is ' + t(o.n - 1) + ' steps: ' + t(l + '=t_1+' + (o.n - 1) + 'd') + '.']] }],
          { sol: t(nT(Sv) + '=\\frac{' + o.n + '}{2}(t_1+' + l + ')\\Rightarrow ' + nT(2 * Sv / o.n) + '=t_1+' + l) + ', so ' + t('t_1=' + o.a) + '.<br>' + t(l + '=' + o.a + '+' + (o.n - 1) + 'd\\Rightarrow ' + (l - o.a) + '=' + (o.n - 1) + 'd\\Rightarrow d=' + o.d),
            hints: ['Use ' + t('S_n=\\frac{n}{2}(t_1+t_n)') + ' to find ' + t('t_1') + ', then ' + t('t_n=t_1+(n-1)d') + ' to find ' + t('d') + '.'], text: 'find t1 and d from n, t_n, S_n' });
      } }] },
    { num: '8', parts: [
      { id: '8', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { var k = r.int(3, 9), d = r.int(2, 8), a = -r.int(5, 30); return { k: k, d: d, a: a, b: a + (k + 1) * d }; }, function (z) { return (z.k * (z.a + z.b)) % 2 === 0 && z.a + z.b !== 0 && !(z.a === -20 && z.b === 28); });
        var n = o.k + 2, Sv = n * (o.a + o.b) / 2, M = Sv - o.a - o.b, means = []; for (var i = 1; i <= o.k; i++) means.push(o.a + i * o.d);
        return numPart(word(o.k) + ' arithmetic means are placed between ' + t(o.a) + ' and ' + t(o.b) + '. Find the sum of the ' + o.k + ' means <b>without</b> finding the means.', M, {
          cands: [[Sv, 'u1l4-means-ends', 'That sum includes the two given numbers. Subtract them to leave just the means.'], [Sv - o.a, 'u1l4-means-ends', 'Subtract <b>both</b> given numbers from the total.'], [Sv - o.b, 'u1l4-means-ends', 'Subtract <b>both</b> given numbers from the total.'], [2 * M, 'u1l4-no-half', 'Remember the ' + t('\\frac{n}{2}') + '.']],
          sol: 'With the two given terms there are ' + t(o.k + '+2=' + n) + ' terms: ' + t('S_{' + n + '}=\\frac{' + n + '}{2}(' + o.a + '+' + o.b + ')=' + nT(Sv)) + '.<br>The means add to ' + t(nT(Sv) + '-(' + o.a + ')-' + o.b + '=' + nT(M)) + '.<br>(Check: ' + t('d=' + o.d) + '; the means are ' + t(means.join(',\\ ')) + '.)',
          hints: ['Count the terms: the means plus the two given numbers.', 'Add all the terms with ' + t('S_n=\\frac{n}{2}(t_1+t_n)') + ', then take away the two given numbers.'], text: 'sum of arithmetic means' });
      } }] },
    { num: '9', shared: function (r) { return pickWhere(function () { return { a: r.pick([200, 250, 300, 350, 400, 450, 500, 600]), c: r.pick([25, 50, 75, 100, 125, 150, 200]), N: r.int(20, 40) }; }, function (z) { return !(z.a === 500 && z.c === 125 && z.N === 30); }); },
      stem: function (o) { return 'Tamsin saves ' + t(money(o.a / 100)) + ' in the first week of a savings plan. Each week she saves ' + t(money(o.c / 100)) + ' more than the week before, for ' + o.N + ' weeks.'; },
      parts: [
        { id: '9a', level: 'EMG', make: function (r, o) {
          var l = (o.a + (o.N - 1) * o.c) / 100;
          return apxPart('How much does she save in week ' + o.N + '?', l, 2, { before: '\\$', cands: [[(o.a + o.N * o.c) / 100, 'u1l4-nd', 'Week ' + o.N + ' is ' + t(o.N - 1) + ' weeks after week 1: ' + t('t_{' + o.N + '}=t_1+' + (o.N - 1) + 'd') + '.']],
            sol: t('t_{' + o.N + '}=' + fx(o.a / 100, 2) + '+' + (o.N - 1) + '(' + fx(o.c / 100, 2) + ')=' + money(l)), hints: [t('t_n=t_1+(n-1)d') + ' gives one week’s amount.'], text: 'savings: one week', ansPre: '\\$' });
        } },
        { id: '9b', level: 'PRG', make: function (r, o) {
          var l = (o.a + (o.N - 1) * o.c) / 100, Sv = o.N * (o.a / 100 + l) / 2;
          return apxPart('How much does she save in total?', Sv, 2, { before: '\\$', cands: [[o.N * (o.a / 100 + l), 'u1l4-no-half', 'Remember the ' + t('\\frac{n}{2}') + '.'], [l, 'u1l4-gave-tn', 'That is one week’s amount. The total is a sum: ' + t('S_n') + '.']],
            sol: t('S_{' + o.N + '}=\\frac{' + o.N + '}{2}(' + fx(o.a / 100, 2) + '+' + fx(l, 2) + ')=' + half(o.N) + '(' + fx(o.a / 100 + l, 2) + ')=' + money(Sv)), hints: HL, text: 'savings: total', ansPre: '\\$' });
        } }] },
    { num: '10', parts: [
      { id: '10', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { N: r.int(12, 25), a: r.int(5, 15), s: r.int(2, 6) }; }, function (z) { return !(z.N === 20 && z.a === 10 && z.s === 4); });
        var l = o.a + (o.N - 1) * o.s, one = o.N * (o.a + l) / 2;
        return numPart('A gardener waters a straight row of ' + o.N + ' trees. The first tree is ' + o.a + ' m from the tap and the trees are ' + o.s + ' m apart. She fills one bucket at the tap, carries it to the first tree and walks back, then does the same for the second tree, and so on. How far has she walked when she has watered all ' + o.N + ' trees and is back at the tap?', 2 * one, {
          after: 'm', cands: [[one, 'u1l4-one-way', 'That is the one-way total. Each trip is there <b>and back</b>.'], [l, 'u1l4-gave-tn', 'That is the distance to the last tree. Add up all the trips.'], [2 * l, 'u1l4-gave-tn', 'That is only the last trip. Add up all ' + o.N + ' trips.'], [o.N * (2 * o.a + o.N * o.s), 'u1l4-nd', 'The last tree is ' + t(o.N - 1) + ' gaps from the first.']],
          sol: 'One-way distances: ' + t(o.a + ',\\ ' + (o.a + o.s) + ',\\ ' + (o.a + 2 * o.s) + ',\\ \\dots') + '; the ' + o.N + 'th tree is ' + t(o.a + '+' + (o.N - 1) + '(' + o.s + ')=' + l) + ' m away.<br>One-way total: ' + t('S_{' + o.N + '}=\\frac{' + o.N + '}{2}(' + o.a + '+' + l + ')=' + nT(one)) + ' m.<br>Each trip is there and back, so she walks ' + t('2(' + nT(one) + ')=' + nT(2 * one)) + ' m.',
          hints: ['Write the one-way distances to the trees: they form an arithmetic sequence.', 'She walks each distance twice (there and back).'], text: 'gardener’s total walk' });
      } }] },
    { num: '11', shared: function (r) {
        return pickWhere(function () { var p = r.int(3, 8), q = p + r.int(5, 12); return { a: r.int(14, 30), d: r.int(1, 4), p: p, q: q, N: r.int(q + 3, 32) }; }, function (z) { return !(z.a === 24 && z.d === 2) && !(z.a === 9 && z.d === 3); });
      },
      stem: function (o) { return 'The rows of seats in a theatre form an arithmetic sequence. Row ' + o.p + ' has ' + tN(o.a, o.d, o.p) + ' seats, row ' + o.q + ' has ' + tN(o.a, o.d, o.q) + ' seats, and there are ' + o.N + ' rows.'; },
      parts: [
        { id: '11a', level: 'PRG', make: function (r, o) {
          var A = tN(o.a, o.d, o.p), Bv = tN(o.a, o.d, o.q);
          return numPart('How many seats are in row 1?', o.a, { after: 'seats', cands: [[A - o.p * o.d, 'u1l4-row-step', 'Row ' + o.p + ' is ' + t(o.p - 1) + ' steps after row 1, not ' + t(o.p) + '.'], [o.d, 'u1l4-gave-d', 'That is ' + t('d') + ', the change from row to row. Now step back to row 1.']],
            sol: 'From row ' + o.p + ' to row ' + o.q + ' is ' + t(o.q - o.p) + ' steps: ' + t((o.q - o.p) + 'd=' + Bv + '-' + A + '=' + (Bv - A) + '\\Rightarrow d=' + o.d) + '.<br>' + t('t_1=' + A + '-' + (o.p - 1) + '(' + o.d + ')=' + o.a) + ' seats.', hints: ['Divide the change in seats by the number of steps between the two rows to get ' + t('d') + '.'], text: 'theatre: row 1' });
        } },
        { id: '11b', level: 'ADV', make: function (r, o) {
          var l = tN(o.a, o.d, o.N), Sv = o.N * (o.a + l) / 2;
          return numPart('How many seats are in the theatre?', Sv, { after: 'seats', cands: lastC(o.N, o.a, l).concat([[l, 'u1l4-gave-tn', 'That is the number of seats in the last row. Add up all the rows.']]),
            sol: t('t_{' + o.N + '}=' + o.a + '+' + (o.N - 1) + '(' + o.d + ')=' + l) + '<br>' + lSol(o.N, o.a, l) + ' seats.', hints: ['Find row 1 and the last row, then add all the rows with ' + t('S_n=\\frac{n}{2}(t_1+t_n)') + '.'], text: 'theatre: total seats' });
        } }] },
    { num: '12', shared: function (r) { return pickWhere(function () { return { a: r.int(1, 4), b: r.pick(range(-7, 7).filter(function (x) { return x; })), k: r.int(12, 25) }; }, function (z) { return !(z.a === 2 && z.b === -5) && !(z.a === 3 && z.b === 2) && z.a + z.b !== 0; }); },
      stem: function (o) { return 'An arithmetic series has ' + t('S_n=' + sTex(o.a, o.b)) + '.'; },
      parts: [
        { id: '12a', level: 'PRG', make: function (r, o) {
          var Sn = function (n) { return o.a * n * n + o.b * n; }, T = [1, 2, 3, 4].map(function (n) { return Sn(n) - Sn(n - 1); });
          return fieldsPart('Determine the first four terms of the sequence.', T.map(function (v, i) {
            return { label: t('t_' + (i + 1) + '='), name: 't' + (i + 1), ans: v, cands: [[Sn(i + 1), 'u1l4-sum-not-term', 'That is ' + t('S_' + (i + 1)) + ', a sum. The term is ' + t('t_' + (i + 1) + '=S_' + (i + 1) + '-S_' + i) + '.']] };
          }), { sol: t('S_1=' + Sn(1) + ',\\ S_2=' + Sn(2) + ',\\ S_3=' + Sn(3) + ',\\ S_4=' + Sn(4)) + '<br>' + t('t_1=S_1=' + T[0]) + ', ' + t('t_2=' + Sn(2) + '-' + sgp(Sn(1)) + '=' + T[1]) + ', ' + t('t_3=' + Sn(3) + '-' + sgp(Sn(2)) + '=' + T[2]) + ', ' + t('t_4=' + Sn(4) + '-' + sgp(Sn(3)) + '=' + T[3]),
            hints: [t('t_1=S_1') + ' and ' + t('t_n=S_n-S_{n-1}') + '.'], text: 'terms from S_n formula', bad: [[1, 2, 3, 4].map(function (n) { return String(Sn(n)); })] });
        } },
        { id: '12b', level: 'EMG', make: function (r, o) {
          var Sn = function (n) { return o.a * n * n + o.b * n; };
          return numPart('State ' + t('d') + '.', 2 * o.a, { before: t('d='), cands: [[o.a, 'u1l4-d-half', 'Work out the terms first (' + t('t_n=S_n-S_{n-1}') + '), then subtract consecutive terms.'], [Sn(2) - Sn(1), 'u1l4-gave-t2', 'That is ' + t('t_2') + '. ' + t('d=t_2-t_1') + '.']],
            sol: 'The terms are ' + t((Sn(1)) + ',\\ ' + (Sn(2) - Sn(1)) + ',\\ ' + (Sn(3) - Sn(2)) + ',\\ \\dots') + ', so ' + t('d=' + (Sn(2) - Sn(1)) + '-' + sgp(Sn(1)) + '=' + 2 * o.a) + '.', hints: ['Find two terms with ' + t('t_n=S_n-S_{n-1}') + ' and subtract them.'], text: 'd from S_n formula' });
        } },
        { id: '12c', level: 'ADV', make: function (r, o) {
          var Sn = function (n) { return o.a * n * n + o.b * n; }, k = o.k;
          return numPart('Determine ' + t('t_{' + k + '}') + '.', Sn(k) - Sn(k - 1), { before: t('t_{' + k + '}='), cands: [[Sn(k), 'u1l4-sum-not-term', 'That is ' + t('S_{' + k + '}') + ', the sum of the first ' + k + ' terms. Subtract ' + t('S_{' + (k - 1) + '}') + '.'], [Sn(k + 1) - Sn(k), 'u1l4-next-term', 'That is ' + t('t_{' + (k + 1) + '}=S_{' + (k + 1) + '}-S_{' + k + '}') + '. Use ' + t('t_{' + k + '}=S_{' + k + '}-S_{' + (k - 1) + '}') + '.']],
            sol: t('S_{' + k + '}=' + o.a + '(' + k * k + ')' + (o.b < 0 ? '-' : '+') + Math.abs(o.b * k) + '=' + nT(Sn(k))) + '<br>' + t('S_{' + (k - 1) + '}=' + o.a + '(' + (k - 1) * (k - 1) + ')' + (o.b < 0 ? '-' : '+') + Math.abs(o.b * (k - 1)) + '=' + nT(Sn(k - 1))) + '<br>' + t('t_{' + k + '}=' + nT(Sn(k)) + '-' + nT(Sn(k - 1)) + '=' + nT(Sn(k) - Sn(k - 1))),
            hints: [t('t_n=S_n-S_{n-1}') + ': the ' + k + 'th partial sum minus the ' + (k - 1) + 'th.'], text: 't_k from S_n formula' });
        } },
        { id: '12d', level: 'MAS', make: function (r) {
          var p = pickWhere(function () { return { p: r.int(1, 5), q: r.int(1, 4) }; }, function (z) { return !(z.p === 3 && z.q === 1); }), Sn = function (n) { return n * n + p.p * n + p.q; };
          var T = [1, 2, 3, 4].map(function (n) { return Sn(n) - (n > 1 ? Sn(n - 1) : 0); });
          return mcPart(r, 'A different series has ' + t('S_n=' + sTex(1, p.p) + '+' + p.q) + '. Which explanation shows that its terms do <b>not</b> form an arithmetic sequence?', [
            { html: t('S_1=' + Sn(1) + ',\\ S_2=' + Sn(2) + ',\\ S_3=' + Sn(3) + ',\\ S_4=' + Sn(4)) + ', so the terms are ' + t(T.join(',\\ ')) + '. The differences ' + t((T[1] - T[0]) + ',\\ ' + (T[2] - T[1]) + ',\\ ' + (T[3] - T[2])) + ' are not constant.', right: true },
            { html: t('S_n') + ' is a quadratic, and a quadratic sum never comes from an arithmetic sequence.', why: 'Arithmetic series have quadratic sums too (for example ' + t('S_n=n^2') + ' gives ' + t('1,3,5,\\dots') + '). Work out the terms and their differences.' },
            { html: 'The partial sums ' + t(Sn(1) + ',\\ ' + Sn(2) + ',\\ ' + Sn(3)) + ' don’t have a common difference.', why: 'Partial sums of an arithmetic series never have a common difference (unless ' + t('d=0') + '). Test the <b>terms</b>: ' + t('t_n=S_n-S_{n-1}') + '.' },
            { html: 'It is arithmetic: the terms go up by ' + t(2) + ' each time.', why: 'Check the first term: ' + t('t_1=S_1=' + Sn(1)) + ' and ' + t('t_2=' + T[1]) + ', a difference of ' + t(T[1] - T[0]) + ', not ' + t(2) + '.' }],
            'Terms: ' + t('t_1=S_1=' + T[0]) + ', ' + t('t_2=S_2-S_1=' + T[1]) + ', ' + t('t_3=' + T[2]) + ', ' + t('t_4=' + T[3]) + '. The differences are ' + t((T[1] - T[0]) + ',\\ ' + (T[2] - T[1]) + ',\\ ' + (T[3] - T[2])) + ': not constant, so the sequence is not arithmetic.', ['Find the terms with ' + t('t_n=S_n-S_{n-1}') + ', then look at the differences.'], 'S_n formula not arithmetic');
        } }] },
    { num: '13', shared: function (r) { return pickWhere(function () { return { a: r.int(2, 8), d: r.int(2, 6) }; }, function (z) { return Sf(z.a, z.d, 4) <= 70 && !(z.a === 4 && z.d === 3) && !(z.a === 5 && z.d === 6); }); },
      stem: function (o) {
        var pts = [1, 2, 3, 4].map(function (n) { return [n, Sf(o.a, o.d, n)]; }), ym = Math.ceil(pts[3][1] / 10) * 10 + (pts[3][1] % 10 === 0 ? 0 : 0);
        return 'The graph shows the points ' + t('(n,\\ S_n)') + ' for an arithmetic series.<div class="fig">' + HW.graph({ x: [0, 5], y: [0, ym], unitX: 44, unitY: 220 / ym, grid: 1, gridY: ym > 50 ? 10 : 5, labels: 1, labelsY: 10, xName: 'n', yName: 'Sₙ', firstQuadrant: true,
          points: pts.map(function (p) { return { x: p[0], y: p[1], label: '(' + p[0] + ', ' + p[1] + ')' }; }), max: 300, aria: 'points (n, S_n)' }) + '</div>';
      },
      parts: [
        { id: '13a', level: 'PRG', make: function (r, o) {
          var Sv = [1, 2, 3, 4].map(function (n) { return Sf(o.a, o.d, n); }), T = [1, 2, 3, 4].map(function (n) { return tN(o.a, o.d, n); });
          return fieldsPart('Determine ' + t('t_1') + ', ' + t('t_2') + ', ' + t('t_3') + ' and ' + t('t_4') + '.', T.map(function (v, i) {
            return { label: t('t_' + (i + 1) + '='), name: 't' + (i + 1), ans: v, cands: [[Sv[i], 'u1l4-sum-not-term', 'The graph shows sums. The term is ' + t('t_' + (i + 1) + '=S_' + (i + 1) + '-S_' + i) + '.']] };
          }), { sol: t('S') + '-values: ' + t(Sv.join(',\\ ')) + '.<br>' + t('t_1=' + T[0] + ',\\ t_2=' + Sv[1] + '-' + Sv[0] + '=' + T[1] + ',\\ t_3=' + Sv[2] + '-' + Sv[1] + '=' + T[2] + ',\\ t_4=' + Sv[3] + '-' + Sv[2] + '=' + T[3]),
            hints: ['Read the ' + t('S_n') + '-values from the graph, then subtract consecutive ones.'], text: 'terms from graph of S_n', bad: [Sv.map(String)] });
        } },
        { id: '13b', level: 'PRG', make: function (r, o) {
          return fieldsPart('State ' + t('d') + ' and determine ' + t('S_{10}') + '.', [
            { label: t('d='), name: 'd', ans: o.d },
            { label: t('S_{10}='), name: 'S₁₀', ans: Sf(o.a, o.d, 10), cands: sumC(o.a, o.d, 10) }],
            { sol: t('d=' + o.d) + '; ' + t('S_{10}=\\frac{10}{2}\\left[2(' + o.a + ')+9(' + o.d + ')\\right]=5(' + (2 * o.a + 9 * o.d) + ')=' + Sf(o.a, o.d, 10)), hints: HS, text: 'd and S10 from graph' });
        } }] },
    { num: '14', parts: [
      { id: '14', level: 'BEG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(15, 30), d: -r.int(3, 7), g: r.int(2, 4), gr: r.int(2, 3), e: r.int(2, 9), f: r.int(3, 6), m: r.int(1, 3) }; }, function (z) { return !(z.a === 20 && z.d === -6); });
        var ar = [0, 1, 2, 3].map(function (k) { return o.a + k * o.d; }), ser = function (arr) { return t(arr.map(function (x, i) { return i && x < 0 ? '(' + x + ')' : String(x); }).join('+')); };
        return mcPart(r, '<i>(Multiple Choice)</i> Which of the following is an arithmetic series?', [
          { html: ser(ar), right: true },
          { html: ser([0, 1, 2, 3].map(function (k) { return o.g * Math.pow(o.gr, k); })), why: 'Each term is <b>multiplied</b> by ' + t(o.gr) + ': that is a geometric series, not arithmetic.' },
          { html: t([0, 1, 2, 3].map(function (k) { return o.e + k * o.f; }).join(',\\ ')), why: 'The terms have a common difference, but they are separated by commas: that is a <b>sequence</b>, not a series.' },
          { html: ser([0, 1, 2, 3].map(function (k) { return (o.m + k) * (o.m + k); })), why: 'The differences are ' + t((2 * o.m + 1) + ',\\ ' + (2 * o.m + 3) + ',\\ ' + (2 * o.m + 5)) + ': no common difference.' }],
          ser(ar) + ': the terms differ by ' + t(o.d) + ' and they are added, so it is an arithmetic series.', ['A series adds terms; arithmetic means a common difference.'], 'which is an arithmetic series');
      } }] },
    { num: '15', parts: [
      { id: '15', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(8, 20), d: -r.int(2, 5), N: 2 * r.int(15, 25) }; }, function (z) { return !(z.a === 12 && z.d === -3 && z.N === 40); });
        var c = sumC(o.a, o.d, o.N), right = Sf(o.a, o.d, o.N);
        return mcPart(r, '<i>(Multiple Choice)</i> The sum of the first ' + o.N + ' terms of the series ' + t(serTex([o.a, o.a + o.d, o.a + 2 * o.d])) + ' is', [
          { html: t(nT(right)), right: true }, { html: t(nT(c[0][0])), why: c[0][2] }, { html: t(nT(c[1][0])), why: c[1][2] }, { html: t(nT(c[3][0])), why: c[3][2] }],
          t('S_{' + o.N + '}=\\frac{' + o.N + '}{2}\\left[2(' + o.a + ')+' + (o.N - 1) + '(' + o.d + ')\\right]=' + o.N / 2 + '(' + (2 * o.a + (o.N - 1) * o.d) + ')=' + nT(right)), HS, 'MC: S_40 decreasing');
      } }] },
    { num: '16', parts: [
      { id: '16', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(3, 12), d: r.int(2, 6), n: 2 * r.int(8, 15) }; }, function (z) { return !(z.a === 7 && z.d === 4 && z.n === 24); });
        var l = tN(o.a, o.d, o.n), Sv = o.n * (o.a + l) / 2;
        return mcPart(r, '<i>(Multiple Choice)</i> An arithmetic series has first term ' + t(o.a) + ', last term ' + t(l) + ' and sum ' + t(nT(Sv)) + '. The number of terms is', [
          { html: t(o.n), right: true }, { html: t(o.n / 2), why: 'Remember the ' + t('\\frac{n}{2}') + ': ' + t(nT(Sv) + '=\\frac{n}{2}(' + o.a + '+' + l + ')') + '.' }, { html: t(o.n - 1), why: 'That is ' + t('n-1') + '. Solve ' + t(nT(Sv) + '=\\frac{n}{2}(' + (o.a + l) + ')') + ' for ' + t('n') + '.' }, { html: t(o.n + 1), why: 'Solve ' + t(nT(Sv) + '=\\frac{n}{2}(' + (o.a + l) + ')') + ' for ' + t('n') + ' carefully.' }],
          t(nT(Sv) + '=\\frac{n}{2}(' + o.a + '+' + l + ')=' + nT((o.a + l) / 2) + 'n\\Rightarrow n=' + o.n), HL, 'MC: number of terms from first, last, sum', true);
      } }] },
    { num: '17', parts: [
      { id: '17', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 9), b: r.int(-5, 9), N: r.int(15, 40) }; }, function (z) { var s = z.N * ((z.a + z.b) + (z.a * z.N + z.b)) / 2; return s > 0 && s <= 9999 && isInt(s) && z.b !== 0 && !(z.a === 6 && z.b === 5 && z.N === 30); });
        var t1 = o.a + o.b, l = o.a * o.N + o.b, Sv = o.N * (t1 + l) / 2;
        return numPart('<i>(Numerical Response)</i> The general term of an arithmetic sequence is ' + t('t_n=' + o.a + 'n' + (o.b < 0 ? '-' : '+') + Math.abs(o.b)) + '. The sum of the first ' + o.N + ' terms is ______.', Sv, { nr: true,
          cands: [[o.N * (o.b + l) / 2, 'u1l4-t0', 'The first term is ' + t('t_1=' + o.a + '(1)' + (o.b < 0 ? '-' : '+') + Math.abs(o.b) + '=' + t1) + ' (not ' + t(o.b) + ').'], [o.N * (t1 + l), 'u1l4-no-half', 'Remember the ' + t('\\frac{n}{2}') + '.'], [l, 'u1l4-gave-tn', 'That is ' + t('t_{' + o.N + '}') + '. Now add the terms.']],
          sol: t('t_1=' + t1 + ',\\ t_{' + o.N + '}=' + l) + '; ' + lSol(o.N, t1, l), hints: ['Use the general term to find ' + t('t_1') + ' and ' + t('t_{' + o.N + '}') + ', then ' + t('S_n=\\frac{n}{2}(t_1+t_n)') + '.'], text: 'NR: sum from general term' });
      } }] },
    { num: '18', parts: [
      { id: '18', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { var a = r.int(5, 25), n = r.int(8, 25); return { a: a, d: 2, n: n, S: Sf(a, 2, n) }; }, function (z) { return howMany(z.a, z.d, z.S).ok && !(z.a === 15 && z.n === 16); });
        var h = howMany(o.a, o.d, o.S);
        return numPart('<i>(Numerical Response)</i> The number of terms of the series ' + t(serTex([o.a, o.a + 2, o.a + 4])) + ' needed to give a sum of ' + t(nT(o.S)) + ' is ______.', h.n0, { nr: true, cands: howC(h), sol: howSol(o.a, o.d, o.S, h), hints: HQ, text: 'NR: how many terms' });
      } }] }
  ];
  function sTex(a, b) { return (a === 1 ? '' : a) + 'n^2' + (b ? (b < 0 ? '-' : '+') + (Math.abs(b) === 1 ? '' : Math.abs(b)) + 'n' : ''); }
  function word(k) { return ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'][k] || String(k); }
  /* Q5 / EP3: the sum when the last term is given — find n, then S */
  function lastPart(a, d, n, text) {
    var l = tN(a, d, n), Sv = n * (a + l) / 2;
    return fieldsPart(t(serTex([a, a + d, a + 2 * d], l)), [
      { label: 'Number of terms ' + t('n='), name: 'n', ans: n, cands: [[n - 1, 'u1l4-n-minus-one', 'That is ' + t('n-1') + ' (the number of steps). Add ' + t('1') + ' to get the number of terms.'], [n + 1, 'u1l4-n-minus-one', 'Check: ' + t('t_n=t_1+(n-1)d') + '.']] },
      { label: 'Sum ' + t('S_n='), name: 'sum', ans: Sv, cands: lastC(n, a, l) }],
      { sol: t('t_1=' + a + ',\\ d=' + d + ',\\ t_n=' + l) + '. Find ' + t('n') + ' first:<br>' + t(l + '=' + a + (d < 0 ? '' : '+') + d + '(n-1)\\Rightarrow ' + (l - a) + '=' + d + '(n-1)\\Rightarrow n-1=' + (n - 1) + '\\Rightarrow n=' + n) + '<br>' + lSol(n, a, l),
        hints: HN, text: text });
  }

  /* ======================= Lesson 4 Extra Practice ======================= */
  var EXTRA = [
    { num: '1', section: 'A. Skills', stem: 'Determine the sum of each arithmetic series.', parts: [
      { id: 'e1a', level: 'BEG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(5, 15), d: r.int(2, 5), n: r.int(12, 24) }; }, function (z) { return !(z.a === 10 && z.d === 3 && z.n === 18); });
        return numPart(t(serTex([o.a, o.a + o.d, o.a + 2 * o.d])) + ' (first ' + o.n + ' terms)', Sf(o.a, o.d, o.n), { cands: sumC(o.a, o.d, o.n), sol: sSol2(o.n, qi(o.a), qi(o.d)), hints: HS, text: 'sum (increasing)' });
      } },
      { id: 'e1b', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(30, 60), d: -r.int(4, 8), n: r.int(12, 18) }; }, function (z) { return !(z.a === 40 && z.d === -6 && z.n === 15) && tN(z.a, z.d, z.n) < 0; });
        return numPart(t(serTex([o.a, o.a + o.d, o.a + 2 * o.d])) + ' (first ' + o.n + ' terms)', Sf(o.a, o.d, o.n), { cands: sumC(o.a, o.d, o.n), sol: sSol2(o.n, qi(o.a), qi(o.d)), hints: HS, text: 'sum (decreasing)' });
      } },
      { id: 'e1c', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { a: -r.pick([1.5, 2.5, 3.5, 4.5, 5.5]), d: r.pick([0.5, 1.5, 2.5]), n: r.int(10, 16) }; }, function (z) { return !(z.a === -2.5 && z.d === 1.5 && z.n === 12); });
        var t1 = Q(o.a * 2, 2), d = Q(o.d * 2, 2), terms = [t1, qa(t1, d), qa(t1, qm(qi(2), d))];
        return numPart(t(serTex(terms)) + ' (first ' + o.n + ' terms)', qv(S(t1, d, o.n)), { cands: sumC(t1, d, o.n), sol: sSol2(o.n, t1, d, true), hints: HS, text: 'sum with decimals' });
      } },
      { id: 'e1d', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { var q = r.pick([4, 3, 6]); return { t1: Q(r.int(q + 1, 3 * q), q), d: Q(-r.int(1, 2), r.pick([3, 4, 6])), n: r.int(7, 12) }; },
          function (z) { var s = S(z.t1, z.d, z.n); return z.t1[1] !== 1 && z.d[1] !== 1 && s[1] !== 1 && !(z.t1[0] === 3 && z.t1[1] === 4 && z.d[1] === 4 && z.n === 9); });
        var terms = [o.t1, qa(o.t1, o.d), qa(o.t1, qm(qi(2), o.d))];
        return numPart(t(terms.map(function (x, i) { return i && qv(x) < 0 ? qTex(x, true) : qTex(x); }).join('+') + '+\\dots') + ' (first ' + o.n + ' terms)', S(o.t1, o.d, o.n), { cands: sumC(o.t1, o.d, o.n),
          sol: t('d=' + qTex(terms[1]) + '-' + qTex(o.t1, qv(o.t1) < 0) + '=' + qTex(o.d)) + '<br>' + sSol2(o.n, o.t1, o.d), hints: HS.concat(['Give the exact answer as a fraction.']), text: 'sum with fractions (decreasing)' });
      } }] },
    { num: '2', stem: 'Determine each sum from the first and last terms.', parts: [
      { id: 'e2a', level: 'BEG', make: function (r) {
        var o = pickWhere(function () { var a = r.int(3, 12), d = r.int(3, 6), N = r.int(20, 30); return { a: a, N: N, l: a + (N - 1) * d }; }, function (z) { return isInt(z.N * (z.a + z.l) / 2) && !(z.a === 5 && z.N === 26); });
        return numPart(t('t_1=' + o.a + ',\\ t_{' + o.N + '}=' + o.l), o.N * (o.a + o.l) / 2, { cands: lastC(o.N, o.a, o.l), sol: lSol(o.N, o.a, o.l), hints: HL, text: 'sum from first and last' });
      } },
      { id: 'e2b', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { var a = r.int(30, 60), d = -r.int(3, 6), N = 2 * r.int(6, 10) + 1; return { a: a, N: N, l: a + (N - 1) * d }; }, function (z) { return z.l < 0 && isInt(z.N * (z.a + z.l) / 2) && !(z.a === 48 && z.N === 17); });
        return numPart(t('t_1=' + o.a + ',\\ t_{' + o.N + '}=' + o.l), o.N * (o.a + o.l) / 2, { cands: lastC(o.N, o.a, o.l), sol: lSol(o.N, o.a, o.l), hints: HL, text: 'sum from first and last (to a negative)' });
      } }] },
    { num: '3', stem: 'Determine each sum.', parts: [
      { id: 'e3a', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(3, 12), d: r.int(3, 7), n: r.int(18, 30) }; }, function (z) { return !(z.a === 7 && z.d === 5) && !(z.a === 8 && z.d === 9); });
        return lastPart(o.a, o.d, o.n, 'sum with last term');
      } },
      { id: 'e3b', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: -r.int(2, 6), d: -r.int(5, 9), n: r.int(10, 16) }; }, function (z) { return !(z.a === -3 && z.d === -7); });
        return lastPart(o.a, o.d, o.n, 'sum with last term (negative terms)');
      } }] },
    { num: '4', parts: [
      { id: 'e4', level: 'BEG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(10, 20), d: -r.int(2, 5) }; }, function (z) { return !(z.a === 11 && z.d === -3); });
        var T = [0, 1, 2, 3].map(function (k) { return o.a + k * o.d; }), Sv = [], s = 0; T.forEach(function (x) { s += x; Sv.push(s); });
        return fieldsPart('For the sequence ' + t(T.join(',\\ ') + ',\\ \\dots') + ', write ' + t('S_1') + ', ' + t('S_2') + ', ' + t('S_3') + ' and ' + t('S_4') + '.', Sv.map(function (v, i) {
          return { label: t('S_' + (i + 1) + '='), name: 'S' + (i + 1), ans: v, cands: i ? [[T[i], 'u1l4-term-not-sum', 'That is ' + t('t_' + (i + 1)) + '. Add it to ' + t('S_' + i) + '.']] : [] };
        }), { sol: Sv.map(function (v, i) { return t('S_' + (i + 1) + '=' + (i ? '' : 't_1=') + T.slice(0, i + 1).map(function (x, j) { return j && x < 0 ? '(' + x + ')' : x; }).join('+') + (i ? '=' + v : '')); }).join('<br>'), hints: [t('S_n') + ' is the sum of the first ' + t('n') + ' terms.'], text: 'partial sums', bad: [T.map(String)] });
      } }] },
    { num: '5', section: 'B. Applying', parts: [
      { id: 'e5', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { var a = r.int(5, 15), n = r.int(10, 20); return { a: a, d: 2, n: n, S: Sf(a, 2, n) }; }, function (z) { return howMany(z.a, z.d, z.S).ok && !(z.a === 9 && z.n === 12) && !(z.a === 3 && z.n === 13) && !(z.a === 15 && z.n === 16); });
        var h = howMany(o.a, o.d, o.S);
        return numPart('How many terms of the series ' + t(serTex([o.a, o.a + 2, o.a + 4])) + ' must be added to give ' + t(nT(o.S)) + '?', h.n0, { cands: howC(h), sol: howSol(o.a, o.d, o.S, h), hints: HQ, text: 'how many terms', after: 'terms' });
      } }] },
    { num: '6', parts: [
      { id: 'e6', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(1, 6), n: r.int(10, 16), d: r.int(2, 6) }; }, function (z) { return !(z.a === 1 && z.n === 12 && z.d === 4); });
        var Sv = Sf(o.a, o.d, o.n), l = tN(o.a, o.d, o.n), X = 2 * Sv / o.n;
        return fieldsPart('An arithmetic series has ' + t('t_1=' + o.a) + ' and ' + t('S_{' + o.n + '}=' + nT(Sv)) + '. Determine ' + t('d') + ' and ' + t('t_{' + o.n + '}') + '.', [
          { label: t('d='), name: 'd', ans: o.d, cands: [[(Sv / o.n - 2 * o.a) / (o.n - 1), 'u1l4-no-half', 'Remember the ' + t('\\frac{n}{2}') + '.']] },
          { label: t('t_{' + o.n + '}='), name: 't_n', ans: l, cands: [[o.a + o.n * o.d, 'u1l4-nd', t('t_{' + o.n + '}=t_1+' + (o.n - 1) + 'd') + '.']] }],
          { sol: t(nT(Sv) + '=\\frac{' + o.n + '}{2}\\left[2(' + o.a + ')+' + (o.n - 1) + 'd\\right]\\Rightarrow ' + nT(X) + '=' + 2 * o.a + '+' + (o.n - 1) + 'd\\Rightarrow d=' + o.d) + '<br>' + t('t_{' + o.n + '}=' + o.a + '+' + (o.n - 1) + '(' + o.d + ')=' + l), hints: ['Substitute into ' + t('S_n=\\frac{n}{2}\\left[2t_1+(n-1)d\\right]') + ' and solve for ' + t('d') + '.'], text: 'd and t_n from t1 and S_n' });
      } }] },
    { num: '7', parts: [
      { id: 'e7', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { B: r.int(18, 30), T: r.int(5, 10) }; }, function (z) { return !(z.B === 24 && z.T === 8); });
        var n = o.B - o.T + 1, Sv = n * (o.B + o.T) / 2;
        return fieldsPart('Logs are stacked in layers. The bottom layer has ' + o.B + ' logs and each layer has one log fewer than the layer below it. The top layer has ' + o.T + ' logs. How many layers are there, and how many logs?', [
          { label: 'Layers', name: 'layers', ans: n, cands: [[n - 1, 'u1l4-n-minus-one', 'Solve ' + t(o.T + '=' + o.B + '-(n-1)') + ': you need ' + t('n') + ', not ' + t('n-1') + '.']] },
          { label: 'Logs', name: 'logs', ans: Sv, cands: [[(n - 1) * (o.B + o.T) / 2, 'u1l4-n-minus', 'Use the number of layers you found.'], [n * (o.B + o.T), 'u1l4-no-half', 'Remember the ' + t('\\frac{n}{2}') + '.']] }],
          { sol: t(o.T + '=' + o.B + '-(n-1)\\Rightarrow n=' + n) + ' layers; ' + lSol(n, o.B, o.T) + ' logs.', hints: [t('t_1=' + o.B) + ', ' + t('d=-1') + ', ' + t('t_n=' + o.T) + '. Find ' + t('n') + ', then the sum.'], text: 'log pile' });
      } }] },
    { num: '8', shared: function (r) { return pickWhere(function () { return { s: 500 * r.int(70, 120), c: 100 * r.int(10, 25), N: r.int(8, 15) }; }, function (z) { return !(z.s === 42500 && z.c === 1800); }); },
      stem: function (o) { return 'An engineer’s starting salary is ' + t(money(o.s).replace('.00', '')) + ', with a raise of ' + t(money(o.c).replace('.00', '')) + ' every year.'; },
      parts: [
        { id: 'e8a', level: 'EMG', make: function (r, o) {
          var l = o.s + (o.N - 1) * o.c;
          return numPart('What is the salary in year ' + o.N + '?', l, { before: '\\$', cands: [[o.s + o.N * o.c, 'u1l4-nd', 'Year ' + o.N + ' is ' + (o.N - 1) + ' raises after year 1.']], sol: t('t_{' + o.N + '}=' + nT(o.s) + '+' + (o.N - 1) + '(' + nT(o.c) + ')=\\$' + nT(l)), hints: [t('t_n=t_1+(n-1)d') + '.'], text: 'salary in year N', ansPre: '\\$' });
        } },
        { id: 'e8b', level: 'PRG', make: function (r, o) {
          var l = o.s + (o.N - 1) * o.c, Sv = o.N * (o.s + l) / 2;
          return numPart('What are the total earnings over the first ' + o.N + ' years?', Sv, { before: '\\$', cands: lastC(o.N, o.s, l), sol: t('S_{' + o.N + '}=\\frac{' + o.N + '}{2}(' + nT(o.s) + '+' + nT(l) + ')=\\$' + nT(Sv)), hints: HL, text: 'total earnings', ansPre: '\\$' });
        } }] },
    { num: '9', parts: [
      { id: 'e9', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { a: r.int(2, 6), b: r.pick([-4, -3, -2, -1, 1, 2, 3, 4]), k: r.int(10, 15) }; }, function (z) { return !(z.a === 5 && z.b === -1) && !(z.a === 3 && z.b === 2) && !(z.a === 2 && z.b === -5); });
        var Sn = function (n) { return o.a * n * n + o.b * n; }, k = o.k;
        return fieldsPart('An arithmetic series has ' + t('S_n=' + sTex(o.a, o.b)) + '. Determine ' + t('t_1') + ', ' + t('d') + ' and ' + t('t_{' + k + '}') + '.', [
          { label: t('t_1='), name: 't₁', ans: Sn(1) },
          { label: t('d='), name: 'd', ans: 2 * o.a, cands: [[Sn(2), 'u1l4-sum-not-term', 'Find ' + t('t_2=S_2-S_1') + ' first, then ' + t('d=t_2-t_1') + '.'], [Sn(2) - Sn(1), 'u1l4-gave-t2', 'That is ' + t('t_2') + '. Subtract ' + t('t_1') + '.']] },
          { label: t('t_{' + k + '}='), name: 't_k', ans: Sn(k) - Sn(k - 1), cands: [[Sn(k), 'u1l4-sum-not-term', 'That is ' + t('S_{' + k + '}') + '. Subtract ' + t('S_{' + (k - 1) + '}') + '.']] }],
          { sol: t('S_1=' + Sn(1) + ',\\ S_2=' + Sn(2) + ',\\ S_3=' + Sn(3)) + ': terms ' + t(Sn(1) + ',\\ ' + (Sn(2) - Sn(1)) + ',\\ ' + (Sn(3) - Sn(2))) + ', so ' + t('t_1=' + Sn(1)) + ', ' + t('d=' + 2 * o.a) + '.<br>' + t('t_{' + k + '}=S_{' + k + '}-S_{' + (k - 1) + '}=' + nT(Sn(k)) + '-' + nT(Sn(k - 1)) + '=' + nT(Sn(k) - Sn(k - 1))), hints: [t('t_1=S_1') + ', ' + t('t_n=S_n-S_{n-1}') + '.'], text: 't1, d, t_k from S_n formula' });
      } }] },
    { num: '10', parts: [
      { id: 'e10', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { var p = r.int(2, 4); return { p: p, q: p + r.int(4, 8), d: r.int(2, 6), a: r.int(1, 9), N: 2 * r.int(8, 12) }; }, function (z) { return !(z.p === 3 && z.q === 9 && z.d === 4 && z.a === 3); });
        var A = tN(o.a, o.d, o.p), Bv = tN(o.a, o.d, o.q), l = tN(o.a, o.d, o.N), Sv = o.N * (o.a + l) / 2;
        return mcPart(r, '<i>(Multiple Choice)</i> In an arithmetic sequence ' + t('t_{' + o.p + '}=' + A) + ' and ' + t('t_{' + o.q + '}=' + Bv) + '. The sum of the first ' + o.N + ' terms is', [
          { html: t(nT(Sv)), right: true }, { html: t(nT(o.N * (o.a + l - o.d) / 2)), why: t('t_{' + o.N + '}=t_1+' + (o.N - 1) + 'd') + '. Check your last term.' },
          { html: t(nT(o.N * (A + A + (o.N - 1) * o.d) / 2)), why: t(A) + ' is ' + t('t_{' + o.p + '}') + ', not ' + t('t_1') + '. Step back to the first term.' }, { html: t(nT(o.N * (o.a + l))), why: 'Remember the ' + t('\\frac{n}{2}') + '.' }],
          t((o.q - o.p) + 'd=' + Bv + '-' + A + '\\Rightarrow d=' + o.d) + ', ' + t('t_1=' + A + '-' + (o.p - 1) + '(' + o.d + ')=' + o.a) + ', ' + t('t_{' + o.N + '}=' + l) + '; ' + lSol(o.N, o.a, l) + '.', ['Find ' + t('d') + ' and ' + t('t_1') + ' from the two terms first.'], 'MC: sum from two terms');
      } }] },
    { num: '11', parts: [
      { id: 'e11', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { return { k: r.int(3, 9), M: r.int(15, 40) }; }, function (z) { return z.k * z.M * (z.M + 1) / 2 <= 9999 && !(z.k === 7 && z.M === 28); });
        var L = o.k * o.M, Sv = o.M * (o.k + L) / 2;
        return numPart('<i>(Numerical Response)</i> The sum of all the multiples of ' + o.k + ' from ' + o.k + ' to ' + L + ' is ______.', Sv, { nr: true, cands: [[(o.M - 1) * (o.k + L) / 2, 'u1l4-count', 'Count the multiples: ' + t(L + '\\div ' + o.k + '=' + o.M) + '.'], [o.M * (o.k + L), 'u1l4-no-half', 'Remember the ' + t('\\frac{n}{2}') + '.']],
          sol: t('n=' + L + '\\div ' + o.k + '=' + o.M) + '; ' + lSol(o.M, o.k, L), hints: ['Count the terms first: divide the last multiple by ' + t(o.k) + '.'], text: 'NR: sum of multiples' });
      } }] },
    { num: '12', section: 'C. Stretch', parts: [
      { id: 'e12', level: 'MAS', make: function (r) {
        var n = r.pick(range(15, 45).filter(function (x) { return x !== 20; })), Sv = n * (n + 1) / 2;
        return numPart('The sum of the first ' + t('n') + ' natural numbers, ' + t('1+2+3+\\dots+n') + ', is ' + t(nT(Sv)) + '. Determine ' + t('n') + '.', n, { before: t('n='), cands: [[n + 1, 'u1l4-other-root', 'Check: substitute your ' + t('n') + ' into ' + t('\\frac{n}{2}(1+n)') + '.']],
          sol: t('\\frac{n}{2}(1+n)=' + nT(Sv) + '\\Rightarrow n^{2}+n-' + nT(2 * Sv) + '=0\\Rightarrow (n+' + (n + 1) + ')(n-' + n + ')=0\\Rightarrow n=' + n) + ' (' + t('-' + (n + 1)) + ' rejected).', hints: ['Use ' + t('S_n=\\frac{n}{2}(t_1+t_n)') + ' with ' + t('t_1=1') + ' and ' + t('t_n=n') + '.', 'You get a quadratic. Find two numbers that multiply to ' + t('-' + nT(2 * Sv)) + ' and add to ' + t('1') + '.'], text: 'n from 1 + 2 + … + n' });
      } }] },
    { num: '13', parts: [
      { id: 'e13', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { var m = r.int(5, 15); return { m: m, d: r.int(2, m - 1) }; }, function (z) { return !(z.m === 9 && z.d === 4); });
        var a = o.m - o.d, b = o.m, c = o.m + o.d, P = a * b * c;
        return fieldsPart('Three consecutive terms of an arithmetic sequence add to ' + t(3 * o.m) + ' and multiply to ' + t(nT(P)) + '. Determine the terms, from smallest to largest. (Hint: call them ' + t('m-d') + ', ' + t('m') + ', ' + t('m+d') + '.)', [
          { label: 'Smallest', name: 'smallest', ans: a }, { label: 'Middle', name: 'middle', ans: b, cands: [[3 * o.m, 'u1l4-mid', 'The three terms add to ' + t(3 * o.m) + ', so ' + t('3m=' + 3 * o.m) + '.']] }, { label: 'Largest', name: 'largest', ans: c }],
          { sol: t('(m-d)+m+(m+d)=3m=' + 3 * o.m + '\\Rightarrow m=' + o.m) + '<br>' + t('(' + o.m + '-d)(' + o.m + ')(' + o.m + '+d)=' + nT(P) + '\\Rightarrow ' + o.m * o.m + '-d^{2}=' + (P / o.m) + '\\Rightarrow d^{2}=' + o.d * o.d + '\\Rightarrow d=\\pm ' + o.d) + '<br>The terms are ' + t(a + ',\\ ' + b + ',\\ ' + c) + ' (or ' + t(c + ',\\ ' + b + ',\\ ' + a) + ').',
            hints: ['The sum ' + t('(m-d)+m+(m+d)') + ' simplifies to ' + t('3m') + '.', 'Then use the product: ' + t('(m-d)(m+d)=m^{2}-d^{2}') + '.'], text: 'three terms from sum and product', bad: [[String(c), String(b), String(a)]] });
      } }] },
    { num: '14', parts: [
      { id: 'e14', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { var pq = r.pick([[5, 10], [4, 10], [6, 12], [4, 8]]); return { p: pq[0], q: pq[1], a: r.int(-5, 9), d: r.int(2, 6) }; }, function (z) { return !(z.p === 5 && z.a === 2 && z.d === 3) && z.a !== 0; });
        var Sp = Sf(o.a, o.d, o.p), Sq = Sf(o.a, o.d, o.q), A1 = 2 * Sp / o.p, A2 = 2 * Sq / o.q;
        return fieldsPart('An arithmetic series has ' + t('S_{' + o.p + '}=' + nT(Sp)) + ' and ' + t('S_{' + o.q + '}=' + nT(Sq)) + '. Determine ' + t('t_1') + ' and ' + t('d') + '.', [
          { label: t('t_1='), name: 't₁', ans: o.a }, { label: t('d='), name: 'd', ans: o.d }],
          { sol: t(nT(Sp) + '=\\frac{' + o.p + '}{2}(2t_1+' + (o.p - 1) + 'd)\\Rightarrow 2t_1+' + (o.p - 1) + 'd=' + A1) + '<br>' + t(nT(Sq) + '=\\frac{' + o.q + '}{2}(2t_1+' + (o.q - 1) + 'd)\\Rightarrow 2t_1+' + (o.q - 1) + 'd=' + A2) + '<br>Subtract: ' + t((o.q - o.p) + 'd=' + (A2 - A1) + '\\Rightarrow d=' + o.d) + ', then ' + t('2t_1=' + A1 + '-' + (o.p - 1) * o.d + '\\Rightarrow t_1=' + o.a) + '.',
            hints: ['Write each sum with ' + t('S_n=\\frac{n}{2}\\left[2t_1+(n-1)d\\right]') + ': two linear equations.', 'Subtract the equations to eliminate ' + t('2t_1') + '.'], text: 't1 and d from two sums' });
      } }] }
  ];

  HW.defineLesson({ id: 'u1l4', unit: 1, num: 4, title: 'Arithmetic Series', outcome: 'RF9', questions: QUESTIONS, extra: EXTRA });
})(window);
