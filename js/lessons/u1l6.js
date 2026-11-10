/* Math 20-1 · Unit 1 · Lesson 6 — Geometric Growth and Decay (outcome RF10 on every part)
 * Assignment 6 (m201book unit1/u1_l06.tex, Questions 1–18) and the Lesson 6 Extra Practice (u1_ep06.tex, Questions 1–14).
 * Every part is a generator: the booklet question's idea, form and difficulty with new numbers and contexts varied
 * slightly (the lesson's example numbers and the booklet question's own numbers are left out). On-screen calculator
 * allowed (Unit 1): each part states the rounding asked and accepts the value rounded that way (an exact value that
 * needs fewer places is fine). Growth factors are exact; a non-terminating fraction (2/3) may also be given to 3 places.
 * "When does it pass the target?" items use a table of values (no logarithms): Q5(b) and Q6(b) ask for the whole
 * number of periods and the time, as the booklet now does.
 * Recognised mistakes: the rate for the factor, increase/decrease swapped, the part lost for the part kept, off-by-one
 * period counts (where the sequence starts), simple instead of compound growth, time units for periods, the length
 * factor for the area factor, the rate as a decimal or as a growth factor where a percent is asked.
 * Conversions: Raj's mistake, "which term", factor → percent change, caffeine clock time -> multiple choice;
 * dimensions / areas / first four terms -> labelled boxes; numerical response -> a 4-character box.
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: Q13 (deposits), Extra 12(b), Extra 14. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, B = K.P, ex = HW.ex, F = HW.fmt, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var LID = 'u1l6';

  var CODES = {
    'u1l6-rate': 'Growth factor: gave the rate, not 1 ± rate', 'u1l6-percent': 'Growth factor: used the percent as a number', 'u1l6-direction': 'Increase and decrease mixed up',
    'u1l6-lost': 'Used the part lost instead of the part kept', 'u1l6-pct': 'Percent given as a decimal or factor', 'u1l6-off-one': 'Counted one period too many or too few',
    'u1l6-rate-used': 'Used the rate as the growth factor', 'u1l6-simple': 'Simple (linear) growth instead of compound', 'u1l6-periods': 'Used the time instead of the number of periods',
    'u1l6-gave-periods': 'Gave the number of periods instead of the time (or the reverse)', 'u1l6-minutes': 'Time left in minutes', 'u1l6-table-early': 'Table: stopped one period early', 'u1l6-table-late': 'Table: went one period too far',
    'u1l6-factor': 'Gave the growth factor instead of the percent', 'u1l6-ratio-pct': 'Gave the new value as a percent of the old (not the growth)', 'u1l6-total-growth': 'Rate: gave the total growth, not the yearly rate',
    'u1l6-area-factor': 'Area: used the length factor', 'u1l6-extra-dep': 'Deposits: counted the deposit not yet made', 'u1l6-no-interest': 'Deposits: no interest', 'u1l6-same-time': 'Deposits: all grown for the same time',
    'u1l6-monthly': 'Monthly compounding: wrong rate or number of periods', 'u1l6-gt-rn': 'Expression: rⁿ instead of rⁿ⁻¹', 'u1l6-gt-rate': 'Expression: used the rate as r', 'u1l6-gt-dir': 'Expression: increase instead of decrease',
    'u1l6-gt-letter': 'Expression: a letter other than n', 'u1l6-gt-no-n': 'Expression: no n in it', 'u1l6-gt-ratio': 'Expression: right start, wrong factor', 'u1l6-gt-t1': 'Expression: wrong starting value',
    'u1l6-list-count': 'Wrong number of values', 'u1l6-list-order': 'Values out of order', 'u1l6-list': 'Wrong values in the list'
  };
  HW.addCodes(Object.keys(CODES).filter(function (k) { return !HW.CODES[k]; }).reduce(function (o, k) { o[k] = CODES[k]; return o; }, {}));
  HW.addPartial({ 'u1l6-rate': 'b', 'u1l6-percent': 's', 'u1l6-direction': 'b', 'u1l6-lost': 'b', 'u1l6-off-one': 's', 'u1l6-rate-used': 'b', 'u1l6-simple': 'b', 'u1l6-periods': 'b',
    'u1l6-gave-periods': 's', 'u1l6-minutes': 's', 'u1l6-table-early': 's', 'u1l6-table-late': 's', 'u1l6-factor': 's', 'u1l6-ratio-pct': 's', 'u1l6-total-growth': 'b', 'u1l6-area-factor': 'b',
    'u1l6-extra-dep': 's', 'u1l6-no-interest': 'n', 'u1l6-same-time': 'b', 'u1l6-monthly': 'b', 'u1l6-gt-rn': 's', 'u1l6-gt-rate': 'b', 'u1l6-gt-dir': 'b', 'u1l6-gt-ratio': 'b', 'u1l6-gt-t1': 'b' });

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

  /* ======================= Lesson 6: geometric growth and decay ======================= */
  function pc(p) { return nT(p) + '\\%'; }
  function fr(f) { return Q(Math.round(f[0]), f[1]); }
  var FRW = { '1/4': 'one-quarter', '1/5': 'one-fifth', '2/5': 'two-fifths', '1/6': 'one-sixth', '3/8': 'three-eighths', '3/10': 'three-tenths', '1/3': 'one-third', '1/2': 'one-half', '2/3': 'two-thirds', '3/4': 'three-quarters' };
  function fw(f) { return FRW[f[0] + '/' + f[1]] || (f[0] + '/' + f[1]); }
  /* a growth factor: r a number or fraction; a non-terminating fraction may also be given to 3 decimal places */
  function gfCheck(rv, cands) {
    var base = exact(rv, { cands: cands }), T = qv(rv);
    return function (resp) {
      var C = clean(resp), p = HW.parse.number(C.s.replace(/\\,/g, ''));
      if (p.ok && Array.isArray(rv) && dec(rv) == null) { var dp = (String(C.s).split('.')[1] || '').length; if (dp >= 3 && Math.abs(p.value - T) <= 0.0006) return ok(); if (Math.abs(p.value - T) < 0.01) return form('places', 'Close — give the fraction, or a decimal to at least 3 decimal places.'); }
      if (p.ok && same(p.value, T * 100)) return form('u1l6-pct', 'That is the growth factor as a percent. Write it as a decimal (for example ' + t('1.07') + ', not ' + t('107') + ').');
      return base(resp);
    };
  }
  /* growth factor part. kind: 'inc' (p %), 'dec' (p %), 'keep' (fraction kept, lost = f), 'grow' (fraction gained), 'mult' (k) */
  function gfPart(prompt, kind, v, o) {
    o = o || {};
    var r, cands = [], sol;
    if (kind === 'inc') { r = cl(1 + v / 100); cands = [[v / 100, 'u1l6-rate', 'That is the rate. The growth factor is ' + t('1+\\text{rate}') + '.'], [v, 'u1l6-percent', 'Write the percent as a decimal first: ' + t(pc(v) + '=' + nT(v / 100)) + '.'], [cl(1 - v / 100), 'u1l6-direction', 'It <b>increases</b>, so the factor is more than 1: add the rate to 1.']]; sol = t('r=1+' + nT(v / 100) + '=' + nT(r)); }
    else if (kind === 'dec') { r = cl(1 - v / 100); cands = [[v / 100, 'u1l6-rate', 'That is the part it loses. It <b>keeps</b> ' + t('1-' + nT(v / 100)) + ' of its value.'], [v, 'u1l6-percent', 'Write the percent as a decimal first, then subtract it from 1.'], [cl(1 + v / 100), 'u1l6-direction', 'It <b>decreases</b>, so the factor is less than 1: subtract the rate from 1.']]; sol = t('r=1-' + nT(v / 100) + '=' + nT(r)); }
    else if (kind === 'keep') { r = qs(qi(1), v); cands = [[qv(v), 'u1l6-lost', 'That is the part it loses. It <b>keeps</b> ' + t('1-' + qTex(v) + '=' + qTex(r)) + '.'], [qv(qa(qi(1), v)), 'u1l6-direction', 'It gets smaller, so the factor is less than 1.']]; sol = 'It keeps ' + t('1-' + qTex(v) + '=' + qTex(r)) + ': ' + t('r=' + qTex(r)) + (dec(r) != null ? ' ' + t('(=' + dec(r) + ')') : '') + '.'; }
    else if (kind === 'grow') { r = qa(qi(1), v); cands = [[qv(v), 'u1l6-rate', 'That is the part it gains. The factor is ' + t('1+' + qTex(v)) + '.'], [qv(qs(qi(1), v)), 'u1l6-direction', 'It grows, so the factor is more than 1.']]; sol = 'It becomes ' + t('1+' + qTex(v) + '=' + qTex(r)) + ' of what it was: ' + t('r=' + qTex(r)) + (dec(r) != null ? ' ' + t('(=' + dec(r) + ')') : '') + '.'; }
    else if (kind === 'frac') { r = v; var vt = Array.isArray(v) ? qTex(v) : pc(cl(v * 100)); cands = [[1 - qv(v), 'u1l6-lost', 'It rebounds <b>to</b> ' + t(vt) + ' of the height: that is the factor.']]; sol = t('r=' + (Array.isArray(v) ? qTex(v) : nT(v))) + '.'; }
    else { r = v; cands = [[v - 1, 'u1l6-rate', 'Each period the amount is multiplied by ' + t(v) + '.'], [v * 100, 'u1l6-pct', 'Give the factor as a number.']]; sol = t('r=' + v) + '.'; }
    var p = numPart(prompt, r, { cands: cands, sol: o.sol || sol, hints: o.hints || ['Increase by ' + t('p\\%') + ': ' + t('r=1+\\frac{p}{100}') + '. Decrease by ' + t('p\\%') + ': ' + t('r=1-\\frac{p}{100}') + '.', '“Loses a fraction” means it <b>keeps</b> the rest.'], text: o.text, before: t('r=') });
    p.check = gfCheck(r, cands);
    return p;
  }
  /* a rate as a percent (rounded): a decimal rate or a growth factor gets a nudge */
  function pctPart(prompt, x, dp, o) {
    o = o || {}; o.after = '\\%';
    var p = apxPart(prompt, x, dp, o), inner = p.check;
    p.check = function (resp) {
      var C = clean(resp), a = HW.parse.number(C.s.replace(/\\%|%/g, ''));
      if (a.ok && a.value < 1 && Math.abs(a.value * 100 - x) < 0.06 * Math.max(1, Math.pow(10, -dp + 1))) return form('u1l6-pct', 'That is the rate as a decimal. Give it as a percent (multiply by 100).');
      if (a.ok && Math.abs(a.value - 1 - x / 100) < 0.0006 && x < 100) return form('u1l6-pct', 'That is the growth factor ' + t('1+i') + '. The rate is ' + t('i') + ', as a percent.');
      return inner(resp);
    };
    p.answer = t(fx(x, dp) + '\\%');
    return p;
  }
  function firstAt(f, test, max) { for (var n = 0; n <= (max || 400); n++) if (test(f(n))) return n; return -1; }
  function clock(h) { var d = Math.floor(h / 24), hh = h % 24, ap = hh < 12 ? 'a.m.' : 'p.m.', h12 = hh % 12 === 0 ? 12 : hh % 12; return h12 + ':00 ' + ap + (d === 1 ? ' the next day' : d > 1 ? ' (' + d + ' days later)' : ''); }
  var HGF = ['Increase by ' + t('p\\%') + ': ' + t('r=1+\\frac{p}{100}') + '. Decrease by ' + t('p\\%') + ': ' + t('r=1-\\frac{p}{100}') + '.'];
  var HPN = ['Value after ' + t('n') + ' periods ' + t('=Pr^{n}') + ' (' + t('P') + ' = starting amount, ' + t('r') + ' = growth factor).'];
  var HTAB = ['Make a table of values of ' + t('Pr^{n}') + ' for ' + t('n=1,2,3,\\dots') + ' and find the first one past the target.', 'Check the value just before it too.'];
  function offC(f, n, what) { return [[f(n - 1), 'u1l6-off-one', 'Count the periods carefully: ' + (what || 'how many times is the starting amount multiplied by ' + t('r') + '?')], [f(n + 1), 'u1l6-off-one', 'Count the periods carefully: ' + (what || 'how many times is the starting amount multiplied by ' + t('r') + '?')]]; }

  var QUESTIONS = [
    { num: '1', stem: 'State the growth factor in each situation.', parts: [
      { id: '1a', level: 'BEG', make: function (r) { var p = r.pick([0.8, 1.2, 1.4, 1.8, 2.2, 2.5, 0.9, 1.6]); return gfPart('A province’s population rises by ' + t(pc(p)) + ' per year.', 'inc', p, { text: 'growth factor: increase (decimal %)' }); } },
      { id: '1b', level: 'BEG', make: function (r) { var p = r.pick(range(10, 30).filter(function (x) { return x !== 17 && x !== 28; })); return gfPart('A car depreciates by ' + t(pc(p)) + ' per year.', 'dec', p, { text: 'growth factor: depreciation' }); } },
      { id: '1c', level: 'BEG', make: function (r) { var p = r.pick(range(2.1, 4.9, 0.1).filter(function (x) { return x !== 3.2 && Math.round(x * 10) % 10 !== 0; })); return gfPart('A salary increases by ' + t(pc(p)) + ' per year.', 'inc', p, { text: 'growth factor: salary increase' }); } },
      { id: '1d', level: 'BEG', make: function (r) { var p = r.pick([2, 3, 5, 6, 7, 8, 9]); return gfPart('A magazine loses ' + t(pc(p)) + ' of its subscribers each year.', 'dec', p, { text: 'growth factor: loses p%' }); } },
      { id: '1e', level: 'BEG', make: function (r) { var f = r.pick([[2, 3], [3, 4], [4, 5], [3, 5], [7, 8], [5, 8], [4, 7]]); return gfPart('A ball rebounds to ' + t('\\frac{' + f[0] + '}{' + f[1] + '}') + ' of its previous height.', 'frac', fr(f), { text: 'growth factor: rebound fraction' }); } },
      { id: '1f', level: 'EMG', make: function (r) { var f = r.pick([[1, 4], [1, 5], [2, 5], [1, 6], [3, 8], [3, 10]]); return gfPart('An object loses ' + fw(f) + ' of its temperature above room temperature each minute.', 'keep', fr(f), { text: 'growth factor: loses a fraction' }); } }] },
    { num: '2', shared: function (r) { return pickWhere(function () { return { A: 5 * r.int(12, 24), p: r.int(5, 12), k: r.int(5, 8) }; }, function (z) { return !(z.A === 90 && z.p === 8); }); },
      stem: function (o) { return 'A pendulum swings through an arc of ' + o.A + ' cm on its first swing. Each swing after that is ' + t(pc(o.p)) + ' shorter than the one before.'; },
      parts: [
        { id: '2a', level: 'BEG', make: function (r, o) { return gfPart('State the growth factor.', 'dec', o.p, { text: 'pendulum: growth factor' }); } },
        { id: '2b', level: 'EMG', make: function (r, o) {
          var rr = 1 - o.p / 100, f = function (n) { return o.A * Math.pow(rr, n - 1); };
          return apxPart('Determine the length of the arc on the ' + ord(o.k) + ' swing, to the nearest tenth of a centimetre.', f(o.k), 1, { after: 'cm', unit: 'cm',
            cands: [[o.A * Math.pow(rr, o.k), 'u1l6-off-one', 'Swing 1 is ' + t('t_1=' + o.A) + ', so swing ' + o.k + ' is ' + t('t_{' + o.k + '}=' + o.A + '(' + nT(rr) + ')^{' + (o.k - 1) + '}') + '.'], [o.A * Math.pow(o.p / 100, o.k - 1), 'u1l6-rate-used', 'Use the growth factor ' + t(nT(rr)) + ' (what is kept), not the rate.'], [o.A * Math.pow(1 + o.p / 100, o.k - 1), 'u1l6-direction', 'The swings get shorter: ' + t('r<1') + '.']],
            sol: t('t_1=' + o.A) + ' is swing 1, so swing ' + o.k + ' is ' + t('t_{' + o.k + '}=' + o.A + '(' + nT(rr) + ')^{' + (o.k - 1) + '}\\approx ' + fx(f(o.k), 1)) + ' cm.', hints: ['Swing 1 is the first term. How many times has it been multiplied by ' + t('r') + ' by swing ' + o.k + '?'], text: 'pendulum: kth swing' });
        } }] },
    { num: '3', parts: [
      { id: '3', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { V: 500 * r.int(24, 50), p: r.int(10, 18), y: r.int(2024, 2026), n: r.int(5, 8) }; }, function (z) { return !(z.V === 16500 && z.p === 13); });
        var rr = 1 - o.p / 100, f = function (n) { return o.V * Math.pow(rr, n); };
        return apxPart('A snowmobile is worth ' + t(money(o.V).replace('.00', '')) + ' on January 1, ' + o.y + '. It depreciates by ' + t(pc(o.p)) + ' per year. What is its value on January 1, ' + (o.y + o.n) + ', to the nearest dollar?', f(o.n), 0, { before: '\\$', ansPre: '\\$',
          cands: offC(f, o.n, 'from January 1, ' + o.y + ' to January 1, ' + (o.y + o.n) + ' is ' + o.n + ' years.').concat([[o.V * Math.pow(1 + o.p / 100, o.n), 'u1l6-direction', 'It depreciates (loses value): ' + t('r=1-' + nT(o.p / 100)) + '.'], [o.V * (1 - o.n * o.p / 100), 'u1l6-simple', 'The ' + o.p + '% is taken from the <b>new</b> value each year: multiply by ' + t(nT(rr)) + ' each year.']]),
          sol: o.n + ' years pass, ' + t('r=' + nT(rr)) + ': value ' + t('=' + nT(o.V) + '(' + nT(rr) + ')^{' + o.n + '}\\approx\\$' + fx(f(o.n), 0)) + '.', hints: HPN, text: 'depreciation over n years' });
      } }] },
    { num: '4', shared: function (r) { return pickWhere(function () { return { H: r.int(10, 30), p: 5 * r.int(10, 16), k: r.int(4, 6) }; }, function (z) { return !(z.H === 25 && z.p === 60) && !(z.H === 16 && z.p === 75); }); },
      stem: function (o) { return 'A ball is dropped from a height of ' + o.H + ' m. Each bounce reaches ' + t(pc(o.p)) + ' of the height of the bounce before.'; },
      parts: [
        { id: '4a', level: 'BEG', make: function (r, o) { var b1 = cl(o.H * o.p / 100); return numPart('How high is the first bounce?', b1, { after: 'm', unit: 'm', cands: [[o.H * (1 - o.p / 100), 'u1l6-lost', 'It bounces <b>to</b> ' + o.p + '% of the height: ' + t(o.H + '(' + nT(o.p / 100) + ')') + '.']], sol: t(o.H + '(' + nT(o.p / 100) + ')=' + nT(b1)) + ' m', hints: ['The first bounce is ' + o.p + '% of the drop height.'], text: 'ball: first bounce' }); } },
        { id: '4b', level: 'EMG', make: function (r, o) {
          var rr = o.p / 100, f = function (n) { return o.H * Math.pow(rr, n); };
          return apxPart('Determine the height of the ' + ord(o.k) + ' bounce, to the nearest centimetre (in metres, to 2 decimal places).', f(o.k), 2, { after: 'm', unit: 'm', cands: [[f(o.k - 1), 'u1l6-off-one', 'The drop is not a bounce: the ' + ord(o.k) + ' bounce is ' + t(o.H) + ' multiplied by ' + t(nT(rr)) + ' ' + o.k + ' times.'], [f(o.k + 1), 'u1l6-off-one', 'Count again: the 1st bounce is ' + t(o.H + '(' + nT(rr) + ')') + '.']],
            sol: t(o.H + '(' + nT(rr) + ')^{' + o.k + '}\\approx ' + fx(f(o.k), 2)) + ' m. (Or ' + t('t_1=' + nT(o.H * rr)) + ', the 1st bounce: ' + t('t_{' + o.k + '}=' + nT(o.H * rr) + '(' + nT(rr) + ')^{' + (o.k - 1) + '}') + '.)', hints: ['Height after ' + t('x') + ' bounces ' + t('=' + o.H + '(' + nT(rr) + ')^{x}') + '.'], text: 'ball: kth bounce' });
        } },
        { id: '4c', level: 'EMG', make: function (r, o) {
          return mcPart(r, 'Raj lets ' + t('t_1=' + o.H) + ' and says the ' + ord(o.k) + ' bounce is ' + t('t_{' + o.k + '}') + '. What is his mistake?', [
            { html: 'With ' + t('t_1=' + o.H) + ' (no bounces yet), ' + t('t_2') + ' is the 1st bounce, so ' + t('t_{' + o.k + '}') + ' is the ' + ord(o.k - 1) + ' bounce. The ' + ord(o.k) + ' bounce is ' + t('t_{' + (o.k + 1) + '}') + '.', right: true },
            { html: 'He should use ' + t('r=' + nT(1 - o.p / 100)) + ', the part of the height that is lost.', why: 'The ball reaches ' + o.p + '% of the height, so ' + t('r=' + nT(o.p / 100)) + ' is right. The problem is which term he uses.' },
            { html: 'There is no mistake: ' + t('t_{' + o.k + '}') + ' is always the ' + ord(o.k) + ' bounce.', why: 'Only when ' + t('t_1') + ' is the first <b>bounce</b>. Here ' + t('t_1') + ' is the drop height.' },
            { html: 'He should start with ' + t('t_1=0') + '.', why: 'A geometric sequence can’t start at 0 (every term would be 0).' }],
            'With ' + t('t_1=' + o.H) + ' (the drop), ' + t('t_2') + ' is the 1st bounce, … so the ' + ord(o.k) + ' bounce is ' + t('t_{' + (o.k + 1) + '}') + '.', ['Which term is the 1st bounce when ' + t('t_1') + ' is the drop height?'], 'error: which term is the kth bounce');
        } }] },
    { num: '5', shared: function (r) { return pickWhere(function () { return { N: 10 * r.int(10, 25), m: r.pick([15, 30, 45]) }; }, function (z) { return !(z.N === 150 && z.m === 30) && !(z.N === 300 && z.m === 20); }); },
      stem: function (o) { return 'A culture of ' + o.N + ' bacteria doubles every ' + o.m + ' minutes.'; },
      parts: [
        { id: '5a', level: 'EMG', make: function (r, o) {
          var hs = [1, 1.5, 2, 2.5, 3, 4, 5, 6].filter(function (h) { var n = 60 * h / o.m; return isInt(n) && n >= 3 && n <= 12; }), h = r.pick(hs), n = 60 * h / o.m, v = o.N * Math.pow(2, n);
          return numPart('How many bacteria are there after ' + nT(h) + ' hours?', v, { after: 'bacteria', cands: [[o.N * Math.pow(2, h), 'u1l6-periods', 'The period is ' + o.m + ' minutes, not an hour: there are ' + t('\\frac{' + 60 * h + '}{' + o.m + '}') + ' doublings.'], [o.N * Math.pow(2, n - 1), 'u1l6-off-one', 'Count the doublings: ' + t(60 * h + '\\div ' + o.m + '=' + n) + '.'], [o.N * 2 * n, 'u1l6-simple', 'Doubling ' + n + ' times multiplies by ' + t('2^{' + n + '}') + ', not by ' + t(2 * n) + '.']],
            sol: t(nT(h) + '\\text{ h}=' + 60 * h + '\\text{ min}') + ', so ' + t('n=\\frac{' + 60 * h + '}{' + o.m + '}=' + n) + ' doublings: ' + t(o.N + '(2)^{' + n + '}=' + nT(v)) + ' bacteria.', hints: ['Number of periods ' + t('=\\frac{\\text{total time}}{\\text{length of one period}}') + '.'], text: 'bacteria after h hours' });
        } },
        { id: '5b', level: 'ADV', make: function (r, o) {
          var T = r.pick([100000, 500000, 1000000, 2000000]), f = function (n) { return o.N * Math.pow(2, n); }, n = firstAt(f, function (v) { return v > T; }), hrs = n * o.m / 60;
          return fieldsPart('After how many whole doublings does the number first exceed ' + t(nT(T)) + '? How many hours is that?', [
            { label: 'Doublings', name: 'doublings', ans: n, cands: [[n - 1, 'u1l6-table-early', 'After ' + (n - 1) + ' doublings there are ' + t(nT(f(n - 1))) + ' — not more than ' + t(nT(T)) + ' yet.'], [n + 1, 'u1l6-table-late', 'Check one doubling earlier.'], [hrs, 'u1l6-gave-periods', 'That looks like the time in hours. First give the number of doublings.']] },
            { label: 'Hours', name: 'hours', ans: hrs, after: 'h', cands: [[n, 'u1l6-gave-periods', 'That is the number of doublings. Each one takes ' + o.m + ' minutes: convert to hours.'], [(n - 1) * o.m / 60, 'u1l6-table-early', 'Use the first number of doublings that passes ' + nT(T) + '.'], [n * o.m, 'u1l6-minutes', 'That is in minutes. Divide by 60 for hours.']] }],
            { sol: 'Table of ' + t(o.N + '(2)^{n}') + ': ' + t('n=' + (n - 1) + ':\\ ' + nT(f(n - 1))) + '; ' + t('n=' + n + ':\\ ' + nT(f(n))) + '.<br>' + t(n + '\\text{ doublings}=' + n + '\\times ' + o.m + '\\text{ min}=' + n * o.m + '\\text{ min}=' + nT(hrs) + '\\text{ hours}') + '.', hints: HTAB, text: 'bacteria: doublings and hours to exceed' });
        } }] },
    { num: '6', shared: function (r) {
        return pickWhere(function () { return { iso: r.pick([{ n: 'Iodine-131', h: 8, u: 'days' }, { n: 'Phosphorus-32', h: 14, u: 'days' }, { n: 'Chromium-51', h: 28, u: 'days' }, { n: 'Sodium-24', h: 15, u: 'hours' }]), M: r.pick([100, 120, 160, 250, 300, 400, 500]), k: r.int(3, 6), X: r.pick([1, 2, 5]) }; }, function (z) { return !(z.iso.h === 8 && z.M === 200); });
      },
      stem: function (o) { return o.iso.n + ' has a half-life of ' + o.iso.h + ' ' + o.iso.u + '. A lab has a ' + o.M + ' mg sample.'; },
      parts: [
        { id: '6a', level: 'EMG', make: function (r, o) {
          var D = o.k * o.iso.h, v = o.M / Math.pow(2, o.k);
          return apxPart('How much is left after ' + D + ' ' + o.iso.u + '? (To the nearest hundredth of a milligram where needed.)', v, 2, { after: 'mg', unit: 'mg', cands: [[o.M / Math.pow(2, D), 'u1l6-periods', 'The period is one half-life (' + o.iso.h + ' ' + o.iso.u + '): ' + t('n=\\frac{' + D + '}{' + o.iso.h + '}=' + o.k) + '.'], [o.M / (2 * o.k), 'u1l6-simple', 'Halving ' + o.k + ' times multiplies by ' + t('\\left(\\frac{1}{2}\\right)^{' + o.k + '}') + '.'], [o.M / Math.pow(2, o.k - 1), 'u1l6-off-one', 'Count the half-lives: ' + t(D + '\\div ' + o.iso.h + '=' + o.k) + '.']],
            sol: t('n=\\frac{' + D + '}{' + o.iso.h + '}=' + o.k) + ' half-lives: ' + t(o.M + '\\left(\\frac{1}{2}\\right)^{' + o.k + '}=' + nT(cl(v))) + ' mg.', hints: ['Each half-life multiplies the amount by ' + t('\\frac{1}{2}') + '. How many half-lives is that?'], text: 'half-life: amount left' });
        } },
        { id: '6b', level: 'ADV', make: function (r, o) {
          var f = function (n) { return o.M / Math.pow(2, n); }, n = firstAt(f, function (v) { return v < o.X; }), D = n * o.iso.h;
          return fieldsPart('After how many whole half-lives is there first less than ' + o.X + ' mg left? How many ' + o.iso.u + ' is that?', [
            { label: 'Half-lives', name: 'half-lives', ans: n, cands: [[n - 1, 'u1l6-table-early', 'After ' + (n - 1) + ' half-lives there is ' + t(nT(cl(f(n - 1)))) + ' mg — not less than ' + o.X + ' mg yet.'], [n + 1, 'u1l6-table-late', 'Check one half-life earlier.'], [D, 'u1l6-gave-periods', 'That looks like the time. First give the number of half-lives.']] },
            { label: o.iso.u.charAt(0).toUpperCase() + o.iso.u.slice(1), name: o.iso.u, ans: D, cands: [[n, 'u1l6-gave-periods', 'That is the number of half-lives. Each is ' + o.iso.h + ' ' + o.iso.u + '.'], [(n - 1) * o.iso.h, 'u1l6-table-early', 'Use the first number of half-lives that gets below ' + o.X + ' mg.']] }],
            { sol: t(o.M + '\\left(\\frac{1}{2}\\right)^{' + (n - 1) + '}=' + nT(cl(f(n - 1)))) + ', ' + t(o.M + '\\left(\\frac{1}{2}\\right)^{' + n + '}=' + nT(cl(f(n)))) + '.<br>' + n + ' half-lives ' + t('=' + n + '\\times ' + o.iso.h + '=' + D) + ' ' + o.iso.u + '.', hints: HTAB, text: 'half-life: half-lives and time below target' });
        } }] },
    { num: '7', parts: [
      { id: '7a', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { P: 100 * r.int(20, 90), i: r.pick([2.5, 2.75, 3.1, 3.4, 3.9, 4.25, 4.6, 5.2]), n: r.int(5, 10) }; }, function (z) { return !(z.P === 3200 && z.i === 4.25) && !(z.P === 6500 && z.i === 3.8); });
        var g = 1 + o.i / 100, f = function (n) { return o.P * Math.pow(g, n); };
        return apxPart(t(money(o.P).replace('.00', '')) + ' is invested at ' + t(pc(o.i)) + ' per year compounded annually. Determine its value after ' + o.n + ' years.', f(o.n), 2, { before: '\\$', ansPre: '\\$',
          cands: offC(f, o.n).concat([[o.P * (1 + o.n * o.i / 100), 'u1l6-simple', 'Compound interest is paid on the new balance each year: ' + t('A=P(1+i)^{n}') + '.'], [o.P * Math.pow(o.i / 100, o.n), 'u1l6-rate-used', 'The growth factor is ' + t('1+i=' + nT(g)) + '.']]),
          sol: t('A=' + nT(o.P) + '(' + nT(g) + ')^{' + o.n + '}\\approx\\$' + fx(f(o.n), 2)), hints: ['Compound interest: ' + t('A=P(1+i)^{n}') + ' with ' + t('i') + ' as a decimal.'], text: 'compound interest value' });
      } },
      { id: '7b', level: 'ADV', make: function (r) {
        var o = rateProb(r, function (z) { return !(z.P === 4200 && z.A === 6000) && !(z.P === 2500 && z.A === 3400); });
        return pctPart('An investment of ' + t(money(o.P).replace('.00', '')) + ' is worth ' + t(money(o.A).replace('.00', '')) + ' after ' + o.n + ' years, compounded annually. Determine the annual interest rate, to the nearest tenth of a percent.', o.x, 1, {
          cands: [[(o.A / o.P - 1) / o.n * 100, 'u1l6-simple', 'The interest compounds: solve ' + t('(1+i)^{' + o.n + '}=\\frac{' + o.A + '}{' + o.P + '}') + ' by taking the ' + o.n + 'th root.'], [(o.A / o.P - 1) * 100, 'u1l6-total-growth', 'That is the total growth over all ' + o.n + ' years. Take the ' + o.n + 'th root for one year.']],
          sol: t(nT(o.P) + '(1+i)^{' + o.n + '}=' + nT(o.A) + '\\Rightarrow (1+i)^{' + o.n + '}=\\frac{' + nT(o.A) + '}{' + nT(o.P) + '}\\approx ' + fx(o.A / o.P, 4)) + '<br>' + t('1+i=\\sqrt[' + o.n + ']{' + fx(o.A / o.P, 4) + '}\\approx ' + fx(1 + o.x / 100, 4)) + ', so the rate is about ' + t(fx(o.x, 1) + '\\%') + ' per year.', hints: ['Divide both sides by the principal, then take the ' + o.n + 'th root (' + t('\\sqrt[n]{\\ }') + ' or ' + t('x^{1/n}') + ' on the calculator).'], text: 'interest rate from P, A, n' });
      } }] },
    { num: '8', shared: function (r) { return pickWhere(function () { return { V: 50 * r.int(20, 60), p: r.pick([4.5, 5, 5.5, 6, 7, 7.5, 8]), k: r.int(8, 12) }; }, function (z) { return !(z.V === 1800 && z.p === 6.5); }); },
      stem: function (o) { return 'The value of a coin collection is modelled by ' + t('t_n=' + nT(o.V) + '(' + nT(1 + o.p / 100) + ')^{n-1}') + ', where ' + t('t_1') + ' is its value today.'; },
      parts: [
        { id: '8a', level: 'BEG', make: function (r, o) { return pctPart('By what percent does its value increase each year?', o.p, 1, { cands: [[1 + o.p / 100, 'u1l6-factor', 'That is the growth factor. The increase is the part above 1, as a percent.'], [100 + o.p, 'u1l6-factor', 'The value becomes ' + (100 + o.p) + '% of what it was: an increase of the part above 100%.']], sol: t('r=' + nT(1 + o.p / 100) + '=1+' + nT(o.p / 100)) + ': an increase of ' + t(pc(o.p)) + ' per year.', hints: [t('r=1+i') + '.'], text: 'percent increase from factor' }); } },
        { id: '8b', level: 'PRG', make: function (r, o) {
          var g = 1 + o.p / 100, f = function (n) { return o.V * Math.pow(g, n); };
          return apxPart('Determine its value ' + o.k + ' years from now, to the nearest cent.', f(o.k), 2, { before: '\\$', ansPre: '\\$', cands: [[f(o.k - 1), 'u1l6-off-one', t('t_1') + ' is today, so ' + o.k + ' years from now is ' + t('t_{' + (o.k + 1) + '}') + '.'], [f(o.k + 1), 'u1l6-off-one', o.k + ' years from now is ' + t('t_{' + (o.k + 1) + '}=' + nT(o.V) + '(' + nT(g) + ')^{' + o.k + '}') + '.']],
            sol: o.k + ' years from now is ' + t('t_{' + (o.k + 1) + '}=' + nT(o.V) + '(' + nT(g) + ')^{' + o.k + '}\\approx\\$' + fx(f(o.k), 2)) + '.', hints: [t('t_1') + ' is today’s value. Which term is ' + o.k + ' years later?'], text: 'value k years from now' });
        } },
        { id: '8c', level: 'ADV', make: function (r, o) {
          var g = 1 + o.p / 100, R = Math.pow(g, o.k), x = (R - 1) * 100;
          return pctPart('By what percent, to the nearest whole percent, has its value grown over those ' + o.k + ' years?', x, 0, { cands: [[o.k * o.p, 'u1l6-simple', 'The growth compounds: compare the value after ' + o.k + ' years with today’s value, ' + t('\\frac{t_{' + (o.k + 1) + '}}{t_1}=' + nT(g) + '^{' + o.k + '}') + '.'], [R * 100, 'u1l6-ratio-pct', 'That is the new value as a percent of the old one. The <b>growth</b> is the part above 100%.'], [(Math.pow(g, o.k - 1) - 1) * 100, 'u1l6-off-one', 'Use ' + t('(' + nT(g) + ')^{' + o.k + '}') + ' for ' + o.k + ' years.']],
            sol: t('\\frac{t_{' + (o.k + 1) + '}}{t_1}=' + nT(g) + '^{' + o.k + '}\\approx ' + fx(R, 3)) + ', an increase of about ' + t(fx(x, 0) + '\\%') + '.', hints: ['Divide the value after ' + o.k + ' years by today’s value.'], text: 'total percent growth' });
        } }] },
    { num: '9', parts: [
      { id: '9', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { return { P: 500 * r.int(2, 10), i: r.pick(range(3, 9, 0.5)) }; }, function (z) { if (z.P === 1500 && z.i === 5.5) return false; var g = 1 + z.i / 100, n = firstAt(function (k) { return Math.pow(g, k); }, function (v) { return v >= 2; }); return Math.abs(Math.pow(g, n) - 2) > 0.004 && Math.abs(Math.pow(g, n - 1) - 2) > 0.004; });
        var g = 1 + o.i / 100, n = firstAt(function (k) { return Math.pow(g, k); }, function (v) { return v >= 2; });
        return numPart(t(money(o.P).replace('.00', '')) + ' is invested at ' + t(pc(o.i)) + ' per year, compounded annually. How many full years does it take for the investment to double?', n, { after: 'years', cands: [[n - 1, 'u1l6-table-early', 'After ' + (n - 1) + ' years it is ' + t(nT(o.P) + '(' + nT(g) + ')^{' + (n - 1) + '}\\approx ' + fx(o.P * Math.pow(g, n - 1), 2)) + ' — not double yet.'], [n + 1, 'u1l6-table-late', 'Check one year earlier.'], [Math.round(100 / o.i), 'u1l6-simple', 'Interest compounds, so it doubles sooner than ' + t('100\\div ' + nT(o.i)) + ' years. Use a table of ' + t(nT(g) + '^{n}') + '.']],
          sol: 'Need ' + t(nT(o.P) + '(' + nT(g) + ')^{n}\\ge ' + nT(2 * o.P)) + ', i.e. ' + t(nT(g) + '^{n}\\ge 2') + '.<br>Table: ' + t(nT(g) + '^{' + (n - 1) + '}\\approx ' + fx(Math.pow(g, n - 1), 3)) + ', ' + t(nT(g) + '^{' + n + '}\\approx ' + fx(Math.pow(g, n), 3)) + '. It takes ' + n + ' years.', hints: HTAB, text: 'doubling time' });
      } }] },
    { num: '10', shared: function (r) { return pickWhere(function () { return { g: r.pick([1.2, 1.4, 1.5, 1.8, 2]), q: r.pick([70, 75, 85]), k: r.int(4, 6), L: r.pick([0.2, 0.25, 0.3, 0.4]) }; }, function (z) { var f = function (n) { return z.g * Math.pow(z.q / 100, n - 1); }, n = firstAt(f, function (v) { return v < z.L; }); return n > 2 && Math.abs(f(n) - z.L) > 0.003 && Math.abs(f(n - 1) - z.L) > 0.003; }); },
      stem: function (o) { return 'A young tree grows ' + nT(o.g) + ' m in its first year. In each year after that, its growth is ' + o.q + '% of its growth the year before.'; },
      parts: [
        { id: '10a', level: 'EMG', make: function (r, o) {
          var q = o.q / 100, f = function (n) { return o.g * Math.pow(q, n - 1); };
          return apxPart('How much does it grow in the ' + ord(o.k) + ' year, to the nearest centimetre (in metres, to 2 decimal places)?', f(o.k), 2, { after: 'm', unit: 'm', cands: [[f(o.k + 1), 'u1l6-off-one', 'Year 1 is ' + t('t_1=' + nT(o.g)) + ', so year ' + o.k + ' is ' + t('t_{' + o.k + '}=' + nT(o.g) + '(' + nT(q) + ')^{' + (o.k - 1) + '}') + '.'], [f(o.k - 1), 'u1l6-off-one', 'Count again: ' + t('t_{' + o.k + '}=t_1r^{' + (o.k - 1) + '}') + '.']],
            sol: t('t_{' + o.k + '}=' + nT(o.g) + '(' + nT(q) + ')^{' + (o.k - 1) + '}\\approx ' + fx(f(o.k), 2)) + ' m (' + Math.round(f(o.k) * 100) + ' cm)', hints: [t('t_1') + ' is the first year’s growth; ' + t('r=' + nT(q)) + '.'], text: 'tree: growth in year k' });
        } },
        { id: '10b', level: 'ADV', make: function (r, o) {
          var q = o.q / 100, f = function (n) { return o.g * Math.pow(q, n - 1); }, n = firstAt(function (k) { return k ? f(k) : Infinity; }, function (v) { return v < o.L; });
          return numPart('In which year does it first grow less than ' + nT(o.L) + ' m?', n, { before: 'Year', cands: [[n - 1, 'u1l6-table-early', 'In year ' + (n - 1) + ' it grows ' + t(fx(f(n - 1), 3)) + ' m — not less than ' + t(nT(o.L)) + ' m yet.'], [n + 1, 'u1l6-table-late', 'Check the year before.']],
            sol: t('t_n=' + nT(o.g) + '(' + nT(q) + ')^{n-1}') + ': ' + t('t_{' + (n - 1) + '}\\approx ' + fx(f(n - 1), 3)) + ', ' + t('t_{' + n + '}\\approx ' + fx(f(n), 3)) + '. The ' + ord(n) + ' year.', hints: HTAB, text: 'tree: first year below' });
        } }] },
    { num: '11', shared: function (r) { return pickWhere(function () { return { P: 20 * r.int(12, 30), p: r.int(3, 8), k: r.int(6, 10), m: r.int(9, 14) }; }, function (z) { return !(z.P === 480 && z.p === 5) && z.m !== z.k; }); },
      stem: function (o) { return 'In a store’s clearance sale, an item’s price drops by ' + o.p + '% of the previous day’s price each day it is not sold. A jacket costs ' + t(money(o.P)) + ' on day 1 of the sale.'; },
      parts: [
        { id: '11a', level: 'BEG', make: function (r, o) { return gfPart('State the growth factor.', 'dec', o.p, { text: 'clearance: growth factor' }); } },
        { id: '11b', level: 'EMG', make: function (r, o) {
          var g = 1 - o.p / 100, f = function (n) { return o.P * Math.pow(g, n - 1); };
          return apxPart('What is the price on day ' + o.k + ', to the nearest cent?', f(o.k), 2, { before: '\\$', ansPre: '\\$', cands: [[f(o.k + 1), 'u1l6-off-one', 'Day 1 is ' + t('t_1') + ', so day ' + o.k + ' is ' + t('t_{' + o.k + '}=' + nT(o.P) + '(' + nT(g) + ')^{' + (o.k - 1) + '}') + '.'], [f(o.k - 1), 'u1l6-off-one', t('t_{' + o.k + '}=t_1r^{' + (o.k - 1) + '}') + '.']],
            sol: t('t_{' + o.k + '}=' + nT(o.P) + '(' + nT(g) + ')^{' + (o.k - 1) + '}\\approx\\$' + fx(f(o.k), 2)), hints: [t('t_1=' + nT(o.P)) + ' is day 1.'], text: 'clearance: price on day k' });
        } },
        { id: '11c', level: 'EMG', make: function (r, o) {
          var g = cl(1 - o.p / 100), key = o.P + '\\left(' + g + '\\right)^{n-1}';
          return gtPart('Write an expression for the price on day ' + t('n') + '.', function (n) { return o.P * Math.pow(g, n - 1); }, key, { before: t('\\text{price}='),
            cands: [[function (n) { return o.P * Math.pow(g, n); }, 'u1l6-gt-rn', 'Day 1 must give ' + t(nT(o.P)) + ': use the exponent ' + t('n-1') + '.'], [function (n) { return o.P * Math.pow(o.p / 100, n - 1); }, 'u1l6-gt-rate', 'Use the growth factor ' + t(nT(g)) + ' (the part kept), not the rate.'], [function (n) { return o.P * Math.pow(1 + o.p / 100, n - 1); }, 'u1l6-gt-dir', 'The price <b>drops</b>: ' + t('r=1-' + nT(o.p / 100)) + '.']],
            sol: t('\\text{price on day }n=' + nT(o.P) + '(' + nT(g) + ')^{n-1}'), hints: [t('t_n=t_1r^{n-1}') + ' with ' + t('t_1=' + nT(o.P)) + '.'], text: 'clearance: expression for day n' });
        } },
        { id: '11d', level: 'PRG', make: function (r, o) {
          var g = 1 - o.p / 100, f = function (n) { return o.P * Math.pow(g, n - 1); }, X = rd(f(o.m), 2);
          return numPart('The jacket sold for ' + t('\\$' + X.toFixed(2)) + '. On which day was it sold?', o.m, { before: 'Day', cands: [[o.m - 1, 'u1l6-off-one', 'On day ' + (o.m - 1) + ' the price is ' + t(money(f(o.m - 1))) + '.'], [o.m + 1, 'u1l6-off-one', 'On day ' + (o.m + 1) + ' the price is ' + t(money(f(o.m + 1))) + '.']],
            sol: 'Table of ' + t(nT(o.P) + '(' + nT(g) + ')^{n-1}') + ': ' + t('t_{' + (o.m - 1) + '}\\approx ' + fx(f(o.m - 1), 2)) + ', ' + t('t_{' + o.m + '}\\approx ' + fx(f(o.m), 2)) + '. Day ' + o.m + '.', hints: HTAB, text: 'clearance: day sold' });
        } }] },
    { num: '12', shared: function (r) { return pickWhere(function () { var a = r.int(3, 6); return { a: a, b: a + r.int(1, 4), p: r.pick([10, 15, 20, 25, 30]), k: r.int(4, 6) }; }, function (z) { return !(z.a === 4 && z.b === 6 && z.p === 20); }); },
      stem: function (o) { return 'A ' + o.a + ' cm by ' + o.b + ' cm photo is enlarged on a photocopier: each copy is ' + o.p + '% longer and ' + o.p + '% wider than the one it is copied from.'; },
      parts: [
        { id: '12a', level: 'BEG', make: function (r, o) { return gfPart('State the growth factor for the length and width.', 'inc', o.p, { text: 'photo: growth factor' }); } },
        { id: '12b', level: 'EMG', make: function (r, o) {
          var g = 1 + o.p / 100, g3 = Math.pow(g, 3);
          return fieldsPart('Determine the dimensions after 3 enlargements (to the nearest hundredth of a centimetre).', [
            { label: 'Length', name: 'length', ans: o.a * g3, dp: 2, after: 'cm', cands: [[o.a * g * 3, 'u1l6-simple', 'Each enlargement multiplies by ' + t(nT(g)) + ': three enlargements multiply by ' + t(nT(g) + '^{3}') + '.']] },
            { label: 'Width', name: 'width', ans: o.b * g3, dp: 2, after: 'cm' }],
            { sol: t(o.a + '(' + nT(g) + ')^{3}\\approx ' + fx(o.a * g3, 2)) + ' cm by ' + t(o.b + '(' + nT(g) + ')^{3}\\approx ' + fx(o.b * g3, 2)) + ' cm', hints: ['Multiply each dimension by ' + t('r^{3}') + '.'], text: 'photo: dimensions after 3' });
        } },
        { id: '12c', level: 'PRG', make: function (r, o) {
          var g = 1 + o.p / 100, A0 = o.a * o.b, g2 = cl(g * g);
          return fieldsPart('Determine the area of the original and of the first two enlargements (to the nearest hundredth). What is the growth factor for the area?', [
            { label: 'Original', name: 'original area', ans: A0, after: 'cm²' }, { label: '1st enlargement', name: 'area 1', ans: A0 * g2, dp: 2, after: 'cm²', cands: [[A0 * g, 'u1l6-area-factor', 'Both the length and the width grow: ' + t('(' + nT(o.a * g) + ')(' + nT(o.b * g) + ')') + '.']] },
            { label: '2nd enlargement', name: 'area 2', ans: A0 * g2 * g2, dp: 2, after: 'cm²', cands: [[A0 * g * g * g, 'u1l6-area-factor', 'Multiply the new length by the new width.']] },
            { label: 'Area growth factor', name: 'area factor', ans: g2, cands: [[g, 'u1l6-area-factor', 'Divide the areas: ' + t('\\frac{' + fx(A0 * g2, 2) + '}{' + A0 + '}') + '. Both dimensions grow, so the area factor is ' + t('r^{2}') + '.']] }],
            { sol: t(o.a + '\\times ' + o.b + '=' + A0) + ', ' + t(nT(cl(o.a * g)) + '\\times ' + nT(cl(o.b * g)) + '\\approx ' + fx(A0 * g2, 2)) + ', ' + t(nT(cl(o.a * g * g)) + '\\times ' + nT(cl(o.b * g * g)) + '\\approx ' + fx(A0 * g2 * g2, 2)) + ' cm².<br>Ratio ' + t('\\frac{' + fx(A0 * g2, 2) + '}{' + A0 + '}=' + nT(g2) + '=(' + nT(g) + ')^{2}') + '.', hints: ['Find each copy’s length and width, then multiply.'], text: 'photo: areas and area factor' });
        } },
        { id: '12d', level: 'ADV', make: function (r, o) {
          var g2 = cl(Math.pow(1 + o.p / 100, 2)), A0 = o.a * o.b, v = A0 * Math.pow(g2, o.k);
          return apxPart('Determine the area after ' + o.k + ' enlargements, to the nearest hundredth.', v, 2, { after: 'cm²', unitTex: '\\text{ cm}^{2}', cands: [[A0 * Math.pow(1 + o.p / 100, o.k), 'u1l6-area-factor', 'The area grows by ' + t(nT(g2)) + ' each time (the square of the length factor).'], [A0 * Math.pow(g2, o.k - 1), 'u1l6-off-one', o.k + ' enlargements: multiply by ' + t(nT(g2) + '^{' + o.k + '}') + '.']],
            sol: t(A0 + '(' + nT(g2) + ')^{' + o.k + '}\\approx ' + fx(v, 2)) + ' cm²', hints: ['Use the area growth factor from the previous part.'], text: 'photo: area after k' });
        } }] },
    { num: '13', parts: [
      { id: '13', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { return { D: 250 * r.int(4, 12), i: r.pick([2.5, 3, 3.5, 4.5, 5, 5.5, 6]), k: r.pick([4, 5]) }; }, function (z) { return !(z.D === 2000 && z.i === 4); });
        var g = 1 + o.i / 100, sum = function (a, b) { var s = 0; for (var j = a; j <= b; j++) s += o.D * Math.pow(g, j); return s; }, v = sum(1, o.k - 1);
        var terms = []; for (var j = o.k - 1; j >= 1; j--) terms.push(nT(o.D) + '(' + nT(g) + ')' + (j > 1 ? '^{' + j + '}' : ''));
        return apxPart('Marco deposits ' + t(money(o.D).replace('.00', '')) + ' at the start of each year into a GIC paying ' + t(pc(o.i)) + ' per year, compounded annually. What is the total value of his GIC deposits just before he makes his ' + ord(o.k) + ' deposit?', v, 2, { before: '\\$', ansPre: '\\$',
          cands: [[sum(0, o.k - 1), 'u1l6-extra-dep', 'Just <b>before</b> the ' + ord(o.k) + ' deposit, only ' + (o.k - 1) + ' deposits have been made.'], [sum(0, o.k - 2), 'u1l6-off-one', 'Each deposit has earned interest: the 1st for ' + (o.k - 1) + ' years, the last one for 1 year.'], [o.D * (o.k - 1), 'u1l6-no-interest', 'Each deposit grows with interest until the ' + ord(o.k) + ' deposit.'], [(o.k - 1) * o.D * Math.pow(g, o.k - 1), 'u1l6-same-time', 'The deposits were made in different years, so each grows for a different number of years.']],
          sol: 'Just before the ' + ord(o.k) + ' deposit: the 1st deposit has grown ' + (o.k - 1) + ' years, …, the ' + ord(o.k - 1) + ' 1 year.<br>' + t(terms.join('+') + '\\approx\\$' + fx(v, 2)), hints: ['Find the value of each deposit separately: how many years has each one earned interest?', 'Then add them.'], text: 'GIC deposits: total value' });
      } }] },
    { num: '14', parts: [
      { id: '14', level: 'BEG', make: function (r) {
        var o = pickWhere(function () { return { V: 10000 * r.int(25, 60), p: r.int(3, 7), y: r.int(2018, 2022) }; }, function (z) { return !(z.V === 380000 && z.p === 5); }), g = 1 + o.p / 100, v = nT(o.V);
        return mcPart(r, '<i>(Multiple Choice)</i> In ' + o.y + ' a house was worth ' + t('\\$' + v) + '. Its value increases by ' + o.p + '% per year. Which equation gives its value ' + t('V') + ', ' + t('t') + ' years after ' + o.y + '?', [
          { html: t('V=' + v + '(' + nT(g) + ')^{t}'), right: true }, { html: t('V=' + v + '(' + nT(o.p / 100) + ')^{t}'), why: 'Use the growth factor ' + t('1+' + nT(o.p / 100)) + ', not the rate.' },
          { html: t('V=' + v + '(' + nT(g) + ')^{t-1}'), why: 'That gives the value after ' + t('t-1') + ' years: after 1 year it would still be ' + t('\\$' + v) + '.' }, { html: t('V=' + v + '(' + nT(1 - o.p / 100) + ')^{t}'), why: 'The value increases: the factor is more than 1.' }],
          'The starting value is multiplied by ' + t(nT(g)) + ' once for each year after ' + o.y + ': ' + t('V=' + v + '(' + nT(g) + ')^{t}') + '.', HGF, 'MC: growth equation');
      } }] },
    { num: '15', parts: [
      { id: '15', level: 'BEG', make: function (r) {
        var i = r.pick([1.8, 2.2, 2.4, 3.1, 3.6, 4.2]);
        return mcPart(r, '<i>(Multiple Choice)</i> Money is invested at ' + t(pc(i)) + ' per year, compounded annually. The ratio of the amount at the end of any year to the amount at the start of that year is', [
          { html: t(nT(1 + i / 100)), right: true }, { html: t(nT(i / 100)), why: 'That is the interest rate. The amount is the starting amount <b>plus</b> the interest.' }, { html: t(nT(i)), why: 'That is the rate as a percent.' }, { html: t(nT(1 - i / 100)), why: 'The amount grows, so the ratio is more than 1.' }],
          'Each year the amount is multiplied by ' + t('1+' + nT(i / 100) + '=' + nT(1 + i / 100)) + '.', HGF, 'MC: yearly ratio', true);
      } }] },
    { num: '16', parts: [
      { id: '16', level: 'ADV', make: function (r) {
        var o = motor(r), f = o.f, k = o.k, v = rd(f(k), 0), a = rd(o.C * Math.pow(1 - o.p1 / 100, k), 0), b = rd(o.C * (1 - o.p1 / 100) * Math.pow(1 - o.p2 / 100, k), 0), c = rd(o.C * Math.pow(1 - o.p2 / 100, k), 0);
        return mcPart(r, '<i>(Multiple Choice)</i> A new motor home costs ' + t('\\$' + nT(o.C)) + '. It loses ' + o.p1 + '% of its value in the first year and ' + o.p2 + '% of its value each year after that. The value of the motor home ' + k + ' years after it is bought, to the nearest dollar, is', [
          { html: t('\\$' + nT(v)), right: true }, { html: t('\\$' + nT(a)), why: 'The ' + o.p1 + '% loss is only in the first year; after that it loses ' + o.p2 + '% a year.' },
          { html: t('\\$' + nT(b)), why: 'After the first year there are only ' + (k - 1) + ' more years at ' + o.p2 + '%.' }, { html: t('\\$' + nT(c)), why: 'The first year’s loss is ' + o.p1 + '%, not ' + o.p2 + '%.' }],
          'After 1 year: ' + t(nT(o.C) + '(' + nT(1 - o.p1 / 100) + ')=' + nT(o.y1)) + '; then ' + (k - 1) + ' more years at ' + t('r=' + nT(1 - o.p2 / 100)) + ': ' + t(nT(o.y1) + '(' + nT(1 - o.p2 / 100) + ')^{' + (k - 1) + '}\\approx\\$' + nT(v)) + '.', ['Find the value after the first year, then use the second rate for the remaining years.'], 'MC: two-rate depreciation');
      } }] },
    { num: '17', parts: [
      { id: '17', level: 'ADV', make: function (r) {
        var o = motor(r), f = o.f, m = r.int(6, 9), X = Math.ceil(f(m) / 1000) * 1000;
        if (X >= f(m - 1) - 300) { X = Math.ceil(f(m) / 100) * 100; }
        var n = firstAt(function (k) { return k ? f(k) : Infinity; }, function (v) { return v < X; });
        return numPart('<i>(Numerical Response)</i> A new motor home costs ' + t('\\$' + nT(o.C)) + '. It loses ' + o.p1 + '% of its value in the first year and ' + o.p2 + '% of its value each year after that. The minimum number of whole years until it is worth less than ' + t('\\$' + nT(X)) + ' is ______.', n, { nr: true, cands: [[n - 1, 'u1l6-table-early', 'After ' + (n - 1) + ' years it is worth about ' + t(money(f(n - 1))) + ' — not less than ' + t(money(X)) + ' yet.'], [n + 1, 'u1l6-table-late', 'Check one year earlier.']],
          sol: 'After 1 year: ' + t(nT(o.y1)) + '. Table of ' + t(nT(o.y1) + '(' + nT(1 - o.p2 / 100) + ')^{n-1}') + ' (value after ' + t('n') + ' years): after ' + (n - 1) + ' years ' + t('\\approx ' + fx(f(n - 1), 0)) + '; after ' + n + ' years ' + t('\\approx ' + fx(f(n), 0)) + '. Answer: ' + n + '.', hints: HTAB, text: 'NR: years until below a value' });
      } }] },
    { num: '18', parts: [
      { id: '18', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { N: r.int(10, 60), h: r.int(3, 5) }; }, function (z) { return z.N * Math.pow(3, z.h) <= 9999 && !(z.N === 40 && z.h === 5); }), v = o.N * Math.pow(3, o.h);
        return numPart('<i>(Numerical Response)</i> A culture of ' + o.N + ' cells triples every hour. The number of cells after ' + o.h + ' hours is ______.', v, { nr: true, cands: [[o.N * Math.pow(3, o.h - 1), 'u1l6-off-one', 'After ' + o.h + ' hours it has tripled ' + o.h + ' times: ' + t(o.N + '(3)^{' + o.h + '}') + '.'], [o.N * 3 * o.h, 'u1l6-simple', 'Tripling ' + o.h + ' times multiplies by ' + t('3^{' + o.h + '}') + '.']],
          sol: t(o.N + '(3)^{' + o.h + '}=' + o.N + '(' + Math.pow(3, o.h) + ')=' + v), hints: HPN, text: 'NR: tripling cells' });
      } }] }
  ];
  function ord(n) { return n + (n % 100 >= 11 && n % 100 <= 13 ? 'th' : n % 10 === 1 ? 'st' : n % 10 === 2 ? 'nd' : n % 10 === 3 ? 'rd' : 'th'); }
  function motor(r) {
    var o = pickWhere(function () { return { C: 1000 * r.int(60, 120), p1: r.int(15, 25), p2: r.int(5, 10), k: r.int(4, 6) }; }, function (z) { return !(z.C === 95000 && z.p1 === 18 && z.p2 === 8); });
    o.y1 = cl(o.C * (1 - o.p1 / 100));
    o.f = function (n) { return n === 0 ? o.C : o.y1 * Math.pow(1 - o.p2 / 100, n - 1); };
    return o;
  }
  /* P, A, n with a rate whose rounding to 0.1% is safe */
  function rateProb(r, excl) {
    return pickWhere(function () { var i0 = r.int(25, 85) / 10, P = 100 * r.int(15, 80), n = r.int(5, 12), A = Math.round(P * Math.pow(1 + i0 / 100, n) / 100) * 100; return { P: P, n: n, A: A, x: (Math.pow(A / P, 1 / n) - 1) * 100 }; },
      function (z) { var f = z.x * 10 - Math.floor(z.x * 10); return z.A > z.P && Math.abs(f - 0.5) > 0.08 && excl(z); });
  }

  /* ======================= Lesson 6 Extra Practice ======================= */
  var EXTRA = [
    { num: '1', section: 'A. Skills', stem: 'State the growth factor in each situation.', parts: [
      { id: 'e1a', level: 'BEG', make: function (r) { var p = r.pick([2, 3, 5, 6, 7, 8, 9]); return gfPart('Ticket prices rise ' + t(pc(p)) + ' per year.', 'inc', p, { text: 'growth factor: rise p%' }); } },
      { id: 'e1b', level: 'BEG', make: function (r) { var p = r.pick([3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 10.5, 11.5]); return gfPart('A forest shrinks by ' + t(pc(p)) + ' per year.', 'dec', p, { text: 'growth factor: shrink p.5%' }); } },
      { id: 'e1c', level: 'BEG', make: function (r) { var k = r.pick([[2, 'doubles'], [3, 'triples'], [5, 'quintuples']]); return gfPart('A rumour’s reach ' + k[1] + ' every day.', 'mult', k[0], { text: 'growth factor: multiplies' }); } },
      { id: 'e1d', level: 'BEG', make: function (r) { var a = r.pick([1, 7, 9]); return gfPart('A phone loses ' + t('\\frac{' + a + '}{10}') + ' of its value each year.', 'keep', Q(a, 10), { text: 'growth factor: loses a/10' }); } },
      { id: 'e1e', level: 'BEG', make: function (r) { var p = r.pick([35, 40, 55, 60, 65, 70]); return gfPart('A ball rebounds to ' + t(pc(p)) + ' of its height.', 'frac', p / 100, { text: 'growth factor: rebound %' }); } },
      { id: 'e1f', level: 'EMG', make: function (r) { var f = r.pick([[1, 5], [1, 3], [1, 2], [2, 5]]); return gfPart('A town grows by ' + fw(f) + ' each decade.', 'grow', fr(f), { text: 'growth factor: grows by a fraction' }); } }] },
    { num: '2', stem: 'Each growth factor describes a change per year. State the percent increase or decrease.', parts: [
      { id: 'e2a', level: 'EMG', make: function (r) { var p = r.pick([1.5, 2.5, 4.5, 6.5, 7.5, 2.8, 4.2]); return pctMC(r, cl(1 + p / 100), [[pc(p) + ' increase', true], [pc(cl(p / 10)) + ' increase', 'The factor ' + t(nT(cl(1 + p / 100))) + ' is ' + t('1+' + nT(p / 100)) + ': ' + t(nT(p / 100) + '=' + pc(p)) + '.'], [pc(100 + p) + ' increase', 'The new value is ' + pc(100 + p) + ' of the old one: the <b>increase</b> is the part above 100%.'], [pc(p) + ' decrease', 'A factor more than 1 is an increase.']], 'factor → percent (small increase)'); } },
      { id: 'e2b', level: 'EMG', make: function (r) { var p = r.pick([6, 8, 15, 18, 22, 35]); return pctMC(r, cl(1 - p / 100), [[pc(p) + ' decrease', true], [pc(100 - p) + ' decrease', 'It <b>keeps</b> ' + pc(100 - p) + ', so it loses ' + pc(p) + '.'], [pc(p) + ' increase', 'A factor less than 1 is a decrease.'], [pc(cl(p / 100)) + ' decrease', t(nT(cl(1 - p / 100)) + '=1-' + nT(p / 100)) + ', and ' + t(nT(p / 100) + '=' + pc(p)) + '.']], 'factor → percent (decrease)'); } },
      { id: 'e2c', level: 'EMG', make: function (r) { var f = r.pick([1.8, 2.2, 3, 3.5, 2.75, 4]); return pctMC(r, f, [[pc(cl((f - 1) * 100)) + ' increase', true], [pc(cl(f * 100)) + ' increase', 'The new value is ' + pc(cl(f * 100)) + ' of the old: the increase is the part above 100%.'], [pc(cl(f - 1)) + ' increase', t(nT(f) + '=1+' + nT(cl(f - 1))) + ', and ' + t(nT(cl(f - 1)) + '=' + pc(cl((f - 1) * 100))) + '.'], [pc(cl(f * 10)) + ' increase', 'Write the part above 1 as a percent: multiply by 100.']], 'factor → percent (more than double)'); } },
      { id: 'e2d', level: 'EMG', make: function (r) { var p = r.pick([0.2, 0.3, 0.4, 0.6, 0.7, 0.8]); return pctMC(r, cl(1 - p / 100), [[pc(p) + ' decrease', true], [pc(cl(p * 10)) + ' decrease', t(nT(cl(1 - p / 100)) + '=1-' + nT(cl(p / 100))) + ', and ' + t(nT(cl(p / 100)) + '=' + pc(p)) + '.'], [pc(cl(100 - p)) + ' decrease', 'It <b>keeps</b> ' + pc(cl(100 - p)) + ' of its value.'], [pc(p) + ' increase', 'A factor less than 1 is a decrease.']], 'factor → percent (tiny decrease)'); } }] },
    { num: '3', stem: 'Write the first four terms of each sequence, where ' + t('t_1') + ' is the starting amount (to the nearest hundredth where needed).', parts: [
      { id: 'e3a', level: 'BEG', make: function (r) { var o = pickWhere(function () { return { S: 500 * r.int(2, 10), p: r.int(2, 8) }; }, function (z) { return !(z.S === 2000 && z.p === 5); }); return fourTerms('Start at ' + t(nT(o.S)) + ' and grow by ' + o.p + '% each period.', o.S, 1 + o.p / 100, 'first four terms: growth'); } },
      { id: 'e3b', level: 'BEG', make: function (r) { var o = pickWhere(function () { return { S: r.pick([320, 400, 800, 960, 1280, 1600]), p: r.pick([10, 20, 25, 50]) }; }, function (z) { return !(z.S === 640 && z.p === 25); }); return fourTerms('Start at ' + t(nT(o.S)) + ' and decrease by ' + o.p + '% each period.', o.S, 1 - o.p / 100, 'first four terms: decay'); } }] },
    { num: '4', stem: 'Determine each value.', parts: [
      { id: 'e4a', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { P: 1000 * r.int(5, 20), p: r.int(3, 8), n: r.int(4, 9) }; }, function (z) { return !(z.P === 12000 && z.p === 6 && z.n === 5); }), g = 1 + o.p / 100, f = function (n) { return o.P * Math.pow(g, n); };
        return apxPart(t(money(o.P).replace('.00', '')) + ' grows by ' + o.p + '% per year. Its value after ' + o.n + ' years, to the nearest cent.', f(o.n), 2, { before: '\\$', ansPre: '\\$', cands: offC(f, o.n).concat([[o.P * (1 + o.n * o.p / 100), 'u1l6-simple', 'The growth compounds: multiply by ' + t(nT(g)) + ' each year.']]), sol: t(nT(o.P) + '(' + nT(g) + ')^{' + o.n + '}\\approx\\$' + fx(f(o.n), 2)), hints: HPN, text: 'growth: value after n years' });
      } },
      { id: 'e4b', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { N: 50 * r.int(10, 24), p: r.int(5, 15), n: r.int(5, 9) }; }, function (z) { return !(z.N === 850 && z.p === 11 && z.n === 7); }), g = 1 - o.p / 100, f = function (n) { return o.N * Math.pow(g, n); };
        return apxPart(o.N + ' animals decline by ' + o.p + '% per year. The number after ' + o.n + ' years (to the nearest whole number).', f(o.n), 0, { after: 'animals', cands: offC(f, o.n).concat([[o.N * Math.pow(1 + o.p / 100, o.n), 'u1l6-direction', 'A decline: ' + t('r=1-' + nT(o.p / 100)) + '.']]), sol: t(o.N + '(' + nT(g) + ')^{' + o.n + '}\\approx ' + fx(f(o.n), 0)) + ' animals', hints: HPN, text: 'decay: number after n years' });
      } }] },
    { num: '5', section: 'B. Applying', parts: [
      { id: 'e5', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { L: 1000 * r.int(30, 60), p: r.int(2, 5), n: r.int(5, 9) }; }, function (z) { return !(z.L === 42000 && z.p === 3); }), g = 1 - o.p / 100, f = function (n) { return o.L * Math.pow(g, n); };
        return apxPart('A library lent ' + t(nT(o.L)) + ' items in 2025. The number of loans is falling by ' + o.p + '% per year. Estimate the number of loans in ' + (2025 + o.n) + ' (to the nearest whole number).', f(o.n), 0, { after: 'loans', cands: offC(f, o.n, 'from 2025 to ' + (2025 + o.n) + ' is ' + o.n + ' years.'), sol: o.n + ' years later: ' + t(nT(o.L) + '(' + nT(g) + ')^{' + o.n + '}\\approx ' + fx(f(o.n), 0)) + ' loans.', hints: HPN, text: 'library loans' });
      } }] },
    { num: '6', shared: function (r) { return pickWhere(function () { return { H: r.pick([6, 8, 9, 12, 15]), f: r.pick([[2, 3], [3, 4], [3, 5], [4, 5]]), k: r.int(3, 5) }; }, function (z) { return !(z.H === 9 && z.f[0] === 2 && z.f[1] === 3); }); },
      stem: function (o) { return 'A ball is dropped from ' + o.H + ' m and each bounce reaches ' + t('\\frac{' + o.f[0] + '}{' + o.f[1] + '}') + ' of the height of the bounce before.'; },
      parts: [
        { id: 'e6a', level: 'PRG', make: function (r, o) {
          var q = o.f[0] / o.f[1], f = function (n) { return o.H * Math.pow(q, n); };
          return apxPart('Determine the height of the ' + ord(o.k) + ' bounce, to the nearest centimetre (in metres, to 2 decimal places).', f(o.k), 2, { after: 'm', unit: 'm', cands: [[f(o.k - 1), 'u1l6-off-one', 'The drop isn’t a bounce: multiply ' + t(o.H) + ' by ' + t('\\frac{' + o.f[0] + '}{' + o.f[1] + '}') + ' ' + o.k + ' times.'], [f(o.k + 1), 'u1l6-off-one', 'Count the bounces again.']],
            sol: t(o.H + '\\left(\\frac{' + o.f[0] + '}{' + o.f[1] + '}\\right)^{' + o.k + '}\\approx ' + fx(f(o.k), 2)) + ' m', hints: ['Height after ' + t('x') + ' bounces ' + t('=' + o.H + '\\left(\\frac{' + o.f[0] + '}{' + o.f[1] + '}\\right)^{x}') + '.'], text: 'ball: kth bounce' });
        } },
        { id: 'e6b', level: 'EMG', make: function (r, o) {
          var b1 = qm(qi(o.H), Q(o.f[0], o.f[1]));
          return mcPart(r, 'If ' + t('t_1=' + qTex(b1)) + ' (the height of the first bounce), which term is the height of the ' + ord(o.k) + ' bounce?', [
            { html: t('t_{' + o.k + '}'), right: true }, { html: t('t_{' + (o.k + 1) + '}'), why: 'Here ' + t('t_1') + ' is already the 1st bounce, so the ' + ord(o.k) + ' bounce is ' + t('t_{' + o.k + '}') + '.' },
            { html: t('t_{' + (o.k - 1) + '}'), why: t('t_1') + ' is the 1st bounce, ' + t('t_2') + ' the 2nd, …' }, { html: t('t_{' + (o.k + 2) + '}'), why: 'Count from ' + t('t_1') + ' = the 1st bounce.' }],
            'With ' + t('t_1') + ' = the 1st bounce, ' + t('t_2') + ' is the 2nd bounce, …, so the ' + ord(o.k) + ' bounce is ' + t('t_{' + o.k + '}') + '.', ['What does ' + t('t_1') + ' stand for here?'], 'which term (start after one period)', true);
        } }] },
    { num: '7', parts: [
      { id: 'e7', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { P: 500 * r.int(6, 20), i: r.int(21, 39) / 10, n: r.int(8, 15) }; }, function (z) { return !(z.P === 8000 && z.i === 2.9 && z.n === 15) && Math.round(z.i * 10) % 10 !== 0; }), g = cl(1 + o.i / 100), f = function (n) { return o.P * Math.pow(g, n); };
        return apxPart(t(money(o.P).replace('.00', '')) + ' is invested at ' + t(pc(o.i)) + ' per year, compounded annually. Determine its value after ' + o.n + ' years.', f(o.n), 2, { before: '\\$', ansPre: '\\$', cands: offC(f, o.n).concat([[o.P * (1 + o.n * o.i / 100), 'u1l6-simple', 'Compound interest: ' + t('A=P(1+i)^{n}') + '.']]), sol: t(nT(o.P) + '(' + nT(g) + ')^{' + o.n + '}\\approx\\$' + fx(f(o.n), 2)), hints: ['Compound interest: ' + t('A=P(1+i)^{n}') + '.'], text: 'compound interest value' });
      } }] },
    { num: '8', shared: function (r) { return pickWhere(function () { return { h: r.pick([5, 6]), M: r.pick([160, 200, 240, 300, 320]), T: r.pick([6, 7, 8]), k: r.int(2, 4), X: r.pick([10, 15, 20]) }; }, function (z) { return !(z.h === 5 && z.M === 200 && z.T === 7); }); },
      stem: function (o) { return 'Caffeine has a half-life of about ' + o.h + ' hours in the body. A person takes in ' + o.M + ' mg at ' + clock(o.T) + (/\.$/.test(clock(o.T)) ? '' : '.'); },
      parts: [
        { id: 'e8a', level: 'EMG', make: function (r, o) {
          var v = o.M / Math.pow(2, o.k);
          return numPart('How much is left at ' + clock(o.T + o.k * o.h) + '?', v, { after: 'mg', unit: 'mg', cands: [[o.M / Math.pow(2, o.k * o.h), 'u1l6-periods', 'The period is one half-life (' + o.h + ' hours): ' + t(o.k * o.h + '\\text{ h}=' + o.k) + ' half-lives.'], [o.M / (2 * o.k), 'u1l6-simple', 'Halve ' + o.k + ' times: ' + t(o.M + '\\left(\\frac{1}{2}\\right)^{' + o.k + '}') + '.']],
            sol: t(o.k * o.h + '\\text{ hours}=' + o.k) + ' half-lives: ' + t(o.M + '\\left(\\frac{1}{2}\\right)^{' + o.k + '}=' + nT(v)) + ' mg', hints: ['How many half-lives fit into the time that has passed?'], text: 'caffeine: amount left' });
        } },
        { id: 'e8b', level: 'ADV', make: function (r, o) {
          var f = function (n) { return o.M / Math.pow(2, n); }, n = firstAt(f, function (v) { return v < o.X; });
          return mcPart(r, 'At what time is there first less than ' + o.X + ' mg left (checking at the end of each half-life)?', [
            { html: clock(o.T + n * o.h), right: true }, { html: clock(o.T + (n - 1) * o.h), why: 'After ' + (n - 1) + ' half-lives there is ' + t(nT(cl(f(n - 1)))) + ' mg — not less than ' + o.X + ' mg yet.' },
            { html: clock(o.T + (n + 1) * o.h), why: 'Check one half-life earlier.' }, { html: clock(o.T + n), why: 'Each half-life is ' + o.h + ' hours, not 1 hour.' }],
            t(o.M + '\\left(\\frac{1}{2}\\right)^{' + (n - 1) + '}=' + nT(cl(f(n - 1)))) + ', ' + t(o.M + '\\left(\\frac{1}{2}\\right)^{' + n + '}=' + nT(cl(f(n))))+ '. After ' + n + ' half-lives ' + t('=' + n * o.h) + ' h: ' + clock(o.T + n * o.h) + '.', HTAB, 'caffeine: time below target');
        } }] },
    { num: '9', parts: [
      { id: 'e9', level: 'PRG', make: function (r) {
        var o = pickWhere(function () { var P = 100 * r.int(30, 90), p = r.pick([1.5, 2, 2.5, 3, 3.5]), m = r.int(6, 14), g = 1 - p / 100, T = Math.ceil(P * Math.pow(g, m) / 100) * 100; return { P: P, p: p, g: g, T: T }; },
          function (z) { if (z.P === 5400 && z.p === 2.5) return false; var n = firstAt(function (k) { return z.P * Math.pow(z.g, k); }, function (v) { return v < z.T; }); return n >= 5 && Math.abs(z.P * Math.pow(z.g, n) - z.T) > 3 && Math.abs(z.P * Math.pow(z.g, n - 1) - z.T) > 3; });
        var f = function (n) { return o.P * Math.pow(o.g, n); }, n = firstAt(f, function (v) { return v < o.T; });
        return numPart('A town of ' + t(nT(o.P)) + ' people is shrinking by ' + t(pc(o.p)) + ' per year. After how many years does the population first fall below ' + t(nT(o.T)) + '?', n, { after: 'years', cands: [[n - 1, 'u1l6-table-early', 'After ' + (n - 1) + ' years it is about ' + t(fx(f(n - 1), 0)) + ' — not below ' + t(nT(o.T)) + ' yet.'], [n + 1, 'u1l6-table-late', 'Check one year earlier.']],
          sol: 'Table of ' + t(nT(o.P) + '(' + nT(o.g) + ')^{n}') + ': ' + t('n=' + (n - 1) + ':\\ \\approx ' + fx(f(n - 1), 0)) + '; ' + t('n=' + n + ':\\ \\approx ' + fx(f(n), 0)) + '. After ' + n + ' years.', hints: HTAB, text: 'town: years until below' });
      } }] },
    { num: '10', parts: [
      { id: 'e10', level: 'BEG', make: function (r) {
        var o = pickWhere(function () { return { V: 2000 * r.int(15, 30), p: r.int(10, 20), n: r.int(4, 8) }; }, function (z) { return !(z.V === 48000 && z.p === 15); }), v = nT(o.V);
        return mcPart(r, '<i>(Multiple Choice)</i> A truck worth ' + t('\\$' + v) + ' depreciates by ' + o.p + '% per year. Which expression gives its value after ' + o.n + ' years?', [
          { html: t(v + '(' + nT(1 - o.p / 100) + ')^{' + o.n + '}'), right: true }, { html: t(v + '(' + nT(o.p / 100) + ')^{' + o.n + '}'), why: 'It keeps ' + (100 - o.p) + '% each year: the factor is ' + t(nT(1 - o.p / 100)) + '.' },
          { html: t(v + '(' + nT(1 - o.p / 100) + ')^{' + (o.n - 1) + '}'), why: 'After ' + o.n + ' years it has been multiplied by the factor ' + o.n + ' times.' }, { html: t(v + '(' + nT(1 + o.p / 100) + ')^{' + o.n + '}'), why: 'It loses value: the factor is less than 1.' }],
          'It keeps ' + (100 - o.p) + '% each year, for ' + o.n + ' years: ' + t(v + '(' + nT(1 - o.p / 100) + ')^{' + o.n + '}') + '.', HGF, 'MC: depreciation expression');
      } }] },
    { num: '11', parts: [
      { id: 'e11', level: 'EMG', make: function (r) {
        var o = pickWhere(function () { return { P: 500 * r.int(4, 12), i: r.int(2, 6), n: r.int(5, 12) }; }, function (z) { return z.P * Math.pow(1 + z.i / 100, z.n) < 9999.5 && !(z.P === 5000 && z.i === 4 && z.n === 10); }), g = 1 + o.i / 100, f = function (n) { return o.P * Math.pow(g, n); };
        return apxPart('<i>(Numerical Response)</i> ' + t(money(o.P).replace('.00', '')) + ' is invested at ' + o.i + '% per year, compounded annually. Its value after ' + o.n + ' years, to the nearest dollar, is ______.', f(o.n), 0, { nr: true, cands: offC(f, o.n).concat([[o.P * (1 + o.n * o.i / 100), 'u1l6-simple', 'Compound interest: ' + t('A=P(1+i)^{n}') + '.']]), sol: t(nT(o.P) + '(' + nT(g) + ')^{' + o.n + '}\\approx ' + fx(f(o.n), 2)) + ', so ' + t('\\$' + fx(f(o.n), 0)) + '.', hints: ['Compound interest: ' + t('A=P(1+i)^{n}') + '.'], text: 'NR: compound interest' });
      } }] },
    { num: '12', section: 'C. Stretch', shared: function (r) {
        return pickWhere(function () { var a = r.pick([3.6, 4.2, 4.8, 5.4, 6]); return { P: 500 * r.int(6, 16), a: a, b: cl(a + r.pick([0.1, 0.2, -0.1])), y: r.int(2, 5) }; }, function (z) {
          var A = rd(z.P * Math.pow(1 + z.a / 1200, 12 * z.y), 2), Bv = rd(z.P * Math.pow(1 + z.b / 100, z.y), 2); return Math.abs(A - Bv) >= 0.05 && !(z.P === 5000 && z.a === 4.8 && z.b === 4.9 && z.y === 3);
        });
      },
      stem: function (o) { return 'Option A: ' + t(money(o.P).replace('.00', '')) + ' at ' + t(pc(o.a)) + ' per year compounded monthly. Option B: ' + t(money(o.P).replace('.00', '')) + ' at ' + t(pc(o.b)) + ' per year compounded annually. Both are left for ' + o.y + ' years.'; },
      parts: [
        { id: 'e12a', level: 'ADV', make: function (r, o) {
          var A = rd(o.P * Math.pow(1 + o.a / 1200, 12 * o.y), 2), Bv = rd(o.P * Math.pow(1 + o.b / 100, o.y), 2), aw = A > Bv;
          return mcPart(r, 'Which option is worth more after ' + o.y + ' years?', [
            { html: 'Option A (monthly)', right: aw, why: aw ? null : 'Compare the values: A ' + t('\\approx\\$' + fx(A, 2)) + ', B ' + t('\\approx\\$' + fx(Bv, 2)) + '.' }, { html: 'Option B (annually)', right: !aw, why: !aw ? null : 'Compounding monthly adds interest on interest more often. Compare: A ' + t('\\approx\\$' + fx(A, 2)) + ', B ' + t('\\approx\\$' + fx(Bv, 2)) + '.' },
            { html: 'They are worth the same.', why: 'Work out both: A uses ' + t('i=\\frac{' + nT(o.a / 100) + '}{12}') + ' for ' + 12 * o.y + ' months; B uses ' + t('i=' + nT(o.b / 100)) + ' for ' + o.y + ' years.' }],
            'A: ' + t('i=\\frac{' + nT(o.a / 100) + '}{12}=' + nT(cl(o.a / 1200)) + ',\\ n=' + 12 * o.y + ':\\ ' + nT(o.P) + '(' + nT(cl(1 + o.a / 1200)) + ')^{' + 12 * o.y + '}\\approx\\$' + fx(A, 2)) + '.<br>B: ' + t(nT(o.P) + '(' + nT(1 + o.b / 100) + ')^{' + o.y + '}\\approx\\$' + fx(Bv, 2)) + '. Option ' + (aw ? 'A' : 'B') + ' is worth more.', ['Monthly: use the rate per month and count months.'], 'monthly vs annual: which', true);
        } },
        { id: 'e12b', level: 'MAS', make: function (r, o) {
          var Ae = o.P * Math.pow(1 + o.a / 1200, 12 * o.y), Be = o.P * Math.pow(1 + o.b / 100, o.y), A = rd(Ae, 2), Bv = rd(Be, 2), dv = cl(Math.abs(A - Bv));
          var p = numPart('By how much is it worth more (to the nearest cent)?', dv, { before: '\\$', ansPre: '\\$', cands: [[Math.abs(o.P * Math.pow(1 + o.a / 100, o.y) - Be), 'u1l6-monthly', 'For monthly compounding, divide the yearly rate by 12 and use ' + 12 * o.y + ' months.'], [Math.abs(o.P * Math.pow(1 + o.a / 1200, o.y) - Be), 'u1l6-monthly', 'Count the periods in months: ' + t(o.y + '\\times 12=' + 12 * o.y) + '.']],
            sol: t('\\$' + fx(Math.max(A, Bv), 2) + '-\\$' + fx(Math.min(A, Bv), 2) + '=\\$' + fx(dv, 2)), hints: ['Find each value to the nearest cent, then subtract.'], text: 'monthly vs annual: difference' });
          var alt = cl(rd(Math.abs(Ae - Be), 2)), inner = p.check;
          p.check = function (resp) { var c = clean(resp), a = HW.parse.number(c.s); if (a.ok && same(a.value, alt)) return ok(); return inner(resp); };
          return p;
        } }] },
    { num: '13', parts: [
      { id: 'e13', level: 'ADV', make: function (r) {
        var o = pickWhere(function () { var i0 = r.int(40, 120) / 10, P = 10 * r.int(15, 50), n = r.int(4, 10), V = Math.round(P * Math.pow(1 + i0 / 100, n)); return { P: P, n: n, V: V, x: (Math.pow(V / P, 1 / n) - 1) * 100 }; }, function (z) { var f = z.x * 10 - Math.floor(z.x * 10); return Math.abs(f - 0.5) > 0.08 && !(z.P === 250 && z.V === 410); });
        return pctPart('A coin bought for ' + t('\\$' + o.P) + ' is worth ' + t('\\$' + o.V) + ' ' + o.n + ' years later. Assuming a constant yearly rate of growth, determine the rate to the nearest tenth of a percent.', o.x, 1, {
          cands: [[(o.V / o.P - 1) / o.n * 100, 'u1l6-simple', 'The growth compounds: ' + t('r^{' + o.n + '}=\\frac{' + o.V + '}{' + o.P + '}') + ', so take the ' + o.n + 'th root.'], [(o.V / o.P - 1) * 100, 'u1l6-total-growth', 'That is the growth over all ' + o.n + ' years. Take the ' + o.n + 'th root for one year.']],
          sol: t('r^{' + o.n + '}=\\frac{' + o.V + '}{' + o.P + '}=' + fx(o.V / o.P, 4) + '\\Rightarrow r=\\sqrt[' + o.n + ']{' + fx(o.V / o.P, 4) + '}\\approx ' + fx(1 + o.x / 100, 4)) + '. About ' + t(fx(o.x, 1) + '\\%') + ' per year.', hints: ['Solve ' + t(o.P + 'r^{' + o.n + '}=' + o.V) + ' for ' + t('r') + ', then ' + t('r=1+i') + '.'], text: 'growth rate from two values' });
      } }] },
    { num: '14', parts: [
      { id: 'e14', level: 'MAS', make: function (r) {
        var o = pickWhere(function () { return { A: 1000 * r.int(15, 30), a: r.pick([2, 2.5, 3, 3.5, 4]), B: 1000 * r.int(8, 14), b: r.pick([3, 3.5, 4, 4.5, 5]) }; }, function (z) {
          if (z.A <= z.B || (z.A === 20000 && z.a === 3 && z.B === 12000 && z.b === 4)) return false;
          var d = function (n) { return z.B * Math.pow(1 + z.b / 100, n) - z.A * Math.pow(1 - z.a / 100, n); }, n = firstAt(d, function (v) { return v > 0; }, 60); return n >= 3 && n <= 25 && Math.abs(d(n)) > 40 && Math.abs(d(n - 1)) > 40;
        });
        var fA = function (n) { return o.A * Math.pow(1 - o.a / 100, n); }, fB = function (n) { return o.B * Math.pow(1 + o.b / 100, n); }, n = firstAt(function (k) { return fB(k) - fA(k); }, function (v) { return v > 0; }, 60);
        return numPart('Town A has ' + t(nT(o.A)) + ' people and is shrinking by ' + t(pc(o.a)) + ' per year. Town B has ' + t(nT(o.B)) + ' people and is growing by ' + t(pc(o.b)) + ' per year. After how many years does Town B first have more people than Town A?', n, { after: 'years', cands: [[n - 1, 'u1l6-table-early', 'After ' + (n - 1) + ' years: A ' + t('\\approx ' + fx(fA(n - 1), 0)) + ', B ' + t('\\approx ' + fx(fB(n - 1), 0)) + '. B isn’t ahead yet.'], [n + 1, 'u1l6-table-late', 'Check one year earlier.']],
          sol: 'Compare ' + t(nT(o.A) + '(' + nT(1 - o.a / 100) + ')^{n}') + ' and ' + t(nT(o.B) + '(' + nT(1 + o.b / 100) + ')^{n}') + ':<br>' + t('n=' + (n - 1)) + ': A ' + t('\\approx ' + fx(fA(n - 1), 0)) + ', B ' + t('\\approx ' + fx(fB(n - 1), 0)) + '; ' + t('n=' + n) + ': A ' + t('\\approx ' + fx(fA(n), 0)) + ', B ' + t('\\approx ' + fx(fB(n), 0)) + '. After ' + n + ' years.', hints: ['Make a table of values with both towns side by side.'], text: 'two towns: crossing year' });
      } }] }
  ];
  function pctMC(r, f, opts, text) {
    var o = opts.map(function (x) { return x[1] === true ? { html: t(x[0].replace(/ (increase|decrease)$/, '\\text{ $1}')), right: true } : { html: t(x[0].replace(/ (increase|decrease)$/, '\\text{ $1}')), why: x[1] }; });
    return mcPart(r, 'Growth factor ' + t(nT(f)) + '.', o, 'The factor is ' + t(nT(f) + '=1' + (f >= 1 ? '+' + nT(cl(f - 1)) : '-' + nT(cl(1 - f)))) + ': ' + o[0].html + '.', ['Compare the factor with 1: the part above 1 is the increase, the part below 1 is the decrease.'], text);
  }
  function fourTerms(prompt, S, g, text) {
    var v = [0, 1, 2, 3].map(function (k) { return S * Math.pow(g, k); });
    return fieldsPart(prompt, v.map(function (x, i) { return { label: t('t_' + (i + 1) + '='), name: 't' + (i + 1), ans: x, dp: 2, cands: i ? [[S + i * S * (g - 1), 'u1l6-simple', 'Multiply the <b>previous</b> term by ' + t(nT(g)) + ' each time (the change grows with the amount).']] : [] }; }),
      { sol: t('r=' + nT(g)) + ': ' + t(v.map(function (x) { return fx(x, 2).replace(/\.00$/, ''); }).join(',\\ ')), hints: ['Multiply by ' + t(nT(g)) + ' to get each next term.'], text: text });
  }

  HW.defineLesson({ id: 'u1l6', unit: 1, num: 6, title: 'Geometric Growth and Decay', outcome: 'RF10', questions: QUESTIONS, extra: EXTRA });
})(window);
