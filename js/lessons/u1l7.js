/* Math 20-1 · Unit 1 · Lesson 7 — Geometric Series (outcome RF10 on every part)
 * Assignment 7 (u1_l07.tex, Questions 1–18) and the Lesson 7 Extra Practice (u1_ep07.tex, Questions 1–15).
 * Every part is a generator: the booklet question's idea, form and difficulty with new numbers (the lesson's example
 * numbers and the booklet's own numbers are excluded where feasible). Calculator allowed (Unit 1): "exact" answers are
 * fractions or exact decimals; rounded answers are checked to the rounding asked (K.approx).
 * Conversions: "describe / explain" -> multiple choice whose options are reasons; "all possible values of r" -> two boxes
 * in any order; "determine the last term and the number of terms" -> two boxes.
 * Added: Extra 14 has a part (a) "why can't the formula be used directly?" as multiple choice (the booklet asks it in words).
 * Levels: LIM BEG EMG PRG ADV MAS. Mastery: 7(c), 13(c), Extra 12, 13, 14(b).
 *
 * This file also defines HW.u1seq, the sequence-and-series toolkit (exact fractions, series LaTeX, sum formulas,
 * checkers with "none" answers, general terms in n, double inequalities) that u1l8.js and u1l9.js use, so it must
 * load before them (lesson order). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, B = K.P, ex = HW.ex, F = HW.fmt, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var LID = 'u1l7';

  /* =========================== HW.u1seq: shared toolkit =========================== */
  var G = HW.u1seq = {};
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var r = a % b; a = b; b = r; } return a; }
  function cl(x) { return Math.round(x * 1e9) / 1e9; }
  function Q(p, q) { q = q == null ? 1 : q; if (q < 0) { p = -p; q = -q; } var g = gcd(p, q) || 1; return [p / g, q / g]; }
  function qn(x) { if (Array.isArray(x)) return x; for (var k = 0, f = 1; k < 10; k++, f *= 10) { var p = Math.round(x * f); if (Math.abs(p / f - x) < 1e-11 * Math.max(1, Math.abs(x))) return Q(p, f); } return Q(Math.round(x * 1e10), 1e10); }
  function qa(a, b) { a = qn(a); b = qn(b); return Q(a[0] * b[1] + b[0] * a[1], a[1] * b[1]); }
  function qs(a, b) { a = qn(a); b = qn(b); return Q(a[0] * b[1] - b[0] * a[1], a[1] * b[1]); }
  function qm(a, b) { a = qn(a); b = qn(b); return Q(a[0] * b[0], a[1] * b[1]); }
  function qd(a, b) { a = qn(a); b = qn(b); return Q(a[0] * b[1], a[1] * b[0]); }
  function qp(a, n) { a = qn(a); var p = 1, q = 1; for (var i = 0; i < n; i++) { p *= a[0]; q *= a[1]; } return Q(p, q); }
  function qv(a) { a = qn(a); return a[0] / a[1]; }
  function qeq(a, b) { a = qn(a); b = qn(b); return a[0] === b[0] && a[1] === b[1]; }
  function qint(a) { return qn(a)[1] === 1; }
  function qsafe(a) { return Number.isSafeInteger(a[0]) && Number.isSafeInteger(a[1]); }
  function term(t1, r, k) { return qm(t1, qp(r, k - 1)); }
  function gsum(t1, r, n) { if (qeq(r, [1, 1])) return qm(t1, [n, 1]); return qd(qm(t1, qs(qp(r, n), 1)), qs(r, 1)); }
  function terminates(a) { var q = qn(a)[1]; while (q % 2 === 0) q /= 2; while (q % 5 === 0) q /= 5; return q === 1; }
  function decStr(x) { return String(cl(x)); }
  /* LaTeX of a rational. o.dec: terminating fractions as decimals; o.d: \dfrac */
  function qtex(a, o) {
    o = o || {}; a = qn(a);
    if (a[1] === 1) return F(a[0]);
    if (o.dec && terminates(a)) return F(decStr(qv(a)));
    return (a[0] < 0 ? '-' : '') + (o.d ? '\\dfrac{' : '\\frac{') + F(Math.abs(a[0])) + '}{' + F(a[1]) + '}';
  }
  /* as a base of a power / factor: brackets when negative or a fraction */
  function pT(a, o) { a = qn(a); var s = qtex(a, o); return a[0] < 0 || (a[1] !== 1 && !(o && o.dec && terminates(a))) ? '\\left(' + s + '\\right)' : s; }
  function qkey(a) { a = qn(a); if (a[1] === 1) return String(a[0]); if (terminates(a)) return decStr(qv(a)); return (a[0] < 0 ? '-' : '') + '\\frac{' + Math.abs(a[0]) + '}{' + a[1] + '}'; }
  function qkeyFrac(a) { a = qn(a); if (a[1] === 1) return String(a[0]); return (a[0] < 0 ? '-' : '') + '\\frac{' + Math.abs(a[0]) + '}{' + a[1] + '}'; }
  function nT(x) { return F(decStr(x)); }
  function fx(x, dp) { return K.roundTo(x, dp).toFixed(Math.max(dp, 0)); }
  function fxT(x, dp) { return F(fx(x, dp)); }
  function money(x) { return '\\$' + F(K.roundTo(x, 2).toFixed(2)); }
  function sTerm(a, first, o) { a = qn(a); var neg = a[0] < 0, s = qtex(neg ? [-a[0], a[1]] : a, o); return first ? (neg ? '-' : '') + s : (neg ? '-' : '+') + s; }
  /* "2+10+50+\cdots" (o.last: "+\cdots+last"; o.inf false: no dots) */
  function seriesTex(terms, o) {
    o = o || {};
    var s = terms.map(function (a, i) { return sTerm(a, i === 0, o); }).join('');
    if (o.last) s += '+\\cdots' + sTerm(o.last, false, o);
    else if (o.inf !== false) { var n = terms.length, nx = n >= 2 ? qv(terms[n - 1]) * qv(terms[n - 1]) / qv(terms[n - 2]) : 1; s += (nx < 0 ? '-' : '+') + '\\cdots'; }
    return s;
  }
  function first(t1, r, k) { var o = []; for (var i = 1; i <= k; i++) o.push(term(t1, r, i)); return o; }
  function range(a, b) { var o = []; for (var i = a; i <= b; i++) o.push(i); return o; }
  function pickWhere(gen, okf) { for (var i = 0; i < 5000; i++) { var o = gen(); if (okf(o)) return o; } throw new Error('u1seq: no valid numbers'); }
  function isBk(o, list) { return list.some(function (b) { return Object.keys(b).every(function (k) { return JSON.stringify(b[k]) === JSON.stringify(o[k]); }); }); }

  /* ---- reading answers ---- */
  function strip(resp) { return String(resp == null ? '' : resp).replace(/^\s*\\?\$\s*/, '').replace(/\\(text|mathrm)\{\s*(cm|m|kg|mg|cents?|people|members|cells|seats|cans|terms|days?|hours?|years?|rows|levels|downloads)\s*\}\s*$/, '').trim(); }
  function isNone(s) {
    var x = String(s == null ? '' : s).replace(/\\(text|mathrm|operatorname)\{([^}]*)\}/g, '$2').replace(/[\\\s{}~]/g, '').toLowerCase();
    return /^(none|nosum|nosumtoinfinity|no|dne|diverges|divergent|undefined|doesnotexist|doesntexist|∅|varnothing|emptyset|nosuchseries|noseries|impossible|not possible|notpossible)$/.test(x);
  }
  function candVal(c) { return typeof c === 'number' ? c : qv(c); }
  /* diagnosis from a candidate list [[value, code, hint]] (exact, or matched after rounding to dp) */
  function dg(cands, dp) {
    return function (v) {
      for (var i = 0; i < (cands || []).length; i++) {
        var c = candVal(cands[i][0]); if (!isFinite(c)) continue;
        if (ex.eq(v, c, 1e-9) || Math.abs(v - c) < 1e-9 || (dp != null && Math.abs(v - K.roundTo(c, dp)) < 1e-9)) return { code: cands[i][1], hint: cands[i][2] };
      }
      return null;
    };
  }
  /* cands that differ from the answer (exact, or after rounding) */
  function cleanC(cands, ans, dp) {
    var A = candVal(ans), seen = [];
    return (cands || []).filter(function (c) {
      var v = candVal(c[0]); if (!isFinite(v) || (Array.isArray(c[0]) && !qsafe(c[0]))) return false;
      if (dp != null ? Math.abs(K.roundTo(v, dp) - K.roundTo(A, dp)) < 1e-9 : ex.eq(v, A, 1e-12) || Math.abs(v - A) < 1e-12) return false;
      var key = dp != null ? K.roundTo(v, dp) : v;
      if (seen.some(function (s) { return Math.abs(s - key) < 1e-12; })) return false;
      seen.push(key); return true;
    });
  }
  /* exact value (fraction in lowest terms, integer or exact decimal). o.dp: a decimal rounded to at least dp places is
   * accepted too (the booklet writes "≈"); o.noDec: a decimal is not accepted (fraction wanted) */
  function cE(target, o) {
    o = o || {}; target = qn(target);
    var T = qv(target), inner = K.fraction(target, { decimalOk: !o.noDec, diag: dg(o.cands) });
    return function (resp) {
      var s = strip(resp);
      if (isNone(s)) return wrong(o.noneCode || 'value', o.noneHint || null);
      var pn = HW.parse.number(s);
      if (pn.ok && o.dp != null && !ex.eq(pn.value, T, 1e-12)) {
        var str = HW.parse.plain(s).replace(/\s/g, ''), dps = (str.split('.')[1] || '').length;
        if (dps >= o.dp && Math.abs(pn.value - T) <= 0.5 * Math.pow(10, -o.dp) + 1e-9 * Math.max(1, Math.abs(T))) return ok();
        if (dps < o.dp && dps > 0 && Math.abs(pn.value - T) < Math.pow(10, -dps)) return form('places', 'Give the exact value, or round to at least ' + o.dp + ' decimal places.');
      }
      return inner(s);
    };
  }
  /* rounded to dp places */
  function cR(x, dp, o) { o = o || {}; var inner = K.approx(x, dp, { diag: dg(o.cands, dp), nr: o.nr }); return function (resp) { return inner(strip(resp)); }; }
  /* a value or "none" (no sum to infinity / no such series). target null = none is right */
  function cS(target, o) {
    o = o || {};
    var num = target == null ? null : cE(target, { dp: o.dp, cands: o.cands, noDec: o.noDec });
    return function (resp) {
      var s = strip(resp);
      if (!s) return form('empty', 'Type your answer first' + (target == null || o.mention ? ' (or press <b>none</b>).' : '.'));
      if (isNone(s)) return target == null ? ok() : wrong(o.saidNone || 'u1l8-said-none', o.saidNoneHint || 'There is a value here: ' + t('-1<r<1') + ', so the series converges and ' + t('S_\\infty=\\dfrac{t_1}{1-r}') + ' exists.');
      if (target == null) { var a = K.read(s); if (a.res && a.res.code === 'empty') return a.res; return wrong(o.divCode || 'u1l8-div-sum', o.divHint || 'Check ' + t('r') + ' first: when ' + t('r\\le -1') + ' or ' + t('r\\ge 1') + ' the series is <b>divergent</b> and has no sum to infinity. Press <b>none</b>.'); }
      return num(s);
    };
  }
  /* a whole number (count of terms, a day, a level…) */
  function cN(n, o) { return cE([n, 1], o); }
  /* the general term in n: f(n) as a function; o.cands [[fn, code, hint]] */
  function cT(f, o) {
    o = o || {};
    return function (resp) {
      var s = String(resp == null ? '' : resp).replace(/^\s*t_\{?n\}?\s*=\s*/, '').replace(/^\s*t\(n\)\s*=\s*/, '');
      var a = K.read(s); if (a.res) return a.res;
      var vs = Object.keys(ex.shape(a.ast).vars);
      if (vs.some(function (v) { return v !== 'n'; })) return wrong('var', 'Write the general term with the variable ' + t('n') + ' only.');
      if (!vs.length) return wrong('u1-no-n', 'The general term is a formula in ' + t('n') + ' (one number gives just one term).');
      var at = function (g) { for (var n = 1; n <= 7; n++) { var v = ex.value(a.ast, { n: n }), w = g(n); if (!ex.eq(v, w, 1e-9) && Math.abs(v - w) > 1e-9) return false; } return true; };
      if (at(f)) return ok();
      for (var i = 0; i < (o.cands || []).length; i++) if (at(o.cands[i][0])) return wrong(o.cands[i][1], o.cands[i][2]);
      return wrong('u1-term', 'Check your formula: substitute ' + t('n=1') + ' and ' + t('n=2') + ' — do you get ' + t('t_1') + ' and ' + t('t_2') + '?');
    };
  }
  /* lo < x < hi (strict). Accepts "lo<x<hi", "hi>x>lo", or "x>lo and x<hi" */
  function cI(lo, hi, v, o) {
    o = o || {}; v = v || 'x'; var L = qv(lo), H = qv(hi);
    function val(sv) { var p = ex.parse(sv); if (!p.ok) return null; var x = ex.value(p.ast); return isFinite(x) ? x : null; }
    return function (resp) {
      var s = String(resp == null ? '' : resp).replace(/\\left|\\right/g, '').replace(/\\lt\b|&lt;/g, '<').replace(/\\gt\b|&gt;/g, '>').replace(/\\leq?\b|\\leqslant/g, '≤').replace(/\\geq?\b|\\geqslant/g, '≥').replace(/<=/g, '≤').replace(/>=/g, '≥').replace(/\\text\{\s*and\s*\}|\band\b|,/g, '&').trim();
      if (!s) return form('empty', 'Type your answer first, e.g. ' + t('-2<' + v + '<2') + '.');
      var lo2 = null, hi2 = null, incl = false, bits = s.split('&').map(function (b) { return b.trim(); }).filter(Boolean);
      function one(b) {
        var m = b.split(/(<|>|≤|≥)/); if (m.length !== 3) return false;
        var A = m[0].trim(), op = m[1], C = m[2].trim(); if (/[≤≥]/.test(op)) incl = true;
        if (A === v) { var c = val(C); if (c == null) return false; if (/[<≤]/.test(op)) hi2 = c; else lo2 = c; return true; }
        if (C === v) { var a = val(A); if (a == null) return false; if (/[<≤]/.test(op)) lo2 = a; else hi2 = a; return true; }
        return false;
      }
      if (bits.length === 1) {
        var m = bits[0].split(/(<|>|≤|≥)/);
        if (m.length === 5 && m[2].trim() === v) {
          var a = val(m[0].trim()), c = val(m[4].trim()); if (a == null || c == null) return form('unreadable', 'Write it as ' + t('a<' + v + '<b') + ' with numbers for ' + t('a') + ' and ' + t('b') + '.');
          if (/[≤≥]/.test(m[1] + m[3])) incl = true;
          if (/[<≤]/.test(m[1]) && /[<≤]/.test(m[3])) { lo2 = a; hi2 = c; } else if (/[>≥]/.test(m[1]) && /[>≥]/.test(m[3])) { lo2 = c; hi2 = a; } else return form('mixed-signs', 'Both inequality signs should point the same way, like ' + t('a<' + v + '<b') + '.');
        } else if (m.length === 3 && one(bits[0])) return form('one-side', 'You need both ends: write a double inequality ' + t('a<' + v + '<b') + '.');
        else return form('unreadable', 'Write your answer as a double inequality, e.g. ' + t('-2<' + v + '<2') + ' (use the ' + t('<') + ' key).');
      } else if (bits.length === 2) { if (!one(bits[0]) || !one(bits[1])) return form('unreadable', 'Write your answer as a double inequality, e.g. ' + t('-2<' + v + '<2') + '.'); }
      else return form('unreadable', 'Write your answer as a double inequality, e.g. ' + t('-2<' + v + '<2') + '.');
      if (lo2 == null || hi2 == null) return form('one-side', 'You need both ends: write a double inequality ' + t('a<' + v + '<b') + '.');
      var good = Math.abs(lo2 - L) < 1e-9 && Math.abs(hi2 - H) < 1e-9;
      if (good && incl) return wrong('u1l8-ineq-equal', 'Right ends, but leave them out: at ' + t('r=\\pm1') + ' the series diverges, so use ' + t('<') + ', not ' + t('\\le') + '.');
      if (good) return ok();
      if (Math.abs(lo2 + 1) < 1e-9 && Math.abs(hi2 - 1) < 1e-9) return wrong('u1l8-ineq-unsolved', 'That is the condition on ' + t('r') + '. Replace ' + t('r') + ' by its expression in ' + t(v) + ' and solve for ' + t(v) + ': do the same thing to all three parts.');
      if (o.cands) for (var i = 0; i < o.cands.length; i++) if (Math.abs(lo2 - o.cands[i][0]) < 1e-9 && Math.abs(hi2 - o.cands[i][1]) < 1e-9) return wrong(o.cands[i][2], o.cands[i][3]);
      if (lo2 >= hi2) return wrong('u1l8-ineq-order', 'The smaller number goes on the left: ' + t('a<' + v + '<b') + ' with ' + t('a<b') + '.');
      return wrong('u1l8-ineq', 'Solve ' + t('-1<r<1') + ' for ' + t(v) + ': do the same operation to all three parts (dividing by a negative flips both signs).');
    };
  }
  /* two values in either order (e.g. "all possible values of r"). vals: rationals. */
  function cSet(vals, o) {
    o = o || {};
    return function (resp) {
      resp = resp || [];
      var got = [];
      for (var i = 0; i < vals.length; i++) {
        var s = strip(resp[i]); if (!s) return form('empty', 'Fill in ' + (vals.length === 2 ? 'both boxes' : 'every box') + ' (there are ' + vals.length + ' values).');
        var a = K.read(s); if (a.res) return a.res;
        var sh = ex.shape(a.ast); if (!sh.bare && !ex.plainFraction(a.ast)) { if (vals.some(function (v) { return ex.eq(a.val, qv(v)); })) return form('simplify', 'Right value — simplify it to a single number.'); }
        got.push(a.val);
      }
      if (vals.length === 2 && ex.eq(got[0], got[1], 1e-12)) return form('same', 'The two boxes hold the same value — there are two different values.');
      var used = [], hits = 0;
      got.forEach(function (g) { for (var j = 0; j < vals.length; j++) if (used.indexOf(j) < 0 && (ex.eq(g, qv(vals[j]), 1e-12) || Math.abs(g - qv(vals[j])) < 1e-12)) { used.push(j); hits++; return; } });
      if (hits === vals.length) return ok();
      var d = o.diag ? o.diag(got, hits) : null; if (d) return wrong(d.code, d.hint);
      if (hits) return wrong(o.oneCode || 'u1l7-one-root', o.oneHint || 'One value is right. There is another: check the other factor of your equation.');
      return wrong('value', null);
    };
  }

  /* ---- part builders ---- */
  function withBad(p, cands, dp) {
    p.bad = (p.bad || []).concat(cleanC(cands, p._ans, dp).map(function (c) { return dp != null ? fx(candVal(c[0]), dp) : (Array.isArray(c[0]) ? qkey(c[0]) : decStr(c[0])); }));
    return p;
  }
  function afterTex(a) { return !a ? '' : '\\text{ ' + a.replace(/²/g, '') + '}' + (/²/.test(a) ? '^{2}' : ''); }
  function preTex(b) { return !b ? '' : b === '$' ? '\\$' : '\\text{' + b + ' }'; }
  /* exact answer: a number box when the answer is a whole number or exact decimal (o.math forces the fraction box) */
  function exactP(prompt, target, o, sol, hints, text) {
    o = o || {}; target = qn(target);
    var cands = cleanC(o.cands, target), useNum = !o.math && (qint(target) || (terminates(target) && !o.fracBox));
    var chk = cE(target, { cands: cands, dp: o.dp, noDec: o.noDec });
    var shortDec = target[1] !== 1 && terminates(target) && (decStr(qv(target)).split('.')[1] || '').length <= 4;
    var ans = (o.money ? money(qv(target)).replace(/^\\\$/, '') : useNum && shortDec ? F(decStr(qv(target))) : qtex(target) + (shortDec ? '\\ (=' + F(decStr(qv(target))) + ')' : o.dp != null && !terminates(target) ? '\\approx ' + fxT(qv(target), o.dp) : '')) + afterTex(o.after);
    var p = { prompt: prompt, input: useNum ? { type: 'number', before: o.before, after: o.after } : { type: 'math', keys: 'fraction', before: o.before, after: o.after },
      check: chk, key: useNum ? qkey(target) : qkeyFrac(target), answer: t(preTex(o.before) + ans), solution: sol, hints: hints || [], text: text, _ans: target };
    if (!useNum && terminates(target) && !o.noDec) p.good = [decStr(qv(target))];
    return withBad(p, cands);
  }
  function roundP(prompt, x, dp, o, sol, hints, text) {
    o = o || {}; var cands = cleanC(o.cands, x, dp);
    var p = B.approx(prompt, x, dp, { diag: dg(cands, dp), nr: o.nr, before: o.before, after: o.after }, sol, hints, text);
    var inner = p.check; p.check = function (resp) { return inner(strip(resp)); };
    p._ans = x; if (o.before || o.after) p.answer = t(preTex(o.before) + fxT(x, dp) + afterTex(o.after));
    return withBad(p, cands, dp);
  }
  function nrP(prompt, n, o, sol, hints, text) {
    o = o || {}; var cands = cleanC(o.cands, n, o.dp);
    var p = o.dp != null ? B.approx(prompt, n, o.dp, { nr: true, diag: dg(cands, o.dp), diagFirst: true }, sol, hints, text) : B.nr(prompt, n, dg(cands), sol, hints, text);
    p._ans = n; return withBad(p, cands, o.dp != null ? o.dp : null);
  }
  /* multiple choice from a right html and wrong [{html, why, code}] (duplicates dropped) */
  function mcP(r, prompt, right, wrongs, sol, hints, text, keepOrder) {
    var seen = [right], opts = [{ html: right, right: true }];
    wrongs.forEach(function (w) { if (opts.length < 4 && seen.indexOf(w.html) < 0) { seen.push(w.html); opts.push({ html: w.html, why: w.why, code: w.code }); } });
    if (opts.length < 4 && seen.length < 4) throw new Error('mcP: not enough distinct options for ' + text);
    return B.mc(r, prompt, opts, sol, hints, text, keepOrder);
  }
  /* several boxes: fs = [{label, check, key, mode, keys, none, after, before, name}] */
  function fieldsP(prompt, fs, answer, sol, hints, text, o) {
    o = o || {};
    var fields = fs.map(function (f) { return { label: f.label, name: f.name || String(f.label || '').replace(/\\\(|\\\)|=/g, ''), mode: f.mode, keys: f.keys, none: f.none, before: f.before, after: f.after, vars: f.vars, placeholder: f.placeholder }; });
    var p = B.fields(prompt, fields, fs.map(function (f) { return f.check; }), fs.map(function (f) { return f.key; }), answer, sol, hints, text);
    if (o.check) p.check = o.check;
    if (o.bad) p.bad = o.bad;
    if (o.good) p.good = o.good;
    return p;
  }
  /* box helpers */
  function fNum(label, val, o) { o = o || {}; val = qn(val); var fr = !qint(val) && !terminates(val); return { label: label, check: cE(val, { cands: cleanC(o.cands, val), dp: o.dp }), key: fr ? qkeyFrac(val) : qkey(val), mode: fr || o.math ? 'math' : undefined, keys: fr || o.math ? 'fraction' : undefined, after: o.after, before: o.before, name: o.name }; }
  function fRnd(label, x, dp, o) { o = o || {}; return { label: label, check: cR(x, dp, { cands: cleanC(o.cands, x, dp) }), key: fx(x, dp), after: o.after, before: o.before, name: o.name }; }
  function fS(label, val, o) { o = o || {}; return { label: label, check: cS(val == null ? null : qn(val), { dp: o.dp, cands: val == null ? null : cleanC(o.cands, qn(val)), mention: true }), key: val == null ? 'none' : qkeyFrac(qn(val)), mode: 'math', keys: 'fraction', none: true, name: o.name }; }
  function fT(label, f, key, o) { o = o || {}; return { label: label, check: cT(f, o), key: key, mode: 'math', keys: 'expo', vars: ['n'], name: o.name || 'general term' }; }

  /* ---- formula LaTeX ---- */
  function sumLine(t1, r, n, o) {
    o = o || {}; var S = gsum(t1, r, n), V = qs(qp(r, n), 1), D = qs(r, 1), T1 = qn(t1);
    var lead = qeq(T1, 1) ? '' : qeq(T1, -1) ? '-' : qtex(T1, o);
    var v1 = lead + (lead ? '\\left(' : '') + pT(r, o) + '^{' + n + '}-1' + (lead ? '\\right)' : '');
    var V2 = (lead ? lead + '\\left(' + qtex(V, o) + '\\right)' : qtex(V, o));
    return 'S_{' + n + '}=\\dfrac{' + v1 + '}{' + qtex(r, o) + '-1}=\\dfrac{' + V2 + '}{' + qtex(D, o) + '}=' + (o.approx != null ? '' : qtex(S, { d: true }) + (qint(S) || !terminates(S) ? '' : '=' + F(decStr(qv(S)))));
  }
  function lastLine(t1, r, tn, S, o) {
    o = o || {};
    var num = qs(qm(r, tn), t1), den = qs(r, 1);
    return 'S_n=\\dfrac{rt_n-t_1}{r-1}=\\dfrac{' + pT(r, o) + '\\left(' + qtex(tn, o) + '\\right)-' + pT(t1, o) + '}{' + qtex(r, o) + '-1}=\\dfrac{' + qtex(num, o) + '}{' + qtex(den, o) + '}=' + qtex(S, { d: true, dec: o.dec });
  }
  var HS = ['Find ' + t('t_1') + ' and ' + t('r') + ' (divide a term by the one before it), then use ' + t('S_n=\\dfrac{t_1(r^n-1)}{r-1}') + '.',
    'When ' + t('r') + ' is negative, put it in brackets: ' + t('(-3)^{8}') + ', not ' + t('-3^{8}') + '.'];
  var HL = ['You know the last term, so use ' + t('S_n=\\dfrac{rt_n-t_1}{r-1}') + ' — you don’t need ' + t('n') + '.', 'Find ' + t('r') + ' by dividing a term by the one before it.'];
  /* typical wrong sums of n terms */
  function sumCands(t1, r, n, o) {
    o = o || {}; var out = [], S = gsum(t1, r, n), R = qn(r);
    out.push([gsum(t1, r, n - 1), 'u1l7-exp-n-1', 'That is the sum of ' + t(n - 1) + ' terms. In the sum formula the exponent is ' + t('n') + ' (it is ' + t('n-1') + ' only in the general term).']);
    out.push([gsum(t1, r, n + 1), 'u1l7-count', 'That is the sum of ' + t(n + 1) + ' terms — check how many terms you are adding.']);
    out.push([term(t1, r, n), 'u1l7-gave-term', 'That is ' + t('t_{' + n + '}') + ', the last term. The question asks for the <b>sum</b> of the terms.']);
    if (!qeq(R, 1)) {
      out.push([qd(qm(t1, qs(qp(r, n), 1)), r), 'u1l7-div-r', 'Divide by ' + t('r-1') + ', not by ' + t('r') + '.']);
      if (!qeq(qs(r, 1), 1) && !qeq(qs(r, 1), -1)) out.push([qm(t1, qs(qp(r, n), 1)), 'u1l7-no-divide', 'Don’t forget to divide by ' + t('r-1') + '.']);
    }
    if (R[0] < 0 && n % 2 === 0) out.push([qd(qm(t1, qs(qm(-1, qp([-R[0], R[1]], n)), 1)), qs(r, 1)), 'u1l7-bracket', 'Brackets! ' + t(pT(r) + '^{' + n + '}') + ' is positive (an even power), but ' + t('-' + qtex([-R[0], R[1]]) + '^{' + n + '}') + ' is negative.']);
    if (R[0] < 0) out.push([gsum(t1, [-R[0], R[1]], n), 'u1l7-neg-r', 'The signs alternate, so ' + t('r') + ' is <b>negative</b>: ' + t('r=' + qtex(r)) + '.']);
    return out.filter(function (c) { return qsafe(c[0]) && !qeq(c[0], S); });
  }
  function lastCands(t1, r, tn) {
    return [[qd(qs(tn, t1), qs(r, 1)), 'u1l7-forgot-r', 'Multiply the last term by ' + t('r') + ' first: the top is ' + t('rt_n-t_1') + '.'],
      [qd(qs(qm(r, tn), t1), r), 'u1l7-div-r', 'Divide by ' + t('r-1') + ', not by ' + t('r') + '.'],
      [qd(qs(qm(r, t1), tn), qs(r, 1)), 'u1l7-swap-t', 'Check the top: it is ' + t('r') + ' times the <b>last</b> term, minus the first term.']];
  }
  G.lib = { gcd: gcd, cl: cl, Q: Q, qn: qn, qa: qa, qs: qs, qm: qm, qd: qd, qp: qp, qv: qv, qeq: qeq, qint: qint, qsafe: qsafe, term: term, gsum: gsum, terminates: terminates, decStr: decStr,
    qtex: qtex, pT: pT, qkey: qkey, qkeyFrac: qkeyFrac, nT: nT, fx: fx, fxT: fxT, money: money, seriesTex: seriesTex, first: first, range: range, pickWhere: pickWhere, isBk: isBk,
    strip: strip, isNone: isNone, dg: dg, cleanC: cleanC, cE: cE, cR: cR, cS: cS, cN: cN, cT: cT, cI: cI, cSet: cSet,
    withBad: withBad, exactP: exactP, roundP: roundP, nrP: nrP, mcP: mcP, fieldsP: fieldsP, fNum: fNum, fRnd: fRnd, fS: fS, fT: fT,
    sumLine: sumLine, lastLine: lastLine, sumCands: sumCands, lastCands: lastCands, HS: HS, HL: HL };
  /* a keypad for double inequalities (single math box) */
  G.INEQ_KEYS = function (v) {
    var d = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
    return [[d(7), d(8), d(9), { label: '&lt;', tex: '<', plain: '<' }, { label: '⌫', fn: 'del', title: 'Delete' }],
      [d(4), d(5), d(6), { label: '<sup>a</sup>⁄<sub>b</sub>', tex: '\\frac{#@}{#?}', plain: '/', title: 'Fraction' }, { label: 'clear', fn: 'clear' }],
      [d(1), d(2), d(3), { label: '−', tex: '-', plain: '-' }, { label: '◀', fn: 'left', title: 'Move left' }, { label: '▶', fn: 'right', title: 'Move right' }],
      [d(0), { label: '.', tex: '.', plain: '.' }, { label: '<i>' + v + '</i>', tex: v, plain: v }, { label: 'Check ↵', fn: 'enter', wide: true }]];
  };
  G.ineqP = function (prompt, lo, hi, v, sol, hints, text, o) {
    o = o || {};
    var p = { prompt: prompt, input: { type: 'math', keys: G.INEQ_KEYS(v), placeholder: 'e.g. -2 < ' + v + ' < 2' }, check: cI(lo, hi, v, o), key: qkeyFrac(lo) + '<' + v + '<' + qkeyFrac(hi),
      answer: t(qtex(lo) + '<' + v + '<' + qtex(hi)), solution: sol, hints: hints || [], text: text,
      good: [qkeyFrac(hi) + '>' + v + '>' + qkeyFrac(lo), v + '>' + qkeyFrac(lo) + '\\text{ and }' + v + '<' + qkeyFrac(hi)],
      bad: ['-1<' + v + '<1', qkeyFrac(lo) + '\\le ' + v + '\\le ' + qkeyFrac(hi)].filter(function (b) { return !(qeq(lo, -1) && qeq(hi, 1) && b === '-1<' + v + '<1'); }) };
    return p;
  };

  /* ---- bouncing ball ---- */
  /* total vertical distance when it hits the ground for the kth time: k falls (from h) + k−1 rises (from hp) */
  function ballTotal(h, p, k) { var f = 0, rr = 0; for (var i = 0; i < k; i++) f += h * Math.pow(p, i); for (var j = 1; j < k; j++) rr += h * Math.pow(p, j); return f + rr; }
  function ballCands(h, p, k) {
    var S = function (n) { var s = 0; for (var i = 0; i < n; i++) s += h * Math.pow(p, i); return s; }, falls = S(k);
    return [[falls, 'u1l7-one-way', 'That is only the distance going <b>down</b>. Add the distance going up too: ' + t(k - 1) + ' rises, starting with the first bounce height ' + t(nT(h * p)) + '.'],
      [2 * falls, 'u1l7-drop-twice', 'The ball doesn’t rise back up to the drop height: the rises start with the first bounce, ' + t(nT(h * p)) + '. There are ' + t(k) + ' falls but only ' + t(k - 1) + ' rises.'],
      [falls + S(k + 1) - h, 'u1l7-rises-k', 'At the ' + ord(k) + ' hit the ball has fallen ' + t(k) + ' times but risen only ' + t(k - 1) + ' times.'],
      [ballTotal(h, p, k + 1), 'u1l7-hit-count', 'That is the distance at the ' + ord(k + 1) + ' hit. Count again: the drop is the 1st hit.'],
      [ballTotal(h, p, k - 1), 'u1l7-hit-count', 'That is the distance at the ' + ord(k - 1) + ' hit. The drop itself ends with the 1st hit.']];
  }
  function ord(n) { var s = ['th', 'st', 'nd', 'rd'], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); }
  function pTex(p) { var fr = { 0.5: '\\frac{1}{2}', 0.75: '\\frac{3}{4}' }; return fr[p] || null; }
  function ballSol(h, p, k, dp, pt) {
    var S = function (a, n) { var s = 0; for (var i = 0; i < n; i++) s += a * Math.pow(p, i); return s; };
    var P = pt || nT(p);
    return 'Hitting the ground for the ' + ord(k) + ' time: ' + t(k) + ' falls and ' + t(k - 1) + ' rises.<br>' +
      'Falls: ' + t(seriesTex([h, h * p, h * p * p].map(qn), { dec: true })) + ' (' + t(k) + ' terms): ' + t('\\dfrac{' + nT(h) + '\\left(1-' + P + '^{' + k + '}\\right)}{1-' + P + '}\\approx ' + nT(K.roundTo(S(h, k), 4))) + '<br>' +
      'Rises: ' + t(seriesTex([h * p, h * p * p].map(qn), { dec: true })) + ' (' + t(k - 1) + ' terms): ' + t('\\dfrac{' + nT(h * p) + '\\left(1-' + P + '^{' + (k - 1) + '}\\right)}{1-' + P + '}\\approx ' + nT(K.roundTo(S(h * p, k - 1), 4))) + '<br>' +
      'Total ' + t('\\approx ' + fxT(ballTotal(h, p, k), dp)) + ' m';
  }
  G.ball = { total: ballTotal, cands: ballCands, sol: ballSol, ord: ord, pTex: pTex };
  G.ord = ord;

  /* ---- labels and partial credit ---- */
  var CODES = {
    'u1l7-exp-n-1': 'Sum: used n − 1 in the exponent', 'u1l7-count': 'Sum: wrong number of terms', 'u1l7-gave-term': 'Gave the last term instead of the sum',
    'u1l7-div-r': 'Sum: divided by r instead of r − 1', 'u1l7-no-divide': 'Sum: didn’t divide by r − 1', 'u1l7-bracket': 'Negative r without brackets (−3⁸)', 'u1l7-neg-r': 'Used a positive r for alternating signs',
    'u1l7-forgot-r': 'Last-term formula: forgot to multiply tₙ by r', 'u1l7-swap-t': 'Last-term formula: swapped t₁ and tₙ', 'u1l7-tk-as-t1': 'Used the given term as t₁', 'u1l7-t1-power': 'Wrong power of r finding t₁',
    'u1l7-solve': 'Solving the sum formula: algebra slip', 'u1l7-n-off': 'Number of terms off by one', 'u1l7-one-root': 'Found only one value of r', 'u1l7-gave-sums': 'Gave partial sums instead of terms',
    'u1l7-day-off': 'Day/term number off by one', 'u1l7-cents': 'Cents not converted to dollars', 'u1l7-one-way': 'Ball: only the falls', 'u1l7-drop-twice': 'Ball: counted the drop height as a rise',
    'u1l7-rises-k': 'Ball: k rises instead of k − 1', 'u1l7-hit-count': 'Ball: wrong number of hits', 'u1l7-bounce-index': 'Bounce height: used the wrong power', 'u1l7-arith': 'Used the arithmetic sum',
    'u1l7-annuity-shift': 'Annuity: last deposit grows 0 years instead of 1', 'u1l7-whole-formula': 'Applied the formula to a series that isn’t geometric', 'u1l7-r-not-int': 'Ratio from a table: not a whole number',
    'u1l7-sum-pieces': 'Sum: added the wrong pieces', 'u1l7-ratio': 'Growth rate used as the ratio (r = 0.2, not 1.2)', 'u1-no-n': 'General term without n', 'u1-diff': 'Used the difference instead of the ratio', 'u1-term': 'Wrong general term'
  };
  HW.addCodes(Object.keys(CODES).filter(function (k) { return !HW.CODES[k]; }).reduce(function (o, k) { o[k] = CODES[k]; return o; }, {}));
  HW.addPartial({ 'u1l7-exp-n-1': 'b', 'u1l7-count': 's', 'u1l7-gave-term': 'b', 'u1l7-div-r': 'b', 'u1l7-no-divide': 'b', 'u1l7-bracket': 's', 'u1l7-neg-r': 'b', 'u1l7-forgot-r': 'b', 'u1l7-swap-t': 'b',
    'u1l7-tk-as-t1': 'b', 'u1l7-t1-power': 's', 'u1l7-n-off': 's', 'u1l7-one-root': 's', 'u1l7-gave-sums': 'b', 'u1l7-day-off': 's', 'u1l7-cents': 's', 'u1l7-one-way': 'b', 'u1l7-drop-twice': 's',
    'u1l7-rises-k': 's', 'u1l7-hit-count': 's', 'u1l7-bounce-index': 's', 'u1l7-arith': 'n', 'u1l7-annuity-shift': 's', 'u1l7-whole-formula': 'b', 'u1l7-sum-pieces': 'b' });

  /* =========================== Lesson 7 generators =========================== */
  function nOf(S, t1, r) { for (var n = 1; n < 60; n++) if (qeq(gsum(t1, r, n), S)) return n; return null; }
  /* 1(a)-style: whole t1, whole r ≥ 2 */
  function sumIntP(r, bk, lvl, o) {
    o = o || {};
    var z = pickWhere(function () { return { t1: r.int(1, 9), r: r.int(2, 5), n: r.int(6, 10) }; },
      function (z) { return qv(gsum(z.t1, z.r, z.n)) < 2e6 && !isBk(z, bk) && !(z.t1 === 1 && z.r === 2); });
    var S = gsum(z.t1, z.r, z.n);
    return exactP(t(seriesTex(first(z.t1, z.r, 3))) + ' &nbsp; Determine ' + t('S_{' + z.n + '}') + '.', S, { cands: sumCands(z.t1, z.r, z.n) },
      t('t_1=' + z.t1 + ',\\ r=' + z.r) + '<br>' + t(sumLine(z.t1, z.r, z.n)), HS, o.text || 'sum, whole ratio');
  }
  /* 1(b)-style: r = 1/q, t1 a multiple of q^j */
  function sumUnitFracP(r, bk, o) {
    o = o || {};
    var z = pickWhere(function () { var q = r.pick(o.qs || [2, 2, 3, 4]), j = r.int(2, q === 2 ? 7 : 4), c = r.int(1, q === 2 ? 9 : 5); return { t1: c * Math.pow(q, j), q: q, j: j, n: r.int(6, 10) }; },
      function (z) { return z.n > z.j && z.t1 <= 5000 && z.t1 >= 50 && !isBk({ t1: z.t1, q: z.q, n: z.n }, bk); });
    var R = Q(1, z.q), S = gsum(z.t1, R, z.n);
    return exactP(t(seriesTex(first(z.t1, R, 3))) + ' &nbsp; Determine ' + t('S_{' + z.n + '}') + ' (exact).', S, { cands: sumCands(z.t1, R, z.n), fracBox: true },
      t('t_1=' + F(z.t1) + ',\\ r=' + qtex(R)) + '<br>' + t(sumLine(z.t1, R, z.n)), HS, o.text || 'sum, r = 1/q (exact)');
  }
  /* 1(c)-style: negative whole r */
  function sumNegP(r, bk, o) {
    o = o || {};
    var z = pickWhere(function () { return { t1: r.int(1, 5), r: -r.int(2, 5), n: r.int(5, 9) }; },
      function (z) { return Math.abs(qv(gsum(z.t1, z.r, z.n))) < 2e5 && !isBk(z, bk); });
    var S = gsum(z.t1, z.r, z.n);
    return exactP(t(seriesTex(first(z.t1, z.r, 3))) + ' &nbsp; Determine ' + t('S_{' + z.n + '}') + '.', S, { cands: sumCands(z.t1, z.r, z.n) },
      'The signs alternate: ' + t('t_1=' + z.t1 + ',\\ r=' + z.r) + '<br>' + t(sumLine(z.t1, z.r, z.n)), HS, o.text || 'sum, negative ratio');
  }
  /* 1(d): fractional first term c/b^j, whole r = b */
  function sumFracStartP(r, bk) {
    var z = pickWhere(function () { var b = r.int(2, 4), j = r.int(1, 2), c = r.pick([1, 1, 2, 3]); return { c: c, b: b, j: j, n: r.int(5, 7) }; },
      function (z) { return z.c % z.b !== 0 && !isBk(z, bk); });
    var t1 = Q(z.c, Math.pow(z.b, z.j)), S = gsum(t1, z.b, z.n);
    return exactP(t(seriesTex(first(t1, z.b, 3))) + ' &nbsp; Determine ' + t('S_{' + z.n + '}') + ' (exact).', S, { cands: sumCands(t1, z.b, z.n), math: true },
      t('t_1=' + qtex(t1) + ',\\ r=' + z.b) + '<br>' + t(sumLine(t1, z.b, z.n)), HS, 'sum, fractional first term');
  }
  /* 1(e): decimal ratio, rounded */
  function sumDecRoundP(r, bk, dp) {
    var z = pickWhere(function () { var rr = r.pick([1.1, 1.2, 1.25, 1.5, 1.4]); return { t1: r.pick([20, 25, 40, 50, 60, 75, 80, 100, 120, 200]), r: rr, n: r.int(8, 14) }; },
      function (z) { var x = z.t1 * z.r * z.r; return Math.abs(x * 100 - Math.round(x * 100)) < 1e-9 && !isBk(z, bk) && z.t1 * Math.pow(z.r, z.n) < 1e6; });
    var x = z.t1 * (Math.pow(z.r, z.n) - 1) / (z.r - 1), Rq = qn(z.r);
    var cands = [[z.t1 * (Math.pow(z.r, z.n - 1) - 1) / (z.r - 1), 'u1l7-exp-n-1', 'That is the sum of ' + t(z.n - 1) + ' terms: the exponent in the sum formula is ' + t('n') + '.'],
      [z.t1 * Math.pow(z.r, z.n - 1), 'u1l7-gave-term', 'That is the last term. Find the <b>sum</b>.'], [z.t1 * (Math.pow(z.r, z.n) - 1) / z.r, 'u1l7-div-r', 'Divide by ' + t('r-1') + ', not ' + t('r') + '.'],
      [z.t1 * (Math.pow(z.r, z.n + 1) - 1) / (z.r - 1), 'u1l7-count', 'That is ' + t(z.n + 1) + ' terms.']];
    return roundP(t(seriesTex(first(z.t1, Rq, 3), { dec: true })) + ' &nbsp; Determine ' + t('S_{' + z.n + '}') + ', to the nearest ' + (dp === 1 ? 'tenth' : 'hundredth') + '.', x, dp, { cands: cands },
      t('r=\\dfrac{' + nT(z.t1 * z.r) + '}{' + z.t1 + '}=' + nT(z.r)) + '<br>' + t('S_{' + z.n + '}=\\dfrac{' + z.t1 + '\\left(' + nT(z.r) + '^{' + z.n + '}-1\\right)}{' + nT(z.r) + '-1}\\approx ' + fxT(x, dp)), HS, 'sum, decimal ratio (rounded)');
  }
  /* 1(f): negative fractional ratio */
  function sumNegFracP(r, bk) {
    var z = pickWhere(function () { var pq = r.pick([[2, 3], [1, 2], [3, 4], [1, 3], [2, 5]]), j = r.int(2, 4); return { p: pq[0], q: pq[1], j: j, s: r.pick([1, -1]), c: r.int(1, 3), n: r.int(5, 8) }; },
      function (z) { var t1 = z.c * Math.pow(z.q, z.j); return t1 <= 1000 && t1 >= 16 && z.n > z.j && !isBk(z, bk) && qsafe(gsum(t1, Q(-z.p, z.q), z.n)); });
    var t1 = z.s * z.c * Math.pow(z.q, z.j), R = Q(-z.p, z.q), S = gsum(t1, R, z.n);
    return exactP(t(seriesTex(first(t1, R, 3))) + ' &nbsp; Determine ' + t('S_{' + z.n + '}') + ' (exact).', S, { cands: sumCands(t1, R, z.n), math: true },
      t('r=\\dfrac{' + qtex(term(t1, R, 2)) + '}{' + qtex(t1) + '}=' + qtex(R)) + '<br>' + t(sumLine(t1, R, z.n)), HS, 'sum, negative fractional ratio');
  }
  /* 2: last term given */
  function lastP(r, kind, bk, text) {
    var z = pickWhere(function () {
      if (kind === 'up') return { t1: r.int(1, 9), r: r.int(2, 4), n: r.int(6, 11) };
      if (kind === 'down') { var b = r.int(2, 4), c = r.int(1, 5), n = r.int(5, 8); return { t1: c * Math.pow(b, n - 1), r: Q(1, b), n: n, c: c }; }
      if (kind === 'neg') return { t1: -r.int(1, 5), r: -r.int(2, 4), n: r.int(5, 8) };
      if (kind === 'dec') return { t1: Q(r.int(1, 9), 10), r: r.int(2, 3), n: r.int(5, 8) };
      if (kind === 'tenth') { var d = r.int(1, 9), n2 = r.int(6, 8); return { t1: d * 1000, r: Q(1, 10), n: n2 }; }
    }, function (z) { var tn = term(z.t1, z.r, z.n); return Math.abs(qv(tn)) < 1e6 && qv(qn(z.t1)) > -1e6 && !isBk({ t1: qn(z.t1), r: qn(z.r), n: z.n }, bk); });
    var tn = term(z.t1, z.r, z.n), S = gsum(z.t1, z.r, z.n), dec = kind === 'dec' || kind === 'tenth';
    var sol = t('t_1=' + qtex(z.t1, { dec: dec }) + ',\\ r=' + qtex(z.r, { dec: dec }) + ',\\ t_n=' + qtex(tn, { dec: dec })) + '<br>' + t(lastLine(z.t1, z.r, tn, S, { dec: dec }));
    return exactP(t(seriesTex(first(z.t1, z.r, 3), { last: tn, dec: dec })) + ' &nbsp; Determine the sum.', S, { cands: lastCands(z.t1, z.r, tn).concat([[gsum(z.t1, z.r, z.n - 1), 'u1l7-count', 'That leaves out the last term. Use ' + t('S_n=\\dfrac{rt_n-t_1}{r-1}') + ' with the last term given.']]) }, sol, HL, text);
  }
  /* 7(a)/(b): how many terms */
  function howManyP(r, neg, bk, text) {
    var z = pickWhere(function () { return { t1: (neg ? -1 : 1) * r.int(2, 9), r: r.int(2, 5), n: r.int(5, 11) }; },
      function (z) { return Math.abs(qv(gsum(z.t1, z.r, z.n))) < (neg ? 1e5 : 1e6) && Math.abs(qv(gsum(z.t1, z.r, z.n))) > 300 && !isBk(z, bk); });
    var S = gsum(z.t1, z.r, z.n), pw = Math.pow(z.r, z.n);
    var sol = t('t_1=' + z.t1 + ',\\ r=' + z.r + ':\\quad \\dfrac{' + z.t1 + '(' + z.r + '^{n}-1)}{' + z.r + '-1}=' + qtex(S)) + '<br>' +
      t(z.r + '^{n}-1=' + F(pw - 1) + '\\ \\Rightarrow\\ ' + z.r + '^{n}=' + F(pw)) + '<br>Trial: ' + t(z.r + '^{' + (z.n - 1) + '}=' + F(pw / z.r) + ',\\ ' + z.r + '^{' + z.n + '}=' + F(pw)) + ', so ' + t('n=' + z.n) + '.';
    return exactP('How many terms of ' + t(seriesTex(first(z.t1, z.r, 3))) + ' add to ' + t(qtex(S)) + '?', [z.n, 1], { cands: [[z.n - 1, 'u1l7-n-off', 'Check: ' + t('S_{' + (z.n - 1) + '}=' + qtex(gsum(z.t1, z.r, z.n - 1))) + '. One more term is needed.'], [z.n + 1, 'u1l7-n-off', 'Check: ' + t('S_{' + (z.n + 1) + '}=' + qtex(gsum(z.t1, z.r, z.n + 1))) + ' — too many terms.']], after: 'terms' }, sol,
      ['Substitute into ' + t('S_n=\\dfrac{t_1(r^n-1)}{r-1}') + ' and isolate the power ' + t('r^n') + '.', 'Find the exponent by trial or with a calculator table.'], text);
  }

  var QUESTIONS = [
    { num: '1', section: 'Assignment', stem: 'Determine each sum. Give exact answers unless told otherwise.', parts: [
      { id: '1a', level: 'BEG', make: function (r) { return sumIntP(r, [{ t1: 7, r: 3, n: 12 }, { t1: 2, r: 5, n: 8 }, { t1: 5, r: 2, n: 5 }]); } },
      { id: '1b', level: 'EMG', make: function (r) { return sumUnitFracP(r, [{ t1: 640, q: 2, n: 10 }, { t1: 128, q: 4, n: 7 }]); } },
      { id: '1c', level: 'EMG', make: function (r) { return sumNegP(r, [{ t1: 2, r: -3, n: 8 }, { t1: 1, r: -4, n: 7 }]); } },
      { id: '1d', level: 'PRG', make: function (r) { return sumFracStartP(r, [{ c: 1, b: 3, j: 2, n: 6 }]); } },
      { id: '1e', level: 'PRG', make: function (r) { return sumDecRoundP(r, [{ t1: 50, r: 1.2, n: 12 }], 1); } },
      { id: '1f', level: 'ADV', make: function (r) { return sumNegFracP(r, [{ p: 2, q: 3, j: 4, s: -1, c: 1, n: 8 }]); } }] },
    { num: '2', stem: 'Determine each sum.', parts: [
      { id: '2a', level: 'BEG', make: function (r) { return lastP(r, 'up', [{ t1: [5, 1], r: [2, 1], n: 11 }, { t1: [3, 1], r: [4, 1], n: 7 }], 'sum to a last term, r whole'); } },
      { id: '2b', level: 'EMG', make: function (r) { return lastP(r, 'down', [{ t1: [2187, 1], r: [1, 3], n: 8 }], 'sum to a last term, r = 1/b'); } },
      { id: '2c', level: 'PRG', make: function (r) { return lastP(r, 'neg', [{ t1: [-2, 1], r: [-3, 1], n: 7 }], 'sum to a last term, negative r'); } },
      { id: '2d', level: 'PRG', make: function (r) { return lastP(r, 'dec', [{ t1: [1, 5], r: [3, 1], n: 7 }], 'sum to a last term, decimal terms'); } }] },
    { num: '3', shared: function (r) { return pickWhere(function () { return { a: r.int(2, 9), r: -r.int(2, 3), n: r.int(8, 11) }; }, function (z) { return !(z.a === 5 && z.r === -2 && z.n === 10) && Math.abs(qv(gsum(z.a, z.r, z.n))) < 2e6; }); },
      stem: function (z) { return 'A geometric sequence has general term ' + t('t_n=' + z.a + '(' + z.r + ')^{n-1}') + '.'; }, parts: [
        { id: '3a', level: 'BEG', make: function (r, z) {
          var T = first(z.a, z.r, 3);
          return fieldsP('Write the first three terms.', T.map(function (x, i) { return fNum(t('t_{' + (i + 1) + '}='), x, { cands: i ? [[term(z.a, z.r, i + 2), 'u1l7-day-off', 'That is ' + t('t_{' + (i + 2) + '}') + ': for ' + t('t_{' + (i + 1) + '}') + ' the exponent is ' + t(i) + '.'], [qm(-1, x), 'sign', 'Check the sign: a negative ratio makes the signs alternate.']] : [] }); }),
            t(T.map(function (x) { return qtex(x); }).join(',\\ ')), T.map(function (x, i) { return t('t_{' + (i + 1) + '}=' + z.a + '(' + z.r + ')^{' + i + '}=' + qtex(x)); }).join('<br>'),
            ['Substitute ' + t('n=1,\\ 2,\\ 3') + '. Remember ' + t('(' + z.r + ')^{0}=1') + '.'], 'first three terms from tₙ');
        } },
        { id: '3b', level: 'EMG', make: function (r, z) {
          var S = gsum(z.a, z.r, z.n);
          return exactP('Determine the sum of the first ' + t(z.n) + ' terms.', S, { cands: sumCands(z.a, z.r, z.n) }, t('t_1=' + z.a + ',\\ r=' + z.r) + '<br>' + t(sumLine(z.a, z.r, z.n)), HS, 'Sₙ from the general term');
        } }] },
    { num: '4', parts: [{ id: '4', level: 'PRG', make: function (r) {
      var z = pickWhere(function () { return { t1: r.int(2, 9), r: r.int(2, 4), k: r.int(2, 4), n: r.int(6, 9) }; }, function (z) { return qv(gsum(z.t1, z.r, z.n)) < 5e6 && !isBk(z, [{ t1: 20, r: 3, k: 4, n: 8 }, { t1: 8, r: 3, k: 3, n: 8 }]); });
      var tk = qv(term(z.t1, z.r, z.k)), S = gsum(z.t1, z.r, z.n);
      return exactP('In a geometric sequence, ' + t('t_{' + z.k + '}=' + F(tk)) + ' and ' + t('r=' + z.r) + '. Determine the sum of the first ' + t(z.n) + ' terms.', S,
        { cands: [[gsum(tk, z.r, z.n), 'u1l7-tk-as-t1', t('t_{' + z.k + '}') + ' is not the first term. Find ' + t('t_1') + ' first: ' + t('t_1r^{' + (z.k - 1) + '}=' + F(tk)) + '.'],
          [gsum(Q(tk, Math.pow(z.r, z.k)), z.r, z.n), 'u1l7-t1-power', 'From ' + t('t_1') + ' to ' + t('t_{' + z.k + '}') + ' is ' + t(z.k - 1) + ' steps, so divide by ' + t('r^{' + (z.k - 1) + '}') + '.']].concat(sumCands(z.t1, z.r, z.n)) },
        t('t_1(' + z.r + ')^{' + (z.k - 1) + '}=' + F(tk) + '\\ \\Rightarrow\\ t_1=' + z.t1) + '<br>' + t(sumLine(z.t1, z.r, z.n)), ['Find ' + t('t_1') + ' first: ' + t('t_{' + z.k + '}=t_1r^{' + (z.k - 1) + '}') + '.', HS[0]], 'Sₙ from a term and r');
    } }] },
    { num: '5', parts: [{ id: '5', level: 'PRG', make: function (r) {
      var z = pickWhere(function () { return { t1: r.int(2, 9), r: r.int(2, 4), n: r.int(4, 7) }; }, function (z) { return qv(gsum(z.t1, z.r, z.n)) < 1e6 && !isBk(z, [{ t1: 5, r: 3, n: 6 }]); });
      var S = gsum(z.t1, z.r, z.n), c = qd(qs(qp(z.r, z.n), 1), qs(z.r, 1));
      return exactP('A geometric series has ' + t('r=' + z.r) + ' and ' + t('S_{' + z.n + '}=' + qtex(S)) + '. Determine ' + t('t_1') + '.', [z.t1, 1],
        { cands: [[qd(S, qs(qp(z.r, z.n), 1)), 'u1l7-solve', 'Don’t forget the denominator ' + t('r-1=' + (z.r - 1)) + ': ' + t('\\dfrac{t_1(' + z.r + '^{' + z.n + '}-1)}{' + (z.r - 1) + '}=' + qtex(c) + 't_1') + '.'], [qd(S, qp(z.r, z.n)), 'u1l7-solve', 'Substitute into the whole formula ' + t('S_n=\\dfrac{t_1(r^n-1)}{r-1}') + ' and solve for ' + t('t_1') + '.'], [qd(S, qp(z.r, z.n - 1)), 'u1l7-solve', 'That treats ' + t('S_{' + z.n + '}') + ' as a term. Use the sum formula.']] },
        t('\\dfrac{t_1(' + z.r + '^{' + z.n + '}-1)}{' + z.r + '-1}=' + qtex(S) + '\\ \\Rightarrow\\ ' + qtex(c) + 't_1=' + qtex(S) + '\\ \\Rightarrow\\ t_1=' + z.t1), ['Substitute ' + t('r') + ' and ' + t('n') + ' into the sum formula: it becomes (a number) ' + t('\\times\\,t_1') + '.'], 't₁ from r and Sₙ');
    } }] },
    { num: '6', parts: [{ id: '6', level: 'PRG', make: function (r) {
      var z = pickWhere(function () { return { k: r.int(4, 7), a: r.int(2, 6), r: r.pick([2, 2, 3]) }; }, function (z) { return z.a * Math.pow(z.r, z.k - 1) <= 500 && !isBk(z, [{ k: 6, a: 3, r: 2 }]); });
      var L = z.a * Math.pow(z.r, z.k - 1), S = gsum(z.a, z.r, z.k), thing = r.pick([['carpenter cuts a board', 'pieces', 'piece', 'board', 'cm'], ['plumber cuts a pipe', 'pieces', 'piece', 'pipe', 'cm'], ['tailor cuts a ribbon', 'strips', 'strip', 'ribbon', 'cm']]);
      return exactP('A ' + thing[0] + ' into ' + t(z.k) + ' ' + thing[1] + ' whose lengths form a geometric sequence. The shortest ' + thing[2] + ' is ' + t(z.a) + ' cm and the longest is ' + t(L) + ' cm. How long was the ' + thing[3] + '?', S,
        { after: 'cm', cands: [[z.k * (z.a + L) / 2, 'u1l7-arith', 'That uses the arithmetic sum ' + t('\\dfrac{n}{2}(t_1+t_n)') + '. The lengths are <b>geometric</b>: find ' + t('r') + ' from ' + t(z.a + 'r^{' + (z.k - 1) + '}=' + L) + '.'], [z.a + L, 'u1l7-sum-pieces', 'Add <b>all</b> ' + t(z.k) + ' ' + thing[1] + ', not just the shortest and longest.']].concat(sumCands(z.a, z.r, z.k)) },
        t(z.a + 'r^{' + (z.k - 1) + '}=' + L + '\\ \\Rightarrow\\ r^{' + (z.k - 1) + '}=' + Math.pow(z.r, z.k - 1) + '\\ \\Rightarrow\\ r=' + z.r) + '<br>' + t(sumLine(z.a, z.r, z.k)) + ' cm',
        ['The longest piece is ' + t('t_{' + z.k + '}') + ': ' + t(z.a + 'r^{' + (z.k - 1) + '}=' + L) + '. Find ' + t('r') + '.', 'The whole length is the sum of all ' + t(z.k) + ' pieces.'], 'pieces in a geometric sequence');
    } }] },
    { num: '7', parts: [
      { id: '7a', level: 'EMG', make: function (r) { return howManyP(r, false, [{ t1: 4, r: 5, n: 6 }, { t1: 7, r: 2, n: 10 }], 'how many terms'); } },
      { id: '7b', level: 'PRG', make: function (r) { return howManyP(r, true, [{ t1: -4, r: 3, n: 7 }], 'how many terms, negative terms'); } },
      { id: '7c', level: 'MAS', make: function (r) {
        var z = pickWhere(function () { return { t1: r.int(2, 6), r: -r.int(2, 3), n: r.int(6, 9) }; }, function (z) { return Math.abs(qv(term(z.t1, z.r, z.n))) < 2e5 && !isBk(z, [{ t1: 5, r: -2, n: 8 }, { t1: 4, r: -2, n: 9 }]); });
        var S = gsum(z.t1, z.r, z.n), tn = term(z.t1, z.r, z.n), num = qm(S, qs(z.r, 1)), pw = qd(tn, z.t1);
        var sol = t('t_1=' + z.t1 + ',\\ r=' + z.r + ':\\quad \\dfrac{' + z.r + 't_n-' + z.t1 + '}{' + z.r + '-1}=' + qtex(S)) + '<br>' + t(z.r + 't_n-' + z.t1 + '=' + qtex(num) + '\\ \\Rightarrow\\ t_n=' + qtex(tn)) + '<br>' +
          t(z.t1 + '(' + z.r + ')^{n-1}=' + qtex(tn) + '\\ \\Rightarrow\\ (' + z.r + ')^{n-1}=' + qtex(pw) + '=(' + z.r + ')^{' + (z.n - 1) + '}') + ', so ' + t('n-1=' + (z.n - 1)) + ' and ' + t('n=' + z.n) + ' terms.';
        return fieldsP('The series ' + t(seriesTex(first(z.t1, z.r, 3))) + ' has a sum of ' + t(qtex(S)) + '. Determine the last term and the number of terms.',
          [fNum('last term ' + t('t_n='), tn, { cands: [[qm(-1, tn), 'sign', 'Check the sign of the last term: solve ' + t(z.r + 't_n-' + z.t1 + '=' + qtex(num)) + ' carefully.'], [qd(qs(qm(S, qs(z.r, 1)), z.t1), z.r), 'u1l7-solve', 'Multiply both sides by ' + t('r-1=' + (z.r - 1)) + ', then <b>add</b> ' + t(z.t1) + ' before dividing by ' + t(z.r) + '.']], name: 'last term' }),
            fNum('number of terms ' + t('n='), [z.n, 1], { cands: [[z.n - 1, 'u1l7-n-off', t('(' + z.r + ')^{n-1}=(' + z.r + ')^{' + (z.n - 1) + '}') + ' gives ' + t('n-1=' + (z.n - 1)) + ', so ' + t('n=' + z.n) + '.']], name: 'n' })],
          t('t_n=' + qtex(tn) + ',\\ n=' + z.n), sol, ['Use ' + t('S_n=\\dfrac{rt_n-t_1}{r-1}') + ' and solve for ' + t('t_n') + '.', 'Then solve ' + t('t_1r^{n-1}=t_n') + ' for ' + t('n') + '.'], 'last term and n from the sum');
      } }] },
    { num: '8', parts: [
      { id: '8a', level: 'ADV', make: function (r) {
        var z = pickWhere(function () { return { a: r.int(2, 6), m: r.int(2, 7) }; }, function (z) { return !isBk(z, [{ a: 6, m: 4 }, { a: 2, m: 5 }]); });
        var c = 1 + z.m + z.m * z.m, S3 = z.a * c, r2 = -(z.m + 1);
        var sol = t(z.a + '+' + z.a + 'r+' + z.a + 'r^{2}=' + S3 + '\\ \\Rightarrow\\ r^{2}+r+1=' + c + '\\ \\Rightarrow\\ r^{2}+r-' + (c - 1) + '=0') + '<br>' + t('(r+' + (z.m + 1) + ')(r-' + z.m + ')=0\\ \\Rightarrow\\ r=' + z.m + '\\ \\text{or}\\ r=' + r2) + '<br>Check: ' + t(z.a + '+' + z.a * z.m + '+' + z.a * z.m * z.m + '=' + S3) + '; ' + t(z.a + '-' + z.a * (z.m + 1) + '+' + z.a * r2 * r2 + '=' + S3) + '.';
        return fieldsP('A geometric series has ' + t('t_1=' + z.a) + ' and ' + t('S_3=' + S3) + '. Determine all possible values of ' + t('r') + '.',
          [{ label: t('r='), key: String(z.m) }, { label: t('r='), key: String(r2), before: 'or' }], t('r=' + z.m + '\\ \\text{or}\\ r=' + r2), sol,
          ['Write ' + t('S_3=t_1+t_1r+t_1r^{2}') + ' and divide by ' + t('t_1') + '.', 'You get a quadratic in ' + t('r') + ': factor it. Both roots work.'], 'all values of r from S₃',
          { check: cSet([[z.m, 1], [r2, 1]], { oneHint: 'One value is right. The quadratic has a second root, and it works too (check it).' }), bad: [[String(z.m), String(z.m + 1)], [String(-z.m), String(z.m + 1)]], good: [[String(r2), String(z.m)]] });
      } },
      { id: '8b', level: 'ADV', make: function (r) {
        var z = pickWhere(function () { return { t1: r.int(2, 10), r: r.int(2, 5), n: 5 }; }, function (z) { return !isBk(z, [{ t1: 10, r: 4, n: 5 }, { t1: 4, r: 3, n: 6 }]); });
        var S = gsum(z.t1, z.r, z.n), t3 = term(z.t1, z.r, 3), rows = [z.r - 1, z.r].filter(function (x) { return x >= 2; }).map(function (x) { return 'r=' + x + ':\\ ' + qtex(gsum(z.t1, x, z.n)); });
        return fieldsP('A geometric series has ' + t('t_1=' + z.t1) + ' and ' + t('S_{' + z.n + '}=' + qtex(S)) + '. Use a table to determine ' + t('r') + ' (' + t('r>0') + ') and then ' + t('t_3') + '.',
          [fNum(t('r='), [z.r, 1], { cands: [[z.r - 1, 'u1l7-r-not-int', t('r=' + (z.r - 1)) + ' gives ' + t(qtex(gsum(z.t1, z.r - 1, z.n))) + ' — too small.'], [z.r + 1, 'u1l7-r-not-int', t('r=' + (z.r + 1)) + ' gives ' + t(qtex(gsum(z.t1, z.r + 1, z.n))) + ' — too big.']] }),
            fNum(t('t_3='), t3, { cands: [[term(z.t1, z.r, 4), 'u1l7-day-off', t('t_3=t_1r^{2}') + ' (two steps from ' + t('t_1') + ').'], [gsum(z.t1, z.r, 3), 'u1l7-gave-sums', 'That is ' + t('S_3') + '. The question asks for the term ' + t('t_3') + '.']] })],
          t('r=' + z.r + ',\\ t_3=' + qtex(t3)), 'Table of ' + t('Y_1=\\dfrac{' + z.t1 + '(X^{' + z.n + '}-1)}{X-1}') + ': ' + t(rows.join(';\\quad ')) + '.<br>So ' + t('r=' + z.r) + ' and ' + t('t_3=' + z.t1 + '(' + z.r + ')^{2}=' + qtex(t3)) + '.',
          ['Put ' + t('Y_1=\\dfrac{' + z.t1 + '(X^{' + z.n + '}-1)}{X-1}') + ' in a calculator table and look for ' + t(qtex(S)) + '.'], 'r from a table, then t₃');
      } }] },
    { num: '9', shared: function (r) { return pickWhere(function () { return { a: r.int(2, 6), b: r.int(2, 5), k: r.int(7, 9) }; }, function (z) { return !isBk({ a: z.a, b: z.b }, [{ a: 2, b: 5 }, { a: 3, b: 4 }]) && z.a * Math.pow(z.b, z.k) < 1e8; }); },
      stem: function (z) { return 'The sum of the first ' + t('n') + ' terms of a series is ' + t('S_n=' + z.a + '(' + z.b + '^{n}-1)') + '.'; }, parts: [
        { id: '9a', level: 'PRG', make: function (r, z) {
          var S = function (n) { return z.a * (Math.pow(z.b, n) - 1); }, T = [1, 2, 3, 4].map(function (n) { return n === 1 ? S(1) : S(n) - S(n - 1); });
          return fieldsP('Determine the first four terms.', T.map(function (x, i) { return fNum(t('t_{' + (i + 1) + '}='), [x, 1], { cands: i ? [[S(i + 1), 'u1l7-gave-sums', 'That is ' + t('S_{' + (i + 1) + '}') + ', the sum of the first ' + t(i + 1) + ' terms. Subtract: ' + t('t_{' + (i + 1) + '}=S_' + (i + 1) + '-S_' + i) + '.']] : [] }); }),
            t(T.join(',\\ ')), t('S_1=' + F(S(1)) + ',\\ S_2=' + F(S(2)) + ',\\ S_3=' + F(S(3)) + ',\\ S_4=' + F(S(4))) + '<br>' + t('t_1=S_1=' + F(T[0]) + ',\\ t_2=S_2-S_1=' + F(T[1]) + ',\\ t_3=S_3-S_2=' + F(T[2]) + ',\\ t_4=S_4-S_3=' + F(T[3])) + ' (' + t('r=' + z.b) + ').',
            ['Find ' + t('S_1,\\ S_2,\\ S_3,\\ S_4') + ' first.', t('t_1=S_1') + ' and ' + t('t_n=S_n-S_{n-1}') + '.'], 'terms from an Sₙ formula');
        } },
        { id: '9b', level: 'ADV', make: function (r, z) {
          var S = function (n) { return z.a * (Math.pow(z.b, n) - 1); }, tk = S(z.k) - S(z.k - 1);
          return exactP('Determine ' + t('t_{' + z.k + '}') + ' (you can check it a second way).', [tk, 1], { cands: [[S(z.k), 'u1l7-gave-sums', 'That is ' + t('S_{' + z.k + '}') + '. The term is ' + t('t_{' + z.k + '}=S_' + z.k + '-S_' + (z.k - 1)) + '.'], [z.a * (z.b - 1) * Math.pow(z.b, z.k), 'u1l7-day-off', 'Check the power: ' + t('t_{' + z.k + '}=t_1r^{' + (z.k - 1) + '}') + '.'], [S(z.k - 1), 'u1l7-gave-sums', 'That is ' + t('S_{' + (z.k - 1) + '}') + '.']] },
            t('t_{' + z.k + '}=S_' + z.k + '-S_' + (z.k - 1) + '=' + F(S(z.k)) + '-' + F(S(z.k - 1)) + '=' + F(tk)) + '<br>Second way: ' + t('t_1=' + F(S(1)) + ',\\ r=' + z.b) + ', so ' + t('t_{' + z.k + '}=' + F(S(1)) + '(' + z.b + ')^{' + (z.k - 1) + '}=' + F(tk)) + '.',
            [t('t_n=S_n-S_{n-1}') + '.'], 'a term from an Sₙ formula');
        } }] },
    { num: '10', shared: function (r) { return pickWhere(function () { return { c: r.pick([1, 2, 3, 4, 5, 6, 8, 10]), k: r.int(10, 13), T: r.pick([500, 1000, 2000, 5000]), name: r.pick(['Jonah', 'Priya', 'Mateo', 'Ava', 'Kenji', 'Nora']) }; },
        function (z) { var n = 1; while (z.c * (Math.pow(2, n) - 1) <= z.T * 100) n++; z.d = n; return !(z.c === 5 && z.k === 12 && z.T === 1000) && n > z.k && n <= 20; }); },
      stem: function (z) { return z.name + ' puts ' + t(z.c) + ' cent' + (z.c > 1 ? 's' : '') + ' in a jar on day 1, ' + t(2 * z.c) + ' cents on day 2, ' + t(4 * z.c) + ' cents on day 3, and keeps doubling the amount each day.'; }, parts: [
        { id: '10a', level: 'EMG', make: function (r, z) {
          var cents = z.c * Math.pow(2, z.k - 1);
          return exactP('How much, in dollars, does ' + z.name + ' put in on day ' + t(z.k) + '?', Q(cents, 100), { before: '$', money: true, cands: [[Q(cents * 2, 100), 'u1l7-day-off', 'Day ' + t(z.k) + ' is ' + t('t_{' + z.k + '}=' + z.c + '(2)^{' + (z.k - 1) + '}') + ' — the exponent is one less than the day.'], [cents, 'u1l7-cents', 'That is in cents. Divide by ' + t('100') + ' for dollars.'], [Q(z.c * (Math.pow(2, z.k) - 1), 100), 'u1l7-gave-term', 'That is the total in the jar. The question asks for the amount on day ' + t(z.k) + ' only.']] },
            t('t_{' + z.k + '}=' + z.c + '(2)^{' + (z.k - 1) + '}=' + F(cents)) + ' cents ' + t('=' + money(cents / 100)), ['The amounts form a geometric sequence with ' + t('t_1=' + z.c) + ' and ' + t('r=2') + '.', 'Work in cents, then divide by 100.'], 'amount on day k');
        } },
        { id: '10b', level: 'PRG', make: function (r, z) {
          var S = z.c * (Math.pow(2, z.k) - 1);
          return exactP('How much, in dollars, is in the jar after ' + t(z.k) + ' days?', Q(S, 100), { before: '$', money: true, cands: [[S, 'u1l7-cents', 'That is in cents. Divide by ' + t('100') + ' for dollars.'], [Q(z.c * Math.pow(2, z.k - 1), 100), 'u1l7-gave-term', 'That is only the amount on day ' + t(z.k) + '. Add all the days: ' + t('S_{' + z.k + '}') + '.'], [Q(z.c * (Math.pow(2, z.k - 1) - 1), 100), 'u1l7-exp-n-1', 'That is ' + t(z.k - 1) + ' days.'], [Q(z.c * (Math.pow(2, z.k + 1) - 1), 100), 'u1l7-count', 'That is ' + t(z.k + 1) + ' days.']] },
            t('S_{' + z.k + '}=\\dfrac{' + z.c + '(2^{' + z.k + '}-1)}{2-1}=' + F(S)) + ' cents ' + t('=' + money(S / 100)), ['The total is ' + t('S_{' + z.k + '}') + ' with ' + t('t_1=' + z.c) + ' and ' + t('r=2') + '.'], 'total after k days');
        } },
        { id: '10c', level: 'ADV', make: function (r, z) {
          var S = function (n) { return z.c * (Math.pow(2, n) - 1); };
          return exactP('On which day does the total in the jar first pass ' + t('\\$' + F(z.T)) + '?', [z.d, 1], { before: 'day', cands: [[z.d - 1, 'u1l7-day-off', 'After day ' + t(z.d - 1) + ' the total is ' + t(money(S(z.d - 1) / 100)) + ' — not over ' + t('\\$' + F(z.T)) + ' yet.'], [z.d + 1, 'u1l7-day-off', 'Check day ' + t(z.d) + ': the total is already ' + t(money(S(z.d) / 100)) + '.']] },
            'Need ' + t(z.c + '(2^{n}-1)>' + F(z.T * 100)) + ' cents.<br>Table: ' + t('S_{' + (z.d - 1) + '}=' + F(S(z.d - 1)) + ',\\ S_{' + z.d + '}=' + F(S(z.d))) + '. Day ' + t(z.d) + '.', ['Work in cents: ' + t('\\$' + F(z.T) + '=' + F(z.T * 100)) + ' cents.', 'Make a table of ' + t('S_n=' + z.c + '(2^{n}-1)') + '.'], 'first day total passes a target');
        } }] },
    { num: '11', parts: [{ id: '11', level: 'ADV', make: function (r) {
      var z = pickWhere(function () { return { t1: r.pick([20, 30, 40, 50, 60, 25, 15]), r: r.int(2, 4), n: r.int(4, 6), what: r.pick([['yeast culture', 'new cells form', 'new cells'], ['bacteria colony', 'new bacteria appear', 'new bacteria'], ['rumour', 'new people hear it', 'new people']]) }; },
        function (z) { return qv(gsum(z.t1, z.r, z.n)) < 5e5 && !isBk({ t1: z.t1, r: z.r, n: z.n }, [{ t1: 40, r: 3, n: 5 }]); });
      var S = gsum(z.t1, z.r, z.n), tn = term(z.t1, z.r, z.n), rows = [z.r - 1, z.r, z.r + 1].filter(function (x) { return x >= 2; }).map(function (x) { return 'r=' + x + ':\\ ' + qtex(gsum(z.t1, x, z.n)); });
      return fieldsP('In a ' + z.what[0] + ', ' + t(z.t1) + ' ' + z.what[1] + ' in the first hour. The numbers each hour form a geometric sequence. In the first ' + t(z.n) + ' hours, ' + t(qtex(S)) + ' ' + z.what[2] + ' appear in total. Use a table to determine ' + t('r') + ', then the number in hour ' + t(z.n) + '.',
        [fNum(t('r='), [z.r, 1]), fNum('hour ' + t(z.n) + ':', tn, { cands: [[S, 'u1l7-gave-sums', 'That is the total for all ' + t(z.n) + ' hours. The question asks for hour ' + t(z.n) + ' only: ' + t('t_{' + z.n + '}') + '.'], [term(z.t1, z.r, z.n + 1), 'u1l7-day-off', t('t_{' + z.n + '}=t_1r^{' + (z.n - 1) + '}') + '.']], name: 'hour ' + z.n })],
        t('r=' + z.r + ',\\ t_' + z.n + '=' + qtex(tn)), 'Table of ' + t('\\dfrac{' + z.t1 + '(X^{' + z.n + '}-1)}{X-1}') + ': ' + t(rows.join(';\\quad ')) + '. So ' + t('r=' + z.r) + '.<br>Hour ' + z.n + ': ' + t('t_{' + z.n + '}=' + z.t1 + '(' + z.r + ')^{' + (z.n - 1) + '}=' + qtex(tn)) + '.',
        ['The total is ' + t('S_{' + z.n + '}=\\dfrac{' + z.t1 + '(r^{' + z.n + '}-1)}{r-1}') + '. Try whole values of ' + t('r') + ' in a table.'], 'ratio from a table, then a term');
    } }] },
    { num: '12', parts: [{ id: '12', level: 'ADV', make: function (r) {
      var z = pickWhere(function () { return { r: r.int(2, 5), L: r.int(4, 7) }; }, function (z) { return qv(gsum(z.r, z.r, z.L)) < 2e5 && qv(gsum(z.r, z.r, z.L)) > 200 && !isBk(z, [{ r: 3, L: 6 }, { r: 5, L: 4 }]); });
      var S = gsum(z.r, z.r, z.L), rows = [z.r - 1, z.r, z.r + 1].filter(function (x) { return x >= 2; }).map(function (x) { return 'r=' + x + ':\\ ' + qtex(gsum(x, x, z.L)); });
      var who = r.pick([['school’s phone tree', 'principal', 'staff members'], ['team’s message chain', 'coach', 'players'], ['club’s phone tree', 'president', 'members']]);
      return exactP('In a ' + who[0] + ', the ' + who[1] + ' calls ' + t('r') + ' ' + who[2] + ', each of them calls ' + t('r') + ' others, and so on. In ' + t(z.L) + ' levels, ' + t(qtex(S)) + ' people are called. Use a table to determine ' + t('r') + '.', [z.r, 1],
        { cands: [] }, 'Level 1 has ' + t('r') + ' people, so ' + t('t_1=r') + ': ' + t('S_{' + z.L + '}=\\dfrac{r(r^{' + z.L + '}-1)}{r-1}') + '.<br>Table: ' + t(rows.join(';\\quad ')) + '.<br>Each person calls ' + t(z.r) + ' people.',
        ['The first term is ' + t('r') + ' too (level 1).', 'Table of ' + t('\\dfrac{X(X^{' + z.L + '}-1)}{X-1}') + ' for ' + t('X=2,\\ 3,\\ 4,\\ \\ldots') + '.'], 'ratio of a phone tree from a table');
    } }] },
    { num: '13', shared: function (r) {
        return pickWhere(function () { var pc = r.pick([60, 70, 75, 80, 50, 65]); return { h: r.int(5, 20), pc: pc, p: pc / 100, kb: r.int(3, 6), kh: r.int(4, 7) }; }, function (z) {
          if (z.h === 12 && z.pc === 75) return false;
          for (var k = 5; k <= 14; k++) { var a = ballTotal(z.h, z.p, k - 1), b = ballTotal(z.h, z.p, k); for (var D = Math.ceil(a + 0.3); D < b - 0.3; D++) if (D % 5 === 0 || b - a < 6) { z.D = D; z.kd = k; return true; } }
          return false;
        });
      }, stem: function (z) { return 'A ball is dropped from ' + t(z.h) + ' m. Each bounce reaches ' + t(z.pc + '\\%') + ' of the height before.'; }, parts: [
        { id: '13a', level: 'EMG', make: function (r, z) {
          var x = z.h * Math.pow(z.p, z.kb);
          return roundP('Determine the height of the ' + ord(z.kb) + ' bounce, to the nearest centimetre (in metres).', x, 2, { after: 'm', cands: [[z.h * Math.pow(z.p, z.kb - 1), 'u1l7-bounce-index', 'That is the ' + ord(z.kb - 1) + ' bounce. The 1st bounce is already ' + t(z.h + '(' + nT(z.p) + ')') + ', so the ' + ord(z.kb) + ' is ' + t(z.h + '(' + nT(z.p) + ')^{' + z.kb + '}') + '.'], [z.h * Math.pow(z.p, z.kb + 1), 'u1l7-bounce-index', 'Check the power: the ' + ord(z.kb) + ' bounce is ' + t(z.h + '(' + nT(z.p) + ')^{' + z.kb + '}') + '.']] },
            t(z.h + '(' + nT(z.p) + ')^{' + z.kb + '}\\approx ' + fxT(x, 2)) + ' m', ['Each bounce is ' + t(nT(z.p)) + ' times the one before; the 1st bounce is ' + t(z.h + '(' + nT(z.p) + ')') + '.', 'Nearest centimetre = 2 decimal places of a metre.'], 'height of the kth bounce');
        } },
        { id: '13b', level: 'ADV', make: function (r, z) {
          var x = ballTotal(z.h, z.p, z.kh);
          return roundP('Determine the total vertical distance travelled when it hits the ground for the ' + ord(z.kh) + ' time, to the nearest centimetre.', x, 2, { after: 'm', cands: ballCands(z.h, z.p, z.kh) }, ballSol(z.h, z.p, z.kh, 2),
            ['The ball travels down <b>and</b> up. At the ' + ord(z.kh) + ' hit it has fallen ' + t(z.kh) + ' times and risen ' + t(z.kh - 1) + ' times.', 'Falls start with the drop height; rises start with the first bounce height.'], 'total distance at the kth hit');
        } },
        { id: '13c', level: 'MAS', make: function (r, z) {
          var a = ballTotal(z.h, z.p, z.kd - 1), b = ballTotal(z.h, z.p, z.kd);
          return exactP('How many times has it hit the ground when its total distance first passes ' + t(z.D) + ' m?', [z.kd, 1], { after: 'times', cands: [[z.kd - 1, 'u1l7-hit-count', 'At the ' + ord(z.kd - 1) + ' hit the total is about ' + t(fxT(a, 2)) + ' m — not past ' + t(z.D) + ' m yet.'], [z.kd + 1, 'u1l7-hit-count', 'Check the ' + ord(z.kd) + ' hit: about ' + t(fxT(b, 2)) + ' m.']] },
            'Total at hit ' + t('k') + ': (falls, ' + t('k') + ' terms) + (rises, ' + t('k-1') + ' terms).<br>' + ord(z.kd - 1) + ' hit: ' + t('\\approx ' + fxT(a, 2)) + ' m; ' + ord(z.kd) + ' hit: ' + t('\\approx ' + fxT(b, 2)) + ' m.<br>The ' + ord(z.kd) + ' time.',
            ['Total at the ' + t('k') + 'th hit ' + t('=\\dfrac{' + z.h + '(1-' + nT(z.p) + '^{k})}{1-' + nT(z.p) + '}+\\dfrac{' + nT(z.h * z.p) + '(1-' + nT(z.p) + '^{k-1})}{1-' + nT(z.p) + '}') + '.', 'Try values of ' + t('k') + ' in a table.'], 'hit when the total passes a distance');
        } }] },
    { num: '14', parts: [{ id: '14', level: 'EMG', make: function (r) {
      var z = pickWhere(function () { return { t1: r.int(2, 9), r: r.int(2, 5), n: r.int(8, 12) }; }, function (z) { return z.r - 1 !== 1 && !isBk(z, [{ t1: 6, r: 3, n: 10 }]); });
      var T = seriesTex(first(z.t1, z.r, 3));
      return mcP(r, 'Which expression gives the sum of the first ' + t(z.n) + ' terms of ' + t(T) + '?', t('\\dfrac{' + z.t1 + '(' + z.r + '^{' + z.n + '}-1)}{' + (z.r - 1) + '}'),
        [{ html: t('\\dfrac{' + z.t1 + '(' + z.r + '^{' + (z.n - 1) + '}-1)}{' + (z.r - 1) + '}'), why: 'The exponent in the sum formula is ' + t('n') + ', not ' + t('n-1') + '.' },
          { html: t('\\dfrac{' + z.t1 + '(' + z.r + '^{' + z.n + '}-1)}{' + z.r + '}'), why: 'The denominator is ' + t('r-1') + ', not ' + t('r') + '.' },
          { html: t(z.t1 + '(' + z.r + ')^{' + (z.n - 1) + '}'), why: 'That is ' + t('t_{' + z.n + '}') + ', the last term — not the sum.' }],
        t('t_1=' + z.t1 + ',\\ r=' + z.r + ',\\ n=' + z.n) + ', denominator ' + t('r-1=' + (z.r - 1)) + ': ' + t('S_{' + z.n + '}=\\dfrac{' + z.t1 + '(' + z.r + '^{' + z.n + '}-1)}{' + (z.r - 1) + '}') + '.', [t('S_n=\\dfrac{t_1(r^n-1)}{r-1}') + '.'], 'MC: the sum expression');
    } }] },
    { num: '15', parts: [{ id: '15', level: 'PRG', make: function (r) {
      var z = pickWhere(function () { return { a: r.int(2, 5), b: r.int(2, 3), k: r.int(5, 7) }; }, function (z) { return !isBk(z, [{ a: 4, b: 2, k: 6 }]); });
      var S = function (n) { return z.a * (Math.pow(z.b, n) - 1); }, tk = S(z.k) - S(z.k - 1);
      return mcP(r, 'For a series, ' + t('S_n=' + z.a + '(' + z.b + '^{n}-1)') + '. The value of ' + t('t_{' + z.k + '}') + ' is', t(F(tk)),
        [{ html: t(F(S(z.k - 1))), why: 'That is ' + t('S_{' + (z.k - 1) + '}') + '. Subtract it from ' + t('S_{' + z.k + '}') + '.' }, { html: t(F(S(z.k))), why: 'That is ' + t('S_{' + z.k + '}') + ', the sum of ' + t(z.k) + ' terms.' },
          { html: t(F(tk * z.b)), why: 'That is ' + t('t_{' + (z.k + 1) + '}') + '. Use ' + t('t_{' + z.k + '}=S_' + z.k + '-S_' + (z.k - 1)) + '.' }, { html: t(F(z.a * Math.pow(z.b, z.k))), why: 'Use ' + t('t_{' + z.k + '}=S_' + z.k + '-S_' + (z.k - 1)) + '.' }],
        t('t_{' + z.k + '}=S_' + z.k + '-S_' + (z.k - 1) + '=' + F(S(z.k)) + '-' + F(S(z.k - 1)) + '=' + F(tk)), [t('t_n=S_n-S_{n-1}') + '.'], 'MC: a term from Sₙ', true);
    } }] },
    { num: '16', parts: [{ id: '16', level: 'EMG', make: function (r) {
      var z = pickWhere(function () { return { a: r.int(2, 9), n: r.int(10, 30) }; }, function (z) { return !(z.a === 3 && z.n === 20) && z.a !== z.n; });
      return mcP(r, 'A geometric series has ' + t('t_1=' + z.a) + ' and ' + t('r=1') + '. The value of ' + t('S_{' + z.n + '}') + ' is', t(z.a * z.n),
        [{ html: t(z.a), why: 'That is one term. There are ' + t(z.n) + ' terms, each equal to ' + t(z.a) + '.' }, { html: t(z.n), why: 'That is the number of terms. Each term is ' + t(z.a) + '.' },
          { html: 'undefined', why: 'The formula can’t be used (it divides by ' + t('r-1=0') + '), but the sum exists: ' + t(z.a + '+' + z.a + '+\\cdots') + '.' }],
        'Every term is ' + t(z.a) + ', so ' + t('S_{' + z.n + '}=' + z.n + '(' + z.a + ')=' + (z.a * z.n)) + '. (The formula with ' + t('r-1') + ' in the denominator can’t be used, but the sum exists.)', ['What is each term when ' + t('r=1') + '?'], 'MC: r = 1', true);
    } }] },
    { num: '17', parts: [{ id: '17', level: 'ADV', make: function (r) {
      var z = pickWhere(function () { var i = r.int(1, 3); return { t1: r.int(2, 5), r: r.int(2, 3), i: i, j: i + r.int(2, 3), n: r.int(4, 7) }; },
        function (z) { var S = qv(gsum(z.t1, z.r, z.n)); return S <= 9999 && S >= 100 && z.j <= z.n + 1 && !isBk(z, [{ t1: 2, r: 3, i: 2, j: 5, n: 6 }]); });
      var ti = qv(term(z.t1, z.r, z.i)), tj = qv(term(z.t1, z.r, z.j)), S = qv(gsum(z.t1, z.r, z.n)), st = z.j - z.i;
      return nrP('In a geometric sequence, ' + t('t_{' + z.i + '}=' + F(ti)) + ' and ' + t('t_{' + z.j + '}=' + F(tj)) + '. The sum of the first ' + t(z.n) + ' terms is _____.', S,
        { cands: [[qv(gsum(ti, z.r, z.n)), 'u1l7-tk-as-t1', t('t_{' + z.i + '}') + ' is not the first term. Find ' + t('t_1') + ' first.'], [qv(gsum(z.t1, z.r, z.n - 1)), 'u1l7-exp-n-1', 'That is ' + t(z.n - 1) + ' terms.'], [qv(term(z.t1, z.r, z.n)), 'u1l7-gave-term', 'That is ' + t('t_{' + z.n + '}') + '.']].filter(function (c) { return z.i !== 1 || c[1] !== 'u1l7-tk-as-t1'; }) },
        t('r^{' + st + '}=\\dfrac{' + F(tj) + '}{' + F(ti) + '}=' + Math.pow(z.r, st) + '\\ \\Rightarrow\\ r=' + z.r) + (z.i > 1 ? ', ' + t('t_1=' + z.t1) : '') + '.<br>' + t(sumLine(z.t1, z.r, z.n)),
        ['From ' + t('t_{' + z.i + '}') + ' to ' + t('t_{' + z.j + '}') + ' is ' + t(st) + ' steps: ' + t('r^{' + st + '}=\\dfrac{t_' + z.j + '}{t_' + z.i + '}') + '.'], 'NR: sum from two terms');
    } }] },
    { num: '18', parts: [{ id: '18', level: 'ADV', make: function (r) {
      var z = pickWhere(function () { var pp = r.pick([[3, 4], [1, 2], [2, 3], [3, 5], [4, 5]]); return { h: r.int(2, 8), pq: pp, k: r.int(4, 6) }; }, function (z) { return !(z.h === 4 && z.pq[0] === 3 && z.pq[1] === 4 && z.k === 5) && ballTotal(z.h, z.pq[0] / z.pq[1], z.k) < 99; });
      var p = z.pq[0] / z.pq[1], pt = '\\frac{' + z.pq[0] + '}{' + z.pq[1] + '}', x = ballTotal(z.h, p, z.k);
      return nrP('A ball is dropped from ' + t(z.h) + ' m. Each bounce reaches ' + t(pt) + ' of the height before. The total vertical distance it has travelled when it hits the ground for the ' + ord(z.k) + ' time, to the nearest tenth of a metre, is _____.', x,
        { dp: 1, cands: ballCands(z.h, p, z.k) }, ballSol(z.h, p, z.k, 1, '\\left(' + pt + '\\right)'), ['At the ' + ord(z.k) + ' hit: ' + t(z.k) + ' falls and ' + t(z.k - 1) + ' rises.'], 'NR: ball distance at a hit');
    } }] }
  ];

  /* =========================== Extra practice 7 =========================== */
  var EXTRA = [
    { num: '1', section: 'A. Skills', stem: 'Determine each sum. Give exact answers.', parts: [
      { id: 'e1a', level: 'BEG', make: function (r) { return sumIntP(r, [{ t1: 4, r: 3, n: 9 }, { t1: 7, r: 3, n: 12 }, { t1: 2, r: 5, n: 8 }], { text: 'sum, whole ratio (extra)' }); } },
      { id: 'e1b', level: 'EMG', make: function (r) { return sumUnitFracP(r, [{ t1: 1000, q: 2, n: 8 }, { t1: 640, q: 2, n: 10 }], { qs: [2, 2, 5, 3], text: 'sum, r = 1/q (extra)' }); } },
      { id: 'e1c', level: 'EMG', make: function (r) { return sumNegP(r, [{ t1: 2, r: -4, n: 6 }, { t1: 2, r: -3, n: 8 }], { text: 'sum, negative ratio (extra)' }); } },
      { id: 'e1d', level: 'EMG', make: function (r) {
        var z = pickWhere(function () { return { t1: Q(r.pick([1, 2, 3, 5]), r.pick([2, 4, 10])), r: r.int(2, 3), n: r.int(6, 10) }; }, function (z) { return !qint(z.t1) && !isBk(z, [{ t1: [1, 2], r: 2, n: 10 }]) && qv(gsum(z.t1, z.r, z.n)) < 1e5; });
        var S = gsum(z.t1, z.r, z.n);
        return exactP(t(seriesTex(first(z.t1, z.r, 3), { dec: true })) + ' &nbsp; Determine ' + t('S_{' + z.n + '}') + '.', S, { cands: sumCands(z.t1, z.r, z.n) }, t('t_1=' + qtex(z.t1, { dec: true }) + ',\\ r=' + z.r) + '<br>' + t(sumLine(z.t1, z.r, z.n, { dec: true })), HS, 'sum, decimal first term');
      } }] },
    { num: '2', stem: 'Determine each sum.', parts: [
      { id: 'e2a', level: 'BEG', make: function (r) { return lastP(r, 'up', [{ t1: [6, 1], r: [2, 1], n: 10 }, { t1: [5, 1], r: [2, 1], n: 11 }], 'sum to a last term (extra)'); } },
      { id: 'e2b', level: 'PRG', make: function (r) { return lastP(r, 'tenth', [{ t1: [4000, 1], r: [1, 10], n: 6 }], 'sum to a last term, r = 0.1'); } }] },
    { num: '3', parts: [{ id: 'e3', level: 'BEG', make: function (r) {
      var z = pickWhere(function () { return { t1: r.int(2, 9), r: r.int(2, 4), n: r.int(6, 9) }; }, function (z) { return qv(gsum(z.t1, z.r, z.n)) < 2e6 && !isBk(z, [{ t1: 7, r: 2, n: 8 }]); });
      var tn = term(z.t1, z.r, z.n), S = gsum(z.t1, z.r, z.n);
      return fieldsP('A geometric sequence has ' + t('t_1=' + z.t1) + ' and ' + t('r=' + z.r) + '. Determine ' + t('t_{' + z.n + '}') + ' and ' + t('S_{' + z.n + '}') + '.',
        [fNum(t('t_{' + z.n + '}='), tn, { cands: [[term(z.t1, z.r, z.n + 1), 'u1l7-day-off', t('t_n=t_1r^{n-1}') + ': the exponent is ' + t(z.n - 1) + '.'], [S, 'u1l7-gave-sums', 'That is the sum. The term is ' + t('t_{' + z.n + '}=t_1r^{' + (z.n - 1) + '}') + '.']] }),
          fNum(t('S_{' + z.n + '}='), S, { cands: sumCands(z.t1, z.r, z.n) })],
        t('t_{' + z.n + '}=' + qtex(tn) + ',\\ S_' + z.n + '=' + qtex(S)), t('t_{' + z.n + '}=' + z.t1 + '(' + z.r + ')^{' + (z.n - 1) + '}=' + qtex(tn)) + '<br>' + t(sumLine(z.t1, z.r, z.n)), [t('t_n=t_1r^{n-1}') + ' and ' + t('S_n=\\dfrac{t_1(r^n-1)}{r-1}') + '.'], 'a term and a sum');
    } }] },
    { num: '4', section: 'B. Applying', parts: [{ id: 'e4', level: 'PRG', make: function (r) { return howManyP(r, false, [{ t1: 3, r: 5, n: 6 }, { t1: 4, r: 5, n: 6 }], 'how many terms (extra)'); } }] },
    { num: '5', parts: [{ id: 'e5', level: 'PRG', make: function (r) {
      var z = pickWhere(function () { return { t1: r.int(2, 6), r: r.int(2, 3), i: 2, j: r.int(4, 5), n: r.int(6, 8) }; }, function (z) { return qv(gsum(z.t1, z.r, z.n)) < 1e6 && !isBk(z, [{ t1: 4, r: 3, i: 2, j: 5, n: 7 }, { t1: 2, r: 3, i: 2, j: 5, n: 6 }]); });
      var ti = qv(term(z.t1, z.r, z.i)), tj = qv(term(z.t1, z.r, z.j)), S = gsum(z.t1, z.r, z.n), st = z.j - z.i;
      return exactP('In a geometric sequence, ' + t('t_2=' + F(ti)) + ' and ' + t('t_{' + z.j + '}=' + F(tj)) + '. Determine ' + t('S_{' + z.n + '}') + '.', S,
        { cands: [[gsum(ti, z.r, z.n), 'u1l7-tk-as-t1', t('t_2') + ' is not the first term: ' + t('t_1=t_2\\div r') + '.']].concat(sumCands(z.t1, z.r, z.n)) },
        t('r^{' + st + '}=\\dfrac{' + F(tj) + '}{' + F(ti) + '}=' + Math.pow(z.r, st) + '\\ \\Rightarrow\\ r=' + z.r) + ', ' + t('t_1=' + F(ti) + '\\div ' + z.r + '=' + z.t1) + '.<br>' + t(sumLine(z.t1, z.r, z.n)),
        ['From ' + t('t_2') + ' to ' + t('t_{' + z.j + '}') + ' is ' + t(st) + ' steps of ' + t('r') + '.'], 'sum from two terms');
    } }] },
    { num: '6', parts: [{ id: 'e6', level: 'ADV', make: function (r) {
      var z = pickWhere(function () { return { a: r.int(2, 7), m: r.int(2, 6) }; }, function (z) { return !isBk(z, [{ a: 3, m: 5 }, { a: 6, m: 4 }, { a: 2, m: 5 }]); });
      var c = 1 + z.m + z.m * z.m, S3 = z.a * c, r2 = -(z.m + 1);
      return fieldsP('A geometric series has ' + t('t_1=' + z.a) + ' and ' + t('S_3=' + S3) + '. Determine all possible values of ' + t('r') + '.',
        [{ label: t('r='), key: String(z.m) }, { label: t('r='), key: String(r2), before: 'or' }], t('r=' + z.m + '\\ \\text{or}\\ r=' + r2),
        t(z.a + '+' + z.a + 'r+' + z.a + 'r^{2}=' + S3 + '\\ \\Rightarrow\\ r^{2}+r-' + (c - 1) + '=0\\ \\Rightarrow\\ (r+' + (z.m + 1) + ')(r-' + z.m + ')=0') + ', so ' + t('r=' + z.m) + ' or ' + t('r=' + r2) + '.',
        ['Divide ' + t('t_1+t_1r+t_1r^{2}=S_3') + ' by ' + t('t_1') + ' and factor the quadratic.'], 'all values of r (extra)',
        { check: cSet([[z.m, 1], [r2, 1]]), bad: [[String(z.m), String(z.m + 1)]], good: [[String(r2), String(z.m)]] });
    } }] },
    { num: '7', parts: [{ id: 'e7', level: 'PRG', make: function (r) {
      var z = pickWhere(function () { return { a: r.int(2, 9), b: r.int(2, 3), k: r.int(8, 11) }; }, function (z) { return !isBk(z, [{ a: 6, b: 2, k: 10 }]) && z.a * Math.pow(z.b, z.k) < 1e8; });
      var S = function (n) { return z.a * (Math.pow(z.b, n) - 1); }, T = [1, 2, 3].map(function (n) { return n === 1 ? S(1) : S(n) - S(n - 1); }), tk = S(z.k) - S(z.k - 1);
      var gc = function (i) { return i ? [[S(i + 1), 'u1l7-gave-sums', 'That is ' + t('S_{' + (i + 1) + '}') + '. Subtract: ' + t('t_{' + (i + 1) + '}=S_' + (i + 1) + '-S_' + i) + '.']] : []; };
      return fieldsP('For a series, ' + t('S_n=' + z.a + '(' + z.b + '^{n}-1)') + '. Determine the first three terms and ' + t('t_{' + z.k + '}') + '.',
        T.map(function (x, i) { return fNum(t('t_{' + (i + 1) + '}='), [x, 1], { cands: gc(i) }); }).concat([fNum(t('t_{' + z.k + '}='), [tk, 1], { cands: [[S(z.k), 'u1l7-gave-sums', 'That is ' + t('S_{' + z.k + '}') + '.']] })]),
        t(T.join(',\\ ') + ';\\ t_{' + z.k + '}=' + F(tk)), t('S_1=' + S(1) + ',\\ S_2=' + S(2) + ',\\ S_3=' + S(3)) + ': terms ' + t(T.join(',\\ ')) + '.<br>' + t('t_{' + z.k + '}=S_{' + z.k + '}-S_{' + (z.k - 1) + '}=' + F(S(z.k)) + '-' + F(S(z.k - 1)) + '=' + F(tk)),
        [t('t_1=S_1') + ', ' + t('t_n=S_n-S_{n-1}') + '.'], 'terms from an Sₙ formula (extra)');
    } }] },
    { num: '8', shared: function (r) {
        return pickWhere(function () { return { A: r.pick([20, 25, 30, 40, 50, 15]), pc: r.pick([10, 15, 20, 25]), n: r.int(8, 12), T: r.pick([1000, 1500, 2000, 2500, 3000]) }; }, function (z) {
          var g = 1 + z.pc / 100, S = function (n) { return z.A * (Math.pow(g, n) - 1) / (g - 1); }, d = 1; while (S(d) <= z.T) d++; z.d = d;
          return d > z.n && d <= 30 && S(d) - z.T > 1 && z.T - S(d - 1) > 1 && !(z.A === 25 && z.pc === 20);
        });
      }, stem: function (z) { return 'A fundraiser raises ' + t('\\$' + z.A) + ' on day 1. Each day after that it raises ' + t(z.pc + '\\%') + ' more than the day before.'; }, parts: [
        { id: 'e8a', level: 'PRG', make: function (r, z) {
          var g = 1 + z.pc / 100, x = z.A * (Math.pow(g, z.n) - 1) / (g - 1);
          return roundP('How much is raised in total in the first ' + t(z.n) + ' days, to the nearest cent?', x, 2, { before: '$', cands: [[z.A * Math.pow(g, z.n - 1), 'u1l7-gave-term', 'That is day ' + t(z.n) + ' only. Find the total ' + t('S_{' + z.n + '}') + '.'], [z.A * (Math.pow(g, z.n - 1) - 1) / (g - 1), 'u1l7-exp-n-1', 'That is ' + t(z.n - 1) + ' days.'], [z.A * (Math.pow(z.pc / 100, z.n) - 1) / (z.pc / 100 - 1), 'u1l7-ratio', t(z.pc + '\\%') + ' <b>more</b> means ' + t('r=1+' + nT(z.pc / 100) + '=' + nT(g)) + '.']] },
            t('r=' + nT(g)) + ': ' + t('S_{' + z.n + '}=\\dfrac{' + z.A + '(' + nT(g) + '^{' + z.n + '}-1)}{' + nT(g) + '-1}\\approx ' + money(x)), ['“' + z.pc + '% more each day” means ' + t('r=' + nT(g)) + '.'], 'total of a growing fundraiser');
        } },
        { id: 'e8b', level: 'ADV', make: function (r, z) {
          var g = 1 + z.pc / 100, S = function (n) { return z.A * (Math.pow(g, n) - 1) / (g - 1); };
          return exactP('On which day does the total first pass ' + t('\\$' + F(z.T)) + '?', [z.d, 1], { before: 'day', cands: [[z.d - 1, 'u1l7-day-off', 'After day ' + t(z.d - 1) + ' the total is ' + t('\\approx ' + money(S(z.d - 1))) + ' — not past ' + t('\\$' + F(z.T)) + '.'], [z.d + 1, 'u1l7-day-off', 'Check day ' + t(z.d) + ': ' + t('\\approx ' + money(S(z.d))) + '.']] },
            'Table of ' + t('S_n=\\dfrac{' + z.A + '(' + nT(g) + '^{n}-1)}{' + nT(z.pc / 100) + '}') + ': ' + t('S_{' + (z.d - 1) + '}\\approx ' + money(S(z.d - 1)) + ',\\ S_{' + z.d + '}\\approx ' + money(S(z.d))) + '. Day ' + t(z.d) + '.', ['Make a table of the totals ' + t('S_n') + '.'], 'day the total passes a target');
        } }] },
    { num: '9', parts: [{ id: 'e9', level: 'EMG', make: function (r) {
      var z = pickWhere(function () { return { a: r.int(1, 3), r: r.int(2, 3), k: r.int(6, 10) }; }, function (z) { return !(z.a === 1 && z.r === 2 && z.k === 9) && z.a * Math.pow(z.r, z.k) < 1e5; });
      var last = z.a * Math.pow(z.r, z.k), S = qv(gsum(z.a, z.r, z.k + 1));
      return mcP(r, 'The sum ' + t(seriesTex(first(z.a, z.r, 3), { last: [last, 1] })) + ' is', t(F(S)),
        [{ html: t(F(qv(gsum(z.a, z.r, z.k)))), why: 'That leaves out the last term ' + t(F(last)) + '. Use ' + t('\\dfrac{rt_n-t_1}{r-1}') + '.' }, { html: t(F(last * z.r)), why: 'That is the next term, not the sum.' },
          { html: t(F(qv(gsum(z.a, z.r, z.k + 2)))), why: 'That adds one term too many.' }, { html: t(F(S * z.r)), why: 'Divide by ' + t('r-1') + '.' }],
        t('S_n=\\dfrac{' + z.r + '(' + F(last) + ')-' + z.a + '}{' + z.r + '-1}=' + F(S)) + '.', HL, 'MC: sum to a last term', true);
    } }] },
    { num: '10', parts: [{ id: 'e10', level: 'ADV', make: function (r) {
      var z = pickWhere(function () { var pc = r.pick([50, 60, 70, 75, 80, 40]); return { h: r.int(5, 15), pc: pc, k: r.int(3, 5) }; }, function (z) { return !(z.h === 10 && z.pc === 60 && z.k === 4) && ballTotal(z.h, z.pc / 100, z.k) < 99.9; });
      var p = z.pc / 100, x = ballTotal(z.h, p, z.k);
      return nrP('A ball is dropped from ' + t(z.h) + ' m. Each bounce reaches ' + t(z.pc + '\\%') + ' of the height before. The total vertical distance it has travelled when it hits the ground for the ' + ord(z.k) + ' time, to the nearest tenth of a metre, is _____.', x,
        { dp: 1, cands: ballCands(z.h, p, z.k) }, ballSol(z.h, p, z.k, 1), ['At the ' + ord(z.k) + ' hit: ' + t(z.k) + ' falls and ' + t(z.k - 1) + ' rises.'], 'NR: ball distance (extra)');
    } }] },
    { num: '11', section: 'C. Stretch', parts: [{ id: 'e11', level: 'ADV', make: function (r) {
      var a = r.pick([3, 4, 5, 6, 7, 8, 9, 2]);
      return mcP(r, 'A geometric series has ' + t('r=-1') + ' (for example ' + t(a + '-' + a + '+' + a + '-\\cdots') + '). Which describes the values of ' + t('S_n') + ', in agreement with ' + t('S_n=\\dfrac{t_1(r^n-1)}{r-1}') + '?',
        t('S_n=t_1') + ' when ' + t('n') + ' is odd and ' + t('S_n=0') + ' when ' + t('n') + ' is even.',
        [{ html: t('S_n=0') + ' for every ' + t('n') + '.', why: 'Try ' + t('n=1') + ': ' + t('S_1=' + a) + '. Odd numbers of terms leave one ' + t('t_1') + ' over.' },
          { html: t('S_n=nt_1') + ', so the sums grow without limit.', why: 'That happens when ' + t('r=1') + '. With ' + t('r=-1') + ' the terms cancel in pairs.' },
          { html: 'The formula is undefined, so ' + t('S_n') + ' doesn’t exist.', why: 'The formula is undefined only for ' + t('r=1') + '. For ' + t('r=-1') + ' the denominator is ' + t('-2') + '.' }],
        'The terms are ' + t('t_1,\\ -t_1,\\ t_1,\\ \\ldots') + ', so ' + t('S_n=t_1') + ' when ' + t('n') + ' is odd and ' + t('0') + ' when ' + t('n') + ' is even.<br>Formula: ' + t('n') + ' odd: ' + t('\\dfrac{t_1(-1-1)}{-2}=t_1') + '; ' + t('n') + ' even: ' + t('\\dfrac{t_1(1-1)}{-2}=0') + '.',
        ['Write out ' + t('S_1,\\ S_2,\\ S_3,\\ S_4') + '.', t('(-1)^n') + ' is ' + t('-1') + ' for odd ' + t('n') + ' and ' + t('1') + ' for even ' + t('n') + '.'], 'MC: r = −1');
    } }] },
    { num: '12', parts: [{ id: 'e12', level: 'MAS', make: function (r) {
      var z = pickWhere(function () { return { a: r.int(2, 9), m: r.int(2, 4) }; }, function (z) { return !(z.a === 2 && z.m === 2); });
      var k = 1 + z.m * z.m;
      return fieldsP('A geometric series has ' + t('t_1=' + z.a) + ' and ' + t('S_4=' + k + 'S_2') + '. Determine all possible values of ' + t('r') + '.',
        [{ label: t('r='), key: String(z.m) }, { label: t('r='), key: String(-z.m), before: 'or' }], t('r=\\pm' + z.m),
        t('S_4=t_1+t_1r+r^{2}(t_1+t_1r)=S_2(1+r^{2})') + '<br>' + t('S_2(1+r^{2})=' + k + 'S_2\\ \\Rightarrow\\ r^{2}=' + (k - 1) + '\\ \\Rightarrow\\ r=\\pm ' + z.m) + '<br>Check ' + t('r=-' + z.m) + ': ' + t('S_2=' + (z.a - z.a * z.m) + ',\\ S_4=' + qtex(gsum(z.a, -z.m, 4)) + '=' + k + '(' + (z.a - z.a * z.m) + ')') + '.',
        ['Factor ' + t('S_4') + ': the last two terms are ' + t('r^{2}') + ' times the first two.'], 'r from S₄ = kS₂',
        { check: cSet([[z.m, 1], [-z.m, 1]], { oneHint: 'One value is right. ' + t('r^{2}=' + (k - 1)) + ' has two solutions — check the negative one too.' }), bad: [[String(z.m), String(k - 1)], [String(k - 1), String(1 - k)]], good: [[String(-z.m), String(z.m)]] });
    } }] },
    { num: '13', parts: [{ id: 'e13', level: 'MAS', make: function (r) {
      var z = pickWhere(function () { return { P: r.pick([500, 1000, 1500, 2000, 2500]), i: r.pick([3, 4, 5, 6, 2.5, 3.5]), n: r.int(8, 15), who: r.pick(['Ava', 'Liam', 'Sofia', 'Noah', 'Maya']) }; }, function (z) { return !(z.P === 1000 && z.i === 5 && z.n === 10); });
      var g = 1 + z.i / 100, t1 = z.P * g, x = t1 * (Math.pow(g, z.n) - 1) / (g - 1);
      return roundP(z.who + ' deposits ' + t('\\$' + F(z.P)) + ' at the start of each year into an account paying ' + t(nT(z.i) + '\\%') + ' per year, compounded annually. Write the value at the end of ' + t(z.n) + ' years as a geometric series and find its sum, to the nearest cent.', x, 2,
        { before: '$', cands: [[z.P * (Math.pow(g, z.n) - 1) / (g - 1), 'u1l7-annuity-shift', 'Deposits are made at the <b>start</b> of each year, so even the last deposit earns one year of interest: the first term is ' + t(F(z.P) + '(' + nT(g) + ')') + '.'], [z.P * Math.pow(g, z.n), 'u1l7-gave-term', 'That is only the first deposit after ' + t(z.n) + ' years. Add the growth of every deposit.'], [z.P * z.n, 'u1l7-sum-pieces', 'That ignores the interest.']] },
        'The last deposit grows 1 year, the first grows ' + t(z.n) + ' years:<br>' + t(F(z.P) + '(' + nT(g) + ')+' + F(z.P) + '(' + nT(g) + ')^{2}+\\cdots+' + F(z.P) + '(' + nT(g) + ')^{' + z.n + '}') + ', with ' + t('t_1=' + nT(t1) + ',\\ r=' + nT(g) + ',\\ n=' + z.n) + '.<br>' + t('S_{' + z.n + '}=\\dfrac{' + nT(t1) + '(' + nT(g) + '^{' + z.n + '}-1)}{' + nT(z.i / 100) + '}\\approx ' + money(x)),
        ['Follow each deposit to the end: the one made at the start of the last year grows once, the first grows ' + t(z.n) + ' times.', t('r=1+' + nT(z.i / 100)) + '.'], 'value of yearly deposits');
    } }] },
    { num: '14', shared: function (r) {
        return pickWhere(function () { var g1 = r.pick([1, 2, 3]), rr = r.int(2, 3), m = r.int(6, 9); return { a: r.int(5, 20), b: r.int(2, 9), g1: g1, r: rr, m: m }; }, function (z) {
          var last = z.g1 * Math.pow(z.r, z.m - 1); return last < 5000 && z.b !== z.g1 * z.r && z.b * z.b !== z.a * z.g1 && Math.abs(z.b / z.a - z.g1 / z.b) > 0.01 && z.b / z.a !== z.r && !(z.a === 10 && z.b === 3);
        });
      }, stem: function (z) { return 'Consider ' + t(z.a + '+' + z.b + '+' + seriesTex(first(z.g1, z.r, 3), { last: [z.g1 * Math.pow(z.r, z.m - 1), 1] })) + '.'; }, parts: [
        { id: 'e14a', level: 'PRG', make: function (r, z) {
          return mcP(r, 'Why can’t the geometric series formula be used directly on the whole sum?', 'The ratios of consecutive terms are not all equal: ' + t('\\frac{' + z.b + '}{' + z.a + '}') + ' and ' + t('\\frac{' + z.g1 + '}{' + z.b + '}') + ' are not ' + t(z.r) + ', so only the part starting at ' + t(z.g1) + ' is geometric.',
            [{ html: 'The series has too many terms for the formula.', why: 'The formula works for any number of terms. Check the ratio between each pair of neighbours.' },
              { html: 'The formula only works when the first term is 1.', why: 'Any first term works. The problem is that the ratio isn’t constant at the start.' },
              { html: 'The last term is not a whole number of steps from the first, so ' + t('n') + ' can’t be found.', why: 'The real problem: the first two terms don’t follow the same ratio as the rest.' }],
            t('\\frac{' + z.b + '}{' + z.a + '}\\ne ' + z.r) + ' and ' + t('\\frac{' + z.g1 + '}{' + z.b + '}\\ne ' + z.r) + ', but from ' + t(z.g1) + ' on each term is ' + t(z.r) + ' times the one before. Only ' + t(seriesTex(first(z.g1, z.r, 2), { last: [z.g1 * Math.pow(z.r, z.m - 1), 1] })) + ' is geometric.', ['Divide each term by the one before it.'], 'why the formula can’t be used directly');
        } },
        { id: 'e14b', level: 'MAS', make: function (r, z) {
          var last = z.g1 * Math.pow(z.r, z.m - 1), Sg = qv(gsum(z.g1, z.r, z.m)), S = z.a + z.b + Sg;
          return exactP('Determine the sum.', [S, 1], { cands: [[Sg, 'u1l7-sum-pieces', 'That is the geometric part only. Add the first two terms, ' + t(z.a) + ' and ' + t(z.b) + '.'], [qv(gsum(z.a, z.r, z.m + 2)), 'u1l7-whole-formula', 'The whole series isn’t geometric. Sum the geometric part, then add the other two terms.'], [z.a + z.b + Sg - z.g1, 'u1l7-sum-pieces', 'Include the first term ' + t(z.g1) + ' of the geometric part.']] },
            'Geometric part: ' + t('\\dfrac{' + z.r + '(' + F(last) + ')-' + z.g1 + '}{' + z.r + '-1}=' + F(Sg)) + '.<br>Sum ' + t('=' + z.a + '+' + z.b + '+' + F(Sg) + '=' + F(S)) + '.', ['Use ' + t('\\dfrac{rt_n-t_1}{r-1}') + ' on the geometric part only.'], 'sum of a partly geometric series');
        } }] },
    { num: '15', parts: [{ id: 'e15', level: 'ADV', make: function (r) {
      var z = pickWhere(function () { return { a: r.int(2, 6), r: r.int(2, 5) }; }, function (z) { return (z.a * (z.r * z.r - 1)) % 2 === 0 && !(z.a === 2 && z.r === 4); });
      var t3 = z.a * z.r * z.r, d = (t3 - z.a) / 2, SA = 4 * z.a + 6 * d, SG = qv(gsum(z.a, z.r, 4));
      return fieldsP('A sequence has ' + t('t_1=' + z.a) + ' and ' + t('t_3=' + t3) + ', and all its terms are positive. Find the sum of the first four terms if the sequence is (a) arithmetic, (b) geometric.',
        [fNum('(a) arithmetic:', [SA, 1], { cands: [[SG, 'u1l7-arith', 'That is the geometric sum. For the arithmetic one, ' + t('2d=' + t3 + '-' + z.a) + '.']], name: 'arithmetic' }), fNum('(b) geometric:', [SG, 1], { cands: [[SA, 'u1l7-arith', 'That is the arithmetic sum. For the geometric one, ' + t('r^{2}=' + (z.r * z.r)) + '.'], [qv(gsum(z.a, -z.r, 4)), 'u1l7-neg-r', 'All terms are positive, so take the positive ratio ' + t('r=' + z.r) + '.']], name: 'geometric' })],
        t('(a)\\ ' + SA + ';\\ (b)\\ ' + SG), '(a) ' + t('2d=' + t3 + '-' + z.a + '\\ \\Rightarrow\\ d=' + d) + ': ' + t(z.a + '+' + (z.a + d) + '+' + t3 + '+' + (t3 + d) + '=' + SA) + '.<br>(b) ' + t('r^{2}=' + (z.r * z.r) + '\\ \\Rightarrow\\ r=' + z.r) + ' (positive terms): ' + t(z.a + '+' + z.a * z.r + '+' + t3 + '+' + t3 * z.r + '=' + SG) + '.',
        ['Arithmetic: ' + t('t_3=t_1+2d') + '. Geometric: ' + t('t_3=t_1r^{2}') + '.'], 'arithmetic vs geometric sums');
    } }] }
  ];

  HW.defineLesson({ id: LID, unit: 1, num: '7', title: 'Geometric Series', outcome: 'RF10', questions: QUESTIONS, extra: EXTRA });
})(window);
